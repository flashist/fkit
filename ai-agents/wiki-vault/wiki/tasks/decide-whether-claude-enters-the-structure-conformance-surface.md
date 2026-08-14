# Decide whether `.claude/` enters the structure-conformance surface

**Source**: `ai-agents/tasks/done/0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md`
**Status**: done — ✅ **Done (agent-closed — not owner-verified)**, closed 2026-08-13
**Sprint/Tag**: Sprint 5 · `P15` · ID `0255` · Owner `fkit-architect`

## Goal

Answer a question **nobody had asked before**: does a project's `.claude/` tree — the fkit-managed
agents and skills — come under the structure-conformance surface built by
[[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]]?

⚠️ **A decision task with a mandatory owner sign-off, explicitly not an implementation task.** Its own
`## Notes` listed it as blocking *"the (unwritten) implementation brief for `.claude/` conformance"* —
and the ruling **closed that thread instead of scheduling it**.

## Key Changes

**Output: [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]]**
— ADR only. ⛔ **No source file, spec, manifest, test, skill or README line was edited**, by the
brief's own no-implementation fence.

The brief's three disk findings all held on re-derivation (2026-08-13):

| Finding | Status on re-check |
|---|---|
| The spec has **zero** `.claude` rows, and the spec inventory is the check's **entire** input | ✅ Confirmed — *(re-measured again by the 2026-08-13 vault sync: `grep -c '\.claude' claude/structure-spec.md` → **0**)* |
| The hash manifest cannot cover it — the generator walks `claude/scaffold/` only | ✅ Confirmed |
| Staleness is handled bluntly and silently — `rm`+`cp`, one count line, no verdict | ✅ Confirmed |

⚠️ **The brief's own citation was off by one at each end** — the generator's `workingTreeFiles()` is
`:259-295`, not `:258-293`. Non-material, corrected on the record rather than absorbed.

## Outcome

### The finding that decided it: `.claude/` was never *excluded* — it was never *considered*

`grep -c '\.claude'` returns **0** for ADR-039, **0** for the structure-check design report, and **0**
for ADR-015. *There was no prior ruling to be consistent with and no rejected alternative to reopen* —
which is what let the ADR rule cleanly rather than amend anything.

### The ruling, and why it is not a concession

**Option 4 — `.claude/` is deliberately NOT a conformance surface; the unconditional refresh is the
guarantee.** ⚠️ **On deletion the refresh is *strictly stronger* than conformance**: under ADR-015's
invariant a retired file lingers under `ai-agents/` **forever** and `/fkit-heal` can only report it;
under `.claude/`'s refresh it is **gone automatically on the next launch**. *Bringing `.claude/` under
the conformance surface would be describing a stronger guarantee in a weaker vocabulary.*

### ⛔ The thread ENDS rather than defers — and the owner signed off knowing that

The most consequential consequence, and it was put to the owner **before** sign-off in exactly those
terms: under Option 4 the blocked implementation brief **is never written**. Sign-off came via
`AskUserQuestion` in a live `fkit lead` session, 2026-08-13, verbatim label **"Sign off — Option 4"**.
Two subsidiary questions were ruled the same way in the same session — **"Its own follow-on brief"**
(the `README.md:54` scoping) and **"Record it in the ADR as permitted, not required"** (the refresh
receipt).

### What it deliberately did NOT settle

- ⛔ **`README.md:54` is left wrong on disk.** It promises a divergence signal for *"your project's
  fkit-managed structure"* — a phrase the repo's own gitignore comments put `.claude/` inside. The ADR
  records the fix and **refuses to apply it**; a follow-on docs brief owns it (`0292`). ⚠️ **The
  obvious remedy is itself wrong** — scoping the line to `ai-agents/` would **under-describe** the
  check, because the spec's Table B includes the root `CLAUDE.md` and `AGENTS.md`.
- **ADR-015 and ADR-039 are neither touched nor amended** — the ADR says so explicitly in two numbered
  consequences, so a later reader does not go hunting for edits that were never made.

### ⚠️ One row of the excluded three

`0255` was one of the three Sprint 5 rows held **out of the `/fkit-sprint-ship-loop` run** by owner
ruling of 2026-08-10 — because it needs a **second owner beat the loop has no gate for**. The
exclusion held: it shipped through a route that has that gate.

## Related
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — this task's entire output
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the invariant whose scope boundary this decision records
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the conformance surface `.claude/` does not join
- [[tasks/design-the-post-update-structure-check]] — the design that never considered the tree
- [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — `0253`, which shipped this decision's premise
- [[tasks/build-the-producer-owned-structure-check-skill]] · [[tasks/build-the-hash-manifest-generator-and-completeness-test]] · [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]] — the machinery this ruling declines to extend
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board it closed on
- [[systems/launch-convergence-and-init]] · [[systems/install-and-self-update]]
