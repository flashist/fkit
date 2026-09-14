# Give the sprint-mover prose pins and `dashboard.sh`'s `successor` mode durable `prove-red.sh` mutations

## ID
0388

## Sprint
Sprint 9

## Priority
P2

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session driving
`/fkit-sprint-ship-loop` — **the option label is the verbatim text**: **"File a follow-up task
(Rec)"**. ⛔ The ruling is *file it*; it settles no design question below.

**The gap.** Task `0341` added two new guarded surfaces and **neither is covered by a mutation in
`test/prove-red.sh`** — the gate that proves a guard can still go red. A guard nothing mutates is a
guard nobody has shown still discriminates.

### The precedent this follows — `0381`

`0381` pinned two byte-exact prose clauses in the **task** movers and gave each a durable mutation in
`test/prove-red.sh`:

| Mutation | What it breaks | Which assertion must red |
|---|---|---|
| **33** — *"inverted the delete rule"* | rewrites `**Delete the key — do not repoint it.**` in `fkit-task-done/SKILL.md` to `**Repoint the key (mutation: delete rule inverted).**` | `T3 … targetIsBack delete rule` |
| **34** — *"left the board word un-swapped"* | swaps `../../cancelled/X` → `../../done/X` in `fkit-task-cancelled/SKILL.md` | `T11 … board-dependent sentences` |

⭐ **Mutation 34's own comment already names this task's subject**: it exists so the uniformity half is
not *"permanently unexercised in this gate"* … *"before task 0341 pastes the clause a third and fourth
time."* ⛔ **`0341` pasted it a third and fourth time and added no mutation.**

### The two uncovered surfaces, measured on disk 2026-09-12

⚠️ **There are TWO SEPARATE `S`-series, in two different files, and the hand-over that produced this
brief ran them together.** They are not the same set and must not be conflated:

1. **`test/mover-exemption-step.test.js` — the SPRINT-mover roster, `S0`–`S6` (seven tests).**
   `S0` roster completeness · `S1` clause subjects present exactly once · `S2` board-dependent
   sentences name **this** mover's board · `S3` clause sits **after** the `git mv` step · `S4` the two
   sprint clauses are identical modulo the board word · `S5` they do **not** carry the task movers'
   `ai-agents/`-only sweep premise · `S6` the two rosters are disjoint.
   ⛔ **Grepped 2026-09-12: `\bS[0-9]\b` in that file returns exactly `S0`–`S6`. There is no `S7`.**
   The same clause is now pinned across **four** skill copies (two task movers + two sprint movers).
   ⛔ **No `prove-red.sh` entry runs against any of these seven.**

2. **`test/dashboard-contract.test.js` — the `ADR-047 successor S1`–`S10` series (ten tests).** Find
   them by name: every one opens `ADR-047 successor S<n>:`, and the block opens under the comment
   *"ADR-047 §3.0.2 / FOLLOW-UP 2 — the `successor` mode (task 0341)."* They cover `mode_successor()`
   in `claude/skills/fkit-status/dashboard.sh` — defined at its `mode_successor() {` line, dispatched
   from the `successor)` case arm.
   ⭐ **This is the series the hand-over's mutation evidence actually refers to** — it names an `S7`,
   and only this series has one (`successor S7: exit 3 and no output when nothing orders above the
   closing sprint`). ⛔ **No `prove-red.sh` entry runs against these ten either.**

### The by-hand mutation evidence — read it as evidence, NOT as a gate

`0341`'s builder mutation-tested `mode_successor` **once, by hand, during the build**: three mutations
on a scratch copy, each measured to red a named test.

| By-hand mutation | Redded |
|---|---|
| negation-vs-swap trap | `successor S6` |
| dropping `🔲 Backlog` from the filter | `successor S3` + `S4` |
| non-strict ordering | `successor S4` + `S7` |

⛔ **That is a one-off measurement from a build, not a gate that re-runs.** Nothing in the repo repeats
it, so nothing will notice when it stops holding. **Converting it into durable entries is the whole
point of this task** — the by-hand result is a strong starting design, not a substitute.

⚠️ **The `S3`/`S4` pairing above is itself a signal worth reading before designing:** a single mutation
redding two tests is fine, but a mutation that reds *everything* proves little. Prefer mutations that
red **one** named assertion where the surface allows it, as mutations 33 and 34 do.

### Why it was deferred rather than done inside `0341`

`0341`'s approved plan §3 did not ask for it, the suite was green, and the mutations are cheap to add
later against a now-stable surface. ⛔ **None of that is an argument that they are not owed.**

## What to build

**Add durable mutations to `test/prove-red.sh` covering both surfaces above.** Estimated **~2–4** new
mutations, **~60–120 s** added to an already **~9-minute** red gate.

### What the implementer must decide with the owner at the plan gate

⛔ **This brief does NOT fix the count, the targets, or the split.** The real questions:

- **How many, and which assertions.** The by-hand three are a candidate set for the `successor`
  series; the sprint-mover roster needs at least one of its own (the board-word / uniformity trap that
  mutation 34 already proves is the live failure mode, now applied to a **sprint** mover).
- **Runtime budget.** Each mutation copies a tree and re-runs a suite. `~60–120 s` on a `~9 min` gate
  is the estimate to test, not a number to trust.
- **Whether the two surfaces are one task or two.** They share nothing but the file they land in.

### Existing machinery to reuse — do not invent a new harness

`test/prove-red.sh` already defines `run_mover_step_suite` (used by mutations 33 and 34) and
`run_dashboard_suite` (used by mutation 32). Both new surfaces are reachable through one of them.

### The discipline mutations 33 and 34 already establish — follow it

- **Injected marker where the prose could occur naturally** (mutation 33's `mutation: delete rule
  inverted`), so the exactly-one-site guard counts the marker and not ordinary content a later edit
  adds. ⛔ **No injected marker where the wrong value IS the marker** (mutation 34's board word) —
  injecting prose there would red the assertion for the wrong reason.
- **Four checks per mutation, all present in 33 and 34:** the sed/awk is not a no-op; no un-mutated
  copy survives; the mutation landed; it landed **exactly once**.
- **Assert the suite reds AT THE NAMED ASSERTION**, not merely that it reds — 33 and 34 both grep the
  output for their assertion's text and fail on *"red for the wrong reason."*
- **Verify every anchor is unique in the target file before using it**, and say so in the comment, as
  both existing mutations do.

### ⛔ Out of scope

- ⛔ **No change to any assertion in `test/mover-exemption-step.test.js` or
  `test/dashboard-contract.test.js`** — this task proves the existing pins discriminate; it does not
  rewrite them. A pin that must be weakened to make a mutation red is a finding to report, not a fix
  to apply.
- ⛔ **No change to `claude/skills/fkit-status/dashboard.sh` or to any mover `SKILL.md`.** Mutations
  operate on **copied trees**, never the repo's own files.
- ⛔ **No renumbering of the existing mutations 1–34** — append.
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005). ⛔ **No new devDependency** (ADR-014). ⛔ **No
  re-rank of any board** (ADR-035).

## Verification steps

1. **Every new mutation reds, and reds at its named assertion.** Run `bash test/prove-red.sh` and
   confirm each new entry prints `red` and that the run reports no *"red for the wrong reason"*,
   *"MUTATION WAS A NO-OP"*, *"MUTATION DID NOT LAND"* or *"WRONG TARGET"* line.
2. **The whole gate still passes.** `bash test/prove-red.sh` exits `0`. ⛔ A run where an older
   mutation regressed is a failed run, not a partial one.
3. **The added runtime is measured, not assumed.** Time the gate before and after and record both
   numbers in the worklog. ⚠️ If the real cost lands well outside `~60–120 s`, that is a finding to
   raise with the owner, not a number to absorb silently.
4. **Nothing outside `test/prove-red.sh` changed.** `git diff --name-only` lists that file and the
   task-folder records, and nothing else.
5. **Unit suite unchanged.** Run `npm run test:unit` and confirm the pass/fail totals match the
   baseline re-derived at pickup. ⛔ **Do not hardcode a total from this brief** — none is given here
   deliberately.
6. **Reference integrity unchanged.** `node --test test/reference-integrity.test.js` reports **0
   broken** links. ⛔ **Do not add a `NAMED_EXEMPT` entry** to make anything pass.

## Notes

- **Depends on:** `0341` — ⛔ **hard, not soft.** Neither surface exists until `0341` lands: the
  `S0`–`S6` sprint-mover roster, the two sprint mover `SKILL.md` copies it mutates, and
  `mode_successor()` all arrive with that task.
  - ✅ **DATED CORRECTION 2026-09-13 — THIS DEPENDENCY IS DISCHARGED. The line above is left
    byte-identical and is no longer binding.** `0341` closed **2026-09-13**; its folder is
    `ai-agents/tasks/done/0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled/`,
    and it shipped **both** `/fkit-sprint-done` and `/fkit-sprint-cancelled`.
    ⭐ **Both surfaces this task mutates now EXIST**, so the sentence above — *"Neither surface exists
    until `0341` lands"* — is **false as of 2026-09-13**. **Current dependency: nothing.**
    ⛔ **This does not make the row `🔄 In progress`; it makes it runnable.**
    ⚠️ **Re-measure the two `S`-series against disk at pickup.** § *Context*'s counts were measured
    2026-09-12 while `0341` was still in flight; they are a starting point, not a baseline to trust.
    *(Recorded 2026-09-13 by a spawned `fkit-producer` with no owner channel, under the owner ruling
    of 2026-09-13, option label verbatim **"One housekeeping pass (Rec)"**. Dependency line untouched;
    no status, priority or scope change.)*
- **Blocks:** nothing.

- ⚠️ **The hand-over's `S`-series numbering was wrong and is corrected in § *Context* above, not
  silently.** It described one `S0`–`S6` roster while citing an `S7`. Measured 2026-09-12, those are
  **two different files' series**: `mover-exemption-step.test.js` has `S0`–`S6` and **no `S7`**;
  `dashboard-contract.test.js` has `ADR-047 successor S1`–`S10`. An implementer who took the framing
  literally would go looking for a test that does not exist.

- ⚠️ **`test/prove-red.sh` is unmodified in the working tree** — verified 2026-09-12 with
  `git status --porcelain` against the in-flight `0341` change set. **`0341` added no mutations**, so
  the gap is real and nothing is half-done.

- ⭐ **On merit this sits directly below `0341`** — the mutations are worth most immediately after the
  surface stabilises and least once the code has drifted from the by-hand measurement. ⛔ **It is not
  ranked there:** this is the unranked Backlog board and
  [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
  forbids a mid-board insertion. The merit position is recorded so the owner can act on it in one edit.

- ⚠️ **Placement: Backlog board, UNRANKED, APPENDED LAST.** Filed 2026-09-12 by a **spawned
  `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of the relayed owner ruling named in § *Context* and deciding nothing beyond
  them. Nothing was renumbered and nothing was inserted mid-board.

- ⚠️ **Owner is `fkit-coder` because the deliverable is `test/prove-red.sh`** — a coder surface, and
  [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  Decision 1 fixes the role by the deliverable.

- ⚠️ **`0383`** (*"shrink the backlog board whose task cells are being used as a document store"*) is
  open and targets the cell bloat this row's own Task cell contributes to. The cell was written to the
  board's prevailing style rather than pre-empting that task's decision; ⛔ it is **not** a dependency
  in either direction.

---

## ⛔ TWO ITEMS APPENDED 2026-09-12 — THE UNPINNED EMITTER MAP, AND BLIND SPOT 11'S FIRST LIVE COST

⛔ **Nothing above is rewritten. This row is NOT re-ranked, NOT scheduled, and nothing is renumbered**
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
The `Depends on: 0341` line above is unchanged. ⭐ These are two additional items for this task to
carry; the design questions they raise stay at this task's plan gate with the owner.

**Authority: owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session
driving `/fkit-sprint-ship-loop` — **the option label is the verbatim text: "Both onto 0388 (Rec)"**.

### ⭐ ITEM A — the emitter map is unpinned PROSE, and it is the structural cause of a defect class that has now fired FOUR times on `0341`

⚠️ **Stated first, because it is the point.** ⛔ **Which `dashboard.sh` mode emits which drift record
is restated in prose in several places, and NO test asserts that any of that prose is right.** A
builder or reviewer reading the prose gets no signal when it is wrong, so the same error keeps
shipping.

**Why it is now owed rather than noted.** ADR-047 fences this class explicitly — *"§7's emitter
assignment sends a drift to a mode that cannot produce it — again"*, with the instruction
⭐ ***"Re-raise on a third instance without further argument."*** `0341`'s round-1 finding **R6** was the
third instance. ⛔ **R6's own fix was the fourth** (recorded as round-2 **R21**). In the round-2 coder's
own words, on record in `0341`'s ledger: *"That is the likeliest source of an instance five — and I
just wrote another instance of that prose."*

#### The behaviour, re-measured on disk 2026-09-12 by this producer — because the prose got it wrong twice

- **`mode_select_active` structurally CANNOT report a wholly-`Backlog` identity collision.** It filters
  `[ "$_st" = "In progress" ] || continue` at `claude/skills/fkit-status/dashboard.sh:470`, **before**
  the sole `ambiguous-active-sprint` emission at `:661`. (The name also appears at `:492`, `:538` and
  `:592` — all three are comments, not emissions.)
- ⭐ **The board render is what reports it**, via `sibling_claimants` (`:291`, called at `:1560`), which
  compares `resolve_identity` output only and reads no status — and the record it emits is
  **`drift ambiguous-plan-identity`** (`:1564`), ⛔ **not `ambiguous-active-sprint`.**

#### What is pinned, what is not — measured, and it is NOT what the hand-over said

⚠️ **The hand-over framed this as *"prose duplicated across four skill copies, pinned by NO test."*
⛔ Neither half reproduced. Corrected here, not silently:**

- **The BEHAVIOUR is pinned.** `test/dashboard-contract.test.js` asserts the mode→record mapping at
  `:2790` / `:2795`, `:2909`, `:3343` / `:3350`, `:3424`, `:3608` and `:3626`.
- ⛔ **The PROSE is pinned by nothing.** No test in `test/` asserts that any `SKILL.md` sentence names
  the right mode or the right record.
- **The prose sites are THREE `.md` files, not four skill copies** — `claude/skills/fkit-sprint-done/SKILL.md:380,382`,
  `claude/skills/fkit-sprint-cancelled/SKILL.md:393,395`, and `claude/skills/fkit-status/SKILL.md:63,401,403`
  — plus `dashboard.sh`'s own comments. ⛔ **The task movers name neither record at all** (grepped:
  zero hits in `fkit-task-done/SKILL.md` and `fkit-task-cancelled/SKILL.md`).

⭐ **So the real gap is narrower and sharper than "no test":** a behaviour that IS pinned has an
unpinned prose restatement duplicated across three files, free to drift from it silently. **The fix
named in the ruling is a test asserting which mode emits which drift record** — and the design
question this task takes to its plan gate is **whether that test pins the prose sites, the behaviour
a second time, or both**, and whether it belongs beside the existing `dashboard-contract` assertions
or in a prose-pinning file of the `mover-exemption-step` kind.

⚠️ **Fit with this task's existing scope, stated plainly:** this task's own § *Out of scope* forbids
changing any assertion in `test/mover-exemption-step.test.js` or `test/dashboard-contract.test.js`.
⛔ **Adding a new assertion is not changing an existing one**, but if the chosen design needs an
existing pin weakened, that is *"a finding to report, not a fix to apply"* under the rule already
written above.

### ⭐ ITEM B — blind spot 11 stopped being a 0-cost prospective note this round

⛔ **An open `review.md` under `ai-agents/tasks/backlog/` IS scanned by the citation gate and IS NOT
exempt.** Any coordinate written into a **live** ledger reds `L2`.

**This is ruled behaviour, not a defect.** `test/coordination-citation-policy.test.js:141-146` records
it as blind spot 11 under **owner ruling 2026-09-02**, option label verbatim **"A + file follow-up D
(Rec)"** — ship with **no** exemption for review ledgers; ⛔ option B, *exempting open `review.md`*,
was **refused by name** as a silent widening of *"closed records are frozen"* into *"ledgers
anywhere"*.

⚠️ **What changed 2026-09-12.** The guard's own disclosure at `:504-505` says *"0 today (all 133 review
ledgers are in `done/`), prospective cost UNMEASURED."* ⛔ **It stopped being 0.** `0341`'s `review.md`
is the first review ledger to sit in `backlog/` while the gate runs, and the round-2 coder's ledger row
cited a document by line number — redding `L2` at an unmutated baseline and costing a full **~9-minute**
gate run to discover.

⭐ **Recorded so the next round does not rediscover it the same way.** ⛔ **This item asks for NO
exemption** — option B is refused and stays refused; ⛔ and it is **not** a licence to edit the guard.
What it asks is that whoever writes into a live ledger knows the rule before the gate tells them.

*Both items appended 2026-09-12 by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of the relayed owner ruling named above and deciding nothing beyond them.
Every coordinate and every quoted fragment was re-derived against the cited file on disk by this
producer; where it disagreed with the hand-over, the measurement is recorded and the hand-over
corrected in place rather than repeated. ⛔ No re-rank, no renumbering, no `Depends on` change, and no
file under `claude/` or `test/` was edited here.*
