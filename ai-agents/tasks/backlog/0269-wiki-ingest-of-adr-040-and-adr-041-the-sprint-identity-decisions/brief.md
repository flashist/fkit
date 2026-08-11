# Wiki ingest of ADR-040 and ADR-041 — the sprint-identity decisions

## ID
0269

## Sprint
Sprint 5

## Priority
Sprint 5 P9

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

### Authority

**Owner ruling, 2026-08-10** — ADR-040's and ADR-041's implementation follow-ons are filed and ranked
into Sprint 5, wiki ingest among them. ADR-040 and ADR-041 both end with an explicit hand-off: their
implementation and ingest follow-ups are **the producer's to file, not the ADR's**. ADR-035 carries the
same closing line (*"`fkit-wiki` should ingest this ADR … The architect does not write the wiki"*),
and `0249` is the standing precedent for ingesting a decision as its own task.

### Why `fkit-wiki` and nobody else

**Only `fkit-wiki` may write `ai-agents/wiki-vault/`**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
The architect who wrote both ADRs and the producer who filed this brief are structurally barred from
the vault; neither wrote anything there.

### ⚠️ Overlap with the two open wiki tasks — checked, and the answer is NO overlap

Stated either way, as required, and checked **before** filing rather than assumed:

- **[`0258`](../0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md)** — re-syncs
  `systems/install-and-self-update` after `0252` lands `RELEASING.md`. Different page, different
  source, hard-gated on `0252`. **No overlap.**
- **[`0263`](../0263-wiki-resync-after-the-sprint-4-archival-and-sprint-5-open/brief.md)** — re-syncs
  **board reality**: Sprint 3 is not active, Sprint 4 archived, Sprint 5 open, four dead
  `sprints/sprint-3.md` paths. Its subject is boards, not decisions. **No overlap.**

**A new brief was filed rather than either being widened**, and that is deliberate: `0263`'s own Notes
record the owner praising the previous producer for **not** widening `0238` unasked, and `0263` itself
was filed on the ruling **"New brief for this archival"** for the same reason. Widening either one here
would repeat the mistake that ruling rejected.

⚠️ **`0263` will touch Sprint 5's board page and this brief's ADRs are Sprint 5's subject matter.**
That is adjacency, not overlap — but if `0263` runs first and records Sprint 5's rows, **re-measure
rather than assuming**, and do not duplicate what it already wrote.

**All three are `fkit-wiki`-owned vault work and batch efficiently in one session** — with `0199`,
`0206`, `0212`, `0238`, `0239`. A scheduling observation, not a dependency; none gates another.

## What to build

Vault pages for **ADR-040** and **ADR-041**, following the vault's own decisions-page conventions.

1. **ADR-040** — a plan's sprint identity is a whole H1 segment, never a substring, and a letter suffix
   is part of it. The page must carry, not soften:
   - **the hard constraint** — *a wrong identity is strictly worse than no identity*, with the
     `plan-sprint-4c.md` → `Sprint 4` silent-whole-board-skip trace that makes it concrete;
   - **the §7 regression guard** — a genuinely unidentifiable plan **must still** report
     `unresolved-plan-sprint`; an implementation that drops it does not satisfy the decision;
   - **prose containment is not identity** (`hotfix-post-sprint2.md`), and the **one-letter** suffix
     bound with its reason;
   - the **`moved_target` companion** as a binding part of the decision, and that it is **not** a
     fourth `PLAN_SPRINT` consumer.
2. **ADR-041** — the active sprint is selected by resolved identity, not by a filename glob, and
   `sprint-backlog.md` is a backlog board. The page must carry:
   - the **compounded** defect (wrong board selected **and** the `dashboard.sh:796` highest-value check
     lost, on one file);
   - **`Backlog` is never eligible; unresolved is never eligible**;
   - **one grammar, one implementation** (§5) — the selector obtains identity from `dashboard.sh`;
   - the **"highest N" residual**, stated as a heuristic inherited and not endorsed;
   - **ADR-041 cannot ship before ADR-040.**
3. **Both statuses recorded honestly.** ⚠️ At filing (2026-08-10) both ADRs read
   `proposed — needs the owner's sign-off before implementation`. **Record whatever each reads when you
   run**, and **do not describe either as implemented** — the implementation is filed as `0264`–`0268`
   and, at filing, none had landed. **Re-measure; do not quote this brief.**
4. **Link them to what already exists in the vault** — the source report, and any page covering
   `fkit-status` / the dashboard / drift rules. If no such page exists, **say so** as a gap; do not
   invent scope to fill it.
5. **`log.md` records the ingest**, per the vault's own logging convention.

### Constraints

- ⛔ **Do not start before both ADRs read `accepted`.** They were `proposed` at filing and a concurrent
  `fkit-architect` unit was flipping them. Ingesting a proposed decision as settled would make the
  vault assert something the owner has not signed off. **If either still reads `proposed`, stop and
  report.**
- ⛔ **`log.md` is APPEND-ONLY** — owner ruling 2026-08-03, task `0211`. A correction is a **new dated
  entry**, never an in-place edit.
- ⛔ **Do not edit anything outside `ai-agents/wiki-vault/`.** Not the ADRs, not a board, not a brief.
- ⛔ **Do not move any task file** — the movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **Do not re-rank anything or correct a board row.** If the ingest surfaces a board defect, **report
  it to the producer.**
- ⛔ No commit.

## Verification steps

1. **Both ADRs read `accepted`** — quote each `- **Status:**` line and its date in the worklog.
2. **Before:** `grep -rl 'ADR-040\|ADR-041\|adr-040\|adr-041' ai-agents/wiki-vault/` — **returned
   nothing at filing (2026-08-10, per both ADRs' own four-way number-allocation sweep). Re-measure, do
   not quote.**
3. **After:** the same grep returns at least one file per ADR, and every page it returns resolves.
4. **The four non-negotiables are present in the ADR-040 page, individually**: the wrong-identity
   constraint, the `unresolved-plan-sprint` guard, prose-containment-is-not-identity, and the
   `moved_target` companion. Name each and quote where it landed. A page that records only "the regex
   was widened" is a **worse record than no page**.
5. **The ADR-041 page states both halves of the compounded defect** and the "highest N" residual.
6. **Neither page describes either decision as implemented**, unless `0264`–`0268` have actually
   closed — in which case say which, with dates, measured not assumed.
7. **Every code coordinate on both pages resolves against today's tree.** ⚠️ `0264`/`0265` will have
   moved most `dashboard.sh` line numbers; prefer quoted text as the anchor.
8. `log.md` carries the ingest entry, **appended**.
9. **`git diff --stat` touches `ai-agents/wiki-vault/` and nothing else.**
10. `/fkit-wiki-lint` is clean, or every finding is listed with a disposition.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⚠️ **The `accepted`-status precondition above is a CONSTRAINT, not a task dependency.** No filed task
  flips those statuses, so a `Depends on` label would name a task that does not exist. A false label is
  machine-read by `dashboard.sh` and worse than none (tasks `0184`, `0149`). **It still gates the
  start** — see the ⛔ constraint.
- **⚠️ Deliberately NOT gated on `0264`–`0268`.** An ADR is a decision record and stands as one whether
  or not its implementation has landed; `0249` set that precedent by ingesting a design report and its
  companion ADR before the build. Gating this on five implementation rows would take the union of five
  preconditions for no gain — the same reasoning `0239` recorded when it declined to merge with `0238`.
  **If some of `0264`–`0268` have landed by the time this runs, say so in the worklog and record it;
  do not silently widen scope.**
- **On merit:** immediately below `0268` — it is the last act on this decision cluster and nothing
  waits on it, which is where it would rank on a freely-ranked board too.
  ⚠️ **`P16` is an append rank, NOT a merit ranking — flagged for owner confirmation.** A spawned
  producer never re-ranks or inserts mid-board (`/fkit-task-brief` step 5, ADR-035). See Sprint 5's
  dated addendum. **This row is the one whose append rank and merit rank agree.**

  ✅ **RESOLVED 2026-08-11 — the flag above is left byte-identical and is now DISCHARGED.** The owner
  confirmed the placement in a live `fkit producer` session and the re-rank was **executed**: this row now
  sits at **`Sprint 5 P9`**, and the append rank is history. **and it is the merit position the statement above names, exactly.** Authority, the verbatim ruling, its channel, and the full old→new rank map are in Sprint 5's
  §"Addendum — the owner-ruled re-rank of 2026-08-11". ⛔ **This is not producer precedent for
  re-ranking** — it was executed only because the owner ruled it in a live session.
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.

- **⛔ NOT DRIVEN BY `/fkit-sprint-ship-loop` — owner ruling 2026-08-10**, given via
  `AskUserQuestion` in a live session, **the option label is the verbatim text**:
  **"0258 and 0269 — the wiki rows (Rec)"**. This row **cannot execute inside the loop at all.** It
  is `## Owner: fkit-wiki` and its entire deliverable is a write under `ai-agents/wiki-vault/`, but
  **the loop never reads `## Owner`** — [ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
  fixes each step's role to the skill that step runs, so its **Build** step spawns `@fkit-coder`
  (`claude/skills/fkit-sprint-ship-loop/SKILL.md:121`), and `claude/agents/fkit-coder.md:211`
  forbids that role from writing the vault **ever**. Driven by the loop this row either stalls on a
  refusal or breaches ADR-005. It runs in a **`fkit wiki` session** instead.
  ⚠️ **This is an exclusion from that loop run and from nothing else. `## Status` stays
  `🔲 Backlog`, the row stays in Sprint 5, the rank stays `P16` — NOT blocked, NOT deprioritised,
  NOT descoped.** Full reasoning is the **first bullet** of
  [`sprint-5.md`](../../../sprints/sprint-5.md)'s `## Notes`.
  ⚠️ **CORRECTED 2026-08-11 — the sentence above is left byte-identical and one clause of it is now
  stale.** *"the rank stays `P16`"* was true of the exclusion, and stays true **of the exclusion**: pulling
  a row out of a loop run still changes no rank. The rank moved anyway, by a **different and later
  authority** — the owner-ruled re-rank of 2026-08-11. This row now sits at **`Sprint 5 P9`**. ⛔ **Every
  other word of the sentence is untouched and still binding: still `🔲 Backlog`, still in Sprint 5, still NOT
  blocked, NOT deprioritised, NOT descoped, and still excluded from the ship-loop run.** See Sprint 5's
  §"Addendum — the owner-ruled re-rank of 2026-08-11".
  ⛔ **Unchanged by this note:** the *"do not start before BOTH ADRs read `accepted`"* gate — both
  read `accepted` as of 2026-08-10, verified on disk.
