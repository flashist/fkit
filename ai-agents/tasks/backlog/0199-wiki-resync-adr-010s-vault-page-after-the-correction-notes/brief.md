# Wiki resync of ADR-010's vault page — its "still open" and "one-line note" claims are both now false

## ID
0199

## Sprint
Backlog

## Priority
Unscheduled

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
   ⚠️ **PARTLY OVERTAKEN BY THE OWNER'S 2026-08-03 APPEND-ONLY RULING — read the ruling block in
   *Constraints* below before performing this item.** The `index.md` half stands unchanged. **The
   `log.md` half is no longer this task's at all**: those entries are frozen and must stay
   byte-identical, and the owner ruled on 2026-08-03 that the correcting append is **its own row —
   task `0212`**, not folded into this task and not folded into `0211`. **Perform the ordinary-vault-
   page half only.**
6. **State that ADR-010's `**Status:**` remains `accepted`** — the notes did not supersede it.

### Constraints

#### ✅ OWNER RULING 2026-08-03 — `log.md` is append-only. This unblocks the task and reshapes item 5.

**This settles the standing flag that blocked this task.** The 2026-08-03 wiki **sync** raised it
against this brief's *"clear the `still open` framing from `log.md`"* instruction and did not resolve
it; the 2026-08-03 wiki **lint** hit it and did not resolve it either. It is now ruled:

> **A wiki run may NEVER edit or annotate a past `log.md` entry in place.** A correction lands as a
> **new dated entry** that names what it corrects by **folder ID and durable anchor**. The original
> entries stay **byte-identical**.
>
> **Rationale as ruled:** it matches the append-only guarantee in `log.md`'s own header and in
> `schema.md`, and it matches the form the knowledge-base correction-note already uses.
>
> **Provenance:** given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session on
> **2026-08-03**, and relayed here by a spawned producer with no owner channel. **Ruled once, for both
> tasks** — the identical ruling is recorded in `0211`'s brief.

**Where the flag actually points, corrected — the sync mislabelled it.** The sync's flag calls this
*"`0199`'s verification step 5"*. On disk, the instruction it means is **item 5 of *What to build***
(clear the `"still open"` framing, `log.md` included) and its check is **verification step 1**.
*Verification step 5* is a different thing entirely — the §Decision 5 gotcha. **Read the ruling against
items 5/1, not against verification step 5.**

**What the ruling settles, precisely:**

- **The `index.md` half of item 5 is untouched and still required.** `index.md` is an ordinary vault
  page, not an append-only log. Its `0140` entry (*"a dated correction note is the sanctioned fix, and
  it is still open"*) is edited in place as before.
- **The `log.md` half of item 5 is unperformable as written, and is NOT this task's any more — it is
  task `0212`** (Backlog board, rank `—`, owner `fkit-wiki`), filed 2026-08-03 on the owner's ruling.
  Those entries stay byte-identical. At
  least two of them carry the `0143` framing and **will still carry it after this task ships** — the
  ADR-010 stale-text item (*"the sanctioned fix is a dated correction note, an architect call, still
  open"*) and the ADR-029 §Decision 6 item (*"the sanctioned fix is task `0143`'s
  dated-correction-note form, still open"*).
- **Verification step 1 was therefore unsatisfiable as written** — it required `grep -rn "still open"`
  to return *no hit that refers to `0143`'s correction note*, and those two `log.md` hits must survive.
  **✅ Settled 2026-08-03: step 1 now carves out `log.md`** and asserts the clear against ordinary vault
  pages only. **⛔ Never satisfy it by editing the frozen entries.** The `log.md` correction is task
  `0212`, not this one.
- **Verification step 2 is NOT affected — it still stands as written.** Checked on disk 2026-08-03:
  the only `"one-line correction note"` hit in the vault is in
  `ai-agents/wiki-vault/wiki/tasks/retire-team-room-in-docs-and-agent-definitions.md`, an ordinary
  vault page. Nothing in `log.md` carries that phrase.

**✅ BOTH OPEN QUESTIONS RULED BY THE OWNER — 2026-08-03.** They were raised above as (a) and (b) and
are no longer open. Both were given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver
session on **2026-08-03** and relayed here by a spawned producer with no owner channel.

- **(a) What verification step 1 asserts now: `log.md` is carved out.** Step 1 asserts the clear
  against **ordinary vault pages only**; `ai-agents/wiki-vault/log.md` is excluded, by the append-only
  ruling. The step is rewritten accordingly in *Verification steps*, with its provenance and a
  satisfiability check recorded there. **Verified on disk 2026-08-03 that the carve-out actually makes
  the step true** — both remaining non-`log.md` hits are ordinary pages this task already owns.
- **(b) The `log.md` correction gets its OWN row — task `0212`.** It is **not** folded into this task,
  and **not** folded into `0211`. `0211` appends a new dated `log.md` entry for a **different defect
  class** (old-form completion-flag paths, not the `"still open"` framing), and the owner ruled that
  each log entry should be about one thing. **This task therefore does not append anything to
  `log.md`** beyond whatever its own run report normally records.

**✅ ALSO RULED 2026-08-03 — verification step 9 carried the pre-`0173` flag form and is corrected.**
Step 9 required the wiki run's completion flag to carry this task's folder ID **and brief path**. Task
`0173` closed 2026-08-03 and changed the emitted flag to a **folder ID only, with no path**, plus a
prohibition on `:NNN` coordinates, in all three `claude/skills/fkit-wiki-*/SKILL.md`. Performing step 9
as written would have emitted a **fourth** old-form flag into the very `log.md` that `0211` exists to
annotate. **Owner ruling: correct step 9 to the shipped folder-ID-only form — one line, scope not
widened.** The owner **declined** a broader sweep of every open brief for stale flag-form assertions;
**do not perform that sweep as part of this task.**

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

1. ✅ **RULED 2026-08-03 — the assertion covers ordinary vault pages only; `log.md` is carved out.**
   `grep -rn "still open" ai-agents/wiki-vault/ --exclude=log.md` returns **no hit that refers to
   `0143`'s correction note** — other unrelated `"still open"` flags are untouched and must remain.
   **`ai-agents/wiki-vault/log.md` is excluded from this step**, by the append-only ruling: at least
   two frozen entries carry the framing (the ADR-010 stale-text item and the ADR-029 §Decision 6 item)
   and must stay byte-identical. **Their survival is the expected result, not a failure.**
   - ⛔ **The `log.md` correction is NOT dropped — it is now task `0212`**, filed on the Backlog board
     at rank `—`. See *Notes*.
   - **Why this step changed:** it originally asserted the clear across the **whole vault, `log.md`
     included**, and a prior spawn marked it `⚠️ UNSATISFIABLE AS WRITTEN` on 2026-08-03 because the
     append-only ruling freezes those two entries. The carve-out is the smallest change that makes the
     step true while keeping its original intent — clear the stale framing wherever it can be cleared.
     **Owner-ruled** 2026-08-03, live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver
     session, relayed by a spawned producer with no owner channel.
   - **Verified satisfiable, on disk 2026-08-03.** Outside `log.md` exactly two hits refer to `0143`'s
     correction note, and both are ordinary vault pages this task already owns: `index.md`'s `0140`
     entry (*"a dated correction note is the sanctioned fix, and it is still open"*) and the ADR-010
     vault page's own ⚠️ *"this page is NOT the full resync"* block (which names *"clearing the
     vault-wide `still open` framing elsewhere"* as `0199`'s outstanding work — it is rewritten when
     this task completes the resync). Every other non-`log.md` hit is a genuinely unrelated open item
     (ADR-003's CI gap, `0186`, `0118`/`0119`, `prove-red`'s R2 no-op mode, the `architecture.md`
     flag) and **must remain**.
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
9. The wiki run's own completion flag is emitted per the wiki skills' convention **as tightened by
   `0173` (closed 2026-08-03)**: it carries this task's **folder ID only** — `0199` — in one of the two
   exact forms the skills prescribe (`Task 0199's vault work is complete — ready to close` or
   `Task 0199: partial — not ready to close`), with **no brief path** and **no `:NNN` line-number
   coordinate**. Resolving `0199` to its task folder is the **caller's** lookup, not the flag's.
   **Corrected 2026-08-03 by owner ruling.** This step previously required `this task's folder ID
   **and brief path**` — the **pre-`0173` old form**. Performing it as written would have emitted a
   fourth old-form flag into the very `log.md` that task `0211` exists to annotate. One-line
   correction, scope deliberately not widened; see the ruling note in *Constraints*.

## Notes

- **Depends on:** nothing. `0143` is closed and the vault claims are false today.
- **Blocks:** nothing.
- **⛔ THE `log.md` HALF IS NOW A SEPARATE ROW — task `0212`, filed 2026-08-03 on owner ruling.**
  `0212` (Backlog board, rank `—`, owner `fkit-wiki`) appends the new dated `log.md` entry correcting
  the `"still open"` framing on the two frozen entries, naming them by folder ID and durable anchor,
  originals byte-identical. **This task does not inherit it.** `0199` keeps the ordinary-vault-page
  half (`index.md`'s `0140` entry and the ADR-010 vault page); `0212` keeps `log.md`. **Neither blocks
  the other and either order works** — so this is a scope split, not a `Depends on:`. `0212` is also
  deliberately **not** merged into `0211`: `0211` owns the old-form completion-flag paths, `0212` owns
  the `"still open"` framing — two defect classes, two entries, because the owner ruled each log entry
  should be about one thing.
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
