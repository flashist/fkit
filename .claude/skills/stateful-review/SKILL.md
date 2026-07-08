---
name: stateful-review
description: "Run both Claude's code review and Codex's adversarial review on the current diff, dedupe their findings against the task's review ledger (so settled tradeoffs aren't re-litigated), then route only novel findings through process-review and record the outcome. Use for a thorough, loop-resistant review."
user-invocable: true
---
<!-- fkit:generated source=stateful-review version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# Stateful Review

A thorough, **ledger-aware** review: run both reviewers, merge + dedupe their findings against the accepted residuals already recorded for this task, then evaluate and record — without re-litigating decisions that were already made. This is the orchestration layer; the per-finding evaluation and the gate-on-approval discipline are reused from `process-review`, not reimplemented.

> **⛔ REVIEW ONLY — this skill never edits source code.** Its deliverables are all **documents**: the consolidated **report** (Step 4), the **ledger recording** (Step 5 — under `ai-agents/reviews/`), and an **optional coder-agent handoff file** (Step 6 — a fix *spec*, on request). It does **not** patch, fix, or modify any code under review — **not even with your approval**, because applying a fix is **out of scope** for this skill.
>
> - Both reviewers run **review-only** (read-only); the `code-reviewer` agent must be pinned to make no edits.
> - Findings are **inputs to evaluate, not a to-do list to apply.**
> - Applying a fix is a **separate step you initiate afterward** (e.g. via `process-review`, a coder-agent, or a direct request) — never an automatic or implied consequence of running this skill.
> - When presenting the report, do **not** tee up "apply this fix?" as the next action. The next action is recording the outcome to the ledger; any code change is a new, user-initiated task.
> - The optional **coder handoff file (Step 6) is a spec, not an applied fix** — it *describes* recommended changes for a separate coder-agent to implement; writing it changes no code under review.

Arguments: `$ARGUMENTS` — optional. May include a task-id, a PR number, and/or scope flags: `--base <ref>`, `--scope <auto|working-tree|branch>`. Default: working-tree / `auto`.

---

## Step 0 — Resolve target + load the ledger

- Determine the **task-id** under review (from `$ARGUMENTS`, the current branch name, or by asking).
- Read `ai-agents/reviews/<task-id>.md` if it exists → load its **Accepted residuals** list (see `ai-agents/reviews/README.md` for the schema). If there's no ledger, this is a fresh review — say so.
- Determine review scope: default working-tree / `auto`; honor `--base` / `--scope` from `$ARGUMENTS`.

---

## Step 1 — Run both reviewers (concurrently; degrade gracefully)

Run both reviewers on the same scope, in parallel where practical (e.g. launch Codex as a background Bash task and the `code-reviewer` agent at the same time, then collect both):

**A) Claude review** — launch the `code-reviewer` agent on the diff/scope and capture its findings. **Instruct it explicitly to run review-only: return findings, make no edits, run no fixes** (the agent has edit tools — pin it to review-only so generation can never quietly change code). Reliably invocable; this is the **default** Claude-side reviewer, and the one that fits this skill's orchestration model — it returns findings as an isolated tool result (clean input for the Step 2 dedup) and honors the `--base`/`--scope` threading below via its prompt.

> **Sanctioned alternative — `/code-review high`.** For a deeper Claude-side pass you may substitute `/code-review high`: it fans out multiple parallel reviewers for broader recall, and Step 3's per-finding verification filters the extra false positives that `high` may surface. Constraints when substituting:
> - Use **`high`, never `ultra`** — `ultra` is a billed cloud run that is **not** self-invocable (you cannot launch it; it is user-triggered).
> - **Never pass `--fix` or `--comment`** — both break the REVIEW-ONLY rule (`--fix` mutates the working tree, `--comment` posts to the PR).
> - Accept the tradeoffs: it runs **inline in the main conversation** (no isolated data-return) and reviews its **own default diff** (the `--base`/`--scope` threading does not apply), so prefer the agent when precise scope control or clean orchestration matters.

**B) Codex adversarial review** — run the plugin companion directly with an explicit mode flag (so the slash-command wrapper's interactive "wait or background?" prompt never fires — that `AskUserQuestion` only appears when **no** mode flag is passed). Resolve the plugin root by glob (version-independent):

```bash
COMPANION=$(ls -d ~/.claude/plugins/cache/openai-codex/codex/*/scripts/codex-companion.mjs 2>/dev/null | sort -V | tail -1)
```

> **⚠️ How to run it without stalling it — read before launching.** For `adversarial-review` the companion's `--background` flag is a **no-op**: `handleReviewCommand` always runs in the **foreground** (only the unrelated `task` subcommand truly detaches). Its `verifying` phase routinely runs **3–6 min — longer for bigger diffs** — and there is **no PID/heartbeat tracking**, so if the launching process is killed before the run finishes, the job is orphaned and left displayed as `running / verifying` **forever** (a zombie that looks like a "stall"). The classic trip-wire: launching it as an ordinary Bash call whose **default 2-minute timeout SIGTERMs it mid-run**. Do **NOT** trust the companion `--background` flag + `result <job-id>` to detach — that runs foreground and gets killed. Pick ONE of these instead:
>
> - **Preferred — detach at the harness level** (this is what actually backgrounds it, and lets the `code-reviewer` agent run concurrently): launch via the **Bash tool with `run_in_background: true`**, so the harness owns the lifecycle and notifies you on exit. Pass `--wait` (foreground *inside* the detached task), then collect the findings from that task's output on completion (or poll `node "$COMPANION" status` / read the job log).
>   ```bash
>   node "$COMPANION" adversarial-review --wait --base <ref> --scope <auto|working-tree|branch>
>   ```
> - **Or — foreground with a long explicit timeout**: run the same command in a normal Bash call but set the tool `timeout` near its **600000 ms (10 min) max**, never the 2-min default, so the `verifying` phase can finish.
>
> Either way, if a job is ever left in a stale `running` state, **cancel it** (`node "$COMPANION" cancel <job-id>`) — there is no auto-reaper. And when collecting, note that `result` returns the **latest finished** job when the id isn't matched, so verify the job id / session before trusting a result (a stalled current run can otherwise surface a previous run's findings).

Return is Codex's verbatim findings.

> Caution: the subcommands have **no `--help`** — any unrecognized argument is treated as review *focus text* and **launches a real, billed Codex run**. Never "probe" `adversarial-review`. Only the top-level `node "$COMPANION" --help` is safe. If a run is started by accident, cancel it with `node "$COMPANION" cancel`.

**Graceful degradation (mandatory):** if the Codex call fails (CLI missing, not authed, error exit), do **not** fail the whole review. Record "Codex reviewer unavailable: `<reason>`" and continue with Claude-only — but flag the partial coverage loudly in the report. Never present a one-reviewer run as a full review.

**Priming (best-effort):** when invoking each reviewer, include the Accepted residuals as context ("these tradeoffs are already settled — don't re-raise unless `<re-raise condition>`"). External reviewers may ignore this; the Step 2 output-side dedup is the actual guarantee.

---

## Step 2 — Merge + dedupe (the reliable filter)

- **Between reviewers:** collapse findings from Claude and Codex that describe the same issue (same file/line/claim). Keep the stronger articulation; mark "raised by both" (higher signal).
- **Against the ledger:** for each finding, check the Accepted residuals. If it matches one whose **"Re-raise only if"** condition is **not** met → move it to a **"Re-litigates settled decisions (suppressed)"** list with a one-line pointer to the ledger entry. Do **not** drop silently — show what was suppressed and why.
- Output: a list of **novel** findings (genuinely new) + the visible suppressed list.

---

## Step 3 — Evaluate the novel findings via process-review

Hand the novel, deduped findings to the `process-review` flow: classify **defect vs frontier-move**, verify each against the actual code, assign verdicts, and flag any regression/oscillation **loudly and up front**. Reuse `process-review`'s **evaluation** logic — do not re-implement it.

**Borrow only the evaluation, not any apply step.** Within this skill the output is verdicts, never edits. `process-review`'s approval gate exists to stop *unapproved* code changes; here the bar is stricter and absolute — **no code is changed at all, regardless of approval.** A confirmed defect becomes a recommendation in the report, not a patch.

---

## Step 4 — Consolidated report

**Lead with a one-line decision verdict.** The report MUST open with its title, then the verdict on the **2nd–3rd line** (directly under the title) so it's the first thing read — an at-a-glance call based on the reviewers' findings:

```
# Stateful Review — <task-id> (<scope>)

**Decision: 🛑 Blocked — 2 confirmed defects (1 high)**
```

Pick **exactly one** verdict, derived from the Step 2/3 outcome:
- **✅ Ready to merge** — no open confirmed defects; every finding is clean, an accepted residual, or suppressed re-litigation. Append **"(validation-gated)"** when an on-box/manual test is the only remaining gate.
- **🔁 Closeout — no action (loop)** — all findings re-litigate settled residuals; nothing genuinely new. (A ready-to-merge flavor that explicitly names the stopped loop.)
- **⚠️ Changes requested — N defects (none blocking)** — confirmed medium/low defects exist; fixing is recommended but not strictly merge-blocking.
- **🛑 Blocked — N confirmed defects (M high/critical)** — at least one confirmed high/critical defect is open; must fix before merge.
- **🟡 Partial review — `<reviewer>` unavailable** — a reviewer failed/was skipped, so coverage is incomplete. This caveat **takes precedence** in the verdict line: never pair a clean "Ready to merge" with a missing reviewer (e.g. `🟡 Partial — Codex unavailable; Claude-only: ready to merge`).

The verdict is the reviewers' **recommendation, not an authorization** — this skill changes no code and does not merge. The next action is still Step 5 (record to the ledger); any fix/merge is a separate, user-initiated step.

Then present, in one place:
- **Reviewers run** — and any that were unavailable/skipped (loudly).
- **Findings table** — a markdown table with **exactly these columns, in this order**:
  - **#** — the finding's id (a stable short handle, e.g. `C1`, `A`, `Cl3` — used to refer to it in the convergence call, the ledger, and any handoff).
  - **Reviewer** — which reviewer surfaced it: `Claude`, `Codex`, `both` (raised by both — higher signal), or a mixed form like `Claude + partially Codex` when one articulated it and the other touched part of it.
  - **Reviewer severity** — the severity **as the reviewer rated it** (`low`, `med`, `low/med`, `high`, `critical`, etc.) — i.e. the raw, pre-verification claim.
  - **Verified verdict** — the **correctness of the finding after you verified it against the code** (e.g. `CORRECT`, `PARTIALLY CORRECT`, `INCORRECT (disproven)`, `INCOMPLETE`), with any severity change you applied noted inline (e.g. `CORRECT → medium`).
  - **Defect / frontier-move** — the classification: a genuine `Defect` vs an intentional `Frontier-move`/tradeoff (or `—` for a disproven/non-defect item).
  - **One-liner** — a one-sentence description of the finding.
- **Suppressed as settled** — each with its ledger pointer.
- **Convergence call** — are these new defects, or re-litigation of settled tradeoffs? Recommend **act** vs **closeout**, with the reason. Don't wait for the user to spot a loop. (The one-line verdict above is the compressed form of this call — keep them consistent.)

---

## Step 5 — Record to the ledger

**This skill writes only documents — the ledger here, never source code.**

**First, pause and ask — don't auto-record.** Wherever a finding's disposition is genuinely the user's call — defect vs intentional tradeoff, which verdicts stand, which novel findings become accepted residuals, act vs close-out — put those choices to the user **interactively** (use `AskUserQuestion` with concrete options) rather than guessing or silently recording. Phrase every question around *what to record / how to dispose*, **never** as "apply this fix?". (Step 4 ends in a report and a recommendation; it does not authorize a write — this pause is the gate.)

**Then, once the user has decided,** update `ai-agents/reviews/<task-id>.md` (Decision-log rows + any newly-accepted residuals with their structural *why* and *re-raise only if*), per `process-review` Step 5 and the reviews README. Create the ledger if it didn't exist. This is a docs-only update; it does not touch the code under review.

---

## Step 6 — Optional: coder-agent handoff file

If the user wants to route the confirmed findings to a separate coder-agent for implementation, produce a **handoff spec** and save it to a file (default `ai-agents/reviews/<task-id>-coder-handoff.md`). This stays **REVIEW ONLY**: the file *describes* recommended fixes; it does not apply them, writes no change to the code under review, and does not invoke the coder-agent itself.

**Settle the shaping choices interactively first** (`AskUserQuestion`, concrete options) — e.g.:
- **Per-finding disposition** where it's the user's call (e.g. is an intentional tradeoff kept-with-comment, or actually changed?).
- **Scope** — which findings go in (code under review only, or also tooling/doc findings?).
- **Format / destination** — write to a file (and where) vs inline only.

Make the file **self-contained for an agent that hasn't seen the review**:
- **Context** — what the code is, and the in/out-of-scope boundary.
- **Changes to make** — a table (`severity · required? · location · summary`), then per-finding detail with `file:line`, the problem, **honest impact** (don't over-state — carry forward the Step 3 verdict, including where a reviewer over-rated severity), and a concrete recommended fix.
- **Do NOT change** — the accepted residuals, so the coder doesn't reintroduce settled churn.
- **Validation + acceptance criteria** — how to sanity-check, plus any test-harness caveats.

Findings remain **recommendations**: the coder-agent is a separate, user-initiated run that decides and implements; this skill neither edits the reviewed code nor launches the coder.

---

## Hard rules

- **REVIEW ONLY: this skill never edits source code** — not even with approval. It writes only documents (the ledger in Step 5, the optional handoff in Step 6). Applying a fix is a separate, user-initiated step *after* this skill finishes.
- **Decisions are the user's — ask interactively.** Where a finding's disposition (defect vs intentional tradeoff, what to record, handoff scope/format) is genuinely the user's call, use `AskUserQuestion` with concrete options; never silently decide, and never frame the question as "apply this fix?".
- The **optional coder handoff (Step 6) is a spec, not an applied fix** — it documents recommendations for a separate coder-agent; producing it changes no code under review.
- The Step 4 report MUST **lead with a one-line decision verdict** (Ready to merge / Closeout / Changes requested / Blocked / Partial) on the 2nd–3rd line, directly under the title — derived from the findings, and consistent with the convergence call. It's a recommendation, not a merge/apply authorization.
- A reviewer being unavailable MUST be reported loudly; never present a partial review as complete (and the verdict line must carry the Partial caveat).
- Output-side dedup against the ledger is mandatory even if the reviewers ignored the priming.
- Do not duplicate `process-review`'s evaluation logic — invoke it on the novel findings.
- Both reviewers are **inputs to evaluate, not authorities** — verify every claim against the code (per CLAUDE.md Review Notes).
