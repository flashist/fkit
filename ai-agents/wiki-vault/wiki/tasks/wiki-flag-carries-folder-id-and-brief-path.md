# The wiki completion flag must carry the task's folder ID — `Task N` was undefined

**Source**: `ai-agents/tasks/done/0153-wiki-flag-carries-folder-id-and-brief-path/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0153` · owner `fkit-coder`

## Goal

[[tasks/wiki-skills-flag-ready-to-close]] (`0125`) landed the completion-flag block in all three wiki SKILLs. **The block named the task it was flagging as `Task N`, and `N` was never defined anywhere in it.**

**Why `N` was genuinely ambiguous, not merely loose.** Every task carries **two** small integers, in adjacent columns of the same board table, in different number-spaces: the permanent **folder ID** ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] Decision 3), and the mutable **sprint rank**, re-ranked twice in a single day. This is exactly the confusion `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` exists to prevent — and that convention was approved on **2026-07-27**, the same day this text was written on the other side of the repo, without it.

⚠️ **The collision was live and landed on the worst possible pair.** Task `0125` held rank **P108**. A different, real task with folder ID **0108** also exists — and it is **the very investigation `0125` implements**. A flag reading *"Task 108's vault work is complete"* is ambiguous between the two tasks a reader is most likely to conflate.

**Why the missing path made it worse.** The flag line is the one thing the SKILLs require a summarising caller to carry **verbatim** — so its ambiguity reaches the producer undiluted. The consumer is `/fkit-task-done`, which **takes a path**; resolving `N` wrong moves the **wrong brief** into `done/` and edits the sprint plan against the wrong row.

## Key Changes

Prose edits to three `SKILL.md` files:

1. Both the complete and partial lines identify the task by the **`NNNN` prefix of its task folder**; the bare `N` placeholder is gone.
2. Both lines carry the brief path the scan step had already read.
3. A short rule beneath them states where the number comes from and — **as an explicit negative** — that it is **never** the board's rank / `P<n>` cell, citing the convention by name. *The negative is the load-bearing half: it is what a future editor reads before reintroducing a bare number.*
4. **Uniformity defined correctly.** The backticked flag strings are byte-identical across all three files; the surrounding block is identical **after normalising leading indentation only**. `fkit-wiki-sync`'s copy sits at top level while `ingest`/`lint` nest theirs inside a numbered step — so *"the three files are byte-identical"* was **false as stated** and was explicitly not implemented literally.

**Verification had to be fail-closed**: gated on a non-empty extraction and a minimum line count, preserving relative nesting, with a **negative control observed to fire**. *A check that prints `UNIFORM` on an empty extraction has verified nothing.*

## Outcome

Done, **agent-closed — not owner-verified**.

**Provenance is the finding.** Found by a spawned `fkit-producer` during `0125`'s close — **the role that actually consumes the flag.** Neither the coder, the reviewer, nor the Codex adversarial pass caught it across five rounds.

⚠️ **A defect this task did not fix, and which it could not have seen as a defect.** The path form it mandated hardcodes `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`. A `complete` flag says *ready to close*, so the folder leaves `backlog/` in the same working session — **the template manufactures a dead path by construction**, and a review ledger quoting the flag verbatim preserves it forever. Ruled in [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`) §5.2 as Case 4. **The owner ruled the replacement on 2026-08-01: folder ID only, no path at all.** The skill edit is an unfiled follow-up; the three `SKILL.md` files still carry the defective form.

## Related

- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, whose block this repairs
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — `0108`, the collision's other half
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — Decision 3, the permanent ID
- [[tasks/implement-task-folder-name-scheme-change]] — `0103`, which wrote the rank-vs-identity convention
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, which found the hardcoded `backlog/`
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the flag routes to the producer
