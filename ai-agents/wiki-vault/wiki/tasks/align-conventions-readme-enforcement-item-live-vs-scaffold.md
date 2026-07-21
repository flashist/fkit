# Align the conventions-README "enforceable somewhere" item: live vs scaffold

**Source**: `ai-agents/tasks/done/0014-align-conventions-readme-enforcement-item-live-vs-scaffold/brief.md`
**Status**: done
**Sprint/Tag**: Unsprinted

## Goal
The two copies of the conventions-index README diverge on item 3 of **"The bar for adding one"**. The **live** copy adds guidance to state where a convention is enforced — *"ideally in `claude/` source, so it ships to every project and not just this one"* — plus a cross-reference. **The scaffold copy drops both.**

## Key Changes

**A decision-first doc task, and its most important line is that the divergence may be correct:**

> **"This is not automatically a defect."** The divergence may be **intentional**: the scaffold is a generic starter shipped to fresh projects, and the dropped text is **repo-specific** — it names this repo's `claude/` layout and a convention file a fresh project won't have. **So the task is *not* "make the two files identical" by default.**

**Two options put to the architect, who owns KB structure per [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]:**
- **(a) Generic form** — carry the *idea* ("state where it is enforced, ideally in source so it ships to every project") **without** the repo-specific path or back-reference. Keeps the useful teaching while staying portable.
- **(b) Stay minimal** — the short scaffold text is deliberate; enforcement-at-source is a mature-repo concern. **Then the divergence is intentional and correct, and the fix is only to record that so it isn't re-flagged.**

**Only the scaffold copy is in question.** The live README's fuller wording is correct for this repo and **must not be trimmed to match**.

## Outcome
**Done.** **Origin: flagged by the architect during the [[tasks/stop-agents-asserting-unchecked-repo-state]] review as pre-existing and out-of-scope** for that task — then filed as its own brief rather than folded in. Verified in both files by the producer, 2026-07-16.

**Whichever way it was decided, the decision had to be *recorded* so the divergence is not re-flagged by a future review** — that was a verification requirement, not a nicety.

**No ADR** — doc-wording alignment. *(If the architect were to decide the scaffold-vs-live delta needs a durable, general rule, that is a separate call to raise with the owner — deliberately not folded in.)*

⚠️ The brief's own `## Status` header still reads `🔲 Backlog` though it sits in `done/` — mover drift. ⚠️ **The wiki records that the task closed; it does not record which option (a or b) was chosen** — that is in the task's close-out, not in the brief. Flagged rather than guessed.

## Related
- [[tasks/record-one-skill-one-output-convention]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] — the architect's ownership of KB structure
- [[tasks/stop-agents-asserting-unchecked-repo-state]] — the review that surfaced it; also added the third convention
- [[tasks/fix-scaffold-knowledge-base-folders]] — shipped the scaffold's `conventions/README.md` in the first place
- [[tasks/formalize-knowledge-base-incidents-folder]]
- [[systems/knowledge-base-structure]]
- [[systems/launch-convergence-and-init]]
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — the fourth parity instance
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the standing rule this point-fix anticipated; `conventions/README.md` is now a named, intentional divergence
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, the investigation that named this an instance of a class
