# Add a fidelity leg to the faithful-carry construction — hash the emitted paste, not just the file

## ID
0227

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Source: adversarial-review finding `AR-1` against the 2026-08-05 `/fkit-sprint-ship-loop` driver run.**
⚠️ *Attributed, not re-derived — this brief's author did not read the review ledger first-hand.* The
finding was relayed through the live driver session, and the owner ruled on **2026-08-05** via
`AskUserQuestion` that it be filed.

**The gap, in one line: the faithful-carry construction's steps test PROVENANCE and PRESENCE — never
FIDELITY. Nothing checks that what the driver *emitted* matches what it *read*.**

Read the live steps in `claude/skills/fkit-sprint-ship-loop/SKILL.md` (the numbered Build/Process-review
spawn construction) and the gap is structural, not an oversight in any one step:

| Leg | What it establishes | What it does not |
|---|---|---|
| Step 2 — `wc -c` vs bytes `cat` returned | the **read** was whole | nothing about what was written |
| Step 4 — path + `git hash-object <path>` | **provenance**: a hash *of the file* | not a hash of the paste |
| Step 6 — look at the prompt, confirm both legs | **presence**: bytes are there, pointer is there | not that those bytes are *those* bytes |

Every leg is satisfied by a prompt containing *some* prose in the paste position and a correct hash of
the file beside it. **The two are never compared to each other.**

### ⚠️ This is not hypothetical. It fired on the run that produced this brief.

**Motivating instance — 2026-08-05, this driver run.** The driver read `plan.md`, put text into the Build
spawn prompt, and looked at the prompt before sending. That sequence **passes step 3, passes step 6, and
passes both governing sentences** the construction turns on:

> **"Verbatim" is a word a driver may apply only to bytes it read from a file that turn.**
>
> **"Both ways" is a phrase a driver may use only after looking at what it wrote.**

The driver *had* read the file that turn. The driver *had* looked at what it wrote. **And the paste was a
condensed restatement, not the bytes** — characterized by the session that caught it as roughly a 60%
condensation. ⚠️ *That figure is relayed from that session and is NOT a measurement taken when this brief
was written; re-measure it or drop it rather than repeating it as fact.*

**It was caught only because the *pointer* leg let the Build worker compare** — the worker had a path and
a hash, fetched the file, and saw the divergence. Detection was **downstream, by luck of a worker who
bothered**, not by any step the driver runs. That is exactly the shape step 6 was added to prevent after
the 2026-08-03 `0202` incident, and it recurred in a form step 6 cannot see: **step 6 catches an absent
leg; it cannot catch a present-but-wrong one.**

## What to build

**A fidelity leg in the same numbered construction** — one added check the driver runs *before sending*,
which compares the emitted paste against the file it claims to be.

- **The mechanism:** the driver re-derives `git hash-object` **over the pasted block itself** — the exact
  bytes sitting in the spawn prompt — and compares that to the hash it cited in step 4's pointer, which
  was taken over the file. **Equal, or the carry has failed.** The essential move is that the hash is
  taken over *the emitted text*, not merely over *the file*; hashing the file twice proves nothing new.
- **A failed comparison is a failed carry, not a carry to patch up** — it takes the existing degraded
  form (pointer-only, degradation declared), matching how the construction already treats a short read.
  Do not invent a third outcome.
- **State the result, do not merely perform it** — in the same shape step 6 already requires. A driver
  that ran the comparison and did not say so has not satisfied this leg.
- **Extend the governing sentences to cover it.** The two above are both satisfiable by a driver that
  emitted the wrong bytes; whatever wording is added must close that, in the same terse form.

### ⛔ MANDATORY HONESTY CLAUSE — carry it into the rule text, the plan and the worklog, unsoftened

> **A driver hashing its own emitted text and comparing it to its own computed hash is still
> SELF-REPORT.** Every input to the check — the paste, the hash, the comparison, and the statement of
> the result — is produced by the same actor whose fidelity is in question. **It narrows the hazard; it
> does not close it.** A driver that would condense a paste can also mis-report a hash comparison.

**What actually closes it: `0204`'s `PreToolUse`/`Task` carry-check hook**, which is *external* to the
driver — the harness reads the spawn payload and compares it to the file, so no driver assertion is
involved. **Say how this task relates to `0204`; do not duplicate `0204`.**

- This task is the **prose/self-check** leg — cheap, lands without a hook, and works in **spawned and
  non-launcher sessions where `0204`'s hook is not registered at all** (`0204` caveat 5).
- `0204` is the **mechanical** leg. It supersedes this one as a *guarantee* but not as *coverage*.
- **⛔ Do not write anywhere that this task makes the carry checked.** The construction's own honest-bound
  paragraph — *"This construction narrows the hazard; it does not remove it"* — is the register to match.

### Out of scope

- ⛔ **The `0204` hook itself**, and `0203`'s `unverified` marker text. Different tasks.
- ⛔ Condition (b)'s wording in `claude/agents/fkit-coder.md`.
- ⛔ `ai-agents/wiki-vault/`. ⛔ No commit.

## Verification steps

1. **The fidelity leg exists as a step a driver runs, and names the emitted paste as the thing hashed.**
   Read the changed text: a step that hashes only the file again does not satisfy this task and must fail
   review.
2. **The honesty clause is present in the shipped rule text**, in substance — that the check is
   self-report, that it narrows rather than closes, and that `0204`'s hook is what closes it. **A change
   that ships the check without the clause has failed this step**, because it converts a narrowing into
   an apparent guarantee, which is the exact failure the construction's own honest-bound paragraph warns
   against.
3. **The failure path is the existing degraded form**, not a new one. Diff to confirm no fourth outcome
   was introduced.
4. **The motivating instance is recorded** in the rule text as the 2026-08-03 `0202` incident already is
   — one sentence, naming the date and that the paste was a condensed restatement that passed steps 3 and
   6. Precedent matters more than length here: the existing incident notes are what stop a future editor
   softening the rule.
5. **`git diff` shows the change confined to `claude/skills/fkit-sprint-ship-loop/SKILL.md`** (plus any
   test added). No `ai-agents/` source of truth rewritten, no `wiki-vault/`.
6. **The two existing governing sentences are still present and unweakened** — diff them. Adding a third
   is in scope; rewriting either of the two is not.
7. If a test is added, it **proves red** without the change (`test/prove-red.sh` is the existing harness)
   and `npm test` is green. Record pass/fail/suite counts. ⚠️ If the change is prose-only and no test is
   practical, **say so explicitly in the worklog and state that this leg is unguarded** — do not leave the
   coverage question unanswered.

## Notes

- **Depends on:** nothing. It lands independently of `0202`, `0203` and `0204`.
- **Blocks:** nothing.
- **Relates to `0204`** — `0204` is the mechanical closure of the same hazard; this is the self-check
  narrowing that works where `0204`'s hook is not registered. Neither subsumes the other. **When `0204`
  lands, this leg becomes redundant *inside launcher sessions only*** — a future task may retire it
  there, but that decision is not this task's and must not be pre-empted in the rule text.
- **⚠️ HEAVILY CONTENDED FILE.** `claude/skills/fkit-sprint-ship-loop/SKILL.md` is edited by `0203`,
  `0208`, `0223`, `0224` and `0204`'s marker removal, and was under concurrent edit on 2026-08-05.
  **Re-read the live file before planning; locate the construction by heading and quoted phrase, never by
  line number.** ⛔ The paragraph headed *"The honest bound on 'true by construction'"* is **load-bearing
  and reviewer-protected** — this task adds beside it, it does not rewrite it.
- **Single brief, not split, and why:** the check, its failure path, and its honesty clause are one
  atomic edit to one numbered construction. Shipping the check without the clause ships a false
  guarantee (verification step 2), so they are not independently shippable — which is the split test.
- **⚠️ Filed on the Backlog board because the owner's ruling named no sprint.** A spawned producer has no
  owner channel and never invents a sprint placement. **Flagged for owner confirmation.**
- **Merit position, for the owner:** ⚠️ *No rank assigned — the Backlog board is unranked by design.* On
  merit, **directly adjacent to `0204`**, which addresses the same hazard by the other mechanism; the two
  should be ranked together whenever either is pulled into a sprint. **This one is the cheaper half and
  covers sessions `0204` cannot reach**, so it is defensible to pull it first.
