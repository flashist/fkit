---
name: adr
description: Record an architecture decision as an ADR (Architecture Decision Record) — context, the decision, the options weighed and why the others were rejected, and the consequences. Saved to ai-agents/knowledge-base/decisions/ — never the wiki (fkit-wiki ingests it later). Makes no commits.
---

# ADR — Architecture Decision Record

Capture a settled architecture decision durably, so the *why* survives and future reviewers (and
reviewers' reviewers) start from the decision instead of re-litigating it.

**Argument:** `$ARGUMENTS` — the decision to record (and any context/options you already have).

> **Boundaries.** ADRs are written to **`ai-agents/knowledge-base/decisions/`** — the architect's
> source-of-record location. This is **not** the wiki's `decisions/` pages: writing/synthesizing into
> `ai-agents/wiki-vault/` is the **fkit-wiki** agent's job. When an ADR should appear in the wiki,
> recommend the owner run fkit-wiki's `ingest` on it. Never write the wiki yourself.

## Step 1 — Establish the decision and its grounding

- Confirm what decision is being recorded and that it is actually **settled** (an ADR records a
  decision, not an open debate — if it's still open, use `evaluate-approach` first).
- Ground the context in the codebase and any prior docs (`ai-agents/knowledge-base/`, including a prior
  `eval-*.md` if this decision came from one). Cite `path:line` where relevant.
- Ask the owner for anything missing: the real driver, constraints, and which alternatives were
  genuinely considered. Do not invent rationale.

## Step 2 — Assign the ADR number and file

- Look in `ai-agents/knowledge-base/decisions/` (create it if it doesn't exist) and use the next
  sequential number. Filename: `adr-<NNN>-<short-slug>.md` (e.g. `adr-007-event-sourcing-for-audit.md`).

## Step 3 — Write the ADR

Use this structure:

```
# ADR-<NNN>: <title>

- **Status:** proposed | accepted | superseded by ADR-<NNN> | deprecated
- **Date:** <YYYY-MM-DD>   (use today's date from the session context)
- **Deciders:** <who>

## Context
The forces at play: the problem, the constraints, and what makes this a real decision. Cite
`path:line` and any `eval-*.md` this came from.

## Decision
The choice made, stated plainly and unambiguously.

## Options considered
- **<Option A (chosen)>** — why it wins.
- **<Option B>** — why it was rejected.
- **<Option C>** — why it was rejected.

## Consequences
- **Positive:** what this buys us.
- **Negative / costs:** what we accept by choosing it.
- **Residual risks / "re-raise only if":** the condition under which this should be reopened — so a
  future review treats a matching finding as closeout, not a new defect.

## Related
Links to relevant `path:line`, design specs (`design-*.md`), evaluations (`eval-*.md`), or superseded
ADRs.
```

Keep it tight and honest — the value is the *why* and the rejected alternatives, not length.

## Step 4 — Report

State the ADR written (path + number + status) and its one-line decision. **Make no commits.** Note
that **fkit-wiki** should ingest this into the wiki's decisions pages if it belongs there — you do not
write the wiki.
