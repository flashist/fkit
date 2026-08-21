# Repair the hyphenated `task-NN` citation class — the form three consecutive sweeps could not see

## ID
0309

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⭐ Why this task exists — read this first, it is the whole point

Every sweep of the stale pre-ADR-029 task-numeral class was defined on the pattern `\btask [0-9]{1,2}\b`
— **a space between the word and the number.** ⛔ **That pattern cannot match `task-70`.**

So `0306`'s **brief**, its **plan**, and **every measurement taken in it** were blind to the hyphenated
form. ⭐ **And this was the third consecutive sweep with the same blind spot.**

⭐⭐ **The strongest single piece of evidence, and the reason this brief exists:**
[`0184`](../0184-record-depends-on-blocks-as-the-binding-execution-order/brief.md) **appears in no
Shape-2 file list anywhere** — not the original brief's 13, not the build's 14. **It survived three
consecutive sweeps because all three measured the wrong pattern.**

⚠️ **And it is worse than the ledger recorded.** Re-derived on disk 2026-08-15:

```sh
grep -ciE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/0184-*/brief.md   # 0
grep -ciE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/0156-*/brief.md   # 0
grep -ciE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/0037-*/brief.md   # 0
```

⭐ **Three of the four affected briefs carry ZERO bare `task NN` today** — so they are invisible to the
spaced pattern entirely. `0184` and `0156` were **never** in any Shape-2 file list; `0037` was, and
`0306` repaired its spaced numerals, leaving only the hyphenated one. **The only reason `0226` was ever
looked at is that it happened to carry a spaced numeral too.**

⛔ **The lesson is the deliverable as much as the repair is:** a measurement that defines the class by
one syntactic form silently defines away everything else, and reports full coverage while doing it.

### Provenance

**Owner ruling, 2026-08-15**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, and relayed to a spawned producer. **The ruling is a selection from an option
list, so the option label is the verbatim text:**
**"File a brief for the whole hyphenated class (Recommended)"**.

**Parent task:** [`0306`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md),
closed 2026-08-15. **Authority for this residual:** that folder's
[`review.md`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md),
section *Accepted residuals*, row **R5 (string half)** — **as corrected by round-2 finding R8.**

⛔ **Do not scope from `0306`'s `worklog.md` §9.** It records this class as **7 occurrences**; the real
figure is **6**. (Worklog §6's own table lists exactly six rows, and its prose then says seven — ⭐ **the
same "an itemisation that does not sum to its stated total" defect the task was repairing**, reproduced
inside it.) The `review.md` residuals table is the authority.

⚠️ **Unranked, no sprint** — filed by a spawned producer with no owner channel, so this row **appends**
and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### The population, re-derived on disk 2026-08-15

⚠️ **Re-derived firsthand by the filing producer.** **Measurement context:** `HEAD` = `9360177`
(*"Sprint push"*), **dirty working tree** — `0306`'s brief edits are uncommitted, and this class's line
numbers depend on them.

```sh
grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ | wc -l
```

⛔ **The raw count is `14`, and `14` is NOT the defect population.** Of the 14, **8 are text `0306`
itself wrote** — a disclosure blockquote and a dated `## Notes` block in `0226` that **quote the string
in order to explain that it was deliberately left**. ⭐ **Those 8 are correct by construction and must
not be touched**; rewriting them would destroy the record of why the string survived.

**⛔ ONE MORE EXCLUSION, AND IT IS THIS BRIEF'S OWN FAULT.** This brief and its sibling
[`0308`](../0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md) **both live
under `ai-agents/tasks/backlog/` and both quote hyphenated numerals throughout.** ⚠️ **A naïve re-run of
the command above will count them and report a much larger population.** **Exclude the `0308` and `0309`
folders from the measurement**, e.g.:

```sh
grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ \
  --exclude-dir=0308-* --exclude-dir=0309-* | wc -l
```

⭐ **This is the same trap `0306` fell into three times** — the artifacts of a task about a defect class
become instances of that class. **Say in the worklog which exclusions you applied and why.**

⚠️ **MEASURED, NOT PREDICTED — immediately after these three briefs were filed, 2026-08-15:**

| Command | Result |
|---|---|
| `grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ \| wc -l` | **45** |
| the same, `--exclude-dir='0308-*' --exclude-dir='0309-*'` | **14** ✅ |

⭐ **This brief alone contributes 28 of the 31 inflation; `0308` contributes 3; `0307` contributes 0.**
⛔ **So the exclusion is not a precaution — without it the population reads three times its true size.**
⚠️ **`0307` needs no exclusion today**, but check that before relying on it — a later edit could change it.

**The 6 real sites, across 4 open briefs:**

| Brief | Where — **anchor on the quote, not a line number** | Numeral | What it appears to mean |
|---|---|---|---|
| `0226` | `## Context` — *"This is the **task-70** failure mode recurring inside the very checklist that documents `0008`"* | `task-70` | **`0008`**, per `0306`'s dated note |
| `0226` | `## What to build` — *"Keep the **task-70** warning and its "add it HERE FIRST" instruction verbatim."* | `task-70` | **`0008`** |
| `0226` | `## Verification steps` — *"The **task-70** warning block and the "If you add a fifth mirror…" instruction are…"* | `task-70` | **`0008`** |
| `0037` | *"**pre-task-18** `--resume` passthrough. Neither touches `fkit-claude-init.sh`."* | `pre-task-18` | ⛔ **untriaged** |
| `0156` | *"qualifier already pinned by the **task-68** test at :1697."* | `task-68` | ⛔ **untriaged** |
| `0184` | *"A decorated variant is read as *no dependency* (the **task-84** misreport class)"* | `task-84` | ⛔ **untriaged — and see the term-of-art problem below** |

⚠️ **DISAGREEMENT WITH THE LEDGER, reported rather than smoothed over.** `review.md`'s R5/R8 rows cite
the `0226` sites as `0226:41`, `0226:161`, `0226:186`. **On disk today they are at `:41`, `:170` and
`:195`.** The reviewer's figures were correct when written; `0306`'s own disclosure blockquote (7 lines,
inserted at `:45`) shifted everything below it. ⭐ **A concrete instance of exactly the mutable-coordinate
defect `0160` ruled on** — and a reason this brief anchors on quoted text instead. ⛔ **Do not locate
these sites by the ledger's line numbers.**

### ⛔ Three of the six are NOT a simple find-and-replace

1. **`0184`'s `task-84` is a NAMED CLASS, not a citation.** *"the task-84 misreport class"* is a term of
   art used in **at least 9 live places** — `claude/skills/fkit-status/dashboard.sh`,
   `claude/skills/fkit-task-brief/SKILL.md`, `ai-agents/tasks/done/0132-*/brief.md`,
   `ai-agents/sprints/done/sprint-2.md` (archived), `ai-agents/wiki-vault/wiki/tasks/teach-dashboard-to-resolve-notes-dependencies.md`,
   and two `test/fixtures/closed-rank-0174-*.md` files. ⛔ **Renaming it in one brief breaks the name
   everywhere else and repairs nothing.** ⚠️ **Several of those sites are frozen or off-limits** — an
   archived sprint plan, a closed brief, the wiki vault (`fkit-wiki` writes only), and test fixtures
   whose bytes are the test. ⭐ **This site probably needs a note beside it, not a rewrite** — but
   **that is a judgement to make and record, not a conclusion this brief hands you.**
2. **`0037`'s `pre-task-18` is a compound, not a bare citation.** *"pre-task-18"* means *"before the
   task-18-era change"*. ⚠️ `task 18` also appears in `ADR-014` and in `dashboard.sh`'s grammar
   examples. ⛔ **Resolve what it refers to before deciding whether it is even stale.**
3. **`0156`'s `task-68` cites a test.** ⚠️ `task-68` also appears in
   `ADR-040` — **an accepted ADR, and therefore a frozen record.** ⛔ **Do not sweep into it.**

⛔ **`0226:41`'s pointer blockquote is IN SCOPE OF `0306` AND NOT PART OF THIS TASK.** `0306` fixed the
*disclosure distance* — a blockquote now sits immediately beneath the sentence, stating the shared
referent, the deliberate leave, and the ⛔ *"not `0070`"*. The reviewer confirmed that pointer is
correct and **does not belong in this brief**. ⛔ **Do not re-litigate it, and do not remove it.**

⚠️ **`claude/` also carries a hyphenated `task-26`.** It is **outside** this task's population and is
covered by [`0308`](../0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md).
⛔ **Do not touch `claude/` here.**

### Does this wait on `0171`?

**No — and this brief states that as a considered answer, not an omission.**

[`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md) (*the
`durable-citation-anchors` convention page*, **in progress as Sprint 6 P2**) writes down a rule that is
**already ruled**: a task is cited by its folder-name `NNNN` prefix, always — ADR-029 Decision 3,
restated in `0160`'s decision report. ⭐ **`0171` documents that form; it does not decide it.** So the
repair form for these six sites is known today and this task is not gated.

⚠️ **Two riders, and both are real:**

- **If `0171` lands first, read it and follow it** — in particular `0160` §1.1's *"never cite a line
  number naked; pair every `path:NNN` with a quoted fragment"*, which bears directly on `0156`'s
  *"the task-68 test at :1697"*.
- ⭐ **This task should feed `0171`, not just consume it.** The hyphenated form is a citation shape the
  convention page will need to name, and **the fact that three sweeps could not see it is the strongest
  argument for writing the convention at all.** ⚠️ **Surface this to the owner** — whether `0171` should
  pick it up is the owner's call, and this task must not edit `0171`'s brief or its output.

## What to build

1. **Re-derive the population** with the exclusion above, and **state which exclusions you applied.**
   ⛔ **Do not carry this brief's `6` forward unverified** — state your own number, and if it differs,
   **say this brief was wrong.**
2. **Widen the pattern beyond both known forms and report what you find.** ⛔ **The lesson of this task
   is that the pattern was the bug.** Sweep the open briefs for at least: `task_NN`, `taskNN`,
   `Task NN` / `Task-NN` (case), `tasks NN`, and the **line-wrapped** form (`tr '\n' ' ' | tr -s ' '` —
   ⚠️ the squeeze is mandatory, the continuation line's indent survives a bare join). **Report the
   result even if it is zero** — ⛔ **an absence claim must be measured, not assumed.**
3. **Triage each site.** For the three untriaged numerals (`task-18`, `task-68`, `task-84`), resolve
   what each actually refers to **by reading the surrounding context**, and record it. ⛔ **Do not
   resolve by arithmetic.**
4. **For `task-84`, decide and record whether the term-of-art is repaired or annotated**, given the 9
   cross-references and the frozen ones among them. ⛔ **Do not rename it unilaterally across files this
   task does not own.**
5. **Apply the repair** to each site classified as stale, using the folder `NNNN` form. ⚠️ **Where a
   line must stay byte-identical, use a dated correction note beside it** — the form `0306` and `0143`
   established.
6. **Report the after-state** and state the ceiling: what this run did **not** cover.

**⛔ Out of scope:**

- ⛔ `claude/` (that is `0308`), the archived `sprints/done/sprint-2.md`, any closed brief, any accepted
  ADR, `test/fixtures/`, and `ai-agents/wiki-vault/` (**`fkit-wiki` writes only, ADR-005**).
- ⛔ **No `## Status` edit on any task.** No task file moved. No sprint plan edited.
- ⛔ **Nothing under `ai-agents/tasks/done/0306-*/`** — those four files are frozen.
- ⛔ **No `dashboard.sh` change.**

## Verification steps

1. The worklog records the **before** and **after** result of
   `grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ --exclude-dir=0308-* --exclude-dir=0309-*`,
   **and names the exclusions applied.**
2. The worklog carries a **triage table with one row per occurrence found**, and its row count equals
   the before-count. ⛔ A shorter table fails this step.
3. **The widened-pattern sweep (step 2) is recorded with its commands and its result — including a
   stated zero.**
4. **The `0226` pointer blockquote is unchanged.** `git diff` over
   `ai-agents/tasks/backlog/0226-*/brief.md` shows no deletion inside the `📌 **2026-08-15 (`0306`)`
   blockquote, and no change to the dated `## Notes` block.
5. **`task-84`'s disposition is recorded with a reason**, and if it was left, the reason names the
   cross-reference count.
6. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md >/dev/null; echo $?` → `0`,
   and the same for `ai-agents/sprints/backlog.md`; `grep -c '^drift ' ` on both renders is unchanged
   from before the run.
7. `git diff --stat` shows changes **only** under `ai-agents/tasks/backlog/`, and **nothing** under
   `claude/`, `ai-agents/wiki-vault/`, `ai-agents/sprints/`, `ai-agents/tasks/done/` or `test/`.
8. **No `## Status` line changed anywhere:** `git diff -U0 | grep -E '^[-+].*## Status' ` is empty.

## Notes

- **Depends on:** nothing.
- **Relates to:** `0308` (the `claude/` sibling of this class — **read its exclusion note, it applies
  here too**), `0307` (the third `0306` residual), `0171` (the `durable-citation-anchors` convention
  page, in progress — **this task feeds it and is not gated by it**), `0176` (the coordination-citation
  policy guard), `0184` (an affected brief **and** the owner of the `task-84 misreport` name).
- ⚠️ **`0184` is both a repair target and an open task with its own scope.** ⛔ **Repair only the
  citation; do not touch its `## Status`, its declarations, or its re-scoping block.**
- ⚠️ **Figures in this brief were re-derived at `HEAD` = `9360177` on 2026-08-15 against a DIRTY working
  tree.** They are a dated observation, not a permanent fact. **Re-derive before acting.**
- ⛔ **Do not commit, push, `git add` or `git stash`** unless the owner explicitly asks.
