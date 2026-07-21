# Review — converge-ai-agents-additively-on-launch

Task: `ai-agents/tasks/backlog/converge-ai-agents-additively-on-launch.md`
File(s) under review: `claude/fkit-claude-init.sh`, `test/converge-contract.test.js`, `test/harness.mjs`,
`claude/scaffold/ai-agents/README.md`, `ai-agents/README.md` (uncommitted working tree)
Status: in-review — R1/R3/R4/R5 fixed and re-verified (28/28 green, full suite 313/313).
**R2 is the only open row: it needs an owner decision (fix / accept as residual / split into a new task).**

Round 1 reviewers: fkit-reviewer (own pass) + Codex `codex-cli 0.144.4` (adversarial, model-diverse).
Both ran. Coverage is **full** — no reviewer degraded.

Governing decision: [`ADR-015`](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md).

## What was verified GREEN (recorded so coverage is distinguishable from silence)

Each of these was executed, not reasoned about, against throwaway trees:

- **THE INVARIANT HOLDS.** No input found under which convergence writes to an existing path.
  Hash-manifest before/after on a populated tree: zero pre-existing files modified, moved or deleted.
- **`git status` stays clean.** Real `git init` repo, `.gitkeep` deleted from a populated
  `tasks/backlog/`, three consecutive runs → `git status --porcelain` **completely empty**. This is the
  brief's hardest verification step and it passes.
- **The `>/dev/null` reasoning holds.** `claude/fkit-claude.sh:296` redirects **stdout only**
  (`>/dev/null || setup_rc=$?`); stderr survives. Stderr was the correct choice, and Group D3 drives
  the *real* launcher rather than asserting that the code echoes. Both reviewers independently confirm.
- **Statelessness intact.** No cursor, no version, no progress manifest. `.fkit-keep-out` records
  intent, not progress.
- **The opt-out survives a clone.** `git check-ignore ai-agents/.fkit-keep-out` → rc=1 (not ignored).
- **The `.gitkeep` rule is correct** for all 13 scaffold `.gitkeep` files, including the top-level case,
  opted-out parents, and failed-parent subtrees. The count is derived from the scaffold, not hardcoded.
- **Non-fatal holds.** Read-only `ai-agents/`, chmod-000 subdir, dangling symlink → init `rc=0`, rest of
  setup completes. No `set -e` escape found; the suspected `while`-loop-exit-status brick was probed
  directly and **disproven** (bash returns 0).
- **The new symlink seam is closed.** Symlinked subdir and dangling symlink at a file path both refuse;
  nothing written outside the project.
- **Fresh-project path unchanged**; sort order guarantees parents precede children.
- **23/23 tests pass** (`node --test test/converge-contract.test.js`), hermetic (all under `os.tmpdir()`).
- **No re-litigation.** Neither reviewer proposed a migration mechanism, a cursor, or content-drift
  overwriting. The settled residuals were respected.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/fkit-claude-init.sh:76-87` | An unusable `.fkit-keep-out` (unreadable / symlink / directory) makes the opt-out **fail OPEN and silently** — `keep_out=""`, no diagnostic, and the deliberately-deleted tree is recreated. **Verified empirically:** `chmod 000` on a keep-out listing `wiki-vault` → `wiki-vault/` resurrected, zero warning. Every other unreadable/symlink case in this file refuses **loudly** (`:126`, `:234-248`, `:315-322`); this one is the lone silent fail-open, and it is on a REQUIRED safety-bar row (ADR-015 §3 "Opt-out"). Raised by both reviewers. |
| R2 | 1 | medium | `claude/fkit-claude-init.sh:126-160`, `:528`; `claude/fkit-claude.sh:386-390` | **Per-path refusal exits 0**, so it never reaches the launcher's `aa_refused` status. A symlink/file at e.g. `ai-agents/knowledge-base` → convergence warns and refuses the subtree, `PROJECT.md` stays absent, init exits 0 → launcher reads `aa_refused=0`, `[ ! -f "$pm" ]` → **`fresh=1` → force-starts the producer cold start into a tree init just refused**, on every launch, with no way to the menu. That is verbatim the failure `claude/fkit-claude.sh:368-373` says exit 3 exists to prevent. **NOT a regression** — the pre-change script also exits 0 here (verified by stashing the diff); convergence *narrows* the case by creating `PROJECT.md` in the common path. But it introduces per-path refusal as a new concept without wiring it to task 27's one refusal status. Raised by Codex; regression status established by this pass. |
| R3 | 1 | low | `claude/fkit-claude-init.sh:115` | `for k in $keep_out` is unquoted, so entries undergo **pathname expansion against the launcher's CWD**. `IFS` was pinned (`:62`) but globbing was not disabled — the mitigation is incomplete against the threat model the code's own comment states (*"keep_out is USER input, so that is reachable, not theoretical"*). **Proven:** `.fkit-keep-out` containing `wiki-*`, launched from a CWD holding a `wiki-vault/` dir, expands to `wiki-vault` and the opt-out fires; launched from anywhere else it does not. Same file, same repo, **different convergence depending on where you ran `fkit` from**. Fails safe (never breaks the invariant, never bricks) but is non-deterministic on the user-input path. Codex observed expansion occurs but dismissed it on the scaffold having no globs — it is the *user's* entries that are expanded. |
| R4 | 1 | low | `claude/fkit-claude-init.sh:133`, `:149-158` | An **unreadable subdirectory** inside `ai-agents/` makes `[ -e "$dst" ]` false for every child (stat fails), so convergence reports `⚠ could not create ai-agents/knowledge-base/PROJECT.md` and ~10 more — **on every launch, forever** — for paths that in fact exist. The preflight (`:234-240`) covers only `ai-agents/` itself. Non-fatal and invariant-safe, but it misreports existing paths as uncreatable and is exactly the per-launch noise this file elsewhere argues is how a real refusal stops being read (`:202-203`). |
| R5 | 1 | low | `test/harness.mjs:177-189`; `test/converge-contract.test.js:50-77` | `manifest()` records **only regular files** (`e.isFile()`), so the Group A invariant assertion is blind to symlinks, empty directories, and metadata — a pre-existing symlink or empty dir being replaced would pass. Untested contract clauses: exit-3 routing (R2), unusable keep-out (R1), glob expansion (R3), unreadable subdir (R4). Group A remains sound for the file-content invariant it does assert. Raised by both. |

## Disproven / not recorded as rows

- **Codex, "critical — TOCTOU breaks the invariant" (`:133,183`).** **Downgraded to low; sub-claims
  disproven.** The *hardlink amplification* claim is **false and was tested**: a hardlink at a scaffold
  path makes `[ -e ]` true → skip → the linked file is untouched (`PRECIOUS USER DATA` survived intact).
  The core check-then-write race is technically real but requires a concurrent writer inside the user's
  own `ai-agents/` in the microsecond window, is inherent to file creation in POSIX shell, and existed
  identically in the pre-change `cp -R`. Not a blast radius worth a row; `set -C` would be the cheap
  mitigation if the owner ever wants it.
- **Codex, "medium — a large `.fkit-keep-out` can indefinitely block launch."** **Not recorded.** The
  file is the user's own, hand-written, and typically 1–5 lines; a 100k-line self-inflicted opt-out is
  not a threat model. The O(n·m) scan and per-line `printf | tr` are irrelevant at real sizes.
- **`set -e` brick via the keep-out parser's trailing `[ -n "$line" ] && …`.** Suspected by this pass,
  **probed directly, disproven** — bash does not propagate a `while` body's last status to `set -e`.

## Re-litigates settled decisions (suppressed)

None. Neither reviewer re-raised content drift, rename-yields-both, rollback/dry-run/refuse-on-dirty,
the migration mechanism, or the opt-out's location. ADR-015's "Re-raise only if" fence was not tripped:
**nothing in this diff proposes moving, renaming, or deleting content inside a consuming project's
`ai-agents/`.**

## Convergence call

**Act, don't close out.** Round 1 of a fresh ledger; all five rows are novel, none re-litigate a settled
residual. The load-bearing contract — the invariant, statelessness, the `.gitkeep` rule, the stderr
announcement, clone-survivable opt-out, non-fatality — is **implemented and empirically proven**. The
five findings all sit in degraded/edge paths and **none blocks**. R1 and R2 are the two worth the
owner's attention: both are silent fail-open on a REQUIRED safety-bar row.

## Coder response

*(coder-owned — reviewer does not write this section)*

Every row below was **verified by reproducing the defect first**, not accepted on the reviewer's word.
R1, R3 and R4 were reproduced against the round-1 code before any fix was written; each fix then had its
**red gate proven** by reverting it and confirming the new test fails.

⚠️ **Approval note — read this.** These fixes were applied under the owner's standing instruction for
this task ("do as much as possible without me being involved"), **not** under a per-finding approval.
R1/R3/R4/R5 were all defects in code written this same round, so fixing them is finishing the task
rather than a scope decision. **R2 was deliberately NOT actioned** — it is pre-existing and would change
task 27's contract, which is not mine to settle. It is the one row awaiting the owner.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | **Fail CLOSED.** An existing-but-unusable `.fkit-keep-out` (unreadable / symlink / dir) now refuses convergence entirely with a diagnostic naming the file, instead of silently degrading to "no opt-outs". Reproduced first: `chmod 000` → `wiki-vault/` resurrected AND announced as "added", i.e. the announcement named the very path the user had opted out of. Fixed at `fkit-claude-init.sh:94-113`. Tests: Group E6 (unreadable), E7 (directory). | ✅ done |
| R2 | CORRECT | Defect (pre-existing, out of scope) | **None — referred to the owner.** Claim verified: per-path refusal exits 0, so `aa_refused` stays 0 and the launcher can force the producer cold start into a subtree init just refused. The reviewer's own "NOT a regression" finding is confirmed — the pre-change script exits 0 on the same input, and convergence *narrows* the case. Acting would redefine task 27's single refusal status (exit 3 currently means "I did not touch `ai-agents/` **at all**"; a partial refusal is a genuinely different state). That is a contract change, not a defect fix, so it is not mine to settle. **Recommend: split into a new task against task 27's contract.** | pending approval |
| R3 | CORRECT | Defect | **`set -f` for the whole function.** Reproduced first, and it is worse than "non-deterministic": the *same repo* with the *same* `.fkit-keep-out` converged differently depending on the CWD `fkit` was launched from (kept out from a dir holding a `wiki-vault` file; recreated from `/tmp`). The reviewer is right that pinning `IFS` addressed splitting but not globbing — and my own comment claimed that input path was hardened, so the comment was lying. Entries are path patterns, matched literally. Fixed at `fkit-claude-init.sh:72-81` + `converge_restore`. Tests: Group E8, E9. | ✅ done |
| R4 | PARTIALLY CORRECT | Defect | **Refuse an unreadable dir once, at its root.** The defect is real and reproduced — but the count is wrong: an unreadable `wiki-vault/` yields **4** bogus warnings, not ~10 (only regular files reach `cp`; child *dirs* are caught by the `mkdir` branch). The mechanism, severity and fix are exactly as described; only the number is off, which changes nothing. Fixed at `fkit-claude-init.sh:~150`. Test: Group F4 asserts **zero** "could not create" for paths that exist. | ✅ done |
| R5 | CORRECT | Defect | **Both halves fixed, and the finding proved its own worth.** (a) `manifest()` now records directories and symlinks with their type (`readlinkSync`, no follow), so the Group A invariant check is no longer blind to a swapped symlink or a deleted empty dir. (b) Coverage added for R1/R3/R4. **The reviewer under-sold this one:** my first R3 tests passed against the *unfixed* code — the `wiki-*` glob matched nothing in the test CWD, so the bug hid. They now plant a `wiki-vault` bait file in the CWD and were confirmed red against the reverted fix. R2's exit-3 routing remains untested because R2 is unactioned. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)

- **Content drift is not fixed** — What: a scaffold-authored file whose contents changed is a path that
  already exists, so convergence steps over it forever · Why (structural): the safety and the limitation
  are the same property; overwriting was rejected as it would destroy owner edits and would convert
  every "not required" safety row into "required" (ADR-015 Decision §1, §5, Consequences) · Re-raise
  only if: a THIRD fkit-authored file inside `ai-agents/` starts drifting, or the code is shown to
  actually overwrite content (that would be a broken invariant, not a residual).
- **A renamed folder yields both** — What: renaming `sprints/` → `iterations/` gets `sprints/` recreated
  alongside · Why (structural): no stateless mechanism can distinguish a rename from a deletion; a
  cursor cannot survive `git clone` because `.fkit/` is gitignored · Re-raise only if: it is not
  documented (it is — `claude/scaffold/ai-agents/README.md`, and the announcement itself says so).
- **No rollback, no dry-run, no refuse-on-dirty-tree** — What: none are implemented · Why (structural):
  all three are unnecessary *only* under the invariant — nothing is mutated, only added, so there is no
  torn state · Re-raise only if: the invariant is proven broken.
- **No migration mechanism / cursor / semver walk** — What: convergence compares scaffold to disk, full
  stop · Why (structural): rejected on the merits (ADR-015 Decision §4); the cursor cannot survive a
  clone and the distribution is sha-keyed, not semver-keyed · Re-raise only if: ADR-015's fence fires.
- **The opt-out's location** (`ai-agents/.fkit-keep-out`, tracked) — What: owner-ratified 2026-07-15 ·
  Why (structural): must survive `git clone`, so it cannot live under gitignored `.fkit/`; accepted
  tradeoff is an fkit-managed dotfile in the user's tracked history · Re-raise only if: never — its
  *implementation* is fair game (R1, R3), its *siting* is closed.
