---
name: fkit-process-stateful-review
description: The coder's side of a stateful, loop-resistant review. Reads the reviewer's findings from a shared review .md file (source of truth), verifies each against the codebase, classifies defect vs frontier-move, assigns verdicts, gates code changes on your approval, applies approved fixes, and records the outcome back into the shared file. Reviewer and coder each own a section and round-trip in place. Use when a review is tracked in a shared ai-agents/reviews/<task-id>.md document.
---

# Process Stateful Review (coder side)

> ## ⛔ Owner: the **coder**
> This is the fkit-coder's own procedure. Execute it **only** if you are the coder — running as the
> `fkit-coder` agent or in a `fkit coder` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-coder Process the stateful review for <task-id>
> ```


The **stateful** variant. The source of truth is a shared review document that **both** the reviewer
and you (the coder) edit: the reviewer writes findings into it, you write your verdicts, actions, and
status back into it, and the loop-prevention memory (accepted residuals) lives there too. This is what
lets a multi-round review start from the decision state instead of re-deriving it blind.

> For a one-shot review of pasted text with **no** persistent file, use **fkit-process-review**
> instead. This skill's whole point is the shared file — it reads and writes it every run.

**Argument:** `$ARGUMENTS` — optional. May include the **task-id** (resolved by the canonical rule
below). The shared review doc lives at `ai-agents/reviews/<task-id>.md`.

**Task-id — resolve it the same way every time (the coder and reviewer MUST agree, or the ledger
forks and the loop-prevention memory is silently defeated):**
1. Explicit `$ARGUMENTS` task-id → use it verbatim.
2. Else the task file's **basename without extension** (`ai-agents/tasks/**/<task-id>.md` → `<task-id>`).
3. Else the current **git branch name**, slugified.
4. If none of these resolves **unambiguously** → **STOP and ask the owner.** Never invent one.

Create `ai-agents/reviews/<task-id>.md` only once the id is resolved by rule 1–3 or confirmed by the
owner — never auto-create a ledger from a guessed id.

---

## The shared review document — schema & ownership

`ai-agents/reviews/<task-id>.md` has three sections with **explicit ownership**:

```
# Review — <task-id>

Task: <path to task file>
File(s) under review: <paths>
Status: in-review | closed-out

## Reviewer findings        ← REVIEWER-owned. You READ this; never edit its rows.
| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | high | a.ts:12   | …     |

## Coder response           ← CODER-owned (yours). You write one row per finding.
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect            | fix X  | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)   ← EITHER party may add; keep the structure.
- <short name> — What: <chosen behavior> · Why (structural): <reason + rejected alternatives> · Re-raise only if: <condition>
```

**Ownership rules — do not violate:**
- You **read** *Reviewer findings*; you **never** edit, reword, or delete its rows. Refer to findings
  by their stable id (`R1`, `R2`, …).
- You **own** the *Coder response* table — one row per finding, keyed by the same id.
- *Accepted residuals* is **shared**: you may add an entry (with the full What / Why / Re-raise
  structure) once I approve treating a finding as a settled tradeoff, but never silently rewrite an
  existing one.

**Status vocabulary** (the *Coder response* → Status cell):
`pending approval` · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · `blocked`.

---

## Your job

You are a critical filter between the reviewer and the codebase — reviewers can be wrong (missing
context, misread diff, symptom-not-root-cause). Evaluate each finding on evidence, not deference, and
**never apply a fix just because it was suggested — verify first, then ask, then apply.** Everything you
conclude gets recorded in the shared file so the next round doesn't re-derive it.

---

## Step 0 — Open (or create) the shared document

- Resolve the **task-id** by the canonical rule above (stop and ask if it doesn't resolve
  unambiguously — never auto-create a ledger from a guessed id).
- Read `ai-agents/reviews/<task-id>.md`. **If it doesn't exist — and only once the task-id is
  resolved — create it** with the schema above: fill the header, seed *Reviewer findings* from
  whatever findings you were handed (or leave a note that the reviewer will populate it), and leave
  *Coder response* / *Accepted residuals* ready to fill.
- Load the **Accepted residuals** into working memory — these are settled; do not re-litigate them.
- **Also load settled ADRs:** skim `ai-agents/knowledge-base/decisions/` for any ADR relevant to the
  scope. Treat an ADR's **"Re-raise only if"** exactly like an accepted residual — a finding it covers
  is closeout unless that condition is met.

---

## Step 1 — Identify the novel findings

From *Reviewer findings*, the **novel** set = rows that have **no matching row in *Coder response*** yet
(i.e. this round's new work). Ignore findings you already dispositioned in a prior round unless the
reviewer added a new row for them.

If findings arrived as pasted text rather than already in the file, first append them as rows to
*Reviewer findings* (that's seeding the reviewer's section on their behalf — note it), then proceed.

---

## Step 2 — Loop check against settled decisions (do this first, loudly)

For each novel finding, check it against the *Accepted residuals* **and the ADRs you loaded in Step 0**:
- If it **matches** a residual — or an ADR — whose **"Re-raise only if"** condition is **not** met →
  this is **closeout, not a new defect.** Write a *Coder response* row with Verdict `closeout` /
  Status `closeout (re-litigation)`, pointing at the residual or ADR by name. Say so **clearly and
  loudly** in your reply. Do **not** re-fix it.
- If the condition **is** met, or nothing settled matches → it's genuinely novel; continue to Step 3.

---

## Step 3 — Verify each novel finding against the codebase

For each, **read the actual code** at the referenced location, with enough surrounding context to
understand the full flow — not just the cited line. Ask:
- Is the claim factually accurate given the current code?
- Does the reviewer understand how this path is actually reached?
- Are they missing project context (architecture, deployment, config, test coverage)?
- Is the recommended fix solving the right problem, or masking a symptom?
- **Is the stated severity justified?** Trace the *full flow* — the real blast radius may be far smaller
  than the label.

**Severity is yours to assign, not the reviewer's.** Derive it from the blast radius you traced; never
inherit the reviewer's "no-ship / high / medium" label.

---

## Step 3.5 — Classify defect vs frontier-move + regression check

- **Defect** — wrong behavior or a real regression → act on it, in **any** round.
- **Frontier-move** — a deliberate point on an unavoidable tradeoff; the finding just names its cost.
  This is a *decision made once*, not a re-fix. If confirmed as an intended tradeoff, it's a candidate
  to record as an **accepted residual** (Step 6), not a code change.

**Regression / oscillation check** — using the *Coder response* history already in the file: would the
recommended fix cause a regression, or recreate a condition a **prior** finding flagged? If yes, **point
to it clearly and loudly BEFORE applying anything** — name the tradeoff and let me decide.

A round budget is a proxy, not the rule: a genuine **new defect** in round 3+ MUST still be acted on;
stop on the *nature* of the finding, not the count.

---

## Step 4 — Assign verdicts and write the Coder response rows

Assign each novel finding one of **CORRECT / PARTIALLY CORRECT / INCORRECT / INCOMPLETE** (same
definitions as fkit-process-review). Then **write a row into *Coder response*** for each, keyed by
finding id:
- Verdict, Defect/Frontier classification, the intended Action (a one-line fix summary, or "none" for
  INCORRECT / a frontier-move), and Status.
- For anything requiring a code change, set Status = **`pending approval`** (nothing is applied yet).
- INCORRECT → Status `disproven`, Action `none`. Frontier-move you recommend keeping → `won't fix
  (frontier)` (pending my confirmation to record it as a residual).

Recording your evaluation in the file is a **docs-only** write — it changes no code.

---

## Step 5 — Report + convergence call, then gate on approval

Reply with:
- A summary table (id · Verdict · Defect/Frontier · Status · one-liner) mirroring what you wrote to the
  file, plus the **suppressed-as-settled** list from Step 2 (each with its residual pointer).
- **What, if anything, requires a code change.**
- A **convergence call**: are these new defects, or re-litigation of settled tradeoffs? Recommend
  **act** vs **closeout**, with the reason — proactively, don't wait for me to spot a loop.

Then **wait for my explicit approval** before changing any code.

---

## Step 6 — Apply approved fixes + update the shared file

Once I explicitly approve specific findings:
- **Apply** the minimal, idiomatic fix for each approved finding (smallest correct change; match
  surrounding style; no unrelated refactors). Add/update tests and run the relevant tests / linter /
  build; if you can't run them, say so.
- **Update the *Coder response* row**: set Action to what you actually did and Status to **`✅ done`**
  (or `blocked` with the reason if you couldn't complete it).
- For any finding I confirmed as an **intended tradeoff**, add an entry to **Accepted residuals** with
  its full What / Why (structural) / Re-raise-only-if, and set that row's Status to `won't fix
  (frontier)`. This is what stops the next round (and the next reviewer) from re-litigating it.
- If all novel findings are closeout / disproven / accepted and nothing blocking remains, set the
  document header **Status: closed-out**.
- **Do not commit** — staging the code edits + the file update is as far as you go.

Apply nothing I did not approve; INCORRECT findings get no code change.

---

## Step 7 — Final report

Concise summary: findings dispositioned this round, code changed (files + how tested + result), the
*Coder response* rows written, any newly-recorded residual, the document's new Status, and anything
flagged for my review. Remind me that **this skill** made no commit — the edits are in the working
tree. Do not claim the repository has uncommitted work, or that anything is or isn't committed — this
skill has not checked, and the owner may have committed between turns. If commit state matters to the
report, run `git status` first. (See
[`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Hard rules

- **The shared file is the source of truth** — read the reviewer's section, write only your own section
  (+ shared residuals with approval), never edit the reviewer's rows.
- Read the code; cite `file:line`. Do not speculate about what the code probably does.
- Never change code without my explicit approval in this turn; after approval, apply only what I
  approved.
- Classify defect vs frontier-move before acting; flag any regression or re-litigation **loudly, up
  front**, never silently. Loop-check against Accepted residuals every round.
- Severity is yours to assign — trace the full-flow blast radius; never inherit the reviewer's label.
- Proactively call the stop when the loop starts — with the reason.
- All four verdicts are equally valid; don't bias toward confirming the reviewer. An automated reviewer
  (Codex, CI, linter) is not more authoritative — evaluate it the same way.
- **Do not commit.** Commit only when I explicitly ask.
