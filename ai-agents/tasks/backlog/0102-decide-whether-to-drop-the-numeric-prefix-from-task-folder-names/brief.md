# Decide whether to drop the numeric prefix from task-folder names

## ID
0102

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Context

**The owner's observation (2026-07-21):** it is confusing that a task carries **two different numbers**
— its **sprint priority** (the `| N |` column, e.g. `78`) and its **folder-ID prefix** (e.g.
`0099-wiki-sync-task-folder-migration`). Same task, two numbers, and they do not match. The owner's
suggestion: if the folder-ID prefix is not critical, **remove the number from the folder name**.

**This is a genuine design question, not a cosmetic one — which is exactly why it is an architect
investigation and not a producer edit.** The number in the folder name is load-bearing in three places
that a "just rename the folders" change would break:

1. **It is the authoritative ID carrier.** [ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
   Decision 5 rules the **folder name is authoritative** and the brief's `## ID` field is the second
   carrier, reconciled by `dashboard.sh`'s `id-mismatch` drift check — *"two carriers, no third."*
   Dropping the prefix makes `## ID` the **sole** carrier, which reverses part of a decision recorded
   only days ago.
2. **`dashboard.sh` uses `<NNNN>-<slug>` as identity and link-recovery key** (`dashboard.sh:502-541`):
   the folder name is the task-id fallback token *and* the key that lets a moved task's links be
   repaired. `brief.md` is a shared basename that would collapse every task to one id, so today the
   folder name is the only usable identifier.
3. **Both task movers grep the `<NNNN>-<slug>` folder name** to find every inbound reference when a
   task is closed or cancelled.

**The hard conflict, stated plainly:** the task-folder migration (task 76 / the `0062-…` folder) that
*created* these numbered folders **closed hours ago and is still `agent-closed — not owner-verified`.**
This task asks whether to partially undo it. Doing and undoing a mass folder rename within days is a
real cost — a second rename of 100+ folders and a second link-repair sweep — and the architect must
weigh whether the confusion justifies that, or whether a cheaper fix exists.

**Do not pre-judge the outcome.** The owner leans toward removing the number, and that is the leading
candidate — but the decision is the architect's to make against the evidence, and the honest set of
options is wider than "remove it or don't."

## What to build

An **investigation with a recommendation**, plus — **if and only if the decision is to change the
scheme** — a **recorded ADR** (amending or superseding ADR-029 Decision 5) and enough of a plan that
task 0103 can implement from it.

The investigation must answer, at minimum:

- **What does the folder-name number actually buy**, beyond identity? Sortability, at-a-glance
  ordering, collision-visibility, the recovery key — name each benefit and say whether `## ID` alone
  can carry it.
- **The owner's option — remove the prefix, `## ID` becomes sole carrier.** What breaks in
  `dashboard.sh` and both movers, and what is the replacement identity/recovery mechanism? This is the
  option that reverses ADR-029 Decision 5 and therefore needs the new ADR.
- **The cheaper alternatives the owner may not have weighed** — surface them, evaluate them, do not
  silently prefer the owner's framing:
  - **Reconcile the two numbers by showing the ID where the confusion is** — e.g. surface the folder
    ID in the sprint board's row so `78` and `0099` are visibly the same task, instead of renaming
    anything. Solves the *stated* confusion (two numbers, no visible link) with no migration.
  - **Drop the sprint-priority number instead of the ID** — if one of the two numbers must go, which
    one is it, and why? The ID is identity; the priority is board rank. The architect should say
    which number is the accident and which is essential.
  - **Documentation only** — is the confusion a doc gap (nobody wrote down that priority ≠ ID) rather
    than a design flaw?
- **The cost of a second migration** — honestly priced against the benefit, given task 76 is days old
  and unverified.
- **If "change the scheme":** the ADR, and the migration + tooling-rework plan (which of the 3 coupling
  points above change, and how) that task 0103 implements.

## Verification steps

- A design/investigation report exists under `ai-agents/knowledge-base/reports/`, linked from this
  brief's board row.
- The report answers **every** bullet in "What to build" — for each, a reader can tell what was found
  and what was decided.
- The report explicitly weighs the change against **ADR-029 Decision 5** and against the
  **just-executed, unverified task-76 migration** — it does not plan around either.
- The report evaluates **at least the two cheaper alternatives** named above, not only the owner's
  suggested approach — so the recommendation is a choice among options, not a rationalization of one.
- **If the recommendation is to change the scheme:** an ADR exists under
  `ai-agents/knowledge-base/decisions/` amending or superseding ADR-029 Decision 5, and the report
  contains a plan concrete enough for task 0103 to implement without re-deciding anything.
- **If the recommendation is to keep the number:** the report says so, names the cheaper fix (if any)
  that resolves the owner's confusion, and **task 0103 is then a candidate for cancellation** — noted
  in this brief's report for the owner's call.

## Notes

- **Owner: fkit-architect.** An adversarial pass is worth considering — this reverses a recently-locked
  decision.
- **Depends on: nothing.** Investigation-first gate.
- **Blocks: task 0103** — no implementation starts until this decision is approved by the owner and, if
  it changes the scheme, the amending ADR is recorded.
- **⚠️ The owner's suggestion is an input, not a settled decision.** *"If it's not super critical,
  remove the number."* The architect's job is to establish whether it *is* critical — points 1–3 in
  Context say it is more coupled than it looks — and to recommend accordingly.
- **This decision belongs to the owner.** The architect recommends; the owner rules; only then does
  0103 run.
