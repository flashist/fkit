---
name: fkit-stateful-review
description: Run the reviewer side of a stateful, loop-resistant review via the fkit-reviewer agent — findings recorded into the shared ledger at ai-agents/reviews/<task-id>.md, deduped against accepted residuals and ADRs. Two-phase — the reviewer's owner-questions come back through you, and a follow-up invocation records the owner's dispositions. Optional arguments — the task-id, --base <ref>, --scope <auto|working-tree|branch>.
---

# Stateful Review (dispatch to the fkit-reviewer agent)

Run the reviewer side of a review tracked in the shared two-party ledger
`ai-agents/reviews/<task-id>.md`. The review runs in the **fkit-reviewer** agent — a fresh,
coder-untainted context. You (the lead session) are the coder here: you dispatch, then relay. The
reviewer cannot talk to the owner directly, so the flow is **two-phase**, with the ledger as the
shared state between invocations.

**Argument:** `$ARGUMENTS` — optional: the task-id (else the reviewer resolves it by the canonical
rule: task file basename → slugified git branch → asks), plus `--base <ref>`, `--scope
<auto|working-tree|branch>`.

## Phase 1 — the review

1. Invoke the **fkit-reviewer** agent (via the Agent tool) with:
   - mode: **stateful-review**,
   - the task-id (if given) and scope flags from `$ARGUMENTS`.
2. When it returns, **relay its report to the owner verbatim** — the verdict line, findings table,
   suppressed-as-settled list, convergence call, **and its owner-questions block** (proposed
   residual dispositions, act vs closeout). Do not answer those questions yourself and do not
   soften or filter the findings: **you are the coder whose work is under review; the questions
   are the owner's to answer.**
3. If the reviewer stopped because the task-id didn't resolve unambiguously, relay that question,
   get the owner's answer, and re-invoke with the explicit task-id.

## Phase 2 — recording the owner's decisions

When the owner has answered the dispositions:

4. Re-invoke the **fkit-reviewer** agent with the task-id and the owner's decisions, stated as
   *"record these dispositions"* (phase 2). It re-reads the ledger, updates *Accepted residuals*,
   and sets `Status: closed-out` when warranted. Relay its confirmation.

## What comes after (separate steps, not this skill)

- The coder side — verifying findings, applying approved fixes, writing the *Coder response*
  section — is `/fkit-process-stateful-review`, run in this session under its own approval gate.
- Never apply a fix as a consequence of this skill.

## Rules

- Never edit code in this skill. Never write the ledger yourself — the reviewer owns its sections;
  your coder-side writes happen only through `/fkit-process-stateful-review`.
- Keep a partial-coverage flag (Codex unavailable) loud in what you relay.
- Do not commit anything.
