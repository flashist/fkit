# Build the `fkit-sprint-ship-loop` skill (the lead's sprint-scope conductor loop)

**Source**: `ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/brief.md`
**Status**: done *(agent-closed — not owner-verified)* · ⚠️ **partly superseded by ADR-033**
**Sprint/Tag**: Sprint 2 · ID 0111 · priority 93 · owner `fkit-coder`

## Goal

Create `claude/skills/fkit-sprint-ship-loop/SKILL.md` — a lead-owned driver that ships a sprint's eligible tasks brief→closed by spawning role workers and relaying owner decisions live through the lead session.

## Key Changes

Modeled on the coder's `fkit-task-ship-loop` at **sprint scope**, re-implemented at the **driver** level so the owner channel lives in the loop, not in a spawned worker. The coder's loop stays **byte-unchanged and session-only** — the sprint loop reuses its *shape*, and is forbidden from ever invoking it (it refuses spawned invocation and could not reach the owner anyway).

The `⛔ Owner: the lead` banner, one operand (a sprint plan path; empty = active sprint) and no output-variant flags, per the one-skill-one-output convention. Selection reads the board via `dashboard.sh` rather than re-deriving status by hand; a dependency deadlock stops and reports the chain.

### The plan-gate honesty clause — required to survive into the skill text

On the orchestrated path, *"no code before the owner approves the plan"* is **prose-enforced in the worker prompt, not a runtime write-wall**. Plan mode cannot function in a spawned worker, so the loop splits it: spawn the coder **for the plan only** → driver presents it via `AskUserQuestion` → owner approves → spawn the coder **to implement**.

> The brief's binding instruction: **a later reader — human or coder — must not "fix" this into a false structural guarantee.** The skill must state plainly that this path does **not** carry plan mode's write-wall.

## Outcome

**Done, agent-closed.** Verified: the front matter and banner are present; §5.1 selection, the six-row drive table (Plan→Build→Verify→Review→Process→Close), the `DONE`/`NEEDS-DECISION`/`BLOCKED` relay envelope with *"no timer, no guess"*, the seven-row stop table and the reporting contract all landed; the honesty clause is present **as prose-enforced, not structural**, with the explicit "must not rewrite into a false guarantee" warning; close writes the agent-closed marker by default, degraded runs do not self-close, and it never self-cancels. `fkit-task-ship-loop/SKILL.md` is **byte-unchanged**.

> ⚠️ **Superseded in part by [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] (2026-07-23).** This skill was built to **ADR-032-as-first-written**, where the driver runs `/fkit-task-done` itself. ADR-033 makes the movers **producer-only**, so the loop must instead **spawn `@fkit-producer` to close**. **This task stays Done**; the revision landed via [[tasks/route-sprint-ship-loop-close-to-producer]].

Two open questions were flagged rather than blocking: whether to confirm the skill *name* before it is hard-wired in five places, and whether the general-conductor primitive is its own named skill or only ever exercised through the sprint loop.

### This build is where the design's probe #1 came back NO — and it blocked the task

The design ([[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] §13 probe 1 / §14 Q1) deferred one question: *does `/fkit-plan-task` need a spawned/return-only branch, or does the driver's spawn prompt carry it?* **The design leaned "the prompt carries it." It was wrong, and the failure was worse than the question implied.**

Codex's adversarial pass found (finding **R1**, high, verified) that `claude/agents/fkit-coder.md` makes a **spawned** coder refuse implementation outright — *"do not accept a background delegation to implement code… return the plan instead of writing code — nobody is there to approve it"* — its sole carve-out being `/fkit-task-ship-loop`, **the one skill this loop must never invoke**. So the loop's Build **and** Process-review steps could not run at all. Not fixable inside this task: it was a `fkit-coder.md` contract constraint that no filed brief owned. **The task stopped and went `🚧 Blocked — awaiting decision`** — the loop's own rule, never close work you know is not viable.

**Resolution, owner-ruled, over two rounds — and each round was a live choice between options, not a mechanical repair.** *(The two rounds use their own separate `(a)`/`(b)` option sets; the letters do **not** carry across.)*

1. **Round 1 — the authority half.** Owner approved a **declared-approval-marker carve-out** in `fkit-coder.md`, architect-vetted. Justified because the driver *does* obtain owner plan-approval by live relay before spawning the implement worker, so the refusal's own rationale (*"nobody is there to approve"*) is satisfied on this path. The rejected alternatives were the design's declined **"split" option** — which would have reversed a fresh owner ruling — and *"probe the binary first"*, **which the owner did not take.** ⚠️ That last one is worth sitting with: the fix for a failed probe was chosen **without** running the probe the design asked for.
2. **Round 2 — the consent half, and the owner overrode the coder here.** Re-review found **R4**: the round-1 carve-out authorized the **Build** worker only, so post-review fix application *still* had no authorized writer. **The coder recommended the narrower option** — have the driver relay every accepted fix for owner approval, then re-spawn a Build-type worker, explicitly *"reuses the carve-out, **no new guarantee-surface change**"*. **The owner ruled the other way**: widen the carve-out to the Process-review worker, **removing the per-fix approval gate** on that path. Architect re-vetted the framing, and its key safety point was that the wider option is nonetheless a ***smaller* surface than the Build carve-out already shipped** — same approved-plan boundary, same marker, same ADR-019 stop-on-judgment discipline; no authority expansion, only the per-fix relay removed inside a boundary Build had already been granted.

> ⚠️ **The marker is trust, not proof.** It is three prose signals in the driver's spawn prompt — caller identity, the concrete approved plan, and a statement that the owner approved it — **not a verifiable token**. It is the exact mirror of the plan-step's "write nothing yet" and carries the same accepted, prose-enforced cost. **Do not read it as a structural guarantee.**
>
> **Traceability is filed but still open:** task `0118` (record the ADR-032 amendment covering the Build + Process-review carve-out) and task `0119` (track the `fkit-coder.md` guarantee-surface change). Both are backlog. **Until 0118 lands, [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] does not record the carve-out its own drive sequence now depends on.**
>
> ✅ **Dated correction 2026-07-29 — both closed; the paragraph above is this task's record as of 2026-07-22 and is no longer current.** `0118` closed **2026-07-26** *(agent-closed — not owner-verified)* and its `## Amendment — 2026-07-22` is on the ADR-032 page in full (A1–A4). `0119` closed **2026-07-26 owner-verified**, with the agent-closed marker deliberately refused. **So the ADR does now record the carve-out its drive sequence depends on.** *(This page's Related list already said "landed 2026-07-26" — but 19 lines below this claim, which a reader reaches first. The marker is placed here for that reason.)*

### Two accepted residuals, both owner-ruled 2026-07-22 — do not re-litigate

1. ⚠️ **Sprint-loop Process-review autonomy is prose-trust.** *What:* under the declared-approval marker, the sprint-loop's **Process-review worker applies verified-`CORRECT`, in-approved-plan fixes with NO per-fix owner approval.** This is the **consent** half of the carve-out, distinct from its authority half — the marker says *who may write*; this says *which gate was removed*. `claude/agents/fkit-coder.md` is explicit that **exactly two** loops override the per-round fix gate with a **standing approval**: the coder's own `/fkit-task-ship-loop`, and this one. **Nowhere else** — an outside-a-loop spawned or pasted-in review still gates every round. *Why accepted:* it is a second per-round-gate exception mirroring ADR-019's task-loop autonomy, bounded by the same approved plan, carrying the same accepted prose-enforced cost ([[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]'s honesty clause). *Re-raise only if:* a loop-applied post-review fix is later found wrong or out-of-plan — then reconsider the autonomy itself, **do not patch the coder skill**. **"It is only prose-trust" is the named cost, not a defect** — a finding must show it failing in practice.
2. **Crash/idle stranding (R6, low).** A crash or kill mid-drive leaves the task `🔄 In progress` with no lease or recovery, and a fresh run excludes it. Accepted because fkit has **no crash-recovery anywhere** — all state is working-tree and owner-driven. *Re-raise only if:* stranded in-progress tasks become a recurring operational problem, which would scope a lease/recovery task plus an ADR.

## Related
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the contract built
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — **amends the close step**
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the honesty clause
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — hard dependency
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — what this blocks
- [[tasks/route-sprint-ship-loop-close-to-producer]] — the ADR-033 revision
- [[tasks/implement-task-ship-loop-skill]] · [[tasks/design-task-ship-loop-skill]] — the task-scope loop whose shape this reuses
- [[systems/fkit]]
- [[systems/role-locked-sessions]] — Role-Locked Sessions & the Skill Lockdown
- [[systems/testing-and-verification]] — Testing & Verification
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — task 0118: the ADR-032 amendment recording this task's R1/R4 carve-outs — **landed 2026-07-26, four days after the ruling**
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task 0119, the `fkit-coder.md` change that landed folded inside this task and was later split out for its own review
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — task 0120, the H1 house-style fix to the SKILL.md this task built
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117, whose gap analysis found the carve-out absent from the vault entirely
- [[tasks/implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop]] — `0147`, which added the Process-review row's worklog duty
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — `0150`; this skill's verbatim rule was already correct and is the primary control
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — the construction that satisfies this loop's verbatim-carry rule
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202` — the loop's `plan.md` write moved to plan approval, plus a new `## Durable artifacts` section
- [[tasks/decide-what-the-sprint-driver-does-when-a-spawned-worker-dies]] — task `0167`, which adjudicates this task's review residual **R6** as an *adjacent uncovered failure* — **not** its re-raise — and rules what the driver does when a spawned worker returns nothing
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] — task `0191`, which adds ADR-037's driver-side clause to this skill's `## Hard rules`
- [[tasks/amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction]] — task `0203`, which gives this skill's verbatim-carry rule an actual construction
- [[tasks/add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop]] — task `0208`, the tenth row in this skill's exit table — the first covering a **non-producer** spawn that does not land
