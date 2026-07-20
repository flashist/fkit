# Add an e2e smoke script for fkit itself

**Source**: `ai-agents/tasks/cancelled/add-e2e-smoke-script-for-fkit-itself.md`
**Status**: cancelled
**Sprint/Tag**: Unsprinted — ⛔ Cancelled 2026-07-14

## Goal
A non-agentic shell script covering fkit's own regressions: the install path, the scaffold, the launcher's argv contract, and the per-role skill lockdown. Filed by the producer against `architecture.md`'s naming of *"zero automated verification"* as the project's **top structural risk**.

## Key Changes

**⛔ Cancelled — superseded by [[tasks/add-launcher-contract-smoke-script]]**, which covers the same ground against the **settled** argv surface. Kept as a record of the thinking, per the archive-don't-delete convention.

**Two things in it are actively wrong, and are recorded as such so nobody follows them:**
- Its guidance to **derive the expected skill matrix from `skills_for_role()`** rather than hard-code it is **overridden by [[decisions/adr-014-how-fkit-tests-itself]]** — *a test whose oracle is the implementation tests nothing.*
- Its warning that the work **"collides with `remove-fkit-resume-passthrough`"** is **spent** — that task landed and the argv surface is now final.

**What it got right, and what survived into ADR-014:**
- **A role session can be driven headlessly** (verified live 2026-07-13) — the harness refused a non-owned skill with `Skill fkit-plan-task is disabled … in skillOverrides settings`. **fkit's most important invariant is machine-checkable from a script.**
- **The corollary that mattered:** per [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]], a *subagent* inherits its **caller's** `skillOverrides` and would report a confident green on the caller's settings. **Any real lockdown test must shell out to a subprocess** — so on fkit's most important invariant, **a script is strictly better than an agent.**
- **Deliberately not the tester-agent question:** *"the script protects **fkit's own regressions**; the tester verifies **a change in a consuming project**. Different users, different jobs — building the script will teach us almost nothing about whether the tester earns its seat."* And bluntly: *"shipping a role that tests other people's software while fkit itself has no test at all is the wrong order — and it's a bad look."*
  > **The tester question was ruled on 2026-07-19 — the owner said yes** ([[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]), and the separation above held: the seat was decided on **sandbox authority**, not inferred from this script. **But ADR-028's sequencing names *this cancelled task* as the gate the tester waits behind** — the owner's Q7 framing predates the cancellation. **Verified 2026-07-19: it is cancelled and superseded by [[tasks/add-launcher-contract-smoke-script]], which is Done**, so the prerequisite is largely discharged. What actually remains is narrower and owned elsewhere: ADR-026 Decision 4's gate *(shipped 2026-07-18)* and the still-absent `.github/` workflow.

## Outcome
Cancelled. Its intent shipped as the launcher-contract suite. **The install-path coverage it proposed (item 1) did not** — `install.sh` still has zero automated coverage, deferred to Sprint 3.

It was also the producer's nominated home for a **mechanical link checker**, a question raised by [[tasks/repair-broken-links-in-closed-sprint-plans]] and **ruled NO by the owner** (2026-07-15) — not pursued, no task.

## Related
- [[tasks/add-launcher-contract-smoke-script]] — the live brief that supersedes it
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[tasks/repair-broken-links-in-closed-sprint-plans]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[systems/testing-and-verification]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-ci-validate-bundles]]
- [[tasks/decide-whether-fkit-needs-a-tester-agent]] — the tester decision; this CI task is **explicitly independent of it** and must not be bundled or held hostage
