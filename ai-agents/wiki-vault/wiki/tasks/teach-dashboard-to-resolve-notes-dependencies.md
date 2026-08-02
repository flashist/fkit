# Make a task's dependency visible to `dashboard.sh` when it's written in `## Notes` prose

**Source**: `ai-agents/tasks/done/0107-teach-dashboard-to-resolve-notes-dependencies/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0107 · priority 89 · owner `fkit-coder`

## Goal

Close a silent misreport: a dependency the record *states* but the tool *cannot see* is a dependency the board silently drops — and the board's contract maps "none recorded" to **`ready`**, i.e. a false *"nothing blocks this."*

## Key Changes

**The fixture is a real, repeated failure.** Task 84 ([[tasks/wiki-resync-eighth-role-after-source-docs-land]], ID 0092) wrote its dependency as:

```
- **⚠️ Depends on tasks 82, 83 and 81 Part D — …**
```

The `⚠️ ` sits between the `**` and the label, so the parser's bold anchor missed it, the script emitted `none recorded`, and the board rendered **`ready`**. The producer hand-corrected the cell for **seven consecutive status runs**. A less careful reader would have shipped the false `ready`.

The fix landed as **both** a convention and a guard, recorded in the new `knowledge-base/conventions/dependency-declaration-form.md`:

- **The canonical form.** Dependencies live in `## Notes`, as a bullet whose bold label is flush against the `**` with nothing before it — `- **Depends on:** …`. `nothing` is a valid, explicit value. A brief with no dependency line at all still resolves to `ready`.
- **The guard.** The parser no longer fails *silently*. A line whose `Depends on` label is preceded only by markup/decoration now renders a LOUD `⟨derive: UNPARSEABLE — see brief⟩` plus a `drift depends-unparseable` fact, **instead of a fabricated `ready`**. It is scoped so ordinary ASCII prose that merely *mentions* dependencies, and code-span mentions, do not trip it.

**The guard is not prose-proof, and says so.** A declaration-shaped line with a non-Latin-script prefix, or one inside a blockquote or table, can still trip it — an accepted residual, because the failure direction is safe (a loud flag, never a fabricated `ready`). **The guard is a safety net, not a licence:** the fix for a LOUD row is to rewrite the dependency canonically, not to leave the guard firing.

Prior art the convention cites: the dashboard's own design review established that locating a dependency in arbitrary free text is unreliable, and that the grammar was an *unenforced emergent convention of one author*. This makes it enforced.

## Outcome

**Done, agent-closed.** The convention doc is live, and `dashboard.sh` renders parsed derivations per row.

⚠️ **Known dual-home gap, recorded at the source:** `dependency-declaration-form.md` is **missing from `claude/scaffold/`**, so consuming projects inherit the task-84 misreport class — the subject of a separate reconciliation task.

✅ **Dated correction 2026-08-02 — the gap is CLOSED, but not by byte-alignment.** The sentence above is left byte-identical as the record of what was true when this page shipped. [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] (task `0132`) shipped the convention into `claude/scaffold/ai-agents/knowledge-base/conventions/` on 2026-08-01, so consuming projects now receive it. ⚠️ **The scaffold copy is deliberately NOT byte-identical to the live one** — the owner ruled 2026-08-01 that it ships **GENERALIZED**, and `0132`'s own verification step demanding byte-identity is **superseded by that ruling, not met, and must stay that way**. *"Fixing" it by copying the live file over the scaffold copy re-introduces the regression. Separately, the convention is now indexed in `conventions/README.md`, closing a second gap flagged by the 2026-08-01 sync.*

## Related
- [[tasks/wiki-resync-eighth-role-after-source-docs-land]] — task 84, the acceptance fixture
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] · [[tasks/design-deterministic-dashboard-for-fkit-status]] — the dashboard's origin and the R19/R40 prior art
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — same class of bug: state the record holds that no board tool reads
- [[tasks/render-owner-column-in-fkit-status]]
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the missing scaffold copy
- [[tasks/record-one-skill-one-output-convention]] · [[systems/knowledge-base-structure]]
- [[systems/fkit]] — fkit
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` — the merit-ordering ruling; **the task that became its own proof case**
