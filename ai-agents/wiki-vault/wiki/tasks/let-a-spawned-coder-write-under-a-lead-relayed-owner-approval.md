# Let a spawned coder write under a lead-relayed owner approval (one approval marker for both drivers)

**Source**: `ai-agents/tasks/done/0475-let-a-spawned-coder-write-under-a-lead-relayed-owner-approval/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P8` · task `0475` · owner `fkit-coder`

## Goal
Owner ruling 2026-10-02 — question: *"This 'spawned coder may not write code unless the sprint loop sent it'
rule has blocked or bent 6 times this week when I drive. Fix the rule?"*; answer: *"File a task to fix it —
… let a spawned coder write when the lead relays an explicit owner approval (ADR-031's conductor path),
matching how the sprint loop does it. Starts on your word."*

**The defect:** the coder prompt let a spawned coder write only under the sprint loop's marker; on ADR-031's
general conductor path it fell back on CLAUDE.md's *"names an owner ruling"* clause, so ⛔ **the same owner
approval was honoured or refused depending on how the spawn prompt happened to be worded.** Six incidents
2026-09-23 → 10-02 (`0412` ×3, `0415` ×2, a commit job), and one outright refusal of a small README-adjacent fix.
The safety intent had to stay: **no silent self-authorisation.**

## Key Changes
- **Decision first, via the architect:** a new small ADR that ADR-031 and ADR-032 point to —
  [[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]]. Owner
  rulings 2026-10-05 on the plan's open questions: what counts as a quote → *"Exact words + date + channel
  (Recommended)"*; commit jobs → *"No — file a follow-up (Recommended)"* (filed as `0497`, open); the sprint
  loop unchanged and satisfying by mapping, lead-path Process-review needs a task folder, the `plan:` pointer
  required whenever `plan.md` exists, coder only → *"Yes, all four (Recommended)"*.
- **`claude/agents/fkit-coder.md`** rewritten as **one rule, two drivers**, four fields (caller; plan verbatim or
  exact scope; owner approval — quoted with date and channel on the lead path; worker role Build /
  Process-review), and a refusal list; a defective marker returns `NEEDS-DECISION` **naming the failed field**.
  ⚠️ The brief said a defective marker "refuses and returns the plan"; the approved plan and ADR-055 Decision 4
  say `NEEDS-DECISION` — the built text follows the plan.
- **`claude/agents/fkit-lead.md`** carries the marker when spawning a writing coder; plan-only otherwise. The
  sprint loop's description points at the shared shape — **no behaviour change**. Rules block untouched.
- **`test/spawned-write-marker.test.js`** pins the text (both drivers, every field, the refusal list) — words
  on disk, not obedience.

## Outcome
- **Dry run (verification 7), run by the driver on 2026-10-06** with the refreshed files live, relayed to the
  Process-review worker (not re-observed by it): a plan-only spawn wrote nothing; a lead spawn with a
  **paraphrased** approval returned `NEEDS-DECISION` naming field (c); a correctly marked lead spawn (a real
  owner-approved test change, quoted with date and channel) wrote a 13-byte scratch file outside the repo.
  ⚠️ **Three single samples show prompt obedience; they are not a guarantee** — trust, not proof.
- Review rounds tightened the test (field (a) checked on its own; header wording).

## Related
- [[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]] — the decision
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the two drivers' ADRs, each with a pointer note
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the fallback this makes unnecessary on this path
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — `0150`, the earlier verbatim-plan tightening
- [[tasks/make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself]] — `0498`, whose read-only diagnosis spawn carries no marker
- [[tasks/sprint-10-the-0472-0482-batch]] — `P8`
- [[systems/role-locked-sessions]]
