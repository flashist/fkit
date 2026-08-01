# Amend ADR-027 to record the audience-adapted third kind

## ID
0186

## Sprint
Sprint 2

## Priority
164

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

[ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
models the dual-homed surface as **two kinds of file**: fkit-authored files that must match byte for byte,
and project-specific files that must never sync. Task
[`0132`](../../done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/brief.md) swept both trees and
found a **third kind the ADR has no room for**.

**What the sweep found.** The drifted `conventions/*` files in `claude/scaffold/` are **not stale copies
left behind**. Five of the six are deliberate, de-fkit-ified, **audience-adapted** rewrites — the same
rule, written for a consuming project rather than for fkit's own repo. Byte-aligning them, which
**§Decision 2 mandates**, would ship fkit's own incident narrative and **4 verified-broken relative
links** into every new project.

**The owner ruled on 2026-08-01 (Option B):** "audience-adapted" is a legitimate **third kind** alongside
✅ must-match and ⛔ never-sync, and byte-aligning live → scaffold is **rejected as a product regression**.
`dependency-declaration-form.md` ships to the scaffold **GENERALIZED, not byte-identical**.

**So ADR-027 §Decision 2 is a live record instructing a future implementer to ship a regression.** That is
the reason this task is filed rather than left as a note.

**⚠️ The actual defect in the ADR is its evidence, not its arithmetic.** The "six drifted files" figure is
a `diff -rq` count, and **a `diff` count cannot distinguish a stale copy from a deliberate adaptation** —
it reports difference, never intent. The figure is stale **in kind, not in count**: `0132` verified that
all six still differ, and that **none** were fixed by `0043`/`0077`/`0086` — so `0132`'s own brief was
wrong to guess that two may have been repaired. Correcting the number is not the fix; correcting what the
number was taken to *mean* is.

**Conflict surfaced, not planned around.** `0132`'s brief carries a verification step (step 2) demanding
the scaffold copy be byte-identical to the live copy. That step is **superseded by the owner ruling, not
met**, and is recorded as such in `0132`'s close-out. It reads as unfinished work to anyone who has not
read the ruling — which is exactly the confusion this amendment removes at the source.

**Not blocked.** `0132` is the evidence and it closed 2026-08-01.

## What to build

1. **Record the third kind in ADR-027** — an **audience-adapted** dual-homed file: fkit-authored in
   substance, deliberately rewritten for the consuming-project audience, and therefore **not** required
   to be byte-identical. Give it the same standing in the ADR's model as the two existing kinds, and say
   what distinguishes it from a stale copy in a way a reader can apply.
2. **Amend §Decision 2** so it no longer mandates byte-aligning the drifted files. Record the owner's
   2026-08-01 Option B ruling — the date, that the owner ruled it, and that byte-aligning live → scaffold
   was rejected **as a product regression** — and state the concrete cost that drove it (fkit's incident
   narrative plus 4 broken relative links shipped into every consuming project).
3. **Correct the "six drifted files" framing.** Record that all six still differ, that none were fixed by
   `0043`/`0077`/`0086`, and — the load-bearing part — that **a `diff -rq` count cannot tell a stale copy
   from a deliberate adaptation**, so the count was never evidence of drift in the first place.
4. **Point at the authoritative list.** `test/dual-home-parity-exceptions.mjs` (26 entries, each with its
   own specific reason) is the list of record; the ADR should defer to it rather than restate it.
5. **Record what is outside the surface**, since `0132` established it and the ADR currently implies
   otherwise: `decisions/` and `reports/` are **not** part of the dual-homed surface, so **no ADR is ever
   a drift event**.
6. **Follow the project's ADR amendment practice** — amend in place with a dated amendment note, or
   supersede, whichever the existing corpus already does. Do not invent a third practice.

## Verification steps

1. ADR-027 names three kinds of dual-homed file, and the audience-adapted kind has a stated test a reader
   can apply to classify a file.
2. ADR-027 no longer instructs anyone to byte-align the drifted `conventions/*` files; the 2026-08-01
   owner ruling is recorded with its date and its authority.
3. The "six drifted files" passage states that all six still differ, that none were fixed by the three
   named tasks, and that a `diff` count does not distinguish staleness from adaptation.
4. ADR-027 names `test/dual-home-parity-exceptions.mjs` as the authoritative exception list.
5. ADR-027 states that `decisions/` and `reports/` are outside the dual-homed surface.
6. Every relative link added to or touched in the ADR resolves.
7. The existing test suite is green — this task changes no code and must not.

## Notes

- **Owner:** fkit-architect. An ADR amendment is an architect act.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **On merit:** immediately above `0133` — `0133` builds the parity test that reads the exception list,
  and it is the next eligible task; a `0133` implementer who reads ADR-027 as written today is told to
  byte-align files the owner has ruled must not be byte-aligned.
- ⚠️ Priority 164 is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly below `0132`** (i.e. immediately above `0133`), because `0133` is the
  next eligible task and consumes exactly the model this amendment corrects. Append rank puts it roughly
  **34 open rows** below that.
- **Appended by a spawned producer with no owner channel** (`/fkit-task-brief` step 5). No existing row
  was re-ranked, and none may be.
- ⛔ **Do not edit `test/dual-home-parity-exceptions.mjs`** or any test — this is a documentation
  amendment only.
- ⛔ **Do not touch `0132`'s brief or its `review.md`** — `0132` is closed, and ADR-034 bars editing a
  closed task's review ledger.
- ⛔ **Do not re-open the byte-align question.** The owner ruled it 2026-08-01; this task records the
  ruling, it does not revisit it.
- **Filed 2026-08-01** as the single follow-up from `0132`'s close.
