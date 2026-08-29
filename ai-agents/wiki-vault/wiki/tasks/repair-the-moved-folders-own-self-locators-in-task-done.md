# Repair the moved folder's OWN self-locators in `/fkit-task-done` — a rule for the reference sweep

**Source**: `ai-agents/tasks/done/0325-repair-the-moved-folders-own-self-locators-in-task-done/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P14` · ID 0325 · owner `fkit-coder` · **three review rounds**, 2026-08-26

## Goal

A closed task folder's own header locators — `plan.md`'s `Brief: …/tasks/backlog/…` and `review.md`'s `Task: …/tasks/backlog/…` — **go stale the moment the folder moves to `done/`.** `/fkit-task-done` mandates outbound sibling-link repair and is **silent on self-locators**. ⚠️ *"This recurs at EVERY close."*

Owner ruling 2026-08-23, verbatim label **"Re-point them, add rule to task-done (Recommended)"**. Its first half — re-pointing `0250`'s two locators — was already executed; **this task is the second half only: the skill rule.**

### ⭐⭐ The distinction the whole task turns on — a locator is not a claim

⛔ **The rule is worthless, and actively harmful, if written without it.**

- **A locator is a pointer.** A pointer that no longer resolves is simply **wrong**, and repairing it changes no assertion. **Repair these.**
- **Frozen evidence is a claim** — captured command output, a quoted specimen, a dated measurement that happens to mention the old path. **Rewriting it falsifies a dated record. Never touch these.**

The governing sentence step 5 already states twice for inbound cases, extended here to the self case: ⭐ **"A historical record's *claims* are frozen; its *links* are not."**

### The worked example, with both traps

`0250`'s folder held **seven** occurrences of the old `backlog/` path, splitting **2 repair / 5 freeze**.

⚠️ **Trap 1 — two freeze rows name `backlog/` CORRECTLY, because they are about ANOTHER task.** ⛔ *"A rule implemented as 'replace `backlog/` with `done/` in the moved folder' would corrupt them. The rule must key on the locator's role, not on the string."*

⚠️ **Trap 2 — two freeze rows name the moved folder's own path in ELIDED form**, so a rule keyed on the full folder name misses them. ⛔ *"Which is correct here, but is luck, not design. Do not rely on eliding as the freeze mechanism."*

### The class, measured — real, growing, and wider than `review.md`

| Fact | Count |
|---|---|
| task folders in `done/` | 198 |
| **`review.md` with a stale self-locator** | **44** |
| **`plan.md` with a stale self-locator** | 1 (`0248`) |
| **`worklog.md` with a stale self-locator** | 1 (`0218`) |

⚠️ **Method limits stated rather than implied away:** each file's first 12 lines were tested for the literal own-folder path. ⛔ **It undercounts — read these as FLOORS, not totals.** ⭐ **The class is growing**: `0168` measured 124 done folders / 60 with `review.md` on 2026-07-31; today it is **198 / 116**.

### ⭐ Distinct from `0168`, measured rather than guessed

`0168` is **retroactive** over `review.md` only; this is **prospective** over the mover, covering `plan.md` / `review.md` / `worklog.md`. **The evidence that neither subsumes the other is the two files `0168` does not reach** — `0248`'s `plan.md` and `0218`'s `worklog.md`. ⚠️ **Without this rule, `0168`'s backfill is re-polluted at the very next close.**

## Key Changes

**One file** — `claude/skills/fkit-task-done/SKILL.md`, +80/−4 across five hunks. No test, no manifest regen, no step-1 edit.

- **A new step-5 bullet, "The moved folder's OWN self-locators"** — the repair rule, a **role-not-string** definition, two ⛔ freeze paragraphs, and the `0250` seven-row worked example.
- **Step 4** gained the clause that record files point at themselves.
- **"Then prove it."** gained: *every self-locator you re-pointed must name a file that now exists* — ⭐ **most are code spans, not markdown links, so the existing link check does not reach them.**
- **Step 7 reports them** — brief item 6 answered **yes**: ⭐ *the freeze calls are judgments, and the report is the only place they can be checked.*

⭐ **The brief deliberately did NOT draft the sentence** — it specified the outcome and left the wording to the plan and the owner. It also refused to settle a genuine open question by keystroke: repair-on-move (ruled) versus **write it durably in the first place** (relative `./brief.md`, which never rots — **prior art: 4 of `0168`'s 60 headers already do it and all 4 survive the `git mv` intact**). ⛔ Option 2 is complementary, does not remove the need for option 1, and adding it would have been a scope increase requiring owner approval.

## Outcome

**Three review rounds, eight findings, all low, all CORRECT** (one PARTIALLY). Reviewers: own pass + Codex (`codex exec --sandbox read-only`, `codex-cli 0.145.0`), **full coverage, both completed, every round.** `node --test test/*.test.js` → **774 tests / 24 suites / 774 pass / 0 fail.**

⭐ **Every finding was about the RULE'S TEXT, not its outcome — the shipped freeze/repair verdicts were correct throughout, and no row's verdict changed across three rounds.**

- **R1** — ⭐ *the right outcome for the wrong reason.* A `File(s) under review:` line **passes** the position prong (it is inside the header block) and fails the **role** prong. A cold reader who was just told *"that is the whole test"* met a contradiction.
- **R2** — the worked example claimed **six** occurrences; re-counted at `c45ec3d` it is **seven**. Also: the step-4 grep returns only the two full-folder-name hits, so a cold producer could not tell whether to hunt for the rest.
- **R3** — ⭐ **a literal reading froze real COMPOSITE locators**: `Task: 0160 — …/brief.md` (an ID before the path) and `**Plan:** …/plan.md, approved by …` (a clause after it, which *asserts an approval*). Both are locators — *re-point the path, keep the ID and the clause byte-identical.*
- **R4** — ⭐ **"header block (above the first `## `)" was UNDEFINED for two real files** (`0191`'s plan uses `###` only; `0246`'s review has no heading at all). Owner-ruled *"Extend the definition (Recommended)"*: above the first heading of level 2 or lower, **or the leading field block when there is none**. ⛔ The rejected reading (the whole file is header) would have repaired body-prose pointers the ruling froze.
- **R5** — a pre-existing line, *"A reference you found and did nothing about is a link you broke"*, now reads false for a correctly-frozen hit. ⚠️ **PARTIALLY CORRECT** — a frozen hit reported in step 7 *is* handled, so Codex's `high` was unsupported.
- **R6** — a clause hung off the wrong parent, so cold it listed the record files among things that *no longer exist*.
- **R7** — a bare task ID on first mention, against the `durable-citation-anchors` convention. ⭐ **The coder checked whether the convention binds a skill file at all, and found a sibling skill already using the form.**
- **R8** — ⭐⭐ **the R2 fix introduced a contradiction** about what the step-7 freeze list holds: one sentence said *list both Q2 cases unconditionally*, the R2 sentence said *the lists are the grep's own returns, nothing hunted beyond them*. **They disagree exactly where a Q2 case is not a grep return — an elided `File(s) under review:` self-entry, confirmed at six sites.** Reconciled inside the ruling: **grep returns, plus anything you *meet* while reading the header block — nothing hunted for beyond the grep and the header block.**

### Accepted residuals and rulings

- **Q1 *"No test (Recommended)"*** — ⛔ **shipped with no test, and said so rather than letting it pass unremarked.** ⭐ The honest reasoning is on the record: a text-presence guard would be *"cheap and weak"*; the test with real value is a **corpus test asserting no `done/*/` record carries a stale self-locator**, which ⛔ **would be RED on day one (46 instances) and stays red until `0168` lands** — making it `0168`'s deliverable, not something this task could ship green.
- **Q2 *"Header block only"*** — body-prose pointers and `File(s) under review:` self-entries are **frozen and listed**.
- **Q3 *"Follow-up brief"*** — `/fkit-task-cancelled` carries the same gap; ⭐ **measured rather than assumed** (all 11 `cancelled/` folders hold `brief.md` only, so there is no live instance) and filed as `0342`.

### ⚠️ Flagged, not actioned

1. **`0168`'s board dependency is stale** — the board emits `depends="0160 — hard."` and `0160` is Done.
2. **`0248`'s `plan.md` and `0218`'s `worklog.md`** carry stale self-locators **and are currently unowned** — outside `0168`'s `review.md`-only scope.
3. **The 44 / 1 / 1 figures are floors.**
4. ⚠️ **One round-3 observation returned to the owner as `NEEDS-DECISION`, not resolved**: the step-5 enumeration and the step-7 sentence are a strict superset/subset of each other for an elided self-path met in the header block that is *not* part of a `File(s) under review:` value. **Re-measured: 12 such lines under `done/`, all 12 inside such a value, zero outside** — so it is an incompleteness with **no live instance**, filed as severity info.

## Related
- [[tasks/remediate-the-dead-brief-paths-in-closed-review-ledger-headers]] — `0168`, the retroactive half this makes stay remediated
- [[tasks/fix-the-scaffold-producer-row-fkit-task-brief-omission]] — `0250`, the specimen folder and the `NEEDS-DECISION` this ruling came from
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, the convention R7 and the definition rest on
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the mover is the producer's alone
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the ruling under which this row was ranked at `P13`, renumbering nothing closed
- [[decisions/adr-014-how-fkit-tests-itself]] — the `node --test` toolchain behind the no-test decision
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[tasks/widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close]] — *added 2026-08-29:* `0229`, the other Sprint 6 edit to this same skill — a **different region** (step 1's stop, not step 5's sweep)
- [[systems/knowledge-base-structure]] — *added 2026-08-29:* the record structure the locator-vs-evidence rule governs
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — *added 2026-08-29:* the board carrying its follow-ups `0326` (the write-time half) and `0342`
