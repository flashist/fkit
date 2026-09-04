# Gate `/fkit-sprint-ship-loop` on an owner-approved commit each time implemented work is ready to commit

## ID
0310

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### ⛔ What this task is, and what it is NOT

**This task DECIDES the shape of a commit gate for `/fkit-sprint-ship-loop`, gets that shape ruled by
the owner, and only then writes skill text.** ⛔ **It does NOT arrive with the shape already picked.**
Six genuinely open questions are enumerated below under *The six open questions*; **the owner has ruled
none of them.** ⛔ **A run that writes skill text before those questions are answered has failed the
task**, and so has a run that answers them itself and calls that a decision.

⚠️ **The one thing that is already ruled is that the capability should exist.** The owner asked for it
directly, in the owner's own words (below). **What is unruled is where it fires, who runs the command,
what it covers, and whether it needs an ADR.**

### Provenance — the owner's own words

**Owner request, 2026-08-15**, typed directly into a live `fkit lead` session driving
`/fkit-sprint-ship-loop`, and relayed to a spawned producer for filing. ⭐ **This is the owner's own
typed text, not a paraphrase and not a selection from an option list**, and it is the authority for
this task existing:

> "Spawn a producer to add the brief to the backlog file: while in the fkit-sprint-ship-loop the lead
> should ask the user whether they agree to commit all the currently uncommited changes every time
> something is implemented and is ready to be commited."

⚠️ **Unranked, no sprint** — filed by a spawned producer with no owner channel, so this row **appends**
and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### ⭐ Why this exists — it stopped being a tidiness problem and became a blocking one

**Today's `/fkit-sprint-ship-loop` run is the evidence.** The run drove Sprint 6 P1
([`0306`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md),
closed) and P2 ([`0171`](../../done/0171-write-the-durable-citation-anchors-convention-page/brief.md), still
`🔄 In progress`), and filed four briefs. **Nothing was committed.**

> ⚠️ **Dated note 2026-09-03 (`0309` step 8 disposition (b), inside sweep `0356`) — the passage above
> is a DATED 2026-08-15 reading and is LEFT BYTE-IDENTICAL.** It was **true on 2026-08-15**: `0171`
> really was `🔄 In progress` then. ⛔ **Rewriting it would make a dated observation state something
> false about its own date.** For a later reader: `0171` closed **2026-08-22**
> (`✅ Done (agent-closed — not owner-verified)`) and is committed, so the `0232` blocker this section
> builds its case on is **discharged** — ⚠️ which does **not** weaken the case for the gate, since the
> point was that nothing was committed for a whole run. ⚠️ The `HEAD` and dirty-path figures below are
> likewise historical: ⛔ **re-derive, do not quote.**

**Figures re-derived firsthand by the filing producer on 2026-08-15**, at `HEAD` = `9360177`
(*"Sprint push"*), **not carried on anyone's word:**

| Measure | Command | Value |
|---|---|---|
| Dirty paths in the tree | `git status --porcelain \| wc -l` | **66** |
| — of which modified, unstaged | `git status --porcelain \| grep -c '^ M'` | **54** |
| — of which untracked | `git status --porcelain \| grep -c '^??'` | **11** |
| — of which a staged rename from a close | `git status --porcelain \| grep -c '^R'` | **1** (`0306`'s `backlog/` → `done/` move) |
| `0171`'s repair of `adr-012` | `git diff --numstat -- <adr-012>` | **`15` added / `9` deleted** |

⚠️ **These are a dated observation against a dirty tree, not a permanent fact.** The count was **~61**
a few hours earlier in the same session and is **66** now; it will have moved again. ⛔ **Re-derive
before acting** — and note that a reader who checks out a clean `9360177` reproduces **none** of this,
because the whole run lives only in the working tree.

**⭐ The blocking half — this is the strongest single piece of evidence.** A spawned producer
established, and the owner ruled into
[`0232`](../../done/0232-correct-adr-012s-stale-source-of-truth-and-code-coordinates/brief.md)'s brief on
2026-08-15 (dated correction, *ordering constraint*), that:

- `0171` repaired `adr-012` by **replacement-in-place**, not by appending — hence the **9 deletions**
  in the numstat above. Those deletions belong to `0171`, not to `0232`.
- `0232`'s **verification step 1** requires `+N / −0` on that same file, and its **step 8** requires a
  near-clean `git status`. **Neither can pass while `0171` sits uncommitted** — through no fault of
  `0232`'s own run.
- `0232` is therefore **formally blocked until `0171` commits**. The owner's ruling records the trigger
  as *committing*, not merely *finishing*, because `0171`'s discharge of two of `0232`'s work classes
  **exists only in the uncommitted tree**: a revert, a rework, or a discarded working tree re-opens
  them and grows `0232`'s remainder from **16** occurrences back to **26**.

⛔ **Read `0232`'s dated 2026-08-15 notes for the recorded version, and verify that reading rather than
inheriting this summary of it.**

⭐ **The point for this task:** an uncommitted tree is no longer just untidy. It **propagates into other
tasks' verification steps** and makes them unsatisfiable. That is the cost a commit gate is being asked
to remove, and it is the strongest argument in the brief.

### ⛔ The six open questions — the implementer must answer these, not this brief

⛔ **This brief deliberately settles none of them.** Each must be answered with its cost stated, and
questions 1 and 2 must be **put to the owner and ruled** before any skill text is written.

#### 1. ⛔ Does this need an ADR? The universal hard rule is in play

`CLAUDE.md`'s universal hard rules read: *"Never commit or push unless the owner explicitly asks.
'Implement' authorizes writing code, not committing."* And `/fkit-sprint-ship-loop`'s own hard-rules
block today reads:

> `- **Do not commit or push** — leave every edit in the working tree; the owner commits.`

**The case that nothing changes:** the proposal **asks**. An owner's "yes" *is* the explicit ask, so
the rule is arguably satisfied on its own terms.

**The case that something does change:** it changes the rule's **operation** from *never offer* to
*routinely offer*. A rule whose whole force is that the agent does not raise the subject behaves
differently once the agent raises it every task.

⛔ **The implementer must state which of these is right, put it to the owner, and get it ruled before
shipping skill text.** ⛔ **Do not decide it in the implementation.** If the answer is "this needs an
ADR", the ADR comes first and the skill text waits on it.

#### 2. Where in the loop does the gate fire?

*"Every time something is implemented and is ready to be committed"* is the owner's phrasing and **is
not precise enough to implement.** Candidates to weigh, at minimum:

- **After each task's Close lands** — a coherent, independently shippable unit; matches how `0232` got
  blocked (it needed `0171`'s *commit*, and a close is the natural commit boundary).
- **After Verify goes green** — earlier, so a red review does not sit on top of committed work; but the
  work is not yet reviewed.
- **At the end of the whole run** — one gate, but it recreates today's failure mode for every task after
  the first.
- **Some combination**, e.g. per-close with an end-of-run sweep for anything left.

⚠️ **Gate fatigue is a real cost, not a rhetorical one.** The loop **already** stops the owner at plan
approval (per task) and on every `NEEDS-DECISION` relay. Adding a per-task commit gate is a third
recurring interrupt. **Weigh that against the cost of losing a run's work**, and say which way it comes
out and why.

#### 3. Who runs the command?

- **The driver commits on a "yes"** — fewer steps, but the agent performs the commit and owns the
  message.
- **The driver hands the owner the exact command to run themselves** — the owner performs the commit;
  the agent never does.

⚠️ **These differ in what the hard rule permits and in who is accountable for the commit message.**
State that difference explicitly; it is entangled with question 1.

#### 4. What exactly gets committed?

*"All the currently uncommitted changes"* is the owner's phrasing. But a mid-run tree routinely holds:

- **another task's** in-flight work (today: `0171`'s edits sitting under `0306`'s close),
- **driver-written `## Status` flips** on tasks not yet finished,
- a **staged rename** left by a close (`R100`, confirmed present today).

**So `git add -A` and a scoped commit are both defensible, and both have a correctness cost:** `-A`
sweeps in work nobody reviewed; a scoped set can leave a close half-committed — the folder moved but
the board row's edit not — which is the exact half-landed shape the loop's *Close posture* says no
agent may repair.

⛔ **Do not pick one silently.** Name the cost of each and recommend one.

#### 5. ⭐ The consent model — [ADR-039](../../../knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md) is the precedent and must be cited

ADR-039 §2 (*The consent model*) already settled this project's shape for an owner-consented,
agent-performed mutation, on an owner ruling verbatim **"Plan-level approval (Recommended)"**:

- the proposal is presented with **the exact enumerated per-file list and diffs in view**;
- **one plan-level `AskUserQuestion`** approves that exact list;
- an **apply-time freshness re-check** runs immediately before applying — an item whose on-disk state no
  longer matches what the proposal showed is **refused and reported, never applied**;
- consent is **never announce-only, never stored** — per-run, in the session where it is given.

⛔ **The implementer must state whether commit consent follows that shape or deliberately departs from
it, and justify a departure if one is proposed.** ⚠️ The freshness re-check maps onto commits with real
force: the tree can change between the question and the answer, and a `git add -A` approved against one
`git status` is not the same commit when applied against another.

#### 6. ⛔ This is not [ADR-024](../../../knowledge-base/decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md) returning — say so in the record

ADR-024 declined an owner-question **timeout** that would auto-proceed on the pre-selected option after
silence — i.e. it **removed** the owner from a gate. ⭐ **This proposal is the opposite: it ADDS an owner
gate that does not exist today.** ⛔ **State this explicitly in whatever record ships**, so a later
reader cannot mistake the two. ⚠️ And note ADR-024's own finding as a live hazard: the AFK timeout is
**session-global**, so if the owner ever enables one, a commit gate inherits it. ADR-024 named the plan
gate and the done gate as must-never-auto-proceed; **say whether a commit gate joins that list.**

#### Session-only — the gate is the driver's, and the workers keep their ban

`AskUserQuestion` exists **only in a live session**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md));
a spawned worker has no owner channel. So the gate can only ever be the **driver's**, held in the live
lead session. ⛔ **The loop's spawned workers keep their existing absolute no-commit ban, unchanged** —
nothing in this task relaxes it, and the skill text must say so rather than leaving it inferred.

### Conflicts and dependencies with open work

- **The loop's own hard-rules block** (`claude/skills/fkit-sprint-ship-loop/SKILL.md`, *Hard rules*)
  carries the *"Do not commit or push"* line quoted above. **Any shipped gate contradicts that line as
  written**, so the line must be amended in the same change — ⛔ **not left standing beside a gate that
  disagrees with it.**
- **`0116`** — ⚠️ **the lead's routing note cited `0116` (the ADR-030 Stop-hook skip set) as related
  open work; it is NOT open.** Verified on disk 2026-08-15: it is at
  `ai-agents/tasks/done/0116-add-sprint-ship-loop-to-stop-hook-skip-set/`, `## Status` =
  `✅ Done (agent-closed — not owner-verified)`. It bears on this task only weakly — it exempts the
  loop's idle turns from the Stop hook's "What's next?" footer, which is about turn shape, not commits.
  **Cross-reference it only if the gate turns out to change turn shape; otherwise say it does not apply.**
- **`0171` and `0232`** — the live evidence above. ⛔ **Both are actively held by other workers. Do not
  edit either folder.** They are cited as evidence, not as work this task touches.
- **No hard dependency on anything.** The decision can be taken now.

## What to build

⛔ **Questions 1 and 2 above are owner rulings, not implementer choices. No skill text lands before
they are ruled.**

1. **Re-derive the figures firsthand** — the porcelain count, the `adr-012` numstat, and `0171`'s
   status — and **state the tree state and `HEAD` measured against**. ⛔ **Do not carry this brief's
   numbers forward unverified.**
2. **Read the primary sources**, anchoring on quoted text rather than line numbers: the loop skill's
   *Hard rules*, *Durable artifacts* and step-2 *Close posture* sections; `CLAUDE.md`'s universal hard
   rules block; ADR-039 §2; ADR-024's Context and constraints; ADR-021.
3. **Read `0232`'s dated 2026-08-15 ordering-constraint note in full** and confirm (or correct) the
   blocking account given above.
4. **Answer all six open questions**, each with the rule or cost it trades against. ⛔ **An omitted
   question is a failed run**, and *"leave it as it is"* is an acceptable answer to any of them **only
   if written down as a considered decision.**
5. **Put questions 1 and 2 to the owner** with a marked recommendation, and record the ruling verbatim
   (option label as given). ⛔ **Do not proceed past this point unruled.**
6. **If the ruling in question 1 is that an ADR is required:** write it via `/fkit-record-decision` to
   `ai-agents/knowledge-base/decisions/` — ⛔ **not to `ai-agents/wiki-vault/`** — and **stop there,
   returning the skill-text half to the owner as follow-on work.**
7. **Only then, and only if ruled to proceed:** amend
   `claude/skills/fkit-sprint-ship-loop/SKILL.md` — the gate at the ruled point, the amended
   *"Do not commit or push"* hard rule, an explicit statement that **spawned workers' no-commit ban is
   unchanged**, and an explicit statement that this **adds** an owner gate rather than removing one
   (question 6). ⚠️ **The skill has a dual-home mirror obligation** — check
   [ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
   and the parity test before assuming one file is the whole change.

## Verification steps

⚠️ **Steps 5–8 apply only if step 7 of `## What to build` ran.** If the owner ruled "ADR first", steps
1–4 plus step 9 are the whole verification, and **the brief is closed as a decision task.**

1. The six open questions are each answered in the shipped record (ADR and/or returned report), **by
   number**, and each answer names the rule or cost it trades against. A count of six, not five.
2. The record quotes the owner's request **verbatim** as given in *Provenance* above, and marks it as
   the owner's own typed words rather than a paraphrase.
3. The record cites **ADR-039 §2** and states whether the commit-consent shape **follows or departs
   from** plan-level approval + apply-time freshness re-check + never-stored consent.
4. The record states **explicitly** that this **adds** an owner gate and is **not** ADR-024 being
   reopened.
5. `claude/skills/fkit-sprint-ship-loop/SKILL.md` no longer contains a bare
   `Do not commit or push — leave every edit in the working tree` rule that contradicts the shipped
   gate. Verify by reading the *Hard rules* block, not by grep alone.
6. The skill text states that the loop's **spawned workers** may still never commit — present as
   explicit text, not inferable by omission.
7. The dual-home parity test passes: `node --test` over the repo's test suite is green, with the
   pass/fail counts stated.
8. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md >/dev/null; echo $?` → `0`.
9. `git diff --stat` shows **no change** under `ai-agents/tasks/backlog/0171-*/`,
   `ai-agents/tasks/backlog/0232-*/`, or `ai-agents/tasks/done/0306-*/`.

## Notes

- **Depends on:** nothing.
- **Relates to:** `0171` and `0232` (the live evidence — do not edit either), `0116` (closed; weak
  relevance only, see *Conflicts and dependencies*).
- ⭐ **The filing producer recommends this be split into two tasks — a decision/ADR task, then a
  skill-text task — and put that recommendation to the owner rather than acting on it.** It is filed as
  **one** brief because that is what the owner asked for. **If the owner rules a split, this brief's
  steps 1–6 are task one and step 7 is task two.**
- ⚠️ **Figures in this brief were re-derived at `HEAD` = `9360177` on 2026-08-15 against a DIRTY working
  tree.** They are a dated observation, not a permanent fact. **Re-derive before acting.**
- ⛔ **Frozen — do not modify:** anything under `ai-agents/tasks/done/0306-*/`, and anything inside
  `0171`'s or `0232`'s task folders.
- ⛔ **Do not commit, push, `git add` or `git stash`** unless the owner explicitly asks. ⭐ **Note the
  irony and do not resolve it by acting:** this task is *about* commits, and it still may not perform
  one.
