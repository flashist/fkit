# Build the `PreToolUse`/`Task` carry-check hook and its tests

## ID
0204

## Sprint
Sprint 6

## Priority
Sprint 6 P13

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 3 of [`0162`'s decision report](../../../knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md)**
(§10 row 3, §6 `F3`). `0162` ruled that a driver-side machine check **is** possible — the wiring precedent
is already built and shipped in this repo (`claude/askuserquestion-marker-hook.sh`,
`claude/shiploop-marker-hook.sh`, and the ADR-018 skill-ownership hook, all registered as `PreToolUse`
entries in `.fkit/settings/<role>.json`). This task builds the check.

**What it does:** on a `PreToolUse` hook matching the `Task` tool, when the spawn is a
`fkit-sprint-ship-loop` Build or Process-review spawn, confirm that the prompt contains the exact bytes of
the `plan.md` it names, at the `git hash-object` blob it names.

## ⚠️ FIVE caveats — all five MUST be carried into the plan and the worklog, unsoftened

1. **It checks a carry-fidelity PROXY for condition (b) — never (b) itself.** Condition (b) reads *"it
   carries a concrete **approved** plan verbatim"*
   (`claude/agents/fkit-coder.md@2026-08-02:65-66`). A hook can establish *the prompt contains the bytes of
   the file at path P with hash H*. It can **never** establish that P is what the owner approved —
   approval lives in a session channel that leaves no artifact (ADR-021). **A green check does not mean
   the marker held.** Conditions (a) and (c) remain forgeable prose, and a conjunctive marker is only as
   strong as its weakest signal.
2. **HARD-GATED on `0202`.** Until `plan.md` is written **at plan approval**, there is no file at spawn
   time for the hook to compare against. Built before `0202`, this hook either fires on every spawn or is
   disabled on every spawn. **Do not start this before `0202` is in the tree.**
3. **TOCTOU.** The check is **time-of-check only**: `plan.md` may be rewritten between the hook's read and
   the worker's use of the carried text. The hook must not be described anywhere as guaranteeing what the
   worker received.
4. **The sibling hooks' jq-free `"[^"]*"` string extraction is insufficient here** and must not be copied.
   A spawn prompt is a long, multi-line, escape-bearing JSON string value; a naive quoted-run regex will
   mis-extract it. This needs **real JSON parsing**. `node` is available (`v24.13.0`, verified
   2026-08-02), and using it satisfies
   [ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)'s zero-devDeps rule —
   nothing new is installed.
5. **Launcher sessions only.** Hooks are registered in `.fkit/settings/<role>.json`, which is what
   `fkit <role>` loads. Verified 2026-08-02: this repo has **no `.claude/settings.json`**, and
   `.claude/settings.local.json` carries **no `hooks` key**. A spawned or non-launcher session is
   **not covered**, and the hook must not be presented as universal.

## What to build

- The hook script (alongside the existing `claude/*-hook.sh` siblings), doing JSON parsing with `node`.
- Its registration as a `PreToolUse` entry on the `Task` matcher, in the role settings that need it —
  mirroring how the existing marker hooks are registered.
- **Tests**, in the shape the existing hook tests use (`test/askuserquestion-marker-hook.test.js`,
  `test/shiploop-marker-hook.test.js`, `test/skill-ownership-hook.test.js` are the precedents).
  At minimum: an exact-match prompt **passes**; a prompt with a **truncated** paste **fails**; a prompt
  whose named hash **does not match** the file **fails**; a prompt carrying a **pointer only, declared as
  such** behaves per `0203`'s degraded form; a spawn that is **not** a sprint-loop Build/Process-review
  spawn is **not** gated.
- **Prove-red:** each new test must be shown to fail without the hook (`test/prove-red.sh` is the
  existing harness for this).

- **Delete the `unverified` marker text from `claude/skills/fkit-sprint-ship-loop/SKILL.md`, in the same
  change that lands the hook.** See the carve-out below — this is `0204`'s to make.

⛔ **Out of scope:** condition (b)'s wording (unchanged), `claude/agents/fkit-coder.md`, the SKILL.md rule
text (`0203`), and `ai-agents/wiki-vault/`.

### ✅ ONE CARVE-OUT from that exclusion — the `unverified` marker removal IS in scope

**Owner ruling, `AskUserQuestion`, live driver session, 2026-08-05: the removal of `0203`'s `unverified`
marker text is `0204`'s to make, in the same change that lands the hook — not a separate task.**
`0203` shipped a clause into `claude/skills/fkit-sprint-ship-loop/SKILL.md` naming `0204` explicitly and
saying so in its own words: *"Who removes this marker, and when: `0204`, in the same change that lands the
hook — the removal is `0204`'s to make, not a separate task."* The day the hook ships, that marker text
becomes **false** in every spawn prompt still carrying it — an honesty marker inverted into a false one.

**The exclusion above otherwise stands unchanged.** `0203`'s *rule text* — the paste-and-pointer
construction, the degraded form, the two governing sentences, the step ordering — is still out of scope.
The carve-out is **the marker sentences only**.

⚠️ **Re-read the live file before deleting anything; do not work from line numbers.** A separate task is
**concurrently editing this same clause** to enumerate every stale site, so the count and the exact
surrounding text will have moved. Locate the sites by searching the file for `0204` and for `unverified`,
and read what is actually there that turn.

⛔ **ONE SITE IS PROTECTED — surgical deletion only.** One stale mention sits inside the paragraph headed
**"The honest bound on 'true by construction' — do not rewrite this into a guarantee."** Two reviewers
flagged that paragraph as **load-bearing** — it is the ADR-031 honesty clause for this whole construction.
Delete **only** the now-false clause *"and until `0204`'s carry-check hook lands, nothing does"* (and the
minimum punctuation needed to leave a grammatical sentence). **Every other byte of that paragraph must be
unchanged** — including *"This construction narrows the hazard; it does not remove it"*. Do not rewrite,
compress, re-flow, or "improve" it while you are in there. Diff it to prove it.

## Verification steps

1. **All five caveats above appear in the task's `plan.md` and `worklog.md`**, in substance, unsoftened.
   A plan that carries four has failed this step.
2. The hook parses the spawn payload with **real JSON parsing** (`node`), not a `"[^"]*"` regex. Grep the
   script to confirm.
3. `npm test` is green, and the new tests **prove red** without the hook. Record pass/fail/suite counts
   and the prove-red result.
4. No new runtime dependency is added — `package.json` dependencies/devDependencies unchanged (ADR-014).
5. The hook's own documentation/comments state the **proxy-not-(b)**, **TOCTOU**, and **launcher-sessions-only**
   limits. A future reader must not be able to mistake green for "the marker held".
6. `git status` shows changes confined to `claude/` (hook + settings + the sprint-ship-loop `SKILL.md`
   marker deletion, and nothing else in that file) and `test/`. No `ai-agents/` source of truth rewritten,
   no `wiki-vault/`.
7. **The marker removal is done, and it is surgical.** No `unverified — no hook checks it until 0204`
   text survives anywhere in `claude/skills/fkit-sprint-ship-loop/SKILL.md` — grep to confirm. **And**
   `git diff` on that file shows the *"honest bound on 'true by construction'"* paragraph changed by the
   removal of the stale clause **only**; every other byte of that paragraph is identical. A diff touching
   more of it fails this step.

## Notes

- **Depends on:** `0202` — **hard gate**, see caveat 2. Also reads `0203`'s emitted pointer form, but does
  not require `0203` to have landed (`0203` ships first, carrying its `unverified — no hook checks it
  until follow-up 3 lands` marker; landing this task is what makes that marker removable).
  - ✅ **DATED CORRECTION 2026-08-15 — THE `0202` HARD GATE IS DISCHARGED. The line above is left
    byte-identical and is no longer binding.** `0202` closed; its folder is
    `ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/`.
    `0203` has also closed —
    `ai-agents/tasks/done/0203-amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction/`
    — which the line above never made a gate anyway. **Current dependency: nothing.**
    ⚠️ **What survives is the *scope*, not the wait:** removing `0203`'s `unverified` marker is still
    this task's job, and caveat 2 still governs how the gate's output is read.
    ⛔ **This does not make the row `🔄 In progress`; it makes it runnable.**
    *(Recorded by `0306`.)*
- **Blocks:** nothing. Removing `0203`'s `unverified` marker is **in this task's scope** (see the carve-out
  in *What to build*), not a separate dependency and not follow-on tidying.
- **⚠️ Priority 182 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0203`**, wherever the owner places that row — the three are one
  fix in dependency order, and this is the only member of the trio that turns prose into a check.
- **⚠️ This does NOT close the `carried-not-approved` residual** — see caveat 1 and `0162`'s review ledger.
  Neither this hook nor `0202` closes that class. Do not write anywhere that it does.
- **Source:** `0162`'s decision report §10 row 3, §6 (`F3` and its four caveats), §9.
