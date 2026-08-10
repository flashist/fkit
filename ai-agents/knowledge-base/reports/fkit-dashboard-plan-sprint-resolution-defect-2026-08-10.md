# Defect report for the fkit maintainer — `PLAN_SPRINT` fails to resolve on real-world sprint-plan names

**To:** the fkit maintainer
**From:** a downstream fkit user (a game project, ~50 tasks, fkit `0.2.1` installed)
**Date:** 2026-08-10
**Component:** `claude/skills/fkit-status/dashboard.sh`
**Severity:** drift rule 1 is inert on **every** sprint plan in our repo. The board reports phantom
drift on sprint boards and goes quiet about real drift on backlog-shaped boards.

This document is self-contained. It assumes you know `dashboard.sh` and know nothing about our
project. Line numbers are from the `dashboard.sh` shipped in **fkit 0.2.1** (56121 bytes, 945 lines).
Everything below was verified by running that script, not read off.

---

## 1. The defect in one paragraph

`PLAN_SPRINT` (resolved at `dashboard.sh:83–108`) resolves **empty** for every sprint plan we have.
Neither matcher fires against the naming conventions our plan documents actually use. Because
`PLAN_SPRINT` has three consumers, all three degrade at once — and the failure is not the one the
code comments anticipate on every board type.

## 2. Why resolution fails

| Rung | Line | Pattern it wants | What our files look like |
|---|---|---|---|
| H1 regex | `:83` | `^# Sprint <N>` | `# Geoconflict — Sprint 4 — In-App Monetization & Citizenship` |
| Filename fallback | `:87` | basename matching `^sprint-<N>$` | `plan-sprint-4.md` |
| `backlog` special case | `:93–108` | basename exactly `backlog` | `backlog.md` — **this rung works** |

Both general rungs miss. The `backlog.md` special case is the only thing in our repo that resolves,
and it resolves correctly.

The H1 shape is not an oddity we invented — it is what you get when a plan document titles itself
with the product name first, which is the natural thing for a human to write. The filename shape is
what you get when someone groups planning documents with a `plan-` prefix.

## 3. ⚠️ The failure direction — corrected

Our own first internal write-up of this called it *"silent under-reporting"*. **That was wrong, and
we do not want the wrong framing reaching you.** The corrected analysis:

**Drift rule 1 (`:802`) is a SKIP:**

```sh
elif [ -n "$PLAN_SPRINT" ] && [ -n "$b_sprint" ] && [ "$b_sprint" != "$PLAN_SPRINT" ]; then
  : # brief belongs to another sprint — status cross-check skipped, per rule 1
```

An empty `PLAN_SPRINT` makes that guard false, so the **skip stops applying** and rows fall through
to rule 3's full cross-check. That is *more* comparison, not less.

- **On a numbered sprint board → over-reporting.** Every legitimately-carried-elsewhere row becomes a
  phantom `drift disagreement`. This is exactly what your own comment at `:78–82` predicts: it "fails
  toward MORE drift, which is exactly the 'phantom decisions' §5.2 rule 1 exists to prevent."
- **On a backlog-shaped board → under-reporting.** This one is via a *different* consumer. The
  "scheduled but still parked on the unscheduled board" check lives only inside the
  `[ "$PLAN_SPRINT" = "Backlog" ]` arm (`:772`, specifically
  `[ -n "$b_sprint" ] && [ "$b_sprint" != "Backlog" ] && bad=1`). Rule 3 has no equivalent. A
  backlog-shaped board whose identity does not resolve can **never** surface that drift — the one
  your R1 regression guard calls "the backlog board's HIGHEST-VALUE drift".

Both directions are real. A fix write-up that addresses only one is incomplete.

## 4. It is not silent — and that part works correctly

Worth stating plainly so you do not fix something that is not broken:

- `drift unresolved-plan-sprint` is emitted at `:905`.
- It sets `plan_level_drift` at `:917`, so it reaches the roll-up's drift clause.
- `fkit-status/SKILL.md:297–300` instructs the reader to say *"any drift below may be phantom"*.

**The reporting path is intact and should stay intact.** Any fix needs a regression guard that a
genuinely unidentifiable plan still reports `unresolved-plan-sprint` — otherwise the fix converts a
loud failure into a quiet one.

## 5. ⭐ The most actionable finding — your suite is green for a fixture-shaped reason

`test/dashboard-contract.test.js` already covers this code path well. Four tests pin it:

| Test | Line |
|---|---|
| `R8: a prose H1 falls back to the filename, keeping rule 1 alive` | 641 |
| `R8: an entirely unresolvable plan sprint is REPORTED, not silently ignored` | 654 |
| `R7` — establishes that `PLAN_SPRINT` has three consumers | 1713 |
| `task 68 / R1: rule 1 still skips normally on a numbered sprint board` | 1802 |

**R8 passes today only because its fixture is named `sprint-1.md`.** It proves the filename fallback
works when the filename already matches the pattern the fallback expects. It cannot detect that real
projects name the file something else. R8's own comment says it exists because losing the identity
"silently disabled the rule" — the test is aimed at exactly this failure and misses it by one
naming convention.

**The smallest useful change is a fixture, not a regex:** add a case with a `plan-sprint-4.md`
filename and a `# <Product> — Sprint 4 — <theme>` H1, assert rule 1 still skips, and watch it go red.
That converts this report into a failing test you own.

## 6. ⚠️ Design constraint on any fix — the letter-suffix trap

Both current patterns use `[0-9][0-9]*`. Widening them naively is worse than leaving them alone.

Our repo has **`plan-sprint-4b.md`** and **`plan-sprint-4c.md`** — real, distinct sprint identities
("Sprint 4b", "Sprint 4c"), each with its own plan and its own tasks, alongside a separate
`plan-sprint-4.md`. A numeric-only match resolves `plan-sprint-4c.md` to `Sprint 4`.

**A wrong identity is strictly worse than no identity.** With no identity, rule 1 is inert and
`unresolved-plan-sprint` warns the reader. With a *wrong* identity, rule 1 becomes live and silently
compares briefs against the wrong sprint name — every Sprint 4c brief now looks like it belongs to
another sprint, so rule 1 skips the status cross-check on the entire board and reports nothing. That
is the genuine silent failure.

Whatever pattern you land on must either handle the letter suffix or **refuse the file and report
`unresolved-plan-sprint`**. This is a constraint, not a proposed solution — the design call is yours.

A second shape to weigh: we also have `hotfix-post-sprint2.md`
(H1 `# Geoconflict — Post-Sprint 2 Hotfix Tasks`), a real plan that is deliberately *not* Sprint 2. A
loosened "find `Sprint <N>` anywhere" matcher would claim it. Prose containment is not identity.

## 7. Real-world naming samples

You cannot get this from your own repo, so it is the main thing we can contribute. Every plan
document we have, verbatim:

| Filename | H1 | Status heading present? |
|---|---|---|
| `plan-index.md` | `# Geoconflict — Execution Plan Index` | **none** |
| `plan-sprint-4.md` | `# Geoconflict — Sprint 4 — In-App Monetization & Citizenship` | `## Sprint 4 Status` |
| `plan-sprint-4c.md` | `# Geoconflict — Sprint 4c — Production Stabilization` | `## Sprint 4c Status` |
| `plan-sprint-5.md` | `# Geoconflict — Sprint 5 — Full F2P Loop & Social Features` | **none** |
| `plan-sprint-6.md` | `# Geoconflict — Sprint 6 — More Content` | `## Sprint 6 Status` |
| `sprint-backlog.md` | `# Geoconflict — Sprint Backlog` | `## Status` ✅ |
| `backlog.md` | `# Backlog — the default home for unsprinted task briefs` | `## Status` ✅ |
| `done/plan-sprint-1.md` | `# Geoconflict — Sprint 1 — Stop the Bleeding` | **none** |
| `done/plan-sprint-2.md` | `# Geoconflict — Sprint 2 — Fix Onboarding` | **none** |
| `done/plan-sprint-3.md` | `# Geoconflict — Sprint 3 — Deepen Retention (Data-Driven)` | `## Sprint 3 Status` |
| `done/plan-sprint-4b.md` | `# Geoconflict — Sprint 4b — Interim Game Variety Update` | `## Sprint 4b Status` |
| `done/hotfix-post-sprint2.md` | `# Geoconflict — Post-Sprint 2 Hotfix Tasks` | **none** |

**Three patterns worth noting:**

1. **Every H1 is `# <Product> — <Sprint identity> — <theme>`.** The product name first is
   near-universal for us. If you want a matcher that works on real documents, that is the shape to
   accommodate.
2. **`## Sprint <N> Status` is our dominant status heading**, not `## Status`. That is *our* data
   defect — we have our own task open to rename them, and we are not asking you to change
   `STATUS_HEADING_RE`. We mention it only so the next point makes sense.
3. Because of (2), **five of our plans currently `die` at `:206`** (`no '## Status' section`) before
   reaching any drift logic. So on our repo today, fixing `PLAN_SPRINT` alone changes exactly one
   line of live output. **This is why we are reporting it as a defect rather than shipping you a
   before/after from our boards — the proof has to be a fixture.** The defect is real and repo-wide;
   it is simply masked behind an earlier failure that is ours to fix.

## 8. Related, and clearly a separate call for you

`fkit-status/SKILL.md:26` resolves the **active sprint** by globbing `sprint-*.md` in
`ai-agents/sprints/`. With our `plan-` prefix, the only file matching that glob is
`sprint-backlog.md` — a board of explicitly unscheduled work. So a bare `/fkit-status` resolves the
wrong board as "the active sprint".

It is the **same naming mismatch** as §2, in a second place, which is why we flag it here — a fix to
the filename matcher that does not also consider the glob leaves half the problem standing. But
whether the glob should widen, or whether projects should be told to name plans `sprint-N.md`, is a
product call we are not making for you.

(Your `backlog.md` template already documents the glob hazard in its own header text, which is how we
noticed.)

## 9. What we are asking for

Nothing urgent. We have no local patch and we are not carrying one — the file is installed from your
share and we would rather take the fix in a release than diverge from the manifest.

Suggested order if you pick it up:

1. Add the red fixture from §5. It is the cheapest thing here and it makes the rest concrete.
2. Decide the resolution strategy under the §6 constraint.
3. Keep the §4 regression guard.
4. Decide §8 separately.

Happy to test a pre-release against the naming samples in §7 — that table is the shape a real project
drifts into, and it is probably a reasonable fixture set on its own.
