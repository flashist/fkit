# Plan — Widen the sweeps that look in too few places (task 81)

**Task:** `ai-agents/tasks/done/extend-mover-reference-sweep-to-the-knowledge-base.md`
**Task ID:** 0036 · **Sprint 2**, priority 81
**Approved:** 2026-07-20 — owner blanket-approved 81's plan at task 85's plan gate, and separately
ruled Part D (see below).

Four parts, one owner (fkit-coder), all edits to shipped source under `claude/`.

## Part A — the movers' reference sweep

**Decision on the root set: sweep all of `ai-agents/`, excluding `wiki-vault/`.** The brief asked this
be weighed and recorded rather than silently scoped to one directory.

- Enumerating roots (`sprints/ tasks/ knowledge-base/ reviews/ plans/ worklogs/`) is what created this
  bug: the list was right when written and went stale. `plans/` and `worklogs/` did not exist when the
  movers were authored (ADR-020 added them) and were never added to the sweep.
- Sweeping `ai-agents/` with **one explicit exclusion** is self-maintaining: a new sibling directory is
  covered the day it appears.
- **`wiki-vault/` is excluded by name, loudly.** Only `fkit-wiki` writes the vault (ADR-005). A mover
  re-pointing a vault link would breach that boundary. The exclusion is a hard rule, not an oversight,
  and the skill text must say so — a future reader must not "fix" the gap.

Edits:
- `claude/skills/fkit-task-done/SKILL.md` — step-4 grep.
- `claude/skills/fkit-task-cancelled/SKILL.md` — **both** greps: the step-4 sweep **and** the later
  dependency search (the one most likely to be missed).
- **Handling rules extended:** a knowledge-base hit is a prose link in a *historical record* (an ADR or
  a report). Decide and write down explicitly: **re-point the href in place, change nothing else** —
  consistent with how `sprints/done/` is already handled (owner-ruled). An ADR's claims are frozen; its
  links are not.
- **Completion report** gains a distinct call-out for knowledge-base hits, as it already has for
  `sprints/done/`.

## Part B — the next-ADR-number derivation

`claude/skills/fkit-record-decision/SKILL.md`: derive the next ADR number from **every place a number
can be claimed**, not a `decisions/` directory listing. At minimum `knowledge-base/decisions/`,
`tasks/`, `sprints/`, and `wiki-vault/`. **Include the working tree** — the colliding ADR existed
uncommitted, so a committed-state check would have missed it.

**The rule: a number claimed anywhere counts as taken; the highest *claimed* number wins over the
highest *file on disk*.**

Plus a **duplicate-ADR-number assertion** in the test suite — same shape as task 85's duplicate-task-ID
guard, `node --test`, **zero new devDeps**. And the skill text names the **2026-07-19 collision** so a
future reader can see the incident that motivated the extra lookups.

⛔ **Part B READS the vault; it never writes it.** Reads are decentralized (ADR-005). This does not
weaken Part A's hard exclusion and must not be read as licensing a vault write.

## Part C — the lint's blindness to a reused number

`claude/skills/fkit-wiki-lint/SKILL.md` gains an ADR number/slug cross-check: for each
`decisions/adr-NNN-<slug>` vault page, compare against the `knowledge-base/decisions/` filename bearing
**NNN**; flag a slug divergence, or no knowledge-base file carrying that number.

**Flag, do not auto-fix** — a divergence has two causes with opposite repairs (a genuine renumbering vs
a withdrawn decision) and telling them apart needs judgment. Slug normalization is settled at build
time; it is where this check will produce noise if it produces any.

**Part C is detection; Part B is prevention. Neither subsumes the other** — B cannot see what is
already in the vault; C cannot stop a new number being allocated.

**Ownership:** owner-ruled 2026-07-19 — this is fkit-coder's. The wiki role's exclusivity is over
`wiki-vault/`, **not over the source of its own skill**. Consult fkit-wiki on slug-convention detail.

## Part D — the installer's hard-coded role count

**Owner-ruled 2026-07-20: drop the count from the line entirely.**

`claude/fkit-claude-init.sh:847` reads `Seven roles, each a locked session…` and sits **directly above a
seven-item role list**. ADR-028's eighth role is **decided, not built**.

- A bare `Seven` → `Eight` would make the installer promise a tester role that has no agent file, and
  would leave a corrected count above an unchanged seven-item list.
- Dropping the count is accurate today, stays accurate when the eighth role ships, and **dissolves the
  cross-task risk** the brief flags (81 landing without 82 → installer says eight, every doc says
  seven).
- The role list itself is left alone: it enumerates roles that actually exist.

## Verification
- Read the grep lines themselves, not the diff summary. **Check `fkit-task-cancelled`'s second grep
  specifically.**
- Dry run: a closed task back-linked from an ADR/report — the updated sweep must return the
  knowledge-base hit.
- **`ai-agents/wiki-vault/` must NOT appear in either mover's sweep.**
- Part B: reproduce the original failure (a number claimed only outside `decisions/`); uncommitted-only
  claim caught; duplicate-number test red-proved, not just green on a clean tree; no new devDeps;
  `/fkit-record-decision` writes nothing to the vault.
- Part C: red-prove against the reconstructed 2026-07-19 state; confirm the current vault is clean or
  that anything flagged is a real divergence, not slug-normalization noise; verify by reading that it
  flags rather than rewrites.
- Part D: no `Seven`/`seven` remains referring to the role count; **run the installer and read the
  printed block**; confirm the output does not assert the tester role exists.
- `.claude/skills/` copies refreshed via `claude/fkit-claude-init.sh .`

## Cross-task note
The role count is corrected in two tasks by two roles (81 Part D, 82). **Whoever closes the second
should re-run a repo-wide `seven` sweep.** Dropping the count here reduces but does not eliminate that.
