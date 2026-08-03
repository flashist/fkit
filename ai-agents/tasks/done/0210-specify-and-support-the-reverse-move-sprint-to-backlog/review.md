# Review — 0210

Task: `ai-agents/tasks/done/0210-specify-and-support-the-reverse-move-sprint-to-backlog/brief.md`
File(s) under review: `claude/skills/fkit-status/dashboard.sh` · `ai-agents/sprints/backlog.md` (the
+21 prose lines only) · `claude/skills/fkit-task-brief/SKILL.md` ·
`ai-agents/knowledge-base/conventions/task-status-vocabulary.md` · `test/dashboard-contract.test.js`
Status: in-review

Round 1 — reviewers: fkit-reviewer (own pass) + Codex (`codex-cli 0.145.0`, completed, full coverage).
Verdict: ⚠️ Changes requested — 5 defects (none blocking).

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | med | `ai-agents/sprints/backlog.md:25` · `claude/skills/fkit-task-brief/SKILL.md:343` | The "four edits, all mandatory" reverse-move procedure omits the brief's `## Status`. Followed exactly on a task de-scoped while `🔄 In progress` / `🚧 Blocked`, it manufactures permanent `drift disagreement` on the backlog board. Proven by fixture: `drift disagreement 0001 plan="🔲 Backlog" brief="🔄 In progress" brief_sprint="Backlog" location="backlog/"`. Both sites already ⚠️-warn the identical trap one field over (edit 3 / `## Sprint`); this one is unwarned. |
| R2 | 1 | med | `…/0210-…/plan.md:147` · `test/harness.mjs:18` · `test/prove-red.sh:135` | The plan's *"this change cannot be prove-red covered … requires introducing a `dashboard.sh` path override into both the suite and `prove-red.sh`"* is factually wrong. `REPO = dirname(dirname(harness.mjs))`, so copying `test/` + `claude/` into a temp root and running the **copied** test file targets the **copied** `dashboard.sh` with **no env override anywhere**. Executed: unmutated copy 6/6 green; parser reverted → A/B/C/F red; naive BRE → A/B/C/E/F red. `make_claude_copy()` already does most of this; it just never copies `test/` alongside. |
| R3 | 1 | low-med | `test/dashboard-contract.test.js:1991` | Case D does not guard what its comment claims (*"a fix that matched too much would ship silently"*). Its fixture is `➡️ Moved` — no `to` clause — so it only exercises the no-`Moved to` path. Proven: an over-wide parser `s/.*Moved to \[*([A-Za-z]+ ?[0-9]*).*/\1/p` leaves **all six cases green** while `➡️ Moved to Narnia` resolves to target `Narnia`. A one-line fixture change would make D real. |
| R4 | 1 | low | `claude/skills/fkit-status/dashboard.sh:685` | The new comment asserts `\[*` is *"zero-or-more by design: historic unlinked prose (`➡️ Moved to Sprint 2 — priority 7`) must keep parsing"* — but no test pins it. Proven: `\[*` → `\[` keeps the **entire 115-test dashboard suite** green; `grep "Moved to Sprint"` (unbracketed) over the suite returns zero hits (all 15 `Moved to` fixtures are bracketed). A future simplifier can delete the `*` on a fully green suite and break every legacy unlinked row. |
| R5 | 1 | low | `test/dashboard-contract.test.js:1953` · `:2019` | Cases A and F encode hrefs the docs call wrong, and F's name quotes a string its fixture lacks. A's plan sits at `ai-agents/sprints/` where the doc prescribes `backlog.md`, but uses `../backlog.md`; F's sits at `ai-agents/sprints/done/` where the doc prescribes `../backlog.md`, but uses `../../backlog.md`. Both resolve to a nonexistent `ai-agents/backlog.md`. F is titled *"the archived `../backlog.md` href parses identically"* and does not contain that string — it passes only because the parser ignores the href, so it never exercises the shape it names. |

### Verified as CORRECT — do not chase (recorded so the coder does not re-derive them)

- **The BSD portability claim is correct, re-derived independently.** The naive BRE `\|` returns empty
  for **both** branches across all 20 probe inputs on this machine's `/usr/bin/sed` — the forward form
  would indeed break too. The shipped `-nE` form is correct on BSD: `Backlog`, `Sprint 12`
  (multi-digit), legacy unlinked `Moved to Sprint 2 — priority 7`, archived href, bare `Moved` →
  empty, lowercase `backlog` → unmatched, `the Backlog` → unmatched.
- **The GNU-sed residual is acceptable** (frontier-move). `-E` alternation is POSIX ERE; GNU sed has
  supported `-E` for years. Nothing in the repo would catch a GNU-side failure — there is no CI, the
  suite is `npm test` run by hand — but the exposure for this construct is near-nil.
- **The `## Priority` "unenforced" claim is correct.** `dashboard.sh` reads exactly four brief fields —
  `ID`, `Status`, `Sprint`, `Owner` (`dashboard.sh:658,672-674`). Zero `## Priority` reads. The caveat
  is present in both places a producer would read it, and correctly absent from the vocabulary doc.
- **The three doc sites are consistent.** The canonical marker `➡️ Moved to [Backlog](backlog.md)`
  appears exactly once in each, identically; all four new relative links resolve.
- **Counts verified:** 566 pass / 0 fail / 17 suites (baseline 560, +6). `sh test/prove-red.sh` exits 0.

### Downgraded from the Codex pass — no action recommended

- **Loose label matching / greedy `.*` (Codex #2) → frontier-move, not defect.** `[Backlog board]` and
  `[BacklogX]` both resolve to `Backlog`, but this mirrors the **pre-existing** Sprint branch
  (`[Sprint 2x]` → `Sprint 2`). 0210 extends established looseness rather than introducing a class.
  The greedy-last change on a double-`Moved to` cell (was `Sprint 2`, now `Backlog`) is a real behavior
  change but only on an already-malformed cell that no rule depends on.
- **`head -1` is dead code** — `printf '%s'` emits one line, so `s///p` prints at most once.
  Pre-existing, not this task's.

### Note, not a finding

- `.claude/skills/fkit-status/dashboard.sh` differs from `claude/` — a live `/fkit-status` session
  still runs the **pre-0210** parser until `claude/fkit-claude-init.sh .` re-runs. In scope to note per
  the task framing, not to fix.

## Coder response

<!-- CODER-OWNED. The reviewer never writes here. -->

Round 1 — coder: `@fkit-coder`, spawned as the **Process-review worker** of the `/fkit-sprint-ship-loop`
run. Every finding was **re-verified against the code by execution before anything was changed** — the
reviewer's own confirmations were treated as claims to test, not as results to inherit. All five
reproduce. All five were ruled **fix it** by the owner via a live `AskUserQuestion` relayed by the
driver, and all five are fixed.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CONFIRMED** | Defect (med) | Reverse move is now **FIVE** mandatory edits — `## Status` → `🔲 Backlog` added as edit 4, `## Priority` renumbered to 5. Both count-stating sites updated together, each with its own ⚠️ warning for the new edit and a counts-asymmetry paragraph. | fixed |
| R2 | **CONFIRMED** | Defect (med) | Plan §4's justification is **wrong**; corrected here and in `worklog.md` (never in `plan.md`). Mutation **14** wired into `prove-red.sh` via a new `make_repo_copy()` + `run_dashboard_suite()`, with step **0i** as its unmutated-copy guard. | fixed |
| R3 | **CONFIRMED** | Defect (low-med) | Case D **made to guard what it claims** (not reworded down): a second fixture row, `➡️ Moved to Narnia`, now reds the over-wide parser. The original bare-`➡️ Moved` assertion is kept — it is the suite's only pin on that shape. | fixed |
| R4 | **CONFIRMED** | Defect (low) | New case **0210/G** pins the legacy unlinked prose form `➡️ Moved to Sprint 2 — priority 7`. | fixed |
| R5 | **CONFIRMED** | Defect (low) | Hrefs corrected to the documented rule: A/B/C → `backlog.md` (plan sits in `sprints/`), F → `../backlog.md` (plan sits in `sprints/done/`), so F's fixture now contains the string its name quotes. | fixed |

### R1 — reproduced, and the cure verified

Built the post-move fixture by following the **then-shipped four-edit** procedure exactly, on a task
de-scoped while `🔄 In progress`. The backlog board emitted, verbatim:

```
drift disagreement 0001 plan="🔲 Backlog" brief="🔄 In progress" brief_sprint="Backlog" location="backlog/"
```

— rendering `waiting on owner`, permanently. Byte-identical to the reviewer's quoted evidence.
`🚧 Blocked — waiting` reproduces it identically. With the new edit 4 applied the same fixture emits
**zero drift**. The mechanism is the backlog board's own arm of drift rule 3
(`[ -n "$b_key" ] && [ "$b_key" != "$key" ] && bad=1`), reached because that board **deliberately
disables rule 1's skip** — so the brief's `## Status` is cross-checked against the row's `🔲 Backlog`.

**The forward move genuinely needs no status edit, and this was checked rather than assumed.** A
fixture built by the `**Off:**` three-edit procedure (brief `🔲 Backlog`, sprint row `🔲 Backlog`)
emits zero drift. The two carriers already agree on the way in; only the way out can start from
`🔄 In progress`. That asymmetry is now stated in both doc sites, so the 5-vs-3 count reads as
explained rather than as an error.

### R2 — the plan's §4 claim is REFUTED. The correction, for the record

`plan.md` §4 states: *"this change cannot be prove-red covered … Covering it requires introducing a
`dashboard.sh` path override into both the suite and `prove-red.sh` — a test-architecture change, not a
test addition."* **That is wrong, and `worklog.md`'s "independently verified, CONFIRMED" endorsement of
it is wrong with it.** ⛔ `plan.md` is the immutable approved artifact and is **not** edited; the
correction lives here and in the worklog.

What the claim missed: `harness.mjs` derives `REPO` as the parent of its own directory, and
`dashboard-contract.test.js` joins `REPO` with `claude/skills/fkit-status/dashboard.sh`. Copying
`claude/` **and** `test/` into one throwaway root therefore makes the copied test resolve the copied
script **by construction** — no env override in either file, no test-architecture change. The earlier
reasoning inspected the test file for a `process.env` seam, found none, and concluded no seam existed;
the seam is the *directory layout*, not an env var. Measured, before writing anything:

- unmutated copy → **115/115 green** (the seam works at all)
- parser reverted to the pre-0210 `Sprint`-only BRE → **A, B, C, F red**
- naive BSD-hostile BRE `\|` → **A, B, C, E, F red**, plus 5 pre-existing forward-move tests

**One thing the reviewer's recipe did not predict, found by building it.** Inside `prove-red.sh` the
seam is red for an unrelated reason: the script writes an **empty** `package.json` at `$work` as a
source-checkout marker, and node resolves a `.js` file's module type from the nearest parent
`package.json` — so it walks up to that empty file and dies `ERR_INVALID_PACKAGE_CONFIG` before loading
any test. Every test fails at import, the suite is red no matter what the mutation did, and the
named-assertion check would have reported a *pass* on a disarmed gate. **Step 0i caught it on the first
run** — which is exactly what an unmutated-copy step is for. Fixed by copying the repo's own
`package.json` into the copy root (nearest-parent wins). `$work`'s empty marker is left alone: mutations
1–13 depend on it and only its existence is read.

### R3 — case D was made real, not reworded down

Both options were open; **making D guard its claim** is the one taken, because the alternative leaves
the over-wide class unguarded and merely stops lying about it. Verified: the over-wide parser
`s/.*Moved to \[*([A-Za-z]+ ?[0-9]*).*/\1/p` left **all 115** cases green before, and now reds **D and
only D**. The original bare-`➡️ Moved` assertion was **kept, not replaced** — a suite-wide grep shows D
is the *only* pin on `moved-without-target`, so swapping the fixture would have closed one hole by
opening another.

### R4 / R5 — as ruled

R4: `\[*` → `\[` left all 115 green before; case **0210/G** now reds **G and only G**. R5: fixed as
described above; the parse is href-agnostic so nothing behavioral moved — the defect was that the
fixtures encoded hrefs the docs call wrong and F never contained the string it was named for.

### Residual, disclosed — not everything new is prove-red wired

Mutation 14 is the **revert** mutation, and it names `0210/A`. The repaired guards from R3 and R4 are
proven red **by hand this round** (shown above) but are **not** themselves wired as prove-red
mutations — the owner ruled "the dashboard mutation", singular, and widening that is scope this worker
does not hold. The seam and helpers now exist, so adding an over-wide mutation and a mandatory-bracket
mutation is a few lines each. **Recommend the producer file it as a follow-up for the owner to rank.**

## Accepted residuals (shared, do-not-re-litigate)

<!-- Added only once the owner approves treating a finding as a settled tradeoff. -->

**Owner-approved residuals: none.** All five findings were ruled *fix it*; nothing was accepted as a
tradeoff, so this list stays empty of owner-approved entries.

**Reviewer-suppressed, coder-concurred — recorded ONLY so round 2 does not re-derive them.**
⚠️ These are **not** owner-approved residuals and must not be read as such; they are the reviewer's own
round-1 suppressions, which the coder re-read and does not dispute.

- **Loose label matching / greedy `.*` (Codex #2)** — frontier-move. `[Backlog board]` → `Backlog`
  mirrors the pre-existing Sprint branch; 0210 extends established looseness rather than introducing a
  class.
- **`head -1` is dead code** — pre-existing, not this task's.
- **GNU-sed residual** — acceptable frontier-move; `-E` is POSIX ERE, exposure near-nil, no CI.
