# Worklog — `0046` Gate the symlink escape when init writes the `.fkit/interview` intake

**Built 2026-08-23** by `fkit-coder`, spawned as the Build worker of `/fkit-sprint-ship-loop`, against
the owner-approved plan at `plan.md` (git blob `263260e076eb784e1c14f6991ea586d9fd5a96fc`, 33330 bytes —
hash and size re-verified on disk before any edit).

---

## 1. Change surface

Three files. **No commit, no push, no wiki write, no task-file move, no manifest regen.**

| File | Change |
|---|---|
| `claude/fkit-claude-init.sh` | +68 / −44. Helper hoisted + renamed; §6 call site updated; §4 guarded. |
| `test/init-intake-guard.test.js` | **New**, 180 lines, 7 tests. |
| `test/orphan-cleanup.test.js` | +6 / −9. Comment rewrite + one-way check → two-way freeze. |

⚠️ The plan's §2 opens *"Four files"* and then lists three. Nothing turned on it — the extra was either
this worklog or a miscount. Recorded so a reviewer does not go hunting for a fourth edit.

### `claude/fkit-claude-init.sh`, in the three planned edits

**(a) Hoist + rename.** `orphan_contained()` and its doctrinal comment moved from `:655-689` up to
**`:269-288`** (comment) / **`:289-308`** (function), between `converge_ai_agents`'s closing `}` and the
`# 1. ai-agents/` section — so every section can reach it. Renamed **`path_contained`**, with a second
parameter for the verb:

```sh
path_contained() {  # path_contained <project-relative-path> <verb> → 0 = safe, non-zero + reason on stdout
  …
    if [ -L "$_cur" ]; then
      echo "'$_seg' is a symlink — fkit will not $2 through one"
```

The body is otherwise a pure relocation — the only change inside it is `delete` → `$2`. The comment
gained a 4-line paragraph recording that the helper now guards a **write** as well, and that
`orphan_contained` was retired because that name claimed the check belonged to the orphan cleanup.

**(b) §6 call site** (`:755`): `orphan_contained "$line"` → `path_contained "$line" delete`. The two
comment mentions at `:744` and `:823` renamed. **§6's emitted string is byte-identical** — verified by
`test/init-intake-guard.test.js` test 6 asserting the literal
`'.fkit' is a symlink — fkit will not delete through one`, and by `orphan-cleanup.test.js:273`'s quoted
comment still being true (that file needed no edit there, which was the point of the verb parameter).

**(c) §4 guard** (`:538-617`). One `path_contained ".fkit/interview" write` call covers both `mkdir -p`
and `cat >` (it walks `.fkit` then `interview`). Refusal is **non-fatal** and goes to **stderr**; the
happy path moved into the `else`.

⚠️ **Heredoc integrity.** `<<'INTERVIEW'` body was **not** reindented and the `INTERVIEW` terminator
stays at column 0. Proven three ways: `git diff` contains **zero** `+`/`-` lines inside the heredoc
body; the installed intake is still **2780 bytes**, the same as pre-fix; and the control test asserts
the body `startsWith('#!/bin/sh\n')` plus a marker line.

---

## 2. Red-first evidence

### 2a. Pre-fix reproducers (untouched tree, before any edit)

```
=== R1: .fkit symlinked to an OUTSIDE dir ===
rc=0
--- outside AFTER ---
-rwxr-xr-x@ 1 …  2780 Aug 23 13:09 interview
--- stderr (grep symlink) ---
    .fkit/agents — refused: '.fkit' is a symlink — fkit will not delete through one

=== R2: DANGLING .fkit symlink ===
rc=1
--- stderr ---
mkdir: /tmp/fkit-0046-pre.k7lQMv/b/.fkit: No such file or directory
--- stdout tail ---
• refreshed 7 agents → .claude/agents/, 26 skills → .claude/skills/
--- .gitignore exists? ---
NO

=== R3: symlinked LEAF .fkit/interview ===
rc=0
--- victim AFTER ---  (was 'ORIGINAL user content\n')
    2780
#!/bin/sh
# fkit first-run intake. Asks a few project questions on the controlling terminal and writes
```

All three reproduce exactly as the plan's §1 predicted, including the §6-refuses / §4-writes-through
contrast in the *same* run, and the dangling-symlink **abort** (not write-through) at `mkdir -p`.

### 2b. Pre-fix test run — RED at the named assertions

`node --test test/init-intake-guard.test.js` → **tests 7, pass 2, fail 5**:

| Test | Actual pre-fix failure | Matches plan §4a |
|---|---|---|
| `.fkit symlinked outside → refuse, nothing lands outside` | `AssertionError: the intake escaped the project` | ✅ |
| `.fkit a DANGLING symlink → refuse, init completes` | `AssertionError: init died on a dangling .fkit (rc=1)` + `mkdir: …/.fkit: No such file or directory` | ✅ |
| `a symlinked LEAF is not written through` | `AssertionError: init overwrote a file outside the project through a symlinked leaf` (actual = the 2780-byte intake, expected = `ORIGINAL user content`) | ✅ |
| `.fkit symlinked INSIDE the project is refused too` | `AssertionError: a symlinked component is refused wherever it points` | ✅ |
| `§6 says "delete", §4 says "write"` | `AssertionError: §4 must refuse in its own verb` — stderr carried only the three `will not delete through one` lines | ✅ |
| `ordinary .fkit → executable intake, idempotent` | **PASSED** (the control) | ✅ |
| `the refusal is non-fatal — §5 and the summary still run` | **PASSED** | ✅ — not in §4a's red set, see below |

`node --test test/orphan-cleanup.test.js` → **fail 1**, the two-way freeze, with the diff naming exactly
one added entry:

```
+     'interview',
+     'file:e361479220afd51d539b3252c09a95dd51242c86b6ac21a4016a6cae1a14209b'
```

**On the one test that passes pre-fix and is not the control.** `the refusal is non-fatal — §5 and the
summary still run` is §4b's item 2 and is deliberately **absent from §4a's red table**: pre-fix, writing
*through* the link also leaves §5 and the summary reachable, so there is nothing for it to red on. It
exists as the regression net for the guard itself (a guard that aborted init would trade this bug for a
worse one). Flagged here rather than silently counted as red-first coverage.

### 2c. Post-fix — GREEN

```
node --test test/init-intake-guard.test.js                              → tests 7, pass 7, fail 0
node --test test/orphan-cleanup.test.js test/converge-contract.test.js  → tests 51, pass 51, fail 0
sh -n claude/fkit-claude-init.sh                                        → OK
bash -n claude/fkit-claude-init.sh                                      → OK
```

**The extraction was verified in isolation, before the §4 guard was added** (plan step 5): after edits
(a)+(b) alone, `orphan-cleanup` + `converge-contract` ran **50/51**, the single failure being the
two-way freeze that by construction cannot pass until §4 is guarded. So no §1/§6 regression can hide
behind a §4 result.

### 2d. Post-fix manual reproducer re-run

```
=== R1: .fkit symlinked to an OUTSIDE dir ===
rc=0
--- outside AFTER --- 0 entries
⚠ skipped the .fkit/interview intake: '.fkit' is a symlink — fkit will not write through one
--- summary printed? --- 1

=== R2: DANGLING .fkit ===
rc=0
⚠ skipped the .fkit/interview intake: '.fkit' is a symlink — fkit will not write through one
target exists?      no (correct)
.gitignore written? yes (§5 ran)
summary?            1

=== R3: symlinked LEAF ===
rc=0
--- victim AFTER --- ORIGINAL user content
⚠ skipped the .fkit/interview intake: 'interview' is a symlink — fkit will not write through one

=== R4: ORDINARY project (control) ===
rc=0
-rwxr-xr-x 2780
• created intake .fkit/interview
```

The dangling case went `rc=1, §5/§6/summary never run` → `rc=0, §5 ran, summary printed`. The leaf case
left the outside file byte-identical. The ordinary case is unchanged at 2780 bytes.

### 2e. Full suite

`npm test` → **tests 737, suites 20, pass 737, fail 0**, and `prove-red.sh`:

```
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

**22/22** mutations red (numbered 1–22 in its output), 11 baselines green. Against the plan's stated
criteria — `fail 0`, `pass ≥ 737` (730 baseline + 7 new), prove-red **22/22** — all three met exactly.

### 2f. Containment

Every "outside" directory in the new suite is `mkdtempSync(join(tmpdir(), 'fkit-outside-'))`, pushed to
a `trash` array, removed in `after()`. No fixed paths, nothing under the repo. `git status` after the
full run carries **no test residue**: the only paths of mine are `claude/fkit-claude-init.sh` (M),
`test/orphan-cleanup.test.js` (M), `test/init-intake-guard.test.js` (??).

---

## 3. Audit findings — re-confirmed today, **fixed: none**

Per the owner's rulings recorded in `plan.md` §8-answers, all of these are **report-only** and were
filed as their own tasks. Re-measured against the **post-change** tree to confirm this change neither
fixed nor worsened any of them.

| # | Finding | Status today | Filed as |
|---|---|---|---|
| **F1** | §3 `.claude/` refresh **deletes** through a symlinked `.claude`. Re-measured: `rc=0`, the user's `fkit-mine.md` **DELETED**, 7 fkit agent files created at the link target. Worse than the defect `0046` fixes. | ⛔ unchanged, live | `0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim` |
| **F2** | §5 appends to a symlinked `.gitignore`. Re-measured: all **3** fkit ignore blocks landed in the outside file. Product decision — a symlinked `.gitignore` may be legitimate. | ⛔ unchanged, live | `0329-decide-and-implement-inits-behaviour-when-gitignore-is-a-symlink` |
| **F3** | `mkdir -p` is fatal under `set -euo pipefail` for reasons `-L` does not cover (perms, ENOSPC, wrong type). Now at `:527` (§3, entirely unguarded) and `:560` (§4, now behind the guard but still fatal on a non-symlink failure). | ⛔ unchanged, live | `0328-make-inits-two-mkdir-p-calls-non-fatal-so-a-weird-fkit-or-claude-cannot-abort-setup` |
| **F4** | Launcher writes lockdown state through a symlinked `.fkit` — `fkit-claude.sh:319`, `:331-332`. ⚠️ **Code-read, still not executed.** | ⛔ unchanged, live | `0330-gate-the-launchers-fkit-lockdown-writes-against-a-symlinked-fkit` |

**Refinement to F4, offered to `0330`:** both launcher writes are already **non-fatal** — `:319` is
`mkdir -p … 2>/dev/null || :`, and `:331-332` sits in an `if …; then` with a documented inline-settings
fallback. The plan said only "no `-L` check", which is true; the missing detail is that the *failure
mode* there is a silent escape, not an abort. `0330` should scope to the `-L` check alone.

**Coordinate correction for `0327`.** The owner's Q1 ruling requires that task to also correct §6's
now-false *"THIS IS THE ONLY DESTRUCTIVE OPERATION IN FKIT"*. The plan cites it at `:577`; after this
change's hoist it is at **`claude/fkit-claude-init.sh:637`**.

**Verified guarded, no action** (re-checked post-change): §1 preflight, §1 per-path, `install_root_file`,
`merge_rules`, §6 — all still `[ -L ]`-first, all green.

**Residual not closed:** the TOCTOU window between the `-L` check and the write is not closable in POSIX
shell. §6 already records it as an owner-accepted residual. The new §4 guard **inherits** that residual;
it does not widen it.

---

## 4. Brief-claim corrections (plan §1d) — recorded here, brief left alone

Per the Q4 ruling (*"Note it in the worklog; leave the brief alone"* — the **planner's** recommendation
taken by the driver, **not** an owner ruling). `0046`'s brief states, and today measures otherwise:

| Brief says | Measured 2026-08-23 |
|---|---|
| `orphan_contained()` at `fkit-claude-init.sh:647`; dated correction says `:665` | Was `:669` pre-change; **the function no longer exists** — it is `path_contained()` at `:289`. |
| "§4 writes at `:476`" | Was `:500-501` pre-change (`chmod` `:555`); now `:552-617`. |
| doctrine comment "~`:159-172`" | Was `:161-166`; now `:313-316` after the hoist. |
| "**the third site** in one file that needed the same rule" | §4 is the third site *fixed*, **not** the last unguarded one — §3 and §5 remain, and §3 **deletes** (F1). |
| "Risk: low. Non-destructive (creates, never deletes)" | **Partly false.** §4 could overwrite a file outside the project through a symlinked leaf — reproduced (§2a R3). |
| Evidence: `ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md` | **Dead path.** Live: `ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/review.md` |
| Evidence: `ai-agents/tasks/backlog/remove-fkit-omnigent-orphan-residue.md` | **Dead path.** Live: `ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/brief.md` |
| `Relates to: gate-read-side-symlink-hazard-in-init.md` | Live: `ai-agents/tasks/backlog/0045-gate-read-side-symlink-hazard-in-init/brief.md` — still open, genuinely a different side. No overlap with this change. |

⚠️ Every line-number claim in this table — the brief's *and* the plan's — is now stale by construction,
because this change moved 35 lines from `:655` to `:270`. That is why the corrections are recorded as
*"was X, now Y"* rather than as a new set of coordinates to go stale in turn.

---

## 5. Decision log — what was applied unattended

Per ADR-019's audit obligation, carried to this spawn by ADR-032. Standing approval = the owner-approved
`plan.md`; scope boundary = the same.

**Fixes applied without asking:** the three planned edits of §2 and the two test files. All are the
approved plan executed as written — none is a fix to a review finding, and none went outside the plan.

**Obvious-winner calls (1):**

1. **The §4 guard comment's citation of §1's doctrine line.** The plan's §2(c) comment text cites
   *"the same doctrine §1 states at `:161`"*. Edit (a) hoists 35 lines above §1, so `:161` no longer
   points at it — the comment would have shipped false on the same day it was written. Emitted
   **`:315`** instead, verified by `grep -n 'is the one test that does not lie'`. Qualifies as an
   obvious winner within the plan's intent: the plan's §1d is itself a table of exactly this defect
   (stale coordinates), and no alternative reading makes shipping a knowingly-wrong line number
   correct. Nothing else in the comment changed.

**Judgment calls escalated:** none arose. Nothing went outside the approved plan.

### 5b. Review Round 1 processing — 2026-08-24

**Fixes applied without asking: `none`.** Round 1 returned 0 confirmed defects in the change surface.
R1 is pre-existing and out of scope (owner: *"Accept residual + file its own task"*); R2 is a
test-coverage gap the owner ruled *"Leave as-is"*. Neither disposition is a code change, so no
autonomous fix was applied and no source file was touched this round.

**Obvious-winner calls: `none`.** No call qualified — nothing in this round was a choice between
options; both dispositions were already ruled by the owner before the spawn.

**Judgment calls escalated:** none arose. Everything in the round was verify-and-record.

**What was written:** the *Coder response* section and both *Accepted residuals* entries in
`review.md`, plus its header `Status: in-review` → `closed-out`, and this entry. Docs only.
⛔ The R1 follow-up task is **unfiled** — a producer files it, alongside `0327`–`0330`.

---

## 6. Unverified / not done — stated, not glossed

- **F4 remains a code-read, not an execution.** Confirming it needs a stubbed launcher run against a
  symlinked `.fkit`, which I did not perform. Treat it as a lead, not a measured fact.
- **`test/prove-red.sh` gained no mutation for this guard, and cannot yet.** `test/harness.mjs:160`
  resolves `INIT` as a hardcoded const with no `FKIT_INIT` override, so prove-red has no seam to reach
  init through. `fkit-claude-init.sh` appears in prove-red only in a comment (`:12`). That seam is
  `0037-extend-prove-red-to-reach-init`'s deliverable; building it here would be doing `0037`'s work
  inside `0046`'s diff. §2 above is the by-hand substitute for this guard.
- **`claude/structure-manifest.tsv` deliberately not regenerated.** `bin/generate-structure-manifest.mjs:70-78`
  maps only the three `*/ai-agents/` scaffold homes and four root files; `fkit-claude-init.sh` is in
  none. ⚠️ The file is **already dirty from another task** — a "cautious" regen would have collided with
  that work as well as being wrong.
- **Only macOS/BSD was exercised.** The dangling-`.fkit` abort (§2a R2) is a BSD `mkdir -p` behaviour;
  GNU `mkdir -p` may differ. The guard runs `[ -L ]` *before* `mkdir` either way, so the fix is
  platform-independent — but the *pre-fix* symptom this worklog records may look different on Linux CI.
- **No commit, no push.** Working tree only.
