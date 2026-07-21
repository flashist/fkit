# Review — grant-askuserquestion-tool-to-six-claude-agents

Task: ai-agents/tasks/backlog/grant-askuserquestion-tool-to-six-claude-agents.md
File(s) under review: claude/agents/fkit-{producer,coder,architect,reviewer,wiki,lead}.md (+ gitignored .claude/ regen)
Status: closed-out (Round 1) — owner dispositions recorded; only outstanding gate is the owner-session AskUserQuestion spot-check

## Reviewer findings
| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | low  | claude/agents/fkit-wiki.md:26, claude/agents/fkit-lead.md:42 | Verbatim note's "return open questions as before" has no antecedent in wiki (a leaf that consults no one) or lead (no prior "open questions" phrasing) — loose fit. Text is task-prescribed verbatim; owner wording call, not a coder defect. Frontier-move. |
| R2 | 1     | low  | working tree (scope) | Working tree carries unrelated uncommitted changes beyond the six agent files — ai-agents/sprints/sprint-2.md (git-agent addendum) + 2 untracked git-agent task briefs. Coder's "git diff --stat touches only the six" verification no longer matches the tree; a blind commit would sweep unrelated work. Commit-scope hygiene, not a defect in the change. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Frontier-move | Verified: `fkit-wiki.md` (leaf — "consult no one", no prior "return open questions" text) and `fkit-lead.md` (consult bullet, no prior "open questions" phrasing) — the loose-antecedent observation is accurate. Text is task-prescribed verbatim; owner ruled keep as-is. No code change. Recorded as an accepted residual. | won't fix (frontier) |
| R2 | CORRECT | Not a defect (commit hygiene) | Accurate at review time — tree carried unrelated git-agent files (`sprint-2.md` + 2 untracked briefs). Owner committed them separately; `git status` now shows the tree scoped to task 54 only (6 agent files + architecture.md + README.md). No code change. | ✅ done |

## Round 1 dispositions (owner-decided, reviewer-recorded)
| #  | Owner ruling | Outcome |
|----|--------------|---------|
| R1 | Keep verbatim note text as-is (owner wording call). | Resolved → moved to Accepted residuals; do not re-litigate. |
| R2 | Owner committed the unrelated git-agent files separately; working tree now scoped to task 54 only. | Resolved. |
| Wiki-sync open Q | Do NOT touch `ai-agents/wiki-vault/`; instead update the stale source docs enumerating per-agent tool allowlists so the next wiki-sync propagates automatically. | Resolved — no wiki-sync task needed now. |

## Scope change since Round 1 (new edits, verified)
In response to the wiki-sync disposition the coder added `AskUserQuestion` to the six session-capable
agent rows (adversarial reviewer excluded) of two source tool-allowlist tables. Verified against the diff:
- `ai-agents/knowledge-base/architecture.md` (`tools` allowlist table): AskUserQuestion added to
  producer, coder, architect, reviewer, wiki, lead. `fkit-adversarial-reviewer` row unchanged
  (`Read, Grep, Glob, Bash, Skill`). Exactly six — correct.
- `claude/README.md` (abbreviated tool table): same six get AskUserQuestion; adversarial-reviewer row
  unchanged (`Read, Grep, Glob, Bash`). The table's deliberate `Skill` omission preserved (no `Skill`
  in any row); only `AskUserQuestion` added — correct.
Additive doc-table edits mirroring the already-reviewed frontmatter grant. No new findings.

## Closeout
Closed-out for Round 1. No open defects; R1/R2 and the wiki-sync question all disposed. Findings would
now re-litigate settled residuals rather than surface defects — convergence reached. Sole remaining
validation gate: the owner-session `AskUserQuestion` spot-check (a live-runtime check, outside review scope).

## Accepted residuals (shared, do-not-re-litigate)
- AskUserQuestion is session-only, absent in consults — What: tool granted to six session-capable agents; consult "return open questions" contract unchanged · Why (structural): measured 3/3 TOOL_ABSENT in spawned consults on Claude Code 2.1.212, settled ADR-021 Decisions 1–2 · Re-raise only if: the Claude Code version changes the consult tool surface.
- fkit-adversarial-reviewer excluded — What: seventh agent gets no grant, file byte-identical · Why (structural): runs review on Codex (`codex exec`), which has no AskUserQuestion; findings-only leaf (ADR-021 Decision 3) · Re-raise only if: the adversarial reviewer stops running on Codex.
- No skills-for-role / mirror-table change — What: no `claude/skills-for-role.sh`, `fkit-team`, or `README.md` edit · Why (structural): this is a `tools:`-frontmatter grant, not a skill; mirror tables track skills only (ADR-010/012) · Re-raise only if: agent `tools:` allowlists become skill-tracked. · NOTE (Round 1 disposition): the two *tool-allowlist* doc tables (architecture.md, README.md) were subsequently updated to mirror the grant — that is a tools-table sync, not a skill mirror-table change; this residual still holds for skill mirrors.
- R1 — verbatim note wording ("return open questions as before") — What: task-prescribed verbatim text with loose antecedent in wiki/lead prompts · Why (structural): owner ruled keep as-is (owner wording call, not a coder defect); frontier-move · Re-raise only if: the verbatim note source text itself is changed.
