# Worklog — `0352` — ADR: the narrow in-flight review-fix lane

**Build worker of `/fkit-sprint-ship-loop`, run as `fkit-architect`, 2026-08-30.**
Executed the plan at `plan.md` (blob `57331b2e5cb4fa11c05a10bb51f266b7e9569628`, 22300 bytes —
**re-verified against disk at the start of this run; it matched, so the paste and the file agreed**),
with the four owner rulings recorded in that file's header applied.

---

## What was written

**One deliverable, plus this task's own record — two files in total.** Stated both ways here because an
earlier draft of this worklog said *"one file, and nothing else"* in this section and *"two files"* further
down, which read as two different totals for the same run (review Round 1, finding R9).

**The deliverable — one file, and nothing else:**

`ai-agents/knowledge-base/decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task.md`

Title: *ADR-045: A reviewer's in-flight finding terminates in the review ledger, not in a new task
folder*. Status `accepted` (owner Ruling 2).

**This task's own record — one further file:** `worklog.md` (this file). It is not the deliverable; it is the
task's own record under ADR-034's split.

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
```

⚠️ **CORRECTED at review Round 1 (finding R7) — the second command's recorded result was false.** This
section previously also recorded `grep -rnic "frozen" ai-agents/knowledge-base/conventions/` as
*"→ 0 in every file"*. Re-run 2026-09-02, it returns **one hit in each of** `one-skill-one-output.md`,
`durable-citation-anchors.md` and `priority-is-rank-not-identity.md` (the folder's seven other files return
0). The same false claim was carried into ADR-045's §4 accuracy note and has been corrected there too.

**The conclusion below is unaffected** — it rests only on the ADR-034 half, which reproduces at 0.

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

**Written by me — two files** (the deliverable plus this task's own record; see §"What was written",
where the same total is now stated):

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

## Review Round 1 — decision log (Process-review worker, `fkit-coder`, 2026-09-02)

**Spawned by `/fkit-sprint-ship-loop` under its declared-approval marker**, against the plan at `plan.md`
(blob `57331b2e5cb4fa11c05a10bb51f266b7e9569628`, 22300 bytes — carried as a pointer, `cat`-ed from disk and
the blob re-verified before acting; it matched). The loop's single up-front plan approval stands in for
`fkit-process-stateful-review`'s per-round owner gate. ⭐ **Every fix applied without asking is logged below
with the finding it answers, what changed, and why it qualified** (ADR-019's audit obligation).

| Finding | What changed | Why it qualified |
|---|---|---|
| **R1** | §1: condition C now names the match rule (**prefix**) and the reader (**plain text, no binary-tolerant decoding**); a costs table gives the ledger count under all four combinations, and names the single NUL-byte ledger that explains the reader's difference of one | **Explicitly delegated to this worker by the spawn** as a drafting decision inside the approved plan. Prefix was chosen because it is the rule the ADR's own §Context figures were measured under; the plain reader because it is the reader condition E is written for. Verified `CORRECT`, localized to §1 |
| **R2** | §4 point 1: the *"by construction"* claim is **deleted**; the per-file / per-site mismatch with ADR-034 is stated, and the ruling separates *where a finding is recorded* (condition B, per-file) from *whether it blocks* (ADR-034, per-site). A frontier-move entry with a re-raise condition added to §Residual risks | **Owner Ruling A**, verbatim label *"Record as a deliberate frontier-move (Rec)"*. Condition B kept per-file per that ruling. Not an autonomous call |
| **R3** | §6 check 1: *"Nothing enters the lane that the owner did not see and approve"* **removed**; replaced with what the gate actually covers — every code change, but not the three coder-set terminal states — and the residual is named as not closed by this check | **Owner Ruling B**. Verified `CORRECT` against `fkit-process-stateful-review` Steps 2, 4 and 5 |
| **R4** | §3 limit 3: *"exactly the ledger's own close condition"* **withdrawn in the text**; a per-state table now says, for each of the four terminal states, who sets it and whether it is owner-confirmed. `won't fix (frontier)` is marked terminal **only once the residual is recorded** | **Owner Ruling B** — terminal set unchanged, claim fixed, per-state confirmation stated. Verified `PARTIALLY CORRECT`: the literal *"exactly"* is false, the underlying point survives |
| **R5** | §1: a rule added that condition A is **not** satisfied by a row seeded on the reviewer's behalf from pasted text | ⚠️ **Obvious-winner call, made autonomously — flagged for the owner.** No ruling covered R5. It stays inside the plan's intent: condition A's own stated meaning is *"the finding came from this review"*, and the owner had already kept limit 5 (plan Ruling 4, *"Keep it (Rec)"*), which the seeded-row path defeats. Closing the hole clearly dominates leaving a known way around an owner-kept limit. It narrows a binding entry condition, so it is called out rather than buried |
| **R6** | §6 check 2: *"the scope field cannot be edited"* **softened to the truth** — a rule the reviewer is bound by, unenforced and undetected by any test or hook, detectable only in review. §1's framing *"stated as a rule, not a hope"* likewise softened and cross-referenced | **Owner Ruling C**, verbatim label *"Soften to advisory, say so plainly (Rec)"*. ⛔ **No detection follow-up filed** — the owner chose the wording fix alone |
| **R7** | §4 point 3: the false half of the accuracy note (*"absent from both"*) **corrected in place**, with the three named conventions files and a re-run date; the same correction made in this worklog | Verified `CORRECT` — re-run reproduces 3 hits, not 0. Mechanical, localized, and the accuracy of a measurement callout is squarely inside the plan's §3 drafting constraints |
| **R8** | §6: the three checks now carry a table saying which is in force (**one**), and check 3 is marked as shipping with the §7 follow-up | Verified `CORRECT`. Mechanical, localized, and consistent with the ADR's own *"nothing changes behaviour until the follow-ups ship"* said three times elsewhere |
| **R9** | This worklog: §"What was written" now states the same total as §"This task's own contribution" — one deliverable plus this task's own record, two files — with the earlier discrepancy named | Verified `CORRECT`. Mechanical, localized, in-plan (the ledger lists this worklog under `File(s) under review:`) |

**Autonomous calls requiring the owner's eye: exactly one — R5.** Every other fix was either directly ruled
by the owner (R2, R3, R4, R6), delegated to this worker by the spawn (R1), or a verified-`CORRECT`
mechanical correction inside the approved plan (R7, R8, R9).

⚠️ **Out of scope, routed rather than fixed.** The reviewer found a literal **NUL byte at offset 12107** of
`ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/review.md`, which makes
the file's line content unretrievable by a reader that suppresses a whole file carrying a NUL.
⚠️ **Corrected in Round 3 (finding R15, owner Ruling H):** this sentence previously read *"which makes the
file invisible to a plain `grep`"*. Measured 2026-09-02, that is **false** — `/usr/bin/grep` (BSD grep
2.6.0-FreeBSD) and bare `ugrep 7.8.4` both return `Binary file … matches` and **exit 0**; only `ugrep -I`
returns nothing, and `-I` is injected by this environment's `grep` shell function, never typed. ⛔ The tool
naming is **deleted, not replaced**. Owner **Ruling D** (*"Fold into an existing sweep (Rec)"*) folds it into
sweep task `0357`. ⛔ **Not fixed here** — `0357` is another task's brief and outside this task's bounds. It
is reported to the driver for routing to a producer.

---

## Review Round 2 — decision log (Process-review worker, `fkit-coder`, 2026-09-02)

Same declared-approval marker as Round 1 (`/fkit-sprint-ship-loop`; plan blob
`57331b2e5cb4fa11c05a10bb51f266b7e9569628` re-verified against disk before acting — it matched). The
loop's single up-front plan approval stands in for the per-round owner gate. ⭐ **Every fix applied without
asking is logged below with the finding it answers, what changed, and why it qualified** (ADR-019's audit
obligation).

⭐ **Regression check first, because it is the finding behind the findings.** Four of this round's five
findings are defects **my own Round 1 fixes introduced** (R10, R12 ← the R1 fix; R11 ← the R5 fix; R13 ←
the R3 and R4 fixes contradicting each other). Cause: each Round 1 fix closed its finding by adding a
**new asserted claim**, and I verified only the claim I was fixing, never the claim I was writing.
Discipline adopted before editing this round, and followed: **(1)** no figure or quotation enters the ADR
unless a command run this round produced it, re-run after the edit; **(2)** prefer deleting a claim to
restating it; **(3)** every claim about skill text checked byte-for-byte against the skill file after the
edit; **(4)** a cross-section consistency sweep, because R13 exists precisely for want of one.
⭐ **It worked: the discipline caught a fifth instance before it shipped** — see R12 below.

| Finding | What changed | Why it qualified |
|---|---|---|
| **R10** | §1's prefix bullet: the count **16** stays, but the claimed benefit is corrected from *"16 ledgers whose reviews are genuinely open"* to the measured **2** (the other 14 carry decorated `closed-out …` values and fail either way). The overstatement is **named**, not swapped. Prefix kept — it strictly dominates | Verified `CORRECT` by independent re-measurement. Mechanical, localized to one bullet, inside the approved plan's §2.1 drafting scope, and it does not touch the ruling itself |
| **R11** | §1: seeded-row rule **kept**; over-breadth fixed so Step 0's bootstrap path is **not** barred; the gap stated in full (not a field, no author/origin column in either skill's schema, nothing marks a seeded row, *"binds … does not prevent"*); §7 names a **durable provenance field** follow-up; §1 heading, lead sentence, column header and two Consequences bullets swept for consistency; the informed re-confirmation recorded | **Owner Ruling E**, verbatim label *"Keep it, file a follow-up for a real field (Rec)"*, plus the spawn's explicit instruction to fix the over-breadth. ⛔ No skill file edited — the follow-up is **named only**, exactly like the other six. ⛔ **Deliberately did NOT** add a fourth row to §6's table: that restructures §6's "three checks" beyond the ruling; inline candour plus a cross-reference does the same job |
| **R12** | §1: reader named as a **behaviour** with `grep` as the example, not the definition; all four table row labels re-cut (the old `plain` / `binary-tolerant` pair was inverted against the prose); the ADR now records that four ordinary readers disagree with the chosen one and would yield 23 | **Owner Ruling F**, verbatim label *"Name the reader concretely (Rec)"*. ⚠️ **Applied with a DEVIATION from the ruling's presented wording, and returned for confirmation rather than settled here** — see the row below |
| **R12 — the deviation** | The ruling's phrase was *"a NUL suppresses **the line**"*. Re-measured, that is false: the NUL sits at **byte offset 12107**, deep in the body, the `Status:` header near the top is clean, and `grep` suppresses **the whole file** (a match on its first line also returns nothing). A per-line rule reproduces **23**, not 24. The ADR states the whole-file behaviour, which reproduces **24** | ⚠️ **A judgement call about an owner ruling — flagged, not buried.** It implements the ruling's **aim** (*"so 24 is reproducible from the ADR's own words"*) and its **shape** (behaviour, not tool), with the behaviour corrected to what measurement shows. ⛔ Writing the literal phrase would have shipped a fifth instance of the very defect class this round exists to stop. **Returned `NEEDS-DECISION` for the owner's confirmation** |
| **R13** | §6 check 1: the coder-set-with-no-owner-confirmation count corrected from **three** to **two** (`disproven`, `closeout (re-litigation)`), with the earlier miscount named and its direction stated (it *overstated* the residual). §3: the clause that `✅ done` *"is carried by that step's 'nothing blocking remains'"* **withdrawn** — a second conjunct is not an alternative membership test — and the ADR now states it reads nothing into, and settles nothing about, the skill's enumeration | Verified `CORRECT` against §3's own per-state table and the skill's Step 6 text. Mechanical, localized, in-plan. Both halves are corrections to **my own** Round 1 text |
| **R14** | §6: headline and table column reworded to **mechanically enforced**; the table now states that check 2 **binds** the reviewer (a rule that binds is in force *as a rule*) and lacks only enforcement/detection. Row 1 tightened in the same pass to name its mechanism, so the new column heading stays true of it | **Owner Ruling G**, verbatim label *"Reword to 'mechanically enforced' (Rec)"*, which ⛔ explicitly overrode the reviewer's own suggestion to record it `won't fix`. Row 1's tightening is the consistency sweep — changing a column heading without re-checking its rows is how R13 happened |
| **R2's residual entry** | ⛔ **Left as written.** The reviewer's note that it is broader than its own cause is **correct**, but an over-broad re-raise condition costs an extra look and can never cause a missed one — it errs toward re-opening, the safe direction. Tightening it would make re-raising an owner-ruled frontier-move harder | Judged **not a defect**. R2 is `won't fix (frontier)` by owner ruling and was **not** re-opened |

⚠️ **Autonomous calls needing the owner's eye this round: exactly one — the R12 deviation.** R10 and R13
are verified-`CORRECT` mechanical corrections inside the approved plan; R11, R12 and R14 were directly
ruled by the owner (Rulings E, F, G).

⚠️ **Supersession note, so no reader trusts a stale line.** The Round 1 decision-log row for **R1** above
describes the reader as *"plain text, no binary-tolerant decoding"*. ⛔ **That description is superseded by
R12 this round** — it is the wording the finding overturned. The row is left standing as the historical
record of what Round 1 did, not as a current description of the ADR.

⛔ **Ledger left `in-review`, not closed** — the same standard applied in Round 1. Step 6's close condition
is a **closed enumeration** (*"closeout / disproven / accepted"*) that does not name `✅ done`, which is
what all five rows are; and this round both deviates from Ruling F's presented wording and adds substantial
prose no reviewer has read.

---

## Review Round 3 — decision log (Process-review worker, `fkit-coder`, 2026-09-02)

Same declared-approval marker as Rounds 1–2 (`/fkit-sprint-ship-loop`; plan blob
`57331b2e5cb4fa11c05a10bb51f266b7e9569628`, 22300 bytes, re-verified against disk before acting — it
matched).

### ⭐ The discipline, extended before editing — and what it was extended to

Rounds 1–2 adopted four rules. ⛔ **They did not stop the class, because they governed only *figures* and
*quotations*.** Every figure held under two independent measurements this round; **R15 and R16 are neither
a figure nor a quotation** — one is a **characterisation of a tool**, the other a claim that something
**is a mechanism** — and each was written alongside a fix and never re-measured. R18 is rule 4's sweep
stopping one section short. Three rules added:

5. ⛔ **No characterisation of a tool, reader or artifact enters the document unless a command run this
   round produced that characterisation** — and the command must be one an independent reader can re-run
   **as written**. ⚠️ Where the environment shadows a tool (this shell's `grep` is a `ugrep` shim that
   injects `-I`), probe the **absolute binary**, and probe every invocation path claimed.
6. ⛔ **No claim that something is *mechanically enforced* unless the mechanism is located by name in a
   file and shown to fire on the relevant event.** A sentence in a skill file is **discipline, not
   mechanism**.
7. ⛔ **A correction's sweep is enumerated by `grep` over the whole document and this task's records, not
   from memory** — every hit listed with a disposition. R18 exists because R11's sweep was listed from
   memory and reported as complete.

⭐ **Structural reason this round is safer, and the condition owner Ruling L rests on: all four repairs
are deletions or qualifications.** No repair added a new asserted claim, so the failure class — a *new*
claim written alongside a fix and never measured — has no purchase on them.

| Finding | What changed | Why it qualified |
|---|---|---|
| **R15** | §1's reader bullets: the clause *"as `grep` without `-a` does"*, the sentence *"`grep` without `-a` nonetheless returns **nothing** … a match on its very first line included"*, the clause *"`grep` without `-a` finds no `Status:` line"* and the attribution *"the `grep` probed here was `ugrep 7.8.4`…"* are **deleted**. ⛔ **No replacement tool characterisation written** — the bullet now says no tool is named, as definition or example, and records the removal. The **behaviour definition is kept** (a NUL anywhere ⇒ the whole file unreadable) and the counts are untouched. The same false clause in this worklog is fixed the same way | **Owner Ruling H**, verbatim label *"Delete the clause and attribution (Rec)"*. Verified `CORRECT` by my own three-way probe: `/usr/bin/grep` (BSD grep 2.6.0-FreeBSD) → `Binary file … matches`, **exit 0**, for `^Status:` and a first-line pattern alike; bare `ugrep 7.8.4` (via the shim's own binary, no `-I`) → **identical**; `ugrep -I` → nothing, exit 1. `command -v ugrep` → **not found**. `-I` is injected at `snapshot-zsh-…v239z7.sh` lines 4467–4471. Deletion-only, localized, in-plan |
| **R16** | §6: headline **"Exactly one … mechanically enforced"** → **"*None* of them is"**; table row 1 **"✅ Yes"** → **"⚠️ No — role discipline only"**, worded to mirror row 2 exactly; a plain sentence added that the anti-hole answer **rests on role discipline**; item 1's heading *"already in force"* → *"binding"*, and its *"No lane fix reaches the codebase unapproved — that much is exact"* qualified to *"is permitted to … exact **as a rule**"*; item 3's half-swept *"not yet in force"* → *"it does not exist yet"* | **Owner Ruling I**, verbatim label *"Row 1 becomes 'No — role discipline only' (Rec)"*. Verified `CORRECT`: `build_settings()` in `claude/fkit-claude.sh` wires `PreToolUse` on **`Skill`**, **`AskUserQuestion`**, **`Agent\|Task`**, plus `Stop` and `UserPromptExpansion` — ⛔ **no matcher for `Edit`, `Write` or `Bash`**; `askuserquestion-marker-hook.sh` / `shiploop-marker-hook.sh` self-document *"NEVER DENIES"* / *"NEVER BLOCKS"*; `carry-check-hook.mjs` states a hook can *"**NEVER** establish that P is what the owner approved — approval lives in a session channel that leaves no artifact (ADR-021)"*. ⭐ **The hook-wiring evidence is recorded HERE, not imported into the ADR** — row 1 borrows row 2's own wording, so the ADR gains **no new asserted claim** |
| **R17** | §1's seeded-row bullet: *"is **not** barred"* → *"is **not barred by that fact alone; the origin test still applies to whatever was handed**"*, plus a clause naming why — Step 0 carries **no origin guarantee**, and being seeded there is a **transport**, which the bullet above rules A does not test | **Owner Ruling J**, verbatim label *"Add the qualification (Rec)"*. Verified `CORRECT` against `claude/skills/fkit-process-stateful-review/SKILL.md` Step 0, whitespace-normalised: *"seed *Reviewer findings* from **whatever** findings you were handed"*. ⭐ **Owner Ruling E is preserved exactly** — the seeded-row rule is neither widened nor narrowed; only its illustrating example is qualified |
| **R18** | All **three** sites corrected together: **§4 point 1** (*"keeps the gate a field read with no judgement at gate time, which is the property the entry condition exists to have"* → a per-site test would add a **second** judgement; the gate is **not** judgement-free, since condition A carries one); **§Residual risks** (same phrase → *"B itself stays a field read and the gate carries no **second** judgement"*, with A's judgement named); and the shared ***Accepted residuals*** entry's *Why* clause in `review.md` | **Owner Ruling K**, verbatim label *"Correct all three together (Rec)"*. Verified `CORRECT`: §1 and Consequences already say condition A *"is not yet a field read"* and is *"a judgement at the gate"*, so two sections contradicted each other. ⛔ **R2 is NOT re-opened** — it stays `won't fix (frontier)`; only a **stale phrase inside its recorded reason** is corrected, and the correction is labelled as such in the entry itself. Post-edit `grep` for `judgement at gate` / `field read` across the ADR and both records: **no stale hit remains** |

| **§Context re-measure** *(not a reviewer finding — a defect my own close created)* | §Context's re-measure sentence read `in-review` **44**, `closed-out` **64**. Setting this ledger to `closed-out` under Ruling L moved **`0352`'s own row**, making today's reading **43 / 65**. The figure is corrected and the cause named, so a reader does not read one row moving as corpus drift | ⭐ **Caught by new rule 7** — re-checking a figure my own edit perturbed. Verified `CORRECT` by re-running the per-file loop **after** the flip. Mechanical, localized to one sentence, inside the approved plan's §Context scope, and a correction to an existing measured figure, **not a new asserted claim**. ⛔ The headline **24 — 18%** and all four combinations (**24 / 23 / 40 / 39**), the disagreement set (**16**, open **2**) are **unchanged after the flip** — re-measured to confirm |

⚠️ **Autonomous calls needing the owner's eye this round: none.** All four findings were directly ruled by
the owner (Rulings H, I, J, K) and each was independently verified `CORRECT` before being applied. ⛔ **No
obvious-winner call was made.** ⚠️ **One in-plan mechanical fix was applied outside the four rulings** —
the §Context row-level figure my own close invalidated (row above). It is recorded here rather than
folded silently into a ruling's row, because no ruling covers it. The only judgement inside a ruling's scope — how far R15's deletion
reaches — is recorded in the R15 row above: two further false `grep` clauses in the same passage were
removed **by deletion**, under Ruling H's stated shape (*delete, do not write a replacement*), rather than
left standing as verified-false text.

⚠️ **Supersession note, so no reader trusts a stale line.** The **Round 2** rows for **R12** and **R12 —
the deviation** above describe the reader as *"`grep` as the example, not the definition"* and assert that
*"`grep` suppresses the whole file (a match on its first line also returns nothing)"*. ⛔ **Both
descriptions are superseded by R15 this round:** no tool is named in the ADR at all, and the *"returns
nothing"* behaviour belongs to `ugrep -I`, not to `grep`. Those rows stand as the historical record of what
Round 2 did, **not** as current descriptions of the ADR. ⭐ **The whole-file-not-per-line ruling they carry
is unaffected** — it reproduces on BSD grep too, and the counts are unchanged.

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
