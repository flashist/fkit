# Sprint 5 — Fix what a real project found, and make a release safe to cut

> ## 🔒 CLOSED — 2026-08-13.
>
> **Sprint 5 was archived by OWNER RULING, 2026-08-13**, given via `AskUserQuestion` in a live
> `fkit lead` session — a selection from the question's option list, **the option label is the
> verbatim text**: **"Move it — as its own scoped task"**, which ruled that the archival be performed
> as its own scoped brief rather than inline, because the move is far larger than a banner edit looks.
> That brief is `0294`. A **second owner ruling of the same session**, same channel, ruled this
> banner's wording — verbatim **"Omit the successor clause"**. ⚠️ **There is no Sprint 6, and none was
> opened at archival**, so this banner names no successor. ⛔ That is the **no-successor case, ruled on
> its own facts** — it establishes **no convention**: the four earlier archives each rolled over into a
> real successor, and that remains the normal case. Executed 2026-08-14 by a spawned `fkit-producer`
> with no owner channel, which asked nothing and decided nothing beyond the mechanics of those rulings.
>
> **Authority, stated first and in full.** This board exists by an **owner ruling given 2026-08-10 via
> `AskUserQuestion` in a live session** — a selection from the question's option list, **the option
> label is the verbatim text**: **"Dashboard + all of 0252-0258"**. Ten tasks: three new briefs
> (`0259`, `0260`, `0261`) scoping the downstream dashboard defect, plus **all seven** of the
> 2026-08-08 release-hygiene cluster.
>
> A **second owner ruling of the same session**, same channel, archived Sprint 4 — verbatim
> **"Archive it now, unverified"**. That archival is recorded in full on
> [`done/sprint-4.md`](sprint-4.md)'s banner, and it is what leaves exactly one `sprint-*.md`
> eligible as the active sprint. *(Mechanism corrected 2026-09-04 per
> [ADR-041](../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md):
> `/fkit-status` selects by each plan's **resolved identity**, not by a `sprint-*.md` filename glob. The
> count above is left unchanged.)*
>
> Executed by a spawned `fkit-producer` with no owner channel, which asked nothing and decided nothing
> beyond the mechanics of these two rulings **and the ranking** — see §"How this board was ranked".
>
> **⚠️ THIS BOARD SUPERSEDES A GATE THE OWNER SET TWO DAYS AGO. Both halves of that gate are
> UNSATISFIED, and neither was waived quietly.** The owner's ruling of **2026-08-08** — recorded as a
> dated `✅ OWNER RULING` bullet at the end of [`backlog.md`](../backlog.md)'s `## Notes`, **left
> byte-identical**, with a dated superseding note appended beneath it — held this whole cluster off any
> sprint on two stated reasons. Where each stands today:
>
> 1. **"Sprint 5 gets scoped after the real-project stale-install test reports."** ⚠️ **That test was
>    NOT run.** No stale-install test has been performed and none is recorded. The gate was **lifted**,
>    not met.
> 2. **"The owner is personally verifying `0245` and `0246`."** ⚠️ **Neither was owner-verified.** All
>    eight Sprint 4 rows still read `✅ Done (agent-closed — not owner-verified)`, and that marker
>    stays on every one of them by the archival ruling.
>
> **Why the owner lifted it.** A downstream project — a game, ~50 tasks, running fkit `0.2.1` — filed a
> defect report against `claude/skills/fkit-status/dashboard.sh`. It is a real defect in shipped code,
> found by a real user, and the fix is now the priority. The report is copied into this repo verbatim
> at
> [`knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`](../../knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md).
>
> **What that costs, stated plainly rather than implied:** this board is being built on an unverified
> Sprint 4. If a regression surfaces, which board it came from is genuinely ambiguous — that is exactly
> the risk the 2026-08-08 gate was protecting against, and the owner accepted it knowingly.
>
> **⚠️ WIDENED 2026-08-10 BY A SECOND OWNER RULING — this banner's "Ten tasks" is now SIX SHORT.** The
> paragraph above is left **byte-identical**; *"Ten tasks"* was true when written and is now false.
> **The board carries sixteen rows.** `0264`–`0269` were added by an owner ruling of the same day —
> ADR-040's and ADR-041's implementation follow-ons are filed and **ranked into Sprint 5** — because the
> founding ten **decided** the downstream defect and never **fixed** it. Full authority, the scope hole,
> and the ranking reconciliation are in §"Addendum — six implementation rows added out of band
> (2026-08-10)".
>
> **✅ AMENDED 2026-08-10 — numbered fact 2 above is left byte-identical and is now INCOMPLETE.** It
> is still literally true that neither `0245` nor `0246` was owner-verified, and it stays true. What it
> does not say — because it was not yet ruled — is that the **verification promise now has a home that
> discharges it.** Owner ruling of the same day, given via `AskUserQuestion` in a live session, **the
> option label is the verbatim text**: **"0262 replaces it — record that (Recommended)"**. Option
> description as presented to the owner, verbatim: *"The stale-install test on a real project exercises
> the same consent-gated repair path 0245/0246 were closed against, arguably harder than a fixture
> check would. Record explicitly that 0262 discharges the promise, so the record doesn't carry an open
> commitment nobody intends to meet. Consequence: 0245/0246 stay closed as agent-closed — not
> owner-verified, permanently."*
> **What follows from it:**
> [`0262`](../../tasks/backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md)
> **carries the 2026-08-08 verification promise and discharges it on completion**; **no separate
> personal owner verification of `0245`/`0246` is intended or owed**; ⛔ **the eight Sprint 4 rows keep
> `(agent-closed — not owner-verified)` PERMANENTLY** — `0262` completing does not retroactively verify
> them and nothing may be edited to suggest otherwise. ⚠️ **`0262` is on the Backlog board,
> deliberately unscheduled, and does NOT gate the release — discharging a promise is not scheduling
> it.** ⚠️ **Numbered fact 1 above is untouched and still true:** the stale-install test **has not been
> run**, so until `0262` actually runs the promise is **assigned, not met**. See §"Open questions for
> the owner" 2 and [`backlog.md`](../backlog.md)'s `## Notes`.

**Goal:** Fix the defect a real downstream project found in shipped code, and make the release that
carries the fix safe to cut. Two halves, one sprint:

1. **The dashboard defect** (`0259`–`0261`) — `PLAN_SPRINT` resolves **empty** for every sprint-plan
   naming convention a real project uses, which makes drift rule 1 inert: phantom drift on a numbered
   sprint board, silence on the highest-value drift a backlog-shaped board can surface. A red fixture
   first, then two decisions.
2. **Release hygiene** (`0252`–`0258`) — the seven-task cluster filed 2026-08-08: nothing gates a
   release on a green tree, the update banner tells every installed user `vX → vX`, the verify command
   the releaser is handed does not run, and the release story is written down nowhere.

## ⚠️ Ranks on this board start clean at P1

**This is a fresh board and its rank numbering restarts at `P1`.** It does **not** continue from
Sprint 4's `P8`. **Cite a rank with its board** — `Sprint 5 P3`, never a bare `P3`. Sprint 4's ranks
are unchanged and stay readable at [`done/sprint-4.md`](sprint-4.md).

**ADR-035's wall does not apply here yet.** No row on this board is closed, so every rank below was
assigned **on merit**, freely, honoring every dependency edge. The moment a row here closes, its rank
freezes and the wall applies again — a closed row is a wall, not a step.

**⚠️ CORRECTED 2026-08-10 — THE WALL NOW APPLIES. The paragraph above is left byte-identical; its
first sentence was true when written and is now false.** `P2` (`0260`) and `P3` (`0261`) closed on
2026-08-10, both `✅ Done (agent-closed — not owner-verified)`, by a spawned `fkit-producer` running
`/fkit-task-done`. **Their ranks are now frozen** — the paragraph's own closing sentence is what
predicted this, and it is now in force. ⚠️ **Read this before touching any rank on this board:** the
board is no longer rank-free, so `/fkit-task-brief` step 5's insertion arithmetic and
[ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
are live. **What that does and does not block is worked out at §"Open questions" 5**, which carries its
own dated correction — in short, the two closed rows sit **above** the `P4`–`P9` insertion window the
owner's ruling names, so that specific insertion still renumbers nothing closed. **Do not generalize
that to any other rank change on this board.**

**✅ EXECUTED 2026-08-11 — the move the paragraph above anticipated has HAPPENED. The paragraph is
left byte-identical.** The owner ruled the re-rank in a live `fkit producer` session and it was
carried out: `0264`–`0269` moved from `P11`–`P16` to **`P4`–`P9`**, displacing the seven
release-hygiene rows down six places each. **`0260` (`P2`) and `0261` (`P3`) were not touched** — the
frozen ranks stayed frozen, and the downward check confirmed no closed row sat below the move.
⚠️ **One correction to the wording above, for anyone reasoning from it later: this was a MOVE of rows
already on the board, not an *insertion*.** ADR-035 bans mid-board insertions; it permits an
owner-ruled move within a contiguous run of open rows, which is what this was. The distinction is the
whole reason it was allowed. ⛔ **Every rank on this board below `P3` now differs from what the
sections beneath describe** — read §"Addendum — the owner-ruled re-rank of 2026-08-11" for the full
old→new map before citing any rank from §"How this board was ranked".

**No addendum note accompanies these ten rows, deliberately.** The out-of-band addendum convention
exists to explain an addition to a board that was already planned. All ten rows **are** this board's
founding scope, named in the owner's ruling; there is nothing out of band to explain.

## Status

> ⛔ **BEFORE YOU DERIVE AN ELIGIBLE SET FROM THIS TABLE — THREE ROWS ARE OUT OF THE
> `/fkit-sprint-ship-loop` RUN, by owner rulings of 2026-08-10: `0255` (`P9`), `0258` (`P10`),
> `0269` (`P16`).** A `fkit lead` session driving this board must **exclude them at step 1**, the
> same way it excludes its per-run skip memory.
> ⚠️ **They stay `🔲 Backlog`, stay in Sprint 5, and keep their ranks.** This is an exclusion from
> *this loop run* — **not a block, not a deprioritisation, not a descope.** Nothing here parks them.
> Authority, the verbatim rulings, the per-row reasons and the rejected alternative are the **first
> bullet of `## Notes`**.
>
> ⚠️ **CORRECTED 2026-08-11 — the three parenthesised ranks above are STALE. The paragraph is left
> byte-identical and the exclusion itself is UNCHANGED.** The rows are the same three rows — **name
> them by ID, not by rank**: `0255`, `0258`, `0269`. They now sit at **`P15`**, **`P16`** and **`P9`**
> respectively, moved by the owner-ruled re-rank of 2026-08-11 (§"Addendum — the owner-ruled re-rank
> of 2026-08-11"), **not** by anything to do with this exclusion. ⛔ **`0269` is the one that matters
> to a driver: it is no longer the bottom row of the board, it is `P9`** — a rank-ordered pass now
> reaches it early, and it must still be excluded. The sentence *"keep their ranks"* was true of the
> exclusion when written and stays true **of the exclusion**; a later, separate authority moved them.
>
> ✅ **NOTE 2026-08-13 — `0269` HAS SHIPPED. Everything above is left byte-identical, and the
> 2026-08-10 exclusion was NEVER VIOLATED.** `0269` closed **2026-08-13** as
> `✅ Done (agent-closed — not owner-verified)`. It did **not** run through
> `/fkit-sprint-ship-loop` — it ran via a **spawned `@fkit-wiki` librarian** during an
> owner-requested wiki sync + lint, which is the `fkit wiki` route the ruling itself named. The
> ruling said the loop could not drive this row; **the loop never drove it.** A different,
> sanctioned route did. Its own gate was checked and met before ingest: **ADR-040 and ADR-041 both
> read `accepted`** on disk. ⛔ **This reopens nothing.** `0255` and `0258` are untouched — both
> still `🔲 Backlog`, both still excluded from a loop run, and both rulings stand word for word.
> ⚠️ **For a driver deriving an eligible set today: two rows to exclude, not three** — `0255` and
> `0258`. `0269` is no longer eligible for any run, because it is `✅ Done`.
>
> ✅ **NOTE 2026-08-13 (later the same day) — `0255` AND `0258` HAVE NOW SHIPPED TOO. Everything
> above is left byte-identical, and the 2026-08-10 exclusion was HONORED, not bypassed.** Both rows
> closed **2026-08-13** as `✅ Done (agent-closed — not owner-verified)`. The sentences above —
> *"both still `🔲 Backlog`"* and *"two rows to exclude, not three"* — are the **record of the state
> when that earlier note was written**; the **Status column is the live state**. ⛔ **Neither row was
> driven by `/fkit-sprint-ship-loop`.** Each ran by the route its own cell names:
> - **`0258`** ran via a **spawned `@fkit-wiki` librarian** — *"Runs in a `fkit wiki` session
>   instead."*
> - **`0255`** ran in a live **owner-present** session — *"Runs in an owner-present session
>   instead."* — and it got **both owner beats the loop had no place for**: a recommendation from
>   **`@fkit-architect`**, then the **owner's own sign-off before the ADR was written**, given via
>   `AskUserQuestion`, **verbatim option label "Sign off — Option 4"**, recorded in
>   [`ADR-043`](../../knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md)
>   §"Owner sign-off". That is precisely what the ruling asked for.
>
> ⚠️ **The close marker on both rows is still `agent-closed — not owner-verified`** — the owner ruled
> the *decision* `0255` raised; nobody owner-verified either *close*. ⛔ **This reopens nothing and
> softens nothing:** every ruling above stands word for word, and no rank or status was changed to
> record this note.
> ⚠️ **For a driver deriving an eligible set today: ZERO rows to exclude** — all three excluded rows
> (`0255`, `0258`, `0269`) are `✅ Done` and no longer eligible for any run. Every row on this board
> is `✅ Done`.

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | Add the **red fixture** — a product-prefixed H1 on a `plan-sprint-N.md` filename must keep drift rule 1 alive *(**filed 2026-08-10 on the owner's Sprint 5 scope ruling**, verbatim **"Dashboard + all of 0252-0258"**; the smallest useful change in the [downstream defect report](../../knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md) §5 — one new case in `test/dashboard-contract.test.js`, plan file named `plan-sprint-4.md`, H1 `# <Product> — Sprint 4 — <theme>`, asserting drift rule 1 **still skips**; **it goes RED on today's code** and that is the deliverable; **why our suite missed this**: the existing `R8: a prose H1 falls back to the filename, keeping rule 1 alive` uses a fixture named `sprint-1.md`, so it proves the fallback works when the filename *already matches the pattern the fallback expects* — green for a fixture-shaped reason; build it by hand like the companion `hardening.md` test, because the shared `fixture()` helper names the plan file and **the filename is the thing under test**; draw the H1 shape from the report's **§7 table** of 12 real plan names, verbatim; **⚠️ this task ships `npm test` RED on purpose** and must say so loudly in its close — green does not return until `0260`'s decision and its implementation follow-on land; ⛔ **no edit to `dashboard.sh`** (the fix shape is undecided — `0260`), ⛔ no edit to `fkit-status/SKILL.md`'s glob (`0261`), ⛔ do not "fix" the two existing R8 tests — both are correct for what they assert, ⛔ no new devDependency (ADR-014), ⛔ no `wiki-vault/` write (ADR-005); soft ordering **before `0260`, owner-ruled 2026-08-10**, deliberately **not** a `Depends on`; owner: fkit-coder)* | [`0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename`](../../tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | **Decide the `PLAN_SPRINT` resolution strategy** — under the letter-suffix constraint; ADR output *(**filed 2026-08-10 on the owner's Sprint 5 scope ruling**; decides what makes `0259`'s red fixture pass; **⚠️ THE HARD CONSTRAINT, report §6, non-negotiable and to be written into the ADR in these terms — a WRONG identity is strictly WORSE than NO identity**: the downstream repo has `plan-sprint-4b.md` **and** `plan-sprint-4c.md` as real, distinct sprint identities alongside a separate `plan-sprint-4.md`, so a naive numeric widening resolves `4c` → `Sprint 4`, which makes rule 1 **live and wrong** and silently skips the status cross-check on that whole board — a genuine **silent** failure, where today's is loud; and `hotfix-post-sprint2.md` (H1 `# Geoconflict — Post-Sprint 2 Hotfix Tasks`) is deliberately **not** Sprint 2, so any *"find `Sprint <N>` anywhere"* matcher is disqualified — **prose containment is not identity**; any landed pattern must **either handle the letter suffix or refuse the file and report `unresolved-plan-sprint`**; **REQUIREMENT, non-negotiable**: the ADR must bind a regression guard proving a genuinely unidentifiable plan **still** reports `unresolved-plan-sprint` — ⛔ the fix must not convert a loud failure into a quiet one; resolve **all twelve** §7 filenames under the chosen pattern and record each outcome, including the ones that must stay empty; ⛔ **decision output only — no `dashboard.sh` edit, no test edit, and do NOT file the implementation brief** (producer's act), ⛔ do not touch `STATUS_HEADING_RE` (the reporter names it their own defect and asks us not to), ⛔ do not change the `backlog` basename special case (owner-ruled 2026-07-18), ⛔ no `wiki-vault/` write; coordinates with `0261`, **do not merge**; soft ordering **after `0259`, owner-ruled 2026-08-10**, deliberately **not** a `Depends on`; owner: fkit-architect)* | [`0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint`](../../tasks/done/0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P3 | **Decide whether the active-sprint `sprint-*.md` glob widens**, or projects are told to name plans `sprint-N.md` — ADR output *(**filed 2026-08-10 on the owner's Sprint 5 scope ruling**; report §8, which the reporter explicitly declined to decide for us — *"a product call we are not making for you"*; **⚠️ THE REPORT UNDER-STATES THIS AND THE ADR MUST CARRY THE COMPOUNDED FORM — on the downstream repo §2 and §8 land on the SAME FILE**: their plans are `plan-sprint-N.md`, so the only file matching `fkit-status/SKILL.md`'s `sprint-*.md` glob is **`sprint-backlog.md`** — a board of explicitly *unscheduled* work, selected as "the active sprint" by a bare `/fkit-status`; and that same file's basename is `sprint-backlog`, **not** `backlog`, so the `dashboard.sh` special case does **not** fire and its identity resolves empty too — **net: the wrong board is selected AND that board silently loses the "scheduled but still parked on the unscheduled board" check**, which the code's own comment calls *"the single highest-value drift this board can surface"*; ⚠️ weigh honestly that a widened glob which catches `sprint-backlog.md` catches **our own `backlog.md`** under most widenings — turning unscheduled work into the reported active sprint, exactly what `backlog.md`'s header forbids; must rule on the compounded `sprint-backlog.md` case by name, say in one sentence whether this is fkit's problem or the project's, and **name an enforcement point or state there is none** (a naming rule living only in a template header is a rule nobody enforces); ⛔ **decision output only** — no edit to `fkit-status/SKILL.md`, `dashboard.sh`, `structure-spec.md`, `backlog.md` or the scaffold, ⛔ **do not rename `backlog.md`** (its name is load-bearing), ⛔ do not decide `0260`'s matcher here, ⛔ do not file the implementation brief, ⛔ no `wiki-vault/` write; ⚠️ **may need owner sign-off before it is actionable** — "tell projects how to name their files" is a product posture, like `0255`; owner: fkit-architect)* | [`0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n`](../../tasks/done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P4 | **Implement ADR-040's identity grammar in `dashboard.sh`** — both rungs **and** the `moved_target` companion *(**filed 2026-08-10 on the owner's ruling that ADR-040's and ADR-041's implementation follow-ons are filed and ranked into Sprint 5**; **this is the landed pattern Sprint 5's release gate tests** — without it the board decided the downstream defect and never fixed it; rung 1 = the H1 **segment** rule replacing `dashboard.sh:83`, rung 2 = the closed `plan-` allowlist replacing `:87`, rung 3 (`backlog` basename, `:93`) **UNCHANGED**; ⚠️ **plus the `moved_target` companion at `dashboard.sh:692`, whose regex `(Sprint [0-9]+|Backlog)` does NOT take the suffix — verified on disk 2026-08-10** — without it `➡️ Moved to [Sprint 4c]` parses to `Sprint 4` and drift rule 2 at `:767` fires **phantom drift on every moved row**; it is **NOT** one of the three `PLAN_SPRINT` consumers but an independent parser of the same vocabulary, and ADR-040 §6 binds it to **ship in the same change, not as a follow-up**; **one implementation of the grammar, reused by every rung** (ADR-040's binding mitigation); tests **T2–T9** — **T1 is `0259`'s red fixture, do not duplicate** — with **T5 the binding `unresolved-plan-sprint` regression guard: an implementation that drops T5 does not satisfy ADR-040**; owner rulings 2026-08-10 fixing the grammar, verbatim option labels **"One letter (Recommended)"** and **"Include plan- (Recommended)"** — the latter accepted **knowing no observed file requires it**; ⛔ no `STATUS_HEADING_RE` change, ⛔ no change to the `backlog` basename special case (owner-ruled 2026-07-18), ⛔ no `fkit-status/SKILL.md` edit (`0266`), ⛔ do not "fix" the two existing R8 tests, ⛔ no new devDependency (ADR-014), ⛔ no `wiki-vault/` write (ADR-005); ⛔ **do not add the downstream pre-release test to verification — it is the RELEASE gate in `## Notes`, cited not re-recorded**; `0259` is a **soft ordering, deliberately NOT a `Depends on`**; owner: fkit-coder; ⚠️ **`P11` is an APPEND rank, not merit — see the addendum below**)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P4`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0264-implement-adr-040s-identity-grammar-in-dashboard-sh-both-rungs-and-the-moved-target-companion`](../../tasks/done/0264-implement-adr-040s-identity-grammar-in-dashboard-sh-both-rungs-and-the-moved-target-companion/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P5 | **Implement ADR-041's `dashboard.sh` half** — the `Backlog` identity token and the resolve-identity interface *(**filed 2026-08-10 on the same owner ruling**; **direction ruled 2026-08-10, verbatim option label "Accept — selection by identity (Recommended)" — the glob is RETIRED and ⚠️ "keep the glob as a fallback" was explicitly REJECTED**; adds the `Backlog` H1 token per ADR-041 §2 — a whole trimmed segment that is exactly `Backlog` **or** exactly `Sprint Backlog` resolves to **`Backlog`**, normalized to that string and never `Sprint Backlog` (`dashboard.sh:104-107` states what divergence costs), a rung **above** the untouched `:93` basename case; plus the **resolve-identity interface** ADR-041 §5 requires, whose CLI surface is the implementer's call but whose **grammar must not be re-derived in prose**; plus the **integer-ordering test** (§1.4 — today's "highest N" runs on a glob's *text* sort, so `sprint-9` beats `sprint-10`, and **nothing pins this**) and the **same-identity ambiguity test** (§1.5, ruled 2026-08-10, verbatim **"Pick deterministically, flag loudly (Recommended)"** — lexicographically first path **and** every other claimant named); ⚠️ **the brief surfaces one decision it does NOT make: choose the CLI surface so §1.4 and §1.5 are MECHANICALLY testable — if the plan leaves either in prose, escalate before building**; ⚠️ the **"highest N" heuristic** is kept, pinned by the integer test, with ADR-041 option (d)'s explicit active-sprint marker recorded as a future escape hatch — **ruled by the LEAD and flagged to the owner as such, NOT an owner ruling**; ⛔ no `fkit-status/SKILL.md` edit (`0266`), ⛔ no `backlog.md` rename (ADR-041 §3), ⛔ no glob reintroduced in any form, ⛔ no `wiki-vault/` write; owner: fkit-coder; ⚠️ **`P12` is an APPEND rank, not merit**)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P5`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0265-implement-adr-041s-dashboard-half-the-backlog-identity-token-and-the-resolve-identity-interface`](../../tasks/done/0265-implement-adr-041s-dashboard-half-the-backlog-identity-token-and-the-resolve-identity-interface/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P6 | **Retire the `sprint-*.md` glob in `fkit-status/SKILL.md`** — select by resolved identity *(**filed 2026-08-10 on the same owner ruling**; ADR-041 §6 prose **sites 1 and 2** — `fkit-status/SKILL.md:26` (the selection rule) and `:48` (its explanatory block), **both verified on disk 2026-08-10**; after ADR-041 both are **false as written**, not merely stale; ⚠️ **site 2's CONCLUSION survives, its mechanism does not** — `backlog.md` stays out of the default run, and ADR-041 §3 makes that exclusion **stronger** ("the identity is `Backlog`" rather than "the filename is outside the glob"), so **rewrite the reason, keep the rule**; ⚠️ **THE BINDING CONSTRAINT, ADR-041 §5: the selection step obtains each candidate's identity FROM `dashboard.sh` via `0265`'s interface and MUST NOT restate the token grammar, the delimiters, the suffix bound or the filename allowlist** — two grammars for one question is the defect `dashboard.sh:111-125` documents in fkit's own file; report any eighth glob site §6 missed rather than silently editing it; ⛔ no `dashboard.sh` edit, ⛔ no edit to the other five §6 sites (`0267`), ⛔ no glob reintroduced as a fallback, ⛔ no `backlog.md` rename, ⛔ no `wiki-vault/` write; owner: fkit-coder; ⚠️ **`P13` is an APPEND rank, not merit**)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P6`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity`](../../tasks/done/0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P7 | **Correct the five remaining prose sites** that state the glob as the mechanism *(**filed 2026-08-10 on the same owner ruling**; ADR-041 §6 **sites 3–7**, and **all five re-verified on disk 2026-08-10 by the filing producer rather than carried on the architect's word**: `fkit-task-brief/SKILL.md:308-312` and `:334-337`, `fkit-sprint-ship-loop/SKILL.md:47` and `:93`, `ai-agents/sprints/backlog.md:7-11`; ⚠️ **two are not ordinary doc edits and the brief calls both out** — **site 3 is a GENERATOR**: its output already exists as **project content in every downstream repo that ever filed an unsprinted brief**, and launch convergence refreshes `.claude/` agents and skills, **NOT** a project's `backlog.md`, so **those copies will not be repaired by this task** and the close must say so; and **site 7 is our own LIVE board, not scaffold** — the same correction by hand, a **separate act** from site 3 (ADR-041 §6: *"Fix **both** the generator and this copy"*); ⚠️ **site 4's rule SURVIVES** — *"never file against `backlog.md` by writing a `sprint-backlog.md`"* stays true for a different reason (one board, one file), so rewrite the reason and keep the rule; ⛔ no `fkit-status/SKILL.md` or `dashboard.sh` edit, ⛔ no `backlog.md` rename (its href is in every `➡️ Moved to [Backlog](../backlog.md)` marker), ⛔ **no `structure-spec.md` edit — ADR-041 §4 rules it out by name and there is no filename rule left to enforce**, ⛔ no behavior change, ⛔ no `wiki-vault/` write; owner: fkit-coder; ⚠️ **`P14` is an APPEND rank, not merit**)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P7`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism`](../../tasks/done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P8 | **Gloss the `➡️ Moved to [Sprint N]` row** so `N` reads as the sprint identity, not a number *(**filed 2026-08-10 on the same owner ruling**, and named in ADR-040's own Consequences as **the producer's to file, not the ADR's**; `ai-agents/knowledge-base/conventions/task-status-vocabulary.md:21` — **verified on disk 2026-08-10** — leaves `N` undefined, which is harmless today because the parser only ever matched digits, and becomes **wrong** the moment `0264` lands the suffix: a move target is then an **identity** (`4`, or `4c`); ⚠️ **the file is DUAL-HOMED and the twin edit is UNENFORCED** — both copies exist, **line 21 is byte-identical in both**, and the file is a **declared `audience-adapted` parity exception** in `test/dual-home-parity-exceptions.mjs`, so `test/dual-home-parity.test.js` **subtracts it from the check and nothing will tell you if you edit one copy and not the other**; the scaffold twin's change also requires `npm run generate:manifest` (`test/structure-manifest.test.js` goes red when stale); ⛔ **gloss only — do NOT change the marker syntax**, ⛔ no new status value, ⛔ leave the `**Moved (to backlog)**` row at `:22` alone, ⛔ do not edit the parity exception's `reason` as a side effect — if you think it needs changing, **stop and say so**, ⛔ no `dashboard.sh` edit, ⛔ no `wiki-vault/` write; owner: fkit-coder; ⚠️ **`P15` is an APPEND rank, not merit**)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P8`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number`](../../tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P9 | **Wiki ingest of ADR-040 and ADR-041** — the sprint-identity decisions *(**filed 2026-08-10 on the same owner ruling**; both ADRs end with an explicit hand-off — their ingest follow-up is **the producer's to file, not the ADR's** — and `0249` is the standing precedent for ingesting a decision as its own task; **⚠️ a NEW brief, and the overlap check was run BEFORE filing rather than assumed**: `0258` re-syncs `systems/install-and-self-update` after `0252` (different page, different source, hard-gated on `0252`) and `0263` re-syncs **board reality** (Sprint 3/4/5, four dead `sprints/sprint-3.md` paths) — **neither covers a decisions page, so neither was widened**, which is exactly what `0263`'s own ruling praised the previous producer for **not** doing to `0238`; the pages must carry, not soften, ADR-040's *a wrong identity is strictly worse than no identity*, its `unresolved-plan-sprint` guard, *prose containment is not identity*, and the `moved_target` companion — **a page recording only "the regex was widened" is a worse record than no page** — plus ADR-041's compounded defect, *`Backlog` is never eligible*, §5's one-grammar constraint and the **"highest N" residual**; ⛔ **do not start before BOTH ADRs read `accepted`** (both read `proposed` at filing 2026-08-10 while a concurrent architect unit was flipping them) — **if either still reads `proposed`, stop and report**; ⛔ **`log.md` is APPEND-ONLY** (owner ruling 2026-08-03, task `0211`), ⛔ nothing outside `wiki-vault/`, ⛔ no task-file move (ADR-033), ⛔ no re-rank or board-row correction; **deliberately NOT gated on `0264`–`0268`** — an ADR stands as a decision record whether or not its implementation landed (`0249`'s precedent; `0239`'s union-of-preconditions reasoning); batchable with `0199`/`0206`/`0212`/`0238`/`0239`/`0258`/`0263`; owner: fkit-wiki; ⚠️ **`P16` is an APPEND rank — and the one row whose append rank and merit rank agree**; **⛔ OUT OF THE `/fkit-sprint-ship-loop` RUN — owner ruling 2026-08-10, verbatim option label "0258 and 0269 — the wiki rows (Rec)"**: this row is `## Owner: fkit-wiki` and its whole deliverable is a `ai-agents/wiki-vault/` write, but the loop never reads `## Owner` (ADR-038) — its Build step spawns `@fkit-coder`, which `claude/agents/fkit-coder.md:211` forbids from writing the vault ever, so the loop would stall on a refusal or breach ADR-005. ⚠️ **Still `🔲 Backlog`, still Sprint 5, still `P16` — excluded from this loop run, NOT blocked, NOT deprioritised, NOT descoped.** Runs in a `fkit wiki` session instead. Full reasons: `## Notes`, first bullet.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P9`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". ✅ **SHIPPED 2026-08-13 — the exclusion prose inside this cell is left byte-identical, and the ruling it records was NEVER VIOLATED.** This row closed `✅ Done (agent-closed — not owner-verified)` on 2026-08-13, **not** through `/fkit-sprint-ship-loop` but via a **spawned `@fkit-wiki` librarian** during an owner-requested wiki sync + lint — the `fkit wiki` route this cell itself names. The *"Still `🔲 Backlog` … excluded from this loop run, NOT blocked, NOT deprioritised, NOT descoped"* sentence is the **record of the 2026-08-10 ruling** and stays exactly as written; the **Status column is the live state**. The cell's own gate was checked and met before ingest: **both ADRs read `accepted`**. Full note: `## Notes`, first bullet. | [`0269-wiki-ingest-of-adr-040-and-adr-041-the-sprint-identity-decisions`](../../tasks/done/0269-wiki-ingest-of-adr-040-and-adr-041-the-sprint-identity-decisions/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P10 | **Gate releases so an untested tree cannot ship** — CI, an in-release gate, or both *(**owner ruling 2026-08-08 relayed through the coordinating session — "fix it, not just record it… let the brief weigh which, don't pre-decide it here"**; `.github/` does **not exist** and `bin/release.mjs` runs **no tests** before bump→commit→push→tag, so `git add -A` will happily ship a stale `claude/structure-manifest.tsv` — the one guard against a wrong shipped hash table fires only if a human ran `npm test`; **discharges architecture.md §11 OQ2**, which itself says "An owner call, not an architect's"; ⚠️ ruling is "build a gate", **not** §11's broader parenthetical — ⛔ `shellcheck` and the `install.sh` smoke-install are **separate briefs**; must run **full** `npm test` incl. `prove-red.sh` (ADR-026), **block** on failure (never warn-and-continue), and **record measured runtime**; ⛔ no new devDependency (ADR-014), ⛔ no test-file or manifest edits; verification demands a **demonstrated** block via a deliberate manifest staleness, then revert; coordinates with `0251` on §9 prose; **✅ ordering RULED — owner ruling 2026-08-08: lands BEFORE `0252`**, whose releaser checklist would otherwise have to say *"run `npm test`, because nothing else will"* — a **soft ordering, recorded as a dated `## Notes` bullet and deliberately NOT a `Depends on` / `Blocks`** (neither task gates the other at build time); owner: fkit-coder; **⚠️ CARRIED ONTO SPRINT 5 2026-08-10 by owner ruling** — the cell above is the Backlog board's own filing text, kept **byte-identical**; that row now reads `➡️ Moved to [Sprint 5](sprint-5.md) — priority P4` and is **not deleted**. **This board is ranked and the Backlog board is not**, so `P4` is a real merit rank assigned here for the first time, and the brief's `## Priority` moved from `Unscheduled` to `P4` in the same act. ⚠️ **The owner-ruled ordering `0256` → `0252` is now carried by the RANKS** — this row at `P4`, `0252` at `P7`. It remains a **soft ordering**; no `Depends on:` / `Blocks:` label was added. ⚠️ **A second, board-level reason for `P4`, which is NEW and is this producer's judgement, not an owner ruling:** the owner intends to **cut a release when this sprint completes**, so the gate that stops an untested tree shipping wants to exist **before** that cut and before the rest of this board's output queues up behind it.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P10`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0256-gate-releases-so-an-untested-tree-cannot-ship`](../../tasks/done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P11 | Fix the **version-labeled, sha-triggered update banner** — it reads `vX → vX` *(**owner-approved filing 2026-08-08**, from the coder's plan on the `VERSION` bump; `fkit-claude.sh:135-142` triggers on **sha** inequality but labels from `VERSION` on both sides, so any non-bumping commit renders `↑ fkit v0.1.30 → v0.1.30 is available`; **⚠️ CORRECTION to the filing framing — not "one commit after a bump" but the STEADY STATE**: measured 2026-08-08, **142 commits** on `main` since the `v0.1.30` bump and **32 of 235** commits ever touched `VERSION` (~86% produce a same-label banner) — a true signal that reads as noise; **the `0.2.0` bump relabels it for exactly one cycle** and cannot fix it; **second defect folded in**: `_fkit_remote_sha` falls back git→curl but `_fkit_remote_version` is **curl-only** (`:91-97`), so a git-only box renders `v? ` — must not stay reachable; **no test covers any of it**; ⛔ **trigger semantics unchanged** (sha is correct for a sha-keyed distribution, ADR-015 §4), ⛔ no `VERSION`/`release.mjs`/`install.sh` edit, ⛔ throttle + 5 s ceiling + silent-when-current/offline + source-checkout exclusion all preserved; reproduce the literal bad line **before** fixing; vault page quotes the banner verbatim → resync filed separately; owner: fkit-coder; **⚠️ CARRIED ONTO SPRINT 5 2026-08-10 by owner ruling** — the cell above is the Backlog board's own filing text, kept **byte-identical**; that row now reads `➡️ Moved to [Sprint 5](sprint-5.md) — priority P5` and is **not deleted**. **This board is ranked and the Backlog board is not**, so `P5` is a real merit rank assigned here for the first time, and the brief's `## Priority` moved from `Unscheduled` to `P5` in the same act.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P11`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0257-fix-the-version-labeled-sha-triggered-update-banner`](../../tasks/done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P12 | Fix the **unrunnable verify command** `bin/release.mjs` prints after a release *(**owner-approved filing 2026-08-08**; `bin/release.mjs:220` prints `npx github:flashist/fkit#<tag> --version` but `package.json` has **no `bin` field** — reproduced 2026-08-08 under a clean `PATH`: `npm error could not determine executable to run`; cosmetic — nothing parses it — but it also implies a tag is installable, which it is not; ⛔ **do not add a `bin` field** (ADR-011, no npm publish) — escalate instead; **run the replacement command before shipping it**; owner: fkit-coder; **⚠️ CARRIED ONTO SPRINT 5 2026-08-10 by owner ruling** — the cell above is the Backlog board's own filing text, kept **byte-identical**; that row now reads `➡️ Moved to [Sprint 5](sprint-5.md) — priority P6` and is **not deleted**. **This board is ranked and the Backlog board is not**, so `P6` is a real merit rank assigned here for the first time, and the brief's `## Priority` moved from `Unscheduled` to `P6` in the same act. ⚠️ **`P6` reflects a NEW consideration, this producer's judgement and not an owner ruling:** the owner intends to **cut a release when this sprint completes**, and this is the line the releaser reads at exactly that moment. It wants to be fixed before the cut, not after it.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P12`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0254-fix-the-unrunnable-verify-command-release-mjs-prints`](../../tasks/done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P13 | Record fkit's **release hygiene** — the release channel, `VERSION`'s real role, and the manifest regeneration duty *(**owner-approved filing 2026-08-08**; `main` HEAD is what `install.sh:19` and the launcher `:106` resolve — the `v<x.y.z>` tag is a marker no install path uses; self-update compares **shas** (`fkit-claude.sh:136-138`), `VERSION` only words the notice — ⚠️ architecture.md §6's "Version bumping is load-bearing" is **accurate and must survive**; `npm run generate:manifest` is owed only for `claude/scaffold/` content (`generate-structure-manifest.mjs:258-293`), **not** all of `claude/` — and nothing runs the guard before a release (**no CI**, `bin/release.mjs` runs no tests); ⛔ must **not** land in `conventions/` — those are dual-homed and ship to consuming projects; **✅ placement RESOLVED — owner ruling 2026-08-08: repo-root `RELEASING.md`**, do not re-open; the CI/gate fix is `0256`'s, the vault resync is `0258`'s; **✅ ordering RULED — owner ruling 2026-08-08: lands AFTER `0256`**, so the checklist describes the gate rather than the gap — a **soft ordering, recorded as a dated `## Notes` bullet and deliberately NOT a `Depends on`** (`0256` is not a build-time blocker; this brief is writable today, it would just describe a state about to change); owner: fkit-coder; **⚠️ CARRIED ONTO SPRINT 5 2026-08-10 by owner ruling** — the cell above is the Backlog board's own filing text, kept **byte-identical**; that row now reads `➡️ Moved to [Sprint 5](sprint-5.md) — priority P7` and is **not deleted**. **This board is ranked and the Backlog board is not**, so `P7` is a real merit rank assigned here for the first time, and the brief's `## Priority` moved from `Unscheduled` to `P7` in the same act. ⚠️ **The owner-ruled ordering `0256` → `0252` is now carried by the RANKS** — `0256` at `P4`, this row at `P7`. It remains a **soft ordering**: the `Depends on:` / `Blocks:` labels in both briefs are untouched, because neither task gates the other at build time and a false label would make the board render this row `after 0256`.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P13`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty`](../../tasks/done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P14 | State the **per-project re-launch step** `fkit update` requires — README "Staying current" *(**owner-approved filing 2026-08-08**; `fkit update` refreshes the install share only — a project's `.claude/` agents+skills are refreshed by `fkit-claude-init.sh:479-490`, which runs **only on launch**; `README.md:31-33` never says so, so a project updated but never re-launched keeps stale agents and skills with **no diagnostic of any kind**; docs-only, one file, no behavior change — the manual mitigation for the gap `0255` decides; owner: fkit-coder; **⚠️ CARRIED ONTO SPRINT 5 2026-08-10 by owner ruling** — the cell above is the Backlog board's own filing text, kept **byte-identical**; that row now reads `➡️ Moved to [Sprint 5](sprint-5.md) — priority P8` and is **not deleted**. **This board is ranked and the Backlog board is not**, so `P8` is a real merit rank assigned here for the first time, and the brief's `## Priority` moved from `Unscheduled` to `P8` in the same act.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P14`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0253-state-the-per-project-relaunch-step-fkit-update-requires`](../../tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P15 | **Decide whether `.claude/` enters the structure-conformance surface** — ADR, owner sign-off required *(**owner-approved filing 2026-08-08**, raised by `fkit-architect` as a genuine unanticipated architecture question; `claude/structure-spec.md` has **zero `.claude` rows** and the spec inventory is the check's whole input (`fkit-heal/check.sh:23`), the manifest walk covers `claude/scaffold/` only, and `fkit-claude-init.sh:479-490` rm+cps with no report or verdict — so a project updated but never re-launched keeps stale agents+skills **with no signal**, and the launch notice **cannot** fire because the launch is the refresh; `.claude/` was **never considered** (zero matches in ADR-039 or the 2026-08-06 design report), and its ownership semantics are the **inverse** of ADR-015's `ai-agents/` invariant; **decision only — ⛔ no implementation, no spec/manifest/init edit**; weigh all four options incl. "not a conformance surface at all"; owner: fkit-architect; **⚠️ CARRIED ONTO SPRINT 5 2026-08-10 by owner ruling** — the cell above is the Backlog board's own filing text, kept **byte-identical**; that row now reads `➡️ Moved to [Sprint 5](sprint-5.md) — priority P9` and is **not deleted**. **This board is ranked and the Backlog board is not**, so `P9` is a real merit rank assigned here for the first time, and the brief's `## Priority` moved from `Unscheduled` to `P9` in the same act. **⛔ OUT OF THE `/fkit-sprint-ship-loop` RUN — owner ruling 2026-08-10, verbatim option label "0255 — the .claude/ conformance ADR (Rec)"**: the loop's only owner gate is plan approval, spent before Build, and this row needs a **second** owner beat to record the sign-off its title and verification step 3 require. ⚠️ **Still `🔲 Backlog`, still Sprint 5, still `P9` — excluded from this loop run, NOT blocked, NOT deprioritised, NOT descoped.** Runs in an owner-present session instead. Full reasons: `## Notes`, first bullet.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P15`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0255-decide-whether-claude-enters-the-structure-conformance-surface`](../../tasks/done/0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P16 | **Wiki re-sync** of `systems/install-and-self-update` after `0252` lands `RELEASING.md` *(**owner ruling 2026-08-08**, verbatim **"wiki resync for 0252: yes, file it. Follow the 0238/0239 precedent; owner is `fkit-wiki` per ADR-005"**; the page's §Release + `**Key files**` line will be the last place the release story is told without the channel/tag distinction or a pointer to `RELEASING.md`; ⚠️ **sharpen, do not reverse** — its "Version bumping is load-bearing" conclusion and the ADR-001 supersession note are **accurate and must survive**; re-derive from the **landed** doc, not from `0252`'s brief; follow `0239`'s correction form so the vault does not grow two conventions; **⛔ do not start before `0252` lands**, ⛔ nothing outside `wiki-vault/`, ⛔ no task-file move (ADR-033); **scope is `0252` only — `0256`/`0257` deliberately NOT folded in** (union of three preconditions would block a resync ready the moment `0252` lands — `0239`'s own reasoning); batchable with `0199`/`0206`/`0212`/`0238`/`0239`; owner: fkit-wiki; **⚠️ CARRIED ONTO SPRINT 5 2026-08-10 by owner ruling** — the cell above is the Backlog board's own filing text, kept **byte-identical**; that row now reads `➡️ Moved to [Sprint 5](sprint-5.md) — priority P10` and is **not deleted**. **This board is ranked and the Backlog board is not**, so `P10` is a real merit rank assigned here for the first time, and the brief's `## Priority` moved from `Unscheduled` to `P10` in the same act. ⚠️ **`P10` is last on purpose.** `0252`'s existing `Blocks: 0258` label is the real gate and is **unchanged**; the rank simply agrees with it. ⛔ The row's own *"do not start before `0252` lands"* still governs. **⛔ OUT OF THE `/fkit-sprint-ship-loop` RUN — owner ruling 2026-08-10, verbatim option label "0258 and 0269 — the wiki rows (Rec)"**: this row is `## Owner: fkit-wiki` and its whole deliverable is a `ai-agents/wiki-vault/` write, but the loop never reads `## Owner` (ADR-038) — its Build step spawns `@fkit-coder`, which `claude/agents/fkit-coder.md:211` forbids from writing the vault ever, so the loop would stall on a refusal or breach ADR-005. ⚠️ **Still `🔲 Backlog`, still Sprint 5, still `P10` — excluded from this loop run, NOT blocked, NOT deprioritised, NOT descoped.** Runs in a `fkit wiki` session instead. Full reasons: `## Notes`, first bullet.)* ⚠️ **RE-RANKED 2026-08-11 BY OWNER RULING — EVERY RANK NAMED INSIDE THIS CELL IS STALE. This row is now `P16`.** The cell text above is left byte-identical; the **Priority column is the live rank**, and the merit reasoning in the cell still stands because all seven release-hygiene rows moved together. Old→new map and authority: §"Addendum — the owner-ruled re-rank of 2026-08-11". | [`0258-wiki-resync-of-the-install-and-self-update-page-after-0252`](../../tasks/done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P17 | **Make the case-insensitive lockdown-guard test filesystem-independent** — fkit's first CI run is red *(**filed 2026-08-13 on two owner rulings of that day**, given via `AskUserQuestion` in a live `fkit lead` session, **the option labels are the verbatim text**: **"A — make the test filesystem-independent (Recommended)"** and **"Fix now — drive it in this session (Recommended)"**. `0256` landed `.github/workflows/test.yml`; the owner pushed to `main`; **GitHub Actions run `31634593615`** on `ubuntu-latest` returned **708/709, 1 fail** — `test/orphan-cleanup.test.js:264`, `assert.match(r.stderr, /lockdown state/)` got `''`. ⚠️ **TEST defect, NOT a product defect — `main` is NOT broken for Linux users**: the guard's delete-preventing `continue` at `claude/fkit-claude-init.sh:735-751` is pure `tr`+glob with no filesystem involved and fires identically everywhere; only the **announcement** is `exists`-gated, deliberately, so `.Fkit/Settings` announces on case-insensitive macOS and is silent on Linux. Reproduced on macOS over a case-sensitive APFS image; a counterfactual skip gave 708/708. Fix is one file — seed `.Fkit/Settings` before init so the path exists on both platforms, and reword the now-stale macOS-only comment at `:262-263`. ⚠️ **A plain Linux skip was rejected**: the test's other two assertions pass vacuously there, so a skip would leave a hollow test running in CI. ⚠️ **`prove-red.sh` also goes red on a case-sensitive filesystem** — baselines `0a`/`0b` only, same single root cause, hidden by `package.json`'s `&&` short-circuit; **that it goes green after the fix is an inference, not a measurement, and this row must MEASURE it.** ⛔ No product change, ⛔ no workflow change, ⛔ no `dashboard-contract.test.js` change (it already handles case correctly), ⛔ no new devDependency, ⛔ no wiki write, ⛔ no commit; owner: fkit-coder. ⚠️ **`P17` is an APPEND rank assigned by this filing on 2026-08-13 — NOT part of the owner-ruled re-rank of 2026-08-11, which moved existing rows only. On merit it belongs at the TOP of this board**, above `0259`; that position is unreachable because nine closed rows sit below any insertion point above `P11` and ADR-035 forbids the insertion. **Flagged for owner confirmation.**)* | [`0283-make-the-lockdown-guard-case-test-filesystem-independent`](../../tasks/done/0283-make-the-lockdown-guard-case-test-filesystem-independent/brief.md) |

## Addendum — six implementation rows added out of band (2026-08-10)

> **Authority, before outcome.** These six rows exist by an **owner ruling given 2026-08-10**: ADR-040's
> and ADR-041's implementation follow-ons are to be **filed and ranked into Sprint 5**. Relayed to a
> spawned `fkit-producer` with **no owner channel**, which asked nothing and decided nothing beyond the
> mechanics of that ruling and the two judgements it names below as its own.

**Why this is out of band, stated plainly rather than implied.** Sprint 5's founding scope was itself an
owner ruling — verbatim **"Dashboard + all of 0252-0258"**, ten named tasks — and this widening is a
**second** owner ruling. The two are reconciled here, visibly, rather than silently:

- **The founding ruling stands and nothing on it was touched.** All ten original rows keep their ranks,
  their cells and their briefs, byte-unchanged.
- **The widening closes a hole the founding scope left.** ⚠️ **Sprint 5 as it stood DECIDED the
  downstream defect and never FIXED it.** `0259` is a red fixture; `0260` and `0261` are ADRs. **No row
  turned either decision into working code** — while this board's `## Notes` carries an owner-ruled
  **release gate** that tests `0260`'s **landed pattern**. So the release waited on work no board
  scheduled, and the downstream project's bug would have survived the sprint that exists to fix it.
  `0264`–`0269` are that work.

### ⚠️ The six ranks are APPEND ranks, not merit ranks — and the owner's placement is NOT yet executed

**The owner's ruling placed these rows directly after `0260`/`0261` — that is `P4`–`P9`, a mid-board
insertion. This producer did not perform it, and here is the reason rather than a silent choice.**

`/fkit-task-brief` step 5 states it twice, absolutely: *"insertion is never the exception's to grant"*,
and *"**a spawned producer has no owner channel and therefore never re-ranks** — not on a spawn-prompt
instruction."*
[ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
records why: an impeccably-authorized mid-board insertion on 2026-08-01 renumbered **eight closed rows**
and two written records asserted the opposite. ADR-035 also says a board with no interleaved closed rows
makes the narrowing *"unnecessary though harmless"* — **and "harmless" is the operative word: applying
it costs nothing, and it is a re-raise condition, not a self-granted permission.**

**So the ordering intent is recorded where ADR-035 says to record it — as a per-brief merit statement:**
every one of `0264`–`0269` carries `**On merit:** immediately below <neighbour>`, naming its neighbour by
folder ID.

⚠️ **This matters, and is not a formality — the append CHANGES THE OUTCOME.** At `P11`–`P16` the six rows
sit **below** the entire release-hygiene cluster, including `0258`, the row this board deliberately ranked
**last**. `0264` is the row that returns `npm test` to green and produces the pattern the release gate
tests. **A rank-ordered pass over this board would reach it last.** → **Open question 5 below.**

**⛔ This addendum is not producer precedent for re-ranking.** The one thing it records is that a spawned
producer **declined** to insert, on a relayed ruling, and put the placement back to the owner.

### The two judgements this producer made beyond the ruling

1. **The split into six briefs** — one per independently shippable unit, with the dependency chain
   `0264 → 0265 → 0266 → 0267`, `0264 → 0268`, and `0269` free. Every edge is a real build-time or
   correctness gate; **no `Depends on` was invented to express a preference** (tasks `0184`, `0149`).
   `0259` → `0264` is recorded as a **soft ordering**, matching how this board already treats
   `0259` → `0260`.
2. **`0269` filed new rather than folding into `0258` or `0263`** — checked before filing: `0258` is the
   install-and-self-update page after `0252`; `0263` is board reality. Neither covers a decisions page.

## Addendum — the owner-ruled re-rank of 2026-08-11

**Authority, stated before the outcome.** **The owner ruled this re-rank**, on **2026-08-11**, through
**a typed instruction in a live `fkit producer` session** (not `AskUserQuestion` — the owner quoted
§"Open questions" 5's recommendation back and answered it in prose). **The verbatim ruling is
`let's do it`**, given in reply to the quoted question *"Re-rank `0264`–`0269` into `P4`–`P9`?"*.
⛔ **THIS IS NOT PRODUCER PRECEDENT FOR RE-RANKING.** It was executed only because the owner ruled it
in-session; `/fkit-task-brief` step 5 and
[ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
still forbid every producer — spawned or not — to re-rank on anything less. A later producer reading
this addendum has **no** licence to move a rank from it.

**What it did.** `0264`–`0269` moved from the append ranks `P11`–`P16` up to `P4`–`P9`; the seven
release-hygiene rows they passed each moved down six places. **Old → new, in full:**

| Task | Old rank | New rank | |
|---|---|---|---|
| `0259` | `P1` | `P1` | unchanged |
| `0260` | `P2` | `P2` | ⛔ **closed — frozen, not touched** |
| `0261` | `P3` | `P3` | ⛔ **closed — frozen, not touched** |
| `0264` | `P11` | **`P4`** | promoted |
| `0265` | `P12` | **`P5`** | promoted |
| `0266` | `P13` | **`P6`** | promoted |
| `0267` | `P14` | **`P7`** | promoted |
| `0268` | `P15` | **`P8`** | promoted |
| `0269` | `P16` | **`P9`** | promoted |
| `0256` | `P4` | **`P10`** | displaced −6 |
| `0257` | `P5` | **`P11`** | displaced −6 |
| `0254` | `P6` | **`P12`** | displaced −6 |
| `0252` | `P7` | **`P13`** | displaced −6 |
| `0253` | `P8` | **`P14`** | displaced −6 |
| `0255` | `P9` | **`P15`** | displaced −6 |
| `0258` | `P10` | **`P16`** | displaced −6 |

### Why this was permitted, checked against the rule rather than assumed

**This is a MOVE of existing rows, not an insertion of new ones.** ADR-035 bans a mid-board
*insertion* because an insertion renumbers every row beneath it. All sixteen rows already existed on
this board, so nothing was inserted and no row entered the numbering.

**No closed row was renumbered.** `/fkit-task-brief` step 5: *"`✅ Done`, `⛔ Cancelled` and
`➡️ Moved` rows are NEVER renumbered — not even under an owner ruling."* The board's only closed rows
are `0260` (`P2`) and `0261` (`P3`). Both sit **above** `P4`, both are **byte-identical**, and the
check was run **downward** — the direction step 5 requires, because a move renumbers what is below it.

**The move stayed inside its own contiguous run of open rows.** Step 5: *"an owner-ruled re-rank
reaches only the top of the contiguous run of open rows immediately above that row… a closed row is a
wall, not a step."* The wall here is `0261` at `P3`. The contiguous open run beneath it is `P4`–`P16`,
and `0264` was promoted to `P4` — **the top of that run and not one place further.** Had the ruling
named `P2` or `P3`, it would have been refused.

### What was checked before executing, and what it cost

**Orderings preserved — each verified, not assumed:**

- **`0256` before `0252`** (standing owner ruling of 2026-08-08, still in force): now `P10` before
  `P13`. ✅ Intact.
- **`0259` before `0260`** (owner-ruled 2026-08-10): `P1` before `P2`, untouched. ✅ Intact.
- **`0252` before `0258`** (`0258`'s real hard gate — it re-syncs the page `0252` writes): now `P13`
  before `P16`. ✅ Intact.
- **The six-row dependency chain** — `0264` blocks `0265` and `0268`; `0265` blocks `0266`; `0266`
  blocks `0267`: now `P4`→`P5`→`P6`→`P7`, with `0268` at `P8` below `0264`. ✅ Intact.

**⚠️ One merit position was NOT satisfied, and it is recorded rather than smoothed over.** `0265` and
`0268` **both** carry the merit statement *"immediately below `0264`"*, and only one row can hold
`P5`. The owner's ruling fixed the order as `0264`→`0269`, which gives `P5` to `0265` and puts `0268`
at `P8`, three below its stated merit position. **No dependency is violated** — `0264` still lands
before `0268` — but `0268`'s merit statement is not honoured exactly, and its brief now says so.

**⚠️ `0267` is now ranked ABOVE `0252`, reversing their previous order.** `0267` cites `0252` twice as
*"Sprint 5 `P7`"*, from when `RELEASING.md` was a candidate landing site for its downstream-exposure
note. That is safe **only because** the owner ruled the landing site to `README.md` on 2026-08-10 with
**no sequencing dependency on `0252`**, and no `Depends on: 0252` edge was ever declared. Had that
ruling gone the other way, this re-rank would have created a real ordering defect. `0267`'s brief
carries a dated correction recording it.

**What this changes in practice.** A rank-ordered pass now reaches `0264` — the row that returns
`npm test` to green and produces the pattern the release gate tests — **fourth instead of eleventh**,
which is the whole point of the ruling. The cost is that the entire release-hygiene cluster now sits
below the dashboard implementation work, so **the release cannot be cut until six more rows land than
before.** The owner ruled that trade knowingly.

**Stale rank citations.** Every rank citation this move invalidated has been corrected **in place**
where it was a structured field (board Priority cells, each brief's `## Priority`), and by an appended
**dated correction note** where it was prose — the prose itself is left byte-identical throughout.
⚠️ **`backlog.md`'s seven `➡️ Moved to [Sprint 5] — priority P<n>` rows were deliberately NOT
edited**: they are closed rows, and the never-renumber rule admits no exception. Their destination
ranks are stale by design and `backlog.md`'s `## Notes` says so, pointing here as the live authority.

*(Executed 2026-08-11 by an owner-present `fkit producer` session, on the ruling quoted above. It
re-ranked only the rows the ruling named, inserted nothing, and renumbered nothing closed.)*


## Addendum — a seventeenth row added 2026-08-13 (`0283`), and it is an APPEND, not a re-rank

**Authority before outcome.** `0283` exists by **two owner rulings given 2026-08-13 via
`AskUserQuestion` in a live `fkit lead` session** — **the option labels are the verbatim text**:
**"A — make the test filesystem-independent (Recommended)"** and
**"Fix now — drive it in this session (Recommended)"**. Filed by a spawned `fkit-producer` with **no
owner channel**, which asked nothing and decided nothing beyond the mechanics of those rulings and the
append rank below.

⛔ **THIS IS NOT A RE-RANK AND NOT PRODUCER PRECEDENT FOR ONE.** No existing row moved. Nothing was
inserted. `0283` was **appended** at `P17`, below the board's previous largest rank, exactly as
`/fkit-task-brief` step 5 requires — and the append is a **forced consequence** of the closed-row rule,
since nine closed rows (`P1`–`P8`, `P10`) sit below every position above `P11`.
⚠️ **On merit `0283` belongs at the TOP of this board, above `0259`** — it is the only red on `main` and
it is being driven immediately. That position is unreachable; the ordering intent is recorded in its
brief and here instead. **Flagged for owner confirmation.**

**⚠️ The `## Status` banner and the 2026-08-10 addendum both say this board carries SIXTEEN rows. Both
are left byte-identical and both are now one short — the board carries SEVENTEEN.** Each was true when
written; a later authority added a row.

**Why a fresh row rather than a note on `0256`.** `0256` is **closed** (2026-08-12,
`✅ Done (agent-closed — not owner-verified)`), and a closed row is not reopened to absorb its
follow-on. ⛔ **`0256`'s status, rank and artifacts are untouched by this filing.**

**What it is:** fkit's first-ever CI run — GitHub Actions **`31634593615`**, `ubuntu-latest` — returned
**708/709 with one failure**, `test/orphan-cleanup.test.js:264`. Diagnosed and reproduced on macOS over
a case-sensitive APFS image: a **test** defect, not a product defect. `main` is **not** broken for Linux
users; the lockdown guard is fully functional there. Full mechanism, the rejected alternative, and the
`prove-red.sh` measurement obligation are in the brief.

## How this board was ranked

> ⛔ **STALE AS A RANK REFERENCE — CORRECTED 2026-08-11. Everything below is left byte-identical and
> its REASONING still stands; its RANK NUMBERS do not.** This section records how the board was ranked
> when it was built. On 2026-08-11 the owner ruled a re-rank and it was executed: `0264`–`0269` moved
> to `P4`–`P9` and the seven release-hygiene rows moved down six places each. **So numbered items 4–10
> below name ranks that have moved** — *"`0256` at `P4`"* is now `P10`, *"`0257` at `P5`"* is now
> `P11`, *"`0254` at `P6`"* is now `P12`, *"`0252` at `P7`"* is now `P13`, *"`0253` at `P8`"* is now
> `P14`, *"`0255` at `P9`"* is now `P15`, *"`0258` at `P10`"* is now `P16`. Items 1–3 (`0259`, `0260`,
> `0261` at `P1`–`P3`) are **unchanged and still accurate**.
> ✅ **The merit arguments are untouched and still binding** — the reasons `0256` outranks `0252`, and
> why `0258` is last of its cluster, all still hold; only the numbers shifted, and they shifted
> together, so every *relative* order this section argues for survives. **Cite a row by its ID, never
> by a number read off this section.** Live ranks: the `## Status` table. Authority: §"Addendum — the
> owner-ruled re-rank of 2026-08-11".


**Every rank was assigned on merit, by a spawned producer, on a board with no closed rows, and no rank
places a task above anything it depends on.** Only one hard dependency edge exists on this board
(`0252` `Blocks: 0258`) and the ranking honors it. **The ranking is the one thing on this board that
is the producer's judgement rather than an owner ruling** — except where a ruling is named below.

**The three owner-set constraints, and where each landed:**

1. **"The downstream defect fix is the reason this sprint exists — rank it accordingly."** → `0259`,
   `0260`, `0261` take `P1`–`P3`, the whole top of the board.
2. **`0259` before `0260`** (owner-ruled 2026-08-10) → `P1` then `P2`. Recorded as a **soft ordering**
   in both briefs, not as a `Depends on` — the architect can reach `0260`'s decision from the report
   alone.
3. **`0256` lands before `0252`** (standing owner ruling of 2026-08-08, still in force) → `P4` and
   `P7`. Preserved, and still a soft ordering; no label was added to either brief.

**The reasoning, per rank:**

1. **`0259` at `P1`** — the cheapest thing on the board and the one that makes everything else
   concrete. It converts a third-party report into a failing test this project owns. The reporter's
   own suggested order puts it first for the same reason.
2. **`0260` at `P2`** — the decision the sprint's headline defect turns on, and the one with a real
   trap in it (a wrong identity is worse than no identity). Below `0259` only because the fixture is
   cheaper and sharpens the question.
3. **`0261` at `P3`** — the same naming mismatch in a second place. It is ranked here rather than
   lower because on the reporting project the two findings **compound on one file**: the wrong board
   is selected *and* that board loses its highest-value check. A `PLAN_SPRINT` fix that ignores the
   glob leaves half the defect standing. Below `0260` because the matcher is the larger half and
   because `0260`'s outcome may constrain this one.
4. **`0256` at `P4`** — highest of the release cluster, on **two** reasons. The owner ruled it above
   `0252`; and — **this half is the producer's judgement, not a ruling** — the owner intends to **cut
   a release when this sprint completes**, so the gate that stops an untested tree shipping wants to
   exist *before* that cut and before the rest of this board's output queues up behind it. A gate
   landed last protects nothing that came before it.
5. **`0257` at `P5`** — the largest live user-facing defect on the board. Measured 2026-08-08: **142
   commits** since the last `VERSION` change and **~86% of all commits** produce a banner reading
   `v0.1.30 → v0.1.30`. Every installed user sees it, continuously, and a true signal that reads as
   noise stops being read. Independent and small.
6. **`0254` at `P6`** — also release-facing, and **also weighed against the intended release cut**:
   it is the line the releaser is handed at exactly the moment they want reassurance the release
   landed, and it sends them to `npm error could not determine executable to run`. Ranked below
   `0257` because it is maintainer-facing and once-per-release, where `0257` is user-facing and
   continuous.
7. **`0252` at `P7`** — owner-ruled below `0256`, on exactly the stated reasoning: land the gate first
   and `RELEASING.md`'s checklist describes the gate instead of the gap. It is also the only row that
   **blocks** another (`0258`), so it must sit above it.
8. **`0253` at `P8`** — a one-file, one-paragraph README fix, correct whatever `0255` decides. Real
   value (a project updated but never re-launched keeps stale agents with no diagnostic) but the
   smallest scope on the board and no one waits on it.
9. **`0255` at `P9`** — the largest decision here and the one that **cannot complete without the
   owner** (it requires sign-off by its own brief). Ranked low deliberately: it consumes the scarcest
   resource on the board, and nothing else on the board waits on it — `0253` is explicitly the manual
   mitigation that is correct whichever way it goes.
10. **`0258` at `P10`** — last because it is the only row with a **real** hard gate: `0252` carries
    `Blocks: 0258`, and the row's own *"do not start before `0252` lands"* stands. The rank agrees
    with the label rather than substituting for it.

**Where merit and rank diverge: nowhere.** No row on this board carries a merit statement that this
ranking failed to honor. Each brief records `**On merit:** as ranked` with its reason.

## Open questions for the owner

> **✅ ALL FOUR ANSWERED 2026-08-10 — four owner rulings, all given via `AskUserQuestion` in a live
> session, each a selection from its question's option list, so **the option label is the verbatim
> text**. **The questions below are left byte-identical and are NOT deleted** — each carries an
> appended `✅ ANSWERED` note recording the ruling, its date, and where it landed. Executed by a
> spawned `fkit-producer` with no owner channel, which asked nothing and decided nothing beyond the
> mechanics of these four rulings and the two board placements it names as its own judgement.
>
> | # | Ruling (verbatim option label) | Where it landed |
> |---|---|---|
> | 1 | **"File a brief, leave on backlog"** | [`0262`](../../tasks/backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md), Backlog board |
> | 2 | **"New brief for this archival"** | [`0263`](../../tasks/done/0263-wiki-resync-after-the-sprint-4-archival-and-sprint-5-open/brief.md), Backlog board |
> | 3 | **"Yes — before the release cut"** | `0260`'s Notes + this board's `## Notes` (a **release gate**) |
> | 4 | **"fkit adapts to the project"** | `0261`'s Notes (authoritative), cross-referenced from `0260` |
>
> **⚠️ A FIFTH QUESTION IS OPEN as of 2026-08-10 — the heading above says "ALL FOUR ANSWERED" and is
> left byte-identical; it was true when written.** Question **5** below is **unanswered** and it is the
> one thing the widening ruling did not settle. It is a ranking question, not a scope question.

1. **Was the stale-install test dropped, or deferred?** The 2026-08-08 gate named it as the thing that
   would tell us whether Sprint 4's structure-check capability works **outside this repo**. Lifting the
   gate does not answer the question the test was going to answer — **nothing on Sprint 4 has been
   exercised outside this repo, and that is still true today.** If it is deferred, it needs a filed
   brief; no task exists for it. **Recommended:** file it, and run it against the same downstream
   project that filed the defect report — they are already on `0.2.1` and already willing.

   **✅ ANSWERED 2026-08-10 — DEFERRED, with a filed home. Owner ruling, verbatim option label:
   **"File a brief, leave on backlog"**.** Option description as presented: *"The intent gets a
   durable home so it can't be lost, but doesn't block Sprint 5 or the release. You pick it up when
   convenient."* Filed as
   [`0262`](../../tasks/backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md)
   on the **Backlog** board — ⚠️ **deliberately NOT on this board, and NOT a release gate.** The
   recommendation's second half was not ruled on: the brief **recommends** the downstream reporter as
   the target and flags that this would be a **second ask of the same third party** alongside
   ruling 3's pre-release test, to be batched or sequenced deliberately.

2. **Do `0245` and `0246` still get owner-verified?** The 2026-08-08 note recorded the owner
   personally verifying them; the archival ruling froze the `(agent-closed — not owner-verified)`
   markers instead. Both readings are consistent with what was ruled. **If verification is still
   intended, it has no home now** — Sprint 4 is archived and no row on this board covers it.

   **✅ ANSWERED 2026-08-10 by the same ruling as question 1 — it has a home now.**
   [`0262`](../../tasks/backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md)
   **carries `0245`'s and `0246`'s own verification steps** as its acceptance criteria — the fifteen
   things those two tasks were agent-closed against and nothing ever checked — each tagged
   field-exercisable or in-repo-only, with *"not exercised"* a required verdict.
   ⚠️ **Stated honestly, because the ruling did not cover it: a field report is NOT the personal owner
   verification the 2026-08-08 note described.** `0262` converts *"never checked"* into *"checked,
   here is what we found"*. **It does not reopen `0245`/`0246` and it does not touch their
   `(agent-closed — not owner-verified)` markers**, which [Sprint 4](sprint-4.md)'s banner
   forbids. Whether the owner *also* verifies them personally is still the owner's call — **a
   residual, not a gap that was filled.**

   **✅ THE RESIDUAL IS NOW RULED — 2026-08-10, second ruling. The answer above is left
   byte-identical; its closing sentence no longer describes the state.** Given via `AskUserQuestion`
   in a live session — a selection from the question's option list, **the option label is the verbatim
   text**: **"0262 replaces it — record that (Recommended)"**. Option description as presented to the
   owner, verbatim:

   > *The stale-install test on a real project exercises the same consent-gated repair path 0245/0246
   > were closed against, arguably harder than a fixture check would. Record explicitly that 0262
   > discharges the promise, so the record doesn't carry an open commitment nobody intends to meet.
   > Consequence: 0245/0246 stay closed as agent-closed — not owner-verified, permanently.*

   **What it settles:** `0262` **discharges** the 2026-08-08 verification promise on completion.
   **No separate personal owner verification of `0245`/`0246` is intended or owed** — the residual is
   closed, not still open. The record is not to carry a commitment nobody means to meet.
   **What it does NOT change, and each is still binding:** ⛔ the eight Sprint 4 rows keep
   `(agent-closed — not owner-verified)` **permanently** — `0262` completing does **not** retroactively
   make them owner-verified and **nothing may be edited to suggest it does**; the answer above is still
   right that a field report is **not** a personal verification — the ruling accepts that substitution
   knowingly rather than denying it; and `0262` remains on the **Backlog**, deliberately unscheduled,
   **not a release gate** — ⛔ do not move or rank it on the strength of this. ⚠️ **Until `0262`
   actually runs, the promise is assigned, not met.**

3. **Do we take up the reporter's offer to test a pre-release against their real plan names?** They
   offered, in writing, to test against the twelve names in their §7 table. That is the cheapest
   real-world validation available for whatever `0260` decides. **A producer will not commit the
   project to a third-party test loop unasked.** Recommended: yes, after `0260`'s ADR is signed off.

   **✅ ANSWERED 2026-08-10 — YES, and it is a RELEASE GATE. Owner ruling, verbatim option label:
   **"Yes — before the release cut"**.** Option description as presented: *"Their §7 table is the
   only real-world naming sample we have, and we cannot generate it from this repo. Testing 0260's
   landed pattern against plan-sprint-4b/4c, hotfix-post-sprint2 and sprint-backlog before shipping
   is the cheapest validation available. Adds a round trip to a third party."* Recorded in
   [`0260`](../../tasks/done/0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md)'s
   Notes and in this board's `## Notes` as a release gate. ⚠️ **It gates the release cut, NOT
   `0260`'s close** — the test runs against the **landed pattern**, which arrives with the
   implementation follow-on, so putting it in `0260`'s verification would block a decision on a third
   party's calendar.

4. **`0261` may need a product posture, not just an architecture decision.** "Tell consuming projects
   how to name their plan files" is the same class of call as `0255`. If the owner already has a view
   — fkit adapts to whatever a project names things, versus fkit prescribes the names — saying it now
   saves the architect a round trip.

   **✅ ANSWERED 2026-08-10 — the posture is ruled. Owner ruling, verbatim option label:
   **"fkit adapts to the project"**.** Option description as presented: *"Real projects name files how
   they want, and fkit's job is to work on them. Argues for widening the glob and the matcher. Cost:
   more ambiguity to handle, and §6's letter-suffix trap becomes fkit's problem to solve correctly."*
   Recorded in full — and authoritatively — in
   [`0261`](../../tasks/done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md)'s
   Notes, cross-referenced as a pointer from `0260`.
   ⛔ **IT IS A POSTURE, NOT THE DECISION, AND IT PRE-APPROVES NOTHING.** The architect still owes the
   whole ADR. Unchanged by it: report **§6**'s constraint — *a wrong identity is strictly worse than
   no identity*; the **non-negotiable regression guard** that a genuinely unidentifiable plan **still**
   reports `unresolved-plan-sprint`; the `backlog.md` widening hazard; and the requirement to reject
   options by name. **"fkit adapts" does NOT license a matcher that resolves `plan-sprint-4c.md` to
   `Sprint 4`** — that is not adapting to a project, it is silently misreading it, and it converts a
   loud failure into a quiet one. The ruling is a tie-breaker on **direction**; per its own wording it
   makes the letter-suffix trap *"fkit's problem to solve correctly"* — accepting the work, not
   waiving it.

5. **⚠️ OPEN — `0264`–`0269` are appended at `P11`–`P16`, and your ruling placed them directly after
   `0260`/`0261`.** That placement is a **mid-board insertion**, which `/fkit-task-brief` step 5 and
   [ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
   forbid a **spawned** producer to perform on a relayed instruction — *"a spawned producer has no owner
   channel and therefore never re-ranks"*. So the intent was recorded as a per-brief merit statement
   instead of executed. **Stated honestly: this changes the outcome.** At `P11`–`P16` the six rows sit
   below the entire release-hygiene cluster, and `0264` — the row that returns `npm test` to green and
   produces the pattern the release gate tests — would be reached **last** by a rank-ordered pass.

   **Two ways to settle it, and both are one edit:**
   - **Re-rank in a live session.** No row on this board is closed (all sixteen read `🔲 Backlog`), so
     an insertion at `P4`–`P9` renumbers **nothing closed** — ADR-035's arithmetic does not bite here,
     and its own *"re-raise only if"* names exactly this case. **An owner-present producer session can
     do it; a spawned one may not.**
   - **Leave the ranks and rely on the dependency edges.** `0264` blocks `0265` and `0268`; `0265`
     blocks `0266`; `0266` blocks `0267`. The chain is real and machine-read, so nothing can be built
     out of order — but **nothing pulls `0264` forward either**, and rank is what a rank-ordered pass
     reads.

   **Recommended: re-rank.** The release gate makes `0264` the highest-value row on the board, and its
   append rank says the opposite.

   **⚠️ CORRECTED 2026-08-10 — one premise of the first branch is now FALSE. The text above is left
   byte-identical; the recommendation is UNCHANGED and still stands.** *"No row on this board is
   closed (all sixteen read `🔲 Backlog`)"* was true when written. It is not true now: **`P2` (`0260`)
   and `P3` (`0261`) closed on 2026-08-10**, both `✅ Done (agent-closed — not owner-verified)`, and
   **fourteen of sixteen rows read `🔲 Backlog`.**

   **What survives the correction, checked rather than assumed:** the two closed rows are `P2` and
   `P3`, which sit **above** the `P4`–`P9` insertion window the owner's ruling names. An insertion at
   `P4`–`P9` renumbers `P4`–`P16` — every one of which still reads `🔲 Backlog`. **So the branch's
   conclusion holds: that insertion still renumbers nothing closed, and ADR-035's arithmetic still
   does not bite.** The premise needed correcting; the answer did not.

   ⛔ **What has changed, and it is not nothing:** `P2` and `P3` are now **frozen ranks**, so the
   insertion window's **top edge is no longer free**. An owner-present re-rank may insert at `P4` and
   below; it may **not** renumber `P2` or `P3`, and it may not place any row above them. Had the
   ruling named `P2`–`P7` instead, this would be a different answer.

   *(Recorded by the spawned `fkit-producer` that performed the two closes, 2026-08-10. It did **not**
   re-rank, insert, or renumber anything — `/fkit-task-brief` step 5 forbids a spawned producer to do
   so, and this correction is a record of drift its own close created, not an exercise of the
   exception.)*

   ## ✅ CLOSED 2026-08-11 — THE OWNER RULED IT. This question is ANSWERED and needs nothing further.

   **The owner chose the recommended branch — re-rank — in a live `fkit producer` session on
   2026-08-11, by typed instruction, verbatim `let's do it`.** It was executed the same session:
   `0264`–`0269` now sit at **`P4`–`P9`**, the seven release-hygiene rows moved down six places, and
   `0260`/`0261` were not touched. **The outcome the question was raised to prevent is prevented** —
   `0264` is now reached fourth by a rank-ordered pass, not eleventh.

   ⚠️ **One framing above is corrected for the record: the text calls the move an *insertion*. It was
   a MOVE of rows already on the board.** That distinction is what made it permissible at all —
   ADR-035 bans mid-board insertions but permits an owner-ruled move inside a contiguous run of open
   rows. The conclusion the question reached was right; the word was loose.

   ⛔ **Not producer precedent.** Full authority, the verbatim ruling, the old→new map, the
   dependency checks, and the one merit position that could not be honoured (`0268`'s) are in
   §"Addendum — the owner-ruled re-rank of 2026-08-11".

   ✅ **FURTHER NOTE 2026-08-13 — THE ROW COUNTS ABOVE ARE STALE AGAIN. Every line above is left
   byte-identical, and both corrections above remain correct records of their own dates.** The
   2026-08-10 correction replaced *"all sixteen read `🔲 Backlog`"* with *"fourteen of sixteen rows
   read `🔲 Backlog`"*. That figure was true on 2026-08-10 and is now false **in the other
   direction**: as of **2026-08-13 all seventeen rows on this board read
   `✅ Done (agent-closed — not owner-verified)`** and **zero read `🔲 Backlog`** — the last three,
   `0255`, `0258` and `0269`, closed 2026-08-13. ⚠️ **The row count itself also moved, sixteen →
   seventeen.** Count rows off the `## Status` table, never off this section.

   ✅ **Nothing above needs re-deciding, and none of it was wrong when written.** This question was
   **already CLOSED on 2026-08-11** by the owner ruling recorded directly above, and that outcome
   shipped. The reasoning, the ADR-035 analysis and the *"frozen ranks"* caution are **correct
   history** — true at their dates, and superseded only in their row counts. A board with no open
   rows simply leaves the question with nothing left to bite on.

   ⛔ **The 2026-08-10 exclusion of `0255` and `0258` was HONORED, not bypassed.** It barred the
   **loop** from driving those two rows, and the loop never drove them. `0258` ran via a **spawned
   `@fkit-wiki` librarian** — the `fkit wiki` route the ruling itself named. `0255` ran in a live
   **owner-present** session with **two real owner beats**: an **`@fkit-architect`** recommendation,
   then the **owner's sign-off before ADR-043 was written**, given via `AskUserQuestion`, **verbatim
   option label "Sign off — Option 4"**. Full note: `## Notes`, first bullet, and the `## Status`
   block-quote — not restated here.

   ⛔ **Recorded by a spawned `fkit-producer` with no owner channel. Nothing was closed, moved,
   re-ranked or re-statused to write this note** — it is append-only prose over an already-answered
   question.

## Not in this sprint (explicitly deferred)

- **The implementation of whatever `0260` and `0261` decide.** Both are decision-only by design;
  their follow-on briefs are filed by a producer **after** the owner reviews the ADRs. Scoping them
  now would be scoping implementation ahead of findings.
  **⚠️ SUPERSEDED 2026-08-10 — THIS IS NOW FALSE, AND IT WAS THE SCOPE HOLE.** The bullet is left
  **byte-identical**; its own condition has been met and its conclusion reversed by an owner ruling of
  the same day. ADR-040 and ADR-041 exist, and the implementation follow-ons are **filed and ranked
  onto this board** as `0264`–`0269`. **Read together with the release gate in `## Notes`, this bullet
  was the hole:** the gate tests `0260`'s **landed pattern**, and the landed pattern was deferred out
  of the only sprint that could produce it. See §"Addendum — six implementation rows added out of band
  (2026-08-10)".
- **`shellcheck` and an `install.sh` smoke-install job** — named in `architecture.md` §11's
  parenthetical, explicitly **not** in the owner's `0256` ruling, and each its own brief.
- **The stale-install test** — see open question 1. Unfiled.
  **✅ CORRECTED 2026-08-10 — it is FILED now**, as
  [`0262`](../../tasks/backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md)
  on the **Backlog** board, by owner ruling (verbatim **"File a brief, leave on backlog"**). The
  sentence above is left byte-identical; *"Unfiled"* was true when written and is now false.
  **Still correctly listed here: it is deliberately not in this sprint and does not gate the
  release.**
- **The wiki re-sync of the Sprint 4 archival and this board's opening** — filed 2026-08-10 as
  [`0263`](../../tasks/done/0263-wiki-resync-after-the-sprint-4-archival-and-sprint-5-open/brief.md)
  on the **Backlog** board, by owner ruling (verbatim **"New brief for this archival"**), owner
  `fkit-wiki` per ADR-005. ⛔ **It does not subsume `0238`** — different archival, different source
  delta. Deliberately not on this board; nothing here reads the vault.
- Everything else on the [Backlog board](../backlog.md), which is unranked by design and is where
  unsprinted work continues to land.

## Notes

- **⛔ OUT OF THE SHIP-LOOP RUN — `0255`, `0258` and `0269`. TWO OWNER RULINGS, 2026-08-10.** Both
  given via `AskUserQuestion` in a live session — selections from the question's option list, so
  **the option labels are the verbatim text**: **"0258 and 0269 — the wiki rows (Rec)"** and
  **"0255 — the .claude/ conformance ADR (Rec)"**. A `fkit lead` session running
  `/fkit-sprint-ship-loop ai-agents/sprints/sprint-5.md` **must not drive these three rows** —
  exclude them from the eligible set at step 1 (`claude/skills/fkit-sprint-ship-loop/SKILL.md:92-106`),
  alongside the per-run skip memory.
  - ⚠️ **ALL THREE STAY `🔲 Backlog`, STAY IN SPRINT 5, AND KEEP THEIR RANKS (`P9`, `P10`, `P16`).**
    They are excluded from **this loop run**, and from nothing else: **not blocked, not
    deprioritised, not descoped, not parked.** Pulling a task out of a loop run is not blocking it,
    and no row's `## Status` was touched to record this. `0255` runs in an **owner-present** session;
    `0258` and `0269` run in a **`fkit wiki`** session.
    - ⚠️ **CORRECTED 2026-08-11 — the three ranks in the line above are STALE; the exclusion is
      UNCHANGED.** The bullet is left byte-identical. *"KEEP THEIR RANKS"* remains true **of this
      exclusion** — excluding a row from a loop run still moves no rank. A **separate, later
      authority** moved them: the owner-ruled re-rank of 2026-08-11. **`0255` is now `P15`, `0258` is
      now `P16`, `0269` is now `P9`.** ⛔ **The operative change for a driver: `0269` is no longer the
      bottom of the board — it is `P9`, high in a rank-ordered pass, and it must still be excluded.**
      Everything else in this bullet stands: all three stay `🔲 Backlog`, stay in Sprint 5, and are
      **not blocked, not deprioritised, not descoped, not parked.** See §"Addendum — the owner-ruled
      re-rank of 2026-08-11".
    - ✅ **NOTE 2026-08-13 — `0269` HAS SHIPPED. The bullet above is left byte-identical, and the
      exclusion it records was NEVER VIOLATED.** `0269` closed **2026-08-13** as
      `✅ Done (agent-closed — not owner-verified)`. It did **not** run through
      `/fkit-sprint-ship-loop`. It ran via a **spawned `@fkit-wiki` librarian** during an
      owner-requested wiki sync + lint — **exactly the `fkit wiki` route this bullet prescribes**.
      That is the whole point: the ruling said the loop could not drive this row, and **the loop
      never drove it**; a different, sanctioned route did the work instead. The row's own gate was
      checked and met before ingest — **ADR-040 and ADR-041 both read `accepted`** on disk. ⛔ **The
      ruling is not reopened, softened or spent.** `0255` and `0258` are untouched: still
      `🔲 Backlog`, still in Sprint 5, still excluded from a loop run, still **not blocked, not
      deprioritised, not descoped, not parked.** `0269` alone has left the open set, and it left by
      shipping, not by being parked or descoped.
    - ✅ **NOTE 2026-08-13 (later the same day) — `0255` AND `0258` HAVE NOW SHIPPED TOO. Every line
      above is left byte-identical, and the 2026-08-10 exclusion was HONORED, not bypassed.** Both
      closed **2026-08-13** as `✅ Done (agent-closed — not owner-verified)`. ⛔ **Neither was driven
      by `/fkit-sprint-ship-loop`.** Each ran by the exact route this bullet prescribes for it:
      - **`0258`** ran via a **spawned `@fkit-wiki` librarian** — the **`fkit wiki`** session this
        bullet names. The sub-bullet below headed *"`0258` and `0269` cannot execute inside the loop
        at all"* was **right**, and it is why the row was never put there.
      - **`0255`** ran in a live **owner-present** session — the route this bullet names — and it got
        **both owner beats the loop had no place for**: an **`@fkit-architect`** recommendation, then
        the **owner's own sign-off, taken before ADR-043 was written**, given via `AskUserQuestion`,
        **verbatim option label "Sign off — Option 4"**. The sub-bullet below headed *"`0255` needs a
        second owner beat the loop does not have"* was **exactly right**; that beat is the one the
        owner-present route supplied and the loop could not.
      ⚠️ **What this supersedes, and only this:** *"ALL THREE STAY `🔲 Backlog`"* above, and the
      2026-08-13 note above it saying `0255` and `0258` are *"still `🔲 Backlog`"*, are the **record
      of the state when each was written** — **true then, superseded now, not wrong-at-the-time.**
      This bullet remains the authoritative record of the 2026-08-10 exclusion ruling and stays as
      written; the **Status column of `## Status` is the live state**, and all three rows are
      `✅ Done`.
      ⛔ **This reopens, softens and spends nothing.** Both 2026-08-10 rulings stand word for word,
      the rejected alternative below stays rejected, and no rank, status or table cell was changed to
      record this note. The close marker stays **`agent-closed — not owner-verified`** on both rows:
      the owner ruled the *decision* `0255` raised, but nobody owner-verified either *close*.
      Companion note, not restated here: the `## Status` block-quote's own
      `✅ NOTE 2026-08-13 (later the same day)`.
  - **`0258` and `0269` cannot execute inside the loop at all — verified on disk 2026-08-10.** Both
    read `## Owner: fkit-wiki`, and their entire deliverable is a write under
    `ai-agents/wiki-vault/`. **The loop never reads `## Owner`** —
    [ADR-038](../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
    fixes each step's role to the skill that step runs, so the **Build** step spawns `@fkit-coder`
    (`claude/skills/fkit-sprint-ship-loop/SKILL.md:121`), and `claude/agents/fkit-coder.md:211`
    forbids that role from writing the vault **ever**. Driven by the loop, these two rows either
    **stall on a refusal** or **breach [ADR-005](../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)**.
    There is no third outcome, which is why this is an execution fact and not a preference.
  - **`0255` needs a second owner beat the loop does not have.** Its title says **owner sign-off is
    required**, and its verification step 3 requires the ADR to record *"the owner's sign-off: the
    ruling, its date, and the channel it came through"* — a ruling that does not exist yet. **The
    loop's only owner gate is plan approval**, spent before Build
    (`claude/skills/fkit-sprint-ship-loop/SKILL.md:120`), so the loop has no beat left at which that
    ruling could be taken. It also carries **no `npm test` step at all** — measured 2026-08-10, all
    five coder-owned rows of the seven-task release cluster (`0252`, `0253`, `0254`, `0256`, `0257`)
    name `npm test`; the two that do not are `0255` and `0258`.
  - **The rejected alternative, recorded so it is not re-discovered as new:** teaching the loop to
    route each step by the brief's `## Owner` field. That is an **ADR-038 re-raise** — the ADR's
    whole holding is that a step's role is fixed by the skill it runs — **not a quick fix. It was
    not chosen.**
- **⛔ RELEASE GATE — OWNER RULING 2026-08-10. The release this board's completion is meant to carry
  MUST NOT be cut until this runs.** Given via `AskUserQuestion` in a live session — a selection from
  the question's option list, **the option label is the verbatim text**: **"Yes — before the release
  cut"**. Option description as presented: *"Their §7 table is the only real-world naming sample we
  have, and we cannot generate it from this repo. Testing 0260's landed pattern against
  plan-sprint-4b/4c, hotfix-post-sprint2 and sprint-backlog before shipping is the cheapest
  validation available. Adds a round trip to a third party."*
  - **What runs:** the pattern `0260` decides **and its implementation lands** is tested against the
    downstream project's **twelve real plan filenames** — the §7 table of
    [`knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`](../../knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md).
    **We cannot generate that sample from this repo**; it is the only real-world naming data we have.
  - **The four hard cases the owner named, by name, each needing a stated and checked outcome:**
    **`plan-sprint-4b.md`** and **`plan-sprint-4c.md`** (letter-suffix identities distinct from
    Sprint 4 — a wrong resolution here is the *silent* failure §6 forbids), **`hotfix-post-sprint2.md`**
    (must **not** resolve to Sprint 2 — prose containment is not identity), **`sprint-backlog.md`**
    (`0261`'s compounded case — wrong board selected *and* identity empty).
  - **⚠️ It gates the RELEASE, not any row on this board.** `0260` and `0261` are decision-only; the
    landed pattern arrives with the implementation follow-on that is explicitly **not in this sprint**.
    ⛔ **Do not add this test to any brief's verification steps** — that would block a decision on a
    third party's calendar. **The gate is on the cut.**
    - **⚠️ CORRECTED 2026-08-10 — one clause of the sub-bullet above is now false.** The sub-bullet is
      left **byte-identical**. *"the implementation follow-on that is explicitly not in this sprint"*
      was true when written; by owner ruling of the same day the follow-ons **are** in this sprint, as
      `0264`–`0269`. **`0264` is the row that produces the landed pattern this gate tests.**
      **Everything else in the sub-bullet still stands, unchanged and still binding:** the gate is on
      the **cut**, not on any row, and ⛔ **the test is still not to be added to any brief's
      verification steps** — `0264`'s and `0265`'s briefs cite it and deliberately do not re-record it.
  - ⚠️ **It adds a round trip to a third party, accepted knowingly.** If the same project is also
    asked to host
    [`0262`](../../tasks/backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md)'s
    stale-install test, **batch or sequence the two asks deliberately.**
- **⚠️ THE BOARD WIDENED FROM TEN ROWS TO SIXTEEN ON 2026-08-10, by a second owner ruling.**
  `0264`–`0269` turn ADR-040 and ADR-041 into working code, prose and vault pages. **Read this together
  with the release gate above:** the gate tests `0260`'s **landed pattern**, and until this widening
  **no row on any board produced it**. Authority, the scope hole, the split rationale and the ranking
  reconciliation are all in §"Addendum — six implementation rows added out of band (2026-08-10)"; the
  unresolved ranking question is §"Open questions" **5**.
- **⚠️ A cross-row interaction the board did not record, surfaced 2026-08-10.** `0259` ships `npm test`
  **RED on purpose**, and `0256` builds a gate that **blocks** a release on a red tree. Between `0259`
  landing and `0264` landing, **no release can be cut** — correct behavior, but it puts `0264` on the
  release path whatever its rank. `0256`'s own verification (a demonstrated block, then revert) is
  unaffected.
- **Nothing on this board has been committed to git.** This board, the Sprint 4 archival, the three
  new briefs and the Backlog board edits are all working-tree only, pending owner review.
  *(Dated note 2026-08-10: still true after this unit's edits — `0262`, `0263`, the four
  open-question answers, the `0260`/`0261` ruling records and the two Backlog rows are all
  working-tree only. This unit committed and pushed nothing.)*
  *(Second dated note 2026-08-10: the six new briefs `0264`–`0269` and every edit in this widening are
  **also working-tree only**. This unit committed and pushed nothing, and ran no release. ⚠️ It did not
  re-check the state of anything it did not touch — see
  [`conventions/evidence-before-assertion.md`](../../knowledge-base/conventions/evidence-before-assertion.md).)*
- **No closed row was renumbered by this sprint's opening, on any board.** Sprint 4's eight `P<n>`
  cells are unchanged and frozen at [`done/sprint-4.md`](sprint-4.md); the seven Backlog rows
  keep their `—` Priority cells, which is what that unranked board writes.
- **The seven carried rows' Task cells are the Backlog board's own filing text, kept byte-identical**,
  with one dated carry note appended to each. The Backlog rows themselves are **not deleted** — they
  now read `➡️ Moved to [Sprint 5](sprint-5.md) — priority P<n>`, which is the pointer to where the
  work went.
- **A wiki re-sync is owed and was NOT performed.** `ai-agents/wiki-vault/` still names **Sprint 3**
  as the active board, has no page for Sprint 4 or Sprint 5, and does not know this board exists.
  **Only `fkit-wiki` may write the vault (ADR-005)** — this producer wrote nothing there. The full
  stale-page list is on [`done/sprint-4.md`](sprint-4.md)'s banner. ⚠️ Whether the existing
  [`0238`](../../tasks/done/0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md)
  widens to cover this archival, or a new brief is filed, is an **open question deliberately left to
  the owner** — a producer does not widen another task's scope unasked.
- This board was created by a **spawned producer with no owner channel**. Every ruling it acted on is
  named and dated above; every judgement it made beyond those rulings is in §"How this board was
  ranked" or §"Open questions for the owner", not buried in a cell.
