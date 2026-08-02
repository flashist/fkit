# Plan — 0142, investigate the skill-ownership fact-inventory gap

**Owner:** fkit-architect (spawned by `/fkit-sprint-ship-loop`; no owner channel — ADR-021).
**Signed:** the owner ruled on all four questions via `AskUserQuestion` in the live lead session,
2026-08-02. The investigation ran the previous turn; this turn writes it down.

## What this task produces

1. A decision report under `ai-agents/knowledge-base/reports/`, dated.
2. An ADR under `ai-agents/knowledge-base/decisions/`, via the `/fkit-record-decision` procedure.
3. This `plan.md` and a `worklog.md`.

Nothing else. **No implementation** — brief verification step 5.

## Steps

1. Read the brief, `0137`'s brief, ADR-035's citation-form note, and the prior art
   (`2026-08-01-durable-citation-form-for-mutable-coordinates.md`).
2. Re-derive the live inventory by evidence — the whole failure being investigated is a confidently
   incomplete list, so no site is included on memory.
3. Resolve each of the brief's five cited ranges against the working tree. A citation that no longer
   resolves is itself a finding (brief `## Notes`).
4. Re-measure the rules-block budget first-hand; the brief's 91.1% is dated.
5. Check for ADR-number collisions on disk **and** in flight before allocating.
6. Write the report, then the ADR.

## Constraints binding this task

- ⛔ No implementation. No `test/skill-ownership-sites.mjs`, no edit to `claude/skills-for-role.sh`,
  no test / skill / agent-definition change. **The four live defects are not repaired here** — the
  owner's ruling: *"do not let the build quietly repair its own corpus."*
- ⛔ File no briefs. Follow-ups are **named**, and the producer files them at close.
- ⛔ Never write `ai-agents/wiki-vault/`. No commit, no push.
- ⛔ Do not re-derive `0124`'s sweep (brief `## Notes`); verify its three citations only.

## Citation form used

Anchor by **heading and quoted phrase**; tasks by folder ID (ADR-035, task `0160`). Line numbers
appear only where a line number **is** the evidence — the drift audit and the inventory's anchor
column — and are rendered as **dated measurements** (`measured 2026-08-02`) with the quoted phrase
beside them, never as the anchor. Stated explicitly in the report's own citation-form note, because a
report about citation drift must not ship coordinates that rot.

## Risks

- **The inventory is the deliverable and the inventory is the thing that fails.** Mitigation: every
  row derived from a command run this turn, not from the brief's list or the checklist's.
  **⚠️ THIS RISK MATERIALISED — the mitigation was not enough.** Round 1's rows were each derived from
  a command, but the *file set* those commands ran over was narrower than the live surface the report
  declared. A review found it short by 17 rows and 5 classes (ledger R1). **Rows being evidence-backed
  does not make the set of rows complete.**
- **Detection by grep is the very thing under suspicion.** Mitigation: any grep result is confirmed by
  reading the hit. This caught a false negative — see the report's Part 3.

## Round 2 — the review fix round (2026-08-02)

Stateful review returned 🛑 BLOCKED, 7 confirmed defects (3 high); the owner ruled a fix round.

**Method — `/fkit-process-stateful-review` was NOT run.** It is the coder's skill and the ADR-018 hook
denies it to this role. Its method was applied by hand: verify each finding first-hand, classify it,
apply the owner-ruled correction, and write a **Response** section into `review.md`, leaving the
*Reviewer findings* section untouched.

**Steps taken**

1. Read the ledger's *Reviewer findings* in full.
2. **Redo the sweep properly** — enumerate the full declared live surface to a file list (88 files),
   apply all four triggers to each, **open and read every hit**, and admit rows by one stated
   inclusion test (does the file attribute a skill, or a skill-gated act, to a role?).
3. Verify R2–R7 individually against the tree before changing a word.
4. Apply the corrections to the report and ADR-036; keep everything the review verified as correct.
5. Re-verify: no naked `path:NNN` citation introduced; every count dated; report and ADR agree on the
   trigger set, the live surface, the failure count and the sequencing justification.

**Constraints unchanged and re-checked at the end of the round:** no implementation, none of the five
live defects repaired, no brief filed, no vault write, no commit, no push.

> ⚠️ **Step 2 of this round was itself defective, and the risk above materialised a SECOND time.** The
> file list it enumerated (**88**) does not reproduce; the boundary enumerates to **89** non-empty files
> (102 paths, 13 empty). The round's stated quality bar — *open and read every hit* — **was met; the
> enumeration under it was not.** A complete read of an incomplete list is still an incomplete sweep.

## Round 3 — review round 2's fix round (2026-08-02)

Review round 2 returned 🛑 BLOCKED, **6 confirmed defects (2 high)**; the owner ruled a fix round on all
six plus **two structural rulings** (re-scope trigger (c); re-open ADR-036's licence sentence rather
than annotate it).

**Method unchanged and unchanged for the same reason** — `/fkit-process-stateful-review` is the coder's
skill and the ADR-018 hook denies it to this role, so its method was applied by hand and the response
written into `review.md` as **Response — round 3**, with *Reviewer findings* untouched.

**What this round did differently, because two rounds had shipped asserted-not-measured claims**

1. **Nothing was written before it was measured this round.** Every figure in both documents that
   changed was re-derived on 2026-08-02 from a read-only script in the session scratchpad — including
   the figures the review had already verified (the bare token, the specimen gaps), so that no number
   in the corrected documents rests on a previous round's memory.
2. **The enumeration was rebuilt from clause 5 rather than reused.** That is what settled R12: 88 is
   withdrawn, 89 is the measurement, and the cause of 88 is recorded as **unknown** rather than given
   the plausible-but-unproven mechanism Codex offered.
3. **Two independent sweeps for R8's shape, not one.** A generalised possessive/appositive scan over all
   89 files (282 instances, 49 files, all cross-checked against the inventory), **and** its complement —
   the 6 files that trip no trigger at all, each opened and read. Agreement between the two is what
   makes *"nothing beyond R8"* a claim worth stating; **it is still recorded as a dated measurement and
   explicitly not a completeness claim.**
4. **Every clause got the treatment (e) got.** R9's root cause was a clause specified less rigorously
   than its neighbour. The re-scoped (c) therefore ships with its own vocabulary, its own window, its
   own boundary rule and its own measured false-positive cost — and with a **proof it catches the site
   that motivated it** (gap 51 ≤ 80), because a spec that missed it would have been the wrong spec.
5. **No mechanism was invented to justify anything.** The D4 sequencing note now carries none at all,
   after two false ones in two revisions.

**New risk, named because it is the one this round could still be wrong about.** The
possessive/appositive sweep is a **proxy predicate over a corpus**, not a proof. It is stated as a
measurement of one tree on one day, and both documents refuse to convert it into a licence — which is
precisely the correction the owner ruled.

**Constraints re-checked at the end of the round:** no implementation, no edit to
`claude/skills-for-role.sh` / `claude/fkit-claude.sh` / `claude/fkit-claude-init.sh` / any skill or
agent definition, no live defect repaired, no brief filed, `0171` untouched, no vault write, no commit,
no push.

## Round 5 — review round 3's fix round, and the close (2026-08-02)

Review round 3 **converged**: one medium finding (**R14**), one low (**R15**), neither blocking, and the
reviewer recommended **closeout rather than a fourth round**. The owner ruled **apply R14, accept R15**.

**What this round did, and the one rule it held to**

1. **Measured before written, again — and this time the thing measured was the label, not the number.**
   R14 is not a wrong figure; it is a **right figure with the wrong basis attached**. The whole round was
   re-deriving both bases over the same 89 files so the qualifier could name a measured alternative
   rather than gesture at one: **(a)–(d) 73 → 76 bounded, 74 → 77 substring, (e)-only 9 → 7.**
2. **The existing qualifier was reused, not reinvented.** The report already scoped this correctly in
   three places. Writing a fourth form of words would have created the very drift the report is about.
3. **The C32 row was treated as the priority of the four.** A closing *"It trips none of (a)–(e)"* on the
   row the re-scope exists to justify teaches a reader the opposite of the fix; it was rewritten to name
   the round-3 basis and to state that on today's set it **does** trip (c), at gap 51.
4. **A residual was disclosed rather than repaired.** R15's figure was left untouched per the ruling and
   its non-reproduction stated in place. Re-running and re-typing a number two independent
   implementations disagree with would have been the third asserted-not-measured claim in this document's
   history.
5. **The ledger was closed with its residuals, not just its verdict.** Five accepted residuals, each with
   a falsifiable *"re-raise only if"*, plus the **severity dissent** (Codex HIGH vs reviewer MEDIUM) and
   the **FULL Codex coverage** on all three rounds.

**Risk left standing, named.** The documents now carry two bucket bases for the same corpus. That is
honest but it is more to read; the mitigation is that the bucket-basis note lives **once**, inside the
byte-identical spec block, and the other four sites point at it rather than restating it.

**Constraints re-checked at the end of the round:** no implementation, no edit to
`claude/skills-for-role.sh` / `claude/fkit-claude.sh` / `claude/fkit-claude-init.sh` / any skill or
agent definition, no live defect repaired, no brief filed, `0171` untouched, no vault write, no commit,
no push.
