# Plan — task 0167

> **Provenance.** Produced by a spawned `@fkit-coder` running `/fkit-plan-task` under
> `fkit-sprint-ship-loop` (live `fkit lead` driver session), and **approved by the owner via
> `AskUserQuestion` on 2026-08-04**. Copied here verbatim by the driver at the moment of approval,
> before the Build spawn (ADR-020; `fkit-sprint-ship-loop` §*Durable artifacts*).
>
> **Owner's approval selected "Approve as planned"** — the coder's two judgment calls (plain dated
> filename over the `eval-` prefix; flat *Answer / Evidence / Limits* shape for Q1–Q2) **stand**.
>
> ⚠️ **Honest limit, per the loop's honesty clause.** Approval leaves no artifact of its own
> (ADR-021). This file pins *which bytes were carried*, not *which bytes were approved*. The
> `carried-not-approved` class is **not** closed by this write — it is narrowed to one copy inside
> one session, with no spawn boundary in the middle.

## Summary — read this first

- **Plan is ready.** Work is a ruling report by `@fkit-architect`, no code, no SKILL edits.
- **⚠️ One of the brief's substantive claims is now FALSE.** The brief says `fkit-sprint-ship-loop/SKILL.md` has **"no such section at all"** for durable state. It **now has one** — `## Durable artifacts`. The brief's *deeper* claim survives (no re-derive-on-resume rule, no fail-safe); the *blanket* one does not. The architect must not quote it verbatim. This **sharpens** question 4 rather than dissolving it.
- **⚠️ Nearly every line-pinned coordinate in the brief has shifted** — the sprint loop grew 255 → 296 lines. Full corrected table in §0. The two `0111` review pins are the only ones that still hold.
- **⚠️ Prior art the brief missed, and a scope hazard inside it:** the exit table's `Blocked — hand-off didn't land` row **already contains a bounded "re-spawn `@fkit-producer` once"**. That is the closest existing thing to a dead-worker rule *and* it is a one-shot retry — sitting directly against the brief's ⛔ retry-policy exclusion. The architect must reconcile it without generalizing it.
- **`0160` has LANDED** (`✅ Done`, agent-closed). The brief's conditional fires: its citation form now **binds** this report.
- **The gap itself is confirmed still open** — zero abnormal-termination language in either loop.
- Instance 1 (`0118`) has **no on-disk corroboration** — folder holds only `brief.md` + `review.md`, no worklog. The brief's own warning stands and hardens.

---

## 0. Coordinate re-verification (done at plan time; the architect inherits the corrected set)

The brief warned its citations decay. They did. Verified against the current working tree:

| Brief's citation | Claimed | Actual now | Verdict |
|---|---|---|---|
| `fkit-sprint-ship-loop/SKILL.md` whole file | 255 lines | **296 lines** | shifted |
| …exit table §*Stop conditions* `:204-214` | rows | heading **`:243`**, rows **`:247-255`** | shifted ≈ +43 |
| …`:216-217` *"no path ends in silence"* | invariant | **`:257`** | shifted |
| …`:95-97` *"Mark the task `🔄 In progress` first"* | §2 | **`:112`** | shifted |
| …`:102`, `:105` worklog in Build / Process-review rows | drive table | **`:121`, `:124`** | shifted |
| …`:226-230` §*Progress reporting* | section | **`:266`** (+ `:267`) | shifted |
| `fkit-task-ship-loop/SKILL.md:87-109` §*Durable state* | section | heading **`:92`**, section **`:92-116`** | shifted +5 |
| …`:108-109` *"Fail-safe on resume"* quote | quote | **`:113-114`** | shifted |
| `0111/review.md:76-79` R6 residual | quote | **`:76-79`** | **holds ✅** |
| `0111/review.md:92-94` suppressed-as-settled | | **`:92-94`** | **holds ✅** |

All nine exit-table row names are **present and unchanged**. The core gap claim is **confirmed**: `/usr/bin/grep` over the current sprint loop for `crash|died|terminat|abnormal|529|overloaded|no response` returns **nothing** on abnormal termination; the only hits are the close-repair branch (`:212-222`, `:254`).

**The one substantive decay — flag it loudly, it changes question 4.**

Brief: *"**`fkit-sprint-ship-loop/SKILL.md` has no such section at all.**"*

That is now **false**. The sprint loop carries `## Durable artifacts` at **`:72-88`** — a three-row table (`plan.md` / `worklog.md` / `review.md`), stating they are git-tracked, owner-committed, and move with the folder. What it still **lacks** is exactly what the brief's next sentence claims: **no** *"does NOT trust its own memory"* framing, **no** *"re-derives its position on every resume"*, **no** *"Fail-safe on resume"*, **no** ADR-020 citation.

So the correct current statement is: *the sprint loop anchors its artifacts but has no resume doctrine over them.* That is a **narrower and more interesting** gap than the brief describes, and question 4 must be answered against the narrower one.

Bonus, directly load-bearing for **question 3** — that same section says, verbatim:

> Task **statuses** are deliberately **not** in this table: they live in the brief's `## Status` and the sprint row, and are governed by §2 (mark `🔄 In progress`) and §4 (close posture), not by an artifact write.

A *deliberate* exclusion of status from the durable table is prior art the ruling must reconcile, not discover.

## 1. Division of labor (per the owner's ruling for this run)

- **Coder:** the plan. No files written.
- **`@fkit-architect` (spawned by the driver after approval):** produces the ruling. Report-only.
- **Nobody:** edits `claude/skills/`, files a brief, or touches `ai-agents/wiki-vault/`.

## 2. The artifact(s) and where they go

**Primary — always produced:**

```
ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md
```

**Vehicle:** `/fkit-evaluate-approach` (the only one of the architect's two skills that writes to `reports/`).

**Naming note, decided rather than left open:** that skill mandates `YYYY-MM-DD-eval-<slug>.md`. Both recent sibling *rulings* in `reports/` (`2026-08-01-durable-citation-form-…`, `2026-08-02-faithful-carry-…`) use a **plain dated slug, no `eval-` prefix**, because they are rulings and not approach evaluations. **Follow the ruling precedent** — use the skill for method and rigor, name the file per the sibling rulings. If the architect judges the skill's naming binding, say so in the report rather than switching silently.

**Shape collision to handle explicitly:** `/fkit-evaluate-approach` imposes a *"2–3 candidates + recommendation"* shape. Questions 1–3 are **rulings**, not candidate comparisons, and verification step 1 demands *"an explicit answer rather than a discussion."* Only **Q4** is a genuine two-option comparison (one row vs. the whole doctrine). **Resolution:** use the eval shape where it fits (Q4, and Q3's status choice), and give Q1/Q2 a flat *Answer / Evidence / Limits* form. The report must open with a four-line answer block so no reader has to mine prose for the rulings.

**Conditional — only if the ruling amends R6's owner-ruled acceptance:**

```
ai-agents/knowledge-base/decisions/adr-0NN-<slug>.md
```

via `/fkit-record-decision`. **Do not trust the plan's count for `NN`** — run that skill's own two-step allocation sweep (its Step A conformance check, then the numeric max). For reference only: `adr-037` is the highest file on disk today, so **038 is the likely allocation** — but the skill exists because that inference has been wrong twice, once via a wiki-claimed-but-not-on-disk number.

**Third artifact, unavoidable:** the report **must** carry a corrected-coordinates note (§0 above), because it will itself be read by the follow-up implementers.

## 3. Work sequence

**Step 1 — Ground in `0160`'s citation rule (do this first; it binds everything written after).**
`0160` shipped. Read `reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` §1 and §1.1. The operative constraints:
- *Line numbers are for findings against a revision. Names are for cross-references into living documents.*
- The **rider that matters more than any ban**: *never cite a line number naked* — always pair it with quoted text or a named heading.
- The **R22 scope correction**: the claim-vs-pointer question is a **first cut only**; it decides one row of five. Read it **together with** *"does a third party edit this under you?"*.
- The architect's own `## Output format` `path:line` bullet was **narrowed** by that report — §1.2. This report is an architecture doc under that bullet and must follow the narrowed rule.

**Consequence for this report:** `claude/skills/fkit-sprint-ship-loop/SKILL.md` is a **living document a third party edits** — cite it by **section heading and row name**, not by line. Where a line number is genuinely useful, pair it with a quote. `0111/review.md` is a **frozen ledger in `done/`** — line citation is safe there and verification step 3 explicitly requires it (*"cites R6 by its `0111` review coordinates"*). **Use `:76-79` — re-verified at plan time, still correct.**

**Step 2 — Read the evidence base, corrected.**
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — whole file, **296 lines**. Do not skim to the exit table; the brief's own finding was that the omission is not confined to it, and `## Durable artifacts` (new since the brief) proves the file moves under you.
- `claude/skills/fkit-task-ship-loop/SKILL.md` §*Durable state — the loop does NOT trust its own memory* (`:92-116`), including the fail-safe at `:113-114`.
- `ai-agents/tasks/done/0111-…/review.md` — R6 in **three** places: the findings row `:26`, the verdict row `:48`, the accepted-residual `:76-79`, plus the round-3 suppression `:92-94`. **The findings row `:26` is richer than the residual the brief quotes** and names the mechanism (`🔄 In progress` set *before* the plan gate, which can idle indefinitely; a fresh run excludes it; no lease/heartbeat). Read it — it is what decides the R6-reading question.
- `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — **mandatory** for Q3, verification step 5.
- `ai-agents/tasks/backlog/0134-…/brief.md` — required by the brief's note; the ruling must say whether the two share a doctrine.

**Step 3 — Answer Q1: what must the driver do?**
Test the brief's proposed *inspect disk → judge coherence → resume / re-spawn / defer* shape **against both instances, per instance**, and state where it fails.

Known stressors the architect must confront, not skip:
- **Instance 2's second death produced nothing at all.** Does "judge coherence" even have an input when disk is unchanged? A nothing-landed case may be a **fourth** outcome the three-way shape does not name.
- **Instance 1 has no on-disk corroboration.** Verified at plan time: `ai-agents/tasks/done/0118-…/` contains **only `brief.md` and `review.md`** — no `worklog.md`, no `plan.md`. The brief's warning (*"instance 1's account is not independently verifiable"*) is therefore **confirmed and stronger than stated**. The ruling may rely on it **only as declared testimony**, labelled as such. A shape validated on one checkable instance plus one uncheckable one is a shape validated on **n=1**, and the report must say so.
- **Instance 2 was not a tracked task** — which is precisely why Q3 exists.

**Step 4 — Answer Q2: may a resumed worker self-report?**
Reconcile against `fkit-task-ship-loop`'s *"does NOT trust its own memory"* + the fail-safe quote. If the rule generalizes, phrase it to cover a worker resumed by `SendMessage`.

Two live complications:
- **The doctrine cited is about the loop's own memory, not a subordinate's.** Extending *"do not trust your own memory"* to *"do not trust your worker's report"* is an **analogy, not an entailment**. Say which it is.
- **ADR-037** (*a skill rule binds a spawned worker unless the instruction relays an owner ruling*) — post-dates the brief and bears on what a resumed worker is bound by. Check whether it constrains the answer.

**Step 5 — Answer Q3: does the exit table need a row, and what status?**
- Status value **must** come from `task-status-vocabulary.md`. Given a deferred remainder, `🚧 Blocked — <reason>` is the vocabulary's natural fit (*"Started, cannot proceed. A reason is mandatory"*, *"Anyone — freely"*), and resetting to `🔲 Backlog` is the other candidate — the exit table's `Plan rejected` row already does exactly that reset. **Do not mint a value.** Weigh both against the vocabulary's own rule: *"A status is only true if it is current… if you put it down, unset it."*
- Bind the answer to the **`no path ends in silence`** invariant (`:257`) — the brief is right that an uncovered exit is a **live breach of a stated invariant**, not merely an undocumented case.
- Reconcile against `## Durable artifacts`'s deliberate exclusion of status from the artifact table (quoted in §0).

**Step 6 — Answer Q4: one row, or the missing doctrine?**
Answer against the **corrected** premise from §0: the sprint loop **has** artifact anchoring, **lacks** resume doctrine over it. State whether the doctrine is this task's follow-up or belongs to a broader ADR.

**Step 7 — Adjudicate the *"fkit has no crash-recovery anywhere"* claim (verification step 4).**
By **quotation** of `fkit-task-ship-loop`'s durable-state section. Say plainly whether the claim stands as written. The honest reading available on disk: the claim is **false as a blanket**, since one loop carries an explicit re-derive-on-resume fail-safe — but arguably **true in the sense R6 meant it** (no *lease/heartbeat/stale-task* recovery exists anywhere). Distinguish those two readings rather than picking one silently; the distinction is what makes R6's acceptance either sound or mistaken.

**Step 8 — Rule the R6 reading and decide the ADR (verification step 3).**
Choose one of the three on the record: **re-raise / adjacent uncovered failure / silently swallowed by R6's rationale**. Then state whether an ADR follows. Anchor on the brief's distinction: R6 is the **driver session** dying; this is a **worker** dying while the driver survives and demonstrably recovers. R6's stated re-raise trigger was **not** met by either instance.

**Step 9 — Reconcile with `0134`.**
Say whether the two rulings share a doctrine. ⛔ **Do not merge them.**

**Step 10 — Name the follow-ups** (title + one-line scope each), so the producer can scope without re-deriving.

**Step 11 — Self-verify against the brief's eight steps** before returning. See §6.

## 4. Constraints the architect must honor

- ⛔ **No retry policy** — no count, no limit, no backoff, anywhere in the output. If the ruling concludes one is unavoidable: **name it as an owner follow-up and stop.**
  - ⚠️ **The live hazard, not in the brief:** the exit table's `Blocked — hand-off didn't land` row already says *"re-spawn `@fkit-producer` **once**"* — a bounded one-shot retry, in the file being ruled on. It is the closest prior art to a dead-worker rule **and** it sits astride the exclusion. The architect must **reconcile** it (note it exists, note it is scoped to the producer/close step only, note it addresses a *failed spawn* rather than a *dead worker that returned nothing*) **without** generalizing it into a retry rule for workers. Reading it as licence would breach the exclusion; ignoring it would leave the ruling incomplete.
- ⛔ **Do not merge with `0134`.**
- ⛔ **No brief filed. No `claude/skills/` file edited. No `ai-agents/wiki-vault/` write.**
- ⚠️ **`/usr/bin/grep`, never bare `grep`** — the wrapper honors `.gitignore` and silently drops paths (measured 96 vs 119 files). Never report an unqualified "zero hits". `/bin/ls`, not `/usr/bin/ls`.
- **Conform to `0160`'s citation form** — it has landed, so the brief's conditional has fired.

## 5. Risks and non-obvious failure modes

1. **The architect quotes the brief's stale claim.** *"has no such section at all"* is now false. Highest-likelihood error in the whole task, because the sentence is bolded and quotable and the file changed under it. **Mitigated by §0; the report should record the decay as a finding** — it is a live instance of exactly the class `0160` ruled on.
2. **Validating the Q1 shape on n=1.** Instance 1 is unverifiable from disk (confirmed: no worklog in `0118`'s folder). Reporting "holds for both" without that caveat overstates the evidence — and verification step 2 demands per-instance honesty.
3. **The nothing-landed case falls through.** Instance 2's second death yielded no disk change. If the three-way shape has no branch for it, say so rather than stretching "defer" to cover it.
4. **Retry-exclusion breach by omission.** The likeliest breach is not writing a number — it is silently importing `:254`'s "re-spawn once" as the answer to Q1. Flagged above.
5. **`git status` false-positive on verification step 7.** The tree is **already dirty before this run**: modified files across `ai-agents/wiki-vault/` and `ai-agents/sprints/backlog.md`, plus **two untracked backlog folders (`0214`, `0215`)** that pre-date this task. A naive *"no brief was filed"* check will report a brief. **Scope the check** to `claude/skills/` (must be clean) and to *new* paths under `ai-agents/tasks/` (must be none beyond the pre-existing `0214`/`0215`). Record the pre-existing baseline in the report so the check is reproducible.
6. **ADR number collision.** `/fkit-record-decision`'s sweep exists because naive `ls | tail` has misallocated twice. Run the skill's Step A **and** Step B; do not use the plan's `037` observation as the answer.
7. **`0160` compliance is itself checkable and will be checked.** A naked `SKILL.md:243` in the report would make it a fresh instance of the defect `0160` ruled on — the same self-referential trap `0160` called *"the sting"*.
8. **Scope creep into `0134`.** Both are *"a driver facing partial state."* The pull to unify is strong and explicitly forbidden. Say whether a shared doctrine is warranted; do not write it.

## 6. Verification mapping

| Brief step | Satisfied by |
|---|---|
| 1 — report exists, all four answered explicitly | Step 2 output path + the four-line answer block (§2 shape note) |
| 2 — Q1's shape **tested** per instance | Step 3, incl. the nothing-landed branch and the n=1 caveat |
| 3 — R6 reading named + ADR decision, citing `0111` coordinates | Step 8; use `review.md:76-79` (re-verified) |
| 4 — *"no crash-recovery anywhere"* adjudicated **by quotation** | Step 7; quote `fkit-task-ship-loop` §*Durable state* + the fail-safe |
| 5 — status value from the vocabulary | Step 5; read `task-status-vocabulary.md` and name the value |
| 6 — no retry count/limit/backoff anywhere | Step 11 self-read + §4 hazard note on `:254` |
| 7 — no brief filed, no `claude/skills/` edit | Step 11, **scoped** git check per risk 5 |
| 8 — follow-ups named (title + one-line scope) | Step 10 |

## 7. Sequencing and dependencies

Steps 1–2 are prerequisite reading. Steps 3–6 are the four answers and may proceed in any order, but **Step 7 (the crash-recovery adjudication) should precede Step 8 (the R6 reading)** — whether R6's stated rationale survives is an input to whether this is R6's re-raise. Steps 9–10 depend on all four answers. Step 11 is terminal. The conditional ADR is written only after Step 8 rules it necessary.

**Blockers:** none. `0160` (the only stated conditional dependency) has landed and is incorporated.

---

## Open questions for the owner

**None blocking** — the plan is executable as written. Two resolved with a recommendation rather than escalated:

1. **Report filename form** — recommended the plain dated slug (matching the `0160`/`0162` ruling precedent) over `/fkit-evaluate-approach`'s mandated `eval-` prefix. Reversible in one rename.
2. **Report shape** — recommended a flat *Answer / Evidence / Limits* form for Q1–Q2 rather than forcing the eval skill's candidate-comparison shape onto rulings that have no candidates. Verification step 1's *"explicit answer rather than a discussion"* is the reason.

**Owner disposition, 2026-08-04:** both recommendations **approved as planned**.

One item needing no decision: **the brief's `⚠️ Flagged for owner confirmation` on priority 145 is already resolved** (owner-confirmed 2026-07-30, recorded 2026-07-31). No action.
