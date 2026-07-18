# Adopting a mutation-testing library to replace hand-rolled `prove-red.sh` — investigation findings

- **Date:** 2026-07-18
- **Author:** fkit-architect
- **Task:** [`investigate-mutation-testing-library-adoption.md`](../../tasks/backlog/investigate-mutation-testing-library-adoption.md) (Sprint 2, #46)
- **Status:** open — awaiting owner/architect review. **No implementation is scoped by this report; no dependency is added; `test/` is untouched.**
- **Trigger:** the owner's reaction to review finding **R2** on task 43 — *"it looks like we need to use a proper library for auto-tests, which handles this specific type of tests 'testing negative cases'."* R2 itself is **already fixed and verified inside task 43**; this is the forward-looking library question only.

---

## Summary — the recommendation

**Stay hand-rolled. No mutation-testing library fits this stack, and the one that comes closest (Stryker) cannot mutate the code `prove-red.sh` actually mutates — shell.** Adopting any of them would break [ADR-014](../decisions/adr-014-how-fkit-tests-itself.md) Decision 4 (zero devDependencies / no lockfile / no `node_modules`) to buy a tool that still would not understand a shell product tested as a black-box subprocess.

**But the owner's instinct is not wrong about the *symptom*.** R2 was not caused by hand-rolling *per se* — it was caused by **nothing running `prove-red.sh` automatically**. Verified: `prove-red.sh` is **not in `npm test`** (`package.json:5` = `node --test test/*.test.js`), and there is **no `.github/workflows/` at all** (grep: `prove-red` appears in no CI config). It runs **only when a human types `test/prove-red.sh`**. That is the real defect R2 exposed, and it is fixable for near-zero cost **without** a library. Recommended interim mitigation below (§4), flagged not scoped.

**ADR-014 conflict:** left as an open question for the owner/architect per the brief — but the honest finding is that the question **resolves to "no candidate,"** so ADR-014 Decision 4 stands **unamended**. An amendment would only be needed if a fitting tool existed; none does.

---

## 1. What `prove-red.sh` actually is — name the SUT precisely, because it decides everything

`prove-red.sh` (`test/prove-red.sh:1-30`) is **mutation testing where the System Under Test is *shell*.** Its loop:

1. Makes a **full throwaway copy of `claude/`** (the shell product — launcher, init, hook scripts).
2. **`sed`-mutates one shell construct** in the copy (e.g. breaks a `skills_for_role()` entry; restores the pre-task-18 `--resume` passthrough).
3. Runs the **`node --test` suite** against the mutated copy via `FKIT_LAUNCHER` / `FKIT_SKILL_OWNERSHIP_HOOK`.
4. Asserts the suite goes **red at a *named* assertion** — not merely "some failure" — and that the **unmutated** copy is green first (Step 0b, the baseline that rules out "red for the wrong reason").

So the shape is: **mutate shell source → run a Node test suite → assert a specific expected-failure signature.** That combination is the crux of why no library applies.

## 2. The survey — what "a proper library" would mean here, honestly

| Tool | What it mutates | Fits fkit? | Why |
|---|---|---|---|
| **Stryker Mutator** (JS/TS; the closest thing, named in the brief) | Parses **JS/TS ASTs** and mutates the project's *own* JS/TS source, re-running the test command per mutant. Has a "command" runner for the *test* side. | ❌ | The command runner only frees the *test* invocation. Stryker still **generates mutants by mutating JS/TS** — it has no concept of mutating `claude/fkit-claude.sh`. fkit's *tests* are JS, but the **SUT is shell**; Stryker would try to mutate the Node test files, which is backwards. |
| **PIT** (Java), **mutmut / cosmic-ray** (Python), **infection** (PHP) | Their own language's source, via instrumentation/AST. | ❌ | Wrong ecosystem; same structural mismatch — they mutate source *in their language*, not a separate shell tree run as a subprocess. |
| **Shell-specific mutators** (research/hobby: assorted `bash`-mutation scripts) | Shell scripts. | ❌ | None is production-grade, none is packaged/versioned as a real dependency, none integrates a `node --test` oracle or the "red at a *named* assertion" contract. Adopting one trades a reviewed 200-line in-repo script for an unmaintained external one **and** an install step. |
| **`node --test` itself** (already in use) | — (it is the oracle, not a mutator) | n/a | Node's test runner has **no built-in mutation testing.** It is the assertion engine `prove-red.sh` already drives. |

**The structural fact that kills every candidate:** mainstream mutation frameworks mutate *a project's own source in the framework's language via instrumentation*. fkit's `prove-red.sh` mutates a **separate shell codebase run as a black-box subprocess** and asserts against a Node oracle. **No mature framework does that**, because it is an unusual (and deliberately minimal) testing posture — exactly the black-box process contract ADR-014 Decisions 1–2 chose.

## 3. The real tradeoff — zero-devDeps vs. the cost of a library

ADR-014 Decision 4 is unambiguous: **zero devDependencies, no lockfile, no `node_modules`** (`adr-014:89-91`). Every candidate above costs, at minimum: an install step, a lockfile, a `node_modules/` tree, and contributor friction — the **same axis ADR-014 already weighed once** for the runner choice, and the same axis that keeps fkit a `curl | sh` shell tool with no build.

- **Stryker** additionally pulls a large transitive dependency tree and a config file — a heavy footprint for a repo whose entire product is shell scripts + a handful of `node --test` files.
- A shell-mutation hobby tool is lighter but **unmaintained and unproven**, and still an external dependency.

**What ADR-014 principle would a candidate violate?** Decision 4, squarely — and it would gain nothing, because none of them can express the mutation-point / named-assertion contract `prove-red.sh` already gets right. This is **not** a case where a settled principle blocks a genuinely better tool; it is a case where **no better tool exists.** So the ADR-014 tension is real to *name* but **empty to resolve**: there is nothing worth reopening the decision for.

## 4. If nothing fits — how to make hand-rolled less fragile (interim, flagged NOT scoped here)

R2 had two failure modes (task-43 review): (a) the baseline went red for the wrong reason (a hardcoded absolute path); (b) a `sed` mutation silently became a **no-op** because its target had moved files. **Neither was caught by tooling — only by a manual audit**, because nothing runs `prove-red.sh` on its own. Two cheap, library-free hardenings — each a separate brief the owner may or may not want:

1. **Wire `prove-red.sh` into an automated gate.** Add it to `npm test` (or a CI step when CI exists). This is the single highest-value change: it converts "caught only by manual audit" into "caught on every run," which is the property R2's absence cost us. *(Caveat to weigh: `prove-red.sh` makes full `claude/` copies and runs the suite several times — it is slower than the plain suite, so it may belong in a `test:full` / CI lane rather than the inner-loop `npm test`. A sizing call for the coder, not decided here.)*
2. **Make a no-op mutation fail loudly.** Have `prove-red.sh` assert each mutation **actually changed the file** (e.g. the post-`sed` copy differs from the pre-`sed` copy) before running the suite — closing R2's second failure mode structurally. A ~3-line guard, zero deps.

Both are **hardening the hand-rolled approach**, not adopting a library. They are the pragmatic answer to the owner's underlying concern (fragile negative-case tests) that the library route cannot deliver without breaking ADR-014.

## 5. The ADR-014 conflict — stated, and left to the owner/architect as the brief requires

Per the brief, I do **not** resolve the ADR-014 tension unilaterally. Stated plainly for the owner:

- **The tension:** any mutation-testing library violates ADR-014 Decision 4 (zero devDeps).
- **How it resolves:** it doesn't need resolving, because **no candidate library fits** the shell-SUT / black-box-process / Node-oracle shape in the first place. There is nothing to trade the zero-devDeps principle *for*.
- **The conditional:** *if* a future, maintained tool ever genuinely fit this stack (a real shell-mutation engine with a Node oracle), adopting it would require an **ADR-014 amendment or superseding decision, owned by fkit-architect, with the owner present** — before any implementation. That is the trigger to watch; it has not fired.

---

## For the owner — decisions

1. **Ratify "stay hand-rolled; no library fits."** This is the recommendation. If accepted, it is worth a **one-line note on ADR-014** (or an ADR-014 amendment) recording that the mutation-library question was investigated and closed — so "just use Stryker" is not re-proposed. *(A tombstone, same pattern as ADR-016 / ADR-021. Say the word and I'll record it.)*
2. **Do you want the interim hardenings (§4)?** They are independent of the library question and address the *actual* R2 defect. If yes, they are **producer-scoped briefs (owner: fkit-coder)** — (a) wire `prove-red.sh` into an automated gate; (b) fail loudly on a no-op mutation. Not authorized by this investigation brief.
3. **Nothing here is decided implicitly.** No dependency added, no `test/` change, no ADR-014 amendment written.

## Related

- [ADR-014](../decisions/adr-014-how-fkit-tests-itself.md) — the standing decision: black-box process contract (Dec 1–2), bats/shellspec rejected (Dec 3), **zero devDeps / no lockfile / no node_modules (Dec 4)**, hard-coded oracle (Dec 5).
- [ADR-003](../decisions/adr-003-ci-runs-validate-bundles.md) — CI posture (note: no `.github/workflows/` is present in the tree today).
- Task 43 review: [`ai-agents/reviews/implement-pretooluse-skill-ownership-hook.md`](../../reviews/implement-pretooluse-skill-ownership-hook.md) — finding R2 (fixed in task 43).
- Code: `test/prove-red.sh:1-30` (the shell-mutation loop); `package.json:5` (`npm test` — does **not** include `prove-red.sh`).
