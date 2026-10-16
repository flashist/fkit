# Update the old fixed Codex prompt path in `architecture.md`, ADR-016 and ADR-042

## ID
0518

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**Why this task exists.** Closed task
[`0385`](../../done/0385-give-the-codex-adversarial-prompt-a-task-keyed-path/brief.md) replaced the one
fixed, shared Codex prompt file `.fkit/tmp/adversarial-prompt.md` with a per-run name,
`.fkit/tmp/<key>-<run-id>-adversarial-prompt.md` (and `<key>-r<N>-<run-id>-…` in the stateful review).
Three architect-owned documents still describe the old fixed path. 0385's `worklog.md`, section
*"Flagged, not edited"*: *"Stale, owner = architect: `ai-agents/knowledge-base/architecture.md` (the
review procedure and Codex run descriptions), ADR-016 and ADR-042 (record what was true at decision
time)."*

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session running the Sprint 12
sprint loop, relayed to a spawned producer). Question: *"0385 follow-ups (stale line refs in 4 briefs;
old prompt path in architecture.md and ADRs 016/042): what now?"* — chosen option, verbatim label:
**"Brief them for the backlog (Recommended)"**, described as *"A producer writes backlog briefs;
nothing is fixed now. Knock-on: none."* This brief is the prompt-path half. The line-cite half is
[`0517`](../0517-re-anchor-the-review-skill-line-cites-0385-moved-in-four-open-briefs/brief.md).

### The sites, as measured 2026-10-16

Re-measure at pickup; locate by content.

| File | Where | Text |
|---|---|---|
| `ai-agents/knowledge-base/architecture.md` | §6 *"Data model — everything is a file in git"*, the *"Generated, gitignored, per project"* paragraph | *"`.fkit/tmp/adversarial-prompt.md` (the Codex prompt)"* |
| `ai-agents/knowledge-base/architecture.md` | §7 *"Key flows"*, flow *"4 — Review + the adversarial pass"* | *"assembles a findings-only prompt plus an inline diff into `.fkit/tmp/adversarial-prompt.md` and pipes it to"* |
| ADR-016 | *"The two live delivery holes"*, item 1 | *"builds its own prompt into `.fkit/tmp/adversarial-prompt.md` and runs `codex exec …`"* |
| ADR-042 | *"Finding 1 — the Codex reviewer has never been able to execute anything"*, the fenced command | *"`codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md`"* |

## What to build

1. **`architecture.md`** — a living document: correct both sites in place to the per-run naming, as the
   skills now state it (read `claude/skills/fkit-review/SKILL.md` Step 1 and
   `claude/skills/fkit-stateful-review/SKILL.md` Step 1 for the exact form; do not copy it from this
   brief). Change the path text only.
   - ⚠️ **Found while scoping, same sentence:** flow 4 also cites
     `claude/skills/fkit-review/SKILL.md:38,57` for the run line, which is now at `:83` (measured
     2026-10-16). Fixing that cite in the same edit is allowed; the plan may drop it with a reason.
     Pair any number with a quoted fragment.
2. **ADR-016 and ADR-042** — records of what was true at decision time. **Additions only:** the original
   text stays byte-identical. Append one dated amendment note to each (the form in
   `/fkit-record-decision`'s *"Correcting an accepted ADR"* section), saying the fixed path was replaced
   by per-run names in `0385` and where the current form lives. If the plan judges a note unneeded for
   one ADR, it says why in the worklog; "not considered" is not an outcome.
3. **Re-grep before closing** (`/usr/bin/grep`, not the shell wrapper) for `adversarial-prompt.md`
   outside `claude/`, closed task folders and `ai-agents/wiki-vault/`. Log each hit with a verdict.
   Expected: `reports/2026-07-14-shared-instructions-layer.md` is a dated report — **frozen record, left
   as is**.

**Out of scope:** any file under `claude/`; any closed task folder; the `--sandbox` wording (that is
[`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md));
`ai-agents/wiki-vault/`.

**Wiki follow-up — mention, never write.** Two vault pages carry the old path:
`wiki/systems/review-and-model-diversity.md` (the run description) and `wiki/systems/fkit.md` (the
*"Generated and gitignored per project"* list). They are stale now, whether or not this task runs.
After this task lands, ask `fkit-wiki` to sync them. This task writes nothing under
`ai-agents/wiki-vault/`.

## Verification steps

1. `/usr/bin/grep -n 'adversarial-prompt' ai-agents/knowledge-base/architecture.md` shows only the
   per-run form.
2. ADR-016 and ADR-042: `git diff --numstat` shows **0 removed lines** on each.
3. Each new ADR note is dated, names `0385`, and points to the current form by heading or quoted
   fragment (no naked line number).
4. `worklog.md` has one verdict line per site in the table and per re-grep hit.
5. `git diff --stat` lists only `architecture.md`, the two ADRs, and this task's folder.
6. `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` passes;
   state the counts.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Coordinates with, not a dependency:** `0273` rewrites the `--sandbox` token in the same
  `architecture.md` flow-4 sentence and quotes ADR-042. Whichever lands second works on top of the
  other.
- **Owner note.** `## Owner` is `fkit-architect` (these are architect-owned documents, as 0385's
  worklog says). Under ADR-044 Decision 1 a deliverable that names no producing skill is staffed to the
  coder whatever `## Owner` says; the driver decides at pickup.
- **Provenance:** 0385's `worklog.md`, section *"Flagged, not edited"*. Sites re-measured by the
  producer 2026-10-16.
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by the `fkit-lead` driver. It edited no existing brief, changed no other task's
  status, priority or location, wrote nothing under `ai-agents/wiki-vault/`, and committed nothing.
