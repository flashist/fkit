# Fix the headless menu-guard crash — `[ -r /dev/tty ]` never tests openability

**Source**: `ai-agents/tasks/done/0042-fix-headless-menu-guard-crash/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 33

## Goal
On a **no-role, no-args invocation of an initiated project with no controlling terminal** (piped / CI / detached), the launcher **crashed instead of defaulting to the team room**. Restore the documented "piped/CI → safe default" promise.

## Key Changes

**The cause, precisely:** the menu guard gated on `[ -r /dev/tty ]`. **`-r` tests the device node's permission bits (`access()`), not whether `open()` succeeds** — and `/dev/tty` is world-`rw` on macOS and Linux, so **the predicate read TRUE even with no controlling terminal**. The branch was entered, the next line `exec 3</dev/tty` failed **ENXIO** under `set -eu`, and the `role="lead"` default below was **never reached**.

**Net effect: the lead default was dead code on any normal system.** The launcher's documented promise could not be reached on the exact input it exists to serve.

- **Fix:** swap `[ -r /dev/tty ]` for an **openability probe** — `( exec 3</dev/tty ) 2>/dev/null`, a subshell returning 0 **only if `open()` genuinely succeeds**. Non-fatal inside the `||` test; `2>/dev/null` swallows the ENXIO noise.
- **A defect against an EXISTING contract, not a decision** — two places already settled initiated-headless → lead: the launcher's own fall-through comment, and **task 23's assertion 7**. The behavior was specified; the code did not deliver it. **No ADR.**
- **Scope boundary held:** the **fresh-project** headless case (producer vs lead) is **untouched** — it remains task 23's reserved open question 1.

## Outcome
**Done.** Verified across **all three routing paths**: headless → lead (exit 0), the interactive menu still opens on a real pty, fresh → producer unchanged. **Task 23's assertion 7 flipped from `todo` to enforcing and passes.**

**This is the launcher-contract suite's first catch** — the defect was found *because* assertion 7 was made enforcing and went red. A worked example of why the suite exists: **fkit's failure mode is silent-wrong**, and this one hid behind a predicate that looked right.
## Related
- [[tasks/add-launcher-contract-smoke-script]] — assertion 7 is what caught it
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[tasks/remove-fkit-resume-passthrough]] — the sibling launcher pass
- [[systems/testing-and-verification]]
- [[systems/install-and-self-update]]
- [[systems/launch-convergence-and-init]]
- [[tasks/sprint-2-remove-omnigent]]
