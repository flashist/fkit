# Re-anchor the review-skill line cites that `0385` moved, in four open briefs and the `0273` board row

## ID
0517

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**Why this task exists.** Closed task
[`0385`](../../done/0385-give-the-codex-adversarial-prompt-a-task-keyed-path/brief.md) inserted text
into `claude/skills/fkit-review/SKILL.md` and `claude/skills/fkit-stateful-review/SKILL.md`. Every line
below each insertion moved. Open briefs that cite those two files by line number now point at the
wrong lines. 0385's `worklog.md`, section *"Flagged, not edited"*, names them: *"open briefs `0273` and
`0287` cite line numbers in the changed run lines"*, plus `0138` and `0169`, plus *"The Backlog
board's rows for 0273/0287"*.

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session running the Sprint 12
sprint loop, relayed to a spawned producer). Question: *"0385 follow-ups (stale line refs in 4 briefs;
old prompt path in architecture.md and ADRs 016/042): what now?"* — chosen option, verbatim label:
**"Brief them for the backlog (Recommended)"**, described as *"A producer writes backlog briefs;
nothing is fixed now. Knock-on: none."* This brief is the line-cite half. The prompt-path half is
[`0518`](../0518-update-the-old-codex-prompt-path-in-architecture-md-adr-016-and-adr-042/brief.md).

**⚠️ Most of these cites were already stale before 0385.** Measured 2026-10-16 against `HEAD`
`6227119` (before 0385's edits): `0273`'s `fkit-review/SKILL.md:61` run-line cite was already `:62`, and
its `fkit-stateful-review/SKILL.md:95` cite was already `:109`. 0385 made it worse in `fkit-review`
(the run line is now `:83`). So this task re-measures **every** cite these briefs make into the two
files, not only the ones 0385 moved.

### The cites, as measured 2026-10-16 (working tree, 0385's edits present)

Re-measure all of this at pickup. Locate by content, never by these numbers.

| Brief | Cites | Meant | Where it is today |
|---|---|---|---|
| `0273` | `fkit-review/SKILL.md:61`, `fkit-stateful-review/SKILL.md:95` (the call-site list) | the `codex exec --sandbox read-only` run line | `fkit-review` `:83`, under *"Step 1 — Run two independent reviewers (degrade gracefully)"*; `fkit-stateful-review` `:109`, under *"Step 1 — Run two independent reviewers"* |
| `0273` | `fkit-review/SKILL.md:57`, `:38,57`, `:128-135` | a dated 2026-08-11 measurement of `architecture.md`'s cites, and the refuted fence | likely **frozen dated records** — see the legend; the `:128-135` fence belongs to `0365`, not here |
| `0287` | `fkit-review/SKILL.md:61`, `fkit-stateful-review/SKILL.md:95` (its re-derived site list) | the same two run lines | as for `0273` |
| `0138` | `fkit-review/SKILL.md:91`; `fkit-stateful-review/SKILL.md:113,123` | the `INCORRECT (disproven)` verdict sites | `fkit-review` `:192` (*"Step 3 — Verify each finding against the code"*); `fkit-stateful-review` `:153` (*"Step 3 — Verify each novel finding against the code"*); second stateful site to be re-derived |
| `0169` | `fkit-stateful-review/SKILL.md:156` (*"set `Status: closed-out` when warranted"*) | the close step | `:205`, under *"Step 6 — Dispositions (the owner's call)"* |
| `0169` | `fkit-stateful-review/SKILL.md:49` (*"Status: in-review \| closed-out"*) | the ledger schema line | `:54` (above 0385's insertion; stale for an older reason) |
| Backlog board, `0273`'s row | `fkit-review/SKILL.md:38,57`, `:61`; `fkit-stateful-review/SKILL.md:95` | as for `0273` | as for `0273` |
| Backlog board, `0287`'s row | — | — | **no cite into either file found** on 2026-10-16 (its line cites point at wiki pages and `architecture.md`). Expected verdict: nothing to fix. Re-check |

## What to build

For each cite into `claude/skills/fkit-review/SKILL.md` or `claude/skills/fkit-stateful-review/SKILL.md`
in the six places above, log one verdict line in `worklog.md` with the before and after text:

- **fixed** — a live pointer a later reader will follow. Repair it in place (*"A coordinate already
  known to be wrong is repaired, not annotated"* — `durable-citation-anchors.md`, *"Never cite a line
  number naked"*). Pair the number with a quoted fragment or the heading.
- **already correct** — say so.
- **frozen record, left as is** — a dated measurement (*"Measured 2026-08-11 …"*) is a claim about the
  revision its author read. Leave it.
- **out of scope, owned by `<task>`** — e.g. the `:128-135` fence, which `0365` owns.

**Before starting, re-grep** the open briefs and the live boards for `fkit-review/SKILL.md:` and
`fkit-stateful-review/SKILL.md:` (use `/usr/bin/grep`, not the shell wrapper; see the wiki's
*testing-and-verification* gotcha on the grep wrapper). Log any hit not named above. Fix it only if it
is the same kind (a live pointer into one of these two files that has drifted).

**Fix the cite, never the prose.** No other wording changes.

**Board rows.** The `0273` row is an open row. The plan picks one form — in-place repair, or a dated
note appended inside the same cell (the form `0399` uses) — states it, and uses it for every board
edit. No `|` character inside a cell. ⛔ Closed rows (`✅ Done`, `⛔ Cancelled`, `➡️ Moved`) are never
edited — `0385`'s own `➡️ Moved` row is out of scope.

**Out of scope:** the two SKILL.md files themselves; any closed task folder; any cite into another file;
`0273`'s sandbox deliverable; the `0365` fence; `ai-agents/wiki-vault/` (wiki writes are `fkit-wiki`'s
only); any status, priority, rank or `Depends on` change.

## Verification steps

1. `worklog.md` has one verdict line per cite (the six places above plus any re-grep hit), with before
   and after text.
2. For each **fixed** cite: open the target file and confirm the cited line holds the quoted fragment.
   Re-measured on the day, not copied from this brief.
3. No fixed cite is a naked number: each carries a quoted fragment or a heading.
4. `git diff --stat` lists only the briefs and board named above, plus this task's folder.
5. `node --test test/coordination-citation-policy.test.js test/reference-integrity.test.js` passes;
   state the counts.
6. `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` shows no new `drift`
   line for any task touched.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Coordinates with, not a dependency:**
  [`0365`](../0365-correct-the-refuted-is-correct-do-not-fix-it-fence-claim-in-0273s-open-brief/brief.md)
  and [`0399`](../0399-repair-the-stale-claims-0393-reported-in-open-briefs-and-board-rows/brief.md)
  also edit `0273`'s brief (and `0399` its board row). If either has landed, work on top of it. If
  [`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md) or
  `0287` has closed first, its folder is closed and out of scope; log it as moot.
- **Related:** [`0394`](../0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md)
  (a guard for a sibling citation class). This is one more hand sweep.
- **Owner note.** `## Owner` is `fkit-coder`: the deliverable names no producing skill, so ADR-044
  Decision 1's skill-less clause staffs the coder. Precedent `0365` carried `fkit-producer`; raise it at
  the plan gate if it matters.
- **Provenance:** 0385's `worklog.md`, section *"Flagged, not edited"*. Cites re-measured by the
  producer 2026-10-16.
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by the `fkit-lead` driver. It edited no existing brief, changed no other task's
  status, priority or location, wrote nothing under `ai-agents/wiki-vault/`, and committed nothing.
