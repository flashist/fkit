# Plan — 0246: the consent-gated repair path inside `/fkit-heal` (propose-then-apply, v1 scope)

> Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-07 — verbatim
> selections: plan **"Approve (Recommended)"**; open question 1 ruled **"Include, whole-file
> (Recommended)"** (a markerless untouched-stale root file IS proposed, as a whole-file replace
> with the current scaffold copy); open question 2 ruled **"In scope (Recommended)"** (the
> R1/R3/R5/R6/R8 fixes to `check.sh` are part of this task). Plan authored by a spawned fkit-coder
> (`/fkit-plan-task`), presented by the fkit-lead driver, written to this file by the driver in the
> approval turn (fkit-sprint-ship-loop §Durable artifacts).

**Task:** `ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/brief.md`
**Authority:** ADR-039 (the licence — v1 = consent-gated replacement of untouched-stale fkit-authored files ONLY; no move/rename/delete; plan-level approval of the enumerated per-file list with diffs in view; never announce-only; never stored; apply-time freshness re-check). Design report `2026-08-06-design-post-update-structure-check.md` §7 (consent model), §8 (root-file mechanics), §9 (fixtures). Where brief and ADR-039 could be read apart, the ADR governs.
**Deps verified on disk:** 0242 Done (ADR-039 exists, accepted), 0245 Done (`claude/skills/fkit-heal/check.sh` + `SKILL.md` shipped, producer-owned, 24/24 tests).

## 1. Shape

Two scripts in the shipped skill dir, one prose procedure:

- **`claude/skills/fkit-heal/check.sh`** (existing, edited): stays **read-only in every branch**. Edits limited to the 0245-residual fixes whose re-raise clauses fire on this task (§4 below) plus a header update (drop "0246 does not exist yet").
- **`claude/skills/fkit-heal/repair.sh`** (NEW): the deterministic propose/apply engine (ADR-017 — all byte mechanics in script, never LLM arithmetic). Two modes:
  - `repair.sh propose [--share <dir>] [root]` — runs `bash check.sh` with the same args, parses its pinned stdout contract, and for each `untouched-stale` row emits one machine line `item<TAB><path><TAB><prehash><TAB><posthash>` followed by a `# diff <path>` unified-diff block (current file vs the exact replacement content). Prehash = **raw-byte** sha256 of the on-disk file (no normalization — it fingerprints the exact state the proposal shows); posthash = raw-byte sha256 of the synthesized replacement. Exit 0 (even when the proposal is empty), 2 cannot-run.
  - `repair.sh apply [--share <dir>] [root]` — reads approved `item` lines verbatim on stdin. Per item, in order: (a) path validation — relative, no `..` segment, present in the spec inventory, and **hard-refused if under `ai-agents/wiki-vault/`** (ADR-005, belt-and-braces); (b) `-L` symlink refusal on the target **and every ancestor component** down from `$root`; (c) freshness re-check — raw re-hash must equal prehash, else `refused: changed-since-propose`, never applied (ADR-039 Decision 2); (d) re-synthesize the replacement and re-hash — must equal posthash, else `refused: replacement-drifted` (catches a mid-session `fkit update`); (e) write in place via redirect (no temp-file rename — no `mv` anywhere in the script), re-hash the written bytes = posthash else a loud `error: verify-failed` line; (f) announce per path what actually happened — `applied` / `refused: …` / `error: …`, one line per item including refusals (init's reporting bar). Exit 0 all applied; 1 any refusal/error; 2 cannot-run. **The script contains no `rm`, `mv`, `unlink`, `rmdir` token — pinned by a grep fixture.**
- **`claude/skills/fkit-heal/SKILL.md`** (edited): frontmatter description rewritten (no longer "report-only in every branch"); the repair procedure appended after the check procedure (§3 below); the outcomes table's `untouched-stale` row updated to "repair-eligible via this skill's repair phase (consent-gated)".

Helper duplication is deliberate and minimal: `repair.sh` re-declares `do_sha`, `marker_lines`, and share/root resolution (~25 lines) rather than refactoring the reviewed `check.sh` into a sourced library. Mirror-rot is guarded **behaviorally**, not byte-wise: the end-to-end fixture "apply, then re-run check.sh → `conforming`, exit 0" only passes if the two scripts' marker/hashing contracts agree.

## 2. Replacement content — what "replace with the installed version" means

- **`fkit-authored reference file`** (`ai-agents/README.md`, `conventions/*.md`, `tasks/README.md`): replacement = the share scaffold copy's bytes, verbatim. (A CRLF-only-variant file — untouched-stale by the normalization contract — becomes the installed LF bytes; it then classifies `conforming`.)
- **`root context file`** (`CLAUDE.md`, `AGENTS.md`), markers present and well-formed on disk: replacement = scaffold body **outside** its markers + the project file's marker lines and everything strictly between them, **preserved byte-for-byte** (report §8: markers and the current fkit-managed block survive the rewrite). Marker recognition is `marker_lines`' whole-line-trimmed contract, carried verbatim.
- An item whose **scaffold source is absent or (root files) marker-malformed cannot be synthesized**: excluded from the proposal with a stated per-path reason line, never applied. This structurally defuses residual **R7**'s write risk (see §4).
- Malformed on-disk markers → `refused: malformed-markers` in the check → never `untouched-stale` → never proposed (brief: report-only). Absent markers → whole-file hashing per 0245; see open question Q1. **Q1 RULED: include, whole-file replace — see header.**

## 3. The consent orchestration (SKILL.md prose — the producer in a live session)

1. **Live session required.** The repair steps run only with the owner present — a `fkit producer` session, or spawned under the sprint-loop relay pattern with decisions surfaced live. A headless/background invocation stops at the check report.
2. Run `check.sh`, present the report verbatim (unchanged 0245 procedure). If no `untouched-stale` rows: state "nothing repair-eligible" and stop — **no consent question is manufactured**.
3. Run `repair.sh propose`; present the **full enumerated per-file list and every diff, verbatim** — nothing applied yet; announce never substitutes for consent.
4. **One `AskUserQuestion`** — plan-level approval of that exact enumerated list with the diffs in view (ADR-039 Decision 2). Options: approve the full list / approve a named subset / not now. No destructive item can exist in v1; if one somehow appeared it would be a bug, not something to confirm individually.
5. On approval, pipe **exactly the approved item lines** — full list or the owner's named subset — to `repair.sh apply`. Present the per-path apply output verbatim, refusals loudest.
6. **Consent is never stored** — no file, no config, no env, nothing survives the run. The proposal's machine lines live only in the session transcript. Fail-closed keep-out (0245's stated exception): `ai-agents/` rows were never checked, so only root context files can be proposed; the skill says so rather than presenting partial coverage as full.
7. Wiki-routed lines: routing note unchanged — never touched by this skill, whatever the spec says.

## 4. 0245 accepted residuals — dispositions (each clause checked against this design)

| Residual | Clause fires? | Disposition in this task |
|---|---|---|
| **R1** NUL-byte misclassification | **YES — owner's clause verbatim: "MUST be resolved before 0246 gates a write on untouched-stale"** | **Fix in `check.sh` by NUL-detection refusal**: before hashing, a portable byte-count probe (`wc -c` vs `tr -d '\0' | wc -c`); a NUL-bearing file reports the existing `unreadable` outcome with a detail naming NUL bytes — refuse to classify, so it can never reach `untouched-stale` and the write gate never opens on the awk-truncation parity break. No new outcome vocabulary (the ratified-semantics residual keeps vocabulary changes an owner call). Byte-safe reclassification (abandoning awk) rejected as v1 cost: refusal is honest and sufficient while every shipped markdown is NUL-free. |
| **R3** keep-out probed through symlinked `ai-agents/` | YES — repair makes write decisions downstream of keep-out contents and the refusal ordering | **Fix**: hoist a `-L "$root/ai-agents"` preflight above the keep-out block; a symlinked `ai-agents/` skips keep-out reading entirely and the existing row loop refuses the subtree (`refused: symlink` + `refused_ancestor`), matching the header's "[-L] FIRST, ALWAYS". |
| **R5** spec paths not validated project-relative | YES — apply derives write paths from spec rows | **Fix**: in the existing class-validation loop (NOT inside `parse_tables` — keeping R4 dormant), reject absolute and `..`-containing paths with a loud exit-2; `repair.sh` re-validates independently at apply (defense in depth). |
| **R6** no output guard on the hash pipeline | YES — classification is now the write gate | **Fix**: require every hash result to match `^[0-9a-f]{64}$`, else `unreadable`; same guard in `repair.sh` for pre/post hashes (a broken tool refuses, never applies). |
| **R7** scaffold-absent fallthrough mislabels `untouched-stale` | YES — via the R1 clause ("re-opens identically") | **Structurally defused** in `repair.sh`: no synthesizable source ⇒ excluded from the proposal with a stated reason (§2). The misleading detail *text* in the check stays an accepted report-only residual. |
| **R8** end-before-begin diagnostic names counts, not order | YES — the check report (carrying that detail) is in view in the session where consent is taken | **Fix** (2 lines): append "(end before begin)" when counts are 1/1 but ordered wrong, matching the JS twin. |
| R4 one-empty-table | No — `parse_tables` is not edited by this plan | Dormant; untouched. |
| R11 stale frontmatter-test comment | Only if that file is edited | Not planned; if any change lands in `test/skill-frontmatter.test.js`, fix the comment in the same change. |

**Q2 RULED: all five fixes (R1/R3/R5/R6/R8) in scope — see header.**

## 5. Sequencing

1. **Residual-fix pass on `check.sh`** (R1, R3, R5, R6, R8) + a fixture per fix, red-first where feasible (hand-rolled transient-mutation probes per ADR-026, recorded in `worklog.md`); update any of the existing 24 `structure-check` tests these behavior changes touch, deliberately and named in the worklog.
2. **`repair.sh propose`** — parsing, eligibility, synthesis (reference files first, then root files), pre/posthash, diffs.
3. **`repair.sh apply`** — the guard chain (§1), write, verify, per-path announce, exit codes.
4. **`SKILL.md`** rewrite (frontmatter + repair procedure §3) and `check.sh`/`SKILL.md` header updates.
5. **Test file `test/structure-repair.test.js`** (NEW), full suite, and the empty-diff assertions.

## 6. Test plan — mapped to the brief's verification steps

Fixture projects in tmp, driven the way `test/structure-check.test.js` drives `check.sh`:

1. **Dry-run/apply parity:** propose on a drifted-untouched fixture → apply the full list → applied set == proposal exactly; every applied path re-checks `conforming` (post-apply `check.sh` exit 0); a whole-tree hash snapshot proves **no path outside the approved list changed** and no new file appeared anywhere.
2. **Freshness refusal:** edit one approved file between propose and apply → that item `refused: changed-since-propose` and reported, others applied, exit 1.
3. **v1 boundary:** owner-edited fixture file never appears in a proposal and is byte-unchanged after apply; a forged owner-edited item line fed to apply is refused (re-verification catches it); **grep fixture**: neither script contains a word-boundary `rm`/`mv`/`unlink`/`rmdir`.
4. **ADR-005 assertion:** a nonconforming `wiki-vault/` yields zero vault paths in the proposal; a forged `ai-agents/wiki-vault/...` item line is refused; the vault subtree hash is unchanged.
5. **Consent shape:** prose-verified in SKILL.md (AskUserQuestion, enumerated list + diffs, never announce-only); mechanically: no consent artifact — the whole-tree snapshot in (1) plus a grep that `repair.sh` writes no file outside the approved item paths.
6. **`CLAUDE.md` fixtures:** untouched-stale body + current block → applied file = scaffold body with the project's marker region **byte-for-byte identical** pre/post, and re-checks `conforming`; block-only drift → not proposed; malformed markers → not proposed, forged item refused.
7. **Per-path announce:** apply output carries exactly one line per submitted item, refusals included.
8. **Residual-fix fixtures:** R1 (NUL after a kept line → `unreadable`, never proposed), R3 (symlinked `ai-agents/` + unreadable foreign keep-out → `refused: symlink` rows, keep-out never consulted), R5 (`../escape` spec row → exit 2), R6 (PATH-shimmed broken sha tool → `unreadable`, apply refuses), R8 (detail names the order).
9. `node --test test/*.test.js` fully green (644 + new); **`git diff` empty for `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `install.sh`, `claude/scaffold/`, `claude/structure-manifest.tsv`** — no launch-path change, no scaffold edit (R10 stays routed out), no manifest regen needed (skills are not manifest content).

## 7. Edge cases held by the design

Unwritable target at apply (per-path `error`, others continue, exit 1); target deleted between propose and apply (prehash read fails → refused); symlink swapped in post-propose (`-L` at apply refuses); mid-session `fkit update` (posthash re-synthesis check refuses); empty proposal (no consent question); partial approval (the approved subset **is** the enumerated list applied); missing `AGENTS.md` (never `untouched-stale`, never proposed — creation stays convergence's job); kept-out paths (never classified → never proposed); paths quoted throughout.

## 8. Out of scope / invariants held

No move/rename/delete anywhere; no repair of owner-edited, wrong-type, or `.gitkeep` anything; no vault write ever; no launch-path mutation; no stored consent, no global allow, no progress state; no commit, no re-rank, no task-file move. ADR-015's invariant untouched for the unattended path. ADR-039's re-raise fences respected — nothing here widens v1.

## 9. Open questions — RULED by the owner 2026-08-07 (see header)

1. **Markerless untouched-stale root file** (omnigent-era whole-file manifest match — markers deleted by no one, they never existed in that shipped shape): include in the proposal as a **whole-file replace** with the current scaffold copy (block self-heals next launch), or exclude as report-only? **Rec: include.** **RULED: "Include, whole-file (Recommended)".**
2. **The residual-fix diff on `check.sh` (R1/R3/R5/R6/R8) is edits to a just-shipped, just-reviewed 0245 file.** The re-raise clauses direct exactly this, but it widens this task's diff beyond "new repair path" — confirm that in-scope. **Rec: yes.** **RULED: "In scope (Recommended)".**
