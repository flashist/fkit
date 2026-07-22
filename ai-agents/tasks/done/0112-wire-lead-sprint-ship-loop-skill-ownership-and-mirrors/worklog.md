# Worklog — 0112 wire fkit-sprint-ship-loop into skills_for_role + 4 mirrors + test

Ship-loop (consolidated 0110–0113 plan). Depends on 0111 (skill exists — Done, agent-closed).

## Change surface
- `claude/skills-for-role.sh:37` — lead gains `fkit-sprint-ship-loop`.
- 4 mirrors (checklist `skills-for-role.sh:12-24`): `fkit-team/SKILL.md`, `claude/README.md`,
  `claude/scaffold/CLAUDE.md`, `ai-agents/knowledge-base/architecture.md` (skills_for_role row only; 0115 owns the prose).
- `test/skill-ownership-hook.test.js` — lead owns it (allow) / non-lead denied (JSON deny pinned).
- Dual-home parity check.

## Progress
- [x] Plan approved, persisted; status → 🔄 In progress
- [x] Edit skills-for-role.sh:37 (lead gains it) + all 4 mirrors
- [x] Add hook test (lead allow / coder deny, JSON deny pinned)
- [x] Verify — all green
- [x] Review — reviewer's own pass CLEAN; R1/R2/R3 fixed; **Codex coverage NOT model-diverse (3/3 attempts non-converging)**
- [x] Close — agent-closed, **owner-ruled** on the single-reviewer pass (2026-07-22); flagged NOT model-diverse

## ⚠️ Close posture (owner-ruled)
0112 is a **degraded run: no completed Codex model-diverse pass** (round 1 timed out ×2; rounds 2–3 ran
genuine passes that found nothing new but never converged to a verdict — a persistent tooling-environment
limitation, not a code defect). The loop bars me from self-closing this; the owner ruled (2026-07-22) to
**close on the verified single-reviewer (Claude) pass**, agent-closed, with this flag recorded. The
deliverable is verified clean: skills_for_role lead-only, four mirrors accurate (R1/R2/R3 count/table/SSOT
drift all closed), hook untouched, tests 453/0.

## Review outcome (2 rounds)
- **Reviewer's own (Claude) pass: clean** — skills_for_role lead-only, hook untouched, four-mirror checklist satisfied, test shape correct (allow-lead/deny-others, JSON deny pinned). No code/behavior defect.
- **⚠️ Codex coverage: PARTIAL / NOT model-diverse.** Round 1: `codex exec` timed out ×2 (exit 143). Round 2 (retry): Codex ran a genuine independent pass (traversed the diff, verified skills_for_role lead-only + hook untouched, scanned every `⛔ Owner:` banner + ADR context) and **emitted no new defect**, but did **not converge to a findings verdict** within ~24 min (capped). So there is meaningful-but-incomplete Codex signal — it examined the change and found nothing — but no completed model-diverse verdict.
- **Findings, all resolved:** R1 (architecture.md:68 count `21→25`), R2 (§4.2 table `task-plan→task-brief`, `+task-ship-loop` → 25 real skills), R3 (SSOT pointer `fkit-claude.sh:199-210` → `skills-for-role.sh:35`). All three are architecture.md skill-ownership/count/SSOT accuracy — 0112's core mandate; fixed autonomously (mechanical, in-scope).

## FYI (not 0112's — flagged so it isn't lost)
- The reviewer noted `fkit-sprint-ship-loop/SKILL.md:3` uses `# ⛔ Owner: the lead` while every other skill uses the `> ## ⛔ Owner: the **<role>**` blockquote form. Cosmetic banner-format drift in **0111's** deliverable; harmless to the hook. Recommend a tiny follow-up (or fold into a doc pass).

## Brief `## Verification steps` — walked
1. ✅ `skills-for-role.sh:35/37` lists `fkit-sprint-ship-loop` for lead only.
2. ✅ All four mirrors reflect it; the `:12-24` checklist satisfied (no mirror left stale — R1/R2/R3 closed the architecture.md count/table/SSOT drift).
3. ✅ Hook test asserts allow-for-lead / deny-for-all-others with the JSON deny shape pinned; suite green (211/0 hook, 453/0 full).
4. ⚠️ **Dual-home parity: no dedicated ADR-027 test exists** (mechanical test unbuilt per `dual-home-parity.md`); manual `diff -rq` shows only pre-existing divergences, none from 0112.

## Change surface (source)
`claude/skills-for-role.sh`, `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`, `ai-agents/knowledge-base/architecture.md`, `test/skill-ownership-hook.test.js`. `.claude/` copies synced.

## Commit state
- Nothing committed. All edits in the working tree.

## Verification evidence
- V1: `skills-for-role.sh:37` lead line lists `fkit-sprint-ship-loop`; appears **once** (lead only).
- V2: all 4 mirrors updated — `fkit-team/SKILL.md` (procedures row), `claude/README.md` (procedures row + tools/description), `scaffold/CLAUDE.md` (lead prose), `architecture.md` (§4.2 added a `lead | sprint-ship-loop` row + counts 21→25 dirs / 24→25 skills). **architecture.md role-NATURE prose (line 105 "Routes rather than does", §5.2 stale-lock) left for 0115 per the brief's coordination.**
- V3: `test/skill-ownership-hook.test.js` — new "lead owns fkit-sprint-ship-loop → allow" + "non-lead → deny" (JSON deny shape pinned via assertDeny + `/does not own skill 'fkit-sprint-ship-loop'/`). Hook suite **211/0**; full suite **453/0**.
- V4: **dual-home parity** — no dedicated ADR-027 test exists (mechanical test unbuilt per `dual-home-parity.md`); manual `diff -rq ai-agents/ claude/scaffold/ai-agents/` shows only **pre-existing** divergences (ai-agents/README.md, conventions/README.md), **none introduced by 0112**. None of 0112's edited files is a dual-homed pair (skills-for-role.sh + fkit-team skill are single-home under `claude/`; architecture.md is project-specific/never-synced).

## Change surface (source)
`claude/skills-for-role.sh`, `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`, `ai-agents/knowledge-base/architecture.md`, `test/skill-ownership-hook.test.js`. `.claude/` copies synced.
