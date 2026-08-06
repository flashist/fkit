# Record ADR-038 — a loop step's role is fixed by the skill the step runs, not by the deliverable's author

## ID
0222

## Sprint
Sprint 2

## Priority
189

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Filed on a named owner ruling given via `AskUserQuestion` in the live `fkit lead`
`/fkit-sprint-ship-loop` driver session on 2026-08-05: *authorize a producer follow-up to file
ADR-038*.** It is the **only** follow-up authorized so far out of the eight the source report names —
the other seven are held for the owner and are **not** filed.

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

**⚠️ Priority 189 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs directly above `0203`**, the highest-ranked open row on this board, because
`0203` and `0208` both amend the same sprint-loop skill this ADR governs, and every implementation
follow-up the ruling implies will want to cite an ADR number rather than a report path — so recording
the decision first is what makes the rest citable. Filed by a spawned producer with **no owner
channel**, which never re-ranks (ADR-035, `/fkit-task-brief` step 5). **No existing row was renumbered,
inserted past, or touched**, and no `✅ Done` / `⛔ Cancelled` / `➡️ Moved` row was altered.

**⚠️ This brief decays.** Every coordinate was read on 2026-08-05 from a tree with concurrent
untracked work in it, and **the ADR number is the one thing it deliberately does not fix** —
re-derive it at implementation time via the four-way sweep.
