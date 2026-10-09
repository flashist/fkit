## 0495 — Make every sprint-placement question state which tasks would then wait on that sprint

**Approval note.** The brief says: "Do not start without the owner's specific word." **The owner approving this plan is that word.** It also counts as the owner's sign-off on a *new convention*, which the conventions index requires ("a new convention … needs the owner's sign-off").

**Goal.** Any question to the owner whose options put a task in a sprint, or change a `Depends on:` link, must say in each option which open tasks would then wait on which sprint. This includes the recommended option and options a worker returns in a `NEEDS-DECISION`. The change is wording only: no tool, and no change to any test's behaviour.

### 1. Where questions get asked: every place found

I searched `claude/` for every place that has a role put a choice to the owner (`AskUserQuestion`, `NEEDS-DECISION`, `(Rec)`, placement, re-point, depends on).

**Included: 6 files that get a pointer**

| File | Why it is a home | Where the pointer goes |
|---|---|---|
| `claude/agents/fkit-lead.md` | Holds the owner channel and passes on every worker's `NEEDS-DECISION` as an `AskUserQuestion`. This is exactly where the original incident happened. | The "Hold the owner channel" bullet |
| `claude/agents/fkit-producer.md` | Files and places briefs, edits `Depends on:` lines, asks the owner in a session, and returns questions when spawned. | The behavioural rule "Flag dependencies and conflicts proactively" |
| `claude/agents/fkit-coder.md` | As a spawned worker it returns `NEEDS-DECISION` options, for example to split off a follow-up into a sprint. In a session it asks with `AskUserQuestion`. | Output format §3, the "End by interviewing the owner" bullets (the "In a session" and "In a spawned consult" bullets) |
| `claude/skills/fkit-task-brief/SKILL.md` | Placement questions come up at step 1 (named sprint missing: stop and ask), step 3 (flag dependencies) and step 5 (the "flagged for owner confirmation" check on placement). | One pointer in step 3's "Flag dependencies and conflicts" bullet, covering steps 1 and 5 by name |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | §3 "Relay every decision live": the driver turns worker `NEEDS-DECISION` options into `AskUserQuestion` options. The envelope is prose in the worker's spawn prompt, so the requirement must travel in that prompt. | §3, after the envelope and in step 1 of the relay steps |
| `claude/skills/fkit-task-ship-loop/SKILL.md` | Its owner-contact contract ("important questions") can include placing a follow-up task or a cancel or re-scope. | §"STOP for the owner", one line after the list |

**Considered and excluded, with reasons**

- `fkit-sprint-done` and `fkit-sprint-cancelled`: they move open rows automatically under ADR-047 and ask no placement question. Their only "ask" is "which sprint plan to close".
- `fkit-task-cancelled`, step 6: it *reports* the affected tasks and asks no question.
- `fkit-status`: it is read-only. Beat 6 *lists* decisions rather than asking them. The producer who then asks is covered by `fkit-producer.md`. It is also `0492`'s file, being edited in parallel (see Overlap).
- The architect, reviewer and wiki agents: they don't place tasks or edit `Depends on:` (the producer owns briefs). Their generic "you may use AskUserQuestion" line needs no change.
- `fkit-open-questions-interview`: it re-asks questions already built elsewhere and does not compose placement options.
- `fkit-heal`: not about placement.
- The marker and turn-completion hooks: code, out of scope.
- **The shared rules block (`claude/scaffold/universal-rules.md`):** rejected for budget. Measured with the test's own method, the block is 3,906 of 4,352 B, leaving 446 B. The owner's standing target (ruling recorded in task 0130) is at least 400 B free, so only about 46 B are usable, and a pointer sentence is about 90 B.

### 2. The single home: a new convention, the same file in both homes

**New file:** `placement-questions-state-the-knock-on.md`, in both
- `ai-agents/knowledge-base/conventions/`
- `claude/scaffold/ai-agents/knowledge-base/conventions/`

The two copies are **byte-identical**: an fkit-authored file per `dual-home-parity.md`, so no exceptions-module entry is needed. Precedent: `durable-citation-anchors.md` (task 0171), which needed the same four extra files.

**Why a new file rather than amending `dependency-declaration-form.md`.** That convention is about how the `Depends on:` line in a brief must be *written* so `dashboard.sh` can read it. This rule is about how an owner *question* is built. Mixing the two hides the rule from people building questions. The README's "prefer amending" bar points the other way, which is why this is open question Q1.

**Links.** The file links only to sibling conventions (`dependency-declaration-form.md`, `evidence-before-assertion.md`), so every link works in both homes. It cites the ruling and task by name only; scaffold `decisions/` and `reports/` ship empty, so a link there would dangle in consuming projects. It never names the consuming project.

**Draft content** (wording finalised at build; substance as follows):

```
# A placement question names its knock-on

> **Before the owner picks an option that puts a task in a sprint or re-points a dependency, the
> option says which open tasks would then wait, and on which sprint.** Form:
> *"`<task>` and N tasks behind it would then wait on Sprint M."* When nothing depends on the task,
> say nothing extra.
>
> Owner ruling, 2026-10-05 — "Say the knock-on in questions" (task 0495).

## Why
(Generic incident.) An owner approved the option marked "(Recommended)". It filed a verify task into
the next sprint and re-pointed a current-sprint task at it. The question never said that this task
and five behind it would then wait on the next sprint. Several sprints can be in progress at once and
open rows carry forward, so this is not a hard lock. But the owner could not weigh a cost nobody
showed him.

## Which options it covers
- An option that puts a task in a sprint or on the Backlog board: filing, pulling in, moving, carrying
  forward, de-scoping.
- An option that adds, removes or re-points a `Depends on:` link (dependency-declaration-form.md).
- Not an option that does neither, including an "explain more, then ask again" option.

## What to say, for each option
- Name each open task that would depend on the placed task once the option is applied (directly: its
  `Depends on:` names it). Count the open tasks behind each one. Name the sprint they would then wait
  on, or "the Backlog board".
- Put it in the option's own description, not only in the explanation above the question. Each option
  states its own; they differ, and that is the point.
- "Open" means not Done, not Cancelled, not Moved.
- (Scope across sprints: set by the owner's Q2 answer.)

## How to find them
- Search open briefs' `Depends on:` lines for the task's ID, then repeat for each hit until there are
  none. Count each task once. The check must be made this turn (evidence-before-assertion.md).
- A `Depends on:` line you cannot read: say so in the option ("knock-on not fully checked: <task>'s
  `Depends on:` line is unreadable"). A count you did not check is not zero.

## Every asker, every channel
- In a session: in the `AskUserQuestion` option's description.
- A spawned worker: writes it into its `NEEDS-DECISION` options (and into any open question it returns
  in prose). The worker has the files.
- A relayer (the lead, or the sprint-loop driver): carries it unchanged. If a placement option lacks
  it, the relayer adds it from the briefs before asking, and says the relayer added it. Never relay a
  placement option without it.
- The recommended option, "(Recommended)" or "(Rec)", states its knock-on like the others. It is the
  option most likely to be taken without reading the rest, so the mark never excuses it.

## With other question rules
- An explanation given first may mention the knock-on; it still goes in the option.
- If the asker's rules add an "explain more, then ask again" option: that option carries no knock-on,
  and on the re-ask every option keeps its knock-on.
- The knock-on lives in descriptions, so it never uses up one of the four option slots.

## Where it is enforced
Prose only, as pointers in the fkit-lead, fkit-producer and fkit-coder agent prompts and in
/fkit-task-brief, /fkit-sprint-ship-loop and /fkit-task-ship-loop. Nothing checks a question's text
mechanically. Said plainly, not implied.
```

**Pointer wording** (one sentence per home, adjusted per file; paths `../../ai-agents/…` from agents, `../../../ai-agents/…` from skills, the same depths as the existing links):

> **A placement or dependency question names its knock-on.** Every option that puts a task in a sprint (or on the Backlog board) or re-points a `Depends on:` link says which open tasks would then wait on which sprint. This applies to the recommended option too, and to a `NEEDS-DECISION` as much as to an `AskUserQuestion`: [`conventions/placement-questions-state-the-knock-on.md`](…).

Per-file additions:
- **Lead and sprint loop §3:** "Relaying a worker's options: check each placement option carries it; add any that is missing before you ask." The sprint loop also adds: "and say so in each worker's spawn prompt, beside the envelope."
- **Coder:** the sentence sits under the §3 interview bullets, so it covers both the session and the spawned case.

### 3. Supporting edits that come with a new shipped convention

- **Both `conventions/README.md` copies:** add a "What's here" index row.
  - Live copy footnote: "Three of them … byte-identical" becomes "Four", adding the new file.
  - Scaffold copy: "Nine conventions ship with the scaffold" becomes "Ten".
- **`claude/structure-spec.md`:** add a Table B row (`fkit-authored reference file | convention`). In the conventions section, "the ten files … plus nine conventions" becomes "eleven … ten". Without this, `test/structure-spec.test.js` B (file-set equality) goes red.
- **`claude/structure-manifest.tsv`:** regenerate with `npm run generate:manifest`, run in the live tree because the generator reads `git log`.
  - **Expected diff: exactly 2 added lines** (the new convention path, and a new hash for the scaffold `conventions/README.md`), 0 removed.
  - Any other line changing means a concurrent edit to some other shipped file. In that case **stop and report** instead of keeping it.
- **`CHANGELOG.md`:** one line under `## Unreleased`. The file already has other tasks' uncommitted edits; I append only.

### 4. Order of work (Build step)

0. **Snapshot.** Copy the 13 target files into the scratchpad and record each file's sha256. Before writing each one, re-check its hash. If it changed since the snapshot (a parallel coder), stop and report.
1. Write the live convention, then `cp` it to the scaffold and `cmp` the two.
2. Update both READMEs.
3. Update `structure-spec.md`.
4. Add the six pointers. **All go below every line-number reference into those files** that I found in live `claude/`: `fkit-coder.md:28` and `:165` (cited from the task loop), and `fkit-task-ship-loop/SKILL.md:8` (cited from the sprint loop). My insertions are at fkit-coder ~line 286+, task loop ~237, sprint loop ~312+, so no live reference shifts. Re-grep afterwards to confirm.
5. Add the CHANGELOG line.
6. Regenerate the manifest and check the +2/−0 diff.
7. Verify (below), and write `worklog.md` in the task folder.

### 5. Verification

- **Brief V1/V4 (diff review):** `diff -u <snapshot> <current>` for each target, **not `git diff`**, because the tree holds other tasks' uncommitted edits. Confirm the diffs are prose only, plus the generated manifest lines.
- **Brief V2 (grep):** `grep -l 'placement-questions-state-the-knock-on'` over the 6 home files must return 6 of 6.
- **Brief V3:** the convention contains the example form "`<task>` and N tasks behind it would then wait on Sprint M", the `NEEDS-DECISION` case, and the "(Recommended)" case (grep each).
- `cmp` the two convention copies.
- **Brief V5 and CONTRIBUTING.md "What to run for a change":** this change touches `claude/scaffold/`, `structure-manifest.tsv`, and two files `test/prove-red.sh` names (`structure-spec.md`, `skills/fkit-sprint-ship-loop/SKILL.md`). The heaviest row applies, so **full `npm test` (~12 min)**.
  - **Run in a scratch copy:** `rsync -a` of the repo including `.git` (the manifest test reads `git log`; there are no devDeps) into the scratchpad.
  - This also covers the brief's `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js`, which I will also run and report explicitly, and `rules-block-budget` (the only size-budget test; the block itself is untouched). Also covered: `dual-home-parity`, `structure-spec`, `structure-manifest`, `plan-review-switch` (my text adds no plan-review wording to the task loop) and `spawned-write-marker` (the blocks it extracts from fkit-coder, lead and sprint loop are untouched).
  - **If anything fails:** re-run that test on a scratch copy of the pre-edit snapshot. That tells my failures apart from other in-flight tasks' failures. Report both.
- **No new test** (brief V4: no change to test behaviour). Not mechanically checked: whether agents actually follow the prose. That is an accepted limit, stated in the convention.

### 6. Overlap (no dependency, flagged)

- **`0494`:** same files (`fkit-task-brief/SKILL.md`, `fkit-producer.md`). Its warning question ("move dependents / place earlier / accept") is itself a placement question, so 0494's plan should point to this convention. Whichever lands second merges the text by hand.
- **`0493`:** same file, `fkit-sprint-ship-loop/SKILL.md`, but step 1 and the stop table; I edit §3.
- **`0492`:** its new beat-6 decision in `fkit-status` offers placement choices. I make no edit there; 0492's planner may add a pointer. 0492's drift record could later serve as the source for "how to find them", but I don't refer to it ahead of time.
- **`0496`:** line-reference fixes in `fkit-coder.md` and both loops. My insertions sit below the cited lines (§4 step 4).
- **`0453` / `0457`** (ADR-052 phase 5): not started.
- **Uncommitted edits already in the tree** on 7 of my target files (coder, lead, producer, both loops, manifest, CHANGELOG): handled by the snapshot and hash re-check.

### 7. Risks and edge cases

- A parallel regeneration of the manifest. A second regeneration resolves it mechanically; the +2/−0 check catches an unexpected line.
- The "(Rec)" and "(Recommended)" spellings both exist; the convention names both.
- Counting tasks that depend on tasks that depend on the placed task, with a loop or a non-canonical line. The convention says to count each task once, and an unreadable line must be said, never counted as nothing.
- A relayer adding a missing knock-on could get it wrong. It must say it added it, so the owner knows who checked.
- A consuming project without the owner's "explain more" rule: that part of the convention is conditional.

### 8. Not done

No commit or push. No wiki write: there is a wiki gap on cross-sprint dependencies and question rules, for `fkit-wiki` after this ships. No ADR: the owner ruling plus the convention is enough, unless the architect or owner wants one.
