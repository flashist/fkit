# History — superseded design documents

The four documents in this folder describe fkit's **pre-Omnigent architecture** (a `bin/`,
`generic/skills/`, `manifest/`, `examples/` layout with a `compile-skills.mjs` build pipeline). None
of that exists in the current repo — fkit was fully ported to the Omnigent bundle model
(`omnigent/fkit-*/config.yaml` + `skills/`) after these were written.

Kept for historical record and decision context (they show *why* the port happened), not as current
architecture. For the current design, see
[`ai-agents/knowledge-base/architecture.md`](../architecture.md).

- `fkit-omnigent-research-brief.md` / `omnigent-research-report.md` — research into Omnigent as the
  target runtime, ahead of the port.
- `fkit-external-review-brief.md` / `fkit-external-review-report.md` — external review of the
  pre-Omnigent architecture that helped motivate the rewrite.
