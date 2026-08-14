# Decide whether anything should notice when closing a task falsifies a vault claim

## ID
0290

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

**Owner ruling 2026-08-13**, given live in a `fkit lead` session and relayed through the driver —
**the option label is the verbatim text**: **"File a task to investigate"**.

### ⚠️ THIS IS AN INVESTIGATION WITH A DECISION AT THE END. IT IS NOT AN IMPLEMENTATION ROW.

⛔ **The mechanism is NOT pre-decided, and this brief must not be read as choosing one.** Its
deliverable is a **recommendation the owner rules on** — including the recommendation
**"change nothing"**, which is a real candidate and is listed as one below. ⛔ **A run of this task
that arrives with code written, a skill edited, or a lint check added has failed it.**

### The observation — three resyncs of ONE vault page in ONE day

`ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` has been the target of **three**
resync tasks dated **2026-08-13**, each triggered by a **different** task closing **elsewhere** and
falsifying a claim written on that page. **Measured on disk 2026-08-13:**

| # | Row | Location | `## Status` | `## Sprint` / `## Priority` | Triggered by |
|---|---|---|---|---|---|
| 1 | `0285` | [`ai-agents/tasks/done/0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md`](../../done/0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md) | `✅ Done (agent-closed — not owner-verified)` | `Backlog` / `Unscheduled` | `0257` — the update-banner fix |
| 2 | `0258` | [`ai-agents/tasks/done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md) | `✅ Done (agent-closed — not owner-verified)` | `Sprint 5` / `Sprint 5 P16` | `0252` — `RELEASING.md` |
| 3 | `0289` | [`ai-agents/tasks/backlog/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md`](../../done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md) | `🔲 Backlog` | `Backlog` / `Unscheduled` | `0254` closing |

**All three are `## Owner: fkit-wiki`.** All three record the same standing exclusion from
`/fkit-sprint-ship-loop` (ADR-005 + ADR-038). **Each was correct work.** ⚠️ **The question is
whether the PATTERN points at a missing step** — not whether any one of them was right.

### ⚠️ THE THREE ARE NOT THE SAME CASE — AND THIS DISTINCTION IS THE HEART OF THE TASK

⛔ **Do not treat them as three instances of one thing.** Measured on disk 2026-08-13:

- **`0285` and `0258` were ANTICIPATED.** `0285`'s own `## Notes` records its provenance: `0257`'s
  brief **named the follow-up in its own out-of-scope list** — *"The vault's
  `systems/install-and-self-update` page quotes the banner text verbatim and will need a resync —
  file it as a follow-up, do not write it."* `0258` was filed **2026-08-08 on an owner ruling, before
  `0252` landed**, and carries `Depends on: 0252 — hard`. ✅ **For these two, a mechanism already
  worked**: a human or a producer read the source brief and predicted the vault fallout **in
  advance**.
- **`0289` was DISCOVERED BY ACCIDENT.** `0254`'s brief mentions the vault exactly once, and only as
  a fence — measured, `0254`'s brief line 72: `- ⛔ Any ai-agents/wiki-vault/ write (ADR-005).` **It
  predicted no follow-up.** The stale claim was found by the `fkit-wiki` librarian **running a
  different task** (`0258`), who noticed it on the same page and **correctly declined to fix it** as
  outside `0258`'s owner-ruled `0252`-only scope, flagging it in place and in `log.md`.

✅ **So the gap is narrower than "three resyncs in a day."** Two of the three were caught by the
existing convention (a brief naming its own vault fallout). **One was caught by luck** — a librarian
happening to open the same page for an unrelated reason. ⚠️ **Had `0258` not existed, nothing in the
project would have noticed.** ⛔ **A run of this task that does not carry this distinction into its
recommendation has mis-stated the problem.**

### ⚠️ A SHARPER FACT THE INVESTIGATION MUST HANDLE — the `0285` resync WROTE the false claim

⚠️ This is not ordinary drift-over-time. **Measured on the page 2026-08-13:** the false claim sits
**inside the `0285` resync's own blockquote** (the block opened at `:72`, labelled
*"Updated 2026-08-13 (the `0285` resync …)"*, whose `:79` clause reads):

> ⚠️ **The unrunnable verify command `bin/release.mjs` prints after a release is a SEPARATE,
> still-open defect** (task `0254`, Sprint 5) … ⚠️ **`RELEASING.md` does not exist yet** — task
> `0252` is still open, which is why the `0258` resync of this page has **not** run.

**Both of those "still open" statements were falsified the same day.** `0252`'s close is recorded by
the `0258` correction immediately below at `:81`; `0254`'s close is what `0289` exists to record.
⚠️ **So a resync pass wrote a same-day-perishable claim about the project's own task state, and the
next resync of the same page had to correct it hours later.**

⚠️ **What this producer could NOT determine from disk, and did not guess:** whether `0254` was
**already closed** when the `0285` block was written, or closed shortly after. File contents do not
say, and git history is too coarse to settle it — the page's only 2026-08-13 commit is `1c82cbf`
*"Wiki update"*, and the task moves sit in three same-day commits all titled *"Sprint push"*.
✅ **Determine it from `ai-agents/wiki-vault/log.md`'s dated entries and the closed briefs' own
worklogs.** ⚠️ **It changes the answer:** if the block was written after `0254` closed, the failure is
**a resync reading stale task state**, and a close-time signal would not have helped. If before, it is
**a claim that perished**, and a close-time signal is exactly the fit. ⛔ **Do not skip this — it is
the single most load-bearing unknown in the task.**

### The gap, stated precisely — ⛔ DO NOT INFLATE IT

⛔ **The gap is NOT "the closer should fix the vault."** It must not, and the recommendation may not
propose that it does.

`/fkit-task-done`'s **step-7 close-out report** already enumerates every document a close touched —
the board row, the brief's own `## Status`, `backlog.md`, in-body status lines, and every re-pointed
href across `sprints/done/`, `sprints/reviews/`, and the knowledge-base. ✅ **It stops at the
`ai-agents/wiki-vault/` boundary, and it stops there CORRECTLY and DELIBERATELY.** Measured in
`claude/skills/fkit-task-done/SKILL.md`:

> **Vault links NOT touched:** if the task seems likely to be referenced from `ai-agents/wiki-vault/`,
> say so and name it as **fkit-wiki's** repair — this skill deliberately does not sweep or edit the
> vault (ADR-005). **Do not assert whether vault links actually rotted; this skill did not look.**

✅ **That instruction is honest and correct**, and every producer closing a task today said plainly
that it did not look and asserted nothing about vault staleness. **Vault writes are `fkit-wiki`'s
exclusively**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

**So the open question is narrower, and genuinely undecided:**

> **When closing a task falsifies a claim written in the vault, what — if anything — should notice?**

⚠️ Note the existing text covers **link rot** (*"vault links"*) — a task folder moving from
`backlog/` to `done/` breaks an href. **The three instances above are NOT link rot.** They are
**claims about project state going false**: *"still-open defect"*, *"`RELEASING.md` does not exist
yet"*, *"task `0252` is still open"*. ⛔ **A recommendation that only addresses link rot has answered
a different question.**

### The candidate shapes — ⛔ LAID OUT, NOT CHOSEN

⛔ **This list is input, not a menu the task must pick from.** Weigh each, add any the list misses,
and recommend one. ⚠️ **Each carries an explicit note on what would make it wrong** — a run that
returns only the case *for* its pick has not done the work.

1. **Nothing changes.** ⚠️ **This is a REAL candidate, not a straw man — record it as such and give
   it a fair hearing.** Three in one day is plausibly an artifact of **four release-hygiene tasks
   (`0252`, `0254`, `0256`, `0257`) closing together on one subject**, all of which the same page
   describes. Normal cadence may never show this again. **What would make it wrong:** evidence that
   the same pattern shows on other pages, or across other weeks.
2. **A read-only signal at close time.** The closing producer **reads** the vault — reading is
   permitted for every role
   ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md);
   any role may follow `/fkit-query`) — and reports *"N vault pages mention this task id"* **without
   touching them**, leaving the filing decision to a human or a later wiki session. **What would make
   it wrong:** if the signal fires constantly (every close hits some page) it becomes noise the
   reader learns to skip; and ⚠️ **task-id mention is a proxy, not the thing** — the `0285` block's
   `RELEASING.md` clause names `0252`, but a claim can go false without naming any task at all.
3. **A lint-side check.** `/fkit-wiki-lint` grows a check for vault claims that name a task id whose
   status has since changed. **What would make it wrong:** lint runs on the wiki role's cadence, so
   the debt still sits untracked between runs — which is the specific thing `0289`'s brief calls out
   (*"nothing currently tracks the debt"*). ⚠️ **This touches `fkit-wiki`'s exclusive territory.**
4. **A watermark / sync-cadence change.** The periodic sync catches it, and the real problem is only
   that nothing **tracks** the debt between syncs. **What would make it wrong:** same objection as 3,
   plus ⚠️ **the `0285` case suggests a sync can itself WRITE the perishable claim** — a mechanism
   that relies on the next sync may be relying on the thing that caused the problem.
5. **Something none of these name.** ⚠️ **Actively look.** One direction worth weighing, since the
   evidence points at it: **the convention that already worked twice** — a brief naming its own vault
   fallout in its out-of-scope list — could be made a **required** beat rather than a habit, which
   would land on `/fkit-task-brief` or the closing report rather than on lint at all.

### ⛔ SCOPE FENCE — this is NOT a general "improve the wiki" task

⛔ **Scope is the close-time / vault-staleness question and its three named instances.** Not vault
health generally, not the lint's other checks, not the sync's design, not a survey of stale vault
claims. ⚠️ **If a broader problem is visible, REPORT it as a finding and recommend a separate row —
do not absorb it here.**

### ⚠️ OWNER SIGN-OFF IS LIKELY REQUIRED — AND THAT HAS A SCHEDULING CONSEQUENCE

Every candidate except **"nothing changes"** lands on territory that is not this task's to change
unilaterally:

- **Candidate 2** changes `/fkit-task-done`, which is **producer-only and hook-enforced**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md) §1,
  [ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)).
- **Candidates 3 and 4** change `/fkit-wiki-lint` or `/fkit-wiki-sync`, which are **`fkit-wiki`'s
  exclusive territory** (ADR-005).

⚠️ **So the investigation must state, in its own output, whether its recommendation needs owner
sign-off** — and if it does, say so plainly rather than implying the recommendation is executable.

⛔ **A task needing a second owner beat CANNOT be driven by `/fkit-sprint-ship-loop`.** **The loop's
only owner gate is plan approval**, spent before Build
(`claude/skills/fkit-sprint-ship-loop/SKILL.md`) — so the loop has **no beat left** at which a
sign-off ruling could be taken. **The precedent is
[`0255`](../../done/0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md)**, excluded
from loop runs by **standing owner ruling of 2026-08-10**, recorded in
[`sprint-5.md`](../../../sprints/done/sprint-5.md)'s `## Notes` in exactly these terms:

> **`0255` needs a second owner beat the loop does not have.** Its title says **owner sign-off is
> required** … **The loop's only owner gate is plan approval**, spent before Build … so the loop has
> no beat left at which that ruling could be taken.

⚠️ **How that row is handled is the model for this one:** `0255` stays `🔲 Backlog`, stays on its
board, keeps its rank — **the exclusion is from the loop run and from NOTHING ELSE. NOT blocked, NOT
deprioritised, NOT descoped.** The same applies here. ⚠️ **This row also runs in an owner-present
session** — or, if spawned, returns its recommendation as an open question rather than settling it.

### Why `fkit-architect` owns this, and where the overlap is — ⛔ FLAGGED, NOT HIDDEN

**The ownership question is itself part of the problem**, so it is stated rather than assumed.

✅ **`## Owner: fkit-architect`, because the question spans two roles' exclusive territories and
neither can neutrally decide the other's.** The producer owns the close procedure; the wiki owns the
lint and the vault. A producer recommending a lint change is proposing work in a role it may not
write, and a librarian recommending a close-procedure change is doing the mirror. **The architect is
the role whose output is a recommendation across roles, for the owner to rule on.**
**Precedent, measured on disk:** every open *"decide where this cross-role mechanism lives"* row is
architect-owned — `0255`, `0270`, `0165`, `0134` all read `## Owner: fkit-architect`.

⚠️ **The overlap is real and is not dissolved by naming an owner:**
- If the recommendation is **candidate 2**, the implementing row is **producer-owned** (`/fkit-task-done`).
- If it is **candidate 3 or 4**, the implementing row is **`fkit-wiki`-owned** and is a **vault-side
  skill change**.
- If it is **candidate 1**, there is **no implementing row** — and that is a complete, acceptable
  outcome.

⛔ **This row decides nothing about who implements.** It recommends; the owner rules; the follow-up
row is filed with the owner named on it. ✅ **Consulting `fkit-producer` (for the close procedure's
constraints) and `fkit-wiki` (for what the lint can actually see) is expected and encouraged** —
within the two-hop consult budget, and without either consult becoming a hand-off.

### ⚠️ RE-DERIVE FROM THE CLOSED BRIEFS AND THE PAGE — NOT FROM THIS BRIEF

⛔ **This brief is a pointer, not a source.** Every fact above is a dated measurement of
**2026-08-13**, and **this project has been bitten repeatedly by corrections that were themselves
wrong.** Re-derive, from disk, on the day this runs:

- each of the three rows' **location, `## Status`, `## Sprint`, `## Priority` and `## Owner`**;
- **the page itself** — which resync blocks it actually carries, and which corrections sit on which;
- **`0254`'s brief**, to confirm it predicted no vault follow-up;
- **`0257`'s brief**, to confirm it did predict one;
- **`/fkit-task-done`'s step-7 text**, quoted from the skill as it stands.

⚠️ **Every `:NNN` in this brief is a dated anchor. The durable anchor is the quoted text.
Re-measure.** ⚠️ **State where what you measure differs from this brief, in both directions.**

⚠️ **One difference this producer already measured and is recording rather than papering over:** the
page carries the **`0285`** blocks and the **`0258`** corrections, but **NOT** a `0289` block —
because **`0289` has not run**. **Two of the three resyncs have landed on the page; the third is
still owed.** ⛔ **Do not write or repeat "the page carries all three."**

## What to build

An **investigation and a written recommendation**. ⛔ **No code, no skill edit, no lint check, no
vault write.**

1. **Re-derive the evidence** per the section above. ⛔ Do not work from this brief's quotations.
2. **Settle the load-bearing unknown** — was `0254` already closed when the `0285` block asserted it
   *"still-open"*? Use `log.md`'s dated entries and the closed briefs' worklogs. **State the answer
   and the evidence, or state plainly that it is undeterminable and what that costs the analysis.**
3. **Characterise the three instances honestly** — two anticipated by an existing convention, one
   found by accident. ⛔ Do not flatten them into one case.
4. **Test candidate 1 (`nothing changes`) against evidence, not intuition.** Look for the same
   pattern on **other** vault pages and in **other** weeks. ✅ **If the evidence supports "change
   nothing", recommend it** — that is a successful outcome, not a failed task.
5. **Weigh each candidate**, including one the list does not name, with **what would make it wrong**
   stated for each — not only the case in its favour.
6. **Produce ONE recommendation with its main tradeoff**, and state explicitly:
   - whether it needs **owner sign-off** (and if so, that this row cannot be driven by
     `/fkit-sprint-ship-loop` — the `0255` precedent);
   - **which role would own the implementing row**, and whether that role is the producer or
     `fkit-wiki`;
   - what the recommendation **does not** cover.
7. **Write the output as a report** under `ai-agents/knowledge-base/reports/`, dated, per the
   architect's usual practice. ⛔ **Not the wiki** — the vault is `fkit-wiki`'s to write (ADR-005),
   and an ingest of this report, if wanted, is a separate row.
8. **Name the follow-up rows the recommendation implies** — ⛔ **do not file them.** Filing is the
   producer's, after the owner rules.

### Constraints

- ⛔ **Write NOTHING under `ai-agents/wiki-vault/`.** Reading it is expected and permitted (ADR-005;
  any role may follow `/fkit-query`). ⚠️ **Reading it is in fact part of the work** — the page is
  evidence.
- ⛔ **Edit no skill file.** Not `/fkit-task-done`, not `/fkit-wiki-lint`, not `/fkit-wiki-sync`, not
  `/fkit-task-brief`. **This row recommends; it does not implement.**
- ⛔ **Edit no existing task brief** — including `0285`'s, `0258`'s, `0289`'s, `0254`'s and `0257`'s.
- ⛔ **No task-file move**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  **no re-rank**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  no board-row edit beyond this task's own close.
- ⛔ **No source-file edit. No commit, no push.**
- ⛔ **Scope fence:** the close-time / vault-staleness question and its three instances. **Not vault
  health generally.**

## Verification steps

**Paste the command and its output; do not assert.**

1. **The three instances were re-derived, not inherited.** Show, at minimum:
   ```
   ls -d ai-agents/tasks/done/0285-* ai-agents/tasks/done/0258-* ai-agents/tasks/backlog/0289-*
   grep -A1 '^## Status' ai-agents/tasks/done/0285-*/brief.md ai-agents/tasks/done/0258-*/brief.md ai-agents/tasks/backlog/0289-*/brief.md
   ```
   ⚠️ **DO NOT RUN THE TWO LINES ABOVE AS WRITTEN — see the dated correction in `## Notes`, item 3.**
   The `ai-agents/tasks/backlog/0289-*` glob **matches nothing and fails SILENTLY** — `0289` closed and
   its folder is now under `done/`. A silent no-match reads as *"nothing to see here"* rather than
   *"your command is broken"*, so it will hand you a false conclusion. The corrected commands are in
   that note; the lines above are left as filed, deliberately not repaired in place.
   ⚠️ **State explicitly where the measurement differs from this brief, in both directions.**
2. **The page's real state is quoted.** Show which resync blocks the page carries and confirm — or
   disprove — that **no `0289` block exists yet**:
   ```
   grep -n "the \`0285\` resync\|the \`0258\` resync\|the \`0289\` resync" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md
   ```
3. **The anticipated/accidental split is evidenced, not asserted.** Quote `0257`'s out-of-scope line
   naming the follow-up, and show `0254`'s only vault mention is its out-of-scope fence.
4. **The load-bearing unknown is answered or declared undeterminable.** Show the `log.md` entries or
   worklog lines used, or state plainly that they do not settle it.
5. **`/fkit-task-done`'s step-7 vault boundary is quoted from the skill**, and the report states it is
   **correct as written**. ⛔ **A report proposing the closer write the vault has failed this step.**
6. **Candidate 1 got a fair hearing.** Show the search that tested it — other pages, other weeks — and
   its result, whichever way it points.
7. **Every candidate carries a "what would make it wrong".** ⛔ One per candidate; a general caveats
   paragraph does not satisfy this.
8. **The recommendation states its sign-off requirement and its implementing owner**, and cites the
   `0255` loop-exclusion precedent if sign-off is needed.
9. **`git diff --stat` touches ONLY `ai-agents/knowledge-base/reports/`** plus this task's own
   artifacts. ⛔ A hit on any skill file, any existing brief, or anything under
   `ai-agents/wiki-vault/` is a **failure**. Show it.
10. **Full `npm test` green; state the measured counts.** ⚠️ **Expect it to prove NOTHING about this
    task** — the deliverable is a report and no test reads report prose. **Say so explicitly** rather
    than implying coverage.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing. ⚠️ **In particular it does NOT block
  [`0289`](../../done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md)** —
  that row corrects the page and is runnable today, whatever this one concludes. **They are
  independent.**
- **Provenance:** the pattern was noticed by the `fkit lead` session on 2026-08-13 while `0289` was
  being filed, and `0289`'s own `## Notes` flags it and correctly refuses to absorb it: *"A page
  resynced three times in one day is a signal: whether a standing procedure should catch these at
  close time is worth a look, **but it is NOT this row's work.**"* **This row is that look.**
- **⚠️ No existing open row owns this question — checked before filing.** The nearest neighbours were
  each read and each is a **different** question:
  [`0213`](../0213-give-the-next-lint-a-procedural-reason-to-read-log-md-correction-notes/brief.md)
  (lint reading `log.md`'s correction notes),
  [`0231`](../0231-make-wiki-sync-count-and-classify-its-own-diff-before-logging/brief.md) (sync
  counting its own diff),
  [`0229`](../0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md)
  (`/fkit-task-done` repairing a **brief**, not the vault),
  [`0235`](../0235-cross-check-a-briefs-status-field-against-its-own-prose/brief.md) (a brief's
  `## Status` versus its own prose). ⚠️ **`0229` is the closest and is worth reading alongside this
  row** — it widens the same skill for the same class of falsified-by-a-close claim, but **inside the
  task system, where the mover has authority**. **The vault is exactly where it does not.**
- **On merit:** the **Backlog**, **unranked**, and that is honest — ✅ **this producer agrees with the
  placement and states the reasoning rather than inheriting it.** **Sprint 5 stands at 16 `✅ Done`
  and 1 `🔲 Backlog` (`0255`, P15) across its 17 board rows** — measured 2026-08-13. It is finished
  bar one row it cannot run, so **there is no active sprint to rank into**, and ⛔ **a spawned
  producer never ranks** (ADR-035; `/fkit-task-brief` step 5 — the re-rank exception requires an owner
  ruling **in this session**, and this producer has **no owner channel**). ⛔ **No existing row was
  re-ranked.** On merit: **nothing waits on it, no behavior changes, no test covers it, and it is not
  on the release path.** Its claim to attention is that **the vault is treated as ground truth by
  every role** (per `/fkit-query`) and it has now been shown to carry **same-day-perishable claims
  about the project's own task state** — the most checkable kind of wrong, and the kind a reader
  trusts most and questions least. ⚠️ **But its output is a recommendation, not a fix** — the page
  itself is repaired by `0289`, which is the row with the concrete payload.
- **Blast radius if never done:** ⚠️ **modest and honestly stated — the answer may legitimately be
  "nothing".** What is lost is the **decision**: the project keeps relying on a brief's author
  remembering to name its vault fallout, which **worked for `0257` and did not exist for `0254`**.
  The next `0254`-shaped case is caught only if a librarian happens to open the right page. ⛔ **That
  is a risk, not a proven cost** — establishing whether it is worth acting on **is this task's whole
  job.**
- Filed 2026-08-13 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day (verbatim option label **"File a task to investigate"**). It asked nothing, **wrote
  nothing under `ai-agents/wiki-vault/`** (⛔ ADR-005), **moved no task file**, **invoked no mover**,
  **changed no existing task's status, priority, sprint field or location**, **re-ranked nothing**
  (⛔ ADR-035), **edited no existing brief, no source file and no sprint plan other than adding this
  row to the Backlog board**, and **committed nothing**.

- **⚠️ Dated correction, 2026-08-13 — `0289` CLOSED, and its close falsified three statements written
  above. Every prior byte is left identical, per this project's dated-correction practice. Those
  statements were TRUE WHEN WRITTEN; they are SUPERSEDED, NOT DELETED.** **Authority:** the owner,
  2026-08-13, `fkit lead` session, verbatim option label **"Correct both, and record it IN 0290 as
  evidence"**. Appended by a spawned `fkit-producer` with **no owner channel**. ⛔ **Nothing else
  about this row changed** — `## Status` stays `🔲 Backlog`, `## Priority` stays `Unscheduled`,
  `## Sprint` stays `Backlog`, `## Owner` stays `fkit-architect`. **No board row was touched, nothing
  was re-ranked** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **no mover ran** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  **nothing was written under `ai-agents/wiki-vault/`** (⛔ [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  and **nothing was committed.**

  **What is now false — each re-measured on disk 2026-08-13, not inherited:**

  1. **`:236-237` — the "third resync is still owed" paragraph. ⛔ NOW FALSE, both sentences.** It
     asserts the page carries the `0285` blocks and the `0258` corrections *"but **NOT** a `0289`
     block — because **`0289` has not run**"*, and that *"Two of the three resyncs have landed on the
     page; the third is still owed."* **`0289` has run.**
     `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` now carries a **third** dated
     block, at **`:99`**, opening *"⚠️ **Dated correction 2026-08-13 (the `0289` resync; BOTH blocks
     above are left byte-identical — the `0285` block *and* the `0258` correction stacked under
     it).**"* ✅ **All three resyncs have now landed on the page.**
     ⚠️ **The ⛔ instruction attached to that paragraph — *"Do not write or repeat 'the page carries
     all three'"* — is SPENT and MUST NOT be honoured.** The page carries all three, and saying so is
     now the accurate statement. ⛔ **Re-measure the page yourself; inherit neither version of this
     claim.**

  2. **`:42`, instance table row 3 — TWO stale cells. ⚠️ This was NOT in the correction request; this
     producer measured it and is recording it rather than leaving it.** The row's `## Status` cell
     reads `🔲 Backlog`; `0289`'s actual `## Status` is **`✅ Done (agent-closed — not
     owner-verified)`** (`ai-agents/tasks/done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md:12-13`).
     The row's Location cell **display text** still reads `ai-agents/tasks/backlog/0289-…`, which no
     longer exists. ✅ **That cell's markdown LINK TARGET resolves correctly today** — only the
     visible path text and the status cell are stale.
     ⚠️ **And HOW the link target came to be correct is itself evidence — recorded rather than
     smoothed over.** It was **NOT** correct at filing. `git diff` against the last commit shows the
     closing producer's own **href repair** rewrote **three** link targets in this brief from
     `../0289-…` / `../0255-…` to `../../done/…` (row 3's target, the `0255` link, and the `0289`
     link in `## Notes`). ⚠️ **So the mover reached INTO this brief, repaired exactly what its duty
     covered, and left the display text, the status cell and the two dead globs untouched — which
     was correct, because none of those are hrefs.** ⛔ **Do not read this as the mover erring.**
     ⚠️ **Consequence for the investigation: all three rows in that table are now `✅ Done`, so the
     "three resyncs" set is complete and closed.** That does not change the table's point, but the
     analysis must not describe row 3 as pending work.

  3. **`:291-292`, verification step 1 — the glob `ai-agents/tasks/backlog/0289-*` MATCHES NOTHING**
     (confirmed: `zsh: no matches found`). **The working path, verbatim:**
     `ai-agents/tasks/done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/`
     — so step 1's two commands should be run as:
     ```
     ls -d ai-agents/tasks/done/0285-* ai-agents/tasks/done/0258-* ai-agents/tasks/done/0289-*
     grep -A1 '^## Status' ai-agents/tasks/done/0285-*/brief.md ai-agents/tasks/done/0258-*/brief.md ai-agents/tasks/done/0289-*/brief.md
     ```
     ✅ **Those two lines and `:42`'s display text are the ONLY dead `backlog/0289-*` paths in this
     brief** — every other `0289` reference here is prose or a link already pointing at `done/`.
     Enumerated with `grep -rn "backlog/0289"` over this file, not taken on report.

- **⚠️ Dated EVIDENCE entry, 2026-08-13 — A FOURTH INSTANCE OF THIS ROW'S OWN SUBJECT, AND IT LANDED
  INSIDE THIS BRIEF. ⛔ RECORDED AS EVIDENCE FOR THE INVESTIGATION. IT DECIDES NOTHING.**
  This row asks whether anything should notice when closing a task falsifies a claim written
  elsewhere. **Closing `0289` falsified three statements inside this row's own brief (above) and two
  more inside [`0291`](../../done/0291-correct-two-stale-vault-claims-surfaced-by-0258s-review/brief.md)'s —
  in the same working session, the same day both were filed.** ⚠️ *(This producer measured the
  falsification itself; it did not independently measure the elapsed interval, which the `fkit lead`
  session reported as roughly an hour.)*
  ⛔ **The investigation must weigh this as evidence and MUST NOT read it as an argument for any
  particular candidate** — including candidate 1 (*"nothing changes — three in one day is an artifact
  of one sprint"*), which *What to build* step 4 requires be tested against evidence and which
  ✅ **remains a legitimate outcome of this task.**

  **Two things make this instance different in kind from the three in the table. ⛔ State both; do not
  flatten them into a fourth tally mark:**
  1. **It happened in the TASK SYSTEM, where the noticing step ALREADY EXISTS — and it fired.**
     `/fkit-task-done`'s step-7 report enumerates every document the close touched, and the closing
     producer **did** flag these two briefs as newly stale — and **correctly** declined to repair
     them, as outside its href-repair duty. ⚠️ **So the gap this row is investigating is NOT "nobody
     noticed."** In this instance it is **"noticing produces a report nobody is obliged to act
     on."** ⚠️ **That is a materially different failure from the vault cases**, where the open
     question is still whether anything notices *at all*. ⛔ **Do not merge the two** — a
     recommendation that fixes detection would not have prevented this instance.
     ⚠️ **Sharper still, and measurable in `git diff`:** the mover did not merely report — it
     **edited this brief**, repairing three link targets under its href duty (see correction item 2
     above), then stopped at the boundary of that duty. **So the task system already has a mover with
     a narrow, working repair mandate reaching into other documents on close.** ⚠️ **Whether that
     mandate's EDGE is the right edge is a question the investigation may find worth asking — ⛔ but
     this note does not ask it, and the vault has no equivalent mandate at all, so the analogy does
     not transfer without argument.**
  2. **Different subsystem, different clock.** The three table instances are **one vault page, one
     day, one sprint's fallout** — which is precisely the ground candidate 1 stands on. This instance
     is a **different subsystem**, on briefs authored the same session, by a producer explicitly
     instructed to re-derive everything from disk. ⚠️ **It is evidence bearing directly on candidate
     1. It is NOT a refutation of it** — a single cross-subsystem instance is a data point, and
     ⛔ **the weighing is this investigation's job, not this note's.**

- **⚠️ Dated EVIDENCE entry, 2026-08-13 — a FIFTH specimen, in the vault, on a DIFFERENT page,
  verified by this producer today.**
  `ai-agents/wiki-vault/wiki/tasks/sprint-5-fix-what-a-real-project-found.md:36-37` reads **"Still
  open:"** and lists `0269` (P9, wiki), `0254` (P12), `0252` (P13), `0253` (P14), `0255` (P15),
  `0258` (P16, wiki). ⚠️ **Measured 2026-08-13: ALL SIX are now under `ai-agents/tasks/done/` — not
  some of them, all of them.** (Checked per ID with `ls -d ai-agents/tasks/*/<ID>-*`; `0255` moved
  today and still shows as a staged rename.) It is a clean specimen of exactly this row's pattern —
  closes falsified a vault claim, and nothing acted on it.
  ⚠️ **Why it is recorded here:** it is a **vault** instance that is **NOT** on
  `install-and-self-update.md`, so it bears directly on whether the three in the table above are one
  page's artifact. ⛔ **DO NOT FIX IT and DO NOT FILE FOR IT** — reporting this exact site is already
  owed by [`0293`](../../done/0293-wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface/brief.md)
  (see its `brief.md:173` and `:211`). ⚠️ **Re-measure it before relying on it** — `0293` may have
  landed by the time this row runs.
