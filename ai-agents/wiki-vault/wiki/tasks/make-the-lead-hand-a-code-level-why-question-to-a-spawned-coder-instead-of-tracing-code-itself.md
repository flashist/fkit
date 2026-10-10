# Make the lead hand a code-level "why" question to a spawned coder instead of tracing code itself

**Source**: `ai-agents/tasks/done/0498-make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P16` (append rank) · task `0498` · owner `fkit-coder`

## Goal
The owner, 2026-10-08: in another project, asked mid-test whether an error was fine, the lead *"started doing its
own research and it actually digged down into the code and the server side logic. I think it's wrong. … It needs
to spawn agent probably coder agent who can answer code specific … questions."* And: *"we are not changing its
behavior right now, but we want to make sure … the same behavior is not happening in the future."*

**The incident, generically** (that project, its hosts, logs and code deliberately not named): in ~14 read-only
tool calls over ~10 minutes the lead searched server code, read production logs over SSH under an earlier
read-only approval, concluded a plausible but **unverified** cause, and handed it to a producer as a diagnosis —
which can **anchor** the coder. It never decided not to delegate — *"each step felt like one more look"*.

**What in `fkit-lead.md` pulled which way:** *"Read the repo … to orient"* stated **no limit**; the never-list
named writing source, reviewing and designing — **not diagnosis**, so it felt allowed as "only reading".

Owner rulings, 2026-10-08 (`AskUserQuestion`, ⚠️ the lead's relay): **L1** *"Quick triage, then hand off
(Recommended)"* — answer from spec/brief/wiki with 1–2 fact lookups; the first "why does the code do this?" goes to
a spawned role. **L2** *"Tell owner it's delegated"*. **L3** *"No lead guess as fact"*. **L4** *"Relay read
approvals"*.

## Key Changes
- **Prose in `claude/agents/fkit-lead.md`:** orient narrowed to *"1–2 fact lookups, not diagnosis"*; a fourth
  conductor discipline, *"Hand off the first 'why' — never diagnose"*; a *"Never diagnose, yourself"* hard rule; a
  routing line; L2–L4 stated. **L4 is a read approval, quoted with date and channel — explicitly not** the ADR-055
  write marker; a diagnosis spawn is read-only and carries no marker.
- Plan rulings 2026-10-09 (as relayed): Q1 *"Dated note on ADR-031"*; Q2 *"Update both"* (role summaries — the
  `fkit-team` roster, `PROJECT.md`, `architecture.md` now say the lead never diagnoses); **Q3 — the tripwire**:
  *"2nd file read or any log"* (a second file read to explain a behaviour, or any log read to explain a failure);
  **Q4 — one owner override**, *"Yes, clearly labelled"*: if the owner, told it is a coder's job, still asks the
  lead to look, it may — labelled as its own unverified look. **So "never diagnoses" is the default, not absolute
  against an explicit owner ask.**
- **ADR-031 gained a dated ⚠️ note under Decision 2** (the never-list grew; nothing overturned). No hook or tool
  changed — **prose-enforced, trust not proof**.

## Outcome
- A probe was run against the new prompt body (pasted after the frontmatter) per the plan. ⚠️ **The brief itself
  warns that one passing probe proves nothing general** — the rule is prose and the model may still drift.
- Built after `0495`'s edit to the same file landed. Existing prompt-reading tests (`spawned-write-marker`,
  `plan-review-switch`) keep their anchors.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the dated note it added (Decision 2's never-list)
- [[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]] — the write marker a diagnosis spawn does **not** carry
- [[tasks/make-a-later-sprint-blocker-visible-0492-0495]] — `0495`, the earlier edit to `fkit-lead.md` it built on
- [[tasks/let-a-spawned-coder-write-under-a-lead-relayed-owner-approval]] — `0475`
- [[systems/fkit]] — the lead's role summary
- [[tasks/sprint-10-the-0472-0482-batch]] — `P16`, owner ruling R8
