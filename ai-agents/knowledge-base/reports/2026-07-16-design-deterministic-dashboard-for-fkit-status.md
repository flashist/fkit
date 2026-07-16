# Design — the deterministic dashboard generator for `/fkit-status`

**Date:** 2026-07-16
**Author:** fkit-architect, with the owner present
**Task:** [`design-deterministic-dashboard-for-fkit-status.md`](../../tasks/done/design-deterministic-dashboard-for-fkit-status.md)
**Blocks:** `build-deterministic-dashboard-script-for-fkit-status` — **this spec is the contract that task builds against.**

> **This is a design, not an implementation.** No script is written here. Every one of the task's six
> items carries a **decision**, ruled by the owner on 2026-07-16 (items 1 and 5 explicitly; items 2, 3,
> 4, 6 ratified as recommended).

---

## 1. Goal & context

`/fkit-status` step 4 is today **prose instructions the producer LLM follows to hand-build a table**
(`claude/skills/fkit-status/SKILL.md:149-206`) — Status · # · Task · Filename · Next step, plus a
one-line roll-up. The skill's own text spends a block worrying the LLM miscounts rows or fails to sum
to `M` (`:198-201`) — **the exact silent-wrong failure a script eliminates.**

**Success criteria:**
1. The board's mechanical content — rows, markers, counts, drift facts — is computed, not recited.
2. `counts sum to M` is **impossible to violate**, not merely instructed against.
3. Beats 2 and 6 narrate from the **same** computed facts the board renders from — they cannot
   disagree with the board or with each other.
4. The LLM cannot silently invent a `Next step` it did not derive; an underived cell is **visible**.

**Non-goal:** replacing the producer's voice. Beats 1–6 stay LLM-driven. This is a calculator, not an
author.

---

## 2. Constraints & scope

**Hard constraints, each verified against the code rather than assumed:**

| Constraint | Evidence |
|---|---|
| The script must live under `claude/` or it **cannot reach a consuming project**. | `install.sh:43` `cp -R "$TMP/src/claude" "$SHARE/claude"` — only `claude/` is copied. ADR-014 §"The fact that kills the dependency argument". |
| Whole skill **directories** are copied, so a non-`SKILL.md` file rides along. | `claude/fkit-claude-init.sh:227` `cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"` |
| **The exec bit is not guaranteed.** `install.sh:44-46` `chmod +x`'s a **hardcoded list of two names** (`fkit-claude.sh`, `fkit-claude-init.sh`). A new script gets no chmod, and rides a tarball + `cp -R` chain. | `install.sh:44-46` |
| This is the **first non-`SKILL.md` file in the skills tree**. `find claude/skills -type f ! -name 'SKILL.md'` returns nothing today. | verified 2026-07-16 |
| Zero devDependencies; suite runs on a fresh clone with no install step. | ADR-014 §Decision 4 |
| Test infrastructure lives at repo root and **never ships**. | ADR-014 §Decision 1 |
| The skill is **read-only**. The script must be too. | `SKILL.md:231` |

**In scope:** the step-4 board and roll-up; the mechanical drift facts feeding beats 2 and 6; the
script's input/output contract; its placement, runtime, and test approach.

**Out of scope — deliberately:**
- **The `Depends on:` format.** Constraining it to be machine-parseable touches every brief,
  `/fkit-task-plan`, and both movers. Decided: **not now** (§4.2).
- Beats 1–6 prose. LLM.
- Sprint resolution and the `full` keyword — stays in the skill (§5.1).
- The delta default (`SKILL.md:210-216`) — stays in the skill.

---

## 3. The decisions

| # | Item | Decision | Ruled by |
|---|---|---|---|
| 1 | Output contract | **Both**, one run, two delimited sections: `BOARD` (verbatim) + `FACTS` (narrated from). §4.1 | owner → architect's call |
| 2 | `ready` vs `after N` | **Stays LLM.** Do not touch `Depends on:`. Underived cells carry a **sentinel**. §4.2 | owner (ratified) |
| 3 | Runtime | **bash.** §4.3 | owner (ratified) |
| 4 | Placement | `claude/skills/fkit-status/dashboard.sh`, invoked **`bash <path>`**, never `./<path>`. §4.4 | owner (ratified) |
| 5 | ADR | **Yes** — a new class: the first consumer-shipped executable a skill shells out to. §4.5 | owner |
| 6 | Test | **Yes** — `node --test`, repo-root `test/`. **Widens ADR-014 §2's fenced scope** — covered by the item-5 ADR. §4.6 | owner (ratified) |

---

## 4. Proposed design

### 4.1 Output contract — one invocation, two sections

**The tension this resolves** (the task's stated reason for existing): drift facts and the terminal
next-step shapes feed **beat 6 and the roll-up clause**, not just the board. If the script computes
drift and the LLM independently re-derives it for beat 6, **they can disagree** — and the owner is
handed two accounts of the same record.

Three options were live:

- **(a) Final board text only.** The skill pastes it. But beat 6 must then re-derive drift by hand →
  the disagreement above. **Rejected.**
- **(b) Structured facts only.** The skill renders the board from them. But **rendering the table is
  where the miscounting lives** — handing it back to the LLM gives away the main prize. **Rejected.**
- **(c) Both, one run, delimited (chosen).** The script is the single source of the mechanical facts.
  The board arrives pre-rendered; beats 2 and 6 narrate from the same computed set.

**Tradeoff, stated plainly:** the script now owns a slice of prose (the roll-up's drift clause), and
`SKILL.md` gains a parse contract it must not drift from. Accepted — the alternative is two accounts
of one record.

**Format** — line-oriented text, not JSON. Bash emits it without an escaping story, and (unlike
ADR-014's `skillOverrides` map) **nothing here needs a JSON assertion** — which is what decides §4.3.

```
⟦fkit-dashboard v1⟧
⟦BOARD⟧
| Status | # | Task | Filename | Next step |
|---|---|---|---|---|
| ✅ Done | 1 | Extract the shared scaffold into `claude/` | [`extract-scaffold-into-claude.md`](../tasks/done/extract-scaffold-into-claude.md) | closed |
| 🔲 Backlog | 28 | Make launch converge `ai-agents/` additively | [`converge-ai-agents-additively-on-launch.md`](../tasks/backlog/converge-ai-agents-additively-on-launch.md) | ⟨derive: needs 26 + 27⟩ |

30 done · 7 backlog — of 37  — as recorded; drift on tasks 23, 30 — see above.
⟦FACTS⟧
total 37
count done 30
count backlog 7
drift disagreement 23 plan="✅ Done" brief="🔲 Backlog" location="done/"
drift nonconformance 12 kind="cancelled-without-reason" cell="⛔ Cancelled"
drift relocated 41 linked="../tasks/backlog/x.md" found="../tasks/done/x.md"
drift missing-brief 42 linked="../tasks/backlog/y.md"
derive 28 depends="needs 26 + 27"
derive 34 depends="none recorded"
⟦END⟧
```

- **`⟦fkit-dashboard v1⟧`** — a version marker. A skill reading an output shape it doesn't know says
  so rather than guessing.
- **`⟦BOARD⟧`** — pasted **verbatim, except the sentinel cells** (§4.2). Honest wording: *verbatim
  except the marked cells* — not "verbatim".
- **`⟦FACTS⟧`** — one record per line, `kind key=value`. Beats 2 and 6 narrate from these and **never
  re-derive them from the files**.

### 4.2 The Next-step boundary — and the sentinel

Per the task's feasibility split, four of six shapes are mechanical. The script emits, in order:

1. **disagreement drift** → `waiting on owner` (the override, `SKILL.md:110-113`)
2. `✅` → `closed`
3. `⛔` → `dead`
4. `➡️` → `in Sprint N` (N from the plan cell)
5. otherwise (`🔲` / `🔄` / `🚧`) → **`⟨derive: <raw Depends on: text>⟩`**, or
   `⟨derive: none recorded⟩`

**Nonconformance does NOT take the override** — a cancelled row stays `dead`
(`SKILL.md:96-99`: *"printing `waiting on owner` on five dead rows makes a graveyard look like a
to-do list"*). The script implements the disagreement-vs-nonconformance split; it is mechanical.

**The sentinel is the design's sharpest edge, and it is deliberate.** The skill must replace each
`⟨derive: …⟩` with `ready` or `after <N>`, using the raw `Depends on:` text the sentinel carries — so
it does not re-read the brief and cannot drift from what the script saw. **A leftover sentinel in a
delivered report is a visible bug rather than a silent invention.** This column is the one
`SKILL.md:178-179` already names as *"the easiest place in the report to start making things up"*;
failing loud is the entire point.

**`Depends on:` stays free text.** Constraining it is a separate, larger convention change (every
brief + `/fkit-task-plan` + both movers) and is **not bundled here**.

### 4.3 Runtime — bash

| | bash | node |
|---|---|---|
| Product surface | fkit is a shell product | second toolchain |
| The parse | line-oriented markdown | — |
| Consumer PATH | **zero new assumption** | adds one |
| JSON assertion | not needed (§4.1 is text) | its only real edge |

**ADR-014's `node --test` precedent does not transfer.** That is about **repo-root test infra
`install.sh:43` cannot ship to consumers** — the opposite calculus from a **skill-shipped** script
that runs on a user's machine. The one argument that won node for task 23 — *the crown-jewel
assertion is a JSON assertion* — is absent here by §4.1's choice of a text format.

**Re-raise only if** the drift cross-check proves painful enough in bash to warrant it. It is a
line-oriented parse over a markdown table; it should not.

### 4.4 Placement and invocation

```
claude/skills/fkit-status/
├── SKILL.md
└── dashboard.sh        ← new; first non-SKILL.md file in the tree
```

Ships via `install.sh:43` → `fkit-claude-init.sh:227` → `.claude/skills/fkit-status/dashboard.sh` in
the consuming project. The skill invokes it from the project root:

```sh
bash .claude/skills/fkit-status/dashboard.sh <path-to-sprint-plan>
```

> **⚠️ `bash <path>`, never `./<path>` — this is load-bearing, not style.**
> `install.sh:44-46` `chmod +x`'s a **hardcoded list of two filenames**. `dashboard.sh` is not on it,
> and the exec bit rides a GitHub tarball + `cp -R` chain that does not guarantee it. Invoking through
> `bash` **sidesteps the bit entirely and needs no installer change.** An implementation that runs
> `./dashboard.sh` will fail on some consumer machines and not on the developer's — the worst
> available failure distribution. *(The alternative — extending the installer's chmod list — is a
> change to the `curl | sh` entry point, the highest-blast-radius file in the repo, for no gain.)*

### 4.5 ADR — yes

This is **the first consumer-shipped executable a skill shells out to**, a class outside ADR-014's
stated scope, and it settles precedent for: shipped-executable placement, the `bash <path>` invocation
rule and why, the consumer-side bash assumption, and **the widening of ADR-014 §2's fenced test
scope** (§4.6). Recorded via `/fkit-record-decision` (architect-owned), following this spec.

### 4.6 Test — `node --test`, repo root

**The honest flag:** ADR-014 §Decision 2 says the scope is *"exactly two things"* — the argv handed to
`claude`, and the `skillOverrides` map — and *"it stays this size"*. **A board-renderer test is
outside that fence.** This is not free; it is a deliberate widening, and it is one of the two things
the item-5 ADR exists to record.

The renderer is a **pure function** (fixture plan + briefs → expected text) — the ideal target. Bash
script, node harness: the same split as the launcher (bash, tested by `test/launcher-contract.test.js`),
consistent with ADR-014's black-box posture. `test/harness.mjs` already builds temp projects under
`os.tmpdir()` and shells out; this needs no model, no auth, no network.

---

## 5. Control & data flow

```
/fkit-status [sprint] [full]
   │
   ├─ SKILL: resolve the sprint  (argument contract, `full` keyword, ambiguity flag)   ← stays LLM
   │
   ├─ bash .claude/skills/fkit-status/dashboard.sh <sprint-plan-path>
   │     ├─ parse the plan's ## Status table          → rows
   │     ├─ resolve each brief (link → 3 dirs)        → location, relocation, missing
   │     ├─ parse each brief's ## Status, ## Sprint, Depends on:
   │     ├─ cross-check → drift facts                 (disagreement | nonconformance)
   │     ├─ next step   → 4 shapes + sentinel
   │     └─ count       → roll-up (sums to M by construction)
   │
   └─ SKILL:  beats 1–6 narrated  ← ⟦FACTS⟧ (never re-derived from the files)
              beat 7 board        ← ⟦BOARD⟧ verbatim, sentinels filled
```

### 5.1 Input contract

- **Argument:** one path to a sprint plan. **The skill resolves the sprint; the script never does.**
  The skill already owns that contract (`SKILL.md:21-34`) including the `full` keyword and the
  ambiguity flag, and it is prose-shaped. Giving the script a path keeps it a **pure function** —
  which is what makes §4.6 cheap.
- **Reads:** the sprint plan; each brief it links. Nothing else. **Not the code, not git**
  (`SKILL.md:60-65`).
- **Plan parse:** the `## Status` section's table — `Status | Priority | Task | Brief`. `M` = **row
  count** (`SKILL.md:198-201` — never a number the plan's prose quotes about itself).
- **Brief resolution:** take the link target; if absent, search `backlog/`, `done/`, `cancelled/` for
  the filename → emit `relocated` or `missing-brief`. *(This is the task-21/22 link rot, and the plan
  it parses has carried it. A script that trusts a stale link renders a broken board.)*
- **Brief parse:** `## Status` → marker + free text, **may wrap across lines** — match the marker
  prefix, not the whole line (`SKILL.md:56-57`). `## Sprint` → the sprint it claims.
- **`Depends on:`** → raw text, carried into the sentinel. **Never interpreted.**

### 5.2 Drift rules — mechanical, as the skill already states them

1. **Read the brief's `## Sprint` first.** If it names a **different** sprint than the plan → the
   status cross-check is **skipped** (`SKILL.md:83-88`). A `➡️ Moved` row's brief reads `🔲 Backlog`
   in its new sprint **correctly** — reporting it as drift *"would flag every moved row of every
   closed sprint forever, and hand the owner phantom decisions."*
2. **But do check the `➡️ Moved` target against the brief's `## Sprint`.** Disagreement → **real
   drift** (`SKILL.md:87-88`).
3. Otherwise cross-check three sources: plan cell marker · brief `## Status` marker · **location**.
   Expected location: `✅`→`done/`, `⛔`→`cancelled/`, `🔲`/`🔄`/`🚧`→`backlog/`, `➡️`→ any.
   Mismatch → **`drift disagreement`**.
4. **Nonconformance** (sources agree, marker written wrong — `SKILL.md:90-99`): `🚧` with no
   `— <reason>`; `⛔` without `(YYYY-MM-DD) — <reason>`; a marker outside the six; `➡️` without a
   target sprint.

**The script emits drift *facts* only. Disposition stays LLM** — never repair, narrate into beat 6,
carry the roll-up clause. The skill writes nothing (`SKILL.md:231`) and neither does the script.

### 5.3 Roll-up

Counts by marker, **non-zero terms only**, in vocabulary order (done · in progress · blocked ·
backlog · cancelled · moved), then **always `— of M`**. **Sums to `M` by construction** — the failure
`SKILL.md:198-201` warns about becomes unrepresentable.

Drift clause, when any drift exists — **templated, deterministic, and deliberately generic**:

```
— as recorded; drift on tasks 23, 30 — see above.
```

It points at beat 6; it does not try to be beat 6. Templating each drift kind into English is
prose-generation, which is not the script's job.

### 5.4 Failure — degrade loudly, do not wall

**Script fails (missing plan, unparseable table, bug) → the skill hand-builds the board and leads
with a flag:**

```
⚠️ [dashboard hand-built — dashboard.sh failed: <reason>]
```

**Why not hard-fail:** it matches the house precedent and the owner's own ruling. Sprint 2 task 3 —
*"Codex unreachable ⇒ emit a loudly-flagged partial, not a hard fail"* — because **a tooling outage
must not lock the owner out of their own team** (`architecture.md:43`). A user with a hand-edited
sprint plan the script can't parse should still get a status.

**Why the flag is mandatory and leads:** the failure this guards against is a hand-built board that
reads like a computed one — the same unearned confidence the review flag guards against
(`architecture.md:306-310`).

**The cost, stated:** a fallback path rots because it is rarely exercised. Mitigated by keeping the
fallback prose **short** — render the six columns, count the rows, flag it — **not** a second copy of
the full contract. The full contract lives in the script. The fallback is explicitly lower fidelity,
and says so.

> **This is why §4.1's `SKILL.md` does not simply shrink.** The prose board description is replaced as
> the *primary* path and demoted to a short, flagged fallback. An implementer who deletes the prose
> outright has removed the degradation path.

---

## 6. Impact & risks

| | |
|---|---|
| **Blast radius** | One skill (`/fkit-status`), read-only, no launcher/installer change. Low. |
| **Back-compat** | The board's rendered shape is unchanged — it is the same six columns and roll-up, computed instead of recited. |
| **New consumer assumption** | `bash` on the consumer's machine. fkit already `exec`s a POSIX shell launcher, so this adds nothing real. |
| **Precedent** | First shipped executable. Recorded in the item-5 ADR. |
| **Debt** | `SKILL.md`'s parse contract and `dashboard.sh`'s output become a **mirror pair that can drift** — a fourth mirror, in the class ADR-014 §Deferred already flags. The `⟦fkit-dashboard v1⟧` marker is the mitigation, not a fix. |
| **Security** | Reads two file kinds under `ai-agents/`, writes nothing, no network, no secrets. |

**Risk — the exec bit.** Fully mitigated by `bash <path>` (§4.4), and **only** by it.

**Risk — the fallback rots.** Accepted, mitigated by keeping it short (§5.4).

---

## 7. Testing strategy

`node --test`, repo-root `test/`, fixtures in `os.tmpdir()`. Assert **exact stdout**. Cases:

| # | Case | Asserts |
|---|---|---|
| 1 | Clean sprint | board + roll-up; **non-zero terms only** (no zero-filled slots) |
| 2 | Any fixture | **counts sum to M**; `— of M` = row count, not the plan's prose |
| 3 | Disagreement drift | `waiting on owner` override + `drift disagreement` fact + roll-up clause |
| 4 | `⛔` with no reason | `drift nonconformance` fact; next step **stays `dead`** (not `waiting on owner`) |
| 5 | `➡️ Moved`, brief `## Sprint` matches | **not** drift; `in Sprint N` |
| 6 | `➡️ Moved`, brief `## Sprint` disagrees | **is** drift |
| 7 | Link rot (plan links `backlog/`, brief in `done/`) | resolved + `relocated` fact |
| 8 | Missing brief | `missing-brief` fact; **row still renders** |
| 9 | `🔲` with a `Depends on:` line | `⟨derive: …⟩` carrying the **raw** text |
| 10 | `## Status` wrapping across lines | marker matched by prefix, not whole line |
| 11 | Malformed plan / no `## Status` table | **non-zero exit**, message on stderr (drives §5.4) |
| 12 | Reason paragraph in a cell | trimmed to first clause; **table never wraps** |
| 13 | Two `## Status` tables (§8.2) | **first** table parsed + `drift multiple-status-tables` fact |

**Cases 4, 5, 6 are the ones that matter** — they are where the skill's hard-won distinctions live,
and each was a bug someone had to reason their way to.

**Harness caveat:** `test/harness.mjs` builds temp projects and stubs `claude`/`codex` on PATH; this
script needs neither. It needs only a fixture directory. **Do not route it through the launcher** —
it is a pure function and testing it through `exec claude` would be testing the wrong boundary.

---

## 8. Open questions

**None outstanding.** Both were put to the owner on 2026-07-16, who declined to rule on the detail and
delegated to the architect's recommendation. Recorded here as decided, with the reasoning, so the
implementer is not left re-deriving it:

1. **`SKILL.md` carries a MINIMAL literal copy of the `⟦FACTS⟧` grammar — not the full grammar, not a
   bare reference.** Only the record kinds beats 2 and 6 actually narrate from (`drift …`, `count …`,
   `total`). A full copy is a fifth mirror maintained by hand; a bare "see `dashboard.sh`" is a file
   the LLM may never open, and an instruction that depends on a model choosing to read a second file
   is not a contract. The minimal copy is small enough that drift is survivable and present enough
   that it is always in context. **This is the §6 debt, consciously priced, not overlooked.**
   *(Cheap to reverse: it is a paragraph in one file.)*
2. **Two `## Status` tables in one plan → parse the FIRST, and emit
   `drift multiple-status-tables count=<n>`.** No such plan exists today; this is a hand-edit guard.
   The fact is what matters — the script must not silently pick one of two candidate boards. Reported,
   not guessed.

---

## 9. What the implementation task must not reopen

Items 1–6 (§3) are **decided**. The implementation builds to this contract:

- **the `bash <path>` invocation rule** (§4.4) — it is the exec-bit mitigation, not a style preference;
- **the sentinel** (§4.2) — it is the fabrication guard; a "best-effort guess" instead of a visible
  marker defeats the task's stated purpose;
- **the disagreement-vs-nonconformance split** (§5.2/§4.2) — the override applies to one and not the
  other, deliberately;
- **the short flagged fallback** (§5.4) — deleting the prose outright removes the degradation path;
- **`counts sum to M` by construction** (§5.3) — not by assertion.

---

## 10. Related

- `claude/skills/fkit-status/SKILL.md` — the skill this changes (step 4, `:149-206`).
- [ADR-014](../decisions/adr-014-how-fkit-tests-itself.md) — §1 (test infra never ships), §2 (the
  fenced scope this widens), §4 (zero devDeps), §"the `install.sh:43` fact".
- [ADR-013](../decisions/adr-013-knowledge-base-root-holds-the-living-canon.md) — why this report is
  filed under `reports/` and dated.
- `install.sh:43-46`, `claude/fkit-claude-init.sh:227` — the ship path and the chmod gap.
- `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — the closed six-marker set.
- `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` — the convention this whole task
  is an instance of.
</content>
</invoke>
