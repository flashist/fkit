# Add the "no secrets" rule to `fkit-lead.md` — the one agent file missing it

**Source**: `ai-agents/tasks/done/0007-add-no-secrets-rule-to-fkit-lead/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 32

## Goal
Six of the seven agent files carried a "no secrets / no sensitive information" rule. **Exactly one did not: `claude/agents/fkit-lead.md`**, whose `## Hard rules` section had two entries — never commit, never write the wiki — and no third.

## Key Changes
- **One bullet added** to `## Hard rules`, matching the section's existing style: *"Never expose sensitive information… including a routed answer you bring back from another role."* **The trailing clause is the part that earns its keep** — the lead's actual output surface is **relayed answers from other roles**, so that is where it could leak.
- **Out of scope, deliberately:** normalizing the other six wordings (three phrasings exist across six files — *the owner asked for additive only, and the report is clear this is cosmetic*), and stripping the duplicated rules out of the agent files.

**The brief openly refuses to oversell itself, and that is the point:** a rule present in **6 of 7** files is **copy-paste hygiene, not a systemic drift crisis** — and it **materially weakens** the case for building any mechanism, *which is part of why the `AGENTS-COMMON.md` splice was rejected*. The lead also holds **no `Write`/`Edit` tools**, so it is the agent **least** able to leak a secret into an artifact.

**"It is still one missing line in a hard-rules list, and it costs one line to fix. That is the entire justification, and it is enough."**

## Outcome
**Done.** The check that would have caught the omission in the first place is now the pass condition: `grep -LiE "sensitive|secret|credential" claude/agents/fkit-*.md` → **no output**. *(`-L` lists files **without** a match; an empty result is the pass.)*

**Split out on purpose:** an **agent-definition** file, where tasks 30 and 31 touch **scaffold and init** — different files, different verification, independently shippable. **Numbered last because it is the least consequential of the three, not because it was blocked.**

It is the **residue of the motivation [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] downgraded** — and the ADR explicitly notes it *"should not be lost with it."*
## Related
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the collapsed drift motivation, and this as its residue
- [[tasks/add-shared-instructions-layer-for-all-agents]]
- [[tasks/give-codex-the-universal-hard-rules]]
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]]
- [[systems/fkit]]
- [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
