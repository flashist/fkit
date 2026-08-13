# State the per-project re-launch step `fkit update` requires — README's "Staying current"

## ID
0253

## Sprint
Sprint 5

## Priority
Sprint 5 P14

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**`fkit update` updates the install share. It does not update any project.** A project's
`.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/` are refreshed by
`claude/fkit-claude-init.sh:479-490` — an `rm -f` / `rm -rf` of the fkit-managed names followed by a
`cp` from the share — and **that code runs only on launch**. Verified 2026-08-08.

**The README never says so.** `README.md:31-33` ("Staying current") tells the reader to run
`fkit update` and stops there. A reader who updates and does not re-launch `fkit` in a given project
keeps that project's **old agents and skills**, with **no diagnostic of any kind**: the update check
compares the share against the remote and is satisfied, and the launch notice that would report
divergence cannot help — the launch *is* the event that refreshes them.

**Scope note — this task states the step; it does not build a detector.** The structural gap behind
the missing signal (nothing checks `.claude/` conformance at all) is
[`0255`](../0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md), which is a
decision task, not an implementation one. This brief is a docs fix that is correct and useful
whatever `0255` decides.

## What to build

A minimal edit to `README.md`'s "Staying current" paragraph — nothing else in the file.

1. **Add the follow-up step** after the `fkit update` sentence: updating fkit updates the installed
   copy; **each project picks the new agents and skills up the next time `fkit` is launched in it**,
   because that launch is what refreshes `.claude/`.
2. **Name the failure it prevents, in one clause** — a project updated but never re-launched keeps
   its old agents and skills, and **nothing reports it**. Say it plainly; do not soften it to "may be
   out of date".
3. **Keep the existing sentences intact**, including the source-checkout carve-out (*"A checkout of
   this repo is never auto-checked — update it with `git`"*) and the `FKIT_NO_UPDATE_CHECK=1` note.

### ⛔ Out of scope

- ⛔ Any file other than `README.md`.
- ⛔ Any behavior change — no launcher, init, or install edit; no new warning, notice, or check.
- ⛔ Rewriting the "Staying current" paragraph or the structure-divergence paragraph that follows it.
  This is an addition, not a rework.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005).
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. `git diff --stat` shows exactly one file changed: `README.md`.
2. The "Staying current" paragraph now contains both the re-launch instruction **and** the stated
   consequence of skipping it.
3. `grep -n "FKIT_NO_UPDATE_CHECK=1" README.md` and
   `grep -n "update it with .git." README.md` both still return their hits — the pre-existing
   sentences survived.
4. The claim written is re-verified against disk before writing:
   `grep -n 'rm -f "$dest/.claude/agents/fkit-"' claude/fkit-claude-init.sh` resolves, and the
   surrounding block is still launch-time only (no other caller).
5. `npm test` is green (docs-only; no suite should move).

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- Related: [`0255`](../0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md)
  is the decision task for the *detector* this README line is the manual substitute for; and
  [`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md)
  is the maintainer-side release-hygiene record. Neither is a hard dependency in either direction.
- Verified 2026-08-08: `README.md:31-33`; `claude/fkit-claude-init.sh:479-490`.
- Filed to the **Backlog** board — no sprint named; no re-rank (ADR-035).

- **⚠️ CARRY CORRECTION, 2026-08-10 — THE CLOSING LINE ABOVE IS NOW FALSE.** *"Filed to the
  **Backlog** board — no sprint named; no re-rank (ADR-035)"* is left **byte-identical**; it was true
  when this brief was filed on **2026-08-08**, and was falsified when the brief was **carried onto
  Sprint 5** by owner ruling of **2026-08-10** (verbatim option label **"Dashboard + all of
  0252-0258"**). The header fields moved in that same act and are the authority:
  **`## Sprint: Sprint 5`**, **`## Priority: Sprint 5 P14`**. **Plan this work against
  [`sprint-5.md`](../../../sprints/sprint-5.md), not the Backlog board.**
  ⚠️ **No drift check fires on this, and none will:** `dashboard.sh` reads the `## Priority`
  **field**, not brief prose, so the machine cannot see a stale closing line — only a reader working
  bottom-up can. Task
  [`0235`](../../backlog/0235-cross-check-a-briefs-status-field-against-its-own-prose/brief.md) covers this
  class generally and is **neither widened nor closed** by this note.
