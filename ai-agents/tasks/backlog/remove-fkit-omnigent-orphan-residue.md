# Remove the `.fkit/` Omnigent-orphan residue from consuming projects

## Sprint
Sprint 2

## Priority
36

## Status
🔲 Backlog

## Context

**Dead Omnigent residue is still sitting in projects that used the old runtime.** Per the migration
report's §9
([`reports/2026-07-14-migration-mechanism.md`](../../knowledge-base/reports/2026-07-14-migration-mechanism.md)),
the following paths are orphaned by the Omnigent removal and have **zero references in current code**:
`.fkit/agents/`, `.fkit/run`, `.fkit/team-session`, and `.omnigent/`. They exist in this very repo right
now. They do nothing, and they confuse anyone reading the tree.

**This is the one destructive act in the whole migration report** — an `rm -rf` inside a user's project,
with **no rollback**. That is exactly why it was carved out of the additive-convergence work (tasks
25–28), which is *additive by invariant* and never deletes anything. Smuggling a delete into that
every-launch, unattended pass would inherit "runs silently on every launch" for the one operation that
must never be silent.

**⚠️ The report's own draft target list was wrong once already.** Rev 1 named **`.fkit/settings`** for
deletion — which is **live ADR-010 lockdown state, rewritten on every launch** (`fkit-claude.sh`
builds it, see the skill-lockdown machinery). A reviewer trusting that table would have shipped a delete
of live state. **`.fkit/settings` must NOT be touched.** The target list below is exhaustive and any
addition to it is a new owner decision.

**Owner decision (2026-07-15):** greenlit as its own task with its own owner gate, to be done **after
tasks 25–28 land** — resolving Sprint 2 open question 5.

## ✅ Owner decision (2026-07-17) — consent model: **announce-only**

**The owner ruled: announce-only** — delete on run, print exactly what was removed. Rationale
(owner's, verbatim in spirit): the task is strictly Omnigent-scoped, and *"currently I am the only
user of fkit"* — the ask-once / dry-run-first ceremony buys nothing for a single-operator install.

- The ruling **decides this cleanup only** — it sets no precedent for any future destructive
  operation, which returns to the owner per the standing re-raise trigger.
- The **dry-run capability, per-path announcement, reference-check gate, and non-fatal bar below all
  still apply** — announce-only is the consent model, not a waiver of the safety bar.
- The rejected options, for the record: **ask-once** (needs clone-surviving stored consent — the T28
  trap) and **dry-run-first** (two-step ceremony). Rejected as unnecessary for the current user base,
  not as wrong.

**Task 36 is unblocked.** The coder's plan may begin.

<details><summary>Original options put to the owner (for the record)</summary>

- **Announce-only** — delete on run, print exactly what was removed. Simplest; irreversible without git.
- **Ask-once** — on first detection, show the target list and require confirmation; record the choice so
  it is not re-asked. Safer; needs a stored decision that must itself survive a clone (same trap as the
  T28 opt-out — see note).
- **Dry-run-first** — first run only *reports* what it would delete; a second explicit invocation
  performs it.

</details>

## What to build

*(Shape only — the consent model above rewrites the details, so this is scoped after that ruling.)*

- A **one-time cleanup** (not part of the every-launch additive pass) that removes exactly the four
  orphan targets: `.fkit/agents/`, `.fkit/run`, `.fkit/team-session`, `.omnigent/`.
- **A hard reference-check gate, re-run at build time:** before any target is deleted, confirm it has
  **zero references** anywhere in current `claude/` sources. A target that has gained a reference since
  this brief was written is **not** deleted, and the discrepancy is surfaced. This is the guard the rev-1
  `.fkit/settings` mistake would have tripped.
- **Never touch `.fkit/settings`** (live lockdown state) or anything not on the exhaustive target list.
- **A dry-run capability** regardless of the chosen consent model — the operator must be able to see the
  exact deletion set before it happens.
- **Announce every deletion**, by path, on the run it happens. No silent removal, ever.
- **Non-fatal** — a cleanup failure must never brick the launcher (same bar as task 26).

## Verification steps

- **The target list is exactly four paths** — `.fkit/agents/`, `.fkit/run`, `.fkit/team-session`,
  `.omnigent/` — and running the cleanup removes those and **only** those.
- **`.fkit/settings` survives** a cleanup run untouched, and a normal `fkit` launch still rebuilds/uses
  it — prove the lockdown state is intact afterward (a role session still gets its skill overrides).
- **The reference-check gate works:** artificially add a reference to one target in `claude/` sources,
  run the cleanup, and confirm that target is **refused** (not deleted) with the discrepancy reported.
- **Dry-run** reports the deletion set and removes nothing; `git status` / the tree is unchanged after a
  dry-run.
- **The chosen consent model behaves as ruled — announce-only:** the run deletes and prints every
  removed path; there is no confirmation prompt and no stored consent state.
- **Non-fatal:** force a deletion failure and confirm `fkit` warns and still starts.

## Notes

- **Owner: fkit-coder** — a production launcher/init change.
- **Depends on: tasks 25, 26, 27, 28.** The owner gated this "after 25–28 land." Task 28 (additive
  convergence) is the nearest — this cleanup must not ship before the migration family it follows, and it
  reuses task 26's non-fatal bar. **Depends on: 28 (hard).**
- **Consent-model ruling: DECIDED — announce-only (2026-07-17).** The former hard prerequisite is
  satisfied; the coder's plan may begin.
- **Risk: high — this is the only irreversible operation in the migration work.** Everything else in
  tasks 25–28 is additive. Treat the reference-check gate and the fixed target list as the specification.
- Technical/evidence source: migration report §9. **Do not expand the target list without a fresh owner
  decision** — the list is exhaustive by ruling, not by convenience.
