# Worklog — `0337`

## Build pass — 2026-09-10, fkit-architect (spawned by `fkit-sprint-ship-loop`)

**Baseline:** HEAD `9943dcf13633e576761f7b76dd4a4b30c754de00`, unchanged at the end of the pass
(re-checked).

**Plan contract verified before any write.** `git hash-object` on
`plan.md` returned `25c35af38d918e7270ba9775bfcd3bbd8c67c16a`, 22503 bytes — **matching the pointer in
the spawn prompt exactly.** The file was read in full and is the contract for this pass.

### What was written — the whole change surface, and nothing else

| File | Act |
|---|---|
| `ai-agents/knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md` | **new** — the ADR, status `accepted` |
| `ai-agents/knowledge-base/decisions/adr-041-…-not-by-filename-glob.md` | **appended** — a dated ⛔ supersession-in-part notice plus one `- **Superseded in part:**` metadata bullet |
| this `worklog.md` | **new** |

⛔ Nothing else was touched. No source file, no skill, no test, no sprint board, no `.claude/`, no
`ai-agents/wiki-vault/`, no folder moved, no board row flipped, no commit, no push.

### ADR number

Allocated **047**. Sweep run per `/fkit-record-decision` Step 2: the malformed-filename check printed
nothing; the highest number on disk was **46** over **46** files; `grep -rn "ADR-047\|adr-047"` over
`ai-agents/`, `claude/` and `test/` returned hits **only** in this task's own `plan.md` — this ADR's
own reservation, no foreign claimant.

### The four owner rulings, and where each landed

- **V1** (*"Re-order — 0340 before 0338 (Rec)"*) — recorded as ADR-047 §Consequences bullet 2, an
  **ordering constraint stated as a consequence**. ⛔ The ADR touches no sprint board; the re-order is
  the producer's separate act. The two rejected options are on the record as §Options (d) and (e).
- **V2** (*"`🔲 Backlog`"*) — the owner **overruled** the architect's `🔲 Planned` recommendation.
  ADR-047 §1's table carries the ruled value, and **§1.1 carries the architect's objection in full**:
  `Backlog` is already a load-bearing identity token (ADR-041 §2 plus `resolve_identity`'s basename
  special case), so one word now carries two meanings. §1.1 states the **by-POSITION disambiguation
  rule** as the thing that makes the collision survivable, and names the owner's basis for the ruling.
  ⛔ The ruling is not softened and the objection is not dropped.
- **V3** (*"Keep — permanent compat rung (Rec)"*) — `🔒 CLOSED` reads as `✅ Done` **forever**; §2's
  recognizer carries it as a permanent alternative, test **P2** pins it, and §8.1 records **no change**
  to the seven archived boards. Its accepted consequence — `0340`'s title is now wrong — is named in
  §8.1 and explicitly assigned to the **producer**.
- **V4** (*"0341 adds it in the same change (Rec)"*) — ADR-047 **§3.1**, as a required follow-up on
  `0341`, with the measured coordinate `test/coordination-citation-policy.test.js:447-448`.

### Two deviations from the brief, both declared in the plan and both carried into the ADR

1. **The brief's verification step 8** asked the ADR to name the falsified ADR-041 sites by line
   (`:66-68, 77-78, …`). Those numbers shift the moment the supersession notice is appended — which
   the same brief also requires. ⭐ Satisfied by **§-number plus quoted fragment** instead (ADR-047
   §8.2). Intent met, literal digits not.
2. **The brief's migration list was stale.** Measured 2026-09-10: `sprints/done/` holds **seven**
   boards (`sprint-1` … `sprint-7`), all seven carrying `> ## 🔒 CLOSED — <date>.` at line 3; the top
   holds `backlog.md` + `sprint-8.md`. The brief said five and named `sprint-6.md` as live. ADR-047
   §8.1 records the measured state.

### Authoring constraints obeyed — stated so a reviewer does not "fix" them

- ⛔ **No forward markdown links.** `ai-agents/knowledge-base/` **is** link-scanned
  (`test/reference-integrity.test.js:181` exempts only `ai-agents/wiki-vault/` — ⚠️ **`:180` here
  until 2026-09-11; corrected under owner ruling Y2, review R31. `:180` is
  `export function exempt(rel) {`; the exemption is `:181`**), so
  `conventions/sprint-status-vocabulary.md`, `ai-agents/sprints/cancelled/` and the two mover skill
  directories appear **in backticks as prose**, never as links. Every markdown link in the ADR points
  at a file verified to exist.
- **Coordination documents cited by heading + quoted fragment, never `path:NNN`** — ADR-041 included,
  for the reason above.
- ⚠️ **One extra citation deviation, declared in ADR-047 §2.4 rather than hidden:**
  `test/dashboard-contract.test.js` is cited by **test name and quoted fragment**, not `path:NNN`,
  because a parallel coder has it modified in the working tree — the plan's own `:2536` coordinate had
  already moved to `:2583` before this ADR was written. The durable-citation convention's first row
  permits `path:NNN` for a test file; it is declined here on the evidence.
- **Append-only on ADR-041, proved by diff, not by eye:** `git diff --numstat` = **`65  0`**; the
  deletion filter `git diff -U0 | grep '^-' | grep -v '^---'` returned **empty**. The file was clean in
  the working tree at the start of the pass, so the working-tree diff is a valid isolation.

### Verification — the plan's six steps, measured

| Step | Result |
|---|---|
| 1 · ADR exists; Authority quotes OQ-1/OQ-3/SD-1/SD-2/SD-3 verbatim with date + channel; OQ-2 answer verbatim | **PASS** — ⚠️ **count corrected 2026-09-10 (review R15): the original cell said "all eight … (six from 2026-08-25, V1–V4 from 2026-09-10)", which is self-contradictory — six plus four is ten.** Re-measured against ADR-047's Authority tables: **nine verbatim option labels** — **five** from 2026-08-25 (OQ-1, OQ-3, SD-1, SD-2, SD-3; ⛔ **OQ-2 is free text, NOT an option label**) plus **four** from 2026-09-10 (V1–V4) — each found exactly once; **plus** the OQ-2 free-text answer, quoted whole. ⭐ **Bookkeeping only: the underlying check passed then and passes now.** ⚠️ The round-3 amendment adds **two more** labels (W1, W2), taking the total to **eleven** |
| 2 · Points 1–8 each have their own heading | **PASS** — `### 1.` … `### 8.`, eight headings, none folded away |
| 3 · `grep -n "highest"` — every hit is the superseded rule or option-(d) history | **PASS** — 10 hits: the title's own negation, the task-folder name, the owner's report, ADR-041's re-raise bullet, the old ordering, the two §8.2 supersession bullets, the prose-ripple bullet, the closeout line, and the ADR-**number** sweep (a different sense of the word). None asserts the new rule is highest |
| 4 · ADR-041 carries the dated superseded-in-part note, scoped | **PASS** — see the append-only proof above |
| 5 · Required-tests table with fixture + expected output | **PASS** — **11** rows (P1–P11), covering all nine cases the plan enumerated plus two extra (strict-line-3, and the archival drift's emitter assignment) |
| 6 · `git status` clean outside `knowledge-base/decisions/` | **PASS as the plan defines it** — see below |

⚠️ **Step 6, read as the plan instructs — *"no source, skill or sprint changes."*** This pass's own
change surface is the three files in the table at the top. Everything else in `git status` is **not
this task's**: the driver's Sprint 8 creation and brief status flips, `0383`/`0384`, `0358`'s ledger
closeout, two `wiki-vault/` writes, plus two files in flight from **parallel workers** —
`test/dashboard-contract.test.js` and `test/prove-red.sh` (a coder on `0271`) and
`ai-agents/sprints/backlog.md` (a producer re-ordering Sprint 8). ⛔ **No `claude/` file is modified at
all.**

### Test runs — measured counts

- `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` →
  **41 pass / 0 fail** (20 + 21 when run separately). The link guard reported
  *"scanned 884 files, resolved 3479 link targets, 0 broken, 7 named-exempt"* — ⭐ **0 broken with the
  new ADR in the corpus**, which is the constraint that would have redded on a single forward link.
- **Full `npm test` — exit code 0.** Measured in two parts, because `npm test` is
  `node --test test/*.test.js && bash test/prove-red.sh` and the piped tail kept only the second half:
  - unit phase, re-run and captured directly — **877 tests / 877 pass / 0 fail / 0 skipped / 0 todo,
    24 suites**;
  - mutation gate — **`✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED
    assertion`**, over **32** mutations.
- ⚠️ **Both figures moved from the driver's last-measured baseline (872 tests, 31 mutations), and
  NEITHER movement is this task's.** This pass wrote **no test and no source file**. The deltas are the
  parallel coder's in-flight `0271` work, visible in the working tree as modified
  `test/dashboard-contract.test.js` and `test/prove-red.sh` — mutation **32** is literally named
  `0271/1`. ⭐ Stated rather than claimed as this task's own improvement.
- ⚠️ **Contention note, not a result:** two `bash test/prove-red.sh` runs were live at once (this pass's,
  inside `npm test`, and the coder's own), which is why the full run took ~20 minutes rather than the
  usual few. Both gates passed.

### Residuals handed forward

1. **ADR-047 should be ingested into the wiki by `fkit-wiki`** — the architect does not write
   `ai-agents/wiki-vault/`. ⚠️ **ADR-041's wiki page is now stale** as well, because this pass appended
   to it; a re-ingest of both is the right act.
2. **`0340`'s title is wrong after V3** — *"backfill onto EVERY existing sprint plan"* when seven of
   eight boards are untouched. **The producer's to correct**, named in ADR-047 §8.1.
3. **`0341` gains a required follow-up** (V4): the `ai-agents/sprints/cancelled/` exemption entry must
   ship in the same commit as the folder. **The producer's to note on the brief**, named in
   ADR-047 §3.1.
4. **`0338`'s scope grew a hard constraint it should be told about explicitly** — ADR-047 §2.4: eight
   named S-scenarios must be **repinned**, and the `activeLine` helper silently swallows plural
   `active` lines, so a wrong test would stay green.

---

## Amendment pass — 2026-09-10, fkit-architect (spawned by `fkit-sprint-ship-loop`), round-1 review

⭐ **Two owner rulings, live `AskUserQuestion`, option labels verbatim: W1 "Amend ADR-047 now (Rec)"
and W2 "Bump to v2 (Rec)".** ⛔ **`plan.md` was NOT re-authored** — the 2026-09-10 plan gate (V1–V4)
stands untouched.

### Change surface — three files, nothing else

| File | Change |
|---|---|
| `ai-agents/knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md` | amended in place; every amendment dated and attributed at its own site |
| `ai-agents/knowledge-base/decisions/adr-041-…-not-by-filename-glob.md` | ⛔ **append-only preserved** — one new item 7 and one clarifying line inserted **inside this task's own uncommitted notice**; measured `78 added / 0 deleted` against `HEAD` |
| this `worklog.md` | R15's count corrected in place; this section appended |

⛔ **Not touched:** `ai-agents/sprints/`, `test/`, any source file, the review ledger's *Reviewer
findings*, the wiki vault, `.claude/`. **No commit, no push, no mover.**

### Findings closed, and how

| # | Sev | Closed by |
|---|---|---|
| **R1** | high | **§2.3a (new)** — a normative field-set table per line kind. `board` now carries `status=` **and** `reason=`; `active none` is declared a **field-less sentinel**; one-space separators; parse-by-key |
| **R2** | high | **§3.0 (new)** — one row-disposition rule for **both** movers. Closed rows frozen; open rows always relocated, never blocking the close; `/fkit-sprint-done` → lowest-ordered non-terminal successor, else the Backlog board; `/fkit-sprint-cancelled` → always the Backlog board. ⛔ Refuse-to-close and freeze-in-place **rejected by name**. Built on the Sprint 6 → Sprint 7 worked precedent |
| **R3** | high | **§6.4 (new)** — **filter first, tie-break second**, as a four-step ordering. ⭐ `ambiguous-active-sprint` still fires on **any** same-identity collision, mixed status included. §8.2 records the rule-survives/set-changes split; ADR-041's notice gains item 7; **P12** pins it |
| **R4** | medium | **§2** — the recognizer now requires ` — YYYY-MM-DD.`; a malformed banner → `unresolved` + new **`drift sprint-status-malformed`** (§7), distinct from `sprint-status-missing`. **P16** pins it. Verified: all seven real `🔒 CLOSED` banners still match |
| **R5** | medium | **§6.1** — *"invert the comparison"* replaced with a three-row table naming the **argument swap** as correct and the `!` negation as the trap that flips first-wins → last-wins. **P14** fails under the trap and passes under the swap |
| **R6** | medium | **§7.1 carve-out 2** — **three** drifts, not two: `sprint-status-location-mismatch` added. §7 gains an **Emitted by** column |
| **R7** | medium | **§7's emitter column** + roll-up-reach asserted in **P3, P7, P11, P12, P13, P15, P16** — one per drift kind, none untested |
| **R8** | medium | **§4** — the *"the order the task movers already do it"* claim is **withdrawn as false** (measured `fkit-task-done/SKILL.md:123` before `:134`); the inversion is now declared, with its reason and its cost |
| **R9** | medium | **§9 (new)**, under **W2** — `⟦fkit-dashboard v2⟧`, with the three obliged sites tabulated and the two easy-to-miss consequences named. ⛔ **`0338` performs the changes; this ADR records the requirement** |
| **R10** | low | **§1.2 (new)** — the `unresolved` identity/status collision named to §1.1's standard, with the by-position rule and an explicit warning that §7.1 carve-out 1 is **identity-space** |
| **R11** | low | **§1.1** — coordinate corrected to `:144-164` (branch) / `:148` (the `basename` test); §7.1's `:150-163` → `:149-152` |
| **R12** | low | **§8.2** — ADR-041's `## Decision` block added to the falsified list, quoted, falsified in **both** direction and singularity |
| **R13** | low | **§2** — "exactly one banner" restated as an **authoring convention, not a check**; only line 3 is read; **P10 pins the tolerance** rather than contradicting it |
| **R14** | low | **§2.3a** — one space, matching the live emitter; the two-space form declared alignment and withdrawn |
| **R15** | low | this worklog's step-1 row — corrected to **nine** labels + one free-text answer (eleven after round 3) |

⛔ **Nothing was left open.** All fifteen round-1 findings are closed in this pass.

### Verification — measured this turn, at `HEAD 9943dcf`

| Check | Result |
|---|---|
| `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` | **41/41 pass, 0 fail** — no forward link, no `path:NNN` on a coordination document |
| `git diff --numstat` on ADR-041 | **`78 0`** — append-only held |
| ADR-047 markdown links | every new `[…](….md)` form written **inside backticks**, as the pre-existing ones are |
| Source coordinates re-measured | `dashboard.sh` `:53` `:144-164` `:148` `:149-152` `:187-192` `:265` `:269` `:272` `:282` `:372` `:1199`; `SKILL.md` `:53` `:223` `:229`; `fkit-task-done/SKILL.md` `:123`/`:134`; `fkit-task-cancelled/SKILL.md` `:102`/`:113` |
| `test/dashboard-contract.test.js` | ⛔ cited **by test name only** — a parallel coder holds that file |

### Residuals handed forward from this pass

1. ⭐ **Four of the amendments are the ARCHITECT's design calls made under W1** — the owner ruled
   *that* they be decided here, not *what* they decide: §3.0's row policy, §6.4's precedence, §2's
   tightened recognizer, §2.3a's uniformity choice. **Each has a `Re-raise only if` trigger.** ⚠️ Worth
   the owner's eye on §3.0 in particular — it is the one with a product-shaped edge.
2. **`0338` gains §9** — the `v2` bump, five test assertions (by name) and three `SKILL.md` sites,
   **plus** the §6.1 argument swap, on top of §2.4's eight repins.
3. **`0341` gains §3.0** — the Done mover's row policy, which it previously had to invent.
4. **The wiki re-ingest named in the build pass now covers this amendment too.**

---

## Round-2 review amendment — 2026-09-10, owner rulings X1 / X2 / X3

⛔ **Second amendment to an accepted ADR.** Round 2 returned **eleven** findings. ⚠️ **Eight of them
were created or left open by the round-1 (W1) amendment** — recorded plainly, not softened.

### Rulings

| # | Verbatim label | What it settled |
|---|---|---|
| **X1** | **"Amend again — R16 first (Rec)"** | Amend in place for R16–R21 and R23/R24/R25. ⛔ *"Fix R16 only, hand the rest forward"* and *"Hand all forward"* NOT taken. Basis: W1's, unchanged — a design ruling decided inside a consuming task lands in the wrong place, and in two places |
| **X2** | **"Record as accepted residual (Rec)"** | ⛔ R22 — the seven `drift` field sets are **NOT** defined here; an *Accepted residual* is recorded in full instead |
| **X3** | **"Add the two triggers (Rec)"** | R26 — `Re-raise only if` triggers added for §4's step-order inversion and §7's emitter assignment |

### R16 — the blocker, and what it cost

⛔ **W1's closure of R7 recreated the defect R6 closed: a property demanded of a mode that cannot
produce it.** §7's foot required five `select-active` drifts to *"reach the roll-up"* — and
`select-active` has **no roll-up**. **Measured this turn:** the roll-up and its `drift_clause` are
built only in the one-argument board render (`dashboard.sh:1136-1205`, `:1185-1196`); the file's own
contract comment says so at `:30`; `mode_select_active` prints `⟦FACTS⟧`, `⟦END⟧`, exits (`:292-297`).
**Consequence: P3/P7/P12/P15/P16 were unwritable and `0338` was unstartable.**

⭐ **The design call (architect's, under X1) — §7.2, new: the obligation is *reach BEAT 6*, by the
route the mode has.**

- `select-active` → the `⟦FACTS⟧` block, **which is its whole output**. ⛔ It gains **no** roll-up.
- the render path → `⟦FACTS⟧` **and** the roll-up's drift clause, exactly as ADR-041 §1.5 always said.
- The per-board drifts are emitted from **both** modes — ⭐ the repo's own worked precedent
  (`dashboard.sh:1160-1162`), not new duplication.
- ⛔ **`ambiguous-active-sprint` and `ambiguous-plan-identity` are NOT merged.** Two names for one
  condition, deliberately — the code's comment at `:1173-1174` rules `chosen=` apart from `plan=`.
  `ambiguous-plan-identity` is added to §7's table, which had never listed it.
- ⚠️ **The one fact with no render-path route is named, not hidden:** `ambiguous-active-marker` needs
  line 3 of every sibling and the render path reads first lines only. `⟦FACTS⟧`-only, cost stated,
  re-raise trigger written.

⭐ **This supersedes nothing further in ADR-041 — checked.** §1.5's reach rule was **always**
render-path-scoped by its own text (it names `plan_level_drift`, which exists only in the render). It
was ADR-047's own foot that over-generalized it.

### Every finding, and how it closed

| # | Sev | Closed by |
|---|---|---|
| **R16** | high | **§7.2 (new)** + §7's table (now mode-scoped, `ambiguous-plan-identity` added) + P3/P7/P12/P15/P16 restated to their mode's route |
| **R17** | medium | **§3.0.1 (new)** — the successor marker is `[<identity>](../<basename>)`. ⛔ Both defects fixed: filename-as-identity (the vocabulary itself writes the href as `(…)`) and the missing `../` its sibling marker already carried |
| **R18** | medium | **§3.0.2 (new)** — all three pinned: enumeration set = depth 1 of `sprints/`; tie-break = §6.4 steps 3–4 with step 2 **replaced** by §3.0's own filter; `M` = **append**, per ADR-035's *"it appends"*, never carried over. ⛔ The row-policy CHOICE untouched |
| **R19** | medium | **"sweep" struck from every row** — §7's table, §7.1 carve-out 2, P13. No sweep mode exists (`dashboard.sh:218`, dispatch `:305-309`, `grep -c sweep` = **0**) |
| **R20** | medium | **§9.2 item 1** — *"EVERY mode"* → *"BOTH envelope-printing modes"*, with the regression named: `mode_identity` emits no marker by design (`:223-225`) and §2.3a gives `status` the same contract |
| **R21** | medium | **§2.3's two blocks gain `⟦END⟧`** + P17 asserts it. Live stream measured: `⟦FACTS⟧` then `⟦END⟧` (`:295`) |
| **R22** | medium | ⛔ **NOT fixed — Accepted residual (X2)**, in §Consequences in full What / Why (structural) / Re-raise only if shape, on ADR-041 §1.5's *"wording is the implementer's"*, covering **all** drift record shapes |
| **R23** | low | **§1.2** — `backlog.md` is the **one-of-each** case (identity `Backlog`, status `unresolved`); the both-unresolved case restated correctly |
| **R24** | low | **Decided: §7.1 wins.** The carve-out is `sprint-status-missing`-only; `sprint-status-malformed` is **not** carved out for any identity. §2, §7.1 and **P16** all say so now |
| **R25** | low | `test/reference-integrity.test.js:180` → **`:181`** at **both** sites (§Authoring constraints, §Related) |
| **R26** | low | **X3** — triggers added for §4's inversion and §7's emitter assignment; a third added for R16's `⟦FACTS⟧`-only residual |

⛔ **Nothing was left open.** ⭐ **Nothing round 2 VERIFIED was disturbed** — R1, R3, R4 (the tightened
recognizer), R5/P14, R8, R9, R11, R12, R13, R14 and ADR-041's `78 0` append are all untouched by this
pass. P11 and P13 keep their roll-up assertions **because they are render-path facts**; only the five
`select-active` facts changed route.

### Verification — measured this turn

| Check | Result |
|---|---|
| `npm test` node phase | **877/877 pass, 0 fail** |
| `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` | **41/41 pass, 0 fail** |
| knowledge-base-scanning superset | **332/332 pass, 0 fail** |
| `git diff --numstat` on ADR-041 | **`78 0`** — append-only held, and **no further append was needed** |
| New markdown links | `adr-035-…` and `conventions/priority-is-rank-not-identity.md` — **both verified to exist** before linking |
| `test/dashboard-contract.test.js` | ⛔ cited **by test name only** — a parallel worker holds that file |
| ⛔ `prove-red` | **NOT RUN, deliberately.** It runs the full ~470s suite per mutation across 32 mutations (4+ hours) and **this fence holds no executable file** — two ADRs and this worklog. There is no mutation to make |

---

## Round-3 review DISPOSITION — 2026-09-11, owner rulings Y1 / Y2 / Y3 / Y4

⛔ **This pass is a DISPOSITION, not a third amendment.** ⭐ **The owner ruled the amend-loop ENDS
HERE.** Round 3 returned **five** findings (R27–R31). ⛔ **No new section, no new rule, and §3.0.2 was
NOT amended a third time.**

### Rulings — `AskUserQuestion`, 2026-09-11, option labels verbatim

| # | Verbatim label | What it settled |
|---|---|---|
| **Y1** | **"Record as follow-ups on 0341 (Rec)"** | ⛔ **R27 and R28 are NOT amendments.** Both are recorded as **required follow-ups on `0341`** in §3.1's existing pattern. ⭐ Owner's basis, recorded: neither is a design ruling that would land in the wrong document, and both fall on `0341`, which has not started |
| **Y2** | **"Correct in passing (Rec)"** | R29 and R31 — two wrong facts, fixed as corrections during this pass, ⛔ **not as a review round** |
| **Y3** | **"Accepted residual (Rec)"** | ⛔ **R30 gets NO stop condition in §4** — that would be a third amendment. An *Accepted residual* is recorded in full What / Why (structural) / Re-raise only if shape instead. ⭐ Owner's basis: the task movers' step 1 is the precedent `0341` mirrors anyway, and §3.0 rule 1 already makes a re-run idempotent |
| **Y4** | **"Close 0337, unblock 0338 (Rec)"** | After these dispositions `0337` closes. ⛔ **The architect holds no movers (ADR-033)** — the driver routes a producer. The review ledger's `Status:` is set to `closed-out` by this pass |

### Every finding, and how it closed

| # | Sev (derived) | Closed by |
|---|---|---|
| **R27** | medium | ⛔ **NOT an amendment — §3.1 FOLLOW-UP 2 on `0341` (Y1).** The gap is real and measured: the mover is prose, and **no `dashboard.sh` mode orders a `Backlog` ∪ `In progress` set.** ⭐ The close is a **pointer, not a ruling** — ADR-041 §5, already listed in §8.2 as *"in force and untouched"*, decides the half that matters (*"The exact CLI surface is the implementer's call; re-implementing the grammar is not"*), so the prose-comparator route is **already forbidden** and the surface is already `0341`'s call. ⛔ §3.0.2's rule is untouched |
| **R28** | medium | ⛔ **NOT an amendment — §3.1 FOLLOW-UP 3 on `0341` (Y1).** ⚠️ **Named regression:** the de-scope procedure is **Backlog-only** and manufactures the `drift disagreement` its own ⚠️ documents as *"Verified empirically"*. ⭐ **The right procedure is named** — *"Pulling a backlog task into a sprint"*, the immediately preceding bullet in the same list. Both tails carried: the `M` quote's mis-attribution, and step 2's filename-as-identity marker that §3.0.1 withdrew under R17 |
| **R29** | low | ⭐ **Corrected in the ADR (Y2)** — the X2 residual's *Why* clause. ⛔ **X2's decision is not re-argued.** Nine kinds, **two** with a shape (`ambiguous-active-sprint` from ADR-041 §1.5; `ambiguous-plan-identity` live at `claude/skills/fkit-status/dashboard.sh:1175`), **seven** the implementer's — so the clause now agrees with the heading and with X2's Authority row, both of which already said seven. ⛔ `ambiguous-plan-identity` is explicitly **not** `0338`'s to reshape |
| **R30** | low | ⛔ **NOT fixed — Accepted residual (Y3)**, recorded in full in the review ledger's *Accepted residuals* section. ⛔ **No stop condition added to §4.** ⭐ Why acceptable: §4 reuses ADR-033's mover reasoning *"verbatim"* and both task movers carry an explicit step 1 *"Resolve and validate the input"*, so `0341` mirrors a precedent shape; §3.0 rule 1 already makes a re-run idempotent on rows |
| **R31** | low | ⭐ **Corrected in this worklog (Y2)** — `test/reference-integrity.test.js:180` → **`:181`** at the **third** site, in *"Authoring constraints obeyed"*. ⛔ **R25 stays CLOSED** — both ADR sites it named already read `:181`; this site R25 never named. ⭐ No spec impact |

⛔ **Nothing round 3 VERIFIED was disturbed.** R16's closure on `claude/skills/fkit-status/dashboard.sh:28-31`'s
own contract comment, all nine drift kinds' coverage by P3/P7/P11/P12/P13/P15/P16, R26 trigger 2 not
firing a third time, `ambiguous-active-marker`'s `⟦FACTS⟧`-only scope, and R17–R25 are all untouched by
this pass. ⛔ **The §3.0.2 Sprint 7 citation the reviewer noted and deliberately did NOT raise** (a
board heading stamped *(SUPERSEDED 2026-08-29)* whose quoted rule survives) was **not chased** — it is
citation quality, not under-determination.

### Verification — measured this turn

| Check | Result |
|---|---|
| `npm run test:unit` | **877/877 pass, 0 fail** |
| `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` | **41/41 pass, 0 fail** |
| nine knowledge-base scanners | **184/184 pass, 0 fail** |
| `git diff --numstat` on ADR-041 | **`78 0`** — ⛔ ADR-041 **not touched** by this pass |
| New markdown links | ⛔ **none added** — `ai-agents/knowledge-base/` is link-scanned, so every new reference is prose in backticks |
| `test/dashboard-contract.test.js` | ⛔ cited **by test name only**, unchanged from round 2 |
| ⛔ `prove-red` | **NOT RUN, deliberately** — 32 mutations × the full ~470s suite, and this fence holds **no executable file** (one ADR, this worklog, one review ledger). There is no mutation to make. ⚠️ `npm test` chains into it (`package.json:5`), so `npm run test:unit` was used instead |
