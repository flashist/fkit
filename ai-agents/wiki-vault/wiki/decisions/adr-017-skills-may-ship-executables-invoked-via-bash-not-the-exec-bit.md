# ADR-017: Skills may ship executables — invoked via `bash <path>`, never the exec bit

**Date**: 2026-07-16
**Status**: accepted

## Context

`claude/skills/fkit-status/dashboard.sh` will be **the first executable fkit ships to a consuming project for a skill to shell out to.** Verified 2026-07-16: every skill in the tree is, today, **pure markdown**. This is a new class, and it is outside the scope of [[decisions/adr-014-how-fkit-tests-itself]], which governs **repo-root test infrastructure that cannot reach consumers** — the opposite calculus.

1. **The ship path works, but only from one directory.** `install.sh:43` copies **only `claude/`**; `fkit-claude-init.sh:227` then copies **whole skill directories**, so a non-`SKILL.md` file rides along. A shipped executable is possible **only** under `claude/`, arriving at `.claude/skills/<skill>/`.
2. **⚠️ The exec bit does not survive, and nothing says so.** `install.sh:44-46` `chmod +x`'s a **hardcoded list of two filenames**. Any other script gets **no chmod**, and rides a GitHub tarball + `cp -R` chain that does not guarantee the bit (`cp` applies the source mode **modified by umask**; the tarball is the upstream variable). **That the installer chmods at all is the evidence the bit was already not trusted for the two scripts fkit cannot run without.** The failure this produces is the worst available shape: **it works on the developer's machine and fails on some consumers'** — umask- and tarball-dependent, unattended, reported as "fkit is broken" with no local reproduction.
3. **fkit's own test scope is deliberately fenced.** ADR-014 says the scope is *"exactly two things"* and *"it stays this size"*. A shipped executable **should** be tested — but doing so **widens a fence an ADR put up on purpose**, and that widening needs recording, or the next reviewer reads the test as a scope violation.
4. **A shipped executable is a consumer-side runtime assumption.** ADR-014's protective fact — *"repo-root test infrastructure is physically incapable of reaching a consuming project"* — **is inverted here by design.** This code is *meant* to reach them.

## Decision

**Skills may ship executables.** Four rules, binding on this and every future one:

1. **Placement:** inside the skill's own directory under `claude/skills/<skill>/`. Nowhere else — colocation is what makes the init `cp -R` carry it.
2. **⚠️ Invocation is `bash <path>`, never `./<path>` — and never a shebang relied upon.** Invoked from the project root: `bash .claude/skills/fkit-status/dashboard.sh <args>`. **This is the exec-bit mitigation and the only one adopted.** It sidesteps the bit entirely and requires **no change to `install.sh`** — the `curl | sh` entry point and the highest-blast-radius file in the repo.
3. **Consumer runtime assumption: `bash`, and nothing more.** No new PATH assumption without a new decision. **Node in particular is not available to reach for here merely because ADR-014 permitted it for repo-root tests.**
4. **Shipped executables are in scope for the test suite, widening ADR-014 §2.** Pure functions of (argv, project files) → (stdout, exit code), tested black-box at repo root under `test/`. **ADR-014's "exactly two things" is now three:** argv to `claude`, the `skillOverrides` map, and **the stdout contract of a shipped skill executable.**

### Rejected
- **Extend `install.sh`'s chmod list** — it edits the `curl | sh` entry point for **zero gain** over rule 2, and it is a **hardcoded list**: every future script must remember to join it, and forgetting is silent. **Rule 2 has no list to forget.**
- **`chmod +x` in `fkit-claude-init.sh`** — same trade, plus a mutation in the every-launch path for a problem `bash <path>` deletes.
- **`find … -exec chmod +x`** in the installer — fixes the forgetting, broadens the installer to chmod by pattern, unattended, in the user's share dir. More surface, zero gain.
- **Ship no executables; keep everything prose** — **the status quo this overturns.** It is what makes `/fkit-status`'s roll-up a *"counts must sum to M"* **instruction** rather than an invariant. fkit's stated failure mode is **silent-wrong**, and **an LLM hand-counting a table is that failure with a worked example attached.**
- **Node for the shipped script** — a consumer-side script inverts ADR-014's calculus and adds a PATH assumption fkit does not make. *(This is the reasoning most likely to be re-derived wrongly: **"ADR-014 chose node" is true and does not apply.**)*

## Consequences

- **Positive:** a skill can now **compute what it used to recite** — the only real fix for silent-wrong LLM arithmetic. The exec-bit trap is closed **by construction**, with no installer change. The ADR-014 scope widening is recorded once, here.
- **Negative:**
  - **The shebang in a shipped script is decorative and misleading.** Someone will run `./dashboard.sh` locally, it will work on their machine, and they will conclude rule 2 is superstition. **The rule must therefore be stated in the skill and in the script's own header comment**, not just here.
  - **`SKILL.md` and the script become a mirror pair that can drift** — a parse contract on one side, an output format on the other. A **fourth** mirror. The output's version marker (`⟦fkit-dashboard v1⟧`) makes drift *visible*; it does not prevent it.
  - **fkit now has consumer-side code that is not markdown.** The review surface grows.
- **Re-raise only if:** a shipped executable needs **something beyond `bash`** (rule 3 sends it back to the owner — *not the implementer's call*); `install.sh` ever grows a general chmod pass (**not before**); test infra ever becomes something consumers install; or **a shipped executable ever needs to write** — everything here assumes read-only, and a writing executable on an unattended path is **the class that produced ADR-015's invariant**.

## Related
- [[decisions/adr-014-how-fkit-tests-itself]] — §1 and §4 still bind; **§2's fence is widened by rule 4**; its `install.sh:43` fact is the foundation both rest on
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the invariant a *writing* shipped executable would answer to
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] — `package.json` scope, no `bin` field
- [[tasks/design-deterministic-dashboard-for-fkit-status]] — the design this generalizes
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — the first implementation under this ADR (`dashboard.sh`)
- [[tasks/add-full-board-switch-to-fkit-status]] — the sibling `/fkit-status` change
- [[systems/testing-and-verification]]
- [[systems/install-and-self-update]]
- [[tasks/add-launcher-contract-smoke-script]]
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/fkit]]
