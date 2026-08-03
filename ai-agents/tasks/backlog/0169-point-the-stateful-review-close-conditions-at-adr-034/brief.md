# Point the stateful-review close conditions at ADR-034's work-product bar — four sites, three files

## ID
0169

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### What ADR-034 decided, and what it deliberately left undone

[ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)
(accepted 2026-07-31) defines when a stateful review ledger closes:

> **A stateful review ledger closes once the SWEPT WORK PRODUCT is clean.**

- A defect in the **work product** — the artifact the task exists to change — still **blocks** and still
  drives another round. Nothing about that is relaxed.
- A residual defect in the task's **own record** — its `brief.md`, its `worklog.md`, the ledger's own
  bookkeeping — is **recorded as an accepted residual** (What / Why / *Re-raise only if*) instead of
  driving another round.
- **The split is drawn at the site, not the file.** One file can hold both surfaces at once: in task
  `0159`, `brief.md` was simultaneously the task's own brief *and* one of the swept files, and the two
  halves were classified separately. The classification belongs to the **reviewer**, which owns the
  findings section.

ADR-034's *Binds* section states plainly: **"No skill is edited by this ADR — each pointer below is a
separate task the owner ranks."** This is that task.

### Why a pointer in each of three skills, and not one

The owner ruled on 2026-07-31, taking the reviewer's side over the driver's proposal to file the bar as
a step inside `fkit-sprint-ship-loop`. The recorded reasoning: the bar is a **cross-role decision about
when review ends**, not a step in one skill's procedure — it binds the reviewer's `fkit-stateful-review`,
the coder's `fkit-process-stateful-review`, and any driver alike. Filing it in one place leaves the other
roles to re-derive it, **which is exactly how the question surfaced in the first place**.

Until the pointers exist, ADR-034 is the only durable home for the bar and each role must reach it there
on its own. That is the same re-derivation risk, reduced but not removed.

### The FOUR sites — every coordinate re-derived firsthand 2026-07-31

All four sites say what this brief says they say. Coordinates confirmed by direct read:

| # | Site | Current text | Gap |
|---|---|---|---|
| 1 | `claude/skills/fkit-stateful-review/SKILL.md:156` | *"set `Status: closed-out` when warranted"* | "warranted" is undefined |
| 2 | `claude/skills/fkit-process-stateful-review/SKILL.md:200-201` | *"If all novel findings are closeout / disproven / accepted and nothing blocking remains, set the document header **Status: closed-out**."* | no surface named — a novel finding anywhere blocks |
| 3 | `claude/skills/fkit-task-ship-loop/SKILL.md:160-161` — step 7 | *"Repeat steps 6–7 until the ledger is **closed-out with the last verify green.**"* | the undefined bar sets the loop's termination |
| 4 | `claude/skills/fkit-task-ship-loop/SKILL.md:261` — the *Failure & exit behavior* table | trigger cell: *"ledger closed-out **and** last verify green"* | **a reader who consults the table instead of step 7 hits the same undefined bar** |

Two corrections to the coordinates as ADR-034 states them — **both re-confirmed today, not inherited:**

- **The ADR cites `fkit-task-ship-loop/SKILL.md:160-162`; the close-bar sentence sits at `:160-161`.**
  Line 162 is the non-convergence clause of the same step 7. Not a defect in the ADR — a citation one
  line wider than the sentence it names.
- **⚠️ Site 4 is a site the ADR does not name at all.** `fkit-task-ship-loop/SKILL.md:257` opens
  *"Failure & exit behavior — never a silent stall"*; `:259-260` are the table head, and `:261` is the
  *"Handed off to the producer → closed"* row whose **Trigger** cell restates the bar. ADR-034's
  *Binds* table lists three sites and stops. **In scope for this task.**

**No file under `claude/skills/` references ADR-034 today** — re-verified repo-wide 2026-07-31. The
ADR is otherwise referenced only from `sprint-2.md`, task `0168`'s brief, this brief, and the
wiki-vault (which has since ingested it). *(A narrower earlier claim in this brief — "the only non-ADR
file mentioning it is task 0168's brief" — was true when filed and is no longer; corrected, not
rewritten away.)*

**Explicit non-sites — do not edit.** `fkit-stateful-review/SKILL.md:49` and
`fkit-process-stateful-review/SKILL.md:54` both read `Status: in-review | closed-out`. Those are the
ledger's **schema** lines — the set of legal header values — not close conditions. Touching them changes
the document format for no reason.

### ✅ The `fkit-task-ship-loop` freeze question — SETTLED 2026-07-31, the freeze does NOT bind

**Owner ruling, `AskUserQuestion`, 2026-07-31, in a live `/fkit-sprint-ship-loop` session: the
*"stays byte-unchanged"* claim does not bind. All four sites are in scope, unconditionally.**

The reasoning the owner accepted — **recorded here so nobody re-litigates it**:

> Both statements of the claim — `claude/skills/fkit-sprint-ship-loop/SKILL.md:43` and ADR-032's
> Decision 1 — are scoped to **ADR-032's own ripple**: *introducing the sprint driver does not require
> editing the task loop*. Neither is stated as a repo-wide editing freeze. And **ADR-033 subsequently
> rewrote that file's step 9**, an edit present in the file today.

Both halves re-verified firsthand 2026-07-31: ADR-033 records the change (*"`fkit-task-ship-loop` step
9 changes from invoke `/fkit-task-done` to route the close to the producer"*), and the file's step 9
today carries the rewritten routing text citing ADR-033 by name.

**There is no gate on site 3 or site 4. There is no fallback shipment.** Ship all four in one change.

Whether `fkit-sprint-ship-loop`'s own *"stays byte-unchanged"* wording is itself a stale claim after
ADR-033 is **out of scope here** — the owner ruled it filed as its own task, **`0170`**.

### Citation form — two traps to route around

1. **Write no `:NNN` line numbers into any skill.** Task **`0160`** (open) is deciding the durable
   citation form for mutable coordinates, and its **Case 2** is exactly *line numbers into a growing
   file*. Citing ADR-034 by name/path needs no line number, so this task can avoid creating fresh Case 2
   surface without waiting on `0160`'s ruling — and must.
2. **`claude/scaffold/ai-agents/knowledge-base/decisions/` ships EMPTY** (verified). A relative link from
   a shipped `SKILL.md` to an ADR file is therefore **dead in every project fkit sets up**.
   `fkit-task-ship-loop` already writes several such links — that is a **pre-existing class and is not
   this task's to fix**. **Match each file's own established local form; invent no new convention:**
   - `fkit-stateful-review` and `fkit-process-stateful-review` cite ADRs **bare and unlinked** today
     (both write *"Since ADR-029 …"*). Use the bare form there.
   - `fkit-task-ship-loop` uses both forms. Match whichever the surrounding lines use.

### Dual-home: nothing to mirror

`claude/scaffold/` contains only `AGENTS.md`, `CLAUDE.md`, `ai-agents/` and `universal-rules.md` —
**no skills tree** (verified). The three `SKILL.md` files are single-homed under `claude/skills/`.
The `.claude/skills/` copies are gitignored and refreshed by `claude/fkit-claude-init.sh .` — edit the
canonical sources in `claude/`, never the copies.

## What to build

1. **`claude/skills/fkit-stateful-review/SKILL.md`** — at the close step (currently `:156`, *"when
   warranted"*), state the bar in place of the undefined word:
   - the ledger closes once the **swept work product** is clean;
   - residual defects in the task's **own record** (`brief.md`, `worklog.md`, ledger bookkeeping) go to
     *Accepted residuals* with What / Why / *Re-raise only if* instead of driving another round;
   - the split is **per site, not per file** — a swept site inside the task's own brief is work product;
   - **the classification is the reviewer's**, because the reviewer owns the findings section.
   - Cite ADR-034 as the authority.

2. **`claude/skills/fkit-process-stateful-review/SKILL.md:200-201`** — name the surface that *"nothing
   blocking remains"* leaves unnamed: nothing blocking **in the work product**; own-record residuals are
   **recorded under *Accepted residuals*, not treated as blockers**. Cite ADR-034.

3. **`claude/skills/fkit-task-ship-loop/SKILL.md`, step 7** (currently `:160-161`) — note that
   "closed-out" means the ADR-034 work-product bar, so that bar is what terminates the loop.
   **Ungated: the freeze question was settled against a freeze on 2026-07-31.**

4. **`claude/skills/fkit-task-ship-loop/SKILL.md`, the *Failure & exit behavior* table** (currently the
   *"Handed off to the producer → closed"* row at `:261`) — give the *"ledger closed-out and last verify
   green"* trigger the same qualification, so a reader who consults the table alone gets the same bar.
   **This site is not optional and not deferrable** — leaving it is exactly the partial coverage
   ADR-034 names as the defect.

5. **Do not restate the whole ADR at any of the four sites.** Each pointer is a short statement of the bar
   plus the citation — enough that a role reading only its own skill applies the right bar without
   opening the ADR, while the ADR stays the authority. A pointer that only links the ADR without stating
   the surface has not closed the gap this task exists to close.

## Verification steps

1. `grep -rn "ADR-034" claude/skills/` returns hits in **all three** `SKILL.md` files, with
   `fkit-task-ship-loop` hit at **both** its sites (step 7 and the exit table). Anything less fails —
   **there is no sanctioned partial outcome**, the freeze question that once allowed one was settled
   against a freeze on 2026-07-31.
2. **Read each edited close step in isolation, with the ADR closed.** It must name the surface (work
   product vs own record) and say where own-record residuals go. A step that cites ADR-034 without
   stating the bar **fails this step**.
3. `claude/skills/fkit-stateful-review/SKILL.md` states the **site-not-file** split and names the
   reviewer as the classifier. This is the detail whose omission would let a work-product defect be
   misclassified as own-record and closed over — the one failure ADR-034 calls out by name.
4. **No new `:NNN` line-number citation appears in the diff.** Check the diff directly, not the files.
5. The ledger schema lines `Status: in-review | closed-out` (`fkit-stateful-review/SKILL.md:49`,
   `fkit-process-stateful-review/SKILL.md:54`) are **byte-unchanged** in the diff.
6. `npm test` green. ⚠️ **the suite exceeds two minutes** — give it a generous timeout. A run killed at
   the two-minute mark is **not** a green run and must not be reported as one.
7. **Read the *Failure & exit behavior* table row on its own, with step 7 closed.** It must carry the
   same bar. A run that edits step 7 and leaves the table untouched fails this step — that is the
   whole reason site 4 is in scope.

## Notes

- **Depends on:** nothing hard. ADR-034 is accepted and is the authority for the bar. Soft-follows
  **`0160`**, which is deciding the citation form for mutable coordinates — this task sidesteps the
  collision by writing no `:NNN` line numbers into any skill, so it does not need to wait for that ruling.
- **Blocks:** nothing.

- **⚠️ Priority 147 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **✅ Resolved — the owner confirmed the appended rank on 2026-07-31**, ruling *"Confirm
  both as appended"* via `AskUserQuestion` in a live `/fkit-sprint-ship-loop` session, on this brief
  and `0168`'s together. The rank is **owner-confirmed**, no longer merely appended; the row did not
  move and nothing was renumbered. The flag no longer reads unresolved. ⚠️ **Note the gap this
  resolution does not close:** the flag as filed stated no merit position, which `/fkit-task-brief`
  step 5 requires alongside the flag — so the owner confirmed the rank **without** a stated merit
  alternative in front of them. The omission is now moot for this row and is not repaired
  retroactively.)*
  It was appended under `/fkit-task-brief` step 5 by a **spawned** producer with no owner channel,
  which that step forbids from re-ranking. No existing row was renumbered.

- **⚠️ THE PREDICTED FAILURE HAS NOW HAPPENED — evidence added 2026-08-02 at `0195`'s close. This is a
  live incident, not a hypothetical.** ADR-034 §Binds warned that *"until those pointers exist, this ADR
  is the only durable home for the bar and each role must reach it here."* On task
  [`0195`](../../done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/brief.md) that is
  exactly what went wrong: the Process-review worker **skipped the Step-0 ADR skim**, and so **did not
  find ADR-034** — the decision that set that review's close bar. The gap was caught only because the
  owner ordered the step **re-run** by a coder, which read the real procedure, ran the skim, and surfaced
  ADR-034 as *"binding and missed"*. It is recorded in
  `ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/review.md`, in the
  Step-0 row of its process-gap table.
  **What this changes for this task: nothing in scope, everything in urgency.** The four sites, three
  files and the edits below are unchanged and already correct. What is new is that the cost is now
  **observed** rather than predicted — a review reached its close bar by re-deriving it from scratch,
  and the next multi-round review will do the same until these pointers exist. **Re-measure the four
  line numbers at implementation time** (`fkit-task-ship-loop`'s step-7 close line measured at `:166` on
  2026-08-02, against the ADR's cited `:160-162` — the file has moved since ADR-034 was written).
  ⚠️ **Do not file a second task for this.** A follow-up naming *"the ADR-034 pointer gap"* was
  considered at `0195`'s close on 2026-08-02 and **rejected as a duplicate of this row.**

- **⛔ Out of scope, hard:**
  - The ledger **schema** lines (`Status: in-review | closed-out`) — format, not close condition.
  - The **ADR-links-ship-dead** class in `fkit-task-ship-loop` (relative links into
    `knowledge-base/decisions/`, which ships empty). Pre-existing, unrelated to ADR-034, and belongs to
    its own decision.
  - `fkit-sprint-ship-loop`'s own *"stays byte-unchanged"* wording — now **task `0170`**, filed on the
    owner's 2026-07-31 ruling. Not this task's to fix, and this task must not touch it.
  - Any change to **what a review finds** or to the **work-product bar itself**. ADR-034 explicitly
    leaves both untouched; this task is pointers only.
  - Any machine guard that a pointer exists. `0152` / `0154` own the `SKILL.md` file walk.

- **One brief, not several — the split was considered and rejected.** The four pointer edits are each
  individually verifiable, so an independent-shippability argument exists. It was rejected because the
  deliverable is **coverage across three roles**: partial coverage is precisely the defect ADR-034
  names, and separate task folders would each carry a brief, worklog and review ledger larger than the
  edit inside it. **The one real seam has closed** — the `fkit-task-ship-loop` freeze question, which
  could once have blocked sites 3 and 4 while 1 and 2 shipped, was ruled a non-blocker by the owner on
  2026-07-31. The brief no longer carries a fallback shipment, because there is nothing left to fall
  back from.

- **Provenance.** Filed 2026-07-31 by a spawned `fkit-producer` at the end of a `/fkit-sprint-ship-loop`
  run, on the owner's `AskUserQuestion` ruling that the ADR-034 pointers be filed as a task rather than
  left as an ADR footnote.
