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

> ⭐ **Dated resync note 2026-09-05 (`0358`, sweep C) — the SOURCE ADR now carries its own dated correction, and it measures what the 2026-08-13 note above only asserted.** Every line above is left **byte-identical**. ⛔ **Status value unchanged — this ADR is still `superseded`.**
>
> Task `0281` (2026-09-04, inside sweep `0357`) appended a note to the knowledge-base ADR ruling the clause *"the need it identified … is still unmet and still open"* **FALSE**, and recording **two** mechanisms `0256` wired on 2026-08-12, different in kind:
>
> 1. **An in-release gate** — `bin/release.mjs` runs `npm test` **by default** and aborts on red. ⚠️ **A default, not an absolute:** the `--no-test` flag skips the gate entirely — the script's own help calls it *"Skip the test gate — **SHIPS AN UNVERIFIED TREE**"* — printing a loud warning and **proceeding**. ⛔ **So the suite does NOT run before *every* release, and a warn-and-continue path does exist.**
> 2. **A CI workflow** — `.github/workflows/test.yml`, on `push` to `main`, `pull_request` and `workflow_dispatch`.
>
> ⭐ **What CI has actually done, measured 2026-09-04: 33 runs on `ubuntu-latest` — 29 success, 4 failure.** Every one a **push to `main`**; **no run has ever been raised through the `pull_request` or `workflow_dispatch` triggers.** First run 2026-08-12 (red — a filesystem case-sensitivity divergence, repaired by `0283`); most recent 2026-09-04, green; the other three reds on 2026-08-21 and 2026-08-29 (×2). ⛔ **These are counts on a date, not a standing property, and nothing here claims CI protects, guards or ensures anything.**
>
> ✅ **Dated resync 2026-09-10 (sync `cf289c2`→`b4a1a52`) — provenance only, no claim changes.** The 2026-09-05 note above was written from **working-tree bytes**; `0281`'s correction to the source ADR is now **committed in `5ed0b91`**, and the committed text is what this page describes. ⛔ **The run counts are NOT re-measured** — they remain a 2026-09-04 figure and must be re-taken before being quoted.

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
- *Added 2026-09-10 (sync `cf289c2`→`b4a1a52`):* [[tasks/sweep-b-the-single-site-correction-notes]] — task `0357`, Sweep B — the single-site correction notes
