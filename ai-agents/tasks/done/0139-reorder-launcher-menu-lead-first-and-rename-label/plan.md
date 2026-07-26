# Plan — 0139 Reorder the `fkit` launcher menu so lead is option 1, and rename its label to "lead"

- **Task-id:** `0139-reorder-launcher-menu-lead-first-and-rename-label`
- **Approved:** 2026-07-25, owner, via `/fkit-task-ship-loop` plan gate
- **Scope boundary:** this file. Anything outside it stops for the owner.

## Files in scope

- `claude/fkit-claude.sh` (canonical launcher)
- `claude/fkit-claude-init.sh` (canonical installer)

`.claude/` is a gitignored copy refreshed on launch — never edited. No ADR-027 dual-home pair here
(checked at scoping time, brief §Context).

## The change

### 1. Menu block — `fkit-claude.sh:453-459`

Renumber so lead is first; keep the 13-character label column:

```
   1) lead         route to a role, or have it drive the work for you
   2) producer     product & sprint planning, task briefs
   3) coder        implementation — the only role that writes source
   4) architect    design specs, ADRs, feasibility
   5) reviewer     code review (own pass + Codex second opinion)
   6) adversarial  hostile pass, findings only
   7) wiki         the wiki — ingest / lint / sync
```

### 2. Case arms — `fkit-claude.sh:467-472`

Renumber to match the menu. **Every existing word alias is kept verbatim**, including the retired
display words `team` / `team room`:

```sh
      1|lead|team|"team room") role="lead" ;;
      2|producer)            role="producer" ;;
      3|coder)               role="coder" ;;
      4|architect)           role="architect" ;;
      5|reviewer)            role="reviewer" ;;
      6|adv|adversarial)     role="adversarial-reviewer" ;;
      7|wiki)                role="wiki" ;;
```

> ⚠️ **Resolved brief contradiction, recorded because it changed what gets built.** The brief's
> "What to build" §2 lists `5|adv|adversarial)` and `6|reviewer)`, but its own §1 menu block lists
> `5) reviewer` and `6) adversarial`. Following §2 literally would make pick `5` open the adversarial
> reviewer while the menu row says reviewer. **The menu block wins** — it is also what "preserve the
> existing order" yields (today's `4|reviewer`, `5|adv|adversarial`, each shifted +1). Surfaced to the
> owner at the plan gate and approved.

### 3. `--help` Roles block — `fkit-claude.sh:159-166`

Move the `lead` line to the top of `Roles:`; reword to drop "team room":

```
  lead         the conductor — routes you to a role, or drives the team for you
```

### 4. init.sh printed role list — `fkit-claude-init.sh:857-863`

Move `• lead` to the top; drop "team room":

```
    • lead         the conductor — who to ask, and routing
```

The comment above that block warns the two lists (printed vs accepted) can drift and nothing tests
that they agree. This task touches both — keep them in step.

### 5. The three extra "team room" strings — **owner-approved additions at the plan gate**

Beyond the brief's four build items, the owner ruled these in (answer: "banner + both comments"):

- `fkit-claude.sh:486` — the banner printed when a lead session opens (`→ team room. It routes …`).
  User-visible launcher output.
- `fkit-claude.sh:444` — comment, "falls through to the team-room default".
- `fkit-claude.sh:481` — comment, "the team room is the safe default".

Target state: **zero occurrences of "team room" / "team-room" in either launcher file**, except the
`"team room"` **word alias** in the case arm, which is deliberately retained.

### 6. Verified, not edited

- `fkit-claude.sh:463` — prompt `role [1-7, q to quit]`.
- `fkit-claude.sh:475` — error `? "%s" is not one of 1-7.`

The range is unchanged, so neither string needs editing. **Confirm this rather than assume it.**

## Out of scope — do not touch

`claude/agents/fkit-lead.md`, README files, `CLAUDE.md`, `AGENTS.md`, `architecture.md`,
`claude/skills/fkit-team/SKILL.md` — all 0140. `ai-agents/wiki-vault/` — 0141, wiki-role-only.

## Verification

1. `npm test` — expect **521 tests green + the `prove-red.sh` hard gate**. The launcher-contract and
   skill-ownership suites assert roles by **name**, so they should need no change. **If any test
   requires editing, STOP and report it as a finding** (brief step 1) — it would mean the menu numbers
   are pinned somewhere the brief did not find.
2. Menu render and picks: stub `claude` on `PATH`, drive the launcher under a pty
   (`script -q /dev/null`), feed `1`, `2`, `7`, `9`, and the words `lead`, `team`, `team room`,
   `producer`, `wiki`; assert the role each resolves to. **If the pty drive does not work in this
   environment, say so plainly and fall back to a static read of the case arms — never claim a check
   that was not run.**
3. Explicit-role path (menu skipped): `fkit lead` opens a lead session.

   > **Amended 2026-07-25, after the fact, and flagged as such.** As written this step said
   > *"`fkit lead` and `fkit team` both open a lead session"*, copying the brief's step 4. **That was
   > never true and is not true now.** `fkit team` errors (`fkit: "team" is not a role.`) — it did at
   > HEAD, an alias added mid-run made it work, and the owner **reverted that alias** after review
   > finding R1. `team` / `team room` are menu-pick aliases only. The brief's step 4 still asserts the
   > old claim and is **deliberately left untouched** — a brief's acceptance criteria are the
   > producer's, not the author's-of-the-failing-change (owner ruling, same date).
4. `fkit --help` — `lead` first under `Roles:`, no "team room".
5. Invalid pick `9` → `is not one of 1-7`.
6. `grep -n "team room\|team-room" claude/fkit-claude.sh claude/fkit-claude-init.sh` — the only
   survivor may be the `"team room"` case-arm alias.

## Accepted cost (owner-accepted 2026-07-25, restated)

Renumbering shifts every other role down one (producer 1→2 … wiki 6→7). Muscle memory will mis-pick,
and **the mis-pick is silent** — you land in a working session of the wrong role rather than getting an
error. The word-alias path (`fkit coder`) is unaffected and is the mitigation to tell users about.

## Commit

None. Every edit stays in the working tree; the owner commits.
