---
name: fkit-process-review
description: Critically evaluate pasted-in reviewer feedback before acting — verify every claim against the codebase, classify each finding (defect vs frontier-move), assign a verdict, gate any code change on your explicit approval, then apply approved fixes. Ephemeral — works only from copied review text and never reads or writes a stateful review .md file. Use for a one-shot review of pasted comments (Codex output, a GitHub review, ad-hoc feedback).
---

# Process Review (ephemeral)

> ## ⛔ Owner: the **coder**
> This is the fkit-coder's own procedure. Execute it **only** if you are the coder — running as the
> `fkit-coder` agent or in a `fkit coder` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-coder Process this review feedback: <paste>
> ```


Review text to evaluate:

> $ARGUMENTS

**This is the stateless variant.** It works *only* from the copied text above and produces **no
persistent artifact** — it never reads or writes a review ledger / stateful-review `.md` file. For a
review that round-trips through a shared reviewer↔coder document, use **fkit-process-stateful-review**
instead.

## Your job

You are a critical filter between an external reviewer and the codebase. Reviewers can be wrong. They
may lack project context, misread the diff, reason from outdated assumptions, or propose a fix that
addresses symptoms rather than the root cause. Evaluate each finding independently and present a
verdict backed by evidence — not by deference.

**Never apply a fix just because a reviewer suggested it. Verify first, then ask, then apply.**

---

## Step 1 — Parse the review

Break `$ARGUMENTS` into individual findings. Number them. For each, note:
- What the reviewer claims is wrong or missing
- What change they are recommending (explicitly or implicitly)

If the review is a single block of prose with no clear numbered items, infer the logical findings
yourself.

---

## Step 2 — Verify each finding against the codebase

For each finding, **read the actual code** at the referenced location. Read enough surrounding context
to understand the full flow — not just the line the reviewer cited.

Before forming a verdict, ask:
- Is the claim factually accurate given the current code?
- Does the reviewer understand how this code path is actually reached?
- Are they missing project-specific context (architecture, deployment model, config, test coverage)?
- Are they reasoning from an incorrect assumption about control flow, data shape, or ownership?
- Is their recommended fix solving the right problem, or just masking a symptom?
- **Is the stated severity actually justified?** Trace the *full flow*, not the cited line — a
  mechanism flagged in isolation may already be neutralized downstream, so the real blast radius can be
  far smaller than the label.

Do not rely on the reviewer's description of what the code does. Read it yourself.

**Severity is yours to assign, not the reviewer's.** Do not inherit a "no-ship / [high] / [medium]"
label — derive it from the blast radius you traced. A finding that *sounds* like no-ship can collapse
to a low-severity note once a downstream guarantee (content-addressing, a fail-closed path, existing
validation) is accounted for. Trace it before you agree it's serious.

---

## Step 2.5 — Classify: defect vs frontier-move (before any verdict)

For each finding, decide which kind it is:

- **Defect** — the code does the wrong thing, or a fix would remove a real regression. Act on it.
- **Frontier-move** — the code sits at a deliberate point on an **unavoidable tradeoff** (every option
  has a real cost) and the finding just names the cost of the current choice. This is a *decision*, not
  a defect to re-fix.

Then run the regression check: **would the recommended fix cause a regression, or trade the reviewer's
objection for a different one** (oscillation)? If yes, **say so clearly and loudly BEFORE applying
anything** — name the tradeoff and let me decide; do not silently apply.

Without a persistent ledger this skill can't detect cross-round re-litigation on its own — so if a
finding looks like it's relocating a cost rather than fixing a defect, flag that suspicion explicitly.
(That cross-round memory is exactly what **fkit-process-stateful-review** adds.)

---

## Step 3 — Assign a verdict and respond

**CORRECT** — The claim is accurate and the fix addresses a real problem.
→ Describe precisely what needs to change and why, citing `file:line` locations. Present the proposed
change and ask me for explicit approval. Do not touch code yet.

**PARTIALLY CORRECT** — The finding identifies a real issue, but the diagnosis or fix is wrong, too
narrow, or creates a new problem.
→ Explain which part holds up and which does not, with evidence. Propose the correct fix. Ask for
explicit approval before touching code.

**INCORRECT** — The claim does not hold up.
→ Explain why, citing the specific file paths, line numbers, control flow, or config facts that
disprove it. Do not implement anything. Do not offer a "just in case" change.

**INCOMPLETE** — The finding is correct but misses something: a related bug, an uncovered edge, a
missing test, a broader pattern.
→ Confirm what's right, describe what's missed and why it matters, propose a full fix covering both.
Ask for explicit approval before touching code.

---

## Step 4 — Summary table + convergence call

Output:

| # | Verdict | Defect / Frontier-move | One-line description |
|---|---------|------------------------|----------------------|
| 1 | CORRECT / PARTIALLY CORRECT / INCORRECT / INCOMPLETE | … | … |

Then state clearly **what, if anything, requires a code change**, and **wait for my explicit approval
before proceeding.**

**Call convergence proactively.** If the findings look like they're relocating frontier costs rather
than fixing new defects, say so plainly and recommend closeout, with the reason — don't wait for me to
notice.

---

## Step 5 — Apply approved fixes

Once — and only once — I have **explicitly approved** a specific finding's change in this conversation:
- Implement the minimal, idiomatic fix for that finding. Make the smallest change that correctly solves
  it; match the surrounding code's style; don't refactor unrelated code.
- Add or update tests for the changed behavior and run the relevant tests / linter / build. If you
  can't run them, say so.
- Report per finding: what changed, which files, how it was tested, and the result. Flag anything
  unverified.
- **Do not commit** — staging the edits is as far as you go; commits happen only when I explicitly ask.

Apply nothing that I did not approve. INCORRECT findings get no code change at all.

---

## Hard rules

- Read the code. Do not speculate about what it probably does.
- Cite `file:line` when making claims about behavior.
- Never change code without my explicit approval in this conversation turn; after approval, apply only
  the approved change.
- Classify defect vs frontier-move before acting; flag any regression or suspected re-litigation
  **loudly, up front**, never silently.
- Severity is yours to assign — trace the full-flow blast radius before agreeing a finding is
  high/no-ship; never inherit the reviewer's label.
- Proactively call the stop when a loop appears — with the reason.
- All four verdict outcomes are equally valid. Do not bias toward confirming the reviewer.
- A review being from an automated tool (Codex, CI, linter) does not make it more authoritative —
  evaluate it the same way.
- **This skill writes no review `.md` file.** It leaves no persistent record; if you need one, use
  **fkit-process-stateful-review**.
- **Do not commit.** Commit only when I explicitly ask.
