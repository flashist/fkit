# Add two worked examples to `evidence-before-assertion.md` — task 36, and the ADR-029/030 vault repair

## Sprint
Backlog

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
told in specifics, three failures named). So this task is not inventing a form — it is **adding
further entries in the form the document already uses**, and they together make the point a single
one cannot: *this happens to every role, and being told the rule does not stop it.*

**Scope widened by owner ruling, 2026-07-19: this task now carries TWO new worked examples**, not one.
The second is drawn from the ADR-029/030 vault repair of 2026-07-19 and is recorded in full below. It
earns its own entry rather than padding the first because it is a **different failure mode**: task 36
is one agent reasoning about a fact instead of running it, one hop. The second is an agent **trusting a
peer agent's correction** instead of verifying it, where the false claim then **travelled onward to the
owner as fact**. **Neither the convention's existing preamble nor the task 36 example covers the
multi-hop case** — a claim that is wrong at hop 1 and unchecked at hop 2.

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

## The evidence — example 2, the ADR-029/030 vault repair, 2026-07-19

**Source of this account: the owner's own ruling of 2026-07-19, relayed via fkit-architect, plus the
blockquote already standing in task 80's brief** ([`repair-stale-adr-029-stop-hook-links-in-the-vault.md`](repair-stale-adr-029-stop-hook-links-in-the-vault.md), lines 40-45).
**The two git checks below were re-run while scoping this widening and are confirmed**, per the
convention this task is about.

- **The setup.** During the ADR-029/030 vault repair, the owner's original framing was that the stale
  wikilinks **resolved to the wrong ADR**. **fkit-producer corrected this** to *"dead, not
  mis-resolving"*. **fkit-architect accepted that correction without verifying it and repeated it to
  the owner.** fkit-wiki then disputed it.
- **Who was right, checked against git — the owner's original framing was correct:**
  - `git cat-file -e HEAD:ai-agents/wiki-vault/wiki/decisions/adr-029-stop-hook-enforces-turn-completion-contract.md` → **exists**
  - `git cat-file -e HEAD:ai-agents/wiki-vault/wiki/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md` → **does not exist**
  - The links therefore resolved. They were **not** dead.
- **The root cause — the most useful part of the whole example, and the producer's own diagnosis:**
  the producer ran **`ls` on a half-repaired working tree, mid-repair, and read it as the original
  state.** The check that settles it is **`git cat-file -e HEAD:<path>`, never `ls`, when a repair is
  in flight** — because `ls` reports the state you have already partly changed, not the state you are
  reasoning about.
- **The propagation — state this precisely; an earlier telling got the count wrong.** It was **one
  claim propagating through two hops** — producer → architect, architect → owner — **with neither hop
  verifying**. It was **not** "two claims propagated on trust." The brief is required to be accurate
  rather than dramatic; the imprecise version was corrected by the owner and must not be reintroduced.
- **The cost was real and traceable.** A false statement **landed in task 80's brief and reached the
  owner**. It was caught **only because a third agent (fkit-wiki) dissented** — not by any check either
  of the two hops ran. **The urgency conclusion in task 80 was correct under either mechanism and was
  unchanged**; only the mechanism was misdescribed. Say that too — overstating the damage is its own
  unchecked assertion.
- **The counter-example, which is what makes this a rule rather than a scolding — do not omit it.**
  In the *same session*, when the producer flagged an earlier stale claim about §10 of the architect's
  spec (a registry contradiction), the architect **did** check it, and found it already fixed. So the
  failure was **not a blanket habit of trusting peers**. It was **inconsistent application of a check
  the agent had already demonstrated, in that same session, that it knew to run.** That is the honest
  lesson, and it is sharper than "agents trust each other too much."
- **The aggravating fact.** The architect's own role instructions state that reviewers are fallible and
  that claims must be verified against the codebase. **The architect stated that principle in this same
  session and then did not apply it.** A rule failing while its holder is actively quoting it is
  precisely what this convention says prose alone cannot fix.

## What to build

- **TWO new worked examples in `evidence-before-assertion.md`**, each in the document's existing style:
  a short, specific, blockquoted-or-sectioned account, then the rule it generalizes to. **Keep them as
  two entries** — they are two different failure modes and merging them loses the second.

### Example 1 — task 36 (the original scope, unchanged)

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
### Example 2 — the ADR-029/030 vault repair (added by owner ruling, 2026-07-19)

- **Write it from the two sources named above**, both of which the author can read directly: the
  material in "The evidence — example 2" in this brief, and **task 80's own blockquote**
  ([`repair-stale-adr-029-stop-hook-links-in-the-vault.md`](repair-stale-adr-029-stop-hook-links-in-the-vault.md) :40-45),
  which records the incident independently. **Re-run the two `git cat-file -e HEAD:` checks** rather
  than copying their results on trust — writing this example from an unverified account would reproduce
  the exact defect the example is about.
- **Lead with the mechanism, not the blame:** `ls` on a half-repaired tree reports the state you have
  already partly changed. **`git cat-file -e HEAD:<path>` is the check; `ls` is not**, whenever a repair
  is in flight.
- **State the propagation precisely: one claim, two hops, neither verifying.** Not "two claims." The
  owner corrected this count explicitly and accuracy here is the point of the document.
- **Include the counter-example** (the §10 registry claim the architect *did* check). Without it the
  entry reads as "agents trust each other", which is the wrong and less useful lesson. **With it, the
  lesson is: the check was known, demonstrated, and then not applied.**
- **Include that the third agent's dissent was the only thing that caught it** — no check either hop
  ran would have.
- **Do not overstate the damage.** Task 80's conclusion was correct under either mechanism; only the
  mechanism was wrong. Say so.
- **The rule this one earns**, for the author to word: *a peer agent's correction is a claim, not a
  fact — verify it before you repeat it, and especially before you repeat it to the owner.* Plus the
  mechanical form: *when a repair is in flight, read the original state from `HEAD`, not from the
  working tree.*

### Both examples

- **Keep them unflattering and specific.** Name the false claim verbatim, name that the suite was green
  / that the owner was told it was fixed. The generic version ("verify your assumptions") is what the
  document already says and what already failed.
- **Lead example 1 with the correlation, not the anecdote.** R1/R2/R8 survived, C2/C7 did not — that is
  the part that is evidence rather than storytelling, and it is what makes the example a rule.
- **Do not touch the existing 2026-07-13 preamble example.** It carries the producer-side lesson; these
  add the coder/test-side one and the cross-agent/multi-hop one.
- **Update the Provenance section** to name task 36, the 2026-07-19 ADR-029/030 repair, and this brief
  alongside the 2026-07-13 incident.

## Verification steps

- Every quoted claim in **example 1** resolves to a line in the task 36 ledger. **No claim written
  from memory** — this document, of all documents, cannot contain an unchecked assertion.
- **Example 2's two git facts are re-run, not copied**: `git cat-file -e HEAD:` on the `adr-029-` and
  `adr-030-` stop-hook vault paths, confirming the first exists at `HEAD` and the second does not.
  Copying this brief's stated results without running them would be the failure the example describes.
- **Example 2 says "one claim, two hops", not "two claims".** Explicit owner correction; check the
  shipped wording against it.
- **Example 2 includes the counter-example** (the §10 registry claim that *was* checked). If it is
  missing, the entry teaches the wrong lesson and fails.
- The `rm -rf` permission fact stated in the example is **run, not reasoned** — `mkdir`/`chmod`/`rm -rf`
  in a scratch dir, confirming that unlinking needs write on the holding directory, not the parent.
  Writing "he was wrong about the parent" without running it would reproduce the exact defect the
  example is about.
- The document still reads as a **convention** (prescriptive, current) and not as an incident report —
  the examples serve the rule; the rule is not a footnote to the examples. See the
  convention/report boundary in [`conventions/README.md`](../../knowledge-base/conventions/README.md).
- **Length check — now the sharpest risk, and it got sharper with the widening.** The doc will carry
  **three** worked examples (the 2026-07-13 preamble plus two new). It must stay something an agent
  actually reads on a normal run. If three examples make it long enough to skim past, it has failed at
  its only job. **If the author cannot fit all three and keep it readable, that is a real finding to
  raise with the owner — not something to solve by silently cutting one.**
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
- **✅ OWNERSHIP — SETTLED BY OWNER RULING, 2026-07-19. The producer writes both examples.** The owner
  field above stands unchanged. This is closed; it is not an open question.
  - **How it came to be asked:** the widening reached this brief via fkit-architect stating *"the task's
    owner is fkit-coder and the deliverable is theirs."* **That was an unverified claim and it was
    wrong.** The brief did not act on it — flipping an ownership field on an unverified relay is the
    exact failure example 2 documents. The owner has confirmed the claim was unverified and ruled.
  - **🔴 The cost the owner knowingly accepted — do not soften this, it is the point.** The original
    argument for producer-ownership was *"the failing party must not author its own example, it will
    soften exactly the parts that make it useful."* **Example 2's failing parties are fkit-producer and
    fkit-architect.** So under this ruling **the producer authors an example in which it is a failing
    party — precisely what that argument forbade for the coder.** The rule is being applied
    **unevenly, knowingly, by owner ruling.** It is recorded here rather than hidden because a brief
    that conceals its own inconsistency is worse than one that names it.
  - **What this means for whoever writes it:** the softening risk on example 2 is **real, accepted, and
    unmitigated by authorship**. The backstop is the **⚠️ owner sign-off below** plus the verification
    steps that name specific things example 2 must contain (the counter-example, the "one claim, two
    hops" wording, the undamaged-conclusion caveat). **Those checks are now load-bearing** — they are
    the only defence left against the self-authoring problem. Treat a missing one as a failure, not a
    trim.
  - **Rejected alternative, recorded with its reasoning:** the producer recommended **split
    authorship** — coder drafts example 1, producer drafts example 2, each writing the one it is *not*
    the subject of. It was the only option in which neither entry is self-authored. **Rejected by the
    owner** in favour of single producer authorship; the cost of two roles touching one file was not
    judged worth paying. Other options weighed and not taken: coder writes both (same problem, pointed
    at example 1); one role drafts both with **fkit-reviewer** reviewing for softening.
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
  - **Also live and adjacent: [`investigate-mutation-testing-library-adoption.md`](../done/investigate-mutation-testing-library-adoption.md)**
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
- **Evidence sources, example 2:** this brief's §"The evidence — example 2";
  `ai-agents/tasks/backlog/repair-stale-adr-029-stop-hook-links-in-the-vault.md:40-45` — the blockquote
  recording the incident independently, **a second source the author should draw from**; and the two
  `git cat-file -e HEAD:` checks named in the verification steps, **to be re-run, not copied**.
- **Enforcement note for example 2 — the weak-leg-3 argument applies here too, and differently.**
  Example 1's enforcement point is a mutation gate. **Example 2 has no plausible mechanical gate at
  all** — no script can check whether an agent verified a peer's claim before repeating it. That makes
  example 2 *more* dependent on prose than example 1, and the owner should weigh that when judging
  whether this convention amendment is worth shipping. It does not change the recommendation; it is
  recorded so nobody discovers it later.
</content>
</invoke>
