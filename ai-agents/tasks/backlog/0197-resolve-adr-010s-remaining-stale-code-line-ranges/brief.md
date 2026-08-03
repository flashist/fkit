# Resolve ADR-010's remaining stale code line-ranges — including one never checked at all

## ID
0197

## Sprint
Sprint 2

## Priority
175

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### What `0143` left

[ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) cites
code by `path:NNN` line range in seven places. Task
[`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md) annotated **three** of them
stale in place, inside the correction blocks it appended — `claude/agents/fkit-lead.md:22-26`,
`claude/fkit-claude.sh:190`, and the `claude/fkit-claude.sh:75-86` pointer it touched at §Decision 3.
Each was left as written, per `0143`'s rule that a cited coordinate is *"the record of what was cited in
2026-07"*.

**The remaining pointers were never assessed.** They are:

- **§Context, the menu bullet** — `claude/fkit-claude.sh:151-187`.
- **§Context, the lock bullet** — `claude/fkit-claude.sh:14-18,192-199` and
  `claude/fkit-claude.sh:75-103`.
- **§Context, the two-lists passage** — `claude/fkit-claude.sh:75-86`. ⚠️ **NARROWED 2026-08-02 by the
  producer, on the owner's OQ-3 ruling made during `0195`'s close: this item is now the LINE-RANGE half
  only (`:75-86`).** `0195` shipped a dated ⚠️ block below this passage that already corrects the **file**
  half — it records that `skills_for_role()` has moved file, that the `skills:` frontmatter was dropped so
  the two lists no longer exist, and it deliberately does **not** restate the current file name, pointing
  instead at §Decision 5 as the one binding site. **Do not re-annotate the file half here** — that would
  put the same fact in two places, which is exactly what `0195`'s block was written to avoid. Assess only
  whether `:75-86` still lands on what the passage cited it for, and if it drifted, say so **without**
  restating the file fact: cite §Decision 5's ⚠️ notice as the binding statement.
- **§Related, the `Code:` line** —
  `claude/fkit-claude.sh:14-18,29,75-103,151-199`, `claude/agents/fkit-lead.md`,
  `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/CLAUDE.md:12-50`.
- **§Supersedes / §Related** — `adr-008:106-120` and `adr-008:114`.

### ⚠️ One is unverified in a way the others are not

**`claude/scaffold/CLAUDE.md:12-50` in §Related has never had its contents checked — not by `0143`, not
by any prior task.** Measured 2026-08-02: the file is **92 lines**; `:12` is the heading
`## The fkit agent team`; `:50` lands **mid-sentence** inside a paragraph about the `⛔ Owner:` banner.
The range is therefore plausible at its start and arbitrary at its end, and **whether it still covers
what ADR-010 meant it to cover is unknown.** This task must find out. *(Re-measure — do not inherit
these numbers.)*

### Why this is not a mechanical sweep

The right outcome differs per pointer and the judgement is the work:

- A pointer that **still lands on what it cited** needs nothing.
- A pointer that **drifted** gets a dated ⚠️ note recording where the claim lives now — the pointer
  itself is left as written, per `0143`'s precedent.
- A pointer into an **ADR** (`adr-008:106-120`) is a citation into a frozen record, not a moving file,
  and is likely fine — but *"likely"* is not a finding.
- A pointer whose **target no longer exists at all** is a different case again.

**A sweep that mechanically re-numbers every range would reproduce the defect in a fresher tense**, and
would breach `0143`'s append-only rule besides.

### Its relationship to the citation-anchor work

Task [`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md) writes the
`durable-citation-anchors` convention page, which rules **what form** a durable citation takes —
including §1.1's rider *"never cite a line number naked; pair every `path:NNN` with a quoted fragment or
the heading it sits under."* **That form is this task's input.** Filing this separately rather than
folding it into `0171` is deliberate: `0171` is a convention-page write with a known shape and no
unknowns, while this task cannot be scoped until `claude/scaffold/CLAUDE.md:12-50` has been examined.
Folding them would hold a ready task behind an investigation.

**Citation form is permitted, not mandated** (`0143` residual). Where this task writes a new pointer,
it uses `0171`'s form.

## What to build

**An assessment, then whatever repair the assessment justifies — in that order.**

1. **Assess every remaining `path:NNN` citation in ADR-010** against the live tree. For each, record:
   the pointer, what ADR-010 claims it shows, what the range contains today, and the verdict —
   **lands / drifted / target gone / not applicable (frozen record)**. Put this table in the worklog.
2. **Resolve `claude/scaffold/CLAUDE.md:12-50` explicitly.** State what the range contains, whether it
   covers the material ADR-010 cited it for, and what the durable anchor would be instead. **Silence on
   this one fails the task** — it is the reason the task exists as an investigation.
3. **Append a dated ⚠️ note** — one, covering the pointers found stale, in `0143`'s established form —
   recording where each drifted claim lives now, anchored by file plus heading or quoted phrase rather
   than by a fresh line number.
4. **If the assessment finds nothing stale, say so and append nothing.** A clean result is a valid
   outcome and must be recorded in the worklog, not papered over with a note that says nothing.
5. **The header `- **Corrections:**` bullet updated** if a note lands (see the exception clause).

### Hard constraints — inherited from `0143`, non-negotiable

- ⛔ **APPEND ONLY — `+N / −0`.** The existing `path:NNN` pointers stay **byte-identical**, stale ones
  included. `0143` ruled them the record of what was cited; re-numbering them in place is forbidden.
  Prove with `git diff --numstat` (deletions `0`) and `git diff -U0 | grep '^-'` returning nothing.
  - ⚠️ Header `- **Corrections:**` bullet: the one exception, justified in the worklog.
- ⛔ **ADR-010's `**Status:**` stays `accepted`.**
- ⛔ **Do not touch `ai-agents/wiki-vault/`** — task `0199`.
- ⛔ **Write no new naked `:NNN` into ADR-010.** New anchors follow `0171`'s form: file plus quoted
  fragment or heading.
- ⛔ **Do not edit the files ADR-010 points at.** This task assesses citations; it changes no code, no
  skill, and no other ADR.
- ⛔ **Out of scope, by name:** `0195`, `0196`, `0198`, `0199`; and the **12 displaced `adr-010:NNN`
  pointers in ADR-012 / ADR-018 / ADR-031** — those are *inbound* citations to ADR-010 and were
  owner-ruled into `0171`. This task handles ADR-010's **outbound** citations only.

## Verification steps

1. The worklog carries a per-pointer table covering **every** `path:NNN` citation remaining in ADR-010,
   each with a verdict of lands / drifted / target gone / not applicable.
2. `claude/scaffold/CLAUDE.md:12-50` has an explicit entry stating the file's live line count, what the
   range contains, and whether it covers what ADR-010 cited it for.
3. `git diff --numstat` on ADR-010 shows deletions **`0`** (header-bullet exception aside); every
   pre-existing `path:NNN` string is still present, byte-identical.
4. If a note was appended: it sits **below** the claim it corrects, carries a date, and anchors every
   new reference by file plus heading or quoted phrase — `grep` for a newly introduced naked `:NNN`
   returns nothing.
5. If no note was appended: the worklog states the clean result and the evidence for it.
6. ADR-010's `- **Status:** accepted` line is unchanged.
7. No file outside `ai-agents/knowledge-base/decisions/adr-010-*.md` and this task's own folder is
   modified.

## Notes

- **Depends on:** 0171 — soft. `0171` rules the durable anchor form this task writes in. It can be run
  before `0171` lands only if the architect fixes the anchor form itself and records that it did so;
  otherwise wait.
- **Blocks:** nothing. **Coordinates with:** `0195` and `0196` — all three append to ADR-010; whichever
  lands last rebases and re-runs the `−0` proof against the updated baseline. Not blocked on each other;
  must not be worked in parallel on the same file.
- **⛔ SERIALIZATION — recorded 2026-08-02 at `0195`'s close. Read this before scheduling.** The ADR-010
  work runs **strictly serially**, in this order, and never two at once:

  | # | Task | Why it must wait |
  |---|---|---|
  | 1 | `0195` | ✅ **landed 2026-08-02** (`+53 / −0`) — it is the baseline the rest measure against |
  | 2 | `0196` | appends to the same file; its `−0` proof needs `0195` already in the tree |
  | 3 | **`0197` (this task)** | same file again; its `−0` proof needs `0195` **and** `0196` in the tree |
  | 4 | `0171` | re-anchors the 12 displaced `adr-010:NNN` pointers — run it earlier and it measures against a **moving** ADR-010 and re-rots on the next append |
  | 5 | `0199` | the vault resync must describe the ADR's **final** state, so it runs last |

  **This is an ordering constraint, not a `Depends on:`** — none of these is blocked on another's
  *outcome*; they are blocked on each other's *file writes*. The `## Priority` ranks are append ranks and
  do **not** encode this order (ADR-035); the table above does.
- **This is an investigation-first task.** The repair shape is unknown until the assessment is done, and
  *"nothing needed repair"* is a legitimate outcome. Do not pre-commit to appending a note.
- **⚠️ Priority 175 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0171`**, because `0171` supplies the anchor form it writes in
  and running it any earlier means inventing that form twice. Filed by a spawned producer with no owner
  channel, which never re-ranks (ADR-035, `/fkit-task-brief` step 5). No existing row was renumbered.
- **`decisions/` is `⛔ never sync`** per
  [dual-home-parity](../../../knowledge-base/conventions/dual-home-parity.md) — no scaffold copy to keep
  in step. Checked at scoping time, per ADR-027 §Decision 1.
- No commit — leave the edit in the working tree.
