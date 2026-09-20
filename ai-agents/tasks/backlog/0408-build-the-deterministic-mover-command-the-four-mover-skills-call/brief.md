# Build the deterministic mover command the four mover skills call — mechanics move out of prose, judgement stays in the skill

## ID
0408

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⛔⛔ THIS TASK IS NOT AUTHORISED TO START. AN ACCEPTED ADR IS NOT A WORK ORDER.

⛔ **ADR-050 (`adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed`) is being SIGNED,
not implemented.** As of **2026-09-18** an `fkit-architect` spawn is writing it. ⛔ **Nobody has
scheduled this work and nobody has ruled it starts.** This row exists so the decision is not lost.

⚠️ **This brief was written WITHOUT READING ADR-050** — the architect spawn held
`ai-agents/knowledge-base/decisions/` at filing time and this producer stayed out of that directory
entirely. **Everything below about the ADR's content is a RELAY from `fkit-lead`.** ⛔ **First act of
whoever picks this up: read the signed ADR and reconcile this brief against it.** Where they disagree,
**the ADR wins.**

### ⛔ AND IT IS BLOCKED BEHIND `0407` — that ordering is the owner's ruling, not a preference

⛔ **[`0407`](../0407-build-the-mover-outcome-verifier-which-is-also-the-acceptance-test-for-the-mover-command/brief.md)
— the outcome verifier — must land first.** It **is** this task's acceptance test. ⭐ **Building this
command first would leave it with no acceptance criterion but its own author's reading of the prose it
replaces** — which is precisely the failure ADR-050 exists to end.

### What was ruled, and in what form

⛔ **THE OWNER SELECTED A PRE-WRITTEN OPTION. HE TYPED NO FREE TEXT.** Ruled **2026-09-18** via
`AskUserQuestion` in a live `fkit lead` session, selecting from options written by `fkit-architect` and
`fkit-producer`. ⛔ **Never record it as a quotation of the owner's own words.**

**What he selected, as relayed by `fkit-lead`:**

- **Content — option E:** an **outcome verifier first** (cheap; it becomes the acceptance test), **then
  a real command the skills call.** ⭐ **Judgement stays in the skill; only mechanics move.**
- **Enforcement — option B-1:** **the skill remains the sanctioned entry point, and the `PreToolUse`
  skill-ownership hook is UNCHANGED.**

### The problem

The four movers — `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-sprint-done`,
`/fkit-sprint-cancelled` — are **prose procedures** performing several edits that must all land or none
should. ⛔ **Prose has no transaction.** A run that performs four of six edits leaves carriers
disagreeing, and this is the condition ADR-048 had to invent a producer-only repair mode for
([`0135`](../0135-add-producer-only-reconcile-mode-to-task-done/brief.md), unbuilt).

## What to build

**Exactly what ADR-050 rules — ⛔ do not re-decide any of it here.** Expected shape, **subject to the
ADR**:

1. **A deterministic command that performs the movers' MECHANICS** — the file relocation, the status
   carriers, the board row, the href repointing, the marker stamping — as **one unit whose outcome is
   all-or-nothing**, and which the four skills **call** instead of describing step by step.
2. **⛔⛔ JUDGEMENT STAYS IN THE SKILL. THIS IS THE RULING'S OWN BOUNDARY AND IT IS THE EASIEST THING
   ON THIS TASK TO GET WRONG.** The command must **not** decide: whether a close is warranted, whether
   the owner is present, whether the `(agent-closed — not owner-verified)` marker applies, whether a
   reason is adequate, or which board a de-scoped row goes to. **It executes a decision already made;
   it never makes one.** ⚠️ Any behaviour that looks like the command choosing an outcome is a
   defect, not a convenience.
3. **⛔ The skill stays the sanctioned entry point** (enforcement option B-1). The command is
   **downstream** of the skill, never an alternative door to it. ⛔ **Do not touch the `PreToolUse`
   skill-ownership hook, and do not widen ADR-033's producer-only grant as a side effect.**
4. **All four movers, or a stated subset with its reason.** ⚠️ **A command that serves two of four
   movers leaves the other two in prose and manufactures exactly one generation of the same
   inconsistency the ADR is closing** — the shape of `0123`'s R1 defect, where shared doctrine was
   fixed in one file and left wrong in another. **If the ADR scopes fewer than four, say so and name
   which.**
5. **`0407`'s verifier is the acceptance test.** Every mover path this command serves must be shown
   **complete by the verifier**, before and after.

### ⛔ Out of scope — named so it is not drifted into

- ⛔ **The verifier** — `0407`.
- ⛔ **The reconcile mode that repairs a half-landed close** — `0135`, and ADR-048's, not this task's.
- ⛔ **Any hook change, any role-grant change, any new door into a mover.**
- ⛔ **Any change to what a close MEANS.** ADR-049's ruling on what an owner-verified close requires is
  untouched by moving mechanics.

## Verification steps

1. **The signed ADR-050 has been read, and this brief reconciled against it** — the worklog names every
   point of difference.
2. **`0407` has landed and is green.** ⛔ **This task does not start otherwise.**
3. **`0407`'s verifier reports COMPLETE for every mover path this command serves** — run it, paste the
   output, do not describe it.
4. **All-or-nothing is proved, not asserted.** Interrupt the command partway in a fixture tree and show
   the tree is left in a state the verifier calls **either fully landed or fully unlanded** — never
   half. ⚠️ **If the implementation cannot guarantee that, say so plainly and name what it guarantees
   instead.** ⛔ Do not claim a transaction that does not exist — that is the defect this task is named
   after.
5. **Judgement did not move.** Read the four skills' diffs and show each still decides warrant,
   owner-presence, and the marker. ⚠️ **State per skill**, not in aggregate.
6. **`test/skill-ownership-hook.test.js` still asserts producer-only movers** — this task must not
   widen ADR-033 §1 as a side effect.
7. **`node --test test/*.test.js` is green.** ⚠️ State plainly what that proves and what it does not —
   no test reads a `SKILL.md` body at runtime.
8. **Refresh the gitignored `.claude/skills/` mirrors for every skill touched, and `diff` each against
   its canonical source in `claude/`.**
9. **⛔ No mover is actually run against `ai-agents/` to test this.** Fixture trees only. A test close
   performed on a real task would be an unsanctioned close.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** [`0407`](../0407-build-the-mover-outcome-verifier-which-is-also-the-acceptance-test-for-the-mover-command/brief.md)
  (hard — ⭐ **the ordering is the owner's ruling of 2026-09-18, and `0407`'s output is this task's
  acceptance test**) **and ADR-050 being signed and accepted** (hard — the specification is the ADR's,
  not this task's to invent).
- **Blocks:** [`0135`](../0135-add-producer-only-reconcile-mode-to-task-done/brief.md) — ⭐ **added
  2026-09-18.** Building `0135`'s reconcile mode against prose movers means building it twice, once
  against the prose and again after the mechanics move here. `0135` is held for that reason; see its
  own dated note.
- **⛔⛔ NOT AUTHORISED TO START**, on two counts: the ADR is mid-signature, and `0407` has not landed.
- **⚠️ Written without reading ADR-050.** The ADR wins every disagreement with this brief.
- **⚠️⚠️ NOT caught by the Sprint 11 migration freeze — the producer's judgement, stated plainly so
  the lead or the owner can overturn it.** This is the closer call of the pair and it is argued, not
  assumed:
  - **The freeze's own words** (owner's selected option, 2026-09-18): *"Freeze anything
    migration-shaped — re-keying ids, moving folders, rewriting boards."* ⚠️ **On a literal reading,
    a mover command moves folders and rewrites boards, so the words appear to catch it.**
  - ⭐ **But the freeze's stated subject is `changing fkit's or aiboard's stored shape`** — its own
    "What this freeze does NOT do" section says so — and it is held *"until `fkit-external-expert`
    reports"* on **the aiboard convergence data model**. ⛔ **It is a freeze on a one-time re-shaping
    of the corpus in service of convergence, not a freeze on the daily write path.**
  - ⭐ **This task changes no id format, no folder layout and no board schema.** It performs the
    **same** folder move and the **same** board edit the movers already perform every day, by a
    deterministic route instead of a prose one. **The stored shape before and after is byte-identical
    in kind.**
  - ⛔ **Therefore the freeze does not catch it — and neither task is startable anyway**, so nothing
    turns on this today. ⚠️ **If the implementation ever proposes to re-key an id, relocate a folder
    tree, or change a board's schema, it STOPS AND ESCALATES** rather than proceeding on this
    paragraph.
- **⭐ Why this pair is on the Backlog board and NOT on [Sprint 11](../../../sprints/sprint-11.md) —
  the producer's placement call, covering `0407` and `0408` both.** Sprint 11 is scoped to fkit↔aiboard
  convergence, and its own *"WHAT IS DELIBERATELY NOT ON THIS BOARD YET"* section restricts additions
  to what the aiboard discussions produce (the owner's standing instruction: *"whenever you discuss
  something with the aiboard lead, and it's worth having a dedicated task for that, add it to that new
  sprint"*). **This work came out of fkit's own mover mechanics, not an aiboard discussion.** Sprint 11
  is also unranked and partially frozen, and it is the board the owner will read at its step-3 decision
  gate — putting fkit-internal write-path work on it muddies exactly that read. **The Backlog board is
  the default home for unsprinted work, and neither task is scheduled.**
  ⚠️ **The cost, named:** a reader of Sprint 11 will not see these rows, and **ADR-049 names this work
  as the blocker on any board-originated write** — so if the convergence effort ever proposes a write
  path from a browser or terminal board, **this task is its prerequisite and the link is only in this
  bullet.** ⛔ That risk is flagged, not solved; pulling these onto a sprint is the owner's act.
- **⛔ No mover**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  **⛔ no re-rank**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **⛔ no commit.**
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`. **Unranked.**
  **On merit this belongs directly below
  [`0407`](../0407-build-the-mover-outcome-verifier-which-is-also-the-acceptance-test-for-the-mover-command/brief.md)**,
  because the owner ruled that order.
- **Filed 2026-09-18** by a spawned `fkit-producer` with **no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  Sibling: **`0407`**.
