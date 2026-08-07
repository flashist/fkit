# Worklog — 0248: docs for the structure-check capability

Build executed 2026-08-07 by a spawned fkit-coder under `/fkit-sprint-ship-loop`'s declared-approval
marker (plan approved by the owner via `AskUserQuestion` in the live lead session, 2026-08-07; plan
blob verified `7ed39687afd5622e8a56515f89eacc3330122540` before any read of the plan was acted on).
Plan: `plan.md` in this folder (driver-written). Docs only — no behavior change to any script.

## What was built

| File | Change |
|---|---|
| `ai-agents/knowledge-base/architecture.md` | **A1** §3 tree: added `structure-spec.md` + `structure-manifest.tsv` under `claude/`; widened `bin/release.mjs` to a `bin/` entry also naming `generate-structure-manifest.mjs`. **A2** §4.2 producer row: `heal` parenthetical → "structure check + consent-gated repair — tasks 0245/0246, ADR-039". **A3** new flow "**7 — Structure conformance**" appended after "6 — Release": determination layer (spec = what/meaning, manifest = touched-or-not, rename-aware across the three historical homes + working tree, CRLF-normalized, `npm run generate:manifest`); the producer-owned check (deterministic verdicts presented verbatim, full outcome vocabulary incl. `wiki-routed` → ADR-005, loud refusals, read-only in every branch); the repair path with ADR-039 v1 scope verbatim-consistent; the launch notice **as landed** (0247: one stderr line, every launch incl. setup-only, `.fkit-accepted-drift` suppression — notice only, `/fkit-heal` still reports in full); governing records (ADR-015 unchanged and in force for the unattended path; ADR-039 the companion licence; five `structure-*` suites + prove-red, mutation 15 = notice removal — claim verified against `test/structure-notice.test.js:25` before writing) |
| `README.md` (root) | **B** — sibling paragraph after "Staying current": launch's one-line divergence notice; `/fkit-heal` in a producer session; repair in-session, consent-gated, diffs in view, applies only the exact approved list, never silent, never a move/rename/delete; deliberate divergence → `ai-agents/.fkit-accepted-drift` (quiets the launch line only) |
| `claude/scaffold/ai-agents/README.md` | **C1** — sanctioned-path pointer appended inside the "Your edits are never 'corrected'" bullet, referencing the keep-out neighborhood ("a tracked sibling of the keep-out file below") |
| `ai-agents/README.md` (live twin) | **C2** — same pointer in the adapted register, at the "Content drift is not fixed" bullet. Deliberately NOT byte-aligned with C1 (audience-adapted parity exception, 0186/ADR-027) |
| `claude/structure-manifest.tsv` | **C3** — `npm run generate:manifest` regen; diff is exactly **one added row** for `ai-agents/README.md` — no unrelated churn |
| `claude/README.md` | **D** — producer row: `heal` "(read-only structure check)" → "(structure check + consent-gated repair)" (ruled in scope, Q1) |
| `claude/agents/fkit-producer.md` | **D** — the "read-only … repairs nothing until the consent-gated repair phase ships" sentence rewritten to the landed shape: check phase read-only in every branch; repair applies only the exact enumerated owner-approved list via `AskUserQuestion`, never a move/rename/delete, consent never stored, ADR-039; wiki routing unchanged |

Not touched, per plan: `ai-agents/wiki-vault/` (0249), `claude/scaffold/CLAUDE.md` producer row
(0250), architecture.md §9.1's suite count (ruled: separate task, Q2), every script.

## Verification evidence (plan §Verification)

1. **v1-scope wording spot-checked** against ADR-039 Decision 1–2 / `fkit-heal/SKILL.md`: every
   touched doc says untouched-stale only, no move/rename/delete, exact enumerated list, consent
   never stored, apply-time freshness re-check (arch flow 7 + producer.md), never silent. ✔
2. **No silent-auto-update claim anywhere touched:** grep over the five touched docs — every
   "silent"/"auto" hit is a "never silent"/"never auto-updates" form. ✔
3. **`npm test` — 682/682 pass, exit 0** (2026-08-07), including `structure-manifest.test.js` test A
   against the regenerated manifest, `dual-home-parity.test.js` (README pair on the exception path),
   `structure-spec.test.js`, and the full prove-red gate (15 mutations red at named assertions).
   **Prove-red for the regen:** test A (plus B/C, same stale-hash cause) run and watched **fail**
   after the scaffold edit and before regen — the regen is load-bearing, not ritual. ✔
4. **Manifest diff inspected:** 1 file, 1 insertion — the single new `ai-agents/README.md` row. ✔
5. **Shipped-state claims:** 0247 documented as landed (notice + intent file), nothing described as
   "filed". ✔
6. **`git status --porcelain`:** nothing under `ai-agents/wiki-vault/`. ✔ (Other modified paths in
   the tree — 0247's move to `done/`, sprint plans, `fkit-claude.sh`, tests — are pre-existing
   uncommitted sprint work, not this build's.)

## Decision log (ADR-019 audit obligation — fixes/calls made without asking)

- **Build round: none.** No fix was applied outside the approved plan and no obvious-winner call was
  needed; wording and placement choices (bullet-internal pointer in C1, the live twin's register in
  C2, flow 7's citation anchors) are executions of the plan's own text, not departures from it.

### Review Round 1 (2026-08-07, spawned coder under the same declared-approval marker)

- **R1 fix — applied without asking.** Answers ledger finding R1 (docs omit the launch notice's
  best-effort contract). Changed: `ai-agents/knowledge-base/architecture.md` flow 7 launch-notice
  bullet — added the best-effort clause (self-silencing paths per `structure_notice()`,
  `claude/fkit-claude.sh:435-440,482-485`; filter failure drops suppression, never the notice;
  notice-absence ≠ conformance, `/fkit-heal` is the diagnostic). Qualified: verified-CORRECT against
  the script, mechanical/localized (one bullet, one doc), in-plan (flow 7 is the plan's own edit A3;
  the clause is its accuracy bar). **Judgment stated, not a departure:** READMEs deliberately left
  without the caveat — the reviewer's finding itself recommends flow 7 only and calls the READMEs
  "arguably fine as summaries"; their corrective (`/fkit-heal`) is in the same sentence.
- **R2 fix — applied without asking.** Answers ledger finding R2 (scaffold README's "naming any
  paths that diverge" is false above three divergences). Changed:
  `claude/scaffold/ai-agents/README.md:44-45` → "the first three, then \"+N more\"", matching the
  pinned line format (`test/structure-notice.test.js:326-343`); live twin and root README checked —
  neither claims exhaustive naming, so scaffold home only (no byte-alignment; audience-adapted
  pair). `claude/structure-manifest.tsv` regenerated in the same change (**one** added row,
  `ai-agents/README.md`; test A watched red pre-regen, green post). Qualified: verified-CORRECT,
  mechanical/localized, in-plan (edit C1's own sentence, corrected to shipped behavior).
- Verification after both: `structure-manifest` 5/5, `dual-home-parity` 9/9, full `npm test`
  **682/682 pass, 0 fail**, prove-red gate 15/15 mutations red.
