# Assess ADR-037's two clause sites against the ADR-036 registry

## ID
0194

## Sprint
Sprint 2

## Priority
172

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 6 of [ADR-037](../../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)**
(accepted 2026-08-02). ADR-037 adds two new clauses to the repository — a worker-side clause in
`claude/scaffold/universal-rules.md` (`0190`) and a driver-side clause in
`claude/skills/fkit-sprint-ship-loop/SKILL.md` (`0191`). **Both need assessing against
[ADR-036](../../../knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md)'s
declared skill-ownership site registry**, and neither can be assessed today.

### Why it cannot be done now — three prerequisites, all open

1. **The registry module does not exist.** `test/skill-ownership-sites.mjs` is **absent from disk,
   verified 2026-08-02**. It is `0142`'s follow-up, filed as `0189`. There is nothing to run.
2. **`0190`'s clause does not exist** — no wording to assess.
3. **`0191`'s clause does not exist** — same.

### Why it is a row and not a verification step inside `0190` / `0191`

Because the ordering is not guaranteed. If `0189` lands **after** both clause tasks, a check folded into
their verification steps is a check that was skipped as unrunnable and never revisited. **A separate row
is the only form that survives every ordering** of the three prerequisites. `0190` and `0191` each carry
a pointer here rather than a duplicate check.

### The expected answer, stated so it can be falsified rather than assumed

ADR-037's own §Follow-ups records the prediction: **both clauses attribute no skill to a role**, so they
are **likely declared non-fact hits** rather than ownership-fact sites. But:

- **`claude/scaffold/universal-rules.md` is inside ADR-036's declared live surface**, so its hit is not
  automatically noise.
- **ADR-036 clause 4 trigger (e)** — a role name within a proximity window of an ownership verb — is the
  one most likely to fire on either wording. ADR-037 §4 flags it by name for the worker-side clause.
- The prediction is **a prediction**. If a clause turns out to be a genuine ownership-fact site, it gets
  registered, and the registry's day-one noise count changes.

## What to build

**An assessment, recorded — and a registry entry only if the assessment says so.**

1. **Run ADR-036's registry check** against both clause sites, once `test/skill-ownership-sites.mjs`
   exists. State the module's actual behaviour rather than ADR-036's description of it.
2. **Score each of the two clauses against every trigger in ADR-036 clause 4** — (a) through (e) — and
   record which fire and which do not. **Do not score (e) alone** just because it is the one ADR-037
   flagged.
3. **Classify each site by name:** a genuine **ownership-fact site** (registered), a **declared non-fact
   hit** (declared, so it stops being noise), or **neither** (no action). Three outcomes, and *"neither"*
   is a legitimate one.
4. **Register or declare what the classification requires**, in the registry module — nothing more.
5. **Record the knock-on to the registry's noise count**, if any. ADR-036's accounting is measured, and a
   new declared hit moves it.

⛔ **Out of scope:** changing either clause's wording (that is `0190` / `0191`); changing ADR-036's
triggers or their thresholds; building any part of the registry (`0189`); any ADR amendment.

## Verification steps

1. **`test/skill-ownership-sites.mjs` exists and was actually run** — quote its output. If it still does
   not exist, this task is **`🚧 Blocked`**, not done.
2. **Both clause sites exist on disk** and are named by path. If either does not, the task is blocked on
   that one, and partial completion is recorded as partial, not as done.
3. **All five triggers are scored for both sites** — a table with ten cells, each fire/no-fire, not a
   prose summary of the interesting ones.
4. **Each site is classified into exactly one of the three named outcomes**, with the reason.
5. **The registry's noise count is stated before and after** — the same measured basis ADR-036 uses.
6. **`npm test` is green**, including the registry module's own tests.
7. **The diff touches `test/skill-ownership-sites.mjs` and nothing else** — or nothing at all, if the
   classification was *"neither"*.

## Notes

- **Depends on:** `0189`, `0190`, `0191`.
- **Blocks:** nothing.
- **⚠️ All three dependencies are open at filing.** This task is not pullable until they land, and
  pulling it early produces a blocked row, not progress.
- **⚠️ Priority 172 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0189`** — its heaviest dependency and the one that unblocks it
  — because a registry assessment has no value before the registry exists, and sequencing it anywhere
  above `0189` guarantees a blocked row. **Append and merit very nearly coincide here**, which is why the
  gap is not flagged as a divergence. Filed by a spawned producer with no owner channel; per the owner's
  ruling of 2026-07-27, appending was the only sanctioned option.
