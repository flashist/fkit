# Add the red fixture — a product-prefixed H1 on a `plan-sprint-N.md` filename must keep drift rule 1 alive

## ID
0259

## Sprint
Sprint 5

## Priority
Sprint 5 P1

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**A downstream fkit user filed a defect report against `claude/skills/fkit-status/dashboard.sh`, and
our test suite is green for a fixture-shaped reason.** The report is copied into this repo verbatim
and is the citation anchor for this task and for
[`0260`](../0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md):

[`ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`](../../../knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md)

⚠️ **That filename is date-last, which does not match `reports/README.md`'s `YYYY-MM-DD-<slug>.md`
naming convention.** It was kept byte-identical, name included, because it is a foreign artifact we
did not author and every downstream citation of it points at that name. Flagged, not hidden.

**Who reported it.** A game project, ~50 tasks, running fkit `0.2.1` — the same `dashboard.sh` we
ship (945 lines / 56121 bytes on both sides, so the report's line numbers are directly comparable to
ours). They carry no local patch and want the fix in a release rather than diverging from the
manifest.

**What the defect is.** `PLAN_SPRINT` is resolved by two rungs and one special case:

| Rung | Where | What it requires |
|---|---|---|
| H1 regex | `dashboard.sh:83` (2026-08-10) — `sed -n 's/^# \(Sprint [0-9][0-9]*\).*/\1/p'` | the line must *start* `# Sprint N` |
| Filename fallback | `dashboard.sh:87` (2026-08-10) — `sed -n 's/^sprint-\([0-9][0-9]*\)$/Sprint \1/p'` on the basename | basename exactly `sprint-N` |
| `backlog` special case | `dashboard.sh:92` (2026-08-10) | basename exactly `backlog` |

Run empirically against the reporter's real plan names, **every plan document they have resolves
empty**: `plan-sprint-4`, `plan-sprint-4c`, `sprint-backlog` miss the filename rung; `# Geoconflict
— Sprint 4 — In-App Monetization`, `# Geoconflict — Sprint 4c — Production Stabilization`,
`# Geoconflict — Post-Sprint 2 Hotfix Tasks` miss the H1 rung.

**The failure has two directions, and both are real** (report §3):

- **On a numbered sprint board — over-reporting.** Rule 1's skip at `dashboard.sh:802` is
  `elif [ -n "$PLAN_SPRINT" ] && …`; an empty identity makes the guard false, the skip stops
  applying, and rows fall through to rule 3's full cross-check. Every legitimately-carried-elsewhere
  row becomes a phantom `drift disagreement` — exactly what our own comment at `dashboard.sh:78-82`
  predicts.
- **On a backlog-shaped board — under-reporting.** The "scheduled but still parked on the
  unscheduled board" check (`[ -n "$b_sprint" ] && [ "$b_sprint" != "Backlog" ] && bad=1`,
  `dashboard.sh:796`) exists **only** inside the `[ "$PLAN_SPRINT" = "Backlog" ]` arm at
  `dashboard.sh:772`. Rule 3's else branch has no equivalent, so a backlog-shaped board whose
  identity does not resolve can never surface what that arm's own comment calls *"the single
  highest-value drift this board can surface"*.

**Why our suite did not catch it.** `test/dashboard-contract.test.js:641` — the test named
*"R8: a prose H1 falls back to the filename, keeping rule 1 alive"* — uses a fixture whose plan file
is named **`sprint-1.md`**. It proves the fallback works when the filename **already matches the
pattern the fallback expects**. It cannot detect that real projects name the file something else.
R8's own comment says it exists because losing the identity *"silently disabled the rule"* — the test
is aimed at exactly this failure and misses it by one naming convention. Its companion at
`test/dashboard-contract.test.js:654` uses `hardening.md`, unresolvable by both rungs, so that one
pins the **reporting** path, not the naming gap.

**⚠️ This task adds a failing test and stops there.** It does not touch `dashboard.sh`. The
resolution strategy is a genuine design call under a hard constraint (a wrong identity is strictly
worse than no identity) and is [`0260`](../0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md).
Landing a fix here would be scoping implementation ahead of that decision.

## What to build

One new test case in `test/dashboard-contract.test.js`, in the R8 cluster, immediately after the two
existing R8 tests so the three read as a set.

1. **The fixture.** A plan file named **`plan-sprint-4.md`** whose H1 is
   `# <Product> — Sprint 4 — <theme>` — the shape the report's §7 table shows is near-universal in a
   real project. Build it the way the existing
   *"R8: an entirely unresolvable plan sprint is REPORTED"* test does — by hand, with an explicit
   plan path — because the shared `fixture()` helper names the plan file for you and the **filename
   is the thing under test**.
2. **The assertion.** One brief whose `## Sprint` names a **different** sprint than the plan
   (the R8:641 fixture uses `Sprint 9`), and assert **zero** `drift disagreement` facts — i.e. rule
   1 still skips. On today's code `PLAN_SPRINT` resolves empty, the skip does not apply, rule 3
   cross-checks the row, and the assertion fails.
3. **Name the test so its purpose survives.** Something in the shape of
   *"R8: a product-prefixed H1 on a `plan-sprint-N.md` filename must keep rule 1 alive"*, with a
   comment saying **why it is red** and naming the report by path — a reader hitting a red test needs
   to know it is a known, filed defect and not a break they just caused.
4. **Leave a `⛔ known-red` marker the next runner cannot miss.** State in the comment that this test
   is expected to fail until `0260`'s decision lands and its implementation follow-on ships, and name
   `0260` by folder ID.
5. **Use the report's §7 table as the fixture vocabulary.** Take the product-prefixed H1 shape from
   it verbatim rather than inventing a plausible-looking one. The reporter has offered to test a
   pre-release against those names; a fixture drawn from the same table is what makes that offer
   worth taking up.

### ⛔ Out of scope

- ⛔ **Any change to `claude/skills/fkit-status/dashboard.sh`.** This task proves the defect; it does
  not fix it. The fix shape is undecided — see `0260`.
- ⛔ **Any change to `claude/skills/fkit-status/SKILL.md`**, including its `sprint-*.md`
  active-sprint glob — that is
  [`0261`](../0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md).
- ⛔ **Do not "fix" the two existing R8 tests.** Both are correct for what they assert; the gap is
  that neither asserts this case.
- ⛔ Do not widen either matcher's regex "just to make it green".
- ⛔ No new devDependency (ADR-014); no `prove-red.sh` mutation in this task.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005).
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. **The new test is RED on today's `dashboard.sh`.** Run
   `node --test test/dashboard-contract.test.js` and show the new case failing, with its assertion
   message in the output. **A green run means the fixture does not reproduce the defect** — the
   likeliest cause is a filename that accidentally matches `^sprint-[0-9][0-9]*$`.
2. **It is red for the stated reason, not a different one.** Show that the same fixture emits a
   `drift unresolved-plan-sprint` fact — that is the identity failing to resolve, which is the
   mechanism under test. If it is red without that fact, the fixture is broken.
3. **Every other test in the file still passes**, including both existing R8 cases.
4. `npm test` output is recorded in the worklog **with the new failure named**, so the known-red
   state is on the record rather than discovered later.
5. `git status --porcelain` shows exactly one changed file — `test/dashboard-contract.test.js` —
   and nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **On merit:** as ranked — `Sprint 5 P1`. It is the cheapest thing on the board, it converts a
  third-party report into a failing test this project owns, and it makes `0260`'s decision concrete
  instead of hypothetical. The reporter's own suggested order (§9) puts it first for the same reason.
- **Scheduling preference, not a dependency:** land this **before**
  [`0260`](../0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md).
  **Owner-ruled 2026-08-10** (relayed through the coordinating session as part of the Sprint 5 scope
  ruling). ⚠️ **Deliberately NOT a `Depends on` / `Blocks` declaration** — the architect can reach
  `0260`'s decision from the report alone, so neither task blocks the other at build time, and a
  false label would make the board render `0260` as `after 0259`. Form per
  [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md);
  separate-bullet shape per the `0149` / `0184` precedent (annotate beside the label, never inside
  it).
- **⚠️ This task ships the suite RED, on purpose.** That is unusual here and must be said out loud in
  the close report, not buried: `npm test` will not be green again until the `0260` decision's
  implementation follow-on lands. Anyone reading a red suite in between needs this brief to explain
  it.
- **Line-number citations above are dated (2026-08-10) and are anchors of convenience.** The durable
  anchors are the quoted patterns and test names. The durable-citation convention page does not exist
  yet — that is [`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md).
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, onto the Sprint 5 board, under
  the owner's Sprint 5 scope ruling of the same day.
