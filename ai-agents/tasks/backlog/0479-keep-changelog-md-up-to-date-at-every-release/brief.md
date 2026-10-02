# Keep CHANGELOG.md up to date at every release

## ID
0479

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.

**Owner approval behind this task** (2026-10-02, `fkit-lead` session, `AskUserQuestion`, selected
option, relayed to a spawned producer): *"Approve — …"*, on a question that included *"a separate
follow-up task for keeping CHANGELOG.md updated at release time"*. Only the start of the option text
was relayed; the task wording above is the lead's summary of the question, not the owner's words.

**Why it is needed.** Task `0478` (commit `b3808cf`) created a root `CHANGELOG.md`: newest first, an
`## Unreleased` section, `## Upgrade notes`, and `## History` (moved out of the README, together with
the old "an update does not repair this" note). It says it *"starts after v0.3.1"*; earlier tags
(`v0.2.2`, `v0.3.0`, `v0.3.1`) have no written notes. But nothing in the release flow knows the file
exists:
- `RELEASING.md` never mentions it (checked at filing: no hit for "changelog").
- `bin/release.mjs` never touches it (no hit). Its flow (`RELEASING.md` §4): test gate → bump
  `VERSION` + `package.json` → `git add -A` → commit → push → annotated `v<x.y.z>` tag → push tag.

So at the next `npm run release` the `## Unreleased` section stays "Unreleased" under a tag that
shipped it, and the file goes stale from its first release.

**Facts that shape the design** (from `RELEASING.md`, read at filing):
- `main` is the release channel; the tag is a marker. A changelog entry is how a release is
  *described*, which `RELEASING.md` §1 already names as a use of the tag.
- The test gate runs **before the first write**, on purpose, so a red suite leaves the tree clean.
  Any changelog check must keep that property: a refused release must leave the tree exactly as it
  was (no half-written `CHANGELOG.md`, no bumped `VERSION`).
- `RELEASING.md` ships to nobody (not in `claude/scaffold/`, not in `structure-spec.md`), and neither
  does `CHANGELOG.md`. This is fkit-repo-only work; no consuming-project change.

**Coordination.** `0478` is under review in parallel and owns `CHANGELOG.md`'s current content. Do not
start until `0478` is closed, so the two do not edit the same file at once. No conflict with a locked
decision found. Recorded as a `Depends on: 0478` in Notes, so the board will not show this task as
pullable before then.

## What to build

1. **Decide the mechanism, and say why.** Options to weigh in the plan (the plan picks one; a bigger
   choice goes to the owner):
   - **Enforced:** `bin/release.mjs` refuses to release when `## Unreleased` is empty (or missing),
     and on a release renames `## Unreleased` to `## v<x.y.z> — <date>` and opens a fresh empty
     `## Unreleased` above it, in the same commit as the version bump. `--allow-empty-changelog` (or
     similar) as the loud, explicit escape hatch, matching how `--no-test` is handled.
   - **Documented only:** a manual step in `RELEASING.md` §3 ("Before you release") to move
     `## Unreleased` under a version heading.
   - The producer's lean is **enforced** (a manual step is the thing that already failed for History),
     but that is the coder's call to argue in the plan.
2. **Keep the clean-abort property.** Any refusal happens before the first mutating line, next to the
   test gate. Any rewrite of `CHANGELOG.md` happens after the gate and lands in the release commit.
3. **Update `RELEASING.md`**: §3/§4 say what the release does to `CHANGELOG.md` and what the maintainer
   must do before running it (write the Unreleased entries). Update `CHANGELOG.md`'s own header if its
   wording no longer matches the flow.
4. **Tests if `release.mjs` changes** (`node --test`, zero deps, ADR-014): at least an empty
   `## Unreleased` is refused with the tree untouched, a filled one is rewritten to the version
   heading with a new empty `## Unreleased`, and the escape hatch works and is loud. Follow the
   existing pattern in `test/release-summary.test.js` for how `release.mjs` is exercised without
   pushing or tagging for real.
5. Whether to add a contributor rule ("add a line under `## Unreleased` when you land a notable
   change", in `CONTRIBUTING.md`) is an **open question for the owner** in the plan, not built by
   default.

## Verification steps

1. `RELEASING.md` names the changelog step; `grep -n -i changelog RELEASING.md` returns the new text.
2. If `release.mjs` changed: the new tests pass, and each was seen red against a deliberately broken
   copy (state how), per ADR-014.
3. A dry run of the release logic on a scratch copy (not the real repo, no push, no tag) shows: empty
   `## Unreleased` → refused, `git status` unchanged; filled → `CHANGELOG.md` gains
   `## v<x.y.z> — <date>` with the old entries under it and a new empty `## Unreleased` on top.
4. `node --test test/reference-integrity.test.js` green (links in `CHANGELOG.md` / `RELEASING.md`
   still resolve), plus whatever checks task `0480`'s rule names for the files touched, if `0480` has
   landed; otherwise `npm test`.
5. No absolute machine path in any changed file.

## Notes
- **Depends on:** `0478` — soft: `0478` created `CHANGELOG.md` and is still under review; start after it
  closes so the two never edit the file at once (see Context)
- **Blocks:** nothing
- **Why one brief:** the mechanism, its doc, and its tests ship together; a doc-only half would be
  the "documented only" option, which the plan may choose, and is then the whole task.
- Related: `0480` (which checks to run per change) — independent, but if both land, release stays
  "run everything".
- **Consulted:** none at filing.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  approval above; it decides nothing beyond that approval.
