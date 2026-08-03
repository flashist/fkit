# Narrow the architect's `## Output format` `path:line` mandate — it currently mandates the banned form

## ID
0172

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### The defect

`claude/agents/fkit-architect.md` is injected as the architect's system prompt in every architect
session and every architect consult. Its `## Output format` section opens with this bullet, quoted
verbatim and re-read firsthand 2026-08-01:

> - Architecture docs / specs: structured markdown with `path:line` citations and ASCII or mermaid
>   diagrams where they clarify structure.

Task `0160`'s ruling — [the 2026-08-01 durable-citation report](../../../knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md),
§1's table — rules `path:NNN` **wrong, categorically**, when the target is a **coordination document**
others append to (`ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md`). The bullet
above draws no such line, so **fkit's own architect prompt currently instructs the architect to
produce the form its own ruling bans.**

`0160`'s brief flagged this as a hard constraint on the ruling — *"must reconcile
`fkit-architect.md`'s `## Output format`, which actively mandates `path:line`"*. The report did the
reconciling; this task does the edit. **This is follow-up 2 of report §8.**

### The verdict the report reached, in its own words

Report §1.2, *"Reconciling `claude/agents/fkit-architect.md`'s `## Output format`"*:

> **Verdict: it narrows. It does not stand unchanged, and it does not go.**
>
> - It **stays** for code, tests, and files under `claude/` — the targets the reader diffs.
> - It **narrows** to exclude citations into coordination documents (`ai-agents/sprints/*.md`, task
>   briefs, `ai-agents/wiki-vault/log.md`).
> - It **gains** the §1.1 rider: pair the number with a quote.

The report states explicitly: *"I did not edit `claude/agents/fkit-architect.md`."*

### Why all three clauses matter, and none may be dropped

- **Delete the bullet and you lose a correct rule.** §1's table row 1 rules `path:NNN` **correct** for
  a source file, test, skill or agent file cited in a design doc or a finding — *"edits arrive as a
  reviewed diff to the thing you cited"*. Removing the mandate would suppress the citation style the
  report positively endorses.
- **Leave it unchanged and the architect keeps generating the defect.** The coordination-document row
  is the one §1's R22 scope note calls **categorical** — third parties append **above** your line, so
  the coordinate moves *whatever your intent was*.
- **Narrow without the rider and drifted pointers stay invisible.** §1.1: *"Never cite a line number
  naked. Pair every `path:NNN` with a quoted fragment or the heading it sits under."* The report calls
  this *"the single highest-value recommendation"* and notes it applies to all four cases at once.

## What to build

**One edit, one file, one section.** Rewrite the `## Output format` first bullet in
`claude/agents/fkit-architect.md` so it carries all three clauses of the §1.2 verdict:

1. `path:line` **stays** for code, tests, and files under `claude/` — the targets a reader diffs.
2. It **excludes** coordination documents — `ai-agents/sprints/*.md`, task briefs,
   `ai-agents/wiki-vault/log.md`. Anchor those by heading, quoted phrase, or task folder ID instead.
3. It **carries the rider** — pair a line number with a quoted fragment or the heading it sits under.

**Point the bullet at the convention page** (`conventions/durable-citation-anchors.md`, task `0171`)
rather than restating the whole rule inline. The bullet is a prompt line in a budget-constrained
system prompt; the page is the law. Keep the edit short.

**The wording is not prescribed here.** Weigh it and state your choice — a mechanical find-and-replace
that swaps one absolute for another would reproduce the defect in a fresher tense, exactly as task
`0170` warns for its own sentence.

### Out of scope — stated so it is not discovered late

- **⛔ Do not add a guard.** No test in the repo reads any agent-file content, and tasks `0136` /
  `0152` / `0154` own the `SKILL.md` walk. Prose-only, unenforced, by design.
- **⛔ No scaffold copy to mirror.** `claude/scaffold/` holds no agents tree — verified 2026-08-01,
  `grep -rn 'Architecture docs / specs' claude/scaffold/` returns nothing. This file is fkit-only.
- **⛔ Do not write `:NNN` line-number citations** into this brief's own artifacts, the board, or the
  edit's commit surface. That is `0160` Case 2 surface, and this task of all tasks must not violate it.
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. `claude/agents/fkit-architect.md`'s `## Output format` first bullet no longer mandates `path:line`
   without qualification. Read it and check it against §1.2's three clauses one by one.
2. The bullet names the coordination-document exclusion — `ai-agents/sprints/*.md`, task briefs,
   `ai-agents/wiki-vault/log.md` — or points at `conventions/durable-citation-anchors.md`, which does.
3. The bullet carries the pair-with-a-quote rider, or points at the page that does.
4. The bullet still endorses `path:line` for code, tests and `claude/` files. **A bullet that bans the
   form outright has failed this task**, not passed it.
5. `git diff --stat` shows exactly one file changed: `claude/agents/fkit-architect.md`. No file under
   `ai-agents/tasks/`, `ai-agents/sprints/` or `ai-agents/wiki-vault/`.
6. `npm test` passes (the correct command per `package.json`, which also runs `test/prove-red.sh` —
   **not** a bare `node --test test/`).

## Notes

- **Depends on:** 0171 (the convention page this bullet points at). Report §8 records follow-up 2 as
  depending on follow-up 1. **Hard** — a pointer to a page that does not exist is the defect class
  this whole arc is about.
- **Blocks:** nothing.
- **⚠️ Adjacent site found at filing, deliberately NOT folded in and NOT silently fixed.** The same
  file's `## Behavioral rules` section carries *"**Evidence first, cited.** Ground every claim in a
  `path:line` reference or an explicit owner answer."* That is a **broader** mandate than the one §1.2
  rules on, and on its face it reaches coordination documents too. **Report §1.2 rules on the
  `## Output format` bullet only and says nothing about this one.** Do not edit it under this brief's
  authority. Either the owner/architect rules it in, or it is a separate task. Raised, not fixed.
- **Nine further `path:line` mandates exist across `claude/skills/`** — in `fkit-survey-project`,
  `fkit-design-spec`, `fkit-evaluate-approach`, `fkit-inspect`, and `fkit-record-decision` (grep run
  2026-08-01). **Most are safe under §1's table row 1**, because they direct citation *into code*,
  which the report rules **correct**. They are recorded here so nobody re-discovers them mid-edit and
  widens the sweep. **Out of scope.**
- **Rank 151 is APPEND rank, not merit rank**, assigned under `/fkit-task-brief` step 5 by a spawned
  producer with no owner channel. **Flagged for owner confirmation.** On merit it belongs directly
  below `0171`, which it depends on — **so merit and append positions coincide** and confirming the
  append costs nothing. No existing row was renumbered by this brief.
