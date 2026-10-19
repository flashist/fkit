# Plan — 0510: comment cleanup of the `/fkit-heal` scripts and the throughput counter

## 0. Summary
- **Scope: 3 files, comments only.** 443 comment lines by the brief's grep (`^[[:space:]]*(#|//|\*|/\*)`, measured 2026-10-17): `claude/skills/fkit-heal/check.sh` 120, `claude/skills/fkit-heal/repair.sh` 129, `claude/skills/fkit-status/throughput.mjs` 194. Expected after: about 142.
- **No line of code changes.** Proof per M3: `norm` for the shell files; raw-token hash and AST hash for the JS file (it loses several `/** … */` blocks); the rule-4 check; the secondary diff-line grep. Two expected V1 exceptions (trailing comments on code lines).
- **No reason moves into the knowledge base.** Every long reason already has a durable home — 0245 / 0246 / 0359's plan, worklog or review; ADR-017, ADR-039, ADR-014, ADR-029; the hashing contract in `claude/structure-manifest.tsv`'s header; `claude/structure-spec.md`'s "Machine-read contract — pinned" — or fits in 1–2 lines.
- **No edit outside the 3 files expected.** Live text pointing into them (`architecture.md`: the `# Outcomes:` header comment, the quote "apply-time freshness re-check", "Read-only in every branch") keeps resolving because that text is kept. Open briefs 0303, 0305 and 0384 quote these comments; each quoted phrase is kept (M4d's cheaper route).
- ⚠️ **New trap, method amendment M4k (§2):** `test/structure-repair.test.js` reads both heal scripts' source as text, so comment text is fenced.
- **One wrong-today comment fixed (M4i):** `repair.sh`'s header says the only write is "step (f)'s per-item redirect"; it is step (g).
- **Observation, outside scope:** `throughput.mjs` is a shipped skill executable that needs `node`; ADR-017 rule 3 says shipped executables assume `bash` only, and no record settles the exception. Open question Q-A (§9), for the lead to route; nothing here changes it.

## 1. Context checked
- Uncommitted work: `git diff HEAD --stat` on the 3 files is empty; `norm` and JS hashes of the working files equal HEAD. Sprint 12's closed tasks (0516, 0385, 0284, 0334, 0507) do not touch them. `architecture.md` carries 0507's 2-line diff — not a line this plan touches; the build records it first. `test/prove-red.sh` is modified by earlier tasks; not edited here.
- Copies: `.claude/` copies not edited; init not run. M4g has nothing to apply.
- No structure-manifest row names these files. No CHANGELOG line.
- Tools on HEAD copies 2026-10-17 (bash 3.2.57, node v24.13.0): `norm` exit 0 non-empty (check.sh 18365 bytes, repair.sh 16983), `bash -n` 0; throughput.mjs token hash `fd0a7d56…` (3236 tokens), AST `8b114a84…`, `node --check` ok. Only multi-line `$(` in scope: repair.sh `spec_rows="$(awk '…')"`, no comment inside.
- M4h baseline on HEAD: 30 comment runs over 2 lines (7 / 8 / 15); none over 110 columns; no rule-1 data runs.
- 0373: no self line-cites. check.sh's `fkit-claude-init.sh:374` cite goes (code-comments rule 2).
- 0513 / 0515: no test cites these files by line.

## 2. Method
0507's M1–M4j as amended through R9, applied as written: M1 pointers only (build stops and asks if a reason needs a new home); M2 (`0245-R6` → `0245 review R6`, bare IDs get their task; review IDs checked unique in 0245, 0246, 0359); M3 (shell `norm` + `bash -n` both sides; JS raw-token + AST hash + `node --check`; secondary grep with the R1 block filter; `rule4.sh` with `git diff HEAD --summary`); M4d/R4 (ADR quotes and cites left, listed in V5; S3b over `decisions/`; divider labels searched alone); M4f; M4h (block-aware awk + perl width, 110 columns, real lines incl. indentation); M4j.

**Amendment M4k — text fences.** Before editing a file, grep its name across `test/`, `bin/`, `claude/` (prove-red.sh included) and read every hit for code that reads the file as text: `readFileSync` (also via a variable or a loop) or shell `grep`/`sed`/`awk`/`cat`. List each fence and its kind: must-not-contain (no new comment may add the token), must-contain and exact-count (deleting comment text can break these — keep the counted text, or prove the count sits on code). M3 cannot see comment text; the test run is the proof. Here: `test/structure-repair.test.js` — must-not-contain `/\b(rm|mv|unlink|rmdir)\b/` over check.sh and repair.sh (through a `for … of [CHECK, REPAIR]` loop); repair.sh exact-count `/> *"\$root\//g` = 1 (on code: the step (g) `printf … > "$root/$p"` line; no comment carries it) and must-not-contain `mktemp` / `>>`. By 0246's accepted residual R8, new comments add no `cp`/`dd`/`tee`/`ln`/`truncate` word. All drafts checked: none present. Lives in 0510's worklog as a series amendment; the lead is asked to route a one-line note to the producer for 0508, 0509, 0511–0515.

## 3. Per-file changes
Drafts are ≤ 2 lines and ≤ 110 columns measured with indentation; a line found over 110 is rewrapped within the same words and logged. Two new comments that would touch get a real blank line between them.

### check.sh (120)
Header (67 lines) → seven comments, blank lines between:
- C0: `# Run as bash <path>, never ./: the exec bit may not survive install (ADR-017 rule 2).` (ADR-017 Consequences require the rule in the script's header; by rule name, not the `install.sh:44-46` cite.)
- C1: `# /fkit-heal's conformance check (ADR-039; 0245 plan §2). READ-ONLY IN EVERY BRANCH: its untouched-stale` / `# verdict is repair.sh's write gate. A script, not prose (ADR-017).`
- C2 (keeps ADR-043's quote): `# stdout is the test contract (ADR-017 rule 4): one line per spec-inventory row, in table order, then` / ``# `#` notes and a `# summary:` line. Exit 0 conforming, 1 nonconforming or refused, 2 could not run.``
- C3 (keeps architecture.md's `# Outcomes:` anchor): `# Outcomes: conforming / missing / untouched-stale / owner-edited / wrong-type / wiki-routed, plus the` / ``# refusals `refused: symlink`, `refused: malformed-markers`, `unreadable`, and `kept-out` (0245 plan §2).``
- C4: `# Reproduces the hashing contract in structure-manifest.tsv's header in bash, not node (ADR-017 rule 3);` / `# test/structure-check.test.js pins the bash-to-JS parity.`
- C5 (keeps open brief 0303's quote): `# Verdict once no refusal applies (0245 plan §3): hash == the installed copy's -> conforming;` / `# hash matches any structure-manifest.tsv row for the path -> untouched-stale; matches nothing -> owner-edited`
- C6: `# set -f: keep-out entries and spec paths match literally, never as globs. No set -e: a checker must never` / `# die mid-report; every failure is a classified outcome or a loud exit 2.`
Dropped: usage/share resolution (SKILL.md and code; the trailing self-host comment stays); the hashing-pipeline copy and its line cite (manifest header); the precedence copy (0245 plan §3); "THE ONE EXCEPTION" (reason moves to the keep-out comment); history (0246 plan §4 records the residual dispositions).
Body:
- Seven `# ── … ──` dividers → delete.
- `valid_sha` (3) → `# A present-but-broken sha tool prints garbage at exit 0, and garbage on both sides reads as conforming:` / `# every hash must look like a sha256 (0245 review R6).`
- `has_nul` (3) → `# awk truncates a record at a NUL, so an edit hidden after one could classify untouched-stale, the write` / `# gate. wc and tr are byte-exact: any NUL refuses to classify (0245 review R1).`
- Spec inventory (divider + 3) → `# An unknown class or a missing pinned heading refuses (exit 2): a stale skill copy must not guess against a` / `# newer spec. The table format is structure-spec.md's "Machine-read contract — pinned".`
- 0245-R5 in the class loop (3) → ``# Spec paths must be project-relative: an absolute or `..` row would read, and in repair.sh write, outside`` / `# $root. The spec is trusted input, so such a row is corruption: refuse the run (0245 review R5).`
- Keep-out divider + 0245-R3 (1 + 4) → `# Keep-out uses init's parser semantics. An unreadable keep-out fails CLOSED: no ai-agents/ rows, root` / `# files still checked, exit 1. Intent was recorded and cannot be read (0245 plan §2, "Keep-out").` — blank line — `# [-L] on ai-agents/ comes first, so a symlinked ai-agents/ never has its keep-out read through the link` / ``# (0245 review R3); the row loop then refuses the subtree as `refused: symlink`.``
- `hash_content` (5) → `# hash_content <file> <elide:0|1> <lb> <le>. A record's \r is dropped only when a \n ended it: a final \r` / `# with no newline is content, as in the generator's \r\n-only replace. lb/le from the raw file stay valid.`
- `installed_hash` inner "0245-R6 belt-and-braces" (2) → `# Never emit a non-sha "hash": garbage here equals the project side's garbage and reads as conforming.`
- Kept unchanged: `file_hash` / `installed_hash` / `content_verdict` one-liners; both `# shellcheck disable=SC2046`; all trailing comments; row-loop comments (2, 1, 2, 2, 2); closing exit comment (2).
- Data, untouched: awk program text incl. `# path:` / `# class:`; `vdetail` strings with `(0245-R1)` / `(0245-R6)`; `printf '# note: …'` / `# summary:`.

### repair.sh (129)
Header (58 lines) → six comments, blank lines between:
- H0: `# Run as bash <path>, never ./: the exec bit may not survive install (ADR-017 rule 2).`
- H1 (keeps open brief 0305's quote): `# Consent-gated /fkit-heal repair (ADR-039): the LLM's only jobs are to PRESENT the proposal verbatim and` / `# collect the owner's consent; this script computes what would change and applies exactly what was approved.`
- H2: ``# propose (exit 0 even when empty, 2 = cannot run): per untouched-stale row, one `item` line and its `# diff`.`` / `# Hashes are RAW-byte, not check.sh's normalized ones: they fingerprint exactly the bytes shown and written.`
- H3 (keeps 0305's second quote): ``# apply: reads approved `item` lines VERBATIM on stdin, re-runs check.sh, then guards each item through`` / `# steps (a)-(g) below, announcing every result, refusals included. Apply's output and exit codes: SKILL.md.`
- H4 (fixes "(f)" → "(g)"): `# ⚠️ v1 scope (ADR-039 Decision 1): replacement only, never a move, rename or delete; the one project write is` / `# step (g)'s redirect; the repair test pins both by word match only. Consent is never stored (Decision 2).`
- H5: `# Helpers are duplicated from check.sh on purpose (0246 plan §1; worklog decision log item 3). The fixture` / `# "apply, then check.sh says conforming" fails if the two scripts' hashing contracts drift apart.`
Dropped: the (a)–(g) list (each step keeps its own comment); the exclusion detail (kept at the diff site); "no temp file … process substitution" (the fence test pins it); history.
Body:
- Dividers `# ── arguments …`, `# ── sha256 …`, `# ── the fresh check run …`, both `# ═══…` → delete.
- 0245-R6 (1) → `# A broken sha tool must refuse, never apply (0245 review R6).`
- Spec-classes divider → `# Same pinned awk as check.sh's parse_tables (structure-spec.md, "Machine-read contract — pinned").`
- Byte-exact divider + NUL note → `# Byte-exact slicing with head/tail/wc, never awk records. NUL input never gets here: check.sh refuses it` / `# (0245 review R1), and apply's eligibility re-check holds that against forged items.`
- Synthesis (divider + 7) → `# Replacement bytes (0246 plan §2): a reference file is the scaffold copy; a root file keeps its own marker` / `# region inside the scaffold body; a markerless one is replaced whole (0246 plan, ruling Q1).`
- Trailing `# markerless untouched-stale: whole-file replace (Q1)` → deleted with the spaces before it. V1 exception: the `cat "$sf"` line in `synthesize`'s markerless branch.
- Scaffold NUL guard (3) → `# apply buffers the replacement in a shell variable, which cannot hold NUL: refuse a NUL-bearing source.`
- Diff block, 0246 review R5 (7) → `# Consent needs the diff in view (ADR-039 Decision 2): buffer it, and retract the item if diff fails` / `# (0246 review R5). The x%03d sentinel carries diff's rc; both inputs are NUL-free.`
- Trap (4) → `# An interrupt mid-apply must never be silent: name the in-flight path, exit nonzero (0246 review R7).`
- Step (e) (12) → above the dry run: `# (e) Synthesize ONCE and hash that very buffer against the posthash before any write (0246 review R1, R6).` / `# This dry run in the parent shell sets $synth_reason; a command-substitution subshell could not.` — above `if ! repl="$(synthesize …)`: ``# Buffer, then write: `synthesize > target` truncates the target before reading its markers (0246 worklog,`` / `# decision log item 1). The trailing x keeps $( ) from stripping trailing newlines.`
- Step (f) (8) → `# (f) Last instant before the redirect: re-walk [-L], refuse a multi-link target (an in-place write rewrites` / `# every co-link), re-hash vs prehash (0246 review R2-R4; the races left are that review's residuals).`
- Kept: (a), (b), (c), "(d) apply-time freshness re-check (ADR-039 Decision 2).", (g); "Keep the result well-formed…" (2); "Cannot happen while check.sh's class rules hold…" (1); "# apply — one announce line per submitted item: …" (1); function-signature trailing comments; four `# shellcheck disable=SC2046`.

### throughput.mjs (194)
Header (35 lines) → four comments:
- T1: `// Run as: node .claude/skills/fkit-status/throughput.mjs [flags]. Never ./ (exec bit, ADR-017 rule 2); never` / `// bash, which cannot run JavaScript (0359 worklog D2). The shebang is decorative.`
- T2: `// Gives /fkit-status a measured trend from git history in place of a snapshot (0359 plan §7, ruling W6).`
- T3: `// Pure function of (repo, revision) -> (stdout, exit code): reads git, never the worktree; writes nothing;` / `// no dependency (ADR-014). No --worktree mode on purpose (0359 plan, ruling W5).`
- T4: `// Emits its own ⟦fkit-throughput v1⟧ markers: no dashboard.sh parser sees a new token (0359 plan §6).`
Dropped: "PORTABILITY" (moves to `isoWeek`); "This script COUNTS…" (T3).
Body (all exported functions use `//` comments):
- Record-repair block (divider + 15) → `// A RECORD REPAIR: the slug's leading verb is one of these, i.e. work on the project's own written record.` / `// ⚠️ The rule is A PROXY, PERMANENTLY: --list prints each open row's verdict for a check by hand.` (keeps 0384's quote) — blank — `// The verbs were pinned by reading every open row, never by fitting a target count (0359 worklog D1).`
- `SOURCE_DEFECT_EXCEPTIONS` (4) → `// Repair-verb rows whose subject is a source defect, not a record: a human judgement the slug cannot give,` / ``// so each is named and printed as `exception`. The only hand-maintained list in this file.``
- `classify` JSDoc (5) → `// Takes a folder slug, e.g. "0234-fix-dashboard-drift-rule-2".`
- Four `// --- … ---` dividers → delete.
- `isoWeek` JSDoc (8) → `// ISO-8601 week by the Thursday rule, in JS because git's %G/%V go through a non-portable strftime (0359` / `// plan §3). Reads the date as written, never re-projected to UTC: a commit belongs to its author's week.` Trailing comments inside stay.
- `briefIdentity` JSDoc (8) → `// Identity: a folder's NNNN (ADR-029); before the migration, the flat filename stem, so per-week counts are` / `// exact there but per-ID drill-down is not (0359 plan, ruling W2).`
- `foldTransitions` JSDoc (40) → `// records must be oldest first, as readHistory returns them.` and the three cases at their branches:
  - `// Carry state across the rename: same task, new name.` → `// A rename carries identity, so a flat stem and the NNNN it was given count as one task.`
  - same-segment branch, replacing `// ⛔ Shape change only …`: `// A same-segment rename (the migration, a slug rename) is a shape change, not a transition. The guard` / `// matters where the carry cannot fire, e.g. a shallow history (0359 worklog D4; 0359 review R5).`
  - above `if (rec.status === 'A') {`: `// A brief can be born closed: created and closed between two pushes, it first appears under done/.`
  - trailing `// born closed — case 1` → deleted with its spaces. V1 exception: the `st.closed = week; closed += 1; bump(week, 'closed', rec.commit);` line in the `'A'` branch.
  - `'M'`/`'D'` (3) → `// 'M' and 'D' are not transitions. The movers never delete a brief, so a D means the file left by another` / `// route, and inventing a close for it would be a guess.`
- `repoRoot` (10) → `// ⛔ Resolve the repo root: a pathspec is relative to the caller's cwd, so a subdirectory run printed a` / `// well-formed report of all zeros at exit 0 (0359 review R1).`
- `readHistory` (15) → `// ⛔ The pathspec stays the whole ai-agents/tasks/ tree: narrowed, git cannot see a rename's source side and` / `// every close reads as an add (0359 plan §0.3). --find-renames is forced, not config (0359 review R2).`
- `readOpenRows` (13) → `// The open rows in rev's TREE, both eras: folders and flat <slug>.md briefs (0359 review R4, ruling W2).` / `// --full-tree makes the path root-relative, the same silent-zero hazard as repoRoot (0359 review R1).`
- Self-check (6) → `// Self-check: every task is created once and closed at most once, so created - closed must equal open;` / `// the report refuses to print when it does not, e.g. with rename detection off (0359 review R2).`
- Migration note (6) → `// ⛔ Computed from the fold, never asserted: the migration commit also carries one real close` / `// (0359 review R3).`
- `parseArgs` (5) → ``// ⚠️ A flag is never a value: `--at --list` must be a usage error, not a bad revision (0359 review R9).``
- `isDirectInvocation` (7) → `// ⚠️ realpathSync and pathToFileURL are both load-bearing: a symlinked argv[1] (macOS /tmp) or a path with a` / `// space or # never matches import.meta.url, and the script exits 0 printing nothing (0359 worklog D3).`
- Kept: reopen comment (2), "A task whose brief was never committed…" (1), trailing comments, `// Otherwise … status field`, `// <mode> <type> …`, `findMigration`'s one-line `/** */` (not exported, M4j).
- Data, untouched: `USAGE` and every output string.

## 4. Mutations and tests
- Mutation 29 (throughput): sed matches the whole line `      if (from.segment === to.segment) {`; it stays byte-identical, no trailing comment, no comment contains `from.segment === to.segment`. Step 0n runs the suite on an unmutated copy.
- No mutation on check.sh / repair.sh; launcher copies run check.sh for the structure notice.
- Text readers (M4k): only `test/structure-repair.test.js`'s two fences.
- Suites: structure-check, structure-repair, structure-notice, throughput-counter.

## 5. Inbound references (V5)
S1 (`:NNN`/`#L`/"line N" cites, whole repo), S2 (header/comment prose), S3a (~50 phrases), S3b (30-char pieces over claude, test, bin, knowledge-base incl. decisions, open briefs, top-level docs), divider labels.
| Hit | Kind | Action |
|---|---|---|
| architecture.md: "its `# Outcomes:` header comment" | live | kept (C3) — no edit |
| architecture.md quotes "apply-time freshness re-check" | live | `(d)` comment unchanged |
| architecture.md "Read-only in every branch" | live | C1 |
| open brief 0303 quotes check.sh's classification comment | open brief | phrase kept (C5) |
| open brief 0305 quotes repair.sh header + "reads approved `item` lines VERBATIM on stdin" | open brief | kept (H1, H3) |
| open brief 0384 quotes "A PROXY, PERMANENTLY" | open brief | kept |
| open brief 0303 quotes "the consent given was to a diff that no longer exists" | open brief | a `say` string (data) |
| ADR-043: `check.sh:23` + quote "one line per spec-inventory row, in table order", `:107`, `:139-155`, `:155` | ADR | left (Q3, R4); quote kept in C2 |
| ADR-017 shares exec-bit wording | ADR | source of the pointer |
| wiki 0506 page quotes "`# Outcomes:` header" | wiki | left; header kept |
| other open briefs naming the files (0262, 0298, 0304, 0383, 0396, 0403, 0452, 0500, 0513, 0522) | open brief | quote no comment — no action |
| test headers share words | live | own text |
| reports, closed tasks, boards, `.fkit/tmp/` | frozen | left |

## 6. Sequence
0. Baseline (cmp vs HEAD; architecture.md's diff; V3; M3 hashes; M4h; one full `npm test` alone). 1. Re-run S1–S3 + labels. 2. M4f/M4k re-read. 3. Edit one file at a time; after each: M3, `rule4.sh`, fence grep (`/usr/bin/grep -wE 'rm|mv|unlink|rmdir'` both scripts; repair.sh `> *"\$root/` count 1, no `mktemp`/`>>`), M4h. 4. Behavioural equality, HEAD copies vs edited files on this repo: `bash check.sh --share <repo> <repo>` stdout+exit identical; HEAD check.sh+repair.sh together vs tree, `repair.sh propose` identical; `node throughput.mjs --repo <repo>` and `--list` identical. 5. Pointer check (M4e). 6. Worklog (V1–V6, decision log, M4k). 7. Verify: 4 suites, full `npm test`, `npm run test:docs` after the worklog.

## 7. Checks
Run: the 4 suites; full `npm test` (CONTRIBUTING: non-`.md` under `claude/`; prove-red names throughput.mjs); `npm run test:docs`; M3; `bash -n` ×2; `node --check`. Skipped: live `/fkit-heal` / `/fkit-status` session runs (step 4 compares real output). Full suite alone, 1-min load < 8, no CPU burners.

## 8. Edge cases
`#` inside awk / `vdetail` / `say` / `printf` strings is data; JS `//` / `/*` in `USAGE` or output strings is data; deleting multi-line `/** */` could shift ASI — AST hash closes it; bash 3.2 multi-line `$(` only `spec_rows`; blank line between touching comments (C0/C1, H0/H1); width with indentation, code points (`⚠️`, `⛔`, `⟦⟧`, `§`, `—`); shellcheck directives stay above their `set --` lines; shebangs untouched; mode 100644; fenced tokens (M4k); a pointer heading that does not exist → reworded (mechanical); acorn fallback per M3; pre-existing uncommitted work separated by the baseline run.

## 9. Open questions
- Q-A (not blocking; for the lead to route to the owner): ADR-017 rule 3 vs node in throughput.mjs — record an ADR-017 dated addendum or new ADR allowing node for skill scripts or moving the counter to bash (Rec), or leave unrecorded. Knock-on for 0510: none (checked).
- Request to the lead: route the M4k note to the producer for 0508, 0509, 0511–0515.

## Owner rulings at the plan gate (2026-10-17, AskUserQuestion, fkit-lead session)

This section is the lead's; the plan above and the post-Codex questions below are copied from the
coder's return. Where they differ from the plan above, the rulings below govern.

- PC-1: **"Keep it (Recommended)"** — option 1 adopted: T3 line 2 carries `node >= 18` as drafted below.
- Q-A: **"File a backlog brief (Recommended)"** — a producer files it; not part of this build.
- M4k note: **"Yes, add a note (Recommended)"** — a producer adds the note to the later units' briefs; not part of this build.
- Plan: **"Approve (Recommended)"**.

## Post-Codex questions (the plan above is unchanged; option 1 is recommended)

PC-1 (Codex X1): keep the node minimum.
1. **(Rec) Put it into T3.** T3 line 2 becomes `// node >= 18, no dependency (ADR-014). No --worktree mode on purpose (0359 plan, ruling W5).` (93 columns). T3 stays 2 lines, and nothing else changes. Knock-on: none (checked).
2. Leave the plan as it is and drop the version statement.

## Open questions for the owner
- Q-A (does not block 0510): fkit's own rule (ADR-017 rule 3) says scripts shipped into a user's project may rely only on bash, but `throughput.mjs` needs Node.js, and no decision records that exception. Options: (1, Rec) the owner records a decision, either as an ADR-017 dated addendum or a new ADR, that either allows node for skill scripts or moves the counter to bash; (2) leave it unrecorded. Knock-on for 0510: none (checked). If a brief is filed for it, the producer asks where to place it at that time.
- Request to the lead (not an owner question): route the M4k note to the producer so the plans and spawn prompts for 0508, 0509 and 0511–0515 pick it up.
