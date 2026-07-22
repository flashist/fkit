# Relax the tool allowlist for every role except the adversarial reviewer

## ID
0070

## Sprint
Sprint 2

## Priority
57

## Status
✅ Done

## Owner
fkit-coder

## Context

**Owner ruling (2026-07-18), recorded as
[ADR-022](../../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)
(accepted):** relax the tool-allowlist half of the role lock. Six of the seven agents get
**unrestricted tools**; the adversarial reviewer keeps its exact minimal allowlist. This is a **tools
change only** — the skill lockdown and the prompt-level role contracts are untouched.

**Why (ADR-022 Context, condensed — do not re-litigate here):**

- Useful built-in capability tools (`WebSearch`, `WebFetch`, `LSP`, `NotebookEdit`, …) were excluded
  by **accident, not decision** — the moment an agent gets any `tools:` line it flips from "inherit
  all" to "only these," and these were dropped as collateral. Zero recorded rationale for excluding
  them.
- The `tools:` wall was **never a real sandbox** anyway — every fkit agent holds `Bash`, and the Bash
  escape hatch (ADR-008:85) means "no Write/Edit" was always substantially prompt-enforced.
- **Exactly one** tool wall protects a genuine, checkable invariant: the adversarial reviewer's lack
  of Write/Edit/Agent, which makes *"the independent second opinion never touched the code it is
  judging"* a structural fact. That one stays. Every other wall is accidental or product-discipline,
  not safety — and the owner ruled it not worth its cost.

**This subsumes task 54** (the `AskUserQuestion` grant, `✅ Done`, `grant-askuserquestion-tool-to-six-
claude-agents.md`). Task 54 added `AskUserQuestion` — and a one-line session/consult note — to the six
agents' `tools:` lines. When those `tools:` lines are removed here, the six retain `AskUserQuestion`
**by inheritance** instead of by an explicit entry — the capability is not lost, only its mechanism
changes. The prose note task 54 added stays (see below — it is contract text, not a tool grant).

## What to build

**In each of the six agent files — `fkit-producer.md`, `fkit-coder.md`, `fkit-architect.md`,
`fkit-reviewer.md`, `fkit-wiki.md`, `fkit-lead.md` (all under `claude/agents/`) — remove the entire
`tools:` frontmatter line.** ADR-022 Decision 1's recommended mechanism: a subagent with **no**
`tools:` field inherits every Claude Code tool, which is the truest expression of "no restriction" and
the lowest-maintenance (nothing to expand as the harness grows).

- **Mechanism is the coder's call.** The ADR permits an explicit comprehensive `tools:` list as an
  alternative if the coder prefers. **Recommendation: omit the line.** Tradeoff of omitting, accepted
  in the ADR: the role also inherits *future* Claude Code tools and irrelevant ones (Cron*, Artifact,
  RemoteTrigger, …) — harmless for a CLI dev tool, and preferable to a list that silently rots.
- **Removing the line drops, by design:** the six explicit `AskUserQuestion` entries (retained by
  inheritance — task 54); the **lead's scoped `Agent(fkit-producer, …)` list** (the one
  structurally-enforced point of the two-hop consult topology — now prompt-enforced like everywhere
  else, taken knowingly per ADR-022 Decision 1); and the coder's explicit `EnterPlanMode` /
  `ExitPlanMode` entries (also retained by inheritance). None of these is a regression — each is named
  in the ADR as an accepted consequence.

**Do NOT touch `claude/agents/fkit-adversarial-reviewer.md`.** Its `tools:` line —
`tools: Read, Grep, Glob, Bash, Skill` — stays **exactly as is, byte-identical**. An agent's own
`tools:` line governs it at any spawn depth, so keeping this one line preserves the reviewer's
independence even when it is spawned as a consult by a now-unrestricted reviewer. This is ADR-022's
one deliberate wall (Decision 2); it is not to be "tidied up" to match the others.

**Keep the prose, change only the frontmatter.** The one-line session/consult note task 54 added to
the six agents (*"In a session you may use `AskUserQuestion` for a structured choice; in a spawned
consult the tool is absent — return open questions as before."*) and every other body-text role
boundary **stay untouched.** ADR-022 Decision 5: relaxing *tools* does not relax *contracts*. Do not
edit any role-boundary prose — not the lead's "not a doer" text, not the architect's "task lifecycle
is the producer's domain," not the reviewer's "review-only." Just the `tools:` lines.

**Explicitly out of scope — do not change:**

- `claude/skills-for-role.sh` and the ADR-018 `PreToolUse` skill-ownership hook — **the skill lockdown
  stays** (ADR-022 Decision 4). Skills remain role-locked: the coder still cannot run `/fkit-review`.
  This is a tools change, not a skills change.
- Any `fkit-team` / `README.md` mirror table — those track skills, not tools.
- Role-boundary prompt prose (above; ADR-022 Decision 5).
- `ai-agents/wiki-vault/` — fkit-wiki's exclusive path.
- `architecture.md` / `PROJECT.md` / `CLAUDE.md` — the doc refresh is a **separate architect-owned
  task** (see Notes), not this brief.

## Verification steps

- Each of the six agent files (`fkit-producer.md`, `fkit-coder.md`, `fkit-architect.md`,
  `fkit-reviewer.md`, `fkit-wiki.md`, `fkit-lead.md`) has **no `tools:` frontmatter line** (or, if the
  coder chose the explicit-list alternative, a comprehensive list — but the recommended and expected
  outcome is removal).
- **`git diff --stat` shows `claude/agents/fkit-adversarial-reviewer.md` untouched** — byte-identical,
  its `tools: Read, Grep, Glob, Bash, Skill` line unchanged.
- **Session spot-check (owner):** in a `fkit <one-of-the-six>` session, an agent can invoke a
  previously-blocked capability tool — e.g. `WebSearch` — and it runs (rather than `TOOL_ABSENT`).
- **Skill lockdown still holds:** the ADR-018 `PreToolUse` hook still **denies** a cross-role skill —
  e.g. the coder still cannot run `/fkit-review`. This proves skills stayed locked while tools opened.
- **No `skills-for-role.sh` diff and no `fkit-team` / `README.md` mirror-table diff** — `git diff`
  touches only the six agent files (plus the gitignored `.claude/` regen).
- After `claude/fkit-claude-init.sh .`, the `.claude/agents/` copies regenerate correctly: the six
  carry no `tools:` line, the adversarial reviewer's line is intact.
- **`AskUserQuestion` still available in a session** to the six (now via inheritance) — a quick check
  that removing the explicit entry did not lose the capability. *(Note the ADR-021 harness fact still
  holds: `AskUserQuestion` is `TOOL_ABSENT` in any spawned consult regardless of the grant — a
  session-vs-consult harness behavior, unaffected by this change.)*

## Notes

- **Owner: fkit-coder** — a source edit to the canonical agent files under `claude/agents/`.
- **Depends on: [ADR-022](../../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)**
  (exists, accepted). **Blocks: nothing.**
- **Atomic, one unit:** the six removals + keeping the seventh are a single independently shippable
  change; there is no dependency ordering among the six and no smaller unit ships value on its own.
- **Relationship to task 54 (`✅ Done`):** this task's mechanism (removing the `tools:` line)
  **supersedes** task 54's mechanism (an explicit `AskUserQuestion` entry) while **preserving its
  capability** (retained by inheritance). Task 54 is not undone — its grant survives; only how the
  grant is expressed changes. See the open question below on whether task 54 should be annotated.
- **Consuming projects** receive the relaxation via normal `.claude/` init regeneration; no migration
  concern.
- **Doc refresh is NOT in this brief** — see the separate architect-owned task
  `refresh-architecture-docs-for-tool-relaxation.md` (task 58).

## Open question for the owner (not resolved here)

- **Should task 54 be annotated as "mechanism superseded by task 57"?** Its capability survives, so it
  is **not** a `⛔ Cancelled` — the grant still holds, just via inheritance. Flagged rather than acted
  on: the producer does not move or re-status task files. If you want a breadcrumb so a future reader
  isn't confused that the explicit `AskUserQuestion` entry is gone, the cleanest place is a one-line
  note in this addendum (already present) rather than touching the done brief. **Say the word.**
