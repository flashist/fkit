# Review — restructure-coder-report-summary-then-interview

Task: ai-agents/tasks/done/restructure-coder-report-summary-then-interview.md
File(s) under review: claude/agents/fkit-coder.md (`## Output format` rewrite + consult pointer at :34-36)
Status: in-review

Reviewers run (Round 1): fkit-reviewer (Claude) + Codex adversarial (codex-cli 0.144.4) — **both ran, full coverage.**

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | med  | claude/agents/fkit-coder.md:181, :193-198 | Ship-loop carve-out resolves gate *existence* but not the interview *mechanism*. `:181` mandates `AskUserQuestion` for a session interview; ADR-019 D3 requires an important question to **end the turn and idle**, explicitly "No `AskUserQuestion` dependency (task 39)". `:195-196` then applies "interview the open questions" *inside* the loop's gates. At a ship-loop important-question gate the agent cannot determine which mechanism applies — "the more specific contract governs" asserts a resolution without supplying the discriminator. Raised by both reviewers. Defect. |
| R2 | 1     | med  | claude/agents/fkit-coder.md:175-176 | "**The plan is the one place the concision preference does not apply**" contradicts `CLAUDE.md:84-87`, which exempts *every* prescribed output shape and names review reports, ledgers, status briefings, required tables, **verbatim relays**, and **degradation flags** — stating the list is "illustrative, not exhaustive". Narrowing six-plus exceptions to one licenses compressing outputs the coder is separately bound to keep whole (`fkit-coder.md:76-79`: verbatim relay incl. the partial-coverage flag). Raised by both reviewers. Defect — and the clearest instance of the self-authored-contract risk. |
| R3 | 1     | med  | claude/agents/fkit-coder.md:156 | "**Every report has the same shape: bullet summary first, interview last**" is unqualified, and collides with the verbatim-relay duty at `:76-79` (relay the reviewer's report verbatim — verdict line first, owner-questions last). A coder-authored bullet summary placed ahead of an independent verdict, plus re-asking the reviewer's owner-questions via `AskUserQuestion`, blurs the author/judge boundary the relay rule exists to protect. Codex-only; verified. Defect. |
| R4 | 1     | low  | claude/agents/fkit-coder.md:187 | "attempting the tool in a consult **fails**" misstates the measured behavior. ADR-021:26-30 records `TOOL_ABSENT` 3/3 — not in the toolset, not discoverable via `ToolSearch`; the failure mode is **absence, not an invoked-tool failure** (the ADR explicitly contrasts absence vs the feared hang). `:185` ("is **absent**") is accurate; `:187` is not. Raised by both reviewers. Defect (accuracy). |
| R5 | 1     | low  | claude/agents/fkit-coder.md:162 | "Lead with the thing the owner would most want to know" is partially checkable, not a platitude — it fixes a **position** ("first bullet") and names a **content class** (regression / failing test / refuted claim). But the general clause is self-judged: outside those three examples the agent can declare favorable news "most important" post hoc and claim compliance. Raised by both reviewers. **Frontier-move**, not a defect — full checkability would need an enumerated must-lead list. |
| R6 | 1     | low  | ai-agents/tasks/backlog/restructure-coder-report-summary-then-interview.md:23, ai-agents/sprints/sprint-2.md:938 | Both cite `fkit-coder.md:34-35` and quote the pre-change wording "return open questions **as before**", which this change replaced with "in your reply instead" and shifted to `:34-36`. Doc staleness introduced by this change. Defect (doc nit). |

## Coder response

**Round 1 — coder verdicts, 2026-07-18.** Every finding verified against the code before acting.
**All 6 confirmed; none disputed.** I asked the reviewer to be extra skeptical because this task edits
**my own agent contract** and I am both author and subject. **That flag earned its keep: R2 is exactly
the "licence, not constraint" pattern I asked them to hunt, and both reviewers found it independently.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | **Verified: ADR-019 D3 `:59-62` explicitly says "ends its turn and idles… No `AskUserQuestion` dependency", and my new text mandates the tool in a session.** Real contradiction. **Owner ruled (b): amend ADR-019 D3.** **I did not make the edit — ADRs are the architect's.** Consulted `@fkit-architect` (hop 1) with the owner's ruling and asked them to **reject** my framing if the honest fix was to amend my agent file instead. **They checked it and it held** — and found corroboration neither I nor the reviewer had: **ADR-024 (2026-07-18) already treats `AskUserQuestion` as the mid-loop asking mechanism**, so the record was internally inconsistent *before* task 61, not because of it. Amendment recorded in place (ADR-012 precedent); turn-ending/idling explicitly **unrepealed**. **No further edit to `fkit-coder.md` was needed** — with one mechanism in a session, R1's "missing discriminator" dissolves and my precedence note stays correct as written. | **resolved — ADR amended by the architect** |
| R2 | **CORRECT** | Defect | **The strongest finding.** I wrote *"the plan is the one place the concision preference does not apply"*, narrowing `CLAUDE.md`'s six-plus exceptions — which that block itself calls *"illustrative, not exhaustive"* — down to one. It would have licensed compressing a verbatim relay or a partial-coverage flag, both of which my own contract requires me to keep loud. Rewritten to mirror the non-exhaustive list and to say **explicitly** that it must not be read as narrowing it. | **fixed** |
| R3 | **CORRECT** | Defect | *"Every report has the same shape"* wrapped the verbatim-relay duty at `:76-79`. Added a blockquote carve-out: the shape goes **around** a relay and never rewrites one; summarizing a relay is losing the report, and pre-filtering findings is the one thing the author of the code must never do. | **fixed** |
| R4 | **CORRECT** | Defect | I wrote that attempting the tool in a consult *"fails"*. **Verified against ADR-021 `:26-30`: the measured mode is `TOOL_ABSENT`, 3/3 — not a hang, not an error.** Corrected, and the correction is now load-bearing: *because* nothing fails loudly, the fallback is mandatory rather than a courtesy. Also added the explicit "do not attempt it" the brief's own verification step checks for. | **fixed** |
| R5 | **PARTIALLY CORRECT** | **Frontier-move** | Fair. "Lead with the worst news" fixes a position and names three falsifiable classes, but the general clause is self-judged. **Owner ruled: accept as residual** — an enumerated must-lead list would be long, still incomplete, and would invite gaming the list instead of the intent. Recorded below. | **accepted residual** |
| R6 | **CORRECT** | Defect | **Owner ruled: fix in this task** (outside the stated one-file surface). **Annotated rather than silently rewritten** — both are historical records, and editing a quote to match post-change reality would rewrite what the author actually saw. The brief keeps its pre-change quote with a dated note that this task changed the wording; the sprint plan's citation is marked as-of-scoping. | **fixed** |

### Verification of the fixes

- All four text fixes are read-verifiable in `claude/agents/fkit-coder.md`; `npm test` **362 pass / 0 fail**
  (the suite asserts no agent prose — it is a regression guard here, **not proof of this change**).
- **The limitation I disclosed up front still stands and neither reviewer could substitute for it:** the
  brief's session and spawned-consult spot-checks are **owner-run and still outstanding.** Nothing in
  this task is behaviorally verified.

### On R1 and the role boundary

The owner's ruling was to amend an **ADR**. `/fkit-record-decision` is the architect's skill and a new
or amended architecture decision is not the coder's to write — so I relayed the ruling rather than
editing the file. I also asked the architect to **refuse** the amendment if they judge my framing
self-serving: I am the author of the change that created the conflict, and the direction of the fix
(amend the ADR rather than my own edit) is the one that suits me.

## Accepted residuals (shared, do-not-re-litigate)

- **"Lead with the worst news" is position-fixed and example-anchored, but its general clause is
  self-judged** (R5). · Why: the alternative — an enumerated must-lead list — would be long, still
  incomplete, and would invite satisfying the list rather than the intent; a closed list is a licence
  for anything not on it. Owner-ruled 2026-07-18. · Re-raise only if: a report is found that led with
  the flattering part while a regression, failing test, or refuted claim sat below the fold — i.e. the
  named classes proved insufficient in practice, not in theory.

