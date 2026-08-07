# Review — 0243

Task: ai-agents/tasks/done/0243-author-the-structure-spec-md-and-its-scaffold-inventory-drift-test/brief.md
File(s) under review: claude/structure-spec.md, test/structure-spec.test.js (context: plan.md, brief.md, worklog.md; report 2026-08-06-design-post-update-structure-check.md §4/§6/§8 as the fidelity bar)
Status: closed-out

*Round 2 (reviewer re-verify, 2026-08-07): R1/R2/R4 fixes verified in code; suite re-run green
(7/7); R3 residual confirmed recorded with the owner-ruled re-raise clause ("0245 defines
classification precedence"). No new findings. Closed out.*

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | med  | claude/structure-spec.md:146 | Prose defines conforming for fkit-authored reference files as "content matches **a version fkit shipped**" — collapses *conforming* into *untouched-stale*, contradicting the spec's own six-class table (line 45: "content matches what the **installed version** ships"). A file matching an older shipped version is untouched-stale (repair-eligible), not conforming; this is the exact "conforming means" definition a 0245 builder reads. Raised by Codex, verified. |
| R2 | 1     | low  | claude/structure-spec.md:123-141 | §"Project root" carries report §8's check + report-only branches but omits §8's licensed branch: an untouched-stale owner body is eligible for **consent-gated replacement with markers and the current block preserved through the rewrite**. Only Table B's "owner body is the repair target" gestures at it. Omission, not contradiction; mechanics stay recorded in report §8 / ADR-039, which the spec cites. Raised by Codex, verified. |
| R3 | 1     | low  | claude/structure-spec.md:138-140 | "Markers absent … the whole file hashes against shipped bodies, and it **will classify owner-edited**" overstates: the manifest provably carries whole-file hashes of markerless omnigent-era root files (bin/generate-structure-manifest.mjs:33-34 "the omnigent-era root files really shipped that way"; 16 CLAUDE.md rows in structure-manifest.tsv), so a byte-untouched omnigent-era file matches a shipped hash and classifies untouched-stale under the manifest algorithm. Caveat: the sentence is carried verbatim from report §8 — the imprecision originates in the design report; resolution (classification precedence) belongs with §8/0245, not spec-only wording. Raised by Codex, verified against the generator. |
| R4 | 1     | low  | test/structure-spec.test.js:80 | parseInventoryTable resolves a heading via findIndex — first match, no uniqueness assert. A duplicated pinned heading would silently validate only the first table; a later (reader-visible) duplicate could drift unchecked — the decoy-table failure class this parser exists to close. Bounded: the first table is still ground-truth-checked, and duplicating a pinned heading is a visible editing accident. One-line hardening (assert the heading occurs exactly once). Raised by Codex, verified. |

## Coder response

*Round 1 processed 2026-08-07 by fkit-coder (sprint-ship-loop Process-review worker). Owner rulings
relayed by the driver (AskUserQuestion, live lead session, 2026-08-07), verbatim: R1+R2+R4 → "Fix
now (Recommended)"; R3 → "Accepted residual (Recommended)". All four findings verified against the
code before acting.*

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (doc contradiction) | Reworded structure-spec.md §`ai-agents/` prose: conforming = matches what the **installed** version ships (per the six-class table); older-shipped match = untouched-stale, repair-eligible (design §7, ADR-039), not conforming | ✅ done |
| R2 | CORRECT | Defect (omission of licensed branch) | Added report §8's branch to the owner-side-body bullet: untouched-stale body **eligible for consent-gated replacement** (design §8, ADR-039), markers + current fkit-managed block preserved through the rewrite | ✅ done |
| R3 | CORRECT | Frontier (imprecision originates in report §8; verified against bin/generate-structure-manifest.mjs + the 16 whole-file CLAUDE.md manifest rows) | none — spec stays faithful to report §8 (and to the approved plan's Deliverable 1 item 6, which carries the same sentence); residual recorded below per owner ruling | won't fix (frontier) |
| R4 | CORRECT | Defect (parser hardening gap) | Heading-uniqueness assert in parseInventoryTable (0 → "heading not found", >1 → "duplicate spec heading", exactly-1 required) + negative fixture pinning the duplicate-heading refusal | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)

- **markers-absent classification wording (spec §"Project root")** — What: the spec keeps report
  §8's verbatim sentence — markers absent → the whole file hashes against shipped bodies → "will
  classify owner-edited" — although the manifest provably carries whole-file hashes of markerless
  omnigent-era root files (generator: "the omnigent-era root files really shipped that way"; 16
  `CLAUDE.md` rows), under which a byte-untouched omnigent-era file matches a shipped hash and
  classifies untouched-stale. · Why (structural): the imprecision originates in the design report
  §8, and the approved 0243 plan (Deliverable 1 item 6) mandates carrying §8 faithfully; resolving
  it means defining classification precedence, which belongs with the checker design (0245), not
  spec-only wording — rewording the spec ahead of its source of truth would fork spec from report.
  Owner ruling 2026-08-07: "Accepted residual (Recommended)". · Re-raise only if: 0245 defines
  classification precedence.
