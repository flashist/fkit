# Give every agent direct wiki `query` access

**Source**: `ai-agents/tasks/done/0048-give-every-agent-direct-wiki-query-access/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 1 → closed as Done during Sprint 2 disposition

## Goal
Let every role read the wiki **in-process** via its own `query` skill, instead of spawning a fresh `fkit-wiki` sub-agent session for every lookup.

## Key Changes
Originally the owner's idea #1 in the 2026-07-10 panel-noise discussion. Wiki lookups via consult spawn were **the single biggest source of ad hoc consult children**.

**This reversed a stated, checked-in project rule**, not just an operational habit: root `CLAUDE.md` said *"All wiki reads and writes go through the fkit-wiki agent… no other agent edits the wiki directly."* **That is why it required an ADR rather than a patch** — it produced [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]].

**The settled rule: reads decentralized, writes exclusive.** Any role may run the **read-only** `/fkit-query` procedure; **`fkit-wiki` remains the sole write gateway.**

## Outcome
**Closed as Done during the Sprint 1 disposition — it was already complete in code**, verified by the doc-drift audit, and so was *closed as Done rather than cancelled* even though its Omnigent-era vendoring mechanism had died.

**The rule survived the runtime that carried it.** On Claude Code there is **one** `/fkit-query` skill and **no vendoring at all** — the distribution problem that consumed ADR-006 and ADR-007 simply evaporated. **ADR-005's mechanism is superseded; its rule is current law.**

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[decisions/adr-006-symlink-vendored-query-skill-not-copy]]
- [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]]
- [[systems/fkit]]
