# Review — 0248

Task: ai-agents/tasks/backlog/0248-update-the-docs-for-the-structure-check-capability/brief.md
File(s) under review: ai-agents/knowledge-base/architecture.md · README.md · ai-agents/README.md · claude/scaffold/ai-agents/README.md · claude/README.md · claude/agents/fkit-producer.md · claude/structure-manifest.tsv (+ worklog.md as context)
Status: closed-out

> Round 2 (2026-08-07, reviewer): both fixes verified against docs and code; R1's flow-7-only
> placement accepted (matches the Round-1 finding's own read — the README sentences are summaries
> whose corrective, `/fkit-heal`, sits in the same sentence). No new findings; no residuals to
> record. Manifest re-verified: Round-1 blob row replaced by the re-edited scaffold README's hash;
> structure-manifest + dual-home-parity suites 14/14.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | README.md:35 (also ai-agents/knowledge-base/architecture.md:426-427, claude/scaffold/ai-agents/README.md:43-44, ai-agents/README.md:31-32) | Docs state a launch "tells you" when structure diverges, without the shipped best-effort caveat: `structure_notice()` self-silences non-fatally when `check.sh` is absent from the share, bash is unavailable, the checker exits outside 0/1, or both awk filter attempts fail (claude/fkit-claude.sh:435-440, 482-485 — each a deliberate never-cost-the-session contract). An owner may read notice-absence as proof of conformance. One "best-effort" clause in architecture.md flow 7 (the technical doc) would close it; the user READMEs are arguably fine as summaries. Raised by both reviewers. |
| R2 | 1 | nit | claude/scaffold/ai-agents/README.md:44 | "a launch prints one line naming any paths that diverge" — literally false above three divergences: the line names at most 3 paths then "+N more" (claude/fkit-claude.sh:471-477; pinned by test/structure-notice.test.js:326-343). Blast radius is tiny — the actual line shows the "+N more" tail, so the reader is corrected at the moment it matters. `ai-agents/README.md:32` ("names diverging paths") and root README (no naming claim) are fine. Raised by both reviewers. |

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (doc accuracy; sev low, confirmed — worst case is a reader treating notice-absence as conformance) | Best-effort clause added to architecture.md flow 7's launch-notice bullet (self-silencing paths named: `check.sh` absent, no bash, checker exit outside 0/1; filter failure drops suppression, never the notice; "notice-absence is not proof of conformance — `/fkit-heal` is the diagnostic"). READMEs left as-is, per the reviewer's own read: they are summaries whose corrective (`/fkit-heal`) sits in the same sentence; precision lives in architecture.md. | ✅ done |
| R2 | CORRECT | Defect (doc accuracy; sev nit, confirmed — the printed line self-corrects at read time) | Scaffold README "naming any paths that diverge" → "naming paths that diverge … (the first three, then \"+N more\")", matching `fkit-claude.sh` + `structure-notice.test.js:326-343`. Live twin (`ai-agents/README.md:32` "names diverging paths") and root README verified — neither claims exhaustive naming; scaffold home only, no byte-alignment (audience-adapted pair). Manifest regenerated in the same change (one added row: `ai-agents/README.md`); structure-manifest test A watched red before regen, green after. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)

- (none yet)
