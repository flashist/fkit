# Add the missing **verbatim** to `fkit-coder.md`'s declared-approval marker, condition (b)

## ID
0150

## Sprint
Sprint 2

## Priority
126

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Task **0119**'s round-1 review found a one-word drift between the owner's recorded ruling and the file
that implements it. The finding (**R1**, medium) was raised **independently by both reviewers** —
fkit-reviewer (Claude) and the Codex adversarial pass (`codex-cli 0.145.0`, exit 0, full model-diverse
coverage, no degradation). Ledger:
[`0119/review.md:18`](../../done/0119-track-fkit-coder-declared-approval-carve-out/review.md).

**The drift, re-verified against the tree 2026-07-26:**

| Site | Condition (b) as written |
|---|---|
| `claude/agents/fkit-coder.md:65-66` (the worker's own contract) | *"(b) it carries a concrete **approved plan**"* — **no `verbatim`** |
| [ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) **A1** (`:97`, the owner's 2026-07-22 ruling) | *"(b) it carries the concrete **approved plan** verbatim"* |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:109` (the driver's obligation) | *"MUST each carry the approved plan **verbatim**"* |

**Why it matters — record this reasoning, it is the point of the task.** The approved plan is not only
the worker's standing approval, it is its **scope boundary** (`fkit-coder.md:68-69`: *"The approved plan
is both your standing approval and your scope boundary"*). A **paraphrased or reconstructed** plan
satisfies the worker-side check exactly as it is written today. So the boundary a spawned coder enforces
can silently become **the driver's summary of what the owner approved**, rather than what the owner
actually approved — and the worker has no way to notice, because its own contract never asked for the
original wording.

**Severity is medium, not high, and the reasoning is deliberate — do not inflate or deflate it.** The
driver's own verbatim rule (`SKILL.md:109`) has to fail first for this to bite. This clause is therefore
a **missing second line of defence, not the primary control**. It is still worth fixing: a defence that
reads weaker than the ruling it implements is the kind of drift this project keeps rediscovering, and it
sits on a **guarantee surface**.

**Scope is one word.** It is filed as its own task, by owner ruling on 2026-07-26, precisely *because*
it is a guarantee-surface edit — the same reasoning that produced 0119 itself (a guarantee-surface change
folded inside another task's work loses its independent review).

## What to build

A prose fix to **one clause** in **one canonical file**.

1. **`claude/agents/fkit-coder.md`, condition (b) of the declared-approval marker (`:65-66`).** Make it
   require the **approved plan carried verbatim**, matching ADR-032 A1 (`:97`) and the driver's
   `SKILL.md:109`. Match the surrounding prose register; do not restructure the sentence or the
   three-signal list.
2. **Canonical source only.** `.claude/agents/fkit-coder.md` is a **gitignored mirror** refreshed by
   `claude/fkit-claude-init.sh .` — never edit it directly. (Verified 2026-07-26: exactly **one** mirror
   exists, byte-identical to canonical, `md5 = e08875aa6baad20d0c2805a6e81dafca`.)
3. **Change nothing else.** Not signals (a) or (c), not the Build-worker bullet, not the
   Process-review-worker bullet, not the "trust, not proof" framing, not the refusal clause at `:89-91`.
   This task **narrows** a condition to match the ruling; it does not widen, reopen, or re-decide any of
   them.
4. **Do not edit ADR-032.** The ADR is already correct — the file is what drifted from it. An ADR edit
   would be an architect action and is not this task's work.

## Verification steps

1. `grep -n 'verbatim' claude/agents/fkit-coder.md` returns a hit inside the declared-approval marker's
   condition (b) — the clause currently at `:65-66`.
2. Condition (b) in `claude/agents/fkit-coder.md` and ADR-032 A1 (`:97`) now agree on the requirement:
   the plan is carried **verbatim**. Read the two side by side and confirm.
3. The marker still has **exactly three** signals, still joined by **all** of, and (a) and (c) are
   **byte-unchanged**.
4. **No change** to the Build-worker bullet (`:71-72`), the Process-review-worker bullet (`:73-82`), the
   trust-not-proof paragraph (`:84-91`), or the *"Everything else still refuses"* universal (`:89-91`).
   A diff touching any of these has exceeded this task.
5. `claude/agents/fkit-coder.md` still refuses source writes on every path lacking all three marker
   signals — the carve-out is not leaked (ADR-032 **A4 bullet 4**).
6. `claude/skills/fkit-sprint-ship-loop/SKILL.md` is **untouched** — its `:109` verbatim rule was already
   correct and is the reason this is a second line of defence rather than the primary one.

## Notes

- **Owner:** fkit-coder — an agent-def source edit to `claude/agents/fkit-coder.md`, the same owner
  precedent as 0119 and 0110.
- **Depends on:** nothing. ADR-032's amendment (task 0118) is closed, so the ruling this aligns to is
  already real ADR text.
- **Blocks:** nothing.
- **Source:** 0119 review ledger finding **R1**,
  [`0119/review.md:18`](../../done/0119-track-fkit-coder-declared-approval-carve-out/review.md), convergence call
  at `:90-96` (*"Act on R1 — this is not a review loop"*). **Filing this does not close 0119** — 0119
  remains `🔄 In progress` and is the owner's to verify and close personally.
- **✅ Priority ruled 2026-07-26 — 128 → 124, adjacent to 0147 (123).** The owner ruled on the flag
  below, which is kept as the record of why the number was questioned. The reasoning the owner accepted
  is the reasoning stated there. **See the sprint plan's *Re-ranked 2026-07-26 (second re-rank of the
  day)* table** for the full before/after and every displaced row.
- **⚠️ The flag as filed (now resolved — priority 128 was append rank, NOT a merit ranking).**
  `/fkit-task-brief` step 5 forbids inserting into or renumbering the owner's existing ranking, and this
  brief was filed from a **spawned** producer with no owner channel, so appending was the only sanctioned
  option. **On merit this belongs adjacent to 0147** (then priority 122, now **123**): both edit
  `claude/agents/fkit-coder.md`, both implement an already-settled ADR-032 clause, and by the same
  reasoning the owner used on 2026-07-26 to lift 0147 above the launcher-test pair (0144/0145), this
  closes a gap in a control **the project is exercising right now** rather than pinning behavior already
  verified correct. Note also that R1 is graded **medium** while 0147's source finding (R2) is graded
  **low**, and this fix is one word against 0147's two prose edits. **A re-rank is the owner's call, not
  a spawned agent's.**
- **Run order — this is the plan's instruction, not a suggestion (owner ruling 2026-07-26, and the
  stated reason for the promotion):** land this **with 0147, in the same `fkit-coder` session**. They touch
  the same file in different clauses — no textual conflict, but one session means one read of the
  guarantee surface and one review pass over it.
- **Do not fold this into 0147.** 0147's own verification step 4 states *"**No change** to the
  declared-approval marker's three signals … A diff that touches those has exceeded this task"* — and
  this fix touches signal (b). Folding would require weakening the exact guard that keeps 0147 off
  settled ground, and would repeat the mistake 0119 exists to correct.
- **⚠️ Do not re-decide the carve-out.** The declared-approval marker, A1/A2's permitted write surface,
  the option-(b) autonomy, and the accepted prose-enforced cost are **settled** (owner-ruled 2026-07-22,
  re-affirmed by ADR-032's amendment; guards in **A4**). This task changes one condition's wording to
  match that ruling. If implementation surfaces a reason to doubt the ruling, that is an **open question
  for the owner**, not an edit.
- **Dual-home caution:** edit canonical `claude/`, then refresh via `claude/fkit-claude-init.sh .` if the
  live session needs the change. See 0131/0132/0133 for the standing dual-home drift work.
- No commit — leave the edit in the working tree.
