# Changelog

Notable changes and upgrade notes for fkit, newest first. A release is a `v<x.y.z>` git tag cut by
`npm run release` (see [`RELEASING.md`](RELEASING.md)). The default install tracks `main`, so a change
reaches new installs as soon as it lands there, before any tag.

This file starts after v0.3.1. Earlier releases have tags but no written notes — compare two with
`git log <old-tag>..<new-tag>`.

## Unreleased

- README rewritten for first-time visitors. The web-board details moved to
  [`docs/board.md`](docs/board.md), the repository layout to [`CONTRIBUTING.md`](CONTRIBUTING.md), and
  the history and upgrade notes below into this file.

## Upgrade notes

### Projects with unsprinted briefs filed before v0.2.2: a stale backlog-header sentence

An update does not repair this. A launch refresh replaces the agents and skills under `.claude/` — it
never rewrites your project's own content under `ai-agents/`. If your project filed an unsprinted
brief before the correction shipped in v0.2.2, the header `/fkit-task-brief` generated into
`ai-agents/sprints/backlog.md` says the backlog is excluded from `/fkit-status` because its filename
sits outside a `sprint-*.md` glob. **That sentence is stale prose, not broken behaviour.** Since
[ADR-041](ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
the active sprint is selected by each plan's resolved **identity**, and the backlog is excluded
because its identity is `Backlog`, which is never eligible — a stronger rule, not a weaker one. Your
board works correctly; only its header sentence is wrong. Correct it by hand if you want it accurate;
nothing depends on it.

## History

### The Omnigent runtime was removed (Sprint 2; first tagged in v0.2.1)

fkit originally shipped a second runtime on [Omnigent](https://omnigent.ai). It was removed in
Sprint 2 — see
[ADR-009](ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) for
why, and
[ADR-010](ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) for
the role-locked model that replaced its team-session topology.

## Releases

| Tag | Date |
|---|---|
| `v0.3.1` | 2026-09-18 |
| `v0.3.0` | 2026-09-08 |
| `v0.2.2` | 2026-08-14 |
| `v0.2.1` | 2026-08-08 |
| `v0.1.0` – `v0.1.30` | 2026-07-03 – 2026-07-11 (no `v0.1.18`) |
