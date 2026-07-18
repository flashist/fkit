# Record the "one skill, one output" convention

**Source**: `ai-agents/tasks/done/record-one-skill-one-output-convention.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 47

## Goal
Record, as a **standing convention for every fkit skill**, the principle the owner generalized from the `/fkit-status full` removal (resolving Sprint 2 open question 8). Background: the owner ran `/fkit-status`, was told to run `/fkit-status full` for the complete board, and ruled — *"there should be 1 version of the output if I run the skill, no additional arguments."* Task 44 applies that to `/fkit-status`; this task writes the general rule into `knowledge-base/conventions/`.

**Why a convention, not a tombstone ADR:** this repo's ADRs record mechanism and structure; this is a rule about how skills are *written* — and a convention has more teeth, stopping the *next* `full` from being written where a tombstone only explains why this one died.

## Key Changes
Wrote `ai-agents/knowledge-base/conventions/one-skill-one-output.md`, and added its row to `conventions/README.md`. It contains:
- **The rule:** for any subject, a skill produces **one output — the complete one**; no `full`/`all`/`board`, no verbosity flag, no summary/partial/conditional mode. If the complete output feels heavy, make it *cheaper*, don't hide it behind an argument.
- **The operand-vs-variant distinction + one-line litmus test:** does the argument change *what the skill works on*, or *what the same work looks like when reported*? The first is a parameter (allowed, often mandatory); the second is a variant (forbidden). All four owner examples — `/fkit-task-done <path>`, `/fkit-task-cancelled <path> <reason>`, `/fkit-status <sprint>`, stateful-review docs — sit on the **allowed operand** side.
- **Honest history:** `full` (task 38) was **correct when written** — the board was hand-built and expensive; task 41 made rendering free and *that* retired the variant's justification. The rule is written from a single instance and says so.
- **The escape hatch:** a proposed variant is an **owner decision at proposal time**, never a silent design choice.

**Owner: fkit-architect** — a knowledge-base document, no code. Scope boundary: it **records** the rule; it does not audit-and-fix the skill set (a further live variant is a finding to flag, not fix here).

## Outcome
**Done.** Its delivery surfaced the **fourth** live-vs-scaffold parity instance (the convention landed in the live tree but not `claude/scaffold/ai-agents/knowledge-base/conventions/`), spawning tasks 48 ([[tasks/ship-one-skill-one-output-convention-in-scaffold]] — now Done) and 49 (the parity-cause investigation, backlog). Task 44 ([[tasks/remove-output-variants-from-fkit-status]] — Done) applied the rule to `/fkit-status` itself.

## Related
- [[tasks/remove-output-variants-from-fkit-status]] — task 44, the instance this rule generalizes
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — task 48, which ships the convention to consuming projects
- [[systems/knowledge-base-structure]] — the conventions folder this entry joins
- [[tasks/add-full-board-switch-to-fkit-status]] — task 38, the honest history (the `full` switch, later reverted)
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — task 41, which made rendering free and retired the variant
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — a prior live-vs-scaffold parity instance
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/implement-task-ship-loop-skill]] — the ship-loop's operand-only argument contract follows this rule
