# Implement the coder's `task-ship-loop` skill from the approved design

## Sprint
Sprint 2

## Priority
53

## Status
✅ Done

## Context

**Task 52 designs the coder's autonomous brief-to-done loop and gets its steps approved by the
owner.** This task builds exactly that approved design — the skill text, its registration, and its
test coverage. Scoped now at shape level (the 40/41 pattern: the design task exists, so the
implementation brief records the frame); **its details are governed by task 52's approved spec, which
wins over this brief wherever they differ.**

**⚠️ Do not start before task 52's owner approval is recorded.** The owner's instruction was
explicit: the loop's steps are approved before implementation. An implementation begun against the
draft sketch re-creates the exact failure the 20/29 investigations exist to prevent — building
against a recommendation that did not survive review.

## What to build

*(Shape only — task 52's approved spec is the specification.)*

- The skill directory `claude/skills/fkit-task-ship-loop/` (final name per the approved design) with
  its SKILL.md implementing the approved loop, including the `⛔ Owner: the coder` banner per house
  style.
- Registration: the coder's list in `claude/skills-for-role.sh` — the single source of truth — so the
  session lockdown and the task-43 PreToolUse hook both allow the coder and deny everyone else.
- Argument contract per the one-skill-one-output convention
  ([`conventions/one-skill-one-output.md`](../../knowledge-base/conventions/one-skill-one-output.md)):
  the task-brief path is an operand; no output-variant arguments.
- Any agent-contract amendments the approved design ruled (e.g. `fkit-coder.md` wording about the
  plan/fix gates) — only those the owner approved in 52.
- Test coverage per the approved design and ADR-014's constraints (`node --test`, zero devDeps) — at
  minimum, the hook suite proves the new skill's allow/deny by role.

## Verification steps

- Task 52's approved spec exists and this implementation matches its numbered loop — deviations, if
  any were forced, are listed and justified in the coder's report, not silent.
- `fkit coder` session: the skill is invocable; a non-coder session/spawn is denied by the hook
  (both directions proven, per the task-43 verification pattern).
- `node --test` at repo root: green.
- A dry run of the loop on a real, small backlog task exercises the full path end-to-end — including
  the review leg (stateful review round-trip) and the approved close-out behavior — with the owner
  observing the owner-contact points the design promised.
- The skill's argument contract contains no output variants.
- No change to `ai-agents/wiki-vault/` (a wiki sync for the new skill is scoped separately once this
  lands — the skill name and shape must be final first).

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 52 — hard, including its owner-approval gate.** Blocks: the follow-up wiki sync
  (scoped when this lands, per the 44/45 and 50/51 pattern — deliberately not pre-created while the
  design may still rename or reshape the skill).
- If task 50 (the `task-plan` → `task-brief` rename) lands first, follow the renamed producer skill
  vocabulary in any cross-references.
- The dry-run verification needs a real small task — the producer can nominate one from the backlog
  at the time.
