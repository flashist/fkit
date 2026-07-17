# Design the `fkit-git` agent and its commit/push consent model

## Sprint
Sprint 2

## Priority
55

## Status
🔲 Backlog

## Context

**The owner's ask (2026-07-17):** a new agent `fkit-git` responsible for git work, with one skill for
now, `commit-push` — commit and push all uncommitted working-tree changes, with a caller-supplied
commit title and message. Other agents can ask `fkit-git` to perform git tasks.

**⚠️ This collides head-on with a UNIVERSAL HARD RULE — flagged before any solution.**
`CLAUDE.md:49` (and the scaffold's, shipped to every project): *"**Never commit or push unless the
owner explicitly asks.** 'Implement' authorizes writing code, not committing."* It is one of the four
universal hard rules, repeated in every agent's contract and the reason "never commit unprompted" is
treated as inviolable across the whole team.

**An agent whose purpose is to commit/push, invocable *by other agents*, routes around that gate.**
If the coder (or any agent) can spawn `fkit-git` and have it commit, then "commit only when the owner
explicitly asks" is no longer true — an agent asked, not the owner. **This is not a bug to code
around; it is a decision the owner must make**, because it changes the meaning of the team's core
safety guarantee. That is why this is a design task, not an implementation brief. Precedent: task 36's
consent model, task 52's D1 done-gate — both were owner rulings before code.

**Second conflict — the seven-agent identity.** fkit is *"a team of **seven** role-scoped AI agents"*
verbatim in `CLAUDE.md:7`, `PROJECT.md:8`, the wiki (`systems/fkit.md`), `README`, the launcher menu,
and the `fkit-team` skill. `fkit-git` makes it **eight**. Every one of those counts and rosters
ripples — a known, bounded change, but it must be enumerated, not discovered.

**Third conflict — no-secrets on push.** `push` sends the working tree to a remote. The *"no secrets
in any artifact — it all goes to git"* rule already governs what may be committed; an agent that
commits *everything uncommitted* on request, unattended, is the highest-risk possible surface for
committing a stray secret or a junk file. The design must say how `commit-push` avoids blind-committing
whatever happens to be dirty.

### Genuinely open questions the design must resolve — as owner-facing proposals

1. **The consent model.** Does the owner's *"other agents can ask fkit-git"* override the hard rule, or
   sit under it? Options to put to the owner: (a) **owner-only** — `fkit-git` commits only in a session
   the owner drove, other agents may *prepare* but the owner triggers; (b) **explicit-relay** — an
   agent may request it, but only carrying the owner's recorded "yes" (the relayed-consent shape task
   52's D1 *rejected* for the mover — consistency matters); (c) **rule amendment** — the owner
   deliberately narrows the hard rule to "commit only via `fkit-git`, which any agent may invoke," a
   real weakening that would need an ADR and a rewrite of the rule in every agent file and the scaffold.
   **The producer's steer, not a decision: (a) or (b).** Option (c) trades away the guarantee the whole
   team is built on; it should not be chosen by default.
2. **Scope of `commit-push`.** "All uncommitted changes" — staged + unstaged + untracked? A dirty tree
   with unrelated edits gets swept into one commit. Does it stage-all blindly, show-and-confirm, or
   commit only what a caller names? Interacts with the no-secrets risk above.
3. **Push target and failure.** Which remote/branch? Behavior on no upstream, non-fast-forward, detached
   HEAD, protected branch, auth failure, nothing-to-commit. Push is irreversible-ish (a force
   is catastrophic — must be forbidden). Non-fatal, announce-what-happened, never a silent partial.
4. **The agent's contract and tools.** Tool allowlist (needs `Bash`; does it need `Write`/`Edit`? — no,
   if it only runs git). Consult rules (can other agents reach it — the two-hop envelope, ADR-010).
   Does `fkit-git` hold the universal hard rules (it must — task 30's lesson) while being the *one*
   agent licensed to commit? That paradox is the heart of ruling 1.
5. **Session vs consult.** Is `fkit-git` a session role on the launcher menu (making it eight menu
   options), a consult-only agent reachable via `@fkit-git`, or both? Skill-ownership goes in
   `skills-for-role.sh`; the ADR-018 PreToolUse hook must cover `commit-push`.
6. **Naming.** `commit-push` as a skill name, and whether it collides with the task-file lifecycle
   namespace the way `task-ship-loop` nearly did (task 52 §9).

## What to build

A design spec in `ai-agents/knowledge-base/reports/` (dated), worked out with the owner present for
the consent ruling, that:

- Resolves conflicts 1–6 above, each as an owner-approved proposal — **especially the consent model**,
  which may require an ADR amending or scoping the "never commit" hard rule.
- Enumerates every place the seven-agent count and roster is asserted, so task 56 (implementation) and
  the docs/wiki updates it spawns are complete, not partial.
- Specifies the `commit-push` contract: what it stages, how the caller passes title/message, push
  target resolution, the forbidden operations (force-push, at minimum), and its failure/announce
  behavior.
- Specifies the agent contract: tools, consult reachability, whether it is a session role, hook
  coverage.
- **Ends with the decisions the owner is asked to approve**, and the list of downstream tasks the
  approval spawns (implementation, docs, wiki, possibly an ADR and a hard-rule rewrite).

## Verification steps

- A dated design spec exists in `ai-agents/knowledge-base/reports/`.
- The consent-model conflict with `CLAUDE.md:49` is resolved by an explicit owner ruling recorded in
  the spec — not planned around, not left implicit.
- All six conflicts are addressed; the seven→eight agent-count ripple is fully enumerated.
- If the ruling weakens or scopes the universal hard rule, the spec says an ADR is required and names it.
- No implementation shipped: no `claude/agents/fkit-git.md`, no skill directory, no `skills-for-role.sh`
  change, no doc/count edits.
- Recommended: an adversarial pass before owner sign-off (the 20/29/52 precedent).

## Notes

- **Owner: fkit-architect**, with the **owner present** for the consent ruling (it changes a universal
  hard rule's reach — not a technical detail).
- **Depends on: nothing. Blocks: task 56 (implementation) — hard**, including the owner's approval of
  the consent model. No agent-building before the rule question is settled.
- **Conflicts with a locked rule** (`CLAUDE.md:49`) — this is surfaced, not resolved, by the producer;
  the resolution is the owner's.
- If task 50 (`task-plan`→`task-brief` rename) informs skill-naming conventions, note it; not a hard dep.
