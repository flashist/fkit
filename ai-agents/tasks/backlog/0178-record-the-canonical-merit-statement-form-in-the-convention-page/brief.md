# Record the canonical merit-statement form in the convention page

## ID
0178

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**This is follow-up 1 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§8), and it is the one the next two follow-ups cite.

Report §3.1 **ruled IN** — by name, against six weighed alternatives — that an owner records an
ordering intent the board's rank column can no longer carry as a **relative, non-numeric merit
statement in the task's own brief**. Two shapes, and only two:

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

The properties are not decoration; each was chosen against a named failure (report §3.1):

- **Relative, never absolute.** *"immediately above `0154`"*, never *"belongs at 122"*. A relative
  statement survives every re-rank; an absolute one is stale the moment anything above it moves.
- **Folder ID only, never a `P<n>` rank token.** Writing `0154 (P129)` reintroduces exactly the defect
  tasks `0157` and `0159` were spent sweeping out of the corpus.
- **Advisory. Board rank still binds execution.** The merit statement records intent; it does not
  redirect a reader picking up the next task.
- **`as ranked` is required, not optional.** A brief with no merit line is indistinguishable from a
  brief whose author forgot. The explicit no-op is what makes absence detectable — and it is what makes
  task `0180`'s guard possible at all.

**The practice already exists and its form is wrong.** Measured live 2026-08-01 18:32 MSK, the phrase
`On merit` appears in 15 briefs, in at least four incompatible shapes, and one of them — `0158`'s —
reproduces the stale-rank defect *inside* the practice: *"On merit this belongs at 122 — immediately
below 0142 (P121)"*, an absolute board rank paired with a folder-ID-plus-rank citation, both already
stale.

### Where it goes, and the conflict to know about before starting

Report §8 names
[`conventions/priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
as the home: it already states *"A sprint board's Priority cell is board rank … A task's identity is
its task-folder name's `NNNN` prefix, and nothing else"*, and the merit form is that rule applied to
the one place it was not yet binding.

**⚠️ The page is dual-homed and both copies must move together** — `ai-agents/knowledge-base/
conventions/priority-is-rank-not-identity.md` and `claude/scaffold/ai-agents/knowledge-base/
conventions/priority-is-rank-not-identity.md`, per
[`conventions/dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md). Verified
at filing: **both copies exist today**, so this is a genuine two-file edit, not a create-the-missing-one
job.

**⚠️ Conflict to surface, not plan around.** The driver relaying the owner's *"file all eight"* ruling
named `dependency-declaration-form.md` (or *"a sibling convention page"*) as the home instead. That page
is **not** in the scaffold copy today — it is one of the drift items task `0132` exists to reconcile —
so choosing it would mean either shipping a single-homed page or absorbing part of `0132`. **The report
is the source and names `priority-is-rank-not-identity.md`; this brief follows the report.** Flagged for
owner confirmation.

## What to build

A documentation change only. No code, no test, no skill edit.

1. Add a section to `priority-is-rank-not-identity.md` recording the **canonical merit-statement
   grammar**: the two shapes above, the folder-ID-only rule, the relative-not-absolute rule, the
   advisory-not-binding property, and `as ranked` as the **explicit default** so absence is always a
   defect rather than a shrug.
2. State the division of labour the report's §3.7 table records, because the grammar is unreadable
   without it:

   | Carrier | Carries | Binding? |
   |---|---|---|
   | Board rank `P<n>` | reading order — what to pick up next | yes, for picking work |
   | `On merit` statement | the owner's preference the rank cannot express | **no — advisory** |
   | `Depends on` / `Blocks` | correctness order — what must land first | **yes, and it outranks reading order** |

3. Apply the identical edit to the `claude/scaffold/` copy so the two are byte-aligned.
4. Cite [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
   and report §3.1 as the authority.

### Out of scope

- **⛔ Do not amend `/fkit-task-brief` step 5.** That is task `0179`, and it cites this page.
- **⛔ Do not build the guard.** That is task `0180`.
- **⛔ Do not backfill any existing brief.** The corpus sweep is task `0180`'s blocking decision.
- **⛔ Do not re-rank anything.**
- **⛔ Write no `:NNN` line-number citations** into a coordination document. Anchor by heading and
  quoted phrase.
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` contains both canonical
   shapes, verbatim, in a fenced block.
2. It states the folder-ID-only rule and forbids a `P<n>` token inside a merit statement, in words a
   test author can turn into a condition.
3. It states `as ranked` as the required explicit default, and says why (absence must be detectable).
4. `diff` between the live page and the `claude/scaffold/` copy is empty.
5. `npm test` passes — no test asserts on this page today, so this step is proving no regression, not
   proving the change.
6. `grep` for `\.md:[0-9]` over both changed files returns nothing.

## Notes

- **Depends on:** nothing.
- **Blocks:** `0179`, `0180`.
- **⚠️ Priority 156 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately above `0132` — it is the grammar every subsequent brief filing depends on,
  so every day it is unshipped, more briefs are filed in a shape that will have to be reshaped. Its
  append rank sits at the bottom of the board, 24 open rows below its merit position.
- **Merit form used here.** This brief's merit statement uses the **canonical `**On merit:**` shape**
  ruled in by report §3.1 and recorded in ADR-035, not the legacy `**On merit this belongs …**`
  sentence `/fkit-task-brief` step 5 still mandates. The ruling is signed and the ADR is accepted; task
  `0179` lands the wording in the skill. **Flagged so it is not read as drift.**
- **Owner.** Report §8 records this as *"`fkit-architect` to write; `fkit-producer` to file"* — filing
  is done here, so `## Owner` is `fkit-architect`. **The driver's relay said `fkit-coder` instead;
  flagged for owner confirmation.**
- No existing row was renumbered by this brief.
