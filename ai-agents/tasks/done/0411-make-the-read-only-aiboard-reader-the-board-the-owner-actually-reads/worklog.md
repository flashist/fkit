# Worklog — `0411` Make the read-only aiboard reader the board the owner actually reads

> **Who wrote this.** A spawned `fkit-coder` **Build worker**, under `/fkit-sprint-ship-loop`'s
> declared-approval marker (ADR-032 Decision 3 + its 2026-07-22 autonomy amendment). The approved plan
> is `plan.md` in this folder; it is both the standing approval and the scope boundary. No owner
> channel (ADR-021).

---

## 2026-09-20 — plan-pointer verification, before writing anything

The spawn prompt carried the plan text inline **and** a pointer, with the instruction to verify the
pointer before writing. Verified with `Bash`, not the `Read` tool:

```
git hash-object …/plan.md  →  84d80ecc93db018ebcf9fd6db84c32b04b2a6b60
wc -c                      →  18113
```

Both match the pointer the driver gave. The file was then read in full from disk and its operative
content agrees with the inline copy. **No discrepancy to escalate.**

---

## 2026-09-20 — grounding measurements (re-run by me, on this machine, today)

⚠️ These are **my** measurements, not carried numbers. Where they agree with the plan I say so;
where they add something the plan did not have, that is flagged.

| Fact | Measured | Counting rule |
|---|---|---|
| Task folders | **411** | `ai-agents/tasks/{backlog,done,cancelled}/[0-9][0-9][0-9][0-9]-*/` → 119 + 273 + 19. |
| Briefs present | **411 / 411** | Zero folders without `brief.md`. |
| `## Status` first glyph | **118 `🔲` / 1 `🔄` / 1 `🚧` / 272 `✅` / 19 `⛔` = 411** | first non-blank line after `## Status`, first two bytes. **Agrees with the plan exactly.** |
| `dashboard.sh status ai-agents/sprints/backlog.md` | **exit 3, empty stdout** | captured with `out=$(…); rc=$?` — **not through a pipe**. |
| `dashboard.sh status ai-agents/sprints/sprint-11.md` | **exit 0, `In progress`** | same. |
| `dashboard.sh status ai-agents/sprints/done/sprint-9.md` | **exit 0, `Done`** | same. |

⭐ **A pipe really does hide this.** `bash dashboard.sh | head -40` reported `EXIT: 0` for a command
that had not failed — but the `$?` read belongs to `head`, not `dashboard.sh`. Recorded because the
plan's rule ("capture exit codes directly, never through a pipe") is easy to read as pedantry until
you watch it swallow one.

### New facts the plan did not have — found while grounding

1. ⚠️ **Only 405 of 411 briefs have a `## Priority` field.** Six do not:
   `0122`, `0123`, `0124`, `0125`, `0126`, `0136` (all in `done/`). The plan says *"keep the board's
   real `P<n>` priority — do not flatten"* but says nothing about absence.
2. ⚠️ **The priority field is not a vocabulary.** 172 `Unscheduled`, 35 bare `P<n>`, ~30 of the older
   `Sprint 6 P9` form, ~150 bare integers (legacy append rank), one literal `—`, and three carrying
   trailing prose. **No brief's priority contains `"`, `<`, `>` or `&`** — checked, because aiboard
   interpolates `t.priority` into a `class="card …"` attribute **unescaped**. Raw pass-through is
   therefore safe **today**; it is not structurally safe, and that is stated rather than assumed.
3. ⚠️ **A real drift fact, found by making the per-folder tallies close.** Broken out by folder:
   `backlog/` = 117 `🔲` + 1 `🔄` (this task) + 1 `🚧` (`0135`) = 119; `cancelled/` = 19 `⛔`;
   `done/` = 272 `✅` **+ one `🔲 Backlog`** = 273. That one is
   `ai-agents/tasks/done/0014-align-conventions-readme-enforcement-item-live-vs-scaffold/`, whose
   folder says closed and whose `## Status` field still says `🔲 Backlog`. **The reader renders it as
   `done`**, because the folder is the key (ADR-029) and the movers move folders. ⛔ **Nothing is
   repaired** — it is in `done/`, which is frozen, and repair is not this task's scope. Recorded so the
   discrepancy is attributable to the corpus rather than to the reader.
4. ⚠️ **aiboard's sprint-card sort degrades to id-order under fkit's canonical sprint statuses.**
   `renderSprints` sorts with `order = { 'in-progress': 0, backlog: 1, done: 2, cancelled: 3 }`. Fed
   `In progress` / `Done` / `unresolved`, every lookup is `undefined`, the subtraction is `NaN`, `NaN`
   is falsy, and the comparator falls through to `a.id.localeCompare(b.id)`. **Not a crash, and not a
   false statement** — the badge still reads the true status. It is a cosmetic consequence of the
   plan's explicit ruling that the payload carries fkit's canonical status, and it is recorded here so
   nobody later reports it as a bug in the reader.
5. ⭐ **`select-active`'s `candidate` lines cover every depth-1 `*.md`**, confirmed in
   `mode_select_active` (*"DEPTH 1 ONLY — `done/` and `cancelled/` are excluded by construction"*). So
   one call yields identity **and** canonical status for both open boards — `sprint-11.md` and
   `backlog.md` — which is exactly the single-call design the plan requires.
6. ⚠️ **`backlog.md` has no line-3 banner at all** (line 3 is ordinary prose). That is *missing*, not
   *malformed*, and the convention resolves both to `unresolved`. Confirmed against the live file.

---

## Decision log — choices made unattended, under the standing approval

> ⛔ Recorded per ADR-019's audit obligation and ADR-020's worklog decision log. Cited by anchor, not
> by line number ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
> Each entry says **what changed**, **why it qualified**
> (verified-`CORRECT` + mechanical/localized + in-plan, or obvious-winner-within-intent), and what it
> answers. Nothing here is a frontier-move; anything that looked like one is in *Escalations* below.

| # | Decision | Why it qualified |
|---|---|---|
| D1 | **Absent `## Priority` renders as `—`.** | Obvious winner within intent. The plan forbids *flattening* (`"medium"`), and inventing `Unscheduled` for a brief that states nothing would be an F2 ("showed something FALSE"). `—` is **aiboard's own glyph for absence** — its drawer already renders `—` for an empty assignee and empty blockers — so this speaks the UI's existing vocabulary rather than fkit's status vocabulary. One brief has `—` typed as its literal priority; that author meant the same thing, so the collision is harmless. |
| D2 | **Priority is dropped from `labels`.** | Mechanical. The spike pushed the priority string into `labels` *because* it had flattened the `priority` field to `"medium"`. The plan restores the real priority to its own field, which aiboard already renders as a chip — leaving it in `labels` would print the same chip twice. |
| D3 | **Every non-GET method is refused, not only POST/PUT/PATCH/DELETE.** | Mechanical and strictly safer. The plan names those four; refusing everything that is not `GET` is a superset that cannot admit a write by omission (`HEAD` included). `405` is used rather than the spike's `400`, because the body is a JSON error either way and `405` is the correct code. |
| D4 | **`dashboard.sh` is resolved from `claude/skills/fkit-status/`, falling back to `.claude/skills/fkit-status/`.** | Mechanical, and it guards a real failure. `.claude/skills/fkit-*/` is **gitignored** — on the clean checkout verification step 3 demands, only the canonical `claude/` copy exists. Preferring canonical with a fallback costs two lines. |
| D5 | **The cache key carries a file *count* as well as a max mtime.** | Mechanical correctness. The plan says "keyed on max mtime"; a max mtime alone cannot see a **deletion** (removing the newest file lowers the max, but removing an older one changes nothing), so a closed-and-moved task could serve stale. Counting the files closes that without changing the design. |
| D6 | **`backlog.md` is rendered as a board, and tasks whose `## Sprint` reads `Backlog` attach to it.** | In-plan. The plan's §6 test 2 requires the reader to resolve `backlog.md → unresolved`, which is only meaningful if the board appears; and §5 says the single call covers *"every open board"*, which `select-active` defines as both depth-1 files. Attaching its 175 tasks is the truthful option — those tasks **are** on that board — where an empty `0/0` progress bar would not be. |
| D7 | **Archived boards get a filename-derived display id; open boards get theirs from `dashboard.sh`.** | In-plan, with its cost named. The plan rules archived status from **location** and says so explicitly — *"No extra subprocess, still no second grammar"* — and location carries no identity. An id is a **display key**, not a status claim and not a selection: nothing selects a board here. `sprint-9.md → S-009`; a non-numeric suffix (`sprint-4c.md`) passes through as `S-4c` rather than being coerced. |
| D8 | **Task id comes from the folder name, not the `## ID` field.** | In-plan. ADR-029 makes the folder the key. Where the two disagree that is board drift, and the plan's §7 puts reconciliation out of scope (*"no board-row reconciliation"*). |
| D9 | **An EXPLICIT `--aiboard` / `FKIT_AIBOARD` that does not exist is an ERROR, not a fall-through to the sibling default.** | Obvious winner within intent. The plan's precedence order is `--aiboard` → env → default, and its rule is *"never a silent 404."* Serving some other file because the one the owner **named** was missing is the same class of silent wrong answer. Only the sibling default stays soft. It also makes the failure testable on a machine where the sibling default happens to exist — which is this one. |
| D10 | **The reader refuses to START if `dashboard.sh` does not emit `⟦fkit-dashboard v2⟧`.** | In-plan, and the convention's own instruction. `dashboard.sh`'s marker comment says a consumer reading an unknown shape must **refuse rather than guess**. The alternative — start, and render every board `unresolved` — leaves the owner to notice by eye that his statuses stopped working. A mid-run failure still degrades to `unresolved` plus a problem on `/api/check`, because by then refusing would take the whole board away. |
| D11 | **The README's "what it listens on" paragraph says the reader also executes `dashboard.sh`.** The plan's §4 sentence — *"opens no file outside fkit's `ai-agents/` tree except the single aiboard `index.html`"* — is **imprecise as written**. | Documentation correction, in-plan. The same plan's §3 lists `node:child_process` among the reader's imports and its §5 **requires** the `select-active` subprocess, so §4's sentence contradicts two other sections of its own document. The build follows §3/§5; the statement the owner reads is corrected to match what the thing actually does. ⚠️ **Surfaced to the driver rather than only fixed** — it changes a sentence the plan put to the owner. |

### Escalations

**None.** No frontier-move, no regression, no disputed severity, nothing outside the approved plan.
D11 is the only item that touches the plan's own wording, and it corrects a documentation sentence
against two other sections of the same plan rather than changing anything that was built.

---

## 2026-09-20 — ⚠️ THE MEASUREMENT DEMO READ THE WRONG SERVER, AND THAT IS THE BEST FINDING

⛔ **The Python spike is STILL RUNNING on this machine, listening on `127.0.0.1:8585`** — the reader's
default port. `lsof -nP -iTCP:8585 -sTCP:LISTEN` names `Python PID 92326`.

The first live demo started `npm run board`, which failed with `EADDRINUSE`, and **every `curl` in that
demo was answered by the spike.** It looked plausible — 411 tasks, `read_only: true` — and three details
gave it away:

- `priority` came back `"medium"`, the spike's flattening, which this reader does not do;
- it reported **10** boards with `done` / `in-progress`, not **11** with `Done` / `In progress` /
  `unresolved`;
- `POST` returned `{"error": "read-only spike: nothing is ever written"}` — the spike's own words — and
  `PUT` / `PATCH` / `DELETE` returned **Python's default HTML 501 page**, not a JSON error. ⭐ **The spike
  refuses POST and nothing else**; three write verbs fall through to `BaseHTTPRequestHandler`. That is a
  real gap in the spike, found only because it answered a test meant for something else.

⭐ **The reader failed the right way**: `EADDRINUSE` exits **2** with the message on stderr (captured
directly — `node bin/fkit-board.mjs --port 8585; echo $?` → `exit=2`). It did not start half-working.

⚠️ **Nothing was done about PID 92326.** It is the owner's process and killing it was not asked for.
**It matters for the live demo (plan step 9): either stop that process first, or run the reader with
`--port 8686`.** The demo below was re-run on `8686`.

---

## 2026-09-20 — the measurement, with its counting rule

`node bin/fkit-board.mjs --bench`, on this machine, today. ⛔ **Two numbers, because one would be
flattering and measure the wrong thing.**

| Number | Measured | Counting rule |
|---|---|---|
| **Full recompute** | **111 / 119 / 127 ms** | A **fresh reader each iteration**, so nothing is served from cache: one `select-active` subprocess + `readFileSync` of all 411 briefs (4,839,179 chars) + the `existsSync` probes + JSON build. This is the number comparable to the spike's 37 ms, which had no cache. |
| **Cache hit** | **1.76 / 2.50 / 5.71 ms** | Re-`stat` all 411 `brief.md` files and all 11 board files, compare the `count:count:max-mtime` key, return the memo. This is what the UI's 3-second poll actually costs once the tree is quiet. |
| **Corpus** | **411 tasks, 11 boards, 254,593 payload bytes** | Directories matching `^[0-9]{4}-` under `ai-agents/tasks/{backlog,done,cancelled}` — 119 + 273 + 19. Boards: 2 open (depth-1) + 9 archived. |

**Against the 3000 ms poll:** full recompute **≈ 4.0 %**, cache hit **0.06 – 0.19 %**. T-021's figure
for aiboard's own store at this scale was 729 ms ≈ **24 %**.

⚠️ **The plan's component estimate was wrong in an interesting direction, and it is corrected rather
than quietly matched.** The plan budgeted *"~15 ms parse + ~60 ms selector ≈ 75 ms"*. Measured, the
**subprocess dominates**: `select-active` costs **92 – 110 ms** when spawned from inside Node
(`spawnSync`), against **60 – 70 ms** measured externally with `/usr/bin/time -p`. Both figures are
real — the gap is Node's fork/exec overhead from a larger process — and the one that matters is the
in-process one, because that is what the reader pays. Reading all 411 briefs is **~73 ms**. ⭐ **The
expensive part is the one subprocess, not the file crawl**, which is precisely why the plan's
one-`select-active`-call rule (against ten `status` calls at ~240 ms) was the right design and why the
mtime cache earns its place.

---

## 2026-09-20 — the demo, run rather than asserted

`npm run board -- --port 8686`:

```
fkit-board  http://127.0.0.1:8686/   (read-only — Ctrl+C to stop)
  tree     /Users/mark.dolbyrev/Workspace/fkit/ai-agents
  aiboard  /Users/mark.dolbyrev/Workspace/aiboard/aiboard/web/index.html  (sibling default)
  status   /Users/mark.dolbyrev/Workspace/fkit/claude/skills/fkit-status/dashboard.sh
```

- **`/`** — 30,890 bytes, `cmp` says **byte-identical** to aiboard's own `web/index.html`. ⛔ No copy
  of that file exists inside fkit.
- **`/api/board`** — 411 tasks, 11 boards, `read_only: true`, 254,593 bytes. Board statuses:
  `BACKLOG = "unresolved"` (175 tasks), `S-011 = "In progress"` (5), `S-001…S-009 = "Done"`.
  The eleven totals sum to **411** — every task attaches to a board.
- **Ids** — `0013` comes back as the JSON **string** `"0013"`, not `13` and not a number.
- **Priority** — real values, not flattened: `Unscheduled`, `P3`, `P4`, `P5`, bare legacy ranks (`67`,
  `72`), the literal `—`, and the one with trailing prose.
- **Write refusal** — `POST / PUT / PATCH / DELETE / OPTIONS / TRACE` all return **405** with
  `{"error":"fkit-board is read-only: it serves GET and nothing else. Nothing is ever written."}`
- **404s** — `/api/tasks/9999`, `/api/tasks/nope`, `/api/sprints/S-999`, `/nope` all return exactly
  `{"error":"not found"}`, leaking no filesystem path.
- **`/api/check`** — `{"ok":true,"problems":[]}`.
- **Detail routes** — `/api/tasks/0013` 23,572 bytes with `brief`, `worklog` and `comments` arrays
  present; `/api/sprints/S-011` 24,825 bytes with 5 `tasks_detail` rows and `status` `"In progress"`.

⚠️ **One cosmetic consequence, recorded rather than hidden.** A brief whose `## Priority` field carries
trailing prose renders as a very wide chip on its card — aiboard puts `t.priority` in a chip verbatim.
It is **true**, just long. Truncating it would be this reader inventing a shorter claim than the brief
makes, so it is left alone and reported.

---

## 2026-09-20 — verification

- **`npm run test:unit`** (= `node --test test/*.test.js`): **985 tests, 985 pass, 0 fail** — the whole
  repo suite, including the 9 new ones. Duration 81.7 s.
- **`test/board-reader.test.js`**: 9 tests, all green.
- ⭐ **The F3 guard was RED-PROVED, not merely written.** Appending `// In progress` to
  `bin/fkit-board.mjs` turned assertion C red with the intended message; the file was then restored and
  `diff` confirmed byte-identical. An unfalsifiable guard is decoration.
- ⚠️ **`bash test/prove-red.sh` was STARTED AND NOT RUN TO COMPLETION.** It is the second half of
  `npm test`, and the plan's step 8 asks only for `node --test test/*.test.js`. **What did run, and was
  green:** all fifteen baseline checks `0a`–`0o`, including `0a` (*"baseline — real launcher should be
  green"*) and `0b` (*"unmutated full copy should be green"*), **which execute the entire suite with
  the nine new tests in it** — those are the only prove-red checks this change can affect. Mutations 1
  and 2 then went red as they are supposed to, and the run was stopped during mutation 3. ⛔ **Reason:
  runtime, nothing else.** `run_suite()` re-runs the whole 985-test suite per launcher mutation at
  ~82 s each across ~40 mutations — roughly 80 minutes, which a bounded spawn cannot hold and which
  would tie up the owner's machine during the live demo. ⭐ **No mutation in it touches this task's
  files**, and `dashboard.sh`'s mutations run `run_dashboard_suite()`, which executes **only**
  `dashboard-contract.test.js` — so the new suite cannot distort a mutation's reading either.
  **Someone should still run the full gate before this merges; I did not.**
- **Write-proof**: assertion E captures `git status --porcelain -- ai-agents/` before and after a full
  crawl plus every route and asserts the two are **identical**. Today that state is **20 non-empty
  lines**, so "identical" is a real comparison and not `"" === ""`.
- **The manual demo also left `ai-agents/` untouched** — the only new entry under it is this task's own
  folder, which I wrote by hand, not through the server.

### Verification steps 1–9 from the brief

| # | Step | State |
|---|---|---|
| 1 | Plan names what of the spike survives, and why; owner approved at the plan gate | ✔ `plan.md` §2, approved 2026-09-20 |
| 2 | The hardening trade was put to the owner with a recommendation and its cost | ✔ Q1, ruled *minimum viable* |
| 3 | Owner can start it from a documented command with no path editing — demonstrated | ✔ `npm run board`, banner above. ⚠️ On **this** machine `--port 8686` is needed until PID 92326 is stopped |
| 4 | It writes nothing — `git status --porcelain` unchanged, every POST refused | ✔ assertion E + the demo |
| 5 | Sprint 11 renders with its true status, not cancelled | ✔ `S-011 = "In progress"` |
| 6 | Ids render unmangled — `0013` reads `0013` | ✔ assertion A + the demo |
| 7 | A snapshot timing at the real corpus, with size and counting rule | ✔ the measurement table above |
| 8 | `git diff --stat` shows nothing under `tasks/done/`, `tasks/cancelled/`, `wiki-vault/`, no folder moved | ✔ **by me**. ⚠️ The tree *does* carry `done/0404` and `done/0409` changes — **pre-existing**, from other tasks, with mtimes hours before this session's first write |
| 9 | `node --test test/*.test.js` passes | ✔ 985/985 |

---

## What was built

- **`bin/fkit-board.mjs`** — the reader. Node, stdlib only (`node:http`, `node:fs`, `node:path`,
  `node:child_process`, `node:url`). No dependency added to `package.json`.
- **`test/board-reader.test.js`** — the seven-assertion suite of the plan's §6, run by `node --test`.
- **`package.json`** — one script, `npm run board`, and nothing else.
- **`README.md`** — the documented command and what it listens on.

⛔ **Nothing under `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/` was touched.** The spike was
read in place and stays there. ⛔ **Nothing was written into aiboard's repository.** ⛔ **No commit.**

---

## 2026-09-21 — ⚠️ AMENDMENT to the unescaped-attribute note above: it has TWO fields, not one

The grounding note (*"New facts the plan did not have"*, item 2) names **`t.priority`** only. That is
**half the finding**, and the upstream report would have been half a finding with it.

**`t.sprint` has the identical exposure.** aiboard defines an `esc()` and applies it to `title` and
`assignee`, but **not** to `priority`, `sprint`, `id` or `status`. `t.sprint` is interpolated
unescaped in **two** places — `data-ref="${t.sprint}"` in the drawer, and its chip's element text —
and it comes from a brief's `## Sprint` line through `boardId()`'s `\S+` capture, exactly as
`t.priority` comes from `## Priority`.

**Re-verified today, both fields: zero live values contain `"`, `<`, `>` or `&`.** Raw pass-through is
safe **today** and is not structurally safe — the same honest statement the original note made about
`t.priority`, now made about both.

⛔ **Both are aiboard's to fix, not this reader's.** The reviewer ruled fkit adapts to aiboard, not the
reverse, and the defence on fkit's side would be the un-authorised hardening. ⚠️ Route upstream through
`aiboard-lead`. **Per [ADR-051](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)
D7, no fkit task may be filed for aiboard's work** — this is a report, not a backlog item.

---

## 2026-09-21 — Round 1 review processed

> Written by a spawned `fkit-coder` **Process-review worker** under `/fkit-sprint-ship-loop`'s
> declared-approval marker. ⚠️ **The marker carried the plan BY REFERENCE, not inline** — a path plus
> `git hash-object` blob and byte count. I verified it before writing anything: blob
> `84d80ecc93db018ebcf9fd6db84c32b04b2a6b60`, **18113 bytes**, both matching. My reasoning for
> accepting a by-reference carry is in the return to the driver, and is **mine to be overruled on**.

Owner rulings of 2026-09-21 covered **R1, R2, R14** and the DNS-rebinding residual. **R3 and R5–R13
were dispositioned by me** under the standing approval. Verdicts and my own derived severities are in
`review.md`'s *Coder response*. ⭐ **I re-graded two of fourteen, both upward — R4 med→high and
R5 low→medium** — with the traced blast radius in each row.

### Decision log — fixes applied unattended this round

> ⛔ ADR-019's audit obligation. Each entry: **which finding it answers**, **what changed**, **why it
> qualified** (verified-`CORRECT` + mechanical/localized + in-plan, or obvious-winner-within-intent).

| # | Answers | Decision | Why it qualified |
|---|---|---|---|
| D12 | R1 | **`goal` is `null`, not "the first non-blank line after the banner".** | Owner-ruled to fix; he offered **both** options and I took the second **with cause**. The first is unimplementable without re-deriving the grammar: the banner is a blockquote spanning many lines (`sprint-11.md` runs to line 5+ inside it), so locating its END *is* the recognizer. Verified aiboard renders `s.goal ? … : '—'`, so null degrades to its own absence glyph rather than breaking the card. ⚠️ Departing from the ruling's first option is surfaced to the driver, not buried. |
| D13 | R2 | **The truncation marker LEADS the description rather than trailing it.** | Obvious winner within intent, and the placement is load-bearing. aiboard renders the description through `.replace(/^## Tasks[\s\S]*$/m, '')` — **everything from a `## Tasks` heading onward is deleted**. A trailing marker survives only while no board carries that heading inside the cap (true today across all three boards I measured — luck, not design). The owner asked for it "on screen"; leading is the only placement that guarantees it. |
| D14 | R4 | **Guard C scans a DECODE-ESCAPED copy, and gains three STRUCTURAL needles.** | Owner-ruled to strengthen and to red-prove with a non-literal. Decoding defeats the `\u` dodge; the structural needles (a character class holding both `>` and `#`; line 3 reached by index) catch a re-derivation that names no token at all — which is what R1 was. |
| D15 | R3 | **New assertion E2: the static no-write proof.** | Mechanical and in-plan — it pins the plan §7 claim *"no write path, in any mode, behind any flag"*, which assertion E only partly proved. Mirrors assertion C's existing technique. Expected import lists are **hard-coded**, per ADR-014 *"a test whose oracle is the implementation tests nothing"*. ⚠️ The `node:child_process` import list is pinned rather than needle-searched, because `exec(` is unusable as a needle — `RegExp.prototype.exec()` is legitimate and frequent in this file. |
| D16 | R5 | **`cacheKey()` carries PER-BOARD counts, not a total.** | Mechanical correctness, same species as D5, and it makes the code's **own comment** true — the comment named the closed-and-moved case and the key did not catch it. A total is invariant under a move and `mv` preserves mtime, so a warm reader served the old board indefinitely (ADR-051 **F2**, *"wrong status"*). ⚠️ Rename-inside-one-board stays uncaught and is now **stated in the code** rather than implied. |
| D17 | R6 | **The 500 reports the error CODE, never the message.** | Mechanical; makes the handler's own comment (*"never a path"*) true. An fs error message carries the absolute path it failed on, so echoing it was the leak. `ENOENT` keeps a 500 diagnosable without naming the filesystem. |
| D18 | R7 | **`resolveAiboard()` requires `isFile`, not `existsSync`.** | In-plan, not hardening — it makes a promise the plan already states (*"exit non-zero naming all three ways"*) true for a directory, which `existsSync` accepted. One predicate. |
| D19 | R8 | **`FIELD_RE` gains a `(?!## )` lookahead.** | Mechanical, and **proved a no-op before applying**: all **411** live briefs parsed under both regexes, **0 differing**. Zero live instances, so this is latent-only; the lookahead makes the match fail at that position so the scan resumes and finds the real heading. |
| D20 | R9 | **`byId` is built first-wins, matching `tasks.find()`.** | Mechanical; a no-op today (zero duplicate ids) that removes an incoherent response — one task's title beside another's brief. ⛔ I did **not** add duplicate *detection*: that is new surface, not a consistency fix, and it would need threading `problems[]` through the task crawl. |
| D21 | R11 | **Both `spawnSync` calls carry `timeout: 30000`.** | Mechanical, and it adds **no new behaviour** — on timeout `spawnSync` sets `r.error`, which both call sites already treat as "could not be run" (a problem on `/api/check` mid-run; a refusal to start at startup). 30 s is ~300× the measured 92–110 ms, so it cannot fire on a healthy machine. ⚠️ **This is a subprocess guard, NOT a trial deadline** — ADR-051's standing guard (*"no agent may invent a timeout … for this trial"*) governs the A/B trial clock and is untouched. Named because the word collides. |
| D22 | R12 | **The traversal case is written percent-encoded.** | Mechanical test fix. Reproduced against a bare `createServer` that `fetch` normalises dot segments before transmitting, so the old case never reached the task route. `%2e%2e%2f` is passed through unnormalised. |
| D23 | R13 | **README says six GET paths and names the `/index.html` alias.** | Mechanical doc-truth fix; the inventory was false by one. |

### Escalations — things I did NOT decide

1. ⛔ **R10 (colliding board ids) is NOT fixed.** Zero live collisions, and the fix requires deciding
   whether `sprint-4.md` and `sprint-04.md` *should* merge. No option dominates → frontier-move.
   ⭐ **Owner-ruled 2026-09-21 (selected option text, not his own prose): *"Record as a residual, don't
   fix."*** Recorded in `review.md`'s *Accepted residuals* in full What / Why / Re-raise shape, with
   the owner's own re-raise condition — **if a live collision ever appears**.
2. ⛔ **R11's exit-code half is NOT actioned.** Exit 3 is a documented ANSWER (*"no sprint is
   eligible"*), so a bare non-zero check would break a working case. Only the timeout half was real.
3. ⚠️ **BOTH gates are RED for a reason outside this task, and I did not repair it.**
   `reference-integrity.test.js` reports 2 unresolved links in **ADR-051**, both pointing at
   `tasks/backlog/0404-…` — a folder `0404`'s close moved to `tasks/done/` (staged before this
   session). Repairing it means editing an ADR, which is outside this task's approved plan and outside
   its change surface. **Surfaced, not touched.**

---

## 2026-09-21 — verification, both gates run to completion

⛔ **Both gates are RED, and both are red for the SAME pre-existing reason. Neither red is this
task's.** Stated first because it is the worst news here.

| Gate | Result | Reading |
|---|---|---|
| `node --test test/*.test.js` | **991 pass / 1 fail** of 992 | The one failure is `reference-integrity.test.js` → *"L2 live corpus: BROKEN is 0 under the settled condition"*: 2 unresolved links in **ADR-051**, both to `tasks/backlog/0404-…`, which `0404`'s close moved to `done/`. |
| `bash test/prove-red.sh` | **`✗ hard gate FAILED`** | ⭐ **All 40 mutations went red as intended; `NOT RED` count is 0.** The gate fails at **baselines `0a` and `0b` only** — the two checks that execute the ENTIRE suite, so they inherit the same ADR-051 failure. `0c`–`0o` (13) are green. |

**Attribution, evidenced rather than asserted:**
- The full suite has **exactly one** failing test, and it is the ADR-051 link check.
- `reference-integrity.test.js` references **none** of this task's files (grep count 0).
- Its 2 unresolved targets both name **ADR-051 → `0404`**; **no `0411` file is implicated** — the sole
  `0411` string in the whole run log is an unrelated *passing* test name.
- This task's change surface is `bin/fkit-board.mjs`, `test/board-reader.test.js`, `README.md` and this
  folder — **none of which `reference-integrity` reads.**

⚠️ **Consequence for the driver: `prove-red` is currently UN-PASSABLE repo-wide** until ADR-051's two
links are repointed at `tasks/done/0404-…`. That is a one-line-each edit to an ADR, and it is **not
mine to make** — outside this task's approved plan.

⚠️ **A correction to my own interim report.** I first reported *"prove-red baselines 0a–0o all green"*.
**That was wrong.** My tally grepped `^0[a-o]\..*green`, which matches the label text *"should be
green"* — so it counted `0a` and `0b` as green when both had in fact ended `... red`. The real split is
**13 green, 2 red**. Recorded because a miscount that flatters the result is exactly what this log
exists to catch.

⚠️ **A second correction, same class.** My first prove-red capture wrote `PROVE_RED_EXIT=0` **while the
script was still running** — I had used `echo "$?" | tee`, a **pipe**, in the capture. The run was then
at mutation 15 of 40. Had I trusted it I would have reported a green gate that had not finished. The
gate was re-read from **`prove-red.sh`'s own `hard gate PASSED/FAILED` summary line**, which needs no
exit code at all and cannot be faked by a pipe. ⭐ This is the same trap the plan and ADR-014 name, met
in a new place: not the exit code of a pipeline, but an exit code *recorded too early*.

---

## 2026-09-21 — ⭐ BOTH GATES RE-RUN BY THE DRIVER AFTER THE EXTERNAL REPAIR: GREEN

⛔ **This supersedes the two red gates recorded immediately above. The reds were NOT this task's, and
the attribution recorded there held.** A producer repaired ADR-051's two hrefs into `0404`'s pre-move
path; `/fkit-sprint-ship-loop`'s driver then re-ran both gates itself, **exit codes captured directly,
no pipe**:

```
unit_exit=0
provered_exit=0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

⚠️ **I did not re-run them, and I am not claiming to have measured them.** These are the **driver's**
numbers, recorded here as the driver's ([`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
A re-run costs ~80 minutes and was explicitly not wanted.

⭐ **A systemic finding came out of this, and it is not 0411's to act on.** The close report that
claimed those link repairs **was truthful** — the repair was really made, survived ~20 hours as
**uncommitted working-tree state**, and was then **reverted by something nobody could attribute**.
Proved from ADR-051's mtime being *today* while the file is byte-identical to `HEAD`. The finding:
**a mover's link repairs live only in the uncommitted tree, and a single-file revert erases them
silently.** ⛔ Held by the driver with the owner; **no fkit task is filed for it from here**, and
ADR-051 was not touched by me.

### Test suite, this task's own file

**`test/board-reader.test.js`: 16 tests, 16 pass** (was 9 — seven added: `E2`, `H1`–`H6`).

⭐ **The strengthened F3 guard was red-proved TWICE, both times from a 0-of-5 start**, and the reader
restored byte-identical (sha256 `082e990f…`) after each:
1. **An escaped non-literal recognizer** — markers as `\u` escapes, prefix as a character class, line 3
   by index. The **old guard scored 0 of 5 needles**; the new guard goes red on the decoded marker.
2. ⭐ **The exact `goal:` line that shipped** — re-injected verbatim. The **old guard scored 0 of 5**,
   which is precisely *why R1 shipped green*; the new guard goes red on the **structural** needle
   (*"a regex character class holding both > and #"*). A guard proved against the defect that actually
   escaped it is worth more than one proved against a hypothetical.

**Live end-to-end**, on an explicit **non-default port 8787** (⚠️ `8585` was occupied — by a **`node`**
process, PID 33298, *not* yesterday's Python spike; the squatter has changed identity, so the default
port is still not safe to assume). `lsof` confirmed PID 67456 answered: 11/11 boards `goal: null` with
statuses intact (`S-011 = In progress`, `BACKLOG = unresolved`, archives `Done`), 411 tasks, `0013`
still the string `"0013"`, `S-011`'s description leading with
`⚠️ … truncated, 20,000 of 115,352 characters …`, `/index.html` → 200, and every non-GET refused.

---

## 2026-09-21 — close, by a spawned `fkit-producer` (no owner channel, ADR-021)

Closed via `/fkit-task-done` as **`✅ Done (agent-closed — not owner-verified)`** (ADR-033 §5).

⭐ **The owner's demo verdict is recorded on `brief.md`**, under its heading
*"Outcome — the owner's demo verdict, recorded at close"* — that section is the canonical copy; this
entry is a pointer, not a second record. In one line: he ran the reader on the live tree (411 tasks,
11 boards) on 2026-09-21 and judged it better than reading the markdown. ⚠️ **Selected option text
(*"Yes — I'd use this"*), not his own prose**, and bounded there as one session, one user, who authors
both systems.

⛔ **ADR-051 was not edited by this close** — its gate may want this evidence, but amending an
`accepted` ADR is the architect's act. Returned to the driver as an open question.
