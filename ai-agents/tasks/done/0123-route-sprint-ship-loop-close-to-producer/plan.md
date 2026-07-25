# Plan — task 0123: `fkit-sprint-ship-loop` close step, driver self-close → spawn the producer

## Context

ADR-033 §4 amends ADR-032: the orchestrator no longer closes shipped tasks directly — it **spawns
`@fkit-producer` to close each one**, and the evolved lead does not hold the movers.

Task 0111 built `claude/skills/fkit-sprint-ship-loop/SKILL.md` against **ADR-032-as-first-written**,
where the driver ran `/fkit-task-done` itself (§5.2 Close row, line 101). Once task 0124 removes the
movers from `lead`, that call is **hook-denied** — the loop breaks mid-sprint. So this must land before
0124, exactly as 0122 just did for the coder loop. 0123 and 0122 together unblock 0124.

**Intended outcome:** the sprint loop's Close row becomes a per-task **producer spawn**; nothing in the
file still says the driver closes or writes the marker itself; the rest of the §5 contract — task
selection, the live owner-relay gate, the stop table, progress reporting, and the **plan-gate honesty
clause** — is untouched, and no prose-enforced gate is upgraded into a false structural guarantee.

**Owner decisions (this session, before the plan gate):**
1. **Mirror 0122's confirm-the-close discipline** into the sprint loop's Close row — beyond the brief's
   literal four criteria, taken deliberately: a driver reporting "shipped" on a partial close is worse at
   sprint scale, where the roll-up carries the error across several tasks.
2. **`fkit-lead.md:56-57`** (*"It closes each task itself with the (agent-closed) marker by default"*) —
   the same shape as 0122's R4 and **not** in 0124 item 5's inventory. **Route it to 0124**, do not fix it
   here.

## Scope — one file

**Edit:** `claude/skills/fkit-sprint-ship-loop/SKILL.md` (209 lines). No scaffold copy exists (verified).
Refresh the gitignored `.claude/` mirror by one-file `cp` afterwards.

**Out of scope — owned elsewhere, do not touch:**
- `claude/agents/fkit-lead.md:56-57` → **routed to 0124 item 5** (owner ruling above), carried on the same
  producer spawn that closes this task. Not edited by me.
- `claude/skills-for-role.sh`, the four mirrors, the hook test, the movers' own SKILLs, `fkit-coder.md`,
  `fkit-producer.md`, `claude/scaffold/universal-rules.md` → **0124**.
- `ai-agents/knowledge-base/architecture.md:294/305-307/355` (the ADR-025 "any role may close" rows) →
  **0124 item 2**, coordinating with 0115.
- **`SKILL.md:8`'s bare `# ⛔ Owner: the lead` H1 → task 0120** (cosmetic banner fix). My edits do not
  touch line 8, so the two tasks do not collide in either order.
- `ai-agents/wiki-vault/` → **0126**, and the coder never writes the vault.

## The edits, in file order

1. **Frontmatter `description` (lines 3-5)** — "closing with the agent-closed marker by default" → closes
   nothing itself; routes each task's close to a spawned producer, which writes the marker. Keep
   "Session-only; the driver holds the owner channel workers lack."
2. **Overview (line 30)** — "holds the owner channel itself, **and closes the task itself**" → holds the
   owner channel itself and **routes each close to a spawned producer**. Add ADR-033 §Consequences' cost
   in the file's own voice: **one more spawn, one more hop before a task leaves the board.**
3. **§5.2 table, Close row (line 101)** — the core rewrite. `**the driver itself** runs /fkit-task-done`
   → **Driver spawns `@fkit-producer`**; worker column: runs `/fkit-task-done` on the brief and writes
   `✅ Done (agent-closed — not owner-verified)` (ADR-033 §5 — a spawned producer has no owner channel);
   gate column: **the driver confirms the close landed**, and stops for the owner on a degraded run.
   Keep the row's table shape identical to its five siblings.
4. **The rule at lines 118-119** — currently *"The close is the driver's, not a spawned worker's — the
   lead already owns `/fkit-task-done` (`skills-for-role.sh:37`)"*. This is now **false in both halves**
   and must be inverted: the close is a **spawned producer's**; the movers are producer-only (ADR-033 §1)
   and the ADR-018 hook denies a mover call from the `lead` identity at any spawn depth. The owner-relay
   stays coherent because the driver still **holds the channel**, not because it closes.
5. **§4 Close posture (lines 148-156)** — retitle the citation to ADR-032 D5/D6 **as amended by ADR-033
   §4/§5**. Three bullets:
   - *Agent-closed marker by default* — kept, but written by **the spawned producer**.
   - *Degraded run → do NOT **route** the close* (was "self-close").
   - *Never self-cancel* — **unchanged**, per the brief.
   - **New bullet (owner decision 1): confirm the close landed.** Read the producer's step-7 close-out
     report (it enumerates every doc touched, including re-pointed hrefs under `sprints/done/`,
     `sprints/reviews/`, and the knowledge-base) and cross-check the folder move, the brief `## Status`
     and the sprint row. A three-location spot-check cannot see a partial close. If it half-landed:
     **re-spawn `@fkit-producer` once** to reconcile its own close; if it still fails, write
     `🚧 Blocked — hand-off incomplete: <what disagrees>` in both locations, **relay to the owner**, and
     do not count the task as shipped in the roll-up.
6. **Stop table (line 176)** — "do not **self-close** it" → "do not **route** its close".
7. **Stop table — new row** for the hand-off failure, matching the sibling loop's: *the producer spawn
   failed, was denied, or left the close partial* → re-spawn once, else `🚧 Blocked — hand-off incomplete`
   (both locations), report, next task. Needed because the table claims to be the complete exit inventory
   and §4's new bullet creates that state. *(This is the exact addition that drew findings R1/R3 on 0122 —
   so write the recovery branch correctly the first time: never "leave `🔄 In progress`".)*
8. **Hard rule (line 200)** — "Close writes the agent-closed marker by default" → **the driver invokes no
   mover**; it spawns a producer, which writes the marker; degraded runs stop; never self-cancel.
9. **Hard rule (line 201)** — "before closing a task" → "before handing a task's close off" (matches the
   sibling wording after 0122).

**Style:** match the file's own voice — `§5.x` back-references, ADR links at the existing relative depth,
bold-lead bullets, the six-row table shape. No renumbering of §1–§5, no new sections, no restructuring.

## Verification

1. `grep -n "fkit-task-done" claude/skills/fkit-sprint-ship-loop/SKILL.md` — **zero** driver invocations;
   every hit is *the spawned producer runs it* or *the driver must not* (brief criterion 1).
2. Close row + §4 read as a per-task `@fkit-producer` spawn, explicitly (criterion 2), and the marker is
   attributed to the spawned producer, not the driver (criterion 3).
3. **Criterion 4 — the untouched contract.** `git diff` reviewed hunk by hunk to confirm §1 (selection /
   skip memory / deadlock), §3 (the relay gate + the DONE/NEEDS-DECISION/BLOCKED envelope), the
   plan-gate **honesty clause** (lines 46-62), the declared-approval-marker rules (104-116), and progress
   reporting are unchanged — and that **no prose-enforced gate got upgraded into a claimed structural
   guarantee**. This is the criterion most at risk from a careless edit; check it explicitly, not by
   assumption.
4. `node --test test/*.test.js` → expect **511 pass / 0 fail**. ⚠️ No test reads any `SKILL.md` at
   runtime, so this proves **no regression, not the change** — say so, do not overclaim.
5. `diff` canonical vs `.claude/` mirror → identical after the `cp`.
6. `git status` — one tracked source file modified, plus this task folder's artifacts. **No commit.**

Then `@fkit-reviewer` → `/fkit-stateful-review`, working tree, task-id
`0123-route-sprint-ship-loop-close-to-producer`, hop 1, with the pre-existing unrelated working-tree
changes fenced out of scope.

## Risks / edge cases

- **The 0122 review's findings are a checklist for this file.** R1 (an unsatisfiable partial-close
  recovery) and R2 (a confirm check narrower than the mover's write contract) were defects I introduced in
  the sibling loop. Both are avoided here by writing edits 5 and 7 to the corrected shape from the start.
- **Do not harden the honesty clause.** The brief and ADR-032 D7 both say the plan-gate split is
  prose-enforced. Rewriting the close in confident language must not bleed into that section.
- **0120 collision: none in practice** — it edits line 8's H1, which I do not touch. Either order works;
  the worklog will say so rather than implying a dependency.
- **`fkit-lead.md:56-57` stays contradictory until 0124.** Routed, not fixed. Same live-and-unenforced
  window as 0122's residual: the lead still holds the movers until 0124, so a mistaken driver self-close
  would silently succeed rather than being denied. Named in the worklog as a residual with its owner.
- **The sprint loop is not runnable in this session** (lead-only, ADR-018). The change is verified by
  reading and by the no-regression suite — **it is not exercised end-to-end here.** Unlike 0122, whose
  own close dogfooded its change, nothing in this run executes the sprint loop's new Close row. State
  that plainly in the evidence packet rather than implying it was proven.

## Open questions

None outstanding — both design choices were put to the owner and answered before this plan.
