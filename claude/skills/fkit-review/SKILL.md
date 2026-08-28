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
     significant issues found in &lt;scope&gt;'). End with a one-line coverage self-assessment — and
     **state explicitly whether you executed anything** (a command you ran and its result), or that
     you only read and reasoned. Never edit any file."*
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

**Graceful degradation (mandatory):** if the Codex pass comes back **unusable** — codex missing, an
auth error, empty output, or a run that produced no usable verdict — do **not** fail the review.
Record "Codex reviewer unavailable: `<reason>`", continue with your own pass only — and flag the
partial coverage **loudly**, carrying it into the verdict line (Step 4). Never present a one-reviewer
run as a full review. This is coverage state **Codex unavailable** — and **§Coverage states step 1 is
the test for it**, not this paragraph.
⚠️ **A non-zero exit or a timeout is not by itself this branch.** If the output is a genuinely usable
pass, take it and say so in the evidence clause; only an **unusable** one degrades.
⚠️ A Codex pass that **ran** but measured nothing is **not** this branch either: it is
**reasoning-only second opinion**, a normal state, and it fires no banner and forces no verdict.

---

## Coverage states — ADR-042 D1 (state exactly one, in every report)

Every review report states **exactly one** coverage state. This is a **statement about evidence, not
a verdict** — it never replaces, forces, or softens the decision verdict.

- **both reviewers measured** — the Claude reviewer *and* the Codex pass each **executed** something
  bearing on what it reported — a finding, or a clean bill of health (ran the suite, built a fixture,
  proved a mutation, reproduced a failure).
  ⛔ **Claim this ONLY on evidence in the Codex output that it actually executed something** — a
  command it ran, plus that command's actual result. **Never infer it from the `--sandbox` flag
  permitting execution.**
- **reasoning-only second opinion** — Codex **ran and reasoned** over the diff, but **measured
  nothing** bearing on what it reported. It may have read, grepped, or type-checked; none of that is
  measurement. **Any execution evidence in this report is the Claude reviewer's — and there may be
  none, if neither pass measured.** ⭐ This is a **normal, expected state — not a degradation
  event.** Nothing is broken, no banner fires, and the verdict is **not** affected. It still must be
  stated, every time, never omitted because it is routine.
- **Codex unavailable** — Codex was unreachable, or its pass came back **unusable**: an error, a
  timeout, or output carrying no usable verdict (**step 1 below is the test** — an error or a timeout
  is not by itself enough).
  **This one IS a degradation**: this report's `[NOT model-diverse — INCOMPLETE]` banner fires
  (Step 4) and the verdict is forced to `🟡 Partial review — Codex unavailable`. **Unchanged.**
  ⚠️ Do not confuse it with `[claude-fallback — NOT model-diverse]` — that is the **adversarial
  reviewer's own** self-label for a pass it ran itself instead of Codex
  ([`fkit-adversarial-review`](../fkit-adversarial-review/SKILL.md)); this procedure never fires it.

**Decide which applies PER RUN, from the Codex output — never from the sandbox flag:**
1. Did the `codex exec` call return a **usable pass** — a findings list, or an explicit,
   diff-grounded *"no significant issues found"*? **No → `Codex unavailable`.** **Usability decides,
   not the exit code:** an empty body, a cap/timeout with no verdict, or output that never engaged the
   diff land here **even on exit 0**, and a genuinely usable pass is **still usable on a non-zero
   exit** — take it, and say so in the evidence clause. If you cannot tell, it is not usable.
2. Yes. Now ask it of **both passes — yours and Codex's**: does the output show it **executed**
   something bearing on what it reported — a command it ran, and that command's actual result?
   **Both did → `both reviewers measured`. Otherwise → `reasoning-only second opinion`.**
   ⚠️ **The bar is running the code, or a test or fixture over it** — a command whose result is
   evidence about **behaviour**, not about the source's shape, syntax, or type-correctness. A command
   that only inspects the source *text* (`cat`, `grep`/`rg`,
   `git diff`, `ls`, reading a file) is **reading, not measuring**, whatever tool spells it. Codex
   reporting a **denied** write, or emulating a run in its head, is **reasoning-only**.
   ⚠️ If **Codex** executed and **you** did not, that is not a third answer — **run the relevant check
   yourself**, then re-answer. **Never claim both measured when only one did.**
3. **Cite the evidence for whichever you picked, in one clause** — the codex-cli version (read it from
   the run, e.g. `codex --version`) and the exit status, plus either the command Codex ran, or the
   reason it measured nothing.
   ⚠️ **When there was no run at all** — the `command -v codex` probe found nothing (Step 1) — there
   is no version and no exit status to cite. Say **what was missing and why**, and cite neither; the
   worked example for that state does exactly this.
   ⛔ **Never copy a version out of an example, and never invent one** — a fabricated version is a
   false evidence claim in the one line built to carry evidence.

> **Dated note — 2026-08-28. This is an observation about today's environment, NOT the rule above.**
> fkit invokes Codex with `--sandbox read-only`. That blocks **writes** — `mkdtemp`, fixtures, anything
> that touches the tree — **but not execution**: Codex can and does run shell commands under it
> (measured 2026-08-28). So a **write-free behavioural check** can run today, while anything needing a
> temp dir or a fixture cannot — `test/prove-red.sh:82` opens with `mktemp -d`, so fkit's own
> red-proof harness is out of reach.
> ⚠️ **This note pre-decides nothing — walk steps 1–3 every time.** In particular: a run that came
> back unusable is still **`Codex unavailable`** (step 1); a Codex pass that executed only source-*text*
> inspection is still **reasoning-only** (step 2); and step 2 now has **two legs** — **your own leg can
> measure today**, whatever Codex did. What is merely *typical* today is that Codex executes nothing
> bearing on what it reported, so most reports land on **reasoning-only second opinion**. Typical is
> not a determination. If the sandbox changes, the rule above needs **no edit** — only this note goes
> stale.

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
- **🟡 Partial review — `<reviewer>` unavailable** — a reviewer failed or was skipped. **A
  reasoning-only Codex pass is neither — it never takes this verdict** (§Coverage states). **Takes
  precedence**: never pair a clean "Ready to merge" with a missing reviewer.

**Then state the coverage state on its own line, immediately under the verdict and above the
findings** (§Coverage states) — a plain line item with its evidence clause, no box (the clause may
wrap; what "plain" rules out is a banner):

```
**Decision: ✅ Ready to merge**

**Coverage: reasoning-only second opinion** (ADR-042 D1 — the normal state, not a degradation).
Codex ran (`codex-cli <version>`, exit <status>) and reasoned over the diff, but measured nothing —
<why>. Any execution evidence below is mine.
```

**When the missing reviewer is Codex, the verdict line is not enough on its own.** The coverage line
still takes the slot directly under the verdict — it is mandatory in **every** report, this one
included — and the banner sits **directly beneath it**, both still above the findings:

```
# Review — <scope>

**Decision: 🟡 Partial review — Codex unavailable**

**Coverage: Codex unavailable** (ADR-042 D1 — the one state that IS a degradation).
<`codex exec` returned no usable pass — an error / nothing / no verdict | `codex` was not installed,
so nothing ran>. There was no second opinion to weigh; all evidence below is mine.

⚠️ [NOT model-diverse — INCOMPLETE] Codex was unreachable (<reason>), so this review had **no
independent second opinion**: the model that reviewed this code is the same model family that may
have written it. Do not read this as a completed review.
Fix:  codex login   (or install Codex, then re-run)
```

**This flag is load-bearing.** The failure it guards against is a one-model run being mistaken for a
model-diverse review — unearned confidence, which is worse than an obviously missing review. A reader
must hit this **before** the findings table, never in a footer.

Then present:
- **Reviewers run** — and any reviewer unavailable/skipped (loudly). ⛔ **Do not restate the coverage
  state here** — it is already in its fixed slot under the verdict, and it is stated **exactly once**.
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
  cite `file:line`. An automated reviewer is not more authoritative. Same rule as
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md):
  a claim requires a check made this turn, not an inherited label.
- **Severity is yours** — trace the full-flow blast radius; never inherit the label.
- A reviewer being unavailable MUST be reported loudly and carried into the verdict line.
- The coverage state MUST be stated in every report, even when it is the routine one. **Only `Codex
  unavailable` is carried into the verdict line** — the other two are coverage statements, never
  verdict tokens.
- Applying a fix is a separate, **coder**-initiated step (`/fkit-process-review`). Never frame the next
  action as "apply this fix?".
- **Do not commit.**
