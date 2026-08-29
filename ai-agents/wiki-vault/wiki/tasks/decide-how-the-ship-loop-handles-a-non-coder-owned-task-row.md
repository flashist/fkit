# Decide how `/fkit-sprint-ship-loop` handles a non-coder-owned task row

**Source**: `ai-agents/tasks/done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P19` · ID 0270 · owner `fkit-architect` · **FOUR review rounds**, 2026-08-27/28

## Goal

⛔ **The loop cannot execute a task whose `## Owner` is not `fkit-coder`, and it has no way to notice.** Given a `## Owner: fkit-wiki` row, the loop drives it to Build, spawns `@fkit-coder`, and the coder must **refuse** (the loop stalls) or **comply** (ADR-005 is breached). ⛔ **There is no third outcome, and the mismatch is discovered at Build — after `🔄 In progress`, after the single approval gate is spent.**

⭐ **The brief measured the absence rather than asserting it:** `grep -ni 'owner:'` over the loop's skill returns **exactly one hit** — its own ownership banner. A wider `grep -ni 'owner'` returns ~50, **every one** about the owner *channel*, the skill banner, or ledger ownership. ⛔ **None reads a task's `## Owner`.**

### ⭐⭐ The brief's most valuable work was procedural, not analytical

It warned the architect in advance about three things **easy to miss**:

1. ⛔ **ADR-038's rule does NOT actually resolve the Build step's role** — its own Consequences say Build and Verify *"run no skill; their roles come from the loop's enumerated step table."* ⚠️ **Sprint 5's notes attribute the Build fixing to ADR-038 directly; that is a shortcut, and this task must not repeat it.**
2. ⛔ **ADR-038 has a closeout clause, and the architect must say explicitly whether it BARS this re-raise — before weighing options.** *"Skipping that question makes any re-raise procedurally unfounded."*
3. **The worked evidence is perishable.** Three Sprint 5 rows (`0255`, `0258`, `0269`) were owner-excluded, ⭐ **and that record dies when Sprint 5 archives** — *"the next lead to hit it rediscovers the analysis from scratch. That is why this is a brief and not a note."*

⛔ **Explicitly not asked:** any candidate whose effect is a coder vault write is **rejected on sight** — ADR-005 was not in question. No implementation, no ADR amendment, no board edit. ⭐ **And the status quo — "the owner excludes by hand each time" — had to be weighed SERIOUSLY rather than listed to be dismissed: *"it is today's status quo and it worked."***

## Key Changes

**One deliverable: [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]**, accepted 2026-08-27 on owner sign-off. Five candidates weighed; **candidate 4 accepted, candidate 2 accepted-narrowed, candidates 1 and 3 rejected, candidate 5 rejected-for-now and named as the re-raise trigger.**

⭐ **The decision rejects the brief's own framing** — `## Owner` is a proxy, not the thing itself — and ⭐ **corrects one of the brief's two claims while explicitly preserving the other.**

⭐ **This task's own run is the ADR's evidence for one of its findings**: the architect ran Plan, the plan gate carried the sign-off, and Build wrote the ADR — proving the loop already has the mid-run owner beat the brief said was missing.

## Outcome

**Four rounds. 17 findings, all dispositioned, none blocking.** Reviewers: own pass + Codex (`codex exec --sandbox read-only`), **both ran, coverage full, every round.** Closed on the reviewer's convergence call — *"apply these, then close — do not open a Round 5"* — and the owner's *"Act, then close (Recommended)"*. ⭐ **Nothing structural regressed at any round.**

⭐ **Every one of the 17 is a DOCUMENT defect — fact, wording, count or over-claim — in a document whose entire deliverable is its accuracy.** The rulings themselves were transcribed faithfully and never re-raised.

### ⭐⭐ The arc: four successive fixes each introduced the next round's defect

- **R1 (medium):** the ADR claimed ADR-038 *"does not fix Build/Plan"* — ⛔ **but the cited fragment names Build and VERIFY only. Plan DOES run a skill**, so ADR-038 fixes Plan = coder and the ADR's Decision 2 was **a departure mislabelled as ground the rule left open.** Fixed by naming it as an owner-ruled scoped exception.
- **R2 (medium):** ⛔ **a universal premise falsified by the ADR's OWN counter-example** — *"on every row measured, `## Owner` is the deliverable's author"*, while `0171` is architect-owned and coder-built, as the same document records. ⭐ **The closeout discharge was re-grounded on the hook mechanism instead, and survived.**
- **R3 (medium):** an **unstated consequence** — Decision 1's skill-less clause makes `0178` and `0218` coder Build rows, ⛔ **and both actually shipped the other way.**
- **R8 (medium, regression of the R3 fix):** ⛔ **a NEW false universal** — *"every non-coder row the loop has driven"*, which excludes rows the ADR names elsewhere.
- **R9 / R10 (regressions of the R3 fix):** an internal contradiction between a preamble and its own table; and a **wrong classification label on two of four rows** in an owner-confirmed bullet. ⭐ *"The consequence itself is unaffected, but the bullet's job is to let a reader check the claim."*
- **R12 (medium, regression of the R8 fix):** ⛔ **a row filed on the wrong board — the ADR's only named instance for a gap did not support that gap**, and two of its own statements contradicted each other on what *"measured"* means.
- **R13 (regression of the R10 fix):** ⛔ **a count survived a label-widening unre-measured, and was already wrong under the narrow label** — *"'four' understated the reach by more than half."*
- **Round 4 (R14–R17):** ⭐ **four fixes to the fixes.** A **Markdown render defect** opened at the exact line the R12 fix appended, silently swallowing four lines of the tradeoff paragraph into a blockquote; a **literal self-contradiction three lines apart** between the headline count and the block written to qualify it; ⭐⭐ **the R13 fix re-creating, inside its own new paragraph, the exact defect R13 was raised about** — *"a bullet whose stated job is to let a reader check the claim reads as a complete enumeration and is not one"*; and **a stale provenance stamp** the ADR's own citation-form block no longer covered — ⭐ *"the smallest of the four, and stated rather than dropped."*

### ⭐ Two findings where the reviewer did not simply concede

- **R6 (PARTIALLY CORRECT):** the Backlog owner split was re-measured and **one leg of the finding was DISPROVEN**. ✅ **The 51-non-coder-rows headline every argument rests on was unaffected.**
- **R16 (PARTIALLY CORRECT):** one sub-claim **disproven**, ⭐ **and its *reach* sub-claim was found to UNDERSTATE the risk it exists to flag.**

### ⚠️ R7 — a boundary claim in the audit record

The worklog claimed no board edit; ⛔ **the `0270` row had flipped `🔲 Backlog` → `🔄 In progress`.** ⭐ **That was the DRIVER's step at plan approval, not the Build worker's** — but the worklog is the audit record, and an incomplete claim there is a defect. Corrected.

## Related
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]] — this task's deliverable
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — the rule whose closeout clause the brief required be discharged first
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the vault-write rule that made a wiki row unrunnable, and was never on the table
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop's single approval gate
- [[tasks/record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — `0222`, the ADR this re-examines
- [[tasks/enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason]] — `0223`, the sibling ADR-038 follow-up
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — *added 2026-08-29:* the board carrying ADR-044's four carry follow-ups, `0345`–`0348`
