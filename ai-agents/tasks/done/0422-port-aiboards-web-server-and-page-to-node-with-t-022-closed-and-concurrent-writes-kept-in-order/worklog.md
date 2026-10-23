# Worklog — 0422

## 2026-10-22 — fkit-coder (Build worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Built the approved `plan.md` (blob `3cdf2663`, checked with `git hash-object`, 26,967 bytes) under the
declared-approval marker. Owner approval relayed: `AskUserQuestion`, 2026-10-22, `fkit-lead` session —
Q1 selected *"Approve, match status codes (Recommended)"* (= option A: status codes matched for hand-made
requests, wording and float text known gaps; a status-code fix needing store/model changes stops and asks);
Q2 selected *"File a follow-up task (Recommended)"* (0422 stays writes-only; GET checks, the reader and
`vendor/` untouched). No commit, no push. `plan.md` not edited.

**Result: built and green, but two decisions are open** (see *Open decisions* at the end): one status-code
difference that only a model change can fix (Q1-A says stop and ask), and a macOS loopback flake seen when
the test file is run many times back to back. *(Both resolved by owner rulings on 2026-10-22: see
*Continuation — owner rulings A and B* below.)*

### Change surface

- `board/web/index.html` (new): byte copy of `a1592dc:aiboard/web/index.html` (`git cat-file blob`, read-only
  in aiboard). sha256 `3b32c9e8f0311a73ab87a7de2af790534294f04af1eac25c5d757ef29b1a0dc6`, 33,899 bytes,
  `cmp`-identical to `vendor/aiboard/index.html`.
- `board/server/server.mjs` (new): port of `aiboard/server.py` plus the T-022 checks (`refuseCrossSite`).
- `board/cli/cli.mjs`: `cmdServe` now calls `serve()`; static import of `../server/server.mjs`. `cmdMcp`
  stub unchanged (its comment's "their parsers" became "its parser").
- `board/core/python-compat.mjs`: `pyJsonLoads` rewritten as a port of CPython 3.9's C JSON scanner;
  `pyEncodeUtf8` split out of `pyWriteText` (whose behaviour is unchanged).
- `test/board/server.test.js` (new): **the one pre-approved test file**, 17 tests (18 after ruling A). No
  other test file.
- `board/core/model.mjs`: one guard in `normalizeId` — added later under owner ruling A (continuation below).
- This worklog.
- Untouched: `bin/fkit-board.mjs`, `vendor/`, the launcher, `install.sh`, `docs/`, `package.json`,
  `board/core/store.mjs`, `board/core/lock.mjs`, the wiki. (`board/core/model.mjs` was untouched until ruling A.)

### Red / green evidence

1. **Red (module missing).** `node --test test/board/server.test.js` → exit 1, `ERR_MODULE_NOT_FOUND
   …/board/server/server.mjs`, tests 1 / fail 1. `npm test` at that point: 915 tests, 914 pass, 1 fail (this
   file), 1 skipped, 77.4 s.
2. **JSON layer.** After the `pyJsonLoads` rewrite, the five existing `test/board/*` suites: 70 tests, 69 pass,
   1 skipped, 0 fail. Scratch probe against `/usr/bin/python3 -I` (3.9.6) `json.loads`: **104 inputs, 0
   differences** — values, key order, int-vs-float, BigInt, and every error message and position (BOM, extra
   data, unterminated strings, bad escapes, surrogate pairs, trailing commas, astral characters).
3. **Naive faithful port (no T-022 checks).** The 6 ported `ServerTests` green. The T-022 tests red. The
   original attack replayed against the naive port (scratch script, temp board):
   ```
   request: POST /api/tasks/T-001/status  Origin: https://evil.example  Content-Type: text/plain;charset=UTF-8  body: {"status":"done","author":"Mark"}
   response status: 200
   task status after: done  (was backlog)
   last worklog entry: {"timestamp":"2026-10-22T14:36:42Z","author":"Mark","text":"Status changed `backlog` → `done`."}
   ```
   **Accepted by the naive port** (brief Verification 2).
4. **T-022 checks added** → 16/16 then (with the wrong-type test) 17/17 green, ~0.55 s for the file.

### Python parity probe (scratch, bounded)

`git archive a1592dc` extracted into the scratchpad; Python's `make_handler` run in-process by a scratch
runner (`/usr/bin/python3 -I`, port 0, its own raw-socket requests, then shutdown); the Node handler run the
same way; both driven from Node with `spawnSync(…, {timeout: 120000, killSignal: 'SIGKILL'})`. `aiboard
serve` never run. 569 request groups, 1,205 requests, each group on a fresh fixture board; status, JSON body
(paths and timestamps normalized), `Content-Type`, `Cache-Control`, the 501 reason and length, and the whole
board tree afterwards compared. Requests that pass the T-022 checks only (Python has none).

Coverage: every request of the 6 ported tests; 5 other methods; 15 POST and 18 GET path forms; 20 odd
bodies; and the wrong-type matrix (33 POST fields × 15 values: null, true, false, 0, 1, 1.0, 1.5, 1e-7, "",
"x", [], ["a"], [1], {}, {"a": 1}).

Final run: **9 status-code differences**, 91 body differences, 3 header differences, 34 board-tree
differences. Classified:

- **8 status codes: a list given where an id is expected** — `sprint` on task create and edit, `before` /
  `after` on rank, each with `["a"]` and `[1]`. Python: 500 `AttributeError: 'list' object has no attribute
  'strip'` (`normalize_id` calls `ref.strip()`). Node: 404 (`['a']`) or **a success** (`[1]` is read as id 1:
  edit/create attach the task to S-001; rank answers 400). Cause: `board/core/model.mjs` `normalizeId` runs
  `pyStrip` on a non-string, and an array passes through it. **Not fixable inside `server.mjs` without
  copying store logic → open decision A.** (2 of the 34 tree differences — create and edit with `sprint:
  [1]` — and 1 body difference are the `[1]` writes. *Corrected in the continuation: this said 4, and the
  float line below said 30 trees; the re-run shows 2 and 32.*)
- **1 status code + 3 header + 1 body: Node's HTTP parser answers first** (accepted, plan §7): the request
  target `x:/api/tasks;y`, and a body sent with no `Content-Length` and no chunking (Node reads the body
  bytes as a second, malformed request and answers it 400 itself).
- **45 bodies: 500 wording** (accepted, Q1-A): same 500, Python's type name vs a JS `TypeError` (e.g.
  `AttributeError: 'int' object has no attribute 'strip'` vs `TypeError: s.slice is not a function`) when a
  non-string reaches `normalize_status` / `normalize_id` / `canonical_priority` in the store or model.
- **44 bodies + 32 trees: float text** (accepted, Q1-A): `1.0` → `1`, `1e-7` → `1e-07`, and a float's type
  name (`'float' object is not iterable` → `'int'`).
- Everything else matched exactly, including all 6 ported tests' requests and resulting board trees, the 501
  page bytes, and every path form.

### Negative controls (scratch copies of `board/` + the test file; source never touched)

| Variant | Result |
|---|---|
| Host check removed | exit 1 — matrix test and "writes … still work" fail |
| Origin check removed | exit 1 — T-022 reproduction, matrix, "still work" fail |
| Content-Type check removed | exit 1 — matrix and "still work" fail |
| comment read and write split by an `await` (lost-update shape) | exit 1 — the simultaneous-writes test fails |
| page: vendor copy plus one byte served | exit 1 — the page test fails |

### Checks

- **`npm test`** (CONTRIBUTING: `board/`, `test/`): exit 0, 932 tests, 931 pass, 1 skipped, 0 fail — 79.2 s,
  and 75.4 s on the final code (before: 77.4 s; budget 120 s). Inside it the server file's slowest test is
  `serve from the command line`: 3.8 s and 4.0 s (two child processes, under the suite's load; ~0.1 s alone)
  — under 5 s, but close.
- **Concurrent-writes test alone, 25 runs in a row** (`--test-name-pattern`): 25/25 passed, slowest 284 ms
  (brief Verification 3).
- **`node --test test/board/server.test.js`, 25 runs in a row, three loops** (80 runs): see open decision B.
  Quiet loop: 24/25 passed; run 19 failed 3 tests with `connect ETIMEDOUT 127.0.0.1` (~7.8 s each). Two
  earlier loops (started right after heavy probing): 23/25 and 26/30. Every failure was `connect ETIMEDOUT`
  on loopback; **the simultaneous-writes test never failed** in the runs whose failures were captured.
- **Skipped:** `npm run test:prove-red`, `npm run test:release` — no file in their rows is touched.
- **Manual, bounded:** `serve` without `--no-open`, `BROWSER=/nonexistent-browser:<scratch script>`: first
  entry fails (ENOENT), the script got `http://127.0.0.1:0/` (Python's URL, port as given), SIGINT after 2 s,
  exit 0. **Not verified:** the `xdg-open` and Windows default paths (no such machine).
- **Q16 (brief Verification 4):** every board root is asserted under `realpath(tmpdir())` and free of an
  `ai-agents` path part before any server starts (`assertFixture`, called by `startServer`, `runCli` and the
  serve-child helper); `grep` of the test file for `ai-agents`, `process.cwd()`, `--root .` finds only that
  guard. CLI children run with `cwd` = the temp board and `AIBOARD_ROOT` unset.
- No raw U+2028 / U+2029 / U+FEFF / U+0085 in any changed file.

### Decision log

- **T-022 reproduction expects 403, not the plan's 415.** Plan §2.3 orders the checks Host → Origin →
  Content-Type; the attack carries a foreign Origin, so the Origin check refuses it first (403). §5 test 1
  said 415. Kept §2.3's order; the text/plain-without-Origin shape gets 415 in the matrix test. Why it
  qualified: both are inside the plan; the order is the specified design, and the board is untouched either way.
- **CLI children use `task new`**, not the plan's `task create` (no such command; `new` is aiboard's name).
- **501 page:** the explanation line reads `HTTPStatus.NOT_IMPLEMENTED - …` — the probe showed Python 3.9's
  `%(code)s` prints the enum's name. Byte-matched.
- **Leading `//` reduced to `/` before `urlparse`**: the reference `/usr/bin/python3` 3.9.6 carries the
  gh-87389 backport in `parse_request` (read from its source). `;params` stripping and the NFKC netloc check
  are ported too — both are part of `urlparse(...).path`.
- **A bad netloc (`http://[x/…`) drops the connection unanswered**, as Python's handler raising outside its
  `try` does; the Node handler writes the stack to stderr (socketserver prints a traceback).
- **`$BROWSER`**: each entry is the program, the URL its one argument — Python's `GenericBrowser` with a
  string name (it never substitutes `%s`). The plan's "%s replaced, or appended" wording read as the
  appended case.
- **An Origin is refused when this server's own origin cannot be formed from the Host** (e.g. an IPv6
  zone id): otherwise two unparsable origins would compare equal. Inside §2.3's intent.
- **Extra cases in the one test file**, all inside §2.3: the host given to `makeHandler` is accepted;
  another port, an `https` origin, an empty Origin, no Content-Type, form and multipart types and
  `application/json-patch+json` are refused.

### Known gaps for 0423 (accepted under Q1-A or plan §7)

500 wording; float text; Node's parser answering malformed requests (bad `Content-Length`, a body without a
length, `x:` request targets, a missing Host on HTTP/1.1); no `Server:` header; `HTTP/1.1` status line with
`Connection: close`; `--host ::1` works in Node; JSON nested past ~1,000 levels (Python 500 RecursionError;
Node parses deeper); store lock waits block the event loop.

### Open decisions (both resolved 2026-10-22 — see the continuation below)

- **A — a list where an id is expected** (8 status codes, see the probe). Fixing it means one change in
  `board/core/model.mjs` `normalizeId` (raise Python's `AttributeError` for a non-string), which Q1-A says to
  stop and ask about.
- **B — loopback connect stalls on macOS.** The server closes every connection after one response (Python's
  HTTP/1.0 behaviour, plan §2.2), so the test file opens ~270 short connections per run. Run many times back
  to back, macOS starts stalling new loopback connects (1–4 s) and sometimes fails them (`ETIMEDOUT`,
  ~7.8 s). Reproduced in scratch with plain TCP and no board code (350 connections per process, 30 runs: 2
  runs had failed connects, many had 0.5–5.9 s stalls). A single `npm test` run passed.

## 2026-10-22 — fkit-coder (Build continuation: owner rulings A and B)

Spawned again by `fkit-sprint-ship-loop` / `fkit-lead` under the same declared-approval marker (plan blob
`3cdf2663` re-checked with `git hash-object`, 26,967 bytes). Owner rulings relayed, `AskUserQuestion`,
2026-10-22, `fkit-lead` session:

- **A** — *"One-line fix in 0417 code (Recommended)"*: make `normalizeId` refuse non-text like Python. This
  is an owner-ruled extension of the plan's fence (plan §1 keeps `model.mjs` untouched) for exactly this.
- **B** — *"Keep as is, note it (Recommended)"*: no code change; the flake is written down below.

No commit, no push. `plan.md` not edited. No done task's files edited.

### Ruling A — what changed

- `board/core/model.mjs` `normalizeId`: if `ref` is not a string, throw
  `AttributeError("'<type>' object has no attribute 'strip'")` — Python's `ref.strip()` failure. Imports
  `AttributeError` and `pyTypeName` from `python-compat.mjs`. Nothing else in the file changed.
- `test/board/server.test.js`: one new test, *an id field holding a list: Python's 500, and the board
  untouched* — the 8 cases (`sprint` on create and edit, `before` / `after` on rank, each with `["a"]` and
  `[1]`). Expected status and body from Python `a1592dc` (probe): 500
  `{"error": "AttributeError: 'list' object has no attribute 'strip'"}` for all 8; the board tree is
  byte-identical afterwards. The board has T-001, T-002 and S-001, so `[1]` names a real task and sprint —
  before the fix those requests **succeeded** (attached the task to S-001 / re-ranked T-002).

### Ruling A — evidence

- **Negative control** (scratch copy of `board/` + the test file, the guard line removed, deleted after):
  the new test fails — `actual: [404, "['a'] is not a valid S-id"]`, expected the 500. With the guard: passes.
- **`node --test test/board/*.test.js`**: 88 tests, 87 pass, 1 skipped, 0 fail (0417's `model.test.js`
  and every other board suite green).
- **Python-vs-Node server probe re-run** (same scratch harness, same 569 groups / 1,205 requests):
  **1 status-code difference** (was 9) — the `x:/api/tasks;y` request target that Node's HTTP parser
  answers itself (plan §7, accepted). The 8 list-in-id differences are gone. Also: 70 body differences
  (was 91), 3 header differences (unchanged, parser), 32 board-tree differences (was 34). Every remaining
  one is an accepted class:
  - 1 body: the no-`Content-Length` body (parser, plan §7);
  - 44 bodies + 32 trees: float text (`1.0` → `1`, `1e-07` → `1e-7`; Q1-A);
  - 25 bodies: 500 wording (Q1-A) — 9 are a float's type name (`'float'` → `'int'`) and **16 are a
    non-string `status` on task or sprint create** (`true`, numbers, lists, a dict): Python's
    `normalize_status` raises `AttributeError: '<type>' object has no attribute 'strip'`; Node raises
    `TypeError: s.slice is not a function` (or `pyStrip(...).toLowerCase is not a function` for a list).
    Same status code (500), same untouched board. `normalizeStatus` is not covered by ruling A, so left as is.
  - The 20 `normalize_id` wording differences of the first run now match exactly.
- **CLI / store paths (0419's trigger list), re-checked** with 0419's own parity harness (scratch, aiboard
  `a1592dc` source `cmp`-identical, `/usr/bin/python3 -I` 3.9.6; a 60 s timeout + SIGKILL added to each
  child):
  - 0419's 18 hand cases: **18 identical** (0419 recorded 16; the 2 non-string `tasks:` entry cases now match).
  - 0419's 400 generated programs: **400 identical** (0419 recorded 351; all 49 — non-string `tasks:` entries
    and `sprint: 1` in a brief — now match).
  - One extra program: int and list refs to `sprintAdd`, `sprintRemove`, `moveSprint`, `getTask`, `rankTask`
    (`before`), `unblock`, `listTasks` (`sprint`), plus `null` status to `moveSprint` and `moveTask`. **Every
    int / list ref now matches Python** (`AttributeError`, same message). **Still different: the `null`
    status** (trigger 4) — Python `AttributeError: 'NoneType' object has no attribute 'strip'`, Node
    `TypeError: Cannot read properties of null (reading 'length')`. That is `normalizeStatus`, not
    `normalizeId`.
  - So, against 0419's forward note for 0423: triggers 1, 2 and 3 are **closed** by this change; trigger 4
    is **still open**. 0421's CLI gaps are unchanged: its argv is always text, and a hand-edited board that
    hits the old mismatch now raises Python's exception class and message (the crash stderr still differs
    as traceback vs stack — 0421's accepted class).

### Ruling B — known limit, recorded for 0423

- **What:** run back to back many times on macOS, `test/board/server.test.js` sometimes fails one or more
  server tests with `connect ETIMEDOUT 127.0.0.1` after ~7.8 s. It is a connect that never completes, not a
  wrong answer: the simultaneous-writes test never failed in the runs whose failures were captured.
- **Cause:** the server answers one request per connection and closes it (Python's HTTP/1.0 behaviour, plan
  §2.2, kept by the ruling), so one run of the file opens ~280 short loopback connections. When many such
  runs follow each other, macOS starts stalling new loopback connects (1–4 s) and now and then drops one.
  Which kernel limit does it is not pinned down.
- **Reproduction without board code:** a scratch script with a plain TCP server (`node:net`) that ends each
  connection after the first data, and a client making 350 connections one after another — no HTTP, no
  board. 30 runs back to back: 2 runs had failed connects; many had 0.5–5.9 s stalls.
- **Single-run risk:** low, not zero. Seen: 7 failing runs in 80 back-to-back runs (loops of 25, 25, 30:
  1, 2 and 4 failures; the quietest loop 1/25). Never seen in a single run: every `npm test` with this file in it
  passed (3: two at Build, one this session), as did 3 single runs of the file this session. The risk rises when the machine
  has just churned many loopback connections (a test loop, a probe).
- **No code change** (ruling B). A future fix, if wanted, is keep-alive in the server or test helper — a
  departure from Python's one-request-per-connection behaviour.

### Checks

- `node --test test/board/server.test.js` ×3: 18/18 each, 0.53–0.57 s.
- **`npm test`**: exit 0 — 933 tests, 932 pass, 1 skipped, 0 fail; **75 s wall** (budget 120 s; Build:
  77.4 s before, 75.4 s final). Load average 3.73 at start, 4.41 at end. `0284/term-ignored` passed (no
  failure in the run). Slowest server test inside it: *serve from the command line*, 3.8 s (under 5 s).
- Skipped: `npm run test:prove-red`, `npm run test:release` — no file in their rows is touched.
- No raw U+2028 / U+2029 / U+FEFF / U+0085 in `model.mjs`, `server.test.js` or this worklog. No
  `.aiboard.lock*` in the repo, no `board-server-*` / `b422-*` temp folders, no probe or server processes
  left. The negative-control copy was deleted.
- Not this task's: each `npm test` leaves 3 `fkit-proj-*` folders in the temp dir, from `test/harness.mjs`
  (`makeProject`), not from any board test; ~1,070 have piled up from earlier runs. This run's 3 were deleted.

### Decision log (continuation)

- **Ruling A applied as one guard at the top of `normalizeId`.** Answers open decision A. What changed: a
  non-string `ref` now throws Python's `AttributeError` before `pyStrip`. Why: owner ruling A, verbatim
  above; minimal (one line plus imports, one WHY comment). A float such as `1.0` reports `'int'` (the
  accepted float gap, Q1-A).
- **The new test's board has two tasks and a sprint** so the `[1]` cases would have *succeeded* on the old
  code — that is what makes the test able to fail (shown by the negative control). Inside the ruling's
  "add the 8 list-in-id cases".
- **`normalizeStatus` left alone** (trigger 4, 16 server 500-wording bodies). Not covered by ruling A;
  same status code and untouched board, so inside Q1-A's accepted wording gap. Listed above for 0423.
- **Ruling B: no code change**; the flake is recorded above. No call made beyond the ruling.
- The Build's earlier calls stand unchanged: 403 not 415 on the T-022 reproduction, `task new` not
  `task create`, the 501 explanation line, `//` reduction, the bad-netloc drop, `$BROWSER` handling, the
  unparsable-own-origin refusal, and the extra test cases.

## 2026-10-22 — fkit-coder (Verify worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no source written, no commit. **Result: pass.** Every check run independently.

- `node --test test/board/server.test.js` ×3 (single runs, no loop): 18/18 each, 0.52–0.57 s.
- `node --test test/board/*.test.js`: 88 tests, 87 pass, 1 skipped (the opt-in benchmark), 0 fail —
  0417's `model.test.js` included.
- `npm test`: exit 0 — 933 tests, 932 pass, 1 skipped, 0 fail; **76.4 s wall** (budget 120 s; load 5.7 at
  start, 6.3 at end). Slowest server test: *serve from the command line* (banner / Ctrl+C), 3.6 s. `0284/term-ignored` passed.
- Page: `board/web/index.html` sha256 `3b32c9e8…0dc6`, 33,899 bytes; equal to `git cat-file blob
  a1592dc:aiboard/web/index.html` and `cmp`-identical to `vendor/aiboard/index.html`.
- T-022 attack replayed against the real `makeHandler` (in-process, port 0, temp board under
  `realpath(tmpdir())`, child with 60 s timeout + SIGKILL): evil Origin + `text/plain` → **403**; no Origin
  + `text/plain` → 415; foreign Host → 403; task still `backlog`, board tree byte-identical. Control
  (same-origin JSON) → 200.
- Negative controls (fresh scratch copies, deleted after): Host check removed → 2 T-022 tests fail (matrix,
  "still work"); Origin check removed → 3 fail (reproduction, matrix, "still work"); Content-Type check
  removed → 2 fail (matrix, "still work"); `normalizeId` guard removed → the list-in-id test fails. Unmodified
  copy: 18/18.
- Python-vs-Node server probe (the Build's harness copied, aiboard `a1592dc` freshly `git archive`d,
  read-only; `make_handler` in-process under `/usr/bin/python3 -I` 3.9.6): 569 groups, 1,205 requests —
  **1 status-code difference** (`x:/api/tasks;y`, Node's parser 400 vs Python 404; plan §7); 70 bodies =
  44 float text + 9 float type name in a 500 + 16 non-string `status` 500 wording (`normalizeStatus`) + 1
  no-`Content-Length` body (parser, plan §7); 3 headers (the same no-`Content-Length` request); 32 trees,
  all float text. Strict check: every non-500 body and tree difference is in a group whose input carried
  `1.0` / `1e-7`, and vanishes once Python's float spelling is mapped to JS's. Matches the Build's numbers.
- No raw U+2028 / U+2029 / U+FEFF / U+0085 in the changed files, this worklog, or `plan.md`. `plan.md` blob
  still `3cdf2663…`. No `.aiboard.lock*`, no `board-*` / `b422-*` / `v422-*` temp folders, no probe or
  server processes left; `git status` identical before and after (except this entry). This run's 3
  `fkit-proj-*` folders (from `test/harness.mjs`) deleted.
- Skipped: the 25-run loop (owner ruling B; known macOS loopback class); `npm run test:prove-red` and
  `npm run test:release` (no file in their rows touched); 0419's CLI parity harness and the manual
  `$BROWSER` serve check (not asked for this pass; the Build's results stand unverified here).

## 2026-10-22 — fkit-coder (Process-review worker, round 1, spawned by fkit-sprint-ship-loop / fkit-lead)

Standing approval: the approved plan + owner rulings relayed under the ADR-055 marker. No commit.

### Decision log (review round 1)

- **R1 fixed without asking — refusals answered before the body is read.** Answers review R1 (refused
  POST bodies buffered in full, 300 MB → RSS 367 MB). What changed: `board/server/server.mjs` — new
  `refusePOST` runs on request arrival (path parse, then read-only 400, then `refuseCrossSite`); a refused
  body is discarded with `req.resume()`; the read-only check and T-022 checks left `doPOST`; the old
  catch-and-drop moved into `dropOnError`, shared by both phases. Why it qualified: verified `CORRECT`
  (probe reproduced the cost's shape and showed RSS flat after); localized to the handler; inside plan
  §2.3 ("after Python's read-only check … and before the body is parsed") — read-only stays first with
  the same 400, Python's own order (path parse, read-only, then `_body()`) is kept, so a bad path is still
  dropped unanswered and no same-site or read-only status changes (probe checked each).
- **R2 fixed without asking — `child.unref()` on the browser opener.** Answers review R2 (a blocking
  `$BROWSER` kept `serve` alive after Ctrl+C). What changed: one line plus a WHY comment in
  `openBrowser`. Why it qualified: verified `CORRECT` (reproduced on a scratch copy without the line);
  one-line, localized; inside plan §2.4 ("The process ends with exit 0" on SIGINT; spawns stay
  "detached") — the alternative, dropping `detached`, would contradict §2.4, so `unref` is the
  within-plan fix.
- **No test added for either** — CONTRIBUTING test rules: a missing test is a suggestion off the key
  list; the one pre-approved file was not touched.

### Checks

- `node --test test/board/*.test.js`: 88 tests, 87 pass, 1 skipped, 0 fail.
- `npm test`: exit 0 — 933 tests, 932 pass, 1 skipped, 0 fail; 79 s wall (load 3.5 at start).
- `node --test test/board/server.test.js` ×3 single runs: 18/18 each. The 25-run loop skipped (ruling B).
- Probes (scratch, bounded with `alarm`, boards under `realpath(tmpdir())`, removed after): R1 memory and
  status probe; R2 Ctrl+C probe with a sleeper `$BROWSER` (sleeper killed by pid), fallback-chain probe,
  negative control. No browser opened. Python's `aiboard serve` not run.
- No leftover `r1probe-*` / `r2probe-*` folders, lock files or processes; this run's 3 `fkit-proj-*`
  folders deleted. No raw U+2028 / U+2029 / U+FEFF / U+0085 in `server.mjs`.

## 2026-10-22 — fkit-coder (Re-verify after review round 1, spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no source written, no commit. **Result: pass.** Every check run independently.

- `node --test test/board/server.test.js` ×3 single runs: 18/18 each, 0.53–0.56 s. `test/board/*.test.js`:
  88 tests, 87 pass, 1 skipped, 0 fail.
- `npm test`: exit 0 — 933 tests, 932 pass, 1 skipped, 0 fail; **78.7 s wall** (budget 120 s; load 3.4 at
  start, 8.7 at end). `0284/term-ignored` passed; *serve from the command line* 3.4 s.
- T-022 replay: evil Origin + `text/plain` → 403; no Origin + `text/plain` → 415; foreign Host → 403; task
  still `backlog`, tree unchanged; same-origin JSON control → 200. Negative controls: Host removed → 2 fail,
  Origin removed → 3 fail, Content-Type removed → 2 fail, `normalizeId` guard removed → 1 fail; baseline 18/18.
  Same failing tests as the first Verify.
- R1: read-only 400 with Python's exact body `{"error": "this board is served read-only"}` (same
  Content-Type / Cache-Control) for a small POST and a 300 MB POST (1 ms). Cross-site `text/plain` 300 MB →
  403, server RSS 56 → peak 58 MB; no-Origin 300 MB → 415, peak 64 MB; tree unchanged. Same-site comment
  200, status 200, create 201. Probe-validity control (scratch copy, header-time refusal bypassed, deleted):
  RSS peaks ~2.1 GB — so the probe does detect buffering.
- R2: `serve` with a 15 s sleeping `$BROWSER`, SIGINT at 2 s → exit 0 in 5–11 ms; `/usr/bin/false:<sleeper>`
  → exit 0 in 6 ms; `/usr/bin/true` → exit 0. Negative control (scratch copy without `child.unref()`):
  still running 4 s after SIGINT. `open` / `xdg-open` stubbed on PATH (never called); sleepers killed by pid.
- Python-vs-Node probe (aiboard `a1592dc`, `/usr/bin/python3 -I`): 569 groups, 1,205 requests — 1 status diff
  (`x:/api/tasks;y`), 70 body, 3 header, 32 tree. Output identical line for line to the first Verify run
  (ports masked): difference classes unchanged.
- Hygiene: no raw U+2028 / U+2029 / U+FEFF / U+0085 in the changed files, `index.html`, `plan.md`, `review.md`
  or this worklog; `plan.md` blob still `3cdf2663…`; no lock files, `rv422-*` temp folders, or probe /
  server / sleeper processes left (one orphan `sleep 15` from a first sleeper version ended on its own);
  `git status` identical before and after (except this entry); this run's 3 `fkit-proj-*` folders deleted.
- Skipped: the 25-run loop (owner ruling B); `npm run test:prove-red` / `test:release` (no file in their rows
  touched); 0419's CLI parity harness (not asked; round 1 touched only `server.mjs`).
