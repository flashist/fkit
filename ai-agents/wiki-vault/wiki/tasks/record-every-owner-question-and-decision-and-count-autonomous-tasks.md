# Record every owner question and decision, and count the tasks done autonomously after plan approval

**Source**: `ai-agents/tasks/done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`; ⛔ **closed as a gated umbrella after Phase A — nothing was built**
**Sprint/Tag**: Sprint 10 `P3` · task `0482` · owner `fkit-coder`

## Goal
The owner, 2026-10-02: *"we don't have approved records about how many tasks fkit is able to do end to end
without me being involved. I think it happens because we don't record all the questions that were asked to
me."* He wants a real number for a conference talk. **The metric, in his definition:** a task is
**"autonomous after plan approval"** when, after he approved its plan, the agents finished it with no further
owner involvement. The plan approval does not disqualify a task; ⛔ **nothing is "fully automatic"** — that
phrase is banned from the metric.

**Gated harder than usual:** *"⛔⛔ DO NOT IMPLEMENT until the owner gives a direct, explicit 'APPROVE' for
implementation."* Being on a board is not approval; a relayed or inferred "go ahead" is not approval. Two
rulings bound it: **Ruling 1** — rulings quoted verbatim, everything else only as counts or short paraphrase,
raw messages local; **Ruling 2** — *"We're not implementing the switch, if the feature is dangerous, we're not
going to implement it at all."* Safe by construction, or dropped.

## Key Changes
- **Phase A only (owner ruling R2 on the sprint, 2026-10-04):** verify hook mechanics (docs + a throwaway local
  experiment), give an explicit **safety verdict**, write `plan.md` only if "safe", draft the ADR as
  **Proposed**, then stop. Nothing outside the task folder and the ADR draft changed.
- **Output:** [[decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log]] (`proposed`) —
  closed-format, launcher-only capture; **no owner text stored, even locally**; a deterministic per-task worklog
  line; 30-day retention; a conservative classification where every doubt resolves away from "autonomous".
  Hook facts measured on Claude Code 2.1.289 (terminal UI not tested live).

## Outcome
- **2026-10-05 — the APPROVE branch ran.** The owner approved **Phase B items 1–5** directly
  (`AskUserQuestion`, `fkit-lead` session). ⛔ **Item 6** (an approximate historical count from local
  transcripts) **not approved** — no brief filed. The producer filed the Phase-B split, **on the Backlog board,
  not Sprint 10** (the owner named no sprint):
  `0485` (B0 — **the owner reads and accepts ADR-053; blocks all the rest**), `0486` (B1 capture hooks), `0487`
  (B2 `task: <id>` spawn line + `[task NNNN]` relay tag), `0488` (B3 summarizer), `0489` (B3b run it in
  `/fkit-task-done`), `0490` (B4 the count), `0491` (B5 docs: coverage gap, privacy, 30-day limit). All open.
- `0482` was closed **once those briefs existed** — the sprint's rule was never to close it on Phase A alone,
  which would silently drop Phase B.
- ⚠️ **ADR-053 is still `proposed`.** The APPROVE of items 1–5 is **not** acceptance; B0 is. Its review rounds
  also corrected its own record: four fixes once listed as owner rulings were the driver's defaults.
- ⛔ **Do not conflate with ADR-049:** capture records involvement; it never verifies a human principal and
  never upgrades the agent-closed marker.

## Related
- [[decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log]] — the design this produced
- [[tasks/sprint-10-the-0472-0482-batch]] — `P3`, and the board's `0482` section
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — what capture is not
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why only the lead's session can ask, so relayed questions need a task tag
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — where `0485`–`0491` were filed
