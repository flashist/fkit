# Worklog — 0421

## 2026-10-22 — fkit-coder (Build worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Built the approved `plan.md` (blob `6944a79d63651bbbdaed5f33423847f9a3e1845e`, 18340 bytes, checked with
`git hash-object` / `wc -c` at the start) under the declared-approval marker. Owner approval relayed:
`AskUserQuestion`, 2026-10-22, `fkit-lead` session, selected *"Approve, all recommended (Recommended)"*. That
settles Q1 = per-member `sprint_progress` kept, Q2 = full `serve`/`mcp` parsers with "not ported yet"
`BoardError` handlers, Q3 = float-in-config recorded as a known gap. No commit, no push. `plan.md` not edited.

### Change surface

- `board/cli/argparse.mjs` (new, 954 lines): the argparse 3.9.6 subset aiboard uses (parser loop, actions
  store / store_true / append / help / version / subparsers, one required mutex group, usage and help
  formatters), plus `textwrap.wrap`/`fill` and `shutil.get_terminal_size`'s columns. Defines `SystemExit` and
  the swappable `sys.stdout` / `sys.stderr`.
- `board/cli/cli.mjs` (new, 663 lines): port of `cli.py` — `buildParser()` (help strings verbatim), every
  `cmd_*`, the table / kanban formatting, `main(argv = null, io = {})`. Exports `main`, `buildParser`,
  `SystemExit`.
- `board/cli/main.mjs` (new, 11 lines): runnable entry; sets `process.exitCode`, never `process.exit()`.
- `board/core/instructions.mjs` (new, 81 lines): `BEGIN`, `END`, `renderBlock`, `installBlock`. Rendered block
  checked byte-identical to Python's `render_block` (two hints).
- `board/core/python-compat.mjs` (changed, additive; +88 / −24): `pyDecodeUtf8` (pulled out of `pyReadText`,
  whose behaviour is unchanged), `pyRstrip`, `PyFloat` + `pyFloatRepr`, `pyFormatLeft`, `pyJoin`;
  `pyJsonDumps(value, indent = 2, { ensureAscii = true })` gains `indent = null` (one-line form) and
  `ensureAscii: false` — existing calls produce the same bytes.
- `board/core/store.mjs` (one word): `relativeTo` exported. No behaviour change.
- `test/board/cli.test.js` (new): **the one A3-pre-approved test file**. 12 tests.
- This worklog.
- Untouched: `model.mjs`, `lock.mjs` (byte-identical to the pre-build copies), the other `test/board/*`
  files, `package.json`, `bin/fkit-board.mjs`, the launcher, `install.sh`, `.claude/`, docs, the wiki, the
  aiboard repo.

### Tests first

Expected strings were all printed by aiboard `a1592dc` (`git archive` into the scratchpad, `python3 -I`
3.9.6, scripts in a separate folder): N3's 22 argv cases at `COLUMNS=80`; N4's fixture (built by aiboard
with a fixed clock, then one hand edit for exactly one `check` problem) and its 24 read cases; N2's kanban.

**Red** (`node --test test/board/cli.test.js`, stubs throwing `not implemented`): tests 12, pass 0, fail 12 —
each of `test_install_block_is_idempotent`, `test_block_tells_agents_to_take_work_from_the_top`,
`test_full_flow`, `test_argparse_errors_are_json`, `test_critical_priority_via_cli`, `test_task_rank_via_cli`,
`test_board_truncates_with_ellipsis`, and the five new tests failed with `Error: not implemented`.

After the python-compat / store additions: `node --test test/board/*.test.js` (the four older files) tests
56, pass 55, skipped 1 — same as 0420's close.

**Green:** tests 12, pass 12 (standalone 0.22 s wall). `node --test test/board/*.test.js`: tests 68, pass 67,
fail 0, skipped 1.

### Parity harness (scratchpad, one-off, not kept — as 0423's)

Python and Node each run the same programs in-process over fresh boards; after every step stdout, stderr,
exit code and a hash of the whole board tree (bytes; timestamps and the temp root normalized) are compared.

- 1,200 generated programs, seed 421: **11,982 steps, 0 mismatches**. Exit codes seen: 0 ×4,993, 1 ×5,496,
  2 ×1,493; 2,440 JSON errors, 117 help outputs, 102 ambiguous-option errors, 421 stdin steps (CRLF, BOM, bad
  UTF-8, empty, lone `\r`), 264 successful `agents-md`. 14 steps crashed in both (a missing `--file
  docs/X.md` directory: Python `FileNotFoundError` / Node `ENOENT`), with equal exit code, stdout and tree.
- 500 more programs, seed 2026: **5,047 steps, 0 mismatches** (4 both-crashed, same cause).
- COLUMNS sweep: 20…160 plus `0`, `-5`, `abc`, `" 90 "`, `1_00`, `""`, `5`, `1`, `2`, over `-h`, `-hx` (a
  usage error) and `--version` for all **29** parsers (the plan said 26; there are 29): **13,050 steps,
  0 mismatches**.
- Child processes (real stdin, real pipes): `--body-file -` with 160 KB of CRLF + BOM + UTF-8, bad UTF-8,
  and a 127 KB `board --json` through a pipe (parsed: 151 tasks, no truncation).

### Negative controls (throwaway copies in the scratchpad)

- code-unit `.split('')` instead of code points in the kanban → *the kanban view counts characters…* fails;
- `JSON.stringify` instead of `pyJsonDumps` → *every command's --json output parses* and *read commands…*
  fail;
- no `--json` stripping → `test_full_flow` fails;
- textwrap without hyphen breaking → first **passed** the unit test (no hyphen break at 80 columns); the
  sweep caught it (83 mismatches). One case added to N3 (`mcp -h` at `COLUMNS=85`, expected from Python) —
  now *argument errors, help and version…* fails too;
- stdin with newline translation (the plan's original design, see the decision log) → *read commands…* and
  *the command-line entry…* fail.

### `npm test`

Exit 0: tests 913, pass 912, fail 0, skipped 1 (0420's opt-in benchmark), **81.3 s** wall (budget 120 s,
ADR-057 D10; 73.9 s at 0420's close, the rest is machine load — this file adds ~0.67 s). This file inside
`npm test`: InstructionsTests 3 ms, CliTests 151 ms, the new suite 513 ms (the 4 child runs 403 ms under
load) — under the 2 s stop line, no slow test. `0284/term-ignored` passed.

Skipped, as planned: `npm run test:prove-red` (touches none of these files), `npm run test:release`
(`bin/release.mjs` untouched).

Checks: no raw U+2028 / U+2029 / U+FEFF / U+0085 in any changed file (the only non-ASCII is `…` and `→`,
both in aiboard's output). `git status` against the baseline: only the 5 new files appear (all of `board/`
was already untracked, so the two edited core files do not show). No `board-cli-*` temp dirs left, no lock
files, no child processes running.

### Decision log (calls made without asking)

1. **stdin keeps `\r\n` — the plan said universal newlines; Python does not.** Plan §3 *Stdin* said "turn
   `\r\n` or a lone `\r` into a newline (universal newlines)". Real Python 3.9 on macOS/Linux opens
   `sys.stdin` with `newline="\n"` (CPython `create_stdio`), so `sys.stdin.read()` returns `\r\n` and lone
   `\r` untouched, and aiboard writes them into `brief.md` / `worklog.md` / `comments.md` as is. Verified
   with real child processes (`printf 'a\r\nb\rc' | python3 -I -c 'print(repr(sys.stdin.read()))'` →
   `'a\r\nb\rc'`; aiboard's brief right after `task new --body-file -` ends `line1\r\nline2\rline3\n`).
   Why it qualified: the plan's governing requirement is byte-for-byte parity with Python, the fix is one
   line (`readStdin` drops the `.replace`), and the planned behaviour was a factual error, not a choice.
   The two stdin test expectations (N4's in-process `task log -`, N5's `--body-file -`) were changed to what
   Python writes. The harness's Python driver now builds stdin the way CPython does (it had copied the same
   wrong assumption). **Flag for the owner/driver: this changes an approved plan detail; revert is one
   line if he prefers the plan as written.**
2. **N3 got one narrow-width case** (`mcp -h` at `COLUMNS=85`), so plan §6's hyphen-breaking control fails
   in the unit test and not only in the harness. Same file, same test, expected text from Python.
3. **N5 uses 4 child runs** (`--body-file -` → 0, `--json` argument error → 1, missing title → 2, `check` →
   1), and `task log T-005 -` is covered in-process (N4) with a fake stdin. Within the plan's "3 to 4".
4. `instructions.mjs` uses its own `exists()` (Path.exists semantics: only ENOENT/ENOTDIR/EBADF/ELOOP mean
   "no") rather than `existsSync`, which would swallow EACCES where Python raises.

### Known gaps for 0423 (declared differences)

- Plan §7 as written: crash stderr (traceback vs Node stack; exit 1 both); EPIPE (`| head`) — seen: Python
  `BrokenPipeError` traceback, Node unhandled `EPIPE` stack; non-UTF-8 argv bytes; lone surrogates in output;
  stdin decode-error positions past 8 KB; invalid `aiboard.json` detail text (0418's); ranks past 2^53
  (0418's residual). *(Review R1, 2026-10-22: an empty `-h=`, at any parser level, joins this class —
  Python's argparse raises IndexError there; the port now throws IndexError too: exit 1 and empty stdout
  both, stderr differs.)*
- **Q3 (owner-approved):** float values in `aiboard.json` are echoed without `.0` (`info --json` config,
  `name: 1.0`) — from 0417's `pyJsonLoads`. *(Review round 1, 2026-10-22, the reviewer's
  suppressed-as-settled note: the same cause also shows in `info --json` as `1e-05` → `0.00001` and `-0.0`
  → `0`. Same gap, same owner ruling; 0423 should expect these.)*
- **New: stdin under a C / POSIX / C.UTF-8 locale.** Python's stdin error handler depends on the locale:
  `strict` under e.g. `en_US.UTF-8` (what the port and the harness match), but `surrogateescape` under C,
  POSIX and the coercion targets C.UTF-8 / UTF-8 (this sandbox has `LC_CTYPE=UTF-8`). There, bad UTF-8 on
  stdin does not fail on read: aiboard fails later on write with `'utf-8' codec can't encode characters …
  surrogates not allowed` and leaves partial state (an empty `brief.md` in a new task folder; a truncated
  worklog for `task log -`). The port always fails on read, before writing anything. Exit 1 both; message and
  disk state differ.
- `serve` / `mcp` (Q2): parsers, help and argument errors match; running them prints `error: aiboard serve
  is not ported to Node yet (task 0422)` / `… mcp … (task 0468, after v1)`, exit 1.

### Forward notes

- **0422:** replace `cmdServe` in `board/cli/cli.mjs` (the `BoardError` stub) with the real server; the
  `serve` parser (`--host`, `--port` int, `--no-open`, `--read-only`) is already ported.
- **0444:** the entry is `node board/cli/main.mjs <args>`; `Parser.error` reads `process.argv.slice(2)` for
  `--json` (Python's `sys.argv[1:]`), so a launcher that inserts its own leading arguments must keep `--json`
  visible there or accept the text error form.
- **0468:** `board/core/instructions.mjs` is shared, as aiboard's `instructions.py` is.

## 2026-10-22 — fkit-coder (Verify worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no commit. **Result: pass.**

- `node --test test/board/cli.test.js` ×3: 12/12 each, 0.24 s wall (≈215–221 ms test time).
- `node --test test/board/*.test.js`: 68 tests, 67 pass, 0 fail, 1 skipped (0420's opt-in benchmark), 2.78 s.
- `npm test`: exit 0, 913 tests, 912 pass, 1 skipped, **77.3 s** wall (budget 120 s; run alongside the
  parity harness, so under load). Inside it: InstructionsTests 2.8 ms, CliTests 140 ms, new suite 538 ms.
  0 fail, so `0284/term-ignored` did not fail (the log was not kept to name the one skip).
- Core files vs the pre-build copies (`scratchpad/b421/pre/`): `model.mjs`, `lock.mjs` byte-identical;
  `python-compat.mjs` purely additive at the line level (0 removed lines in `diff`); `store.mjs` differs only
  by `export` on `relativeTo`.
- Parity harness, fresh copy (`scratchpad/verify421/`), aiboard `a1592dc` re-extracted read-only, `python3
  -I` 3.9.6: seed **7777**, 600 programs, **5,871 steps, 0 mismatches** (4 both-crashed: missing
  `docs/X.md` dir, same code/stdout/tree; 214 stdin steps). Builder's COLUMNS sweep re-run: **13,050 steps,
  0 mismatches**. Own sweep (29 parsers × `-h`/`-hx`/`--version`/`--zz` × 67 widths incl. 1–29, 1000, `0`,
  `-1`, `+70`, Arabic-Indic digits, `1e2`, `0x50`): **7,772 steps, 0 mismatches**.
- stdin CRLF (owner-ruled change) vs real Python, child processes, real pipes, `LC_ALL=en_US.UTF-8`:
  `task new --body-file -`, `task log -`, `task comment -`, `sprint new --body-file -`, BOM, lone `\r`,
  bad UTF-8 → board trees byte-identical (only `aiboard.json` name differs, from the folder name); `\r\n`
  and lone `\r` kept on write on both sides; `task show --json` identical after normalising root/time.
- Negative controls (fresh copies): code-unit `split('')` in kanban → *the kanban view counts characters…*
  fails; `JSON.stringify` for `--json` → N1 fails (also with BigInt→Number, so not just a crash), plus 3
  others; no `--json` stripping → `test_full_flow` fails. Unmutated copy: 12/12.
- No raw U+2028/2029/FEFF/0085 in the 7 changed files. No `board-cli-*` temp dirs, no lock files in the
  repo, no child processes of mine left. `git status` unchanged by this run. `plan.md` blob still
  `6944a79d…`.
- Skipped: `npm run test:prove-red` (no file in its row touched), `npm run test:release` (`bin/release.mjs`
  untouched).

## 2026-10-22 — fkit-coder (Process-review worker, round 1, spawned by fkit-sprint-ship-loop / fkit-lead)

Processed `review.md` R1–R3 under the declared-approval marker (plan blob `6944a79d…`, 18340 bytes, checked
at the start). Standing approval: the owner's plan approval (`AskUserQuestion`, 2026-10-22, `fkit-lead`
session, *"Approve, all recommended (Recommended)"*). No commit, no push. Reviewer findings untouched.

### Decision log (fixes applied without asking)

1. **R1 → mimic Python's crash on `-h=`.** What changed: `board/cli/argparse.mjs` `consumeOptional` throws
   `IndexError('string index out of range')` when the explicit argument is empty, where 3.9.6's
   `explicit_arg[0]` raises; `IndexError` imported from `python-compat.mjs`. It is not a `ValueError`, so
   `run()` lets it through and `main.mjs` rethrows: Node stack, exit 1, nothing on stdout — plan §7's crash
   class ("exit 1 matches"). Before: a usage error, exit 2 (with `--json`: a JSON error, exit 1). Why it
   qualified: verified `CORRECT` (Python 3.9.6 traceback, exit 1, empty stdout); a 2-line, one-function
   change; inside the plan (§3 "ported, not imitated" + §7 crash class). The dispatch offered mimic or
   `NEEDS-DECISION`; mimicking is the literal port, so no judgment call was left. Test: 3 assertions in N3
   (`-h=`, `task -h=`, `--json task new -h=` → IndexError, nothing written). Negative control: fix reverted →
   N3 fails.
2. **R2 → two tests in `test/board/cli.test.js`** (the one approved file; no new file). *init and agents-md
   write into the project…* (cwd changed to the temp dir and `AIBOARD_ROOT` unset, both restored in
   `finally`) and *installBlock appends after existing content…* (`''` and `'\n\n'` separators, a CRLF file
   rewritten as LF, a CRLF file already holding the block left `unchanged` byte for byte). Every expected value
   printed by aiboard `a1592dc` under `python3 -I` 3.9.6 (scratch script, separate folder). Why it qualified:
   verified `CORRECT` (CONTRIBUTING key list item 4); tests only, in the pre-approved file, as the dispatch
   named. Negative controls (scratch copies): `''` branch broken, `'\n\n'` branch broken, pointer not counted,
   `--claude` dropped → each fails exactly its test.
3. **R3 → ported the registration** rather than dropping the field. What changed: `_registerAction` sets
   `_has_negative_number_optionals` once when an option string matches `NEGATIVE_NUMBER`, as 3.9's
   `_add_action` does. Why it qualified: verified `CORRECT` (latent; no aiboard option is numeric); 3 lines,
   in the plan's "negative-number … rules"; porting keeps the exported class faithful, while dropping the
   field would leave a documented hole. Probe vs Python 3.9.6 (a `-1` store_true + `x` nargs `?`; and a
   parser without `-1`): 5 argv lists, identical namespaces and leftovers. No test (not on the key list).
4. **Worklog:** the Q3 known-gap line gained the reviewer's float symptoms (`1e-05` → `0.00001`, `-0.0` →
   `0`); the crash-class line gained `-h=`.

No obvious-winner calls beyond these.

### Checks

- `node --test test/board/cli.test.js`: 14 tests, 14 pass (0.22 s).
- `node --test test/board/*.test.js`: 70 tests, 69 pass, 0 fail, 1 skipped (0420's opt-in benchmark).
- `npm test`: exit 0, 915 tests, 914 pass, 0 fail, 1 skipped, 77.9 s wall (budget 120 s).
  0 fail, so `0284/term-ignored` did not fail (the log was not kept to name the one skip).
- Parity slice (child processes, real stdin, `COLUMNS=80`, separate fresh boards per side): 16 parser levels
  × 24 `-h` / `=` / help suffixes, both orders = 768 cases: **1 mismatch** — `--root= mcp` (owner-ruled Q2
  stub) — and 1 skipped (`--root= serve`, where Python starts its real server). 96 Python crash cases, all
  matched (exit 1, empty stdout). Exit codes seen: 0 ×113, 1 ×99, 2 ×555.
- ⚠ **Side effect of the first slice run:** it did not yet skip `serve`, and Python's real `aiboard serve`
  (`--root= serve`) ran for about 8 minutes before I killed it. It ran without `--no-open` and without
  `BROWSER` set, so it **may have opened a browser tab on `localhost`**. Not verified. The process is gone;
  the re-run set `BROWSER=true` and a 5 s timeout per case.
- No raw U+2028 / U+2029 / U+FEFF / U+0085 in the two changed files. No `board-cli-*`, `slice421-*`, `r2py-*`
  temp dirs left, no lock files under `board/` or `test/`, no child processes left.
- Skipped: `npm run test:prove-red` (no file in its row touched), `npm run test:release` (`bin/release.mjs`
  untouched).

## 2026-10-22 — fkit-coder (Re-verify (post-review), spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no commit. Result: **pass**.

- Change surface since the predecessor's Verify: only `board/cli/argparse.mjs` (R1 `IndexError` on an empty
  explicit arg; R3 `_has_negative_number_optionals` registration) and `test/board/cli.test.js`. The other six
  `board/` files are byte-identical to `scratchpad/verify421/neg/clean/`; no other `board/` or `test/board/` file
  has a newer mtime.
- `node --test test/board/cli.test.js` ×3: 14/14 each. `node --test test/board/*.test.js`: 70, 69 pass, 0 fail,
  1 skipped (0420's opt-in benchmark).
- `npm test`: exit 0, 915 tests, 914 pass, 0 fail, 1 skipped, 76 s wall (budget 120 s). `0284/term-ignored`
  passed.
- Child processes, aiboard `a1592dc` re-extracted read-only, `python3 -I` 3.9.6, 10 s timeout each:
  `-h=`, `task -h=`, `--json task new -h=` → exit 1, empty stdout, no files written, `IndexError: string index
  out of range` on both sides.
- Parity slice (in-process harness from `verify421/scripts`, seed 9131, `BROWSER=true`, 600 s timeout per side):
  300 programs, 2,968 steps (3 `serve` steps removed, 26 `-h=` steps added): **0 mismatches**. 33 steps crashed
  on both sides with equal exit code, stdout and tree: 26 `-h=` (`IndexError`), 6 `--file docs/X.md`
  (`FileNotFoundError` / `ENOENT`, known), 1 `task edit --title 'C:\path\to'` (`bad escape \p`, aiboard's own
  bug, ported faithfully). Exit codes: 0 ×1,194, 1 ×1,413, 2 ×361.
- No raw U+2028/U+2029/U+FEFF/U+0085 in the two changed files; no lock files; no processes left; `git status`
  unchanged by this run; `plan.md` blob still `6944a79d…`.
- Skipped: `npm run test:prove-red`, `npm run test:release` (no file in their rows touched); Python/Node `serve`
  never run.

## 2026-10-22 — fkit-coder (Process-review worker, round 2, spawned by fkit-sprint-ship-loop / fkit-lead)

Standing approval: the approved plan (blob `6944a79d…`, checked this run). No commit.

### Decision log (fixes applied without asking)
- **R4** (round 2, low; `!args.root` half of `cmdInit`'s pointer guard untested). What changed: one assertion
  block at the end of the R2 test *init and agents-md write into the project as aiboard a1592dc does* in
  `test/board/cli.test.js` — cwd = fresh `<tmp>/project`, `--root <project>/other init board` → exit 0, stdout
  `Board 'other' ready at <ROOT>/project/other (9 entries created)` + the Next line, and the project holds only
  `other` (no `aiboard.json`). Expected values printed by aiboard `a1592dc` under `python3 -I` 3.9.6 (child
  process, scratch script in a separate folder). No source change. Why it qualified: verified `CORRECT`;
  CONTRIBUTING key list item 4 makes the missing test a defect; one localized assertion in the plan's one
  pre-approved test file. Note: the finding's suggested shape (`--root` outside cwd, "cwd stays empty") cannot
  catch the mutation — `writePointer` returns `null` when the board is not under cwd — measured: that version
  stayed green with the guard removed; the board has to sit inside cwd. Negative control (scratch copy of
  `board/` + `test/board/`, `&& !pyTruthy(args.root)` deleted) → the test fails (10 entries vs 9).
- Obvious-winner calls: none.

### Checks
- `node --test test/board/cli.test.js`: 14/14. `node --test test/board/*.test.js`: 70 tests, 69 pass, 0 fail,
  1 skipped. `npm test`: exit 0, 915 tests, 914 pass, 0 fail, 1 skipped, 80 s wall (budget 120 s);
  0 fail, so `0284/term-ignored` did not fail (the log was not kept to name the one skip).
- Skipped: `npm run test:prove-red`, `npm run test:release` (no file in their rows touched); `serve` never run.
- Scratch dirs removed; no `board-cli-*` temp dirs, lock files or CLI processes left.

## 2026-10-22 — fkit-coder (VERIFY worker, final re-verify, spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no commit. Result: **pass**.
- `board/` unchanged since the post-review re-verify: no copy of `board/` was kept in `rv421post`/`verify421`
  (`verify421/src` is aiboard's source), so compared by modification time — newest `board/` file is
  `board/cli/argparse.mjs` 16:34, before `rv421post` (16:52–16:56); no `board/` file newer than it. `git status`
  identical to `rv421post/status-after.txt`. Only `test/board/cli.test.js` moved (16:59).
- `node --test test/board/cli.test.js` ×2: 14/14 both runs.
- `npm test`: exit 0, 915 tests, 914 pass, 0 fail, 1 skipped (0420's opt-in `FKIT_BOARD_BENCH=1` benchmark),
  75 s wall (budget 120 s). `0284/term-ignored` passed.
- Negative control (fresh scratch copy of `board/` + `test/board/`, `&& !pyTruthy(args.root)` deleted at
  `board/cli/cli.mjs:107`): 13/14, the one failure is the new assertion (`cli.test.js:383`, 10 entries vs 9).
  Copy deleted.
- `plan.md` blob still `6944a79d…`; `git status` unchanged by this run; no lock files, `board-cli-*` temp dirs
  or test processes left. Skipped: `npm run test:prove-red`, `npm run test:release` (no file in their rows
  touched); `serve` never run.
