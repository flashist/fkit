# Correct the superseded runtime figure — and the forbidden duration list — on the `gate-releases` vault page

**Source**: `ai-agents/tasks/done/0297-correct-the-superseded-runtime-figure-and-forbidden-duration-list-on-the-gate-releases-page/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-14
**Sprint/Tag**: Backlog board, unscheduled and unranked · task `0297` · owner `fkit-wiki`

## Goal

`0291` found the superseded `~6 min` runtime figure on `index.md`, fixed it there, and — **by
instruction — reported rather than fixed** the same defect where it survived on a content page. This
row is that report turned into work: two sites on
[[tasks/gate-releases-so-an-untested-tree-cannot-ship]], both verified on disk 2026-08-14.

- the *"~6 minutes separate the gate from `git add -A`"* clause, and
- a **per-run duration list**: *"Measured suite runtime: ~5m30s–6m20s across four local runs (328 /
  380 / 347 / 344 s)…"*

Both superseded by the owner's ruling of 2026-08-13, verbatim option label ***"Range: 'roughly 6–8
minutes, machine-dependent'"*** — which **overrode an earlier `~6 min` ruling of the owner's own**.
The ruled wording is live at `RELEASING.md:128`.

## Key Changes

- **Both paragraphs now carry the ruled range**, and the earlier text was **replaced rather than
  annotated**, because that is what the row required — a departure from the vault's usual
  frozen-body-plus-dated-note form, made deliberately and recorded in the page's own correction block.
- ⛔ **No per-run duration list was published, and one must not be added back.** `0291` turned an
  unreproducibility into a standing constraint: a 2026-08-13 sweep could locate some of the measured
  figures on disk and **could not reproduce the rest**. ⛔ **Replacing four numbers with six
  better-sourced numbers is not the fix — it is the same defect with fresher data.** Cite
  `.github/workflows/test.yml` and `0252`'s ledger **by anchor**, never as a set.
- ⛔ **Nothing outside the vault was touched**, and ⛔ **no existing `log.md` entry was edited** — the
  log's superseded quotations stand as the dated record of what was reported.

⚠️ **A scope note this row had to rule on.** Its `## Notes` said it *"runs in a `fkit wiki` session,
not `/fkit-sprint-ship-loop`"*, on the ground that the loop's Build step is fixed to `@fkit-coder`
(ADR-038), who may not write the vault (ADR-005). It ran as an `fkit-wiki` agent **spawned directly by
the driver**, not through the Build step — so **the substance of the fence held: a librarian wrote the
vault and no coder did.** Recorded rather than assumed.

## Outcome

### ⚠️ Its sweep was incidental, not vault-wide — and this sync found the occurrence it missed

The row's own report said the sweep was *"incidental to this work… not a vault-wide hunt and should
not be read as one"*, and reported **no other occurrence on any vault content page**. ⛔ **That
conclusion was wrong on one page.** A vault-wide sweep run by the 2026-08-14 sync
(`/usr/bin/grep -rnE "6 min|5m30s|6m20s|328|6–8 minutes"` over `wiki/` and `index.md`) found
[[systems/testing-and-verification]] carrying **both** defects in one place — the superseded
`~5m30s–6m20s` figure **and** the barred four-run tally `(328 / 380 / 347 / 344 s)`. **That sync
corrected it.** ✅ **The lesson is the one the vault keeps re-learning: a sweep is only as wide as the
command that ran it, and a qualified negative must stay qualified.**

### Flags it raised and did not fix — dispositions as of 2026-08-14

- **`0288` was in flight and would falsify what this row had just written.** ✅ It has since **landed**
  and the affected pages were repaired by the same-day sync — see
  [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]]. ⚠️ **The ruled range it
  restored predates `0288`'s cost and may now understate it**; changing a ruled figure needs the
  owner, and `RELEASING.md` is outside the vault.
- **The CI run count on [[systems/install-and-self-update]] is still stale** (*"5 runs — 4 success, 1
  failure"*, measured 2026-08-13; a 2026-08-14 measurement recorded more). It sits inside a **dated**
  block, where a dated measurement is correct-as-of-its-date by that page's convention. **Reported
  three times now, still unfixed** — it needs a task or an explicit decision to leave it.

⚠️ Closed `(agent-closed — not owner-verified)`. **No human has checked it.**

## Related
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, the page this row corrected
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — `0291`, whose report-don't-fix boundary produced this row, and the standing bar on duration lists
- [[systems/testing-and-verification]] — the page carrying the occurrence this row's sweep missed
- [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]] — `0288`, the landing this row flagged as pending
- Referenced without a wiki-link, deliberately: **ADR-005** (why this row is `fkit-wiki`'s and nobody else's) and **ADR-038** (the loop-step role rule its scope note reasons over)
