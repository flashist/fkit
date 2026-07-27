# Fix the `fkit-sprint-ship-loop` SKILL.md owner-banner format

**Source**: `ai-agents/tasks/done/0120-fix-sprint-ship-loop-skill-owner-banner-format/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0120` · priority 102 · owner `fkit-coder`

## Goal

`claude/skills/fkit-sprint-ship-loop/SKILL.md` (built by task 0111) opened with a bare `# ⛔ Owner: the lead` heading **before** the standard `> ## ⛔ Owner: the **lead**` blockquote — duplicating the owner banner as its H1. Every other skill uses a descriptive title then the blockquote (the sibling `fkit-task-ship-loop/SKILL.md` reads `# Task Ship-Loop (coder side)`). Bring it into line.

## Key Changes

Replace the bare owner-banner H1 with a descriptive title in the sibling style; **keep the blockquote banner unchanged** — that form is the house standard. Mirror refreshed via the normal init path (the `.claude/` copy is gitignored; only the canonical `claude/` source is edited).

**Purely cosmetic, and the brief said so up front.** It does **not** affect the ADR-018 skill-ownership hook, which keys off `skills_for_role()` in `claude/skills-for-role.sh`, never banner text. No behavior change; the skill still resolves to the lead only.

## Outcome

Done, agent-closed. The change is one heading in one file.

**Its interesting output is what it refused to absorb.** The plan step surfaced two follow-ups, both filed separately and both owner-approved, neither gating this task's close:

- **`0152`** (priority 129) — a guard test so the H1 drift cannot recur. **The decision not to fold it in here was correct**, and was independently endorsed: a new enforcement surface does not belong bolted onto a one-file cosmetic fix. It also exposed a real hole — **no test in the repo reads any `SKILL.md`'s content**, so skill-file content is an entirely untested surface. The guard is green on day one with **nothing grandfathered**: 25 files, 24 already descriptive plus this **sole outlier**, 25/25 after this fix. ⚠️ It must **reuse** task 0136's `SKILL.md` walk, never add a second.
- **`0151`** (priority 121) — `CLAUDE.md:43` names the wrong file for `skills_for_role()`, spotted while reading the skill tree. Unrelated to the banner. **`CLAUDE.md` is injected into every fkit session**, so every role in every session is currently told the wrong file — though it is a **one-hop misdirection, not a wrong edit** (the launcher documents the move right above the `source` line). Pointered into the fact-inventory investigation `0142` as a plausible live specimen.

## Related
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task 0111, which built the file carrying the drift
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the ADR the skill implements
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook this fix does **not** touch: ownership keys off `skills_for_role()`, not banner text
- [[systems/role-locked-sessions]] — the ownership banners' role in the advisory half of the lock
- [[systems/testing-and-verification]] — the untested `SKILL.md`-content surface this fix's follow-up would close
- [[tasks/sprint-2-remove-omnigent]] — the sprint carrying this task
