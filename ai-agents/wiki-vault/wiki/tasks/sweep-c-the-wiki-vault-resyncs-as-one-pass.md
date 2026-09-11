# Sweep C — the wiki-vault resyncs as ONE pass, with `0317` and `0319` kept DISTINCT inside it

**Source**: `ai-agents/tasks/done/0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P10` · task `0358` · owner `fkit-wiki`

## Goal

⛔ **THIS ROW ABSORBS FIVE EXISTING ROWS — SIX SINCE 2026-08-29. IT DOES NOT SIT BESIDE THEM.**

⚠️ **This is the one Sprint 7 row that writes the vault, and the only one that may.** Sweeps A and B
are `fkit-coder`-owned and route everything they find in the vault here.
⛔ **[[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] is a wall, not a routing
preference.**

⛔ **The H1 and the folder name still say "FIVE" and are left byte-identical** — they are the record of
what the row was when filed. ⭐ **Read the member table as the membership, not the title.**

## Key Changes

⛔ **THE HARD GATE:** `0354`'s and `0176`'s guards both green before the pass began.

### The six members

⭐ **Six, not five, since the ruling of 2026-08-29** — `0212` joined from Sweep B by owner ruling.
⚠️ **`0212` differs in kind from the other five, and that is why it is named separately rather than
folded in:** its site is `log.md` itself, not an ordinary vault page.

| ID | What it asked for | Outcome |
|---|---|---|
| `0199` | resync ADR-010's page — its *"still open"* and *"one-line note"* claims are both false | ⭐ **complete — the PAGE half only** |
| `0212` | append a dated `log.md` entry correcting the *"still open"* framing on two frozen 2026-07-26 entries | ⭐ complete, as its own log entry |
| `0239` | resync ADR-012's page after `0232` corrected the ADR's coordinates | ⭐ complete |
| `0287` | resync the Codex sandbox `read-only` pages after `0273` | ⛔ **EXCLUDED — blocked upstream; still open** |
| `0317` | reconcile the vault's `partial — not ready to close` flag on `0238` with its landed close | ⭐ complete |
| `0319` | discharge the vault's `partial — not ready to close` flag on `0206` — a **stale** flag, not a contested close | ⭐ complete |

⛔ **`0317` AND `0319` STAY DISTINCT INSIDE THIS PASS — AN OWNER RULING, NOT AN OPTIMIZATION.**
⛔ **Merging them into one "clear both flags" step performs the wrong act on at least one of them:**
`0317` **reconciles** a flag against a close that landed, `0319` **discharges** a flag that was merely
stale.

⛔ **`0212` must not absorb `0199`.** `0212` is `log.md` **only**; `0199` keeps the ordinary-vault-page
half.

⛔ **`log.md` is APPEND-ONLY on a standing owner ruling of 2026-08-03.** A wiki run may never edit or
delete a past entry. ⛔ **Anchor by page-count roll-up, never by line number** — there are **two**
2026-07-26 `ingest (sync)` entries.

### ⛔ `0287` is excluded by a BLOCKED UPSTREAM — not by oversight

Upstream `0273` re-measured during the pass: **still `🔲 Backlog`**, substance unshipped — **six
`--sandbox read-only` call sites under `claude/`, zero `workspace-write`.** ⭐ **Five-of-six is the
CORRECT outcome of this pass, not a partial failure** — the brief prescribes **reporting**, not
closing, a member whose upstream has not landed. **The measurement was taken once, at the start, and
not re-taken to reach a closable answer.**

⚠️ *Corrected 2026-09-06 by a later `log.md` append, on owner ruling* ***"One more fkit-wiki append
(Rec)"***: the pass's own sentence *"`0287`'s vault pages were left ALONE"* is **overbroad**. Three
pages carrying `0287`'s subject **were** touched by the same pass. ⭐ **The true, load-bearing statement
is: `0287`'s SANDBOX CLAIMS were left alone.** ⛔ `0287`'s verdict does not move — it stays **open**.

### The two ADRs it created

⭐ **Both had `Status: accepted` and no vault page at all** — the defect class this sweep closed:
[[decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task]] and
[[decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags]].

⭐ **Working-tree bytes were ingested and the `git hash-object` of exactly what was read was recorded**
(owner ruling *"Working-tree bytes + record the hash (Rec)"*) — a committed-only read would have
excluded ADR-046 entirely, since it was untracked at the time. ⚠️ **Accepted cost, stated: if that
in-flight work were amended or reverted, the page would describe a revision that never landed. The hash
makes that detectable; it does not prevent it.** ✅ *Resolved 2026-09-10 — ADR-046 was committed in
`5ed0b91` with the identical blob.*

**Nine pages gained dated resync notes** — `adr-003`, `adr-010`, `adr-012`, `adr-020`, `adr-032`,
`adr-037`, `adr-038`, `adr-041`, `adr-042`.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`.

⚠️ **THE VAULT'S OWN LAST WORD ON THIS ROW WAS `Task 0358: partial — not ready to close`** — written
twice, in the 2026-09-05 correction entry and again in the 2026-09-06 one. ⛔ **It was closed anyway.**
This page records both facts and resolves neither; ⛔ **reconciling a standing wiki flag against a
landed close is exactly the shape `0317` exists for**, and no such reconciliation is recorded here.

> ⭐ **RESOLVED 2026-09-10 — THE FLAG IS WITHDRAWN AND THE CONTRADICTION IS CLOSED. The block directly
> above is left byte-identical as the record of the tension it found.**
>
> **On owner ruling of 2026-09-10, option label verbatim *"Investigate — is the gap real? (Rec)"***, the
> deliverable was re-measured member by member against the vault's own bytes. ⭐ **VERDICT:
> `0358`'s vault deliverable is FINISHED; the close was not premature.** The full reasoning and the
> per-member evidence are in `log.md` § *"2026-09-10 — withdrawal (task `0358`) — the standing
> `partial — not ready to close` flag, discharged"*.
>
> ⭐ **What finished it, and when: the 2026-09-06 `log.md` append that corrected the overbroad
> *"`0287`'s vault pages were left ALONE"* sentence.** The first flag (2026-09-05) was **correct when
> written** — that correction was then claimed by two records and absent from the work product. The
> second flag (2026-09-06) rode the very append that closed the hole, so it was **spent as it was
> written**. ⛔ **Neither flag named an outstanding item, which is why it could only be settled by
> re-measuring the brief.**
>
> ⛔ **Five-of-six stands, and `0287` stays genuinely owed** — re-measured 2026-09-10: `0273` and `0287`
> both `🔲 Backlog`, **6** `--sandbox read-only` and **0** `--sandbox workspace-write` under `claude/`.
>
> ⚠️ **NOT resolved by that ruling, and outside the wiki role's write surface:** `0358`'s `review.md`
> still reads `Status: in-review` with **R1** and **R5** marked `blocked`, though the worklog records
> both discharged on 2026-09-06. **A record-hygiene gap in the task folder, not a vault gap.**

### ⛔ THE BOUND — 45 uningested closed tasks were DELIBERATELY left out

⛔ **Bounded out by owner ruling of 2026-09-05, option label verbatim "Bound out + filing request
(Rec)".** Measured that run: **61** closed-task folders touched since the `16754e3` watermark; **45**
with no vault task page. (⚠️ Sweep C's reviewer independently counted **64 / 48** — a difference in the
safe direction. ⚠️ **Slug matching is a floor, not a census.**)

The reasons, as ruled: 45 is **7.5×** the row's member count, and ⛔ **a task ingest is a DIFFERENT ACT
from a resync** — a resync reconciles a page with a changed truth; a task ingest creates new
synthesized knowledge and needs its source read in full.

⚠️⚠️ **THE WATERMARK WAS ADVANCED ANYWAY — `16754e3` → `cf289c2` — AND THAT IS THE HAZARD.** The next
sync sees a **clean watermark**. ⛔ **It must not conclude the closed-task backlog was ingested. It was
not.** ⭐ **The bound was written into `log.md` itself, in two entries, precisely because a future sync
run reads `log.md` and has no reason to read a task's worklog.** The follow-up is task **`0380`**, filed onto the Backlog board and **still open** —
`ai-agents/tasks/backlog/0380-delta-ingest-the-closed-task-backlog-bounded-out-of-sweep-c/brief.md`.
⚠️ **It has no wiki page: an open backlog row is not ingested.**

- **Depends on:** `0354`, `0176`, `0237` — ⛔ all hard, as the gate.
- **Blocks:** nothing.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] · [[tasks/sweep-b-the-single-site-correction-notes]]
  — the other two sweeps; ⛔ **three sweeps, disjoint membership**
- Task `0380` — this row's bounded-out remainder, open on the Backlog board (no page; open rows are not
  ingested)
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why this row is `fkit-wiki`'s and
  nobody else's
- [[decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task]] ·
  [[decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags]] — the two
  pages it created
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — `0287`'s blocked
  subject
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — why a vault flag, not
  `log.md`, is the completion signal
- [[tasks/append-a-dated-correction-note-to-adr-010]] — the ADR-010 correction chain `0199` resynced
- *Added 2026-09-10 (sync `cf289c2`→`b4a1a52`):* [[tasks/adr-the-narrow-in-flight-review-fix-lane]] — task `0352`, which produced ADR-045 · [[tasks/build-the-coordination-citation-policy-guard]] — task `0176`, the coordination-citation policy guard · [[tasks/build-the-link-resolution-guard]] — task `0354`, the link-resolution guard
