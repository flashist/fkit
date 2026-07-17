# Implement the `fkit-git` agent and its `commit-push` skill

## Sprint
Sprint 2

## Priority
56

## Status
🔲 Backlog

## Context

**Task 55 designs `fkit-git` and gets the owner's ruling on the commit/push consent model.** This
task builds the approved design: the agent file, the `commit-push` skill, its registration, the
eight-agent count/roster updates, and any hard-rule amendment the owner approved. Scoped now at shape
level (the 52/53, 40/41 pattern); **task 55's approved spec governs and wins wherever it differs.**

**⚠️ Do not start before task 55's owner approval is recorded.** The whole point of the design gate is
that this agent's core skill collides with the *"never commit or push unless the owner explicitly
asks"* universal hard rule (`CLAUDE.md:49`). Building it before the consent model is ruled would ship
a routing-around of the team's central safety guarantee.

## What to build

*(Shape only — task 55's approved spec is the specification.)*

- `claude/agents/fkit-git.md` — the agent contract per the approved design: role description, tool
  allowlist (at least `Bash`; no `Write`/`Edit` unless the design justifies it), the universal hard
  rules block (task 30's floor — it applies even to the git agent), the consult reachability the
  design ruled, and the approved consent model stated in the contract.
- `claude/skills/fkit-git-commit-push/` (final name per the design) with its SKILL.md: the
  `⛔ Owner: fkit-git` banner, the caller-supplied title/message argument (operand — no output
  variants, one-skill-one-output), the exact staging behavior the design ruled, push-target resolution,
  the **forbidden operations** (force-push at minimum), and non-fatal announce-what-happened failure
  handling.
- Registration in `claude/skills-for-role.sh` (single source of truth) so the ADR-018 PreToolUse hook
  allows `fkit-git` and denies every other role; mirror tables (`fkit-team`, `README`) in the same
  commit.
- If `fkit-git` is a session role per the design: launcher menu wiring in `fkit-claude.sh`.
- **The seven→eight agent-count and roster updates** the design enumerated: `CLAUDE.md`,
  `PROJECT.md`, scaffold `CLAUDE.md`, `README`, `fkit-team` skill, launcher — every place task 55
  listed. The wiki is **out of scope** (fkit-wiki's exclusive path — a separate sync task once this
  lands).
- Any ADR or hard-rule rewrite the owner approved in task 55 (only if approved).
- Tests per ADR-014 (`node --test`, zero devDeps): the hook allow-for-`fkit-git` / deny-for-others,
  both directions; plus whatever exit-path checks the design specifies for `commit-push`.

## Verification steps

- Task 55's approved spec exists and this implementation matches it; forced deviations are listed and
  justified in the coder's report.
- The approved consent model is enforced as designed — a commit/push cannot happen by a path the owner
  ruled out (proven, not asserted).
- `commit-push` refuses the forbidden operations (e.g. force-push) and handles no-upstream /
  nothing-to-commit / auth-failure non-fatally with a clear announcement — exercised, not just coded.
- The ADR-018 hook allows `fkit-git`'s skill and denies every other role, both directions.
- `node --test` at repo root: green.
- Every asserted agent count reads **eight** (or the design's chosen wording) consistently across the
  files task 55 enumerated — no file still says "seven".
- No change to `ai-agents/wiki-vault/` (its sync is a separate task once the agent name/shape is final).

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 55 — hard, including its owner-approval gate.** Blocks: a follow-up wiki sync
  (scoped when this lands — deliberately not pre-created while the design may still rename/reshape).
- **Highest-care item in the sprint:** it ships the one agent licensed to commit. The consent model
  and the forbidden-operations list are the specification, not guidance.
- A real `commit-push` dry-run belongs in verification — on a scratch repo/branch, never a live push to
  a shared remote as a test.
