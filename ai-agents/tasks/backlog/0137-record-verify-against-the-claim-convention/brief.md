# Record the "verify against the claim" convention — citation drift and incomplete inventories

## ID
0137

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Two general review-practice lessons are currently readable only by someone who opens a closed task's
review ledger.** They were earned during task 0124's review and written up by the fkit-reviewer, in its
own words, in
[`0124/review.md`](../../done/0124-revert-task-movers-to-producer-only/review.md) §*Accepted residuals*
(the entries at `:213-223` and the *R3 correction notice* at `:40-86`). A residual in a closed ledger
governs nothing: no future task reads it. This brief lifts the general half into
`ai-agents/knowledge-base/conventions/`, where it is law.

**Lesson 1 — thematic adjacency at a shifted line range is the expected SIGNATURE of citation drift,
not evidence against it.** Documents are topically clustered, so when a diff shifts a file, a stale
`file.md:60-64` citation usually still lands on *related* prose. That reads as "still accurate" and
produces a **false negative** rather than a visible miss. The question that matters is *"does this range
still support the claim it is cited for?"* — never *"is there sensible content here?"* One command
settles it: `git show HEAD:<file>` against the working tree.

**Lesson 2 — no single pattern is an inventory.** 0124 hit **five incomplete inventories** in one round
of one review, across **three distinct blind-spot classes**, each of which defeated a different
assumption (ledger `:161-170`, `:203-212`):

| Class | The 0124 instance | Why the check missed it |
|---|---|---|
| **Path** | R1 — `PROJECT.md` still asserted the ADR-025 grant | the regex *would* have matched; the search path never showed it the file (`ai-agents/knowledge-base/` was excluded) |
| **Phrasing** | R2 — the status table's "Set by" column read `Any agent, via /fkit-task-done` | the regex required a modal + action verb; `Any agent, via …` is a **verbless noun phrase** |
| **Shorthand** | R3's 8th site — a bare `` `:265-267` `` at `fkit-task-ship-loop/SKILL.md:189` | the inventory grep was anchored on `fkit-task-done/SKILL.md:`; the citation's filename was elided by the previous clause |

The brief's own standing finding — *"a grep for one phrasing is not an inventory"* — is now three times
proven, and the verification step in question was amended **twice**, each amendment closing only the
**last** blind spot.

**Why these are ONE convention and not two.** The 8th site is a *citation audit defeated by an inventory
blind spot*. Split the two lessons across two documents and that single fact gets torn in half. Both are
also the same underlying failure: **the check that was run did not answer the question that needed
answering.**

**Why a new document rather than amending
[`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)** —
the README's bar says prefer amending, so this needs an argument:
- That convention governs **asserting**: a claim you make needs a check you made this turn. This one
  governs **checking someone else's claim** — a citation, a grep result, a sweep. Adjacent, not the same.
- Task **0013** (Backlog, `fkit-producer`) already widens `evidence-before-assertion.md` with **two** more
  worked examples and names length as *"now the sharpest risk … if three examples make it long enough to
  skim past, it has failed at its only job."* Adding a fourth and fifth would break the document 0013 is
  trying to keep readable.
- **Therefore: a sibling document, cross-linked both ways.** Not a merge.

**Conflict flagged, soft:** 0013 and this task both touch `evidence-before-assertion.md` — 0013 rewrites
its body, this one adds a `Related` link. Whichever lands second must not revert the other. Not a hard
dependency; neither blocks the other.

**Tested against the convention-authoring bar** (`conventions/README.md`, all four must hold): (1) read on
a normal run — ✅, every review and every verification step is a normal run; (2) prescriptive — ✅, it
states a check to run and a claim not to make; (3) enforceable somewhere — ✅, the five review skills all
emit `file:line` citations (confirmed by grep, 2026-07-25) and are the natural link sites; (4) not already
covered — ✅, checked: nothing in `conventions/` states either rule, and the wiki vault has no page on it.

## What to build

1. **A new convention document** at
   `ai-agents/knowledge-base/conventions/verify-against-the-claim.md` *(the name is the author's call —
   plain, current, never dated, per the README's Naming rule)*, carrying:
   - **The citation rule.** To check `` `<file>:N-M` ``, diff the cited range **across the change**
     (`git show HEAD:<file>` vs the working tree) and confirm the range still contains **the rule it is
     named for**. Finding sensible, on-topic prose at the range is **not** evidence. State plainly that
     **thematic adjacency at a shifted range is the expected signature of drift**, which is what makes it
     a false negative.
   - **The inventory rule.** No single pattern enumerates every way a fact can be phrased or referenced.
     A green grep is **weak evidence and must be reported as such**; the real evidence is a by-hand sweep
     plus an independent reviewer pass. Carry the three named blind-spot classes — **path**, **phrasing**,
     **shorthand** — as the checklist, since each is a *different* assumption to break.
   - **The specific corollary the 8th site earned:** a citation audit must sweep for the **bare `:N-M`
     token** as well as the filename-qualified form.
   - **The 0124 worked example, unflattering and specific** — the reviewer recorded 4 citations of
     `fkit-task-done/SKILL.md:60-64` as *"still accurate — do not fix"*; the owner-verification-upgrade
     rule they cite had moved to `:78-82`, and `:60-64` had come to hold a **different** rule (the marker
     table plus *"if you are unsure, you are an agent"*) that read plausibly. The coder escalated instead
     of complying, the driver re-verified against `git show HEAD:…`, and the owner overrode the disproof.
     **8 sites needed fixing, not 3.**
   - **A `## Where this must be enforced` section**, following the
     [`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md) pattern
     the README names.
   - **`## Related`** → `evidence-before-assertion.md` (the asserting side of the same coin) and 0138's
     disproof convention.
2. **The scaffold twin** at
   `claude/scaffold/ai-agents/knowledge-base/conventions/verify-against-the-claim.md`. **✅ Settled by
   owner ruling, 2026-07-25: this convention is dual-homed and SHIPS TO THE SCAFFOLD** per
   [`dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md) — not fkit-repo-only.
   Reason accepted: review practice applies to every consuming project. **This is not an open question;
   do not re-derive it.**
3. **An index row in BOTH `conventions/README.md` copies** — the live one and the scaffold one.
   ⚠️ **A count or enumeration in the README prose is falsified by the addition, and it must be read as
   it stands rather than assumed.** As of 2026-07-25 the **scaffold** copy hard-codes *"**Five**
   conventions ship with the scaffold"*; the live copy carries a footnoted table instead. **Check both
   copies for such a claim** and correct whatever is actually there — 0138 changes the same prose, and
   the two tasks can land in either order.
4. **At least one real enforcement link from `claude/` source.** All five review skills emit `file:line`
   citations (verified 2026-07-25): `fkit-review`, `fkit-stateful-review`, `fkit-adversarial-review`,
   `fkit-process-review`, `fkit-process-stateful-review`. **Name which ones you linked and why** rather
   than blanket-editing all five — a link in a skill nobody's procedure reaches is not enforcement.
   `fkit-task-brief`'s verification-step guidance is a further candidate (a step resting on one grep must
   say it is weak evidence).

**No source behavior change. No test is added** — there is no mechanical gate for this, and the brief does
not pretend otherwise (see `## Notes`).

## Verification steps

1. `ai-agents/knowledge-base/conventions/verify-against-the-claim.md` exists, and the scaffold twin is
   **byte-identical** to it.
2. Both `conventions/README.md` copies carry an index row for it, and the scaffold README's hard-coded
   convention count matches the number of convention files actually in
   `claude/scaffold/ai-agents/knowledge-base/conventions/` (count them; do not reason about it).
3. The citation rule names the mechanical check **`git show HEAD:<file>` vs the working tree**, and states
   that thematic adjacency is the *expected signature* of drift rather than evidence against it. A version
   that says only "verify citations" has lost the whole finding.
4. All **three** blind-spot classes are named — path, phrasing, shorthand — each with its 0124 instance.
   Two out of three is a fail: the point is that each defeated a *different* assumption.
5. The bare-`:N-M`-token sweep corollary is present.
6. **Every 0124 fact in the document resolves to a line in
   [`0124/review.md`](../../done/0124-revert-task-movers-to-producer-only/review.md).** Read the ledger
   directly; **do not write the example from this brief's paraphrase.** Writing a convention about
   unverified checks from an unverified secondhand account would reproduce the exact defect it describes.
7. The document has a `Where this must be enforced` section, and every skill it names actually carries the
   link.
8. It reads as a **convention** — prescriptive, current — and not as an incident report; the example serves
   the rule, the rule is not a footnote to the example. See the boundary in
   [`conventions/README.md`](../../../knowledge-base/conventions/README.md).
9. **Length check.** It has to survive being read on a normal run. If the two rules plus the example cannot
   be kept readable in one document, that is a real finding to raise with the owner — **not something to
   solve by silently cutting the inventory half.**
10. `npm test` green. No source behavior changed.

## Notes

- **Owner:** fkit-coder — **✅ confirmed by owner ruling, 2026-07-25.** The deliverable includes edits to
  `claude/skills/*/SKILL.md` sources, which are the coder's seat per the task 0081 Part C ruling. The
  **fkit-reviewer cannot own it** (it writes only review ledgers, never the knowledge-base) even though
  the lesson is its own. The rejected alternative — architect writes the convention, coder ships the
  scaffold half (the `0064` (`record-one-skill-one-output-convention`) / `0086`
  (`ship-one-skill-one-output-convention-in-scaffold`) precedent) — was declined because it costs two
  more briefs. **No split.**
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Coordinates with 0138** (the disproof-bar convention, same source ledger): both edit the **same two
  `conventions/README.md` index tables** and the **same hard-coded scaffold count line**. Independent and
  shippable in either order — but whichever lands second must re-read those three spots rather than apply
  a remembered diff.
- **Coordinates with 0013** — both touch `evidence-before-assertion.md`. See the conflict flag in
  `## Context`.
- **⚠️ Needs the owner's sign-off before it ships** — per `conventions/README.md` §"Who writes here", a
  **new** convention is a rule imposed on every future run, so the bar is higher than for an amendment.
- **✅ Dual-home — SETTLED BY OWNER RULING, 2026-07-25: it ships to the scaffold.** The concrete file
  list is therefore **four paths**, and all four are in scope:
  1. `ai-agents/knowledge-base/conventions/verify-against-the-claim.md` *(new)*
  2. `claude/scaffold/ai-agents/knowledge-base/conventions/verify-against-the-claim.md` *(new,
     byte-identical)*
  3. `ai-agents/knowledge-base/conventions/README.md` *(index row)*
  4. `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` *(index row **plus** the
     hard-coded count line — read it as it stands)*

  Plus whichever `claude/skills/*/SKILL.md` enforcement links item 4 of `## What to build` settles on.
  **The fkit-repo-only alternative (the `dual-home-parity.md` footnote form) was weighed and rejected:
  review practice applies to every consuming project. Do not re-open it.**
- **Known pre-existing drift, reported not repaired:** `dependency-declaration-form.md` sits in the live
  `conventions/` folder but is **absent from the live README's "What's here" table**, and absent from the
  scaffold entirely. Task **0132** owns the scaffold half. **Do not fix either here** — this brief's
  footprint is its own two files plus the index rows.
- **Nothing in `ai-agents/wiki-vault/` covers either lesson** (checked 2026-07-25). Vault ingest is
  fkit-wiki's exclusively and is **not in scope for this task**. **✅ Settled by owner ruling,
  2026-07-25: no separate fkit-wiki brief — the standing `/fkit-wiki-sync` picks these pages up on its
  next delta run.** Task **0126 is ADR-033-scoped and does not cover them**, so do not expect it to.
- **The honest limit.** There is **no mechanical gate** for either rule — no script can check whether a
  reviewer asked the right question of a citation, and "is this sweep complete?" is undecidable by another
  sweep. Bar leg 3 is satisfied by *links from the skills that run the procedure*, which is prose
  enforcement. The rule was already stated inside 0124's own ledger and still failed once; this makes it
  visible to future tasks, which is a strictly smaller claim than making it stop happening.
- **Risk: low.** Documentation plus skill prose; no runtime surface. The real risk is writing a story
  instead of a rule — verification step 8 exists to catch that.
- **Filed 2026-07-25** from task 0124's review closeout, at the owner's live approval, via the
  `fkit-sprint-ship-loop` driver.
- No commit — the new files and the board row are left in the working tree.
