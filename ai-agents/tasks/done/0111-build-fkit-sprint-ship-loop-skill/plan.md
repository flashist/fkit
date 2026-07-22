# Consolidated plan — Tasks 0110–0113: evolve fkit-lead into the orchestrating conductor

## Context
The owner ruled (2026-07-22, ADR-031/ADR-032, design report `2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`)
that `fkit-lead` grows from a **router** into a **single-point-of-interaction conductor** that spawns and
drives any role, holds the owner channel, and relays decisions live. Four coupled implementation tasks
carry it. **Source of truth = the design report + the two ADRs; I implement what they record, not a
re-derivation.** Dependency order: **0110 → 0111 → {0112, 0113}** (0113 only needs 0110).

**Owner decisions at this plan gate (2026-07-22):** skill name = **`fkit-sprint-ship-loop`**; the general
conductor primitive is **prompt-only** (lives in fkit-lead.md; the sprint loop is the only *named* procedure).

**Execution note (independence):** one approval here, then I run each task's ship-loop (persist plan.md,
In-progress, build, verify, spawn reviewer, process review, close agent-marked) autonomously in order,
stopping only for a genuine review judgment call or a degraded close.

---

## Task 0110 — evolve `claude/agents/fkit-lead.md` (router → conductor)
**Edit `claude/agents/fkit-lead.md` only** (design §4.2 row 1; ADR-031 Decision 1-3):
- **Remove** the "## You are not a doer" section's "no Write or Edit tools — deliberately" framing
  (reversed by ADR-031, already stale per ADR-022). Correct the `description`/`initialPrompt` "NOT a doer" prose.
- **Add a conductor remit** (design §4.1): given a goal, spawn whatever typed `fkit-<role>` subagent is
  needed, assign one bounded unit, await the return, relay any surfaced decision to the owner via
  `AskUserQuestion`, advance (spawn next / report done). Name `fkit-sprint-ship-loop` as the flagship application.
- **Add the three driver disciplines** (design §3.3/§9.2, ADR-031 Decision 2-3): (1) **delegate, never
  substitute** — never write source, never review, spawn each role's real work into its own fresh typed
  subagent; (2) **hold the owner channel** — only the lead session has `AskUserQuestion`; workers *return*
  questions; (3) **spawn typed `fkit-<role>` subagents only** — a generic (`general-purpose`/`Explore`)
  helper carries no fkit identity and is denied every `fkit-*` skill (ADR-018).
- **Keep** the router remit intact (menu 7, "who do I need?", `/fkit-query`, `@role` consults, routing table).
- **Do NOT** touch `skill-ownership-hook.sh`, `skills-for-role.sh`, launcher, or any other file.
**Verify:** (1) no "not a doer"/"no Write or Edit tools"; router sections intact; (2) conductor remit + 3
disciplines present; (3) `git diff` shows only `fkit-lead.md`; (4) matches ADR-031 (spot-check).

## Task 0111 — build `claude/skills/fkit-sprint-ship-loop/SKILL.md` (new, lead-owned)
**Create the skill** implementing design §5 contract + §6.3 front matter + `⛔ Owner: the lead` banner:
- **Front matter** (§6.3): `name: fkit-sprint-ship-loop`, the description; then `# ⛔ Owner: the lead`.
- **Argument** (§5): a sprint plan path; empty = active sprint. One operand, no output-variant flags.
- **Task selection & ordering** (§5.1): read plan + briefs; board via `bash claude/skills/fkit-status/dashboard.sh <plan>`
  (never hand-derive); eligible = `🔲 Backlog` with all `Depends on` `✅ Done`, ordered priority→topology;
  deadlock → stop + report chain.
- **Per-task drive sequence** (§5.2 table): Plan (coder, write no source, return plan) → **driver
  AskUserQuestion approve** → Build → Verify → Review (`@fkit-reviewer` `/fkit-stateful-review`) →
  Process-review (coder applies `fkit-process-stateful-review` *method*) → **driver runs `/fkit-task-done`**.
  Re-verify after any post-review change.
- **Live owner-relay gate** (§5.3, §6.2): worker returns `DONE` / `NEEDS-DECISION {question,options[],recommendation,context}` / `BLOCKED`;
  driver relays `NEEDS-DECISION` via `AskUserQuestion`, blocks on a real owner answer, folds it into the next spawn. **No timer, no guess** (opposite of declined ADR-024).
- **Stop table** (§5.4) + **progress reporting** (§5.5): no path ends in silence; both brief `## Status` and sprint row get accurate status.
- **Close posture** (ADR-032 D5/D6, ADR-025): `/fkit-task-done` by default writes `✅ Done (agent-closed — not owner-verified)`;
  **degraded run → do not self-close**, put close to owner; **never self-cancel** → stop and ask.
- **⚠️ Plan-gate honesty clause (design §3.5/§9.1, ADR-031)** — state plainly, unsoftened: on this
  orchestrated path "no code before plan approval" is **prose-enforced in the worker prompt, NOT a runtime
  write-wall** (plan mode can't run in a spawned worker). The plan/build split (spawn-for-plan → approve →
  spawn-to-implement) stands in for the wall. **A later reader must not "fix" this into a false structural
  guarantee.** Owners wanting the structural wall use `fkit coder` + `/fkit-task-ship-loop`.
- **Do NOT invoke `fkit-task-ship-loop`** (C3, session-only, refuses spawn) — reuse its *shape* only. It stays byte-unchanged.
**Verify:** (1) file exists w/ §6.3 front matter + banner; (2) implements §5.1 selection via dashboard.sh,
§5.2 sequence, §5.3 relay, §5.4 stops, §5.5 reporting; (3) plan-gate honesty clause present as
prose-enforced-not-structural; (4) close writes agent-closed by default, stops on degraded, never
self-cancels; (5) `fkit-task-ship-loop/SKILL.md` byte-unchanged (`git diff` empty for it).

## Task 0112 — wire the skill into `skills_for_role()` + 4 mirrors + test (same change)
- **`claude/skills-for-role.sh:37`**: `lead` gains `fkit-sprint-ship-loop` (append), nothing else.
- **Update the FOUR mirrors** (checklist at `skills-for-role.sh:12-24`) in the same change:
  `claude/skills/fkit-team/SKILL.md` (lead rows ~20/51), `claude/README.md` (lead rows ~53/103),
  `claude/scaffold/CLAUDE.md` (lead skill line ~36), `ai-agents/knowledge-base/architecture.md` (the
  **skills_for_role mirror row for lead only** ~105 — leave the role-nature prose for 0115; don't clobber).
- **Extend `test/skill-ownership-hook.test.js`**: `lead` owns `fkit-sprint-ship-loop` → **allow**
  (empty stdout, exit 0); a non-lead role (e.g. coder) → **deny** (pin the `permissionDecision:"deny"` JSON
  shape, per the file's helpers). Mirror the existing `fkit-task-ship-loop` allow/deny pair.
- **Dual-home parity**: run any ADR-027 parity test if present; else `diff -rq` per `dual-home-parity.md`
  (the mechanical test may be unbuilt — I'll flag which).
**Verify:** (1) `skills-for-role.sh:37` lists it for lead only; (2) all 4 mirrors updated, checklist
satisfied; (3) hook test asserts allow-lead/deny-others w/ JSON deny pinned, suite green; (4) parity clean.

## Task 0113 — launcher menu/help text (text only)
- **`claude/fkit-claude.sh`**: lines **165** (`lead   the team room — routing help …; does no work itself`)
  and **467** (`→ team room. It routes …; it does no work itself.`) → accurate to a conductor that can
  spawn and drive the team **while keeping** routing. Review line 440 (menu item) — keep or lightly enrich; no "does no work" claim there.
- **Do NOT** change control flow / the exec line / `build_settings()` — strings only.
**Verify:** (1) no "does no work itself" for lead; conductor+routing described; (2) `git diff` = string
edits only; (3) `fkit` → 7 still opens the lead session (launcher-contract test green).

---

## Cross-cutting verification
- `node --test` full suite green after 0112 (hook test) and throughout.
- Single-home: the new skill + `skills-for-role.sh` live under `claude/` only (skills aren't in scaffold);
  `scaffold/CLAUDE.md` is the one scaffold mirror. `architecture.md` is fkit-own (not dual-homed).
- Each task reviewed by @fkit-reviewer (stateful) before its agent-close; `dashboard.sh sprint-2` clean.

## Out of scope (other briefs; named, not done)
0114/0115 (docs), 0116 (stop-hook skip set — hook not built yet), 0117 (wiki ingest). This plan is 0110–0113 only.

## Commit
None — all edits left in the working tree; the owner commits.
