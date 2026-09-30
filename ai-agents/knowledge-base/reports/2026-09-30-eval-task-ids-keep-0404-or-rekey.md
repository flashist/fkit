# Evaluation: task ids under aiboard — keep `0404-slug`, or re-key to `T-0404`?

> ## ⛔ SUPERSEDED 2026-09-30 by the owner's FULL-MERGE ruling — dated note; nothing below it was changed
>
> The owner ruled (selected option text): *"No, fkit only → full merge — aiboard becomes fkit's built-in
> board; its repo is archived (history can be carried over). Simplest overall."* The decision now lives in
> [`2026-09-30-decision-document-merge-aiboard-into-fkit.md`](2026-09-30-decision-document-merge-aiboard-into-fkit.md).
> Read that first. This report stays on file as supporting evidence; where the two differ, the decision
> document wins.

- **Date:** 2026-09-30
- **Author:** `fkit-architect`, spawned by `fkit-lead` (consult, hop 1). No owner channel (ADR-021).
- **Kind:** evaluation — a decision aid. Design only; nothing built, nothing renamed.
- **Status:** ⏸ **OPEN — the owner asked for this before deciding.**
- **Asked for by the owner, his own words (2026-09-30):** *"I am not ready to make the decision, provide
  me a detailed report about the question: I need to understand the pros/cons of both decisions."*
- **Parent:** [`2026-09-30-eval-aiboard-as-fkits-single-task-store.md`](2026-09-30-eval-aiboard-as-fkits-single-task-store.md)
  §5.3 and its question Q1.

**Tags:** **[M]** = measured in fkit's repo by this architect today (counting rules in §7).
**[AL]** = `aiboard-lead`'s input, 2026-09-30, at aiboard HEAD `0108027`, relayed by `fkit-lead`.
**[S]** = read in aiboard's source at `0108027`.

⛔ **The facts (§1–§5) and the recommendation (§6) are kept apart on purpose.** You can read §1–§5 and
reach your own answer.

---

## 1. The question in plain words

Every fkit task has a permanent number, like `0404`, and lives in a folder named
`0404-evaluate-aiboard-as-fkits-human-readable-board-…`. aiboard, as it is today, only understands
folders named like `T-021-some-title` — a letter, a dash, a number. It **does not see** a folder called
`0404-…` at all [AL].

So one of two things has to change:

- **Option K — Keep.** fkit's folders and numbers stay exactly as they are. **aiboard learns a
  per-board setting** saying "on this board, ids are four digits with no letter" (requirements R2/R3).
- **Option R — Re-key.** Every fkit task folder is renamed from `0404-slug` to `T-0404-slug`, and every
  place that points at it is rewritten. aiboard's existing format is used (with one small setting, see
  §3.2).

There is also a third, **Option K+ — Keep, with a display prefix** (§2.3), and one variant of R worth
naming, **R-project — a project letter code** such as `FK-0404` (§2.2).

---

## 2. What each option means day to day

### 2.1 Option K — keep `0404-slug`

- You and the agents keep saying *"task 0404"*. The board shows `0404`.
- CLI: `aiboard task show 0404`, `aiboard task move 0404 done …`.
- A brief links a sibling as `../0405-…/brief.md`, exactly as now.
- **Nothing you have written becomes out of date because of the id.** Old ADRs, reports, sprint notes and
  wiki pages keep pointing at real folders.
- New tasks keep counting up from the current highest: `0416`, `0417`, …; aiboard picks the next number
  (it already takes "highest ever + 1" across all status folders, including cancelled [S]).
- A task's folder moves between `backlog/`, `in-progress/`, `done/`, `cancelled/` as its status changes
  — only the **status part** of the path changes, never the name.

### 2.2 Option R — re-key to `T-0404-slug`

- You and the agents start saying *"T-0404"*. Everything written **before** the switch says `0404`;
  everything **after** says `T-0404`. Both forms live side by side in the project forever.
- CLI: `aiboard task show T-0404` (aiboard also accepts `0404` or `404` as a shorthand — its lookups are
  forgiving [S `model.py:96-102`]).
- **One surprise, measured in the code:** aiboard pads ids to **three** digits
  (`format_id` → `f"{prefix}-{number:03d}"`, [S `model.py:92-93`]). A folder `T-0404-slug` would be
  **shown as `T-404`**, and `0013` as `T-013`. And the next new task would be written as `T-416-…`,
  next to `T-0404-…` — two widths in one folder, which also breaks "sorted by name = sorted by number".
  **So R also needs a small aiboard setting: pad to 4 digits.** Without it, R is not really "`T-0404`" —
  it is "`T-404`", and searching for `0404` no longer finds the new form.
- **Variant R-project:** use a project code instead of `T`, e.g. `FK-0404` in fkit, `GC-0123` in another
  project. Its one real advantage: **ids become unique across projects** (today every fkit project has
  its own `0001`). That only matters if you ever look at, or refer between, several projects' tasks at
  once. Note that aiboard's folder rule is **one letter** today (`^[A-Z]-\d+` [S `store.py:56`]), so a
  two-letter code is aiboard work too.

### 2.3 Option K+ — keep the folders, show a prefix

- On disk everything is exactly Option K (`0404-slug`).
- aiboard's page and CLI **also** accept and display a prefix, e.g. `T-0404`, as another spelling of
  the same id.
- ⚠️ It gives you two spellings of one id. That is display only (nothing is stored twice), but it is
  the kind of "two names for one thing" you have ruled against elsewhere. Worth it only if a prefix
  matters to you for reading.

---

## 3. What breaks or changes — measured

### 3.1 References that point at a task folder today [M]

| Kind of reference | Count | Where they are | Under **K** | Under **R** |
|---|---|---|---|---|
| Markdown links **into another task's folder** (e.g. `../0407-…/brief.md`, `../../tasks/done/0404-…/brief.md`) | **1,662** | task folders: done 425 · backlog 302 · cancelled 60 · live sprint boards 437 · archived sprint boards 382 · sprint review ledgers 6 · ADRs 20 · reports 27 · conventions 3 | ✅ unchanged | ❌ every one breaks → **mechanical rewrite** |
| Links **inside a task's own folder** (e.g. `[plan](plan.md)`) | **488** | task folders | ✅ | ✅ 486 survive (relative); **2** name the folder and break |
| Task-folder paths written **as text, not links** (in `code spans`, prose, test fixtures) | **1,894** | task folders 1,234 · sprint boards 30 · ADRs 35 · reports 104 · **wiki vault 368** · tests 109 · `claude/` 13 · `bin/` 1 | ✅ | ⚠️ none "break" a test (code spans are not checked as links) but **every one goes stale** → rewrite, or accept stale text |
| **Files that name at least one task folder** | **746** | of which **251 in the wiki vault** | ✅ | ❌ ~746 files edited (≈4× the 184 files the last bulk migration touched, `331f298`) |
| Four-digit ids written in `backticks` like `` `0404` `` (mostly task ids; rule in §7) | **~30,758** | everywhere | ✅ | stays as `0404`; new writing uses `T-0404`. **Two forms for good.** Only searchable as one if aiboard pads to 4 (§2.2). |
| Links to **sprint board files** | **372** | mostly boards and task folders | ❌ break — sprint boards move into aiboard's `sprints/<status>/S-NNN-…/` | ❌ break — **same under both** |
| Wiki `[[links]]` to task pages | 93 | vault | ✅ — wiki task pages are named **by slug, not id** (252 pages under `wiki/tasks/`) | ✅ same |
| Tests that pin real task paths | 8 files (`coordination-citation-policy` 35 hits, `throughput-counter` 32, `reference-integrity` 18, `carry-check-hook` 15, `dashboard-contract` 10, `closed-rank-immutability` 6, `dual-home-parity` 3, `board-narrow` 1) | `test/` | ✅ (still change for other aiboard reasons) | ❌ each updated |

⚠️ **This corrects the parent report's "~1,700 links".** That figure used a rougher rule (a regex needing
`tasks/<board>/` inside the link). Resolving every link to where it actually points gives **1,662**
cross-task links plus **1,894** text mentions. The direction is the same; the size is larger.

### 3.2 How each kind would be fixed under R

| Kind | Fix | Who | Check that it worked |
|---|---|---|---|
| 1,662 + 2 markdown links | A script: map every old folder to its new name, rewrite each link whose target lands inside a renamed folder | the converter | `reference-integrity.test.js` goes green — **a real check** |
| 1,894 − 368 = 1,526 text mentions outside the vault | Same script, text replace of `…/NNNN-slug` paths | the converter | **No existing test.** Needs a new "zero old-form paths outside the vault and the frozen archive" check |
| 368 mentions in the **wiki vault** | ⛔ **Not the converter's to touch.** Only `fkit-wiki` writes the vault (ADR-005) — a post-cutover wiki sync | `fkit-wiki` | its lint; stale until then (they are source citations, not links, so nothing goes red) |
| ADRs and reports (55 + 131 references) | Link repointing is **established practice** — today's movers already repoint knowledge-base links on every close (`fkit-task-done/SKILL.md:134-161`). The ids written in their prose stay as written. | the converter | reference-integrity |
| 30,758 backticked ids | **Leave them.** Rewriting prose records is not needed and not allowed (reports are "not edited once written"). | — | — |
| 8 test files | Hand edits | coder | the suite |

**Under K:** none of this. The only link work — the 372 sprint-board links — is needed under **both**.

### 3.3 The aiboard side

| | aiboard change needed | Size [AL / S] | Depends on T-023? |
|---|---|---|---|
| **K** | A per-board id setting (prefix: none; width: 4) used by folder scanning, id formatting, id lookup and "next id" (`store.py:56,197-222`, `model.py:92-102` [S]); tests | Small–medium; *"needs building, blocked by T-023"* [AL] | **Yes, permanently.** A prefix-less id **is** an all-digit string — exactly what T-023 corrupts (`0404` → `404`). The fix and its regression test (owner-kept precondition P2) become load-bearing forever: any future regression in aiboard's front-matter reading would hit fkit's ids first. |
| **R** | A padding-width setting (4) — else ids show as `T-404` (§2.2) | Small | **Less.** `T-0404` contains a letter, so it is not the all-digit case. (T-023 must still be fixed for other fields — P2 stays.) |
| **R-project** | Multi-letter prefix + width | Small–medium | Less |
| **K+** | K, plus accept/display a prefix | K + small | Yes |

⭐ **K's setting is a general aiboard feature**, not an fkit special case: "ids look like `ABC-12`" or
"ids are plain numbers" is what Jira-style keys offer. Another aiboard user could use it.

### 3.4 Git history and searching

| | K | R |
|---|---|---|
| Folder renames at cutover | **0** (only in-progress tasks move folder, which is a status move like any close today) | **415** renames in one project, in one commit |
| `git log --follow` on a brief | unchanged | works per file if the renames land in a commit **separate** from the content edits (so git recognises them as renames); must be planned in the converter |
| `git log -- ai-agents/tasks/done/0404-*` | works | needs the old **and** new name for history across the switch |
| `grep -r 0404` finds everything about the task | ✅ | ✅ only if aiboard pads to 4 digits; with 3-digit padding the new form is `T-404` and **`grep 0404` misses it** |
| Tools that read history by path (`throughput.mjs` reads git renames of `tasks/<board>/NNNN-…`, `throughput.mjs:124-125`) | unchanged (being rewritten over aiboard's timed status lines anyway) | must understand both names |

### 3.5 Risk during the converter

The converter is already the riskiest step of the whole move (parent report §6.1). The last bulk
migration (`331f298`, 184 files) wrote the wrong status into 3 of ~80 briefs and nobody noticed for two
months [AL, M].

- **K adds nothing** to that step on the id front.
- **R adds** 415 renames plus **~3,200 text edits across ~500 files outside the vault** (1,664 links +
  1,526 text mentions), and leaves ~368 vault citations stale until a wiki sync. The links are checkable
  (reference-integrity); the text mentions need a new check that does not exist today.

### 3.6 Future flexibility

| | K | R |
|---|---|---|
| Other aiboard users | Gain a configurable id format (a feature) | Nothing changes for them |
| A **mixed board** (fkit's old tasks plus new tasks created in the page, or by aiboard defaults) | One pattern per board, so new tasks get `0416…` — no mix | One pattern too, `T-0416…` — no mix |
| Several projects viewed together / cross-project references | ❌ every project has its own `0001`; ids are **not** unique across projects (true today too) | ❌ with `T-`; ✅ **only with R-project** (`FK-0404`, `GC-0123`) |
| Beyond 9,999 tasks | Needs a width change (fkit is at 415) | Same |

### 3.7 Reversibility

- **K → R later:** possible any time, by running R's rename. It costs what R costs now, plus whatever
  was written since. **Choosing K keeps R open.**
- **R → K later:** possible (reverse rename), but everything written after the switch uses `T-0404`,
  so it must be rewritten back as well. R's choice is "sticky" in the text people and agents write.
- Neither is one-way. K is the cheaper one to hold while undecided.

### 3.8 Other fkit projects

- **K:** a project whose tasks already use `NNNN-slug` converts with no renames. aiboard is initialised
  with the same id setting.
- **R:** every project pays §3.1–§3.5 in its own tree, with its own link counts.
- **Both:** ⚠️ **unknown — whether every fkit project uses numbered task folders at all.** ADR-029 left
  "consuming-project migration" deferred, and a sibling project was observed on an old fkit (v0.2.2,
  evidence log E3). A project with no ids needs numbers assigned by the converter under **either**
  option (ADR-029's "sort by slug, `LC_ALL=C`, pinned commit" rule is ready-made for it). → open question
  below.

---

## 4. What stays the same under both

- A task is still a folder, holding `brief.md`, `plan.md`, `review.md`, `assets/` (ADR-029 §1).
- Status is still where the folder sits.
- Sprint-board links (372) break under both and are repointed by the converter.
- The branch race — two branches both creating the next number — stays exactly as ADR-029 accepted it.
- T-023 is fixed first under both (owner-kept precondition, ruled 2026-09-30).

---

## 5. Side by side

| | **K — keep `0404-slug`** | **R — re-key `T-0404-slug`** | **K+ — keep, show prefix** | **R-project — `FK-0404`** |
|---|---|---|---|---|
| What you call a task | `0404` (unchanged) | `T-0404` from now; `0404` in old text | `0404` or `T-0404` | `FK-0404` |
| Folder renames | 0 | 415 | 0 | 415 |
| fkit links rewritten | 0 | 1,664 (+372 sprint links, same for all) | 0 | 1,664 |
| Text mentions made stale | 0 | 1,894 (368 in the vault, wiki's to fix) | 0 | 1,894 |
| Files edited for ids | 0 | ~746 (251 vault) | 0 | ~746 |
| aiboard work | id-pattern setting (small–medium) | 4-digit padding (small) | setting + prefix display | multi-letter prefix + padding |
| Exposure to the T-023 bug class | **Permanent** — ids are all digits | Low | Permanent | Low |
| ADR-029 ("permanent id, never renumbered") | ✅ as written | ⚠️ number kept, **name changed** — needs an amendment | ✅ | ⚠️ amendment |
| Git history / grep | unchanged | two names across the switch; grep OK only with 4-digit padding | unchanged | two names |
| Added converter risk | none | high (largest single edit set) | none | high |
| Unique across projects | no | no | no | **yes** |
| Easy to change your mind later | ✅ (R still possible) | ⚠️ sticky | ✅ | ⚠️ sticky |
| Same for every fkit project | no renames | renames in each | no renames | renames in each |

---

## 6. Recommendation — ⚠️ the architect's opinion, separate from the facts above

**Keep `0404-slug` (Option K).**

- It is the only option that adds **nothing** to the converter's risk, breaks **no** existing reference,
  and keeps every old document true.
- It keeps ADR-029 as written.
- It is the cheapest to reverse: R stays available later if you ever want it.

**The main cost you would be accepting:** fkit's ids stay **all digits**, which is exactly the kind of
value aiboard's T-023 bug destroyed. fkit would **depend forever** on that fix and its regression test
(round-tripping `0013` and `0404`) staying in aiboard. That is a real, permanent coupling — the one
argument for R that is not about convenience. It is manageable because the test is cheap and already a
kept precondition (P2), and because the version lock (see
[`2026-09-30-design-fkit-aiboard-version-lock.md`](2026-09-30-design-fkit-aiboard-version-lock.md)) means fkit
only ever runs an aiboard build that passed it.

**When R would be the better answer:** if you expect to view or cross-reference **several projects'
tasks together** — then R-project (`FK-0404`) is the one that gives unique ids, and it is worth paying
its migration cost **once, now**, rather than later on a bigger corpus.

---

## 7. Counting rules (so the figures can be re-run)

Measured 2026-09-30 over the working tree, excluding `.git`, `node_modules`, `.claude` and `.fkit`.

- **Markdown links:** every `](target)` in `.md` files, fragment dropped, URL schemes skipped, target
  resolved relative to the file; counted if it lands at or inside one of the 415 task folders
  (`ai-agents/tasks/{backlog,done,cancelled}/NNNN-*`). "Own folder" = the link sits inside the same task
  folder it points into; split by whether the link text of the target contains the folder name.
- **Text mentions:** after removing markdown links, matches of `tasks/(backlog|done|cancelled)/\d{4}-` in
  `.md`, `.js`, `.mjs`, `.sh`, `.tsv` files.
- **Sprint-board links:** markdown links resolving to an `.md` file directly in `ai-agents/sprints/` or
  `ai-agents/sprints/done/`.
- **Files naming a task folder:** files (`.md .js .mjs .sh .tsv .json`) containing an exact current task
  folder name.
- **Backticked ids:** `` `0NNN` `` occurrences under `ai-agents/` (`grep -rhoE`). Includes some non-task
  four-digit numbers; an upper bound on task-id mentions.
- aiboard code facts: read at HEAD `0108027`.

## 8. Open questions for the owner

1. **Do you expect to look at several projects' tasks together, or refer from one project to another's
   tasks?** *Recommended answer:* "No" → keep (K). "Yes" → consider `FK-0404` (R-project) now, not later.
2. **Do all your fkit projects already use numbered task folders?** *Recommended:* the lead checks each
   project read-only before the converter is designed; a project without numbers gets them assigned by
   ADR-029's rule under either option.
3. **Does a letter prefix matter to you when reading the board?** *Recommended:* "No" → K. "Yes" → K+
   gives it without renaming anything.
