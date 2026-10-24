# Amend the review ledger's location column to *"heading + fragment where the target is a coordination document"*

**Source**: `ai-agents/tasks/done/0369-amend-the-review-ledger-location-column-to-heading-plus-fragment-for-coordination-documents/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 7 · `P14` · task `0369` · owner `fkit-coder`

> ⭐ **Ingested 2026-10-24 by task `0380`** (the closed-task backlog Sweep C bounded out). `plan.md`,
> `worklog.md` and `review.md` read as evidence.

## Goal
The stateful-review ledger's findings table had a `file:line` column. For a finding in a **coordination
document** (a brief, plan, ledger), that pushes the reviewer to write exactly the `path:NNN` form that
`0176`'s guard forbids there. Owner ruling **G1** at `0176`'s plan gate (2026-09-02, *"A + file follow-up
D (Rec)"*) ordered the column changed; it went **unfiled for two days and three review rounds**
(`0176`'s own review, Sweep A rounds 1 and 2), each of which had to be told the rule in its spawn prompt.

## Key Changes
- ⛔ **Both halves of the ledger schema in one change** — `claude/skills/fkit-stateful-review/SKILL.md`
  (the reviewer writes) and `claude/skills/fkit-process-stateful-review/SKILL.md` (the coder reads).
  Amending one alone would desync the schema.
- The header cell `file:line` became **`Location`**, and both files gained the same short rule block,
  byte-identical: the form depends on the **target** — heading + quoted fragment for a coordination
  document, `path:NNN` still correct for a **source file** (`0176`'s ruling G3). *"In the row:"* the
  heading goes in `Location`, the fragment in `Claim`.
- The example row was kept as a source-file citation, so the legal source form is the one shown.
- ⛔ **Edited by site, never by find-and-replace** — nine of the fourteen `file:line` sites listed are
  correctly about citing **code**. Each Hard-rules *"cite `file:line`"* bullet was left, because it is
  about verifying claims against code; review round 1 scoped the reviewer's one to *"against the code"*
  (owner ruling K1). The other reviewer-side files got recorded in/out verdicts.

## Outcome
- Closed agent-closed; ledger `Status: closed-out`. `npm test` 833/833 and prove-red 28/28 at the time.
- ⚠️ **Not live until a refresh:** running agents read the gitignored `.claude/` copies, so the change
  takes effect only once `claude/fkit-claude-init.sh .` is re-run — the build step deliberately did not
  run it. (Both canonical files carry the `Location` column today, read 2026-10-24.)
- ⚠️ **Knowingly left:** `ai-agents/tasks/README.md` and its scaffold twin still showed `file:line` in
  their copy of the schema (returned to the producer); a comment in
  `test/coordination-citation-policy.test.js` calling this follow-up unfiled went stale (flagged, not fixed).
- Existing open ledgers keep the old header — not a defect.
- Same class, different file: open `0172` narrows the architect's own `path:line` mandate; whichever
  runs second was told to match this wording.

## Related
- [[tasks/build-the-coordination-citation-policy-guard]] — `0176`, the guard and the ruling (G1) this task carried out
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, the convention the `Location` rule points to
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] — two of the three review rounds that paid the friction
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board it shipped on
- [[systems/review-and-model-diversity]] — the review procedures whose ledger schema changed
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the parity rule the brief asked to honour
- [[tasks/apply-0307s-ruling-to-0172s-stale-hard-dependency-declaration]] — `0372`, filed the same day about `0172`, the architect-side twin named above
