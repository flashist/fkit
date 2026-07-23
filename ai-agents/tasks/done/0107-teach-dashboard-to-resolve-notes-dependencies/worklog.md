# Worklog — 0107: make a Notes-stated dependency visible to `dashboard.sh`

## Plan gate (2026-07-23)
Design fork A/B was the owner's call (brief reserved it). Presented A / B / **B+guard** via
AskUserQuestion. **Owner chose B + loud guard.** Plan persisted to `plan.md`.

## Owner-decision log
- **Plan-gate design fork:** owner selected **B + loud guard** (enforce canonical form via
  fkit-task-brief + KB doc; parser gains a loud-only safety arm, no new extraction grammar).
- **Review R1 disposition (2026-07-23):** owner chose **harden + soften + accept residual** — tighten
  guard to `^[^A-Za-z]*Depends on[.: ]`, soften the "no prose at all" wording, accept the remaining
  loud-direction over-fire (blockquote/table/non-Latin) as a residual.
- **Scope-boundary residual (2026-07-23):** owner chose **accept as residual** — a word-decorated
  declaration silently → `ready` is the accepted Option-B scope line, mitigated by the convention +
  mandate, not the guard.

## Review round 1 (converged)
- Reviewer: ✅ Ready to merge, 0 confirmed defects, **full model-diverse coverage** (own pass + Codex
  both ran and converged). One LOW frontier/doc nit (R1). One-grammar invariant honored; apostrophe
  hazard clean; `form="U"` plumbing correct; no canonical regression.
- R1 hardened (owner-approved) — regex `[.: ]` terminator + wording softened. Re-verified 455/0.
  Spot-check: `0092` form fires, blockquote fires (accepted residual), `Depends online` excluded,
  ASCII prose quiet.

## Decisions taken autonomously (obvious winners, within plan)
- **Guard regex `^[^A-Za-z]*Depends on` (letter-blocked), NOT "any Depends-on mention".** The naive
  "any mention" reading fabricates LOUD drift on prose that merely discusses dependencies — verified it
  would fire on `0107`'s OWN brief (Context line 26 + Option-A prose). The letter-blocked form fires
  only on a declaration-shaped line (label preceded solely by markup/decoration), which is the actual
  0092 failure class, and provably excludes prose + masked code spans. This is the faithful reading of
  "non-canonical *declaration*"; rejected the broader reading with concrete evidence.

## Build notes
- **Bug hit + fixed during build:** my first `dashboard.sh` edit added an awk comment containing
  apostrophes (`function's`, `file's`). The awk program is single-quoted, so an apostrophe closes the
  quote — the whole script `syntax error`ed and ALL 20+ dashboard tests failed. The file warns about
  exactly this at line 181. Rewrote the comment apostrophe-free; script runs, suite green.

## Verification evidence (from the run after the final code change)
- `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` → exit 0, no new drift.
- `node --test test/dashboard-contract.test.js` → **107 pass / 0 fail** (baseline 105 + 2 new).
- `node --test` (full) → **455 pass / 0 fail** (baseline 453 + 2 new).
- New tests all green: decorated-declaration → LOUD ⟨UNPARSEABLE⟩ + `drift depends-unparseable … form="U"`;
  prose mention → still `none recorded`, no drift; existing canonical/none-recorded unchanged.

## Review — CLOSED OUT (round 1, converged)
- Ledger `review.md`: **Status: closed-out.** Verdict ✅ Ready to merge, 0 confirmed defects.
- **Codex coverage: FULL** — own pass + Codex adversarial pass both ran, model-diverse, no degradation.
- R1 (LOW frontier/doc nit) hardened per owner; phase-2 re-verify of the hardened guard: sound,
  regression-free. Two residuals recorded (owner-accepted 2026-07-23), each with a re-raise condition.
- **Non-degraded run** → coder self-close authorized (Codex ran, verify green, residuals accepted).

## Verification steps (brief) — walked
1. **"task 84 still open → after 83, not none/ready"** — ⚠️ **STALE + design-divergent, flagged.**
   `0092` is now `✅ Done` → off-board (renders nothing) under ANY option. AND: the owner chose
   **B+guard**, which deliberately does NOT extract from a decorated form (that was Option A, rejected)
   — it renders the decorated form **LOUD `⟨UNPARSEABLE — see brief⟩`**, not `after 83`. The brief's
   literal "after 83" assumed Option A semantics. Under the approved design the correct outcome is: the
   form no longer lies `ready`, it flags LOUD, and the canonical rewrite resolves the deps. Met in
   spirit (no more silent false `ready`); NOT literally `after 83`. Demonstrated via fixture 9b.
2. **"a brief with no dependency still resolves to `ready`"** — ✅ met (fixture 9c + existing
   none-recorded test; live board shows no false drift).
3. **"dashboard-contract gains a fixture for the parsed/enforced form and passes"** — ✅ 3 fixtures added.
4. **"if convention (B), fkit-task-brief documents it"** — ✅ SKILL.md:78 mandates the canonical form;
   new KB convention doc records the single home.

## Files touched
- `claude/skills/fkit-status/dashboard.sh` — loud-guard final locate arm in `depends_raw` (+ `.claude/` copy synced)
- `claude/skills/fkit-task-brief/SKILL.md` — mandate canonical `- **Depends on:** …` form (+ `.claude/` copy synced)
- `ai-agents/knowledge-base/conventions/dependency-declaration-form.md` — NEW convention doc
- `test/dashboard-contract.test.js` — +2 net tests (decorated→LOUD; prose→none-recorded)
- `ai-agents/tasks/backlog/0107-.../{brief.md (status), plan.md (new), worklog.md (new)}`
- `ai-agents/sprints/sprint-2.md` — status row 89 → 🔄 In progress

## NOT mine (unrelated uncommitted tree state, from prior session)
`ai-agents/sprints/backlog.md`, `ai-agents/tasks/backlog/0118/0119/0120/0121` — producer follow-ups,
untouched by this task.

## Commit state
Nothing committed (loop never commits). All edits in the working tree.

