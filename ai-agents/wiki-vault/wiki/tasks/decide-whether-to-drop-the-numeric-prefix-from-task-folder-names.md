# Decide whether to drop the numeric prefix from task-folder names

**Source**: `ai-agents/tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0102` · priority 103 · owner `fkit-architect`

## Goal

The owner observed (2026-07-21) that a task carries **two different numbers** — its **sprint priority** (`| 103 |`) and its **folder-ID prefix** (`0102-…`) — and they do not match. The suggestion: *"if the number in the folder name isn't super critical, remove it."*

The brief refused to treat that as settled. It framed the question as an architect investigation because the prefix is coupled in three places, and required the **cheaper alternatives** be surfaced and evaluated rather than the owner's framing rationalized.

> **The ruling, in one line:** **keep** the `<NNNN>-` prefix. Fix the confusion on the **priority** side instead — Option **C**, owner-ruled 2026-07-26.

## Key Changes

Evidence: `ai-agents/knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md`. **No ADR was written, and none was needed** — see below.

### The confusion is real, and was measured

- **A live integer collision on the same board.** `sprint-2.md` carries **priority 103 → folder `0102`** and **priority 104 → folder `0103`**, while folders `0103` and `0104` also exist as *different tasks*. A bare "103" is genuinely ambiguous.
- **A workaround notation was invented to cope** — an ad-hoc `priority (folderID)` form (`99 (0117)`, `107 (0124)`) that nobody mandated. **Cite it for the notation's existence, never for its magnitude:** the reported count of 33 reproduces only under a loose regex that sweeps in non-instances, and the true count is lower and unmeasured (residual R6).
- A third exhibit — *"104 (was `0103`)"* read as the confusion producing incorrect prose — **is disputed**: the same construction appears twice, which plausibly reads as deliberate *"was referred to as"* notation. **Do not cite it alone as proof of harm** (residual R3).

### The load-bearing discovery: ADR-029 Decision 6 never landed

[[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] Decision 6 says `dashboard.sh` would stop reverse-engineering an identifier out of the **Priority cell**. **It never did.** `dashboard.sh:519` still reads the id from the Priority cell; the folder name is consulted only as a fallback when that yields no digits.

The design report behind ADR-029 listed this as **site 5 of five** required changes and predicted it would fail **silently**. Verification found **no ruling to keep it** — site 5 is simply absent from the migration's plan, worklog, brief and review, and from its link-repair follow-up. It was dropped between design and plan. *Why it went unnoticed:* the coder fixed the **symptom** (fall back to the folder name rather than the filename stem) and the paper-over hid the gap.

**Consequence: the tooling still treats mutable board rank as the task's identity — that is the two-numbers problem expressed in code, and no folder rename touches it.**

### Why the prefix is not the cause

Dropping the prefix does not produce one number. `## ID` stays on all **152** briefs, the `103`/`0103` collision lives in prose and `## ID`, and the workaround notations are in sprint-plan prose — **all three survive the rename**. **Which number is the accident? The priority** — mutable board rank, re-ranked twice in a single day; the ID is permanent identity that must never move.

### What the prefix buys that `## ID` cannot

Four things: **sortability** (lexical sort = numeric sort), **collision visibility** to a human reading the tree, **the second carrier** ADR-029's `id-mismatch` drift check reconciles, and identity in every `ls`/path/href/grep hit without opening a file. Three of the four have **no replacement mechanism proposed anywhere**.

### Two of the brief's three "near-fatal" coupling points were overstated — and that is recorded, not suppressed

| Brief's claim | Actual |
|---|---|
| The folder name is the authoritative ID carrier | **Confirmed** (`dashboard.sh:630-646`) |
| `dashboard.sh` keys identity + link recovery on the folder name | **Overstated** — the folder is the *fallback* identity; link recovery works on an unprefixed still-unique name |
| Both movers grep `<NNNN>-<slug>` | **Overstated** — they grep the folder name as a token; an unprefixed slug is still unique across all 152 folders |

**Exactly one line actually breaks** on a prefix drop, plus the deliberate deletion of the `id-mismatch` check. **This finding weakens the case against the owner's own option and was published anyway.** What settles the question is cost plus causation, not coupling.

### Verification by execution, not reasoning

Four checks, all run against the live tree:

1. **Was the Decision-6 gap deliberate or unfinished? → Unfinished.** Decisive; independently re-verified in round 1.
2. **Does a prefix drop break `dashboard.sh`? → Yes, 130/130 rows.** The tree was copied to scratch, all 152 folders stripped, hrefs rewritten: **130 `id-mismatch` drift facts, one per board row.** *Incidental good news:* a **half**-executed rename fails **loudly** (130 `missing-brief` facts) — which lowers the risk of the option not chosen.
3. **Is a `P103` priority cell backward-compatible with the existing parser? → Yes.** `task_id()`'s `^[^0-9]*` clause absorbs the `P`. **No parser change is needed for the rendering half.**
4. **Do slug and ID uniqueness still hold? → Yes.** 152 folders, 0 duplicate slugs after stripping, 0 duplicate IDs — re-verified rather than inherited, since uniqueness is a property of the corpus, not a permanent truth.

### The cost of the option not chosen, priced

152 folder renames · ~416 tracked reference lines (281 non-wiki + 135 wiki) · 92 `NNNN` convention mentions in 36 files · ADR-029 Decision 5 reversed to a single carrier. Growth measured at four commits: **~10 folders and ~20 reference-lines per day**. That is **1.6× the folders and ~1.35× the tracked links of the migration it would partially undo** — a migration that is days old and **still `agent-closed — not owner-verified`**.

> **Cost alone never justifies keeping a wrong design.** It is decisive here only because the prefix is not the cause: paying 1.6× a migration to *not* fix the problem is the combination that settles it.

## Outcome

**Option C, owner-ruled 2026-07-26.** The owner answered the one question evidence could not settle — *is the objection functional or aesthetic?* — with **functional**, and accepted the two things C does not fix: folder paths stay long and numbered, and a task still has **two ID carriers** (ADR-029 Decision 8 working as designed).

- **ADR-029 Decision 5 is upheld, not amended.** The folder name stays authoritative; `id-mismatch` stays. **Option C needs no ADR** — it implements Decision 6 *as already written*.
- **Task `0103` is RESCOPED, not cancelled** — the outcome the brief anticipated as a cancellation trigger did **not** cancel it. Its scope: folder ID becomes the primary `tid` in `dashboard.sh`; the priority cell renders a non-integer rank token (`P103`); tests re-pointed; **the `fkit-status` narration contract at `SKILL.md:299-304` rewritten** (the single most missable item — it is prose, so nothing fails if it is missed); `test/dashboard-contract.test.js:1655-1664` **deliberately re-pointed** (it will go red, and that is the change working — do not "fix" it by reverting); **Option D label normalisation**; and **no folder renames, no href rewrites, no wiki churn**.
- **Option D was wrong in round 0 and is corrected.** Round 0 claimed *"every Task cell already renders the folder name"* and retired D as **disproved**. Measured: **45 of 130 rows (35%)** show the folder ID; **85 (65%)** show a legacy slug-only stem with the ID hidden in the href. **The single worst error in the report** — it turned a *partially built* option into a *failed* one. The owner ruled D a **live complement** to C and added label normalisation to 0103.
- **The convention page was deliberately NOT written**, and the owner **ratified** withholding it. A convention must be *"prescriptive and current"*; `P103` does not exist yet, so filing the rule now would put all 130 rows in violation on day one and assert as in-force something that is not. 0103 writes it in the same change that lands the rendering, with owner sign-off and dual-homed per `dual-home-parity.md`.

### Review, and the residuals recorded rather than repaired

Round 1: `fkit-reviewer` + Codex (`codex-cli 0.145.0`, both passes complete) — **⚠️ changes requested, 8 defects (2 high), none challenging the ruling.** Both load-bearing claims (the `task_id()` parser behaviour, the 130-row prefix-strip) were **reproduced by independent execution**. R1/R2/R5 repaired in place. Four findings were verified correct and **owner-ruled *record, do not repair*** — each weakens a *supporting exhibit* without touching a conclusion, and each carries a re-raise condition (R3, R6 above; **R4** — the brief required evaluating *"drop the sprint-priority number instead"* and the report **did not**, a genuine gap in required coverage disclosed rather than hidden, re-raise if `P<n>` proves unworkable; **R7** — the reference-line counts are **not reproducible as stated** because the report published counts without publishing the commands, though the 1.6×/1.35× ratios and the ~10-folders/day trend are unaffected).

**The report caught itself committing the exact conflation it documents** — calling the migration *"task 76"* by priority and its follow-up *"task 79"* by folder ID, where folder `0079`'s priority is 77 and a reader applying the first convention to the second name lands on an unrelated task. Corrected throughout and **recorded rather than quietly fixed**, since a report arguing two number-spaces are confusable is the last document that should confuse them.

### Still open after this task

- **The `P` token is untested in the movers' greps.** Step 3 verified `dashboard.sh` only; 0103 must verify `/fkit-task-done` and `/fkit-task-cancelled` against a `P103` cell before the rendering lands.
- **`P` is one candidate, not a ruling** — `#103`, `rank 103` and dropping the integer entirely were not compared on merits. 0103 may substitute an equivalent non-integer token.
- **ADR-029's Decision 6 currently overstates reality**, describing the Priority-cell simplification in the past tense. No correction was proposed (editing an accepted ADR is out of scope); task `0143`'s dated-correction-note form is the right vehicle if it is to be recorded before 0103 ships.
- **This report had no adversarial pass** at the time of writing, beyond round 1's Codex second opinion. The brief recommended one because the task could have reversed a recently-locked decision; the outcome **upholds** ADR-029, which lowers but does not remove the need.

## Related
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — Decision 5 upheld, Decision 6 found **never landed**; the ADR this weighed against
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — folder `0062` (priority 76), the migration a prefix drop would have partially undone at 1.6× its size, still agent-closed
- [[tasks/design-task-folder-structure-and-id-scheme]] — task 74, the design whose **site 5 of five** was dropped between design and plan
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — folder `0079` (priority 77), the link-repair follow-up whose artifacts were also searched for a Decision-6 ruling
- [[tasks/assert-task-ids-are-unique-in-the-test-suite]] — the duplicate-ID guard that would become the *only* collision detector if the prefix were dropped
- [[systems/testing-and-verification]] — `test/dashboard-contract.test.js`, which 0103 must deliberately re-point
- [[systems/fkit]] — the `ai-agents/` data model this decision leaves unchanged
- [[tasks/sprint-2-remove-omnigent]] — the sprint carrying this task
