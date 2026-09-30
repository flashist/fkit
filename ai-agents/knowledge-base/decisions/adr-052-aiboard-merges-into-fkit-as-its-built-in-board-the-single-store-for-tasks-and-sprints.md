# ADR-052: aiboard merges into fkit as its built-in board — the single store for every project's tasks and sprints

- **Status:** `accepted` — **approved by the owner on 2026-09-30** (see *§Authority*, A1). ⛔ **Accepted
  is not a work order:** it authorises this record, the phase briefs and five task re-scopes — **no
  phase, no code, no conversion** (*§What approval authorises, and what it does not*).
- **Date:** 2026-09-30
- **Deciders:** **the owner** (Mark Dolbyrev). Every ruling is his, given live via `AskUserQuestion` in
  `fkit lead` sessions and relayed by `fkit-lead`. His **own words** and the **option text he selected**
  are kept apart and labelled throughout. Drafted by `fkit-architect`, spawned by `fkit-lead`, with
  **no owner channel** ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- **Source of record:** [`reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md`](../reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md)
  — the page the owner approved. It holds the design detail and the evidence; this ADR holds the
  decision. ⛔ **Where they differ, this ADR wins and the difference is a defect to raise.**
- **Supersedes in part:** [ADR-051](adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)
  — its gate, trial and separate-project assumptions. ⭐ **Reaffirms its D1** (one store, never
  duplicate).
- **Amends:** [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md),
  [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) (§5 superseded),
  [ADR-050](adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed.md),
  [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md),
  [ADR-040](adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md),
  [ADR-041](adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md),
  [ADR-047](adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md),
  [ADR-014](adr-014-how-fkit-tests-itself.md). **Makes obsolete:**
  [ADR-048](adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md).
  Exact effect on each, and **when** it takes effect: *§Effect on existing ADRs*.
- **Unchanged, stated so nobody assumes otherwise:** [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md)
  (only `fkit-wiki` writes the wiki), [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md)
  (tool access), [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
  (the skill lock), and the never-commit-unprompted rule.

> **What this ADR decides, in one line:** aiboard stops being a separate project — it is rewritten in
> Node and merged into fkit as `board/`, with one command (`fkit board`) and a web page, and becomes the
> **single and only** store for every fkit project's tasks and sprints; the work runs in gated phases,
> and **each phase starts only on the owner's word.**

---

## ⛔ Read first — the three things most likely to be misread

1. ⛔ **Approval started no work.** The owner's standing rule, in **his own words** (2026-09-27):
   *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
   (because it might change the way fkit work in general)."* Every phase below needs **his own word**,
   given for that phase. ⛔ **No agent may start a phase, declare a gate passed, or treat one phase's
   approval as another's.**
2. ⭐ **Two effective dates.** Some changes hold **from 2026-09-30** (the trial is gone, aiboard is no
   longer a separate project, five tasks are re-scoped). Others hold **only in a project that has been
   converted** (the page-only owner-verified rule, the end of the line-3 banner grammar, the end of the
   read-only reader). ⛔ **Until a project is converted, it runs on today's rules — including fkit
   itself until phase 6.** The table in *§Effect on existing ADRs* gives the date for each.
3. ⭐ **"Owner-verified" becomes a label, not proof.** It will mean *"done through the owner's page"* —
   nothing more (R3). An agent on the owner's computer can still use that page. **The git commit stays
   the real human checkpoint** (ADR-049 D2, unchanged).

---

## Authority — the owner's rulings

**How given:** live, via `AskUserQuestion`, in `fkit lead` sessions, relayed by `fkit-lead`. The quotes
below are carried verbatim from the decision document's *§1 Rulings* and from `fkit-lead`'s relay of the
approval. ⚠️ **This architect did not hear them first-hand** (ADR-021).

**Legend:** **[OWN WORDS]** = he typed it; may be quoted as his. **[SELECTED]** = option text an agent
wrote and he chose; ⛔ never quote it as his words.

### A. The approval — 2026-09-30

| # | Question | Answer |
|---|---|---|
| **A1** | *"Your final decision on merging aiboard into fkit, as described in the decision document?"* | **[SELECTED]** *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."* |
| **A2** | The sprint's task list (decision document §9 item 2) | **[SELECTED]** *"Yes, show but don't store — Follows your no-duplication principle; you still see the list everywhere."* |
| **A3** | Default priority for converted tasks (decision document §9 item 1) | ⏸ **Not ruled.** `medium` is a **proposal** he confirms or changes **at the converter's trial run** (*§D8*, item 5). |

### B. The direction — rulings R1–R12 (2026-09-30)

| # | Ruling | Kind |
|---|---|---|
| **R1** | *"we do need to integrate AI board into F-Kit as a dependency [...] Probably it would be better if it's just a deterministic software with API that both agents and humans can call."* | **[OWN WORDS]** |
| **R2** | *"we should do the rewrite, the 4-weeks trial is not needed anymore (I was able to make the decision faster). Though we can test it on fkit if needed."* | **[OWN WORDS]** |
| | then: *"Keep all the others — Only the trial goes. The converter trial run you read, the bug fixes, the Node rewrite and the other conditions stay."* | **[SELECTED]** |
| **R3** | *"Yes, and count them as mine"* — recorded as **"came through the owner's door", not proof** | **[SELECTED]** |
| **R4** | *"Every fkit project"* | **[SELECTED]** |
| | old projects: *"#1, and also we need to make sure we can "lock" fkit on a specific version of aiboard [...]"* | **[OWN WORDS]** |
| **R5** | *"Keep 0404"*; cross-project: *"No, one project at a time"* | **[SELECTED]** |
| **R6** | *"CLI for everything"* | **[SELECTED]** |
| **R7** | *"I am thinking about dropping the idea of developing aiboard as a seaprate project and to merge it into fkit completely, would it make it easier/simpler/better?"* | **[OWN WORDS]** |
| | then: *"No, fkit only → full merge — aiboard becomes fkit's built-in board; its repo is archived (history can be carried over). Simplest overall."* | **[SELECTED]** |
| **R8** | *"Don't implement it, add a task to the backlog with low priority, that will require to think about this feature again after some time (e.g. after a month of using a new version of fkit), after we understand if such situations ever happen"* (the hand-move tripwire → task `0416`) | **[OWN WORDS]** |
| **R9** | *"No, ask at launch — Launching an older-format project tells you and offers the conversion (trial run first); until then it stays on the previous fkit."* | **[SELECTED]** |
| **R10** | The standing rule (2026-09-27), quoted in *§Read first* item 1 | **[OWN WORDS]** |
| **R11** | *"Generally speaking, if some features exist in ai board, but not used in fkit yet, it doesn't mean that we should drop the feature, we should port the ai board features into fkit."* | **[OWN WORDS]** |
| **R12** | *"Drop as redundant — They're replaced by fkit's own install, its known board location, and its own agent instructions — not features lost."* | **[SELECTED]** |

### C. The detailed questions — Q1–Q16 (2026-09-30)

All **[SELECTED]** except where marked.

| Q | Question | Ruling |
|---|---|---|
| Q1 | Pilot order | *"fkit → geoconflict → pubquiz → rest"* |
| Q2 | Old markdown sprint boards | *"Frozen archive + notes — Kept word-for-word in ai-agents/legacy-boards/, read by no tool; each task also gets its old row text."* |
| Q3 | Is a producer close with the owner present owner-verified? | *"No, only the web page — Owner-verified means you did it yourself in the page; everything else is agent-closed."* ⚠️ **Against the architect's recommendation** (keep that route). |
| Q4 | May the page close a sprint with open tasks? | *"Only by choosing where they go"* |
| Q5 | Rename old free-text worklogs to `worklog-legacy.md`, word for word | *"Yes"* |
| Q6 | Turn prose "Depends on" into structured links during conversion | *"No, keep them as text"* |
| Q7 | Priorities | *"Keep all four levels — low / medium / high / critical as aiboard has them, alongside ordering."* ⚠️ **Against the architect's recommendation** (only `critical`). |
| Q8 | Port the MCP server | First *"Not in v1"*; then, after R11: *"Keep Q8: later — Port it, but after v1 — your rule still applies, just not in the first release."* |
| Q9 | Task comments next to review ledgers | *"Keep both, separate jobs"* |
| Q10 | Names | *"board/ + `fkit board`"* |
| Q11 | Who fixes T-023 in Python | *"aiboard-lead, its last task"* |
| Q12 | When aiboard is archived | *"After the fkit pilot"* |
| Q13 | How long the previous fkit is kept | *"Until every project is converted"* |
| Q14 | Epics | **[OWN WORDS]** *"Is it something that already exists in ai board? [...] if some features exist in ai board, but not used in fkit yet, it doesn't mean that we should drop the feature, we should port the ai board features into fkit."* aiboard has **no** epics (confirmed by `aiboard-lead`), so epics would be new, not a port. **Recorded: no epics for now; built only if a project needs them.** |
| Q15 | Is a close from the owner's own terminal owner-verified? | *"No, only the page"* |
| Q16 | Until the pilot, no writable `aiboard serve` on real data | *"Yes, read-only reader only"* |

### D. Reaffirmed — ADR-051 Ruling 2, 2026-09-18 **[OWN WORDS]**

> *"If we ever achieve the situation where F-Kit uses AI board, it only makes sense if we have one
> storage for the tasks and sprints. We never should duplicate them. [...] I want to avoid situations
> where the duplication is even possible [...]"*

⭐ **This is still the reason.** The merge is its fulfilment, and A2 (show, don't store) applies it.

---

## Context

- **What ADR-051 decided (2026-09-18):** if fkit ever depends on aiboard, aiboard is the single store
  (D1); aiboard stays a **separate project** whose work fkit never files (D7); fkit moves only after a
  long gate — preconditions P1–P6, acceptance test A1–A2, a trial of 4 weeks + 2 sprints + 40
  transitions with no timeout, and fail conditions F1–F5; meanwhile a read-only reader (D2).
- **What changed (2026-09-30):** the owner decided faster than the trial (R2), wants one set of rules for
  agents and humans in deterministic software (R1), and chose to end aiboard as a separate project (R7).
  Four reports written the same day were folded into the decision document and carry dated
  superseded-by notes: [`eval-aiboard-as-fkits-single-task-store`](../reports/2026-09-30-eval-aiboard-as-fkits-single-task-store.md),
  [`eval-task-ids-keep-0404-or-rekey`](../reports/2026-09-30-eval-task-ids-keep-0404-or-rekey.md),
  [`design-cli-door-enforcement-addendum`](../reports/2026-09-30-design-cli-door-enforcement-addendum.md),
  [`design-fkit-aiboard-version-lock`](../reports/2026-09-30-design-fkit-aiboard-version-lock.md).
- **Facts that shape the design** (measured, and re-checked by this architect on 2026-09-30):
  - `install.sh` ships only `claude/` — *"cp -R "$TMP/src/claude" "$SHARE/claude""*. Node is used today
    by one hook, **fail-open** — `claude/carry-check-hook.sh`, *"node not found — carry check SKIPPED
    (fail-open)"*.
  - One fkit per machine; `fkit update` re-runs the installer over it — `claude/fkit-claude.sh`,
    `_fkit_reinstall()`.
  - The four close skills are **1,814 lines** of prose an AI executes step by step
    (`claude/skills/fkit-{task-done,task-cancelled,sprint-done,sprint-cancelled}/SKILL.md`: 460 + 422 +
    456 + 476).
  - The reader already follows *tools from fkit, data from the project* — `bin/fkit-board.mjs`, *"TOOLS
    come from fkit's own checkout, DATA comes from `--root`"*.
  - fkit's last bulk move (commit `331f298`, 184 files) wrote the wrong status into 3 of ~80 done
    briefs, unnoticed for two months — the reason the converter is paranoid (decision document §6).
  - aiboard's `T-023` turns `0013` into `13` on write (ADR-051 *§Context 3*) — still live until phase 1.

---

## Decision

### D1 — The merge

aiboard stops being a separate project. Its code is **rewritten in Node** and moved into fkit as a
separate module, **`board/`**, reached through one command, **`fkit board`**, and a **web page** (Q10). It
becomes the **single and only store** for every fkit project's tasks and sprints (R4), kept as **plain
markdown files in each project's git repo**, under `ai-agents/`. The aiboard repository is **archived
read-only after the fkit pilot**, not deleted (Q12). The board is a program, not an agent — **no new
role** (R1); the team stays seven.

**Module boundary:** the rest of fkit talks to the board **only** through `fkit board …` and its `--json`
output. **Zero dependencies**, like the rest of fkit.

### D2 — One store, reaffirmed; the sprint's task list is shown, not stored

ADR-051 D1 stands. Sprint membership lives **on one side only — the task's `sprint` field** (ADR-051
P6). `sprint.md` holds goal, dates and prose. The sprint's task list is **shown** by the page and by
`fkit board sprint show`, **never written into the file** (A2). This deliberately overrides the porting
rule for aiboard's stored `tasks:` list and generated `## Tasks` checklist: **the no-duplication
principle wins over R11 here**, by the owner's ruling.

### D3 — The porting rule, and its three exceptions

- **Rule (R11):** every aiboard feature is **ported**, used by fkit today or not.
- **Exceptions (R12), dropped as redundant — not features lost:** pip/pipx packaging (→ fkit's
  installer); board discovery and the `aiboard.json` pointer (→ fkit knows its board is `ai-agents/`);
  `agents-md` instruction blocks (→ fkit's own agent instructions).
- **A form change is not a drop:** ids `T-001` → `0404`; sprint folders `S-011` → `sprint-11`; the stored
  sprint list → shown (D2); the page's free-text name box → a display name, with page writes always
  stamped as the owner door; `init` → fkit's project setup and the converter.
- **After v1 (phase 9), still ported:** the **MCP server** (Q8), **T-020** comment resolution (Q9), **T-007**
  live reload.
- **Not a port:** epics — aiboard has none. **None for now; built only if a project needs them** (Q14).
- The feature-by-feature check is the decision document's *§4*.

### D4 — The store

| | Decision |
|---|---|
| Task | A folder; **status = which folder it is in**: `backlog/`, `in-progress/`, `done/`, `cancelled/` |
| Ids | **Four digits, no letter, unchanged: `0404`** (R5). Next = highest ever + 1, cancelled included. Forgiving lookups (`404`, `0404`, `0404-slug`) ported |
| Blocked | `blocked_by` (enforced at start, cycles reported) **and** free-text `blocked_reason` |
| Priority | **low / medium / high / critical**, `urgent` → critical alias, critical to the top (Q7) |
| Order | `rank`, alongside priority; drag to reorder |
| Close record | **who** (`--by`), **which door** (command / page / converter / later MCP — **set by the board from the door, never by the caller**), **kind**, **when**, **reason** (required for Cancelled) |
| Sprints | Folders `sprints/<status>/sprint-11/sprint.md`; the backlog is tasks with no sprint, not a sprint |
| Task files | `brief.md` (front matter + text), board-owned `worklog.md` (every entry timed and signed), `comments.md` (Q9); `plan.md`, `review.md`, `assets/` stay ordinary files |
| Settings | `ai-agents/board.json`: data-format number, board name, stale-after hours |
| Ported as is | assignee + atomic `start`, labels, worklog, comments, "needs reply", stale detection, `check` / `check --fix`, `info`, `--json`, terminal kanban view, re-render hold, auto-refresh, `serve [--read-only]` |

### D5 — The rules live in the store

| Layer | What it does |
|---|---|
| **1. Store rules** | Refuses: close / cancel / reopen through the command unless `--by` is the producer · a close with no record · a cancel with no reason · a sprint close that strands open tasks · starting a blocked task · any write to data in a format it was not built for. **Owner-verified if and only if the door is the page** (Q3, Q15) |
| **2. Identity hook** | `PreToolUse` on the terminal tool: a `fkit board` write's `--by` must equal the calling agent's real role; an unreadable form (`sh -c`, `eval`, variables) is refused; `fkit board serve` is refused for agents. After v1, the same check for MCP calls |
| **3. Skill lock** | The close skills stay producer-only (ADR-018, ADR-033) — unchanged |
| **4. Detection** | `fkit board check` flags a task in `done/` or `cancelled/` with no close record, or a record that does not fit its door; `fkit-status` shows it (kept, R8) |
| **5. Hand-move tripwire** | **Not built** (R8). Task `0416`, low priority, to revisit after about a month of use |

- **`sprint close --carry-to <sprint|backlog>`** does a whole sprint close in one call. The page's
  sprint close asks for the same destination (Q4).
- **Every write takes `--by`**, and the board records an author on every write.
- **The honest limit (ADR-033 *§The limit*, inherited):** an agent that follows the rules cannot close,
  cannot sign as someone else, and cannot produce an owner-verified close. An agent trying to get around
  them can — most simply by moving a folder by hand — and is caught afterwards by layer 4. **Who does
  what, never prevention**, now enforced where the write happens.

### D6 — The owner door

The owner starts the page with `fkit board`; agents may not. It carries a **one-time key**, and the
server checks the requesting site, host and content type on **every write** — T-022 closed from day
one. ⛔ It cannot stop an agent running as the owner on his machine from using the page, so
**owner-verified is a label, not proof** (R3). **Until the fkit pilot, no writable `aiboard serve` on
real project data — the read-only reader only** (Q16).

### D7 — Install and versions

- **Node becomes a hard requirement**; `install.sh` ships `board/` next to `claude/`.
- fkit and the board ship together, so **the version-pinning design is not needed** (it answered R4's
  "lock" when the board was a separate project).
- Each project records a **data-format number** in `ai-agents/board.json`, checked at launch:
  - **same** → proceed;
  - **older, or no `board.json`** (an unconverted markdown project) → fkit says so and offers the
    conversion, **trial run first** (R9); **declined → the session opens on the previous fkit**;
  - **newer than this fkit** → refused: run `fkit update`.
- The installer **keeps the previous fkit until every project is converted** (Q13).
- `fkit board` goes straight from the launcher to the module — no update check, no menu.

### D8 — The converter's contract

One shipped command turns a project's markdown boards into the store, for **every** fkit project (R4).
It reads old projects with fkit's **current** tools, so it copes with `sprint-N.md`,
`plan-sprint-N.md`, `sprint-backlog.md` and old `🔒 CLOSED` banners.

1. **Refuses to start** unless the git tree is clean, no ship loop is running, and the project is not
   already converted.
2. **Trial run first**, writing nothing in the project: builds the converted tree in a temporary folder
   and a report **the owner reads** — per task: folder, facts, sprint, order, priority, close record; per
   sprint: folder and body; totals; every refusal; every decision to confirm.
3. **Refuses anything ambiguous; never guesses** (e.g. `0014`: brief says Backlog, folder says done;
   `0004`: no board row; two live rows; two boards claiming one sprint; a status outside the vocabulary).
   Fixed in the old format first, then re-run.
4. **Changes no meaning:** brief text kept **byte-for-byte**, only `## ID`, `## Sprint`, `## Priority`,
   `## Status`, `## Owner` move into front matter; each board row's text goes word-for-word into the
   task's `legacy-board-notes.md` with source board, line and hash; each board's non-table text becomes
   the sprint's body; old board files go unchanged into `ai-agents/legacy-boards/`, read by no tool (Q2);
   free-text `worklog.md` → `worklog-legacy.md`, word for word (Q5); prose "Depends on" stays text (Q6);
   **past closes keep what they said** — a legacy `✅ Done` stays owner-verified and a legacy
   agent-closed stays agent-closed, both with door = `legacy`. **Q3's page-only rule applies from the
   switch onward; it does not rewrite history.**
5. **Default priority — ⏸ to confirm at the trial run (A3).** Proposed: every converted task gets
   `medium` (aiboard's own default), existing order carried into `rank`. The trial-run report lists it
   as a decision for the owner **before anything is applied**.
6. **Two steps, so git keeps history:** folder moves first (seen as renames), then content.
7. **Checks itself — the acceptance bar:** every brief byte-identical apart from the moved header
   sections; every other file hash-identical; every task's status, sprint, order, owner and close equal
   to what fkit's current tools read before; `fkit board check` clean; the `reference-integrity` test
   green; a write round-trip proving ids like `0013` survive.
8. **The owner commits.** Undo = revert that commit — **clean only until the first change made after the
   conversion**; after that, only fixing forward.
9. **Re-running** on a converted project does nothing and says so; a trial run on an unchanged tree gives
   the same report byte-for-byte.

Mid-sprint conversion is allowed; recommended between tasks, with no ship loop running.

### D9 — The phases. ⛔ Each starts only on the owner's word

A **gate** is what must be true before the next phase may be **put to him** — ⛔ **not** what starts it.

| # | Phase | Gate |
|---|---|---|
| **0** | This ADR; the producer files the phase briefs (each *not started — needs the owner's word*) and re-scopes or cancels `0407`, `0408`, `0135`, `0413`, `0405` | The owner approves — **done 2026-09-30 (A1)** |
| **1** | Fix **only T-023** in the Python aiboard, with a test round-tripping `0013` and `0404` — **`aiboard-lead`'s last task** (Q11); run fkit's real briefs through it, making Python a correct reference | Python round-trips the whole corpus unchanged |
| **2** | **Port to Node, into `board/`** — aiboard's **52** non-MCP behaviour tests first, then the code; T-021 (speed) and T-022 (website writes) built in with their original reproductions as tests; correct cross-process and cross-thread locking; faithful to aiboard's format | All ported tests green; output **identical to the Python reference** on the corpus; T-021/T-022 tests pass |
| **3** | **Make it fkit's board** — `0404` ids, fkit statuses + blocked reason, close record and store rules, priorities + rank, task-side sprint membership, `sprint-N` folders, `sprint close --carry-to`, the owner door, `board.json` format check, `fkit board`; drop R12's three | Tests green; a **copy** of fkit's corpus runs clean |
| **4** | **Converter — trial runs only**, on fkit, geoconflict, pubquiz and the rest; **no project changed** | The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed |
| **5** | **Wire fkit to the board** — close and brief skills, status, ship loops, review paths, identity hook, launcher (fast path, format check, keep previous version), `install.sh`, structure check, rules / conventions / scaffold / prompts, tests | Full suite green on fixtures; rules block within its size budget |
| **6** | **Pilot: convert fkit** — trial run, the owner reads it, apply, **he commits**; then real sprints on it (R2: *"test it on fkit"*) | The owner says it works |
| **7** | **Other projects, one at a time:** geoconflict → pubquiz → the rest (Q1) | The owner reads each trial run |
| **8** | **Archive aiboard** after the fkit pilot (Q12): read-only, not deleted; `v0.1.0` tag kept; README points to fkit; one distilled design doc in fkit's knowledge base; plain archive, no history import. Retire the read-only reader (`bin/fkit-board.mjs`, `bin/board-narrow.mjs` and their tests) | Phase 6 passed |
| **9** | **After v1:** MCP server under the same store rules with a hook-checked per-call author (Q8); T-020 (Q9); T-007 | Phase 6 passed |

✅ **Test count corrected — owner ruling 2026-09-30** (**[SELECTED]** *"52 now, 10 with MCP — Matches your 'MCP after v1' ruling; the architect corrects ADR-052's '62 tests' wording."*). aiboard has **62** tests =
46 board + 6 server + 10 MCP (the producer's count). **Phase 2 ports the 52 non-MCP tests; the 10 MCP
tests go with the MCP port in phase 9** (task `0468`). This ADR first said phase 2 ports 62.

**Order:** 0 → 1 → 2 → 3 → (4 alongside 3 and 5) → 5 → 6 → then 7, 8, 9. The three big changes — port
(2), fkit-ify (3), convert (6–7) — **stay apart, each gated**. The previous fkit is removed when the last
project is converted (Q13). Sizes and overlaps: decision document *§7*.

### D10 — ADR-051's kept conditions, mapped to the phases (R2)

| ADR-051 condition | Now |
|---|---|
| **P1** — the Node port | Phase 2, with the **52** non-MCP tests ported first (ADR-051 said 41; aiboard's count grew — see the note under D9) |
| **P2** — T-023 with a `0013`/`0404` round-trip test | Phase 1 |
| **P3, P4** — T-021, T-022 | Phase 2 |
| **P5** — durability: *"the tree is committed at the end of every working session"*, the owner personally | ⭐ **Still stands**, with its recorded weakness (ADR-051 *§Amendment 4*). The board has no undo; git is the safety net |
| **P6** — one-sided sprint membership | Phase 3; D2 |
| **A1, A2** — byte-level import-and-diff; write round-trip | The converter's acceptance bar (D8 item 7) |
| **D5** — a trial run with a byte-hash diff the owner reads before any migration | Phases 4, 6, 7 (D8 item 2) |
| **D4** — only the owner declares | Carried into *each phase on his word* |

✅ **Architect's reading — confirmed by the owner 2026-09-30** (**[SELECTED]** *"Confirm all four — They
follow directly from dropping the trial and from the merge; the ADR's flags get marked as confirmed by
you."*): P1's clause *"the store-adapter seam present"* lapses with the merge — there is no second store
to adapt to. Flagged so a reader does not treat it as a missing gate.

### D11 — Existing tasks (the producer's acts, authorised by A1)

| Task | Disposition |
|---|---|
| `0408` deterministic mover command | Obsolete — `fkit board` is that command |
| `0407` mover outcome verifier | Re-scope into the converter's checker, or cancel |
| `0135` repair mode for half-finished closes | Obsolete — a close cannot half-land with one place for status |
| `0413` reader snapshot cache | Obsolete — the reader retires |
| `0405` terminal view | Re-scope over `fkit board --json` (aiboard's terminal kanban is ported in v1), or cancel |
| `0416` hand-move tripwire (R8) | Stays in the backlog, low priority |

Closes and cancels go through the normal close skills, with the agent-closed marker.

---

## Effect on existing ADRs

**"On acceptance"** = from 2026-09-30. **"At conversion"** = in a project only once it is converted;
before that the old rule stays in force there — **fkit included, until phase 6**.

| ADR | Change | Effective |
|---|---|---|
| **051** | **D1 reaffirmed.** **Superseded:** the trial, F1–F5, the work floor and the no-timeout guard (Amendments 1, 3, 5, 6, 8, 9, 10; *§The gate* **Trial** and fail conditions); **D7** (aiboard a separate project whose work fkit never files) and every separate-project assumption. **Kept as phase gates:** P1–P6, A1–A2, D5 (D10). **D4** carries into "each phase on his word". **P5** and its Amendments 2 and 4 stand. The evidence log is **closed, not deleted** | On acceptance |
| **051** | **D2** — the read-only reader as interim — ends per project; the reader retires at phase 8 | At conversion |
| **051** | ✅ **Architect's reading — confirmed by the owner 2026-09-30** (**[SELECTED]** *"Confirm all four — They follow directly from dropping the trial and from the merge; the ADR's flags get marked as confirmed by you."*): **D6** (the "on a fail" branch) lapses with the trial it belonged to; **D8**'s open write question is answered by the merge — the board writes, behind ADR-049 D4; **Amendment 7** (the board's copy of the gate is a summary) is moot with the gate | On acceptance |
| **049** | **C4** (aiboard usable without fkit) dropped. **D7** (fkit does not specify aiboard's mechanism) superseded — fkit owns it. **D8** discharged — `fkit board` is the command. **D4** (T-022 closed before any write mode) still binds, and is **satisfied by building the fix into phase 2**. **D2** (the commit is the human checkpoint) **unchanged** | On acceptance |
| **049** | **D1 / D3 amended:** the store sets owner-verified **only** for writes through the owner's page — **a label, not proof**; every other close is agent-closed, recorded as a field set by the board, not text an agent writes. **D5** (board served read-only) holds until the pilot (Q16) and ends per project | At conversion |
| **033** | Decisions 1–4 kept — producer-only closes, now enforced by the store (D5 layer 1), the identity hook and the skill lock. **§5 superseded:** a producer close with the owner present is **no longer** owner-verified (Q3). *§The limit* inherited unchanged | At conversion (§5); on acceptance otherwise |
| **050** | The deterministic command is **`fkit board`**, so the build ADR-050 authorised is discharged by the board; `0407` / `0408` per D11. **D2 / B-1** (the skill is the sanctioned entry) unchanged. The **B-2 rejection** (matching shell text) is overtaken **only** for the `--by` identity check (D5 layer 2). B-3 stays unavailable (one OS user) | On acceptance |
| **029** | A task is still a folder with a permanent four-digit id; **`0404` unchanged**; `in-progress/` becomes a fourth status folder; the board allocates ids by the same `1 + max` rule; `## ID` (§5) moves into front matter; the cross-branch race is unchanged and still accepted | At conversion |
| **040 / 041 / 047** | The line-3 banner grammar retires; a sprint's status is its folder; several active sprints stay legal; the backlog is not a sprint. ⭐ **Still in force in unconverted projects, and still how the converter reads them** | At conversion |
| **048** | **Obsolete** with `0135` — the reconcile mode was never built and is not to be built. ⚠️ Until a project is converted, its closes are still prose and can still half-land; nothing is built for that window | On acceptance |
| **014** | Test scope grows to the board's behaviour tests (52 in phase 2, the 10 MCP tests in phase 9) and converter fixtures. **Zero dependencies kept** | From phase 2 |

This ADR does not edit any of those bodies. Dated ⛔ pointer notices were **inserted** (nothing
deleted) into ADR-051, ADR-049, ADR-033, ADR-050 and ADR-048 — the five with a decision overturned.
ADR-029, 040, 041, 047 and 014 are amended per project or extended, not overturned, and carry no notice.

---

## Options considered

- **Full merge — aiboard becomes fkit's built-in board (CHOSEN, R7).** One repo, one release, one test
  suite, no version pinning, no cross-project coordination; fkit's rules written into the store instead
  of bolted on. The owner's selected text: *"Simplest overall."*
- **ADR-051 as written — aiboard a separate project, gated destination, trial first.** Superseded: the
  owner decided without the trial (R2), and a separate project means a second release to lock against
  (R4's "lock") and rules enforced from outside the store.
- **aiboard stays separate; fkit depends on a pinned version** (the version-lock design report).
  Rejected by R7 — it carries every cost above for an outside audience that is **probably none** (never
  on PyPI, 0 stars, 0 forks — `aiboard-lead`'s figures, not proof).
- **Reject — keep fkit's markdown tree as the store, read by the read-only reader.** The owner did not
  take it; it leaves the 1,814-line prose closes and the status-in-several-places drift in place.

---

## Consequences

**Positive**
- **One store; duplication impossible by construction** — the owner's principle of 2026-09-18.
- **The rules live where the write happens** — page, command, scripts and later MCP obey the same code.
- **Owner-verified means one clear thing:** he did it in the page.
- Every status change and log entry is timed and signed.
- Gone: status disagreeing between brief, board and folder; half-finished closes; 1,814 lines of close
  procedure run step by step by an AI. Skills get **thinner**.
- **Nothing of aiboard is thrown away** (R11).

**Negative / costs**
- **aiboard as a tool of its own is given up** (ADR-049 C4). The archive stays public.
- With fkit's rules hard-coded, **spinning the board back out later is a rewrite.**
- **fkit becomes a small web application** — a local server writing to the repo as the owner. Keeping
  the website-write class (T-022) closed is fkit's job for good.
- **Node becomes a hard requirement.**
- **More code to own** than a minimal port — R11 brings every feature, and phase 9 adds more. Board work
  will compete with agent work for attention.
- **The previous fkit must be kept on the machine** until every project is converted (Q13).
- **The owner-present producer close loses owner-verified status** (Q3, against the architect's
  recommendation). After conversion, owner-verified needs the owner to act in the page.

**Risks, highest first** (mitigations in the decision document *§8.4*)

1. **The converter damages or drops data** (the `331f298` precedent) → trial run he reads, refuse on
   ambiguity, byte-level diff, one revertible commit.
2. **Three big changes at once** → separate phases, separate gates.
3. **The Node port behaves differently** (front-matter parsing, emoji length, locking) → Python with
   T-023 fixed as the reference; corpus diff at phase 2's gate.
4. **"Owner-verified" can be faked** by an agent using the page → accepted as a label (R3); the door is
   recorded on every close; the commit stays the checkpoint.
5. **Hand folder moves bypass the rules** → detection (D5 layer 4); tripwire revisited later (`0416`).
6. **Two writers at once** — aiboard's server today does not keep simultaneous web writes in order →
   correct cross-process and cross-thread locking, with tests, in phase 2.
7. **T-022 is live meanwhile** in any writable `aiboard serve` → read-only reader only until the pilot
   (Q16).
8. **The module boundary erodes** → one narrow interface: `fkit board …` and its JSON.
9. **Churn** across ~30 fkit files; the rules block has a size cap → phase 5, with the budget test.
10. **A second door later (MCP)** → same core, same rules, per-call author hook-checked.
11. **Fidelity changes** (move history leaves the live view; closed-sprint order becomes a field; a lone
    brief no longer shows its status inside it) → legacy notes and frozen boards keep every word.
12. **Still no undo**, not a transaction across files → git (P5); `sprint close` does the multi-task step
    in one call under one lock.

---

## Re-raise only if

- **The Node port cannot match the Python reference on the corpus** (phase 2's gate cannot be met).
- **The converter cannot reach a clean byte-level diff on fkit's own tree** (D8 item 7).
- **After the pilot, the owner finds the board worse to work with than the markdown.**
- **A project needs epics** (Q14) — that is a new feature to design, not a re-raise of this ADR.
- **The owner asks** — about anything here.

⛔ **Do NOT re-raise** — each was put to him and ruled:
- **The trial** (R2). ⛔ And no agent may re-introduce one, or a timeout, check-in or review point, in
  its place: the gates in D9 are the gates.
- **Owner-verified for a producer close with the owner present, or from his own terminal** (Q3, Q15) —
  ruled against the architect's recommendation, knowingly.
- **The four priority levels** (Q7) — ruled against the architect's recommendation.
- **Keeping `0404`** (R5); **one project at a time** (R5); **CLI for everything** (R6).
- **The three drops** (R12) as lost features; **MCP / T-020 / T-007 after v1** (Q8, Q9).
- **Storing the sprint's task list** in `sprint.md` (A2).
- **Building the hand-move tripwire now** (R8) — `0416` is its vehicle.
- **aiboard as a separate project** (R7).

---

## What approval authorises, and what it does not

**Authorised (A1):**
1. This ADR.
2. The producer files briefs for phases 1–9, each marked **not started — needs the owner's word**.
3. The producer re-scopes or cancels `0407`, `0408`, `0135`, `0413`, `0405` per D11, through the normal
   close skills, with the agent-closed marker.
4. `0416` stays in the backlog, low priority.

⛔ **Not authorised:** starting any phase; writing any code; touching the aiboard repo; converting any
project; archiving or deleting anything; confirming the default priority (A3). **Each phase starts only
when he says so.**

---

## Related

- [`reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md`](../reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md)
  — the approved decision document; design detail, feature-by-feature port check (§4), file-by-file
  change list (§5), phase sizes (§7), risks (§8).
- The four superseded 2026-09-30 reports, kept as evidence — listed in *§Context*.
- [ADR-051](adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)
  — partly superseded; D1 reaffirmed.
- [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md),
  [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md),
  [ADR-050](adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed.md),
  [ADR-048](adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md),
  [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md),
  [ADR-040](adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md),
  [ADR-041](adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md),
  [ADR-047](adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md),
  [ADR-014](adr-014-how-fkit-tests-itself.md) — amended as in *§Effect on existing ADRs*.
- [`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md) and
  [`conventions/priority-is-rank-not-identity.md`](../conventions/priority-is-rank-not-identity.md) —
  the second is among the conventions phase 5 rewords (priority levels now sit alongside rank).
- **Wiki:** `fkit-wiki` should ingest this ADR, with the decision document as its evidence, and resync
  vault pages describing ADR-051's gate or aiboard as a separate project. ⛔ The architect never writes
  the vault (ADR-005).
