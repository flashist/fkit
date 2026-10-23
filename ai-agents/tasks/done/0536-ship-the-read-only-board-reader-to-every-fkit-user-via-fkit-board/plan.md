# Plan — 0536 Ship the read-only board reader to every fkit user via `fkit board`

**Planning only.** I wrote nothing, not even plan.md. No plan-review switch line was in the spawn, so the *Plan review* section was skipped. The governing decision is ADR-058, read in full. Facts I checked myself are marked (verified).

## Summary
- **Page:** aiboard's page is copied byte-for-byte to `vendor/aiboard/index.html` from aiboard commit `a1592dcdf1b63803fb2fb4d33ecf9081c75a6f51`. It is 33,899 bytes, sha256 `3b32c9e8f0311a73ab87a7de2af790534294f04af1eac25c5d757ef29b1a0dc6` (verified). The file is unchanged from `a1592dc` to aiboard HEAD `784e0ca`, and the working tree is clean (verified). aiboard's MIT `LICENSE` and a provenance README go beside it.
- **Root-finding fix (the brief's concern, verified):** today the reader starts at its own file and walks up looking for `ai-agents/`. In the install folder there is none, so it would fail. The fix splits two things:
  - **tools home**: always the folder above the reader's own `bin/`. In a checkout that is the repo root; in an install it is `$SHARE`, and `$SHARE/claude/skills/fkit-status/dashboard.sh` already ships there.
  - **data root**: `--root` if given, otherwise **the folder `fkit board` is run in**. No walking up, which matches the launcher's `proj="$PWD"`.
- **Install:** `install.sh` copies `bin/fkit-board.mjs` and `vendor/aiboard/` into the install folder, only when the fetched source has them. The existing update test's stub tarball holds only `claude/`, so an unconditional copy would turn it red (verified).
- **Launcher:** `claude/fkit-claude.sh` sends `fkit board …` to `exec node "$share/bin/fkit-board.mjs" "$@"`. This happens before the update check, setup, `--help` and the role menu, so the command writes nothing. With no `node`, it prints a message naming Node.js and exits 1. Every other path is byte-unchanged.
- **Out of scope, untouched:** task format, movers, `dashboard.sh`, hooks, any write path, aiboard's page content, `board/`.
- **Tests:** by default no new test file (ADR-057 D2.1). The checks are manual evidence plus `npm test` and `npm run test:prove-red` (the launcher changes, so CONTRIBUTING's table requires prove-red). Open question Q1 asks the owner whether to add a test.

## Step by step

### 1. Copy aiboard's page into fkit (new files)
- `vendor/aiboard/index.html` — `git -C ../aiboard cat-file blob a1592dc:aiboard/web/index.html > vendor/aiboard/index.html`. Taken from the commit, not aiboard's working tree, and `cat-file` applies no filters. Check: `shasum -a 256` must equal `3b32c9e8…0dc6`.
- `vendor/aiboard/LICENSE` — `git -C ../aiboard cat-file blob a1592dc:LICENSE`, byte-for-byte. MIT, "Copyright (c) 2026 Mark Dolbyrev" (verified).
- `vendor/aiboard/README.md` (provenance) holds:
  - source repo `flashist/aiboard`, path `aiboard/web/index.html`, full commit sha, sha256, date copied 2026-10-20;
  - "copied unmodified — do not edit; to refresh, copy again from a named commit and update this file";
  - the version-skew note: fkit's copy does not follow later aiboard changes;
  - "interim: retired by task 0467 / taken over by 0444 (ADR-058 §6)";
  - a pointer to LICENSE.
- **Why this location:** a top-level `vendor/` is the usual home for a third-party copy, and it keeps the page, licence and provenance together. It stays out of `claude/`, which is what gets copied into projects' `.claude/` and what prove-red copies. fkit has no `.gitattributes` (verified), so no line-ending conversion will touch the file.
- The page needs nothing beyond `/` and `/api/*`. It loads no external `src`/`href` and only calls `fetch(path…)` against the API (verified by grep). It hides its write controls off `state.data.read_only` (lines 215–311, verified).

### 2. `bin/fkit-board.mjs` — make it work from an install
- **Tools home:** in `main`, `const home = resolve(dirname(fileURLToPath(import.meta.url)), '..')` replaces `findRoot()`. `findDashboard(home)` is unchanged and works in both layouts.
- **Keep `findRoot` exported and unchanged.** `bin/board-narrow.mjs:34` imports `findRoot` and `findDashboard` and calls `findDashboard(findRoot())` (verified). It is repo-only, and its walk up from the file is still right in a checkout.
- **`resolveRoot({ flag, cwd = process.cwd() })`:**
  - With no flag, it no longer returns `home`. It runs the existing checks on `cwd`: is it a directory, does it have `ai-agents/tasks` and `ai-agents/sprints`, and can every board folder be listed.
  - It returns `how: 'cwd'`.
  - The error label is `--root "<x>"` or `the current directory (<cwd>)`. The cwd error adds: "Run `fkit board` in your project's folder (the one holding `ai-agents/`), or pass `--root <path>`."
  - Exit code 2, as today. Today a failure here is an uncaught stack trace; that ends.
  - The empty-string check still applies only to an explicit `--root ""`.
- **`foreign`** becomes `realpathSync(root) !== realpathSync(home)` instead of `how === '--root'`.
  - It controls the "fkit's own — the target's copy is not used" suffix, the target-copy `note` line and the `--bench` tree lines. All three describe "data is not fkit's own tree", which is now the normal installed case.
  - `realpath` because macOS `/tmp` is really `/private/tmp`.
  - The `(--root)` marker on the tree line stays keyed on `how === '--root'`.
- **`resolveAiboard({ flag, env, home })`:** order is `--aiboard`, then `FKIT_AIBOARD`, then **the copied page** `join(home, 'vendor', 'aiboard', 'index.html')` with `how: 'vendored'`.
  - The sibling `../aiboard/aiboard/web/index.html` rung is **removed**. ADR-058 D2 makes the copy the default, so a sibling rung after it could never be reached, and one before it would give a checkout a different page from users'.
  - An explicit path that is not a readable file is still an error, never a fall-through (ADR-058 D2).
  - If the copied page is missing, the message says fkit's own copy is missing (the install looks broken, `fkit update` restores it) and still names both overrides.
- **Comments made wrong, fixed in the same edit** (code-comments rule):
  - header lines 33–36: tools come from fkit, meaning the checkout or the install folder next to this file; data comes from `--root` or the folder it runs in;
  - lines 106–107: the "⛔ NOT vendored into fkit" comment becomes a 1–2-line WHY: "page copied into fkit at vendor/aiboard/ (ADR-058; provenance in its README)";
  - line 140: "No flag → `home`";
  - line 656: "`home` is fkit's own checkout";
  - line 731: "its sibling default sits next to `home`".
  - No new banner markers are added to comments; the header's ONE GRAMMAR rule still holds.
- **Unchanged:** GET-only refusal, `127.0.0.1` binding, the read-only flag, the API, `--bench`, `--port`, the dashboard probe.

### 3. `install.sh` — ship it
After the `rm -rf "$SHARE/omnigent"` line, add:
```sh
# The read-only board (ADR-058) sits beside claude/, where the reader finds dashboard.sh.
# A ref without it leaves no stale copy behind.
rm -f "$SHARE/bin/fkit-board.mjs"
rm -rf "$SHARE/vendor/aiboard"
if [ -f "$TMP/src/bin/fkit-board.mjs" ] && [ -f "$TMP/src/vendor/aiboard/index.html" ]; then
  mkdir -p "$SHARE/bin" "$SHARE/vendor"
  cp "$TMP/src/bin/fkit-board.mjs" "$SHARE/bin/fkit-board.mjs"
  cp -R "$TMP/src/vendor/aiboard" "$SHARE/vendor/aiboard"
fi
```
- It never `rm -rf`s `$SHARE/bin`, because a user may have set `FKIT_BIN` to it.
- `rm -rf` before `cp -R` stops a nested `aiboard/aiboard`.
- It uses only `rm`, `mkdir` and `cp`, which are already on the update test's sealed PATH (verified).
- `bin/board-narrow.mjs` does not ship (ADR-058 D1).
- In the prerequisites section, add a non-blocking heads-up when `node` is missing, like the Codex one: "Optional: Node.js — only `fkit board` needs it."
- The reader runs as `node <file>`, so no exec bit is needed (ADR-017 rule 2).

### 4. `claude/fkit-claude.sh` — route it
- Insert a block just before the `case "${1:-}" in update|…` (line 108). By then `$share` is set (line 29). This is after the self-host re-exec, so in a fkit checkout `fkit board` uses the checkout's own reader.
```sh
# `fkit board` (ADR-058): the project's board, read-only, served from $PWD. It runs before the update
# check, setup and the menu, so it writes nothing. Only this command needs Node.
if [ "${1:-}" = board ]; then
  shift
  command -v node >/dev/null 2>&1 || {
    echo "fkit: 'fkit board' needs Node.js, and 'node' is not on your PATH. Install it from https://nodejs.org, then run it again. Every other fkit command works without it." >&2
    exit 1; }
  [ -f "$share/bin/fkit-board.mjs" ] || { echo "fkit: install looks broken — $share/bin/fkit-board.mjs is missing. Run:  fkit update" >&2; exit 1; }
  exec node "$share/bin/fkit-board.mjs" "$@"
fi
```
- **Prove-red guard:** the block must not add a line matching `^  exit 2$`. Mutation 2's `sed` rewrites every such line (verified `test/prove-red.sh:198`), so the exits stay inline, as above.
- **`--help`:** add `fkit board            view this project's tasks and sprints in your browser, read-only (needs Node)` under *Other:*. Change "A first argument that is not a role is an error" to "…not a role (or `board` / `update`)…". Test 4 checks only exit 0 and no exec (verified).
- **Install wrapper** (`$BIN/fkit`): unchanged. It already passes `"$@"` through.

### 5. Docs
- **`docs/board.md`:**
  - title "The web board (repo-local)" becomes "The web board" (ADR-058 names this as wrong);
  - *Running it*: `fkit board` first, run in a project folder; checkout `npm run board` lines second;
  - *Finding aiboard* becomes "Which page it serves": `--aiboard`, then `FKIT_AIBOARD`, then the copy in `vendor/aiboard/` with its commit; sibling default removed;
  - the `--root` paragraph: a relative path resolves from where you run it, which under `fkit board` is your folder and under `npm run board` is the checkout; with no `--root` it reads the folder you are in and refuses if that has no `ai-agents/`;
  - *What it writes*: "the single aiboard index.html it was pointed at" becomes "the one page it serves";
  - *Not shipped* becomes "How it ships": the install folder's `bin/` and `vendor/aiboard/`, Node for this command only, read-only, interim until `0444`/`0467`.
- **`README.md`:**
  - one `fkit board` line in the *Install & run* code block;
  - the *Requires* line gains "`fkit board` alone also needs Node.js";
  - section "Web board (repo-local)" becomes "Web board", rewritten for `fkit board`;
  - the `FKIT_AIBOARD` table row "Repo-local web board only" becomes "`fkit board`: serve this aiboard `index.html` instead of fkit's copy".
- **`CONTRIBUTING.md`:**
  - "The web board" section mentions `fkit board`;
  - Layout: `bin/` line "none of these ship" changes to say `fkit-board.mjs` ships with the install; add a `vendor/aiboard/` line; `docs/board.md` loses "repo-local".
- **`CHANGELOG.md` `## Unreleased`:** one user-visible line, as CONTRIBUTING asks: "New: `fkit board` — a read-only web view of the project's tasks and sprints; needs Node".
- Links: grep every relative link I touch and check its target exists (the 0484 link check is gone from `test/`).
- `ai-agents/wiki-vault/` is not touched; ADR-058 routes ingest to fkit-wiki.

## Checks — run vs skipped
All fixtures go in the scratchpad, never in the repo. Every server run is bounded so no agent turn hangs.

- **Server driver:** `<scratchpad>/board-verify.mjs`, a scratch file, not a repo test.
  - It spawns the server `detached` with `--port 0` and reads the real port from the banner (`http://127.0.0.1:<port>/`).
  - It requests with `fetch`.
  - It always kills the **process group** (`process.kill(-pid)`) in a `finally`, with a hard 20 s timer that kills and exits non-zero.
  - It then shows a connect to that port is refused, so no server is left.
  - The process group matters for `npm run board`, where npm, sh and node are separate processes.
  - Every other check is a command that exits on its own (`--bench`, error paths).
- **Fixtures:**
  - a fixture install made by running the **real `install.sh`** against a tarball of this working tree (`claude/`, `bin/`, `vendor/`, `VERSION`). A stub `curl` serves the tarball and a stub `git` fails, so there is no network. `FKIT_SHARE` and `FKIT_BIN` point into the scratchpad.
  - a fixture project that is a `cp -R` of fkit's `ai-agents/`.
1. **Install contents:** `find "$SHARE" -maxdepth 3` must show `bin/fkit-board.mjs`, `vendor/aiboard/{index.html,LICENSE,README.md}` and `claude/…`.
2. **Serves the project it runs in:** in the fixture project, the driver runs `$BIN/fkit board --port 0` with stub `curl`/`git` logging calls and `FKIT_NO_UPDATE_CHECK` unset. It shows:
   - `/` returns 200 and its sha256 equals the copied file;
   - `/api/board` returns 200 with `"read_only":true`, and its `root` is the fixture's `ai-agents`;
   - the banner reads `(vendored)`;
   - curl/git were never called, so the update check is skipped.
   - Also `fkit board --bench` in the same folder.
   - Also `fkit board` in a folder with no `ai-agents/` gives the clear message and exit 2.
3. **No aiboard anywhere:** with `env -u FKIT_AIBOARD`, the share has no sibling aiboard and the page is still served. Also:
   - `FKIT_AIBOARD=<other file>` wins and the banner shows `(FKIT_AIBOARD)`;
   - `--aiboard /nonexistent` exits 2.
4. **No Node:** `PATH=<stubs>:/usr/bin:/bin`. On this Mac node lives only under `~/.nvm` (verified), and the run first asserts `command -v node` fails on that PATH. Then:
   - `fkit board` prints the Node message, exits 1, and leaves no `.fkit/` in the project;
   - `fkit producer` (`FKIT_NO_UPDATE_CHECK=1`, stub `claude`) still launches, and the stub records `--agent fkit-producer`. This runs in a **separate** throwaway project copy, because a role launch writes setup files.
   - Launcher and init have no `node` call (verified by grep).
5. **Read-only:**
   - POST, PUT, PATCH and DELETE on `/` and `/api/board` each return 405;
   - a sorted `find -type f` plus sha256 hash of the whole fixture project, before and after, must be identical, so it also catches **new** files such as `.fkit/`;
   - `git status --porcelain` of the fkit checkout, before and after the verification runs, must be identical.
6. **Checkout still works:** `npm run board -- --bench` in the repo, and a driver start-then-kill of `npm run board -- --port 0` showing 200, `read_only`, and a tree equal to the repo's `ai-agents`. Also `node bin/board-narrow.mjs --from ai-agents/sprints/backlog.md | head`, to prove its imports still work.
7. **Suites:**
   - `npm test`, the default suite, about 76–82 s;
   - `npm run test:prove-red`, required because `claude/fkit-claude.sh` changes, about 2.5 min, run with a 10-min timeout.
   - Also `node --check bin/fkit-board.mjs` and `sh -n install.sh claude/fkit-claude.sh`.
- **Skipped:**
  - `npm run test:release`: `bin/release.mjs` is not touched.
  - the real network install from `main`: it cannot be tested before a push. The fixture install runs the same `install.sh` against a local tarball.
  - a browser check: curl/fetch evidence only, which the brief allows.
  - shellcheck: not one of the project's checks.

## Edge cases and failure modes
- **Running in a subfolder of a project:** it refuses, naming `--root`. It does not walk up to a parent `ai-agents/`, which matches how every other fkit command treats `$PWD`. A walk-up could quietly serve some parent's tree, such as one in `~`.
- **A checkout run outside the repo:** `node bin/fkit-board.mjs` run from outside the repo used to serve fkit's own tree. Now it serves the folder you are in, or refuses. `npm run board` is unaffected because npm sets the working folder to the repo root. This change is documented.
- **Older installs:** an older install answers `fkit board` with "not a role" until `fkit update`; the docs say so. A downgrade with `FKIT_REF` to a ref without the reader removes the old copy (step 3).
- **Noisy `note` line in installed use:** every consuming project has `.claude/skills/fkit-status/dashboard.sh`, so the existing `note` line ("this project carries its own dashboard.sh; it is NOT used…") will print on each installed `fkit board`. It is true but noisy. I left it alone: changing it is new behaviour, outside the "reader as it is" scope.
- **Old Node:** no minimum version is checked. The reader needs Node 16 or later (`node:` imports, `??`); CI and this Mac use 24. An older Node gives node's own syntax error. The docs will say "tested on Node 24" (verified local v24.13.0 and CI Node 24 per CONTRIBUTING).
- **Port 8585 busy:** the existing error, exit 2, unchanged.
- **Agents running `fkit board`:** not ruled (ADR-058, open). I run it only in the bounded ways above, never as a plain foreground server.
- **Two copies of aiboard's page** (this one and `0422`'s port): accepted in ADR-058, recorded in the provenance README.

## Change surface
- New: `/Users/mark.dolbyrev/Workspace/fkit/vendor/aiboard/index.html`, `/Users/mark.dolbyrev/Workspace/fkit/vendor/aiboard/LICENSE`, `/Users/mark.dolbyrev/Workspace/fkit/vendor/aiboard/README.md`.
- Edited: `/Users/mark.dolbyrev/Workspace/fkit/bin/fkit-board.mjs`, `/Users/mark.dolbyrev/Workspace/fkit/install.sh`, `/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude.sh`, `/Users/mark.dolbyrev/Workspace/fkit/docs/board.md`, `/Users/mark.dolbyrev/Workspace/fkit/README.md`, `/Users/mark.dolbyrev/Workspace/fkit/CONTRIBUTING.md`, `/Users/mark.dolbyrev/Workspace/fkit/CHANGELOG.md`.
- No `.claude/` copies are edited, and nothing is committed.

open questions:

**Q1 — Should this task add an automated test?** It does not block: the default is option A.
- **Context (plain words):**
  - Once shipped, the board reader and the new `fkit board` route are "shipped script behaviour". ADR-057 says tests may cover that, but each new test file needs the owner's own OK, by path.
  - The owner's earlier pre-approval covers only `test/board/` files for tasks 0417–0422, not this task.
  - The reader has had no tests since the ADR-057 cleanup, and ADR-058 lists that as a known cost.
  - The route is temporary: task 0444 re-points `fkit board` and 0467 removes the reader, so a test written now would likely be thrown away.
- **Options:**
  - **A (Rec):** no new test. Rely on the manual evidence above plus the existing `npm test` and prove-red, which keep pinning every other launcher path. Cost: a later change could break `fkit board` for users without CI noticing.
  - **B:** add one new case to the existing `test/launcher-contract.test.js`: "`fkit board` with no node on PATH → names Node, exits non-zero, never runs claude, writes nothing in the project". No new file, but it is new growth that the owner's plan approval would cover. It adds a fraction of a second to `npm test` and to prove-red's launcher run.
  - **C:** a new file, `test/board-command.test.js`. It installs into a temp folder, starts the reader on port 0 from a fixture project, checks for 200, the read-only flag, 405 on non-GET, no files changed, and the no-Node message, then kills the server. About 1–2 s against the 2-minute budget. This needs the owner's OK naming that path.
- Knock-on: none (checked). No sprint placement or Depends-on change.

**Smaller layout and behaviour choices.** These are stated in the plan and approving the plan accepts them. They need no separate answer unless the owner objects:
- **(a)** the copied page lives at `vendor/aiboard/`, and in the install at `$SHARE/bin/` + `$SHARE/vendor/aiboard/`;
- **(b)** `fkit board` reads exactly the folder it is run in (no walk-up);
- **(c)** the sibling-aiboard default is dropped;
- **(d)** `install.sh` adds a non-blocking "Node is optional, only `fkit board` needs it" heads-up.
