# Record the "a disproof carries the higher bar" convention

## ID
0138

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**A reviewer's "disproven" is a STOP instruction, so a wrong disproof is more damaging than a missed
finding.** A missed finding stays open — the next round, or the other reviewer, can still catch it. A
**wrongly-disproven** finding is recorded as *"do not fix this"*, which converts a correctable omission
into an **entrenched** one and actively spends the other reviewer's correct work.

**The rule that follows: a disproof requires a HIGHER evidentiary bar than a finding, not a lower one.**

**Why the bar gets applied backwards, in the reviewer's own words** — because *disproving feels like the
conservative, noise-reducing act.* It is not; it is the load-bearing one. **The asymmetry is in the
consequence, not in the confidence.**

The fkit-reviewer wrote this up against itself in
[`0124/review.md`](../../done/0124-revert-task-movers-to-producer-only/review.md) §*Accepted residuals*
(`:224-234`) and the *R3 correction notice* (`:40-86`). It is currently invisible to every future task,
because nothing reads a closed task's ledger.

**The provenance, and it is what makes the rule land.** In 0124 the reviewer disproved a Codex finding
about 4 citations of `fkit-task-done/SKILL.md:60-64`, recording them as *"still accurate"*. The
owner-verification-upgrade rule those sites cite **had moved to `:78-82`**; `:60-64` had come to hold a
*different* rule that read plausibly. The coder **escalated instead of complying**, the driver verified
the fact independently against `git show HEAD:…`, and the **owner overrode the disproof**. **8 sites
needed fixing, not 3.** The reviewer's own summary: *"The coder and Codex were right and I was wrong."*

**The second half of the rule, and the reviewer called it the load-bearing one: a coder escalating
against the reviewer is the contract working, not friction to smooth over.** `CLAUDE.md` §Review Notes
already states *"review comments are inputs to evaluate, not instructions to apply blindly"* — but it
reads as running in one direction only. 0124 is the case that proves it must run **against the
reviewer** too, which is the direction people plan for less. Without this half the convention teaches
"reviewers should be careful"; with it, it teaches what actually saved 0124.

**Not already covered — checked 2026-07-25.** No document in `conventions/` states this;
[`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)
governs *asserting*, not the asymmetry between a finding and its refusal. The wiki vault has no page on
it. **The `disproven` verdict is live in the source today** and has no stated bar attached:
`fkit-review/SKILL.md:91` (`INCORRECT (disproven)`), `fkit-stateful-review/SKILL.md:113,123`,
`fkit-process-stateful-review/SKILL.md:79,169,200` — all verified by grep while scoping.

**Tested against the convention-authoring bar** (`conventions/README.md`, all four must hold): (1) read on
a normal run — ✅, every stateful review assigns disproven verdicts; (2) prescriptive — ✅, it sets the
standard of proof for a specific recorded act; (3) enforceable somewhere — ✅ *prose only*, at the six
`disproven`-verdict sites above (see the honest limit in `## Notes`); (4) not already covered — ✅.

## What to build

1. **A new convention document** at
   `ai-agents/knowledge-base/conventions/disproof-carries-the-higher-bar.md` *(name is the author's call —
   plain, current, never dated)*, carrying:
   - **The rule**, stated as the asymmetry of **consequence**: a finding left open can still be caught; a
     finding recorded as disproven cannot. So the disproof needs the stronger evidence.
   - **Why it inverts in practice** — disproving reads as the conservative, noise-reducing act.
   - **The mechanical corollary earned on 0124:** never disprove a line-number claim without diffing the
     cited range across the change → cross-link 0137's convention, which owns that check in full.
   - **The escalation half**, stated as a rule of its own: a coder escalating **against the reviewer** is
     the review contract working. **Escalation-against-the-reviewer is not a process failure.**
   - **The 0124 worked example**, specific and unflattering, written from the ledger.
   - **A `## Where this must be enforced` section** listing the `disproven`-verdict sites the document is
     linked from, following the
     [`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md) pattern.
   - **`## Related`** → 0137's convention and `evidence-before-assertion.md`.
2. **The scaffold twin** at
   `claude/scaffold/ai-agents/knowledge-base/conventions/disproof-carries-the-higher-bar.md`.
   **✅ Settled by owner ruling, 2026-07-25: this convention is dual-homed and SHIPS TO THE SCAFFOLD** per
   [`dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md), since the review
   procedure ships to every project. **This is not an open question; do not re-derive it.**
3. **An index row in BOTH `conventions/README.md` copies** — the live one and the scaffold one.
   ⚠️ **A count or enumeration in the README prose is falsified by the addition, and it must be read as
   it stands rather than assumed.** As of 2026-07-25 the **scaffold** copy hard-codes *"Five conventions
   ship with the scaffold"*; the live copy carries a footnoted table instead. **Check both copies** — 0137
   changes the same prose, and the two tasks can land in either order.
4. **The enforcement link at the `disproven`-verdict sites** — the four skill files named in `## Context`.
   The natural anchor is wherever the verdict vocabulary is defined, not a footer.

**No source behavior change. No test** — see the honest limit in `## Notes`.

## Verification steps

1. `ai-agents/knowledge-base/conventions/disproof-carries-the-higher-bar.md` exists and the scaffold twin
   is **byte-identical**.
2. Both `conventions/README.md` copies carry an index row, and the scaffold README's hard-coded count
   matches the number of convention files actually present in
   `claude/scaffold/ai-agents/knowledge-base/conventions/` (count them; do not reason about it).
3. The document states the asymmetry as one of **consequence, not confidence.** A version that says only
   "be careful when disproving" has lost the finding.
4. **The escalation half is present** — *a coder escalating against the reviewer is the contract working.*
   **If it is missing the document teaches the wrong lesson and fails**, because it was the only thing
   that saved 0124.
5. Every 0124 fact resolves to a line in
   [`0124/review.md`](../../done/0124-revert-task-movers-to-producer-only/review.md). **Read the ledger;
   do not write from this brief's paraphrase.**
6. **⚠️ Anti-softening AND anti-flattery — both directions, and this step is load-bearing.** The entry must
   name the reviewer's error plainly (*"the coder and Codex were right and I was wrong"* is the reviewer's
   own wording, and the sanitized version teaches nothing) **and** must not inflate the coder's escalation
   into praise for the coder. The rule is about the *contract*, not about who was clever. See the
   self-authoring hazard in `## Notes`.
7. All four named skill files link to the document at their `disproven`-verdict site, and the document's
   `Where this must be enforced` section lists exactly those files.
8. It reads as a **convention** — prescriptive, current — not an incident report.
9. `npm test` green. No source behavior changed.

## Notes

- **Owner:** fkit-coder — **✅ confirmed by owner ruling, 2026-07-25.** The deliverable includes
  `claude/skills/*/SKILL.md` edits, the coder's seat per the task 0081 Part C ruling. The
  **fkit-reviewer cannot own it** (ledgers only, never the knowledge-base). The architect-writes /
  coder-ships split (the `0064` (`record-one-skill-one-output-convention`) / `0086`
  (`ship-one-skill-one-output-convention-in-scaffold`) precedent) was weighed and declined — it costs
  two more briefs.
  **⚠️ Owner confirmed does NOT dissolve the hazard in the next bullet — it is the reason that bullet
  and verification step 6 exist.**
- **⚠️ Self-authoring hazard, recorded rather than routed around.** Task 0013 established the principle
  that *the failing party must not author its own worked example — it will soften exactly the parts that
  make it useful.* Here the failing party is the **reviewer**, which cannot write here at all. But the
  coder is the party this story **vindicates**, so the risk runs the other way: an inflated escalation
  narrative. That is what verification step 6 is for, in both directions. **Recommend the owner, or an
  fkit-reviewer pass, checks the shipped wording** — the checks are the only defence left.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Coordinates with 0137** (the citation/inventory convention, same source ledger): both edit the **same
  two `conventions/README.md` index tables** and the **same hard-coded scaffold count line**, and each
  cross-links the other. Independent and shippable in either order — whichever lands second must re-read
  those spots and add the reciprocal `Related` link rather than apply a remembered diff.
- **⚠️ Needs the owner's sign-off before it ships** — a **new** convention is a rule imposed on every
  future run (`conventions/README.md` §"Who writes here").
- **✅ Dual-home — SETTLED BY OWNER RULING, 2026-07-25: it ships to the scaffold.** The concrete file
  list is therefore **four paths**, and all four are in scope:
  1. `ai-agents/knowledge-base/conventions/disproof-carries-the-higher-bar.md` *(new)*
  2. `claude/scaffold/ai-agents/knowledge-base/conventions/disproof-carries-the-higher-bar.md` *(new,
     byte-identical)*
  3. `ai-agents/knowledge-base/conventions/README.md` *(index row)*
  4. `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` *(index row **plus** the
     hard-coded count line — read it as it stands)*

  Plus the four `claude/skills/*/SKILL.md` enforcement sites named in `## Context`. **The fkit-repo-only
  alternative was weighed and rejected: the review procedure ships to every project. Do not re-open it.**
- **Nothing in `ai-agents/wiki-vault/` covers this** (checked 2026-07-25). Vault ingest is fkit-wiki's
  exclusively and is **not in scope for this task**. **✅ Settled by owner ruling, 2026-07-25: no separate
  fkit-wiki brief — the standing `/fkit-wiki-sync` picks the page up on its next delta run.** Task
  **0126 is ADR-033-scoped and does not cover it**, so do not expect it to.
- **The honest limit, and it is sharper here than for 0137.** **No mechanical gate is possible** — no
  script can judge whether a disproof was adequately evidenced. Bar leg 3 is satisfied by prose links
  only. This convention makes the rule visible and citable; it does not make it enforced. Say so in the
  document rather than implying a guarantee.
- **Risk: low.** Documentation plus skill prose; no runtime surface.
- **Filed 2026-07-25** from task 0124's review closeout, at the owner's live approval, via the
  `fkit-sprint-ship-loop` driver.
- No commit — the new files and the board row are left in the working tree.
