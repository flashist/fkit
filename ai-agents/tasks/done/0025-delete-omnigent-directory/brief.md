# Delete `omnigent/`

## ID
0025

## Sprint
Sprint 2

## Priority
5 (Phase 2)

## Status
✅ Done

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
§Phase 2) and [ADR-009](../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md).

The payoff task. Everything before it exists to make this safe.

## ⚠️ Ordering is the whole risk

This task is **low risk if and only if Phases 0 and 1 have landed**, and **catastrophic if run
early** — running it before Phase 0 breaks Claude init, the installer, and `fkit update` **at once**.

**Before starting, confirm all four predecessors are actually Done** — not "in progress", not
"basically done":
`extract-scaffold-into-claude` · `build-claude-self-update` · `make-codex-a-checked-prerequisite` ·
`rewrite-installer-single-flavor`.

If any is not Done, **stop and report** rather than working around it.

## What to build

`git rm -r omnigent/` (57 files). This removes:

- **7 bundles** — `fkit-{producer,coder,reviewer,adversarial-reviewer,architect,wiki,team}/`
  (`config.yaml` + `skills/`), including the 6 vendored `query` skill copies and `fkit-team`'s
  `reconnect-agents` / `restart` skills.
- **Scripts** — `fkit.sh`, `fkit-init.sh`, `vendor-agents.sh`, `validate-bundles.sh`,
  `sync-vendored-skills.sh`, `fkit-reconnect.sh`, `fkit-team-restart.sh`.
- **`omnigent/README.md`**.
- **`omnigent/scaffold/`** — by this point it should already be empty/gone, handled by Phase 0.1.
  ⚠️ **If it still contains `ai-agents/` or `AGENTS.md`, Phase 0.1 did not complete — stop.**

Also drop:
- `.omnigent/` handling, and the per-project `.fkit/agents/` vendoring + `.fkit/run` /
  `.fkit/team-session` machinery those scripts generate.
- Any `.gitignore` entries that existed **only** for the Omnigent path — check each one before
  removing; leave anything the Claude path still needs.
- `package.json`'s `description`, which still reads *"An Omnigent agent team for software
  projects…"*.

## Verification steps

The real test is a **clean clone → install → use**, end to end:

- Clean clone of the branch, install into a clean `$HOME`.
- `fkit` → role menu works.
- `fkit <role>` → a role-locked session starts, for **each** of the 7 roles.
- A **consult** works (one role asking another).
- A **review** works, and genuinely reaches Codex.
- `grep -rn "omnigent" .` — remaining hits should be **only** in the knowledge base (ADRs, the
  removal plan, the audit, `history/`), which is correct and intended. Any hit in `claude/`,
  `install.sh`, `package.json`, or a root doc means something was missed.

## Notes

- Owner: **fkit-coder**.
- **Depends on:** Phases 0.1, 0.2, 0.3, and 1 — **all of them.**
- **Blocks:** Phase 4 (docs) and Phase 5 (KB + wiki).
- Risk: **low, conditional on ordering** — see the warning above.
- Do **not** fix Omnigent-side doc drift, stale counts, or the `install.sh:42` `chmod` bug on the way
  out. They are deleted, not fixed.
