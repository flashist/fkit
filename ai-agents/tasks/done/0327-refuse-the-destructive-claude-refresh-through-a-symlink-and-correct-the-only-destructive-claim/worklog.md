# Worklog — 0327 refuse init's destructive `.claude/` refresh through a symlink, and correct the "ONLY DESTRUCTIVE OPERATION" claim

Built by a spawned `fkit-coder` **Build worker** under `/fkit-sprint-ship-loop` (ADR-032 Decision 3),
on the driver's declared-approval marker. `plan.md` (blob `7b6c5b8dd812211e27dd9a4d390e87019184e1b3`,
30447 bytes, verified against disk before the first edit) **is the autonomy boundary**.
Implemented against `HEAD` = `c45ec3d`; `claude/` re-measured clean before the first edit.

## Owner-decision log

- **Plan gate (2026-08-24, `AskUserQuestion` in the driver session):** approved —
  verbatim label **"Approve on Q1(a) + Q2(a) (Recommended)"**.
  - **Q1 — exit status: (a) Warn, continue, exit UNCHANGED.** Verbatim label
    **"(a) Exit unchanged (Recommended)"**. No new exit code; `claude/fkit-claude.sh` not touched.
  - **Q2 — how many sites: (a) ALL FIVE.** Verbatim label **"(a) All five (Recommended)"**.
- **Accepted consequence of Q1(a), recorded so it is not re-filed as a defect:** on a *fresh* project
  with a symlinked `.claude`, session start now fails with Claude Code's own "agent not found" message
  rather than fkit's. **Nothing is destroyed, which is the point.** The launcher's own symlink-blind
  fail-safe (`fkit-claude.sh`'s `ls .claude/agents/fkit-*.md` dereferences) is **not** repaired here and
  remains a live, unowned observation.
- **Fixes applied unattended, without asking (ADR-019 audit obligation):** `none`. Every step came
  straight from the approved plan; no review round ran in this spawn.
- **Obvious-winner calls made unattended:** **one**, recorded below.
  - **Which stream A2/A3 assert the per-half refusal on.** The plan's §3 Step 1 test table says
    *"stdout names skills-only refusal"* for A2 and A3, but the plan's own §3 Step 2 implementation
    block is unambiguous that the warning goes to **stderr** (`} >&2`), and its A1 row says
    *"stderr matches both refusals"*. The table wording is a slip against the plan's own design.
    **What I did:** asserted **strictly more** than either reading — the refusal text on **stderr**
    (and the *other* half's refusal **absent** from stderr), **and** the summary line on **stdout**
    reflecting only the half that ran. Qualifies as an obvious winner: one reading is internally
    contradicted by the plan, the chosen assertion covers both readings, and it stays inside the plan's
    intent (per-half refusal, announced truthfully). No behaviour was changed to suit it.

## Reproduction (the evidence this change is built on)

Re-confirmed by the red-first suite run against **unmodified** init (§4.1), in throwaway
`mkdtempSync(os.tmpdir(), …)` dirs only. Measured failure list, pre-fix:

| Test | Pre-fix failure |
|---|---|
| A1 `.claude` → outside | `init DELETED the user's own agent through the .claude symlink` — exit 0, empty stderr |
| A2 `.claude/skills` → outside | `init rm -rf'd the user's own skill through the .claude/skills symlink` |
| A3 `.claude/agents` → outside | `init DELETED the user's own agent through the .claude/agents symlink` |
| A4 `.claude` dangling | `init died on a dangling .claude (rc=1)` — `mkdir: …/.claude: No such file or directory` |
| A5 `.claude` → inside project | refused-anywhere not honoured: `inner/` came back `['agents','skills']` |
| B1 verb | `§3 must refuse in its own verb` — no `refresh` refusal existed |
| C1 control | **PASSED pre-fix and post-fix** (a control that only goes green after the fix is not a control) |

## Decisions taken during the build, and why

1. **Non-fatal, exit status unchanged.** Owner ruling Q1(a). §3 warns on **stderr** — the launcher sends
   init's stdout to `/dev/null` on an already-set-up project, which is exactly the case the warning
   exists for — skips that half, and setup carries on. Same bar as §1, §4 and 0088.
2. **Guard placed BEFORE `mkdir -p`.** A requirement, not style: measured shape B (dangling `.claude`)
   kills init *at* that `mkdir` under `set -euo pipefail`, so a guard placed after it never runs.
3. **Two `path_contained` calls, not one.** Measured shapes A and C prove the halves are independently
   reachable **and** independently survivable — a symlinked `.claude/skills` must not cost the user their
   agents. A2/A3 are what assert it. Each call walks `.claude` too, so a symlinked `.claude` refuses both.
4. **Verb `refresh`.** §3 does `mkdir` + `rm` + `cp` in one breath; `refresh` is the only word true of all
   three. `delete` understates the writes, `write` understates the deletes. §4's `write` and §6's
   `delete` are unchanged and pinned byte-for-byte by B1.
5. **`set -u` safety.** `n_agents`/`n_skills` are conditionally unset when a half is skipped, so both are
   initialized to `""`. The summary is truthful per-half: both halves ran → **byte-identical** to the
   line this has always printed (pinned by C1); one half → that half only; neither → no line at all.
6. **Re-characterise *and* enumerate** at the five claim sites (the brief's "say which, and why").
   Either half alone is a worse comment.

## The `fkit-` prefix caveat (recorded, deliberately NOT fixed here)

`fkit-claude-init.sh`'s §3 header comment says *"a user's own agents/skills in `.claude/` are never
touched"*. **That is true only for non-`fkit-` names.** §3's `rm -f "$dest/.claude/agents/fkit-"*.md`
and its `rm -rf` over `skills/fkit-*/` **will** delete a user file or directory that happens to use the
`fkit-` prefix — that is exactly what the reproduction's `fkit-mine.md` and `fkit-myskill/` were.

Inside the project that is the documented namespace convention (both patterns are gitignored by §5), so
the behaviour is left **unchanged** — the approved plan (§3 Step 3) decided to *record* the overclaim,
not repair it, and I did not widen scope past that. The comment is left verbatim. **C1 pins that
non-`fkit-` names (`my-agent.md`, `my-skill/`) survive the refresh untouched.**

## Residual: TOCTOU — inherited, NOT widened, NOT closed

⛔ **The symlink hazard at §3 is narrowed, not closed.** Between `path_contained`'s `[ -L ]` walk and the
`mkdir`/`rm`/`cp` that follow there is a window in which a component could be swapped for a symlink.
**This is not closable in POSIX shell** — it needs `openat()`-class primitives; a partial mitigation
would shrink the window while making the code *look* safe, which is worse than the honest gap.

This is the **same** accepted residual already recorded in-file for §6 (the "ACCEPTED RESIDUALS —
owner-ruled 2026-07-17, review round 1" block) and inherited by §4 in 0046. §3's new guard **inherits**
it; it does **not** widen it, and this task does not claim to have closed it. Anyone who can win that
race can already write the tree directly.

## Change surface (exactly the approved plan's §2 — nothing else)

| File | What changed |
|---|---|
| `claude/fkit-claude-init.sh` | §3 rewritten as two independently-guarded halves + per-half truthful summary; §6's exclusivity claim corrected and cross-referenced to §3; header bullets 3 and 6 corrected |
| `claude/orphan-targets` | the ⛔ owner-ruling block's exclusivity claim corrected (comment-only, `#`-prefixed — invisible to `cleanup_orphans()`'s parser) |
| `test/init-claude-refresh-guard.test.js` | **NEW** — the §3 contract suite (7 tests) |
| `test/orphan-cleanup.test.js` | header comment only, no assertion changed |
| `test/init-intake-guard.test.js` | header comment only, no assertion changed |

**Deliberately untouched, verified:** `claude/structure-manifest.tsv` (no regen owed — the generator
walks only `claude/scaffold/`; plan §2), `claude/fkit-claude.sh` (Q1(a) ⛔), `test/prove-red.sh`,
`test/harness.mjs`.

## Verification evidence

- **Red-first (§4.1):** suite written **before** init was touched; A1 A2 A3 A4 A5 B1 **RED**, C1 green.
  Failure list above. Post-fix: **all 7 green, C1 unchanged.**
- **`npm run test:unit`:** `tests 744 / pass 744 / fail 0 / suites 23` (= 737 baseline + 7 new).
- **`bash test/prove-red.sh`:** all 22 mutations red at their named assertion; `✓ hard gate PASSED`.
  Steps 0a–0k green, so the new suite false-reds no mutant run (it never reads `FKIT_LAUNCHER`).
- **§4.3 reference gate (mandatory, run — not reasoned about):** the target-token grep over `claude/`
  (excluding `orphan-targets` itself) returns **nothing**; `test/orphan-cleanup.test.js` **green**
  (A–G, including "the target list" and "the reference-check gate").
- **§4.5 regressions:** `converge-contract`, `orphan-cleanup`, `init-intake-guard`, `launcher-contract`,
  `structure-notice` → `tests 112 / pass 112 / fail 0`.
- **Containment (§4.2):** every outside dir `mkdtempSync(join(tmpdir(),'fkit-outside-'))`, every project
  `mkdtempSync(join(tmpdir(),'fkit-refresh-'))`, all removed in `after()`. No fixed path, nothing under
  the repo. `git status --porcelain` after the full run shows **only** the five intended paths; no stray
  `fkit-outside-*` / `fkit-refresh-*` dirs remain in `os.tmpdir()`.

## The gap in this change's evidence, stated plainly

**The red-first proof here is MANUAL, not mechanized.** `test/harness.mjs:160` hardcodes
`export const INIT = join(REPO, 'claude', 'fkit-claude-init.sh')` with **no env override**, so
`prove-red.sh` — which points `FKIT_LAUNCHER` at a mutated *copy* — cannot reach `fkit-claude-init.sh`
at all. A mutant init therefore **cannot** red this suite. That seam is open task **`0037`**'s
deliverable and was **not** built here. Verified by reading the harness, not taken on report.

## Explicitly NOT done — so nobody closes these by accident

- **`0328`** (init's `mkdir -p` being fatal) — **partially and incidentally overlapped, NOT closed.**
  The guard converts the *dangling-symlink* shape (A4: was EXIT=1) into warn-and-continue. It does
  **nothing** for the non-symlink causes `0328` owns — `.claude` a regular file, a read-only parent,
  ENOSPC, permissions: `path_contained` returns 0 for all of those and the `mkdir` still kills init.
  **`0328` remains fully open.**
- **`0329`** (§5 appends through a symlinked `.gitignore`) — untouched.
- **`0330`** (launcher writes lockdown state through a symlinked `.fkit`) — untouched (different file).
- **`0332`** (hard-link shape) — untouched. `path_contained` tests `[ -L ]` only; a hard link is
  invisible to it, unchanged in either direction by this task.
- **`0037`** (the `INIT` override seam) — not built. See the evidence gap above.
- **`0045`** (read-side symlink hazard under `ai-agents/`) — different side, different tree, still latent.
- **`0046`'s §4 fix** — not modified; only its header comment's `:4` wording.
- No `ai-agents/wiki-vault/` write. No task-file move. No commit, no push.

---

# Round 2 — processing review round 1 (2026-08-24)

Run by a spawned `fkit-coder` **Process-review worker** under `/fkit-sprint-ship-loop`
([ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
Decision 3 + its 2026-07-22 autonomy amendment), on the driver's declared-approval marker. `plan.md`
re-verified against disk before the first edit — `git hash-object` = `7b6c5b8dd812211e27dd9a4d390e87019184e1b3`,
`wc -c` = `30447`, both matched.

⚠️ **Everything above this line is the BUILD spawn's record and is left byte-identical.** Where round 2
changed something it claimed, the correction is below, dated — the build's text is not edited to look
right afterwards.

## ⛔ Reconciliation — what round 2 made false in the record above

**Three claims. Two are corrections of fact; one is a scope statement that round 2 reversed under an
owner ruling.**

1. ⛔ **§*"The `fkit-` prefix caveat (recorded, deliberately NOT fixed here)"* — its last claim,
   *"The comment is left verbatim"*, IS NOW FALSE, and the reversal is the OWNER's, not this role's.**
   Review round 1 raised the overclaim as **R3**, and the owner ruled it **fixed in `0327`** — verbatim
   label **"Fix both in 0327 (Recommended)"**, 2026-08-24, via `AskUserQuestion` in the driver session.
   The comment is now **corrected at six sites**, listed below. ⚠️ **The rest of that section stands and
   is still the reason the BEHAVIOUR is unchanged** — a `fkit-`prefixed user path is still deleted; only
   the comment that denied it has changed.

2. ⚠️ **The same section's mechanism claim needs ONE word of precision after R1's fix.** It says §3's
   `rm -rf` over `skills/fkit-*/` *"will delete a user file or directory that happens to use the `fkit-`
   prefix"*. **True only for a REAL file or directory now.** A `fkit-`prefixed entry that is a
   **symlink** is refused, not deleted — that is R1's fix. The distinction is load-bearing: fkit
   **deletes** the real squatter and **refuses** the symlinked one, and conflating them is how the next
   reader gets R1 wrong again.

3. ⚠️ **§*"Decisions taken during the build"* item 3, *"Two `path_contained` calls, not one"*, is now
   understated.** There are **three** call sites: the two half-guards it describes, plus a **per-entry**
   one inside `skills_entries_contained()`. Item 3's reasoning is unchanged and still correct — the two
   halves fail independently; the third call is a different axis (depth, not half).

**Checked and NOT changed:** the *Reproduction* table (accurate for the build), the *TOCTOU residual*
section (*"narrowed, not closed"* — still exactly true; R1's fix narrows it further and closes nothing),
the *evidence gap* section (`prove-red.sh` still cannot reach init — unchanged, still `0037`'s), and
every row of *Explicitly NOT done* (all still untouched).

## Owner-decision log — round 2

- **R1 (high) + R2 (medium): FIX IN `0327`, in scope.** Verbatim label **"Fix in 0327 — in scope
  (Recommended)"**, `AskUserQuestion`, 2026-08-24.
- **R3 (medium) + R4 (low): FIX BOTH in `0327`.** Verbatim label **"Fix both in 0327 (Recommended)"**,
  same exchange.
- **The launcher's symlink-blind agents fail-safe: filed as its own task.** Verbatim label **"File it as
  its own task (Recommended)"**. ⛔ **Not this task's, and not touched** — `claude/fkit-claude.sh` is
  unmodified. ⚠️ **Its MECHANISM is deliberately not restated in round 2.** `:18` above states it in
  wording a concurrently filed task (`0335`) exists to correct across `0327`'s records; round 2 does not
  add another copy, and does not edit `:18` — that line is the build spawn's record and `0335`'s to repair.
- **R5 (low, test coverage): NOT ruled on.** Dispositioned on this role's own judgement — see below.

## ⛔ Fixes applied unattended, without asking — ADR-019's audit obligation

**Round 1 of this worklog recorded `none` because no review round had run in that spawn. Round 2 is
different: five fixes were applied without a per-fix approval, under the standing approval the
declared-approval marker carries.** Each one, what it answers, and why it qualified:

| # | Finding | What changed | Why it qualified |
|---|---|---|---|
| 1 | **R1** | `skills_entries_contained()` in `claude/fkit-claude-init.sh` + the skills half's guard condition | Verified **CORRECT** by firsthand reproduction (outside tree deleted, `rc=0`, empty stderr). Mechanical and localized — one helper and one `if` condition. **In scope by explicit owner ruling.** |
| 2 | **R2** | the **same** guard — no separate change | Verified **CORRECT** by firsthand reproduction (three shapes measured). **In scope by explicit owner ruling.** The behaviour choice inside it is logged as an obvious-winner call below, not smuggled in here. |
| 3 | **R3** | the exclusivity claim re-written at six sites | Verified **CORRECT** by reading the code. Comment-only, no behaviour. **In scope by explicit owner ruling.** |
| 4 | **R4** | both `:315` citations repaired durably | Verified **CORRECT** — the doctrine line measured at `:317`. Comment-only, mechanical. **In scope by explicit owner ruling.** |
| 5 | **R5** | tests **A6**, **A7**, **D1** added | ⚠️ **NOT ruled on by the owner.** Applied on this role's own judgement because A6 and A7 **are** the red-first proof R1 and R2 were required to carry, and D1 is the pin R3's new wording rests on — closing R5 separately would have meant writing the same three tests twice. **Test-only; no production behaviour.** Flagged rather than assumed. |

## Obvious-winner calls made unattended — round 2

**Two.** Both stay inside the approved plan's intent (guard §3's deletions and writes; make the claim
stop being false) and neither changes a behaviour the plan or the owner fixed.

1. ⭐ **R1 and R2 are ONE fix, not two — and the measurement is what decided it.** The obvious-looking
   R1-only fix is *"skip the `rm` for a symlinked entry"*. **Measured: that is wrong.** With a **live
   directory** symlink at a **payload-colliding** name, skipping the `rm` hands the entry to `cp -R`,
   which fails `cp: …: Not a directory` under `set -euo pipefail` — i.e. an R1-only fix converts R1's
   **silent destruction** into **R2's fatal abort**. ⚠️ It does **not** write through the link (checked
   — the outside tree was byte-intact), so this is an abort, not a second escape. Guarding the entry for
   **both** statements is the only shape that leaves neither defect. **Qualifies:** one candidate is
   disproven by measurement, so the remaining one dominates, and it stays inside the plan's intent.

2. ⭐ **A SIXTH claim site was fixed beyond the five R3 names.** `test/init-intake-guard.test.js:4` read
   *"§6 applies it to fkit's one unrecoverable delete"* — the same false claim, absent from the
   finding's list. **Qualifies:** the owner's Q2(a) ruling at plan time was **"(a) All five"**, i.e.
   *correct it everywhere it appears* rather than *at exactly five addresses*; repairing five and leaving
   the sixth would have re-filed R3 next round. Comment-only, no assertion touched.

⚠️ **A THIRD call was deliberately NOT taken unattended — it is queued for the owner instead.** See
below; it is a real tradeoff, not an obvious winner.

## The one behaviour decision, and why it is queued rather than logged as settled

**R2's fix refuses the ENTIRE skills half when any `.claude/skills/fkit-*` entry is a symlink**, rather
than skipping that one entry.

- **Why:** `cp -R` copies every payload name in **one call**, so skipping a single colliding destination
  means unrolling it into a per-skill loop — more moving parts guarding a namespace that is fkit-managed
  and gitignored by §5, where a symlink is a convention violation to **report**, not a layout to support.
  The refusal **names the offending entry**.
- **Rejected:** *skip only the offending entry.* It needs either the per-skill `cp` loop or a
  payload-name collision test, and the collision test gives **two behaviours for one condition** with a
  set that changes whenever a skill is added or renamed.
- ⛔ **Cost, stated plainly:** one stray symlinked `fkit-*` entry costs the user **all** the fkit skills
  until they move it. That is the same granularity a symlinked `.claude/skills` already carries, and the
  alternative to refusing is destroying — but it is a **judgment call, not a mechanical fix**, so it is
  **queued in `review.md`'s *Accepted residuals* block for an owner disposition** and **NOT written there
  as a settled residual**.
- **The bar is met:** non-fatal, stderr, exit status unchanged (Q1a), the agents half unaffected.

## Change surface — round 2 (ON TOP of the build's, which is unchanged)

| File | What changed in round 2 |
|---|---|
| `claude/fkit-claude-init.sh` | **R1+R2** `skills_entries_contained()` + the skills half's guard condition. **R3** header bullets 3 and 6, §3's header, §6's headline and its two-difference block. **R4** both `:315` citations repaired durably |
| `claude/orphan-targets` | **R3** the ⛔ owner-ruling block's exclusivity claim (comment-only, `#`-prefixed) |
| `test/init-claude-refresh-guard.test.js` | **+A6**, **+A7** (both red-first), **+D1** (the pin R3's wording rests on) |
| `test/orphan-cleanup.test.js` | **R3** header comment only |
| `test/init-intake-guard.test.js` | **R3** header comment only — the sixth site |

⛔ **Still untouched:** `claude/fkit-claude.sh`, `claude/structure-manifest.tsv`, `test/prove-red.sh`,
`test/harness.mjs`, `ai-agents/sprints/`, and every other task's folder.

## Verification — round 2

⚠️ **The build's figures above are NOT edited; these supersede them for the current tree.**

- **Red-first, run against the UNMODIFIED post-build tree, before any source edit:** **A6 RED**
  (`init rm -rf'd the user's tree through a symlinked .claude/skills/fkit-* entry`), **A7 RED**
  (`init died on a dangling .claude/skills/fkit-adversarial-review (rc=1)` +
  `cp: …: Not a directory`). The other 8 green. **After the fix: 10/10 green**, C1 unchanged.
- **`npm run test:unit`:** `tests 747 / pass 747 / fail 0 / suites 24` — **744 + 3**, exactly A6/A7/D1.
- **`bash test/prove-red.sh`:** **22/22** mutations red at their **named** assertion; steps 0a–0k green;
  `✓ hard gate PASSED`. **No mutant run was false-reded by the new tests.**
- **§4.3 reference gate:** fixed-string grep for all four target tokens over `claude/`, excluding
  `orphan-targets` itself → **zero hits**; `node --test test/orphan-cleanup.test.js` → **23/23 green**.
  ⚠️ The first pass of this grep was run **unescaped** and appeared to hit `.omnigent` in four files;
  re-run with `-F` it is clean — the leading `.` was matching as a regex wildcard against the word
  *Omnigent*. **Recorded because the naive form reads as a failure and is not one.**
- **§4.5 regressions:** the five named suites → `tests 112 / pass 112 / fail 0`.
- **`bash -n claude/fkit-claude-init.sh`:** syntax OK.
- **Containment:** every dir `mkdtempSync`/`mktemp -d` outside the repo, all removed; **no
  `fkit-outside-*` / `fkit-refresh-*` left in `os.tmpdir()`**; `git status --porcelain` shows only the
  intended paths.

⚠️ **The evidence gap is UNCHANGED and still open.** `test/harness.mjs:160` hardcodes `INIT` with no env
override, so `prove-red.sh` cannot reach `fkit-claude-init.sh` and a mutant init cannot red this suite.
**The red-first proof for A6 and A7 is MANUAL.** `0037`'s deliverable; **not built here.**

---

# Round 3 — processing review round 2, and closing the ledger out (2026-08-24)

Processed by a spawned `fkit-coder` Process-review worker under `/fkit-sprint-ship-loop`
(ADR-032 Decision 3 + the 2026-07-22 autonomy amendment), on the driver's declared-approval marker.
`plan.md` (blob `7b6c5b8dd812211e27dd9a4d390e87019184e1b3`, 30447 bytes) **re-verified against disk
before the first edit** — `git hash-object` and `wc -c` both matched.

⛔ **DOCUMENTATION-ONLY ROUND. No source file was edited.** Review round 2 returned
**✅ Ready to merge**, with all five round-1 findings **CLOSED by measurement** and two **new** findings,
both `low`, both **pre-existing at `HEAD`**, both **outside `0327`'s deliverable** — owner-ruled to a
follow-up task that is a **producer's** to file.

## Owner-decision log — round 3

Relayed by the driver, live via `AskUserQuestion` 2026-08-24, labels **verbatim**:

| Item | Ruling | Verbatim label |
|---|---|---|
| **R6** (wrong-type squatter aborts init) | Filed as its own task. ⛔ Not fixed here. | **"File as its own task (Recommended)"** |
| **R7** (refusal names only the first offender) | Folded into R6's task. ⛔ Not fixed here. | **"Fold into R6's task (Recommended)"** |
| **`0327` closeout** | Close now, R6/R7 filed forward. | **"Close now, R6/R7 filed forward (Recommended)"** |
| Three stale citations pointing **into** `fkit-claude-init.sh` | Folded into `0176`. ⛔ Not this task's. | **"Fold into 0176 (Recommended)"** |

## ⛔ Fixes applied unattended, without asking — ADR-019's audit obligation

**NONE.** ⛔ **No fix was applied this round, and no source file was edited.** Recorded explicitly
because an empty audit log and a **forgotten** one are otherwise indistinguishable.

## Obvious-winner calls made unattended — round 3

**NONE.** Both findings were owner-ruled before this round began; nothing was left to this role's
discretion. Recorded explicitly for the same reason.

## R6 and R7 — re-derived firsthand, NOT taken from the driver's prompt or the reviewer's rows

⚠️ **R6's reproduction DESTROYS the installed payload in the project it runs against** — every shape was
executed in `mktemp -d` dirs outside the repo, never against this repo and never a fixed path.

**R6 — CORRECT, `low` agreed (Codex said medium).** Measured: real **directory** at
`.claude/agents/fkit-x.md` on an already-installed project → `rm: …: is a directory`, **`rc=1`**, fkit
agents **7 → 0**, the user's own `my-own.md` **survives**, the squatter **survives**. Fresh project →
same, and **`.gitignore` never created**, confirming §5/§6 never ran. Real **file** at
`.claude/skills/fkit-adversarial-review` → `cp: …: Not a directory`, **`rc=1`**, no `.gitignore`.
**`git archive HEAD` reproduces both identically** — ⛔ pre-existing, not a regression. **Recovery
measured:** move the stray, re-run → `rc=0`, agents **0 → 7**, skills **25 → 26**, `.gitignore` created.

**Scope boundaries measured so the follow-up task inherits them:** a real file at a **non-payload** name
is **harmless** (`rc=0`, survives untouched) — R6 fires only on a **payload-name collision**, exactly as
R2 did; and a real **directory** squatter in **skills** **is** deleted and not put back, so `:531`'s
wording holds for that shape. The narrowing is precisely the **wrong-type** squatter.

**R7 — CORRECT, `low` agreed.** Measured with `fkit-aaa` + `fkit-zzz`: only **`fkit-aaa`** named,
`fkit-zzz` appears **0** times until `fkit-aaa` is removed — **the "one re-run at a time" claim
reproduced by execution.** `rc=0`, both outside trees byte-intact, both links left as found, agents half
ran normally. Coordinates verified: rationale at **`:574`**, function at **`:578`**, refusal block at
**`:606-612`**.

## Two refinements this round adds — neither overturns a finding

1. **R6's severity route is not one route but two.** The **agents** shape trips the launcher's **hard**
   fail-safe (`claude/fkit-claude.sh:387`, gated on `setup_ok = 0` **and** no agents on disk) and exits
   **1**; the **skills** shape leaves agents installed, so it reaches only the loud stderr warning at
   **`:372`** and the session **starts with a partial skill set**. ⭐ The worst shape is also the
   **loudest** — the wipe is exactly what makes the `ls` fail. **No silent success in any shape**, so
   `low` stands.
2. **R7's path line must not simply be re-pointed.** ⛔ **One message block at `:606-612` serves two
   triggers**, and the path is **correct** for the other one — when `.claude/skills` **itself** is the
   symlink, `$dest/.claude/skills` **is** the offending path. A one-line fix would **break the case that
   works today**; the triggers need distinguishing.

## The reviewer's two self-flagged limits — both judged honestly bounded

- **§4.5's 112/112 not re-derived as a standalone group:** ✅ agreed — it is a **subset** of the
  `747/747, fail 0` run the reviewer **did** re-run, which is **strictly stronger**. Only the count
  attribution is lost, not any correctness claim.
- **Round-1 ledger byte-identity taken on report:** ✅ agreed — `review.md` is **untracked**, so git holds
  **no baseline** and no diff is possible. The **structural** invariants were checked and hold: exactly
  **one** each of the three `##` sections, **zero** live round-1 queue sentinels, **no** `R6`/`R7` row in
  *Coder response* before the append. ⚠️ **Durable lesson: an untracked ledger has no baseline, so
  "unchanged" can never be more than a report.**

## R4's closure — deletion beat renumbering, and round 2 proved it one round later

⭐ Re-verified firsthand: the doctrine line moved **again**, `:315` → `:317` → **`:319`**, and **both**
repaired citations (**`:534`**, **`:637`**) are **still correct** — they carry the quoted fragment
*"is the one test that does not lie, so it has to come first"* and **no number at all**. **Zero `:315`
coordinates survive.** ⛔ **A renumber-to-`:317` fix would already be stale.** This is the concrete case
for `durable-citation-anchors.md`: the repair that survives **removes** the coordinate.

## Change surface — round 3

| File | What changed |
|---|---|
| `…/0327-…/review.md` | *Coder response* **round-2 append** (round 1 untouched); **two residuals added IN PLACE** to the existing *Accepted residuals* section; the `0176` pointer added; header `Status:` → **`closed-out`** |
| `…/0327-…/worklog.md` | This round-3 entry |

⛔ **Untouched:** every source and test file — `claude/fkit-claude-init.sh`, `claude/fkit-claude.sh`,
`claude/orphan-targets`, `claude/structure-manifest.tsv` (**not** regenerated), `test/prove-red.sh`,
`test/harness.mjs` and all suites. **`ai-agents/sprints/` untouched** (a producer is working the boards
and `0176` concurrently). **No other task's folder touched. No task-file move. No commit, no push, no
`ai-agents/wiki-vault/` write.**

## Ledger status

**`Status: closed-out`**, set on this role's **own** verification: both novel findings independently
reproduced and confirmed **CORRECT**, both owner-ruled out of scope and recorded as residuals with
re-raise conditions, all five round-1 findings closed by the reviewer's measurement, and **nothing
blocking left**. ⛔ **The follow-up task for R6+R7 is a PRODUCER's to file — this role filed nothing.**

## ✅ Follow-up confirmed filed — `0336`

⛔ **Filed by the PRODUCER, not this role.** While this round was writing, the concurrent producer filed
`ai-agents/tasks/backlog/0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry/`.
Its brief was **READ ONLY** and confirmed to carry **both R6 and R7**. Both residual entries in
`review.md` now name it, so neither can be re-filed. ⛔ **Nothing in `0336`'s folder was written.**
