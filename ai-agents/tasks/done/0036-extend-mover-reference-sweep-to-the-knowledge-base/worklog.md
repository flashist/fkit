# Worklog — Widen the sweeps that look in too few places (task 81)

**Task:** `ai-agents/tasks/done/extend-mover-reference-sweep-to-the-knowledge-base.md`
**Task ID:** 0036 · **Sprint 2**, priority 81
**Plan:** `ai-agents/plans/extend-mover-reference-sweep-to-the-knowledge-base.md`

---

## Owner-decision log

| # | Kind | Decision |
|---|---|---|
| 1 | **Owner — plan gate** | 81's plan **blanket-approved** at task 85's plan gate (owner chose "approve 85; blanket-approve 81 + 79; stop for 76/77"). |
| 2 | **Owner — Part D** | The installer's `Seven roles` line: **drop the count entirely.** Both hardening alternatives declined. Rationale recorded: `Eight` would promise a role with no agent file (ADR-028 is decided-not-built); `Seven` goes stale the day it ships; no count is accurate in both worlds, and it dissolves the 81/82 cross-task inconsistency risk. |
| 3 | **Obvious winner — Part A root set** | **Sweep all of `ai-agents/`, excluding `wiki-vault/`**, rather than enumerating directories. The brief asked this be weighed and recorded. An enumerated list is exactly what caused this bug — it was right when written and went stale (`knowledge-base/` never in it; `plans/` + `worklogs/` did not exist until ADR-020). One parent directory plus one named exclusion is self-maintaining. |
| 4 | **Obvious winner — knowledge-base handling rule** | A knowledge-base hit is treated **identically to a closed sprint plan**: re-point the href, change nothing else. Same principle — *a historical record's claims are frozen; its links are not.* Written down explicitly rather than left to inference, as the brief required. |
| 5 | **Obvious winner — ADR prose is out of bounds** | The movers may re-point an href inside an ADR but must **never** edit its prose, status, date or decision text. If the surrounding sentence has gone factually wrong, that is an ADR amendment and the architect's work — flag it, don't fix it. |

---

## What was built

### Part A — the movers' reference sweep *(done)*

| File | Change |
|---|---|
| `claude/skills/fkit-task-done/SKILL.md` | step-4 grep widened; knowledge-base/reviews/plans/worklogs handling rule added; report gains a distinct knowledge-base call-out and a "vault links NOT touched" line |
| `claude/skills/fkit-task-cancelled/SKILL.md` | **both** greps widened — the step-4 sweep **and** the dependency search |

All three greps are now `grep -rn --exclude-dir=wiki-vault "<file>.md" ai-agents/`.

**The `wiki-vault/` exclusion is documented as a hard rule with its reason**, in both skills, so a
future reader does not "fix" the apparent gap. Only `fkit-wiki` writes the vault (ADR-005); a mover
re-pointing a vault link would breach that boundary.

**Dry run — the defect, measured.** Against a real closed task (`design-task-folder-structure-and-id-scheme.md`):

```
OLD sweep (sprints/ tasks/):   5 hits
NEW sweep (ai-agents/, -vault): 10 hits
MISSED by the old sweep:
  ai-agents/knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md
  ai-agents/knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md
  ai-agents/reviews/assign-global-task-ids-and-create-registry.md
```

The vault *also* references it (`index.md`, `log.md`, `wiki/tasks/…`) and is correctly **left alone** —
fkit-wiki's repair, not the mover's.

### Part B — the next-ADR-number derivation *(done — see the reversal note below)*

`claude/skills/fkit-record-decision/SKILL.md`: numbering derives from **ADR filenames on disk**, in two
steps — a **conformance check** that must print nothing, then the highest number in use. The
**2026-07-19 collision is named in the skill text**, and so is the gap this leaves: it cannot see a
number claimed before its file exists, so an explicit **manual check** is documented in its place.

A ⛔ callout records that this step **does not** read the vault, and that this is a deliberate
limitation rather than an oversight.

**New guard: `test/adr-number-uniqueness.test.js`** — same shape as task 85's duplicate-task-ID
assertion. Zero new devDependencies. Non-vacuity assertion, directory-is-not-an-ADR, unreadable-is-not-
absent, and the canonical filename shape shared with the other two artifacts.

*(⚠️ This section originally described a repo-wide content sweep, "the highest **claimed** number wins
over the highest **file on disk**", and a four-digit test case. **All three are gone** — see the
reversal note below. The stale description survived five rounds of edits in this very worklog and was
caught by the reviewer, which is the same stale-prose failure the review found in the shipped files.)*

### Part D — the installer's role count *(done)*

`claude/fkit-claude-init.sh:847` — `Seven roles, each a locked session…` →
`Role-locked sessions — inside each, only its own skills exist:`. A comment above it records the
ruling and warns against reintroducing a count.

**The installer was run and its output read**, not inferred from source — the printed block is
internally consistent: no count, seven roles listed, and nothing asserting the tester role exists.

### ⚠️ Part B REVERSED ITS OWN BRIEF — recorded, because this brief becomes the record of what shipped

**The brief says:** *"the next ADR number is derived from every place a number can be claimed, **not
from a `decisions/` directory listing**."*

**What shipped is a `decisions/` directory listing.** Owner-ruled 2026-07-20, after the content sweep
was built and **poisoned three separate times** — each time by ordinary prose *documenting the
mechanism*: a review ledger writing `adr-1029` as an example made it report the highest claim as 1030;
requiring a slug did not help (`adr-999-placeholder.md` has one); anchoring on `decisions/` did not
help either, because a full path in a sentence is indistinguishable from a real reference. At its
worst it would have numbered the next ADR **1000 instead of 031, permanently**.

**Part B's honest net gain, which is different from what the brief asked for and arguably better:**

| | Before | After |
|---|---|---|
| Source of truth | `ls decisions/` | `find decisions/ -type f`, conformance-checked |
| Identity | string | **numeric**, uniform across all three artifacts |
| Case | `-name` (missed `ADR-031-x.md`) | **`-iname`** |
| Directories | counted as ADRs | **rejected** |
| Malformed names | silently miscounted (`adr-031.md` → allocate 031 twice) | **flagged, allocation stops** |
| Date-stamped names | parsed as ADR 2026 → next 2027 forever | **rejected** |
| Errors | `2>/dev/null` → silent partial scan | **surfaced** |
| The pre-file gap | claimed covered, wasn't | **stated as a manual step** |

**The last row is the point.** The brief wanted an automated guarantee. What shipped is a narrower
automated check plus an *honest* manual step — because three attempts at the guarantee each failed
open while claiming to be closed. A false guarantee is worse than a stated gap.

**Accepted limit:** the scheme is now capped at **ADR-999** (exactly three digits). Same shape of
residual as ADR-029's four-digit task-ID overflow. Raising it means changing all three artifacts
together **and** re-checking the date-stamped case, which a wider digit pattern reopens.

### Part C — the lint's ADR number/slug cross-check *(done)*

fkit-wiki consulted at hop 1 on the vault's slug conventions and where the check will produce noise,
per the brief's explicit instruction (consult, not handover).

---

## Verification so far

| Criterion | Result |
|---|---|
| Both movers' sweeps reach `knowledge-base/` — verified by **reading the grep line** | ✅ all 3 lines read back |
| `fkit-task-cancelled`'s **second** grep fixed | ✅ line 205, the dependency search |
| Dry run returns the knowledge-base hit | ✅ 3 files the old sweep missed |
| **`wiki-vault/` NOT added as a sweep root** | ✅ appears only as `--exclude-dir` |
| Part B reproduces the original failure before the fix | ✅ 029 collision, then avoided |
| Uncommitted-only claim caught | ✅ sweep reads disk, not git |
| Duplicate-ADR-number test red-proved | ✅ 2 named tests red; vacuity mutation red |
| No new devDependencies | ✅ none in `package.json` |
| Part D: installer output run and read | ✅ block internally consistent |
| `npm test` | ✅ **440 pass / 0 fail**, hard gate passed |

All four parts complete. `.claude/skills/` refreshed. Review pass complete — see below.

---

## Review ledger

**Path:** `ai-agents/reviews/extend-mover-reference-sweep-to-the-knowledge-base.md` — **`Status: closed-out`**

**Verdict:** ✅ Closed out — **51 findings over 9 rounds, all resolved. No open findings.**

**Codex coverage: FULL.** Both reviewers ran every round except round 2, which the reviewer flagged
itself as single-reviewer rather than passing it off as complete.

### Findings by round

| Round | Findings | Notes |
|---|---|---|
| 1 | 12 | incl. R9 — my own test enforced a rule the skill I shipped broke |
| 2 | 14 | went **up**; 8 of 14 in the test file I wrote |
| 3 | 7 | R33 (Codex) — a *directory* satisfied the non-vacuity guarantee |
| 4 | 3 | R34 — R33's own fix split across artifacts |
| 5 | 7 | two were the reviewer correcting its **own** round-4 sign-offs |
| 6 | 7 | R48 — I silently reverted a round-1 fix and didn't notice for a round |
| 7 | 2 | R43 — a date-stamped filename parsed as ADR 2026 |
| 8 | 1 | R51 — the case rule, ninth one-of-N |
| 9 | 0 | closed out |

### What this review actually found

**Prose claiming more than the mechanism delivered outnumbered every logic error** — R14, R28, R35,
R38, R41, R44, R46. Part B's guarantee was rewritten **four times** before becoming a scope reduction
plus an honest manual step.

**Two failure modes that generalise past this task:**

1. **One-of-N — nine instances.** A fix reaching one artifact when N implement the rule. The unit is
   the **enumeration**, not the file. **Nothing goes red for any of them**; every one was caught by a
   person reading the sibling artifact.
2. **Scope inheritance — the reviewer's, twice.** It signed off by confirming an assertion *existed*
   rather than re-running the mutation, and by grepping the single file I had edited. Both times its
   search inherited mine, so it could not detect what mine had missed. The fix was enumerating
   **before** looking at the fix.

### Accepted residuals (recorded with re-raise conditions)

- **The pre-file claim gap** — the derivation cannot see a number claimed before its file exists.
  *Re-raise if:* someone proposes a detection mechanism that **cannot be triggered by prose describing
  it** — verified by writing the proposal into a repo document and re-running.
- **The ADR-999 ceiling** — exactly three digits. Raising it means changing all four sites together
  **and** re-checking the date-stamped case.
- **R12** — "only its own skills exist" misdescribes the PreToolUse mechanism; owner-ruled to leave it,
  since fixing it here alone would diverge from `CLAUDE.md:31`.
- **R49** — the installer's printed role list and `fkit-claude.sh`'s acceptance list are kept in step
  by hand; nothing tests that they agree.

---

## Verification evidence — final run

`npm test` → **446 pass / 0 fail / 0 skipped**; `prove-red.sh` hard gate passed.

**Live repo under the shipped procedure:** zero malformed ADR filenames, highest `30`, next `031`.

**Acceptance tests run (defects executed, not greps for fixes):**

| case | result |
|---|---|
| `adr-2026-07-20-notes.md` | Step A **flags**; Step B returns 30 |
| `adr-031.md` (no slug) | **flagged** — was silently allocating 031 twice |
| `adr-031-.md` (empty slug) | **flagged** |
| `ADR-031-x.md` | counted by all four sites |
| directory `adr-999-placeholder.md` | ignored |
| prose `adr-1029` / `decisions/adr-888-example.md` | ignored |

---

## The brief's `## Verification steps`, walked

| Criterion | Result |
|---|---|
| Both movers' sweeps reach `knowledge-base/` (read the grep line) | ✅ all 3 lines read back |
| `fkit-task-cancelled`'s **second** grep fixed | ✅ the dependency search |
| Dry run returns the knowledge-base hit | ✅ 3 files the old sweep missed |
| **`wiki-vault/` NOT added as a sweep root** | ✅ appears only as `--exclude-dir` |
| Part B reproduces the original failure before the fix | ✅ |
| Uncommitted-only claim caught | ⚠️ **superseded** — see the reversal note |
| Duplicate-number test red-proved | ✅ |
| No new devDependencies | ✅ |
| `/fkit-record-decision` writes nothing to the vault | ✅ verified by reading its write steps |
| Skill text names the 2026-07-19 collision | ✅ all three artifacts |
| Part C red-proved against the actual collision | ✅ flagged; real vault clean 30/30 |
| Part C flags rather than rewrites | ✅ verified by reading |
| Part D: no role-count `seven` remains | ✅ only in the explanatory comment |
| Part D: installer **run** and output read | ✅ internally consistent |
| `.claude/skills/` refreshed | ✅ |

---

## Lessons learned

- **Enumerate before fixing, and enumerate the *enumerations*, not the files.** Nine one-of-N
  instances; the two rounds where I enumerated first each caught a site I would have missed.
- **Confirming a fix exists is not confirming the defect is gone.** R36 had an assertion and the
  defect; only re-running the mutation showed it.
- **A false `Fixed` is worse than an open finding** — it stops anyone looking again. Four of mine were
  wrong, twice against work I had never done.
- **Prose is the largest defect surface here.** Most findings were documents promising more than the
  code delivered — and twice, prose *documenting a mechanism* broke that mechanism.
- **Distrust your own verification output.** The live ADR-1000 misallocation surfaced only because I
  read an output that contradicted the caption I had written above it.

---

## Files touched / change surface

| File | Change |
|---|---|
| `claude/skills/fkit-task-done/SKILL.md` | Part A — sweep, handling rules, report |
| `claude/skills/fkit-task-cancelled/SKILL.md` | Part A — **both** greps, handling rules, report, triage rule |
| `claude/skills/fkit-record-decision/SKILL.md` | Part B — derivation rewritten (conformance + highest) |
| `claude/skills/fkit-wiki-lint/SKILL.md` | Part C — ADR number/slug cross-check |
| `claude/fkit-claude-init.sh` | Part D — role count dropped |
| `test/adr-number-uniqueness.test.js` | **new** — Part B's guard |
| plan / worklog / review ledger | ship-loop artifacts |

## Recommended follow-up tasks

*Named only — the loop does not file briefs (producer's job) and does not write the wiki.*

- **Record the two failure modes durably** — one-of-N, and reviewer scope-inheritance. Both currently
  live only in a closed task's ledger and **will be rediscovered from scratch**. The reviewer flagged
  this explicitly; the second matters most, because a reviewer's scope silently inheriting the
  author's defeats the enumerate-and-tick control the owner just adopted.
- **Task 82** — the role-count doc refresh. Part D dropped the count rather than changing it, which
  reduces the 81/82 inconsistency risk but does not remove the need for 82.
- **A wiki sync** for the four changed skills, when the queued syncs are batched.

## Commit state

`git status` run: **nothing committed, nothing pushed.** All edits left in the working tree.

---

## Cross-task risk — recorded, not resolved

The role count is corrected in **two tasks by two roles** (81 Part D here, and task 82 for the docs).
Dropping the count rather than changing it **reduces** the risk the brief flags — the installer no
longer contradicts the docs whichever lands first — but does not remove the need for task 82.
**Whoever closes the second of the two should still re-run a repo-wide `seven` sweep.**

---

## Commit state

**Nothing committed. Nothing pushed.** All edits left in the working tree.
