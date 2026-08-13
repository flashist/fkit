# ADR-003: Add CI running `omnigent/validate-bundles.sh`

**Date**: 2026-07-09
**Status**: superseded

> ## ⚠️ Superseded — Omnigent removed ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]).
> `omnigent/validate-bundles.sh`, the script this ADR's CI would have run, **no longer exists**, and
> **the CI never landed.** Kept for the record — because **the need it identified is still unmet and
> still open**: fkit has *no* automated verification of any kind. That is now the project's top
> structural risk, and *"what is the intended verification story?"* is an open question for the owner.
>
> ✅ **Dated correction 2026-08-13 (the `0282` resync; the banner above is left byte-identical). THE NEED THIS ADR IDENTIFIED IS NOW MET — by a different task, for a different subject.** [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] (`0256`, closed 2026-08-12) landed **`.github/workflows/test.yml`**, running `npm test` on every push to `main`, every pull request and on demand — plus a blocking `npm test` gate inside `bin/release.mjs`. ⚠️ **This reverses the owner's later `"No CI planned."` ruling**, which itself post-dated this ADR.
>
> **What is corrected, precisely:** *"fkit has **no** automated verification of any kind"* was already superseded in 2026-07-16 by the launcher-contract suite; **as of 2026-08-12 there is also automated CI.** The suite stands at **20 `test/*.test.js` files plus `prove-red.sh`.** ⛔ **What is NOT corrected: the CI lane runs the suite, and the suite still does not cover `install.sh`** — the `curl | sh` entry point, explicitly out of `0256`'s scope as its own brief. **A verification story now exists; it is not complete.** See [[systems/testing-and-verification]] §"CI and the release gate".

## Context
There was no CI workflow in the repo. The only existing validation step was `omnigent/validate-bundles.sh`, which already catches bad `SKILL.md` frontmatter and degrades gracefully when a local Omnigent Python install is unavailable.

That made it a cheap, useful first CI target.

## Decision
Add a lightweight GitHub Actions workflow that checks out the repo and runs `omnigent/validate-bundles.sh`.

The initial workflow does not need to install Omnigent, because the script still performs frontmatter validation without it. Full `omnigent.spec.load` coverage can be added later.

## Consequences
- Every push or PR gets automatic bundle-frontmatter validation.
- The workflow adds no new runtime dependency in CI at first.
- Coverage remains partial until the `spec.load` path is added later.

## Related
- [[systems/fkit]]
- [[tasks/add-ci-validate-bundles]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[systems/testing-and-verification]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — **no `.github/workflows/` exists today**, which is why its approved gate has no CI lane to land in yet. ✅ *Corrected 2026-08-13: the lane exists (`0256`) and `prove-red.sh` runs in it, inside `npm test`.*
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the CI gap this ADR's tester seat would finally address. ✅ *Corrected 2026-08-13: the CI half is closed; the `install.sh` **e2e** half — the part the tester seat was actually about — is **not**.*
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — task `0256` (2026-08-12): **the CI this ADR asked for, finally landed** — for `npm test` rather than the dead `validate-bundles.sh`, and paired with a blocking in-release gate
