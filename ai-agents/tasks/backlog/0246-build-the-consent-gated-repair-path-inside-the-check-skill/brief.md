# Build the consent-gated repair path inside the check skill — propose-then-apply, v1 scope

## ID
0246

## Sprint
Sprint 4

## Priority
Sprint 4 P5

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Implementation unit 5 of the `0241` design** — report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
§7, §8, §11. **This is the genuinely new capability the whole design exists to license** — repairing
*existing* content, exactly what
[ADR-015](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)'s
invariant forbids the unattended script to do.

Authority (`AskUserQuestion`, live `fkit lead` session, **2026-08-06**):

- **Q1 — the licence, verbatim: "Companion ADR (Recommended)"** — the unattended launch path keeps
  ADR-015's invariant **unchanged**; a separate **in-session consent-gated repair capability is
  licensed**; **narrow v1 = replace untouched-stale files only, no move/rename/delete**. The durable
  record is `0242` — **this task must not start before `0242` lands** (a repair capability built
  before its licence is recorded is the "mechanism built around the record" the design exists to
  prevent).
- **Q2 — consent, verbatim: "Plan-level approval (Recommended)"** — **enumerated per-file list with
  diffs in view; never announce-only; never stored consent.**

## What to build

The repair phase of the `0245` skill, per report §7's four-step consent model:

1. **In-session, owner present.** The check's per-file conformance report is the input; repair is
   reachable **only** from a live session (the sprint-loop relay pattern counts — decisions surfaced
   to the owner live).
2. **Propose:** the full change list — per file the action, and for replacements the **diff**.
   Nothing applied yet. Announce does not substitute for consent on this path.
3. **Consent, per Q2:** owner approves via `AskUserQuestion` — **plan-level approval of the exact
   enumerated per-file list with diffs in view**; any destructive item (none exist in v1) called out
   individually. **Never announce-only. Never stored** — consent is per-run, in the session where it
   is given (the orphan-cleanup record: *"a stored decision cannot survive a clone either"*).
4. **Apply exactly what was approved — behind the apply-time freshness re-check:** immediately before
   each replacement, re-hash the on-disk file; if it no longer matches the state the proposal showed,
   that item is **refused and reported**, never applied. Then announce per path **what actually
   happened**, per init's reporting bar.

**v1 scope (Q1, binding):** replace **untouched-stale** fkit-authored files with the installed
version; **owner-edited files are report-only with diffs, touched never; no move, no rename, no
delete.** `CLAUDE.md`/`AGENTS.md` body repair under the **same consent model** (report §8): only an
untouched-stale body (marker region elided) is eligible; markers and the current fkit-managed block
are preserved through the rewrite; malformed/absent markers are report-only (per `0245`).

### ⛔ Out of scope

- ⛔ **Anything beyond v1**: no move, no rename, no delete, no repair of owner-edited files, no
  repair of wrong-type findings, no `.gitkeep` logic.
- ⛔ **Any write under `ai-agents/wiki-vault/`** — whatever the spec says the vault should contain,
  vault repair is routed to `fkit-wiki`
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **Any launch-path mutation.** Repair never lives in init or the launcher — it is a skill, in a
  session, behind consent (report §9's normalisation-risk mitigation). **A silent auto-update is
  exactly what the record forbids.**
- ⛔ Any stored/remembered consent, any global "always allow", any per-project progress state.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. **Dry-run/apply parity fixture (report §9):** the applied set is exactly the approved proposal —
   nothing more, nothing less — and each applied file still hash-matched the pre-state the proposal
   showed.
2. **Freshness-refusal fixture:** a file edited between consent and apply sees that item refused and
   reported, not applied.
3. **v1 boundary fixtures:** an owner-edited file is never in the apply set (report-only with diff);
   no code path can move, rename, or delete anything (grep + fixture).
4. **ADR-005 assertion fixture:** a repair run against a nonconforming `wiki-vault/` writes
   **nothing** under it.
5. **Consent shape:** approval is collected via `AskUserQuestion` with the enumerated per-file list
   and diffs in view; no consent is persisted anywhere (no file, no config, no env).
6. **`CLAUDE.md` fixtures:** an untouched-stale body is replaced with markers + current block
   preserved byte-for-byte; block-only drift triggers no repair; malformed markers are report-only.
7. Per-path announce output states what actually happened for every item, including refused ones.
8. `npm test` green; the launcher/init diff for this task is empty (no launch-path change).

## Notes

- **Depends on:** `0242` (the licence — hard; do not start before it lands), `0245`.
- **Blocks:** `0248`.
- **Source of truth:** report §7 (consent model, v1 scope, forbidden shapes), §8 (root-file
  mechanics), §9 (fixtures). Implement, do not re-derive — and where this brief and the recorded
  `0242` ADR could be read apart, **the ADR governs**.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint named by the owner;
  no re-rank (ADR-035).
