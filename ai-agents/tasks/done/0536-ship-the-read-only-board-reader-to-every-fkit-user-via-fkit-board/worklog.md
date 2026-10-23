# Worklog — 0536 Ship the read-only board reader to every fkit user via `fkit board`

## 2026-10-20 — Build (fkit-coder, spawned Build worker under fkit-sprint-ship-loop, driven by fkit-lead)

Marker: owner approved plan.md (blob `bc084cfd…`, 19,819 bytes, both re-checked this turn) via
AskUserQuestion on 2026-10-20 in the fkit-lead session, option "Approve, no new test (Recommended)".
So Q1 = A: no new test file and no new test case. Choices (a)–(d) were accepted with the plan.

Built exactly plan.md steps 1–5:
- `vendor/aiboard/index.html` + `LICENSE`, copied with `git cat-file blob` from aiboard
  `a1592dcdf1b63803fb2fb4d33ecf9081c75a6f51`. sha256 `3b32c9e8…0dc6`, 33,899 bytes (both checked).
  Plus `vendor/aiboard/README.md` (provenance).
- `bin/fkit-board.mjs`:
  - `home` = the folder above `bin/`;
  - `resolveRoot` reads the cwd when no `--root` is given (`how: 'cwd'`, with a clear error that
    exits 2);
  - `foreign` compares realpaths;
  - `resolveAiboard` order: `--aiboard` → `FKIT_AIBOARD` → `vendor/aiboard/index.html`
    (`how: 'vendored'`). The sibling rung is removed;
  - `findRoot` is kept exported and unchanged for `board-narrow.mjs`;
  - the comments this made wrong are fixed.
- `install.sh`: clears and then copies `bin/fkit-board.mjs` + `vendor/aiboard/`, only when the
  source has both. Adds an optional-Node heads-up.
- `claude/fkit-claude.sh`: a `board` route before update/setup/help/menu, with a no-Node message
  (exit 1) and a missing-reader message (exit 1). Also the `--help` line and the "not a role"
  wording. It adds no `^  exit 2$` line.
- Docs: `docs/board.md` (rewritten), `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md` Unreleased.

Quick checks run while building (the full Verify is a separate spawn):
- fixture install made with the real `install.sh` from a tarball of the working tree (stub
  curl/git) shows `bin/fkit-board.mjs` and `vendor/aiboard/{index.html,LICENSE,README.md}`;
- `fkit board --port 0` in a fixture project, update check left on:
  - `/` sha256 equals the copy;
  - `/api/board` 200, `read_only: true`, root = the fixture;
  - `(vendored)`; `/api/check ok: true`;
  - 405 for POST/PUT/PATCH/DELETE on `/` and `/api/board`;
  - zero curl/git calls; the fixture hash is unchanged with no new files;
  - after the kill, the port refuses connections;
- `--bench` exits 0. A folder with no `ai-agents/` gets the message and exit 2.
  `--aiboard /nonexistent` exits 2. `FKIT_AIBOARD` wins `(FKIT_AIBOARD)`;
- no node on PATH: `fkit board` gives the message and exit 1, with no `.fkit/`.
  `fkit producer` still launches the stub claude with `--agent fkit-producer`;
- checkout:
  - `npm run board -- --bench` OK;
  - `npm run board -- --port 0` serves the repo's `ai-agents` `(vendored)`;
  - `board-narrow.mjs --from ai-agents/sprints/backlog.md` renders;
- `npm test`: 845/845 pass (79.5 s). `npm run test:prove-red`: hard gate PASSED.
- `git status --porcelain` is unchanged by the verification runs.

Not done here: a browser check, and the real network install from `main` (it cannot be run before
a push). Both are as the plan says.

Note: two `node bin/fkit-board.mjs --root …` servers on ports 9001/9002 were already running
(started 2026-10-13 and 2026-10-19, not by this session). They were left untouched.

## Decision log

Each entry below is a choice made without asking. Each one fixes the wording of a comment, a message
or a doc in a way the plan did not list line by line. None is a fix to a review finding (this is
Build, not Process-review).

1. **Header comment in `bin/fkit-board.mjs`.** Rewritten as the plan said (lines 33–36), and the
   `(task 0412)` reference dropped. Why it qualified: code-comments.md says no history in comments.
   This is an obvious winner within the plan's "fix comments made wrong".
2. **The `main()` comment on `--root=`/a bare `--root`** used to say they would "silently serve fkit's
   OWN tree". It now says "serve the current folder instead". Why it qualified: the plan's `resolveRoot`
   change made that comment false, and code-comments.md requires fixing such a comment in the same
   edit. Localized. The user-facing message "fkit-board does not fall back to its own tree" is still
   true, so it was left as is.
3. **The `resolveRoot` doc comment** changed "an EXPLICIT path that does not resolve is an ERROR" to
   "a path …", because the cwd case now errors too. It also states the no-walk-up reason (plan,
   Edge cases). Comment only.
4. **`resolveAiboard` error text.** The header line became "It serves aiboard's web/index.html,
   chosen in this order:", and rung 3 reads "fkit's own copy <path>". The missing-copy reason names a
   broken install and `fkit update`, as the plan's step 2 requires. Wording only.
5. **`install.sh` prerequisites comment.** It now also mentions Node, to go with the heads-up the plan
   adds (choice d). Comment only.
6. **Doc wording** in README / docs/board.md / CONTRIBUTING / CHANGELOG, written to the plan's
   step-5 bullets:
   - docs/board.md also says `fkit board` does not touch `.claude/` or `.fkit/`, which the no-Node
     and fixture-hash checks showed;
   - it also says the `note` line appears in every fkit project (the plan's Edge cases);
   - the CHANGELOG line adds "Existing installs get it with `fkit update`" (the plan's "older
     installs" edge case).

## 2026-10-20 — Verify (fkit-coder, spawned VERIFY worker under fkit-sprint-ship-loop, driven by fkit-lead)

Read-only on source; re-ran everything independently. Result: **pass**.
- Syntax: `node --check bin/fkit-board.mjs`, `sh -n` + `bash -n` on `install.sh` / `claude/fkit-claude.sh` — OK.
- Copy: `vendor/aiboard/index.html` sha256 `3b32c9e8…0dc6`, 33,899 bytes, equals aiboard `a1592dc` blob; `LICENSE` byte-identical.
- Fixture install (real `install.sh`, local tarball, stub curl/git): share holds `bin/fkit-board.mjs` + `vendor/aiboard/{index.html,LICENSE,README.md}`, identical to the tree. Install from a ref without the reader removes the old copy. No-Node install prints the optional heads-up.
- Installed `fkit board --port 0` in a fixture project (update check on): `/` 200 + sha matches; `/api/board` 200, `read_only:true`, root = fixture; `(vendored)`; `/api/check ok`; 405 ×8 (POST/PUT/PATCH/DELETE on `/`, `/api/board`); 0 curl/git calls; fixture file-hash unchanged, no new files; port refused after process-group kill.
- `--bench` exit 0. No `ai-agents/` / subfolder → message, exit 2. `--root ""` exit 2. `--aiboard`/`FKIT_AIBOARD` bad path exit 2; valid `FKIT_AIBOARD` served `(FKIT_AIBOARD)`; `--root ../proj` works. Missing reader → launcher message exit 1; missing page → "install looks broken" exit 2.
- No Node on PATH (asserted): `fkit board` → Node message, exit 1, tree unchanged; `fkit producer` still execs stub claude `--agent fkit-producer`.
- Checkout: `npm run board -- --bench` OK; `npm run board -- --port 0` serves repo `ai-agents` `(vendored)`, read-only; `board-narrow.mjs --from …backlog.md` renders (exit 0, ~15 s under load; a first 30 s-bounded try timed out while npm test ran in parallel — slowness, not a failure).
- `npm test` 845/845 pass (81.6 s). `npm run test:prove-red` hard gate PASSED (3m18s).
- Touched-doc relative links all resolve. `git status --porcelain` unchanged by the verify runs. Servers on 9001/9002 untouched.
- Skipped: `npm run test:release` (release.mjs untouched); real network install from `main` (needs a push); browser check (fetch evidence only, brief allows); shellcheck (not a project check).

## 2026-10-20 — Process review, round 1 (fkit-coder, spawned PROCESS-REVIEW worker under fkit-sprint-ship-loop, driven by fkit-lead)

Marker re-checked: plan.md blob `bc084cfd…`, 19,819 bytes; owner approval "Approve, no new test
(Recommended)" (Q1 = A, no new test). Verdicts and rows are in review.md *Coder response*.
- Applied: R1, R2, R5 (all in `bin/fkit-board.mjs`). Not applied: R3 (blocked — owner decision on the
  CLI surface), R4 (frontier, recommend won't fix; residual not recorded until the owner confirms).
- Checks: `node --check bin/fkit-board.mjs` OK; each fix re-run by its exiting path (see review.md);
  one bounded server run through a symlinked launcher path (200 / `read_only:true` / 405 / port
  refused after kill); `board-narrow.mjs --from …backlog.md` renders; `npm test` 845/845 pass (77.9 s);
  `git status --porcelain` unchanged by `npm test`. Prove-red not run: `claude/fkit-claude.sh` and the
  other prove-red-row files were not touched this round (CONTRIBUTING "What to run for a change").
  Servers on 9001/9002 untouched.

### Decision log (process review, round 1)

1. **R1 — fix applied without asking.** Finding: the main-guard compared `resolve(argv[1])` to the
   real path of `import.meta.url`, so a share path through a symlink skipped `main()` and exited 0
   silently. Changed: `isMain()` compares `realpathSync` of both, false on error
   (`bin/fkit-board.mjs`, bottom). Why it qualified: verified CORRECT (reproduced before, gone after),
   one localized guard, inside plan step 2 "make it work from an install".
2. **R2 — fix applied without asking.** Finding: `--aiboard=<path>`, a trailing bare `--aiboard`, and
   a doubled `--aiboard` silently fell back to the copied page. Changed: `main()`'s three existing
   `--root` refusals now loop over `--root` and `--aiboard`; `--root` messages byte-identical
   (re-run). Why it qualified: verified CORRECT, localized to the arg checks, and enforces plan step 2's
   own rule "an explicit path that is not a readable file is still an error, never a fall-through".
3. **R5 — fix applied without asking (obvious-winner call on scope).** Finding: an unreadable regular
   file passed `isFile`, startup succeeded, `GET /` then 500'd. Changed: `isFile` adds
   `accessSync(p, constants.R_OK)`. Why it qualified: verified CORRECT (chmod 000 → exit 2 now), a
   one-line change; pre-existing, but plan step 2 restates the "not a readable file is an error" rule
   and this task's docs/board.md promises "it exits non-zero" — so it is within the plan's intent.
4. **R4 — no change, no residual written.** Classified frontier; recommendation only. Left to the owner.
5. **R3 — no change.** Out of plan (new CLI surface). Left to the owner.

## 2026-10-20 — Process review, round 1 continued: owner rulings on R3/R4 (fkit-coder, spawned PROCESS-REVIEW worker under fkit-sprint-ship-loop, driven by fkit-lead)

Marker re-checked: plan.md blob `bc084cfd…`, 19,819 bytes; plan approval "Approve, no new test
(Recommended)" (Q1 = A). Owner rulings relayed by the lead, 2026-10-20, fkit-lead session:
- R3 — AskUserQuestion "What should `fkit board --help` (or a mistyped option) do?", selected
  "Show help (Recommended)"; extends the plan's "flags unchanged" line for exactly this.
- R4 — typed reply "Accept as a known cost".

- Applied: R3 in `bin/fkit-board.mjs` (§ CLI) + one docs/board.md line pair. R4: no code change; residual
  recorded in review.md. Ledger header Status → closed-out (R1/R2/R3/R5 done, R4 accepted).
- Checks: `node --check bin/fkit-board.mjs` OK; bounded runs (5 s kill) of `--help`/`-h`/`--port 0 --help`/
  `--root /nonexistent --help` → exit 0, usage, no server; `--hepl`/`bench`/`--port=0`/`-x`/stray word →
  exit 2, usage on stderr, no server; via launcher `board --help` 0, `board --nope` 2; `--bench` exit 0
  (536 tasks); `--port 0` server start-then-kill: `/` 200, `/api/board` 200 `read_only:true`, POST 405,
  port refused after kill; `board-narrow.mjs` renders; `npm test` 845/845 (81.4 s); `git status
  --porcelain` unchanged by `npm test`. No test added (Q1 = A). Prove-red not run: `claude/fkit-claude.sh`
  not touched this round. Servers on 9001/9002 untouched; no other node listener left.

### Decision log (process review, round 1 continued)

1. **R3 — fix applied under the owner's ruling.** Finding: `fkit board --help` or a mistyped option was
   ignored and a blocking server started. Changed: `--help`/`-h` prints usage, exit 0, checked first;
   any other argument not in `--root <v>` / `--port <v>` / `--aiboard <v>` / `--bench` prints
   `unknown argument "<x>".` + usage on stderr, exit 2 — after the R2 refusals, so their messages are
   unchanged. Why it qualified: the owner's ruling "Show help (Recommended)" names exactly this behaviour;
   verified by the bounded runs above.
2. **R3 — obvious-winner call: a stray non-flag word is refused too**, not only an unknown `--flag`
   (e.g. `fkit board bench`). Why it qualified: the ruling's own description says "a typo prints the same
   help with an error", and a word without dashes is the same typo; ignoring it would still start a server
   in its place, which is the bug. `--port=<n>` is refused by the same scan (it was silently ignored
   before). No other flag behaviour changed (a trailing bare `--port` still means the default, as before).
3. **R3 — the usage text names `npm run board -- [options]` for a checkout**, one line. Why: the same
   reader is run both ways (docs/board.md § Running it); wording only.
4. **R4 — no code change; Accepted residual written** with the owner's typed ruling quoted verbatim and
   the Re-raise condition the lead relayed. Coder response Status `won't fix (frontier)`.

## 2026-10-20 — Re-verify (post-review) (fkit-coder, spawned VERIFY worker under fkit-sprint-ship-loop, driven by fkit-lead)

Read-only on source; every check re-run independently. Result: **pass**.
- Unchanged since first Verify: `claude/fkit-claude.sh` and `install.sh` byte-identical (`cmp`) to the copies staged by the first Verify's fixture (`verify536/stage/`). So CONTRIBUTING's prove-red row is not hit; the changed files (`bin/fkit-board.mjs` → "anything else", `docs/board.md` → "nothing") ask for `npm test` only.
- Syntax: `node --check bin/fkit-board.mjs`; `sh -n` + `bash -n` on `install.sh`, `claude/fkit-claude.sh` — OK.
- `npm test` 845/845 pass (83.8 s); a second run under probe load 845/845 (120.6 s).
- Fixture install (real `install.sh`, tarball of the working tree, stub curl/git): exit 0; share's `bin/fkit-board.mjs`, `vendor/aiboard/{index.html,LICENSE,README.md}`, `claude/fkit-claude.sh` identical to the tree.
- Installed `fkit board --port 0` in a fixture project, process-group kill: `/` 200, sha256 `3b32c9e8…0dc6` = vendor copy; `/api/board` 200 `read_only:true`, root = fixture; `/api/check` ok; 405 ×8 (POST/PUT/PATCH/DELETE on `/`, `/api/board`); `(vendored)`; 0 curl/git calls; fixture file hashes unchanged, no new files; port refused after kill.
- R3: `--help`, `-h`, `--port 0 --help`, `--root /nonexistent -h` → exit 0, usage, no server. `--hepl`, `bench`, `--port=0`, `-x`, `--nope` → exit 2, `unknown argument` + usage on stderr, no server.
- R2: `--aiboard=/x`, bare `--aiboard`, doubled `--aiboard`, missing `--aiboard` path → exit 2, no server; `--root=`/bare `--root` messages unchanged.
- R5: `--aiboard` at a chmod-000 file → exit 2 "not a readable file".
- R1: through a symlinked share — `node <sharelink>/bin/fkit-board.mjs`, `<sharelink>/claude/fkit-claude.sh board`, and a symlinked global `fkit` — all serve (200, sha match, `read_only:true`, port refused after kill). One first try timed out at 30 s with no output while `npm test` ran in parallel; 3/3 reruns ≤1 s, and 6 runs during a second `npm test` all passed (first 20 s, rest 1–3 s) — load slowness, not a failure.
- `--bench` exit 0 (installed fixture: 1 task; checkout `npm run board -- --bench`: 536 tasks). No `ai-agents/` → message, exit 2. Checkout `npm run board -- --port 0`: repo tree, `(vendored)`, read-only, 536 tasks.
- `board-narrow.mjs --from ai-agents/sprints/backlog.md` renders, exit 0 (11 s); `--from sprint-14.md` exit 0.
- `docs/board.md` relative links resolve; its help/unknown-option lines match behaviour. `git status --porcelain` unchanged by the runs. No server left; 9001/9002 untouched.
- Skipped: `npm run test:prove-red` (no prove-red-row file changed since the first Verify, which ran it green); `npm run test:release` (release.mjs untouched); no-Node launcher path (launcher unchanged since the first Verify checked it); real network install (needs a push); browser check (fetch evidence only).

## 2026-10-20 — Process review, round 2 (fkit-coder, spawned PROCESS-REVIEW worker under fkit-sprint-ship-loop, driven by fkit-lead)

Novel: R6, R7. Loop check: neither matches the R4 residual or a re-raise clause in ADR-058/057/052. Both reproduced (3 s bounded runs) and verified CORRECT, low, defect — completions of R2/R3, not oscillation. Change: `bin/fkit-board.mjs` only. Checks: `node --check` OK; bounded CLI runs (all refusals exit 2 with no server; `--root`/`--aiboard` R2 messages byte-identical; `--help` 0, `--hepl` 2; `--bench` 536 tasks exit 0); `--port 0` start-then-kill `/` 200 sha `3b32c9e8…`, `/api/board` 200 `read_only:true`, POST 405, port refused after kill; launcher `board --port ''` → 2; `npm test` 845/845 (83.2 s), 0 failures; `git status --porcelain` unchanged by `npm test`. No test added (Q1 = A). Prove-red not run: `claude/fkit-claude.sh` not touched. Only listeners left: the owner's 9001/9002.

### Decision log (process review, round 2)

1. **R6 — fix applied without asking.** Finding: `--aiboard ""` read as "not given", vendored page served. Changed: `resolveAiboard` refuses `flag === ''` ("--aiboard was given an empty path.", exit 2 via `main`) and tests `flag !== undefined` instead of truthiness. Why it qualified: verified CORRECT; one function, two lines; in-plan — the plan's step 2 "An explicit path that is not a readable file is still an error, never a fall-through (ADR-058 D2)"; the lead's spawn named it. Empty `FKIT_AIBOARD=` deliberately left as unset (the finding excludes it).
2. **R7 — fix applied without asking.** Finding: trailing bare `--port`, `--port ""`, doubled `--port` started a server. Changed: `--port` added to R2's refusal loop (now parameterised by `<path>`/`<n>` and "a path"/"a number" — `--root`/`--aiboard` strings unchanged); the port check moved up to just after the unknown-argument scan. Why it qualified: verified CORRECT; localized to `main()`'s argument checks; inside the owner's R3 ruling ("a typo prints the same help with an error" — a mistyped option is refused) and named by the lead's spawn. Reverses round 1's decision-log item 2 ("a trailing bare `--port` still means the default"), which was my own scoping, not a ruling.
3. **R7 — obvious-winner call: digits only for `--port`.** `Number()` also read `" "` as 0 and took `0x10`/`1e3`; `/^\d+$/` refuses them with the same "must be an integer 0-65535" message (value now JSON-quoted so `""` is visible). Why it qualified: it is the "invalid values refused" half of R7 the spawn named; `--port <decimal>` behaves exactly as before.
4. **R7 — obvious-winner call: the port check now runs before `--bench`.** Moving it up with the other argument refusals means `--bench --port abc` is refused instead of ignored. Why it qualified: every other argument refusal already runs before `--bench`; leaving this one after would keep the exact "ignored typo" R7 names.
5. **Header `Status:` set to `closed-out`**: R1–R3, R5–R7 `✅ done`, R4 `won't fix (frontier)` under its residual; nothing blocking remains.

## 2026-10-20 — Final re-verify (fkit-coder, spawned VERIFY worker under fkit-sprint-ship-loop, driven by fkit-lead)

Read-only on source; every check re-run independently (fixtures: scratchpad `finalverify536/`). Result: **pass, with one test-timing failure in 1 of 3 `npm test` runs — not from this task.**
- Unchanged since the previous re-verify: whole tree `diff -rq` against `reverify536/stage/` → only `bin/fkit-board.mjs` differs (`claude/fkit-claude.sh`, `install.sh`, `docs/board.md`, `vendor/aiboard/`, the prove-red-row files and `package.json` byte-identical). So CONTRIBUTING's row for `bin/fkit-board.mjs` asks for `npm test` only.
- `node --check bin/fkit-board.mjs` OK.
- `npm test`: run 1 **844/845, 1 fail** (119.1 s; machine load avg ~18; my fixture install overlapped its first seconds) — `0284/term-ignored: a git that ignores SIGTERM is KILLed 1 s later` (`test/update-banner.test.js:504`): `AssertionError: the launcher was held 33.282s by a stalled git (ceiling 10.5s)`, `actual: false, expected: true` — the same signature as the one-off seen during review. Run 2 845/845 (79.5 s), extra run 3 845/845 (79.4 s), nothing else running. That test alone (`--test-name-pattern 0284/`): 3/3 pass on this tree (6.4–7.3 s) and 3/3 on a `git archive HEAD` copy without 0536's changes. Diagnosis: a timing test overrun under load; 0536's launcher change runs only when the first argument is `board`, and that test never passes `board`.
- Fixture install (real `install.sh`, working-tree tarball, stub curl/git): exit 0; share's `bin/fkit-board.mjs`, `vendor/aiboard/{index.html,LICENSE,README.md}`, `claude/fkit-claude.sh` identical to the tree.
- Installed `fkit board --port 0` in a fixture project, start then process-group kill: `/` 200, sha256 `3b32c9e8…0dc6` = vendor copy; `/api/board` 200 `read_only:true`, root = fixture; `/api/check` ok; 405 ×8 (POST/PUT/PATCH/DELETE on `/` and `/api/board`); `(vendored)`; 0 curl/git calls; fixture hashes unchanged; port refused after kill.
- R6/R7 (installed `fkit board` and checkout `node bin/fkit-board.mjs`): `--aiboard ""`, bare `--port`, `--port ""`, `--port=0`, doubled `--port`, `--port " "`/`abc`/`0x10`/`1e3`/`-1`/`65536`/`1.5`, `--bench --port abc`, `--port abc --bench`, `--port --bench` → all exit 2, no server. Earlier refusals (R2/R3/R5 cases) still exit 2 with messages unchanged; `--help`, `-h`, `--port 0 --help` → exit 0, usage, no server.
- `--bench` exit 0 (installed: 1 task; checkout `npm run board -- --bench`: 536 tasks). Checkout `--port 0` serves (200, sha match, `read_only:true`, 536 tasks, 405s, port refused after kill); explicit `--aiboard vendor/aiboard/index.html --port 0` serves too. No `ai-agents/` → exit 2 with message.
- `board-narrow.mjs --from ai-agents/sprints/backlog.md` and `--from sprint-14.md` render, exit 0.
- `git status --porcelain` unchanged by all runs. Only node listeners left: the owner's 9001/9002.
- Skipped: `npm run test:prove-red` (no prove-red-row file changed since the first Verify, which ran it green); `npm run test:release` (release.mjs untouched); no-Node launcher path (launcher unchanged since the first Verify checked it); real network install (needs a push); browser check (fetch evidence only).
