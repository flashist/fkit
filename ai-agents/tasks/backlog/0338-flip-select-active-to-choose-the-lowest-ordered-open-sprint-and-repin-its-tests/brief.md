# Make `/fkit-status` report every In-progress sprint, and give the selector a status rung and a lowest-first single choice

## ID
0338

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Owner rulings 2026-08-25 (verbatim labels in `0337`): sprints get explicit statuses; *"ALL the
currently active sprints should be reported about"*; where one board is needed, **"Default lowest +
marker override (Recommended)"** (OQ-1); a `🔒 CLOSED` banner **"makes it ineligible"** (OQ-3). The
ADR from `0337` fixes the carrier — **ruled SD-1 2026-08-25, verbatim "Line-3 banner
(Recommended)"**: a line-3 header banner in a fixed grammar generalising `> ## 🔒 CLOSED — <date>.`
to one banner per status — and the N-sprint briefing shape. SD-2 (**"`sprints/cancelled/`
(Recommended)"**) adds a second archive folder the candidate glob must keep excluding. This task builds the
mechanism to that ADR — **do not start before it is accepted**.

What exists today, all in `claude/skills/fkit-status/`:

- `dashboard.sh select-active <dir>` (`:237-275`) chooses **one** plan: the highest-ordered eligible
  identity (`identity_gt` `:187-192`, kept when strictly greater at `:265`). Eligibility
  (`is_eligible` `:173`) is identity-only — `Backlog`/unresolved excluded — and location-only for
  "closed" (depth-1 glob `:241`; `done/` never seen — and the new `sprints/cancelled/` is likewise never seen
  by construction; say so in the comment). It prints `active file= identity=`, every
  `candidate`, and `drift ambiguous-active-sprint` (`:272-292`). `identity <plan>` (`:226`) prints an
  identity only.
- `SKILL.md:26-48` — the argument contract: empty = *"the active sprint"*, singular, *"taken the
  highest"* (`:39-40`); `active none` handling (`:47-52`). `SKILL.md:160-189` — seven beats written
  for one sprint; `:181` already special-cases a closed sprint asked for by name; `:189` the Backlog
  board. `SKILL.md:205-233` — beat 7 is the script's board, pasted verbatim.
- Tests: `test/dashboard-contract.test.js:2480-2541+` (S1-S8, `Backlog` token cases).
- `fkit-sprint-ship-loop/SKILL.md:47-48,94` consumes the single answer (its wording is `0339`'s).

## What to build

Exactly what the `0337` ADR specifies; where this brief and the ADR differ, the ADR wins and the
difference is reported back.

1. **A status reader in `dashboard.sh`** — one function that parses the **line-3 banner** in the
   grammar the ADR fixes (a blockquoted H2 carrying the status marker, plus date/reason where the
   vocabulary requires one), the single implementation (ADR-041 §5). It reads **line 3 only** — no
   "find the banner anywhere" rule, for the same reason ADR-040 reads a whole H1 segment and never a
   substring. `identity <plan>` grows to print the status beside the identity (or a sibling
   `status <plan>` mode — the ADR's interface). The legacy `> ## 🔒 CLOSED — <date>.` banner
   (`sprints/done/sprint-1..5.md:3`, four with trailing `Superseded by …`) reads as `Done`. No banner
   → status unresolved.
2. **Eligibility gains a status rung**: eligible = `Sprint <N><suffix>` identity **and** status
   `In progress`. `Done`/`Cancelled` (by status or banner) → ineligible (OQ-3); `Backlog` status →
   ineligible; missing/unparseable status → per the ADR (recommend: ineligible **and** a
   `drift sprint-status-unresolved` fact, so a plan that never got a status is loud, not silently
   active — the ADR-040 "wrong is worse than none" posture).
3. **`select-active` prints all and picks one**: every eligible sprint as `active file= identity=`
   lines in lowest-ordered-first order (or a distinct `active-set`/`chosen` grammar — the ADR's
   interface), plus one `chosen file=…` = the **lowest-ordered** eligible sprint, overridden by the
   option-(d) marker when present and pointing at an eligible plan (a marker pointing at an ineligible
   or missing plan → `drift active-marker-invalid`, and the default applies). Keep the length-then-bytes
   comparison (`:180-184` reasons) and the §1.5 byte-order tie-break; same-`<N>` order per the ADR's
   point 6, with its drift fact when two same-`<N>` plans are both eligible. Zero eligible → `active
   none`, exit 3, all candidates listed with status.
4. **Sprint-level drift facts** per the ADR's point 7 (status says terminal but plan at the top;
   plan under `done/` without terminal status/banner; carriers disagree), emitted by `select-active`
   and by board mode where the plan is the one being rendered.
5. **Rewrite `SKILL.md:26-52`** so the empty argument reports **every** sprint the script lists as
   active, and specify the N-sprint briefing per the ADR: beats 1-6 per sprint (lowest-ordered
   first), one beat-7 board per sprint, one closing cross-sprint line. Still one output
   (`conventions/one-skill-one-output.md`). A named sprint (`Sprint 4`) and `Backlog` are unchanged.
   Correct `:39-40` *"taken the highest"*.
6. **Tests** in `test/dashboard-contract.test.js`, each named for the new ADR: two In-progress plans
   both listed and the lower chosen; `Sprint 9` chosen over `Sprint 10` (flips S1 — integer ordering
   still, in the new direction); S1b intent kept; same-`<N>` pair per the ADR; a top-level plan with
   `🔒 CLOSED` never active; a `Backlog`-status plan never active; a missing status never active plus
   its drift fact; marker override; invalid marker → drift + default; zero eligible → `active none`
   exit 3. S6/S7 tie-break, `Backlog` identity token and ADR-040 T1-T11 pass unchanged.

## Verification steps

1. Fixture: `sprint-4.md` (In progress), `sprint-5.md` (In progress), `sprint-6.md` (Backlog),
   `sprint-3.md` (top-level, `> ## 🔒 CLOSED — 2026-01-01.`), `backlog.md`. `select-active` lists
   `Sprint 4` and `Sprint 5` as active in that order, chooses `Sprint 4`, lists `Sprint 6` /
   `Sprint 3` / `Backlog` only as candidates with their statuses. Add the marker naming `sprint-5.md`
   → chosen becomes `Sprint 5`, active set unchanged.
2. `node --test test/dashboard-contract.test.js` passes; the full suite passes.
3. On this repo **after `0340` has landed**: `bash .claude/skills/fkit-status/dashboard.sh
   select-active ai-agents/sprints` lists exactly `Sprint 6` as active and chosen, `backlog.md` as a
   `Backlog` candidate. **Before `0340`**: `sprint-6.md` has no status, so the output is `active none`
   plus the `sprint-status-unresolved` drift — record that this is the expected pre-migration result,
   not a defect.
4. `/fkit-status` with an empty argument, on a fixture with two In-progress sprints, renders two
   full seven-beat briefings and one cross-sprint close; nothing about the second sprint is summarised
   into a footer.
5. `grep -n "highest" claude/skills/fkit-status/dashboard.sh claude/skills/fkit-status/SKILL.md` —
   no remaining hit states the current selection rule.

## Notes

- **Owner: fkit-coder** — production change to `dashboard.sh`, its contract tests, and the
  `fkit-status` skill prose that describes the script's output.
- **Depends on:** 0337 (accepted, with SD-1 ruled — the carrier is what this task parses).
- **Blocks:** 0339.
- **Sequencing with 0340:** independent — `0340` edits this repo's boards, this task edits the
  product. Verification step 3 says what to expect in either order.
- **Do not touch:** the identity ladder (`resolve_identity`, ADR-040), the candidate set, the
  `Backlog` token, the §1.5 tie-break, or `fkit-sprint-ship-loop` (`0339`).
