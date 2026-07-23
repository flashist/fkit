# Design an observer-agent and a notes-driven self-improvement (skill-tuning) system

## ID
0121

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

The owner wants fkit to **improve its own behaviour over time**. The idea: an **observer agent** watches
the other agents work, writes **selective notes** about how the work went (what worked, what didn't —
only what is genuinely useful for future decisions, not a transcript), and that accumulated record later
feeds a process that **"tunes" the wording of skills / agent behaviour** — treating the skill corpus like
model weights that can be experimented on.

**Two external inputs the owner named (to be investigated, not assumed):**
- Claude Code's **observer-agents** feature — `https://claudefa.st/blog/guide/agents/observer-agents`.
  Whether it exists as described, how it works, and whether fkit can build on it is **an open feasibility
  question this task must answer**, not a settled fact.
- Microsoft **SkillOpt** — `https://microsoft.github.io/SkillOpt/` — the "skills as tunable weights"
  framing: add / change / remove parts of a skill and measure whether results improve.

**The owner's explicit framing:** this needs **strong planning, architecture, and design discussion
before any implementation** — so this is a **design/feasibility task**, not a build. The owner also
invites the team to **propose better approaches** than the literal description; the design is not bound
to build exactly what is sketched here.

**Conflicts / risks to resolve in the design — do not plan around them:**
- **Skill wording is fkit's behavioural contract**, and it is locked per role (ADR-010, the skill-gate
  hook). A system that **automatically edits skills** touches the most safety-sensitive surface in the
  project. The design **must separate the low-risk observation layer from the high-risk modification
  layer**, and any skill/agent-wording change **must stay owner-gated** — proposed by the system, applied
  only on owner approval.
- **Authority boundaries:** only the coder writes source; only the wiki writes the vault; the producer
  writes no code. Who is allowed to write a *skill* change is an open governance question.
- **No secrets in any artifact** (hard rule) — the notes are a new artifact and must carry none.
- **Team shape:** an observer may be a **new role** (the team is seven; an eighth tester is
  authorized-not-built per ADR-028), a Claude Code observer-agent mechanism, or a lighter hook. Which one
  it is has team-shape doc implications and is a design output.
- **Prime early use case:** observing the newly-landed `fkit-sprint-ship-loop` conductor's autonomous
  runs — where agent-closed work is exactly the kind of activity worth learning from.

## What to build

**A design/feasibility spec** (a report under `ai-agents/knowledge-base/reports/`, per the design-spec
procedure) — **no implementation, no note-processing code, no skill edits, no wiki writes:**

1. **Feasibility investigation.** Read/evaluate both named sources. State concretely what the Claude Code
   observer-agents feature actually provides and whether fkit can build on it (or must build its own), and
   what of SkillOpt's method genuinely applies to a prose skill corpus vs. what does not. Cite evidence;
   flag where a claim could not be verified.
2. **The observation layer.** What is observed, when, and by what mechanism; where the notes live
   (proposal: per-day files under `ai-agents/` — the design picks the exact home and format); the **note
   schema**; and the **selectivity criterion** that keeps notes high-signal (decision-useful only — a
   worked/didn't-work signal, not a log). Define what is explicitly *not* recorded.
3. **The improvement / tuning loop.** How accumulated notes feed a process that **proposes** skill or
   agent-wording changes, and how a proposed change would be evaluated (SkillOpt-style experiment). The
   design **must keep proposal and application separate** — proposing is safe, applying is gated.
4. **Governance & safety.** Every skill/agent-wording change stays owner-gated; who owns authoring an
   approved change; no secrets in notes; how this respects role-lock and the skill-gate hook.
5. **Role/mechanism decision.** New fkit role vs. Claude Code observer-agent feature vs. hook — with the
   team-shape / doc consequences of each.
6. **The ADR(s) to record and the decomposed implementation tasks** (observation layer, note store,
   tuning loop, governance) with dependency links — **filed only after the owner reviews this design.**

**Explicitly out of scope:** building the observer, writing any note-capture or note-processing code,
editing any skill or agent file, and any wiki write. Interface/contract description only.

## Verification steps

1. A design spec exists under `ai-agents/knowledge-base/reports/` and makes **no source changes**.
2. It answers the **feasibility question** for both named sources with cited evidence — including a plain
   statement if the observer-agents feature is not what the description assumes.
3. It defines the note schema, the storage scheme, and the **selectivity criterion** (with examples of
   what is and is not recorded).
4. It defines the tuning loop with **proposal and application explicitly separated**, and states how every
   skill-wording change remains **owner-gated**.
5. It makes the role/mechanism call and enumerates the ADR(s) + the decomposed implementation tasks with
   dependencies.
6. The owner reviews and approves the design **before** any implementation task is scoped.

## Notes

- **Owner framing (2026-07-23):** design-first with strong planning; the team may propose better
  approaches than the literal sketch.
- **External inputs:** `https://claudefa.st/blog/guide/agents/observer-agents` and
  `https://microsoft.github.io/SkillOpt/` — to be investigated, not taken as given.
- **⚠️ Risk/conflict:** an auto-tuner that edits skills touches the behavioural contract (ADR-010 +
  skill-gate hook). The design must separate the safe observation layer from the gated modification
  layer; **no skill-wording change lands without owner approval**. No secrets in notes (hard rule).
- **Depends on:** nothing — the design can start now.
- **Blocks:** the implementation tasks (observation layer, note store, tuning loop, governance),
  scoped only after this design is reviewed with the owner.
- **Consult:** the architect is expected to put the open design questions to the owner during the
  design; the producer is available for product scope.
- **Filed on the Backlog board (unsprinted)** per the owner's "add to the backlog" instruction.
- **Early use case:** observing the `fkit-sprint-ship-loop` conductor's autonomous runs.
