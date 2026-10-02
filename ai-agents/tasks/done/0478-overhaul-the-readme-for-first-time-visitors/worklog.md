# Worklog — `0478` Overhaul the README for first-time visitors

## 2026-10-02 — plan written (plan-only spawn, no source touched)

> **Who wrote this.** A spawned `fkit-coder`, plan-only, driven by `fkit-lead`. It has no owner
> channel (ADR-021). It wrote only `plan.md` and this file. No README, doc, `package.json` or source
> file was changed, and the handoff file was not moved.

**Grounding (read-only):**

- `git status` at start: only `ai-agents/sprints/backlog.md` modified and this task folder untracked.
  `README.md` clean. `0475`, `0476`, `0467` are all `🔲 Backlog` — no concurrent README edit.
- Read `README.md`, `install.sh`, `claude/fkit-claude.sh`, the relevant parts of
  `claude/fkit-claude-init.sh`, `claude/README.md`, `package.json`, `VERSION`, `RELEASING.md`,
  `.github/workflows/test.yml`, the handoff file, the reports folder's `README.md`, and the two
  repo-content guards in `test/`. Wiki: `wiki/systems/install-and-self-update.md` (no OS or
  uninstall facts).
- Every claim the plan adds is sourced in plan §1 (file + line, or the git command that shows it).
- Drafted the README in a scratch file and measured it: ≈ 173 lines (plan §2).

**Baseline `npm test` (before any change):** unit suites **1017 / 1017 pass, 0 fail** (24 suites).
`test/prove-red.sh`: hard gate **PASSED** (40 mutations each red, real + unmutated copy green).
`npm test` exit 0. After `plan.md` and this file were written, the repo-content guards
(`reference-integrity`, `coordination-citation-policy`, `task-id-uniqueness`) were re-run:
**85 / 85 pass**.

**Notes for other tasks:**

- **`0236`** — its sweep inventory lists `repo-root handoff-fkit-status-filtered-board.md`. If this
  plan is approved, the file moves (content unchanged) to
  `ai-agents/knowledge-base/reports/2026-07-18-handoff-fkit-status-filtered-board.md`. `0236` should
  look there, not at the root.
- **`0467`** — retiring the board reader must also remove `docs/board.md`, the README's *Web board*
  section and its `FKIT_AIBOARD` row, and the `CONTRIBUTING.md` board pointer.
- **`0476`** — `install.sh:127-131` still prints "Required: Codex", which contradicts the README.
  Not touched here.
- **Follow-ups, not in scope:** `claude/README.md`'s team-table *Tools* column predates ADR-022;
  `ai-agents/knowledge-base/architecture.md`'s repo tree will not list `docs/`, `CHANGELOG.md`,
  `CONTRIBUTING.md`; a `fkit-wiki` sync after close.

**Open for the owner:** plan §9, decisions D1–D5 (README length, Windows, outside contributions,
`RELEASING.md` + changelog, handoff file name).

**Decision log (unattended fixes / obvious-winner calls):** none — plan-only, nothing applied.

## 2026-10-02 — build, verify, commit, push (spawned `fkit-coder`, driven by `fkit-lead`)

> **Who wrote this.** A spawned `fkit-coder` on the lead's ADR-031 conductor path (not
> `fkit-sprint-ship-loop`). Authority: the owner's plan approval, relayed by the lead as verbatim
> `AskUserQuestion` option text — *"Approve — Your OK lets the coder build it, run the checks, commit
> and push to main; then review and close."* — plus D1 "Accept ~170", D2 "macOS & Linux; Windows via
> WSL, untested", D3 "Issues + PRs welcome", D4 separate follow-up task (lead files it), D5 date-prefixed
> name. This coder cannot verify that relay from its own context (no owner channel, ADR-021); it acted
> on it as stated, and the commit/push went through the permission system without a block.

**Pre-build check:** `git fetch` — `main` level with `origin/main`. `README.md`, `claude/README.md`,
`package.json` clean. Only unrelated `ai-agents/sprints/backlog.md` (modified) and this task folder
(untracked) — both left out of the commit.

**Built (per plan, D1–D5 applied):**

| File | Change |
|---|---|
| `README.md` | rewritten — 230 → **171** lines |
| `CHANGELOG.md` | new, 50 lines (plan §5.1) |
| `CONTRIBUTING.md` | new, 73 lines; D3 line at the top; no `TODO(owner)` |
| `docs/board.md` | new, 66 lines — old README board section moved in full |
| `claude/README.md` | +16 / −2 — the five merges of plan §5.4 |
| `package.json` | `description` only — seven roles, lead first |
| handoff file | `git mv` → `ai-agents/knowledge-base/reports/2026-07-18-handoff-fkit-status-filtered-board.md`, 100% rename |

Deviations from the plan text, all wording/placement only: D2 written as "**Platforms:** macOS and
Linux; Windows via WSL, untested."; D3 as the first line of `CONTRIBUTING.md` and "Issues and PRs
welcome — see `CONTRIBUTING.md`" opening the README's *Contributing* section; the layout tree's added
lines (`README.md / CHANGELOG.md / …`, `docs/`, `.github/workflows/test.yml`) are interleaved at their
natural places rather than appended. Every old layout line is still present verbatim (checked by script).

**Verification:**

- `npm test`: unit **1017 / 1017 pass, 0 fail**; `prove-red.sh` hard gate **PASSED** (40 mutations,
  each red; real + unmutated copy green); exit 0. First run, no flake, no re-run.
- Relative links in `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/board.md`,
  `claude/README.md`: **34 checked, 0 misses** (case-exact). Anchor `../README.md#roadmap` → README has
  `## Roadmap`.
- `grep -nE 'ADR-[0-9]+' README.md` → nothing. The word "ADR" appears on three lines: architect table
  row, glossary entry, and the one decisions-folder link in *Contributing*.
- No absolute machine paths in any of the five docs. No `TODO` left in any of them.
- GIF: line 5, plain image, no wrapping link. Video: bare standalone `user-attachments` line under
  *See it in action*.
- Codex wording: "Optional but recommended" + "loudly flagged as not model-diverse" kept.
- `package.json`: parses; description names seven roles incl. the lead.
- `docs/board.md` vs old README board section, word-level diff: only the new headings, the bold
  lead-ins that became headings, the `../` link prefixes, and "*Roadmap*" → `[Roadmap](../README.md#roadmap)`.
- **GitHub preview: not possible before the push** (straight to `main`, no branch). Badges, tables,
  GIF and video rendering are an owner post-push check.
- Manifest: not regenerated (nothing under `claude/scaffold/` changed); `structure-manifest.test.js`
  green inside `npm test`.

**Fact coverage — every old README block found at its new home (by grep of the fact's text, plan §4
rows):** all rows OK. Pitch / seven roles / front door / ship-loop / Codex optional + fallback / video
/ install commands / requires + Codex install / stop-vs-warn / same tab / Enter = lead / fresh-project
flow / two tabs / update check + `FKIT_NO_UPDATE_CHECK` / self-host + `FKIT_NO_SELF_HOST` / `fkit update`
scope, checkout refusal, stale un-relaunched project, `FKIT_SETUP_ONLY` → `README.md`. Stale
backlog-header note (full text, ADR-041) → `CHANGELOG.md`. Drift line → `README.md`; `.claude/` outside
the check, `/fkit-heal` never moves/renames/deletes, "still reports it in full" → `claude/README.md`.
Team table, eighth role, `/fkit-team`, agent-closed marker, two hops → `README.md`; ADR-031 link,
accepted-cost (ADR-018 §Decision 5), plain-`claude` sentence, marker sentence → `claude/README.md`
(added); ADR-012/018/022/028 links, "never a cycle" → `claude/README.md` (already there). Board
section → `docs/board.md` (ADR-051/052). Layout → `CONTRIBUTING.md`. Roadmap, License → `README.md`.
History (Omnigent, ADR-009/010) → `CHANGELOG.md`.
One soft spot: the old README **linked** ADR-033; it is now only **named** (unlinked) in
`claude/README.md`'s skills table header, as the plan's §4 accepted. Reachable via the decisions-folder
pointer.

**New-claim sources:** as in plan §1 (install.sh and launcher/setup-script line refs), re-spot-checked
this build: installer defaults and `curl`/`tar` check, PATH message, `FKIT_UPDATE_INTERVAL_MIN`
default 60, `FKIT_SETUP_ONLY` / `FKIT_NO_SELF_HOST` / `FKIT_CLEANUP_DRY_RUN`, the intake banner
text, the rules-block markers, CI triggers / Node 24 / full clone. Tag dates in `CHANGELOG.md`
re-read: annotated tag dates equal commit dates for every listed tag.

**Delivery record:**

- Commit `b3808cfddcd71daeef569919c437113d82b120f9` on `main` — "0478: Overhaul the README for
  first-time visitors"; 7 files, +336 / −192. Pushed: `9a37d4f..b3808cf main -> main`.
- Commit message carries: restructure summary, where each moved section lives, no `TODO(owner)`
  items, the GitHub "About"/topics owner step, README 230 → 171.
- `TODO(owner)` items in the text: **none** (D2 and D3 answered).
- **Owner manual step:** GitHub "About" description (from `package.json`) + topics `claude-code`,
  `ai-agents`, `codex`, `code-review`, `multi-agent`. Then look at the rendered README (badges, GIF,
  video player, tables).
- Notes for other tasks (unchanged from the plan): `0236` should look for the handoff file at its new
  reports path; `0467` must also remove `docs/board.md`, the README's *Web board* section and
  `FKIT_AIBOARD` row, and the `CONTRIBUTING.md` board pointer; `0476` still owns `install.sh`'s
  "Required: Codex" message; D4 changelog-at-release follow-up is the lead's to file.
- Not committed (task files ride the close): this `worklog.md`, `plan.md`, `brief.md`, `assets/`.

**Decision log (unattended fixes / obvious-winner calls):** none — built to the approved plan; the
deviations above are wording/placement within it, no review findings processed.

## 2026-10-02 — review round 1 processed (R1–R4), README fixed, committed, pushed

> **Who wrote this.** A spawned `fkit-coder` on the lead's ADR-031 conductor path (not
> `fkit-sprint-ship-loop`), running `/fkit-process-stateful-review`. Authority: owner rulings relayed
> by the lead as verbatim `AskUserQuestion` option text — R1 "Fix now + push", R2 "Add a short
> clause", R3 "README fix + bug task" (README wording only here; the launcher-bug task is the
> producer's, via the lead), R4 "Narrow it". This coder cannot verify that relay from its own context
> (ADR-021); it acted on it as stated, and the commit/push went through the permission system unblocked.

**Verified before editing:** all four findings CORRECT (details in `review.md` § Coder response).
R1 reproduced in a scratch fixture: the old per-project uninstall line, run in zsh, deleted a
`fkit-mine -> outside` symlink's target; with nothing matching, zsh aborted it (rc 1, nothing removed).

**Changed:** `README.md` only — § Why fkit (R4), § A first session step 6 (R2), § Configuration note
(R3), § Uninstall per-project commands now `find … -maxdepth 1 -name 'fkit-*…' -exec rm -rf {} +` plus
`rm -rf .fkit` (R1). +11 / −6.

**Verification (doc-only — owner ruling: no full `npm test` / `prove-red`):**
- R1 fixture, zsh / sh / bash: symlinked `fkit-mine` and `fkit-linked.md` targets intact, `.fkit` as a
  symlink → target intact; links and fkit files removed, non-fkit files kept; no-match case rc 0 and
  `.fkit` still removed; no-`.claude` case prints two `find` errors, rc 0.
- README relative links: 12 checked, 0 misses (case-exact); inbound `docs/board.md` →
  `README.md#roadmap` still resolves.
- `node --test test/reference-integrity.test.js`: 22 / 22 pass.

**Delivery:** commit `1c334bb` on `main` (README.md only, by path); `git fetch` showed origin level, no
rebase; pushed `b3808cf..1c334bb main -> main`. This file and `review.md` left uncommitted (ride the close).

**Decision log (unattended fixes / obvious-winner calls):** none — every fix applied was owner-ruled
(R1–R4). Wording calls inside the rulings: R1 chose `find … -exec` over plain no-slash globs because
plain globs still abort in zsh on no match; R3 dropped an extra "otherwise it reinstalls
`flashist/fkit@main`" clause as beyond the ruling (a fork's `install.sh` may default elsewhere).

## 2026-10-02 — review round 2 processed (R5), README fixed, committed, pushed

> **Who wrote this.** The same spawned `fkit-coder` (lead's ADR-031 conductor path, not the sprint
> loop), running `/fkit-process-stateful-review`. Authority: owner ruling relayed by the lead as
> verbatim `AskUserQuestion` option text — *"Fix: guard + accurate comment — One-line README change:
> skip the two lines if .claude is a link, and make the comment accurate. Coder commits + pushes;
> reviewer checks that one line; then 0478 closes."* Not verifiable from this context (ADR-021);
> acted on as stated; commit/push went through the permission system unblocked.

**Verified:** R5 CORRECT. Control: the `1c334bb` snippet run in zsh with `.claude -> ../shared` deleted
the `fkit-*` entries inside `shared/`.

**Changed:** `README.md` § Uninstall only — both `find` lines prefixed `[ -L .claude ] ||`; comment
reworded to "removes symlinked fkit-* entries, not their targets; skipped if .claude is a link". +3 / −3.

**Verification (doc-only — no full suite, per owner ruling):** fixture in zsh, sh and bash (snippet
extracted from the README itself): symlinked `.claude` → nothing in `shared/` touched, rc 0; normal
`.claude` with `fkit-mine -> outside` → link and fkit files removed, `outside/precious` intact, user
files kept, rc 0; no match → rc 0; no `.claude` → two `find` "No such file" errors, rc 0 (the last
command's). Also ran as `zsh -c` (paste-equivalent): same. Caveat: under `set -e` the no-`.claude` case
would stop at the first `find` (exit 1) — the reviewer's Codex probe noted this; it is a copy-paste
snippet, not a script. README links 12 / 0 misses, `#roadmap` anchor present;
`node --test test/reference-integrity.test.js` 22 / 22 pass.

**Delivery:** commit `2836b41` on `main` (README.md only, by path); origin level after `git fetch`, no
rebase; pushed `1c334bb..2836b41 main -> main`. `review.md` / this file left uncommitted.

**Decision log (unattended fixes / obvious-winner calls):** none — owner-ruled fix. Shape choice inside
the ruling: a per-line `[ -L .claude ] ||` guard rather than a `{ …; }` group, so each line stays a
single paste-safe command in zsh, sh and bash.
