---
name: fkit-stateful-review
description: The reviewer's side of a stateful, loop-resistant review. Runs its own pass plus a Codex adversarial second opinion, dedupes against the shared ledger so settled tradeoffs aren't re-litigated, verifies each finding against the code, and writes the Reviewer findings section of ai-agents/reviews/<task-id>.md — which the coder's fkit-process-stateful-review reads and responds to. REVIEW-ONLY — writes documents, never source code.
---

# Stateful Review (reviewer side) — the reviewer's procedure

> ## ⛔ Owner: the **reviewer**
> This is the fkit-reviewer's own procedure. Execute it **only** if you are the reviewer — running as the `fkit-reviewer` agent or in a `fkit reviewer` session.
>
> **If you are the coder (including the default lead session): do not execute this.** Ask the reviewer:
> ```
> @fkit-reviewer Run your fkit-stateful-review on <scope>. Task-id: <id, if known>.
> ```
> Relay its report and its owner-questions to the owner **verbatim** — you are the author, not the
> judge. Your side of this loop is **`/fkit-process-stateful-review`**.

The **stateful** review. The source of truth is a shared document that **both** the reviewer (you) and
the coder edit: you write **findings** into it; the coder writes **verdicts, actions, and status** back
into it; the loop-prevention memory (accepted residuals) is shared. This is what lets a multi-round
review start from the decision state instead of re-deriving it blind, round after round.

**Argument:** `$ARGUMENTS` — optional: the **task-id**, plus scope flags `--base <ref>`, `--scope
<auto|working-tree|branch>`. Default: working tree / `auto`.

**Task-id — resolve it the same way every time** (the reviewer and coder MUST agree, or the ledger
forks and the loop-prevention memory is silently defeated):
1. Explicit task-id in `$ARGUMENTS` → use it verbatim.
2. Else the task file's **basename without extension** (`ai-agents/tasks/**/<task-id>.md`).
3. Else the current **git branch name**, slugified.
4. If none resolves **unambiguously** → **STOP and ask** (the owner if they're present; otherwise
   return the question to whoever invoked you). Never invent one, and never auto-create a ledger from
   a guessed id.

---

## The shared review document — schema & ownership

`ai-agents/reviews/<task-id>.md` has three sections with **explicit ownership**. This schema is shared
with the coder's `fkit-process-stateful-review` — **keep it exact** so the two sides interoperate.

```
# Review — <task-id>

Task: <path to task file>
File(s) under review: <paths>
Status: in-review | closed-out

## Reviewer findings        ← YOUR section. You write/append rows here.
| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | high | a.ts:12   | …     |

## Coder response           ← CODER-owned. You READ this for context; never write it.
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect            | fix X  | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)   ← EITHER party may add; keep the structure.
- <short name> — What: <chosen behavior> · Why (structural): <reason + rejected alternatives> · Re-raise only if: <condition>
```

**Ownership rules — do not violate:**
- You **own** *Reviewer findings* — append one row per finding, with a stable id (`R1`, `R2`, …
  continuing from existing rows) and the **Round** number for this pass.
- You **read** *Coder response* for context; you **never** write or edit it. Its Status vocabulary —
  `pending approval` · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` ·
  `blocked` — is the coder's to set.
- *Accepted residuals* is **shared**: you may add an entry (full What / Why / Re-raise structure) once
  the **owner** approves treating a finding as a settled tradeoff; never silently rewrite an existing
  one.

---

## Step 0 — Open (or create) the shared document

- Resolve the **task-id** by the canonical rule above, and the review **scope**.
- Read `ai-agents/reviews/<task-id>.md`. **If it doesn't exist — and only once the task-id is resolved,
  not guessed — create it** with the schema above (fill the header; leave the tables ready). Load the
  **Accepted residuals** and any existing *Reviewer findings* / *Coder response* rows.
- **Load settled ADRs:** skim `ai-agents/knowledge-base/decisions/` for any ADR relevant to the scope.
  An ADR's **"Re-raise only if"** counts exactly like an accepted residual.
- The **Round** for this pass = (highest Round already in *Reviewer findings*) + 1, or `1` if fresh.

## Step 1 — Run two independent reviewers

Exactly as in **fkit-review Step 1** — your own pass, plus the Codex adversarial pass via
`codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md`, with the same
findings-only contract, the same untracked-files handling, and the same **mandatory graceful
degradation** (record "Codex reviewer unavailable: `<reason>`", continue, flag partial coverage loudly
in the verdict).

**Priming (best-effort):** include the *Accepted residuals* + relevant ADR re-raise conditions in the
codex prompt ("these tradeoffs are already settled — don't re-raise unless `<condition>`"). Reviewers
may ignore it; the Step 2 output-side dedup is the real guarantee.

## Step 2 — Merge + dedupe (the reliable filter)

- **Between reviewers:** collapse findings describing the same issue; keep the stronger articulation;
  mark "raised by both".
- **Against prior rounds:** drop findings already recorded in *Reviewer findings* from an earlier round
  unless materially new.
- **Against settled decisions:** check *Accepted residuals* **and the ADRs from Step 0**. A finding
  matching one whose **"Re-raise only if"** condition is **not** met → move it to a visible
  **"Re-litigates settled decisions (suppressed)"** list with a pointer. **Never drop it silently.**
- Output: the **novel** findings + the visible suppressed list.

## Step 3 — Verify each novel finding against the code

Read the actual code with enough context to trace the full flow. Assign a **verified verdict**
(`CORRECT` / `PARTIALLY CORRECT` / `INCORRECT (disproven)` / `INCOMPLETE`) and **your own severity**
(from the blast radius you traced — never inherit the label). Classify **Defect** vs **Frontier-move**.
**Regression check:** using the *Coder response* history, would a finding's recommended fix cause a
regression or recreate a condition a prior finding flagged? If so, flag it **loudly, up front**.

When a finding turns on **design intent**, you may consult `@fkit-architect` — the verdict stays yours.

## Step 4 — Write the Reviewer findings rows

Append one row per **novel** finding to *Reviewer findings*: id (`R<next>`), the current **Round**,
**Sev** (your assigned severity), `file:line`, and a one-line **Claim**. Disproven findings need not be
recorded as rows — but note them in the report so the coder isn't asked to chase them. This is a
**docs-only** write: it changes no code, and it never touches *Coder response*.

These rows are exactly what the coder's `fkit-process-stateful-review` consumes as its input.

## Step 5 — Consolidated report + convergence call

**Lead with a one-line decision verdict.** Pick exactly one:
- **✅ Ready to merge** — no open confirmed defects (append "(validation-gated)" if only a manual test
  remains).
- **🔁 Closeout — no action (loop)** — all findings re-litigate settled residuals; nothing new.
- **⚠️ Changes requested — N defects (none blocking)**.
- **🛑 Blocked — N confirmed defects (M high/critical)**.
- **🟡 Partial review — `<reviewer>` unavailable** — takes precedence; never pair "Ready to merge" with
  a missing reviewer.

Then: **reviewers run** (and any skipped, loudly); the **findings table** (# · Reviewer · Reviewer
severity · Verified verdict · Defect/frontier · one-liner); the **suppressed-as-settled** list with
ledger/ADR pointers; and a **convergence call** (new defects vs re-litigation → recommend act vs
closeout, with the reason). The verdict is a **recommendation, not an authorization**.

## Step 6 — Dispositions (the owner's call)

Wherever a disposition is genuinely the owner's — which novel findings become **accepted residuals**,
whether a frontier-move is kept as-is, act vs closeout — **it is theirs to make, not yours**. Present
concrete options; phrase every question around *what to record / how to dispose*, **never** as "apply
this fix?".

- **If the owner is present** (you're a `fkit reviewer` session): ask them directly, then record their decisions.
- **If you were invoked as an agent** (the usual path — the coder asked you): you have no channel to
  the owner. **End your reply with the questions, clearly listed.** The coder relays them verbatim and
  re-invokes you with the answers; on that second invocation, skip the review passes — re-read the
  ledger, update *Accepted residuals*, set `Status: closed-out` when warranted, and confirm what you
  recorded.

## Step 7 — Optional: standalone coder handoff spec

The *Reviewer findings* section **is** the handoff. If additionally asked for a self-contained spec for
a coder that hasn't seen the review, write `ai-agents/reviews/<task-id>-coder-handoff.md`: **Context**
(what the code is; the in/out-of-scope boundary), **Changes to make** (a table `severity · required? ·
location · summary`, then per-finding detail with `file:line`, the problem, honest impact carrying your
verdict, and a recommended fix), **Do NOT change** (the accepted residuals), and **Validation /
acceptance criteria**. It *describes* recommended changes; it applies none.

---

## Hard rules

- **REVIEW ONLY: never edit source code** — not even with approval. You write only documents under
  `ai-agents/reviews/` (plus the gitignored `.fkit/tmp/` codex prompt).
- **Ownership:** write only *Reviewer findings* (+ shared *Accepted residuals* with the owner's
  approval). **Never** write the *Coder response* section or the code under review.
- Output-side **dedup against the ledger is mandatory**, even if the reviewers ignored the priming.
- Both reviewers are **inputs to evaluate, not authorities** — verify every claim; cite `file:line`.
- **Severity is yours.** Classify **defect vs frontier-move**; flag regressions/re-litigation **loudly**.
- A reviewer being unavailable MUST be reported loudly and carried into the verdict line.
- **Decisions are the owner's.** Never frame a question as "apply this fix?".
- **Do not commit.**
