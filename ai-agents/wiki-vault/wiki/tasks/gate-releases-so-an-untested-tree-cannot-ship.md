# Gate releases so an untested tree cannot ship — CI, an in-release gate, or both

**Source**: `ai-agents/tasks/done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-12
**Sprint/Tag**: Sprint 5 P10 (filed to Backlog 2026-08-08; carried onto Sprint 5 at `P4`, displaced to `P10` by the re-rank of 2026-08-11) · task `0256` · owner `fkit-coder`

## Goal

**Nothing ran fkit's test suite before a release, and the release script did not run it either.**
Verified 2026-08-08: `.github/` did not exist, and `bin/release.mjs` went bump → `git add -A` →
commit → push → tag with **no test invocation anywhere in it**.

**The concrete failure this permitted:** `claude/structure-manifest.tsv` is a *shipped artifact* whose
only guard is a test that fires **only if someone ran `npm test` by hand**. `git add -A` would
happily commit and tag a stale hash table.

**The owner ruled *that* a gate exists, not *which*** — verbatim, relayed 2026-08-08: *"fix it, not
just record it… let the brief weigh which, don't pre-decide it here."* ⚠️ The brief was explicit that
the ruling is **"build a gate", not the broader wording** an architecture open question had named:
`shellcheck` and an `install.sh` smoke-install were **out of scope, as their own briefs.**

## Key Changes

**⚠️ THIS REVERSES THE OWNER'S EARLIER "No CI planned." RULING.** Both halves landed:

- **`.github/workflows/test.yml`** — `npm test` on every push to `main`, every pull request, plus
  `workflow_dispatch`. `ubuntu-latest`, Node 24, `timeout-minutes: 20`. ⚠️ **`fetch-depth: 0` is
  mandatory, not tidiness**: the structure-manifest test **hard-refuses a shallow clone** because its
  walk reads git history ∪ the working tree, so the default depth-1 checkout would kill the suite at
  module load on every run. **No `cache: npm` and no `npm ci`, on purpose** — fkit has zero
  dependencies and no lockfile.
- **An in-release `npm test` gate in `bin/release.mjs`** — blocks on red, **no warn-and-continue
  path**. `--no-test` exists, is loud, and *"is never a default"*.

## Outcome

### Why both, and why neither replaces the other — the reasoning is in the workflow file itself

- **CI cannot be replaced by the gate:** `install.sh` defaults to `main`'s HEAD, so the default
  `curl | sh` install and the self-update path **track `main`, not a tag**. Every commit on `main` is
  live to every new install the moment it is pushed. ***The gate alone would protect the artifact
  almost nobody installs by default.***
- **The gate cannot be replaced by CI:** CI's verdict is **asynchronous** (release pushes branch and
  tag in one uninterrupted run), and **CI never sees the working tree that `git add -A` actually
  ships.**

### ⚠️ The gate's position is load-bearing, and the file says why

It sits **immediately before the first mutating line**, so a red suite is a clean abort with the tree
exactly as the user left it. Gating any later would leave `VERSION` and `package.json` bumped and
dirty, and the next default run would **bump again — silently skipping a version.** And it
**deliberately does not require a clean tree**, because both `npm test` and `git add -A` read the
working tree; gating here tests **the tree as it stood when the suite started, uncommitted work
included** — *not the exact committed bytes*, since **roughly 6–8 minutes, machine-dependent**
separate the gate from `git add -A`.

**Suite runtime: roughly 6–8 minutes, machine-dependent.** The cost is ~55 s of unit tests plus
`prove-red.sh` re-running the suites against 15 mutants and 9 clean baselines. That is the cost the
owner accepted, stated rather than implied.

> ✅ **CORRECTED 2026-08-14 by task `0297` — the two paragraphs above carry the RULED figure now, and
> the earlier text is replaced rather than annotated, because that is what the row required.**
> **Authority: owner ruling 2026-08-13**, verbatim option label ***"Range: 'roughly 6–8 minutes,
> machine-dependent'"*** — which **overrode an earlier `~6 min` ruling of the owner's own**. The ruled
> wording is live at `RELEASING.md:128` (verified 2026-08-14): *"A green run takes **roughly 6–8
> minutes, machine-dependent**."*
> ⛔ **No per-run duration list is published here, and one must not be added back.**
> [[tasks/the-2026-08-14-retroactive-review-corrections]] (`0291`) **barred** publishing a tally of
> measured seconds: a 2026-08-13 sweep could locate only some of the figures on disk and **could not
> reproduce the rest**, and `0291` turned that unreproducibility into a **constraint, not a footnote**.
> ⛔ **Replacing four numbers with six better-sourced numbers is not the fix** — it is the same defect
> with fresher data. To cite evidence, cite `.github/workflows/test.yml` and `0252`'s review ledger
> **by anchor**, never as a set.
> ⚠️ **A newer measurement exists and is deliberately NOT recorded here as current fact.** Task `0288`
> measured a longer `npm test` today; the owner accepted that cost, but the figures were taken under
> CPU contention and **`0288` has not landed**. Until it does, the ruled range above is the vault's
> figure. **Flagged, not pre-empted.**

### ⚠️ fkit's first-ever CI run went RED — and found a real defect

GitHub Actions run `31634593615` returned **708 pass / 709, 1 fail**. That was a **test** defect, not
a product defect, and is [[tasks/make-the-lockdown-guard-case-test-filesystem-independent]].

⚠️ **`install.sh` still has zero automated coverage** — explicitly out of this task's scope, and still
the highest-blast-radius file in the repo. **CI landing does not close that gap.**

⚠️ Closed `(agent-closed — not owner-verified)`.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[tasks/make-the-lockdown-guard-case-test-filesystem-independent]] — the defect this CI immediately found
- [[decisions/adr-014-how-fkit-tests-itself]] — the zero-devDeps bar and the *starting* no-CI condition this reverses
- [[decisions/adr-003-ci-runs-validate-bundles]] — the CI that never landed; its subject died with Omnigent
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — `prove-red.sh` runs inside this gate, not replaced by it
- [[tasks/build-the-hash-manifest-generator-and-completeness-test]] — the shipped artifact whose staleness guard now actually runs
- [[tasks/add-ci-validate-bundles]] — the cancelled first attempt at a CI lane
- [[systems/testing-and-verification]]
- [[systems/install-and-self-update]]
- [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] — `0257`, the sibling release-hygiene row
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — this row was displaced six places by the owner-ruled re-rank of 2026-08-11 (a **move**, not an insertion)
- [[tasks/build-the-closed-rank-immutability-guard]] · [[tasks/add-e2e-smoke-script-for-fkit-itself]] — two pages whose *"no CI"* claims this task falsified; ⚠️ **the second's `install.sh` e2e half is still open**
- [[systems/fkit]]
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `0252` (2026-08-13): the document that **records** this gate and its CI half. ⚠️ Its §4 corrects `0252`'s own brief, which asserts *"CI HAS NEVER RUN"* — measured 2026-08-13, **5 runs, 4 success, 1 failure**, and the failure was a real catch
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — `0254`, the post-release verify line printed after this gate passes
- [[tasks/the-2026-08-13-vault-resync-chain]] — task `0282`, the vault re-sync of the **no-CI claims** this task falsified
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — ⚠️ *Added 2026-08-14:* tasks `0291` and `0295`. `0291` fixed the same superseded runtime figure on `index.md` and **barred the per-run duration list**; the surviving occurrences on **this** page were reported-not-fixed there, and became task `0297`, which corrected them above
