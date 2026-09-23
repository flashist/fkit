# Plan — `0412` Let the read-only board reader serve another project's `ai-agents/` tree (`--root`)

> **Provenance.** Written by a spawned `fkit-coder` on 2026-09-23 — a **plan-only** spawn from
> `fkit-lead` (no source, no tests written; this file and a `worklog.md` entry are the only writes).
> **Not yet approved.** The plan gate is the owner, in the lead's session.
>
> **Owner rulings folded in** (2026-09-23, live `AskUserQuestion` in the lead session — ⚠️ **selected
> option text, not the owner's own prose**):
> 1. Dashboard for a foreign root — *"Always fkit's own"*. Accepted downside: while a target's install
>    is stale, this board and that project's own `/fkit-status` can disagree.
> 2. Backlog-id collision — *"Warn on /api/check in 0412"*. One read-only warning; no merging fix.
> 3. `FKIT_BOARD_ROOT` — **not ruled**; left to this plan (answer: §3.4, not built).

## Summary

- **Small, as the brief hoped.** One source file (`bin/fkit-board.mjs`, ~+50 lines), one new test file,
  one README section. No change to `startServer`'s signature or to the snapshot shape beyond one new
  `/api/check` field.
- **Rule that drives the design: _tools come from fkit's own checkout, data comes from `--root`._**
  The `dashboard.sh` and aiboard's sibling-default both stay anchored to fkit's own tree; only the
  `ai-agents/` being read moves.
- ⚠️ **Found a real trap while grounding (reproduced in a scratch fixture):** the dashboard is spawned
  with `cwd: root`. A **relative** dashboard path therefore resolves **inside the target project** —
  it failed outright in my probe, and on a target that carries a copy at the same relative path it
  would **silently run the target's (maybe v1) copy** — the exact thing ruling 1 forbids. The plan
  forces an absolute path and a test pins it.
- **The collision is reproduced in a fixture:** `backlog.md` + `sprint-backlog.md`, both headed
  `Backlog`, both come out as id `BACKLOG` today with `/api/check` saying `ok: true, problems: []`.
- **fkit's own tree has zero id collisions today** (11 boards, 412 tasks, measured 2026-09-23), so the
  new warning is silent on fkit's own board.
- **No `FKIT_BOARD_ROOT` env var** (my call — §3.4).
- **No-flag behaviour is byte-identical,** including the startup banner and `--bench` output.

---

## 1. What exists today (read, not assumed)

- `bin/fkit-board.mjs` (606 lines). `makeReader({ root, dashboard })` and `startServer({ root, … })`
  already take `root`. Only `main()` hard-wires it: `const root = findRoot();` then
  `findDashboard(root)`, `resolveAiboard({ …, root })`, the startup probe, `--bench`, the banner.
- `findDashboard(root)` returns `join(root, 'claude/…/dashboard.sh')` — absolute only because
  `findRoot()` returns `resolve()`d paths. Nothing enforces it.
- `selectActive()` and the startup probe both `spawnSync('bash', [dashboard, 'select-active',
  <root>/ai-agents/sprints], { cwd: root })`. `dashboard.sh select-active` takes the sprints dir as an
  argument and does not depend on cwd (checked) — but the **dashboard path itself** does, if relative.
- `arg(argv, name)` returns `undefined` when the flag is the last argument, and does not understand
  `--flag=value`. For `--root` both would be a **silent fall-through to fkit's own tree** — exactly
  what the brief forbids. Handled explicitly in §3.1.
- `test/board-reader.test.js` guards the reader's **source text**:
  - **C** — whole-file grep (comments included) for three banner markers, the blockquoted-heading
    prefix, the in-progress literal, plus three *structural* regexes (a `[...]` holding both `>` and
    `#` on one line; `lines[2]`; `split('\n')[2]`), and requires the `select-active` spawn.
  - **E2** — `node:fs` imports exactly `existsSync, readFileSync, readdirSync, statSync`;
    `node:child_process` imports exactly `spawnSync`; `spawnSync(` appears **exactly twice**; a list
    of banned write-capable names (incl. `import(`, `require(`, `openSync`, `writeSync`).
  - **F** — `--aiboard` failure names all three ways.
  All of these must stay green untouched. The plan adds **no** new `node:fs` name, **no** new
  `spawnSync(` call site, and no quoted banner token.
- README §"Reading the board in a browser" promises: 127.0.0.1 only; GET only; *"reads no environment
  beyond `FKIT_AIBOARD`"*; *"opens no file outside `ai-agents/` except the single aiboard
  `index.html`"*; one subprocess, fkit's own `dashboard.sh`. The plan keeps every one of those true.
- 0411's review ledger carries accepted residual **R10** (colliding board ids, "re-raise only if a live
  collision actually appears"). That condition is now met on the sibling project; **ruling 2 is its
  disposition** (warn, don't merge). 0411's ledger is closed and is not edited; this is recorded here
  and in the worklog so the 0412 reviewer does not re-open R10 as new.
- The DNS-rebinding / no-`Host`-check residual from 0411 is **not** re-triggered: still loopback, still
  one user, no write mode.

## 2. Behaviour after the change

```
npm run board                                          # unchanged — fkit's own tree
npm run board -- --root <other-project> --port 9001    # another project's ai-agents/, read-only
node bin/fkit-board.mjs --bench --root <other-project> # snapshot cost on that tree
```

- `--root <path>` → validate, then serve `<path>/ai-agents/` with **fkit's own** `dashboard.sh` and
  aiboard resolved exactly as today (relative to fkit's checkout).
- Bad `--root` → exit **2** before anything else runs (no probe, no aiboard lookup, no listen),
  message names the missing piece and says it will not fall back.
- Startup banner with `--root` (no-flag banner byte-identical to today):
  ```
  fkit-board  http://127.0.0.1:9001/   (read-only — Ctrl+C to stop)
    tree     <resolved path>/ai-agents  (--root)
    aiboard  <path>  (sibling default)
    status   <fkit checkout>/claude/skills/fkit-status/dashboard.sh  (fkit's own — the target's copy is not used)
    note     this project carries its own dashboard.sh; it is NOT used. If that install is older than
             this fkit, its own /fkit-status may read boards differently from this board.
  ```
  The `note` line appears only when the target has a `claude/` or `.claude/` `dashboard.sh`
  (`existsSync` — a stat, no file is opened, so the README's "opens no file outside `ai-agents/`"
  stays true). This is the cheap visibility ruling 1 asked for.
- `/api/check` → `{ ok, problems, warnings }`. `warnings` is new; `ok` keeps its meaning ("sprint status
  is being read"). A collision adds one line per colliding id, e.g.
  `board id BACKLOG is claimed by 2 files (backlog.md, sprint-backlog.md): both show the same tasks,
  and /api/sprints/BACKLOG opens only backlog.md.` File names are sprints-relative
  (`done/sprint-4.md` for archives) — no absolute path, matching the 404/500 no-path-leak rule.

## 3. Changes, file by file

### 3.1 `bin/fkit-board.mjs`

1. **New export `resolveRoot({ flag, home })`** beside `resolveAiboard`, same style:
   - `flag === undefined` → `{ path: home, how: 'default' }` (home = `findRoot()`, i.e. today's value).
   - `flag === ''` → error (`resolve('')` would be cwd — a silent fall-through).
   - Otherwise check with `statSync(...).isDirectory()` (not `existsSync` — the 0411 H3 lesson: a file
     must not pass): the path itself, then `ai-agents/tasks/`, then `ai-agents/sprints/`. Collect
     **every** missing piece and throw one `Error` with `code = 'ROOT_UNRESOLVED'`, naming the path
     as given and each missing piece, ending *"fkit-board does not fall back to its own tree."*
   - Returns `{ path: resolve(flag), how: '--root' }`. Relative paths resolve against `process.cwd()`
     (see §5 risk on `npm run`).
2. **`main()` order:**
   - Reject `--root=<x>` (any argv entry starting `--root=`) and a bare trailing `--root` with no
     value → exit 2 with a usage line. Both would otherwise be ignored by `arg()` and silently serve
     fkit's tree.
   - `home = findRoot()`; `rootInfo = resolveRoot({ flag: arg(argv, '--root'), home })` in a
     try/catch → stderr + `return 2`. **This is the first thing that can fail**, so a bad root
     starts nothing.
   - `dashboard = resolve(findDashboard(home))` — ⚠️ **always `home`, always absolute** (ruling 1 +
     the cwd trap). For the no-flag path `home === root`, so this is the same file as today.
   - Probe, `--bench`, `startServer` all get `root = rootInfo.path`; the probe error already names
     the dashboard path it tried (brief item 3 — already met, kept).
   - `resolveAiboard({ …, root: home })` — the sibling default stays next to **fkit's** checkout, not
     next to the target (aiboard is fkit's tool, not the target's data). Same result as today with no
     flag.
   - `--bench` with `--root`: prepend `tree … (--root)` and `status …` lines; no-flag bench output
     unchanged.
   - Banner: suffixes and the `note` line only when `rootInfo.how === '--root'`.
3. **Collision warning** in `readBoards()`: after building `boards`, group by `id`; each id with >1
   board yields one warning string (§2). `readBoards` returns `{ boards, problems, warnings }`; the
   snapshot cache stores `warnings`; the reader exposes `warnings: () => snapshot().warnings`;
   `/api/check` returns it. No merging, no renaming of ids (ruling 2; R10's "no option dominates"
   still holds for the fix itself).
4. **Header comment**: two or three lines on `--root` and the "tools from home, data from root" rule,
   written without any token test C forbids.

**Budget checks the implementation must hold:** still exactly two `spawnSync(` sites; `node:fs`
import list unchanged; no `import(`/`require(`; no new line with `[` … `>` … `#` … `]` (C's structural
regex — the collision code uses `[...map]` / `.filter(([, v]) => v.length > 1)`, which has no `#`, and
C will be run to prove it).

### 3.2 `test/board-root.test.js` (new file)

A new file rather than growing 0411's contract file: it keeps 0411's seven assertions intact and its
header's "SCOPE" statement true. Same law (ADR-014): `node --test`, zero devDependencies, black-box CLI
where the claim is about the CLI. **Every fixture under `os.tmpdir()`; no real sibling project, no
machine path in the file.** Fixture helper builds `ai-agents/tasks/{backlog,done,cancelled}` + 
`ai-agents/sprints/{,done}` with a couple of briefs and boards (banner text lives in the test file,
which test C does not scan).

| # | Proves | How |
|---|---|---|
| R1 | No flag → root exactly as before | `resolveRoot({ flag: undefined, home: findRoot(bin) })` deep-equals `{ path: findRoot(bin), how: 'default' }`; CLI `--bench` with no `--root` reports `corpus: <N> tasks` where N is the counted task folders of the repo, and prints no `tree`/`(--root)` line. |
| R2 | `--root <fixture>` serves the fixture | CLI `--bench --root <fixture>` exits 0; `corpus:` line shows the fixture's counts (e.g. 3 tasks, 2 boards), not the repo's. |
| R3 | Bad roots refuse, name the gap, start nothing | CLI with `--aiboard <stub> --port 0 --root X` for: nonexistent path; a **file**; dir with only `ai-agents/sprints/`; dir with only `ai-agents/tasks/`; dir with neither (both named); `--root ''`; `--root=<fixture>`; trailing `--root`. Each: `status === 2`, stderr names the missing piece, stdout has no `http://127.0.0.1` (spawnSync returning at all proves no listener stayed up). Plus `resolveRoot` throws `code === 'ROOT_UNRESOLVED'` for the same cases. |
| R4 | ⭐ A markerless/old `dashboard.sh` in the target is **never run** | Fixture carries `claude/skills/fkit-status/dashboard.sh` that prints a v1-shaped, marker-less line. CLI `--bench --root <fixture>` exits **0** — if the fixture's copy had been used, the startup probe would refuse with exit 2, so this discriminates. Then serve (`spawn`, `--port 0`, stub aiboard), read the banner: `status` line names the **repo's** dashboard path and not the fixture's; `note` line present. `GET /api/board`: the fixture's open board's `status` equals `bash <repo dashboard> status <board>` — never `unresolved`, never whatever the fake printed. Kill the child in `finally`. |
| R5 | Relative dashboard path cannot leak into the target | Covered by R4 (the fixture's copy sits at the same relative path the trap would hit). |
| R6 | Collision warning | Fixture with open `backlog.md` + `sprint-backlog.md`, both headed `Backlog` (the reproduced shape), plus archived `done/sprint-4.md` + `done/sprint-04.md`. `/api/check`: `warnings` has exactly two entries naming `BACKLOG` and `S-004` and both file names each; `ok`/`problems` unaffected. A no-collision fixture → `warnings: []`. |
| R7 | Read-only proof on a foreign root | sha256 of every file (sorted relative path + bytes) of the fixture before; full snapshot + a burst (×5) of `/api/board`, `/api/check`, every `/api/tasks/<id>`, every `/api/sprints/<id>`, `/`; `POST`/`PUT`/`DELETE` on each → 405; hash after **identical**, file list identical. Byte-level, so stronger than 0411's E (which is blind to already-modified files). |
| R8 | Banner names the served tree | Serve test (same child as R4): `tree` line contains the fixture's path and `(--root)`. Path is a tmp dir at runtime; nothing machine-specific is committed. |

**Env-var precedence test:** not applicable — env var not built (§3.4).
**Existing suite:** `test/board-reader.test.js` A–H6 must pass unchanged (C, E2 especially).

### 3.3 `README.md` — "Reading the board in a browser"

- Add the two `--root` lines to the usage block (placeholder `<other-project>`, **no absolute path**).
- One paragraph: `--root <path>` reads another fkit-using project's `ai-agents/`; it must hold both
  `ai-agents/tasks/` and `ai-agents/sprints/` or the reader exits non-zero and never falls back to
  fkit's own tree; relative paths resolve from where `node` runs (under `npm run board` that is fkit's
  checkout — use an absolute path from elsewhere).
- One line on the dashboard: **fkit's own `dashboard.sh` reads every tree, including a foreign one; the
  target's copy is never run.** So the board shows *this fkit's* reading; if the target's install is
  older, its own `/fkit-status` may disagree (the banner's `note` line says so at startup).
- One line: `/api/check` also reports `warnings`, e.g. two board files mapping to one id.
- One line: ⛔ serving another project **does not count toward ADR-051's trial** (it counts fkit's own
  tree, from P1).
- Keep true and unchanged: 127.0.0.1 only, GET only, "reads no environment beyond `FKIT_AIBOARD`",
  "opens no file outside `ai-agents/` except aiboard's `index.html`", one subprocess.

### 3.4 `FKIT_BOARD_ROOT` — not built (my call, per the lead: "keep it minimal")

- The flag covers the need; `npm run board -- --root …` is one argument.
- An ambient env var is the easiest way to **mistake one project's board for another's** — a stale
  export silently retargets plain `npm run board`, the very confusion brief item 4 is about.
- It would break the README's standing promise *"reads no environment beyond `FKIT_AIBOARD`"*.
- Cheap to add later with the `resolveAiboard` precedence pattern if the owner wants it.

## 4. Sequence

1. `resolveRoot` + `main()` wiring (flag parsing, order, absolute dashboard from home, aiboard from
   home, banner/bench suffixes). Run existing suite → green (proves no-flag unchanged + C/E2 held).
2. Collision warning in `readBoards` + `/api/check`. Existing suite → green.
3. `test/board-root.test.js` R1–R8. `npm test` (unit + `prove-red.sh`) → green.
4. README.
5. Manual (owner's machine, read-only): `npm run board -- --root <sibling> --port <free>` → expect
   ~289 tasks / 12 boards (lead's 2026-09-23 figures), `/api/check` shows the `BACKLOG` warning,
   `note` line present; `--bench --root <sibling>` prints a time; `npm run board` alone → banner
   unchanged. I may run these myself read-only if the path is given to me; **the path goes in no
   artifact** — the worklog says "the sibling project".
6. `git diff README.md` grep for absolute paths (`/Users/`, `/home/`, `C:\`) → none.

## 5. Risks and failure modes

- ⚠️ **Relative dashboard path + `cwd: root`** — would run the target's copy. Mitigated: `resolve()` in
  `main()`; R4 pins it. (`makeReader` exported callers can still pass a relative path — library
  contract unchanged; noted, not hardened.)
- ⚠️ **Silent fall-through via argv shape** (`--root=`, trailing `--root`, `--root ''`) — each an
  explicit exit 2, each tested.
- ⚠️ **`npm run` changes cwd** to fkit's checkout, so `--root ../x` means "sibling of fkit", not
  "sibling of my shell". Not worked around (reading `INIT_CWD` would break the "no environment beyond
  `FKIT_AIBOARD`" promise). Mitigated by the banner printing the **resolved** tree and by the README.
- **Newer dashboard vs older target** — accepted by ruling 1; made visible by the `note` line + README.
  The target's `unresolved` open-sprint statuses (pre-convention banners) stay `unresolved` —
  that is its data, and the reader grows no banner parsing to cope (one-grammar rule).
- **Other known sibling gaps stay unfixed** (out of scope per brief): `plan-sprint-N.md` → `S-plan-sprint-N`
  so its tasks don't link. If that pair ever *collides*, the new warning will show it; it won't
  otherwise.
- **Collision warning on fkit's own tree** — zero today; if one appears, `/api/check` will say so
  (which is R10's re-raise condition, now answered by a warning rather than silence).
- **Probe has no timeout** (pre-existing; `selectActive` has 30 s, the startup probe has none). Not
  touched — outside this brief. Flagged so a reviewer doesn't read it as new.
- **Test runtime**: R1's no-flag `--bench` runs 3+1 full snapshots of the live tree (~0.5–1 s). Acceptable.
- **Port clash** if fkit's own board already holds 8585 — existing `EADDRINUSE` → exit 2 path; README
  example uses `--port`.

## 6. Out of scope

Write path of any kind; non-loopback binding; `Host` checks (0411 residual, not re-triggered); env var;
merging/renaming colliding ids; fixing the sibling's banners or `plan-sprint-N` naming; editing any
file in another project; ADR-051 trial counting; retiring the lead's `node -e` launcher (nothing in the
repo references it — nothing to delete).

## 7. Open questions for the plan gate

- **`warnings` field vs `problems` entry** for the collision. Plan: a separate `warnings` array, `ok`
  unchanged — ruling 2 says "warning", and making `ok: false` permanent on a foreign tree for a data
  quirk fkit will not fix would teach the owner to ignore `ok`. Alternative: push it into `problems`
  (louder, flips `ok`). Low stakes; my recommendation is `warnings`.
