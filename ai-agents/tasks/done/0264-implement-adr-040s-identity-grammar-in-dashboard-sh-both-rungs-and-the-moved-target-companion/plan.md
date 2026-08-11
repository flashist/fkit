# Implementation plan — task `0264`

## 0. Preflight, measured this session (2026-08-11)

| Check | Result |
|---|---|
| ADR-040 `- **Status:**` line | **`accepted`** (`adr-040-…md:3`) — the brief's precondition is satisfied. **Restate this in `worklog.md` (verification step 1).** |
| `node --test test/dashboard-contract.test.js` | 117 / 116 pass / **1 fail**, the failure at `test/dashboard-contract.test.js:736` — `0259`'s T1 case. Matches the driver's baseline exactly. |
| `npm test` | red (same single failure) + `prove-red.sh` `✗ hard gate FAILED` at gates `0a`, `0b`, `0i` — all one root cause: each runs a scope containing the intended red. **No prove-red edit is needed; those three go green the moment T1 goes green.** |
| Repo's own boards | `sprints/sprint-5.md`, `sprints/done/sprint-1..4.md` all have `# Sprint N — …` on **line 1**; `sprints/backlog.md` has `# Backlog — …`. No plan in this repo has a `^# Sprint` heading anywhere but line 1. |
| Function-definition region of `dashboard.sh` | `die()` at `:47`; next function `extract_rows()` at `:155`. The identity ladder sits at `:83-108`, **between** them — so the new helper functions can be defined immediately above the ladder without reordering anything. |
| prove-red mutation 14 | keys its awk on the literal prefix `/moved_target=\$\(printf/`. **Binding constraint: do not reword that prefix** or mutation 14 silently disarms (the script's own no-op guard would catch it, but do not rely on that). |

---

## 1. Design — one grammar, composed, reused everywhere

ADR-040's Consequences make "exactly one implementation of this grammar in `dashboard.sh`, reused by every rung" **binding**. The shared thing is the *number+suffix* production, because rung 1 needs the literal token `Sprint <N>` and rung 2 needs the stem form `sprint-<N>`.

Define **two constants**, one composed from the other, immediately above the ladder:

```sh
# ADR-040 §1 — THE identity token grammar. ONE definition; every rung and the ➡️ Moved target
# parser below compose from it. ERE dialect (already this file's established dialect — see the
# `-E` note on the move-target extractor). ⚠️ NO BACKSLASHES may enter these values: they are
# passed to awk via -v, which processes escape sequences.
SPRINT_NUM_RE='[0-9]+[a-z]?'             # DIGITS SUFFIX? — exactly ONE optional lowercase letter
SPRINT_ID_RE="Sprint ${SPRINT_NUM_RE}"   # the identity token itself: `Sprint 4`, `Sprint 4c`
```

Rung 1 and rung 2 become **two small functions**, so `0265` can widen the token and expose a resolve-identity entry point by editing one place each. We build neither of `0265`'s things here (no `Backlog` token in rung 1, no CLI mode) — we only make them one-line changes.

### Why `awk`, not `sed`, for the H1 segment split

The segment split must turn four delimiters into a separator. **BSD `sed` does not interpret `\n` in a replacement as a newline** — it yields a literal `n`. This file already documents one BSD-vs-GNU regex divergence that fooled two reviewers (`STATUS_HEADING_RE`, `:111-125`); a `sed`-based split would plant a second. `awk` handles `"\n"` in a `gsub` replacement identically across dialects, is already used in this file, and can do the split, the trim, the anchored match **and** the distinct-count in one pass.

A second reason: the H1 contains `&` in real data (`In-App Monetization & Citizenship`). In a `sed` replacement `&` means "the whole match"; in our `awk` the H1 is only ever the *target*, never a replacement. The `sed` route would have been a live bug.

**Verified this session on `/usr/bin/awk` (BSD "one true awk" 20200816) and `/usr/bin/sed` — the consumer's real dialects, not a GNU shadow.** All twelve ADR-040 rows plus T6/T7/T10/T11 and the §5 refusal list resolve exactly as specified (measurements in §6 below).

---

## 2. Change 1 — `claude/skills/fkit-status/dashboard.sh`

### 2a. Rung 1 + rung 2 (replaces `:83` and `:87`)

Keep the existing warning comment at `:78-82` **verbatim** and append to it. Then:

```sh
plan_sprint_from_h1() {   # <plan-file> -> the H1 segment identity, or nothing.  ADR-040 §2.
  # The identity is a WHOLE, delimiter-bounded segment of the H1 — never a substring. Prose
  # containment is not identity: `# … — Post-Sprint 2 Hotfix Tasks` is a real plan that is
  # deliberately NOT Sprint 2, and any "find `Sprint N` anywhere" rule claims it and hands rule 1
  # a WRONG identity — which is strictly worse than none (ADR-040 §Context).
  #
  # ⚠️ awk, NOT sed. BSD sed does not expand `\n` in a replacement (it yields a literal `n`), so a
  # sed split silently produces one un-split segment on a consumer's Mac and works on Linux CI —
  # the exact dialect trap `STATUS_HEADING_RE` below already documents. awk also keeps `&` in the
  # title (`… Monetization & Citizenship`) inert, which a sed replacement would not.
  # ⚠️ A bare hyphen is NOT a delimiter — only ` - ` with spaces. That is what keeps `Post-Sprint`
  # one word.
  head -1 "$1" | awk -v tok="$SPRINT_ID_RE" '
    substr($0, 1, 2) == "# " {
      t = substr($0, 3)
      gsub(/ - /, "\n", t); gsub(/—/, "\n", t); gsub(/–/, "\n", t); gsub(/:/, "\n", t)
      n = split(t, seg, "\n")
      cnt = 0
      for (i = 1; i <= n; i++) {
        s = seg[i]
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", s)
        if (s ~ ("^" tok "$") && !(s in seen)) { seen[s] = 1; cnt++; last = s }
      }
      # DISTINCT count. Exactly one -> that identity. Zero -> fall through. TWO OR MORE -> refuse
      # and fall through; do NOT guess (ADR-040 §2.5).
      if (cnt == 1) print last
    }
  '
}

plan_sprint_from_stem() { # <plan-file> -> the filename identity, or nothing.  ADR-040 §3.
  # The prefix allowlist is CLOSED and has exactly one entry, `plan-`. An open `.*sprint-<N>` rule
  # would claim `hotfix-post-sprint-2.md`; the reporter's real file lacks that hyphen, so an open
  # rule would have been safe only by luck. Owner-ruled 2026-08-10 ("Include `plan-`"), accepted as
  # forward cover with no observed file behind it — tests T10/T11 are its only coverage.
  basename "$1" .md | sed -nE "s/^(plan-)?sprint-(${SPRINT_NUM_RE})\$/Sprint \2/p"
}

PLAN_SPRINT=$(plan_sprint_from_h1 "$PLAN_FILE")
if [ -z "$PLAN_SPRINT" ]; then
  PLAN_SPRINT=$(plan_sprint_from_stem "$PLAN_FILE")
fi
```

Keep the file's existing `if [ -z "$PLAN_SPRINT" ]; then … fi` idiom for the fall-through (matches the surrounding style and the rung-3 block below). Update the now-inaccurate one-line comment currently at `:85-86` (`sprint-2.md -> "Sprint 2"…`) to mention the `plan-` allowlist.

### 2b. Rung 3 — **unchanged behavior**, one comment claim corrected (brief item 6)

Leave the `backlog` basename special case and its whole comment block at `:89-108` alone **except** the false clause at `:95`:

- **Now:** *"its filename is deliberately outside the `sprint-*.md` glob, so both rules above miss it"*
- **Change to:** *"its filename is deliberately not a `sprint-<N>` stem, so neither rung above resolves it"*

Rationale: ADR-041 §6 site 2 — *"the conclusion survives, the mechanism does not."* The new wording is true today **and** after ADR-041 retires the glob, so `0265`/`0266` need not revisit it. **The special case's behavior is untouched** (⛔ owner-ruled 2026-07-18, review R4).

### 2c. The `moved_target` companion (`:692`) — ADR-040 §6, binding

```sh
    moved_target=$(printf '%s' "$st" | sed -nE "s/.*Moved to \[*(${SPRINT_ID_RE}|Backlog).*/\1/p" | head -1)
```

Only two things change on that line: the literal `Sprint [0-9]+` becomes `${SPRINT_ID_RE}`, and the surrounding quotes go from single to double so the variable expands. `\[` and `\1` survive double-quoting in bash unchanged (verified).

- ⛔ **Do not reword the `moved_target=$(printf ` prefix** — prove-red mutation 14's awk keys on it.
- Keep the entire existing `-E`-is-required comment block above it verbatim; add one line citing ADR-040 §6 and pointing at `SPRINT_ID_RE`.
- Everything else in the file — including `STATUS_HEADING_RE` (⛔) and all three `PLAN_SPRINT` consumers (`:772`, `:802`, `:905-906`, `:917`, `:922-923`) — is untouched.

---

## 3. Change 2 — `test/dashboard-contract.test.js`

### 3a. One backward-compatible helper change

`fixture()` hardcodes the plan filename as `sprint-1.md`, and **the filename is the thing under test** for five of the new cases. Add one optional parameter:

```js
function fixture({ plan, briefs = {}, planDir = 'sprints', planName = 'sprint-1.md' }) {
  …
  const planPath = join(agents, planDir, planName);
```

Every existing caller is unaffected. `0259`'s hand-built T1 case stays **byte-unchanged** — do not refactor it onto the helper (⛔ the brief forbids touching the existing R8 tests, and there is no reason to).

### 3b. New tests — place them in one block immediately after the T1 case (~`:737`)

Name every test with an explicit `ADR-040 T<N>:` prefix (step 8 requires T10/T11 to *exist by name*; doing it uniformly makes the whole set greppable). Each new test asserts **zero `missing-brief` facts** first, as a fixture-integrity guard — T1's own comment explains why an absence check is worthless without it.

| ID | Fixture | Assertions |
|---|---|---|
| **T2** | `plan-sprint-4c.md`, H1 `# Geoconflict — Sprint 4c — Production Stabilization`, row `\| ✅ Done \| 1 \| Alpha \| …backlog/a.md \|`. **Two sub-cases.** | **A)** brief `## Sprint: Sprint 4`, `## Status: 🔲 Backlog` → **zero** `drift disagreement` (rule 1 skips). **B)** brief `## Sprint: Sprint 4c`, `## Status: 🔲 Backlog` → `drift disagreement` **is** emitted (full rule-3 cross-check). Comment must say: under the *rejected* numeric-only widening **both** assertions invert — this is the discriminator T1 cannot be. |
| **T3** | `hotfix-post-sprint2.md`, H1 `# Geoconflict — Post-Sprint 2 Hotfix Tasks`, brief `## Sprint: Sprint 9` + `## Status: 🔲 Backlog` vs plan cell `✅ Done` | **All three consumers**, per R7's precedent: (1) identity empty ⇒ rule 1 does **not** skip ⇒ `drift disagreement` present; (2) `drift unresolved-plan-sprint` present; (3) roll-up matches `/on the plan itself/`. |
| **T4** | `plan-index.md`, H1 `# Geoconflict — Execution Plan Index` | `unresolved-plan-sprint` + roll-up clause. |
| **T5** | **The §7 regression guard.** Two sub-cases, both on `hardening.md`: (a) H1 `# Hardening` — ADR-040's named fixture shape; (b) H1 `# Roadmap: Sprint 4 carryover` | Both: `unresolved-plan-sprint` emitted **and** roll-up reads *"on the plan itself"*. Sub-case (b) is new coverage the widened rung 1 makes possible — a colon-delimited segment containing `Sprint 4` as **prose**. |
| **T6** | H1 `# Sprint 5 — Sprint 6`, two sub-cases | (a) on `sprint-5.md`: identity comes from the **filename**. Discriminate it — brief `## Sprint: Sprint 5` + status mismatch ⇒ `drift disagreement` fires (it would **not** if the identity were `Sprint 6`). (b) on `hardening.md`: EMPTY + `unresolved-plan-sprint` + roll-up clause. |
| **T7** | on `hardening.md`, two sub-cases: H1 `# Foo — Sprint 4th — bar`, and H1 `# Foo — Sprint 4C — bar` | Both EMPTY + reported. The first is ADR-040's T7 row (the one-letter bound); the second is §5's uppercase refusal — cheap, same fixture shape, explicitly a §5-coverage addition rather than a new ADR row. |
| **T8** | **No new test.** ADR-040's T8 *is* the existing R7 test `task 68: the backlog identity also silences the plan-level drift clause, not just the fact` | Prove it **stays green byte-unchanged**: show it green and show `git diff` touching none of its lines. Record in `worklog.md`. Adding a duplicate would be scope creep. |
| **T9** | any board; row `\| ➡️ Moved to [Sprint 4c](../sprint-4c.md) — priority 3 \| 1 \| Alpha \| …backlog/a.md \|`, brief `## Sprint: Sprint 4c` | **Zero** `drift disagreement`, zero `drift missing-sprint`, zero `moved-without-target`. **Red before §2c.** |
| **T10** | `plan-sprint-7.md`, H1 `# Hardening push` (genuinely prose). **Two sub-cases.** | **A)** brief `## Sprint: Sprint 9` + status mismatch → no `unresolved-plan-sprint` **and** zero `drift disagreement` (rule 1 skips). **B)** brief `## Sprint: Sprint 7` + status mismatch → `drift disagreement` **is** emitted. ⚠️ **Sub-case B is required**: without it T10 goes green under *any* resolved identity that is not `Sprint 9` — precisely the weakness T1's own comment names. B pins the **value** `Sprint 7`. |
| **T11** | `hotfix-post-sprint-2.md` — **hyphen before the digit** — H1 `# Hardening push` | EMPTY + `unresolved-plan-sprint` + roll-up clause. Test comment **must** state this filename is deliberately distinct from T3's real `hotfix-post-sprint2.md`; they are two tests, not a typo of one. Do not "correct" it to match the report. |

⛔ **T1 is `0259`'s — do not duplicate it.** It goes green as a consequence of §2a.

---

## 4. Sequencing

1. **Preflight.** Re-confirm ADR-040 reads `accepted`; open `worklog.md` and record it (verification step 1). No code yet.
2. **Tests first.** Land the `planName` helper param + all of T2–T7, T9, T10, T11. Run the suite and **record which are red**. Expected:
   - **Genuinely red before any source change: T2 (both sub-cases), T9, T10 (both sub-cases).**
   - **Already green today: T3, T4, T5, T6, T7, T11.** These are refusal/guard tests — they pin behavior the change must **not** break, and there is no natural red-first for them. **Say this plainly in the worklog and in the hand-off**; a reviewer will otherwise reasonably ask why green tests were landed. It is exactly why the brief's steps 3, 4 and 8 require *mutation* red-proofs for T5, T9, T10 and T11 instead of natural red-first.
3. **Rungs 1 and 2 + the `:95` comment correction** (§2a, §2b). Re-run: T1, T2, T10 go green; T9 stays red.
4. **Verification steps 3 and 8's mutation red-proofs**, while the rung code is fresh (details in §5). Restore after each.
5. **Step 4's T9 "before" evidence** — capture the T9 failure output now (still red), then land §2c. T9 goes green.
6. **Full verification sweep** (§5), then hand off. ⛔ No commit.

---

## 5. Verification — mapped to the brief's eight steps

| Step | How |
|---|---|
| **1** | Already measured: ADR-040 `:3` reads `accepted`. Restate in `worklog.md`. |
| **2** | **Twelve-row table, measured not quoted.** `dashboard.sh` never prints `PLAN_SPRINT`, so instrument a **throwaway copy in the scratchpad only** — `cp` the script, insert `printf 'PLAN_SPRINT=[%s]\n' "$PLAN_SPRINT" >&2` immediately after the rung-3 block **in the copy**, and drive it over 12 minimal scratch fixtures (each needs a `tasks/` tree above it and a `## Status` table, or the script `die`s). ⚠️ **Never instrument the real file.** Scratch fixtures live outside the repo, so step 7's diff stays clean. Paste the measured table. Rows 1 and 12 must be EMPTY **and** emit `unresolved-plan-sprint`; row 6 (`sprint-backlog.md`) must still be EMPTY — that one is `0265`'s. |
| **3** | **T5 red-proof.** "Remove the refusal path" is ambiguous here — `# Hardening` contains no `Sprint` at all, so no rung-widening can make it resolve. **Interpretation, to be stated in the worklog rather than chosen silently:** the refusal path is the *reporting* path plus the containment refusal. Run three mutations, one at a time, restoring after each: (i) delete the `add_fact "drift unresolved-plan-sprint …"` emission → T5's fact assertion red; (ii) delete `[ -z "$PLAN_SPRINT" ] && plan_level_drift=1` → T5's roll-up assertion red; (iii) widen rung 1 to accept a token *contained* in a segment → T5 sub-case (b) red. |
| **4** | **T9 red-proof.** Captured naturally by the §4 sequencing: show T9 failing against the current `(Sprint [0-9]+|Backlog)`, then green after §2c. |
| **5** | **No regression on this repo's boards.** Same instrumented scratch copy, run over `ai-agents/sprints/*.md` and `ai-agents/sprints/done/*.md`. Expect `Sprint 1`–`Sprint 5` at rung 1 and `backlog.md` at rung 3, and **zero** `unresolved-plan-sprint` on all six. |
| **6** | **Full `npm test` green, including `test/prove-red.sh`.** State explicitly that `0259`'s T1 fixture went **red → green** and that **the suite is green again** — `0259` shipped it red on purpose, and the owner accepted that red interval on 2026-08-11 *on the basis that `0264` restores both gates together*. Gates `0a`/`0b`/`0i` should clear with no prove-red edit. |
| **7** | `git diff --stat` touches `claude/skills/fkit-status/dashboard.sh` and `test/dashboard-contract.test.js` **and no other source file**. ⚠️ **Reconciliation to state, not resolve silently:** steps 1 and 8 *require* `worklog.md` entries, and the stateful review writes `review.md` — both inside the task folder. Read step 7 as fencing the **code** surface; run it as `git diff --stat -- claude/ test/ bin/ ai-agents/knowledge-base/ ai-agents/sprints/` and report the task-folder artifacts separately and explicitly. |
| **8** | **T10 red-proof:** temporarily narrow rung 2 to `^sprint-(${SPRINT_NUM_RE})$` (drop `(plan-)?`) → T10 must go red; restore. **T11 red-proof:** temporarily open it to `^.*sprint-(${SPRINT_NUM_RE})$` → T11 must go red (`hotfix-post-sprint-2.md` wrongly claimed as `Sprint 2` — confirmed by prototype this session); restore. **Also state in the worklog** that T11's fixture is `hotfix-post-sprint-2.md`, hyphen before the digit, deliberately distinct from T3's `hotfix-post-sprint2.md`. |

---

## 6. Prototype evidence (run this session, BSD awk 20200816 + BSD sed, no files written)

Rung 1, exactly the awk above:

```
# Geoconflict — Execution Plan Index                        => []          (row 1  ✅ required empty)
# Geoconflict — Sprint 4 — In-App Monetization & Citizenship => [Sprint 4]  (row 2)
# Geoconflict — Sprint 4c — Production Stabilization         => [Sprint 4c] (row 3, the §6 trap)
# Geoconflict — Sprint Backlog                               => []          (row 6, 0265's)
# Backlog — the default home for unsprinted task briefs      => []          (→ rung 3)
# Geoconflict — Post-Sprint 2 Hotfix Tasks                   => []          (row 12 ✅ containment refused)
# Sprint 5 — Sprint 6                                        => []          (T6: two distinct → refuse)
# Sprint 5 — Sprint 5                                        => [Sprint 5]  (DISTINCT, not count)
# Foo — Sprint 4th — bar                                     => []          (T7)
# Sprint 4C / # sprint 4 / # Sprint-4                        => []          (§5 refusals)
# Sprint 1 — Test                                            => [Sprint 1]  (suite's default title, unchanged)
# Hardening — the launcher sprint / # Hardening              => []          (existing R8 pair, unchanged)
# Roadmap: Sprint 4 carryover                                => []          (T5 sub-case b)
# P — Sprint 10 — b                                          => [Sprint 10] (multi-digit)
# Foo - Sprint 3 - bar  /  # Foo – Sprint 8 – bar            => [Sprint 3] / [Sprint 8] (` - ` and en dash)
# Sprint 4<CR>                                               => [Sprint 4]  (CRLF trimmed by [[:space:]])
```

Rung 2: `plan-sprint-4→Sprint 4`, `sprint-1→Sprint 1`, `plan-sprint-7→Sprint 7`, `plan-sprint-10→Sprint 10`, `sprint-4c→Sprint 4c`; **empty** for `hotfix-post-sprint-2`, `hotfix-post-sprint2`, `sprint-backlog`, `plan-index`, `backlog`. Opened to `.*sprint-<N>$` it wrongly yields `Sprint 2` for `hotfix-post-sprint-2` — **T11's red-proof confirmed in advance.**

`moved_target`: `[Sprint 4c](…)→Sprint 4c`, `[Sprint 2](…)→Sprint 2`, `[Backlog](…)→Backlog`, unlinked `Sprint 12→Sprint 12`, bare `➡️ Moved→` empty. All 0210 forms preserved.

---

## 7. Edge cases and non-obvious failure modes

1. **BSD `sed` `\n`-in-replacement (avoided by design).** Would have produced one un-split segment on a Mac and correct behavior on Linux CI — invisible in CI. This is why rung 1 is `awk`.
2. **`&` in the H1.** `In-App Monetization & Citizenship` is real data; in a `sed` replacement `&` is the whole match. The `awk` route never puts the title in a replacement position.
3. **`awk -v` processes escape sequences** (prove-red's own header documents this biting a mutation). `SPRINT_NUM_RE`/`SPRINT_ID_RE` are deliberately backslash-free. **A future widening that adds a backslash breaks the `-v` hand-off silently** — the comment on the constants must say so.
4. **Rung 1 now reads the FIRST LINE only.** Today's `sed` scans the *whole file* for `^# Sprint N`. ADR-040 §2.1 specifies the first line. Verified no test and no repo board depends on a later `# Sprint` heading — but this is a **deliberate narrowing, not a no-op**; record it in the worklog.
5. **CRLF plans.** `# Sprint 4\r` → the `[[:space:]]` trim (which includes `\r` in the C locale) saves it; a `[ \t]` trim would not. Covered by construction, **not covered by a test** — out of this brief's scope; flagged rather than silently relied on.
6. **`set -u` + `set -f`** are on. Both constants are assigned before first use; no globbing is introduced.
7. **prove-red mutation 14 must stay armed.** Its awk matches `/moved_target=\$\(printf/`; the prefix is preserved. Its mutant line is a self-contained literal that references no shell variable, so it still applies cleanly under `set -u`. Expect T9 to also go red under mutation 14 — harmless; the gate greps specifically for `0210/A`.
8. **The `= "Backlog"` arm at `:772` must not start firing on new files.** The only rung producing `Backlog` is rung 3, unchanged. No new file reaches that arm.
9. **T10 without its sub-case B would be a false guard** — green under any identity ≠ `Sprint 9`, including a broken one. Same trap T1 documents about itself. Sub-case B is non-optional.
10. **A "wrong identity is worse than none" self-check** before hand-off: confirm that no fixture in the suite newly resolves to an identity it did not have before, other than the intended ones (`plan-sprint-4.md`, `plan-sprint-4c.md`, `plan-sprint-7.md`). The step-5 sweep plus a full-suite green covers this.

---

## 8. Constraints honored

⛔ `STATUS_HEADING_RE` untouched · ⛔ `backlog` basename special case's **behavior** untouched (only the false glob clause in its comment) · ⛔ `claude/skills/fkit-status/SKILL.md` untouched (that is `0266`'s, and its glob is ADR-041's) · ⛔ the two existing R8 tests and `0259`'s T1 left byte-unchanged · ⛔ no new devDependency (ADR-014) · ⛔ no `ai-agents/wiki-vault/` write (ADR-005) · ⛔ no commit · ⛔ the downstream pre-release twelve-filename test is **not** added to these verification steps — it is a release gate on the **cut**, recorded in Sprint 5's `## Notes` and `0260`'s Notes.

---

## 9. Residuals to surface at hand-off (not blockers, do not fix here)

- **No prove-red mutation is added for the new grammar.** ADR-026 discipline would suggest one, but verification step 7 fences the diff to `dashboard.sh` + the test file, so editing `test/prove-red.sh` is out of scope by the brief's own rule. The red-proofs are performed manually and recorded in the worklog instead. **A follow-up mutation is the producer's to file, not this row's** — flag it, do not file it.
- **GNU `awk`/`gawk` is not verified here.** Every construct used (`substr`, `gsub` with `"\n"`, `split`, dynamic regex, `[[:space:]]`) is POSIX, and the verification above ran on the *stricter* BSD dialect, which is the consumer's. Stated as a residual rather than claimed as proven.
- **`0259`'s accepted residual is discharged by this task:** *"T1 cannot discriminate a correct identity grammar from a lucky one — re-raise only if `0264` ships without T2."* T2 ships here, with both sub-cases, and its comment names the rejected numeric-only widening explicitly. Say so at hand-off so the reviewer can close it rather than re-raise it.

**No decision is needed from the owner before building.** The two interpretive calls (step 3's "refusal path", and step 7's diff fence versus the required worklog artifacts) are resolved above and will be stated in the worklog rather than resolved silently.
