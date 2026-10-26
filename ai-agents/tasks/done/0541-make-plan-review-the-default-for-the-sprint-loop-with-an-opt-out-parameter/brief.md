# Make plan review the default for the sprint loop, with an opt-out parameter (provisional owner ruling)

## ID
0541

## Sprint
Sprint 12

## Priority
P11

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Where this comes from.** Task `0474` trialled opt-in plan review (`/fkit-sprint-ship-loop
--plan-review`, [ADR-056](../../../knowledge-base/decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md))
over 14 tasks and 4 runs. The trial summary is
[`2026-10-24-plan-review-trial-summary.md`](../../../knowledge-base/reports/2026-10-24-plan-review-trial-summary.md);
its §9 holds the ruling below. Plan review today: before the owner sees a task's plan, the producer
and/or the architect approve it, then the adversarial reviewer attacks it on Codex. It runs only when
the owner starts a sprint-loop run with `--plan-review`; without it, the run behaves as it did before
ADR-056.

**The owner's ruling — his own words, typed by him** (via `AskUserQuestion`, 2026-10-24, `fkit lead`
session, relayed verbatim to a spawned `fkit-producer`):

- Q1, *"Across the 14 tasks, did plan review help you?"* — typed by him, not an option:

  > *"I feel like it helped me, but it's really hard to tell, because all the things were happening
  > "behind the scene" without my involvement. Overall, I feel good about it, but I would like still have
  > a chance to switch it off, if needed. So my idea is to make this new process default, but not to
  > delete the old one, and to keep the old one available via a parameter, until I test the new version
  > of fkit in real projects for some time and make the final decision."*

- Q2, *"Trial over — what should happen to plan review: Default, Optional, or Drop?"* (options he saw:
  *Optional (Recommended)* / *Default* / *Drop*) — typed by him: *"I think I answered the question in the
  1st answer"*.

- **The lead's reading** (fkit-lead's, recorded as such; not the owner's words): ruling = **Default,
  provisional** — plan review on by default in every sprint-loop run; the no-plan-review path kept,
  selectable by a parameter (opt-out); the final decision deferred until he has used the new fkit on real
  projects for some time.

- Q3, placement — selected option text, verbatim: *"Sprint 12 (Recommended)"*. Description he saw: *"The
  only open sprint, so your next /fkit-sprint-ship-loop picks it up. No open task waits on it."*

**This is provisional.** The owner makes the final decision after real-project use. **Until then the
opt-out stays**, and the old (no-plan-review) path must keep working exactly as it does today. Removing
the opt-out, or making plan review permanent, is a later owner ruling and a later task — not this one.

**Locked decisions this task changes — on the ruling above, not around it.**

- **ADR-056 Decision 2** — *"The switch is a run-level flag, default off"*; `fkit-lead` *"passes it
  **only when the owner asks**, **never adds it unasked**"*.
- **ADR-056 Decision 10** lists *"making it the default (Decision 9)"* as out of scope, and its *Options
  considered* rejects *"Plan review on by default, with an opt-out"* on the owner's 2026-10-01 words
  (*"the old approach should be our "by default" one"*). The 2026-10-24 ruling above is the new owner
  ruling that changes this.
- **ADR-056's own amendment rule, Decision 9:** *"Making plan review the default … needs a new owner
  ruling, recorded as a new ADR or a dated note here."* So the ruling must be recorded **in the ADR set**
  (a new ADR, or a dated note on ADR-056), quoting the owner's words above **verbatim**, with date and
  channel, and saying it is provisional.
- **ADR-056 Decision 2's Q3 ruling** (2026-10-06, *"Only when it's on (Recommended)"*) set what an
  **off** run reports (*"exactly as today"*) in an opt-in world. With the default flipped, what an on run
  and an opted-out run each report is open — see *Open questions*.

**Unchanged by this task** (ADR-056 decisions that stay as they are unless the plan raises one to the
owner): the plan gate is still the one human checkpoint, and the owner still approves last (Decision 5;
ADR-019 Decision 2; ADR-032 Decisions 3 and 7); the classification rule (Decision 1); the flow and its
2-round cap (Decision 4); `plan-review.md` (Decision 6); the hop design (Decision 7); *"trust, not
proof"* (Decision 8); session paths (Decision 3) — see *Open questions* on that last one.

**Codex is optional** ([ADR-054](../../../knowledge-base/decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md)).
With plan review on by default, a project without Codex gets a Claude-only plan pass on every task,
loudly flagged *NOT model-diverse* (ADR-056 Decision 4). That is existing behaviour, now reached by
default; the plan should say so.

**Tests.** The text-presence test `0473` shipped, `test/plan-review-switch.test.js`, is no longer in
`test/` (checked 2026-10-24). Under
[ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
§D2.1, any **new** test file needs the owner's OK, file by file.

## What to build

1. **Plan review is on by default** for every task planned in a `/fkit-sprint-ship-loop` run — with no
   parameter given, the run behaves as a `--plan-review` run does today.
2. **The no-plan-review path stays, selectable by a parameter (opt-out).** A run started with that
   parameter behaves exactly as a run without `--plan-review` does today. **Do not delete the old path.**
   The parameter's name and form are **not chosen here** — the architect and coder choose them in the
   plan, and the owner approves them at the plan gate.
3. **The lead's rules follow the flip.** Today the lead adds `--plan-review` only when the owner asks.
   After this task, the lead uses the opt-out only when the owner asks, never adds it unasked, and never
   carries it to another run — the same discipline, the other way round (ADR-056 Decision 2's wording,
   mirrored). The switch line still names the owner's ruling (ADR-037).
4. **Amend ADR-056 by its own Decision 9** — a new ADR or a dated note on ADR-056 (the architect's choice
   of form; Decision 9 allows either). It records: the owner's 2026-10-24 ruling **verbatim** (Q1 and Q2
   above, with date and channel), the lead's reading labelled as the lead's, that the ruling is
   **provisional** and the opt-out stays until the owner's final decision after real-project use, and
   which ADR-056 decisions it changes (at least Decision 2, Decision 9 and Decision 10, and the rejected
   option under *Options considered*). The ADR text already there stays byte-identical, per ADR-056's own
   correction convention.
5. **Every place that says plan review is off by default, or that the lead passes the flag only when
   asked, is brought in line.** Starting list (a text search on 2026-10-24, not proven complete — the plan
   does its own sweep): `claude/skills/fkit-sprint-ship-loop/SKILL.md` (the *"**Argument:**"* paragraph,
   the gated block between `<!-- plan-review:begin -->` and `<!-- plan-review:end -->`, and the reporting
   section), `claude/agents/fkit-lead.md`. Also check the other files that mention plan review:
   `claude/skills/fkit-plan-task/SKILL.md`, `claude/agents/fkit-coder.md`, `fkit-producer.md`,
   `fkit-architect.md`, `claude/skills/fkit-adversarial-review/SKILL.md`, and the scaffold READMEs under
   `claude/scaffold/ai-agents/`. Edit the canonical sources under `claude/`, never the `.claude/` copies.
6. Code and prose comments say **why**, not what (`conventions/code-comments.md`).

**Not in this task** (from the trial summary; not filed — the owner's call whether to file them):
the post-Codex fix-text gap (summary §5: fix text written after Codex reaches the owner unreviewed; all 4
plan-review-caused code-review findings came from it), and the recurring send slips (summary §7:
placeholder sends, edits after `APPROVE` without a re-ask).

## Verification steps

1. **Default on:** a hand walk-through of the edited `fkit-sprint-ship-loop` text, from a run started
   with no parameter, reaches the plan-review block for every task planned in that run, and the
   plan-only coder spawn carries the switch line.
2. **Opt-out works and is the old path:** the same walk-through from a run started with the opt-out
   parameter skips the plan-review block entirely; the plan step, the plan gate and the reports read as a
   run without `--plan-review` does today. A `git diff` shows the old path's text was kept, not deleted.
3. **The lead:** `claude/agents/fkit-lead.md` says it uses the opt-out only when the owner asks, never
   unasked, and never carries it to another run.
4. **ADR:** the new ADR or dated note on ADR-056 exists, quotes the owner's 2026-10-24 words verbatim
   (diff them against this brief's *Context*), labels the lead's reading as the lead's, says
   "provisional" and that the opt-out stays until the owner's final decision, and names the decisions it
   changes. ADR-056's existing text is byte-identical (`git diff` shows only additions).
5. **No stale "off by default" text left:** a search of `claude/` for `--plan-review`, "off by default",
   "default off", "only when the owner asks" and "never adds it unasked" shows each remaining hit is
   correct after the flip, or is historical/quoted text marked as such. The worklog lists each hit and
   its verdict.
6. **Live check:** one `/fkit-sprint-ship-loop` run started from a fresh `fkit lead` launch after the
   `.claude/` copies are refreshed (agent prompts only reach a relaunched session — see `0474`'s brief,
   *Notes*, *"Before the first trial run: relaunch `fkit lead`"*), with no parameter, shows *"Plan review:
   on"* (or whatever reporting the owner rules) — or, if no such run is possible inside this task, the
   worklog says so and the check is marked **not run**, never passed.
7. `npm test` stays green, within the 2-minute budget (ADR-057 §D10). No new test file unless the owner
   approves it by name (ADR-057 §D2.1).

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Knock-on of placing it on Sprint 12:** none — no open task waits on it (checked 2026-10-24; per the
  owner's Q3 option description, *"No open task waits on it."*).
- ⚠️ Priority P11 is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly below 0474**, because it is the follow-up that `0474`'s ruling asks
  for, and no other open row on Sprint 12 competes with it.
- **Classification hint, not a ruling:** this changes what fkit delivers to its users (the sprint loop's
  default behaviour), so under ADR-056 Decision 1 it reads as a **product change** — producer and
  architect approve, if this task is itself planned with plan review on. The coder classifies.
- **Wiki:** once this lands, `fkit-wiki` should re-ingest ADR-056 (and the new ADR or note), and the
  `0473` task page, which says *"Default unchanged"*. No other role writes the vault.
- **Open questions** (listed, not resolved — the plan puts them to the owner at the plan gate, or the
  architect decides where marked):
  1. **Scope of "default".** Only `/fkit-sprint-ship-loop` runs (ADR-056 Decision 3 keeps `fkit coder`
     sessions, `/fkit-task-ship-loop` and a plain `/fkit-plan-task` without plan review), or also the
     session paths? This brief takes sprint-loop runs only, per the lead's reading; the owner's words say
     *"make this new process default"* and do not name the paths.
  2. **What the reports say.** ADR-056's Q3 ruling: an off run reports *"exactly as today"*, and *"Plan
     review: on"* appears only when on. After the flip, does every default run say *"Plan review: on"*,
     and does an opted-out run say anything (e.g. a line that plan review was switched off)? This was an
     owner ruling, so changing it is his call.
  3. **The parameter.** Its name and form, and whether the old `--plan-review` flag is still accepted
     (e.g. as a harmless no-op) so an owner habit or an old note does not break a run. Architect and coder
     decide; the owner approves at the plan gate.
  4. **ADR form** — a new ADR or a dated note on ADR-056 (Decision 9 allows either). The architect's call.
  5. **Codex-less projects.** With the default on, every plan pass in a project without Codex runs
     Claude-only, flagged. Is that acceptable as the default for consuming projects, or should the plan
     raise it? The plan should at least state it at the gate.
- **Filed 2026-10-24** by a spawned `fkit-producer` (no owner channel, ADR-021) at `fkit-lead`'s
  direction, on the owner rulings quoted in *Context*, relayed verbatim. ⛔ No commit.
