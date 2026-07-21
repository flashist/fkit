# Give Codex the universal hard rules it has never had

**Source**: `ai-agents/tasks/done/0047-give-codex-the-universal-hard-rules/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 30

## Goal
**The one model fkit *requires* for independent, model-diverse review ran with none of fkit's shared rules.** Not a design gap — **a live defect, shipping to every project fkit had ever set up.**

## Key Changes

**The chain, every link verified:**
1. The adversarial pass shells out: `codex exec --sandbox read-only --cd "$PWD"`.
2. **Because of `--cd "$PWD"`, the codex CLI natively reads the project-root `AGENTS.md`** — init's own header comment says exactly this.
3. **`claude/scaffold/AGENTS.md` had no universal-hard-rules section at all.** Neither did this repo's own. **Zero matches** for `never commit` / `no secrets` / `wiki writes`.

So Codex — required by [[decisions/adr-009-claude-code-native-is-the-only-runtime]] **precisely so the second opinion is genuinely independent** — received the project overview and the architecture pointer, and **not one** of: don't commit unprompted, don't write the wiki, don't move task files, **no secrets in any artifact**.

- **The fix: add the four rules to `claude/scaffold/AGENTS.md` and to this repo's own `/AGENTS.md`** (fkit dogfoods itself; it had the hole too). **Adds text. Builds no mechanism.**
- **Do not copy `CLAUDE.md`'s team-map across** — *Codex is not a role-locked fkit session and has no `/fkit-*` skills; a roster and a hop-budget protocol would be noise in its context.* **Ship the four rules, not the surrounding apparatus.**
- **Word rule 3 so it is true for Codex.** It runs `--sandbox read-only` and cannot move a file anyway; the rule's real work there is *"do not tell the coder to move one, and do not report a task as moved."* **Say the rule, not a fiction about what Codex can do.**
- **Keep it short** — the text lands in the Codex context on **every** adversarial pass.

**The verification step that mattered — prove the premise, don't assume it:** run `codex exec` and ask it to list the rules it was given. *"If it returns NONE, stop and report: the 'codex reads root `AGENTS.md`' premise is false, and the whole task is built on it."*

## Outcome
**Done.** *"The highest-value change in the whole shared-instructions investigation, and close to free."* Verified live: **before the change Codex returned nothing; after, it returns all four** — including from a brownfield `AGENTS.md` through the managed block.

⚠️ **Delivery, not a floor — and the brief said so on purpose.** There are **zero hooks**; a rule in a context file is **prose asking a model to behave**. *"Do not let a reviewer read 'structural floor' into it — that overclaim is exactly what ADR-012 had to retrofit onto ADR-010."* **[[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] then made that very overclaim in its own summary and had to be amended.**

**Accepted churn, explicitly:** task 31 re-cut these same ~8 lines into a marker-delimited managed block. *"Cheaper than delaying a live defect fix behind a mechanism change."*
## Related
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — Codex is a **required** runtime; this was a live defect against that premise
- [[tasks/add-shared-instructions-layer-for-all-agents]] — the investigation
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] — blocked on this one's canonical text
- [[tasks/add-no-secrets-rule-to-fkit-lead]]
- [[systems/review-and-model-diversity]]
- [[systems/launch-convergence-and-init]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-speak-in-simple-terms-output-style]] — the same `AGENTS.md` reach applied to an output-style preference
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — the commit rule Codex now receives, reaffirmed
- [[tasks/record-shared-instructions-reversal-adr]]
