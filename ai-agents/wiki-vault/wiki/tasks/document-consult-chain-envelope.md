# Document the consult-chain envelope

**Source**: `ai-agents/tasks/cancelled/0033-document-consult-chain-envelope/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 1 — cancelled 2026-07-11

## Goal
Write down what the agent consult chain *actually* guarantees — which depths and modes are verified, and which are not.

## Key Changes
The architect's initiation survey flagged **deep multi-hop consultation under fully headless (`-p`) runs** as an unverified reliability risk, framed as a possible **blocker** for the "user-friendly startup sequence" goal.

**The owner corrected that framing, and the correction is the durable part:**

- **Onboarding is interactive**, not headless — `-p` only *seeds the first message*; the session stays live for the owner to answer questions.
- **Initiation only uses one-hop consults** (producer→architect, producer→wiki), which are **verified working**.
- The **unverified** case is deep multi-hop under a fully headless run — relevant to **CI/automation, not onboarding**. A separate, lower-priority concern; **not a blocker for the startup sequence.**

## Outcome
**⛔ Cancelled (2026-07-11) — Omnigent removed.** The spawn+inbox envelope it would have documented **died with Omnigent**, and **the Claude two-hop consult envelope is now recorded in [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]** instead.

**The rules did survive, in the agent prompts:** hop 0 is the owner's session; every consult states *"you are being consulted at hop N of 2"*; **at hop 2 you may not consult anyone**; never consult your invoker or anyone already in the chain; **genuinely new architecture decisions escalate to the owner.**

⚠️ **The envelope remains prompt-enforced, knowingly** — Claude Code ignores `Agent(type)` allowlists inside subagent definitions, so **the hop budget cannot be made structural.**

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/role-locked-sessions]]
