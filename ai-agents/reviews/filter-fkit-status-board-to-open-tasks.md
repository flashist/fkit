# Review — filter-fkit-status-board-to-open-tasks

Task: [`ai-agents/tasks/done/filter-fkit-status-board-to-open-tasks.md`](../tasks/done/filter-fkit-status-board-to-open-tasks.md)
Plan: [`ai-agents/plans/filter-fkit-status-board-to-open-tasks.md`](../plans/filter-fkit-status-board-to-open-tasks.md)
File(s) under review: `claude/skills/fkit-status/dashboard.sh` · `claude/skills/fkit-status/SKILL.md` · `test/dashboard-contract.test.js`
Reviewers (round 1): fkit-reviewer (own pass) + Codex `codex-cli 0.144.4` (adversarial) — **both ran; coverage is full**
Status: in-review

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `test/dashboard-contract.test.js:163` | The `in Sprint N` next-step shape lost **all** test coverage. The deleted assertion `assert.match(boardRows(out)[0], /\| in Sprint 2 \|$/)` was never replaced; the comment at :163-164 claims "still covered — on a moved row that DOES carry drift (the test below)", but that test (:170-181) asserts `waiting on owner`, because disagreement takes the override. **Mutation-proven**: corrupting `dashboard.sh:608` to `next="in TOTALLY-WRONG"` fails **1** test pre-change and **0** post-change (87/87 still green). The false comment also defeats future rediscovery. |
| R2 | 1     | medium | `ai-agents/knowledge-base/conventions/status-report-format.md:56-57` | The project convention still **mandates the reversed behavior**: "Show the real status of every task — including cancelled/moved rows if the sprint carries them. A board that hides its dead rows is a board that lies about scope." This is the exact stale-authority failure the new guard comment (`dashboard.sh:629-631`) predicts and warns readers about — but the live instance was left in place. Any agent reading the convention is instructed to build the pre-change board. Outside the plan's declared file scope, so this is a completeness gap, not a boundary violation. |
| R3 | 1     | medium | `claude/skills/fkit-status/SKILL.md:183-184` | Internal contradiction, both bullets introduced by this diff. :183-184 says a drift fact about a closed task belongs in beat 6 "even though its row is not on the board"; :185-188 and `dashboard.sh:655-656` guarantee a drifted row **always renders**. By construction (every in-loop drift fact calls `mark_drift`), a drift fact whose row is hidden **cannot exist**. The bullet describes an impossible state and teaches the LLM not to question a drift fact with no visible row. What is actually true for hidden rows is the `total` / `count *` facts. |
| R4 | 1     | low    | `claude/skills/fkit-status/SKILL.md:304` | Residual pre-change phrasing: "**Beat 7 is always the complete board**, however many rows that is". The rule's intent (do not truncate what the script emitted) survives, but "complete board" now reads ambiguously against :175-188, which omit closed rows by design. |
| R5 | 1     | low    | `test/dashboard-contract.test.js:1307` | Test titled "⟦FACTS⟧ still reports drift on a row **the board hides**" does not exercise a hidden row: `cancelled-without-date` calls `mark_drift`, so Alpha renders. Its assertions are valid and worth keeping; only the title/intent is wrong. Per R3 the named scenario is unreachable, so the title should describe what it does cover (a drift fact on a **closed-marked** row survives into `⟦FACTS⟧` and the roll-up clause). |

### Attacks that found nothing — verified negative

These were checked directly and are **sound**; recording them so a later round does not re-derive them.

- **The invisible-finding hole (the coder's question 1) — none exists.** Enumerated every `add_fact`
  call: `dashboard.sh:499,502,547,551,575,579,592` and `:627` are the 8 in-loop drift facts and **all
  8 call `mark_drift`**; `:619,624` are `derive` facts reachable only from the `*)` arm, i.e. never on
  a `done`/`cancelled`/`moved` key; `:680,686` are plan-level and have no row. **No row-scoped fact can
  reach `⟦FACTS⟧` without forcing its row to render.** Raised as a no-finding by both reviewers.
- **The `mark_drift()` refactor (question 2) is 1:1.** All 8 former appends converted; no direct
  `DRIFT_TASKS` append survives outside the helper (`:432` init, `:447` helper only). `tid` is assigned
  at `:460`, before the first call site at `:500`. `row_drift` is reset at `:452`, after the only
  earlier `continue` (`:450`, non-`D` records, which never render or emit facts).
- **Shell mechanics.** `done <<EOF` is a heredoc, not a pipe — no subshell, so `DRIFT_TASKS` /
  `row_drift` / counters persist. `set -u` is safe against the new variable (initialized before
  expansion). `case "$key" in done|cancelled|moved)` are exact alternatives, not globs.
- **The roll-up / `— of M` invariant holds.** `total` and every `c_*` counter increment at `:452-471`,
  well above the guard at `:655`. Verified live: an all-`moved` fixture emits `1 moved  —  of 1`.
- **The other 8 rewritten tests kept their coverage.** The removed `/\| closed \|$/` and `/\| dead \|$/`
  assertions are both replaced at `:1360-1361`; board-length assertions that shrank are backstopped by
  preserved `rollupSum` assertions. `in Sprint N` (R1) is the **only** genuine loss.
- `npm test` independently re-run: **351 pass / 0 fail**.

## Re-litigates settled decisions (suppressed)

- **The reversal itself** ("hiding closed rows lies about scope") — settled by owner ruling 2026-07-18,
  four rulings recorded in the task brief. Not raised by either reviewer. Note R2 is **not** this: it
  reports a stale document that still asserts the old rule, not an argument to restore it.
- **No `full`/`all` toggle** — settled by `conventions/one-skill-one-output.md` (task 44); would need a
  reversal ADR. Not raised by either reviewer.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

**Round 1 — coder verdicts, 2026-07-18.** Every finding independently verified against the code before
acting; none taken on the reviewer's word. **All five confirmed CORRECT; none disputed.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | Added the `in Sprint N` assertion to the clause-trim test (`:325`), whose no-brief fixture is the only remaining moved-row render without a disagreement. Corrected the false coverage claim in the comment at `:163-164`. | **fixed** |
| R2 | **CORRECT** | Defect | **Not fixed — outside the approved plan's file scope; escalated to the owner** (ship-loop step 6: a fix outside the plan stops). See below. | **awaiting owner** |
| R3 | **CORRECT** | Defect | Rewrote the `⟦FACTS⟧` bullet: it now says `total`/`count *` cover hidden rows, and states that a `drift` record with no visible row is **a bug to report**, not a state to explain away. | **fixed** |
| R4 | **CORRECT** | Defect | `Rules` section: "Beat 7 is always the complete board" → "always the board the script rendered", with an explicit "no longer version either — closed rows are not a hidden mode". | **fixed** |
| R5 | **CORRECT** | Defect | Retitled to "a drift fact on a **closed-marked** row survives into `⟦FACTS⟧`…", with a comment recording that the originally-titled scenario is unreachable by construction. Assertions unchanged. | **fixed** |

### Verification of the fixes

- `npm test` — **351 pass / 0 fail** after the final change.
- **R1 re-proved by the reviewer's own mutation.** `dashboard.sh` `moved)` arm mutated to
  `next="in TOTALLY-WRONG"`: **0 failures before the fix → 1 failure after.** The lost coverage is
  genuinely restored, not merely asserted — which is the standard R1 itself was raised under.
- Live sprint-2 run: exit 0, roll-up `50 done · 1 in progress · 20 backlog · 2 cancelled — of 73`.
  The only `⟦FACTS⟧` delta from the pre-change baseline is `count backlog 21` →
  `count in-progress 1` + `count backlog 20` — **task 65 itself flipping to `🔄 In progress`**, not a
  behavior change. `total 73` unchanged.

### On R2 — why it was not fixed autonomously

R2 is correct and I am not disputing it: `conventions/status-report-format.md:56-57` still instructs
agents to *"show the real status of every task… a board that hides its dead rows is a board that lies
about scope"* — a live, agent-readable instruction contradicting shipped behavior, which task 66's
wiki sync will **not** catch (the vault is clean).

It is nonetheless **outside the approved plan's three-file scope**, and the ship-loop's autonomy is
bounded by fix *shape*, not verdict: a change outside the plan stops for the owner even when the
finding is unambiguous. Correcting a **convention document** is also the kind of edit that should be a
deliberate decision rather than a side effect of a skill change. Escalated with a recommendation to
fix it here.

**Reviewer's independence preserved:** the *Reviewer findings* section above is untouched.

## Accepted residuals (shared, do-not-re-litigate)

- **Board shows open work only** — What: rows whose reconciled state is `✅ Done` / `⛔ Cancelled` /
  `➡️ Moved` are omitted from `⟦BOARD⟧`; the roll-up still counts every row and ends `— of M`;
  `⟦FACTS⟧` is untouched; any row carrying drift renders regardless of marker. · Why (structural):
  owner ruling 2026-07-18, reversing the earlier "show the dead rows" principle; the retained roll-up
  is the agreed mitigation for the scope-honesty objection. Rejected alternatives: keep dead rows
  (the reversed status quo); a `full`/`all` toggle (violates one-skill-one-output, task 44). ·
  Re-raise only if: the roll-up stops counting hidden rows, `⟦FACTS⟧` stops reporting them, or a
  drifted row is found to be hidden.
