# Review — 0128

Task: ai-agents/tasks/done/0128-add-adr-030-prose-half-to-universal-rules/brief.md
File(s) under review: claude/scaffold/universal-rules.md (working tree; two bullets appended to Output style)
Status: closed-out

Verdict (Round 1): ⚠️ Changes requested — 1 low defect (none blocking); 1 low finding re-litigates the settled design wording. Both reviewers ran (Claude + Codex, Codex available — full coverage).
Closeout (Round 1): ✅ Ready to merge. R1 fixed (pointer expanded to resolvable full path); R2 accepted as a bounded residual. Owner ruled both; no open defects. Re-verified: block 3733 B / 4096 (363 B headroom), budget test 3/3 pass. No re-run of passes.

## Reviewer findings
| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | low  | claude/scaffold/universal-rules.md:39 | Pointer `conventions/evidence-before-assertion.md` is a bare label with no resolvable target; real path is `ai-agents/knowledge-base/conventions/…`, unresolvable from CLAUDE.md/AGENTS.md at repo root. Every other citation in the codebase carries a real link target. Rule is stated inline, so comprehension is not blocked; the supplementary reference is just harder to follow. (Codex; verified CORRECT.) |
| R2 | 1     | low  | claude/scaffold/universal-rules.md:38 | "Never invent a next step **to fill it**" arguably narrows ADR-030 Decision 8's clause "never invent a next step" to filler-motivated invention. (Codex; verified PARTIALLY CORRECT / frontier — the phrase is the design §5.5 canonical draft reproduced verbatim, and the design labels the clause shorthand "never invent a next step".) |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT (doc-pointer) | defect (minor) | **FIXED** (owner: expand to full path): `conventions/evidence-before-assertion.md` → `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` — now resolvable. Re-measured: block **3733 B / 4096 → 363 B headroom (91.1%)**, still under cap; 511 pass / prove-red PASSED. | resolved |
| R2 | PARTIALLY CORRECT | frontier | **ACCEPTED as residual** (owner: keep design wording): "never invent a next step **to fill it**" is the design §5.5 canonical draft verbatim, naming the mandatory-section filler failure mode ADR-030 Dec 4 targets. Not softened. | accepted residual |

**Headroom (not a 0128 defect):** block at 91.1% (363 B left); owner directed a **follow-up** (compression pass / `RULES_MAX` revisit) — producer to file.

## Accepted residuals (shared, do-not-re-litigate)
- **R2 — "to fill it" scoping on the no-invent clause** — What: the prose keeps the design §5.5 canonical draft verbatim, "Never invent a next step **to fill it**, and never assert repo state you did not check this turn" (`claude/scaffold/universal-rules.md:38-39`). Why (structural): "to fill it" deliberately scopes the prohibition to the mandatory-section filler failure mode ADR-030 Decision 4 names; it is the owner-approved design wording, and the design labels the clause shorthand "never invent a next step". Rejected alternative: tightening to an unconditional "never invent a next step" — owner ruled keep the design draft. Re-raise only if: the "to fill it" scoping is observed to let an agent invent an unconditional next step it otherwise wouldn't (i.e. the narrowing causes a real miss).
- **Follow-up (not a residual, noted for continuity):** the emitted block sits at 91.1% of the 4096 cap (363 B left after R1's fix). Owner directed a producer follow-up (compression pass / deliberate `RULES_MAX` revisit) before the next cross-cutting rule. Not a 0128 defect.
