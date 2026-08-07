# ADR-039: A consent-gated, in-session structure repair is licensed; ADR-015's invariant is unchanged for the unattended launch path

- **Status:** accepted
- **Date:** 2026-08-07 (filed; every ruling recorded below was taken **2026-08-06**)
- **Deciders:** owner (Mark Dolbyrev), via `AskUserQuestion` in a live `fkit lead` session,
  2026-08-06 — recorded by fkit-architect for task 0242
- **Evidence:** the design report
  [`2026-08-06-design-post-update-structure-check.md`](../reports/2026-08-06-design-post-update-structure-check.md)
  (task 0241). Every design argument below is **cited to that report, not re-derived**. Citation
  form: per the durable-citation convention, this ADR cites path + section name, never `:NNN` line
  numbers.

> **What this ADR decides, in one line:** the unattended launch path keeps
> [ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md)'s invariant **unchanged
> and in force**; separately, an **in-session, owner-present, consent-gated** repair capability is
> licensed, whose v1 scope is consent-gated replacement of **untouched-stale fkit-authored files
> only — no move, no rename, no delete.**

## Context

### Both of ADR-015's re-raise triggers fired

ADR-015's `Re-raise only if` fence has two triggers, and by 2026-08-06 both had fired:

- **Trigger 1 fired on the proposal.** ADR-015: *"Someone PROPOSES a change that would move,
  rename, or delete content inside a consuming project's `ai-agents/`… The trigger fires on the
  proposal, not on the implementation… It voids this decision and returns to the owner."* The
  owner's own ruling 2 of 2026-08-06 — verbatim *"if needed updated the structure"* — **is** such a
  proposal, made without ADR-015's record in front of them. Report §3 states this and routes it the
  sanctioned way: back to the owner with the invariant, the costs, and the recorded alternatives
  laid out.
- **Trigger 2 fired with evidence.** Trigger 2 reads: *"A THIRD fkit-authored file inside
  `ai-agents/` starts drifting."* Report §3 verified **seven** drifting fkit-authored files —
  `README.md`, `knowledge-base/conventions/README.md`, and five `conventions/*.md` files — so
  **7 ≥ 3**. The report states its caveat rather than hiding it: this repo is fkit's own dogfood
  checkout, where part of the divergence is the consuming copy running *ahead* of the scaffold —
  but drift is divergence in either direction, and the trigger's text draws no such distinction.

### Why a new record, not an amendment

ADR-015's own Amendment section sets the doctrine: the in-place amendment form is for *"evidence,
not decision"* changes — *"A superseding ADR exists to explain a changed ruling."* Granting a
repair licence **is** a changed ruling, so it needs a new record. And because nothing about the
unattended path's rules changes, supersession would retire a record that should stay in force
(report §3, option c). Hence this companion ADR.

### Provenance and mapping

All six rulings below were taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06**, against report §10, and are numbered **Q1–Q6 as they were put to the owner**. They
map onto the report's §10 items **1, 2, 4, 5, 6, 7**. Report §10 item 3 — `CLAUDE.md`/`AGENTS.md`
refresh in scope, verbatim **"In scope (Recommended)"** — was ruled **before the report was
written** and is recorded here as already-settled scope, not as one of the six.

## Decision

### 1. The scoped grant (Q1 — report §10.1, §3)

Owner ruling, verbatim **"Companion ADR (Recommended)"** (`AskUserQuestion`, live `fkit lead`
session, 2026-08-06). ADR-015's invariant is **unchanged and in force for the unattended launch
path** — convergence stays create-if-absent only. Separately, an **in-session, owner-present,
consent-gated** repair capability is licensed. **v1 scope: consent-gated replacement of
untouched-stale fkit-authored files only — no move, no rename, no delete.** The destructive-path
class stays unlicensed; if one ever arrives, ADR-015's prescription stands: an executable,
reviewed, tested script, gated on explicit consent, never run unattended on launch.

### 2. The consent model (Q2 — report §10.2, §7)

Owner ruling, verbatim **"Plan-level approval (Recommended)"** (`AskUserQuestion`, live `fkit
lead` session, 2026-08-06). Propose-then-apply, per report §7: **plan-level approval of the exact
enumerated per-file list with diffs in view**; an **apply-time freshness re-check** — immediately
before each replacement the on-disk file is re-hashed, and an item whose state no longer matches
what the proposal showed is refused and reported, never applied. Consent is **never announce-only;
never stored** — it is per-run, in the session where it is given.

### 3. The trigger (Q3 — report §10.4, §5)

Owner ruling, verbatim **"Yes + yes (Recommended)"** (`AskUserQuestion`, live `fkit lead` session,
2026-08-06). The **on-demand check is the repair's only entry point**; a **read-only, stateless
launch-time stderr notice** is the awareness layer — never a repair. Deliberate divergence is
suppressed via **per-path tracked intent-file entries** — recording **intent, not progress** — with
**no global switch and no per-mismatch keying**. The consequence of per-path scope is owned openly:
**a suppressed path stays silent across versions**, even when a future fkit version changes what
ships there; that is consistent with the intent recorded and reversible by deleting the entry.
**No per-project progress or cursor state exists anywhere** in this capability.

### 4. The owning role (Q4 — report §10.5, §6)

Owner ruling, verbatim **"Yes, producer (Recommended)"** (`AskUserQuestion`, live `fkit lead`
session, 2026-08-06). The **producer is custodian** of the check-and-repair skill. Any repair under
`ai-agents/wiki-vault/` is **routed to `fkit-wiki`**
([ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md) — wiki writes are exclusive to
the wiki role), **never performed by the producer**, whatever the spec says the vault should
contain.

### 5. Spec maintenance (Q5 — report §10.6, §4)

Owner ruling, verbatim **"Yes (Recommended)"** (`AskUserQuestion`, live `fkit lead` session,
2026-08-06). The structure-spec is a **hand-authored prose spec living in the install share**,
guarded by a **mechanical scaffold-inventory drift test** that fails the build when the spec's path
inventory and `claude/scaffold/` disagree — so a scaffold change cannot land without the spec
moving in the same commit.

### 6. The manifest fold-in (Q6 — report §10.7, §7)

Owner ruling, verbatim **"Fold it in (Recommended)"** (`AskUserQuestion`, live `fkit lead`
session, 2026-08-06). The **content-identity hash manifest** — ADR-015's deferred alternative
(§"Rejected alternatives — A shipped content-identity hash manifest") — becomes this capability's
**determination layer**: it alone decides touched-or-not, while the spec decides what should exist
and what each path means (report §7). The scope call ADR-015 said would return to the owner when
trigger 2 fired **is hereby taken** — the trigger-2 evidence is the seven drifting files verified
in report §3.

## Options considered

Weighed in report §3 — **cited, not re-derived**:

- **(b) A new companion ADR — chosen.** Records the scoped grant while keeping ADR-015's
  load-bearing property literally true. This document.
- **(a) Amend ADR-015 in place — rejected.** ADR-015's own Amendment doctrine reserves the
  amendment form for evidence-only changes; a repair licence is a changed ruling (report §3
  option a).
- **(c) Supersede ADR-015 wholesale — rejected.** Nothing about the unattended path changes;
  supersession would retire a record that should stay in force (report §3 option c).

Also rejected, by citation to the report's §5 and §9 (the alternatives the design leaned on):

- **Install-share-stamp-keyed trigger ("since last look")** — report §5 candidate 4: needs a
  per-project last-seen-sha memory, which is a **cursor: progress, not intent** — it re-opens the
  mechanism ADR-015 Context §3 rejected.
- **LLM-judged drift (no manifest)** — report §9: re-creates the indistinguishability problem that
  sank ADR-015's migration agent.
- **Overwrite fkit-authored files on launch** — report §9, ADR-015 §Rejected alternatives: destroys
  owner edits; in this very repo part of the drift is hand-authored improvement.
- **Project-local spec copy** — report §4/§9: self-defeating under create-if-absent — the spec
  would fall into exactly the trap it exists to fix.
- **Announce-only or stored consent** — report §2/§7, per the orphan-cleanup precedent: that
  ruling *"sets no precedent"*, and a stored decision cannot survive a clone — the same trap as the
  cursor.

## Consequences

- **Positive:** ADR-015's load-bearing property — *"the one unattended code path that touches a
  user's project is bounded by a one-line invariant"* — stays **literally true**; the unattended
  launch path gains no new power. The content-drift residual ADR-015 deferred with eyes open
  becomes closable **with consent, in a session**.
- **Negative / costs:** two records now govern adjacent territory (unattended vs consented) and
  readers must hold both — the dated cross-reference in ADR-015's Related section is the
  mitigation. Two more shipped artifacts (the structure-spec and the hash manifest) must stay
  test-guarded or they join the mirror-rot failure class (report §9).
- **Re-raise only if** (recording scope boundaries, not new design — each of these returns to the
  owner):
  - any proposal to **widen v1 to move, rename, or delete**;
  - any **announce-only or stored-consent** proposal for the repair path;
  - any **per-project progress or cursor state**;
  - any **global or per-mismatch suppression keying** for the intent file.

## Related

- [`2026-08-06-design-post-update-structure-check.md`](../reports/2026-08-06-design-post-update-structure-check.md)
  — the full design: §3 (the re-raise and trigger-2 evidence), §4 (spec), §5 (trigger), §6 (check
  and roles), §7 (repair path and consent), §8 (`CLAUDE.md`/`AGENTS.md`), §9 (alternatives, risks,
  testing), §10 (the questions as put), §11 (the implementation split).
- [ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md) — the record this ADR
  companions: its invariant, safety bar, and rejected alternatives all stay in force for the
  unattended path; it carries a dated cross-reference back to this ADR.
- [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md) — the wiki-write exclusivity
  that Decision §4's routing rule preserves.
- The 0242–0249 implementation chain: 0242 (this record), then the structure-spec, manifest
  generator, check skill, repair path, launch notice, and docs/wiki ingest per report §11.
