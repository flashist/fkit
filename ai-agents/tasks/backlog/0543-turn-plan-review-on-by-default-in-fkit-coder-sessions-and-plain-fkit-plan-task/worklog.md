# Worklog — 0543: plan review on by default in `fkit coder` sessions and plain `/fkit-plan-task`

Run: `/fkit-task-ship-loop` in a live `fkit coder` session (hop 0), 2026-10-27. Plan approved via
`ExitPlanMode` 2026-10-27 ~17:07 UTC; persisted as `plan.md` (the autonomy boundary). Status set to
`🔄 In progress` in the brief and the Sprint 12 row at 17:08 UTC.

Plan review for this plan: off (no fkit session line) — this build is what adds the line.

## Owner-decision log

- **Plan gate questions** (2026-10-27, `fkit coder` session, `AskUserQuestion`) — verbatim in `plan.md`
  §*Owner answers*: Q1 launcher test cases D1–D10 OK'd by name; Q2 inline plans get no review
  (confirmed); Q3 both flags are a usage error after a non-coder role (wider rule → ADR-060 dated note
  via architect); Q4 the plan-mode-already-on chat stop confirmed.
- **Plan approval:** approved via `ExitPlanMode`, 2026-10-27 ~17:07 UTC, `fkit coder` session.
- **Review R1** (round 1, a low defect: three untested launcher argv shapes). This was a judgment call
  because the fix adds test cases outside the plan's named OK, so I stopped and asked. The reviewer's
  question, relayed verbatim: *"Q1 — How should R1 (three untested launcher cases) be handled?"* →
  *"Add the 3 cases (Rec)"* (2026-10-27, `fkit coder` session, `AskUserQuestion`). That is his OK by
  name for D11–D13.

### Obvious winners chosen while autonomous

1. **D9 runs twice** — once with `--append-system-prompt-file f`, once with the `=f` form. Plan §1 makes
   both forms a usage error; §2's D9 listed only the first. The second run is the same OK'd case
   (D1–D10), not a new case, and it proves the launcher's `=*` pattern.
2. **D5 is one `for` loop over two rows** (`lead --no-plan-review`, `architect --plan-review`), exactly
   the two rows plan §2 lists.
3. **Test 11 gained one assertion:** argv length 4, meaning no session-line flag on a read-only project.
   Plan §2 said "update test 11 for the new argv"; this pins plan §1's fail-toward-off fallback.
4. **`fkit-plan-task` step 2's wording:** "Read the task file at `$ARGUMENTS`" became "the path in
   `$ARGUMENTS`", because the arguments can now carry a flag. A wording fix that follows from the
   approved argument change.
5. **A usage example** in `fkit-plan-task` §Usage for `--no-plan-review`.
6. **The `exit 2` in the `--append-system-prompt-file` refusal is on the same line as its `printf`.**
   That keeps prove-red M2's `^  exit 2$` sed matching only the original line (plan §1).
7. **The CHANGELOG** had a now-false "`fkit coder` sessions … are unchanged" sentence. It was removed
   (plan §5), not reworded: the new entry above it says what changed.

## Build notes

- **Launcher** (`claude/fkit-claude.sh`):
  - The flags are taken out right after the "no role but args" usage error, before setup, so a usage
    error never runs init.
  - The new function `coder_session_line()` writes `.fkit/settings/coder-plan-review-{on,off}.txt` and
    returns its relative path.
  - Just before the unchanged tail `exec`, `set -- --append-system-prompt-file <file> "$@"` adds the
    flag.
  - On a read-only project: a stderr notice, no flag, and plan review is off.
  - The `--help` text gained a 5-line "Plan review" block.
- **Tests** (`test/launcher-contract.test.js`): tests 1, 6 and 11 updated. Group D added: D1–D9 (D10 is
  covered by tests 1/1b's exact argv for the other roles).
- **`fkit-plan-task`:** the Argument paragraph; Workflow step 0 (the gate check); step 1 is skipped
  with session review on; step 7 calls `EnterPlanMode` first; the trigger (a)/(b); the session variants
  in steps 2, 4 and 5; progress lines; record lines; *6. Return/present* (presentation order,
  `plan-review.md` on approval, no folder / rejected / owner revision); the new *Plan mode already on*
  subsection.
- **Agent prompts:**
  - `fkit-coder.md`: the procedures bullet and the adversarial-reviewer consult bullet.
  - `fkit-architect.md`, `fkit-producer.md`: "As a plan approver you consult no one, at any hop".
  - `fkit-lead.md`: the sessions sentence; both "old way" pointers gain `--no-plan-review`.
  - `fkit-sprint-ship-loop/SKILL.md`: the honesty clause's "old way" sentence.
- **Docs:**
  - the tasks README and its scaffold twin (byte-identical): ADR-060 added to the `plan-review.md` row,
    plus one sentence on who writes it;
  - `claude/structure-manifest.tsv` regenerated;
  - `CHANGELOG.md`.
- **ADR-060:** a dated note on Decision 3 for the Q3 ruling, written by an `@fkit-architect` consult
  (hop 1).

## Verification

Run 1 (after the build, before review, 2026-10-27):
- `sh -n claude/fkit-claude.sh` — OK. The `^  exit 2$` lines in the launcher: only the original one (line 248).
- `node --test test/launcher-contract.test.js` — 54/54 pass, 34.5 s.
- `npm test` — 948 tests: 947 pass, 0 fail, 1 skipped. The skip is the existing benchmark that runs
  only with `FKIT_BOARD_BENCH=1`. Wall time 1:20.0, under ADR-057's 2-minute budget.
- `npm run test:prove-red` — hard gate PASSED (0b, 0c green; mutations 1, 2, 30, 31 each red at their
  named assertion). Wall time 2:30.9 (outside the budget, by design).
- The tasks README twins are byte-identical (`diff`). The manifest was regenerated; the
  structure-manifest test passed in `npm test`.
- ADR diff: ADR-060 `+40 / -0`, with no `-` lines. ADR-019, ADR-056 and ADR-059 are untouched.

Run 2 (after the R1 fix — the last code change):
- `npm test` — 951 tests: 950 pass, 0 fail, 1 skipped (the same benchmark). D11–D13 pass. Wall time
  1:32.2, under the 2-minute budget.
- `npm run test:prove-red` — hard gate PASSED (0b, 0c green; 1, 2, 30, 31 each red at their named
  assertion). Wall time 3:20.7.

- **Not run (needs a fresh launch):** brief verification step 4, the live check, and step 5 (a spawned
  coder with no driver line still skips review). Both are prompt behaviour; they cannot run in the
  session that built them.

## Review ledger

`review.md` — **Status: closed-out** (round 2). One finding, R1: a low defect, three untested launcher
argv shapes. Fixed with D11–D13 on the owner's OK by name; the reviewer verified it. No accepted
residuals.
- **Coverage: `reasoning-only second opinion`** in both rounds. Codex ran (exit 0) and reasoned over
  the diff; its test runs could not execute in its read-only sandbox (mkdtemp EPERM). Not degraded:
  ADR-042 D1's normal state; no banner, the close is not withheld.
- **Plan pass for this plan:** none (`Plan review: off (no fkit session line)` — this build adds the
  line).

## Brief `## Verification steps` — walked

1. ✅ §8a existed before planning. The plan names 5b and 3-notice (not run; nothing rests on them) and
   names 5c and 5d (passed) as what the build rests on.
2. ✅ The plan records: the owner's OK by name for the launcher test cases (D1–D10, later D11–D13), his
   answer on inline plans (no review, confirmed), and the usage-error rule (both flags; ADR-060 dated
   note added).
3. ✅ The launcher test covers:
   - `--no-plan-review` consumed after `coder` (D2, D11, D13);
   - a usage error after another role, for either flag (D5);
   - both flags together is a usage error (D4);
   - the on and off lines are written (D1, D2);
   - a pass-through `--append-system-prompt` works (D6);
   - `fkit coder --resume` passes through (D7).

   `npm test` green, 1:32.2, under 2 min.
4. ⛔ **NOT RUN — the live check.** It needs a fresh `fkit coder` after `claude/fkit-claude-init.sh .`,
   which cannot happen in the session that built it (brief Notes). Steps for the owner below.
5. ⛔ **NOT RUN** — a spawned coder with no driver line still skips plan review. This is prompt
   behaviour; it goes in the same live check. By text: trigger (b) needs `AskUserQuestion`, which a
   spawn lacks, and (a) is unchanged.
6. ✅ `git diff` on ADR-019/056/059/060: ADR-060 `+40/-0`, the rest untouched.

### Live check — for the owner (brief step 4, plus step 5 and the reviewer's menu suggestion)

In a new terminal at the repo root, after `claude/fkit-claude-init.sh .`:
1. `fkit coder`, then `/fkit-plan-task <a task-folder brief>`. Expect:
   - the chat line `Plan review: ON (default) — …` first;
   - plan mode off while it drafts and reviews;
   - progress lines;
   - a real Codex mode line (not a fallback);
   - then plan mode on at the gate, with `Plan review: ON (default)` at the top and the record block,
     including its `Plan mode:` line;
   - on approval, `plan-review.md` written beside the brief.
2. `fkit coder --no-plan-review` + `/fkit-plan-task <brief>` → it enters plan mode first;
   `Plan review: off (fkit coder --no-plan-review)`.
3. `fkit coder` + `/fkit-plan-task <brief> --no-plan-review` → the same, with
   `Plan review: off (--no-plan-review)`.
4. In a `fkit coder` session, Shift+Tab into plan mode **before** `/fkit-plan-task <brief>` → the
   §3.6 chat stop (`go` / `skip codex` / `no review`).
5. Pick `coder` from the `fkit` menu → the same on behaviour as step 1 (the line is passed on the menu
   path too; no headless test covers it, since the menu needs a TTY).
6. Spawned path (step 5): from `fkit lead`, ask `@fkit-coder` to plan a brief with no switch line → no
   plan review runs.

## Files touched (change surface)

- **Source/prompts:**
  - `claude/fkit-claude.sh`;
  - `claude/skills/fkit-plan-task/SKILL.md`;
  - `claude/agents/fkit-coder.md`, `fkit-architect.md`, `fkit-producer.md`, `fkit-lead.md`;
  - `claude/skills/fkit-sprint-ship-loop/SKILL.md` (one sentence).
- **Tests:** `test/launcher-contract.test.js` (tests 1, 6 and 11 updated; Group D: D1–D9, D11–D13).
- **Docs:**
  - `ai-agents/tasks/README.md` and `claude/scaffold/ai-agents/tasks/README.md`;
  - `claude/structure-manifest.tsv` (regenerated);
  - `CHANGELOG.md`;
  - ADR-060 (dated note, +40/-0, by `fkit-architect`).
- **Task records:**
  - the brief's `## Status`;
  - the `ai-agents/sprints/sprint-12.md` row;
  - this folder's `plan.md`, `worklog.md` and `review.md` (new).

## Residuals, deferrals, recommended follow-ups (named only — not filed)

- **The interim window until `0544` lands** (plan §6):
  - `/fkit-task-ship-loop` step 2 still says "in plan mode";
  - the loop has no per-run opt-out (use `fkit coder --no-plan-review`);
  - it writes no `plan-review.md` at step 4.

  Recommendation: commit with, or just before, `0544`.
- **The architect's open points:**
  - an optional pointer bullet in ADR-060 *Owner rulings* for the Q3 ruling;
  - **fkit-wiki should re-ingest ADR-060** (and this report).
- **The resume caveat:** `fkit coder --resume --no-plan-review` keeps the resumed conversation's
  original line until compaction (`--system-prompt-snapshot` default). Documented in `--help`; no
  follow-up proposed unless the owner wants one.

## Commit state

Nothing committed. `git status` at finalisation: 15 modified files plus 3 new files in the 0543
folder (`plan.md`, `review.md`, `worklog.md`). The owner commits.

## Problems

- None blocking. Codex's sandbox could not run node tests (mkdtemp EPERM) in either round; the
  reviewer supplied the execution evidence.

## Lessons

- With `claude`, a repeated flag means "last one wins", so the launcher must use the `-file` form to
  keep an owner's own `--append-system-prompt` working. Worth knowing for any future launcher-written
  prompt line.
- Prove-red's M2 sed matches any `^  exit 2$` line, so new launcher usage errors must not use that
  exact indentation.

## Open questions

- **Close now, or after the live check?** — **answered.** Owner, 2026-10-27, `fkit coder` session,
  `AskUserQuestion`: *"0543's live check (brief steps 4–5) can't run in this session. How should the
  close go?"* → *"Keep open; I run live check (Rec)"*. The description he saw: *"Stays In progress; you
  run the worklog's live-check steps in a fresh fkit coder, then the close is routed. 0544 (Sprint 12)
  waits on it meanwhile."*

## Loop exit (2026-10-27)

The loop stopped before step 9 on the owner's ruling above. The status stays `🔄 In progress` in both
the brief and the Sprint 12 row, as the option he picked said; the loop's default `🚧 Blocked` marker
was not applied, because his ruling named the status. **Not routed to the producer.** Next: the owner
runs the live check above. On a pass, route the close (a coder session spawns `@fkit-producer` to
close). On a fail, fix → re-verify → review.
