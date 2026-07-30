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

- **`0152`** — a guard test so the H1 drift cannot recur. **The decision not to fold it in here was correct**, and was independently endorsed: a new enforcement surface does not belong bolted onto a one-file cosmetic fix. It also exposed a real hole — **no test in the repo reads any `SKILL.md`'s content**, so skill-file content is an entirely untested surface. The guard is green on day one with **nothing grandfathered**: 25 files, 24 already descriptive plus this **sole outlier**, 25/25 after this fix. ⚠️ It must **reuse** task 0136's `SKILL.md` walk, never add a second.
- **`0151`** — `CLAUDE.md:43` names the wrong file for `skills_for_role()`, spotted while reading the skill tree. Unrelated to the banner. **`CLAUDE.md` is injected into every fkit session**, so every role in every session is currently told the wrong file — though it is a **one-hop misdirection, not a wrong edit** (the launcher documents the move right above the `source` line). Pointered into the fact-inventory investigation `0142` as a plausible live specimen.
  > ✅ **Dated correction 2026-07-30 — "every role in every session is currently told the wrong file" is FALSIFIED, and was true only as of this page's 2026-07-26 ship date.** `0151` has shipped *(✅ Done — agent-closed, not owner-verified)*; its `CLAUDE.md` fix landed in commit `7616585`, 2026-07-30. **Measured against the live files this run, not inherited from the routing that raised it:** `CLAUDE.md` now reads *"`skills_for_role()` in `claude/skills-for-role.sh`, sourced by both `claude/fkit-claude.sh` and the `PreToolUse` skill-ownership hook"*, and `skills_for_role()` is in fact declared at `claude/skills-for-role.sh:48` — `claude/fkit-claude.sh` only `source`s it. **The sentence above is left byte-identical** per the `wiki/tasks/*` rule: it records what 0120's plan step found on its own date, and the one-hop-misdirection judgement it carries is still a correct description of the defect that existed then. ⚠️ **The `CLAUDE.md:43` line number is a mutable coordinate and was NOT re-verified as still pointing at that sentence** — the fix rewrote one line into three, so it has almost certainly moved; identify the claim by its text, not by `:43`. That citation class is open task `0160`'s subject.

> ⚠️ **Board-rank citations dropped from both bullets above, 2026-07-30.** They read **`0152`** *(priority 129)* and **`0151`** *(priority 121)* — the ranks those tasks held on this page's ship date. **Both have since moved**, which is precisely why `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` (owner-approved 2026-07-27) rules a stale **prose** rank citation is repaired by **naming the folder ID and dropping the rank**: refreshing it to today's number *"only reproduces the defect with a fresher date."* The folder IDs `0152` and `0151` were already present and are the permanent carrier, so **nothing identifying was lost**. **Both bullets were treated identically inside one diff, deliberately** — the routing that raised this named only `0151`, and repairing one of two byte-identical shapes is a defect this vault has already had to correct twice. *(Scope note: the convention's frozen-history carve-out covers the **board-cell** form `124 (0150)` only, not this prose form — owner ruling 2026-07-27.)*

## Related
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task 0111, which built the file carrying the drift
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the ADR the skill implements
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook this fix does **not** touch: ownership keys off `skills_for_role()`, not banner text
- [[systems/role-locked-sessions]] — the ownership banners' role in the advisory half of the lock
- [[systems/testing-and-verification]] — the untested `SKILL.md`-content surface this fix's follow-up would close
- [[tasks/sprint-2-remove-omnigent]] — the sprint carrying this task
