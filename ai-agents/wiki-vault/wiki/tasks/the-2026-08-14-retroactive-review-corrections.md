# The 2026-08-14 retroactive-review corrections — two vault pages fixed by reviews that left no artifact

**Source**: `ai-agents/tasks/done/0291-correct-two-stale-vault-claims-surfaced-by-0258s-review/brief.md` · `ai-agents/tasks/done/0295-correct-the-false-0254-review-attribution-and-the-unconditional-exit-2-claim/brief.md`
**Status**: done — both `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-14
**Sprint/Tag**: Backlog, unscheduled · Owner `fkit-wiki` on both · tasks `0291` and `0295`

> ⚠️ **Two tasks, one page — and the reason is the finding.** They are recorded together the way
> [[tasks/the-2026-08-13-vault-resync-chain]] records six rows together: *the chain is the finding.*
> **Both rows exist because a vault page shipped with no reviewer pass, and the retroactive review that
> caught the defects wrote nothing to disk.** They were also **executed as one librarian run, in one
> write** to the page both had to touch. ⛔ They are not one task, and neither ID substitutes for the
> other: `0291` corrects `0258`'s output, `0295` corrects `0289`'s.

## Goal

Repair four defects in vault prose that two **retroactive, ephemeral** reviews found after the tasks
that produced the prose had already closed.

- **`0291`** — two claims surfaced by an independent `fkit-reviewer` pass over task `0258`'s vault
  work (`ai-agents/tasks/done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md`),
  run 2026-08-13 at the owner's request **because `0258` shipped with no reviewer pass at all.** Owner
  ruling 2026-08-13, verbatim option label **"One task covering both"**.
- **`0295`** — two findings from an independent review of `0289`'s vault output, likewise run after
  `0289` had closed. Owner rulings 2026-08-13, verbatim option labels **"One new task covering both
  halves"** (F1) and **"Correct alongside F1, same pass"** (F2).

### ⚠️⚠️ Neither review left an artifact on disk — these briefs are the only durable carriers

`0258`'s task folder holds **`brief.md` only**; there is **no `review.md`**, and nothing under
`ai-agents/sprints/reviews/` covers it. `0289` is closed, and writing a review ledger into a closed
task folder is barred. ⛔ **Do not go hunting for either review file. Neither exists.** A run spent
looking is a run wasted — which is precisely why the two briefs were written.

### ✅ Both reviews graded their subjects SOUND — neither row re-opens anything

`0258`: six facts checked, all held; no reversal, no scope leak, no false claim. `0289`: substantially
sound; it did not commit its named fail condition, and its byte-identity claims were proven. ⛔ **These
are four low-severity corrections, not repudiations.**

## Key Changes

### ⚠️ Two files, two different conventions — and blurring them breaks the log's contract

| | File | Method |
|---|---|---|
| `0291` item 1 | `ai-agents/wiki-vault/index.md` | An **ordinary current-state page edit** — replaced in place |
| `0291` item 2 | `ai-agents/wiki-vault/log.md` | **APPEND-ONLY** — a **new dated entry**; the old line stays **byte-identical** |
| `0295` F1 + F2 | `wiki/systems/install-and-self-update.md` | Dated in-place corrections, that page's own convention |
| `0295` F1, log half | `ai-agents/wiki-vault/log.md` | **APPEND-ONLY** — a second new entry |

⛔ **Applying the page method to `log.md` breaks its own header rule** (`log.md:3-5`: *"Never edit or
rewrite existing entries; only append"*), settled as an owner ruling on `0212`, 2026-08-03.

### `0291` item 1 — the superseded `~6 min` runtime figure on `index.md`

The `0256` roll-up line carried the owner's **earlier** `~6 min` ruling, which the owner **overrode**
on 2026-08-13 with the verbatim range ***"roughly 6–8 minutes, machine-dependent"***. Corrected in
place; the ruled wording is live at `RELEASING.md:128`.

⛔ **No duration list was published, deliberately — and this is a standing constraint, not a
one-off.** A tally of measured seconds was offered to the producer that filed the row and **could not
be fully reproduced from disk**: a 2026-08-13 sweep located some figures (chiefly in
`.github/workflows/test.yml` and `0252`'s review ledger) and **could not locate several others at
all**. `0291` turned that unreproducibility into the constraint: **echo the ruled range, cite evidence
by anchor, never publish a set.**

### `0291` item 2 — `log.md` named `0288` where the owed work was `0289`

Inside the `0258` ingest entry, a paragraph about an **owed resync of the vault page** named the
follow-up **`0288`**. ✅ **The grade is PARTIALLY CORRECT and the correction is an ADDITION, not a
reversal** — `0288` really was filed, really is a same-day follow-up, and was still open. But `0288`
is the **code-fix** row (`## Owner: fkit-coder`); the **resync** debt the paragraph was describing
belongs to **`0289`** (`## Owner: fkit-wiki`), which **did not yet exist** when that entry was
written. ⛔ **An entry saying the old one "was wrong" would have overshot and failed the item.**

### `0295` F1 — a FALSE ATTRIBUTION to `0254`'s review

Both `log.md` and `install-and-self-update.md` stated that `0254`'s review says `doTag` / `doPush` are
*"read at `:82-83` and never consulted again"*. ⛔ **That review contains no such clause** —
`grep -c 'consult'` over `0254`'s `review.md` returns **`0`**; the word does not occur in the file.
✅ **The false gloss is real** — its home is **`0288`'s brief** (`grep -c 'consult'` → **6**). ⛔ **Only
the attribution was wrong.** ✅ **And `0289`'s core mechanism sentence was CORRECT and is untouched**:
the summary block is guarded **only** by `dryRun`, and the page's enumeration of the seven `doTag` /
`doPush` sites is exact.

### `0295` F2 — an `exits 2` claim that read as unconditional

The page said that under `--no-tag` or `--no-push` the verify check **exits 2**, beside *"prints on
every non-dry path"*. Re-measured from `bin/release.mjs`: **`--no-bump` over a tag already on origin
runs the same check and it exits 0** — a false green. The sentence was scoped to the two flags it
belongs to. ✅ **Low severity, stated as such**: the false-green bullet follows immediately, so a
reader of both was never misled. **Count nit, same block:** a *"Three findings"* lead-in stood above
**four** bullets; the fourth is a deliberate **non-finding** (the `${tag}` exclusion, owner-ruled
*"Unactioned — pre-existing"*) and ⛔ **was not deleted** — it exists to stop a reader treating
`${tag}` as open.

### `0295` third item — five one-way links reciprocated, in the SAME write

A 2026-08-13 sync created five wiki-links pointing **at** [[systems/install-and-self-update]] with no
back-link. ⚠️ **That run found the gap, fixed it, and then reverted its own fix** rather than make a
**fourth same-day write** to that page, recording the reversion as a breach of a *"do not touch"*
fence. The five back-links landed here instead, all re-verified from disk. **Before: 0 of 5. After:
all five reciprocate.**

## Outcome

- **Both closed `(agent-closed — not owner-verified)`. No human has checked either.**
- ✅ **The batching ruling worked end to end.** The owner filed `0293` rather than running it, to stop
  a fourth same-day write to one page; `0291` and `0295` then ran as **one librarian session with one
  write** to that page, carrying `0293`'s deferred link debt with them.
- ⚠️ **The librarian flagged both as complete and closed neither** — ADR-033: the wiki flags, a
  producer closes. Both were closed by a producer on 2026-08-14.
- ⚠️ **`0291` reported a content-page occurrence rather than fixing it, by instruction** — the same
  superseded figure and the forbidden duration list on
  [[tasks/gate-releases-so-an-untested-tree-cannot-ship]]. That report **became task `0297`**, which
  corrected both sites on 2026-08-14. ✅ **The report-don't-fix boundary produced the right next row.**
- ⚠️ **One reported occurrence is still open and is NOT covered by either row:**
  `systems/install-and-self-update.md`'s **CI run count** (*"5 runs — 4 success, 1 failure"*, measured
  2026-08-13). It sits inside a **dated** block, where a dated measurement is correct-as-of-its-date by
  that page's convention, and it is outside both rows' owner-ruled scope. ✅ **The claim it exists to
  defeat is unaffected** — neither *"there is no CI"* nor *"CI is always green"* holds.
- **Evidence, not an answer, for `0290`.** Both rows are clean instances of a close elsewhere
  falsifying a vault claim — the pattern `0290` is investigating — and **nothing detected either; a
  human or an agent noticed.** ⛔ Neither row answers `0290`'s question.

> ✅ **Dated correction 2026-08-14 (the post-`0288` sync; everything above is left byte-identical —
> each claim was true when written).** Three of them have moved:
>
> - **`0288` has LANDED and closed** (`✅ Done (agent-closed — not owner-verified)`, committed in
>   `9e61f9b`). Wherever this page calls it *"still open"* or says `0254`'s *"successor defects `0288`
>   still carries"*, read **history**. ⛔ **"Fixed" is still the wrong summary** — five owner-ruled
>   residuals shipped with it, and its review surfaced a **new** open defect, task `0300`. Full
>   record: [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]].
> - **`0297` is CLOSED** and now has its own page,
>   [[tasks/correct-the-superseded-runtime-figure-on-the-gate-releases-page]]. ⚠️ **Its sweep was
>   incidental, and it missed one occurrence** — the same superseded figure **and** a barred four-run
>   duration list survived on [[systems/testing-and-verification]] until this sync corrected them.
>   ✅ **`0291`'s bar held where it was applied**; what failed was the width of the search.
> - **The CI-run-count occurrence flagged above is STILL open and still unfixed** — now reported a
>   third time. ⛔ It needs a task or an explicit decision to leave it; a librarian reporting it again
>   is not a fix.

## Related
- [[systems/install-and-self-update]] — the page both rows corrected, in one shared write
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — ⚠️ *Linked 2026-08-14:* task `0254`, whose review `0295` proved was **falsely cited**; previously referenced here in prose only, now reciprocated because that page links here
- [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]] — ⚠️ *Added 2026-08-14:* task `0288`, the row whose landing turned this page's *"still open"* references into history
- [[tasks/correct-the-superseded-runtime-figure-on-the-gate-releases-page]] — ⚠️ *Added 2026-08-14:* task `0297`, the row `0291`'s report-don't-fix boundary produced
- [[tasks/the-2026-08-13-vault-resync-chain]] — the six-row chain and the three-writes-in-one-day churn that produced the owner's batching ruling
- [[tasks/wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface]] — task `0293`, the batching partner whose deferred link debt these two discharged
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, whose vault page carried the same superseded figure; reported here, fixed by `0297`
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the archived board `0258` closed on
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why both rows are owned by `fkit-wiki` and by nothing else
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the librarian flagged both and closed neither
- Referenced without a wiki-link, deliberately, so this page adds no further back-link debt: task `0254` (whose review was falsely cited, and whose successor defects `0288` still carries), task `0252` (whose landing triggered `0258`, the row `0291` corrects), and task `0211` (the **carve-out** to the append-only rule — ⛔ not permission)
