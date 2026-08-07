# Worklog — 0249: Wiki ingest of the structure-check design report and companion ADR

**Worker:** spawned `fkit-wiki` (Build step of the Sprint 4 driver run, 2026-08-07), executing
`/fkit-wiki-ingest` per the approved `plan.md` (blob `c5b409c14f7f01d433f812ea59861c4ecd99b338`,
hash-verified before any write; match confirmed).

## What was done (all writes under `ai-agents/wiki-vault/`, plus this worklog)

1. **Created** `wiki/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md`
   — the one-line decision; the **six owner rulings verbatim** ("Companion ADR (Recommended)",
   "Plan-level approval (Recommended)", "Yes + yes (Recommended)", "Yes, producer (Recommended)",
   "Yes (Recommended)", "Fold it in (Recommended)"), each dated 2026-08-06 with the channel named
   (`AskUserQuestion`, live `fkit lead` session); the **numbering trap stated in its own warning
   section** (ADR Q1–Q6 as put to the owner ↔ report §10 items 1, 2, 4, 5, 6, 7; §10.3 pre-ruled
   settled scope — and the 0241 page's §Outcome counts in the *report's* numbering); both re-raise
   triggers fired (trigger 2: seven drifting files ≥ 3, dogfood caveat stated); consent model,
   trigger, owning role (producer; vault repairs routed to `fkit-wiki` per ADR-005), spec
   maintenance, manifest fold-in; the ADR's own re-raise boundaries; rejected options cited to the
   report; links to report (by path), ADR-015, ADR-005, the 0241 page, and two systems pages.
2. **ADR-015's vault page** — dated correction (2026-08-07) appended directly below the now-false
   "the companion ADR is not yet recorded" claim, original left byte-identical per the vault's
   frozen-surface convention; Related bullet to the ADR-039 page added.
3. **The 0241 design page** — dated correction below §Outcome's "not yet recorded" claim, including
   the numbering-trap warning and the cross-link ruling (verbatim six live on the ADR-039 page,
   cross-linked, not duplicated — owner-ratified with the plan approval); Related bullet added.
   Verified (not re-done) the page still satisfies verification step 1: report cited by path,
   rulings dated, channel named. **Verify-then-top-up honored: no duplicate page for the
   already-ingested report half.**
4. **`index.md`** — ADR-039 row added to Decisions; the 0241 row's ⚠️ flag struck with a ✅ dated
   correction. Only these two spots touched.
5. **`log.md`** — dated ingest entry appended (append-only; no past entry edited).
6. **Backlinks** — pure-addition Related bullets on `wiki/decisions/adr-005-…`,
   `wiki/systems/install-and-self-update.md`, `wiki/systems/launch-convergence-and-init.md`
   (bidirectionality for the new page's outbound links).

## Verification results (plan §Verification)

1. **PASS** — 0241 page + ADR-039 page jointly carry the design and the six rulings verbatim,
   dated, channel named; report cited by path on both.
2. **PASS in substance, with one stated deviation from the plan's literal grep expectation.**
   `wiki/decisions/adr-039-*.md` exists; ADR-015's page points at it. `grep -rn "not yet recorded"`
   over the vault leaves **three hits outside `log.md`** — but each is a **neutralized original,
   not a live claim**: the index row's struck-through text (correction adjacent) and the
   byte-identical originals on the ADR-015 and 0241 pages, each immediately followed by its dated
   correction. The plan itself delegates page shape to the wiki skill, and the vault's owner-ruled
   frozen-surface convention (0141/0143/0211 line) keeps originals byte-identical — deleting them
   would have violated it. No vault page *claims* the companion ADR is unrecorded.
3. **PASS** — `log.md` carries the dated ingest entry.
4. **PASS for this run's writes; environment caveat stated.** This run's write set is exactly:
   8 vault paths (1 created, 7 modified — `log.md` included) + this worklog. *(Corrected from
   "7 vault paths (1 created, 6 modified)" per review R3, 2026-08-07 — `log.md` had been omitted
   from the count; `log.md`'s own Write-scope line was correct throughout.)* `git status --porcelain` additionally
   shows **pre-existing uncommitted changes from earlier Sprint-4 tasks** (0247/0248 folder moves,
   source/docs edits, the driver-written `plan.md` and driver-flipped `brief.md` of this task) —
   none written by this run. No commit, no re-rank, no task-file move by this run.
   No `:NNN` coordinate anywhere in this run's diff (checked).

## Scope ruling honored

The four Sprint-3-archival stale spots: **OUT**, per the approved plan — they belong to the next
sync/lint's rollover delta. Hygiene rule kept: nothing written describes Sprint 3 as active; no
board path was needed in any new text. Sprint-4 outcomes (0243–0247) and the 0242/0248 done-brief
task pages remain out of scope per the brief; they land via post-ship sync.

## Round-1 amendments (2026-08-07, second bounded unit — owner rulings "Amend now (Recommended)" / "Fix in same pass (Recommended)")

Reviewer Round 1 (ledger rows R1–R3) found three false status claims in this run's own uncommitted
additions and one own-record miscount. Each verified against disk before amending — all CORRECT:
`0243`–`0247` are all in `tasks/done/`, the artifacts exist (`claude/structure-spec.md`,
`claude/structure-manifest.tsv`, `claude/skills/fkit-heal/check.sh` + `repair.sh`,
`structure_notice()` in `claude/fkit-claude.sh` with `test/structure-notice.test.js`). The false
clauses were this ingest's own inventions — not in source ADR-039.

- **R1 fixed:** the "Capability itself (`0243`–`0247`) not yet built" clause deleted from the
  `index.md` ADR-039 row and from the install-and-self-update backlink bullet. Deletion only —
  the `0243`–`0247` **outcomes were NOT ingested** (the brief's ⛔ stands; they land via post-ship
  sync).
- **R2 fixed:** "proposed read-only notice" → "read-only notice" on the launch-convergence
  backlink; the ADR-039 page's "(the launch path itself is unchanged)" → "(the unattended launch
  path gains no new power)", aligned to the source's own wording.
- **R3 fixed:** the write-set count above corrected 7 → 8 (annotated at the claim).

Amended in place — all four lines were uncommitted this-run additions, so no frozen-surface cost.
A dated correction entry was appended to `log.md` naming this ingest's entry as its target;
amendments recorded in the ledger's Coder-response section; ledger `Status: in-review` left for
the reviewer's Round 2.
