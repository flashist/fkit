# Plan — 0247: launch-time structure notice + per-path intent-file suppression

> Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-07 — verbatim
> selections: plan **"Approve (Recommended)"**; open question 1 ruled **"All exit-1 outcomes
> (Recommended)"** (`owner-edited` fires the notice; the intent file is the remedy); open question
> 2 ruled **"Accept name (Recommended)"** (`ai-agents/.fkit-accepted-drift` as proposed); open
> question 3 ruled **"Seed it (Recommended)"** (this repo's own intent file is seeded with the
> known dogfood drift in this task — consequence owned: those paths stay notice-silent across
> versions until entries are deleted). Plan authored by a spawned fkit-coder (`/fkit-plan-task`),
> presented by the fkit-lead driver, written to this file by the driver in the approval turn
> (fkit-sprint-ship-loop §Durable artifacts).

Task: `ai-agents/tasks/backlog/0247-add-the-launch-time-structure-notice-and-intent-file-suppression/brief.md`
Authority: design report §5 candidate 2 + §9 (implement, do not re-derive); ADR-039 Decision 3 (Q3 "Yes + yes"); ADR-015 invariant untouched (read-only path); ADR-017 (script invocation rules).

## 0. The one architectural decision: reuse `check.sh`, don't build a lighter probe

The launcher will invoke the **shipped checker** — `bash "$here/skills/fkit-heal/check.sh" --share "$share" "$proj"` — and parse its stdout row contract (`<outcome>\t<path>\t<detail>`, `#`-prefixed notes, exit 0/1/2). Reasons, weighed:

- **No drift, ever.** A second, lighter classification pass is a hand-maintained mirror of check.sh's semantics (hashing pipeline, marker elision, precedence, keep-out fail-closed). The repo's own recorded failure class (task 70: "a checklist that is itself incomplete is worse than no checklist") says this rots. A notice that disagrees with the on-demand check is worse than no notice.
- **The seam is designed for this.** ADR-017 rule 4 makes check.sh's stdout the pinned machine contract; `test/structure-check.test.js` already pins it. Parsing rows is consuming a stable interface, not coupling to internals.
- **Read-only is inherited, not re-proven.** check.sh is verified write-free in every branch (0245's zero-mutation sweeps). A new probe would need that proof from scratch.
- **Cost is bounded and measured, not assumed.** ~34 spec rows, ~17 content hashes, a few dozen subprocess spawns — same order as work init already does per launch (find/sort/awk/cp). Step 6 measures it and the report states the number; acceptance heuristic ≤ ~250ms on this repo's fixture. If measurement blows that budget, that is a stop-and-surface, not a silent switch to a probe.
- Which copy: the **share's** (`$here/skills/fkit-heal/check.sh`; `$here` is the running launcher's own `claude/`, correct under both install and self-host). Never the project's `.claude/skills/` copy — it can be stale, and the share is the authority check.sh itself resolves to.

`check.sh`, `repair.sh`, `fkit-claude-init.sh`: **zero edits.** The whole change lands in the launcher, one skill doc, and tests.

## 1. Files changed

| File | Change |
|---|---|
| `claude/fkit-claude.sh` | new `structure_notice()` + one call site; full contract comment block (the "artifact's own docs" for the intent file, per the keep-out precedent) |
| `claude/skills/fkit-heal/SKILL.md` | new short section: the launch notice + the intent file (name, semantics, owned consequence, and that the **on-demand check never suppresses**) |
| `test/structure-notice.test.js` | new suite (cases in §5) |
| `test/prove-red.sh` | one new launcher mutation (§5, last item) + index line kept in step (the file's own warning) |
| `ai-agents/.fkit-accepted-drift` | NEW (Q3 ruling) — seeded with this repo's known dogfood drift |

## 2. The notice pass (`claude/fkit-claude.sh`, POSIX sh)

**Placement:** immediately after the `setup_ok` warning blocks and **before** the `FKIT_SETUP_ONLY` exit. Consequences, stated: it runs under `FKIT_SETUP_ONLY=1` (deliberate — that is what makes it testable through the existing harness, and a structure notice at setup time is coherent); it runs once per launch on every path to a session (fresh-project, menu, named role); `fkit update`/`--help` exit earlier and never reach it; the self-host re-exec happens before setup, so no double notice.

**Behavior:**

1. Guards, each a silent `return 0`: check.sh absent from the share (old install); `bash` not on PATH; check invocation fails with anything but exit 1. Every step is `|| rc=$?`-guarded — the launcher runs `set -eu`, and non-fatality on every failure is a safety-bar row, not a nicety.
2. Run `bash "$here/skills/fkit-heal/check.sh" --share "$share" "$proj"`, **capturing stdout, discarding check.sh's stderr** (`2>/dev/null`). The one-line contract is the launcher's; check.sh's own warnings would duplicate init's (which already announced symlinks, unreadable keep-out, etc. on the same launch).
3. Parse rows; a row is *notice-relevant* iff its outcome is in check.sh's exit-1 set: `missing`, `untouched-stale`, `owner-edited`, `wrong-type`, `wiki-routed`, `refused: symlink`, `refused: malformed-markers`, `unreadable`. `conforming` and `kept-out` never are. **Key off rows, not the exit code** — this makes the `ko_refused` case (loud init warning already given, no ai-agents rows printed) come out silent unless a root file also diverges, with no special-casing.
4. Filter through the intent file (§3). Zero rows remain → **complete silence** (the happy path runs on every launch of every project forever — init's output-trap rule, carried verbatim).
5. Else print **exactly one stderr line**, convergence-announcement shape, naming the mismatched paths (first 3, then `+N more`), e.g.:
   `⚠ fkit: 2 path(s) diverge from what the installed fkit version ships (ai-agents/README.md, CLAUDE.md) — run /fkit-heal in a producer session to see and repair; nothing was changed. Deliberate? List the path in ai-agents/.fkit-accepted-drift.`
   Never a repair, never a prompt, never stdout. Exact wording polishable in review; the *one line / stderr / names paths / points at /fkit-heal / states nothing changed* properties are the contract.

**No memory:** no stamp, no throttle, no cursor, no `.fkit/` state — the notice prints while the mismatch exists and stops when fixed (Q3; ADR-015 Context §3's rejected cursor stays rejected). Also **no env kill-switch**: a `FKIT_NO_STRUCTURE_NOTICE` would be the global mute Q3 explicitly forbade, one layer down.

## 3. The intent file — per-path tracked suppression

- **Name (RULED, Q2):** `ai-agents/.fkit-accepted-drift`. A **sibling** of `.fkit-keep-out`, not entries in it — keep-out means "never create this path"; overloading it would make a drift acceptance also suppress creation. Two intents, two files.
- **Tracked** (lives in `ai-agents/`, never `.fkit/`) — survives a clone, shared with teammates; records **intent, not progress**.
- **Entry form:** one **project-root-relative** path per line (`ai-agents/README.md`, `CLAUDE.md`) — root-relative rather than keep-out's ai-agents-relative because the notice's scope includes `CLAUDE.md`/`AGENTS.md`, which sit outside `ai-agents/`. Matches check.sh's report paths directly. An entry covers the path **and everything beneath it** (keep-out's subtree rule). Parser semantics carried verbatim from the keep-out parser: `#` comments, blanks, CRLF-trim, strip leading `./`/`/` and trailing `/`, literal matching only — `set -f`-discipline, never globbed (init's R3 lesson).
- **Scope rules, binding (§5/ADR-039):** no global switch; no per-mismatch keying (path + content identity records a *position* — the rejected cursor by the back door). An entry suppresses the path whatever the outcome and whatever the content.
- **Owned consequence, stated in the launcher comment block and SKILL.md:** a suppressed path stays silent even when a future fkit version changes what ships there; consistent with the recorded intent ("this path is mine now"); reversible by deleting the entry.
- **Failure direction:** an intent file that is a symlink / directory / unreadable is **ignored (nothing suppressed)** — the notice prints. This inverts keep-out's fail-closed direction *deliberately and correctly*: keep-out gates a **write** (fail closed = don't write); this gates **silence** (fail closed here = don't silence — the worst case is one extra stderr line, never hidden drift and never a write). The comment block states this asymmetry so nobody "fixes" it into the wrong direction.
- **Suppression applies to the notice only.** The on-demand `/fkit-heal` check still reports suppressed paths in full — it is the diagnostic, and hiding rows from an explicit request would be suppressing evidence. Stated in SKILL.md.

## 4. Sequencing

1. `structure_notice()` + call site + contract comment in `claude/fkit-claude.sh`.
2. SKILL.md doc section.
3. `test/structure-notice.test.js` (below) — new fixtures via the existing `harness.mjs` (`makeProject`, `runFkit`, stubbed claude/codex/curl; zero repo writes).
4. prove-red mutation 15: a copied launcher with the `structure_notice` call removed must red the drifted-fixture assertion by name; index list updated in the same edit. (0245 skipped prove-red *because check.sh is not the launcher*; this change **is** launcher code, squarely ADR-026 scope.)
5. `npm test` (unit + prove-red) green.
6. Cost + byte-identity verification (§6).
7. Q3 ruling: seed `ai-agents/.fkit-accepted-drift` in this repo with the known dogfood drift (7 conventions files + CLAUDE.md/AGENTS.md as verified by a live check.sh run), each entry commented; verify the seeded repo launches silent.

## 5. Tests (`test/structure-notice.test.js`)

Per the brief's verification steps and §9's safety-bar rows:

1. **Conforming fixture → silence**: fresh `makeProject`, run launcher — stderr carries no notice marker; stdout unchanged; also byte-compare full launch stderr/stdout against the same fixture pre-change (manual step in §6; the automated test asserts absence + stdout-empty of notice text).
2. **Drifted fixture → one line, stderr only, zero writes**: append a line to a conventions file (`owner-edited`) — exactly one line matching the notice pattern on stderr, naming the path; nothing on stdout; before/after sha256 sweep of `ai-agents/**` + `CLAUDE.md` + `AGENTS.md` unchanged (the zero-mutation-sweep pattern from `structure-check.test.js`). Q1 RULED: all exit-1 outcomes fire — the owner-edited fixture stands.
3. **Fix the drift → silence returns**, and a full-tree listing shows **no state file anywhere** (nothing new under `.fkit/` beyond `settings/`, `interview`, `state/`; nothing new in the project).
4. **Per-path scope proven**: drift paths A and B; intent entry for A → one line naming only B; entries for both → silence; a subtree entry covers a child path.
5. **Safety bar**: (a) symlinked `ai-agents/` — launch completes, non-fatal, no traversal (the `-L`-first refusal itself is check.sh's, already pinned in its own suite; this asserts launcher-level non-fatality and that the notice pass added no probe of its own); (b) spec/manifest removed from the share (exit 2) → launch continues, silence; (c) unreadable keep-out (fail-closed path) → silence when roots conform; (d) unreadable/symlinked intent file → notice still prints (nothing suppressed), launch completes; (e) `kept-out` rows never trigger the notice.
6. **Prove-red**: mutation 15 reds the named assertion from case 2.

## 6. Verification beyond the suite

- `git diff claude/fkit-claude.sh` grepped for write actions against project paths (`>`, `>>` into `$proj`, `mkdir`, `cp`, `mv`, `rm`, `touch`) — the notice pass must show none (brief verification 6).
- **Byte-identical launch**: same conforming fixture, launcher pre- and post-change, `FKIT_NO_UPDATE_CHECK=1 FKIT_SETUP_ONLY=1` — stdout and stderr byte-compared.
- **Cost**: `time` the notice pass on this repo's checkout; report the number. Budget heuristic ≤ ~250ms; a blowout stops and surfaces rather than silently degrading.
- Confirm `check.sh`, `repair.sh`, `fkit-claude-init.sh` show zero diff.

## 7. Edge cases and failure modes accounted for

- `set -eu` launcher: every non-zero in the pass is guarded; a notice failure never costs the session (task-26 bar).
- Row paths carry trailing `/` for directories — stripped before matching.
- Paths with spaces: newline-delimited handling, awk-based matching, no globbing.
- Old install whose share predates 0243/0244/0245 → guard 1 silences cleanly.
- Dogfood repo consequence, owned: this repo has 7 drifting conventions files + customized root files — post-change, every launch here notices until intent entries are added. Q3 RULED: seed the intent file in this task.
- Test-suite cost: the notice now runs inside every `makeProject`; conforming fixtures stay silent, existing argv assertions (`deepEqual`) unaffected.

## 8. Out of scope (restated from the brief)

No write to the consuming project from the launch path; no repair or prompt at launch; no cursor/progress state, no global switch, no per-mismatch keying; no wiki-vault write; no commit, no re-rank, no task-file move; no edits to check.sh/repair.sh/init.

## Open questions — RULED by the owner 2026-08-07 (see header)

1. **Does `owner-edited` fire the every-launch notice?** Options: (a) faithful — all exit-1 outcomes fire; the intent file is the designed remedy (Rec); (b) carve out owner-edited. **RULED: "All exit-1 outcomes (Recommended)".**
2. **Intent-file name and entry form:** `ai-agents/.fkit-accepted-drift`, entries project-root-relative, subtree-covering, keep-out parser semantics. **RULED: "Accept name (Recommended)".**
3. **Seed this repo's `ai-agents/.fkit-accepted-drift` with the known dogfood drift in this task?** **RULED: "Seed it (Recommended)".**
