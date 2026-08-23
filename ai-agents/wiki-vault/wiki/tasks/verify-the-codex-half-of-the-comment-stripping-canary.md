# Verify the codex half of the HTML-comment-stripping canary

**Source**: `ai-agents/tasks/done/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P4` · ID 0177 · owner `fkit-coder` · shipped 2026-08-16

## Goal

The fkit-managed rules block is wrapped in HTML comments plus markers, costing **404 B** of the `RULES_MAX` cap. Whether that 404 B also costs *agent context* was **half answered**: Claude Code strips HTML comments from `CLAUDE.md` (measured firsthand in `0130`), but whether **codex** strips them from `AGENTS.md` was **second-hand from a consult and had never been run**. Two rationale comments in the tree carried an explicit hedge and assumed the conservative default. Measure it, then correct or confirm both hedges.

## Key Changes

### ⭐ The measured finding

**`codex-cli 0.145.0` does NOT strip HTML comments from `AGENTS.md`.** The fkit marker lines and the `fkit-managed:` wrapper comment reach the model **verbatim** inside the `AGENTS.md` payload. This is the brief's outcome **#2 — the conservative assumption was right, and it is no longer an assumption.**

**Consequence for the budget:** the wrapper is **free on the Claude side** and **paid in full on the codex side**. Both are harness-specific ([[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]) and expire when either build moves; both comment sites now say so.

| harness | version | measured |
|---|---|---|
| codex | `codex-cli 0.145.0` | **2026-08-16, this task, firsthand** |
| Claude Code | `2.1.220` | 2026-08-01, task `0130` — ⚠️ **restated, not re-run here** |

**Not inconclusive:** two independent lines agreed — a behavioral canary through the real `codex exec` path (3/3 identical reps) and direct observation via `codex debug prompt-input` — and every control held. The `cat AGENTS.md` confound was actively excluded and nested-`AGENTS.md` leakage was checked and found absent.

### Byte table — measured before AND after, with the repo's own extractor

Measured by extracting `emittedBlockSize()` **out of `test/rules-block-budget.test.js` programmatically at runtime**, never hand-transcribed — *hand-transcribing that extractor is the documented way to get this wrong.*

| quantity | before | after | plan claimed | verdict |
|---|---|---|---|---|
| emitted block | **3837 B** | **3837 B** | 3840 B | plan wrong, its dated correction right |
| `RULES_MAX` | 4352 | 4352 | 4352 | agreed |
| free headroom | **515 B** | **515 B** | 512 B | plan wrong |
| wrapper (markers + comment) | **404 B** | **404 B** | 407 B | plan wrong |
| utilization | 88 % | 88 % | 88 % | agreed |

**≥400 B standing headroom target (owner ruling, `0130`): MET at 515 B**, clearing by 115 B. The emitted block is **byte-identical** before and after (`cmp` exits 0) — the edits are comment-only and sit *outside* `emit_block()`.

### ⚠️ The standing trap it did not walk into

A finding that *"the wrapper costs no agent context"* must **not** become an argument for capping the **source** file instead of the **emitted** block — the coder flagged that in `0130` as *"a 493 B cap loosening wearing a correctness costume"*, and the owner ruled 2026-08-01 that the cap keeps measuring the **emitted** block. ✅ **The work product contains no change to what the cap measures and no such recommendation folded in.**

## Outcome

**Shipped 2026-08-16**, agent-closed. Two files changed, **comments only** — `claude/fkit-claude-init.sh` (the `RULES_MAX` site) and `test/rules-block-budget.test.js` (header). Two review rounds.

**Residuals — all standing:**

- **`codex debug prompt-input` is a debug renderer.** That it shares the assembly path with `codex exec` is an **inference**, mitigated by the independent behavioral canary, not eliminated.
- **The Claude-side figure is carried forward, not re-measured here.**
- **`n = 3` behavioral reps**, one model, one day — consistent, not exhaustive. ⚠️ **The 3/3 replication is attested, not auditable**: reps 2 and 3 have no retained transcript and no hash.
- ⛔ **`canary.sh` is covered by NO test suite at all.** It lives in the task folder by owner ruling, so `npm test` exercises **none** of the review hardening — **a green suite is not evidence about this script.** Its only evidence is a 13-case isolated table in the review ledger.
- **`canary.sh`'s rep admissibility is still fail-open** (a rep that failed to run reports "admissible") and **its transcript extractor is not JSON-safe** — true of the recorded answers, not guaranteed of a re-run's.
- **The repo-identity check is a marker-file check, not a proof of provenance** — the threat model is an honest mistake, not an adversary. **The guard was verified by transplant, never end-to-end** (running it costs live billed `codex exec` calls).

## Related
- [[tasks/repair-0177s-stale-cap-and-byte-figures]] — `0218`, without which this brief was unworkable as written
- [[tasks/reclaim-rules-block-budget-headroom]] — `0130`, which measured the Claude half and left this one open as a residual
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the harness-version discipline that makes both findings expire
- [[tasks/give-codex-the-universal-hard-rules]] — why `AGENTS.md` carries the block at all
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — `P4`
- [[systems/testing-and-verification]] · [[systems/review-and-model-diversity]]
- [[systems/fkit]] — the team, and Codex's required place in it
