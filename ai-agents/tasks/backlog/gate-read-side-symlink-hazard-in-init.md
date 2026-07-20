# Gate the read-side symlink hazard when init reads inside `ai-agents/`

## ID
0045

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Context

**Task 27 gated *writes* through a symlinked `ai-agents/`, but not *reads*.** It added a `[ -L ]` check
before `[ -e ]` at `fkit-claude-init.sh:40` so a symlinked `ai-agents/` is refused rather than written
through. That guard protects the **write** side. It does **not** protect a future init step that
*reads* from `$dest/ai-agents/…`: such a read would follow the link and pull **off-project content**
into fkit's own behavior — a symlinked `ai-agents/` pointing at an attacker-or-accident-controlled tree
becomes an input to what fkit does.

**Nothing does this today — the hazard is latent, not live.** The one design that would have read
through `ai-agents/` (the rejected `AGENTS-COMMON.md` splice) is dead, which is why this is now latent
rather than active. Tasks 30–32 do not touch it: they read from the **scaffold** and write to the
**project root**, never reading through `$dest/ai-agents/`.

**Owner decision (2026-07-15):** track this independently as its own backlog task — resolving Sprint 2
open question 7 by taking the counter-argument (track it independently so it cannot be lost with the
still-parked task 28) rather than folding it into task 28's brief.

## What to build

- **A read-side symlink guard for any init code path that reads inside `$dest/ai-agents/`.** Before init
  reads a path under a project's `ai-agents/`, confirm the containing `ai-agents/` (and, where relevant,
  the specific path) is **not** a symlink — mirroring task 27's `[ -L ]`-before-`[ -e ]` ordering on the
  read side.
- **Refuse-and-report on a symlinked read target**, consistent with task 27's write-side refusal, rather
  than silently following the link.
- The guard should be in place **before** the first init step that genuinely reads per-path inside
  `ai-agents/` — which today is **task 28** (additive convergence walks and reads the tree). If task 28
  lands first, that requirement must be carried in its implementation; this task exists so the hazard is
  tracked even if 28 stays parked.

## Verification steps

- **A symlinked `ai-agents/` is refused on the read path**, not followed: point `ai-agents/` at an
  out-of-project directory, trigger the init read path, and confirm fkit refuses and reports rather than
  reading off-project content.
- **A normal (non-symlink) `ai-agents/` is read as before** — the guard does not break the ordinary
  case.
- **Consistency with task 27:** the read-side refusal behaves the same way (message, non-fatal handling)
  as the write-side refusal task 27 added.

## Notes

- **Owner: fkit-coder** — an init (`fkit-claude-init.sh`) change.
- **Relates to: task 28** (`converge-ai-agents-additively-on-launch`) and **task 27**
  (`refuse-init-on-weird-ai-agents-state`). **If task 28 is implemented first, this guard must be part of
  it** — this brief is the independent tracking so the requirement is not lost while 28 is parked. **No
  hard code dependency**, but it should not be considered complete separately from whatever first reads
  per-path inside `ai-agents/`.
- **Latent, not live** — there is no current code path that reads through a symlinked `ai-agents/`. This
  is a guard placed ahead of a future capability, deliberately tracked rather than deferred into a
  parked task's brief.
- **Risk: low today** (nothing reaches it), **rising the moment a read-inside-`ai-agents/` step ships.**
