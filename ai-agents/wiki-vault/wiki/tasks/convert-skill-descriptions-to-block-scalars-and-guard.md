# Convert every skill `description:` to a `>-` block scalar, then guard it

**Source**: `ai-agents/tasks/done/0136-convert-skill-descriptions-to-block-scalars-and-guard/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-01
**Sprint/Tag**: Sprint 2 · ID 0136 · owner fkit-coder

## Goal
**A broken `SKILL.md` frontmatter fails silently, and nothing in fkit caught it.** Task `0123` proved this **by accident**: a colon on a **continuation line** of a multi-line YAML `description:` stopped the frontmatter parsing, and the skill listing **fell back to the file's H1**. Nothing errored, no test went red, and the only signal was the listing text changing — **noticed by eye**.

The hazard was live and structural, verified 2026-07-25:
- **Zero** of the 25 `claude/skills/*/SKILL.md` files used a block scalar; all 25 used a bare **plain** scalar.
- **Three** carried a same-line `": "` in that plain scalar — **invalid strict YAML**. It rendered only because Claude Code's loader tolerates a same-line colon while breaking on one in a continuation line.
- **All 7 `claude/agents/*.md` already used `description: >-`** and were therefore **immune** — a colon inside a block scalar is just text. *That structural fact, not any regex, is the actual guarantee.*
- **No script or test in the repo parsed `SKILL.md` frontmatter at all.**

**So the fix was to eliminate the hazard class, not to test one instance of it.**

⚠️ **Why this was ONE task and not two, and the order was binding — convert, then guard.** Converting first and guarding later leaves the conversion with **no automated verification at all**. Guarding first is worse: the guard has three pre-existing failures to grandfather on day one. **The two halves verify each other.**

## Key Changes
1. **All 25 skill descriptions converted to `>-` folded block scalars**, matching the shape the agent definitions already used. The rendered description had to be **unchanged in content** — compared before/after per file, not just diffed. One file was multi-line (`fkit-sprint-ship-loop`, 3 continuation lines) — **the very file `0123` broke**. The three known-invalid files became valid **as a consequence, not as a separate step**.
2. **A hand-rolled frontmatter reader added under `test/`.** ADR-014's zero-devDeps constraint means **no YAML library** — and block scalars are what make hand-rolling tractable, which is the **second** reason step 1 came first. It asserts, across **both** skills and agents: frontmatter delimited and first in the file; `name:` and `description:` present; **`description:` uses a `>-` block scalar** (the structural rule — *a colon-hunting regex would only chase one token*); every continuation line **indented more** than the key (**the one hazard a block scalar does not absorb** — a de-indented continuation line still ends the scalar); and a non-empty single-line result after folding. Proved able to fail against known-bad fixtures via `prove-red.sh`.

**Skills are NOT dual-homed** — re-confirmed before editing: `claude/scaffold/` holds no skill tree.

## Outcome
Shipped with the gitignored `.claude/skills/` mirrors refreshed and diffed against their canonical sources.

⚠️ **What this does NOT fix, stated in the brief and worth preserving:** the guard reads **frontmatter only**. A `SKILL.md`'s **body — the procedure itself — remains untested by anything.** That is why `0123`'s 511-passing suite proved *no regression* rather than proving the change. **Do not read this task's green test as coverage of skill behaviour.**

The verification also kept a step that looks redundant and is not: **eyeball the live skill listing.** The test reads the file; **the loader is what actually parses it**, and no test in this repo can substitute for the loader.

## Related
- [[tasks/route-sprint-ship-loop-close-to-producer]] — task `0123`, which broke its own frontmatter and produced findings R4 and R5, this task's source
- [[decisions/adr-014-how-fkit-tests-itself]] — zero devDeps, the hand-rolled reader, and the prove-red discipline
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — task `0120`, whose refused follow-up `0152` recorded that **no test in the repo reads any `SKILL.md`'s content**; this task adds the first that reads its frontmatter
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — its trigger (b) enumerates the same 25 skill directories, **from disk at test time**
- [[systems/testing-and-verification]] · [[systems/role-locked-sessions]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
