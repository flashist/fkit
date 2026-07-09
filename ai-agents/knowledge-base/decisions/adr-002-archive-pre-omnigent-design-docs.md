# ADR-002: Archive the pre-Omnigent research/review documents into `knowledge-base/history/`

- **Status:** accepted
- **Date:** 2026-07-09
- **Deciders:** owner (relayed via fkit-producer during project initiation), recorded by fkit-architect

## Context

Four large research/review documents lived at the repo root: `fkit-external-review-brief.md`,
`fkit-external-review-report.md`, `fkit-omnigent-research-brief.md`, and
`omnigent-research-report.md`. The initiation survey (`ai-agents/knowledge-base/architecture.md`,
"Notable conventions and deliberate decisions") found that these documents describe fkit's
**pre-Omnigent architecture** — a `bin/`, `generic/skills/`, `manifest/`, `examples/` layout with a
`compile-skills.mjs` compile pipeline — none of which exists in this repo today (confirmed absent from
the root directory listing). Git history corroborates the sequence: "Reserach brief" →
"External research report about omnigent" → "Porting to omnigent" → "Omnigent" → repeated "Omnigent
update"/"first start" commits — i.e. these documents **preceded and motivated a full rewrite** onto
the current `omnigent/fkit-*` bundle model. Left at the repo root, they read as current architecture
to anyone (human or agent) landing in the repo, which they no longer are.

## Decision

Move all four documents (via `git mv`, uncommitted per the owner's instruction) from the repo root
into `ai-agents/knowledge-base/history/`, and add
`ai-agents/knowledge-base/history/README.md` as a banner explaining what they are, why they no longer
describe the current architecture, and pointing to `ai-agents/knowledge-base/architecture.md` for the
current design.

## Options considered

- **Archive into `knowledge-base/history/` with a banner README (chosen)** — preserves the documents
  (they still explain *why* the Omnigent port happened, which is genuinely useful decision context)
  while removing them from the root's "what is this repo" surface area, and keeps them inside the
  knowledge-base where the architect's other durable output already lives.
- **Delete them** — rejected: they're the only record of the reasoning behind the Omnigent port; losing
  that would make a future "why not the old architecture?" question unanswerable from the repo alone.
- **Leave at repo root** — rejected: this is exactly the confusion the initiation survey flagged —
  a root-level "External Review Report" reads as current, live findings about the present architecture
  to a new reader, when it is in fact about a superseded one.

## Consequences

- **Positive:** repo root no longer misrepresents current architecture; the documents remain
  discoverable and their historical value (the *why* of the port) is preserved with an explicit
  pointer away from stale claims.
- **Negative / costs:** none material — a pure relocation with an explanatory banner; no content lost.
- **Residual risk / "re-raise only if":** the pre-Omnigent architecture is ever revived (unlikely,
  given the port is complete and dogfooded), or the `history/` convention needs to generalize to other
  superseded documents in the future — at that point, extend the same pattern rather than inventing a
  new one.

## Related

- `ai-agents/knowledge-base/architecture.md` — "Notable conventions and deliberate decisions" section
  (this ADR resolves open question 3 from that survey).
- `ai-agents/knowledge-base/history/README.md` (the banner written alongside this move).
- Git log: `871e5bf Porting to omnigent`, `104280c Omnigent`, `f8f238a External research report about omnigent`, `b0a7a52 Reserach brief`.
