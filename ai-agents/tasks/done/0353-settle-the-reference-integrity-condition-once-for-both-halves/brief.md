# Settle the reference-integrity condition, once — the exact scanned set, exemption set and match rule, for BOTH the markdown-link half and the `path:NNN` half

## ID
0353

## Sprint
Sprint 7

## Priority
P3

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

### ⭐ This is an INVESTIGATION. It produces a written condition, not a test and not a cleanup.

**Three tasks are blocked on one unanswered question**, and this task is the answer to it:
[`0354`](../../done/0354-build-the-link-resolution-guard/brief.md) builds the guard,
[`0355`](../../cancelled/0355-clean-the-in-scope-broken-link-red-set/brief.md) cleans the red set that makes the
guard green, and [`0237`](../../backlog/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md)
already carries the same question in its own step 3 and has carried it, unanswered, since 2026-08-06.
⛔ **None of them may start until this lands** — building a guard against an unsettled condition is
how the project got here.

### The question is genuinely open, and it has been open twice already

**Half one — the `path:NNN` citation half.** `0176` made **four scoping decisions** and they are
already written down: the defensible-core scanned set (`ai-agents/tasks/*/*/*.md` +
`ai-agents/sprints/*.md`), skip fenced blocks and blockquote lines, a **literal** full-path reading,
and the closed-`done/*/review.md` exemption ruled by the owner on 2026-08-01. ⭐ **Those four are
owner-ruled or owner-accepted and this task does NOT reopen them.** It **reconciles** against them.

**But `0176`'s scanned set moved out from under it.** Its residual list names
`ai-agents/sprints/sprint-2.md`; the Sprint 2 → Sprint 3 rollover archived that board to
`ai-agents/sprints/done/sprint-2.md`, **outside the `sprints/*.md` glob**. `0237` step 3 was tasked
with settling whether the condition reaches `ai-agents/sprints/done/*.md` and
`ai-agents/sprints/reviews/*.md`. ⚠️ **It has not been settled.** `0237`'s own brief says so:
*"Two defensible answers; the wrong outcome is not choosing."*

**Half two — the markdown-link half.** Nothing has ever settled this one. A markdown link
`[label](relative/path.md)` whose target does not exist on disk is a different defect from a
`path:NNN` that points at the wrong line, but it has **the same scanned set, the same exemption
questions, and the same frozen-record edges**. Settling them separately guarantees they diverge.

### Measured 2026-08-29, for this brief — and the numbers show why the condition is the whole game

Markdown-link resolution over `ai-agents/**/*.md` — relative targets only; `http(s)`, `mailto:` and
bare `#anchor` skipped; fragment stripped before resolving. **Two matchers, differing in one thing
only: whether fenced blocks and inline code spans are skipped.**

| Matcher | Exemptions | Broken instances | Distinct files |
|---|---|---|---|
| **Naive** — code spans and fences **counted** | none | **304** | **96** |
| **Naive** | `tasks/done/`, `tasks/cancelled/`, `wiki-vault/`, `sprints/done/` | **64** | **22** |
| ⭐ **Convention-correct** — fences and inline code spans **skipped** | none | **60** | **26** |
| ⭐ **Convention-correct** | `tasks/done/`, `tasks/cancelled/`, `wiki-vault/`, `sprints/done/` | ⭐ **24** | ⭐ **11** |
| ⭐ **Convention-correct** | …and `knowledge-base/reports/` too | **17** | — |

⛔ **READ THE TWO VARIABLES SEPARATELY — THEY ARE THE WHOLE FINDING.**

1. **Skipping code spans and fences takes the set from 304 to 60 — a factor of five — on its own.**
   ⭐ **And that convention is ALREADY RULED:** `0176` scoping decision 2 prescribes *"skip fenced
   blocks and blockquote lines"*, adopted *"for correctness of meaning"*. Most of the 244 difference is
   quoted marker text — things like the `➡️ Moved to [Sprint 6](done/sprint-6.md)` examples this repo's
   own boards carry inside backticks to **document** the marker form. ⛔ **Those are not links and
   flagging them would punish the documents that define the convention** — `0176` decision 2's exact
   stated reason.
   ⚠️ **`0176`'s convention names fences and blockquotes; it does NOT name inline code spans.** The
   measurement above skips code spans too. ⛔ **That gap is yours to rule on** — it is the single
   largest lever on the number.
2. **The exemption set then takes 60 to 24, and to 17 if reports are also exempt.**
   **34 of the 60 sit under `ai-agents/tasks/done/`** — frozen closed folders, which
   [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)
   says are not to be edited. Others sit under `ai-agents/wiki-vault/`, which
   [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
   puts out of every role's reach but `fkit-wiki`'s.

⭐ **Between them the two variables move the red set from 304 to 17 — a factor of eighteen. That is
this task's entire justification**, and it is why the condition must be settled before anyone builds a
guard or cleans a file against it.

⛔ **These figures are dated 2026-08-29 and each came from one particular matcher. Re-measure under
your own settled condition; do not inherit them**
([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)).

## What to build

**One written condition document**, saved under `ai-agents/knowledge-base/reports/` with a dated
filename. ⛔ **Not the wiki** — reports go to `knowledge-base/`
([`one-skill-one-output`](../../../knowledge-base/conventions/one-skill-one-output.md), ADR-005).

**It must state, as runnable commands and not as prose, and separately for each of the two halves:**

### 1. The scanned set
The exact glob(s). It must rule explicitly on each of these, with a reason:

- `ai-agents/sprints/done/*.md` — archived boards. (`0237` step 3's open question.)
- `ai-agents/sprints/reviews/*.md` — sprint-keyed review ledgers. (Same question.)
- `ai-agents/knowledge-base/reports/` — ⚠️ `0176` decision 1 says **do not widen to reports** for the
  `path:NNN` half, because `0160`'s own report cites a coordination document **as the specimen it is
  diagnosing**. Rule on whether the same carve-out applies to the **markdown-link** half, where that
  rationale does not obviously transfer.
- `ai-agents/knowledge-base/decisions/` and `conventions/`.
- `claude/` and `test/` — ⚠️ `0176`'s third dated note records three real stale citations that live
  **there**, and flags that `0176`'s condition would not reach them. Rule on the reach; ⛔ do not
  quietly widen `0176`.

### 2. The exemption set
Ruled individually, each with the authority that grants it:

- **Frozen closed task folders** — `ai-agents/tasks/done/**` and `ai-agents/tasks/cancelled/**`
  (ADR-034). ⚠️ `0176`'s owner ruling exempts `done/*/review.md` **by name and only that** —
  *"`done/*/brief.md` and `done/*/worklog.md` are NOT exempt."* **Say whether the link half inherits
  that narrow shape or takes the whole folder**, and if they differ, say why that is acceptable.
- **`ai-agents/wiki-vault/**`** (ADR-005) — out of reach of every role but `fkit-wiki`, so a guard
  that reddens on it is a guard nobody may make green.
- **Archived sprint boards**, if (1) put them in scope.

### 3. The match rule
Per half:

- **Link half:** what counts as a link, how a `#fragment` is treated, whether an anchor that does not
  exist inside a resolvable file is a failure, how `http(s)`/`mailto:` are skipped, and whether links
  inside fenced blocks and blockquotes are skipped (`0176` decision 2's convention — state whether it
  carries over).
- **Citation half:** reconcile against `0176`'s four decisions **verbatim**, and record the
  `sprints/done/` answer that `0237` step 3 is waiting on.

### 4. The reconciliation table
⭐ **Mandatory.** A table with one row per `0176` scoping decision and per `0237` open question,
saying for each: **unchanged / narrowed / widened / answered**, and the authority. ⛔ **A condition
document that silently changes one of `0176`'s owner-ruled decisions has failed this task.**

### 5. The measured red set under the settled condition
Both halves, instances and distinct files, dated, with the command that produced them.

⛔ **Constraints:**

- **⛔ Write no test file.** That is `0354`.
- **⛔ Clean no citation and no link.** That is `0355` and `0237`.
- **⛔ Do not reopen `0176`'s two owner rulings** (the literal reading; the closed-ledger exemption).
  They are the owner's, given 2026-08-01. Reconcile, do not re-decide.
- **⛔ Do not fold in the shorthand extension.** `0176` refuses to absorb it by name; so does this.
- **⛔ Do not write `ai-agents/wiki-vault/`** (ADR-005).
- **⛔ No `path:NNN` citations in this task's own artifacts** — a document defining the rule must not
  ship carrying the violation.

## Verification steps

1. The condition document exists under `ai-agents/knowledge-base/reports/` with a dated filename, and
   nothing was written to `ai-agents/wiki-vault/` — `git diff --stat` proves both.
2. **Every glob and exemption is a runnable command in the document**, and running it reproduces the
   figures the document reports. Paste the command and its output; do not describe them.
3. The reconciliation table exists, has a row for **each of `0176`'s four scoping decisions** and for
   **`0237`'s step-3 scanned-set question**, and each row carries a verdict and an authority.
4. `git diff` shows `ai-agents/tasks/backlog/0176-*/brief.md` and `0237-*/brief.md` **unchanged** —
   this task reads them, it does not edit them.
5. The `sprints/done/` and `sprints/reviews/` question has an explicit **answer**, not a
   "both are defensible". Grep the document for the decision sentence.
6. Both halves' red sets are reported with instance **and** file counts, dated, against the three
   readings tabulated in §Context — say which of the three the settled condition matches, or that it
   matches none and why.
7. `npm test` green (this touches no code). Report the counts.

## Notes

- **Depends on:** nothing.
- **Blocks:** `0354`, `0237` — both hard. `0237` has carried this question unanswered
  since 2026-08-06; this task discharges it. ⛔ **`0176` is blocked transitively**, through `0237`.
  ⚠️ **Corrected 2026-08-30: this line read *"`0354`, `0355`, `0237` — all three hard"* and `0355` is
  no longer among them.** `0355` was **cancelled** on 2026-08-30 (owner ruling *"Cancel it (Rec)"*)
  once this task's settled condition measured its red set at **0**; its folder is at
  `ai-agents/tasks/cancelled/0355-clean-the-in-scope-broken-link-red-set/`. **This task blocks two rows
  hard, not three.**
- ⚠️ **This task does not close `0237` or change its status.** It answers `0237`'s step 3 so `0237`
  can run. `0237` still does the cleanup. Closes are the producer's act (ADR-033).
- ⚠️ **The three figures in §Context are one naive matcher's output, not a specification.** They are
  evidence that the condition is load-bearing, not a target to hit.
- **Priority `P3` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner ruling *"Approve all 12 as proposed (Rec)"*, 2026-08-29,
  `AskUserQuestion`, live `fkit lead` session.
</content>
