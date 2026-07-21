# Design: timeout-auto-proceed for the ship-loop's owner questions

- **Date:** 2026-07-18
- **Author:** fkit-architect (feasibility corroborated by an fkit-coder runtime consult, hop 1)
- **Task:** [`design-ship-loop-timeout-auto-proceed.md`](../../tasks/cancelled/0028-design-ship-loop-timeout-auto-proceed/brief.md) (Sprint 2, #59)
- **Status:** ⚰️ **CLOSED — feature will NOT be built (owner decision, 2026-07-18; recorded as [ADR-024](../decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md)).** The investigation established that a timed auto-proceed *is* feasible — via Claude Code's AFK-mode timeout (`askUserQuestionTimeout`, confirmed real on the installed binary **2.1.214**), scoped to a dedicated ship-loop launch with the plan/done gates expressed as plain waits so the session-global timer never fires on them. **The owner weighed it and decided the added launch-mode complexity + reliance on a session-global, user-scope timer are not worth it.** The ship-loop stays as-is. Retained as the record of what was weighed. Task 59 cancelled; task 60 not created.
- **~~Blocks:~~** task 60 (implementation) — **not created** (feature declined).

> **Correction on the record (2026-07-18):** §1's original verdict — "the 30s timer is not runtime-expressible" — was **wrong.** It reasoned from the turn model + the per-call tool schema (which genuinely has no `timeout` param) and **missed the settings-level AFK timeout** (`askUserQuestionTimeout`, verified present in `~/.claude/settings.json` on binary 2.1.214, default `"never"`; env vars `CLAUDE_AFK_TIMEOUT_MS` / `CLAUDE_AFK_COUNTDOWN_MS`). A timed auto-proceed **is** expressible. This is the exact "measure the binary, don't reason it" lesson (ADR-021 precedent). The feature was declined on **cost/complexity grounds**, not on feasibility — the constraints (session-global timeout, user-scope-only setting, on-timeout picks the *pre-selected* option, and the report's own "never short-timeout a high-stakes gate" guidance) made the safe version more machinery than the benefit justified.

---

## Summary — the literal ask is not buildable; the honest substitute is

**The owner asked:** when the ship-loop asks a mid-loop question, present options with one *recommended*, and if the owner is silent for ~30s, **auto-proceed on the recommended option.** He said *"if possible."*

**It is not possible — and this is the load-bearing finding.** Claude Code is **turn-based**: when the model asks a question and yields the turn, control **blocks on the next human message.** There is **no ambient wall-clock timer** that re-invokes the model "30 seconds later" on silence — silence is not an event the runtime acts on. `AskUserQuestion` (session-only, ADR-021) has **no timeout / default-on-no-response parameter** — it blocks until the human picks. No hook, background process, or setting expresses a timed auto-continue (hooks fire on *events*, not idle-timeouts that resume a turn; a backgrounded process has no channel to answer for the owner). **A "wait 30s, then proceed on the default" is not expressible in the runtime.**

**Recommended substitute — needs no timer:** an **up-front, per-run grant** at the plan-gate. The owner says once, at loop start: *"for class-X mid-loop questions, proceed on the recommended default and log it."* This moves the decision to a point where a *decision actually exists* (a human turn), converts the relevant stops into **logged autonomous choices with an audit trail**, and — crucially — is **consistent with ADR-019 rather than a new autonomy model**: the loop already proceeds without asking on an *"obvious winner within plan intent"*; a recommended-default-under-grant is that same rule, made explicit for a named question-class and logged.

**Gate scope (hard rulings):** the **done-gate (P6) is excluded — always** (auto-advancing "mark it done" routes around the owner-invoked `/fkit-task-done` mover, a universal hard rule D1 preserved). The **plan-gate (P1) is excluded by default** (ADR-019's one unremovable checkpoint). The **mid-loop "important questions"** are the only eligible class.

---

## 1. Feasibility — settled by runtime-architecture analysis + coder consult (method, result, honesty)

Per [`evidence-before-assertion`](../conventions/evidence-before-assertion.md), the claim level is stated exactly:

- **Method:** analysis of the Claude Code turn model + the `AskUserQuestion` tool schema, corroborated by an fkit-coder runtime consult (2026-07-18).
- **Result:** a timed auto-proceed is **not expressible**. (1) Turn-based, no ambient timer that resumes on silence. (2) `AskUserQuestion` has no timeout/default-on-silence mode. (3) No hook/background/setting mechanism can synthesize the owner's answer or advance a yielded turn on a wall-clock deadline.
- **Honesty caveat — stated, not buried:** this is a **strong negative from runtime knowledge**, consistent with the turn-based design and the `AskUserQuestion` schema — but I did **not** run a 30-second-silence experiment against the binary, and a *truly exhaustive* "there is no hidden/undocumented setting" would require one. Treat this as **"no known mechanism, and none consistent with the turn model,"** not a byte-level proof. **It does not change the recommendation:** the substitute (§2) needs no timer, so it is correct whether or not an obscure timer is ever discovered — and if one *is* later found, this design is a clean superset (the grant still applies). **Claude Code version:** not pinned from inside the session; items 1–3 are architectural properties stable across versions, not a version-specific behavior like ADR-021's `TOOL_ABSENT`. *(If the owner wants the ADR-021-grade binary probe on record before task 60, that is a small experiment I recommend the coder run against the binary and append here — but it is not on the critical path for the recommendation.)*

**Why this matters for the framing:** the owner's "~30s then proceed" is a UX intuition imported from chat UIs. The spec **records explicitly that it is not runtime-expressible**, so it is not re-proposed later (the ADR-021 / `--append-system-prompt` tombstone discipline).

## 2. The recommended mechanism — the up-front per-run grant

At the **plan-gate** (where the owner is already present and approving), the loop offers a grant:

> *"For mid-loop questions of class X (verify-budget top-ups, low-stakes review-judgment calls, non-convergence retries), may I proceed on the option I mark **recommended** and log each choice? [grant / withhold]"*

- **If granted:** each eligible mid-loop question, instead of stopping, is **answered by the loop on the recommended option** and **written to the worklog decision-log** — same audit shape ADR-019 already requires for an "obvious winner" (spec §6.1). Every auto-picked default is captured; none is silent.
- **If withheld:** the loop behaves exactly as today (it stops and waits — no regression).
- **Genuine judgment-calls / frontier-moves are excluded from the grantable class** even under the grant — the grant covers *option-picking with a dominant default*, not *should we change direction*.

**The 30s value:** there is **no timer to set** — the grant replaces the timeout entirely. *(If the owner nonetheless wants a knob, the only timer-shaped thing that is expressible is a per-run configurable grant scope, which is an **operand, not an output variant** — fine under one-skill-one-output; but a *time* value has nothing to attach to.)*

**Two alternatives the coder flagged, worth the owner's eye (both zero new autonomy):**
- **Batch-and-defer:** accumulate non-blocking mid-loop questions and surface them **together at the existing done-gate**, instead of auto-answering — turns many small stops into one owner interaction, expands autonomy by *nothing*. A conservative alternative to the grant.
- **Tighten the "obvious winner" boundary** in the skill so fewer of these become stops at all. This may be the *real* fix: if the owner's complaint is mid-loop stalls on low-stakes choices, some of that class is arguably something ADR-019 already licenses the loop to proceed through. Cheapest of all, and it narrows what the grant even needs to cover.

## 3. Gate scope — explicit rulings (the safety core)

| Gate | Disposition | Why |
|---|---|---|
| **Done-gate (P6)** | **EXCLUDED — hard, not negotiable** | Auto-proceeding "mark it done" routes around the **owner-invoked `/fkit-task-done` mover** — a universal hard rule **D1 deliberately preserved** (the loop already "does NOT move task files"). A timeout/grant here re-opens a decision the owner alone closes. **Not eligible under any grant.** |
| **Plan-approval gate (P1)** | **EXCLUDED by default** | ADR-019's *"one unremovable upfront human checkpoint"* — the property the whole autonomy design rests on. Auto-approving a plan guts it. **If** the owner wants it included, that is an explicit, recorded **weakening of ADR-019's core** — an owner ruling, never a default. |
| **Mid-loop "important questions"** (verify-budget, review-judgment, non-convergence) | **ELIGIBLE — the target** | The option-picking stops. A recommended-default-under-grant here *extends* ADR-019's "obvious winner" autonomy from no-brainers to **dominant-default judgment calls**. Even here it is a **claim-level shift** (the loop makes a *judgment* call autonomously, not merely a *dominant* one) — recorded in the ADR amendment (§4). |

## 4. The ADR-019 amendment this requires

The change is not free of ADR-019: it **extends the autonomy claim level** from *"proceed only on an obvious winner within plan intent"* to *"proceed on a recommended default for a granted question-class, logged."* That is a real, named shift and must be recorded — via `/fkit-record-decision`, owner present — as an **amendment to ADR-019** (in place, per the ADR-013/015 precedent; the decision's spine is unchanged, the autonomy boundary is widened by an explicit up-front grant). The amendment states: (a) the timer ask was found **not runtime-expressible** (tombstone, so it's not re-proposed); (b) the up-front grant is the substitute; (c) the done-gate stays hard-excluded; (d) the plan-gate stays excluded unless separately, explicitly weakened; (e) the claim-level shift and the mandatory worklog logging of every auto-picked default.

---

## For the owner — the decisions this spec is asking you to approve

1. **Accept the feasibility verdict** — the literal 30s-timer is **not buildable**; the up-front per-run grant is the substitute. *(Optionally: authorize the coder to run the ADR-021-grade binary probe and append it, for the record — not on the critical path.)*
2. **Pick the mid-loop mechanism:** the **grant** (recommended), **batch-and-defer to the done-gate** (more conservative), **tighten the obvious-winner boundary** (cheapest, possibly sufficient alone), or a combination.
3. **Ratify the gate scope:** done-gate **excluded (hard)**; plan-gate **excluded** — or explicitly rule to include it (a recorded ADR-019-core weakening).
4. **Confirm the ADR-019 amendment** is recorded before task 60 builds anything.

**Downstream tasks the approval spawns:**
- **ADR-019 amendment** (owner + architect, `/fkit-record-decision`) — including the "timer not runtime-expressible" tombstone.
- **Task 60 (implementation)** — the mid-loop grant + per-question recommended-default + worklog logging in `claude/skills/fkit-task-ship-loop/` (fkit-coder).
- *(Optional)* a small **binary feasibility probe** appended to this report (fkit-coder), if the owner wants ADR-021-grade evidence on file.

**Recommended: an adversarial (Codex) pass before sign-off** — the task-20/29/39 precedent; every one of those rev-1 designs lost something to a Codex pass, and this one rests on a runtime-capability claim I have flagged as strong-but-not-binary-proven. Say the word and I'll route it to the adversarial reviewer.

## Related

- [ADR-019](../decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — the ship-loop's autonomy model and its owner gates; amended by this design.
- [ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) — `AskUserQuestion` is session-only (available in the ship-loop session) and has no timeout mode; the "measure the seam, don't reason it" precedent this feasibility section honors.
- [`reports/2026-07-17-design-task-ship-loop-skill.md`](2026-07-17-design-task-ship-loop-skill.md) — the ship-loop spec (§6.1 "obvious winner"; §6.3/§11 the owner gates); task 52 / D1 (the done-gate the loop must not route around).
- [`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md) — the claim-level discipline §1 applies.
- [`conventions/one-skill-one-output.md`](../conventions/one-skill-one-output.md) — a configurable grant scope is an operand, not an output variant.
