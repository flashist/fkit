# Review — 0504

Task: ai-agents/tasks/backlog/0504-answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn/brief.md
File(s) under review: working tree vs HEAD `1461196` — `claude/agents/fkit-{architect,coder,lead,producer,reviewer,wiki}.md`, `claude/scaffold/universal-rules.md`, `claude/scaffold/ai-agents/knowledge-base/conventions/{asking-the-owner.md,README.md}`, `ai-agents/knowledge-base/conventions/{asking-the-owner.md,README.md}`, `claude/skills/{fkit-sprint-ship-loop,fkit-heal,fkit-open-questions-interview}/SKILL.md`, `claude/turn-completion-hook.sh`, `claude/structure-spec.md`, `claude/structure-manifest.tsv`, `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md`, `test/{asking-the-owner-rule,turn-completion-hook,structure-check}.test.js`. Driver bookkeeping (`plan.md`, `plan-review.md`, `worklog.md`, the brief's Status, the Sprint 10 row) not under review.
Status: closed-out
Coverage: both reviewers measured — Claude ran 6 targeted test files (86/86 pass) and the Stop hook on two answer-turn payloads (no question line → allow; question line → block with the new REASON_A, valid JSON); Codex (`codex-cli 0.157.1`, exit 0) ran `node --test test/asking-the-owner-rule.test.js test/turn-completion-hook.test.js test/structure-check.test.js` → the new guard 8/8 pass, the other two files EPERM on `mkdtemp` (read-only sandbox), and its three findings themselves rest on reading.

## Reviewer findings
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1     | low  | claude/agents/fkit-lead.md:137; claude/skills/fkit-heal/SKILL.md:117-118 | Two D8 sentences say "answer it, re-ask" / "answer it and ask again" with no "on the owner's next message" — the only two sites where the re-ask timing reads as same-turn, against D2 (owner-ruled Q1). Both are read in a session whose role prompt carries the full *Asking the owner* paragraph (next-message rule), so it is ambiguity, not a contradiction; no write-safety leak ("spawn no writer" / "not consent" hold). Raised by both. |
| R2 | 1     | low  | test/asking-the-owner-rule.test.js:106-110 | The guard pins D8 in lead / coder / sprint loop / interview but not `fkit-heal` step 4, whose "not consent" clause is the one consent gate on a file-writing apply step; a lost or weakened clause there goes unnoticed. Plan step 10 did not list heal, so this is a coverage gap beyond the approved test surface. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (low — wording ambiguity; both sites are read in sessions whose role prompt carries the next-message rule, and neither weakens "not consent" / "spawn no writer") | `claude/agents/fkit-lead.md` *Spawning a coder to write* bullet: "answer it, re-ask" → "answer it in chat, re-ask on the owner's next message"; `claude/skills/fkit-heal/SKILL.md` step 4: "answer it and ask again" → "answer it in chat and re-ask on the owner's next message" (re-wrapped, no other word changed). Sprint loop's Plan row already defers to §3 step 2 (D2 wording) — left. Pinned: new test arm `c. lead: the D8 re-ask waits for the owner's next message` + the heal arm below. | ✅ done |
| R2 | CORRECT | Defect (low — test-coverage gap; D8 says "Pinned by the new test" and lists heal step 4 among its sites, so this is in-plan intent, not scope growth) | `test/asking-the-owner-rule.test.js`: new arm `c. fkit-heal step 4: a non-choice reply is not consent` pinning the "Explain more" label, "or a typed question, is not consent" and the next-message re-ask; `HEAL` constant; header comment names heal. Mutation check: weakening either the heal clause or the lead sentence turns its arm red (2/10 fail), restored → 10/10. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)
