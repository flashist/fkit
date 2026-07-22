# Add the `/fkit-dumb-down` skill for the six Claude-side roles

## ID
0003

## Sprint
Sprint 2

## Priority
72

## Status
✅ Done

## Owner
fkit-coder

## Context

**The owner's ask (2026-07-18):** a skill available for all agents — name `/fkit-dumb-down`,
description *"Explain again in simple terms."* On invocation, the agent re-explains its previous
answer in plain, non-specialist language.

**Relation to task 62 — owner-ruled 2026-07-18: BOTH.** Task 62 (backlog) makes simple language the
**standing default** via an output-style preference in the root context files. This skill is the
**on-demand** counterpart: even with 62 landed, "explain that again, simpler" remains a distinct act —
re-explain the last answer at reduced altitude (analogies over mechanism, no project jargon without a
one-line gloss). Neither depends on the other; they ship independently. **Do not fold this into 62 or
vice versa.**

**Scope — six Claude-side roles**, excluding `fkit-adversarial-reviewer`, per the same-day task-70
ruling and the same structural fact: its review runs on Codex under a restricted allowlist
([ADR-022](../../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)).
Flagged for owner confirmation in the scoping report; assumed, not re-asked.

**No ADR-021 seam here** — unlike `/fkit-open-questions-interview` (task 70), this skill needs no
owner channel: it rewrites the agent's own previous output. It works identically in a session and in
a spawned consult (where the re-explanation simply becomes the reply).

**Registration mechanics (settled):** `skills_for_role()` in `claude/fkit-claude.sh` + the task-43
`PreToolUse` gate; existing hook test suite covers allow/deny.

## What to build

- **`claude/skills/fkit-dumb-down/SKILL.md`** (canonical source): the procedure — take the agent's
  most recent substantive answer in this conversation and re-explain it in simple terms: short
  sentences, everyday words, project jargon only with a one-line gloss, an analogy where it helps.
  **Content-preserving:** simplification must not drop caveats, failures, or unverified-claim flags
  (the CLAUDE.md "concision is not omission" rule applies to simplification equally — say it simpler,
  keep saying it). If there is no previous answer to re-explain, say so and stop. No file writes.
- **`skills_for_role()`:** register for the six roles — producer, coder, reviewer, architect, wiki,
  lead. **Not** the adversarial reviewer.
- **Tests:** extend the existing hook/launcher suite (ADR-014, `node --test`) — allowed for each of
  the six roles, denied for `fkit-adversarial-reviewer`.

## Verification steps

- In any role session, after a jargon-heavy answer, `/fkit-dumb-down` produces a plain-language
  re-explanation of that same answer — same facts and caveats, simpler words; invoked with no prior
  answer, it says so instead of inventing content.
- A re-explanation of an answer containing a caveat/failure still contains it (spot-check).
- Skill invokable in each of the six role sessions; denied for the adversarial reviewer (hook test
  green).
- Running the skill creates or modifies no file.
- Test suite green, including the six-allow/one-deny registration cases.

## Notes

- **Owner: fkit-coder.** One shippable unit — skill dir + registration + tests together.
- **Depends on: nothing.** Independent of task 62 (both ship, either order) and of task 70 (sibling
  shape, no shared code). **Blocks: task 73** (wiki sync).
- **Numbered 72 per append-don't-renumber.** Owner to confirm the ranking.
