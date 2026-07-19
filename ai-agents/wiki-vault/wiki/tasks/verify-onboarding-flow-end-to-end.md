# Verify the onboarding flow end-to-end

**Source**: `ai-agents/tasks/done/verify-onboarding-flow-end-to-end.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 7 (**the release gate**)

## Goal
Prove fkit still works after the removal, by running **the real, public flow from a genuinely clean state** — clean `curl | sh` install → scaffold → role menu → all 7 role-locked sessions → a consult → a review that reaches Codex.

Carried over from Sprint 1 and **reframed**: its original premise (`.fkit/run`, vendored bundles) died with Omnigent, but *its intent became more important, not less*.

## Key Changes
> Sprint 2 rips out an entire runtime, rewrites the `curl | sh` entry point, and adds new code to the startup path of every invocation. **This task is the proof that fkit still works when it's done.**

It is deliberately owned by **a fresh pair of eyes running the *public* path** — *not by reading diffs, and not from inside this repo, which never exercises the install half of the flow at all.* **Evidence, not vibes**: record the actual commands and their output.

Step 4 was the one that mattered most: for **each** of the 7 roles, confirm the lockdown is real — the `/` menu shows only that role's skills, and **a skill it does not own is unrunnable even by explicit name.** *This is the flavor's central invariant — test it, don't assume it.*

## Outcome
✅ **PASSED — complete. No defects found in fkit.** *(Evidence: `ai-agents/knowledge-base/reports/2026-07-12-onboarding-verification.md`; artifact under test: `origin/main` @ `44cef79`, fetched via the real `curl | sh`.)*

**Sprint 2 is releasable.** The gate holds end to end: clean install → `fkit` → auto-initiation → producer→architect consult → `fkit-survey-project` → a written, initiated project, with **the skill lockdown confirmed at the harness level** and a review that genuinely reaches Codex.

**Run in two phases, and the split is itself a finding.** fkit-coder had implemented most of the sprint, *so it was not a fresh pair of eyes*. Phase A was confined to work producing **recorded command output and exit codes** — *"a `diff` or an exit status cannot be laundered by author bias"* — and every step requiring **judgment** went to the owner in Phase B.

⚠️ **Finding 1 (methodology, not a defect): the brief's "clean `$HOME`" is impossible for the interactive half.** Faking `$HOME` makes Claude Code look for credentials in the temp dir and the session cannot authenticate. Resolution used: clean `HOME=$(mktemp -d)` for install/scaffold/self-update; **real `$HOME`** for interactive steps, isolated via `FKIT_SHARE` / `FKIT_BIN` instead. **The brief should be amended to say so, or the next person repeats the dead end.**

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/rewrite-installer-single-flavor]]
- [[tasks/delete-omnigent-directory]]
- [[systems/install-and-self-update]]
- [[systems/role-locked-sessions]]
- [[systems/review-and-model-diversity]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — task 7, the run that surfaced the hole this ADR answers
