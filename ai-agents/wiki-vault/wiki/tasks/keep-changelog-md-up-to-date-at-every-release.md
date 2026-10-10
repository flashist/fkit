# Keep `CHANGELOG.md` up to date at every release

**Source**: `ai-agents/tasks/done/0479-keep-changelog-md-up-to-date-at-every-release/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P5` · task `0479` · owner `fkit-coder`

## Goal
`0478` created a root `CHANGELOG.md` (newest first, `## Unreleased`, `## Upgrade notes`, `## History`), but
**nothing in the release flow knew it existed** — `RELEASING.md` and `bin/release.mjs` never mention it — so at
the next `npm run release` the `## Unreleased` section would stay "Unreleased" under a tag that shipped it.
Owner approval 2026-10-02 (⚠️ only the start of the option text, *"Approve — …"*, was relayed). The producer's
lean was **enforced, not documented** — *"a manual step is the thing that already failed for History"*.

Design constraint: the test gate runs **before the first write** so a red suite leaves the tree clean; any
changelog check must keep that clean-abort property. fkit-repo-only — `RELEASING.md` and `CHANGELOG.md` ship to
nobody.

## Key Changes
- **`bin/release.mjs` refuses an empty or missing `## Unreleased`** — checked **before** the test gate and
  **again after it** — and on a release turns `## Unreleased` into `## v<version> — <date>` with a fresh empty
  `## Unreleased`, in the same commit as the version bump. A **loud** escape hatch, `--allow-empty-changelog`
  (stderr banner). Every refusal happens before the first write.
- `RELEASING.md` §3/§4 say what the release does to `CHANGELOG.md` and what the maintainer writes first.
- Tests in `test/release-summary.test.js` plus two prove-red mutations (an empty `## Unreleased` refused with the
  tree untouched; a filled one stamped).

## Outcome
- Review round 1: the owner ruled **"Refuse it"** on the follow-up finding; full `npm test` in a fresh copy:
  1048/1048 unit, 43 mutations all red, hard gate passed.
- ⚠️ **The final re-verify FAILED on two stale `bin/release.mjs:N` line cites in `RELEASING.md`** (off by 7 — the
  size of the new refusal block). They were fixed in the lead's final re-verify the same day (2026-10-05, not an
  owner ruling) and every other cite re-checked. A reminder that line-number cites in prose rot with the code.
- **Not run, by rule:** `npm run release` / `release:dry` on the real repo, any tag, push or commit.
- Whether to add a contributor rule ("add a line under `## Unreleased`") was left to the owner in the plan — not
  recorded here as decided.

## Related
- [[tasks/sprint-10-the-0472-0482-batch]] — `P5`
- [[tasks/overhaul-the-readme-for-first-time-visitors]] — `0478`, which created `CHANGELOG.md`
- [[systems/install-and-self-update]] — the release section
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — the test gate whose clean-abort property this keeps
- [[tasks/re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout]] — `0395`, started after this closed (neighbouring release files)
- [[tasks/make-fkit-update-reinstall-from-the-source-and-paths-it-was-installed-from]] — `0481`, whose entry sits in `## Unreleased`
