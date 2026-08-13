# Retire the `sprint-*.md` glob in `fkit-status/SKILL.md` — select by resolved identity

**Source**: `ai-agents/tasks/done/0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P6 (append rank `P13`, promoted 2026-08-11) · task `0266` · owner `fkit-coder`

## Goal

ADR-041 §6 **prose sites 1 and 2** — the selection rule itself, and its explanatory block. After
ADR-041 both are **false as written, not merely stale.**

## Key Changes

⚠️ **Site 2's CONCLUSION survives; its mechanism does not.** `backlog.md` stays out of the default
run, and ADR-041 §3 makes that exclusion **stronger** — *"the identity is `Backlog`"* rather than
*"the filename is outside the glob"*. **So: rewrite the reason, keep the rule.**

⚠️ **The binding constraint, ADR-041 §5:** the selection step **obtains each candidate's identity FROM
`dashboard.sh`** via `0265`'s interface and **MUST NOT restate the token grammar, the delimiters, the
suffix bound, or the filename allowlist.** *Two grammars for one question is the defect
`dashboard.sh`'s own file documents at length.*

The brief also instructed: **report any eighth glob site §6 missed rather than silently editing it.**

⛔ No `dashboard.sh` edit. ⛔ No edit to the other five §6 sites (that is `0267`). ⛔ **No glob
reintroduced as a fallback.** ⛔ No `backlog.md` rename.

## Outcome

**Landed and verified on disk 2026-08-13.** `claude/skills/fkit-status/SKILL.md` now instructs the
model to run `dashboard.sh select-active`, states in the same breath that the script *"considers every
`.md` **directly** in `ai-agents/sprints/` — **no pattern on the filename**"*, and adds an explicit
**"Do not re-derive any of that here"** citing ADR-041 §5 by name.

It documents the four record shapes the script emits and how to read each — including that
**`active none` exits 3, and that is an answer, not a failure**, and that a `Backlog` identity and an
`unresolved` identity are **never eligible**, with **"Never fall back to the `Backlog` board. Do not
guess."** written into the prose.

⚠️ Closed `(agent-closed — not owner-verified)`.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — §6 sites 1–2, and §5's one-grammar constraint
- [[tasks/implement-adr-041s-dashboard-half]] — the interface this consumes; the dependency
- [[tasks/correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism]] — sites 3–7
- [[tasks/remove-output-variants-from-fkit-status]] — the one-skill-one-output convention ADR-041 §5 explicitly does not reopen
- [[systems/fkit]]
- [[tasks/decide-whether-the-active-sprint-glob-widens]] — `0261`, the decision this implements
