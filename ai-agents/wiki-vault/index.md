# Wiki Index

Master catalog of all wiki pages — one line per page, grouped by category.
Add an entry here whenever a page is created (see `schema.md`).

## Features

## Systems
- [[systems/fkit]] — Omnigent-based team of AI agents, startup flow, self-update, and operating constraints
- [[systems/subagent-runner-connectivity]] — Subagent runner disconnects, visibility gaps, and reconnect recovery

## Decisions
- [[decisions/adr-001-package-json-stays-metadata-only]] — Keep `package.json` metadata-only and defer `npx fkit`
- [[decisions/adr-002-archive-pre-omnigent-design-docs]] — Move superseded pre-Omnigent design docs into history
- [[decisions/adr-003-ci-runs-validate-bundles]] — Add CI to run `omnigent/validate-bundles.sh`
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]] — Reuse fixed `<target-agent>-consult` titles for consult children

## Tasks
- [[tasks/sprint-1-ship-the-onboarding-sequence]] — Sprint 1 plan for onboarding verification, consult-envelope documentation, CI validation, and follow-on doc fixes
- [[tasks/fix-claude-agents-md-placeholder-text]] — Replace placeholder prose in `CLAUDE.md` and `AGENTS.md`
- [[tasks/build-fkit-reconnect-tooling]] — Stopgap `fkit reconnect` CLI for disconnected subagent runners
