# Plan — Task 57: relax the tool allowlist for every role except the adversarial reviewer

_Owner-approved via the task-ship-loop plan gate (2026-07-18). Durable autonomy boundary (ADR-020)._

## Context
ADR-022 (accepted 2026-07-18): the `tools:` wall was never a real sandbox (Bash escape hatch) and
capability tools were excluded by accident. Only the adversarial reviewer's wall protects a real
invariant. Relax tools for the six Claude-side roles; keep the adversarial reviewer byte-identical.
Tools change only — skill lockdown (ADR-018) and all role-boundary prose untouched.

## Change — OMIT the `tools:` line (ADR + brief recommendation; coder's call)
Delete the `tools:` frontmatter line from: `fkit-producer.md`, `fkit-coder.md`, `fkit-architect.md`,
`fkit-reviewer.md`, `fkit-wiki.md`, `fkit-lead.md` (all `claude/agents/`).
- Knowingly dropped (accepted ADR-022 consequences, not regressions): the six `AskUserQuestion`
  entries (retained by inheritance), coder's `EnterPlanMode`/`ExitPlanMode` (inherited), lead's scoped
  `Agent(fkit-…)` list (topology stays prompt-enforced).
- **Do NOT touch** `fkit-adversarial-reviewer.md` (`tools: Read, Grep, Glob, Bash, Skill` byte-identical).
- No prose edits; no `skills-for-role.sh`/hook/mirror-table change; doc refresh is task 58.

## Verification
- Six files: no `tools:` line; adversarial reviewer intact.
- `git diff` shows only the removed `tools:` line per file; nothing else.
- `node --test` green (hook suite keys on `skills_for_role`, not agent `tools:` — skill lockdown holds).
- init into scratch → six copies carry no `tools:` line; adversarial reviewer's line regenerates intact.
- Caveat: live session spot-checks (WebSearch runs; coder still denied /fkit-review) are owner/producer-run (coder role lock).
