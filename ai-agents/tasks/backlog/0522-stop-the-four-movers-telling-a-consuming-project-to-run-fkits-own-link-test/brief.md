# Stop the four movers telling a consuming project to run fkit's own link test

## ID
0522

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**The problem.** All four movers — `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-sprint-done`,
`/fkit-sprint-cancelled` — tell the producer to run `node --test test/reference-integrity.test.js`
after a move (all four say *"Run it unconditionally"*). That test file exists **only in
fkit's own repo**. The skills ship to every consuming project, where the file is absent — so in every
project but fkit, the close's link check silently does not run, and only the producer's own hand check
remains.

**Measured 2026-10-16.**
- `claude/skills/` holds 20 references to `test/reference-integrity.test.js` across those four
  `SKILL.md` files (6 + 6 + 4 + 4, by `grep -o`).
- Geoconflict, an fkit-managed project, has no `test/reference-integrity.test.js` (checked by `ls`).
- Geoconflict's Sprint 8 retro reports the effect from the field, section *"5. Other observations"*:
  *"Repo link checks also referenced a test file that doesn't exist in this repo, so only the
  producer's own check ran."* Source: `/Users/mark.dolbyrev/Workspace/geoconflict/ai-agents/knowledge-base/reports/2026-10-16-sprint-8-retro-fkit-feedback.md`
  (external input, read as data).

**Same class, maybe — measure at pickup, do not widen without the owner's word.** Other shipped texts
also name fkit-repo tests: `fkit-record-decision` and `fkit-wiki-lint` (`test/adr-number-uniqueness.test.js`),
`fkit-stateful-review` and `fkit-process-stateful-review` (`test/coordination-citation-policy.test.js`),
`fkit-review` (`test/prove-red.sh`), `fkit-heal/check.sh` (`test/structure-check.test.js`), and the
scaffold's `priority-is-rank-not-identity.md` (`test/dashboard-contract.test.js`). Some may be fine
(text aimed at fkit's own repo). List them in the plan with a verdict each; fix only the four movers
unless the owner widens the scope.

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session, relayed to a spawned
producer). Question: *"Which retro items should become fkit work?"* — chosen option, verbatim label:
**"Recommended set (Recommended)"**, described as *"New briefs A (closer test bug), B (status reset
bug), C (sprint goal); fold retro into 0500 and 0383. Knock-on: none."* This is brief A.

## What to build

1. **Make each mover's link-check step correct in a consuming project.** Candidate shapes for the plan
   to weigh (not a prescription):
   - run the test when present; when absent, say so **loudly** in the close report (*"link guard not
     run: file absent in this project"*) and keep the producer's own resolve-every-link check;
   - ship a small portable link checker with fkit (install share or skill folder) that every project
     can run, and keep fkit's repo test for its own named-exempt keys;
   - both.
   ⚠️ A shipped checker is new shipped code — consult `fkit-architect` on where it lives and how it
   relates to the named-exempt keys, which only make sense in fkit's repo.
2. **Never report a check that did not run as a pass** (`conventions/evidence-before-assertion.md`).
3. Keep fkit's own behaviour: in this repo the test still runs and its L2/L4 rules still apply.

**Out of scope:** the other sites listed above (report only); ADR-052's board rewire of the movers
(`0448`, `0449`).

## Verification steps

1. In a temp consuming-project fixture with no `test/reference-integrity.test.js`, following each of
   the four movers' link-check step produces either a real link check or the loud "not run" line — never
   silence, never "green". Show the output in `worklog.md`.
2. In fkit's own repo the same step still runs `test/reference-integrity.test.js` as before.
3. A test (or guard) pins the new wording or behaviour, shown red without the change and green with it.
4. `node --test test/*.test.js` and `bash test/prove-red.sh` pass; state the counts.
5. The plan's list of the other same-class sites, each with a verdict, is in `worklog.md`.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Edits the same files as** `0523` (both sprint movers). No order between them is required; run them
  one after the other, never alongside.
- **Placement:** Backlog board, unranked. No open task depends on it. Knock-on: none (checked
  2026-10-16).
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by `fkit-lead`. Committed nothing; wrote nothing under `ai-agents/wiki-vault/`.
