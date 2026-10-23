# Plan — 0422: port aiboard's web server and page to Node, with T-022 closed and simultaneous writes kept in order

Planning only. No files were written: no source, no plan.md, no test. This is a spawned plan, so no EnterPlanMode; the prose contract applied.

## Summary
- **New files (3):** `board/server/server.mjs` (the server port), `board/web/index.html` (aiboard's page, copied byte-for-byte), `test/board/server.test.js` (the one pre-approved test file).
- **Changed files (2):** `board/cli/cli.mjs` (`cmdServe` stops being a stub) and `board/core/python-compat.mjs` (`pyJsonLoads` keeps JSON key order as written, as 0417's carried note asks).
- **T-022 is closed on every POST by three checks: Host, Origin and Content-Type.** The naive faithful port is run first and shown to accept the original attack (the red step). Then the checks go in.
- **Writes stay in order by design.** The handler reads the whole body, then runs every store call synchronously to the response. Nothing awaits in between (0418 limit 8). There is one `Board` per root (limit 12), no worker threads, and every child process is waited for.
- **Slow tests: none expected.** The file should take about 2–3 s inside `npm test`. Any test over 5 s at build is reported before going on.
- **Two owner questions, both at the end:** Q1, how faithful hand-made wrong-type JSON fields must be (floats included). Q2, a read-side DNS-rebinding exposure: out of scope here, and it also affects today's shipped `fkit board` reader.

## 0. Ground truth read
- **Brief and its dated notes:**
  - A3 is the start word.
  - One test file under `test/board/` is pre-approved.
  - The port source is aiboard `a1592dc`.
  - `test/board/*.test.js` already runs inside `npm test` (`package.json` checked: `node --test test/*.test.js test/board/*.test.js`), within the 2-minute budget.
  - 0417's `pyStr` and float notes.
- **ADR-052:**
  - D6: the server checks the requesting site, host and content type on every write.
  - D9, phase 2.
  - Risks #6 and #7.
  - Q16: no writable serve on real data.
- **ADR-057:** the dated note on D1/D2/D10.
- **ADR-058:**
  - The reader `bin/fkit-board.mjs` plus `vendor/aiboard/index.html` ship as `fkit board`.
  - There will be "two copies of aiboard's page for a while"; whether 0422 reuses the vendor copy is left to this plan.
- **aiboard `a1592dc`:** `aiboard/server.py`, `tests/test_server.py` (6 tests), `aiboard/web/index.html`, and the T-022 brief and worklog.
- **Done tasks:**
  - 0418: worklog limits 1–15, its four Accepted residuals, and its note for 0422.
  - 0420: "serve `snapshot()` as is".
  - 0421: replace `cmdServe`; the `serve` parser is already ported.
- **Current code read:**
  - `board/core/store.mjs`: synchronous store; `writeLock` waits with `Atomics.wait` and has no timeout.
  - `board/core/model.mjs`: the `toDict` shapes.
  - `board/core/python-compat.mjs`:
    - `pyJsonLoads` builds Maps via `Object.entries`, which moves integer-like keys to the front.
    - `pyStr` throws on plain objects.
    - `pyWriteText` raises `UnicodeEncodeError` on a lone surrogate.
  - `board/cli/cli.mjs`: `cmdServe` throws "not ported to Node yet (task 0422)".
- **Page copy check:** `vendor/aiboard/index.html` is byte-identical to `a1592dc:aiboard/web/index.html` (checked with `cmp`), 33,899 bytes.

### What "T-022 closed" means exactly (from aiboard's T-022 brief)
- **The attack (demonstrated 2026-09-18):** a POST from `Origin: https://evil.example` with `Content-Type: text/plain;charset=UTF-8`. That is a CORS "simple" request, so the browser sends no preflight. It closed a task (`backlog` → `done`) and wrote the attacker's chosen author into the worklog.
- **Cause:** `server.py` never looks at Origin, Referer or Content-Type, and `_body()` parses any body as JSON.
- **Its acceptance criteria:**
  1. A cross-origin simple request to every mutating endpoint is rejected.
  2. Same-origin requests from the page still work, including drag-to-status.
  3. A test reproduces the attack and asserts it now fails.
  4. `--read-only` is unaffected.
- **ADR-052 D6 adds the Host check.** It also closes DNS rebinding: a hostile site whose name is re-pointed to 127.0.0.1 is same-origin in the browser's eyes, so only the Host header gives it away.
- **Phase 3 (0433), not here:** the one-time key and owner-door stamping.

## 1. Files

| File | Change |
|---|---|
| `board/web/index.html` | **New.** Byte copy of `a1592dc:aiboard/web/index.html`, made with `git -C ~/Workspace/aiboard cat-file blob a1592dc:aiboard/web/index.html` (read-only in aiboard). Check after copying: sha256 `3b32c9e8f0311a73ab87a7de2af790534294f04af1eac25c5d757ef29b1a0dc6`, 33,899 bytes, same as the vendor copy. |
| `board/server/server.mjs` | **New.** Port of `server.py` plus the T-022 checks. It sits where decision-document §3.1 puts it (`board/server`, `board/web`). |
| `board/cli/cli.mjs` | `cmdServe` becomes the real command. The `mcp` stub stays. |
| `board/core/python-compat.mjs` | `pyJsonLoads` is rewritten as a faithful `json.loads`, and a small `pyEncodeUtf8` is split out of `pyWriteText`. Details in §3. |
| `test/board/server.test.js` | **New. The one pre-approved test file.** |
| task folder `worklog.md` | Written during the build (red/green evidence, decision log). |

**Why not reuse `vendor/aiboard/index.html`:**
- 0443 ships `board/` on its own, and 0467 deletes `vendor/`. `board/` must therefore not depend on the interim reader's folder.
- ADR-058 already accepts two copies for a while.

**Licence:** the page is MIT, aiboard's licence, with the same copyright holder as fkit. `server.mjs`'s header comment names the page's source commit and sha256. No extra LICENSE file is added, the same as for the 0417–0421 code ports. Say so if you want one.

**Not touched:**
- The reader `bin/fkit-board.mjs`, `vendor/`, the launcher, `install.sh`, `docs/`.
- `package.json`: the glob already covers the new file.
- The relation stays as ADR-058 sets it. `fkit board` keeps running the read-only reader over fkit's markdown tree. `board/` serves aiboard-format boards only and is reached only through `node board/cli/main.mjs serve` until 0444 re-points `fkit board` (phase 5).

## 2. `board/server/server.mjs` — the port (Python names kept)

Exports:
- `WEB_DIR`
- `makeHandler(board, { read_only = false, host = null } = {})`: returns an http request listener; mirrors `make_handler`.
- `serve(board, { host = '127.0.0.1', port = 8484, open_browser = true, read_only = false } = {})`: returns the `http.Server`.

### 2.1 Request flow (also the ordering guarantee)
1. Collect the whole body (`data` and `end` events).
2. On `end`, call one synchronous function: `doGET` or `doPOST`.
3. That function makes every store call and writes the response, with **no `await` and no callback in between**.

Result: requests are applied whole, one at a time, in the order their bodies finish arriving.
- In-process ordering rests on this alone (0418 limit 8). A one-line WHY comment states it.
- Between processes, ordering rests on the store's `writeLock`.
- The server uses the one `Board` it is given (limit 12), starts no worker threads (residual "terminated worker"), and kills no child processes (residual "zombie").

**Accepted cost:** if another process (for example, an agent's CLI write) holds the lock, `writeLock` blocks the server's event loop until it is released. A hung holder freezes the server (0418 limit 6). Python blocked only one thread.

### 2.2 Faithful to `server.py`
**Routes, in Python's order:**
- **GET:**
  - `/` and `/index.html`: the page bytes, re-read on every request, `text/html; charset=utf-8`.
  - `/api/board`: `snapshot()` as is (0420), plus `read_only` added as the last key.
  - `/api/tasks/<x>`, where `<x>` is `rsplit('/')[1]`: `toDict(true)`.
  - `/api/sprints/<x>`: `toDict(true)`, plus `progress` (without `tasks`) and `tasks_detail` (per-member `sprintProgress`, as Python).
  - `/api/check`: `{ok, problems}`.
  - Anything else: 404 `{"error": "not found"}`.
- **POST:**
  - `/api/tasks`: 201.
  - `/api/tasks/<id>/<action>`, for status, assign, start, comment, log, rank and edit: `toDict(true)`. An unknown action is `NotFound("unknown action X")`, giving 404.
  - `/api/sprints`: 201.
  - `/api/sprints/<id>/status`.
  - `/api/check/fix`: `ok` is true when every problem ends with "(fixed)".
  - Anything else: 404.

**Per-field expressions are ported in Python's evaluation order:**
- `author = str(body.get("author") or "web").strip() or "web"`
- `_fail` raises inside the argument list.
- Create sends no `blocked_by`, as in Python.
- Edit keys come in the tuple order (title, priority, sprint, labels, blocked_by). Labels and blocked_by go through `_labels`. A falsy sprint becomes None.
- `bool()` becomes `pyTruthy`.
- `.strip()` on a value that is not a string throws `AttributeError("'<type>' object has no attribute 'strip'")`, as Python does.
- `_labels` uses `pyList` for anything that is neither None nor a string. That gives Python's `'int' object is not iterable` TypeError.
- `body.get` is `metaGet` (null when the key is missing).

**Errors:**
- **POST:** `NotFound` gives 404. `BoardError` or `ValueError` (the compat class and its subclasses) gives 400 `{"error": msg}`. Anything else gives 500 `{"error": "<e.name>: <msg>"}`.
- **GET:** only `NotFound` gives 404. Everything else gives 500, including `BoardError`, as Python's GET does.

**Body:**
- If there is no `Content-Length`, the body is `{}`. Python ignores a chunked body, and so does the port.
- The bytes are decoded strictly as UTF-8 and then parsed with `pyJsonLoads`.
- A decode or parse error gives `BoardError("request body is not valid JSON")`. A JSON value that is not an object gives `BoardError("request body must be a JSON object")`.

**Response:**
- `pyJsonDumps(data, null, {ensureAscii: false})`, encoded with `pyEncodeUtf8`. A lone surrogate raises `UnicodeEncodeError`, which is a ValueError and gives 400, as Python.
- Headers are exactly Content-Type, Content-Length and Cache-Control: no-store.
- Also `Connection: close`. Python answers HTTP/1.0 with one request per connection. This mirrors that and makes shutdown clean.

**Path parsing:** a small `urlparsePath` reproduces Python 3.9.6's `urlparse(...).path`:
- the scheme rule;
- a leading `//netloc`;
- `#` and `?` split off;
- tab, CR and LF removed.

Then parts are split on `/`, with empty parts dropped.

**Other methods (PUT, HEAD, OPTIONS and so on):** Python's `send_error(501, "Unsupported method ('X')")`, byte-exact:
- reason phrase as the status message;
- `Connection: close`;
- `Content-Type: text/html;charset=utf-8`;
- Python 3.9.6's `DEFAULT_ERROR_MESSAGE` body, with the message HTML-escaped (quote=False);
- for HEAD, headers only.

This also makes a CORS preflight fail: 501 and no Access-Control-* headers.

**Logging:** none. Python silences `log_message`.

### 2.3 T-022 — checked on every POST
The checks run after Python's read-only check (still first, still 400 "this board is served read-only", so `--read-only` behaves exactly as before) and before the body is parsed.
1. **Host:**
   - The Host hostname must be `localhost`, an IPv4 literal, a bracketed IPv6 literal, or the `host` given to `makeHandler`/`serve` (case-insensitive).
   - A DNS name (the rebinding case) or a missing Host gives **403** `{"error": ...}`.
   - IP literals are safe to allow: rebinding needs a DNS name.
2. **Origin (the requesting site):** if present, it must be the server's own origin: `new URL(origin).origin === new URL('http://' + Host).origin`.
   - `null`, `https:`, another port or another host gives **403**.
   - A missing Origin (curl, agents, the ported Python tests) is allowed.
3. **Content-Type:** the media type (before `;`, trimmed, lower-cased) must be `application/json`. Otherwise **415**.
   - This turns any browser cross-site write into a preflighted request, which the 501 above then fails.

Notes:
- Each refusal leaves the board untouched.
- 403 and 415 are new status codes. Python had no refusal at all.
- GET is **not** checked. The brief scopes T-022 to writes. See Q2.

### 2.4 `serve()` and the CLI
- `serve()` creates the server and calls `listen(port, host)`. On `listening` it prints Python's banner exactly: `aiboard web board: http://<host>:<port>/  (root: <root>, read-write|read-only)  Ctrl+C to stop`.
  - The port printed is the one given, so `--port 0` prints `:0`, as Python does.
- When `open_browser` is true, it opens the browser 500 ms later, like Python's `webbrowser.open`:
  - Each entry of `$BROWSER` (split on `:`) is tried in order. `%s` is replaced by the URL, or the URL is appended. The command is spawned and awaited, and a non-zero exit moves on to the next entry.
  - Then the platform default: `open` on macOS, `xdg-open` elsewhere, `cmd /c start` on Windows.
  - Errors are swallowed. Spawns are detached, with stdio ignored.
- A SIGINT handler (in `serve()` only) clears the timer, then calls `server.close()` and `closeAllConnections()`. The process ends with exit 0, as Python's KeyboardInterrupt path does.
- A listen error (port in use, bad port) is rethrown. That gives exit 1 with stderr text that differs from Python's traceback: the same class as 0421's accepted crash cases.
- `cmdServe(args)`:

  ```
  serve(boardOf(args), { host: args.host, port: args.port, open_browser: !args.no_open, read_only: args.read_only })
  ```

  It returns, `main()` returns 0, and the server keeps the process alive.
- `server.mjs` is imported statically into `cli.mjs`. It adds `node:http` load time to every CLI call, a few ms. Python imports it lazily.

## 3. `python-compat.mjs` — the JSON layer (0417's carried note)
- **`pyJsonLoads` is rewritten as a small recursive-descent parser** with `json.loads` semantics:
  - objects become `Map`s in **source key order**, a duplicate key keeping its first position and its last value;
  - arrays and strings, with Python's escape and control-character rules;
  - `NaN`, `Infinity` and `-Infinity` accepted;
  - integers are Numbers, or BigInt past 2^53 (the current rule);
  - floats are JS numbers;
  - only the JSON whitespace set; a BOM is rejected;
  - errors are `JSONDecodeError` with Python's message text (for example "Expecting value: line 1 column 1 (char 0)").
- **Knock-on to the CLI.** `pyJsonLoads` is also how `aiboard.json` is read (`store.mjs`). Integer-like config keys now keep Python's order in `info --json`. NaN and Infinity in config now load. Config JSON error text changes from V8's wording to Python's. All three move closer to Python, and no current test pins the old behaviour (grepped).
  - The alternative is a second, server-only parser that leaves config alone. I chose one JSON layer. Say so if you want config left untouched.
- **`pyEncodeUtf8(text)`** is the surrogate check that `pyWriteText` already does, split out so the server reuses it. `pyWriteText`'s behaviour does not change.
- **Can a JSON number reach `pyStr` on the server path? Yes.**
  - Through `str()` calls: author, title, body, goal, message, status (both moves), `_labels` items, `note` (via `moveTask`'s `pyStr`), and edit's raw `title` stored into meta and dumped.
  - **Objects:** they are Maps in source order, so `pyStr` never throws and matches Python. For example, author `{"b": 1, "2": 2}` gives `{'b': 1, '2': 2}`. Tested.
  - **Floats:** not matched. `JSON.parse` semantics lose int-versus-float, so `1.0` prints `1`, `1e-7` prints `1e-7` (Python `1e-07`), and `1e16` prints `10000000000000000` (Python `1e+16`).
  - Tagging floats through to the store would touch 0417/0418 code (`pyTruthy`, store arithmetic, config). **Proposed: accept this as a known, text-only gap. See Q1.**
  - The page itself never sends a number: it sends author strings, plus fields from its own forms as strings, and `force`/`top` booleans.

## 4. Sequencing (tests first, red then green)
1. **Copy the page.** Verify sha256 and size.
2. **Write `test/board/server.test.js`** (contents in §5). Run it: **red**, because the module is missing. Record the output.
3. **Rewrite `pyJsonLoads` and add `pyEncodeUtf8`.** Run `test/board/*.test.js`: the existing store, cli and model suites stay green. Run a bounded scratch probe, `pyJsonLoads` against Python 3.9.6 `json.loads`, over about 60 valid and invalid inputs: values, key order and error text.
4. **Write the naive faithful server** (§2.1–2.2, no T-022 checks) and the real `cmdServe`. The 6 ported tests go **green**.
   - The T-022 tests go **red**, with the naive server **accepting** the attack. Recorded in the worklog: status 200, task `backlog` → `done`, author "Mark" in the worklog. This is Verification 2's "accepted by a naive port".
5. **Add the T-022 checks** (§2.3). Everything goes green.
6. **Python parity probe (scratch only, bounded).**
   - Python's `make_handler` runs on a temp board (`git archive a1592dc` extracted into the scratchpad, `python3 -I`, port 0, in one process that makes its own requests and shuts down).
   - Node's handler gets the same request list.
   - Status codes and JSON bodies are compared, with timestamps, paths and root normalized. Response headers that matter and the 501 bytes are compared too.
   - The list covers every route in the 6 ported tests plus a wrong-type matrix: each POST field × {null, true, 0, 1, 1.0, 1.5, "", "x", [], ["a"], {}, {"a":1}}.
   - The run is driven from Node with `spawnSync(..., {timeout: 60000, killSignal: 'SIGKILL'})`. Python's `aiboard serve` is never run.
   - What happens with differences depends on Q1.
7. **Negative controls (scratch copies only, never the source).** Each new test is shown able to fail:
   - T-022: drop each check in turn.
   - Ordering: a scratch server that splits a comment's read and write across an `await`, a lost-update shape. The test must fail.
   - Page bytes: serve the vendor copy plus one byte.
8. **Checks** (§6).

## 5. `test/board/server.test.js` — the one test file (pre-approved by A3)
**Port of `tests/test_server.py`.**
- `describe('ServerTests')`, with Python's names verbatim and in order so 0423 can match them: `test_critical_priority`, `test_rank_endpoint`, `test_index_and_board`, `test_write_flow`, `test_errors`, `test_read_only`.
- Setup mirrors Python's:
  - temp root from `mkdtemp` + `realpath`;
  - one `Board` with `init({name: 'Srv'})`;
  - `createServer(makeHandler(board)).listen(0, '127.0.0.1')`;
  - closed with `close()` + `closeAllConnections()` and awaited in `afterEach`.
- Requests use `node:http` with `agent: false`, so the headers sent are exactly the ones set.

**New tests for 0422 (one describe):**
1. **T-022, the original attack, refused.** `POST /api/tasks/T-001/status` with `Origin: https://evil.example`, `Content-Type: text/plain;charset=UTF-8`, body `{"status":"done","author":"Mark"}`. Expect 415. The task is still `backlog` and its worklog is byte-identical.
2. **T-022, every mutating endpoint refuses a cross-site write.**
   - Endpoints: tasks create, the 7 task actions, sprint create, sprint status, check/fix.
   - Shapes:
     - text/plain with no Origin;
     - application/json with a foreign Origin;
     - `Origin: null`;
     - DNS rebinding (`Host: evil.example:<port>` plus a matching Origin).
   - Each gets 403 or 415, and the board's files are byte-identical before and after (a tree snapshot).
   - The same on a `read_only` server gives Python's 400.
3. **T-022, same-origin still works.**
   - Writes with `Origin` and `Host` of `127.0.0.1:<port>` and of `localhost:<port>`, `application/json; charset=utf-8`, including a drag-to-status move.
   - A write with no Origin (agent or curl).
   - An IP-literal Host.
   - `OPTIONS` gets 501 with Python's bytes and no `Access-Control-*` header.
4. **Simultaneous writes: none lost or reordered.**
   - 40 concurrent `POST /api/tasks` (half joining sprint S-001) plus 4 concurrent CLI processes (`node board/cli/main.mjs --root <tmp> task create`), all started before any is awaited; every child awaited.
   - Expect 44 tasks with ids T-001..T-044, no gaps or duplicates. Each response's id holds its own title. Rank strictly rises with id, so board order equals id order. S-001's task list is exactly its members, in id order. `check()` is empty.
   - Then 30 concurrent comments on T-001. Each message appears exactly once. The responses' `comments_count` values are exactly 1..30. The response with count k shows exactly the first k comments of the final list, which proves one serial order.
5. **Requests are read as Python reads them.**
   - The author `{"b": 1, "2": 2}` case (Maps, source order).
   - NaN as a title.
   - Bad UTF-8 and a non-object body each give 400 with Python's message.
   - A path with `?query` and `//` collapsing.
   - `GET /api/sprints/S-001` shape, `/api/check`, an unknown GET giving 404.
   - A wrong-type field gives Python's status and body. For example `assign` with assignee `5` gives 500 `AttributeError: 'int' object has no attribute 'strip'`. The exact cases come from the step-6 probe.
6. **The page.** `GET /` and `/index.html` return `board/web/index.html`'s exact bytes, with the content type and `no-store`.
7. **`serve` from the command line.**
   - Two child processes: one plain, one with `--read-only`.
   - Each runs with `--no-open`, `BROWSER=true`, `--root <tmp>`, cwd tmp, `AIBOARD_ROOT` unset, on a port picked free by the test.
   - Each prints Python's banner, serves `/api/board` with the right `read_only`, and exits 0 on SIGINT.
   - In `finally`: SIGKILL if the child is still alive after 5 s, and always wait for `exit`.

**Q16 guard:** the test helper asserts every root is under `realpath(tmpdir())` before any server starts. At build, `test/board/server.test.js` is also grepped for `ai-agents`, `process.cwd()` and `--root .`.

**Time:**
- Expected about 2–3 s for the whole file. The slowest pieces are test 4 (about 0.5–1 s, from 4 Node children) and test 7 (about 0.5–1 s, from 2 children).
- **No slow test expected.** Any test over 5 s is named to you before going on.
- The full `npm test` time is measured before and after. 0418 last recorded 73.1 s, so measured again, not assumed. The budget is 120 s.

## 6. Checks
- **`npm test`** (CONTRIBUTING: `board/`, `test/`). Run in full, with wall time recorded before and after.
- **`node --test test/board/server.test.js` 25 times in a row.** All must pass. This is Verification 3, with the count stated.
- **Skipped:** `npm run test:prove-red` and `npm run test:release`. No file in their rows is touched.
- **Manual and bounded:**
  - The `$BROWSER` path: `serve` without `--no-open`, with `BROWSER` set to a scratch script that writes the URL to a file. Wait 2 s, SIGINT, wait for exit.
  - **Not verified:** the `xdg-open` and Windows default paths. There is no such machine here.
- **Leftovers:** no raw U+2028, U+2029, U+FEFF or U+0085 in changed files. No leftover temp directories, `.aiboard.lock*` files, or processes.

## 7. Risks and accepted differences (listed for 0423)
- **Node's HTTP parser answers malformed requests itself** (a bad `Content-Length`, a missing Host on HTTP/1.1) before the handler runs. Python's handler would see them.
- **Header differences.** No `Server: BaseHTTP/0.6 Python/3.9.6` header. The status line says HTTP/1.1, with `Connection: close`.
- **Host binding.** `--host ::1` works in Node; Python crashes (AF_INET). `localhost` may bind IPv6 in Node.
- **Recursion depth.** Very deep JSON nesting: Python raises RecursionError (500) at about 1,000 levels; Node at a much deeper level.
- **Float text, and 500 wording for wrong-type fields.** See Q1.
- **Lock waits block the event loop** (§2.1).
- **⚠️ Q16 is a rule, not code.** `node board/cli/main.mjs --root ai-agents serve` in fkit would treat fkit's `ai-agents/` as a board, because it has `tasks/` and `sprints/` folders. Writes would then land in real data.
  - This is true of the CLI write commands since 0421 as well.
  - Nothing routes to `board/` until 0444. The owner door with its one-time key is phase 3 (0433).
  - No guard is added here, since it is not in the brief.
- **The brief's Verification line `node --test test/*.test.js` is out of date.** `npm test` is now the whole suite, as the 2026-10-20 correction note says.

## Open questions for the owner

**Q1 — How faithful must hand-made, wrong-type JSON fields be?**
Context: the page always sends text where text is expected. Only a hand-made request (curl, a script) can send a number, list, object or true in a field like title, author, status or assignee. Python then often fails with a 500 whose message names a Python type, or prints floats its own way (`1.0`, `1e-07`). Matching all of that exactly would mean changing the model and store ported in 0417/0418, and passing float-versus-int information through the JSON layer.
- **A (Rec):**
  - **Exact match:** status code and full JSON body for every request the page can send and every request in the tests.
  - **Hand-made wrong-type requests:** a Python-vs-Node probe is run, and every **status-code** difference is fixed inside `server.mjs` only.
  - **Accepted as known gaps, listed for 0423:** error-message wording and float text (`1.0` → `1`, `1e-07` → `1e-7`).
  - **If a status-code fix would need store or model changes,** I stop and ask.
- **B:** full match, including messages and float text. This changes 0417/0418 code and the JSON layer: bigger and riskier.
- **C:** accept every wrong-type difference without probing.

**Q2 — Read-side DNS rebinding (outside T-022's write scope).**
Context: the T-022 fix stops hostile sites from **writing**. A site using DNS rebinding (its name re-pointed to 127.0.0.1) can still **read** the board through GET while a server runs. That holds for this port, which follows Python, and **for today's shipped `fkit board` reader** (`bin/fkit-board.mjs`, on real project data, with no Host check; I read its handler). The brief does not cover reads, and this task must not change the reader.
- **A (Rec):** 0422 stays as briefed (writes only). The producer files a small follow-up task for a Host check on reads in the shipped reader, and in `board/` later.
  - Knock-on: none. It would be a new unranked Backlog item, and no `Depends on:` link changes.
- **B:** also add the Host check to GET in 0422. That departs from Python on reads, and the shipped reader stays exposed until its own fix.
- **C:** do nothing for now.

Smaller calls made in the plan (say if you disagree):
- the page is copied into `board/web/` rather than reusing `vendor/`;
- refusals use 403 and 415;
- a missing Origin is allowed;
- IP-literal Hosts are allowed;
- one JSON parser, which also changes config reading (§3);
- no separate LICENSE file under `board/web/`.

open_questions: [Q1 wrong-type and float fidelity rule (Rec A), Q2 read-side DNS rebinding follow-up, also affecting the shipped reader (Rec A, knock-on none)]
