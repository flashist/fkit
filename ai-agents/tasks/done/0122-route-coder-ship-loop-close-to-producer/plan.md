# Plan — 0122: `fkit-task-ship-loop` step 9, coder self-close → route the close to the producer

**Approved by the owner** (this session, 2026-07-25) — the durable autonomy boundary for this run.

## Context

[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
reverses ADR-025: **only `fkit-producer` may run the task movers**, hook-enforced (ADR-018). ADR-033 §3
amends [ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
§Decision 5 — the coder ship-loop's terminal act is no longer a self-close.

Today `claude/skills/fkit-task-ship-loop/SKILL.md` step 9 invokes `/fkit-task-done` itself. Once task
0124 removes the coder's mover grant, that call is **hook-denied at run time** — the loop breaks. So
step 9 must be rerouted **before** 0124 lands (0122 blocks 0124).

**Intended outcome:** the loop's terminal act becomes a **producer hand-off** — it spawns
`@fkit-producer` to close — and no text in the file still claims the coder closes the task or writes the
agent-closed marker itself. ADR-019's plan gate is untouched.

**Owner decision (this session):** default = **spawn `@fkit-producer` (hop 1) to close; hand the close to
the owner only on a degraded run** (no Codex pass, red verification, unresolved residual, or a
should-be-cancelled conclusion). Matches ADR-033 §4's per-task producer spawn for the sprint loop.

## Scope — one file, prose only

**Edit:** `claude/skills/fkit-task-ship-loop/SKILL.md` (canonical source; 262 lines).

**Explicitly out of scope** (owned by other briefs — do not touch):
- `claude/skills-for-role.sh`, the four mirrors, `test/skill-ownership-hook.test.js`, the movers' own
  SKILLs → **0124**.
- `claude/agents/fkit-coder.md` lines 45 / 103 / 190 (self-close + "since ADR-025 you may invoke them")
  → **0124 item 5**, explicitly.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` → **0123**.
- `ai-agents/wiki-vault/` pages asserting the ADR-025 posture → **0126** (and the coder never writes the
  vault).

**Mirror refresh (gitignored, not a git change):** copy the edited file over
`.claude/skills/fkit-task-ship-loop/SKILL.md` so this live session's loaded copy matches canonical. That
path is gitignored (`.gitignore`: `.claude/skills/fkit-*/`) and normally refreshed by
`fkit-claude-init.sh`; a one-file `cp` avoids re-running the whole init. No scaffold copy of this skill
exists (verified: only the two paths).

## The edits, in file order

Every hit below currently asserts the ADR-025 self-close posture. Full inventory, so nothing is left
contradicting the new step 9 (brief verification step 3 requires the *whole file*, not just step 9):

1. **Frontmatter `description` (line 3)** — drop "Since ADR-025 it closes the task itself, writing the
   agent-closed marker"; replace with the producer-route terminal act. Keep it one description, keep
   "Session-only; refuses a spawned/headless invocation".
2. **The ⚠️ banner (lines 20–34)** — retitle and rewrite. New content, honestly: the loop's terminal act
   is a **producer hand-off**, not a self-close (ADR-033 §3); this restores separation of the *closing
   identity* (hook-structural) but **not** full prevention — ADR-033 §The limit keeps the extra-hop
   residual (a doer spawning a producer to close ≈ "closes its own work with an extra hop", ADR-025 §"Why
   a spawned producer is not a second judgment"). Therefore **the plan gate is still the only human
   checkpoint** — keep that force in substance, re-cited to ADR-033-as-amending-ADR-019.
3. **Overview (lines 38–46)** — "closes the task itself" → routes the close; re-cite the amendment chain
   as ADR-019 §Decision 5, amended by ADR-025 (done-gate removed) and **ADR-033 §3** (self-close →
   producer route). Add ADR-033 §Consequences' plain statement: **autonomous shipping ends at a producer
   hand-off, not a green board.**
4. **Durable state (line 94)** — "when `/fkit-task-done` (or `-cancelled`) relocates the task" → "when the
   **producer's** `/fkit-task-done` (or `-cancelled`) relocates the task". One-clause attribution fix.
5. **Loop preamble (lines 105–107)** — "the loop ships the task and closes it … may run to a green board"
   → ships the task and **hands the close to the producer**.
6. **Step 6 partial-Codex bullet (lines 142–143)** — "do not **self-close** … put the close to the owner"
   → "do not **route the close** … put it to the owner".
7. **Step 9 (lines 149–161) — the core rewrite.** New shape:
   - Terminal act: **spawn `@fkit-producer` (hop 1, no cycle)** and ask it to close the finished task — it
     runs `/fkit-task-done` on the brief. State the mover is **producer-only** (ADR-033 §1) and that a
     mover call from the coder identity is **hook-denied** (ADR-018), so the loop must never invoke it.
   - The **producer** writes `✅ Done (agent-closed — not owner-verified)` in the brief and every board row
     (ADR-033 §5 — a spawned producer is not owner-verified). The loop **does not** write it and **never**
     hand-edits a status.
   - **Confirm, then report:** after the producer returns, read state — brief in `done/`, brief `## Status`
     and sprint row read Done **with** the marker. If the close did not land (producer failed, denied, or
     partial), **⛔ STOP** and report to the owner; do not claim closed and do not patch the status by hand.
   - Keep both existing carve-outs, reworded to "route": **do not route a degraded run** (no Codex pass,
     red verification, unresolved residual → STOP, close to the owner) and **do not self-serve a cancel**
     (STOP and ask; `cancelled/` is audited by nobody).
8. **Owner-contact contract item 5 (lines 180–181)** — "A close the loop should not make itself" → "should
   not route itself".
9. **Failure table (line 218)** — the "Closed" row: trigger unchanged; action becomes finalize worklog →
   **spawn `@fkit-producer` to close** → confirm the close landed → report the close and its marker.
   Rename the state to **"Handed off to the producer → closed"** so the table stops implying a self-close.
10. **Failure table (line 224)** — "does NOT self-close" → "does NOT route the close".
11. **Invariants (lines 231–232)** — "The loop may set `✅ Done` only via `/fkit-task-done` …" → the loop
    **never** sets `✅ Done`; only the producer it routes to does, always with the agent-closed marker;
    hand-editing a status stays forbidden.
12. **Hard rules (lines 239–248)** — (a) line 239: keep "the plan gate is the ONLY human checkpoint",
    re-cite to ADR-025-as-amended-by-ADR-033 (ADR-033 does **not** restore the done gate, so the substance
    is unchanged); (b) lines 243–245: "You may close the task; you may not cancel it" → **"You close
    nothing yourself"** — the movers are producer-only and hook-denied to you; you route the close to a
    spawned producer, and a **cancel** always stops for the owner; (c) lines 246–248: "Never close a
    degraded run" → "never **route** a degraded run".

**Style constraints:** match the file's existing voice and density (bold-lead bullets, `⛔ STOP` markers,
ADR links at the same relative depth). No structural reorganization, no renumbering of the nine steps, no
new sections. Minimal diff — only the hits above.

## Verification

Prose-only change, so verification is a walk of the brief's four criteria plus a no-regression run:

1. `grep -n "fkit-task-done" claude/skills/fkit-task-ship-loop/SKILL.md` — every remaining hit must be a
   *producer-invokes-it* or *never-invoke-it* statement; **zero** coder invocations (brief step 1).
2. `grep -niE "self-clos|closes the task itself|writes the agent-closed marker" …` — no surviving claim
   that the coder closes or writes the marker (brief step 3).
3. Read step 9 end-to-end: it spawns `@fkit-producer` (or routes to the owner) and says so (brief step 2);
   step 3's plan gate and steps 1–8's control flow are unchanged apart from the listed prose hits (brief
   step 4 — confirm with `git diff` reviewed hunk by hunk).
4. `node --test test/` — full suite green (ADR-014, zero devDeps). No test asserts this SKILL's prose
   (checked: only `task-id-uniqueness`, `dashboard-contract`, `skill-ownership-hook` read SKILL text, none
   of it this file), so this proves *no regression*, not the change itself — say so, do not overclaim.
5. `diff claude/skills/fkit-task-ship-loop/SKILL.md .claude/skills/fkit-task-ship-loop/SKILL.md` —
   identical after the mirror refresh.
6. `git status` — only the one tracked file modified (plus this task folder's `plan.md` / `worklog.md`).
   **No commit.**

Then: `@fkit-reviewer` `/fkit-stateful-review` on the working tree, task-id
`0122-route-coder-ship-loop-close-to-producer`, hop 1.

## Risks / edge cases

- **Self-referential edit.** The coder is editing the skill it is currently running, in the loop that
  skill defines. The live instructions are the **old** `.claude/` copy — the mirror refresh makes them
  agree, but **this run still executes the pre-edit contract**: at step 9 the loop follows the *new* rule
  (spawn the producer) because the approved plan says so, not because the loaded prompt does. Called out
  so the report is honest about which contract governed this run.
- **This run's own step 9 is a live test of the change.** Closing 0122 exercises the producer route — and
  the coder *still holds* the mover grant until 0124, so a mistaken self-close would silently succeed
  rather than being hook-denied. Route to the producer regardless.
- **Sequencing pressure, not a blocker.** 0122 must land before 0124 (brief Notes). Nothing to do here
  beyond not touching 0124's files.
- **Contradiction remains after this task.** `claude/agents/fkit-coder.md` (lines 45/103/190) will still
  assert the coder self-closes — that is 0124 item 5's scope, and it is a **system prompt** that outranks
  a SKILL in the coder's context. This task cannot fully remove the contradiction; the worklog names it as
  a residual with its owning brief rather than papering over it.
- **`AGENTS.md` / `CLAUDE.md` rules block** — untouched (`claude/scaffold/universal-rules.md` is 0124's;
  it also feeds 0130's byte budget). No byte-budget impact from this task.

## Open questions

None outstanding — the one design choice (spawn the producer vs. hand to the owner) was decided by the
owner this session: spawn, with degraded runs stopping.
