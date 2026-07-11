# Amend the subagent-disconnect incident doc with technical corrections

## Sprint
Sprint 1

## Priority
10

## Status
⛔ Cancelled (2026-07-11) — Omnigent removed: an Omnigent subagent-runner incident; the doc is archived to `history/` by Sprint 2 task 10 (ADR-009).

## Context

fkit-architect reviewed [`ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md`](../../knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md)
during the 2026-07-10 producer consult that generated this task's sibling brief
(`build-fkit-reconnect-tooling.md`).

**Status: the first three corrections below (auth caveat, undocumented-endpoint risk note, and
splitting the self-healing/reconnect-tool asks) have already been applied directly to the incident
doc during a follow-up architect consult** (same session, after the owner supplied a further
correction about the panel UI). What's left for this task is the **new** correction that consult
surfaced, plus a final pass to confirm consistency:

1. ~~Recovery recipe auth caveat~~ — done.
2. ~~Undocumented-endpoint dependency flagged as its own risk~~ — done.
3. ~~Split self-healing (#2) vs. reconnect-tool (#4)~~ — done; #4 was also reframed (see next point).
4. **New: the reconnect command is first-party, not reverse-engineered.** The owner clarified the
   panel UI already shows a per-session "Agent disconnected — click to reconnect" notification
   that opens a dialog with the exact ready-to-copy `omnigent run --resume` command used in
   recovery. This has already been folded into the doc's Summary and into ask #3/#4's wording
   (ask #4 reframed from "build a reconnect tool" to "expose the existing capability to the
   agent/tool surface + add a bulk view"; ask #3 sharpened to note the UI proves per-session
   status data already exists server-side, so it's specifically an MCP-tool gap, not a
   data-availability one).
5. **New, not yet folded in: `/v1/sessions/{id}/child_sessions` is confirmed source-side (not
   inferred) to be the same "canonical historical truth" mechanism the Web UI panel itself uses**
   (`ChildSessionSummary`'s docstring in the installed Omnigent package names it explicitly),
   discovered during the `build-fkit-reconnect-tooling.md` design pass. The doc currently still
   calls this endpoint "undocumented" / "private" in a way that could read as "fragile
   reverse-engineered hack." Soften that: it has no *published external* API contract and is not on
   the agent-facing MCP tool surface (both still true and still worth flagging as a risk for ask
   #4), but it is source-confirmed as the real mechanism backing the product's own UI, not
   something guessed at from `/openapi.json` alone. Also note the `child_sessions` payload does
   **not** carry the authoritative `runner_online` liveness bit (only `GET /v1/sessions/{id}`
   does) — worth a line in "Confirmed facts" since it wasn't spelled out before.

This is a documentation-only task — no new investigation needed (item 5's source citation already
exists in the architect's consult reply; this task only needs to fold it into the doc's wording).

## What to build

- Re-read the current incident doc end to end and confirm the edits described above read cleanly
  and consistently (no leftover phrasing that still implies the reconnect command was
  reverse-engineered, or that the UI is silent about individual disconnects).
- If anything reads awkwardly or is missing given the above, fix it directly — keep edits minimal,
  don't restructure sections that weren't flagged.

## Verification steps

- The doc's Summary, "Ask for the tech team" (items 3 and 4), "Confirmed facts," and "Recovery
  recipe" sections all consistently reflect: the reconnect command is first-party/UI-surfaced; the
  friction is bulk-enumeration + in-app execution, not the command's existence; the
  undocumented-endpoint and auth caveats are present; self-healing and reconnect-tool are distinct
  asks.
- Nothing else in the doc's timeline or session-id table changes.

## Notes

- Natural owner: **fkit-architect** — same precedent as the earlier CLAUDE.md/AGENTS.md placeholder
  fix (non-code, architect already holds the technical content this needs to mirror, having
  produced the analysis directly).
- Small task — should not need its own sprint slot beyond this one.
