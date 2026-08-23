# Discharge the vault's `partial — not ready to close` flag on `0206` — a STALE flag, not a contested close

## ID
0319

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

### ⭐ Why this is its own row and not folded into `0317` — read this first, it is the whole point

`0206` and `0238` carry the **identical** flag line, from the **identical** cause, and closed on the
**same day**. It would be cheaper to make them one task. **They are two rows because the two flags
are different in kind, and merging them would hide that difference:**

| | `0238` — [`0317`](../0317-reconcile-the-vaults-not-ready-to-close-flag-on-0238-with-its-landed-close/brief.md)'s subject | `0206` — **this task** |
|---|---|---|
| What the vault records about the deliverable | **not delivered** — the run that flagged it says the work was not done | **verified present** — recorded in `log.md`'s `## 2026-08-22 — ingest (sync)` entry: *"`0206`'s deliverable was verified present this run"* |
| What the flag therefore is | a **contested close** — the vault and the board disagree about whether the work happened | a **STALE flag** — the vault and the board agree the work happened; only the flag was never withdrawn |
| Its literal acceptance text | **unmeetable** — satisfying it would write a falsehood (Sprint 3 is archived) | **not shown to be unmeetable** — ⛔ **and this task must establish that, not assume it** |
| What the run must produce | a verdict **plus** a record that the acceptance is unmeetable | a verdict — and, if discharged, nothing more |

⛔ **A run that treats this as "the same as `0317`" has lost the finding.** The whole reason the
filing producer split them is that a *stale* flag and a *contested* flag call for different verdicts,
and a reader who sees one row cannot tell which they are looking at.

⚠️ **The `0238` row is `0317`'s and is NOT touched here**, and `0206` is deliberately **not** in
`0317`'s scope — `0317`'s own `## Notes` says so, and adds: *"nothing currently discharges `0206`'s
flag either, and no task covers it. Whether that needs its own row is a producer/owner call, flagged
here, not taken."* **The owner has now taken it. This brief is that row.**

### Authority

**Owner ruling 2026-08-22**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned producer — **the option label is the verbatim
text: "File its own row (Recommended)"**.

The chosen option's description, verbatim:

> *"A second brief for 0206's undischarged flag, keeping the stale-vs-contested distinction the
> producer preserved. Small scope: a wiki pass appending one dated verdict."*

⛔ **`0206` IS NOT REOPENED, RE-STATUSED OR MOVED BY THIS TASK.** It stays
`✅ Done (agent-closed — not owner-verified)` at
`ai-agents/tasks/done/0206-ingest-the-faithful-carry-decision-report-into-the-wiki/brief.md`.

⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel** (`AskUserQuestion` is absent in a
consult —
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
This row **appends** to the Backlog board and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
The Backlog board is unranked by design, so no merit position is stated.

### The record — re-verified firsthand on disk 2026-08-22 by enumerating every `0206` mention in `log.md`

⚠️ **Measured against a DIRTY working tree with a live `fkit-wiki` worker actively writing
`ai-agents/wiki-vault/`.** `HEAD` = `9360177`. ⛔ **Re-measure before acting; `log.md` is being
appended to as this is written.**

**Anchors are entry heading + quoted fragment, never `path:NNN`** — `log.md` is an append-only
coordination document and row 3 of
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
rules a line number **wrong** there, categorically.

⭐ **The flag did not merely go unwithdrawn — it FLIPPED, and nobody reconciled the flip.** Read in
order:

| Entry heading in `log.md` | What it says about `0206` — quoted |
|---|---|
| `## 2026-08-03 — sync` | *"Task 0206's vault work is complete — ready to close"* |
| `## 2026-08-06 — ingest (sync)` | *"Task 0206: partial — not ready to close"* ← **the later flag, and the operative one** |
| `## 2026-08-13 — ingest (sync)` | *"`0199`, `0206`, `0212` and `0239` are untouched and out of this delta"* — **not a verdict** |
| `## 2026-08-22 — ingest (sync)` | *"Nothing withdrew those flags … ⛔ **The flags are not amended** — this log is append-only, and this entry is the dated record of the tension. `0206`'s deliverable was verified present this run"* |

**Two findings from that sequence, both of which this brief exists to carry:**

1. **Nothing withdraws the `partial` flag.** The 2026-08-22 entry names it, explains it, and
   **explicitly declines to amend it**. ⭐ **Recording a tension is not discharging it** — and the
   entry says so about itself.
2. ⚠️ **The 2026-08-03 *"complete"* line and the 2026-08-06 *"partial"* line contradict each other,
   and no entry reconciles them.** A later reader grepping `log.md` for `0206` meets both. ⛔ **This
   was NOT in the ruling's premise and is reported here rather than smoothed over** — the run should
   name both and say which stands.

⚠️ **The 2026-08-22 entry is UNCOMMITTED.** It is absent from `HEAD` and was written into the working
tree by the live `fkit-wiki` worker. ⛔ **Verify it is still there — and still says this — before
citing it.**

**What the deliverable actually was.** `0206`'s `## What to build` is: run `/fkit-wiki-ingest`
against `ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`, carrying
across (a) the report's **checkable vs testimony** evidence separation and (b) the accepted residual
**`carried-not-approved`**, including that `0202` closes only the reconstruction route and not the
class. Its five substantive verification steps are in its brief and are the real test.

⚠️ **A producer's grep found `faithful-carry`/`faithful carry` in 14 vault files, including
`wiki/tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement.md`.** ⛔ **That is
input, NOT the verdict, and a run that quotes it back has not done the work.** It was taken with the
wrong authority (only `fkit-wiki` may pronounce on the vault,
[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
it is **string-shaped** and therefore blind to whether the two things `0206` actually demanded were
carried across, and it was not run through `/fkit-wiki-lint`.

### Conflicts and adjacencies — stated, deliberately not resolved

- **[`0317`](../0317-reconcile-the-vaults-not-ready-to-close-flag-on-0238-with-its-landed-close/brief.md)**
  (`## Owner: fkit-wiki`) — the `0238` half. **Neither gates the other.** ✅ They batch efficiently
  in one librarian session and **may share a single dated entry only if that entry keeps the two
  verdicts separate and visibly different in kind**; ⛔ **a merged verdict covering "both flags"
  fails this task**, because erasing the stale-vs-contested distinction is the exact outcome the
  owner ruled against.
- **[`0290`](../0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md)**
  (`## Owner: fkit-architect`, open) is the **general mechanism** — should anything notice when a
  close falsifies a vault claim? ⛔ **This task is a single instance and must not pre-decide it.** It
  adds no check, no tooling, no convention.
- **[`0318`](../0318-append-a-dated-correction-note-to-0238s-closed-brief/brief.md)**
  (`## Owner: fkit-producer`) annotates `0238`'s **closed brief**. ⚠️ **This task deliberately does
  NOT propose the equivalent for `0206`'s brief** — `0206`'s acceptance has not been shown
  unmeetable, so there may be nothing to correct. **If the run finds `0206`'s brief carries a stale
  claim, flag it to the producer; do not annotate it** (this task's diff is vault-only).
- **`0199`, `0212`, `0239`, `0287`** are the other open `fkit-wiki`-owned vault rows. **None
  overlaps this one.** A scheduling observation, **not** a dependency.

## What to build

**A `fkit-wiki` pass that reaches a verdict on `0206`'s standing flag and appends it to `log.md`.**

1. **Re-enumerate every `0206` mention in `log.md`** — read each individually, do not rely on an
   absence grep — and confirm on the day of the run that (a) the `partial — not ready to close` flag
   still stands unwithdrawn, and (b) the 2026-08-03 *"complete"* line still contradicts it.
   ⛔ **If something has withdrawn it since, say so and stop — the task is already discharged.**
2. **Re-verify `0206`'s substantive deliverable against `0206`'s own five verification steps**, by
   the role that owns the vault: does a vault page cover
   `ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`; does it carry
   the **checkable vs testimony** separation explicitly; does it state the **`carried-not-approved`**
   residual and that `0202` does not close it; does it back-link `0162`'s brief at its **current**
   `tasks/done/` path. ⚠️ **A string grep is a floor, not the check.** Use the vault's own
   verification practice, including the whitespace-normalised form
   (`tr '\n\t' '  ' | tr -s ' '`, then match) and its **stated limits** from
   `durable-citation-anchors.md`.
3. **Append ONE dated `log.md` entry that reaches a verdict**, and say which of the two it is:
   - **discharged** — the deliverable is present, named site by site, and the standing
     `partial — not ready to close` flag is **superseded** by this entry; or
   - **not discharged** — naming exactly what is still missing and what would fix it.
   ⛔ **The verdict must be one of the two. "Recorded the tension" is what the 2026-08-22 entry
   already did and is NOT an outcome for this task.**
4. **In that same entry, reconcile the 2026-08-03 / 2026-08-06 contradiction** — name both lines,
   state which one stands and why, and state that neither is amended.
5. **State, in the entry, that this flag is STALE and not a contested close** — and say what makes it
   so (the deliverable was recorded verified present), **explicitly distinguishing it from `0238`'s
   contested flag**. ⭐ **This sentence is the deliverable as much as the verdict is** — it is why
   this is a separate row.
6. **Emit the run's own flag line in the canonical form** the vault's flag-don't-close convention
   prescribes (task `0125`), naming **this** task — `0319` — and never `0206`.

### Constraints

- ⛔ **`log.md` is APPEND-ONLY — owner-ruled, task `0211`, no exceptions.** Do not amend, annotate,
  reword or delete any existing entry. Both standing `0206` flag lines stay **byte-identical**. A new
  dated entry is the only instrument.
- ⛔ **Do not reopen, move, re-status or edit `0206`** — or its board row. Task files move only via
  `/fkit-task-done` / `/fkit-task-cancelled`, producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
  If this run concludes something needs closing, **flag it to the producer**; it does not close it.
- ⛔ **This task's diff is `ai-agents/wiki-vault/` and nothing else.** Not a board, not a brief, not a
  knowledge-base document, not a skill, not `claude/`.
- ⛔ **Do not touch `0238`'s flag lines or pronounce on `0238`.** That is `0317`'s, and merging the
  two verdicts is the failure mode this row exists to prevent.
- ⛔ **Do not re-rank any board row**, and do not add or alter one.
- ⚠️ **Citations are file + entry heading + quoted fragment, never `:NNN`.**
- ⛔ **No commit, no push, no `git add`, no `git stash`. No secrets in any artifact.**

## Verification steps

1. `git diff --stat` after the run touches **only** paths under `ai-agents/wiki-vault/`. Any other
   path is a failure. ⚠️ **Other workers' dirty paths will appear in `git status`** — scope the check
   to this run's own writes and say how you scoped it.
2. `git diff ai-agents/wiki-vault/log.md` shows **additions only** — zero deleted lines, proved by
   `git diff --numstat` reading `N  0` and by
   `git diff -U0 -- ai-agents/wiki-vault/log.md | grep '^-' | grep -v '^---'` producing no output.
   ⚠️ **Use that filter exactly** — `grep '^-[^-]'` misses a deleted markdown list line.
   ⚠️ **Because another worker's uncommitted appends already sit on this file**, also snapshot it
   **before** editing and run `diff <snapshot> log.md | grep '^<'` → no output.
3. Both pre-existing lines — *"Task 0206: partial — not ready to close"* and *"Task 0206's vault work
   is complete — ready to close"* — are still present and **byte-identical**.
4. The new entry states a **verdict** — the word `discharged` or an explicit `not discharged` — for
   `0206`. A reader who greps `log.md` for `0206` reaches an entry that **answers** the question
   rather than restating it.
5. The new entry **names both contradicting 2026-08-03 / 2026-08-06 lines** and says which stands.
6. The new entry states **in words** that `0206`'s flag is **stale, not contested**, gives the reason,
   and distinguishes it from `0238`'s. ⛔ **An entry that covers "both flags" without a visible
   difference in kind fails this step.**
7. Each of `0206`'s five substantive verification steps is answered individually, **site by site**.
   **A count or a "looks covered" without a list does not satisfy this.**
8. The absence half of the check is done in the **whitespace-normalised** form and its **stated
   limits** — table cells, wording drift, inline emphasis, code fences — are recorded honestly
   alongside the result.
9. `/fkit-wiki-lint` is clean, or every finding it raises is listed with a disposition.
10. `ai-agents/tasks/done/0206-ingest-the-faithful-carry-decision-report-into-the-wiki/brief.md` is
    **byte-identical** to its pre-run state, and `git status --porcelain` shows nothing under
    `ai-agents/tasks/` from this run.
11. The close report's flag line names **`0319`**, never `0206`.

## Notes

- **Depends on:** nothing. Every fact this task settles is checkable on today's tree.
- **Blocks:** nothing.
- **Relates to:** `0317` (the `0238` half — **neither gates the other; may share a session, must not
  share a verdict**), `0318` (the correction note on `0238`'s closed brief), `0290` (the general
  mechanism — ⛔ **not pre-decided here**), `0206` (the closed task this concerns — ⛔ **not
  reopened**), `0199` / `0212` / `0239` / `0287` (the other open `fkit-wiki` vault rows — scheduling
  only).
- ⚠️ **`## Owner` is `fkit-wiki` and that is MANDATORY, not a preference.** ADR-005 makes
  `ai-agents/wiki-vault/` this role's exclusive write gateway; `log.md` is append-only, so **only a
  new dated entry by `fkit-wiki` can discharge the flag**. No other role or session may perform this
  row.
- ⚠️ **This brief decays.** Every measurement was taken **2026-08-22** at `HEAD` = `9360177` against
  a **dirty working tree with a live `fkit-wiki` worker writing the vault**. The 2026-08-22 `log.md`
  entry quoted throughout **is uncommitted**. **Re-measure at implementation time; do not quote these
  figures.**
- ⚠️ **One premise in the ruling was found INCOMPLETE and is corrected here, not smoothed over:** the
  ruling's context said the flag stands and nothing discharges it — true — but did not mention that
  `log.md` also carries an **earlier, contradicting** *"complete — ready to close"* line for `0206`.
  Step 4 of `## What to build` is that correction.
- ⛔ **Do not commit, push, `git add` or `git stash`** unless the owner explicitly asks.
