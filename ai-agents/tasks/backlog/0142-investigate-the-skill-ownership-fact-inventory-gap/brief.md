# Investigate the skill-ownership fact-inventory gap — the mirror checklist does not see every site

## ID
0142

## Sprint
Sprint 2

## Priority
120

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**This is an investigation, not an implementation.** The fix shape is genuinely unknown, and scoping a
build before the shape is known is what this brief exists to avoid.

`claude/skills-for-role.sh:12-24` carries a **mirror checklist** — the list of places to update when a
role↔skill ownership fact changes. It has now failed **twice**, in two different ways:

1. **Task 0036** — the checklist shipped false docs. (Recorded in the sprint plan.)
2. **Task 0124 (priority 107), 2026-07-25** — the brief listed only the **four** `skills-for-role.sh`
   mirrors. A manual grep sweep found **three further live sources** asserting the reversed ADR-025
   grant that the checklist does not cover:

   | File | What it said |
   |---|---|
   | `claude/scaffold/universal-rules.md:7` | *"Any role but the adversarial reviewer may invoke them"* — the rules block in **every agent's context, every turn**; it also generates the repo-root `CLAUDE.md`/`AGENTS.md` blocks |
   | `claude/agents/fkit-producer.md:7,37-38,95-96` | three assertions of the ADR-025 grant |
   | `claude/agents/fkit-coder.md:103,190-191` | *"closes the task itself"* + *"you may invoke them yourself"* — the latter inside the coder's **hard must-not-do list** |

**Why this is not a documentation nit.** Those three are **system prompts and the universal rules
block** — they sit in an agent's context every turn and **outrank a SKILL file** in the agent's own
reasoning. Had 0124 shipped as written, the ADR-018 hook would have denied the coder a mover while
`fkit-coder.md:190-191` still instructed it to invoke one: **a runtime arguing with itself.** It was
caught by a human-initiated grep, not by any checklist or test.

**The generalizable finding, recorded in the sprint plan 2026-07-25 and left unscoped until now:** the
checklist was built for *docs* and does not see *agent definitions* or *the universal rules block*.
Two instances is a pattern in the checklist, not two slips.

**Owner ruled 2026-07-25 (this session): file it, as an investigation.**

## What to investigate

Answer these, with evidence, and recommend one path:

1. **What is the true inventory?** Every place a role↔skill ownership fact can be stated today —
   `skills-for-role.sh` itself, the four documented mirrors, agent definitions, `universal-rules.md`,
   the generated `CLAUDE.md`/`AGENTS.md` blocks, SKILL owner banners, the scaffold copies, the wiki
   vault. **Enumerate by evidence, not by memory** — the whole failure being investigated is a
   confidently incomplete list.
2. **Can it be mechanically enforced rather than remembered?** `skills_for_role()` is already the single
   declared source of truth (ADR-012). Options to weigh, at least:
   - A **test** that greps every candidate site for ownership assertions and cross-checks them against
     `skills_for_role()` — the strongest option, but the assertions are free-form prose, so the
     detection problem may be genuinely hard. Say so if it is.
   - **Generating** the ownership sentences into the agent definitions and rules block from
     `skills_for_role()`, the way `universal-rules.md` already generates the `CLAUDE.md` blocks — moves
     the fact to one place instead of checking many.
   - A **better checklist** — cheapest, and the weakest; it has failed twice already. If this is the
     recommendation, say plainly why the third version would hold where two did not.
3. **What does it cost?** `ADR-014` keeps devDependencies at zero, so any test is hand-rolled. Weigh
   that against the rules-block byte budget, which task 113 (`0130`) says is already at **91.1%** — a
   generated-prose option that grows the block collides with it.
4. **Is an ADR needed?** If the recommendation changes where a fact of record lives, it probably is.

## Verification steps

1. A written report lands in `ai-agents/knowledge-base/reports/`, dated, naming the complete inventory
   from item 1 with a file and line for each site.
2. The report states, for each candidate approach in item 2, what it would catch and **what it would
   still miss** — an approach with no stated blind spot has not been examined.
3. It ends in **one recommendation with its main tradeoff**, in a form the owner can approve or reject,
   plus whether an ADR is required.
4. The inventory is validated against the two known historical misses (0036 and 0124's three sites):
   **would the recommended approach have caught them?** If not, say so — that is the single most
   useful sentence in the report.
5. **No implementation.** This task produces findings; the build is scoped separately once the owner
   has ruled on the recommendation.

## Notes

- **Depends on:** nothing.
- **Blocks:** any implementation of the fix, which is deliberately not scoped yet.
- **Owner:** fkit-architect — feasibility, cost, and where a fact of record should live.
- **Coordinates with task 0137** (the "verify against the claim" convention, which covers citation drift
  and incomplete inventories). **0137 teaches; this task fixes the specific mechanism.** The owner
  considered folding this into 0137 and chose to keep it separate for that reason. Read 0137's brief
  before starting so the two do not contradict each other.
- **Do not re-derive the 0124 sweep from scratch** — its three sites are given above. **Do verify each
  one still reads as stated**, since 0124 has since shipped and may have changed them. A citation that
  no longer resolves is itself a finding.
- No commit — leave the report in the working tree.
