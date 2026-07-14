# Add the "no secrets" rule to `fkit-lead.md` — the one agent file missing it

## Sprint
Sprint 2

## Priority
32

## Status
🔲 Backlog

## Context

Six of the seven agent files carry a "no secrets / no sensitive information" rule. **Exactly one does
not: `claude/agents/fkit-lead.md`.** Verified in
[`reports/2026-07-14-shared-instructions-layer.md`](../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
§1 — the third and final count, after two earlier greps published wrong numbers by matching one phrasing
of a semantic rule.

`fkit-lead.md:65-68` has a **`## Hard rules`** section with two entries — never commit, never write the
wiki — and no third.

**Do not oversell this.** The report is explicit: a rule present in **6 of 7** files is a copy-paste
hygiene problem, not a systemic drift crisis, and it **materially weakens** the case for building any
mechanism (which is part of why the `AGENTS-COMMON.md` splice was rejected). The lead also holds **no
`Write`/`Edit` tools**, so it is the agent *least* able to leak a secret into an artifact.

**It is still one missing line in a hard-rules list, and it costs one line to fix.** That is the entire
justification, and it is enough.

> **Split out on purpose.** This is an **agent-definition** file; tasks 30 and 31 touch **scaffold and
> init**. Different files, different verification, independently shippable — folding it into either would
> muddy a diff for no gain. It is numbered last because it is the least consequential of the three, not
> because it is blocked.

## What to build

Add a third bullet to the **`## Hard rules`** section of `claude/agents/fkit-lead.md`, matching the
existing style of that section.

Suggested wording, aligned with the producer/coder phrasing:

> - **Never expose sensitive information.** No DSNs, endpoints, passwords, or credentials in anything
>   you write — including a routed answer you bring back from another role.

The trailing clause is the part that earns its keep: the lead's actual output surface is **relayed
answers from other roles**, so that is where it could leak.

**Out of scope — do not widen this:**
- **Do not normalize the other six wordings.** Three phrasings exist across six files ("sensitive
  information", "secrets/credentials", "secrets"). The owner asked for **additive only**, and the report
  is clear this is cosmetic. Leave them.
- **Do not strip the duplicated rules out of the agent files** in favor of the shared block. Explicitly
  out of scope, per the owner and the original brief.

## Verification steps

- `grep -ciE "sensitive|secret|credential" claude/agents/fkit-lead.md` → **≥ 1**. It is **0** today; run
  it before your change.
- **All seven now carry it.** `grep -LiE "sensitive|secret|credential" claude/agents/fkit-*.md` →
  **no output**. (`-L` lists files *without* a match; an empty result is the pass condition, and this is
  the check that would have caught the omission in the first place.)
- The rule sits **inside** `## Hard rules`, not appended after the section, and reads in the same voice as
  the two bullets above it.
- **Nothing else in the file changed.** `git diff --stat claude/agents/fkit-lead.md` → **1 file, +1/-0**
  (or +2/-0 if wrapped). Anything larger means the scope grew.
- The fkit-managed copy refreshes: `claude/fkit-claude-init.sh .` → `grep -ciE "sensitive"
  .claude/agents/fkit-lead.md` ≥ 1. *(The `.claude/` copies are gitignored and regenerated — **edit the
  canonical source in `claude/`, never the copy.**)*

## Notes

- **Owner: fkit-coder.**
- **Depends on:** nothing. Independent of 30 and 31; ship any time, including in the same session.
- **Not a mechanism.** One line. If this task grows past a handful of lines, something has gone wrong —
  stop and re-read the scope.
- **No ADR.**
- Risk: **negligible.**
