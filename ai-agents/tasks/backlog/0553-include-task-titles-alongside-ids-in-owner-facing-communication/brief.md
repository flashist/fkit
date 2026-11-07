# Include task titles alongside IDs in owner-facing communication

## ID
0553

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner request — 2026-11-05, user chat in the root `fkit-lead` session, relayed verbatim:**

> Brief App Task to the Backlog. The thing is that I found myself often at the situation when lead or other agents mention a task, but they mention it by its ID, not by the title. So, and I don't have context about it. I like, it's really hard for me to understand what is the task. So I suggest I suggest that whenever a task is mentioned, it should not only be mentioned by the ID, but also by the title.

Interpret “Brief App Task” as “brief a task.” This filing records the requested communication
policy; it does not implement it across the team or authorize source edits now.

An ID identifies a task permanently, but tells the owner nothing about its purpose. Pairing the ID
with the task's human-readable title lets the owner understand progress, decisions and next steps
without opening each brief. Keep the existing ID-based identity rule; add readable context.

Grounding: ADR-016 identifies the existing shared-instructions delivery channels; ADR-061 extends
the role/runtime coverage to configured Codex and Claude. Use those channels, preserving their
documented limits: delivery of instructions does not guarantee model compliance.

Duplicate check found no matching open brief. Related
[0410 — Investigate how agents report status to the owner in prose, and put a hierarchical shape to him](../0410-investigate-how-agents-report-status-to-the-owner-in-prose-and-put-a-shape-to-him/brief.md)
investigates report hierarchy and owner style; this explicit task-naming request is independently
shippable and does not wait on that investigation.

## What to build

1. Establish one clear owner-facing rule: whenever an agent mentions or references a task, include
   its permanent ID and its human-readable title. Apply it to the lead and all other ordinary roles,
   and to adversarial findings that reference tasks. Cover progress commentary, narrative status,
   next steps, handoffs shown or relayed to the owner, decision explanations, approval options and
   descriptions, review outcomes, and task link labels.
2. Use the canonical task brief's H1 as the authoritative title; retain readable words rather than
   substituting a slug or guessing from an ID. When a title cannot be verified, show the ID with an
   explicit “title unavailable” statement. Do not fabricate a title or silently omit the task.
3. Make task references understandable where they appear. A table row that already displays the ID
   and full title together is compliant without repeating the title in every cell. In prose and
   standalone task links, use a form such as “0553 — Include task titles alongside IDs in
   owner-facing communication.” Each task in a multi-task decision or next-step list must be
   identifiable without relying on a distant earlier explanation.
4. Carry the rule through existing canonical shared rules, role instructions and source procedures
   that emit owner-visible task references. During implementation planning, identify the exact
   affected files, including relevant status/ship-loop/question/review templates and examples.
   Starting points are `claude/scaffold/universal-rules.md`, `claude/agents/fkit-*.md`,
   `claude/skills/`, and configured prompt/rule assembly in `codex/materialize.mjs`. Follow existing
   root/scaffold delivery and generated `.agents/skills/` conventions; editing only a generated
   installed copy is insufficient. Preserve existing rule-size limits and owner-authored text.
5. Update or add relevant worked examples demonstrating the compliant wording across those
   surfaces, including an adversarial task reference and a short approval option. Keep required
   report shapes, findings, caveats, status grammar, approval semantics and role boundaries intact.
   Existing option-length constraints are a wording problem; do not solve them by dropping titles.

Machine-only IDs, command arguments, paths, keys, dependency declarations and source-status grammar
keep their existing formats. This is communication policy and its templates/runtime delivery;
do not rename tasks, rewrite historical records, bulk-rewrite machine artifacts, introduce a new
shared-instructions system, or change task/sprint placement or dependencies.

## Verification steps

1. Review the implementation's affected-file inventory and resulting source/generated prompts:
   show how the rule reaches all six ordinary roles plus the adversarial reviewer through the
   supported runtime paths. Distinguish source inspection and illustrative examples from any
   actual session execution; do not claim universal agent compliance or unperformed runtime checks.
2. Walk through representative examples for progress, narrative status, next steps, an owner-visible
   handoff, a decision, an approval option, a review outcome, an adversarial finding and a standalone
   task link. Each known task shows its ID and canonical title; a multi-task example names each
   task. The unknown-title example explicitly says “title unavailable.”
3. Confirm a table row containing both ID and title remains compliant without redundant repetition.
   Confirm machine-only identifiers, paths, dependency lines and canonical status forms are unchanged.
4. Review relevant updated templates/examples for bare owner-facing task IDs and inconsistent
   exceptions. Use focused document review and existing applicable checks; this brief does not
   require new permanent tests, benchmarks or timing investigations for a prose policy change.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Placement:** owner explicitly requested the unranked Backlog, 2026-11-05; no sprint membership,
  rank, order or existing dependency changes. No open task gains a wait on this task or any sprint.
- **Single-unit rationale:** the rule and its delivery/templates/examples form one communication
  change; a lead-only rule would leave the requested team-wide behavior incomplete.
- **Filing boundary:** one brief and one Backlog row only; no source/wiki/install/index changes,
  implementation, commit, push or lifecycle move. Existing active work is unaffected.
- **Wiki freshness:** 12 commits touched `ai-agents/` since watermark
  `185ac5e07e918c089ed3afd23496587315342000`; wiki guidance may lag. Relevant shared-rule/runtime
  decisions were checked against current sources. No wiki page specifically documents this new
  task-naming requirement; a later wiki-role ingest can capture it after implementation.
