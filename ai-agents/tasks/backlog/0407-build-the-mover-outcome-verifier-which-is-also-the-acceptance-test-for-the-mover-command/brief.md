# Build the converter's self-check — the acceptance bar a converted tree must pass before it is applied (re-scoped from the mover outcome verifier)

## ID
0407

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context
> ## ⭐⭐ RE-SCOPED 2026-09-30 under ADR-052 D11 — this block governs; the original context below is kept word for word as history and is SUPERSEDED where it disagrees.
>
> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
>
> **Why.** [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (accepted 2026-09-30) merges aiboard into fkit as its built-in board. Its
> D11 disposes of this task: *"`0407` mover outcome verifier — Re-scope into the converter's checker,
> or cancel."* The owner's approval (A1, selected option text) authorised *"task re-scopes"*;
> `fkit-lead` directed **re-scope**. The prose movers this task was built to verify are replaced by
> `fkit board`, so the mover command it was the acceptance test for (`0408`) is **cancelled**, and
> ADR-050's build is discharged by the board. ⭐ **The idea survives intact: a read-only check that
> reports per-item verdicts and never repairs** — pointed now at the converter, which is the one place
> fkit will still move every task at once.
>
> **What it becomes — ADR-052 D8 item 7, the converter's acceptance bar (phase 4).** Given a project's
> current tree and the converter's trial-run tree (`0437`), it proves:
> 1. every brief's text is **byte-identical** apart from the moved header sections (`## ID`, `## Sprint`,
>    `## Priority`, `## Status`, `## Owner`);
> 2. every other file is **hash-identical**;
> 3. every task's status, sprint, order, owner and close equal what fkit's **current** tools read before
>    (the reader, `0435`) — legacy closes keep their kind, door = `legacy`;
> 4. `fkit board check` is clean on the converted tree (`0428`);
> 5. the `reference-integrity` test is green on it;
> 6. a write round-trip proves ids like `0013` survive.
>
> It reports **per-item verdicts**, never a single boolean, and ⛔ **never repairs** — a checker that
> fixes what it finds destroys its own evidence (the original scope's point 3, kept). It **gates apply**
> ([`0440`](../0440-build-the-converters-apply-step-renames-first-content-second-tested-on-fixtures-only/brief.md)) and is quoted in every trial-run review ([`0441`](../0441-run-the-converters-trial-run-on-fkit-and-put-its-report-to-the-owner-the-phase-4-gate/brief.md), [`0442`](../0442-run-the-converters-trial-runs-on-geoconflict-pubquiz-and-the-other-fkit-projects-changing-nothing/brief.md)). The reason it must be
> paranoid: commit `331f298` wrote the wrong status into 3 of ~80 done briefs and nobody noticed for two
> months (decision document §6).
>
> *Re-scoped by a spawned `fkit-producer` with no owner channel (ADR-021). Status unchanged (`🔲 Backlog`).
> The folder name keeps its original slug — ids and folders are permanent (ADR-029).*


### ⛔⛔ THIS TASK IS NOT AUTHORISED TO START. AN ACCEPTED ADR IS NOT A WORK ORDER.

⛔ **ADR-050 (`adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed`) is being SIGNED,
not implemented.** As of **2026-09-18** an `fkit-architect` spawn is writing it. ⛔ **Nobody has
scheduled this work, nobody has ruled it starts, and this row exists so the decision is not lost — not
so it is picked up.** It sits on the Backlog board, `🔲 Backlog`, unranked and unscheduled, and it
stays there until the owner schedules it.

⚠️ **This brief was written WITHOUT READING ADR-050.** The architect spawn held
`ai-agents/knowledge-base/decisions/` at the time of filing, and this producer stayed out of that
directory entirely. **Everything below about the ADR's content is a RELAY from `fkit-lead`, not a
reading.** ⛔ **First act of whoever picks this up: read the signed ADR and reconcile this brief
against it.** Where they disagree, **the ADR wins** and this brief is annotated, never the reverse.

### What was ruled, and in what form

⛔ **THE OWNER SELECTED A PRE-WRITTEN OPTION. HE TYPED NO FREE TEXT.** The ruling was given
**2026-09-18** via `AskUserQuestion` in a live `fkit lead` session, selecting from options written by
`fkit-architect` and `fkit-producer`. ⛔ **It must never be recorded as a quotation of the owner's own
words.** This distinction was raised by `fkit-architect` earlier the same day and is honoured
deliberately.

**What he selected, as relayed by `fkit-lead`:**

- **Content — option E:** build an **outcome verifier first** (it is cheap, and **it becomes the
  acceptance test**), **then** a real **command the skills call**. ⭐ **Judgement stays in the skill;
  only mechanics move.**
- **Enforcement — option B-1:** **the skill stays the sanctioned entry point, and the `PreToolUse`
  skill-ownership hook is unchanged.**

⭐ **The ordering IS the ruling, not a convenience.** The verifier comes first **because it is what
proves the command correct**. Building the command first would leave it with no acceptance criterion
but its own author's reading of the prose.

### The problem ADR-050 names

fkit has **four movers** — `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-sprint-done`,
`/fkit-sprint-cancelled` — and each is a **prose procedure** performing several edits that must all
land or none should: relocating a folder, setting a `## Status`, setting a board row's status cell,
repointing inbound hrefs, stamping a marker, and (for the sprint movers) relocating every still-open
row. ⛔ **Prose has no transaction.** A run that performs four of six edits leaves the repo in a state
where two carriers disagree, and **nothing today notices.**

⚠️ **This is not hypothetical and it is already costing the project.** The half-landed close is the
exact condition [ADR-048](../../../knowledge-base/decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md)
had to invent a whole producer-only repair mode for
([`0135`](../../cancelled/0135-add-producer-only-reconcile-mode-to-task-done/brief.md), unbuilt), and
[`0296`](../0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md) found two task
folders whose board rows were never written at all.

## What to build
**Re-scoped 2026-09-30 — see the block at the top of `## Context`.**

1. A read-only checker taking the project tree and the trial-run tree, checking items 1–6 of that block.
2. Per-item verdicts (which task, which file, which field), with totals; a clean run says so explicitly.
3. **Fail loudly on error** — a run that cannot read a file or a board fails, never reports clean (the original scope's point 7 / `0296`'s Trap 2, kept).
4. State its coverage honestly: which of D8 item 7's checks it performs, and any it cannot.
5. Callable by the apply step (`0440`) as its gate, and by the trial-run review.

## Verification steps
1. Fixture: a faithful trial-run tree → **complete**, every check named.
2. Fixture: one brief with a changed byte outside the moved sections, one file with a changed hash, one task whose status disagrees with the reader, one `0013` turned into `13` → each reported **by name**, not merely "failed".
3. Run on fkit's real trial-run tree; paste the output. ⚠️ Findings are reported and left alone.
4. Prove it writes nothing: `git status` unchanged after a run.
5. An unreadable input makes it fail, never pass (a test).
6. `node --test test/*.test.js` green.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** [`0437`](../0437-build-the-converters-trial-run-tree-the-converted-project-built-in-a-temporary-folder/brief.md) (the trial-run tree it checks) and [`0428`](../0428-make-check-flag-closed-tasks-with-no-close-record-or-a-record-that-does-not-fit-its-door/brief.md) (`fkit board check`). Hard. *(Re-scoped 2026-09-30; the original line — "ADR-050 being signed and accepted" — is discharged: ADR-052 discharges ADR-050's build.)*
  specification and it is not this task's to invent.** ⚠️ As of 2026-09-18 it is mid-signature.
- **Blocks:** [`0440`](../0440-build-the-converters-apply-step-renames-first-content-second-tested-on-fixtures-only/brief.md) (apply is gated on it), [`0441`](../0441-run-the-converters-trial-run-on-fkit-and-put-its-report-to-the-owner-the-phase-4-gate/brief.md) and [`0442`](../0442-run-the-converters-trial-runs-on-geoconflict-pubquiz-and-the-other-fkit-projects-changing-nothing/brief.md). *(Re-scoped 2026-09-30; the original blocked task, `0408`, is cancelled under ADR-052 D11.)*
  — ⭐ **hard, and the ordering is the owner's ruling, not a producer preference.** This task's output
  **is** `0408`'s acceptance test.
- **⛔⛔ NOT AUTHORISED TO START.** See `## Context`. An accepted ADR is not a work order, and nothing
  in this brief may be read as scheduling it.
- **⚠️ Written without reading ADR-050** — an architect spawn held
  `ai-agents/knowledge-base/decisions/` at filing time. The ADR's content here is relayed by
  `fkit-lead`, and **the ADR wins every disagreement.**
- **⚠️ NOT caught by the Sprint 11 migration freeze — the producer's judgement, stated so it can be
  overturned.** That freeze covers *migration-shaped* work: **re-keying ids, moving folders, rewriting
  boards** as a one-time re-shaping of the stored corpus, held until `fkit-external-expert` reports.
  ⭐ **This task is read-only and changes no stored shape at all** — the cleanest possible case for
  being outside it. ⚠️ **If the implementation ever proposes to change an id format, a folder layout
  or a board's schema, it stops and escalates** rather than proceeding. ⭐ Same reasoning, same board,
  same day as `0405`'s *"not frozen by the migration freeze — it touches no stored shape."*
- **⚠️ Relationship to [`0135`](../../cancelled/0135-add-producer-only-reconcile-mode-to-task-done/brief.md),
  stated so nobody merges them.** `0135` **repairs** a half-landed close; this task **detects** one.
  ⛔ Neither is the other, and a verifier that repairs would destroy the evidence `0135` acts on.
  ⭐ `0135` was placed on hold on 2026-09-18 and sequenced behind `0408` — see its own dated note.
- **⛔ No mover**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  **⛔ no re-rank**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **⛔ no commit.**
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`. **Unranked.**
  **On merit this belongs directly above [`0408`](../../cancelled/0408-build-the-deterministic-mover-command-the-four-mover-skills-call/brief.md)**,
  because it is that task's acceptance test and the owner ruled the order.
  ⛔ **Deliberately NOT filed on [Sprint 11](../../../sprints/done/sprint-11.md)** — see `0408`'s `## Notes`
  for the placement reasoning, which covers both.
- **Filed 2026-09-18** by a spawned `fkit-producer` with **no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  Sibling: **`0408`**.
- **⭐ Re-scoped 2026-09-30 (ADR-052 D11, phase 4).** ⛔ Do not start without the owner's specific word (ADR-052 — each phase starts only on his word). The notes above about the Sprint 11 migration freeze and ADR-050's signature describe the original scope and are **superseded**; the original `## What to build` and `## Verification steps` are kept word for word under *Superseded original scope* below.

## Superseded original scope (kept word for word, 2026-09-30)

**Original title:** Build the mover outcome verifier — the read-only check that a close actually landed, which is also the acceptance test for the mover command

### Original What to build

**Exactly what ADR-050 rules — ⛔ do not re-decide any of it here.** Expected shape, **subject to the
ADR**:

1. **A read-only verifier that answers one question: did this close actually land, completely?**
   Given a task folder or a sprint board, it checks every carrier the movers are supposed to touch and
   reports each one's verdict — **never repairing, never moving, never writing.**
2. **It reports per-carrier verdicts, not a single boolean.** A half-landed close is useful only if
   the report says **which** carrier is wrong. ⭐ The `/fkit-heal` checker is the nearest in-repo
   precedent for per-file verdicts presented verbatim.
3. **⛔ It is a VERIFIER, not a repairer.** Repair is `0135`'s reconcile mode and the owner's, not
   this task's. **A verifier that fixes what it finds destroys its own evidence** and would make
   `0135` unverifiable — the same failure mode `0296` avoided by refusing to repair its two specimens.
4. **⭐ It must be runnable against a tree the movers have NOT touched**, because that is how it
   becomes `0408`'s acceptance test: run it before the command exists (against a mover run performed
   by prose), then after, and the verdicts must match.
5. **⛔ Judgement stays out of it.** Per the ruling, only **mechanics** move out of the skills. The
   verifier decides *whether the carriers agree*; it never decides whether a close was warranted, and
   it never touches the `(agent-closed — not owner-verified)` marker's meaning.

### ⛔ Out of scope — named so it is not drifted into

- ⛔ **The mover command itself** — that is [`0408`](../../cancelled/0408-build-the-deterministic-mover-command-the-four-mover-skills-call/brief.md).
- ⛔ **Any change to the `PreToolUse` skill-ownership hook.** Enforcement option B-1 leaves it
  **unchanged**.
- ⛔ **Any change to who may invoke a mover.** ADR-033's producer-only rule is untouched.
- ⛔ **Repairing anything the verifier finds**, including `0014` and `0004`.

### Original Verification steps

1. **The signed ADR-050 has been read, and this brief reconciled against it** — state in the worklog
   every point where the ADR differs from this brief's expected shape.
2. **`node --test test/*.test.js` is green.** ⚠️ State plainly that this proves **no regression**, not
   the change, unless the change ships its own tests — it should.
3. **Run it against a known-complete close** (a task whose folder, brief `## Status`, board row and
   hrefs all agree) → **reports complete**, with every carrier named.
4. **Run it against a known half-landed close, built in a fixture tree and ⛔ never inside
   `ai-agents/tasks/`** → **reports exactly which carrier is wrong**, not merely "failed".
5. **Run it against the live repo and paste the output into the close** — not a description of it.
   ⚠️ **If it reports findings on the live tree, those are reported and left alone**, not repaired.
6. **Prove it writes nothing:** `git status` is unchanged after a live run.
7. **Fail loudly on error.** A run that cannot read a board or a brief must **fail**, never report a
   clean tree. (`0296`'s Trap 2: a sweep whose tooling errored reported 295 of 295 folders broken
   because every error was read as *"no match"*.)
8. **State its coverage honestly** — which of the four movers' carriers it checks and which it does
   not. ⛔ A verifier claiming more coverage than it has is worse than one claiming less.
