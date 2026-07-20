# Design the deterministic dashboard generator for `/fkit-status`

## ID
0026

## Sprint
Sprint 2

## Priority
40

## Status
✅ Done

## Context

**The owner wants a "deterministic layer" for `/fkit-status`:** a script that renders the step-4
dashboard, invoked by the skill so its output is shown when the skill runs, **replacing the prose
dashboard-description** in `claude/skills/fkit-status/SKILL.md`. Beats 1–6 (headline, blockers, what's
next) stay LLM-driven; only the step-4 board becomes script-generated.

Today, step 4 is *prose instructions* the producer LLM follows to hand-build a table
(**Status · # · Task · Filename · Next step**) plus a one-line roll-up (`N done · N backlog … — of M`).
The skill's own text spends a whole block worrying that a human miscounts rows or fails to sum to `M`
(SKILL.md ~199–201) — the exact silent-wrong failure a script eliminates.

**This is a design-first task because the scope has real, owner-facing unknowns** (fkit-architect
consult, 2026-07-16). It settles them and produces the contract the implementation task
(`build-deterministic-dashboard-script-for-fkit-status`) builds against. **Do not write the script
here** — decide its shape.

### What the architect established (feasibility — decided, drives the design)

Of the four things the board carries:
- **(a) Status / # / Task / Filename per row — fully deterministic.** Straight parse of the sprint
  plan's markdown Status table; filename from the link target. "Render the plan marker verbatim" *is*
  "copy the cell."
- **(b) Roll-up counts — fully deterministic, and the strongest case for scripting.** Count rows by
  marker, print non-zero terms, `— of M` = row count. A script makes the "counts must sum to M"
  failure impossible.
- **(c) Drift *facts* — deterministic; disposition stays LLM (as today).** Plan cell, brief `##
  Status` marker, and brief location are all mechanical, so a script can emit the concrete drift set
  (`in done/ but marked 🔲 Backlog`; `plan cell ≠ brief ## Status`; `## Sprint` disagrees with a `➡️
  Moved` target). The `➡️ Moved`-is-not-drift rule and the disagreement-vs-nonconformance split are
  mechanical too. The **never-repair / narrate-into-beat-6 / roll-up-clause** behavior stays LLM.
- **(d) Next step — four of six shapes are deterministic; `ready` vs `after N` is NOT.** `closed`
  (`✅`), `dead` (`⛔`), `in Sprint N` (`➡️`), and `waiting on owner` (disagreement-drift override, once
  (c) is computed) fall straight out. The remaining `ready` vs `after <N>` distinction depends on the
  **free-text `Depends on:` line**, which names dependencies inconsistently — by task number, by phase
  name, by filename slug, qualified `hard`/`soft`/`nothing hard`. A script cannot reliably extract the
  depended-on task *numbers* from today's format, and this is the one column the skill already flags as
  "the easiest place to start making things up."

**One structural consequence to design around:** (c) and the terminal (d) shapes feed **beat 6 and the
roll-up clause**, not just the board. If the script computes drift and the LLM independently re-derives
it for beat 6, they can disagree. The clean design is **the script as the single source of the
mechanical facts**, with the skill rendering the board *and* narrating those beats from that one
output — which is more than "replace the prose board paragraph." That tension is exactly what this task
resolves.

## What to build

**A short design spec** (a `fkit-design-spec`, not a throwaway), settling the following **with the
owner present** — every item below is a decision, not a guess to make alone:

1. **Output contract.** Does the script emit **final board text** (skill shows it verbatim) or
   **structured facts** (rows + counts + drift list) that the skill renders the board *and* narrates
   beats 1–6 from? The latter is the single-source-of-truth design; it is also more than "replace the
   prose paragraph." Decide, and state what the skill does with the output.
2. **The Next-step boundary.** `ready` vs `after N`: **keep LLM-derived**, or **constrain `Depends on:`
   to a machine-parseable form**? The constraint is a convention change touching every existing brief,
   `/fkit-task-plan`, and both movers — a separate, larger decision. Recommendation to put to the
   owner: keep `ready`/`after N` LLM for now; do **not** bundle the format change. Also decide what a
   cell the script can't prove shows (blank / `?` / best-effort + explicit verify hand-back).
3. **Runtime.** **bash** or **node**? Architect's lean: **bash** — fkit's entire product surface is
   bash, the parse is line-oriented markdown (no JSON assertion, unlike the `skillOverrides` map that
   won node for task 23's tests), and bash adds **zero** new PATH assumption on a consumer machine
   where a *skill-invoked* script runs. Node is defensible if the drift cross-check proves painful.
   Note: ADR-014's `node --test` precedent is for **repo-root test infra that `install.sh:43` cannot
   ship to consumers** — the opposite calculus from a skill-shipped script.
4. **Placement.** The script must live under `claude/` (likely `claude/skills/fkit-status/`) so
   `install.sh:43`'s `cp -R .../claude` ships it and init copies it — **not** repo-root `test/`.
5. **ADR-or-not.** This is **the first consumer-shipped executable a skill shells out to** — a new
   class for fkit, outside ADR-014's stated scope. Architect's view: plausibly ADR-worthy;
   owner-gated. Decide whether a decision record is opened (and if so, `/fkit-record-decision`,
   architect-owned).
6. **Test approach.** ADR-014 does not *require* a test here, but the board renderer is a pure function
   (fixture plan + briefs → expected text) — the ideal test target — and the shipped `node --test` +
   `test/harness.mjs` already stubs `claude` and drives the bash launcher, so it can shell out and
   assert stdout. Decide: test or not, and against which runtime.

## Verification steps

- A design-spec document exists (location per the KB conventions the architect owns) and **answers all
  six items above with a decision, not an option list.**
- The spec is **reviewed with the owner** and its owner-gated points (runtime, output contract, ADR)
  are explicitly ruled, not assumed.
- The spec states the **input contract** (which files the script parses and how it identifies the
  active sprint) and the **output contract** precisely enough that the implementation task can be built
  and tested against it without reopening a decision.
- The `ready`/`after N` treatment is decided and written down, including what an unprovable cell shows.
- Runtime, placement, and the ADR question each carry a recorded decision.

## Notes

- **Owner: fkit-architect** (design + KB write), **with the owner present** for the six decisions —
  four of which the architect flagged as owner-only in the consult (runtime, `ready`/`after N` policy,
  ADR-or-not, output contract).
- **Depends on: nothing.** **Blocks:** `build-deterministic-dashboard-script-for-fkit-status`.
- **Consulted:** fkit-architect (2026-07-16) established the feasibility split above and recommended
  the design-then-implement seam.
- **Scope boundary — do not touch the `Depends on:` format here.** Constraining it to be
  machine-parseable is a separate, larger convention change (every brief + `/fkit-task-plan` + both
  movers); this task only *decides whether* to pursue it, and the recommendation is not now.
- **Risk: low** — a design/decision document; no product or runtime code.
- **Provenance:** owner request via `/fkit-task-plan` (2026-07-16); split from the implementation on the
  architect's advice because the runtime and output contract are unsettled owner-facing decisions.
