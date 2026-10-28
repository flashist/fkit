# Plan — 0543: plan review on by default in `fkit coder` sessions + plain `/fkit-plan-task`

Plan review (this session): off (no fkit session line). The build is not landed yet, so this plan was
drafted in plan mode, the way plans are drafted today.

## Context

ADR-060 (provisional) + design report `2026-10-24-design-plan-review-on-by-default-session-paths.md`
§3 (rewritten for the Q2 re-ruling, 2026-10-26). Build 1 of 3. The `fkit` launcher writes one session
line for `fkit coder`. `fkit-plan-task`'s gated section gets a second trigger, used only in a session.
With review on, the draft and the whole review (Codex included) run **with plan mode off**. Plan mode
comes on only for the owner's approval.

**Precondition met.** Report §8a exists (dated 2026-10-26). Q2 was re-ruled. ADR-060 has the ⛔ note on
Decision 4.3. Sprint 12's dashboard shows no `depends-on-later-sprint` drift for 0543.
**This build rests on 5c and 5d, both passed.** 5b and 3-notice did not run; nothing in the re-ruled
design rests on them (report §7, §4.1). 3n failed, and the Q2 re-ruling replaced what rested on it.

**Classification: product change** — it changes how fkit's sessions behave for users.

## Grounding facts I measured (Claude Code 2.1.311, headless `-p`, haiku, model self-report, once each)
- If `--append-system-prompt` is given twice, **only the last one applies** (A and B passed → only B
  was seen).
- `--append-system-prompt` and `--append-system-prompt-file` **combine**: both are seen. If `-file` is
  given twice, only the last applies.
- `claude --help`: `--system-prompt-snapshot` defaults to **on**. A resumed conversation reuses its
  recorded system prompt "even when a later launch passes different text, until the conversation is
  compacted".

## Steps

### 1. Launcher — `claude/fkit-claude.sh`
- **Where:** after the role `case` and the existing "no role but args" usage error (~:229-243). This is
  before setup, so a usage error never runs init.
- **Take the flags out (POSIX sh, no arrays):** rebuild `"$@"` by rotating it (`a=$1; shift; …;
  set -- "$@" "$a"`).
  - The exact tokens `--no-plan-review` and `--plan-review` are taken out and recorded, wherever they
    appear **before a `--`**.
  - From `--` on, everything passes through untouched. So `fkit coder -- --no-plan-review` hands the
    literal text to `claude`. This is the separator edge case.
  - **The same text as another option's value** (e.g. `--append-system-prompt --no-plan-review`): the
    launcher cannot know `claude`'s option arity, so the exact token is **always** taken out before
    `--`. `claude` then sees a missing value and refuses to start. To pass that text literally, put it
    after `--`. Documented in the usage text.
- **Usage errors (exit 2, claude never exec'd, fkit's own message):**
  - both tokens together after `coder`;
  - either token after any other role — **rule per Q3 below**;
  - after `coder`, the owner's own `--append-system-prompt-file` (or `--append-system-prompt-file=…`)
    before `--`. The launcher needs that flag for its line; with two, the last one wins, so his would
    silently drop it, or let an "on" text beat `--no-plan-review`. Message: use `--append-system-prompt`
    for your own text. **His plain `--append-system-prompt` passes through and works** (measured: it
    combines with `-file`).
  - The `exit 2` lines are indented so prove-red M2's sed (`^  exit 2$`) still matches only the
    existing line.
- **The line**, only when `role=coder` (also when coder is picked from the menu; the cold start never
  reaches coder):
  - on: `fkit session: coder · Plan review: on — the default for fkit coder sessions (owner ruling 2026-10-24, ADR-060), launched <UTC>`
  - off: `fkit session: coder · Plan review: off — fkit coder --no-plan-review (owner, at launch <UTC>)`
  - Written to `.fkit/settings/coder-plan-review-on.txt` / `…-off.txt`, the same directory and
    write-check pattern as `build_settings()`. Keying the file by state means two coder tabs launched
    with different flags never swap states. A same-state relaunch can only change the timestamp.
  - Passed by prepending to the args just before the existing tail exec:
    `set -- --append-system-prompt-file ".fkit/settings/coder-plan-review-<on|off>.txt" "$@"`. The
    exec line itself stays byte-identical, so the prove-red anchors do not move.
  - **Read-only project:** the file cannot be written, so **no line is passed**. stderr: `⚠ … plan
    review is off in this session (no fkit session line)`. This fails toward off; the lockdown's inline
    fallback is unchanged.
- **`--resume` / `--continue`:** pass through unchanged, and the line flag is still added. Because of
  the snapshot default, a resumed conversation keeps the line it **started** with until compaction. So
  `fkit coder --resume --no-plan-review` may not switch off review for that conversation. The usage
  text says so in one line; a fresh session does honour it.
- **Usage text:** add `fkit coder --no-plan-review` (plan review off for the session; on by default),
  plus the `--` / resume notes.

### 2. Launcher test — `test/launcher-contract.test.js` (existing file; **no new file**; key list item 1)
Needs the owner's OK by name (ADR-057 §D2.1, the brief's open question 1) — **Q1 below**.
- **Update** test 1 (the coder row), test 6 (`coder --debug`) and test 11 (read-only coder) for the new
  argv.
- **New cases, "Group D — plan-review session line":**
  - D1 `fkit coder` → argv `--agent fkit-coder --settings … --append-system-prompt-file <on file>`;
    the file holds the on line.
  - D2 `fkit coder --no-plan-review` → the token is absent from argv; the file holds the off line.
  - D3 `fkit coder --plan-review` → a no-op: the on line, and the token is absent.
  - D4 `fkit coder --no-plan-review --plan-review` → exit 2, never exec'd.
  - D5 `fkit lead --no-plan-review`, `fkit architect --plan-review` → exit 2, never exec'd.
  - D6 `fkit coder --append-system-prompt "X"` → `--append-system-prompt X` passed through unchanged,
    plus the line flag.
  - D7 `fkit coder --resume` → `--resume` passed through, plus the line flag.
  - D8 `fkit coder -- --no-plan-review` → passed through after `--`; the on line.
  - D9 `fkit coder --append-system-prompt-file f` → exit 2, never exec'd.
  - D10 every non-coder role's argv carries no line flag (tests 1/1b, kept as exact-argv checks).
- Cost: about 10 launcher runs, roughly +6–8 s. `npm test` was 76–85 s locally, so it stays under the
  2-minute budget.

### 3. `claude/skills/fkit-plan-task/SKILL.md`
- **Argument:** `$ARGUMENTS` = the brief path, plus optional `--no-plan-review` / the no-op
  `--plan-review`. Both together, or any other `--` token, → stop before planning and ask the owner (in
  a session, `AskUserQuestion`).
- **New Workflow step 0 — the gate check, before step 1.** Work out on/off and its report line:
  - **On** = (a) the spawn prompt carries the driver's switch line (unchanged), **or** (b) **both** the
    system prompt carries the launcher's on line **and** `AskUserQuestion` is in the toolset.
  - **Off** = `--no-plan-review` on this call, the launcher's off line, no line at all, or a spawn
    without a driver line.
  - On and off lines both present → off.
  - A quote of the line inside a file you read does not count.
  - In a session the off line is one of `Plan review: off (--no-plan-review)` / `off (fkit coder
    --no-plan-review)` / `off (no fkit session line)`. A spawn with no driver line is unchanged: no line.
  - With review on in a session: the step-0 chat line (report §3.3 step 0), verbatim.
  - **Plan mode already on** (with review on, in a session) → the §3.6 stop, before drafting. See
    "Plan-mode-already-on stop" below.
- **Step 1:** with review on, **skip `EnterPlanMode`** and draft under the planning-only rule. Write no
  source and no file. Off paths are unchanged: plan mode first.
- **Step 7:** with review on, first `EnterPlanMode`, then `ExitPlanMode`.
- **Gated section:**
  - New trigger text (a)/(b).
  - Session variants:
    - hop line `hop 1 of 2; chain: coder → <role>`, plus the leaf sentence;
    - the Codex hop line `hop 1 of 2; chain: coder → adversarial-reviewer`;
    - a disagreement after round 2 → `AskUserQuestion` to the owner; the ruling is quoted with date and
      channel `fkit coder session, AskUserQuestion`. No `NEEDS-DECISION`.
  - Progress lines: one per round, one for Codex.
  - Codex: its normal procedure. **No plan-mode note, no retry.** **Never spawn it while plan mode is
    on.** If the spawn fails → the existing `plan review incomplete: Codex pass not run (<reason>)`.
  - The record gains `Plan mode: off for draft and review (<UTC> – <UTC>); on at <UTC> for the gate`
    and `Owner revision: … — not re-reviewed`.
  - Session presentation order: banners → `Plan review: ON (default)` → the plan → the three
    attachments → the record block.
  - Owner revision at the gate: banner `revised after owner feedback — not re-reviewed`. Re-review only
    if he asks; Codex then goes through the plan-mode-already-on stop.
  - **On approval, with a task-folder brief:** write `<task-folder>/plan-review.md`. Format: ADR-056
    Decision 6 — `## Attempt N — <date>`, the record, `Presented: <UTC>`, `Owner decision: approved via
    ExitPlanMode, <UTC>, fkit coder session`. Done before any other edit. `plan.md` stays unwritten on
    this path.
  - With no task folder: say "record not persisted — no task folder" in the presentation.
  - On rejection: the line `plan-review record not persisted (plan rejected while in plan mode)`.
  - Nothing is written before approval. That is now the only thing holding the draft-and-review
    stretch; say so.
  - Spawned path text (driver line, hop 2, `NEEDS-DECISION`): **unchanged**.
- **Plan-mode-already-on stop (report §3.6; Q4 below confirms it).** The two unproven mechanics:
  - **How the coder knows the mode:** it is told when plan mode is on (the plan-mode system notice).
    It treats plan mode as off only once its latest turn carries no plan-mode notice. If it cannot tell,
    it asks the owner to confirm in chat before spawning the reviewer.
  - **How the owner leaves plan mode:** the stop is a **chat message ending the turn, not an
    `AskUserQuestion` dialog**, because a dialog may block Shift+Tab. It names three typed replies:
    **(Rec)** "Shift+Tab out of plan mode, then reply `go`"; `skip codex` → flagged `plan review
    incomplete: Codex pass not run (plan mode on)`; `no review` → same as `--no-plan-review`.
    - This departs from "ask with `AskUserQuestion`" for this one stop, and the skill says why.

### 4. Agent prompts (canonical `claude/agents/`)
- `fkit-coder.md`:
  - the procedures bullet: also on in a `fkit coder` session by the launcher's line; writes
    `plan-review.md` on approval for a task-folder brief; otherwise writes nothing;
  - the adversarial-reviewer consult bullet: "(switch line or session line)".
- `fkit-architect.md` and `fkit-producer.md`: "At hop 2 you consult no one" → "As a plan approver you
  consult no one, at any hop".
- `fkit-lead.md`:
  - "Only the sprint loop has it: …" → sessions have it on by default (ADR-060), off with
    `fkit coder --no-plan-review` or `/fkit-plan-task <brief> --no-plan-review`;
  - both "old way" wall pointers gain `--no-plan-review`.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md`: only the honesty clause's "old way" sentence →
  `fkit coder --no-plan-review` + `/fkit-task-ship-loop`. The "structural" wording stays for 0545.

### 5. Docs
- `ai-agents/tasks/README.md` + its scaffold twin (byte-identical): the `plan-review.md` row cites
  ADR-056 and ADR-060, plus one line on who writes it (the sprint-loop driver; in a `fkit coder` session,
  the coder, on approval). Then `npm run generate:manifest`.
- `CHANGELOG.md` `## Unreleased`:
  - one new entry for the session default and `fkit coder --no-plan-review`;
  - fix the existing entry's now-false sentence "`fkit coder` sessions, `/fkit-task-ship-loop` and a
    plain `/fkit-plan-task` are unchanged."
- **Usage-error rule:** if Q3 picks the wider rule, an `@fkit-architect` consult (hop 1) adds a dated,
  additions-only note to ADR-060 Decision 3. The ADR files otherwise stay untouched (verification 6).

### 6. Interim window (brief open question 5) — named, not solved here
Once 0543 is committed and `.claude/` refreshed, a `/fkit-task-ship-loop` in a `fkit coder` session
already reaches the review-on path through step 2. Until 0544 lands:
- step 2's "produce the plan in plan mode" text is stale (fkit-plan-task's text governs; plan mode is
  still on at step 3's gate, so step 4's "releases the write wall" holds);
- the loop has no per-run opt-out (use `fkit coder --no-plan-review`);
- the loop does not write `plan-review.md` at step 4 or show the record in its packet.

**Recommendation:** commit 0543 and 0544 together, or ship 0544 next. 0544 is next in Sprint 12 and
depends on this one.

## Verification
- `npm test` (all) + `npm run test:prove-red` (the launcher and launcher-contract test changed:
  CONTRIBUTING's table). Report times against the 2-minute budget.
- Manual: `sh -n claude/fkit-claude.sh`; `fkit --help` text by eye.
- `diff` the tasks README twins; the structure-manifest test is in `npm test`.
- `git diff` on ADR-019/056/059/060: additions only, or none.
- **Not runnable in this session (stated, not skipped silently):** brief verification step 4 (the live
  check needs a fresh `fkit coder` after `claude/fkit-claude-init.sh .`). It cannot run inside the
  session that built it (brief Notes). It goes to the owner as the post-build live check, with exact
  steps in the worklog. Step 5 (a spawned coder with no driver line still skips review) is a prompt
  behaviour; it also goes to the live check list.
- Then the stateful review (`@fkit-reviewer`, task-id `0543`).

## Files touched
`claude/fkit-claude.sh`, `test/launcher-contract.test.js`, `claude/skills/fkit-plan-task/SKILL.md`,
`claude/agents/fkit-{coder,architect,producer,lead}.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`,
`ai-agents/tasks/README.md`, `claude/scaffold/ai-agents/tasks/README.md`,
`claude/structure-manifest.tsv`, `CHANGELOG.md`; the 0543 folder (`plan.md`, `worklog.md`,
`review.md`), the brief status and the sprint-12 row. Perhaps ADR-060 (a dated note, via the architect,
only if Q3 = wider). No commit.

## Owner answers (2026-10-27, `fkit coder` session, `AskUserQuestion`, verbatim)
- Q1 *"OK to add ~10 plan-review cases (Group D) to the existing test/launcher-contract.test.js, and
  update tests 1, 6, 11 for the new coder argv?"* → *"Yes, OK those cases (Rec)"* (description: *"Cases
  D1–D10 as listed in the plan; no new test file; ~+6–8 s on npm test."*). **The owner's OK by name for
  D1–D10 in `test/launcher-contract.test.js`** (ADR-057 §D2.1).
- Q2 *"Inline plans … get no plan review. Confirm?"* → *"Confirm: no review (Rec)"*. ADR-060 Decision 6
  confirmed.
- Q3 *"After a non-coder role (e.g. fkit lead), which flags are an fkit usage error?"* → *"Both flags
  (Rec)"*. The wider rule (report §3.2); an `@fkit-architect` consult adds a dated note to ADR-060
  Decision 3.
- Q4 *"Plan mode already on when review would run: stop with a chat message (go / skip codex / no
  review)?"* → *"Confirm the stop (Rec)"*. Report §3.6's stop, with the mechanics in step 3.
