# Plan — 0423: prove the Node port matches the Python reference on fkit's corpus (ADR-052 phase-2 gate)

## 0. Facts this plan rests on (checked 2026-10-22)
- Python reference: aiboard `a1592dc` (T-023 fixed). `git diff --stat a1592dc HEAD -- aiboard/` in ~/Workspace/aiboard is empty, so the reference code is unchanged at aiboard HEAD (`784e0ca`). Only `tests/test_board.py` (date-independent stale test) and `scripts/fkit_corpus_check.py` (`cb742bb`, "the corpus as phase 1 ran it") came later. Interpreter: `/usr/bin/python3` 3.9.6, the same one 0417-0422 used. Node v24.13.0.
- aiboard tests at `a1592dc`: `test_board.py` 48 (ModelTests 9, BoardTests 32, InstructionsTests 2, CliTests 5), `test_server.py` 6, `test_mcp.py` 10, total 64. The count was 62 at `0108027`; `a1592dc` added `test_zero_padded_digits_roundtrip_byte_identical` and `test_hostile_scalars_roundtrip`. Owner ruling 2026-09-30 (ADR-052): non-MCP tests are ported in phase 2, the 10 MCP tests go with `0468` (its brief carries them). So "all 62" in Verification 2 becomes 54 ported + 10 mapped to `0468` = 64.
- `test/board/` holds 6 files with 88 tests. All 54 non-MCP aiboard names appear verbatim as `test('<name>'`. The other 34 are fkit additions (T-021, T-022, port guards, review fixes).
- Port under test: `board/` (cli, core, server, web), **untracked in git**, so no commit names it. The worklog records a sha256 manifest of every `board/` file instead.
- Corpus today: HEAD `32c0f36`. Tracked briefs at HEAD: 536. Briefs in the working tree: 539 (the tree is dirty: 0417-0422 moved to done/ and uncommitted). Sprint plans at top level: 3 (`backlog.md`, `sprint-12.md`, `sprint-14.md`). Archived boards in `sprints/done/`: 12. All `.md` under `tasks/` + `sprints/`: 1,145. No CR bytes; every brief starts with `# `.
- `0539` (read-side Host check) is Backlog and has not landed. `board/server/server.mjs` checks Host on writes only. So by the brief's 2026-10-22 note, all GETs with a local Host must match Python exactly, and `0539` re-runs the server-facing part later.

## 1. What enters the repo
- **Only** `ai-agents/tasks/backlog/0423-.../worklog.md` (new). No source change, no test file, no `plan.md` from me, no script, and no brief edit.
- The harness is a **one-off script in the session scratchpad** (ADR-057 D2.1, A3: "a one-off script whose output the worklog pastes, not a kept test"). Location: `<scratchpad>/p423/scripts/`. The aiboard extract goes in `<scratchpad>/p423/ref/`. All board data goes under `realpath(os.tmpdir())/p423-*`. Open question Q1 asks whether a copy of the scripts should also be kept for `0539`.
- If the harness finds an **unclassified** difference, fixing `board/` lies outside this plan. Stop and return NEEDS-DECISION with a minimal reproduction and a proposed fix (see §7).

## 2. Safety (Q16 and the caller's hard rules)
1. **Reference extract:** `git -C ~/Workspace/aiboard archive a1592dc aiboard | tar -x -C <scratchpad>/p423/ref/`, then `chmod -R a-w`. Each file is checked against `git ls-tree -r a1592dc aiboard` via `git hash-object`. The phase-1 script is copied with `git show cb742bb:scripts/fkit_corpus_check.py > <scratchpad>/p423/scripts/`. Nothing is written to the aiboard repo, and it never runs from its checkout.
2. **Corpus copies (pristine, read-only), under `T = realpath(mkdtemp(realpath(tmpdir()) + '/p423-'))`:**
   - Corpus H (the gate corpus, named by a commit): `git -C <fkit> archive <HEAD-sha>:ai-agents tasks sprints | tar -x -C T/corpus-head`. This reads git objects only. The `<tree>:ai-agents` form drops the `ai-agents/` prefix, so no copied path contains an `ai-agents` segment.
   - Corpus W (the live working tree, second run): `cp -Rp <fkit>/ai-agents/tasks <fkit>/ai-agents/sprints T/corpus-wt/`, which reads only. A sha256 manifest of the files is written.
   - Both copies get `chmod -R a-w`. Every run works on a fresh `cp -Rp` of a pristine copy (mtimes preserved), never on the pristine copy itself.
3. **Root guard** before every in-process run and every child process, on every board root, body-file path and cwd. `realpath(p)` must start with `realpath(tmpdir()) + sep`, must have no path segment `ai-agents`, and must not lie under the fkit repo or ~/Workspace/aiboard. If the guard fails, stop and touch nothing.
4. **Environment for both sides:** `AIBOARD_ROOT` deleted, `AIBOARD_AUTHOR=tester`, `BROWSER=true`, `COLUMNS=80` (plus one 200-column pass for kanban), `LC_ALL=en_US.UTF-8` (the locale 0421's harness matched under). cwd is the temp board, and `--root <temp board>` is always given explicitly. Python runs as `/usr/bin/python3 -I -B`: `-B` because `-I` ignores `PYTHONDONTWRITEBYTECODE`, and no `__pycache__` should land anywhere. Scripts are passed by path and sit in a folder separate from the data.
5. **No `serve`, ever:** the program generator refuses any argv containing `serve` or `mcp`. Servers are Python's `make_handler` and Node's `makeHandler`, in-process, on `127.0.0.1` port 0, shut down in `finally`, as in 0422's probe. No browser is opened.
6. **Child processes:** each side runs as a child via `spawnSync(..., { timeout: 600000, killSignal: 'SIGKILL' })`, which is awaited by construction. A timeout counts as a failed part and is never a pass. When a part ends, `pgrep` checks that no runner, server or Python process is left.
7. **Before/after proof of no change to real data:** before the first step and after the last, record (a) a sha256 manifest of every file under `<fkit>/ai-agents/tasks` and `<fkit>/ai-agents/sprints`, (b) `git -C <fkit> status --porcelain --untracked-files=all`, (c) `git -C ~/Workspace/aiboard status --porcelain` and its HEAD. All three must be identical, apart from the new worklog file, which is written after the final snapshot. Also check: no `.aiboard.lock*`, `aiboard.json` or `__pycache__` anywhere in either repo, and no leftover `p423-*` temp dirs (removed at the end).

## 3. What is compared, part by part (corpus parts C1-C6 gate; part S is the fixture sweep)
Normalization, the same on both sides and nothing more: the temp root becomes `<ROOT>`, ISO timestamps `YYYY-MM-DDTHH:MM:SSZ` become `<TS>`, the snapshot's `generated` field and the server port are masked. Everything else is compared byte for byte.

**C1 — front-matter layer, phase 1's corpus and more (both sides in-process).**
- Inputs: (a) phase 1's file set: `tasks/**/brief.md` + `sprints/*.md`; (b) C1+: every other `.md` under `tasks/` and `sprints/` (worklogs, plans, reviews, archived boards, about 600 more real files).
- The `## Field` extraction is done **once, by Python**, with the phase-1 regex. The resulting `fields` dict is fed to both sides as data, so the comparison tests the port and not a second copy of the regex.
- Per file, both sides output: `parse_front_matter(raw)` (meta with type tags, body); `dump_front_matter(fields, raw)` bytes; `parse_front_matter` of that (meta with type tags, body); and the second dump's bytes. Compared byte-exact.
- Anchor: aiboard's own `fkit_corpus_check.py` is run unchanged (Python) on the copy (`<copy> <ref extract>`). It must report the expected `files=` count and 0 failures, which reproduces phase 1 on today's corpus.

**C2 — the corpus board built through the CLI (a write sequence on real data).** One generated program (argv steps, 0421's in-process drivers `pydrive.py` / `jsdrive.mjs` copied and extended to take a seeded board). Each side starts from an empty temp dir.
1. `--root R init --name fkit-corpus`.
2. For each brief, sorted by fkit id: `task new "<H1 text>" --body-file <pristine copy path> --status <s> --label <fkit id, e.g. 0013> [--assignee <## Owner single-line value>] --by tester`. Status mapping, a harness choice applied the same way on both sides: `## Status` starting with U+2705 gives `done`; U+26D4 gives `cancelled`; U+1F504 gives `in-progress`; anything else falls back to the folder (backlog/done/cancelled). The raw fkit id as a label pushes T-023's digit strings through the store.
3. For each sprint file (`sprints/*.md`, then `sprints/done/*.md`, sorted): `sprint new "<H1>" --body-file <path> --status <from the line-3 banner, same emoji mapping, else backlog>`, then `sprint add S-nnn <T-ids>`. The T-ids come from the fkit ids linked in that board's Status table, mapped through step 2. A task on several boards is moved by aiboard's own `sprint_add` rule, the same on both sides.
4. `check`, then `check --json`.
- Per step: exit code, stdout, stderr and crash class (type + message). A full tree hash every 20 steps and at the end. At the end, a file-by-file byte compare of the two trees, so any difference is located.

**C3 — a hand-built board from the same files (the read path for hand-made tasks).** A Python builder (run once; both sides read byte-identical copies) writes `tasks/<status>/T-nnn-<slug>/brief.md` for each brief. The front matter is `{id, title, status}` plus every phase-1 `## Field` as an extra string field, and the original brief text follows unchanged. Sprints get `sprint.md` with their `tasks:` list. Builder errors cannot cause a false pass, because both sides read the same bytes. The builder exists only to exercise reads of real text.

**C4 — CLI reads.** On copies of the C2 board, Python-built and given to both sides only if C2 matched, and of the C3 board. Commands, each with and without `--json` where it exists: `info`; `board`; `board --sprint` (each sprint); `task list` (no filter, each `--status`, each `--sprint`, `--unblocked`, `--blocked`, `--stale`, `--needs-reply`, each distinct `--assignee`); `task show <id>` for every task; `sprint list`; `sprint show` for every sprint; `check`; `check --json`. Kanban runs at COLUMNS 80 and 200. Each read step's tree hash must equal the hash before it, so a read that writes anything is caught.

**C5 — server GETs (in-process `make_handler` / `makeHandler`; 0422's runners adapted to take a given board copy).** On the C2 and C3 boards: `GET /` (page bytes), `/api/board`, `/api/check`, `/api/tasks/<every id>`, `/api/sprints/<every id>`, all with a local Host (`127.0.0.1:<port>` and `localhost:<port>`). Compared: status, reason, Content-Type, Cache-Control, body bytes. One informational group of foreign-Host GETs (`Host: evil.example`) must also match today, since `0539` has not landed. It is recorded as `0539`'s baseline.

**C6 — write sequences on copies (never on the pristine copy).**
- CLI: one program over a fresh copy of the C2 board. For task index i, take op i mod 9: `task move <next status>`; `task log`; `task comment --by other`; `task rank --top` / `--before <prev>`; `task assign <name> --force`; `task start --force`; `task edit --priority high --label x`; `task block <prev>` / `unblock`; `sprint add` / `remove`. Then `check --fix` and `check`. Per-step results and trees as in C2.
- Server POSTs: every 25th task, a group of about 5 same-site JSON POSTs (status, assign, comment, log, rank, edit; one sprint status). Each group runs on a fresh copy of the C2 board. Responses and the whole resulting tree are compared.

**Controls (no gate without them).**
- Python vs Python and Node vs Node, on C2 and C4. Both must show 0 differences, which proves the normalization is complete and the run is deterministic.
- Three negative controls on **scratch copies of `board/`** (the repo is never edited; Node imports the copy). Each must make the corpus harness report at least 1 difference:
  1. a slug or kanban width counted in UTF-16 code units instead of code points (emoji titles; ADR-052 risk 3);
  2. the T-023 quoting guard removed from the front-matter dump (the `0013` labels);
  3. `check()` output order changed.
- Python T-023 evidence (Verification 4): run only the two T-023 ModelTests from the extract (`/usr/bin/python3 -I -B -m unittest tests.test_board.ModelTests.test_zero_padded_digits_roundtrip_byte_identical ...hostile_scalars...`), plus a direct `dump_front_matter({'id': '0013'})` round-trip probe. aiboard's full suite is not run.

**S — fixture sweep: re-run the earlier tasks' parity harnesses against the final `board/`.** Since 0421 closed, `board/` has changed: 0422 rewrote `pyJsonLoads` and added the `normalizeId` guard. 0421's random-program harness was not re-run after that. Each harness is copied unedited into `<scratchpad>/p423/sweep/<task>/`; the only additions are the timeout + SIGKILL wrapper and paths to the fresh extract and the live `board/`.
- 0417 (`verify417`, front-matter inputs), 0418 (`finalverify418`, programs A/B + fixed), 0419/0420 (`b420/scripts`: gen 1,000, gen419 400, the fixed sets), 0421 (`verify421`: seeds 421 / 2026 / 7777 + the COLUMNS sweep), 0422 (`verify422/probe`: 569 groups / 1,205 requests).
- Expected: the same difference classes and counts as each task's final recorded result. Example for 0422: 1 status / 70 body / 3 header / 32 tree, all classified. Gen419 / fixed-0419 are expected to be **closer** to Python than 0420 recorded (0422's guard closed triggers 1-3). Any new or unclassified difference counts as a regression.
- A harness that is missing is reported as skipped, not passed.

## 4. Known gaps: classified by mechanical matchers, never argued again
Each difference must match exactly one class by a script rule (in `compare.mjs`). Anything unmatched is UNCLASSIFIED.

| Class | Matcher | Authority |
|---|---|---|
| G1 float text | Rewriting Python's float spelling to JS's (`1.0`→`1`, `1e-07`→`1e-7`, `1e-05`→`0.00001`, `-0.0`→`0`, `'float'`→`'int'` in a 500 message) makes the difference disappear | 0421 Q3; 0422 Q1-A |
| G2 500 wording, wrong-type fields (incl. `normalizeStatus` on null / non-string status, 0419 trigger 4) | Same status (500) or both crashed in-process; same tree; only the error text differs; Python text is `AttributeError:` / `TypeError:` | 0422 Q1-A; 0422 worklog (trigger 4 still open) |
| G3 Node's HTTP parser answers first | The request is in the declared malformed list: `x:/api/tasks;y` (404 vs 400), body without Content-Length, bad Content-Length, missing Host on HTTP/1.1 | 0422 plan §7 |
| G4 T-022 refusals | Node 403/415 with T-022's message on a cross-site, foreign-Host or non-JSON POST; Node tree untouched | ADR-052 D6; 0422 (deliberate) |
| G5 ranks past 2^53 | Node `check` = Python's + lines matching `rank .* cannot be stored exactly` | 0418 residual (owner "Make it loud"). **On the real corpus this is a re-raise trigger, so stop and return NEEDS-DECISION.** The harness also prints the corpus's largest rank and id |
| G6 crash class | Both crashed: same exit code, same stdout, same tree; stderr is a traceback vs a stack (incl. `-h=` IndexError, EPIPE, non-UTF-8 argv, lone surrogates, stdin decode past 8 KB, invalid `aiboard.json` detail, C-locale stdin) | 0421 plan §7 + known gaps |
| G7 not-compared headers | `Server:` header, `HTTP/1.1` status line, `Connection` header: excluded by design (as in 0422) | 0422 known gaps |
| G8 deep JSON nesting | Nesting past about 1,000 levels: Python 500 RecursionError, Node parses | 0422 known gaps |
| G9 non-local-Host GET 403 | Only if `0539` lands first | 0539 note 2026-10-22 |

- **Not differences, stated:** stdin keeps CRLF (0421, owner ruling; the port matches Python). A `None` / empty-string block-list item is dropped on read; that is the reference's own gap, inherited, so a zero result matches it rather than fixes it, and the worklog says so.
- **Outside the output gate (N/A, listed):** 0418's lock residuals (terminated worker, zombie holder, hostname change; the harness neither kills holders nor uses workers); 0420 R1 (a test technique); 0422 ruling B (macOS loopback connect stalls); lock waits blocking the event loop; `--host ::1`.
- **Loopback flake (0422 ruling B):** a request that gets **no response** (connect ETIMEDOUT or reset before any byte) is retried up to 2 times, and every retry is logged. A request that received a response is never retried and never forgiven.

## 5. Pass / fail rule for the gate
- **PASS** needs all of these:
  - (1) C1-C6 on corpus H **and** corpus W: 0 unclassified differences.
  - (2) Any classified difference on C1-C6 is listed one by one; G5 on real data is a stop.
  - (3) S: 0 unclassified differences, and no class count above that task's recorded final.
  - (4) All controls behave: the self-runs show 0 differences, and each of the 3 mutants shows at least 1.
  - (5) Safety before/after identical.
  - (6) `npm test` green, with the T-021 test (`snapshot-index.test.js`) and the T-022 tests (`server.test.js`) passing by name.
  - (7) The mapping table accounts for 64/64.
- Raw (pre-classification) counts are printed beside the classified ones. Expected on C1-C6: raw 0, because the gap triggers are hand-made wrong types, floats and malformed requests, which real briefs and these programs do not contain.
- **FAIL** on any unclassified difference, any timeout, a control that does not behave, or any change to real data. "Fix the port, never the reference" goes through §7.
- A met gate means phase 3 **may be put to** the owner. It starts nothing (ADR-052 D9).

## 6. Test mapping table (Verification 2) and suite checks (Verification 3)
- `mapping.mjs` (scratch) lists the 64 `def test_*` names from the `a1592dc` extract and the `test('<name>'` titles in `test/board/*.test.js`. It joins them by exact name (file, class, Node file) and gives the 10 McpTests to `0468`. It fails if any of the 54 is missing.
- Node TAP output (`node --test --test-reporter=tap test/board/*.test.js`) supplies pass / fail per mapped name.
- The 34 fkit-only tests are listed separately. Reconciliation line: 62 at `0108027` + 2 T-023 tests = 64 at `a1592dc`.
- Checks: `npm test` (`test/*.test.js` + `test/board/*.test.js`; CONTRIBUTING's "anything else" row; budget 120 s; no test added, so no budget change). Also `node --test test/board/snapshot-index.test.js test/board/server.test.js` by itself, and the opt-in `FKIT_BOARD_BENCH=1` benchmark (informational).
- Skipped: `npm run test:prove-red` and `npm run test:release`, because no file in their rows is touched. Skipped is not passed.

## 7. If a difference is found
Stop. Return NEEDS-DECISION with the part, step, both outputs, a minimal repro on a fixture, the cause in `board/`, and a proposed fix. Options:
- fix it inside `0423` (a plan amendment, then re-run everything);
- file a follow-up and leave the gate unmet;
- accept it as a gap (owner only).

Any regression test it would need is a new test file, which needs the owner's OK (ADR-057 D2.1; `0423` has no pre-approved file).

## 8. Timing
- Estimated per side: C1 under 10 s; C2 1-3 min (Python under a lock, with a tree hash every 20 steps); C4 2-5 min (about 1,100 `task show` calls); C5 1-3 min; C6 2-4 min; S 10-20 min (0421's seeds dominate).
- Each child is capped at 600 s with SIGKILL. A part that would exceed this is split by program range (`PAR_START` / `PAR_STOP`, as 0421 did), never by loosening the cap. Whole run about 30-45 min wall.
- Per-part wall times, Python vs Node, go in the worklog for information only (T-021). They do not gate.

## 9. Worklog contents (`worklog.md`, the only repo write)
- Corpus H: commit `32c0f36` (or HEAD at run time), counts (briefs, top-level sprint plans, archived boards, other `.md`, phase-1 `fields=` count). Corpus W: manifest sha256 and counts.
- Reference: aiboard `a1592dc`, extract verified blob by blob, with T-023 fixed shown by the two tests and the `0013` probe.
- Port: the `board/` sha256 manifest at start and end (must match). Node and Python versions.
- Harness: script paths and sha256s, exact commands, the status / owner / sprint mapping rules, normalization rules.
- The harness's summary output, pasted (Verification 1): per part, per corpus, raw / classified / unclassified counts, each classified item by class and ruling, the controls, the S counts against each task's recorded final.
- The 64-row mapping table (Verification 2), the check results (Verification 3), the safety before/after proof, timings, what was skipped and why.
- Forward notes: `0539` re-runs C5 with the recorded command, and the foreign-Host GET group becomes G9; the inherited reference gap (`None` / empty list item).
- Decision log for any call made without asking. No commit, no push.

## 10. Edge cases watched
- Emoji and wide characters in titles (slug length, kanban width; ADR-052 risk 3).
- `0013`-style labels (T-023).
- Very long titles; backticks, quotes and colons in titles and owner values.
- A task on several sprint boards.
- Board links to ids that are not in the corpus (skipped by the generator, and counted).
- Multi-line `## Status` values (only the first line, by the phase-1 rule).
- In-progress tasks and `--stale` (all timestamps fresh, so no flapping at the boundary).
- A read that writes (caught by the hash check).
- `info` printing roots (normalized).
- FS readdir order (any order dependence is a real difference).
- Loopback stalls (retry rule above).
- `.gitkeep` files in copies (harmless, the same on both sides).

## Open question resolved at approval
Q1 — Where does the one-off harness live? Owner chose: "Approve, scripts throwaway (Recommended)" — scratchpad only; nothing enters git except worklog.md; the worklog records commands, hashes and generator rules so `0539` can rebuild the server part.
