# Make `## Priority` a required brief field — nothing enforces it today

## ID
0156

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Task **0155** backfills the `## Priority` field into the six briefs that lack it. This task stops it
happening again.

### The finding: nothing enforces the field. Not one of the three candidate sites.

All three checked by reading the files and running the script on 2026-07-27:

| Candidate enforcement site | What it actually does |
|---|---|
| `claude/skills/fkit-task-brief/SKILL.md` | **Partly.** The authoritative skeleton at step 4 lists `## Priority`, and step 5 (*Determine priority*) says what value to write. But the mandatory-field callouts that follow the skeleton name **only** `## Status` (*"is always `🔲 Backlog` on creation"*) and `## Owner` (*"is mandatory and populated on creation"*). `## Priority` gets no such statement and no self-check step. A skeleton entry is a template, not an obligation — and it was skipped six times. |
| `claude/skills/fkit-status/dashboard.sh` | **No.** It emits exactly three `nonconformance` drift kinds — `brief-missing-id` (:661), `brief-missing-status` (:720), `brief-missing-owner` (:726). There is **no** `brief-missing-priority`. Confirmed empirically: running it against `sprint-2.md` renders the 0126 (P109) and 0136 (P114) rows with **zero** drift. |
| `test/dashboard-contract.test.js` | **No.** `## Priority` appears in ~14 raw fixtures and the `brief()` helper defaults `priority = 1`, and two tests pin *parse* behavior (a free-text `Unscheduled — …` qualifier must not leak into the board or the id; a `P<n>` cell must never become the id). **No test asserts the field's presence is required.** `grep -rn "missing-priority" test/ claude/` returns nothing. |

**So: nothing enforces it. That is the finding.** The field is in the template and in nobody's check.

### Why this is a settled pattern, not a design question — and therefore not an architect call

The lead asked whether *"should it be required, and enforced how"* is really an architect's call. **It
is not**, for a reason on the record rather than a judgment: the pattern is already designed,
instantiated **three times**, and walked end-to-end for a fourth field within this same sprint. `##
Owner` went from absent to required via **0104** (add the field to the schema and the task-brief skill)
+ **0105** (backfill it into existing briefs), landing a `brief-missing-owner` drift kind, a test at
`dashboard-contract.test.js:1115`, and a mandatory-field callout in the skill. This task is 0104's
shape; 0155 is 0105's. There is no novel structure to choose and no trade-off to weigh — only the
existing three-site pattern applied to a fourth field. Escalate to the architect only if the
implementation hits something the `## Owner` precedent does not already answer.

The one sub-question with judgment in it is already answered by an approved convention, not by this
task: **`Unscheduled` counts as present.**
[`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
defines a brief's field as *"a plain number, or `Unscheduled`"*. The guard checks **presence of the
heading**, never the shape of the value.

### Scale, stated plainly

**6 of 154 briefs, ≈4%** — not widespread. All six share one shape (heading omitted entirely, between
`## Sprint` and `## Status`), and they cluster in two batch-filing sessions. And no mis-ordering is in
flight: `fkit-sprint-ship-loop` falls back to the board cell, which agrees. **This is a low-severity,
low-incidence, currently-harmless nonconformance** — the same class as 0152, and ranked with it
in mind. It is worth a guard because the guard is cheap and the pattern is already built, not because
the defect is dangerous.

## What to build

Three changes, mirroring the `## Owner` precedent exactly.

**1. `claude/skills/fkit-status/dashboard.sh` — add a `brief-missing-priority` nonconformance kind.**
- Model it on `brief-missing-owner` at :724-726, the closest sibling (both are absent-field checks on
  a brief that was otherwise resolved). Emit via `add_fact` and call `mark_drift` — **never append to
  `DRIFT_TASKS` directly**; the comment at :516-526 explains why the two effects are fused, and a
  drift that reaches the roll-up without force-rendering its row produces a roll-up naming a task the
  reader then cannot find.
- The record carries no extra field, matching `brief-missing-owner` (`kind="brief-missing-priority"`
  and nothing after it). The board still renders the row's Priority cell exactly as the plan wrote it —
  this check reports the brief, it never substitutes for or rewrites the cell.
- **Presence of the `## Priority` heading is the whole test.** Do not validate the value, do not
  compare it against the board's Priority cell, and do not add a priority-disagreement check. A
  brief-vs-board comparison is a different, larger question and is explicitly **out of scope** — see
  *Notes*.

**2. `claude/skills/fkit-status/SKILL.md` — narrate the new kind.** Lines 278-280 enumerate the
`kind=` values and say which carry an extra field. Add `brief-missing-priority` to the list and to the
"carries none" clause beside `brief-missing-owner`. **An unnarrated kind is a FACTS record the skill
cannot explain.**

**3. `test/dashboard-contract.test.js` — pin it.** Mirror the `brief-missing-owner` test at :1086-1120,
which is the model to copy and which asserts four things: the fact is emitted with the right id, the
drift reaches the roll-up clause, the row force-renders because of it, and adding the field clears it
to exactly zero such facts.
- **⚠️ Existing fixtures will newly trip the guard — this is the known hazard, and it has a
  precedent.** The `brief()` helper defaults `priority = 1`, but raw-string fixtures do not all carry
  the field (e.g. :607, `'# Alpha\n\n## Sprint\nSprint 1\n\n## Context\nNo status heading at all.\n'`).
  The `## Owner` rollout hit this exact problem and solved it at :62 — *"Inject a default owner when
  absent so existing fixtures stay clean"*. **Follow that precedent**; do not hand-edit dozens of
  fixtures, and do not weaken the guard to accommodate them. Enumerate the affected fixtures in the
  plan.
- Per ADR-014 (zero devDeps), hand-rolled — no new dependency.
- If `test/prove-red.sh` carries mutations for the sibling kinds, add one for this kind in the same
  form; if it does not, say so and add none.

**4. `claude/skills/fkit-task-brief/SKILL.md` — state the obligation.** Add a mandatory-field callout
for `## Priority` in step 4's bullet list, beside the existing `## Status` and `## Owner` ones. It must
say: the field is **mandatory on creation**; its value is a **plain number** in a sprint or
**`Unscheduled`** on the Backlog board (citing `priority-is-rank-not-identity.md`, already linked from
step 8); and **never a `P<n>` token** — that form is the board cell's. Keep it to the length of the
neighbouring callouts; the rules-block budget is under pressure (task 0130).

## Verification steps

1. **Red first.** Delete the `## Priority` block from one brief in a scratch fixture, run
   `dashboard.sh` against the plan, and show the record
   `drift nonconformance <id> kind="brief-missing-priority"` in the `⟦FACTS⟧` output. Restore it and
   show the record count for that kind drops to **0**.
2. **The roll-up sees it.** The same run's roll-up drift clause names that task id. (This is the
   `brief-missing-owner` test's second assertion — it is what proves `mark_drift` was used rather
   than a bare `DRIFT_TASKS` append.)
3. **It force-renders the row.** A `✅ Done` row that would otherwise be filtered out still appears,
   solely because of this drift. Mirrors the assertion at `dashboard-contract.test.js:1110`.
4. **`Unscheduled` is clean.** A brief reading `## Priority` / `Unscheduled` emits **no**
   `brief-missing-priority` fact. So does `Unscheduled — high-value (see Context)`, the live free-text
   qualifier already pinned by the task-68 test at :1697.
5. **Green day one against the real repo.** With 0155 landed,
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` emits **zero**
   `brief-missing-priority` records. **If this step is not zero, 0155 has not landed or has regressed —
   stop and report, do not add a skip list.**
6. **The whole suite is green.** `node --test test/` passes, with no fixture's assertions weakened to
   accommodate the new check. State how many fixtures needed the default-injection treatment.
7. **The skill says it.** `claude/skills/fkit-task-brief/SKILL.md` step 4 carries a `## Priority`
   mandatory callout stating plain-number-or-`Unscheduled` and never `P<n>`.
8. **The kind is narrated.** `claude/skills/fkit-status/SKILL.md` lists `brief-missing-priority` among
   the `kind=` values and among those carrying no extra field.

## Notes

- **Depends on: 0155 — hard.** Four of the six briefs 0155 fixes are live `✅ Done` rows in
  `sprint-2.md` at P105–P108, so this guard fires on them the moment it ships. Landing it first means
  shipping a guard that is red on day one against real repo state and inviting a skip list — the exact
  outcome 0152's brief refuses for its own guard.
- **Blocks: nothing.**
- **Out of scope, deliberately: any brief-vs-board priority comparison.** This guard checks that the
  field **exists**. Whether a brief's number must equal its board cell — and which wins when they
  disagree — is a genuinely open question the `## Owner` precedent does not answer, and it is a
  bigger change (the board is re-ranked far more often than briefs are edited, so a strict equality
  check would manufacture drift on every re-rank). **Do not fold it in.** If the work makes the case
  for it concrete, report it as a residual and let the producer file it.
- **⚠️ Third claimant on `dashboard.sh`'s drift block this sprint.** 0155 does not touch it, but the
  file is under active change. Rebase before starting and re-read :640-730 rather than working from
  the line numbers in this brief.
- **Not a dual-home concern.** `dashboard.sh`, both SKILL.md files and the test live only under
  `claude/` and `test/`; the scaffold ships no copy of any of them, and neither
  `ai-agents/tasks/README.md` nor `ai-agents/README.md` documents the brief schema (all verified
  2026-07-27). No `claude/scaffold/` change.
- **⚠️ Priority 134 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **⚠️ Stale number reconciled 2026-07-30 by 0159's sweep — owner confirmation is still
  outstanding.** The append rank named above was superseded by displacement in later re-ranks; this
  brief's own `## Priority` field and its board row carry the live rank. **Nothing was re-ranked, and
  this flag is NOT discharged** — only its stale number was reconciled. The merit argument below is
  still awaiting an owner ruling, and is kept as the record of what was reasoned on the day.)*
  `/fkit-task-brief` step 5 requires appending and forbids renumbering the owner's ranking. On merit
  this belongs **immediately below 0155**, both because of the hard dependency and because on its own
  it is the same class as 0152 — a guard against a low-severity, ≈4%-incidence, currently-
  harmless nonconformance. The merit/append gap is about three slots.
