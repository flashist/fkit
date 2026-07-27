# Give the launcher-contract suite a pty, and pin the menu picks 1-7

## ID
0145

## Sprint
Sprint 2

## Priority
131

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The `fkit` launcher's **interactive menu** has **no automated coverage at all** — not a weak test, none.
`ai-agents/knowledge-base/architecture.md:453` records this as an **explicitly accepted untested edge**
(*"not a real self-update over the network or a real menu on a tty; those edges stay manual"*).

**This task partly reverses that recorded acceptance, deliberately.** State that plainly — it is a
change to a documented decision, not a gap someone forgot. The reason it is worth reversing now: 0139
**reordered every menu pick** (lead moved to 1, all six other roles shifted down one), and the sprint
plan's own note calls the accepted cost *"a mis-pick is silent"*. A silent mis-pick is precisely what a
test catches and a human does not.

**Why the existing harness cannot do this.** `runFkit` spawns the launcher with `detached: true` and
`stdio: ['ignore', …]` — a new session with **no controlling terminal** — and `test/harness.mjs:89-90`
says that is **on purpose**, so the launcher's menu / fresh-tty branches stay deterministic. That
choice is correct and **must not be changed**: several existing tests depend on the headless branch
(e.g. *"headless → lead"*). This task **adds a sibling helper**; it does not alter `runFkit`.

## What to build

### A. A pty-capable test helper in `test/harness.mjs`

A new exported helper (sibling to `runFkit`, not a modification of it) that runs the launcher under a
**real controlling terminal**, feeds it a menu pick, and returns the same shape the existing tests
already assert on — exit code, whether `claude` was exec'd, and the recorded argv.

Prior art: a **throwaway** script using `script -q /dev/null` plus the harness's existing stubbed
`claude` on `PATH` drove the menu successfully by hand during 0139/0140. ⚠️ **Do not depend on
`/tmp/fkit-0139-menu-check.sh`** — it was never committed and will not survive; it is a hint about the
approach, not an input.

⚠️ **Two traps that produce false results — both cost real time during 0139:**

1. **Input piped immediately arrives *before* the launcher opens `/dev/tty`.** Every read then hits
   EOF, and the launcher exits **0 without exec-ing** — which is **indistinguishable from "the pick is
   broken"**. A test built naively this way passes or fails for the wrong reason. Whatever the fix
   (a delay, a pty write after the prompt appears, waiting for the prompt text), the helper must
   **distinguish "menu never got the input" from "menu rejected the input"**, and the suite must fail
   loudly on the former rather than reporting it as a rejection.
2. **The stub records `--agent fkit-<role>`, not a path to an agent file.** Assert the flag value the
   launcher actually passes. Asserting a file path will fail against correct behavior.

**Portability is a real risk, and an owner decision if it bites.** `script` differs between BSD/macOS
and Linux in argument order, and CI may have neither a pty nor `script`. If a portable pure-shell pty
proves unreliable, **stop and report** with the options (a `node-pty`-style dependency in a repo that
is currently dependency-light, a skip-with-loud-reason on unsupported platforms, or scoping the helper
to macOS). **Do not silently skip the tests on the platform where they fail** — a quietly-skipped test
is worse than the acknowledged gap this task exists to close.

### B. The assertions the helper makes possible

| Menu input | Expected |
|---|---|
| `1` … `7` | `claude` exec'd with the **correct** `--agent fkit-<role>` for that pick |
| `team` | rejected at the menu — `is not one of 1-7`; `claude` never exec'd |
| `team room` | rejected at the menu — `is not one of 1-7`; `claude` never exec'd |

The seven picks are one-per-role, so drive them from the same role list the suite already uses rather
than seven hand-written cases — a hand-written list drifts the next time the menu is reordered, which
is the exact failure this task is guarding.

### C. Update the recorded acceptance

Once the coverage lands, `ai-agents/knowledge-base/architecture.md:453` is **stale** — it says the menu
edge stays manual, and it no longer does. Update that sentence to describe what is now covered and what
genuinely remains manual (the real network self-update, and `install.sh`). **Verify the line number
before editing** — this project has a named failure class for stale citations.

## Verification steps

1. `npm test` green, including the new pty tests.
2. **Prove the pick assertions are load-bearing, not vacuous.** Point the helper at a throwaway
   launcher copy whose menu arms are shuffled (e.g. `1` mapped to `fkit-coder`) and confirm the suite
   goes **red**, naming the wrong `--agent`. A pick test that cannot fail is the trap in §A.1 wearing a
   green badge.
3. **Prove trap A.1 is actually handled:** a run where the launcher never receives the input must fail
   with a message saying *the menu was never reached*, and must **not** be reportable as a rejection.
4. `team` and `team room` at the menu produce the `is not one of 1-7` rejection and no exec.
5. `test/prove-red.sh` → `✓ hard gate PASSED` (existing mutations unaffected).
6. `runFkit`'s own behavior is unchanged: the existing headless tests (including *headless → lead*)
   still pass, and `git diff test/harness.mjs` shows an **addition**, not a change to `runFkit`'s spawn
   options.
7. `architecture.md`'s accepted-untested-edge sentence matches what the suite now covers.

## Notes

- **Depends on:** nothing — the launcher behavior is already correct and closed (0139, 0140).
- **Blocks:** nothing.
- **Related:** 0144 (the argument-path `team` / `team room` rejection) — independent, but the two
  together are what close 0139's standing residual. This one carries the infrastructure cost; 0144 is
  cheap and needs none.
- **⚠️ This is the larger and riskier half.** If the pty approach does not hold up portably, that is a
  finding to bring back, **not** a reason to weaken the assertions.
- **Owner:** fkit-coder — `test/` plus the one `architecture.md` sentence in §C.
- No commit — leave the changes in the working tree.
