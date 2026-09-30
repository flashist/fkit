# ADR-052: aiboard merges into fkit as its built-in board — the single store for tasks and sprints

**Date**: 2026-09-30
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md`
**Evidence (source of record)**: `ai-agents/knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md` — the decision document the owner approved. ⛔ Where the two differ, **the ADR wins** and the difference is a defect to raise.

> ⭐ **Ingested 2026-09-30** (sync `a351cb6`→`3915417`), the same day the ADR was accepted and committed.
>
> ⛔⛔ **ACCEPTED IS NOT A WORK ORDER — NOTHING HERE IS BUILT.** Approval authorised only the ADR, the
> phase briefs, and five task re-scopes. **No phase, no code, no conversion has started.** There is no
> `board/` directory and no `fkit board` command in the repo today. Read every "the board does X" below
> as "the board, once built, must do X".
>
> ⭐ **Two effective dates.** Some changes hold **from 2026-09-30** (the trial is gone; aiboard is no longer
> a separate project; five tasks re-scoped). Others hold **only in a project once it is converted** (the
> page-only owner-verified rule; the end of the line-3 banner grammar; the end of the read-only reader).
> ⛔ **Until converted, a project runs on today's rules — fkit itself included, until phase 6.**

## Context
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]]
  (2026-09-18) decided: **if** fkit ever depends on aiboard, aiboard is the **single** store (D1); aiboard
  stays a **separate project** fkit never files work for (D7); fkit moves only after a long gate
  (P1–P6, A1–A2, a 4-week + 2-sprint + 40-transition trial with no timeout, fail conditions F1–F5);
  meanwhile a **read-only reader** runs (D2).
- On 2026-09-30 the owner decided **faster than the trial** and chose to **end aiboard as a separate
  project**. His own words (R2): *"we should do the rewrite, the 4-weeks trial is not needed anymore (I
  was able to make the decision faster). Though we can test it on fkit if needed."* And (R7): *"I am
  thinking about dropping the idea of developing aiboard as a seaprate project and to merge it into fkit
  completely, would it make it easier/simpler/better?"* — then selected *"No, fkit only → full merge …
  Simplest overall."*
- ⭐ **The reason is unchanged from ADR-051** — his own words of 2026-09-18: *"We never should duplicate
  them. [...] I want to avoid situations where the duplication is even possible"*. The merge is its
  fulfilment.
- Four reports written earlier on 2026-09-30 were folded into the decision document and each carries a
  dated *superseded* note (kept as evidence): the single-store evaluation, the `0404`-vs-`T-0404` id
  evaluation, the CLI-door enforcement addendum, and the fkit↔aiboard version-lock design (all under
  `ai-agents/knowledge-base/reports/2026-09-30-*`).
- Measured facts the design rests on: `install.sh` ships only `claude/`; Node is used today by one
  **fail-open** hook (`claude/carry-check-hook.sh`); the four close skills are **1,814 lines** of prose
  (460 + 422 + 456 + 476); the read-only reader already follows *tools from fkit, data from the project*
  (`bin/fkit-board.mjs`); fkit's last bulk move (commit `331f298`, 184 files) wrote the wrong status into
  3 of ~80 done briefs, unnoticed for two months — **the reason the converter must be paranoid**;
  aiboard's `T-023` turns `0013` into `13` on write, still live until phase 1.

**How the rulings were given.** Live via `AskUserQuestion` in `fkit lead` sessions, relayed by
`fkit-lead`. The ADR keeps the owner's **own words** apart from **option text he selected**, and the
drafting architect heard neither first-hand (ADR-021). Key rulings: **A1** approve (selected);
**A2** the sprint's task list is *shown, not stored* (selected); **A3** default priority for converted
tasks — ⏸ **not ruled**, `medium` is only a proposal confirmed at the converter's trial run; **R1–R12**
(direction); **Q1–Q16** (detail). Two were ruled **against the architect's recommendation**: **Q3**
(a producer close with the owner present is **not** owner-verified — only the page is) and **Q7** (keep
all four priority levels, not just `critical`).

## Decision
- **D1 — The merge.** aiboard stops being a separate project. It is **rewritten in Node** and moved into
  fkit as a separate module, **`board/`**, reached through **one command, `fkit board`**, and a **web
  page**. It becomes the **single and only store** for every fkit project's tasks and sprints — still
  **plain markdown files in each project's git repo** under `ai-agents/`. The aiboard repo is **archived
  read-only after the fkit pilot**, not deleted. **No new role** — the board is a program, not an agent;
  the team stays seven. Module boundary: the rest of fkit talks to it **only** through `fkit board …`
  and its `--json` output. **Zero dependencies.**
- **D2 — One store, reaffirmed.** Sprint membership lives on **one side only — the task's `sprint`
  field**. `sprint.md` holds goal, dates and prose; the sprint's task list is **shown** (page,
  `fkit board sprint show`), **never written** into the file. ⭐ The no-duplication principle beats the
  porting rule here, by the owner's ruling.
- **D3 — The porting rule.** **R11** (his own words): *"if some features exist in ai board, but not used
  in fkit yet, it doesn't mean that we should drop the feature, we should port the ai board features into
  fkit."* **Three exceptions (R12), dropped as redundant, not lost:** pip/pipx packaging; board discovery
  and the `aiboard.json` pointer; `agents-md` instruction blocks. **Form changes are not drops** (`T-001`
  → `0404`; `S-011` → `sprint-11`; stored sprint list → shown). **After v1 (phase 9):** the MCP server,
  `T-020` comment resolution, `T-007` live reload. **Epics:** aiboard has none — none for now.
- **D4 — The store.** A task is a folder; **status = which folder it is in** (`backlog/`, `in-progress/`,
  `done/`, `cancelled/`). **Ids stay four digits, `0404`, unchanged** (next = highest ever + 1,
  cancelled included; forgiving lookups ported). `blocked_by` **and** a free-text `blocked_reason`.
  Priorities **low / medium / high / critical** (`urgent` → critical) **alongside** `rank`. Every close
  stores a **close record**: who (`--by`), **which door** (command / page / converter / later MCP — **set
  by the board, never by the caller**), kind, when, reason. Sprints are folders
  `sprints/<status>/sprint-11/sprint.md`; **the backlog is tasks with no sprint, not a sprint**. Task
  folders gain a board-owned `worklog.md` (every entry timed and signed) and `comments.md`; `plan.md`,
  `review.md`, `assets/` stay ordinary files. Settings in `ai-agents/board.json`.
- **D5 — The rules live in the store**, in five layers: **(1) store rules** — refuse a close / cancel /
  reopen through the command unless `--by` is the producer, a close with no record, a cancel with no
  reason, a sprint close that strands open tasks, starting a blocked task, and any write to a data format
  it was not built for; **owner-verified if and only if the door is the page**. **(2) identity hook** — a
  `PreToolUse` hook on the terminal tool: a `fkit board` write's `--by` must equal the calling agent's
  real role; unreadable forms (`sh -c`, `eval`, variables) refused; `fkit board serve` refused for
  agents. **(3) skill lock** — close skills stay producer-only, unchanged. **(4) detection** —
  `fkit board check` flags a closed task with no close record, shown by `fkit-status`. **(5) hand-move
  tripwire** — **not built** (R8); task `0416`, low priority, revisit after about a month of use.
  ⚠️ **The honest limit is inherited from ADR-033:** a rule-following agent cannot close, cannot sign as
  someone else, and cannot produce an owner-verified close; **an agent trying to get around the rules
  can — most simply by moving a folder by hand** — and is caught afterwards by layer 4. *Who does what,
  never prevention.*
- **D6 — The owner door.** The owner starts the page with `fkit board`; agents may not. One-time key;
  site, host and content-type checked on **every write** (aiboard's `T-022` closed from day one).
  ⛔ It **cannot** stop an agent running as the owner on his machine from using the page, so
  **owner-verified is a label, not proof** (R3). **The git commit stays the real human checkpoint**
  (ADR-049 D2, unchanged). ⛔ **Until the fkit pilot, no writable `aiboard serve` on real project data —
  the read-only reader only** (Q16).
- **D7 — Install and versions.** **Node becomes a hard requirement**; `install.sh` ships `board/` next to
  `claude/`. fkit and the board ship together, so **no version-pinning design is needed**. Each project
  records a **data-format number** in `ai-agents/board.json`, checked at launch: same → proceed; older or
  no `board.json` (an unconverted markdown project) → fkit offers the conversion, **trial run first**;
  **declined → the session opens on the previous fkit**; newer → refused, run `fkit update`. The
  installer **keeps the previous fkit until every project is converted**.
- **D8 — The converter's contract.** One shipped command, for every fkit project, reading old projects
  with fkit's **current** tools. It **refuses to start** unless the tree is clean, no ship loop runs, and
  the project is not already converted; runs a **trial run first** (writes nothing, produces a report the
  owner reads); **refuses anything ambiguous and never guesses** (e.g. `0014`, `0004`); **changes no
  meaning** — brief text byte-for-byte (only `## ID`, `## Sprint`, `## Priority`, `## Status`, `## Owner`
  move into front matter), each old board row word-for-word into the task's `legacy-board-notes.md`, old
  boards frozen unchanged in `ai-agents/legacy-boards/` (read by no tool), free-text `worklog.md` →
  `worklog-legacy.md`, prose *Depends on* kept as text, **past closes keep what they said** (door =
  `legacy`); moves folders first, then content, so git sees renames; **checks itself** (byte-identical
  briefs apart from the moved headers, hash-identical other files, same status/sprint/order/owner/close as
  the current tools read, `fkit board check` clean, `reference-integrity` green, a `0013` write
  round-trip). **The owner commits.** Undo = revert that commit — clean **only until the first change
  after conversion**.
- **D9 — The phases. ⛔ Each starts only on the owner's word.** A gate is what must be true before the
  next phase may be **put to him** — not what starts it.

  | # | Phase | Gate |
  |---|---|---|
  | 0 | This ADR; phase briefs filed; `0407`/`0408`/`0135`/`0413`/`0405` re-scoped or cancelled | Owner approves — **done 2026-09-30** |
  | 1 | Fix **only `T-023`** in the Python aiboard (`aiboard-lead`'s last task) — Python becomes a correct reference | Python round-trips the corpus unchanged |
  | 2 | **Port to Node into `board/`** — aiboard's **52 non-MCP tests first**; `T-021`, `T-022` built in; correct locking | Ported tests green; output identical to the Python reference on the corpus |
  | 3 | **Make it fkit's board** — `0404` ids, fkit statuses, close record + store rules, priorities + rank, task-side membership, `sprint close --carry-to`, owner door, `board.json`, `fkit board` | Tests green; a **copy** of fkit's corpus runs clean |
  | 4 | **Converter — trial runs only**, on every project; nothing changed | Owner reads fkit's report; default priority confirmed |
  | 5 | **Wire fkit to the board** — skills, status, ship loops, hooks, launcher, installer, structure check, rules, tests (the largest phase) | Full suite green; rules block within budget |
  | 6 | **Pilot: convert fkit**; real sprints on it | The owner says it works |
  | 7 | Other projects one at a time: geoconflict → pubquiz → the rest | Owner reads each trial run |
  | 8 | Archive aiboard; **retire the read-only reader** (`bin/fkit-board.mjs`, `bin/board-narrow.mjs`, their tests) | Phase 6 passed |
  | 9 | After v1: MCP (with its 10 tests), `T-020`, `T-007` | Phase 6 passed |

  ✅ **Test-count correction, owner-ruled 2026-09-30:** aiboard has **62** tests = 46 board + 6 server +
  10 MCP. **Phase 2 ports 52; the 10 MCP tests go with phase 9** (task `0468`). The ADR first said 62.
- **D10 — ADR-051's kept conditions become phase gates.** P1 (Node port) → phase 2; P2 (`T-023`) →
  phase 1; P3/P4 (`T-021`/`T-022`) → phase 2; P6 (one-sided membership) → phase 3; A1/A2 → the converter's
  acceptance bar; D5 (trial run the owner reads) → phases 4, 6, 7. ⭐ **P5 still stands** — durability is
  the owner committing the tree at the end of every working session; the board has no undo and git is the
  safety net. P1's clause *"the store-adapter seam present"* **lapses** with the merge (owner-confirmed).
- **D11 — Existing tasks.** `0408` (deterministic mover command) **obsolete** — `fkit board` is that
  command. `0407` (mover outcome verifier) → re-scope into the converter's checker, or cancel. `0135`
  (reconcile mode) **obsolete** — a close cannot half-land with one place for status. `0413` (reader
  cache) **obsolete** — the reader retires. `0405` (terminal view) → re-scope over `fkit board --json`, or
  cancel. `0416` (tripwire) stays in the backlog, low priority. Executed the same day — see
  [[tasks/the-2026-09-30-adr-052-task-dispositions]].

### Effect on existing ADRs
**"On acceptance"** = from 2026-09-30. **"At conversion"** = only in a converted project.

| ADR | Change | When |
|---|---|---|
| [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] | **D1 reaffirmed.** Superseded: the trial, F1–F5, the work floor, the no-timeout guard (Amendments 1, 3, 5, 6, 8, 9, 10), **D7** and every separate-project assumption. Kept as phase gates: P1–P6, A1–A2, D5. D4 carries into "each phase on his word". P5 stands. Evidence log **closed, not deleted**. D6, D8, Amendment 7 lapse (owner-confirmed) | On acceptance |
| same | **D2** (read-only reader as interim) ends per project; the reader retires at phase 8 | At conversion |
| [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] | **C4** dropped; **D7** superseded (fkit owns the mechanism); **D8** discharged; **D4** satisfied by building `T-022`'s fix into phase 2; **D2 unchanged** | On acceptance |
| same | **D1/D3 amended** — owner-verified **only** for writes through the page, a label not proof; every other close agent-closed, recorded as a board-set field. **D5** ends per project | At conversion |
| [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] | Decisions 1–4 kept, now store-enforced. **§5 superseded** — a producer close with the owner present is **no longer** owner-verified | At conversion (§5) |
| [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] | The deterministic command **is `fkit board`**; its authorised build is discharged. **B-1 unchanged.** B-2's rejection overtaken **only** for the `--by` identity check | On acceptance |
| [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] | Still a folder with a permanent four-digit id; `in-progress/` becomes a fourth status folder; `## ID` moves into front matter; the cross-branch race unchanged and still accepted | At conversion |
| [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] · [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] · [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]] | The line-3 banner grammar retires; a sprint's status is its folder; several active sprints stay legal; the backlog is not a sprint. ⭐ **Still in force in unconverted projects, and still how the converter reads them** | At conversion |
| [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]] | **Obsolete** with `0135`. ⚠️ Unconverted projects' closes are still prose and can still half-land; nothing is built for that window | On acceptance |
| [[decisions/adr-014-how-fkit-tests-itself]] | Test scope grows to the board's tests (52 in phase 2, 10 MCP in phase 9) and converter fixtures; **zero dependencies kept** | From phase 2 |

**Unchanged, stated so nobody assumes otherwise:** ADR-005 (only `fkit-wiki` writes the wiki), ADR-022
(tool access), ADR-018 (the skill lock), and the never-commit-unprompted rule. Dated pointer notices were
**inserted** (nothing deleted) into ADR-051, 049, 033, 050 and 048 — the five with a decision overturned;
029, 040, 041, 047 and 014 carry no notice.

## Consequences
**Positive:** one store, duplication impossible by construction; the rules live where the write happens
(page, command, later MCP obey the same code); owner-verified means one clear thing; every status change
and log entry timed and signed; status disagreement between brief / board / folder, half-landed closes,
and the 1,814 lines of prose close procedure all go away; skills get thinner; nothing of aiboard is
thrown away.

**Negative / costs:** aiboard as a tool of its own is given up (ADR-049 C4); spinning the board back out
later is a rewrite; **fkit becomes a small web application** writing to the repo as the owner, so keeping
`T-022`'s class closed is fkit's job for good; **Node becomes a hard requirement**; more code to own;
the previous fkit stays on the machine until every project is converted; **the owner-present producer
close loses owner-verified status** (Q3, against the architect's recommendation).

**Risks, highest first:** (1) the converter damages or drops data (the `331f298` precedent); (2) three big
changes at once — kept apart as separate gated phases; (3) the Node port behaves differently
(front-matter parsing, emoji length, locking); (4) "owner-verified" can be faked by an agent using the
page — accepted as a label; (5) hand folder moves bypass the rules — detection, tripwire later; (6) two
writers at once — aiboard's server does not keep simultaneous web writes in order today; (7) `T-022` live
in any writable `aiboard serve` meanwhile; (8) module-boundary erosion; (9) churn across ~30 fkit files
against the size-capped rules block; (10) a second door (MCP) later; (11) fidelity changes (move history
leaves the live view); (12) still no undo — git (P5) is the safety net.

### Gotchas
- ⛔ **The owner's standing rule (his own words, 2026-09-27):** *"if we already have a brief for that task,
  the task shouldn't start, until I specifically approve it (because it might change the way fkit work in
  general)."* **No agent may start a phase, declare a gate passed, or treat one phase's approval as
  another's.** Every phase brief (`0417`–`0471`, plus re-scoped `0407`) is filed *"⛔ Do not start without
  the owner's specific word."*
- ⛔ **Phase 1 has no fkit brief.** It is `aiboard-lead`'s last task, in aiboard's repo; the fkit briefs
  start at phase 2 (`0417`) and record phase 1 as an **external precondition**.
- ⛔ **Do NOT re-raise:** the trial (and no agent may re-introduce one, or any timeout / check-in / review
  point, in its place); owner-verified for a producer close with the owner present or from his own
  terminal (Q3, Q15); the four priority levels (Q7); keeping `0404` and one project at a time (R5); CLI
  for everything (R6); the three drops (R12); MCP/`T-020`/`T-007` after v1; storing the sprint's task list
  (A2); building the tripwire now (R8); aiboard as a separate project (R7).
- **Re-raise only if:** the Node port cannot match the Python reference on the corpus; the converter
  cannot reach a clean byte-level diff on fkit's own tree; after the pilot the owner finds the board worse
  than the markdown; a project needs epics (a new feature, not a re-raise); or the owner asks.
- ⚠️ **The wiki is affected later, not now.** The decision document counts **368 task-path citations in
  the vault**, unaffected by ids; a vault re-sync after the pilot is task `0460` (`fkit-wiki`, phase 6).
- ⚠️ **Source-side loose ends, reported not repaired (the vault does not write `knowledge-base/`):** the
  ADR says ADR-051's evidence log is *"closed, not deleted"*, but
  `reports/2026-09-26-evidence-log-for-adr-051-aiboard-as-the-store.md` carries **no closing note** and its
  E3 table still lists `0413` as **Open** while linking the task's `cancelled/` path.

## Related
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — partly superseded; D1 reaffirmed
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — amended
- [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] — its build discharged by `fkit board`
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — §5 superseded at conversion
- [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]] — obsolete
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] · [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] · [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] · [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]] · [[decisions/adr-014-how-fkit-tests-itself]] — amended at conversion / from phase 2
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the convergence sprint this ADR concluded; closed the same day
- [[tasks/the-2026-09-30-adr-052-task-dispositions]] — D11 executed: `0135`/`0408`/`0413` cancelled, `0407` re-scoped, `0405` blocked, `0416` filed
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — the read-only reader, which retires at phase 8
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board, where the 55 phase briefs `0417`–`0471` were filed
- [[systems/fkit]] — the team page; its data-model section describes the markdown store this ADR plans to replace
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam]] — `0404`, the evaluation where the aiboard question started
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[tasks/make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request]] — `0409`; `/fkit-status` is rewritten over `fkit board --json` in phase 5
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[tasks/decide-the-sanctioned-repair-path-for-a-half-landed-close]] — `0134`, whose ADR-048 this makes obsolete
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]] · [[tasks/keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n]] — `0412`/`0415`, the reader fixes whose *tools from fkit, data from the project* rule the converter keeps
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[systems/knowledge-base-structure]] — the status-vocabulary and owner-verified notes this ADR changes at conversion
