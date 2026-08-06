# Review — 0181

Task: ai-agents/tasks/done/0181-narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank/brief.md
File(s) under review: claude/skills/fkit-task-brief/SKILL.md (step 5 exception bullet), .claude/skills/fkit-task-brief/SKILL.md (managed copy)
Status: in-review

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | claude/skills/fkit-task-brief/SKILL.md — step 5, exception bullet, sentence anchored *"Concretely, standing at the board: never insert a new row where a `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row sits anywhere below the insertion point"* | The operable test states a necessary condition only; its inverse ("no closed row below → insertion OK") is a legalistic misreading the sentence invites, on e.g. an all-open board. The two categorical sentences before it do forbid the act unconditionally, so no legal reading permits it — verified PARTIALLY CORRECT (Codex's "contradicts ADR-035" is overstated). Note: the conditional shape is brief-mandated ("What to build" point 4), so this is residue of the brief's own wording, closable by one clarifying clause (e.g. "even where no closed row sits below, a new row still appends"). Raised by Codex; verified by reviewer. |

### Verified clear (round 1 — checked, no row)

- Managed-copy parity: `diff claude/... .claude/...` empty.
- ADR-035 relative link resolves from both homes (verified by both reviewers).
- Citation discipline: no `:NNN`, no bullet ordinals in the new text; *"the closed-row rule below"* is a directional word paired with the quoted-phrase anchor, matching the pre-existing *"The ban above"* style — cleared, not a finding.
- 0174-scenario walkthrough holds: eight `✅ Done` rows below the insertion point → act forbidden by name; owner ruling does not rescue; check-downward encodes the wrong-direction failure.
- Remedy + corollary present in-step; merit-statement reference resolves to the step's existing legacy requirement (owner-ruled "Reference" wording, 0179 untouched).
- No `claude/scaffold/` counterpart exists (independently confirmed: no skills there).
- `npm test` independently re-run by reviewer: 567/567 pass, 0 fail.

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | PARTIALLY CORRECT | Defect (low — wording residue of the brief-mandated conditional shape) | Fix applied under **owner ruling** (live lead session, 2026-08-06, verbatim: *"Fix — add clause (Recommended)"*) — not an autonomous call. One clause added to the step-5 exception bullet, directly after the operable test's parenthetical: *"That check names the worst case, not a permission: **even where no closed row sits below, a new row still appends — insertion is never the exception's to grant.**"* | Fixed (round 1) |

**Coder verification of R1 (independent, 2026-08-06):** confirmed against the working tree. The operable
sentence (*"never insert a new row where a `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row sits anywhere
below the insertion point"*) states a necessary condition only; its inverse
is readable as permission on an all-open board. Also confirmed the two categorical sentences before it
(*"…nothing more."* / *"It does **not** permit **inserting a new row mid-board**"*) forbid the act
unconditionally, so no legal reading permits it — Codex's "contradicts ADR-035" framing is overstated,
per the reviewer's own note. The added clause blocks the inverse reading at the sentence that invites it.
Constraints held: no `:NNN` citations, no bullet ordinals in the new text; closed-row bullet untouched;
wiki untouched. Managed copy refreshed via `claude/fkit-claude-init.sh .`; `diff claude/… .claude/…`
empty. Full suite NOT re-run by coder this round — the sprint driver re-verifies next (per its unit
contract).

## Accepted residuals (shared, do-not-re-litigate)

*(none yet — ADR-035's own "re-raise only if" conditions apply: closed-row rule up for revision, or a non-interleaved board shown. Its named-rejected options — leave-as-is, relax closed-row rule, formalize harder, revert 0174 — are closeout, not findings.)*
