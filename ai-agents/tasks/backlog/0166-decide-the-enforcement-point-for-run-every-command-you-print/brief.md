# Decide the enforcement point for *"run every command you print"* — the rule already exists and did not bind

## ID
0166

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Investigation and ruling, not implementation.** The fix shape is unknown — it may be a restatement in
a named file, a widened obligation, a mechanical check, or a finding that **prose cannot fix this and
the real control is that these tasks were reviewed at all**. Do not write an implementation brief for
it until this is answered.

### The pattern — six same-class defects across two tasks' records

A reviewer named this at `0141`: **three same-class defects in `0141`'s record and three in `0126`'s.
All six sit in `ai-agents/wiki-vault/log.md`.** The vault's **content** passed every review with
**zero** findings. The **record of it** kept carrying claims that were never re-run:

| Class | Instance | On-disk evidence |
|---|---|---|
| **An unrun command** | `0126` and `0141` both printed `grep -rn "not a doer" ai-agents/knowledge-base/` as returning **nothing**. It returns **9 hits**. | Claim: `log.md:547` (and quoted at `:644`). Correction: `log.md:646` — *"That command returns 9 hits, not nothing. Re-run 2026-07-29 …"*. Re-verified while scoping this brief, 2026-07-29: the command returns **9**. |
| **Shifted citations** | `adr-022:44` → `:45`, **stale by the act of writing the entry that cited it**; and `0126`'s `:314` test citation. | `log.md:648` — *"A citation that went stale by the act of writing it."* |
| **Claims wider than their measurement** | *"vault-wide"* when 166 content pages + `index.md` were checked but `log.md` — itself a vault file — was not; and `0126`'s *"staged"* wording. | `log.md:650` — *"the word 'vault-wide' is the part that overreaches."* |

**The mechanism, stated once:** a result measured on **one file** was generalized into a claim about a
**whole directory**, and **the broadened form was never re-run**.

### The same class reached the owner

**The driver relayed the unrun-command finding to the owner as this task's headline result — without
running it.** Recorded on disk in `ai-agents/wiki-vault/log.md`,
§"Correction appended 2026-07-29 (round 2, stateful review) — three worklog-accuracy defects in this entry":

> *"⚠️ **It also propagated past the vault** — the driver relayed the wrapped-grep finding to the owner
> as this task's most valuable product **without running the command**, the same unverified-amplification
> class as its other relay defects this run."*

**Blast radius, in the log's own words (`:657`): *"a reader who runs the printed command gets 9 hits and
has direct evidence to discount a genuinely valuable method finding."*** The underlying method finding —
that a line-oriented `grep` cannot see a phrase wrapped across a newline — **is real and was
independently re-proved by the reviewer** (`log.md:655`). The false demonstration attached to it is what
does the damage.

### ⚠️ The load-bearing finding: this is not a missing rule

**`ai-agents/knowledge-base/conventions/evidence-before-assertion.md` already says it.** Read firsthand
2026-07-29, from its `## The rule` section:

> *"**A claim about repository state requires a check, in the same turn.** Not from memory, not from an
> earlier turn, not from a skill's boilerplate. If it is worth saying, it is worth checking."*

and

> *"**Applies to every role, not just the producer.**"*

**So the honest question is not "should there be a rule" — it is "why did an existing, on-point,
already-linked rule fail to bind, and can anything check it."** An artifact that answers this by adding
more prose to a page that already contains the correct prose has not answered it. The lesson the wiki
recorded is one line — ***run every command you print*** — and it is a **narrower, more mechanical**
restatement of the existing rule, which may be exactly why it is worth stating separately, or may be
exactly why restating it changes nothing. **That is the question.**

### The precedent this must not repeat

Task **`0013`** (Backlog board, `Unscheduled`, owner `fkit-producer`) already exists to add **two**
worked examples to that same page — and its own Notes record the counter-argument in advance:

> *"🔴 The real counter-argument, recorded not buried: the rule was already stated and still broken, so
> the lesson may be that it needs an *enforcement point*, not more prose."*

and a length risk that this task would make worse:

> *"The doc will carry **three** worked examples … It must stay something an agent actually reads on a
> normal run. If three examples make it long enough to skim past, it has failed at its only job."*

**A fourth example is very likely the wrong deliverable.** `0013` owns that page's worked examples;
this task owns the enforcement question `0013` explicitly declined to settle.

### What is and is not checkable — checked firsthand, 2026-07-29

- **Nothing machine-checks any of this today.** No test reads a worklog, a review ledger, or `log.md`.
- **Every one of the six instances was caught by an independent reviewer, never by the author** — and
  only because these tasks were reviewed at all. On a task that skips review, the class ships silently.
- **A genuine mechanical option exists here that did not exist for `0013`'s example 2.** These claims
  are **printed shell commands with stated results** — a machine could, in principle, extract a fenced
  command from a worklog and re-run it. Whether that is safe, proportionate, or even well-defined
  (commands with side effects, commands whose output legitimately changed since) is **the architect's
  call**. It is at least *not obviously impossible*, which is what makes this worth deciding rather
  than filing under "prose only".

## What to build

**A ruling, recorded.** An ADR under `ai-agents/knowledge-base/decisions/` if it changes an obligation;
a convention page under `ai-agents/knowledge-base/conventions/` if it records what was already implied;
a report under `ai-agents/knowledge-base/reports/` if the finding is that nothing should change. **The
architect decides which — that choice is part of the finding.**

It must answer, explicitly:

1. **Why the existing rule did not bind.** `evidence-before-assertion.md` already states it, in words
   that fit these six instances. Diagnose the failure — not reached, not read, too general, wrong
   surface — because every other answer depends on this one.
2. **Whether *"run every command you print"* becomes a stated obligation, and where.** Rule each
   candidate in or out **by name**: the three wiki SKILLs; `claude/agents/fkit-coder.md`;
   `evidence-before-assertion.md` itself; `claude/universal-rules.md`; a new convention page; nowhere.
3. **Whose obligation it is.** The six instances were authored by `fkit-wiki`; the seventh — the relay
   to the owner — was the **driver**. Say whether the obligation lands on the author, on the relayer,
   or on both, and name the relay case explicitly. **The relay is the instance that reached the owner
   and it must not be dropped.**
4. **Whether anything could check it, and whether it should.** Address the extract-and-re-run option
   above on the merits: feasibility, side-effect safety, false-positive rate on commands whose output
   legitimately moved, and cost. **"No check, prose only" is a legitimate answer** — but it must be
   argued against this option, not asserted.
5. **What the reviewer's role is in the control.** All six were caught by an independent reviewer and
   none by the author. Say whether the honest control here is *review coverage* rather than any new
   rule — and if so, what that implies for tasks that ship without review.

**No implementation.** If the ruling implies work, name it as a follow-up for the producer to file. Do
not edit `evidence-before-assertion.md`, any SKILL, or any agent definition under this task.

## Verification steps

1. **The artifact exists** in `knowledge-base/decisions/`, `conventions/`, or `reports/`, and the report
   says which and why.
2. **All five questions above are answered explicitly** — each with a stated answer, not an
   implication.
3. **Question 1 is answered before question 2.** A ruling that proposes a new home for the rule without
   diagnosing why the existing one failed has skipped the only step that makes the proposal evidence-based.
4. **The candidates in question 2 are each ruled in or out by name.**
5. **The relay instance (`log.md:657`) is adjudicated by name.** A ruling that covers only the author
   and not the relayer misses the instance that reached the owner.
6. **`0013` is engaged, not collided with.** State whether this ruling implies a change to `0013`'s
   scope, and state explicitly whether a fourth worked example on that page is recommended — including
   *"no"*. `0013`'s own length risk must be addressed if the answer is *"yes"*.
7. **The unrun-command claim is re-run, not copied.** Run `grep -rn "not a doer" ai-agents/knowledge-base/`
   and report the count observed at implementation time. **Writing "9 hits" from this brief without
   running it would reproduce, inside the ruling, the exact defect the ruling is about.** The count may
   legitimately have moved.
8. **⚠️ The dual-home constraint is respected if `evidence-before-assertion.md` is touched.** The page
   is dual-homed with `claude/scaffold/ai-agents/knowledge-base/conventions/evidence-before-assertion.md`
   and **the two copies already differ as of 2026-07-29** (`diff -q` reports them different) — that
   drift is `0132`'s (P119) to reconcile, not this task's. `0133`'s parity test is **not landed**, so
   any edit must be checked by hand. **This task should not need to touch the page at all** — it rules,
   it does not implement.
9. **ADR-014 and the numbering rule are respected** if an ADR is written — `node --test
   test/adr-number-uniqueness.test.js` stays green, and the number is allocated per
   `/fkit-record-decision`.
10. **No skill, agent definition, convention page, or source file was edited.** `git diff --stat` shows
    only the new knowledge-base file (plus this brief's own status if closed).

## Notes

- **Owner:** fkit-architect — an obligation/control-model investigation with an unknown fix shape,
  matching the `0158` / `0160` / `0162` precedent (report-only, decides but does not edit). **Not
  `fkit-producer`**, even though `0013` is producer-owned: `0013` writes worked examples for an existing
  convention, this decides whether an obligation exists and where it binds.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Coordinates with `0013`** (Backlog board, `Unscheduled`) — same page, deliberately different
  deliverable. `0013` adds worked examples; this decides the enforcement point `0013` recorded as its
  own unresolved counter-argument. **Do not merge.** If this rules that a fourth example is wanted,
  `0013` is where it goes.
- **Coordinates with `0160`** (durable citation form). The **shifted-citation** class above is
  `0160`'s territory — `log.md:648` names this instance as a live specimen for `0160`. **Scope
  boundary: this task rules on the *unrun-claim* class; `0160` rules on the *mutable-coordinate*
  class.** Cite the specimen, do not re-decide it.
- **Coordinates with `0165`** — same run, adjacent class. `0165` is about the **form** of a
  prescribed output; this is about the **truth** of a claim in a record. Both are *"unenforced prose
  about what an agent does at runtime, caught only by an independent reviewer."* Adjacency, not
  dependency.
- **The vault content was clean.** Say so in the ruling if it helps calibrate severity: `0126` and
  `0141` produced vault content that passed review with **zero** findings. This is a defect class in
  **records**, not in work. That is an argument for proportionality, not for ignoring it — the record
  is what the owner reads.
- **A one-paragraph ruling is a legitimate outcome**, including *"the existing convention already
  covers this and the control is review coverage"*. The point is that the question gets a recorded
  answer.
- ⚠️ **`log.md` line citations in this brief will decay** — `ai-agents/wiki-vault/log.md` is appended to
  on every wiki run. Re-locate by the quoted text, not the number, at implementation time. A live
  specimen for `0160`, noted rather than worked around.
- No commit — leave the new brief in the working tree.
