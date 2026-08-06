# Plan — Task 0222: Record ADR-038 ("a loop step's role is fixed by the skill the step runs, not by the deliverable's author")

**Deliverable:** one new ADR in `ai-agents/knowledge-base/decisions/`, authored via
`/fkit-record-decision` — the architect's skill, so the Build step spawns `@fkit-architect`
(step-role-follows-skill: the very rule this ADR records). No implementation, no skill edit, no test.

**Planning-pass verification (2026-08-06, first-hand):** source report on disk; `0200` closed in
`done/`; ADR-037:33 still carries the open-axis sentence; no `decisions/` file claims 038. All
pre-conditions hold — nothing in the brief had to be written around.

## Steps

### 1. Build-time re-verification (repeat, don't trust this plan's snapshot)
The brief warns it decays. The builder re-confirms first-hand before writing:
- report exists at `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md`;
- `0200` sits in `ai-agents/tasks/done/`;
- `grep -n "Not decided here" ai-agents/knowledge-base/decisions/adr-037-*.md` returns the sentence.
Report any miss instead of writing around it.

### 2. MANDATORY four-way number sweep (build-time, evidenced)
Run and record all four greps — `decisions/`, `reports/`, the sprint boards
(`ai-agents/sprints/` incl. `done/` and `backlog.md`), and `ai-agents/wiki-vault/` (READ-ONLY):
```
ls ai-agents/knowledge-base/decisions/ | grep -i 038
grep -rln "adr-038\|ADR-038" ai-agents/knowledge-base/reports/ ai-agents/sprints/ ai-agents/wiki-vault/
```
**Classification rule (this is what makes the sweep meaningful, and the planning snapshot shows it
will be needed):** many files already carry `ADR-038` strings — `0240`'s backlog row counts 17 —
but a hit is a rival claimant **only if it uses 038 for a different decision**. A reference to
*this* future ADR ("file ADR-038", "ADR-038 is 0222, unwritten") is not a claim. Planning-pass
snapshot: every hit is a reference to this ADR; **038 is expected free — but the builder
re-derives, never assumes** (ADR-029 precedent: a number was once claimed everywhere except
`decisions/`). If a genuine claimant appears, take the next free number and say so loudly; never
renumber the claimant. The four greps + classification go into the ADR or the hand-off report
(brief verification step 2 fails an unevidenced "038 was free").

### 3. Write the ADR via /fkit-record-decision
File: `ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md`
(number per step 2). Labelled sections, each findable on its own (brief verification step 4):

- **Context** — the axis ADR-037 §Context explicitly left open, quoting its line 33 sentence; the
  incident in one or two sentences (drivers spawned the wrong role for the Process-review step on
  three consecutive tasks; the ADR-018 hook worked correctly where it was reached); ruled by task
  `0200` (closed 2026-08-05). **Cite the report by path for all analysis — do not re-narrate its
  §§1–5** (brief verification step 5). Cite `claude/skills-for-role.sh` as the ownership source of
  truth — the file, NOT ADR-012's stale `claude/fkit-claude.sh` path.
- **Decision** — the actionable sentence: *"A loop step's role is fixed by the skill the step runs,
  not by the deliverable's author."* Concretely: Process-review is always `@fkit-coder`, because
  `fkit-process-stateful-review` writes the ledger's coder-owned section and its Step 6 applies
  code fixes — neither changes when the deliverable is a document. Records **(a) + (c)'s paired
  detector as a non-optional companion**.
- **Options weighed** — (a) enumerated, reasoned row (accepted); **(b) rejected by name**: granting
  `fkit-process-stateful-review` to `architect` in `skills_for_role()` hands a source-write
  procedure to a design-only role, the grant is total-or-absent (no per-artifact scoping exists),
  and the premise generalizes to four of seven roles; (c) detector-only (necessary, not
  sufficient). ⛔ Omit the mirror-cost figure entirely — the report's "8 files / 9 sites" is
  accepted residual R15 (true: 7 files / 8 sites) and the count is not load-bearing for a rejected
  option. Verification: `grep "9 sites" <ADR>` must return nothing.
- **Accepted tradeoff, stated honestly** — the rule stays **PROSE**. The ADR-018 hook gates skill
  *invocation*; a driver that spawns the wrong role and instructs by-hand work never reaches the
  gate. Prose rule + durable detector **in place of prevention** — the same shape ADR-033 states
  about its own residual. ⛔ Do NOT phrase the detector as "outside the denied worker's control"
  (residual R18 — ADR-022 leaves every role but the adversarial reviewer tool-unrestricted; the
  log is durable, not tamper-proof). Verification: grep for that phrase must return nothing.
- **Gate non-reimposition** — one explicit sentence: this rule governs *role selection* only; the
  loop's single up-front approval still replaces the skill's per-round owner gate (ADR-019/ADR-032,
  report finding R1), and the row's "apply … method" construction stays. Cites, does not reopen.
- **Re-raise only if** — e.g.: a skill gains per-artifact grant scoping in `skills_for_role()`;
  the owner re-rules on `0200`; a loop step is created whose skill has no owning role. Keeps the
  next architect-authored deliverable from re-opening (b).
- **Consequences** — the implementation follow-ups are **separate, already-filed tasks**: `0223`
  (row enumeration + reason — the one task depending on this ADR, reason clause only), `0224`
  (paired detector), `0225` (row↔ownership test), `0226`, `0232`, `0233`; `0224`/`0225` deps
  owner-relaxed 2026-08-06. ⚠️ The brief's item-3 bullet says "not yet filed" — written 2026-08-05
  and falsified by the brief's own dated correction; the ADR states today's measured truth, dated.
  May cite corroborating practice: the 2026-08-06 driver run applied the rule live — `0241`'s
  Build spawned `@fkit-architect` (deliverable ran `/fkit-design-spec`, an architect skill), its
  Process-review `@fkit-coder`.
- ⛔ Not reopened: ADR-018, ADR-033, ADR-037 — cite only.

### 4. Worklog
Append the round to the task folder's `worklog.md` with a `**Role:**` line (the attribution gap
this very thread measured). No other task-folder file changes.

### 5. Verification (the brief's seven steps, run literally)
1. New file exists at the swept number.
2. Four-way sweep evidenced (greps + classification) in ADR or hand-off.
3. `grep -n "Not decided here" .../adr-037-*.md` hit, and the ADR quotes/cites it.
4. Four labelled sections present: decision sentence; (b)'s rejection with reason;
   prose-not-prevention tradeoff; Re-raise-only-if.
5. Report cited by path; §§1–5 not reproduced.
6. `grep -rn "9 sites\|outside the denied worker's control" <ADR>` → empty.
7. `git status --porcelain` shows only the new ADR + this task's folder — nothing under `claude/`,
   `test/`, `ai-agents/tasks/done/`, or `ai-agents/wiki-vault/`.

## Out of scope (brief, by name)
No edit to `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/skills-for-role.sh`,
`claude/skill-ownership-hook.sh`, `test/`, or any `done/` task folder; no reopening
ADR-018/033/037; no `wiki-vault/` write (sweep is a read); no commit, re-rank, or task-file move;
no new task filed.

## Risks / edge cases
- **Sweep misclassification** is the realistic failure: naively treating the ~17 reference hits as
  claimants would push the number to 039 wrongly. The classification rule in step 2 prevents both
  errors (assuming 038 AND fleeing it).
- **Concurrent tree**: other workers are active; re-run the sweep immediately before writing, and
  step-5.7's git-status check catches accidental surface.
- **Brief self-contradiction** ("not yet filed") — resolved in favor of the brief's own dated
  correction; flagged in the ADR rather than silently picked.
- **Rank drift**: brief says Sprint 3 `P3`; board shows `P4` (a row landed above it today).
  Rank-only, content unaffected — noted for the driver/producer, no action in this task.

---

## Approval record (written by the driver, fkit-sprint-ship-loop)

- **Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-06** — verbatim
  answer: **"Approve (Recommended)"**.
- **Plan open question 1 ruled in the same exchange** — verbatim answer: **"Measured truth
  (Recommended)"** — the ADR's Consequences state the current fact (all six follow-ups filed, with
  task IDs, dated 2026-08-06) and note the brief bullet predates the filings.
- **Plan open question 2 ruled in the same exchange** — verbatim answer: **"Yes, fix it
  (Recommended)"** — a producer adds a dated correction to 0222's brief for the stale "Ranked P3"
  note; the driver folds this into the close-unit producer spawn. Out of the Build unit's scope.
- Plan text above is the coder worker's returned plan, copied verbatim by the driver at approval,
  before the Build spawn (per the sprint-ship-loop's durable-artifacts rule).
