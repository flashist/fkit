# Plan: 0421, port aiboard's command line to Node (planning only: no source, no repo files written)

**Summary**
- Port `aiboard/cli.py` and `aiboard/instructions.py` at `a1592dc`. Output must match Python 3.9.6 byte for byte (stdout, stderr, exit codes, `--json` shape), including argparse's usage, error and `-h` text.
- Biggest risk: argparse. Python's messages and quirks only come out right if its parsing loop and usage/help formatter are ported, not imitated. I confirmed the quirks below against Python 3.9.6.
- New files: `board/cli/cli.mjs`, `board/cli/argparse.mjs`, `board/cli/main.mjs`, `board/core/instructions.mjs`.
- Small additive changes: `board/core/python-compat.mjs`, plus one export in `board/core/store.mjs`.
- One test file: **`test/board/cli.test.js`** (the one file A3 pre-approved). 7 ported aiboard tests plus 5 new ones. No slow test: the file is estimated at about 1 to 2 s. `npm test` is about 73 s now, against the 120 s budget.
- Three open questions (end of plan). None blocks starting; each has a recommendation.
- Disclosure: while planning I extracted aiboard `a1592dc` (read-only) into my scratchpad and ran `python3 -I` 3.9.6 against a throwaway board there. Nothing was written in the repo or in the aiboard repo.

## 1. Facts confirmed against Python 3.9.6 (a1592dc) while planning
- `info --json` always prints `"stale_after_hours": 24.0`. That is a float, and JS cannot tell 24.0 from 24, so the port needs a float marker.
- Error JSON is compact and ASCII-escaped: `{"error": "..."}` (json.dumps defaults). The normal `--json` output uses indent 2 with `ensure_ascii=False`: DEL and U+2028 are left raw, and control characters below U+0020 are escaped.
- Usage wraps at the terminal width (COLUMNS, else the tty width, else 80), minus 2. Example: `task new` with no title prints a 6-line wrapped usage, then `aiboard task new: error: the following arguments are required: title`, exit 2.
- With `--json` anywhere, the error is `{"error": "argument --priority: invalid choice: 'bogus' (choose from 'low', 'medium', 'high', 'critical')"}`, exit 1.
- Option abbreviations work: `--b` gives `ambiguous option: --b could match --body, --body-file, --blocked-by, --by`.
- The rank group: missing gives `one of the arguments --top --bottom --before --after is required`; two given gives `argument --bottom: not allowed with argument --top`.
- Leftover arguments are reported by the top-level parser, with the top-level usage: `task block T-1 T-2 --by x T-3` gives `aiboard: error: unrecognized arguments: T-3`.
- `task assign T-001 --force bob`: the optional positional `assignee` matches empty before `--force`, so the result is `unrecognized arguments: bob`.
- `task log T-001 -x` gives `the following arguments are required: message`.
- `--js info`: the abbreviation sets json, then `main` overwrites it with the exact-token check, so the output is text.
- The subcommand error is `argument cmd: invalid choice: 'foo' (choose from 'init', ...)`. Aliases appear in the choice metavar, and in help as `change-status (status, move)`.
- `--version` prints `aiboard 0.1.0`, exit 0. Help says "optional arguments:" (the 3.9 wording).
- `format(True, '<6')` is `'1     '`. `format([..], '<6')` and `format(None, '<6')` raise TypeError. The text views pad with this.
- No help string contains `%`, so no `%(prog)s` expansion is needed.

## 2. Files

| File | New/changed | What |
|---|---|---|
| `board/cli/cli.mjs` | new | Port of cli.py: `DEFAULT_AUTHOR` (set at module load, as in Python), `buildParser()` (every help string copied byte for byte), every `cmd_*`, `_task_row` / `_task_table` / `_sprint_table` / `_board_line`, and `main(argv = null, io)`. Exports `main`, `buildParser`, `SystemExit`. |
| `board/cli/argparse.mjs` | new | Port of the argparse 3.9.6 subset aiboard uses (see §3), plus textwrap.wrap/fill (the 3.9 word-split regex, hyphen breaking) and shutil.get_terminal_size. |
| `board/cli/main.mjs` | new | The runnable entry, like `__main__.py`. It sets `process.exitCode` and never calls `process.exit()`, because on macOS pipe writes are asynchronous and `exit()` would cut off a large `board --json`. |
| `board/core/instructions.mjs` | new | Port of instructions.py: `BEGIN`, `END`, `AGENTS_BLOCK` (verbatim; `{{`/`}}` become `{`/`}`), `renderBlock`, `installBlock`. Placed in core because MCP (0468) shares it. |
| `board/core/python-compat.mjs` | changed, additive only | Details below this table. |
| `board/core/store.mjs` | changed, one word | Export the existing private `relativeTo` (Path.relative_to), needed for the agents-md hint. No behaviour change. |
| `test/board/cli.test.js` | **new, the one pre-approved file** | §5 |

The `python-compat.mjs` additions:
- `pyJsonDumps(value, indent = 2, { ensureAscii = true } = {})`: `indent = null` gives the compact `, ` / `: ` form, and `ensureAscii: false` gives Python's non-ASCII escaping. Existing calls are unchanged.
- A `PyFloat` marker and `pyFloatRepr`: Python's float repr, with fixed notation when -4 <= exponent < 16, `.0` added to whole numbers, otherwise `e+XX`.
- `pyRstrip`.
- `pyFormatLeft(value, width)`, for `format(v, '<N')`: pads strings by code point; ints and BigInts as strings; bools as `1`/`0`; a list or dict throws Python's TypeError.
- `pyJoin(sep, iterable)`: a string iterates its characters; a non-string item throws TypeError `sequence item 0: expected str instance, int found`; a non-iterable throws `can only join an iterable`.
- `pyDecodeUtf8(buf)`: pulled out of `pyReadText` so stdin decodes the same way. `pyReadText`'s behaviour does not change.

Not touched:
- `package.json`: the `test` glob already covers `test/board/*.test.js`.
- `bin/fkit-board.mjs`, the ADR-058 reader.
- The launcher. `fkit board` routing is 0444.
- `install.sh` (that is 0443).
- `.claude/` copies, docs, and anything in the aiboard repo.

## 3. Design

**I/O and exits (mirrors Python).**
- `main(argv = null, io = { stdout, stderr, readStdin })` returns 0 or 1. The `io` argument stands in for `redirect_stdout`.
- `sys.exit` becomes `throw new SystemExit(code)`, for argparse errors (2), help and version (0), the `--json` usage error (1), and `check` with remaining problems (1). SystemExit leaves `main()` exactly as it leaves Python's.
- `catch` covers `BoardError` (and `NotFound`) and `ValueError` (with its subclasses: UnicodeDecode, UnicodeEncode and JSONDecode errors). This is how the 0418/0419 note is met: normalizeStatus's ValueError gives `error: unknown status ...` on stderr, or the JSON form.
- Any other error gives exit 1 with Node's stack on stderr. Python prints a traceback there. Not matched; declared below.
- `--json` is decided exactly as in Python: `jsonFlag` is set if the exact token appears anywhere, and every `--json` token is removed before parsing.
- Parser errors check `process.argv.slice(2)` for `--json`, mirroring Python's `sys.argv[1:]` quirk. The ported test sets `process.argv` the way the Python test sets `sys.argv`.

**argparse subset.** Ported from 3.9.6 for the features aiboard uses, and no more:
- **Parser:** prog, description, `-h`; options, positionals with nargs None, `?` and `+`; the PARSER nargs for subcommands.
- **Actions:** store, store_true, append, help, version.
- **Option settings:** default; type (including the string-default conversion for actions not seen); choices; metavar; dest.
- **Subcommands:** `add_subparsers(dest, required, parser_class)` and `add_parser(name, aliases, help)`; prog is worked out as 3.9 does (`aiboard task new`), and subnamespace values are copied back onto the parent.
- **Groups:** one required mutually exclusive group, with 3.9's identity check `is not action.default`.
- **Parsing loop:** the O/A/- pattern regexes, `consume_optional` (with explicit `=` arguments), `consume_positionals`, abbreviation matching, negative-number and space-in-argument rules, removal of `--`, the required-arguments check, and unrecognized arguments raised by the top-level parser.
- **Usage formatter:** including the group brackets and the cleanup regexes, the wrapping, and the long-prog branch.
- **Help formatter:** sections, invocation, indented sub-actions, help position (min(24, width − 20)), textwrap.

**Commands.** Each `cmd_*` is a line-for-line port. Rules to keep:
- **Evaluation order.** Python builds both `data` and `text` before `_emit` looks at `--json`. A text-side error (for example labels joined over ints) therefore crashes in `--json` mode too, and `sprint list` calls `sprint_progress` twice per sprint. `board` calls `snapshot()` before its text path.
- **JSON.** Always `pyJsonDumps`, never `JSON.stringify`. That covers the 0417 BigInt note: front-matter and aiboard.json integers past 2^53 print exactly. `info` wraps `stale_after_hours` in `PyFloat`. Results with path keys (agents-md) are a `Map`, so a key like `123` keeps its place.
- **Text formatting.**
  - Every `f"{x:<N}"` goes through `pyFormatLeft`, by code point.
  - Every bare `{x}` goes through `pyStr`.
  - Joins go through `pyJoin`.
  - `body.strip()` uses `pyStrip`.
  - `row.rstrip()` uses `pyRstrip`.
  - Kanban truncation is `cell[:25] + "…"`, counted by code point (Array.from). That covers the 0417 emoji note: an astral character (above U+FFFF) counts as one, as in Python.
  - `stale after: {:g}h` uses `pyFormatG`.
- **Store calls** keep Python keyword names: `createTask(title, {body, status, sprint, priority, assignee, labels, author, blocked_by})`, `listTasks({status, sprint, unblocked, stale, needs_reply})`, `updateTask(id, {title, priority, assignee, sprint, labels, blocked_by})` in Python's key order, and so on. `x or None` becomes `pyOr(x, null)`.
- **Stdin.** Read fd 0 synchronously (retry on EAGAIN), then `pyDecodeUtf8`, then turn `\r\n` or a lone `\r` into a newline (universal newlines). Used by `--body-file -` and by a message of `-`.
- **`init`, `agents-md`.** Ported faithfully, including the "Next: `aiboard agents-md`..." text and the pointer write when `dir` is given and `--root` is not. The relative hint uses `relativeTo(board.root, process.cwd())`.
- **`serve`, `mcp`.** Parsers are ported in full, so help, choices and argument errors match. Their handlers are open question Q2.
- **The 0417 `pyStr` / JSON-object note** does not bite here: the CLI takes no JSON input except aiboard.json, which the store already reads as Maps.

## 4. Sequence (tests first)
1. Extract `a1592dc` read-only with `git archive` into the scratchpad. Python is `python3 -I` 3.9.6, run with scripts kept in a separate folder (as in 0417–0420). Capture every expected string in §5 from Python. None is hand-written.
2. Write `test/board/cli.test.js`, then stubs: `board/cli/cli.mjs` exporting `main` and `SystemExit`, `board/core/instructions.mjs` exporting its names, each function throwing `not implemented`. Run `node --test test/board/cli.test.js` and record each test red, one by one, in the worklog.
3. Make the python-compat and store additions. Run `node --test test/board/*.test.js` to show 0417–0420's tests are still green, with output unchanged.
4. `instructions.mjs`, then `argparse.mjs`, then `cli.mjs`, then `main.mjs`. Tests go green.
5. Parity harness in the scratchpad. It is a one-off and not kept, as 0423's is. It runs Python and Node over the same fresh boards and compares stdout, stderr, exit code and the board tree bytes after every step, with timestamps and the temp root normalized as in 0418's driver:
   - at least 1,000 generated argv programs across every command and option, with `--json` placed anywhere, abbreviations, `--`, `-` and `-5` arguments, bad statuses and priorities, and missing or ambiguous arguments;
   - a COLUMNS sweep from 20 to 160 over `-h` for all 26 parsers, and over a usage error for each;
   - the hand cases from §1;
   - stdin with CRLF, a BOM and bad UTF-8.

   Results go in the worklog.
6. Negative controls in throwaway copies:
   - `.length` instead of code points: the kanban test fails;
   - `JSON.stringify`: the `--json` test fails (BigInt);
   - no `--json` stripping: `test_full_flow` fails;
   - textwrap without hyphen breaking: the help parity fails.
7. Run `npm test` and record the wall time. Check the changed files for raw U+2028, U+2029, U+FEFF and U+0085 (escapes only), and check the fence with `git status` against the baseline.

## 5. The test file: `test/board/cli.test.js` (only new test file; under `test/board/`, A3 pre-approved)

**Ported, aiboard names verbatim, in aiboard's order:**
- `CliTests`: `test_full_flow`, `test_argparse_errors_are_json`, `test_critical_priority_via_cli`, `test_task_rank_via_cli`, `test_board_truncates_with_ellipsis`.
- `InstructionsTests`: `test_install_block_is_idempotent`, `test_block_tells_agents_to_take_work_from_the_top`.

These are 7 of ADR-052's 52.

**New:**
- N1 `every command's --json output parses`: every read command (Verification 2) plus every write command. The board has an integer past 2^53 in aiboard.json and in a brief's `created`, plus an emoji title. It asserts that `JSON.parse` succeeds, that the exact big-integer text appears, and that `"stale_after_hours": 24.0` appears.
- N2 `the kanban view counts characters as Python does`: an astral character at the truncation boundary and a trailing U+3000 before rstrip. Expected output from Python.
- N3 `argument errors, help and version match aiboard a1592dc`: a table of argv to stdout, stderr and exit, run in-process with `COLUMNS=80` set and restored. It covers the §1 cases, `-h`, `task -h`, `task start -h` and `--version`.
- N4 `read commands print what aiboard a1592dc prints`: a hand-made fixture with fixed timestamps and no in-progress task, so staleness cannot change. It runs `task list`, `task show`, `sprint list`, `sprint show`, `board`, `info` and `check` (one problem, exit 1), plus the `kinda-done` ValueError on stderr. The root is replaced by a placeholder before comparing. Expected text comes from Python.
- N5 `the command-line entry reads stdin as Python does and sets exit codes`: 3 to 4 child runs of `node board/cli/main.mjs` cover `--body-file -` with CRLF stored as LF, `task log T-001 -`, and exits 0, 1, 2, the `--json` usage error (1, JSON on stdout) and `check` (1).

This also covers key-list item 4: `installBlock` writes into a user's project, and the created / unchanged / updated paths and the keep-existing-content rule are tested.

**Time:** no slow test. In-process tests take milliseconds each; N5's child runs take about 60 to 80 ms each. The file is estimated at about 1 to 2 s, and the suite at about 75 s of the 120 s budget. I will measure and report it, and flag it if the file goes over 2 s.

## 6. Checks
- **Run:** `node --test test/board/cli.test.js` (red, then green); `node --test test/board/*.test.js`; `npm test` (CONTRIBUTING row "Anything else"); the scratch parity harness (§4.5).
- **Skipped:** `npm run test:prove-red`, because it mutates or runs none of these files; `npm run test:release`, because `bin/release.mjs` is untouched. Brief Verification 3 (`node --test test/*.test.js`) is superseded by `npm test`, per the brief's 2026-10-20 correction.

## 7. Declared differences from Python and other edge cases (in the worklog for 0423)
- **Crashes** (uncaught non-BoardError, non-ValueError errors, such as list labels or a missing `--body-file`): exit 1 matches; the stderr content does not (Python traceback against Node stack).
  - 0419's four TypeError-vs-AttributeError triggers fall in this group: both runtimes crash with exit 1.
- **EPIPE** (`| head`) and **non-UTF-8 argv bytes**: Python raises; Node does not. Not matched.
- **Lone surrogates in output, and stdin decode-error positions past 8 KB:** Python decodes stdin in chunks, so the reported position differs. Not matched.
- **aiboard.json float values echoed by `info --json`, and `name: 1.0`:** this comes from `pyJsonLoads` (0417), which loses the float. See Q3.
- **Invalid aiboard.json:** the "is not valid JSON: <detail>" text differs. This is 0418's accepted gap, now visible on stderr.
- **Ranks past 2^53** print as JS numbers. This sits under 0418's accepted residual *Ranks past 2^53*; this task does not change `Task.rank`, so it is not re-raised.
- **Lock waits** are silent, as in Python. The CLI starts no threads and kills no children, so 0418's other residuals are untouched.

## 8. Scope notes
- `serve` is 0422's ("including `serve --read-only`") and `mcp` is phase 9 (0468). The CLI only parses them here (Q2).
- `init` and `agents-md` are ported now and dropped in 0432, as the brief says.
- Nothing in the brief looks out of scope otherwise.
- The help-text fidelity I include is about 150 lines of formatter and textwrap port, on top of the usage formatter that errors need anyway.

open questions:
- **Q1. `sprint list` and 0420's index.** 0420's "snapshot only" ruling left this to 0421.
  - (Rec) Keep Python's per-member `sprint_progress` (one full scan per member). Output is identical in every case, including errors.
  - Option 2: pass one index (`_listTasks({}, byId)`). This is faster on fkit's corpus, but `sprint list` would then read every task, so one unreadable task outside any sprint (bad UTF-8, or NaN stale hours) would make it fail where Python does not.
  - knock-on: none (checked).
- **Q2. `serve` / `mcp` before they are ported.**
  - (Rec) Keep their full parsers (help, choices and argument errors match Python). The handler raises BoardError: `aiboard serve is not ported to Node yet (task 0422)`, or `... (task 0468, after v1)` for mcp. That prints `error: ...` with exit 1, or the JSON error. 0422 replaces the serve handler.
  - Option 2: leave both out of the parser until ported. Every top-level help and choice list would then differ from Python until then.
  - knock-on: none (checked; no Depends-on change; a forward note for 0422).
- **Q3. Float values in aiboard.json are echoed without their `.0`** (`info --json` config, `name: 1.0`). The cause is 0417's `pyJsonLoads`.
  - (Rec) Record it as a known gap for 0423. It needs a hand-written float in aiboard.json, and phase 3 replaces aiboard.json with board.json.
  - Option 2: fix it here, by keeping float-ness through `pyJsonLoads` and every config reader. That is a wider change to 0417's and 0418's code than this plan covers.
  - knock-on: none (checked).
