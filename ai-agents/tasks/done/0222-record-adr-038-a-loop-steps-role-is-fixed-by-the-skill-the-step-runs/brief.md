# Record ADR-038 — a loop step's role is fixed by the skill the step runs, not by the deliverable's author

## ID
0222

## Sprint
Sprint 3

## Priority
3

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**Filed on a named owner ruling given via `AskUserQuestion` in the live `fkit lead`
`/fkit-sprint-ship-loop` driver session on 2026-08-05: *authorize a producer follow-up to file
ADR-038*.** It is the **only** follow-up authorized so far out of the eight the source report names —
the other seven are held for the owner and are **not** filed.

> ⚠️ **Dated correction 2026-08-06 — the sentence above was true when written and is FALSE now. Every
> follow-up is filed; none is held.** The count is also wrong in a second way: **the true number of
> distinct follow-ups was SEVEN, not eight, on the day this was written** — report §8 item 6 is struck
> through *in the report itself* (*"FOLDED INTO follow-up 3 (R2)"*), so *"the other seven"* should have
> read *"the other six"* even on 2026-08-05. **The full accounting, and the correction to this brief's
> `Blocks:` rationale, is in the note at the end of §Notes — read it there.** The sentence above is left
> byte-identical as the record of what was true on 2026-08-05. **This ADR's content and scope are
> unaffected; its rank is unaffected.**

### What was decided, and where the reasoning lives

`0222` records a decision that has **already been taken**. Task `0200`
(`ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/brief.md`,
closed 2026-08-05) ruled:

> **"The Process-review step's role is fixed by the skill the step runs, not by who wrote the
> deliverable: it is always `@fkit-coder`."**

Its recommendation: **option (a)** — the loop states the rule plainly *and says why* — with the row's
*"apply … **method**"* wording **kept and enumerated**, plus **option (c)'s paired detector as a
non-optional companion**. **Option (b) — granting `fkit-process-stateful-review` to the architect in
`skills_for_role()` — is rejected.**

**The deliverable carrying the full reasoning is
`ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md`** (§6 states
why an ADR is required; §7 the recommendation; §8 item 2 names this follow-up).

> **Division of labour, stated so it is not re-litigated: the ADR records the decision; the report
> carries the reasoning.** The ADR should be citable on its own and should **not** re-narrate the
> report. Cite the report by path for the analysis.

### Why this is an ADR and not a wording change

**It closes an axis an accepted ADR explicitly left open.** ADR-037
(`adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md`)
§Context says:

> *"Not decided here (the invocation axis): which skill a role may run at all."*

An open axis in an accepted ADR is closed by an ADR, not by a table row. The rule also **generalizes
beyond this one step** — it governs role selection for every current and future step in every loop —
and recording the **rejection of (b)** on the record is what stops the next architect-authored
deliverable re-opening the argument.

### Decisions that bear on this — cite, do not reopen

- **ADR-018** — the `PreToolUse` skill-ownership hook; it resolves role from `agent_type` at any spawn
  depth. It worked correctly in the incident. ⛔ **Not reopened.**
- **ADR-012** — `skills_for_role()` is the single declared source of truth for role→skill ownership.
  ⚠️ ADR-012 names the **stale home** `claude/fkit-claude.sh`; the function lives in
  `claude/skills-for-role.sh` today. **Cite the file, not ADR-012's path.**
- **ADR-033** — movers are producer-only. The nearest precedent for *"this step belongs to that role,
  structurally"*, and for routing a step to its owning role rather than widening a skill grant.
  ⛔ **Not reopened.**
- **ADR-019 / ADR-032** — the loop's single up-front approval **replaces** the stateful-review skill's
  per-round owner gate. ⚠️ **The ADR must not phrase the rule in a way that re-imposes that gate**
  (this is report finding **R1**, re-scoped on the owner's ruling).
- **ADR-035** — append-never-insert. This brief is filed by a spawned producer with no owner channel;
  **no row was re-ranked.**

## What to build

**One ADR. No implementation, no skill edit, no test.**

1. **Re-verify before writing.** The source report warns it decays and was written against a tree
   several workers were editing. Confirm first-hand that the report exists at the path above, that
   `0200` is closed, and that ADR-037 §Context still carries the *"Not decided here (the invocation
   axis)"* sentence. **Report anything that no longer holds instead of writing around it.**

2. **⚠️ MANDATORY — a FOUR-WAY number sweep before allocating the ADR number.** `adr-037` is the
   highest on disk in `decisions/` today, so **038 is likely — but it must not be assumed.**
   **ADR-029 precedent: a number was once claimed everywhere EXCEPT `decisions/`**, so a sweep of
   `decisions/` alone is exactly the check that already failed once. Sweep **all four**:
   - `ai-agents/knowledge-base/decisions/`
   - `ai-agents/knowledge-base/reports/`
   - the sprint boards (`ai-agents/sprints/`, including `sprints/done/` and `backlog.md`)
   - **`ai-agents/wiki-vault/`** — read-only; ⛔ **never write it** (ADR-005, `fkit-wiki` only).

   If any of the four already claims `038`, **take the next free number and say so loudly in the
   report** — do not renumber the claimant.

3. **Write the ADR** via the architect's own procedure (`/fkit-record-decision`), into
   `ai-agents/knowledge-base/decisions/`. It must record:
   - **The decision**, in a sentence a future driver can act on: *a loop step's role is fixed by the
     skill the step runs, not by the deliverable's author.*
   - **Options weighed and why the others were rejected** — (a), (b), and the "neither" option —
     including that **(b) was rejected because it hands a source-write procedure to a design-only
     role**, and that the same argument would generalize to most of the team.
   - **The accepted tradeoff, stated honestly, not smoothed over:** this rule stays **prose**. The
     hook gates skill *invocation*; a driver that spawns the wrong role and tells it to work **by
     hand** never reaches the gate. **The ADR accepts a prose rule plus a durable detector in place of
     prevention** — the same shape ADR-033 states about its own residual.
   - **A `Re-raise only if` clause**, so the next architect-authored deliverable does not re-open this.
   - **Consequences**, including that the implementation follow-ups (the loop row's enumeration, the
     paired detector, the tests) are **separate tasks not yet filed**.

4. **Do NOT restate the report's analysis.** Cite
   `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` by path.

> ⚠️ **Two figures in the source report are ACCEPTED RESIDUALS — do not copy them forward unchecked.**
> - The report's §7 mirror-cost line reads **"8 files / 9 sites"**. The review ledger's accepted
>   residual **R15** records the true figure as **7 files / 8 sites** — a reviewer number that
>   propagated. **If the ADR quotes a mirror cost at all, re-count it first; better, omit it** (the
>   count belongs to the rejected option (b) and is not load-bearing for the decision).
> - **R18**: the report's phrase *"outside the denied worker's control"* **overstates** — ADR-022
>   leaves every role except the adversarial reviewer tool-unrestricted. **Do not carry that phrasing
>   into the ADR.**

**⛔ Out of scope, by name:**
- Editing `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/skills-for-role.sh`,
  `claude/skill-ownership-hook.sh`, or anything under `test/` — those are the **unfiled** follow-ups.
- Any edit to `ai-agents/tasks/done/0200-*/`, `done/0195-*/`, `done/0158-*/` or `done/0143-*/`.
- Reopening ADR-018, ADR-033 or ADR-037.
- Any `ai-agents/wiki-vault/` write (ADR-005 — reads only, and the sweep in step 2 is a read).
- Any commit, any re-rank, any task-file move.

## Verification steps

1. A new file exists at `ai-agents/knowledge-base/decisions/adr-0NN-<slug>.md`, where `0NN` is the
   number the step-2 sweep produced.
2. **The sweep is evidenced in the ADR or the hand-off report** — the four greps and their results are
   stated, so a reader can see that `reports/`, the boards and `wiki-vault/` were checked and not just
   `decisions/`. An ADR that asserts "038 was free" without showing the four-way check **fails this
   step**.
3. `grep -n "Not decided here" ai-agents/knowledge-base/decisions/adr-037-*.md` returns the open-axis
   sentence, and the ADR quotes or cites it as the axis it closes.
4. The ADR contains, each findable by reading one labelled section: the decision sentence; the
   rejection of (b) with its reason; the accepted prose-not-prevention tradeoff; and a
   `Re-raise only if` clause.
5. The ADR cites `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md`
   by path, and does **not** reproduce §§1–5 of it.
6. `grep -rn "9 sites\|outside the denied worker's control" <the new ADR>` returns **nothing** — the
   two accepted-residual figures were not propagated.
7. `git status --porcelain` shows only the new ADR and this task's folder — **nothing** under `claude/`,
   `test/`, `ai-agents/tasks/done/`, or `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing. `0200` is closed and its report is on disk.
- **Blocks:** the seven unfiled `0200` follow-ups — each will want a citable ADR number rather than a
  report path.

**The other seven follow-ups from the same report are deliberately NOT filed.** The owner authorized
this one only. They are held for the owner's decision and are listed in the driver's hand-off, not
here — **do not file them from this task.**

> ## ⚠️ Dated correction 2026-08-06 — the `Blocks:` line above and the paragraph above are BOTH false today. Nothing is held; nothing is unfiled.
>
> **Both statements were true when written on 2026-08-05.** They are left **byte-identical** as the
> record of what was true that day. **This ADR's decision, scope, verification steps and rank are
> unaffected** — this note corrects a status claim and a rationale, nothing else. ⚠️ It is a **drift
> correction, not a reversal**: no instruction in this brief is withdrawn, and *"do not file them from
> this task"* still stands (there is now simply nothing left to file).
>
> ### 1. The count was wrong from the start: SEVEN distinct follow-ups, not eight
>
> Report §8 numbers its items 1–8, but **item 6 is struck through in the report itself** — its heading
> reads *"~~Require a `**Role:**` line per worklog round, and test for it.~~ **FOLDED INTO follow-up 3
> (R2)**"*, and item 3 confirms it: *"Supersedes follow-up 6, which is its second half."* So there were
> **seven distinct follow-ups**, one of which is this task. ***"The other seven"* should have read *"the
> other six"* on 2026-08-05.**
>
> ### 2. The filing status, item by item — measured on disk 2026-08-06
>
> | §8 item | Task | Filed |
> |---|---|---|
> | 1 — enumerate the Process-review row's method steps, give the row its reason | [`0223`](../../backlog/0223-enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason/brief.md) | 2026-08-05 |
> | 2 — file ADR-038 | **`0222` — this task** | 2026-08-05 |
> | 3 — the paired misroute detector | [`0224`](../../backlog/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md) | 2026-08-05 |
> | 4 — the loop-table row↔ownership test | [`0225`](../../backlog/0225-add-the-loop-table-row-to-skill-ownership-test/brief.md) | 2026-08-05 |
> | 5 — repair the four-mirror checklist | [`0226`](../../backlog/0226-repair-the-four-mirror-checklist-in-skills-for-role-shs-header/brief.md) | 2026-08-05 |
> | 6 — worklog `**Role:**` line | ⛔ **struck in the report**, folded into item 3 = `0224` half (ii) | n/a |
> | 7 — correct ADR-012's stale source-of-truth path | [`0232`](../../backlog/0232-correct-adr-012s-stale-source-of-truth-and-code-coordinates/brief.md) | **2026-08-06** |
> | 8 — assess the denial record as an ADR-036 registry site | [`0233`](../../backlog/0233-assess-the-denial-log-as-an-adr-036-registry-site/brief.md) | **2026-08-06** |
>
> **Zero remain unfiled.** Items 1, 3, 4 and 5 were filed on a named owner ruling of 2026-08-05
> (*"file items 1, 2, 3 and 4 from `0200`'s unfiled follow-ups list"*); items 7 and 8 on a named owner
> ruling of **2026-08-06**, verbatim: ***"File both now."***
>
> ⚠️ **`0232` widened item 7's scope.** The report frames item 7 as one coordinate. A producer measured
> ADR-012 on 2026-08-06 and found **five classes of stale citation**, including three claims that are
> false on their facts and a stale self-citation. `0232` is filed against the whole file. **The report's
> one-line framing of item 7 is an undercount — do not treat it as the scope.**
>
> ### 3. ⚠️ The `Blocks:` RATIONALE is also wrong — measured, not asserted
>
> The line above claims **each** follow-up *"will want a citable ADR number rather than a report path."*
> **Scored per item against what each brief actually declares:**
>
> | Task | Declares `Depends on: 0222`? | Is the stated reason "wants a citable ADR number"? |
> |---|---|---|
> | `0223` | **yes** — *"the row's reason clause cites it"* | **yes — the one genuine case**, and even here only the row's *reason* clause needs it |
> | `0224` | yes — *"the rule this detector guards"* | **no.** It is a **mechanism** (hook `deny()` + worklog line). It functions with or without an ADR on disk. |
> | `0225` | yes — *"the rule the table row encodes"* | **no.** It is a **test** asserting a row agrees with `skills_for_role()`. It functions without the ADR. |
> | `0226` | **no** — its brief declares independence explicitly | **no.** The report itself says *"Independent of this ruling."* A **fact repair** that stands alone. |
> | `0232` | **no** | **no.** A **fact repair** on ADR-012's coordinates; unrelated to ADR-038. |
> | `0233` | **no** — depends on `0189` and `0224` | **no.** An **ADR-036** registry question, not an ADR-038 one. |
>
> **Honest summary: `0222` is a real blocker for AT MOST ONE of the six** (`0223`, and only for its
> reason clause). The rest are mechanisms, tests, or fact repairs that stand on their own. The
> *"each will want a citable ADR number"* rationale **does not survive measurement**.
>
> ⛔ **One handed-down figure was checked and found WRONG — recording it so it is not propagated
> further.** The instruction that produced this note asserted *"four of the five filed did not wait for
> it."* **Measured on disk 2026-08-06, that is false: three of the four follow-ups filed on 2026-08-05
> (`0223`, `0224`, `0225`) DO declare `Depends on: 0222`.** Only `0226` declares independence. The claim
> that most did not wait is true **on merit** (see the table) but **false as a description of what the
> briefs say**. Those are different things and this note keeps them apart.
>
> ### 4. What is NOT changed here, and why
>
> - ⛔ **`0223`'s, `0224`'s and `0225`'s `Depends on:` lines are NOT edited.** This note records that
>   their stated dependency looks weaker than declared; **changing another task's dependency is that
>   task's decision, not a note's.** → **Open question for the owner, below.**
> - ⛔ **The rank stays `P189`.** The owner ruled 2026-08-06, verbatim: ***"Accept P189; merit lives in
>   the brief."*** The merit position stays recorded in the brief only, exactly as the 2026-08-06 note
>   above §Notes describes. **No row was renumbered** — `/fkit-task-brief` step 5 and ADR-035 bar
>   renumbering closed rows.
> - ⛔ **The report is not edited.** Its §8 is a dated record of what one author recommended on
>   2026-08-05.
>
> ### 5. Open question for the owner
>
> **Should `0223`, `0224` and `0225` keep their declared `Depends on: 0222`?** On the measurement above,
> only `0223`'s survives scrutiny, and the other two look like *subject* relationships recorded as
> *blocking* ones — which would idle two runnable tasks behind an unwritten ADR. **A producer has not
> changed them and will not without a ruling.** If the answer is to relax them, that is one small
> follow-up task, not an edit to this brief.

**⚠️ Priority 189 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
*(Original flag as filed 2026-08-05, kept verbatim. **The confirmation arrived on 2026-08-06 — see the
dated note below**, which also records why the rank did **not** change.)*
**On merit this belongs directly above `0203`**, the highest-ranked open row on this board, because
`0203` and `0208` both amend the same sprint-loop skill this ADR governs, and every implementation
follow-up the ruling implies will want to cite an ADR number rather than a report path — so recording
the decision first is what makes the rest citable. Filed by a spawned producer with **no owner
channel**, which never re-ranks (ADR-035, `/fkit-task-brief` step 5). **No existing row was renumbered,
inserted past, or touched**, and no `✅ Done` / `⛔ Cancelled` / `➡️ Moved` row was altered.

**✅ 2026-08-06 — the merit position is OWNER-CONFIRMED. The rank stays `189`, and that is not an
oversight.**

- **Authority, before outcome.** The **owner** ruled on **2026-08-06**, via **`AskUserQuestion` in a
  live `fkit lead` session**, on the flag above. The question put was whether `0222` belongs above
  `0203`; the owner's selected answer was ***"Move it above 0203."*** A spawned `fkit-producer`
  carried out the follow-up on that instruction and **contributed no merit judgment of its own**.
  **This is not producer precedent for re-ranking.**
- **What the ruling settles:** the merit claim in the paragraph above is **confirmed by the owner**, no
  longer a producer's unreviewed assertion. `0222` belongs directly above `0203`.
- **What the ruling could NOT be executed as, and why.** The Priority cell was **not** changed, and no
  row on `ai-agents/sprints/sprint-2.md` was renumbered. Verified on **2026-08-06**: `0222` at `P189`
  is the **only open row on the entire board** — every row from `P181` (`0203`, `✅ Done`) through
  `P188` (`✅ Done`) is `✅ Done` or `➡️ Moved`. Promoting `0222` to sit above `0203` would renumber
  **eight closed rows** (`P181`→`P182` … `P188`→`P189`). That is barred by `/fkit-task-brief` step 5 —
  ***"`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner
  ruling"***, ***"a closed row is a wall, not a step"*** — and by **ADR-035**, which states the
  closed-row rule **outranks** the owner-ruled re-rank exception and narrows that exception to
  *"moving an existing row within its own contiguous run of open rows."* `0222`'s contiguous run of
  open rows contains only `0222`, so its reachable ceiling **is** `P189`.
- **This is the exact cost ADR-035 accepted in writing** (*"an owner cannot place a new task at its
  merit position when that position is behind a closed row"*), and this note **is** ADR-035's
  prescribed remedy: the row appends, and the ordering intent lives here as a relative merit statement
  naming its neighbour by folder ID. **Escalated to the owner** — relaxing this would mean amending the
  closed-row rule itself, which is an owner decision and not one a producer takes.

**⚠️ This brief decays.** Every coordinate was read on 2026-08-05 from a tree with concurrent
untracked work in it, and **the ADR number is the one thing it deliberately does not fix** —
re-derive it at implementation time via the four-way sweep.

- **⚠️ DATED CORRECTION 2026-08-06 — pulled onto Sprint 3 by the rollover.** The append-rank and
  merit-divergence notes above describe this brief's position on the board it came from and **no longer
  describe its position today**. Sprint 3 is a **fresh board with no closed rows**, so its `P1`–`P3` were
  assigned **on merit, freely** — ADR-035's closed-row wall does not apply there yet, and no append/merit
  divergence exists on that board. **The original notes are left byte-identical**; scope, dependencies and
  prohibitions are unaffected. Ranking rationale: `ai-agents/sprints/sprint-3.md`, §"How this board was
  ranked". Pulled by owner ruling, `AskUserQuestion`, live `fkit lead` session 2026-08-06.
- **Ranked `P3` on Sprint 3 — and this is the one recorded merit position the rollover did NOT honor.**
  The `On merit` statement above places this row *"directly above `0203`, the highest-ranked open row on
  this board"*. Its **stated reason is discharged**: `0203` moved to the Backlog board and `0208` closed,
  so the two rows it wanted to sit above are no longer on any active board. Combined with this brief's own
  2026-08-06 correction — which narrows `Blocks:` from seven follow-ups to **at most one** (`0223`, reason
  clause only) — it was ranked below the two rows the owner pulled in by name. **This is a producer
  judgement, not an owner ruling, and it is flagged as an open question on the Sprint 3 board.**
  **Promoting it costs nothing right now** — no row on Sprint 3 is closed, so a re-rank there is free.
- **⚠️ DATED CORRECTION 2026-08-06 (later the same day) — the rank in the bullet above is STALE: this
  row is Sprint 3 `P4` now, not `P3`.** An **owner-ruled re-rank** landed after that bullet was
  written: verbatim **"Move to merit P3 (Recommended)"** (`AskUserQuestion`, live `fkit lead` session,
  2026-08-06) moved `0241` to its recorded merit position — Sprint 3 `P3`, directly below `0182` — and
  `0222` to **Sprint 3 `P4`**. Recorded in full, with authority and the reconciliation against the
  earlier same-day *"Leave it at P3."* ruling (they answered different questions and do not conflict),
  in `ai-agents/sprints/sprint-3.md`, §"Addendum — OWNER-RULED re-rank (2026-08-06)". The bullet
  above's *"flagged as an open question on the Sprint 3 board"* clause is likewise discharged — both
  rulings are in. **This correction to the brief was itself owner-ruled**: verbatim **"Yes, fix it
  (Recommended)"** (`AskUserQuestion`, live `fkit lead` session, 2026-08-06). The bullet above is left
  **byte-identical**, per this project's dated-correction form; the bullet below's quoted pointer text
  *"priority P3"* records the Sprint 2 row's frozen at-move-time text and is **not** edited — it is
  governed by the board addendum. **Scope, dependencies, prohibitions and the ADR's content are
  unaffected.**
- **Its Sprint 2 row is frozen at `P189`** and stays readable at `ai-agents/sprints/done/sprint-2.md`,
  reading `➡️ Moved to [Sprint 3](../sprint-3.md) — priority P3`. A moved row's rank on the source board
  is never rewritten.
