# Worklog — 0508: comment cleanup of the launcher and init scripts

- **Step:** Build, spawned by `fkit-sprint-ship-loop` (driver: `fkit-lead`), Sprint 12 run (`--plan-review`),
  under the ADR-055 declared-approval marker. Plan: this folder's `plan.md`, blob `b62d79f6` (checked
  with `git hash-object` and `wc -c` before any edit — 40099 bytes; it matched the carried pointer).
- **Owner approval relayed:** `AskUserQuestion` in the `fkit-lead` session, 2026-10-18 — post-Codex
  fixes "PC-1–3 yes, PC-4 leave (Recommended)", Q-A "Yes, note it in 0226 (Recommended)", plan
  "Approve (Recommended)". The plan's *Owner rulings at the plan gate* section governs: PC-1, PC-2 and
  PC-3 are built with their drafted text; PC-4 leaves the assertion-message string (listed in V5).
- **Not this build's work:** the dated note in brief `0226` (Q-A) — a producer's.
- **Nothing committed or pushed.** No init run; no `.claude/` copy edited. `plan.md` and
  `plan-review.md` untouched. Other tasks' uncommitted changes (0507, 0510) left as found.
- **Files edited:** `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh` (in scope);
  `ai-agents/knowledge-base/architecture.md`, `RELEASING.md`, `test/structure-notice.test.js`,
  `test/structure-manifest.test.js`, `bin/generate-structure-manifest.mjs` (rule-5 cite fixes,
  comments and docs only); this worklog.

## Method for the series

The method is `0507`'s worklog, "Method for the series" (M1–M4j, as amended through 0507 review R9),
plus `0510`'s M4k (as amended for 0510 review R1), applied as written. This unit adds **M4l**, for
`0509` and `0511`–`0515`.

**Who decided what.** The plan chose M4l (plan §2); the owner approved the plan ("Approve
(Recommended)", 2026-10-18, `AskUserQuestion` in the `fkit-lead` session).

### M4l — numbered section labels are anchors
- A section label that live text cites **by number** (init's `# 1. …` to `# 6. …`, cited as "§3",
  "init's §4", "Init's step 3" by tests, `claude/orphan-targets`, `architecture.md`, ADRs and open
  briefs) **stays**, as the first line of its section's comment (2 lines at most).
- Its wording may change, as long as every phrase another file quotes survives (here: 0336's
  "# 3. refresh the fkit-managed agents", `architecture.md`'s re-anchored "refresh the fkit-managed
  agents + skills").
- Unnumbered dividers are still deleted (M4b).
- Why: M4b deletes a WHAT label only after re-anchoring every cite; for a numbered section that means
  rewriting many live files and leaving ADR and brief cites dangling.

**M4c clarification (not a change).** A *code comment* that cites these files by line is re-anchored
by name (`code-comments.md` rule 2). A *doc* cite (`architecture.md`, `RELEASING.md`) keeps the
`path:NNN` form, renumbered to the final tree and paired with code text (0507's precedent; the
durable-citation convention's row 1 for source files).

### This unit's fences (M4k), found before any edit
Searches: both file names across `test/`, `bin/`, `claude/` and `install.sh`; the exported constants
`LAUNCHER` and `INIT`; `.toString()`; every mutation body in `test/prove-red.sh`; init's run-time reads
of `claude/`. Nothing reads `LAUNCHER` as text; no `.toString()` reaches either file; no prove-red
mutation targets init.

| # | Reader | Kind | Result after the edits |
|---|---|---|---|
| F1 | `test/prove-red.sh` "did not land" greps over the whole mutated launcher (mutations 17, 41, 44–48) | must-not-contain | every token (`newer content on`, `rver:-?`, `FKIT_REPO="$fkit_repo"`, `_fkit_deadline "$FKIT_NET_TIMEOUT"`, `ps -A -o pid=`, `--max-time "$FKIT_INSTALLER_FETCH_TIMEOUT"`, `kill -9 `, `kill "$_fkit_dl_dog"`, `mutation:`) has the same whole-file count as HEAD (1, or 0 for `rver:-?` and `mutation:`), none in a comment |
| F2 | mutations 49–55 (`grep -cFf anchor` must be 1) | exact-count = 1, on code | each of the 6 anchors: count 1 on HEAD and on the edited file, on code, 0 in comments |
| F3 | prove-red seds / awks on whole launcher lines (2, 15, 16, 17, 30, 31, 41, 44–55) | line byte-identical | dry run of all 19 launcher mutations on the HEAD copy and on the edited file: each changes exactly 1 line, and the old and new text of that line is identical on both (see V1) |
| F4 | init's `orphan_refs` gate over every file under `claude/` | must-not-contain | per target (`.fkit/agents`, `.fkit/run`, `.fkit/team-session`, `.omnigent`): same as HEAD — only `claude/orphan-targets` hits; 0 hits in either edited file |
| F5 | `test/rules-block-budget.test.js` extracts from `INIT` | exact lines | `RULES_BEGIN=`, `RULES_END=`, `RULES_MAX=4352`, `RULES_TAG=` (trailing comment included) byte-identical; `emit_block()` extract sha1 `ee59b270…` on both sides |
| F6 | live text quoting these comments | must-contain | all kept (V5) |

## Baseline (before any edit, 2026-10-18)
- Both files equal to HEAD (`cmp` against `git show HEAD:<file>`, HEAD `78b7464`); both 100755.
- `architecture.md` carried a **pre-existing** 2-line diff (0507's `skills-for-role.sh:26` and
  `skill-ownership-hook.sh:66-81` cites). Not this task's; this task's 16 changed lines are separate hunks.
- `test/prove-red.sh` carried 0507's 1-line comment change (review R2). Not touched here.
- V3 counts: launcher 382, init 493 (same command as V3).
- M3 on HEAD (bash 3.2.57): `norm` exit 0, non-empty (launcher 21415 B, init 25544 B); `bash -n` exit 0
  both; `/bin/sh -n` on the launcher exit 0.
- M4h on HEAD: 65 comment runs over 2 lines (27 launcher, 38 init); 6 comment lines over 110 columns, all
  in the launcher (2 inside the mirror block).
- F4 on HEAD: per target, only `claude/orphan-targets` references it.
- `node --test test/*.test.js` (load 6.56 at start) → 1156 tests, **1156 pass, 0 fail**.
- `bash test/prove-red.sh`, alone → exit 0, **"✓ hard gate PASSED"**. ⚠️ Its 1-minute load at start was
  **12.28**, above the spawn's limit of 8 (it started straight after the unit half, whose own load had
  pushed the average up; the check was made before the unit half, not before this one). The run is green
  and green under load is not a false red, so it was not re-run; recorded as a breach of the run rule.
  `pmset -g log`: no sleep or wake between 21:30 and 21:57.

## V1 — Comments only
**Primary (M3), final tree vs HEAD copies:**
- `claude/fkit-claude.sh`: `norm` exit 0, 21415 B, **byte-identical** to HEAD; `bash -n` exit 0 both
  sides; `/bin/sh -n` exit 0 both sides.
- `claude/fkit-claude-init.sh`: `norm` exit 0, 25544 B, **byte-identical** to HEAD; `bash -n` exit 0 both
  sides.
- **Rule 4** (`rule4.sh`, X1 pattern): line 1 equal on both (`#!/bin/sh`, `#!/usr/bin/env bash`); no
  directive line among the changed lines (both `# shellcheck disable=SC2086` lines untouched);
  `git diff HEAD --summary` prints no mode change (both stay 100755).
- JS files touched for rule 5 (`test/structure-notice.test.js`, `test/structure-manifest.test.js`,
  `bin/generate-structure-manifest.mjs`): raw-token hash equal to HEAD (`c287569d…` 2698 tokens,
  `93afe14a…` 1273, `099cd631…` 1905), R1 AST hash equal (`60273b89…`, `e70aca98…`, `9925d472…`),
  `node --check` exit 0, rule-4 clean (`.mjs` line 1 equal; the two tests have no shebang), no mode change.

**Secondary (the brief's line grep):**

```bash
git diff -U0 -- claude/fkit-claude.sh claude/fkit-claude-init.sh | /usr/bin/grep -E '^[-+]' \
  | /usr/bin/grep -vE '^(\+\+\+|---) ' | /usr/bin/grep -vE '^[-+][[:space:]]*(#|//|$)'
```

It prints exactly 6 lines — the three exceptions the plan names, all in init's `merge_rules`, each a
code line whose trailing comment was deleted (the reason moved to one line above `if cmp -s "$tmp" "$f"; then`):

| File | Function / line | Change |
|---|---|---|
| `fkit-claude-init.sh` | `merge_rules`: `rm -f "$tmp"; trap - EXIT` | trailing comment (and its padding) deleted |
| `fkit-claude-init.sh` | `merge_rules`: `return 0` | trailing comment deleted |
| `fkit-claude-init.sh` | `merge_rules`: the `fi` closing `if cmp -s "$tmp" "$f"` | trailing comment deleted |

`norm` proves the code part of the three lines unchanged. The same grep (with 0507's R1 block filter)
over the three JS files prints nothing. No launcher line appears.

**Prove-red (M4f).** Every launcher mutation was read before editing. Dry run of all 19 (2, 15, 16, 17,
30, 31, 41, 44, 45, 46, 47, 48, 49–55) with their own sed / awk / `swap_literal_line` on the HEAD copy and
on the edited file: each changes exactly one line, and the removed and added text is identical on both;
mutations 49–55's anchors each match exactly one line on both. No mutated line or anchor was touched, and
the long trailing comment on `agents_usable() {` is unchanged (F3).

## V2 — Tests
Ran (full `npm test`, in its two halves, each alone; no CPU burners; `pmset -g log` checked for each
window):
- `node --test test/*.test.js` (load 7.24 at start, 22:05) → 1156 tests, **1156 pass, 0 fail** (same as
  baseline).
- `bash test/prove-red.sh`, alone (22:08–22:31) → exit 0, **"✓ hard gate PASSED"**: baselines 0a–0p all
  16 green, mutations 1–55 all 55 red at their named assertion (same as baseline), no `✗` line. ⚠️ Its
  1-minute load at start was **8.12**, marginally above the limit of 8 (the wait loop read 7.43 four
  seconds earlier). The run is green, so the load cannot have produced a false red; recorded, not re-run.
  `pmset -g log`: no sleep or wake between 22:05 and 22:32.
- After this worklog (load 5.65): `npm run test:docs` (includes `reference-integrity` and
  `coordination-citation-policy`) → 410 tests, **410 pass, 0 fail**.

**Skipped:** a live `fkit` session and a real `fkit update` (comments only, proven by `norm`; the suite
drives both through stubs). The loop's own Verify step re-runs the full suite.

## V3 — Count
Command, both times: `/usr/bin/grep -cE '^[[:space:]]*(#|//|\*|/\*)' <file>` (counts the shebang too;
init's count also includes the `#` lines of the `INTERVIEW` heredoc, which are data).

| File | Before | After |
|---|---|---|
| `claude/fkit-claude.sh` | 382 | 107 |
| `claude/fkit-claude-init.sh` | 493 | 122 |
| **Total** | **875** | **229** |

The launcher's 107 include the 20-line mirror block (V6 exception); init's 122 include 10 heredoc data
lines.

## V4 — Nothing lost
**Reasons moved into the knowledge base: none.** Every long reason either fit in 1–2 lines or already
had a durable home (M1 item 1); no report, convention or ADR addendum was written.

**Pointer table (M4e)** — every pointer in the new comments: `ls` the target, `grep` the heading or ID,
read the passage. Uniqueness (M2): every review ID cited appears in its ledger's findings table once,
plus its response row(s); 0327's third row per ID is the reviewer's round-2 closure table for the same
finding, not a reused ID.

| File | Pointer | Target checked | Holds the reason? |
|---|---|---|---|
| launcher | ADR-010 (`--agent` lock; an unroled session fails open) | ADR-010 §Decision item 1 `claude --agent fkit-<role>`; the lockdown it defines | yes (the fail-open sentence stays in the comment) |
| launcher | ADR-018 (hook, any spawn depth; retired off-list and `CONSULT_SKILLS`) | ADR-018 title and §Decision item 2 ("`CONSULT_SKILLS` … is RETIRED") | yes |
| launcher | ADR-018 Decision 5 | §Decision item 5 "Menu visibility — settled" | yes |
| launcher | ADR-009 Decision 3 | §Decision item 3 "Self-update: check, notify, but never silently execute" | yes |
| launcher | 0284 | `0284-…/brief.md`: the update check's git path had no deadline (12 s measured) | yes |
| launcher | 0481 (×3) | `0481-…/plan.md` line-1 bullets: variables to the `sh`, not `curl`; "A second bug … if the download fails"; `review.md` R2 (a symlinked / copied launcher, `$share` trusted) | yes |
| launcher | 0257 (×2) | `0257-…/brief.md`: sha trigger, `VERSION` label, `vX → vX`; the empty-version `v?` | yes |
| launcher | 0140 | `0140-…/brief.md`: owner ruled "team room" retired project-wide | yes |
| launcher | 0139 review R1, R3 | `0139-…/review.md` R1 (`fkit team room` unquoted launches a lead session), R3 (widens the after-a-role passthrough) — unique | yes |
| launcher | 0073 | `0073-…/brief.md` "Remove `fkit --resume` and the blanket arg-passthrough" | yes |
| launcher | ADR-012 §1 | §Decision item 1 "The `skills:` frontmatter is inert and is therefore DROPPED" | yes |
| launcher | ADR-017 rule 2 | as checked in 0507's V4 | yes |
| launcher | ADR-030; 0129; 0204 | ADR-030 ("`Stop` only, never `SubagentStop` … never fires in a spawned consult"); 0129 brief (transcript-independent ship-loop signal); 0204 brief (the carry-check hook) | yes |
| launcher | 0088 | `0088-…/brief.md` "Stop an init failure from bricking the launcher" | yes |
| launcher | 0334 | `0334-…/brief.md`: name-existence fail-safe satisfied by a symlink, dangling name, wrong type | yes |
| launcher | 0247 plan §2–§3, review R1, R2; ADR-039 Decision 3 | plan "## 2. The notice pass", "## 3. The intent file"; review R1 (non-UTF-8 crash → `LC_ALL=C`), R2 (CR parsing) — unique; ADR-039 "### 3. The trigger" | yes |
| launcher | ADR-054 | warn and continue; never softened | yes |
| launcher | ADR-031; 0379 | ADR-031 (the lead is the front door); 0379 brief (owner: land on the lead after the cold start) | yes |
| launcher | 0042 | `0042-…/brief.md`: `[ -r /dev/tty ]` never tests openability | yes |
| launcher | 0302 | `0302-…/brief.md`: Enter at the menu opens the lead | yes |
| init | ADR-015; ADR-039 | ADR-015 "### 1. The invariant — RATIFIED by the owner"; ADR-039 (repair licensed, invariant unchanged for launch) | yes |
| init | 0023 review R1, R3, R4 | `0023-…/review.md`: R1 unusable keep-out fails open, R3 globbing against the CWD, R4 unreadable subdirectory — unique | yes |
| init | 0072 review R1, R2, R3, R6, R8; C1–C6 | `0072-…/review.md` rows: R1 parent-chain symlink, R2 gate fails open, R3 `..` containment, R6 shallow count (accepted), R8 leading `/` stripped; C1 boundary, C2 non-atomic `rm -rf`, C3 buffered announcement, C4 TOCTOU, C5 case-insensitivity, C6 indented comment line — each unique | yes |
| init | 0072 (consent, owner ruling) | `0072-…/brief.md` "## ✅ Owner decision (2026-07-17) — consent model: **announce-only**" | yes |
| init | ADR-009; report 2026-07-14-migration-mechanism §9 | ADR-009 removed the runtime; report "## 9. The one destructive act I actually propose — and it needs a gate" | yes |
| init | 0046 | `0046-…/brief.md`: §4 wrote through a symlinked `.fkit/` | yes |
| init | ADR-016 | the shared-instructions layer; "A size cap … is warranted, in code" | yes, with 0130 / 0190 for the bump (decision log D3) |
| init | 0130 (ruling, ≥ 400 B, Claude-side strip) | `0130-…/plan.md` rulings table rows 2 and 4; `worklog.md` "Claude Code 2.1.220: HTML comments ARE stripped" | yes |
| init | 0177 | `0177-…/worklog.md`: "codex-cli 0.145.0 does NOT strip HTML comments" | yes |
| init | 0190 set 4352 | `0190-…/plan.md`: "an owner-signed `RULES_MAX` bump, 4096 → 4352 … This is the ADR-016 signed bump" | yes |
| init | 0327; review R1, R2, R3; ruling Q1a | `0327-…/review.md` R1 (entries one level below the walk), R2 (dangling / non-dir entry kills init), R3 (the only-destructive claim) — unique; `plan.md` "## Owner's answers to §6": "Q1 — exit status: (a) Warn, continue, exit unchanged" | yes |
| init | D1 in its refresh test | `test/init-claude-refresh-guard.test.js` test "D1 — a REAL user path squatting the fkit-* namespace is deleted and NOT put back" | yes |
| init | open 0336 | `backlog/0336-…/brief.md` "### R6 — a wrong-type squatter kills init" (`cp: …: Not a directory`, rc 1) | yes |
| init | 0088 (bar) | as above | yes |
| init | 0036 Part D; ADR-028 | `0036-…/plan.md` "## Part D — the installer's hard-coded role count"; ADR-028 (eighth role decided) | yes |

**Pointers dropped at the M4e check: none.** One partial: "owner-signed bump (ADR-016; …)" — ADR-016
holds the cap, not the words "owner-signed bump"; the pointer is kept because the pair names both
homes (D3).

**Spot-check help (V4 asks for ≥ 5):** the deleted text is in `git diff`. Suggested: the launcher's
`team` alias history (0139 review R1, R3; 0140); its 35-line hook commentary in `build_settings`
(each hook's own script, ADR-018, ADR-030, 0129, 0204); its 61-line structure-notice contract (0247 plan
§2–§3, review R1, R2); init's 26-line convergence block (ADR-015 "The invariant"); init's §6
apparatus (0072 brief and review C3, C4; report §9).

## V5 — Inbound references
Searches, re-run at build time:
- **S1** — `fkit-claude(-init)?.sh` followed by `:NNN`, `#L` or "line N", over `claude test bin`,
  `install.sh`, the top-level docs, conventions, `architecture.md`, `PROJECT.md` and open briefs; plus
  the bare `:NNN` cites in `architecture.md`'s launcher flow block (read by hand).
- **S2** — the file names (or "launcher" / "init") followed within 60 chars by `own comment`, `own
  header`, `header comment`, `scope note`, `own words`, `comment block`, `doctrine`, `wrote … down`.
- **S3b** — every deleted or changed comment line (811), cut into 30-character windows at every 3rd
  offset (14612 windows; a line shorter than 30 but at least 18 is its own window), matched with a
  python window-set over `claude test bin` (fixtures excluded), `ai-agents/knowledge-base` (with
  `decisions/` and `reports/`), open briefs, `ai-agents/wiki-vault/`, the top-level `*.md` and
  `install.sh`. 687 hits; each marked KEPT (window still in the edited files) or GONE (594); the GONE
  hits in live text, open briefs and ADRs were read.
- **Divider labels** — "dogfood the working tree", "Self-hosting:", "--- Self-update", "Launch-time
  structure notice", "Fresh project:", "The menu (deterministic", "Codex preflight: optional", "Skill
  ownership — THE single source", "top up an EXISTING ai-agents", "---------- summary / convergence / 6.",
  over live text, open briefs and ADRs: only the two `architecture.md` hits below, both resolving.
- **Known gap (found in review round 1, R1 and R3):** S3b matches a window inside ONE line of the target,
  so a quote that the target wraps across a line break is missed, and so is a deleted comment that
  itself wrapped mid-phrase. The three rows marked "missed by the build" below came through that gap.

| Hit | Kind | Action |
|---|---|---|
| `architecture.md` launcher flow block: `:42-49`, `:127-170`, `:172-212` (×2, also flow "the automatic check"), `:419-423`, `:578-606`, `:627-685`, `:687-737`, `:752` | live, S1 | **fixed** → `:16-23` (`FKIT_NO_SELF_HOST` guard), `:108-147` (update case), `:149-180` ("Automatic: a throttled check that only ever PRINTS"), `:294-298` (`"$here/fkit-claude-init.sh" "$proj"`), `:426-446` (`command -v claude` … `codex_preflight`), `:453-493` (`pm=` … the fresh branch's `fi`), `:495-533` (quote → *"The menu (deterministic; no LLM)"*), `:547` (`exec claude --agent "fkit-$role"`); each checked: first and last cited line are the anchor's |
| `architecture.md`: `claude/fkit-claude.sh:585-606`, `:25-27`, `:69-75`, `:100-170`, `:42-49`; `claude/fkit-claude-init.sh:26-47` | live, S1 | **fixed** → `:433-446` (`codex_preflight`, quote kept), `:8-9` (header, quote kept), `:35-38` (`_fkit_verfield()`), `:86-147` (`_fkit_reinstall()` and the update case), `:16-23` (`FKIT_NO_SELF_HOST` guard); init `:189-211`, "the §1 `aa_state` preflight through its `converge_ai_agents` call" |
| `architecture.md`: init "step 3", *"refresh .claude/agents/fkit-*.md and .claude/skills/fkit-*/ from claude/"* | live (quotes the deleted step list) | **fixed** → re-anchored on the §3 label: *"refresh the fkit-managed agents + skills"* |
| `RELEASING.md`: `claude/fkit-claude.sh:124`, `:80-92`, `:185` (×2), `:203-209`, `:93-99` | live, S1 (stale at HEAD already) | **fixed** → `:106` (`fkit_ref="${fkit_ref:-main}"`), `:65-78` (`_fkit_remote_sha()`), `:162` ×2 (the `[ -n "$remote" ] && [ -n "$installed" ]` test), `:171-177` (the `if [ -n "$rver" ] && [ -n "$curver" ]` block), `:79-85` (`_fkit_remote_version()`) |
| `test/structure-notice.test.js` header: "(the launcher's structure_notice comment block is the authority)" | live, S2 | **fixed** → "(the arms below are the contract; its record is 0247 plan §2–§3 + review R1–R2, ADR-039 Decision 3)"; token and AST hash equal |
| `test/structure-manifest.test.js` comment E: `(claude/fkit-claude-init.sh:374)` | live, S1 | **fixed** → `(marker_lines in claude/fkit-claude-init.sh)`; hashes equal |
| `bin/generate-structure-manifest.mjs`: `fkit-claude-init.sh:374` (×2) and `:316-317` | live, S1 | **fixed** → by name (`marker_lines`'s file; `RULES_BEGIN / RULES_END in claude/fkit-claude-init.sh`); hashes equal; prove-red does not mutate this file |
| `test/update-banner.test.js`: "matching claude/fkit-claude.sh's own scope note" | live, S2 | kept: the new "Scope (0257): only the empty-version "v?" is gone; nothing is validated…" says the same |
| `test/launcher-contract.test.js` (and open brief 0145, ADR-010): "No role and no tty (piped / CI) → lead is the safe default" | live, S2/S3 | phrase kept verbatim |
| `test/init-claude-refresh-guard.test.js`, `test/init-intake-guard.test.js` headers: "`[ -L ]` is the one test that does not lie, so it has to come first"; "§3", "§4", "§6" | live, S2 | kept: §1's label line 2 keeps the sentence; the numbered labels stay (M4l) |
| `test/init-claude-refresh-guard.test.js` D1: "§3's header, §6's header … all now say in words that §3's delete is recoverable only for fkit's OWN payload names, and unrecoverable for a user path squatting" | live | still true: §3 label "A same-type squatter is deleted and NOT put back"; §6 label "§3 deletes too, unrecoverably for a squatter" |
| `test/init-claude-refresh-guard.test.js`, test A4: "kills init AT :527" | live, S1 (bare) | left: it describes the pre-0327 tree ("pre-fix"), already stale at HEAD; 0514/0515's file |
| `test/structure-manifest.test.js` and `bin/…`: "marker_lines' comment" (the CRLF reason) | live | kept: `marker_lines`'s comment line 2 keeps the CRLF reason |
| `test/structure-manifest.test.js` test E assertion message `'…(claude/fkit-claude-init.sh:366-372)'` | live, S1, a string | **left (owner, PC-4: "leave")** — rule 1, strings not edited; stale at HEAD already. **For 0515.** |
| `test/coordination-citation-policy.test.js`: `'claude/fkit-claude-init.sh:481'` | test fixture string | left — a fixture, not a cite |
| `claude/structure-spec.md`: §"THE .gitkeep RULE"; `claude/orphan-targets`: "Init's step 3" | live | kept (the `.gitkeep` comment keeps the heading; §3 label kept) |
| `architecture.md`: "offline / proxied / captive-portal must cost nothing and print nothing"; "Codex preflight: optional but recommended — a WARNING, never a wall"; "Want two roles at once? Open a terminal tab yourself"; "Automatic: a throttled check that only ever PRINTS"; `FKIT_NET_TIMEOUT` | live | kept verbatim |
| `architecture.md` §9.5 "Residual drift": *"NO ROLE COUNT ON THIS LINE — deliberate"* (wrapped across a line break, so S3b's windows missed it — review R1) | live, quote | **fixed in review round 1** → *"No role count on this line"*, the summary comment's new wording; the fact (no count printed) is unchanged |
| open brief 0305: blockquote of the launcher header's hook sentence ("`--settings` wiring a `PreToolUse` hook … at any spawn depth, not just this session") | open brief | left: 0305 already carries a dated note (0306) that the blockquote quotes a past revision, and its claim — "denies any `Skill` call … at any spawn depth" — survives in the new header ("denies any `Skill` call whose REAL invoking agent's role doesn't own it, at any spawn depth") |
| open briefs 0328 ("always be able to reach their agents", "the two copies drifted"), 0329 ("-L is the one test that does not lie"), 0336 ("# 3. refresh the fkit-managed agents", "offending entry" — but see the 0336 row below), 0499 ("a running session gets it at its NEXT launch"), 0520 ("offline / proxied / captive-portal"), 0521 ("would die on its own confusing "agent not found""), 0403 ("its own header records from 2026-07-18" — the mirror block) | open brief | phrases kept; briefs untouched |
| open brief 0336, § "What to build", bullet "Correct §3's now-narrowed claim": quotes §3's old *"IS deleted, and is NOT put back"* (HEAD wraps it across "IS" / "deleted", so S3b missed it — review R3a); PC-1's new label already does part of that bullet | open brief, dependent quote | **missed by the build; corrected here in review round 1.** Brief not edited by this task: a producer added a dated note (owner ruling *"Worklog + brief notes (Recommended)"*, 2026-10-19; note seen in the brief) |
| open brief 0397, findings table row 7: cites init's header *"An existing tree is CONVERGED, not skipped"* as evidence (review R3b) | open brief, dependent quote | **missed by the build** (it was listed under "shared wording" below); the sentence is deleted — the reason now sits in the comment starting "Convergence (ADR-015)". Brief not edited by this task: a producer added a dated note (same ruling; note seen in the brief) |
| `test/structure-check.test.js`, test "an unreadable keep-out FAILS CLOSED…": "Init's R1 lesson, carried verbatim" quotes *"they meant nothing"*, which init no longer contains (review R3c) | live, test comment | **missed by the build; left** (outside this unit's files — owner ruling, review R3). The lesson's home is 0023 review R1, which init's "fails CLOSED … (0023 review R1)" comment points to. **For 0515** (its brief lists this file): re-anchor the comment on 0023 review R1 or drop "carried verbatim" |
| open briefs 0045, 0262, 0277, 0328, 0330, 0382, 0403: `path:NNN` cites into these files | open brief, S1 | left — lines only shifted (M4d, PC-1) |
| open briefs 0226, 0400, 0403 quoting the mirror block | open brief | block byte-identical (PC-2) |
| other open-brief S3b hits (0037, 0189, 0215, 0219, 0220, 0262, 0290, 0298, 0303, 0304, 0345, 0387, 0397 apart from its row 7 above, 0400, 0512, 0514) | open brief | shared wording (file names, ADR-018's link slug, `test/rules-block-budget.test.js`) — no dependent quote |
| ADR-010: quotes *"Retired here (`0052` / ADR-018, replacing ADR-012 §3): the old `skillOverrides`…"*, *"`team` / `team room` are NOT accepted — not here, and not at the menu either … `lead` is the only word this program accepts on any path"*, the header's *"Every session is locked two ways"*, *"spawning terminals needs AppleScript/Accessibility permissions…"* | ADR, quote | left (owner, R4: "Leave the ADRs"; M4d). Facts still stated: retired mechanisms (ADR-018 pointer), `team` not accepted, "Locked twice", the AppleScript/Accessibility reason |
| ADR-030: *"`Stop` only, never `SubagentStop` (`fkit-claude.sh:268`), so it never fires in a spawned consult"* | ADR, cite + quote | left (Q3, R4); "never SubagentStop, so a consult is never blocked" kept |
| ADR-043: *"awareness only: nobody runs what nobody is told to run"* (`claude/fkit-claude.sh:394`) | ADR, quote | left (R4); "Awareness only" kept |
| ADR `path:NNN` cites (ADRs 009, 010, 012, 014, 015, 016, 017, 018, 028, 030, 031, 043, 053) | ADR | left (owner, Q3) |
| other ADR S3b hits (ADR-012, 015, 018, 026, 036, 037, 039, 054, 055) | ADR | the ADR's own text that the comments had copied (e.g. ADR-015's invariant, ADR-039's suppression wording), or shared phrases — no dependent quote |
| `CLAUDE.md`, `README.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`, `claude/skills/fkit-team/SKILL.md`, `claude/skills/fkit-heal/SKILL.md`, `install.sh`, `PROJECT.md`, `bin/release.mjs`, `dashboard.sh`, other tests | live | shared wording (the lock description, divider dashes, file names) — their own text; no edit |
| dated reports, closed task folders, sprint boards, `test/fixtures/` | frozen | left (M4d) |
| `ai-agents/wiki-vault/` (pages and log) | wiki | left for the wiki role's next sync |
| this task's `plan.md` / `plan-review.md` | this task | not edited |

## V6 — Rule followed
M4h (block-aware awk; perl width check at 110 columns, code points, indentation included) on the final
files:
- **Launcher:** one run over 2 lines — the 20-line mirror block (named exception 1); two lines over
  110 columns (118, 120), both inside that block.
- **Init:** two runs over 2 lines — the 3-line and 5-line `#` runs inside the `INTERVIEW` heredoc (named
  exception 2); no line over 110.

**Named exceptions:**
1. `fkit-claude.sh`, the mirror-checklist block, "⚠️ CHANGING A ROLE'S SKILLS?" through "…without pulling
   in this script's top-level side effects)." (20 lines), byte-identical to HEAD (PC-2): it is 0226's
   deliverable; the owner's Q-A ruling routes its removal or pointer to a producer note in 0226.
2. `fkit-claude-init.sh`, the `INTERVIEW` heredoc's `#` lines — rule-1 data (the generated
   `.fkit/interview` script's shebang and comments). `datarun.sh` on both runs → **DATA** (every line
   survives `norm` verbatim); control: init's 2-line header comment → "REAL COMMENT (2/2 lines stripped)".

## Decision log — obvious-winner calls and unattended changes (ADR-019 / ADR-055 audit)
Each entry: what, why it qualified. All inside the approved plan's intent; none needed a new
knowledge-base destination (M1). No review finding was processed in this step.

- **D1 — rewraps that could not keep every word.** The plan allows a rewrap within the same words; three
  drafted 2-line comments were too long for 2 × 110 columns at their indentation, so one short phrase
  changed: (a) the reinstall comment, "rm -rf under **the** wrong root" → "under **a** wrong root";
  (b) the banner comment, "**the trigger** is a sha compare" → "**it** is a sha compare"; (c) the hooks
  comment, "(ADR-030; **Stop only,** never SubagentStop, …)" → "(ADR-030; never SubagentStop, …)" — the
  hook list already names Stop. Same facts each time. Same-word rewraps (logged as the plan asks): the
  `FKIT_SHARE` comment, the lockdown comment, "Not exec …" (→ 2 lines), the Enter comment, the
  "runnable" comment (→ 2 lines); init's `[ -L ]` FIRST, THE INVARIANT (→ 2 lines), THE .gitkeep RULE,
  "One well-formed pair", the ACCEPTED RESIDUAL comment.
- **D2 — PC-1's second comment split at its sentence boundary.** Adopted text: "… with exit 0 (0327).
  Refusals are non-fatal, exit status unchanged (ruling Q1a); one call per half." With line 1 that is
  245 characters — it cannot fit 2 lines of 110. Built as a 2-line comment ending "(0327)." plus its own
  1-line comment "Refusals are non-fatal, exit status unchanged (0327, ruling Q1a); one call per half."
  The re-added "0327, " is the plan's own earlier wording of the same pointer, needed because a bare
  "ruling Q1a" in its own comment would break M2. Obvious winner: PC-1's words kept, V6 and M2 met.
- **D3 — the "owner-signed bump" pointer kept although ADR-016 alone does not hold it.** ADR-016 holds
  the cap ("warranted, in code"); the signed-bump rule is in 0130's plan (rulings table) and 0190's plan
  ("This is the ADR-016 signed bump"). The approved comment names ADR-016 and 0190 together, which covers
  it; no change.
- **D4 — `0072 C2`, `C5`, `C6` written as drafted** (not "0072 review C5"): the plan's approved text; each
  ID is unique in 0072's `review.md`, so the pointer resolves. Not changed.
- **D5 — `bin/generate-structure-manifest.mjs`'s section header kept at its width.** Dropping ":374"
  from "(marker_lines, fkit-claude-init.sh:374) ────" would shorten the ruled header; four `─` were
  added back. Comment-only; token and AST hash equal.
- **D6 — `RELEASING.md`'s `:124` (stale at HEAD) mapped to line 106**, the top-level
  `fkit_ref="${fkit_ref:-main}"`, not the copy inside the update case (126): the sentence is about the
  default every launch resolves.
- **D7 — left untouched although short and not named by the plan's "unchanged" list** (M4j): none —
  every unnamed comment kept is one the plan names as unchanged (launcher lines 32, 68, 73, 75, 79–80,
  83, 86, 105, 107, 119, 126, 141, 145, 189, 198, 205, 208, 420, 583, 622–623; init 26–27, 30, 70–72,
  87, 122–123, 127, 150, 227, 498–499, 510, 587–588, 791, 821, 837–838, 865, 897, 951, 984–985 — HEAD
  numbering).
- **D8 — run-rule breaches recorded, not hidden.** The baseline prove-red started at load 12.28 and the
  final one at 8.12 (the gate read 7.43 four seconds before). Both runs were checked against
  `pmset -g log`; see V2.

### Review round 1 — Process-review step (2026-10-19, unattended under the ADR-055 marker)
Spawned by `fkit-sprint-ship-loop` (driver `fkit-lead`), Process-review worker. Owner rulings on R2, R3
and R4 relayed verbatim in the spawn (`AskUserQuestion`, `fkit-lead` session). Each fix below was
applied without a per-fix owner gate, so each is recorded here.

- **RR1 — answers review R1** (`architecture.md` §9.5 still quoted init's deleted *"NO ROLE COUNT ON
  THIS LINE — deliberate"*). Changed: the quote → *"No role count on this line"*, the wording now in
  init's summary comment; the V5 table gains the row. Why it qualified: verified `CORRECT` (the old
  words appear nowhere in init; the new ones do), mechanical and localized (one doc quote), inside the
  plan (plan §6: live quotes of changed comments are fixed — rule 5).
- **RR2 — answers review R2: NOT applied; returned `NEEDS-DECISION`.** The owner-ruled wording "…a
  wrong-type one at a payload name aborts init today (open 0336)" was checked against 0336's measured
  shapes, as the spawn required, and does not cover shape A: 0336's measured agents squatter is a
  directory named `fkit-x.md`, which is NOT a payload name, and it aborts init (after deleting every
  fkit agent). Re-measured here on a scratch tree with init's own `rm -f "$dest/.claude/agents/fkit-"*.md`
  statement under `set -euo pipefail`: `rm: …/fkit-x.md: is a directory`, rc 1, `fkit-coder.md` deleted
  first. So the narrowed text would imply a non-payload wrong-type entry is safe, which is false for
  the damaging shape. §3's label is unchanged from the build.
- **RR3 — answers review R3** (V5 missed three dependent quotes). Changed: V5 gains rows for 0336 (old
  §3 quote), 0397 row 7 (deleted header quote) and `test/structure-check.test.js` ("carried verbatim" /
  "they meant nothing", routed to 0515); the 0336 and 0397 entries in the "phrases kept" and "shared
  wording" rows are corrected; a "Known gap" note says why S3b missed them (line-wrapped quotes). Briefs
  0336 and 0397 and the test file not edited (owner ruling: a producer writes the brief notes). Why it
  qualified: verified `CORRECT` (each quote read in its file), docs-only, inside the owner's ruling.
- **RR4 — answers review R4** ("one call per half" lost its why). Changed: init's §3 comment
  "Refusals are non-fatal, exit status unchanged (0327, ruling Q1a); one call per half." → the owner's
  "…one call per half, so each half survives alone." On one line it is 115 columns, so it is rewrapped
  within the same words into 2 lines, breaking after "(0327, ruling Q1a);". Why it qualified: verified
  `CORRECT` (HEAD gave the reason; the build dropped it), comment-only, owner-ruled text.
- **Obvious-winner calls:** one — RR4's rewrap at the sentence's semicolon (the only split that keeps
  both lines ≤ 110 and each clause whole).
- **Re-proof after the round-1 edits:** M3 on init and the launcher — `norm` byte-identical to HEAD
  (25544 B, 21415 B), `bash -n` exit 0 both sides, `/bin/sh -n` launcher exit 0, `rule4.sh` clean
  (line 1 equal, no directive line), no mode change; secondary diff-line grep → still exactly the 3
  planned `merge_rules` exceptions. Width (code points, indentation included): no init comment line over
  110; launcher only the 2 mirror-block lines (118, 120). M4h: the new 2-line comment is 2 lines; init's
  only runs over 2 lines are the `INTERVIEW` heredoc data and the comment + `# shellcheck` directive
  above `set -- $(marker_lines …)` (unchanged from the build). F4: no target named outside
  `claude/orphan-targets`. F5: no changed line touches `RULES_*` or `emit_block`. `npm run test:docs` →
  410/410 pass; `coordination-citation-policy` + `reference-integrity` → 44/44 pass. Full `npm test` not
  run this round (comments only, `norm` identical); the loop's final Verify runs it.
- **RR2b — answers review R2, applied after the owner's second ruling.** Owner, quoted verbatim
  (`AskUserQuestion`, `fkit-lead` session, 2026-10-19): *"Short and true (Recommended)"*, whose option
  read *"'# is deleted and NOT put back; some wrong-type ones abort init today (shapes: open 0336).'
  Detail lives in 0336."* Changed: init's §3 label line 2 → that exact text (89 columns); line 1
  unchanged; the label stays 2 lines (M4l). Why it qualified: verified `CORRECT` (true for both of
  0336's measured shapes, and for its harmless non-payload file case), comment-only, the owner's exact
  text. Ledger set to `closed-out`: R1–R4 all done.
