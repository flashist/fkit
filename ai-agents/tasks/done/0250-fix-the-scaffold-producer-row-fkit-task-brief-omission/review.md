# Review — 0250

Task: `ai-agents/tasks/done/0250-fix-the-scaffold-producer-row-fkit-task-brief-omission/brief.md`
File(s) under review: `claude/scaffold/CLAUDE.md` (line 23), `claude/structure-manifest.tsv` — working
tree vs `HEAD` (`05fd9d0`). Out of surface, not reviewed: `ai-agents/sprints/sprint-6.md`,
this folder's `brief.md` / `plan.md` / `worklog.md`.
Status: closed-out

> ✅ **Closeout — 2026-08-23, reviewer phase 2.** Every disposition (R1, R2, plan §6 Q1) is recorded
> below, and R1's remedy is **verified landed on disk**. ⚠️ **Two measurements were taken, and they
> disagreed** — a producer was writing the remedy concurrently. The first check found nothing landed;
> the second, minutes later, found it complete. **Both are recorded** in *Owner dispositions — round
> 1* below rather than only the favourable one. The header is set from the **second, re-verified**
> measurement. ⛔ Not owner-verified: no owner confirmed the landed text; the reviewer read it.

Round 1 reviewers: **fkit-reviewer** (own pass) + **Codex** via `codex exec --sandbox read-only`.
Codex coverage: **FULL** on every review angle; its own test-execution sub-check was partial (its
read-only sandbox refused `mkdtemp`, so `dual-home-parity` / `structure-check` / `structure-repair`
could not run inside it) — that gap is independently covered by the reviewer's own unsandboxed
`npm test` run (730/730, 0 fail) and is **not** a coverage hole in the verdict.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `ai-agents/tasks/backlog/0188-repair-the-five-live-ownership-fact-defects/brief.md:54` (and `:138`, and the `0188` board cell `ai-agents/sprints/sprint-6.md:241`) | **This change silently discharges `0188`'s defect D1, and three live records still assert D1 as an open defect.** `0188` D1 is the *same* defect `0250` fixes — "`claude/scaffold/CLAUDE.md`: the producer's row omits `/fkit-task-brief`", `0188`'s own "highest of the five". Neither brief cross-references the other (`grep 0188` in the `0250` folder and `grep 0250` in the `0188` folder both return nothing). Once this lands, `0188`'s D1 text quotes a row that no longer exists, and its verification step 1 passes with no work done. **Concrete regression risk, not just untidiness:** `0188` D1 says "repair against `skills_for_role()`", whose order puts `/fkit-task-brief` **second**; a later `0188` run reading D1 as still-open could "repair" by reordering the row and undo the deliberate ordering choice this task made (plan §1d — match `claude/skills/fkit-team/SKILL.md:54`). ⛔ **The remedy is NOT a change to this diff** — `0250` is fenced at "the R10 line only", and `0188`'s brief plus the sprint board are producer-owned. It is a dated correction note on `0188` (and its board cell), filed as follow-up. Sequencing note for whoever takes `0188`: its **D2** still edits `claude/scaffold/CLAUDE.md` (the "banner on every skill" sentence), so `0188` remains a manifest-regen task even with D1 discharged. |
| R2 | 1     | low    | `test/skill-ownership-hook.test.js:289` | *(raised by Codex; verified)* **Nothing mechanically enforces scaffold-mirror ↔ `skills_for_role()` agreement, so this omission class can recur undetected.** The hook test's `OWNED` oracle carries `fkit-task-brief` for the producer (`test/skill-ownership-hook.test.js:324`) and stayed green throughout the years the scaffold row was wrong; `test/structure-manifest.test.js:106` asserts only byte-equality of the regenerated manifest, never role-table semantics. **Classified frontier-move, not a defect in this change** — it is the owner-approved plan's own §6 Q2, declared out of scope there, and it is already filed as backlog work (`0189` registry + completeness tripwire, and `0137`'s territory for wrong prose at registered sites). Recorded so it is disposed of explicitly rather than dropped. |

### Dated corrections — reviewer, 2026-08-23 (round-1 rows above left byte-identical)

Two claims in the round-1 rows drifted from what the repo actually shows. The rows above are a dated
record, so they are **corrected by note, never rewritten** — the form is
`claude/skills/fkit-record-decision/SKILL.md` § *Correcting an accepted ADR — the dated correction
note*. ⚠️ = a fact that drifted; the finding, its severity and its disposition are **untouched**.
(The form says "place the note below the claim"; a claim living inside a table cell cannot carry a
blockquote, so the notes sit directly below the table and name their row.)

> ⚠️ **Correction — 2026-08-23 — R2's duration claim is FALSE.** R2 says the `OWNED` oracle "stayed
> green throughout the **years** the scaffold row was wrong". **There are no years.** Re-measured by
> the reviewer at phase 2, independently of the coder that raised it — `git log`, three commits:
> repo first commit `db49851` **2026-07-03**; `claude/scaffold/CLAUDE.md` created by `627d5ea`
> **2026-07-11**; `test/skill-ownership-hook.test.js` added by `13f3e30` **2026-07-16**; `HEAD`
> `05fd9d0` **2026-08-23**. The repo is **51 days old**, and the true green-while-wrong window is
> **38 days** (2026-07-16 → 2026-08-23). Read "years" as "38 days" everywhere in R2. **Unchanged:**
> the mechanism claim (no test binds the scaffold mirror to `skills_for_role()`), the severity
> `low`, the frontier-move classification, and the accepted-residual disposition — none of them
> depends on the duration. Reviewer's verdict on this correction: **agreed, fully**.

> ⚠️ **Correction — 2026-08-23 — R1's blast radius was OVERSTATED; its severity was not.** R1 calls
> the later-`0188`-reorder hazard a *"Concrete regression risk, not just untidiness"*. **"Regression"
> is the wrong word for it: no shipped behaviour can break.** Re-verified by the reviewer at phase 2:
> nothing parses the list positionally (`skills_for_role()` in `claude/skills-for-role.sh` is read as
> a whitespace-separated **set**; Codex checked this in round 1 and returned an explicit *"No finding
> — ordering"*), and the owner's 2026-08-23 ruling *"Accept — order is not normative"* settles it.
> The real cost of a reorder is **wasted work plus an undone deliberate choice** (plan §1d), and
> **manifest churn** — `claude/structure-manifest.tsv` keys the scaffold file under project path
> `CLAUDE.md` and is **append-only by design** ("every content hash fkit has ever shipped"), so a
> gratuitous reorder permanently adds a hash row and cannot be un-added. One reviewer nuance the
> calibration did not state, and it cuts **toward** safety: a reorder landed **without** regenerating
> the manifest is **not silent** — `test/structure-manifest.test.js` assertion A goes red with the
> "manifest is STALE" message. So the failure mode is loud and caught, never a quiet break.
> **Unchanged:** severity **medium** (wasted-work and undone-deliberate-choice risk is real), the
> defect-of-record classification, the ⛔ "the remedy is NOT a change to this diff" fence, and every
> coordinate cited. Reviewer's verdict on this correction: **agreed on the wording; the severity
> stands at medium.**

### Owner dispositions — round 1 (recorded by the reviewer, 2026-08-23)

All three came from the owner live via `AskUserQuestion`; the option labels below are **verbatim**.

- **R1 → a separate producer task, not a change to this diff.** Verbatim label: *"File the producer
  follow-up (Recommended)"*, 2026-08-23. The remedy is a **dated correction note** on `0188`'s D1
  (`.../0188-repair-the-five-live-ownership-fact-defects/brief.md`) and on its board cell
  (`ai-agents/sprints/sprint-6.md:241`), recording that `0250` discharged D1 and warning off the
  reordering. **Not** an accepted residual — it is real work with a real owner elsewhere.
  - **Filed as task `0324`** —
    `ai-agents/tasks/done/0324-record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering/`.
  - The owner then ruled — verbatim label *"Apply the correction now (Recommended)"*, 2026-08-23 —
    that `0324`'s three correction notes be **written this session** rather than queued.
  - ⚠️ **Landing check — TWO measurements, both recorded because they disagreed.** A producer was
    writing the remedy **concurrently** with this phase-2 pass, so the first reading was a snapshot of
    a race, not a verdict on the producer.
    - **Measurement 1 (earlier this session) — NOT landed.** `0188/brief.md`: **0** occurrences of
      `0250`, **0** of `0324`. `ai-agents/sprints/sprint-6.md`: **0** occurrences of `0324`, board
      cell `:241` still asserting D1 as an open defect. `0324`: still under
      `ai-agents/tasks/backlog/`, holding only `brief.md`.
    - **Measurement 2 (re-check, 11:44:50 same day) — LANDED, and verified by reading the text, not
      by hit-counting.** `0188/brief.md`: **5** occurrences of `0250`, **2** of `0324`; the D1 note
      sits at `:66-85` as a dated ⚠️ blockquote, states D1 is **discharged** by `0250`, states the
      original D1 text is left **byte-identical**, carries the ⛔ warn-off in full (*"DO NOT 'repair
      against `skills_for_role()`'"*, with the twin-match reasoning and the explicit "would … re-break
      the twin match — while reporting success"), preserves *"D1 is one of five"* so `0188` stays
      `🔲 Backlog` with D2–D5 live and remains a manifest-regen task, and cites its authority as
      `0324` on the owner ruling *"Apply the correction now (Recommended)"*. A second note lands at
      `:171-179`. `ai-agents/sprints/sprint-6.md`: `0324` now present in the D1 board cell `:241`.
    - **The remedy is therefore complete, and `Status:` is set to `closed-out` on measurement 2.**
    - ⚠️ **One item deliberately NOT treated as a gate:** `0324`'s own folder was **still under
      `ai-agents/tasks/backlog/`** at measurement 2, not moved to `done/`. That is `0324`'s
      bookkeeping, not `0250`'s remedy — and **only a producer may move a task file**
      (`/fkit-task-done`, ADR-033). The reviewer neither moved it nor wrote any of these files;
      every path above was read-only.
- **R2 → accepted residual.** Verbatim label: *"Accept as residual (Recommended)"*, 2026-08-23. No
  new task, no code change; already covered by open backlog `0189` (registry + tripwire) and `0137`'s
  territory. **Already recorded** in *Accepted residuals* below as *"Scaffold-mirror agreement is not
  mechanically enforced"* — verified at phase 2 to match this ruling, and **not duplicated here**.
- **Plan §6 Q1 (list ordering) → accepted residual.** Verbatim label: *"Accept — order is not
  normative (Recommended)"*, 2026-08-23. **Already recorded** below as *"Producer skill-list ordering
  is not normative"* — verified at phase 2 to match this ruling, and **not duplicated here**.

**Convergence call — 2026-08-23:** ✅ **converged; no further review round is warranted.** Round 1
produced two findings; **neither is a defect in this change surface** — R1 is a record defect in
producer-owned files (now `0324`), R2 is a frontier-move the approved plan itself scoped out. Nothing
in either round re-litigates a settled residual. The only thing still open is `0324` landing, which is
producer work, not review work. **Do not open a round 2 on `0250`.**

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | **Defect (record)** — real, but **entirely outside this change surface**; nothing in `claude/scaffold/CLAUDE.md` or `claude/structure-manifest.tsv` is wrong. | **No change to this diff**, per the owner's disposition of 2026-08-23 (`AskUserQuestion`, verbatim label *"File the producer follow-up (Recommended)"*): the remedy is a **dated correction note** on `0188`'s D1 and its board cell, filed as a **separate producer task**. I re-verified every coordinate (below) but wrote **nothing** to `0188`'s brief or `ai-agents/sprints/sprint-6.md` — both producer-owned, and a producer was filing the follow-up in parallel. | **blocked** — reason: not completable by this role. The remedy lives only in producer-owned files this role must not write, and from here I cannot confirm the parallel producer's note landed. Not blocking `0250` itself. |
| R2 | PARTIALLY CORRECT | **Frontier-move** — confirmed; it is the approved plan's own §6 Q2, declared out of scope there. | **No code change** — recorded as an accepted residual per the owner's disposition of 2026-08-23 (`AskUserQuestion`, verbatim label *"Accept as residual (Recommended)"*); already covered by open backlog `0189` (registry + completeness tripwire) and `0137`'s territory. ⚠️ **One sub-claim is false and is corrected here rather than adopted** — see note 2 below: the oracle did not stay green *"throughout the **years** the scaffold row was wrong"*. No such period exists in this repo. | **won't fix (frontier)** |

### Verification notes — coder, round 1 (all re-derived 2026-08-23, not taken from the finding)

1. **R1 — every coordinate holds; severity `medium` is correct and I adopt it.**
   `0188`'s brief `:54` is exactly the D1 heading *"### D1 — `claude/scaffold/CLAUDE.md`: the
   producer's row omits `/fkit-task-brief`"*; `:138` is exactly D1's verification step 1; the board
   cell carrying D1's text is `ai-agents/sprints/sprint-6.md:241`. The cross-reference claim holds at
   **brief** level: `grep 0250` in the `0188` folder returns nothing, and `grep 0188` in the `0250`
   folder hits **only** this ledger's own R1 row. The reviewer's sequencing note also checks out —
   `0188`'s **D2** does name `claude/scaffold/CLAUDE.md` as carrying one of the false *"banner on
   every skill"* sentences, so `0188` remains a manifest-regen task with D1 discharged.
   **One calibration on the wording, not the verdict:** *"concrete regression risk"* slightly
   overstates the blast radius. A later `0188` run reordering the row would produce **cosmetic desync
   plus manifest churn**, not a functional regression — no consumer parses the list order (Codex
   verified this explicitly and returned *"No finding — ordering"*), and the owner's 2026-08-23 ruling
   *"Accept — order is not normative"* settles it. The risk of **wasted work and an undone deliberate
   choice** is real, which is what keeps this at `medium`; the risk of **broken behavior** is nil.
   Note the interlock: recording the ordering residual below is itself part of what defuses R1.
2. **R2 — mechanism `CORRECT`, duration claim `INCORRECT`; net `PARTIALLY CORRECT`. Severity `low` is
   correct and I adopt it.**
   All three code coordinates are exact: `test/skill-ownership-hook.test.js:289` is the
   *"⚠️ HARD-CODED ON PURPOSE"* comment, `:324` is the producer `OWNED` row and it does carry
   `fkit-task-brief`, and `test/structure-manifest.test.js:106` is assertion **A**, which asserts
   byte-equality only. I also confirmed the gap independently: **no** test enforces role-table
   semantics — `structure-check` / `structure-repair` use `claude/scaffold/CLAUDE.md` only as
   hash/marker fixture material, and `dual-home-parity-exceptions.mjs` names it only inside a `reason`
   string. **But the duration is wrong by an order of magnitude.** This repo's first commit is
   `db49851`, **2026-07-03** — 51 days ago. There are no "years" to be green through. Measured:
   the defect entered with `627d5ea`, **2026-07-11** (the commit that created the file); the hook test
   entered with `13f3e30`, **2026-07-16**. The true green-while-wrong window is **38 days**. The
   finding's force does not depend on the duration, so this corrects the record without changing the
   disposition.

## Accepted residuals (shared, do-not-re-litigate)

- **Scaffold-mirror agreement is not mechanically enforced** — What: `claude/scaffold/CLAUDE.md`'s
  role table is a **hand-maintained mirror** of `skills_for_role()` (`claude/skills-for-role.sh:51`)
  with **no test** binding the two; the hook test's `OWNED` oracle is a deliberately hard-coded
  mirror too (`test/skill-ownership-hook.test.js:285-289` states this as intent), and
  `test/structure-manifest.test.js:106` checks manifest byte-equality, never role-table semantics.
  · Why (structural): deriving the oracle from the implementation would test nothing — the hook
  test's own warning says so — so the mirror is the accepted cost of a real oracle. Adding a
  scaffold ↔ `skills_for_role()` agreement test was weighed and **rejected for `0250`** as new
  scope outside the brief's "R10 line only" fence (approved plan §5, §6 Q2). The class is already
  owned elsewhere: backlog `0189` (registry + completeness tripwire) and `0137` (wrong prose at
  registered sites). Owner disposition 2026-08-23, `AskUserQuestion`, verbatim label *"Accept as
  residual (Recommended)"*. · Re-raise only if: `0189` is cancelled or closed **without** landing a
  mirror-agreement check, **or** a third instance of this omission class ships to consuming projects.
- **Producer skill-list ordering is not normative** — What: the six carriers of the producer's skill
  list use **two different orderings** — `skills-for-role.sh:51`, `README.md:47` and
  `architecture.md:151` put `/fkit-status` **fifth**; `fkit-team/SKILL.md:54` and
  `scaffold/CLAUDE.md:23` put it **second**. All list the same six skills. **Order carries no
  meaning and nothing may be reordered to "fix" it.** · Why (structural): no consumer parses the
  list order — it is prose for humans, while the executable source of truth is `skills_for_role()`,
  which is read as a whitespace-separated set. Codex verified this explicitly in round 1 and returned
  *"No finding — ordering"*. Unifying the orderings was weighed and rejected: it would be a second
  content change to a file fenced at "the R10 line only", and it would desync `scaffold/CLAUDE.md`
  from its nearest twin `fkit-team/SKILL.md:54` (approved plan §1d, §5). Owner disposition
  2026-08-23, `AskUserQuestion`, verbatim label *"Accept — order is not normative (Recommended)"*.
  · Re-raise only if: a consumer is introduced that **parses** one of these lists positionally, or an
  owner ruling declares a canonical order. ⛔ **Specifically pre-empts** a future `0188` D1 run
  "repairing" the scaffold row by reordering it to `skills_for_role()` order — that is not a repair,
  and R1 above names it as the concrete hazard.
  - ⚠️ **Appended by the reviewer 2026-08-23 (phase 2) — nothing above was altered.** **This entry is
    the durable home of the "order is not normative" ruling.** Owner disposition 2026-08-23,
    `AskUserQuestion`, verbatim label *"0250's review ledger residual (Recommended)"*. Context: a
    producer measured that `grep -rn "order is not normative" ai-agents/ claude/` matched **only**
    `0250`'s own plan/worklog *proposing* such a declaration — the ruling had been relayed but never
    landed anywhere durable. The entry above **is** that landing, so the gap is **discharged** and
    `0324`'s re-verify instruction on this point **resolves here**; it needs no second home in an ADR
    or a convention page. Re-open only if this ledger is deleted or the ruling is superseded.
