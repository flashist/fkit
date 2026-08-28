# ADR-044: The ship-loop's Build role follows the deliverable's skill; vault-deliverable rows are skipped at step 1 and reported

- **Status:** accepted
- **Date:** 2026-08-27
- **Deciders:** fkit-architect (analysis and recommendation, as `0270`'s Plan-step worker); **owner
  (Mark Dolbyrev) — signed off 2026-08-27 via `AskUserQuestion` in the live `fkit lead` session
  driving `/fkit-sprint-ship-loop` (see §Owner sign-off)**
- **Task:** `0270` (`0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row`) — *Decide
  how `/fkit-sprint-ship-loop` handles a non-coder-owned task row — ADR-038 re-raise, or a defensive
  skip*
- **Companion to:** [ADR-038](adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md) —
  **not amended, not superseded** (§Consequences C4).

> **Citation form.** Skill and agent files are cited `path:NNN` **paired with a quoted fragment**
> (row 1 of `conventions/durable-citation-anchors.md`). ADR-038, sprint boards and briefs are
> append-corrected or third-party-edited documents, so they are cited by **heading plus quoted
> fragment**; where a line number appears for one of those it is a secondary aid measured
> 2026-08-27 — except the `ai-agents/sprints/backlog.md:121` coordinate in §Why this and not the
> others, measured **2026-08-28** — never the anchor. Tasks are cited by folder `NNNN` prefix.

## Context

### The question, stated precisely

The loop's per-step roles are fixed by design. For the steps that run a skill, the role is the skill's
owner in `skills_for_role()` — ADR-038 §Decision, verbatim:

> **A loop step's role is fixed by the skill the step runs, not by the deliverable's author.**

(ADR-038 §Decision, first line — `:39` on 2026-08-27.) For Build and Verify, which ADR-038 says run
no skill, the role is the literal cell in the loop's step table — ADR-038 §Consequences, first
bullet: *"Two current sprint-loop steps (Build and Verify) run no skill; their roles come from the
loop's enumerated step table, not from this lookup"* (`:88-91` on 2026-08-27); the cells are
`claude/skills/fkit-sprint-ship-loop/SKILL.md:122-124` (`| **Plan** | `@fkit-coder` |`,
`| **Build** | `@fkit-coder` |`, `| **Verify** | `@fkit-coder` |`).

**So the question is not "should the loop read `## Owner`". It is: given the roles are fixed, what
must the driver do when the fixed role cannot lawfully produce, or cannot lawfully fix, a row's
deliverable — and at which point in the run must that be discovered: at step 1 (before
`🔄 In progress` and before the single plan gate is spent), at the plan gate, or at Build?**

Two sub-questions come apart on the evidence:

- **Is the mismatch a property of the brief's `## Owner` field, or of the deliverable?** `0171` is
  `## Owner: fkit-architect` and was built by a spawned **coder** on 2026-08-15 without incident
  (`0171` `worklog.md`: *"Built 2026-08-15 by the `fkit-coder` Build worker of
  `/fkit-sprint-ship-loop`"*). `0280` carries the wiki theme but edits a skill file, not the vault
  (`ai-agents/sprints/sprint-6.md` §Notes: *"`0280` carries the `wiki` theme but edits
  `claude/skills/fkit-wiki-lint/SKILL.md`, not the vault"*). So `Owner != fkit-coder` is a proxy, not
  the thing itself. The thing itself is: *which role may write the deliverable's target, and which
  skill produces it.*
- **Which steps are actually walled?** Two different walls, not one:
  - **A hard wall — vault writes.** `ai-agents/wiki-vault/` is `fkit-wiki`-only: ADR-005 (*"writes
    stay fkit-wiki-exclusive"* — its rule is in force, its mechanism superseded), the universal hard
    rule, `claude/agents/fkit-coder.md:211` (*"Write to `ai-agents/wiki-vault/` — ever. Wiki writes
    are the wiki role's exclusively."*), and ADR-033 §Decision 2 (*"The wiki stays wiki-only"*). A
    wiki-deliverable row needs a vault write at **Build** *and* at Process-review's fix step
    (`claude/skills/fkit-process-stateful-review/SKILL.md:195`, *"Step 6 — Apply approved fixes +
    update the shared file"*) — and ADR-038 fixes Process-review to the coder.
  - **A soft wall — design deliverables.** An ADR or design spec is produced by an architect skill —
    `claude/skills-for-role.sh:56` (`architect) echo "... fkit-design-spec fkit-evaluate-approach
    fkit-record-decision"`). A coder "building" one writes it by hand — the by-hand route ADR-038
    §Context names as the misroute, in reverse. Nothing hook-denies it; it is a quality and ownership
    defect, not an ADR-005 breach.

**The brief's *"no beat left to stop at"* claim is corrected here — not its *"no third outcome"*
sentence.** The two are about different rows and only the first is wrong. The brief's *"There is no
third outcome"* is about the **wiki** row (the coder must refuse and stall, or comply and breach
ADR-005); that stands, and Decision 4 is the answer to it. The claim corrected here is the brief's
**architect** paragraph: *"A task whose acceptance criteria require the owner's sign-off during the
work has no beat left to stop at."* There is a beat. The loop's own `NEEDS-DECISION` relay
(`claude/skills/fkit-sprint-ship-loop/SKILL.md:249`, *"NEEDS-DECISION { question, options[],
recommendation, context } → driver relays via AskUserQuestion"*) is a mid-run owner beat: a worker
returns the decision, the driver relays it, and spawns the next worker with the ruling folded in.
This ADR's own run is the proof — `0270`'s Plan step carried the analysis, the plan gate carried the
sign-off, Build wrote this ADR. So the *"architect row needs a second owner beat"* reason for
excluding `0255` on Sprint 5 was over-stated; the pipeline already had the beat.

**The wiki wall is real. The architect wall is not a wall — but only once C2 (i) ships.** Today
`claude/agents/fkit-architect.md:65` still tells a spawned architect *"don't run a half-blind version
of it"* about its own four interactive skills, `/fkit-record-decision` among them. `0270` cleared
that bar not because the rule does not apply but because a **named owner ruling displaced it for this
run** (ADR-037 §3 — the Route ruling of 2026-08-27). ND5's standing carve-outs are what turn a
per-run displacement into a rule; until they land, an architect Build row still needs a named ruling.

### Does ADR-038's closeout clause bar candidate 1? — answered before the options are weighed

ADR-038 §Re-raise only if, closing line: *"Anything else that re-argues (b) from deliverable
authorship is closeout, not a new finding."* (`:116` on 2026-08-27.) Option (b) was *grant
`fkit-process-stateful-review` to the architect* (ADR-038 §Options considered, *"(b) Grant
`fkit-process-stateful-review` to the architect in `skills_for_role()` — rejected"*).

**Answer: it bars candidate 1 for the Process-review step, and it does not reach Build or Plan — but
for a reason that also makes candidate 1 pointless there.**

- **Process-review.** Deriving the Process-review role from `## Owner` hands the step to a role that
  does not own `fkit-process-stateful-review`: the ADR-018 hook denies the skill and the worker
  applies the method **by hand** — the `0158`/`0143` route, and the exact author-runs-its-own-
  process-review outcome (b) was rejected for, under a new label. The axis is nominally different (a
  declared field vs. observed authorship); its effect is the same. The closeout clause applies.
  *(This discharge rests on that mechanism alone. It does **not** rest on `## Owner` and the
  deliverable's author always coinciding — they do not: `0171` is `## Owner: fkit-architect` and was
  built by the coder, as §Context and the corroboration table both record.)* None of ADR-038's three
  `Re-raise only if` triggers fires:
  `skills_for_role()` still has no per-artifact scoping (`claude/skills-for-role.sh:51-59` is a flat
  `case` on role name); the owner has not re-ruled `0200`; and the Build row names its role
  (`SKILL.md:123`).
- **Build.** ADR-038 explicitly does **not** fix this role (the `:88-91` fragment above). There is no
  (b) to re-argue, so the closeout clause cannot bar anything here — and equally, changing how the
  *table* names Build's role is **not a re-raise of ADR-038**; it is a table decision ADR-038 left
  open. Candidate 1's "re-raise" framing is therefore either barred (Process-review) or a misnomer
  (Build).
- **Plan — and this is a departure, named as one.** ADR-038's `:88-91` fragment leaves only **Build
  and Verify** to the table. The Plan step **does** run a skill: `SKILL.md:122` says *"run
  `/fkit-plan-task`"*, and `/fkit-plan-task` is coder-owned (`claude/skills-for-role.sh:55`). So
  ADR-038 §Decision **fixes Plan = coder**, and Decision 2 below departs from that rule for
  non-coder rows. It is **not** presented here as ground ADR-038 left open: it is an **owner-ruled
  scoped exception** to ADR-038 §Decision, ruled 2026-08-27 (ND3), scoped to the Plan step on
  non-coder rows and to nothing else. ADR-038 is **not amended** (C4).
- **ADR-038 records Build workers running skills, without reconciling that with the table.** Its
  §Consequences *"Corroborating practice"* bullet (`:101-103`) cites `0241`'s Build being a spawned
  **architect** via `/fkit-design-spec`. The same on `0222` (`worklog.md`: *"skill run:
  `/fkit-record-decision` — step-role-follows-skill"*), `0242` (*"by a spawned `fkit-architect` (via
  `/fkit-record-decision`)"*), `0178` (*"fkit-architect, spawned as the BUILD step of
  `/fkit-sprint-ship-loop`"*), `0249` (spawned **wiki**, *"executing `/fkit-wiki-ingest`"*), `0218`
  (*"a spawned `fkit-producer` build worker"*), and `0270` today. **This is not ADR-038 contradicting
  itself.** *"Build … run[s] no skill"* is a statement about the **step**, which prescribes none
  (`SKILL.md:123`: *"implement the approved plan"*, no skill named) — not a claim that Build workers
  never invoke one; ADR-038 records both facts knowingly, in one document. What has actually changed
  is downstream of **this** ADR: once Decision 1 stands, Build's role no longer *"come[s] from the
  loop's enumerated step table"* — it comes from the deliverable's skill. That is the ground for the
  dated correction note on ADR-038, filed as a follow-on in `0205`'s shape (C2 ii), **not** an
  amendment of its decision, and not done here.

### The live evidence every candidate is measured against

| Board | Rows | Non-coder | How they actually ran |
|---|---|---|---|
| Sprint 3 | 4 | 2 (`0222`, `0241`, architect) | through the loop, Build = spawned architect |
| Sprint 4 | 8 | 2 (`0242` architect; `0249` wiki) | through the loop; `0249`: Build = spawned wiki, and its *Coder response* rows were **written by the spawned wiki** (`0249` `review.md` §Coder response: *"Round 1 responses recorded by the spawned fkit-wiki"*) — the shape ADR-038 now forbids |
| Sprint 5 | 17 | 5 (3 architect, 2 wiki) | `0255`/`0258`/`0269` owner-excluded **2026-08-10** — two `AskUserQuestion` rulings, verbatim labels **"0258 and 0269 — the wiki rows (Rec)"** and **"0255 — the .claude/ conformance ADR (Rec)"** (`ai-agents/sprints/done/sprint-5.md` §Notes, first bullet); they ran via an owner-present session / a spawned `@fkit-wiki`. The other two architect rows: not checked this pass |
| Sprint 6 | 21 | 4 (`0171`, `0178`, `0270` architect; `0218` producer) | `0171` Build = **coder**; `0178` Build = architect; `0218` Build = producer; `0270` Plan+Build = architect on today's ruling. The producer had to hand-write a board warning (`sprint-6.md` §Notes: *"FOUR of the 19 rows are NOT `## Owner: fkit-coder`"*) |
| Backlog board | 123 | **51 (41%)**: 30 architect, 13 producer, 6 wiki, 2 reviewer | — |

**Backlog split, re-measured 2026-08-28** (`0270` review round 1): `bash claude/skills/fkit-status/dashboard.sh
ai-agents/sprints/backlog.md` → 123 `🔲 Backlog` rows; reading each row's own brief `## Owner` →
**72 coder / 30 architect / 13 producer / 6 wiki / 2 reviewer**, i.e. 51 non-coder holds. **No brief on
the board is missing its `## Owner`, and the dashboard emits no `brief-missing-owner` drift fact for
this board today.** (An earlier draft of this row read *"12 producer, 1 blank `## Owner`"*; that was
wrong on both counts and is corrected here — the 51 total was unaffected.)

The gap bites on **every sprint in the table above**, roughly one row in four, and the driver has
improvised four different staffings for it. **One Backlog brief does read blank to a naive grep, and it is a formatting quirk,
not a missing field:** `0184` carries a second heading beginning `## Owner` — *"## Owner rulings on
record"* — followed by a blank line, so an unanchored `grep -A1 '^## Owner'` returns an empty value
for it; its real `## Owner` is `fkit-producer`. A predicate must anchor the heading (`^## Owner$`) or
read the field, not the grep. Genuinely missing fields are a separate case the dashboard already
handles (`claude/skills/fkit-status/dashboard.sh:983` emits
`drift nonconformance … kind="brief-missing-owner"`) — it simply does not fire on this board today.

Related and deliberately not conflated: `0224` builds a misroute detector for a **driver deviating
from the loop's step table**. Here the driver follows the table exactly and the table's role is still
wrong for the row — so `0224` does not cover this case as filed. What this ADR changes for `0224` is
its **oracle**, not its mechanism (C3).

---

## Decision

**Ruled by the owner 2026-08-27, verbatim option label: "A: Build role follows the deliverable's
skill + vault rows skipped (Recommended)".** Candidate 4 plus narrowed candidate 2, as one decision:

1. **The Build row's role is the owner, in `skills_for_role()`, of the skill the deliverable is
   produced by.** `/fkit-record-decision`, `/fkit-design-spec`, `/fkit-evaluate-approach` → architect;
   `/fkit-task-brief` → producer; `/fkit-wiki-ingest` → wiki (subject to clause 4). **A deliverable
   that names no skill — source, tests, scaffold, prose under `claude/`, coordination-doc repairs —
   is the coder's, as sole source-write authority, whatever `## Owner` says.** This is ADR-038's own
   principle applied to the one step ADR-038 left to the table; it is not a re-raise.

2. **The Plan row's role is the Build role, by hand where that role does not own `/fkit-plan-task`.**
   (Owner ruling ND3, verbatim: **"The Build role, by hand (Recommended)"**.) For a decision task the
   plan *is* the analysis, which is design judgment the coder should not author. The other reading —
   Plan is always the coder via `/fkit-plan-task`, as the owner ruled per-run on `0167` (*"the coder
   plans and the architect builds"*) — was offered and not chosen as the standing rule.

   > ⚠️ **This clause is an owner-ruled scoped exception to ADR-038 §Decision, not an application of
   > it.** Unlike Build, the Plan step **runs a skill** — `/fkit-plan-task` (`SKILL.md:122`),
   > coder-owned (`claude/skills-for-role.sh:55`) — so ADR-038's rule (*"A loop step's role is fixed
   > by the skill the step runs"*) fixes Plan = coder, and this clause departs from it. The owner
   > ruled the departure knowingly on 2026-08-27 (ND3). **Its scope is exactly this: the Plan step,
   > on non-coder rows, in `/fkit-sprint-ship-loop`.** It reaches no other step and no other loop.
   > ADR-038 is **not amended** and its rule is otherwise untouched (C4); the C2 (ii) correction note
   > is **not** widened to cover Plan.

3. **Verify stays coder. Review stays reviewer. Process-review stays coder. Close stays producer.**
   Exactly as ADR-038 §Decision, `0223`'s enumerated row (`SKILL.md:126`), and ADR-033 §Decision 4
   have them. Nothing here touches them.

4. **Rows whose deliverable is a vault write are skipped at step 1 and reported.** The skip predicate
   (owner ruling ND2, verbatim: **"Owner column = fkit-wiki + Plan-worker BLOCKED backstop
   (Recommended)"**):
   - **Cheap approximation at step 1:** the dashboard's Owner column (`⟦BOARD⟧` output,
     `dashboard.sh:1196`, `| Status | # | Task | Filename | Owner | Next step |`) reads `fkit-wiki`.
     Deterministic; no new parser.
   - **Backstop at the plan gate:** the Plan worker returns `BLOCKED` if any plan turns out to need a
     write under `ai-agents/wiki-vault/` (the `0280`-inverse guard — a wiki-themed row that does not
     touch the vault is *not* skipped; a coder-owned row that does is caught here).
   - **A blank `## Owner` is not-eligible-until-repaired, never treated as coder.** The dashboard
     already flags it as `brief-missing-owner` drift.
   - **Handling (owner ruling ND4, verbatim: "Report only, route named (Recommended)"):** a new
     roll-up class **`out-of-scope-for-this-driver`** — not `pending`, not `🚧 Blocked`; status
     untouched, stays `🔲 Backlog`; each row's route named (*spawned `@fkit-wiki` outside the pipeline,
     or a `fkit wiki` session*). Loud is placement: listed in the step-1 report and again in the final
     roll-up, never only in a footer.
   - **Placement:** step 1, alongside the per-run skip memory (`SKILL.md:103`, *"Per-run skip
     memory"*) — before `🔄 In progress`, before the single plan gate is spent. There is no earlier
     beat in the loop.

5. **Owner beats mid-work are satisfied by the existing `NEEDS-DECISION` relay.** No new gate.

6. **Nothing in this ADR removes the owner's power to exclude any row by ruling** — the Sprint 5
   mechanism stays available; it simply stops being the *only* answer.

### Why this and not the others, in one paragraph

It is the only candidate that accounts for **all eight non-coder rows the loop drove in the
population this ADR counted** — the Sprints 3–6 status tables and the 123 `🔲 Backlog` rows —
namely `0171`, `0178`, `0218`, `0222`, `0241`, `0242`, `0249`, plus `0270`, which is
`🔄 In progress`, not shipped — while leaving ADR-005 intact and ADR-038 amended in nothing
(Decision 2's scoped exception named as one). **"Accounts for" is not "reproduces":** on `0178` and
`0218` the rule would have staffed Build differently from how it actually ran (C6). It costs no
ownership change and no test rewrite; it gives `0224` a correct oracle before `0224` ships; and it
turns four improvised staffings into one rule.

> ⚠️ **Read that "all eight" as bounded by the measurement, not as all loop history.** The evidence
> base for this ADR is **Sprints 3–6 and the Backlog board** (§Context's table) — the eight rows sit
> on Sprints 3, 4 and 6. **Three things it does not cover, named so nobody reads the count as a
> census.**
>
> 1. **Sprint 5's five non-coder rows are not among the eight**: `0255`/`0258`/`0269` were
>    owner-excluded on 2026-08-10 and so were never driven, and the other two were not checked (still
>    flagged under §Unverified this pass).
> 2. **The Backlog board was measured as its 123 `🔲 Backlog` rows — its *closed* rows were not.**
>    `0211` is the worked case: it sits on **this** board (`ai-agents/sprints/backlog.md:121`,
>    `## Sprint: Backlog`), so it is on a measured board, but it reads `✅ Done (agent-closed — not
>    owner-verified)` and so fell outside the 123 open rows counted. The loop drove it with a
>    **`fkit-wiki` Build worker** on a vault deliverable (candidate 4). **By candidate 4's own
>    predicate it is therefore a ninth measured instance of the practice**, not a row from an
>    unmeasured board.
> 3. **The loop ran before Sprint 3, and those boards were not measured here** — earlier sprints
>    carry further non-coder rows the loop drove with a loop-spawned non-coder Build worker.
>    Re-measuring them was deliberately out of scope (owner ruling 2026-08-28, verbatim label
>    **"Qualify the quantifier (Recommended)"**), so none is named or counted here.
>
> **All three cut in the decision's favour, not against it** — a wider population of the same
> practice is more corroboration of Decision 1, not a counter-example; nothing in the wider set has
> been shown to contradict the rule. The count is qualified here only because *"every row the loop
> has driven"* claimed more than was measured. ⛔ **The eight are not re-opened** — they are correct
> for Sprints 3, 4 and 6.

**Main tradeoff:** prose-enforced, like ADR-038 — and it asks the owner to accept standing Build
carve-outs for the architect and producer agent prompts, a widening of what a spawned non-coder may
write (design docs, briefs) under the declared-approval marker. The owner accepted that widening
(ND5, §Owner sign-off).

---

## Options considered

### Candidate 1 — re-raise ADR-038: a step's role derived from `## Owner` — **REJECTED**

- **What it must answer:** (b)'s rejection and the total-or-absent premise — untouched by it, since
  deriving a role does not grant a skill. But a derived Process-review role hands the step to a role
  that does not own `fkit-process-stateful-review`; the ADR-018 hook denies the skill and the worker
  applies the method by hand — the exact `0158`/`0143` route. **On Process-review it reintroduces the
  misroute ADR-038 exists to prevent.**
- **Cost:** `skills_for_role()` untouched or (if the grant is added) widened four ways; `0223`
  reversed; `0224`'s oracle flips; `0225` loses its subject.
- **ADR-038:** would supersede it. **Barred by the closeout clause for Process-review; a misnomer for
  Build** (§Context). Rejected.

### Candidate 2 — defensive skip at step 1 — **ACCEPTED, NARROWED**

- **Predicate as the brief states it (`Owner != fkit-coder`) — rejected:** it would have skipped
  `0171`, `0178`, `0218`, `0222`, `0241`, `0242`, `0270` — seven rows the loop shipped or is shipping.
  Too wide by roughly 7:1 against the rows that actually cannot run (the `0249`-class wiki rows).
- **Narrowed predicate — accepted:** skip a row whose deliverable's write target is
  `ai-agents/wiki-vault/`, approximated at step 1 by the Owner column reading `fkit-wiki`, with the
  Plan worker's `BLOCKED` as backstop (Decision 4).
- **ADR or skill text:** on its own, skill text would do. Combined with Decision 1 it is one decision
  and belongs in one ADR — this one.
- **Cost:** `SKILL.md` step 1 (predicate + report line) and the exit table (one new row); no
  `skills_for_role()` change; `test/skill-ownership-hook.test.js` untouched.

### Candidate 3 — status quo: the owner excludes by hand each sprint — **REJECTED as the standing answer**

- It worked on Sprint 5 (the `⛔` block above `## Status` and the first `## Notes` bullet on
  `sprint-5.md`). On Sprint 6 it degraded into a hand-written board warning plus four improvised
  staffings — and the improvisation is **invisible to `0224`'s detector design**: a worklog `Role:`
  line that disagrees with the table's literal `@fkit-coder` reads as a misroute, so `0178`, `0218`,
  `0222`, `0241`, `0242` and `0270` would all be flagged once `0224` ships. The record dies with each
  board — the brief's founding point.
- **Cost:** zero files now; a re-derivation every sprint; `0224` misfires on the majority of non-coder
  rows.
- **ADR-038:** untouched. Rejected as the standing answer; retained as the owner's power to exclude
  (Decision 6).

### Candidate 4 — Build (and Plan) role follows the skill the deliverable runs; Review / Process-review / Close stay fixed — **ACCEPTED**

- **The rule:** Decision 1–3. It is what ADR-038's *"Corroborating practice"* already records, and
  what `0222`'s worklog called *"step-role-follows-skill"* the day ADR-038 was written.
- **Wiki rows are the one class this rule does not rescue.** Build = spawned wiki is lawful, and the
  loop has done it **more than once**: `0249` (Sprint 4, `/fkit-wiki-ingest`) and **`0211`** (a
  Backlog-board row driven by the loop — `## Sprint: Backlog`, `## Owner: fkit-wiki`, worklog
  *"`fkit-wiki` (build worker, spawned by `/fkit-sprint-ship-loop`)"*, deliverable a write to the
  vault's `log.md`). ⚠️ **`0211` is a second instance of the lawful Build, not a counter-example to
  Decision 4** — this ADR cites `0249` as the worked specimen because its ledger shows the *unlawful*
  half too, not because it is the only one. What neither rescues is the step after: Process-review's
  Step 6 has no lawful fix-applier — the coder may not write the vault, and routing fixes to the wiki
  is the `0249` shape ADR-038 forbids. Hence the narrowed skip (candidate 2) for exactly that class.
  *(`0211` sits on a measured board but outside the **123 `🔲 Backlog` rows** counted in §Context —
  it reads `✅ Done`, and the count is of open rows. It is not evidence from an unmeasured sprint.)*
- **Cost:** see §Consequences C2. `skills_for_role()` and `test/skill-ownership-hook.test.js`
  untouched; no four-mirror ripple.

### Candidate 5 — keep coder Process-review for wiki rows; mark every vault fix `blocked — ADR-005`; add a conditional "Apply (wiki)" sub-step — **REJECTED for now, named as the re-raise trigger**

Viable, but it adds a pipeline step for roughly 5% of rows whose natural QA is the wiki's own lint
(`/fkit-wiki-lint`). If the skipped class grows or the out-of-pipeline route proves unworkable, this
is the option to reopen with (§Re-raise only if).

---

## Consequences

### C1 — Positive

- One rule replaces four improvised staffings; the next driver acts on it without re-deriving it.
- `0224` gets a correct oracle **before** it ships, instead of misfiring on most non-coder rows.
- Vault rows are refused at step 1 with their route named — never handed to a coder that must refuse
  mid-run, never `🔄 In progress` with the plan gate spent.
- No ownership change, no hook change, no test rewrite. ADR-005 and ADR-038 stand as written.

### C2 — Follow-ons (owner ruling ND6, verbatim: "File all three after the ADR is accepted (Recommended)") — **filed by the producer after `0270` closes; not scoped here**

- **(i) Implementation brief — loop and agent text (coder).** `claude/skills/fkit-sprint-ship-loop/SKILL.md`:
  the *"It is a driver, not a doer"* paragraph (`:31`, *"coder to plan/build/verify"*), the Plan and
  Build cells (`:122-123`) become a reasoned rule as `0223` made the Process-review cell (`:126`),
  step 1 gains the predicate and report line, the exit table gains one row. `claude/agents/fkit-architect.md`
  and `claude/agents/fkit-producer.md` gain a sprint-loop Build carve-out mirroring
  `claude/agents/fkit-coder.md:60-72` (*"A second scoped exception — the lead's
  `/fkit-sprint-ship-loop`"* … *"As the Build worker: implement only that approved plan"*): a spawned
  role may run its own deliverable skill under the declared-approval marker and returns
  `NEEDS-DECISION` for owner beats. Today the architect's *"don't run a half-blind version of it"*
  rule (`claude/agents/fkit-architect.md:65`) is displaced per run by a named ruling under ADR-037 §3
  (*"Name the ruling — what the owner ruled, when, on what point — and the instruction binds"*); a
  standing carve-out makes it a rule. **Owner ruling ND5, verbatim: "Yes, both (Recommended)".**
  `claude/agents/fkit-wiki.md` untouched. `claude/skills-for-role.sh` **untouched**;
  `test/skill-ownership-hook.test.js` **untouched**.
- **(ii) Dated correction note on ADR-038 (architect)** — on the §Consequences fragment *"their roles
  come from the loop's enumerated step table, not from this lookup"*, in `0205`'s shape and per
  `/fkit-record-decision` §"Correcting an accepted ADR". **The ground is what changed, not what was
  wrong:** *"Build and Verify run no skill"* was and remains true of the **steps** (`SKILL.md:123`
  names none), so it is not the fragment to annotate; what this ADR changes is where **Build's role**
  comes from — Decision 1, not the table. Verify is untouched and stays table-fixed. A drift note
  (⚠️), not a reversal: ADR-038's decision stands. ⛔ **Scope it to Build.** Decision 2's Plan
  exception is recorded in *this* ADR (C4) and the note must **not** be widened to cover it.
- **(iii) Notes on `0224` and `0225`** — see C3.

### C3 — `0223`, `0224`, `0225` — stated explicitly

- **`0223`** (in `tasks/done/`): **untouched.** Its enumerated, reasoned Process-review row is
  Decision 3.
- **`0224`** (backlog): mechanism **unchanged**; its **oracle** for the worklog `Role:` line must be
  **this rule**, not the table's literal cell — widened by reference. Without this note the detector
  flags every lawful non-coder Build as a misroute.
- **`0225`** (backlog): its parser must accept a **rule-cell** in Plan/Build (a skill→owner
  expression, not a literal) — a design-note widening; its assertion becomes **stronger**: every named
  Build skill's owner must own it in `skills_for_role()`.

### C4 — ADR-038 is **not amended and not superseded**

This ADR is its companion. It cites ADR-038 §Decision (the rule), §Consequences first bullet (Build
and Verify left to the table), §Consequences *"Corroborating practice"* (`0241`), and §Re-raise only
if closing line (the closeout clause).

**One clause departs from ADR-038, and it is named rather than absorbed: Decision 2 (Plan).** Because
the Plan step runs a coder-owned skill, ADR-038 §Decision fixes Plan = coder; Decision 2 is an
**owner-ruled scoped exception** to that rule (ND3, 2026-08-27), bounded to the Plan step on
non-coder rows in `/fkit-sprint-ship-loop`. An exception the owner rules and this ADR records is not
an amendment: ADR-038's text is unchanged, its rule still governs every step this ADR does not name,
and a future reader must read the two together. **Everything else in ADR-038 is untouched** —
Decision 1 acts on Build, which ADR-038 left to the table; Decision 3 restates ADR-038's own outcome
for Verify / Review / Process-review.

Separately, ADR-038's *"their roles come from the loop's enumerated step table"* stops describing
Build once Decision 1 stands. That earns a **dated correction note** (C2 ii) — a drift note, not an
amendment, and **not** widened to Plan, whose departure is recorded here instead.

### C5 — Historical records

`sprint-6.md` §Notes' hand-written *"FOUR of the 19 rows are NOT `## Owner: fkit-coder`"* warning
becomes historical once (i) ships. `sprint-5.md`'s exclusion record is correct for that board and that
run and is **not edited** (brief ⛔).

### C6 — Negative / costs — stated plainly

- **Prose-enforced, no prevention.** The same accepted tradeoff as ADR-038 §"Accepted tradeoff — prose,
  not prevention" and ADR-037 §5 (*"Prose is proportionate. There is no mechanical enforcement"*):
  a driver that spawns the wrong role by hand never reaches the ADR-018 hook. Detection is `0224`.
- **A widening.** Two more roles (architect, producer) may write their own deliverables as spawned
  Build workers under the declared-approval marker. It is the same trust-not-proof posture
  `fkit-coder.md` already states for the coder; it is not a new guarantee and must not be described
  as one.
- **The step-1 predicate is an approximation.** `Owner column = fkit-wiki` is a proxy for "vault
  write"; the Plan-worker `BLOCKED` backstop is what makes it safe, and a driver that skips the
  backstop has a hole.
- **⚠️ Decision 1's skill-less clause moves by-hand producer and architect rows to the coder — this
  is intended, and it is the change with the widest reach.** *(Owner-confirmed 2026-08-28, verbatim
  option label: **"Confirm as intended (Recommended)"**.)* A deliverable that names no producing
  skill is the coder's whatever `## Owner` says, and **coordination-doc repairs and convention-page
  prose are exactly that class.** Two consequences, stated plainly rather than left to be discovered:
  - **On today's Backlog board this reaches every one of the 13 `## Owner: fkit-producer` rows, not a
    handful** *(re-measured 2026-08-28 — the 123 `🔲 Backlog` rows, each row's own brief read for
    `## Owner`, then each of the 13 read for the skill its deliverable names)*. **None of the 13
    names a producing skill**, so Decision 1 staffs all 13 with `@fkit-coder`. By document:
    - **Eight are coordination-doc repairs** in Decision 1's own words — `0149`, `0183`, `0193`,
      `0221`, `0318`, `0320`, `0321`, `0335`. They are not all the same document: `0318` and `0320`
      repair **closed briefs**, `0193` repairs a **closed brief plus a closed sprint board**, `0149`
      and `0221` repair **briefs**, `0183` repairs a **sprint plan and a brief**, `0321` repairs the
      **live Backlog board**, `0335` repairs **task-folder records** (*"This task edits records
      only"*).
    - **Three are skill-less coordination-doc writing that is not repair** — `0013` (worked examples
      into a convention page), `0184` (a convention statement plus brief annotations), `0340` (a
      status banner backfilled onto sprint plans). Same clause, same outcome.
    - **Two name no skill either but are not doc work** — `0187` (a read-only verification act plus
      a record correction) and `0262` (a field report from a live install test). They reach the coder
      through the clause's residual *"names no skill"* limb, not its coordination-doc limb.

    ⚠️ **A mention is not a producing skill.** Five of the 13 cite `/fkit-record-decision` or
    `/fkit-task-brief` in their text — **every one is a reference, not an invocation**, and all five
    are checkable: `0318`, `0320` and `0335` point at `/fkit-record-decision`'s *"Correcting an
    accepted ADR"* section for the **dated-note form**; `0318` says outright that the row is *"an
    owner-ruled task, **not** by `/fkit-task-brief`"*; `0321` cites *"`/fkit-task-brief`'s own
    independent-shippability test"* as an authority for how the work was split; and `0262` cites
    *"(ADR-035, `/fkit-task-brief` step 5)"* as the rule a verification step checks against.

    **The exposure is wider than those five, and worse in kind** *(measured 2026-08-28: every
    `/fkit-*` token in each of the 13 briefs, checked against `skills_for_role()`)*. Of the 13,
    **nine carry a real `/fkit-*` skill token** — the five above plus `0184`, `0187`, `0221` and
    `0340`; `0013` names the **agent** `/fkit-coder`, not a skill; `0149`, `0183` and `0193` name
    none. ⛔ **Eight of those nine name a producer-*exclusive* skill** — `/fkit-status`,
    `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled` or `/fkit-heal`, each owned by the
    producer and by no other role (`0184`, `0187`, `0262`, `0318`, `0320`, `0321`, `0335`, `0340`;
    only `0221` does not, naming the lead-owned `/fkit-sprint-ship-loop`). **That is the misroute
    shape exactly, at scale:** a grep-based oracle would read a producer-exclusive skill out of a
    brief whose deliverable runs no skill at all, and route **8 of these 13 rows back to the
    producer** — reproducing precisely the `## Owner` staffing Decision 1 replaces. A future oracle
    (`0224`, `0225` — C3) **must read the deliverable's producing skill, never grep the brief for
    skill names.**

    The `## Owner` field is not changed by this ADR; it stops being what the loop reads.
  - **Two rows already shipped the other way.** `0178` (convention page, architect, *"by hand"*) and
    `0218` (brief repair, producer, *"by hand"*) were staffed from `## Owner` — the reading this ADR
    rejects. **Decision 1 would have staffed both with the coder.** They are evidence that non-coder
    Builds happen and that the driver improvised; they are **not** evidence that this rule reproduces
    past practice, and §Corroborating practice marks them as such.
- **Wiki rows leave the pipeline.** They get no Review / Process-review beat from the loop; their QA
  is the wiki's own lint and the owner's eye. That is the cost candidate 5 would buy back, at the
  price of a conditional pipeline step.

### Unverified this pass — stated, not guessed

How Sprint 5's two non-excluded architect rows were staffed. *(Still unverified.)*

**Resolved 2026-08-28, in `0270`'s review round 1:** the blank-`## Owner` question. It is a
**formatting quirk, not a missing field** — `0184` carries a second `## Owner rulings on record`
heading that an unanchored `grep -A1 '^## Owner'` matches; its real owner is `fkit-producer`. **No
Backlog brief is missing the field**, and the measured split is in §Context.

---

## Re-raise only if

1. **The skipped class stops being marginal, or the out-of-pipeline route proves unworkable** — the
   vault-deliverable rows need the loop's Review / Process-review beats after all. Then reopen with
   **candidate 5** (conditional "Apply (wiki)" sub-step), not with candidate 1.
2. **`skills_for_role()` gains per-artifact grant scoping** — ADR-038's own first trigger; if it fires
   there, the "soft wall" analysis here changes shape too.
3. **The owner re-rules on `0200` or on ND1–ND5** — the rulings this ADR records.
4. **A Build deliverable appears whose producing skill has no owning role in `skills_for_role()`**, or
   whose target is neither source nor vault nor a skill-produced document — the rule as stated
   cannot resolve its role.

**Do not re-raise on:** *"the loop should read `## Owner`"* (Decision 1 answers by deliverable, not
by field — `0171` is the counter-example); *"the architect row needs a second owner beat"* (the
`NEEDS-DECISION` relay is that beat); or anything that re-argues ADR-038's option (b) from
authorship — that is ADR-038's closeout, and this ADR inherits it.

---

## Owner sign-off

All rulings given via **`AskUserQuestion`** in a live **`fkit lead`** session driving
`/fkit-sprint-ship-loop` on Sprint 6, **2026-08-27**; selections from the question's option list, so
**the option labels are the verbatim text**. Recorded in `0270`'s `plan.md` §6 by the driver at
approval, before the Build spawn (ADR-020).

| # | Question | Ruling (verbatim label) |
|---|---|---|
| Route | who drives `0270`'s Plan and Build | **"Drive it here with the architect (Recommended)"** |
| **ND1** | **the decision** | **"A: Build role follows the deliverable's skill + vault rows skipped (Recommended)"** |
| ND2 | skip predicate | **"Owner column = fkit-wiki + Plan-worker BLOCKED backstop (Recommended)"** — a blank `## Owner` is not-eligible-until-repaired, never treated as coder |
| ND3 | Plan role for non-coder rows | **"The Build role, by hand (Recommended)"** |
| ND4 | skipped-row handling | **"Report only, route named (Recommended)"** |
| ND5 | standing carve-outs | **"Yes, both (Recommended)"** — `fkit-architect.md` and `fkit-producer.md` |
| ND6 | follow-ons | **"File all three after the ADR is accepted (Recommended)"** |
| ND7 | provenance | **"Yes (Recommended)"** — today's ruling recorded as corroborating practice |

### Corroborating practice (ND7)

**The rows are not all the same kind of evidence — read them one by one, not as a block.**

- **`0241`, `0222`, `0242`, `0249` — corroborate the rule.** Each has a skill-produced deliverable
  and the driver staffed Build with that skill's owning role. The rule applied live before it was
  written.
- **`0171` — also corroborates Decision 1, and separately kills `## Owner` as the predicate.** Its
  deliverable (a convention page, by hand) names no skill, and the driver staffed the **coder** —
  which is exactly what Decision 1's skill-less clause prescribes. That it is `## Owner:
  fkit-architect` is the point: the rule got it right *because* it read the deliverable, not the
  field.
- **`0270` — the rule applied live, this run.** Architect Build via the architect's own skill. Not
  an improvisation: it ran on a named Route ruling (ADR-037 §3). ⚠️ It is `🔄 In progress`, **not
  shipped**.
- **`0178` and `0218` — NOT corroboration of the rule.** These two, and only these two, ran the way
  this ADR rejects: skill-less deliverables staffed from `## Owner` (architect, producer), where
  Decision 1 would have staffed the coder (C6). They are evidence that non-coder Builds happen and
  that the driver improvised — not that the rule reproduces past practice.

*(An earlier draft of this preamble said "the last four are not corroboration"; that under-claimed
the ADR's own table — `0171` and `0270` do corroborate. C6 and §Why this and not the others name the
same two rows, `0178` and `0218`.)*

| Task | Sprint | Build worker | Skill run | Evidence |
|---|---|---|---|---|
| `0241` | 3 | `@fkit-architect` | `/fkit-design-spec` | ADR-038 §Consequences *"Corroborating practice"*; `0241` `worklog.md` *"Build unit (spawned fkit-architect, via /fkit-design-spec)"* |
| `0222` | 3 | `@fkit-architect` | `/fkit-record-decision` | `0222` `worklog.md` *"step-role-follows-skill, the rule this ADR records"* |
| `0242` | 4 | `@fkit-architect` | `/fkit-record-decision` | `0242` `worklog.md` *"by a spawned `fkit-architect` (via `/fkit-record-decision`)"* |
| `0249` | 4 | `@fkit-wiki` | `/fkit-wiki-ingest` | `0249` `worklog.md` *"spawned `fkit-wiki` (Build step of the Sprint 4 driver run)"* — **the lawful half.** Its Process-review *Coder response* written by the wiki is the half ADR-038 forbids and Decision 4 now routes out of the pipeline |
| `0178` | 6 | `@fkit-architect` | **none — by hand** (convention page) | `0178` `worklog.md` *"fkit-architect, spawned as the BUILD step"* — ⚠️ **staffed from `## Owner`; Decision 1 would have staffed the coder.** Not corroboration of the rule |
| `0218` | 6 | `@fkit-producer` | **none — by hand** (brief repair) | `0218` `worklog.md` *"a spawned `fkit-producer` build worker"* — ⚠️ **staffed from `## Owner`; Decision 1 would have staffed the coder.** Not corroboration of the rule |
| `0171` | 6 | `@fkit-coder` | **none — by hand** (convention page) | `0171` `worklog.md` *"Built 2026-08-15 by the `fkit-coder` Build worker"* — ✅ **corroborates Decision 1's skill-less clause** (skill-less deliverable → coder), and is the **counter-example** that shows `## Owner` is not the predicate |
| **`0270`** | **6** | **`@fkit-architect`** | **`/fkit-record-decision`** | **this ADR**, on the Route ruling above: Plan by the architect by hand (Decision 2), Build via the architect's own skill (Decision 1) |

---

## Number allocation — the sweep, evidenced

Run 2026-08-27 before allocation, per `/fkit-record-decision` step 2:

1. **Step A** (malformed `adr-*` filenames under `decisions/`) → printed **nothing**.
2. **Step B** (highest number on disk, numeric) → **43**. Next free: **44**.
3. `grep -rn -i 'adr-044' ai-agents/ claude/ test/ README.md CLAUDE.md` — vault included, read-only →
   **2 hits, both in `0270`'s own `plan.md`** (its §4 names this ADR's title and slug as "number
   pending the sweep at write time; do not pre-allocate"). References to *this* ADR; zero rival
   claimants. No `decisions/` index or README exists to update.

**Classification: 044 is free and is allocated here.**

---

## Related

- [ADR-038](adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md) — companion; **not
  amended**. Cited: §Decision (the rule), §Consequences first bullet (Build/Verify left to the table),
  §Consequences *"Corroborating practice"*, §Re-raise only if closing line (closeout clause), §Options
  considered (b). Note: ADR-038 cites `skills_for_role()` at `claude/skills-for-role.sh:48`; on
  2026-08-27 it is at `:51` — a drift, recorded here, not repaired here.
- [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md) — the hard wall: vault writes are
  `fkit-wiki`-exclusive. **Not in question**; the reason wiki rows are skipped rather than driven.
- [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) — §Decision 2 (*"The wiki
  stays wiki-only"*), §Decision 4 (the loop closes through a spawned producer). Close stays producer.
- [ADR-037](adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)
  — §3 *"What the driver may not instruct"* (a named owner ruling displaces a skill rule per run;
  ND5's carve-outs make the displacement standing), §5 (prose is proportionate).
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  hook that denies a skill to a non-owning role; why a derived role (candidate 1) falls back to the
  by-hand route.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) /
  [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) — the loop's single
  up-front approval and `NEEDS-DECISION` relay (Decision 5). Not reopened.
- [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md) — `plan.md` / `worklog.md` as the record
  of the rulings.
- Ownership source of truth: `claude/skills-for-role.sh:51-59` (`skills_for_role()`).
- Loop table: `claude/skills/fkit-sprint-ship-loop/SKILL.md:122-127`; step 1 skip memory `:103`;
  `NEEDS-DECISION` relay `:249`.
- Vault ban on the coder: `claude/agents/fkit-coder.md:211`; the coder's Build carve-out
  `:60-72` (the shape ND5 mirrors).
- Process-review fix step: `claude/skills/fkit-process-stateful-review/SKILL.md:195`.
- Owner column and blank-owner drift: `claude/skills/fkit-status/dashboard.sh:1196`, `:983`.
- Worked evidence: `ai-agents/sprints/done/sprint-5.md` (§Status `⛔` block; §Notes first bullet —
  rulings of 2026-08-10 on `0255`, `0258`, `0269`); `ai-agents/sprints/sprint-6.md` §Notes.
- Tasks: `0270` (this decision), `0200` (ADR-038's ruling), `0223` / `0224` / `0225` (ADR-038
  follow-ups, C3), `0205` (dated-correction precedent), `0167` (the per-run "coder plans, architect
  builds" ruling), and the corroborating rows above.
- **Wiki:** **fkit-wiki** should ingest this ADR (and, after C2 ii lands, re-ingest ADR-038) — an
  architect never writes the vault.
