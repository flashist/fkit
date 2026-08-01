# Implement ADR-032 A2's worklog audit obligation in the sprint-ship-loop

**Source**: `ai-agents/tasks/done/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0147` · owner `fkit-coder`

## Goal

Make [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]]'s **A2** worklog obligation real in the two files that actually drive behaviour.

A2 grants the sprint-loop **Process-review worker** the right to apply verified-`CORRECT`, in-plan fixes without per-fix owner approval — and in the same breath imports [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]'s audit obligation as the *condition* on that grant. **Nothing implemented it.** The amendment said so itself, in a blockquote written deliberately so the gap stayed visible.

⚠️ **Why this was not cosmetic.** ADR-032's **A4 bullet 2** — a do-not-re-raise guard — permits reopening A2's autonomy **only** on evidence that a loop-applied fix was later found wrong or out-of-plan, and names the mechanism: *"A2's worklog record is what makes that checkable"*. Until this landed, that reopening condition was **unsatisfiable in practice**: the guard pointed at evidence nothing required anyone to write. The autonomy was non-reopenable **not because it was proven safe, but because the proof surface did not exist.**

## Key Changes

Two prose edits, canonical sources under `claude/` only:

- **Driver side** — `claude/skills/fkit-sprint-ship-loop/SKILL.md`, the Process-review row of the drive-sequence table: the worker must **record each autonomously-applied fix and each obvious-winner call in the task folder's `worklog.md` decision log**, `none` if none. The Build row already said *"write source + `plan.md`/`worklog.md`"*, so the driver knew how to ask; the Process-review row simply never had been updated to.
- **Worker side** — `claude/agents/fkit-coder.md`, the *"As the Process-review worker"* bullet: the same duty, so a worker spawned by any conforming driver carries it in its own contract and **does not depend on the prompt remembering to ask.**
- **What the record must contain** is stated, not left to "log your fixes": per entry, *which finding it answers, what changed, and why it qualified*. A bare list of touched files does not make a wrong fix findable afterwards, which is the whole point.

**This adds an obligation, not a permission.** A1/A2's write surface, the declared-approval marker and the stop conditions were settled 2026-07-22 and were not reopened.

## Outcome

Done, **agent-closed — not owner-verified**. Landed in one `fkit-coder` session with [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] (`0150`) by owner ruling — both edit `claude/agents/fkit-coder.md` in different clauses, so one session meant one read of the guarantee surface and one review pass.

The task was forbidden from editing the ADR whose gap it closed: correcting ADR-032's *"Stated as a requirement, not yet true of the implementation"* blockquote is an **architect** action, and the vault copy is the **wiki's**. It raised the flag rather than doing it. The vault copy was corrected by [[tasks/wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner]] (`0148`); ⚠️ the **knowledge-base source** still stated the gap as live and was routed to task `0143`'s architect pass — the wiki role never writes `knowledge-base/`.

## Related

- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — A2, and the A4 guard this unblocks
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the source obligation
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the worklog decision log it writes into
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — `0150`, its session partner
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — `0118`, the amendment this implements
- [[tasks/build-fkit-sprint-ship-loop-skill]]
