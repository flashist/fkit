# Pressing Enter at the role menu should open the lead

**Source**: `ai-agents/tasks/done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified** *(but see the owner's real-terminal acceptance below)*
**Sprint/Tag**: Sprint 6 `P8` · ID 0302 · owner `fkit-coder` · shipped 2026-08-21

## Goal

Owner request, 2026-08-14, made from using the menu. Pressing **Enter** at the `fkit` role prompt did nothing — the loop re-prompted. Make it open the **lead**, which is menu option 1 and the orchestrating front door.

## Key Changes

**One file, two edits — `claude/fkit-claude.sh`.** Re-anchored on quoted text rather than line numbers, because the tree moved after the owner's commit.

1. **The prompt** now reads `role [1-7, Enter=lead, q to quit]:` — it was `role [1-7, q to quit]:`.
2. **The empty-input `case` arm** flips from `"") : ;;` (a no-op) to `"") role="lead" ;;`, with a comment recording both the reason and the fence.

⭐ **This does NOT invent a default.** The headless fall-through below it (`[ -n "$role" ] || role="lead"`) has **always** opened the lead for a no-arg, no-tty run; the change makes the **interactive** path agree with the **headless** one.

⛔ **EMPTY ONLY.** The `*)` arm stays a usage error, because *"empty means lead"* must not widen into *"anything unmatched means lead"* — the `fkit --resume` bug that [[tasks/remove-fkit-resume-passthrough]] removed.

**Nothing else changed:** no test added, no prove-red mutation, no `architecture.md` edit, no manifest regeneration, no commit.

### The baseline was cited, not assumed

`HEAD = 7832cba`, CI **green** on it — and worth citing, because the *immediately preceding* push run was a **failure**. ⚠️ **Green was not a safe default to assume here.**

## Outcome

**Shipped 2026-08-21**, agent-closed, over two review rounds. Round 1: 5 documentation defects, **no behavioural defect found by either reviewer**. Round 2 was a **disposition pass by owner ruling** — ⚠️ **no new Codex pass was run, and none was owed.**

✅ **The owner ran `fkit` in their own terminal on 2026-08-21 and confirmed it** — verbatim option label **"Opened the lead — works"**. ⚠️ **Attribution matters: the acceptance is the owner's real terminal. Every pty run in the record is EVIDENCE, not acceptance** — those ran under a `script`-allocated pty in a headless spawn, and the plan is explicit that these are different things.

### ⛔ Ships with NO automated coverage of the interactive menu

The `""` arm's runtime behaviour is exercised by **no test**. `npm test` is green, but `launcher-contract` tests 7 and 3 pin the **headless** default, **not the menu**. The alternative — a task-local pty test plus a matching prove-red mutation — was designed and **declined by owner ruling**: it would have **falsified a line in `architecture.md` this task may not edit**, and imported a `sleep`-timing race duplicating `0145`'s surface. ✅ **The obligation is discharged in writing onto `0145`**, verified on disk (it now owes an `Enter` row in its assertion table).

**Accepted residuals — owner-ruled 2026-08-21, do not re-litigate:**

- **Ctrl-D and Enter differ.** Enter opens the lead; `Ctrl-D` (EOF) still exits 0 and opens nothing. **They are different events, not different renderings of one event** — making EOF open a session would open one on every broken pipe and every closed harness. *Re-raise only if a user reports Ctrl-D being read as Enter on a real terminal.*
- **A NUL-only line opens the lead.** `read` cannot carry NUL into a shell variable, so `$pick` is empty before `case` runs and **no shell-level fence can distinguish the two**. The outcome is the cheapest, most reversible session in the product.
- **Whitespace-only input still errors** (`IFS=` preserves the space) — unchanged behaviour, not re-tested.

**Other residuals:**

- **`plan.md`'s blob hash was checked by no hook** — the carry-check hook does not exist until `0204` lands. The plan was taken as given from the driver's prompt.
  > ⚠️ **Dated note 2026-08-29 (lint) — `0204` has since landed** ([[tasks/build-the-pretooluse-task-carry-check-hook-and-its-tests]], 2026-08-26). ⛔ **Nothing about this task's record changes** — it is a dated statement about its own run, and the hook did not exist then. ⚠️ **And it would not have covered this run anyway:** the hook is registered in `.fkit/settings/<role>.json`, which is regenerated per launch, so **no session gets it until its next `fkit <role>` launch** — and even a green check is a **proxy**, never proof the marker held.
- ⚠️ **`test/` carries 25 stale `task 43` numerals** (`-i`; 23 case-sensitive) across 5 files, **16 of them in frozen replay fixtures that must never be edited**. Reported, not repaired — `0306`'s out-of-scope residue. ⚠️ **The inventory was wrong twice before it was right** — round 1 corrected the anchors, round 2 corrected the **totals**, and *"no figure here is quotable without its command"* is the lesson recorded in its place.

## Related
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — `0139`, which made lead menu option 1 and named the silent mis-pick cost
- [[tasks/fix-headless-menu-guard-crash]] — the headless/no-tty branch this change brings the interactive path into agreement with
- [[tasks/remove-fkit-resume-passthrough]] — the widening bug the `*)` fence exists to avoid repeating
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — why the lead is the right default
- [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] — `0306`, whose out-of-scope `task 43` residue this task re-measured
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — `P8`
- [[systems/install-and-self-update]] — the launcher and its menu
- [[systems/fkit]] — the seven roles and the menu that picks between them
