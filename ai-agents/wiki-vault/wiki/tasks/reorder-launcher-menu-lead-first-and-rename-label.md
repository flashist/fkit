# Reorder the `fkit` launcher menu so lead is option 1, and rename its label to "lead"

**Source**: `ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID 0139 · priority 115 · owner `fkit-coder`

## Goal

Put the lead **first** in the `fkit` menu and call it by its real name. Owner ruling, 2026-07-25, from seeing the menu on screen.

## Key Changes

Two problems the owner raised:

1. **Lead was buried at option 7.** Since [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] it is the *orchestrating front door* — the natural first stop for someone who does not yet know which role they need — and it was listed last.
2. **"team room" is not the role's name.** `lead` is canonical everywhere that matters: `--help`, the case arms, `skills_for_role()`, the agent file, and the test suite (which asserts roles **by name, never by menu number**). "team room" appeared only in prose.

The owner ruled **"team room" retired project-wide**, not just in the menu. This brief is the launcher half; the prose sweep is [[tasks/retire-team-room-in-docs-and-agent-definitions]] and the vault half is separate, wiki-only work.

**Checked at scoping time:** neither launcher script is a dual-home parity pair, so [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] does not apply here.

### The word aliases: the brief said keep them, and it was overruled

As written, the brief required the `team` / `"team room"` word aliases be **kept** so anyone who learned the old word still landed correctly. **Review finding R1 showed that keeping them on the CLI path was a regression:** the menu reads a whole line, so `"team room"` matches there — but the **CLI reads argv already split on whitespace**, so `fkit team room` launched a lead session and passed the stray word `room` through to `claude`, where at HEAD it had been a loud `exit 2`.

**The owner ruled 2026-07-25: revert the alias entirely.** The words are accepted on **neither** path; `fkit team` now exits 2.

> **How the deviation was handled is itself the record.** The reviewer deliberately left the brief's acceptance steps asserting the *old* requirement, on the principle that **a brief's acceptance criteria belong to the producer and the owner, and the author of the change that failed a criterion must not quietly rewrite that criterion.** Leaving it visibly unmet is what let the owner rule with full information. The owner so ruled on 2026-07-26 — ship with the deviation, and amend the brief — and the **producer**, who owns the brief, made the amendment, quoting the original wording so the history is not lost.

## Outcome

**Done**, owner-verified (no agent-closed marker). Verified this sync (2026-07-26): the menu reads `1) lead` … `7) wiki`, and the only surviving occurrences of "team room" in `claude/` are **comments explaining why the aliases are rejected**.

⚠️ **Accepted cost, stated plainly at ruling time:** renumbering moves every other role down one, and **the mis-pick is silent** — you land in a working session of the wrong role rather than getting an error. The word-alias path (`fkit coder`) is unaffected and is the mitigation.

⚠️ **A residual of this task later proved false.** Its accepted-residual text claims `team`/`team room` still work as menu picks *"exactly as before this task"* — but the menu arm is `1|lead)`, and the launcher's own comment agrees with the code. The owner ruled 2026-07-26: **the text is wrong, the code is right — no launcher change**; the correction is docs-only, still-open work.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — why lead belongs first
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] — the prose half, shipped alongside
- [[tasks/update-launcher-menu-help-for-conductor]] — the earlier description-only pass
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — its "menu option 7" / "team room" text is now stale; an owner-ruled **dated correction note**, not a rewrite, is the sanctioned fix
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — checked, not applicable
- [[tasks/remove-fkit-resume-passthrough]] · [[tasks/fix-headless-menu-guard-crash]] — prior launcher argv/menu work
- [[systems/install-and-self-update]] · [[systems/fkit]] · [[systems/testing-and-verification]]
