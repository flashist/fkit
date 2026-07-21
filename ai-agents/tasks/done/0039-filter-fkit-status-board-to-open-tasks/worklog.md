# Worklog — Filter the `/fkit-status` board to open tasks only

**Task:** [`filter-fkit-status-board-to-open-tasks.md`](../tasks/done/filter-fkit-status-board-to-open-tasks.md)
· **Sprint 2, priority 65** · **Plan:** [`plans/filter-fkit-status-board-to-open-tasks.md`](../plans/filter-fkit-status-board-to-open-tasks.md)
· **Ledger:** `ai-agents/reviews/filter-fkit-status-board-to-open-tasks.md`

**Status: 🔄 In progress — READY FOR DONE.** Implemented, reviewed (round 1, closed out), re-verified
green. Awaiting the owner's `/fkit-task-done`; this loop never sets `✅ Done`.

## Review — round 1, closed out

**Ledger:** [`reviews/filter-fkit-status-board-to-open-tasks.md`](../reviews/filter-fkit-status-board-to-open-tasks.md)
· **Verdict: changes requested — 5 defects, none blocking.**

**✅ Codex coverage FULL — `codex-cli 0.144.4` completed.** The review was genuinely model-diverse; no
degradation, no partial-coverage flag.

All five findings independently verified against the code before acting; **all five CORRECT, none
disputed, all five fixed.** Every one landed in what the change *said about itself* — none in the
filter logic. The reviewer's own conclusion: the safety design is sound.

| # | What it caught | Disposition |
|---|---|---|
| R1 | The `in Sprint N` next-step shape lost **all** coverage, and my comment falsely claimed otherwise | fixed — assertion added to the one fixture that still renders it |
| R2 | `conventions/status-report-format.md` still mandated the reversed behavior | fixed — **owner-approved scope extension** (see below) |
| R3 | My own `⟦FACTS⟧` bullet described a state that **cannot exist** | fixed — now says a drift record with no visible row is a *bug to report* |
| R4 | `Rules`: "Beat 7 is always the complete board" | fixed |
| R5 | A new test's title described a scenario it doesn't exercise | fixed — retitled, assertions unchanged |

**R1 is the one worth remembering.** I asked the reviewer directly whether any rewritten test had lost
coverage, and my own audit said no. It had. The reviewer proved it by mutation rather than argument —
`0` failures before the fix, `1` after — which is the standard this repo already holds itself to and
which my self-audit did not meet.

**R2 stopped for the owner and was escalated, not applied.** It was correct and unambiguous, but
outside the approved plan's three-file scope, and ship-loop autonomy is bounded by fix *shape*, not
verdict. **Owner ruled: fix it inside task 65** (2026-07-18).

**One thing the review did not catch, found while fixing R2:** `status-report-format.md` is
**dual-homed** — `claude/scaffold/ai-agents/knowledge-base/conventions/status-report-format.md:59`
carried the same stale instruction and **ships to every consuming project**. Fixing only the dogfood
copy would have left every *new and existing* project instructed to do the opposite of what the code
does. Both homes now carry byte-identical text. This is the task-48/49 dual-home lesson recurring for
at least the fifth time; see the residual below.

---

## Owner-decision log

The autonomy audit trail: every question put to the owner, and every choice made without asking.

### Questions put to the owner

| # | Question | Owner's answer |
|---|---|---|
| 1 | Approve the plan for task 65 (the ship-loop's step-3 gate) | **Approved** (2026-07-18), as part of a batch approving all six planned tasks |

**⚠️ One process note, recorded rather than smoothed over.** An earlier answer to this same plan-gate
question was returned in-session and then flagged by a system notification as **not genuine human
input**. The loop **stopped and did not build on it** — no code, no status change, no worklog — and
re-asked. The approval recorded above is the second, genuine one. This is the correct behavior for an
unremovable owner gate and is logged so the pause is legible rather than looking like a stall.

### Obvious winners chosen without asking

| Choice | Why it was a winner, not a judgment call |
|---|---|
| `mark_drift()` helper rather than editing 8 sites in place | One code path for "record drift", so a future drift fact cannot append to `DRIFT_TASKS` while forgetting `row_drift`. Strictly dominates; entirely inside the plan. |
| Guard placed on the `BOARD_ROWS` append only | Counting/facts/roll-up are computed above it, so the three safety properties hold **by construction** rather than by a second rule that could drift. |
| Existing tests updated in place, intent preserved, rather than deleted | Deleting a failing test to make a suite green is the failure mode; each rewrite keeps what the test was for. Per-test rationale below. |
| Two extra tests beyond the brief's minimum (`closed`/`dead` on nonconformance-forced rows; all-closed empty board) | The filter would otherwise silently delete two of the four next-step shapes from suite coverage. Additive, in-plan. |
| Ran a two-mutation check | ADR-014 discipline; evidence the new tests bite rather than merely pass. |

**Nothing was applied that required a judgment call.** No frontier-move, no scope change, no
behavior-changing fix outside the plan.

---

## What changed

| File | Change |
|---|---|
| `claude/skills/fkit-status/dashboard.sh` | `mark_drift()` helper; per-row `row_drift` flag; the open-work filter guarding the `BOARD_ROWS` append |
| `claude/skills/fkit-status/SKILL.md` | `⟦BOARD⟧` section rewritten (open-work-only, the three properties, not-a-toggle); hand-built fallback passage rewritten — it previously instructed the exact opposite |
| `test/dashboard-contract.test.js` | 9 existing tests updated; 6 new task-65 tests added |
| `ai-agents/plans/…` · `ai-agents/worklogs/…` | New ship-loop records (not code) |

**Not touched:** the launcher, `skills-for-role.sh`, the scaffold (no copy of this skill exists), the
`.claude/` copies (gitignored, init-regenerated), the wiki.

## The 9 existing tests, and what each kept

| Test | Why it broke | How intent was preserved |
|---|---|---|
| `clean sprint` | its ✅ row is now hidden | asserts the done row is filtered **and** the roll-up still reads `1 done · 1 backlog — of 2` |
| `➡️ Moved … NOT drift` | clean moved row hidden | asserts 0 drift facts + row absent; the `in Sprint N` shape is still covered by the drifted-moved test below it |
| `brief ## Status wrapping` | ✅ row hidden | asserts no phantom drift + row absent — for an inert marker, **absent ⟺ undrifted**, so absence is a *stronger* assertion here |
| `clause trim never severs a link` | moved row hidden | fixture's brief removed ⇒ `missing-brief` drift forces the row to render; the Status cell under test is byte-identical |
| `two ## Status sections` | ✅ row hidden ⇒ 0 rows | primary row changed to `🔲 Backlog`, so the row count measures **table selection** and not the new filter |
| `R10 exact stdout` | pinned bytes included the ✅ row | re-pinned without it, with a comment that rows-shown ≠ rows-counted **is** the contract |
| `R17 empty Status cell` | 3 → 2 rows | the blank-status row still renders (its `missing-status-cell` drift forces it); R17's real point — `M` is the table, not the survivors — now carried by the roll-up |
| `R17 GFM no outer pipes` | 2 → 1 rows | admission asserted via `rollupSum` = 2, which the filter does not move — stronger than a row count here |
| `R21 clause trim presentation-only` | clean ⛔ hidden | asserts 0 drift + row absent; had the trim manufactured a defect, the row would have been forced back on — absence proves the property |

## Verification evidence

All from the run **after** the final code change.

```
$ npm test
ℹ tests 351   ℹ pass 351   ℹ fail 0
```

**Mutation check** — proving the tests bite, not just pass:

| Mutation | Result |
|---|---|
| filter disabled (`done\|cancelled\|moved) : ;;`) — the "revert to show-everything" regression | **10 failures** |
| filter on the raw marker, ignoring drift (`done\|cancelled\|moved) continue ;;`) — the "buries a finding" regression | **8 failures** |
| restored | 351 pass / 0 fail |

**Live run against this repo's Sprint 2 plan:**

```
$ bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md
exit=0
roll-up: 50 done · 21 backlog · 2 cancelled  —  of 73  — as recorded; drift on tasks 59, 60 — see above.
board data rows: 23  (was 73)
⟦FACTS⟧ diff vs pre-change baseline: IDENTICAL
```

- Roll-up line is **byte-identical** to the pre-change baseline.
- All 50 `✅ Done` rows hidden.
- Tasks **59 and 60 still render** — they carry `cancelled-without-date` nonconformance. This is the
  safety valve working on live data, not a fixture.

## The brief's verification steps, walked

| Criterion | Result |
|---|---|
| No `✅ Done` / `⛔ Cancelled` rows in `⟦BOARD⟧` on sprint-2 | ✅ met — except the two that carry drift, which is the required behavior |
| Roll-up totals unchanged from the pre-change run | ✅ met — byte-identical |
| Tasks 59/60 still render while their nonconformance stands | ✅ met |
| Test suite green including the new cases | ✅ met — 351/351 |
| No remaining SKILL.md claim that the board shows every row | ✅ met — the only two hits are the new passage *describing* the reversal and the fallback's "count every row" (about `M`, not about rendering) |
| No output-variant keyword introduced | ✅ met — the sole `full`/`all` mention is the sentence forbidding one |
| `/fkit-status` in a fresh session renders the filtered board | ⚠️ **not yet done — owner-side.** Requires a fresh session after re-init (the `.claude/` copy is regenerated at launch). Flagged, not claimed. |

## Problems encountered

- **The 9 test failures were not incidental.** Several used a `✅`/`⛔`/`➡️` row as a *vehicle* for
  testing something unrelated (clause trimming, table selection, GFM admission). Each needed a
  different fix to keep testing what it was written for — a blanket "expect fewer rows" edit would
  have quietly hollowed out the suite.
- **Two next-step shapes nearly lost coverage.** `closed` and `dead` are computed only for inert
  markers, which the filter hides — they survive only on rows a *nonconformance* forces back. Caught
  while auditing, and now covered explicitly.

## Lessons learned

- **For an inert marker, "absent from the board" is a stronger assertion than "renders correctly".**
  Absence proves no drift was manufactured, because any drift would have forced the row back on. Three
  tests got sharper, not weaker, from the filter.
- **Fusing the two effects of recording drift into one helper is the durable fix.** The dangerous
  future edit is a new drift fact that reaches `⟦FACTS⟧` without setting `row_drift` — reporting a
  finding about a row the owner cannot see. One call site makes that hard to write by accident.

## Open questions / residuals

- **None blocking.** The four interview rulings were treated as settled and not reopened.
- **⚠️ Dual-home drift keeps recurring — worth a systemic fix, named only.** `status-report-format.md`
  existing in two homes was not in the brief, not in the plan, and not caught by a full independent
  review incl. Codex. It was found by a grep I ran *after* the fix, almost incidentally. Task 49
  (`investigate-dual-home-parity-live-vs-scaffold`, architect-owned) is exactly this problem and is
  still in the backlog — this is one more data point for it. **A repo-wide "is this file dual-homed?"
  check belongs in a skill or a test, not in each coder's diligence.**
- **Deferred, named only (I do not file briefs):** the two cancelled-without-date cells on tasks 59/60
  are a live nonconformance in the sprint plan. They are *why* the safety valve is demonstrable on
  real data right now; correcting them to `⛔ Cancelled (2026-07-18)` is a deliberate owner edit, and
  when it happens those two rows will drop off the board. Worth knowing before it looks like a
  regression.
- **Follow-up already scoped:** task 66 (wiki sync after this change) — fkit-wiki's, hard-depends on
  this.

## Commit state

**Nothing committed.** All edits left in the working tree for the owner.
