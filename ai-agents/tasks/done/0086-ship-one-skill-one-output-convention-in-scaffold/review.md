# Review — ship-one-skill-one-output-convention-in-scaffold

Task: ai-agents/tasks/backlog/ship-one-skill-one-output-convention-in-scaffold.md
File(s) under review: claude/scaffold/ai-agents/knowledge-base/conventions/one-skill-one-output.md (new), claude/scaffold/ai-agents/knowledge-base/conventions/README.md (edit)
Status: in-review

Verdict (Round 1): ⚠️ Changes requested — 1 defect (low, non-blocking). Full coverage: own pass + Codex adversarial pass (codex-cli 0.144.4) both ran; the two converged on the same single finding.

## Reviewer findings
| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1     | low | claude/scaffold/ai-agents/knowledge-base/conventions/README.md:51-52 | Stale count exposed by the change: "What's here" preamble now says "Four conventions ship" (README.md:25) while the bar-for-adding-one bullet 4 still says "Prefer amending an existing convention to adding a **fourth** document" — with four now shipped the next is a fifth. Raised by both reviewers. Inherited from the live README (ai-agents/knowledge-base/conventions/README.md:51, same wording, also unfixed) — a scaffold-only fix would create a trivial live-vs-scaffold wording divergence. Low, non-blocking, borderline out-of-scope; disposition is the owner's. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (cosmetic) | Verified: scaffold README:52 read "adding a **fourth** document" while the preamble now ships four — off-by-one; the live README carried the identical latent wording. Owner disposition (option: count-proof both) → changed "a fourth" → "**another**" in **both** `claude/scaffold/…/conventions/README.md` and `ai-agents/…/conventions/README.md`. This makes the wording count-proof (never goes stale), fixes the pre-existing live latent bug too, and preserves live↔scaffold parity. **Scope note:** the live-README edit is outside the plan's `claude/scaffold/`-only boundary; applied only after explicit owner approval. Re-verified: 0 "a fourth" hits in either file; clean-init still ships four conventions, `one-skill-one-output.md` byte-identical to source. | Fixed |

**Convergence:** Round 1 closed-out. Single low defect fixed with owner sign-off; the de-repo-specification is recorded as an accepted residual above. Last verify green. No further round required (matches the reviewer's act-or-accept-then-closeout call). Coder side complete — ready for the owner's done-gate.

## Accepted residuals (shared, do-not-re-litigate)
- De-repo-specification of the scaffold convention — What: the scaffold copy of one-skill-one-output.md strips the dated-ruling intro to the generic "starting convention, yours to amend" blurb, drops `## History` and `## Provenance`, generalizes `## Where this must be enforced` → `## Where this is enforced`, and de-specifies repo refs (removes "(Per task 44's brief.)", the `claude/skills/*/SKILL.md` path, the self-referential "must be added to scaffold" bullet), while preserving the History section's *lesson* in a new generic `## Why the escape hatch exists`. · Why (structural): owner-approved at the plan gate; matches the precedent of the three already-shipped scaffold siblings (evidence-before-assertion / task-status-vocabulary / status-report-format) and intentionally supersedes the brief's narrower "diff is exactly those links and nothing else" wording. · Re-raise only if: a normative rule or litmus-test line present in the live doc is found dropped from the scaffold copy (none was), or repo-specific residue is found leaking in.
