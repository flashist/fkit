# Review — `0411`

Task: `ai-agents/tasks/done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/brief.md`
File(s) under review: `bin/fkit-board.mjs` (new), `test/board-reader.test.js` (new), `package.json` (+1 script), `README.md` (+39 lines), this folder's `worklog.md`
Status: closed-out
Coverage: **reasoning-only second opinion** (ADR-042 D1 — the normal state, not a degradation). Codex ran (`codex-cli 0.152.0`, exit 0) and returned a usable, diff-grounded 16-finding pass, but every command it ran (`wc`, `perl`, `awk`, `rg`, `nl`, `head`) read source text or the markdown corpus — it never started the server, called `makeReader`, or ran the suite. All execution evidence in Round 1 is the Claude reviewer's.

**Scope separated before review.** The working tree also carries `0409` (13:40–15:11) and `0404` (the staged `backlog/`→`done/` folder move) changes. `0411`'s surface is the five paths above, all written 18:35–19:08 on 2026-09-20. Nothing under `tasks/done/`, `tasks/cancelled/` or `wiki-vault/` is in this task's surface.

## Reviewer findings

| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1 | high | `bin/fkit-board.mjs` — `readBoards()`, the board record's `goal:` field | Every sprint card's **Goal is the line-3 status banner**, not a goal. Ten of eleven boards publish a banner marker into `goal`; seven publish the legacy `🔒 CLOSED` beside a card badge reading `Done`. aiboard renders `s.goal` on every sprint card and in the drawer's `<dt>Goal</dt>`. This is also a **second, prefix-stripping read of the one-grammar carrier** (`(lines[2] \|\| '').replace(/^[>#\s]+/, '')`) that assertion C is green on. |
| R2 | 1 | med  | `bin/fkit-board.mjs` — `sprintDetail()`, `description: readFileSync(...).slice(0, 20000)` | The sprint drawer **silently truncates the board markdown mid-sentence, with no marker**. Measured: `S-011` serves 20,000 of 115,352 chars (17%), `BACKLOG` 2.3%, `S-002` 3.5%; nine of eleven boards exceed the cap. Nothing in the payload says the text is cut. |
| R3 | 1 | med  | `test/board-reader.test.js` — assertion E, *"a full crawl plus every route leaves `ai-agents/` byte-identical in git's eyes"* | The write-proof **cannot see a write to an already-dirty tracked file, nor anything created inside an untracked directory**. Verified: appending a byte to a file already showing ` M` under `ai-agents/` leaves `git status --porcelain` byte-identical. Today's tree has 8 such files plus one `??` directory (this task's own folder) whose whole contents collapse to one line. It proves "no change of git *status class*", not "wrote nothing". |
| R4 | 1 | med  | `test/board-reader.test.js` — assertion C, *"the reader re-states no part of the sprint-status grammar"* | The F3 guard is a **literal-string guard only**. An equivalent recognizer written with `\u` escapes and a character-class prefix regex scores **0 of 5** needles. Not theoretical: **R1 is exactly such a re-read and assertion C is green on it.** The positive half (`src.includes('select-active')`) is also satisfied by the comments alone. |
| R5 | 1 | low  | `bin/fkit-board.mjs` — `cacheKey()`, commented *"A max alone cannot see a DELETION … so a closed-and-moved task would serve stale"* | The count+max-mtime key **cannot see a task-folder RELOCATION — the very case the comment names**. The count is the total across all three boards (invariant under a move) and `mv`/`git mv` preserve the brief's mtime. Verified on a fixture: after `backlog/`→`done/` a warm reader serves `backlog` indefinitely while a fresh reader says `done`. The count catches a *deletion*, not a *move*. Live blast radius is the window between the mover's `git mv` and its status edits. |
| R6 | 1 | low  | `bin/fkit-board.mjs` — the server's `catch`, commented *"The message, never a stack and never a path"* | The **500 handler leaks an absolute filesystem path**, contradicting its own claim. Verified: `GET /` with a missing UI file returns `{"error":"fkit-board: ENOENT: no such file or directory, open '/tmp/definitely-not-here/index.html'"}`. Assertion G exercises only the 404 path. |
| R7 | 1 | low  | `bin/fkit-board.mjs` — `resolveAiboard()`, the `existsSync(flag)` check | The resolver **accepts a DIRECTORY as aiboard's `index.html`**. Verified: `--aiboard /tmp` resolves, the server starts, and `/` then returns the path-leaking 500 (R6) instead of the promised non-zero exit naming all three ways. Assertion F only covers a path that does not exist. |
| R8 | 1 | low  | `bin/fkit-board.mjs` — `fields()`, commented *"An EMPTY field followed by the next heading would otherwise capture that heading as its value"* | An **empty field swallows the next heading**. `## Priority` + blank + `## Status` loses `Status` entirely, so a `🔄 In progress` task in `backlog/` renders as `backlog`. The guard discards the bad *value* but the regex has already consumed the heading, so the real field is never matched. **Zero live instances** — latent. |
| R9 | 1 | low  | `bin/fkit-board.mjs` — `taskDetail()` vs `snapshot()`'s `byId` map | **Duplicate 4-digit ids cross-wire two tasks.** `tasks.find()` takes the first occurrence; `byId` is a Map whose last duplicate wins. Verified on a fixture: the response carries one task's title/status/folder with the *other* task's `brief` and `worklog`. `/api/check` reports no collision. **Zero live duplicates** — latent. |
| R10 | 1 | low | `bin/fkit-board.mjs` — `boardId()` / `boardIdFromFile()` | **Colliding board ids merge membership and hide a board.** `sprint-4.md` and `sprint-04.md` both normalise to `S-004`; the fallback also collides `foo.md` with `sprint-foo.md`. Both boards then receive the same task membership and `/api/sprints/<id>` returns only the first. **Zero live collisions** — latent. |
| R11 | 1 | low | `bin/fkit-board.mjs` — `selectActive()` and the startup probe in `main()` | The `dashboard.sh` contract check is `stdout.includes('⟦fkit-dashboard v2⟧')` and nothing else: **no exit-code check and no completeness check**, although `dashboard.sh` emits both `⟦SELECT⟧` and `⟦END⟧`. A truncated run carrying the marker starts the server and publishes partial statuses. Neither `spawnSync` sets a `timeout`, so a hung script blocks startup or the single-threaded server forever. Mitigated: missing candidates do land in `problems[]`, which `/api/check` surfaces — it degrades loudly, not silently. |
| R12 | 1 | low | `test/board-reader.test.js` — assertion G, the `'/api/tasks/../../etc/passwd'` case | **The traversal case never reaches the task route.** `fetch` normalises dot segments before transmission, so the server receives `/etc/passwd` and the assertion exercises only the generic 404 branch. Verified against a bare `createServer` echo. |
| R13 | 1 | low | `README.md` § *Reading the board in a browser (repo-local)* — *"It serves five GET routes and nothing else"* | **The route inventory is false by one:** `/index.html` is served as a sixth route alongside `/`. |
| R14 | 1 | low | `bin/fkit-board.mjs` — `readTask()`'s `priority` field, against aiboard's card renderer | The plan's stated reason for keeping the raw priority — *"aiboard's UI colours cards by the priority class"* — **does not hold**. aiboard styles exactly `.card.high`, `.card.medium`, `.card.low`; fkit emits **208 distinct priority values, none of them those**, so **no card is ever priority-coloured**, and 63 of 411 priorities split into several class tokens. Assertion A's `priority !== 'medium'` pins that state in place. Cosmetic, but it is a stated-and-absent behaviour in an approved plan. |

### Re-litigates settled decisions (suppressed — recorded, not dropped)

- **Sprint-status vocabulary mismatch** (Codex #6 — `statuses` advertises lowercase `backlog`/`in-progress`/`done`/`cancelled` while sprint records carry `In progress`/`Done`/`Cancelled`/`unresolved`, so aiboard's native sort key misses). **Settled twice over:** the invoker bounded aiboard's sprint-card sort degradation as out of scope (aiboard's side, cosmetic, badge still correct), and `plan.md` §5 explicitly rules that the canonical status string is published **verbatim** and that `unresolved` must never silently render as `backlog` (ADR-051 F2). Re-raise only if aiboard's renderer is changed to accept fkit's vocabulary.
- **No `Host`/`Origin` validation — DNS-rebinding read exposure** (Codex #10, independently reproduced: `Host: evil.example.com` → `200`, all 411 tasks). **Real, and it lands inside the hardening the owner explicitly did NOT authorise** (`plan.md` §Q1 — option (b) "harden now" is not authorised; §Consequence *"the hardening in Q1's option (b) is **not** authorised"*). The brief's own T-022 row asks this task only for *"an explicit statement of what it listens on and what it serves"* — which `README.md` delivers. **Recommended for the owner as a named accepted residual** rather than a 0411 fix, so it is not lost before the aiboard port.
- **Symlinks escape the README's filesystem boundary** (Codex #11). Downgraded and **not** recorded as a defect: `statSync`/`readFileSync` following a symlink placed inside the owner's own `ai-agents/` tree is not a boundary this reader claims to enforce, and planting one already requires write access to the repo.
- **Absent dependency graph, absent timestamps, absent board-row reconciliation, no comment store, not shipped to consuming projects** — owner-ruled deliberate omissions (`plan.md` §7 and rulings Q1/Q3, 2026-09-20). Not defects.
- **Out of scope per the invoker:** `0014`'s `🔲 Backlog` inside `done/` (open task `0296`), the two stray `|` in `backlog.md` (open task `0322`).

### Verified clean — do not chase these

- ⭐ **No figure in any shipped artifact is sourced from the Python spike.** I reproduced every one independently: 411 tasks / 11 boards / **254,593** payload bytes; `/api/tasks/0013` **23,572** bytes; `/api/sprints/S-011` **24,825** bytes, 5 `tasks_detail` rows, status `In progress`; aiboard's `index.html` **30,890** bytes; full recompute 128–130 ms, cache hit 2.1–6.6 ms; board totals sum to 411 of 411. The spike's signatures (269,780 bytes, 10 boards, `priority:"medium"`, HTML 501 pages) appear **nowhere** except where `plan.md` §1 explicitly attributes them to the spike. `any priority === "medium"` → `false`. The wrong-server incident left no residue in the record.
- **The reader genuinely cannot write.** It imports no write-capable fs API at all — only `existsSync`, `readdirSync`, `readFileSync`, `statSync`, `spawnSync`. That is a stronger static guarantee than assertion E provides (see R3). `dashboard.sh` performs no file redirection either.
- **Path traversal is closed** on both detail routes: task ids are gated on `^\d{4}$`, and sprint ids are matched against the enumerated board list, never used to build a path.
- **D11 was the right call, and the README's replacement wording is accurate.** `plan.md` is the approved contract; editing it after approval would falsify the record. Its §4 sentence contradicts §3 and §5 of the same document, and §3/§5 carry an explicit requirement, so §3/§5 win. The README discloses the `dashboard.sh` subprocess explicitly in the same sentence, so a reader of it learns everything the code does. No finding.
- **The unescaped-attribute observation is aiboard's, not fkit's — and it has two fields, not one.** aiboard defines an `esc()` and applies it to `title` and `assignee`, but not to `priority`, `sprint`, `id` or `status`. The worklog names `t.priority` (`class="card ${t.priority}"`); **`t.sprint` has the same exposure** (`data-ref="${t.sprint}"` plus element text) and comes from a brief's `## Sprint` line via `boardId()`'s `\S+` capture. I re-verified **both**: zero live values contain `"`, `<`, `>` or `&`. Recommendation: route upstream through `aiboard-lead`, amend the worklog to name `t.sprint`, and do **not** defend against it in `0411` — the defence is the un-authorised hardening.
- All **9** tests in `test/board-reader.test.js` pass on my own run. The full-suite (985/0) and prove-red gate results are the driver's independent verification, not re-run here.
- Brief verification step 8 holds for `0411`: its change surface touches nothing under `tasks/done/`, `tasks/cancelled/` or `wiki-vault/`.

## Coder response

<!-- CODER-OWNED. The reviewer never writes this section. -->

> **Round 1, processed 2026-09-21** by a spawned `fkit-coder` **Process-review worker** under
> `/fkit-sprint-ship-loop`'s declared-approval marker. Owner rulings of 2026-09-21 cover R1, R2, R14
> and the DNS-rebinding residual; **R3 and R5–R13 were dispositioned by me** under the standing
> approval, and every fix applied unattended is in `worklog.md`'s decision log.
>
> ⭐ **Severity is mine, derived from blast radius traced in the code — not inherited.** I re-graded
> **two of fourteen, both UPWARD**: **R4 med → high** and **R5 low → medium**. Reasons in the rows.

| #  | Verdict | Sev (mine) | Defect / Frontier | Action | Status |
|----|---------|-----------|-------------------|--------|--------|
| R1 | CORRECT | **high** (=) | Defect | `goal` is now `null`. fkit's board format has no goal field; line 3 is the status banner, so every card and drawer showed a status labelled "Goal". ⚠️ The ruling's other option — *"the first non-blank line AFTER the banner"* — was **rejected with cause**: the banner is a blockquote spanning many lines, so finding where it ENDS is the grammar this file may not re-derive. `null` is the option that fixes the rule violation instead of relocating it. aiboard renders `s.goal ? … : '—'`, verified, so null degrades to its own absence glyph. | ✅ done |
| R2 | CORRECT | **medium** (=) | Defect | Truncated descriptions now carry `⚠️ … truncated, N of M characters …`. ⭐ The marker **LEADS** the text, and that is not cosmetic: aiboard renders the description through `.replace(/^## Tasks[\s\S]*$/m, '')`, which **deletes everything from a `## Tasks` heading onward** — a trailing marker would vanish on any board carrying that heading inside the cap. Asserted as-rendered, not just as-served. | ✅ done |
| R3 | CORRECT | **medium** (=) | Defect (assurance, not behaviour) | New assertion **E2** pins the static proof: `node:fs` imports exactly the four read calls, `node:child_process` exactly `spawnSync`, and a banned-needle sweep closes the routes that bypass an import list. ⭐ The reviewer is right that this is the stronger proof — the code was always correct; the *guard* overstated itself. E is kept, with its blindness now stated in the file rather than implied. Expected list is hard-coded, per ADR-014 *"a test whose oracle is the implementation tests nothing"*. | ✅ done |
| R4 | CORRECT | **high** ⬆️ *(reviewer: med)* | Defect | ⭐ **Raised, and this is the finding of the round.** I re-injected the exact `goal:` line that shipped: the old guard scored **0 of 5 needles** — it was *green on a live rule violation*, which is why R1 reached the owner at all. A standing F3 guard that passes the defect it exists to catch is not a medium. Guard C now (a) scans a **decode-escaped** copy, defeating the `\u` dodge, and (b) adds **structural** needles — a character class holding both `>` and `#`, and line 3 reached by index. Red-proved twice, both from 0-of-5 starts. | ✅ done |
| R5 | CORRECT | **medium** ⬆️ *(reviewer: low)* | Defect | **Raised.** This is ADR-051 **F2** — *"wrong status"* — on the single most common mutation in this repo: the movers relocate folders constantly, `mv` preserves the brief's mtime, and the TOTAL count is invariant under a move, so a warm reader served the old board **indefinitely**, not just for a window. `cacheKey()` now carries **per-board** counts (`119/273/19` → `118/274/19`). ⚠️ Still blind to a rename *inside* one board; stated in the code rather than implied. | ✅ done |
| R6 | CORRECT | **low** (=) | Defect | Reproduced exactly: the 500 echoed `…open '/tmp/…/index.html'` while its own comment said *"never a path"*. The handler now reports the error **code** (`ENOENT`) and never the message. Narrow — loopback-only, the owner's own path on the owner's own machine — but the contradiction with its own comment is the sharp part. | ✅ done |
| R7 | CORRECT | **low** (=) | Defect | Reproduced: `--aiboard /tmp` resolved, because `existsSync` is true for a directory. `resolveAiboard()` now requires `statSync(p).isFile()`, so a directory takes the non-zero exit naming all three ways that the function already promised. **In-plan, not hardening** — it makes a stated promise true rather than adding a new defence. | ✅ done |
| R8 | CORRECT | **low** (=) | Defect (latent) | Confirmed by reading `FIELD_RE`: the guard discarded the bad *value* but the regex had already consumed the next heading, so a task's real status vanished. Fixed with a `(?!## )` lookahead. ⭐ **Proved a no-op before applying it**: parsed all **411** live briefs under both regexes — **0 differing**. Zero live instances, so this is latent-only. | ✅ done |
| R9 | CORRECT | **low** (=) | Defect (latent) | Confirmed: `tasks.find()` takes the first, the `byId` Map kept the last, so a duplicate id served one task's title beside the other's brief. `byId` is now built first-wins, so the two lookups agree by construction. **Zero live duplicates.** ⛔ I did **not** add duplicate *detection* — that is new surface, not a consistency fix. | ✅ done |
| R10 | CORRECT | **low** (=) | **Frontier — needs an owner call** | Confirmed: `sprint-4.md` and `sprint-04.md` both normalise to `S-004`. ⛔ **Not fixed, deliberately.** The fix requires deciding whether those two *should* collide (one sprint, two files = a repo error) or be held apart — a normalisation decision with no dominant answer, and **zero live collisions**. Fixing it on my own judgement would be the unauthorised hardening the Q1 ruling excludes. ⭐ **Owner-ruled 2026-09-21: record as a residual, do not fix** — recorded in *Accepted residuals* with its re-raise condition (a live collision actually appearing). | won't fix (frontier) |
| R11 | **PARTIALLY CORRECT** | **low** (=) | Defect (one half) | ⚠️ **The "publishes partial statuses" half is overstated, and I checked before agreeing.** I traced `readBoards()`: a board with no candidate record gets `unresolved` **plus** a `problems[]` entry surfaced on `/api/check` — loud degradation by design (worklog D10), not a silent false status. **The timeout half is real and is fixed**: `spawnSync` blocks a single-threaded server, so both call sites now carry `timeout: 30000` (~300× the measured 92–110 ms), which routes a hang into the `r.error` path that already existed. No new behaviour. ⛔ The exit-code half is **not** actioned: exit 3 is a documented ANSWER (*"no sprint is eligible"*), so a bare non-zero check would break a working case. | ✅ done |
| R12 | CORRECT | **low** (=) | Defect (test) | Reproduced against a bare `createServer`: `fetch` normalises dot segments, so `/api/tasks/../../etc/passwd` arrived as `/etc/passwd` and the case was a duplicate of `/nope` wearing a traversal's name. Rewritten percent-encoded (`%2e%2e%2f`, verified **not** normalised) so it reaches the id gate, and a sprint-route case added to exercise `decodeURIComponent`. ⚠️ Traversal itself was, and is, genuinely closed. | ✅ done |
| R13 | CORRECT | **low** (=) | Defect (doc) | Confirmed: `/index.html` is served alongside `/`. README now reads *"six GET paths"* and names the alias. | ✅ done |
| R14 | CORRECT | **low** (=) | Frontier — owner-ruled | Verified against aiboard's stylesheet: only `.card.high`, `.card.medium`, `.card.low` exist, and fkit emits none of them, so no card is ever priority-coloured. **Owner ruled: record the correction, keep the real values** (flattening would still lose signal). ⛔ The correction is recorded in `worklog.md` and here — **`plan.md` is the frozen approved artifact and was not edited.** No code change. | won't fix (frontier) |

## Accepted residuals (shared, do-not-re-litigate)

<!-- Entries are added only once the OWNER approves treating a finding as a settled tradeoff. -->

- **No `Host`/`Origin` validation — a read-exposure class on the loopback listener** — **What:** the
  reader binds `127.0.0.1` and validates no request `Host` or `Origin` header. The class is already on
  record in [`ADR-049`](../../../knowledge-base/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
  (*"there is no `Host` check either, so DNS-rebinding is not excluded"*), which also fixes how it may
  be written down: ⛔ **that ADR's disclosure limit — _"described as a defect class and nothing more.
  No payload, no reproduction steps, no working exploit appears in this git-tracked document"_ — binds
  this entry, and is why no reproduction appears here.** · **Why (structural):** it is read-only
  exposure of data already on the owner's machine, and the fix sits inside the hardening the Q1 ruling
  explicitly did **not** authorise (`plan.md` §Open questions, *"the hardening in Q1's option (b) is
  **not** authorised"*). The brief's T-022 row asks this task only for *"an explicit statement of what
  it listens on and what it serves"*, which `README.md` delivers. ⛔ A `Host` check was offered to the
  owner and **declined** — do not implement one. ⚠️ Per ADR-051 D7, T-022 is **aiboard's** task and
  **no fkit task may be filed for it**. · **Re-raise only if:** a write mode is proposed for this
  reader (ADR-049 D4 makes closing T-022 a precondition, not a follow-up); **or** the listener is ever
  bound to anything other than loopback; **or** a second uid, a second machine, or a second human
  enters the picture (ADR-049's own re-raise trigger); **or** the owner asks for hardening.
  **Owner-ruled 2026-09-21** — recorded with a re-raise condition rather than quietly dropped.

- **Priority values are published raw, and aiboard colours none of them** (R14) — **What:** the reader
  publishes each brief's real `## Priority` verbatim (`Unscheduled`, `P3`, bare legacy ranks, `—`),
  and aiboard styles only `.card.high` / `.card.medium` / `.card.low`, so **no card is ever
  priority-coloured**. · **Why (structural):** `plan.md` §2 justified keeping raw values *because*
  "aiboard's UI colours cards by the priority class" — **that reason is false**, verified against
  aiboard's stylesheet. The **conclusion still stands on a different footing**: flattening to a class
  aiboard recognises would discard signal the owner can read today, and inventing a value would breach
  the task-status/priority vocabularies. ⛔ `plan.md` is the frozen approved artifact and is **not**
  edited; the correction lives here and in `worklog.md`. ⚠️ ADR-046's re-raise trigger — *"a second
  machine consumer of a sprint board's Priority cell appears and requires a rank-shaped value"* — was
  checked and is **not** met: this reader is a second consumer but requires nothing of the shape, it
  passes the cell through. · **Re-raise only if:** aiboard's renderer is changed to accept fkit's
  priority vocabulary, **or** a consumer appears that needs a rank-shaped value.
  **Owner-ruled 2026-09-21** — record the correction, keep the values.

- **Colliding board ids merge two boards, and that is left alone** (R10) — **What:** `boardId()` /
  `boardIdFromFile()` normalise `sprint-4.md` and `sprint-04.md` to the same `S-004`; the fallback
  likewise collides `foo.md` with `sprint-foo.md`. Both boards would then receive the same task
  membership and `/api/sprints/S-004` would return only the first, hiding the other. `/api/check`
  reports no collision. **Zero live collisions today.** The reader is shipped this way deliberately. ·
  **Why (structural):** the fix is **not mechanical** — it requires first deciding whether two files
  naming one sprint number *should* merge (one sprint committed twice is itself a repo error, and
  merging may be the honest answer) or be held apart by filename. **No option dominates**, so it is a
  design question rather than a bug fix, and it sits outside the **minimum-viable** scope the Q1 ruling
  set (`plan.md` §Open questions, *"the hardening in Q1's option (b) is **not** authorised"*). Rejected
  alternatives: padding both to a canonical form (silently merges two real boards), and keying on the
  filename stem (splits `Sprint 4` from itself whenever a board is renamed). Deciding either
  unilaterally is the frontier-move this loop stops for. · **Re-raise only if:** **a live collision
  actually appears** — two board files normalising to one id in the tree.
  **Owner-ruled 2026-09-21**, live `fkit lead` session via `AskUserQuestion`. ⚠️ The ruling below is
  **selected option text** — the owner chose a pre-written option and typed no free text; it records
  *which option he picked* and is **not** a quotation of his own words:
  > "**Record as a residual, don't fix.** The coder's position: fixing it means deciding whether two
  > files naming one sprint SHOULD merge, and no option dominates. That's a design question, not a bug
  > fix, and it's outside the minimum-viable scope you set. Zero live collisions — record it with a
  > re-raise condition if one ever appears."
