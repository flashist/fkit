# Add the `/fkit-open-questions-interview` skill for the six Claude-side roles

## Sprint
Sprint 2

## Priority
70

## Status
✅ Done

## Context

**The owner's ask (2026-07-18):** a skill available to (nearly) all agents — name
`/fkit-open-questions-interview`, description *"If there are any open questions, interview me about
them."* Interview rulings, recorded here so the coder does not reopen them:

1. **Source = the current session's history only.** Not the sprint plan, not task briefs, not docs.
   The skill sweeps the conversation so far for open questions the owner was asked (or that were
   flagged for them) and **never answered**, dedups, and interviews the owner about them.
2. **Scope = the six Claude-side roles** — every role except `fkit-adversarial-reviewer` (Codex-run,
   restricted allowlist per
   [ADR-022](../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md),
   no interactive channel). No ADR change needed.
3. **Interview only.** Answers live in the conversation; the skill records nothing to files. Zero
   write surface.

**Session-vs-consult — the known seam
([ADR-021](../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):**
`AskUserQuestion` exists only in a session. The skill must carry the standard degrade: in a session,
interview via `AskUserQuestion` (batched, with recommendations where the session already implies one);
in a spawned consult (no owner channel), **do not attempt to interview** — list the unanswered
questions in the reply instead. Follow the ⛔ banner precedent for advisory boundaries in consults
(ADR-012).

**Registration mechanics (settled — not to re-investigate):** role→skill ownership lives in
`skills_for_role()` in `claude/fkit-claude.sh` (single source of truth), enforced by the `PreToolUse`
skill-gate hook (task 43). Adding a six-role skill = one skill dir + six list entries; the existing
hook test suite covers the gate.

## What to build

- **`claude/skills/fkit-open-questions-interview/SKILL.md`** (canonical source): the procedure —
  sweep the current session history for questions put to the owner and left unanswered (explicitly
  including questions the owner partially answered — the unanswered remainder counts); dedup;
  if none, say so and stop; otherwise interview via `AskUserQuestion` (batched, ≤4 per call);
  consult-mode degrade per above. No file writes.
- **`skills_for_role()`:** register the skill for the six roles: producer, coder, reviewer, architect,
  wiki, lead. **Not** the adversarial reviewer.
- **Tests:** extend the existing hook/launcher suite (ADR-014, `node --test`) — the skill is allowed
  for each of the six roles and denied for `fkit-adversarial-reviewer`.

## Verification steps

- In a `fkit producer` session where an earlier turn asked the owner something that went unanswered,
  `/fkit-open-questions-interview` surfaces exactly that question and interviews; with nothing
  unanswered, it says so and stops — no invented questions.
- The skill is invokable in each of the six role sessions; invoking it as/for the adversarial
  reviewer is denied by the gate (hook test green).
- No file in the working tree is created or modified by running the skill.
- Test suite green, including the six-allow/one-deny registration cases.

## Notes

- **Owner: fkit-coder.** One shippable unit — skill dir + registration + tests land together (a
  registered skill with no file, or a file no role may run, ships nothing).
- **Depends on: nothing. Blocks: task 71** (wiki sync).
- **The three interview rulings above are owner decisions — do not reopen them in planning.**
- **Numbered 70 per append-don't-renumber.** Owner to confirm the ranking.
