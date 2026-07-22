# Review — 0110-evolve-fkit-lead-into-orchestrating-conductor

Task: ai-agents/tasks/done/0110-evolve-fkit-lead-into-orchestrating-conductor/brief.md
File(s) under review: claude/agents/fkit-lead.md (canonical; .claude/agents/fkit-lead.md copy verified synced)
Status: closed-out

## Reviewer findings
| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1     | low | claude/agents/fkit-lead.md:54 (also :8, :15) | Advertises `/fkit-sprint-ship-loop` as a runnable flagship driver, but the skill does not exist (built in 0111) and lead does not own it in `skills-for-role.sh:37` (wired in 0112). Faithful to design §4.1/§4.2/§6.3 and inherent to the T2-before-T3 sequencing — a cross-task coupling, not a defect in this file. Guard: do NOT commit/ship 0110 alone; it is coherent only once 0111+0112 land. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT — verified: fkit-lead.md names `/fkit-sprint-ship-loop` before 0111 builds it / 0112 wires it. Faithful to design §4.2/§6.3 (name it as the flagship in lead's prompt). | Frontier-move (cross-task sequencing) | **No code change** — hedging the name would fight the design. The coupling was **owner-approved at the consolidated 0110–0113 plan gate** (which sequences these together) and all four ship in one session, uncommitted, so the "don't ship 0110 alone" guard is honored by construction. | resolved (accepted residual) |

## Accepted residuals (shared, do-not-re-litigate)
- **fkit-lead.md names `/fkit-sprint-ship-loop` before it is built/wired** — *What:* the evolved lead
  advertises the flagship driver skill; *Why (structural):* design §11 sequences T2 (this file) before
  T3 (0111 build) + T4 (0112 wire), and §4.2/§6.3 direct naming it in lead's prompt — the owner approved
  this decomposition at the consolidated 0110–0113 plan gate; *Re-raise only if:* 0110 is committed or
  the sprint ships **without** 0111+0112 landing in the same change (in this session all four land together).
