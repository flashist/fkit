# Implementation plan — task `0361`

## 0. Baseline, measured this turn (not inherited)

| Measurement | Command | Result |
|---|---|---|
| HEAD | `git rev-parse HEAD` | **`cf289c26394526ff2601800aa8f40d1873f370ba`** (`cf289c2`, "Sprint push") — ⚠️ the driver named `351bea3`, which is now **HEAD^** |
| Working tree | `git status --porcelain` | **2 paths**: `M ai-agents/sprints/sprint-7.md`, `M ai-agents/tasks/backlog/0361-…/brief.md`. ⛔ **Sweep B's ~34 paths are NOT in the tree — they are committed.** Nothing below is my change; this task has written nothing |
| Rank guard | `node --test test/closed-rank-immutability.test.js` | **tests 34 / pass 34 / fail 0** |
| Full suite | `npm test` | **tests 833 / pass 833 / fail 0** |
| Red proof | `bash test/prove-red.sh` | **`✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion`**. **28 mutations, all red.** Counted two ways: the run's sequential list ends at `28.`, and `grep -c "should go RED" test/prove-red.sh` = **28** |
| Dashboard | `dashboard.sh select-active ai-agents/sprints` | `active file="sprint-7.md" identity="Sprint 7"`, **exit 0** |
| Drift | `bash claude/skills/fkit-status/dashboard.sh` | **no drift line on any board** |
| `—` cells on sprint boards | parse of all 7 boards' `## Status` tables at HEAD | **zero**, on every board (`sprint-1`…`sprint-7`) |
| `—` codepoint | `xxd` on a live backlog cell | **U+2014** (`e2 80 94`) exactly — load-bearing for the widening regex |

⚠️ **Unreconciled, stated rather than resolved:** the driver reported *"guards 41/41"*. **`prove-red.sh` carries 28 mutations**, verified statically and dynamically. I searched `test/prove-red.sh` and `sprint-7.md` and found **no `41` reference**. ⛔ **I am not asserting the driver is wrong** — "41" may count a different thing (guard *files*, or another metric) that I could not identify. **I am asserting only what I measured: 28/28, hard gate PASSED.** A plan that quoted "41/41" would be inheriting an unverified number, which is the exact failure this brief warns about.

> ⭐ **Driver's reconciliation, added at the plan gate 2026-09-04.** Both figures are right and they count different things. **41** = the combined test count of the two citation/link guard files (`test/reference-integrity.test.js` = 20 + `test/coordination-citation-policy.test.js` = 21), which the driver runs as one command. **28** = `prove-red.sh`'s mutation count. There is no conflict, and the worker's refusal to inherit an unidentified number was correct regardless.

## 1. Verification step 1 — the three sites, re-measured firsthand at `cf289c2`

**All three reproduce. Every fragment below was read on disk this turn, not copied from the brief.**

**Site A — `test/closed-rank-immutability.test.js`, function `parseBoard`.** The rank check is live and unchanged:

```js
    // Sprint boards are ranked. `P<n>` is the current era; done/sprint-1.md's first era used bare
    // `<n>`, once with an annotation ("8 (optional)") — see the file-header widening note. `—` —
    // the Backlog board's unranked marker — never appears on a sprint board and throws.
    if (!/^P?\d+(?: \([^()]*\))?$/.test(rank)) {
      throw new Error(`${rowName}: Priority cell ${JSON.stringify(rank)} is not a rank ` +
        '(expected P<n>, or the first-era bare <n> with an optional parenthesized annotation).');
    }
```

Two further site-A anchors the brief does not quote, both material:
- The **file header's widening note** ends: *"`—` / empty / prose still throw."* — the refusal is stated **twice**, so a phase-2 edit must amend **both** the inline comment and the header note.
- The header also records: *"backlog.md is excluded BY CONSTRUCTION: the Backlog board is unranked by design (every Priority cell reads `—`), so it has no rank to hold still."* ⭐ **The suite already concedes an unranked board is a coherent thing** — it just refuses the state on a *sprint* board.
- The unit test is intact, named `parseBoard: an unranked (—) or garbage Priority cell throws`, carrying **two** assertions — the `—` case and a `'high'` prose case.

**Site B — `ai-agents/sprints/backlog.md`, the "Off:" rule's unranked-forward clause.** Byte-present, verbatim:

> *"**⚠️ The unranked-forward case — the one thing that drops the suffix.** When the destination sprint board is **unranked** (its Priority column is all `—`, no `P<n>` assigned to anything), write the marker as `➡️ Moved to [Sprint N](sprint-N.md)` with **no `— priority M` suffix**"*
> … *"⛔ **Never write `— priority —`, and never invent a number**"*
> … *"**Worked precedent — [Sprint 6](done/sprint-6.md), 2026-08-14.** It opened unranked (the first board in this project to do so)"*

⭐ **The clause carries its own honest limit, which strengthens option (b):** *"**Verified, not assumed — this is a documentation-truth rule, not a parser contract.** `dashboard.sh`'s `moved_target` parser … **never reads the suffix**."*

**Site C — `ai-agents/sprints/sprint-7.md` §"⛔ This board is UNRANKED — and one row is not a rank".** Present, heading now marked *(SUPERSEDED 2026-08-29 … left byte-identical as the record of why it opened unranked)*. ⛔ **The supersession is scoped to the factual claim only** — the section says so explicitly, and the reasoning paragraph is untouched and still normative in tone:

> *"**This is the ordinary path, not a deviation.** [`backlog.md`](backlog.md)'s **"Off:"** rule carries an **unranked-forward clause** … Sprint 6 is the worked precedent that clause was written from."*

And its own deferral clause, the exact act the widening must classify:

> *"if and when the owner ranks this board, the Priority cell, the brief's `## Priority`, and `backlog.md`'s `— priority P<n>` suffix are all added in that one act."*

## 2. Verification step 2 — the failure, re-run

**`node --test test/closed-rank-immutability.test.js` → 34 tests, 34 pass, 0 fail.** `live leg 1` and `live leg 2` both **✔**.

⭐ **The brief predicted this exactly** — *"the symptom clears at the owner's next commit, the CONFLICT does not."* The owner committed the ranked board; `git show HEAD:ai-agents/sprints/sprint-7.md` holds **zero** `—` Priority rows, so leg 1's earlier side no longer trips the throw. Checked back four revisions: no `—` at HEAD, HEAD^, HEAD~2, HEAD~3, so leg 2 is green for a *real* reason now, not the incidental "no counterpart at HEAD^" reason the brief flagged.

⛔ **Consequence: the brief's verification steps 2 and 5 as written are no longer reachable.** There is no failure to reproduce and no red to turn green. **They are replaced, not dropped** — see §7.

## 3. Two new findings that change the shape of the decision

**Finding 1 — `dashboard.sh` never reads the Priority column at all.** Verified by grep across `claude/skills/fkit-status/dashboard.sh` (its parsers cover the H1 identity token, the `## Status` table's Status/Task/Brief fields, and the `➡️ Moved` target — no Priority-cell read anywhere), corroborated by site C's own note: *"`dashboard.sh` reads a brief's `Status`, `Sprint` and `Owner`; it **never** reads `## Priority`, and its `moved_target` parser never reads the suffix."*

Two consequences:
- ⛔ **The driver's `dashboard.sh` grammar-examples constraint does not bind this task.** No option requires editing `dashboard.sh`, and none touches the grammar Sweep A left alone. Correctly raised, and correctly **not engaged** — I checked rather than assumed.
- ⭐ **`test/closed-rank-immutability.test.js` is the SOLE machine consumer of a sprint board's Priority cell.** So "three rules disagree" is more precisely: **two written rules and their two worked precedents, against one test that is the only enforcer.**

**Finding 2 — a FOURTH site, on a shipped surface, that the brief does not name.** `claude/skills/fkit-task-brief/SKILL.md`, under *"Pulling a backlog task into a sprint is the producer's act, not this skill's"*, edit 2:

> *"**`— priority M` is mandatory and is not dropped just because this board is unranked** — `M` is the priority the task receives in **Sprint N** (step 1)"*

Here *"this board"* is the **backlog** board (the source). The skill has **no unranked-destination carve-out**, where `backlog.md` writes one out at length. Shipped skill and board rule **diverge**: the skill says the suffix is mandatory full stop; `backlog.md` says mandatory *"when that sprint board is ranked"* and drops it otherwise.

- ⛔ **Pre-existing. Not created by this task, and not in this brief's scope as written.**
- ⚠️ It is a **`claude/` shipped surface** — structure manifest, dual-home parity to a gitignored `.claude/`. Editing it **engages the stop-and-surface line**. **Q4.**

## 4. Phase 1 — whose deliverable, and what shape

**Measured, not reasoned from memory:**
- `claude/skills-for-role.sh`, `skills_for_role()`: `architect)` owns `fkit-record-decision`. `coder)` does not. **The ADR-018 `PreToolUse` hook denies me `/fkit-record-decision` at any spawn depth** — a wall, not a preference.
- **ADR-044 §Decision 1**: Build's role follows the **deliverable's skill**. Phase 1's deliverable is an ADR → skill is `fkit-record-decision` → **architect**. Phase 2's deliverable is a **test edit**, which names no skill → falls to `## Owner` = `fkit-architect` — ⚠️ see the wrinkle below.

**Recommended shape, in three acts:**

1. ⛔ **The owner rules.** Which of (a)/(b)/(c) wins is a **new structural decision that changes a standing rule**. It is the owner's; I neither settle it nor recommend the architect settle it unilaterally. The driver relays Q1–Q3 via `AskUserQuestion` in its own session.
2. **`@fkit-architect` authors the ADR** via `/fkit-record-decision`, **recording** the owner's ruling — not originating it. **An ADR is the right form, not thoroughness theatre:** the brief's own test is *"if it changes a standing rule … it is an ADR"*, and (a) and (b) each change one. If the re-worded (c) wins, a dated note at the sites is enough and **no ADR is written** — the brief forbids defaulting to one.
3. **`@fkit-coder` (me) implements phase 2**, gated on the ADR landing.

⚠️ **One wrinkle I surface rather than resolve.** ADR-044 routes a no-skill deliverable to `## Owner`, which reads `fkit-architect` — but phase 2 under (b) is a **JavaScript test edit**, and source-write authority is the coder's. The brief already resolves this in its own words — *"phase 2's deliverable is a **test or convention edit, which names no skill**, so ADR-044 §Decision 1 puts it with `@fkit-coder`, whatever `## Owner` says"* — so I follow the brief and flag that I read `## Owner` against its literal ADR-044 mapping on the brief's own instruction. ⭐ **Two phases, two Build workers. The brief says this is the rule working, not a defect.**

## 5. Phase 2 — per option, what actually gets edited

⛔ **Not started until phase 1 lands.** Costed here so the owner rules with the blast radius visible.

### Under (b) — widen `parseBoard` *(smallest surface; producer's recommendation)*

**Files touched: `test/closed-rank-immutability.test.js`. That is all. One file.**

- ⛔ **No `claude/` file. No structure manifest, no dual-home parity, no `.claude/` mirror.** **The stop-and-surface line does not engage** — sole exception is Finding 2, which I recommend keeping **out** (Q4).
- ⛔ **No board edited. `git diff -- ai-agents/sprints/` stays empty.**

**Step b1 — widen the accept as an allowlist of two named forms, never a loosened regex** *(widening is not weakening)*:

```js
if (!/^(?:—|P?\d+(?: \([^()]*\))?)$/.test(rank)) {
```

⭐ **Why this preserves the throw, concretely.** It adds **one literal alternative**, `—` (U+2014, byte-verified `e2 80 94` against a live board cell), and relaxes nothing in the existing branch. Every current rejection still rejects: `'high'`, `''`, `'P'`, `'-'` (ASCII hyphen), `'–'` (en-dash U+2013), `'— '`, `'—5'`, `'P1 (a) (b)'`. **A dash of the wrong codepoint still throws** — worth its own assertion, because it is the realistic typo.

**Step b2 — amend the two comments that state the refusal.** Both the inline `parseBoard` comment and the file-header widening note say `—` throws. ⛔ **Leaving either stale is a defect** — this suite's method is that its comments are the record.

**Step b3 — rule the closed-row transition, in writing, in the test.** `findRankViolations` compares with a bare `if (prev.rank !== r.rank)`. Proposed rule:

| `earlier` → `later`, on a **closed** row | Verdict | Why |
|---|---|---|
| `—` → `—` | no flag | no-op |
| `—` → `P<n>` | ⭐ **allowed** | there was no rank to freeze. The **deferral clause being honoured** — both boards instruct exactly this act, and Sprint 7 performed it live on 2026-08-29 |
| `P<n>` → `—` | ⛔ **FLAG** | erasing a frozen rank destroys the history the invariant exists to keep. The fail-safe direction |
| `P<n>` → `P<m>`, n≠m | ⛔ **FLAG** | unchanged, today's behaviour |
| any transition on an **open** row | no flag | unchanged |

⭐ **The obvious objection, answered:** *doesn't allowing `—`→`P<n>` let a renumber launder itself in two commits — `P5`→`—`, then `—`→`P9`?* **No. Step one already flags**, because `P<n>`→`—` is a violation. The launder is caught at its first move — which is why the erase direction must flag even though it "loses" no ordering.

**Step b4 — split the unit test, ⛔ never delete it.** `parseBoard: an unranked (—) or garbage Priority cell throws` becomes two:
- `parseBoard: a garbage Priority cell throws` — **keeps the `'high'` assertion**, gains b1's negatives (empty, ASCII hyphen, en-dash, `'—5'`).
- `parseBoard: an unranked (—) Priority cell parses on a sprint board` — asserts `rows[0].rank === '—'`, compared verbatim like every other rank.

**Step b5 — four new `findRankViolations` tests**, one per closed-row row of the b3 table.

**Step b6 — the untouchables.** ⛔ No edit to the `0174` replay fixtures, ⛔ none to the first-era bare-`<n>` widening, ⛔ no `package.json` change and no new devDependency (ADR-014).

### Under (a) — boards are never committed unranked *(largest surface)*

- `ai-agents/sprints/backlog.md` — the unranked-forward clause becomes **unreachable**; repaired or annotated. ⛔ Prose region only, **outside** the `## Status` table, **no `Moved` marker touched**.
- `ai-agents/sprints/sprint-7.md` §"⛔ This board is UNRANKED" — ⛔ **annotated, never rewritten** (`0306` precedent, already carried by `0176` and `0237`).
- ⚠️ **and very likely `claude/skills/fkit-task-brief/SKILL.md`** — the shipped skill that tells a producer what to write. ⛔ **`claude/` is a shipped surface: this engages the stop-and-surface line, and I would stop and surface rather than edit it inside this row.**
- ⛔ **And the brief's own blocker, which I confirm is genuinely unanswered:** *"what does a producer write in the Priority cell of a board the owner has not ranked?"* **There is no answer anywhere on disk today** — both worked precedents (Sprint 6, 2026-08-14; Sprint 7, 2026-08-29) wrote `—`. (a) must **invent** a sanctioned token or **forbid** the state outright, and each reaches further than the file list above. ⛔ **Unanswered, (a) is not implementable** — the brief says so and I confirm it.

### Under (c) — record the tolerance, change nothing

- A dated note at each of the three sites. ⛔ **No ADR** — the brief forbids one where nothing changes.
- ⚠️ **But (c) cannot be ruled as written. See Q2.**

## 6. Should a guard or test pin the settled rule?

**Argued answer: the in-suite tests ARE the pin. ⛔ No new guard file, and no new `prove-red.sh` mutation.**

Evidence is the suite's own header, quoted verbatim from disk:

> *"**⚠️ PROVE-RED GAP, stated for the record (owner ruled 2026-08-06: "State the gap")**: prove-red.sh gains NO mutation for this suite — none of its mutations may reach the real ai-agents/ boards, and a copied-tree seam has no .git so this guard would SKIP there, not go red. … Until then the red proof lives IN-SUITE."*

- ⛔ **A prove-red mutation here is not merely over-building — it is barred by a standing owner ruling**, and would not work mechanically (no `.git` in the copied seam ⇒ SKIP, not red). ⭐ My measurement corroborates: all **28** mutations target other suites; none reaches `ai-agents/` boards.
- ⭐ **The in-suite red proof already exists** and is the sanctioned mechanism: `the in-suite red proof: a re-ranked closed row in a working tree goes red at leg 1` (tmp git repo) plus the `0174` fixture replay. The b5 tests join that same mechanism.
- ⛔ **A separate guard would duplicate b4/b5** and add a second place for the rule to drift. Under (b) the rule *is* code; a guard over code that is itself a guard is the over-build.
- ⚠️ **Under (a) or (c) the answer flips**, and I say so rather than generalising: those options leave the rule as **prose in three or four documents**, where nothing enforces it. If (a) wins, a guard becomes worth arguing — ⛔ **but as its own row, not smuggled into this one.**

## 7. Verification steps — the brief's, corrected where its premise changed

⛔ **I am not silently dropping the brief's steps 2 and 5.** They are unreachable because the failure they name no longer exists, and that must be stated, not quietly skipped.

| # | Brief's step | Status |
|---|---|---|
| 1 | Three sites re-measured and quoted | ⭐ **DONE, above** — all three reproduce |
| 2 | *Failure reproduced and pasted* | ⛔ **UNREACHABLE — the failure has cleared.** Replaced by: paste the **green** run (34/34) and state that leg 1's earlier side is now a ranked board at `cf289c2`, so the throw is not reached |
| 3 | The decision exists as a file, form justified | Phase 1. ADR under (a)/(b); dated note under (c). §4 |
| 4 | Every site touched, none that isn't; `git diff --stat` pasted, each file justified | Phase 2. Under (b) that is **one file** |
| 5 | *The rank test goes GREEN* | ⛔ **VACUOUS as written — already green.** Replaced by: the b4/b5 tests **must be shown red before the b1/b3 edit and green after**, so the widening is proven to do something. ⛔ **A green run over a test that never failed proves nothing** |
| 6 | Garbage-cell throw still holds | ⭐ Served directly by b4's split. Paste the named run |
| 7 | `npm test` in full, counts reported; separate any `HEAD`-side red | Baseline **833/833** + **prove-red 28/28** recorded above. ⚠️ **The brief's "if leg 1's `HEAD` side is still red" branch is now moot** — say so rather than reporting a caveat that no longer applies |
| 8 | `dashboard.sh` before and after, no new drift, `select-active` unchanged | Before recorded above (`active file="sprint-7.md" identity="Sprint 7"`, exit 0, no drift). ⭐ Under (b) nothing can move it — no board is touched |
| 9 | **No rank changed anywhere** | ⭐ Under (b), `git diff -- ai-agents/sprints/` is **empty** — the strongest available proof. Under (a)/(c), same command plus a Priority-column extraction before/after |
| 10 | Nothing committed/staged, no folder moved, no mover invoked | ⛔ Held throughout. **I hold no mover skill** (ADR-033); a close routes to `@fkit-producer` |

## 8. Risks and non-obvious failure modes

- ⛔ **Amending only one of the two "`—` throws" comments.** The refusal is stated in the inline comment **and** the file-header widening note. A stale header in a suite whose method is its comments is a real defect, not cosmetics. Guarded by b2.
- ⛔ **Wrong-codepoint dash.** `—` U+2014 is byte-verified against a live cell; `–` U+2013 and `-` U+002D must keep throwing. A regex written as a character class rather than the literal would silently accept all three. Guarded by b1's literal alternative + b4's negatives.
- ⚠️ **`—` compares as a string.** Ranks are compared **verbatim** by design (file header: *"compared VERBATIM as a string, so immutability semantics are unchanged"*). `—` slots in with no ordering semantics — correct, because an unranked row **has** no order. ⛔ Introduce no numeric coercion.
- ⚠️ **The vacuous-pass assertion.** The suite derives a non-zero closed-row count at runtime so a parser change cannot go green over a corpus it stopped reading. b1 **widens** the accept, so it cannot reduce that count — ⛔ but re-check after the edit rather than assuming.
- ⚠️ **Soft collision with `0355` on `backlog.md`.** `0355` is **cancelled** (per `sprint-7.md`'s own amended note), so the collision is discharged — ⛔ but under (a) I re-read `backlog.md` from disk rather than trusting this plan's quotes.
- ⚠️ **Site C's supersession is scoped.** Its heading marks the section superseded, but an inner marker scopes the banner to *one factual sentence*. ⛔ Under (a), annotate; **never rewrite**, and never assume the whole section is inert.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-04

Given live via `AskUserQuestion` in this `fkit lead` session. Option labels recorded **verbatim**.
These bind phase 1's architect and phase 2's coder.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **P0** | Approve this plan as written? | **"Approve as written (Rec)"** | The plan above is the approved plan. These bytes are what phases 1 and 2 implement. |
| **P1** | Q1 — which rule wins? | **"(b) Widen parseBoard to accept — (Rec)"** | ⭐ **Option (b).** `parseBoard` is widened to accept `—` on a sprint board. The owner's reasons, as put: the test is the **sole machine consumer** of the Priority cell; its declared subject is **closed-rank immutability, not rank presence**; and refusing `—` makes a **twice-precedented, owner-reviewed** board state uncommittable. ⚠️ The cost is accepted with it: **(b) is not a regex tweak — it forces the P3 transition ruling.** |
| **P2** | Q2 — option (c) is mis-worded and unrulable | **"Re-word it (Rec)"** | (c) is re-worded to *"record the latent conflict at the three sites, change no rule."* ⛔ It is **not** the winning option — P1 chose (b) — but it is recorded honestly rather than left describing a red leg that does not exist. |
| **P3** | Q3 — the closed-row transition rule | **"Adopt the proposed table (Rec)"** | ⭐ **§5 step b3's table is ruled, exactly as proposed:** `—`→`—` no-op · `—`→`P<n>` **allowed** · `P<n>`→`—` **FLAGS** · `P<n>`→`P<m>` **FLAGS** · open rows unconstrained. The owner's reasons: `—`→`P<n>` is **the deferral clause being honoured** — both boards instruct that act and Sprint 7 performed it on 2026-08-29 — and the two-commit launder is **still caught, because step one flags**. ⛔ The stricter reading (flag `—`→`P<n>` too) was **refused by name**: it would have flagged Sprint 7's own lawful ranking act. |
| **P4** | Q4 — the fourth site, `claude/skills/fkit-task-brief/SKILL.md` | **"File separately onto the Backlog board (Rec)"** | ⛔ **OUT of this row.** It is pre-existing, out of the brief's scope as written, a **`claude/` shipped surface**, and does **not** block `0360`. **File it onto the Backlog board** — which needs no ruling, where a fourteenth Sprint 7 row would need its own under that board's one-row rule. ⛔ **Do not edit `claude/` in this row.** |

⚠️ **Transport note.** This plan text was returned to the driver through the spawn channel, which
HTML-escaped some angle brackets. The driver restored `&lt;`/`&gt;` to `<`/`>` when persisting these
bytes — in the `P<n>` / `<n>` rank tokens throughout, in the site-A code block, and in the blockquote
markers of §1 and §6. No other character was altered. Recorded so a later reader does not read the
restoration as drift.

---

# ⚠️ DATED CORRECTION 2026-09-04 — §3 Finding 1 and its §6 restatement are FALSE

**Appended by the driver, under owner ruling *"Append a dated correction to plan.md (Rec)"*, live
`AskUserQuestion`, 2026-09-04. ⛔ Append-only: not one byte of the approved plan above is altered.**

**What the plan claims.** §3 Finding 1 is headed *"`dashboard.sh` never reads the Priority column at
all"*, and §6 restates it as the basis for *"`test/closed-rank-immutability.test.js` is the SOLE machine
consumer of a sprint board's Priority cell."*

**What is actually true — measured independently by the phase-1 architect and re-measured by the driver
on 2026-09-04.** `claude/skills/fkit-status/dashboard.sh` **does** read the Priority column:

- its row extractor's own comment reads *"Emits: status`<US>`priority`<US>`task`<US>`brief-cell"* and
  *"takes status=$2, priority=$3"*;
- the extracted cell is consumed by `task_id()` as **arm 2 of the FACTS-id ladder**, which the file
  documents as *"THE LADDER: folder ID prefix → Priority number → sanitised folder name → `?`"* and
  describes as **"a LIVE FALLBACK, not dead code"**.

**⭐ The ruling is UNAFFECTED, and this note changes nothing about it.** Owner ruling **P1** — *"(b)
Widen parseBoard to accept — (Rec)"* — was re-confirmed after the correction, live `AskUserQuestion`,
2026-09-04, option label verbatim **"(b) stands on the corrected reason (Rec)"**. What (b) rests on is
the **weaker and sufficient** claim, which is measured and true:

- **the test is the only ENFORCER** of a sprint board's Priority cell — nothing else throws on it;
- arm 1 (folder ID prefix) is primary, and arm 2 fires only for a brief link with no numeric folder
  prefix; `task_id()` on `—` yields no digits and falls through to arm 3, then `?`;
- empirically the Backlog board's Priority column is **all `—` today**, and `dashboard.sh` runs over it
  with **zero drift lines and no MALFORMED record**.

**⛔ Consequences for phase 2 — read these before implementing:**

1. **No `dashboard.sh` edit is implied, then or now.** The plan's conclusion that no option touches
   `dashboard.sh` **still holds**; only its stated reason was wrong.
2. ⛔ **Do not repeat the "never reads that column" wording** in any record, commit message, ADR, note
   or report. It is false.
3. **ADR-046 already carries this correction** beside the owner's reasons — the architect recorded the
   ruling with the reasoning intact **plus** a dated measured-correction note, rather than silently
   encoding a claim it had measured false or silently dropping a stated reason.

**⚠️ Why this note exists at all, said plainly.** The false claim originated in the plan, the driver
relayed it into the owner's stated reason at the plan gate, and it reached the ruling record before
anyone re-measured it. That is the same defect class this sprint exists to end — **a loose claim
propagating into a decision record** — and it is the third instance observed in this session. It is
recorded here rather than corrected away, so a later reader sees both what was believed and what was
measured.
