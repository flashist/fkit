# Record the sprint lifecycle — explicit sprint statuses, and "current sprint(s)" = every sprint In progress

## ID
0337

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**The owner's report, verbatim (2026-08-25, given live to the lead):**

> When I ask leads about the status of the current sprint, they are always getting confused by what I
> mean when I am saying "current sprint", very often they are telling me about the not completed sprint
> with the highest number, but it's incorrect, because the "current" sprint means the sprint that is
> currently active, usually it's the sprint with the smallest number which is not completed.

**Owner rulings, 2026-08-25, live via `AskUserQuestion` — option labels verbatim** (put by the
producer as `NEEDS-DECISION`, relayed by the lead):

- **OQ-1 — single-board choice:** **"Default lowest + marker override (Recommended)"**.
- **OQ-3 — a finished-but-unarchived plan:** **"Yes — banner makes it ineligible (Recommended)"**.
- **OQ-2 — same-N suffix order:** the owner did **not** pick an option. Verbatim answer:
  > I think we need to change the way we work with sprints: we need to add the statuses to the
  > sprints, similarly to the way we work with tasks: backlog, in progress, done, cancelled. If we do
  > it that way, when we ask abut the status of the sprint, actually ALL the currently active sprints
  > should be reported about.

**Second round — the three design decisions, ruled by the owner 2026-08-25, live via
`AskUserQuestion`, option labels verbatim** (put by the producer as `NEEDS-DECISION` SD-1..3, relayed
by the lead):

- **SD-1 — where a sprint's status lives:** **"Line-3 banner (Recommended)"** — a line-3 header
  banner in a fixed grammar generalising `> ## 🔒 CLOSED — <date>.` to one banner per status.
- **SD-2 — cancelled sprints:** **"`sprints/cancelled/` (Recommended)"** — their own folder.
- **SD-3 — sprint closes:** **"Mover skills, producer-only (Recommended)"** — `/fkit-sprint-done` +
  `/fkit-sprint-cancelled`, producer-only under ADR-033's reasoning, agent-closed marker when no
  owner. Filed as `0341`.

**That third answer of the first round reframes the work.** The definition this task records is
therefore:

> **A sprint has an explicit status — `Backlog` / `In progress` / `Done` / `Cancelled` — mirroring the
> task lifecycle. "Current sprint(s)" = "active sprint(s)" = every sprint whose status is
> `In progress`. Asked for the status with no sprint named, `/fkit-status` reports ALL of them.
> Where one board must be chosen (the ship-loop drives one plan), the default is the
> lowest-ordered `In progress` sprint, overridable by an explicit active-sprint marker (OQ-1). A
> sprint whose status is `Done` or `Cancelled` — by status or by the `🔒 CLOSED` banner — is never
> reported as active (OQ-3).**

### How TASK status is carried today — the model to mirror (checked 2026-08-25)

Three carriers, reconciled by the dashboard, with the two terminal states gated behind mover skills:

| Carrier | Where | Evidence |
|---|---|---|
| The brief's own field | `## Status` in `brief.md`, one of six values | `conventions/task-status-vocabulary.md:11-21` (the set; `Set by` column) |
| The board row | leading cell of the plan's `## Status` table | same doc `:3-4`; `dashboard.sh:372,452-461` parses exactly that table |
| Folder location | `tasks/backlog/` · `tasks/done/` · `tasks/cancelled/` | `fkit-task-done/SKILL.md:98-104` moves the folder with `git mv`; `dashboard.sh:879` reports `malformed-folder`/location drift |
| Terminal states are mover-only | `✅ Done` / `⛔ Cancelled` set only by `/fkit-task-done` / `/fkit-task-cancelled`, producer-only, hook-enforced | vocabulary `:26-33`; ADR-033; `fkit-task-done/SKILL.md:144-152` updates every tracked location |
| Agent-closed marker | `(agent-closed — not owner-verified)` when no owner present | vocabulary `:14-17`, ADR-033 §5 |

### How SPRINT status is carried today — two implicit carriers, no vocabulary, no mover

- **Location only.** Open plans sit at the top of `ai-agents/sprints/`; *"Completed sprints move to
  `sprints/done/`"* (`ai-agents/README.md:9`; scaffold copy `claude/scaffold/ai-agents/README.md:8`).
  There is no `sprints/cancelled/` and no `Backlog`/`In progress` distinction — every plan at the top
  is treated as live. Today the top holds only `sprint-6.md` and `backlog.md`.
- **A banner, by precedent.** Every archived plan opens with `> ## 🔒 CLOSED — <date>.` at line 3
  (`sprints/done/sprint-1.md:3` … `sprint-5.md:3`; four carry `Superseded by [Sprint N+1]`, Sprint 5
  omits it by owner ruling). **The selector does not read the banner** — `dashboard.sh:241` is depth-1
  on location only — which is why a finished Sprint 5 kept being reported as active until task `0294`
  moved it (wiki: `wiki/tasks/archive-sprint-5-move-the-plan-into-sprints-done.md`).
- **No mover skill.** Each archival was a hand-scoped, owner-ruled task (Sprint 4 records the
  precedent chain at `sprints/done/sprint-4.md:97-172`). Nothing enforces that the banner and the move
  happen together.
- **The selector's ordering is the highest N** — `dashboard.sh:265` (`identity_gt`, `:187-192`),
  stated at `claude/skills/fkit-status/SKILL.md:39-40` *"taken the highest"*, ruled in ADR-041 §1.4
  (`adr-041…md:66-68, 77-78`; owner ruling 1 at `:315`), pinned by S1/S1b/S2
  (`test/dashboard-contract.test.js:2526-2541`; ADR-041 `:228-229`). ADR-041 itself calls this a
  retained heuristic (`:288-299`) and names the owner's exact report as the re-raise trigger
  (`:330-332`), with option (d) — an explicit active-sprint marker (`:265-268`) — as the named exit.

### Two constraints the ADR must design around

1. **`## Status` is taken.** In a sprint plan, the `## Status` heading *is the task table* —
   `dashboard.sh:357-372` defines `STATUS_HEADING_RE` as exactly `## Status` and `:452` dies without
   it. A sprint's own status therefore **cannot** live under a `## Status` heading in the plan. It
   needs a different carrier — **ruled SD-1: the line-3 banner.** The ADR fixes its grammar.
2. **`/fkit-status` is one skill, one output** (`conventions/one-skill-one-output.md:1-10`). Reporting
   *all* In-progress sprints is one complete output for the empty argument — fine — but the briefing
   is written as seven beats about *one* sprint (`fkit-status/SKILL.md:160-189`), so the shape for N
   sprints must be specified, not left to the model.

### Consumers that carry the old definition

`fkit-status/SKILL.md:26-48` (argument contract, "the active sprint", singular);
`fkit-sprint-ship-loop/SKILL.md:47-48,94` (defers to `/fkit-status`, needs one board);
`claude/agents/fkit-producer.md:15,89` (*"find the active one"*); `claude/agents/fkit-lead.md` (no
definition at all; the lead does not own `/fkit-status` — `claude/skills-for-role.sh:50`);
`ai-agents/README.md:9` and the scaffold copy; no page under `knowledge-base/conventions/` mentions
either term.

## What to build

One ADR (next free number — `044` at filing; re-check at pickup) via `/fkit-record-decision`, that
**supersedes ADR-041 §1.4 and its §Consequences residual** and records the sprint lifecycle. It must
settle, quoting the rulings above verbatim and marking every point below that still awaits an owner
ruling as *proposed*:

1. **The sprint status vocabulary.** Four values, the task markers reused so one eye reads both:
   `🔲 Backlog` (planned, not started), `🔄 In progress`, `✅ Done`, `⛔ Cancelled (YYYY-MM-DD) —
   <reason>`. State whether `🚧 Blocked` exists for a sprint (recommend: no — a sprint is not blocked,
   its tasks are) and whether the agent-closed marker applies to a sprint close (recommend: yes, same
   rule as ADR-033 §5). Name the file that holds the vocabulary (recommend: a new
   `conventions/sprint-status-vocabulary.md`, sibling of the task one — written by `0339`).
2. **The carrier — RULED (SD-1, verbatim "Line-3 banner (Recommended)").** A sprint's status is a
   **line-3 header banner** in a fixed grammar that generalises the existing `> ## 🔒 CLOSED — <date>.`
   (`sprints/done/sprint-1..5.md:3`) to **one banner per status**. The ADR fixes the grammar exactly —
   one line, a blockquoted H2, the status marker, and the date/reason where the vocabulary requires
   one — and states that the five legacy `🔒 CLOSED` banners are members of it, read as `✅ Done`
   (with `Superseded by …` tolerated as trailing prose). Say what a plan with **no** banner resolves
   to (recommend: status unresolved → ineligible + a loud drift fact, never silently `In progress`),
   and that a plan may carry exactly one status banner. `dashboard.sh` becomes the one reader
   (ADR-041 §5) and `identity` mode grows a status output — specify the interface for `0338`. Record
   the rejected candidates (a `## Sprint status` field; an H1 segment; folder-location-only) and why.
3. **What becomes of `sprints/done/` and the `🔒 CLOSED` banner — and `sprints/cancelled/` (SD-2,
   RULED, verbatim "`sprints/cancelled/` (Recommended)").** Location stays a second carrier the way
   `tasks/done/` / `tasks/cancelled/` are for tasks: `✅ Done` plans live under `sprints/done/`,
   `⛔ Cancelled` plans under a new `sprints/cancelled/` (created on first use, like `backlog.md`),
   and the archival move is part of closing a sprint (SD-3), not a separate hand-scoped task. The
   existing `🔒 CLOSED` banner reads as `✅ Done` for backward compatibility (OQ-3 makes it ineligible
   either way). Specify what happens to a cancelled sprint's open rows (recommend: each flips to
   `➡️ Moved to [Backlog](../backlog.md)` per `task-status-vocabulary.md:20`, and the brief's
   `## Sprint`/`## Status`/`## Priority` follow the de-scope procedure in `fkit-task-brief/SKILL.md`
   step 8; closed rows are frozen history), and the href rule for the new folder (`../backlog.md`,
   one hop up, same as `done/`).
4. **The mover — RULED (SD-3, verbatim "Mover skills, producer-only (Recommended)").** Sprint
   `✅ Done` / `⛔ Cancelled` are **skill-gated and role-gated like task closes**: a
   `/fkit-sprint-done` / `/fkit-sprint-cancelled` pair, **producer-only** under ADR-033's reasoning
   (the closing identity separated from the doing identity; role-gating is not prevention; the marker
   stays prose), enforced through `skills_for_role()` in `claude/skills-for-role.sh:51` and the
   ADR-018 hook, writing the `(agent-closed — not owner-verified)` variant when no owner is present
   (ADR-033 §5). Each does banner + move + link repointing + row disposal in one act. `🔲 Backlog` →
   `🔄 In progress` is free for the producer to set by hand (a planning act, like `➡️ Moved`). The
   build is `0341`; this ADR specifies what the movers must do, in the order the task movers do it.
5. **Eligibility and reporting.** Eligible-to-be-active = identity is a `Sprint <N><suffix>` token
   (ADR-040/041 unchanged) **and** status is `In progress`. `Backlog` identity never eligible;
   unresolved never eligible; `Done`/`Cancelled` by status **or** by `🔒 CLOSED` banner never
   eligible (OQ-3). `/fkit-status` with an empty argument reports **every** eligible sprint; with
   none, it says so and lists every candidate with its status. Specify the N-sprint briefing shape for
   `0338` (recommend: beats 1-6 once per active sprint, lowest-ordered first, one dashboard table per
   sprint, one closing "across sprints" line for owner decisions).
6. **The single-board choice** (OQ-1, ruled): where a caller needs exactly one board, take the
   **lowest-ordered** eligible sprint; an explicit active-sprint marker (ADR-041's option (d) — define
   its grammar and carrier alongside SD-1) overrides. **Suffix order:** say whether it still bites.
   Finding at filing: it bites only when two plans with the same `<N>` are *both* `In progress`
   (`Sprint 4` and `Sprint 4c`); with explicit statuses the superseded one should be `Done`/`Cancelled`,
   so the case becomes a drift-shaped anomaly. Recommend: keep ADR-041 §1.4's suffix order within one
   `<N>` (absent < `a` < `b`), pick deterministically, and emit an `ambiguous-active-sprint`-style
   drift record — an architect's call, flagged to the owner as such, not a re-raise of OQ-2.
7. **Drift rules for sprints**, by analogy with the task rules: status says `Done` but the plan sits at
   the top; plan under `sprints/done/` without a terminal status or banner; two carriers disagree.
   Each is a named `drift` fact for beat 6.
8. **Migration.** Name what the existing plans need (this repo: `sprint-6.md` → `In progress`;
   `sprints/done/sprint-1..5.md` → `Done`, banner already present) and the scaffold/README lines —
   the producer files that as `0340`. Name the ADR-041 sites falsified (`:66-68, 77-78, 228-229,
   288-299, 330-332`) and mark ADR-041 superseded-in-part, leaving identity, candidate set, `Backlog`
   token and §1.5 tie-break in force.

## Verification steps

1. A new ADR exists under `ai-agents/knowledge-base/decisions/`; its Authority table quotes OQ-1,
   OQ-3, SD-1, SD-2 and SD-3 verbatim with date (2026-08-25) and channel (`AskUserQuestion`, live),
   and quotes the owner's OQ-2 answer verbatim as the reframe. The ADR is *accepted* — nothing is left
   open for the owner; any point the architect decides alone is marked as the architect's.
2. Each of points 1-8 has its own heading or table in the ADR; none is folded away.
3. `grep -n "highest" <new ADR>` — every hit describes the superseded rule or option (d) history; the
   new single-board rule reads *lowest*.
4. ADR-041 carries a dated superseded-in-part note naming the new ADR and scoping it to §1.4 and the
   §Consequences residual.
5. The ADR's required-tests table gives concrete fixture + expected output for: two In-progress
   sprints both reported; a `🔒 CLOSED` plan at the top never active; a plan with no banner never
   active plus its drift fact; lowest-ordered single choice; marker override; zero eligible → "none"
   with candidates listed; each banner form parsed to its status by `dashboard.sh`.
6. `git status` shows changes only under `ai-agents/knowledge-base/decisions/`.

## Notes

- **Owner: fkit-architect** — an ADR that supersedes part of an accepted ADR and designs a new carrier
  the dashboard must read.
- **Depends on:** nothing. All six owner rulings (OQ-1, OQ-3, the OQ-2 reframe, SD-1, SD-2, SD-3)
  are on record above with date and channel — the architect writes the ADR with them **settled**,
  not open. No owner decision is pending.
- **Blocks:** 0338, 0339, 0340, 0341.
- **Conflict flagged, not planned around:** reverses the owner-ruled ordering of ADR-041 §1.4 and
  replaces its one-active-sprint model. Filed because ADR-041 `:330-332` names this report as its own
  re-raise trigger.
- **Follow-up already filed:** `0341` — the producer-only sprint movers (SD-3).
- **Related:** `0294` (Sprint 5 archival — the precedent for close-by-hand); `0306` (record decay);
  ADR-033 (mover authority); ADR-040 (identity grammar).
