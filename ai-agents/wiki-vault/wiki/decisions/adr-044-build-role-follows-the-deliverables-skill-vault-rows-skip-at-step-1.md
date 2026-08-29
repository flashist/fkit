# ADR-044: The ship-loop's Build role follows the deliverable's skill; vault-deliverable rows are skipped at step 1 and reported

**Date**: 2026-08-27
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md`
**Deciders**: `fkit-architect` (analysis, as `0270`'s Plan worker); **owner signed off 2026-08-27** via `AskUserQuestion` in the live driver session
**Companion to**: [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — ⛔ **not amended, not superseded**

## Context

`/fkit-sprint-ship-loop` fixes its per-step roles by design and **never reads a task's `## Owner`**. So a row whose deliverable the fixed role cannot lawfully produce reaches Build, spawns `@fkit-coder`, and the coder must either **refuse** (the loop stalls) or **comply** (ADR-005 is breached). ⛔ **There is no third outcome**, and nothing detects the mismatch until Build — after the row is `🔄 In progress` and after the loop's single approval gate is already spent.

⭐⭐ **The ADR's first move is to reject the framing of its own brief.** The question is **not** *"should the loop read `## Owner`"*, because ⛔ **`## Owner` is a PROXY, not the thing itself** — `0171` is `## Owner: fkit-architect` and was built by a spawned **coder** without incident; `0280` carries the wiki theme but edits a skill file, not the vault. The real question is *which role may write the deliverable's target, and which skill produces it.*

### ⭐ Two walls, not one

- **A HARD wall — vault writes.** `ai-agents/wiki-vault/` is wiki-only under ADR-005, the universal hard rule, the coder's own agent file, and ADR-033. ⛔ **A wiki row needs a vault write at Build *and* at Process-review's fix step — and ADR-038 fixes Process-review to the coder.**
- **A SOFT wall — design deliverables.** An ADR or design spec is produced by an architect skill; a coder "building" one writes it **by hand** — ⭐ *the by-hand route ADR-038 names as the misroute, in reverse.* **Nothing hook-denies it; it is a quality and ownership defect, not an ADR-005 breach.**

### ⭐ It corrects its own brief on the record

The brief said an architect row *"has no beat left to stop at"*. ⛔ **There is a beat** — the loop's `NEEDS-DECISION` relay is a mid-run owner beat. ⭐ **This ADR's own run is the proof**: `0270`'s Plan step carried the analysis, the plan gate carried the sign-off, Build wrote the ADR. **The brief's *"no third outcome"* sentence, about the wiki row, stands** — the two claims are about different rows and only the first is wrong.

### ⭐ The closeout question, answered BEFORE the options were weighed

ADR-038's closing line — *"Anything else that re-argues (b) from deliverable authorship is closeout, not a new finding"* — **bars candidate 1 for Process-review, and does not reach Build or Plan.**

⭐ **The reasoning is mechanical, not nominal:** deriving Process-review's role from `## Owner` hands the step to a role that does not own the skill, so the ADR-018 hook denies it and the worker applies the method **by hand** — *"the exact author-runs-its-own-process-review outcome (b) was rejected for, under a new label. The axis is nominally different; its effect is the same."* ⛔ **And the discharge deliberately does NOT rest on `## Owner` and authorship coinciding — they do not.**

## Decision

Owner ruling, verbatim label: **"A: Build role follows the deliverable's skill + vault rows skipped (Recommended)"**.

1. **Build's role is the owner, in `skills_for_role()`, of the skill the deliverable is produced by.** ⭐ **A deliverable that names NO skill — source, tests, scaffold, prose under `claude/`, coordination-doc repairs — is the coder's, whatever `## Owner` says.**
2. **Plan's role is the Build role, by hand where that role does not own `/fkit-plan-task`.** ⚠️ **This clause is an owner-ruled SCOPED EXCEPTION to ADR-038, named as one** — unlike Build, Plan *does* run a skill, so ADR-038 fixes Plan = coder and this departs from it. ⛔ Scope: the Plan step, on non-coder rows, in this loop, **and nothing else.**
3. **Verify stays coder · Review stays reviewer · Process-review stays coder · Close stays producer.**
4. **Rows whose deliverable is a vault write are SKIPPED at step 1 and reported** — a **cheap approximation** (the dashboard's Owner column reads `fkit-wiki`) plus a **backstop at the plan gate** (the Plan worker returns `BLOCKED` if any plan turns out to need a vault write). ⭐ **A blank `## Owner` is not-eligible-until-repaired, never treated as coder.** Handling is a new roll-up class **`out-of-scope-for-this-driver`** — ⛔ not `pending`, not `🚧 Blocked`, status untouched, **each row's route named**, and ⭐ **listed in the step-1 report and again in the final roll-up, never only in a footer.**
5. **Mid-work owner beats are the existing `NEEDS-DECISION` relay.** No new gate.
6. **The owner may still exclude any row by ruling** — Sprint 5's mechanism stays available; it simply stops being the only answer.

## Consequences

⭐ **Chosen because it accounts for all eight non-coder rows the loop drove in the measured population** (Sprints 3–6 and the 123 Backlog rows) while leaving ADR-005 intact and ADR-038 amended in nothing. ⚠️ **"Accounts for" is not "reproduces"** — on `0178` and `0218` the rule would have staffed Build **differently from how it actually ran.** ⚠️ **And the count is bounded by the measurement, not by all loop history.**

### ⛔ Costs, stated plainly

- **Prose-enforced, no prevention.** A driver that spawns the wrong role by hand never reaches the ADR-018 hook. Detection is open task `0224`.
- **A widening** — two more roles may write their own deliverables as spawned Build workers. ⛔ **The same trust-not-proof posture as the coder's; not a new guarantee and must not be described as one.**
- **The step-1 predicate is an APPROXIMATION.** ⛔ *"A driver that skips the backstop has a hole."*
- ⭐⭐ **Decision 1's skill-less clause is the change with the widest reach, and it was owner-confirmed as intended.** Re-measured 2026-08-28 over the 123 Backlog rows: it reaches **all 13 `## Owner: fkit-producer` rows**, not a handful — **none names a producing skill**, so all 13 are staffed with the coder. ⚠️ **A mention is not a producing skill**: five cite a producer skill purely as a *reference*, checkably so.
- ⭐⭐ **The worst-in-kind exposure, measured:** of the 13, **nine carry a real `/fkit-*` token and EIGHT name a producer-EXCLUSIVE skill.** ⛔ **That is the misroute shape exactly, at scale** — a grep-based oracle would read a producer-exclusive skill out of a brief whose deliverable runs no skill, and route **8 of 13 rows back to the producer**, reproducing the very staffing this ADR replaces. ⛔ **A future oracle must read the deliverable's producing skill, never grep the brief for skill names.**

### Re-raise only if

1. The skipped class stops being marginal — then reopen with **candidate 5** (a conditional "Apply (wiki)" sub-step), **not candidate 1**.
2. `skills_for_role()` gains per-artifact grant scoping.
3. The owner re-rules on `0200` or on this ADR's own rulings.
4. A Build deliverable appears whose producing skill has no owning role, or whose target is neither source nor vault nor a skill-produced document.

⛔ **Do NOT re-raise on:** *"the loop should read `## Owner`"* (answered by deliverable, not field — `0171` is the counter-example); *"the architect row needs a second owner beat"* (the relay is that beat); or anything re-arguing ADR-038's option (b) from authorship.

## Related
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — the companion rule, **not amended**, whose closeout clause this discharges explicitly
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the vault-write rule that makes the wiki wall hard
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the wiki-stays-wiki-only and close-stays-producer clauses
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop's single approval gate this decides *before*
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the named-ruling mechanism that let this ADR's own architect Build run
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook a mis-staffed step never reaches
- [[tasks/decide-how-the-ship-loop-handles-a-non-coder-owned-task-row]] — `0270`, the task that produced this ADR
- [[systems/role-locked-sessions]] — `skills_for_role()`, the lookup Decision 1 keys on
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — *added 2026-08-29:* the board this ADR was decided on, and the loop it changes
- [[tasks/record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — *added 2026-08-29 (lint):* `0222`, the task that recorded ADR-038 — the rule this ADR is the companion to and does **not** amend
