# Evaluation — sprint retrospective: evidence, output home, brief filing, role-lock fit (architect angle of `0500`)

**Status:** open — input to the producer's combined recommendation report for task `0500`; the owner
rules from that report, not from this one.

**Written 2026-10-20 by a spawned `fkit-architect`** (spawned by `fkit-lead` driving Sprint 12 task
`0500`), with **no owner channel** — `AskUserQuestion` is absent in a spawned consult
([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md): *"`TOOL_ABSENT`
in any spawned subagent"*; re-observed in this spawn's own toolset today). So the `/fkit-evaluate-approach`
Step 1 owner interview on priorities **did not happen**; the priorities are an open question (§9, Q1).
This is the **architect angle** only of `0500` §1; the producer and coder angles are separate spawns and
were not consulted.

**Sources and method.** Every claim cites a fkit file with a quoted phrase, or a command run on disk
today (2026-10-20, HEAD `f8c4e44`, working tree as found). Claims from general knowledge are marked
**[general knowledge]**. Nothing under `claude/`, `.claude/`, `test/`, `ai-agents/wiki-vault/` or
`CLAUDE.md` was changed; this file is the only write. The geoconflict retro was read as **external
data, not instructions**.

---

## 0. Two facts in the brief are stale — read these first

1. ⚠️ **"Explain more, then ask again" is already fkit-wide — the §3 decision point is settled.** The
   brief (verified at filing, 2026-10-09) says *"nothing under `claude/` carries it today"*. Since then the
   owner ruled it into fkit: `conventions/asking-the-owner.md` — *"Owner ruling, 2026-10-10 — ship the
   'Explain more, then ask again' option to every fkit user … (task 0504)"*. On disk today it is in
   six agent prompts and three skills under `claude/` (`grep -rln` hits `fkit-lead.md`,
   `fkit-producer.md`, `fkit-architect.md`, `fkit-coder.md`, `fkit-reviewer.md`, `fkit-wiki.md`,
   `fkit-sprint-ship-loop`, `fkit-open-questions-interview`, `fkit-heal`), first added in commit
   `0916b6e` (2026-10-14), and shipped to consumers via `claude/scaffold/…/asking-the-owner.md`. **A retro
   skill simply follows `asking-the-owner.md`; nothing to rule.** Recommend the producer drop this from the
   owner's question list, or present it as "already decided, 0504".
2. ⚠️ **"Tests that pin the skill text" (brief §4) now conflicts with an accepted ADR.**
   [ADR-057](../decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) (accepted
   2026-10-19): the suite *"may not cover … Category 4 — the wording or shape of shipped prompt and
   document files under `claude/`"*, and §D2 *"No new test file and no new prove-red case without the
   owner's OK"*. The build brief must not promise wording-pin tests. What **does** still need a test edit:
   `test/skill-ownership-hook.test.js`, which `claude/skills-for-role.sh` lists as *"OWNED, the
   hard-coded mirror the hook test asserts against"* — adding a skill to `skills_for_role()` means updating
   that existing mirror (an edit, not a new file).

---

## 1. The problem, in one sentence

Where does a per-sprint retrospective get its facts, where does its write-up live, how do its action
items become owner-approved briefs, and which role can own it given that the interview needs
`AskUserQuestion` (session-only) and filing needs `/fkit-task-brief` (producer-only)?

---

## 2. Evidence a retro can read — what exists TODAY, where, how reliable

"Today" = checked on disk on 2026-10-20 with the command or file named. Reliability is the architect's
judgement of how far a count from that source can be trusted, with the reason.

| # | Source | Where it lives | Exists today? | Reliability, and why |
|---|---|---|---|---|
| E1 | **Closed sprint board** | `ai-agents/sprints/done/sprint-N.md` (or `sprints/cancelled/`) | ✅ 12 boards in `done/`; `cancelled/` empty | **High for row status; low for free text.** Line 3 is mover-written (*"`✅ Done` and `⛔ Cancelled` are settable only by `/fkit-sprint-done` and `/fkit-sprint-cancelled`"*, sprint-13.md). Free text bloats: `wc -l` → sprint-2 4,670 lines, sprint-11 1,413, sprint-13 88. ⛔ **Read status through `dashboard.sh`, never re-parse the banner** — `bin/fkit-board.mjs` quotes the rule: *"The recognizer has exactly one implementation, in `dashboard.sh`. Do not re-state the regex anywhere else."* |
| E2 | **Task briefs** (status, owner rulings, dated correction notes) | `ai-agents/tasks/{done,backlog,cancelled}/<id>/brief.md` | ✅ 312 done, 186 backlog, 32 cancelled | **High for status and for owner rulings** — rulings are quoted verbatim with date and channel by convention (e.g. sprint-13.md: *"Selected option text, verbatim"*). `grep -l 'via \`AskUserQuestion\`'` hits 113 done briefs. |
| E3 | **Plan + worklog** (decision log, close-out evidence) | `<task>/plan.md`, `<task>/worklog.md` (ADR-020) | ✅ but **partial**: 169 / 176 of 312 done tasks | **Medium — exists only for loop-driven tasks.** Per-sprint coverage (unique task paths linked anywhere on the board, so notes are included): S7 15/20, S8 9/20, S9 8/13, S10 22/28, S11 3/7, S13 5/5. Research and doc tasks often have none. A missing worklog is "no record", never "nothing happened". |
| E4 | **Review ledgers** | `<task>/review.md`; older sprint-keyed ones in `ai-agents/sprints/reviews/` | ✅ 195 done tasks have one | **High — tabular and countable.** Findings carry a `Round` and `Sev` column; the Coder response `Status` uses *"one of exactly these six prescribed values"* (`fkit-sprint-ship-loop/SKILL.md`, Process review step 4): `✅ done`, `won't fix (frontier)`, `disproven`, `closeout (re-litigation)`, `blocked`, `pending approval`. Sprint 13 example: `0528` has 2 `closeout (re-litigation)` rows. |
| E5 | **Review coverage / degraded runs** (ADR-042 coverage state; ADR-054 Claude-only flag) | `Coverage:` header line in `review.md`; *"NOT model-diverse"* wording | ✅ ~60 ledgers carry a `Coverage:` line; 10 ledgers/worklogs carry the ADR-054 flag wording; 3 ledgers say `Codex unavailable` | **Medium — format drifts.** The header appears in at least 6 spellings (`**both reviewers measured** (ADR-042 D1)`, `… (round 2)`, `**round 3` …); a count needs a tolerant match and must say so. Older ledgers predate the header. |
| E6 | **Plan-review attempts** (ADR-056, opt-in) | `<task>/plan-review.md` | ✅ 13 done tasks | **High but sparse** — only when the owner turned plan review on for a run (*"off by default"*, ADR-056 title). Zero files ≠ zero plan problems. |
| E7 | **`NEEDS-DECISION` count and how long each waited** | No home. Mentions in 60 done worklogs and 18 done briefs; the live relay happens in the lead's chat | ⚠️ **Count partial; wait time does not exist anywhere** | **Low.** No convention records each one, and nothing timestamps the wait. The ship-loop's sprint roll-up (*"tasks **shipped / blocked / pending**"*, `fkit-sprint-ship-loop/SKILL.md` §5.5) is **printed to the owner, not saved to disk**. Must be reported as `unknown`, never 0. |
| E8 | **Blocked runs, dead workers, timeouts** | `🚧 Blocked — …` status text in brief + board row; worklog narrative | ⚠️ partial | **Low–medium.** A `🚧` status is overwritten when the task later closes, so only a still-blocked row is visible on the board; earlier blocks survive only in worklog/brief prose. |
| E9 | **Test and flake history** (e.g. `0477`) | No on-disk history. Narrative in briefs/worklogs; nightly prove-red runs on GitHub Actions (`.github/workflows/*.yml`: *"cron: '17 3 * * *'"*) | ⚠️ narrative only; CI history is **external** (needs `gh` + network) | **Low.** `0477`'s brief: *"In neither case is the failing test known. prove-red's output was already gone."* |
| E10 | **Stale citations / broken links** | Was `test/reference-integrity.test.js` | ⛔ **No automated detector today** — the test file is gone from `test/` (removed under ADR-057 by `0529`) | **Judged only** — from review findings and wiki-lint reports. |
| E11 | **`throughput.mjs`** (created vs closed per ISO week; record-repair share) | `claude/skills/fkit-status/throughput.mjs` (ships to consumers inside the producer's `fkit-status` folder) | ✅ ran today: `totals created 530 closed 344`, `repair-pct 11.8` | **High as a trend, misaligned to sprints.** Its own header: *"reads git, never the worktree"* and *"an uncommitted close is not counted"*. Weeks are ISO weeks, not sprint windows. The repair share is *"A PROXY, PERMANENTLY"* (file comment). |
| E12 | **Git history** | `git log` | ✅ 334 commits | **Low for meaning, fine for dates.** Commit subjects are mostly bulk: `Sprint push` ×60, `Tasks update` ×59, `Skills update` ×19 — dates are commit dates, not work dates (the 2026-08-29 retro already warns: *"'Created' means first committed, not first written"*). |
| E13 | **ADR-053 owner-involvement data** (*"Owner involvement"* worklog line; *"autonomous after plan approval"* count) | Would be a launcher-only local log + a summarizer line in `worklog.md` | ⛔ **Future.** ADR-053 *"Status: `proposed` — not accepted"*; `0485`–`0491` all in `tasks/backlog/` | When built, entries are deletable after *"about 30 days"* (ADR-053 D4), so a retro must run within 30 days of the sprint or read `unknown`. Until then: `unknown`, never 0 (as the brief says). |
| E14 | **Prior retro reports** (baselines + last retro's actions) | `ai-agents/knowledge-base/reports/2026-08-29-retro-…md`, `2026-09-13-does-the-backlog-converge-measuring-k.md` | ✅ | **High** — written to be measured against: *"Do not silently update the numbers in place — a later measurement belongs in a new report that cites this one."* |
| E15 | **Owner session transcripts** | `~/.claude/projects/-Users-mark-dolbyrev-Workspace-fkit/` (36 entries; names checked, content not read) | Exists locally, **outside the repo** | ⛔ **Do not use.** Private, per-machine, may hold secrets (*"No secrets in any artifact"*, CLAUDE.md), lost to compaction, absent on any other machine or for any other user. |

**What follows for design** (architect's judgement): sources E1, E2, E4, E11, E14 are strong enough for
**measured** claims; E3, E5, E6, E8 give **measured-with-a-stated-gap** claims; E7, E9, E10, E13 give
`unknown` or **judgement** only today. The single cheapest gap to close is E7/E8: the ship-loop's sprint
roll-up is already computed and then lost to chat. Persisting it (e.g. into the closed board's report or
a sprint-keyed file) would turn the weakest AI-first signals into measured ones. That is a **candidate
build brief**, not part of `0500`.

---

## 3. Where the retro output lives

### Recommended: one dated report under `ai-agents/knowledge-base/reports/`, linking to the closed board; the closed board is not edited

- **Name:** `YYYY-MM-DD-retro-sprint-<N>.md` (date = the day the retro ran). Fits the README rule *"dated
  by when the work was done"* and ADR-013's *"knowledge-base root holds only `PROJECT.md` and
  `architecture.md`"*. A retro is exactly what `reports/README.md` calls *"true forever after because they
  describe what was done or found then"*.
- **Link one way:** report → `../../sprints/done/sprint-<N>.md`. The closed board's path is terminal
  (`done/` and `cancelled/` are end states), so the link does not rot.
- **Why not a file next to the closed board** (`sprints/done/sprint-N-retro.md`) — a concrete hazard,
  not taste: `dashboard.sh` reads *"the FIRST LINE of each `*.md` sitting beside the plan"* to *"detect
  two plans claiming ONE sprint identity"* (`dashboard.sh:24-29`), and a sprint identity is *"a WHOLE,
  delimiter-bounded segment of the H1"* (`:108`, ADR-040). A retro titled `# Sprint 13 — retro` beside
  `sprint-13.md` would be read as a **second board claiming Sprint 13**. It also puts a non-board file
  where every board reader (`dashboard.sh`, `bin/fkit-board.mjs`) looks for boards.
- **Why not also add a back-link note to the closed board:** a closed row's content is *"frozen history
  and is NEVER touched"* (`fkit-sprint-done/SKILL.md:177`); boards are producer/mover territory; and board
  text growth is the top pain the geoconflict retro reported (*"Rows only grow"*). Discovery works
  without it: the filename pattern `*-retro-sprint-<N>.md` is greppable, and the lead's close-out message
  can name the path.
- **No wiki write.** `fkit-wiki` ingests later (ADR-005 — *"Writes stay exclusive to the `fkit-wiki`
  agent"*).
- **Keep the 2026-08-29 pattern:** every figure dated with its method; never updated in place; the next
  retro is a new report that cites the last one (E14).

---

## 4. How action items become owner-approved briefs

- **Only the producer can file.** `skills_for_role()` gives `fkit-task-brief` to `producer` alone
  (`claude/skills-for-role.sh`), and the `PreToolUse` hook denies it to any other caller, *"at any consult
  depth"* (CLAUDE.md on ADR-018).
- **Shape:** the retro produces **candidate briefs** (one line each: title, why, owner role, placement).
  The owner picks which to file, **in the session**, via `AskUserQuestion`. Only picked items are filed.
  Unpicked items stay in the report as *observations*, as geoconflict did (*"left for the fkit team's
  judgment"*).
- **Knock-on:** every candidate that places a task in a sprint or on the Backlog board states its knock-on
  in the option's own description — *"`<task>` and N tasks behind it would then wait on Sprint M"*, or
  `knock-on: none (checked)` from a spawned worker (`conventions/placement-questions-state-the-knock-on.md`).
  A brand-new brief with no dependants is normally `none (checked)`; a candidate that re-points an existing
  task's `Depends on:` is the case the convention exists for.
- **The proven filing path, if the interview runs outside a producer session:** the lead relays the
  owner's picks **verbatim, with date and channel**, to a spawned producer that runs `/fkit-task-brief`.
  That is how this very task was filed (*"Filed 2026-10-09 by a spawned `fkit-producer` … from the
  lead-relayed request"*, `0500` Notes) and how the geoconflict retro became `0522`/`0523`/`0524` on
  2026-10-16. `/fkit-task-brief` already accepts a relayed ruling: *"A ruling relayed to a spawned producer
  counts the same way — the spawn names it, per ADR-037"* (`fkit-task-brief/SKILL.md:492-493`).
- **Follow-up at the next retro becomes mechanical** if each filed action item is recorded in the report
  **by task ID**: the next retro opens the previous retro report (E14), lists those IDs, and reads each
  one's folder (`done/`, `backlog/`, `cancelled/`) — a measured "did we do what we said" line, no recall
  needed. Each new brief should link back to its retro report (the `source-report` pattern, §7).

---

## 5. Role-lock fit — the three candidates

Facts that bound every option:
- **Interview:** `AskUserQuestion` works only in a session (ADR-021). A spawned producer or architect
  cannot run the interview.
- **Filing:** `/fkit-task-brief` is producer-only (§4).
- **Lead discipline:** *"Delegate, never substitute"* and *"Hand off the first 'why' — never diagnose"*
  with a tripwire — *"a **second** file read in service of explaining a behaviour … stop there and hand
  off"* (`claude/agents/fkit-lead.md:36-46`). This line was added 2026-10-09 (`git log -S` → `acd23a9`),
  **after** the 2026-08-29 retro, which the lead wrote by itself. **A lead-run retro that gathers its own
  evidence would now break the lead's own rule** — the evidence pass must be delegated.
- **Where sprints actually close today:** Sprints 10, 11 and 13 were each *"Closed … by a spawned
  `fkit-producer` on the fkit lead's instruction, under an OWNER RULING given … in a live `fkit lead`
  session"* (line 4 of each closed board); Sprint 9 carries the spawned-producer `agent-closed` marker.
  **In this repo the owner is in a lead session when a sprint closes.**
- **Proven pattern:** spawned role drafts → lead interviews the owner → spawned role records. ADR-057's
  owner answers Q1–Q6 were given *"in the live `fkit lead` session running `/fkit-sprint-ship-loop`"*;
  ADR-052 was *"Drafted by `fkit-architect`, spawned by `fkit-lead`, with no owner channel"*.

### Option A — producer owns `/fkit-retro`; the owner switches to a `fkit producer` session

- **How:** add the skill to `producer` in `skills_for_role()`. The lead's suggestion is a prompt line:
  *"Sprint N is closed. Want a retro? Leave this session (Ctrl-D) and run `fkit producer`, then
  `/fkit-retro Sprint N`."* Precedent for telling the owner to switch: `fkit-lead.md` *"When the owner
  wants a dedicated role session instead … the owner leaves this session (Ctrl-D) and runs `fkit <role>`"*.
- **Pros:** one context reads the evidence **and** asks the questions, so it can answer the owner's
  follow-ups (and *"Explain more, then ask again"*) straight from what it read. Briefs are filed
  in-session with the owner present — no relay, no verbatim-quoting overhead. The producer already owns
  the process tools (`fkit-status`, `dashboard.sh`, `throughput.mjs`). Smallest lead change.
- **Cons:** a session switch on every accepted retro, against the owner's actual habit (every ruling on
  the recent boards is from a `fkit lead` session; ADR-031 made the lead the front door). Friction on a
  *declinable* suggestion means more declines **[general knowledge: extra steps lower uptake of optional
  rituals]**. Whatever the lead saw live (waits, re-asks) does not cross the switch — though that is
  recall, not record, so §2's rule would mark it judgement anyway.
- **Effort / reversibility:** smallest. One skill, one `skills_for_role()` line + six mirrors (the header
  of `skills-for-role.sh` lists them), one lead prompt line. Easy to move to another role later.

### Option B — lead owns `/fkit-retro`; evidence and filing delegated to spawned producers (recommended)

- **How:** add the skill to `lead`; session-only, refusing a spawned invocation the way
  `/fkit-sprint-ship-loop` does (*"Session-only. Refuse a spawned/headless invocation"*). Three steps:
  1. **Evidence:** spawn `@fkit-producer` read-only: measure §2's sources for Sprint N (via
     `dashboard.sh` and `throughput.mjs`, counted ledger rows, the previous retro's action IDs), and write
     the **measured** half of the report (every figure with its method; `unknown` where §2 says so). The
     lead reads that one file — reading a role's returned answer, not diagnosing.
  2. **Interview:** the lead asks the owner (what went well, what hurt, which candidates to file) per
     `asking-the-owner.md`. Owner words and agent observations kept apart.
  3. **Record + file:** spawn `@fkit-producer` with the owner's picks **verbatim, date, channel**: complete
     the report and run `/fkit-task-brief` for each picked item, knock-on stated.
- **Pros:** runs where the owner already is at sprint close (§5 facts) — the suggestion can be accepted in
  one word. Respects the lead's delegate/never-diagnose rule (ADR-031 conductor model). Reuses the
  exact draft → interview → record shape fkit already runs for ADRs and sprint planning. Fresh producer
  contexts do the heavy reading, so the long lead session at sprint end carries only one report
  (relevant to `reports/2026-09-27-eval-keeping-ship-loop-conductors-from-bloating.md`).
- **Cons:** more moving parts — two spawns and a verbatim relay; a spawn can fail and needs the
  ship-loop-style *"read disk before deciding"* handling. The owner's deeper "why?" follow-ups cost
  another spawn (the lead cannot dig — tripwire). Adds a fifth lead skill, growing the lead's surface.
  In a consuming project where the owner closes sprints from a `fkit producer` session, the retro still
  needs a lead session.
- **Effort / reversibility:** medium. Same registry cost as A plus spawn-handling prose. Reversible: the
  evidence/record steps are producer work either way, so moving ownership to the producer later changes
  mainly who asks.

### Option C — both lead and producer own `/fkit-retro`

- **How:** list it under both roles. The filing step branches: *"if you own `/fkit-task-brief`, run it;
  otherwise spawn a producer with the verbatim picks."*
- **Pros:** works from whichever session the sprint closed in.
- **Cons:** two filing paths in one skill text, two places for the evidence step to run, two behaviours
  to trial. It also splits *who is responsible for the retro* across roles — the single-owner clarity
  ADR-018's one map gives every other role-owned skill. Nothing in the record shows the producer-session
  case is common yet (§5 facts).
- **Effort / reversibility:** highest of the three for the same outcome. Better as a later widening of A
  or B if the trial shows the need.

### Comparison

| | A — producer + switch | B — lead + delegated (⭐) | C — both |
|---|---|---|---|
| Interview has the owner channel (ADR-021) | ✅ producer session | ✅ lead session | ✅ either |
| Filing (`/fkit-task-brief`, producer-only) | ✅ direct, in-session | ✅ spawned producer, relayed verbatim (proven path) | ✅ both paths |
| Fits where sprints close today | ❌ needs a switch | ✅ same session | ✅ |
| Fits lead's never-diagnose rule | n/a | ✅ only if evidence is delegated | ✅ / ⚠️ two paths |
| Answering owner follow-ups from evidence | ✅ best | ⚠️ from the one report; deeper costs a spawn | mixed |
| Moving parts | fewest | two spawns + relay | most |
| Registry cost (`skills_for_role()` + 6 mirrors + hook-test mirror) | 1 line | 1 line | 2 lines |
| Reversibility | easy | easy | harder (two behaviours to unwind) |

---

## 6. Recommendation

**⭐ Option B — the lead owns `/fkit-retro`, session-only; a spawned producer measures the evidence and
writes the measured half of the report; the lead interviews the owner; a spawned producer records the
owner's picks verbatim and files the picked briefs with `/fkit-task-brief`. Output is one dated
`reports/YYYY-MM-DD-retro-sprint-<N>.md` linking to the closed board.**

- **Why:** it runs where the owner is when a sprint closes (Sprints 10, 11, 13), so the lead's suggestion
  costs him one answer; it keeps the lead a conductor under its own *"never diagnose"* rule; and every
  piece is a pattern fkit already runs (lead-relayed rulings to spawned producers; draft → interview →
  record).
- **Main trade-off accepted:** relay and spawn overhead, and shallower follow-up answers — when the owner
  asks *"why?"* past what the measured report says, the lead must spawn again instead of answering from
  its own reading. Option A answers follow-ups better but makes the owner change session after every
  sprint.
- **"It depends on X":** if the owner says he would happily run `fkit producer` for a retro (or closes
  sprints from producer sessions in other projects), **A becomes the better pick** — simpler, and the
  best interview. That is Q2 below.
- **Trigger (architect view; the owner rules):** the lead offers the retro **after it confirms a sprint
  close landed** (a spawned producer's `/fkit-sprint-done` or `/fkit-sprint-cancelled` report checked),
  whether the close came at the end of a ship-loop run or by a direct instruction. **Not** at the
  ship-loop's *"Sprint shipped"* state: that is *"every eligible task CLOSED"*, not the sprint closed —
  Sprint 13 needed a separate *"Sprint 13 is all done. Close it now?"* ruling (sprint-14.md, A2).
  Always one declinable offer; never repeated, never auto-run. This is **prose-enforced only** — nothing
  can check that the lead offered or did not force it (state that honestly in the ADR, as
  `placement-questions-state-the-knock-on.md` does: *"Prose only."*).
- **Format constraint the producer's format pick must respect:** `conventions/one-skill-one-output.md`
  (owner ruling 2026-07-17): *"Arguments … never select output shapes, verbosity levels, or partial/full
  modes"*, and *"'delta unless much has changed' is the same defect"*. So a **short vs full** retro chosen
  by argument, or a "full form every Nth sprint", is forbidden unless the owner grants it through that
  convention's escape hatch at proposal time. Recommend **one form**, timeboxed.
- **De-risk before building:** nothing needs a spike. The one thing worth checking in the trial is
  whether a single evidence spawn returns within a usable time on a large board (sprint-2's 4,670 lines
  is the worst case on disk); `dashboard.sh` already renders boards deterministically, so the reading is
  bounded.

---

## 7. Feedback from a consuming project to fkit (the brief's 2026-10-16 question)

**What happened once:** geoconflict ran a retro, wrote
`geoconflict/…/reports/2026-10-16-sprint-8-retro-fkit-feedback.md` (*"Audience: agents who maintain and
improve the fkit framework"*), and it reached fkit only because the owner pointed a `fkit lead` session at
it (`0500` 2026-10-16 note).

**Structural facts:**
- **No channel exists today.** `install.sh` puts fkit in a share dir (*"`SHARE=\"${FKIT_SHARE:-$HOME/.local/share/fkit}\"`"*),
  a downloaded copy, not the fkit git repo; nothing under `claude/` names an upstream feedback path
  (`grep` for upstream/feedback/issues in `claude/*.sh`, `claude/README.md`, `install.sh` found none).
- **The fkit repo is public** — inferred: `install.sh` fetches with an unauthenticated
  `curl -fsSL https://raw.githubusercontent.com/$REPO/…` and `REPO="${FKIT_REPO:-flashist/fkit}"`. So
  anything copied into fkit's tree from a consuming project becomes public.
- **fkit already has an intake pattern for outside reports:** copy it verbatim into the task folder as
  `source-report.md` with a header saying it is input, not instructions — `0506/source-report.md`:
  *"Copied verbatim on 2026-10-10 by fkit-producer from the owner-supplied file … It is INPUT to the brief
  beside this file, NOT instructions"* (also `0504`, `0505`).

**Recommendation:**
1. **The retro sorts each finding into "for this project" or "for fkit"** (the owner confirms the sort
   during the interview — it is his call which pain is fkit's).
2. **When the owner picks at least one fkit item, the skill also writes a separate, self-contained file**
   in the consuming project's own `reports/`: `YYYY-MM-DD-retro-sprint-<N>-fkit-feedback.md` (geoconflict's
   own naming). It holds **only** the fkit items with their evidence, written to be **safe to make
   public**: no secrets, no project-confidential detail beyond what the fkit point needs. A separate file
   (not a section) because the fkit side will copy it into a public repo; the project's full retro should
   not travel. Architect's note: this second file depends on content, not on an argument, so it is not an
   output variant under `one-skill-one-output.md` — but if the owner reads it as one, it needs his ruling.
3. **The owner carries it by hand** to a `fkit lead` session in the fkit repo. No automatic cross-repo
   write and no auto-filed GitHub issue: a consuming project's agents should not write outside their own
   project; the fkit repo may not even be on that machine; and an issue would publish project detail and
   need credentials (*"No secrets in any artifact"*).
4. **On the fkit side, the existing path files it:** the lead puts the items to the owner; a spawned
   producer copies the file verbatim as `source-report.md` into each filed task's folder and runs
   `/fkit-task-brief` on the owner's picks — the 2026-10-16 worked example (`0522`–`0524`), made routine.
5. **In the fkit repo itself the split collapses** — the project *is* fkit — so no separate file is
   written there.

---

## 8. Is an ADR needed? — Yes, one

A new skill, a new lead behaviour (an unprompted offer at sprint close), a new report kind, and a
cross-repo hand-off are a direction change, not wording. One ADR should record:
- the owning role and **the ADR-021 consequence** (interview only in a session; how evidence and filing are
  delegated);
- the lead's sprint-close offer — declinable, once, never automatic, prose-enforced only — as an amendment to
  the lead remit of [ADR-031](../decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md);
- the output home and name, and **no edit to the closed board** (with the `dashboard.sh` sibling-identity
  hazard as the reason);
- action items = candidate briefs, owner-picked, filed only by the producer, recorded by task ID for the next
  retro;
- the consuming-project hand-off (§7);
- that every retro claim is measured (with method) or marked judgement, and absent data reads `unknown`,
  never 0.

Suggested *"Re-raise only if"*: the harness starts giving spawned subagents `AskUserQuestion` (re-opens
ADR-021, so a spawned producer could interview); or ADR-052's built-in board replaces the markdown boards
(the evidence readers change); or ADR-053 is accepted (owner-involvement data becomes evidence). Record it
via `/fkit-record-decision` **after** the owner rules — not now.

---

## 9. AI-first signals (§2) — what the record can measure today

Each is **measured** (exact count from a fixed format), **proxy** (count by a stated rule that can be
wrong), or **judgement/unknown** today.

| Signal (brief §2) | Best source | Today |
|---|---|---|
| Review findings re-litigated | `closeout (re-litigation)` rows in `review.md` (E4) | **Measured** |
| Review rounds per task; reviewer findings disproven; frontier residuals accepted | `Round` column; `disproven`; `won't fix (frontier)` + *Accepted residuals* (E4) | **Measured** |
| Degraded runs (Claude-only second opinion, Codex unavailable) | `Coverage:` header, ADR-054 flag wording (E5) | **Proxy** — tolerant match over ≥6 spellings |
| Plans that did not carry over | `plan-review.md` attempts (E6, opt-in only); plan-rejected resets in worklog prose (E3) | **Proxy / partial** |
| Blocked runs, dead workers, timeouts | `🚧` status text; worklog prose (E8); ship-loop roll-up not persisted (E7) | **Partial** — earlier blocks are overwritten at close |
| `NEEDS-DECISION` items that waited | worklog/brief mentions (E7) | Count **partial**; wait time **unknown** |
| Briefs the owner had to correct | dated correction notes in briefs (E2); `throughput.mjs` record-repair share (E11) | **Proxy** — the repair share is *"A PROXY, PERMANENTLY"* |
| Stale citations | review findings; wiki-lint reports | **Judgement** — no detector since the reference-integrity test was removed (E10) |
| Flaky tests, timeouts in tests | brief/worklog narrative; CI on GitHub (E9) | **Judgement / external** |
| Owner load (rulings per sprint; autonomy after plan approval) | `via \`AskUserQuestion\`` count in briefs (E2) today; ADR-053 later (E13) | **Proxy** today; ADR-053 **future** |

Architect's view on the adaptation (judgement): the agents' "what went wrong for me" must come **only**
from rows like these, each with its method, because the agents doing the retro did not live the sprint —
they have the files. Where a row says *partial* or *unknown*, the report says so in those words. The
cheapest improvement to the evidence itself is to **persist the ship-loop's sprint roll-up** (E7) — it
would make the blocked/degraded/pending signals measured instead of partial (a candidate build brief,
owner's call).

---

## 10. Open questions for the owner (plain-language, for the producer to relay)

- **Q1 — What matters most for the retro?** (the `/fkit-evaluate-approach` Step 1 question this spawn could
  not ask.) Options a relayer could offer: *staying in the lead session* (favours B) · *the best possible
  interview, even if I switch sessions* (favours A) · *fewest moving parts* (favours A). Knock-on: none
  (checked) — no task is placed by this answer.
- **Q2 — Would you switch to a `fkit producer` session to run a retro?** Plain context: today, when a sprint
  closes, you are in the lead session. If the producer owns the retro, accepting the lead's offer means
  closing that session and opening `fkit producer`. If the lead owns it, you answer "yes" and it starts
  there, but the lead hands the reading and filing to producers behind the scenes. Recommended: lead owns it
  (B), unless you say switching is fine. Knock-on: none (checked).
- **Q3 — When you decline the offer, should anything be written down?** Architect's lean: no (adds board
  text, the top geoconflict pain). Knock-on: none (checked).
- **Q4 — Persist the ship-loop's sprint roll-up?** Not part of `0500`; a possible extra build brief that
  would make several retro signals measured rather than guessed. Placement would need its knock-on stated
  when filed.

**What's settled already and should not be re-asked:** the *"Explain more, then ask again"* option is fkit-wide
since the 0504 ruling (§0.1).
