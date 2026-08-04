# Build the `/fkit-wiki-update` skill — the lead's sync-then-lint sequencer

## ID
0216

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**The owner's rationale, in their words (2026-08-04):** *"I often use the both skills one-by-one after
a bunch of changes in the projects."*

Today, refreshing the wiki after a batch of work means two separate `fkit wiki` sessions — one to run
`/fkit-wiki-sync` (ingest what changed since the watermark), then another to run `/fkit-wiki-lint`
(health-check the vault). This task packages that pair as a single **lead-owned** skill that spawns the
wiki role for each step in turn.

**It is a driver, not a doer** — the same shape as `/fkit-sprint-ship-loop`. The lead writes nothing to
`ai-agents/wiki-vault/`; it spawns `@fkit-wiki`, which does. **This preserves
[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
exactly** — the vault's exclusive write gateway is unchanged, and the ADR-018 hook still enforces it
against the real invoking agent's identity at any spawn depth.

### Feasibility — checked, not assumed

`0111` (the sprint ship-loop) was nearly killed at review by finding a spawned worker **refuses** the
work it was spawned for. That failure mode was checked here **before scoping**, on 2026-08-04:

- **Neither `/fkit-wiki-sync` nor `/fkit-wiki-lint` carries a session-only refusal.** Grepped both
  `SKILL.md` files for `session-only` / `refuse` / `spawned` / `headless` — no hits.
- **`claude/agents/fkit-wiki.md` explicitly sanctions the delegated path.** Its §*"Two modes"* names
  **mode B — "Invoked with a concrete request (the usual path — another role hands you an ingest /
  lint / sync / deep query)"** — and instructs the agent to route straight to the procedure rather than
  report readiness or ask which task. This skill is exactly mode B, twice.

**Verify both of these still hold before building** — they were true on 2026-08-04 and a citation that
no longer resolves is itself a finding.

### The order is binding, and worth stating

**Sync first, then lint.** Sync ingests the delta since the `.wiki-watermark` commit; lint health-checks
what is there. Linting a vault that has not yet absorbed the changes lints a stale corpus — it would
pass, and the pass would mean nothing. The owner's step 2 (*"wait until the wiki-sync is done"*) is what
makes this sequential rather than parallel, and it is a **requirement, not an optimisation**.

### ⚠️ One open risk this task must NOT invent an answer to

**A spawned worker can die mid-run.** Task `0167` (*"Decide what the sprint driver does when a spawned
worker dies"*) records that this has **already fired twice in two consecutive driver runs**, both times
an API 529, and that both recoveries were improvised because `SKILL.md` describes none of them. **`0167`
is open and unruled.**

This skill has the identical exposure — worse, in one respect: if the **sync** worker dies part-way, the
vault is partly ingested, and running lint on it is precisely the stale-corpus case the ordering rule
exists to prevent. **Do not design a recovery here.** State the exposure in the skill, stop and report
rather than guessing, and let `0167`'s ruling govern once made.

## What to build

`claude/skills/fkit-wiki-update/SKILL.md`, following the house shape of the existing skills:

1. **The owner banner** — `⛔ Owner: the lead`, in the sibling blockquote form (**not** the bare-H1 form
   that task `0120` had to fix in `fkit-sprint-ship-loop`; use `fkit-task-ship-loop` as the model).
2. **Step 1 — spawn `@fkit-wiki` to run `/fkit-wiki-sync`.** No argument by default; the skill may accept
   and pass through `/fkit-wiki-sync`'s own optional argument (a date, or `force`).
3. **Step 2 — wait for it to return, and read what it returned.** Do not start step 3 until step 1 has
   completed. If sync reports a failure, a partial run, or nothing at all: **stop and report; do not
   lint.**
4. **Step 3 — spawn a second `@fkit-wiki` to run `/fkit-wiki-lint`.**
5. **Step 4 — report both results to the owner as one summary**, keeping them distinguishable: what sync
   ingested, what lint fixed, and **what lint flagged as needing judgment**.

Three things the skill must state explicitly:

- **It writes nothing itself.** Every vault write happens inside a spawned `@fkit-wiki`.
- **Lint's judgment calls come back in the worker's reply, and the lead relays them.** `/fkit-wiki-lint`
  step 5 fixes what is safe and *flags* what needs human judgment. A spawned worker has **no
  `AskUserQuestion`** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  so those flags must be returned as text and surfaced by the lead — never dropped.
- **It closes no task.** Per [ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
  §2 the wiki role flags *"task N ready to close"* and the close routes to the producer. If either
  worker returns such a flag, relay it; do not act on it.

**Out of scope:** wiring the skill into the lead's ownership list, the mirrors, and the hook test matrix
— that is `0217`. Until `0217` lands, this skill exists but the ADR-018 hook will **deny** it to the
lead. That is expected, and it is why the two are ordered.

## Verification steps

1. `claude/skills/fkit-wiki-update/SKILL.md` exists and its frontmatter parses — the `/` menu shows the
   real `description`, **not** the file's H1. (A silent fall-back to the H1 is the hazard task `0136`
   exists to guard; three skills already carry it.)
2. Its H1 is a descriptive title in the sibling style, with the `⛔ Owner: the **lead**` banner as a
   blockquote below it — matching `fkit-task-ship-loop`, not the pre-`0120` `fkit-sprint-ship-loop`.
3. The skill body states all three of: it writes nothing itself; lint's judgment flags are relayed, not
   dropped; it closes no task.
4. The sync-before-lint order is stated **with its reason** (a lint over an un-synced vault passes
   meaninglessly), not merely as a numbered list.
5. The stop-on-sync-failure rule is present, and the `0167` worker-death exposure is named as an open,
   unruled risk rather than answered.
6. `npm test` is green. Measure and report the count; do not quote a number from this brief.
7. **The skill is not yet runnable by the lead, and that is correct** — confirm the ADR-018 hook still
   denies `lead × fkit-wiki-update` until `0217` lands. A skill that runs before it is wired would mean
   the hook is not enforcing.

## Notes

- **Depends on:** nothing.
- **Blocks:** 0217.
- **Owner:** fkit-coder — a new `SKILL.md`.
- **Edit the canonical source in `claude/` only.** `.claude/skills/` is a gitignored copy refreshed by
  `claude/fkit-claude-init.sh .`.
- **No ADR-027 dual-home surface.** `claude/skills/` is not an `ai-agents/` ↔
  `claude/scaffold/ai-agents/` parity pair, so the
  [dual-home-parity](../../../knowledge-base/conventions/dual-home-parity.md) rule does not apply.
  Checked at scoping time, per ADR-027 §Decision 1.
- **Model it on `/fkit-sprint-ship-loop`, which is the same driver shape** — spawn a typed worker, await
  the return, relay what surfaced. It is far simpler: two fixed steps, no eligibility set, no close
  routing, no per-task loop.
- **Producer's note on scope:** the owner described a fixed two-step sequence, so this is scoped as an
  implementation task, not an investigation. The one genuinely unknown — worker-death recovery — is
  deliberately excluded and pointed at `0167`.
- No commit — leave the new file in the working tree.
