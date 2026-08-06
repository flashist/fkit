# Decide whether a spawn-time instruction may override a rule in the skill the spawned worker is running

**Source**: `ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified** (2026-08-02)
**Sprint/Tag**: Sprint 2 · task `0158` · owner `fkit-architect`

## Goal
Rule on a **precedence hole**: skill rules were classified as neither universal hard rule nor output-style preference, so nothing said what happens when a spawn prompt contradicts one. Investigation and ruling only — *"do not write an implementation brief for it until this is answered."*

## Key Changes
**One new file: [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]]** (`accepted`). No skill, agent definition, source file or test was edited — **the ADR rules and implements nothing**, and both of its clauses were left as named follow-ups (`0190` worker-side, `0191` driver-side). Neither has landed.

**What the ruling generalizes.** `claude/agents/fkit-coder.md`'s **declared-approval marker** already decided this axis once — for one skill and one role. ADR-037 lifts it to **every spawned worker of every role**, and per owner ruling Q2 **binds the driver as well as the worker**.

**Two owner rulings, both taken live during the run** (`AskUserQuestion`, 2026-08-02):
- **Q1 — does the exception apply to every skill rule, or should some be undisplaceable?** → *"Every skill rule, uniformly."* **No new undisplaceable tier.**
- **Q2 — bind only the worker, or the driver too?** → *"Bind both."*

## Outcome

**The investigation corrected its own brief in four places, and the ADR records each.** The brief cited the sprint-plan addendum at `:245-249` where it now sits at `:1069-1073` (`:245-249` is an unrelated displacement table) — the exact failure [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] ruled on. Its verbatim quote **silently dropped** *"It is open to an owner override"* behind an ellipsis, which is materially weaker than the reading the brief drew from it. It named `claude/universal-rules.md`, a path that does not exist. And it missed that the rules block's `## Output style` preamble is already a **three**-tier ladder whose *"your role's instructions win"* is the nearest existing hook.

⚠️ **The *"direct your work"* tension was defused rather than fought.** The phrase is **harness-injected preamble fkit cannot edit** — and its second half already says an agent message is never the owner's consent. That is the *same* distinction ADR-037 draws, which is what independently rules out *"the skill rule always wins, full stop"* as a **wording**: a worker holding both would face a live contradiction with no tiebreak.

⚠️ **The counterfactual sentence shipped wrong in the first draft, and the ADR says so.** The draft — *"follow the skill rule and say so in your return, unless…"* — followed literally by a worker with no other context **re-points the frozen ledger of instance B**, the outcome the ADR exists to reject. The escape it lacked is the conservative branch plus escalation. Caught in review; the corrected sentence measures **313 B**, and **neither version fits today's rules-block headroom**, so `0190` must compress it *without dropping the escape* — the part a compressor reaches for first.

⚠️ **The budget arithmetic was itself corrected in review round 1.** The first draft computed the test gate without its `Math.round`, published **3768 B / 198 B**, and concluded the longest candidate wording "fails the test outright". **False, and withdrawn in the ADR's own text.** The real gate is **3789 B / 218 B**; the binding ceiling was always the owner's standing ≥ 400 B-free target (**126 B**), so the budget call never changed.

### Two ledger defects this task left behind — both open, both owner-gated
The Process-review step of this run was routed to `@fkit-architect`; `/fkit-process-stateful-review` is **coder-owned** and the [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] hook denies it to that identity. This task's ledger carries two record defects as a result:
- **`Status: in-review`** was never flipped to `closed-out`, though the ledger's own table records all five findings dispositioned. **A later reader opens it and sees live work.**
- **Its two accepted residuals carry no per-entry re-raise trigger** — only a blanket preamble — where the skill's step 6 mandates a *Re-raise-only-if* per entry.

Task **`0201`** owns the repair and is **gated on explicit owner authorization**, because both folders are already under `tasks/done/`. Task **`0200`** owns the routing question itself.

## Related
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the ADR this task produced
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162`, the sibling ruling that **narrows ADR-037 §5**
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` / ADR-035, which forbids instance A on a **separate** axis
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, the citation form this task both followed and violated
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] · [[tasks/track-fkit-coder-declared-approval-carve-out]] — the marker ADR-037 generalizes
- [[tasks/reclaim-rules-block-budget-headroom]] — task `0130`, the ≥ 400 B-free target that gates `0190`
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that denied the Process-review routing
- [[tasks/sprint-2-remove-omnigent]] · [[systems/role-locked-sessions]] · [[systems/fkit]]
- [[tasks/add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block]] — task `0190`, ADR-037's **worker-side** clause, shipped 2026-08-04 on an owner-signed budget bump
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] — task `0191`, ADR-037's **driver-side** clause — the one that would have stopped **instance A** at the driver rather than at the worker. ⚠️ **It reaches no driver yet**
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, which decides the **invocation** axis ADR-037 §Context explicitly disclaims — and one of the two closed ledgers this task left audited-but-unrepaired
