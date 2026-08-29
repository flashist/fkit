# Gate the symlink escape when init writes the `.fkit/interview` intake

**Source**: `ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P10` · ID 0046 · owner `fkit-coder` · built 2026-08-23, reviewed 2026-08-24

## Goal

`claude/fkit-claude-init.sh` §4 wrote the first-run intake with `mkdir -p "$dest/.fkit"` then `cat > "$dest/.fkit/interview"` and **no `[ -L ]` check on any component**. With `.fkit → /tmp/outside`, init created `/tmp/outside/interview`.

⭐ **The point of the task was never the one-line patch.** The `-L`-before-deref doctrine is written down **inside this very file**, in §1's own comment — *"`[ -L ]` FIRST, ALWAYS. -e/-d DEREFERENCE… -L is the one test that does not lie."* It had been applied to §1 (convergence) and, by `0072`, to §6 (orphan cleanup). **§4 never got it.** ⚠️ *A rule stated in a file's own comments and then missed twice is not three bugs — it is one doctrine with no enforcement point.*

⛔ **Fenced at §4 only, deliberately.** The brief authorized an audit of the rest of the file that **reports and does not fix** — *"a floodlight, not a licence"* — because at least one further site (§5's `.gitignore` append) may be a case where a symlink is **legitimate user setup**, making it a product decision rather than a refactor.

## Key Changes

Three files. `claude/fkit-claude-init.sh` +68 / −44 · `test/init-intake-guard.test.js` **new**, 180 lines, 7 tests · `test/orphan-cleanup.test.js` +6 / −9.

- **Helper hoisted and renamed.** `orphan_contained()` moved from `:655` up to `:289`, above its first caller, and renamed **`path_contained()`** with a second parameter for the verb — *the old name claimed the check belonged to the orphan cleanup, and it now guards a **write** as well.* ⭐ **The body is a pure relocation: the only change inside it is `delete` → `$2`** — re-derived by the reviewer with an `awk`-extracted body diff showing exactly two changed lines.
- **§6's emitted string is byte-identical** — verified live: `'.fkit' is a symlink — fkit will not delete through one`, character-for-character. That is what the verb parameter bought.
- **§4 guarded** by one `path_contained ".fkit/interview" write` call covering both `mkdir -p` and `cat >`. Refusal is **non-fatal**, to stderr — a refused intake warns and init carries on, consistent with §1 and `0088`'s bar.
- ⚠️ **Heredoc integrity proved three ways** — zero `+`/`-` diff lines inside the body, the installed intake still **2780 bytes** with the same `sha256`, and a control test on `startsWith('#!/bin/sh\n')`.

### Measured PRE vs POST

| Fixture | PRE (`HEAD`) | POST |
|---|---|---|
| `.fkit` → outside dir | `rc=0`, **intake created outside**, while §6 refused *in the same run* | refused, outside untouched |
| `.fkit` a **dangling** symlink | `rc=1`, init **aborted** at `mkdir -p`, `.gitignore` never written | `rc=0`, `.gitignore` written, summary printed |
| **symlinked leaf** `.fkit/interview` | victim **overwritten → 2780 B, user data gone** | victim intact |
| `.fkit` symlinked **inside** the project | created | refused — a deliberate behaviour change, disclosed in the plan |
| ordinary project (control) | 2780 B, mode 755 | **identical**, same sha256 |

`npm test` → **737/737, 0 fail**; `test/prove-red.sh` → 22/22 mutations red, `✓ hard gate PASSED`.

## Outcome

**Review round 1: 0 confirmed defects in the change surface**, 2 low findings, neither blocking. ⚠️ **Coverage state: reasoning-only second opinion** ([[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] D1) — Codex ran read-only checks and **did not reproduce the finding it raised as HIGH**; ⛔ *every* execution measurement in the ledger is the Claude reviewer's. **This is the normal expected state, not a degradation event.**

### ⚠️ The audit found FOUR further live hazards — none fixed here, all filed

| # | Finding | Filed as |
|---|---|---|
| **F1** | ⛔ §3's `.claude/` refresh **DELETES** through a symlinked `.claude` — re-measured, the user's own file **deleted**. **Worse than the defect this task fixed.** | `0327` |
| **F2** | §5 appends to a symlinked `.gitignore` — all 3 fkit blocks landed in the outside file. A product decision. | `0329` |
| **F3** | `mkdir -p` fatal under `set -euo pipefail` for reasons `-L` does not cover (perms, ENOSPC, wrong type). | `0328` |
| **F4** | Launcher writes lockdown state through a symlinked `.fkit`. ⚠️ **Code-read, NOT executed — a lead, not a measured fact.** | `0330` |

### Two accepted residuals, both real defects DEFERRED

1. ⛔ **A hard-linked `.fkit/interview` leaf is still written through** — `cat >` truncates the shared inode, replacing a file outside the project. **Measured identical at HEAD and in the working tree** (victim 22 → 2780 B, `rc=0`, both), so **pre-existing, not a regression**. ⭐ **`[ -L ]` structurally cannot see a hard link, so the fix's own doctrine cannot close it** — closing it needs a different write *shape* (`st_nlink > 1` refusal, or temp-file + `rename()`). Codex priced it `HIGH` and did not reproduce it; the reviewer reproduced it and re-priced to `low`. Owner: *"Accept residual + file its own task (Recommended)"*. ⚠️ **This records a defect deferred, not a cost accepted.**
2. **The intake heredoc's regression net pins shape, not content** — the two mechanical mistakes the plan named (reindentation, terminator off column 0) **are** caught; arbitrary body drift is not. Demonstrated with a real behaviour-changing mutation: deleting the intake's own `[ -f "$out" ] && exit 0` never-overwrite guard left **all five pinned predicates green**. ⛔ **The worklog's headline *"still 2780 bytes"* is a hand measurement with no CI counterpart** — `grep -rn '2780' test/` returns nothing. Owner: *"Leave as-is (Recommended)"*.

### ⚠️ Stated, not glossed

- **No `prove-red.sh` mutation covers this guard, and none can yet** — `test/harness.mjs:160` hardcodes `INIT` with no `FKIT_INIT` seam. That seam is open task `0037`'s deliverable; building it here would be doing `0037`'s work inside this diff. The by-hand reproducers are the substitute.
- **Only macOS/BSD was exercised.** The dangling-`.fkit` abort is a BSD `mkdir -p` behaviour; the *fix* is platform-independent (the `-L` runs first either way), but the recorded pre-fix symptom may look different on Linux CI.
- ⭐ **The brief's own claims were re-measured and eight of them found stale or wrong** — including *"Risk: low. Non-destructive (creates, never deletes)"*, which is **partly false**: §4 could overwrite a file outside the project through a symlinked leaf. Recorded in the worklog; ⛔ **the brief was left alone** (planner's recommendation taken by the driver — *not* an owner ruling).
- ⚠️ **Every line-number claim in the brief and the plan is now stale by construction**, because the hoist moved 35 lines. The corrections are recorded as *"was X, now Y"* rather than as a fresh set of coordinates to go stale in turn.

## Related
- [[tasks/refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim]] — `0327`, audit finding **F1**, the destructive sibling of this defect
- [[tasks/remove-fkit-omnigent-orphan-residue]] — `0072`, which supplied `orphan_contained()` and correctly kept this out of its own scope (*"cheapness isn't scope"*)
- [[systems/launch-convergence-and-init]] — the init script this hardens
- [[systems/testing-and-verification]] — the prove-red gate and its `0037` seam gap
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the coverage state this review declared
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — *added 2026-08-29:* the board where its four report-only audit findings were filed as `0327`–`0330`, plus the hard-link residual
