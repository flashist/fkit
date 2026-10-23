# ADR-057: fkit's tests cover shipped-script behaviour only — the test-scope reset (option D)

- **Status:** **accepted** — owner sign-off 2026-10-19, via `AskUserQuestion`, `fkit lead` session
  (the `/fkit-sprint-ship-loop` run, Sprint 13). Question as shown: *"Q7 — Sign off ADR-057 (fkit's
  test-scope reset) as now written?"* Selected option text, verbatim: *"Sign off as written
  (Recommended)"* — description he saw: *"Status → accepted; architect adds the dated notes to the older
  ADRs; 0527 goes to review."* Before the dialog, the driver showed him in chat a plain summary of the
  ADR as folded (by the driver's account: the kept tests plus three exceptions; the deletions; the ≤ 2
  min budget; no number cap, his OK per new test; a missing test a defect only in the four key areas;
  prove-red 55 → 4 cases, nightly in CI; neutral wording in shipped prompts; the accepted risks — a
  role-lock bug caught the next morning, no duplicate-ID check for consuming projects, the automated
  link checks replaced by a manual check; the no-key-list default left to `0528`'s plan). The label he
  picked is the driver's shortened one, not the plan's draft wording — the text recorded here is the
  one he picked.
  **History:** drafted as `proposed` holding open owner questions Q1–Q6, by the explicit request of
  task `0527`'s brief — a departure from `/fkit-record-decision` Step 1 ("an ADR records a decision, not
  an open debate") on an owner ruling of 2026-10-19 (via `AskUserQuestion`, `fkit lead` session,
  selected option text, verbatim: *"Accept, brief overrides (Recommended)"* — description he saw:
  *"ADR's Status line says it holds open owner questions; pointers only after your sign-off."*). The
  owner answered Q1–Q6 the same day; each answer is folded into the decision below and quoted in
  *§Owner answers*. **From acceptance on, this ADR is append-only:** a later change uses the dated
  correction form. Dated pointers to it were written on 2026-10-19 into ADR-014, ADR-017, ADR-026,
  ADR-027, ADR-029 and the reference-integrity report.
- **Date:** 2026-10-19
- **Deciders:** owner (Mark Dolbyrev); recorded by fkit-architect (spawned build worker for task
  `0527`, no owner channel — ADR-021); inputs from the 2026-10-19 `fkit lead` session consults of the
  architect, coder and reviewer.
- **Evidence:** task `0527`'s brief (*Owner rulings*, *Option D*, *Evidence*); task `0526`'s
  [worklog](../../tasks/done/0526-check-prove-red-mutation-48-on-one-isolated-linux-run-before-deciding-the-banner-tests/worklog.md);
  the re-counts in §Context, dated.
- **Supersedes / Amends (on acceptance):** replaces the fence of [ADR-014](adr-014-how-fkit-tests-itself.md)
  §2 (D1); retires the enforcing tests of [the reference-integrity condition](../reports/2026-08-29-the-reference-integrity-condition.md)
  (D6); amends [ADR-026](adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md)
  Decision 4 — prove-red stays an automated gate, but in a nightly CI lane with four cases (D3);
  retires the undocumented "fourth category" (D7). **Decisions that stand, with a fact that drifts:**
  [ADR-017](adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md) rule 4 (taken in
  unchanged as category 2); [ADR-027](adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
  Decision 2 and [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) Decision 3
  (their tests stay, now licensed by D7's named exceptions).

  > ⚠️ **Dated note 2026-10-19 (`0527` review R4) — "amends … Decision 4" above: ADR-026 Decision 4
  > stands.** See the note below §D3's first paragraph — deliberately not restated here, so there is one
  > place to keep true rather than two. The bullet above is left byte-identical.
- **Corrections:** 2026-10-19 (`0527` review round 1, R2–R4) — this ADR carries dated notes below the
  *Supersedes / Amends* bullet above, below **§D3**'s first paragraph, its *"Four cases"* bullet and its
  *"Cost"* bullet, below **§D9**'s table, and below **§Related**'s ADR-026 bullet. Marker legend: **⚠️ =
  a fact that drifted** (the decision is untouched); **⛔ = a decision that was overturned** (do not
  follow it). No existing line of this ADR was edited; the notes are appends, and the Status stays
  `accepted`.
  **Extended 2026-10-19 by a second append (`0527` review R1, owner ruling):** a ⚠️ note now also sits
  below §Context's *"fourth category"* bullet (14 files, not 5), a ⛔ note below **§D7**'s table (a
  fourth named exception, `test/structure-manifest.test.js`), and a ⚠️ pointer below §Consequences'
  *"guards that stay as named exceptions"* bullet. The site list above is left byte-identical and is
  superseded by this line; the same append-only rule and the same legend apply.
  **Extended 2026-10-20 by a third append (`0529`, after the cut):** dated ⚠️ notes now also sit below
  **§D3**'s *"Four cases"* bullet (numbers kept, not renumbered) and its *"When it runs"* bullet (no
  automated gate until `0530`), below **§D4**'s *"The release tool's test"* bullet (the test's new
  path and script), as a pointer below **§D7**'s ⛔ note, and below **§D11**'s closing paragraph (the
  notes written in the older ADRs). The site lists above are left byte-identical and are superseded by
  this line; the same append-only rule and the same legend apply.
  **Extended 2026-10-20 by a fourth append (`0530`):** dated ⚠️ notes now also sit below the `0529`
  note under **§D3**'s *"When it runs"* bullet (the nightly lane, `.github/workflows/prove-red.yml`,
  now exists), below §D3's *"The schedule is not in `0530`'s brief today"* bullet (a pointer), and
  below the `0529` note under **§D4**'s *"The release tool's test"* bullet (`npm run release` now runs
  `npm run test:release` too). §D10 carries no note: the CI threshold is 120 s, the same budget §D10
  states. The site lists above are left byte-identical and are superseded by this line; the same
  append-only rule and the same legend apply.
  **Extended 2026-10-20 by a fifth append (owner ruling of 2026-10-20, Sprint 14 A3; recorded with
  [ADR-058](adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md)):**
  a dated ⛔ note now also sits below **§D1**'s closing paragraph (the board's own tests are inside the
  fence), a ⚠️ note below §D1's *"Category 3"* item (`bin/fkit-board.mjs` now ships), and a ⚠️ note
  below **§D2**'s item 1 (up to six `test/board/` files pre-approved). The site lists above are left
  byte-identical and are superseded by this line; the same append-only rule and the same legend apply.

> **What this ADR decides, in one line:** fkit's test suite tests only how fkit's **shipped scripts**
> behave, seen from outside — nothing about prompt wording, repo-only tools or the repo's own
> documents, except a short named list — and it stops growing unless the owner says so.

## Owner answers (Q1–Q6)

All 2026-10-19, in the live `fkit lead` session running `/fkit-sprint-ship-loop` (Sprint 13). Channel
`AskUserQuestion` unless marked *typed in chat* (same session, same date). The driver relayed the
questions with shortened option labels; the label and description the owner saw are quoted, then the
ADR option it maps to. Relayed to this builder verbatim by the driver.

| Q | The owner's answer, verbatim | Channel | Maps to |
|---|---|---|---|
| Q1 Prove-red | *"Hey, I'm a bit tired discussing it. Let's implement the simplest solution that we have right now. If you think that nightly tests are the simplest way, let's do them, because I'm a bit lost, to be honest, about your explanation about the difference between nightly tests and tests that run every push. So if you think that nightly works, if it's simpler, even though if we get the notifications not immediately but like next morning, that's fine for now."* — the driver had told him nightly was the simpler of the two automatic options | typed in chat (after questions on hand-run frequency, test count and weight, GitHub Free limits, every-push runs) | **(c)** four cases, outside `npm test`, run nightly in CI — **"fine for now"** |
| Q2 Key list | *"4 items (Recommended)"* — description: *"Launcher argv/exec; role-lock matrix; skill-ownership hook allow/deny; code that writes/deletes user files (init, orphan cleanup, heal repair). Knock-on: none (checked)."* | `AskUserQuestion` | **(a)** the architect's four |
| Q3 Cap | First, typed into the option dialog: *"No need to add any caps, we just need to be sure our tastings don’t become bloated and enormous"* ("tastings" = tests, his typo). Then, to the driver's confirming question *"Q3 — your 'no caps' answer: is this the right reading?"*: *"Yes: 2-min limit + my OK (Recommended)"* — description: *"No number cap; growth held back by the 2-min npm test limit plus your OK for each new test file. Knock-on: none (checked)."* | typed in the dialog, then `AskUserQuestion` | outside the listed options — **no numeric cap**; replaces ruling 3's "under a cap" (D2) |
| Q4a Release tool's test | *"Keep, run before release (Recommended)"* — description: *"Out of npm test, in its own script; whether `npm run release` runs it is 0530's call. Knock-on: none (checked)."* | `AskUserQuestion` | **(c)** kept outside the default suite |
| Q4b Byte parity | *"Keep (Recommended)"* — description: *"Nearly free; small upkeep. Knock-on: none (checked)."* | `AskUserQuestion` | **keep** as a named exception |
| Q5 Task-ID race | *"Keep the test (Recommended)"* — description: *"Simplest, no new code; protects fkit's own repo only. Knock-on: none (checked)."* | `AskUserQuestion` | **(b)** keep `test/task-id-uniqueness.test.js` |
| Q6 Reach | *"Project-neutral prompts (Recommended)"* — description: *"Shipped prompts say 'follow the project's own test rules/key list'; fkit's fence/cap live in CONTRIBUTING + knowledge base. Knock-on: none (checked)."* | `AskUserQuestion` | **(a)** project-neutral shipped wording |
| Q7 Sign-off | *"Sign off as written (Recommended)"* — quoted in full, with the question and description, in the Status line | `AskUserQuestion` | **accepted** |

Context the owner was given for Q1 (driver figures, one run, the driver's Mac **not verified idle**):
`test/skill-ownership-hook.test.js` 260 tests ~9.7 s; `test/launcher-contract.test.js` 43 tests ~29.1 s;
so the four cases ≈ 97 s per run — **an estimate, not measured as a whole**. The driver also checked
that the repo is public and CI runs on `ubuntu-latest`, so standard-runner minutes are free. The
driver told the owner that choosing (c) means `0530` waits on a producer re-brief adding the nightly
schedule.

## Context

### The owner's decision (verbatim)

Owner decision, 2026-10-19, `fkit lead` session, typed:

> "I am making a decision that we need to RADICALLY reduce the tests in fkit: I belive we're in the
> "self-enforced-loop" when tests and further development creates more tests and more re-runs of the
> same tests. Pause all tasks, and start doing this thing - brief a separate task for that, discuss it
> with all agents that needed. We no longer are ok with such insane amount of time needed for tests."

Earlier, same session: *"The 60-90 min durations look INSANE for the fkit lib (which is basically a
harness for LLMs, not anything super computational)"*.

### The owner's rulings (`AskUserQuestion`, `fkit lead` session, 2026-10-19, verbatim)

1. **Which option** — typed answer: *"Chose the option that is reducing the time most radically."*
   ⚠️ **This was the lead's reading of his words: option D.** The owner could correct that reading at
   brief review. **2026-10-19 — reading confirmed by the owner.** Via `AskUserQuestion`, `fkit lead`
   session, selected option text, verbatim: *"Yes, option D (Recommended)"* — description he saw:
   *"All five briefs stand as written."* (Recorded on the `Sprint 13` board as S1.)
2. **Time limit** — *"≤ 2 min, CI-enforced (Recommended)"*: the default `npm test` takes ≤ 2 min
   locally on an idle Mac; CI fails the job if it goes over.
3. **Growth stop** — *"Owner-approved only (Recommended)"*: *"New prove-red case only with your OK,
   under a cap. 'Missing test' on correct code = suggestion, not a defect (except a short key list).
   Coder rule narrowed."* — its *"under a cap"* wording is replaced by the owner's Q3 answer (no
   numeric cap; D2).
4. **Case 48** — *"Check first (Recommended)"*: *"One isolated Linux run (CI branch/container) as the
   first step of the task; then decide the banner tests' fate."* → task `0526`.

### Option D, as it was put to the owner (the architect's option)

Quoted from task `0527`'s brief: *Reset to ADR-014's original fence. **Keep** only shipped-script
behaviour tests — category 1 (launcher, init, hooks) and category 2 (shipped skill executables:
`dashboard.sh`, `throughput.mjs`, the heal `check.sh` / `repair.sh`). **Delete** prove-red, or keep ≤ 5
"crown-jewel" mutations (role-lock matrix, `--resume`, cold-start `exec`) **outside** the default
`npm test`. **Delete** categories 3–5: repo-only `bin/` tooling tests (including `release-summary` and
the four board tests), the ~9 prompt-wording guard tests, and the ~9 `ai-agents/` process-document /
repo-content tests. Expected default `npm test`: about 1–1.5 min locally (inferred, not measured).
Risk stated to the owner: "risk of silent role-lock bugs".*

### The evidence

**2026-10-19 consult figures, not re-measured here** (from task `0527`'s brief, *Evidence*):

- **Growth, 2026-07-15 → 10-17:** test files 1 → 42; prove-red mutations 2 → 55; test lines ~250 →
  ~22.3k, plus prove-red 2,533 lines. Test code ~25.7k lines against ~7.3k lines of shipped shell/JS. CI
  median job W33 244 s → W42 778 s (max 1320 s).
- **The loop:** since 2026-09-16, of 35 closed tasks, 19 touched tests, 11 added a test file, 5 added
  mutations, 4 were about the test system itself (`0395`, `0477`, `0480`, `0502`). No rule ever retires
  a test.
- **Where the time goes** (slowest CI run 38904713361, 1310 s): seven whole-suite passes 48% (the unit
  pass plus prove-red's `run_suite` ×6); `run_suite` globs all test files though only 5 read
  `FKIT_LAUNCHER`; one of those passes exactly duplicates the unit pass. Update-banner group 32%;
  dashboard 12%; release 6%.
- Process-document and wording tests take ~0 s each; their cost is upkeep and false reds (CI was red
  at `78b7464` from a live-corpus test).

**Re-counted for this ADR, 2026-10-19, working tree at HEAD `78b7464` plus other tasks' uncommitted
work:** `test/` holds **42** `*.test.js` files (22,344 lines), `test/prove-red.sh` (2,533 lines, **55**
`--- Mutation N` blocks), and 836 lines of `test/*.mjs` helpers. One-run timings on the architect's Mac
(not verified idle — indicative only): `test/release-summary.test.js` **38.3 s** (30 tests),
`test/task-id-uniqueness.test.js` 0.38 s, `test/dual-home-parity.test.js` 0.07 s.

### What task `0526` found (summary — its worklog is the record)

Task `0526` ran prove-red mutation 48 on an isolated Linux container. **Its answer: "No — a real Linux
user does not get a slow launch from this code path."** Scope, as it states it: git answering at once
(a stub) or real git over file transport; **not covered:** real git over https, and a real user's tty.
Mutation 48's ~217 s is a test-harness cost (a held stderr pipe under dash), not a launcher bug. Its
recommendation for `0529`: keep all banner tests; the cost is the three `0284` timing tests (~25 s per
run) plus mutation 48's ~192 s excess; each speed-up is its own owner-approved brief — one test-only,
one that changes shipped code (a test override for the hard-coded `FKIT_NET_TIMEOUT`). See the
[worklog](../../tasks/done/0526-check-prove-red-mutation-48-on-one-isolated-linux-run-before-deciding-the-banner-tests/worklog.md),
sections *The answer* and *Recommendation for the banner tests (for 0529)*.

### How the fence grew

- [ADR-014](adr-014-how-fkit-tests-itself.md) §2 (2026-07-13): *"In scope, exactly two things"* — the
  argv fkit hands to `claude`, and the `skillOverrides` map — *"and it stays this size"*.
- [ADR-017](adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md) rule 4
  (2026-07-16): a third — *"the stdout contract of a shipped skill executable"*.
- A **"fourth category"** — invariants over the repo's own content rather than product behaviour — was
  recorded **only in test-file headers**, never in an ADR: `test/task-id-uniqueness.test.js` (its
  header: *"SCOPE: this is a FOURTH test-scope category"*, citing an owner ruling of 2026-07-20 for *"a
  header note, not an ADR amendment"*), then `test/coordination-citation-policy.test.js`,
  `test/adr-number-uniqueness.test.js`, `test/skill-frontmatter.test.js` and
  `test/dual-home-parity.test.js`, each declaring itself another instance of it.

  > ⚠️ **Dated note 2026-10-19 (`0527` review R1) — 14 test files claim the fourth category, not
  > the 5 named above.** Verified against live files 2026-10-19 (`grep -il fourth test/*.test.js`,
  > each hit read): the five above plus `test/mover-exemption-step.test.js`,
  > `test/plan-review-switch.test.js`, `test/reference-integrity.test.js`,
  > `test/spawned-write-marker.test.js`, `test/sprint-loop-later-sprint-record.test.js`,
  > `test/structure-manifest.test.js`, `test/structure-spec.test.js`, `test/top-level-doc-links.test.js`
  > and `test/wiki-flag-convention.test.js`. The bullet above is left byte-identical.

## Decision

### D1 — The fence

A test in fkit's suite may cover **only the behaviour of a shipped script, seen from outside** (inputs
in, exit code / output / files written out — no sourcing or mocking of internals, ADR-014 §2):

1. **Category 1 — the launcher, init, and hooks:** `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`,
   the hook scripts under `claude/`, and `claude/skills-for-role.sh`, which they source.
2. **Category 2 — shipped skill executables** (`dashboard.sh`, `throughput.mjs`, the heal `check.sh` /
   `repair.sh`) — [ADR-017](adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md)
   rule 4's category, taken in **unchanged**.

It may **not** cover:

3. **Category 3** — repo-only tooling under `bin/` (it never ships);

   > ⚠️ **Dated note 2026-10-20 (ADR-058) — one `bin/` script now ships.** By owner ruling of
   > 2026-10-20 (quoted in
   > [ADR-058](adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md)),
   > `install.sh` will ship `bin/fkit-board.mjs` (task `0536`), so once that lands it is a shipped
   > script inside D1's fence, not category 3. No test file for it is pre-approved — a new one needs
   > the owner's OK (D2.1; ADR-058 *§Consequences*). Its earlier tests were deleted by `0529` as
   > category 3. The item above is left byte-identical.
4. **Category 4** — the wording or shape of shipped prompt and document files under `claude/` (skills,
   agents, specs, scaffold documents);
5. **Category 5** — the content of this repo's own `ai-agents/` tree;

— **except the named exceptions this ADR lists in D7**, and no others. LLM behaviour stays out
(ADR-014 §2). Which of today's 42 files falls in which category, and is kept or deleted, is `0529`'s
per-file table, not this ADR's.

> ⛔ **Dated note 2026-10-20 (owner ruling, Sprint 14 A3, item D2) — *"and no others"* above is
> overturned in one respect: the board's own code is inside the fence.** Do not read categories 1–2
> as excluding the board module `board/` (ADR-052 D1). Tests of it, under `test/board/`, **count as
> covered by D1, because the board will ship** (ADR-052 D7, task `0443`) — before it ships as well as
> after. How they run:
>
> - **Inside the default `npm test`.** Task `0417` adds `test/board/*.test.js` to `package.json`'s
>   `"test"` script; verified against live files 2026-10-20, that script is
>   `node --test test/*.test.js`, which does not reach `test/board/`.
> - **Inside the 2-minute budget** (D10, unchanged). The coder names any slow board test in the task's
>   plan, before building it.
> - This is **not** a fifth D7 exception and does not bring back the fourth category; D7 stands.
>
> **Owner ruling**, 2026-10-20, via `AskUserQuestion`, `fkit lead` session, relayed verbatim by
> `fkit-lead`. Question as shown: *"Go ahead with this plan?"* Selected option text, verbatim: *"Yes,
> all of it (Recommended)"* — description he saw: *"Ship the view-only board to every fkit user now,
> and start the Node rebuild (Sprint 14)."* The plan he saw just before said, in the relevant part
> (quoted): *"Saying yes also allows two things behind the scenes: - The board's code gets automated
> tests. One test file per task, up to 6, pre-approved now, so you won't be asked about each file."*
> The full plan is quoted in ADR-058 and on the Sprint 14 board's A3 row. ⚠️ He saw that plain
> wording, not the details in the bullets above: those are the architect's consult terms (option A,
> D2) that the plan summarised and his *"Yes"* approved. The text above is left byte-identical.

### D2 — Growth stop (ruling 3)

1. **No new test file and no new prove-red case without the owner's OK** — each one, every time, in
   any lane (the default suite, the nightly prove-red lane, the release-test lane).

   > ⚠️ **Dated note 2026-10-20 (owner ruling, Sprint 14 A3, item D3) — the owner has given his OK in
   > advance for up to six board test files.** The rule above stands; this is that OK, given ahead of
   > time. Pre-approved: **at most 6 new test files, all under `test/board/`, one per task, for tasks
   > `0417`, `0418`, `0419`, `0420`, `0421` and `0422`.** Each task's plan still names its file by path.
   > Not covered: **`0423`'s Python-vs-Node check is a one-off script whose output the worklog pastes,
   > not a kept test**; a second file in any one task, a file for any other task, a test for
   > `bin/fkit-board.mjs` or its launcher route (ADR-058), and any new prove-red case — each goes back
   > to the owner. D2.3 (the key list) is untouched. The ruling is quoted in the ⛔ note below §D1 —
   > deliberately not restated here, so there is one place to keep true rather than two. The item
   > above is left byte-identical.
2. **No numeric cap** (owner, Q3). Growth is held back by two things only: the owner's OK above, and
   the 2-minute budget on the default `npm test` (D10). **This owner answer replaces ruling 3's "under
   a cap" wording** — an owner ruling, not the architect's call. The owner's stated aim, verbatim:
   *"we just need to be sure our tastings don’t become bloated and enormous"*.
3. A "missing test" on correct code is a **suggestion, not a defect** — except for the **key list**
   (owner, Q2), where a missing test on correct code is still a defect:
   1. the argv the launcher hands to `claude`, including whether it `exec`s at all (`--resume`, cold
      start);
   2. the role-lock `skillOverrides` matrix;
   3. the skill-ownership hook's allow / deny decision;
   4. any code path that writes or deletes a file in a user's project (init's convergence and
      never-overwrite rule, orphan cleanup, heal `repair.sh`).

   Why these four: each is a silent-wrong failure (green exit, wrong authority or a lost user file —
   ADR-014 Context force 1). Not chosen: role lock only (items 1–3), which leaves user-file safety to
   review alone; the four plus a shipped skill executable's output contract, which brings the
   "missing test = defect" pressure back to the dashboards.

Not chosen for the cap: the architect's proposal (at most 2 new default-suite test files per sprint,
prove-red ≤ 5 cases); "one in, one out". The architect's warning stays on record as the reason for a
re-raise condition (§Consequences): the budget alone does not stop ~0 s content-style tests piling
up — their cost is upkeep and false reds, not seconds — so the owner's per-file OK is the only brake on
them.

### D3 — Prove-red

ADR-026 Decision 4 (wire `prove-red.sh` into an automated gate, today inside the default `npm test`) is
amended: prove-red **leaves the default `npm test`** and stays an automated gate in a **nightly CI
lane** — the lane Decision 4 itself foresaw (*"plausibly belongs in a `test:full` / CI lane"*); the
case count and the lane change (owner, Q1 (c), *"fine for now"*).

> ⚠️ **Dated note 2026-10-19 (`0527` review R4) — ADR-026 Decision 4 is not amended; it stands.**
> *"is amended"* above, *"amends"* in this ADR's *Supersedes / Amends* header bullet and *"amended"* in
> §Related are the wrong word. Decision 4 is *"wire `prove-red.sh` into an automated gate"*, and it
> already foresaw a `test:full` / CI lane; prove-red stays an automated gate. What changes is a fact
> Decision 4 describes — the lane (out of the default `npm test`, into a nightly CI lane) and the case
> count (four) — so ADR-026 carries a ⚠️ drift note, not a ⛔. Verified against live files 2026-10-19:
> ADR-026's *Corrections* header item and its note below Decision 4 both say Decision 4 stands; that
> reading is the right one. §D3's own decision is unchanged. The paragraph above is left
> byte-identical.

- **Four cases, and only these** (today's numbering; `0529` renumbers if it rewrites the file):
  **M1** (break a `skills_for_role()` entry → runs only `test/skill-ownership-hook.test.js`), **M2**
  (restore the `--resume` passthrough → only `test/launcher-contract.test.js`), **M30** (put `exec`
  back on the cold start → only `test/launcher-contract.test.js`), **M31** (the same, on the intake path
  only → only `test/launcher-contract.test.js`). Each case runs **only the test file it needs** — never
  the whole glob. A fifth case needs the owner's OK (D2.1). The other 51 cases are deleted.

  > ⚠️ **Dated note 2026-10-19 (`0527` review R2) — "→ only `<file>`" above is the target, not today's
  > behaviour.** Verified against live files 2026-10-19: in `test/prove-red.sh` only M1 runs one file
  > (`run_hook_suite`, which runs `test/skill-ownership-hook.test.js`); M2, M30 and M31 call
  > `run_suite`, which runs `node --test "$repo"/test/*.test.js` — every test file. Making those three
  > run only `test/launcher-contract.test.js` is a change `0529` makes. The four cases also rely on
  > green baselines (today steps 0a and 0b for `run_suite`, 0c for the hook suite); the baselines the
  > kept cases need stay with them, narrowed the same way — which ones, `0529`'s call. The bullet above
  > is left byte-identical.

  > ⚠️ **Dated note 2026-10-20 (`0529`) — the file was rewritten, and the numbers were kept.**
  > *"`0529` renumbers if it rewrites the file"* above did not happen, by owner ruling: 2026-10-20, via
  > `AskUserQuestion`, `fkit lead` session (the `/fkit-sprint-ship-loop` run, Sprint 13), relayed by the
  > driver. Question as shown: *"Q1 — Prove-red case numbers?"* Selected option text, verbatim: *"Keep
  > M1/M2/M30/M31 (Recommended)"* — description he saw: *"Fewest edits; ADR-057 gets a dated note. Knock-on: none
  > (checked)."*
  > Verified against live files 2026-10-20: `test/prove-red.sh` holds exactly these four cases, numbered
  > M1, M2, M30 and M31, plus two green baselines on unmutated copies — 0b
  > (`test/launcher-contract.test.js`) and 0c (`test/skill-ownership-hook.test.js`). M1 runs only
  > `test/skill-ownership-hook.test.js`; M2, M30 and M31 run only `test/launcher-contract.test.js`. The
  > R2 note's target is today's behaviour. The bullet and the note above are left byte-identical.
- **When it runs:** nightly, on a CI schedule — **not** on every push, and not in the 2-minute budget
  (D10). Still runnable by hand with `npm run test:prove-red`. A nightly failure is seen the next
  morning, not at push time; the owner accepted that delay *"for now"*.

  > ⚠️ **Dated note 2026-10-20 (`0529`) — the nightly lane does not exist yet, so for now prove-red
  > runs in no automated gate.** Verified against live files 2026-10-20: `package.json`'s `"test"`
  > script is `node --test test/*.test.js` (no prove-red), and `.github/workflows/test.yml` runs only
  > `npm test`, with no schedule. Until task `0530` adds the nightly lane, `npm run test:prove-red`
  > runs only by hand — the state option (b) below describes, here as a window, not an end state.
  > `0529`'s owner-approved plan (2026-10-20) names that window, and `RELEASING.md` tells whoever
  > releases to run it by hand first. §D3's decision is unchanged. The bullet above is left
  > byte-identical.

  > ⚠️ **Dated note 2026-10-20 (`0530`) — the nightly lane now exists, so the window in the note above
  > closes once it is on `main`.** Verified against live files 2026-10-20:
  > `.github/workflows/prove-red.yml` runs `npm run test:prove-red` on a schedule
  > (`cron: '17 3 * * *'`, 03:17 UTC daily) and on demand (`workflow_dispatch`), with a 15-minute job
  > timeout; it is not on push and not in `npm test`, so it stays outside the 2-minute budget (D10).
  > `.github/workflows/test.yml` still runs only `npm test`. GitHub runs a schedule only from the
  > default branch's latest commit, so the lane takes effect when this file is committed and pushed to
  > `main` — at this writing it is not yet pushed (the owner's call), it has no runner run, and its
  > runner time is pending (task `0530` plan step 7). Its known limits (may be delayed or dropped at
  > busy times; disabled after 60 days with no repository activity; a red run notifies the user who
  > last changed the cron line, if their Actions notifications are on) are in the file's header
  > comment and `CONTRIBUTING.md`. §D3's decision is unchanged. The bullet and the note above are left
  > byte-identical.
- **Cost, as told to the owner:** about 97 s per nightly run (driver estimate from two one-run file
  timings — see *§Owner answers*); standard-runner minutes are free for this public repo.

  > ⚠️ **Dated note 2026-10-19 (`0527` review R2) — the ~97 s leaves out the green baselines.** It is
  > the four mutated runs only (9.7 s + 3 × 29.1 s). Each case also needs a green run of the same file
  > unmutated (see the note under *"Four cases"* above); by the same one-run figures that adds about
  > 39–68 s (one hook baseline plus one or two `launcher-contract` baselines) — roughly 136–165 s a
  > night. Arithmetic, not measured. This lane is outside the 2-minute budget (D10). The bullet above,
  > and the figure the owner was told in *§Owner answers*, are left byte-identical.
- **The schedule is not in `0530`'s brief today**: `0530` waits on a producer re-brief that adds it.

  > ⚠️ **Dated note 2026-10-20 (`0530`) — `0530` was re-briefed with the schedule, and has built it.**
  > Verified against live files 2026-10-20: `0530`'s brief now asks for the nightly prove-red lane
  > (its *"Nightly prove-red lane (ADR-057 §D3, owner Q1 (c)"* item). What was built is carried in the
  > `0530` note below *"When it runs"* above — deliberately not restated here, so there is one place to
  > keep true rather than two. The bullet above is left byte-identical.

Not chosen: (a) delete prove-red entirely (no check at all that the role-lock tests can go red);
(b) the same four cases, run by hand only (the architect's proposal — catches "a test that cannot
fail" only when someone remembers to run it).

### D4 — The reviewer's must-keep list (2026-10-19 reviewer consult), item by item

| Item | Category under D1 | Keep or drop | Why |
|---|---|---|---|
| Launcher argv | 1 | **Keep** (by D1) | shipped-script behaviour; ADR-014 §2's first thing |
| Role-lock matrix | 1 | **Keep** (by D1) | the `skillOverrides` map; ADR-014 §2's second thing and §5's hard-coded oracle |
| Skill-ownership hook | 1 | **Keep** (by D1) | a shipped hook; the wall ADR-018 rests on |
| Convergence / never-overwrite | 1 | **Keep** (by D1) | init behaviour in a user's project, unattended, every launch |
| The release tool (`bin/release.mjs`, `test/release-summary.test.js`) | 3 | **Keep, outside the default suite** (owner, Q4a) | named exception (D7): its own script, run before a release |
| Scaffold-vs-dogfood byte parity (`test/dual-home-parity.test.js`) | 5 | **Keep, in the default suite** (owner, Q4b) | named exception (D7) |

The four category-1 items are kept by D1 itself; the owner confirms them with the sign-off.

- **The release tool's test** (owner, Q4a (c)): `test/release-summary.test.js` leaves the default
  `npm test` and runs in **its own script, before a release**. Why: it took 38.3 s in one run here —
  about a third of the 2-minute budget — for a tool only the owner runs, yet it is the only check on
  the tag / push / summary logic of a tool that publishes releases. Today `npm test` runs every
  `test/*.test.js`, so keeping it out means moving it out of that glob (or narrowing the glob).
  **Whether `npm run release` runs it is `0530`'s call** (its release-gate question). Not chosen: keep
  it in the default suite; drop it.

  > ⚠️ **Dated note 2026-10-20 (`0529`) — the test has moved.** Verified against live files
  > 2026-10-20: it is now `test/release/release-summary.test.js`, run by `npm run test:release`
  > (`node --test test/release/*.test.js`), so the default `npm test` glob, `test/*.test.js`, no longer
  > picks it up. `test/release-summary.test.js` — the path in §D4's table, in this bullet, in §D7's
  > table and in §Context's 2026-10-19 re-count — no longer exists; those are left byte-identical.
  > `bin/release.mjs` still runs only `npm test`, so until task `0530` settles the release gate the
  > release tool's own test runs only by hand (`RELEASING.md` says so). The bullet above is left
  > byte-identical.

  > ⚠️ **Dated note 2026-10-20 (`0530`) — `npm run release` now runs the release tool's test; the
  > by-hand window in the note above has ended.** Verified against live files 2026-10-20:
  > `bin/release.mjs`'s `runTests()` runs `npm test`, then `npm run test:release`, before the release's
  > first write, and refuses on the first red (*"refusing to release an untested tree"*); `--no-test`
  > skips both. That settles this bullet's *"Whether `npm run release` runs it is `0530`'s call"*: the
  > owner chose *"Release test too (Recommended)"* via `AskUserQuestion`, 2026-10-20, in the live
  > `fkit lead` session, approving `0530`'s plan (its Q2; Q1 *"Release runs tests itself
  > (Recommended)"* keeps the in-release gate). The release does not run prove-red, which stays in
  > the nightly lane (§D3). The note's *"still runs only `npm test`"* and *"runs only by hand"* no
  > longer hold; the bullet and the note above are left byte-identical.
- **Scaffold-vs-dogfood byte parity** (owner, Q4b): `test/dual-home-parity.test.js` stays in the
  default suite. Why: 0.07 s here, and it guards what every consuming project receives at init (the
  scaffold must match the live copy fkit runs on itself — ADR-027). Cost accepted: small upkeep and a
  live-corpus test's false-red risk. Not chosen: drop it, leaving only the
  `conventions/dual-home-parity.md` rule, followed by hand.

### D5 — ADR-029 Decision 3 (the cross-branch task-ID race): its check stays

ADR-029 Decision 3 accepts the race and names **detection** — a duplicate-ID assertion in the test
suite, today `test/task-id-uniqueness.test.js` — as its **sole** mitigation. **That test stays**, in
the default suite, as a named exception (D7) (owner, Q5 (b)). ADR-029 Decision 3 therefore stands
whole; only the licence for the test changes — it now rests on this ADR's named exception, not on the
retired "fourth category". Cost accepted: 0.38 s here, small upkeep, a live-corpus test's false-red
risk; it protects **fkit's own repo only** — consuming projects get no duplicate-ID check.

Not chosen: (a) accepted risk, no check (a duplicate merges silently; its links may point at the wrong
task); (c) move detection into a shipped script that already reads the boards, e.g. a new drift rule in
`dashboard.sh` — new shipped code and its own brief, which would protect consuming projects too.
That remains the upgrade path if the owner later wants them covered.

### D6 — The reference-integrity condition

Its two enforcing tests (`test/reference-integrity.test.js`, `test/coordination-citation-policy.test.js`)
are category 5 and go with `0529` (no question here keeps them). The architect proposes, for the
owner's sign-off:

- **(a) What replaces the movers' instruction.** The four movers (`fkit-task-done`,
  `fkit-task-cancelled`, `fkit-sprint-done`, `fkit-sprint-cancelled`) stop telling the producer to run
  `node --test test/reference-integrity.test.js` and to act on its `NAMED_EXEMPT` keys. **The producer's
  own resolve-every-link hand check, which each mover already performs, becomes the stated check** — and
  the close report says plainly that no automated link check ran. (`0529` step 5 makes this edit;
  backlog task `0522`, whose whole subject is that instruction, is superseded by it — `0529`'s brief
  already proposes cancelling `0522`.)
- **(b) The report's §1 principle** (*"A markdown link is a pointer. A `path` + line-number citation is
  a claim."*) **survives as a written rule with no test.** Both of its halves already have their own
  homes, which stay binding: the pointer half in `fkit-task-done`'s link-repair rule, the claim half in
  [`conventions/durable-citation-anchors.md`](../conventions/durable-citation-anchors.md). The report's
  matcher specification (its §4) and its measured red sets retire with the tests.

### D7 — The fourth category is retired

No test may cite "the fourth category" as its licence. A test outside categories 1–2 (D1) survives only if it is
named here:

| Named exception | Category | Lane | Owner answer |
|---|---|---|---|
| `test/dual-home-parity.test.js` | 5 | default `npm test` | Q4b |
| `test/task-id-uniqueness.test.js` | 5 | default `npm test` | Q5 (b) |
| `test/release-summary.test.js` | 3 | its own script, before a release | Q4a (c) |

No other. Each kept file's header that cites "the fourth category" as its licence is reworded to cite
this ADR's D7 (`0529`'s edit — this task touches no test file).

> ⛔ **Dated note 2026-10-19 (`0527` review R1) — "No other" above is overturned in one respect: there
> is a fourth named exception.** Do not delete `test/structure-manifest.test.js`.
>
> | Named exception | Category | Lane | Owner answer |
> |---|---|---|---|
> | `test/structure-manifest.test.js` | 4 (the shipped `claude/structure-manifest.tsv`, checked against `bin/generate-structure-manifest.mjs`) | default `npm test` | R1 ruling, below |
>
> **Owner ruling**, 2026-10-19, via `AskUserQuestion`, `fkit lead` session (the
> `/fkit-sprint-ship-loop` run, Sprint 13), relayed verbatim by the driver. Question as shown: *"R1 —
> the heal fingerprint-list check (test/structure-manifest.test.js, 0.36 s): keep it or lose it?"*
> Selected option text, verbatim: *"Keep it (Recommended)"* — description he saw: *"Stays in npm test
> as a 4th named exception; ADR-057 gets one dated note. Knock-on: none (checked)."*
>
> **Why** (verified against live files 2026-10-19): it is the only check that the shipped manifest
> matches its generator — `bin/release.mjs` never reads the manifest, `test/structure-spec.test.js`
> checks only that spec paths appear in it, and `test/structure-check.test.js` stays green with a
> stale one. A stale manifest makes heal's `check.sh` call an untouched file owner-edited (*"report
> with diff, never touch"*), so heal stops offering that repair (key list item 4, D2.3). Cost: 5 tests,
> 0.36 s in one run here, and the full-clone CI checkout it already needs. The rest of D7 stands: no
> test may cite "the fourth category" as its licence, and no exception beyond these four. With this
> test kept, the `claude/structure-manifest.tsv` line in the dated note below §D9 needs no change.
> The text above is left byte-identical.

> ⚠️ **Dated note 2026-10-20 (`0529`) — the `test/release-summary.test.js` row in §D7's table: that
> path has moved.** See the note below §D4's *"The release tool's test"* bullet — deliberately not
> restated here, so there is one place to keep true rather than two. The table and the ⛔ note above
> are left byte-identical.

### D8 — Banner tests

Their fate is `0526`'s finding (above), which `0529` applies; this ADR does not restate or re-decide
it. **Rule, for new tests only:** *a new timing test must not sleep for real.* **A tension this ADR
does not settle, named for `0529`'s planner:** `0526` recommends keeping the three `0284` timing tests,
which sleep (~25 s per run) because the launcher's network timeout `FKIT_NET_TIMEOUT` is hard-coded,
while `0529`'s brief says *"Whatever stays must not sleep for real"*. Removing the sleep needs either a
test-only change or a shipped-code change (a timeout override) — each its own owner-approved brief, per
`0526`.

### D9 — The prompts and documents that must change

Found by `grep` over `claude/` and `CONTRIBUTING.md`, 2026-10-19 (the brief's step-6 list plus a sweep).
Cited by file + quoted phrase.

| File | Wording today | Change | Task |
|---|---|---|---|
| `claude/agents/fkit-coder.md` | *"add or update tests for the behavior you changed"*; *"Run the full suite before a release, when you change the tests or test tooling themselves, and whenever you are unsure which checks apply: when in doubt, run more"* | project-neutral wording (Q6, below) | `0528` |
| `claude/skills/fkit-adversarial-review/SKILL.md` | *"**Missing tests** — behavior changed with no test covering it"*; *"**Missing or wrong tests** — … or a check that cannot fail"* | a suggestion, not a defect, unless the project's own key list names it (Q6) | `0528` |
| `claude/skills/fkit-task-ship-loop/SKILL.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md` (Verify) | *"run the full suite at release, when the tests or test tooling change, or when unsure"* | the project's default test command (Q6); no "full suite" beyond it | `0528` |
| `claude/skills/fkit-plan-task/SKILL.md` | *"plan the full suite at release, when the tests or test tooling change, or when unsure"* | same | `0528` |
| `claude/skills/fkit-review/SKILL.md` | *"the full suite when unsure"*; also names `test/prove-red.sh` (*"opens with `mktemp -d`"*) | same; the prove-red reference kept or reworded to match `0529`'s rewrite of that file (prove-red survives, D3) | `0528` / `0529` |
| `claude/skills/fkit-stateful-review/SKILL.md`, `fkit-process-stateful-review/SKILL.md`, `fkit-process-review/SKILL.md` | classification of a missing test (*"a missing test, a broader pattern"* in `fkit-process-review`); the two stateful skills name `test/coordination-citation-policy.test.js` | missing test = suggestion unless the project's own key list names it (Q6); drop the test name | `0528` / `0529` |
| `CONTRIBUTING.md` *What to run for a change* | *"A release, or **unsure** … When in doubt, run more."*; rows naming deleted tests and prove-red | rewrite for the smaller suite; times "to be re-measured by `0530`" | `0528` (rules), `0529` (rows), `0530` (times) |
| The four movers (`fkit-task-done`, `fkit-task-cancelled`, `fkit-sprint-done`, `fkit-sprint-cancelled`) | *"`node --test test/reference-integrity.test.js`"* (20 references) | per D6 (a) | `0529` |
| `claude/skills/fkit-record-decision/SKILL.md`, `claude/skills/fkit-wiki-lint/SKILL.md` | name `test/adr-number-uniqueness.test.js` (*"all three must agree"*) | drop or reword if that test is deleted | `0529` |
| `claude/skills/fkit-task-brief/SKILL.md` step 6 | *"The chosen answer is **detect, not prevent** — a duplicate-ID check"* | stays true (D5 keeps the check); reword only if it cites the test's licence | `0529` |
| `claude/carry-check-hook.sh` / `.mjs`, `claude/skills/fkit-status/dashboard.sh`, `throughput.mjs` | name prove-red in comments / a data row | comments: fix any the prove-red rewrite (D3) makes wrong, per the code-comment rule; the `throughput.mjs` row is history data — leave it | `0529` |

> ⚠️ **Dated note 2026-10-19 (`0527` review R3) — two shipped files that name tests are missing from
> the table above.** Verified against live files 2026-10-19:
>
> - `claude/structure-spec.md` says its tables *"are parsed by `test/structure-spec.test.js`"* — a
>   test §D11 files as category 4, so not one of §D7's named exceptions. Change: drop or reword the
>   test name when that test is deleted. Task: `0529`.
> - `claude/structure-manifest.tsv`'s header says *"`test/structure-manifest.test.js` goes red when
>   stale"*. That header is written by `bin/generate-structure-manifest.mjs` (*"DO NOT EDIT BY HAND"*),
>   so any change goes in the generator, then a regenerate (`npm run generate:manifest`). Change:
>   needed only if that test is deleted — not settled by this note. Task: `0529`.
>
> Task `0527`'s worklog left both out because *"These name **kept** (category 1–2) tests"*; for these
> two that reason is wrong. The table above is left byte-identical.

**How much of this reaches consuming projects — project-neutral shipped prompts** (owner, Q6 (a)).
The shipped coder and reviewer prompts install into **every** consuming project and govern **that
project's** code, not fkit's tests. So:

- **Shipped prompts** (everything under `claude/` that installs into a project) get **project-neutral**
  wording — in substance: *follow the project's own test rules and key list; a missing test on correct
  code is a suggestion unless the project's key list names it; run the project's default test
  command.* They never state fkit's fence (D1), key list (D2.3) or budget (D10).
- **fkit's own rules** — D1, D2, D3, D7, D10 — live in `CONTRIBUTING.md` and this knowledge base,
  which fkit's own agents read as "the project's own test rules" when working in this repo.
- **Left to `0528`'s planner, not settled here:** the exact neutral wording, including what a
  consuming project with **no written test rules or key list** gets by default. Under the wording above
  every missing test there becomes a suggestion — a change in behaviour for consuming projects, which
  `0528` must show the owner in its plan.

Not chosen: (b) ship fkit's narrowed rule as is (tells every project that tests are for "shipped
scripts", which only makes sense for fkit); (c) change only fkit-repo documents (fkit's own agents read
the same shipped prompts, so the loop would continue here).

### D10 — The budget

The default `npm test` takes **≤ 2 min locally on an idle Mac**, and **CI fails the job if it goes
over** (ruling 2). `0530` enforces it. A non-default lane (nightly prove-red, D3; the release-test script, D4)
is not part of the budget.

### D11 — Other ADRs that name a test as their enforcement

Their **decisions stand**; only the enforcing test may go. Found by `grep` for `test/<name>` over
`decisions/`, 2026-10-19. Category is the architect's reading under D1; **each test's fate is set by
`0529`'s per-file table.** The ⚠️ drift note in each ADR is written **when `0529` actually deletes the
test** — not by this task, because a note written now would state something not yet true. Who writes
them (an architect spawn inside `0529`, or a follow-up) is the producer's routing.

| Test | ADRs that name it | Category |
|---|---|---|
| `test/askuserquestion-marker-hook.test.js` | ADR-036 | 1 |
| `test/closed-rank-immutability.test.js` | ADR-035, ADR-046 | 5 |
| `test/converge-contract.test.js` | ADR-029, ADR-036 | 1 |
| `test/coordination-citation-policy.test.js` | ADR-047 | 5 |
| `test/dashboard-contract.test.js` | ADR-040, ADR-047 | 2 |
| `test/dual-home-parity.test.js` | ADR-027, ADR-036 | 5 — kept, D7 (Q4b) |
| `test/mover-exemption-step.test.js` | ADR-050 | 4 |
| `test/orphan-cleanup.test.js` | ADR-036 | 1 |
| `test/reference-integrity.test.js` | ADR-047, ADR-048 | 5 |
| `test/rules-block-budget.test.js` | ADR-036, ADR-037 | 1 (init's size guard) |
| `test/skill-frontmatter.test.js` | ADR-036 | 4 |
| `test/skill-ownership-hook.test.js` | ADR-025, ADR-033, ADR-036, ADR-044 | 1 |
| `test/structure-spec.test.js` | ADR-043 | 4 |
| `test/prove-red.sh` | ADR-026, ADR-027, ADR-028, ADR-042, ADR-046 | kept, cut to four cases, nightly (D3) — an ADR citing one of the 51 deleted cases gets its note when `0529` deletes that case |

A looser sweep (the test's name without `test/`) hits more ADRs, mostly because a hook script and its
test share a name; `0529` re-runs that sweep for each file it deletes.

> ⚠️ **Dated note 2026-10-20 (`0529`) — the notes this section calls for are written.** Task `0529`
> deleted 19 test files, `test/link-condition.mjs` and the two `test/fixtures/closed-rank-0174-*`
> fixtures, and cut prove-red to M1, M2, M30, M31. After re-running the strict and loose sweeps over
> `decisions/` on 2026-10-20 for each deleted file, dated ⚠️ notes now sit in ADR-014, ADR-026,
> ADR-028, ADR-035, ADR-036, ADR-042, ADR-043, ADR-046, ADR-047, ADR-048, ADR-050 and ADR-052, and in
> this ADR. No note was needed in ADR-027 (it names no prove-red case, and its parity test stays,
> §D7) or in ADR-051 (its only hit is a task-folder name containing `board-reader`, not the test).
> None of the five ADRs in the table's `test/prove-red.sh` row cites one of the 51 deleted cases by
> number; ADR-026 and ADR-028 got notes for the lane change, and ADR-042's `mktemp -d` citation and
> ADR-046's *"`prove-red.sh` gains no mutation"* stay true. No ⛔ was needed: every decision stands.
> The table and the paragraph above are left byte-identical.

## Options considered

- **D — reset to shipped-script behaviour (chosen by the owner).** Ruling 1, confirmed as option D.
  The most radical cut in time.
- **B — two tiers** (a fast default suite plus a full tier) — **the architect's recommendation, not
  chosen.** The owner chose the option that reduces the time most radically.
- **A and C** — put to the owner in the `fkit lead` session on 2026-10-19; **their text is not on disk,
  so this ADR does not reconstruct it.**
- **Keep the suite as it is** — rejected by the owner's decision (*"We no longer are ok with such
  insane amount of time needed for tests."*).

## Consequences

- **Positive:** the default `npm test` targets ≤ 2 min instead of ~12 min locally and ~13 min median in
  CI; the suite stops growing by default (every new test file or case needs the owner's OK); upkeep and false reds from content and wording tests go.
- **Negative / costs — accepted with the sign-off:**
  - the risk the owner was told: *"risk of silent role-lock bugs"* — reduced, not removed, by the four
    nightly prove-red cases (D3) and the key list (D2.3);
  - a broken role-lock test is found **the next morning**, not at push time — the owner accepted that
    delay *"for now"* (Q1);
  - guards that go: link and citation checks (D6), ADR-number uniqueness in the suite (left to
    `/fkit-record-decision`'s own step and `/fkit-wiki-lint`), prompt frontmatter and wording guards,
    other repo-content tests (per `0529`'s table), and 51 of prove-red's 55 cases;
  - guards that stay but move out of the default run: the release tool's checks (D4 — only run before
    a release), prove-red (D3 — nightly);
  - guards that stay as named exceptions, with their upkeep and false-red risk: scaffold-vs-dogfood
    parity, task-ID uniqueness (D7) — the latter protects fkit's own repo only;

    > ⚠️ **Dated note 2026-10-19 (`0527` review R1) — this list is missing one guard.** The heal
    > fingerprint-list check, `test/structure-manifest.test.js`, also stays as a named exception, by
    > owner ruling — see the ⛔ note below §D7, deliberately not restated here, so there is one place to
    > keep true rather than two. The bullet above is left byte-identical.
  - consuming projects with no written test rules get "missing test = suggestion" everywhere unless
    `0528`'s wording says otherwise (D9).
- **Residual risks / "re-raise only if":**
  - a role-lock or `--resume` regression ships to users — the crown jewel failed without a test that
    could go red;
  - the nightly prove-red lane fails and stays unnoticed, or its next-morning delay lets a role-lock
    regression reach a release — then running it on every push (the option the owner set aside *"for
    now"*) is the first lever;
  - the 2-minute budget is breached and the fix proposed is "raise the budget" rather than "cut";
  - the suite grows back toward *"bloated and enormous"* **inside** the budget (e.g. many ~0 s content
    tests, each OK'd one at a time) — then a numeric cap, which the owner declined on 2026-10-19 (Q3),
    is the lever to re-raise;
  - a duplicate task ID merges in a **consuming** project and costs real work — then D5's option (c), a
    shipped check, is the lever;
  - a deleted category-4 or -5 guard's failure class recurs **and** costs real work twice.
  - **Do not re-raise** "add a test for X" on correct code outside the key list as a defect — D2.

## Related

- [ADR-014](adr-014-how-fkit-tests-itself.md) §2 (the fence D1 replaces); §1, §3, §4, §5 still bind.
- [ADR-017](adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md) rule 4 (taken in
  unchanged as category 2).
- [ADR-026](adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md) Decision 4 (amended —
  nightly lane, four cases; D3).

  > ⚠️ **Dated note 2026-10-19 (`0527` review R4) — "amended" above: ADR-026 Decision 4 stands.** See
  > the note below §D3's first paragraph — deliberately not restated here, so there is one place to keep
  > true rather than two. The bullet above is left byte-identical.
- [ADR-027](adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md) Decision 2 (stands; its test
  is a D7 named exception).
- [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) Decision 3 (stands; its test
  is a D7 named exception — D5).
- [The reference-integrity condition](../reports/2026-08-29-the-reference-integrity-condition.md) (D6).
- [Task `0526`'s worklog](../../tasks/done/0526-check-prove-red-mutation-48-on-one-isolated-linux-run-before-deciding-the-banner-tests/worklog.md)
  (D8).
- Tasks `0528` (rules), `0529` (the cut), `0530` (the budget and release gate), `0522` (superseded by
  D6 (a)) — cited by ID because their folders move when they close.
- **Wiki:** fkit-wiki should ingest this ADR once accepted, and re-ingest the documents it amends; the
  architect writes nothing under `ai-agents/wiki-vault/`.
