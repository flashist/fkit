# Worklog — 0516: Fix the stale ADR-019 and `fkit-coder.md` line cites found during 0496

- **Built:** 2026-10-15, at HEAD `6227119`, by `fkit-coder` as the sprint loop's **Build** worker
  (caller `fkit-sprint-ship-loop`, driver `fkit-lead`), against the owner-approved `plan.md` in this
  folder ("Approve with X1+X2 fixes (Recommended)"; the plan's *Owner-approved amendments* govern).
- **Baseline** (saved before the first edit): uncommitted changes already present were the parallel
  producer's edits to the Sprint 12 board and to this task's `brief.md` (both 0516 status edits), plus
  the untracked `plan.md` and `plan-review.md`. None of them was touched by this build; their
  `git diff --numstat` is identical before and after.
- **Cite form used for every fixed live pointer:** heading + quoted fragment, no line number.
- **Files changed (6):** `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/agents/fkit-coder.md`,
  `claude/skills/fkit-task-ship-loop/SKILL.md`, ADR-025, ADR-032, ADR-037. Plus this worklog.
  `claude/fkit-claude-init.sh .` refreshed the `.claude/` copies; it changed no tracked file.

## (a) Verdict lines — one per cite (13)

| # | Site | Before | After | Verdict |
|---|---|---|---|---|
| 1 | `fkit-sprint-ship-loop/SKILL.md`, *Process review* row | `(ADR-032 A2 / ADR-019 `:96`)` | `(ADR-032 A2 / ADR-019 §Decision item 4 — *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log"*)` | **fixed** |
| 2 | `fkit-coder.md`, Process-review worker bullet (*"Record what you did unattended."*) | `ADR-019 (link) `:96`; ADR-020's worklog decision log` | `ADR-019 (link) §Decision item 4 — *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log"*; ADR-020's worklog decision log` (re-wrapped; net +1 line) | **fixed** |
| 3 | `fkit-task-ship-loop/SKILL.md`, step 6 *"⛔ STOP"* bullet | `` `fkit-coder.md:165` `` | `` `fkit-coder.md` §Consulting a teammate — *"But: a genuinely NEW architecture decision goes to the OWNER."* `` | **fixed** |
| 4 | ADR-025 header, **Reverses** bullet | `(`adr-019:97` — …)` | line left byte-identical; new header bullet **Corrections:** (2026-10-15, `0516`) names ADR-019 **§Decision item 5**, *"The done-gate is unchanged and owner-only."* | **fixed** (by append-only note) |
| 5 | ADR-025 §Related, ADR-019 entry | `(§Decision 5, `:97`)` | line left byte-identical; same ADR-025 **Corrections:** bullet covers it (§Decision item 5) | **fixed** (by append-only note) |
| 6 | ADR-025 §Related, ADR-019 entry | `Its `:143` re-raise` | line left byte-identical; same ADR-025 **Corrections:** bullet names ADR-019 **§Consequences → Residual risks**, *"The owner later wants relayed-consent close-out"* | **fixed** (by append-only note) |
| 7 | ADR-032 §Amendment → A2, paragraph *"ADR-019's audit obligation transfers with its permission"* | `ADR-019 `:96`` | paragraph left byte-identical; inline ⚠️ dated note below it names ADR-019 **§Decision item 4**'s closing sentence; header **Corrections:** index line added (five notes) | **fixed** (by append-only note) |
| 8 | same ADR-032 A2 paragraph | `ADR-019 `:148-150`` | same inline note names ADR-019 **§Consequences → Negative / costs**, bullet *"A soft self-classification boundary"* (*"This is the sharpest edge"*) | **fixed** (by append-only note) |
| 9 | ADR-037 §Related, ADR-019 entry | `ADR-019 (link) `:96`` | line left byte-identical; covered by the §2 inline note and the header index line (three notes) | **fixed** (by append-only note) |
| 10 | ADR-037 §Decision → 2. What the worker does on collision, paragraph *"The audit obligation, which is what makes the flag real."* (re-grep extra; the cite wraps: `ADR-019` / `` `:96` `` on the next line) | `the same obligation ADR-019 `:96` attaches` | paragraph left byte-identical; inline ⚠️ dated note below it names ADR-019 **§Decision item 4**'s closing sentence | **fixed** (by append-only note) |
| 11 | `reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md` §8.1 | `(`adr-019:138`)` | unchanged | **frozen record, left as is** — its header Status says the report is now the evidence record *"of what was weighed, not a live design"* |
| 12 | same report, §Related ADR-019 entry | `` `:138` (the pre-registered re-raise this task answers) `` | unchanged | **frozen record, left as is** — same header |
| 13 | `reports/2026-08-05-eval-process-review-step-role-ownership.md`, row table | `(ADR-032 A2 / ADR-019 `:96`)` inside a quoted copy of the row | unchanged | **frozen record, left as is** — it quotes the row as it was |

### Quote-findability check (each fixed cite's target)

Whitespace-normalised match (`sed 's/^[[:space:]>*-]*//' | tr '\n\t' '  ' | tr -s ' '`, then `grep -F`),
each quote checked against its target file and its heading confirmed by an `awk` heading tracker:

- ADR-019, *"Every autonomous choice — every obvious winner — is recorded in the task's worklog
  decision-log"* → FOUND, under `## Decision`, item 4 (it opens on the item's last wrapped line).
- ADR-019, *"The done-gate is unchanged and owner-only."* → FOUND (once), under `## Decision`, item 5's
  opening line.
- ADR-019, *"The owner later wants relayed-consent close-out"* → FOUND, under `## Consequences`,
  **Residual risks** sub-list.
- ADR-019, *"A soft self-classification boundary"* and *"This is the sharpest edge"* → FOUND, under
  `## Consequences`, **Negative / costs** sub-list (the second wraps across a line).
- `claude/agents/fkit-coder.md`, *"But: a genuinely NEW architecture decision goes to the OWNER."* →
  FOUND, under `## Consulting a teammate`.
- Index-line anchors: ADR-032 *"ADR-019's audit obligation transfers with its permission"* → FOUND;
  ADR-037 *"The audit obligation, which is what makes the flag real."* → FOUND.

### Prose-unchanged check (Steps 2 and 3)

Whole bullet before and after, normalised with `sed 's/^[[:space:]]*//' | tr '\n\t' '  ' | tr -s ' '`,
then the single differing span extracted:

- `fkit-coder.md` Process-review worker bullet: `` `:96` `` → `§Decision item 4 — *"Every autonomous
  choice — every obvious winner — is recorded in the task's worklog decision-log"*`. Nothing else
  differs. **PASS.**
- `fkit-task-ship-loop/SKILL.md` *"⛔ STOP"* bullet: `` fkit-coder.md:165` `` → `` fkit-coder.md` §Consulting
  a teammate — *"But: a genuinely NEW architecture decision goes to the OWNER."* ``. Nothing else
  differs. **PASS.**

### ADR append-only check

`git diff --numstat`: ADR-025 `9 0`, ADR-032 `11 0`, ADR-037 `11 0` — zero removed lines.

## (b) Re-grep hits

Multi-line scan (Python regex over whole files, so a cite wrapped across a line break is caught) of
tracked + untracked files, excluding `ai-agents/tasks/done/`, `ai-agents/tasks/cancelled/`,
`ai-agents/wiki-vault/` and `.claude/`. Patterns: `ADR-019`/`adr-019` (optionally a link) followed by a
`` `:NNN` `` cite, and `fkit-coder.md:165`. A second, looser pass flagged any `` `:NNN` `` whose nearest
preceding reference is ADR-019.

- ADR-025 Reverses `adr-019:97`; ADR-025 §Related `:97` and `:143` → verdicts 4–6 (**fixed**).
- ADR-032 A2 `:96` and `:148-150` → verdicts 7–8 (**fixed**).
- ADR-037 §Decision 2 `:96` (wrapped) → verdict 10 (**fixed**) — the extra hit the plan found.
- ADR-037 §Related `:96` → verdict 9 (**fixed**).
- Both reports → verdicts 11–13 (**frozen record**).
- **Logged, not fixed — not live pointers:** the Backlog board's ➡️ Moved-to-Sprint-12 row for this
  task, which names `fkit-coder.md:165` as this task's subject (boards are producer-owned anyway); and
  this task's own `brief.md`, `plan.md` and `plan-review.md`, which name the old cites as the subject
  of the task.
- The new 0516 notes restate `` `:96` ``, `` `:97` ``, `` `:143` ``, `` `:148-150` `` without an
  `adr-019` prefix, by design, so future `adr-019:NNN` sweeps do not re-hit them.
- No other `ADR-019`/`adr-019` + line-number cite, and no other `fkit-coder.md:165`, in scope.

**Seen, out of scope (not ADR-019 cites), not fixed:** in ADR-032 A2, `claude/agents/fkit-coder.md:73-82`,
`SKILL.md:105` and `SKILL.md:118-121`; in ADR-025's header, `CLAUDE.md:55`,
`claude/scaffold/universal-rules.md:6` and `AGENTS.md:41`; ADR-038's ADR-037 `:33` (already stale).

## (c) Decision log

- **ADR-037: one note covers two sites; no note beside §Related.** A reader reaches §Related's fix
  through the header index line and the §2 note. Why: ADR-032's `0170` one-note-two-sites precedent;
  a second note would add a third dated note for one fact. (Plan Step 6, approved — recorded as the
  plan asks, not a new call.)
- **Obvious-winner calls made during the build: none.** Fixes applied without asking: none beyond the
  approved plan's own steps.
- **Process review (2026-10-15, sprint loop's Process-review worker): none.** Round 1 had no findings;
  no fix applied without asking, no obvious-winner call. Ledger set to `closed-out`.
