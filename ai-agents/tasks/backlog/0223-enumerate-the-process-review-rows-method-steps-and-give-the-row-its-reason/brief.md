# Enumerate the Process-review row's method steps, and give the row its reason

## ID
0223

## Sprint
Sprint 6

## Priority
Sprint 6 P11

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 1 of `0200`'s report**, filed on a **named owner ruling** taken via `AskUserQuestion` in a
live `fkit lead` driver session on **2026-08-05**: *file items 1, 2, 3 and 4 from `0200`'s unfiled
follow-ups list*. Source:
[`2026-08-05-eval-process-review-step-role-ownership.md`](../../../knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md)
**§8 item 1** (with §3 and S8/S10 carrying the reasoning). **Cite the report by path; do not
re-narrate it, and do not re-weigh the options it already settled.**

**The defect.** The sprint loop's step-2 spawn table has a **Process review** row that names its method
but never says what the method contains. Measured on disk 2026-08-05 at
`claude/skills/fkit-sprint-ship-loop/SKILL.md:124`:

> `| **Process review** | @fkit-coder | apply fkit-process-stateful-review **method** — verify each
> finding, classify defect/frontier, write the *Coder response*; … |`

**What that cost, measured.** On `0195` a worker applied the method **by hand** and
`ai-agents/tasks/done/0195-…/worklog.md:245-260` (frozen ledger) records what it missed: **Steps 0, 2,
3 and 3.5 never ran** — the ADR skim, the settled-decision loop check, the codebase verification, the
defect/frontier classification and regression check — **and Step 4's prescribed status vocabulary was
not used.** Nothing in the row said what *"the method"* contains, so a partial application looked
complete to the worker performing it.

The row is also the **only** skill-naming row in that table without the `/` prefix and the verb *"run"*
(report S10). **That anomaly is explained, not accidental** — see the mandatory constraint below.

## What to build

Two edits, both to `claude/skills/fkit-sprint-ship-loop/SKILL.md`, step-2 table, **Process review** row.

### 1. Enumerate the method's steps in the row

List the steps of `claude/skills/fkit-process-stateful-review/SKILL.md` that the Process-review worker
must perform, so a partial application is visible to the worker itself.

### 2. Give the row its reason

Add one clause stating **why** this step is `@fkit-coder` and not the deliverable's author: the skill
writes the ledger's **coder-owned** *Coder response* section, and its Step 6 **applies code fixes**.
Without the reason, a future driver re-derives the substitution as obviously right — which is exactly
what happened on 2026-08-02. Cite **ADR-038** once it exists (`0223` depends on `0222`).

---

### ⛔ MANDATORY — keep the word *"method"*. The brief fails without this.

**Keep the wording *"apply the `fkit-process-stateful-review` **method**"*. Do NOT change it to
*"run `/fkit-process-stateful-review`"*.**

*"Method"* is a **settled ADR-019 / ADR-032 convention** meaning *apply the steps, skip the skill's
per-round owner gate, because the loop's single up-front approval replaces it*. **ADR-019 lists
narrowing that gate under Options considered → Rejected.** The construction is used consistently in
three files, verified on disk 2026-08-05:

- `claude/skills/fkit-sprint-ship-loop/SKILL.md:124`
- `claude/agents/fkit-coder.md:73` — *"apply `fkit-process-stateful-review`'s method"*
- `claude/skills/fkit-task-ship-loop/SKILL.md:152` — *"apply the **method** of
  `fkit-process-stateful-review` (do **not** run that skill's owner gate — this loop's authorization
  replaces it)"*, and `:303` — *"used by *method*, not invoked-and-overridden"*

**Switching to the invocation form would re-impose the per-round owner gate ADR-019 deliberately
replaced**, inside a loop whose whole premise is that the owner approved once, up front. This is
report finding **R1** — `0200`'s Round-1 answer said the opposite and was **reversed**. Do not
re-derive it.

---

### ⚠️ MANDATORY — carve out the CLAUSES, not the STEPS. A blanket form is itself a defect.

The gate that the loop's approval replaces is **three approval clauses inside Steps 4–6**, not those
steps wholesale. **Verified first-hand 2026-08-05** in
`claude/skills/fkit-process-stateful-review/SKILL.md`:

| Gate clause — EXCLUDE from the enumeration | Line |
|---|---|
| Step 4: *"For anything requiring a code change, set Status = **`pending approval`** (nothing is applied yet)."* | `:174` |
| Step 5: *"Then **wait for my explicit approval** before changing any code."* | `:191` |
| Step 6: *"Once I explicitly approve specific findings:"* (the precondition) | `:197` |

**The same steps carry non-gate work the Process-review worker MUST do — KEEP it:**

| Non-gate work — KEEP in the enumeration | Line |
|---|---|
| Step 4 — *"Assign verdicts and write the Coder response rows"*; write one row per finding, keyed by id | `:167`, `:170` |
| Step 5 — the **report + convergence call** (only the approval sentence is the gate) | `:182` |
| Step 6 — update the *Coder response* row (Action + Status `✅ done`) | `:201` |
| Step 6 — add an **Accepted residuals** entry for a confirmed intended tradeoff | `:203` |
| Step 6 — set the document header **Status: closed-out** | `:207` |

⛔ **A brief or an edit that says *"every step except 4/5/6"* fails in the opposite direction** — it
would drop *"write the *Coder response*"*, which the on-disk gloss puts squarely in scope:
`claude/agents/fkit-coder.md:73` and the Process-review row itself both already read *"verify each
finding, classify defect/frontier, write the *Coder response*"*. **Match that gloss; do not re-derive
it.**

⚠️ **Re-verify all eight line numbers above yourself before editing.** They were measured 2026-08-05
and `SKILL.md` files in this repo move.

### Out of scope

- ⛔ **Do not edit `claude/skills/fkit-process-stateful-review/SKILL.md`.** ADR-032 keeps it
  byte-unchanged; the enumeration lives in the loop's row, not in the skill.
- ⛔ Do not change the row's `@fkit-coder` value — it is already correct (report S7: the row and
  `skills_for_role()` agree exactly, and always did).
- ⛔ Do not touch `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`, or `test/`.
- ⛔ Do not reopen ADR-018 / ADR-019 / ADR-032 / ADR-033 / ADR-037.

⚠️ **Contended file.** `claude/skills/fkit-sprint-ship-loop/SKILL.md` is edited by `0203` (the *"honor
the ADRs"* Rules bullet), `0208` (§5.4's exit table) and `0224` (the worklog contract). The step-2
table row at `:124` is a fourth region. **Not to be worked in parallel; whichever lands second
re-verifies its coordinates.**

## Verification steps

1. `/usr/bin/grep -n 'fkit-process-stateful-review' claude/skills/fkit-sprint-ship-loop/SKILL.md`
   returns the Process-review row and the row still contains the literal token `**method**`. The
   string `run /fkit-process-stateful-review` appears **nowhere** in the file.
2. The row names, at minimum, Steps **0, 2, 3, 3.5** — the four the `0195` hand-application skipped —
   plus Steps 1, 4, 6 and 7.
3. The row does **not** instruct the worker to wait for owner approval, and does **not** reproduce any
   of the three clauses at `:174` / `:191` / `:197`.
4. The row **does** still instruct: write the *Coder response* rows; update them to `✅ done`; record
   an *Accepted residuals* entry where applicable; set the header `Status: closed-out`.
5. The row carries a reason clause naming **both** grounds — the coder-owned *Coder response* section
   **and** Step 6's source-write — and cites ADR-038.
6. `git diff --stat` shows **exactly one file changed**:
   `claude/skills/fkit-sprint-ship-loop/SKILL.md`.
7. `node --test test/` passes (ADR-014: `node --test`, zero devDeps). `test/skill-frontmatter.test.js`
   walks every `SKILL.md`, so a malformed edit surfaces there.
8. **The honest limit is stated in the worklog:** an enumerated row still relies on the driver and the
   worker reading it. It is a prose control. Detection is `0224`'s job, not this task's.

## Notes

- **Depends on:** `0222` (records ADR-038 — the row's reason clause cites it).
- **Blocks:** nothing.
- **Owner:** fkit-coder — a source edit under `claude/`.
- **Size: small.** One row in one file.
- **Merit position, for the owner:** this belongs with `0203` and `0208`, the other two open
  sprint-loop `SKILL.md` repairs, so the contended file is worked once. It sits **below** `0224`,
  which supplies detection where this supplies only prose.
- ⚠️ **Filed on the Backlog board because the owner's ruling named no sprint.** A spawned producer
  has no owner channel and never invents a sprint placement. **Flagged for owner confirmation:
  Sprint 2 may be the intended home**, alongside `0222`.
- This task **does not** decide the routing rule — `0200` already ruled it and `0222` records it.
