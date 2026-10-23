PLAN — task 0538: refuse reads from a foreign host name in the shipped `fkit board` reader

Planning-only (spawned, so no EnterPlanMode; I followed the written no-edit rule instead). I wrote no source, no test and no plan.md. I ran two bounded probes, both with scratchpad scripts, a temp tree under realpath(tmpdir()), port 0, a SIGKILL timer awaited and a perl `alarm` around the whole run. Afterwards `pgrep` showed no reader still running.

## Summary
- **What I measured.** Today a GET with `Host: evil.example:<port>` gets **200** with board data. HTTP/1.0 with no Host also gets 200. HTTP/1.1 with no Host gets **400**, sent by Node's HTTP parser before the handler runs (Node v24.13.0). With two Host headers, Node keeps the first one.
- **The fix.** One small function plus one check in `bin/fkit-board.mjs`. It is a byte-for-byte copy of the Host half of `board/server/server.mjs` `refuseCrossSite`, so 0539 can use the same rule and wording.
- **Refusal.** **403**, JSON `{"error":"read refused: the Host header does not name this board server"}`. No board data, no path, and the Host value is not echoed back.
- **Order of checks.** The method check stays first, so the existing 405 is unchanged for every non-GET, whatever its Host. The Host check runs next, before any route is matched.
- **Two owner questions:** Q1, the test file (ADR-057 D2.1). Q2, what an HTTP/1.1 request with no Host gets (brief says 403, Node already sends 400).

## 1. Files and exact changes

### 1.1 `bin/fkit-board.mjs`
1. Import: `import { isIPv4, isIPv6 } from 'node:net';`
2. A new function, not exported, in the `── The server ──` section above `startServer`. Same regex and logic as `refuseCrossSite`'s Host part:
   ```js
   // A site whose DNS name is re-pointed at 127.0.0.1 is same-origin to the browser; only the Host header
   // names it, and an IP literal cannot be rebound. Same rule as board/server's refuseCrossSite.
   function hostNamesThisServer(hostHeader, ownHost) {
     const m = /^(\[[^\]]*\]|[^:[\]]+)(?::\d*)?$/.exec(hostHeader ?? '');
     const name = m ? m[1].toLowerCase() : null;
     const bare = name?.startsWith('[') ? name.slice(1, -1) : name;
     const own = ownHost == null ? null : String(ownHost).toLowerCase().replace(/^\[(.*)\]$/, '$1');
     return name === 'localhost' || (bare !== null && (isIPv4(bare) || (name !== bare && isIPv6(bare)) || bare === own));
   }
   ```
3. In the `createServer` handler, directly after the existing `req.method !== 'GET'` → 405 block and before `const path = …`:
   ```js
   if (!hostNamesThisServer(req.headers.host, host)) {
     return json(403, { error: 'read refused: the Host header does not name this board server' });
   }
   ```
   `host` is `startServer`'s existing parameter, default `'127.0.0.1'`. There is no `--host` flag and none is added, so "the configured host" is always `127.0.0.1`, which is already an IPv4 literal. It is passed only so the rule matches 0422's.
4. `USAGE`: add one line after the `-h, --help` line:
   `'  Requests are answered only under localhost or an IP address; any other host name gets 403.\n'`
   (Its wording follows Q2.)

**The rule, in plain terms.** Take the Host header, drop the port, ignore case.
- **Allowed:** `localhost`, any IPv4 literal (`127.0.0.1`, `127.0.0.2`, …), a bracketed IPv6 literal (`[::1]`), or the host it was started on.
- **Refused:** any other name (`evil.example`, `127.0.0.1.evil.example`, `localhost.`), an unbracketed IPv6 address, an empty or garbled Host, and a missing Host.

**What still works:**
- The URL the reader prints, `http://127.0.0.1:<port>/`.
- `http://localhost:<port>/`.
- The page and all its `/api/*` reads: the page fetches relative `/api/...`, so the browser sends the same Host the user typed.
- `--port`, `--root`, `--aiboard`, `--bench`, and the launcher route, which is untouched.
- `[::1]` is allowed by the rule. A browser cannot reach `http://[::1]:<port>/` anyway, because the reader binds IPv4 `127.0.0.1` only. That is unchanged and out of scope.

### 1.2 `docs/board.md`, section "What it listens on, and what it accepts"
Add one line: it answers only requests whose `Host` is `localhost`, an IP address, or the address it listens on (case and port ignored). Any other host name gets `403` and a JSON error with no board data. (The no-Host part is worded per Q2.)

### 1.3 `CHANGELOG.md`, `## Unreleased`
CONTRIBUTING asks for a line on any change users would notice. New bullet: `fkit board` now refuses (403) a request addressed under any host name other than `localhost` or an IP address, so a web page you have open cannot read your board through another domain name; `http://127.0.0.1:8585/` and `http://localhost:8585/` work as before.
This describes the class of problem only: no payload, no reproduction steps (ADR-049 disclosure limit).

### 1.4 Only if Q1 = A
- **New `test/board-reader-host.test.js`.** The existing `test/*.test.js` glob in `npm test` picks it up. It tests the shipped script from outside, as CONTRIBUTING's test rules require:
  - it spawns `node bin/fkit-board.mjs --root <temp tree under realpath(tmpdir())> --port 0` and reads the port from the banner;
  - it sends raw-socket requests, then SIGKILLs the reader in `after()`, awaited.
- **Allowed cases:** `127.0.0.1:p`, `localhost:p`, `LocalHost:p`, `[::1]:p`, `127.0.0.2:p` → 200 on `/`, `/api/board`, `/api/check`, one `/api/tasks/<id>`, one `/api/sprints/<id>`.
- **Refused cases:** `evil.example:p`, `127.0.0.1.evil.example:p`, and HTTP/1.0 with no Host → 403. The body must not contain the temp tree's path or the demo task's title.
- **Other cases:**
  - HTTP/1.1 with no Host → 400 if Q2 = A, 403 if Q2 = B;
  - POST with an allowed Host → 405, unchanged;
  - POST with a foreign Host → 405 (the method check comes first).
- **Cost:** one spawn and two `dashboard.sh` calls, an estimated ≤ 2 s. Not measured yet; it will be measured and reported.
- **`CONTRIBUTING.md` "Test rules":** one clause naming the shipped reader `bin/fkit-board.mjs` as testable from outside (ADR-057 D1 dated note: it ships since ADR-058). As written, the list says "Not repo-only tools under `bin/`" and does not name the reader, so without this clause a reviewer could read the new test as against the rules. The owner's OK for the file covers this clause too.

### 1.5 Not touched
- `README.md`'s Web-board paragraph: a short summary that links to `docs/board.md`. My assumption; the owner can override at approval.
- `vendor/aiboard/`, `install.sh`, `claude/fkit-claude.sh`, `board/` (that is 0539), 0411's ledger (closed history, per the brief), and the wiki.

## 2. Order of work
1. **Before editing:** copy this repo's `ai-agents/tasks` and `ai-agents/sprints` to a temp tree under realpath(tmpdir()). Run the unchanged reader on it, bounded (port 0, SIGKILL timer, awaited). Save the bodies of `/`, `/api/board` (minus `generated`), `/api/check`, one `/api/tasks/<id>` and one `/api/sprints/<id>` to the scratchpad.
2. Make the edits in 1.1 → 1.3, then 1.4 if approved.
3. **After editing:** run the same bounded capture on the same temp tree with Host `127.0.0.1:p` and `localhost:p`, and diff against step 1. Expected: identical.
4. **Manual host matrix,** bounded: every case listed in 1.4. Record it in the worklog. If Q1 = B, this is the only proof.
5. **Launcher check,** bounded: `bash claude/fkit-claude.sh board --root <temp> --port 0` (in a checkout, share is the repo root), then GET `/` with Host `127.0.0.1:p` → 200 HTML, then SIGKILL.
6. Run `npm test` and time it.
7. Worklog: the before/after diff, the matrix results, the checks run and skipped.

## 3. Checks
- **Run `npm test`.** `bin/fkit-board.mjs`, `test/` and `ai-agents/` fall in the "Anything else" row. `docs/board.md`, `CHANGELOG.md` and `CONTRIBUTING.md` fall in the "nothing" row. Report the run time against the ADR-057 D10 budget (≤ 2 min).
- **Skip `npm run test:prove-red`:** no launcher, `skills-for-role.sh` or hook file is touched, and prove-red copies only `claude/`.
- **Skip `npm run test:release`:** `bin/release.mjs` is not touched.
- **Not run by any agent — owner check:** "`fkit board` opens the page in the browser and the board renders". The reader itself opens no browser (it only prints the URL), and the safety rule forbids opening one. Step 5 is the agent's stand-in. The visual render stays unverified until the owner looks.

## 4. Edge cases and risks
- **No Host on HTTP/1.1:** Node's parser answers 400 before the handler (measured). See Q2.
- **Duplicate Host headers:** Node keeps the first, so the check judges that one. A foreign first Host is refused.
- **Port in the Host is ignored,** same as 0422. A mismatched port does not matter: only the name can be rebound.
- **A bracketed IPv4** (`[127.0.0.1]`) is allowed. 0422 behaves the same; it is an IP literal, so it is harmless.
- **`localhost.` with a trailing dot** is refused, as in 0422. A user would only hit this by typing it.
- **HEAD/OPTIONS** still get 405 (method check first).
- **Keeping the two servers in step.** The rule is a copy of `refuseCrossSite`'s Host half, not an import: `board/` is not shipped yet and the reader retires with 0467. 0539 should use the same regex and the matching `read refused: …` wording.
- **Comments:** the one new 2-line comment says why. No existing comment is made wrong: the header's "Every method that is not GET is refused" still holds.

## open_questions

**Q1 — Add a test file for the Host check? (ADR-057 D2.1: a new test file needs your OK.)**
Context: the reader has had no tests since 0529 deleted them. A test would start the real reader on a small temp project and check that local addresses get the board and other names get refused. It runs in about 2 s inside `npm test`.
- **A (Rec): yes — `test/board-reader-host.test.js`, plus one clause in `CONTRIBUTING.md`'s test rules naming the shipped reader as testable.** The reader ships to every user and this is a security fix; if a later edit reorders the handler, the check would silently stop working and only a test would notice. Knock-on: when 0467 retires the reader, it must delete this test too. No placement or dependency change.
- **B: no test file.** Proof is the manual check recorded in the worklog. No growth in the test suite, but a later regression goes unnoticed until 0467 removes the reader.

**Q2 — A request with no Host header at all: is Node's own "400 Bad Request" fine, or must it be 403 as the brief says?**
Context: browsers always send a Host, so this only affects hand-made requests. Both answers refuse and leak nothing. Node already rejects a modern (HTTP/1.1) request without a Host before the reader's code runs. Only an old-style (HTTP/1.0) request without one reaches the reader, and that one gets the new 403. The board server in `board/` behaves the same way today.
- **A (Rec): keep Node's 400 for HTTP/1.1, and 403 for everything else that is refused.** 400 is the standard answer, it is the least code, and it matches `board/server` (0539 can follow). The plan records that this differs from the brief's literal "403".
- **B: switch off Node's check (`requireHostHeader: false`, confirmed to work on Node v24.13.0 here), so the reader answers every missing Host with its own 403.** Matches the brief word for word; 0539 would then have to do the same to stay aligned.

No placement or dependency questions. Knock-on of every option: none, except Q1-A's note for 0467.

## Open questions resolved at approval
- Q1 — owner chose "Approve, add the test (Recommended)" (= Q1-A: `test/board-reader-host.test.js` plus the one `CONTRIBUTING.md` test-rules clause).
- Q2 — owner chose "Keep Node's 400 (Recommended)" (= Q2-A).
