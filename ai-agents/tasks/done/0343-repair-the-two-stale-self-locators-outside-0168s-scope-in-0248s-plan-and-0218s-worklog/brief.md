# Repair the two stale self-locators outside `0168`'s scope — `0248`'s `plan.md` and `0218`'s `worklog.md`

## ID
0343

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Why this is its own brief

`0325`'s planner surfaced two stale self-locators on 2026-08-26 that **no open task owns**, and
`0325` itself put them out of scope (*"flag those two, do not fix them here"*). They are filed
separately from `0342` (the `fkit-task-cancelled` mirror) because they are a different kind of
change — two record files under `done/`, not a skill — and they ship and verify on their own.

### Checked against `0168` — it does NOT cover them

`0168` (`0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers`, `🔲 Backlog`) scopes
its population, in its own words, to **`ai-agents/tasks/done/*/review.md`'s `^Task: ` header** — 40
dead headers on 2026-07-31, 44 on 2026-08-23. Its `## What to build` item 1 names `review.md` only;
items 2–5 are the generator, the movers, `cancelled/`, and `0080`'s missing header. **Neither file
below is a `review.md`.** Verified by reading `0168`'s brief in full on 2026-08-26. `0325`'s brief
reached the same determination on 2026-08-23 (*"outside `0168`'s stated scope"*).

### The two instances, measured 2026-08-26

| File | Line | Reads (fragment) | First `## ` heading | Verdict |
|---|---|---|---|---|
| `ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability/plan.md` | `:12` | `**Task:** \`ai-agents/tasks/backlog/0248-…/brief.md\`` | `:15` | **locator** — header field, points at its own brief |
| `ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/worklog.md` | `:8` | `**Plan:** \`ai-agents/tasks/backlog/0218-…/plan.md\`, approved by` | `:16` | **locator** — header field, points at its own plan |

Both sit in the **header block** (above the file's first `## ` heading), both are named fields whose
value is a path into their own folder, and both assert nothing — the definition `0325`'s rule uses
and the owner's Q2 ruling of 2026-08-26 (*"Header block only (Recommended)"*) fixed. Both paths point
at nothing today: the folders are under `done/`.

**Precedent for the treatment:** `0250`'s two locators were re-pointed on 2026-08-23 under the owner
ruling *"Re-point them, add rule to task-done (Recommended)"*. This task gives these two the same
treatment.

### What else is in those folders — the freeze list is part of the job

Other hits for `0218`'s folder name inside its own folder, measured 2026-08-26:

| File | Line | What it is | Treatment |
|---|---|---|---|
| `worklog.md` | `:212` | body prose naming `…/backlog/0218-…/review.md` | **freeze** — below the first `## `; body-prose forwarding pointer, frozen and reported per Q2 |
| `review.md` | `:3` | `Task:` ledger header | **not this task's** — `0168`'s population |
| `review.md` | `:4` | `File(s) under review:` naming `0177`'s `backlog/` path | **freeze** — another task's path, a claim |
| `review.md` | `:101` | `git diff -U0 -- …/backlog/0218-…/brief.md` | **freeze** — captured command |

`0248`'s folder was **not** classified beyond `plan.md:12` here — do it at plan time (see
verification step 1). ⚠️ Coordinates are a 2026-08-26 snapshot; re-measure.

## What to build

1. **Re-point the board segment of the two locators** — `tasks/backlog/` → `tasks/done/` — **and
   change nothing else on either line**: same key, same backticks and bold, same absolute-or-relative
   form, same file named, line count unchanged. Two tokens, two files.

2. **Apply the landed `/fkit-task-done` self-locator rule as the test**, not this brief's summary of
   it: `claude/skills/fkit-task-done/SKILL.md` step 5, *"The moved folder's OWN self-locators"* (added
   by `0325`). If `0325` has not landed yet, the owner's two rulings above are the rule; the treatment
   is the same.

3. **Leave every evidence hit byte-identical** and list each with its reason in the worklog — the
   freeze calls are judgments and this list is the only place they can be checked.

4. **Do not convert form.** The durable, location-free form (`` `NNNN` `` + relative `./brief.md`,
   [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md))
   is `0326`'s write-time work and `0168`'s remediation form. This task is the minimal path-token
   repair, matching what was done for `0250`. If the owner would rather these two go straight to the
   durable form, that is a one-line ruling to record here first — flagged, not assumed.

⛔ **Out of scope:** any `review.md` `Task:` header (`0168`); any skill edit (`0325`, `0342`); any
other `done/` folder; any write to `ai-agents/wiki-vault/`.

## Verification steps

1. **Classify every self-hit in both folders before editing**:
   `grep -n "<folder-name>" ai-agents/tasks/done/<folder>/*.md` for each, every hit landed in
   exactly one of *locator → repaired* / *evidence → frozen* / *`0168`'s*, and the three lists sum
   to the hit count. Report all three lists.

2. **Both re-pointed paths exist on disk** — test with a file-existence check, not a string match;
   they are code spans, so no link check reaches them.

3. **`git diff --numstat`** shows exactly two files, **1 insertion / 1 deletion each**; `git diff -U0`
   shows the board token as the only change on each line.

4. **`0250`'s two repaired locators (`plan.md` `Brief:`, `review.md` `Task:`) read the same shape** as
   the two repaired here — same treatment, same form — so the corpus does not gain a third style.

5. **`npm test`** green; state the count (no test is expected to change).

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Sequencing, not a gate:** cheapest after `0325` lands, so the coder applies the landed rule text
  rather than the plan's proposal; the owner rulings that justify the repair already exist.
- **Filed 2026-08-26** by a spawned producer (no owner channel) while filing `0342`, on the
  `/fkit-sprint-ship-loop` driver's instruction to carry these two unowned items. Backlog board — no
  sprint named.
- **A related follow-up is NOT filed here:** the corpus test `0325`'s plan named (*no `done/*/` record
  carries a stale self-locator*, red on day one at 46 instances, gated on `0168`). Flagged for the
  owner in the filing report.
- **Cite tasks by folder ID, never by board rank** —
  [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md).
