# Decide the `PLAN_SPRINT` resolution strategy — under the letter-suffix constraint, ADR output

## ID
0260

## Sprint
Sprint 5

## Priority
Sprint 5 P2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**This is a decision task. It produces an ADR, not a patch.** The defect is established; the fix
shape is not, and the naive fix is worse than the defect.

**The defect, in one line.** `PLAN_SPRINT` (`claude/skills/fkit-status/dashboard.sh:83-108`,
2026-08-10) resolves **empty** for every sprint-plan naming convention a real downstream project
actually uses, which makes drift rule 1 inert — over-reporting phantom drift on a numbered sprint
board, and under-reporting the highest-value drift on a backlog-shaped one. Full statement, both
directions, with the evidence:

[`ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`](../../../knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md)

⚠️ **That filename is date-last and does not match `reports/README.md`'s `YYYY-MM-DD-<slug>.md`
convention.** Kept byte-identical, name included, because it is a foreign artifact we did not author.
Flagged, not hidden.

[`0259`](../../backlog/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/brief.md)
turns the report into a failing test. **This task decides what makes it pass.**

### ⚠️ The hard constraint — a wrong identity is strictly worse than no identity

This is report §6, and it is the reason this is an architect decision and not a one-line regex
widening. **State it in the ADR in these terms; do not soften it.**

Both current patterns use `[0-9][0-9]*`. The reporter's repo contains **`plan-sprint-4b.md`** and
**`plan-sprint-4c.md`** — real, distinct sprint identities ("Sprint 4b", "Sprint 4c"), each with its
own plan and its own tasks, **alongside a separate `plan-sprint-4.md`**. A naive numeric widening
resolves `plan-sprint-4c.md` → `Sprint 4`.

Trace what that does, because it inverts the failure mode:

- **Today (no identity):** rule 1 is inert, the board over-reports, and `drift unresolved-plan-sprint`
  tells the reader why. **A loud failure.**
- **With a wrong identity:** rule 1 becomes **live and wrong**. Every Sprint 4c brief reads as
  belonging to another sprint, so rule 1 **skips the status cross-check on that entire board** and
  reports nothing. **A silent failure**, and no warning fires because the identity did resolve.

**A second shape disqualifies the other obvious widening.** `hotfix-post-sprint2.md` (H1
`# Geoconflict — Post-Sprint 2 Hotfix Tasks`) is a real plan that is deliberately **not** Sprint 2.
Any *"find `Sprint <N>` anywhere in the H1"* matcher claims it. **Prose containment is not identity.**

**The requirement this yields, non-negotiable and to be written into the ADR as such:** whatever
pattern is landed must **either handle the letter suffix or refuse the file and report
`unresolved-plan-sprint`**. There is no third option in which it guesses.

### ⚠️ The reporting path is intact and must stay intact

Report §4, verified on our side: `drift unresolved-plan-sprint` is emitted at `dashboard.sh:905-906`,
and `dashboard.sh:918` sets `plan_level_drift` so it reaches the roll-up's drift clause;
`fkit-status/SKILL.md` instructs the reader to say *"any drift below may be phantom"*. **Nothing here
is broken and nothing here should be redesigned.**

## What to build

An ADR under `ai-agents/knowledge-base/decisions/`, via `/fkit-record-decision`.

1. **Decide the resolution strategy**, weighing at least these and recording why each was taken or
   rejected **by name**:
   - **Widen both patterns to `[0-9]+[a-z]*`** (or equivalent), making `Sprint 4c` a first-class
     identity distinct from `Sprint 4`. Weigh what it means for brief `## Sprint` fields, for rule
     1's string comparison, and for the `➡️ Moved to [Sprint N]` marker vocabulary.
   - **Widen the H1 rung to tolerate a product prefix** — some anchored form matching
     `# <anything> — Sprint <N> — <anything>` without collapsing into "find `Sprint <N>` anywhere",
     which `hotfix-post-sprint2.md` disqualifies. Say precisely what the anchor is.
   - **Refuse and report** — leave the matchers narrow, and treat a non-conforming name as an
     identity the tool declines to guess, i.e. today's behaviour made deliberate and documented.
     **This is a legitimate outcome and must be argued out, not defaulted past** — if it is chosen,
     the ADR must say what the downstream project is expected to do instead, and `0261`'s decision
     becomes load-bearing rather than adjacent.
   - **Any combination**, e.g. widen the H1 rung and leave the filename rung alone.
2. **State the required regression guard as a hard clause of the decision, not a suggestion:**
   > A genuinely unidentifiable plan MUST still report `unresolved-plan-sprint`. The fix must not
   > convert a loud failure into a quiet one.

   The ADR must require that guard by name in whatever implementation follows, and must say that an
   implementation which drops it does not satisfy this decision.
3. **Use the report's §7 table as the fixture set.** Twelve real plan filenames with their verbatim
   H1s. Test the candidate patterns against **all twelve** and put the resolution outcome for each in
   the ADR — including the ones that must resolve **empty** (`hotfix-post-sprint2.md`,
   `plan-index.md`). That table is the single most valuable thing in the report, and it is the shape
   a real project drifts into.
4. **Do not re-derive what the report establishes.** Cite it. The two failure directions, the empirical
   resolution results, and the `:802` / `:796` / `:905` mechanics have all been independently verified
   against our source (2026-08-10) and are established evidence for this decision.
5. **If an implementation task is needed, name it as a follow-on — do not write it here.** Filing the
   implementation brief is the producer's act after the owner has reviewed this ADR. Say plainly in
   the report which follow-ons the decision implies.
6. **Carry a `Re-raise only if` clause**, the house ADR shape.

### ⛔ Out of scope

- ⛔ **No implementation.** No edit to `claude/skills/fkit-status/dashboard.sh`, to
  `test/dashboard-contract.test.js`, or to any other source file. If the ADR is right, the patch is
  cheap; if the patch lands here, the decision was never reviewed.
- ⛔ **Do not file the implementation brief.** Producer's act.
- ⛔ **The `sprint-*.md` active-sprint glob is a separate decision** —
  [`0261`](../0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md).
  **Coordinate, do not merge.** ⚠️ They interact: see `0261`'s compounding note. If this ADR's
  outcome changes what `0261` should decide, say so explicitly rather than deciding `0261` here.
- ⛔ **Do not redesign the `unresolved-plan-sprint` reporting path.** It works.
- ⛔ **Do not touch `STATUS_HEADING_RE`.** The reporter names their own `## Sprint <N> Status`
  headings as *their* data defect, has a task open for it, and explicitly asks us not to change it.
- ⛔ Do not change the `backlog` special case at `dashboard.sh:92` or its basename-not-full-path
  behaviour (owner-ruled 2026-07-18, review R4).
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005).
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. The ADR exists under `ai-agents/knowledge-base/decisions/`, with an ADR number allocated by the
   **four-way sweep** — `decisions/`, `reports/`, the sprint boards, **and** `wiki-vault/`
   (read-only) — per the ADR-029 precedent where a number was once claimed everywhere except
   `decisions/`.
2. It states the "a wrong identity is strictly worse than no identity" constraint in its own terms
   and shows the trace: wrong identity → rule 1 live → whole-board skip → silence.
3. It names `hotfix-post-sprint2.md` and explains why prose containment is disqualified.
4. It resolves **all twelve** §7 filenames under the chosen pattern, with the expected outcome
   recorded per row — including the ones that must stay unresolved.
5. It states the `unresolved-plan-sprint` regression guard as a binding clause of the decision.
6. At least three candidate strategies are recorded with reasons, and the rejected ones are rejected
   **by name** — listed is not the same as rejected.
7. It carries a `Re-raise only if` clause.
8. `git status --porcelain` shows no change under `claude/`, `test/`, or `ai-agents/wiki-vault/`.
9. `grep -rn 'Sprint 4c' <the ADR>` returns the letter-suffix case actually being handled in the
   text, not only in a heading.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **On merit:** as ranked — `Sprint 5 P2`. It is the decision the whole sprint's headline defect
  turns on; it ranks below `0259` only because the fixture is cheaper and makes this decision
  concrete.
- **Scheduling preference, not a dependency:** land after
  [`0259`](../../backlog/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/brief.md).
  **Owner-ruled 2026-08-10.** ⚠️ **Deliberately NOT a `Depends on` declaration** — the architect can
  reach this decision from the report alone, so a label would make the board render this row
  `after 0259`, which is false. Form per
  [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md);
  separate-bullet shape per the `0149` / `0184` precedent.
- **The reporter has offered to test a pre-release against the §7 names.** That offer is worth taking
  up and is the cheapest real-world validation available for whatever this ADR chooses. ⚠️ It needs
  the owner's decision to accept — a producer does not commit the project to a third-party test loop.

- **✅ RULED 2026-08-10 — the offer is ACCEPTED, and it is a RELEASE GATE.** The bullet above is left
  byte-identical; this one answers it. Given via `AskUserQuestion` in a live session — a selection
  from the question's option list, **the option label is the verbatim text**: **"Yes — before the
  release cut"**. Option description as presented to the owner, verbatim: *"Their §7 table is the
  only real-world naming sample we have, and we cannot generate it from this repo. Testing 0260's
  landed pattern against plan-sprint-4b/4c, hotfix-post-sprint2 and sprint-backlog before shipping is
  the cheapest validation available. Adds a round trip to a third party."*
  - **What must happen, and when:** **before the release is cut**, whatever pattern `0260` lands is
    tested against the downstream project's **twelve real plan filenames** — the §7 table of
    [`fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`](../../../knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md).
  - **The four hard cases the owner named, by name — each needs a stated, checked outcome:**
    **`plan-sprint-4b.md`**, **`plan-sprint-4c.md`** (letter-suffix identities distinct from
    Sprint 4), **`hotfix-post-sprint2.md`** (must **not** resolve to Sprint 2 — prose containment is
    not identity), **`sprint-backlog.md`** (the compounded `0261` case — wrong board selected *and*
    identity empty).
  - **⚠️ This does NOT gate `0260`'s own close.** `0260` produces an ADR; the test runs against the
    **landed pattern**, which arrives with the implementation follow-on. A third-party round trip
    inside this task's verification would block a decision on someone else's calendar. **The gate is
    on the release cut, not on this brief.**
  - ⚠️ **It adds a round trip to a third party, and the owner accepted that knowingly.** If the same
    project is also asked to host
    [`0262`](../../backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md)'s
    stale-install test, **batch or sequence the two asks deliberately — do not send them
    independently.**

- **⚠️ `0261`'s design posture is now owner-ruled, and it bears on this task too — verbatim "fkit
  adapts to the project" (2026-08-10).** Recorded in full in
  [`0261`](../0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md)'s
  Notes. **⛔ Read it before choosing a matcher, because it is a POSTURE, not a decision, and it
  explicitly does NOT license a loose one.** "fkit adapts" does **not** authorize a widening that
  resolves `plan-sprint-4c.md` → `Sprint 4`. The §6 constraint above — *a wrong identity is strictly
  worse than no identity* — and the `unresolved-plan-sprint` regression guard are **unchanged and
  still binding**. The posture says which way to lean when the options are otherwise balanced; it
  settles nothing this brief's §"The hard constraint" section forbids.
- **Line-number citations above are dated (2026-08-10) anchors of convenience**; the durable anchors
  are the quoted patterns and the report's section numbers. The durable-citation convention page does
  not exist yet — [`0171`](../../backlog/0171-write-the-durable-citation-anchors-convention-page/brief.md).
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, onto the Sprint 5 board, under
  the owner's Sprint 5 scope ruling of the same day.
