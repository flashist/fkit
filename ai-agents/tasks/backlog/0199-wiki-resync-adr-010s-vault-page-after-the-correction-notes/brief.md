# Wiki resync of ADR-010's vault page — its "still open" and "one-line note" claims are both now false

## ID
0199

## Sprint
Sprint 2

## Priority
177

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

### What changed under the vault

Task [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md) landed on 2026-08-02:
**three dated note blocks plus one header metadata bullet** appended to
`ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md`. Two blocks at
§Context (a ⚠️ drift correction and a ⛔ reversal notice), one ⛔ notice at §Decision 3, and a
`- **Corrections:**` header bullet carrying the ⚠️/⛔ legend.

`0143`'s brief drew the boundary explicitly:

> *"**Not a wiki task.** … The wiki's own copy (`ai-agents/wiki-vault/wiki/decisions/`) is a separate
> surface and belongs to the wiki role; if a resync is needed it is a follow-up, not part of this
> brief."*

**This is that follow-up**, and the resync is needed: the vault page now makes two claims that are
false.

### The two false claims — read 2026-08-02, re-verify before acting

`ai-agents/wiki-vault/wiki/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` says of the
menu/label staleness:

> *"The sanctioned fix is a **dated one-line correction note appended** to the ADR — an architect call,
> owner-flagged and **still open**."*

- **"still open" is false.** It shipped on 2026-08-02.
- **"one-line" is false, and was a prediction rather than a record.** What landed is **three note blocks
  plus a header bullet**, `+71 / −0`.

**The same "still open" framing appears elsewhere in the vault** and is part of this task's sweep, not a
separate one — at minimum `ai-agents/wiki-vault/index.md` (the `0140` entry: *"a dated correction note
is the sanctioned fix, and it is still open"*) and two `log.md` entries that name `0143`'s form as the
sanctioned-but-unshipped fix. **Sweep for the claim, not for the line numbers cited here** — treat these
coordinates as a starting point that may have moved.

### What must NOT be lost in the update

The vault page's substantive corrections about ADR-010 are **still right** and their value is that the
vault says them where a reader lands. The staleness they describe is real; only the *"the fix is still
open"* framing expired. **Update the status of the fix, not the facts.**

⚠️ **This task must also not silently import `0143`'s open residuals as settled.** `0143` shipped a
**knowing self-contradiction**: ADR-010's new header bullet names `claude/skills-for-role.sh` as
`skills_for_role()`'s home while **§Decision 5, out of `0143`'s scope, still names
`claude/fkit-claude.sh`**. Task `0195` repairs it. If the vault page describes ADR-010's current state,
that contradiction is part of the current state and belongs on the page as a ⚠️ gotcha with `0195`
named — **not** smoothed over.

## What to build

**A `fkit-wiki` ingest/resync pass** over ADR-010's vault page and the vault-wide *"still open"*
framing, run through the wiki role's own procedures (`/fkit-wiki-ingest`, or `/fkit-wiki-sync` if the
delta picks it up).

The updated page must:

1. **Record that the correction notes shipped**, with the date (2026-08-02) and the task (`0143`).
2. **Replace *"one-line"* with what actually landed** — three note blocks plus a header metadata bullet.
3. **Carry the form**, because the vault is where the next reader looks it up: the ⚠️/⛔ two-marker
   legend with both glosses, the *"left byte-identical"* clause, and — flagged, because it departs from
   the vault's own convention — that these notes sit **below** the claim they correct, **with the
   recorded rationale** (`0143` residual `R1-placement`).
4. **Record the live self-contradiction** at §Decision 5 as a ⚠️ gotcha, naming `0195` as its repair.
5. **Clear the vault-wide *"still open"* framing** wherever it refers to `0143`'s fix — `index.md` and
   the `log.md` entries included.
6. **State that ADR-010's `**Status:**` remains `accepted`** — the notes did not supersede it.

### Constraints

- ⛔ **`ai-agents/wiki-vault/` writes are `fkit-wiki`'s exclusively** (ADR-005). No other role runs this.
- ⛔ **Do not edit `ai-agents/knowledge-base/`.** The knowledge-base copy is not the wiki role's, and
  ADR-010's remaining knowledge-base-side corrections are tasks `0195`, `0196` and `0197`. If this run
  finds a knowledge-base-side defect, **flag and route it — do not fix it** (the precedent is `0141` and
  `0148`, both of which routed exactly this way).
- ⛔ **Do not restate `0143`'s notes verbatim into the vault.** The vault synthesizes; it is not a second
  copy of the ADR.
- ⛔ **Do not mark ADR-010 superseded or deprecated on the vault page.**
- ⚠️ **Ordering matters for accuracy, not for blocking.** If `0195` / `0196` / `0197` land before this
  runs, the page must describe **that** state, not this brief's 2026-08-02 snapshot. Re-read ADR-010
  before writing.

## Verification steps

1. `grep -rn "still open" ai-agents/wiki-vault/` returns **no hit that refers to `0143`'s correction
   note** — other unrelated "still open" flags are untouched and must remain.
2. `grep -rn "one-line correction note" ai-agents/wiki-vault/` returns nothing.
3. The ADR-010 vault page names task `0143`, the date 2026-08-02, and the shipped shape (three note
   blocks plus a header bullet).
4. The page carries the ⚠️/⛔ legend with both glosses, and the below-the-claim placement rule **with its
   rationale**.
5. The page carries a ⚠️ gotcha for the §Decision 5 contradiction naming `0195` — or, if `0195` has
   landed by then, records it as resolved instead. State which case applies.
6. The page's pre-existing substantive corrections about ADR-010's stale facts are still present.
7. The page does not assert ADR-010 is superseded or deprecated.
8. **No file under `ai-agents/knowledge-base/` or `ai-agents/tasks/` is modified.** Verify by
   `git status`, not by intention.
9. The wiki run's own completion flag is emitted per the wiki skills' convention, carrying this task's
   folder ID and brief path.

## Notes

- **Depends on:** nothing. `0143` is closed and the vault claims are false today.
- **Blocks:** nothing.
- **⛔ SERIALIZATION — THIS TASK RUNS LAST. Recorded 2026-08-02 at `0195`'s close.** Order:
  **`0195` (✅ landed 2026-08-02, `+53 / −0`) → `0196` → `0197` → `0171` → `0199` (this task).** Run it
  earlier and the vault page describes an ADR still being appended to, which is the exact defect this
  row exists to clear. **It is an ordering constraint on file writes, not a `Depends on:`** — the
  `## Priority` ranks are append ranks and do not encode it (ADR-035).
- **⚠️ What `0195` actually shipped, so this page is resynced against reality and not against this
  brief's older assumptions** — re-verify at run time, do not inherit:
  - **ADR-010 now carries FIVE dated correction blocks**, not three. `0143` shipped three
    (§Context ⚠️, §Context ⛔ reversal, §Decision 3 ⛔ reversal); `0195` added two ⚠️ blocks on
    2026-08-02 — one below **§Decision 5**, one below §Context's *"One real inconsistency"* passage.
  - **The header `- **Corrections:**` item now carries TWO site lists.** The owner declined editing the
    existing line (OQ-1, 2026-08-02) and ruled a **continuation line** instead, so the item reads: an
    original line naming §Context + §Decision 3, then a continuation line naming §Decision 5 + §Context's
    *"One real inconsistency"* passage and stating that the first line's list is superseded. **A resync
    that reads only the first line will under-report the annotated sites** — read the whole item.
  - **⚠️ This brief's §Context still says the §Decision 5 contradiction is live and that `0195` "repairs
    it".** `0195` has landed: the contradiction is **gone**. Item 4 of *What to build* — *"record the live
    self-contradiction at §Decision 5 as a ⚠️ gotcha, naming `0195` as its repair"* — is therefore
    **stale as written**. Record it as **history** (*"contradicted itself 2026-07-11 → 2026-08-02;
    repaired by `0195`"*), not as a live gotcha. Left in place rather than rewritten because the vault
    page is `fkit-wiki`'s to author; this note is the correction.
  - `0195` shipped three accepted residuals — `R-third-site-remains`, `R-header-two-site-lists`,
    `R-size-overrun` — in `ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/review.md`.
    `R-header-two-site-lists` is the second bullet above.
- **Owner is `fkit-wiki` and cannot be anyone else** — ADR-005 makes the vault the wiki role's exclusive
  write surface. A producer, architect or coder finding this page wrong routes it here; it does not fix
  it.
- **Why this is a board row rather than routine sync work.** `/fkit-wiki-sync` is delta-driven and will
  see ADR-010 change, but a delta ingest updates the page *from the ADR* — it would not on its own know
  to clear the *"still open"* framing in `index.md` and `log.md`, nor to record the `0195`
  contradiction. Those are judgement calls with a named verification, which is what earns a row.
  *(Contrast the ADR-037 wiki ingest, deliberately left unfiled on 2026-08-02 as genuinely routine.)*
- **⚠️ Priority 177 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0197`**, at the end of the ADR-010 run, because every earlier
  row changes the state this page must describe and running it first guarantees a second resync. Filed
  by a spawned producer with no owner channel, which never re-ranks (ADR-035, `/fkit-task-brief`
  step 5). No existing row was renumbered.
- No commit — leave the edits in the working tree.
