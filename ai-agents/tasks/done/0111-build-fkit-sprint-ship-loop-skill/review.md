# Review — 0111-build-fkit-sprint-ship-loop-skill

Task: ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/brief.md
File(s) under review: claude/skills/fkit-sprint-ship-loop/SKILL.md
Status: closed-out — 3 rounds, converged. R1/R2/R3/R4/R5/R7/R8 resolved; R6 + Process-review-autonomy accepted residuals (owner-ruled). FULL model-diverse coverage every round.

Round 3 reviewers: Claude (fidelity + rendezvous + convergence pass) + Codex (adversarial, model-diverse,
succeeded first try). **Full coverage — model-diverse.** Round-3 verifies the R4 (option-b widening) / R5
resolutions + R6 residual, and hunts new consequences of the R4 fix.

Reviewers this round: Claude (fidelity + internal-consistency pass) + Codex (adversarial, model-diverse,
succeeded after one 2m timeout + retry). Full coverage — model-diverse.

Round 2 reviewers: Claude (fidelity + rendezvous + regression pass) + Codex (adversarial, succeeded
first try). Full coverage — model-diverse. Round-2 verifies the R1/R2/R3 resolutions and hunts new
defects the fixes introduce.

## Reviewer findings
| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | claude/skills/fkit-sprint-ship-loop/SKILL.md:88,91 | Drive sequence spawns `@fkit-coder` to **implement** (Build) and to **apply fixes** (Process-review), but `fkit-coder.md:27-32` makes a spawned coder **refuse** implementation ("return the plan instead of writing code — nobody is there to approve it"); the sole autonomy carve-out is `/fkit-task-ship-loop` (`fkit-coder.md:38-49`), which this skill must NOT invoke. No task in the design plan (§4.2 / §11) updates `fkit-coder.md`. As the system stands, the loop's Build step cannot run. This is design §13 probe #1 / §14 Q1 resolved to NO. |
| R2 | 1     | medium | claude/skills/fkit-sprint-ship-loop/SKILL.md:138-140,149 | Rejected-plan task stays `🔲 Backlog` (line 149), but step-5 Advance (139-140) re-derives the eligible set with **no per-run skip memory** — so the just-rejected task is still eligible and gets re-selected/re-planned, contradicting line 149's "move to the **next** eligible task". Bounded only by owner patience, not by the contract. (The Blocked exits are fine — they flip status and drop out of the set; only the rejected path leaves status unchanged.) |
| R3 | 1     | low    | claude/skills/fkit-sprint-ship-loop/SKILL.md:88 | No step flips the in-flight task to `🔄 In progress` in the brief `## Status` + sprint row; it stays `🔲 Backlog` through plan/build/verify/review — including the owner-idle windows (122-123). The invariant at 156-157 covers **exits** only. So a mid-run `/fkit-status` (or a concurrent driver, which line 75 says should treat `🔄 In progress` as "someone else owns it") sees the task as untouched/eligible; nothing is durable on crash/resume. Shared omission with design §5 (not skill-introduced). |
| R4 | 2     | high   | SKILL.md:99,111 + claude/agents/fkit-coder.md:48-49,53-68 | **R1's Process-review half is not resolved.** The Build carve-out authorizes source-writes for the **Build worker** only. But the loop's **Process-review** spawn (§2 row line 99) applies `fkit-process-stateful-review`, and line 111 ("re-verify after any **post-review code change**") assumes that spawn writes source — yet it is NOT the Build worker, carries no "approved plan", so `fkit-coder.md:66-68` makes it **refuse** ("everything else still refuses"). No re-Build step is defined to apply approved fixes. **Two contradictions:** (a) no authorized writer for post-review fixes; (b) the SKILL's Process-review owner-gate stops only for *judgment calls* (line 99), but `fkit-coder.md:48-49` says outside the task-ship-loop the "explicit approval **every round**" fix gate is **byte-unchanged and still in force** — so ordinary CORRECT defect fixes get neither owner approval nor a writer. A task with any valid review defect stalls (worker refuses) or the worker writes in violation of its contract. Raised by **both** reviewers (Claude + Codex #1). |
| R5 | 2     | medium | SKILL.md:88-91,164,171 | **Regression introduced by the R3 fix.** §2 now marks the task `🔄 In progress` at start of driving. But the *Plan rejected* exit (line 164) says the task "**stays** `🔲 Backlog`" — stale wording from before R3: the task is no longer Backlog, it is In progress. A literal driver treats "stays Backlog" as *no status write* and leaves it `🔄 In progress`. §1 promises "a later invocation reconsiders" plan-rejected tasks (line 79), but a later run (empty skip set) **skips `🔄 In progress`** (line 75) → the task is **stranded, never reconsidered**. Fix: the plan-rejected exit must **explicitly reset In progress → Backlog** in both files (not "stays"). The invariant (171) says exits write accurate status but line 90 calls it a "terminal" status — Backlog is not terminal, so it is not clearly covered. Raised by **both** (Claude + Codex #2). |
| R6 | 2     | low    | SKILL.md:74-79,88-91 | **Crash/resume stranding — consequence of the R3 marking.** The task is set `🔄 In progress` before the Plan worker + owner gate (which can idle indefinitely awaiting owner approval, lines 136-137). If the session crashes/is killed mid-drive, no terminal exit runs; the status stays `🔄 In progress`. A fresh invocation has an empty skip set but still **excludes `🔄 In progress`** (line 75) — no lease, heartbeat, or stale-task recovery exists — so the task is stranded, contradicting §1's "a later invocation reconsiders them" (line 79). Likely an **accepted operational limit** (fkit has no crash-recovery anywhere; all state is working-tree + owner-driven) — flagged for the owner to dispose as frontier-move vs defect. Codex #3; Claude concurs on the coherence gap with §1. |
| R7 | 3     | medium | SKILL.md:168,173,158-160 | **New — false/ambiguous "Sprint shipped" terminal state.** When a plan is rejected the task is reset `🔲 Backlog` + added to the per-run skip set (R5/R2 design); step-5 re-derivation (minus skip set) then goes empty with that task still `🔲 Backlog`. Stop-table **"Sprint shipped"** (168) fires on *"every eligible task closed, last verify green"* → reports the whole sprint shipped though a deferred task remains open; and it **collides with "Dependency deadlock"** (173: *"eligible empty, backlog remains"*) — neither exit cleanly fits a plan-rejected-and-deferred backlog. Contradicts the loop's own honesty thesis (no false completion; ADR-031) and the §5.5 roll-up, which must still list that task **pending**. Consequence of the **round-2** skip-set/Backlog-reset fix, first surfaced this round (NOT of the R4 change). Raised by **Codex #1**; Claude verified & concurs. Non-blocking (owner is present at the rejection; roll-up still lists it pending) but a real reporting-honesty defect. Fix: a terminal state distinguishing *"all eligible driven; N deferred this run remain — re-run to reconsider"* from a true full-sprint ship, disambiguated from the deadlock exit. |
| R8 | 3     | low    | SKILL.md:112-115 vs 104-109; fkit-coder.md:62,82-89 | **New — Process-review spawn-prompt marker asymmetry (fail-safe).** `fkit-coder.md:62` requires the declared-approval marker (**all three** signals a/b/c) for the **Process-review** worker equally with Build, and *"everything else still refuses"* (82-89). But the SKILL's **explicit** *"spawn prompt MUST carry the plan verbatim + owner-approved statement + caller id"* construction rule (104-109) names **only the Build spawn prompt / "build carve-out"**; the Process-review rule (112-115) references *"the declared-approval marker"* without instructing the driver to construct the Process-review prompt with the three signals. A literal driver could mark Build only → the Process-review worker refuses to write → **over-relays every fix as `NEEDS-DECISION`** (fail-safe: no leak, no silent stall), defeating option (b)'s benefit. Repeats R1's implicit-authority pattern in miniature. Claude finding; Codex ruled rendezvous CLEAN but did not probe the Process-review prompt construction specifically. Non-blocking. Fix: a parallel one-line *"the Process-review spawn prompt MUST also carry the declared-approval marker"* rule. |

## Coder response
<!-- CODER-owned. Reviewer does not write here. -->
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CONFIRMED** — verified against `fkit-coder.md:29-32`: a spawned coder "Do not accept a background delegation to implement code… return the plan instead of writing code — nobody is there to approve it," sole exception `/fkit-task-ship-loop` (`:38`) which this skill must not invoke. The loop's Build/Process-review steps cannot run as designed. This is design §13 probe #1 / §14 Q1 resolving to NO. | Defect (feasibility) — **new architecture/scope decision** | **NOT fixable in 0111** (it's a `fkit-coder.md` contract constraint, out of 0110/0111 scope, no planned task covers it) → **STOP for the owner.** Task set `🚧 Blocked — awaiting decision`. My recommendation: option (a) — a `fkit-sprint-ship-loop` carve-out in `fkit-coder.md` mirroring the task-loop exception, justified because the driver **does** obtain owner plan-approval (via live relay) before spawning the implement worker, so the refusal's own rationale ("nobody there to approve") is satisfied. Needs owner ruling + likely a new brief + possibly an architect consult / ADR note. | **blocked — owner decision** |
| R2 | CONFIRMED — verified: step-5 Advance re-derives the eligible set with no per-run skip memory, so a plan the owner rejected (task stays `🔲 Backlog`) is re-selected, contradicting line 149's "next eligible task". | Defect (contract gap) | **Fix ready, pending R1** — add a per-run "attempted/rejected this run" skip set so re-derivation excludes a just-rejected task. Small in-file prose fix; I'll apply on the owner's go (bundled with R1's resolution, since R1 may reshape the drive loop). | pending owner |
| R3 | CONFIRMED | Defect (state hygiene) | **FIXED** — SKILL §2 now marks the in-flight task `🔄 In progress` (brief + sprint row) at the start of driving; §1 skips `🔄 In progress`. (Round 2 found this introduced R5 — see below.) | resolved |

**Round-1 resolution (owner ruled option (a), architect-consulted):**
- **R1 → FIXED.** Owner approved a `fkit-coder.md` carve-out (2026-07-22); fkit-architect vetted the framing (hop 1). Two coordinated edits: `fkit-coder.md:51-68` — a **declared-approval-marker** carve-out (three signals: caller=`fkit-sprint-ship-loop`, concrete plan, owner-approved-via-AskUserQuestion; else refuses; plan-bounded scope; trust-not-proof, same accepted prose cost); `SKILL.md:103-108` — the matching Build-prompt rule. Safety preserved (non-loop + plan-only spawns still refuse). Verdict: resolved (Build half).
- **R2 → FIXED.** SKILL §1 per-run skip memory + §5 re-derive-minus-skip-set.

## Coder response — round 2
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R4 | **CONFIRMED** — verified: my R1 carve-out authorizes the **Build** worker only; the **Process-review** fix-application spawn was "everything else" → refused, and `fkit-coder.md:48-49` kept per-round fix approval in force outside the task-ship-loop. | Defect (feasibility + consent-model) — owner's call | **FIXED — owner ruled option (b)** (widen the carve-out; 2026-07-22), fkit-architect re-vetted the framing (same consult, hop 1). `fkit-coder.md`: the second exception now covers **both** the Build **and** Process-review workers under the declared-approval marker; the Process-review worker applies verified-`CORRECT`, in-approved-plan fixes autonomously on **ADR-019's discipline**, `NEEDS-DECISION` for judgment calls. `:48-49` amended to name **both** autonomy loops (task + sprint) as per-round-gate exceptions while keeping the gate everywhere else. SKILL Process-review row + re-verify rule updated to match. Architect's key safety point: **(b) is a *smaller* surface than the Build carve-out already shipped** — same approved-plan boundary + declared-approval marker + ADR-019 stop-on-judgment discipline; no authority expansion, only per-fix relay removed inside a boundary Build already granted. | resolved (option b) |
| R6 | CONFIRMED (frontier) — crash/idle stranding. | Frontier-move | **Accepted residual — owner ruled (2026-07-22): accept**, matching fkit's no-crash-recovery posture everywhere. Recorded below. | accepted residual |
| R5 | CONFIRMED — regression my R3 fix introduced: plan-reject exit said the task "stays 🔲 Backlog" but R3 marked it `🔄 In progress` → stranded. | Defect (regression) | **FIXED** — plan-reject exit now **resets `🔄 In progress` → `🔲 Backlog`** (both files) + adds to the skip set (`SKILL.md:164`); the R3 note reworded so Backlog is a valid non-terminal exit status. Mechanical, in-plan → applied autonomously. | resolved |
| R6 | CONFIRMED (frontier) — crash/idle mid-drive leaves the task `🔄 In progress` with no lease/recovery; a fresh run excludes it. | Frontier-move | **Recommend accept as residual** — fkit has **no crash-recovery anywhere** (all state is working-tree + owner-driven); a lease/heartbeat is new scope + an ADR. Owner to dispose (see relay). | owner disposition |

### Coder response — round 3
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R7 | CORRECT — verified: "Sprint shipped" would fire while a plan-rejected-and-deferred task remains `🔲 Backlog`, falsely reporting a full-sprint ship (a reporting-honesty defect, ADR-031) and colliding with "Dependency deadlock". Consequence of the round-2 skip-set fix, not R4. | Defect (reporting-honesty) | **FIXED** — added a distinct terminal state **"Sprint drained — deferred remain"** (report deferred tasks as `pending` — re-run to reconsider; NOT a full-sprint ship, NOT a deadlock), and tightened "Sprint shipped" to **every eligible task CLOSED, none deferred**. Mechanical, in-plan → applied autonomously. | resolved |
| R8 | CORRECT — verified: the "spawn prompt MUST carry the marker" rule was Build-only; the Process-review spawn also needs it (`fkit-coder.md` requires it for both). Fail-safe (over-relays) but a real doc-completeness gap. | Defect (rendezvous doc) | **FIXED** — the rule now covers **both** the Build and Process-review spawn prompts (`SKILL.md:104`). Mechanical, in-plan → applied autonomously. | resolved |

**Coder note (round 3 — CONVERGED):** every finding resolved or owner-dispositioned. R1 (carve-out) /
R2 / R3 / R5 fixed; **R4 fixed via owner-ruled option (b)** (widen the carve-out), fkit-architect-vetted,
reviewer round-3 confirmed **clean and converging** (severity fell high→high→medium/low across rounds).
R6 = accepted residual (owner: accept). R7/R8 = small mechanical in-plan CORRECT fixes, applied
autonomously (reviewer recommended act-then-closeout; not re-reviewed to avoid recursion on trivial prose).
`fkit-task-ship-loop` byte-unchanged; full suite 451/0. **0111 ready to close (agent-closed).**
**Named follow-ups (not 0111's, not self-done):** a **combined ADR-032 amendment** recording the
Build carve-out + Process-review autonomy (a second per-round-gate exception, mirroring ADR-019) with the
accepted cost + do-not-re-raise guard (architect-in-session, owner-signed); and a **producer brief**
tracking the `fkit-coder.md` carve-out. Both are traceability for a made decision — the edits ship now (architect ruled).
## Accepted residuals (shared, do-not-re-litigate)
<!-- Added only on the owner's disposition. -->
- **Sprint-loop Process-review autonomy is prose-trust (R4/option b, owner-ruled 2026-07-22)** — *What:*
  the sprint-loop Process-review worker applies verified-`CORRECT`, in-approved-plan fixes without per-fix
  owner approval, under the declared-approval marker; *Why (structural):* it is a **second** per-round-gate
  exception mirroring ADR-019's task-loop autonomy, bounded by the same approved plan the Build worker uses
  (no authority expansion — a *smaller* surface than the Build carve-out), the same accepted prose-enforced
  cost (ADR-031 honesty clause); *Re-raise only if:* a loop-applied post-review fix is later found wrong or
  out-of-plan (then reconsider the Process-review autonomy — do not patch the coder skill). **"It is only
  prose-trust" is the named cost, not a defect** — a finding must show it failing in practice.
- **Crash/idle stranding of an in-flight `🔄 In progress` task (R6, owner-ruled 2026-07-22: accept)** —
  *What:* a crash/kill mid-drive leaves the task `🔄 In progress` with no lease/recovery; *Why (structural):*
  fkit has **no crash-recovery anywhere** — all state is working-tree + owner-driven; *Re-raise only if:*
  stranded in-progress tasks become a recurring operational problem (then scope a lease/recovery task + ADR).

## Suppressed as settled (this round — not re-raised)
- "The orchestrated plan gate is only prose, not a write-wall" — settled, ADR-031 honesty clause /
  ADR-032 D7; re-raise only on evidence it **fails in practice**. The skill states it correctly (48-49,
  58-62) — NOT a finding.
- "lead is a router that does no work" — reversed, ADR-031.
- "the sprint loop should just call `fkit-task-ship-loop`" — infeasible, ADR-032 records why.
- "add a timeout so it doesn't block" — declined, ADR-024.
- "agent-closed marker invisible in `/fkit-status`" — accepted amplification, ADR-032 §Consequences /
  ADR-025 §A3.

## Suppressed as settled (round 3 — not re-raised)
- **Crash/kill mid-drive strands a `🔄 In progress` task** — Codex #2 re-raised it; **already accepted
  residual R6** (owner-ruled 2026-07-22: accept; fkit has no crash-recovery anywhere). Re-raise only if
  stranded in-progress becomes a recurring operational problem. Suppressed.
- **R4 rendezvous / safety / authority-boundary** — Codex #3–6 ruled CLEAN; Claude concurs:
  fkit-coder.md:61-89 authorizes **both** Build and Process-review workers under the same three-signal
  marker; the Process-review write surface is a **strict subset** of Build's (in-plan CORRECT mechanical
  fixes only; out-of-plan → `NEEDS-DECISION`), same approved-plan boundary, same marker. Architect's
  **"(b) is a smaller surface than Build" claim is TRUE** — no authority expansion. The `:48-56` amendment
  names both loops as exceptions and closes with *"Nowhere else … still gates every round"* — no non-loop
  spawned/pasted review escapes the per-round gate. **Verified resolved, not re-raised** (R8 is a separate,
  smaller SKILL-side construction gap, not an authority defect).
