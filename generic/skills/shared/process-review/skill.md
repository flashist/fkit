---
name: process-review
description: Critically evaluate external reviewer feedback before acting — verifies every claim against the codebase, classifies findings, gates code changes on explicit user approval, and tracks decisions in a per-task review ledger to prevent review loops. Use when processing Codex reviews, GitHub review comments, or any external feedback before deciding what to act on.
---

# Process Review

Review text to evaluate:

> $ARGUMENTS

## Your job

You are a critical filter between an external reviewer and the codebase. Reviewers can be wrong. They may lack project context, misread the diff, reason from outdated assumptions, or propose a fix that addresses symptoms rather than the root cause. Your job is to evaluate each finding independently and present a verdict backed by evidence — not by deference.

**Never apply a fix just because a reviewer suggested it. Verify first, then ask.**

---

## Step 0 — Load the review ledger (prevents loops)

Identify the task under review (from the branch, the diff, or the conversation) and read its ledger at `ai-agents/reviews/<task-id>.md` if it exists (see `ai-agents/reviews/README.md` for the schema). External reviewers are **stateless** — they re-discover the downside of whatever choice is currently in the code, with no memory of tradeoffs already accepted. The ledger carries that decision state forward.

If no ledger exists for a task that's clearly in a multi-round review, create one as you go (Step 5).

---

## Step 1 — Parse the review

Break `$ARGUMENTS` into individual findings. Number them. For each, note:
- What the reviewer claims is wrong or missing
- What change they are recommending (explicitly or implicitly)

If the review is a single block of prose with no clear numbered items, infer the logical findings yourself.

---

## Step 2 — Verify each finding against the codebase

For each finding, **read the actual code** at the referenced location. Read enough surrounding context to understand the full flow — not just the line the reviewer cited.

Before forming a verdict, ask:
- Is the claim factually accurate given the current code?
- Does the reviewer understand how this code path is actually reached?
- Are they missing project-specific context (architecture, deployment model, config, test coverage)?
- Are they reasoning from an incorrect assumption about control flow, data shape, or ownership?
- Is their recommended fix solving the right problem, or just masking a symptom?
- **Is the stated severity actually justified?** Trace the *full flow*, not the cited line — a mechanism flagged in isolation may already be neutralized downstream, so the real blast radius can be far smaller than the label.

Do not rely on the reviewer's description of what the code does. Read it yourself.

**Severity is yours to assign, not the reviewer's.** Do not inherit a "no-ship / [high] / [medium]" label — derive it from the blast radius you traced. Classic example: a "concurrent push could publish the wrong image" finding *sounds* like no-ship, but if the deploy digest is **content-addressed**, a diverted push fails closed (worst case: a failed build) and can never deploy wrong content — the [high] collapses to a low-severity robustness note. In one past task, three rounds of alarm rested on a single full-flow fact the reviewer reasoned past. Trace it before you agree it's serious.

---

## Step 2.5 — Classify: defect vs frontier-move (do this before any verdict)

For each finding, decide which kind it is — this is the core discipline that stops review loops:

- **Defect** — the code does the wrong thing, or a fix would remove a real regression. Act on it, in **any** round.
- **Frontier-move** — the code sits at a deliberate point on an **unavoidable tradeoff** (a Pareto frontier where every option has a real cost), and the finding just names the cost of the current choice. This is a *decision*, made once — not something to re-fix every round.

Then run two loud checks:

1. **Accepted-residual check.** Does the finding match an entry in the ledger's *Accepted residuals*? If so, and its "Re-raise only if" condition is **not** met, say so **clearly and loudly**: this is closeout, not a new defect. Do not re-fix it.
2. **Regression / oscillation check.** Would the *recommended fix* cause a regression, or recreate a condition a **prior** finding already flagged (per the ledger)? If yes, **point to it clearly and loudly BEFORE applying anything.** Trading reviewer A's objection for reviewer B's is oscillation, not progress — name the tradeoff and let the user decide; do not silently apply.

A round budget (e.g. a task's "max N rounds") is a proxy, not the rule. A genuine **new defect** in round 3+ MUST still be acted on; the budget exists to stop churn, not to suppress correctness. Stop on the *nature* of the finding, not the count.

---

## Step 3 — Assign a verdict and respond

**CORRECT** — The claim is accurate and the fix addresses a real problem.
→ Describe precisely what needs to change and why, citing `src/...` locations.
→ Do not touch any code yet. Present the proposed change and ask the user for explicit approval.

**PARTIALLY CORRECT** — The finding identifies a real issue, but the diagnosis or fix is wrong, too narrow, or creates a new problem.
→ Explain which part holds up and which part does not, with evidence from the code.
→ Propose what the correct fix looks like.
→ Ask the user for explicit approval before touching any code.

**INCORRECT** — The claim does not hold up.
→ Explain why, citing the specific file paths, line numbers, control flow, or config facts that disprove it.
→ Do not implement anything. Do not offer a "just in case" change.
→ If the reviewer's concern reveals a gap in their understanding worth noting, say so briefly.

**INCOMPLETE** — The finding is correct but misses something important: a related bug, an uncovered edge, a missing test, a broader pattern.
→ Confirm what the reviewer got right.
→ Describe what they missed and why it matters.
→ Propose a full fix covering both the reviewer's finding and the gap.
→ Ask the user for explicit approval before touching any code.

---

## Step 4 — Summary table + convergence call

Output:

| # | Verdict | Defect / Frontier-move | One-line description |
|---|---------|------------------------|----------------------|
| 1 | CORRECT / PARTIALLY CORRECT / INCORRECT / INCOMPLETE | … | … |

Then state clearly: **what, if anything, requires a code change**, and wait for explicit user approval before proceeding.

**Call convergence proactively.** If the findings are re-litigating accepted residuals or relocating frontier costs rather than fixing new defects, say so plainly and **recommend closeout, with the reason** — don't wait for the user to notice the loop. Telling the user *when to stop and why* is your responsibility, not theirs.

---

## Step 5 — Record the outcome in the ledger

After the user decides, update `ai-agents/reviews/<task-id>.md`:
- Append a **Decision log** row per finding (round, finding, verdict, action — including any reversal and why).
- Add any newly-accepted tradeoff to **Accepted residuals** with its structural *Why* and a *Re-raise only if* condition.
- Move resolved items out of **Open / actionable**; leave only genuine open defects.

This is what makes the next round (and the next reviewer) start from the decision state instead of re-deriving it blind.

---

## Hard rules

- Read the code. Do not speculate about what it probably does.
- Cite `src/...` with line numbers when making claims about behavior.
- Never change code without explicit approval in this conversation turn.
- Classify defect vs frontier-move before acting; flag any regression or re-litigation **loudly, up front**, never silently.
- Severity is yours to assign — trace the full-flow blast radius before agreeing a finding is high/no-ship; never inherit the reviewer's label.
- Proactively call the stop when the loop starts — with the reason.
- All four verdict outcomes are equally valid. Do not bias toward confirming the reviewer.
- A review being from an automated tool (Codex, CI, linter) does not make it more authoritative — evaluate it the same way.
