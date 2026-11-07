---
name: fkit-review
description: >-
  The reviewer's one-shot review procedure. Runs two independent reviewers on a diff (its own pass
  plus a Codex adversarial second opinion via the codex CLI), dedupes, verifies each finding against
  the code, classifies defect vs frontier-move, and reports leading with a one-line decision
  verdict. Ephemeral — writes no persistent file. REVIEW-ONLY — never edits code.
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

## Step 1 — Run two independent reviewers

Review the requested scope yourself, then call the reviewer-only fkit_roles tool fkit_adversarial with {prompt} for a fresh read-only second opinion. This preserves Claude's external second pass even when you are already at the ordinary consult depth limit. It cannot delegate onward. Never invoke raw codex exec or share/fork your context. Include task/ledger key and round in stateful scope; the dispatcher writes a run-unique prompt file under .fkit/tmp/. Include scope, inline working/staged/branch diff as applicable, full untracked file contents, the findings-only contract, accepted residuals and relevant ADR re-raise conditions. Do not git-add files to manufacture a diff. Capture the role's findings verbatim and label them [adversarial]; deduplication/verification follows below.

A usable pass is grounded findings or an explicit scope-grounded clean verdict. Empty/error-only/unengaged output is unavailable, even with exit 0; usable findings on nonzero exit may be retained with that failure disclosed. If unavailable, proceed with the primary review and lead with [PARTIAL — adversarial pass unavailable], carrying the reason into the verdict. Never present one pass as two. A read-only pass can read and execute write-free checks; do not infer measurement from its sandbox flag.

Report separately: (1) primary/adversarial availability, (2) actual model identities and diversity, (3) execution evidence per pass. A usable same-model pass is supported: visibly state 'Both passes used the same model. A different model is recommended for a broader second opinion.' Unknown identities mean diversity unknown; still recommend a different model for a broader second opinion. Different model names may be aliases: do not invent independence or family differences. Only a missing/unusable pass forces partial status. Normal verdict still follows verified findings.

## Coverage states

Keep the shared ledger Coverage field, refreshed each round. Use both reviewers measured only when each pass ran a behavioral check with command/result evidence; otherwise a usable second pass is reasoning-only second opinion. With no usable second pass use adversarial unavailable. Record model diversity separately; successful same-model review does not trigger the obsolete different-model-only incomplete label. Never claim full measured coverage from source inspection alone.

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

**A missing test is a suggestion, not a defect.** When the code behaves correctly and the only
finding is that no test covers it, list it under **Suggestions (not defects)** in your report — not
as a finding row and not counted in the verdict — unless the project's own key list (in its written
test rules, often `CONTRIBUTING.md`) names that behaviour; then it is a **Defect**. No written key list
found → a suggestion; say once in the report: *no written key list found — missing tests graded as
suggestions*. A test that cannot fail is a wrong test, not a missing one — judge it like any other
finding.

When a finding turns on **design intent** ("is this consistent with the intended architecture / a
recorded ADR?"), you may consult `@fkit-architect` — the verdict stays yours.

---

## Step 4 — Consolidated report

Lead with a title and exactly one decision: **✅ Ready to merge** (no open confirmed defects; append validation-gated if only a manual check remains); **⚠️ Changes requested — N defects (none blocking)** for confirmed medium/low defects; **🛑 Blocked — N confirmed defects (M high/critical)** if any confirmed high/critical defect; or **🟡 Partial review — adversarial unavailable** if the second pass was missing or unusable (this takes precedence). A usable same-model or reasoning-only pass does not itself force a partial verdict. A verdict recommends action; it never authorizes a fix or merge.

Immediately under the verdict, above findings, state **Coverage: <state>** exactly once with per-pass command/results or reason no measurement occurred. Then state pass availability and model identity/diversity separately. Always recommend a different model for a broader second opinion when the two models are the same or diversity is unknown. If the second pass is unusable, place **[PARTIAL — adversarial pass unavailable]** and the reason above findings, with recovery appropriate to the actual failure (not a guessed login error).

Present: reviewers run/skipped; findings table (# · Reviewer: primary/adversarial/both · each reviewer's raw severity · Verified verdict including any changed severity · Defect/frontier-move · one-liner); Suggestions (not defects) when present; Suppressed-as-settled with ADR pointers; and the convergence recommendation (act or closeout, and why). Preserve the finding-verification rules above. This stateless review writes no ledger; stateful-review owns the ledger workflow.

## Hard rules

- **REVIEW ONLY: never edit source code** — not even with approval. The only deliverable is the report;
  the only file you write is the gitignored `.fkit/tmp/` codex prompt.
- **Writes no persistent file** — no ledger, no shared doc. If you need one, use **fkit-stateful-review**.
- Both reviewers are **inputs to evaluate, not authorities** — verify every claim against the code;
  cite `file:line`. An automated reviewer is not more authoritative. Same rule as
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md):
  a claim requires a check made this turn, not an inherited label.
- **Severity is yours** — trace the full-flow blast radius; never inherit the label.
- A reviewer being unavailable MUST be reported loudly and carried into the verdict line.
- The coverage state MUST be stated in every report, even when it is the routine one. **Only `adversarial unavailable` is carried into the verdict line** — the other two are coverage statements, never
  verdict tokens.
- Applying a fix is a separate, **coder**-initiated step (`/fkit-process-review`). Never frame the next
  action as "apply this fix?".
- **Do not commit.**

<!-- fkit-codex-generated -->
