# Design: the `fkit-git` agent and its commit/push consent model

- **Date:** 2026-07-18
- **Author:** fkit-architect
- **Task:** [`design-fkit-git-agent-and-consent-model.md`](../../tasks/backlog/design-fkit-git-agent-and-consent-model.md) (Sprint 2, #55)
- **Status:** ⚰️ **SUPERSEDED / not built — see [ADR-023](../decisions/adr-023-fkit-git-agent-is-not-built.md).** On 2026-07-18 the owner initially ruled consent model (c) fully-unattended, then **reversed within the session and cancelled `fkit-git` entirely** — an unattended commit+push is too high a risk of pushing sensitive/unintended content to a remote. This document is retained as the **record of what was weighed**, not a live design. Task 55 is cancelled; task 56 is not created.
- **~~Blocks:~~** task 56 (implementation) — **not created** (see ADR-023).

---

## Summary — the one decision everything hangs on

The owner asked for a `fkit-git` agent with a `commit-push` skill, invocable by other agents. **That collides head-on with `CLAUDE.md:49`: *"Never commit or push unless the owner explicitly asks."*** An agent that commits on *another agent's* request means an *agent* asked, not the owner — the hard rule's core guarantee dissolves.

**Architect's recommendation: consent model (a) — owner-only.** `fkit-git` commits **only when the invocation carries the owner's own explicit, in-session request.** Other agents may *prepare* a commit (stage paths, draft a message) and *hand it to the owner*, but the **owner triggers** the actual `commit-push`. This is the **only option that keeps the hard rule true rather than rewriting it**, and it is **consistent with task 52's D1**, which already rejected relayed-consent for the task-mover. Option (b) explicit-relay contradicts D1; option (c) rule-amendment trades away the guarantee the whole team is built on — neither should be chosen by default.

Under (a), **no hard-rule *amendment* is needed** (the rule stands; `fkit-git` is simply *how* the owner's "yes" is executed) — but a **decision-record ADR** is still warranted to pin the consent model so it is not re-litigated. Under (b) or (c), a hard-rule-amending ADR **and** a rewrite of the rule in every agent file + the scaffold **is** required.

---

## Conflict 1 — the consent model (the ruling that gates the rest)

| Option | What it means | Verdict |
|---|---|---|
| **(a) Owner-only** *(recommended)* | `fkit-git` commits only on the owner's explicit trigger in a session the owner drove. Agents may *prepare*, never *fire*. | **Keeps `CLAUDE.md:49` literally true.** Consistent with task 52 D1. No rule rewrite. The "yes" is always the owner's. |
| **(b) Explicit-relay** | An agent may fire `commit-push` if it carries the owner's recorded "yes". | **Rejected as default.** This is the exact relayed-consent shape **D1 rejected for the mover** — choosing it here contradicts a settled decision, and consent relayed through an agent is exactly the ambiguity the hard rule exists to forbid. Needs a hard-rule-amending ADR. |
| **(c) Rule amendment** | The hard rule is narrowed to "commit only via `fkit-git`, which any agent may invoke." | **Rejected as default.** A real weakening of the team's core safety guarantee; needs an ADR *and* a rewrite of the rule in all six agent files + `claude/scaffold/CLAUDE.md` + `CLAUDE.md`. Only if the owner deliberately wants unattended agent commits. |

**The paradox the brief names** — `fkit-git` must *hold* the universal hard rules (task 30's lesson: every agent gets them) while being the *one* agent licensed to commit — **resolves cleanly under (a):** `fkit-git` holds *"never commit unless the owner explicitly asks,"* and it commits *because the owner explicitly asked.* The rule is honored at the moment of action, not excepted. There is no contradiction; there would be one under (c), which is why (c) needs the rule itself rewritten.

## Conflict 2 — scope of `commit-push` (interacts with no-secrets)

**Recommendation: show-and-confirm, never blind stage-all.** The highest-risk surface in fkit (an agent committing *everything dirty* unattended) is closed structurally by never doing that:

- **Default:** commit **tracked modifications** + any **explicitly named paths** the caller passes. **Untracked files are NOT swept in by default** — including them requires an explicit `--include-untracked` operand.
- **Always print, before committing:** a `git status --short` + `git diff --stat` summary (staged + would-stage), and a **loud, separate list of untracked files** that would be included if `--include-untracked` is set. Under model (a) the owner sees this and confirms.
- **No-secrets guard:** because scope is *named/tracked* not *all-dirty*, a stray secret file (typically untracked / newly dropped) is **not** committed unless someone explicitly opts it in and the owner sees it in the untracked list. The presence-of-owner + explicit-untracked-opt-in is the guard; a content denylist is *not* proposed (brittle, false confidence). This keeps the "no secrets in any artifact — it all goes to git" rule enforceable by the owner's eyes at the confirm step.

## Conflict 3 — push target, failure modes, forbidden operations

- **Target:** the current branch's configured **upstream** (`@{u}`). Resolve it; do not guess a remote/branch.
- **Forbidden, always:** `--force` / `--force-with-lease` (a force-push is catastrophic and irreversible-ish) — `commit-push` **must refuse to force under any condition** and say so.
- **Failure behavior — non-fatal, announce-what-happened, never a silent partial:**
  | Condition | Behavior |
  |---|---|
  | No upstream configured | Do **not** auto-create one. Commit locally (if asked), then **announce** "committed; no upstream — push skipped, set one with `git push -u`." |
  | Non-fast-forward (remote ahead) | **Refuse to push** (never force). Announce; leave the commit local. |
  | Detached HEAD | Refuse; announce (nothing to push a branch to). |
  | Protected branch / auth failure | Refuse; announce the exact git error, no retry loop. |
  | Nothing to commit | Announce "nothing to commit"; exit clean, not an error. |
- **Atomicity:** commit and push are **separate, ordered, announced steps.** If push fails, the commit still stands locally and that is **stated explicitly** — never a silent partial where the caller thinks it pushed.

## Conflict 4 — the agent contract and tools

- **Tools:** `Bash` (runs `git`) + `Read`, `Grep`, `Glob` (to show the caller what it's about to commit). **No `Write`/`Edit`** — it runs git, it does not author files. **No `Agent`** — it is a leaf; it does not consult onward. *(Note under ADR-022 the six Claude roles carry no `tools:` line; `fkit-git` should carry an **explicit minimal `tools:` line** like the adversarial reviewer, because — like the adversarial reviewer — it has a real invariant to keep structural: it must not gain the ability to author code it then commits. An explicit `tools: Read, Grep, Glob, Bash` line, no `Write`/`Edit`/`Agent`, at any spawn depth.)*
- **It holds the universal hard rules** (task 30) — including "never commit unless the owner explicitly asks" — and is the one agent whose *purpose* is to execute that permission when granted (Conflict 1).
- **Consult reachability:** reachable as `@fkit-git` within the two-hop envelope (ADR-010). Under model (a) it only *fires* on the owner's trigger; a mid-consult call from another agent (no owner trigger) hits its refusal path and returns "prepared, not committed — needs the owner."

## Conflict 5 — session vs consult (and the count ripple)

**Recommendation: consult-only helper agent (`@fkit-git`), NOT a launcher menu role.** Git work is a *service* other roles/the owner request, not a session you sit in. This keeps the **human menu at seven options** (no 8th menu item) and matches the owner-only consent model (the owner requests it from whatever session they're in).

**But it is still an 8th *agent file*.** The "team of **seven**" identity changes — even as a consult-only helper, the agent count becomes eight (or "seven roles + a git helper," phrasing the owner picks). **This ripple must be enumerated, not discovered.** Every canonical assertion of the count/roster (verified 2026-07-18):

| Location | Assertion | Update |
|---|---|---|
| `CLAUDE.md:7` | "team of **seven** role-scoped AI agents" | count/roster |
| `ai-agents/knowledge-base/PROJECT.md:8` | "team of seven role-scoped AI agents" | count/roster |
| `ai-agents/knowledge-base/PROJECT.md:72` | "seven roles with dedicated skills" | count |
| `ai-agents/knowledge-base/architecture.md:4` | "seven roles, no orchestrator" | count |
| `ai-agents/knowledge-base/architecture.md:82` | "### 4.1 The seven roles" + the role table | add row / reframe |
| `README.md:76` | "the seven roles as … subagent definitions" | count |
| `claude/fkit-claude.sh:426-448` | the menu **and** the `role [1-7…]` prompts + the `case` arms | **only if** fkit-git becomes a menu role (not recommended) — otherwise **no launcher change** |
| `claude/skills/fkit-team/SKILL.md` | the roster the `/fkit-team` skill prints | add fkit-git |
| `claude/README.md` | the skill-ownership table (mirrors `skills_for_role()`) | add `commit-push` row |
| `ai-agents/wiki-vault/wiki/systems/fkit.md:7,:15` | "team of seven" + "The seven roles" | **wiki-sync — fkit-wiki's exclusive path**, a spawned follow-up, NOT an architect/coder edit |
| `claude/scaffold/CLAUDE.md` | *(carries the universal rules, not the "seven" count — verified: no "seven")* | none — **but** if (c) is chosen, the hard-rule text here changes |

**Recommended framing** (keeps the menu honest): "**seven role sessions on the menu, plus `fkit-git`, a consult-only git helper**" — the count prose becomes "eight agents, seven of them menu roles" or similar. The owner picks the exact wording; the *set of places* is the enumeration above.

## Conflict 6 — naming

`commit-push` as the skill name **does not collide** with the task-lifecycle namespace (`task-done`, `task-cancelled`, `task-brief`, `task-ship-loop`) — different prefix, different verb. Fine. **Wiring:** skill ownership goes in `skills-for-role.sh` (the single source of truth, `fkit-claude.sh:210`); the **ADR-018 PreToolUse skill-ownership hook must be extended to cover `commit-push`** so only `fkit-git` can run it, at any spawn depth. The two human-facing mirror tables (`fkit-team/SKILL.md`, `claude/README.md`) must be updated in the same commit (the `skills_for_role()` mirror-drift warning, `fkit-claude.sh:224-230`).

---

## For the owner — the decisions this spec is asking you to approve

1. **The consent model — ruling required.** Recommended: **(a) owner-only.** Confirm (a), or choose (b)/(c) — and note (b)/(c) each require a **hard-rule-amending ADR** and a rewrite of `CLAUDE.md:49` in every agent file + `claude/scaffold/CLAUDE.md`.
2. **Session vs consult — ruling required.** Recommended: **consult-only helper `@fkit-git`, menu stays seven.** Confirm, or make it an 8th menu role.
3. **Commit scope — confirm:** tracked + named paths by default; untracked only via explicit `--include-untracked`; always show-and-confirm; **force-push forbidden absolutely.**
4. **Count/roster wording — confirm** the framing ("eight agents, seven menu roles") so the enumeration above lands complete.

**Downstream tasks the approval spawns:**
- **An ADR** — under (a): records the fkit-git consent model (decision record). Under (b)/(c): **amends the "never commit" hard rule** (owner + architect, `/fkit-record-decision`).
- **Task 56 (implementation)** — the `fkit-git.md` agent + `commit-push` skill + `skills-for-role.sh` + ADR-018 hook coverage (fkit-coder).
- **Docs update** — the count/roster ripple in `CLAUDE.md`, `PROJECT.md`, `architecture.md`, `README.md`, `claude/README.md`, `fkit-team` (fkit-architect/coder as appropriate).
- **Wiki-sync** — `systems/fkit.md` count/roster (**fkit-wiki only**).
- **Hard-rule rewrite** — only under (b)/(c).

**Recommended: an adversarial (Codex) pass on this spec before you sign off** — the task-20/29/52 precedent (rev-1 designs that did not survive Codex intact), especially warranted here because the spec touches a universal safety guarantee. Say the word and I'll route it to the adversarial reviewer.

## Related

- `CLAUDE.md:49` — the universal hard rule this collides with.
- Task 52 / D1 — rejected relayed-consent for the task-mover; the precedent making (a) the consistent choice and (b) the inconsistent one.
- Task 30 / [ADR-016](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) — every agent holds the universal hard rules (the paradox in Conflict 4).
- [ADR-010](../decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) — the two-hop consult envelope `@fkit-git` sits in.
- [ADR-018](../decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the PreToolUse skill-ownership hook that must cover `commit-push`.
- [ADR-022](../decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md) — why `fkit-git` should carry an **explicit** minimal `tools:` line (the adversarial-reviewer precedent for a real structural invariant).
- Code: `claude/fkit-claude.sh:210` (`skills_for_role()` / `skills-for-role.sh` — the single source of truth), `:224-230` (the mirror-drift warning), `:426-448` (the menu + `case`).
