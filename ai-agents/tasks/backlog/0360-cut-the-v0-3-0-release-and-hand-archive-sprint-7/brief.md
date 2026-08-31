# Cut the v0.3.0 release with an annotated tag as the measurement anchor, then hand-archive Sprint 7 — carrying the not-owner-verified caveat

## ID
0360

## Sprint
Sprint 7

## Priority
P12

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

### The two owner rulings this task executes

Both given **2026-08-29**, live via `AskUserQuestion` in a `fkit lead` session. Option labels are the
verbatim text.

1. **Release: "Minor — v0.3.0 (Rec)".** Verified 2026-08-29: `package.json` reads **`0.2.2`** and the
   newest tag is **`v0.2.2`**, so a minor bump lands on **`v0.3.0`**. ⛔ **Re-derive both at run time**
   — Sprint 7 may cut a patch in flight
   ([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
2. **Sprint 7's archival: "Hand-archive again, with the caveat (Rec)."** Manual, and the archived board
   carries the **agent-performed / not-owner-verified** caveat. ⛔ **[`0341`](../0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled/brief.md)
   — which would build `/fkit-sprint-done` and `/fkit-sprint-cancelled` — stays `Unscheduled` by that
   same ruling.** It is deliberately not on this board; ⛔ do not pull it in to "do this properly".

### Why the tag is a measurement anchor, not just a version

[`0359`](../0359-the-throughput-counter-created-vs-closed-per-iso-week-and-record-repair-share/brief.md)
counts created-vs-closed per ISO week from git history. **An annotated tag is a durable, dated point
in that history** that a later measurement can anchor to — *"since v0.3.0"* is checkable in a way that
*"since Sprint 7"* is not. ⭐ **Annotated, not lightweight**: a lightweight tag carries no date or
message of its own and cannot serve as the anchor.

## What to build

**Two acts, strictly in this order.**

### 1. Cut the release

- Run **`npm run release:minor`** (`node bin/release.mjs --minor`). ⚠️ **Read `bin/release.mjs` before
  running it** and state what it does — whether it bumps, tags, commits, or pushes — ⛔ **and stop
  before anything that pushes.** `npm run release:dry` exists; use it first and report its output.
- Land on **v0.3.0** (re-derived, per above).
- **The tag is annotated**, and its message names Sprint 7 and the measurement-anchor purpose.
- ⛔ **THE COMMIT AND THE PUSH ARE THE OWNER'S.** The universal rule — *never commit or push unless the
  owner explicitly asks* — is not suspended by a release ruling. **If `bin/release.mjs` commits or tags
  as part of its normal operation, that is the tool doing what the owner's ruling authorized; a
  `git push` is not, and is never run by this task.** State plainly in the close report what is
  committed, what is tagged, and what is left for the owner.

### 2. Hand-archive Sprint 7

**Only after every other Sprint 7 row is closed.** The mechanics, following the Sprint 6 precedent:

- Move `ai-agents/sprints/sprint-7.md` → `ai-agents/sprints/done/sprint-7.md`.
- ⛔ **Fix every relative href in the moved file — the file went down one level.** `../tasks/…` becomes
  `../../tasks/…`; `../knowledge-base/…` becomes `../../knowledge-base/…`; `backlog.md` becomes
  `../backlog.md`. **A move that leaves the hrefs alone manufactures a fresh broken-link set — in the
  same sprint that built the guard against them.**
- ⛔ **Update every `➡️ Moved to [Sprint 7](sprint-7.md) — priority P<n>` marker on
  [`backlog.md`](../../../sprints/backlog.md) to point at `done/sprint-7.md`.** Sprint 6's rows read
  `➡️ Moved to [Sprint 6](done/sprint-6.md) — priority P10` — that is the target form.
- **Write the archival banner**, carrying, in full:
  - the **`(agent-closed — not owner-verified)`** standing of the closes the sweeps performed
    ([ADR-033 §5](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md));
  - ⛔ **the caveat the owner's ruling requires: the archival itself is agent-performed and NOT
    owner-verified**, in the same shape Sprint 6's banner carries;
  - the **success-criterion outcome**: record-repair rows as a share of open work, measured with
    `0359`'s script, against the **33% (42 of 129)** baseline of 2026-08-29 and the **under 10%**
    target. ⛔ **Report the real number.** If the target was missed, the banner says so — an archived
    board that reports a target as met without the measurement is the exact failure
    `evidence-before-assertion` exists against.
- ⛔ **Leave Sprint 6's banner byte-identical.** Sprint 7's board already records that it was left
  unamended; archiving Sprint 7 does not change that.
- **Decide and state whether Sprint 7's banner gains a successor clause.** Sprints 1–4 named a
  successor; Sprints 5 and 6 did not. ⚠️ It is Sprint 7's own §"Open questions" item 3 in the other
  direction. ⛔ **No successor board exists unless the owner opens one** — so if no Sprint 8 exists,
  the clause is omitted and the omission is stated.

⛔ **Constraints:**

- **⛔ NEVER `git push`.** Not once, not with `--tags`.
- **⛔ Do not archive while any Sprint 7 row is open.** Check the board first; an archived board with
  an open row is a lie the dashboard will repeat.
- **⛔ Do not write `ai-agents/wiki-vault/`** (ADR-005). A vault resync after the archival is
  `fkit-wiki`'s and is filed separately if wanted.
- **⛔ Do not pull `0341` onto this board** — `Unscheduled` by the same ruling that ordered the
  hand-archive.
- **⛔ Do not re-rank or renumber any Sprint 7 row.** Closed rows are frozen history
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- **⛔ No secrets** in the tag message, the banner, or any artifact.

## Verification steps

1. `npm run release:dry` output is reported **before** the real run.
2. `node -p "require('./package.json').version"` returns **`0.3.0`** (or the correctly re-derived minor).
3. `git tag -l --format='%(objecttype) %(refname:short)'` shows the new tag and that it is a **`tag`**
   object, not a `commit` — that is what proves it is annotated. `git tag -n99 v0.3.0` shows the
   message naming Sprint 7 and the anchor purpose.
4. **`git log origin/main..HEAD` shows the release commits are LOCAL — nothing was pushed.** Show it.
5. **Before archiving:** `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-7.md`
   shows **zero** rows in `🔲 Backlog`, `🔄 In progress` or `🚧 Blocked`. Paste it.
6. After the move: `ai-agents/sprints/done/sprint-7.md` exists, `ai-agents/sprints/sprint-7.md` does
   not, and **every relative href in the moved file resolves.** ⭐ **Run `0354`'s
   `test/reference-integrity.test.js`** — it is the guard this sprint built, and this is the first act
   that would have broken it. ⛔ Green, or the archive is not done.
7. Every `Sprint 7` marker on `backlog.md` points at `done/sprint-7.md`. Grep for
   `Moved to [Sprint 7](sprint-7.md)` — **zero** hits remain.
8. `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` — report exactly what
   it returns and its exit code. ⚠️ With no Sprint 8, `active none` / exit 3 is the **expected** state,
   the same gap Sprint 7 itself opened against. ⛔ **Do not open a Sprint 8 to make it non-empty** — a
   board arrives only by an owner ruling that names it.
9. The archival banner contains: the agent-closed marker standing, the **not-owner-verified archival
   caveat**, and the **measured** success-criterion outcome with its number and date. Grep for all three.
10. `git diff --stat` shows zero files modified under `ai-agents/wiki-vault/`.
11. `npm test` passes. Report the counts.

## Notes

- **Depends on:** every other **open** Sprint 7 row — `0347`, `0352`, `0353`, `0354`, `0237`, `0176`,
  `0356`, `0357`, `0358`, `0359`, `0361`. ⛔ **Hard: this row archives the board, so it runs last.**
  - ⛔ **`0355` REMOVED 2026-08-30 — it was CANCELLED and is no longer a row this one waits on.**
    Owner ruling 2026-08-30, live `AskUserQuestion`, option label verbatim **"Cancel it (Rec)"**;
    executed by a spawned `fkit-producer`, so the board marker carries
    `(agent-closed — not owner-verified)` (ADR-033 §5). ⚠️ **Corrected in the field rather than
    annotated below, for the same reason the `0361` correction was: this is a machine-parsed field**
    — `dashboard.sh` derives the board's `Next step` from it, and a dependency on a closed row is a
    stale value. ⛔ **The word *"open"* was added to the lead phrase in the same act**, because
    *"every other Sprint 7 row"* is no longer the same set as the rows this one waits on — the board
    still holds thirteen rows, two of them closed. ⛔ **No other name in the list changed**, and
    ⛔ **rank `P5` was NOT reassigned** (ADR-035) — the board carries a deliberate gap there. The full
    record lives in [`sprint-7.md`](../../../sprints/sprint-7.md) §"⛔ Addendum — `P5` (`0355`)
    CANCELLED".
    - ⚠️ **This does NOT relax step 2's constraint.** *"Do not archive while any Sprint 7 row is
      open"* still reaches every remaining row. A **cancelled** row is closed, not open — ⛔ but the
      archival banner must still account for it, because the board it archives contains it.
  - ⚠️ **Corrected in place 2026-08-29, and the change is not cosmetic.** This bullet previously read
    *"… `0358`, `0359`. ⛔ **Hard: this is the last row on the board and it archives it.**"* Two things
    changed: **`0361` was added**, and the claim *"this is the last row on the board"* was replaced,
    because it is **no longer true**.
  - ⛔ **`0361` (`P13`) sits BELOW this row by rank and must still run BEFORE it.** It was appended by an
    owner ruling of 2026-08-29 (*"File it as a Sprint 7 row (Rec)"*), and
    [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
    forbids inserting it mid-board at its merit position, so the rank could not carry the order.
    ⭐ **This dependency line is what carries it** — ADR-035: *"Where ordering must actually bind, it
    belongs in `Depends on` / `Blocks`, not in rank."*
  - ⛔ **The constraint *"Do not archive while any Sprint 7 row is open"* therefore reaches `0361` too.**
    ⚠️ **Rank order is not run order on this board any more; check the board, not the numbers.**
  - ⚠️ **It is a machine-parsed field** — `dashboard.sh` derives the board's `Next step` from it, so a
    stale value renders a false `ready`. Corrected here rather than annotated below, for that reason;
    the full record lives in [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ Addendum — the
    THIRTEENTH row".
- **Blocks:** nothing.
- ⭐ **`0359` is what makes step 2's success-criterion line honest.** If `0359` has not landed, ⛔ **do
  not estimate the share** — record that it is unmeasured and why. An unmeasured claim in an archival
  banner is permanent.
- ⚠️ **This row is `fkit-producer`-owned and it archives a board — but it still moves no task folder by
  hand.** Task closes go through `/fkit-task-done` / `/fkit-task-cancelled` (ADR-033); ⚠️ **a sprint
  plan has no mover skill at all** — `0341` would build one and is `Unscheduled` by ruling. **That is
  exactly why the archival is hand-done and carries the caveat.**
- **Priority `P12` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner rulings *"Approve all 12 as proposed (Rec)"*, *"Minor — v0.3.0
  (Rec)"* and *"Hand-archive again, with the caveat (Rec)"*, all 2026-08-29, `AskUserQuestion`, live
  `fkit lead` session.
</content>
