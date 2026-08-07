# ADR-039: A consent-gated, in-session structure repair is licensed; ADR-015's invariant is unchanged for the unattended launch path

**Date**: 2026-08-07 (filed; **every ruling below was taken 2026-08-06**)
**Status**: accepted

**In one line:** the unattended launch path keeps [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]'s
invariant **unchanged and in force**; separately, an **in-session, owner-present, consent-gated**
repair capability is licensed, whose **v1 scope is consent-gated replacement of untouched-stale
fkit-authored files only — no move, no rename, no delete.**

Recorded by fkit-architect for task `0242` (the companion ADR the `0241` design recommended).
Evidence: the design report `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md`
— every design argument in the ADR is **cited to that report, not re-derived**, in the
durable-citation form (path + section name, never `:NNN`).

## ⚠️ The numbering trap — read before citing any "Q" number

The ADR numbers its six rulings **Q1–Q6 as they were put to the owner**. They map onto report
**§10 items 1, 2, 4, 5, 6, 7** — *not* 1–6. Report §10 item **3** (`CLAUDE.md`/`AGENTS.md` refresh
in scope, verbatim **"In scope (Recommended)"**) was ruled **before the report was written** and is
recorded in the ADR as **already-settled scope, not one of the six**. So ADR Q3–Q6 correspond to
report items 4–7 — and the [[tasks/design-the-post-update-structure-check]] page's §Outcome, which
counts in the report's own numbering (where "Q3" is the pre-ruled in-scope item and the manifest
fold is "Q7"), uses the **report's** numbers, not the ADR's. Do not mis-map one space onto the
other.

## Context

- **Both of ADR-015's `Re-raise only if` triggers fired by 2026-08-06.** Trigger 1 fired **on the
  proposal**: the owner's own ruling — verbatim *"if needed updated the structure"* — is a proposal
  to change structure inside a consuming project's `ai-agents/`, made without ADR-015's record in
  front of them; report §3 routes it the sanctioned way, back to the owner with the invariant,
  costs, and recorded alternatives laid out. Trigger 2 (*"a THIRD fkit-authored file starts
  drifting"*) fired **with evidence**: report §3 verified **seven** drifting fkit-authored files
  (`README.md`, `knowledge-base/conventions/README.md`, five `conventions/*.md`), so **7 ≥ 3** —
  with the dogfood caveat stated rather than hidden: this repo is fkit's own checkout, where part
  of the divergence is the consuming copy running *ahead* of the scaffold, but drift is divergence
  in either direction and the trigger's text draws no such distinction.
- **Why a new record, not an amendment or supersession.** ADR-015's own Amendment doctrine reserves
  in-place amendment for *"evidence, not decision"* changes; granting a repair licence **is** a
  changed ruling. And supersession would retire a record that should stay in force — nothing about
  the unattended path changes (report §3, options a and c). Hence a companion ADR.

## Decision — the six rulings, verbatim

All six taken via `AskUserQuestion` in a live `fkit lead` session, **2026-08-06**:

1. **The scoped grant** (Q1 — report §10.1, §3). Verbatim **"Companion ADR (Recommended)"**.
   ADR-015's invariant is **unchanged and in force for the unattended launch path** — convergence
   stays create-if-absent only. Separately, an in-session, owner-present, consent-gated repair is
   licensed. **v1: replacement of untouched-stale fkit-authored files only — no move, no rename,
   no delete.** The destructive-path class stays unlicensed; if one ever arrives, ADR-015's
   prescription stands (an executable, reviewed, tested script, explicit consent, never unattended
   on launch).
2. **The consent model** (Q2 — report §10.2, §7). Verbatim **"Plan-level approval (Recommended)"**.
   Propose-then-apply: **plan-level approval of the exact enumerated per-file list with diffs in
   view**; an **apply-time freshness re-check** — each file re-hashed immediately before
   replacement, and an item whose state no longer matches the proposal is refused and reported,
   never applied. Consent is **never announce-only, never stored** — per-run, in the session where
   it is given.
3. **The trigger** (Q3 — report §10.4, §5). Verbatim **"Yes + yes (Recommended)"**. The
   **on-demand check is the repair's only entry point**; a **read-only, stateless launch-time
   stderr notice** is the awareness layer — never a repair. Deliberate divergence is suppressed via
   **per-path tracked intent-file entries** — intent, not progress — no global switch, no
   per-mismatch keying. The cost is owned openly: a suppressed path stays silent across versions.
   **No per-project progress or cursor state exists anywhere** in the capability.
4. **The owning role** (Q4 — report §10.5, §6). Verbatim **"Yes, producer (Recommended)"**. The
   **producer is custodian** of the check-and-repair skill; any repair under `ai-agents/wiki-vault/`
   is **routed to `fkit-wiki`** and never performed by the producer, whatever the spec says the
   vault should contain ([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]).
5. **Spec maintenance** (Q5 — report §10.6, §4). Verbatim **"Yes (Recommended)"**. The
   structure-spec is a **hand-authored prose spec in the install share**, guarded by a
   **mechanical scaffold-inventory drift test** failing the build when the spec's path inventory
   and `claude/scaffold/` disagree — a scaffold change cannot land without the spec moving in the
   same commit.
6. **The manifest fold-in** (Q6 — report §10.7, §7). Verbatim **"Fold it in (Recommended)"**. The
   **content-identity hash manifest** — ADR-015's deferred alternative — becomes the capability's
   **determination layer**: it alone decides touched-or-not; the spec decides what should exist and
   what each path means. The scope call ADR-015 said would return to the owner when trigger 2 fired
   **is hereby taken**, on the seven-file evidence.

**Options rejected** (report §3, §5, §9, cited not re-derived): amend ADR-015 in place; supersede it
wholesale; an install-share-stamp "since last look" trigger (a cursor — progress, not intent);
LLM-judged drift with no manifest (re-creates the indistinguishability that sank ADR-015's
migration agent); overwriting fkit-authored files on launch (destroys owner edits — in this very
repo part of the drift is hand-authored improvement); a project-local spec copy (self-defeating
under create-if-absent); announce-only or stored consent (the orphan-cleanup ruling *"sets no
precedent"*, and a stored decision cannot survive a clone).

## Consequences

- ADR-015's load-bearing property — *"the one unattended code path that touches a user's project is
  bounded by a one-line invariant"* — stays **literally true**; the unattended path gains no new
  power. The content-drift residual ADR-015 deferred with eyes open becomes closable **with
  consent, in a session**.
- **Costs:** two records now govern adjacent territory (unattended vs consented) and readers must
  hold both — ADR-015's dated cross-reference is the mitigation. Two more shipped artifacts (the
  structure-spec and the hash manifest) must stay test-guarded or they join the mirror-rot failure
  class (report §9).
- **Re-raise only if** (scope boundaries, each returning to the owner): any proposal to **widen v1
  to move, rename, or delete**; any **announce-only or stored-consent** proposal for the repair
  path; any **per-project progress or cursor state**; any **global or per-mismatch suppression
  keying** for the intent file.

## Related
- `ai-agents/knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md` — the source record
- `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md` — the full design (§3 re-raise evidence, §4 spec, §5 trigger, §6 check/roles, §7 repair + consent, §8 root files, §9 alternatives, §10 the questions as put, §11 the implementation split)
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the record this ADR companions: invariant, safety bar, and rejected alternatives all stay in force for the unattended path
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the wiki-write exclusivity Decision 4's routing rule preserves
- [[tasks/design-the-post-update-structure-check]] — task `0241`: the design this ADR records the rulings for, and the sanctioned ADR-015 re-raise
- [[systems/launch-convergence-and-init]] · [[systems/install-and-self-update]] — the seams the capability sits beside (the unattended launch path gains no new power)
