# Worklog — 0423

## 2026-10-22 — fkit-coder (Build worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Ran the approved `plan.md` (blob `86f76a41b8f516eebef076cfba177ad6abedda15`, 21,334 bytes, checked with
`git hash-object` at the start and the end) under the declared-approval marker. Owner approval relayed:
`AskUserQuestion`, 2026-10-22, `fkit-lead` session, *"Approve, scripts throwaway (Recommended)"*. No commit, no
push. This worklog is the only repo write; no source, test, brief or `plan.md` change.

**Result: 0 differences between the Node port and Python on fkit's corpus (both corpora, every part, raw
count 0).** Every gate condition is met **except one control, read by the plan's letter**: the UTF-16 mutant
(control 1) makes **no** difference on the corpus, because the corpus has nothing that triggers it. It is caught
by part S (0421's own harness) and by `test/board/cli.test.js`. Gate verdict held back for the owner — see
*Open decision* at the end.

### Corpus (Verification 4)

- **Corpus H (the gate corpus):** fkit `HEAD` = `32c0f36c88bd5557fd79de3d61c27c28191b6f3f`, copied with
  `git archive 32c0f36:ai-agents tasks sprints` (git objects only). 535 `brief.md` (the plan's 536 counted
  `tasks/done/0478-…/assets/source-brief.md`, which is not a `brief.md`), 3 top-level sprint plans, 12 archived
  boards, 1,120 `.md` in all. Phase-1 file set: **538 files, 2,870 fields**. Manifest sha256 of the copy:
  `39f064e5…ac4dc4ca` (1,141 files).
- **Corpus W (live working tree, second run):** `cp -Rp` of `ai-agents/tasks` + `ai-agents/sprints`. 539
  `brief.md` (adds 0537, 0538, 0539, and 0536 in `done/`), 3 + 12 sprint files, 1,146 `.md`. Phase-1 set: **542
  files, 2,890 fields**. Manifest sha256 `3a74a2d8…dcc7b1eba` (1,169 files).
- Both copies `chmod -R a-w`; every run used a fresh `cp -Rp` copy. No copied path has an `ai-agents` segment.

### Reference and port

- **Python:** aiboard `a1592dc` (`aiboard/` + `tests/`), `git archive` into the scratchpad, read-only, all 12
  files checked blob by blob against `git ls-tree -r a1592dc` (12 OK). `git diff --stat a1592dc HEAD --
  aiboard/` in aiboard is empty. `/usr/bin/python3` 3.9.6, run as `-I -B`.
- **T-023 fixed in the reference:** `ModelTests.test_zero_padded_digits_roundtrip_byte_identical` and
  `test_hostile_scalars_roundtrip` from the extract → *Ran 2 tests … OK*. Probe:
  `dump_front_matter({'id': '0013', 'labels': ['0013', '13']}, 'b')` → `id: 0013`, `- 0013`, `- "13"`; parsed back
  as `str` `'0013'`, `['0013', '13']`; second dump byte-identical. aiboard's full suite not run (plan §3).
- **Port:** `board/` (untracked, so named by hash). sha256 manifest at start and end **identical**:
  `cli/argparse.mjs 14a33dca…`, `cli/cli.mjs 23dfe3ad…`, `cli/main.mjs 010ccf78…`, `core/instructions.mjs
  8e39f036…`, `core/lock.mjs 57973497…`, `core/model.mjs 226569ed…`, `core/python-compat.mjs ba064dee…`,
  `core/store.mjs eb7b75ef…`, `server/server.mjs 8800bcb6…`, `web/index.html 3b32c9e8…`. Node v24.13.0.

### Harness (one-off, scratchpad only — owner Q1 "scripts throwaway")

Folder: `<scratchpad>/p423/scripts/` (scratchpad = this session's
`/private/tmp/claude-501/-Users-mark-dolbyrev-Workspace-fkit/40d9710e-…/scratchpad`). Not in git. sha256:
`orch.mjs 54356293…`, `pyside.py 51b74cf9…`, `jsside.mjs 25a55698…`, `gen.py 0291cefd…`, `compare.mjs 8ba1ad6d…`,
`classify422.mjs 6fa9e498…`, `sweep.mjs a6b99239…`, `mapping.mjs 9bbf0d38…`, `mutsweep.mjs 4a5437f6…`,
`t023.py 4ad08abf…`, `safety-after.sh 53ea4cac…`, `fkit_corpus_check.py 19354fef…` (= `git show
cb742bb:scripts/fkit_corpus_check.py`, blob `4ec69aba`).

- **Commands:** `node orch.mjs prep`; per corpus `gen`, `c1`, `c2 <corpus> py|js 1`, `seed`, `c4 … 1`,
  `c5 … py|js`, `c6 … py|js`; controls `c2 … 2`, `c4 … 2`; `node compare.mjs cli|server|c1 <py> <js>`;
  `node sweep.mjs 0417|0418|0420|0421|0422`. Every child: `spawnSync`, 600 s cap, `SIGKILL`; Python
  `/usr/bin/python3 -I -B`; env `AIBOARD_ROOT` unset, `AIBOARD_AUTHOR=tester`, `BROWSER=true`, `COLUMNS=80`,
  `LC_ALL=en_US.UTF-8`; cwd = the temp board; `--root <temp board>` always given. All boards under
  `realpath(tmpdir())/p423-*`, root guard on every board root, body file and cwd. No `serve` / `mcp` ever run.
- **Generator rules (C2):** briefs sorted by fkit id; `task new <H1> --body-file <copy> --status <s> --label
  <fkit id> [--assignee=<## Owner>] --by tester`. Status: `## Status` (phase-1 field rule) starting ✅ → done, ⛔
  → cancelled, 🔄 → in-progress, else the folder. Sprints: `sprints/*.md` then `sprints/done/*.md`, sorted;
  `sprint new <H1> --body-file <copy> --status <line-3 banner, same emoji rule, else backlog>`, then `sprint add
  S-nnn <T-ids>` from the task links in the board's `|` table rows (0 links skipped: every linked id exists).
  Then `check`, `check --json`. A tree hash every 20 steps and at the end; final trees compared file by file.
- **C3 builder** (Python, once): front matter `{id, title, status}` + every phase-1 field as a string; field keys
  that clash with aiboard's own keys (`id`, `priority`, `sprint`, `status`) are written as `fkit_<key>`; the
  original brief follows unchanged. Sprints: `sprint.md` with `{id, title, status, tasks}` + the board text.
- **Normalization:** temp root → `<ROOT>`, `YYYY-MM-DDTHH:MM:SSZ` → `<TS>`, the snapshot's `generated` and the
  server port masked. Nothing else.
- **Read-step check (C4):** a stat signature (path, size, mtime_ns, inode) of the whole board after every read
  step must equal the one before it; full content hash every 20 steps and at the end.

### Results (Verification 1) — raw / classified / unclassified

*(Review round 1, R4: the harness's own `RESULT` lines are pasted in the 2026-10-23 Process-review entry
below; the table here is a summary of them.)*

| Part | Corpus H | Corpus W |
|---|---|---|
| C1 front matter, 1,120 / 1,146 files × 5 values | 0 / 0 / 0 | 0 / 0 / 0 |
| C1 anchor (aiboard's `fkit_corpus_check.py`, unchanged) | `files=538 fields=2870`, 0 / 0 / 0 failures | `files=542 fields=2890`, 0 / 0 / 0 failures |
| C2 corpus board via CLI | 568 steps, 0 / 0 / 0; final tree 1,655 entries, 0 differ | 572 steps, 0 / 0 / 0; 1,667 entries, 0 differ |
| C4 CLI reads (C2 board + C3 board) | 2,424 steps, 0 / 0 / 0; reads that wrote: 0 | 2,440 steps, 0 / 0 / 0; reads that wrote: 0 |
| C5 server GETs (local Host ×2 + foreign Host) | 2,222 requests, 0 / 0 / 0; all 200 | 2,238 requests, 0 / 0 / 0; all 200 |
| C6 CLI writes | 567 steps, 0 / 0 / 0; 1,715 entries, 0 differ | 572 steps, 0 / 0 / 0; 1,727 entries, 0 differ |
| C6 server POSTs (22 groups, fresh copies) | 176 requests, 0 / 0 / 0; trees equal | 176 requests, 0 / 0 / 0; trees equal |

- Classified differences on C1–C6: **none** (no G1–G9 item). No crash on either side in any corpus part.
- Exit codes C2: 0 ×566, 1 ×2 (`check` / `check --json`: 4 real problems, e.g. *"S-014 is done but still has
  open tasks: …"*, same text both sides). C3's `check` lists ~0.5k problems (no `worklog.md` in hand-made tasks):
  also identical.
- **G5 (ranks past 2^53) on real data: not hit.** Largest rank / id — H: 535,000 / T-535; W: 539,000 / T-539;
  after C6 ranks span −29,000 … 539,000.
- **C5 foreign Host (`evil.example`, informational, `0539`'s baseline):** 5 GETs per board, 200 on both sides,
  bodies equal. `0539` has not landed, so no G9.
- **Loopback retries:** 0 on both sides, all server runs.
- **Controls — self-runs:** Python vs Python and Node vs Node on C2 and C4, both corpora: **0 differences** each
  (8 comparisons).
- **Controls — mutants** (scratch copies of `board/` under the temp folder; the repo never edited):

| Mutant | Corpus harness (C1–C6) | Elsewhere |
|---|---|---|
| 1 kanban cut by UTF-16 unit (`cell.split('')` for `Array.from(cell)`) | **0** (C2, C4) | S, 0421 harness seed 421: 2 mismatches (`T-001 abcdefghijklmnopqr\ud83d…`); `test/board/cli.test.js`: *the kanban view counts characters…* fails |
| 1b (extra) `pyFormatLeft` pads by UTF-16 unit | 0 (C2, C4) | S: 0; `cli.test.js`: the same kanban test fails |
| 2 T-023 quoting guard removed from the dump (`parseScalar(s) !== s`) | **402** (C1); 0 on C2 | — |
| 2p (extra) T-023 parse half removed (`0013` → 13) | 1,070 (C1) | — |
| 3 `check()` order reversed | **2** (C2), **4** (C4) | — |

  Why mutant 1 shows nothing on the corpus: the only title with an astral character (🔄, in *Keep a relocated
  task's `🔄 In progress`…*) has it at character 31, past the kanban's 25-character cut, and no padded column
  (`task list`, `sprint list`) ever holds one. Why mutant 2 shows nothing on C2: in `a1592dc` the `0013` labels
  are kept by the parse half of T-023, not by the dump guard; the dump guard bites on other real field values (C1).

### Part S — the earlier harnesses re-run against the final `board/` (copied; additions: 600 s + SIGKILL
on each child, `-B`, fresh paths, and `serve` / `mcp` steps removed)

| Task | Harness | Result now | Recorded final |
|---|---|---|---|
| 0417 | `verify417` (cases byte-identical to the saved set) | 3,090 results, 0 differences | 3,090, 0 |
| 0418 | `finalverify418` (programs byte-identical) | 1,000 / 1,000 identical; fixed 9 / 10, `folders` 5 diffs | same: `folders` 5 diffs (G5, synthetic ids past 2^53; accepted residual) |
| 0419/0420 | `b420/scripts` (programs byte-identical) | rand 1,000 / 1,000; gen419 400 / 400; fixed-0419 18 / 18; fixed-0420 11 / 11 | 0420: 351 / 400, 16 / 18, 10 / 11 (trigger 1); after 0422's guard 400 / 400 and 18 / 18 — **closer, as expected** |
| 0421 | `verify421` seeds 421 / 2026 / 7777 + 2 COLUMNS sweeps | 11,938 / 5,030 / 5,849 / 7,236 / 12,450 steps, **0 mismatches**; both-crashed 14 / 4 / 4 / 0 / 0 (G6) | 0 mismatches; 14 / 4 / 4 both-crashed |
| 0422 | `verify422/probe` (569 groups, 1,205 requests) | 1 status / 70 body / 3 header / 32 tree; output identical line for line to 0422's last re-verify (ports masked) | 1 / 70 / 3 / 32 |

- 0422 classified by script (`classify422.mjs`): status 1 G3; bodies 53 G1 + 16 G2 + 1 G3; headers 3 G3; trees
  32 G1. **0 unclassified.** Same split as 0422 recorded (44 float + 9 float type name, 16 `normalizeStatus`
  wording, 1 parser).
- `serve` / `mcp` steps removed for safety (all were `-h` / argument-error forms): 0421 seed 421: 44, 2026: 17,
  7777: 22, own sweep: 536, builder sweep: 600. Not run on either side, so the step counts are below 0421's.
- No new or unclassified difference; no class count above its recorded final.

### Test mapping (Verification 2) — 64 / 64

aiboard `a1592dc`: 48 (`test_board.py`: ModelTests 9, BoardTests 32, InstructionsTests 2, CliTests 5) + 6
(`test_server.py`) + 10 (`test_mcp.py`) = **64** (62 at `0108027` + the 2 T-023 tests). **54 ported, all passing
by name** in `node --test --test-reporter=tap test/board/*.test.js`; **10 MCP → `0468`** (owner ruling
2026-09-30); **0 missing**. `test/board/` holds 88 tests in 6 files: 54 ports + 34 fkit-only.

| aiboard file | class | test | node:test port | result |
|---|---|---|---|---|
| test_board.py | ModelTests | `test_front_matter_roundtrip` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_front_matter_inline_list_and_missing` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_zero_padded_digits_roundtrip_byte_identical` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_hostile_scalars_roundtrip` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_quotes_and_backslashes_roundtrip` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_ids_and_statuses` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_priorities` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_rank_defaults_to_id_order` | `model.test.js` | pass |
| test_board.py | ModelTests | `test_worklog_parse` | `model.test.js` | pass |
| test_board.py | BoardTests | `test_requires_init` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_critical_priority_and_urgent_alias` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_hand_edited_urgent_reads_as_critical` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_new_tasks_join_the_bottom_and_critical_ones_the_top` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_rank_top_bottom_before_after` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_a_move_rewrites_only_the_moved_task` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_rank_respaces_when_a_gap_runs_out` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_rank_validation` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_rank_survives_status_changes_and_orders_every_view` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_raising_to_critical_moves_to_the_top_once` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_ranking_does_not_touch_updated` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_boards_without_ranks_keep_id_order` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_check_reports_a_malformed_rank` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_create_and_move_task` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_log_appends` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_sprint_membership_stays_in_sync` | `sprints.test.js` | pass |
| test_board.py | BoardTests | `test_move_sprint` | `sprints.test.js` | pass |
| test_board.py | BoardTests | `test_check_detects_inconsistency` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_quoted_title_survives_store` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_check_detects_and_fixes_stale_sprint_list` | `sprints.test.js` | pass |
| test_board.py | BoardTests | `test_hand_made_task_is_readable` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_assign_logs` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_parallel_writers_get_unique_ids` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_init_writes_config_and_discovery_walks_up` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_pointer_file_discovery` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_dependencies` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_start_is_an_atomic_claim` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_assign_refuses_to_steal_without_force` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_parallel_start_has_exactly_one_winner` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_comments_and_stale_detection` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_not_found` | `store.test.js` | pass |
| test_board.py | BoardTests | `test_snapshot_shape` | `store.test.js` | pass |
| test_board.py | InstructionsTests | `test_install_block_is_idempotent` | `cli.test.js` | pass |
| test_board.py | InstructionsTests | `test_block_tells_agents_to_take_work_from_the_top` | `cli.test.js` | pass |
| test_board.py | CliTests | `test_full_flow` | `cli.test.js` | pass |
| test_board.py | CliTests | `test_argparse_errors_are_json` | `cli.test.js` | pass |
| test_board.py | CliTests | `test_critical_priority_via_cli` | `cli.test.js` | pass |
| test_board.py | CliTests | `test_task_rank_via_cli` | `cli.test.js` | pass |
| test_board.py | CliTests | `test_board_truncates_with_ellipsis` | `cli.test.js` | pass |
| test_server.py | ServerTests | `test_critical_priority` | `server.test.js` | pass |
| test_server.py | ServerTests | `test_rank_endpoint` | `server.test.js` | pass |
| test_server.py | ServerTests | `test_index_and_board` | `server.test.js` | pass |
| test_server.py | ServerTests | `test_write_flow` | `server.test.js` | pass |
| test_server.py | ServerTests | `test_errors` | `server.test.js` | pass |
| test_server.py | ServerTests | `test_read_only` | `server.test.js` | pass |
| test_mcp.py | McpTests | `test_handshake_and_tool_list` | → `0468` | — |
| test_mcp.py | McpTests | `test_critical_priority` | → `0468` | — |
| test_mcp.py | McpTests | `test_rank_task` | → `0468` | — |
| test_mcp.py | McpTests | `test_full_loop_through_tools` | → `0468` | — |
| test_mcp.py | McpTests | `test_dependencies` | → `0468` | — |
| test_mcp.py | McpTests | `test_start_task` | → `0468` | — |
| test_mcp.py | McpTests | `test_argument_aliases_and_unknown_arguments` | → `0468` | — |
| test_mcp.py | McpTests | `test_comments` | → `0468` | — |
| test_mcp.py | McpTests | `test_errors` | → `0468` | — |
| test_mcp.py | McpTests | `test_stdio_framing` | → `0468` | — |

### Checks (Verification 3)

- **`npm test`** (`test/*.test.js` + `test/board/*.test.js`): exit 0 — 933 tests, 932 pass, 0 fail, 1 skipped (the
  opt-in `FKIT_BOARD_BENCH=1` benchmark); **72 s wall** (budget 120 s; load ~2.0, run after the harness ended).
  `0284/term-ignored` passed (6.3 s).
- **T-021 / T-022 alone:** `node --test test/board/snapshot-index.test.js test/board/server.test.js` — 21 tests,
  20 pass, 1 skipped (benchmark). By name: *snapshot scans the tree a fixed number of times … (aiboard T-021)*,
  *snapshot sprint progress is unchanged by the index …*, *T-022 reproduction: a page on another site closing a
  task is refused*, *every write endpoint refuses a cross-site write …*, *writes from the page, from agents and
  from IP-literal hosts still work*, the 6 `ServerTests` — all ✔.
- **Benchmark (informational, `FKIT_BOARD_BENCH=1`):** pass; n = 540: old 459.9 ms, new 73.2 ms (6.3×); n = 800:
  935.0 vs 108.6 ms (8.6×).
- **Skipped:** `npm run test:prove-red`, `npm run test:release` — no file in their rows touched. Skipped is not
  passed.

### Safety (before / after)

- Identical before and after: sha256 of every file under `ai-agents/tasks` and `ai-agents/sprints` (1,169
  files); `git status --porcelain --untracked-files=all` (71 lines); fkit `HEAD`; aiboard `git status
  --porcelain` (empty) and `HEAD` (`784e0ca`); the `board/` and `test/board/` manifests. The after-snapshot was
  taken before this worklog was written.
- No `.aiboard.lock*`, `aiboard.json` or `__pycache__` in either repo, except aiboard's own pre-existing ones
  (`.aiboard.lock`, empty, gitignored, dated 2026-09-13, unchanged; `aiboard.json` tracked).
- Temp folders: `p423-*` removed; this run's 3 `fkit-proj-*` (from `npm test`'s `test/harness.mjs`) removed —
  1,071 before, 1,071 after. No other new folder in the temp dir. No harness, server or Python process left.
- No browser opened; `serve` / `mcp` never run by the harness. (`npm test`'s own *serve from the command line*
  test ran, as in every `npm test`.)

### Timings (information only, T-021; per side, seconds)

C2: Python 241 / 279, Node 136 / 170 (H / W). C4: Python 235 / 267, Node 78 / 94. C5: Python 27 / 28, Node
12 / 13. C6 CLI: Python 88 / 101, Node 54 / 59. C6 POSTs: Python 18 / 21, Node 10 / 12. C1 < 1 s each side.

### Forward notes

- **`0539`** *(amended 2026-10-23, review round 1, R3)*: the scripts were throwaway (owner Q1) and lived in an
  ephemeral session scratchpad, so `0539` cannot reuse them. It **rebuilds C5** from plan §3 *C5* plus this
  worklog (generator rules, normalization, the C5 request set: `/`, `/api/board`, `/api/check`, every
  `/api/tasks/<id>`, every `/api/sprints/<id>`, Host `127.0.0.1:<port>` and `localhost:<port>`, plus 5
  `Host: evil.example` GETs per board). Its comparator must add an explicit **G9** matcher that covers **only
  GETs whose Host is foreign** (Node 403 with the read-refusal text, Python 200), and must treat **any 403 on
  a local-Host request as unclassified**. Baseline today: the foreign-Host GETs are 200 on both sides, bodies
  equal.
- **Inherited reference gap, unchanged:** a `None` / empty-string block-list item is dropped on read in `a1592dc`;
  the port matches it, so 0 differences here **match** that gap — they do not fix it.
- **Coverage note:** the corpus has no astral character early in a title or in a padded column, so it cannot
  exercise code-point counting (ADR-052 risk 3); that is covered by 0421's harness and `cli.test.js` (above).

### Decision log (calls made without asking)

1. **C3 key clash → `fkit_<key>`.** The plan says every phase-1 field goes in as an extra string field; four keys
   (`id`, `priority`, `sprint`, `status`) are aiboard's own and would have replaced the task's real id/status or
   broken every read. Renamed with a `fkit_` prefix, the same on both sides. Why: keeps the plan's intent (reads
   of real text), mechanical, both sides read the same bytes.
2. **Read-step "no write" check by stat signature** (size, mtime_ns, inode per file) after every step, plus the
   full content hash every 20 steps and at the end — not a full content hash per step (≈ 3 GB of reads). Any
   write changes the signature. Inside §3 C4's intent.
3. **`--assignee=<value>` and `-- <title>` forms** in the generator, so an owner value or title starting with `-`
   could not be read as an option (none did). Same argv on both sides.
4. **Mutant 1 run on two spots (1, 1b) and mutant 2 on both T-023 halves (2, 2p)**, and mutant 1 also through
   0421's harness and `cli.test.js`: to show whether the miss is the corpus or the harness. Extra evidence only;
   the gate question is left to the owner.
5. **Part S: `serve` / `mcp` steps removed** from 0421's programs (caller's hard rule: never run them), counts
   above. **0422 probe classified by `classify422.mjs`**, which adds a second G1 form: the request carries a float
   literal and Python's own spelling of it shows in its output (slug `1-0`, `"1.0"` vs `1`). Without it, 5 bodies
   and 4 trees matched no rule although 0422's Verify had put them under float text. *(Review round 1, R2: as
   written this rule was not tied to the value that differs — group-wide for trees. Replaced with a
   value-tied rule; same counts. See the 2026-10-23 Process-review entry.)*
6. **Python T-023 tests run by a 10-line runner** (`t023.py`) that puts the extract on `sys.path`, because
   `python3 -I -m unittest` does not add the cwd to the path.
7. **The phase-1 anchor also run on corpus W** (542 / 2,890, 0 failures), not only on H.

Fixes applied without asking: **none** (no source change).

### Open decision (for the owner)

Plan §5 (4) says each of the 3 mutants must make the **corpus** harness report at least 1 difference. Mutants 2
(402) and 3 (2 + 4) do. **Mutant 1 (UTF-16 counting) does not: 0 on C2 and C4**, because no real title puts an
emoji inside the 25-character kanban cut. The same mutant is caught by part S (0421's harness, 2 mismatches) and
by `test/board/cli.test.js`. The port shows **0 differences on the corpus** in every part. Gate verdict not
written until the owner rules.

## 2026-10-23 — fkit-coder (Build continuation: owner ruling on control 1, spawned by fkit-sprint-ship-loop / fkit-lead)

Owner ruling on the open decision above, relayed by `fkit-lead`: selected, verbatim, *"Pass, with a note
(Recommended)"* — option description shown: *"Record PASS. The work log notes the emoji bug is caught by the
earlier check and the board's own test instead. No extra work."* — `AskUserQuestion`, `fkit-lead` session,
2026-10-22/23 (answered around midnight). No harness re-run, no source change, no commit, no push; this worklog
is the only write.

### Gate verdict (ADR-052 D9, phase 2)

**PASS.** Plan §5: (1) C1–C6 on corpus H and W, 0 unclassified differences (raw 0) ✔; (2) no classified
difference on C1–C6, G5 not hit on real data ✔; (3) part S, 0 unclassified, no class count above its recorded
final ✔; (4) self-runs 0 differences; mutants 2 and 3 fire on the corpus; **mutant 1 — owner-ruled note:** it
cannot be triggered on fkit's corpus (the only emoji in any title sits at character 31, past the kanban's
25-character card cut, and no padded column holds one), and it is caught instead by part S (0421's harness,
2 mismatches) and by `test/board/cli.test.js` (*the kanban view counts characters as Python does* fails) ✔;
(5) safety before / after identical ✔; (6) `npm test` green, T-021 and T-022 tests pass by name ✔; (7) mapping
64 / 64 ✔.

A met gate means phase 3 **may be put to** the owner. It starts nothing (ADR-052 D9).

### Decision log (continuation)

- **Control 1 recorded as met by note**, not by a corpus difference — answers the *Open decision* above. Why: the
  owner's ruling, quoted with date and channel above. No obvious-winner call made; nothing else changed.

## 2026-10-23 — fkit-coder (Verify worker, read-only, spawned by fkit-sprint-ship-loop / fkit-lead)

**Verify: PASS on the subset re-run.** No source change, no commit, no push; this entry is the only repo write.
Own copy of the harness in `<scratchpad>/v423/scripts/` (copied from `p423/scripts/`; one edit: `orch.mjs`
temp prefix `p423-` → `v423-`), own `out/`, fresh aiboard `a1592dc` extract (`aiboard` + `tests`, 12 / 12 blobs
match `git ls-tree`).

- **Harness hashes:** all 12 sha256s in `p423/scripts/` match the worklog's prefixes; `fkit_corpus_check.py` =
  `git show cb742bb:…` (blob `4ec69aba`). `board/` + `test/board/` manifest matches the worklog, unchanged
  start to end.
- **Fresh corpus H** (`git archive 32c0f36:ai-agents tasks sprints` into `realpath(tmpdir())/v423-*`): manifest
  `39f064e5…`, 1,141 files, byte-identical to the Build's. Gen: 535 briefs, 538 / 2,870 phase-1, 0 links skipped.
- **C1:** 1,120 docs, 5,600 values, `RESULT c1: raw 0, classified {}, unclassified 0`. Anchor
  `fkit_corpus_check.py`: `files=538 fields=2870`, 0 / 0 / 0 failures.
- **C5** (C2 board built by Python, 263 s; C3 board from gen): `server: 6 groups, 2222 requests, statuses
  {"200":2222}, retries py 0 js 0` — `RESULT server: raw 0, classified {}, unclassified 0`.
- **Mutant 3** (own recipe: `store.mjs:1051` `return problems;` → `return problems.slice().reverse();`, scratch
  copy under the temp dir): C5 raw 6 (every `/api/check` body; 1 loopback retry, ruling B); C2 raw 2 (`check`,
  `check --json` stdout) — same as the Build's 2. The other 566 C2 steps and the final tree (1,655 entries, 0
  differ) matched Python with the mutant, which only reorders `check`.
- **Mapping:** `aiboard tests 64 = ported 54 (passing 54) + MCP→0468 10 + missing 0`; output identical to the
  Build's `mapping.md`.
- **`npm test`:** exit 0, 933 / 932 pass / 0 fail / 1 skipped, **97 s** wall (load 4–7; Build had 72 s at ~2);
  `0284/term-ignored` ✔ 6.5 s; T-021 and T-022 tests ✔ by name.
- **Not re-run:** C2 Node-unmutated as its own run, C4, C6, part S, self-runs, mutants 1 / 2, corpus W — bounded
  subset by the caller's brief; the Build's numbers for those are not independently checked here.
- **Safety:** before / after identical — fkit `HEAD`, aiboard status (empty) and `HEAD` `784e0ca`, `board/` +
  `test/board/` manifests. The `tasks` + `sprints` manifest and `git status` differ by one file only:
  `0423-…/review.md` (new, mtime 14:22:16), written by the concurrent reviewer, not by this run. No new
  `__pycache__` / lock / `aiboard.json` (aiboard's own pre-existing ones unchanged); my `v423-*` and this run's 3
  `fkit-proj-*` removed (1,071 before, 1,071 after); no harness / Python / server process of mine left.
- **Leftover from the Build (not removed):** 4 `zsh` wait loops (PIDs 63764, 64063, 70705, 73339, started
  2026-10-22 23:14–23:36) running `until ! pgrep -f "orch.mjs"…` — the pattern matches the loop's own command
  line, so they never exit. Idle pollers, not harness processes.

Fixes applied without asking: none (read-only).

## 2026-10-23 — fkit-coder (Process-review worker, review round 1, spawned by fkit-sprint-ship-loop / fkit-lead)

Ran `fkit-process-stateful-review` on `review.md` round 1 (R1–R4) under the declared-approval marker (approved
`plan.md` blob `86f76a41…`, owner approval *"Approve, scripts throwaway (Recommended)"*, 2026-10-22,
`AskUserQuestion`, `fkit-lead` session). No source, test or brief change; no commit, no push. Repo writes:
this worklog and the *Coder response* rows of `review.md`. Harness changes are in the scratchpad only.

**Result: gate verdict unchanged (PASS).** All four findings are real but low: none changes a number,
because every C1–C6 comparison is raw 0, so the classifier was never asked to forgive anything.

### What changed (scratchpad only; originals kept read-only in `<scratchpad>/p423/scripts-r0/`)

- **`compare.mjs`** `8ba1ad6d…` → `709b148b…` (R1):
  - CLI G1 needs stdout to actually differ, and the same tree; a tree-only difference is now unclassified.
  - Server G1 needs the body to differ and the same reason, Content-Type and Cache-Control; a header-only
    difference is now unclassified.
  - G4 needs the request (from the spec): a POST that is foreign-Host, cross-site (Origin not the Host) or
    non-JSON, refused 403/415 with one of T-022's three exact messages, Node's group tree unchanged. A 403
    on a local GET (body mentioning "localhost") is now unclassified.
  - No response on both sides is now recorded, as unclassified.
  - Exit 1 when anything is unclassified (2 on an unknown mode); it was always 0.
  - Checked with synthetic inputs (`<scratchpad>/p423/r1-synth/`): the reviewer's four cases (tree-only CLI
    difference, Content-Type-only, local-GET 403 saying "localhost", no response both sides) are all
    `UNCLASSIFIED` now, exit 1; the old script filed them `G1` / `G4`, exit 0. A real float body and a real
    T-022 foreign-Host POST refusal are still `G1` / `G4`.
- **`classify422.mjs`** `6fa9e498…` → `057f83b2…` (R2): the second G1 form is now tied to the differing value.
  Python's text, with **only the request's own float literals** (Python spelling, maybe quoted, or its slug)
  swapped for JS's spelling (maybe quoted) or slug **at those positions**, must equal Node's text exactly —
  per body, and over the whole sorted tree. It no longer passes a group because a float spelling shows up
  somewhere. Synthetic check: a request with a float plus an unrelated difference (priority, rank) was `G1`
  before, `UNCLASSIFIED` now.
  - On 0422's saved probe: **same split as before**, `{"status G3":1,"body G3":1,"header G3":2,
    "header(length) G3":1,"body G1":53,"tree G1":32,"body G2":16}` (saved as `sweep/0422/classified-r1.txt`,
    byte-identical to `classified.txt`). The items only this rule covers — measured by running the old script with the rule removed: **11, 5 bodies and 6 trees** (the Build's item 5 and R2 say 4 trees; 6 is the measured count) — one by one: bodies — `POST
    /api/tasks {"title": 1.0}` (`"1.0"` vs `"1"`), `{"title": "t", "assignee": 1.0}` (`"1.0"` vs `1`), `POST
    /api/sprints {"title": 1.0}` (title + folder `S-002-1-0` vs `S-002-1`), `{"start": 1.0}`, `{"end": 1.0}`;
    trees — `T-004-1-0` vs `T-004-1`, `T-004-1e-07` vs `T-004-1e-7`, `S-002-1-0` vs `S-002-1`,
    `S-002-1e-07` vs `S-002-1e-7`, and `assignee: 1.0` vs `assignee: "1"`, `goal: 1.0` vs `goal: "1"`. All
    float spelling.

### Harness output, pasted (R4)

The Build's own comparator stdout was not saved to a file, so these lines come from the **fixed**
`compare.mjs` re-run on the Build's **saved raw outputs** (`<scratchpad>/p423/out/`, unchanged; saved as
`out/r1-compare/*.txt`). No side was re-run. Every number matches the Results table above.

```
head-c1      c1: 1120 docs, 5600 values compared
             RESULT c1: raw 0, classified {}, unclassified 0
head-c2      cli: 568 steps, 0 with a crash, exit codes {"0":566,"1":2}, read steps that wrote: 0, final-tree entries 1655, differing 0
             RESULT cli: raw 0, classified {}, unclassified 0
head-c4      cli: 2424 steps, 0 with a crash, exit codes {"0":2420,"1":4}, read steps that wrote: 0, final-tree entries 2774, differing 0
             RESULT cli: raw 0, classified {}, unclassified 0
head-c5      server: 6 groups, 2222 requests, statuses {"200":2222}, retries py 0 js 0
             RESULT server: raw 0, classified {}, unclassified 0
head-c6cli   cli: 567 steps, 0 with a crash, exit codes {"0":564,"1":3}, read steps that wrote: 0, final-tree entries 1715, differing 0
             RESULT cli: raw 0, classified {}, unclassified 0
head-c6srv   server: 22 groups, 176 requests, statuses {"200":176}, retries py 0 js 0
             RESULT server: raw 0, classified {}, unclassified 0
wt-c1        c1: 1146 docs, 5730 values compared
             RESULT c1: raw 0, classified {}, unclassified 0
wt-c2        cli: 572 steps, 0 with a crash, exit codes {"0":570,"1":2}, read steps that wrote: 0, final-tree entries 1667, differing 0
             RESULT cli: raw 0, classified {}, unclassified 0
wt-c4        cli: 2440 steps, 0 with a crash, exit codes {"0":2436,"1":4}, read steps that wrote: 0, final-tree entries 2794, differing 0
             RESULT cli: raw 0, classified {}, unclassified 0
wt-c5        server: 6 groups, 2238 requests, statuses {"200":2238}, retries py 0 js 0
             RESULT server: raw 0, classified {}, unclassified 0
wt-c6cli     cli: 572 steps, 0 with a crash, exit codes {"0":569,"1":3}, read steps that wrote: 0, final-tree entries 1727, differing 0
             RESULT cli: raw 0, classified {}, unclassified 0
wt-c6srv     server: 22 groups, 176 requests, statuses {"200":176}, retries py 0 js 0
             RESULT server: raw 0, classified {}, unclassified 0
self-runs    head/wt × C2/C4 × py-py/js-js (8): each RESULT cli: raw 0, classified {}, unclassified 0
mut1a        C1 raw 0 · C2 raw 0 · C4 raw 0
mut1b        C1 raw 0 · C2 raw 0 · C4 raw 0
mut2         C1 RESULT c1: raw 402, classified {}, unclassified 402 · C2 raw 0
mut2p        C1 RESULT c1: raw 1070, classified {}, unclassified 1070
mut3         C1 raw 0 · C2 RESULT cli: raw 2, classified {}, unclassified 2 · C4 RESULT cli: raw 4, classified {}, unclassified 4
anchor head  files=538 fields=2870 / raw read failures=0 / field round-trip failures=0 / byte (write/read/write) failures=0
anchor wt    files=542 fields=2890 / raw read failures=0 / field round-trip failures=0 / byte (write/read/write) failures=0
```

Exit codes: 0 for every gate and self-run comparison; 1 for mut2, mut2p, mut3 (they have unclassified
differences, as a mutant should).

### Not re-run

No Python or Node side, no part S harness other than re-classifying 0422's saved probe, no `npm test` (no
source or test touched). Safety after: no harness / Python / server process left, no `p423-*` temp dir,
aiboard `git status` empty and `HEAD` `784e0ca`, no write under fkit's `ai-agents/` except this worklog and
`review.md`.

### Housekeeping

- On 2026-10-23 the driver (`fkit-lead`) killed the 4 leftover `zsh` wait loops from the Build (PIDs 63764,
  64063, 70705, 73339), the ones the Verify entry lists. Cause: their `until ! pgrep -f "orch.mjs"` pattern
  matched the loop's own command line, so they never ended.

### Decision log (round 1, calls made without asking)

1. **R1 → `compare.mjs` tightened** (changes above). Qualified: verified `CORRECT` by reading the script and
   re-running the reviewer's synthetic cases; mechanical and local (one scratch script, no repo file); inside
   the plan — it makes the script follow plan §4's own matcher table (G1 "makes the difference disappear",
   G4 "on a cross-site, foreign-Host or non-JSON POST; Node tree untouched") and plan §5's "FAIL on any
   timeout". What is compared and the pass rule are unchanged; only the classification step was re-run on
   saved outputs, results unchanged.
2. **R2 → `classify422.mjs` second G1 rule tied to the differing value** (changes above). Qualified:
   verified `CORRECT` (the rule matched on any float spelling anywhere, group-wide for trees); mechanical,
   scratch only; inside the plan (plan §4 G1 matcher, and plan §3 S "any new or unclassified difference
   counts as a regression"). Re-classified 0422's saved probe; counts identical, the 11 items (5 bodies, 6 trees) listed above.
3. **R3 → the `0539` forward note rewritten in place** (marked "amended … R3") instead of left with a
   pointer to scripts that will not exist. Qualified: verified `CORRECT`; worklog-only; inside the plan's §9
   ("`0539` re-runs C5 with the recorded command") read together with the owner's Q1 condition (the worklog
   must let `0539` rebuild the server part).
4. **R4 → harness lines pasted above**, regenerated from saved outputs with the fixed comparator (the Build's
   original stdout was not kept). Qualified: verified `CORRECT` (brief Verification 1 and plan §9 say
   paste); worklog-only; in-plan.
5. **Earlier entries amended in place, with a marker,** at R2 (decision log item 5), R3 (forward note) and R4
   (pointer under *Results*), so a reader of those sections is sent here. The Verify entry was not touched.
