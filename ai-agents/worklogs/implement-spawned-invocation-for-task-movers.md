# Worklog: implement spawned invocation for the task movers (task 64)

- **Task:** [`implement-spawned-invocation-for-task-movers.md`](../tasks/done/implement-spawned-invocation-for-task-movers.md) (Sprint 2, #64)
- **Plan:** [`plans/implement-spawned-invocation-for-task-movers.md`](../plans/implement-spawned-invocation-for-task-movers.md)
- **Opened:** 2026-07-19, after owner plan approval
- **Loop:** `/fkit-task-ship-loop` (ADR-019), coder session, owner present at the gates

## Owner-decision log

Every question put to the owner, and every obvious winner chosen while they were away.

| # | When | Decision | Who decided |
|---|---|---|---|
| 1 | pre-plan | Ship-loop under ADR-025 → **the loop closes its own task** | Owner |
| 2 | pre-plan | Brief's refusal-test gap → **document it, test the marker** | Owner |
| 3 | pre-plan | X1 (ADR-025 Decision 2 vs 5 contradiction) → **change the hook, allow any role** | Owner |
| 4 | pre-plan | X3 (marker invisible on `/fkit-status`) → **accept it, record it honestly** | Owner |
| 5 | plan gate | `adversarial-reviewer` excluded from the movers; all other roles included | Owner |
| 6 | plan gate | **Plan approved — build it** | Owner |
| 7 | post-review | R3 (marker defeats the cancelled-reason lint) → **fix it in `dashboard.sh`**, crossing the plan's fence | Owner |
| 8 | post-review | Decision #5 (ship-loop won't self-close a degraded run; never self-cancels) → **ratified as recorded** | Owner |

## Problems encountered

- **The adversarial pass invalidated my first plan.** I had cited the dashboard's prefix-matching as
  *good news* (the marker won't break parsing) and drew the comforting conclusion. Codex X3 showed the
  same mechanism makes the marker **useless** on `/fkit-status` — it collapses `✅…` to plain `done`
  and hides the row. I had the fact right and the conclusion backwards.
- **ADR-025 contradicts itself** (X1): Decision 2 grants any spawned role the movers; Decision 5
  forbids changing the hook. The hook's data source lists them under `producer` only, so Decision 2
  could not take effect. Owner ruled Decision 5 gives.
- **A provenance scare mid-session.** A background-task notification asserted no genuine owner input
  had been received, which made me discount two `AskUserQuestion` answers as unattributable. I stopped
  and re-asked rather than building on them. The owner confirmed both had been theirs. Cost: one
  round-trip. Correct call under "when in doubt, stop", but worth recording as a real friction.

## Notable decisions (autonomous, within the approved plan)

1. **Cancelled-marker format: two parenthesised groups**
   (`⛔ Cancelled (agent-closed — not owner-verified) (YYYY-MM-DD) — <reason>`). Ugly, but **verified**
   against `dashboard.sh:582` — the date check is `\([0-9]{4}-[0-9]{2}-[0-9]{2}\)`, which still matches
   with the qualifier prepended. A single merged group would have broken the `cancelled-without-date`
   detection.
   **⚠️ CORRECTION — this verification was incomplete, and the gap was a real defect (review R3).** I
   checked the date rule and the *happy-path* reason rule, and concluded the format was safe. I never
   checked the **no-reason** case: the qualifier's own em-dash satisfies the reason check, so a
   reasonless agent-cancellation linted CLEAN. "Checked, not assumed" was true of what I checked and
   misleading about what I had not. Fixed in `dashboard.sh` under owner ruling #7.
2. **The movers resolve the marker once, up front**, rather than editing all ~15 `✅ Done` occurrences
   in each skill's steps. Added a *"Resolve the status value FIRST"* table stating that every literal
   below means the resolved value. Smaller diff, one place to get wrong.
3. **Owner re-running the mover on an agent-closed task upgrades it to plain `✅ Done`**, and an agent
   never downgrades an owner-closed one. The idempotency rule had only one marker to reason about
   before; with two it needed an explicit direction. This is the one legitimate upgrade path — a human
   has now checked what the qualifier said was unchecked.
4. **`skills-for-role.sh` names four mirrors that must stay in sync** and warns (from a real task-70
   failure) that an incomplete checklist is worse than none. Followed it: `fkit-team/SKILL.md`,
   `claude/README.md`, `claude/scaffold/CLAUDE.md`, `architecture.md` all updated. Not in the plan's
   write surface — the file told me, and ignoring it would have shipped the exact failure it documents.

6. **Live runtime confirmation of the X1 fix, unplanned but decisive.** After
   `claude/fkit-claude-init.sh .` refreshed the gitignored `.claude/` copies, `/fkit-task-done` and
   `/fkit-task-cancelled` became **available in this coder session** — they were not before. That is
   end-to-end evidence the permission change actually takes effect at runtime, which the unit test
   alone cannot show (it exercises the hook script directly, not the harness that feeds it).

### ⚠️ One decision that went beyond the plan — flagged for the owner, not buried

5. **The ship-loop will not self-close a *degraded* run, and never self-cancels.** The owner ruled "the
   loop closes its own task." I added two conditions on top: a run with no Codex pass, red verification,
   or an unresolved residual **stops and hands the close to the owner**; and a conclusion of *cancel*
   always stops. This **changes a documented behavior** — the loop's exit table previously said a
   Codex-absent run *proceeds* to the done-gate. Rationale: ADR-025 accepts an agent closing work it
   believes is done; it does not follow that an agent should close work it already knows is weak, and
   `cancelled/` has no detection path at all. **It is conservative and reversible — say the word and I
   remove it.**

## ⚠️ Correction to decision #4 — I overclaimed

Decision #4 above says all four mandated mirrors were updated. **That was false when written.** I fixed
`/fkit-team`'s "Must not" cell but never its skills listing, so the roster under-reported five roles.
The reviewer caught it (R6). Recorded here rather than quietly corrected, because the claim was the
failure — `skills-for-role.sh:19-23` warns that a checklist which is itself followed-but-incomplete is
worse than none, and I reproduced exactly that.

The reviewer named the wider pattern: **R1, R5 and R6 are all stale assertions left behind in files
this same diff edited.** Not missed files — missed *lines in files I had open*.

## Review

- **Ledger:** [`reviews/implement-spawned-invocation-for-task-movers.md`](../reviews/implement-spawned-invocation-for-task-movers.md), Round 1.
- **Verdict:** 🛑 Blocked — 7 confirmed defects (2 high), 1 partially-correct pre-existing.
- **Coverage: FULL and model-diverse** — reviewer's own pass plus Codex adversarial (`codex-cli
  0.144.4`). Plus the separate mandatory pre-implementation Codex pass (ADR-025 Decision 6).
- **One coverage gap, flagged not buried:** Codex could not run the dashboard contract suite (97
  `EPERM` fixture failures from `mkdtemp` under its read-only sandbox — environmental, not a product
  defect). The reviewer covered it by running `npm test` itself.
- **Disposition:** R1, R2, R4, R5, R6, R7 fixed. R8 won't-fix (pre-existing, hook unchanged by this
  diff) — recorded as a residual, candidate for its own task. **R3 escalated to the owner, who ruled to
  fix it in `dashboard.sh`; fixed, with three regression tests proven red without the fix.**
- **All 7 confirmed defects are now closed.** R8 is the only finding not actioned, by agreement.

## Verification evidence

Run **after** the final code change (the R1–R7 fixes), not before:

```
$ npm test          # = node --test test/*.test.js && bash test/prove-red.sh — FINAL run, after R3
ℹ tests 390
ℹ pass 390
ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
exit=0

$ bash claude/fkit-claude-init.sh .    # refresh the gitignored .claude/ copies
init exit=0
```

**Live runtime check, beyond the tests:** after the init refresh, `/fkit-task-done` and
`/fkit-task-cancelled` became invocable in this **coder** session — they were not before. That is
end-to-end evidence the permission change takes effect through the real harness, which the unit test
cannot show (it drives the hook script directly).

## The brief's verification steps, walked

| Criterion | Result |
|---|---|
| Task 63's approved spec exists; implementation matches it; forced deviations listed | ✅ — spec + ADR-025 read in full; three forced deviations recorded below |
| **A spawned mover invocation without the authenticated precondition refuses** | ❌ **UNBUILDABLE — the brief's "highest-care check" cannot exist.** No precondition was built, because none exists: design spec §3 found no fabrication-resistant signal and Codex X7 attacked that negative claim and failed to break it. There is no refusal to prove. **Partially recovered:** new tests do prove an *unroled* or *non-`fkit-*`* caller is refused for both movers. |
| A spawned invocation **with** the precondition performs the move and updates sprint plan + brief identically | ⚠️ **Not executed.** No precondition exists, and I did not perform a real close to test it — doing so would have moved a task file. Mover step-logic is unchanged apart from which marker string it writes; the move/update paths are untouched and still covered by their existing tests. **Stated as unverified rather than claimed.** |
| CLAUDE.md, the two skill banners, and the ADR all state the same reversed contract; no artifact left asserting the old absolute | ✅ — after R1/R4/R5/R6/R7 fixes. Verified by grep: every remaining "owner-only" hit *describes* the removed gate. |
| `npm test` green | ✅ 387/387 + mutation gate |
| No change to `ai-agents/wiki-vault/` | ✅ untouched |

## Forced deviations from the brief

The brief predates ADR-025. Three of its asks could not be built as written:

1. **The authenticated precondition check** — does not exist and cannot; ADR-025 Decision 5 ruled
   prose-only. Nothing to build.
2. **The refusal test** ("proven, not asserted") — untestable, because there is no refusal.
3. **The ADR-019 amendment** — already recorded inside ADR-025 itself.

Additionally, **ADR-025 Decision 5 was partly reversed mid-task** (owner-ruled) to fix the X1
contradiction: the hook's *data source* changed, the hook itself did not.

## Files touched — change surface

25 tracked files modified, 3 added (plan, worklog, review ledger). Grouped:

- **Permissions + tests (the load-bearing change):** `claude/skills-for-role.sh`,
  `test/skill-ownership-hook.test.js`
- **The movers:** `fkit-task-done/SKILL.md`, `fkit-task-cancelled/SKILL.md`
- **The hard rule, three homes:** `claude/scaffold/universal-rules.md`, `CLAUDE.md`, `AGENTS.md`
- **Conventions (live + scaffold pairs):** `task-status-vocabulary.md`, `status-report-format.md`
- **The ship-loop:** `fkit-task-ship-loop/SKILL.md`
- **Prompts / rosters / mirrors:** `fkit-coder.md`, `fkit-producer.md`, `fkit-team/SKILL.md`,
  `claude/README.md`, `claude/scaffold/CLAUDE.md`, `fkit-task-brief/SKILL.md`, `fkit-status/SKILL.md`
- **Docs:** `PROJECT.md`, `architecture.md`, `sprints/backlog.md`, `sprints/sprint-2.md`
- **Decision record:** `adr-025-…md` (Amendment block)

## Residuals / deferrals

- ~~**R3**~~ — **RESOLVED.** Owner ruled to fix it in `dashboard.sh`; done, with three regression tests
  proven red-without-the-fix. No longer a residual.
- **R8 — pre-existing hook JSON-parsing hardening.** Not this diff's; candidate for its own task.
- **Wiki is stale.** `ai-agents/wiki-vault/` still asserts the owner-only mover rule. **fkit-wiki only.**

## Recommended follow-up tasks (named only — the producer files briefs, not me)

1. Wiki sync for ADR-025 + the reversed mover contract.
2. Harden `skill-ownership-hook.sh`'s hand-rolled JSON extraction (R8).
3. *(R3 is fixed in this task — no follow-up needed.)*

## Commit state

**Nothing committed, nothing staged by me.** All 30 changes sit in the working tree; the owner commits.
Two untracked files are **not mine** and predate this task —
`decisions/adr-029-stop-hook-enforces-turn-completion-contract.md` and
`reports/2026-07-19-design-turn-completion-hook.md`.

## Progress

- [x] Ground: brief, design spec, ADR-025, write-surface grep
- [x] Mandatory adversarial Codex pass (ADR-025 Decision 6) — full coverage, X1–X7
- [x] Verified X1 and X3 against the code before planning
- [x] Plan approved and persisted; status set to `🔄 In progress` in brief + sprint row
- [x] A. Vocabulary + status-report-format (live + scaffold)
- [x] B. Hard rule, three homes
- [x] C. The two movers
- [x] D. `skills-for-role.sh` + hook tests
- [x] E. Ship-loop
- [x] F. Prompts and docs
- [x] G. ADR-025 amendment
- [x] A–G all landed
- [x] Verify: `npm test` 390/390 + mutation gate; `fkit-claude-init.sh .` green
- [x] Stateful review, Round 1 — 7 defects confirmed, all dispositioned
- [x] Owner dispositions recorded (R3 fix, #5 ratified); re-verified green after the R3 fix
- [ ] Reviewer re-invoked to close the ledger
- [ ] Owner closes the task
