# Wiki re-sync after the Sprint 4 archival and the Sprint 5 open — the vault still calls Sprint 3 the active board

## ID
0263

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-wiki

## Context

### Authority — an owner ruling, and it rules on SCOPE as much as on filing

**Owner ruling, 2026-08-10**, given via `AskUserQuestion` in a live session — a selection from the
question's option list, **the option label is the verbatim text**: **"New brief for this archival"**.
The option description as presented to the owner, verbatim:

> *File a separate wiki task for the Sprint 4 archival + Sprint 5 open. The producer refused to widen
> 0238 unasked, which was right — different delta, different source. Keeps each wiki task's scope
> honest.*

This answers the open question left in [Sprint 5](../../../sprints/done/sprint-5.md)'s `## Notes` and on
[Sprint 4](../../../sprints/done/sprint-4.md)'s archival banner: **a new brief, not a widening of
`0238`.**

### ⚠️ This task does NOT subsume `0238`, and the reason is the ruling's own reason

[`0238`](../../done/0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md) re-syncs the
vault after the **Sprint 2 → Sprint 3** rollover of 2026-08-06. **This task re-syncs it after the
Sprint 4 archival and Sprint 5 open of 2026-08-10.** Different archival, different source delta,
different set of false claims. Neither is a superset of the other:

- `0238`'s subject is the pre-archival path `ai-agents/sprints/sprint-2.md` and every claim that
  Sprint 2 is current.
- **This task's subject** is the dead path `ai-agents/sprints/sprint-3.md`, the claim that Sprint 3 is
  the **active** board, and **the total absence of any Sprint 4 or Sprint 5 page**.

**They are adjacent and batchable in one `fkit-wiki` session — that is a scheduling observation, not
a dependency.** Neither gates the other, and running one does not discharge the other. ⚠️ **If
`0238` runs first and happens to correct a site named below, re-measure rather than assuming: this
brief's counts are a floor, not a scope.**

### What is false in the vault today — every site re-verified on disk 2026-08-10

**Measured this run**, not carried on report:

1. **`ai-agents/wiki-vault/index.md:65` — wrong twice, and it is the vault's most-read line.** It
   reads:
   > `- [[tasks/sprint-3-close-the-rank-integrity-loop]] — 🟢 **The ACTIVE board**
   > (`sprints/sprint-3.md`), opened 2026-08-06 by owner ruling …`

   Sprint 3 is **not** the active board — it is wrong **by two boards** (Sprint 4 archived, Sprint 5
   open). And the path is **dead**: `ai-agents/sprints/sprint-3.md` **does not exist** (verified
   2026-08-10 — the file is `ai-agents/sprints/done/sprint-3.md`). This is the **only live
   active-board claim in the vault**; every other instance is inside a frozen entry.

2. **`ai-agents/wiki-vault/log.md` — frozen stale claims, in the 2026-08-07 sync entry.** Two lines,
   both inside that dated entry:
   - **`:1738`** — *"Ingested: `ai-agents/sprints/sprint-3.md` → **created** … **the active board**
     since the 2026-08-06 owner-ruled rollover"*
   - **`:1748`** — *"`index.md`: Sprint 3 entry added as **the active board** …"*

   **⚠️ `log.md` is APPEND-ONLY under the owner's ruling of 2026-08-03 (task `0211`). A correction
   here is a NEW DATED ENTRY, never an in-place edit — no exceptions.** Both lines above are frozen
   history and are **correct as the record of 2026-08-07**; they are stale only as statements about
   today. **⛔ Do not rewrite them.**

3. **`ai-agents/wiki-vault/wiki/tasks/sprint-3-close-the-rank-integrity-loop.md:3` — a dead
   `**Source**:` path.** It reads ``**Source**: `ai-agents/sprints/sprint-3.md` `` and that file does
   not exist. The real source is now `ai-agents/sprints/done/sprint-3.md`. ⚠️ The same page's
   `**Status**` line reads *"done — all four rows … as of 2026-08-06"*, which is **still true** —
   sharpen the path, do not reverse the status.

4. **`ai-agents/wiki-vault/wiki/tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board.md:30` — a
   dead path in a table cell.** ⚠️ **CORRECTION to how this site was reported to the filing producer:
   its `**Source**:` line is NOT stale.** Line 3 points at
   `ai-agents/tasks/done/0185-decide-whether-sprint-2-rolls-over-to-a-fresh-board/brief.md`, which
   **exists** (verified 2026-08-10). The stale path is at **line 30**, inside the outcome table:
   > `| Create the fresh board | `ai-agents/sprints/sprint-3.md` — ranks **restart at `P1`** |`

   ⚠️ **That cell is a description of what `0185` DID on 2026-08-06 — it was correct when written.**
   The right treatment is the vault's dated-correction form, not a silent path swap that would make a
   historical record read as a present-tense claim. **The wiki role owns that call.**

5. **The vault has NO page for Sprint 4 or Sprint 5 at all.** Verified 2026-08-10:
   `grep -rl 'Sprint 4' ai-agents/wiki-vault/` returns **nothing** (exit 1), and so does
   `grep -rl 'Sprint 5' ai-agents/wiki-vault/`. **This is the largest gap and it is an absence, not a
   stale string — no path grep will ever surface it.** Two whole boards, ten Sprint 5 rows, an
   archival ruling and a lifted gate are unrecorded.

**Total dead-path instances of the literal `sprints/sprint-3.md`: 4, across 4 files** (measured
2026-08-10). That is a **floor on the work, not a scope** — the false claim *"Sprint 3 is active"* can
be phrased without that string, and those sites will not appear in a path grep. `0238`'s own brief
makes the same point about its count, and the point held.

### Why this must be `fkit-wiki` and nobody else

**No other role can do it.**
[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
makes vault reads decentralized and vault **writes exclusive to the `fkit-wiki` role**. That is the
whole reason this is filed rather than performed: the producer that archived Sprint 4, the producer
that opened Sprint 5, and the producer that wrote this brief are all structurally barred from fixing
it. None of them wrote anything under `ai-agents/wiki-vault/`.

## What to build

A vault re-sync that makes `ai-agents/wiki-vault/` describe board reality as of **2026-08-10**.

1. **Sprint 3 is not the active board** — it is closed and archived at
   `ai-agents/sprints/done/sprint-3.md`. Correct `index.md:65` and every other live claim to the
   contrary.
2. **Sprint 4 is closed and archived** at `ai-agents/sprints/done/sprint-4.md` — **8 done · 0
   cancelled · 0 moved · 0 open**, archived 2026-08-10 by owner ruling (verbatim **"Archive it now,
   unverified"**). ⚠️ **The vault must carry, not soften, the two honesty facts on that board's
   banner:** every one of the eight closes reads `(agent-closed — not owner-verified)` and **no human
   checked any of them**; and **the real-project stale-install test was NOT run** — the 2026-08-08
   gate was **lifted, not met**. A page that records Sprint 4 as simply "done" is a worse record than
   no page.
   **✅ AMENDED 2026-08-10 — a THIRD honesty fact was ruled after this brief was filed, and the vault
   must carry it too.** The two facts above are left **byte-identical** and both still hold. A second
   owner ruling of 2026-08-10 (verbatim option label **"0262 replaces it — record that
   (Recommended)"**) records that
   [`0262`](../../backlog/0262-run-the-real-project-stale-install-test-outside-this-repo/brief.md) **carries the
   2026-08-08 promise to personally verify `0245`/`0246` and discharges it on completion** — so the
   promise is being **met by a different route**, not abandoned. ⛔ **It does NOT make anything
   verified:** all eight closes keep `(agent-closed — not owner-verified)` **permanently**, and ⛔ **a
   vault page must not describe `0262` as verifying Sprint 4** or as scheduled — it is on the Backlog,
   unscheduled, and not a release gate. Sources: [`backlog.md`](../../../sprints/backlog.md)'s
   `## Notes`, [Sprint 5](../../../sprints/done/sprint-5.md)'s banner and open question 2, and
   [`done/sprint-4.md`](../../../sprints/done/sprint-4.md)'s banner.
3. **Sprint 5 is the active board** at `ai-agents/sprints/sprint-5.md` — ten rows, ranks restarting at
   `P1`, opened 2026-08-10 by owner ruling (verbatim **"Dashboard + all of 0252-0258"**), and it is
   **built on an unverified Sprint 4, knowingly**. Its two halves — the downstream dashboard defect
   (`0259`–`0261`) and the release-hygiene cluster (`0252`–`0258`) — should be legible from the page.
4. **Every dead `sprints/sprint-3.md` path is corrected or carries a dated correction** — *whichever
   the vault's own conventions prescribe.* **The wiki role owns that choice; this brief does not
   prescribe the form.** Sites 3 and 4 above differ in kind (a `Source:` pointer vs a historical
   outcome cell) and may warrant different treatment.
5. **`log.md` records the sync**, per the vault's own logging convention — and any correction to the
   two frozen 2026-08-07 lines is **a new dated entry, appended**. See the constraint below.
6. **Follow `0239`'s correction form**, so the vault does not grow a second convention for the same
   act. `0238` and `0258` are pointed at the same precedent.

### Constraints

- **⛔ `log.md` is APPEND-ONLY — owner ruling 2026-08-03, task `0211`. A correction is a NEW DATED
  ENTRY, never an in-place edit.** This is the one constraint in this brief with a named owner ruling
  behind it, and it admits no exception.
- **⛔ Do not edit anything outside `ai-agents/wiki-vault/`.** Not a board, not a brief, not a
  knowledge-base document. This task's diff is vault-only.
- **⛔ Do not move any task file** — the movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **⛔ Do not re-rank anything on any board**, and do not correct a board row. If the sync surfaces a
  board defect, **report it to the producer**; it is not fixed here.
- **⛔ Do not remove or soften any `(agent-closed — not owner-verified)` marker**, and do not describe
  Sprint 4 as verified. Sprint 4's banner forbids it in its own words: *"Do not 'clean up' those
  markers."*
- **⛔ No commit.**

## Verification steps

1. **Before:** report (a) the count of vault files asserting **Sprint 3 is the active board**, and
   (b) the count containing the literal dead path `ai-agents/sprints/sprint-3.md` — **4 across 4
   files at filing, 2026-08-10. Re-measure, do not quote.**
2. **After:** both counts are zero, **or** every remaining instance is inside a frozen entry that the
   vault's conventions correct by an appended dated note rather than an edit — **and each such
   instance is named individually in the close report.** "Handled by convention" without a list is not
   verification.
3. `grep -rl 'Sprint 4' ai-agents/wiki-vault/` and `grep -rl 'Sprint 5' ai-agents/wiki-vault/` each
   return **at least one file** — both returned **nothing** at filing (verified 2026-08-10).
4. The vault names `ai-agents/sprints/done/sprint-3.md`, `ai-agents/sprints/done/sprint-4.md` and
   `ai-agents/sprints/sprint-5.md` at their real paths, and **every re-pointed link resolves on the
   filesystem**.
5. The Sprint 4 record carries **both** honesty facts explicitly: all eight closes agent-closed and
   never owner-verified, and the stale-install test **not run** (gate lifted, not met). A reader who
   knows only the vault must not come away thinking Sprint 4 was verified.
   **✅ AMENDED 2026-08-10 — this step now requires a THIRD fact.** The sentence above is left
   **byte-identical** and still binding. The record must **also** carry that `0262` **discharges the
   `0245`/`0246` verification promise on completion** (owner ruling of 2026-08-10, verbatim option
   label **"0262 replaces it — record that (Recommended)"**), that the markers therefore stay on
   **permanently**, and that `0262` is **unscheduled and not a release gate**. ⛔ **A page that records
   the discharge without the "still not verified, still not run" halves fails this step** — as does one
   that records the two halves and omits the discharge.
6. The Sprint 5 record names its ten rows, its ranks-restart-at-`P1` rule, and that it is built on an
   unverified Sprint 4.
7. `log.md` carries the sync entry, **appended**, and any correction to the 2026-08-07 entry's
   `:1738` / `:1748` lines is a **new dated entry** with those two lines left **byte-identical**.
8. **`git diff --stat` touches `ai-agents/wiki-vault/` and nothing else.**
9. `/fkit-wiki-lint` is clean, or every finding it raises is listed with a disposition.

## Notes

- **Depends on:** nothing. The archival and the Sprint 5 open have already landed; every claim this
  corrects is false on today's tree.
- **Blocks:** nothing.
- **⚠️ Filed to the Backlog board, and here is the reason — stated because it was a judgement, not a
  ruling.** The owner's ruling of 2026-08-10 said *"New brief for this archival"* and **named no
  board**. Three things point at Backlog and nothing points at Sprint 5:
  1. **Sprint 5's scope is itself an owner ruling** — verbatim **"Dashboard + all of 0252-0258"**,
     ten named tasks. An eleventh row would be a spawned producer widening an owner-ruled scope
     unasked, which is the exact thing the ruling above praised the previous producer for **not**
     doing to `0238`.
  2. **A spawned producer has no owner channel and therefore never re-ranks** (`/fkit-task-brief`
     step 5). The only placement available to me on Sprint 5 is an **append at `P11`** — below
     `0258`, the row explicitly ranked last — which would misstate this task's merit rather than
     record it.
  3. **Nothing waits on it.** It does not gate the release, and no Sprint 5 row reads the vault.
  **On merit, if the owner does pull it in:** it belongs **directly below `0258`** — both are
  `fkit-wiki` vault work, both are batchable, and `0258`'s hard gate on `0252` makes it the natural
  neighbour. **⚠️ That is a merit statement, not a rank.** Pulling it in takes the producer's three
  mandatory edits.
- **Overlap with the six open wiki tasks — checked, and the answer is NO overlap.** Stated either
  way, as required:
  - **`0238`** — the **Sprint 2 → Sprint 3** rollover delta. **Adjacent, not overlapping**; see the
    dedicated section above for why neither subsumes the other. The one shared file is `log.md`, and
    both are appends.
  - **`0258`** — re-syncs `systems/install-and-self-update` after `0252` lands `RELEASING.md`.
    Different subject, different source, and hard-gated on `0252`. No overlap.
  - `0199` — re-syncs **ADR-010's** vault page after the `0143`/`0195` correction notes. No overlap.
  - `0206` — ingests the **faithful-carry decision report** as a new page. No overlap.
  - `0212` — appends a dated `log.md` entry correcting the `"still open"` framing on two frozen
    `0143` entries. **Shares `log.md`; both are appends at different entries about different facts.**
    Adjacent, not overlapping.
  - `0239` — the **ADR-012** vault-page re-sync. No overlap; this brief follows its correction form.
  **All seven are `fkit-wiki`-owned vault work and batch efficiently in one session** — a scheduling
  observation for the producer, not a dependency, and none gates another.
- **⚠️ An archived board is MOVED, not FROZEN.** Sprint 1's, Sprint 2's and Sprint 3's archived boards
  were each edited after archiving, and Sprint 4's banner says the same of itself. A vault claim that
  `sprints/done/` never changes would itself be false.
- **⚠️ This brief decays.** Every count and line number was measured **2026-08-10**. Re-measure at
  implementation time.
- **Line-number citations are dated anchors of convenience**; the durable anchors are the quoted text.
  [`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md) is the open task for
  the convention page.

  > ⚠️ **Dated correction 2026-09-03 (`0320`, inside sweep `0356`) — `0171` is no longer open.** It
  > closed **2026-08-22**; its `## Status` reads `✅ Done (agent-closed — not owner-verified)` and its
  > folder now sits in `ai-agents/tasks/done/`. **The sentence above is left byte-identical** as the
  > record of what was true when this brief was written. ⭐ **The link above still resolves correctly** —
  > citer and target both sit in `ai-agents/tasks/done/` now, so the relative href still lands and a
  > reader who follows it goes to the right place. ⛔ **Nothing here changes `0263`'s status, scope
  > or rank.**
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board; no sprint was named by the owner
  and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.
