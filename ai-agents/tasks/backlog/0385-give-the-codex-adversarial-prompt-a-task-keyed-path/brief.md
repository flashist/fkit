# Give the Codex adversarial prompt a task-keyed path — two concurrent reviews silently share one file today

## ID
0385

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-09-10**, given live via `AskUserQuestion` in a `fkit lead` session — a selection
from the question's option list, and **the option label is the verbatim text**:
**"File a brief — task-keyed path (Rec)"**.

⛔ **Filed on the Backlog board, UNRANKED, appended last** — no row was renumbered, reordered or
re-ranked ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
⛔ **It is NOT on Sprint 8**, and Sprint 8's seven rows, goal and success criterion are unchanged by
this filing. Filed by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of a relayed ruling and deciding nothing beyond them.

### The defect, measured at HEAD `9943dcf`

**Every fkit review procedure writes the Codex adversarial prompt to ONE fixed shared path,
`.fkit/tmp/adversarial-prompt.md`.** Nothing keys it to the task, the round, the scope or the process.
⛔ **Two reviews running at the same time write and read the same file, and the last writer wins.**

**The seven sites that name the fixed path, measured 2026-09-10 by
`grep -rn "adversarial-prompt" claude/`:**

| Site | What it says there |
|---|---|
| `claude/skills/fkit-review/SKILL.md:42` | *"**Assemble the prompt** into `.fkit/tmp/adversarial-prompt.md` (gitignored; create the dir if needed)"* |
| `claude/skills/fkit-review/SKILL.md:62` | the run line: `codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md` |
| `claude/skills/fkit-adversarial-review/SKILL.md:36` | *"**Assemble the prompt** into `.fkit/tmp/adversarial-prompt.md` (gitignored — the only file you ever write; create the dir if needed)"* |
| `claude/skills/fkit-adversarial-review/SKILL.md:46` | the same run line |
| `claude/skills/fkit-stateful-review/SKILL.md:109` | Step 1 delegates to fkit-review Step 1 **and restates the run line inline**: `codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md` |
| `claude/agents/fkit-adversarial-reviewer.md:27` | the agent's own procedure summary: *"assemble the findings-only prompt plus the inline diff into `.fkit/tmp/adversarial-prompt.md`"* |
| `claude/README.md:118` | the documented run line, shown to users |

⚠️ **`fkit-stateful-review` is the one the live incident hit, and it is the one with the sharpest
irony:** it already carries a careful, multi-rule **ledger-key** procedure (task-id → task folder name
→ branch slug → stop and ask) so that two reviewers never fork the ledger — and then it writes the
Codex prompt to a path that key never reaches.

### ⭐ THE LIVE REPRODUCTION — IT HAPPENED THIS SESSION, 2026-09-10

**Reported to me by the `fkit-sprint-ship-loop` driver that spawned me**, and — separately —
**corroborated by files I measured on disk myself.** Both are stated, and which is which is stated.

**What the driver reported.** Two stateful reviews ran in parallel, on `0271` and on `0337`. The
`0271` reviewer overwrote `.fkit/tmp/adversarial-prompt.md` in the window between the `0337`
reviewer's write and its `codex exec` call, so **Codex reviewed the wrong task's diff**. The `0337`
reviewer discarded that run in full and re-ran from a task-keyed path,
`.fkit/tmp/0337-r2-adversarial-prompt.md`.

**What I measured myself, 2026-09-10, in `.fkit/tmp/` (untracked, gitignored local state):**

| File | Modified | What its scope header says |
|---|---|---|
| `.fkit/tmp/adversarial-prompt.md` | 2026-09-10 20:16 | *"This is the SECOND round of review on task 0271"* — the shared file holds **`0271`'s** scope |
| `.fkit/tmp/0337-r2-adversarial-prompt.md` | 2026-09-10 20:20 | *"# Scope — ROUND 2 of a stateful review on task 0337 (NOT 0271 — ignore any other prompt file)"* |

⭐ **Read that second header again.** The `0337` reviewer did not merely move to a new path — it wrote
a **defensive disclaimer into the prompt body**, telling Codex to ignore the other prompt file. A
reviewer hand-writing a warning to the model about a filename collision is the defect showing through
the procedure.

⭐ **And this is not the first time a reviewer worked around it.** `ls .fkit/tmp/` returns **29 files
matching `adversarial-prompt`**, of which **28 are already task-keyed** — `0126-adversarial-prompt.md`,
`0130-…`, `0133-…`, `0133-r2-…`, `0167-r2-…`, and so on, spanning **2026-07-29 to 2026-09-10**. Exactly
one is the bare shared name the skills actually prescribe. ⛔ **The task-keyed convention has been in
real use for six weeks and lives nowhere in any skill.** Every reviewer that used it re-derived it
alone, and any reviewer that follows the written procedure literally gets the shared path.

### ⛔ WHY THIS IS WORSE THAN THE ONE INCIDENT — THE FAILURE IS SILENT

⛔ **Codex does not error on a wrong prompt. It reviews it.** It returns a well-formed, confident,
diff-grounded findings list — of **the wrong task's diff**. There is no exit code, no empty output, no
auth failure, and therefore **none of the graceful-degradation branches the review skills already have
ever fires**. The `Coverage:` field says the pass completed, because it did.

⭐ **Nothing detects it.** No test, no hook, no ledger field. This instance was caught by **a
reviewer's own vigilance** — it noticed the findings did not match the diff it had fenced — and by
nothing else. ⛔ **A less attentive round would have merged the wrong review into the ledger, and the
ledger's accepted-residual memory would have carried it forward into later rounds.**

### ⚠️ ATTRIBUTION — SAID PLAINLY, BECAUSE IT CUTS BOTH WAYS

⚠️ **The ship-loop driver caused this instance** by scheduling two stateful reviews in parallel.
⛔ **But the defect is in the skill, not in the scheduling.** Two independent facts, both measured
above:

1. **The skill offers no safe way to run two reviews at once.** The path is a literal in the
   procedure; a reviewer following it correctly collides.
2. **Nothing warns against it.** No line in `fkit-review`, `fkit-adversarial-review`,
   `fkit-stateful-review`, `fkit-adversarial-reviewer.md` or `claude/README.md` says the prompt file is
   shared, says two reviews must not overlap, or says what to do if they do.

⭐ **A procedure that is only safe when nobody runs it twice, and never says so, is a defect in the
procedure.** Fixing the scheduler would hide this one instance; it would not make the skill safe for
the next caller, and fkit's whole direction is more parallel workers, not fewer.

## What to build

**The owner named the fix: a task-keyed path.** Build that, at every site measured above.

1. **Replace the fixed literal with a per-run key at all seven sites.** Recommended shape —
   `.fkit/tmp/<key>-adversarial-prompt.md`, with a round suffix where a round exists
   (`.fkit/tmp/<key>-r<N>-adversarial-prompt.md`). ⭐ **This is exactly the convention 28 files on
   disk already follow** — the task is to write down what reviewers already do, not to invent a new
   shape.
2. **Derive `<key>` from the key rule the stateful skill already owns, do not invent a second one.**
   `fkit-stateful-review` already resolves a ledger key (explicit task-id → task folder name → branch
   slug → stop and ask). **The prompt path should use that same resolved key**, so the prompt and the
   ledger it feeds can never disagree about which task they are about.
3. **Answer the two cases that have no task key** — see *Open questions*: `fkit-review` and
   `fkit-adversarial-review` are **ephemeral** and may be run on a bare working tree with no task at
   all. They still need a path that two concurrent runs cannot share.
4. **State the hazard in the procedure text.** One line at the assemble step in each of the three
   skills: the prompt path must be unique per concurrent run, and **why** — a stale prompt produces a
   confident review of the wrong diff, with no error.
5. **Update the two doc sites to match** — `claude/agents/fkit-adversarial-reviewer.md:27` and
   `claude/README.md:118`. A doc that still shows the shared literal re-teaches the defect.

### Implementation guidance

- The three SKILL files and the agent file are **fkit-managed sources under `claude/`** — edit those,
  never the `.claude/` copies (they are gitignored and refreshed by `claude/fkit-claude-init.sh`).
- `claude/skills/fkit-stateful-review/SKILL.md` **restates** the run line rather than only pointing at
  `fkit-review`. Both the restatement and the source must change, or the two drift.
- `.fkit/` is gitignored in full (`.gitignore` line 8, `.fkit/`), so no new path needs a gitignore
  entry.
- Check whether `claude/orphan-targets` or the structure spec/manifest reference the prompt filename
  before changing it; `claude/orphan-targets` mentions `.fkit/tmp/` as a directory, not the file.

## Verification steps

1. `grep -rn "adversarial-prompt" claude/` returns **no bare `.fkit/tmp/adversarial-prompt.md`** — every
   remaining occurrence is keyed, or is prose describing the keying rule.
2. **Concurrency check, by reading:** for two simultaneous runs on different tasks, walk the amended
   procedure and confirm the two derived paths cannot be equal. Include the same-task-different-round
   case and the two keyless-ephemeral cases.
3. `npm test` green — the full node suite **and** `test/prove-red.sh`. ⚠️ Baseline measured at HEAD
   `9943dcf` on 2026-09-10: node suite **877/877**, `prove-red` **gate PASSED, 32/32**.
4. `test/skill-frontmatter.test.js` and `test/dual-home-parity.test.js` still green — both read the
   `claude/` sources being edited.
5. Confirm no `.claude/` copy was hand-edited: `git status` shows changes only under `claude/`.

## Not in scope

- ⛔ **No lock, mutex, PID file, or scheduling control.** The owner ruled a **task-keyed path**. A
  locking design is a different decision and would need its own ruling.
- ⛔ **No change to the ship-loop's scheduling** — not the fix, and see *Attribution*.
- ⛔ **No change to review semantics** — not the coverage states, not the graceful-degradation
  branches, not the ledger schema, not the findings-only output contract.
- ⛔ **No `ai-agents/knowledge-base/` edit.** `architecture.md` and `adr-016` / `adr-042` mention the
  fixed path; amending an ADR or the architecture doc is the **architect's**, and ADR-047 was being
  amended in parallel on 2026-09-10. **Flag the stale mentions in the hand-off; do not edit them.**
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **No `NAMED_EXEMPT` additions.**
- ⛔ **No new devDependency** — [ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)
  §*"Zero devDependencies, no lockfile, no `node_modules` — whichever runner wins"*. ⚠️ **This repair
  needs none**: it edits markdown procedure text only.
- ⛔ **No `.fkit/tmp/` cleanup or retention policy.** ⚠️ Observed, not scoped: the directory holds
  **167 files** as of 2026-09-10. That is a separate question and needs its own ruling.
- ⛔ **Do not key the Codex *output* files.** Measured: no skill prescribes `codex-out.txt` /
  `codex-err.txt` at all — reviewers invent those names per run. Naming them is new procedure, not this
  repair.

## Notes

### Dependencies

**Depends on: nothing.** **Blocks: nothing.** The seven sites are all under `claude/`, and no Sprint 8
row touches them.

⚠️ **Adjacent, not a dependency:**
[`0378`](../0378-decide-how-a-worker-tells-a-concurrent-close-s-transient-link-red-from-its-own/brief.md)
— *"decide how a worker tells a concurrent close's transient link red from its own"*. Same shape of
problem (two workers colliding on shared state), different mechanism and different file. ⛔ **Do not
fold them together** without a ruling.

### Open questions for the owner

⭐ **NEEDS-DECISION — the keyless-ephemeral case.** `fkit-review` and `fkit-adversarial-review` can be
invoked on a bare working tree with **no task id and no task folder**, and `fkit-stateful-review`'s key
rule can also land on a **branch slug** rather than a task. The producer's recommendation is: use the
resolved ledger key when one exists, and otherwise a run-unique suffix the procedure can produce
without asking (branch slug, else a timestamp). ⚠️ **A timestamp is a recommendation, not a ruling** —
it is the one part of the shape the owner has not settled, and it changes what the coder writes.

⭐ **NEEDS-DECISION — whether the round suffix is mandatory or optional.** 28 files on disk use both
forms (`0126-adversarial-prompt.md` and `0133-r2-adversarial-prompt.md`). Two rounds of the same task
never run concurrently, so `-r<N>` is about **readable history**, not collision safety. Producer's
recommendation: mandatory where a round number exists, because the review ledger already numbers rounds
and a matching filename makes an incident like this one diagnosable after the fact.
