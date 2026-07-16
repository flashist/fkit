# Add a shared instructions layer that every fkit agent reads

**Source**: `ai-agents/tasks/done/add-shared-instructions-layer-for-all-agents.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 29 (investigation)

## Goal
The owner's ask: *"a way to add some instructions that ALL agents will use. Some sort of CLAUDE.md file, but only for the fkit agents… A single file, just to be sure that I don't duplicate the same thing across multiple files."* **Additive, not a refactor.**

An **investigation**, explicitly not a build: *"do not implement from this brief."*

## Key Changes

**The brief's own premise turned out to be false, and the investigation said so.** It asserted *"there is no way to give all seven fkit agents an instruction at once."* But `claude/scaffold/CLAUDE.md:56-63` **already ships a "Universal hard rules (every role, every session)" block** — and it reaches every fkit agent. The task collapsed from *"design and build a mechanism"* to *"fix the delivery holes in the mechanism we already ship."*

**The brief's headline motivation also collapsed.** It claimed the "no secrets" rule was in **2 of 7** agent files. **The verified count is 6 of 7.** Three counts were published across the effort — 2/7, 4/7, 3/7 — and **all three were wrong**, each from a grep that missed the phrasing *"sensitive information"*. **Lesson: a count of a *semantic* rule cannot be established by grepping one of its phrasings. Read the files.**

**The load-bearing unknown the brief correctly named** — *does the mechanism reach a spawned consult, or only a session?* — proved to be the whole ballgame, and it demanded **experiment over reasoning**:

| Channel | Session | Spawned consult |
|---|---|---|
| Agent definition file | ✅ | ✅ 3/3 |
| **Project `CLAUDE.md`** | ✅ | **✅ 3/3** |
| `--append-system-prompt` | ✅ (control) | **❌ 0/3 — session-only** |

**Rev 1 recommended an `ai-agents/AGENTS-COMMON.md` splice. It went through an adversarial pass (Codex + Claude, 17 findings) and did not survive — rev 2 *reverses* it.**

## Outcome
**Done.** Produced `reports/2026-07-14-shared-instructions-layer.md` (rev 2, post-adversarial) → **[[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]**, and spawned three implementation tasks: [[tasks/give-codex-the-universal-hard-rules]], [[tasks/merge-fkit-rules-block-into-existing-root-context-files]], [[tasks/add-no-secrets-rule-to-fkit-lead]].

**The headline: nothing new gets built. The owner's need was already met, with zero code** — he writes the instruction in `CLAUDE.md`.

**The brief's own risk assessment was exactly right, and it is why the investigation earned its place:** *"a mechanism that reaches sessions but not consults would be worse than nothing — the owner would believe an instruction is universal when it is not. That is the failure this brief exists to prevent."* **`--append-system-prompt` is precisely that mechanism**, and only the experiment caught it.

## Related
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the decision it produced
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — why the consult path is the trap
- [[tasks/give-codex-the-universal-hard-rules]]
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]]
- [[tasks/add-no-secrets-rule-to-fkit-lead]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]] — *"the first real customer of whatever this task builds"*
- [[systems/launch-convergence-and-init]]
- [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
