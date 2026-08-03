# Correct ADR-010's `skills_for_role()` source-of-truth claim — the self-contradiction `0143` knowingly shipped

## ID
0195

## Sprint
Sprint 2

## Priority
173

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

### The defect: ADR-010 contradicts itself on one screen, today

Task [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md) appended dated
correction notes to
[ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) on
2026-08-02. One of the blocks it added — the ⛔ notice at **§Decision 3** — states:

> *"`skills_for_role()` in `claude/skills-for-role.sh` grants lead `fkit-team`, `fkit-query`,
> `fkit-open-questions-interview`, `fkit-dumb-down` and `fkit-sprint-ship-loop`."*

Its immediate neighbour, **§Decision 5**, is untouched and still reads:

> *"**`skills_for_role()` in `claude/fkit-claude.sh` is the single source of truth** for role→skill
> ownership. The `skills:` frontmatter in `claude/agents/*.md` must be **generated from it or
> dropped** — it may not be a second hand-maintained list."*

**Two different files are named as the home of the same function, three decisions apart.** A reader
landing on §Decision 5 alone is told the wrong file. §Context's *"One real inconsistency"* passage
carries the same stale pointer (`claude/fkit-claude.sh:75-86`) and additionally presents the `skills:`
frontmatter as a **live second list**, which it no longer is.

**This is `0143`'s accepted residual `R4-contradiction-ships`, not new information.** It ships knowingly:
the owner's Q4 ruling of 2026-08-02 excluded §Decision 5 from `0143`'s scope, and `0143`'s *"note, not a
rewrite"* constraint forbade an in-place edit. `0143`'s ledger records a **re-raise condition that fires
if this task has not landed by the end of Sprint 2.**

### The facts, verified against live code 2026-08-02

| Claim in ADR-010 | Live reality |
|---|---|
| `skills_for_role()` lives in `claude/fkit-claude.sh` | `claude/skills-for-role.sh` exists (4,557 B) and is the home; `fkit-claude.sh` sources it |
| The `skills:` frontmatter is a second hand-maintained list | **No `claude/agents/*.md` carries a `skills:` key** — `grep -l '^skills:' claude/agents/*.md` returns nothing |

**The `skills:` frontmatter was dropped, not generated** — the second of the two branches §Decision 5
itself offered. Recorded by
[ADR-012](../../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md).
Re-verify both rows first-hand before writing; do not inherit this table.

### Why this is an architect task

Same reason `0143` was: deciding how an accepted decision record absorbs a later change is a question
about the project's record-keeping shape, not a text substitution. §Decision 5's **decision** — one
source of truth for role→skill ownership — is **still in force and was honored**; only its named file
and its statement about the frontmatter went stale. Telling those apart is the judgement here.

## What to build

**Dated correction notes appended to ADR-010, in the form `0143` established.** Read `0143`'s three
shipped blocks and its `worklog.md` before writing — the form is the deliverable of that task and this
one is its second application.

1. **A ⚠️ dated correction at §Decision 5**, recording:
   - `skills_for_role()` now lives in `claude/skills-for-role.sh`, sourced by both
     `claude/fkit-claude.sh` and the ADR-018 `PreToolUse` skill-ownership hook;
   - the `skills:` frontmatter was **dropped** (ADR-012), which is one of the two outcomes §Decision 5
     itself permitted — so the decision **held**, and this is drift in its prose, not a reversal;
   - the marker is **⚠️, not ⛔** — and the note must say why, because the distinction is the legend's
     whole value.
2. **A ⚠️ dated correction covering §Context's *"One real inconsistency"* passage** — same two facts,
   plus the fact that the *"they currently disagree"* observation is spent: the disagreement it names
   was resolved by dropping one of the two lists.
3. **The header `- **Corrections:**` bullet updated** to name the newly annotated sites. It currently
   reads *"inline at **§Context** and **§Decision 3**"* — that enumeration becomes false the moment a
   note lands at §Decision 5.

**Whether 1 and 2 are one block or two is the architect's call** — `0143`'s owner ruling (Q1) split its
§Context work into two blocks because the causes differed. Here the cause is one. Decide and record the
reason either way.

### Hard constraints — inherited from `0143`, non-negotiable

- ⛔ **APPEND ONLY. `0143`'s load-bearing constraint was `+N / −0` and it must hold again.** No existing
  line of ADR-010 may be edited, reworded, scoped, dated or deleted — including §Decision 5's sentence
  and §Context's passage. Prove it with `git diff --numstat` (deletions must read `0`) and
  `git diff -U0 | grep '^-'` returning nothing, **not by eye**.
  - ⚠️ **The header `- **Corrections:**` bullet is the one exception, and it must be justified in the
    worklog.** It is header *metadata* describing the notes, not ADR body text. `0143` shipped it under
    owner ruling Q3 as **one metadata item that may wrap**. Extending its site list keeps it accurate;
    leaving it stale makes the ADR lie about its own annotations. If the architect judges that even this
    breaches append-only, say so and propose the alternative rather than silently doing neither.
- ⛔ **ADR-010's `**Status:**` stays `accepted`.** Not superseded, not deprecated.
- ⛔ **Do not touch `ai-agents/wiki-vault/`.** ADR-010's vault page is `fkit-wiki`'s — task `0199`.
- ⛔ **Write no new `:NNN` line numbers into ADR-010.** Anchor by heading plus quoted phrase. Existing
  `:NNN` pointers are left as written (`0143`'s precedent: they are the record of what was cited).
- ⛔ **Out of scope, by name:** the `skillOverrides` correction (task `0196` — the owner's Q4 exclusion
  is still in force and this task does not reopen it); ADR-010's remaining stale line-ranges (task
  `0197`); any change to `/fkit-record-decision` (task `0198`); the vault resync (`0199`).

### Placement, inherited as binding form from `0143`

- **Correction notes go BELOW the claim they correct**, not above it — `0143`'s residual `R1-placement`,
  which departs from the vault's *"banner above claim"* convention **with a recorded rationale**. Follow
  it and cite it; do not re-litigate it here.
- **Two markers only: ⚠️ = a fact that drifted; ⛔ = a decision that was overturned.** This task writes
  **⚠️**. Introducing a third marker is out of scope.

## Verification steps

1. `git diff --numstat` on ADR-010 shows deletions **`0`**, and `git diff -U0 … | grep '^-[^-]'`
   returns nothing — with the single, worklog-justified exception of the header `- **Corrections:**`
   bullet if the architect elects to extend it.
2. §Decision 5's original sentence and §Context's *"One real inconsistency"* passage are present,
   byte-identical to their pre-task text.
3. A dated ⚠️ note sits **below** §Decision 5's claim, names `claude/skills-for-role.sh`, states that
   the `skills:` frontmatter was dropped, cites ADR-012, and **states why the marker is ⚠️ and not ⛔**.
4. `grep -c '^skills:' claude/agents/*.md` returns 0 for every file, and `claude/skills-for-role.sh`
   exists — the two facts the note asserts, re-checked at the time of writing and recorded in the
   worklog with the date.
5. **The contradiction is gone:** reading §Decision 5 alone no longer tells a reader that
   `skills_for_role()` lives in `claude/fkit-claude.sh`.
6. ADR-010's `- **Status:** accepted` line is unchanged.
7. The header `- **Corrections:**` bullet either lists every annotated site accurately, or the worklog
   states on the record why it was left alone and what the reader loses by that.
8. No file under `ai-agents/wiki-vault/` is modified.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing. **Coordinates with:** `0196` and `0197` — all three append to ADR-010, so
  whichever lands second and third must **rebase on what is already there**, re-run the `−0` proof
  against the updated baseline, and not restate the ⚠️/⛔ legend the header bullet already carries.
  They are not blocked on each other; they must not be worked in parallel on the same file.
- **⚠️ This is the priority-raised one of the ADR-010 follow-ups.** `0143`'s ledger residual
  `R4-contradiction-ships` carries a re-raise condition firing **if this has not landed by the end of
  Sprint 2**. The other two ADR-010 corrections carry no deadline.
- **Why this is a separate brief from `0196`** and not one ADR-010 correction task: `0196`'s subject was
  **explicitly excluded by the owner** (Q4, 2026-08-02) from `0143` on the grounds that it is an
  unrelated cause, and merging them would hold this deadline-bearing correction hostage to a
  question the owner has already chosen to handle separately.
- **⚠️ Priority 173 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly above `0162`**, at the very top of the open board, because it is the
  only open row repairing a document that **contradicts itself in the live tree today**, it carries the
  only end-of-sprint deadline on the board, and it is a single-file append with no unknowns. Filed by a
  spawned producer with no owner channel, which never re-ranks (ADR-035, `/fkit-task-brief` step 5). No
  existing row was renumbered, inserted past, or re-ranked.
- **`decisions/` is `⛔ never sync`** per
  [dual-home-parity](../../../knowledge-base/conventions/dual-home-parity.md) — no scaffold copy to keep
  in step. Checked at scoping time, per ADR-027 §Decision 1.
- No commit — leave the edit in the working tree.
