# Build the deterministic dashboard script and wire it into `/fkit-status`

## Sprint
Backlog (unsprinted)

## Priority
Unscheduled

## Status
🔲 Backlog

## Context

**Implements the "deterministic layer" the owner asked for on `/fkit-status`:** a script that renders
the step-4 dashboard deterministically, invoked by the skill so its output is shown when the skill
runs, **replacing the prose dashboard-description** in `claude/skills/fkit-status/SKILL.md`. Beats 1–6
stay LLM-driven.

**This task builds and wires; it does not decide.** All shape decisions — output contract (final board
text vs structured facts), the `ready`/`after N` treatment, runtime (bash vs node), placement, ADR-or-
not, test approach — are settled by its dependency,
[`design-deterministic-dashboard-for-fkit-status`](./design-deterministic-dashboard-for-fkit-status.md).
**Do not start this until that spec is reviewed with the owner** — building against an unsettled
runtime or output contract is exactly what the split exists to prevent.

For grounding, the feasibility split the design rests on (fkit-architect, 2026-07-16):
- **Deterministic:** row cells (Status/#/Task/Filename), roll-up counts, drift *facts*, and four of the
  six Next-step shapes (`closed`, `dead`, `in Sprint N`, `waiting on owner`).
- **Not deterministic against today's format:** `ready` vs `after N`, because the `Depends on:` line is
  free text. Per the design, this either stays LLM-derived or shows an agreed placeholder — **it is not
  guessed by the script.**

## What to build

Per the design spec:

1. **The dashboard script**, in the decided runtime, placed under `claude/` so `install.sh:43` ships it
   and init copies it. It parses the active (or named) sprint plan's Status table and the referenced
   briefs and produces the step-4 board per the decided output contract:
   - one row per task, marker copied verbatim from the plan cell;
   - the roll-up line (non-zero terms only, always `— of M` = table row count);
   - the computed **drift set** (brief in `done/` still `🔲 Backlog`; plan cell ≠ brief `## Status`;
     `## Sprint` disagreeing with a `➡️ Moved` target), surfaced per the contract;
   - the four deterministic Next-step shapes; `ready`/`after N` handled exactly as the spec decided.
   - It must honor the sprint-resolution and the reserved `full` keyword semantics the skill already
     documents (active sprint when unnamed; a named sprint; `full` forces the complete board).
2. **Wire it into the skill.** Replace step 4's prose dashboard-description in
   `claude/skills/fkit-status/SKILL.md` with an instruction to **run the script and show its output**,
   integrated so the drift facts feed beat 6 and the roll-up clause without the LLM re-deriving them
   (per the output-contract decision). Leave beats 1–6 and the step-5 delta / `full` behavior intact.
   **The canonical source is `claude/skills/fkit-status/SKILL.md`; the `.claude/` copy is gitignored
   and init-regenerated — do not edit it.**
3. **A test, if the design decided one** — a pure-function check (fixture sprint plan + briefs →
   expected board text), using the existing `node --test` + `test/harness.mjs` infrastructure if that
   is the decided path.

## Verification steps

- **Run the script against the live Sprint 2** and confirm the board matches a hand-built one: every
  row's marker, the roll-up (`N done · N backlog — of M` with the counts summing to `M`), and the
  **current real drift** — briefs sitting in `done/` while still marked `🔲 Backlog` (as of writing:
  tasks 23, 30, 31, 32, 33, plus 24, 38, and the `align-conventions…` brief). The script must light up
  on that drift, not hide it.
- **`/fkit-status full` still forces the complete board**, and a plain repeat call still deltas beats
  1–6 — the deterministic dashboard does not break the step-5 behavior.
- **`ready`/`after N`** renders exactly as the design decided (LLM-derived or the agreed placeholder) —
  the script never emits a *guessed* dependency.
- **The script ships to consumers:** confirm it lands under `claude/` such that `install.sh`'s
  `cp -R .../claude` copies it and a scaffolded/initiated project can invoke it.
- **Step 4's prose dashboard-description in `SKILL.md` is replaced** with the run-script instruction;
  no half-migrated state where both the prose spec and the script coexist.
- If a test was specified, it passes (`npm test` / the decided runner) and covers at least the roll-up
  count and one drift case.

## Notes

- **Owner: fkit-coder** (product source under `claude/`), with fkit-architect available for consult on
  fidelity to the spec.
- **Depends on:** [`design-deterministic-dashboard-for-fkit-status`](./design-deterministic-dashboard-for-fkit-status.md)
  **(hard).** Do not begin before that spec is owner-reviewed.
- **Relates to:** tasks 34/35 (mover stale-header drift) — the drift set this script surfaces is
  produced by that same gap; the script *reports* the drift, it does not *fix* it.
- **Kept as one unit (script + wiring) deliberately:** a script with no wiring buys nothing and wiring
  needs the script — they are tightly coupled. Split only if the design surfaces a reason.
- **Risk: medium** — it edits a producer skill's most intricate section and ships a new consumer-side
  executable; the design task exists precisely to de-risk the shape before this runs.
- **Provenance:** owner request via `/fkit-task-plan` (2026-07-16).
