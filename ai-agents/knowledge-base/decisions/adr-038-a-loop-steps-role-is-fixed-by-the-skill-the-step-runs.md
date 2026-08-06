# ADR-038: A loop step's role is fixed by the skill the step runs, not by the deliverable's author

- **Status:** accepted
- **Date:** 2026-08-06
- **Deciders:** the owner — ruled via task `0200`
  (`ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/brief.md`,
  closed 2026-08-05); recorded by the architect under task `0222` on a named owner ruling of
  2026-08-05 (*"authorize a producer follow-up to file ADR-038"*), plan approved via
  `AskUserQuestion` in the live lead session 2026-08-06.

## Context

ADR-037 settled how a skill rule binds a *spawned* worker, and explicitly left one axis open. Its
§Context (`adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md:33`)
says:

> **"Not decided here (the *invocation* axis):** *which* skill a role may run at all."

This ADR closes that axis for loop steps. The incident that forced the question: on a single
sprint-loop driver run (2026-08-02), the driver spawned the wrong role for the Process-review step
on three consecutive tasks — routing the step to the deliverable's *author* (an architect, for a
design document) instead of the step's owning role. The ADR-018 `PreToolUse` skill-ownership hook worked correctly everywhere it was reached; the
failure was role *selection* upstream of any skill invocation.

The owner ruled the question in task `0200` (closed 2026-08-05). The full analysis — the three
options, the authorship-vs-structure question, the wording question, the sole-source-write question,
and the detection question — lives in
`ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` (§6 states
why an ADR is required; §7 the recommendation; §8 the follow-ups). This ADR records the decision and
cites that report for the reasoning; it does not restate it.

Role→skill ownership is declared in exactly one place: `skills_for_role()` in
`claude/skills-for-role.sh` (`claude/skills-for-role.sh:48`). That file is the source of truth —
note that ADR-012, which established the single-declaration principle, names a stale home for the
function (`claude/fkit-claude.sh`); cite the file, not ADR-012's path.

## Decision

**A loop step's role is fixed by the skill the step runs, not by the deliverable's author.**

Concretely: the Process-review step is always `@fkit-coder`, whoever wrote the deliverable under
review — because the step runs `fkit-process-stateful-review`, which writes the review ledger's
coder-owned section and whose Step 6 applies approved code fixes
(`claude/skills/fkit-process-stateful-review/SKILL.md:195`). Neither of those changes when the
deliverable is a document rather than code.

The decision is option **(a)** — the loop states the rule plainly, in an enumerated row that carries
its reason — **with option (c)'s paired misroute detector as a non-optional companion** (task
`0224`).

## Options considered

- **(a) State the rule in the loop, enumerated and reasoned (chosen)** — the loop's step row names
  the owning role and *why* (the skill the step runs), so a future driver acts on the rule without
  re-deriving it. Wins because it fixes the actual failure (role selection by the driver) at the
  point where the selection happens, without touching the ownership declaration.
- **(b) Grant `fkit-process-stateful-review` to the architect in `skills_for_role()` — rejected.**
  It hands a source-write procedure to a design-only role: the skill's Step 6 applies code fixes,
  which the architect must never do. The grant is total-or-absent — `skills_for_role()` has no
  per-artifact scoping, so there is no way to grant the skill "for documents only". And the premise
  ("the author of the deliverable should run its process-review") generalizes: four of the seven
  roles author deliverables, so accepting it once widens the coder's sole-source-write authority
  four ways.
- **(c) Detector only — rejected as sufficient, accepted as companion.** A misroute detector makes
  the next departure visible, but detects rather than prevents; and (c) alone leaves the loop row's
  *"apply … method"* cell unenumerated, so the next worker can again reproduce a subset of the
  method and call it done. (Per the source report's R8 correction, the brief's construction of (c)
  already states the rule and its reason — its gap is enumeration, not silence.) Necessary, not
  sufficient.

## Accepted tradeoff — prose, not prevention

This rule stays **prose**. The ADR-018 hook gates skill *invocation*: a driver that spawns the wrong
role and instructs it to do the work **by hand** never reaches the gate, so no mechanism prevents
the misroute at spawn time. What we accept is a prose rule plus a durable detector **in place of
prevention** — the same shape ADR-033 states about its own residual. The detector's record is
durable, not tamper-proof: per ADR-022, every role except the adversarial reviewer is
tool-unrestricted.

## Gate non-reimposition

This rule governs *role selection* only: the loop's single up-front approval still replaces the
stateful-review skill's per-round owner gate (ADR-019 / ADR-032; report finding R1), and the loop
row's "apply … method" construction stays. This ADR cites those decisions and does not reopen them.

## Consequences

- **Positive:** every loop step that runs a skill has a derivable owner — look up the step's skill
  in `skills_for_role()` (`claude/skills-for-role.sh:48`). Two current sprint-loop steps (Build and
  Verify) run no skill; their roles come from the loop's enumerated step table, not from this
  lookup. And the rejection of (b) is on the record, so the next architect-authored deliverable
  does not re-open the argument.
- **Implementation follow-ups are separate, already-filed tasks** (measured on disk 2026-08-06, all
  six filed): `0223` (row enumeration + reason — the one task depending on this ADR, and only for
  its reason clause), `0224` (the paired misroute detector), `0225` (loop-table row↔ownership
  test), `0226` (four-mirror checklist repair), `0232` (ADR-012 stale-coordinates repair), `0233`
  (denial-log ADR-036 registry assessment). `0224`/`0225`'s declared dependencies on `0222` were
  owner-relaxed 2026-08-06. ⚠️ `0222`'s brief carries an item-3 bullet saying the follow-ups are
  "not yet filed" — written 2026-08-05 and falsified by the brief's own dated correction of
  2026-08-06; this ADR states the measured truth as of 2026-08-06.
- **Corroborating practice:** the 2026-08-06 driver run applied the rule live — task `0241`'s Build
  step spawned `@fkit-architect` (its deliverable ran `/fkit-design-spec`, an architect skill), and
  its Process-review step spawned `@fkit-coder`.
- **Negative / costs:** see the accepted tradeoff above — no spawn-time prevention exists; the rule
  binds drivers as prose plus detection.

## Re-raise only if

- `skills_for_role()` gains per-artifact grant scoping (the total-or-absent premise behind (b)'s
  rejection would no longer hold), or
- the owner re-rules on `0200`, or
- a loop step is created whose skill has **no** owning role in `skills_for_role()`, or one that
  runs **no skill** and whose loop row does not name its role — either way the rule as stated
  cannot resolve that step's role.

Anything else that re-argues (b) from deliverable authorship is closeout, not a new finding.

## Number allocation — the four-way sweep, evidenced

Run 2026-08-06 before allocation (brief step 2; ADR-029 precedent — a number was once claimed
everywhere *except* `decisions/`):

1. `ls ai-agents/knowledge-base/decisions/ | grep -i 038` → **no hits**; filename derivation per
   `/fkit-record-decision` step 2 gives highest-on-disk = 37.
2. `grep -rln "adr-038\|ADR-038" ai-agents/knowledge-base/reports/` → 1 file (the source report —
   names ADR-038 as the follow-up to file: a reference to *this* ADR).
3. Same grep over `ai-agents/sprints/` (incl. `done/`, `backlog.md`) → 3 files, 13 hits — all in
   `0222`'s own rows and its follow-ups' rows ("files ADR-038", "DO NOT PRE-ALLOCATE 039"):
   references to this ADR.
4. Same grep over `ai-agents/wiki-vault/` (read-only) → 3 files, 6 hits — all of the form "ADR-038
   is `0222`, unwritten" / "ADR-038 does not exist": references to this ADR.

**Classification: every hit references this future ADR; zero rival claimants. 038 is free and is
allocated here.**

## Related

- Ruling: `ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/brief.md`
- Reasoning: `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md`
- Axis closed: `adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md:33`
- Cited, not reopened: ADR-018 (skill-ownership hook), ADR-033 (movers producer-only; the
  prose-plus-detector precedent), ADR-037 (rule-vs-instruction axis), ADR-019 / ADR-032 (loop
  approval model), ADR-022 (tool-unrestricted roles), ADR-012 (single ownership declaration; stale
  path noted in §Context)
- Ownership source of truth: `claude/skills-for-role.sh:48` (`skills_for_role()`)
- Skill grounding the concrete rule: `claude/skills/fkit-process-stateful-review/SKILL.md:195`
  (Step 6 — apply approved fixes)
