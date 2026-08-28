# Note ADR-044's oracle rule onto `0224` and `0225` — read the producing skill, never grep for skill names

## ID
0347

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**Follow-on (iii) of [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)**
— §C2, *"(iii) Notes on `0224` and `0225` — see C3"*, filed on owner ruling **ND6**, verbatim *"File
all three after the ADR is accepted (Recommended)"*. ADR-044 is `Status: accepted` (2026-08-27), the
deliverable of
[`0270`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md).

**Two open backlog briefs now rest on an oracle ADR-044 changed.** ADR-044 §C3 states the effect on
each:

- **[`0224`](../0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md)**
  — *"mechanism **unchanged**; its **oracle** for the worklog `Role:` line must be **this rule**, not
  the table's literal cell — widened by reference. Without this note the detector flags every lawful
  non-coder Build as a misroute."*
- **[`0225`](../0225-add-the-loop-table-row-to-skill-ownership-test/brief.md)** — *"its parser must
  accept a **rule-cell** in Plan/Build (a skill→owner expression, not a literal) — a design-note
  widening; its assertion becomes **stronger**: every named Build skill's owner must own it in
  `skills_for_role()`."*

**⚠️ The measured warning both notes must carry — ADR-044 §C6.** A naive oracle that greps a brief for
`/fkit-*` skill names does not merely under-perform; it **reproduces the exact misroute the ADR
removes**, at scale. Measured 2026-08-28 over the **13 `## Owner: fkit-producer` rows on the Backlog
board** (every `/fkit-*` token in each brief, checked against `skills_for_role()`):

- **None of the 13 names a *producing* skill**, so ADR-044 §Decision 1 staffs all 13 with `@fkit-coder`.
- **Nine carry a real `/fkit-*` skill token** — `0184`, `0187`, `0221`, `0262`, `0318`, `0320`, `0321`,
  `0335`, `0340`. (`0013` names the **agent** `/fkit-coder`, not a skill; `0149`, `0183`, `0193` name
  none.)
- ⛔ **Eight of those nine name a producer-*exclusive* skill** — `/fkit-status`, `/fkit-task-brief`,
  `/fkit-task-done`, `/fkit-task-cancelled` or `/fkit-heal` — each owned by the producer and by no
  other role. (Only `0221` does not; it names the lead-owned `/fkit-sprint-ship-loop`.)
- **A grep-based oracle would therefore route 8 of these 13 rows back to the producer** — ADR-044:
  *"reproducing precisely the `## Owner` staffing Decision 1 replaces."*

ADR-044's own instruction to both tasks, verbatim: *"A future oracle (`0224`, `0225` — C3) **must read
the deliverable's producing skill, never grep the brief for skill names.**"*

**Neither `0224` nor `0225` has started.** Both read `## Status: 🔲 Backlog` today, which is why a
brief note is enough and no rework is implied.

## What to build

**Brief edits only — two dated notes, one per brief.** This is a producer act: no source, no tests, no
board status change.

### 1. `0224` — a note under `## Notes`

- **The mechanism is unchanged.** The pair — denial log **and** the worklog `**Role:**` line — stands
  as scoped. ⛔ Do not re-scope the task.
- **What changes is the oracle**: the `**Role:**` line is checked against **ADR-044 §Decision 1's
  rule** — the owner, in `skills_for_role()`, of the skill that produces the deliverable, with a
  no-skill deliverable falling to the coder — **not** against the loop step table's literal cell.
- **State the consequence of not doing this**, in ADR-044's own terms: *"Without this note the
  detector flags every lawful non-coder Build as a misroute."*
- ⚠️ **Carry the C6 measurement into the note**, with the numbers above: a grep-for-skill-names oracle
  misroutes **8 of the 13** producer-owned Backlog rows back to the producer. Name it as the
  **anti-pattern the detector must not implement**, and point at ADR-044 §C6 for the full measurement.
- Cite ADR-044 by heading and quoted fragment (§C3, §C6, §Decision 1), and date the note.

### 2. `0225` — a note under `## Notes`

- **The parser must accept a rule-cell** in the loop table's **Plan** and **Build** cells — a
  **skill→owner expression**, not a literal role token. A design-note widening, not a re-scope.
- **The assertion becomes stronger, not weaker:** *"every named Build skill's owner must own it in
  `skills_for_role()`."* Say this in the note — a reader who takes "accept a rule-cell" as a loosening
  has read it backwards.
- ⚠️ **Same anti-pattern warning:** the parser reads the **deliverable's producing skill**, never a
  grep of brief text for skill names — with the same 8-of-13 measurement and the same pointer to
  ADR-044 §C6.
- ⚠️ **The rule-cell does not exist in the loop skill yet** — `0345` writes it. State that dependency
  in the note so the implementer does not parse against text that is not there.
- Cite ADR-044 (§C3, §C6, §Decision 1) and date the note.

⛔ **Constraints:**

- **APPEND to `## Notes` in each brief.** Do not rewrite `## Context`, `## What to build`, or
  `## Verification steps`; do not change either brief's `## Status`, `## Sprint`, `## Priority`, `## ID`
  or `## Owner`.
- **Do not move either folder.** Both stay in `ai-agents/tasks/backlog/`.
- ⛔ Do not touch `claude/`, `test/`, any sprint or backlog board row, ADR-038, ADR-044, or
  `ai-agents/wiki-vault/` (ADR-005).
- Keep the canonical dependency form — a `## Notes` bullet opening `- **Depends on:** …` with no
  decoration between `**` and the label — if either note touches a dependency line
  (`conventions/dependency-declaration-form.md`).

## Verification steps

1. `git diff --numstat` shows changes to **exactly two** existing files —
   `ai-agents/tasks/backlog/0224-*/brief.md` and `ai-agents/tasks/backlog/0225-*/brief.md` — plus this
   task's own folder. Nothing else.
2. `git diff -U0` on both briefs shows **`−0`** outside `## Notes` — every removed line, if any, is
   inside that section. Prove it, do not eyeball it.
3. Each brief's `## Status`, `## Sprint`, `## Priority`, `## ID` and `## Owner` fields are
   **byte-identical** to HEAD.
4. `0224`'s note contains **`skills_for_role()`**, names **ADR-044**, and states the oracle is the
   deliverable's **producing skill**, not the step table's literal cell.
5. `0224`'s note contains the **8 of 13** figure and the phrase identifying a grep-for-skill-names
   oracle as the thing to avoid. Grep for it — the number must be present, not paraphrased away.
6. `0225`'s note states the parser accepts a **rule-cell** (a skill→owner expression) and that the
   assertion becomes **stronger**, naming the strengthened form: every named Build skill's owner must
   own it in `skills_for_role()`.
7. `0225`'s note names `0345` as the task that creates the rule-cell.
8. Both notes carry a **date**.
9. `grep -c "Depends on" ` on each brief shows the canonical form is intact and undecorated.
10. `npm test` green (this touches no code; run `test/task-id-uniqueness.test.js` and
    `test/dashboard-contract.test.js` and name the counts).

## Notes

- **Depends on:** `0270` (`0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row` — closed;
  ADR-044 accepted).
- **Blocks:** nothing directly — but the notes it writes are what make `0224` and `0225` correct when
  they are eventually pulled. Doing those two tasks **before** this one lands is the failure mode this
  brief exists to prevent.
- ⚠️ **Priority is `Unscheduled` — the Backlog board is unranked by design.** No merit rank is asserted.
- ⚠️ **Time-sensitivity, stated plainly.** `0224` and `0225` are both `🔲 Backlog` as of 2026-08-28. If
  either is pulled into a sprint before this note lands, it will be built against the old oracle and
  the C6 misroute ships with it. That is a sequencing risk, not a hard dependency — flagged, not solved.
- ⚠️ **Re-measure the C6 figures before writing the notes.** The 8-of-13 count is dated 2026-08-28 and
  is a measurement over a **live, changing board** — the count moves as producer-owned rows are filed
  or closed. If it has moved, write the new number and say when it was measured; do not copy this one
  forward unchecked (`conventions/evidence-before-assertion.md`).
- **Source:** ADR-044 §C2 (iii), §C3, §C6, §Decision 1; owner ruling ND6.
