# Plan — 0417: port aiboard's model and front-matter layer to Node in `board/`, tests first

- Planning only. No files written, including plan.md. Spawned without `EnterPlanMode`, so planning-only was a promise I kept, not something the runtime blocked.
- Plan review **not run**: the spawn carried no `Plan review: on` switch line.
- Port source: aiboard `a1592dc`, read with `git show` only, never written. It has `aiboard/model.py` (395 lines) and `tests/test_board.py`. `ModelTests` has **9** tests: the 7 from `0108027` plus the 2 T-023 tests.
- The one new test file: **`test/board/model.test.js`**. No second test file. Nothing is a slow test: it is pure in-memory and should take well under 1 s.
- `package.json`: only the `"test"` and `"test:unit"` scripts change. No dependency is added.
- The two tests the brief named that need the store (`test_hand_edited_urgent_reads_as_critical`, `test_critical_priority_and_urgent_alias`) move to `0418`. See open question 2.
- The main risk is Python/JS string behaviour, not the parse logic itself. The plan adds a small Python-behaviour helper module and checks it against the Python reference once, by hand (not a kept test).

## 1. Scope and files

| Path | New/changed | What |
|---|---|---|
| `board/core/model.mjs` | new | Faithful port of `aiboard/model.py` @ `a1592dc`: every constant, `nowIso`, `parseIso`, `canonicalPriority`, `normalizePriority`, `normalizeStatus`, `slugify`, `formatId`, `normalizeId`, `parseScalar`, `parseFrontMatter`, `dumpScalar`, `dumpFrontMatter`, `WorklogEntry`, `WORKLOG_HEADING`, `parseWorklog`, `formatWorklogEntry`, `Task`, `Sprint` |
| `board/core/python-compat.mjs` | new | Python string/value behaviour the port depends on (§3). Separate file because `0418`'s store needs the same helpers (`store.py` uses `!r`, `.strip()`, `splitlines()` too) |
| `test/board/model.test.js` | new: the one pre-approved file | The 9 ported `ModelTests` and 2 fkit-added tests (§4) |
| `package.json` | changed | `"test"` and `"test:unit"` become `node --test test/*.test.js test/board/*.test.js`. `test:unit` changes too because CONTRIBUTING.md:26 says it is an alias of `npm test`. No `dependencies` key is added |
| `ai-agents/tasks/backlog/0417-…/worklog.md` | new | Red run, green run, timings, the one-off check against Python, decision log |

Layout `board/core/` follows decision document §3.1 (core / cli / server / web). Then `0418` adds `board/core/store.mjs`. Nothing in `claude/`, nothing in `install.sh`, nothing ships. No `.claude/` copies are touched. ESM `.mjs`, like `bin/`. The test file is `.test.js` with `import` statements, like the existing suite (Node 24 detects ESM on its own).

**API shape:** camelCase JS function names. `toDict()` output keeps aiboard's snake_case JSON keys and key order exactly, because the format must stay faithful. Test titles are the Python names verbatim (`test('test_front_matter_roundtrip', …)` inside `describe('ModelTests')`), so `0423` can match "every aiboard test landed somewhere" by name.

**Front matter is a `Map`, not a plain object (a deliberate choice).** A plain JS object moves integer-like keys (`1:`, `2024:`) to the front. That would change key order on write, which is a byte difference from Python's ordered dict. It would also make a `__proto__` key dangerous. `Map` keeps Python's dict behaviour exactly: insertion order, and a duplicate key keeps its first position but takes the last value. This is visible to `0418` and later tasks: they read meta with `.get()`.

## 2. Sequence (tests first, per the brief)

1. Record the baseline: `git status --porcelain > <scratchpad>/baseline.txt`. The tree is already dirty with `0536`'s in-flight work (CONTRIBUTING.md, install.sh, bin/fkit-board.mjs, vendor/ …). So verification step 5 is checked as the **difference from this baseline**, not as a clean tree.
2. Write `test/board/model.test.js` (§4).
3. Write a **stub** `board/core/model.mjs` that exports every name, with each function or constructor throwing `not implemented`. Run `node --test test/board/model.test.js` and capture the red run in the worklog. This makes **each test red on its own**: with no module at all, the import would fail once for the whole file, and that does not prove each test red.
4. Write `python-compat.mjs`, then the real `model.mjs`, mirroring `model.py` line by line in the same order and the same branch order.
5. Green on `node --test test/board/model.test.js`.
6. One-off check against the Python reference (not kept, not a test file, scratchpad only; §5).
7. Change the `package.json` scripts. Run the full `npm test` under `time`.
8. Worklog: red output, green output, timings, the result of the check against Python, and the decision log.

## 3. Python behaviour the port must copy (the top port risk, decision document §8.4 #3)

These are each a place where plain JS gives a different result from Python 3 on the same input. Each one is handled in `python-compat.mjs`:

- **`str.splitlines()`** splits on `\r\n \n \r \v \f \x1c \x1d \x1e \x85    ` and drops one trailing empty element. `split('\n')` is wrong: a CRLF brief would leave `\r` in values, and the body `join('\n')` would differ.
- **`str.strip()` / `lstrip()` with no argument** strips Python's whitespace set, which includes `\x1c`–`\x1f` and `\x85` but **not** `﻿`. JS `trim()` differs both ways. It is used for keys, values, fences (`--- `), comment detection and `- ` items. `rstrip('\n')` and `strip('-')` are character-specific and simple.
- **Regex `\s` / `\S`** in `WORKLOG_HEADING` use the same Python set, as an explicit class with the `u` flag.
- **`normalize_id`:** Python's `\d` and `int()` accept any Unicode decimal digit (`T-٣` → `T-003`), and `re.IGNORECASE` folds Unicode case (`ſ` matches `s`). The port uses `\p{Nd}` plus a digit-value helper, and the `iu` flags. Python's `.` matches `\r`; JS's does not, so `(?:-.*)?` becomes `(?:-[^\n]*)?`. `formatId` pads the digit string, not a Number, so long ids keep precision. Sign handled as Python's `03d` does.
- **`_parse_scalar` integers:** only ASCII canonical integers become ints (`0013`, `-0`, `007` stay strings), which the ASCII `/^-?\d+$/` gives as well. Integers beyond `Number.MAX_SAFE_INTEGER` become **`BigInt`**. Plain Number would lose digits. Keeping them as strings would wrongly leave a *quoted* big digit string unquoted on write, which is a byte difference. Knock-on for `0421`: `JSON.stringify` throws on BigInt, so the CLI's `--json` must convert it. I will flag this in the worklog.
- **`_dump_scalar`'s `_parse_scalar(s) != s` check** works with `!==`, because a list, Map, number or null is never `===` a string.
- **`str()` and `repr()`:** a `pyStr` helper (`True`/`False`/`None`, lists as Python repr) for `str(meta["updated"])`, `str(raw)` in `rank`, `str(ref)` in `blocked_by`, and `str(value)` in `_dump_scalar`. A `pyRepr` helper for `ValueError` messages (`unknown status 'bogus'; …`) and for nested inline lists. Those are reachable: `tags: [x, [y]]` parses to `['x', ['y']]`, and Python then writes `  - "['y']"`. `pyRepr` follows CPython's rules: the quote choice, `\\ \' \n \r \t`, and `\xHH` / `\uHHHH` / `\UHHHHHHHH` for characters Python does not count as printable (Unicode categories C* and Z* except space).
- **Truthiness (`x or default`):** in Python, `[]`, `0` and `""` count as false; in JS `[]` counts as true. A `pyTruthy` helper is used for `sprint`, `assignee`, `priority`, `labels`, `blocked_by`, `tasks` and `updated`.
- **`list(x)`:** a string becomes its characters, by code point, as `Array.from` does. An int or bool raises `TypeError` in Python, and the port throws a `TypeError` too, so `labels: 5` fails the same way in both.
- **`int(str(raw).strip())` for `rank`:** a `pyInt` helper accepting an optional sign, Unicode digits and single `_` between digits (`"1_000"` → 1000), otherwise `ValueError` → the id-based default. It returns a Number. Accepted difference: a rank above 2^53 loses precision; Python keeps it exact. Not reachable in practice.
- **`max(stamps)`** in `last_activity` compares by code point, not by UTF-16 unit (`pyMax`).
- **`parse_iso`** copies CPython `_strptime`'s field patterns for `%Y-%m-%dT%H:%M:%SZ`: case-insensitive, 1-or-2-digit fields, `%d` allowing a leading space, Unicode digits, real date validation (Feb 30 → `null`, second 60/61 → `null`). Returns a `Date` or `null`. `nowIso` is `toISOString()` without milliseconds.
- **`Path` handling:** `Task.path` / `Sprint.path` are strings normalised the way Python's `PurePosixPath` does it: collapse `//`, drop `.` segments, drop the trailing `/`, empty → `.`, keep `..`. `folder` copies `Path.name` (`'.'` → `''`). POSIX only; fkit has no Windows path.
- **Missing keys:** `Map.get` returns `undefined` where Python returns `None`. A `metaGet` helper returns `null`, so `toDict()` writes `"created": null` instead of dropping the key from JSON.
- **`ValueError`:** exported class, so the store (`0418`) can catch exactly what Python's store catches.
- **"Emoji counted differently":** in this layer it is harmless. The only length check is `len(raw) >= 2 and raw[0] == raw[-1] in "\"'"`. An astral character is length 2 in JS but never a quote character, so the result is the same. `slugify` slices only after removing non-ASCII. It will matter in `0421` (terminal widths, `test_board_truncates_with_ellipsis`). I will say so in the worklog.

**Known gap inherited on purpose (faithful port, ADR-052 phase 2):** a `None` or `""` item in a block list is written as `  - ` / `  - ""`, and the bare `-` is dropped on read. That is the reported gap at `a1592dc`. The port copies it. The ported `test_hostile_scalars_roundtrip` skips it exactly as Python does.

**Accepted, unreachable from parsing:** float formatting in `_dump_scalar` (Python `1e+20` vs JS `100000000000000000000`), because the store only writes ints; and the int-digit limit of Python 3.11+, because the reference runs on 3.9.6.

**Forward notes for `0418`** (store layer, not this task): Python's `read_text` converts `\r\n` to `\n` when reading text. Node `readFileSync(…,'utf8')` does neither that nor any BOM stripping. The store must copy Python's read and write behaviour, or bytes will differ there.

## 4. Test file `test/board/model.test.js`: the exact list

`describe('ModelTests')`, ported from `a1592dc` with the same inputs and assertions. `assertEqual` on dicts becomes `deepStrictEqual` on Maps, which ignores order just like Python's dict compare. `assertIs(type(…))` becomes a small local Python-type-name helper.
1. `test_front_matter_roundtrip`
2. `test_front_matter_inline_list_and_missing`
3. `test_zero_padded_digits_roundtrip_byte_identical`
4. `test_hostile_scalars_roundtrip`
5. `test_quotes_and_backslashes_roundtrip`
6. `test_ids_and_statuses`
7. `test_priorities`
8. `test_rank_defaults_to_id_order`
9. `test_worklog_parse`

`describe('fkit additions')`:

10. **`emoji, quotes, backslashes and 0013 survive a write byte-for-byte`** (brief item 4). One front-matter document in exactly the form Python writes, holding `id: 0013`, a block list item `0404`, an emoji title with `:`, `"` and `\` (so it is quoted and escaped), an emoji list item, and an emoji body. Assert `dumpFrontMatter(...parseFrontMatter(text))` gives the same bytes (`Buffer.equals`, not just string `===`). Before the test is final, I check the expected text against Python `a1592dc` (§5), so the expected bytes are Python's, not mine.
11. **`keeps Python's string behaviour (port guard)`**: one test covering §3's risks:
    - a CRLF document;
    - `\x1f` / `﻿` at value edges;
    - an integer-like key (`2024:`) keeps its order;
    - a nested inline list written as Python's repr;
    - a Unicode-digit id (`T-٣` → `T-003`);
    - a `str(True)` path;
    - a BigInt round-trip.

    Each expected value comes from the Python reference run in §5.

Not in this file, moving to `0418`: `test_hand_edited_urgent_reads_as_critical` and `test_critical_priority_and_urgent_alias`. Both call `Board.create_task`/`update_task`/`get_task`, which is the store, so they cannot run until `0418`. Neither is in `0418`'s list of tests to port, so they need a carry note; see open question 2. Until then, nothing tests `Task.priority` turning `urgent` into `critical`; only `normalize_priority`'s alias handling is tested, in test 7.

For `0423` (count only): at `a1592dc` aiboard has 48 (`test_board.py`) + 6 (`test_server.py`) = **54** non-MCP tests, plus 10 MCP. ADR-052's "52" was counted at `0108027`, before T-023's 2 tests.

## 5. Checks: what runs, and what is skipped

CONTRIBUTING.md's "what changed → what to run" table: `board/`, `test/`, `package.json` fall under "Anything else" → **`npm test`**.

- **Red:** `node --test test/board/model.test.js` against the stub. All 11 fail, each on its own. Output goes in the worklog.
- **Green:** the same command, 11/11.
- **Full suite:** `time npm test` after the `package.json` change. Expect `test/board/model.test.js` to be picked up, everything green, and a total under 120 s (ADR-057 D10). Today it is about 76 s on a busy machine, and the new file adds well under 1 s. I report the time with the load caveat CONTRIBUTING uses.
- **One-off check against Python** (scratchpad only, not a kept test, so no test-file approval needed; same status as ADR-057 D2.1's note on `0423`'s check):
    - extract with `git -C ~/Workspace/aiboard archive a1592dc aiboard | tar -x` into a new, empty scratchpad folder; this only reads the repo;
    - run `python3 -I` (3.9.6 on this Mac) on a script kept in a different scratchpad folder;
    - feed the same inputs to Python and Node: the hostile scalar list, test 10's and 11's documents, and a few hundred generated mixes of the §3 characters, keys and list shapes;
    - compare `parse` results (as JSON with type tags) and `dump` bytes;
    - the result goes in the worklog. Target: 0 differences other than the listed unreachable ones.
- **No dependency:** `git diff package.json` shows only the two script lines.
- **Fence:** `git status --porcelain` compared with the baseline. Expected new entries: `board/`, `test/board/`, `package.json`, the task folder, and nothing else (plus whatever open question 1 approves).
- **Skipped:**
    - `npm run test:prove-red`: no file it mutates or runs is touched (CONTRIBUTING row 3);
    - `npm run test:release`: `bin/release.mjs` is not touched;
    - `node --test test/*.test.js` on its own: the brief's step 2 asks for it, but `npm test` is now the superset that includes it (brief's 2026-10-20 correction).

## 6. Plausible failure modes to watch

- Python and Node may use different Unicode versions, so "printable" in `pyRepr` and `\p{Nd}` could disagree on very new code points. The one-off check covers common scripts only; anything else is noted in the worklog, not hidden.
- `node --test` with the `test/board/*.test.js` glob: npm's `sh` passes an unmatched pattern through as literal text. That does not matter here, because the file exists from this task on.
- `0536` is editing other files in the same tree (CONTRIBUTING.md, install.sh, bin/). I touch none of them unless open question 1 approves it, and then only distinct lines.

open questions:

1. **Docs that the `package.json` change makes wrong.** After this task, `npm test` also runs `test/board/`. Four places say otherwise:
   - `RELEASING.md:142` ("`npm test` is `node --test test/*.test.js`");
   - `ai-agents/knowledge-base/architecture.md:515`, which says the same;
   - CONTRIBUTING.md "Test rules → What a test may cover", which lists only shipped scripts, with no mention that the board's tests count (ADR-057 §D1's ⛔ note);
   - CONTRIBUTING.md "Layout", which has no `board/` or `test/board/`.

   The brief's verification step 5 allows changes only to `board/`, `test/board/` and the task folder (plus `package.json` by the correction note), so fixing these needs the owner's OK.
   - **(A) Rec:** in this task, fix the RELEASING.md line and CONTRIBUTING's two spots, one or two lines each, without touching `0536`'s lines. Leave architecture.md to the architect (`/fkit-inspect`), flagged in the worklog. Knock-on: none (checked); no task's placement or `Depends on:` changes.
   - **(B):** change only `package.json`. The four docs stay wrong until someone fixes them. The driver or producer files a small follow-up. Knock-on: none (checked).
   - **(C):** fix all four here, architecture.md included. architecture.md is the architect's document, so this goes further outside the brief's fence. Knock-on: none (checked).

   Context to give the owner: these lines tell people and agents what `npm test` runs and what tests are allowed. Left alone, they will be out of date on the day this lands.

2. **Two named tests cannot be ported here.** `test_hand_edited_urgent_reads_as_critical` (named in this brief) and `test_critical_priority_and_urgent_alias` both need the task store, which arrives in `0418`. Neither is in `0418`'s list of tests to port. **Rec:** they move to `0418`; the driver asks a producer to add a dated note to `0418`'s brief, so `0423`'s "every test landed" check finds them there. Knock-on: none (checked). No `Depends on:` changes; `0418` already depends on `0417`. Not blocking: I can go ahead with the plan as written either way.
