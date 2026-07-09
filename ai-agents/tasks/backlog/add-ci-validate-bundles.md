# Add CI: run validate-bundles.sh

## Sprint
Sprint 1

## Priority
3 (tail task)

## Status
🔲 Backlog

## Context

There is currently no CI in this repo (no `.github/workflows`). `omnigent/validate-bundles.sh`
already exists and catches real bugs — the owner noted it caught YAML frontmatter (`": "`) load
failures this session. Decision recorded in
`ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md` (accepted): add a
lightweight GitHub Actions workflow running it.

The script degrades gracefully: without a local Omnigent Python install it runs only the `SKILL.md`
frontmatter check; with Omnigent present it also runs `omnigent.spec.load` per bundle. Start minimal.

## What to build

A GitHub Actions workflow (e.g. `.github/workflows/validate-bundles.yml`) that:

- Triggers on push and pull_request (at minimum against changes under `omnigent/**`; whole-repo is
  also fine given the repo's small size).
- Checks out the repo.
- Runs `omnigent/validate-bundles.sh` (no Omnigent install required for this first version — Ruby is
  preinstalled on GitHub-hosted runners per the architect's note; confirm the script's actual
  interpreter/tooling requirement before assuming Ruby specifically, and install whatever it actually
  needs).
- Fails the check if the script exits non-zero.

**Future upgrade (not this task, just noted for context):** install Omnigent
(`uv tool install omnigent`) in the workflow to get full per-bundle `omnigent.spec.load` coverage,
not just the frontmatter check. Leave a `TODO` comment in the workflow noting this, don't build it now
unless it's nearly free to add.

## Verification steps

- Workflow runs on a PR/push and passes on the current (valid) bundle state.
- Deliberately break a `SKILL.md`'s YAML frontmatter locally, confirm the workflow would fail (either
  by running the script locally exactly as CI does, or via a scratch branch) — then revert the
  breakage before merging anything.
- Confirm the workflow does not require secrets or network access beyond checkout (keep it dependency-light).

## Notes

- Owner: **fkit-coder** (this is implementation — a config file plus verifying it runs — not a
  producer or architect task).
- Depends on nothing else in this sprint.
- No code changes to `validate-bundles.sh` itself are implied unless verification uncovers it doesn't
  actually work as documented in CI's non-interactive environment — if so, report back rather than
  silently patching scope onto this task.
