# Plan: 0542, a design for turning plan review on by default in the `fkit coder` session, `/fkit-task-ship-loop` and a plain `/fkit-plan-task`, with an opt-out (provisional)

Planning-only. Written by a spawned `fkit-coder`. I had no `EnterPlanMode`, so planning-only was a promise I kept, not a wall. Plan review was **off** for this plan, by the owner's ruling, so the *Plan review* section of `fkit-plan-task` was not run. The coder wrote nothing.

**Summary**
- **No coder Build.** This task is design work plus an owner decision. It writes no source; `git diff -- claude/` must stay empty. The coder's only possible part is an optional read-only Verify spawn.
- **Three `fkit-architect` spawns, run one after another by the driver:** **A** the plan-mode probe → **B** the design report → owner questions (asked by the driver) → **C** the owner's answers recorded, plus the ADR and the build split. After that come the loop's usual Review step and the producer close.
- **Probe, honestly:** a spawned worker cannot enter plan mode (no `EnterPlanMode`; I checked my own toolset). So the in-process case "a parent in plan mode spawns a subagent" **cannot be run from any spawn**.
  - What a spawn *can* run: a separate **headless** Claude Code process with `claude -p --permission-mode plan`. I checked that `claude` 2.1.310 is installed, that `--permission-mode` accepts `plan`, and that `--agents` exists. That gives real runtime evidence, but **headless, not interactive**.
  - The definitive interactive case needs an **owner-run `fkit coder` session in plan mode**. The exact steps are in Unit A.
  - If neither runs, the question is recorded as **not settled**.
- **ADR:** the architect chooses the form (per the brief). The plan recommends a **new ADR-060**, because ADR-059 is still **untracked**. `git diff` cannot show that an untracked file was only added to (see Risks).
- **Cost:** 3 architect spawns, plus one owner question round, plus Review. None of it can make plan review live in this run. The driver has the pre-0541 text loaded, and nothing here edits `claude/`.

## 1. Decisions this plan makes (the owner approves them with the plan)

| # | Decision | Why |
|---|---|---|
| P1 | All the design work, the report and the ADR go to `fkit-architect` spawns, one bounded unit each, run in order by the driver. No coder Build worker. | Owner ruling 2026-10-24, `fkit lead` session, `AskUserQuestion`, *"Drive 0542 now"*, description *"…design work routed to architect spawns."* The brief names the architect as owner, and its verification expects `git diff -- claude/` to be empty. |
| P2 | Probe = Tier 1 (headless, run by the architect) plus Tier 2 (interactive, run by the owner) as the confirming check. Any path whose verdict depends on how the interactive session behaves differently gets **"feasible with a condition: confirm by owner probe"**, never "feasible". | A spawn cannot enter plan mode. Headless and interactive may differ: in an interactive session a blocked action may show the owner a permission prompt, while in `-p` there is nobody to answer it, so it is denied. The brief: *"never assume an answer"*. |
| P3 | The probe record goes to `<task-folder>/worklog.md` (an ADR-020 artifact, so it survives between spawns) **and** is returned whole in Unit A's envelope. The report's §1 is the official record. | Spawns share no memory. The driver passes A's envelope **verbatim** to B. |
| P4 | Every Tier-1 probe runs in a **throwaway directory under the architect's scratchpad** (`git init`), never in the repo. The probe subagent is defined inline with `--agents` and gets only Bash, Read and Write, with no fkit skills or hooks. | Keeps the probe away from repo files, from fkit's role and hop chain, and from the ADR-018 skill-ownership hook. The rule being tested (plan mode vs a subagent's writes) belongs to the runtime, not to the agent definition. I checked that `claude/agents/fkit-adversarial-reviewer.md` frontmatter sets **no** `permissionMode`; the architect re-checks that for all four agents involved. |
| P5 | The owner questions come from Unit B and are put by the **driver** (`AskUserQuestion`). The architect never asks. Unit C records his answers verbatim, with date and channel. | ADR-021 (a spawn has no owner channel). Brief §5 and Verification 4. |
| P6 | The build briefs are **proposed** in the report (§7). Filing them is a separate producer act after the owner has seen the findings. Where they go is an owner question (Q2 below). | Brief §7 and *Notes*: *"The producer files them; this task does not build anything."* |

## 2. Steps (in order, with the role for each)

**Step 0: driver (`fkit-lead`).** Owner approves this plan and answers Q1–Q2 below. Write `plan.md` to the task folder as usual.

**Step A: `fkit-architect` spawn #1, the plan-mode probe.** Hop 1 (chain: lead → architect). Writes only scratchpad files and `<task-folder>/worklog.md`.
- **Facts to record first (read-only):** `claude --version`; `codex --version` (present or absent); whether each agent's frontmatter sets `permissionMode` (`fkit-coder`, `fkit-adversarial-reviewer`, `fkit-architect`, `fkit-producer`); how `fkit-adversarial-review` writes its temp file. Today that is a Bash heredoc to `.fkit/tmp/<key>-<run-id>-adversarial-prompt.md`, after `mkdir -p .fkit/tmp`, then `codex exec --sandbox read-only … - < <file>` (`claude/skills/fkit-adversarial-review/SKILL.md`, step 2). So the probe must test **Bash** writes and a **Bash `codex exec`**, not just the `Write` tool.
- **Tier 1, headless.** All runs in a scratch git repo. For each, record the exact command line, the tool results, whether the file exists afterwards (checked from outside with `ls`), and the exit code. Runs:
  1. **Control:** `--permission-mode default`, main agent does a Bash `mkdir -p .fkit/tmp && printf x > .fkit/tmp/p0.txt`. This shows how `-p` itself treats an unapproved Bash write.
  2. `--permission-mode plan`, the **main agent** does the same Bash write, and a `Write` of `.fkit/tmp/p1.txt`.
  3. `--permission-mode plan`, the main agent **spawns the inline probe subagent**, which does the Bash write (`p2.txt`) and a `Write` (`p3.txt`), and reports its tool results verbatim.
  4. Same as 3, but the subagent runs `codex exec --sandbox read-only` on a one-line prompt read from its temp file. Skip this run if Codex is absent and say so.
  5. Repeat 2–4 with `--allowedTools` covering those Bash patterns. This shows whether plan mode overrides allow rules.
  6. Note anything `--permission-prompts` changes. Optional, and recorded as optional.
  - **If nested `claude -p` cannot run** (sandbox, network or auth), record exactly what failed. Tier 1 is then **not run**.
- **Tier 2, owner-run interactive steps.** Written out exactly, for the driver to relay. They are definitive for the real session path:
  1. In a second terminal at the repo root, run `fkit coder` (a fresh session; it does not disturb the running lead session).
  2. Press Shift+Tab until the mode line shows plan mode.
  3. Type: *"@fkit-adversarial-reviewer Probe only, review nothing: run `mkdir -p .fkit/tmp && printf probe > .fkit/tmp/plan-mode-probe.txt && ls -l .fkit/tmp/plan-mode-probe.txt`, then `codex exec --sandbox read-only - < .fkit/tmp/plan-mode-probe.txt`, and report each tool result verbatim."*
  4. Note whether a permission prompt appeared, what it said, and whether you allowed or denied it.
  5. Type: *"@fkit-architect Probe only: reply PROBE-OK and write nothing."* This checks that an approver spawn runs at all in plan mode.
  6. In another terminal, run `ls -l .fkit/tmp/plan-mode-probe.txt` (found or not found).
  7. Press Shift+Tab to leave plan mode, run `rm .fkit/tmp/plan-mode-probe.txt`, and close the session.
  8. Paste the results back to the lead.
  - It touches only `.fkit/` (gitignored). No `claude/` file changes.
- **Returns:** `DONE {probe record}` with, for each run: **allowed / denied / prompted / not run**, and the conclusion. The conclusion is **settled** only for what was actually observed. Anything that rests on the interactive case without Tier 2 results is **not settled**.

**Step A′: driver, optional (Q1).** If the owner chooses to run Tier 2 now, he does it in a second terminal and the driver relays his results verbatim to Step B. Otherwise the steps go into the report as a pending confirming check.

**Step B: `fkit-architect` spawn #2, the design report.** Hop 1. The architect runs `/fkit-design-spec` or `/fkit-evaluate-approach` (its call). The prompt carries Step A's envelope verbatim, plus Tier-2 results if any.
- **Output:** `ai-agents/knowledge-base/reports/2026-10-24-<slug>.md`. The slug is the architect's.
- **Must cover, for each of the three paths** (`fkit coder` session, `/fkit-task-ship-loop`, plain `/fkit-plan-task` in a session):
  - what turns plan review on, and how that stays something a brief cannot fake. ADR-059 rejected *"Default in `fkit-plan-task` itself"*, because a missing switch line would mean "on". The design must answer that, for example with a session-only signal, and must **not** contradict ADR-059 Decision 2 for spawned plan-only coders;
  - the opt-out's form. Reuse `--no-plan-review` where it makes sense (brief §3);
  - who writes `plan-review.md`, given that plan mode blocks writes until approval. For example: the record travels inside the ExitPlanMode presentation and the coder persists it at approval, next to `plan.md`. In a plain `/fkit-plan-task`, nothing is persisted today;
  - the hop budget. In a session the coder is hop 0, so the approvers and the adversarial reviewer sit at hop 1 and could consult. ADR-056 Decision 7 assumed hop-2 leaves, so the report must say whether they are kept as leaves;
  - what the owner sees, and in what order;
  - what happens without Codex (ADR-054; ADR-059 Decision 8);
  - the opted-out behaviour shown to be **today's behaviour**;
  - a verdict: feasible / feasible with a condition / not feasible, citing the §1 probe evidence.
- **The report also covers:**
  - the interaction with `/fkit-task-ship-loop`'s own plan gate (ADR-019 Decision 2; its step 2 *"produce the plan in plan mode"*, step 4 *"plan mode releases the write wall"*);
  - the ADR-052 phase-5 overlap (`0453` rewires both ship loops; it is on the Backlog board);
  - the brief's open questions 1–9, each answered or put as an owner question;
  - §7: the build split (brief titles, owners, `Depends on:` order).
- **Returns:** `DONE {report path, owner questions}`. Each question has at most 3 options, a recommendation and plain-language context. Any placement option states its knock-on.

**Step B′: driver.** Puts B's owner questions with `AskUserQuestion`, each with the standing *"Explain more, then ask again"* option. Records the answers verbatim with date and channel. Unanswered questions stay open.

**Step C: `fkit-architect` spawn #3, the owner answers, the ADR and the final build split.** Hop 1. The prompt quotes the owner's answers verbatim, with date and channel.
- Adds an *Owner answers* section to the report: answers verbatim, open questions listed as open. Finalises §7.
- Records the approved design with `/fkit-record-decision`:
  - **Rec: new ADR-060** (the architect's call). Alternative: an additions-only amendment to ADR-059.
  - It states which part of ADR-056 Decision 3 and ADR-059 Decision 3 it changes.
  - Pointer notes on ADR-056 and ADR-059 are **additions only**.
  - **Before any edit**, the architect records `git hash-object` and a byte copy (in the scratchpad) of ADR-056 and ADR-059. ADR-059 is untracked, and ADR-056 already carries 0541's uncommitted additions, so `git diff` against HEAD cannot prove "additions only" by itself. The proof is: the old bytes are a prefix of the new file, or a `diff` against the copy shows only `>` lines.
- **If the owner approved no design** (deferred, or "not now"): the ADR records nothing approved, and C returns `NEEDS-DECISION`. Verification 5 cannot be met, and the task cannot close as done.

**Step D: Verify, a read-only `fkit-coder` spawn (the loop's usual Verify step). This is the coder's only part, and it is optional.** It runs brief Verification 1–7:
- the report exists and covers all three paths, each with a verdict;
- the probe record is there, or is marked not run / not settled;
- every path names its opt-out;
- owner answers are verbatim, with date and channel;
- the ADR exists, and the additions-only proof on ADR-056 and ADR-059 is done against the Step-C copies;
- `git diff --stat -- claude/` is empty;
- §7 is present;
- `npm test` (the CONTRIBUTING "Anything else — `ai-agents/`" row).
- Skipped: `test:prove-red` and `test:release` (nothing in their rows is touched).
- **No new test file.**

**Step E: Review (the loop's usual step).** `@fkit-reviewer` runs a stateful review of the working tree, task-id `0542` (the report, the ADR and the pointer notes). The usual Process-review follows.

**Step F: close.** The driver spawns `@fkit-producer` to run `/fkit-task-done` with the agent-closed marker (ADR-033). Filing the build briefs is a separate producer act, per Q2.

**Not touched:** anything under `claude/`, `.claude/`, hooks, tests, the wiki, existing ADR text (additions only), and 0541's files. `claude/fkit-claude-init.sh .` is **not** run. Afterwards, `fkit-wiki` should ingest the report and the ADR.

## 3. Verification (maps to the brief)
- V1, V3, V7 → Step D reads the report.
- V2 → the probe record has each run as allowed / denied / prompted / not run, and "not settled" wherever it was not observed.
- V4 → the report's *Owner answers* section.
- V5 → the ADR exists, plus the copy-based additions-only proof for the untracked ADR-059 and for the already-modified ADR-056.
- V6 → `git diff --stat -- claude/` is empty.
- `npm test` green. Skipped checks are named, with the reason.

## 4. Risks and edge cases
- **Headless is not interactive.** In `-p`, "denied" may only mean that nobody was there to answer a prompt. That is why control run 1 exists, and why P2 says "feasible with a condition".
- **Nested `claude -p` may be blocked** (sandbox, network or auth). Tier 1 is then "not run", and only the owner's Tier 2 can settle the question.
- **Auto mode.** This environment runs in auto mode. In a session, plan mode replaces it until ExitPlanMode. The Tier-1 runs cannot reproduce the owner's own settings exactly unless they inherit `~/.claude` settings; the architect states which settings applied.
- **Codex runs outside Claude's permission system once it starts.** Its own read-only sandbox is a different wall. The probe tests only whether Claude lets the Bash call start.
- **Default-on with no driver** risks an "on when the signal is missing" design that ADR-059 rejected. The design must keep spawned plan-only coders exactly as ADR-059 Decision 2 has them.
- **Untracked ADR-059, and ADR-056 already modified.** The additions-only proof needs the pre-edit copies (Step C). A plain `git diff` would mislead.
- **ADR-052 phase-5 overlap** (`0453`, `0450`, `0451`, `0457`): the build split must say which lands second and carries the change forward.
- **Owner time.** Tier 2 is about 5 minutes of his time, and the design questions come later in the run.
- **Nothing in this task goes live.** The driver has old text loaded, and this task changes no prompt.

## 5. Open questions for the owner (at the plan gate; the driver adds "Explain more, then ask again" to each)

**Q1: How do we run the plan-mode probe?**
Context: the session design depends on one fact. When the coder is planning in "plan mode" (the mode that blocks file writes until you approve the plan), can the helper agents it starts still write the small temp file the Codex reviewer needs, and run Codex? A spawned agent cannot switch plan mode on, so it cannot test this from inside fkit. It can start a separate, non-interactive copy of Claude Code in plan mode and test there. That is real evidence, but it may differ from your interactive session: where you would see a permission prompt, the non-interactive copy just gets "no". The fully definitive test is you opening `fkit coder` in a second terminal, switching to plan mode, and pasting one prompt (about 5 minutes, 8 written steps; it touches only the ignored `.fkit/` folder).
- **(Rec) Architect runs the non-interactive probe now; your interactive steps go in the report as a confirming check.** Any verdict that depends on the difference is marked "feasible with a condition: confirm by owner probe". Costs you nothing now.
- **Both now:** the architect probes, and you also run the interactive steps during this run. The design then rests on settled evidence. Costs about 5 minutes of your time mid-run.
- **Your interactive probe only:** the architect skips the non-interactive copy. The design waits until you have run the steps.
- knock-on: none (checked). No task placement or `Depends on:` change.

**Q2: Where do the build briefs go once the design is approved?** (The producer files them after you have seen the findings.)
Context: this task only designs. Building each path is new tasks for the coder. They change `fkit-plan-task` and the ship loops, which only go live after you refresh `.claude/` and relaunch, so this run cannot build and live-test them anyway.
- **(Rec) Backlog board.** Filed after 0542 closes; you place them into a sprint later. Knock-on: they wait only on 0542 (Done by then) and on each other, in the order the report gives. No open task waits on them (checked: nothing outside 0541's folder and `sprint-12.md` references 0542). They overlap with `0453` on the Backlog board, but that is file overlap, not a dependency link.
- **Sprint 12.** This run could pick them up after 0542. Knock-on: they wait on 0542 in Sprint 12 (same sprint, no later-sprint wait); no open task waits on them. But a Build here edits `fkit-plan-task`, the prompt this very run's later plan spawns read, and the driver has old text loaded (the same mid-run mixing problem as 0541's Verification 7).
- **Decide at the design gate:** the producer files nothing yet; you choose when you see the build split. Knock-on: none (checked).

(Brief question 9, the ADR form, is the architect's call. The plan recommends a new ADR-060. All other design questions from the brief, 1–8, come from Step B at the design gate, not now.)
