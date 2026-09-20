# External expert verdict — fkit ↔ aiboard convergence

**Date:** 2026-09-18
**Author:** `fkit-external-expert` (Claude; same model family as both leads — discount accordingly)
**Verdict on:** [`2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md`](2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md) — 10 points, 12 questions, plus the terminal-UI question added by owner ruling mid-read.
**Read:** the whole report, §8 included. Both repos opened; everything I rely on below I ran or read myself and tag **[X]**. Nothing in either repo was modified; this file is the only thing I wrote.

---

## 0. The verdict in six lines

1. **Do not converge the two storage models. Not now, not staged, not as a goal.** NEITHER model should move toward the other, and Codex's third storage model (`task.json` + `history.ndjson` + ULIDs) should not be built either.
2. **Converge the *view contract* instead.** The two projects already meet at one JSON shape — aiboard's `/api/board` snapshot. A **129-line read-only adapter** puts aiboard's **unmodified** browser board over fkit's **unmodified** 405-task tree, snapshot in **37 ms**. **[X] I built it; it is running; open `http://127.0.0.1:8585/`.**
3. **The real write-side problem is on fkit's side and nobody named it:** fkit's "transaction" is a **460-line prose procedure executed by an LLM**. No lock, hook, queue or shared service can coordinate with that. **Make the movers a deterministic command first**; then browser, TUI and producer all call the same command and Q9/Q11 mostly dissolve.
4. **The identity problem cannot be solved and does not need to be.** Human and agents share one OS uid. Treat `author` as a *claim*. Fix the one real external hole (cross-origin writes). Anchor human verification where a human really is: **the commit**.
5. **fkit's duplicated carriers have not rotted.** [X] Under a stated rule they agree on **403 of 405** tasks. The cost of fkit's model is *write amplification and boards used as a document store* — not drift. Fix that inside fkit, independent of aiboard.
6. **Score:** NEITHER on **10 of 22** (points 1, 3, 5, 9; Q1, Q3, Q5, Q9, Q11, Q12) — mostly one NEITHER repeated: *"this item needs no cross-project decision."* On most of the other 12 I pick the **smallest** offered option and reject the add-ons. A TUI changes none of the 22.

---

## 1. What I verified, and what I did not

### Ran or read myself [X]

| Claim | Result | How |
|---|---|---|
| aiboard's suite passes | **41 tests, OK, 3.25 s**, Python 3.9.6, HEAD `df554b9` | `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests`. First independent execution. Working tree there was already dirty (`T-021` untracked, `S-003` modified) before and after. |
| Snapshot is O(n²) | **True, by code reading.** `snapshot()` → `sprint_progress()` → `get_task()` per member → `_locate()` → full `_scan()` of every status dir + full brief/worklog parse. `snapshot()` then **discards** the loaded tasks (`if k != "tasks"`). | `store.py`, `snapshot` / `sprint_progress` / `_locate`. Fix is ~5 lines: count from the list `list_tasks()` already built. I did **not** re-run the 232/611/2,186 ms benchmark. |
| aiboard has no identity | **True.** `author = str(body.get("author") or "web")`. | `server.py`, `do_POST`. |
| Cross-origin write hole (T-022, from `fkit-lead`'s relay) | **True, by code reading.** `do_POST` checks no `Origin`, `Host`, `Referer` or `Content-Type`; body parsed as JSON regardless → a `text/plain` simple request skips preflight. No `Host` check → DNS-rebinding also open. | same. I did not run an exploit. |
| `move_task` is 4 sequential fs ops under one lock | **True.** | `store.py`, `move_task`. |
| fkit's task mover is prose | **True.** `claude/skills/fkit-task-done/` contains exactly one file, `SKILL.md`, **460 lines**. No script. | `ls`, `wc -l`. |
| fkit corpus now | **405** briefs (0405 was filed today). 271 `done/` · 115 `backlog/` · 19 `cancelled/` folders. Glyphs: ✅ 270 · 🔲 115 · ⛔ 19 · **🚧 1**. | one-pass indexer, below. |

### New measurements — the audits §7b says nobody ran [X]

Counting rules stated, per the report's own discipline. Script: scratchpad `index_fkit.py`, `rows.py` (paths in §8).

| Audit | Result | Rule |
|---|---|---|
| Folder prefix vs `## ID` | **0 mismatches / 405** | `^## ID` + next non-blank line vs 4-digit folder prefix |
| Duplicate ids | **0** | |
| `## Status` glyph vs folder | **1** — `0014` only | ✅→done, ⛔→cancelled, else backlog |
| Live board row vs brief (glyph **and** agent-closed marker) | **0 disagreements / 403** | rows whose first cell starts with a status glyph and whose **last** cell links a task folder; `➡️` rows excluded. 516 such rows, 113 of them `➡️`. |
| `## Sprint` vs the board holding the live row | **0 disagreements / 403** | `Sprint N`→`sprint-N`, else `backlog` |
| Tasks with >1 live row | **0** | same |
| Tasks with no live row | **2** — `0014`, **`0004`** | same rule. ⚠️ `0004` is *mentioned* on two boards but has no status-led row of its own under this rule. The report knew only `0014`. |
| One-pass index of all briefs | **113 ms** cold, 4,743,428 brief bytes | Python 3.9, warm page cache |
| `🚧 Blocked` in a `## Status` | **1** — `0383`, set today | ⚠️ so "three of six statuses appear zero times" stopped being true during the review. |

⭐ **What this says.** Every live board row is derivable from the briefs **today, with zero exceptions** — the rows are pure redundancy, and redundancy that has *held*. That supports Codex's item 6 (the drift evidence condemns the checker's coverage, not redundancy) and **cuts against both leads' "it will drift exactly the way status did."** The three famous defects were born wrong in one bulk migration; nothing has drifted since.

### ⚠️ A measurement I am withdrawing as unreliable — and why that matters

I extracted 4-digit ids from `Depends on:` / `Blocks:` lines: 155 + 101 id-edges, **60.6%** of depends-on edges with no matching `Blocks`, **10 cycles**. **Do not use those numbers.** Spot-check: the "cycle" `0127 ↔ 0128` comes from `0127`'s line *"**Blocks:** 0116 (…), 0128 does **not** depend on…"*. **The prose contains negated ids.** A clean, unambiguous id on a dependency line is *not* evidence of an edge.

⛔ **Consequence for Codex's Q8 migration rule** (*"parse only unambiguous IDs"*): it is unsafe as written. An id can be perfectly unambiguous and wrong-signed. See Point 8.

### Did not check

- Did not re-run aiboard's benchmark. Did not exercise aiboard's write paths, MCP server, or `check`.
- Did not run fkit's test suite, hooks, or `dashboard.sh`.
- Did not read fkit's sprint movers or ADRs beyond what the report quotes; §5's ADR quotations are taken as quoted.
- Did not talk to the owner. His words reach me relayed, as they reached Codex.
- The spike was looked at in a browser once (board view renders, 405 cards, read-only badge). Task modal, sprint tab and filters not exercised. **Nobody — including me — has yet watched the owner use it.** That is still the missing evidence.
- I am one run of one model, and that model is Claude, like both leads.

---

## 2. The four attacks `fkit-lead` asked for

### Attack 1 — Is *"one declared authority for each kind of fact"* right?

**Yes — and incomplete in the way that matters most here.**

Right: my audit shows fkit's copies agree on 403/405. Duplication as such is not the disease. The offline-legibility argument stands — keep the status line in the brief.

Incomplete: a *declaration* of authority changes nothing unless it changes **who writes the copies**. The operative variable is the writer:

- Copies written **by one deterministic tool in one act** are projections. Safe.
- Copies written **by an LLM walking a 460-line checklist** are peers, whatever a document declares them to be. They agree today because the agents have been diligent and the procedure is long — that is consistency bought with tokens and procedure length, and it is the reason the mover is 460 lines.

So the principle should read: **one declared authority per kind of fact, and every non-authoritative copy written by code, never by a model following prose.** fkit's Q1-D ("tool-written projection") was groping at this and cannot be honest until fkit *has* a tool.

And the declaration itself, for fkit, is already latent in the permission split — say it out loud:

| Fact | Authority | Who may write (already true today) |
|---|---|---|
| Terminality — open / done / cancelled | **the folder** (ADR-029 already says "authoritative") | movers only |
| Sub-state while open — backlog / in-progress / blocked+reason | **the brief's `## Status`** | anyone, freely |
| The tail — agent-closed marker, cancel reason | **the brief's `## Status`**, written by the mover | movers only |
| Sprint membership | **the brief's `## Sprint`** | producer |
| Board rows | **nobody — generated, not stored** | — |

Authority follows permission. No new file format needed.

### Attack 2 — Is the whole framing wrong?

**Yes, and one level further than Codex said.** Codex: *"the real problem is not the data model"* — then it designed a third data model for both projects anyway (`task.json`, ULIDs, NDJSON journal, artifact registry, principal registry, workflow graph). That is the same convergence project with a different target.

The framing error is the word **"converge."** The owner's problem is *"hard for humans to understand the status."* The measured answer: aiboard's UI reads fkit's tree through 129 lines. **The storage models do not need to match; they need to meet at a view contract, and that contract already exists** (`Task.to_dict()` / `Sprint.to_dict()`). Twenty of the twenty-two items are questions about how two stores should agree. Once neither store has to agree with the other, most of them revert to *"each project decides on its own evidence."*

The three real problems, separated:

1. **fkit-internal:** boards are hand-maintained document stores. Generate them; re-home the prose. (Task `0383`, re-scoped — Point 4.)
2. **fkit-internal:** lifecycle writes are LLM-executed prose. Make them a command. (The keystone — Attack 3.)
3. **aiboard-internal:** T-021 (quadratic snapshot, ~5-line fix) and T-022 (cross-origin writes, ~20-line fix).

**Seam:** aiboard grows a pluggable *store adapter* (the native file store is the default one); fkit ships an adapter for its own tree. Generic — a solo user never sees it; anyone with an existing tracker-in-files can write one. That satisfies the one fixed constraint better than making id patterns, status vocabularies and field syntax configurable, which is how a small tool becomes a framework.

### Attack 3 — The contradiction in Codex's plan

**The architect is right that it is a contradiction; wrong about the remedy.** Codex's step 11 gates writes on "authorization tests"; §Q11.1 shows there is nothing to test. But the architect's fix — an *identity spike* — hunts for something that cannot exist in this deployment:

- The owner and every agent run as **the same OS user**. (`fkit-lead` reached this too and retracted the TUI argument; I concur with the retraction on all three points.)
- Any secret the browser/TUI can read, an agent with Bash can read. Any file the mover can write, an agent can write. fkit's own ADR-033 says the close gate is *"not a laundering-proof gate"*; since ADR-022 agents have unrestricted tools.
- So **no mechanism inside the repo or on localhost can prove "a human did this."** Demanding it of aiboard is fitting a steel door to a paper wall.

**Resolution — delete the authorization gate from the plan and replace it with three honest things:**

1. **Attribution is a claim.** Record `{claimed_actor, channel}` on every tool-written transition. Never infer verification from channel (Codex is right: *"human dragged it" ≠ "owner verified it"*).
2. **Close the one real hole.** T-022 is an *external* attacker (any web page the owner visits), unlike an agent. Require `Content-Type: application/json`, check `Origin`/`Host` against the bound address, and embed a per-launch token in the served page. ~20 lines. **Gate browser writes on that**, plus recovery and concurrency tests.
3. **Anchor human verification at the commit.** fkit's hard rule *"never commit unless the owner asks"* is the **only** real human checkpoint in the system. The owner reviewing a diff before "Sprint push" is what verifies a close. If he wants it cryptographic: a signing key that needs a passphrase or hardware touch — the one thing an agent cannot do. Optional.

On the marker: a plain `✅ Done` can already be typed by any agent with an editor. A browser drag that writes plain `✅ Done` adds **no forgery ability that does not already exist.** The marker is a labelling convention among cooperative agents, as ADR-025 says of itself. Let it be that. (The draft ADR-049 title I saw in the working tree — *"no channel supplies one"* — points the same way.)

Also: the architect's W3 over-reads the owner. His words are *"check the cards, their statuses, **maybe** change something."* Reading is the need; writing is a maybe. Read-only first is right, and it no longer needs approving — it exists.

### Attack 4 — Is the migration worth it at all?

**No.** Costs: 405 folders, ~540 rows, a cross-reference graph across 48 ADRs, and a last-migration error rate of 2.97–3.75%. Benefit, now measured: **nothing the adapter does not already deliver.** The carriers are consistent; the ids work; the folders work. There is no defect a re-key fixes.

Two bulk operations I *do* endorse, both additive, both mechanically verifiable, neither a convergence migration — Points 4 and 10.

---

## 3. The ten comparison points

**Legend.** "NEITHER-∅" = *neither project should change toward the other; no cross-project decision is needed.* That is a real answer, not an abstention: it is the claim that the question only existed because storage convergence was assumed.

| # | Point | Verdict | vs Codex |
|---|---|---|---|
| 1 | Where status lives | ⭐ **NEITHER** | disagree |
| 2 | How many statuses | **A + D's provenance later; reject C** | disagree on C |
| 3 | Id scheme | ⭐ **NEITHER-∅**; never reuse | disagree on ULIDs |
| 4 | Sprint representation | **D** (fkit-internal) | mostly agree |
| 5 | Brief format | ⭐ **NEITHER-∅**; add validation | disagree |
| 6 | Per-task artifacts | **B**, plain | disagree on registry |
| 7 | Ownership | **A**; defer structure | disagree |
| 8 | Dependencies | **D for fkit's *open* tasks only; A for aiboard** | partly |
| 9 | Close gate | ⭐ **NEITHER** — delegated write command | partly |
| 10 | History | **C, smaller than Codex's** | partly |

### Point 1 — Where status lives — ⭐ NEITHER

Both systems **already agree**: the folder is authoritative. The only live dispute is whether a brief may also *show* it. It may, and should (offline legibility).

- **Not A alone:** a folder cannot carry `🔄`, a blocked reason, the agent-closed marker or a cancel reason, and fkit has no `in-progress/` directory.
- **Not B:** board rows as a hand-written third carrier earn nothing — [X] derivable with 0 exceptions.
- **Not C:** agree with Codex — event sourcing buys replay/compaction/schema-evolution problems for a single-user tool.
- **Not Codex's `task.json`:** stable paths cost a 405-folder migration to remove a path change that happens **once** per task life and that the movers already handle.
- **Do:** the authority table in Attack 1. Rows stop being stored. Add one checker — *glyph class must match folder, over every brief, not over rendered boards* — ten lines; it would have caught all three born-wrong records the day they were written. I ran its equivalent: one hit, `0014`.
- **`0014`:** Codex is right that it is unadjudicable, not wrong. Under the declared authority it stops being a question: folder says done. Owner's call whether to stamp it.

### Point 2 — How many statuses — A, plus provenance later; reject C

- aiboard: four, blocked-as-relation. **Leave hard-coded.** One user, 21 tasks. Codex's workflow graph with `allowed_next` is a framework feature with zero requesters. Revisit on the first real request.
- fkit: keep its vocabulary. `➡️ Moved` (113 rows, 21%) disappears **for free** when boards are generated — no decision required.
- Provenance (D): yes, but only a tool can write it truthfully, so it arrives with the deterministic mover, not before. Codex is right: record initiator and approver as separate claims, no bare boolean.
- The adapter maps vocabularies. Nothing needs to match.
- **W1 vs Codex item 5:** both overstated. Codex's "archival" mechanism is wrong (115 open tasks, none `🔄`). The architect's "not maintained as a live signal" is also too strong — `0383` was set `🚧 Blocked` with a reason **today**, because there was a reason. The vocabulary is used when needed and idle otherwise. Infer nothing from a zero.

### Point 3 — Id scheme — ⭐ NEITHER-∅

- fkit keeps `NNNN`. aiboard keeps `T-`/`S-`. Ids are opaque strings at the view contract; the spike passes `0404` and `S-011` through aiboard's UI untouched.
- **Reject ULIDs.** People say and write "task 0404" constantly — the report does it hundreds of times. A 26-character id destroys the main human affordance to fix a branch collision that a one-person, one-branch project has never had and already detects.
- **Reuse policy, as asked:** never reuse, renumber or recycle. aiboard's `_next_number` is `max+1` over existing folders in all four status dirs [X] — safe **as long as tasks are cancelled, never deleted.** Write that sentence into aiboard's README; no code change.

### Point 4 — Sprint representation — D, fkit-internal

- Sprint = a document (goal, status banner, authority, prose). Membership = query over `## Sprint`. Board table = **generated**. [X] proven derivable today, 403/403.
- **Where the 688 KB goes** (the mandatory sub-question): every live row maps to **exactly one task** via its last-cell link [X: 403 tasks ↔ 1 live row each, 0 with more]. So extraction is mechanical: move each row's Task-cell text **verbatim** into that task's folder as `board-notes.md`, with source board + byte hash; archive the old board files untouched. Codex's "ambiguous remainder" shrinks to the 113 `➡️` rows and non-row prose, which stay in the archives. Never rewrite, never summarise. **This is task `0383`, re-scoped — unfreeze it in this shape; it no longer conflicts with anything.**
- Closure snapshot: commit the generated board at close. Git is the immutability.
- "The backlog is not a sprint": agree. `sprint: null`. The spike already models it so (172 unsprinted).
- aiboard's own duplicate (`tasks:` list + regenerated checklist): drop the stored list, derive it. aiboard-internal; do it during the port.

### Point 5 — Brief format — ⭐ NEITHER-∅, plus validation

- No shared format is needed. [X] One regex read all five heading-fields from 405/405 briefs in 113 ms with zero id mismatches. Ugly, adequate.
- fkit: take the architect's own third option — **validate** the five fields' presence and values in the checker. That is the missing piece, not the syntax.
- aiboard: after the port there is one implementation of the YAML subset, so the divergence risk Codex and the leads fear mostly evaporates. Pin the dialect with a fixture file of test vectors, ported with the 41 tests. If it must change, JSON is the only zero-dependency specified format in Node — but with 21 tasks that can be done any afternoon. Not now. *Confidence: medium, like everyone else's.*

### Point 6 — Per-task artifacts — B, plain

Open folder; UI lists any `*.md`. **Reject both add-ons** — Codex's typed registry and fkit's append-only flag — as machinery with no requester. Keep `review.md` whole (agree with Codex and fkit; discount accordingly, fkit wanted it). The spike already surfaces `plan` / `review` / `worklog` presence as card labels.

### Point 7 — Ownership — A; defer structure

Free text stays. Codex's item 11 is semantically right (free text is not identity) and practically premature: **neither project has ever assigned a task to a human.** Designing `accountable` / `assignees` / a principal registry before the first human assignee is designing blind. When the first real case arrives, `{kind, id}` is a one-field change.

### Point 8 — Dependencies — D for fkit's open tasks only; A for aiboard

- aiboard: `blocked_by` as is. Reject the typed-link table — no requester.
- fkit: ids in a machine field, commentary in a note, `Blocks` derived, cycle check. Agreed by everyone.
- ⭐ **But migrate almost nothing.** Dependencies only *do* anything for open tasks. 290 of 405 are terminal — their prose stays as history, untouched. Of the 115 open, my crude count finds ~11 with an open blocker. **Convert the open tasks by hand or by an LLM pass with owner spot-check; do not regex it** — §1's negated-id finding shows why: *"0128 does **not** depend on"* is a clean id and a false edge. Codex's "parse only unambiguous IDs" would have manufactured it.

### Point 9 — The close gate — ⭐ NEITHER (all four, including Codex's as framed)

- Codex's "one transition service used by CLI, HTTP, MCP, browser **and fkit**" cannot be built while fkit's writer is an LLM following prose. There is nothing to link the library into.
- **Keystone, fkit side:** `fkit-task-done` and its three siblings become a deterministic script (folder move **last** — rename is atomic; projection written first; checker catches an interrupted run; git is the recovery). The skill shrinks to *"decide, then run the command."* This is worth doing with aiboard deleted from the universe: it is cheaper in tokens, testable, and is the only thing that makes "tool-written" true anywhere in fkit.
- **Seam, aiboard side:** *delegated write.* Per-action external command in `aiboard.json` (or supplied by the store adapter). Drag → command runs synchronously → exit code and stderr go back to the UI → card moves or an error flashes. Default = built-in writer; a solo user never sees it. This is `aiboard-lead`'s hook turned from **veto** into **delegate** — which is what fixes the two-writers problem the veto could not.
- **No queue** once the mover is a millisecond script. Until then: serve fkit's board **read-only**. If the owner, after using it, wants to act from the browser sooner, the cheapest honest bridge is an append-only request file the producer drains at session start — drain latency is "next producer session," and he should hear that number before choosing it.

### Point 10 — History — C, smaller than Codex's

- `created` / `closed` timestamps on fkit briefs. Backfill from git, labelled *git-derived* — and note `331f298` touched every file, so use first-add and the folder-move commit, not last-modified.
- One tool-written line per transition (`from`, `to`, claimed actor, channel, time) appended to `worklog.md`, written by the deterministic mover. Arrives with it, not before.
- Reject NDJSON journals, revision counters and transaction ids: single-user apparatus with no reader.
- Agree with Codex: not a security log; and "time in review" needs review to be a state, which it is not.

---

## 4. The twelve questions

| Q | Answer |
|---|---|
| **Q1** | ⭐ **NEITHER.** Folder = authority for terminality (both projects, already). Brief `## Status` = authority for open sub-state and the tail. Board rows generated, never stored. No event log, no `task.json`. Add the all-briefs folder↔glyph check. |
| **Q2** | **A now; D's provenance when a tool exists to write it; C rejected as speculative.** "Should both C and D be taken?" — no: D only, later. |
| **Q3** | ⭐ **NEITHER-∅.** Each keeps its scheme; ids opaque at the contract. **Reuse policy: never reuse, renumber or recycle; cancel, never delete.** No ULIDs. |
| **Q4** | **D**, fkit-internal. Prose → per-task `board-notes.md`, verbatim, hashed, mechanical (1 live row per task, measured); old boards archived intact. |
| **Q5** | ⭐ **NEITHER-∅.** Keep both formats; fkit adds field validation; aiboard pins its dialect with fixtures at the port. |
| **Q6** | **B**, without registry or flags. Review ledger stays a whole document. |
| **Q7** | **A.** Defer structured principals to the first human assignee. |
| **Q8** | **fkit: D, open tasks only, hand/LLM-adjudicated — never regex. aiboard: A.** No link table. |
| **Q9** | ⭐ **NEITHER.** Delegated-write command seam in aiboard; deterministic movers in fkit; read-only until both exist. Queue only as an owner-chosen stopgap; drain = next producer session. |
| **Q10** | **C, minimal:** timestamps + one tool-written worklog line per transition. |
| **Q11** | ⭐ **NEITHER.** Unanswerable today and unnecessary after Q9: the drag calls the same command the producer calls. Never shell from a UI into an LLM-executed mover. Minimum identity mechanism, as asked: **none** — a claimed actor plus the channel, T-022 closed, human verification at the commit. |
| **Q12** | ⭐ **NEITHER — no corpus migration.** For the two additive bulk ops I endorse (board-prose extraction, timestamp backfill): derive, never default; byte-hash the moved text; run corpus-wide invariants before and after (my `index_fkit.py` + `rows.py` are a prototype of that check); owner reads the dry-run diff before the commit. Codex's steps 1–6 are right and are now mostly done; drop 7–11 as written. |

---

## 5. The added question — web board, terminal UI, or both?

- **Identity:** no help. Same uid. I agree with `fkit-lead`'s retraction in full.
- **What survives:** a TUI removes an anonymous network write path. True — and so does a ~20-line fix to T-022. That is an argument for fixing the server, not for a second UI.
- **A fact nobody raised:** fkit **already has** a terminal view — `/fkit-status` and its 1,687-line `dashboard.sh`. The owner's complaint was made *from inside* the terminal medium. fkit titles run 80–150 characters; four kanban columns in a terminal give each ~40 columns. Emoji width is, as `aiboard-lead` says, this investigation's recurring bug class. I would not predict a TUI reads better. I would not assert it reads worse either — unmeasured, both ways.
- **It is a change of premise.** His motivation says *"open in the browser."* He may change it; he should know he is.
- **Verdict:** not a distraction, but **not next.** Order: (1) owner uses the read-only web spike on his real tree for a few days — first usability evidence either project has ever had; (2) Node port, with the store-adapter seam, T-021 and T-022 folded in and the 41 tests ported first as the conformance spec; (3) *then* a TUI is a second thin consumer of the same snapshot contract, and the comparison he asked for is cheap and fair. Task `0405` can wait for (2).
- **Changes none of my 22 answers.**

---

## 6. Where I think each party is wrong

**Both leads** — enthusiasm for an event log and a migration, neither justified by evidence; and a drift story the data does not support (403/405).

**Codex** — right headline, right sequencing, right on items 1, 2, 4, 6, 9, 10, 12. Then it over-built: a third storage model, ULIDs, registries, workflow graphs, journals — for two tools with one user. It called others' constraints "preferences" and replaced them with its own. Its Q8 migration rule is unsafe (negated ids). Its step 11 gates on something that cannot exist.

**`fkit-architect`** — right that step 11 is a contradiction; wrong that an identity spike resolves it; over-read the owner's "maybe." W1 half-right. W2 is a fair calibration note, not a substantive dispute.

**`aiboard-lead`** — the candour is real and I weighted it. Its point-1/6/10 event log is the weakest idea in the report presented as the strongest. Its point-3 self-criticism was unnecessary: nothing needs to bend.

**Me** — I measured what was cheap to measure. The spike's card mapping is my choices (priority flattened to `medium`; `P<n>` and marker shown as labels; `🚧`→`blocked` flag). I have a bias toward *not building*, and this verdict is what that bias produces. The owner should weigh that the same way he weighs the leads' enthusiasm.

---

## 7. Where this lands relative to the leads' line (§1.4)

Nothing here pushes a fkit governance concept into aiboard's core. The store adapter and the delegated-write command are generic mechanisms that pass §5.1's own test (useful to a solo user with files in another layout, or a test-before-done script). **No owner ruling is needed to place this recommendation on the permitted side.**

Owner decisions this *does* raise:

1. Accept "no storage convergence" and re-scope Sprint 11 to: aiboard port (+ adapter seam, T-021, T-022) · deterministic fkit movers · `0383` re-scoped as board-prose extraction + generated boards.
2. Accept "attribution is a claim; verification lives at the commit" as the content of the identity ADR.
3. Whether to stamp `0014` from its folder.

---

## 8. Artifacts

> ⏱ **ADDED 2026-09-18, after this section was written — `fkit-external-expert`, at `fkit-lead`'s request.** The three scripts are now preserved durably at [`ai-agents/tasks/backlog/0404-…/assets/external-expert-spike/`](../../tasks/backlog/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/assets/external-expert-spike/README.md), with a README marking them a throwaway demonstration. One edit was made to the copies: `rows.py` now finds `fkit_index.json` beside itself rather than in the working directory; outputs are gitignored. Re-run from the new location reproduces the 403/405 result. The running server is still the scratchpad copy. The text below is left as written.

All in this session's scratchpad — **`/private/tmp`, will not survive a reboot; copy anything worth keeping**:
`/private/tmp/claude-501/-Users-mark-dolbyrev-Workspace-fkit/3672ffa6-7c44-44f6-8beb-f7c39611fa1f/scratchpad/`

| File | What |
|---|---|
| `fkit_board_spike.py` | 129 lines. Read-only. Serves aiboard's unmodified `web/index.html` over fkit's unmodified `ai-agents/`. Refuses every POST. `--bench` prints snapshot timing. **Left running on `127.0.0.1:8585`**; stop with `pkill -f fkit_board_spike.py`. |
| `index_fkit.py` | one-pass indexer + id / status / dependency audits. The dependency section's numbers are **withdrawn** (§1). |
| `rows.py` | the tight board-row audit (403/405). |
| `fkit_index.json`, `board.json` | outputs |
