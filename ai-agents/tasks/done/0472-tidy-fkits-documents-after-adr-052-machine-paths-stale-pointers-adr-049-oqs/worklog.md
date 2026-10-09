# Worklog — 0472 Tidy fkit's documents after ADR-052 (machine paths, stale pointers, ADR-049 OQs)

Build step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05.
Approved plan: `plan.md` in this folder (blob `b3184235a247e1acca11cb5e01da8ee10b088c0b`, 17762 bytes;
hash re-checked at the start of Build — it matches). `plan.md` was not edited.

## Owner rulings (2026-10-05, `AskUserQuestion` in the lead session)

`plan.md` is never edited; the rulings live here. Option labels quoted as relayed by the driver.

- **Plan gate:** *"Approve"*.
- **OQ1 — note dates:** *"Build day + cite your 10-02 ruling"*. Every note is dated **2026-10-05** (the
  build day) and cites the ruling with its own date — *"owner ruling R6 (2026-10-02)"*, R7 (2026-10-02),
  R2 (2026-09-30). So brief verify step 8's "a 2026-10-02 correction note" matches the ruling date in
  each note, not the note's own date.
- **OQ2 — out-of-scope stale items found at plan time:** *"New small tidy task"*. The 9 items (a)–(i)
  stay **out** of 0472; a producer files them separately. This build did not touch them (including
  `0436`'s and ADR-052 D8 item 3's `0014` example, which stay as written).

## Per-item record

All spots found by content, not line number. Original sentences, quotes included, unchanged everywhere.

1. **Machine paths (R1).** `sprints/done/sprint-11.md` decision row D3 and ADR-051 *§Read first* item 1:
   the absolute aiboard path (with its backticks) → *the sibling aiboard repo*. One token each; no `|`
   added to the D3 cell (pipe count per row unchanged).
2. **Evidence log** (`reports/2026-09-26-evidence-log-for-adr-051-aiboard-as-the-store.md`): a
   `⏱ Closed, 2026-10-05 — task 0472` blockquote after the `**For:**` line, quoting ADR-052's *Effect on
   existing ADRs* table ("The evidence log is **closed, not deleted**"). E3 row "The reader's snapshot
   cache does not notice renamed task folders": **Open** kept; dated annotation appended in the same cell
   (R3). No `|` in the added text.
3. **`0415`'s brief:** one sub-bullet under the "Same file as `0413`" bullet — `0413` since cancelled
   under ADR-052 (2026-09-30); "still Backlog" was true when written.
4. **`0404` pointers.** ADR-049: both code paths `tasks/backlog/0404-` → `tasks/done/0404-` (the
   "Reproduced, and the scripts are preserved" paragraph, plus a dated "repointed … discharged" line;
   the *§Related* "The preserved audit spike" bullet, plus a continuation line). Verdict §8's "ADDED
   2026-09-18" blockquote and ADR-051's references: link **text** only, `backlog` → `done`; targets
   untouched (R5).
5. **ADR-049 OQ-1/OQ-2 (R2):** a `⏱ Resolved, 2026-10-05 … owner ruling R2 (2026-09-30)` blockquote
   between the OQ-2 bullet and "**Closed, with the reason:**", in the architect's wording (no "the
   browser governs", no "permissively"). One continuation line under the Status bullet pointing to it;
   "remain his and unanswered" and the other "still unanswered" mentions unchanged.
6. **Records blaming `331f298` (R6).** Added lines only in every item-6 file. One primary note per file
   naming that file's repeats by section + quoted phrase:
   - data-model evaluation: `⏱ CORRECTION` blockquote right under the §4.1.1 heading, plus one pointer
     sub-bullet under §7's "independently confirms §4.1.1's born-wrong finding" bullet;
   - 2026-09-18 verdict: note after the "What this says" paragraph, naming *Point 1 — Where status
     lives*'s "Do:" bullet ("born-wrong records"); the timestamp-backfill bullet left alone;
   - decision document: note after §6's "Why it must be paranoid" paragraph, naming §8.4's risk-table
     row 1;
   - eval single-task-store: note after "Why the paranoia is earned", naming the *Drawbacks and risks*
     table row 1;
   - eval task-ids: note after §3.5's first paragraph (the "184 files" size reference left alone);
   - ADR-033: correction blockquote after "A correction to the record…", naming the three wrong
     passages verbatim;
   - ADR-049: correction paragraph after "What it means, stated against interest" (quote unchanged; C5
     stands);
   - ADR-052: sub-bullet under the "fkit's last bulk move (commit `331f298` …)" bullet; also covers
     *Risks* item 1;
   - backlog briefs `0407` (inside the re-scope blockquote) and `0435`, `0436`, `0437`, `0438`, `0440`,
     `0441`, `0442` (new paragraph after "Trial runs only"): a 1–2 line note citing "the correction note
     under ADR-052's `331f298` bullet" by phrase, no coordinates.
7. **ADR-033, R7:** sub-bullet under the "`0014` … deliberately left alone" bullet (bullet text
   unchanged), quoting the owner's confirmation and linking `0014`'s brief (`../../tasks/done/0014-…`,
   resolves).
8. **`claude/skills/fkit-task-ship-loop/SKILL.md`:** in the ⛔ STOP bullet's parenthetical,
   `fkit-coder.md:109-113` → `fkit-coder.md:165`. Re-checked at build: the line holding "**But: a
   genuinely NEW architecture decision goes to the OWNER.**" in `claude/agents/fkit-coder.md` is still
   165. A pre-edit copy was saved to the session scratchpad first; the diff against it is exactly that
   one token (0480's uncommitted hunks untouched). `claude/fkit-claude-init.sh .` re-run; the
   `.claude/` copy is byte-identical to the canonical file; `git status` unchanged by the refresh.

## Decision log (calls made without asking)

Every call below is a wording choice inside notes this task adds; none widens scope or changes a file
outside the plan's §3 list.

- **D1 — fact-core wording, obvious winner within intent.** The plan's shared core said the status
  field "went wrong at creation and stayed wrong through close". Git shows `0021`/`0041` were created
  in `backlog/` (`54abc8f`, `e9c8575` add them under `tasks/backlog/`), where `🔲 Backlog` was correct;
  they went wrong when the owner's close commits moved them unedited. Only `0014` (created in `done/`
  at `cd19aef`) was wrong at creation. Changed to the brief's own phrase: "went wrong at close or at
  creation (`0021`/`0041` were closed without it being updated; `0014` was created inside `done/` with
  it wrong)". Same fix in the ADR-049 and backlog-brief short forms ("survived close" → "was not updated
  at close"). Qualified: the plan says the core is "worded per file"; the brief (verify-backed scope)
  uses "at close or creation"; the plan's wording would have put a new inaccuracy into a correction
  note. Applied in: verdict, data-model evaluation, the three 2026-09-30 reports, ADR-049, ADR-052,
  `0407`, `0435`–`0438`, `0440`–`0442`.
- **D2 — one extra repeat named, obvious winner within intent.** The data-model evaluation's
  *Point 10 — History and auditability* (the report's own section, not Codex's) cites "§4.1.1's *"59 days"*". The plan's list
  missed it. Added to the same primary note's list of repeats. Qualified: same note, already-listed
  file, no new edit point; the plan's §4 already folds grep-found repeats into that note this way.
- **D3 — exact quotation, mechanical.** The data-model note quotes the real sentence "At close time
  there was no `## Status` field to forget" (the plan abbreviated it).
- **D4 — per-file wording of "D8 is unchanged", mechanical.** Decision document: "The contract below
  (ADR-052 D8) is unchanged" (the document predates ADR-052's D-numbers). Single-task-store eval: "The
  safeguards this section argues for are unchanged". Task-ids eval: "The risk comparison below is
  unchanged". Each also says the note corrects the cited precedent only.
- **D5 — section names for repeats, mechanical.** Risk rows named by their real headings (§8.4; the
  *Drawbacks and risks* table) and the verdict's "Do:" bullet by *Point 1 — Where status lives*,
  found by grep after insertion.
- **D6 — ADR-033 "does not vindicate 'drifted after close'", mechanical.** Rendered as "This does not
  vindicate the earlier label "drifted after close" either: the value never changed after close", plus
  "So the field existed at close and was not updated by it."

- **D7 — review R1, verified-`CORRECT` + mechanical/localized + in-plan (Process-review worker,
  `fkit-sprint-ship-loop`, 2026-10-05, standing approval).** Answers `review.md` R1 (also the Verify
  step's observation). Changed: in the six notes carrying the shared fact core (ADR-052's `331f298`
  sub-bullet; the 2026-09-18 verdict; the data-model evaluation's §4.1.1 correction; the decision
  document; the single-task-store eval; the task-ids eval), "Nothing changed the field until the
  2026-09-18 repair." became "…until the repair recorded on 2026-09-18 (committed 2026-09-20 in
  `add6a07`), and that repair fixed `0021`/`0041` only; `0014` was left alone then and corrected on
  2026-10-02 (`05d4891`)." Why it qualified: git confirms `add6a07` (dated 2026-09-20; the records
  date the repair 2026-09-18) flips only `0021`/`0041` and `05d4891` flips `0014`; one sentence per
  note, inside lines this task added; the plan's core is "worded per file". ADR-033's note left
  alone: it is about `0021`/`0041` only and correct.
- **D8 — review R2, verified-`CORRECT` + mechanical + in-plan.** Answers R2. Changed: every 0472
  note's ruling label to the plan's ground-rule form "task 0472's owner ruling R6/R2/R7 (date)"
  (ADR-033 ×2, ADR-049 ×2, ADR-052, the verdict, the data-model evaluation, the three 2026-09-30
  reports, `0407`, `0435`–`0438`, `0440`–`0442`); in ADR-052's note "owner R2's" → "ADR-052's own
  R2". Why it qualified: `plan.md` § "1. Ground rules for the build" prescribes exactly this form; the
  build had followed the plan's per-item templates instead. Label-only, in added lines.
- **D9 — review R3, verified-`CORRECT` + mechanical + in-plan.** Answers R3. Changed: ADR-049's OQ
  note now quotes C4 verbatim, "no fkit and no framework at all" (was the paraphrase "no fkit, no
  framework" in quote marks). Why it qualified: one phrase in an added line; the plan's rule is
  word-for-word fidelity of quotes.
- No obvious-winner calls in this process-review round.

## Checks

Run in a scratch copy of the working tree (to avoid racing the producer), after all edits:

- `npm run test:unit` — **1048 pass, 0 fail** (24 suites). Covers brief steps 1, 2 and 6's
  `node --test` half (`reference-integrity`, `adr-number-uniqueness`, coordination-citation guard, all
  `test/*.test.js`).
- `worklog.md` itself was written after that run; `npm run test:docs` re-run on a fresh copy that
  includes it — **372 pass, 0 fail**.
- Brief step 3: `/User[s]/` → 0 hits in `sprints/done/sprint-11.md` and ADR-051; 0 machine paths in any
  added line.
- Brief step 4: `tasks/backlog/0404` → 0 hits in ADR-049, ADR-051, the 2026-09-18 verdict.
- Brief step 8: every file with a blaming hit for `331f298` / `born wrong` / `born-wrong` / `59 days` /
  `two months` carries a task-0472 note; the leave-alone files (`0079`, `0118`, `0119`, `0132`, `0160`,
  `0359`, `dual-home-parity.md`, the 2026-08-01 report, the verdict's timestamp-backfill bullet) are
  untouched. `0014`'s brief has one hit; it states the facts correctly ("only renamed") and is not
  touched.
- Diff checks: `git diff --numstat` shows 0 removed lines in every item-6/7-only file; the only removed
  lines are the named swaps (sprint-11 D3, ADR-051 ×2, evidence-log E3 cell, verdict link text,
  ADR-049 ×2, SKILL.md one token vs the snapshot). Step 9: ADR-033's `0014` bullet unchanged, R7 note
  under it.
- **Skipped: full `npm test` / prove-red.** No file named in `test/prove-red.sh` is touched; CONTRIBUTING's
  table puts this change in `test:unit`. The Verify step re-checks.

## Wiki sync follow-up (for `fkit-wiki`; not edited here)

- `wiki/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md` — the `331f298` story; R7.
- `wiki/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md`
  — the `331f298` precedent (two places per the brief).
- `wiki/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md`
  — OQ-1/OQ-2 resolved; the `0404` path; the "born wrong" correction.
- `wiki/tasks/build-fkit-reconnect-tooling.md`, `wiki/tasks/fix-claude-agents-md-placeholder-text.md` —
  the born-wrong claim (per the brief).
- `wiki/tasks/align-conventions-readme-enforcement-item-live-vs-scaffold.md` — `0014` now `✅ Done`.
- `wiki/tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam.md` — names
  `tasks/backlog/0404`.
- Possibly others mirroring the edited reports (not checked page by page).

## Verify

Verify step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05. Read-only
except this section. Result: **pass**.

- **sha1 of the 21 changed files** (plan §3): recorded at start and end — **identical** (no write
  during verify; a reviewer was reading in parallel). `plan.md` blob still `b3184235…`.
- **`npm run test:unit`** in a fresh scratch copy of the working tree (with `.git`, taken before this
  section was written): **1048 pass, 0 fail** (24 suites), exit 0. CONTRIBUTING row: `ai-agents/` docs
  (`test:docs`) + a `claude/` `.md` not named in prove-red → heaviest row `test:unit`.
  `grep -F 'fkit-task-ship-loop' test/prove-red.sh` → no hits (exit 1).
- **Skipped: full `npm test` / prove-red** — the table does not require it (no file prove-red names
  is touched; no non-`.md` `claude/`, `test/`, `package.json` change in this task). **Skipped:
  `npm run test:docs` on a copy that includes this `## Verify` section** — `test:unit` is a superset
  of `test:docs` and ran before this section existed; this section adds no links or `path:line` cites.
- **Brief step 3:** no absolute machine path in `sprints/done/sprint-11.md` or ADR-051; none in any
  added line of the 21 files.
- **Brief step 4:** `tasks/backlog/0404` → 0 hits in ADR-049, ADR-051, the 2026-09-18 verdict.
- **Brief steps 5/7 (`git diff --numstat`):** 0 removed lines in every item-6/7-only file (ADR-033,
  ADR-052, the data-model evaluation, the three 2026-09-30 reports, `0407`, `0435`–`0438`,
  `0440`–`0442`, `0415`). Removed lines elsewhere, checked by `--word-diff`, are exactly the named
  swaps: sprint-11 D3 (path → "the sibling aiboard repo"), ADR-051 ×2 (path; link text
  `backlog`→`done`), ADR-049 ×2 (`backlog`→`done` in both code paths), verdict ×1 (link text; target
  unchanged), evidence-log E3 ×1 (pure append in the cell; pipe count unchanged).
- **Item 8:** `SKILL.md` vs the build's pre-edit snapshot → one token, `109-113` → `165`; its other
  diff hunks vs HEAD are `0480`'s. `claude/agents/fkit-coder.md:165` reads "**But: a genuinely NEW
  architecture decision goes to the OWNER.**" `.claude/` copy byte-identical to the canonical file.
- **Brief step 8:** every file with a blaming hit (`331f298` / `born wrong` / `born-wrong` /
  `59 days` / `two months`) carries a task-0472 note; leave-alone files (`0079`, `0118`, `0119`,
  `0132`, `0160`, `0359`, `dual-home-parity.md`, the 2026-08-01 report) have no diff; the verdict's
  timestamp-backfill bullet is untouched (that file's only removed line is the §8 link text). `0014`'s
  brief hit says "only renamed" — correct, untouched.
- **Brief step 9:** ADR-033's `0014` bullet has no removed lines; the R7 sub-bullet sits directly
  under it. The owner quote it cites is recorded in `0014`'s brief (wrapped over two lines there).
- **D1 fact check (git):** `54abc8f` and `e9c8575` add `0021`/`0041` under `tasks/backlog/`,
  `## Status` `🔲 Backlog`; `f7b23f4`/`6daf3cc` are R100 renames `backlog/`→`done/` plus a sprint-plan
  edit (blob identical from creation through close); `cd19aef` adds `0014` directly in `done/` reading
  `🔲 Backlog`; `331f298` is R100 for all three. `## Status` stays `🔲 Backlog` through `ada3e8b`,
  `185b321`, `eeb52b8`; `0021`/`0041` become `✅ Done` in `add6a07` (committed 2026-09-20; the records
  date that repair 2026-09-18); `0014` in `05d4891` (2026-10-02). Spans 70/64 days check out. **The
  notes state these facts correctly**, and D1's change was right: the plan's "went wrong at creation"
  would have been false for `0021`/`0041`.
- **Observation (not a failure):** the shared core's "Nothing changed the field until the 2026-09-18
  repair" follows "all three briefs"; for `0014` the 2026-09-18 repair did not change it either (fixed
  2026-10-02). True as written, but a reader could take it to mean `0014` was repaired on 2026-09-18.
  Only the data-model note and ADR-033's R7 sub-bullet say `0014` was fixed 2026-10-02. Left for the
  reviewer/owner; verify writes no fix.

## Process-review (R1–R3), 2026-10-05

Spawned `fkit-coder` under `fkit-sprint-ship-loop`, standing approval. R1–R3 all verified `CORRECT`,
fixed (decision log D7–D9); `review.md` Coder response written, `Status: closed-out`. Checks after the
edits: `npm run test:docs` in a scratch copy of the working tree (including this task folder's
`review.md`/`worklog.md` edits, before this section) — **372 pass, 0 fail**; on the real tree
`node --test` of the coordination-citation, reference-integrity and ADR-number-uniqueness tests —
**57 pass, 0 fail**; `git diff --numstat` identical before and after the fixes (0 removed lines in
every item-6/7-only file; ADR-049 still 2, the verdict still 1 — the item-4 swaps). Skipped: full
`npm test` / prove-red (no prove-red file touched); `test:unit` not re-run (docs-only wording edits;
`test:docs` is the matching CONTRIBUTING row).
