# Replace the review coverage binary with ADR-042's three-state vocabulary

## ID
0272

## Sprint
Sprint 6

## Priority
Sprint 6 P20

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Authority

[**ADR-042**](../../../knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md),
status **accepted**, dated **2026-08-11** — **decision D1**, the **architect's call** (D2, the sandbox
change, is the owner's separate ruling and is task `0273`). **Read the ADR in full before planning.**

⚠️ **The ADR is untracked in git at the time of filing** — it was written in the session that produced
it and not yet committed. **That is expected, not a defect.** Do not treat its absence from `git log`
as a reason to doubt it.

### ⚠️ THE BINDING CONSTRAINT — read this before anything else

**This task must land BEFORE or WITH [`0273`](../../backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md)
— never after.** `0273` flips the Codex sandbox to `workspace-write`. ADR-042's own Consequences say
it plainly:

> *"Implementing D2 without updating D1's reporting logic would recreate the original defect in mirror
> image — claiming measurement that did not happen because the flag permitted it."*

The edge is declared structurally: `0273` carries `**Depends on:** 0272`. ⛔ **Do not remove or weaken
that edge**, and do not let this task be descoped while `0273` proceeds.

### ⚠️ THE ONE DESIGN INSTRUCTION THAT MAKES THE SPLIT SAFE — write the rule in PER-RUN form from the start

Today's sandbox is `read-only`, so *reasoning-only* is the state **by construction** — it can be
stated flatly. After `0273` lands it becomes a **per-run fact**: Codex may or may not have executed
something on any given review.

⛔ **Do not write the by-construction form.** Write the **per-run** rule now, from day one:

> A report claims **both reviewers measured** only on **evidence in the Codex output that it actually
> executed something** — never inferred from the sandbox flag permitting it.

…plus a **separate, clearly-labelled dated note** stating that under today's `read-only` sandbox that
evidence can never appear, so every report reads *reasoning-only*.

**Why this wording matters, and it is the whole reason this is a separate task from `0273`:**

- It is **correct today** under `read-only`, and stays correct after `0273` lands — **no re-edit**.
- The owner reserved a named **"disable exit"** (revert to `read-only`). ADR-042: *"reverting D2 is a
  one-value change back to `read-only` across the four call sites. **D1 is unaffected by that revert**
  and must stay in force either way."* Written this way, reverting `0273` touches **nothing** here.
  Written the other way, a revert would silently make this task's text wrong.

### The defect being fixed

The degradation contract is a **binary** — Codex ran, or *"Codex reviewer unavailable: `<reason>`"* —
and has **no vocabulary for the actual, permanent state**: Codex ran, read the diff, reasoned well,
and **measured nothing** (its `read-only` sandbox blocks `mkdtemp`, so it cannot run the suite, build
a fixture, or execute a mutation). The reviewer is then told to *"end with a one-line coverage
self-assessment"* with only that binary to say it in.

Three reviews this sprint, **same flag and same capability each time**, produced three different
claims (ADR-042 Finding 2):

| Task | Coverage claim | Reality |
|---|---|---|
| `0259` | *"Coverage is FULL — no reviewer skipped, no degradation"* | Codex measured nothing |
| `0264` | *"coverage is **not** partial"* — while the same ledger says *"Codex could not run the suite… All execution evidence in this ledger is mine"* | Self-contradictory in one file |
| `0265` | **PARTIAL**, loudly and correctly | Accurate |

⚠️ **This is a reporting defect, not a capability complaint.** Static reasoning finds real defects —
on `0265` the read-only Codex pass **originated** three independently-verified findings, including an
ADR-040 breach. ADR-009's model-diversity purpose survives intact. What is not permitted is a report
implying more than reasoning.

⛔ **Correcting the two overstating ledgers is NOT this task** — it is
[`0274`](../../backlog/0274-append-dated-coverage-corrections-to-0259s-and-0264s-closed-review-ledgers/brief.md).

## What to build

The **three-state coverage vocabulary** from ADR-042 D1, written into every site that states the
coverage or degradation contract:

- **both reviewers measured** — both executed tests/mutations.
- **reasoning-only second opinion** — Codex ran and reasoned; **all execution evidence is the Claude
  reviewer's**.
- **Codex unavailable** — the existing loud `[claude-fallback — NOT model-diverse]` case, **unchanged**.

### ⚠️ The hardest call in this task — the third state must NOT become a failure verdict

ADR-042 D1 §3, and it is binding:

> *"This is a reporting-honesty rule, not a degradation flag. It must not inherit the fallback banner's
> alarm tone: nothing is broken, and treating the normal case as a failure would train readers to
> ignore the banner that **does** signal failure."*

The existing verdict vocabulary offers only `🟡 Partial review — <reviewer> unavailable`, which
**takes precedence** over `✅ Ready to merge`
(`claude/skills/fkit-review/SKILL.md:121`, `claude/skills/fkit-stateful-review/SKILL.md:142`).

⛔ **A reasoning-only pass must NOT force `🟡 Partial review`.** Under today's sandbox that is *every
review*, so doing so would mark every review on the project as partial and destroy the signal. **The
reasoning-only state is a coverage statement, not a verdict token.** ⛔ Equally, do not let it be so
quiet it disappears — ADR-042 requires it *"stated in every report, never omitted because it is
routine."* Getting that balance right is the deliverable; if the plan cannot resolve it, **stop and
escalate** rather than picking silently.

### The sites — verified on disk 2026-08-11

⚠️ **Line numbers are dated anchors of convenience. The durable anchors are the quoted text.**
⚠️ **ADR-042 cites three of these; the full set was re-derived here by grep and is larger.** Re-derive
it yourself before editing — report any site this list missed rather than editing it silently.

| File | Anchor | What it is |
|---|---|---|
| `claude/skills/fkit-review/SKILL.md` | `:51` | *"End with a one-line coverage self-assessment"* — the instruction inside the Codex prompt |
| | `:66-67` | the binary degradation contract — *"Codex reviewer unavailable: `<reason>`… flag the partial coverage **loudly**"* |
| | `:121` | verdict vocabulary — `🟡 Partial review — <reviewer> unavailable` |
| | `:130-132` | the `Decision: 🟡 Partial review — Codex unavailable` / `[NOT model-diverse — INCOMPLETE]` template block |
| `claude/skills/fkit-stateful-review/SKILL.md` | `:97` | the same binary degradation contract |
| | `:142` | verdict vocabulary |
| `claude/skills/fkit-adversarial-review/SKILL.md` | `:53` | *"Never silently substitute yourself for Codex"* |
| | `:61-64` | the `[claude-fallback — NOT model-diverse]` banner block |
| | `:114-115` | *"End with a one-line coverage self-assessment — including which mode ran"* |
| `claude/agents/fkit-adversarial-reviewer.md` | `:29` | the fallback label |
| | `:66-67` | coverage self-assessment naming which mode ran |
| `claude/agents/fkit-reviewer.md` | `:89-90` | *"Degrade gracefully, report loudly… mark the coverage as partial"* |

**The three-state vocabulary must be stated once and referenced, not re-derived per file.** Five files
carrying five independently-worded versions of one contract is how the sprint got three different
coverage claims in the first place. If the plan wants a single home for the wording and pointers from
the rest, that is the right instinct — say where, and why.

### Constraints

- ⛔ **No `--sandbox` change.** Not one character. That is `0273`, and it is gated on this task.
- ⛔ **No edit to any `review.md` under `ai-agents/tasks/done/`.** That is `0274`.
- ⛔ **Do not weaken the `[claude-fallback — NOT model-diverse]` banner.** It stays exactly as loud, and
  still fires **only** when Codex is unreachable. The new third state sits beside it, never replaces it.
- ⛔ **Do not change what the review *finds*** — no change to the hunt list, the verdict set's other
  four entries, the dedup rule, or the classification vocabulary.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit. ⛔ No new devDependency (ADR-014).
- ⚠️ **`.claude/skills/` and `.claude/agents/` are gitignored copies** refreshed from `claude/` by
  `claude/fkit-claude-init.sh`. **Edit the canonical sources in `claude/` only.**
- ⚠️ **Check whether any of these files are dual-homed into `claude/scaffold/`** before assuming they
  are not — measured at filing, `claude/scaffold/` holds `ai-agents/`, `AGENTS.md`, `CLAUDE.md` and
  `universal-rules.md` only, so **no manifest regeneration is expected**. Verify rather than carry that
  on this brief's word; if `npm run generate:manifest` turns out to be owed, run it and say so.

## Verification steps

1. **Every site in the table above states the three-state vocabulary**, and **no site still offers only
   the ran/unavailable binary.** Paste the grep that proves it, over `claude/skills/` and
   `claude/agents/`.
2. **The per-run wording is in place, and the by-construction wording is NOT.** Quote the landed
   sentence. ⚠️ If it reads *"while the sandbox is `read-only`…"* as the operative rule rather than as
   a dated note, the task has written the form that breaks when `0273` lands — **fix it before
   closing.**
3. **Run one real review through the changed contract** — a stateful or ephemeral review over a small
   scope, with Codex reachable, under **today's unchanged `read-only` sandbox**. Then check the
   produced report:
   - its coverage line reads **reasoning-only**, and states that all execution evidence is the Claude
     reviewer's;
   - it does **not** claim FULL coverage;
   - its verdict line is **not** forced to `🟡 Partial review`;
   - the `[claude-fallback — NOT model-diverse]` banner does **not** appear.
   Paste the report's coverage and verdict lines.
4. **Prove the `Codex unavailable` path still behaves.** Force the failure branch (e.g. an unreachable
   `codex`) and show the loud fallback banner and the `🟡 Partial review` verdict both still fire.
   ⚠️ This is the branch the new third state most easily damages.
5. **Full `npm test` green.** State the measured counts.
6. **⚠️ State the coverage limit honestly rather than implying it was closed.** Measure and report
   whether **any** test in the repo reads the *content* of a `SKILL.md` or an agent file. If none does,
   say so plainly in the worklog: this contract is **prose, unenforced by the suite**, so `npm test`
   green proves nothing about it. ⛔ Do not scope building such a test here — `0152` and `0154` already
   cover that surface.

## Notes

- **Depends on:** nothing
- **Blocks:** `0273`
- **Soft ordering, deliberately NOT a `Depends on`:** best run before
  [`0274`](../../backlog/0274-append-dated-coverage-corrections-to-0259s-and-0264s-closed-review-ledgers/brief.md),
  so its correction notes cite this landed vocabulary instead of inventing a second one. `0274` is
  writable without it, so no hard edge was declared — inventing one to express a preference is what
  tasks `0184` and `0149` warn against.
- ⚠️ **This is the half of ADR-042 that is NOT provisional.** D2 (`0273`) is an owner-ruled experiment
  with two named exits. **D1 is not** — it stands on its own, ADR-042 says so explicitly, and it
  survives either exit.
- **On merit:** this belongs in **Sprint 5, above the remaining open rows** — and a spawned producer
  cannot put it there. Reasoning in full, because the placement is a judgement:
  - Sprint 5 has **eight coder-owned rows still open**, each of which will be reviewed, and each review
    will write a coverage line. Under today's contract those eight lines will be as wrong as `0259`'s
    and `0264`'s were. Landing this first stops the sprint manufacturing eight more defective ledgers.
  - ⛔ **Filing it into Sprint 5 myself would land it at `P17` — below every one of those eight rows** —
    which is *worse than the Backlog*, because it would look scheduled while being reached last.
    `/fkit-task-brief` step 5 and
    [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
    forbid a mid-board insertion, and **a spawned producer never re-ranks.** That exact trap is
    documented on Sprint 5's own board (§"Addendum — six implementation rows added out of band"), and
    it cost an owner round-trip and a re-rank on 2026-08-11.
  - **Pulling it into Sprint 5 is a three-edit producer act** (`/fkit-task-brief` step 8) plus an
    owner-ruled re-rank, both of which need the owner present. **Recommended.**
- ✅ **THE OWNER RULED THE PLACEMENT 2026-08-11 — AND IT IS NOT YET EXECUTED. This brief is still
  `## Sprint: Backlog` / `## Priority: Unscheduled`, and that is accurate, not stale.** The bullet
  above is left byte-identical. Owner ruling given live via `AskUserQuestion` in a `fkit lead` session,
  **the option label is the verbatim text**: **"Pull 0272 into Sprint 5, high"** — this task moves onto
  the Sprint 5 board **above the eight remaining coder rows**. ⚠️ **Explicitly NOT `0273`**: the owner
  accepted the merit argument that D2 stays on the Backlog until after the release cut, so its field
  trial does not confound the release-validating reviews.
  - ⛔ **The spawned producer that recorded this did NOT execute it, and could not have.** Two
    independent bars, and **the second one binds every producer, owner-present included**:
    1. `/fkit-task-brief` step 5: a re-rank runs *"only on an explicit owner ruling given **in this
       session**"*, and **"a spawned producer has no owner channel and therefore never re-ranks — not
       on a spawn-prompt instruction."** The bar is the **session**, not the existence of the ruling.
    2. **Placing a row that is not yet on the board is an INSERTION, not a move.** Step 5: the
       exception *"does **not** permit inserting a new row mid-board… insertion is never the
       exception's to grant"*, and that is
       [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)'s
       whole holding. Sprint 5's own re-rank of 2026-08-11 was permitted **because it was a move of
       rows already on the board** — its addendum says so in those words.
  - ✅ **The owner's intent IS reachable, as TWO acts in one owner-present `fkit producer` session** —
    and the order matters:
    1. **Pull into Sprint 5 at the APPEND rank `P17`** (step 8's three-edit act: add the Sprint 5 row;
       flip this task's `backlog.md` row to `➡️ Moved to [Sprint 5](done/sprint-5.md) — priority P<n>`;
       set this brief's `## Sprint` → `Sprint 5` and `## Priority`). An append renumbers nothing.
       ⛔ **Filing it straight in at `P6` is the banned insertion.**
    2. **Then an owner-ruled MOVE, `P17` → `P6`.** The row now exists, `P6`–`P17` is a contiguous run
       of open rows, and the closed wall is `0265` at `P5` — so `P6` is **the top of the run and not
       one place further**, exactly the shape the 2026-08-11 re-rank satisfied. It displaces
       `P6`–`P16` down one to `P7`–`P17` and renumbers **nothing closed** (all five closed rows,
       `P1`–`P5`, sit above the move).
- **Line-number citations are dated anchors of convenience** (measured 2026-08-11); the durable anchors
  are the quoted text.
- Filed 2026-08-11 by a spawned `fkit-producer` with no owner channel, on ADR-042 D1. It asked nothing,
  decided nothing beyond the split and the board placement, and committed nothing.

### Dated correction + an unruled question — 2026-08-14

**1. Path corrected (owner-ruled, verbatim option label "Fix the path in place (Recommended)").**
The step-1 instruction above told a future agent to write `➡️ Moved to [Sprint 5](sprint-5.md)` into
`ai-agents/sprints/backlog.md`. **Sprint 5 was archived on 2026-08-14** to
`ai-agents/sprints/done/sprint-5.md`, so that href — which is relative to `backlog.md` — no longer
resolves. Corrected to `](done/sprint-5.md)`. ⚠️ **Nothing was broken by this**: it is a prose
instruction, not a live link. It would have produced a broken link when acted on. **The path was the
only thing changed** — this task's scope, status, premise and ranking argument are untouched.

**2. ⚠️ OPEN QUESTION — RECORDED, NOT ACTED ON. NO OWNER RULING EXISTS.**
The whole *"pull into Sprint 5"* plan above **may now be incoherent**. **Sprint 5 is CLOSED, with no
successor** — as of 2026-08-14 there is **no active sprint** (`select-active` returns `active none`).
Moving a task *into* a closed board is not obviously a meaningful act, and the append-rank/re-rank
argument in step 1–2 assumes a live board with a contiguous run of open rows.
⛔ **Do not act on this note.** ⛔ **Do not "fix" the plan above on your own judgement.** If you are
about to execute step 1, **STOP and put the question to the owner first**: *should `0272` still be
pulled into Sprint 5, or should it wait for a new sprint, or stay on the Backlog board?*
Surfaced by a spawned `fkit-producer` on 2026-08-14 while making correction 1; the owner ruled on the
path only and was not asked this.

### ✅ RULED 2026-08-14 — the open question above is ANSWERED, and the placement plan is SPENT

**Everything above is left byte-identical.** The paragraph numbered **2** was true when written and is
now **answered**, not deleted.

**Owner ruling, 2026-08-14**, given via `AskUserQuestion` in a live `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` with no owner channel — **the option
label is the verbatim text**: **"Re-target it to Sprint 6 (Recommended)"**.

**What follows from it:**

- **This task is re-targeted to [Sprint 6](../../../sprints/sprint-6.md)**, opened the same day by a
  separate owner ruling of the same session (verbatim **"Accept as proposed (Recommended)"**). Its
  `## Sprint` field now reads `Sprint 6`, and its `backlog.md` row reads
  `➡️ Moved to [Sprint 6](sprint-6.md)`.
- ⛔ **The step-1 / step-2 placement plan above is SPENT and was NEVER EXECUTED.** *"Pull into Sprint 5
  at the APPEND rank `P17`"* and *"then an owner-ruled MOVE, `P17` → `P6`"* both named **Sprint 5**,
  which is closed, and both are **rank** instructions. ⛔ **Nothing was pulled into Sprint 5, and no
  rank was assigned anywhere.**
- ⛔ **Sprint 6 is UNRANKED.** Every Priority cell on that board reads `—`, by the owner's ruling and
  [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md).
  **This brief's `## Priority` is deliberately UNTOUCHED and still reads `Unscheduled`** — there is no
  destination rank to move it to. That is a departure from the ordinary forward move, and it is
  recorded on Sprint 6's board at §"⛔ This board is UNRANKED".
- **This row's position on Sprint 6 — last, 18 of 18 in the owner-accepted recommended sequence — comes
  from that ordering, NOT from the spent `P6` instruction.** ⚠️ **The sequence is prose on that board,
  not a rank**, so *"last"* is a reading order, not a deprioritisation.
- ⛔ **The `## Priority` / merit argument at §"On merit" above is left byte-identical and is now
  HISTORICAL.** It reasons about Sprint 5's closed-row wall and its `P6`–`P17` contiguous run; **none
  of that board's geometry applies to Sprint 6**, which has no closed rows and no ranks at all. **Do
  not act on it.**
- ⭐ **The underlying work is UNAFFECTED.** ADR-042 D1 has **not** landed (zero `reasoning-only` hits
  across its five named files, measured 2026-08-14), and this task is still the **only unblocked head**
  of the `0272` → `0273` → `0287` chain. Scope, deliverables and verification steps are untouched.

Recorded by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
which asked nothing and decided nothing beyond the mechanics of that ruling.
