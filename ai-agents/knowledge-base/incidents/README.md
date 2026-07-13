# Incidents — postmortems of fkit's own runtime and tooling

Write-ups of **operational incidents affecting the fkit team's own runtime or tooling** — the agents,
the launcher, the session/subagent machinery, the wiki plumbing. Things that *happened*, recorded
after the fact.

**What does not belong here:**

- **Product bugs** — a defect in the code fkit is building. Those are task briefs
  (`ai-agents/tasks/backlog/`), not incidents.
- **Decisions** taken in response to an incident — those are ADRs (`../decisions/`). An incident may
  *motivate* an ADR; it never *is* one. Link them.
- **Design docs** — see `../architecture.md`.

## Naming

`YYYY-MM-DD-<short-slug>.md`, dated by the day the incident **occurred** (not the day it was written
up). Example: `2026-07-10-subagent-runners-disconnected.md`.

This is the same date-first pattern as `../reports/`, and it is deliberate: throughout the
knowledge-base, **a dated filename means "a record of a moment"**, and a record of a moment never sits
at the root (which holds only `PROJECT.md` and `architecture.md`) or in `../conventions/` — see the
root rule in [`ADR-013`](../decisions/adr-013-knowledge-base-root-holds-the-living-canon.md).

## Who writes here

**Any session** may write an incident doc — it is a record, not a decision, so it does not need the
architect's or the owner's authority to exist. The architect owns this folder's *convention*; nobody
owns a monopoly on reporting what broke. There is deliberately **no skill** that produces these: an
incident write-up is a response to something unplanned, and the shape of the existing incident doc is
the template to follow.

## Lifecycle — records don't get superseded

An incident doc is a **historical record and stays put.** It is not maintained, not refreshed, and
**not moved when the system it describes goes away.** The 2026-07-10 runner disconnection happened on
the Omnigent runtime; Omnigent has since been removed from fkit, and the doc still belongs here,
because it remains *true* — it happened. Only *designs* get superseded (that is what `../history/` is
for); records do not.

Edit an existing incident doc only for **factual corrections** — a wrong root cause, a mistaken claim,
a stale "these failure modes no longer apply" caveat worth adding. Mark the correction inline (the
existing doc's `**Correction (added after initial write-up):**` block is the pattern).

**New findings get a new dated doc or a follow-up task — never a rewrite of the original.** Rewriting
history to match what we know now is how the reasoning behind a decision gets quietly lost.
