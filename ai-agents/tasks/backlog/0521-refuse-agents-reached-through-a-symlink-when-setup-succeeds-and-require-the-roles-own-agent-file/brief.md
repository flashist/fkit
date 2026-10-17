# Refuse agents reached through a symlink when setup "succeeds", and require the role's own agent file

## ID
0521

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**Where this comes from.** This is the follow-up that
[`0334`](../../done/0334-fix-the-launchers-symlink-blind-agents-fail-safe/brief.md) (🔄 In progress, Sprint 12)
deliberately leaves open. 0334 replaces the launcher's name-existence guard with an `agents_usable`
function, but that guard only runs when setup failed (`setup_ok = 0`). Its approved plan
(`plan.md`, heading *"10. Residuals / not done"*) names two residuals:
*"A/B on a launch where setup succeeds (Q1)"* and *"The guard checks "any agent", not "this role's
agent". That goes into Q1's follow-up."*

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session running the Sprint 12
sprint loop, at 0334's plan gate; relayed to a spawned producer with no owner channel, per
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
Question: *"Q1: a symlinked .claude when setup 'succeeds' isn't caught. What do we do?"* — chosen
option, verbatim label: **"Ship as scoped + follow-up brief (Recommended)"**, described as
*"Producer files one backlog brief for it (and the role-file gap). Knock-on: new Backlog row; nothing
waits on 0334."* The same ruling is recorded in 0334's `plan.md`, heading *"Owner rulings at the plan
gate (2026-10-16, AskUserQuestion, fkit-lead session)"*.

### Gap A — setup "succeeds", but the agents are reached through a symlink

- If a project's `.claude` or `.claude/agents` is a symlink, `claude/fkit-claude-init.sh` refuses the
  agents refresh (its `path_contained` check), prints *"⚠ skipped the .claude/agents refresh: …"*,
  and **exits 0**.
- So the launcher's `setup_ok` stays 1, and 0334's guard (*"if [ "$setup_ok" = 0 ] && …"*) never runs.
- The session then starts on whatever `fkit-*.md` files sit behind the link — possibly outside the
  project, possibly stale, possibly not fkit's at all.
- **Measured** in 0334's plan, heading *"2. Measured firsthand (2026-10-16 …)"*: *"A → rc 0, with the
  warning "skipped the .claude/agents refresh: '.claude' is a symlink""* and *"B → rc 0, same
  warning."* (A = `.claude` is a link to an outside dir; B = `.claude/agents` is.)
- **Codex rated it high.** 0334's `plan-review.md`, *"Attempt 1 — 2026-10-16"*, finding X1: *"The plan
  knowingly leaves the primary `.claude`/`agents` symlink escapes live. Current init treats its
  containment refusal as rc 0, so `setup_ok` remains 1 and the proposed guard is never called."*
- Init's own warning already tells the user *"Replace the symlinked path with a real directory, then
  re-run: fkit"* — so fkit already treats this layout as unsupported for setup. Whether a **launch**
  should also refuse is the product question below.

### Gap B — the guard checks "any agent", not "this role's agent"

- 0334's `agents_usable` succeeds if **any** readable, regular `fkit-*.md` exists. It does not check
  that `fkit-<role>.md` — the file `claude --agent fkit-<role>` will actually load — exists and is
  usable.
- The role is picked **after** the guard: by the menu, the named-role argument, or the fresh-project
  path (which opens `fkit-producer`, then falls through to `fkit-lead`). So a role-specific check
  must sit next to each `claude --agent` call, not inside today's guard.
- What `claude --agent` does with a missing or unusable agent file is not measured here. The
  launcher's own comment above the guard says it *"would die on its own confusing "agent not found""*.
  If it instead starts an unroled session, that fails **open** (no ADR-010 lockdown) and this gap is a
  security gap, not just a bad message. Measuring that is step 1.

### ⛔ The product decision — the owner rules it at the plan gate, the coder does not

The simplest fix for Gap A — run the usable-agents check on **every** launch, not only when setup
failed (drop 0334's `setup_ok = 0` gate) — **refuses every launch of a project that symlinks
`.claude` on purpose** (for example, a dotfiles-managed or shared `.claude`). The owner has already
seen this option at 0334's plan gate (Q1 option 2, *"Widen 0334 to drop the gate. This refuses every
launch of a project with a deliberately symlinked `.claude`."*) and chose not to do it inside 0334. It
is still open as a choice for this task.

The plan must put the choice to the owner, with what each option changes for a real user. Candidate
shapes (not a prescription; the plan may find others):
1. **Refuse** on every launch when `.claude` or `.claude/agents` is a symlink (drop the gate for this
   check). Safe; breaks deliberate symlinkers, who must replace the link.
2. **Refuse only when the link resolves outside the project**; allow an in-project link. Note: this
   diverges from the owner's 0334 ruling PC3 (*"Refuse any symlink (Recommended)"*), which set the
   strict rule for the setup-failed launch. The plan must say whether the two paths would then
   disagree, and why that is acceptable, or not offer this.
3. **Launch, but warn loudly** naming the link and its target. Keeps deliberate symlinkers working;
   leaves the escape open.
4. **Refuse by default, with an explicit opt-in** for a deliberately symlinked `.claude`. The plan
   must say how the opt-in is given and whether it can itself be planted by a hostile checkout.

**Wiki gap:** the wiki records no ruling on whether a deliberately symlinked `.claude` is a supported
layout (checked 2026-10-16).

## What to build

**1. Measure first — and record it in `worklog.md` before any plan option is chosen.**
- Re-run 0334's cases A and B (a scratch project; `.claude`, then `.claude/agents`, linked to an
  outside dir holding `fkit-*.md`) against the then-current launcher: confirm init rc 0, `setup_ok`
  1, and that a session would start (use `FKIT_SETUP_ONLY` or a stub `claude`, as the existing
  launcher tests do).
- Measure what `claude --agent fkit-<role>` does when that role's file is missing, a dangling link, a
  directory, or unreadable, while other `fkit-*.md` files are fine: does it exit non-zero, or start a
  session without the role? Record the Claude Code version.
- If either measurement contradicts this brief, stop and report before planning.

**2. Gap A — close it in the shape the owner rules** (see *The product decision*). Build on 0334's
`agents_usable` rather than a second copy of the check. Whatever the ruling, the user is told which
path is a symlink and what to do, in the same voice as 0334's messages.

**3. Gap B — check the role's own agent file before each `claude --agent` call.** Every path that
hands `--agent fkit-<role>` to `claude` (the final launch, and the fresh-project path's producer
launch and its lead fall-through) first checks that **that** role's `.claude/agents/fkit-<role>.md`
is a readable regular file with no symlink on the way — the same rule as `agents_usable`. On failure:
refuse, name the role and the file, and say what to do. Never drop `--agent` to get *some* session
(the launcher's existing reason: an unroled session has no ADR-010 lockdown and fails open).
- The plan states whether Gap B runs on every launch or only where Gap A's check runs, and why.

**4. Keep the healthy path unchanged.** A normal project — real `.claude/agents/` with fresh copies —
launches exactly as today, with no new output.

**Out of scope:** `.claude/skills` behind a symlink (the plan reports whether the same gap exists
there; building a fix for it needs the owner's word); init's own refusal logic (0336, 0045); the
`.fkit` lockdown writes (0330).

## Verification steps

1. `worklog.md` holds the step-1 measurements: commands, exit codes, output, Claude Code version.
2. `worklog.md` records the owner's ruling on the Gap A shape, verbatim, with the date and channel.
3. New launcher tests (in the same harness as 0334's `test/launcher-agents-guard.test.js`, or beside
   it) cover, each with an exact exit code and stderr assertion:
   - case A and case B with init rc 0 → the ruled behaviour (refuse, or launch with the ruled warning);
   - if the ruling allows an in-project link or an opt-in: one test for each allowed shape, and one
     showing the disallowed shape still refuses;
   - Gap B: the chosen role's file missing, dangling, a directory, and mode 000, while other agent
     files are fine → refuse naming that role's file; tested for a named role **and** for the
     fresh-project producer path;
   - healthy project → launches, no new stderr.
   Each new test is shown red against the 0334-only launcher and green with this change.
4. If the launcher is in `test/prove-red.sh`'s mutation list, add mutations that remove the Gap A and
   Gap B checks and show each is caught; existing mutations stay green.
5. Run the checks CONTRIBUTING's *"What to run for a change"* table names for
   `claude/fkit-claude.sh`, and state the measured pass/fail counts. A check that was skipped (for
   example `shellcheck` not installed) is stated as skipped, not counted as passed.
6. `CHANGELOG.md` and `architecture.md` describe the new launch rule in plain words, including who it
   refuses (if the ruling refuses deliberate symlinkers, say so in the CHANGELOG).

## Notes

- **Depends on:** 0334
- **Blocks:** nothing
- **Why the dependency:** this task builds on 0334's `agents_usable` function and its guard in
  `claude/fkit-claude.sh`. Building before 0334 lands would race its edits to the same lines.
- **One brief, not two — by owner ruling.** Gap A and Gap B are technically separable (Gap B could ship
  alone). The owner's ruling asked for *"one backlog brief for it (and the role-file gap)"*, so they
  are filed together. The plan may propose a split at the plan gate if the Gap A ruling is slow to
  come; the owner decides.
- **Related, for coordination only — not dependencies:**
  [`0336`](../0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry/brief.md)
  (init's `.claude` refresh guard and its symlink messages),
  [`0330`](../0330-gate-the-launchers-fkit-lockdown-writes-against-a-symlinked-fkit/brief.md)
  (the launcher's own symlink rule for `.fkit`; keep the two rules consistent),
  [`0328`](../0328-make-inits-two-mkdir-p-calls-non-fatal-so-a-weird-fkit-or-claude-cannot-abort-setup/brief.md)
  (changes when init fails, so changes when `setup_ok` is 0),
  [`0045`](../0045-gate-read-side-symlink-hazard-in-init/brief.md) (init path-containment), and
  [`0519`](../0519-find-what-reads-claude-skills-for-role-sh-then-make-init-refresh-it/brief.md)
  (`.claude/skills-for-role.sh`, another file under `.claude`).
- **Placement:** an open task on the Backlog board waiting on `0334` in Sprint 12. Nothing on a sprint
  board waits on this task. Knock-on: none (checked 2026-10-16).
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by the `fkit-lead` driver. It edited no existing brief, changed no other task's
  status, priority or location, wrote nothing under `ai-agents/wiki-vault/`, and committed nothing.
