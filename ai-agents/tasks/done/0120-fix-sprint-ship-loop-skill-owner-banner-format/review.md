# Review — 0120

Task: ai-agents/tasks/done/0120-fix-sprint-ship-loop-skill-owner-banner-format/brief.md
File(s) under review: claude/skills/fkit-sprint-ship-loop/SKILL.md (line 9, +1/−1)
Status: closed-out

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| —  | 1     | —   | —         | No findings. Both reviewers (Claude + Codex) returned clean on the scoped one-line change. |

**Round 1 — reviewers run:** own pass + Codex adversarial pass (`codex exec --sandbox read-only`,
scoped to the single file). **Both ran; coverage is complete.** Both returned zero findings.

**Verified against the code (not inherited):**
- `SKILL.md:9` — H1 is exactly `# Sprint Ship-Loop (lead side)`, the owner-approved string, mirroring
  the sibling `claude/skills/fkit-task-ship-loop/SKILL.md` H1 `# Task Ship-Loop (coder side)`.
- `SKILL.md:11` — the ⛔ owner blockquote `> ## ⛔ Owner: the **lead**` survives **verbatim**, with its
  whole ADR-012 advisory body (lines 11–18) unmodified. The one real risk of this change — deleting the
  wrong one of the two `⛔ Owner` lines — did not occur.
- `SKILL.md:1–7` — YAML frontmatter untouched; `name` and `description` byte-identical to HEAD.
- **ADR-018 hook impact: none, verified directly.** `claude/skill-ownership-hook.sh` reads its payload
  from stdin (`:55`), extracts `tool_name` / `skill` / `agent_type` from that JSON (`:93`, `:103`,
  `:119`), and decides by string-matching the skill **name** against `skills_for_role "$role"`
  (`:132–136`, sourced from `claude/skills-for-role.sh:39`). It never opens a SKILL.md file, so H1 text
  cannot reach the allow/deny decision.
- **House-convention claim: true.** All 25 `fkit-*` SKILL.md files carry a descriptive H1; **none** uses
  the owner banner as its H1. This file was the sole outlier before the change and now conforms.
  (The brief's count of "26" is off by one — 25 skill folders exist. Immaterial to the finding.)

**Test evidence — re-run, not inherited:** `npm test` → 521 tests / 521 pass / 0 fail, prove-red hard
gate **PASSED** (all 7 mutations red their named assertion). `node --test test/skill-ownership-hook.test.js`
→ 221 pass / 0 fail. Matches the coder's reported numbers exactly.

**Reviewer note (informational, no action required) — stale `.claude/` mirror.** The mirror
`.claude/skills/fkit-sprint-ship-loop/SKILL.md:9` still reads `# ⛔ Owner: the lead`; canonical and
mirror now differ on that one line, and it is the **only** drifted skill of the 25. Judged **correct and
inert**: the mirror is gitignored (never reaches git), the H1 has no behavioral effect (hook proven not
to read it; the skill listing is fed by frontmatter `description`), the ⛔ banner is present in **both**
copies, and `claude/fkit-claude-init.sh .` heals it on the next run. Stated plainly so it is not a
surprise: **the cosmetic fix is not yet live in running sessions**, which load from the mirror, until
that re-init happens. Classified a frontier-move, not a defect.

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
|    |         |                   |        |        |

## Accepted residuals (shared, do-not-re-litigate)

- **`.claude/` mirror lags canonical `claude/` between init runs** *(confirmed settled by owner ruling,
  2026-07-26)* — What: the gitignored mirror is
  refreshed only by `claude/fkit-claude-init.sh .`, so a canonical edit is not live in already-running
  sessions until re-init · Why (structural): the mirror exists so a session loads a stable snapshot;
  refreshing it mid-run would swap a running session's own instructions underneath it. Rejected
  alternative: auto-refresh on every canonical edit · Re-raise only if: a drifted mirror line carries
  **behavior** (not cosmetics), or the drift reaches a tracked, committed file.
  · Owner disposition: the owner was **explicitly told, and accepted**, that the 0120 H1 fix is **not
  live in already-running sessions** (including the session that ruled) until the next
  `claude/fkit-claude-init.sh .`.

## Round 1 disposition (owner ruling, 2026-07-26)

Verdict stands: **✅ Ready to merge — 0 defects**, both reviewers ran, coverage complete. Nothing in
`claude/skills/fkit-sprint-ship-loop/SKILL.md` changed after the review pass. Review passes were **not**
re-run for this phase, by instruction. No coder action was ever required; the *Coder response* table is
empty by design, not by omission.

### Evidence correction — for the follow-up H1 house-style guard task (0152)

The conclusion **"no test reads any `SKILL.md`'s content" is TRUE** and is safe to brief 0152 from.
Independently re-verified here. But **two** evidence lines in circulation are inaccurate — recorded so
0152 is not briefed from a false citation:

- The **"zero hits"** form is wrong. Actual `grep -rn "claude/skills" test/*.js` → **2 hits**, and both
  are **comments**, not executing code: `test/dashboard-contract.test.js:1` and
  `test/task-id-uniqueness.test.js:35`.
- The **corrected** form in circulation is *also* not literally right. `test/dashboard-contract.test.js:28`
  is **not** a grep hit for `claude/skills` — the path is assembled via
  `join(REPO, 'claude', 'skills', 'fkit-status', 'dashboard.sh')`, so that substring never appears in the
  file. Substantively the point holds: it executes `dashboard.sh`, a sibling file in a skill folder,
  never a `SKILL.md`. And `test/harness.mjs:212–217` is a real usage but is a **`.mjs`** file, so it lies
  **outside the `test/*.js` glob entirely** and could never appear in that grep's output.
- **The robust statement to brief 0152 from:** the *only* skills-related filesystem access in the whole
  test suite is `test/harness.mjs:213`, a `readdirSync` of `.claude/skills` that returns **directory
  names** only (filtered to `fkit-`-prefixed directories). There is **no `readFileSync` of any `SKILL.md`
  anywhere in `test/`** — therefore no existing test asserts anything about a SKILL.md's H1, and 0152
  would be adding genuinely new coverage rather than duplicating an existing guard.

This correction changes **no finding** in this review. The 0120 verdict is unaffected.
