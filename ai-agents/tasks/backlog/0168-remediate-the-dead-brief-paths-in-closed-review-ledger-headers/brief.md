# Remediate the dead brief paths in closed `review.md` ledger headers

## ID
0168

## Sprint
Sprint 6

## Priority
Sprint 6 P13

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⚠️ Read this first — this task does NOT decide the fix, and must not start before 0160

**0160 already owns this defect class**, as its **Case 3** — *"a folder path in a review ledger that
dies when the task closes"*. 0160 is **report-only, investigation + ruling**, owned by
`fkit-architect`, and it says in terms:

> **⚠️ Case 3 is NOT "just repair the path", and the brief does not assume it is.** Repairing it means
> **editing a frozen document** — the thing the ledger rule exists to forbid. The candidate answers
> (leave them dead and accept it; resolve location at read time; cite a location-free anchor at write
> time; annotate rather than rewrite) have genuinely different costs, and choosing between them is this
> task's job.

**This task is the execution arm of that ruling, and nothing more.** It carries the measurement 0160
does not yet have and executes whatever 0160 lands. **Hard dependency on 0160.** Starting it first
would settle by keystroke a question an architect task exists to settle — and "rewrite the paths" is
explicitly *not* the presumed answer.

**Open question for the owner, raised because it may make this task unnecessary:** 0160 is
report-only and *"files no briefs, names its follow-ups"*. This brief is the follow-up 0160 would
name. The owner ruled on **2026-07-31** that the class be filed as a task — a ruling made without
0160's Case 3 in front of it. If the owner prefers, **cancel this brief and let 0160 name its own
follow-up**; the alternative is to keep it as the pre-filed execution row, which is how it is written
here.

### What the defect is

A task folder's `review.md` opens with a self-header naming the brief under review:

```
Task: `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`
```

`/fkit-task-done` then `git mv`s the folder to `done/`, and that path points at nothing. For the
**large majority** it is a **code span or a bare path, not a markdown href** — nothing resolves
through it, no navigation breaks, and **severity is low**. It sits in the task's own record, which
the owner's close bar (ruled 2026-07-31) accepts as residual. It is filed as a class because it
belongs to no single task: it is a bounded, mechanical, repo-wide condition that stays invisible
precisely because nobody owns it.

> **🆕 2026-08-01 — corrected: "0 of 60 are hrefs" was wrong. 4 are, and their links work.**
> **What this brief said:** that the header is *"a code span, not a markdown href"*, stated flatly for
> the whole population — i.e. **0 of 60** headers in href form. The figure reached this brief from a
> decision report that has since been corrected; it was not re-derived here.
> **What it actually is: 4 of 60 headers ARE markdown hrefs, and all 4 hrefs resolve.** Their target
> is the relative, location-free `./brief.md`, which survives the `git mv` intact — so **navigation
> does not break for these 4**. What is stale in them is only the **link text**, a code span naming a
> dead pre-migration flat path. All 4 sit inside **Variant 3** (the 9 `done/<slug>.md` cases) and are
> already inside the dead-header count; **no count in the table below changes.**
> **Consequence for this task:** the sweep needs a **fourth case** — see `## What to build` item 1 —
> and the mover explanation further below is **incomplete for these 4**.
> *Provenance: reviewer re-measurement during the `0160` stateful review; owner ruling 2026-08-01 via
> `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session. Re-verified firsthand here on
> 2026-08-01 — see the form table below.*

### Measurement — re-derived firsthand 2026-07-31, and the reported figure is wrong

The figure carried into this brief was **"39 of 60"**. **39 is a real number measuring the wrong
thing**, and the honest picture is both larger and differently shaped.

`ai-agents/tasks/done/` holds **124** task folders, **60** of which have a `review.md`. Classifying
each `review.md`'s `^Task: ` header by **whether the path it names exists on disk today** — the
positive test, not a string match:

| Population | Count | Note |
|---|---|---|
| `review.md` files in `done/` | 60 | of 124 folders |
| Header path **resolves** on disk | **19** | all name `tasks/done/` in the current folder form |
| Header path is **dead** | **40** | the real defect population |
| — of those, dead path names `tasks/backlog/` | **31** | **this is the class as described, and it is 31 of 60, not 39** |
| — — in the shape the report gives (`backlog/<NNNN>-<slug>/brief.md`) | **17** | folder-era, post-0062/0103 |
| — — in an **older, unreported shape** (`backlog/<slug>.md`, flat, no `NNNN`) | **14** | predates the folder migration; stale in scheme *and* board |
| — of those, dead path names `tasks/done/` in the flat pre-migration form | **9** | **a second variant the report misses entirely** — right board, dead path |
| No `^Task: ` header at all | **1** | `0080-report-backlog-board-in-fkit-status-on-request-only` |

**Where 39 came from:** 39 `review.md` files contain the string `tasks/backlog/` *anywhere*. Of those,
31 carry it in the header; the other **8** carry it only in finding rows citing *sibling* tasks that
were genuinely in `backlog/` at review time. Counting body citations as header defects inflates the
number; counting only the `backlog/` header form misses the 9 dead `done/`-form headers. Both errors
are in the reported figure at once.

**Three variants, not one — and 0160's candidate answers may not rule the same way on each:**
1. **17** current-form `backlog/<NNNN>-<slug>/brief.md` — the file exists, at a different path.
2. **14** pre-migration `backlog/<slug>.md` — no such file under any name; the naming scheme is gone.
3. **9** pre-migration `done/<slug>.md` — same, on the correct board.

Variants 2 and 3 are not "re-point the path" cases even if 0160 rules repair — there is no live path
to re-point to without also translating the pre-0062 flat name to its `NNNN` folder.

**🆕 2026-08-01 — a second axis the original measurement never took: the *form* the header is written
in.** The variants above classify *which path* is named; they say nothing about *how*. Classifying
every `^Task: ` header in `ai-agents/tasks/done/*/review.md` by markdown form — measured firsthand
2026-08-01, same 60-file population:

| Header form | Count | Named path dead | Named path resolves |
|---|---|---|---|
| Backtick code span | 30 | 26 | 4 |
| Bare path, no markup | 25 | 10 | 15 |
| **Markdown href `[text](target)`** | **4** | **4** | 0 |
| No `^Task: ` header at all | 1 | — | — |

**All 4 hrefs point at `./brief.md`** — relative and location-free — **and all 4 resolve on disk.**
All 4 are Variant 3. So a header can be *dead in its displayed text and live in its link at the same
time*, and this brief's earlier flat "code span, not a markdown href" hid that case entirely. The
dead/resolves totals are unchanged: **40 dead, 19 resolve**, re-derived 2026-08-01 and matching the
2026-07-31 table exactly.

⚠️ **"Dead" in the table above means the path the header *names* does not exist.** For the 4 hrefs
that is the link **text** only; the link **target** works. Do not collapse the two — a sweep that
treats these 4 as broken navigation will "fix" a link that was never broken.

**0160's own count was 30, measured 2026-07-27**; 31 today is consistent with two tasks closing since.
There is no contradiction between 0160 and this brief — only between both of them and the 39.

### `cancelled/` — the scope question answers itself

**`ai-agents/tasks/cancelled/` contains 11 folders and zero `review.md` files.** There are no
instances there today. Verified 2026-07-31. Whatever 0160 rules should still be stated to cover
`cancelled/`, because the condition is reachable — but there is nothing to sweep.

### Does `/fkit-task-done` re-point it today? No — and its wording says why

`claude/skills/fkit-task-done/SKILL.md`'s step-5 sweep is **href-scoped throughout**: *"re-point the
href, change nothing else"*, *"A link is not a claim; it is a pointer."* Its one rule that reaches
the moved folder's own files — *"The moved folder's OWN outbound links"* — is scoped to links the
folder makes **to a sibling task**, and gives sibling-shaped examples only. A self-referential code
span is neither an href nor a sibling link. **The mover does not touch it, by the design of its own
wording, not by oversight.** `/fkit-task-cancelled` carries the same rule and the same gap.

**🆕 2026-08-01 — this explanation is incomplete for 4 of the 60, and the gap there is a different
gap.** The reasoning above assumes no header is an href. **4 are.** For those the mover's href rule
*is* in principle in range — but there is **nothing for it to re-point**: the target is already the
relative `./brief.md`, which the `git mv` carries along unbroken. The mover's non-action on these 4
is therefore **correct behaviour, not a miss**. What the mover still does not reach is the href's
**link text**, which is a code span naming a dead path — and no rule in either mover speaks to link
text. So there are **two distinct mover gaps**, not one:
- **Gap A (56 headers)** — code-span / bare self-references the href rule never reaches at all.
- **Gap B (4 headers)** — href targets that are already correct, wrapped in **stale link text** no
  rule governs. Repairing A's pattern here would be wrong; only the text is stale.

*Provenance: reviewer re-measurement during the `0160` stateful review; owner ruling 2026-08-01 via
`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session.*

### What writes the header

`claude/skills/fkit-stateful-review/SKILL.md` prescribes the ledger schema, whose second line is
`Task: <path to task file>`. `claude/skills/fkit-process-stateful-review/SKILL.md` carries the same
line, and the schema is declared shared and *"keep it exact"* between the two. The reviewer writes it
when the task genuinely **is** in `backlog/`, so **the path is correct on the day it is written and
guaranteed to die at close**.

**Consequence: a sweep alone fixes nothing durably.** Every future closed task reproduces the defect
the moment it closes. Any answer that leaves the schema line untouched is a treadmill. This is also
exactly 0160's candidate *"cite a location-free anchor at write time"* — which is why the generator
half cannot be scoped ahead of 0160 either.

## What to build

**Nothing until 0160 reports.** When it does, execute its ruling across both halves:

1. **The ledger population** — apply 0160's ruled treatment to the **40** dead headers in
   `ai-agents/tasks/done/*/review.md`, handling all **three** variants above explicitly. If the ruling
   is "leave them dead and accept it", the deliverable is the written acceptance, not an edit.
   **🆕 2026-08-01 — plus a fourth case, cutting across the three variants: the 4 href-form headers.**
   Their link **target** (`./brief.md`) already resolves and **must not be re-pointed or unwrapped**;
   only their link **text** carries the dead path. Whatever 0160 rules, state its treatment for these
   4 **separately** from the 56, and preserve a working relative link wherever one already exists. A
   sweep written against "every header is a code span" will either skip these 4 or mangle a link that
   works — say which of the two your implementation does, and why it is right.
   ⚠️ **Do not classify by variant alone.** Variant (which path is named) and form (how it is written)
   are **independent axes**; all 4 hrefs hide inside Variant 3's 9.
2. **The generator** — apply 0160's ruled treatment to the schema line in
   `claude/skills/fkit-stateful-review/SKILL.md` and `claude/skills/fkit-process-stateful-review/SKILL.md`.
   ⚠️ **The two schemas are declared shared and must stay byte-identical** — changing one alone breaks
   the interop the skills promise each other.
3. **The movers** — state whether `/fkit-task-done` and `/fkit-task-cancelled` gain any duty here, or
   explicitly do not. Their current href-only scope is deliberate; widening it is a decision, not a
   tidy-up. **🆕 2026-08-01 — answer for *both* mover gaps named above**: Gap A (56 code-span/bare
   headers the href rule never reaches) and Gap B (4 hrefs whose target is already right but whose
   link text is stale). They may well be ruled differently; do not answer only Gap A.
4. **`cancelled/`** — cover it in whatever rule lands, and record that it holds zero `review.md`
   files today so a later reader does not re-measure.
5. **`0080`'s missing header** — decide whether a `review.md` with no `Task:` line at all is in scope
   or is a separate, one-instance thing. Do not fold it in silently.

⛔ **Out of scope:** re-litigating 0160's ruling; the `:NNN` line-number class (0160 Case 2); board-rank
citations in prose (already shipped by 0157 and 0159, hard out of scope); adding any machine guard —
0160's own findings note that enforcement is only *partly* possible in principle, and 0152/0154 own the
skill-file walk.

## Verification steps

1. **Re-derive the population before touching anything** — the counts above are dated 2026-07-31 and
   tasks close continuously. Re-run the resolvability classification (test each header path with a
   file-existence check, **not** a string match) and report the current numbers. A count that merely
   matches this brief has not been re-derived.
2. **Classify positively.** A `grep` returning nothing is a failure mode, not a proof. Every file in
   `done/` must land in exactly one bucket — resolves / dead-backlog / dead-done / no-header — and the
   buckets must sum to the folder count.
3. **🆕 2026-08-01 — classify on the second axis too, and report both tables.** Every header must also
   land in exactly one **form** bucket — href / code span / bare / no-header — summing to the same
   folder count. **Report the href count explicitly even if it is zero**; a re-derivation that omits
   the form axis has not re-derived the corrected claim, only the old one. For every href found,
   report its target and whether that target resolves.
4. **🆕 2026-08-01 — prove no working link was broken.** After any edit, re-resolve every href target
   in the population. Any href that resolved before **must still resolve**, byte-identical target
   unless the ruling explicitly changed it. A diff that turns a working `[…](./brief.md)` into a code
   span is a regression, not a repair — even if the ruling's headline is "make them all code spans".
5. ⚠️ **Never run a `.{0,80}(…)` context regex over `ai-agents/sprints/sprint-2.md`** — its rows are
   multi-thousand-character single lines and it backtracks catastrophically. Use `grep -n` and slice.
6. If the ruling is an edit: show the before/after of one file per variant **and one per form** —
   including at least one of the 4 hrefs — and prove no `review.md` section other than the header line
   changed (the Reviewer, Coder-response and Accepted-residuals sections are owned by their parties).
7. If the ruling touches the schema: diff both skill files against each other and show the shared
   block is byte-identical.
8. Full test suite green.

## Notes

- **⚠️ Priority 146 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **✅ Resolved — the owner confirmed the appended rank on 2026-07-31**, ruling *"Confirm
  both as appended"* via `AskUserQuestion` in a live `/fkit-sprint-ship-loop` session, on this brief
  and `0169`'s together. The rank is **owner-confirmed**, no longer merely appended. **The merit
  argument below was not adopted** — the owner kept the appended position rather than moving the row
  to sit directly below `0160`; it is recorded as filed, not as a pending move. No row was
  renumbered. The flag no longer reads unresolved.)*
  **On merit this belongs directly below 0160**, because it is that task's execution arm and cannot
  start until it rules; sitting at the tail separates it from the ruling it depends on. It was
  appended under `/fkit-task-brief` step 5, which forbids a spawned producer from re-ranking — the
  producer that filed it had no owner channel.
- **Depends on 0160 — hard.** No other dependency.
- **Filed on an owner ruling of 2026-07-31**, relayed through the `/fkit-sprint-ship-loop` driver.
  The reported scale in that ruling was **39 of 60**; this brief corrects it to **31 of 60** for the
  described class and **40 of 60** for the full dead-header population. The correction was made by
  re-derivation, not by trusting the relay.
- **The close bar that accepts this as residual is [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)**
  (accepted 2026-07-31), which defines *"the task's own record"* as exactly `brief.md`, `worklog.md`
  and `review.md`, and lets a residual defect there pass. ⚠️ **It carries an escape hatch that may
  apply here** — a task's own record stops being residual when it *"becomes load-bearing for another
  consumer — e.g. a guard, a report generator"*. Whether 40 dead paths across the corpus meet that
  bar is a question for 0160, not an assumption for this brief.
- **🆕 2026-08-01 — one factual correction landed in this brief, recorded rather than overwritten.**
  It previously asserted, flatly, that the header is *"a code span, not a markdown href"* — i.e.
  **0 of 60** in href form. **4 of 60 are hrefs, and all 4 hrefs resolve** (`./brief.md`, relative and
  move-proof); only their link text names a dead path. Measured firsthand 2026-08-01 by taking the
  first `^Task: ` line of every `ai-agents/tasks/done/*/review.md`, classifying its markdown form, and
  testing both the named path **and** the href target for existence on disk. **No count changed** —
  40 dead / 19 resolve / 60 files / 17-14-9 variants all re-derived identical. Scope **did** change:
  `## What to build` item 1 gained a fourth case, item 3 now answers two mover gaps, and two
  verification steps were added. The bad figure came in from a decision report that has since been
  corrected. *Provenance: reviewer re-measurement during the `0160` stateful review; owner ruling
  2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session.*
- **Low severity, deliberately.** Nothing resolves through a code span **or a bare path — 56 of the
  60.** *(🆕 2026-08-01 — the remaining **4** are hrefs whose links **do** resolve; for them the
  severity is lower still, since navigation works and only the displayed text is stale.)* The producer closing 0159
  found 0159's own `review.md:3` carrying this and correctly declined to repair it alone — repairing
  one instance would have made it the odd one out among the majority.
- **Cite tasks by folder ID, never by board rank** —
  [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md).
  No live rank appears in this brief's prose by design.
