# Investigate how agents report status to the owner in prose, and put a hierarchical shape to him

## ID
0410

## Sprint
Sprint 11

## Priority
P5

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

### ⛔ THIS IS AN INVESTIGATION AND A PROPOSAL. IT IS NOT A CHANGE TO THE OWNER'S OUTPUT STYLE.

⭐ **The reason is ownership, and it is the whole scoping decision.** The output-style block in
`CLAUDE.md` is written **outside** the fkit-managed markers and is **the owner's own text**. The
project's own rule says so: fkit's output preferences *"lose every conflict"* against *"the owner's own
style instructions (written outside these markers)."*

⛔ **So this task may not edit how agents speak to him on its own authority.** It measures, it proposes,
and he rules. ⚠️ **A run that arrives having rewritten the output-style block has taken a decision that
was not its to take.**

### ⭐ AUTHORITY — an owner ruling of 2026-09-18, ⚠️ and the part of it that covers THIS task is INFERRED, not ruled

⛔ **State the provenance honestly, because half of it is weaker than the other half.**

**What he actually ruled** — selected option text, an option an agent wrote and he chose, given live via
`AskUserQuestion` in an `fkit lead` session on 2026-09-18 and relayed into a spawned `fkit-producer`
with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):

> *"…Make /fkit-status report hierarchically — counts and exceptions first, detail on request — and see
> if it still reads badly. If that fixes it, the terminal UI was solving a problem with a cheaper
> answer."*

⛔ **That names `/fkit-status`. It does not name agent prose.** `/fkit-status` is
[`0409`](../../done/0409-make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request/brief.md).

**What this task rests on instead** — ⭐ **the owner's OWN typed prose**, which is the stronger record of
the two and is quoted here as his words:

> *"When I ask agents in terminal about providing me the status of the sprint/tasks — it's also kind of
> hard to read when there are a lot of tasks and texts."*

⭐ **"When I ask agents" is broader than one skill.** ⚠️ **But the inference that he therefore wants
agent prose changed is THIS PRODUCER'S, not his** — he complained; he did not order a fix to this
surface. ⛔ **That is exactly why this task is scoped as a proposal and not as a change.**

⭐ **The canonical record of his prose lives on
[`0404`](../../done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
under its heading *"FIRST REAL USER EVIDENCE"*.** ⛔ **The copy above is a duplicate. If the two
disagree, `0404`'s is canonical.**

### ⚠️ The same trap as `0409`: the rule may already exist and simply not be obeyed

⛔ **Measure before designing.** `CLAUDE.md`'s output-style block **already** says, in the owner's repo:

> *"Be extremely concise to the owner. Sacrifice grammar for concision."*

and, immediately after it, the countervailing rule that any proposal here must not break:

> *"Concision is not omission — of content OR of structure. Never drop a failing test, an unverified
> claim, a caveat, a partial-coverage flag, or a thing you did not do, to be brief."*

⭐ **So there are three possible findings, and they mirror `0409`'s:**

| Finding | What the task then is |
|---|---|
| **(1) Agents do not obey the rules that exist** | A **conformance** problem. The answer is enforcement or a worked example, not a new rule. |
| **(2) The rules are obeyed and are still unreadable at this scale** | A **proposal** to the owner for a hierarchical shape. This is the only branch that reaches his output-style block. |
| **(3) The prose is fine; the pain is in what it quotes** | Report it and change nothing. The pain would be in 57KB briefs and prose-stuffed board cells — `0383`'s territory. |

⛔ **A run that assumes (2) has skipped the measurement.**

### ⛔⛔ THE HARD CONSTRAINT ANY PROPOSAL MUST SURVIVE — and it is the reason this task is risky

⭐ **Hierarchy is a compression, and compression is how a caveat gets lost.**

The project's hard rules already anticipate this, and a proposal that violates them is refused on sight
rather than weighed:

- *"Where a shape is prescribed, produce it in full, and in its prescribed wording"* — review reports,
  ledgers, status briefings, required tables, verbatim relays, verdict lines, degradation flags.
  ⛔ **"Detail on request" must never mean a prescribed shape arrives summarised.**
- *"'Loud' is placement, not word count."* ⛔ **A hierarchy that demotes a failure into a drill-down has
  moved it, and moving it is the thing that rule forbids.**
- The six canonical status values render **verbatim, marker and all**, including
  `(agent-closed — not owner-verified)`
  ([`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md)).

⚠️ **Name the failure mode plainly in the proposal:** *a report that reads well because it stopped
saying the uncomfortable part is worse than the wall of text it replaced.* ⛔ **If the proposal cannot
show how it avoids that, it is not ready to put to him.**

### ⚠️ Relationship to `0405` — contributory, not decisive

[`0405`](../0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md)
compares a terminal UI against the web board. ⚠️ **Verbose agent prose is part of that comparison's
confound**, because the owner's complaint was made *from inside* the terminal medium.

⛔ **But `0409`, not this task, is the named confound-remover** — `/fkit-status` is the measurable,
scripted surface, and agent prose is not. ⭐ **This task contributes to a cleaner baseline; it does not
gate `0405`.**

### ⛔ NOT FROZEN

[Sprint 11](../../../sprints/sprint-11.md)'s owner-ruled **migration freeze**, re-founded 2026-09-18 on
the gated-B ruling, covers changes to the **stored shape** — *"re-keying ids, moving folders, rewriting
boards."* ⛔ **This task touches none of them.** ⚠️ **If it ever proposes to, it stops and escalates.**

## What to build

⛔ **A measurement, then one proposal put to the owner. No behaviour change without his ruling.**

1. **Collect real samples, not remembered ones.** Gather actual agent status replies to the owner from
   this project's records — task worklogs, review ledgers, sprint-plan addenda and any preserved
   session relays. ⛔ **Do not write specimen replies and score those** — a self-authored sample
   measures the author, not the team.
   ⚠️ **If the corpus of real samples is too thin to conclude from, say so and stop there.** A finding
   of *"not enough evidence"* is a real outcome and is better than a proposal built on three examples.
2. **Score them against the rules that already exist** — `CLAUDE.md`'s output-style block and
   [`status-report-format.md`](../../../knowledge-base/conventions/status-report-format.md) — rule by
   rule, obeyed or not, with the evidence. ⛔ **Every rule, including the ones they pass.**
3. **Name the finding — (1), (2) or (3) — in one sentence, before proposing anything.**
4. **Under (2) only: design ONE proposal**, not a menu. It must state, explicitly:
   - What arrives **first, always** — counts, exceptions, bad news, blockers, and every prescribed
     shape that the hard rules say is produced in full.
   - What is legitimately deferred to *"detail on request"* — and ⛔ **how the reader knows it exists**,
     because deferred content the reader cannot see is deleted content with extra steps.
   - ⛔ **How it avoids losing a caveat.** With a worked before/after on a real sample that contains a
     failure and a caveat. ⚠️ **A proposal with only a happy-path example has not been tested against
     its own main risk.**
   - What it costs: which documents change, and whether the owner's own output-style block is one of
     them.
5. **Put it to the owner, in his framing, with one recommendation and its main tradeoff.** ⛔ **The
   decision is his and the task ends there.**
6. **Whatever ships, these hold:**
   - ⛔ **No edit to `CLAUDE.md`'s owner-authored output-style block without his explicit ruling.**
   - ⛔ **No edit to the seven role files in `claude/agents/` without his explicit ruling** — their
     reporting instructions are the same surface by another route.
   - ⛔ **The canonical status vocabulary is untouched**, and no new status value is invented.
   - ⛔ **No `ai-agents/wiki-vault/` write**
     ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
   - ⛔ **No status change, no file move, no mover run**
     ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
   - ⛔ **No re-rank**
     ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
   - ⛔ **Nothing under `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/` is edited** (ADR-034).
   - ⛔ **No `path:NNN` citation into a coordination document** — heading plus quoted fragment
     ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
   - ⛔ **No secrets in the artifact.** ⛔ **No commit.**

## Verification steps

1. **A dated report exists** under `ai-agents/knowledge-base/reports/`. ⛔ Not in the wiki.
2. **It names its sample corpus** — how many real replies, from where, over what dates — and states
   plainly whether that corpus is large enough to conclude from.
3. **The rule-by-rule scoring covers every rule** in both sources, each marked obeyed or not with
   evidence, including the passes.
4. **The finding is named — (1), (2) or (3) — in one sentence, before any proposal.**
5. **Under (2): exactly one proposal is stated**, with one recommendation and its main tradeoff. ⛔ A
   report presenting four options with no recommendation has not done the work.
6. ⛔ **The worked before/after example contains a failure and a caveat, and both survive the "after"
   visibly and at the top level.** ⚠️ **If they do not, the proposal is not ready and the report says
   so.**
7. **The report states explicitly whether the proposal would require editing the owner's own
   output-style block**, by name.
8. `git diff --stat` shows **no change to `CLAUDE.md`, to `claude/agents/`, or to
   `ai-agents/knowledge-base/conventions/`** — only the new report and this task's own folder. ⛔ **A
   diff touching any of those three means the proposal was applied instead of proposed.**
9. `node --test test/*.test.js` passes — this task ships no code, so it must not move that needle.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Sibling:**
  [`0409`](../../done/0409-make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request/brief.md)
  — the same owner sentence, the other surface (`/fkit-status`, a shipped script). ⛔ **Neither subsumes
  the other**, and `0409` is the one the ruling names explicitly.
- ⭐ **Sequence it AFTER `0409` on merit** — if `0409`'s measurement returns finding (1) or (3), the same
  answer probably holds here and this task gets much cheaper or disappears. ⚠️ **That is a merit
  statement, not a dependency**, and not a rank.
- **Owner: `fkit-producer`** — the surface is how this team reports to the owner, which is a producer
  convention, and the task ships no source.
  ⚠️ **The counter-argument, recorded rather than buried:** the proposal, if accepted, lands in
  `claude/agents/` and `CLAUDE.md`, which are coder-adjacent surfaces. ⭐ **It does not change the owner
  field, because this task stops at the proposal** — the implementation, if he rules for it, is a
  separate brief that does not exist yet and ⛔ **must not be pre-filed** (investigation-first: its shape
  is unknown until the finding is named).
- ⚠️ **The strongest objection to this task, stated rather than answered:** it may be unmeasurable. Agent
  prose is not a script with a stdout contract, the real-sample corpus may be thin, and *"reads badly"*
  is one person's judgement with no baseline. ⭐ **Step 1 is written to let the task end honestly on
  that finding** rather than manufacture a proposal to justify the row.
- ⚠️ **Priority: Sprint 11 is UNRANKED and no `P<n>` exists on it.** This brief reads
  `## Priority: Unscheduled` and its board row's Priority cell reads `—`, matching every other row.
  ⛔ **Inventing a rank is the act ADR-035 forbids.**
- ⭐⭐ **SUPERSEDED 2026-09-20 — SPRINT 11 IS NOW RANKED `P1`–`P4` AND THIS TASK IS `P4`.** The bullet above is left byte-identical; where the two disagree, this one governs. Authority: an owner ruling of 2026-09-20 relayed into a spawned `fkit-producer` (no owner channel, ADR-021) — *"rank the four"*. ⭐ The *"sequence it AFTER `0409`"* merit statement is now a number: `0409` is `P1`, this is `P4`.
- ⭐⭐ **SUPERSEDED LATER ON 2026-09-20 — THIS TASK IS NOW `P5`, NOT `P4`.** The bullet above is left byte-identical; where the two disagree, this note governs. ⛔ **Authority first: the owner ruled it**, **2026-09-20**, **live via `AskUserQuestion` in an `fkit lead` session**, relayed into a spawned `fkit-producer` with no owner channel (ADR-021). ⚠️ **SELECTED OPTION TEXT — a pre-written option he chose; not his own prose.** ⛔⛔ **Not producer precedent for re-ranking.** **What moved and why:** [`0411`](../../done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/brief.md) — the read-only aiboard reader, ADR-051's ruled interim — was ruled to run ahead of both this task and `0405`, so both shifted down one. ⭐ **This task's own merit statement is UNAFFECTED:** *"sequence it AFTER `0409`"* still holds — `0409` is `P1` and closed. ⛔ **Nothing else changed here** — no status, no scope, no `Depends on`.
- ⛔ **`Depends on: nothing` above is UNCHANGED AND STILL CORRECT, DELIBERATELY.** The owner's option text said *"declare 0409 as a dependency of … 0410"*; this brief's own words — *"That is a merit statement, not a dependency"* — say it is not one, and recording it as one would be a false `Depends on`. ⭐ Rank alone gives the loop the required order.
- ⛔ **Filed by a spawned `fkit-producer` with no owner channel** (ADR-021). ⛔ **No commit was made by
  the act that created this brief**, and nothing was written to `ai-agents/wiki-vault/`.
- **Citations here are durable anchors** — heading plus quoted fragment, never `path:NNN` — per
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).
</content>
