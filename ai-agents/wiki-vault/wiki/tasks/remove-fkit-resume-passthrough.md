# Remove `fkit --resume` and the blanket arg-passthrough

**Source**: `ai-agents/tasks/done/0073-remove-fkit-resume-passthrough/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 18

## Goal
**`fkit --resume` is Omnigent scar tissue, not a feature.** It existed because Omnigent's session model was a **durable, long-lived root** that had to be re-attached, and the runner had known disconnect bugs ([[systems/subagent-runner-connectivity]]). In the Claude-native flavor a role session is just `claude --agent fkit-<role>` — **the problem it worked around no longer exists.**

## Key Changes

**The behavior was not a `--resume` flag — there was no `--resume` handling anywhere.** It was an unintended consequence of a **blanket passthrough of any unrecognized first argument**: `--resume` matched no verb → `role` stayed empty → the menu was skipped (it requires zero args) → the *"no role, not interactive → team room"* default set `role="lead"` → `exec claude --agent fkit-lead … --resume`.

**So `fkit --resume` silently resumed any session — a coder session included — as `lead`: lead's lockdown, no `Write`/`Edit`. The user got their conversation back and their role taken away, with no warning.**

- **The removal is (b): drop the blanket unrecognized-arg passthrough** — *not* a doc-only edit (which would leave the silent `lead` resume live), and *not* a `--resume`-specific case (*there is no `--resume` code to delete; special-casing one flag leaves every other stray arg on the same broken path*).
- **Preserve the legitimate `lead` default** for the *no-args, no-tty* (piped/CI) case — **only the "extra args given" half of that branch goes away.**
- **Keep passthrough *after* a named role** (`fkit coder --debug`) — intentional, not in scope.
- **Deleted the two places that advertised it.** *No "use `claude --resume` instead" tip — the owner did not ask for a replacement, documented or otherwise.*

**This superseded the earlier triage.** The coder had framed it as a defect with two candidate fixes — *persist the resumed session's role* vs *require a role before `--resume`*. **The owner rejected both.** The disposition is **removal**; the question is **closed**.

## Outcome
**Done.** *"Risk: low. Blast radius: the front door."* One file, ~10 lines — but it is the argv path **every single `fkit` invocation walks**, and the failure mode is *"a verb the user relies on now errors."* **The verb inventory was the whole job; the code was trivial.**

**Sequenced after tasks 2 and 4 on a real dependency:** they decide the wrapper's argv surface and where `fkit update` lives — *the known-verb set this task must enumerate is not final until they land.* An error branch that rejected `fkit update` would be a regression.

**Its removal is now pinned by a test.** [[tasks/add-launcher-contract-smoke-script]] asserts `fkit --resume` → **non-zero and `claude` never exec'd** — *the assertion that proves exit codes are not enough*, since the old behavior **exited 0**.

**`architecture.md` §9.4, which documented the bug, was removed with it.**

## Related
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — removing a workaround for a retired runtime is execution of this ADR, not a new decision
- [[systems/subagent-runner-connectivity]] — the disconnect bugs `--resume` papered over
- [[tasks/add-launcher-contract-smoke-script]] — pins the removal
- [[tasks/build-claude-self-update]] · [[tasks/rewrite-installer-single-flavor]] — the two it was sequenced behind
- [[tasks/fix-headless-menu-guard-crash]] — the sibling launcher defect
- [[systems/install-and-self-update]]
- [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-e2e-smoke-script-for-fkit-itself]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[systems/testing-and-verification]]
- [[systems/fkit]]
