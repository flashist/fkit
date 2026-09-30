# Design: locking each fkit version to one aiboard version

> ## ⛔ SUPERSEDED 2026-09-30 by the owner's FULL-MERGE ruling — dated note; nothing below it was changed
>
> The owner ruled (selected option text): *"No, fkit only → full merge — aiboard becomes fkit's built-in
> board; its repo is archived (history can be carried over). Simplest overall."* The decision now lives in
> [`2026-09-30-decision-document-merge-aiboard-into-fkit.md`](2026-09-30-decision-document-merge-aiboard-into-fkit.md).
> Read that first. This report stays on file as supporting evidence; where the two differ, the decision
> document wins.

- **Date:** 2026-09-30
- **Author:** `fkit-architect`, spawned by `fkit-lead` (consult, hop 1). No owner channel (ADR-021).
- **Kind:** design (options + recommendation). Design only — no installer, launcher or package change.
- **Status:** ⏸ **OPEN — input to the decision document.**
- **Parent:** [`2026-09-30-eval-aiboard-as-fkits-single-task-store.md`](2026-09-30-eval-aiboard-as-fkits-single-task-store.md)
  §6.6 and its question Q6.

**The requirement — the owner's own words (2026-09-30):** *"#1, and also we need to make sure we can
"lock" fkit on a specific version of aiboard (meaning, that there is no way, an older version of fkit that
is supposed to work with one version of aiboard, can accidentally start trying to use a newer version of
aiboard). Maybe we even need to start using npm packages for that."* — where #1 (selected option text) was
*"Launcher offers the converter — fkit detects an old project and offers the trial run; until converted, a
project can stay on the previous fkit version."*

**Tags:** **[M]** read in fkit today · **[S]** read in aiboard at HEAD `0108027` · **[AL]**
`aiboard-lead`'s input, 2026-09-30.

---

## 0. The answer in plain words

- **Each fkit version carries its own private copy of exactly one aiboard version**, installed from npm
  with an exact version number, in fkit's own install folder — **never** the `aiboard` a user may have
  installed globally. fkit's sessions always use that copy. That alone makes "old fkit uses new aiboard"
  impossible by accident.
- **Each project's task data records its format number**, and aiboard **refuses** to touch data in a
  format it was not built for. Only an explicit `aiboard migrate` changes the format. That protects the
  data from **any** aiboard — including one the owner runs by hand.
- **At every launch fkit asks aiboard "which version and format are you?"** and refuses to start a session
  on a mismatch — a loud wall, not a warning.
- **Each project records which fkit version it runs**, and the one `fkit` command on the machine starts
  that version. So a project can stay on an older fkit (including the last pre-aiboard one) while others
  move on. `fkit update` adds a new version beside the old ones instead of replacing them.
- **npm:** yes for aiboard (after the Node rewrite), with an exact pin. **fkit itself on npm** is optional
  for the lock; it is a separate choice with its own costs (§5, Q-V3).

---

## 1. What "locked" has to mean — four accidents to prevent

| # | Accident | Today it would… |
|---|---|---|
| A1 | The owner installs a newer `aiboard` globally (for another project, or from his own aiboard work) and fkit's agents start calling it | …happen silently: a CLI picked from `PATH` |
| A2 | `fkit update` brings a fkit that expects a newer aiboard format, and it opens a project converted under the older one | …happen: one fkit per machine, every project follows it |
| A3 | An **older** aiboard (e.g. the owner's global copy) writes into a project whose data is in a **newer** format | …happen: aiboard writes `"version": 1` into `aiboard.json` but **never reads it** [S] |
| A4 | A project that is **not yet converted** is opened by an aiboard-era fkit whose skills cannot read it | …leave the agents in a broken session (parent report §6.6) |

Plus one fkit-specific hazard: **the owner is aiboard's author**. A development checkout of aiboard will
exist on the machine; fkit's board reader today even defaults to a sibling `../aiboard` checkout
(`bin/fkit-board.mjs:107-138` [M]). Nothing in fkit may ever pick up a development copy.

## 2. How fkit is installed today [M]

- `install.sh` downloads the repo tarball (`FKIT_REPO`/`FKIT_REF`, default `flashist/fkit@main`) and copies
  **`claude/` only** into `~/.local/share/fkit/claude` (`install.sh:36-45`). It writes a `.version` file
  (version, sha, repo, ref).
- `fkit update` re-runs the installer — **replacing** the one copy (`claude/fkit-claude.sh:100-125`).
- **One fkit per machine.** Every project's `.claude/` is refreshed from that one copy at every launch
  (`fkit-claude-init.sh`), so every project always runs the machine's fkit.
- Codex is installed with `npm install -g @openai/codex` — **global, unpinned** (`fkit-claude.sh:549-560`).
- fkit has a `package.json` (`"name": "fkit"`, `0.3.1`) used for tests and releases; **it is not published**
  to npm (not verified whether the name is free — Q-V3).
- aiboard today: Python, installed via pip/pipx (its T-013); package `0.1.0`; the board format number is
  written but never checked [S, AL].

## 3. The options

### V1 — npm, installed globally with an exact version (`npm install -g aiboard@1.4.2`)

- ✅ Simple; the same way Codex is installed.
- ❌ **Global = one aiboard per machine.** Two fkit versions (one per project) needing different aiboards
  cannot coexist. Any later `npm install -g aiboard` — by the owner, for anything — silently replaces it.
  **Fails A1 and A2.**

### V2 — bundle a private aiboard inside each fkit version

- The installer runs `npm install --prefix <fkit version folder>/aiboard aiboard@<exact>` (npm checks the
  package's integrity hash and records it in a lockfile), or unpacks an aiboard build fkit ships.
- fkit calls **that** copy by its full path, and puts its folder **first on `PATH`** inside fkit sessions,
  so an agent typing `aiboard` (the ruled CLI door) gets the pinned build.
- ✅ **Stops A1 by construction.** Old fkit carries old aiboard; new fkit carries new aiboard.
- ⚠️ Does not by itself protect the **data** (A3) — the owner can still run another aiboard on the files.

### V3 — a handshake at launch (`aiboard info --json`)

- The launcher runs the pinned aiboard's `info --json` and checks: **version = exactly the one this fkit
  was built for**, **format = the one the project records**, **capabilities** include everything this fkit
  uses. Any mismatch → **refuse to open the session**, and say why and what to run.
- ✅ Catches a broken or tampered install (A1) and a project in the wrong format (A2) **before** any agent
  acts. A wall, unlike Codex's warning, because without a working store nothing works.
- ⚠️ A check, not a lock: it relies on V2 or V1 for *which* aiboard it asks.

### V4 — a format number in the project's data, enforced by aiboard

- `aiboard.json` carries `format: N`. **Every** aiboard command checks it:
  older aiboard + newer data → refuse ("upgrade aiboard");
  newer aiboard + older data → refuse ("run `aiboard migrate`").
  Only `aiboard migrate` (with a dry run first) changes the number — never implicitly.
- ✅ **The only layer that protects the data from any caller**, including the owner's own terminal and any
  script. **Stops A3.** It is aiboard's work (`aiboard-lead` proposed exactly this [AL]).

### V5 — each project pins its fkit version; several fkit versions side by side

- Each project records which fkit it runs, in a small fkit-owned file (e.g. `ai-agents/fkit.lock`:
  fkit version and board format), written by the converter and by new-project setup.
- The install share holds several versions (`~/.local/share/fkit/versions/<version>/`), each with its own
  `claude/` and its own private aiboard (V2).
- The single `fkit` command on `PATH` becomes a small dispatcher: read the project's pin → start that
  version (installing it if missing).
- **Unconverted project (no pin, old tree):** the dispatcher starts the **last pre-aiboard fkit version**
  (kept in the share) **or** offers the converter's dry run with the new version — the owner's ruling #1.
- `fkit update` **adds** a new version and makes it the default for **new** projects. An existing project
  moves only when asked (`fkit upgrade-project`, which dry-runs `aiboard migrate` if the format changes).
- ✅ **Stops A2 and A4.** ⚠️ The biggest fkit-side change of the five: the launcher and installer both
  change shape, and the current one-folder share must be moved into `versions/<old>/` once.

### V6 — fkit itself becomes an npm package

- `npm install -g fkit@0.6.0`, with `"aiboard": "1.4.2"` (exact) as a dependency — npm then installs
  aiboard **inside fkit's own folder**, which *is* V2, for free. Per-project versions could use
  `npx fkit@<pin>` or the V5 dispatcher.
- ✅ Standard tooling: exact versions, integrity hashes, easy rollback (`npm install -g fkit@0.5.3`).
- ❌ A new release pipeline (`bin/release.mjs` exists but does not publish), npm required at install,
  the package name may not be free, and **`npm install -g` is still one fkit per machine** — so it does not
  remove the need for V5's per-project dispatch.

## 4. How the pieces fit

| Accident | V1 | V2 | V3 | V4 | V5 | V6 |
|---|---|---|---|---|---|---|
| A1 wrong aiboard picked up | ❌ | ✅ | detects | — | — | ✅ (= V2) |
| A2 new fkit opens old-format project | ❌ | ❌ | detects | refuses | ✅ | ❌ alone |
| A3 wrong aiboard writes the data | ❌ | ❌ | — | ✅ | — | ❌ |
| A4 unconverted project | ❌ | ❌ | detects | — | ✅ | ❌ alone |
| Dev checkout leaking in | ❌ | ✅ | detects | refuses if format differs | — | ✅ |

No single option covers all four. Each covers a different one.

## 5. Recommendation — ⚠️ the architect's opinion

**A layered lock: V2 + V3 + V4 + V5, with npm as the delivery for aiboard. fkit-on-npm (V6) optional,
decided separately.**

1. **V2 — the lock itself:** each fkit version installs its own aiboard from npm at an **exact** version
   into its own folder; sessions put that folder first on `PATH`. fkit never uses a global `aiboard`.
2. **V4 — the data guard (aiboard's work):** the format number is checked on every command; only
   `aiboard migrate` changes it.
3. **V3 — the wall at launch:** version, format and capabilities checked; mismatch = no session, with the
   fix spelled out.
4. **V5 — per-project fkit versions:** a small pin file per project, several fkit versions side by side,
   a dispatcher `fkit`, and `fkit update` that adds rather than replaces. This is what makes "stay on the
   previous fkit until converted" real on a machine with one install.
5. **npm for fkit (V6):** not needed for the lock. Worth doing later for integrity hashes and standard
   rollback; it would replace the tarball download inside V5 rather than replace V5.

**Main tradeoff:** V5 turns fkit's installer and launcher from "one copy, always latest" into "several
copies, chosen per project". That is more moving parts and more disk, and `fkit update` stops meaning
"every project gets the new version". In return, no project can ever be driven by a fkit/aiboard pair it
was not converted for.

**Size (fkit side):** V2 S–M · V3 S · V5 **M–L** (installer, dispatcher, one-time share move, tests) ·
V6 M (if chosen). **aiboard side:** V4 S–M plus the packaging requirements below — aiboard-lead's to size.

## 6. What this needs from aiboard (R18, expanded)

| # | Requirement |
|---|---|
| R18a | Published to **npm** after the Node rewrite; **semver on the CLI, JSON and file-format contract**; runnable from a private install folder; **no install scripts, no global state, no self-update**. |
| R18b | `aiboard info --json` reports `version`, `format`, `capabilities` — and, for the CLI hook, the command/alias/status vocabulary (R23 in the CLI addendum). |
| R18c | A **format number in `aiboard.json`, checked by every command**: refuse newer data ("upgrade aiboard") and older data ("run `aiboard migrate`"). |
| R18d | `aiboard migrate --dry-run` and `aiboard migrate` — explicit only, never on the side of another command. |
| R18e | `aiboard.json` keeps unknown keys on rewrite (so no other tool's settings are lost) — fkit keeps its own pin in its **own** file regardless. |
| R18f | The web page's files ship **inside** the package (fkit's reader today loads them from a sibling checkout; that path must not exist under the lock). |

## 7. What this needs from fkit

- **Installer:** versioned share (`versions/<v>/`), private aiboard per version via `npm install --prefix`
  with the exact version, one-time move of today's `~/.local/share/fkit/claude` into `versions/<current>/`.
- **Launcher:** the dispatcher (read the pin → start that version); the V3 handshake as a wall; `PATH`
  prepend of the private aiboard for the session; unconverted-tree detection → offer the converter's dry
  run or start the legacy version (ruling #1).
- **Pin file** (`ai-agents/fkit.lock` or similar): written by the converter and by new-project setup;
  changed only by `fkit upgrade-project`.
- **`fkit update` semantics:** add a version, set it as the default for new projects, and at the next launch
  of each pinned project **tell** the owner a newer fkit exists (never move it silently).
- **The CLI hook** reads its vocabulary from the pinned aiboard's `info --json` (CLI addendum §3.1) and
  refuses an `aiboard` called by a full path that is not the pinned one.
- **Retire** the board reader's sibling-checkout default when the reader retires.
- **Tests:** launcher-contract cases for pin → version dispatch, handshake mismatch → refusal, unconverted
  tree → offer; installer idempotency.
- **Ops:** a way to remove versions no project uses.

## 8. Open questions for the owner

| # | Question | Recommended answer |
|---|---|---|
| **Q-V1** | When you run `aiboard` yourself in a terminal (not through fkit), may it touch a project's tasks? | **Yes, if its data format matches** — the format guard (V4) protects the data; the exact-version lock is only for fkit's agents. |
| **Q-V2** | After `fkit update`, should a project move to the new fkit automatically when nothing about its data format changes, or only when you say so? | **Only when you say so**, with a one-line notice at launch that a newer fkit is available. |
| **Q-V3** | Publish fkit itself as an npm package? | **Later, as its own decision.** Not needed for the lock; useful for integrity checks and easy rollback. First confirm the name `fkit` is available on npm. |
| **Q-V4** | Keep the last pre-aiboard fkit installed for unconverted projects, for how long? | **Until every project you use is converted**, then remove it with the cleanup command. |
