# Retire the `sprint-*.md` glob in `fkit-status/SKILL.md` — select the active sprint by resolved identity

## ID
0266

## Sprint
Sprint 5

## Priority
Sprint 5 P6

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Authority

**Owner ruling, 2026-08-10** — ADR-040's and ADR-041's implementation follow-ons are filed and ranked
into Sprint 5. See `0264`'s Context for the scope hole and Sprint 5's dated addendum for the
reconciliation.

**Direction ruled, 2026-08-10, verbatim option label: "Accept — selection by identity
(Recommended)".** ⚠️ *"Keep the glob as a fallback"* was offered and **explicitly rejected**.

### What changes

`claude/skills/fkit-status/SKILL.md:26` is the **selection rule** — verified on disk 2026-08-10:

> *"**Empty** — the **active sprint**: the `sprint-*.md` at the top of `ai-agents/sprints/` … If there
> is more than one, take the highest N **and flag the ambiguity** in the report."*

`:48` is its explanatory block — verified same day:

> *"an empty argument resolves the active sprint by globbing `sprint-*.md`, and `backlog.md` is
> deliberately outside that glob"*

After ADR-041 both are **false as written**, not merely stale. They are sites **1** and **2** of
ADR-041 §6's seven. The remaining five are
[`0267`](../../done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/brief.md).

⚠️ **Site 2's conclusion survives; its mechanism does not.** `backlog.md` **stays** out of the default
status run — ADR-041 §3 makes that exclusion **stronger**: it is now *"the identity is `Backlog`"*
rather than *"the filename is outside the glob"*, so renaming the file into any glob would no longer
make it the active sprint. Rewrite the reason, keep the rule.

### ⚠️ The binding constraint — one grammar, one implementation

ADR-041 §5: `dashboard.sh` resolves identity in shell; this SKILL.md file is **prose executed by an
LLM**. If the prose re-states the grammar, this component acquires **two grammars for one question** —
the exact defect `dashboard.sh:111-125` documents in fkit's own file, where three grammars for *"is
this the `## Status` heading?"* produced a false `multiple-status-tables` and a misleading `die`.

**Therefore, binding: the selection step obtains each candidate's identity FROM `dashboard.sh`**, via
the interface `0265` builds. **Do not restate the token grammar, the segment rule, the delimiters, the
suffix bound, or the filename allowlist in this file.** Naming what the resolver returns is fine;
re-deriving how it decides is not.

## What to build

Edits to `claude/skills/fkit-status/SKILL.md` only.

1. **`:26` — the selection rule**, rewritten to ADR-041 §1:
   - candidate set = every `*.md` **directly** in `ai-agents/sprints/` (not `done/`), **no pattern on
     the stem**;
   - resolve each candidate's identity **through `0265`'s interface**;
   - **eligible** = a `Sprint <N><suffix>` identity. **`Backlog` is never eligible. Unresolved is never
     eligible**;
   - highest identity wins, **compared as an integer** with the suffix tie-break;
   - two candidates on the **same** identity → lexicographically first path, **and the briefing states
     which was chosen and which other files claimed it**;
   - **empty eligible set** → say so, list every top-level `.md` with its resolved identity or
     `unresolved`, and **stop**. Never fall back to a `Backlog` board. Do not guess.
2. **`:48` — the explanatory block**, rewritten so the surviving conclusion (`backlog.md` is outside
   the default run) rests on the identity mechanism, per ADR-041 §3.
3. **Nothing else in this file.** If you find a third glob reference here that ADR-041 §6 did not
   enumerate, **report it** — §6 claims to be complete, and an eighth site is a finding about the ADR.

### Constraints

- ⛔ **Do not restate the identity grammar in prose** — ADR-041 §5, binding. This is the single most
  likely way to get this task wrong.
- ⛔ **Do not reintroduce the glob** in any form, including as a fallback or a comment.
- ⛔ **Do not edit `dashboard.sh`** — the resolver is `0264`/`0265`.
- ⛔ **Do not edit the other five §6 sites** — they are `0267`, deliberately.
- ⛔ **Do not rename `ai-agents/sprints/backlog.md`** (ADR-041 §3).
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit.

## Verification steps

1. **`0265` is closed and its interface exists**, before this starts. Name the exact invocation this
   file now tells the reader to use, and **run it** against `ai-agents/sprints/sprint-5.md` and
   `ai-agents/sprints/backlog.md`; paste both outputs.
2. **Follow the rewritten rule by hand on this repo** and show it selects `ai-agents/sprints/sprint-5.md`
   and **not** `backlog.md`. State each candidate and its resolved identity.
3. **Follow it on the reporting project's twelve §7 filenames** (from
   `ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`) and
   show it selects `plan-sprint-6.md`, **not** `sprint-backlog.md` — ADR-041's stated outcome. This is
   a desk check against the recorded names, not a third-party test.
4. **Grep proves the retirement.** `grep -n 'sprint-\*\.md' claude/skills/fkit-status/SKILL.md` returns
   **nothing**.
5. **Grep proves no second grammar.** The file contains no segment-delimiter list, no
   `Sprint [0-9]`-shaped pattern, and no `plan-` allowlist. Paste the greps.
6. **`npm test` green** (including `test/skill-frontmatter.test.js` and any skill-shape test this file
   is subject to).
7. `git diff --stat` touches `claude/skills/fkit-status/SKILL.md` and nothing else.

## Notes

- **Depends on:** `0265` — hard
- **Blocks:** `0267`
- **Why that edge is real:** ADR-041 §5 forbids re-deriving the grammar in prose, so there is literally
  nothing for this file to consume until `0265`'s resolve-identity interface exists.
- **On merit:** immediately below `0265` — it is the half of ADR-041 the downstream reporter actually
  hits first (a bare `/fkit-status` selecting the wrong board).
  ⚠️ **`P13` is an append rank, NOT a merit ranking — flagged for owner confirmation.** A spawned
  producer never re-ranks or inserts mid-board (`/fkit-task-brief` step 5, ADR-035). See Sprint 5's
  dated addendum.

  ✅ **RESOLVED 2026-08-11 — the flag above is left byte-identical and is now DISCHARGED.** The owner
  confirmed the placement in a live `fkit producer` session and the re-rank was **executed**: this row now
  sits at **`Sprint 5 P6`**, and the append rank is history. **and it is the merit position the statement above names, exactly.** Authority, the verbatim ruling, its channel, and the full old→new rank map are in Sprint 5's
  §"Addendum — the owner-ruled re-rank of 2026-08-11". ⛔ **This is not producer precedent for
  re-ranking** — it was executed only because the owner ruled it in a live session.
- **Line-number citations are dated anchors of convenience** (verified on disk 2026-08-10); the durable
  anchors are the quoted text above.
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.
