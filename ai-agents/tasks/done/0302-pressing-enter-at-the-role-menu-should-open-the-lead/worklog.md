# Worklog — 0302: Pressing Enter at the role menu should open the lead

**Role:** fkit-coder, spawned as the Build worker of `/fkit-sprint-ship-loop`.
**Date:** 2026-08-21
**Baseline:** `HEAD = 7832cba Fix of the broken build` — CI green on it: `gh run list` →
`success · push · main · "Fix of the broken build" · run id 32486696995 · 2026-08-21T13:24:44Z`.
(Cited rather than asserted, and worth citing: the *immediately preceding* push run,
`32482230515` "Sprint push", is `failure` — green was not a safe default to assume here.
Round-1 review **R4**.)
**Plan:** `plan.md` in this folder, approved by the owner via `AskUserQuestion` in the driver session
(option label verbatim: **"Approve on 3A (Recommended)"**). Nothing outside that plan was touched.

---

## 1. What changed

**One file, two edits — `claude/fkit-claude.sh`.** Re-anchored on quoted text, not line numbers (the
tree moved after the owner's commit).

```diff
   while [ -z "$role" ]; do
-    printf '  role [1-7, q to quit]: '
+    printf '  role [1-7, Enter=lead, q to quit]: '
     IFS= read -r pick <&3 || { echo; exit 0; }
```

```diff
       q|Q|quit|exit)         echo; exit 0 ;;
-      "")                    : ;;
+      # Enter with no input → lead. This does NOT invent a default: the headless fall-through
+      # below (`[ -n "$role" ] || role="lead"`) has always opened the lead for a no-arg, no-tty
+      # run — this makes the interactive path agree with it. ⛔ EMPTY ONLY: the `*)` arm stays a
+      # usage error, because "empty means lead" must not widen into "anything unmatched means
+      # lead" (the header's `fkit --resume` bug).
+      "")                    role="lead" ;;
       *)                     printf '  ? "%s" is not one of 1-7.\n' "$pick" ;;
```

**Nothing else.** Per the approved plan and the owner's rulings: no test added, no prove-red mutation
added, no edit to `ai-agents/knowledge-base/architecture.md`, no edit to `0145`'s brief, no
`npm run generate:manifest`, no touch of `claude/structure-manifest.tsv`, nothing under `test/`, no
commit, no push, no task-file move, no `## Status` change, no wiki write.

---

## 2. Verification, mapped to the brief's six steps

All commands run from the repo root. Raw output quoted.

### Environment note — how the pty pass was made safe

A spawned worker has no tty (`tty` → `not a tty`). The pty passes below used
`script -q /dev/null` with **the input pipe held open by `sleep`s**, driving the **real launcher**
(`claude/fkit-claude.sh`) inside a **throwaway scratch project** (`$PWD` = a temp dir, and the
launcher sets `proj="$PWD"`), with `claude`, `codex` and `curl` **stubbed on `PATH`** exactly as
`test/harness.mjs` stubs them. So:

- Nothing exec'd the real `claude`; the stub records its argv to `$FKIT_STUB_ARGV_FILE`.
- No `.fkit/settings/` was written inside this repo — it landed in the scratch project.
- `curl` was stubbed to a no-op, so the run was network-free.

⚠️ **Guard against the plan's trap 1** (pipe closes early → first read hits EOF → loop exits 0, a
vacuous green).

⚠️ **Corrected in round 1 (review R1).** The original wording here read *"Every pass below shows
`? "zzz" is not one of 1-7.` on stdout"* — **that is false**, and it misdescribed how the
load-bearing pass was kept honest. What the evidence below actually shows is **two different
guards**, only one of which is the junk-token assertion:

- **Steps 1 and 3 carry the junk-token discriminator.** `? "zzz" is not one of 1-7.` on stdout is
  reachable only if the pty actually delivered input, so neither of those runs is vacuous.
- **Step 2 — the only pass that demonstrates `Enter → lead` — carries NO junk token.** Its
  non-vacuity rests on a different fact: it records an **exec** of the stubbed `claude`, and an
  EOF-driven run cannot produce one. The read is `IFS= read -r pick <&3 || { echo; exit 0; }`, so a
  pipe that closes early exits 0 *before* any role is chosen. An exec therefore proves input
  arrived.

**Trap 1 did not fire in any pass** — but the guard that covered Step 2 was the recorded exec, not
the discriminator the original sentence named. Stated without overclaim: Step 2 is non-vacuous, and
it is non-vacuous for a reason this worklog originally got wrong. The reviewer independently re-ran
the Enter case with the discriminator present **in the same run** (see `review.md`, "Independent
verification performed by the reviewer") and it held there too.

---

### Step 1 — Reproduce the current behaviour

Run **before** the edits, feeding Enter, then `zzz`, then `q`:

```
launcher-pipeline-rc=0
--- argv file present? ---
NO — claude was never exec'd
=== stdout captured (cat -v) ===
  role [1-7, q to quit]: ^M
  role [1-7, q to quit]: zzz^M
  ? "zzz" is not one of 1-7.^M
  role [1-7, q to quit]: q^M
```

**Reproduced exactly as the brief describes:** Enter produced a bare re-prompt (second prompt line,
no output between), the junk token errored, `q` exited, `claude` was never exec'd.

### Step 2 — New behaviour: `fkit`, Enter → lead session

Same recipe, run **after** the edits:

```
launcher-pipeline-rc=0
--- argv file present? ---
YES — claude exec'd with argv:
--agent
fkit-lead
--settings
.fkit/settings/lead.json
=== stdout captured (cat -v) ===
  role [1-7, Enter=lead, q to quit]: ^M
^M
  �M-^FM-^R lead. It routes and answers wiki questions, and can drive the team (spawn and sequence roles) when you hand it a goal.^M
^M
^[]0;fkit · lead ^G[stub claude exec'd]^M
```

(`�M-^FM-^R` is `cat -v`'s rendering of the `→` arrow; `^[]0;…^G` is the tab-title escape.)

Prompt line observed verbatim: `  role [1-7, Enter=lead, q to quit]: `.
Enter alone exec'd `claude --agent fkit-lead --settings .fkit/settings/lead.json`.

### Step 3 — Both neighbours hold, after the change

Enter now ends the loop by exec'ing, so the neighbours were driven in a **separate after-run** feeding
`zzz` then `q` (no Enter):

```
pipeline-rc=0
claude was NEVER exec'd  <-- expected
=== stdout (cat -v) ===
  role [1-7, Enter=lead, q to quit]: zzz^M
  ? "zzz" is not one of 1-7.^M
  role [1-7, Enter=lead, q to quit]: q^M
```

- Junk `zzz` → `? "zzz" is not one of 1-7.`, loop re-prompted, **no exec**. The `*)` arm did **not**
  widen — this is the regression the change most plausibly causes, and it did not occur.
- `q` → exit **0**, `claude` never exec'd.
- Exit-code fidelity of the harness was itself checked, so `rc=0` is not vacuous:
  `printf '' | script -q /dev/null sh -c 'exit 7'` → `got=7  (expect 7)`.

### Step 4 — Headless default untouched

`npm test` (= `node --test test/*.test.js && bash test/prove-red.sh`), full output to a file:

```
EXIT=0
ℹ tests 730
ℹ suites 17
ℹ pass 730
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 58524.875292
```

Named, per the plan:

```
✔ 3. unknown first arg → non-zero, and claude was NEVER exec'd (9.1015ms)
✔ 7. no args, no tty, initiated → --agent fkit-lead (568.456666ms)
```

Both pin the **headless** default, not the menu (see §3).

### Step 5 — Red-prove

`bash test/prove-red.sh` alone, **before** the full suite:

```
EXIT=0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

All 22 mutations reported `red`; gates `0a`–`0k` reported `green`. The plan's argument that the two
edited lines match no mutation `sed` anchor (`^  exit 2$`, `^structure_notice || :$`,
`^      if [ -n "$rver" ] …`) held in practice.

**No test was added, so there is nothing to red-prove — stated explicitly, per the ruling.** What was
attempted and why it was not turned into a suite test is recorded in the plan §3: it duplicates
`0145`'s surface, depends on fixed `sleep`s (a timing race), and branch 3B would falsify
`ai-agents/knowledge-base/architecture.md:533`, a line this task is forbidden to edit. ⛔ The pty
passes above are **evidence, not coverage** — they are one-shot manual runs, not assertions any CI
run will ever repeat.

### Step 6 — `git diff` scope

```
=== git diff --stat -- claude/fkit-claude.sh ===
 claude/fkit-claude.sh | 9 +++++++--
 1 file changed, 7 insertions(+), 2 deletions(-)
=== git status --porcelain -- claude/ test/ ===
 M claude/fkit-claude.sh
```

Exactly one file under `claude/` and **nothing at all under `test/`**. `sh -n claude/fkit-claude.sh`
→ syntax OK.

---

### Step 7 — Round-1 re-verification, AFTER the R2/R3 comment edit

⚠️ **Steps 1–6 above were captured during the build step, i.e. BEFORE round 1's R2/R3 reworded the
menu comment.** They are therefore not evidence about the current tree on their own. Re-run after the
edit, so the record matches what is on disk:

- `sh -n claude/fkit-claude.sh` → **syntax OK**.
- **`bash test/prove-red.sh` alone** (run on its own first, before the full suite, because the edited
  file is the mutation gate's own subject):

  ```
  ✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
  EXIT=0
  ```

  **All 22 mutations `red` at their named assertions; all 11 gates `0a`–`0k` `green`.** The point of
  running it alone: a comment edit inside the launcher must not turn any mutation into a **silent
  no-op**. It did not — in particular **mutation 2** (`sed 's/^  exit 2$/…/'`, the launcher's argv
  guard, the one mutation with *no* `cmp -s` no-op guard) still reports `red`, so its `sed` still
  found its anchor.
- **`npm test`** (full), output to a file:

  ```
  EXIT=0
  ℹ tests 730   ℹ suites 17   ℹ pass 730
  ℹ fail 0      ℹ cancelled 0 ℹ skipped 0   ℹ todo 0
  ```

  Both headless pins still named and passing:

  ```
  ✔ 3. unknown first arg → non-zero, and claude was NEVER exec'd (8.287708ms)
  ✔ 7. no args, no tty, initiated → --agent fkit-lead (549.166583ms)
  ```

- Scope unchanged: `git status --porcelain -- claude/ test/` → **`M claude/fkit-claude.sh` only**,
  `test/` still untouched. `plan.md` verified byte-identical to the approved blob
  (`git hash-object` → `7b4effefb44cb3d91b7fc7febd901889689016cf`, 20588 bytes) — **not re-authored**.
- ⛔ The executable lines are **byte-unchanged** by round 1: `"") role="lead" ;;` (now `:632`) and
  `*) printf … ;;` (now `:633`). Only comment text moved, which is why the counts above are identical
  to the build step's. **No pty run was repeated, and none is claimed** — see §4.

---

## 3. Test gap, stated as the owner accepted it (plan §7, verbatim)

> **Test gap, stated as the owner accepted it:** `0302` ships the Enter-default with **no automated coverage of the interactive menu**. The change is verified by `npm test` (green, including `launcher-contract` test 7 *"no args, no tty, initiated → --agent fkit-lead"* and test 3 *"unknown first arg → non-zero, and claude was NEVER exec'd"*, both of which pin the **headless** default, **not** the menu) plus a manual/pty pass over Enter, `q`, and a junk token. **The `""` case arm's runtime behavior is exercised by no test.** `0145` — a **soft**, deliberately-not-hard dependency — carries the pty helper that will close this, and must gain an **`Enter` row** in its assertion table.

---

## 4. Not verified — read this before treating the above as acceptance

- ⚠️ **The pty pass is EVIDENCE, not acceptance — this has not changed.** It ran under a
  `script`-allocated pty in a headless spawn — **not** in a real terminal. **No pty run in this
  document may be read as a real-terminal verification**; plan §4 is explicit that these are
  different things. The reviewer's independent `pty.openpty()` run (`review.md`) is the same kind of
  evidence and carries the same limit.
  **✅ The real-terminal acceptance pass is now DONE, and it is the owner's, not this worker's.**
  Per the owner's Q2 ruling ("Worker via pty + you accept"), the **owner** ran `fkit` in their own
  terminal on **2026-08-21** and confirmed it — verbatim option label **"Opened the lead — works"**,
  relayed through the driver session. That discharges the outstanding item both this worklog and the
  round-1 review flagged. Attribution matters here: the acceptance is the owner's real terminal; the
  pty runs remain evidence only.
- **`plan.md`'s blob hash was not checked by any hook** — no carry-check hook exists until `0204`
  lands. The plan was taken as given from the driver's prompt.
- **Ctrl-D still exits 0 and opens nothing** (the `read` EOF branch is unchanged). Only a literal
  Enter opens the lead. Deliberate, and named in plan §2.
- **Whitespace-only input** (space + Enter) still falls to `*)` and errors, because `IFS=` preserves
  the space. Unchanged behaviour; not re-tested here.
- **Pre-existing weakness, reported not repaired:** prove-red **mutation 2 has no `cmp -s` no-op
  guard** (mutations 15 and 16 do). Not caused by this change; it is ADR-026 Decision 5's
  "offered and not taken" hardening, still open. Out of scope.
- **Stale `task 43` numerals under `test/`** are `0306`'s out-of-scope residue — reported, not
  repaired, and deliberately not swept. ⚠️ **Corrected in round 1 (review R5): the inventory
  originally given here (`prove-red.sh:96, :277-278, :348`; `launcher-contract.test.js` header ×2
  and test 9's name) was incomplete and one anchor was off by one.** Rather than hand off another
  hand-typed list, here is **the command that regenerates it**, so a later sweep works from a
  measurement and not from this document:

  ```sh
  grep -rniE '\btask 43\b' test/
  ```

  ⚠️ **Every count below is `-i` (case-insensitive), matching the command above.** The
  case-**sensitive** variant (`grep -rnE '\btask 43\b' test/`) yields **23**, because each fixture
  carries one `Task 43` with a capital T. Stating the variant is the point: the round-1 correction
  itself shipped a wrong total by mixing the two, so **no figure here is quotable without its
  command.**

  Measured at this baseline (`HEAD = 7832cba`, `test/` untouched by this change) — **25 hits in 5
  files** (`-i`; 23 case-sensitive), in two materially different classes. **9 + 16 = 25**:

  **(a) Live comments/test names — genuinely stale, sweepable by `0306`'s successor — 9 hits, same
  under both variants:**
  - `test/prove-red.sh:25`, `:96`, `:278`, `:347`
  - `test/launcher-contract.test.js:10`, `:13`, `:152`, `:225`
  - `test/skill-ownership-hook.test.js:1`

  **(b) ⛔ Frozen replay fixtures — MUST NOT be swept — 16 hits `-i` (8 per file; 14 / 7 per file
  case-sensitive):** `test/fixtures/closed-rank-0174-before.md` and
  `test/fixtures/closed-rank-0174-after.md`. **The binding reason is a contract, not a test
  outcome:** `test/closed-rank-immutability.test.js:25-31` declares both files **"byte-exact
  copies"** of two named commits (`ba36196…` parent-of-filing, `8540d03…` the 0174 filing) and
  states *"Provenance lives HERE, never inside the fixture bytes"* — so **editing a numeral
  falsifies that declaration even where no assertion trips.** "It would break the suite" is the
  weaker claim and is not reliably true. They are a historical snapshot of a board, so the old
  numeral is *correct content* there, not drift.

  Two corrections against the original list, both now measured rather than inherited: `:348` is
  actually **`:347`**, and `:277-278` is a single hit at **`:278`**. Three sites were **omitted**
  entirely — `prove-red.sh:25`, `launcher-contract.test.js:152`, and `skill-ownership-hook.test.js:1`
  — plus the whole fixture class. ⚠️ Note for the record: the round-1 review's own replacement list
  named only `prove-red.sh` and `launcher-contract.test.js`; re-measuring here found
  `skill-ownership-hook.test.js:1` and the fixtures on top of it. **Neither list was copied.**

  ⚠️ **Round-2 correction (2026-08-21).** The anchors and the two classes above survived
  re-measurement unchanged, but **the totals in this section were themselves wrong** and are
  corrected here: the section previously claimed **14 hits in 5 files** with **"5 hits"** for the
  fixtures, while asserting **8 per file case-insensitively** in the same breath — two totals that
  cannot both hold under the one command cited. No grep variant yields 14. Re-measured at the same
  `HEAD = 7832cba` with `test/` clean: **25 `-i` / 23 case-sensitive**. The figures were **not
  copied from the correcting report either** — they were re-derived, which is how the disagreement
  was found. See §5.

---

## 5. Decision log

### Build step (2026-08-21) — **none.**

No fix was applied without asking, and no obvious-winner call was made. The approved plan named both
edits at the character level and the owner's three rulings closed every open question in advance
(Q1 "Approve on 3A", Q2 "Worker via pty + you accept", Q3 "Route to a producer now"), so no judgment
call arose inside this build step. Nothing was decided unattended.

### Documentation correction (2026-08-21) — §4 `task 43` inventory totals.

**Owner ruling, live via `AskUserQuestion`, relayed by the driver — verbatim option label: "Correct
it before closing (Recommended)".** Not an unattended call; recorded here for audit.

- **What it answers.** Round-1 review finding **R5** (inaccurate hand-off inventory). R5's fix
  repaired the *anchors* but shipped *wrong totals*, and the same wrong figure reached the review
  ledger.
- **What changed.** `worklog.md` §4 only. `14 hits in 5 files` → **`25` (`-i`) / `23`
  (case-sensitive)**; the fixtures' `5 hits` → **`16` `-i` / `14` case-sensitive** (8 / 7 per file).
  Added an explicit statement of **which grep variant every figure belongs to** and the arithmetic
  check **9 + 16 = 25**, since the unstated variant is what produced the contradiction. Also
  restated the fixtures' do-not-sweep reason as the **"byte-exact copies" + "Provenance lives HERE"
  contract** (`test/closed-rank-immutability.test.js:25-31`) rather than "it breaks the suite",
  which is the weaker and not-reliably-true claim.
- **What did NOT change.** The anchors and the (a)/(b) classification — both confirmed correct on
  re-measurement. Nothing under `test/`: the numerals stay **reported-only**, `0306`'s residue.
- **Method.** Re-derived, not copied: `grep -rniE '\btask 43\b' test/` and its case-sensitive twin
  run at `HEAD = 7832cba` with `test/` clean (`git status --porcelain test/` empty). Occurrence
  counts (`-o`) equal line counts, so "hits" and "lines" agree here.
- **Not run:** `npm test`. No code changed, so a suite result would be noise, not evidence.
- **Left for the reviewer:** `review.md` carries the same wrong `14` figure in its R5 line. That
  ledger is the reviewer's and is closed out — **not edited here**; flagged for a reviewer pass.

### Round-1 review-processing step (2026-08-21, fkit-coder spawned as the Process-review worker)

**Standing approval:** the owner dispositioned round 1 live via `AskUserQuestion` in the driver
session — **R1–R5 "Fix all five now (Recommended)"**, **R6 "Accept as a residual (Recommended)"**,
**Ctrl-D asymmetry "Accept as a residual (Recommended)"**. So the five fixes below were **explicitly
owner-approved as a batch**, not applied unattended. Logged anyway, per ADR-019's audit obligation,
so a wrong fix is findable afterwards.

| # | Finding answered | What changed | Why it qualified |
|---|---|---|---|
| 1 | **R2** (`*)` arm miscalled "a usage error") | `claude/fkit-claude.sh` menu comment: *"the `*)` arm stays a usage error"* → *"the `*)` arm still rejects and re-prompts"* | Owner-approved; verified `CORRECT` on disk (`:632` `printf`s and the `while` loop continues — no exit, status unchanged; the real `exit 2` usage error is the argv guard at `:237-242`). Mechanical, localized, in-plan — comment text only, no behaviour touched. |
| 2 | **R3** ("has always opened the lead" overbroad) | Same comment: qualified with *"for an already-initiated project"* + a new parenthetical naming the uninitiated→producer interception | Owner-approved; verified `CORRECT` on disk (`:573-585` sets `role="producer"` and `exec`s `--agent fkit-producer` with **no tty gate**, ahead of both the menu at `:597` and the fall-through at `:640`). The comment's original *argument* survives — that branch precedes both paths equally — so this is wording, not a reversal. |
| 3 | **R1** (false "every pass shows the junk token") | `worklog.md` §2 trap-1 guard note rewritten to state two distinct guards: discriminator for Steps 1 and 3, recorded **exec** for Step 2 | Owner-approved; verified `CORRECT` by re-reading the transcripts in this file — Step 2 (`Enter → lead`, the load-bearing pass) contains no `zzz` and no error line. ⛔ Fixed **by correcting the claim, not by re-running to manufacture the missing token**, per the disposition. Deliberately not overstated in the other direction: the corrected text claims only that an EOF run cannot exec. |
| 4 | **R4** (unsourced "CI green on it") | `worklog.md:5` now cites `gh run list` → run id **32486696995**, `success`, and names the failing predecessor `32482230515` | Owner-approved; re-verified this turn by running `gh run list` myself rather than inheriting the reviewer's quote. Citation hygiene, zero behaviour. |
| 5 | **R5** (stale-numeral inventory incomplete / off by one) | `worklog.md` §4 inventory replaced with the regenerating `grep` **plus** a freshly measured, two-class list | Owner-approved. ⚠️ **Re-measured, not inherited** — see the three obvious-winner calls below, which is where the judgment actually sat. |

**Obvious-winner calls (within the dispositions' intent, no owner ask):**

1. **R5 fixed by grep + measurement, not by a retyped list.** The reviewer offered either *"correct
   the anchors"* **or** *"replace them with the grep that regenerates them"*. Took both. One
   dominates: a hand-typed inventory is the exact artefact that just failed twice, so shipping a
   third one without the command that regenerates it would reproduce the defect.
2. **R5's fixture class named as ⛔ do-not-sweep.** Re-measuring surfaced
   `test/fixtures/closed-rank-0174-{before,after}.md` in the hit set. Verified they are consumed as
   **byte-exact** replay fixtures (`test/closed-rank-immutability.test.js:25`, `:548-549`,
   `:566-567`), so a future sweep editing them would break that suite. Recording the distinction is
   strictly safer than recording a flat count; it changes no file under `test/`.
3. **⚠️ The round-1 review's own replacement list is itself incomplete — reported, not silently
   adopted.** The review named `prove-red.sh:25,:96,:278,:347` and
   `launcher-contract.test.js:10,:13,:152,:225`. My independent measurement confirms all eight **and
   finds `test/skill-ownership-hook.test.js:1` on top of them**, plus the fixture class. The worklog
   now records the superset. This is a correction *to the reviewer*, surfaced rather than actioned
   against `test/`.

⛔ **Deliberately NOT done, per the dispositions:** R6 not fixed and the `""` arm not widened
(owner: accept as residual); the Ctrl-D/Enter asymmetry **not** added to the launcher comment (that
option was offered and not selected); no `test/` file touched, so the `task 43` numerals stay
reported-only; no behaviour change, no test added, no commit, no push, no task-file move, no
`## Status` change; `plan.md` not re-authored.

---

## 6. Follow-ups owned elsewhere (not done here, by ruling)

- **`0145` gains an `Enter` row** in its assertion table — routed to `@fkit-producer` by the driver
  (owner ruling Q3). ⛔ Not edited by this worker.
- **Owner's real-terminal acceptance pass** — ✅ **DONE, 2026-08-21, by the owner.** Verbatim option
  label: **"Opened the lead — works"**, relayed through the driver session. No longer outstanding.
