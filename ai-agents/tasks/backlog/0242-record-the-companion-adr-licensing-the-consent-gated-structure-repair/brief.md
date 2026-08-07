# Record the companion ADR — the consent-gated structure-repair licence (the ADR-015 re-raise, ruled)

## ID
0242

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Authority — the owner ruled all six open questions of the 0241 design

All six rulings were taken via `AskUserQuestion` in a live `fkit lead` session on **2026-08-06**,
against the design report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
(task `0241`, closed the same day). **Numbering note:** the rulings below are numbered Q1–Q6 as they
were put to the owner; they map onto the report's §10 items **1, 2, 4, 5, 6, 7** (report item 3 —
`CLAUDE.md`/`AGENTS.md` in scope — was already ruled before the report was written).

1. **Q1 — the re-raise licence (report §10.1, §3), verbatim: "Companion ADR (Recommended)".** A new
   ADR via `/fkit-record-decision`; the unattended launch path keeps
   [ADR-015](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)'s
   invariant **unchanged**; a separate **in-session, consent-gated repair capability is licensed**;
   narrow v1 = **replace untouched-stale files only, no move/rename/delete**.
2. **Q2 — consent (report §10.2, §7), verbatim: "Plan-level approval (Recommended)"** — enumerated
   per-file list with diffs in view; **never announce-only; never stored consent**.
3. **Q3 — trigger (report §10.4, §5), verbatim: "Yes + yes (Recommended)"** — read-only stateless
   launch-time stderr notice **plus** the on-demand check; **tracked per-path intent-file
   suppression** (intent, not progress); **no per-project progress/cursor state**.
4. **Q4 — owning role (report §10.5, §6), verbatim: "Yes, producer (Recommended)"** — the producer is
   custodian of the check-and-repair skill; wiki-vault repairs are **always routed to `fkit-wiki`**
   ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
5. **Q5 — spec maintenance (report §10.6, §4), verbatim: "Yes (Recommended)"** — hand-authored prose
   spec in the install share, guarded by a mechanical scaffold-inventory drift test.
6. **Q6 — the manifest (report §10.7, §7), verbatim: "Fold it in (Recommended)"** — the hash manifest
   folds into this capability as its **determination layer**. ADR-015's re-raise **trigger 2 has
   fired**: the report's §3 verified **7 drifting fkit-authored files ≥ 3**.

The owner reviewed the design in the same session and explicitly authorized this filing: *"spawn the
producer to file the 0241 follow-ups (companion ADR task + the implementation split)"*.

### Why an ADR, and why it gates the rest

ADR-015's `Re-raise only if` trigger 1 fired on this proposal (report §3), and its own Amendment
section says a changed ruling needs a new record, not an in-place amendment. Q1 chose option (b): a
**companion ADR** recording a **scoped grant**, keeping ADR-015's load-bearing property — *the one
unattended code path that touches a user's project is bounded by a one-line invariant* — literally
true. Until this ADR exists, the repair-path units (`0246`, and the ship-gates on `0243`/`0244`/
`0247`) have rulings but no durable record to cite; this task is what turns the session rulings into
the record.

## What to build

**An ADR via `/fkit-record-decision`, with nothing else changed** — plus one sanctioned one-line
cross-reference (below). The ADR must record, with date (2026-08-06), channel (`AskUserQuestion`,
live `fkit lead` session), and verbatim wording:

1. **The scoped grant (Q1):** the unattended launch path keeps ADR-015's invariant unchanged and in
   force; a separate in-session, owner-present, consent-gated repair capability is licensed; **v1
   scope: consent-gated replacement of untouched-stale fkit-authored files only — no move, no rename,
   no delete.**
2. **The consent model (Q2):** propose-then-apply per report §7 — plan-level approval of the exact
   enumerated per-file list with diffs in view; apply-time freshness re-check; never announce-only;
   never stored; consent is per-run, in the session where it is given.
3. **The trigger (Q3):** on-demand check as the repair's only entry point; read-only stateless
   launch-time stderr notice as the awareness layer; per-path tracked intent-file suppression (intent,
   not progress — no global switch, no per-mismatch keying); no per-project progress or cursor state
   anywhere.
4. **The owning role (Q4):** producer custodian; any repair under `ai-agents/wiki-vault/` is routed to
   `fkit-wiki` (ADR-005), never performed by the producer.
5. **Spec maintenance (Q5):** hand-authored prose spec in the install share, guarded by a mechanical
   scaffold-inventory drift test.
6. **The manifest fold-in (Q6):** the hash manifest (ADR-015's deferred alternative) is this
   capability's determination layer; record the trigger-2 evidence (7 drifting files, report §3) —
   the scope call ADR-015 said would come back to the owner is hereby taken.
7. **The rejected options**, per the report: amend-in-place and wholesale supersession of ADR-015
   (§3 options a, c), and the §5/§9 rejected alternatives the design leaned on — cite the report, do
   not re-derive.
8. **The cross-reference (report §3 option b's prescribed follow-up):** ADR-015 gains a **one-line
   dated cross-reference** pointing at the new ADR. This is an *evidence-pointer* note in ADR-015's
   own amendment form ("evidence, not decision" — no ruling in ADR-015 changes), the smallest edit
   that keeps two adjacent records navigable. ⚠️ Flagged in the filing report for owner confirmation
   — if the owner prefers the cross-reference as its own task, drop it from this scope.
   - **✅ RULED 2026-08-06 — the flag above is DISCHARGED; item 8 is IN scope and no longer
     droppable. Item left byte-identical.** Owner ruling, verbatim **"Keep in 0242 (Recommended)"**
     (`AskUserQuestion`, live `fkit lead` session, 2026-08-06, relayed by the lead driver). The
     ADR-015 dated cross-reference stays in this task's scope; the "drop it" branch is closed.

### ⛔ Out of scope

- ⛔ **No implementation** — no edit to `claude/fkit-claude-init.sh`, `claude/fkit-claude.sh`,
  `install.sh`, the scaffold, `test/`, or any skill.
- ⛔ **No re-opening of any ruling.** All six are taken; the ADR records, it does not re-weigh.
- ⛔ **No edit to ADR-015 beyond the one-line dated cross-reference** in item 8.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005) — the vault ingest is `0249`.
- ⛔ No commit, no push, no re-rank, no task-file move.

## Verification steps

1. A new ADR file exists under `ai-agents/knowledge-base/decisions/`, produced via
   `/fkit-record-decision`, following the house ADR format.
2. All six rulings appear **verbatim**, each dated 2026-08-06 with the channel named
   (`AskUserQuestion`, live `fkit lead` session), and the Q-number → report-§10 mapping is stated.
3. The ADR states explicitly that ADR-015's invariant is **unchanged for the unattended launch path**,
   and that the licence is **in-session, owner-present, consent-gated, v1 = untouched-stale
   replacement only, no move/rename/delete**.
4. The consent model records **never announce-only, never stored**, plan-level with the per-file list
   and diffs in view, and the apply-time freshness re-check.
5. The trigger section records **no per-project progress/cursor state**, and the intent-file's
   per-path scope with its stated consequence (a suppressed path stays silent across versions).
6. Producer custodianship and the ADR-005 wiki-routing rule are both recorded.
7. The manifest fold-in is recorded **with the trigger-2 evidence cited to the report**.
8. ADR-015 carries the one-line dated cross-reference and **no other change** (`git diff` on that file
   is one addition) — or, if the owner struck item 8, ADR-015 is untouched.

   > **✅ RULED 2026-08-06 — the "struck item 8" branch is CLOSED; step above left byte-identical.**
   > Owner ruling, verbatim **"Keep in 0242 (Recommended)"** (`AskUserQuestion`, live `fkit lead`
   > session, 2026-08-06). This step now verifies exactly one outcome: ADR-015 carries the one-line
   > dated cross-reference and no other change.
9. `git status --porcelain` shows nothing under `claude/`, `test/`, or `ai-agents/wiki-vault/`, and no
   commit was made.

## Notes

- **Depends on:** nothing
- **Blocks:** `0243`, `0246`, `0247`, `0249` — and `0244` ships behind it (buildable before it, per
  the design's §11 unit 3).
- **Source of truth:** report
  [`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
  §3 (the re-raise), §5, §6, §7, §10 — implement the rulings, do not re-derive the design.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint was named by the owner
  (Sprint 3 shipped and closed 2026-08-06); no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
