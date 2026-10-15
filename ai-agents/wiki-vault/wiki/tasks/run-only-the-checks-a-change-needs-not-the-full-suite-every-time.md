# Run only the checks a change needs, not the full suite every time

**Source**: `ai-agents/tasks/done/0480-run-only-the-checks-a-change-needs-not-the-full-suite-every-time/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P2` · task `0480` · owner `fkit-coder`

## Goal
The owner, 2026-10-02: *"the tests run every time we do any changes, which is weird, because they can take up
to 20-30 min, and right now we changed only README that doesn't affect tests at all. How to improve it?"* His
ruling (selected option): *"Both: I adapt now + file a task"* — the lead asks only for relevant checks from now
on, and this task makes **"what changed → which checks"** a written rule so it does not depend on who drives.

⛔ **Locked constraint:** ADR-026 Decision 4 wires prove-red into every gate so mutation regressions are *"caught
on every run"*. This task changes what a coder runs **while working** — **not** what `npm test`, CI or the
release gate run (`package.json`'s `test`, `.github/workflows/test.yml` and `bin/release.mjs` unchanged).

## Key Changes
- **Measured first** (worklog, Apple M4 Pro, machine not idle, load 4–9): `test:unit` **55–56 s** (1017
  tests); `test:prove-red` **651 s**; `npm test` ≈ **12 min** derived; the 10-file live-tree set **27.7 s**
  (372 tests); the 6 content guards alone 1.7 s. CI's last 20 runs (2026-09-15 → 10-02) **5.8–10.9 min, all
  green** — no run near the 20-min timeout, so the brief's stop condition did not fire. ⚠️ The record's
  "6–8 minutes" was already stale.
- **A new `npm run test:docs`** — every test file that reads the live `ai-agents/` tree (owner OQ2): ten files
  (`adr-number-uniqueness`, `board-narrow`, `board-reader`, `board-root`, `closed-rank-immutability`,
  `coordination-citation-policy`, `dashboard-contract`, `dual-home-parity`, `reference-integrity`,
  `task-id-uniqueness`). Repo-local.
- **fkit's own table lives repo-local, in `CONTRIBUTING.md`**; a **generic** rule ("map the changed paths to the
  project's checks; run everything at release and when unsure") went into the shipped procedures (coder, plan
  step, both ship loops' verify steps). A mixed change runs the heaviest applicable row; a skipped check is
  **not** a passed one and the report says which ran. Owner review rulings: `ai-agents/wiki-vault/` stays in
  the "nothing" row except `schema.md` (R1); `CLAUDE.md` / `AGENTS.md` join the `test:unit` row (R3).
- **Not in the shared rules block** (byte cap).

## Outcome
- Owner OQ1: **CI keeps running everything** — no path filters, no follow-up. OQ3: a link check for the root
  docs was filed as **`0484`** (open). The stale `fkit-task-ship-loop` → `fkit-coder.md:109-113` cite it found
  went to `0472` (item 8).
- ⚠️ **The runtime picture kept moving after close.** Its derived "~12 min" went into `CONTRIBUTING.md`; by
  2026-10-09 the owner's Mac measured 23.1 to ~48 min under load, and task `0503` (open) was filed to
  re-measure locally and on CI. `0395` raised CI's timeout to 33 min.

## Related
- [[tasks/sprint-10-the-0472-0482-batch]] — `P2`
- [[tasks/find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic]] — `0477`, same runner; measured after it
- [[tasks/re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout]] — `0395`, where the stale runtime wording was routed
- [[tasks/make-board-root-test-reliable-under-machine-load]] — `0502`; `test:docs` includes that file
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — Decision 4, which this deliberately leaves intact
- [[decisions/adr-014-how-fkit-tests-itself]] — `node --test`, zero dependencies
- [[systems/testing-and-verification]]
- *Added 2026-10-15 (sync `baf6a4e`→`96c7263`):* [[tasks/check-the-links-in-fkits-top-level-docs-not-only-under-ai-agents]] — `0484` ✅ closed 2026-10-14: the top-level docs now have their own `CONTRIBUTING.md` row naming `test/top-level-doc-links.test.js`, run by `npm run test:docs` · [[tasks/fix-nine-stale-line-cites-and-claims-found-during-sprint-10]] — `0496`, one source of whose stale items was this task
