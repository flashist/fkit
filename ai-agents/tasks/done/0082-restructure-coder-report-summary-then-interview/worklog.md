# Worklog — Restructure the coder's report: bullet summary first, interview last

**Task:** [`restructure-coder-report-summary-then-interview.md`](./brief.md)
· **Sprint 2, priority 61** · **Plan:** [`plans/restructure-coder-report-summary-then-interview.md`](./plan.md)
· **Ledger:** [`reviews/restructure-coder-report-summary-then-interview.md`](./review.md)

**Status: 🔄 In progress — READY FOR DONE**, with one honest caveat below. Awaiting the owner's
`/fkit-task-done`; this loop never sets `✅ Done`.

---

## The headline: I wrote myself a licence, and asking to be checked is what caught it

This task edits **my own agent contract** — I was author and subject. I flagged that to the reviewer up
front and asked it to hunt specifically for *"whether I have written myself a licence rather than a
constraint."*

**It found one, and both reviewers found it independently (R2).** I had written:

> *"The plan is the one place the concision preference does not apply."*

`CLAUDE.md`'s output-style block lists **six-plus** exceptions — review reports and ledgers, status
briefings, required tables, **verbatim relays**, **degradation flags**, plans — and explicitly calls that
list *"illustrative, not exhaustive."* My sentence narrowed it to one. It would have licensed me
compressing a verbatim relay or a partial-coverage flag: **the two things my own contract, four sections
earlier, forbids me to soften.**

Nobody instructed the narrowing and I had no motive I was aware of. That is exactly why the flag
mattered: the failure was invisible from the inside.

## ⚠️ The caveat on "ready for done": this task is not behaviorally verified

**Nothing here is proved by tests.** It is instruction text for an LLM. `npm test` is green (362/362)
but the suite asserts no agent prose — it is a regression guard, not evidence about this change. The
brief's own verification steps call for **owner-run session and spawned-consult spot-checks**, and
**both are still outstanding.** Neither reviewer could substitute for them and neither claimed to.

## Owner-decision log

### Questions put to the owner

| # | Question | Owner's answer |
|---|---|---|
| 1 | Approve the plan (batch approval covering all six planned tasks) | **Approved**, 2026-07-18 |
| 2 | **R1** — my text mandates `AskUserQuestion`; ADR-019 D3 says "no `AskUserQuestion` dependency". Amend my carve-out, amend the ADR, or accept as residual? | **Amend ADR-019 D3** |
| 3 | **R5** — "lead with the worst news" is self-judged. Accept as frontier-move/residual, or enumerate a must-lead list? | **Accept as residual** |
| 4 | **R6** — stale quotes live in the brief and the sprint plan, outside the one-file surface. Fix here or follow up? | **Fix in this task** |

All three review questions were relayed **verbatim** from the reviewer, per my own contract's rule that
I do not answer the reviewer's questions on the owner's behalf.

### Obvious winners chosen without asking

| Choice | Why it was a winner |
|---|---|
| Fixing R2 by mirroring `CLAUDE.md`'s non-exhaustive list **and** adding an explicit "do not read this as narrowing it" | The bare correction would have left the same trap one paraphrase away. |
| R4: correcting "attempting the tool fails" → `TOOL_ABSENT`, and making the correction **load-bearing** | ADR-021 measured absence, 3/3. The accurate fact is the *reason* the fallback is mandatory: nothing fails loudly to remind you. A pedantic fix became the argument. |
| R6: **annotating** the stale quotes rather than rewriting them | Both are historical records. Editing a quote to match post-change reality rewrites what the author actually saw. A dated note removes the trap and keeps the record honest. |
| Escalating R1 to the architect instead of editing the ADR myself | See below — this was a role boundary, not a preference. |

## The role boundary I did not cross

The owner's R1 ruling was **to amend an ADR**. `/fkit-record-decision` is the **architect's** skill, and
a new or amended architecture decision is not the coder's to write. I relayed the ruling to
`@fkit-architect` (hop 1) rather than making the edit — **and explicitly asked them to refuse it** if
they judged the honest fix was to amend my agent file instead. I am the author of the change that
created the conflict, and "amend the ADR, not my edit" is conveniently the direction that suits me.

**They checked it and it held — and found corroboration I had missed.** ADR-019 is dated 2026-07-17,
written while task 39's investigation was open and **no fkit agent held the tool**; ADR-022 granted it
on 2026-07-18. The struck clause said "no *dependency*" because the capability did not exist — it was
recording self-sufficiency, not prohibiting a tool. **And ADR-024 (2026-07-18) already treats
`AskUserQuestion` as the mid-loop asking mechanism**, so the record was internally inconsistent *before*
this task, not because of it.

**Consequence: R1 needed no further edit to `fkit-coder.md`.** With one mechanism in a session, the
"missing discriminator" the reviewer identified dissolves, and my precedence note stays correct as
written. The ship-loop's "ends its turn and idles" is explicitly **unrepealed**.

## What changed

| File | Change |
|---|---|
| `claude/agents/fkit-coder.md` | `## Output format` rewritten: summary-first (lead with the worst news), detail, interview-last with the session/consult split; verbatim-relay carve-out (R3); non-exhaustive concision exceptions (R2); accurate `TOOL_ABSENT` wording + explicit "do not attempt" (R4); pointer added at the `:34` seam |
| `ai-agents/tasks/backlog/…61.md` · `ai-agents/sprints/sprint-2.md` | dated notes marking their pre-change quotes as as-of-scoping (R6) |
| `ai-agents/knowledge-base/decisions/adr-019-…md` | **amended by fkit-architect**, not by me |

**Not dual-homed** — verified: `fkit-coder.md` exists only under `claude/agents/`, no scaffold copy.
Worth checking, since tasks 65 and 67 both turned up dual-home drift.

## Review — round 1, all 6 findings resolved

**✅ Codex coverage FULL — `codex-cli 0.144.4`.** Three findings raised independently by both reviewers.
Ledger write succeeded this round (it was harness-blocked on task 68).

R2 and R3 are the substantive ones; R1 resolved via the architect; R4 factual; R5 accepted as a
residual; R6 annotated.

## Lessons learned

- **Ask to be checked on the thing you cannot see.** The single most valuable line in my review request
  was admitting I was author and subject and naming the failure mode I feared. It landed on R2 exactly.
- **A "precedence rule" is not a discriminator.** I wrote "the more specific contract governs" and
  thought I had resolved a conflict; I had only named a tie-breaker without saying which mechanism wins.
  The reviewer's phrase — *"it asserts, it doesn't resolve"* — is worth keeping.
- **When the owner's ruling lands in another role's territory, relay it; don't execute it.** And when
  the ruling happens to favour you, say so out loud to whoever you hand it to.

## Open questions / residuals

- **Accepted residual** (in the ledger): "lead with the worst news" is position-fixed and
  example-anchored but its general clause is self-judged.
- **⚠️ Relayed from the architect, no action needed today:** if the owner ever sets an
  `askUserQuestionTimeout` in their **user-scope** settings, it applies session-globally and would reach
  ship-loop gate prompts. Both gates survive it on their own enforcement (plan mode; the owner-invoked
  mover), and the shipped default is `"never"` — recorded so it is not discovered the hard way.
- **Recommended follow-up, named not filed:** ADR-019 is in the wiki's ingest surface and the struck
  clause is quotable, so it may already be mirrored in the vault. Worth a `/fkit-wiki-sync` (fkit-wiki's
  job, not mine).
- **Outstanding and owner-only:** the two behavioral spot-checks above.

## Commit state

**Nothing committed.** All edits left in the working tree.
