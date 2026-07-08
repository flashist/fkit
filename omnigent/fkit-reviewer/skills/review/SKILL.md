---
name: review
description: A one-shot, loop-agnostic code review. Runs two independent reviewers on the diff (a native Claude-side pass plus a Codex second opinion from the adversarial-reviewer sidekick), dedupes their findings, verifies each against the actual code, classifies defect vs frontier-move, and produces a report that leads with a one-line decision verdict. Ephemeral and REVIEW-ONLY — writes no persistent file and never edits code. Use for a quick second opinion on a diff.
---

# Review (ephemeral)

A thorough one-shot review of the current diff. **Ephemeral**: it produces a report and **no
persistent artifact** — no ledger, no shared review file. For a review that round-trips through the
shared reviewer↔coder document, use **stateful-review** instead.

> **⛔ REVIEW ONLY — this skill never edits source code, not even with approval.** Its only deliverable
> is the report. Findings are *inputs to evaluate*, not a to-do list to apply. Applying a fix is a
> separate, coder-initiated step (e.g. the fkit-coder agent) — never a consequence of running this
> skill. Do not tee up "apply this fix?" as the next action.

**Argument:** `$ARGUMENTS` — optional scope flags: `--base <ref>`, `--scope <auto|working-tree|branch>`.
Default: working tree / `auto`.

---

## Step 1 — Run two independent reviewers (degrade gracefully)

Get two perspectives on the **same** scope:

**A) Claude-side review (native).** Do your own thorough review pass over the diff/scope: read the
changed code *and enough surrounding context to understand the full flow*. Produce a findings list —
each with a location (`file:line`), a claim, a recommended change, and your severity. This is the
default, always-available reviewer.

**B) Adversarial second opinion (delegate to your sidekick, best-effort).** Call your
**adversarial-reviewer** tool — the fkit-adversarial-reviewer sub-agent, an independent Codex-based
reviewer — on the same scope. Pass it the diff/scope (and any focus area). It returns findings only
(`file:line`, the problem, and severity) and never edits anything. Expect it to take **several
minutes** on a non-trivial diff. Capture its findings.

**Graceful degradation (mandatory):** if the adversarial-reviewer sidekick is unavailable,
unauthenticated, or errors, do **not** fail the review. Record "Codex reviewer unavailable:
`<reason>`" and continue Claude-only — but
flag the partial coverage **loudly**, and let it drive the verdict line (Step 4). Never present a
one-reviewer run as a full review.

---

## Step 2 — Merge + dedupe between the reviewers

Collapse findings from the Claude-side and Codex-side passes that describe the same issue (same
file/line/claim). Keep the stronger articulation; mark a finding **"raised by both"** — that's higher
signal. Assign each surviving finding a stable short id (`R1`, `R2`, …).

---

## Step 3 — Verify each finding against the code

For each deduped finding, **read the actual code** and confirm or refute it. Ask:
- Is the claim factually accurate given the current code?
- Is the code path actually reached the way the reviewer assumes?
- Are they missing project context (architecture, deployment, config, test coverage)?
- Is the recommended fix solving the right problem, or masking a symptom?
- **Is the stated severity justified?** Trace the *full flow* — the real blast radius may be far
  smaller than the label.

Assign each a **verified verdict**: `CORRECT`, `PARTIALLY CORRECT`, `INCORRECT (disproven)`, or
`INCOMPLETE`. **Severity is yours** — derive it from the blast radius you traced; never inherit the
reviewer's label. Classify each as a **Defect** (wrong behavior / real regression) or a
**Frontier-move** (a deliberate point on an unavoidable tradeoff — a decision, not a defect). If a
recommended fix would cause a regression or just relocate a settled cost, **say so loudly.**

---

## Step 4 — Consolidated report

**Lead with a one-line decision verdict** on the 2nd–3rd line, directly under the title:

```
# Review — <scope>

**Decision: 🛑 Blocked — 2 confirmed defects (1 high)**
```

Pick **exactly one**, derived from Step 3:
- **✅ Ready to merge** — no open confirmed defects. Append **"(validation-gated)"** if an on-box/manual
  test is the only remaining gate.
- **⚠️ Changes requested — N defects (none blocking)** — confirmed medium/low defects; fixing
  recommended, not merge-blocking.
- **🛑 Blocked — N confirmed defects (M high/critical)** — at least one confirmed high/critical defect
  is open; must fix before merge.
- **🟡 Partial review — `<reviewer>` unavailable** — a reviewer failed/was skipped. This caveat **takes
  precedence**: never pair a clean "Ready to merge" with a missing reviewer.

The verdict is a **recommendation, not an authorization** — this skill changes no code and does not
merge.

Then present:
- **Reviewers run** — and any unavailable/skipped (loudly).
- **Findings table**, columns in this order: **#** (id) · **Reviewer** (`Claude` / `Codex` / `both`) ·
  **Reviewer severity** (raw, as claimed) · **Verified verdict** (with any severity change noted
  inline, e.g. `CORRECT → medium`) · **Defect / frontier-move** · **One-liner**.
- **Convergence call** — are these new defects, or re-litigation of tradeoffs? Recommend act vs
  closeout, with the reason.

---

## Hard rules

- **REVIEW ONLY: never edit source code** — not even with approval. The only deliverable is the report.
- **Writes no persistent file** — no ledger, no shared doc. If you need one, use **stateful-review**.
- Both reviewers are **inputs to evaluate, not authorities** — verify every claim against the code;
  cite `file:line`. An automated reviewer is not more authoritative.
- **Severity is yours** — trace the full-flow blast radius; never inherit the reviewer's label.
- Classify **defect vs frontier-move**; flag any regression or re-litigation **loudly, up front**.
- A reviewer being unavailable MUST be reported loudly and carried into the verdict line; never present
  a partial review as complete.
- The report leads with the one-line decision verdict; it is a recommendation, not a merge/apply
  authorization.
- **Do not commit.**
