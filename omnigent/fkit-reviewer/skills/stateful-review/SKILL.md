---
name: stateful-review
description: The reviewer's side of a stateful, loop-resistant review. Runs two independent reviewers on the diff (native Claude-side pass plus a Codex second opinion from the adversarial-reviewer sidekick), dedupes their findings against the shared review ledger so settled tradeoffs aren't re-litigated, verifies each against the code, and writes the Reviewer findings section of the shared two-party document at ai-agents/reviews/<task-id>.md that fkit-coder's process-stateful-review reads. REVIEW-ONLY — writes documents, never source code. Use when a review is tracked in that shared file.
---

# Stateful Review (reviewer side)

The **stateful** review. The source of truth is a shared document that **both** the reviewer (you) and
the coder edit: you write **findings** into it; the coder writes **verdicts, actions, and status** back
into it; the loop-prevention memory (accepted residuals) is shared. This is what lets a multi-round
review start from the decision state instead of re-deriving it blind, round after round.

> For a one-shot review with **no** persistent file, use **review** instead. This skill's whole point
> is the shared file — it reads and writes it every run.

> **⛔ REVIEW ONLY — this skill never edits source code, not even with approval.** Its deliverables are
> all documents: the consolidated **report**, the **Reviewer findings** rows + shared **Accepted
> residuals** it writes to the ledger, and an **optional handoff spec**. Applying a fix is a separate,
> coder-initiated step (the fkit-coder agent) — never a consequence of running this skill.

**Argument:** `$ARGUMENTS` — optional. May include the **task-id** (resolved by the canonical rule
below) and scope flags `--base <ref>`, `--scope <auto|working-tree|branch>`. Default: working tree /
`auto`.

**Task-id — resolve it the same way every time (the reviewer and coder MUST agree, or the ledger
forks and the loop-prevention memory is silently defeated):**
1. Explicit `$ARGUMENTS` task-id → use it verbatim.
2. Else the task file's **basename without extension** (`ai-agents/tasks/**/<task-id>.md` → `<task-id>`).
3. Else the current **git branch name**, slugified.
4. If none of these resolves **unambiguously** → **STOP and ask the owner.** Never invent one.

Create `ai-agents/reviews/<task-id>.md` only once the id is resolved by rule 1–3 or confirmed by the
owner — never auto-create a ledger from a guessed id.

---

## The shared review document — schema & ownership

`ai-agents/reviews/<task-id>.md` has three sections with **explicit ownership**. This schema is shared
with fkit-coder's `process-stateful-review` — **keep it exact** so the two agents interoperate.

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
  continuing from any existing rows) and the **Round** number for this pass.
- You **read** *Coder response* for context (what the coder already dispositioned); you **never** write
  or edit it. Its Status vocabulary — `pending approval` · `✅ done` · `won't fix (frontier)` ·
  `disproven` · `closeout (re-litigation)` · `blocked` — is the coder's to set.
- *Accepted residuals* is **shared**: you may add an entry (full What / Why / Re-raise structure) once
  the owner approves treating a finding as a settled tradeoff; never silently rewrite an existing one.

---

## Step 0 — Open (or create) the shared document

- Resolve the **task-id** by the canonical rule above (stop and ask if it doesn't resolve
  unambiguously) and the review **scope** (honor `--base` / `--scope`; default working tree).
- Read `ai-agents/reviews/<task-id>.md`. **If it doesn't exist — and only once the task-id is
  resolved, not guessed — create it** with the schema above (fill the header; leave the tables ready).
  Load the **Accepted residuals** and any existing *Reviewer findings* / *Coder response* rows into
  working memory.
- **Also load settled ADRs:** skim `ai-agents/knowledge-base/decisions/` for any ADR relevant to the
  scope. An ADR's **"Re-raise only if"** counts exactly like an accepted residual (ADRs live in
  knowledge-base, not the wiki, so you read them directly, same as you read `ai-agents/wiki-vault/`
  directly via your own `query` skill — per ADR-005 only wiki *writes* go through fkit-wiki).
- The **Round** for this pass = (highest Round already in *Reviewer findings*) + 1, or `1` if fresh.

---

## Step 1 — Run two independent reviewers (degrade gracefully)

Same as the `review` skill's Step 1:
- **A) Claude-side (native):** your own thorough pass over the diff/scope — read the changed code and
  enough surrounding context to trace the full flow.
- **B) Adversarial second opinion (delegate to your sidekick, best-effort):** follow the exact
  **spawn + inbox** protocol from "Consulting other agents — how" — do not shortcut it by folding the
  question into `sys_session_create`'s optional `message` field; use the separate `sys_session_send`
  call, since that is what registers the wait/wake:
  1. `sys_session_create(config_path=".fkit/agents/fkit-adversarial-reviewer",
     title="adversarial-reviewer-consult")` — the **fixed** title (ADR-004): reuse it across every
     review in this session rather than a fresh per-diff title.
  2. `sys_session_send(session_id=<the id from step 1>, args="<the diff/scope, and any focus area>")`.
  3. **End your turn.** Expect several minutes. When your inbox wakes you, `sys_read_inbox()` once and
     capture its findings — findings only (`file:line`, problem, severity) and never edits. If the
     wake is only an intermediate status, end your turn again and keep waiting for its FINAL findings.

**Priming (best-effort):** include the *Accepted residuals* as context to each reviewer ("these
tradeoffs are already settled — don't re-raise unless `<re-raise condition>`"). Reviewers may ignore
it; the Step 2 output-side dedup is the real guarantee.

**Graceful degradation (mandatory):** if the adversarial-reviewer sidekick is unavailable/unauthed/errors,
record "Codex reviewer unavailable: `<reason>`" and continue Claude-only — flag the partial coverage
loudly and carry it into the verdict line. Never present a one-reviewer run as complete.

---

## Step 2 — Merge + dedupe (the reliable filter)

- **Between reviewers:** collapse Claude-side and Codex-side findings describing the same issue; keep
  the stronger articulation; mark "raised by both" (higher signal).
- **Against prior rounds:** drop findings already recorded in *Reviewer findings* from an earlier round
  unless materially new.
- **Against settled decisions:** for each finding, check *Accepted residuals* **and the ADRs loaded in
  Step 0**. If it matches one whose **"Re-raise only if"** condition is **not** met → move it to a
  visible **"Re-litigates settled decisions (suppressed)"** list with a pointer to the residual or ADR.
  Do **not** drop it silently — show what was suppressed and why.
- Output: the list of **novel** findings + the visible suppressed list.

---

## Step 3 — Verify each novel finding against the code

For each novel finding, **read the actual code** with enough context to trace the full flow. Assign a
**verified verdict** (`CORRECT` / `PARTIALLY CORRECT` / `INCORRECT (disproven)` / `INCOMPLETE`) and
**your own severity** (from the blast radius you traced — never inherit the reviewer's label). Classify
each as **Defect** vs **Frontier-move**. **Regression check:** using the *Coder response* history, would
a finding's recommended fix cause a regression or recreate a condition a prior finding flagged? If so,
flag it **loudly, up front**.

---

## Step 4 — Write the Reviewer findings rows

Append one row per **novel** finding to the *Reviewer findings* section: id (`R<next>`), the current
**Round**, **Sev** (your assigned severity), `file:line`, and a one-line **Claim**. Disproven findings
(`INCORRECT`) need not be recorded as findings — but note them in the report so the coder isn't asked to
chase them. This is a **docs-only** write: it changes no code, and it never touches *Coder response*.

These rows are exactly what fkit-coder's `process-stateful-review` consumes as its input.

---

## Step 5 — Consolidated report + convergence call

**Lead with a one-line decision verdict** on the 2nd–3rd line, directly under the title. Pick exactly
one:
- **✅ Ready to merge** — no open confirmed defects (append "(validation-gated)" if only a manual test
  remains).
- **🔁 Closeout — no action (loop)** — all findings re-litigate settled residuals; nothing genuinely
  new.
- **⚠️ Changes requested — N defects (none blocking)** — confirmed medium/low defects; not blocking.
- **🛑 Blocked — N confirmed defects (M high/critical)** — at least one confirmed high/critical defect
  open.
- **🟡 Partial review — `<reviewer>` unavailable** — takes precedence; never pair "Ready to merge" with
  a missing reviewer.

Then present: **reviewers run** (and any skipped, loudly); a **findings table** (# · Reviewer · Reviewer
severity · Verified verdict · Defect/frontier · one-liner); the **suppressed-as-settled** list with
ledger pointers; and a **convergence call** (new defects vs re-litigation → recommend act vs closeout,
with the reason). The verdict is a **recommendation, not an authorization** — you change no code and do
not merge.

---

## Step 6 — Record shared residuals (ask first — don't auto-record)

**Pause and ask the owner** wherever a disposition is genuinely their call — which novel findings should
become **accepted residuals**, whether a frontier-move is kept-as-is, act vs closeout. Present concrete
options; phrase every question around *what to record / how to dispose*, **never** as "apply this fix?".

Once the owner decides, update *Accepted residuals* (add newly-settled tradeoffs with their structural
*Why* and *Re-raise only if*). If nothing actionable remains open and the coder has responded, set the
document header **Status: closed-out**. This is a docs-only update — it does not touch the code under
review, and you never write the *Coder response* section (that's the coder's).

---

## Step 7 — Optional: standalone coder handoff spec

The *Reviewer findings* section you wrote **is** the handoff — fkit-coder's `process-stateful-review`
reads it directly. If the owner additionally wants a self-contained spec for a coder that hasn't seen
the review, write one to `ai-agents/reviews/<task-id>-coder-handoff.md`: **Context** (what the code is,
in/out-of-scope boundary), **Changes to make** (a table `severity · required? · location · summary`,
then per-finding detail with `file:line`, the problem, honest impact carrying forward your verdict, and
a recommended fix), **Do NOT change** (the accepted residuals), and **Validation / acceptance criteria**.
This stays **REVIEW-ONLY**: the file *describes* recommended changes; it applies none, and does not
launch the coder.

---

## Hard rules

- **REVIEW ONLY: never edit source code** — not even with approval. You write only documents (the
  ledger rows in Steps 4/6, the optional handoff in Step 7).
- **Ownership:** write only *Reviewer findings* (+ shared *Accepted residuals* with approval). **Never**
  write the *Coder response* section or the code under review.
- Output-side **dedup against the ledger is mandatory**, even if the reviewers ignored the priming.
- Both reviewers are **inputs to evaluate, not authorities** — verify every claim against the code; cite
  `file:line`. An automated reviewer is not more authoritative.
- **Severity is yours** — trace the full-flow blast radius; never inherit the reviewer's label. Classify
  **defect vs frontier-move**; flag any regression or re-litigation **loudly, up front**.
- A reviewer being unavailable MUST be reported loudly and carried into the verdict line.
- **Decisions are the owner's — ask interactively** where a disposition is their call; never frame a
  question as "apply this fix?".
- The report **leads with the one-line decision verdict**; it is a recommendation, not a merge/apply
  authorization.
- **Do not commit.**
