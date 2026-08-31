# Worklog — `0352` — ADR: the narrow in-flight review-fix lane

**Build worker of `/fkit-sprint-ship-loop`, run as `fkit-architect`, 2026-08-30.**
Executed the plan at `plan.md` (blob `57331b2e5cb4fa11c05a10bb51f266b7e9569628`, 22300 bytes —
**re-verified against disk at the start of this run; it matched, so the paste and the file agreed**),
with the four owner rulings recorded in that file's header applied.

---

## What was written

**One file, and nothing else:**

`ai-agents/knowledge-base/decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task.md`

Title: *ADR-045: A reviewer's in-flight finding terminates in the review ledger, not in a new task
folder*. Status `accepted` (owner Ruling 2).

---

## Measurements taken this run, with the command

⚠️ **Nothing below is carried forward from the brief or the plan.** Every figure was re-run today.

### ADR number — re-derived at write time, not copied

**`/fkit-record-decision` Step A** — every `adr-*` filename must conform; this must print nothing:

```
find ai-agents/knowledge-base/decisions -type f -iname 'adr-*' -exec basename {} \; \
  | grep -viE '^adr-[0-9]{3}-.+\.md$'
```

→ **printed nothing.** No malformed ADR filename.

**`/fkit-record-decision` Step B** — the highest number in use:

```
find ai-agents/knowledge-base/decisions -type f -iname 'adr-*' -exec basename {} \; \
  | grep -oiE '^adr-[0-9]{3}-' | grep -oE '[0-9]+' | sed 's/^0*//' | sort -n | tail -1
```

→ **44** before the write. Next free = **045**. Re-run after the write → **45**.

**The manual in-flight check the skill says no pipeline can do** — is 045 already spoken for by work
in flight (a brief promising it, a design report, an in-flight branch)?

```
grep -rni "adr-045\|adr 045" ai-agents/ claude/ test/
```

→ **the only hits were inside `0352`'s own `plan.md`**, which names 045 as the plan's expected
allocation. **No other claim anywhere.** I read the hits and judged them; 045 was free.

### The ledger-header conformance count (this is what condition E is ruled on)

Re-measured by a per-file loop over every `ai-agents/tasks/*/*/review.md`, reading the
`File(s) under review:` and `Status:` header fields:

| Fact | Value |
|---|---|
| Review ledgers on disk | **130** |
| Carrying `File(s) under review:` | **127** (3 have none); of those 127, **12 carry it empty** |
| `Status:` value beginning `in-review` | **43** |
| `Status:` value beginning `closed-out` | **63** |
| `Status:` value beginning with **neither** | **22** |
| No `Status:` line at all | **2** |

→ **24 of 130 (18%) do not expose a mechanically readable `Status:`.** This **reproduces the plan's
figures exactly**, independently re-run. The non-conforming values seen include `**closed-out**`
(bolded), `converged`, `resolved`, `coder-responded (Round 1)` and `CLOSED`. Quoted in the ADR at
§Context so a later reader sees the hazard was counted, not imagined.

### The "frozen" accuracy check the plan flagged

```
grep -nic "frozen" ai-agents/knowledge-base/decisions/adr-034-*.md      → 0
grep -rnic "frozen" ai-agents/knowledge-base/conventions/               → 0 in every file
```

→ **Confirmed: ADR-034 does not contain the word "frozen".** The brief's phrasing ("ADR-034 makes a
closed review ledger **frozen**") is a paraphrase, not ADR-034's wording. The ADR therefore **derives**
the closed-ledger edge from ADR-034's stated close bar and attributes the word "frozen" to
`claude/skills/fkit-task-done/SKILL.md`, where it genuinely appears (*"a historical record's **claims**
are frozen; its **links** are not"*), with an explicit ⚠️ note saying so.

---

## Verification — every step of plan §4, with its command and result

| # | Step | Command | Result |
|---|---|---|---|
| 1 | File exists, number correct, status set | `ls ai-agents/knowledge-base/decisions/adr-045-*.md` + `head -5` | **exactly one file**; `# ADR-045: …`, `- **Status:** accepted` ✅ |
| 2 | Number re-derived at write time | Step A / Step B / manual grep (above) | A empty, B=44 before, 045 unclaimed ✅ |
| 3 | Scope of the diff | `git status --porcelain` per tree | see §"This task's own contribution" below ✅ with one honest caveat |
| 4 | `fkit-task-brief` provably untouched | `git diff --stat -- claude/skills/fkit-task-brief/SKILL.md` | **empty output** ✅ |
| 5 | No size floor | `grep -niE 'trivial\|one-liner\|small enough\|under [0-9]+ (lines\|bytes\|words)\|[0-9]+[- ]line' <adr>` | **zero hits** (exit 1) ✅ |
| 6 | Standing rule quoted verbatim | `grep -c "smallest possible shippable tasks"` = **1**; quoted block diffed against `claude/skills/fkit-task-brief/SKILL.md` | **diff empty — byte-identical** ✅ |
| 7 | All five brief questions have a section; all limits ruled | `grep -n '^## \|^### '` walked against the brief | §1 entry condition · §2 route · §3 limits · §5 unchanged · §7 follow-ups, plus §4 (ADR-034) and §6 (anti-hole). No limit reads "to be decided" ✅ |
| 8 | ADR-034 named by number | `grep -c 'ADR-034'` = **10**; `grep -ni 'frozen'` = 3 hits, **all three attributing the word away from ADR-034** | ✅ |
| 9 | Follow-ups named, not edited | all six `claude/skills/<name>/SKILL.md` strings present in the ADR; cross-checked against step 3's **zero changes under `claude/`** | ✅ |
| 10 | Suite | `npm test` | see §Suite below |
| 11 | Recommend `fkit-wiki` ingest | — | recommended in the ADR's §Related and in the Build report. ⛔ **No vault file written** (ADR-005) |

**Extra self-check beyond §4** — the brief and plan both forbid `path:NNN` citations:

```
grep -nE '\.(md|sh|js|ts):[0-9]+' <adr>   → zero hits (exit 1)
```

Every citation in the ADR is a file plus a quoted phrase, per
`ai-agents/knowledge-base/conventions/durable-citation-anchors.md`.

---

## Suite

`npm test`, run 2026-08-30, **actual output**:

```
ℹ tests 792
ℹ pass 792
ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

**792 tests · 792 pass · 0 fail · exit code 0 · prove-red hard gate PASSED (28 mutations, each
redding its named assertion).**

This **equals** the plan's stated baseline, which is the expected result: **this task changed no
source and no test.** The figure above is the actual run, not the baseline line copied forward.

⚠️ **A process note, recorded rather than hidden.** My first `npm test` invocation piped through
`tail -40`, which showed the prove-red tail and exit code 0 but **truncated the `tests/pass/fail`
counts**. While that run was still in flight I had drafted the counts into this section from the
plan's baseline — an assertion ahead of its evidence. I replaced them with a pending marker before
the run landed, then re-ran the suite with a filter that captures the count lines, and the block
above is that second run's real output. Recorded under
`ai-agents/knowledge-base/conventions/evidence-before-assertion.md`.

---

## This task's own contribution to the diff

⚠️ **The tree is dirty with other workers' concurrent changes.** Reporting **my** contribution, not
the whole diffstat.

**Written by me — two files:**

- `ai-agents/knowledge-base/decisions/adr-045-…md` — **new** (untracked)
- `ai-agents/tasks/backlog/0352-…/worklog.md` — **new** (this file)

**Zero changes from me under `claude/`, `test/`, `ai-agents/wiki-vault/`** — all three report clean.

⚠️ **One honest caveat against plan §4 step 3, which expected zero changes under
`ai-agents/sprints/`.** `git status` shows `ai-agents/sprints/sprint-7.md` and
`ai-agents/sprints/backlog.md` modified, and `0352/brief.md` modified. **None of these are mine.** The
`sprint-7.md` diff and the `brief.md` diff are the same single edit — the board-status flip
`🔲 Backlog` → `🔄 In progress` on `0352`'s row — made by the driver/producer **before** this Build
worker ran. I read `brief.md` and `sprint-7.md`; I wrote to neither. Flagging it rather than reporting
a clean tree I did not have.

**`plan.md` was not re-authored or overwritten.** I read it and verified its blob hash; that is all.

---

## Decision log

**Autonomous decisions taken: none of substance.** Every question the plan left open was settled by an
owner ruling in `plan.md`'s header, and I applied all four:

| Ruling | Applied as |
|---|---|
| 1 — *"Approve as written (Rec)"* | Plan executed as written |
| 2 — *"accepted (Rec)"* | ADR header reads `- **Status:** accepted` |
| 3 — *"Name it as a candidate (Rec)"* | §7 names `fkit-task-ship-loop` as a **sixth follow-up candidate**, marked ⚠️ candidate, with ⛔ *filing it remains the producer's act*. **No skill file edited** |
| 4 — *"Keep it (Rec)"* | §3 limit 5 (ephemeral reviews) stated explicitly, and flagged in the ADR as an **addition** to the brief's four, not a substitution |

**Three drafting judgements I made inside the approved plan's bounds, recorded because they are mine:**

1. **I did not quote `fkit-process-stateful-review`'s phrase describing the `Action` cell's format**,
   although it was available and apt. That phrase contains a size-flavoured word, and quoting it would
   have put a size-ish string into an ADR whose verification turns on there being none. Paraphrased
   instead. **No content lost** — §2's rule about the `Action` cell is stated in full.
2. **I added a fourth rejected option** — *a new parallel store for in-flight fixes* — to §Options
   considered. The plan named three. This one is the obvious alternative mechanism a later reader would
   ask about, and the brief's own framing (*"not to invent a new mechanism"*) makes rejecting it by
   name worthwhile. It is recorded as *"rejected, not seriously considered"*, so it does not overstate
   the deliberation.
3. **I stated ADR-034's work-product bar by quoting it** rather than summarising, because §4 point 1's
   whole claim is that this ADR relaxes nothing in it.

---

## What I did NOT run, and did NOT do

- ⛔ **No commit, no push.**
- ⛔ **No wiki write** — `ai-agents/wiki-vault/` untouched (ADR-005). **fkit-wiki should ingest
  ADR-045**; recommending it is as far as I go.
- ⛔ **No skill edit, no source edit, no test edit.** `claude/` and `test/` both report clean.
- ⛔ **No board status change and no task-folder move.** The `🔄 In progress` flip already on disk is
  the driver's, not mine.
- ⛔ **`plan.md` not re-authored or overwritten.**
- **No `AskUserQuestion`** — absent in a spawn (ADR-021). The plan's three open questions were already
  ruled by the owner before this run, so nothing needed to be escalated.
- **I did not run a review of my own output.** That is the ship-loop's next step, not this worker's.
