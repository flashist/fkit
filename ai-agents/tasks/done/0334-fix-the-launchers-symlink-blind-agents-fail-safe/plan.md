# Plan — 0334: the launcher's agents fail-safe must require a usable agent file

## 1. Summary
- Replace the guard's name-existence test with a small function, `agents_usable`. It succeeds only when `.claude/agents/` holds at least one readable, regular `fkit-*.md` and nothing on the way (`.claude`, `.claude/agents`, the file itself) is a symlink.
- All three triggers are closed in the one `if`: symlink escape (A, B, C), dangling name (E), wrong type (F). Decision: an unreadable (mode 000) regular file also refuses.
- The `setup_ok = 0` gate is unchanged. The healthy path is unchanged: the function is not called when setup succeeded.
- Plain absence (D) keeps today's two-line message byte-identical. Every other cause gets a new message naming each offending path and why.
- ⚠️ Scope finding, measured: with today's init, cases A and B never reach this guard. Init refuses the `.claude` refresh, warns, and exits 0, so `setup_ok`=1 and the guard is skipped. This fix closes A and B only on a launch where setup also failed for another reason (Q1).

## 2. Measured firsthand (2026-10-16; scratch `mktemp -d`, removed after; repo not modified; launcher not executed; init run only against scratch projects)

| Case | Shape | old `ls` | `find -maxdepth 1 -type f` | new `agents_usable` |
|---|---|---|---|---|
| A | `.claude` → outside dir | rc 0 (skipped) | finds 1 | refuse: `.claude` symlink |
| B | `.claude/agents` → outside dir | rc 0 | 0 | refuse |
| C | leaf → outside file | rc 0 | 0 | refuse |
| D | real empty `.claude/agents/` | rc 1 (fires) | 0 | refuse, no reasons → today's message |
| E | dangling leaf | rc 0 | 0 | refuse: dangling |
| F | real dir `fkit-x.md` | rc 0 | 0 | refuse: directory |
| G | regular file mode 000 | rc 0 | 1 | refuse: not readable |
| H | healthy | rc 0 | 1 | launch |
| I | `.claude/agents` regular file | rc 1 | 0 | refuse: not a directory |

Real init against scratch projects:
- A → rc 0, with the warning "skipped the .claude/agents refresh: '.claude' is a symlink".
- B → rc 0, same warning.
- E → rc 0 and it self-heals: `rm -f` removes the link, fresh copies land.
- F, with real agents beside it → rc 1 (`rm: …fkit-x.md: is a directory`). The real agents are wiped and only the directory is left, so `setup_ok`=0 and the guard runs.

## 3. Design — candidate (i), a local lstat chain
- (ii) `find` rejected. Measured, it misses A, because path lookup follows the symlinked `.claude` before find starts, and it misses G. It needs the same ancestor `-L` tests anyway, and `-maxdepth` is not POSIX.
- (iii) A shared `path_contained` seam is rejected for this task. The chain is fixed (three parts), and extracting the function touches init, which 0336, 0328 and 0045 also touch. No file is added under `claude/`, so no manifest regen is needed.
- Note for 0330: no seam is built here.
- Semantics: refuse ANY symlink on the chain, even one pointing inside the project. This is init's `path_contained` rule, and it is stricter than "resolves outside the project". It is deliberate, and the worklog and close note record it.

## 4. Code — `claude/fkit-claude.sh`
Anchor: the comment beginning "The promise is "a setup failure never costs you a project that ALREADY has its agents"" and the line `if [ "$setup_ok" = 0 ] && ! ls "$proj"/.claude/agents/fkit-*.md >/dev/null 2>&1; then`.

New function, directly above the guard:
```sh
# Name existence proves nothing: the glob walks through a symlinked .claude or agents/, and a dangling
# link or a directory named fkit-*.md still matches (task 0334).
agents_usable() {   # → 0 if a readable regular .claude/agents/fkit-*.md exists with no symlink on the way; else one "    <path> — <why>" line per blocker
  for _p in "$proj/.claude" "$proj/.claude/agents"; do
    if [ -L "$_p" ]; then
      printf '    %s — a symlink; fkit will not read agents through one\n' "$_p"; return 1
    elif [ -e "$_p" ] && [ ! -d "$_p" ]; then
      printf '    %s — not a directory\n' "$_p"; return 1
    fi
  done
  _why=""
  for _a in "$proj"/.claude/agents/fkit-*.md; do
    if [ -L "$_a" ]; then
      if [ -e "$_a" ]; then _r="a symlink; fkit will not read an agent through one"
      else _r="a symlink to something that does not exist"; fi
    elif [ -d "$_a" ]; then _r="a directory, not an agent file"
    elif [ -f "$_a" ]; then
      [ -r "$_a" ] && return 0
      _r="not readable; check its permissions"
    elif [ -e "$_a" ]; then _r="not a regular file"
    else continue
    fi
    _why="$_why    $_a — $_r
"
  done
  printf '%s' "$_why"
  return 1
}
```
The guard:
```sh
if [ "$setup_ok" = 0 ] && ! agents_why="$(agents_usable)"; then
  if [ -z "$agents_why" ]; then
    echo "⚠ fkit has no agents installed here, so there is no session to start." >&2
    echo "  Setup could not write to the project — check that $proj is writable, then: fkit" >&2
  else
    echo "⚠ fkit found nothing here it can launch as an agent, so there is no session to start:" >&2
    printf '%s\n' "$agents_why" >&2
    echo "  An agent must be a readable, regular .claude/agents/fkit-<role>.md, with no symlink on the way." >&2
    echo "  Fix or move what is named above, then: fkit" >&2
  fi
  exit 1
fi
```
- Today's two lines stay byte-identical. They are used only for plain absence.
- `--agent` is never dropped, and the ADR-010 fail-open comment paragraph stays.
- The existing comment phrase "If setup failed AND no fkit agent was ever written to disk" becomes "If setup failed AND no usable fkit agent is on disk". The rest of that block is left for 0508, the comments-only cleanup sequenced after this task. New comments are at most 2 lines and say WHY only.
- `set -eu`: the function runs inside `! var="$(…)"`, and there are no pipelines.

## 5. Tests — new `test/launcher-agents-guard.test.js`, plus one harness option
- `test/harness.mjs`: `runFkit(args, { project, extraEnv = {}, launcher = LAUNCHER } = {})`. This is backward-compatible.
- `before()`: copy `dirname(LAUNCHER)` to `mkdtemp/claude`, so prove-red's mutants are what gets tested. Replace the copy's `fkit-claude-init.sh` with the stub `#!/bin/sh` / `exit "${FKIT_STUB_INIT_RC:-1}"` (mode 755). Why: real init exits 0 for A and B, so a real init can never reach `setup_ok`=0 for them. Precedent: `structure-notice.test.js` already runs a copied `claude/` tree.
- Each project gets its own `mkdtemp` plus a non-fresh `ai-agents/knowledge-base/PROJECT.md`. Outside targets live in a separate `mkdtemp`. Cleanup runs in `finally`/`after`. The harness stubs `claude`, `codex` and `curl`.
- Every refusal test asserts all of these: `r.exec === false`; `r.code === 1`; stderr contains the new headline, the offending absolute path and its reason; stderr contains no "is writable" text.
- Tests (each name is a prove-red anchor):
  - `0334/A`, `0334/B`, `0334/C`, `0334/E` — as in the table.
  - `0334/F+D` — one test body, one launcher copy, two launcher runs (one project each). D refuses with today's two lines, asserted exactly. F (a real directory at `.claude/agents/fkit-x.md`) refuses with the new message, which names it and says "a directory". F's fixture is lstat-checked first to contain no symlink.
  - `0334/unreadable` — the only file is mode 000 → refuses with "not readable". Skipped as root (the `asRoot` precedent). Mode is restored before cleanup.
  - `0334/not-a-dir` — `.claude/agents` is a regular file → refuses.
  - `0334/healthy` — a readable `fkit-coder.md` with setup failed → exec, argv starting `--agent fkit-coder --settings`. The setup-failed warning is present; the refusal headline is absent.
  - `0334/mixed` — one good file plus a dangling link and a directory → launches.
  - `0334/gate` — `FKIT_STUB_INIT_RC=0` and an empty agents dir → exec with `--agent fkit-coder`. This proves the gate is intact.
- The ordinary launch through a real init stays covered, unchanged, by `launcher-contract.test.js`.

## 6. `test/prove-red.sh` — mutations 49–53
prove-red already reaches the launcher (`FKIT_LAUNCHER` on a `make_claude_copy` tree). 0037 is about init, not this.
- New runner `run_agents_guard_suite <launcher>`: `FKIT_LAUNCHER="$1" node --test "$repo/test/launcher-agents-guard.test.js"`, with the same `$out`/"reused" contract as the others. Steps 0a and 0b still run the new file inside the full suite.
- Each mutation gets its own `step N`, a `make_claude_copy`, and the no-op / single-line / landed guards that 44–48 use:
  - **49:** `^agents_usable() {.*$` → `agents_usable() { ls "$proj"/.claude/agents/fkit-*.md >/dev/null 2>&1 && return 0`. Must red at `0334/F+D`; D's half still passes.
  - **50:** the same, with `ls -L`. Must red at `0334/A` and `0334/F+D`; `0334/E` stays green.
  - **51:** `if [ -L "$_p" ]; then` → `if false; then`. Must red at `0334/A`; `0334/F+D` stays green.
  - **52:** `[ -r "$_a" ] && return 0` → `return 0`. Must red at `0334/unreadable`. As root it prints "skipped as root" and does not fail.
  - **53:** `if [ "$setup_ok" = 0 ] && ! agents_why=` → `if ! agents_why=`. Must red at `0334/gate`.
- Header FORTY-EIGHT → FIFTY-THREE; index lines 49–53; the `step end` comment updated.

## 7. Docs
- `CHANGELOG.md` `## Unreleased`: one bullet, scoped to "when setup fails". The launcher no longer starts a session on agents it cannot use (a symlinked `.claude` or agents dir, a dangling link, a directory, an unreadable file); it refuses and names the path.
- `ai-agents/knowledge-base/architecture.md` §5.1 flow sketch: one line — setup failed AND no usable agent → refuse, exit 1.
- No ADR, no manifest regen, no wiki write. The worklog and close note state plainly that A/B/C are refused only on a setup-failed launch, and that the any-symlink strictness is deliberate.

## 8. Checks
- Fast first: `node --test test/launcher-agents-guard.test.js test/launcher-contract.test.js`.
- Red-first: the new file against the unpatched launcher must red at A/B/C/E/F+D/unreadable/not-a-dir and stay green at healthy/mixed/gate.
- `sh -n claude/fkit-claude.sh`, plus the function run under `/bin/dash` in scratch.
- `npm run test:unit`, then `npm test` in full, with the count stated. prove-red runs alone, because 0284's timing tests are load-sensitive. shellcheck is skipped (not installed); that is stated, not counted as passed.
- Review scope: `claude/fkit-claude.sh`, `test/prove-red.sh`, `CHANGELOG.md` and `architecture.md` carry uncommitted 0284 changes. Either the reviewer is told which hunks are 0334's (`agents_usable` + the guard, mutations 49–53 + the runner, the new test file, the harness option, the two doc lines), or the owner commits 0284 first.

## 9. Edge cases
- Unmatched glob → the literal pattern → `continue` → today's message.
- A dangling `.claude` → "a symlink".
- Paths with spaces are quoted. A newline in a filename splits a reason line; stderr only, harmless.
- A leaf symlink inside the project is refused. This is deliberate.
- As root, `-r` is always true.
- A mixed dir with at least one good file launches, as today.
- An unreadable or unsearchable `.claude/agents` directory: the glob matches nothing, so the user gets today's "check … writable" message. Accepted: init failed there too, and permissions is the right pointer.
- TOCTOU between check and exec: inherited, not widened. Cost: the function runs only when setup failed.

## 10. Residuals / not done
- A/B on a launch where setup succeeds (Q1).
- The guard checks "any agent", not "this role's agent". That goes into Q1's follow-up.
- The folder slug rename stays the owner's question from the brief; this plan does not rename.
- 0519: no overlap. This task reads only `.claude/agents/`, and the launcher sources `$here/skills-for-role.sh` from the install share, not `.claude/skills-for-role.sh`.
- Not closed here: 0336, 0330, 0328, 0329, 0332, 0045, 0037. 0508 runs after this task.

## 11. Open questions
Q1 — A/B when setup succeeds:
1. **(Rec)** Ship as scoped, and the producer files one follow-up brief covering this and the role-file residual.
2. Widen 0334 to drop the gate. This refuses every launch of a project with a deliberately symlinked `.claude`.
3. Accept the residual.

## Owner rulings at the plan gate (2026-10-16, AskUserQuestion, fkit-lead session)

This section is the lead's; the plan above and the post-Codex questions below are copied from the
coder's return. Where they differ from the plan above, the rulings and the adopted fixes below govern.

- PC1 + PC2: **"Both (Recommended)"** — PC1 and PC2 are adopted with their drafted text below.
- PC3: **"Refuse any symlink (Recommended)"** — option 1; the drafted §3 line applies, with `<date>` = 2026-10-16.
- Q1: **"Ship as scoped + follow-up brief (Recommended)"** — option 1; a producer files the follow-up brief (setup succeeded but agents reached through a symlink, plus the role-file residual). Not part of this build.
- Slug rename (carried from the brief): not put to the owner; no rename.
- Plan: **"Approve (Recommended)"**.

## Post-Codex questions (for the owner; the plan text above is unchanged)

PC1 — Fix the prove-red mutation mechanics (X2 + X3). Recommended: adopt this replacement for §6's mutation bullet lead-in:
  "Each mutation gets its own `step N` and a `make_claude_copy`. The mutant line is built with awk (the mutation-19 / getline pattern), matching the target line by literal text with `index()`, never a regex, so `[`, `]` and `&` cannot misfire. The no-op, single-line and landed guards stay. Every step 49–53 also requires `0334/healthy` to stay GREEN, so a mutant that breaks the launcher's syntax cannot pass as a catch."
  Options: (1, Rec) adopt as drafted; (2) keep sed but escape `[ ] &` per anchor (cheaper, easier to get wrong again); (3) Explain more.

PC2 — Canonical project paths in tests (X4). Recommended: add to §5, after "Each project gets its own mkdtemp…":
  "Each project and outside dir is `realpathSync`'d at creation (macOS: `/var` → `/private/var`; the launcher's `proj` is `$PWD`, which is physical here), and every path assertion uses that form. Assertions are never loosened to get green."
  Options: (1, Rec) adopt as drafted; (2) Explain more.

PC3 — Refuse an in-project symlink? (X5). Today, on a setup-failed launch, a project whose `.claude`, `agents` dir or agent file is a symlink pointing inside the project starts a session. Under this plan it is refused. The brief only demands refusal when the file resolves outside the project.
  Options:
  (1, Rec) Keep the strict rule, matching init's `path_contained`, which already refuses to refresh through any symlink. Drafted §3 line: "Semantics (owner-ruled <date>): refuse ANY symlink on the chain, even one inside the project — init's `path_contained` rule; such a layout is already unsupported by init's refresh."
  (2) Allow in-project symlinks: resolve each component (`cd … && pwd -P`) and refuse only on escape. More code; it diverges from init's rule, and it needs extra tests (in-project link launches; outside link refuses).
  (3) Explain more.
