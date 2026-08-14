# Sprint 5 — Fix what a real project found, and make a release safe to cut

**Source**: `ai-agents/sprints/done/sprint-5.md`
**Status**: done — 🔒 **CLOSED and ARCHIVED**, opened 2026-08-10 by owner ruling, archived by owner ruling 2026-08-13 and executed 2026-08-14
**Sprint/Tag**: Sprint 5 · **17 rows** · ranks restart at `P1` — *cite a rank with its board; a bare `P4` is ambiguous*

> ✅ **CORRECTED 2026-08-13 by the wiki sync — ALL 17 ROWS ARE NOW CLOSED.** The `**Status**` line
> above is left **byte-identical**; it was true when written. Measured this run against
> `ai-agents/sprints/sprint-5.md`: **17 of 17 board rows read
> `✅ Done (agent-closed — not owner-verified)`** — 0 open, 0 in progress.
> ⚠️ **The board is NOT archived, and this page stays `in-progress` for that reason.** `sprint-5.md`'s
> own banner still reads **`🟢 ACTIVE`**, unchanged. Archiving it — moving the plan into
> `sprints/done/` and re-pointing every link — is task **`0294`**, filed 2026-08-13 and **not yet
> run**. ⛔ **A closed row set is not a closed board**; do not read this page as an archival record
> until `0294` lands.
> ⚠️ **Every one of the 17 carries `(agent-closed — not owner-verified)` — no human has checked any of
> them.** Stated here because the same flag on Sprint 4 is what makes this board's own foundation
> ambiguous (see below).

> ## 🔒 **SUPERSEDED 2026-08-14 — THE BOARD IS NOW ARCHIVED. `0294` HAS RUN.**
>
> The 2026-08-13 block above is left **byte-identical** and is now **false in its central claim**. It
> said *"The board is NOT archived, and this page stays `in-progress` for that reason"* and named
> `0294` **not yet run**. ⚠️ **The stated reason no longer holds**, so the page no longer stays
> `in-progress`.
>
> ⛔ **The `**Source**` and `**Status**` header fields WERE changed in this run — deliberately, and
> against the 2026-08-13 block's own sentence *"The `**Status**` line above is left byte-identical."***
> Those two are **schema metadata fields**, not dated prose: `schema.md` defines them as the page's
> current `Source` / `Status`, and a metadata field that records a false current state is a defect, not
> history. The dated **prose** blocks stay byte-identical; the **fields** track today. That sentence in
> the 2026-08-13 block is therefore superseded by this one.
>
> **Verified on disk 2026-08-14:**
> - The plan now lives at **`ai-agents/sprints/done/sprint-5.md`** — the move is committed (`ce6bf54`),
>   detected as a rename of `ai-agents/sprints/sprint-5.md`.
> - Its banner now reads **`## 🔒 CLOSED — 2026-08-13.`** — no longer `🟢 ACTIVE`.
> - `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` returns
>   **`active none`**, with `backlog.md` (identity `Backlog`) the only candidate — and `Backlog` is
>   never eligible. ⚠️ **There is no active board at all right now.**
> - `0294`'s brief reads **`✅ Done (agent-closed — not owner-verified)`**.
>
> **The archival's authority, both halves, quoted rather than paraphrased.** Owner ruling **2026-08-13**
> via `AskUserQuestion` in a live `fkit lead` session — the option label is the verbatim text:
> **"Move it — as its own scoped task"**, which ruled the archival be done as its own scoped brief
> (`0294`) rather than inline, *because the move is far larger than a banner edit looks*. A **second
> ruling of the same session**, same channel, ruled the banner's wording: verbatim
> **"Omit the successor clause"**. ⚠️ **There is no Sprint 6 and none was opened at archival**, so the
> banner names no successor. ⛔ **That is the no-successor case ruled on its own facts and it
> establishes NO convention** — the four earlier archives each rolled into a real successor, and that
> remains the normal case. Executed **2026-08-14** by a spawned `fkit-producer` with no owner channel,
> which asked nothing and decided nothing beyond the mechanics.
>
> ⛔ **Archival changes nothing about verification.** All 17 rows keep
> `(agent-closed — not owner-verified)`; **no human has checked any of them**, and closing the board
> does not retroactively verify one row.
>
> ⚠️ **`0294`'s own brief close is staged in the working tree but NOT committed** at the time of this
> write. The *effect* — the plan's move and the link repointing — **is** committed; the brief's move
> from `tasks/backlog/` to `tasks/done/` is not. Recorded so a later reader is not surprised by the
> gap.

> ✅ **Dated correction 2026-08-14 (the post-`0288` sync; the block above is left byte-identical).**
> **The gap it recorded is closed: `0294`'s brief close is COMMITTED** (`9e61f9b`), the folder now sits
> at `ai-agents/tasks/done/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/`,
> and the row is ingested as [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]].
> **Re-verified on disk this sync:** the plan is at `ai-agents/sprints/done/sprint-5.md`, its banner
> reads `## 🔒 CLOSED — 2026-08-13.`, and `select-active` still returns **`active none`**.
> ✅ **Link integrity holds** — `grep -rnE "\]\([^)]*sprints/sprint-5\.md"` over `ai-agents/` returns
> **0**: no markdown link points at the pre-archival path. ⚠️ **54 bare-path prose mentions of the old
> path do remain** in briefs, plans, worklogs and ledgers; those are **dated records of where the file
> was when they were written**, not link rot, and repointing them would make a past record claim
> something it never saw. **Reported, not fixed.**
>
> ⚠️ **One claim in the closed-rows table below has also moved:** the `P12` row says a narrower set of
> defects on `0254`'s replacement line is **"STILL OPEN as `0288`"**. **`0288` closed 2026-08-14** —
> ⛔ **but "fixed" is still the wrong word:** it shipped **five owner-ruled accepted residuals** and
> its review surfaced a **new** open defect, task `0300`. See
> [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]].

## Goal

Two halves, one sprint:

1. **The dashboard defect** (`0259`–`0261`, then `0264`–`0269`) — **the first defect a real downstream
   project ever reported in shipped fkit code.** `PLAN_SPRINT` resolved empty for every sprint-plan
   naming convention they use, making drift rule 1 inert.
2. **Release hygiene** (`0252`–`0258`) — nothing gated a release on a green tree, the update banner
   told every installed user `vX → vX`, the verify command the releaser is handed does not run, and
   the release story is written down nowhere.

## Key Changes

**Shipped (11 of 17 rows, all `✅ Done (agent-closed — not owner-verified)`):**

| Rank | Task | What landed |
|---|---|---|
| P1 | `0259` | The **red fixture** — shipped `npm test` RED **on purpose** |
| P2 | `0260` | → [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] |
| P3 | `0261` | → [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] |
| P4 | `0264` | ADR-040's identity grammar in `dashboard.sh` — both rungs **and** the `moved_target` companion |
| P5 | `0265` | ADR-041's dashboard half — the `Backlog` token and the resolve-identity interface |
| P6 | `0266` | The `sprint-*.md` glob **retired** in `fkit-status/SKILL.md` |
| P7 | `0267` | The five remaining prose sites that stated the glob as the mechanism |
| P8 | `0268` | The `➡️ Moved to [Sprint N]` gloss — `N` reads as **the identity**, not a number |
| P10 | `0256` | **CI** (`.github/workflows/test.yml`) **and** an in-release `npm test` gate |
| P11 | `0257` | The version-labeled, sha-triggered **update banner** |
| P17 | `0283` | The case-sensitivity test defect **found by fkit's first-ever CI run** |

**Still open:** `0269` (P9, wiki), `0254` (P12), `0252` (P13), `0253` (P14), `0255` (P15), `0258`
(P16, wiki).

> ✅ **CORRECTED 2026-08-13 by the wiki sync — THE "STILL OPEN" LIST ABOVE IS NOW EMPTY.** Both
> paragraphs above are left **byte-identical**; each was true when written. **All six of those rows
> closed on 2026-08-13**, every one `✅ Done (agent-closed — not owner-verified)`:
>
> | Rank | Task | What landed |
> |---|---|---|
> | P9 | `0269` | Wiki ingest of ADR-040 / ADR-041 — ran via a spawned `@fkit-wiki` librarian, **not** through `/fkit-sprint-ship-loop`; the 2026-08-10 exclusion was never violated |
> | P12 | `0254` | [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — the `npx` verify line replaced with `git ls-remote`. ⚠️ **A narrower set of defects on the replacement line is STILL OPEN as `0288`** |
> | P13 | `0252` | [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `RELEASING.md`, the maintainer document nobody had |
> | P14 | `0253` | [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — the README re-launch prose, which then became **ADR-043's premise** |
> | P15 | `0255` | [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] → [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]], owner-signed |
> | P16 | `0258` | Wiki re-sync of `systems/install-and-self-update` after `RELEASING.md` landed |
>
> ⛔ **So the count in the heading above — "Shipped (11 of 17 rows)" — is superseded: it is 17 of 17.**
> ⚠️ **All three loop-excluded rows (`0255`, `0258`, `0269`) shipped without the loop ever driving
> them**, which is the exclusion working as ruled, not a breach.
> ⚠️ **`systems/install-and-self-update` was rewritten THREE times on 2026-08-13** — by `0285`, `0258`
> and `0289` — and now carries three stacked correction layers. Whether anything should notice when a
> close falsifies a vault claim is task **`0290`**, open.

## Outcome

### ⚠️ This board supersedes a gate the owner set two days earlier — and both halves were unsatisfied

The 2026-08-08 ruling held the release-hygiene cluster off any sprint on two stated reasons. **The
stale-install test was NOT run**, and **neither `0245` nor `0246` was owner-verified.** *The gate was
lifted, not met* — because a real user filed a real defect in shipped code and the fix became the
priority. **What that costs, stated rather than implied: this board is built on an unverified Sprint
4, so if a regression surfaces, which board it came from is genuinely ambiguous.** The owner accepted
that knowingly.

### ⚠️ The founding scope DECIDED the downstream defect and never FIXED it

Sprint 5 opened on the owner's verbatim ruling **"Dashboard + all of 0252-0258"** — ten tasks. But
`0259` is a red fixture and `0260`/`0261` are ADRs: **no row turned either decision into working
code**, while the board's own `## Notes` carried an owner-ruled **release gate testing `0260`'s
landed pattern**. *So the release waited on work no board scheduled, and the downstream project's bug
would have survived the sprint that exists to fix it.* `0264`–`0269` were added by a second owner
ruling to close that hole.

### The three rank events, and what each one is *not*

1. **The out-of-band append (2026-08-10).** The owner's ruling placed the six new rows at `P4`–`P9` —
   a **mid-board insertion**. The spawned producer **declined to perform it** and appended at
   `P11`–`P16` instead, recording the ordering intent as per-brief merit statements.
   [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] and
   `/fkit-task-brief` step 5 both state that a spawned producer **never re-ranks, not even on a
   spawn-prompt instruction**. ⚠️ **The append changed the outcome**: `0264` — the row that returns
   `npm test` to green — would have been reached **last** by a rank-ordered pass. ⛔ **Not producer
   precedent for re-ranking; it is the record of a producer declining to insert.**
2. **The owner-ruled re-rank (2026-08-11).** The owner answered in prose in a live `fkit producer`
   session — **verbatim `let's do it`** — and `0264`–`0269` moved to `P4`–`P9`, displacing seven rows
   down six places. ⚠️ **This was permitted because it is a MOVE of existing rows, not an insertion**:
   nothing entered the numbering, no closed row was renumbered (the only closed rows, `P2`/`P3`, sit
   **above** the move), and the move reached exactly the top of its contiguous open run — `0264` to
   `P4`, *not one place further*. Had the ruling named `P2` or `P3` it would have been **refused**.
   ⛔ **Still not producer precedent.**
3. **The `0283` append (2026-08-13).** Appended at `P17`. ⚠️ **On merit it belongs at the TOP of the
   board, above `0259`** — it was the only red on `main`. **That position is unreachable**: nine
   closed rows sit below every position above `P11`. *The append is a forced consequence of the
   closed-row rule, not a judgement about importance.* **Flagged for owner confirmation.**

⚠️ **One merit position was NOT satisfied and is recorded rather than smoothed over:** `0265` and
`0268` both carry *"immediately below `0264`"* and only one row can hold `P5`. No dependency is
violated, but `0268` sits three below its stated merit position and **its brief says so**.

### Three rows are OUT of the `/fkit-sprint-ship-loop` run — and it is not a block

`0255`, `0258`, `0269`, by owner rulings of 2026-08-10. The two wiki rows are excluded because **the
loop never reads `## Owner`** ([[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]]):
its Build step spawns `@fkit-coder`, which is forbidden from writing the vault, so the loop would
stall on a refusal or breach ADR-005. `0255` is excluded because it needs a **second** owner beat the
loop has no gate for. ⚠️ **They stay `🔲 Backlog`, stay in Sprint 5, and keep their ranks — an
exclusion from *this loop run*, not a block, deprioritisation, or descope.** ⚠️ **Cite them by ID,
never by rank**: the 2026-08-11 re-rank moved all three, and `0269` in particular is **no longer the
bottom row — it is `P9`**, so a rank-ordered pass now reaches it early and must still exclude it.

### The board's own accumulated staleness, deliberately left

Every superseded paragraph on this board is left **byte-identical** with a dated correction appended
beneath it — the house form. The result is that the `## Status` banner says *"Ten tasks"*, the
2026-08-10 addendum says *"sixteen rows"*, and **the board carries seventeen**. Each was true when
written. ⚠️ **`backlog.md`'s seven `➡️ Moved to [Sprint 5] — priority P<n>` rows were deliberately NOT
edited** — they are closed rows and the never-renumber rule admits no exception, so their destination
ranks are **stale by design**.

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]] — the board this one follows
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]]
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the wall all three rank events were checked against
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — why the loop cannot run the wiki rows
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — where the release-hygiene cluster was carried from
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]]
- [[tasks/fix-the-version-labeled-sha-triggered-update-banner]]
- [[tasks/make-the-lockdown-guard-case-test-filesystem-independent]]
- [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]]
- [[tasks/implement-adr-041s-dashboard-half]]
- [[tasks/retire-the-sprint-glob-in-fkit-status-skill]]
- [[tasks/correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism]]
- [[tasks/gloss-the-moved-to-sprint-n-row]]
- [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]]
- [[tasks/decide-the-plan-sprint-resolution-strategy]]
- [[tasks/decide-whether-the-active-sprint-glob-widens]]
- [[systems/testing-and-verification]]
- [[systems/install-and-self-update]]
- [[systems/fkit]] · [[tasks/sprint-3-close-the-rank-integrity-loop]] · [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] — the board lineage
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `0252` (P13, closed 2026-08-13), the release-hygiene half's documentation row, and the hard precondition of `0258`
- [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — `0253` (P14, closed 2026-08-13)
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — `0254` (P12, closed 2026-08-13)
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — `0255` (P15, closed 2026-08-13), the board's only owner-signed decision row
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — `0255`'s output
- [[tasks/the-2026-08-13-vault-resync-chain]] — the six vault-maintenance rows closed 2026-08-13 (`0269` and `0258` from this board; `0263`, `0282`, `0285`, `0289` from Backlog), and the churn they exposed
- [[tasks/wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface]] — ⚠️ *Added 2026-08-14:* task `0293`, which recorded this board as **unarchived** hours before `0294` archived it
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — ⚠️ *Added 2026-08-14:* tasks `0291` and `0295`, the retroactive-review corrections to two of this board's own vault outputs (`0258`'s and `0289`'s)
- [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]] — ⚠️ *Added 2026-08-14:* task `0294`, the row that archived this board — the banner ruling, the 57-link move, and the `active none` end state
- [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]] — ⚠️ *Added 2026-08-14:* task `0288`, the Backlog follow-up to this board's `P12` row (`0254`); **closed with five owner-ruled residuals**, and it surfaced task `0300`
