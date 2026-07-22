# Worklog — 0111 build the fkit-sprint-ship-loop skill

Ship-loop (consolidated 0110–0113 plan, approved 2026-07-22). `plan.md` is the boundary.

## Owner-decision log
- **Plan gate:** skill name = `fkit-sprint-ship-loop` (confirmed); general conductor = prompt-only (0110), so
  this skill is the only *named* procedure. Owner approved the consolidated plan.

## Change surface
- NEW `claude/skills/fkit-sprint-ship-loop/SKILL.md` — the §5 driver contract + §6.3 front matter + `⛔ Owner: the lead` banner.
- Source of truth: design report §5/§5.1-5.5/§6.1-6.3 + ADR-032 + ADR-031 honesty clause.

## Progress
- [x] Plan approved, persisted; status → 🔄 In progress
- [x] Write SKILL.md (§6.3 front matter + banner; §5.1-5.5; honesty clause; close posture; hard rules)
- [x] Verify — all green
- [x] Review — 3 rounds, FULL model-diverse coverage every round; CONVERGED
- [x] Re-verify after each fix — suite 451/0
- [x] Close — agent-closed

## Final resolution (converged after 3 review rounds + 2 architect consults)
- **R1** (spawned coder refuses to implement) → owner option (a) carve-out → widened to **(b)** (see R4).
- **R2** (rejected task re-selected) → per-run skip memory.
- **R3** (in-flight not marked In progress) → mark `🔄 In progress` at start of driving.
- **R4** (post-review fixes need a writer + consent path) → owner option **(b)**: widen the carve-out so the
  Process-review worker applies verified-`CORRECT`, in-approved-plan fixes autonomously on ADR-019's
  discipline; `fkit-coder.md:48-49` amended to name both autonomy loops. fkit-architect vetted (twice);
  round-3 review confirmed clean + converging. Architect's safety key: **(b) is a smaller surface than the
  Build carve-out** (same approved-plan boundary, no authority expansion).
- **R5** (plan-reject stranding, a regression from R3) → reset `🔄 In progress` → `🔲 Backlog` + skip-set.
- **R6** (crash-stranding) → **accepted residual** (owner: accept; fkit has no crash-recovery anywhere).
- **R7** (false "Sprint shipped" when a task is deferred) → distinct "Sprint drained — deferred remain" state.
- **R8** (marker rule Build-only) → rule now covers both Build + Process-review spawns.

## Codex coverage
FULL / model-diverse on all three review rounds.

## Files touched / change surface
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` (new) — the §5 driver contract.
- `claude/agents/fkit-coder.md` (M) — the R1/R4 declared-approval-marker carve-out (Build + Process-review) + `:48-49` amendment. *(Owner-approved out-of-original-brief resolution; architect-vetted.)*
- `.claude/` copies of both synced (gitignored). `fkit-task-ship-loop/SKILL.md` **byte-unchanged**.
- Loop bookkeeping: 0111 brief status, sprint-2 row, plan.md, worklog.md, review.md.

## Brief `## Verification steps` — walked
1. ✅ Skill exists with §6.3 front matter + `⛔ Owner: the lead` banner.
2. ✅ Implements §5.1 (dashboard.sh selection), §5.2 drive sequence, §5.3 live-relay, §5.4 stop table, §5.5 reporting.
3. ✅ Plan-gate honesty clause present as prose-enforced, not structural.
4. ✅ Close = agent-closed by default; degraded → stop; never self-cancel.
5. ✅ `fkit-task-ship-loop/SKILL.md` unchanged.

## Named follow-ups (NOT 0111's — flagged, not done)
- **Combined ADR-032 amendment** — record the Build carve-out + Process-review autonomy (a second per-round-gate
  exception mirroring ADR-019) with the accepted cost + do-not-re-raise guard. **Architect-in-session, owner-signed.**
- **Producer brief** tracking the `fkit-coder.md` carve-out (guarantee-surface change, deserves its own reviewable unit).
- These are traceability for a **made** decision (owner ruled a→b; architect vetted) — the edits ship now regardless.

## Commit state
- Nothing committed. All edits in the working tree for the owner.

## ⛔ Blocked — awaiting owner decision (R1)
The skill is a faithful rendering of design §5 / ADR-032 (both reviewers confirm; the critical plan-gate
honesty clause passed). But Codex's adversarial pass surfaced a **feasibility gap the design deferred as a
probe** (§13 #1 / §14 Q1), now **confirmed**:

- **R1 (high, CONFIRMED):** the loop's Build/Process-review steps spawn `@fkit-coder` to *implement*, but
  `fkit-coder.md:29-32` makes a **spawned** coder **refuse** implementation ("return the plan instead of
  writing code — nobody is there to approve it"); the only carve-out is `/fkit-task-ship-loop`, which this
  skill must not invoke. **So the loop cannot build as designed.** Not fixable in 0111 — it needs a
  `fkit-coder.md` change (out of 0110/0111 scope, no planned task) or a design reconsideration → **owner/architect decision.**
- **R2 (medium):** rejected-plan task is re-selected by re-derivation (no skip memory). Small in-file fix, ready.
- **R3 (low):** in-flight task never marked `🔄 In progress`. Small in-file fix, ready.

**Coder response written to `review.md`. R2/R3 fixes prepared but held** — R1's resolution may reshape the
drive loop, so applying them now risks rework. **0111 is NOT self-closed** (blocked/degraded — the loop's
own rule: never close work you know is not viable).

## Round 2 (2026-07-22) — R1 resolved, re-review found R4/R5/R6
- **R1 → FIXED** via owner-approved option (a): a declared-approval-marker carve-out in `fkit-coder.md:51-68`
  (fkit-architect-vetted, hop 1) + a matching Build-prompt rule in the SKILL. Build half now runs; safety preserved.
- **R2, R3 → FIXED** (skip memory; mark In progress first).
- **Re-review (round 2, full model-diverse):**
  - **R4 (high) — still blocked, owner's call.** The carve-out authorized the **Build** worker only; the
    **Process-review** fix-application spawn still refuses (it's "everything else"), and `fkit-coder.md:48-49`
    keeps per-round fix approval in force outside the task-ship-loop. So post-review fixes have no authorized
    writer + the SKILL's "stop only for judgment calls" is wrong here. **Recommend option (a):** driver relays
    every accepted fix for owner approval → re-spawns a Build-type worker with the approved fix (reuses the
    carve-out, no new guarantee-surface change). Needs owner ratification + a SKILL edit.
  - **R5 (medium) → FIXED** — regression my R3 fix introduced (plan-reject left task stranded In progress);
    now resets to Backlog + skip-set. Applied autonomously.
  - **R6 (low, frontier) — recommend accept as residual** (fkit has no crash-recovery anywhere).

## Recommended R1 resolution (for the owner)
**Option (a):** add a `fkit-sprint-ship-loop` carve-out to `fkit-coder.md`, mirroring the existing
`/fkit-task-ship-loop` exception. **Justified:** the sprint-loop driver *does* get owner plan-approval (via
live `AskUserQuestion` relay) **before** spawning the implement worker, so the refusal's own rationale
("nobody is there to approve") is satisfied on this path. Likely needs a new brief (producer) + an
architect consult / ADR-032 note. Alternatives: (b) re-scope to keep implementation in a `fkit coder`
session (the design's declined "split" option — reverses a fresh owner ruling); (c) probe the binary first.

## Files touched (in the working tree, uncommitted)
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` (new, `.claude/` synced) — complete and faithful; the
  gap is external (fkit-coder.md), not in this file.
- Loop bookkeeping: 0111 brief status (Blocked), sprint-2 row, plan.md, worklog.md, review.md.

## Commit state
- Nothing committed. The skill file stands; it becomes *runnable* only once R1 is resolved and 0112 wires ownership.

## Verification evidence
- V1: front matter (name/description) + `# ⛔ Owner: the lead` + blockquote banner present.
- V2: §5.1 (dashboard.sh selection, eligible=Backlog+deps-Done, deadlock-stop), §5.2 (6-row drive table
  Plan→Build→Verify→Review→Process→Close), §5.3 (DONE/NEEDS-DECISION/BLOCKED envelope + AskUserQuestion +
  "no timer, no guess"), §5.4 (7-row stop table), §5.5 (per-task + sprint roll-up + Codex-coverage).
- V3: honesty clause present as **prose-enforced, NOT a runtime write-wall** (lines 48-49) + "must not
  rewrite into a false structural guarantee" (line 61).
- V4: close writes agent-closed by default (92/129/178); degraded → do not self-close; never self-cancel.
- V5: `fkit-task-ship-loop/SKILL.md` **byte-unchanged** (no git status entry). `.claude/` synced.
