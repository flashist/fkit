# Review — 0222

Task: ai-agents/tasks/done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/brief.md
File(s) under review: ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md; ai-agents/tasks/done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/worklog.md
Status: in-review

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | med | ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md:64 | §Options' "(c) Detector only … by itself leaves the rule unstated" re-asserts the construction the source report's R8 correction explicitly retracted (report:259-267, :614, :620 — the brief's third option already includes stating the row's role and its reason; "the reasoning must not claim (c) abstains"). The report's corrected reason (c)-alone fails is the unenumerated method cell (report:252-254), not an unstated rule. Raised by Codex; verified CONFIRMED. |
| R2 | 1 | med | ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md:85 | Consequences' "every current and future loop step has a derivable owner — look up the step's skill" is false for two of six current sprint-loop steps: Build and Verify name no skill (claude/skills/fkit-sprint-ship-loop/SKILL.md:121-122), so the lookup cannot resolve them; the Re-raise clause covers "skill has no owning role" but not "step runs no skill". Raised by Codex; verified CONFIRMED. |
| R3 | 1 | low | ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md:19 | §Context's "sprint/task loop drivers spawned the wrong role … on three consecutive tasks" pluralizes/widens the incident: 0200's brief (lines 32-35) records ONE fkit-sprint-ship-loop driver run (2026-08-02, tasks 0158/0143/0195); no task-loop incident is on record. "Three consecutive tasks" is accurate. Mirrors the approved plan's wording, but the primary record is singular. Raised by Codex; verified PARTIALLY CORRECT. |

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Reworded §Options (c): failure of (c)-alone is now the unenumerated *"apply … method"* cell (report:252-254), with the R8 correction noted — the "leaves the rule unstated" construction removed. Decision unchanged ((a) + (c) companion). | ✅ done |
| R2 | CORRECT | Defect | Narrowed Consequences' Positive to "every loop step that runs a skill", naming Build and Verify as skill-less steps whose roles come from the loop's enumerated table; extended Re-raise bullet 3 to cover a step that runs no skill and whose row does not name its role (driver-routed, within the decision's intent). | ✅ done |
| R3 | PARTIALLY CORRECT | Defect | §Context incident recast to the record's single 2026-08-02 sprint-loop driver run (0200 brief:32-35); "three consecutive tasks" kept — that part was accurate. Plural "sprint/task loop drivers" mirrored the approved plan's shorthand; the primary record wins. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)

- ADR-038 quote-paired `path:NNN` citations — What: the ADR keeps its quote-paired `path:NNN` citations (`claude/skills-for-role.sh:48`, `SKILL.md:195`, `adr-037-…md:33`) as-is. · Why (structural): owner ruling via AskUserQuestion 2026-08-06, verbatim "Accept as-is (Recommended)"; the 0160 ruling (`reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md`) rules `path:NNN` correct for `claude/` files when paired with a quote/label — every hit is so paired; the dated `path@YYYY-MM-DD:NNN` form was not required. Rejected alternative: converting to the dated form (proposed via 0232's brief's claim, not found in 0160/0176). · Re-raise only if: a citation appears with a naked (unpaired) line number, or the 0160 ruling is superseded.
- Measured-truth Consequences — What: the ADR's Consequences state the 2026-08-06 measured fact (all six follow-ups filed, IDs and dates) and flag the brief's stale "not yet filed" bullet, rather than restating the brief. · Why (structural): owner ruling via AskUserQuestion 2026-08-06, verbatim "Measured truth (Recommended)". Rejected alternative: echoing the brief's 2026-08-05 wording. · Re-raise only if: a listed follow-up turns out not to be on disk, or the filing record changes.
