# Sweep B's members — the seventeen single-site correction-note rows it absorbed and closed

**Source**: `ai-agents/tasks/done/0146-correct-the-false-menu-pick-claim-in-0139s-accepted-residual/brief.md`; also `done/0170-correct-the-stale-byte-unchanged-claim-in-fkit-sprint-ship-loop/brief.md`, `done/0183-correct-the-no-closed-row-renumbered-claim-in-two-live-records/brief.md`, `done/0196-correct-adr-010s-skilloverrides-claims-retired-by-adr-018/brief.md`, `done/0205-append-a-dated-correction-note-to-adr-037-section-5s-enforcement-claim/brief.md`, `done/0207-append-a-dated-correction-note-to-adr-020-naming-the-driver-a-sanctioned-plan-md-writer/brief.md`, `done/0274-append-dated-coverage-corrections-to-0259s-and-0264s-closed-review-ledgers/brief.md`, `done/0276-correct-the-unresolved-plan-sprint-drift-mechanism-claim-in-adr-041-and-its-echoes/brief.md`, `done/0279-gloss-the-undefined-n-in-status-report-formats-moved-value-in-both-homes/brief.md`, `done/0281-correct-adr-003s-still-unmet-automated-verification-claim/brief.md`, `done/0299-correct-the-two-active-sprint-glob-mechanism-claims-0267-missed-in-the-archived-sprint-4-and-5-plans/brief.md`, `done/0318-append-a-dated-correction-note-to-0238s-closed-brief/brief.md`, `done/0335-correct-the-wrong-ls-dereferences-mechanism-in-four-0327-records/brief.md`, `done/0346-append-a-dated-correction-note-to-adr-038s-step-table-claim-scoped-to-build/brief.md`, `done/0348-decide-and-if-ruled-correct-the-two-post-adr-042-coverage-full-review-ledgers/brief.md`, `done/0350-append-the-dated-r3-discharge-note-to-0125s-closed-review-ledger/brief.md`, `done/0351-correct-prove-red-shs-false-only-proof-the-seam-is-honoured-wording-at-0k-and-0l/brief.md`
**Status**: done — all seventeen `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Backlog board, unranked · worked inside Sprint 7's Sweep B (`0357`), 2026-09-04 · owners as filed: `fkit-architect` (`0196`, `0205`, `0207`, `0276`, `0281`, `0346`), `fkit-reviewer` (`0146`, `0274`, `0348`, `0350`), `fkit-producer` (`0183`, `0318`, `0335`), `fkit-coder` (`0170`, `0279`, `0299`, `0351`)

> ⭐ **Ingested 2026-10-24 by task `0380`** (the closed-task backlog Sweep C bounded out). One page for all
> seventeen because they were done as **one pass** and closed off **one hand-off list**. The pass itself is
> [[tasks/sweep-b-the-single-site-correction-notes]]. Sweep B's eighteenth close, `0312`, already had a
> page — [[tasks/correct-the-false-ci-has-never-run-claims-in-architecture-md]] — and is not repeated here.

## Goal
Each row is a **single-site correction note**: a record says something no longer true, so add a dated
note at that site saying so. No behaviour change; the note is the whole deliverable. Each was filed as
its own row (six artifacts to append one paragraph); Sweep B did them in one pass under one set of rules.

## Key Changes
**Every member's central claim was re-checked first-hand on 2026-09-04 and reproduced** — none was
cancelled for not reproducing.

| Task | The false or stale claim | What landed |
|---|---|---|
| `0146` | `0139`'s accepted residual said `team` / `team room` are still accepted as **menu picks** — the code accepts them nowhere | The residual's title and What clause fixed, original quoted in a dated note (`+35 / −3`, a ruled in-place correction). ⚠️ The same false claim at two more places in that ledger: reported only |
| `0170` | `fkit-sprint-ship-loop` said `fkit-task-ship-loop` *"stays byte-unchanged"* — ADR-033 rewrote its step 9. **Two** sites, one in `## Hard rules` | Both skill sites reworded to scope the claim (`+7 / −2`); one dated note on ADR-032 covering its two matching sites (`+52 / −0`) |
| `0183` | Sprint 2's addendum and `0174`'s brief both said *"no closed row was renumbered"* by an insertion — **eight** closed rows were. The check had been run in the wrong direction; *"reachable"* also meant two different things | Dated notes in both records naming all eight folder IDs; no rank cell touched |
| `0196` | ADR-010 described the skill lock as a `skillOverrides` "off" list — *"hidden … and unrunnable"*. ADR-018 replaced it with a hook; an unowned skill is now **visible but blocked** | Two ⚠️ notes plus a header continuation line (`+61 / −0`). ⭐ ⚠️ not ⛔: **a drift, not a reversal** — enforcement is still structural |
| `0205` | ADR-037 §5: *"no mechanical enforcement, and none is possible"* | One note (`+65 / −0`), present tense: a **carry-fidelity proxy** is checked by the live carry-check hook; ⛔ the approval condition itself is not machine-checkable. A **narrowing**, not a reversal; the re-raise trigger has **not** fired |
| `0207` | ADR-020 called `plan.md` **coder-written**; since `0202` the sprint-loop **driver** writes it at plan approval | One note (`+32 / −0`); the timing clause affirmed unchanged; the *"delegate the write to a coder"* option stated not available (it recreates the failure `0202` fixed). ⚠️ ADR-020's `plan.md` Path cell names a directory that does not exist — disclosed, not fixed |
| `0274` | `0259`'s and `0264`'s closed ledgers said coverage was **full** — calibrated on the old binary, before ADR-042 | Dated notes in both ledgers (`+20 / −0`, `+23 / −0`); owner ruled the corrections wanted and the append form (*"Yes — append the corrections"*, 2026-08-11) |
| `0276` | ADR-041 said a stray board *"reports `unresolved-plan-sprint` on every run"* — that drift line is board-mode only; the real per-run signal is a `candidate … identity="unresolved"` line | Two notes + header bullet on ADR-041 (`+62 / −0`); one echo in `fkit-task-brief/SKILL.md` fixed. A neighbouring sentence (*"the tool says so on every run and never guesses"*) was **tested and left as correct** (ruling N3) |
| `0279` | `status-report-format.md`'s `➡️ Moved to [Sprint N]` value left `N` undefined, in **both** homes | The same gloss `0268` landed elsewhere, added textually identical to both homes; the structure manifest regenerated |
| `0281` | ADR-003 (superseded) said fkit's need for automated verification is *"still unmet"* — `0256` landed a CI workflow and a release test gate | A continuation note under the Status bullet + header bullet (`+55 / −0`); Status value stays `superseded`. ⚠️ Whether a **hybrid** in-place rewrite would be allowed was left to the owner — it would be the first of its kind |
| `0299` | Five sites in the archived Sprint 2–5 plans still named the `sprint-*.md` glob as the active-sprint mechanism (ADR-041 retired it) | Mechanism wording corrected at all five; ⭐ **the three owner-fenced count phrases (*"exactly one `sprint-*.md`"*) kept verbatim** |
| `0318` | `0238`'s closed brief described Sprint 3 as the active board | Two dated notes (`+34 / −0`). Its *"three rows"* phrase **left alone**: commit history shows it was true the day it was written |
| `0335` | Records in `0327`'s folder gave **wrong mechanisms** for two real defects: the fail-safe is not symlink-blind because *"`ls` dereferences"*, and a wrong-type squatter does not always trip a hard exit | Notes for **two subjects across eight sites, never merged**, in a new third-party section; the reviewer's, coder's and residual sections byte-identical |
| `0346` | ADR-038 said loop roles *"come from the enumerated step table"* — ADR-044 makes the **Build** role follow the deliverable's skill | One note (`+46 / −0`), ⛔ **scoped to Build**; Verify excluded by name, Plan out of scope. It records that ADR-044's loop change had not yet shipped |
| `0348` | `0188`'s closed ledger: *"Coverage: full"* for a Codex pass that was reasoning-only | One note (`+28 / −0`) — **`0188` only**, by owner ruling *"Correct 0188 only (Rec)"*. ⛔ `0327`'s ledger left frozen: it was honest in the vocabulary its reviewer had |
| `0350` | `0125`'s ledger still showed residual R3 as standing, though `0154` built the test it waited for | One ⚠️ discharge note (`+45 / −0`): check 4 is unchanged and **deliberately** still fail-open in shape; not to be re-raised |
| `0351` | `test/prove-red.sh` steps `0k` / `0l` each claimed to be *"the only proof"* their seam is honoured — they are green either way; the mutations going red are the proof | Comment-only fix at both steps. ⚠️ A third site (mutation 23's comment) reported, not fixed (ruling L5) |

**Three diff shapes, each the one its own brief ruled:** append-only for every ADR and closed-folder
note; a ruled in-place correction for `0146`, `0170`'s skill sites, `0299` and `0351`; and one byte
exception (a stray NUL in `0246`'s ledger, which absorbed no row).

**Two ordering collisions were handled, not ignored:** `0183` and `0299` both edit the archived Sprint 2
board, so they ran as one edit pass; `0348` forbids touching `0327`'s ledger and `0335` must append to
it, so `0348` ran first and its empty-diff proof was taken at that moment (ruling L2) — the final tree
shows `0335`'s lawful addition.

## Outcome
- **All seventeen closed off one hand-off list** (eighteen with `0312`), every one agent-closed.
  `0201` was a candidate but stayed open (ruling L1 — its own gate is unmet).
- ⚠️ **Vault follow-up:** the sweep wrote no vault page (ADR-005). The ADR pages it made stale
  (ADR-003, -010, -020, -032, -037, -038, -041) got their dated resync notes in Sweep C.
- ⚠️ **Proof strength:** `0348`'s empty-diff check is a snapshot at one moment, not a whole-tree diff.
- *Later, measured 2026-10-24:* `0351`'s two corrected comments **no longer exist** — `test/prove-red.sh`
  is now 305 lines and names neither seam variable, after ADR-057's cut (`0529`, see
  [[tasks/the-test-scope-reset-tasks-0526-0530]]). The correction was true when made; its site is gone.

## Related
- [[tasks/sweep-b-the-single-site-correction-notes]] — the pass that did the work
- [[tasks/sweep-a-members-the-ten-citation-rot-rows-and-0349]] · [[tasks/sweep-c-members-the-five-vault-resync-rows]] — the other two sweeps' members
- [[tasks/correct-the-false-ci-has-never-run-claims-in-architecture-md]] — `0312`, Sweep B's eighteenth close
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board Sweep B ran on
- [[decisions/adr-003-ci-runs-validate-bundles]] · [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] · [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] · [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] · [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — the ADRs these members annotated
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]] — the change behind `0346`
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the vocabulary behind `0274` and `0348`
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — `0139`, whose residual `0146` corrected
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — `0174`, whose brief `0183` corrected
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — `0202`, the driver write `0207` recorded
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — `0162`, whose report asked for `0205`
- [[tasks/correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism]] — `0267`, which `0276` and `0299` followed up
- [[tasks/gloss-the-moved-to-sprint-n-row]] — `0268`, the gloss `0279` copied
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, which made ADR-003's claim stale
- [[tasks/the-2026-08-15-done-in-fact-wiki-closes]] — where `0238` (corrected by `0318`) is recorded
- [[tasks/refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim]] — `0327`, whose records `0335` corrected
- [[tasks/repair-the-five-live-ownership-fact-defects]] — `0188`, whose ledger `0348` corrected
- [[tasks/wiki-skills-flag-ready-to-close]] · [[tasks/build-wiki-flag-convention-test]] — `0125` and `0154`, the R3 chain `0350` closed out
- [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]] · [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] — `0259` / `0264`, the ledgers `0274` corrected
