# Plan — 0242: Record the companion ADR licensing the consent-gated structure repair

> Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-07 — verbatim
> selected option: "Approve (Recommended)". Plan authored by a spawned fkit-coder
> (`/fkit-plan-task`), presented by the fkit-lead driver, written to this file by the driver in the
> approval turn (fkit-sprint-ship-loop §Durable artifacts).

**Task:** `ai-agents/tasks/done/0242-record-the-companion-adr-licensing-the-consent-gated-structure-repair/brief.md` (Sprint 4 P1)
**Goal:** turn the six owner rulings of 2026-08-06 into a durable record: one new ADR via `/fkit-record-decision`, plus exactly one added line in ADR-015. Nothing else changes. The build step is executed by a spawned `fkit-architect` (ADR-038 — the step's role follows the skill, and `/fkit-record-decision` is the architect's).

**Sources verified on disk this planning pass:** the brief (all six rulings + the item-8 "Keep in 0242 (Recommended)" ruling present verbatim); report `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md` (§3, §5, §6, §7, §8, §9, §10, §11); `ai-agents/knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md`; `.claude/skills/fkit-record-decision/SKILL.md`; the sprint-4 board and task `0240`'s brief (the number hazard).

## Step 1 — Allocate the ADR number (build time, never before)

1. Run the record-decision skill's **Step A** (malformed-filename check — must print nothing) and **Step B** (highest number) pipelines exactly as written in `.claude/skills/fkit-record-decision/SKILL.md` Step 2.
2. Run the **manual four-way sweep** the 0222/0240 precedents mandate (the ADR-029 collision — a number once claimed everywhere *except* `decisions/`): grep the candidate number across (a) `ai-agents/knowledge-base/decisions/`, (b) `ai-agents/knowledge-base/reports/`, (c) the sprint boards and task briefs, (d) `ai-agents/wiki-vault/` (**read-only**, ADR-005). **Read the hits and judge them** — prose mentions (e.g. `0240`'s own warning text) are not claims.
3. **State at plan time, re-verify at build:** as of 2026-08-07 the highest on disk is `adr-038`; `039` is unclaimed in all four places. **Do not hardcode 039** — unscheduled task `0240` will draw the next number from the same pool whenever it runs, so the build-time sweep governs. The plan uses `0NN` throughout.
4. Record the sweep output in the task folder's `worklog.md` decision log (ADR-020; the 0240-verification precedent).

## Step 2 — Write the ADR

**File:** `ai-agents/knowledge-base/decisions/adr-0NN-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md` (shape `adr-<NNN>-<slug>.md`; slug adjustable, must be non-empty).
**House format** per `/fkit-record-decision` Step 3, with the one-line "What this ADR decides" blockquote ADR-015 itself models.

**Header:** Status `accepted`; Date = filing date (per the skill: today's date), with every ruling dated **2026-08-06** in the body; Deciders = owner (Mark Dolbyrev) via `AskUserQuestion`, live `fkit lead` session, 2026-08-06 — recorded by fkit-architect for task 0242.

**Context section must carry:**
- ADR-015 re-raise **trigger 1 fired on the proposal** (the owner's ruling-2 "if needed updated the structure") — cite report §3.
- **Trigger 2 fired with evidence:** 7 drifting fkit-authored files ≥ 3 — cite report §3's verified file list (and its dogfood-checkout caveat, which the report states rather than hides).
- Why a **new** record: ADR-015's own Amendment doctrine — amendment form is for "evidence, not decision"; a repair licence is a changed ruling.
- **Provenance + mapping:** rulings numbered Q1–Q6 as put to the owner, mapping onto report §10 items **1, 2, 4, 5, 6, 7**; §10 item 3 (`CLAUDE.md`/`AGENTS.md` in scope, verbatim "In scope (Recommended)") was ruled before the report was written and is recorded as already-settled scope.

**Decision section — six numbered subsections, each quoting its ruling character-exact, dated, channel named:**
1. **The scoped grant (Q1, "Companion ADR (Recommended)"):** ADR-015's invariant **unchanged and in force for the unattended launch path**; a separate **in-session, owner-present, consent-gated** repair capability is licensed; **v1 = consent-gated replacement of untouched-stale fkit-authored files only — no move, no rename, no delete.**
2. **Consent (Q2, "Plan-level approval (Recommended)"):** propose-then-apply per report §7 — plan-level approval of the exact enumerated per-file list with diffs in view; **apply-time freshness re-check**; **never announce-only; never stored**; consent is per-run, in the session where it is given.
3. **Trigger (Q3, "Yes + yes (Recommended)"):** on-demand check as the repair's **only** entry point; read-only stateless launch-time stderr notice as the awareness layer; **per-path** tracked intent-file suppression (**intent, not progress** — no global switch, no per-mismatch keying), with the consequence owned openly: **a suppressed path stays silent across versions**; **no per-project progress or cursor state anywhere**.
4. **Owning role (Q4, "Yes, producer (Recommended)"):** producer custodian of the check-and-repair skill; any repair under `ai-agents/wiki-vault/` is **routed to `fkit-wiki`** (ADR-005), never performed by the producer.
5. **Spec maintenance (Q5, "Yes (Recommended)"):** hand-authored prose spec in the install share, guarded by a mechanical scaffold-inventory drift test.
6. **Manifest fold-in (Q6, "Fold it in (Recommended)"):** the hash manifest (ADR-015's deferred alternative) becomes this capability's **determination layer**; the trigger-2 scope call ADR-015 said would return to the owner **is hereby taken**, evidence cited to report §3.

**Options considered:** (b) companion ADR — chosen; (a) amend ADR-015 in place — rejected (amendment form is evidence-only); (c) wholesale supersession — rejected (nothing about the unattended path changes) — all **cited to report §3, not re-derived**. Also by citation: the §5/§9 rejected alternatives the design leaned on (share-stamp cursor candidate 4; LLM-judged drift; overwrite-on-launch; project-local spec copy; announce-only/stored consent per the orphan-cleanup precedent).

**Consequences:** positive — ADR-015's load-bearing property ("the one unattended code path… bounded by a one-line invariant") stays **literally true**; the content-drift residual becomes closable with consent. Negative — two records now govern adjacent territory (the cross-reference is the mitigation); two more shipped artifacts (spec + manifest) to keep test-guarded. **Re-raise only if** (recording scope boundaries, not new design): any proposal to widen v1 to move/rename/delete; any announce-only or stored-consent proposal; any per-project progress/cursor state; any global or per-mismatch suppression keying — each returns to the owner.

**Related:** the report, ADR-015, ADR-005, the 0242–0249 implementation chain. No `:NNN` line-number citations (durable-citation convention, per the report's own header).

## Step 3 — The ADR-015 cross-reference (item 8 — ruled IN scope, not droppable)

Append **exactly one line** to ADR-015: a list item at the end of its `## Related` section —

`- [ADR-0NN](adr-0NN-….md) — **2026-08-06 (evidence, not decision):** both re-raise triggers have since fired and were ruled on by the owner; a consent-gated, in-session repair capability is licensed there. Nothing in this ADR's Decision changes; the invariant above is unchanged for the unattended launch path.`

**Placement rationale (plan decision, stated for the gate):** the brief requires the cross-reference be a *one-line dated* addition and verification step 8 requires `git diff` on ADR-015 to be **one addition**. A Related-section list item is the only placement that yields a clean single added line — a new paragraph in the `Re-raise only if` or Amendment sections needs a blank separator line (two additions) or would merge into an existing paragraph. "Amendment form" in the brief describes the *character* (evidence-pointer, no ruling changes), which the line's own wording carries. ADR-015's Status line and every other byte stay untouched.

## Step 4 — Verify (concretized from the brief's 9 steps)

1. New ADR exists under `decisions/`, filename conforms (`adr-<NNN>-<slug>.md`); re-run skill Steps A + B → highest = NN.
2. `grep` the new ADR for each verbatim ruling string — `"Companion ADR (Recommended)"`, `"Plan-level approval (Recommended)"`, `"Yes + yes (Recommended)"`, `"Yes, producer (Recommended)"`, `"Yes (Recommended)"`, `"Fold it in (Recommended)"` — each present character-exact, each dated 2026-08-06 with channel named; the Q→§10 mapping statement present.
3. `grep` for the load-bearing phrases: invariant-unchanged statement; "no move, no rename, no delete"; "never announce-only"; "never stored"; apply-time freshness re-check; "intent, not progress"; no per-project progress/cursor state; suppressed-path-stays-silent consequence; producer custodian; ADR-005 wiki routing; trigger-2 evidence cited to the report.
4. `git diff --numstat` on ADR-015 → exactly `1 0` (one added line, zero deleted).
5. `node --test test/adr-number-uniqueness.test.js` passes (and the full suite if cheap).
6. `git status --porcelain` → only the new ADR + ADR-015 (+ the driver's `plan.md`/`worklog.md` task artifacts); **nothing** under `claude/`, `test/`, `ai-agents/wiki-vault/`. **No commit** at any point.

## Edge cases & failure modes

- **Number race with `0240`:** it targets the same next-number pool but is unscheduled; the build-time sweep is authoritative. If anything claims 039 between now and build, take the next free number — the plan's `0NN` placeholders absorb this.
- **Verbatim fidelity:** copy ruling strings from the brief (the authoritative transcription); paraphrase fails verification step 2.
- **Scope creep in the ADR body:** the ADR *records*; any sentence that re-weighs a ruling or adds design beyond report citations is a defect (brief ⛔ "No re-opening").
- **ADR-015 diff creep:** editors that reflow or strip trailing whitespace would break the one-addition check — verify with `--numstat`, not by eye.
- **Wiki ingest temptation:** the vault write is `0249` (`fkit-wiki`), not this task — the report step notes the recommendation only.

## Out of scope (enforced, per the brief)

No implementation (`claude/fkit-claude-init.sh`, `claude/fkit-claude.sh`, `install.sh`, scaffold, `test/`, skills untouched); no re-opening any ruling; no ADR-015 edit beyond the one line; no `ai-agents/wiki-vault/` write; no commit, no push, no re-rank, no task-file move (close routes to the producer, ADR-033).

## Dependencies

Depends on nothing. Blocks `0243`, `0246`, `0247`, `0249`; `0244` ships behind it (buildable before it, report §11 unit 3).
