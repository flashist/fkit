# Decision document: merge aiboard into fkit as fkit's built-in board

> ## ✅ APPROVED 2026-09-30 — recorded as [ADR-052](../decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) — dated note; nothing below it was changed
>
> The owner selected: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase
> or code starts without your word."* On §9 item 2 he selected: *"Yes, show but don't store — Follows your
> no-duplication principle; you still see the list everywhere."* §9 item 1 (default priority `medium`) stays
> a proposal he confirms at the converter's trial run. The **Status** line below reads as it did when he
> decided; ADR-052 is the decision of record.

> ## ✏️ CORRECTED 2026-09-30 — the one exception to the note above
>
> The owner selected *"52 now, 10 with MCP — Matches your 'MCP after v1' ruling; the architect corrects ADR-052's '62 tests' wording."* aiboard's 62 tests = 46 board + 6 server + 10 MCP;
> phase 2 ports the 52 non-MCP tests and the 10 MCP tests go with the MCP port in phase 9 (task `0468`).
> Three "62 tests" mentions below (§3.1 tree, §5 Tests row, §7 phase 2) were corrected to match. Nothing
> else below was changed.

- **Date:** 2026-09-30
- **Author:** `fkit-architect`, spawned by `fkit-lead` (consult, hop 1). No owner channel in this spawn
  (ADR-021). The owner's rulings reached it relayed by `fkit-lead`.
- **Kind:** decision document — **the owner approves or rejects the whole initiative from this page.**
  Design only: no code, no brief, no ADR, no wiki edit.
- **Status:** ⏸ **FINAL TEXT — AWAITING THE OWNER'S DECISION** (§10). Every question put to him is ruled
  (§1). Two small points are flagged for confirmation, not left open (§9).
- **Supersedes** (each carries a dated pointer here; none is deleted; they hold the detailed evidence):
  - [`2026-09-30-eval-aiboard-as-fkits-single-task-store.md`](2026-09-30-eval-aiboard-as-fkits-single-task-store.md) — its file-by-file inventory (§3) and requirements list (§4) still serve as detail.
  - [`2026-09-30-eval-task-ids-keep-0404-or-rekey.md`](2026-09-30-eval-task-ids-keep-0404-or-rekey.md) — settled: **keep `0404`**.
  - [`2026-09-30-design-cli-door-enforcement-addendum.md`](2026-09-30-design-cli-door-enforcement-addendum.md) — its bypass table still applies; its hook is simplified here (§3.5).
  - [`2026-09-30-design-fkit-aiboard-version-lock.md`](2026-09-30-design-fkit-aiboard-version-lock.md) — mostly dissolved by the merge (§3.7).

**Tags:** **[O]** the owner's ruling — his **own words** are marked as such; everything else is **option
text he selected** · **[AL]** `aiboard-lead`'s input, 2026-09-30 · **[M]** measured in fkit's repo by this
architect.

---

## ⭐ Decision in one breath

> aiboard stops being a separate project: it is rewritten in Node and merged into fkit as fkit's built-in
> board — a separate module (`board/`) with one command, `fkit board`, and a web page — and becomes the
> single and only store for every fkit project's tasks and sprints, kept as plain markdown files in each
> project's git repo, with task numbers like `0404` unchanged. Every aiboard feature is ported except three
> made redundant by fkit itself (pip packaging, board discovery and its pointer file, agents-md
> instruction blocks). fkit's rules live inside the board: only the producer may close, cancel or reopen
> through the command; only the owner, acting himself in the web page, produces an owner-verified close;
> every close carries a record of who, how and why. Agents use the command line; an MCP door follows after
> the first release under the same rules. Each project is converted by a shipped converter — trial run
> first, which the owner reads — at launch, one project at a time, starting with fkit itself; until
> converted it stays on the previous fkit. The work runs in gated phases, T-023 fixed in Python first as the
> reference, and none starts without the owner's word; the aiboard repository is archived read-only after
> the fkit pilot.

> ### ⛔ The standing rule
> The owner's own words (2026-09-27): *"if we already have a brief for that task, the task shouldn't
> start, until I specifically approve it (because it might change the way fkit work in general)."*
> **Approving this document starts no work.** See §10.

---

## 1. Rulings — everything the owner has decided (2026-09-30)

All via `AskUserQuestion` in `fkit lead` sessions, relayed by `fkit-lead`.

### 1.1 The direction

| # | Ruling [O] | Where it lands |
|---|---|---|
| R1 | **Own words:** *"we do need to integrate AI board into F-Kit as a dependency [...] Probably it would be better if it's just a deterministic software with API that both agents and humans can call."* | The board is a program, not an agent; one set of rules for agents and humans (§3) |
| R2 | **Own words:** *"we should do the rewrite, the 4-weeks trial is not needed anymore (I was able to make the decision faster). Though we can test it on fkit if needed."* Selected: *"Keep all the others — Only the trial goes. The converter trial run you read, the bug fixes, the Node rewrite and the other conditions stay."* | ADR-051's trial and fail conditions dropped; every other condition is a phase gate (§7) |
| R3 | Selected: *"Yes, and count them as mine"* — accepted as **"came through the owner's door", not proof** | §3.5 |
| R4 | Selected: *"Every fkit project"*. Old projects, **own words:** *"#1, and also we need to make sure we can "lock" fkit on a specific version of aiboard [...]"* | Shipped converter; with the merge the "lock" becomes a per-project data-format check (§3.7) |
| R5 | Selected: *"Keep 0404"*; cross-project: *"No, one project at a time"* | Four-digit, letter-free ids (§3.2) |
| R6 | Selected: *"CLI for everything"* | Agents use `fkit board`; rules move into the store (§3.5) |
| R7 | **Own words:** *"I am thinking about dropping the idea of developing aiboard as a seaprate project and to merge it into fkit completely, would it make it easier/simpler/better?"* Then selected: *"No, fkit only → full merge — aiboard becomes fkit's built-in board; its repo is archived (history can be carried over). Simplest overall."* | This document |
| R8 | **Own words:** *"Don't implement it, add a task to the backlog with low priority, that will require to think about this feature again after some time (e.g. after a month of using a new version of fkit), after we understand if such situations ever happen"* | The hand-move tripwire is not built; filed as backlog task `0416`. Detection stays (§3.5) |
| R9 | Selected: *"No, ask at launch — Launching an older-format project tells you and offers the conversion (trial run first); until then it stays on the previous fkit."* | §3.7 |
| R10 | Standing rule: nothing starts without his specific approval | §10 |

### 1.2 The general porting rule

| # | Ruling [O] |
|---|---|
| **R11** | **Own words:** *"Generally speaking, if some features exist in ai board, but not used in fkit yet, it doesn't mean that we should drop the feature, we should port the ai board features into fkit."* |
| **R12** | Exceptions, selected: *"Drop as redundant — They're replaced by fkit's own install, its known board location, and its own agent instructions — not features lost."* — i.e. **pip/pipx packaging**, **board discovery and the `aiboard.json` pointer**, and **agents-md instruction blocks**. |

Everything else in aiboard is ported. §4 checks the design against this rule, feature by feature.

### 1.3 The detailed questions

| Q | Question | Ruling [O] | Against the architect's recommendation? |
|---|---|---|---|
| Q1 | Pilot order | *"fkit → geoconflict → pubquiz → rest"* | — |
| Q2 | Old markdown sprint boards | *"Frozen archive + notes — Kept word-for-word in ai-agents/legacy-boards/, read by no tool; each task also gets its old row text."* | — |
| Q3 | Does a producer close with the owner present count as owner-verified? | *"No, only the web page — Owner-verified means you did it yourself in the page; everything else is agent-closed."* | ⚠️ **Yes** — the architect recommended keeping that route |
| Q4 | May the page close a sprint with open tasks? | *"Only by choosing where they go"* | — |
| Q5 | Rename the coders' old free-text worklogs to `worklog-legacy.md`, word for word | *"Yes"* | — |
| Q6 | Turn prose "Depends on" lines into structured links during conversion | *"No, keep them as text"* | — |
| Q7 | Priorities | *"Keep all four levels — low / medium / high / critical as aiboard has them, alongside ordering."* | ⚠️ **Yes** — the architect recommended only `critical` |
| Q8 | Port the MCP server | First *"Not in v1"*; then, after R11: *"Keep Q8: later — Port it, but after v1 — your rule still applies, just not in the first release."* | — |
| Q9 | Task comments next to the review ledgers | *"Keep both, separate jobs"* (T-020 comment resolution: ported, after v1 — see §4) | — |
| Q10 | Names | *"board/ + `fkit board`"* | — |
| Q11 | Who fixes T-023 in Python | *"aiboard-lead, its last task"* | — |
| Q12 | When aiboard is archived | *"After the fkit pilot"* | — |
| Q13 | How long the previous fkit is kept for unconverted projects | *"Until every project is converted"* | — |
| Q14 | Epics | **Own words:** *"Is it something that already exists in ai board? [...] if some features exist in ai board, but not used in fkit yet, it doesn't mean that we should drop the feature, we should port the ai board features into fkit."* The lead answered that aiboard has **no** epics (confirmed by aiboard-lead), so epics would be **new**, not a port. **Recorded: no epics for now; built only if a project needs them.** | — |
| Q15 | Is a close from the owner's own terminal owner-verified? | *"No, only the page"* | — |
| Q16 | Until the pilot, no writable `aiboard serve` on real data | *"Yes, read-only reader only"* | — |

---

## 2. What you are deciding, and what life looks like afterwards

### 2.1 The decision

**aiboard stops being a separate project. Its code is rewritten in Node and moved into fkit as fkit's own
built-in task board. From then on, fkit's tasks and sprints live in that board and nowhere else.** The
aiboard repository is archived read-only after the fkit pilot, with its history kept (R7, Q12).

Four words, glossed once:
- **the board** — the new module inside fkit: the task store, its command, its web page.
- **the store** — the task and sprint files the board reads and writes. They stay **plain markdown files
  in the project's git repo**, under `ai-agents/`.
- **a close** — marking a task or sprint Done or Cancelled.
- **the owner door** — the web page you open yourself. **Only what you do there counts as
  owner-verified** (R3, Q3, Q15).

### 2.2 Day to day, after the switch

**You (the owner)**
- Run `fkit board` in a project. A web page opens: Backlog / In progress / Done / Cancelled, sprints, a
  detail drawer per task, drag to change status or order, comments, priorities, "needs reply" and stale
  markers, and each task's timed history.
- **A close you make in the page is the only kind recorded as owner-verified.** Everything else — a
  producer close, even with you in the session, or a command you type in your own terminal — is recorded
  as agent-closed (Q3, Q15).
- Closing a sprint in the page asks where its still-open tasks go (Q4).
- You can still read and search the files directly — they are markdown in git.
- Opening a project that has not been converted: fkit tells you and offers the conversion, **trial run
  first**; until you convert it, it runs on the previous fkit (R9).

**The producer**
- Writes a brief as today, then files it with one command; the board gives it the next number.
- Closes and cancels through its existing skills, which decide whether a close is warranted and why, then
  make **one** board call. Every close it makes is recorded as agent-closed (Q3). No more hand-editing
  board tables, status lines and links in six places.

**The coder, reviewer, lead and wiki**
- Read tasks as before (files, or `fkit board … --json`).
- Start, block, log work and comment through the board — every entry gets a time and a name.
- **Cannot close anything** — the board refuses.
- `plan.md`, `review.md` and the rest stay ordinary files in the task's folder.

### 2.3 What does not change
- Seven roles, same responsibilities (R1). No new agent.
- **`0404` stays `0404`**; the folder keeps its name; every existing link keeps working (R5).
- Commits only when you say so; the git commit stays the one real human checkpoint (ADR-049 D2).
- One project at a time; no cross-project board (R5).

---

## 3. The architecture of the merged board

### 3.1 The shape

```
fkit repo                                    installed on the machine (~/.local/share/fkit)
├── claude/      agents, skills, hooks,      ├── claude/   (as today)
│                launcher, scaffold          └── board/    ← NEW: shipped next to claude/
├── board/       ← NEW MODULE (Q10)
│   ├── core       the store: read/write task & sprint files, ids, rules, index
│   ├── cli        `fkit board …` — the command for agents, scripts and you
│   ├── server     the web server behind the page (the owner door)
│   ├── web        the page (aiboard's page needs no changes to move [AL])
│   └── mcp        (after v1 — phase 9)
├── test/board/  ← NEW: aiboard's 52 non-MCP behaviour tests ported to node:test (the 10 MCP tests come in phase 9), + fixture corpus
└── bin/         fkit-board.mjs, board-narrow.mjs → RETIRED after the pilot

a project repo
└── ai-agents/
    ├── board.json                     ← NEW: data-format number + board settings (name, stale-after hours)
    ├── tasks/backlog|in-progress|done|cancelled/0404-slug/
    │      brief.md     front matter (the facts) + the brief's text
    │      worklog.md   board-owned; every entry timed and signed; status changes logged automatically
    │      comments.md  you ↔ agents discussion (Q9)
    │      plan.md, review.md, legacy-board-notes.md, worklog-legacy.md, assets/ …  ordinary files
    ├── sprints/backlog|in-progress|done|cancelled/sprint-11/sprint.md   goal, dates, prose
    ├── legacy-boards/                 ← the old markdown boards, frozen, read by no tool (Q2)
    └── knowledge-base/, wiki-vault/   unchanged
```

- **Boundary [AL]:** a separate module with its own tests and a **narrow interface** — the rest of fkit
  talks to it only through `fkit board …` and its `--json` output.
- **Zero dependencies**, like the rest of fkit (ADR-014).
- **`install.sh` ships only `claude/` today** (`install.sh:42-45` [M]); it must also ship `board/` and
  require `node`. Node becomes a **hard** requirement (today one hook uses it, fail-open:
  `claude/carry-check-hook.sh:26-31` [M]).

### 3.2 The store

| | Decision | Why |
|---|---|---|
| Task = folder; **status = which folder it is in** | Ported (aiboard T-008 [AL]; ADR-029) | One place for status |
| Ids | **Four digits, no letter: `0404`** (R5). Next id = highest ever + 1, cancelled included. aiboard's forgiving lookups (`404`, `0404`, `0404-slug`) ported | Every link keeps working |
| Statuses | Backlog · In progress · Done · Cancelled (folders) + **Blocked**: `blocked_by` (other tasks, enforced at start, cycles reported) **and** a free-text `blocked_reason` | fkit's `🚧 Blocked — <reason>` needs the reason |
| `➡️ Moved` | Gone — a sprint is a field on the task | 113 of 539 board rows today [M] |
| **Priority** | **All four levels: low / medium / high / critical**, plus the `urgent` → critical alias; critical goes to the top (Q7, R11) | Ruled |
| **Order** | `rank`, alongside priority; drag to reorder | fkit's P-order; your 2026-09-29 ask [AL] |
| **Close record** | Every close stores **who** (`--by`), **which door** (command / page / converter / later MCP — **set by the board from the door, never by the caller**), **kind**, **when** and the **reason** (required for Cancelled). **Kind = owner-verified if and only if the door is the page**; every other close is agent-closed (Q3, Q15) | Replaces the `(agent-closed — not owner-verified)` text with a field that cannot be claimed |
| Sprint membership | **One side only: the task's `sprint` field** (ADR-051 P6, kept by R2). `sprint.md` holds goal, dates and prose; the task list is shown by the page and `fkit board sprint show` (§9 item 2) | No stored-twice membership |
| Sprint folders | `sprint-11` (fkit's "Sprint 11" identity) instead of aiboard's `S-011` | ADR-040/041 |
| Backlog | Tasks with no sprint — not a sprint | |
| Assignee | Ported; fkit's `## Owner` role becomes the assignee; atomic `start` claim ported | |
| Worklog, comments, "needs reply", stale detection, labels, `check` (and `check --fix`), re-render hold, auto-refresh | **All ported** (R11) | |
| Speed | An index built once per read (T-021 designed in; 6.8× measured [AL]) | 415 tasks today [M] |
| Settings | Board name and stale-after hours move from `aiboard.json` into `ai-agents/board.json` | The pointer part of `aiboard.json` is dropped as redundant (R12) |

### 3.3 The command — `fkit board …` (Q10)

- Handed straight from the launcher to the module — no update check, no menu — so it answers instantly.
- **Every write takes `--by <who>`** and the board records an author on **every** write — including
  sprint, rank and edit operations, which record none in aiboard today [AL].
- `--json` on every read; a terminal kanban view (aiboard's `board` command) ported.
- ⭐ **`sprint close --carry-to <sprint|backlog>` does the whole sprint close in one call**, including
  moving still-open tasks — today a 456-line prose procedure (`claude/skills/fkit-sprint-done/SKILL.md`
  [M]). The page's sprint close asks for the same destination (Q4).

### 3.4 MCP — ported after v1

aiboard's MCP server (a second way for AI tools to call the board, 20 tools [AL]) is **ported, but after
the first release** (Q8, phase 9). It calls the **same core**, so it obeys the **same rules** — it can never
close what the command cannot. Its author is given **per call** and checked by a hook against the calling
agent's real role (the hook sees MCP calls as structured input, so this check is exact). Until then, agents
use the command line only (R6).

### 3.5 Where the rules are enforced

Because the store is now fkit's own, **the rules live inside it, once, for every door**:

| Layer | What it does | Strength |
|---|---|---|
| **1. The store's rules** | Refuses: a close, cancel or reopen through the command unless `--by` is the producer · a close with no record · a cancel with no reason · a sprint close that strands open tasks · starting a blocked task · any write to data in a format it was not built for (§3.7). Sets **owner-verified only for page writes** | One implementation; cannot be spelled around — it is where the write happens |
| **2. The identity check** | A `PreToolUse` hook on the terminal tool: for `fkit board` writes, `--by` must equal the calling agent's real role (visible at any spawn depth — ADR-018 §4); a `fkit board` command in a form it cannot read (`sh -c`, `eval`, variables) is refused; `fkit board serve` is refused for agents. (After v1, the same check for MCP calls.) | Checks only "is the name honest?" |
| **3. The skill lock** | The close skills stay producer-only (ADR-018/033) — unchanged | As today |
| **4. Detection** (kept, R8) | `fkit board check` flags a task in `done/` or `cancelled/` with **no close record**, or a record that does not fit its door; `fkit-status` shows it | Catches what prevention misses |
| **5. Tripwire for hand folder moves** | **Not built** (R8) — backlog task `0416`, low priority, to revisit after about a month of use | — |

**The owner door, honestly.** You start the page with `fkit board` (agents may not start it). It carries a
one-time key, and the server checks the requesting site, host and content type on every write — closing
aiboard's T-022 hole (another website you visit writing to your board) from day one [AL]. It **cannot**
stop an agent on your own computer, running as you, from using that page. So "owner-verified" means
**"done through your page"** — a label, not proof (R3). Git commit stays the real checkpoint.

**What is still open, in plain words.** An agent that follows the rules cannot close, cannot sign as
someone else, and cannot produce an owner-verified close. An agent trying to get around them can — most
simply by moving a task folder by hand — and is caught afterwards by layer 4. That is fkit's standing
promise (ADR-033 §"The limit": who does what, never prevention), now enforced where the write happens.

### 3.6 Comments and reviews (Q9)

- `comments.md` is the discussion between you and the agents on a task; "needs reply" marks threads
  waiting on someone.
- `review.md` stays the reviewer–coder ledger, written by the review skills, unchanged.
- aiboard's **T-020** (when a comment thread counts as answered) is **ported after v1** (phase 9).

### 3.7 Versions — after the merge

- fkit and the board ship together; there is no second version to mix up. **The version-pinning design is
  not needed.**
- What remains is the **data**: each project records a format number in `ai-agents/board.json`.
  - **Same format** → proceed.
  - **Older** (including "no `board.json`" = an unconverted markdown project) → fkit tells you and offers
    the conversion, trial run first (R9). Declined → the session opens on **the previous fkit**, which the
    installer keeps **until every project is converted** (Q13).
  - **Newer than this fkit** → refused: "run `fkit update`".
  - The board itself also refuses to write data in a format it was not built for.
- Today there is one fkit per machine and `fkit update` replaces it (`claude/fkit-claude.sh:100-125`
  [M]), so keeping the previous version and choosing it per project is real work (phase 5).

---

## 4. aiboard's features, checked against the porting rule (R11, R12)

Every feature that existed in aiboard at HEAD `0108027`, and what happens to it. **Nothing is dropped
except R12's three.**

| aiboard feature | Fate | When |
|---|---|---|
| Tasks as folders, status as folder, brief/worklog, auto-logged history | Ported | v1 |
| Ids `T-001` and forgiving lookups | **Form change** to `0404` (R5); forgiving lookups ported | v1 |
| Sprints as folders with goal, dates, prose body | Ported; folder name `sprint-11` instead of `S-011` (**form change**) | v1 |
| Sprint `tasks:` list + generated `## Tasks` checklist + `sprint refresh` | **Form change** — membership kept on the task only (P6, kept by R2); the list is shown, not stored (§9 item 2) | v1 |
| Priorities low/medium/high/critical, `urgent` alias, critical-to-top | Ported (Q7) | v1 |
| Rank and drag-to-reorder | Ported | v1 |
| `blocked_by`, block/unblock, cycle check, refuse-start-when-blocked | Ported (+ fkit's `blocked_reason`) | v1 |
| Assignee, atomic `start`, `assign` with force | Ported | v1 |
| Labels | Ported | v1 |
| Worklog, comments, "needs reply" | Ported (Q9) | v1 |
| Stale detection (`stale_after_hours`) | Ported (setting moves to `board.json`) | v1 |
| `check` and `check --fix` | Ported (+ fkit's close-record checks) | v1 |
| `info`, `--json`, terminal kanban `board` view, list filters | Ported | v1 |
| Web page: drag, drawer edits, new task/sprint, auto-refresh, re-render hold | Ported | v1 |
| Web page's free-text "you:" name box | **Form change** — page writes are always stamped as the owner door; the box becomes your display name | v1 |
| `serve` and `serve --read-only` | Ported as `fkit board serve [--read-only]`; owner-door protections added | v1 |
| `init` | **Form change** — done by fkit's own project setup and the converter | v1 |
| MCP server (20 tools) | Ported **after v1** (Q8) | phase 9 |
| T-020 comment resolution (planned in aiboard, not built) | Ported **after v1** (Q9) | phase 9 |
| T-007 live reload (planned in aiboard, not built) | Ported **after v1** — replaces the 3-second polling | phase 9 |
| pip/pipx packaging | **Dropped as redundant** (R12) — fkit's installer | — |
| Board discovery + `aiboard.json` pointer | **Dropped as redundant** (R12) — fkit knows its board is `ai-agents/` | — |
| `agents-md` instruction blocks | **Dropped as redundant** (R12) — fkit's own agent instructions | — |

**Previously dropped or deferred in earlier drafts of this document, and now reversed by R11:** the three
priority levels below critical (were "keep only critical"); the MCP server (was "not in v1", now phase 9);
T-020 (was "deferred", now phase 9); T-007 (was "optional", now phase 9). The "generic seams" earlier drafts
dropped (configurable id pattern, pre-transition veto hook, generic close field) **never existed in
aiboard** — they were proposed integration hooks — so R11 does not apply to them.

---

## 5. What changes inside fkit

The detailed file-by-file table is in the superseded inventory report, §3. The merge makes skills
**thinner** than that report assumed (the rules are in the store) and removes the version pinning.

| Area | Files [M] | Change | Size |
|---|---|---|---|
| **New module** | `board/`, `test/board/` | The port and fkit's store rules | **L + L** (phases 2–3) |
| **Four close skills** | `fkit-task-done` (460 lines), `fkit-task-cancelled` (422), `fkit-sprint-done` (456), `fkit-sprint-cancelled` (476) | Judgement (warranted? which reason? where do open tasks go?) + one `fkit board` call. **No more "is the owner present?" marker choice** — every command close is agent-closed (Q3) | M |
| **Briefing** | `fkit-task-brief` (456) | Files through `fkit board task new`; the board allocates the number | M |
| **Status** | `fkit-status` (537) + `dashboard.sh` (1,773 lines of bash) + `throughput.mjs` | Rewritten over `fkit board … --json`; most drift checks disappear; line-3 banner grammar retires | **L** |
| **Ship loops** | `fkit-task-ship-loop` (321), `fkit-sprint-ship-loop` (410) | Start/block/log through the board; closes still routed to the producer | M |
| **Reviews** | review skills and reviewer prompt; `ai-agents/sprints/reviews/` (2 files) | Task ledgers unchanged; sprint ledgers move out of `sprints/` | S |
| **Hooks & launcher** | `claude/fkit-claude.sh` (`build_settings()` `:295-331`; update `:100-125`), new identity hook | `fkit board` fast path; format check at launch; keep the previous version; identity hook | M |
| **Install & scaffold** | `install.sh`, `claude/fkit-claude-init.sh`, `claude/scaffold/` | Ship `board/`; require Node; new projects get `board.json` and the status folders | S–M |
| **Structure check** | `claude/structure-spec.md`, `structure-manifest.tsv`, `fkit-heal` | New folders; heal never "repairs" board-owned files | S |
| **Rules & conventions** | `claude/scaffold/universal-rules.md` (size-capped, `RULES_MAX=4352`), five conventions + scaffold copies, agent prompts | Reworded: closes only via the producer's skills; owner-verified only from the page | M |
| **Retired after the pilot** | `bin/fkit-board.mjs` (733), `bin/board-narrow.mjs` (458), their four tests (`test/board-reader.test.js` also pins `sprint-11.md` by name) | Deleted | S |
| **Tests** | ~12 of 37 files touched (reference-integrity, task-id-uniqueness, dashboard-contract, closed-rank-immutability, mover-exemption-step, throughput-counter, structure-*, prove-red.sh …) | Rewritten or retired; + 52 ported board tests (10 MCP tests later, phase 9); + converter fixtures | M |
| **Wiki** | 368 task-path citations in the vault [M] | Unaffected by ids; `fkit-wiki` re-syncs after the pilot (ADR-005) | S |

**Existing tasks this changes** (the producer's acts, listed so nothing is lost): **`0408`** (deterministic
mover command) — obsolete, `fkit board` is that command. **`0407`** (mover outcome verifier) — re-scope into
the converter's checker, or cancel. **`0135`** (repair mode for half-finished closes) — obsolete, a close
cannot half-land with one place for status. **`0413`** (reader cache) — obsolete, the reader retires.
**`0405`** (terminal view) — re-scope over `fkit board --json` (aiboard's terminal kanban view is ported in
v1), or cancel. **`0416`** (the tripwire, R8) — stays in the backlog, low priority.

---

## 6. The converter — the contract

**What it is:** one fkit command that turns a project's markdown boards into the board's store, for **every**
fkit project (R4). It reads old projects with fkit's **current** tools (the rule the reader uses today:
tools from fkit, data from the project — `bin/fkit-board.mjs:33-37` [M]), so it already copes with
`sprint-N.md`, `plan-sprint-N.md` (task 0415), `sprint-backlog.md` (ADR-041) and old `🔒 CLOSED` banners.

**Why it must be paranoid:** fkit's last bulk move, commit `331f298` (184 files), wrote the wrong status
into 3 of ~80 done briefs and **nobody noticed for two months** [AL, M].

**The contract — every run, every project:**

1. **Refuses to start** unless the git tree is clean, no ship loop is running and the project is not
   already converted.
2. **Trial run first**, writing nothing in the project: builds the converted tree in a temporary folder and
   produces a report **you read** — per task: folder, facts, sprint, order, priority, close record; per
   sprint: folder and body; totals; every refusal; and every **decision to confirm** (item 5).
3. **Refuses anything ambiguous, never guesses** (fkit alone: `0014` — brief says Backlog, folder says done;
   `0004` — no board row; also two live rows, two boards claiming one sprint, a status outside the
   vocabulary). You fix those in the old format first, then re-run.
4. **Changes no meaning:**
   - brief text kept byte-for-byte; only `## ID`, `## Sprint`, `## Priority`, `## Status`, `## Owner` move
     into the front matter, so nothing is stored twice;
   - each board row's text goes word-for-word into the task's `legacy-board-notes.md`, with source board,
     line and hash (Q2);
   - each board's text outside its table becomes the sprint's body;
   - old board files go unchanged into `ai-agents/legacy-boards/`, read by no tool (Q2);
   - the coders' free-text `worklog.md` becomes `worklog-legacy.md`, word for word (Q5);
   - prose "Depends on" lines stay text; no links are inferred (Q6);
   - **past closes keep what they said**: a legacy `✅ Done` stays owner-verified and a legacy agent-closed
     stays agent-closed, both with door = `legacy`. Q3's page-only rule applies from the switch onward; it
     does not rewrite history.
5. **Default priority for converted tasks — to confirm at the trial run.** fkit briefs have no priority
   level (their `## Priority` is order). **Proposed: every converted task gets `medium`** — aiboard's own
   default for a new task, and what a task without the field already reads as in aiboard's model — with
   the existing order carried into `rank`. The trial-run report lists it as a decision for you to confirm
   or change before anything is applied (§9 item 1).
6. **Two steps, so git keeps history:** folder moves first (recognised as renames), then content.
7. **Checks itself — the acceptance bar** (ADR-051 A1/A2, kept by R2): every brief's text byte-identical
   apart from the moved header sections; every other file hash-identical; every task's status, sprint,
   order, owner and close equal to what fkit's current tools read before; `fkit board check` clean;
   `reference-integrity` test green; a write round-trip proving ids like `0013` survive.
8. **You commit.** Undo = revert that commit — clean **until the first change made after the conversion**;
   after that, only fixing forward.
9. **Re-running** on a converted project does nothing and says so; a trial run on an unchanged tree gives
   the same report byte-for-byte.

**Mid-sprint:** allowed. Recommended: between tasks, no ship loop running; restart open sessions after.

---

## 7. Phases — gates, sizes, order

Sizes are rough and relative: **S** ≈ a day or less, **M** ≈ a few days, **L** ≈ a week or more.
**Every phase starts only on your word.** A **gate** is what must be true before the next phase may be put
to you.

| # | Phase | Size | Gate | Can overlap with |
|---|---|---|---|---|
| **0** | **This decision** → the ADR is written; the producer files the phase briefs (each "not started") and re-scopes/cancels 0407/0408/0135/0413/0405 | S | You approve (§10) | — |
| **1** | **Fix only T-023 in the Python aiboard** (numbers like `0013` silently becoming `13`) with a test round-tripping `0013` and `0404` — **aiboard-lead's last task** (Q11). Run fkit's real briefs through it, making Python a **correct reference** for the port [AL] | S | Python round-trips the whole corpus unchanged | design of 4–5 |
| **2** | **Port to Node, straight into `board/`** — the 52 non-MCP tests first, then the code; T-021 (speed) and T-022 (website writes) built in with their original reproductions as tests; correct locking across processes and threads. Faithful to aiboard's format at this step | L | All ported tests green; output **identical to the Python reference** on the corpus; T-021/T-022 tests pass | 4 design |
| **3** | **Make it fkit's board** — `0404` ids, fkit statuses + blocked reason, the close record and store rules (§3.5), four priority levels + rank, task-side sprint membership, `sprint-N` folders, `sprint close --carry-to`, the owner door, `board.json` format check, `fkit board`; drop R12's three | L | Tests green; a **copy** of fkit's corpus runs clean | 4 |
| **4** | **Converter — trial runs only.** Run on fkit, geoconflict, pubquiz and the rest; **no project changed** | L | You read fkit's trial-run report; every refusal explained; the default-priority rule confirmed | 3, 5 |
| **5** | **Wire fkit to the board** — close skills, brief skill, status, ship loops, review paths, identity hook, launcher (fast path, format check, keep previous version), `install.sh` (ship `board/`, require Node), structure check, rules/conventions/scaffold/prompts, tests | **L** (largest) | Full suite green on fixtures; rules block within budget | 4 |
| **6** | **Pilot: convert fkit** — trial run, you read it, apply, **you commit**; then real sprints on it (R2: "test it on fkit") | M | You say it works | — |
| **7** | **Other projects, one at a time: geoconflict → pubquiz → the rest** (Q1). Each: launch → offer → trial run you read → convert → you commit | S–M each | You read each project's trial run | 8, 9 |
| **8** | **Archive aiboard — after the fkit pilot** (Q12): read-only, not deleted; `v0.1.0` tag kept; README points to fkit; **one** distilled design doc in fkit's knowledge base (folder = status; atomic start; comments separate from worklog; re-render hold; rank design; critical + urgent; stale detection; the T-021/22/23 reproductions) linking to the archive; plain archive, no history import [AL]. Retire the read-only reader | S | Phase 6 passed | 7, 9 |
| **9** | **After v1 — the rest of aiboard's features** (R11): the **MCP server** under the same store rules, with a per-call author checked by a hook (Q8); **T-020** comment resolution (Q9); **T-007** live reload | M | Phase 6 passed | 7, 8 |

**Order:** 0 → 1 → 2 → 3 → (4 alongside 3 and 5) → 5 → 6 → then 7, 8 and 9. **The three big changes stay
apart, each gated** — port (2), fkit-ify (3), convert (6–7) — as aiboard-lead advised [AL].
**Removing the previous fkit** from the machine comes when the last project is converted (Q13).
**Until the pilot**, no writable `aiboard serve` on real project data — the read-only reader only (Q16).

**How ADR-051's kept conditions map** (R2): the Node rewrite (P1) = phase 2; T-023 (P2) = phase 1; T-021
and T-022 (P3, P4) = phase 2; one-sided sprint membership (P6) = phase 3; the byte-level import-and-diff and
the write round-trip (A1, A2) = the converter's acceptance bar; the trial run you read before any
migration (D5) = phases 4, 6, 7; durability — *"the tree is committed at the end of every working session"*
(P5, yours personally) — **still stands**: the board has no undo, so git remains the safety net.

---

## 8. Benefits, drawbacks and risks

### 8.1 Benefits
- **One store, duplication impossible by construction** — your principle of 2026-09-18.
- **A board you can read and act on**, which you already found "very useful" on a heavy project.
- **Simpler than two projects:** one repo, one release, one test suite, no version pinning, no
  cross-project coordination; fkit's rules written into the store instead of bolted on [AL].
- **The rules live where the write happens** — page, command, scripts and (later) MCP obey the same code.
- **Owner-verified finally means one clear thing:** you did it in the page (Q3).
- **History for free:** every status change and log entry timed and signed.
- **Problems that disappear:** status disagreeing between brief, board and folder; half-finished closes;
  1,814 lines of close procedure executed step by step by an AI.
- **Nothing of aiboard is thrown away** (R11): priorities, comments, needs-reply, stale detection, rank,
  terminal view, and MCP later.
- **Smaller skills**, which suffer less when a long session is compacted (2026-09-27 report §1.3).

### 8.2 What the merge gives up
- **aiboard as a tool of its own**, usable without fkit (ADR-049 C4). Outside users are **probably none** —
  never on PyPI, 0 stars, 0 forks, 16 clones by 11 unique cloners in 14 days — but that cannot be proven
  [AL]. The archive stays public.
- **Generic design** — with fkit's rules hard-coded, spinning the board back out later is a rewrite.
- **aiboard-lead as a separate voice** — its knowledge goes into the distilled doc before the archive.

### 8.3 What fkit takes on
- **fkit becomes a small web application**: a local server writing to your repo as you. Keeping the
  website-attack class (T-022) closed is fkit's job for good.
- **Node becomes a hard requirement.**
- **More code to own than a minimal port would be** — R11 brings every aiboard feature, and phase 9 adds
  MCP, comment resolution and live reload. Board features will compete with agent work for attention.
- **Keeping the previous fkit on the machine** until every project is converted (Q13).

### 8.4 Risks, highest first

| # | Risk | Mitigation |
|---|---|---|
| 1 | **The converter damages or drops data** (the `331f298` precedent) | §6: trial run you read, refuse-on-ambiguity, byte-level diff, one revertible commit |
| 2 | **Three big changes at once** | Separate phases, separate gates (§7) |
| 3 | **The Node port behaves differently** — a byte-exact front-matter parser, emoji counted differently in the two languages, file locking changes [AL] | Python with T-023 fixed as the reference; diff on the full corpus (phase 2 gate) |
| 4 | **"Owner-verified" can be faked** by an agent using your page | Accepted as a label (R3); the door is recorded on every close; git commit stays the checkpoint |
| 5 | **Hand folder moves bypass the rules** | Detection (§3.5 layer 4); tripwire revisited later (R8, `0416`) |
| 6 | **Two writers at once** — aiboard's web server today does **not** keep simultaneous web writes in order (a shared lock counter, found while reading its code) | Correct cross-process and cross-thread locking, with tests, in phase 2 |
| 7 | **T-022 is live meanwhile** in any writable `aiboard serve` | Read-only reader only until the pilot (Q16) |
| 8 | **The module boundary erodes** | One narrow interface: `fkit board …` and its JSON |
| 9 | **Churn**: ~30 fkit files; the rules block has a size cap | Phase 5, with the budget test |
| 10 | **A second door later (MCP)** | Same core, same rules; per-call author hook-checked (§3.4) |
| 11 | **Fidelity changes**: move history leaves the live view; closed-sprint order becomes a field; a lone brief no longer shows a status line inside it | Legacy notes and frozen boards keep every word; status is the folder name |
| 12 | **Still no undo**, not a transaction across files | Git (P5); `sprint close` does the multi-task step in one call under one lock |

---

## 9. Two points to confirm — not open questions

Everything put to the owner is ruled (§1). Two points are design consequences he should see before
approving:

1. **Default priority for converted tasks.** fkit briefs carry no level. **Proposed: `medium` for every
   converted task**, order carried into `rank`; shown in the trial-run report for confirmation before
   anything is applied (§6 item 5). *Why:* it is aiboard's own default, so converted and new tasks start
   level.
2. **The sprint's task list is shown, not stored.** aiboard wrote a generated `## Tasks` checklist into
   `sprint.md` and kept a `tasks:` list. The kept condition P6 (membership in one place, R2) and your "no
   duplication" principle win over the porting rule (R11) here: the list is **shown** by the page and by
   `fkit board sprint show`, but not written into the file. *Why:* a stored list is a second copy that a
   hand edit or a crash can leave stale — the exact situation you ruled out.

---

## 10. Your decision — and exactly what it authorises

**✅ Approve** authorises, and only this:
1. The architect writes **the new ADR** (§11).
2. The producer **files briefs** for phases 1–9, each marked **not started — needs the owner's word**.
3. The producer **re-scopes or cancels** `0407`, `0408`, `0135`, `0413`, `0405` as §5 lists (through the
   normal close skills, with the agent-closed marker).
4. The tripwire task `0416` (R8) stays in the backlog, low priority.

**⛔ Approve does NOT authorise:** starting any phase, writing any code, touching the aiboard repo,
converting any project, archiving or deleting anything. **Each phase starts only when you say so**, per your
standing rule.

**❌ Reject:** nothing changes. ADR-051 stands as written — fkit's markdown tree stays the store, read by
the read-only board reader, with the gated path to aiboard as a separate project. These reports stay on
file as evidence.

**✏️ Approve with changes:** name the changes; the architect revises this document before the ADR is
written.

---

## 11. What the new ADR must say (list only — not written here)

1. **Decision:** the "Decision in one breath" above; rulings R1–R12 and Q1–Q16 recorded with his own words
   kept apart from option text.
2. **ADR-051:** reaffirms **D1** (one store, never duplicate). Supersedes the trial, F1–F5, the work floor
   and the no-timeout guard (Amendments 1, 3, 5, 6, 8, 9, 10); **D2** (the read-only reader as interim —
   ends per project at conversion); **D7** (aiboard as a separate project whose work fkit never files) and
   every separate-project assumption. Keeps P1–P6, A1–A2 and D5 as phase gates (§7 mapping). D4 (only the
   owner declares) carries into "each phase on his word". The evidence log is closed, not deleted.
3. **ADR-049:** drops C4 (aiboard usable without fkit). Amends **D1/D3**: owner-verified is set by the
   store **only** for writes through the owner's page — a label, not proof; every other close is
   agent-closed. D2 (commit is the human checkpoint) unchanged. D4 (T-022 before any write) satisfied by
   building it in. D7 superseded (fkit owns the mechanism). D8 discharged.
4. **ADR-033:** producer-only closes enforced by the store, the identity hook and the skill lock.
   **§5 superseded:** a producer close with the owner present is **no longer** owner-verified (Q3). "The
   limit" inherited unchanged.
5. **ADR-050:** the deterministic command is `fkit board`; B-1 (the skill is the sanctioned entry)
   unchanged; the B-2 rejection (matching shell text) overtaken **only** for the `--by` identity check;
   0407/0408 dispositions.
6. **ADR-029:** a task is still a folder with a permanent four-digit id; `in-progress/` becomes a fourth
   status folder; the board allocates ids; the branch race unchanged.
7. **ADR-040/041/047:** the line-3 banner grammar retires in converted projects; a sprint's status is its
   folder; several active sprints stay legal; the backlog is not a sprint.
8. **ADR-048:** obsolete (with 0135).
9. **ADR-014:** test scope grows to the board's behaviour tests; zero dependencies kept.
10. **The porting rule** (R11) and its three exceptions (R12); MCP, T-020 and T-007 after v1; no epics
    unless a project needs them (Q14).
11. **Install and versions:** Node a hard requirement; `install.sh` ships `board/`; per-project data-format
    check at launch (R9); the previous fkit kept until every project is converted (Q13).
12. **The converter's contract** (§6), its undo window, and the default-priority rule as confirmed.
13. **Unchanged, stated so nobody assumes otherwise:** ADR-005 (only fkit-wiki writes the wiki), ADR-022
    (tool access), ADR-018 (the skill lock), the never-commit rule.
14. **Re-raise only if:** the Node port cannot match the Python reference on the corpus; the converter
    cannot reach a clean byte-level diff on fkit's own tree; or after the pilot you find the board worse to
    work with than the markdown.

---

## What was written

This file (revised to its final text on 2026-09-30), and earlier the same day a dated superseded-by note on
each of the four earlier 2026-09-30 reports. No code, brief, ADR or wiki edit; nothing committed. Once you
decide, `fkit-wiki` should ingest the ADR, with this document as its evidence (ADR-005).
