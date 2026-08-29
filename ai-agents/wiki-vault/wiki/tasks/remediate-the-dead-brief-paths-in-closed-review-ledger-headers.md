# Remediate the dead brief paths in closed `review.md` ledger headers

**Source**: `ai-agents/tasks/done/0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P15` · ID 0168 · owner `fkit-coder` · two review rounds, 2026-08-26

## Goal

Every closed task's `review.md` opens with `Task: ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`. `/fkit-task-done` then `git mv`s the folder to `done/`, **and that path points at nothing.**

⛔ **This task deliberately does NOT decide the fix.** `0160` owns the class as its **Case 3**, and says in terms: ⭐ *"Repairing it means editing a frozen document — the thing the ledger rule exists to forbid… 'rewrite the paths' is explicitly not the presumed answer."* **This is the execution arm of that ruling and nothing more** — it carries the measurement `0160` did not have, and executes what `0160` landed.

### ⭐⭐ Its measurement corrected the figure it was filed on — twice

The brief was filed on **"39 of 60"**. ⭐ **39 is a real number measuring the wrong thing.**

- **39** = `review.md` files containing `tasks/backlog/` *anywhere*. Of those, 31 carry it **in the header**; the other **8** carry it only in finding rows citing *sibling* tasks that really were in `backlog/` at review time.
- ⛔ **Both errors are in the reported figure at once**: counting body citations as header defects inflates it, and counting only the `backlog/` form **misses 9 dead `done/`-form headers the report never mentioned.**

Re-derived firsthand by **the positive test — does the path exist on disk today** — over 124 `done/` folders, 60 with a `review.md`: **19 resolve · 40 dead · 1 has no header at all.**

**Three variants, not one:** 17 current-form `backlog/<NNNN>-<slug>/`, **14 pre-migration flat `backlog/<slug>.md`**, **9 pre-migration flat `done/<slug>.md`** (right board, dead path). ⚠️ **Variants 2 and 3 are not "re-point the path" cases even if repair is ruled** — the naming scheme is gone, so repair also means translating a pre-`0062` flat name to its `NNNN` folder.

### ⭐ A second axis nobody had measured: the FORM the header is written in

A dated correction inside the brief overturned its own flat claim that the header is *"a code span, not a markdown href"*:

| Header form | Count | Named path dead |
|---|---|---|
| Backtick code span | 30 | 26 |
| Bare path | 25 | 10 |
| **Markdown href** | **4** | 4 |

⭐⭐ **All 4 hrefs target the relative, location-free `./brief.md` — and all 4 resolve on disk.** ⛔ **Navigation does not break for those four**; what is stale is only the *link text*. **That is the prior art for writing a locator that never rots**, and it is why the sweep needed a fourth case.

## Key Changes

**Line 3 of 68 files** — 67 rewrites plus one insert. `git diff --numstat` = **67 × `1 1`, `0080` `1 0`, `0203` `3 3`**.

Owner rulings (verbatim labels): **D1 *"Dead-only, 67 (Recommended)"*** — live headers untouched; **D2 *"`Task: NNNN — [brief](./brief.md)` for all 67 (Recommended)"*** — ⭐ **the location-free form the 4 surviving hrefs proved**; **D3 *"Insert `Task: 0080 — [brief](./brief.md)`"*** for the one ledger with no header; **D4 *"Defer to `0326`"*** for the write-side schema.

⭐ **A dry-run diff was captured BEFORE the apply and `cmp`-verified identical to the applied diff.**

⛔ **Everything else froze** — `File(s) under review:` lines, body citations, verbatim quotes and trailers stayed byte-identical, per `0325`'s locator-vs-evidence rule.

## Outcome

Two rounds. `node --test test/*.test.js` → **774/774, 24 suites**. An independent dead-count at HEAD returned **67 with an identical ID set**.

⚠️ **Round 1: Codex could not run the suite (`mkdtemp` EPERM) — a reasoning-only second opinion under [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]]; ⛔ all execution evidence is the Claude reviewer's.** Codex returned *"No findings"*. ✅ **Round 2's Codex pass WAS a measured one — its own python re-counts ran inside the sandbox** — and it raised the round's only finding.

⭐ **All three findings are about the WORKLOG's own numbers, not about a single rewritten byte** — the work product was verified immobile between rounds.

- **R1 (low, PARTIALLY CORRECT):** a parenthetical implied 22 more instances sat outside the swept set. Re-measured: **24 corpus-wide, all 24 inside, zero outside.** ⭐ **The coder did not simply concede** — the plan's competing figure of 46 is *not* a mis-measure; it correctly counts a **broader class**, so the row now states both classes rather than declaring one wrong.
- **R2 (nit):** *"41 distinct"* is the **per-ledger-distinct SUM**; corpus-distinct is **37** (4 tokens appear in 2 ledgers each). ⭐ **The same label slip `0160` had already corrected in itself.**
- **R3 (nit, Codex):** ⭐ **the coder's reconstruction of the plan was stated as the plan's own intent.** The plan's *label* names the 24-class while its *number* matches only the 46-class — **label and number disagree**, and *"counted a broader class"* is the best-fitting reading but is **inferred, not recorded.** Now says so.

### ⚠️ Residuals — flagged, out of scope, all open

- **28 `done/` ledgers carry dead path tokens BELOW line 3** — 41 per-ledger-distinct, **37 distinct corpus-wide**. A superset of `0160`'s 16. Frozen, not swept.
- **Two sprint-keyed ledgers** under `ai-agents/sprints/reviews/` carry the same header shape and were **outside this brief's population** — for the producer.
- **`0248`'s `plan.md` and `0218`'s `worklog.md`** — filed as `0343`.
- ⛔ **`0168`'s own board cell still reads *"needs 0160, hard"*** — a frozen note, left for the closing producer.
- ⛔ **`0175`'s guard stays RED** on the 51 live path-form headers until `0326` lands.

## Related
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, whose Case 3 ruling this executes
- [[tasks/repair-the-moved-folders-own-self-locators-in-task-done]] — `0325`, which stops new instances being minted, and whose freeze rule this sweep obeyed
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, the convention behind the location-free form
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the coverage difference between the two rounds
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the migration that created variants 2 and 3
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[systems/knowledge-base-structure]] — *added 2026-08-29:* the record structure whose header locators this swept
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — *added 2026-08-29:* the board carrying its unfixed residuals (`0343`, and the below-line-3 class)
