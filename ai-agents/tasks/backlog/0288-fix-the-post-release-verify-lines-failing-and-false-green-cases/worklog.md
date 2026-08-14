# Worklog — 0288: fix the post-release verify line's failing and false-green cases

**Built 2026-08-14** by a spawned `fkit-coder` (the `/fkit-sprint-ship-loop` **Build worker**), under
the loop's declared-approval marker: the owner approved `plan.md` live via `AskUserQuestion` in the
driver's `fkit lead` session, answering all three open questions (**OQ1 (A)**, **OQ2 (A)**,
**OQ3 (A)**). The approved plan is both the standing approval and the scope boundary.

⛔ **No commit, no push, no staging. No task-file move, no `## Status` change.** `plan.md` untouched.

---

## Change surface — exactly three files

| file | state |
|---|---|
| `bin/release.mjs` | modified — **summary block only** (was `:271-277`) |
| `test/release-summary.test.js` | **new** |
| `test/prove-red.sh` | modified — header index, two helpers, baseline `0k`, mutations 18–22 |

⛔ No `package.json`, no `VERSION`, nothing under `ai-agents/wiki-vault/`. `:272`'s `if (dryRun)` arm
is behaviourally unchanged and nothing above the summary block was edited — no bump, tag, push or
dry-run logic, and the `:12-14` header comment is untouched.

**Real-repo integrity, before and after** (unchanged throughout):
`HEAD c23e322e0d159c7f00544b5d999bee6da7ce2eb2` · local tag count `32` · `VERSION 0.2.1` ·
`git status --porcelain` for my surface = `M bin/release.mjs`, `M test/prove-red.sh`,
`?? test/release-summary.test.js`.

**Every reproduction ran against a throwaway clone with a LOCAL BARE origin.** Nothing was ever pushed
to `flashist/fkit`; no tag was created, pushed or deleted on the real origin. The seal is structural,
not intentional: `release.mjs` derives `KIT` as `resolve(__dirname, "..")`, so the copy under
`<fixture>/bin/` operates on the fixture, and `makeFixture()` **asserts** `git remote get-url origin`
resolves inside its own tmp dir before doing anything.

---

## What was measured, in build order

1. **N1 reproduced by execution first** (brief step 12.2) — it was the one finding that was
   source-confirmed but never run. It reproduced exactly: `main` pushed, tag never pushed, **nothing
   said about it**, printed check exits **2** silently. Post-state proved it: `origin/main` = HEAD,
   `git ls-remote --tags origin v0.1.0` empty.
2. **R1 reproduced on all three variants**, including `--no-tag` **alone** — the publishing case: it
   moved `origin/main` and still printed a verify for a tag it declined to create (exit 2).
3. **R2 reproduced** — printed check exits **0** while the tag peels to a commit that is not what the
   run pushed.
4. **R5 re-measured** — `0` / `2` / `128`, distinct; `128` prints its own `fatal:`. ⛔ The codes were
   never ambiguous; the defect is the **silence of the exit-2 case** alone, and only that was fixed.
5. **The plan's git measurements re-measured on the fixture** — a pattern arg suppresses the peeled
   line, so the peel must be asked for as `refs/tags/<tag>^{}`; that form returns the peeled commit,
   exit 0.

---

## Decision log — every call made without asking

The loop's standing approval covers a fix only when it is verified `CORRECT`, mechanical/localized and
**inside the approved plan**, or an obvious winner within the plan's intent. Six calls qualified.
**None was a frontier-move, a scope widening, or a behaviour change outside the plan.**

### D1 — `tagOnOrigin` made load-bearing; the last three branches reordered
- **Answers:** the plan's own **mutation 19**, which targets `tagOnOrigin`.
- **What changed:** the plan's literal branch order (`tagCreated` → `remoteTagExists` → `else`) never
  used `tagOnOrigin`, one of the three derived facts the plan declares. It was **dead code**, and a
  mutation against dead code is a **no-op** — prove-red's own guard would have failed the gate.
  Reordered to `!tagOnOrigin` (N1) → `tagCreated` (default) → `else` (R2).
- **Why it qualified:** obvious winner **within the plan's intent** — the plan declares the const and
  specifies the mutation against it. The states are identical and still total, and **the printed
  output of all seven paths is byte-identical either way**; only the order of the last three tests
  changes. Verified `CORRECT` by running all seven paths and all five mutations.

### D2 — one clause added to the R2 branch about lightweight tags
- **Answers:** the plan's own flagged risk (*"if the build finds it confusing, the printed prose gains
  one clause"*) — explicitly authorized latitude.
- **What changed:** added
  `(that peel exits 2 for a lightweight tag; this script only ever makes annotated ones)`.
- **Why it qualified:** in-plan and measured, not assumed — a lightweight tag has no `^{}` ref and the
  peel exits 2 silently; `release.mjs:260` only ever runs `git tag -a`, so this reaches foreign tags
  only.

### D3 — mutation 18 scoped to the summary block (awk), not a plain `sed`
- **Answers:** a real hazard found on disk, not predicted by the plan.
- **What changed:** `} else if (!doTag) {` occurs **twice** in `bin/release.mjs` — once in the
  **execute** section (the skip-tag step) and once in the summary. A plain `sed` hits the execute one,
  mutating the tag logic this task is **fenced away from** and proving nothing about the summary. The
  awk arms only after the `// --- summary ---` marker, and a post-condition asserts the mutant retains
  exactly one `} else if (!doTag) {`.
- **Why it qualified:** mechanical and localized; it implements the plan's stated mutation correctly
  rather than changing it.

### D4 — mutations 19/20/21 use getline-from-file, not `sed`
- **Answers:** this file's own documented **mutation-14 rule**.
- **What changed:** mutation 19's replacement contains `&&`, and in a `sed` replacement `&` means *the
  whole match* — a sed would splice the line into itself, producing a syntax error rather than a
  mutant: every test reds, the named-assertion grep still passes, and the gate reports a broken file as
  a successful catch. 20 and 21 carry backticks, `${tag}`, `^{}` and quotes with the same exposure.
- **Why it qualified:** mechanical, and it follows a convention the file already states in its header.

### D5 — the recursion-seal comment written from measurement, correcting the plan
- **Answers:** the plan's claim that omitting `--no-test` would recurse **unboundedly**.
- **What changed:** ⚠️ **Measured, and the plan's claim does not hold for this fixture shape:** the
  fixture's `package.json` has no `test` script, so `npm test` there **aborts** —
  `npm error Missing script: "test"`, `release.mjs` exits **1**. The `--no-test` assertion is **kept**
  (cost: one line; it is genuinely load-bearing for any future fixture copying a real `package.json`),
  but its comment now records the measurement instead of repeating the unmeasured claim.
- **Why it qualified:** reporting faithfully is not a design change; the seal itself is unchanged.

### D6 — mutation 22's double red documented rather than engineered away
- **What changed:** mutation 22 reds **both** `0288/default-released` and `0288/failure-speaks`.
  `0288/failure-speaks` executes the command the **default path** printed, so a mutation that stops the
  default path printing it necessarily takes both. Recorded in both files rather than papered over.
- **Why it qualified:** the gate's contract is *reds its NAMED assertion*, which holds. Mutations 18–21
  each leave `0288/default-released` green — that isolation was **measured**, and is itself evidence
  the default branch is independent of the four fixes.

**Obvious-winner calls beyond the above: none. Fixes applied outside the approved plan: none.**

---

## Step-5 justification — the default path's printed output DID change

The brief's Context ⛔ (*"any remedy that changes what the default path prints … has failed"*) and its
verification step 5 (*"if the default output changed at all, say so out loud and justify it"*) cannot
both hold once R5 is answered where a real release cut runs. **The owner ruled step 5 governs**
(2026-08-14, verbatim label *"(A) Fix R5 on the default path too (Recommended)"*). So, out loud:

- **The headline is byte-identical**: `✓ Released v0.1.1`.
- **The verify command's success behaviour is byte-identical**: git prints the sha and exits **0**; the
  `||` group never runs. Executed and confirmed in the fixture.
- **What changed** is a failure branch appended to the printed command:
  `|| { echo "✗ <tag> not confirmed on origin (git exit $?)"; false; }`. The line is longer.
- **Exit-status semantics change on failure only**: today `2` / `128`, now `1` in both cases — with
  **git's real code printed in the message** and git's own `fatal:` still on stderr. Information is
  **relocated from `$?` to the visible output**, not lost, and `$?` stays usable as pass/fail. ⛔ This
  does **not** presume the codes were ambiguous; they are distinct and are printed as such.

**Why that is correct under the ruling:** R5 is *"the failing case must not be silent"*, and the
default path is the only path most maintainers ever paste. Answering R5 anywhere else would leave it
unanswered where it matters.

---

## Residuals and what is NOT covered — say these in the close

1. **N1's recovery gap is ACCEPTED, NOT FIXED** (owner-ruled 2026-08-13, *"Report truthfully only —
   stay inside the fence"*). After `0288`, `--no-bump` **still cannot finish** a release whose tag is
   local-only — it **stops lying about it** and prints the by-hand `git push origin <tag>`. ⛔ Do not
   report N1 as *"recovery restored"*. `0288/local-only-tag` asserts the tag is **still absent from
   origin** afterwards: the fence, tested.
2. **`bin/release.mjs:12-14` still claims a `--no-bump` run is "idempotent", and that overstates it.**
   Skipping tag *creation* is idempotent; skipping the tag *push* is not — it leaves the release
   unfinished. ⛔ The header comment was deliberately **not** rewritten (out of scope: the task owns the
   summary block). The summary now contradicts the header truthfully at runtime; the comment remains
   overstated.
3. **Brief step 11, satisfied by naming rather than deleted.** The **pre-existing** suite still says
   nothing about this line — a green `npm test` from the tests that already existed is **not** coverage
   of this change. What covers it is the **new** `test/release-summary.test.js` (7 named assertions)
   and prove-red mutations **18–22**, each proven red at its named assertion.
4. **R4 (unquoted `${tag}`) is untouched** — owner-ruled *"Unactioned — pre-existing"*. The pre-existing
   line keeps its unquoted interpolation exactly. The single quotes on the **new** `'refs/tags/…^{}'`
   line are required for the command to run at all (`^` and `{}` are shell-special in zsh) and are
   **not** claimed as a security improvement — a tag containing `'` still breaks out, the same
   pre-existing exposure.
5. **Windows shells are not covered.** The printed commands are POSIX, as they already were.
6. **Lightweight foreign tags**: the printed peel exits 2 for a lightweight tag. `release.mjs` only
   creates annotated tags, so this reaches only a tag someone else made lightweight; the printed line
   now says so in one clause.
7. **Suite runtime cost exceeded the plan's estimate** — see below. Reported, not silently absorbed.

---

## `npm test` — green, and the MEASURED runtime cost

```
node --test test/*.test.js   tests 730   pass 730   fail 0   (duration_ms 152062)
bash test/prove-red.sh       ✓ hard gate PASSED — real + unmutated copy green;
                               each mutation reds its NAMED assertion.
exit 0
```

All five new mutations red at their named assertion; the new baseline `0k` is green.

### ⚠️ The runtime cost is roughly DOUBLE the plan's estimate — measured, both ends

| run | wall clock |
|---|---|
| baseline (pre-`0288` test surface restored: no `release-summary.test.js`, `prove-red.sh` at HEAD) | **10:19.42** |
| after (`0288` coverage in place) | **14:27.93** |
| **delta** | **+4 min 08 s** (~+40%) |

⚠️ **The plan estimated ~+1–2 min and the owner accepted OQ3(A) against that number. The real figure is
about twice it, and that is a fact the owner has not yet seen.** Both ends were measured on this
machine today by restoring the pre-`0288` test surface and re-running; the two runs report different
CPU saturation (121% vs 98%), so a little of the gap is machine noise rather than the change.

**Where the time goes — the plan's cost model missed one multiplier.** The plan counted six extra
release-suite runs (baseline `0k` + five mutants). But `run_suite()` executes
`node --test "$repo"/test/*.test.js` — **all** test files — and it is called four times (`0a`, `0b`,
mutation 2, mutation 15). Adding a test file therefore also lengthens those four runs, plus the main
`node --test` phase. So the new file is executed **eleven** times per `npm test`, not seven.

⛔ **I did not act on this.** Trimming mutations, or narrowing `run_suite`'s glob, would be a scope and
design change outside the approved plan, and OQ3 is the owner's call — they chose "accept all five"
and the correct response to a number that moved is to report it, not to re-decide it.

⚠️ **BOTH absolute numbers are inflated and should not be read as this machine's normal.**
`.github/workflows/test.yml:28` records `npm test` measured locally at **328 / 380 / 347 / 344 s**
(~5m30s–6m20s); my baseline measured **619 s** for the same pre-`0288` surface. **Two concurrent fkit
workers (tasks `0294` and `0292`) were running throughout both measurements**, so the absolute figures
carry their CPU load, and so does the delta. ✅ **The +40% ratio is the more transportable number than
the +4m08s.** Against the workflow's recorded ~350 s, a 40% increase lands near **~490 s**, comfortably
inside its `timeout-minutes: 20` (verified on disk, `:33`). ⛔ **A clean re-measure on an idle machine
is worth doing before anyone treats +4m08s as the real cost.**
