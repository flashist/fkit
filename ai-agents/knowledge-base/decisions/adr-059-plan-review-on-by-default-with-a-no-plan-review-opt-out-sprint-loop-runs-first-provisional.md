# ADR-059: Plan review on by default, with a `--no-plan-review` opt-out — sprint-loop runs first, other paths after a design task (provisional)

- **Status:** accepted — **provisional**. The owner makes the final decision after using the new fkit
  on real projects; until then the opt-out stays (see *Re-raise only if*).
- **Date:** 2026-10-24
- **Deciders:** owner (Mark Dolbyrev). Recorded by `fkit-architect`, spawned by `fkit-lead` driving
  `/fkit-sprint-ship-loop` on Sprint 12, after plan approval and before Build (task `0541`'s plan,
  §*"2. Steps"*, *"Step 0 — ADR, recorded by fkit-architect"*). The architect had no owner channel
  (ADR-021); every owner word below reached it as a verbatim relay from `fkit-lead`.
- **Task:** `0541` (`0541-make-plan-review-the-default-for-the-sprint-loop-with-an-opt-out-parameter`).
- **Amends:** [ADR-056](adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md), by that
  ADR's own Decision 9 (*"Making plan review the default … needs a new owner ruling, recorded as a new
  ADR or a dated note here"*). ADR-056 stays `accepted`; it gains one *"Amended by"* header bullet and
  one dated ⛔ note at its end, and its existing text is left byte-identical.
- **Does not supersede:** ADR-056 as a whole. Its flow (Decisions 1, 4–7) is what now runs by default.
- **Amended by:** [ADR-060](adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md)
  (2026-10-24, provisional; owner probe pending) — **Decision 3** (session paths not changed yet) is
  amended: the design task `0542` landed its design, and plan review becomes the default on the session
  paths by a launcher session line, off with `--no-plan-review`. Not delivered until its builds land.
  **Decision 2 (spawned coders) is unchanged.** The passages it changes are listed in the ⛔ note at
  the end of this file.

> **Citation form** (same as ADR-056's). Agent, skill and hook files are mutable: cited by **section
> plus quoted phrase**, never by line number. Task briefs and plans are coordination documents: cited by
> **heading plus quoted phrase**. Where this ADR describes text that task `0541`'s Build **will write**,
> it says so; it does not cite it as present.

> **What this ADR decides, in one line:** the owner wants plan review **on by default on every path**;
> this ADR turns it on by default **in `/fkit-sprint-ship-loop` runs only**, with `--no-plan-review` to
> switch it off for one run; the session paths stay as they are (ADR-056 Decision 3) until a separate
> design task lands; the whole thing is **provisional**.

## Context

**Where this comes from.** Task `0474` trialled ADR-056's opt-in plan review over 14 tasks and 4 runs.
The trial summary is
[`2026-10-24-plan-review-trial-summary.md`](../reports/2026-10-24-plan-review-trial-summary.md); its
§9 holds the ruling below, and task `0541`'s brief, §Context, quotes it.

**The owner's trial ruling, his own words, typed by him** — 2026-10-24, `fkit lead` session, via
`AskUserQuestion`, relayed verbatim to a spawned `fkit-producer` (quoted from `0541`'s brief,
§Context, *"The owner's ruling — his own words, typed by him"*):

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

**The owner's plan-gate answers** — 2026-10-24 (~14:19 UTC), `fkit lead` session driving
`/fkit-sprint-ship-loop` on Sprint 12, via `AskUserQuestion`, relayed verbatim to fkit-architect by
fkit-lead. Selected option text and the description he saw, verbatim:

- *"Approve the 0541 plan as presented?"* → selected: *"Approve"*.
- *"Q1 — Where should plan review be on by default?"* → selected: *"All paths"* — description he saw:
  *"Needs a separate design task first; this task ships only the sprint-loop part."*
- *"Q2 — What should run reports say about plan review?"* → selected: *"Say both ways (Recommended)"* —
  description: *"Default run: "Plan review: ON (default)". Opted-out run: "Plan review: off
  (--no-plan-review)"."*
- *"Q3 — Projects without Codex: what happens?"* → selected: *"Accept, flagged (Recommended)"* —
  description: *"Claude-only plan pass, loudly flagged NOT model-diverse; opt out with
  --no-plan-review."*

⚠️ **Q1 went against the plan's recommendation**, which was *"Sprint-loop runs only"* (task `0541`'s
plan, §*"5. Open questions for the owner"*, Q1: *"Architect and coder both recommend sprint loop
only"*). This ADR records his choice as he made it — and, as the option he picked says, ships only
the sprint-loop part now.

**Facts this decision is built on.**

- **ADR-056 locked the default off and named how to change it.** Decision 2: *"The switch is a
  run-level flag, default off"*; *"`fkit-lead` passes it **only when the owner asks**, **never adds it
  unasked**"*. Decision 9: changing the default *"needs a new owner ruling, recorded as a new ADR or a
  dated note here"*. Its *Options considered* rejected *"Plan review on by default, with an opt-out"* on
  the owner's 2026-10-01 words (*"the old approach should be our "by default" one"*). The 2026-10-24
  ruling above is the new owner ruling Decision 9 asks for.
- **The switch reaches the worker as one line in the spawn prompt.** `fkit-plan-task`'s gated section
  runs *"only if your spawn prompt carries the driver's switch line"*, and *"Nothing else turns it on"*
  (`claude/skills/fkit-plan-task/SKILL.md`, gated section; verified against live code 2026-10-24). The
  sprint loop's gated block sits between `<!-- plan-review:begin -->` and `<!-- plan-review:end -->`
  in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, and its *"**Argument:**"* paragraph reads *"One
  operand, plus one optional flag"* (verified 2026-10-24).
- **The session paths never had plan review**, by the owner's 2026-10-06 ruling (ADR-056 Decision 3,
  *"Sprint-loop runs only (Recommended)"*). Turning it on there is new design work, not a flag flip:
  ADR-056's rejected option *"A per-task brief field"* already names one unknown — *"whether a spawned
  adversarial reviewer can write `.fkit/tmp/` under it [plan mode] is unverified"*. The adversarial
  reviewer still assembles its prompt in `.fkit/tmp/` (`claude/skills/fkit-adversarial-review/SKILL.md`,
  step 2, *"Assemble the prompt into a per-run file"*; verified 2026-10-24).
- **The trial's time cost:** *"**Typical: about 17 minutes** (median of the 13 tasks with a figure;
  range ~9½ to ~31 minutes)"*, wall-clock (trial summary, timing section).
- **Codex is optional** ([ADR-054](adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md)).
  Without it the plan's attack pass is Claude-only and flagged *NOT model-diverse* (ADR-056 Decision 4).
- **`0473`'s text-presence test is gone.** `test/plan-review-switch.test.js` is no longer in `test/`
  (checked 2026-10-24); under [ADR-057](adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
  §D2.1 a new test file needs the owner's OK by name. No mechanical check pins the two copies of the
  switch line (see *Negative / costs*).

## Decision

1. **The owner's intent: plan review on by default on all paths** (owner, 2026-10-24, Q1, *"All
   paths"*). That means the sprint loop, the `fkit coder` session, `/fkit-task-ship-loop` and a plain
   `/fkit-plan-task`. **This ADR delivers only the first.**

2. **Shipped now — sprint-loop runs only (task `0541`).** A `/fkit-sprint-ship-loop` run with no flag
   runs plan review for every task it plans, exactly as a `--plan-review` run did under ADR-056. The
   default lives **in the driver only**; `fkit-plan-task`'s gate keeps its rule — it runs only when the
   driver's switch line is present, and *"Nothing else turns it on"* still holds. A brief *about* plan
   review still cannot trigger it.

3. **The session paths are not changed yet, and ADR-056 Decision 3 stays in force for them.** `fkit
   coder` sessions, `/fkit-task-ship-loop` and a plain `/fkit-plan-task` behave exactly as today until
   a **separate design task** lands and a new ADR amends Decision 3. That task is **`0542`**
   (`0542-design-plan-review-on-by-default-for-the-coder-session-task-ship-loop-and-plain-plan-task`),
   filed 2026-10-24 on Sprint 12, depending on `0541` (owner's placement answer, *"Sprint 12
   (Recommended)"*). **Why not now — open design
   questions, the architect's list, none verified:**
   - **Plan mode vs the Codex temp file.** A session coder plans in plan mode; whether a spawned
     adversarial reviewer can write its `.fkit/tmp/` prompt file under it is unverified (ADR-056,
     rejected option *"A per-task brief field"*).
   - **No driver to send the switch line.** The gate keys on a *driver's* switch line. A session has no
     driver, so it needs a different, still-trustworthy way to say "on" that a brief cannot fake.
   - **A different hop chain.** ADR-056 Decision 7 fits *lead (hop 0) → coder (hop 1) → approvers
     (hop 2)*. In a `fkit coder` session the coder is hop 0, so the chain and its limits change.
   - **Who writes `plan-review.md`.** In the sprint loop the driver writes it (ADR-056 Decision 6). A
     session path has no separate driver.
   - **`/fkit-task-ship-loop`'s own plan gate** (ADR-019 Decision 2) would need its own gated block.

4. **The opt-out: `--no-plan-review`.** `/fkit-sprint-ship-loop [<sprint-plan>] --no-plan-review`
   skips the gated block for every task planned in that run, and the run behaves as a run without
   `--plan-review` did under ADR-056. **The old path is kept, not deleted:** the
   `<!-- plan-review:begin/end -->` blocks stay and their flow is unchanged; their gating sentence
   flips, and the wording that follows from it — heading, report lines, switch line (Decisions 6 and
   7) — is updated to match.
   - **`--plan-review` is still accepted, as a harmless no-op** ("on"), so an old habit or note does not
     break a run.
   - **Both flags together, or any unrecognised `--` token, stop the run before its first spawn**, and
     the driver reports it and asks. The driver never guesses: a typo like `--no-plan-reveiw` would
     otherwise run *with* plan review, quietly, against what the owner asked for.
   - **Read once at run start**, holds for every task planned in the run, never flipped mid-run, never
     carried to another run (unchanged from ADR-056 Decision 2).
   - **It passes the one-skill-one-output litmus** (`conventions/one-skill-one-output.md`, *"does the
     argument change *what the skill works on*, or *what the same work looks like when reported*?"*):
     `--no-plan-review` changes *what work the plan step does*, so it is a parameter of the work — the
     same argument as ADR-056 Decision 2. Build updates the *"**Argument:**"* paragraph's *"one optional
     flag"* wording.

5. **The lead's rules, mirrored.** `fkit-lead` uses `--no-plan-review` **only when the owner asks**,
   **never adds it unasked**, and **never carries it to another run**. The next run is on unless he
   asks for the opt-out again. (ADR-056 Decision 2's discipline, the other way round.)

6. **The switch line** — one fixed text, whether or not `--plan-review` was also passed:

   `Plan review: on — the default for fkit-sprint-ship-loop runs (owner ruling 2026-10-24, ADR-059), run <board> started <UTC>`

   It still names an owner ruling, now the standing default ruling (ADR-037's driver-side discipline).
   **`fkit-plan-task`'s gate accepts this line and the pre-ADR-059 line** (`Plan review: on — set by the
   owner for this fkit-sprint-ship-loop run (--plan-review, <date>), run <board> started <UTC>`). Why:
   if a stale driver copy meets a refreshed `fkit-plan-task`, plan review would otherwise be skipped
   silently in a run the owner believes is reviewed. Both forms are driver switch lines, so *"Nothing
   else turns it on"* still holds.

7. **What reports say** (owner, 2026-10-24, Q2, *"Say both ways (Recommended)"*):
   - a default run says *"Plan review: ON (default)"*;
   - an opted-out run says *"Plan review: off (--no-plan-review)"*.

   This replaces ADR-056 Decision 2's Q3 rule (*"Plan review: on"* only when on; an off run reports
   exactly as today). **Placement — the architect's reading, not the owner's words:** the line goes
   where ADR-056 Decision 2 put it, the run's opening report and its roll-up; the roll-up still carries
   each task's Codex plan-pass mode. A report with **neither** line is a defect, not a quiet "off".

8. **Codex-less projects** (owner, 2026-10-24, Q3, *"Accept, flagged (Recommended)"*): every
   sprint-loop plan pass there runs Claude-only, loudly flagged *NOT model-diverse*, as ADR-056
   Decision 4 already does for an on run. Owners who do not want it use `--no-plan-review`; the
   CHANGELOG line says so. Turning plan review off automatically without Codex was **not** chosen.

9. **Unchanged:** ADR-056 Decisions 1 (classification), 3 (session paths — see Decision 3 above),
   4 (the flow and its 2-round cap), 5 (the plan gate is still the one human checkpoint; the owner
   approves last — ADR-019 Decision 2, ADR-032 Decisions 3 and 7), 6 (`plan-review.md`), 7 (hop
   design). Decision 8 (*"trust, not proof"*) holds, with its exposure turned round — see
   *Negative / costs*.

### ADR-056 passages this ADR changes

Each is **left byte-identical** in ADR-056 as the record of 2026-10-06; ADR-056's end-of-file ⛔ note
points here. Read them through this ADR:

- **The title and filename** (*"… switched per sprint-loop run, off by default"*) — kept as history;
  the default is now on in sprint-loop runs.
- **The *"What this ADR decides, in one line"* block** — *"A run without the flag … behaves exactly as
  today"* now holds for a run started with `--no-plan-review`, and for the session paths.
- **Decision 2** — *"default off"*; *"Absent means off"*; *"passes it **only when the owner asks**,
  **never adds it unasked**"*; and its Q3 reporting rule. Replaced by Decisions 4, 5 and 7 above.
- **Decision 8** — *"A confused or injected driver could add the switch line unasked"*: the exposure
  flips. A driver could now **drop** the line in a default run, or **add** it in an opted-out run.
- **Decision 9** — *"Nothing in this ADR turns it on by default."* This ADR does, for sprint-loop runs.
- **Decision 10** — *"making it the default (Decision 9)"* is no longer out of scope. *"session-path
  plan review (Decision 3)"* stays out of scope for what ships, but is now the owner's stated intent
  (Decision 1 above).
- **The rejected option *"Plan review on by default, with an opt-out"*** — now chosen, on the
  2026-10-24 ruling.
- **Consequences → Positive** — *"with zero risk to the default"* and *"Off really means off: no flag,
  no new behaviour, no new report line"*. Off now needs a flag, and an off run gets one report line.
- **Re-raise items** — *"Re-raise on `0474`'s verdict"* is used up (this ADR is that verdict's ruling).
  The leak trigger becomes *"plan review running in a `--no-plan-review` run, or missing from a default
  run"*. *"Do **not** re-raise "plan review should be the default""* is dropped. *"… or "should cover
  sessions""* as a defect stays — it is now routed to the design task in Decision 3, not to `0474`.

**Pointer notes left as dated history:** ADR-019 (below Decision 2), ADR-020 (below its `0207`
correction note) and ADR-032 (below Decision 3) carry ⚠️ notes that say *"default off"*. They were true as of 2026-10-06 and are read
through ADR-056, whose new header bullet sends readers here. They are not edited.

## Options considered

- **Sprint loop now, session paths after a design task, opt-out flag in the driver (chosen).** Gives
  the owner his default where it already works and is trialled, keeps the old path one flag away, and
  does not ship plan review onto paths with unanswered design questions.
- **All paths at once, in `0541`.** Not done: the session paths carry the open questions in Decision
  3, none verified. The owner's own choice (*"Needs a separate design task first; this task ships only
  the sprint-loop part."*) sequences it this way.
- **Sprint-loop runs only, as the final scope.** The plan's recommendation (task `0541`'s plan, §5,
  Q1). Not chosen: the owner picked *"All paths"*.
- **Default in `fkit-plan-task` itself (run unless told not to).** Rejected: it would turn plan review
  on in every session path at once, against Decision 3, and a missing switch line would mean "on", so
  any spawn that forgot the opt-out would run it.
- **A dated note on ADR-056 instead of a new ADR.** Rejected (architect's call on form, plan D8):
  ADR-056's title says *"off by default"*, the change reverses one of its decisions (⛔ by the legend),
  and it is provisional with a later ruling due. Precedent: ADR-054 amending ADR-009, with the note at
  the end.
- **Turn plan review off automatically when Codex is missing.** Rejected (owner, Q3, *"Accept,
  flagged (Recommended)"*).
- **Silent opted-out run** (an opted-out run reports nothing). Rejected (owner, Q2): with on as the
  default, silence would no longer say which path a run took.
- **Drop `--plan-review` entirely.** Rejected: an old habit or note would stop the run for no reason.

## Consequences

- **Positive:**
  - The owner gets what he asked for, provisionally: plan review by default, the old path one flag
    away, the final decision still his.
  - Every run's report says which path it took, so he can judge the default on real projects.
  - A misspelled or conflicting flag stops the run instead of quietly doing the wrong thing.
- **Negative / costs — stated plainly:**
  - **Every sprint-loop task pays plan review**: about 17 minutes wall-clock median in the trial
    (range ~9½–31), up to 3 asks × 2 approvers plus a Codex pass.
  - **Codex-less projects** get a Claude-only plan pass on every task, flagged *NOT model-diverse*
    (ADR-054), and still pay the time.
  - **Prose-enforced, exposure turned round** (ADR-056 Decision 8, same accepted cost). A driver could
    drop the switch line in a default run, so a plan reaches the owner unreviewed in a run he believes
    is reviewed. Two things make it visible, neither a guarantee: the report line *"Plan review: ON
    (default)"*, and the plan-gate presentation's attachments (who approved, what changed, Codex's
    findings — ADR-056 Decision 4.6), which a skipped review lacks.
  - **Two copies of the switch line can drift** (the driver block and the plan-task gate), and with
    `0473`'s text-presence test gone nothing mechanical pins them. Build edits both in one change;
    Decision 6's two-form gate softens a stale-copy mix.
  - **The owner's all-paths intent is not yet delivered.** Until the design task lands, a `fkit coder`
    session, `/fkit-task-ship-loop` or a plain `/fkit-plan-task` runs **no** plan review.
  - **The pointer notes in ADR-019/020/032 still say "default off"**, as dated history.
  - **ADR-052 phase 5 overlap** (`0453` rewrites both ship loops; also `0450`, `0451`, `0457`, all in
    backlog on 2026-10-24): whichever lands second carries the flipped default and the opt-out forward.
  - **The live check needs a relaunch.** Prompt changes reach a session only after `.claude/` is
    refreshed and `fkit lead` relaunched, so `0541` cannot prove the default live inside the Sprint 12
    run that builds it (task `0541`'s plan, §*"3. Verification"*, item 7).
- **Residual risks / "re-raise only if":**
  - **Re-raise on the owner's final ruling after real-project use** — keep the default, make it
    permanent and remove the opt-out, go back to opt-in, or drop plan review. The opt-out stays until
    then.
  - **Re-raise when the session-path design task (`0542`) lands** — it amends ADR-056 Decision 3 and this ADR's
    Decision 3 with a new ADR.
  - **Re-raise if plan review is found running in a `--no-plan-review` run, or missing from a default
    run**, or a plan is shown as reviewed when a review step did not run — found by the owner or in a
    `plan-review.md` record.
  - **Re-raise if an ADR-052 phase-5 change** drops the gated blocks, the flag, or `plan-review.md`.
  - **Re-raise if the hop limit (ADR-010 point 4) or the Codex runtime (ADR-054) changes** — as for
    ADR-056.
  - Do **not** re-raise *"`--no-plan-review` is an output variant"* — the litmus was applied (Decision
    4). Raise it only with a case where the flag changes how the same work is reported.
  - Do **not** re-raise *"the switch is only prose"* (ADR-056 Decision 8), *"every task now pays the
    time"* (stated at the gate; the owner approved the plan), or *"Codex-less projects get a Claude-only
    pass"* (owner, Q3) as defects.
  - Do **not** re-raise *"the session paths should have plan review too"* as a defect against `0541` —
    the owner wants it, and it is routed to the design task in Decision 3.

## Owner rulings, with provenance

- **2026-10-24**, `fkit lead` session, `AskUserQuestion`, typed by him, relayed verbatim to a spawned
  `fkit-producer`: the trial Q1 and Q2 answers quoted in *Context*. The lead's reading is labelled
  there as the lead's.
- **2026-10-24 (~14:19 UTC)**, `fkit lead` session driving `/fkit-sprint-ship-loop` (Sprint 12),
  `AskUserQuestion`, selected option text, relayed verbatim to fkit-architect by fkit-lead: plan
  approval *"Approve"*; Q1 *"All paths"*; Q2 *"Say both ways (Recommended)"*; Q3 *"Accept, flagged
  (Recommended)"* — each with the description quoted in *Context*. The plan approval covers the
  plan's D1–D9, including the flag names and the stop-on-conflict-or-typo rule (*"approved with the
  plan itself, not asked separately"*, plan §5).

*These rulings reached the architect as a relay from fkit-lead. By ADR-056 Decision 8 and ADR-055
Decision 7, that relay is trust, not proof — recorded here as relayed.*

## Related

- [ADR-056](adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md) — the flow, amended here
  (its Decision 9 is the amendment rule this ADR follows).
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) Decision 2,
  [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md),
  [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) Decisions 3 and 7 — the plan
  gate and the per-task artifacts; unchanged; their "default off" pointer notes are dated history.
- [ADR-037](adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)
  — why the switch line names an owner ruling.
- [ADR-054](adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md)
  — Codex optional; the flagged Claude-only pass.
- [ADR-057](adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) §D2.1 — why no new test file.
- [ADR-052](adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)
  phase 5 — the overlap.
- `conventions/one-skill-one-output.md` — the litmus the opt-out passes (Decision 4).
- Code `0541`'s Build edits (cited by section, mutable): `claude/skills/fkit-sprint-ship-loop/SKILL.md`
  *"**Argument:**"* paragraph, the `plan-review:begin/end` block and §Progress reporting;
  `claude/skills/fkit-plan-task/SKILL.md` gated section; `claude/agents/fkit-lead.md` bullet *"Plan
  review is opt-in, per sprint-loop run"*; `ai-agents/tasks/README.md` and its scaffold twin;
  `CHANGELOG.md`.
- Task `0541`'s brief and plan; the trial summary
  [`2026-10-24-plan-review-trial-summary.md`](../reports/2026-10-24-plan-review-trial-summary.md) §9.
- **Wiki:** **fkit-wiki** should ingest this ADR and re-ingest ADR-056 (new header bullet and ⛔ note)
  and the `0473` task page (*"Default unchanged"*) — an architect never writes the vault.

> ⛔ **Dated amendment 2026-10-24 (`0542`) — Decision 3 is amended by
> [ADR-060](adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md),
> provisional, and conditional on an owner-run probe that has not run yet; read it there.** Owner
> answers 2026-10-24 (~15:30 UTC, `fkit lead` session, `AskUserQuestion`, relayed verbatim; quoted in
> full in ADR-060). **Until ADR-060's builds land and `.claude/` is refreshed, the session paths still
> behave as Decision 3 says.**
>
> **Overturned here — do not follow these; read ADR-060 instead:**
> - **Decision 1:** *"This ADR delivers only the first"* — the other three paths are decided in ADR-060
>   (delivered by its builds);
> - **Decision 3:** *"The session paths are not changed yet, and ADR-056 Decision 3 stays in force for
>   them"* — its five open questions are answered in the `0542` design report on headless evidence,
>   with the interactive case pending;
> - **re-raise item** *"Re-raise when the session-path design task (`0542`) lands"* — used up.
>
> ⚠️ **Extended, not overturned:** Decisions 7 (report lines) and 8 (Codex-less: flagged Claude-only
> pass) now also apply to the session paths (owner Q5, *"Yes, both (Recommended)"*). *Negative /
> costs*' *"The owner's all-paths intent is not yet delivered"* stays true until ADR-060's builds ship.
>
> ⛔ **Not overturned:** **Decision 2** — a spawned plan-only coder runs plan review only on a driver's
> switch line; ADR-060 adds a second, session-only source, so *"Nothing else turns it on"* holds with
> that one named exception. Decisions 4–8 for the sprint loop, and everything else here, stand. The
> text above is **left byte-identical**; this note sits at the end, and the only other change is the
> **Amended by:** header bullet. **Status stays `accepted — provisional`.**
