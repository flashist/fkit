# Append a dated correction note to ADR-010 for the menu reorder

**Source**: `ai-agents/tasks/done/0143-append-a-dated-correction-note-to-adr-010/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified** (2026-08-02)
**Sprint/Tag**: Sprint 2 · task `0143` · owner `fkit-architect`
**Key files**: `ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` (+71 / −0, **additions only**)

## Goal
[[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] describes `fkit-lead` as *"the 'team room' (menu option 7) — routes rather than does. It has no Write or Edit tools, deliberately."* **Four claims in one sentence, all now false.** Decide how an accepted decision record absorbs a later change, and apply it.

**The owner ruled on 2026-07-25: a dated correction note**, over both leaving it alone and editing the body in place. *Silently rewriting a decision record to match today erases the history the record exists to hold.*

**Why an architect task and not a coder edit.** Deciding how a decision record absorbs a later change is a question about the shape of the project's own record-keeping, not a text substitution — **and it sets the precedent for the next time.**

## Key Changes

**This task established the knowledge-base correction-note form**, and it is the durable output:

- **Two markers, with a legend in the ADR header.** **⚠️ = a fact that drifted** (the decision is untouched) · **⛔ = a decision that was overturned** (do not follow it).
- **The note goes *below* the claim it corrects**, at the claim — not in a header banner, not nineteen lines away.

  > ✅ **Dated note 2026-08-03 — this clause now governs the VAULT as well as the knowledge-base.** Owner ruling, given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session: `0143`'s form governs **both surfaces**, and the vault's own opposite wording — *"banner above claim"*, stated by [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] (`0141`) — is superseded from that date. **The bullet above is left byte-identical**; only its scope widened. ⚠️ **Except the vault's `log.md`**, which is append-only with no exceptions — a correction there is a new dated entry, not a note at the claim ([[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]], `0211`).

- **Every corrected sentence is left byte-identical**, and the note says so in those words.
- **Additions only.** No existing line was edited; `Status` stays `accepted`.
- **No `:NNN` line numbers into mutable files** — anchor by file plus heading plus quoted phrase.
- **A `- **Corrections:**` header metadata item** carries the legend, so it is discoverable without duplicating it at every note site.

**Three note blocks landed:** a ⚠️ at §Context (the *team room* label, *menu option 7*, and *no Write or Edit tools* — all three false, with today's verified truth beside each), a ⛔ at §Context (*"routes rather than does"* — **reversed** by [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]), and a ⛔ at §Decision 3, the **binding** site.

**The ⚠️/⛔ split is the substance, not decoration.** Three of the four claims are **drift** — the decision is unaffected and stays `accepted`. The fourth is a **reversal** — ADR-031 names that exact site as what it reverses.

## Outcome

⚠️ **It shipped a self-contradiction, knowingly.** The new §Decision 3 block names `claude/skills-for-role.sh` as `skills_for_role()`'s home while its immediate neighbour **§Decision 5, out of this task's scope, still named `claude/fkit-claude.sh`**. **Two different files given as the home of the same function, three decisions apart, on one screen.** Repaired the same day by [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] (`0195`).

⚠️ **The append broke 12 sibling `:NNN` pointers in other files, two of them naked** — the unavoidable price of the owner's binding *"note, not a rewrite"* ruling, since any append displaces every downstream line number. Classified **frontier-move**, not a defect, and folded into the durable-citation-anchors work (`0171`) rather than filed standalone. **The notes' own citations survived untouched, which is live proof of the no-`:NNN` form's value** — and that ruling binds `0170` going forward.

**Its ledger carries an unresolved record defect.** The *Coder response* section states it was written by **`fkit-architect` running `/fkit-process-stateful-review`** — a **coder-owned** skill the ADR-018 hook denies to that identity at any spawn depth, and **no denial record exists anywhere in the folder**. An audit established the artifacts **cannot distinguish** whether the ledger overstates what happened or a denial went unrecorded. **Both are a record defect**; task `0201` writes a note stating both and stopping, and is **gated on explicit owner authorization** because the folder is already under `tasks/done/`. Task `0200` owns the routing question itself.

**Scope discipline was clean:** `ai-agents/wiki-vault/` — including ADR-010's vault page — ADR-031, ADR-022, ADR-018, ADR-012, ADR-032, `/fkit-record-decision`, every source file and every test were verified untouched. **The vault resync is a separate follow-up, task `0199`.**

## Related
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the ADR corrected
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — task `0195`, which repaired the self-contradiction this task knowingly shipped
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the reversal the ⛔ notes record
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] · [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — tasks `0140` and `0139`, the causes of the drift
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — which falsified the *"no Write or Edit tools"* half earlier and independently
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, the citation ruling the note form applies
- [[tasks/disambiguate-the-frozen-history-clause]] — task `0161`, the frozen-history convention this sits under
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — task `0141`, which settled the **vault's** correction-note convention as *"banner above claim"* — **worded opposite to this task's below-the-claim form**, on a different surface; the contradiction is recorded there and **not settled**
  > ⛔ **Dated correction 2026-08-03 — it IS settled now, in this task's favour.** The owner ruled live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session that **`0143`'s form governs both surfaces**; `0141`'s *"banner above claim"* no longer governs the vault. The bullet above is left **byte-identical** as the record of the contradiction while it stood. The ruling **does not** call the 2026-07-29 wording retroactively wrong — it chooses which of its two surviving readings governs from now on.
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook behind its ledger's record defect
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — task `0211`, which carries this correction-note form into the **vault's append-only `log.md`**, and adds **"describe, don't quote"**
- [[tasks/sprint-2-remove-omnigent]] · [[systems/role-locked-sessions]] · [[systems/knowledge-base-structure]]
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, which **audited this task's Process-review routing read-only and did not reopen it**: its ledger asserts the architect was *"running `fkit-process-stateful-review`"*, which the ADR-018 hook denies at any depth, and **no denial is recorded in the folder**. That record defect belongs to `0201`
- [[tasks/teach-record-decision-the-dated-correction-note-form]] — ✅ *Added 2026-08-22:* task `0198`, **follow-up 5 of this task, shipped 2026-08-15** — the form this task established is now written into `/fkit-record-decision` itself, `+111 / −0`. ⭐ **That section is now the only normative source for the git-based append-only proof**
- [[tasks/write-the-durable-citation-anchors-convention-page]] — ✅ *Added 2026-08-22:* task `0171`, which **repaired the 12 sibling pointers this append displaced** (line 37 above) under the owner ruling folding them in. ⭐ Its measurement corrects the framing here in one respect worth carrying: of the ten *further* `adr-012:NNN` pointers it then found, the evidence shows they were **defective at authoring, not broken by an append** — an append made an already-wrong pointer more wrong. ⛔ **Zero `adr-010:NNN` pointers survive anywhere under `decisions/`** (re-measured 2026-08-22)
