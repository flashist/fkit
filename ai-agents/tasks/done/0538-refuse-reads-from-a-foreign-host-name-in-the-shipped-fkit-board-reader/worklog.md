# Worklog — 0538 Refuse reads from a foreign host name in the shipped `fkit board` reader

## 2026-10-23 — Build (fkit-coder, spawned Build worker, driven by fkit-lead)

**Authority.** Declared-approval marker (ADR-055) from `fkit-lead`: approved plan carried verbatim
(`plan.md`, blob `76f12f0d80bb35afbfc3b4dbb45b62d211b54332`, checked with `git hash-object` before
starting: match). Owner approval quoted 2026-10-23, `AskUserQuestion`, `fkit-lead` session: Q1 →
*"Approve, add the test (Recommended)"*, Q2 → *"Keep Node's 400 (Recommended)"*. Nothing committed.

### Change surface
- `bin/fkit-board.mjs` — `node:net` import; new `hostNamesThisServer()` (the Host half of
  `board/server/server.mjs` `refuseCrossSite`, regex and logic identical — diffed line by line); a
  403 check right after the 405 method check, before any route; one `--help` line.
- `docs/board.md` — *What it listens on, and what it accepts*: one sentence on the Host rule, and the
  no-Host answer per Q2-A (400 on HTTP/1.1 from Node, 403 on HTTP/1.0).
- `CHANGELOG.md` — one `## Unreleased` bullet, class only (ADR-049).
- `CONTRIBUTING.md` — *Test rules* → *What a test may cover*: new item 4 naming `bin/fkit-board.mjs`
  as a shipped script testable from outside (ADR-057 §D1 cat. 3 dated note, ADR-058).
- `test/board-reader-host.test.js` — new (owner's OK: Q1-A). Spawns the real reader on a two-file temp
  tree under `realpath(tmpdir())`, port 0; raw-socket requests; SIGKILL + awaited exit + temp-dir
  removal in `after()`.

### Safety
Every run: port 0, `BROWSER=true`, a SIGKILL timer, awaited exit, a perl `alarm` around the process.
Every `--root` was a temp copy of this repo's `ai-agents/tasks` + `ai-agents/sprints` under
`realpath(tmpdir())`, or the test's own fixture. `pgrep -fl fkit-board.mjs` after each batch: nothing
running. Temp copy removed; no `fkit-board-host-*` / `fkit-0538-*` dirs left. No browser opened, no
Python server run.

### Before / after (plan §2 steps 1 and 3)
Same temp tree, `/`, `/api/board` (minus `generated`), `/api/check`, `/api/tasks/0013`,
`/api/sprints/BACKLOG`, each under Host `127.0.0.1:<p>` and `localhost:<p>`: 10 bodies captured on
the unchanged reader, 10 after the change. `diff -r`: **identical**; status lines identical (all 200).

### Host matrix (plan §2 step 4), unchanged reader → changed reader
| Request | Before | After |
|---|---|---|
| `127.0.0.1`, `localhost`, `LocalHost`, `[::1]`, `127.0.0.2` (all 5 paths) | 200 | 200 |
| A non-local DNS name, a name that starts with `127.0.0.1.`, `localhost.`, unbracketed `::1`, empty Host (all 5 paths) | 200, board data in body | 403, 73-byte JSON error, no title, no path |
| HTTP/1.0, no Host | 200 | 403 |
| HTTP/1.1, no Host | 400 (Node) | 400 (Node) — Q2-A |
| POST, local Host / non-local Host | 405 / 405 | 405 / 405 |
| HEAD, non-local Host | 405 | 405 |
| Two Host headers, non-local first | 200 | 403 |

### Launcher (plan §2 step 5)
`bash claude/fkit-claude.sh board --root <temp> --port 0`: GET `/` under `127.0.0.1:<p>` → 200, 33 848 B
HTML (same size as the direct run); under a non-local name → 403. SIGKILLed, awaited.

### Red / green
- **Red:** `bin/fkit-board.mjs` temporarily replaced by `git show HEAD:bin/fkit-board.mjs`, then
  `node --test test/board-reader-host.test.js`: exit 1 — 2 pass (allowed hosts; 405), **2 fail**
  (non-local name: `actual: 200, expected: 403`; HTTP/1.0 no Host: `actual: 200, expected: 403`). New
  file restored from a scratchpad copy; `cmp` confirmed byte-identical.
- **Green:** same command on the changed reader: 4/4 pass, `duration_ms` 273.

### Checks
- `npm test` — **ran: exit 0, 937 tests, 936 pass, 0 fail, 1 skipped** (the env-gated
  `FKIT_BOARD_BENCH=1` benchmark, pre-existing). Wall 89 s (`duration_ms` 88 952) vs the ADR-057 D10
  budget of ≤ 2 min. The new file adds ~0.3 s (plan estimated ≤ 2 s). The `MODULE_TYPELESS_PACKAGE_JSON`
  warning it prints is printed by all 29 test files, not new.
- `npm run test:prove-red` — **skipped**: no launcher, `skills-for-role.sh`, hook or prove-red test file
  touched.
- `npm run test:release` — **skipped**: `bin/release.mjs` not touched.
- `docs/board.md`, `CHANGELOG.md`, `CONTRIBUTING.md` — "nothing" row; read by eye, no links touched.
- **Not verified — owner check:** "`fkit board` opens the page in the browser and the board renders".
  The reader opens no browser itself and the safety rule forbids opening one; the launcher check above
  (200 + same HTML bytes) is the agent's stand-in.

## Decision log
Choices made unattended inside the approved plan; none outside it.
1. **CONTRIBUTING clause placement** — answers plan §1.4's CONTRIBUTING bullet. Added as item 4 of the
   numbered *What a test may cover* list rather than editing the "Not repo-only tools under `bin/`"
   line. Why it qualified: in-plan ("one clause"), localized; the existing line stays true (the
   reader is the shipped exception, named above it).
2. **Test fixture is a two-file tree written by the test**, not a copy of this repo's tree — answers
   plan §1.4 ("a temp tree under realpath(tmpdir())", "the demo task's title"). Why: in-plan, and it
   keeps the test independent of this repo's live `ai-agents/` content (ADR-057 cat. 5).
3. **The test asserts the exact 403 JSON body**, and that the allowed answer does carry the demo title
   (so the "no title in the refusal" check cannot pass vacuously). Why: mechanical strengthening of
   plan §1.4's refused-case check, within its intent.
4. **The refused-case loop in the test covers the two names plan §1.4 lists**; the wider set
   (`localhost.`, unbracketed `::1`, empty Host, duplicate Host, HEAD) is in the manual matrix only.
   Why: plan §1.4 names the test's cases; adding more would widen the approved file.
5. **`--help` line kept as plan §1.1 item 4 wrote it**: Q2-A leaves it accurate (every refused host
   name gets 403; the no-Host 400 is not a host name). docs/board.md carries the no-Host detail.
6. **Red-run method** — temporary swap of the reader for its HEAD copy, restored and `cmp`-checked.
   Why: the only way to run the unchanged reader at the path the test spawns without adding a test
   knob.
7. **Brief vs build, owner-ruled:** the brief's "no `Host` at all → 403" holds for HTTP/1.0 only;
   HTTP/1.1 gets Node's 400, per the owner's Q2-A answer. Recorded so a verifier does not read it as
   a miss.

## 2026-10-23 — Verify (fkit-coder, spawned VERIFY worker, driven by fkit-lead; read-only on source)

**Result: pass.** Nothing in source changed by this step; nothing committed.
- `npm test`: exit 0, 937 tests, 936 pass, 0 fail, 1 skipped (env-gated bench). Wall 78 s (≤ 120 s budget).
- `test/board-reader-host.test.js` alone ×3: 4/4 each, 211 / 220 / 226 ms.
- Negative control on scratch copies (repo file untouched): Host check removed → 2/4 fail
  (`200 ≠ 403` foreign name; `200 ≠ 403` HTTP/1.0 no Host); check moved after route matching (before
  the final 404) → same 2 fail. The test catches both.
- Own host matrix, real reader, temp copy of this repo's tasks + sprints under `realpath(tmpdir())`,
  7 paths: allowed `127.0.0.1`, `localhost`, `LocalHost`, `[::1]`, `127.0.0.2` → 200; refused foreign
  DNS name, `127.0.0.1.<name>`, `localhost.`, unbracketed `::1` (bare and with port), empty Host,
  HTTP/1.0 no Host, duplicate Host foreign-first → 403, 73-byte JSON, no title / root / `/Users/` in
  body; HTTP/1.1 no Host → 400 (Node, per Q2-A); POST / HEAD under local and foreign Host → 405.
  Info: duplicate Host local-first → 200 (Node keeps the first Host; same as `board/server`).
- vs HEAD's reader, under `127.0.0.1` and `localhost`, 7 paths incl. a 404: status, headers (minus
  Date) and bodies (`/api/board` minus `generated`) identical.
- Launcher `bash claude/fkit-claude.sh board --root <temp> --port 0`: `/` → 200 (33 899 B); foreign → 403.
- `hostNamesThisServer` vs `refuseCrossSite`'s Host half: regex identical; logic identical. Only
  deltas: `?? ''` moved into the `exec` call; `ownHost == null` vs `=== null` (also covers undefined;
  `host` always defaults to `127.0.0.1`) — no behavior change.
- CHANGELOG line: class only, no payload or repro (ADR-049). No secrets/endpoints in the diff (only the
  existing `127.0.0.1:8585` / `localhost:8585` and RFC 2606 `evil.example`). No raw U+2028/U+2029/
  U+FEFF/U+0085 in any changed file. `plan.md` blob still `76f12f0d80bb35afbfc3b4dbb45b62d211b54332`.
- Skipped: `test:prove-red` (no launcher / hook / skills-for-role / prove-red file touched);
  `test:release` (`bin/release.mjs` untouched); owner browser check (no browser by rule).
- Safety: port 0, `BROWSER=true`, SIGKILL timers + perl `alarm`, awaited exits; my `fkit-proj-*` root
  removed; no `fkit-board` process left. A `fkit-0538-rev-*` temp dir appeared during the run — not
  this worker's; left alone.
