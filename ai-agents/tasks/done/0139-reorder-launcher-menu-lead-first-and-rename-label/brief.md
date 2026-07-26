# Reorder the `fkit` launcher menu so lead is option 1, and rename its label to "lead"

## ID
0139

## Sprint
Sprint 2

## Priority
115

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

The `fkit` menu today lists lead **last**, as option 7, under the label **"team room"**:

```
 1) producer     product & sprint planning, task briefs
 …
 7) team room    route to a role, or have it drive the work for you
```

Two problems the owner raised (2026-07-25):

1. **Lead is buried.** Since [ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
   the lead is the *orchestrating front door* — the role that routes you to the right agent, and the one
   that drives a whole sprint via `/fkit-sprint-ship-loop`. It is the natural first stop for someone who
   does not yet know which role they need, and it is listed last.
2. **"team room" is not the role's name.** `lead` is the canonical name everywhere that matters —
   `--help` (`claude/fkit-claude.sh:165`), the case arms (`:472`), `skills_for_role()`
   (`claude/skills-for-role.sh:50`), the agent file (`claude/agents/fkit-lead.md`), and the test suite
   (`test/launcher-contract.test.js:29`, `test/skill-ownership-hook.test.js:139`, which assert roles by
   **name**, never by menu number). "team room" is a *label* that appears only in prose.

**Owner ruling, 2026-07-25: retire "team room" project-wide**, not just in the menu. This brief is the
**launcher half**; the prose sweep is 0140 and the wiki half is 0141.

**No ADR-027 dual-home surface.** Neither `claude/fkit-claude.sh` nor `claude/fkit-claude-init.sh` is an
`ai-agents/` ↔ `claude/scaffold/ai-agents/` parity pair, so the
[dual-home-parity](../../../knowledge-base/conventions/dual-home-parity.md) rule does not apply here.
Checked at scoping time, per ADR-027 §Decision 1.

## What to build

**1. The menu block — `claude/fkit-claude.sh:452-460`.** Renumber so lead is first:

```
 1) lead         route to a role, or have it drive the work for you
 2) producer     product & sprint planning, task briefs
 3) coder        implementation — the only role that writes source
 4) architect    design specs, ADRs, feasibility
 5) reviewer     code review (own pass + Codex second opinion)
 6) adversarial  hostile pass, findings only
 7) wiki         the wiki — ingest / lint / sync
```

Keep the existing column alignment. The lead row's label becomes **`lead`**; its description text may
stay as-is or be lightly reworded, but must not reintroduce "team room".

**2. The case arms — `claude/fkit-claude.sh:466-472`.** Renumber to match. **Keep every existing word
alias**, including the ones being retired from the *display*:

- `1|lead|team|"team room")` → `role="lead"` — the `team` and `"team room"` aliases stay, so anyone who
  learned the old word still lands correctly.
- `2|producer)`, `3|coder)`, `4|architect)`, `5|adv|adversarial)`, `6|reviewer)`, `7|wiki)` — preserving
  each role's existing word aliases exactly.

The prompt at `:463` and the error at `:475` still read `1-7` — the range is unchanged, so neither
string needs editing. **Verify that rather than assuming it.**

**3. The `--help` role list — `claude/fkit-claude.sh:159-166`.** Move the `lead` line to the top of the
`Roles:` block and reword its description to drop "team room" (e.g. `lead  the conductor — routes you to
a role, or drives the team for you`).

**4. The init.sh printed role list — `claude/fkit-claude-init.sh:856-863`.** Same: move `• lead` to the
top of the list and drop "team room" from its description. Note the comment immediately above that block
already warns these two lists can drift and nothing tests that they agree — this task touches both, so
keep them consistent.

**Do not** touch `claude/agents/fkit-lead.md`, the README files, `CLAUDE.md`, `AGENTS.md`,
`architecture.md`, or `fkit-team/SKILL.md` — those are 0140. **Do not** touch `ai-agents/wiki-vault/` —
that is 0141, and it is wiki-role-only.

## Verification steps

1. `npm test` is green — **521 tests + the `prove-red.sh` hard gate**, the counts measured on this
   codebase 2026-07-25. The launcher-contract and skill-ownership suites assert roles by **name**, so
   they should need no change. **If a test does require editing, stop and report it as a finding** — a
   test that breaks on a menu renumber means the numbers are pinned somewhere this brief did not
   find, which is information the owner needs.
2. Run `fkit` with no arguments in a terminal: the menu renders with `1) lead` first, `7) wiki` last,
   and **no occurrence of the string "team room"**.
3. Every pick still resolves to the right role. Check at minimum: `1` → lead, `2` → producer, `7` → wiki,
   and the word aliases `lead`, `team`, `team room`, `producer`, `wiki`.
4. `fkit lead` and `fkit team` (the explicit-role path, which skips the menu entirely) both still open a
   lead session.
5. `fkit --help` lists `lead` first under `Roles:` with no "team room" text.
6. An invalid pick (e.g. `9`) still prints the `is not one of 1-7` error.

## Notes

- **Depends on:** nothing.
- **Blocks:** 0141.
- **Owner:** fkit-coder — a shell-source edit.
- **Edit the canonical sources in `claude/` only.** `.claude/` is a gitignored copy refreshed by
  `claude/fkit-claude-init.sh .`; editing it directly is lost work.
- **⚠️ Accepted cost, stated plainly: renumbering moves every other role down one.** Producer goes
  1→2, coder 2→3, architect 3→4, reviewer 4→5, adversarial 5→6, wiki 6→7. Anyone with muscle memory
  will pick the wrong role for a while, and **the mis-pick is silent** — you land in a working session
  of the wrong role rather than getting an error. The word-alias path (`fkit coder`) is unaffected, and
  is the mitigation worth mentioning to users. The owner accepted this cost when ruling on 2026-07-25.
- **The menu number appears in prose in several files and becomes false the moment this lands.** Those
  citations are 0140's scope, deliberately — but that means **0139 landing alone leaves the docs
  briefly wrong**. Ship 0140 in the same session where practical.
- No commit — leave the edits in the working tree.
