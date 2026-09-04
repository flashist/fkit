# Sprint 4 — Ship the use-ready self-healing update

> ## 🔒 CLOSED — 2026-08-10. Superseded by [Sprint 5](sprint-5.md).
>
> **Sprint 4 was archived by OWNER RULING, 2026-08-10**, given via `AskUserQuestion` in a live
> session — a selection from the question's option list, **the option label is the verbatim text**:
> **"Archive it now, unverified"**, option description as presented: *banner to CLOSED, file to
> sprints/done/, links repointed, the four stale wiki-vault pages folded in. The unverified marker
> stays on every row, so the record stays honest about what was never checked. Sprint 5 opens against
> a clean board.* Executed by a spawned `fkit-producer` with no owner channel, which asked nothing and
> decided nothing beyond the mechanics of that ruling.
>
> **⚠️ ARCHIVED UNVERIFIED — read this before citing any row below as evidence.** The board reads
> **8 of 8 `✅ Done`**, and **every one of those eight closes carries
> `(agent-closed — not owner-verified)`**. **No human has checked any of them.** The owner's
> 2026-08-08 note on [`backlog.md`](../backlog.md) recorded that `0245` and `0246` were being
> personally verified; **that verification did not complete and no verification is recorded anywhere
> for any row on this board**. The markers stay on every row, verbatim, by the owner's ruling — the
> record stays honest about what was never checked. ⛔ **Do not "clean up" those markers.** They are
> the marker [ADR-025](../../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)
> introduced as its honesty condition and
> [ADR-033](../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
> §5 deliberately kept — not clutter.
>
> **⚠️ The real-project stale-install test was NOT run.** The owner's ruling of 2026-08-08 gated
> Sprint 5 on that test reporting. On 2026-08-10 the owner **lifted the gate rather than satisfying
> it**, because a downstream project running fkit `0.2.1` filed a real defect and the fix became the
> priority. So **nothing this board shipped has been exercised outside this repo.** The superseding
> note is in [`backlog.md`](../backlog.md)'s `## Notes`, beneath the original ruling, which is left
> byte-identical; the reason is restated in [Sprint 5](sprint-5.md)'s banner.
>
> **✅ AMENDED 2026-08-10 — the paragraph above is left byte-identical and is now INCOMPLETE.** Its
> facts still hold: the stale-install test **has not been run** and **nothing this board shipped has
> been exercised outside this repo**. What it does not say — because it was not yet ruled — is that the
> **verification promise now has a home that discharges it**, rather than being abandoned. Owner
> ruling of the same day, given via `AskUserQuestion` in a live session, **the option label is the
> verbatim text**: **"0262 replaces it — record that (Recommended)"**. Option description as presented
> to the owner, verbatim: *"The stale-install test on a real project exercises the same consent-gated
> repair path 0245/0246 were closed against, arguably harder than a fixture check would. Record
> explicitly that 0262 discharges the promise, so the record doesn't carry an open commitment nobody
> intends to meet. Consequence: 0245/0246 stay closed as agent-closed — not owner-verified,
> permanently."*
> [`0262`](../../tasks/backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md)
> carries the 2026-08-08 promise to personally verify `0245` and `0246` and **discharges it on
> completion**; **no separate personal owner verification of either is intended or owed.**
> ⛔ **THIS CHANGES NOTHING ABOUT THE MARKERS ON THIS BOARD.** All eight rows keep
> `(agent-closed — not owner-verified)` **permanently** — `0262` completing does **not** retroactively
> make any of them owner-verified, and **nothing on this board may be edited to suggest it does.** The
> ruling's own wording says so in those terms. ⚠️ `0262` is on the **Backlog** board, deliberately
> unscheduled and **not a release gate**; until it actually runs the promise is **assigned, not met**.
>
> **Why it was archived.** The board was drained — **8 done · 0 cancelled · 0 moved · 0 open**. A
> plain close, not a rollover: no open row moved anywhere, and not one `P<n>` was renumbered.
> Archiving it before [Sprint 5](sprint-5.md) opens is what keeps exactly **one** `sprint-*.md`
> eligible as the active sprint. *(Mechanism corrected 2026-09-04 per
> [ADR-041](../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md):
> `/fkit-status` selects by each plan's **resolved identity**, not by a `sprint-*.md` filename glob, and
> an archived plan's identity is no longer eligible. The count above is the archival's own record and is
> unchanged.)* That matters more than usual here: two active boards is the
> same ambiguity class this board's own banner flagged about Sprint 3, **and it is the exact class of
> defect Sprint 5 exists to fix.**
>
> **This plan is kept, not deleted — it is the record of what was done.** Everything below is
> historical. Do not pick up work from this file; see [Sprint 5](sprint-5.md).
>
> **⚠️ Archived, not frozen.** Sprint 1's, Sprint 2's and Sprint 3's archived boards were each edited
> after archiving. A dated correction appended below is legitimate; a silent rewrite of a rank or a
> status is not.
>
> **⚠️ A wiki re-sync is owed and was NOT performed — the vault is `fkit-wiki`'s exclusive write
> surface (ADR-005) and this producer wrote nothing there.** Two classes, listed so neither is lost:
> **(a) the four pages this board already flagged** on 2026-08-07 and which are **still stale** —
> `ai-agents/wiki-vault/index.md`, `ai-agents/wiki-vault/log.md`,
> `wiki/tasks/sprint-3-close-the-rank-integrity-loop.md`,
> `wiki/tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board.md`; **(b) what this archival adds**
> — `index.md` still names **Sprint 3** as *"🟢 The ACTIVE board"*, which was already wrong and is now
> wrong by two boards, and **the vault has no page for Sprint 4 or Sprint 5 at all** (verified
> 2026-08-10: `grep -rl 'Sprint 4' ai-agents/wiki-vault/` returns nothing). ⚠️ `log.md` is
> **append-only** under the owner's 2026-08-03 ruling — a correction there is a **new dated entry**,
> never an in-place edit.
>
> **The board's opening authority, kept in full as written 2026-08-07 (only the Sprint 3 links
> repointed for the new home; the original banner heading read "🟢 ACTIVE — opened 2026-08-07 by
> OWNER RULING. Follows [Sprint 3](sprint-3.md)."):**
>
> **Authority, stated first and in full.** This board exists by **three owner rulings given 2026-08-07
> via `AskUserQuestion` in a live `fkit lead` session**, each a selection of the producer's recommended
> option from the question's option list — **the option labels are the verbatim text**:
>
> 1. **Scope** — verbatim **"Chain-only: 0242–0249 (Recommended)"** — the eight-task structure-check
>    chain and nothing else; the two nearest adjacents (`0045`/`0046` init hardening) were named to the
>    owner and not selected.
> 2. **The board** — verbatim **"Open Sprint 4 (Recommended)"** — a fresh board, the Sprint 3 precedent.
> 3. **The goal wording** — verbatim **"Keep as proposed (Recommended)"** — the Goal below, as drafted.
>
> Relayed by `fkit-lead` from the live session; executed by a spawned `fkit-producer` with no owner
> channel, which asked nothing and decided nothing beyond the mechanics of these three rulings.
>
> **⚠️ Sprint 3's banner still reads 🟢 ACTIVE — deliberately, and flagged rather than hidden.**
> Sprint 3 closed 4/4 (all rows `✅ Done (agent-closed — not owner-verified)`), but both prior
> archivals (Sprint 1, Sprint 2) — banner → `🔒 CLOSED`, file → `sprints/done/` — happened under their
> own explicit owner ruling on archival shape, and **no such ruling exists for Sprint 3**. The executing
> producer therefore left `sprint-3.md` untouched. **Until the owner rules, two `sprint-*.md` files
> match `/fkit-status`'s active-sprint glob and the default status run's active-sprint resolution is
> ambiguous.** See §"Open questions for the owner".
>
> **✅ DISCHARGED same day, 2026-08-07 — the owner ruled and the archival is executed.** The ⚠️
> paragraph above is left byte-identical as history; it no longer describes reality. Sprint 3 now
> sits at [`sprints/done/sprint-3.md`](sprint-3.md) with a `🔒 CLOSED` banner, exactly one
> `sprint-*.md` (this board) is eligible as the active sprint, and the active-sprint resolution is
> unambiguous. *(Mechanism corrected 2026-09-04 per
> [ADR-041](../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md):
> eligibility is decided by each plan's **resolved identity**, not by matching a `/fkit-status` filename
> glob. The count above is left unchanged.)* Ruling and execution recorded in §"Open questions for the
> owner", question 1's answer block.

**Goal:** Ship the use-ready fkit: the post-update structure check and its consent-gated self-heal
path, per the `0241` design (owner-ruled 2026-08-06) — spec, manifest, check, repair, launch notice,
docs, wiki. The owner's stated purpose, verbatim: **"the main purpose of the sprint is to built the
use-ready fkit version that can self-heal / fix migration issues during update."**

## ⚠️ Ranks on this board start clean at P1

**This is a fresh board and its rank numbering restarts at `P1`.** It does **not** continue from
Sprint 3's `P4`. **Cite a rank with its board** — `Sprint 4 P3`, never a bare `P3`. Sprint 3's ranks
are unchanged and stay readable at [`sprint-3.md`](sprint-3.md).

**ADR-035's wall does not apply here yet.** No row on this board is closed, so every rank below was
assigned **on merit**, freely, honoring every dependency edge. The moment a row here closes, its rank
freezes and the wall applies again — a closed row is a wall, not a step.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | Record the **companion ADR** — the consent-gated structure-repair licence (the ADR-015 re-raise, ruled) *(**unit 1 of the `0241` follow-up batch** — all **six** design questions ruled by the owner, `AskUserQuestion`, live `fkit lead` session **2026-08-06**; Q1 verbatim **"Companion ADR (Recommended)"** — unattended launch path keeps ADR-015's invariant unchanged; in-session consent-gated repair licensed, narrow v1 = untouched-stale replacement only, no move/rename/delete; via `/fkit-record-decision`; gates `0243`/`0246`/`0247`/`0249`, ship-gates `0244`; owner: fkit-architect)* | [`0242-record-the-companion-adr-licensing-the-consent-gated-structure-repair`](../../tasks/done/0242-record-the-companion-adr-licensing-the-consent-gated-structure-repair/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | Build the **hash-manifest generator** + completeness test — the repair path's determination layer *(**unit 3 of the `0241` follow-up batch**, same six rulings 2026-08-06; Q6 verbatim **"Fold it in (Recommended)"** — ADR-015 trigger 2 **has fired** (7 drifting files ≥ 3); rename-aware walk across the scaffold's three historical homes, every shipped blob per path, CRLF→LF both sides; **depends on nothing per report §11 but SHIPS BEHIND `0242`**; owner: fkit-coder)* | [`0244-build-the-hash-manifest-generator-and-completeness-test`](../../tasks/done/0244-build-the-hash-manifest-generator-and-completeness-test/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P3 | Author the **structure-spec `.md`** (install share) + its scaffold-inventory drift test *(**unit 2 of the `0241` follow-up batch**, same six rulings 2026-08-06; Q5 verbatim **"Yes (Recommended)"** — hand-authored prose spec, mechanically guarded; class-annotated per report §4's six-class table; ADR-005 routing note on every wiki-vault row; no `version:` field — the wholesale share refresh is the staleness-proofing; needs `0242`; owner: fkit-coder)* | [`0243-author-the-structure-spec-md-and-its-scaffold-inventory-drift-test`](../../tasks/done/0243-author-the-structure-spec-md-and-its-scaffold-inventory-drift-test/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P4 | Build the **producer-owned structure-check skill** — read-only conformance report over spec + manifest *(**unit 4 of the `0241` follow-up batch**, same six rulings 2026-08-06; Q4 verbatim **"Yes, producer (Recommended)"**; per-file outcomes per report §7; `CLAUDE.md`/`AGENTS.md` marker-elision hashing per §8, malformed markers → refuse-to-classify; wiki-vault existence-only, repairs routed to `fkit-wiki` (ADR-005); wire `skills_for_role()` + hook matrix — the `0111`→`0112` lesson; **read-only in every branch — repair is `0246`**; needs `0243` + `0244`; owner: fkit-coder)* | [`0245-build-the-producer-owned-structure-check-skill`](../../tasks/done/0245-build-the-producer-owned-structure-check-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P5 | Build the **consent-gated repair path** inside the check skill — propose-then-apply, v1 scope *(**unit 5 of the `0241` follow-up batch**, same six rulings 2026-08-06; Q1 licence + Q2 verbatim **"Plan-level approval (Recommended)"** — enumerated per-file list with diffs in view, **never announce-only, never stored**; apply-time freshness re-check; v1 = untouched-stale replacement only, **no move/rename/delete**; ⛔ **do not start before `0242` lands**; needs `0242` + `0245`; owner: fkit-coder)* | [`0246-build-the-consent-gated-repair-path-inside-the-check-skill`](../../tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P6 | Add the **launch-time structure notice** + per-path intent-file suppression *(**unit 6 of the `0241` follow-up batch**, same six rulings 2026-08-06; Q3 verbatim **"Yes + yes (Recommended)"** — §11's "only if approved" condition is **discharged**; read-only stateless stderr notice, never a repair or prompt; per-path tracked intent entries — intent not progress, no global switch, no per-mismatch keying, **no cursor state anywhere**; silence on a conforming project; needs `0242` + `0243` + `0244`; owner: fkit-coder)* | [`0247-add-the-launch-time-structure-notice-and-intent-file-suppression`](../../tasks/done/0247-add-the-launch-time-structure-notice-and-intent-file-suppression/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P7 | Update the **docs** for the structure-check capability — architecture.md, README, scaffold pointers *(**unit 7 of the `0241` follow-up batch, docs half**, same six rulings 2026-08-06; ⚠️ §11's unit 7 split in two on stated cause — the wiki half is `0249`, ADR-005 forbids a coder-owned vault write; dual-homed scaffold edits land in both copies (ADR-027); needs `0242`–`0246` per §11's "1–5"; owner: fkit-coder)* | [`0248-update-the-docs-for-the-structure-check-capability`](../../tasks/done/0248-update-the-docs-for-the-structure-check-capability/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P8 | Wiki ingest of the structure-check **design report + companion ADR** *(**unit 7 of the `0241` follow-up batch, wiki half** — split from `0248` on stated cause, ADR-005 makes the vault write `fkit-wiki`-exclusive; the `0238`/`0239` precedent; ingest report `2026-08-06-design-post-update-structure-check.md` + the `0242` ADR; needs `0242`; best after `0248` — preference, not dependency; owner: fkit-wiki)* | [`0249-wiki-ingest-of-the-structure-check-design-report-and-companion-adr`](../../tasks/done/0249-wiki-ingest-of-the-structure-check-design-report-and-companion-adr/brief.md) |

## How this board was ranked

**Every rank was assigned on merit, by a spawned producer, on a board with no closed rows, and no rank
places a task above anything it depends on.** The dependency edges are the ones each brief declares
(report §11's table, owner-ruled). The reasoning, per rank:

1. **`0242` at P1** — the licence. It gates `0243`/`0246`/`0247`/`0249` and ship-gates `0244`: nothing
   else on this board can *finish* without it. It depends on nothing.
2. **`0244` at P2** — zero dependencies, pure mechanism; can start in parallel from day one and only
   *ships* behind `0242`. Everything downstream reads its manifest.
3. **`0243` at P3** — the second input to the check; needs `0242` landed to confirm the spec's
   home/contract first.
4. **`0245` at P4** — the check itself; consumes both inputs (`0243` + `0244`), so it ranks after both.
5. **`0246` at P5** — the sprint's headline, the self-heal; hard-gated on `0242` (do not start before
   it lands) and built inside `0245`'s skill. Last in the core chain.
6. **`0247` at P6** — dependency-eligible at P4 (needs only `0242`/`0243`/`0244`), ranked below `0246`
   on merit: the repair path is the goal; the notice is surfacing, not healing.
7. **`0248` at P7** — docs describe what landed; needs `0242`–`0246` (report §11's "1–5"; `0247` is
   explicitly *not* a dependency — if unlanded it is documented as filed).
8. **`0249` at P8** — the vault write is `fkit-wiki`-exclusive (ADR-005); hard-gated only on `0242`,
   ranked last so it ingests the finished state (after `0248` — preference, not dependency).

## Open questions for the owner

1. **Sprint 3's archival shape.** Sprint 3 is 4/4 closed but still banner-`🟢 ACTIVE` in
   `ai-agents/sprints/`. Both precedents (Sprint 1, Sprint 2) archived under an explicit owner ruling
   — banner → `🔒 CLOSED`, file → `sprints/done/`, links repointed. No ruling exists for Sprint 3, so
   the executing producer left it untouched. **Until ruled, `/fkit-status`'s default run sees two
   `sprint-*.md` files and its active-sprint resolution is ambiguous.** Recommended: rule "follow the
   Sprint 1/2 precedent" and have a producer execute it.

   > **✅ ANSWERED same day, 2026-08-07 — ruled and executed; this question is CLOSED.** Owner ruling
   > via `AskUserQuestion` in the live `fkit lead` session, a selection from the question's option
   > list — **the option label is the verbatim text**: **"Follow Sprint 1/2 precedent (Recommended)"**,
   > option description as presented: *banner → 🔒 CLOSED superseded-by-Sprint-4, file →
   > `sprints/done/sprint-3.md`, links repointed, executed by a spawned producer.* Relayed by
   > `fkit-lead`; executed the same day by a spawned `fkit-producer` with no owner channel. The
   > original question text above is left byte-identical per house style. Execution record: banner
   > flipped and archival authority written into [`done/sprint-3.md`](sprint-3.md); file moved;
   > inbound links repointed in this board, `backlog.md`, `done/sprint-2.md`, and briefs
   > `0224`/`0225`/`0185`; prose mentions of the old path deliberately left (the `0076`/`0236`
   > precedent: change the pointer, never the prose). **⚠️ 4 wiki-vault pages still carry the stale
   > path or call Sprint 3 active — not touched (ADR-005; only `fkit-wiki` writes the vault), listed
   > for the wiki role**: `index.md`, `log.md`, `wiki/tasks/sprint-3-close-the-rank-integrity-loop.md`,
   > `wiki/tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board.md`.
