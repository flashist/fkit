# Evaluation: aiboard as fkit's single task and sprint store — the fkit side

> ## ⛔ SUPERSEDED 2026-09-30 by the owner's FULL-MERGE ruling — dated note; nothing below it was changed
>
> The owner ruled (selected option text): *"No, fkit only → full merge — aiboard becomes fkit's built-in
> board; its repo is archived (history can be carried over). Simplest overall."* The decision now lives in
> [`2026-09-30-decision-document-merge-aiboard-into-fkit.md`](2026-09-30-decision-document-merge-aiboard-into-fkit.md).
> Read that first. This report stays on file as supporting evidence; where the two differ, the decision
> document wins.

> ## ⭐ Rulings so far — dated note, 2026-09-30. The rest of this report is left unchanged below it.
>
> Relayed by `fkit-lead` from `AskUserQuestion`. Quoted text is **selected option text** unless marked
> as his own words.
>
> - **Q2 (other gate items):** *"Keep all the others — Only the trial goes. The converter trial run you
>   read, the bug fixes, the Node rewrite and the other conditions stay."*
> - **Q5 (agents' door):** *"CLI for everything — Simpler, but harder for fkit's hook to check
>   reliably."* ⚠️ **Against this report's MCP recommendation (§5.1).** §2's diagram, §5.2's hook and
>   R16 are superseded on that point; the CLI-door enforcement design is
>   [`2026-09-30-design-cli-door-enforcement-addendum.md`](2026-09-30-design-cli-door-enforcement-addendum.md).
> - **Q6 (unconverted projects) — his own words:** *"#1, and also we need to make sure we can "lock"
>   fkit on a specific version of aiboard (meaning, that there is no way, an older version of fkit that
>   is supposed to work with one version of aiboard, can accidentally start trying to use a newer
>   version of aiboard). Maybe we even need to start using npm packages for that."* (#1 = the launcher
>   offers the converter; until converted a project can stay on the previous fkit version.) Design:
>   [`2026-09-30-design-fkit-aiboard-version-lock.md`](2026-09-30-design-fkit-aiboard-version-lock.md).
> - **Q1 (ids) — his own words:** *"I am not ready to make the decision, provide me a detailed report
>   about the question: I need to understand the pros/cons of both decisions."* **Still open.** Report:
>   [`2026-09-30-eval-task-ids-keep-0404-or-rekey.md`](2026-09-30-eval-task-ids-keep-0404-or-rekey.md).
>   ⚠️ §5.3's "~1,700 links" used a rougher counting rule; that report re-measures it.
> - Q3, Q4, Q7–Q12: not yet ruled.

- **Date:** 2026-09-30
- **Author:** `fkit-architect`, spawned by `fkit-lead` (consult, hop 1). ⛔ **No owner channel in this
  spawn** (ADR-021) — every open point is a question in §10, with a recommended answer, not a guess.
- **Kind:** evaluation + design (`/fkit-evaluate-approach` shape). **Design only.** No code, no skill
  or agent edit, no brief, no ADR.
- **Status:** ⏸ **OPEN — input to a decision document the owner will approve or reject.**
- **Scope:** the **fkit side only**. aiboard's side (its API, its Node rewrite, T-021/022/023, its data
  model) is being handled by `aiboard-lead` in a separate consult. Where this report needs something
  from aiboard, it says so as a **requirement** (§4), and never files or schedules aiboard work
  ([ADR-051](../decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md) D7).

> ## ⛔ Owner condition — read before anything else
>
> Standing rule (the owner's words, 2026-09-27, recorded in
> [`2026-09-27-eval-keeping-ship-loop-conductors-from-bloating.md`](2026-09-27-eval-keeping-ship-loop-conductors-from-bloating.md)):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve
> it (because it might change the way fkit work in general)."*
>
> 1. This report is **input to a decision**. It is not a work order.
> 2. **Nothing in §7 (phasing) starts** until the owner approves the decision document **and** then
>    approves each piece specifically.
> 3. A new ADR is needed before any of it (§8 lists what it must say). This report does not write it.

### Provenance legend (used throughout)

| Tag | Meaning |
|---|---|
| **[M]** | Measured or read in fkit's repo by this architect, 2026-09-30. |
| **[AL]** | **`aiboard-lead`'s input, 2026-09-30, checked by it against aiboard HEAD `0108027`**, relayed by `fkit-lead`. ⛔ **Not re-derived here** — carried as its claim. |
| **[S]** | Read in aiboard's source at HEAD `0108027` by an explore pass spawned by this architect (read-only). Used only for line-level detail and for two findings `aiboard-lead` did not list. |
| **[O]** | The owner's words or selected option text, from the 2026-09-30 rulings relayed by `fkit-lead` (§1). |

---

## 0. The answer, in plain words (≤20 lines)

1. **It is doable, and most of the work is on fkit's side, not aiboard's.** About 30 fkit files read or
   write tasks and sprints today (§3). Almost all of them change.
2. **The big win is real:** status lives in **one** place (the folder aiboard keeps), so the four
   400-plus-line "mover" procedures shrink to "decide, then make one call", and whole classes of
   drift (brief says one thing, board says another) stop being possible.
3. **Agents should talk to aiboard through its MCP tools, not the web port.** MCP calls are visible to
   fkit's hooks, so fkit can **check who is calling** and **block a non-producer close** — which is
   *stronger* than today. The web port is for the owner only.
4. **"Owner-verified" via the web page is a label, not a proof.** Agents run as the same computer user
   and could reach the page's port. It means "arrived through the owner's door". ADR-049 said fkit
   never trusts a channel as proof; the owner's new ruling reverses that on purpose — the new ADR must
   say so plainly.
5. **Keep fkit's task folder names (`0404-slug`).** aiboard should accept them. Re-keying to `T-0404`
   would break ~1,700 links across tasks, boards, ADRs and the wiki (§5.3).
6. **The riskiest single piece is the converter** (every project, old conventions, 2 MB of sprint-board
   prose). It must dry-run, refuse anything unclear, change nothing it cannot prove, and be one commit
   you can revert.
7. **Sprint-board prose does not fit a task list.** Proposal: the non-table text of each board becomes
   the sprint's body; each row's cell text goes, word-for-word, into that task's folder; the old
   board files are kept frozen and read by no tool.
8. **A hidden coupling:** fkit is installed **once per machine**, so the fkit release that expects
   aiboard forces **every** project on that machine to migrate at the same time, unless the launcher
   handles unmigrated projects (§6.6, Q6).
9. **Order:** fkit can do the design, the requirements hand-over, and the converter dry-run **now, in
   parallel** with aiboard's rewrite. The skill rewrites wait for aiboard's frozen contract. fkit
   migrates itself first, as the pilot.

---

## 1. What this rests on — the 2026-09-30 rulings

⛔ **His own prose and selected option text are kept apart, as in ADR-051.**

**His own words (typed by him) [O]:**

> *"I think I'm ready to make the final decision about integration of AI board to F-Kit. The board
> proved to be useful for me. I used it on one heavy project, which is GeoConflict [...] So we do need
> to integrate AI board into F-Kit as a dependency. [...] ideally F-Kit should stay in terms of the
> amount of agents and responsibility the way it is right now, but when we need to brief a task, the
> producer might [...] call some methods from the AI board. [...] Probably it would be better if AI
> board is not agent based. Probably it would be better if it's just a deterministic software with API
> that both agents and humans can call. [...] The AI board should expose some API to the external
> world and the producer and maybe other agents too can just call this exposed APIs to work with
> tasks. [...] I want you to understand how we're going to implement it, what are the drawbacks, maybe
> like benefits and drawbacks maybe there is something I don't see yet"*

**The gate, his own words [O]:** *"we should do the rewrite, the 4-weeks trial is not needed anymore (I
was able to make the decision faster). Though we can test it on fkit if needed."*

**Web edits — SELECTED OPTION TEXT, not his prose [O]:** *"Yes, and count them as mine — Your edits in
the page are recorded as owner-made, which finally gives fkit a real 'owner-verified' close. Agents
still only close through the producer."*

**Scope — SELECTED OPTION TEXT, not his prose [O]:** *"Every fkit project — Any project using fkit: a
general converter shipped with fkit."*

**What follows from them, for this design:**

| Ruling | Consequence here |
|---|---|
| Same team, same responsibilities | No new agent. aiboard is a **tool** the existing roles call. The producer still owns briefs and closes (ADR-033). |
| aiboard = deterministic software with an API | Every task/sprint write goes through aiboard's API. **No agent hand-edits aiboard's front matter** ([AL]: non-negotiable). |
| Rewrite yes, trial no | aiboard's Python→Node rewrite is a **precondition**. ADR-051's trial and its fail conditions F1–F5 are dropped. **What survives of P1–P6 / A1–A2 / D5 is not ruled** → Q2. |
| Web edits count as the owner's | An owner-door write is recorded as owner-made; this **partly reverses ADR-049 D1** (§6.3). |
| Every fkit project | The converter is a shipped fkit tool, not a one-off for this repo (§6). |

---

## 2. The target picture — who reads what, who writes what

```
                      ┌──────────────────────────────────────────────────────────┐
                      │  the project's git repo                                  │
                      │   ai-agents/                     ← aiboard's root        │
                      │     aiboard.json                   (format version,     │
                      │     tasks/<status>/0404-slug/        id pattern)         │
                      │        brief.md  (front matter + body)                   │
                      │        worklog.md (aiboard-owned, timed + signed)        │
                      │        comments.md, plan.md, review.md, assets/ …        │
                      │     sprints/<status>/S-011-slug/sprint.md (prose body)   │
                      │     knowledge-base/, wiki-vault/  (unchanged, not aiboard)│
                      └───────────────▲──────────────▲───────────────▲───────────┘
                                      │              │               │
             ONE store, THREE doors — all call the same aiboard core │
                                      │              │               │
   ┌──────────────────────┐   ┌───────┴──────┐ ┌─────┴───────┐ ┌─────┴──────────────┐
   │ fkit agents (Claude) │──▶│ MCP (stdio)  │ │ CLI --json  │ │ HTTP  serve --owner │
   │  producer, coder, …  │   │ agents' door │ │ scripts'    │ │ the OWNER's door    │
   └─────────┬────────────┘   └──────────────┘ │ door:       │ │ (web page)          │
             │ every MCP call passes            │ dashboard,  │ └─────▲──────────────┘
             ▼                                  │ heal, tests,│       │
   ┌──────────────────────────────┐             │ converter   │   the owner, in a browser
   │ fkit PreToolUse hook         │             └─────────────┘
   │ matcher mcp__aiboard__.*     │  checks: real agent_type = claimed author;
   │ (new; same shape as ADR-018) │          done/cancelled only from fkit-producer
   └──────────────────────────────┘
```

- **Reads:** every role reads through MCP (or plain `ls`/`grep` of the files — they stay markdown in git).
- **Writes by agents:** MCP only. The hook checks the caller (§5.2).
- **Writes by the owner:** the web page (owner door) — recorded as owner-made (§6.3 is honest about what
  that proves) — or through a producer session he is present in.
- **Writes by fkit scripts** (converter, heal): the CLI, with a fixed author string such as `fkit-convert`.
- ⛔ **No second store, no mirror, no sync.** fkit's markdown sprint boards and `## Status` fields stop
  being live carriers at cutover. That is the owner's 2026-09-18 principle (ADR-051 Ruling 2, his prose).

⭐ **Why `ai-agents/` as the aiboard root** [M]: fkit's tree already has `ai-agents/tasks/` and
`ai-agents/sprints/`, and aiboard's layout is `tasks/<status>/` + `sprints/<status>/` [S]. fkit's task
boards `backlog/ done/ cancelled/` are a **subset** of aiboard's four status folders (aiboard adds
`in-progress/`). So with fkit's folder names kept (§5.3), **a task's path does not change at cutover** —
only an in-progress task gains a new folder. Sprint boards are the part whose paths do change.

---

## 3. Inventory — everything in fkit that reads or writes tasks/sprints, and what becomes of it

Sizes are **relative**: **S** ≈ a day or less, **M** ≈ a few days, **L** ≈ a week+, for one coder with
review. "Phase" refers to §7.

### 3.1 The four movers, and the decisions around them

| Today [M] | Under aiboard | Size · Phase |
|---|---|---|
| `claude/skills/fkit-task-done/SKILL.md` (460 lines), `fkit-task-cancelled` (422), `fkit-sprint-done` (456), `fkit-sprint-cancelled` (476) — **1,814 lines of prose, no script** (ADR-049 C6). Each edits several carriers: folder `git mv`, brief `## Status`, every board row, parent-epic slice table, inbound hrefs under `sprints/done/`, `sprints/reviews/` and the knowledge base (`fkit-task-done/SKILL.md:134-317`; sprint movers stamp the line-3 banner, move open rows as `➡️ Moved` to `dashboard.sh successor`, then `git mv` last — `fkit-sprint-done/SKILL.md:72-88,155-213`). All four end by running `node --test test/reference-integrity.test.js` (`fkit-task-done/SKILL.md:343-379`) — ⚠️ a file a **consuming project does not have**: `install.sh:42-45` ships only `claude/`. | **Thin skills: judge, then call.** Judgement stays (is the close warranted? is the owner present? which marker? is the reason adequate? which sprint takes the open rows?). Mechanics become **one aiboard call**: `change_task_status(id, done, close=agent\|owner-verified, note)`. The board rows, the `## Status` line and most href repointing **no longer exist to update** — status has one carrier. Sprint close = move each open task's `sprint` field + `change_sprint_status`. | **M** (four skills, heavy deletion) · F4 |
| **ADR-033** — producer-only movers, enforced by the `Skill` hook (`claude/skill-ownership-hook.sh`, matcher `Skill`). | **Kept, and strengthened**: the `Skill` gate stays **and** a new MCP hook refuses `done`/`cancelled` from any non-producer `agent_type` (§5.2). | S · F4 |
| **ADR-050** (deterministic mover command; verifier first) and its tasks **`0407`** (outcome verifier) and **`0408`** (the command, `backlog/`, not authorised). | **aiboard's API *is* the deterministic command.** `0408` is **obsoleted**. `0407`'s idea survives as the **converter's verifier** (import-and-diff). ADR-050 D2 (skill stays the sanctioned entry) carries over unchanged. | — (producer's call to cancel/re-scope; not this report's) |
| **ADR-048** reconcile mode, task **`0135`** (unbuilt). | **Obsoleted:** a half-landed close needs two carriers to disagree; with one carrier it cannot happen. ADR-048's *must-never list* (never upgrade a marker) carries into the new mover skills as text. | — (producer's call) |

### 3.2 Briefing, status, and the ship loops

| Today [M] | Under aiboard | Size · Phase |
|---|---|---|
| `claude/skills/fkit-task-brief/SKILL.md` (456 lines): allocates `1 + max` id across three boards (`:212-262`), writes `brief.md` with `## ID / ## Sprint / ## Priority / ## Status / ## Owner` sections, appends a board row after the highest `P<n>` (`:142-179`). | Calls `create_task` with `--body-file` (the brief body **without** those five sections), `sprint`, `assignee=<role>`, and rank-to-bottom. **aiboard allocates the id** in fkit's format (requirement R3). Decomposition and dependency judgement stay in the skill. | M · F4 |
| `claude/skills/fkit-status/SKILL.md` (537 lines) + `dashboard.sh` (**1,773 lines** of bash): `select-active` resolves sprint identity (ADR-040/041) and the line-3 banner (ADR-047, `sprint-status-vocabulary.md` — *"The recognizer has exactly one implementation, in `dashboard.sh`"*); drift records (brief vs board vs folder); the `⟦BOARD⟧` table. `throughput.mjs` reads git history of `ai-agents/tasks/(backlog\|done\|cancelled)/` (`throughput.mjs:124-125`). | **Rewritten over `aiboard info --json` / `board --json`.** Active sprints = aiboard's `in-progress` sprints (plural supported [AL]). **ADR-041's one-grammar rule retires with the banner**; most drift kinds cannot occur. Throughput reads aiboard's timed status lines instead of git renames (better data; E1/E2). The seven-beat briefing shape stays. | **L** · F5 |
| `fkit-task-ship-loop` (321 lines), `fkit-sprint-ship-loop` (410 lines): select via `dashboard.sh select-active` + `dashboard.sh <plan>` (`fkit-sprint-ship-loop/SKILL.md:102-109`); write `🔄 In progress` / `🚧 Blocked — …` / back to `🔲 Backlog` in the brief **and** the row (`fkit-sprint-ship-loop/SKILL.md:122-126`; `fkit-task-ship-loop/SKILL.md:115,142-149`); route closes to a spawned producer and cross-check the result (`fkit-task-ship-loop/SKILL.md:170-200`). | Start = `start_task` (atomic claim, refuses a blocked task [S]). Everything else routes as today. **Smaller**, which also eases the post-compaction skill cut the 2026-09-27 report measured (`fkit-sprint-ship-loop` ~40k chars, cut to ~20k). | M · F4 |

### 3.3 Reviews, plans, worklogs

| Today [M] | Under aiboard | Size · Phase |
|---|---|---|
| `review.md` in 160 task folders; `plan.md` in 135 — written by `fkit-stateful-review`, `fkit-process-stateful-review`, `fkit-plan-task`. | **Unchanged files**, carried as extra files in the task folder. aiboard preserves them across moves but they are **invisible in its JSON, API and UI** [AL] → requirement R7 (read-only doc tabs). Paths stay stable (§5.3). | S · F4 |
| Sprint-keyed ledgers `ai-agents/sprints/reviews/*.md` (2 files). | Not a task, not a sprint: **move out of `sprints/`** (e.g. `ai-agents/reviews/sprints/`) so aiboard's `sprints/` holds only status folders. Reviewer skill paths + links updated. | S · F4 |
| `worklog.md` in 142 task folders: **free prose** written by the coder. | ⚠️ **Name collision.** aiboard owns `worklog.md` with a strict `## <ts> — <author>` grammar and appends status lines to it [S]. fkit prose headings like `## 2026-09-18 — something` would **mis-parse as entries** [S: regex `model.py:221`]. **Converter moves each prose worklog verbatim to `worklog-legacy.md`** and starts aiboard's `worklog.md` with one pointer entry. Going forward the coder logs through `log_work` — timed and signed (evidence log E1). | S (converter) + S (skills) · F2/F4 |

### 3.4 The board reader and its tests

| Today [M] | Under aiboard | Size · Phase |
|---|---|---|
| `bin/fkit-board.mjs` (733 lines, read-only reader over fkit's tree, `--root`, ADR-051 "A-now"); `bin/board-narrow.mjs` (458, `0405` Stage 0 probe); tests `board-reader`, `board-root`, `board-archived-id`, `board-narrow`. Open task **`0413`** (reader cache vs renames). | **Retired at cutover, per project.** aiboard serves its own board directly. Until a project is converted, the reader keeps serving it (it is the interim). `0413` becomes moot once fkit itself converts (producer's call). `0405` (terminal UI) becomes a question about a consumer of aiboard's JSON, i.e. aiboard's side. | S (delete) · F9 |

### 3.5 Hooks, launcher, install, heal

| Today [M] | Under aiboard | Size · Phase |
|---|---|---|
| `build_settings()` in `claude/fkit-claude.sh:295-331` registers five hooks: `Skill`, `AskUserQuestion`, `Agent\|Task` (PreToolUse), `Stop`, `UserPromptExpansion`. **No hook sees `Edit`/`Write`/`Bash`** (verified in ADR-049). | **Add:** (a) a PreToolUse matcher `mcp__aiboard__.*` → new hook checking caller identity and terminal transitions (§5.2); (b) **recommended**, a PreToolUse `Edit\|Write\|MultiEdit` hook refusing agent edits inside aiboard front matter (§5.2, Q8); (c) register aiboard's MCP server for the session (`aiboard mcp --root ai-agents`). | M · F6 |
| `install.sh:123-131` and `fkit-claude.sh:532-560` check `claude` (wall) and `codex` (warning, fail-open). `node` is already a runtime need (`carry-check-hook.sh:8`, fail-open). | **aiboard becomes a hard dependency** — no tasks can be read without it. Launcher: check presence + **exact pinned version / capabilities** via `aiboard info --json` (R11); **wall** for store work, not a warning. Install: `npm install -g aiboard@<pinned>` (Codex precedent). | S–M · F6 |
| `claude/skills/fkit-heal/` + `claude/structure-spec.md:69-74, 107-112` + `claude/structure-manifest.tsv`: structural dirs `ai-agents/tasks/{backlog,done,cancelled}/`, `ai-agents/sprints/{,done/}`, `ai-agents/tasks/README.md`. | Spec grows `tasks/in-progress/`, `sprints/<status>/`, `aiboard.json`. **Heal must never "repair" aiboard-owned files** — it checks presence and format version only; aiboard's `check` is the content check. `ai-agents/tasks/README.md` rewritten. | S–M · F8 |
| `claude/fkit-claude-init.sh` scaffolds `ai-agents/` for a new project. | New project: run `aiboard init` at `ai-agents/` with fkit's id pattern and format version. | S · F6 |

### 3.6 Rules, conventions, agents, wiki, ADRs

| Today [M] | Under aiboard | Size · Phase |
|---|---|---|
| `claude/scaffold/universal-rules.md:6-9` (movers rule, marker) — injected into every project's `CLAUDE.md` **and** `AGENTS.md` (`fkit-claude-init.sh:362-409`, `RULES_MAX=4352`), size-capped (`test/rules-block-budget.test.js`, keep ≥400 B free). `claude/scaffold/CLAUDE.md:30-35`. | Reworded: *"A task or sprint reaches done/cancelled only through the producer's movers, which call aiboard. Never hand-edit aiboard front matter. Agents never use the owner's web door."* Must fit the budget. | S · F8 |
| Conventions: `task-status-vocabulary.md`, `sprint-status-vocabulary.md` (line-3 banner), `priority-is-rank-not-identity.md` (`P<n>` cell), `dependency-declaration-form.md` (prose `Depends on:`), `task-owner-vocabulary.md` — and their scaffold copies (`claude/scaffold/ai-agents/knowledge-base/conventions/`, guarded by `dual-home-parity`). | Each rewritten to name the aiboard field that now carries the fact (status folder, `rank`, `blocked_by`, `assignee`, close field). The banner grammar is retired for live boards; the legacy `🔒 CLOSED` rung is only needed by the converter. | M · F8 |
| Agent prompts `claude/agents/fkit-producer.md` (13 path references), `fkit-lead.md` (6), `fkit-coder.md` (5), `fkit-reviewer.md` (4), `fkit-architect.md` (1); `fkit-team` skill. | Path/vocabulary edits; the producer's prompt gains "briefs and closes go through aiboard". | S · F8 |
| Wiki: `fkit-wiki-ingest` (`'all tasks'` = `ai-agents/tasks/{backlog,done}/*/brief.md`), `fkit-wiki-sync` (`:48-52`, watermark diff), `fkit-wiki-lint`. 378 task-path references inside `wiki-vault/` [M]. | Paths survive if folder names are kept (§5.3); briefs gain front matter — the ingest reads it instead of `## Status`. ⛔ **Any vault edit is `fkit-wiki`'s** (ADR-005) — a post-cutover sync, not the converter. | S · F8 |
| ADRs 029, 033, 041, 047, 048, 049, 050, 051 describe today's carriers. | **Not edited** (records). The new ADR supersedes/amends them by reference (§8). | — |

### 3.7 Tests that pin paths or vocabulary [M]

`test/` has 37 files. Affected:

| Test | Why it changes | Fate |
|---|---|---|
| `reference-integrity.test.js` | Resolves every relative link in the corpus; sprint-board paths change at cutover | Stays; the converter must leave it green (acceptance bar) |
| `task-id-uniqueness.test.js` | Scans task folders | Add `in-progress/`; or defer to `aiboard check` |
| `dashboard-contract.test.js` | Pins `dashboard.sh` stdout | Rewritten with F5 |
| `board-reader`, `board-root`, `board-archived-id`, `board-narrow` | The interim reader | Retired with it |
| `mover-exemption-step.test.js`, `closed-rank-immutability.test.js` | Mover prose; board rank rows | Rewritten or retired with F4 |
| `throughput-counter.test.js` | Git-rename history | Rewritten with F5 |
| `structure-spec`, `structure-manifest`, `structure-check`, `structure-repair`, `structure-notice` | Structural dirs | Updated with F8 |
| `rules-block-budget.test.js`, `dual-home-parity.test.js` | Rules block / convention copies | Re-run; budget is the constraint |
| `skill-ownership-hook.test.js` | Unchanged; a sibling test for the new MCP hook is new | New, F6 |
| `coordination-citation-policy.test.js` | Scans `ai-agents/tasks/*/*/*.md` and `ai-agents/sprints/*.md` (`:182-210`) | Paths updated with F8 |
| `board-reader.test.js:127-136` | **Pins `sprint-11.md` by name** — goes red when Sprint 11 closes, aiboard or not | Retired with the reader |
| `test/prove-red.sh` | Mutation checks against mover/ship-loop prose (`:654-660`, `:1529-1532`, `:1609-1618`, `:1705-1819`) | Rewritten with F4 |
| `skill-frontmatter.test.js:574` | `EXPECTED_SKILLS = 28` | Only if a skill is added/removed |
| `wiki-flag-convention.test.js` | Flag text in the three wiki skills (they name task paths) | Re-run with F8 |

**New:** a converter test suite over fixture projects (fkit-shaped, old-convention, tiny) — §6.

---

## 4. What aiboard must represent — the requirements list for `aiboard-lead`

⛔ **Requirements, not tasks.** fkit files nothing on aiboard's board (ADR-051 D7). The **status** column
is `aiboard-lead`'s own reading [AL] unless tagged otherwise.

| # | fkit concept (today) | Requirement on aiboard | Status per [AL] |
|---|---|---|---|
| **R1** | **Ids are all-digit, zero-padded, permanent** (`0013`, ADR-029) | Never coerce a front-matter string (T-023). **Hard blocker before any import.** Regression test round-tripping `0013` and `0404`. | T-023 open, high |
| **R2** | Folder name `NNNN-slug`, linked from ~1,700 places | A **board-level id pattern** in `aiboard.json` so `0404-slug` folders are visible and addressable (aiboard's option B). Today `^[A-Z]-\d+` makes them invisible. | Needs building; blocked by T-023 |
| **R3** | `1 + max` over **all** boards, never reused | aiboard allocates in the board's pattern, max over every status folder incl. `cancelled`. (Already max-over-all [S]; padding to 4 digits needs R2.) Branch race stays accepted (ADR-029 §3). | Mostly exists |
| **R4** | **Six task statuses**: Backlog, In progress, Blocked, Done, Cancelled, Moved | 🔲🔄✅⛔ = the four folders. **🚧 Blocked with a free-text reason** (e.g. *"on the owner"*) needs a field — `blocked_by` holds task ids only. **➡️ Moved is dropped** (a row disposition, 113 of 539 rows; a sprint is a field). | Blocked-reason field: needs building (or a label) |
| **R5** | **Agent-closed marker vs owner-verified** (ADR-033 §5, ADR-049) | A **structured close record**: `closed_by` (claimed actor), `channel` (mcp / cli / owner-door), `close: owner-verified \| agent`. Today the marker exists only as prose in the auto worklog line. The **mover skill chooses** the value; aiboard stores it. | Needs building |
| **R6** | **`P<n>` rank on a sprint board**; `Unscheduled` / Backlog unranked (`priority-is-rank-not-identity.md`) | Map to `rank` (T-025, **done** at HEAD `0108027`), not to `priority`. "Unscheduled" = no sprint, bottom of the queue. fkit sets no severity: `priority` stays default. | Exists |
| **R7** | **Extra files in task folders**: `plan.md` (135), `review.md` (160), `worklog.md` prose (142), `assets/`, `captures/`, `scoring-table.md`, `canary.sh` [M] | Preserve across moves (does [AL]); **show them read-only** in the page and expose them in JSON ("doc tabs"). Tolerate stray gitignored dirs (`.fkit/state` exists inside `tasks/backlog/` today [M]). | Preserve: exists. Tabs: needs building |
| **R8** | **Prose-heavy sprint boards** (2.18 MB across 11 boards [M]; `sprint-11.md` is 1,407 lines) incl. `READ THIS FIRST` and authority sections | A sprint body that holds long free prose (1,400 lines OK [AL]); **fence the generated `## Tasks` section** so it can never overwrite prose — today it replaces anything up to the next `## ` and the web drawer hides everything after it [S]. An **API to edit sprint body/goal/dates** (today: hand edits only [AL]). | Prose: exists. Fence: aiboard-lead offers. Edit API: gap |
| **R9** | **Plural active sprints** (ADR-047: "current" = every In-progress sprint) | `info` returns `active_sprints` [AL]. | Exists |
| **R10** | **Epics**: movers support `## Parent / Epic` (`fkit-task-done/SKILL.md:118`); **0 in fkit's corpus** [M], may exist in other projects | A `parent` field (labels as an interim) and a derived child table. | Labels now; parent later |
| **R11** | **Dependencies**: prose `Depends on:` in 362/404 briefs; the text contains **negated ids** (expert verdict §1) | `blocked_by` (exists, enforced at start, cycles reported). ⛔ The converter will **not** auto-parse prose into it (§6.4). | Exists |
| **R12** | **Sprint-keyed review ledgers** | None — fkit moves them out of `sprints/` (§3.3). aiboard must **ignore unknown dirs** under `tasks/` and `sprints/`. | Confirm |
| **R13** | Brief **body** edits by the producer (amendments, owner-ruling annotations) | Either an API to replace/append a brief body, or the explicit rule "bodies may be hand-edited, front matter never" — aiboard-lead's position [AL]. fkit accepts the rule. | Rule agreed |
| **R14** | Worklog prose with `##` headings; **forged-entry hazard**: a logged message containing a heading-shaped line parses as a separate entry [S `model.py:228-235`] | Escape or refuse heading-shaped lines in `log`/`comment` bodies. | **Not on aiboard's board** — new, from [S] |
| **R15** | Concurrent writers (owner page + agent MCP processes, several sessions) | Correct locking across processes **and threads**. [S] found the HTTP server's reentrant `write_lock` keeps its depth counter on the shared `Board`, so two simultaneous web writes are **not serialised** (`store.py:96,130-144`). | **Not on aiboard's board** — new, from [S] |
| **R16** | Per-role attribution inside one session (a lead session spawns a producer; both use the **same** MCP server process) | MCP tools accept a **per-call author** (`by`). Today MCP's author is fixed per process [S `mcp.py:312-314`] — every role in a session would sign as one. | Gap — needed for §5.2 |
| **R17** | Every write attributed | `update_task`, `rank_task`, `create_sprint`, `move_sprint` record **no author** today [S]. Needed so the history the owner asked for (E2) is complete. | Gap |
| **R18** | Versioned contract | Semver on CLI/MCP/JSON; a **checked** board-format version + explicit `aiboard migrate`; `info --json` reports version, format, capabilities. fkit pins exactly until Node 1.0, then `^1`. | Proposed by aiboard-lead |
| **R19** | T-022 (cross-origin writes), T-021 (snapshot O(n²), 729 ms at 409 sprinted tasks) | Both closed before cutover. T-022 fix **creates no identity** [AL]. | Open, high |
| **R20** | Owner door | `serve --owner`: writes through it are stamped channel = owner-door. ~1 day after T-022 [AL]. | Needs building |
| **R21** | Bulk import for the converter | Either a bulk-import API or the converter writes files in the frozen format then runs `aiboard check`. [AL]: no bulk import today. | Gap — see §6.2 |
| **R22** | Search/filter at 400+ tasks | The page has no search or collapsing [AL]. | Probably needs building |

---

## 5. Integration shape

### 5.1 Which door do agents use? — three options

| | **MCP (stdio)** | **CLI (`--json`, via Bash)** | **HTTP (the web port)** |
|---|---|---|---|
| How an agent calls it | A typed tool, `mcp__aiboard__change_task_status` | `aiboard --json task move 0404 done --by …` in Bash | `curl` to localhost |
| Can a fkit hook **see** the call and its arguments? | ⭐ **Yes** — PreToolUse matcher on the tool name; payload has `tool_input` and the real `agent_type` (same mechanism as ADR-018) | Only by argv matching of `Bash` — **rejected once already** as "a string game" (ADR-050 B-2) | No |
| Attribution | Per-call `by`, **checkable** against `agent_type` (needs R16) | Self-declared `--by` / env; uncheckable | Owner-door stamp — **wrong for agents** |
| Context cost | 20 tool schemas per session — ⚠️ to measure; Claude Code can defer MCP schemas until used | none | none |
| aiboard-lead's view [AL] | Recommended door for agents | Recommended door for agents | "HTTP writes are for the web page only … agents must never use it" |

**Recommendation: MCP is the agents' door; the CLI is the scripts' door (dashboard, heal, converter,
tests); HTTP is the owner's alone.** The deciding reason is one line: **only MCP calls are visible to
fkit's hooks**, so only MCP lets fkit *check* producer-only closes and *check* attribution instead of
trusting them. **Main tradeoff:** a Bash-based `aiboard` call or a `curl` to the owner port still
bypasses the hook — the same hole `Edit` leaves today (ADR-050 D2 "status quo documented, not
strengthened"). It must be written down, not glossed.

### 5.2 Where "producer-only closes" is enforced — fkit side, not aiboard side

aiboard-lead's position [AL]: *enforcement should STAY on fkit's side; aiboard records who and via which
door.* This architect agrees — it keeps aiboard usable with no framework (ADR-049 C4) and keeps fkit's
governance fkit's.

**The new hook (design, not code):** registered in `build_settings()` beside the `Skill` hook.

```
PreToolUse  matcher: mcp__aiboard__.*
  input:  tool_name, tool_input, agent_type (real caller, any spawn depth — ADR-018 §4)
  deny if tool_input.by != "fkit-" + role(agent_type)            # attribution is checked, not claimed
  deny if tool is change_task_status / change_sprint_status
       and target status ∈ {done, cancelled}
       and role(agent_type) != producer                           # ADR-033, now at the write itself
  deny if tool_input.close == "owner-verified"
       and the caller is a spawned agent (no owner channel, ADR-021)   # marker honesty (ADR-033 §5)
  allow otherwise
```

- ⭐ **This is stronger than today** in one exact way: today the `Skill` hook guards *invoking the mover*;
  the file writes themselves are unguarded (ADR-049's hook table). Here the **write call itself** is
  guarded, for the door agents are told to use.
- ⚠️ **Limits, stated:** launcher sessions only (the hook lives in `.fkit/settings/<role>.json`, like the
  carry-check hook); fail-open or fail-closed on a parse fault must be ruled (the current hook parses
  identifiers only; this one parses a JSON argument); the "is the caller spawned?" test for the third
  rule needs the same signal ADR-033 uses today — ⚠️ **to verify in a spike**, together with whether
  spawned subagents see the session's MCP tools.
- **Recommended companion (Q8):** a PreToolUse `Edit|Write|MultiEdit` hook that refuses an agent edit
  touching the front-matter block of `ai-agents/tasks/**/brief.md` or `sprints/**/sprint.md`. It makes
  aiboard-lead's non-negotiable ("agents stop hand-editing front matter") a check rather than a request.
  `mv` via Bash stays a hole.

### 5.3 Ids and paths — keep `0404-slug` (aiboard's option B)

[AL] offers two options: **A** re-key to `T-0404`; **B** a board-level id pattern so `0404-slug` works.

Measured inbound references [M]: **1,281** markdown links into `tasks/<board>/NNNN…` from inside
`ai-agents/tasks` and `ai-agents/sprints`; **51** from the knowledge base; **378** task-path mentions in
the wiki vault; **292** links to sprint-board files.

- **Option A** renames all 415 folders → ~1,700 task links break, including inside ADRs (records we do not
  edit) and the vault (only `fkit-wiki` may edit). `reference-integrity.test.js` goes red across the tree.
- **Option B** keeps every task path (only a task entering `in-progress/` moves — as closes already move
  them today). Honors ADR-029 as written.
- Sprint-board links (292) break **either way** — boards become `sprints/<status>/S-NNN-slug/sprint.md`.
  The converter repoints the ones in files it owns (tasks, sprints); the knowledge base and vault need a
  decision (Q3).

**Recommendation: B.** Cost: aiboard builds R2, after T-023.

### 5.4 Attribution — human vs agent

| Door | Recorded as | What it proves |
|---|---|---|
| MCP, hook-checked | `closed_by: fkit-producer`, `channel: mcp` | That fkit's hook saw that role make the call. Not a human fact. |
| CLI | `closed_by: <--by>`, `channel: cli` | Nothing beyond the string. |
| Owner door | `closed_by: owner`, `channel: owner-door`, `close: owner-verified` | **Only that it arrived through the owner's door** [AL]. See §6.3. |

---

## 6. The hard parts

### 6.1 The converter — one tool, every project

**Shape.** A fkit-shipped command (e.g. `fkit migrate-board`), ⛔ **with the rule the board reader already
follows: tools come from fkit's current install, data from the target** (`bin/fkit-board.mjs:33-37`). So it
reuses today's identity resolution (`dashboard.sh select-active`, ADR-040/041), which already copes with
`sprint-N.md`, `plan-sprint-N.md` (task `0415`), `sprint-backlog.md` as a backlog board (ADR-041), and the
legacy `🔒 CLOSED` banner (read-forever rung). ⭐ The variety E3 recorded does not go away — it moves into
the converter, once per project (evidence log E3, "not toward B").

**Stages:**

1. **Preflight — refuse unless:** git tree clean; no ship loop running; aiboard present at the pinned
   version; the project not already converted (`aiboard.json` carries `fkit_migration: {from_commit,
   converter_version}`).
2. **Inventory** every task folder, board, row, banner, extra file; hash every file.
3. **Plan (dry run — writes nothing in the project):** emit a report the owner reads: per task → target
   folder, front matter, sprint, rank, assignee, close record; per board → sprint id, status, body;
   every **refusal**; totals. Build the converted tree **in a temp directory** and diff it.
4. **Refuse on ambiguity — never guess.** Examples already known in fkit [M/expert verdict]: `0014`
   (brief says Backlog, folder says done), `0004` (no live board row), a task with >1 live row, two boards
   resolving to one sprint identity, a malformed banner, a status value outside the vocabulary. The
   owner fixes these **in fkit's format first**, then re-runs.
5. **Apply — two commits' worth of changes, neither committed by an agent:** (a) **moves only** (`git mv`
   of sprint boards into their new homes and of in-progress tasks), so git's rename detection keeps
   `git log --follow`; (b) **content** (front matter in, header sections out, legacy notes written).
6. **Verify — the acceptance bar (ADR-051 A1/A2's descendant, and `0407`'s idea):** every brief body
   byte-identical except the five extracted sections; every extra file hash-identical; every task's
   status/sprint/rank/assignee/close equal to what fkit's own tools derived *before*; `aiboard check`
   clean; `reference-integrity` green; a **write round-trip** (move a scratch task and back) proves R1.
7. **The owner commits** (CLAUDE.md hard rule). ⭐ **Rollback = revert that commit**, and it is clean
   **until the first post-cutover write**. After that, forward-fix only — say so in the plan report.

**Idempotency:** re-running on a converted project is a no-op that says so; re-running a dry run on an
unchanged tree gives a byte-identical plan (deterministic ordering, `LC_ALL=C`, ADR-041's rule).

⚠️ **Why the paranoia is earned [AL, M]:** fkit's last bulk migration (`331f298`, ADR-029's folder move)
wrote the wrong status into 3 of ~80 done briefs and nobody noticed for two months.

### 6.2 What the converter does to each piece

| fkit piece | Converted to | Fidelity |
|---|---|---|
| `## ID / ## Sprint / ## Priority / ## Status / ## Owner` sections | Front matter (`id`, `sprint`, `rank`, status = folder, `assignee` = role, close record). **Removed from the body** — keeping them would re-create a second carrier (the owner's no-duplication principle). | Lossless (values move) |
| `✅ Done (agent-closed — not owner-verified)` / plain `✅ Done` / `✅ Done — <trailing prose>` (3 briefs) | `close: agent` / `close: owner-verified` + `channel: legacy`; trailing prose kept as a line in the body | Lossless if R5 exists |
| `🚧 Blocked — <reason>` | Blocked-reason field (R4) | Needs R4 |
| `⛔ Cancelled (date) — reason` | status `cancelled` + reason in the close record | Needs R5 |
| Board rows' Task-cell text (83% of row bytes are prose — owner rulings, corrections, figures) | **Verbatim** into `legacy-board-notes.md` in that task's folder, with source board, line and hash (Codex's proposal, 2026-09-18 report §8) | Lossless, relocated |
| Board prose outside the table (`READ THIS FIRST`, authority, banners' trailing prose) | The sprint's body, verbatim, above the fenced `## Tasks` | Lossless if R8 fence exists |
| `➡️ Moved` rows (113) | Dropped from live data; kept in `legacy-board-notes.md` and the frozen board archive | Live view loses move history |
| Closed-sprint rank (append-only history, `closed-rank-immutability.test.js`) | `rank` at close time, frozen by convention only | ⚠️ Weaker — aiboard rank is mutable |
| Prose `Depends on:` / `Blocks:` | **Left as prose.** `blocked_by` empty at conversion (negated ids make parsing unsafe). New work uses `blocked_by`. Optionally the dry run *proposes* edges for **open** tasks for the owner to accept. | Structured deps start empty |
| Prose `worklog.md` | `worklog-legacy.md` verbatim; new aiboard `worklog.md` with a pointer entry | Lossless, renamed |
| Old board files | **Frozen archive** (Q3), marked "not a store, read by no tool" | Lossless |

### 6.3 "Count them as mine" versus ADR-049 — the honest statement

ADR-049 D1 (accepted 2026-09-18): *"fkit never infers verification from the channel."* The 2026-09-30
option text **does exactly that**, deliberately: an owner-door write becomes an owner-verified close.

- **What it is:** a **channel label** — "this arrived through the owner's door" [AL].
- **What it is not:** proof it was him. Agents run as the same OS user with unrestricted tools (ADR-022);
  any agent can `curl` the port. A per-launch token in the page does not help — an agent can read the
  page too (ADR-049 §C3).
- **Why it is still better than today:** today there is no owner channel at all for a board write, and
  owner-verified closes happen only in a producer session with him present — which is equally a
  convention. The owner door adds a **recorded channel** per write, and aiboard-lead's T-022 fix closes the
  one outside attacker who had no Bash (ADR-049 D4 — **still a precondition**).
- **What keeps it honest:** the rule "agents never use HTTP" (universal rules), the close record showing
  `channel`, and the git commit still being the human checkpoint (ADR-049 D2, unchanged).
- ⚠️ **The web page also bypasses fkit's other gates, by design:** the owner can close a sprint with open
  tasks in it (fkit's sprint mover would first relocate them), create a task with no brief template, or
  edit rank. That is his right under the ruling; the consequence is that `fkit-status` must **report**
  such states rather than assume the movers produced them (Q9).

### 6.4 Projects of three shapes

| Project | What is special | Converter behaviour |
|---|---|---|
| **fkit itself** (415 tasks, 11 boards, 2.18 MB of boards, `backlog.md` ~860 KB) | Longest prose; ADR corpus linking into tasks/sprints | Pilot — converts first ("we can test it on fkit") |
| **A sibling with older conventions** (per evidence log E3: `plan-sprint-N.md`, pre-vocabulary banners, a stale install at v0.2.2) | Old names, old banners, maybe no id prefixes if pre-ADR-029 | Requires `fkit update` first so current tools read it (`--root` rule); refusals list what the owner must fix |
| **A small project** (a handful of tasks) | Little data, maybe no sprints | Same tool; trivial plan |

**Mid-sprint:** allowed — `In progress` sprints (plural) map to aiboard's `in-progress/`; tasks with
`🔄` go to `tasks/in-progress/`. **Recommended** (not required): convert between tasks, with no ship loop
running, and restart every open session afterwards (new skills, new MCP registration).

### 6.5 Grep-ability and offline use

Mostly **kept**: aiboard is file-based, so tasks stay markdown in git; status is still the folder;
`grep -r "sprint: S-011" ai-agents/tasks` finds a sprint's tasks. **Lost:** one file that *is* the sprint
table (derived now, and the fenced `## Tasks` list is a regenerated view), and the in-body `## Status`
line a reader of a lone brief used to see.

### 6.6 ⚠️ The version coupling the owner may not see

fkit installs **once per machine** (`~/.local/share/fkit`, `install.sh`). The fkit release whose skills
talk to aiboard **cannot read an unconverted project** — and there is no dual mode (no duplication, by
ruling). So **the moment that release is installed, every fkit project on the machine is unreadable to
its agents until converted.** Plus aiboard's own releases: an aiboard format change forces `aiboard
migrate` in every project too.

**Mitigation (design):** the launcher detects an unconverted tree and, instead of opening a role session
with broken skills, offers the converter's dry run; the owner can also stay on the previous fkit version
for that project (`FKIT_REF` exists for install) until he converts it. → Q6.

---

## 7. Phasing — with rough relative sizes

aiboard-lead's own order [AL]: (1) Python fixes T-023, T-022, T-021, derived sprint membership, fenced
`## Tasks`; (2) freeze the format; (3) Node rewrite gated on ported tests + a golden corpus (fkit's 408
briefs); (4) version/capabilities + owner door; (5) fkit-driven fields (id pattern, doc tabs, close
field, parent); (6) converter dry runs; (7) cutover.

fkit's phases, mapped against it (**fkit sizes only**; aiboard's are aiboard-lead's to give):

| Phase | What | Size | Needs from aiboard | Parallel with the rewrite? |
|---|---|---|---|---|
| **F0** | The new ADR (§8), owner-signed | S | — | ✅ now |
| **F1** | Hand `aiboard-lead` the requirements list (§4), agree the JSON/MCP contract fkit will code against | S | its answers | ✅ now |
| **F2** | **Converter, dry-run only** (inventory, mapping, refusals, plan report, temp-dir build + diff) against fkit + a sibling + a small project. Writes nothing in any project. | **L** | the **frozen format** (aiboard step 2) — can start against the spec before it | ✅ from aiboard step 2 |
| **F3** | Spikes: MCP hook payload (`agent_type`, `tool_input`, spawned-agent signal, subagents see MCP tools); MCP schema context cost | S | any aiboard with MCP (Python is fine) | ✅ now |
| **F4** | Thin movers, `fkit-task-brief`, ship loops, review/worklog paths; the MCP hook + front-matter hook | **L** | R5, R16, R2 (aiboard step 5) | Design ✅ now; build ⛔ after step 5 |
| **F5** | `fkit-status` / `dashboard.sh` / throughput over aiboard JSON | **L** | frozen JSON + `info` (step 4) | ⛔ after step 4 |
| **F6** | Install/launcher: pinned dependency, capability check, MCP registration, unconverted-tree detection | M | R18 (step 4) | ⛔ after step 4 |
| **F7** | Tests: converter fixtures, new hook tests, retire/rewrite §3.7 | M | — | alongside F2/F4/F5 |
| **F8** | Conventions, scaffold, universal rules (budget), agent prompts, structure spec, `tasks/README.md` | M | — | after F4's shape is settled |
| **F9** | **Pilot: convert fkit itself**, owner reads the dry run, owner commits; run real sprints on it | M | aiboard steps 1–5 done, Node release | ⛔ last |
| **F10** | Sibling project, then small project; retire the reader (`fkit-board.mjs`, `board-narrow.mjs`, their tests) | S each | — | after F9 |

**Rough total for fkit:** comparable to or larger than aiboard's rewrite — about **4 L + 4 M + a few S**.
**What can run now, in parallel:** F0, F1, F3, the **design** of F4, and F2 as soon as aiboard freezes its
format.

---

## 8. What the new ADR must say (list only — not written here)

1. **Supersedes ADR-051's gate**: the trial (4 weeks, work floor, ≥40 transitions), F1–F5, Amendments
   1, 3, 5, 6, 8, 9, 10 and the no-timeout guard — **dropped by the owner, 2026-09-30**, with his words.
   ADR-051 D1 (**one store, never duplicate**) is **reaffirmed**, not superseded.
2. **States which of P1–P6, A1–A2 and D5 survive** (Q2) — recommended: all of P1–P4 and P6, A1–A2 (as
   the converter's acceptance bar), P5 (durability), and D5 (dry run the owner reads before any project
   is migrated).
3. **aiboard is a required, pinned dependency**; the Node rewrite is a precondition of cutover; fkit
   files no aiboard tasks (D7 unchanged).
4. **Doors:** agents → MCP; scripts → CLI; HTTP → owner only. Hand edits of front matter forbidden.
5. **Amends ADR-049 D1/D3:** an owner-door write is recorded as owner-verified — **a channel label, not
   proof**, with the reasons of §6.3 written in; D2 (commit is the human checkpoint) and D4 (T-022 before
   any write) unchanged.
6. **Amends ADR-033:** enforcement adds the MCP hook; producer-only unchanged in substance; "The limit"
   (extra-hop laundering, Bash bypass) inherited.
7. **Discharges ADR-050's build** (aiboard's API is the command); D2/B-1 carries over. Names `0407`,
   `0408`, `0135` as the producer's to re-scope or cancel.
8. **Amends ADR-029:** the folder remains the task; ids keep the `NNNN` form via aiboard's pattern (if
   Q1 = keep); `in-progress/` is a fourth board; allocation delegated to aiboard.
9. **Retires ADR-041/047's banner grammar for live boards** (sprint status = aiboard folder); plural
   active sprints kept.
10. **The converter's contract** (§6.1) and the rollback window.
11. **Re-raise only if:** aiboard cannot meet R1/R2/R5/R16; the converter cannot reach a clean
    import-and-diff on fkit's own corpus; the pinned-version coupling proves unworkable across projects.

---

## 9. Benefits, drawbacks, risks

### Benefits
- **The owner's principle holds:** one store; duplication impossible by construction (ADR-051 Ruling 2).
- **A board he can read and act on** — already found "very useful" on a heavy sibling project (E3).
- **History for free:** timed, signed status lines and worklog entries (E1, E2).
- **Drift classes disappear**: brief-vs-row-vs-folder disagreement, half-landed closes (ADR-048), the
  multi-file "transaction" (ADR-050) — because there is one carrier.
- **Less prose to execute:** ~1,814 lines of mover procedure shrink to judgement + a call; smaller skills
  also suffer less from the post-compaction cut (2026-09-27 §1.3).
- **Structured dependencies and atomic task claiming** going forward.
- **Enforcement at the write** via the MCP hook — stronger than today's `Skill`-only gate.

### Drawbacks and risks (highest first)

| # | Risk | Why it matters | Mitigation |
|---|---|---|---|
| 1 | **Converter corrupts or drops data** | 415 tasks, 2 MB of board prose, three convention generations; precedent `331f298` | Dry run, refuse-on-ambiguity, byte-level import-and-diff, one revertible commit, owner reads plan |
| 2 | **Two-project coupling + one-install-per-machine** | An fkit release forces every project to convert; an aiboard format change forces `migrate` everywhere; fkit can't ship until aiboard does | Exact pin, capability check, launcher detects unconverted trees, per-project version pin (Q6) |
| 3 | **"Owner-verified" is a label** | Agents can reach the owner port; a forged owner close is possible and, with **no undo**, harder to repair | Record channel; "agents never HTTP" rule; commit stays the checkpoint; state it in the ADR |
| 4 | **Web page bypasses fkit's gates** | Owner can close sprints with open tasks, create template-less tasks | aiboard warns/refuses sprint-done with open tasks (Q9); `fkit-status` reports it |
| 5 | **Fidelity loss** | Move history, blocked reasons, closed-rank immutability, in-body status | Legacy notes + frozen archive; R4/R5 fields |
| 6 | **Skill/prompt churn** | ~30 files, every consuming project's `.claude/` refreshes; the rules block has a size budget | Phase it; F8 last; budget test |
| 7 | **Concurrency bugs in aiboard** | Unserialised web writes (R15); several MCP processes per machine; Node lockfile semantics (flock → O_EXCL) [AL] | R15 fixed and tested before cutover |
| 8 | **Hook assumptions unverified** | MCP payload fields, subagent MCP access, "spawned?" signal | F3 spike before F4 |
| 9 | **Still no undo, still not transactional** | ADR-051 §Context 3; sprint-close moves N tasks in N calls | P5 durability kept (Q2); a batch sprint-close op is a nice-to-have |
| 10 | **Performance/usability at scale** | 415 tasks; no search in the page | T-021 index (6.8× [AL]); R22 |
| 11 | **Git diffs change shape** | Folder renames on start, rank rewrites [AL] | Accept; worklog lines replace some diff-reading |
| 12 | **Prior evidence gets orphaned** | ADR-051's evidence log (E1–E3) and the interim reader stop being the point | The new ADR cites them as the evidence that led here; the log is closed, not deleted |

---

## 10. Open questions for the owner — each with a recommended answer

| # | Question (plain) | Recommended answer |
|---|---|---|
| **Q1** | Keep task folder names like `0404-some-task` (aiboard learns fkit's id format), or rename everything to `T-0404`? | **Keep.** ~1,700 links keep working and ADR-029 stays true. Cost: aiboard builds an id-pattern setting after T-023. |
| **Q2** | You dropped the trial. Do the other gate items stay — aiboard's fixes (T-021/022/023, one sprint-membership record), the full import-and-diff test, "commit at the end of every session", and "a dry run you read before any migration"? | **Keep all of them; drop only the trial and its five fail checks.** They are cheap and they are what protects the data. |
| **Q3** | After conversion, what happens to the old sprint-board files? | **Keep them in a frozen folder that no tool reads**, plus each row's text copied into its task folder. Deleting them leaves only git history. |
| **Q4** | Today a close in a producer session with you present counts as owner-verified. Keep that as a second route, or make the web page the only one? | **Keep both**, with the channel recorded, so you can always see which one it was. |
| **Q5** | Agents use aiboard through MCP tools (fkit can check them) rather than shell commands? | **Yes — MCP for agents, CLI for fkit's scripts, the web page only for you.** |
| **Q6** | fkit is installed once per machine. When the aiboard-based fkit ships, what about projects not yet converted? | **The launcher detects them and offers the dry run instead of opening a broken session; you may keep a project on the old fkit version until you convert it.** |
| **Q7** | Pilot order? | **fkit first** (your "test it on fkit"), then the sibling project, then the small one. |
| **Q8** | Add a hook that stops agents hand-editing task/sprint front matter? | **Yes.** Small, and it turns aiboard-lead's non-negotiable into a check. |
| **Q9** | If you close a sprint in the page while tasks are still open in it, should aiboard refuse (unless forced) or just do it? | **Refuse unless forced**, and fkit's status reports any sprint closed with open tasks. |
| **Q10** | The coders' old free-text worklogs clash with aiboard's timed worklog. Rename the old ones to `worklog-legacy.md`? | **Yes**, word-for-word; new entries go through aiboard with time and author. |
| **Q11** | Turn the prose "Depends on" lines into structured links during conversion? | **No** — the prose contains negated ids ("0128 does **not** depend on…"). Keep the prose; use structured links for new work; optionally review proposed links for open tasks only. |
| **Q12** | aiboard has severities (low…critical). fkit only has order. Use them? | **Leave them at the default**; order is `rank`. `critical` stays available to you for drop-everything work. |

---

## 11. What was written, and what was not

- **Written:** this file only.
- **Not written:** no ADR, no brief, no skill/agent/hook edit, no aiboard file, no wiki page. No commit.
- **Wiki:** once the decision is taken, `fkit-wiki` should ingest the new ADR (and this report as its
  evidence); an architect never writes the vault (ADR-005).
- **Related:** [ADR-051](../decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md) ·
  [ADR-049](../decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md) ·
  [ADR-050](../decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed.md) ·
  [ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md) ·
  [ADR-029](../decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) ·
  [ADR-041](../decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md) ·
  [ADR-047](../decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md) ·
  [ADR-048](../decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md) ·
  [evidence log](2026-09-26-evidence-log-for-adr-051-aiboard-as-the-store.md) ·
  [data-model evaluation](2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md) ·
  [expert verdict](2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md) ·
  [Sprint 11 board](../../sprints/done/sprint-11.md)
