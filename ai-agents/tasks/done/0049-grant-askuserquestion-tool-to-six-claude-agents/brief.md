# Grant the `AskUserQuestion` tool to the six Claude-side agents

## ID
0049

## Sprint
Sprint 2

## Priority
54

## Status
✅ Done

## Owner
fkit-coder

## Context

**Owner ruling (2026-07-17)**, following the reviewed-and-closed investigation task 39
([findings](../../../knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md),
esp. §5 + the boxed Owner ruling; settled in
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md),
Decision 4): grant the built-in `AskUserQuestion` **tool** to the **six Claude-side agents** —
producer, coder, architect, reviewer, wiki, lead — and **not** `fkit-adversarial-reviewer`.

**What the measurement settled, so this brief is a low-stakes ergonomic grant, not an architecture
change:**

- `AskUserQuestion` is **session-only** on Claude Code 2.1.212: it works in a top-level
  `fkit <role>` session (owner present), and is `TOOL_ABSENT` in any spawned consult (measured
  **3/3**, at the broadest `tools: *` grant). A consult **cannot** ask the owner regardless of the
  grant — so the consult "return open questions" contract is untouched and stays exactly as written
  (report §4, ADR-021 Decisions 1–2).
- **`fkit-adversarial-reviewer` is excluded structurally, not by preference.** It runs its review on
  **Codex** (`codex exec`), which has no `AskUserQuestion`; it is additionally a findings-only leaf.
  "All agents" cannot include the second model (report §3, ADR-021 Decision 3). **Its file must stay
  byte-untouched.**

**This is a TOOL grant, gated by the `tools:` frontmatter — not a skill.** Anyone reaching for
`skills_for_role()` / `claude/skills-for-role.sh` here is in the wrong mechanism (ADR-010/ADR-012:
tools are gated by `tools:` frontmatter, skills by the ownership source of truth). There is therefore
**no** `skills-for-role.sh` change and **no** `fkit-team` / `README.md` mirror-table change — those
track skills, not tools.

## What to build

- Add `AskUserQuestion` to the `tools:` frontmatter line of exactly these six
  `claude/agents/fkit-*.md` files: `fkit-producer.md`, `fkit-coder.md`, `fkit-architect.md`,
  `fkit-reviewer.md`, `fkit-wiki.md`, `fkit-lead.md`.
- Add a one-line note to each of those six agents, near its existing consult "return open questions"
  guidance: *"In a session you may use `AskUserQuestion` for a structured choice; in a spawned consult
  the tool is absent — return open questions as before."* The existing consult text stays — **nothing
  is deleted** (report §5, ADR-021 Decision 4).
- **Do not touch `claude/agents/fkit-adversarial-reviewer.md`** — it must be byte-identical after this
  task (`git diff --stat` shows no change under it).
- **Out of scope, deliberately:** `claude/skills-for-role.sh` (this is a tool, not a skill);
  `claude/skills/fkit-team/SKILL.md` and `claude/README.md` mirror tables (they track skills);
  `ai-agents/wiki-vault/` (fkit-wiki's exclusive path — see Notes on whether a sync follow-up is
  wanted).

## Verification steps

- The `tools:` line of each of the six agent files carries `AskUserQuestion`; `fkit-adversarial-
  reviewer.md`'s `tools:` line does **not** (and the file is otherwise unchanged).
- Each of the six carries the one-line session/consult note, and its prior consult "return open
  questions" text is still present (nothing deleted).
- `grep -rl AskUserQuestion claude/agents/` returns exactly the six granted files — not the seventh.
- After `claude/fkit-claude-init.sh .`, the `.claude/agents/` copies reflect the grant (the six carry
  it, the adversarial reviewer does not).
- **Session spot-check (owner, per the report's session measurement):** a `fkit <one-of-the-six>`
  session can actually invoke `AskUserQuestion` and the selection dialog renders and returns.
- `git diff` touches only the six agent files (plus the gitignored `.claude/` regen) — **no**
  `skills-for-role.sh` diff, **no** `fkit-team` / `README.md` mirror-table diff.

## Notes

- **Owner: fkit-coder** — a source edit to the canonical agent files under `claude/agents/`.
- **Depends on: task 39** (investigation, `✅ Done` / reviewed) **and ADR-021** — the decision must
  exist first (it does). **Blocks: nothing.**
- **Atomic, one unit:** the six grants + their notes are a single independently shippable change; no
  smaller unit ships value on its own, and there is no dependency ordering among the six.
- **Version-scoped fact.** The grant is correct *because* the tool is session-only on Claude Code
  2.1.212 (ADR-021, header + "re-raise only if"). This task does not re-open that; it implements it.
- Consuming projects receive the grant via normal `.claude/` init regeneration; no migration concern.
- **Open question for the owner (not resolved here):** whether a wiki-sync follow-up is warranted if
  any `ai-agents/wiki-vault/` page enumerates per-agent tool allowlists. Left as a question rather than
  a filed second brief — this is a tool grant, and the mirror tables that track *skills* are explicitly
  out of scope; a wiki sync is only worth a task if the vault actually records agent `tools:` lines.
