# Plan — 0541: plan review on by default in sprint-loop runs, `--no-plan-review` opt-out (provisional)

**Summary**
- Default lives in the **driver** (`fkit-sprint-ship-loop`) only. `fkit-plan-task`'s gate keeps its rule: run only when the driver's switch line is present. So `fkit coder` sessions, `/fkit-task-ship-loop` and plain `/fkit-plan-task` are untouched (ADR-056 D3).
- Opt-out flag: **`--no-plan-review`**. The old `--plan-review` is still accepted as a harmless no-op ("on"). Both flags together, or any unrecognised `--` token, stop the run at start and get reported. The driver never guesses.
- Old path kept: the `<!-- plan-review:begin/end -->` blocks stay, and only their gating sentence flips. Plan row and gate text outside the markers: unchanged.
- ADR: **new ADR-059**, recorded by fkit-architect (architect's ruling on form). ADR-056 gets **additions only**: one "Amended by" header bullet and one ⛔ note at the end. Its existing text stays byte-identical.
- No new test file. Checks: `npm test`, plus `npm run generate:manifest` because a scaffold README changes.
- 3 owner questions at the gate: scope of "default", what reports say, Codex-less projects.
- Cost to state at the gate: **every** sprint-loop task now pays plan review. The trial median was ~17 min wall-clock per task (range ~9½–31). That is up to 3 asks × 2 approvers plus a Codex pass.

## 1. Decisions this plan makes (owner approves them at the gate)

| # | Decision | Why |
|---|---|---|
| D1 | Default in the driver only; plan-task gate unchanged in logic ("nothing else turns it on") | Keeps ADR-056 D3 (session paths) without edits. A brief *about* plan review still can't trigger it. |
| D2 | Opt-out = `--no-plan-review`. `--plan-review` = accepted no-op. Both, or an unrecognised flag → stop at run start, report, ask. | Old habits and notes don't break a run. A typo like `--no-plan-reveiw` would otherwise run *with* plan review quietly, against what the owner asked for (architect's addition). |
| D3 | Flag read once at run start. Holds for every task planned in the run. Never flipped mid-run, never carried to another run. | Unchanged from ADR-056 D2. |
| D4 | Litmus (one-skill-one-output): `--no-plan-review` changes *what work the plan step does*, so it is a parameter of the work | Same argument as ADR-056 D2. The Argument paragraph's "One operand, plus one optional flag" gets updated. |
| D5 | New switch line, one fixed text whether or not `--plan-review` was also passed: `Plan review: on — the default for fkit-sprint-ship-loop runs (owner ruling 2026-10-24, ADR-059), run <board> started <UTC>` | It still names an owner ruling (ADR-037), now the standing default ruling. |
| D6 | plan-task's gate accepts the new line **and** the pre-ADR-059 line (`… (--plan-review, <date>) …`) | If a stale driver copy meets a refreshed plan-task, plan review would otherwise be skipped silently in a run the owner believes is reviewed. Both forms are driver switch lines, so "nothing else turns it on" still holds. |
| D7 | Lead rules mirrored: use `--no-plan-review` only when the owner asks, never unasked, never carried. "The next run is on unless he asks for the opt-out again." | Brief item 3 (ADR-056 D2's wording, the other way round). |
| D8 | ADR form: new ADR-059, plus ADR-056 additions only (architect P1) | ADR-056's title says "off by default". The change reverses a decision (⛔ by its legend) and is provisional with a future ruling pending. Precedent: ADR-054 amending ADR-009, with the note at the end. |
| D9 | ADR-019 / 020 / 032 pointer notes ("default off") left byte-identical. ADR-059 names them as "true as of 2026-10-06, read through ADR-056". | Architect P5. ADR-056's new header bullet sends readers on to ADR-059 in one click. |

## 2. Steps (in order)

**Step 0 — ADR, recorded by fkit-architect (driver spawns it after approval, before Build).** This is how ADR-056 was recorded for `0473`. The prompt carries the owner's approval and his answers to §5, quoted verbatim with date and channel.

*New file:* `ai-agents/knowledge-base/decisions/adr-059-plan-review-on-by-default-in-sprint-loop-runs-with-a-no-plan-review-opt-out-provisional.md` (slug is the architect's to adjust). Contents:
- Status: accepted, **provisional**.
- Context: the owner's 2026-10-24 Q1 and Q2 words **verbatim**, from the brief's *Context*, with date and channel (`fkit lead` session, `AskUserQuestion`, relayed to a spawned producer). The lead's reading, labelled as the lead's.
- Decision: D1–D7, plus the owner's gate answers.
- ADR-056 passages changed:
  - the title and filename (kept as history);
  - the "What this ADR decides, in one line" block;
  - Decision 2's "default off", "passes it only when the owner asks / never adds it unasked", and its Q3 reporting rule (per owner Q2 below);
  - Decision 8: the exposure flips — a driver could now *drop* the line in a default run or *add* it in an opted-out run. Same accepted cost, new direction;
  - Decision 9's "Nothing in this ADR turns it on by default";
  - Decision 10's "making it the default";
  - the rejected option "Plan review on by default, with an opt-out";
  - Consequences: "zero risk to the default", "Off really means off";
  - the re-raise items: the 0474 trigger is used up; the leak trigger becomes "running in a `--no-plan-review` run, or missing from a default run"; "do not re-raise 'should be the default'" is dropped.
- Explicitly unchanged: D1, D3–D7, the plan gate (ADR-019 D2; ADR-032 D3/D7).
- Consequences:
  - Codex-less projects get a Claude-only plan pass on every task, flagged *NOT model-diverse* (ADR-054).
  - Every sprint-loop task pays the plan-review time.
  - ADR-019/020/032 notes are left as dated history.
  - ADR-052 phase 5 (`0453` touches the sprint loop; `0450`, `0451`, `0457`): whichever lands second carries the flipped default and the opt-out forward.
- Re-raise trigger: the owner's final ruling after real-project use. The opt-out stays until then.

*ADR-056, additions only:*
- one header bullet directly under Status: `- **Amended by:** ADR-059 (2026-10-24, provisional) — …; read it there`;
- one ⛔ dated note at the end of the file, naming each overturned passage and what is not overturned.
- The Status line and the "Corrections:" line stay untouched.

**Step 1 — `claude/skills/fkit-sprint-ship-loop/SKILL.md`**
- **"Argument:" paragraph.** `--no-plan-review` optional; absent = plan review on (ADR-059). `--plan-review` accepted, no-op. Both, or an unrecognised `--` token → stop before the first spawn and report it/ask. Update "one optional flag", and keep the litmus sentence.
- **Gated block** (markers kept):
  - Heading → "Plan review — on unless the run was started with `--no-plan-review`".
  - First sentence → "A run started with `--no-plan-review` skips this block entirely — the Plan row above runs exactly as written".
  - Run-start bullet: opening line per owner Q2.
  - Switch line → D5 text.
  - "a later `--plan-review` run" → "a later run with plan review on".
  - Everything else in the block unchanged.
- **§Progress reporting** "Plan review — only when the run has it on" bullet → per owner Q2.

**Step 2 — `claude/skills/fkit-plan-task/SKILL.md`, gated section only.** The gate sentence's switch-line template becomes the D5 line, also accepting the pre-ADR-059 form (D6). "Nothing else turns it on", the brief-is-not-the-switch rule, and the rest of the section: unchanged. Workflow steps 1–7 untouched.

**Step 3 — `claude/agents/fkit-lead.md`** — rewrite the bullet "Plan review is opt-in, per sprint-loop run" per D7. The pointer becomes ADR-056 as amended by ADR-059, and the session-path sentence is kept.

**Step 4 — `ai-agents/tasks/README.md` + `claude/scaffold/ai-agents/tasks/README.md`** (dual-homed, must stay byte-identical). "the opt-in plan-review record" → "the plan-review record", keeping the tree's column alignment. "Exists only for tasks planned in a plan-review run" is still true. Then `npm run generate:manifest` to rebuild `claude/structure-manifest.tsv` (otherwise `structure-manifest.test.js` goes red). Side effect: existing installs will see this file as untouched-stale on `fkit heal`. That is normal for a scaffold edit.

**Step 5 — `CHANGELOG.md` `## Unreleased`** — one line: sprint-loop runs now do plan review by default (agents approve each plan, Codex attacks it, before the owner sees it); `--no-plan-review` turns it off for a run; without Codex the plan pass is Claude-only and flagged; provisional.

**Step 6 — Sweep + worklog.** Search `claude/` (plus the two READMEs) for `--plan-review`, "off by default", "default off", "only when the owner asks", "never adds it unasked", "opt-in", "plan review". List every hit and its verdict in `worklog.md`. Pre-checked, no edit needed:
- `fkit-coder.md` (the switch-line mentions are still correct);
- `fkit-producer.md` / `fkit-architect.md` ("plan-review consult");
- `fkit-adversarial-review/SKILL.md`, `fkit-stateful-review` / `fkit-process-stateful-review` (`plan-review.md` as a coordination doc);
- `ai-agents/README.md` + its scaffold twin (file name only).
- No hook or test references the switch line (grepped).

**Not touched:** `fkit-task-ship-loop`, hooks, `skills-for-role.sh`, `CLAUDE.md` rules block, ADR-019/020/032, old `plan-review.md` records (they keep the old line — history), the wiki (fkit-wiki should re-ingest ADR-056, ADR-059 and the `0473` page afterwards).

## 3. Verification
1. Hand walk-through, run with no flag → reaches the gated block for every planned task, and the plan-only spawn carries the D5 line. Same with `--plan-review` (no-op).
2. Walk-through with `--no-plan-review` → block skipped. Plan step and gate as today. Reports per owner Q2. `git diff` shows the old path's text was kept.
3. Walk-through with both flags, or a misspelled flag → stops at run start.
4. `fkit-lead.md` says: opt-out only when asked, never unasked, never carried.
5. ADR-059: diff its quotes against the brief's *Context*. ADR-056's `git diff` shows additions only.
6. Sweep hit list with verdicts in the worklog.
7. **Live check (brief step 6): plan to mark it NOT RUN.** It needs `.claude/` refreshed **and** `fkit lead` relaunched, and that can't happen inside this running Sprint 12 session. **Build must not run `claude/fkit-claude-init.sh .` mid-run**: the live driver has the old text loaded, while later spawns would read the refreshed `fkit-plan-task`. The owner's next fresh run after refresh+relaunch is the live check.
8. `npm test` green within the 2-min budget (CONTRIBUTING "anything else" row: `claude/`, scaffold, `ai-agents/`). Covers `dual-home-parity` (README twins) and `structure-manifest` (regenerated manifest). Skipped: `test:prove-red` (no launcher, hook or `skills-for-role.sh` file touched) and `test:release` (no `bin/release.mjs`). **No new test file** (ADR-057 §D2.1). Nothing here is script behaviour; it is all prose, and the 0473 text-presence test is gone.

## 4. Risks / edge cases
- **The two copies of the switch line can drift** (driver block vs plan-task gate). Both are edited in the same change, and D6's dual-form gate softens a stale-copy mix.
- **Mixed stale copies** — see Verification step 7 and D6.
- **Prose-enforced:** a driver could drop the switch line in a default run, or add it in an opted-out run. Same accepted cost as ADR-056 D8, new direction (recorded in ADR-059).
- **ADR-052 phase 5 overlap:** `0453` rewrites the sprint loop. Whichever lands second carries the flipped default forward.
- **Codex-less consuming projects:** every sprint-loop plan pass runs Claude-only and loudly flagged (existing behaviour, now reached by default). See owner Q3.
- **Time:** ~17 min median per task added, on every task of every default run.
- **Brief Verification step 2** ("the reports read as a run without `--plan-review` does today") holds literally only if the owner picks "silent" in Q2. If he picks the one-line option, that clause changes by that one line, and the worklog says so.

## 5. Open questions for the owner (put at the plan gate; each also gets "Explain more, then ask again")

**Q1 — Where does "default" apply?** Context: you said "make this new process default" but didn't name places. Today plan review exists only in `/fkit-sprint-ship-loop` runs, by your 2026-10-06 ruling. The `fkit coder` session, `/fkit-task-ship-loop` and plain `/fkit-plan-task` never had it, and adding it there would be new design work: plan mode may block the Codex reviewer from writing its temp file, which is unverified. Architect and coder both recommend sprint loop only.
- (Rec) Sprint-loop runs only — one place changes; the other paths stay exactly as today.
- All paths — needs a separate design task first; this task would ship only the sprint-loop part.

**Q2 — What do run reports say now?** Context: today the report says "Plan review: on" only when it's on, and an off run says nothing (your 2026-10-06 rule). With on as the default, a silent report would now mean "off".
- (Rec, architect's) Default run says "Plan review: ON (default)". An opted-out run says one line: "Plan review: off (--no-plan-review)". While you judge the new default on real projects, you can see which path each run took. Cost: an opted-out run's report differs from the old one by that one line.
- Default run says "Plan review: ON (default)". An opted-out run says nothing, exactly as runs looked before plan review existed.

**Q3 — Projects without Codex.** Context: Codex is optional. Without it, the plan's "attack" pass runs on Claude alone, labelled "NOT model-diverse" (no second model checks the plan). With the default on, that happens on every task in such projects, and they still pay the time.
- (Rec) Accept it: flagged loudly, as today. Owners who don't want it use `--no-plan-review`, and the CHANGELOG line says so.
- Turn plan review off automatically when Codex is missing — a behaviour change outside this brief; it would be a separate follow-up task (knock-on: none (checked) — only if filed later).

(The flag names — `--no-plan-review` and `--plan-review` as a no-op, with conflicts/typos stopping the run — are in the plan's D2 and are approved with the plan itself, not asked separately.)

## 6. Sequencing note for the driver
- Step 0 (architect records ADR-059 and the ADR-056 additions) needs the owner's approval plus his Q1–Q3 answers quoted verbatim. Run it **before** Build, as ADR-056 was for `0473`.
- Build then does Steps 1–6 and cites ADR-059 as present.
- If the driver can't spawn the architect for Step 0, return to the owner. A coder Build worker writing the ADR itself would be a role departure.
