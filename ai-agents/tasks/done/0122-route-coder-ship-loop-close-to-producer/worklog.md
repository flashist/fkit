# Worklog — 0122 Route the coder ship-loop's close to the producer

**Task:** `0122-route-coder-ship-loop-close-to-producer` · **Owner:** fkit-coder · via
`/fkit-task-ship-loop`. Plan approved (see `plan.md`). Status → 🔄 In progress (brief + sprint row).

## Owner-decision log
- **Plan approved** (the upfront gate, 2026-07-25).
- **Design choice put to the owner and answered** (`AskUserQuestion`, before the plan gate): ADR-033 §3
  offers two forms of the new terminal act. Owner chose **"spawn producer; owner only if degraded"** —
  step 9 spawns `@fkit-producer` (hop 1) to close by default; degraded runs (no Codex pass, red
  verification, unresolved residual, should-be-cancelled) still STOP and hand the close to the owner.
  Rejected: always-hand-to-owner (diverges from 0123's sprint loop), and spawn-after-owner-ack
  (re-adds ADR-019's removed done-gate — beyond ADR-033's scope).

### Post-close dispositions (2026-07-25, live `AskUserQuestion` — third and final owner contact)
- **0124's two extras (verification step 8 + the Notes provenance entry): KEEP.** They stay in 0124's
  brief; step 8 is what makes the carve-out checkable at 0124's own close.
- **The staged `git mv` rename: LEAVE STAGED.** Owner accepts a non-clean index; the rename is pure
  (0 insertions / 0 deletions) and preserves rename detection. Still **uncommitted**.
- **The agent-closed marker: LEAVE AS-IS.** Owner declined the owner-verified upgrade for this task.
  `✅ Done (agent-closed — not owner-verified)` is the final, accurate record: **no human read this diff.**

## Grounding
- **ADR-033** read in full — §1 (producer-only, hook-structural via ADR-018), §3 (this task's driver),
  §5 (a spawned producer still writes the agent-closed marker), §The limit (extra-hop laundering is
  **not** closed — accepted, named, do not harden beyond the ADR), §"re-raise only if".
- **Scope fenced against sibling briefs**: `fkit-coder.md` self-close prose → 0124 item 5 (explicitly
  listed there); `skills-for-role.sh` + mirrors + hook test + mover SKILLs → 0124; sprint loop → 0123;
  vault pages → 0126. Nothing in those files touched here.
- **Hooks checked, unaffected:** `claude/shiploop-marker-hook.sh` keys on `command_name`, not on skill
  prose; `test/skill-ownership-hook.test.js` asserts *ownership*, not text.
- **Test inventory — corrected after review R5.** As first written this said three tests "read SKILL
  text". Wrong: `task-id-uniqueness`, `dashboard-contract` and `skill-ownership-hook` only **mention**
  `SKILL.md` in comments. **No test reads any `SKILL.md` at runtime.** The conclusion is unchanged and
  in fact stronger — nothing in the suite asserts this file's prose, so a green suite proves *no
  regression*, not the change itself.

## Build

**One file edited: `claude/skills/fkit-task-ship-loop/SKILL.md`** (prose only, 12 planned sites + 1
consistency addition). Every site that asserted the ADR-025 self-close now reads as a producer hand-off:

- **Frontmatter `description`** — "brief-to-done … closes the task itself" → "brief-to-hand-off … Since
  ADR-033 it closes nothing itself: its terminal act is routing the close to the producer."
- **⚠️ banner** — retitled; now states the movers are producer-only + hook-enforced, that ADR-033 moved
  the close to another *agent* not a human, that it buys separation of the closing **identity** but
  **not** prevention (ADR-033 §The limit, L1 survives one hop longer), and that the plan gate is still
  the only human checkpoint.
- **Overview** — amendment chain re-cited (ADR-019 §Decision 5, amended by ADR-025 then ADR-033 §3) and
  the cost stated plainly: **autonomous shipping ends at a producer hand-off, not a green board.**
- **Durable-state bullet** — the relocating mover is now attributed to the producer.
- **Loop preamble** — "ships the task and closes it / may run to a green board" → hands the close off.
- **Step 6 partial-Codex bullet** — "do not self-close" → "do not route the close".
- **Step 9 (the core rewrite)** — no `/fkit-task-done` by the coder; spawn **@fkit-producer** (hop 1) to
  close, naming brief path + task-id + evidence packet; the **producer** writes the agent-closed marker
  (ADR-033 §5); a new *confirm the close landed, then report* bullet; both carve-outs reworded to
  "route" (degraded run → owner; cancel → always stops).
- **Owner-contact item 5**, **two failure-table rows**, **the `✅ Done` invariant**, **three hard rules**
  (plan-gate citation, "You close nothing yourself", "Never route a degraded run"), and
  "re-verify … before handing the close off".

### Autonomous decisions (obvious winners, in-plan)
- **Added one failure-table row** beyond the plan's 12 sites — "Blocked — hand-off didn't land" — because
  step 9 creates that terminal state and the table claims to be the complete no-silent-stall inventory.
  ⚠️ **The review then found this row defective (R1/R3) — it is now the main open question.**
- **Three formatting touch-ups**: split the over-long banner heading, re-wrapped the durable-state bullet
  to the file's ~100-col convention, and changed a hard rule's stale "before closing" → "before handing
  the close off".
- **Refreshed the gitignored `.claude/` mirror** by one-file `cp` rather than re-running
  `fkit-claude-init.sh` (which would touch unrelated local state). `diff` identical.

## Verification (pre-review, and re-run after the post-review fix)

- `node --test test/*.test.js` → **511 pass / 0 fail** (both runs). ⚠️ **This proves no regression, not
  the change** — no test reads any `SKILL.md` at runtime (see the corrected inventory above).
- ⚠️ **`plan.md:111` prescribes `node --test test/`, which FAILS** (`pass 0 / fail 1` — it tries to load
  `test/harness.mjs` and `prove-red.sh` as tests). Working invocation: `node --test test/*.test.js`.
  `plan.md` is **deliberately left unedited** — it is the owner-approved autonomy boundary, not to be
  silently rewritten after approval. Correction recorded here and in the review ledger.
- Brief's `## Verification steps`, walked:
  1. ✅ No `/fkit-task-done` invocation by the coder — the **five** remaining mentions are
     *never-invoke-it* (`:24`, `:163`) or *the producer invokes it* (`:105`, `:170`, `:262`).
     *(Corrected after the reviewer's phase-2 note: this read "four" at `:23/:161/:104/:252` — the R2
     fix added the `:170` mention and shifted every line number. Criterion 1 itself is unaffected.)*
  2. ✅ Step 9 spawns `@fkit-producer` at hop 1 and says so; degraded runs route to the owner.
  3. ✅ No surviving claim that the coder closes or writes the marker (grep sweep; independently
     re-swept by the reviewer, which found no 13th site).
  4. ✅ Prose only — no source or control-flow change; the step-3 plan gate and steps 1–5, 7, 8 are
     byte-unchanged (reviewer confirmed independently).
- `diff claude/… .claude/…` → identical (mirror refreshed).

## Review — round 1

**Ledger:** `review.md`. **Verdict: ⚠️ Changes requested — 6 defects (none blocking).** **Codex coverage:
FULL** — reviewer's own pass **plus** the Codex adversarial pass (`codex exec --sandbox read-only`,
exit 0). **No degradation, nothing skipped.** The reviewer downgraded Codex's `BLOCK`.

Coder verdicts (full detail in the ledger's *Coder response*): R1 CORRECT · R2 CORRECT · R3 CORRECT ·
R4 CORRECT (frontier-move) · R5 PARTIALLY CORRECT · R6 CORRECT.

- **Applied autonomously (2)** — mechanical, verified `CORRECT`, in-plan: **R6** (the banner misquoted
  ADR-033 as *"the doer…"*; it says *"the coder marks its own work done with an extra hop"* — now quoted
  exactly and attributed) and **R5** (this worklog's test inventory was wrong; corrected above).
- **⛔ STOPPED for the owner (4)** — R1+R3 (status doctrine when a hand-off half-lands), R2 (the confirm
  check tests 3 locations but `/fkit-task-done` writes up to 8 kinds), R4 (`fkit-coder.md:165`'s hard
  rule *"a consult is a focused question, not a hand-off"* vs step 9's action hand-off — **unowned by
  every filed brief**). Each is a behavior change or lies outside the approved plan.

### Owner dispositions (2026-07-25, live `AskUserQuestion` — the second owner contact of the run)
All three answered with the recommended option:
1. **R1/R3 → re-spawn to reconcile, then Blocked.** **Applied.** Step 9: if the close half-landed,
   re-spawn `@fkit-producer` **once** naming what disagrees; if it still fails, write
   `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations and STOP. The loop writes
   only its own `🚧 Blocked`, never a `✅ Done`. Failure-table row rewritten to match. `:250` left alone
   (pre-existing counter-invariant; the reviewer explicitly cautioned against over-fixing it).
2. **R2 → check the producer's own close-out report.** **Applied.** The confirm bullet now reads the
   producer's step-7 report (every doc touched, incl. repointed hrefs under `sprints/done/`,
   `sprints/reviews/`, knowledge-base) and cross-checks it, and says plainly that a three-location
   spot-check cannot see a partial close.
3. **R4 → add it to 0124 item 5.** **Routed, not written by me** — 0124's brief is a task-lifecycle
   document and both agent definitions are 0124's scope. Carried on the same producer spawn as the close.

**Reviewer's disproven-hypothesis worth keeping:** ADR-012 §Context recorded a spawned producer that
*could not see* `fkit-task-done`. If that still held, step 9's whole default path would be dead on
arrival after 0124. It does **not** hold — ADR-018 retired the per-role off-list (`build_settings()`
writes only `hooks`), and the ownership hook resolves the real caller at any spawn depth, so a spawned
producer is allowed the mover. **This is the load-bearing assumption of the design, and it was checked.**

## Residuals / deferrals

- **`fkit-coder.md:45/103/190` still asserts the coder self-closes**, and the coder **still holds the
  mover grant** until 0124 — so between 0122 and 0124 landing, the contradiction is live *and*
  un-enforced: a mistaken self-close would silently succeed rather than being hook-denied. **Frontier-
  move / accepted sequencing cost**, owned by **0124 item 5** (which names those lines explicitly).
  Not fixable here without taking 0124's scope.
- **R4 — `fkit-coder.md:165` / `fkit-producer.md:67`**: *"A consult is a focused question, not a
  hand-off"* is a **hard** rule that step 9's producer spawn sits astride. Owner ruled it belongs in
  **0124 item 5**; the request was routed to the producer. ⚠️ **OPEN until 0124's brief actually shows
  it** — a routed request is not a landed edit, and this residual is only closed by reading 0124's brief.
- **R2's fix carries its own named residual:** the widened confirm check depends on the **producer
  reporting honestly**. That is prose-enforced, not structural — the same trust class as the rest of the
  hand-off (ADR-033 §The limit). It narrows the gap; it does not close it.
- **R1/R2/R3** — resolved by the owner's dispositions above, all applied and re-verified.

## Review — round 1 closeout (reviewer phase 2)

**Ledger `Status: closed-out`.** Reviewer's closeout verdict: ✅ **Ready to close — 5 of 6 fixed and
verified, 1 routed and OPEN.** No second review pass run or needed; **converged in one round**. The
reviewer re-read the file rather than taking my fix report on trust, and independently re-ran
`node --test test/*.test.js` (511/0), the mirror `diff`, and the stale-self-close sweep.

It recorded **three accepted residuals** (each with What / Why / Re-raise-only-if): the widened confirm
check's trust in the producer's honest report · `:250` plus the unstated status on the degraded-run and
cancel STOPs · the 0122→0124 window where the coder's system prompt still says it self-closes *and* the
mover grant is still live. **R4 is filed separately as an open dependency, deliberately not as a
residual** — it is closed only by reading 0124's brief.

Its one non-blocking correction (the four-vs-five mention count in this worklog) is **applied above**.

## Change surface

- `claude/skills/fkit-task-ship-loop/SKILL.md` (modified — the only source file)
- `ai-agents/tasks/backlog/0122-route-coder-ship-loop-close-to-producer/brief.md` (status line only)
- `ai-agents/sprints/sprint-2.md` **line 137 only** (priority-105 row status)
- New in the task folder: `plan.md`, `worklog.md`, `review.md`
- `.claude/skills/fkit-task-ship-loop/SKILL.md` — gitignored mirror, refreshed (not a git change)

## Close — routed to the producer (the new step 9, dogfooded on itself)

The loop **did not** invoke `/fkit-task-done`. It spawned **@fkit-producer** (hop 1) with the brief path,
task-id and evidence packet — the exact behavior this task introduced, exercised on its own close.

**Producer's close-out report, cross-checked against visible state** (the widened R2 check, not a
three-location spot-check):

| Producer claimed | Verified |
|---|---|
| Folder `git mv`'d to `tasks/done/0122-…/`, all four reserved files together | ✅ new path has `brief.md`, `plan.md`, `worklog.md`, `review.md`; old path gone |
| Brief `## Status` → `✅ Done (agent-closed — not owner-verified)` | ✅ line 10 |
| `sprint-2.md:137` status cell + href → `../tasks/done/…` | ✅ both |
| Zero hits in `sprints/done/`, `sprints/reviews/`, `knowledge-base/` — **no historical record edited** | ✅ consistent with the sweep |
| Outbound ADR links from the moved folder still resolve (same depth) | ✅ |
| No commit | ⚠️ **see below** — nothing committed, but `git mv` **staged** the brief rename |

**Deliberately left alone by the producer, and correct:** `sprint-2.md:218`'s addendum prose (no href, no
status claim, historically true) and four bare `backlog/…` path mentions inside this folder's own records
(inline code in a record of what happened, not links).

**Not swept, and said so:** `ai-agents/wiki-vault/` is excluded by design (ADR-005). Whether a vault page
references 0122 is **unknown, not "clean"** — the repair, if any, is fkit-wiki's, and **task 0126** (wiki
resync for ADR-033) is already queued for this ADR's ripple.

**R4's open dependency is now CLOSED.** `0124-revert-task-movers-to-producer-only/brief.md:71-75` visibly
lists `fkit-coder.md:165` and `fkit-producer.md:67` as needing a sanctioned-hand-off carve-out, with the
provenance recorded. The producer also added a matching **verification step 8** and a Notes entry to 0124
— beyond what was asked, flagged here so the owner can back either out.

## Commit state

**Nothing committed.** ⚠️ **But the index is no longer clean:** the producer used `git mv`, which
**staged** the brief's rename (`git status` shows `RM …backlog/0122-…/brief.md -> …done/0122-…/brief.md`;
`git diff --cached` = 1 file, 0 insertions/0 deletions — a pure rename). This is a deviation from "leave
everything in the working tree" — harmless and arguably desirable (it preserves rename detection), but the
owner should know their index was touched. `git restore --staged` unstages it if they'd rather it were not.
`plan.md`, `worklog.md` and `review.md` were never git-tracked and remain untracked at the new path.

Note the tree also holds
**pre-existing uncommitted work by others** — `AGENTS.md`, `CLAUDE.md`, `ai-agents/sprints/backlog.md`,
the rest of `sprint-2.md` (the 2026-07-25 producer addendum), the 0118 and 0124 briefs, and the untracked
`0131`/`0132`/`0133` folders. **None of it is mine**; it was in the tree before this task started and was
fenced out of the review scope.
