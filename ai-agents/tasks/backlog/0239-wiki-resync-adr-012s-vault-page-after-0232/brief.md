# Wiki re-sync of ADR-012's vault page after `0232` corrects the ADR's stale coordinates

## ID
0239

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06** — verbatim: **"File it now, alongside 0199."**

### What makes the vault page wrong

Task [`0232`](../../done/0232-correct-adr-012s-stale-source-of-truth-and-code-coordinates/brief.md) corrects
ADR-012's stale source-of-truth claim and its other stale code coordinates in
`ai-agents/knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md`.
The best-known instance: ADR-012 names `claude/fkit-claude.sh` as the home of `skills_for_role()`,
which actually lives in `claude/skills-for-role.sh`.

**ADR-012 has a page in `ai-agents/wiki-vault/`.** The moment `0232` lands, that page carries the
coordinates the ADR itself no longer claims — the vault becomes the last place the corrected error is
still asserted as current.

`0232`'s own brief instructs that this be **filed as a follow-up rather than performed**, and says so
in its Out-of-scope section: *"ADR-012 has a wiki page; it will need a re-sync after this lands — file
that as a follow-up if it is not already covered, do not write the vault yourself."* That instruction
is what this brief discharges.

### Why `fkit-wiki` and nobody else

**Only `fkit-wiki` may write `ai-agents/wiki-vault/`** (ADR-005). The coder landing `0232` is
structurally barred from following the correction through into the vault, which is precisely why the
follow-up exists as a separate task with a different owner.

### The precedent — `0199`, the same job for ADR-010

[`0199`](../0199-wiki-resync-adr-010s-vault-page-after-the-correction-notes/brief.md) is the exact
precedent, named by the owner in the ruling: a source ADR gained dated correction notes, and its vault
page's claims went stale as a result. **Read `0199` and follow its shape** — the same question of
whether the vault page is edited in place or gains its own dated note, answered the same way, so the
two ADR pages do not end up carrying two different correction conventions.

## What to build

A re-sync of ADR-012's page in `ai-agents/wiki-vault/` so it matches the ADR as `0232` leaves it.

- Every coordinate `0232` corrected in the ADR is corrected, or dated-corrected, on the vault page.
- The `skills_for_role()` home reads `claude/skills-for-role.sh`.
- **Re-derive from the landed ADR, not from this brief.** `0232`'s own brief warns that its inventory
  *"is evidence that the defect is wide, not a checklist to execute"* — the same caution applies one
  step downstream. What `0232` actually changed is the input; what it planned to change is not.
- `log.md` records the sync, per the vault's own logging convention.

### Constraints

- **⛔ Do not start before `0232` has landed.** Re-syncing against an uncorrected ADR copies the stale
  coordinates forward and burns the task.
- **⛔ Do not edit anything outside `ai-agents/wiki-vault/`.** Not the ADR, not a board, not a brief.
- **⛔ Do not re-open ADR-012's decision.** This is a coordinate repair following a coordinate repair;
  the decision itself is untouched.
- **⛔ Do not move any task file** — the movers are producer-only (ADR-033).
- **⛔ No commit.**

## Verification steps

1. `0232` is closed before this starts — state its close date in the worklog.
2. Diff the landed ADR-012 against its vault page and **report the coordinate list you derived**, not
   the one this brief anticipated.
3. Every coordinate on the vault page resolves against today's tree — in particular
   `claude/skills-for-role.sh` exists and `claude/fkit-claude.sh` is no longer named as
   `skills_for_role()`'s home.
4. The correction form matches `0199`'s. If it deliberately differs, **say why** — two conventions
   across two ADR pages is a defect this task can create.
5. `log.md` carries the sync entry.
6. **`git diff --stat` touches `ai-agents/wiki-vault/` and nothing else.**
7. `/fkit-wiki-lint` is clean, or every finding is listed with a disposition.

## Notes

- **Depends on:** `0232` — hard. The vault page cannot be re-synced against a correction that has not
  landed.
- **Blocks:** nothing.
- **⚠️ Kept SEPARATE from `0238` — a producer judgement, recorded rather than made silently.** The
  owner's ruling said *"alongside `0199`"*, which is about **when to file**, not about merging. Both
  `0238` (the Sprint 2 archival re-sync) and this task are `fkit-wiki` vault writes filed in the same
  batch, so merging them was genuinely on the table. **Decision: two tasks.** The reasoning, in short:
  - **Merging takes the union of two unrelated preconditions.** This task is hard-gated on `0232`
    landing; `0238` is ready today. One merged task would sit blocked behind `0232` while the vault
    goes on calling Sprint 2 the active board — the merge would *delay the readier half*. This is the
    same reasoning `0176` recorded when it declined to merge with `0175`.
  - **Different subjects, different source documents, no shared page.** One re-points board state; the
    other repairs an ADR page's code coordinates. They share the vault and `log.md` and nothing else.
  - **Different verification.** `0238` verifies against board reality; this verifies against a landed
    ADR diff. One task cannot honestly carry both acceptance sets.
  - **The accepted tradeoff:** two `fkit-wiki` sessions instead of one. That cost is real and is the
    reason `0238`'s Notes flag the whole vault cluster — `0199`, `0206`, `0212`, `0238`, this — as
    **batchable in scheduling** even though none of them gates another.
- **Related, not blocking:** `0199` (the same job for ADR-010 — the precedent), `0198` (teaching
  `/fkit-record-decision` the dated-correction-note form).
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
