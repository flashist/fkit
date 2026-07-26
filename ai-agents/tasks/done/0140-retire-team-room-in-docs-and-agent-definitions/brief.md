# Retire "team room" in the docs and agent definitions, and fix the stale "menu 7" citations

## ID
0140

## Sprint
Sprint 2

## Priority
116

## Status
✅ Done

## Owner
fkit-coder

## Context

The owner ruled on 2026-07-25 that **"team room" is retired project-wide** in favor of the role's real
name, **lead**. Task 0139 does the launcher; this brief does everything else outside the wiki vault.

There are **two distinct kinds of edit here**, and conflating them is how this task goes wrong:

- **A naming change** — "team room" as a concept name, which is a wording preference.
- **A correctness fix** — three live files state the lead is **"menu option 7"**. The moment 0139 lands,
  that is **false**. These are not cosmetic; they are stale claims in files agents read as instructions,
  including the lead's own system prompt.

**Inventory below was produced by a repo sweep on 2026-07-25.** It is given so you do not have to
re-derive it — but **verify every site before editing it**. Line numbers drift, and this project has a
named failure class for exactly that: two of the last three tasks shipped with citations that no longer
resolved (see 0124's residuals, and the conventions being recorded in 0137). **A path or line number
that does not match what you find is a finding to report, not a number to quietly correct.**

**No ADR-027 dual-home surface.** `ai-agents/knowledge-base/architecture.md` is **not** in
`claude/scaffold/ai-agents/` (it is project-specific, generated per project by the architect's survey),
and `decisions/` is `⛔ never sync` per
[dual-home-parity](../../../knowledge-base/conventions/dual-home-parity.md). The repo-root `CLAUDE.md`
and `claude/scaffold/CLAUDE.md` are **independent files, not copies** — both need editing, but they are
not a parity pair and must not be byte-aligned. Checked at scoping time, per ADR-027 §Decision 1.

## What to build

### A. Stale menu-number citations — correctness, do these carefully

| File | What it says now |
|---|---|
| `claude/agents/fkit-lead.md:4` | `— menu option 7` in the agent's own `description` frontmatter |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:13` | `` `fkit lead` **session** (menu 7) `` |
| `ai-agents/knowledge-base/architecture.md:105` | `the **team room + orchestrating conductor** (menu 7; ADR-031)` |

Update each to the new number (**1**). Prefer wording that does not re-pin a number that can move again
— e.g. *"the first entry in the `fkit` menu"* or simply *"a `fkit lead` session"*. **A citation that
cannot go stale is better than one that is merely correct today**, which is the whole point of the
convention being recorded in 0137.

Also check `ai-agents/knowledge-base/architecture.md:180`, which renders the menu as `(1-7 — an if/else;
no LLM anywhere in the routing)`. The **range** is unchanged by 0139, so this line is likely still
correct — **confirm it, and leave it alone if so.**

⚠️ **`claude/agents/fkit-lead.md:4` is inside the YAML frontmatter `description:` field**, which is a
plain scalar. Do not introduce a `": "` sequence while editing it — three skills already carry that
hazard and it is the subject of task 114 (0136). A `:` followed by a space in a **continuation line**
breaks the loader **silently**, degrading the description to the file's H1.

### B. "team room" as a concept name — the naming change

| File | Sites |
|---|---|
| `claude/agents/fkit-lead.md` | `:4`, `:12` (the greeting the agent gives the owner), `:22`, `:23` (*"The owner reached you by picking 'team room' from the `fkit` menu"* — **this one becomes factually wrong** after 0139, since the menu will say "lead") |
| `claude/README.md` | `:103` |
| `claude/skills/fkit-team/SKILL.md` | `:20` |
| `claude/scaffold/CLAUDE.md` | `:37` |
| `README.md` | `:4`, `:45` |
| `CLAUDE.md` | `:8` (`a team-room lead`) |
| `AGENTS.md` | `:9` (`a team-room lead`) |

Replace with "lead", "the lead", or "the conductor" as reads best in each sentence. **This is a wording
change — do not restructure the surrounding prose, and do not change any claim the sentence makes.**

### C. Explicitly NOT in scope — and why

Do **not** edit these, even though they contain the phrase:

- **`ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md:26`** —
  *"the 'team room' (menu option 7)"*. This is an **accepted ADR**, and the statement was **true when it
  was written**. Silently rewriting a decision record to match today's reality erases the history the
  record exists to hold. **Producer's recommendation to the owner: a dated one-line correction note
  appended to the ADR, not a rewrite of its body — and that is an architect call, not a coder edit.**
  Flagged as an open question below; **do nothing here without an owner ruling.**
- **`ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md:195,231`**
  and **`ai-agents/knowledge-base/reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:73`** —
  dated design reports are **historical evidence** of what was true on their date. Leave untouched.
- **`ai-agents/wiki-vault/`** — two pages carry the phrase. **Wiki writes are the `fkit-wiki` role's,
  exclusively.** That is task 0141.
- **`test/launcher-contract.test.js:138-139`** — the phrase appears in a *comment* describing the
  no-tty default. Harmless and accurate in substance (the default really is the lead). Leave it, or
  reword only if you are already editing that file for another reason.

## Verification steps

1. `grep -rn "team room\|team-room\|Team room\|Team Room" --include="*.md" --include="*.sh" --include="*.js" .`
   (excluding `node_modules` and `ai-agents/tasks/`) returns **only**: ADR-010, the two dated design
   reports, the `launcher-contract.test.js` comment, the two wiki-vault pages (0141's scope), and this
   brief plus 0139/0141. **Any other hit is a site the inventory missed — report it.**
2. `grep -rn "menu option 7\|menu 7" .` (same exclusions) returns only the deliberately-untouched ADR
   and reports.
3. `npm test` green — 521 tests + the `prove-red.sh` hard gate.
4. `claude/agents/fkit-lead.md` frontmatter still parses: the agent's description in the `/agents`
   listing is the real description text, **not** the file's H1. (A silent fallback to the H1 is exactly
   the failure mode task 114 exists to guard against.)
5. Open a `fkit lead` session and confirm the greeting no longer says "team room" and does not tell the
   owner they picked option 7.
6. Every edited sentence still asserts what it asserted before — this was a rename, not a rewrite.

## Notes

- **Depends on:** 0139 — soft. The prose can be written first, but the "menu 1" claims are only *true*
  once 0139 lands, so shipping this alone briefly makes the docs wrong in the other direction. **Ship
  them together where practical**; if they must split, land 0139 first.
- **Blocks:** 0141.
- **Owner:** fkit-coder — source and doc edits only, no wiki.
- **Edit the canonical sources in `claude/` only.** `.claude/` is a gitignored copy refreshed by
  `claude/fkit-claude-init.sh .`.
- **⚠️ `claude/agents/fkit-lead.md` is a system prompt**, not documentation. It is in the lead's context
  every turn, and it outranks a SKILL file in the agent's own reasoning. Getting it wrong here is worse
  than getting a README wrong — this is the lesson 0124 recorded when its checklist missed the agent
  definitions entirely.
- **Open question for the owner (do not resolve it yourself):** what to do about ADR-010's now-false
  "menu option 7". Producer recommends a dated correction note added by the architect. Until ruled,
  leave the ADR alone.
- No commit — leave the edits in the working tree.
