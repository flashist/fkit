# Worklog — 0270: Decide how the ship-loop handles a non-coder-owned task row

**Worker:** spawned `fkit-architect`, Build step of `/fkit-sprint-ship-loop` (Sprint 6, live
`fkit lead` session), on the owner's Route ruling of 2026-08-27 — verbatim option label **"Drive it
here with the architect (Recommended)"**. Skill run: `/fkit-record-decision` (architect-owned,
`claude/skills-for-role.sh:56`) — the step-role-follows-skill shape this task's own ADR records.
**No owner channel** in this spawn; every ruling used was relayed in `plan.md` §6.

**Date of work:** 2026-08-27.

**Plan:** `plan.md` in this folder — driver-written at approval (ADR-020), **not** re-authored here.
Carry verified before any write: `git hash-object plan.md` →
`8985cf9089a0a771a689cafcb9ac16cb5101b77f`, matching the driver's stated blob exactly (18193 bytes).

## What was done

One file created: `ai-agents/knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md`
(430 lines, 30448 bytes), status **accepted**, plus this worklog.

The ADR carries what `plan.md` §5 prescribes: the question (Context §1), the ADR-038 closeout
discharge answered before the options (Context §2), the five candidates each with an explicit
accept/reject and cost (§Options considered), the decision as ruled (§Decision 1–6), the follow-ons
as ND6 lists them (§Consequences C2 — to be filed by the producer after acceptance, not scoped here),
the `0223`/`0224`/`0225` effect stated explicitly (C3), ADR-038 not amended (C4), the re-raise
trigger naming candidate 5, the owner sign-off table with all eight verbatim labels (§Owner sign-off),
and the corroborating-practice table (ND7: `0241`, `0222`, `0242`, `0249`'s lawful half, `0178`,
`0218`, `0171` as counter-example, and today's `0270`).

Citations: skill/agent files by `path:NNN` **paired with a quoted fragment**; ADR-038, sprint boards
and briefs by heading plus fragment, line numbers only as a dated secondary aid
(`conventions/durable-citation-anchors.md`). ADR-038's Decision line is quoted verbatim.

## Number sweep (per `/fkit-record-decision` step 2), run 2026-08-27 before allocation

- **Step A** (malformed `adr-*` names) → printed nothing.
- **Step B** (highest numeric on disk) → **43**. Next free → **044**.
- Manual look for an in-flight claim: `grep -rn -i 'adr-044' ai-agents/ claude/ test/ README.md
  CLAUDE.md` (vault included, read-only) → **2 hits, both in this task's `plan.md`** §4, naming the
  title/slug "pending the sweep at write time; do not pre-allocate". References to this ADR; zero
  rival claimants. No `decisions/` index or README exists.
- **Allocated: 044.** Slug exactly as `plan.md` §4 proposed.

## Rulings honoured (all `AskUserQuestion`, live `fkit lead` session, 2026-08-27 — verbatim labels)

Route — "Drive it here with the architect (Recommended)"; **ND1** — "A: Build role follows the
deliverable's skill + vault rows skipped (Recommended)"; ND2 — "Owner column = fkit-wiki +
Plan-worker BLOCKED backstop (Recommended)"; ND3 — "The Build role, by hand (Recommended)"; ND4 —
"Report only, route named (Recommended)"; ND5 — "Yes, both (Recommended)"; ND6 — "File all three
after the ADR is accepted (Recommended)"; ND7 — "Yes (Recommended)". Each is recorded in the ADR at
the clause it governs.

## Verification

- `node --test test/*.test.js` → **782 tests, 24 suites, 782 pass, 0 fail, 0 skipped**
  (54.2 s). Neutral for an ADR add, as expected. **One test reads the decisions folder:**
  `test/adr-number-uniqueness.test.js` scans `ai-agents/knowledge-base/decisions/` for duplicate ADR
  numbers and malformed names — it ran against the folder with `adr-044` present and passed.
  (`dual-home-parity`, `converge-contract`, `dashboard-contract` mention `decisions` only as a
  scaffold/prune path; none reads the ADR files.)
- Boundary (brief verification steps 9–10). **Step 10 holds:** `git diff --stat --
  claude/skills/fkit-sprint-ship-loop/SKILL.md` → empty. No `ai-agents/wiki-vault/` path, no
  `ai-agents/sprints/done/sprint-5.md` in the status.
  **⚠️ Step 9 does NOT hold as written, and did not at the time of this entry** *(corrected
  2026-08-28 in review round 1, finding R7 — the original claim below was incomplete, not wrong about
  this worker's own writes)*. Step 9 requires changes *"**only** under `ai-agents/knowledge-base/decisions/`
  plus this task's own folder"*. The working tree also carries an edit to
  **`ai-agents/sprints/sprint-6.md`**: `0270`'s own board row flipped `🔲 Backlog` → `🔄 In progress`
  (`git diff -U0` — one hunk, four rows, three siblings flipped to `✅ Done` in the same hunk).
  **That is the DRIVER's edit at plan approval, not this worker's** — the same hand as the `brief.md`
  status flip already attributed below. **Step 9 as the brief words it is unmeetable inside
  `/fkit-sprint-ship-loop`,** whose driver flips board status by design; it is written for a
  standalone run. Stated rather than claimed-met.
  **What this worker itself wrote:** the new ADR under `decisions/` and this task's folder only.
  (`plan.md` untracked — the driver's; `brief.md` modified — the driver's `🔄 In progress` status
  edit, not mine.)

## Deliberately not done

- ADR-038 **not amended** (follow-on C2 ii is a dated correction note; ⚠️ **its target fragment
  changed in review round 1** — see the Process-review entry below). No skill, agent, hook, test,
  board, or brief edit **by this worker** (the `sprint-6.md` P19 flip is the driver's — see
  Verification). No `ai-agents/wiki-vault/` write — fkit-wiki should ingest the ADR. ND6 follow-ons
  **not filed** — the producer's, after close. No commit, no push, no task move, no `plan.md` edit.
- **One** unverified item is stated as such in the ADR, not guessed: how Sprint 5's two non-excluded
  architect rows were staffed. *(Corrected 2026-08-28, review round 2, finding R11 — this bullet said
  "Two" when written on 2026-08-27, and it was true then. The second item — whether the one
  blank-`## Owner` Backlog brief is a formatting quirk — was **resolved in review round 1**: it is
  `0184`'s second `## Owner rulings on record` heading, real owner `fkit-producer`. See decision-log
  entry 7 below and the ADR's §Unverified this pass.)*

## Decision log

**Build step (2026-08-27):** `none`. Every clause came from `plan.md` §4–§6 and the owner's rulings;
no fix was applied unattended and no obvious-winner call was needed. One observation recorded in the
ADR's §Related rather than acted on: ADR-038 cites `skills_for_role()` at
`claude/skills-for-role.sh:48`; it is at `:51` on 2026-08-27 — drift noted, not repaired (out of this
task's scope).

---

# Process-review — Round 1, 2026-08-28

**Worker:** spawned `fkit-coder`, Process-review step of `/fkit-sprint-ship-loop` (Sprint 6, live
`fkit lead` session). ADR-038 fixes this step to the coder whoever authored the deliverable — here a
document written by a spawned architect. **No owner channel** in this spawn.

**Method:** `fkit-process-stateful-review` steps 0–7, **standing approval** in place of the per-round
owner gate (ADR-019 / ADR-032). **Plan carry re-verified before any write:** `git hash-object
plan.md` → `8985cf9089a0a771a689cafcb9ac16cb5101b77f`, matching the driver's stated blob (18193
bytes). `plan.md` **not edited**.

**Owner rulings folded in** (live `AskUserQuestion`, `fkit lead` session, 2026-08-28, verbatim option
labels): **R1** — *"Owner-ruled scoped exception (Recommended)"*; **R3** — *"Confirm as intended
(Recommended)"*. R2/R4/R5/R6/R7 needed no ruling. **No ND transcription, ruling, or decision was
changed.**

**Outcome:** 7 findings, 7 dispositioned, all `✅ done`. Six `CORRECT`, one `PARTIALLY CORRECT` (R6 —
one leg disproven). Zero blocking, zero frontier, zero closeout, zero blocked. Per-finding verdicts,
evidence and actions are in `review.md` §Coder response; ledger `Status: closed-out`.

**Files changed this round:** `ai-agents/knowledge-base/decisions/adr-044-…md` (521 lines / 38734
bytes, was 430 / 30448) and this folder's `review.md` + `worklog.md`. **Nothing else** — no skill,
agent, hook, test, board or brief edit; no `ai-agents/wiki-vault/` write; no commit, push or task
move; ND6 follow-ons still unfiled (the producer's, after close).

**Verification:** `node --test test/*.test.js` → **782 tests, 24 suites, 782 pass, 0 fail, 0
skipped** (54.4 s) — the expected 782, unchanged by a document edit.
`node --test test/adr-number-uniqueness.test.js` → **14 pass, 0 fail**; it reads
`ai-agents/knowledge-base/decisions/` and ran against the folder with `adr-044` present (**44 `adr-*`
files on disk**).

## Decision log — Process-review round 1 (fixes applied unattended, under the standing approval)

Every entry: the finding it answers, what changed, why it qualified.

1. **R1 → ADR §Context *"Build / Plan"* bullet, Decision 2, C4.** Split the bullet into **Build**
   (ground ADR-038 left open) and **Plan** (a departure, named); added a ⚠️ blockquote under
   Decision 2 declaring it an owner-ruled scoped exception to ADR-038 §Decision, bounded to the Plan
   step on non-coder rows in this loop; rewrote C4's *"reopens none of them"*. **Qualified:** verified
   `CORRECT` first-hand (`SKILL.md:122`, `skills-for-role.sh:55`, ADR-038 `:88-91`), and the owner
   ruled the shape of the fix explicitly — not this worker's judgment call.
2. **R2 → ADR §Context, Process-review discharge bullet.** Dropped *"on every row measured, `## Owner`
   **is** the deliverable's author"*; re-founded the discharge on the hook/by-hand mechanism leg,
   naming `0171` as the counter-example. **Qualified:** verified `CORRECT` (`0171` brief + worklog);
   mechanical and localized; the conclusion (candidate 1 rejected) is unchanged, so no decision moved.
3. **R3 → ADR C6, §Corroborating practice, §Why this and not the others.** Added the C6 consequence
   bullet naming `0318`/`0320`/`0321`/`0335`; added the two-halves preamble and *"Not corroboration of
   the rule"* markers on the `0178`/`0218` rows; corrected *"all seven … already shipped"* to the
   measured eight with `0270` marked in progress. **Qualified:** verified `CORRECT` first-hand (four
   brief `## Owner` fields re-read 2026-08-28; `0178`/`0218` worklogs), and the owner ruled the
   consequence *"Confirm as intended"* — the ruling directs the statement, not a scope change.
4. **R4 → ADR §Context, the *"no third outcome"* paragraph.** Re-pointed the correction at the brief's
   architect sentence, stated that the wiki *"no third outcome"* sentence stands, and made *"the
   architect wall is not a wall"* conditional on C2 (i) shipping. **Qualified:** verified `CORRECT`
   (brief `:37-46`; `fkit-architect.md:65`); wording-only, no decision touched.
5. **R5 → ADR §Context third bullet and C2 (ii).** Replaced the *"ADR-038 already contradicts its own
   Build fact"* framing with the step-vs-worker distinction; re-founded C2 (ii) on the *"their roles
   come from the loop's enumerated step table"* fragment, scoped to Build. **Qualified:** verified
   `CORRECT` by reading ADR-038 `:88-91` and `:101-103` together with `SKILL.md:123`; the follow-on is
   owner-ruled (ND6) and **survives** — only its stated ground changed, so nothing was descoped.
6. **R6 → ADR §Context evidence table, the paragraph under it, §Unverified this pass.** Corrected the
   split to the re-measured **72 coder / 30 architect / 13 producer / 6 wiki / 2 reviewer** (51
   non-coder, 41%), added the dated measurement paragraph and command, kept and sharpened the
   blank-Owner sentence. **Qualified:** first leg verified `CORRECT` by re-running the dashboard and
   re-deriving the split from each row's brief; mechanical fact correction, in-plan.
   ⚠️ **Second leg disproven** — recorded in `review.md`, not applied.
7. **R6 (obvious-winner call) → §Unverified this pass.** The reviewer offered two fixes for the
   blank-Owner sentence: *name the brief and the command*, or *drop the sentence*. Chose **name it**,
   and used it to resolve the ADR's own open item. **Why it qualified as an obvious winner within the
   plan's intent:** `plan.md` §4 lists this exact question as unverified and the plan's standing
   instruction is *"stated, not guessed"* — a measurement that answers it strictly dominates deleting
   the sentence, and the answer (`0184`'s second `## Owner rulings on record` heading; real owner
   `fkit-producer`) is now on disk rather than open. Sprint 5's two rows remain unverified and are
   still flagged as such.
8. **R7 → `worklog.md` §Verification and §Deliberately not done.** Named the `sprint-6.md` P19 flip,
   attributed it to the driver, and stated that brief step 9 as written is unmeetable inside the loop.
   **Qualified:** verified `CORRECT` via `git diff -U0 -- ai-agents/sprints/sprint-6.md`; corrects
   this worklog's own audit record, which is the one record a wrong claim would hide.
9. **Incidental, inside the R5 edit:** corrected a stale cross-reference in the same bullet — *"filed
   as a follow-on (C5)"* → **C2 ii** (C5 is §Historical records). **Qualified:** mechanical, verified
   against the ADR's own section headings, and in the sentence already being rewritten for R5.

**Boundary call recorded, not buried.** ADR-044 is `Status: accepted`, and `/fkit-record-decision`
§"Correcting an accepted ADR" states the form is *"not a licence to edit ADR prose"*. These fixes
**edit the prose in place**. Reason: the convention protects an ADR already in the corpus; ADR-044
has not left its own Build → Review → Process-review round, and the owner's R1/R3 rulings are worded
in terms only in-place editing satisfies (*"must state plainly"*, *"must stop citing"*) — a named
owner ruling displacing a skill rule (ADR-037 §3), the mechanism ADR-044 itself relies on. **No
`- **Corrections:**` metadata bullet added** — that form is for post-acceptance drift; `review.md`
and this log are the record. **Status stays `accepted`; the decision and every ND transcription are
unchanged.** Flagged in the Step 7 report for the driver.

---

# Process-review — Round 2, 2026-08-28

**Worker:** the same spawned `fkit-coder`, Process-review step of `/fkit-sprint-ship-loop`. **No
owner channel.** Method: `fkit-process-stateful-review` steps 0–7, **standing approval** in place of
the per-round owner gate. **Plan carry re-verified before any write:** `git hash-object plan.md` →
`8985cf9089a0a771a689cafcb9ac16cb5101b77f`. `plan.md` **not edited**.

**Owner ruling folded in** (live `AskUserQuestion`, 2026-08-28, verbatim label): **R8** — *"Qualify
the quantifier (Recommended)"*. R9/R10/R11 needed no ruling. **No ND transcription, ruling, or
decision was changed.**

**Reviewer's Round-2 adjudication, accepted:** its Round-1 R6 second leg is **withdrawn** — the
`0184` disproof stands and nothing was redone.

⚠️ **Two of the four findings are regressions I introduced in Round 1** (R8, R9 — both from the R3
fix). Stated plainly rather than folded into the totals: the Round-1 fix for a false count introduced
a false universal and a preamble that contradicts its own table. The reviewer named the pattern; it
was a fair hit. Counter-measure taken **before** writing any replacement: each new sentence's
quantifier checked against what was actually measured, then a full `every / all / only / never /
always` sweep over the finished ADR (entry 5).

**Outcome:** 4 findings, 4 dispositioned, all `✅ done`, all `CORRECT`. Zero blocking, zero frontier,
zero closeout, zero blocked. Per-finding evidence in `review.md` §Coder response, Round 2. Ledger
`Status: closed-out`.

**Files changed this round:** `ai-agents/knowledge-base/decisions/adr-044-…md` (**521 → 561 lines,
42368 bytes**, measured after the last edit — an earlier draft of this line said 553, written before
measuring and corrected here) and
this folder's `review.md` + `worklog.md`. **Nothing else** — no skill, agent, hook, test, board or
brief edit; no `ai-agents/wiki-vault/` write; no commit, push or task move; ND6 follow-ons still
unfiled (the producer's, after close). ADR-038 **not amended**; its C2 (ii) correction note still
scoped to Build and still not widened to Plan.

**Verification:** `node --test test/*.test.js` → **782 tests, 24 suites, 782 pass, 0 fail, 0
skipped** — the expected 782, run twice (55.5 s and 104.4 s), identical results.
`node --test test/adr-number-uniqueness.test.js` → **14 pass, 0 fail**, run against `decisions/` with
`adr-044` present.

## Decision log — Process-review round 2 (fixes applied unattended, under the standing approval)

1. **R8 → §Why this and not the others (the summary sentence + a new ⚠️ scope block), and candidate
   4's wiki bullet.** Sentence scoped to *"all eight non-coder rows **this ADR measured** the loop
   driving"*; ⚠️ block names the evidence base (Sprints 3–6 + the Backlog board) and the two gaps —
   Sprint 5's five non-coder rows and pre-Sprint-3 loop history — and states that a wider population
   corroborates Decision 1 rather than contradicting it. Candidate 4 now says a lawful wiki Build has
   happened **more than once** and names `0211` as a **second instance, not a counter-example to
   Decision 4**. **Qualified:** verified `CORRECT` first-hand — nine rows re-read (`## Sprint` and
   `## Owner` per brief, Build worker per worklog), `0211` verified as the owner directed
   (`## Owner: fkit-wiki`, *"build worker, spawned by `/fkit-sprint-ship-loop`"*, vault `log.md`
   deliverable) — **and the owner ruled the shape of the fix explicitly.** Sprint 2 **not**
   re-measured and the evidence base **not** restated, per that ruling.
2. **R9 → §Corroborating practice preamble and the `0171` table row.** Replaced the *"last four are
   not corroboration"* block with a per-row reading; `0171`'s row now records that it corroborates
   Decision 1's skill-less clause **and** is the `## Owner` counter-example. **Qualified:** verified
   `CORRECT` against the table, C6 and §Why this and not the others, which name the same two rows.
   Mechanical and localized. **Deliberately fixed per-row rather than by substituting "two"** — a
   bare replacement count would have re-created the same failure mode from the other side, which is
   exactly what R8 punished. ⛔ R3's `0178`/`0218` marking **not re-opened** (reviewer re-verified it
   correct).
3. **R10 → C6's first consequence bullet.** *"brief repairs"* → *"skill-less coordination-doc
   repairs"* (Decision 1's own word), with each of the four rows' actual target named and quoted.
   **Qualified:** verified `CORRECT` by reading all four briefs — `0321` repairs the **live Backlog
   board**, `0335` repairs **task-folder records**, only `0318`/`0320` repair briefs. The
   owner-confirmed consequence is unchanged, so this is a label fix, not a scope change. Also
   re-checked the neighbouring `0218` *"brief repair"* label instead of assuming it — `0218` repairs
   `0177`'s brief, correct, left alone.
4. **R11 → `worklog.md` §Deliberately not done.** *"Two unverified items"* → **One**, with a dated
   parenthetical recording that "Two" was true on 2026-08-27 and pointing at decision-log entry 7 and
   the ADR section that resolved the second. **Qualified:** verified `CORRECT` — the same file
   contradicted itself 80 lines apart. Corrects this worklog's own audit record.
5. **Unflagged, found by my own quantifier sweep — recorded so the reviewer can object.** §Context,
   under the evidence table: *"The gap bites on **every sprint**"* → *"on **every sprint in the table
   above**"*. **Why applied without a finding:** it is the **same over-claim class the owner had just
   ruled on** in R8, in a sentence that summarises the table directly above it, and the fix is a
   two-word scope qualifier that changes no fact, no count and no decision. **Why it is flagged
   rather than folded in silently:** it was not a reviewer finding, so applying it is a small scope
   widening, and the honest place for that is here where Round 3 can reverse it. Sprints 3–6 all
   carry non-coder rows, so the sentence was true of the measured set — only its quantifier reached
   further than the measurement.

**No obvious-winner calls this round.** Every fix above is either owner-ruled (entry 1) or a
verified-`CORRECT` mechanical repair inside the approved plan; entry 5 is the one discretionary act
and is recorded as such.

**Boundary call unchanged from Round 1** — in-place edits to a `Status: accepted` ADR that has not
left its own Build → Review → Process-review round, on the owner's rulings (ADR-037 §3). Round 2's
reviewer notes it is owner-ruled and does not raise it. No `- **Corrections:**` bullet; `review.md`
and this log remain the record. Status stays `accepted`.

---

# Process-review — Round 3, 2026-08-28

**Worker:** the same spawned `fkit-coder`, Process-review step of `/fkit-sprint-ship-loop`. **No
owner channel.** Method: steps 0–7 under the **standing approval**. **Plan carry re-verified before
any write:** `git hash-object plan.md` → `8985cf9089a0a771a689cafcb9ac16cb5101b77f`. `plan.md`
**not edited**.

**Owner ruling folded in** (live `AskUserQuestion`, 2026-08-28, verbatim label): **"Act, then close
(Recommended)"**. **No ND transcription, ruling, or decision was changed.**

**Accepted without action, as ruled:** the Round-2 discretionary edit (§Context *"every sprint"* →
*"every sprint in the table above"*) **stands** — and the reviewer's correction of my label for it is
accepted: the edit **narrows** the claim. My "small scope widening" referred to my *action* scope
(editing text no finding named), not the claim's scope; putting both senses in one phrase was
imprecise, and the reviewer was right to separate them. R9, R10, R11 verified clean, not re-touched.

⚠️ **Both findings this round are again my own regressions** — R12 from the Round-2 R8 fix, R13 from
the Round-2 R10 fix. Stated plainly, not folded into a total: across three rounds, four of the six
findings after Round 1 were defects my own fixes introduced. The pattern is consistent — I have
repeatedly repaired a claim's *content* while carrying its *quantifier or numeral* forward unchecked.

**Counter-measure this round, as instructed.** The Round-2 sweep caught universals but by
construction catches neither a bare numeral nor a mis-attributed instance. So **every numeral and
named instance in the changed regions was re-derived from disk before writing, and re-run after**.
Commands and results in the decision log. All reconcile.

**Outcome:** 2 findings, 2 dispositioned, both `✅ done`, both `CORRECT`. Zero blocking, zero
frontier, zero closeout, zero blocked. Per-finding evidence in `review.md` §Coder response, Round 3.
Ledger `Status: closed-out`. **No discretionary edits this round.**

**Files changed this round:** `ai-agents/knowledge-base/decisions/adr-044-…md` (**561 → 589 lines,
44437 bytes**, measured with `wc -lc` after the last edit, before writing this line) and this
folder's `review.md` + `worklog.md`. **Nothing else** — no skill, agent, hook, test, board or brief
edit; no `ai-agents/wiki-vault/` write; no commit, push or task move; ND6 follow-ons still unfiled.
ADR-038 **not amended**; C2 (ii) still scoped to Build, still not widened to Plan.

**Verification:** `node --test test/*.test.js` → **782 tests, 24 suites, 782 pass, 0 fail, 0
skipped** — the expected 782. `node --test test/adr-number-uniqueness.test.js` → **14 pass, 0 fail**.

## Decision log — Process-review round 3 (fixes applied unattended, under the standing approval)

1. **R12 → §Why this and not the others (the ⚠️ scope block) and candidate 4's wiki bullet.**
   Re-filed `0211` from gap (2) *"earlier sprints not measured"* into a new gap (2) *"the Backlog
   board was measured as its 123 `🔲 Backlog` rows — its closed rows were not"*, stating that by
   candidate 4's own predicate `0211` is a **ninth measured instance**; the pre-Sprint-3 point became
   gap (3) and stays **unenumerated**. Candidate 4's parenthetical narrowed from *"outside this ADR's
   measured boards"* to *"on a measured board but outside the 123 `🔲 Backlog` rows counted … it
   reads `✅ Done`"*. Added an explicit *"The eight are not re-opened"*.
   **Measured, not assumed:** `awk` over `0211/brief.md` → `## Sprint: Backlog`,
   `## Status: ✅ Done (agent-closed — not owner-verified)`; `grep -n '0211-' ai-agents/sprints/backlog.md`
   → line **121**; `grep -c '^| 🔲 Backlog .*0211-'` → **0**.
   **Qualified:** verified `CORRECT` first-hand and repaired **exactly within the reviewer's
   guardrails** — Sprint 2 not re-measured (owner-ruled out of scope), the eight not re-opened.
2. **R13 → C6's first consequence bullet.** *"four … rows are skill-less coordination-doc repairs"*
   → **all 13 producer rows**, broken down by document: eight coordination-doc repairs (`0149`,
   `0183`, `0193`, `0221`, `0318`, `0320`, `0321`, `0335`), three skill-less doc writing that is not
   repair (`0013`, `0184`, `0340`), two skill-less but not doc work (`0187`, `0262`). 8 + 3 + 2 = 13.
   **Re-measured, not adjusted.** Commands: the 123 `🔲 Backlog` rows extracted from
   `ai-agents/sprints/backlog.md` by their own Filename-cell link; each row's brief read with
   `awk '/^## Owner$/{f=1;next} f&&NF{print;exit}'` → **13 producer**; each of the 13 read for the
   skill its deliverable names → **none**.
   **Qualified:** verified `CORRECT`; the reviewer's four additions confirmed exactly, `0193`
   included. ⛔ R3's owner-confirmed consequence **restated, not re-opened**.
3. **Surfaced by the R13 re-measurement, added to the same bullet — a mention is not a producing
   skill.** Five of the 13 (`0262`, `0318`, `0320`, `0321`, `0335`) cite `/fkit-record-decision` or
   `/fkit-task-brief`; **every hit is a reference, not an invocation** — three point at
   `/fkit-record-decision`'s *"Correcting an accepted ADR"* section for the dated-note **form**, and
   `0318` says outright the row is *"an owner-ruled task, **not** by `/fkit-task-brief`"*. C6 now
   warns `0224`/`0225` (C3) to read the deliverable's producing skill rather than grep the brief for
   skill names. **Qualified:** not a separate finding but the direct product of R13's own
   re-measurement, inside the bullet R13 required rewriting, and it protects two follow-ons this ADR
   already scopes — recorded here so a Round 4 can strike it if judged out of scope.

**No obvious-winner calls this round, and no discretionary edits.** Entries 1 and 2 are the two
findings; entry 3 is a warning produced by entry 2's own measurement, inside entry 2's text.

**Boundary call unchanged** — in-place edits to a `Status: accepted` ADR that has not left its own
Build → Review → Process-review round, on the owner's rulings (ADR-037 §3). Not raised in Round 2 or
Round 3. Status stays `accepted`.

**Post-write re-verification of every numeral in the changed regions** (re-run after the last edit):
123 `🔲 Backlog` rows; 72 coder / 30 architect / 13 producer / 6 wiki / 2 reviewer; Sprint 3/4/5/6
status tables = 4 / 8 / 17 / 21, matching §Context; `0211` at `backlog.md:121`; 8 + 3 + 2 = 13; five
skill-mentioning briefs. **All reconcile.**

---

# Process-review — Round 4, 2026-08-28 — **final round; task closed out**

**Worker:** the same spawned `fkit-coder`, Process-review step of `/fkit-sprint-ship-loop`. **No
owner channel.** Method: steps 0–7 under the **standing approval**. **Plan carry re-verified before
any write:** `git hash-object plan.md` → `8985cf9089a0a771a689cafcb9ac16cb5101b77f`. `plan.md`
**not edited**.

**Reviewer's convergence ruling honoured** (under the owner's **"Act, then close (Recommended)"**):
apply R14–R17, then close; **no Round 5 opened**. Decision-log entry 3 of Round 3 **kept**, as ruled
— not struck. The reviewer independently re-derived Round 3's 13-row partition from disk and it
reproduced exactly.

**Outcome:** 4 findings, 4 dispositioned, all `✅ done` — three `CORRECT`, one `PARTIALLY CORRECT`
(R16). Zero blocking. Ledger `Status: closed-out`.

**Files changed this round:** `ai-agents/knowledge-base/decisions/adr-044-…md` (**589 → 607 lines,
45929 bytes**, measured with `wc -lc` after the last edit, before writing this line) and this
folder's `review.md` + `worklog.md`. **Nothing else.** ADR-038 **not amended**; C2 (ii) still
Build-scoped.

**Verification:** `node --test test/*.test.js` → **782 tests, 24 suites, 782 pass, 0 fail, 0
skipped**. `node --test test/adr-number-uniqueness.test.js` → **14 pass, 0 fail**.

## Decision log — Process-review round 4

1. **R14 → §Why this and not the others.** Inserted **one blank line** between the ⚠️ block's closing
   `>` line and `**Main tradeoff:**`, which CommonMark lazy continuation had been absorbing into the
   blockquote. **Neither side reworded**, per the guardrail. **Qualified:** verified `CORRECT`;
   purely structural. Swept the whole file for the same shape afterwards — `awk` over every line
   whose predecessor begins `>` and which is itself neither blank nor a quote → **no other
   instance**.
2. **R15 → the same section's headline sentence.** *"all eight non-coder rows **this ADR measured**
   the loop driving"* → *"all eight non-coder rows the loop drove in **the population this ADR
   counted** — the Sprints 3–6 status tables and the 123 `🔲 Backlog` rows"*. **Qualified:** verified
   `CORRECT` — my Round-3 R12 fix wrote *"a ninth measured instance"* twenty lines below while
   leaving the headline on "measured", which relocated the contradiction instead of clearing it.
   "Counted" and "measured" now carry different loads. ⛔ Eight not re-opened, not promoted to nine,
   Sprint 2 not re-measured.
3. **R16 → C6's *"A mention is not a producing skill"* block, two changes.** (a) Substantiated the
   remaining two of the five: `0321` now quoted (*"`/fkit-task-brief`'s own independent-shippability
   test"*) and `0262` quoted (*"(ADR-035, `/fkit-task-brief` step 5)"*). (b) Reach clause widened to
   the measured nine, with `0013` distinguished as naming the **agent** `/fkit-coder`.
   **Qualified:** both legs verified `CORRECT` first-hand.
4. **⚠️ R16 sub-claim (c) DISPROVEN — and the disproof runs against my own convenience, so it is
   recorded loudly.** The finding said *"two of those name producer-owned skills (`0187`'s
   `/fkit-task-done`, `0262`'s `/fkit-heal`)"*. Writing "two" on the reviewer's authority would have
   been the exact failure the last three rounds punished, so it was derived instead: `skills-for-role.sh`
   sourced directly, producer-**exclusive** skills computed as those in the producer arm and in no
   other role → `fkit-initiate-project fkit-task-brief fkit-task-done fkit-task-cancelled fkit-status
   fkit-heal`; matched across the 13 briefs → **eight** rows name at least one (`0184`, `0187`,
   `0262`, `0318`, `0320`, `0321`, `0335`, `0340`); only `0221` of the nine does not. **The ADR
   states the measured eight, not the finding's two** — a grep oracle would route **8 of 13 rows back
   to the producer**, which is a materially larger hole than the finding described. **Qualified:**
   applying a finding's *direction* while correcting its *number* is squarely inside the method
   (verify, never inherit); the partition itself was not re-opened.
5. **R17 → §Citation form.** Carved out the one coordinate measured on a different day: the preamble
   now dates board line numbers to 2026-08-27 **except** `ai-agents/sprints/backlog.md:121`,
   measured 2026-08-28. **Qualified:** verified `CORRECT`; **the date only** — no coordinate changed
   and no citation re-anchored, per the guardrail.

**No fifth nit of this class found.** The post-fix sweeps return clean: no remaining lazy-continuation
site; every numeral in the changed regions re-derives from disk (9 skill-token rows · 8
producer-exclusive · 5 reference-only · 3 naming none · 8 + 3 + 2 = 13 · 123 open Backlog rows).
Had one appeared it would have been recorded here and left unfixed, per the reviewer's ruling.

**No discretionary edits this round.** Every change is one of the four findings.

**Boundary call unchanged** — in-place edits to a `Status: accepted` ADR that never left its own
Build → Review → Process-review round, on the owner's rulings (ADR-037 §3). Not raised in Rounds 2–4.
Status stays `accepted`.

## Closing note across the four rounds — what this run cost and what it taught

17 findings over four rounds; **six were defects my own fixes introduced** (R8, R9 from Round 1's
fixes; R12, R13 from Round 2's; R15 from Round 3's; plus R16's under-substantiation). The failure was
the same each time and it was never the *content* of a repair — it was carrying a **quantifier, a
numeral or a named instance** forward through an edit that changed the claim around it. Three
counter-measures were added in sequence and each caught the previous round's class but not the next:
a universal-quantifier sweep (Round 2), full numeral re-derivation from disk with stated commands
(Round 3), and structural/date sweeps plus deriving a *finding's own* figures rather than inheriting
them (Round 4, which is what caught R16 (c)). The reviewer's Round-4 framing is the honest summary:
what remains is a frontier of hand-maintaining a 607-line document, not a defect class worth another
round.

**Unverified at close, stated not guessed:** how Sprint 5's two non-excluded architect rows were
staffed. This was flagged in the ADR from the Build step and is **still open** — it was out of scope
every round and is not resolved by anything here.
