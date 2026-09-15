# Review — 0221

Task: ai-agents/tasks/done/0221-repair-0194s-false-0190-clause-does-not-exist-premise/brief.md
File(s) under review: ai-agents/tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md (working tree vs HEAD, +31/−3; every other dirty file in the tree is out of scope)
Status: closed-out
Coverage: both reviewers measured — round 1: Codex (`codex-cli 0.152.0`, exit 0) ran a CommonMark parser (`markdown_it`, `commonmark` preset) over the premise-3 excerpt and SHA-256-compared both stripped quotes against their sources; the Claude reviewer ran the same parser over the whole `0194` brief (one ordered list, three items, each quote a single blockquote inside its item) and `cmp`-compared both stripped quotes against `claude/scaffold/universal-rules.md` and `claude/skills/fkit-sprint-ship-loop/SKILL.md` (identical).

## Reviewer findings
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|

_Round 1 (2026-09-15): no findings from either reviewer. Checked and confirmed: premise 1 still true (`test/skill-ownership-sites.mjs` absent; `0189` in `backlog/`, "🔲 Backlog"); `0190` and `0191` folders in `ai-agents/tasks/done/`; the heading names "## Universal hard rules (every role, every session)" and the clause is its final bullet; the `0191` clause sits under "## Hard rules"; the dates match the done worklogs (`0190` "Date: 2026-08-04"; `0191` plan approved "on 2026-08-04, before any source was written"); both blockquotes are byte-exact after stripping the "   > " prefix; zero hits for "clause does not exist", including across line breaks; the open-prerequisite count ("one still open (`0189`)") agrees across the heading, the new dated note, and both `0306` corrections in "## Notes"; `git diff -U0` shows only two hunks (heading + note, premises 2–3), so the "Depends on" line, Status/Owner/Priority, premise 1 and the append-rank flag are untouched; the old heading had no inbound anchor links._

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|

_Round 1 (2026-09-15, `fkit-coder` as the `fkit-sprint-ship-loop` Process-review worker): no reviewer findings, so no rows. Nothing to verify, no fix applied, no residual added. Settled-decision check: Accepted residuals empty; ADR-036, ADR-037 and ADR-044 skimmed — no finding to match against them. Header set to Status: closed-out._

## Accepted residuals (shared, do-not-re-litigate)
