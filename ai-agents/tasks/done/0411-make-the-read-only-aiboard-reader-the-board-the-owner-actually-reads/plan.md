# Plan — `0411` Make the read-only aiboard reader the board the owner actually reads

> **Provenance.** Produced by a spawned `fkit-coder` on 2026-09-20 (plan-only spawn, no files written),
> driven by `/fkit-sprint-ship-loop` on Sprint 11. **Approved by the owner on 2026-09-20** via
> `AskUserQuestion` in a live `fkit lead` session, together with rulings on all three open questions
> (recorded at the end of this file).
> Written to disk by `fkit-lead` at the moment of approval, copied from the coder's returned text.
> ⚠️ **Transcription risk, disclosed:** this is a copy of text returned through a session, not a copy of a
> file the coder wrote. It has not been diffed against a coder-authored original, because none exists.

## Summary

- **Measured today: the spike is 130 lines, not 129 — and 129 reproduces under no counting rule I tried.** I record 130 and the rule; I do not repeat 129.
- **The spike's 37 ms DOES reproduce, exactly** — re-ran `--bench` on the live tree: 411 tasks, 10 sprints, **121 ms cold / 37 ms warm**, 269,780-byte payload. Corpus is **411**, not 405.
- **My call: rewrite in Node. Keep the spike's endpoint set and its `read_only` flag as design; discard the file.**
- ⭐ **Best finding: aiboard's UI already honours `read_only: true`** — it strips the drag attribute from cards, disables the new-task/new-sprint buttons, and shows a read-only badge. The reader is read-only *in the UI*, not only at the HTTP layer. The spike already sets the flag; nobody noticed the UI obeys it.
- ⛔ **The spike breaks a house rule, and that is the real reason to rewrite, not the language.** It re-derives the sprint line-3 banner grammar in Python. `sprint-status-vocabulary.md`, under *"The carrier — the line-3 banner"*: *"The recognizer has exactly one implementation, in `dashboard.sh`. Do not re-state the regex anywhere else."* Its first-glyph fix gets Sprint 11 right by luck, and is exactly the F3 failure ("needed non-trivial changing each time fkit's shape changed") lying in wait.
- ⚠️ **One measurement is a hard design constraint:** `bash dashboard.sh status <board>` costs **28–47 ms per call**; ten boards one-at-a-time is **~240 ms**, 6× the whole current snapshot budget against a 3-second poll. One `select-active` call covers every open board in **50–70 ms**, and archived boards take status from location. Solved, but only if planned for.
- **Open: hardening depth (the required question), language, and whether this ships to consuming projects.**

---

## 1. The measurement, with its counting rule

Taken 2026-09-20 on this machine, by me, on the preserved spike and the live tree.

| Thing | Value | Counting rule |
|---|---|---|
| `fkit_board_spike.py` | **130 lines** | `wc -l`; file ends in a newline (last byte verified `0a`), so 130 is the physical-line count. **112** non-blank lines. |
| Corpus | **411 tasks** | directories under `ai-agents/tasks/{backlog,done,cancelled}` matching `^[0-9]{4}-`: 119 + 273 + 19. Every one has a `brief.md` — zero missing. |
| Spike snapshot | **121 ms cold, 37 ms warm (×2)** | `python3 fkit_board_spike.py --bench`, 3 iterations, live tree, 10 sprints, 269,780-byte payload. |
| Node equivalent | **14–19 ms** | `node -e`, read + regex-parse all 411 briefs, 3 runs. Serialising a board-shaped payload: <1 ms. |
| `dashboard.sh status <board>` | **28–47 ms per call** | `node -e` + `execFileSync`, 3 runs. Ten boards sequentially: **237/243 ms**. |
| `dashboard.sh select-active` | **50–70 ms, one call, all open boards** | `/usr/bin/time -p`, 3 runs. |

⚠️ **129 is unreconciled and I am not smoothing it.** 130 physical, 112 non-blank — neither is 129. The README records one edit to the copies, but names `rows.py`, not this file. I report 130 and move on.

⚠️ **405 → 411 is not a discrepancy.** ADR-051 under *"A counting note, so three different corpus sizes do not read as an error"* already says the corpus grew during the measuring day. Two more days have passed.

---

## 2. What of the spike survives

**The call: keep the shape as design, discard the file. Rewrite.**

**Survives (re-implemented, not copied):**
- **The endpoint set.** I verified it against aiboard's UI: its entire *read* surface is exactly `GET /api/board`, `GET /api/tasks/<id>`, `GET /api/sprints/<id>`, plus `/api/check`. Every other call in that file is a mutation. The spike got this right and it is the single most valuable thing in it.
- **`read_only: true`.** Verified the UI acts on it in four places — the read-only badge, the disabled create buttons, the stripped `draggable` attribute on cards, and the modal control gating. ⭐ This is why the deferred write-back worry ("would a browser drag-to-Done forge a close?") does not even arise under A: there is nothing to drag.
- **The task-card mapping** as a starting shape (id / title / status / sprint / labels), with two changes below.

**Discarded:**
- ⛔ **The hard-coded absolute paths.** Both. Non-negotiable — a thing he runs discovers its own root.
- ⛔ **The Python sprint-status parser.** Second implementation of a one-implementation grammar (quoted above). Replaced by `dashboard.sh`.
- **`priority: "medium"` flattening.** The board's `P<n>` is real, and aiboard's UI colours cards by the priority class — flattening throws away signal he can already see.
- **`index_fkit.py`** — its own README withdraws its dependency numbers (*"an id on a `Depends on:`/`Blocks:` line is not evidence of an edge"*). It is an audit, not a reader.
- **`rows.py`** — a board-row audit. Also not a reader. `dashboard.sh` already owns drift detection.
- **`fkit_index.json`** — a gitignored build artefact.

Nothing under `tasks/done/` is edited or moved; the spike is read in place and stays there.

---

## 3. Language: Node, zero dependencies. The defence

**Recommendation: `bin/fkit-board.mjs`, plain Node, stdlib only (`node:http`, `node:fs`, `node:child_process`).**

Why, in order of weight:

1. ⭐ **The end-shape the spike's own README names is Node.** It says a real version belongs *"in aiboard, as a pluggable store-adapter seam (after the Node port), with fkit shipping the adapter for its own tree."* After P1, the adapter fkit ships is a **Node** adapter. Writing Node now is writing in the language the destination already needs — the rewrite is not thrown away by the port.
2. **It must shell out to `bash dashboard.sh` regardless**, because of the one-grammar rule. That is stdlib in both languages, so it is not a tiebreaker — but it means neither language avoids a subprocess, which removes the usual "Python is self-contained" argument.
3. **Verification step 9 is `node --test test/*.test.js`.** ADR-014 (*"black-box process contract, zero devDeps"*) is the repo's testing law and its runner is `node --test`. A Python component either gets no tests in that suite, or gets a Node test that shells to `python3` — which adds a second language prerequisite to a repo that has one. Node ≥20 is already a de facto prerequisite (`bin/generate-structure-manifest.mjs`, `bin/release.mjs`, `package.json` scripts); Python is declared nowhere.
4. **Measured: Node's parse path is 14–19 ms against the spike's 37 ms.** Not the reason. But it is not a cost either.

⚠️ **The honest counter-argument, which is real:** the spike exists and works today, and rewriting a working thing to gain nothing the owner can see is exactly the kind of move I should be suspicious of. If the answer to Q1 is "ship the absolute minimum until P1 lands," keeping Python and only fixing the paths is a defensible plan and I would implement it without complaint. **The thing I would not do either way is leave the second copy of the banner grammar in place** — that one is a rule violation, not a preference, and it is cheap to fix in either language.

---

## 4. Where it lives, and what it listens on

**`bin/fkit-board.mjs`**, run as `node bin/fkit-board.mjs`, with `npm run board` as the documented command.

Verified, so this is not a guess:
- `install.sh` copies **`claude/` only** (plus the two launcher scripts). `bin/` and `test/` are not in the install share — so this does **not** ship to consuming projects and does not make aiboard a dependency of fkit-the-product. That is a deliberate line, and it is Q3 below.
- `claude/structure-spec.md` covers `ai-agents/` and the two root context files only. A new `bin/` file trips no structure check and needs no manifest regeneration. Putting it under `claude/` instead would drag in dual-home `.claude/` parity and the skill-ownership surface for no benefit.

**The plain statement the brief asks for — what it listens on and what it accepts:**

> Binds **`127.0.0.1` only** (loopback, never `0.0.0.0`), default port `8585`, overridable with `--port`. Serves exactly four GET routes: `/` (aiboard's `index.html`, byte-for-byte as found), `/api/board`, `/api/tasks/<id>`, `/api/sprints/<id>`, plus `/api/check`. **Every other method — POST, PUT, PATCH, DELETE — is refused with a JSON error.** It opens no file outside fkit's `ai-agents/` tree except the single aiboard `index.html` path it was pointed at. It holds no credentials and reads no environment beyond the two path variables below.

T-022 is moot here, as the brief says — but that paragraph is what the brief asked for in its place, and it is a fresh statement about this reader rather than an import.

**Killing the hard-coded paths:**
- **fkit root** — discovered by walking up from `import.meta.url` to the directory containing `ai-agents/`. No configuration.
- ⚠️ **aiboard's `web/index.html` cannot be discovered from fkit's tree**, so it is resolved in order: `--aiboard <path>` → `FKIT_AIBOARD` env → sibling default `../aiboard/aiboard/web/index.html` (verified present on this machine). **If none resolve, exit non-zero naming all three ways** — never a silent 404.
- ⛔ **I will not vendor a copy of aiboard's `index.html` into fkit.** It is the obvious shortcut and I am naming it so nobody proposes it later: it forks aiboard's UI, guarantees drift the moment the Node port lands, and inverts the one-way dependency the owner set.

---

## 5. Getting the content right

**Sprint status — the one-grammar fix.**
- **One** `bash dashboard.sh select-active ai-agents/sprints` call per snapshot yields identity **and** canonical status for every open board. Verified output today includes `active file="sprint-11.md" identity="Sprint 11" status="In progress"`.
- **Archived boards take status from location** — `sprints/done/` → Done, `sprints/cancelled/` → Cancelled — which the same convention names under *"Location — the second carrier"*. No extra subprocess, still no second grammar. Verified `dashboard.sh status ai-agents/sprints/done/sprint-9.md` → `Done`, agreeing with location.
- Parse the selector's output **by key, never by position**, as that doc requires.
- ⚠️ `backlog.md` resolves `identity="Backlog" status="unresolved"`, and `dashboard.sh status` **exits 3** on it. Exit codes captured **directly, never through a pipe** (ADR-014). `unresolved` renders as `unresolved` — never silently as `backlog`. F2 is *"showed something FALSE even once."*
- ✅ Verification step 5 already passes under this design: Sprint 11 resolves **In progress**, confirmed today.

**Ids.**
- The reader emits `id` as a **JSON string**; aiboard's UI renders it with `<div class="id">${t.id}</div>` — plain string interpolation, no coercion. T-023 lives in aiboard's front-matter **write** path, which this reader never reaches.
- Convenient fact: **every one of the 411 ids begins with `0`**, so the whole corpus is the test, and `0013` is live in `backlog/`. Proof: assert `/api/board` carries every id as a string matching `^\d{4}$`, then show `0013` rendered.

**Task status — the six-value vocabulary, without inventing anything.**
- Measured the briefs: **118 `🔲` / 1 `🔄` / 1 `🚧` / 272 `✅` / 19 `⛔`** = 411. **Zero `➡️ Moved`** — confirming `Moved` is a *row disposition*, never a brief status, so it never reaches the reader. I will say that rather than inventing a column for it.
- aiboard's `statuses` array drives the columns. Four columns (`backlog / in-progress / done / cancelled`) + aiboard's **native `blocked` chip** (which its card renderer already supports) covers all five values that actually occur, with no invented value. `Done (agent-closed)` shows as a `done` card carrying the existing `agent-closed` label — matching `task-status-vocabulary.md`'s own note that the marker does not change the count.

**Poll cost.** The UI polls `/api/board` every **3000 ms** (verified). Budget: ~15 ms parse + ~60 ms selector ≈ **75 ms uncached, 2.5% of the interval** — against T-021's 24%. Cache the snapshot keyed on the max mtime across `ai-agents/tasks/*/*/brief.md` and `ai-agents/sprints/**/*.md`; recompute only on change. Record the final number with its counting rule beside it.

---

## 6. Tests — `test/board-reader.test.js`, `node --test`

1. **Snapshot shape** — all 411 ids are strings matching `^\d{4}$`; `0013` present and unmangled.
2. **Sprint status** — Sprint 11 → `In progress`; an archived board → `Done`; `backlog.md` → `unresolved`, never `backlog`. Includes a fixture board whose banner carries a **later `⛔`** in trailing prose — the specimen that broke the spike's first draft.
3. ⭐ **No second grammar** — the test greps the reader's own source for the banner glyph set / line-3 regex and **fails if present**. Cheap, and it is the standing F3 guard.
4. **Write-refusal** — start on an ephemeral port; assert POST/PUT/PATCH/DELETE are all refused; capture exit codes **directly, not through a pipe**.
5. ⚠️ **Write-proof, done correctly** — capture `git status --porcelain ai-agents/` **before and after** a full crawl plus every route, and assert the two are **identical**. **Not "empty"**: I checked, and the tree already carries uncommitted changes today (the `0404` folder move is staged), so an emptiness assertion would fail for reasons that have nothing to do with the reader. Verification step 4 has to be read as *unchanged by the run*, which is what it says.
6. **Path resolution** — missing aiboard path exits non-zero with a message naming all three ways to set it.
7. **Unknown id** — `/api/tasks/9999` returns 404 and leaks no filesystem path.

---

## 7. What it will NOT do — stated up front

- **Dependencies unmapped.** `index_fkit.py`'s own README withdraws its numbers because brief prose contains **negated** ids. Regex over `Depends on:` lines is not evidence of an edge, and I will not ship a graph I cannot defend.
- **No comments** — fkit has no comment store. `comments_count` stays 0.
- **`created` / `updated` / `last_activity` / `stale` stay null.** Briefs carry no timestamps. Git mtime is a *different claim* and I will not dress it up as one.
- **No board-row reconciliation** — that is `dashboard.sh`'s job and `rows.py`'s audit, not the reader's.
- **No write path, in any mode, behind any flag.**
- **Not shipped to consuming projects** (pending Q3).

**Verifying the claim that actually matters** — *"does he read his board this way"* — cannot be proven by a test. Proposal: he starts it from the documented command on this machine, opens it, reads Sprint 11 and two task cards, and says whether it beats the markdown. **Demonstrated in the session, not asserted.** ⛔ I propose **no follow-up cadence, reminder or check-in**: ADR-051 *§Amendment 9* forbids an agent inventing one, and the fallback tally is his and does not start until P1.

---

## Sequencing

1. Q1–Q3 answered → 2. `bin/fkit-board.mjs`: root discovery + aiboard path resolution + the four GET routes + blanket non-GET refusal → 3. task crawl + card mapping → 4. sprint status via the single `select-active` call + location for archives → 5. mtime cache → 6. `test/board-reader.test.js` → 7. measure at 411 and record with the rule → 8. `node --test test/*.test.js` + `git diff --stat` proof → 9. live demo to the owner.

---

## Open questions — ALL THREE RULED BY THE OWNER, 2026-09-20

Ruled live in a `fkit lead` session via `AskUserQuestion`. Each ruling below is **selected option text** — the
owner chose a pre-written option and typed no free text. It records *which option he picked*; it is **not** a
quotation of his own words.

**Q1 — hardening depth. RULED: (a) minimum viable. This ruling is also the PLAN APPROVAL.**
> "Minimum viable — approve and build. Node rewrite at roughly the spike's scope, plus the one-grammar status
> fix, path discovery, write-proof tests and an mtime cache. One sitting. Its defence: the spike's own README
> says the real version belongs in aiboard as a Node adapter after the port — so this is the same language and
> mostly the same code P1 will want, not throwaway. If the port changes the payload shape, only one mapping
> function changes."

**Q2 — language. RULED: Node, zero dependencies.**
> "Node, zero dependencies. Matches the end-shape the spike's own README names, and fkit's testing law runs on
> `node --test` — a Python component either gets no tests in that suite or adds a second language prerequisite
> to a repo that has one. Node is already a de facto prerequisite; Python is declared nowhere. Measured 14–19ms
> parse vs the spike's 37ms, though it says that's not the reason."

**Q3 — does it ship to consuming projects? RULED: repo-local, revisit after the port.**
> "Repo-local, revisit after the port. It verified that install.sh copies `claude/` only, so a file in `bin/` is
> repo-local by construction — no decision needed to keep it that way. Shipping it would make aiboard a soft
> dependency of fkit-the-product and needs a whole story about pointing at an aiboard checkout that nobody has
> asked for."

⭐ **Consequence of Q1 + Q2 together: build §Sequencing steps 2–9 in Node, at the scope described, and stop
there.** The deferred items in §7 stay deferred; the hardening in Q1's option (b) is **not** authorised.
