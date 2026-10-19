# Record the ADR that resets fkit's test scope to shipped-script behaviour

## ID
0527

## Sprint
Sprint 13

## Priority
P2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**The gate of the test-suite reduction.** No test is deleted and no rule is changed until this ADR is
written and the owner has signed it off. Chain: `0526` + `0527` → `0528` / `0529` → `0530`.

### Owner rulings (⚠️ relayed by the fkit-lead session to a spawned `fkit-producer` with no owner channel, ADR-021)

Owner decision, 2026-10-19, fkit-lead session, typed, verbatim:
> "I am making a decision that we need to RADICALLY reduce the tests in fkit: I belive we're in the
> "self-enforced-loop" when tests and further development creates more tests and more re-runs of the
> same tests. Pause all tasks, and start doing this thing - brief a separate task for that, discuss it
> with all agents that needed. We no longer are ok with such insane amount of time needed for tests."

Earlier, same session: *"The 60-90 min durations look INSANE for the fkit lib (which is basically a
harness for LLMs, not anything super computational)"*.

`AskUserQuestion`, fkit-lead session, 2026-10-19, verbatim:
1. **Which option** — typed answer: *"Chose the option that is reducing the time most radically."*
   ⚠️ **This is the lead's reading of his words: option D** (below). The owner can correct that reading
   at brief review.
   **2026-10-19 — reading confirmed by the owner.** Via `AskUserQuestion`, `fkit lead` session,
   selected option text, verbatim: *"Yes, option D (Recommended)"* — description he saw: *"All five
   briefs stand as written."* (Recorded on [Sprint 13](../../../sprints/sprint-13.md) as S1.)
2. **Time limit** — *"≤ 2 min, CI-enforced (Recommended)"*: the default `npm test` takes ≤ 2 min
   locally on an idle Mac; CI fails the job if it goes over.
3. **Growth stop** — *"Owner-approved only (Recommended)"*: *"New prove-red case only with your OK,
   under a cap. 'Missing test' on correct code = suggestion, not a defect (except a short key list).
   Coder rule narrowed."*
4. **Case 48** — *"Check first (Recommended)"*: *"One isolated Linux run (CI branch/container) as the
   first step of the task; then decide the banner tests' fate."* → task `0526`.

### Option D, as it was put to the owner (the architect's option)

Reset to ADR-014's original fence. **Keep** only shipped-script behaviour tests — category 1
(launcher, init, hooks) and category 2 (shipped skill executables: `dashboard.sh`, `throughput.mjs`,
the heal `check.sh` / `repair.sh`). **Delete** prove-red, or keep ≤ 5 "crown-jewel" mutations
(role-lock matrix, `--resume`, cold-start `exec`) **outside** the default `npm test`. **Delete**
categories 3–5: repo-only `bin/` tooling tests (including `release-summary` and the four board
tests), the ~9 prompt-wording guard tests, and the ~9 `ai-agents/` process-document / repo-content
tests. Expected default `npm test`: about 1–1.5 min locally (inferred, not measured). Risk stated to
the owner: *"risk of silent role-lock bugs"*. The architect's own recommendation was B (two tiers);
the owner chose the most radical option.

### Evidence (2026-10-19 lead-session consults: architect / coder / reviewer)

- **Growth, 2026-07-15 → 10-17:** test files 1 → 42; prove-red mutations 2 → 55; test lines ~250 →
  ~22.3k, plus prove-red 2,533 lines. Test code ~25.7k lines against ~7.3k lines of shipped shell/JS.
  CI median job W33 244 s → W42 778 s (max 1320 s): 3.2× the time for 2× the files.
- **The loop:** since 2026-09-16, of 35 closed tasks, 19 touched tests, 11 added a test file, 5 added
  mutations, 4 were about the test system itself (`0395`, `0477`, `0480`, `0502`). No rule ever retires
  a test. The "fourth category" (repo-content invariants) was added in a test-file header
  (`test/task-id-uniqueness.test.js`), never in an ADR.
- **Where the time goes** (slowest CI run 38904713361, 1310 s): seven whole-suite passes 48% (the unit
  pass plus prove-red's `run_suite` ×6: steps 0a, 0b, 2, 15, 30, 31). `run_suite` globs all 42 files
  though only 5 read `FKIT_LAUNCHER` — the glob dates from 2026-07-15, when `test/` held one file. Step
  0a is an exact duplicate of the unit pass (checked). Update-banner group 32% (see `0526`). Dashboard
  12%, release 6%.
- Process-document and wording tests take ~0 s each; their cost is upkeep and false reds (CI was red
  at `78b7464` from a live-corpus test).

## What to build

One ADR (new number, via `/fkit-record-decision`), or a new ADR plus dated addenda — the architect's
call. It must:

1. **Record option D as the new test-scope fence**, in plain words: what a test may cover, what it may
   not, and the cap on new tests (ruling 3).
2. **Name every earlier decision it changes**, and add a dated pointer to each:
   - **Supersedes ADR-026 Decision 4.**
   - **Amends ADR-014 §2** (scope = the black-box process contract).
   - **Amends ADR-029 D3** — task-id uniqueness: `test/task-id-uniqueness.test.js` is its **sole**
     mitigation for the cross-branch ID race. The ADR must say what replaces it (a cheaper check
     elsewhere, or "accepted risk, none") — never leave it silent.
   - **Amends ADR-027** (dual-home parity is a dev-time convention plus test).
   - **Amends the reference-integrity condition** (report
     `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md`).
   - Retires the undocumented "fourth category".
3. **Say what happens to prove-red — as an owner question, not a decision.** ⚠️ Open question for the
   owner: **delete prove-red entirely**, or **keep ≤ 5 crown-jewel cases in a lane outside the default
   `npm test`** (manual or nightly). Either costs no default time. Put both to the owner with their
   trade-off.
4. **Weigh, as inputs only, the reviewer's "must keep" list** (2026-10-19 reviewer consult): launcher
   argv; the role-lock matrix; the skill-ownership hook; convergence / never-overwrite; the release
   tool. And the reviewer's suggestion to **keep the scaffold-vs-dogfood byte-parity check** (cheap).
   Option D deletes some of these (the release tool's test is category 3). The ADR states, for each,
   keep or drop and why — **for the owner to confirm**, not settled between agents.
5. **Leave the banner tests' fate to `0526`'s finding.** The ADR may state the rule ("timing tests
   must not sleep for real") but not pre-empt the check.
6. **Name the shipped prompts that must change** (they become `0528`'s and `0529`'s scope): the coder
   rule in `claude/agents/fkit-coder.md`; the "Missing tests" and "a check that cannot fail" hunt items
   in `claude/skills/fkit-adversarial-review/SKILL.md`; the Verify / "when unsure" wording in
   `fkit-task-ship-loop`, `fkit-sprint-ship-loop`, `fkit-plan-task`, `fkit-review`; CONTRIBUTING's
   what-to-run table; the four movers, which tell agents to run `test/reference-integrity.test.js`.
7. Name the short **key list** of behaviours where a missing test on correct code is still a defect
   (ruling 3's exception) — a proposal for the owner.

## Verification steps

1. The ADR exists under `ai-agents/knowledge-base/decisions/`, its number is unique, and every ADR in
   step 2 carries a dated pointer to it.
2. The ADR quotes ruling 1 **with** the lead's-reading caveat, and rulings 2–4 verbatim.
3. Prove-red (step 3) and the must-keep list (step 4) are put as owner questions, each with its
   trade-off — none settled by the architect alone.
4. The owner's sign-off is recorded in the ADR (quote, date, channel). **Until then, the ADR's status
   is Proposed and `0528` / `0529` do not start.**
5. `node --test test/coordination-citation-policy.test.js test/reference-integrity.test.js` pass on the
   new ADR (these still exist until `0529` runs).

## Notes

- **Depends on:** nothing
- **Blocks:** 0528, 0529
- Runs in parallel with `0526`.
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
  - **2026-10-19 — the owner's specific word is given.** Via `AskUserQuestion`, `fkit lead` session,
    selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* — description he saw:
    *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused.
    Knock-on: none."* Relayed verbatim to a spawned `fkit-producer` (no owner channel, ADR-021). The
    line above is kept as the record; it is now satisfied.
- **Brief split** (producer, 2026-10-19): the owner said *"brief a separate task"*. The work is five
  briefs (`0526`–`0530`) because each ships on its own: the Linux check is an investigation; this ADR
  is a sign-off gate; the rule changes and the cuts touch different files and can ship in either
  order; the CI budget can only go green after the cuts. Merging them is the owner's call.
