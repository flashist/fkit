# Worklog — `0415` Keep a closed sprint's tasks attached when its board is named `plan-sprint-N.md`

## 2026-09-26 — plan written (plan-only spawn, no source touched)

> **Who wrote this.** A spawned `fkit-coder`, plan-only, driven by `fkit-lead`. It has no owner
> channel (ADR-021). It wrote only `plan.md` and this file. Nothing outside the task folder was
> changed, and the sibling project was only read.

**Grounding done (read-only):**

- Read these files:
  - `bin/fkit-board.mjs`: `boardId`, `boardIdFromFile`, `readBoards`, and the collision warnings;
  - the identity ladder in `dashboard.sh` (ADR-040 §2/§3) and ADR-041 §5 (one identity grammar);
  - the 0411 source-grep contract in `test/board-reader.test.js`;
  - 0412's `test/board-root.test.js` and its plan.
- The wiki has no page on the board reader.
- Ran `dashboard.sh identity` on every board in both trees. File name and heading agree everywhere
  either one resolves.
- Ran a baseline `makeReader` snapshot on both trees, and simulated fix (a) from a scratch script (no
  source edited). Numbers are in plan §1 and §3.
- ⚠️ **The sibling tree is being edited live.** Its S-005 done count moved from 4 to 5 between two
  read-only runs. That is why plan §6 compares the old and new reader back-to-back.
- Timed `select-active` on each archive dir: about 270–320 ms. This is the cost of option (c).
- Baseline tests: `node --test` on the three `board-*.test.js` files gave **36/36 green**. That
  includes the untracked, unrelated `board-narrow.test.js`.

**Brief item 5 — does aiboard's page show Done sprints? (read-only, `aiboard/web/index.html` at HEAD
`df554b9`, unmodified)**

- **Yes. Nothing hides Done or Cancelled sprints.** Three places show them:
  1. the **Sprints** tab (top right, next to "Board"): one card per board;
  2. the **sprint drop-down** beside it (Board tab only): each board appears as
     `S-004 · <title> (Done)`, and picking one filters the Board to that sprint, with its closed tasks
     in the greyed-out done and cancelled columns;
  3. the task chips (such as `S-004`) under **All tasks**.
- **What the owner saw before the fix.** The Sprint 4 card existed as `S-plan-sprint-4 · …` with
  0/0 done. `S-004` was missing from the drop-down, so the 110 tasks sat under no sprint option.
- **After the fix,** the card and the drop-down read `S-004`, with 105/110 done and 5 cancelled.
- **Quirks on aiboard's side** (not changed here, already known from 0411):
  - cards sort by id only, so Done boards are not grouped at the end;
  - by the CSS, a `Done` badge may render blank (white text, no background). This comes from reading
    the stylesheet; **it was not confirmed by rendering**;
  - the page remembers the last drop-down choice in browser storage, so the owner may need to
    re-pick `S-004` after the fix.

**Decisions put to the plan gate:** (1) the derivation: (a) is recommended over (b) and (c); (2) the
12 `Sprint backlog — …` tasks: out of scope, with a follow-up recommended; (3) whether the T4 guard
must also be shown red. Details are in plan §NEEDS-DECISION.

**Decision log (fixes applied without asking / obvious-winner calls):** none. This was a plan-only run.

## 2026-09-26 — build + verify (spawned coder, driven by `fkit-lead`)

> **Who wrote this.** A spawned `fkit-coder`, driven by `fkit-lead` as a plain conductor (**not**
> `/fkit-sprint-ship-loop`). No owner channel (ADR-021). Built exactly plan §4 on the owner's plan-gate
> approval, relayed by the lead.
>
> **Owner rulings at the plan gate** (2026-09-26, live `AskUserQuestion` in the lead session; ⚠️
> **selected option text, agent-written — not the owner's own prose**):
> - Plan: *"Approve — Coder builds exactly this one-line fix + tests; then review; then the producer
>   closes it (agent-closed — not owner-verified)."* → decision 1 = **(a), file-name prefix**.
> - Decision 2, the 12 `Sprint backlog — …` tasks: *"Leave them — No task. They stay visible only
>   under 'All tasks'."* → **owner-accepted, out of scope, no follow-up task.**
> - Decision 3, T4: *"Keep separate — If the fix ever goes too far, it's obvious which part broke. It
>   passes before and after, by design."*

**Changed files:**
- `bin/fkit-board.mjs` — `boardIdFromFile()`: `/^sprint-/` → `/^(?:plan-)?sprint-/`, plus a 4-line
  comment (+5 −1). Nothing else in the file. No banner token in the comment; test C passes.
- `test/board-archived-id.test.js` — new, 220 lines, T1–T5 per plan §4.2. Temp-dir fixtures only.

**Red first (verification 1)** — new file run against the unchanged reader (hash matched `HEAD`):
- ✖ T1 — `actual: 'S-plan-sprint-4', expected: 'S-004'`
- ✖ T2 — `actual: 'S-plan-sprint-4b', expected: 'S-4b'`
- ✖ T3 — `actual: 'S-plan-sprint-7', expected: 'S-007'`
- ✔ T4 — green, by design (owner ruling, decision 3)
- ✖ T5 — `one S-004 warning; got []`

After the edit: the new file plus 0411's and 0412's board files, **30/30 green**.
`test/board-reader.test.js` and `test/board-root.test.js` **not edited** (verification 5).

**fkit's own tree unchanged (verifications 2 and 4)** — old reader (a copy taken before the edit) and
new reader run back-to-back, output normalized to boards (id, location, status, counts, task ids),
tasks (id, sprint, status), `warnings`, `problems`; `generated` dropped:
- `diff` of the two outputs: **empty** (2663 lines each).
- Corpus line, both: `415 tasks, 11 boards, 256247 payload bytes`.
- `warnings`: `[]` both. `problems`: `[]` both.

**Sibling project, read-only (verifications 3 and 4)** — every file under its `ai-agents/` hashed
(870 files), old and new reader run back-to-back, hashed again: **hashes identical**.

| Board (archived, `done/`) | Old id / tasks | New id / tasks |
|---|---|---|
| `plan-sprint-1.md` | `S-plan-sprint-1` / 0 | `S-001` / 0 |
| `plan-sprint-2.md` | `S-plan-sprint-2` / 0 | `S-002` / 0 |
| `plan-sprint-3.md` | `S-plan-sprint-3` / 0 | `S-003` / 0 |
| `plan-sprint-4.md` | `S-plan-sprint-4` / 0 | **`S-004` / 110 (105 done, 5 cancelled)** |
| `plan-sprint-4b.md` | `S-plan-sprint-4b` / 0 | `S-4b` / 4 (4 done) |
| `plan-sprint-4c.md` | `S-plan-sprint-4c` / 0 | `S-4c` / 8 (7 done, 1 cancelled) |
| `hotfix-post-sprint2.md` | `S-hotfix-post-sprint2` / 0 | unchanged |

- Open boards, every task's sprint value, `warnings` and `problems`: **identical** old vs new. No other
  board field changed.
- `warnings`, both: only the existing `BACKLOG` one (`backlog.md`, `sprint-backlog.md`). No new
  collision.
- Still unattached after the fix, all expected: `S-backlog` 12 (owner-accepted, decision 2), `S-3.` 1
  (out, plan §5), no sprint 59 (out, plan §5).
- ⚠️ **Correction to brief verification 3**, as planned: S-001/S-002/S-003 correctly get **0** tasks —
  no brief in that project names Sprint 1, 2 or 3. Their ids are right; there is nothing to attach.
- The tree is edited live (its open S-005 read 7 done this run, 4–5 at plan time). The back-to-back
  run makes that irrelevant to the old/new comparison.

**Full suite (`npm test`, after the edit):** exit 0. `node --test`: **1017 tests, 1017 pass, 0 fail**
(0 cancelled, 0 skipped). `test/prove-red.sh`: hard gate **PASSED** — baselines green, all 40
mutations red on their named assertion. Includes the untracked, unrelated `test/board-narrow.test.js`
(green).

**Decision log (fixes applied without asking / obvious-winner calls):** none. Everything built is
inside the approved plan; no review finding exists yet.

## 2026-09-26 — review round 1 processed (spawned coder, driven by `fkit-lead`)

> **Who wrote this.** A spawned `fkit-coder` running `/fkit-process-stateful-review`, driven by
> `fkit-lead` as conductor (ADR-031 path, not `fkit-sprint-ship-loop`). No owner channel (ADR-021).
> The owner approved this exact fix set live in the lead's session (selected options, relayed
> verbatim): R1 "Add that file to the test", R2 "Fix the comment", residual "plan-sprint-4-old →
> S-4-old" "Keep it". Nothing outside that set was changed.

**R1 (test gap) — PARTIALLY CORRECT, fixed.** T4 gained `done/hotfix-post-sprint-2.md` expecting
`S-hotfix-post-sprint-2`; its header no longer overclaims. Mutants of the `boardIdFromFile()` prefix
rule, run in a scratch mirror against the test file before and after:

| Rule | Old T4 | New T4 |
|---|---|---|
| shipped `/^(?:plan-)?sprint-/` | 5/5 | 5/5 |
| `/^.*?sprint-/` (open) | 5/5 | **4/5, T4 red** |
| `/^(?:[a-z]+-)*sprint-/` (open) | 5/5 | **4/5, T4 red** |
| `/(?:plan-)?sprint-/` (unanchored) | 5/5 | 5/5 |

- The unanchored rule stays green because it is a near-equivalent mutant, not an over-reach:
  `boardId()` itself anchors on `Sprint`, so a mid-stem replacement never yields a sprint id. Probe of
  14 stems: identical ids on 12 (both hotfix names included); different only on `Sprint 4sprint-2`
  and `Sprint 4-sprint-2` (a file name starting with `Sprint ` and a space). The header says this
  rather than claiming the case is caught.
- The pre-0415 reader (`git show HEAD:bin/fkit-board.mjs`): new T4 still green; T1, T2, T3, T5 red,
  as designed.

**R2 (comment) — CORRECT, fixed.** The `boardIdFromFile()` comment now adds "when its H1 title and
file name agree (an open board's id comes from its H1 first)". Comment only. No banned banner token
added (`test/board-reader.test.js` scans the whole reader file and passes).

**Three board files:** 30/30 pass.

**Decision log (fixes applied without asking / obvious-winner calls):** none applied without asking —
both fixes are the owner-approved set above. One wording call inside R1: the header was rewritten to
state the unanchored mutant is not caught (and why), since the fix could not make the claim true.

**Full suite (`npm test`, after both fixes):** exit 0. `node --test`: **1017 tests, 1017 pass, 0 fail**
(0 cancelled, 0 skipped) — same count as before; the new fixture adds an assertion, not a test.
`test/prove-red.sh`: hard gate **PASSED**.

**Ledger:** *Coder response* rows R1, R2 written, both `✅ done`. `Status:` left `in-review` for the
reviewer's round 2. No residual added (the suffix-looseness one was already recorded). Not committed.

## 2026-09-26 — close, by a spawned `fkit-producer` (no owner channel, ADR-021)

Closed via `/fkit-task-done` as **`✅ Done (agent-closed — not owner-verified)`** (ADR-033 §5), driven
by `fkit-lead`. **The owner has not personally verified the build.**

Evidence, read by this producer in `review.md` and this worklog (not taken on relay alone):
- **Review converged.** Ledger header `Status: closed-out`; R1, R2 both `✅ done`. ⚠️ The lead relayed a
  round-2 verdict *"✅ Ready to merge"*; that string does **not** appear in `review.md` — it came from
  the reviewer's reply to the lead, not the ledger.
- **Coverage.** Round 2 per the ledger: Claude reviewer measured (9 regex mutants, a 19-stem probe,
  board files 30/30); Codex reasoning-only (read files, ran nothing). Round 1 "both measured" is the
  lead's relay — the ledger's `Coverage:` line records round 2 only.
- **Findings.** R1 (T4 missed over-broad prefix rules) fixed: `/^.*?sprint-/` and
  `/^(?:[a-z]+-)*sprint-/` now T4-red. The unanchored rule stays green as a near-equivalent mutant
  (ids differ only on stems already starting `Sprint` + whitespace — reviewer's probe). R2 (comment
  caveat) fixed. Known, accepted nit (lead's relay, not a ledger row): a single-word-prefix over-broad
  rule is not caught by T4.
- **Accepted residuals** (owner rulings 2026-09-26, ⚠️ selected option text, not the owner's prose):
  id from file name not H1 (plan approval, derivation (a)); suffix looseness `plan-sprint-4-old` →
  `S-4-old` ("Keep it"); the 12 sibling `Sprint backlog — …` tasks ("Leave them — No task").
- **Tests — the coder's run:** `npm test` exit 0, 1017/1017; `prove-red.sh` 40/40. ⚠️ prove-red holds
  no board-reader mutants; the reviewer's probes are the only mutation evidence. Board files 30/30
  (reviewer re-ran).
- **Effect, measured by the coder (read-only):** sibling project's done Sprint 4 board now `S-004`
  with 110 tasks (105 done, 5 cancelled); `S-4b` 4, `S-4c` 8; sibling tree byte-identical before/after;
  fkit's own reader output diff empty.

Move note: the folder was **untracked** (never committed), so it was moved with plain `mv`, not
`git mv`. Nothing committed.
