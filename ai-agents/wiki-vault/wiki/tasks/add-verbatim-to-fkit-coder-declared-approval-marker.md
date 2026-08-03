# Add the missing `verbatim` to `fkit-coder.md`'s declared-approval marker, condition (b)

**Source**: `ai-agents/tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0150` · owner `fkit-coder`

## Goal

Close a **one-word drift** between the owner's recorded ruling and the file that implements it, on a **guarantee surface**.

| Site | Condition (b) as written before this task |
|---|---|
| `claude/agents/fkit-coder.md` — the worker's own contract | *"(b) it carries a concrete **approved plan**"* — **no `verbatim`** |
| ADR-032 **A1** — the owner's 2026-07-22 ruling | *"(b) it carries the concrete **approved plan** verbatim"* |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` — the driver's obligation | *"MUST each carry the approved plan **verbatim**"* |

**Why it matters.** The approved plan is not only the worker's standing approval, it is its **scope boundary**. A *paraphrased or reconstructed* plan satisfied the worker-side check exactly as written — so the boundary a spawned coder enforces could silently become **the driver's summary of what the owner approved** rather than what the owner actually approved, and the worker had no way to notice, because its own contract never asked for the original wording.

**Severity was graded medium and deliberately not inflated:** the driver's own verbatim rule has to fail first for this to bite. It is a **missing second line of defence, not the primary control** — still worth fixing, because a defence that reads weaker than the ruling it implements is exactly the drift this project keeps rediscovering.

## Key Changes

**One word, in one clause, in one canonical file** — `claude/agents/fkit-coder.md`. The marker still has exactly three signals joined by *all* of; (a) and (c) are byte-unchanged; the Build-worker bullet, the Process-review-worker bullet, the trust-not-proof paragraph and the universal refusal clause are untouched. `claude/skills/fkit-sprint-ship-loop/SKILL.md` was **left alone** — its verbatim rule was already correct, which is precisely why this is a second line of defence.

**Filed as its own task by owner ruling, *because* it is one word.** A guarantee-surface change folded inside another task's work loses its independent review — the same reasoning that produced [[tasks/track-fkit-coder-declared-approval-carve-out]] (`0119`) itself.

## Outcome

Done, **agent-closed — not owner-verified**. Landed in one `fkit-coder` session with [[tasks/implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop]] (`0147`) by owner ruling.

**Source: `0119`'s round-1 review finding R1**, raised **independently by both reviewers** — `fkit-reviewer` and the Codex adversarial pass, full model-diverse coverage, no degradation. Filing it explicitly **did not close `0119`**, which remained the owner's to verify and close personally.

⚠️ **The guarantee surface is still not fully closed, and this task's arrival must not be read as closing it.** Backlog task `0163` records that `fkit-coder.md`'s refusal clause enumerates exactly two cases, and **neither is "a genuine sprint-loop spawn whose marker is defective"**. A by-reference carry is refused only **by inference** from A1's *"all three"* conjunction; there is no clause anywhere saying *if the plan is not carried verbatim, refuse*.

## Related

- [[tasks/track-fkit-coder-declared-approval-carve-out]] — `0119`, whose review raised this
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — A1, the ruling this aligns to
- [[tasks/implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop]] — `0147`, its session partner
- [[tasks/build-fkit-sprint-ship-loop-skill]] — the driver whose verbatim rule is the primary control
- [[systems/review-and-model-diversity]]
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the marker ADR-037 generalizes to every spawned worker
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158` — the generalization itself
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — condition (b) **stands byte-unchanged** under the ruled construction; this guarantee is not reopened
