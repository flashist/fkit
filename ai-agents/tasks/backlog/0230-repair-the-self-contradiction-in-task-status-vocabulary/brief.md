# Repair the self-contradiction in `task-status-vocabulary.md` — one rule says never by hand, another says do the same by hand

## ID
0230

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ✅ RULED by the owner — 2026-08-06, `AskUserQuestion`, live `fkit lead` session

Selected answer, **verbatim**: **"File a task to fix it"** — and the owner ruled explicitly that this is
**NOT** folded into task `0229` (the mover widening). It is its own shippable unit.

### The defect

`ai-agents/knowledge-base/conventions/task-status-vocabulary.md` states two rules that contradict each
other on the same subject. Both verified present on disk 2026-08-06:

| Where | What it says |
|---|---|
| Under **`## The authority split — this is the point`** | `Done` and `Cancelled` *"may only be set by the `/fkit-task-done` and `/fkit-task-cancelled` skills — **never by hand-editing a file**"* |
| Under **`## Rules`** | *"**The brief and the sprint plan must agree.** Both carry the status; both get updated together. The mover skills already do this — **do the same by hand.**"* |

### Why this matters, stated without overstating it

**No behaviour is wrong today.** The specific rule wins: the authority-split rule names `Done` and
`Cancelled` explicitly and calls the gate *enforced, not asked*, and the ADR-018 `PreToolUse` hook backs
it at runtime. The `## Rules` line is best read as scoped to the **free** statuses — `🔄 In progress` and
`🚧 Blocked — <reason>` — which any session may set by hand, and which genuinely do need the brief and
the board kept in step by hand.

**But this is the exact document an agent consults before deciding whether it may write a status.** An
agent that lands on the `## Rules` line first, and reads it in isolation, gets the **wrong answer** — it
concludes it may hand-write a `✅ Done` into a brief to make it agree with a board. The document's job is
to be unambiguous at the point of decision, and here it is not.

Severity: **latent, not active.** Nothing observed has acted on the wrong reading. The fix is to remove
the ambiguity before something does.

## What to build

Edit `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` so the `## Rules` bullet cannot be
read as licence to hand-write a gated status.

1. **Scope the `## Rules` bullet explicitly to the free statuses.** It must name which statuses it covers
   (`🔄 In progress`, `🚧 Blocked — <reason>`) rather than leaving "the status" unqualified.
2. **Carry the exclusion in the same bullet, not in a distant section.** A reader who lands on this bullet
   alone must learn from that bullet that `✅ Done` and `⛔ Cancelled` are **not** hand-set, and be pointed
   at `## The authority split — this is the point`. Cross-document coherence that requires reading two
   sections is what failed here.
3. **Do not weaken the authority-split rule.** It is correct as written and is the one the runtime hook
   enforces. This task changes the **`## Rules`** bullet; the authority-split section stays intact.
4. **Resolve what the `## Rules` bullet should now say about gated statuses agreeing.** The underlying
   fact is still true — brief and board must agree for `Done`/`Cancelled` too — but the mechanism is *run
   the mover*, not *edit by hand*. Say that, rather than deleting the requirement.
5. **⚠️ Verify the coordinates yourself; do not inherit them.** The two claims were at lines 33 and 66 on
   2026-08-06, but this brief deliberately cites them by **heading plus quoted phrase** per the
   durable-citation decision (task `0160`, closed). Locate them by searching the quoted text. **Do not
   introduce naked `:NNN` citations** into the repaired document.

## Verification steps

1. `grep -n 'do the same by hand' ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — the
   unqualified phrasing is gone, or is now unambiguously scoped to the free statuses.
2. The `## Rules` bullet names the free statuses it applies to, and names `✅ Done` / `⛔ Cancelled` as
   excluded, **within that bullet**.
3. `grep -n 'never by hand-editing a file' ai-agents/knowledge-base/conventions/task-status-vocabulary.md`
   still hits — the authority-split rule is unchanged. Confirm by diff that the section is byte-identical.
4. **The isolation test — this is the real acceptance check.** Read the repaired `## Rules` bullet with the
   rest of the document covered. It must be impossible to conclude from that bullet alone that a `✅ Done`
   may be hand-written. State the conclusion a reader reaches.
5. The requirement that brief and board agree for gated statuses is still stated somewhere — the fix must
   not delete a true rule while removing an ambiguous one.
6. No naked `:NNN` line citations were added to the document.
7. `node --test test/*.test.js` is green. ⚠️ **This proves no regression, not the change** — this is a
   prose convention document and no test reads its body.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing. This document edit is independent of `0229` — the owner ruled the two are
  separate tasks, and neither blocks the other.
- **Blocks:** nothing.
- **Owner ruling of record:** 2026-08-06, `AskUserQuestion`, live `fkit lead` session — *"File a task to
  fix it"*, explicitly **not** folded into `0229`.
- **Found by** a spawned producer during the same session that produced `0229` and `0231`.
- **⚠️ Do not "fix" this by making the authority-split rule softer.** The contradiction resolves in the
  authority split's favour; the `## Rules` bullet is the side that is wrong-as-written. Reversing that
  would relax a gate the runtime hook enforces.
- **Sibling briefs filed the same day:** `0229` and `0231`.
- No commit — leave the edit in the working tree.
