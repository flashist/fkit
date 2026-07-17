# Add a worked example to `evidence-before-assertion.md`, drawn from task 36

## Sprint
Backlog (unsprinted)

## Priority
Unscheduled

## Status
🔲 Backlog

## Context

**The ask, from the fkit-reviewer's Round 2 closeout of task 36, owner-approved 2026-07-17:** add a
**worked example** to [`ai-agents/knowledge-base/conventions/evidence-before-assertion.md`](../../knowledge-base/conventions/evidence-before-assertion.md)
showing what it costs when the convention is ignored. The reviewer's words, at
`ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md:160`: *"That belongs in
`conventions/evidence-before-assertion.md` as a worked example."*

**Why prose is being asked to do more work than prose usually does.** The rule was already written
down. It was already **stated in the words that fit this exact failure** — task 27's Correction in
[`sprint-2.md:354`](../../sprints/sprint-2.md): *"a behavioral claim about a shell builtin or coreutil
is a claim to run, not to reason about."* It was still broken **four times in one task, by the
fkit-coder, who read the convention at the start of that task.** The reviewer's framing: *"Naming a
pattern doesn't stop it; a red-first test does."* A stated principle demonstrably did not survive
contact. The proposal is that a concrete, unflattering example might — the sanitized version teaches
nothing.

**The convention's existing preamble is already a worked example** (the 2026-07-13 producer incident,
told in specifics, three failures named). So this task is not inventing a form — it is **adding a
second entry in the form the document already uses**, and the two together make the point the single
one cannot: *this happens to every role, and being told the rule does not stop it.*

## The evidence — task 36, ledger [`ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md`](../../reviews/remove-fkit-omnigent-orphan-residue.md)

**Verified against the ledger while scoping this brief** — every claim below has a line reference, per
the convention this task is about.

- **The pattern, one sentence (the coder's own name for it):** *asserting the complaint rather than
  the behavior* — writing a test that checks for the error message you expect, rather than the
  behavior you claim to have fixed. **Four instances in one task** (ledger :210, :214).
- **The sharpest instance — R7** (ledger :92, :196, :214-217). While fixing finding C2, the coder wrote
  a code comment asserting *"rm -rf can unlink the CONTENTS (it needs write on the parent for that,
  which it has)"*. **That is false** — unlinking an entry needs write on **that** directory, not its
  parent. It was reasoned, not run. A test was then built on the false premise, so its `if (emptied)`
  branch was **dead code** and its `else` branch **asserted the broken message was correct** — while,
  under the same fixture, `.fkit/agents/fkit-coder/agent.yaml` was **actually destroyed**. The suite
  went green. C2 was reported fixed to the owner. **It was not fixed.** The reviewer and Codex both
  caught it. This happened *inside the fix for the finding that named the pattern, after the pattern
  had already been named twice in the same ledger.*
- **The punchline — the correlation, confirmed by the reviewer** (ledger :156-158, :222-223): **every
  fix that was red-proved — neuter the fix, confirm the bug returns — survived review (R1, R2, R8).
  Every fix that was not red-proved was found broken by someone else (C2, and C7's own fix).** Two for
  two, both directions, one task.
- **Cost of the check that wasn't run: about thirty seconds** of `mkdir` / `chmod` / `rm -rf`.

## What to build

- **One new worked example in `evidence-before-assertion.md`**, in the document's existing style: a
  short, specific, blockquoted-or-sectioned account, then the rule it generalizes to.
- **Write it from the ledger, not from anyone's account of the ledger.** Read
  `ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md` directly — the whole *Coder response*
  section, especially "Findings I have to own" (:206-223) and the R6/R7/R8 rows (:91-93).
- **Keep it unflattering and specific.** Name the false claim verbatim, name that the suite was green,
  name that the owner was told it was fixed. The generic version ("verify your assumptions") is what
  the document already says and what already failed.
- **Lead with the correlation, not the anecdote.** R1/R2/R8 survived, C2/C7 did not — that is the part
  that is evidence rather than storytelling, and it is what makes the example a rule.
- **Extend "The rule" with the generalization the example earns**, rather than only appending a story.
  Candidate wording, for the author to judge, drawn from the ledger's own conclusion (:221): *red-prove
  the test, or do not claim the fix.* Plus task 27's already-written form: *a behavioral claim about a
  shell builtin or coreutil is a claim to run, not to reason about.*
- **Do not touch the existing 2026-07-13 preamble example.** It carries the producer-side lesson; this
  adds the coder/test-side one.
- **Update the Provenance section** to name task 36 and this brief alongside the 2026-07-13 incident.

## Verification steps

- Every quoted claim in the new example resolves to a line in the task 36 ledger. **No claim written
  from memory** — this document, of all documents, cannot contain an unchecked assertion.
- The `rm -rf` permission fact stated in the example is **run, not reasoned** — `mkdir`/`chmod`/`rm -rf`
  in a scratch dir, confirming that unlinking needs write on the holding directory, not the parent.
  Writing "he was wrong about the parent" without running it would reproduce the exact defect the
  example is about.
- The document still reads as a **convention** (prescriptive, current) and not as an incident report —
  the examples serve the rule; the rule is not a footnote to the examples. See the
  convention/report boundary in [`conventions/README.md`](../../knowledge-base/conventions/README.md).
- Length check: the doc stays something an agent actually reads on a normal run. If two worked examples
  make it long enough to skim past, it has failed at its only job.
- **`conventions/README.md` needs no new row** — this amends an existing convention rather than adding
  one. Confirm that is still true of whatever ships.

## Notes

- **Owner: fkit-producer** (this role). Deliberate, and the reason is load-bearing: **the fkit-coder
  must not write this** — the example is about the coder's own failure, and a self-authored version
  will soften exactly the parts that make it useful. The coder said so itself and did not ask for the
  task. The **fkit-reviewer raised it but cannot own it** — the reviewer writes only under
  `ai-agents/reviews/`, never the knowledge-base. The producer is the nearest role that is both
  permitted to write here and not the failing party. **The coder is available as a consult for factual
  questions about the ledger, but does not draft the text.**
- **⚠️ Needs the owner's sign-off before it ships** — per `conventions/README.md` §"Who writes here",
  a convention is a rule imposed on every future run. The reviewer explicitly flagged this as *"not my
  call, not a blocker."* Amendment, not a new document, so the bar is lower — but it is not zero.
- **Tested against the convention-authoring bar** (`conventions/README.md`, all four must hold): (1)
  read on a normal run — ✅, the doc already is; (2) prescriptive — ✅ if the rule is extended, ❌ if
  only a story is appended, which is why "What to build" requires the former; (3) **enforceable
  somewhere — ⚠️ this is the weak leg, see below**; (4) not already covered — ✅, it amends rather than
  adds. **The bar is genuinely at risk on leg 3, and the author should not paper over it.**
- **🔴 The real counter-argument, recorded not buried: the rule was already stated and still broken, so
  the lesson may be that it needs an *enforcement point*, not more prose.** This brief does not settle
  that and must not pretend to. Two facts sharpen it beyond how it was handed to me:
  - **An enforcement point already exists — and its scope excludes exactly where task 36 failed.**
    `test/prove-red.sh` (task 23 / [ADR-014](../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md))
    is this project's hard mutation gate, built on *"a test that has never failed has not been
    tested"* — which **is** "red-prove or don't claim the fix", already mechanized. But its header
    (`test/prove-red.sh:20-25`) declares **two mutations, both against the launcher**. It does not
    cover `test/orphan-cleanup.test.js` or `fkit-claude-init.sh` §6. **The gate that encodes this
    rule did not run on the tests that broke it.** That is a stronger argument for extending the gate
    than for extending the prose.
  - **The owner has already parked the broader enforcement question** — *"record as a question for
    later, do not act now"* (2026-07-17), raised in the same breath for the `-L`-before-deref doctrine
    (`gate-symlink-escape-in-init-intake-write.md`, whose Context makes the identical observation: *"a
    rule stated in a file's own comments and then missed twice is not three bugs — it is one doctrine
    that has no enforcement point"*).
  - **Also live and adjacent: [`investigate-mutation-testing-library-adoption.md`](investigate-mutation-testing-library-adoption.md)**
    (Sprint 2, priority 46) — the owner's ask to replace hand-rolled `prove-red.sh` with a proper
    mutation-testing library. **That task is the natural home for the enforcement answer**, and it is
    already sprinted and ahead of this one.
- **Scope call — kept separate from the enforcement question, deliberately.** These are one lesson but
  two tasks, and merging them would mean the cheap owner-approved half waits on the parked half.
  Justification: the doc change is small, approved, and independently shippable; the enforcement
  change is an unanswered owner question with a live investigation task already pointed at it. **The
  honest limit: this task is not expected to stop the failure — it documents it.** If the owner wants
  the failure *stopped*, the answer is the mutation-gate scope, not this brief. Ship this on its own
  merits (the record is worth having either way) or drop it, but do not let it stand in for
  enforcement.
- **Not a hard dependency, but a sequencing note:** if the mutation-testing investigation lands first
  and produces a real gate, this example gets **better** — it can name the gate that now catches this.
  It does not need to wait.
- **Risk: low.** Documentation only, no source change, no runtime surface. The only real risk is
  writing a story instead of a rule, which verification step 3 exists to catch.
- **Evidence sources:** `ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md` (*Coder response*
  section — "Findings I have to own" :206-223, R6/R7/R8 rows :91-93, reviewer closeout :156-160);
  `ai-agents/knowledge-base/conventions/evidence-before-assertion.md`;
  `ai-agents/sprints/sprint-2.md` §Correction (:330-354) — task 27's identical lesson;
  `test/prove-red.sh:1-25` — the existing gate and its declared scope.
</content>
</invoke>
