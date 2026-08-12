# Give `/fkit-sprint-ship-loop` an executable path for an empty `$ARGUMENTS`

## ID
0277

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-08-12**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"Yes — spawn a producer to file both (Recommended)"**.

It discharges a **conditional acceptance**. Residual **AR3** of
[`0267`](../../done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/review.md)
was accepted on the express condition that this be filed — its own re-raise trigger reads *"if it is
not carried into a filed follow-up task"*. An earlier owner ruling of 2026-08-12 had already settled
the shape, verbatim label **"File it as a new task later (Recommended)"**. `0267`'s reviewer closeout
checked the backlog and recorded the obligation as **NOT satisfied**. This row discharges it.

### The gap

`0267` changed the loop's argument gloss from *"the active `sprint-*.md`"* — a mechanism that no
longer exists after ADR-041 — to *"the active sprint, as `/fkit-status` resolves it"*. That change
was **correct and required**; ADR-041 §5 (*one grammar, one implementation*) forbids the loop
restating the resolution rule.

But it leaves the driver **pointing at a rule rather than able to run one**. The two carrying sites,
measured 2026-08-12:

| Site | Text |
|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:44-46` (the `**Argument:**` gloss) | *"empty = the active sprint, as `/fkit-status` resolves it — see `fkit-status/SKILL.md`'s empty-argument rule. **Do not re-derive that rule here** (ADR-041 §5…)"* |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:93-94` (step 1, first bullet) | *"Read the sprint plan (`$ARGUMENTS`, or the active sprint as `/fkit-status` resolves it) and the briefs it links."* |

**Neither gives the driver a command to run.** `/fkit-status`'s own empty-argument rule *does* — it
carries the call and the full contract for reading its answer
(`claude/skills/fkit-status/SKILL.md:30-58`). The loop has the pointer and not the call.

### The fix, and the constraint it must respect

Give the loop **the same call** `/fkit-status` carries:

```sh
bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
```

⚠️ **This is a BEHAVIOR CHANGE — a new step — and that is why it is its own row.** It was explicitly
**out of scope** for `0267`, whose brief carried a ⛔ *"do not change any skill's behavior"*
constraint, and it was classified a **frontier-move** and deferred for exactly that reason. It is
in-scope **here**, on the ruling above.

⛔ **ADR-041 §5 still binds.** The loop **obtains** the identity **from `dashboard.sh`**. It must
**never restate** the token grammar, the delimiters, the letter-suffix bound, or any filename
allowlist. *"Two implementations of one question"* is the defect §5 exists to prevent — adding a
second one while fixing this would be a worse outcome than the gap.

### Facts about `select-active` the change must honor — established by `0266`'s review

These are **not** re-derivable from a casual reading and are already documented in
`claude/skills/fkit-status/SKILL.md`:

- **`active none` exits `3`, and exit 3 is a normal answer, not a failure.** The correct response is
  to say there is no eligible sprint plan, list every `candidate` line with its identity, and
  **stop**. ⛔ **Never fall back to the `Backlog` board. Never guess.**
- **A real failure exits `1`** and prints no `⟦SELECT⟧` block at all.
- **`active file="…"` is a BASENAME, not a path.** It must be joined to the `ai-agents/sprints`
  directory passed in before being handed to the next step.
- `candidate file="…" identity="…"` lines report everything looked at, `unresolved` included; a
  `Backlog` identity is never eligible and `unresolved` is never eligible.
- `drift ambiguous-active-sprint …` means two plans claim one identity; the script has already
  chosen, and the driver's job is to **report** it — the chosen file and every other claimant.
- `bash <path>`, **never** `./dashboard.sh`.

## What to build

A **prose change to one skill file**: `claude/skills/fkit-sprint-ship-loop/SKILL.md`.

1. **Give step 1 an executable resolution path for the empty-`$ARGUMENTS` case** — the
   `dashboard.sh select-active ai-agents/sprints` call, placed so the driver runs it **before** the
   existing `dashboard.sh <plan>` board read, since that read needs the plan path this call produces.
2. **Handle every documented outcome**, not just the happy one: `active file=…` (join the basename to
   the directory), `active none` / exit 3 (report and stop, no `Backlog` fallback), exit 1 (a real
   failure — say so, do not guess), `drift ambiguous-active-sprint` (report the chosen file and every
   other claimant).
3. **Keep the ADR-041 §5 pointer intact.** The `**Argument:**` gloss's *"Do not re-derive that rule
   here"* and its §5 citation **stay**. Adding the call is not permission to delete the constraint
   that made the pointer necessary — the loop now **runs** `dashboard.sh` rather than **re-deriving**
   what `dashboard.sh` knows, which is what §5 asks for.
4. **Do not duplicate `/fkit-status`'s full contract prose.** Carry the call and the outcome handling
   the driver actually needs; keep pointing at `fkit-status/SKILL.md` for the rest.
5. **Correct step 1's existing board-read path from `claude/` to `.claude/`** (line `98` as measured
   2026-08-12). **Folded into this task by owner ruling 2026-08-12** — see the in-scope section
   above for the ruling, its verbatim label, and the measurements. Both of step 1's `dashboard.sh`
   invocations — the one this task adds and the one already there — must land on the `.claude/`
   form.

### ✅ IN SCOPE — the `claude/` → `.claude/` path defect on step 1's existing board read

⚠️ **AMENDED 2026-08-12.** This section was filed as *"ADJACENT DEFECT — surfaced at filing, and
deliberately NOT scoped in"*, carrying a ⛔ that forbade fixing it. **That ⛔ is withdrawn by owner
ruling and the defect is now in scope.**

**Owner ruling 2026-08-12**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"Fold :97 into 0277 (Recommended)."** The reasoning as ruled: this task **already touches step 1's
argument handling**, so fixing both path forms in one act avoids shipping a file that carries
`claude/` and `.claude/` on adjacent lines.

⚠️ **The ruling's label reads `:97`; the defect is on line `98`.** Re-measured 2026-08-12 *after* the
ruling: line `97` is the opening ``` fence, line `98` is the command. The ruling's subject is the
**command**, and the label above is quoted verbatim as ruled rather than silently corrected. **The
durable anchor is the quoted text, not the number.**

`claude/skills/fkit-sprint-ship-loop/SKILL.md:98` (step 1's existing board read) reads:

```
bash claude/skills/fkit-status/dashboard.sh <plan>
```

**`claude/`, with no leading dot.** Re-measured 2026-08-12 against the tree:

- `claude/fkit-claude-init.sh:481-488` installs skills to **`.claude/skills/`** in a consuming
  project (`mkdir -p "$dest/.claude/skills"`, then `cp -R "$here/skills/fkit-"*`).
- `dashboard.sh`'s own header comment (`claude/skills/fkit-status/dashboard.sh:4-5`) states
  **`⚠️ INVOKE AS: bash .claude/skills/fkit-status/dashboard.sh <path-to-sprint-plan>`**.
- Every other call site in the repo uses the `.claude/` form — e.g.
  `claude/skills/fkit-status/SKILL.md:29` and `:210`.

**In a consuming project `claude/` does not exist, so that command cannot run** — it works in this
repo only because this repo is also fkit's source tree.

- ✅ **Correct line `98` to the `.claude/` form.** In scope, on the ruling above.
- ✅ **The NEW call this task adds MUST also use the `.claude/` form.**
- ✅ **This is the ONLY such site in this file.** Swept 2026-08-12: `grep -n "claude/"` over
  `claude/skills/fkit-sprint-ship-loop/SKILL.md` returns **exactly one line — `98`**. There is no
  second bare-`claude/` invocation hiding elsewhere in it. ⚠️ **Re-sweep at implementation time**
  rather than trusting this count.
- ⛔ **Other files are OUT of scope.** The ruling folded in *this file's* defect because this task
  already edits step 1. Bare `claude/` paths elsewhere in the repo, if any exist, are a separate row
  — **report, do not fix**.
- ⛔ **Change the path form on line `98` and nothing else on it.** `bash <path>`, never
  `./dashboard.sh`; the `<plan>` argument, the fence, and the surrounding bullet all stay.

### Constraints

- ⛔ **No `dashboard.sh` change of any kind.** The script already does everything needed; this task
  teaches the loop to call it.
- ⛔ **No `claude/skills/fkit-status/SKILL.md` change.** That file is the one implementation of the
  empty-argument rule (`0266`'s landed work). If it looks wrong, **stop and report**.
- ⛔ **Never restate the sprint-identity grammar** — no token list, no delimiter rule, no
  letter-suffix bound, no filename pattern (ADR-041 §5).
- ⛔ **No `Backlog`-board fallback** on `active none`, in any branch.
- ⛔ **Do not weaken or delete the plan-gate honesty clause** (`SKILL.md:53-71`) or any hard rule while
  editing this file.
- ⛔ No task-file move (ADR-033), no re-rank, no board-row edit beyond this task's own close.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit. ⛔ No new devDependency (ADR-014).
- ⚠️ **Line numbers here are dated anchors of convenience, measured 2026-08-12.** The durable anchors
  are the quoted text. **Re-measure at implementation time.**

## Verification steps

1. **The landed step 1 carries a runnable command.** Quote it. ⛔ If the empty-`$ARGUMENTS` case still
   resolves only by pointing at another skill's rule, the task has not been done as briefed — that
   executable path is the entire deliverable.
2. **Run the call against this repo and paste the raw output** —
   `bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints`. Show the `active`
   line, the `candidate` lines, and the exit code.
3. **The three exit paths are each covered by the landed prose**, quoted one at a time: `active file=`
   (exit 0), `active none` (exit **3**, a normal answer — report and stop), and a real failure
   (exit **1**). ⛔ **A single sentence covering "if it fails" does not satisfy this step.**
4. **The basename join is explicit.** Show the landed text says `file=` is a basename and must be
   joined to the `ai-agents/sprints` directory before use. ⚠️ This is the failure `0266`'s review
   caught; a step that passes `file=` straight through is wrong.
5. **`drift ambiguous-active-sprint` is handled** — the driver reports the chosen plan **and** every
   other claimant. Quote it.
6. **ADR-041 §5 is not breached.** Show the diff introduces **no** restatement of the token grammar,
   delimiters, suffix bound, or a filename allowlist, and that the existing *"Do not re-derive that
   rule here"* pointer and §5 citation survive. ⛔ **Assert this from the diff, not from intent.**
7. **BOTH of step 1's `dashboard.sh` calls use the `.claude/` form** — the new one **and** the
   corrected pre-existing board read. Quote both landed lines, then show
   `grep -n "claude/" claude/skills/fkit-sprint-ship-loop/SKILL.md` and confirm **every hit is the
   `.claude/` form, with no bare `claude/` invocation left**. ⛔ Step 1 must **not** ship two
   different path forms on adjacent lines — removing that split is what the 2026-08-12 ruling folded
   into this row. ⚠️ If the sweep finds a bare `claude/` site this brief did not anticipate,
   **report it, do not quietly widen** beyond this file.
8. **`git diff --stat` touches only `claude/skills/fkit-sprint-ship-loop/SKILL.md`** (plus this task's
   own artifacts and board row). ⛔ `dashboard.sh` and `fkit-status/SKILL.md` must be untouched — show
   it.
9. **Full `npm test` green; state the measured counts.** ⚠️ Then say plainly **what it proves and what
   it does not**: check whether any test reads this skill's content, and if none does, say so rather
   than implying coverage.
10. **A real end-to-end check, or an honest statement that none was run.** The strongest evidence is a
    driver actually resolving the active sprint through the new path. If that was not exercised, ⛔
    **do not let it pass silently** — state it as a coverage gap in the close.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** residual **AR3** of
  [`0267`](../../done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/review.md)
  (§"Accepted residuals", `review.md:136-148`), accepted 2026-08-12 **conditional on this filing**.
  Filed 2026-08-12 on the owner's ruling of the same day. `0267`'s reviewer closeout
  (`review.md:235-245`) recorded the obligation as unsatisfied at close; this row discharges it.
- **⚠️ THIS IS A BEHAVIOR CHANGE, and that framing matters to the close.** `0267` was a prose-accuracy
  task with a hard ⛔ no-behavior-change constraint; this row exists **because** the fix crosses that
  line. ⛔ Do not describe this as a documentation cleanup.
- **Independent of [`0276`](../0276-correct-the-unresolved-plan-sprint-drift-mechanism-claim-in-adr-041-and-its-echoes/brief.md)**,
  the sibling residual filed the same day. **No shared file, no ordering, either order is safe** —
  `0276` edits ADR-041 and `fkit-task-brief/SKILL.md`; this edits `fkit-sprint-ship-loop/SKILL.md`.
  Recorded so nobody invents a dependency edge between two rows filed together.
- **⚠️ One live-tree hazard:** `/fkit-sprint-ship-loop` is a skill an active driver session **is
  running**. Editing it mid-run does not change a session already loaded, but a **later** invocation
  picks up the new text. **Do not land this while a sprint run is mid-flight** if the run's remaining
  behavior would be affected.
- **On merit:** the **Backlog**, unranked, and that is honest. Nothing waits on it — the loop works
  today when handed an explicit plan path, and every recent run has been. It touches no shipped
  runtime code and is not on the release path. Sprint 5 is mid-flight with its ranks owner-set on
  2026-08-11; appending there would land it below every open row.
- **Blast radius if never done:** a driver invoked with no argument has no procedure of its own and
  must improvise — which is the *"loop observed guessing an active sprint rather than resolving
  one"* half of AR3's re-raise trigger.
- Filed 2026-08-12 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, edited no skill line, moved no task file, touched no sprint plan,
  and committed nothing.

- **⚠️ AMENDED 2026-08-12 — SCOPE GREW, on owner ruling.** Verbatim label:
  **"Fold :97 into 0277 (Recommended)."** The `claude/` → `.claude/` path defect on step 1's
  existing board read was filed **report-only, behind a ⛔**; it is now **in scope**. The ⛔ was
  inverted, `## What to build` gained item **5**, and verification step **7** was rewritten from
  *"report it unchanged, and say step 1 carries two forms"* to *"both calls land on `.claude/`, and
  no bare `claude/` invocation survives"*. Full ruling, reasoning, and the re-measurement are in
  `## Context` § *"✅ IN SCOPE — the `claude/` → `.claude/` path defect…"*.
  - ⚠️ **The ruling's label says `:97`, the line is `98`** — `97` is the fence. The label is quoted
    as ruled; the correction is recorded beside it, never inside it.
  - ✅ **Defect re-verified against the tree before this amendment was written**, not taken from the
    filing note: install target `claude/fkit-claude-init.sh:481-488`, the script's own
    `⚠️ INVOKE AS` header at `claude/skills/fkit-status/dashboard.sh:4-5`, and a full-file sweep
    finding **exactly one** bare-`claude/` site.
  - ⛔ **Nothing else moved.** `## Status` stays `🔲 Backlog`, `## Sprint` stays `Backlog`,
    `## Priority` stays `Unscheduled`, `Depends on` / `Blocks` stay `nothing`. Amended by a spawned
    `fkit-producer` with no owner channel; no task file moved, no sprint plan touched, no commit.
