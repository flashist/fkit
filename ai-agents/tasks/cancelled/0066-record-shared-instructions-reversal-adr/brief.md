# Record a tombstone ADR for the shared-instructions-layer reversal

## ID
0066

## Sprint
Sprint 2

## Priority
37

## Status
⛔ Cancelled (2026-07-19) — superseded by ADR-016

## Context

**The shared-instructions investigation (task 29) reversed its own rev-1 recommendation, and the
reversal rejects two obvious mechanisms by name.** Findings:
[`reports/2026-07-14-shared-instructions-layer.md`](../../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
(rev 2). The headline is that the shared layer **already exists and already ships** — the *"Universal
hard rules"* block in `claude/scaffold/CLAUDE.md`, proven to reach both a session and a spawned consult
— so nothing new gets built; what was broken was delivery on two paths, fixed by tasks 30–32.

**Two mechanisms were rejected, and both are the *first* thing a competent person reaches for:**
- **`ai-agents/AGENTS-COMMON.md` + agent-file splice** (rev 1's own recommendation) — **structurally
  cannot reach Codex**, which builds its own prompt and never reads `.claude/agents/`. A "shared layer
  for all agents" that excludes the required second model is misnamed. It also silently depended on the
  parked task 28.
- **`claude --append-system-prompt`** — **session-only.** Two independent experiment designs, **0/3
  then 0/2** into a spawned consult, on **Claude Code 2.1.208**, with a within-subject control that
  stayed live.

**Rev 1 of the report reached for one of these and it cost an adversarial Codex pass to undo.** A dated
report is easy to miss; an ADR is where someone looks *before* proposing a mechanism. Without a
tombstone, this gets re-argued — and re-attempted — the next time someone wants a standing instruction
for every agent.

**Owner decision (2026-07-15):** record the ADR — resolving Sprint 2 open question 6.

## What to build

Record an ADR (via the architect's `/fkit-record-decision` procedure) that:

- **States the decision:** fkit's universal instructions are delivered through the *"Universal hard
  rules"* block shipped in the root context files (`CLAUDE.md` / `AGENTS.md`), which reaches both a
  Claude session and a spawned consult, **and** — via tasks 30/31 — Codex and brownfield projects. There
  is no separate shared-instructions layer and none is needed.
- **Records the two rejections by name, with their disqualifying reason:** `AGENTS-COMMON.md`/splice
  (cannot reach Codex; depended on parked task 28); `--append-system-prompt` (session-only).
- **Pins the negative result to its harness version** — **Claude Code 2.1.208**, with the experiment
  counts (`0/3`, `0/2`) — so the prohibition is legible as version-scoped, not eternal.
- **Carries a re-raise trigger:** if a future Claude Code release makes `--append-system-prompt`
  inheritable into a spawned consult, this ADR is re-opened rather than silently obeyed.

## Verification steps

- **An ADR file exists** in `ai-agents/knowledge-base/decisions/` with the next sequential number,
  following the existing ADR template/format used by its siblings.
- **Both rejected mechanisms are named** in it, each with its disqualifying reason.
- **The Claude Code version (2.1.208) and the experiment counts are recorded in the ADR body** — not
  left implicit — so the negative result reads as version-scoped.
- **The re-raise trigger is stated.**
- **It links to the rev-2 report** as its evidence base.

## Notes

- **Owner: fkit-architect** — ADRs are the architect's to record, via `/fkit-record-decision`. The
  producer scopes the task; the architect writes the decision.
- **Depends on: nothing.** Tasks 30–32 (the delivery fixes) are already done; this documents the
  decision behind them. Can be recorded any time.
- **The tradeoff, stated:** the ADR pins a negative result against one harness version. If Claude Code
  later makes `--append-system-prompt` inheritable, the ADR risks reading as a stale prohibition —
  mitigated by recording the version in the ADR itself (above) and the re-raise trigger.
- **Not a code change.** Documentation/decision only; no launcher or skill edit.
