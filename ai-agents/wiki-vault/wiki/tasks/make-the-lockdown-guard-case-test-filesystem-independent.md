# Make the case-insensitive lockdown-guard test filesystem-independent — fkit's first CI run is red

**Source**: `ai-agents/tasks/done/0283-make-the-lockdown-guard-case-test-filesystem-independent/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P17 · task `0283` · owner `fkit-coder` · filed and shipped 2026-08-13

## Goal

**fkit's first-ever CI run went red.** `0256` landed `.github/workflows/test.yml`; the owner pushed to
`main`; **GitHub Actions run `31634593615`** on `ubuntu-latest` returned **708 pass / 709, 1 fail** —
`test/orphan-cleanup.test.js`, *"the never-delete-lockdown-state guard is case-insensitive"*, with
`assert.match(r.stderr, /lockdown state/)` getting `''`.

Two owner rulings the same day, verbatim option labels: **"A — make the test filesystem-independent
(Recommended)"** and **"Fix now — drive it in this session (Recommended)"**.

## Key Changes

> **⛔ Verdict: a TEST defect, NOT a product defect. `main` is NOT broken for Linux users.**

**The mechanism, measured rather than conjectured.** The delete-preventing `continue` is pure `tr` +
glob with **no filesystem consulted**, and it sits **outside** the existence check — so the guard
protects lockdown state on Linux exactly as on macOS. Only the **announcement** is `exists`-gated, and
**deliberately**: announcing an absent path would nag on every launch of every project forever with
nothing at stake.

The test wrote `.Fkit/Settings` into the target list. On macOS, case-insensitivity resolves that onto
the real seeded `.fkit/settings` → announced. On Linux it names nothing on disk → suppressed.
***The assertion was really asserting "the filesystem folded case for me."***

**The fix is one line in one test file** — seed `.Fkit/Settings` before init so the path genuinely
exists on both platforms — plus rewording the now-stale macOS-only comment, **keeping its provenance
readable** so the next reader does not delete the seeding line as redundant.

## Outcome

### ⚠️ The finding that drove the fix choice — why a Linux skip was rejected

**The failing test's other two assertions passed on Linux while asserting nothing.** One accepts both
plausible exit codes; the other checks that lockdown state survived — but on a case-sensitive
filesystem `.Fkit/Settings` names no real path, so **"it survived" is trivially true; nothing was ever
a candidate for deletion.** ***So a Linux skip would have left a fully vacuous test running in CI —
which is precisely where CI runs.***

### ⚠️ An honesty flag carried from the diagnosis and not dropped

The diagnosing coder **did NOT observe `prove-red.sh` green** under case-sensitivity. What *is*
measured: `prove-red.sh` also goes red there, at **two baselines only, from the same single root
cause**, hidden in the CI run because `package.json`'s `&&` short-circuited past it. Mutants 1–15
behaved correctly, **so the mutation gate itself is healthy.** A verification step exists specifically
to turn that inference into a measurement.

⚠️ **The brief also forbids claiming CI green without a run ID**, and requires the close to say
plainly whether an Actions run was observed green — *"and if not, say the CI half is inferred, not
measured, in those terms."*

### ⚠️ A residual vacuity, recorded deliberately and NOT scoped

After the fix the announcement assertion is real on both platforms, but the **survival** assertion
stays trivially true on a case-sensitive filesystem. The contract genuinely proved cross-platform is
*"a differently-cased line naming an existing path is refused and announced."* A second list line
would make survival bite everywhere — **but that changes what the test tests, and the owner ruled
option A specifically.** ⛔ Out of scope. *Recorded so the next reader knows it was seen, not missed.*

⚠️ **`P17` is an APPEND rank, not merit.** On merit it belongs at the **top** of the board, above
`0259` — it was the only red on `main`. **That position is unreachable**: nine closed rows sit below
every position above `P11`. **Flagged for owner confirmation.**

**Blast radius if never done:** every subsequent Actions run is red, so **CI reports nothing usable
and the team learns to ignore it — which retires the value `0256` was filed to create.**

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — the CI this defect was found by, and whose value it protects
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — why the rank is an append and not merit
- [[decisions/adr-014-how-fkit-tests-itself]] — the zero-devDependency bar
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — `prove-red.sh`, the second half the `&&` hid
- [[systems/testing-and-verification]]
- [[systems/launch-convergence-and-init]] — the orphan-cleanup guard under test
- [[systems/fkit]]
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `0252` (2026-08-13): `RELEASING.md` §4 cites **this red run** as evidence that CI *"has already caught a failure that a local run had not"*, and it is what falsified `0252`'s own *"CI HAS NEVER RUN"* banner
