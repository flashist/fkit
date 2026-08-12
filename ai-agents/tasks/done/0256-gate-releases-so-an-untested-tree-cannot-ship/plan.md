# Approved implementation plan — task 0256

**Approved by the owner 2026-08-12 via `AskUserQuestion`**, in a `fkit lead` session driving
`/fkit-sprint-ship-loop` against `ai-agents/sprints/sprint-5.md`. The plan body below is the coder
worker's returned text, copied verbatim.

## Owner rulings taken at the plan gate (2026-08-12)

1. **Plan approved at FULL scope — BOTH the in-release gate AND CI.** Verbatim option label:
   "Approve — both gate and CI (Recommended)". This **fully** discharges `architecture.md` §11 OQ2.
2. **CI runner: `ubuntu-latest`.** Verbatim option label: "ubuntu-latest (Recommended)". The
   dash-divergence risk is accepted knowingly — a red run is information not currently held, and the
   port is a **separate brief**, not a reason to avoid learning it. ⛔ Do not fix a portability failure
   inside this task; report it.
3. **`--no-test` escape hatch: INCLUDE IT, LOUD.** Verbatim option label: "Include it, loud
   (Recommended)". Unconditional stderr banner, documented in the header block and `--help`, never a
   default.
4. **architecture.md §9.1 — 0256 takes the CI SENTENCES ONLY.** Verbatim option label: "0256 takes the
   CI sentences only (Recommended)". Correct the §9.1 heading, the `- **No CI.**` bullet at `:489`, the
   overview line at `:31`, and the closing residual-risk paragraph. ⛔ **Leave the suite-inventory
   count untouched — it is task `0251`'s.**

---

### Recommendation up front: **both**, and it is not a fence-sit

Each option closes a hole the other **structurally cannot**. Evidence, not preference:

**Why an in-release gate alone is insufficient — `install.sh:19`:**
```sh
REF="${FKIT_REF:-main}"
```
The default `curl | sh` install **and the self-update path** track **`main`'s HEAD, not a tag**. Four of the last five commits on `main` are non-release commits (`ADR-042…`, `Sprint push` ×2, `Sprint and tasks update`) — every one was live to every new install and every `fkit update` the moment it was pushed. A gate that fires only inside `npm run release` protects the artifact **almost nobody installs by default**.

The repo already argues this against itself, at `test/structure-manifest.test.js:14-17`:
> "The enforcement point is HERE, not bin/release.mjs — the distribution is sha-keyed (ADR-015 Context §4), every commit is a potential release, so a release-boundary regenerator would leave between-release shas uncovered."

That is about a *regenerator*, not a gate, but the reasoning transfers exactly. Shipping the in-release gate alone adopts the posture that comment rejects.

**Why CI alone is insufficient — the release script's own sequence:** `release.mjs` pushes the branch (`:196`) and pushes the tag (`:207`) in one uninterrupted run. CI's verdict is **asynchronous** — it arrives after the tag is already on origin. And CI never sees the working tree: `git add -A` (`:183`) ships whatever is on the laptop, including files no CI run has ever evaluated.

**Cost is not the tiebreaker either way.** Releases are rare (1 of the last 5 commits), so 328 s per release is cheap; the repo is **public**, so Actions minutes are free.

**Sequencing within the task: in-release gate first, CI second.** The gate is the stated defect, needs no new surface, and carries zero infrastructure risk. CI carries a genuine portability risk (below) that I do not want blocking the fix.

---

### Verified facts (2026-08-12 — re-checked, brief was 2026-08-08)

| Claim | Status |
|---|---|
| `.github/` absent | ✅ still true |
| `bin/release.mjs` runs no tests | ✅ still true (read all 222 lines) |
| 19 `test/*.test.js` | ✅ still 19 |
| Zero `dependencies`/`devDependencies` in `package.json` | ✅ ADR-014 §4 holds — **neither option needs a new devDep** |
| `npm test` green on the current dirty tree | ✅ 709 tests / 17 suites / **0 fail** |

**Measured cost — `npm test` = 328 s wall (5 m 28 s)**, `user 163.27 / sys 355.22`. Unit portion `duration_ms 55751.87` (55.8 s); `prove-red.sh` ≈ **272 s** (4 m 32 s) — it re-runs suites against 15 mutants plus 9 clean-copy baselines.

**Would CI even run?** Yes — but **you cannot tell from the repo alone**; `.github/`'s absence says nothing about whether Actions is enabled. It took an API call:
- `repos/flashist/fkit` → public, not archived, default branch `main`
- `repos/flashist/fkit/actions/permissions` → **`{"enabled":true,"allowed_actions":"all"}`**
- `repos/flashist/fkit/actions/workflows` → `total_count: 0`

---

### Where the gate goes, and the partial-release question

`release.mjs`'s first **mutating** line is `:148` (`writeFileSync(versionPath, …)`) inside the bump block at `:144-154`. Everything before it only reads or computes: help (`:47-68`), preflight (`:96-101`), file reads (`:103-106`), version resolution (`:111-142`).

**Insert the gate immediately before line 144** — after `target` is resolved (so the message can name the version) and before the first write.

**On "what happens to a partially-completed release if it fires late" — the design answer is that it must be structurally impossible to fire late.** At line 144 the script has written nothing, staged nothing, committed nothing, tagged nothing. A failure is a clean abort with the tree exactly as the user left it. The alternative — gating anywhere after `:148` — leaves `VERSION` and `package.json` bumped and dirty; the next default run would bump *again* (0.2.2 → 0.2.3), silently skipping a version, and recovery would need the `--no-bump` path the script's header (`:12-14`) documents. Placing it at 144 removes that failure mode rather than documenting it.

### What the gate does about uncommitted work — it is the reason the gate works

This is the load-bearing detail, and it lands favourably.

- `npm test` reads the **working tree** (`harness.mjs` derives `REPO` from its own location and reads live files).
- `bin/generate-structure-manifest.mjs:20-22`: *"**PLUS THE WORKING TREE.** A scaffold edit and its regenerated manifest land in the SAME commit … The walk is history ∪ current on-disk `claude/scaffold/`."*
- `git add -A` stages the **working tree**.

All three agree on the same bytes. So a gate before `git add -A` tests **exactly what is about to be committed** — including uncommitted and untracked work. **The gate does not require, and must not require, a clean tree.** That matters concretely today: the tree holds uncommitted work from 0266/0267/0268 plus untracked `0276`/`0277`, and `npm test` is green against it.

Two corollaries worth stating:
- Because the manifest walk is history **∪** working tree, the blob set is unchanged by the commit itself — so a pre-commit pass cannot become a post-commit failure. No pre/post divergence.
- I checked for a gitignore escape (a file the generator reads but `git add -A` would not stage): **nothing under `claude/scaffold/` is ignored**. No divergence.
- **CI cannot substitute here at all** — it never sees the dirty tree.

---

### Steps

**1. In-release gate — `bin/release.mjs`** (the only source file this task edits)
- Add `runTests()` using the existing `spawnSync` import, `{ cwd: KIT, stdio: "inherit" }`, invoking `npm test` (`npm` via `process.platform === "win32" ? "npm.cmd" : "npm"`, or `npm run test`). `stdio: "inherit"` so the suite streams live — 5.5 minutes of silence reads as a hang.
- Print before starting: `• running npm test before release v<target> (~5m30s; includes prove-red.sh)`.
- Non-zero exit → `fail("npm test failed — refusing to release an untested tree. …")`. `fail()` already `process.exit(1)`s. **No warn-and-continue path exists in the code at all** — that is the requirement, and it is met by construction rather than by a flag.
- Call it immediately before `:144`.
- **The gate runs under `--dry-run` and exits 1 on failure.** Required by the brief's verification step 1 ("run `node bin/release.mjs --dry-run` and show it refuses"). This does not violate `--dry-run`'s "touch nothing" contract: `harness.mjs:9` states *"Nothing here writes into the repo"* and `prove-red.sh` works entirely under `mktemp -d` with an EXIT trap. Only the exit code changes.
- `-h/--help` exits at `:67`, before the gate — unaffected.

**2. Escape hatch `--no-test`** — **OWNER RULING 3: INCLUDE IT, LOUD.**
- Loud multi-line banner to **stderr**, unconditional, e.g. `⚠ --no-test: releasing WITHOUT running the suite. The shipped tree is UNVERIFIED.`
- Documented in both the header comment block (`:20-30`) and the `--help` text (`:54-63`).
- Never a default.

**3. CI — new `.github/workflows/test.yml`** — **OWNER RULING 2: `ubuntu-latest`.**
- Triggers: `push` to `main`, and `pull_request`.
- `actions/checkout@v4` with **`fetch-depth: 0` — mandatory, not tidiness.** `test/structure-manifest.test.js:60-67` hard-refuses a shallow clone (`git rev-parse --is-shallow-repository`), and `actions/checkout` defaults to `fetch-depth: 1`. Without this the suite dies at module load on every run.
- `actions/setup-node@v4`, Node 24 (local is v24.13.0). **No `cache: npm`, no `npm ci`** — no lockfile, zero deps.
- `run: npm test`.
- `timeout-minutes: 20` so a hung `prove-red.sh` cannot burn a runner.

**4. Docs**
- `architecture.md` §11 OQ2 → closed pointer in OQ1's pattern, recording the owner's 2026-08-08 ruling and what landed. **Fully discharged** (owner ruling 1 took full scope).
- **CI lands, so §9.1's CI sentences are now false and MUST be corrected** — the heading `### 9.1 A test suite exists, but nothing runs it automatically — no CI`, the `- **No CI.**` bullet (`:489`), the overview line `:31` (*"no CI to run it"*), and the closing residual-risk paragraph. **OWNER RULING 4: correct exactly these CI sentences; leave the suite-inventory count for `0251`.**

**5. Worklog** — records the measured 328 s as a number, per brief requirement §2.

### Verification

1. **Demonstrated block.** Edit one file under `claude/scaffold/` **without** regenerating the manifest → `test/structure-manifest.test.js` assertion A goes red → run `node bin/release.mjs --dry-run` → show it **refuses**, non-zero exit, no bump written. Then revert and prove it with `git status --porcelain`.
   - The revert proof must be explicit: the tree is **already dirty** with 0266/0267/0268 work, so "clean" is the wrong assertion — I will diff the porcelain output against the pre-experiment baseline captured above and show the deliberate break is gone, not that the tree is empty.
2. `npm test` green on the final tree.
3. `git status --porcelain` shows nothing under `ai-agents/wiki-vault/` and no change to any `test/*.js` — and no change to `bin/generate-structure-manifest.mjs` or `claude/structure-manifest.tsv`.
4. CI verified by pushing a branch — ⚠️ **but this loop does NOT commit or push.** So CI is verified by static review of the workflow file plus the reasoning above; a live run happens when the owner pushes. **Say this plainly rather than claiming CI was proven green.**

### What `0252`'s releaser checklist can assert once this lands

Instead of *"run `npm test`, because nothing else will"*, `0252` can write:
- `npm run release` **runs the full suite itself and aborts on red**; the releaser does not need to remember.
- The gate covers the **working tree**, so it catches a stale `claude/structure-manifest.tsv` at the moment `git add -A` would ship it — the manifest duty `0252` documents is machine-enforced at the release boundary, not merely a checklist line.
- The remaining human duty is narrower and genuinely human: reconciling `VERSION`/`package.json` if they drift (`release.mjs:132-137`), and deciding the bump level.
- Caveat `0252` must still carry: the gate protects the **tagged** release; installs default to `main` HEAD (`install.sh:19`), which is CI's job.

### Risks / edge cases

- **Portability is the real risk, and it is not this task's job to fix.** The suite has only ever run on darwin. On `ubuntu-latest` `/bin/sh` is **dash**; on macOS it is bash-in-posix-mode. `claude/fkit-claude.sh` is `#!/bin/sh`, `claude/fkit-claude-init.sh` is `#!/usr/bin/env bash`. A first CI run could red on a genuine dash divergence — a real finding, but **out of this brief's scope to repair** (owner ruling 2 accepts this knowingly). (Mitigations already present: `structure-check.test.js:408` and `structure-repair.test.js:396` already probe for both `sha256sum` and `shasum`; `sed -i.bak` with a suffix is valid on both seds.)
- **The gate can block a release for reasons unrelated to the release.** `task-id-uniqueness.test.js` / `adr-number-uniqueness.test.js` scan `ai-agents/`, so an in-progress task folder with a duplicate ID would refuse a release. Arguably correct; worth the owner knowing before it happens at an inconvenient moment.
- **Latent, not in scope:** `node_modules/` is **not** in `.gitignore` and `release.mjs` does `git add -A`. Harmless today — the directory is empty and git ignores empty directories — but the day anything is installed, `git add -A` commits it. Flagging only; I am not widening scope to fix it.
- **Not touched, per ⛔:** no `shellcheck` job, no `install.sh` smoke-install, no test/manifest/generator edits, no new dependency, no wiki write, no commit, no task-file move.

---

## evidence — what I read and measured

**Read in full:** `ai-agents/tasks/backlog/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md`; `bin/release.mjs` (222 lines); `test/prove-red.sh` (696 lines); `package.json`.

**Read in part:** `bin/generate-structure-manifest.mjs` (header + `WALK_PATHS` + git-walk + `--stdout`/write at `:353-355`); `test/structure-manifest.test.js` (`:1-130`, incl. shallow guard and assertion A); `test/harness.mjs` (`:1-60`, stub/hermeticity); `install.sh` (ref resolution); `ai-agents/knowledge-base/architecture.md` §11, §9.1, `:31`; `ai-agents/knowledge-base/decisions/adr-014-how-fkit-tests-itself.md` §4; `.gitignore`.

**Measured/executed (all read-only; I wrote no file and edited nothing):**
- `/usr/bin/time -p npm test` → `real 328.00 / user 163.27 / sys 355.22`; `tests 709, suites 17, pass 709, fail 0`, unit `duration_ms 55751.8685`; `✓ hard gate PASSED`.
- `git status --porcelain` (baseline captured), `git remote -v`, `ls .github` → no such directory, `git ls-files node_modules` → 0, `git check-ignore claude/scaffold/` → no ignores.
- `ls test/*.test.js | wc -l` → 19. `node -v` → v24.13.0; `npm -v` → 11.6.2.
- `gh api repos/flashist/fkit`, `…/actions/workflows` (0), `…/actions/permissions` (`enabled: true`).
