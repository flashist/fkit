# Add the launch-time structure notice and per-path intent-file suppression

## ID
0247

## Sprint
Sprint 4

## Priority
Sprint 4 P6

## Status
🔄 In progress

## Owner
fkit-coder

## Context

**Implementation unit 6 of the `0241` design** — report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
§5 (candidate 2) and §11. Authority (`AskUserQuestion`, live `fkit lead` session, **2026-08-06**):

- **Q3 — the trigger, verbatim: "Yes + yes (Recommended)"** — the read-only stateless launch-time
  stderr notice **is approved** alongside the on-demand check, **with tracked per-path intent-file
  suppression (intent, not progress)** and **no per-project progress/cursor state**. §11 made this
  unit conditional on that approval ("only if Q4 approves", the report's numbering for this
  question) — **the condition is discharged; the unit is licensed.**

The notice is the awareness layer only: *nobody runs what nobody is told to run* (report §5). The
repair's only entry point stays the on-demand check (`0245`/`0246`).

## What to build

Launcher/init shell, per report §5 candidate 2 exactly:

1. **A cheap, read-only, notice-only pass** piggybacking the existing every-launch hook: compare
   spec (`0243`) + manifest (`0244`) vs disk; print **one stderr line** when the project does not
   conform, in the same channel and shape as convergence's own announcements (init's "THE OUTPUT
   TRAP" comment is the authority for stderr). **Never a repair, never a prompt.**
2. **No memory:** the notice prints while the mismatch exists and stops when it is fixed —
   self-limiting the way the orphan cleanup is. **No per-project progress or cursor state anywhere**
   (Q3; ADR-015 Context §3's rejected cursor stays rejected).
3. **Per-path intent-file suppression** — the `ai-agents/.fkit-keep-out` precedent (*"It records
   INTENT, not progress"*): a **tracked** entry names one path and means "divergence at this path is
   deliberate; stop telling me about it." **Scope rules from §5, binding:** **no global switch**
   (would mute mismatches a future version introduces at unruled paths); **no per-mismatch keying**
   (that records a position — the rejected cursor by the back door). The owned consequence, stated in
   the artifact's own docs: a suppressed path stays silent even when a future version changes what
   ships there; reversible by deleting the entry; survives a clone, shared with teammates.
4. **Safety-bar rows as tests** (report §9 / ADR-015 §"The safety bar"): non-fatal on every failure,
   symlink refusal (`-L`-first), keep-out respect, stderr-only output — and **complete silence on a
   conforming project** (the happy path stays silent, per init's output-trap rule).

### ⛔ Out of scope

- ⛔ **Any write to the consuming project from the launch path.** The notice is read-only; ADR-015's
  invariant is unchanged for this path (`0242`). **No silent auto-update — ever, and especially not
  here.**
- ⛔ Any repair or prompt at launch; repair is `0246`'s in-session consent-gated path only.
- ⛔ Any per-project progress/cursor state, any global suppression switch, any per-mismatch keying.
- ⛔ Any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. On a conforming fixture project: launch output is **byte-identical** to before this change —
   complete silence from the notice.
2. On a drifted fixture: exactly one stderr line appears, naming the mismatch; **nothing on stdout**;
   no file in the project is created or modified by the notice pass.
3. Fix the drift; the notice stops — with no state file having recorded anything.
4. Add the per-path intent entry for a drifted path: that path's notice is suppressed; a **second**
   drifted path still notices (per-path scope proven).
5. Safety-bar tests green: symlink fixture refused via `-L`-first; failure in the notice pass is
   non-fatal to launch; keep-out respected.
6. `grep` the diff: no write action against project paths in the launch-path code; `npm test` green
   including the new launcher-contract cases.

## Notes

- **Depends on:** `0242` (the ADR records the Q3 approval this unit is conditional on), `0243`,
  `0244`.
- **Blocks:** nothing — `0248` documents it if landed, but does not wait on it (report §11 scopes
  unit 7's deps to units 1–5).
- **Source of truth:** report §5 candidate 2 (including the per-path scope statement), §9
  (safety-bar and silence fixtures). Implement, do not re-derive.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint named by the owner;
  no re-rank (ADR-035).
