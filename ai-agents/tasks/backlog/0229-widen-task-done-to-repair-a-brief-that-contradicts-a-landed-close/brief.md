# Widen `/fkit-task-done` to repair a brief whose `## Status` contradicts a landed close

## ID
0229

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

The owner was asked what to do about tasks **0021** and **0041**, whose briefs read `🔲 Backlog` while
their folders sit in `ai-agents/tasks/done/` and `sprint-1.md` reads `✅ Done`. Selected answer,
**verbatim**: **"Repair the mover first, then run it"**. This brief is that repair.

### The defect — verified on disk 2026-08-06, not inherited

There is **no legitimate mechanism** to correct 0021 and 0041 today. Both doors are shut:

| Door | Why it is shut |
|---|---|
| `/fkit-task-done` | Step 1 (*"Stop with a clear message if…"*) stops when the folder *"is already in `ai-agents/tasks/done/` (nothing to do — say so)"*. Its **one exception** — the owner-verification upgrade — requires the brief's `## Status` to already read `✅ Done (agent-closed — not owner-verified)`. Both briefs read `🔲 Backlog`, so the exception does not fire and **the skill stops for the owner too**. |
| Hand-editing | Barred by `task-status-vocabulary.md`, under *"The authority split — this is the point"*: `Done` and `Cancelled` *"may only be set by the `/fkit-task-done` and `/fkit-task-cancelled` skills — **never by hand-editing a file**"*. |

**The sharp detail worth carrying into the fix:** the skill *already contains* the branch that would do
the right thing. Step 6's status-header logic says *"**Reads anything else** (`🔲 Backlog`, `🔄 In
progress`, `🚧 Blocked — …`, etc.)? Replace it with `✅ Done`."* — exactly this case. **Step 1 stops the
run before step 6 is ever reached.** So the repair logic is present and unreachable; this is a gating
defect, not a missing capability.

> **⚠️ DATED CORRECTION 2026-08-06 — the finding above REPRODUCES, but it names the wrong step.**
> Re-verified first-hand against `claude/skills/fkit-task-done/SKILL.md` on 2026-08-06 by a spawned
> producer. Paragraph above left byte-identical.
>
> - **What holds.** The `Reads anything else …? Replace it with ✅ Done` branch **exists**, and it **is
>   unreachable** for this case: step 1's stop fires on *"it is already in `ai-agents/tasks/done/`"*,
>   and its single exception requires the brief to already read
>   `✅ Done (agent-closed — not owner-verified)` — which `0021`/`0041` do not. **The repair logic is
>   present and gated shut. This is a gating fix, not a new capability**, exactly as stated.
> - **What is wrong.** That branch is in **step 5** (*"Update each tracked location to 'Done'"*, under
>   the bullet list beneath *"The moved brief's OWN `## Status` field"*), **not step 6**. Step 6 is
>   *"Handle ambiguity — never paper over it"* and contains no status-header logic. Read *"step 5"*
>   wherever this brief says *"step 6"* in the paragraph above.
> - **Scope consequence: none.** `## What to build` below already scopes this as a widening of the
>   **step-1 stop condition**, which is the correct and complete fix; it does not depend on the
>   mis-numbered reference. **The brief is not re-scoped and is not smaller than it describes** — its
>   five items are the minimum honest change surface (branch + skip-move + resolved value + four
>   must-nevers in prose + mirror refresh). Reported plainly rather than claiming a saving that is not
>   there.
> - **No naked `:NNN` added** — the step is cited by heading plus quoted phrase, per the `0160`/`0176`
>   durable-citation policy this brief already follows.

Verified state, 2026-08-06:

| Task | Brief `## Status` | Folder | `sprint-1.md` row |
|---|---|---|---|
| `0021` | `🔲 Backlog` | `ai-agents/tasks/done/` | `✅ Done` |
| `0041` | `🔲 Backlog` | `ai-agents/tasks/done/` | `✅ Done` |

### ⚠️ Until this ships, 0021 and 0041 stay drifted — the owner accepted this cost explicitly

The drift is visible in **every** `/fkit-status Sprint 1` run and will keep rendering until this task
lands and is run. That is a known, accepted, owner-acknowledged cost — **not** an oversight, and not a
reason for any later reader to "just fix the briefs by hand". Hand-editing remains barred.

### ⚠️ CONFLICT — this overlaps existing tasks 0134 and 0135, and the owner must settle it

**Do not start this task without reading this section.** Two unscheduled backlog tasks already claim
adjacent ground:

- **`0134`** (*decide the sanctioned repair path for a half-landed close*, owner **fkit-architect**, an
  ADR) — its question 3 asks what a repair mode **may write**, and the candidate set it lists already
  names *"the brief's own `## Status` when the board is the side that landed"*. **That is precisely the
  0021/0041 case.**
- **`0135`** (*add the sanctioned producer-only reconcile mode to `/fkit-task-done`*, owner
  **fkit-coder**) — implements 0134's ruling into **this same file and this same step-1 branch**, and
  additionally mirrors both ship-loops and revisits three ADR-033 carve-out sites. `0135` depends on
  `0134`.

Both were filed 2026-07-25. The owner's ruling here is dated **2026-08-06** and is narrower and more
direct: repair the mover so the owner can run it on two specific drifted tasks. **The producer is not
resolving this overlap unilaterally** — see `## Notes`, which states the open question the owner must
answer before this task is pulled into a sprint.

## What to build

Widen `/fkit-task-done`'s step-1 stop condition (`claude/skills/fkit-task-done/SKILL.md`) so that an
already-in-`done/` folder whose brief `## Status` **contradicts a landed close** is repairable **with the
owner present**.

1. **Add a second exception to the step-1 stop**, alongside the existing owner-verification upgrade. It
   fires when **all** of these hold:
   - the task folder is already under `ai-agents/tasks/done/`; **and**
   - the brief's `## Status` reads a value that contradicts a landed close (`🔲 Backlog`,
     `🔄 In progress`, `🚧 Blocked — …`); **and**
   - a landed close genuinely exists elsewhere — a board row for this task already reads `✅ Done`; **and**
   - **the owner is present.** Same identity gate as the existing exception, which states *"An agent
     hitting this case still stops: only the owner can upgrade."*
2. **When it fires, skip the move** (the folder is already in place) and perform the status updates only
   — the same shape the existing exception already uses.
3. **The resolved value is plain `✅ Done`**, with **no** `(agent-closed — not owner-verified)` marker.
   The owner is present and is verifying; that is what the plain value means, and it is what
   `sprint-1.md`'s existing rows already say, so brief and board converge rather than diverge again.
4. **State the must-nevers in the skill's own prose**, so a later reader cannot reconstruct them wrongly:
   - never fire when **no** board row reads `✅ Done` — with no landed close this is a *close*, not a
     repair, and a close starts from `backlog/` through the ordinary path;
   - never fire for a non-owner identity;
   - never upgrade an existing `✅ Done (agent-closed — not owner-verified)` — that is the *other*
     exception's job and it stays exactly as written;
   - never move a folder in this branch.
5. **Refresh the gitignored `.claude/skills/fkit-task-done/` mirror** and `diff` it against the canonical
   source in `claude/`.

**Once shipped, the owner runs the mover on `0021` and `0041`.** Both resolve to plain `✅ Done`, matching
the `sprint-1.md` rows already in place. Running it is the **owner's** act, not this task's — do not run
it as part of the implementation, and do not hand-edit the two briefs to "get ahead".

## Verification steps

1. `claude/skills/fkit-task-done/SKILL.md` step 1 carries a **second**, clearly-labelled exception, and
   the pre-existing owner-verification exception is **byte-unchanged**. Show both, by diff.
2. The new branch's four must-never conditions are present in the skill's prose. Quote each one back.
3. Walk the branch against **`0021`** by reading the file — it must be *reachable* (folder in `done/`,
   brief `🔲 Backlog`, `sprint-1.md` row `✅ Done`) and must resolve to **plain `✅ Done`**. A dry run is
   preferred if one is possible; if it is not, say so plainly rather than implying one was done.
4. Construct the **refusal** cases and confirm each still stops: (a) an agent identity; (b) an
   already-in-`done/` brief with **no** `✅ Done` board row anywhere; (c) a brief reading
   `✅ Done (agent-closed — not owner-verified)`, which must route to the *existing* exception and not the
   new one.
5. `node --test test/*.test.js` is green. ⚠️ **State plainly that this proves no regression, not the
   change** — no test reads `SKILL.md` body prose at runtime (established by task 0123; task 0136's guard
   covers frontmatter only).
6. `test/skill-ownership-hook.test.js` still asserts producer-only movers — this task must not widen the
   ADR-033 §1 grant as a side effect.
7. `diff` the `.claude/skills/fkit-task-done/` mirror against `claude/skills/fkit-task-done/`; no
   difference.
8. **0021 and 0041 are still drifted at the end of this task.** Confirm and state it. Their repair is the
   owner's run, and is out of scope here.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** the owner's answer to the overlap question below. No code dependency.
  - **⚠️ DATED CORRECTION 2026-08-06 — the overlap question is ANSWERED. Line above left
    byte-identical.** Owner ruling, verbatim ***"Ship 0229 standalone."*** (`AskUserQuestion`, live
    `fkit lead` session, 2026-08-06). **Current dependency: nothing. This task is sprintable.**
    ⚠️ **Accepted tradeoff carried forward: `0135` edits the same step-1 branch later** — see the
    ruling block below.
- **Blocks:** the owner's repair run on `0021` and `0041`.
- **⚠️ This touches a mover skill — the file where fkit's anti-laundering story lives.** ADR-033 made the
  movers producer-only; ADR-025 (which it reversed) is the cautionary precedent. **It likely wants an ADR
  note.** Task `0134` is already scoped as exactly that ADR, by fkit-architect — so the ADR need is
  probably *satisfied by 0134 rather than by a new record*. Confirm before writing a fresh ADR.
- **⚠️ OPEN QUESTION FOR THE OWNER — settle before this is pulled into a sprint.** Three live options,
  and the producer is not choosing among them alone:
  1. **Ship 0229 standalone** as the narrow owner-ruled slice; leave 0134/0135 to cover the wider
     reconcile mode later. Fastest route to un-drifting 0021/0041; risks two overlapping edits to the
     same step-1 branch, landing at different times.
  2. **Fold 0229 into 0135** and let 0134's ADR gate it. Cleanest single edit to the mover; but 0135
     depends on 0134, which has not happened, so 0021/0041 stay drifted materially longer.
  3. **Narrow 0134** to exclude this case and keep 0229 independent. Preserves both, at the cost of an
     edit to 0134's brief.
  - **✅ RULED 2026-08-06 — option 1. Owner ruling, verbatim: *"Ship 0229 standalone."*** Given via
    `AskUserQuestion` in a live `fkit lead` session. **The three options above are left byte-identical**
    so the road not taken stays readable. **The question is closed — do not re-open it.**
    - **The owner's stated reasoning:** `0134` has **no scheduled date**, so folding this in means
      waiting indefinitely while `0021`/`0041` stay visibly drifted in every `/fkit-status Sprint 1`
      run.
    - **⚠️ THE ACCEPTED TRADEOFF, RECORDED HONESTLY — two overlapping edits to one branch.** This is
      option 1's own stated risk and the owner accepted it with eyes open. **`0135` will edit the very
      same step-1 branch of the very same file again, later**, once `0134`'s ADR rules. That is a
      *known duplicate cost*, not an oversight: the second edit will have to read what this one wrote,
      decide whether the narrow exception is subsumed by the wider reconcile mode, and say so. **It is
      not a licence for `0135` to silently overwrite this branch** — if `0135` replaces it, it says so
      in its worklog and states what happened to this ruling.
    - **Not changed by this ruling:** `0134` is **not** narrowed (option 3 was not taken — its brief
      keeps question 3 exactly as written), and `0135`'s dependency on `0134` stands.
- **Owner ruling of record:** 2026-08-06, `AskUserQuestion`, live `fkit lead` session — *"Repair the mover
  first, then run it"*. **This is not producer precedent** for widening a mover; it is one named ruling on
  one named case.
- **Line-number citations are deliberately absent.** This brief cites `SKILL.md` and
  `task-status-vocabulary.md` by **heading plus quoted phrase**, per the durable-citation decision (task
  `0160`, closed). Do not add naked `:NNN` coordinates; re-derive locations by searching the quoted text.
- **Sibling briefs filed the same day:** `0230` (status-vocabulary self-contradiction) and `0231`
  (wiki-sync diff counting). The owner ruled explicitly that `0230` is **not** folded into this task.
- No commit — leave the edit in the working tree.
