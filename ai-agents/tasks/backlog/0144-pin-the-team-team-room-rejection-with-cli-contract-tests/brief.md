# Pin the `team` / `team room` rejection with launcher-contract CLI tests

## ID
0144

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Tasks 0139 (menu reorder) and 0140 (doc sweep) retired the word **"team room"**. The launcher now
accepts **only** `lead` on any path. **Nothing in the test suite pins that.**

This is a **standing accepted residual carried forward from 0139 and re-recorded in 0140's review
ledger** (`ai-agents/tasks/done/0140-retire-team-room-in-docs-and-agent-definitions/review.md`,
*Accepted residuals*), whose re-raise condition is *"0140 closes without the producer filing the
brief."* It also matches a suppressed Codex finding from 0140 round 1 — suppressed **only** because
the coverage was routed to a separately named task. This is that task.

**Why this is not hypothetical.** 0139 **did** add `team` / `team room` as word aliases, and the
two-word form **broke**: the stray positional `room` fell through and became Claude Code's *initial
prompt*. The alias was reverted. The failure was found by a manual run, not by the suite — and today
either alias could be restored with `npm test` fully green.

**Scope seam.** This brief covers **only** what the existing detached harness can reach: `fkit` invoked
with arguments. The **interactive menu** needs a controlling terminal the current harness deliberately
does not provide — that is task **0145**, filed separately because it needs new test infrastructure
this one does not.

## What to build

Add assertions to `test/launcher-contract.test.js` in the **Group A** style already used by
assertions 2 and 3 (*"non-zero, and claude was NEVER exec'd"*):

| Invocation | Expected |
|---|---|
| `fkit team` | non-zero exit (`rc=2`, the usage-error branch) **and** `claude` never exec'd |
| `fkit team room` | non-zero exit (`rc=2`) **and** `claude` never exec'd |

The harness already gives you both halves — `runFkit` returns `.code` and `.exec` (`.exec` is *"did
the stub run"*, `test/harness.mjs:87`). **No new harness capability is needed here**; that is the whole
reason this is a separate, cheap task.

⚠️ **Assert `.exec === false` explicitly, not just the exit code.** The 0139 bug was *not* a wrong exit
code — it was `claude` being exec'd **with a stray positional as its initial prompt**. An exit-code-only
assertion would have passed while the bug shipped. This is exactly the distinction assertion 2's comment
already draws (*"THE assertion exit codes cannot make"*).

**Also add a third mutation to `test/prove-red.sh`** — restoring the `team` / `team room` alias arm to a
throwaway copy of the launcher must drive the suite **red at the specific new assertion**, not merely
"some failure". The file's header documents the existing two mutations and the named-assertion
requirement; follow that pattern. Per ADR-014, a test that has never failed has not been tested — and
this test exists precisely to catch a re-addition, so the mutation *is* the proof it works.

## Verification steps

1. `npm test` green — the existing 521 tests still pass, plus the new assertions.
2. `test/prove-red.sh` → `✓ hard gate PASSED`, now covering **three** mutations.
3. **Prove the new mutation is load-bearing:** with the alias arm restored in the throwaway launcher
   copy, the run goes red **at the newly named assertion**, and the failure names it. A red anywhere
   else means the mutation is not isolated — report it rather than accepting the red.
4. Confirm both the one-word (`fkit team`) and two-word (`fkit team room`) forms are asserted. The
   two-word form is the one that actually broke; a suite that pins only `fkit team` misses the real
   regression.
5. `claude/fkit-claude.sh` is **not** modified by this task — it is already correct. `git diff` touches
   only `test/`.

## Notes

- **Depends on:** nothing — 0139 and 0140 are both closed and the launcher already behaves correctly.
  This task pins existing behavior; it does not change any.
- **Blocks:** nothing.
- **Related:** 0145 (the pty-driven menu-pick coverage) — independent, no ordering constraint, but the
  two together are what actually close 0139's residual. Landing only one leaves half the surface open.
- **Owner:** fkit-coder — test files only.
- ⛔ **Dated ruling 2026-08-03 — task 0146 must NOT be folded into this one. They stay two separate
  Backlog rows.** Owner ruling, given live via `AskUserQuestion` in an `fkit-lead` session on
  **2026-08-03**. ⚠️ **This is a new record, not a correction — no line of this brief was wrong and
  nothing above was edited.** It is written here because the merge proposal named *both* rows, and a
  ruling recorded on only one side invites the same proposal from this side.
  - **What was proposed:** the 2026-08-03 sprint-2 open-row triage classified both rows as movers to
    the Backlog board and proposed folding
    [0146](../0146-correct-the-false-menu-pick-claim-in-0139s-accepted-residual/brief.md) — which
    corrects the false "menu-pick alias" claim in 0139's accepted residual — into this task.
  - **Why it was refused:** the rationale was **schedule pressure inside Sprint 2**, and both rows are
    now **unranked on the Backlog board**, so that pressure is gone. 0146's own brief also argues
    against folding: **this task is the durable fix, and 0146 is not a substitute for it** — but the
    reverse holds too, and correcting the false sentence should not wait on this task running.
  - **What executed instead:** both rows moved to the Backlog board on 2026-08-03, **separately**.
    Neither was cancelled or closed.
  - ⛔ **Do not re-derive or re-propose this merge.** Also recorded in 0146's brief and in the
    2026-08-03 triage addendum in `ai-agents/sprints/done/sprint-2.md`.
- No commit — leave the changes in the working tree.
