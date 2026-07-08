---
name: evaluate-approach
description: Compare 2–3 candidate technical approaches for a problem with explicit trade-offs and a clear recommendation, grounded in the existing codebase and the owner's priorities. A decision aid that often feeds an adr. Saved to ai-agents/knowledge-base/ — never the wiki. Makes no commits and writes no implementation.
---

# Evaluate Approach

Given a problem with more than one reasonable solution, lay out the candidate approaches, weigh them on
explicit dimensions, and make a **recommendation** — so the owner can decide from evidence, not vibes.

**Argument:** `$ARGUMENTS` — the problem/decision to evaluate (and, if you already have them, the
candidate approaches).

> **Boundaries.** Output goes to `ai-agents/knowledge-base/` — **never the wiki**. This is analysis, not
> implementation: you write no code and change nothing under review. A settled decision should then be
> recorded via the `adr` skill.

## Step 1 — Frame the problem and gather constraints

- Restate the problem and the decision to be made in one or two sentences.
- Read the relevant code and architecture material (`ai-agents/knowledge-base/`) so the evaluation is
  grounded in how the system actually works; cite `path:line`.
- **Ask the owner about priorities** — what matters most here: performance, simplicity, delivery speed,
  operational cost, risk, reversibility, team familiarity? The weighting changes the recommendation, so
  don't assume it.

## Step 2 — Identify the candidate approaches

Settle on **2–3** genuinely distinct approaches (if the owner named some, use those; otherwise propose
them and confirm). Avoid strawmen — each candidate should be one a competent engineer might actually
choose.

## Step 3 — Analyze each approach

For each candidate, cover:
- **How it works** — the mechanism, concretely, and how it fits (or fights) the existing architecture.
- **Pros** — what it does well against the priorities from Step 1.
- **Cons / costs** — complexity, performance, operational burden, coupling, risk.
- **Effort & reversibility** — rough implementation cost, and how hard it is to undo later.
- **Risks & unknowns** — what could go wrong; what would need a spike to de-risk.

## Step 4 — Compare and recommend

- Produce a **comparison table**: approaches as rows (or columns), the priority dimensions as the other
  axis, with a concise cell per pairing.
- Give **one clear recommendation** with its rationale and its **main tradeoff** (the cost you're
  accepting by choosing it). If the honest answer is "it depends on X", say so and state what X must be.
- Note anything that should be de-risked with a spike before committing.

## Step 5 — Save and report

Write the evaluation to `ai-agents/knowledge-base/eval-<topic-slug>.md` (for a quick, throwaway
comparison you may present it inline and skip the file — ask if unsure). Summarize the recommendation
and the main tradeoff. **Make no commits.** If the decision is now settled, recommend recording it with
the **adr** skill; if it belongs in the wiki, note that **fkit-wiki** should ingest it — you do not
write the wiki.
