# Plan — task 0302: Enter at the role menu opens the lead

**PLAN ONLY.** `EnterPlanMode` is absent in this spawn, so I held the prose contract instead. **Nothing was written to disk** — no repo file, no scratchpad file. All probes below were read-only or ran in `/tmp` against a stand-in shell script passed inline via `sh -c` (no file created).

---

## 0. The three guarded-file checks, answered first

| Check | Result |
|---|---|
| **Covered by `test/prove-red.sh`'s mutation gate?** | **YES.** `test/prove-red.sh:77` sets `launcher="$repo/claude/fkit-claude.sh"`. Gate **0a** runs the **real** launcher through the whole `node --test test/*.test.js` suite via `FKIT_LAUNCHER` and requires green; **0b** requires an unmutated full copy green; **mutation 2** (`sed 's/^  exit 2$/…/'`, `:384`) and **mutation 15** (`sed 's/^structure_notice || :$/…/'`, `:753`) mutate launcher copies. ⚠️ **No mutation targets the menu** — the brief's precedent claim is confirmed exactly as written. |
| **In `claude/structure-manifest.tsv`?** | **NO.** `grep -niE 'fkit-claude\|launcher\|\.sh'` over the manifest returns **zero hits**. The file has 67 non-comment lines covering **17 unique project paths**, all of them `AGENTS.md`, `CLAUDE.md`, or `ai-agents/**`. The generator `bin/generate-structure-manifest.mjs` walks only `generic/ai-agents`, `omnigent/scaffold/ai-agents`, `claude/scaffold/ai-agents` plus 4 root context files (`HOME_PREFIXES` `:68-72`, `ROOT_FILES` `:74-79`). **The launcher is out of the manifest's scope** → no `npm run generate:manifest`, and `test/structure-manifest.test.js` cannot go stale from this change. |
| **Dual-homed into `claude/scaffold/`?** | **NO.** `claude/scaffold/` contains exactly `AGENTS.md`, `CLAUDE.md`, `universal-rules.md`, `ai-agents/`. `find claude/scaffold -name 'fkit-claude*'` → empty. The dual-home parity surface (`test/dual-home-parity.test.js` + `dual-home-parity-exceptions.mjs:4-5`) is `ai-agents/` ↔ `claude/scaffold/ai-agents/` **only**. prove-red mutations 10/11/12 (dual-home) are untouched by this change. |

**`task 43` numeral check (0306 fence):** `grep -niE '\btask 43\b' claude/fkit-claude.sh` → **zero hits**; `grep -rniE '\btask 43\b' claude/` → **zero hits repo-wide under `claude/`**. `0306` cleaned `claude/` — the launcher header now reads `` `0052` (`implement-pretooluse-skill-ownership-hook`) `` at `claude/fkit-claude.sh:20`. **Neither line I propose to touch carries such a numeral.** The stale numerals that remain are in `test/` (`prove-red.sh:96`, `:277-278`, `:348`; `launcher-contract.test.js` header ×2 and test 9's name) — **0306's out-of-scope residue, reported not repaired.** If step 3B below is ever taken, the new prove-red mutation would sit near `prove-red.sh:348`'s stale numeral — still **do not sweep it**.

---

## 1. Files touched

**One file, two lines:** `/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude.sh`

**No other file.** Justification for each surface the brief told me to check:

- `grep -rn 'role \[1-7' .` (excluding `.claude/`, `.git/`) → **exactly one code hit**: `claude/fkit-claude.sh:615`. Every other hit is a task brief, a board row, or `ai-agents/knowledge-base/reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:73` — **historical records, not to be edited.**
- **No doc is falsified.** `README.md:17` (`fkit  # pick a role from the menu`), `claude/fkit-claude-init.sh:887` (`Start:   fkit            (pick a role from the menu)`), and the launcher header `:7` (`fkit  # menu → pick a role`) all stay true after the change. **Nothing anywhere states that an empty line re-prompts.** → **no doc edit in this change.** (Adding "Enter=lead" to README/header would be *new* copy, not a correction; the owner ruled the signal is the prompt text alone. Not doing it.)
- `claude/fkit-claude-init.sh:884` prints a **role list**, not the prompt — unaffected.
- ⛔ No `claude/skills/`, `claude/agents/`, `bin/`, `ai-agents/wiki-vault/`, no task-file move, no commit.
- ⛔ `ai-agents/knowledge-base/architecture.md:533` (*"…or a real menu on a tty — those edges stay manual"*) — verified on disk, **left untouched**; it is `0145`'s item C.

## 2. The exact change

**(a) Prompt string — `claude/fkit-claude.sh:615`** (anchor on text, not line number):

```sh
-    printf '  role [1-7, q to quit]: '
+    printf '  role [1-7, Enter=lead, q to quit]: '
```

**(b) The empty-input arm — `claude/fkit-claude.sh:626`:**

```sh
-      "")                    : ;;
+      # Enter with no input → lead. This does NOT invent a default: the headless fall-through
+      # below (`[ -n "$role" ] || role="lead"`) has always opened the lead for a no-arg, no-tty
+      # run — this makes the interactive path agree with it. ⛔ EMPTY ONLY: the `*)` arm stays a
+      # usage error, because "empty means lead" must not widen into "anything unmatched means
+      # lead" (the header's `fkit --resume` bug).
+      "")                    role="lead" ;;
```

Column alignment is preserved (`"")` + 20 spaces, matching `1|lead)` etc.). The comment block can be trimmed to 2 lines if the reviewer finds it heavy; the surrounding file's comment density supports 5.

**Deliberate non-changes, stated so they are not read as oversights:**
- The `*)` error text `? "%s" is not one of 1-7.` is **unchanged** — still accurate; a junk token genuinely is not one of 1-7, and the owner ruled the signal is the prompt only.
- The menu list keeps `1) lead …` with **no `(default)` marker** — offered and **declined**.
- `q|Q|quit|exit)` unchanged.
- The EOF branch `IFS= read -r pick <&3 || { echo; exit 0; }` unchanged. ⚠️ **Consequence worth naming: Ctrl-D still exits 0 and opens nothing; only a literal Enter opens the lead.** These are now two different outcomes from what looks like "an empty line", and that difference is the only reliable test discriminator (see §4).
- **Whitespace-only input** (space + Enter) still falls to `*)` and errors — `IFS=` on the `read` preserves the space, so `pick=" "` ≠ `""`. Unchanged behavior, and correct under the scope fence.

**Control-flow trace after the change:** `""` sets `role="lead"` → `while [ -z "$role" ]` exits → `exec 3<&-` → `[ -n "$role" ] || role="lead"` (`:635`, no-op) → lead branch prints `→ lead.` (`:638`) → `exec claude --agent fkit-lead --settings …`. Correct.

## 3. Coverage — the honest answer, plus new evidence the brief did not have

**Ruled baseline (Ruling A, "Ship 0302 standalone, gap named"): ship the change, add no test, state the gap in the close.** That is what I plan for, and step 5 below drafts the required gap statement.

**⚠️ But I ran the empirical confirmation the brief demanded, and it partly refutes the brief's pessimism. Reporting it rather than acting on it.**

Read-only confirmations (all hold as the brief states):
- `grep -rniE 'openpty|node-pty|script -q|/dev/tty|pty' test/` → **nothing outside comments**; the single `/dev/tty` mention is `launcher-contract.test.js:141`, prose. **No test drives the menu today.** ✅
- `package.json` has **no `devDependencies` block at all**; `"test": "node --test test/*.test.js && bash test/prove-red.sh"`. ADR-014 confirmed. ✅
- `test/harness.mjs:90-91`: `runFkit` uses `detached: true`, `stdio: ['ignore', …]` — *"a new session with NO controlling terminal, so the launcher's menu / fresh-tty branches are deterministic."* Must not be changed. ✅
- `launcher-contract.test.js` header: scope is *"the black-box process contract only … NOT shell internals."* ✅

Live probes I ran in `/tmp` (writing no files), against a **stand-in `sh` loop replicating the launcher's `exec 3<&0` / `read -r pick <&3` shape**:

| Probe | Result |
|---|---|
| `script -q /dev/null …` with stdin **inherited** from this spawn | ❌ **`script: tcgetattr/ioctl: Operation not supported on socket`** — BSD `script` dies when its own stdin is not a terminal. The prior art **requires** stdin redirected from a pipe. |
| stdin a pipe, **closed immediately** | ❌ `^D` forwarded; **first read hits EOF**, loop exits 0. **`0145`'s trap 1, reproduced exactly.** |
| pipe **held open**: `{ sleep 1; printf '\n'; sleep 1; printf 'q\n'; sleep 1; } \| script -q /dev/null sh -c '<loop>'` | ✅ **`GOT-EMPTY@1`** then **`GOT-Q@2`** — the launcher's read-loop shape **is drivable from a headless spawn on this machine**. |
| same, junk token | ✅ `GOT-OTHER[zzz]@1` then `GOT-Q@2` |
| `/usr/bin/expect` | present |

**⚠️ Two loud caveats on that evidence — do not read it as "the test is easy":**
1. **I drove a stand-in, not `fkit` itself.** Running the real launcher would either `exec claude` or write `.fkit/settings/<role>.json`, and I am plan-only. So *"the menu is drivable"* is **inferred from an equivalent construct, not observed on the real launcher.** Unverified until the build step does it.
2. **The working recipe depends on fixed `sleep`s** — a timing race, i.e. a flaky test — **and on BSD `script` flag syntax**. Both are precisely `0145`'s stated portability/robustness risks. Making this *responsible* rather than merely *green* means building `0145`'s helper, which the owner ruled out for this task.

**So I do not silently take a third path.** Two branches, and the choice is the owner's (returned as Q1):

- **3A (ruled, planned as baseline):** no test here. Gap named in the close. `0145` adds the `Enter` row later.
- **3B (only if the owner reopens it):** a **single, task-local** pty test — not `0145`'s general helper. Shape: feed `zzz\n` then `\n`, assert (i) stdout contains `? "zzz" is not one of 1-7.` — *proof the pty actually delivered input*, which is the answer to trap 1 — (ii) the junk token did **not** exec, and (iii) the following Enter exec'd `--agent fkit-lead`. Plus a **negative control** feeding deliberately-lost input and asserting no exec. That one test would cover the feature *and* the likeliest regression. ⛔ **Cost, stated:** it duplicates `0145`'s surface, imports the `sleep`/`script` flakiness, would need a new prove-red mutation on the `""` arm to be mutation-proved, and **would falsify `architecture.md:533` — a line this task is forbidden to edit.** That last point is, in my view, decisive against 3B. **I recommend 3A.**

⛔ **Not planned under either branch:** a source-grep assertion that the `""` arm exists. It cannot fail for the reason that matters.

## 4. Verification, mapped to the brief's six steps

| Brief step | Plan |
|---|---|
| **1. Reproduce current behaviour in a real terminal** | ⚠️ **A spawned build worker cannot do this.** I confirmed `tty` → `not a tty` in this spawn; the sprint-loop's build worker is the same kind of spawn. Two substitutes, and **which one counts is an owner call (Q2)**: (a) worker reproduces under `script -q /dev/null` with the pipe held open — a real pty, but not "a real terminal" in the brief's sense; (b) the **owner** runs `fkit`, presses Enter, and confirms the re-prompt in their own terminal, relayed through the driver. **Recommend (a) for the worker's evidence + (b) as the owner's final acceptance.** The brief says *"if you cannot reproduce it, stop and report"* — this plan reports rather than assuming. |
| **2. New behaviour: `fkit`, Enter → lead session** | Same substitute as step 1. Worker quotes the observed prompt line verbatim (expect `  role [1-7, Enter=lead, q to quit]: `) and the `→ lead.` line. |
| **3. Both neighbours hold in the same run** | `q` → exit **0**, `claude` never exec'd (stub argv file absent). Junk `zzz` → stdout carries `? "zzz" is not one of 1-7.`, loop re-prompts, **no exec**. ⚠️ This is the regression the change most plausibly causes; assert it explicitly, not by eyeball. |
| **4. Headless default untouched** | `npm test` (= `node --test test/*.test.js && bash test/prove-red.sh`) must be **fully green**. **Name in the close:** `test/launcher-contract.test.js` **test 7** *"no args, no tty, initiated → --agent fkit-lead"* and **test 3** *"unknown first arg → non-zero, and claude was NEVER exec'd"*. Both are structurally immune here — the menu block's guard `{ [ -t 0 ] || ( exec 3</dev/tty ) 2>/dev/null; }` fails both halves headlessly, so the edited arm is never reached under the suite. |
| **5. Red-prove** | **Under 3A: no test is added, so there is nothing to red-prove — say so explicitly**, and record what was attempted (the four probes above), why it was not turned into a suite test (duplicates `0145`; `sleep`-race; would falsify a line this task may not edit), and what is therefore **unproven**: *the `""` arm's runtime behavior is not exercised by any automated test.* ⛔ Do not present the probes as coverage — they ran against a stand-in, not `fkit`. Under 3B: red-prove both the test **and** the harness (feed lost input; the suite must report "the menu never got the input", not a rejection). |
| **6. `git diff --stat` scope** | Path-scoped, per the ~100-path dirty tree: `git diff --stat -- claude/fkit-claude.sh`. **Expect exactly one file, 2 insertions-ish + comment lines.** Also run `git status --porcelain -- claude/ test/` to prove nothing else under those trees moved. |

## 5. How the mutation gate stays green — the specific argument

1. **Gate 0a (real launcher, whole suite):** the edit is **unreachable headlessly**. `runFkit` spawns `detached: true, stdio: ['ignore', …]` → no controlling terminal → the menu guard's `[ -t 0 ]` is false **and** `( exec 3</dev/tty )` fails → the whole block is skipped. No existing assertion's behavior changes. Proven by running `npm test`.
2. **Gate 0b** (unmutated full copy) — same reasoning; the copy is byte-identical to the edited launcher.
3. **No mutation sed becomes a silent no-op.** I inspected all ten `sed -i` invocations in `prove-red.sh` (`:366, :384, :401, :424, :446, :467, :489, :753, :774, :1021`). The launcher-targeting patterns are `^  exit 2$` (m2) and `^structure_notice || :$` (m15), plus the banner-guard `^      if [ -n "$rver" ] …` (m16). **Neither edited line matches any of them**, and neither edit introduces or removes a line that could newly match. Mutations 2, 15, 16 keep hitting their anchors.
4. **Dual-home mutations 10/11/12 and the manifest suite are out of reach** — the launcher is in neither surface (§0).
5. **Post-change re-run of `bash test/prove-red.sh` on its own** is the proof, not the argument above. Required before reporting done.

⚠️ **Pre-existing weakness, reported not repaired:** **mutation 2 has no `cmp -s` no-op guard** (mutations 15 and 16 do). If a future edit ever moved `  exit 2`, that gate would silently disarm and still print success. Not caused by this change; it is **ADR-026 Decision 5**'s explicitly *"offered and not taken"* hardening, still open. Out of scope here.

## 6. Sequencing for the build spawn

1. Re-anchor on the quoted text (line numbers may have moved), apply (a) and (b).
2. `bash test/prove-red.sh` alone → green.
3. `npm test` → green; capture test 7 and test 3 by name.
4. Menu behaviour pass (Enter / `q` / `zzz`) under the substitute agreed in Q2; capture verbatim output.
5. `git diff --stat -- claude/fkit-claude.sh` + `git status --porcelain -- claude/ test/`.
6. Write `worklog.md` in the task folder, **including its decision log** — every fix applied without asking and every obvious-winner call, with which finding it answers, what changed, and why it qualified. **If none: record `none` explicitly.**
7. Hand to review (`@fkit-reviewer`, stateful, task-id `0302`). ⛔ No commit.

## 7. Required close text (Ruling A's price — a close omitting this has not honoured the ruling)

> **Test gap, stated as the owner accepted it:** `0302` ships the Enter-default with **no automated coverage of the interactive menu**. The change is verified by `npm test` (green, including `launcher-contract` test 7 *"no args, no tty, initiated → --agent fkit-lead"* and test 3 *"unknown first arg → non-zero, and claude was NEVER exec'd"*, both of which pin the **headless** default, **not** the menu) plus a manual/pty pass over Enter, `q`, and a junk token. **The `""` case arm's runtime behavior is exercised by no test.** `0145` — a **soft**, deliberately-not-hard dependency — carries the pty helper that will close this, and must gain an **`Enter` row** in its assertion table.

## 8. Risks / edge cases not already covered above

- **The likeliest regression is scope creep on the `*)` arm.** Guarded by the comment in (b) and by verification step 3.
- **Accidental Enter now costs a session launch.** Owner-ruled acceptable (cheap, non-destructive; exit and re-run).
- **`0145`'s two-way obligation** (its assertion table gains an `Enter` row) is an edit to **another task's brief** — a producer artifact. **I do not plan to make it.** Route to `@fkit-producer` (Q3).
- **`architecture.md:533`** stays untouched under 3A, so no stale-citation class is created. Under 3B it *would* be falsified — see §3.

## Open questions returned with the plan

**Q1 — Coverage branch. Recommend 3A (the ruled path).** New evidence this spawn: the launcher's read-loop shape **is** drivable from a headless spawn via `script -q /dev/null` with the pipe held open (`GOT-EMPTY@1`, `GOT-Q@2`), and trap 1 is distinguishable. This does not re-open Ruling A's *"ship now vs wait for 0145"* — it surfaces a **new fourth option** the ruling did not weigh: a single **task-local** pty test rather than `0145`'s general helper. **Options:** (A) ship with no test, gap named — *the ruled path; recommended, because 3B would falsify `architecture.md:533`, a line this task is forbidden to edit, and imports a `sleep`-timing race*; (B) add the one task-local pty test + a matching prove-red mutation, accepting duplication with `0145` and the frozen-`architecture.md` conflict. **Caveat on my own evidence:** I drove a stand-in `sh` loop, **not the real launcher** — the drivability claim is inferred, not observed on `fkit`.

**Q2 — Who performs verification steps 1–3?** A spawned build worker has **no tty** (confirmed: `tty` → `not a tty` here), so it cannot do the brief's *"in a real terminal"* pass, and the brief says to stop and report if the current behaviour cannot be reproduced. **Options:** (A) worker reproduces under a `script`-allocated pty and the **owner** does the real-terminal acceptance pass in their own shell — *recommended*; (B) the owner does all of steps 1–3 and the worker ships on `npm test` alone; (C) treat this as blocking and defer 0302 until an owner terminal is available. Recommend (A).

**Q3 — Who adds the `Enter` row to `0145`'s assertion table?** The brief makes it mandatory *"whichever is chosen"*, but it edits another task's brief — a producer artifact, and I hold no task-file authority (ADR-033). **Options:** (A) route to `@fkit-producer` as a follow-up in the same sprint — *recommended*; (B) the coder edits `0145`'s brief content directly (moves nothing, but writes a producer artifact); (C) defer to whenever `0145` is picked up. Recommend (A).

---

## Owner approval record (driver-appended, 2026-08-21)

Approved by the owner via `AskUserQuestion` in the live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-21. Verbatim option labels:

- Plan + coverage branch: **"Approve on 3A (Recommended)"** — ship the two-line change with **no test**; §7's gap statement goes into the close **verbatim**. ⛔ Do NOT take branch 3B, do NOT add a pty test, do NOT add a prove-red mutation, and do NOT edit `ai-agents/knowledge-base/architecture.md`.
- Q2 (who verifies steps 1–3): **"Worker via pty + you accept (Recommended)"** — the build worker reproduces under a `script`-allocated pty and quotes the observed output verbatim; the **owner** then performs the real-terminal acceptance pass in their own shell and the driver relays the result into the close. ⚠️ The worker's pty pass is **evidence, not acceptance** — it must not be reported as "verified in a real terminal".
- Q3 (the `0145` row): **"Route to a producer now (Recommended)"** — the driver spawns `@fkit-producer` to add the `Enter` row to `0145`'s assertion table in this same sprint. ⛔ The coder does **not** edit `0145`'s brief.

Transport note: the plan text above was returned by the plan worker through a task-notification channel that HTML-escapes `<`, `>` and `&`; the driver restored those characters (`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`) when copying. No other transformation was applied.
