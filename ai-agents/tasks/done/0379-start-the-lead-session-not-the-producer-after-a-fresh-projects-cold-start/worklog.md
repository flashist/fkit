# Worklog — 0379: start the lead session, not the producer, after a fresh project's cold start

## 2026-09-07 — Build step (spawned `fkit-coder` Build worker, driver `fkit-sprint-ship-loop`)

**Role:** `fkit-coder`, Build worker, spawned by `fkit-sprint-ship-loop`.

Ran under the declared-approval marker: the owner approved `plan.md` in a live `fkit lead` session,
option label verbatim **"B′ — producer runs, then launcher opens lead (Rec)"**, with rulings
**Y0–Y4** in the plan's § *⭐ OWNER RULINGS* appendix. Implemented the plan's
§ *Implementation steps (post-ruling)*, **B′ branch only** — steps 1, 3, 4, 5, 6, 7. **Step 2 is
"under A only" and was skipped entirely.** Stopped after the verification section; no review
requested (the driver spawns that separately).

### Carry verification

Verified the plan file myself rather than trusting the paste. `git hash-object` →
`b4594e1b34a2ff3ec205b2e4885278132587a594`, `wc -c` → `17877` bytes, both matching the pointer in the
spawn prompt. HEAD confirmed as `cf289c26394526ff2601800aa8f40d1873f370ba` at start and unchanged at
the end of the build. The file and the paste agree, so no "file wins" correction was needed.

### Baseline — and the one file that was NOT clean when I started

⚠️ **`test/prove-red.sh` already carried uncommitted work before I touched it.** `git show
HEAD:test/prove-red.sh` contains neither `run_throughput_suite` nor `Mutation 29` — task `0359`'s
prove-red additions (its `run_throughput_suite` runner, its baseline step `0n`, and mutation 29) are
sitting uncommitted in the tree. Of the 99 insertions `git diff HEAD` reports for that file, roughly
25 are `0359`'s and roughly 74 are mine (the mutation-30 block plus its one-line header index entry).
**My hunks in that file are the header index line and the tail block only** — the hunks at the
`run_dashboard_suite` helper and at baseline step `0m`/`0n` are not mine and were not edited.

The other three files were clean at HEAD: `git diff HEAD` and `git diff` agree on them exactly, and
every hunk falls inside a region I edited.

### What changed — four files

1. **`claude/fkit-claude.sh`** — the fresh-project branch only. The cold start's `exec claude --agent
   fkit-producer …` became a **run** (`|| cold_rc=$?`-guarded against `set -eu`), followed by a
   re-evaluation of the same freshness question; on `exit 0` **AND** a tree that is no longer fresh it
   sets `role="lead"` and **falls through to the launcher's existing tail**, which already prints the
   lead line, builds the lead's settings, retitles the tab and execs it. Otherwise it `exit "$cold_rc"`s
   — exactly as before. The section comment and the "starting the producer" `printf` were extended (a
   second line: "When the initiation is done, this tab opens the lead."). **Both seed strings are
   byte-unchanged**, and **no new `exec` was written**.
2. **`test/harness.mjs`** — the `claude` stub records **one argv file per invocation**
   (`$FKIT_STUB_ARGV_FILE.1`, `.2`, …) instead of truncating a single file, and `readArgv` returns a
   new `argvs` array alongside the existing `argv` (now the **last** invocation's). Two new stub
   knobs: `FKIT_STUB_INITIATE` (absolute path — write a non-fresh `PROJECT.md` there, i.e. simulate an
   initiation that landed) and `FKIT_STUB_EXIT` (exit code, e.g. `130`).
3. **`test/launcher-contract.test.js`** — assertion 12 amended to pin both phases, keeping all four
   things it checked about the cold start (which agent, which settings file, that a seed is appended,
   what the seed says); assertions **12b**, **12c**, **12d** added.
4. **`test/prove-red.sh`** — mutation **30** plus its one-line header index entry.

⛔ Untouched, per the plan's step 7 and rulings Y2/Y4: `.fkit/interview` and the intake, the refusal
path, `setup_ok`, the `aa_refused` logic, the menu, `skills_for_role()`, `claude/agents/fkit-lead.md`
(its routing parenthetical stays TRUE under B′), `test/harness.mjs`'s fresh-tree comment (step 2, A
only), and the historical onboarding-verification report. ⛔ Nothing written under
`ai-agents/wiki-vault/` — the vault paths `git status` reports were already dirty at baseline and I
did not touch them. ⛔ No task folder moved, no `## Status` edited, no board row flipped, no rank
changed (ruling Y3). ⛔ No commit, no push. ⛔ The gitignored `.claude/` mirror was not edited
(`git status --porcelain -- .claude/` is empty), and **no `claude/` change in this session is live** —
`fkit-claude-init.sh` has not been re-run.

### Verification, measured this turn

| Check | Result |
|---|---|
| `node --test test/launcher-contract.test.js` | **43/43 pass**, 0 fail (was 40/40 before the 3 new assertions) |
| `npm run test:unit` (`node --test test/*.test.js`) | **872/872 pass**, 0 fail, 24 suites — the 869 baseline plus exactly my 3 new assertions |
| `node --test` on structure-manifest + structure-spec + dual-home-parity | **21/21 pass**, 0 fail |
| `node --test test/coordination-citation-policy.test.js` | **21/21 pass** — with this worklog in the scanned set |
| `node --test test/reference-integrity.test.js` | **20/20 pass** |
| Explicit role on a fresh tree (`fkit coder`) | **1** claude invocation, `--agent fkit-coder` — the `-z "$role"` gate survives |
| `git status --porcelain -- .claude/` | empty |
| `claude/agents/fkit-lead.md` byte-unchanged | confirmed, no diff |
| `bash test/prove-red.sh` | **30 mutations, hard gate PASSED**, exit 0 — all 14 baseline steps green, all 30 mutations red at their named assertion |
| `sh -n` on the launcher and on `test/prove-red.sh` | both clean |
| HEAD at start and at end | `cf289c26394526ff2601800aa8f40d1873f370ba`, unmoved |

**The manifest claim is proved, not asserted.** `claude/fkit-claude.sh` does not appear in
`claude/structure-manifest.tsv` (72 rows, all project-relative), and editing it regenerated nothing —
the manifest and spec suites are green.

**Nothing was written under `ai-agents/wiki-vault/`, proved rather than asserted.** `git status`
reports 21 modified vault paths, all of them baseline dirt: the newest mtime among them is
**2026-09-06 09:41:47**, a full day before my earliest edit in this session (**2026-09-07 14:27:12**).

### Mutation 30 — the RED, reproduced and measured directly

Reproduced independently of the gate (a copied `claude/` tree, the mutation's own `sed`, then the
launcher-contract suite against the mutant via `FKIT_LAUNCHER`):

- the `sed` changes **exactly one line** — verified by `diff | grep -c '^>'` = 1 — and cannot reach the
  launcher's own tail `exec`, which is a different line;
- the mutant suite goes **42 pass / 1 fail**;
- the single failure is assertion **12**, at **its own** assertion:
  `AssertionError: expected the producer cold start THEN the lead, got 1 claude invocation(s) — 1 !== 2`;
- **12b, 12c and 12d stay GREEN**, which is what makes this a proof about the lead hand-off
  specifically rather than about the cold start in general;
- both of the gate's `grep` expressions were checked in both directions — the "red at assertion 12"
  pattern matches the mutant output and does **not** match the clean output, and the "12b/c/d also
  red" guard matches neither.

### Decision log — calls made unattended under the standing approval

Recorded per the ship-loop audit obligation. Each entry names what changed and why it qualified.

| # | Change | Why it qualified |
|---|---|---|
| D1 | Factored the freshness test into a `pm_is_fresh()` function called at both sites, instead of hand-copying the three-way `grep` into the post-cold-start re-check. | **Obvious winner within the approved plan's intent.** The plan's B′ text says "re-evaluate **the same** freshness predicate"; a shared function is the only construction that makes "the same" true by force rather than by discipline. Two hand-copied copies drift silently, and both drift directions are bad (a stricter second copy never opens the lead; a looser one opens it on a half-written `PROJECT.md`). Localized to the branch the plan authorizes editing. |
| D2 | Added `FKIT_STUB_EXIT` to the stub, on top of the argv change and `FKIT_STUB_INITIATE` the plan named. | **Obvious winner within intent.** Ruling Y1 makes the gate an **AND** of two facts (exit 0 **and** no longer fresh). Without an exit-code knob only the freshness half is testable, so deleting `[ "$cold_rc" = 0 ]` would stay green — the gate the owner specifically chose B′ for would be half-unpinned. Two lines in the stub; it enables assertion 12d. |
| D3 | Extended the "starting the producer" `printf` with a second line naming the lead hand-off. | **Verified `CORRECT`, mechanical, in-plan.** The plan's propagation table lists that `printf` as "extend" under B/B′. No test asserts the string (checked). |
| D4 | Made `r.argv` the **last** invocation rather than the first, and added `argvs`. | **Mechanical and localized.** Every pre-existing assertion has exactly one invocation, so `argv` is unchanged for all 40 of them; the two-phase run is the only case where the distinction exists, and those assertions use `argvs`. |
| D5 | Assertion 12d also pins that the launcher exits with the cold start's own exit code. | **Within intent.** `exec` gave that for free; a plain run does not, so dropping the `exit "$cold_rc"` would otherwise be invisible. |

**No fix was applied outside the approved plan, and no frontier-move was made.**

### Residuals — named, not fixed

- **The bail path is silent.** When the cold start ends without initiating (Ctrl-C, "skip setup"), the
  owner is returned to the shell with no message. That is byte-for-byte today's behaviour, and ruling
  Y1 says "exit exactly as today", so nothing was added. Worth a later view: the owner has just sat
  through an intake and a producer session, and silence may read as a crash.
- **The producer session's conversation is lost at the transition.** Named and accepted in ruling Y1;
  its *output* is on disk. Nothing in this change mitigates it.
- **`test/harness.mjs`'s `makeProject` comment** still says a fresh tree "hijacks every role into the
  producer cold-start". Under B′ that is now incomplete rather than false (a fresh tree runs the
  producer *and then* may open the lead). Correcting it was the plan's step 2, which is **A only** and
  was skipped as instructed. Cheap follow-up.
- **`test/prove-red.sh` carries `0359`'s uncommitted work** alongside mine, so a reviewer diffing that
  file against HEAD sees both changes. Not mine to resolve.

---

## 2026-09-07 — Process-review, round 1 (spawned `fkit-coder` Process-review worker, driver `fkit-sprint-ship-loop`)

Applied `fkit-process-stateful-review` to round 1 of this task's ledger. Four findings (R1–R4), all
four dispositioned. ⭐ Every severity below was **derived here from the traced blast radius**, never
inherited from the reviewer's label; every claim was reproduced firsthand before any code moved.

### Baseline, re-measured this turn (not inherited from the build step)

- **HEAD `cf289c2`**, unmoved from the build step's baseline. The working tree is very large and
  almost none of it is mine — ~40 moved task folders, new briefs, ADR edits, 21 modified
  `wiki-vault/` paths, other modified test files. **My change surface is the four files listed below
  and this folder's `review.md` / `worklog.md`; nothing else was touched.**
- `test/launcher-contract.test.js` **43/43 pass, 0 fail** before I changed anything.

### What the round changed — three files

| File | Finding | Change |
|---|---|---|
| `test/launcher-contract.test.js` | R1 | Assertion 12b now pins the **lead phase**: invocation count (2) plus the lead's full argv. Purely additive — the seed assertions it already carried are untouched. |
| `test/launcher-contract.test.js` | R2 | Assertion 12c now pins the clean bail's **exit code 0**, which ruling Y1 makes contractual. One line. |
| `test/prove-red.sh` | R1 | **New mutation 31** — restore `exec` on the **intake-present branch only** — plus its header index line. Also a consequential edit to **mutation 30's narrowness check** (below). |
| `claude/fkit-claude.sh` | R4 | One `printf` on the bail arm. ⛔ `exit "$cold_rc"` untouched; no session opened. |

⛔ **The launcher change is NOT live in this session** — `.claude/` is a gitignored mirror and needs
`claude/fkit-claude-init.sh` re-run. ⛔ Nothing under `ai-agents/wiki-vault/` or `.claude/` was written.

### R1 — the escaping mutant, rebuilt and proven shut

The reviewer did not merely reason about this mutant; it built one. So did I, independently, rather
than accept the measurement:

1. **Reproduced the hole.** Copied the whole `claude/` tree (the launcher sources siblings, so a bare
   file copy fails at `skills-for-role.sh`), restored `exec` on the intake-present path only, pointed
   the suite at it via `FKIT_LAUNCHER`: **43/43 green, 0 fail.** The lead hand-off could be deleted
   for every owner who completes the terminal intake and the suite noticed nothing.
2. **Applied the fix**, then **re-ran the same mutant**: **42/43, exactly one failure — 12b.**
   12 / 12c / 12d stayed green, confirming the new assertion isolates the intake path rather than
   redding on something incidental.
3. **Promoted it to a permanent gate** as mutation 31, so the regression cannot return silently.

⚠️ **A consequential edit I had to make, recorded because it weakens nothing but looks like it might.**
Mutation 30 (an *unconditional* `exec`) carried a narrowness check asserting 12b/12c/12d stay green.
After R1's fix that is no longer true or desirable: 12b now pins the same hand-off as 12, so an
unconditional `exec` **should** red both. I removed 12b from mutation 30's must-stay-green list and
left 12c/12d in it — they pin the *gate*, not the hand-off, and must still be green. Requiring 12b to
stay green there would have been requiring the very hole mutation 31 exists to close.

### Decision log — calls made unattended under the standing approval

Continues the build step's D1–D5. Each entry names the finding it answers, what changed, and why it
qualified under ADR-019's discipline as carried by ADR-032.

| # | Answers | Change | Why it qualified |
|---|---|---|---|
| D6 | R1 | Added the lead-phase assertions (invocation count + full lead argv) to assertion 12b. | **Verified `CORRECT`, mechanical, in-plan.** I reproduced the 43/43-green mutant myself before touching anything. Purely additive — no existing assertion altered. The approved plan's step 4 created 12b and its Verification step 1 requires the amended suite to show "the new agent, new settings file, new seed"; pinning the hand-off on the path a human actually walks is that same verification intent, not a widening of it. |
| D7 | R1 | Added **prove-red mutation 31** (intake-path-only `exec`) and its header index line. | **Obvious winner within intent.** The approved plan's step 6 established exactly this pattern for exactly this behaviour (mutation 30), and the driver's instruction was to strongly consider one. Without it, R1's fix is an assertion nobody re-proves; with it, the hole is gated permanently. Additive to `prove-red.sh`; uses the existing `make_claude_copy` / `run_suite` helpers; no count is asserted anywhere. |
| D8 | R1 | Narrowed **mutation 30's** must-stay-green list from `12(b\|c\|d)` to `12(c\|d)`. | **Mechanical and forced, not a judgment call.** It is a direct consequence of D6: with 12b now pinning the hand-off, an unconditional `exec` reds it, and leaving the old check would have **failed the gate on a correct tree**. The check's purpose — "the mutation is broader than the hand-off" — is preserved exactly, because 12c/12d remain and they are the assertions about the gate rather than the hand-off. Documented inline at the site so a later reader does not read it as a loosened gate. |
| D9 | R2 | Added `assert.equal(r.code, 0, …)` to assertion 12c. | **Verified `CORRECT`, mechanical, in-plan.** Reproduced firsthand: a bail rewritten to `exit 7` passed 43/43. Ruling Y1 makes "exit exactly as today" contractual and today's clean bail is 0; 12d already pins the non-zero side, so this is the missing half of a contract the plan itself named. One line. |
| D10 | R4 | Added one `printf` to the bail arm of the fresh-project branch. | **⭐ Owner-ruled, not my call** — relayed verbatim as *"Add one line on the bail path (Rec)"*. Applied exactly to that scope: message only. ⛔ `exit "$cold_rc"` byte-unchanged and no session opened, which is what keeps it clear of ruling Y1's *"exit exactly as today"*. Verified on all three gate outcomes. |
| — | R3 | **No change.** | ⭐ Owner-ruled *"Split to a follow-up brief (Rec)"*. Classified **frontier** — new coverage for a pre-existing gap, outside the approved plan. Recorded as an accepted residual in the ledger. ⛔ I do not write the brief; briefs are the producer's and the driver routes it. |

**No fix was applied outside the approved plan, and no frontier-move was made.** R3 is the one finding
that would have been a frontier-move, and it was ruled to a follow-up rather than taken.

### One deliberate non-test, declared rather than left silent

R4's new bail line is **not** pinned by an assertion. The launcher-contract suite has **zero** stdout
assertions (verified by grep) — it pins argv, settings files, and exit codes, never launcher prose,
and assertion 12 does not pin the *"this tab opens the lead"* promise either. A prose assertion here
would be a new and brittle precedent inside a task whose approved plan did not ask for one. The line
was instead **measured directly** on all three gate outcomes. ⚠️ **The cost is real: reworded or
deleted, that line reds nothing.**

### Residual status changes

- ⭐ **"The bail path is silent" is now DISCHARGED** by R4's fix — the bail prints
  *"Setup did not complete — run `fkit` again when you are ready."* The build step listed it as a
  residual worth a later view; the owner took that view this round. Exit behaviour is unchanged, so
  ruling Y1's residual about *exiting* exactly as today stands untouched.
- **New residual recorded** in the ledger: no fresh-tree × explicit-role regression test (R3),
  owner-ruled to a follow-up brief.
- Unchanged and still standing: the lost producer conversation; `makeProject`'s now-incomplete
  comment; `prove-red.sh` carrying `0359`'s uncommitted work alongside mine.
