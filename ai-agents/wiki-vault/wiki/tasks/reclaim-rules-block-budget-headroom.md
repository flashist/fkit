# Reclaim universal-rules-block budget headroom

**Source**: `ai-agents/tasks/done/0130-reclaim-rules-block-budget-headroom/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-01
**Sprint/Tag**: Sprint 2 · ID 0130 · owner fkit-coder

## Goal
The fkit-managed **rules block** — `claude/scaffold/universal-rules.md`, wrapped by `emit_block()` and re-injected into every consuming project's `CLAUDE.md` and `AGENTS.md` on **every launch** — had reached **91.1% of the `RULES_MAX=4096` byte cap** after task `0128` landed the ADR-030 prose half. Two gates bind it: `fkit-claude-init.sh` **aborts a launch** above the cap, and `test/rules-block-budget.test.js` trips a warning at 92%. The block was one edit from the gate, so the **next** cross-cutting rule likely would not fit.

The task was deliberately **two-phase**: measure and propose, then implement **whichever option the owner signed**. **A `RULES_MAX` bump was never the coder's call** — the cap exists precisely because the block lands in every agent's context on every turn, so raising it trades that context cost for headroom, and that trade is the owner's.

## Key Changes
**The owner signed option (a), tier a3 — a compression pass. No `RULES_MAX` bump; the cap stays 4096.**

- Emitted block **3717 B → 3570 B** (net **−147 B**) = 3166 B source + 404 B wrapper.
- **526 B headroom**, meeting the owner's newly-set **≥400 B standing target** with 126 B spare.
- **87% of cap**, **219 B** clear of the 92% warning gate (which trips at 3789 B).

**Owner rulings recorded 2026-08-01, as code comments — no ADR:** option (a)/tier a3; the ≥400 B standing headroom target; the cap **keeps measuring the emitted block**, unchanged; and the cap's rationale in writing — **discipline primary** (ADR-016's eviction conversation), with attention dilution **suspected but unmeasured and flagged as such**.

Re-injection was proven by extracting the block from `CLAUDE.md` and `AGENTS.md` and `cmp`-ing it byte-identical against live `emit_block()` output — **not** by the markers-only test.

## Outcome
`node --test test/*.test.js` → **523 pass / 0 fail**; `bash test/prove-red.sh` → hard gate **PASSED**. Stateful review, verdict *changes requested — 3 defects, none blocking*; **Codex coverage FULL, not degraded** (`codex-cli 0.145.0`), with two independent reviewers converging on the same three findings. R1 and R3 fixed, R2 fixed in part.

⚠️ **Accepted residual — owner-dispositioned, do not re-litigate.** The coder **refused** the second half of finding R2 (renumbering a passage in `test/rules-block-budget.test.js` to the new figures) on the evidence that the passage is a **dated account of a past 107 B bug whose arithmetic only closes at the old values**. **The owner accepted the refusal** — the same principle the vault applies to its own frozen history.

⚠️ **Carried-forward residual:** the **codex half of the HTML-comment-stripping canary is still unverified** — filed as task `0177`.

**The precedent that justified filing it at all** is task 79 / `0022`, which reclaimed room specifically so `0128` could land: *this kind of budget work gets forgotten unless it is filed.* And its inherited rule survived the pass — **a cut that saves bytes by dropping a qualifier is a regression, not a compression**; every ADR-030 clause (*never invent a next step*, *never assert unchecked repo state*) is still present.

⚠️ **The headroom this reclaimed is already spoken for.** [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] re-measured the block at 3570 B on 2026-08-02 and used the **126 B of usable growth** as one of the two grounds for rejecting ADR-036's generate-the-prose option.

## Related
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the hook whose prose half (`0128`) consumed the headroom
- [[tasks/add-adr-030-prose-half-to-universal-rules]] — task `0128`, which brought the block to 91.1% and flagged this as its follow-up; **not a defect in it**
- [[tasks/compress-universal-rules-output-style-section]] — task 79 / `0022`, the precedent and the source of the *"dropping a qualifier is a regression"* rule
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the eviction conversation the cap's *discipline primary* rationale cites
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] — task `0142`, which re-measured this block and spent its headroom argument
- [[systems/testing-and-verification]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
