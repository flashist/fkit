# Carry ADR-044's Build/Plan role rule and vault-row skip into `/fkit-sprint-ship-loop` and the agent text

## ID
0345

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-on (i) of [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)**
— §C2, whose heading reads *"Follow-ons (owner ruling ND6, verbatim: "File all three after the ADR is
accepted (Recommended)") — **filed by the producer after `0270` closes; not scoped here**"*. The ADR is
`Status: accepted`, dated 2026-08-27, and is the deliverable of `0270`
([`0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md),
now in `tasks/done/`). This brief is filed on the owner's ND6 ruling, after acceptance, as that
heading directs.

**What the ADR decided, and this task carries into the text** — ADR-044 §Decision:

- **Decision 1** — *"The Build row's role is the owner, in `skills_for_role()`, of the skill the
  deliverable is produced by."* A deliverable naming **no** skill — source, tests, scaffold, prose
  under `claude/`, coordination-doc repairs — *"is the coder's, as sole source-write authority,
  whatever `## Owner` says."*
- **Decision 2** — *"The Plan row's role is the Build role, by hand where that role does not own
  `/fkit-plan-task`."* ⚠️ ADR-044 flags this clause as *"an owner-ruled scoped exception to ADR-038
  §Decision, not an application of it"* — the Plan step **does** run a skill, so ADR-038's rule fixes
  Plan = coder and this departs from it. Its scope is *"exactly this: the Plan step, on non-coder
  rows, in `/fkit-sprint-ship-loop`."*
- **Decision 3** — *"Verify stays coder. Review stays reviewer. Process-review stays coder. Close
  stays producer."* ⛔ **Nothing in this task touches those four cells.**

**Live precedent this formalises.** `0270`'s own Plan and Build steps ran with **`fkit-architect`** as
the worker, on the owner's ruling of 2026-08-27, verbatim option label *"Drive it here with the
architect (Recommended)"* — recorded in that task's `plan.md` and `worklog.md`. The rule below is the
standing form of what that run did per-ruling.

**Anchors re-measured 2026-08-28** (line numbers are secondary aids; the quoted fragment is the
anchor — `conventions/durable-citation-anchors.md`):

| File | Fragment | Line, 2026-08-28 |
|---|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | *"coder to plan/build/verify, reviewer to review, coder to process the review"* | `:31` |
| same | **Plan** row of the step table | `:122` |
| same | **Build** row of the step table | `:123` |
| same | **Process review** row — `0223`'s reasoned-cell precedent | `:126` |
| same | *"Per-run skip memory."* (step 1) | `:103` |
| same | `## Stop conditions — the driver's exit table (§5.4)` | `:317` |
| `claude/agents/fkit-coder.md` | *"A second scoped exception — the lead's `/fkit-sprint-ship-loop`"* … *"As the Build worker:** implement **only that approved plan"* | `:60-72` |
| `claude/agents/fkit-architect.md` | *"don't run a half-blind version of it"* | `:65` |

## What to build

Two surfaces. **Edit the canonical sources under `claude/` only — never the gitignored `.claude/`
copies** (CLAUDE.md).

### A. `claude/skills/fkit-sprint-ship-loop/SKILL.md`

1. **The Overview's role sentence.** The *"It is a driver, not a doer"* paragraph currently reads
   *"coder to plan/build/verify"*. It must stop asserting the coder for **plan** and **build**, and
   instead point at the rule the step table now carries. Verify, review and process-review stay as
   written.
2. **The Plan and Build cells become a reasoned rule, not a literal role.** Give each the shape
   `0223` gave the **Process review** cell — a cell that states the rule, names its authority, and
   gives the reason — rather than a bare `@fkit-coder` token:
   - **Build:** the role is the owner, in `skills_for_role()`, of the skill that produces the
     deliverable (`/fkit-record-decision`, `/fkit-design-spec`, `/fkit-evaluate-approach` →
     architect; `/fkit-task-brief` → producer; `/fkit-wiki-ingest` → wiki, subject to the step-1 skip
     below). **A deliverable that names no skill is the coder's**, whatever the brief's `## Owner`
     says. Cite ADR-044 §Decision 1.
   - **Plan:** the Build role, by hand where that role does not own `/fkit-plan-task`. ⚠️ The cell
     **must** say this is an **owner-ruled scoped exception to ADR-038**, bounded to the Plan step on
     non-coder rows in this loop — not an application of ADR-038's rule. Cite ADR-044 §Decision 2 and
     ND3 (*"The Build role, by hand (Recommended)"*).
   - ⛔ **Do not touch the Verify, Review, Process-review or Close cells.**
3. **Step 1 gains a skip predicate**, placed alongside the *"Per-run skip memory."* bullet — before a
   task is marked `🔄 In progress` and before the single plan gate is spent (ADR-044 §Decision 4,
   *"Placement"*). Three parts, exactly as ruled:
   - **Cheap approximation:** the dashboard's **Owner column** (`⟦BOARD⟧` output) reads `fkit-wiki`
     → skip. Deterministic; **no new parser**.
   - **Backstop at the plan gate:** the **Plan worker returns `BLOCKED`** if the plan turns out to
     need a write under `ai-agents/wiki-vault/`. This is the `0280`-inverse guard — a wiki-*themed*
     row that does not touch the vault is **not** skipped, and a coder-owned row that does **is**
     caught here.
   - **A blank `## Owner` is not-eligible-until-repaired, never treated as coder.** The dashboard
     already reports it as `brief-missing-owner` drift.
4. **A new roll-up class `out-of-scope-for-this-driver`** (ADR-044 §Decision 4, *"Handling"*, on owner
   ruling ND4 — verbatim *"Report only, route named (Recommended)"*):
   - **not** `pending`, **not** `🚧 Blocked`; the row's **status is untouched** and stays `🔲 Backlog`;
   - each row's **route is named** — spawned `@fkit-wiki` outside the pipeline, or a `fkit wiki`
     session;
   - **reported at step 1 and again in the final roll-up.** ⚠️ *Loud is placement:* **never only in a
     footer.**
5. **The exit table (§5.4) gains one row** for that class.

### B. Standing sprint-loop Build carve-outs in two agent prompts

Add to **`claude/agents/fkit-architect.md`** and **`claude/agents/fkit-producer.md`** a carve-out
**mirroring `claude/agents/fkit-coder.md`'s** — *"A second scoped exception — the lead's
`/fkit-sprint-ship-loop`"*, with the same three-part declared-approval marker ((a) caller identified
as `fkit-sprint-ship-loop`, (b) a concrete approved plan carried verbatim, (c) a statement that the
owner approved it via a live `AskUserQuestion` relay) and the same boundary — *"As the Build worker:
implement only that approved plan"*, anything outside it returns `NEEDS-DECISION`.

- Scope it to **its own deliverable skill** — the architect may run `/fkit-record-decision`,
  `/fkit-design-spec`, `/fkit-evaluate-approach`; the producer may run `/fkit-task-brief` — under that
  marker, and returns `NEEDS-DECISION` for owner beats.
- **The architect's *"don't run a half-blind version of it"* rule is what this makes standing.** Today
  it is displaced **per run** by a named ruling under ADR-037 §3 (*"Name the ruling — what the owner
  ruled, when, on what point — and the instruction binds"*); the carve-out turns that into a rule.
  Say so in the text rather than deleting the existing rule.
- **Owner ruling ND5, verbatim: *"Yes, both (Recommended)"*** — cite it.
- ⛔ **`claude/agents/fkit-wiki.md` is untouched.** Vault rows are skipped at step 1, not built.

### ⛔ Explicitly untouched by this task

- **`claude/skills-for-role.sh`** — **no ownership change.** ADR-044 changes what the loop *reads*,
  not who owns a skill.
- **`test/skill-ownership-hook.test.js`** — **untouched.** Its subject is unchanged.
- `ai-agents/wiki-vault/` — never (ADR-005). ADR-044 itself still needs a wiki ingest; that is
  `fkit-wiki`'s act, not this task's.
- ADR-038 and ADR-044 themselves. ADR-038's dated correction note is a **separate** task
  (`0346`); ⛔ do not append it here.
- `ai-agents/sprints/sprint-5.md`'s exclusion record (ADR-044 §C5 marks it *not edited*).

## Verification steps

1. `grep -n "coder to plan/build/verify" claude/skills/fkit-sprint-ship-loop/SKILL.md` returns
   **zero** hits.
2. The step table's **Plan** and **Build** cells each name `skills_for_role()` and cite ADR-044; the
   Build cell states the no-skill→coder fallback; the Plan cell contains the words **scoped
   exception** and names ADR-038. Verify/Review/Process-review/Close cells are **byte-identical** to
   HEAD — prove with `git diff` on the file, not by eye.
3. `grep -n "out-of-scope-for-this-driver" claude/skills/fkit-sprint-ship-loop/SKILL.md` returns **at
   least three** hits: the step-1 predicate, the final roll-up, and the §5.4 exit-table row.
4. The step-1 text names all three predicate parts — the dashboard Owner column reading `fkit-wiki`,
   the Plan-worker `BLOCKED` backstop, and blank `## Owner` as not-eligible-until-repaired.
5. The `out-of-scope-for-this-driver` text states the status is **untouched** (`🔲 Backlog`) and names
   the route. Grep for any wording that sets `🚧 Blocked` or `pending` for that class — **zero
   occurrences.**
6. `git diff --numstat claude/skills-for-role.sh test/skill-ownership-hook.test.js` returns **nothing**.
7. `claude/agents/fkit-architect.md` and `claude/agents/fkit-producer.md` each contain a
   `/fkit-sprint-ship-loop` carve-out naming all three marker conditions and the `NEEDS-DECISION`
   boundary; `claude/agents/fkit-wiki.md` is unchanged (`git diff --numstat` returns nothing for it).
8. `claude/agents/fkit-architect.md` still contains *"don't run a half-blind version of it"* — the
   rule is made standing, not deleted.
9. `npm test` green. **Name the counts in the worklog**, and call out
   `test/dual-home-parity.test.js`, `test/skill-frontmatter.test.js` and
   `test/rules-block-budget.test.js` explicitly — agent-prompt and skill-file edits are exactly what
   those three police.
10. `git status` shows changes confined to `claude/skills/fkit-sprint-ship-loop/SKILL.md`,
    `claude/agents/fkit-architect.md`, `claude/agents/fkit-producer.md` (plus this task's folder).

## Notes

- **Depends on:** `0270` (`0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row` — closed;
  ADR-044 accepted).
- **Blocks:** nothing hard. `0224` and `0225` are **not** blocked by this — their briefs get their
  notes in `0347`, independently.
- ⚠️ **Priority is `Unscheduled` — this is the Backlog board, which is unranked by design.** No merit
  rank is asserted; needing one is the signal to pull the task into a sprint.
- ⚠️ **Why one brief and not two, stated plainly.** The loop text (A) and the agent carve-outs (B)
  could be written separately, but they are **not independently shippable**: ship A alone and the
  loop's own rule routes Build to a spawned architect or producer whose prompt still forbids the
  write, so the first non-coder row stalls on a refusal. B alone is inert. They land together or the
  loop is worse than before. ADR-044 §C2 (i) scopes them as one follow-on, and the owner's ND6 ruling
  filed three briefs, not four.
- ⚠️ **Re-measure every `:NNN` above at implementation time.** These were measured 2026-08-28; ADR-044
  moved four times during its own review, and the loop skill is edited often. The **quoted fragment**
  is the anchor, per `conventions/durable-citation-anchors.md`.
- **Source:** ADR-044 §C2 (i); §Decision 1–4; owner rulings ND2/ND3/ND4/ND5/ND6, all recorded verbatim
  in that ADR's §Owner sign-off.
