# Review — give-every-agent-direct-wiki-query-access

Task: ai-agents/tasks/backlog/give-every-agent-direct-wiki-query-access.md
File(s) under review: branch `give-every-agent-direct-wiki-query-access` vs `origin/main` (26 files;
3 commits: "Sprint update", "Tasks update", "Bringing wiki-query back to all agents") — implements
ADR-005 (ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
Status: in-review

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | omnigent/fkit-coder/skills/plan-task/SKILL.md:22-23 | `plan-task` Step 3 still says "Do not read `ai-agents/wiki-vault/` directly... delegate a lookup to the fkit-wiki agent," contradicting the coder's own rewritten config.yaml (ADR-005: read directly via own `query` skill). `plan-task` is the coder's standard first step on every non-trivial task, so this is the highest-frequency path left on the old two-hop consult chain the PR set out to reduce. |
| R2 | 1     | medium | omnigent/fkit-architect/skills/inspect/SKILL.md:30 | `inspect` Step 0 still says "delegate a lookup to the fkit-wiki agent... rather than opening `ai-agents/wiki-vault/` yourself" for a wiki *read*, contradicting the architect's rewritten config.yaml. `inspect` is the architect's primary research skill. (Note: lines 14-15 and 90 in the same file are correctly worded — those are about wiki *writes*, which ADR-005 keeps fkit-wiki-exclusive.) |
| R3 | 1     | medium | omnigent/fkit-producer/skills/initiate-project/SKILL.md:56-58 | `initiate-project` Step 2 ("Check for prior knowledge (via fkit-wiki)") still tells the producer to spawn fkit-wiki for a read, contradicting the producer's rewritten config.yaml. Lower-frequency flow (only runs once, at project init) than R1/R2. |

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|--------------------| -------|--------|
| _(none yet — awaiting fkit-coder)_ | | | | |

## Accepted residuals (shared, do-not-re-litigate)

_(none yet)_
