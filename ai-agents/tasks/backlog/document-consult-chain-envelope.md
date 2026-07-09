# Document the consult-chain envelope

## Sprint
Sprint 1

## Priority
2

## Status
🔲 Backlog

## Context

During project initiation, the architect's survey flagged deep multi-hop agent consultation under
fully headless (`-p`) runs as an unverified reliability risk, framed as a possible blocker for the
"user-friendly startup sequence" goal. The owner corrected that framing: onboarding is interactive
(`-p` only seeds the first message; the session stays live) and only uses **one-hop** consults
(producer→architect, producer→wiki), which are verified working. The **unverified** case is deep
multi-hop consultation under a *fully* headless run — relevant to CI/automation-style chains (e.g. a
reviewer→adversarial-reviewer pass invoked non-interactively), not to onboarding.

Right now this distinction lives only in this sprint's planning docs and the corrected
`architecture.md`. It should be written down once, clearly, as the reference every agent's prompt and
every future automation design points to — otherwise the same "is this safe headless?" question gets
re-litigated per feature.

This is a **documentation/scoping task**, not a fix — no code changes implied. It may surface that
some cases need a follow-up investigation task (e.g. actually testing a 2-hop chain under `-p`); if
so, note that as a recommendation rather than doing it here.

## What to build

A short reference doc (`ai-agents/knowledge-base/consult-chain-envelope.md` is a reasonable path, or
fold into `architecture.md`'s cross-cutting concerns if the architect prefers) covering:

- **Verified-safe**: one-hop consult, either interactive or headless (spawn → send → end turn → read
  inbox once) — used by onboarding today.
- **Unverified**: multi-hop consult chains (agent A spawns B, which itself spawns C) under a fully
  headless (`-p`) run — not yet exercised or tested end-to-end.
- Which existing/planned flows fall into which bucket (e.g. reviewer → adversarial-reviewer is
  one-hop and should be safe; anything deeper needs a check before being relied on non-interactively).
- A recommendation on whether/when to actually test the multi-hop-headless case (this doc doesn't
  have to do the testing, just say whether it's worth a follow-up investigation task and how urgent).

## Verification steps

- The doc gives an unambiguous yes/no answer to "is *this* consult pattern safe under `-p`?" for each
  pattern currently in use across the six agents' configs.
- Cross-linked from `architecture.md`'s risks section and, if relevant, from any agent prompt that
  currently states the caveat informally.

## Notes

- Natural owner: **fkit-architect** (it already holds the technical picture and just corrected this
  exact framing in `architecture.md`). The producer can also draft it directly if the architect is
  busy — either is fine, but the architect should review before it's treated as settled.
- Small task — should not need its own sprint slot beyond this one.
