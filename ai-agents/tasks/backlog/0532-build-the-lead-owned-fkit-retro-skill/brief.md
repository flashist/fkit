# Build the lead-owned `/fkit-retro` skill

## ID
0532

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
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**Where this comes from.** Task
[`0500`](../../done/0500-research-and-decide-how-fkit-runs-a-sprint-retrospective/brief.md) — the owner's
2026-10-20 rulings are quoted verbatim in its Notes (section *"⏱ 2026-10-20 — the owner's ruling on the
research"*). The design is recorded in the ADR from
[`0531`](../0531-record-the-adr-for-how-fkit-runs-a-sprint-retro/brief.md), which this task implements.
The evidence list, with where each source lives and how reliable it is, is in
[`2026-10-20-recommendation-sprint-retro.md`](../../../knowledge-base/reports/2026-10-20-recommendation-sprint-retro.md)
§3.1 (sources E1–E15) and §5; the coder's own feasibility angle is its §4.

**The owner's own words that started it** (2026-10-09, quoted in `0500`): *"when the skill is ready, I
will test it and give you more feedback."* That trial is `0535`.

**What exists today.** No retro skill. `skills_for_role()` lists none. One ad-hoc retro report
(2026-08-29) and its follow-up (2026-09-13) are prior art.

**This brief is the core skill only.** The lead's sprint-close offer is `0533`; the consuming-project
fkit-feedback file is `0534`. Both build on this.

## What to build

1. **A new skill, `claude/skills/fkit-retro/SKILL.md`, owned by the lead.** With the usual
   `⛔ Owner:` banner. **Session-only:** refuse a spawned/headless invocation, the way
   `/fkit-sprint-ship-loop` does (the interview needs `AskUserQuestion`, which a spawn lacks — ADR-021).
   **One form** (ruling 2), about **10 minutes of owner time**. Its argument is the **subject**: the
   sprint just closed by default, or *every sprint since the last retro*. The argument never selects a
   short or full output (`conventions/one-skill-one-output.md`).
2. **Three steps, as the ADR records them:**
   1. **Evidence (spawned `@fkit-producer`, read-only on everything except the report it writes).** It
      measures the sources in report §3.1 for the subject, and writes the **measured** half of
      `ai-agents/knowledge-base/reports/YYYY-MM-DD-retro-sprint-<N>.md`. The lead then reads that one
      file — reading a role's returned answer, not diagnosing (its *"never diagnose"* tripwire,
      `claude/agents/fkit-lead.md`).
   2. **Interview (the lead, in the session).** Per `conventions/asking-the-owner.md`, so the *"Explain
      more, then ask again"* option appears once on every question. Suggested order (report §5 —
      from the recommendation, not separately ruled; the trial checks it): the **previous retro's
      actions first**, status read from disk by task ID; **one open question** before any agent
      candidates are shown (to avoid anchoring him on the agents' list); then candidates for *what went
      well*, *what hurt*, *what we change*, drawn from the evidence; then **at most 3 candidate
      briefs**, each with its placement and knock-on, approved before anything is filed; close with
      one *"was this worth your time?"* question (its answers feed `0535`'s trial log). Owner words and
      agent observations are kept apart in the report (the geoconflict pattern).
   3. **Record + file (spawned `@fkit-producer`).** The lead relays the owner's picks **verbatim, with
      date and channel**; the producer completes the report and runs `/fkit-task-brief` per picked
      item. Filed briefs are recorded in the report **by task ID**, and each links back to the report.
      Unpicked candidates stay in the report as *observations*.
   Handle a failed or partial spawn the ship-loop way: read disk before deciding, never assume.
3. **The measured-or-judgement rule, in the evidence step's instructions (ruling 3: no helper).** The
   numbers come from `dashboard.sh` and `throughput.mjs` (both in the `fkit-status` skill folder) plus
   **stated `grep -c` counts**. **Each number is printed with the command that produced it.** Absent
   data reads **`unknown`, never 0** — ADR-053 owner-involvement data reads `unknown` until it exists.
   Read board status through `dashboard.sh`, never by re-parsing the banner. Owner session transcripts
   are not evidence. Where report §3.1 rates a source *partial*, *proxy* or *judgement*, the retro says
   so in those words.
4. **Output home.** The one report above, linking one way to the closed board in `sprints/done/` or
   `sprints/cancelled/`. **Nothing is written beside the board, the closed board is not edited**, no
   wiki write. A past retro is never edited in place.
5. **Role→skill registration.** Add `fkit-retro` to the `lead` line of `skills_for_role()` in
   `claude/skills-for-role.sh`. Update **every mirror that file's header lists** (today six:
   `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`,
   `ai-agents/knowledge-base/architecture.md`, `test/skill-ownership-hook.test.js`,
   `claude/fkit-claude-init.sh`) — re-read the header at build time, it is the list of record. A
   mirror that carries no per-role skill list (the header says `fkit-claude-init.sh` mirrors only the
   role list) is checked and left alone, with the reason stated in the worklog. Add the skill to the
   owning agent's skill list in `claude/agents/fkit-lead.md`.
6. **The one test change** (ruling 3): add `fkit-retro` to the hard-coded `UNIVERSE` and `OWNED.lead`
   mirror in `test/skill-ownership-hook.test.js` (ADR-057 key list, D2.3 items 2–3). The file's own
   comment notes `fkit-sprint-ship-loop` is missing from that mirror — *"pre-existing gap, not this
   task's to close"*; leave it.

**Implementation notes for the plan:**
- `AskUserQuestion` holds at most 4 options; check whether multi-select is available for picking among
  candidates (report §5 marks this *not verified*). If it is not, batch.
- If `claude/scaffold/CLAUDE.md` changes, the structure manifest may need regenerating
  (`claude/structure-manifest.tsv` says *"regenerate: npm run generate:manifest"*); the plan checks.
- After the build, this repo's `.claude/` copies are refreshed by `claude/fkit-claude-init.sh .`. An
  agent-prompt change reaches only a **relaunched** session (`0474`'s note on `0473`'s smoke test).
- Report §4.3 estimates about 150–300 lines of skill text and about 10–12 files.

**Out of scope:** the lead's sprint-close offer (`0533`); the fkit-feedback file (`0534`); any test on
skill text, any new test file, any new prove-red case, and any helper script (ruling 3); saving the
ship-loop's sprint roll-up (not filed); any wiki write; running a real retro (that is `0535`).

## Verification steps

1. `claude/skills/fkit-retro/SKILL.md` exists, carries the lead `⛔ Owner:` banner, and states it is
   session-only and refuses a spawned invocation.
2. `bash -c '. claude/skills-for-role.sh; for r in lead producer coder architect reviewer adversarial-reviewer wiki; do echo "$r: $(skills_for_role $r)"; done'`
   shows `fkit-retro` on the `lead` line **only**.
3. `grep -l fkit-retro` hits every mirror the `skills-for-role.sh` header lists that carries a per-role
   skill list, plus `claude/agents/fkit-lead.md`; each mirror not edited is named in the worklog with
   its reason.
4. `node --test test/skill-ownership-hook.test.js` is green and includes `fkit-retro` in its matrix
   (lead → allow, every other role → deny). The full default `npm test` is green within ADR-057's
   2-minute budget.
5. **No new test file, no new prove-red case, no helper script:** `git status --porcelain test/` shows
   only `test/skill-ownership-hook.test.js` modified, and `claude/skills/fkit-retro/` holds no
   executable.
6. `grep` on the skill text shows each of: `dashboard.sh`; `throughput.mjs`; `grep -c`; the rule that
   each number is printed with its command; `unknown` with *never 0*; the report path pattern
   `retro-sprint-`; *at most 3* candidate briefs; the previous retro's actions first, by task ID;
   nothing written beside the board; `asking-the-owner.md`.
7. One smoke check in a relaunched `fkit lead` session in this repo (after `claude/fkit-claude-init.sh .`):
   `/fkit-retro` loads without a skill-ownership denial. Running a real retro is **not** part of this
   check — that is `0535`.
8. No file under `ai-agents/wiki-vault/` or `CLAUDE.md` changed.

## Notes
- **Depends on:** 0531
- **Blocks:** 0533, 0534, 0535
- **Related:** `0500` (research and ruling); `0519` (this repo's stale `.claude/skills-for-role.sh`
  copy — the hook here reads `claude/`, per that brief's measurement, so not a dependency); `0525`
  (`throughput.mjs` needs node); `0485`–`0491` (ADR-053 data, future evidence); `0474` (relaunch
  lesson).
- ⛔ **Do not start without the owner's specific word.**
- **Knock-on (stated per `placement-questions-state-the-knock-on.md`):** filed on the **Backlog board**
  (owner ruling 5, 2026-10-20). It waits on `0531` (Backlog). `0533`, `0534` and `0535` wait on it,
  all on the Backlog board. Nothing in Sprint 12 or Sprint 14 waits on it (checked 2026-10-20).
- **Why its own brief:** the core skill can be built, registered, tested (hook matrix) and used on its
  own; the lead's offer and the feedback file are separate edits that each build on it.
- **Owner choice:** `fkit-coder` — skill text, registry and the one test edit are build work.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- Filed 2026-10-20 by a spawned `fkit-producer` on owner rulings relayed by `fkit-lead` (no owner
  channel, ADR-021). No commit.
