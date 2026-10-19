# Plan — 0508: comment cleanup of the launcher and init scripts

## 0. Summary
- **Scope: 2 files, comments only.** 875 comment lines by the brief's grep (`/usr/bin/grep -cE '^[[:space:]]*(#|//|\*|/\*)'`, 2026-10-18): `claude/fkit-claude.sh` 382, `claude/fkit-claude-init.sh` 493. Both counts include the shebang. Init's count also includes 10 `#` lines that are DATA inside the `INTERVIEW` heredoc. Expected after: about 250.
- **No code line changes.** Proof per M3:
  - `norm` + `bash -n`, plus `/bin/sh -n` for the launcher (its shebang is `#!/bin/sh`);
  - the rule-4 check (both files are 100755 and run directly, so line 1 and the file mode matter);
  - the secondary diff-line grep.

  Expected V1 exceptions: three code lines in `merge_rules` lose a trailing comment (`rm -f "$tmp"; trap - EXIT`, `return 0`, and the `fi` after `if cmp -s "$tmp" "$f"`).
- **Kept byte-identical (PC-2):** the launcher's copy of the mirror-checklist block, from "⚠️ CHANGING A ROLE'S SKILLS?" through "…without pulling in this script's top-level side effects)." (20 lines). Named V6 exception.
- **No reason moves into the knowledge base (expected).** Every long reason either fits in 1–2 lines or already has a durable home:
  - ADRs 009, 010, 012, 015, 016, 018, 030, 031, 039, 054;
  - closed tasks 0023, 0046, 0072, 0088, 0130, 0139, 0177, 0190, 0247, 0257, 0284, 0302, 0327, 0334, 0379, 0481;
  - report 2026-07-14-migration-mechanism §9.

  If a reason has neither, the build stops and asks (M1).
- **Rule-5 fixes outside the 2 files (comments and docs only):**
  - `ai-agents/knowledge-base/architecture.md`;
  - `RELEASING.md`;
  - `test/structure-notice.test.js` (1 header comment line);
  - `test/structure-manifest.test.js` (1 comment);
  - `bin/generate-structure-manifest.mjs` (3 comments).
- ⚠️ **New fences for this unit (§3):** prove-red's mutant-landing greps read the WHOLE launcher copy. Init's orphan gate greps every file under `claude/` at run time, comments included.
- **Method amendment M4l (§2):** init's numbered section labels are anchors and stay.
- **Repo state:** both files equal HEAD (`78b7464`). Uncommitted nearby: `test/prove-red.sh` (1 comment line, 0507 review R2) and `architecture.md` (2 lines, 0507). Neither is in this unit's files.

## 1. Context checked
- `git diff HEAD --stat` on both files is empty; both are 100755.
- Tools on HEAD (bash 3.2.57, node v24.13.0): `norm` exits 0 with non-empty output (21415 and 25544 bytes); `bash -n` exits 0. Neither file has a multi-line `$(`, so bash 3.2's false-alarm case does not arise. `norm` strips the comment inside `_fkit_deadline`'s `( trap … )` subshell and keeps the INTERVIEW heredoc verbatim.
- M4h on HEAD: 65 comment runs over 2 lines (27 in the launcher, 38 in init). 6 comment lines are over 110 columns, all in the launcher: lines 17, 61, 93, 170, 345 and 348 (the last two are inside the mirror block).
- Neither file cites itself by line number, so 0373 does not apply.
- No `.claude/` copy is edited and init is not run. No CHANGELOG line (comments only).

## 2. Method
0507's M1–M4j as amended through 0507 review R9, plus 0510's M4k as amended for 0510 review R1, applied as written. Highlights:
- M1: pointers only; stop and ask if a reason needs a new home.
- M2: task-qualified IDs, checked unique. 0072's ledger reuses no ID: each appears once in the findings and once in the response.
- M3: `norm`, `bash -n`, `rule4.sh` and `git diff HEAD --summary`.
- M4b: dividers deleted. M4c: re-anchor on code. M4d/R4: ADR quotes left and listed.
- M4f: prove-red. M4h: block-aware awk, width ≤ 110, and `datarun.sh` for data runs.
- M4j: small comments. M4k: fences.

**Amendment M4l — numbered section labels are anchors.**
- Init's six step labels (`# 1. ai-agents/…` … `# 6. the Omnigent orphan residue`) are cited by number in live text:
  - `test/init-claude-refresh-guard.test.js` ("§3 is init's");
  - `test/init-intake-guard.test.js` and `test/orphan-cleanup.test.js` ("init's §4");
  - `claude/orphan-targets` ("Init's step 3");
  - `architecture.md` ("step 3");
  - init's own comments, and many ADRs and open briefs.
- M4b would delete a WHAT label only after re-anchoring every cite. For a numbered section that means rewriting at least 5 live files and leaving the ADR and brief cites dangling.
- **The rule:** a section label that live text cites by number stays, as the first line of that section's comment (2 lines at most). Its wording may change as long as every phrase another file quotes survives. Unnumbered dividers are still deleted (M4b).
- Recorded in this task's worklog under "Method for the series", as 0510 did for M4k, so 0509 and 0511–0515 inherit it.

**M4c clarification (not a change).**
- A *code comment* in another file that cites these files by line is re-anchored by name (code-comments.md rule 2: never by line number).
- A *doc* cite (`architecture.md`, `RELEASING.md`) keeps the `path:NNN` form, renumbered to the final tree and paired with code text. This follows 0507's precedent and the durable-citation convention's row 1 for source files.

**Pointers.** Every pointer in the drafts below is checked by hand at build time (M4e). If the target does not hold the reason, the pointer is dropped, the reason stays in the comment, and the decision log records it.

**Widths.** Drafts aim at 110 columns or less, measured with indentation, in code points. A line found over the limit is rewrapped within the same words, and the rewrap is logged. Two comments that would touch get a real blank line between them.

## 3. Fences (M4k) — found before any edit
Searches run:
- the two file names across `test/`, `bin/`, `claude/` and `install.sh`;
- the exported constants `LAUNCHER` and `INIT`;
- `.toString()`;
- the bodies of the mutations in `test/prove-red.sh`;
- init's own run-time reads of `claude/`.

| # | Reader | Kind | What it means for comments |
|---|---|---|---|
| F1 | `test/prove-red.sh` "did not land" greps over the whole mutated launcher (mutations 17, 41, 44–48) | must-not-contain | No launcher comment may contain `newer content on`, `rver:-?`, `FKIT_REPO="$fkit_repo"`, `_fkit_deadline "$FKIT_NET_TIMEOUT"`, `ps -A -o pid=`, `--max-time "$FKIT_INSTALLER_FETCH_TIMEOUT"`, `kill -9 `, `kill "$_fkit_dl_dog"` or `mutation:`. None does today. |
| F2 | prove-red mutations 49–55 (`swap_literal_line` / `check_literal_swap`; `grep -cFf anchor` must be 1) | exact-count = 1, on code | Each of `agents_usable() {`, `if [ -L "$_p" ]; then`, `[ -r "$_a" ] && return 0`, `if [ "$setup_ok" = 0 ] && ! agents_why=`, `if [ -L "$_a" ]; then` and `elif [ -e "$_p" ] && [ ! -d "$_p" ]; then` matches one code line. No comment may contain any of them. |
| F3 | prove-red seds and awks on whole launcher lines (mutations 2, 15, 16, 17, 30, 31, 41, 44–48) | the line stays byte-identical | **Never touch a line any mutation anchors on, trailing comment included.** So the long trailing comment on `agents_usable() {` stays as it is. |
| F4 | init's `orphan_refs` at run time: a `grep -rlEi` of each `claude/orphan-targets` entry, with a boundary, over every file under `claude/` except `orphan-targets` | must-not-contain | No new comment in either file may name `.fkit/agents`, `.fkit/run`, `.fkit/team-session` or `.omnigent`, in any case. A hit makes every later launch REFUSE that cleanup. Checked after each file against the HEAD result; today only `orphan-targets` hits. |
| F5 | `test/rules-block-budget.test.js` reads `INIT` as text: `^RULES_MAX=(\d+)`, `^RULES_BEGIN='(.*)'$`, `^RULES_END='(.*)'$`, a greedy `^RULES_TAG='.*'`, and `sed -n '/^emit_block() {/,/^}/p'` | exact lines | Those code lines stay byte-identical. The trailing comment on the `RULES_TAG=` line is not touched, because an added `'` would break the greedy extract. |
| F6 | live text that quotes these comments (§6) | must-contain | The phrases listed in §6 survive verbatim. |

Nothing reads `LAUNCHER` as text. No `.toString()` reaches either file. No prove-red mutation targets init; init is only copied whole.

## 4. `claude/fkit-claude.sh` (382 → about 110)
Deleted outright:
- the `# --- … ---` dividers;
- the two `# -----` rules around the ownership block;
- "Explicit: `fkit update`…" and "An explicit role as the first bare word skips the menu." (WHAT).

**Header (2–30) → three comments, blank lines between:**
- `# fkit launcher: set the project up (idempotent), then exec a ROLE-LOCKED Claude Code session in this tab.` / `# The menu is deterministic: picking a role is an if/else, not a judgment call.`
- `# Locked twice: --agent fkit-<role> (ADR-010) and a PreToolUse hook that denies any `Skill` call whose REAL` / `# invoking agent's role doesn't own it, at any spawn depth (ADR-018).`
- `# Want two roles at once? Open a terminal tab yourself: automating it needs AppleScript/Accessibility` / `# permissions that fail in worse ways than pressing Cmd-T.`
- Dropped: the usage lines (`--help` prints them), the env lines (README's env table), the usage-error history (it moves to that guard's comment), and the "foreign skill visible" cost (ADR-018 Decision 5).

**Update and network sections:**
- **Self-hosting (35–41)** → `# In an fkit checkout, re-exec its own claude/fkit-claude.sh: setup copies agents/skills from $here, and the` / `# installed snapshot would overwrite the project with an older fkit. FKIT_NO_SELF_HOST=1 makes it run once.`
- **Self-update (53–67)** → `# Self-update NOTIFIES, never auto-updates or re-execs (ADR-009 Decision 3). Every launch runs the check,` / `# so offline / proxied / captive-portal must cost nothing and print nothing.` (env lines dropped; README has them)
- **Timeout contract (69–71)** → `# Each startup-check call gets FKIT_NET_TIMEOUT s and fails silently (git via the watchdog, +1 s if git` / `# ignores TERM); fkit update's install.sh download gets FKIT_INSTALLER_FETCH_TIMEOUT and fails loudly (0284).`
- Lines 79–80, 86 and 107 unchanged. Line 93 → `# git works in child processes: kill its direct children too, and KILL in case TERM is ignored.`
- **`_fkit_reinstall`:**
  - 128–130 → `# Download first, then run: piped into sh, a failed download ran an empty script and printed success (0481).`
  - 134–137 → `# The installer's variables go on the sh after the pipe: a prefix reaches only its own command, so the old` / `# form gave them to curl and the installer ran on its defaults (0481).`
- **Update case:**
  - 159–164 → `# Reinstall into the SAME install (0481): unless FKIT_SHARE names it, refuse a symlinked or copied fkit` / `# (install.sh would rm -rf under the wrong root); refuse an unknown bin dir rather than install a 2nd copy.`
  - 169–170 → `# An explicit FKIT_SHARE holding an install supplies its own repo/ref/bin (env still wins); otherwise a fork` / `# or pinned install reached through it would revert to flashist/fkit@main.`
- Line 198 ("Automatic: a throttled check that only ever PRINTS…") unchanged.
- **Banner (215–228)** → `# Label what triggered: the trigger is a sha compare, so say "vA → vB" only for two DISTINCT known versions,` / `# else name the shas (0257). A remote version is not always knowable (no curl; ls-remote returns refs).` — blank — `# Scope (0257): only the empty-version "v?" is gone; nothing is validated, so a garbage VERSION still` / `# renders verbatim.`

**Role parsing and ownership:**
- **`team` alias (274–288)** → `# team / team room are deliberately NOT accepted, here or at the menu; lead is the only word (0140).` / `# Read 0139 review R1, R3 before re-adding: argv is split, so fkit team room passes room on as a prompt.`
- **Usage-error guard (296–308)** → `# No role named but args remain → usage error, before setup and every claude exec: a stray word once let` / `# fkit --resume resume ANY session under the lead's lockdown (ADR-010; 0073). Args after a role pass through.`
- **Ownership (316–330)** → `# skills_for_role() is the one source of role→skill ownership (ADR-012 §1; no skills: frontmatter — it is` / `# only a preload hint). A PreToolUse hook enforces it at any spawn depth (ADR-018).` Then a blank line, then **lines 331–350 byte-identical (PC-2)**, then `. "$here/skills-for-role.sh"`.

**`build_settings`:**
- **Preamble (354–366)** → `# Settings go in a FILE, not argv: a tab with no title shows the command line, and the JSON makes every tab` / `# look alike. The retired skillOverrides off-list and CONSULT_SKILLS stay retired (ADR-018).`
- **Hook commentary (368–402) → three comments:**
  - `# bash "<path>", never the bare path: the exec bit may not survive install (ADR-017 rule 2). An absolute` / `# $here is safe only because this file is regenerated every launch, never committed.`
  - `# Hooks, each documented in its own script: Skill ownership (ADR-018); AskUserQuestion marker + Stop` / `# (ADR-030; Stop only, never SubagentStop, so a consult is never blocked); ship-loop marker (0129); carry-check (0204).`
  - `# Launcher sessions only: a running session gets it at its NEXT launch, never mid-session.`
- Lines 404–405 unchanged.
- **407–417** → `# The lockdown is NOT optional (ADR-010): if .fkit/ is unwritable, pass the same JSON inline (ugly tab title,` / `# no temp file). The subshell keeps a failed redirect's "Permission denied" inside the 2>/dev/null.`
- **Tab title (427–428)** → `# Name the tab until Claude Code auto-titles it, so a wall of fkit tabs is readable.`

**Setup and the agents guard:**
- **434–441** → `# Setup runs every launch, quiet on a set-up project, and is best-effort (0088):` / `# A user must always be able to reach their agents, even when fkit cannot finish setting the project up.`
- **450–452** → `# init's exit 3 = set up, but ai-agents/ refused: a success. Taken as a STATUS, never re-tested here —` / `# the two copies drifted the first time we tried that.`
- **467–475** → `# Setup failed and no usable agent: claude --agent would die on its own confusing "agent not found", so` / `# refuse. Never drop --agent — an unroled session fails OPEN (ADR-010). Names alone prove nothing (0334).`

**Structure notice (515–575) → three comments:**
- `# Launch-time structure notice (0247; ADR-039 Decision 3): ONE stderr line when the project diverges from` / `# what the installed fkit ships. Awareness only; /fkit-heal repairs. Contract: 0247 plan §2–§3, review R1, R2.`
- `# Reuses the SHARE's check.sh rows (a second classifier would drift). Read-only, no state, no kill-switch;` / `# every failure is silent and non-fatal, except a filter failure: that drops suppression, never the notice.`
- `# ⚠️ A bad intent file suppresses NOTHING — inverted from keep-out on purpose: keep-out gates a write, this` / `# gates silence. Do not "fix" it into keep-out's direction.`
- Lines 583 and 622–623 unchanged.

**FKIT_SETUP_ONLY and Codex:**
- **632–633** → `# FKIT_SETUP_ONLY is a setup CHECK: non-zero when setup failed.`
- **Codex (646–655)** → `# Codex preflight: optional but recommended — a WARNING, never a wall (ADR-054). Loud here, where the user` / `# can still fix it: a "second opinion" silently run on Claude is not model-diverse.`

**Fresh project and cold start:**
- **669–687** → `# Fresh project: run the producer's cold start (it owns fkit-initiate-project), then open the lead (ADR-031;` / `# 0379) — only if the initiation landed; otherwise back to the shell, never a forced session.` — blank — `# A refused ai-agents/ is NOT fresh: PROJECT.md is missing for another reason, so the cold start could never` / `# complete. aa_refused comes from init's exit 3; never re-derive it here.`
- **689–693** → `# One freshness test, asked before and after the cold start: two hand-copied greps would drift silently.`
- **700–707** → `# setup_ok too: one exit status cannot carry two facts (a refusal then a failure exits 1, not 3), and a` / `# setup that cannot write the project cannot be initiated into.`
- **725–727** → `# Not exec, and the || is load-bearing: under set -e a non-zero claude (Ctrl-C) would kill the launcher here.`
- **730–732** → `# Landed only if it exited 0 AND the tree is no longer fresh; either half alone opens the lead wrongly.`
- **734–735** → `# Fall through to the tail with role=lead: no new exec, no seed.`
- **738–742** → `# The owner was promised the lead: say why not, but open nothing; the exit code stays the cold start's.`
- The mutated `claude --agent fkit-producer …` line is not touched (F3).

**Menu and the tail:**
- **Menu (748–757)** → `# The menu (deterministic; no LLM), only with no role, no args and a terminal. Probe /dev/tty by OPENING it:` / `# [ -r /dev/tty ] is true with no tty, and exec 3</dev/tty would die under set -e (0042).`
- **787–792** → `# Enter → lead, matching the headless default below (0302). EMPTY only: *) still re-prompts, so "anything` / `# unmatched means lead" can never return.`
- **800–801** → `# No role and no tty (piped / CI) → lead is the safe default (args were rejected above).`
- **807–808** → `# "runnable", not "exist": a foreign skill still shows in the / menu; the hook denies it (ADR-018 Decision 5).`
- Trailing comments on code lines stay unchanged (M4j). No launcher V1 exception is expected.

## 5. `claude/fkit-claude-init.sh` (493 → about 140)
**Header and convergence:**
- **Header (2–24)** → `# One-command, idempotent fkit setup for a project; the numbered sections below are its steps.` Line 23 (`# Usage:  claude/fkit-claude-init.sh <project-root>    # e.g. …`) stays unchanged, because architecture.md quotes it. Line 24 and the step list are dropped: the step labels carry the steps, and §6 carries the delete warning.
- **Convergence (33–58)** → `# Convergence (ADR-015): NEVER writes to a path that already exists; create-if-absent only in ai-agents/.` / `# Never make it overwrite "stale" files: that safety IS its limit. Drift repair is /fkit-heal's (ADR-039).`
- **60–63** → `# An if, not [ … ] && set +f: under set -e a failing trailing test kills init.`
- **74–84** → `# keep_out is user input: pin IFS to newline and set -f, so a path with a space never splits and wiki-* is` / `# never globbed against the cwd (0023 review R3). Restored at every return.`
- **90–98** → `# .fkit-keep-out: a deliberate deletion stays deleted. TRACKED in ai-agents/, never the gitignored .fkit/,` / `# so a teammate's clone honours it.`
- **101–108** → `# An opt-out we cannot read fails CLOSED: skip convergence and say why, never guess (0023 review R1).`
- Lines 122–123 and 150 unchanged. **157–158** → `# An entry covers the path and everything under it.`
- **134–143** → `# LC_ALL=C sort order: a parent always precedes its children, so created_dirs is known in one pass.` — blank — `# ⚠️ Fed by heredoc, never find | while: a piped loop runs in a subshell and would announce NOTHING.`
- **165–170** → `# [ -L ] FIRST, ALWAYS: -e/-d dereference, so a symlinked subdir or a dangling link would be written through.` / `# -L is the one test that does not lie.`
- **179–181** → `# THE INVARIANT: the path exists, do nothing. A scaffold dir over a user FILE is refused, never written into.`
- **187–190** → `# A dir we cannot read into makes every child look absent: refuse it once (0023 review R4).`
- **199–201** → `# Non-fatal per write: convergence must never cost the user the rest of setup.`
- **215–223** → `# THE .gitkeep RULE: create one only in a directory THIS pass created; a resurrected .gitkeep in a directory` / `# with content would dirty git status on every launch.`
- **246–261** → `# ⚠️ THE OUTPUT TRAP: announce on STDERR — the launcher sends init's stdout to /dev/null on exactly the` / `# set-up projects convergence runs on. Say nothing when nothing was created.`
- **`path_contained` (273–292)** → `# Containment: refuse an absolute path, any '..', and a symlink at ANY component, not just the leaf; never` / `# normalize, then check (0072 review R1, R3; 0046 extended it to writes).`

**§1 and §2:**
- **§1 (315–326)** → `# 1. ai-agents/ working structure, never clobbered; a refusal skips only this step, on STDERR (OUTPUT TRAP).` / `` # PREFLIGHT FIRST, -e/-d dereference: `[ -L ]` is the one test that does not lie, so it has to come first. ``
- **§2 (351–361)** → `# 2. CLAUDE.md and AGENTS.md (Claude reads one, Codex the other): created when absent; otherwise fkit` / `# rewrites only its marker-delimited rules block, never the owner's text outside it (ADR-016).`

**Rules block:**
- **Rules cap (364–386)** → `# The cap forces an eviction conversation (0130, owner ruling; attention dilution is suspected, unmeasured).` / `# Raising it needs an owner-signed bump (ADR-016; 0190 set 4352); keep >= 400 B free (0130).` — blank — `# Measured on specific builds (0130, 0177): Claude Code strips the wrapper's HTML comments, codex does not;` / `# re-measure when either moves.` (F5: `RULES_MAX=4352` untouched)
- **404–406** → `# Cap the EMITTED block, not the source: the block is what every agent pays for.`
- **`marker_lines` (414–423)** → `# Whole-line match, never a substring: a marker quoted in prose must stay inert (it once deleted owner text).` / `# \r is trimmed too, or a CRLF file never matches its own markers and gains a new block every launch.`

**`merge_rules`:**
- **430–431** → `# [ -L ] FIRST: -e/-f dereference, so a symlink would be written through.`
- **445–448** → `# set -- rather than | head -1: under pipefail an early-exiting head SIGPIPEs the producer, and set -e` / `# kills init on the path whose job is to refuse gracefully.`
- **455–456** → `# Clean the temp file on any exit: a set -e abort must not strand it in the owner's project.`
- **459–462** → `# No block yet: append once at EOF, adding the separating newline ourselves.`
- **465–480** → `# One well-formed pair: replace the region IN PLACE. Content we did not tag got there another way (a marker` / `# in a code fence): proceed, but warn on stderr.` — blank — `# Guard the range: for an adjacent pair, sed -n '5,4p' prints the START line, so fkit's own bare pair` / `# looked foreign and every new project warned.`
- **483–485** → `# case, not printf | grep -q: grep exits on its first match, and EPIPE under pipefail inverts the test.`
- Lines 498–499 unchanged.
- **507–509 trailing comments** → one line above `if cmp -s "$tmp" "$f"; then`: `# Unchanged: say NOTHING. A per-launch "rewrote CLAUDE.md" trains people to ignore init's output.` The three trailing comments are deleted (V1 exceptions). Line 510's trailing comment is unchanged.

**§3 (529–577) → label plus three comments:**
- `# 3. refresh the fkit-managed agents + skills: rm + cp of the two fkit-* patterns ONLY, a user path` / `# squatting one is deleted and NOT put back. Non-fatal; init's exit status unchanged (0327, ruling Q1a).`
- `# [ -L ] FIRST, ALWAYS, before the mkdir: rm and cp dereference, and a symlinked .claude once lost the user's` / `# agents and skills AT THE LINK TARGET with exit 0 (0327). Two calls, because each half survives alone.`
- Above `skills_entries_contained`: `# The fkit-* entries get their own walk, with NO trailing slash: fkit-*/ resolves a live link before rm` / `# runs, and cannot see a dangling one (0327 review R1, R2).` — blank — `# The whole skills half is refused, not one entry: cp -R copies every payload name in one call.` / `# The message names the offending entry so the user knows which one to move.`
- Lines 587–588 unchanged. **622–623** → `# Announce only the halves that ran; both → the same line this has always printed.`

**§4 and §5:**
- **§4 (632–646)** → `# 4. first-run intake: a terminal questionnaire before any LLM starts, written to .fkit/intake.md.` / `# [ -L ] over the whole chain first: mkdir -p and cat > dereference (0046). Non-fatal; warns on STDERR.`
- **INTERVIEW heredoc (656–709): DATA, untouched.** Its `#` lines (657–659, 663–664, 666–670) are output. The 3-line and 5-line runs are named V6 exceptions (rule-1 data), each proven DATA with `datarun.sh`.
- **§5 (714–716)** → `# 5. gitignore the fkit-managed copies, never the whole .claude/: the project's own settings stay tracked.`

**§6 (730–790) → label plus two comments:**
- `# 6. the Omnigent orphan residue. ⚠️ THE ONLY PLACE FKIT DELETES OUTSIDE THE NAMESPACE IT MANAGES (a path` / `# named in a list); §3 deletes too, unrecoverably for a squatter (0327 review R3; D1 in its refresh test).`
- `# Why: ADR-009 removed the runtime that left them (0072; report 2026-07-14-migration-mechanism §9). Targets` / `# live in claude/orphan-targets, never in comments here: the gate below counts comments too.` (F4)
- `# Not convergence (its invariant forbids deletes). Self-limiting, so stateless. Consent is announce-only` / `# (0072, owner ruling): every branch must report what happened. Accepted residuals: 0072 review C3, C4.`
- The `orphan_targets=` trailing comment is unchanged.

**`orphan_refs` (793–815):**
- `# THE GATE: re-check at run time that no shipped source still names a target; a referenced target is refused.` / `# Only orphan-targets itself is excluded, which is why the list is its own file.`
- `# ⚠️ Fails CLOSED: grep rc > 1 → return 2 → refuse (0072 review R2). -i for case-insensitive filesystems` / `# (0072 C5); the boundary stops a short target matching a longer path (C1). Over-matching only refuses.`
- Line 821 unchanged.

**`cleanup_orphans`:**
- **828–830** → `# Ready-to-print lines, never a list iterated with for: that would split on IFS and glob.`
- Lines 837–838 unchanged.
- **844–845** → `# Same parser shape as .fkit-keep-out's (a final line with no newline; CRLF).`
- **848–850** → `# Trim BEFORE the comment test, or "  # x" is a comment to the tests and a TARGET here (0072 C6).`
- **854–860** → `# ⚠️ Strip ./ only, never a leading /: an absolute line must reach path_contained's refusal, not become a` / `# different in-project path to delete (0072 review R8).`
- Line 865 unchanged.
- **877–881** → `# Never delete lockdown state, even if listed; lower-cased first (0072 C5). Announced only when the path` / `# exists, so a bad line does not nag every launch.`
- **893–894** → `# Already absent, as in every project that never used Omnigent: say nothing.`
- Line 897 unchanged.
- **924–939** → `# rm -rf is not atomic: it can empty a directory and still fail, so count before and after and report the` / `# true state (0072 C2).` — blank — `# ⛔ ACCEPTED RESIDUAL (0072 review R6, owner-ruled): the count is ONE level deep, so a nested delete can read` / `# "left as it is". Honest fix: find "$p" | wc -l, tested on a nested fixture run red first.`
- **945–946** → `# Non-fatal per path (0088's bar).`
- Line 951 unchanged.
- **969–972** → `# STDERR: THE OUTPUT TRAP, as for convergence.`
- Lines 984–985 unchanged.

**Summary and exit:**
- **Summary (1005–1013)** → `# ⚠️ No role count on this line (0036 Part D, owner ruling): ADR-028's eighth role is decided, not built.` / `# Add the tester to the list when its agent exists; do not reintroduce a count.` — blank — `# This printed list mirrors the launcher's accepted role names by hand; nothing tests that they agree.`
- **Exit 3 (1026–1034)** → `# Exit 3 = setup SUCCEEDED but ai-agents/ was refused, so the launcher reads a missing PROJECT.md as` / `# "refused", not "fresh". A STATUS, never a re-derived predicate: the two copies drifted once.`
- Deleted: the `# ---------- convergence …` and `# ---------- summary ----------` dividers.
- Kept: both `# shellcheck disable=SC2086` lines (rule 4), the signature trailing comments (M4j), and the `RULES_TAG=` line (F5).

## 6. Inbound references (V5) and the edits outside the 2 files
Searches, re-run at build time:
- **S1:** `path:NNN`, `#L` and "line N" cites over the whole repo, **plus the bare `:NNN` cites in architecture.md's launcher block**.
- **S2:** "own comment / header / scope note / doctrine / wrote" prose.
- **S3a:** distinctive phrases of the deleted comments.
- **S3b:** 30-character windows of every deleted or changed comment line, matched with a python window-set (per 0510) over `claude test bin`, the knowledge base (including `decisions/`), open briefs, the wiki and the top-level docs.
- Each deleted divider's label, searched on its own.

**Fixed (live):**
| Where | What | Action |
|---|---|---|
| `architecture.md`, launcher block: `:42-49`, `:127-170`, `:172-212` (×2, once in flow 5), `:419-423`, `:578-606`, `:627-685`, `:687-737`, `:752` | bare launcher line cites, most already stale at HEAD | renumbered to the final tree; each keeps its code anchor. The menu quote becomes *"The menu (deterministic; no LLM)"*. |
| `architecture.md`: `claude/fkit-claude.sh:585-606`, `:25-27`, `:69-75`, `:100-170`, `:42-49`; `claude/fkit-claude-init.sh:26-47` | path cites | renumbered, each with a code anchor: `codex_preflight`; the header comment; `_fkit_verfield()`; `_fkit_reinstall()`; the `FKIT_NO_SELF_HOST` guard; the §1 `aa_state` preflight and `converge_ai_agents` |
| `architecture.md`: init "step 3", *"refresh .claude/agents/fkit-*.md and .claude/skills/fkit-*/ from claude/"* | quotes the header step list, which goes | re-anchored on the §3 label: *"refresh the fkit-managed agents + skills"* |
| `RELEASING.md`: `claude/fkit-claude.sh:124`, `:80-92`, `:185` (×2), `:203-209`, `:93-99` | stale launcher cites | renumbered, each with a code anchor: `fkit_ref="${fkit_ref:-main}"`; `_fkit_remote_sha()`; the `[ -n "$remote" ] && [ -n "$installed" ]` test; the `if [ -n "$rver" ] && [ -n "$curver" ]` block; `_fkit_remote_version()` |
| `test/structure-notice.test.js` header: "(the launcher's structure_notice comment block is the authority)" | false once the block is a pointer | → "(the arms below are the contract; its record is 0247 plan §2–§3 + review R1–R2, ADR-039 Decision 3)"; token and AST hash equal to HEAD |
| `test/structure-manifest.test.js`, comment E: `(claude/fkit-claude-init.sh:374)` | stale line cite in a comment | → `(marker_lines in claude/fkit-claude-init.sh)`; hashes equal |
| `bin/generate-structure-manifest.mjs`: `fkit-claude-init.sh:374` (×2, lines 39 and 108) and `:316-317` (line 62) | stale line cites in comments | → by name (`marker_lines`; `RULES_BEGIN` / `RULES_END`); token and AST hash equal; prove-red does not mutate this file |

**Phrases kept, so no edit is needed:**
- `test/update-banner.test.js`: "own scope note".
- `test/launcher-contract.test.js` and open brief 0145: "No role and no tty (piped / CI) → lead is the safe default".
- The two init test headers: the §1 `[ -L ]` sentence, and the §3, §4 and §6 labels.
- `test/structure-manifest.test.js` and `bin/…`: "marker_lines' comment" (the CRLF reason).
- `claude/structure-spec.md`: §"THE .gitkeep RULE".
- `claude/orphan-targets`: "Init's step 3".
- `architecture.md`: the five quotes kept in §4 and §5.
- Open briefs 0305, 0328 (×2), 0329, 0336 (×2), 0499, 0520 and 0521.

**Left as they are:**
- ADR `path:NNN` cites (ADRs 009, 010, 012, 014, 015, 016, 017, 018, 028, 030, 031, 043, 053) — owner ruling Q3.
- ADR quotes of deleted comment words (at least ADRs 010, 012, 014, 015, 018, 030, 036, 039, 043, 054, 055), each listed in V5 with the quoted words — owner ruling R4.
- Open briefs' line cites (0045, 0262, 0277, 0328, 0330, 0382, 0403): the lines only shifted (PC-1).
- 0226, 0400 and 0403 quote the mirror block, which stays byte-identical.
- Sprint boards, review ledgers, dated reports, closed task folders, `test/fixtures/`, and the wiki (left for the wiki role's sync).
- `test/structure-manifest.test.js`'s assertion-message string `'…(claude/fkit-claude-init.sh:366-372)'`: it is a string (rule 1) and already stale at HEAD (Q-B).
- `test/coordination-citation-policy.test.js`'s `'claude/fkit-claude-init.sh:481'`: a test fixture, not a cite.

## 7. Sequence
0. **Baseline:**
   - `cmp` both files against `git show HEAD:<file>`;
   - record `architecture.md`'s pre-existing 0507 diff;
   - V3 counts; M3 (`norm`, `bash -n`, `sh -n`); M4h on HEAD;
   - the F4 gate result per target on HEAD;
   - one full `npm test`, each half run alone (1-minute load < 8; `pmset -g log` shows no sleep during the run).
1. Re-run S1–S3 and the divider-label search; finalize the §6 lists.
2. Re-read every prove-red mutation on the launcher (M4f) and fences F1–F5.
3. Edit the launcher, then init. After each file:
   - `norm` + `bash -n`, plus `sh -n` for the launcher;
   - `rule4.sh`;
   - the F1/F2 greps on the edited launcher;
   - F4 compared with the HEAD result;
   - the F5 extracts;
   - M4h and the width check;
   - `datarun.sh` on init's heredoc runs;
   - a dry run of every launcher mutation's sed or awk on the edited file (each must change exactly the lines it changed on HEAD).
4. Make the edits outside the 2 files (§6). Renumber the doc cites against the final tree and check that each anchor text sits at its cited lines. For the JS files: token and AST hash against HEAD, and `node --check`.
5. Pointer check (M4e): `ls`, `grep` and read for every pointer in a new comment.
6. Worklog: V1–V6, the fences, the decision log, and M4l recorded under "Method for the series".
7. Verify: full `npm test` (both halves, each run alone), then `npm run test:docs` after the worklog.

## 8. Checks
- **Run:**
  - full `npm test`, per CONTRIBUTING's table: non-`.md` files under `claude/`, files `test/prove-red.sh` names, and edits under `test/`;
  - `npm run test:docs`, for `architecture.md` and `RELEASING.md`;
  - M3 on both scripts;
  - token hash, AST hash and `node --check` on the three JS files touched;
  - the fence checks.
- **Load discipline:** prove-red's 0284 timing cases are load-sensitive. Run each half alone with the 1-minute load below 8, run no CPU burners, and check `pmset -g log` for a sleep inside the run window before trusting a timing result.
- **Skipped:** a live `fkit` session and a real `fkit update`. The change is comments only (`norm` proves it), and the suite drives both through stubs.

## 9. Edge cases
- `#` lines inside the INTERVIEW heredoc, the `--help` heredoc, awk programs (`sn_prog`, `marker_lines`, `orphan_refs`'s pattern) and `printf` strings are data (rule 1). `norm` keeps them, so any edit to them shows up.
- The launcher is `#!/bin/sh`. `norm` parses it with bash 3.2, and `sh -n` checks it too.
- Comment edits inside the `case` arm list (787–792) or inside a `( … )` subshell (93) are fine: `norm` strips both.
- F4 is a run-time behaviour change, not just a test risk: a target named in a comment makes every later launch refuse that cleanup.
- F2's anchors match anywhere in a line, so a comment that quotes one breaks mutations 49–55 ("WRONG TARGET").
- Widths are measured with indentation, in code points (`→`, `—`, `⚠️`, `⛔`).
- `architecture.md` already carries 0507's 2-line diff. The new hunks are separate, and the baseline records the old ones.
- 0511, 0514 and 0515 later clean the files touched in §6. Whichever lands second re-checks the other's cites, as the brief notes.

## 10. Open questions (none blocks the build)
- **Q-A — the launcher's duplicate of the mirror block.** It stays byte-identical (PC-2), all 20 lines, including the 5 launcher-only lines after "add it HERE FIRST"; that is the cheaper call to reverse. But it duplicates `skills-for-role.sh`'s header, and `skills-for-role.sh:19` already says the original is in git history. 0226's brief scopes only `skills-for-role.sh` and lists the launcher as "not a site", so this copy goes stale once 0226 lands. **For the lead to route to a producer:** should 0226's brief also remove the launcher's copy, or replace it with a pointer? Knock-on: none (checked). 0226 stays on the Backlog board and no task waits on it.
- **Q-B — a stale line cite inside a test's assertion-message string.** In `test/structure-manifest.test.js`, test E: `'…marker_lines exists to prevent (claude/fkit-claude-init.sh:366-372)'`. Rule 1 says strings are not edited; rule 5 says fix live cites. Codex X4 raises the same point (PC-4 below).
  - (1, Rec) Leave it: the message names `marker_lines`, which resolves. List it in V5 for 0515.
  - (2) Edit the string to drop `:366-372`. That is an assertion-message change in a file outside this unit's scope.

  Knock-on: none.

## Owner rulings at the plan gate (2026-10-18, AskUserQuestion, fkit-lead session)

This section is the lead's; the plan above and the post-Codex questions below are copied from the
coder's return. Where they differ from the plan above, the rulings below govern.

- Post-Codex fixes: **"PC-1–3 yes, PC-4 leave (Recommended)"** — PC-1, PC-2 and PC-3 option 1 adopted with their drafted text below; PC-4 option 1 (leave the assertion-message string; list it in V5 for 0515).
- Q-A: **"Yes, note it in 0226 (Recommended)"** — a producer adds a dated note to brief 0226; not part of this build. The launcher's mirror block stays byte-identical here (PC-2 of 0507).
- Plan: **"Approve (Recommended)"**.

## Post-Codex questions (the plan above is unchanged; the owner decides)

**PC-1 (Codex X1, confirmed) — the §3 label overclaims about squatters.** HEAD's comment makes the same claim, and open brief 0336 tracks the defect.
1. **(Rec) Adopt this text** for the §3 label: `# 3. refresh the fkit-managed agents + skills (rm + cp of the two fkit-* patterns only). A same-type squatter` / `# is deleted and NOT put back; a wrong-type one aborts init today (open 0336).` "Non-fatal; init's exit status unchanged (0327, ruling Q1a)" moves into the next comment's line 2, as `… (0327). Refusals are non-fatal, exit status unchanged (ruling Q1a); one call per half.` The build rewraps within the same words if a line goes over 110. 0336's quoted label start, "# 3. refresh the fkit-managed agents", is kept. Knock-on: none.
2. Keep the plan's text (it repeats HEAD's overclaim).

**PC-2 (Codex X2, confirmed) — "Every launch runs the check" is false when the check is skipped.**
1. **(Rec) Adopt this text** for the self-update comment: `# Self-update NOTIFIES only (ADR-009 Decision 3). Unless FKIT_NO_UPDATE_CHECK=1 or in a checkout, every launch` / `# runs the check, so offline / proxied / captive-portal must cost nothing and print nothing.` (≤ 110 columns; keeps the phrase that architecture.md and 0520 quote). Knock-on: none.
2. Keep the plan's text.

**PC-3 (Codex X3, confirmed) — "never the notice" is false if the retry fails too.** HEAD's comment makes the same overclaim.
1. **(Rec) Adopt this text** for line 2 of the structure notice's second comment: `# every failure is silent and non-fatal; a filter failure retries without suppression before giving up.` (103 columns). The kept call-site comment (lines 622–623, "A filter failure drops SUPPRESSION, never the notice: retry unsuppressed (have=0), then give up.") is accurate as it stands, because it says "then give up". Knock-on: none.
2. Keep the plan's text.

**PC-4 (Codex X4 = Q-B) — the stale cite inside an assertion-message string in `test/structure-manifest.test.js`.** This deliberately departs from the "drafted text as the recommended option" form: the plan and the architect both recommend leaving it, so the drafted edit is option 2.
1. **(Rec) Leave it.** Rule 1: strings are not edited. The message names `marker_lines`, which resolves. List it in V5 for 0515.
2. Edit the message to `'marker_lines exists to prevent (claude/fkit-claude-init.sh)'`. This changes one string literal, so the AST hash differs on exactly that literal; `node --check` and the suite still apply.

Knock-on: none for either option.

## Open questions for the lead to route
- **Q-A** (§10, for a producer): should 0226's brief also cover the launcher's duplicate mirror block? Knock-on: none (checked).
- **Q-B** is PC-4 above.
