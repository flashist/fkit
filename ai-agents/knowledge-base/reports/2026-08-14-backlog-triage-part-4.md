# Backlog triage, part 4 of 4 — rows `0251`–`0305` (27 rows)

**Read-only assessment, 2026-08-14.** Spawned by `/fkit-sprint-ship-loop` from a live `fkit lead`
session under the owner ruling *"Triage all 108 first, then scope (Recommended)"*. No brief, board,
skill, test or vault file was touched; this report is the only file written.

**Counts — 24 `KEEP`, 3 `STALE-PREMISE`, 0 `SUPERSEDED`, 0 `DONE-IN-FACT`, 0 `DUPLICATE`, 0 `UNCLEAR`.**
The three stale-premise rows are `0262`, `0272` and `0290`; in all three the *work still matters* and
none is proposed for cancellation. Nothing in this range appears already done — every row's target
string, line or defect was found still live on disk. **The `size` column is a rough estimate, not a
measurement**: no row was planned, costed or opened beyond what a triage needs, and several rows whose
briefs are enormous carry small diffs (and the reverse). ⚠️ Eight rows (`0296`, `0298`–`0305`) were
filed today; they were checked for premise validity, **not** searched for staleness that cannot exist yet.

## Verdicts

| id | verdict | theme | size | depends | evidence |
| --- | --- | --- | --- | --- | --- |
| `0251` | KEEP | docs | S | — | `architecture.md:498` still reads *"eight `node --test` contract"*. Disk now holds **21** `test/*.test.js` — the brief measured **19**, so the count has drifted again since filing; the brief already mandates *"re-derive the enumeration from disk, don't patch by five"*, so this strengthens it rather than staling it. |
| `0262` | STALE-PREMISE | field-test | L | — | Two supporting facts falsified. (1) *"nothing Sprint 4 shipped has ever been exercised outside this repo"* — the `0303`/`0304` rows record the owner running `fkit` **v0.2.2 in a real consuming project (`geoconflict`) on 2026-08-14**, where the launch-time structure notice fired with 5 diverging paths. (2) The brief names *"the downstream reporter already on `0.2.1`"*; `VERSION` reads `0.2.2`. ⚠️ **The work is still valid** — the heal/repair leg, `FKIT_CLEANUP_DRY_RUN`, the `fkit update`-then-relaunch sequence and the field report are all still unexercised; only the launch-notice slice was touched. |
| `0270` | KEEP | loop | M | — | Premise intact on disk: `claude/skills/fkit-sprint-ship-loop/SKILL.md` still fixes its Build step to `@fkit-coder` and never reads a brief's `## Owner`. ⚠️ One supporting claim aged — *"that record dies when Sprint 5 archives"*; Sprint 5 archived to `ai-agents/sprints/done/sprint-5.md` and the `0255`/`0258`/`0269` exclusion record **survived**. That weakens the filing rationale, not the question. |
| `0271` | KEEP | testing | M | `0264` — **CLOSED** (`ai-agents/tasks/done/0264-implement-adr-040s-identity-grammar-…/`), dependency discharged | Both named unpinned behaviors still live and still unguarded: the `seen` de-dup at `dashboard.sh:100` (`!(s in seen)) { seen[s] = 1; …`) and the first-line-only narrowing at `:85` (`head -1 "$1"`). ⚠️ Anchors drifted hard — the brief cited `:118` and `:109`, roughly 18–24 lines off; the brief already says re-measure. |
| `0272` | STALE-PREMISE | review | M | — | ⭐ **The canonical stale-premise row, verified not re-derived.** Its brief already carries the dated note at `brief.md:248-266`: step 1 instructed a future agent to flip this row to `➡️ Moved to [Sprint 5](sprint-5.md)`, but *"Sprint 5 was archived on 2026-08-14"* with **no successor** and `select-active` returning `active none`. The pull-into-Sprint-5 placement ruling is therefore unexecutable as written. ⛔ **The underlying ADR-042 D1 work is unaffected and has NOT landed** — `grep -rn "reasoning-only"` across the five named files (`fkit-review`, `fkit-stateful-review`, `fkit-adversarial-review` SKILL.mds, `fkit-adversarial-reviewer.md`, `fkit-reviewer.md`) returns **zero hits**. |
| `0273` | KEEP | review | M | `0272` — **OPEN**, and a hard structural gate the brief says to STOP on | All five `--sandbox read-only` sites still on disk: `claude/README.md:116`, `claude/agents/fkit-adversarial-reviewer.md:28`, `claude/skills/fkit-adversarial-review/SKILL.md:46`, `claude/skills/fkit-stateful-review/SKILL.md:95`, `claude/skills/fkit-review/SKILL.md:61`. |
| `0274` | KEEP | review | S | — | Both target strings verbatim on disk: `0259/review.md:12` *"Both ran. Coverage is FULL — no reviewer skipped, no degradation."* and `0264/review.md:10` *"coverage is **not** partial"*. The 2026-08-11 owner ruling *"Yes — append the corrections"* already discharged the not-authorized-to-start gate. |
| `0275` | KEEP | docs-citations | S | — | `architecture.md:378` still carries the parenthetical `` (`:128-135`; `claude/skills/fkit-adversarial-review/SKILL.md:57,111`) ``. Brief anchored it at `:375`; drifted **+3**, which is itself the argument for the durable quoted-text form the brief requires. |
| `0276` | KEEP | adr | M | — | All named sites live: ADR-041 `:153` *"…check and reports `unresolved-plan-sprint` on every run"*, the second instance at `:172` with its stale `dashboard.sh:905-906` cite, and the echo at `claude/skills/fkit-task-brief/SKILL.md:342` (brief said `:341-343`). The fenced-correct hits at `:235` (S8) and `:273` are also still present, so the ⛔ don't-batch fence still bites. |
| `0277` | KEEP | loop | M | — | The adjacent defect the brief surfaced-but-did-not-scope is still live: `claude/skills/fkit-sprint-ship-loop/SKILL.md:98` reads `bash claude/skills/fkit-status/dashboard.sh <plan>` — `claude/` with **no leading dot**, unrunnable in a consuming project. Brief anchored `:97`; drifted **+1**. |
| `0278` | KEEP | adr | M | — | `claude/skills/fkit-task-brief/SKILL.md:351` unchanged, byte-for-byte at the filed anchor: `` Flip the backlog row to `➡️ Moved to [Sprint N](sprint-N.md) — priority M` ``. The confirm-or-disprove question is untouched. |
| `0279` | KEEP | docs | M | — | Both homes still carry the undefined `N`: `ai-agents/knowledge-base/conventions/status-report-format.md:46` and `claude/scaffold/…/status-report-format.md:48`, and the two `**Status**` cells are still **textually identical**, exactly as the brief measured — so the "land identical in both" instruction still applies. |
| `0280` | KEEP | wiki | S | — | ⚠️ **Re-verified as instructed; the repeatedly-reported claim is STILL TRUE.** `claude/skills/fkit-wiki-lint/SKILL.md:184-185` reads *"this project has no CI"* (`architecture.md:390`: *"There is no CI and no test suite"*; there is no `.github/`) — while `.github/workflows/test.yml` **exists on disk**. All three defects live: D1 (no CI), D2 (no `.github/`) and D3 (the fabricated `architecture.md:390` quote). |
| `0281` | KEEP | adr | S | — | `adr-003-ci-runs-validate-bundles.md:5-7` unchanged: *"**Kept for the record** — the need it identified (fkit has *no* automated verification) is still unmet and still open; see `../architecture.md`."* Status still `superseded`, as the brief requires it to stay. |
| `0284` | KEEP | launcher | L | — | Defect intact at both sites. `claude/fkit-claude.sh:69` still comments *"for git only a low-speed STALL bound, so ls-remote can outlive it"*; `_fkit_reinstall` at `:99-103` still pipes `curl -fsSL "https://raw.githubusercontent.com/…/install.sh" \| sh` at `:102` with **no `--max-time`** — the truncated-installer hazard the brief names. |
| `0286` | KEEP | docs-citations | L | — | `architecture.md` now **622 lines**; the brief measured the post-`0257` file at **620** (from 604). The map has shifted **again** since filing, which is the fifth instance of the very pattern the brief exists to end — and it already mandates re-deriving from disk. Its four preferred predecessors (`0273`/`0275`/`0251`/`0284`) are all still open. |
| `0287` | KEEP | wiki | M | — (soft-ordered after `0273`, deliberately not a `Depends on`) | Its verification-step-1 gate is doing its job: `grep -rn -- '--sandbox read-only' claude/` returns **5 hits**, `0273` is open, so every vault site the brief names is **still accurate today** and running now would replace true statements with false ones — exactly as the brief warns. |
| `0290` | STALE-PREMISE | process | M | — | Its own dated fence is inverted. `brief.md:237` and `:388` assert *"the page carries the `0285` and `0258` blocks but NOT a `0289` block — **`0289` has not run**"* and forbid saying the page carries all three. `0289` is now in `ai-agents/tasks/done/`, and `wiki-vault/wiki/systems/install-and-self-update.md:99` carries its dated `0289` correction block. ⚠️ **The investigation itself is unaffected** — the load-bearing unknown (*was `0254` already closed when the `0285` block was written?*) is untouched, and the third specimen still exists; only the "not yet run" framing must be re-measured at pickup. |
| `0296` | KEEP | process | M | — | Filed 2026-08-14 under the verbatim ruling *"File one task for the mechanism"*; mechanism deliberately open, four candidates including "nothing changes". ⚠️ I did **not** re-run its both-directions sweep — my own loose-form attempt reproduced exactly the T3 false negative the brief documents (prose citations satisfy it), which is corroboration of the brief, not a measurement. |
| `0298` | KEEP | testing | S | — | Filed today. Premise holds: `claude/structure-spec.md:89-90` still lists `CLAUDE.md` and `AGENTS.md` as Table B's only non-`ai-agents/` rows, and `:49` carries the matching class row — so the "exactly 2, and these two by name" assertion is still the right shape. |
| `0299` | KEEP | docs | M | — | All four archived plans still contain the retired-mechanism string: `sprints/done/sprint-2.md` ×4, `sprint-3.md` ×5, `sprint-4.md` ×4, `sprint-5.md` ×3 occurrences of `sprint-*.md`. Nothing has been corrected since filing. |
| `0300` | KEEP | release | M | — | `bin/release.mjs:214` unchanged at the filed anchor: `const branch = branchArg ?? git(["rev-parse", "--abbrev-ref", "HEAD"], { quiet: true }).out;` — still used only as a push target, with no HEAD-vs-branch guard beside the `:107-111` preflight checks. ✅ The filing-time concurrency caveat (*"a reviewer was actively working on `bin/release.mjs`"*) is **discharged**: `git status --porcelain` lists no `bin/` or `test/` change. |
| `0301` | KEEP | conventions | L | — | Filed today. Its in-scope side-fix is still correctly stated: `claude/scaffold/ai-agents/knowledge-base/conventions/README.md:25` still reads *"Seven conventions ship with the scaffold"* and the scaffold directory holds exactly **7** convention pages plus its README — so shipping an eighth still falsifies that sentence, as owner ruling 2 assumed. |
| `0302` | KEEP | launcher | S | — | Filed today under *"Three separate briefs (Recommended)"* and *"Backlog, unranked"*. Untracked on disk (`?? ai-agents/tasks/backlog/0302-…/`), premise is a live launcher behavior. |
| `0303` | KEEP | launcher | L | — | Filed today; design-spec deliverable, no source. Untracked on disk. Its competition note with `0304` is recorded in both briefs, so neither is a duplicate of the other. |
| `0304` | KEEP | roles | M | — | Filed today under the verbatim *"File it as an architect decision (Recommended)"*. Untracked on disk. Decision-only; explicitly forbidden from creating a role. |
| `0305` | KEEP | roles | L | — | Filed today; the owner **explicitly rejected** folding it into `0303` because it applies to every role's scripts. Untracked on disk. Premise re-verifiable: the ownership hook matches `Skill` only, and the three shipped `*.sh` under `claude/skills/` are all producer-owned. |

## Rows I could not judge

**None.** Every one of the 27 resolved to a verdict from the board row plus a targeted on-disk check.
Two honest limits, recorded rather than hidden:

- **`0296`** — I did not independently re-run its both-directions row-less-brief sweep. My loose-form
  attempt returned zero row-less briefs, which reproduces the exact **T3 false negative** the brief
  documents (a prose citation of a task id inside another row satisfies a loose match). That is
  corroboration of the brief's finding, **not** a measurement of the specimen count. The verdict
  `KEEP` rests on the row being filed today under a live owner ruling, not on my sweep.
- **`0262`** — I judged its premise falsified from the `0303`/`0304` board rows' account of the
  owner's `geoconflict` run, not from a field report (none exists). If the owner considers that run
  too thin to count as "exercised outside this repo", the verdict softens to `KEEP` and nothing else
  changes.

## Cross-cutting observations

1. **⭐ Line-number citations drifted on 8 of the 11 rows I re-anchored** — `0251` (19→21 test files),
   `0271` (`:118`→`:100`, `:109`→`:85`), `0275` (`:375`→`:378`), `0276` (`:341-343`→`:342`), `0277`
   (`:97`→`:98`), `0284` (`:99-104`→`:99-103`), `0286` (620→622 lines), `0290` (a fence inverted).
   Not one drift changed a verdict, because **every affected brief already carries a "re-measure at
   implementation time, the durable anchor is the quoted text" instruction.** That convention is
   working. It is also the strongest live evidence for [`0171`](../../tasks/done/0171-write-the-durable-citation-anchors-convention-page/brief.md)
   (the durable-citation-anchors convention page, outside my range) and for `0286`'s recommendation
   on whether a guard test could catch stale citations mechanically.

2. **⚠️ Five rows in my range are excluded from `/fkit-sprint-ship-loop` for the same reason, and
   `0270` is the row that would end it.** `0274` (reviewer-owned), `0287` and the wiki-owned rows all
   carry near-identical paragraphs explaining that the loop's Build step is fixed to `@fkit-coder` and
   never reads `## Owner` — the exact defect `0270` exists to decide. Every sprint that runs without
   `0270` landing re-writes that paragraph into another brief. **Recommend surfacing `0270` early in
   the scoping pass**, ahead of the rows that keep paying its cost.

3. **⚠️ `0272` gates `0273` gates `0287` — a three-deep chain, one hard edge and one soft.** `0273`
   carries a hard `Depends on: 0272` that says STOP; `0287`'s verification step 1 is a soft gate that
   currently and correctly refuses. **`0272` is the only unblocked head of this chain**, and it is
   also the row whose placement ruling went stale. Scoping `0273` or `0287` into a sprint without
   `0272` ahead of them puts two rows in that cannot start.

4. **The "no active sprint" state is load-bearing for more than `0272`.** `0272`'s ruled placement
   (pull into Sprint 5 at `P17`, then move to `P6`) is now unexecutable, and any future
   *"pull row X into the active sprint"* ruling has nowhere to land until a sprint is opened. Rows
   `0302`–`0305` were all filed unranked for this reason and say so.

5. **Six rows are decision-only and produce no code** — `0270`, `0278`, `0290`, `0296`, `0304`,
   `0305` (plus `0303`, which produces a design spec). Three of them (`0303`, `0304`, `0305`) were
   filed today from a single `geoconflict` launch and are mutually entangled by the owner's own
   framing: `0304` says it and `0303` *"may be ALTERNATIVES, NOT COMPLEMENTS"*, and `0305` is the
   general form of one of `0303`'s sub-questions. **They are not duplicates** — the owner ruled each
   separate, twice — **but sequencing them matters more than sequencing the code rows**, and
   `0303` + `0304` landing in either order changes the other's premise.

6. **`0280`'s claim has now been reported at least three times and is still true.** It is a
   single-file, single-paragraph prose fix with no dual-home twin and no manifest regen. Of everything
   in my 27, it has the largest ratio of *times re-reported* to *cost to fix*.

## Open questions for the owner

1. **`0272`'s placement ruling is spent.** With Sprint 5 archived and no successor, the ruled
   *"pull into Sprint 5 at `P17`, then move to `P6`"* cannot be executed. Does it re-target the next
   sprint opened, or lapse back to an ordinary unranked Backlog row?
2. **`0262` — does the `geoconflict` run count?** The owner exercised `fkit v0.2.2` in a real
   consuming project today and the structure notice fired. That falsifies *"nothing Sprint 4 shipped
   has ever been exercised outside this repo"*, but the heal/repair leg was never run. `0262` is the
   task that **discharges the 2026-08-10 promise to personally verify `0245`/`0246`** — so whether
   that promise is now partly met is the owner's call, not a producer's.
3. **`0290`'s fence is inverted and I did not fix it.** Its brief forbids saying *"the page carries
   all three"* on the basis that `0289` had not run; `0289` has now run and the page carries its
   block. The investigation is unaffected, but the brief will mislead whoever picks it up. Should a
   dated correction note be appended (the `0272` treatment), or is re-measuring at pickup enough?
