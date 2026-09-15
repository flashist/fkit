# Sweep the repo-only `claude/` path form out of installed-facing skill and scaffold prose

## ID
0390

## Sprint
Sprint 9

## Priority
P3

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session driving
`/fkit-sprint-ship-loop` — **the option label is the verbatim text**: **"Residual + one sweep task
(Rec)"**. The ruling had two halves: the residual is recorded in `0339`'s review ledger (done by a
coder in parallel), and **the sweep is filed as this one task**. ⛔ The ruling is *file it*, **not**
*do it*.

Raised as **R5** of task `0339`'s round-1 review. Codex rated one instance **high**; the reviewer
**reduced it to low** on traced blast radius — the pattern is **pre-existing, repo-wide, and already
shipping**. ⭐ **Both the original label and the reduction are recorded here deliberately**, so a later
reader does not re-inflate the severity from the Codex label alone.

### The defect, in one line

fkit's skills and convention pages reference the selector script and the ownership hook by **two
different path forms** — repo-only `claude/…` and installed-only `.claude/…`. **A consuming project
has only `.claude/`.** A repo-only path in installed-facing text is unrunnable, or unresolvable, there.

### Measured on disk 2026-09-13 — re-derive at pickup, do not copy these

⚠️ **The numbers below were measured by this filing and are stated so the scope is falsifiable.
Re-grep at pickup.** They split into two classes, which need different fixes.

**Class A — runnable command lines under `claude/skills/` using the repo-only form. 8 sites, 3 files.**

| File | Lines | Sites |
|---|---|---|
| `claude/skills/fkit-sprint-done/SKILL.md` | 96, 132, 148, 379 | 4 |
| `claude/skills/fkit-sprint-cancelled/SKILL.md` | 109, 392 | 2 |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | 103, 107 | 2 |

All 8 are `bash claude/skills/fkit-status/dashboard.sh …`.

**Class B — repo-only `claude/…` paths inside SCAFFOLD-SHIPPED prose. 5 sites, 3 files.**

| File (under `claude/scaffold/ai-agents/knowledge-base/conventions/`) | Lines | Path named |
|---|---|---|
| `priority-is-rank-not-identity.md` | 101, 107 | `claude/skills/fkit-status/dashboard.sh` |
| `priority-is-rank-not-identity.md` | 106 | `claude/skills/fkit-task-brief/SKILL.md` |
| `task-status-vocabulary.md` | 80 | `claude/skill-ownership-hook.sh` |
| `sprint-status-vocabulary.md` | 98 | `claude/skill-ownership-hook.sh` |

**Total certain defect sites: 13, in 6 files.**

### ⛔ ONE MEASURED FALSE POSITIVE — do not sweep it

`claude/skills/fkit-heal/SKILL.md:51` reads *"(In this repo's own checkout: `bash
claude/skills/fkit-heal/check.sh`…)"* — it **deliberately** contrasts the repo form against the
`.claude/` form given three lines earlier at `:48`. ⛔ **It is correct as written. Changing it is a
regression.** Any sweep built from a bare grep will hit it; the sweep must exclude it by name.

### What `0339` did and did not cause

⭐ **`0339` added exactly 2 of the 13**, verified by `git blame` 2026-09-13:

- `claude/skills/fkit-sprint-ship-loop/SKILL.md:103` — the new selector call (uncommitted at
  measurement). Its neighbour `:107` dates to 2026-07-22.
- `claude/scaffold/ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md:98` — the
  `claude/skill-ownership-hook.sh` reference.

⚠️ **`0339` replicated an existing pattern rather than inventing one.** R5's exact sentence already
ships in the sibling page `task-status-vocabulary.md:80`, added 2026-07-19 by commit `8614392`:

> **If your team wants a stronger guarantee than this**, the fix is a further precondition in
> `claude/skill-ownership-hook.sh` — closes only from an owner-present session, say — not stricter prose.

(The two copies differ by one word — *"its work is done"* vs *"the work is done"* — and are otherwise
identical.) ⛔ **So 11 of the 13 sites are pre-existing and independent of `0339`.**

### ⛔ WHY THIS WAS NOT PARTIALLY FIXED — the reasoning the owner accepted

**A partial fix leaves the ship-loop internally inconsistent**, using both path forms in the same
file. ⛔ **It is a sweep or it is nothing.** Fixing only `0339`'s 2 new sites would have produced a
`fkit-sprint-ship-loop/SKILL.md` with `.claude/` at line 103 and `claude/` at line 107 — strictly
worse to read than the uniform-but-wrong file that ships today.

### ⚠️ The correct form is already the majority, and the script itself declares it

Measured 2026-09-13: **13 sites already use `.claude/`** — across `claude/skills/fkit-status/SKILL.md`,
`claude/skills/fkit-heal/SKILL.md`, `claude/agents/fkit-producer.md`, `claude/agents/fkit-lead.md`,
both vocabulary pages' code fences, and — ⭐ **load-bearing** — the two scripts' own invocation
banners: `claude/skills/fkit-status/dashboard.sh:4` (*"⚠️ INVOKE AS: bash
.claude/skills/fkit-status/dashboard.sh …"*) and `claude/skills/fkit-status/throughput.mjs:7`.

⛔ **So the three sprint skills contradict the documented invocation form of the very script they
call.** This is not a style preference with two defensible sides; there is a declared form and 8
runnable lines that do not use it.

## What to build

**A sweep, not a patch. One pass over all 13 measured sites.**

1. **Class A — rewrite all 8 runnable command lines to the `.claude/` form**, matching
   `dashboard.sh:4`'s own declared invocation. ⛔ **Leave `claude/skills/fkit-heal/SKILL.md:51`
   untouched** (see the false positive above).
2. **Class B — decide the form for scaffold-shipped prose, then apply it uniformly to all 5 sites.**
   ⚠️ **This half is NOT a mechanical find-and-replace.** These are *source coordinates in prose a
   consuming reader receives*, not commands. `.claude/skills/fkit-status/dashboard.sh` is where the
   file actually lives in their project, so it is probably right — but `claude/skill-ownership-hook.sh`
   installs as `.claude/skill-ownership-hook.sh`, and
   `claude/skills/fkit-task-brief/SKILL.md` as `.claude/skills/fkit-task-brief/SKILL.md`.
   **Verify each install location against `claude/fkit-claude-init.sh` before rewriting it** — a
   confidently wrong path is worse than the inconsistent one.
3. **Re-derive the site list first.** ⛔ **Do not work from the tables above** — they were measured at
   filing and the tree moves.

### ⚠️ Two sites needing triage, deliberately NOT counted above

`claude/scaffold/.../priority-is-rank-not-identity.md` and `.../durable-citation-anchors.md` each name
`claude/scaffold/` itself in shipped prose. A consuming project has no `claude/scaffold/` at all, so
these may be a **third** class (a shipped page naming a directory the reader does not have) — or they
may be legitimate references to fkit-the-framework. ⛔ **Triage them; do not silently rewrite them.**

### ⛔ Out of scope

- ⛔ **No behaviour change.** No script, no test, no hook logic. This is text only.
- ⛔ **No change to `claude/skills/fkit-heal/SKILL.md`** — its one repo-form path is correct.
- ⛔ **No touching ADRs or reports under `ai-agents/knowledge-base/`.** They cite
  `claude/skills/fkit-status/dashboard.sh:NNN` as **source-file coordinates into this repo**, which is
  what `durable-citation-anchors.md` asks for. ⭐ **Those are correct and are a different thing from
  an installed-facing instruction.** ADR-047 alone holds ~20 such citations; sweeping them would be a
  large, wrong change.
- ⛔ **No re-rank of any board** (ADR-035). ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005).
  ⛔ **No new devDependency** (ADR-014).

## Verification steps

1. **Zero runnable `bash claude/skills/…` lines remain except the `fkit-heal` one.**
   `grep -rn "bash claude/skills/" claude/` returns exactly `claude/skills/fkit-heal/SKILL.md`.
2. **Class B is uniform.** Every repo-only `claude/…` path in `claude/scaffold/` either matches the
   decided form or is a triaged-and-justified exception recorded in the worklog. ⛔ **Zero
   un-triaged sites.**
3. **Each rewritten path resolves in an installed project.** Check against
   `claude/fkit-claude-init.sh`'s actual copy targets, not against assumption.
4. **The dual-home parity suite still passes** — Class B edits touch scaffold files that may be
   dual-homed. `node --test test/dual-home-parity.test.js`.
5. **Reference integrity unchanged.** `node --test test/reference-integrity.test.js` reports **0
   broken**. ⛔ **Do not add a `NAMED_EXEMPT` entry** to make anything pass.
6. **Citation policy unchanged.** `node --test test/coordination-citation-policy.test.js`.
7. **Full suite green**, and `git diff --name-only` lists only the swept files and this task folder.

⛔ **Do not hardcode any pass/fail total from this brief. Re-derive the baseline at pickup.**

## Notes

- **Depends on:** nothing. **Blocks:** nothing. ⭐ **`0339` is not a dependency** — it contributed 2 of
  the 13 sites and is closing now; the other 11 predate it and the sweep is correct either way.

- ⭐ **Severity: LOW, by the reviewer's traced reduction — recorded with its reasoning so it is not
  re-inflated.** Codex rated one instance **high**. The reviewer reduced it to **low** because the
  pattern is pre-existing, repo-wide, and already shipping in released versions. ⛔ **Nothing is red**
  — no test pins the path form. The real cost is an agent in a consuming project running a command
  that cannot resolve, and a reader sent to a file they do not have.

- ⚠️ **Owner is `fkit-coder`.** Every deliverable is prose under `claude/` — three `SKILL.md` files
  and three scaffold convention pages — which **names no producing skill** in `skills_for_role()`.
  [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  **Decision 1** fixes the Build role as the owner of the skill the deliverable is produced by, and its
  skill-less clause staffs a deliverable that names none — *"source, tests, scaffold, prose under
  `claude/`, coordination-doc repairs"* — **to the coder as sole source-write authority, whatever
  `## Owner` says.** ⭐ This task's surfaces are literally two of the named categories: *scaffold* and
  *prose under `claude/`*. ⛔ **The producer cannot own it** — no producer skill writes `claude/`.

- ⚠️ **Placement: Backlog board, UNRANKED, APPENDED LAST.** Filed 2026-09-13 by a **spawned
  `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of the relayed owner ruling named in § *Context* and deciding nothing beyond
  them. Nothing was renumbered and nothing was inserted mid-board
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

- ⚠️ **`0383`** (*"shrink the backlog board whose task cells are being used as a document store"*) is
  open and targets the cell bloat a long Task cell adds to. This row's board cell was kept short and
  the detail left here; ⛔ it is **not** a dependency in either direction.
