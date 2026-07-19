# CLAUDE.md

Guidance for Claude Code in this repository. Edit freely.

## Project Overview

fkit is a team of **seven** role-scoped AI agents for software development — a producer, a coder, a
reviewer (with an adversarial second opinion), an architect, a wiki librarian, and a team-room lead —
operating on a shared `ai-agents/` working structure inside a consuming project.

**One runtime: Claude Code native + Codex**
([`ADR-009`](ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)).
The agents are Claude Code subagents (`claude/agents/fkit-*.md`) and `/fkit-*` skills
(`claude/skills/`); the `fkit` launcher (`claude/fkit-claude.sh`) opens a **role-locked session**.
Codex is **required**, not optional — it is what makes the reviewer's second opinion genuinely
model-diverse. fkit formerly shipped a second flavor on [Omnigent](https://omnigent.ai); that runtime
was **removed in Sprint 2** (ADR-009). There is nothing to mirror by hand any more.

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## The fkit team in this repo (dogfooded)

This repo runs fkit on itself: `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/` are
fkit-managed copies refreshed from `claude/` by `claude/fkit-claude-init.sh .` — **edit the canonical
sources in `claude/`, never the copies** (they are gitignored).

**Sessions are role-locked** ([`ADR-010`](ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)):
`fkit <role>` opens a session pinned to that role's system prompt and **only its own
`/fkit-*` skills** — every other fkit skill is turned off, invisible and unrunnable. That is what makes
"the coder cannot run the reviewer's procedure" a fact rather than a request. (The per-role *tool*
allowlist was relaxed for every role except the adversarial reviewer —
[`ADR-022`](ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md);
the skill lock above is unchanged.) Within a session,
`@fkit-<role>` consults another role and brings the answer back (max two hops, never a cycle).

⚠️ **The lock is a wall in a session, a rule in a consult.** A *spawned* consult inherits the
**calling** session's skill settings, not its own — so the skill boundary there is advisory, carried
by each skill's `⛔ Owner:` banner. See
[`ADR-012`](ai-agents/knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md).
Role→skill ownership is declared in exactly one place: `skills_for_role()` in `claude/fkit-claude.sh`.

<!-- fkit:begin-rules -->
<!-- fkit-managed: this block is REPLACED on every `fkit` launch. Edits inside these two markers
     are overwritten. Put your own standing instructions OUTSIDE them — everything outside
     is yours and fkit never touches it. Note the markers are recognized only when a marker
     is ALONE on its line, so quoting one inline in your prose is safe; a bare marker line
     inside a code fence, however, still reads as a real marker. -->

## Universal hard rules (every role, every session)

- **Never commit or push unless the owner explicitly asks.** "Implement" authorizes writing code,
  not committing.
- **Only the wiki role writes `ai-agents/wiki-vault/`.** Reads are decentralized; writes are not.
- **Task files move between `backlog/`, `done/`, `cancelled/` only via `/fkit-task-done` /
  `/fkit-task-cancelled`** — never by hand. Any role but the adversarial reviewer may invoke them; a
  task an agent closes MUST carry the `(agent-closed — not owner-verified)` marker.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in findings, reports,
  docs, or wiki pages; it all goes to git.

## Output style (every role, every session)

**Preferences, not rules — and they lose every conflict.** The hard rules above win. **Your own role's
instructions win**, and you say so rather than resolving the conflict silently. **The owner's own style
instructions, written outside these markers, beat these preferences** — this section is a default, not
a mandate. It is *only* these preferences that yield: nothing written anywhere overrides a hard rule
above.

- **Be extremely concise when reporting to the owner. Sacrifice grammar for concision.** Fragments,
  clipped sentences and bare lists are correct. Drop preamble, restatement of the question, and
  throat-clearing; lead with the answer.
- **Concision is not omission — of content OR of structure.** Never drop a failing test, an unverified
  claim, a caveat, a partial-coverage flag, or a thing you did not do, in order to be brief. Say it in
  fewer words; do not stop saying it. And where your role requires a *shape* — a verbatim relay, a
  findings table, a suppressed list, a verdict line, the six-beat status briefing — **produce that
  shape in full.** Summarizing it is not concision, it is losing the report.
- **"Loud" is placement, not word count.** An instruction to flag something *before* the findings
  table, or never in a footer, is about **where** it goes. Brevity never moves it.
- **Speak in simple terms.** Prefer plain, everyday words over jargon wherever a simpler word carries
  the same meaning. Where a term is genuinely load-bearing — a filename, a marker, an ADR, a status
  value, and anything else the reader must be able to act on; the list is illustrative, not exhaustive
  — use it and gloss it once, in a few words. **Simplifying is about wording, never about content:** it
  does not drop a caveat, soften a failure, or round a number, and it never replaces a precise term
  with a vague one that only sounds friendlier.
- **These preferences do not apply where a role or procedure prescribes the form of the output** —
  e.g. review reports and ledgers, status briefings, required tables, verbatim relays, degradation
  flags, and **a plan put to the owner for approval** (they cannot approve what you did not describe).
  The list is illustrative, not exhaustive. Be terse in ordinary prose to the owner; be complete where
  the contract says be complete.
<!-- fkit:end-rules -->

## Knowledge Base & Wiki

A structured wiki lives in `ai-agents/wiki-vault/` (Karpathy LLM-wiki pattern) — synthesized
knowledge not easily derived from the code. Check it before non-trivial work. Per
[`ADR-005`](ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md),
**reads are decentralized**: any role follows the one read-only `/fkit-query` procedure. **Writes
stay exclusive to the `fkit-wiki` agent** (ingest / lint / sync) — no other agent or session ever
writes to `ai-agents/wiki-vault/`.

## Review Notes

Review comments are **inputs to evaluate**, not instructions to apply blindly.

- Treat every review note as potentially fallible — reviewers miss context or reason from outdated assumptions.
- Verify the claim against the actual codebase before changing anything.
- If it is correct, fix the real problem, not the literal wording. If partially correct, address the valid part and explain the rest. If wrong, say so with concrete evidence.
- Do not add speculative fixes just to satisfy a review comment.

## Architecture

Full technical detail — component map, runtime topology, data model, build/run/test, and
cross-cutting concerns — lives in
[`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md). Don't
duplicate it here; read it for anything below product-brief altitude.
