# Plan — Task 0106: render the Owner column in `/fkit-status`

## Context
The owner asked (2026-07-22, screenshot) that `/fkit-status` show **Owner** as its own field in the
per-task board, *"the same way as Status, #, Task, Filename, Next step"*, positioned **just before Next
step**. 0104 defined the `## Owner` field; 0105 backfilled all 108 briefs. This is the **render half**:
`dashboard.sh` reads `## Owner` from each brief (same pass that already reads `## Status`) and emits a
new **Owner** column between Filename and Next step. `dashboard.sh` is the single most load-bearing
consumer and its column contract is mirrored in `SKILL.md`, so the script, the skill contract, and the
test suite must move together.

**Owner decision at the plan gate (2026-07-22):** **add a `brief-missing-owner` drift kind** mirroring
`brief-missing-status` — an absent now-mandatory owner is drift. (Renders `—` in the column *and* emits
a drift record. Won't fire today; all 108 briefs have owners.)

## Approach

### 1. `claude/skills/fkit-status/dashboard.sh` — the render
- **Read the field** (reuse `field_value`, exactly as `## Status`/`## Sprint` are read, ~line 619-623):
  add `b_owner=""`; then `b_owner=$(field_value "$brief_path" "Owner")` inside the existing brief-read block.
- **Owner cell:** `owner_cell="${b_owner:-—}"` — `—` (em-dash) placeholder when absent, matching the
  existing "no value" placeholder used for the backlog priority cell.
- **Drift kind:** next to the `brief-missing-status` check (~line 663), add:
  `if [ -n "$brief_path" ] && [ -z "$b_owner" ]; then add_fact "drift nonconformance $tid kind=\"brief-missing-owner\""; mark_drift; fi`
- **Row emit (~line 810):** insert the owner cell between Filename and Next step —
  `| ${st_cell} | ${pr} | ${task} | ${br_cell} | ${owner_cell} | ${next} |`.
- **Header (~line 860) + separator (~line 861):**
  `| Status | # | Task | Filename | Owner | Next step |` and `|---|---|---|---|---|---|`.
- **⟦FACTS⟧: no owner record** — the brief calls it optional/minimal; the board column + the drift record
  cover it, and adding per-task owner facts is needless churn. *(Obvious winner toward the brief's "keep it minimal".)*

### 2. `claude/skills/fkit-status/SKILL.md` — the contract (must agree with the script)
- Line 201 ("It is already the **five columns**") and line 323 ("the **five columns** above") → **six columns**.
- Add `Owner` where the board's columns are described; if the drift-kind list enumerates kinds, add
  `brief-missing-owner` alongside `brief-missing-status`. (Verify no other "five column" / header depiction lingers — grep before done.)

### 3. `test/dashboard-contract.test.js` — keep the contract test honest
- **Auto-inject a default `## Owner` in `foldBriefsAndPlan`**, mirroring its existing `## ID` injection:
  if a brief body has no `## Owner` heading, insert `## Owner\nfkit-coder`. This keeps every existing
  fixture from spuriously emitting the new `brief-missing-owner` drift, so only the **board column**
  changes in existing expectations — FACTS/drift assertions stay put.
- **Update the two full-board assertions** (~447, ~1281): header gains `Owner`, separator gains `---`,
  and each visible row gains the `fkit-coder` owner cell between Filename and Next step. Apply the same
  to any other visible board-row assertion (those with a Next-step 5th cell).
- **New fixture test:** (a) a brief with explicit `## Owner\nfkit-wiki` → asserts `fkit-wiki` in the
  column; (b) a brief whose `## Owner` value is empty → asserts `—` in the column **and** a
  `drift nonconformance N kind="brief-missing-owner"` fact + drift clause.

### 4. Sync the gitignored live copy
Tests run against `claude/` (canonical). The brief's verification command runs `.claude/skills/…`.
After editing, `cp` the two edited files `claude/skills/fkit-status/{dashboard.sh,SKILL.md}` →
`.claude/skills/fkit-status/` (what `fkit-claude-init.sh .` does) so the live command reflects the change.
`.claude/` is gitignored — not part of the commit.

## Scope / guards
- Single-home: `dashboard.sh` and `SKILL.md` live only under `claude/skills/` (not scaffold) — no dual-home copy.
- Board still shows open work only; roll-up/counts unchanged; the added column must not perturb drift on existing rows (the auto-inject guarantees this in tests; all live briefs have owners).
- Placement is exact: **between Filename and Next step** — honor the owner's instruction.

## Verification (brief's steps)
1. `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` → header `| Status | # | Task | Filename | Owner | Next step |`, Owner between Filename and Next step.
2. Spot-check rendered rows show each task's `## Owner` value vs its brief.
3. A brief with no `## Owner` renders `—`, not a blank/broken row (covered by the new test).
4. `SKILL.md` and the script agree on the column set — no lingering "five column" description.
5. `node --test test/dashboard-contract.test.js test/launcher-contract.test.js` — all pass, incl. the new Owner fixtures.
6. Roll-up/counts unchanged; `dashboard.sh sprint-2` shows no new spurious drift (all live briefs have owners → 0 `brief-missing-owner`).

## Commit
None — edits left in the working tree; the owner commits. (`.claude/` sync is gitignored.)
