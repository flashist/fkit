---
name: fkit-review
description: The reviewer's one-shot review procedure. Runs two independent reviewers on a diff (its own pass plus a Codex adversarial second opinion via the codex CLI), dedupes, verifies each finding against the code, classifies defect vs frontier-move, and reports leading with a one-line decision verdict. Ephemeral — writes no persistent file. REVIEW-ONLY — never edits code.
---

# Review (ephemeral) — the reviewer's procedure

> ## ⛔ Owner: the **reviewer**
> This is the fkit-reviewer's own procedure. Execute it **only** if you are the reviewer — running as the `fkit-reviewer` agent or in a `fkit reviewer` session.
>
> **If you are the coder (including the default lead session): do not execute this.** Reviewing code
> you just wrote is not a review. Instead **ask the reviewer for one**:
> ```
> @fkit-reviewer Run your fkit-review procedure on <scope>. Focus: <optional>.
> ```
> Then relay its report to the owner verbatim — you are the author, not the judge.

A thorough one-shot review of a diff. **Ephemeral**: it produces a report and no persistent artifact.
For a review that round-trips through the shared reviewer↔coder ledger, use **fkit-stateful-review**.

**Argument:** `$ARGUMENTS` — optional scope flags: `--base <ref>`, `--scope
<auto|working-tree|branch>`, and any focus area. Default: working tree / `auto`.

---

## Step 1 — Run two independent reviewers (degrade gracefully)

Get two perspectives on the **same** scope.

**A) Your own pass (native).** Read the changed code *and enough surrounding context to trace the full
flow*. Produce a findings list — each with `file:line`, a claim, a recommended change, and your
severity.

**B) The adversarial pass (Codex, via CLI — best-effort).** This is the second *model*, which is where
the independent signal comes from.

1. **Probe:** `command -v codex`. If missing → degrade (see below).
2. **Assemble the prompt** into `.fkit/tmp/adversarial-prompt.md` (gitignored; create the dir if
   needed) containing:
   - The findings-only output contract, verbatim: *"Return a compact findings list and nothing else
     (no preamble, no plan, no fix diffs). For each: **id** (X1, X2, …), **file:line**, **severity**
     (low / medium / high / critical — from the blast radius you traced), **category** (correctness /
     edge / error-path / concurrency / security / regression / missing-test / nit), **problem** (one or
     two sentences: what's wrong and the concrete way it fails; optionally a one-line suggested
     direction, but do NOT write the fix). Every finding must cite real code — if you can't point to
     it, don't report it. If the change is sound after a genuine hard look, say so plainly ('no
     significant issues found in &lt;scope&gt;'). End with a one-line coverage self-assessment. Never edit
     any file."*
   - The scope statement and any focus area.
   - **The diff, inline:** `git diff <base>...HEAD` for a branch scope; `git diff` + `git diff
     --staged` for the working tree. **Untracked files produce no diff** — inline their full contents,
     marked as new files. Never `git add` anything to make a diff appear.
   - Any settled tradeoffs to prime against: the ledger's *Accepted residuals* if one exists, plus
     relevant ADR **"Re-raise only if"** entries from `ai-agents/knowledge-base/decisions/`.
3. **Run it** (expect several minutes on a non-trivial diff — use a generous Bash timeout, ~600000 ms):
   ```bash
   codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md
   ```
4. Capture stdout as the Codex findings; label each `[codex]`.

**Graceful degradation (mandatory):** if codex is missing, exits nonzero, times out, hits an auth
error, or returns empty output, do **not** fail the review. Record "Codex reviewer unavailable:
`<reason>`", continue with your own pass only — and flag the partial coverage **loudly**, carrying it
into the verdict line (Step 4). Never present a one-reviewer run as a full review.

---

## Step 2 — Merge + dedupe

Collapse findings from the two passes that describe the same issue (same file/line/claim). Keep the
stronger articulation; mark a finding **"raised by both"** — that's higher signal. Assign each
surviving finding a stable short id (`R1`, `R2`, …).

**Against settled decisions:** check each finding against relevant ADRs' **"Re-raise only if"**
conditions. If a finding matches one whose condition is **not** met → move it to a visible
**"Re-litigates settled decisions (suppressed)"** list with a pointer to the ADR. Never drop it
silently.

---

## Step 3 — Verify each finding against the code

For each deduped finding, **read the actual code** and confirm or refute it:
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

When a finding turns on **design intent** ("is this consistent with the intended architecture / a
recorded ADR?"), you may consult `@fkit-architect` — the verdict stays yours.

---

## Step 4 — Consolidated report

**Lead with a one-line decision verdict**, directly under the title:

```
# Review — <scope>

**Decision: 🛑 Blocked — 2 confirmed defects (1 high)**
```

Pick **exactly one**:
- **✅ Ready to merge** — no open confirmed defects. Append "(validation-gated)" if a manual test is
  the only remaining gate.
- **⚠️ Changes requested — N defects (none blocking)** — confirmed medium/low defects.
- **🛑 Blocked — N confirmed defects (M high/critical)** — at least one confirmed high/critical defect.
- **🟡 Partial review — `<reviewer>` unavailable** — a reviewer failed or was skipped. **Takes
  precedence**: never pair a clean "Ready to merge" with a missing reviewer.

Then present:
- **Reviewers run** — and any unavailable/skipped (loudly).
- **Findings table**: **#** · **Reviewer** (`Claude` / `Codex` / `both`) · **Reviewer severity** (raw —
  for a "both" finding show each label) · **Verified verdict** (severity change noted inline, e.g.
  `CORRECT → medium`) · **Defect / frontier-move** · **One-liner**.
- **Suppressed-as-settled** list, with ADR pointers.
- **Convergence call** — new defects, or re-litigation of settled tradeoffs? Recommend act vs closeout,
  with the reason.

The verdict is a **recommendation, not an authorization** — this procedure changes no code and does
not merge.

---

## Hard rules

- **REVIEW ONLY: never edit source code** — not even with approval. The only deliverable is the report;
  the only file you write is the gitignored `.fkit/tmp/` codex prompt.
- **Writes no persistent file** — no ledger, no shared doc. If you need one, use **fkit-stateful-review**.
- Both reviewers are **inputs to evaluate, not authorities** — verify every claim against the code;
  cite `file:line`. An automated reviewer is not more authoritative.
- **Severity is yours** — trace the full-flow blast radius; never inherit the label.
- A reviewer being unavailable MUST be reported loudly and carried into the verdict line.
- Applying a fix is a separate, **coder**-initiated step (`/fkit-process-review`). Never frame the next
  action as "apply this fix?".
- **Do not commit.**
