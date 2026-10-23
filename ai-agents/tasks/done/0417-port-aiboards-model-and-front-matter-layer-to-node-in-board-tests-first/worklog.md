# Worklog — 0417

## 2026-10-20 — fkit-coder (Build worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Built the approved `plan.md` (blob `c546037e`, checked with `git hash-object`) under the
declared-approval marker. Owner approval relayed: `AskUserQuestion`, 2026-10-20, `fkit-lead` session,
selected *"Approve, fix the docs (Recommended)"*. That settles open question 1 = (A) and open question 2
= the two store tests move to `0418`. No commit, no push.

### Change surface

- `board/core/model.mjs` (new): port of `aiboard/model.py` @ `a1592dc`. Every name `store.py` imports
  is exported (checked against `store.py`'s `from .model import` list).
- `board/core/python-compat.mjs` (new): the Python string and value helpers listed in plan §3.
- `test/board/model.test.js` (new): the one pre-approved test file, 11 tests.
- `package.json`: only `"test"` and `"test:unit"` changed, to `node --test test/*.test.js test/board/*.test.js`.
  No dependency added.
- `RELEASING.md` (open question 1 (A)): the `npm test is …` sentence now names `test/board/*.test.js`.
  Rewrapped across the same 3 lines.
- `CONTRIBUTING.md` (open question 1 (A)): "What a test may cover" gains item 3 (`board/`, tested under
  `test/board/`, pointing to ADR-057 §D1's dated note). "Layout" gains a `board/` line and a `test/board/`
  line. `0536`'s lines are untouched: they were already in the baseline diff and are byte-identical.
- ⚠️ **Not fixed, for the architect:** `ai-agents/knowledge-base/architecture.md:515` still says
  `` `npm test` is `node --test test/*.test.js` ``. That is the architect's document (`/fkit-inspect`), so it is
  left alone, per the owner's choice (A).
  > **Update 2026-10-20 (Process-review worker, review round 1):** no longer stale. Checked this turn:
  > architecture.md §9.1 ("The suite now runs automatically") now says
  > *"`npm test` is `node --test test/*.test.js test/board/*.test.js` (the second glob since task 0417 …"*
  > — the architect updated it. The line above is kept as written at Build time.

### Red run (stub `model.mjs`, every export throwing `not implemented`)

`node --test test/board/model.test.js`, exit 1: tests 11, pass 0, fail 11. Each test fails on its own:

```
✖ test_front_matter_roundtrip                      Error: not implemented
✖ test_front_matter_inline_list_and_missing        Error: not implemented
✖ test_zero_padded_digits_roundtrip_byte_identical Error: not implemented
✖ test_hostile_scalars_roundtrip                   Error: not implemented
✖ test_quotes_and_backslashes_roundtrip            Error: not implemented
✖ test_ids_and_statuses                            Error: not implemented
✖ test_priorities                                  AssertionError: PRIORITIES [] vs ['low','medium','high','critical']
✖ test_rank_defaults_to_id_order                   Error: not implemented
✖ test_worklog_parse                               Error: not implemented
✖ emoji, quotes, backslashes and 0013 survive a write byte-for-byte   Error: not implemented
✖ keeps Python's string behaviour (port guard)     Error: not implemented
```

### Green run

- `node --test test/board/model.test.js`, exit 0: tests 11, pass 11, fail 0, about 40 ms.
- `time npm test`, exit 0: tests 856, pass 856, fail 0, **78.9 s** wall clock. The board file is picked
  up by the new glob. Load average at the start was 3.68 / 9.75 / 11.64 on a busy Apple M4 Pro, so this is
  not an idle-machine time. It is inside the 120 s budget (ADR-057 D10). The known load-sensitive test
  (`0284/term-ignored`, tracked as `0537`) passed on this run.
- `node --test` prints a `MODULE_TYPELESS_PACKAGE_JSON` warning for the new file. The existing
  `test/*.test.js` files get the same warning (23 in the run), so this is not new behaviour.

### One-off check against the Python reference (scratchpad only, not kept, not a test file)

- Source: `git -C ~/Workspace/aiboard archive a1592dc aiboard tests | tar -x` into a new, empty scratchpad
  folder. The aiboard repo was only read. Python: `python3 -I` (3.9.6) on scripts kept in a separate
  scratchpad folder.
- Inputs, all generated once and fed to both sides:
  - 400 generated front-matter documents mixing the §3 characters (`\r\n`, `\r`, `\x85`, ` `, `\x1c`,
    `\x1f`, `﻿`, `\v`, `\f`, NBSP, ideographic space), integer-like and `__proto__` keys, inline,
    nested and block lists, quotes, backslashes, emoji (ZWJ and flag), Unicode digits, big integers, and
    bad fences;
  - for each document: parse (as typed JSON), dump bytes, `Task.to_dict(include_body=True)` and
    `Sprint.to_dict(include_body=True)`, including the `TypeError` cases (for example `labels: 5`);
  - 400 id refs through `normalize_id`, `slugify`, `normalize_status` and `normalize_priority`, including
    the `ValueError` messages;
  - 12 distinct `parse_iso` inputs: case, 1-digit fields, a leading-space day, Arabic-Indic digits,
    Feb 29 / Feb 30, second 60, year 0000, month 13, trailing data, empty;
  - 400 worklogs;
  - 145 scalar values (the hostile list plus extras) round-tripped as `{v, l: [v, 'ok'], n: [[v]]}`.
- **Result: 3090 results compared, 0 differences.**
- The check itself was tested: two deliberate breaks in a copy of the port (`pyStrip` → JS `trim()`,
  `pySplitlines` → `split('\n')`) gave 175 and 465 differences.
- The first generator run had a weak random picker (low LCG bits), which gave only 3 distinct date
  inputs. I fixed it to use the high bits and reran everything. The numbers above are from the second run.
- Not covered: Unicode-version edges (code points new since Python 3.9's Unicode 13, for `\p{Nd}` and
  "printable" in `pyRepr`). Common scripts only (plan §6).
- Tests 10 and 11 expected values were checked against Python before the tests were final. That check
  changed two things in the test:
  - test 10 dropped a `note: 'kept'` line, because Python rewrites it as `note: kept`, so the document
    would not be in "exactly the form Python writes";
  - test 11's `other: \x85y` reads as `None`, because `\x85` is a line break for `splitlines()`.

### Decision log

Calls made unattended, inside the approved plan:

- **`pyStrip` is a loop, not a regex.** A trailing-whitespace regex backtracks quadratically on long
  interior whitespace runs. Python's `strip()` is linear, so a loop matches it in cost as well as result.
  Why it qualified: in-plan (§3 "`str.strip()`"), mechanical, verified by the check.
- **`pyInt('-0')` returns `0`, not JS `-0`.** It is built through `BigInt`, which has no negative zero.
  Python's `int('-0')` is `0`. Why it qualified: in-plan (§3 `pyInt`), mechanical.
- **Invisible characters kept out of source.** The editor turned ` `, ` ` and `﻿` escapes
  into raw characters in three places. A raw U+2028 ends a line in JS and broke a regex literal and a
  comment. I replaced all of them with escapes, and the three new files now hold no raw
  U+2028/U+2029/U+FEFF/U+0085. Em dashes (`—`) in `WORKLOG_HEADING` and `formatWorklogEntry` are deliberate,
  as in aiboard's source.
- **Alias tables (`STATUS_ALIASES`, `PRIORITY_ALIASES`) are `Map`s.** A plain object lookup would turn
  `normalizeStatus('constructor')` into a prototype hit instead of Python's `ValueError`. This follows the
  plan's "dict → Map" choice.
- **Test 11 covers a few more §3 risks than the plan's bullet list:**
  - `ſ` case-folding in `normalizeId`;
  - `PurePosixPath` normalisation and `Path.name`;
  - `list(str)` for `labels`;
  - a `repr` in a `ValueError` message.

  All of these are §3 items, and every expected value comes from Python.
- `parseScalar` is not exported, and neither is Python's `_parse_scalar`, which is private and not
  imported by `store.py`.

### Forward notes

- **`0418` (store):**
  - Python's `read_text` turns `\r\n` into `\n`; Node's `readFileSync(…, 'utf8')` does not, and it keeps a BOM.
  - `Task.blocked` reads `b.status`, so the store should fill `blockers` with plain objects, which is
    also what `toDict()` writes to JSON.
  - Front matter is a `Map`; read it with `.get()`.
  - `ValueError` is exported for the store's `except ValueError` paths.
  - The two store-bound tests, `test_hand_edited_urgent_reads_as_critical` and
    `test_critical_priority_and_urgent_alias`, move to `0418` (owner, open question 2). Until then,
    `Task.priority` turning `urgent` into `critical` has no test here; only `normalizePriority`'s alias
    handling is tested, in `test_priorities`.
- **`0421` (CLI `--json`):**
  - integers beyond 2^53 come back as `BigInt`, and `JSON.stringify` throws on `BigInt`, so `--json`
    must convert them;
  - emoji width matters there (`test_board_truncates_with_ellipsis`). It does not matter in this layer.
- **Accepted gaps, as planned:**
  - float formatting (unreachable from parsing);
  - a stored `rank` above 2^53 loses precision;
  - the inherited `None` / `""` block-list item gap (`test_hostile_scalars_roundtrip` skips it, as
    Python's test does).

### Checks skipped

- `npm run test:prove-red`: no file it mutates or runs was touched (CONTRIBUTING "What to run").
- `npm run test:release`: `bin/release.mjs` was not touched.
- A separate `node --test test/*.test.js`: `npm test` is now its superset, and it ran green.

### Fence (`git status --porcelain` against the pre-build baseline)

New entries:
- `?? board/`
- `?? test/board/`
- ` M package.json`
- ` M RELEASING.md` (approved, open question 1 (A))
- this `worklog.md`

`CONTRIBUTING.md` was already ` M` in the baseline (`0536`), and my lines in it are distinct from
`0536`'s. Nothing else changed.

## Verify — 2026-10-20 (independent VERIFY worker, sprint-ship-loop; read-only on source)

**Result: pass.**

- `node --test test/board/model.test.js`: 11/11 pass.
- `npm test`: 856/856 pass, exit 0, 87 s wall clock — under the 2-minute budget (ADR-057 D10).
  The board tests ran inside it. `0284/term-ignored` passed (6.3 s).
- `git diff package.json`: only the `test` and `test:unit` lines changed; no dependency added.
- No raw U+2028 / U+2029 / U+FEFF / U+0085 in `board/core/model.mjs`, `board/core/python-compat.mjs`,
  `test/board/model.test.js`, `package.json`, `RELEASING.md`, `CONTRIBUTING.md`.
- Python-vs-Node comparison, re-run from a fresh folder (`scratchpad/verify417/`): aiboard extracted
  with `git archive a1592dc` (the aiboard repo stayed clean), the Build's scripts copied unchanged,
  `python3 -I` (3.9.6). **3090 results compared, 0 differences.** The generated cases were
  byte-identical to the Build's. The comparator still reports the Build's saved mutant outputs
  (465 and 175 differences), so it can catch a difference; the mutants were not rebuilt.
- RELEASING.md / CONTRIBUTING.md board lines read by eye; the ADR-057 §D1 note they cite exists.

Skipped: `npm run test:prove-red` (no file it mutates or runs changed); `npm run test:release`
(`bin/release.mjs` not touched).

## 2026-10-20 — fkit-coder (Process-review worker, round 1; spawned by fkit-sprint-ship-loop / fkit-lead)

Processed `review.md` round 1 (R1–R3) under the declared-approval marker (plan blob `c546037e`,
checked with `git hash-object`; owner approval relayed: `AskUserQuestion`, 2026-10-20, `fkit-lead`
session, *"Approve, fix the docs (Recommended)"*). No commit, no push.

### Decision log — fixes applied without per-fix owner approval

Each one: verified `CORRECT` by reproducing it, mechanical and localized, inside the approved plan.

- **R1 → `board/core/model.mjs`, `dumpFrontMatter`.** `body.replace(/\n+$/, '')` became a backwards
  loop over trailing `\n`, then `slice`. Why it qualified: reproduced the quadratic cost (36 / 139 /
  550 ms at 10k / 20k / 40k leading blank lines; < 0.2 ms after); same result as Python's
  `rstrip('\n')`, which plan §3 already calls character-specific and simple; same pattern as the Build's
  `pyStrip` call. Output checked identical on 6 edge bodies, and by the Python parity re-run below.
- **R2 → `board/core/python-compat.mjs`, `pyStr`.** It now hands only an Array or Map to `pyRepr`, and
  throws `TypeError` (`no Python str() for [object …]; use a Map for a dict`) for any other
  non-scalar. Before, a plain object, function, Symbol or Date recursed `pyStr` ↔ `pyRepr` to a
  `RangeError` (reproduced). **Obvious-winner call:** a clear `TypeError` rather than printing a plain
  object as a Python dict. Why: the port's dict is a `Map` (plan §1), so a plain object has no Python
  twin and no faithful output to copy; guessing one would hide a wrong type passed in by a later layer
  (`0418`). Unreachable from `parseFrontMatter` either way.
- **R3 → `CONTRIBUTING.md`, "What a test may cover" item 3 (0417's own line).** Added: *"its tests
  import the module, so "from outside" there means through its exported API only."* Why it qualified:
  in-plan (open question 1 (A), the CONTRIBUTING fix the owner approved), wording only, and it states
  what the approved `ModelTests` port already does. `0536`'s lines untouched.
- **Not done — reviewer suggestions (not defects):** no new cases for `parseIso` or `Task`/`Sprint`
  `toDict()` key order in `test/board/model.test.js`. CONTRIBUTING's test rules do not call for them
  (not on the key list, so a missing test is a suggestion), and plan §4 lists the file's tests
  exactly. Both stay covered by the one-off Python check (and by `0423`'s corpus gate later). Also no
  test case for R1 / R2: not on the key list.

### Checks

- `node --test test/board/model.test.js`: 11/11 pass, about 45 ms.
- `time npm test`, exit 0: 856/856 pass, **75.4 s** wall clock (load average 3.42 / 4.34 / 7.13 at the
  start, so not an idle machine). Inside the 120 s budget. `0284/term-ignored` passed (6.3 s).
- Python parity re-run (scratchpad `verify417/`, the earlier saved inputs and scripts unchanged; the
  aiboard `a1592dc` extract, `python3 -I` 3.9.6): **3090 results compared, 0 differences**. The Python
  output was byte-identical to the earlier run's.
- Skipped: `npm run test:prove-red` (no file it mutates or runs changed); `npm run test:release`
  (`bin/release.mjs` not touched). CONTRIBUTING.md has no automated check ("What to run", row 1); read by eye.

### Phase-3 note (inherited aiboard gap, not a defect here)

The reviewer found a second gap inherited from aiboard: an **unquoted value containing a line break**
(for example a title holding `\n`, `\r` or `\x85`) is written unquoted, so on read-back
`splitlines()` cuts it at the break. Python `a1592dc` does exactly the same, so the faithful port
keeps it (ADR-052 phase 2: faithful to the reference). For phase 3 (fixes on top of the port), along
with the `None` / `""` block-list item gap already listed above.

## 2026-10-20 — fkit-coder (Re-verify (post-review); spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no commit. **Result: pass.**

- Round-1 change surface confirmed: `board/core/model.mjs`, `board/core/python-compat.mjs` (both
  21:37), `CONTRIBUTING.md` (21:37; item 3 continuation line present). `test/board/model.test.js`
  (21:20), `package.json` (21:22), `RELEASING.md` (21:22) last changed before the first verify run
  (21:27), so round 1 did not touch them.
- `node --test test/board/model.test.js`: 11/11 pass, about 38 ms.
- `npm test`, exit 0: 856/856 pass, **75 s** wall clock (load average 2.41 / 3.66 / 6.11 at the
  start). Inside the 120 s budget. `0284/term-ignored` passed (6.4 s).
- Python parity from a fresh folder (scratchpad `reverify417/`): new `git archive a1592dc` extract
  (aiboard repo stayed clean), scripts copied unchanged, `python3 -I` 3.9.6. Generated cases
  byte-identical to the first verify's. **3090 results compared, 0 differences**; Python and Node
  outputs both byte-identical to the first verify's. Comparator still catches 2 planted differences.
- `dumpFrontMatter`: linear — 0.02 ms at 40k leading blank lines, 0.6 ms at 40k all-newline body,
  0.3 ms at 160k (the old `/\n+$/` takes 38 / 142 / 546 ms at 10k / 20k / 40k). 20 edge bodies
  (empty, all `\n`, `\r\n`, `\n\r`, trailing space line, `\x85`, U+2028/U+2029, emoji) match
  Python's `dump_front_matter` exactly.
- `pyStr({a:1})` throws `TypeError` (also function, Symbol, Date, Set); no `RangeError`. Arrays, Maps
  and scalars unchanged.
- No raw U+2028 / U+2029 / U+FEFF / U+0085 in the changed files; `node --check` passes on both modules.

Skipped: `npm run test:prove-red` (no file it mutates or runs changed); `npm run test:release`
(`bin/release.mjs` not touched); CONTRIBUTING.md has no automated check (read by eye).
