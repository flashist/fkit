# Merge an fkit-managed rules block into an existing `CLAUDE.md` / `AGENTS.md` — the brownfield hole

**Source**: `ai-agents/tasks/done/merge-fkit-rules-block-into-existing-root-context-files.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 31

## Goal
**Every brownfield project fkit had ever been added to received none of fkit's universal hard rules. Not a subset — none.** Init left an existing root context file alone, and **any project that already uses Claude Code already has a `CLAUDE.md`**. **And there was a second, worse consequence: fkit had no channel to ship a correction through.**

## Key Changes

- **One source of truth for the block text.** The rules were hoisted into a single scaffold file rather than kept as two hand-maintained copies in `scaffold/CLAUDE.md` and `scaffold/AGENTS.md` — *that is the drift this whole investigation was chasing.* The scaffold files carry the **marker pair**, so the greenfield path (`cp` + merge) and the brownfield path (merge only) **run the same code and produce the same file. Two paths that must agree, agreeing by construction.**
- **The markers and the contract:** `<!-- fkit:begin-rules -->` … `<!-- fkit:end-rules -->`. **Everything outside is the owner's, and is never touched. Ever** — *that is what earns the right to write into a file the user already had.* Everything inside is fkit's, replaced wholesale. **The block's first line says so, in the file, to the human reading it** — *a user who loses an edit they made inside the markers, with no warning in the file, has been ambushed by us.*
- **⚠️ Idempotency is the load-bearing requirement.** Init runs on **every launch** — *a merge that appended would grow the user's `CLAUDE.md` without bound, one block per launch.* Replace **in place**, not delete-and-append: *a merge that relocates the block to EOF on every run is also a mutation of the user's file, just a slower one.* Proven by **run init 3×, get exactly one block and an identical checksum.**
- **Malformed states refuse, they do not guess.** Begin-marker-without-end → **refuse, warn on stderr, change nothing, carry on**. *Do not "helpfully" re-close the region — the end of the block is unknowable and the wrong guess deletes the user's prose.* Same for a symlinked root file (**`[ -L ]` first** — task 27's lesson, second seam), a non-regular file, or an unwritable one.
- **All-or-nothing per file** via temp+`mv`: *a merge that dies halfway leaves a half-written `CLAUDE.md` — the user's own instructions, truncated, in a file they never asked us to touch.*
- **Silence when nothing changed** — *a "rewrote CLAUDE.md" line on every launch trains the user to ignore init's output, which is the output a real refusal has to get through.*
- **A size cap enforced in the shell**, not requested: *"ask for brevity" is a request, in a decision whose whole thesis is that requests are not facts.*

**Not blocked by the parked convergence task** — the root files are handled by init **step 2**, a **different seam** from the `ai-agents/` guard. *(This is exactly what killed the rejected splice: its delivery ran through `ai-agents/`.)*

## Outcome
**Done.** Brownfield projects can receive shared rules — **and corrections to them** — for the first time.

**This is the first fkit code that writes into a file the user already owned**, unattended, on every launch. **Risk: moderate** — *"the blast radius of getting the merge wrong is someone else's `CLAUDE.md`. Every safety requirement above exists for that one sentence."* This repo, being brownfield itself, was used as the honest test.

⚠️ **Delivery: structural. Compliance: advisory.** *"Do not write 'floor', 'teeth', or 'non-overridable' into any comment, message, or commit body for this change."*
## Related
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the *other* seam, and the parked task this one does **not** depend on
- [[tasks/give-codex-the-universal-hard-rules]] — lands the canonical text this hoists
- [[tasks/refuse-init-on-weird-ai-agents-state]] — the `[ -L ]` lesson this inherits
- [[tasks/add-shared-instructions-layer-for-all-agents]]
- [[systems/launch-convergence-and-init]]
- [[systems/install-and-self-update]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-no-secrets-rule-to-fkit-lead]]
- [[tasks/add-speak-in-simple-terms-output-style]] — a preference deliberately NOT routed through this marker-managed block, and the generated-file trap that discovery exposed
- [[tasks/record-shared-instructions-reversal-adr]]
