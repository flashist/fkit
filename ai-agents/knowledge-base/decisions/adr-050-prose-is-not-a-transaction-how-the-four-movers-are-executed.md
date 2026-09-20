# ADR-050: Prose is not a transaction — how fkit's four movers are executed

- **Status:** `accepted` — **signed by the owner (Mark Dolbyrev) on 2026-09-18.** He ruled both open
  choices: **Option E** (verifier first, then the command) and **enforcement B-1** (the skill stays the
  sanctioned entry). Both rulings are recorded in *§Authority*.
  ⛔ **Accepted is not a work order.** This ADR authorises the *decision*, not the build — see
  *§What this ruling unblocks, and what it does not*.
- **Date:** 2026-09-18 (drafted and ruled the same day)
- **Deciders:** **the owner** (two rulings, both recorded in *§Authority* as the **option text he
  selected**, not as his own prose — he typed no free text on either). Drafted by `fkit-architect` at
  `fkit-lead`'s direction, under the owner's live ruling authorising a sibling ADR rather than a task
  or a fold-in. Three open questions in *§Open questions* remain **his** and are **not** answered here.
- **Discharges:** [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
  (**`accepted` 2026-09-18**) §Decision **D8** — *"The deterministic-movers decision (C6) is DEFERRED to
  a sibling ADR and is a BLOCKER on any board-originated write."* This is that sibling ADR. **049
  decides what a close CLAIMS; this decides how a close is EXECUTED.**
- **Finding credited to:** `fkit-external-expert`, which named the problem first
  ([verdict](../reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md) §0, line 3).
  Its figure was right and **understated**; the correction is recorded below.
- **Touches:** ADR-033 (producer-only movers + its 2026-09-18 addendum), ADR-029 (task-is-a-folder),
  ADR-047 §4 (mover order, atomic-by-invocation), ADR-018/ADR-036 (the skill-ownership hook and its
  declared sites), ADR-048 (the unbuilt reconcile mode, task `0135`), ADR-014 (test mechanics).

> **What this ADR decides, in one line:** whether — and how — `/fkit-task-done`,
> `/fkit-task-cancelled`, `/fkit-sprint-done` and `/fkit-sprint-cancelled` stop being **prose executed
> by a language model** and become a **deterministic command** the model merely *calls*.

---

## ⚠️ Read first — the division of labour with ADR-049

[ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
was **signed by the owner on 2026-09-18 and is `accepted`.** It is cited as accepted throughout.

**The two ADRs decide different things, and the split is the reason this is a separate record:**

- **ADR-049 decides what a close CLAIMS** — whether it may assert that a human verified it. Its answer
  is that no channel here distinguishes a human from an agent, so the close carries a *claim* plus its
  channel, anchored where a human really is (the commit).
- **ADR-050 decides how a close is EXECUTED** — what actually performs the write.

Fusing them would make each harder to supersede: the claim rule and the write path have different
lifetimes, different blast radii, and different re-raise conditions. **This ADR does not restate,
reopen or re-litigate ADR-049's Decision**; it discharges the one dependency ADR-049 deferred (D8).

---

## Authority — the owner's rulings, 2026-09-18

**How both were given:** live in a `fkit lead` session, via `AskUserQuestion`, relayed by `fkit-lead`.

⚠️ **Read this caveat before citing either quote below, and never cite them without it.** What is
quoted is **the text of the option he selected** — option text written by `fkit-architect` and
`fkit-lead` and put to him as a choice. **He typed no free text on either ruling.** These are
therefore a record of **which option he picked**, not a quotation of the owner's own words, and must
never be presented as the latter. (The same distinction was drawn for ADR-049 ruling 3, which recorded
an act with **no** verbatim text at all; here there is option text, and it is still not his prose.)

### Ruling 1 — the option: **E**, the architect's recommendation

Put to him as A / B / D-alone / E. **He chose E.** The option text he selected, verbatim:

> *"Verifier first, then a real command — The architect's option E. Build an outcome verifier first —
> cheap, and it becomes the acceptance test — then a real command the skills call, keeping judgement
> in the skill and moving only mechanics. Its reason for the order: there is no test surface today, so
> a command built first has nothing to prove it equivalent to the prose that closed 403 of 405 tasks
> correctly."*

### Ruling 2 — the enforcement story: **B-1**

Put to him as B-1 / B-2 (B-3 was already unavailable — *§Blast radius 1*). **He chose B-1.** The
option text he selected, verbatim:

> *"Skill stays the sanctioned entry — The hook keeps guarding skill invocation exactly as today; the
> command is what the skill calls. Status quo, documented rather than changed. Worth knowing: the
> prose movers' writes were never guarded either, so this is no weaker than today — producer-only has
> always been separation of identity, not prevention."*

### What the two rulings bind — stated precisely so they are not over-read

- They settle **the option** (E) and **the enforcement story** (B-1), and they **sign the ADR**
  (`accepted`).
- They do **not** authorise implementation. See *§What this ruling unblocks, and what it does not*.
- They do **not** answer open questions **3, 4 and 5** (prototype? `0135`? ADR-047 §4?), which remain
  **his** — ⛔ **including the ADR-047 §4 ordering question, which this ADR explicitly declined to
  settle and which nothing in either ruling settles.** It stays the command designer's question.

---

## Context

### 1. The measurement — and its counting rule

**Re-verified 2026-09-18 against the canonical install share** (`claude/skills/`, never the gitignored
`.claude/` mirror, which is only as fresh as the last `claude/fkit-claude-init.sh` run):

| Mover skill | Files in the skill dir | `SKILL.md` lines | Script that performs a WRITE |
|---|---|---|---|
| `fkit-task-done` | 1 | **460** | **none** |
| `fkit-task-cancelled` | 1 | **422** | **none** |
| `fkit-sprint-done` | 1 | **456** | **none** |
| `fkit-sprint-cancelled` | 1 | **476** | **none** |
| **Total** | **4** | **1,814** | **0** |

**The counting rule, stated so it can be re-run and disputed:**

1. **Scope** — the four skill directories under `claude/skills/` and nothing else. The `.claude/`
   mirror is excluded by the same reasoning `test/mover-exemption-step.test.js` gives for excluding it
   (*"asserting against the mirror would make the suite depend on whether init has run"*).
2. **Files** — every regular file in the directory, `find <dir> -type f`.
3. **Lines** — `wc -l` on each `SKILL.md`. Raw lines, no exclusion of blanks, prose, tables or
   examples. This **over-counts** the procedure proper and is still the honest denominator: every one
   of those lines is context a model must carry to perform a close correctly.
4. **"Script that performs a write"** — any file in the skill directory that the mover executes in
   order to **mutate** repo state. Zero of the four have one.

⭐ **One nuance the round figure hides, and it strengthens rather than weakens the finding.** The two
**sprint** movers *do* shell out — to `bash .claude/skills/fkit-status/dashboard.sh` — in
`fkit-sprint-done` §"Steps" (identity resolution, successor lookup, `⟦FACTS⟧`). That helper is
**read-only, belongs to another skill, and produces facts the model then acts on in prose.** So fkit
has already proved it will call a deterministic helper when one exists, and has built exactly one — on
the **read** side. The write side has none.

### 2. The correction to the expert's figure — attributed

`fkit-external-expert` wrote (verdict §0, line 3):

> *"The real write-side problem is on fkit's side and nobody named it: fkit's 'transaction' is a
> **460-line prose procedure executed by an LLM**. No lock, hook, queue or shared service can
> coordinate with that."*

**It named the problem first and correctly.** Its figure described **one** file. The measured reality
is **four movers, 1,814 lines, zero write-performing scripts** — the same defect, ~4× the surface, and
four copies that can drift from each other. **The correction makes the case stronger, not weaker, and
the credit for the finding is the expert's.**

Its §3 Point 9 states the remedy and the seam:

> *"`fkit-task-done` and its three siblings become a deterministic script (folder move **last** —
> rename is atomic; projection written first; checker catches an interrupted run; git is the
> recovery). The skill shrinks to 'decide, then run the command.'"*
> … *"Drag → command runs synchronously → exit code and stderr go back to the UI … This is
> `aiboard-lead`'s hook turned from **veto** into **delegate**."* … *"**No queue** once the mover is a
> millisecond script."*

⚠️ **That framing is tested below, not adopted.** Two of its four claims hold as written; two need
qualification before anyone builds to them.

### 3. What "prose is not a transaction" means mechanically

A mover today is **a belief a model forms and then acts on**, one tool call at a time:

- There is **no call site.** Nothing outside a Claude Code session can invoke a close. An HTTP
  handler, a TUI keypress, a browser drag, a `git` hook and a cron job all have the same option: none.
- There is **nothing to link into.** Every coordination mechanism proposed across this whole
  investigation — a shared transition service, a veto hook, a proposed-transition queue — presumes a
  function or a process to wrap. There is no such object.
- There is **no exit code.** A mover "succeeds" by the model saying so. A caller cannot distinguish
  *done*, *partly done* and *refused* without re-reading the repo and re-deriving the answer.
- There is **no unit.** The close is N independent `Edit`/`Write`/`git mv` calls (`fkit-task-done`
  §"Steps — do these in order", steps 1–7). Any prefix of them can be the final state.
- It is **priced per run, in tokens,** and the price is paid again on every close — 460 lines of
  procedure re-read, re-interpreted, and re-obeyed with whatever fidelity that run achieves.

⛔ **The claim is not "the model gets it wrong."** The four SKILLs are careful, heavily reviewed and
mostly obeyed. The claim is that **a procedure with no call site, no exit code and no unit cannot be
coordinated with, tested, or delegated to** — by anything, including fkit's own tooling. Those are
structural facts about the artifact, not a quality judgement about the executor.

### 4. The tax, itemised and measured today

**The incident.** Two task briefs in `ai-agents/tasks/done/` carried `## Status` = `🔲 Backlog` while
the owner had closed both on 2026-07-10 (commits `f7b23f4`, `6daf3cc`). The correct value was plain
`✅ Done`. The repair, measured with `git diff --stat`:

```
 ai-agents/tasks/done/0021-.../brief.md  | 2 +-
 ai-agents/tasks/done/0041-.../brief.md  | 2 +-
 2 files changed, 2 insertions(+), 2 deletions(-)
```

**One field value, in two files, one line each.** `🔲 Backlog` → `✅ Done`.

**What it cost, in order, all on 2026-09-18:**

1. A **spawned `fkit-producer`** — because `✅ Done` is skill-gated and may never be hand-edited
   (`fkit-task-done` §"The status vocabulary": *"It may be set **only** by this skill — never by
   hand-editing a file"*).
2. That producer hit the **contradicted-close exception's identity bullet** — *"never fire for a
   non-owner identity — a producer **spawned** to close is an agent (ADR-033 §5) and stops here"* —
   and could go no further. Every other bar of the exception held.
3. An **escalation** to the session that could reach the owner (ADR-021: a spawned agent has no
   `AskUserQuestion`).
4. A **live owner ruling**, put as *"the correct value is plain ✅ Done, but the only skill that writes
   it refuses a spawned agent — how do you want it fixed?"*
5. A **one-time bypass of the close gate**, which the option text itself warned *"is a real change to a
   rule that exists to stop agents forging closes"* and *"sets a precedent an agent can point at
   later."*
6. A **permanent ADR addendum** to fence that precedent off
   ([ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) §Addendum — 2026-09-18),
   including an explicit *"What a future agent may NOT take from this"* section.

⭐ **That is the prose-mover tax, and it is not an anecdote — it is the shape of the thing.** A
deterministic mover with a repair mode and an evidence check would have made steps 2–6 a command
invocation with an exit code. **The gate was not the problem.** The gate is right, and this ADR does
not propose weakening it. The problem is that the gate's only enforcement point is *"a skill an agent
may or may not be allowed to invoke,"* so a two-line data repair and a forged close are the same event
to the system, and only a human can tell them apart.

### 5. Atomicity — already admitted, and not hypothetical

[ADR-047](adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md) §4
says it in its own words:

> ⭐ *"**Atomic by INVOCATION, not by filesystem.** This ADR says so plainly rather than implying a
> transaction: an interrupted mover leaves a half-moved board, and §7's drift facts are what catch
> it."*

[ADR-048](adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md)
§"The gap" defines the resulting state class outright: *"A **half-landed close** is a close that moved
the task folder into `ai-agents/tasks/done/` but left at least one status location reading open work."*
**An entire ADR exists to define a repair mode for the failure this ADR proposes to prevent.**

**The mid-death evidence, at its honest standing.** A worker dying mid-multi-file-edit and leaving torn
state is **corroborated as a class, not as a mover run.** The strongest instance on record
([`reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md`](../reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md)
§"The three instances") is a **Process-review** worker that died mid-step when the owner's network
dropped: its corrections were **on disk**, its hand-off never arrived, and the driver that inspected
the repo **concluded "nothing landed" — which was false.** That report grades the finding precisely:
the partial landing is *"corroborated on disk"*; the driver's belief is *"testimony, not evidence"*;
the **cause** of any death is *"zero instances"* — no artifact records why a process stops.

⚠️ **State it exactly, and do not inflate it:** the corroborated instances are a review worker and a
wiki worker, **not a mover mid-close.** What is corroborated is (a) workers do die mid-edit, (b) the
resulting state is a partial landing, and (c) **a careful second reader misclassified one.** A mover
is the same shape of multi-file edit by the same kind of executor, so the class applies; the specific
instance does not exist in the record and this ADR does not invent one.

⭐ **The honest framing, which `aiboard-lead` asked for and volunteered against its own project:**
aiboard has the same property and never documented it. **Neither system is transactional.** fkit is
ahead only in having written the admission down (ADR-047 §4). A deterministic mover does **not** make
fkit transactional either — see *§Options*, B's honest limit. It makes the non-atomic window
**milliseconds and machine-checkable** instead of **minutes and prose-checkable**, and gives the last
step a defensible commit point.

### 6. The test surface — the repo already admits it is not there

`test/mover-exemption-step.test.js` is the closest thing to a mover test, and its own header says what
it cannot reach:

> ⚠️ *"It guards SOURCE TEXT, never BEHAVIOUR. Nothing here observes a mover actually running the
> guard during a close. A mover that carries the clause and ignores it reads green here. The clause is
> prose in a SKILL.md; prose is what this category of test can reach."*

The same file records a second structural blindness that is pure prose-transaction cost: the movers'
step-4 sweep is `grep -rn --exclude-dir=wiki-vault "<NNNN>-<slug>" ai-agents/` — **scoped to
`ai-agents/`**, while the exemption keys it must maintain live in `test/`. As the header puts it: *"The
mover is not forgetting to check them; it is structurally incapable of seeing them."* It *"fired for
real on `0358`, orphaning three keys in one close."*

**So: 1,814 lines of transaction logic, and not one test that executes it.** Not through neglect —
there is no way to execute it.

### 7. What the movers actually do today, in order

`fkit-task-done` §"Steps — do these in order": 1 resolve/validate → 2 read the task → **3 move the task
FOLDER to `done/`** → 4 find every reference → 5 update each tracked location → 6 handle ambiguity → 7
report. `fkit-task-cancelled` has the identical shape (steps 1–8, folder move at 3).

⚠️ **So the folder move is step 3 of 7, not last** — and ADR-047 §4 already measured and recorded this,
including a correction of its own earlier false claim:

> *"Measured: both task movers `git mv` **before** repointing … ⛔ **The sprint movers deliberately
> INVERT that order**"* — with the reason stated: a board is linked from far more places than it links
> to, so repointing while the file is still at its old path makes a missed reference a **dangling
> link** the guard catches, rather than a link to a path that exists nowhere.

**This matters for the expert's "folder move last" remedy and is the single most under-specified part
of it.** See *§Testing the expert's framing*, claim 3.

---

## Testing the expert's framing — claim by claim

| # | Claim | Verdict |
|---|---|---|
| 1 | *"the 'transaction' is an LLM walking prose"* | ⭐ **TRUE, and understated** — four movers, 1,814 lines, zero write-performing scripts (§1). |
| 2 | *"No lock, hook, queue or shared service can coordinate with that"* | ✅ **TRUE of the WRITE — but it must be said precisely** (below). |
| 3 | *"folder rename last"* | ⚠️ **DIRECTIONALLY RIGHT, NOT YET SPECIFIED** — it reverses a measured, reasoned ordering (below). |
| 4 | *"hook becomes a DELEGATE, not a veto — drag → command → exit code → UI, no queue needed"* | ✅ **FOLLOWS — conditionally** (below). |

**Claim 2, sharpened.** A hook *can* coordinate with the mover's **invocation** — the ADR-018
`PreToolUse` hook does exactly that today, and ADR-033 §Decision 1 leans on it. What nothing can
coordinate with is the **write**. Verified at source: the hook is registered in
`claude/fkit-claude.sh` §`build_settings()` with `"matcher":"Skill"`, and
`claude/skill-ownership-hook.sh` §"gate: only the Skill tool is in scope" **denies any payload whose
`tool_name` is not `Skill`** (*"unexpected tool_name … reached a hook registered for Skill only"*). So
`Edit`, `Write` and `Bash` — **the tools that actually perform every close** — pass ungated. The
precise statement is: **fkit gates who may START a close; nothing gates or observes the close itself.**
That is load-bearing for the ADR-033 blast radius below.

**Claim 3, qualified.** *"Rename is atomic"* is true of a single `rename(2)` within one filesystem. A
close is **not** one rename — it is a folder move **plus** N status-cell edits across briefs, boards
and epics. Moving the folder last therefore does not make the close atomic; it makes the folder move a
**commit point**: everything before it is a projection that can be recomputed and discarded, and the
folder's location becomes the single observable that says "this close landed." That is genuinely
better than today, *and* it inverts the order ADR-047 §4 measured and reasoned about, which means:

- The **task** movers would change order (currently move-then-repoint).
- The **sprint** movers already repoint-then-move, so they would *keep* their order and its named cost
  (*"an interrupted mover now leaves repointed links to a not-yet-moved board"*).
- ⛔ **A deterministic mover changes the arithmetic of that trade-off**, because the interrupted-run
  window collapses from minutes to milliseconds and a checker can run in the same process. **Whether
  ADR-047 §4's reasoning survives that change is a question for whoever designs the command — it must
  not be assumed either way, and this ADR does not settle it.**

**Claim 4, conditioned.** Delegate-not-veto follows **if and only if** (a) the command is the *only*
writer of terminal states, (b) its exit code is trustworthy — meaning non-zero implies nothing landed,
or a named recoverable state, and (c) the caller can read a machine-readable reason. Those are design
obligations on Option B, not free consequences of it.

---

## Options considered

> ⭐ **Kept whole after the owner's 2026-09-18 ruling.** A, C and D were **considered and not taken**;
> their reasoning is preserved unedited below, because *§Re-raise only if* depends on it. In
> particular: **the rejection of C stands**, and **the assessment that D alone cannot discharge D8
> stands** — D was adopted only in E's sense, as B's acceptance test.

### Option A — Do nothing. Movers stay prose. ⛔ **Considered and NOT taken.**

**Priced honestly, as a real candidate.**

- **What it costs nothing.** No new code, no new test surface, no ADR-033/029/047 ripple, no risk of a
  script that closes tasks wrongly at machine speed. The movers work: 405 tasks, and the expert's own
  audit found the duplicated carriers agree on **403 of 405** — *"fkit's duplicated carriers have not
  rotted"* (verdict §0.5). **The failure rate of prose movers is measured, and it is low.**
- **What it actually costs.** The §4 tax on every irregular close. The §6 test hole stays permanent.
  `0135`'s reconcile mode gets built against prose, then needs rewriting if this is ever revisited.
  And — the decisive one — **fkit can never truthfully say a tool wrote anything.** Every "the system
  did X" claim remains "an agent believed it did X."
- **Who it blocks.** Board-originated writes (ADR-049 §D8), a TUI, any external caller, any
  `--check` in CI.
- ⚖️ **Why it is not a straw man.** If the owner's answer to *"do I want to act on the board from the
  browser?"* turns out to be **no** — and ADR-049 D5's read-only posture is currently the adopted
  interim — then A's only remaining cost is the §4 tax and the test hole. Both are survivable. **A is
  the right answer if and only if fkit's write path is never called by anything but a session.**

### Option B — A real command; the skills call it. ⭐ **ADOPTED, sequenced as E (owner, 2026-09-18).**

One deterministic executable performing the state transition; the four SKILLs shrink to *decide, then
run the command, then report what it returned.* Judgement (is this task really done? what is the
cancellation reason? is this row ambiguous?) stays in the skill, where it belongs. Mechanics (find the
locations, write the cells, move the folder, verify, report) move into the command.

- **Gains:** a call site, an exit code, a unit, a test surface, a per-close token cost near zero, and
  one implementation instead of four drifting copies.
- **Keeps:** the skill as the sanctioned entry point — which keeps the ADR-018 hook meaningful (below).
- ⚠️ **Honest limit:** this does **not** make fkit transactional. It makes the window small and the
  outcome checkable. Say so in the ADR that ships it, exactly as ADR-047 §4 said it.
- **Costs:** a new executable in the install share (ADR-036's declared-site inventory gains an entry),
  a real test suite, a migration where prose and command must agree, and **a script that can now do
  damage quickly.**

### Option C — The command replaces the skills entirely. ⛔ **Considered and NOT taken; the rejection below stands.**

Delete the mover SKILLs; the command is the whole thing.

- **Rejected.** The SKILLs are not merely mechanics. `fkit-task-done` step 6 (*"Handle ambiguity —
  never paper over it"*), ADR-048 Q5's link-not-nearness attribution, the contradicted-close
  exception's evidence bars — these are **judgement under ambiguity**, which is what the model is for.
  C throws away the good half to fix the bad half. It also makes closes invokable with no role check
  at all, which is a worse answer to the ADR-033 question than B's.

### Option D — Keep prose; add an outcome verifier. ⛔ **NOT taken as a standing alternative; adopted only inside E, as B's acceptance test.**

A `close-check` executable that, given a task id, reports whether every carrier agrees. Prose movers
stay; the checker runs after, and in CI.

- **Genuinely attractive and much cheaper than B.** It closes the §6 test hole *for outcomes*, catches
  half-landed closes deterministically, and needs no ordering change, no ADR-033 rethink, and no
  ADR-029/047 ripple.
- **But it does not discharge D8.** A verifier gives no call site and no exit code *for the write*. A
  browser drag still has nothing to call. It detects; it cannot execute.
- ⭐ **Its real role is as B's acceptance test**, not as B's alternative.

### Option E — Sequenced: D first, then B. ⭐ **ADOPTED (owner, 2026-09-18).**

Build the verifier first; use it to characterise the prose movers' actual behaviour across the 405-task
corpus; then build the command and require it to produce byte-identical outcomes.

- ⭐ **This is what the owner selected.** See *§Authority* ruling 1 and *§Decision* D1.

---

## Decision — ruled by the owner, 2026-09-18

> ⭐ **This section was the architect's *recommendation* until the owner ruled on 2026-09-18. He
> accepted it unchanged.** The reasoning below is preserved as written; only its standing changed —
> from *proposed* to *decided*. **Nothing was deleted to make it read cleanly**, and Options A, C and D
> stay recorded in *§Options considered* as considered-and-not-taken, with their reasoning intact.

**D1 — Adopt B, sequenced as E: build the verifier (D) first and make it the acceptance test for the
command (B). A and C are not taken.**

**D2 — The enforcement story is B-1: the skill stays the sanctioned entry point.** The command is an
implementation detail the skill invokes; the ADR-018 `PreToolUse` `Skill` hook keeps gating the
invocation exactly as it does today. ⚠️ **This is the status quo documented, not strengthened** — a
direct `Bash` call to the command bypasses the hook, **but so does a direct `Edit` today**, so the
prose movers' writes were never guarded either. **Producer-only remains separation of invoking
identity, never prevention** (ADR-033 §"The limit", inherited unchanged). This must be written down in
whatever ships the command, not glossed. **B-2 (a `Bash` matcher) was not taken** — argv matching is a
string game and ADR-036's declared-site inventory would grow a site that is easy to drift. **B-3 (the
command checks its own caller) remains unavailable**, not rejected: one OS uid, so it cannot.

**D3 — What is NOT decided here**, and must not be read into D1/D2: the folder-move ordering
(*§Testing the expert's framing*, claim 3, and *§Blast radius* 2–3), whether a prototype comes first,
and `0135`'s disposition. See *§Open questions*.

**The reasoning, as it was put to him and as it stands:**

**Why B over A** — one reason, not five: **A permanently forecloses any caller that is not a Claude
session.** Everything else (tokens, tests, the §4 tax) is cost that could be borne. That one is a
ceiling, and the owner has spent today asking what it would take to act on a board.

**Why the sequencing matters more than usual here.** There is no test surface, so a command built
first would have **nothing to prove it equivalent** to the prose it replaces — and the prose is what
403 of 405 tasks were closed by. The verifier is how the command earns the right to replace it.

**The main tradeoff, stated once and plainly:** B converts a **slow, expensive, mostly-correct,
human-legible** write path into a **fast, cheap, testable, opaque** one. Wrong closes stop being rare
and visible and start being instant and uniform. **That is the cost, and the verifier plus a
`--dry-run` are the price paid against it.**

---

## ⛔ What this ruling unblocks, and what it does not

**Read this before treating an `accepted` ADR as a work order. It is not one.**

**What the ruling DOES do:**
- It settles **which approach fkit takes** when the mover write path is next worked on: E (verifier
  first, as the command's acceptance test), then B (the command), with enforcement B-1.
- It **discharges ADR-049 §D8** as a *decision*. ADR-049's blocker on board-originated writes was
  *"the deterministic-movers decision is deferred"*. The decision is no longer deferred.
- It closes the re-litigation of A, C and D-alone. Those were weighed here; see *§Re-raise only if*.

**What the ruling does NOT do — each stated plainly so no future agent reads past it:**
- ⛔ **It authorises no implementation.** No verifier, no command, no test fixture, no skill edit, no
  `--dry-run`, no prototype has been written or is hereby permitted. **Building any of it needs its own
  authorisation from the owner, through the producer, as a task.**
- ⛔ **It does not unblock board-originated writes.** D8 is discharged as a *decision*; the command
  does not exist, so there is still **nothing to call**. Whether a board may write at all remains an
  aiboard decision on aiboard's board (ADR-049 D7), and ADR-049 D5's read-only interim posture is
  untouched.
- ⛔ **It does not settle the folder-move ordering**, and therefore does **not** amend or reaffirm
  ADR-047 §4. That stays open (OQ-5) and belongs to whoever designs the command.
- ⛔ **It does not re-scope, hold or authorise `0135`.** That is the producer's call to file (OQ-4).
- ⛔ **It does not make fkit transactional**, weaken the producer-only gate, or soften ADR-033's
  2026-09-18 addendum. See *§Consequences — Residual* and *§Blast radius 7*.

---

## Blast radius — worked, not listed

### 1. ADR-033's producer-only rule — **the hardest one, and it needs the owner's eye**

ADR-033 §Decision 1 makes producer-only **structural** by routing every mover through the ADR-018
`Skill` hook: *"The ADR-018 `PreToolUse` hook then **denies** a mover call from any non-producer
identity at any spawn depth — this makes the rule **structural**, unlike ADR-025's prose."*

⚠️ **Verified at source today: the hook's matcher is `"Skill"`, and the hook script explicitly denies
any other `tool_name`.** So `Edit`, `Write` and `Bash` are **not** guarded — which means the prose
movers' *writes* were never guarded either. **A command is therefore not automatically less guarded
than prose; only the enforcement story changes, and it must be stated rather than assumed.** Three
candidate stories were put to the owner; ⭐ **he ruled B-1 on 2026-09-18** (*§Authority* ruling 2,
*§Decision* D2). All three are kept below so the choice can be re-read:

- **B-1 — ⭐ RULED (owner, 2026-09-18): the Skill stays the only sanctioned entry.** The command is an implementation
  detail the skill invokes. The hook still gates the invocation exactly as ADR-033 intends. **A direct
  `Bash` call to the command bypasses the hook — but so does a direct `Edit` today**, so this preserves
  the status quo ante rather than weakening it. It must be documented as such, not glossed.
- **B-2 — NOT taken: add a `PreToolUse` `Bash` matcher recognising the mover command.** Stronger, and **fragile** —
  argv matching is a string game, and ADR-036's declared-site inventory grows a site that is easy to
  drift.
- **B-3: the command checks its own caller.** ⛔ **Not available.** Human and agents share one OS uid
  — the expert's §0.4 finding, and ADR-049's premise. The command cannot tell who ran it.

⭐ **The honest summary for the ADR that ships B: producer-only stays exactly as strong as it is today,
and today it is separation-of-invoking-identity, never prevention** — ADR-033 §"The limit" already says
so and is inherited unchanged.

### 2. ADR-029's folder authority and the ordering

[ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) makes the folder the task's one
home and the move a single `git mv` of the whole unit (§Consequences: *"`git mv` on the folder moves the
brief **and** its plan, worklog and ledger as one unit"*). **A command inherits that and benefits from
it** — the folder move is genuinely one filesystem operation, which is what makes "folder last" a
usable commit point. **The ordering change itself is not free** (§Testing, claim 3): it reverses the
task movers' measured order and must be reconciled with ADR-047 §4's reasoning, which was written for
prose-speed interruption windows.

### 3. ADR-047 §4 and the sprint/task order split

ADR-047 §4 fixes the **sprint** movers' four-step order and states the inversion deliberately, with a
named cost. A command that standardises "folder last" across all four either **confirms** that order
for sprints (good — one rule, both kinds) or **contradicts** ADR-047's reasoning for tasks. Either way
**ADR-047 §4 must be explicitly amended or explicitly reaffirmed by the ADR that ships the command.**
It must not be left to a reader to notice.

### 4. The skill-ownership hook — what it can and cannot see

Restated because it is the single most misread thing in this area:

- **Can see:** that a `Skill` call was made, which skill, and the real invoking agent's `agent_type` at
  any spawn depth (ADR-018 §Decision 4).
- **Cannot see:** any `Edit`, `Write` or `Bash` call; anything about the *content* of a write; whether
  a close half-landed; and **any human behind the identity** (ADR-049's premise, now accepted).

### 5. A test surface that does not exist today

B's real deliverable is not the script — it is the first **behavioural** test fkit has ever had for a
close. Minimum, consistent with ADR-014's mechanics (`node --test`, zero devDependencies):

- A **fixture repo** under `test/fixtures/` with briefs, boards and an epic — so a close can be *run*,
  not *read*.
- Round-trip cases: clean close; close with an epic slice; close of a task with a `➡️ Moved` pointer
  row (must never be flipped — ADR-048 Q5); ambiguous row (must refuse); already-closed folder (must
  stop).
- **Interrupted-run cases** — kill after each step, assert what the checker reports. **This is the test
  class that cannot exist at all today.**
- The `NAMED_EXEMPT` interaction `test/mover-exemption-step.test.js` currently guards *as prose* becomes
  assertable *as behaviour*, closing the hole that file names in its own header.

### 6. ADR-048's unbuilt reconcile mode (`0135`) — **a deterministic mover changes what it means**

`0135` is still in `ai-agents/tasks/backlog/`. ADR-048 exists to repair the half-landed closes that
**prose movers produce**. If B ships:

- The **population shrinks** — a millisecond command with a checker leaves far fewer half-landed
  closes.
- The **mode's home moves.** Reconcile stops being "a producer-only branch of a prose skill" and
  becomes "a mode of the command, still producer-entered," with ADR-048's Q4 must-never list and Q5
  detection rule carried over **verbatim** — they are the artifact of worth, exactly as the owner said
  when he ruled *"The artifact of worth is the constraint list, not the feature."*
- ⚠️ **Sequencing risk, and it is live *now* — the owner accepted B on 2026-09-18:** if `0135` is built
  against prose before B lands, it is built twice. **`0135` should therefore be re-scoped or held — but
  that is a producer call, not mine, and it has NOT been decided** (OQ-4). This ADR only flags it.

### 7. ADR-033's 2026-09-18 one-time bypass addendum — what it becomes

The addendum authorised **two named briefs** and was *"spent on execution."* Under B, the same
situation would be a **repair mode of the command**, gated on the same evidence bars (folder in
`done/`, open-work `## Status`, one linked row, no marker to upgrade) — machine-checked instead of
prose-checked. ⛔ **The identity gate itself does not move.** The addendum's *"What a future agent may
NOT take from this"* stands whole, and B must not be read as softening it. What B removes is the need
for a **live owner ruling to perform a two-character data repair** — it does not remove the need for an
owner ruling to **forgive an identity**.

### 8. ADR-049 (accepted 2026-09-18) — the dependency, discharged

- **This ADR discharges D8 — as a DECISION, on 2026-09-18.** B is adopted, so ADR-049's *"the
  deterministic-movers decision is deferred"* deferral is gone. ⚠️ **But the blocker's factual half is
  not:** *"there is no command to call"* is **still true today**, because nothing is built. The
  delegate-not-veto seam (drag → command → exit code → UI, no queue) becomes **buildable in principle**
  and nothing more. **It does not become built, and it does not become authorised** — that remains an
  aiboard decision on aiboard's board, per ADR-049 D7.
- **ADR-049's acceptance does not decide this ADR.** It settles what a close may claim; it says nothing
  about what performs the write. The measurement, the tax, the atomicity gap and the test gap below are
  properties of fkit's write path and would stand under any ruling on the claim.

---

## Consequences *(of the decision — adopted 2026-09-18; **the build is not authorised**, so these are what shipping B would bring, not what is in force today)*

**Positive**
- fkit gains its first **callable, testable** write path. *"A tool wrote this"* becomes sayable, and
  true.
- The §4 tax on irregular closes drops from *escalation + ruling + ADR addendum* to *command + exit
  code*.
- 1,814 lines of duplicated procedure collapse toward one implementation plus four thin decide-and-call
  skills. Per-close token cost falls to near zero.
- The half-landed-close class shrinks at source rather than being repaired after the fact.
- The interrupted-run failure mode becomes **testable**, which it has never been.

**Negative / costs — stated plainly**
- **A new executable that mutates the task tree at machine speed.** A wrong close is now instant and
  uniform instead of slow and visible. `--dry-run` and the verifier are the mitigation; they are not a
  guarantee.
- **Producer-only becomes an invocation-level guarantee explicitly** (B-1), and that must be written
  down rather than inherited by implication.
- **An ordering decision must be taken** (§Blast radius 2–3) and ADR-047 §4 amended or reaffirmed.
- **Migration risk:** prose and command must agree over the existing corpus, and only the verifier can
  show that.
- **ADR-036's declared-site inventory grows**, and grows in the place where drift has historically hurt.
- **`0135` is disturbed** — re-scope or hold (producer's call).

**Residual — named, not solved**
- ⛔ **fkit is still not transactional.** B shrinks the window and adds a commit point. It does not add
  a transaction. **Neither does aiboard** — `aiboard-lead` volunteered this, and the honest joint
  framing is that **neither system is transactional, and fkit's only current advantage is having said
  so in writing** (ADR-047 §4).
- **Identity remains a claim.** One OS uid; the command cannot know its caller (B-3, unavailable).
- **Extra-hop laundering is untouched** — ADR-033 §"The limit", inherited whole.

---

## Re-raise only if

> ⭐ **Updated 2026-09-18 for the ruling: B-via-E was adopted, A was not.** The A branch is kept because
> the command is **not built**, so until it is, fkit's live behaviour is still A's.

- **B-via-E is adopted but nothing is built, and an external caller is now wanted** (a board write, a
  TUI action, a CI check that closes) → that is not a re-raise, it is the **build authorisation** this
  ADR withholds; take it to the owner as a task. ⛔ **Do not bolt a bridge onto the prose** in the
  meantime.
- **The command is built and proves harder to keep correct than the prose was** — measured against the
  verifier, not felt — → reopen; the honest fallback is D alone (verifier over prose).
- **The ordering question (folder-last) turns out to need its own record** because ADR-047 §4's
  reasoning and the command's reasoning genuinely conflict → that is its own ADR, not a patch here.
- ⛔ **Do NOT re-raise** *"the movers work fine, 403/405"* as an argument against B **after** B is
  adopted. That number is A's strongest card and it was weighed here, in A's own entry, against the
  ceiling that decided it.

---

## Open questions — for the owner, not for an agent to settle

⚠️ **Two were answered on 2026-09-18; three were NOT, and they stay his.** An agent reading this ADR as
`accepted` must not treat 3, 4 or 5 as settled by implication.

1. ~~**Which option** — A, B (sequenced as E), or D alone?~~ ✅ **ANSWERED 2026-09-18 — E** (*§Authority*
   ruling 1). Recorded as the option text he selected; he typed no free text.
2. ~~**The enforcement story for producer-only** — B-1 or B-2?~~ ✅ **ANSWERED 2026-09-18 — B-1**
   (*§Authority* ruling 2). Same caveat: selected option text, not his own words.
3. 🔲 **OPEN — HIS. Is a prototype wanted before building?** ⛔ **No implementation is authorised by
   this ADR — not by its drafting and not by its acceptance — and none has been written.** If the owner
   wants the ordering question or the command's feasibility settled by a spike rather than on paper,
   that is a **separate authorisation** he has not given.
4. 🔲 **OPEN — HIS. `0135` — re-scope, hold, or build as-is?** Flagged here; it is the producer's call
   to file, and the owner's to decide. **The ruling did not touch it**, and the *§Blast radius 6*
   sequencing risk (built twice if built against prose first) is live and unmitigated.
5. 🔲 **OPEN — HIS. ADR-047 §4 — amend or reaffirm, and in which ADR?** *Suggested: in whichever ADR
   ships the command, explicitly, never by implication.*
   ⛔ **This ADR deliberately declined to settle the folder-move ordering** (*§Testing the expert's
   framing*, claim 3: *"this ADR does not settle it"*), **and nothing in the owner's 2026-09-18 rulings
   settles it either.** Adopting E and B-1 says nothing about whether the folder move goes last. **It
   is the command designer's question, and it must not be assumed either way.**

---

## Related

- [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
  — **`accepted` 2026-09-18.** §C6 (the finding) and §D8 (the deferral this ADR discharges).
- [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) — producer-only movers,
  §"The limit", and the 2026-09-18 one-time-bypass addendum.
- [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) — a task is a folder;
  `git mv` moves the unit.
- [ADR-047](adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md) §4 —
  the sprint movers' four-step order, the deliberate inversion, and *atomic by invocation*.
- [ADR-048](adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md)
  — the half-landed-close definition, Q4's must-never list, Q5's detection rule; task `0135` unbuilt.
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) /
  [ADR-036](adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md) — the hook and its
  declared sites.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why step 3 of the §4 tax
  had to be an escalation.
- [`reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md`](../reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md)
  §0 and §3 Point 9 — **where this finding came from.**
- [`reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md`](../reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md)
  §"The three instances" — the mid-death / partial-landing evidence, at its graded standing.
- Code read for this ADR: `claude/skills/fkit-task-done/SKILL.md`,
  `claude/skills/fkit-task-cancelled/SKILL.md`, `claude/skills/fkit-sprint-done/SKILL.md`,
  `claude/skills/fkit-sprint-cancelled/SKILL.md`, `claude/skill-ownership-hook.sh`,
  `claude/fkit-claude.sh` §`build_settings()`, `test/mover-exemption-step.test.js`.
- **Wiki:** **fkit-wiki** should ingest this ADR — **it is signed as of 2026-09-18** — and resync any vault page asserting
  that a mover is atomic or that the skill-ownership hook guards writes — **an architect never writes
  the vault.**

---

## ⭐ For a reader a year from now — the one paragraph to keep

Through 2026 fkit accumulated a series of failures that each looked like its own bug: a spawned
producer that could not lawfully repair two characters; a close that landed halfway and needed an
entire ADR to define its repair; a repair exception that refused precisely the identity the rule had
anticipated; a driver that read the disk after a worker died and confidently reported the opposite of
what was there; a guard the mover was structurally unable to see. **They were one bug.** fkit's state
transition — the act of marking work done — was **1,814 lines of prose executed by a language model**,
with no call site, no exit code, no unit of work, and no test that could run it. Everything anyone
tried to build against it — a lock, a hook, a queue, a shared service, a board you could drag a card
on — needed something to call, and there was nothing to call. **It was named by an outside reader in
one afternoon, and by nobody inside the project in eight months, because from the inside the movers
worked: 403 of 405 tasks agree.** A thing can work and still not be a thing you can build on.
