# Plan — task 0210: specify and support the reverse move (sprint → Backlog board)

> **Provenance and carry disclosure — read before treating any part of this file as authoritative.**
>
> Produced by a spawned `@fkit-coder` planning worker and **approved by the owner** via a live
> `AskUserQuestion` in the `/fkit-sprint-ship-loop` driver session on **2026-08-03**. Per
> `fkit-sprint-ship-loop/SKILL.md` §Durable artifacts, the **driver** wrote this file at the moment of
> approval, before spawning the build.
>
> **What this copy is, stated honestly** (`0162`'s faithful-carry ruling): the approved bytes existed only
> in this session's worker return and `AskUserQuestion` exchange — there was no prior file to copy from.
> So this is a **copy from the driver's context**, not a file→file copy. One transformation applied and
> disclosed: the worker's return arrived with HTML-escaped angle brackets (`&lt;` / `&gt;`), rendered here
> as literal `<` / `>`.
>
> **`carried-not-approved` remains an accepted structural residual** (`0162`): a hash pins which bytes
> were *carried*, not which were *approved*. Approval leaves no artifact.

## Owner rulings at approval (live `AskUserQuestion`, 2026-08-03)

| Question | Ruling |
|---|---|
| Approve the plan? | **Approved — build it.** |
| **Q1** — rank on the reverse move | **SURRENDER.** Backlog row `—`, brief `## Priority: Unscheduled`. The sprint row keeps its `P<n>` as frozen history. |
| **Q3** — amend `task-status-vocabulary.md` as a third doc site? | **YES.** One row, live copy only (parity-exempt, `audience-adapted`). Without it the marker is invalid by the registry's own rule. **Do NOT touch `status-report-format.md`.** |
| **Q2** — exact marker string | **Approved as written:** `➡️ Moved to [Backlog](backlog.md)`, no priority suffix, href relative to the row's file (`../backlog.md` once archived). |
| **Q4** — four mandatory edits, or three-with-a-parenthetical? | **FOUR**, plus a sentence explaining the forward form's parenthetical (C2) so the asymmetry reads as explained, not as an error. |
| **Q5** — Next-step cell wording | **Leave it.** The parser fix removes `in Sprint ?` as a side effect; `in Backlog` reads correctly. |

---

### 0. Corrections to the brief — verified on disk, state these before anything else

**C1. The BSD `sed` trap is worse than the brief records — the naive fix is a *regression*, not merely a non-fix.**
BSD `sed` reads `\|` in a BRE as a **literal pipe character**, not alternation. Proven: feeding the crafted string `Moved to [Sprint 2|Backlog](x)` to the naive expression captures `Sprint 2|Backlog`. Consequence: the naive form matches **nothing** on *either* branch, so it breaks the **existing forward-form parse** as well. Every live `➡️ Moved to [Sprint N]` row — 5 in `ai-agents/sprints/backlog.md`, 5 in `ai-agents/sprints/done/sprint-1.md` — would become `moved-without-target` drift on the owner's Mac. The brief describes only the Backlog-target failure ("byte-identical broken output"), which is consistent with a fixture containing no forward rows. The trap's blast radius is larger than documented.

**C2. The brief's "the fourth edit has no forward analogue" is half wrong.**
`claude/skills/fkit-task-brief/SKILL.md`, under *"Pulling a backlog task into a sprint is the producer's act"*, step 3 reads: *"Update the brief's own `## Sprint` field to `Sprint N` **(and give `## Priority` the real number)**."* The forward form **does** touch `## Priority` — as an unnumbered parenthetical folded into step 3, which is why it is not in the "three edits" count. The half that survives is the important half and I confirm it: `dashboard.sh` reads a brief's `Status`, `Sprint` and `Owner` only (the `# -- brief fields --` block); the string `"Priority"` appears **zero** times as a field read. Nothing enforces it.

**C3. The brief's two documentation sites are incomplete — there is a third, and it is mandatory by its own terms.**
`ai-agents/knowledge-base/conventions/task-status-vocabulary.md` is the canonical marker registry (`fkit-task-brief/SKILL.md` calls the forward marker *"the canonical marker from `task-status-vocabulary.md`"*). It states: *"**No other value is valid.** … If a status you need isn't here, the fix is to amend this doc — not to invent a value inline."* Shipping a new marker without amending it makes the new marker invalid by the repo's own rule. **Good news on cost:** that file is on the `dual-home-parity` **exceptions** list with `kind: 'audience-adapted'` (whole-file exempt), so a **live-only** edit does not break `test/dual-home-parity.test.js` and no scaffold twin edit is required. The scaffold also ships **no** `ai-agents/sprints/backlog.md` at all (only `.gitkeep` and `done/`), so the reverse move is not a scaffold concept.

**C4. The link target is a rule, not a fixed string.**
Both hrefs live on disk: `[Sprint 2](sprint-2.md)` in `ai-agents/sprints/backlog.md`, and `[Sprint 2](../sprint-2.md)` in `ai-agents/sprints/done/sprint-1.md`. The href is **relative to the file holding the row**. So a reverse-move row in `ai-agents/sprints/sprint-2.md` writes `backlog.md`, and must become `../backlog.md` when that plan is later archived under `sprints/done/` — the exact link-rot class tasks `0050` and `0076` repaired. The parser is href-agnostic (it captures the label inside `[`, and `.*` swallows the href) — proven, case F below.

**C5. A non-risk I checked because it looked like one.** The live `ai-agents/sprints/sprint-2.md` `## Status` table (which spans from `## Status` to `## Dependency graph`) contains task `0210`'s own row, whose **Task** cell quotes the replacement `sed` expression verbatim, including `Backlog`. Its **Status** cell is `🔄 In progress`, and `moved_target` is computed only when `key = moved` and only from the Status cell. The parser change **cannot** alter live board output. Verified.

---

### 1. Answers to the two open questions

**(i) Rank on the reverse move — recommend SURRENDER (option A).**

Reasoning, beyond restating the options:
- `ai-agents/sprints/backlog.md`'s `## Priority` section exists *precisely* to forbid what PARK needs: *"A number here would be a commitment nobody made."* PARK requires amending the one section written to prevent it.
- **PARK is unhonorable under ADR-035.** A parked rank could only be restored by *inserting* at that slot; ADR-035 mandates append-never-insert. A rank you can never re-honor is decoration.
- A rank is a position on a *specific* board. `P188` in Sprint 2 says nothing about a future Sprint 3 with different contents.
- **Nothing is lost.** The sprint row keeps `P188` as frozen history, so the number stays recoverable by reading the sprint plan. PARK duplicates that fact into a second, **mutable, wholly unchecked** place — and per C2 there is *no* `## Priority` drift check at all, so a parked number is a drift source with no control behind it.

**Sub-question — does the *sprint* row's Priority cell keep its `P<n>`? Recommend KEEP, and there is direct precedent on disk.** `ai-agents/sprints/done/sprint-1.md`'s moved rows retain their rank in the Priority cell (e.g. the row reading `➡️ Moved to [Sprint 2](../sprint-2.md) — priority 7 (reframed)` has Priority cell `1`). Consistent with `priority-is-rank-not-identity.md` and ADR-035: a closed-out row is frozen history; changing it is a renumber.

**(ii) The exact marker string — recommend exactly:**

```
➡️ Moved to [Backlog](backlog.md)
```

Each component, and why it is not free choice:
- **`➡️` prefix** — mandatory. `marker_key()` classifies on the leading glyph (`'➡'*`); the cell must *start* with it.
- **Label exactly `Backlog`** — mandatory, and it must be this word with this capitalization. Drift rule 2 compares the extracted target against the brief's `## Sprint`, whose backlog value is `Backlog`, which is also the board's own `PLAN_SPRINT` identity. Not "the Backlog", not "Backlog board".
- **Href `backlog.md`** — per C4, relative to the file holding the row; `../backlog.md` once archived.
- **No `— priority M` suffix.** There is no destination rank (the board is unranked), and unlike `blocked`/`cancelled`, the `moved` nonconformance check requires only a target, never an em-dash reason. Verified: the `moved)` arm is `[ -n "$moved_target" ] || nonconf="moved-without-target"`.
- **Cell-trim safety:** `one_line_cell()` cuts at period-**space**; `backlog.md)` has no space after its period, so the marker passes through untrimmed.

---

### 2. The mandatory edit set — **FOUR**, and say why it is four and not three

Given C2, the honest framing is not "the forward form has no Priority analogue" but "the forward form buries it in a parenthetical, and nothing enforces it in either direction." Recommend **elevating it to a numbered step on the reverse side**, because the reverse move *surrenders* a rank (a semantic loss that leaves a stale number behind) where the forward move *gains* one, and because it is unenforced.

1. Sprint row → `➡️ Moved to [Backlog](backlog.md)`. **Never deleted** — deletion destroys the pointer to where the work went. Priority cell keeps its `P<n>`.
2. Add a row to `ai-agents/sprints/backlog.md`: Status `🔲 Backlog`, Priority cell **`—`**.
3. Brief's `## Sprint` → `Backlog`. Omit this and drift rule 2 fires `drift disagreement` forever.
4. Brief's `## Priority` → `Unscheduled`. **⚠️ Unenforced — label it as such in both docs.** No control in the repo checks a brief's `## Priority`; a brief reading `## Priority: 152` on an unranked board is invisible to everything.

---

### 3. File-by-file changes

#### 3a. `claude/skills/fkit-status/dashboard.sh` — one line, under the `# -- the ➡️ Moved target sprint --` comment

Current:
```sh
    moved_target=$(printf '%s' "$st" | sed -n 's/.*Moved to \[*\(Sprint [0-9][0-9]*\).*/\1/p' | head -1)
```
Replace with:
```sh
    moved_target=$(printf '%s' "$st" | sed -nE 's/.*Moved to \[*(Sprint [0-9]+|Backlog).*/\1/p' | head -1)
```

Add a warning comment above it, matching this file's established house style (it already carries several BSD-vs-GNU warnings, e.g. the `REAL TAB, NOT \t` block): record that `-E` is **required**, that BSD `sed` treats `\|` in a BRE as a literal pipe, and that the naive BRE alternation therefore breaks the **forward** form too. ERE is already established in this file (`grep -qE` is used in the status-heading guard and the cancelled-date check), so `-nE` introduces no new dialect.

**Do not touch** the `marker_key()` classifier — it already returns `moved` for any `➡️` cell regardless of target. Only target extraction was wrong.

**Do not touch** the Next-step line `next="in ${moved_target:-Sprint ?}"` — see Q5 below.

⚠️ Edit `claude/skills/…`, **never** `.claude/skills/…` (gitignored, refreshed by `claude/fkit-claude-init.sh .`). The test suite reads the `claude/` copy, so tests are unaffected; a live `/fkit-status` **session** reads the `.claude/` copy and will not show the fix until init is re-run.

#### 3b. `ai-agents/sprints/backlog.md` — the *"How work moves on and off this board"* section

Add a **second "On" path** bullet, beside the existing `**On:**` / `**Off:**` / `**Closed here:**` bullets — a task arriving here *from a sprint*, distinct from one created here by `/fkit-task-brief`. State **four** mandatory edits (mirroring the `**Off:**` bullet's "**three** edits, all mandatory" idiom so a reader can count), give the canonical marker, state the href-is-relative-to-the-row's-file rule, and carry a blockquote warning mirroring the existing one — including the explicit **"`## Priority` is unenforced"** caveat.

#### 3c. `claude/skills/fkit-task-brief/SKILL.md` — beside the forward-pull step

Immediately after the existing bullet *"Pulling a backlog task into a sprint is the producer's act, not this skill's"* and its blockquote, add the mirror bullet for the reverse move, same shape: numbered mandatory edits, canonical marker, the blockquote warning. Note explicitly that the forward step 3's parenthetical `(and give ## Priority the real number)` is the forward analogue of reverse edit 4 — so a reader comparing the two counts is not confused.
⚠️ The brief's `:324-342` coordinates are stale-prone and several queued tasks edit this file — locate by the quoted heading text, not by line number.

#### 3d. `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — **OWNER RULED YES (Q3)**

Add a row to the status table beside the existing **Moved** row:

| **Moved (to backlog)** | `➡️ Moved to [Backlog](backlog.md)` | De-scoped from a sprint back to the unranked backlog board. Not dead, not done — unscheduled. | Producer |

Live copy only; no scaffold twin edit (C3). **Do NOT touch `status-report-format.md`** — it delegates to the vocabulary; its inline list is a convenience copy.

#### 3e. `test/dashboard-contract.test.js` — extend, do not create a new file

Six cases, modeled on the existing tests 5, 6 and R6 (which already use the `fixture` / `plan` / `brief` / `facts` / `boardRows` helpers, so `brief({ sprint: 'Backlog' })` works unchanged):

| # | Case | Assertion |
|---|---|---|
| A | `➡️ Moved to [Backlog](backlog.md)` + brief `## Sprint: Backlog` | zero `drift` facts; `boardRows().length === 0`; `count moved 1` |
| B | same marker + brief `## Sprint: Sprint 2` | `drift disagreement` with `moved_target="Backlog"` and `brief_sprint="Sprint 2"`; row renders `waiting on owner` |
| C | same marker + brief with **no** `## Sprint` | `drift missing-sprint` with `moved_target="Backlog"` |
| D | `➡️ Moved` with no target | still `kind="moved-without-target"` |
| E | **Regression:** `➡️ Moved to [Sprint 12](sprint-12.md) — priority 3` + brief `Sprint 12` | parses as `Sprint 12`, not `Sprint 1`; zero drift |
| F | **Archive form:** `➡️ Moved to [Backlog](../backlog.md)` + brief `Backlog` | zero drift (href-agnostic parse) |

Case F is not in the brief; it is required by C4 — the archived-sprint href is inevitable and would otherwise be an untested shape.

---

### 4. What the tests can and cannot prove — `prove-red.sh`

**Confirmed on disk, matching the brief:** `test/prove-red.sh` contains **zero** references to `dashboard` and routes all its mutations through `FKIT_LAUNCHER` (3 references). `test/dashboard-contract.test.js`'s header states it is *"DELIBERATELY NOT ROUTED THROUGH THE LAUNCHER"* and resolves the script as `join(REPO, 'claude', 'skills', 'fkit-status', 'dashboard.sh')` — a hardcoded path with **no env override**.

**Plainly: this change cannot be prove-red covered, and that is not fixable inside this task.** Covering it requires introducing a `dashboard.sh` path override into *both* the suite and `prove-red.sh` — a **test-architecture change**, not a test addition.

**The cost of not doing it:** the six new assertions above are real and will fail if the parser regresses, but nothing proves the *suite itself* would catch a mutation — i.e. the tests are unverified as tests. That is the same gap that already exists for all 13 existing dashboard behaviors, so this change does not worsen the posture; it inherits it. **Hand back as a follow-up brief for the owner to rank** (per the brief's own instruction), stating the above even though the mechanism is well-understood.

---

### 5. Verification steps

1. `node --test test/dashboard-contract.test.js` — new + existing cases green.
2. `node --test test/*.test.js` — full suite green. **Baseline established this session: 560 pass, 0 fail, 17 suites.** Includes `dual-home-parity.test.js`, which must stay green after 3d.
3. `sh test/prove-red.sh` — still exits 0. Does **not** cover the new branch; recorded as a follow-up, not silently accepted.
4. **BSD-sed portability gate, by hand, on this machine** — the fixture in Evidence §E below, run as `bash claude/skills/fkit-status/dashboard.sh <plan>`; require **zero** `drift` records in `⟦FACTS⟧`. **Must not be skipped**: a GNU-only regex passes step 1 on Linux CI and fails here.
5. Re-run the same fixture with `## Sprint: Sprint 2` and confirm `drift disagreement … moved_target="Backlog"`.
6. Re-read all three doc sites: reverse move documented **beside** the forward form, edit count stated, `## Priority`-is-unenforced caveat present.
7. **Do not run the 45 queued moves.** This task ships the mechanism only.
8. Optional sanity for the *later* move batch (not this task): no brief being reverse-moved still reads `## Sprint: Backlog (unsprinted)` — the pre-task-67 form, which would fail drift rule 2. Checked: surviving occurrences are all in `done/`/`cancelled/` prose, none in a live backlog brief's `## Sprint` field.

---

### 6. Risks / edge cases

- **Greedy-prefix behavior is unchanged.** `.*Moved to ` anchors on the rightmost occurrence; a Status cell can only carry one. `Sprint 12 → Sprint 12` proven (case E).
- **Unlinked legacy forms still parse.** `\[*` is zero-or-more, so historic `➡️ Moved to Sprint 2 — priority 7` prose forms keep working. Preserved by the replacement.
- **Alternation ordering is immaterial** — the two branches cannot both match at the same anchor position.
- **`.claude/` staleness** — see 3a; a session-visible fix needs `claude/fkit-claude-init.sh .`.
- **No mover change is implied.** `/fkit-task-done` / `/fkit-task-cancelled` are untouched; they already sweep `ai-agents/sprints/` recursively. This task adds no producer-only surface.
- **No new dependency** (ADR-014 respected); no new test file.

---

### 7. Evidence gathered at planning time

All commands run on Darwin 25.2.0; `sed --version` → `illegal option -- -` / `usage: sed script [-EHalnru]`, confirming **BSD sed**.

**E1 — the trap's mechanism.** `printf 'Moved to [Sprint 2|Backlog](x)' | sed -n 's/.*Moved to \[*\(Sprint [0-9][0-9]*\|Backlog\).*/\1/p'` → prints `Sprint 2|Backlog`. BSD reads `\|` as a literal pipe.

**E2 — the naive fix regresses the forward form.** Against both live forward strings (`…[Sprint 2](sprint-2.md) — priority 85` and `…[Sprint 2](../sprint-2.md) — priority 7 (reframed)`): production regex → `Sprint 2`; naive `\|` → **empty**; `sed -nE` → `Sprint 2`.

**E3 — the chosen form works on BSD.** `sed -nE 's/.*Moved to \[*(Sprint [0-9]+|Backlog).*/\1/p'` → `Backlog` for the Backlog marker, `Sprint 12` for the two-digit forward marker, **empty** for bare `➡️ Moved`.

**E4 — end-to-end, unpatched vs patched** (patched copy in scratchpad; **repo untouched**). Unpatched: `drift nonconformance 0001 kind="moved-without-target"` + Next-step `in Sprint ?` + row renders. Patched: `count moved 1`, **zero drift**, row filtered off the board.

**E5 — full case matrix against the patched copy**, all six as designed: A zero drift · B `drift disagreement … moved_target="Backlog" brief_sprint="Sprint 2"` · C `drift missing-sprint … moved_target="Backlog"` · D `kind="moved-without-target"` · E `Sprint 12` zero drift · F `../backlog.md` zero drift.

**E6 — baseline.** `node --test test/*.test.js` → 560 pass / 0 fail / 17 suites.

**E7 — claims verified against disk.** `dashboard.sh` reads no brief `## Priority` (zero `"Priority"` field reads). `prove-red.sh` has zero `dashboard` references. `task-status-vocabulary.md` and `status-report-format.md` are both `audience-adapted` entries in `dual-home-parity-exceptions.mjs`. Scaffold ships no `sprints/backlog.md`. `extract_rows` scopes to the first `## Status` section and exits at the next `## ` heading; sprint-2.md's `0210` row Status cell is `🔄 In progress`.

**Not verified:** GNU-sed behavior of the chosen form — no GNU `sed` on this machine. `-E`/ERE alternation is POSIX-specified and GNU supports `-E` as a documented synonym for `-r`, so the risk is low, but it was not executed. CI would confirm.
