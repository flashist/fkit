# Remove eager auto-spawn of fkit-adversarial-reviewer at session start

## ID
0071

## Sprint
Sprint 1

## Priority
5

## Status
⛔ Cancelled (2026-07-11) — Omnigent removed: `fkit-team` (and its eager bootstrap roster) is deleted with Omnigent (ADR-009).

## Context

The adversarial-reviewer agent currently appears as a standalone session in the Omnigent UI's
Subagents ("right-bar") panel the moment a `fkit team` session starts — before any review has run.
The owner flagged this as noise: `fkit-adversarial-reviewer` was never meant to be usable as a
standalone teammate, only as a sidekick that `fkit-reviewer` spawns on demand mid-review.

Root cause (confirmed against the actual configs, not assumption): this is **not** the
reviewer→adversarial-reviewer on-demand call (that's Step 1B in `fkit-reviewer/skills/review/SKILL.md`
and `stateful-review/SKILL.md` — a runtime `sys_session_create` mid-review, and must be left exactly
as-is). It's a **separate, unrelated code path**: `omnigent/fkit-team/config.yaml`'s "First-turn
standby bootstrap" prompt section treats `adversarial-reviewer` as one of its six standing roster
members and eagerly `sys_session_create`s all six the instant the team session starts. That's the
session the owner is seeing appear unprompted.

This is a scoped implementation-bug fix against already-stated intent (adversarial-reviewer is
explicitly documented elsewhere as sidekick-only), not a reversal of any settled architecture
decision — the dual-review behavior itself (Step 1B, unconditional mid-review) is untouched and out
of scope here. No ADR needed; owner has settled this (2026-07-10).

## What to build

Edit **`omnigent/fkit-team/config.yaml`** only (canonical source; `.fkit/agents/fkit-team/` is a
vendored copy — do not hand-edit it directly, it'll drift):

1. Drop `adversarial-reviewer` from the roster in two places:
   - The top-level `description:` field's parenthetical list of agents.
   - The "First-turn standby bootstrap" prompt section's "Your six teammates" list and the
     `sys_session_create` loop it drives.
2. Adjust the counting language in that same prompt block that assumes six teammates throughout:
   "the six fkit agents" → "the five fkit agents," "For EACH of the six teammates" → "five," "if all
   six are already present" → "five," "never create a teammate under any title other than the six
   role names above" → the five remaining names. Wording only — same bootstrap mechanism, one fewer
   roster entry.
3. Leave `guardrails.policies.spawn_bounds.max_dispatches_per_turn: 7` as-is — it's headroom, not a
   correctness dependency; no need to tighten it.
4. Re-vendor after the edit: run `omnigent/vendor-agents.sh` so `.fkit/agents/fkit-team/config.yaml`
   picks up the change (or confirm the next `fkit-init.sh` pass will).

**Do not touch:** `fkit-reviewer/config.yaml`, `fkit-reviewer/skills/review/SKILL.md`,
`fkit-reviewer/skills/stateful-review/SKILL.md`, or `fkit-adversarial-reviewer/config.yaml`. The
on-demand spawn inside an actual review run (Step 1B) is out of scope and must keep working exactly
as today — once spawned that way it will still (correctly) show up in the Subagents panel, just at
review time under a topic-specific title, not as a standing named teammate at session start.

`fkit-adversarial-reviewer/config.yaml`'s own header comment about running it directly
(`omnigent run omnigent/fkit-adversarial-reviewer`) is a separate, deliberate manual invocation path
— unaffected by this fix, leave as-is.

## Verification steps

- Start a fresh `fkit team` session (or equivalent bootstrap trigger); confirm only five teammates
  (producer, coder, reviewer, architect, wiki) appear in the Subagents panel after the first-turn
  bootstrap, not six.
- Trigger an actual `fkit-reviewer` review (`review` or `stateful-review` skill) on a diff; confirm
  the adversarial-reviewer sidekick still gets spawned mid-review exactly as before (Step 1B
  unaffected) and its findings still come back and get used.
- `grep -c "adversarial-reviewer" omnigent/fkit-team/config.yaml` — confirm no leftover roster
  references (description parenthetical and bootstrap list both updated).
- `diff -q omnigent/fkit-team/config.yaml .fkit/agents/fkit-team/config.yaml` after re-vendoring —
  confirm they're back in sync.

## Notes

- Natural owner: **fkit-coder** — this is a source-write change to a canonical bundle config
  (`omnigent/fkit-team/config.yaml`) plus a re-vendor step; stays with the coder's sole source-write
  authority even though fkit-architect did the root-cause investigation.
- Small, mechanical change (remove one roster entry + matching count wording) — should not need more
  than this sprint slot.
