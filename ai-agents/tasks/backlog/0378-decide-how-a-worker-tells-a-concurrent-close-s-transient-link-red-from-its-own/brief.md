# Decide how a worker tells a concurrent close's transient link-guard RED from its own — a close that moves a folder is not atomic with re-pointing the hrefs into it

## ID
0378

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Authority

**Owner ruling, 2026-09-05**, given live via `AskUserQuestion` — **the option label is the verbatim
text: "File it as its own row (Rec)"**.

Filed by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of the ruling and deciding nothing beyond them.

⚠️ **Filed UNRANKED onto the Backlog board — this row APPENDS and renumbers nothing**
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### ⛔⛔ THE HAZARD — a mechanism, stated exactly

**A close that moves a task folder is NOT atomic with re-pointing the hrefs into it.**
`/fkit-task-done` moves the folder at its step 3 and re-points inbound links at its step 5. Between
those two acts the repository is in a state where **links into the moved folder do not resolve**.

⛔ **Any link guard run inside that window reds — and it reds on files the runner never touched.**

### ⭐ IT HAPPENED LIVE, AND THE NEAR-MISS IS THE POINT — NOT A HYPOTHETICAL

Measured and recorded during
[`0361`](../../done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md)'s build
turn, 2026-09-05, in that task's
[`worklog.md`](../../done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/worklog.md)
§*"⚠️ A transient guard RED observed mid-turn — not mine, and now cleared"*. The sequence, all
measured by the coder:

1. Guards **41 / 41**, immediately after that coder's own fixes.
2. Minutes later, same command: **41 / 40 / 1**. `L2 live corpus: BROKEN is 0` failed with
   **7 unresolved links across 4 files** — `sprint-7.md`, `0376`'s brief, and the **closed** briefs of
   [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md) and
   [`0357`](../../done/0357-sweep-b-the-single-site-correction-notes/brief.md).
3. **Cause:** task `0357` moved `backlog/` → `done/` **during that turn**, and links pointing at it —
   plus its own outbound links to `0358`, still in `backlog/` — had not yet been re-pointed.
4. ⭐ **The coder correctly repaired nothing.** It established that none of the four files was on its
   own surface (`test/closed-rank-immutability.test.js` plus its own folder's `review.md` and
   `worklog.md`, none of which links to `0357` or `0358`), waited, and re-measured after the other
   worker finished: **41 / 41, 0 broken links, 3295 targets resolved.** The red cleared on its own.

⛔⛔ **THE NEAR-MISS IS THE WHOLE REASON THIS ROW EXISTS.** A worker that assumed the red was its own
would have edited **four files it had no business touching** — and **two of them are closed task
folders**, where the standing rule is that a closed record's **claims are frozen and a correction is a
dated note**, never an in-place rewrite (the rule `/fkit-task-done` states as *"a historical record's
claims are frozen; its links are not"*, and which
[`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
states for board rank as *"append-only against closed history"*).

> ⚠️ **Citation correction, made at filing 2026-09-05 and recorded rather than smoothed.** The ruling
> as relayed to the filing producer attributed the append-only rule to **ADR-034**. **That is wrong**
> — verified firsthand: `adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md`
> is about **review-ledger scope**, and **no ADR in `knowledge-base/decisions/` states a closed-record
> append-only rule**. ⭐ **The substance of the ruling is unaffected** — the rule is real and is cited
> above from where it actually lives. ⛔ **Do not restore the ADR-034 citation.** ⚠️ **Open question
> for the owner:** should this rule get an ADR of its own? It is currently stated only inside a skill
> and, for one narrow case, a convention.

⚠️ **The correct outcome depended entirely on one worker's judgement.** ⛔ **Nothing in the repository
made it the default**, and nothing would have caught the wrong choice.

### ⚠️ Why it is getting more likely, not less

The ship-loop drives several workers concurrently, and Sweeps A/B/C close folders in bulk — `0357`'s
close moved **18** briefs in one act. ⭐ **Concurrency plus bulk closes is exactly the condition that
opens the window**, and both are now normal operating mode.

### ⛔⛔ DISTINCT FROM `0363` — SAY SO IN WHATEVER THIS ROW PRODUCES, SO THE TWO ARE NOT MERGED LATER

[`0363`](../0363-design-the-sweep-completion-step-that-stops-a-fixed-class-recurring-one-file-over/brief.md)
owns **claim propagation** — a fixed class recurring one file over, i.e. a *correctness* question
about whether a repair reached every site.

⛔ **This row owns a CONCURRENCY hazard** — a *timing* question about a repository observed mid-write
by a second process. The links here are not wrong; they are **not yet right**, and they become right
without anyone touching them.

⚠️ **A merge of the two would produce a design that answers neither**, because a propagation sweep has
no notion of "wait and re-measure" and a concurrency rule has no notion of "find the missed site".
⭐ **Both rows may stand; the overlap is zero.**

### ⭐ FRAME THE QUESTION — ⛔ THIS BRIEF DOES NOT DESIGN THE ANSWER

**The question, stated once:** *when a worker's guard run reds on files outside its own surface, how
does it know — reliably, not by judgement — that the red belongs to a concurrent close rather than to
itself, and what is it then required to do?*

⛔ **This brief deliberately proposes no mechanism.** It names the shape of the answer only so the
investigation is bounded, and ⚠️ **a run that arrives having already chosen one has failed the row**:

- Is the answer **procedural** (a rule in the worker-facing skills: measure your own surface, and a
  red outside it is reported and re-measured, never repaired)?
- Is it **mechanical** (something that makes the window observable, or narrows it)?
- Is it **coordination** (something about how the driver sequences concurrent closes)?
- ⭐ **Is it "do nothing, and write the hazard down"?** ⛔ **This must be costed as seriously as the
  others.** The window is short, the red is self-clearing, and the failure mode requires a worker to
  act wrongly — a heavyweight fix may cost more than the hazard.

⛔ **What must NOT be pre-decided:** whether `/fkit-task-done` should become atomic. That is one
candidate among several, it has its own costs, and naming it here would be designing the answer.

## What to build

⚠️ **INVESTIGATION / DECISION ROW — ⛔ it ships a recommendation, not a change.**

1. **Re-derive the incident firsthand** from `0361`'s worklog and the git history of `0357`'s close.
   ⛔ **Do not inherit the figures above** — they are a dated observation of 2026-09-05
   ([`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)).
2. **Establish the window's real size and shape.** Which guards are exposed (the link/citation guards
   at minimum), what a mid-window run actually reports, and whether the window is bounded by a single
   skill invocation or can span turns.
3. **Determine whether any existing rule already covers it.** ⭐ **A recorded "already covered, here is
   where" is a legitimate and cheap outcome** — check the worker-facing skills and
   `knowledge-base/conventions/` before proposing anything new.
4. **Cost at least three shapes, including "do nothing", each with its main tradeoff.**
5. **One recommendation**, with the tradeoff stated. If the recommendation is a rule change, name the
   exact file(s) it would land in — ⛔ **but do not write the change.**
6. **State the `0363` distinction explicitly** in the deliverable, in the terms above.

**Deliverable:** a report under `ai-agents/knowledge-base/reports/`. ⛔ **`git diff --stat` must show a
new report file and nothing else.**

## Verification steps

1. `git diff --stat` shows exactly one new file, under `knowledge-base/reports/`.
2. Every figure in the report is dated and attributed to a command the report names.
3. The report states the `0363` distinction and does not propose a merged treatment.
4. The report costs "do nothing" with the same rigour as the other shapes.
5. ⚠️ `npm test` is **not** evidence for this row — no test observes the hazard. Say so rather than
   citing a green suite.

## Notes

- **Depends on nothing.** The incident is already recorded and `0361` has closed.
- ⛔ **Out of scope:** editing `/fkit-task-done`, editing any guard, repairing any link, and touching
  `0357`'s or `0356`'s closed folders (closed records: claims frozen, corrections are dated notes —
  see the citation correction above).
- ⛔ **No wiki write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **Movers are producer-only** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md));
  route the close to the producer.
- **Owner: `fkit-architect`** — the deliverable is a costing/decision report, which is the architect's
  ([ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)).
  ⚠️ If the recommendation is adopted, the implementation is a **separate row**.
- ⭐ **Open question for the owner, deliberately not decided:** should the report, if it recommends a
  rule change, be followed by an ADR? ⛔ Not assumed here.
