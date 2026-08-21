# Repair the three decay shapes across the open backlog briefs

## ID
0306

## Sprint
Sprint 6

## Priority
Sprint 6 P1

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Why this exists, in one sentence

A four-part triage of all 108 open backlog rows on 2026-08-14 found **three distinct kinds of
cross-cutting decay** in the open briefs — a dead path, a mis-resolving numeral, and a discharged
dependency still reading as a block — and the owner ruled that all three be repaired by **one** task,
scheduled **ahead of feature work**.

### The owner ruling that scopes this task

**Owner ruling 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, relayed to a spawned producer. **The option label is the verbatim text:**

> **"One cleanup task, scheduled early (Recommended)"**

⚠️ **That ruling is why this is ONE brief and not three.** `/fkit-task-brief`'s standing rule is to
decompose into the smallest independently shippable units, and on the merits these three shapes
**are** independently shippable. The owner ruled otherwise on exactly this point, so the ruling
governs. ⛔ **Do not "helpfully" re-split this task** — if the coder's plan concludes a split is
necessary, that is a question for the owner, not a decision for the run.

A second owner ruling from the same session and channel — **"Scoped sprint, rest stays Backlog
(Recommended)"** — placed the remaining ~80 rows on Backlog with their verdicts and themes attached.
This task is the one the owner asked to be scheduled early within the scoped sprint.

> ## ⭐⭐ DATED CORRECTION 2026-08-14 — `claude/` IS NOW **IN SCOPE**. MASTER BLOCK; EVERY PRIOR BYTE LEFT IDENTICAL.
>
> **Owner ruling, 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
> `/fkit-sprint-ship-loop` and relayed to a spawned producer with no owner channel. **The option
> label is the verbatim text:**
>
> > **"Extend 0306 to claude/ too (Recommended)"**
>
> ⛔⛔ **Every *"`claude/` is out of scope"* instruction below this line is SUPERSEDED and MUST NOT be
> honoured.** They are left byte-identical because they were true when written; they are **history**.
> The open owner question this brief carried up in its `## Notes` — *"does this task's scope extend to
> the `task 43` occurrences under `claude/`?"* — **is now answered: yes.**
>
> ### What the widened scope covers — and only this
>
> ⚠️ **The widening is the `task 43` numeral under `claude/`. Nothing else.** It is **not** a licence
> to sweep `claude/` for any other decay shape. **Shape 1** (the dead sprint path) and **Shape 3**
> (discharged dependencies) are **unchanged** — both stay confined to the open briefs under
> `ai-agents/tasks/backlog/`.
>
> ### ⚠️ THE RECORDED SOURCE-SIDE COUNT WAS ALREADY WRONG. Re-measured 2026-08-14:
>
> The paragraph below records **10 occurrences across 3 files**. **The live figure is 12 occurrences
> across 5 files** — the recorded figure missed two files entirely:
>
> | file | occurrences | in the old figure? |
> |---|---|---|
> | `claude/README.md` | 3 | yes |
> | `claude/fkit-claude.sh` | 6 | yes |
> | `claude/skills-for-role.sh` | 1 | yes |
> | ⭐ `claude/skill-ownership-hook.sh` | 1 | **NO — missed** |
> | ⭐ `claude/skills/fkit-team/SKILL.md` | 1 | **NO — missed** |
>
> ⛔ **Re-measure this too.** `grep -rn '\btask 43\b' claude/` is the derivation; the table is a dated
> reading, not a budget. ⚠️ **The two missed files are the finding, not a footnote** — a scope widened
> against an under-counted surface repairs less than it reports.
>
> ⚠️ **`claude/skill-ownership-hook.sh` is the most load-bearing occurrence of the five files**: it is
> the hook that `task 43` *means*, and its own header comment cites the numeral that today resolves to
> an unrelated task.
>
> ### ⭐ THE RELEASE-SURFACE QUESTION, ANSWERED — because it is easy to get wrong the cautious way
>
> ✅ **No `npm run generate:manifest` is required for this widening. Verified against `RELEASING.md`
> §3 on 2026-08-14, which states the negative in its own words:**
>
> > *"Stated as a negative, because it is the half people get wrong: editing `claude/skills/`,
> > `claude/agents/`, or `claude/fkit-claude.sh` **does not require a regen** — none of them ship
> > through the scaffold."*
>
> **The two real regen triggers, per that same section:** (1) an edit to a `claude/scaffold/` file the
> manifest actually covers — everything under `claude/scaffold/ai-agents/` plus
> `claude/scaffold/CLAUDE.md` and `claude/scaffold/AGENTS.md` — or (2) an edit to the generator's own
> path map or hash contract (`bin/generate-structure-manifest.mjs`). ⛔ **This task triggers neither.**
> All five files above sit **outside** `claude/scaffold/`.
>
> ⛔ **Do NOT run `npm run generate:manifest` "to be safe".** An unneeded regen commits manifest churn
> with no edit behind it — its own defect, and one in exactly this brief's subject class: a record
> saying something the tree does not.
>
> ✅ **The dual-home parity test does not reach these files either** (verified 2026-08-14).
> `test/dual-home-parity.test.js` walks `ai-agents/` against `claude/scaffold/ai-agents/`; **none of
> the five files lives in either home.** ⚠️ **So both reasons the `## Notes` bullet gave for scoping
> `claude/` out — *"a dual-home parity test and a structure manifest behind it"* — are measured
> **inapplicable to this change**, not merely overruled.
>
> ⚠️ **Run `npm test` anyway and report the result.** `claude/skills/fkit-team/SKILL.md` is walked
> live by `test/skill-frontmatter.test.js`, and `claude/skill-ownership-hook.sh` /
> `claude/skills-for-role.sh` are exercised by `test/skill-ownership-hook.test.js` and
> `test/launcher-contract.test.js`. A comment-only edit should be green — ⛔ **prove it, do not assume
> it.**
>
> ### ⛔ What the widening does NOT change
>
> - ⛔ **The two counter-examples stand, untouched.** *"task 70"* (cited by `0217`, `0226`) resolves
>   **correctly** — do not "repair" it. `0296`'s *"task 23"* is a **quoted frozen cancellation
>   reason** — a note beside it, **never** a rewrite.
> - ⛔ **No blanket sweep, on either side of the boundary.** Every numeral is still classified
>   individually, with evidence, exactly as Step 3 requires.
> - ⛔ **`test/` and `bin/` remain out of scope**, and so does every path under `claude/scaffold/`.
> - ⛔ **No task-file move, no status change, no re-rank, no `ai-agents/wiki-vault/` write, no commit.**
>   All unchanged.
> - ⚠️ **The partial-fix caveat is NOT deleted — it INVERTS.** Verification 11 required the worklog to
>   state that the `claude/` half was left unrepaired. It must now report the `claude/` half **as
>   repaired**, with re-measured before/after counts, and name any occurrence deliberately left and
>   why. ⛔ **A run that repairs `claude/` and says nothing about it has under-reported its result just
>   as badly as one that repaired nothing.**
>
> ### Sites corrected below, each carrying its own note
>
> Shape 2's *"`task 43` also lives OUTSIDE `ai-agents/`"* paragraph; **Step 3**'s closing line; the
> `⛔ Out of scope` bullet; **verification steps 5 and 11**; and the `## Notes` open-question bullet.
> ⚠️ **This master block governs every one of them.**

### ⚠️ Every count below was measured on 2026-08-14 at HEAD `4424b44` and WILL have drifted

⛔ **Re-measure every figure in this brief before acting on it.** The figures are recorded so the
implementer can tell whether the surface **grew or shrank**, not so they can be trusted. A run that
copies these numbers into its worklog without re-deriving them has reproduced the exact defect this
task exists to fix. Where a count differs from this brief, **the disk wins and the difference is
reported**.

⚠️ **One count in the spawning instruction was already stale when this brief was written.** The
driver measured **18** briefs carrying the dead sprint path; the live figure is **17**. The
difference is [`0238`](../../done/0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md),
which carried 5 occurrences and **closed** earlier the same day. That is not a discrepancy to
reconcile — it is the first worked example of why this brief mandates re-measurement.

---

### Shape 1 — the dead `ai-agents/sprints/sprint-N.md` path

**What died.** Sprint boards moved under `ai-agents/sprints/done/`. `ai-agents/sprints/` today holds
only `backlog.md`, the `done/` directory and `reviews/`. **No `sprints/sprint-N.md` path resolves any
more, for any N.**

**Measured 2026-08-14:** **17 open briefs**, **28 occurrences**.

| id | occurrences | id | occurrences | id | occurrences |
|---|---|---|---|---|---|
| `0013` | 1 | `0168` | 1 | `0236` | 4 |
| `0144` | 1 | `0176` | 2 | `0237` | 1 |
| `0146` | 1 | `0183` | 1 | `0270` | 2 |
| `0149` | 1 | `0187` | 1 | `0276` | 1 |
| `0155` | 3 | `0193` | 5 | `0296` | 1 |
| `0156` | 1 | `0234` | 1 | | |

**This shape fails LOUDLY** — the path does not resolve, so a reader knows they have been misled.
It is the least dangerous of the three and is caught by re-measurement.

⚠️ **Two of these are citation-repair tasks that now carry the defect class they exist to fix** —
`0183` (its deliverable **target** is a dead path) and `0193` (**5** occurrences, including inside
its own `git diff ai-agents/sprints/sprint-2.md` **verification commands**, which now prove nothing).

⚠️ **`0176` is self-flagged** — its own dated correction of 2026-08-06 already predicted this exact
defect. Repairing it must not overwrite that correction.

---

### Shape 2 — ⭐ pre-migration `task NN` numerals that resolve to the WRONG task

⛔⛔ **THIS IS THE WORST OF THE THREE AND IT IS THE REASON THIS TASK IS NOT JUST A PATH SWEEP.**

Before [ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
gave every task a permanent four-digit folder ID, briefs referred to work as *"task 27"*, *"task 36"*,
*"task 43"*. Those numerals were **renumbered by the migration**. Today they still resolve — **to a
different, real, unrelated task.**

⚠️ **Re-measuring does NOT catch this.** A dead path announces itself. A mis-resolving numeral
returns a confident wrong answer, and every downstream reader inherits it. **A reader who follows
one of these lands on the wrong task and has no signal that anything went wrong.**

**Measured 2026-08-14: 13 open briefs carry a bare `task NN` numeral** — `0013`, `0037`, `0045`,
`0046`, `0137`, `0138`, `0196`, `0213`, `0217`, `0226`, `0296`, `0302`, `0305`.

**Verified mis-resolving — the numeral resolves, to the wrong thing:**

| cited | intended referent | what `NNNN` is TODAY | cited by |
|---|---|---|---|
| `task 27` | a behavioral-claim form | `cancelled/0027-design-fkit-git-agent-and-consent-model` | `0013`, `0045` |
| `task 28` | *"additive convergence walks and reads the tree"* = `done/0023-converge-ai-agents-additively-on-launch` | `cancelled/0028-design-ship-loop-timeout-auto-proceed` | `0045` |
| `task 36` | `done/0072-remove-fkit-omnigent-orphan-residue` | `done/0036-extend-mover-reference-sweep-to-the-knowledge-base` | `0013`, `0046` |
| ⭐ `task 43` | the `PreToolUse` skill-ownership hook / [ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) | `done/0043-fix-scaffold-knowledge-base-folders` — **unrelated** | `0196`, `0302`, `0305` |

⭐⭐ **`task 43` is a finding the driver's instruction did not contain, and it is the most serious
instance.** It appears in **`0302` and `0305`, both filed on 2026-08-14** — the class is **not**
confined to the oldest briefs; it is being **actively reproduced today**, because it is copied out of
live source comments.

⚠️⚠️ **`task 43` also lives OUTSIDE `ai-agents/`.** Measured 2026-08-14, **10 occurrences** under
`claude/` — `claude/README.md` (×3), `claude/fkit-claude.sh` (×6), `claude/skills-for-role.sh` (×1).
⛔ **`claude/` IS OUT OF SCOPE FOR THIS TASK** (see *Notes* — it is an open owner question). The
implementer must **report** the source-side count, **not repair it**. ⚠️ **Say so explicitly in the
worklog**: repairing only the `ai-agents/` half while the source keeps re-seeding the numeral is a
**partial fix**, and a run that does not say so has under-reported its own result.

> ⛔⛔ **DATED CORRECTION 2026-08-14 — THE PARAGRAPH ABOVE IS SUPERSEDED ON BOTH ITS COUNT AND ITS
> SCOPE RULING. Left byte-identical.** Owner ruling, verbatim option label **"Extend 0306 to claude/
> too (Recommended)"** — see the **master correction** in `## Context`, which governs.
> **`claude/` is IN SCOPE for the `task 43` numeral, and the count is 12 across 5 files, not 10
> across 3** (the two missed files are `claude/skill-ownership-hook.sh` and
> `claude/skills/fkit-team/SKILL.md`). ⛔ **Do not "report, not repair" — repair.** ⚠️ The partial-fix
> sentence **inverts**: the worklog now reports the `claude/` half as repaired, with re-measured
> before/after counts. ✅ **No manifest regen and no dual-home parity implication** — both verified,
> reasoning in the master block.

⛔ **NOT every bare numeral is a defect, and a blanket sweep would corrupt records.** Two counter-examples
verified on disk:

- **`task 70`** (cited by `0217`, `0226`) resolves **correctly** to
  `done/0070-relax-tool-allowlists-except-adversarial-reviewer`. ⛔ Do not "repair" it.
- **`0296`'s `task 23`** sits inside a **verbatim quotation of a frozen cancellation reason**
  (`⛔ Cancelled (2026-07-14) — superseded by Sprint 2 task 23`). ⛔ **A quoted frozen record is
  never edited to make it accurate** — the correct treatment is a note beside it, never a rewrite.

⚠️ **The remaining numerals — `task 23`, `task 26`, `task 46`, `task 47/48`, `task 80` — were NOT
resolved by this triage and are NOT classified here.** ⛔ **Do not assume they are wrong, and do not
assume they are right.** Each must be resolved individually against its own context.
⚠️ **`task 46` deserves particular care: `0046` is a LIVE OPEN task**, so if `0037`'s *"task 46"*
means a pre-migration 46, it currently points a reader at real, open, unrelated work — the worst
possible landing.

---

### Shape 3 — discharged dependencies still reading as blocking

A brief's `Depends on:` line names a task that has since closed, and **no correction says so**, so
the row presents as blocked to anyone skimming the board. **This is how ready work goes unscheduled.**

**Verified 2026-08-14 — dependency in `done/`, no correction note present:**

| id | the line, as it reads today | resolves to | real state |
|---|---|---|---|
| `0168` | `- **Depends on 0160 — hard.** No other dependency.` | `done/0160-decide-the-durable-citation-form-for-mutable-coordinates` | ⭐ **free today** |
| `0204` | `- **Depends on:** \`0202\` — **hard gate**, see caveat 2.` | `done/0202-…` | ⭐ **free today** |
| `0223` | `- **Depends on:** \`0222\` (records ADR-038 …)` | `done/0222-…` | ⭐ **free today** |
| `0240` | `- **Depends on:** \`0222\` — hard, for the ADR number only.` | `done/0222-…` | ⭐ **free today** |
| `0046` | `- **Depends on: task 36** (\`remove-fkit-omnigent-orphan-residue\`) — **soft, not hard.**` | `done/0072-…` by **name**; `done/0036-…` by **numeral** | ⭐ **free today** — and a Shape-2 specimen |

⚠️ **`0240` carries a second discharged edge in the other direction:** its
`- **Blocks:** \`0182\` — soft` is dead — `0182` shipped, and
`test/closed-rank-immutability.test.js` already implements the ruled design.

⚠️ **`0194` is a different sub-case and must NOT be flipped to unblocked.** Its `brief.md:88` reads
`- **Depends on:** \`0189\`, \`0190\`, \`0191\`.` and `:90` warns *"⚠️ All three dependencies are
open at filing."* **`0190` and `0191` have closed; `0189` has not.** The row is **still genuinely
blocked** — but its brief overstates the block **three-fold**. ⛔ **The repair here is to correct the
count, NOT to declare the row ready.**

⛔ **Four rows already read CORRECTLY and must be left alone** — each carries a dated correction or a
self-declaration that its dependency has discharged: `0224` and `0225` (dated correction 2026-08-06,
*"Relax 0224 and 0225."*), `0229` (*"Current dependency: nothing. This task is sprintable."*),
`0271` (*"both are now closed, so nothing here is waiting"*). ⚠️ **These are the model this task
should imitate** — they are the reason those rows are not on the list above.

⚠️ **`0224` is free of `0222` but is NOT ready** — it is held by an **unruled owner decision** (the
denial log's path; `.fkit/` is gitignored, so the ruled *"git-tracked, append-only"* shape has
nowhere agreed to live). ⛔ Do not record it as unblocked.

---

### ⚠️ Relationship to `0171` — the owner has NOT ruled on this, and the run must not settle it

[`0171`](../../backlog/0171-write-the-durable-citation-anchors-convention-page/brief.md) writes the
`durable-citation-anchors` convention page — **the rule that stops this decay recurring**. This task
is the **cleanup**; `0171` is the **prevention**. They are complements, not alternatives, and neither
subsumes the other.

**Stated plainly, because the ordering changes what this task costs:**

- **If `0171` lands FIRST**, this task has a **named anchor form to repair each citation INTO**, and
  its output is durable. Part 1 of the triage argued exactly this — scheduling `0171` early
  *"changes what the other five cost."*
- **If this task lands first**, every repair must **invent its own anchor form**, and the forms will
  fork across 17+ briefs — which is the same failure mode `0198` exists to prevent for correction
  notes.

⭐ **The producer's recommendation is `0171` first, then this task** — and both were proposed into the
same scoped sprint on that basis.

⛔ **This is a RECOMMENDATION, not a dependency, and it is NOT the owner's ruling.** The owner ruled
that this cleanup be *"scheduled early"*; they did **not** rule on whether it pairs with `0171`.
⛔ **Do not add a hard `Depends on: 0171`** — that would convert a producer's scheduling preference
into a block the owner never authorized. ⚠️ **If this task is picked up while `0171` is still open,
the run must NAME the anchor form it used and WHY**, so a later pass can reconcile it — the same
fallback [`0237`](../../backlog/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md)
already carries.

---

## What to build

**One repair pass over the open task briefs under `ai-agents/tasks/backlog/`,** covering all three
shapes above.

### Step 1 — re-measure, before repairing anything

Re-derive all three populations from disk and **record the command and its output**. ⛔ Do not
inherit a single count from this brief. Report every difference from the figures recorded above,
**in both directions** — a shrunk surface is as much a finding as a grown one.

### Step 2 — repair Shape 1 (dead sprint paths)

Re-point each dead `ai-agents/sprints/sprint-N.md` reference to its live location under
`ai-agents/sprints/done/`, **honouring the relative depth of the file holding the reference**.

- ⛔ **A reference inside a quoted frozen record is NOT re-pointed.** Where the text is quoting what a
  board or a closed brief said at the time, the coordinate is part of the quotation.
- ⚠️ **`0193`'s verification commands are the priority case** — they are the reason its brief cannot
  be executed as written.
- ⚠️ **`0176` already carries a dated correction naming this defect.** Repair beside it; do not
  overwrite it.

### Step 3 — repair Shape 2 (mis-resolving numerals) — ⭐ the load-bearing step

For **each** bare `task NN` numeral in an open brief:

1. **Resolve it against the live tree** — what does `NNNN` name today?
2. **Determine the intended referent** from the surrounding text (the brief usually names the work,
   which is the durable half — `0046` is the model: the **name** `remove-fkit-omnigent-orphan-residue`
   survived the migration intact while the numeral did not).
3. **Classify** into one of: **mis-resolving** (repair), **correct** (leave), **quoted frozen record**
   (leave, note beside it), or **unresolvable** (⚠️ leave, and **report it as unresolved — a numeral
   nobody can resolve is a first-class finding, not a failure**).
4. **Repair the mis-resolving ones** to the durable four-digit folder ID, keeping the descriptive name
   alongside so the reference survives the next renumbering.

⛔ **`claude/` is out of scope.** Report the source-side `task 43` count; do not repair it.

> ⛔ **DATED CORRECTION 2026-08-14 — the line above is SUPERSEDED. Left byte-identical.** Owner ruling
> **"Extend 0306 to claude/ too (Recommended)"**; master correction in `## Context` governs.
> **Step 3 now runs over the open briefs AND over `claude/`, for the `task 43` numeral only.** Apply
> the same four-way classification (mis-resolving / correct / quoted frozen record / unresolvable) to
> each of the 12 source-side occurrences — ⛔ **not a find-and-replace**, because a source comment can
> be a quotation too, and each site's surrounding prose has to be read.
>
> ⭐ **Repair each to the durable form, keeping the descriptive name alongside**, as `0046` models.
> The intended referent throughout is **the `PreToolUse` skill-ownership hook / ADR-018**; ⚠️ every one
> of the 12 already cites `ADR-018` in the same breath, so **the ADR is the durable half already
> present** and the numeral is the part that rots. ⚠️ **Resolve the ADR-018 hook's own task ID from
> disk before writing it in** — do not carry a number from this brief.
>
> ⚠️ **`claude/fkit-claude.sh` carries 6 of the 12 and is the file `0302` and `0305`'s authors read.**
> Repairing it is the act that stops the re-seeding; repairing only `ai-agents/` never would.

### Step 4 — repair Shape 3 (discharged dependencies)

For each of `0168`, `0204`, `0223`, `0240`, `0046`: **append a dated correction note** recording that
the dependency has discharged and the row is executable — and **leave the original `Depends on:` line
byte-identical**, exactly as `0224`, `0225` and `0229` already do.

- ⛔ **Do NOT rewrite or delete the original dependency line.** The append-only, leave-the-original
  pattern is the established form on this board, and it is what lets a reader see that a ruling
  changed rather than that a fact was always different.
- ⚠️ **The correction must keep the canonical parse shape intact.** `dashboard.sh` derives each task's
  next-step from a `## Notes` bullet opening `- **Depends on:**` with **nothing** between `**` and the
  label. ⛔ A decorated variant such as `- **⚠️ Depends on …**` renders
  `⟨derive: UNPARSEABLE — see brief⟩`. Put the correction in a **nested** bullet beneath the original,
  as `0224` and `0225` do.
- **`0240`:** correct the dead `- **Blocks:** \`0182\`` edge too.
- **`0194`:** correct the *"all three dependencies are open"* count to name `0189` as the sole
  surviving block. ⛔ **Do not mark `0194` unblocked — it is not.**
- ⛔ **Do not touch** `0224`, `0225`, `0229`, `0271` — they already read correctly.

### ⛔ Out of scope — a change here is a failed run

- ⛔ **No task-file move** — nothing enters or leaves `done/` or `cancelled/`
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md);
  the movers are producer-only).
- ⛔ **No status change** on any row. Making a row *readable* as unblocked is not making it
  `🔄 In progress`.
- ⛔ **No `ai-agents/wiki-vault/` write**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
  — routed to `fkit-wiki` if the vault carries the same decay).
- ⛔ **No edit under `claude/`, `test/` or `bin/`.**
  - ⛔ **DATED CORRECTION 2026-08-14 — the `claude/` third of this bullet is SUPERSEDED; the rest
    stands. Bullet left byte-identical.** Owner ruling **"Extend 0306 to claude/ too (Recommended)"**;
    master correction in `## Context` governs. **`claude/` is editable — for the `task 43` numeral
    only**, at the five files enumerated there. ⛔ **`test/` and `bin/` remain forbidden, and so does
    every path under `claude/scaffold/`** — which is also why no manifest regen is owed
    (`RELEASING.md` §3, quoted in full in the master block).
- ⛔ **No edit to a closed brief** under `done/` or `cancelled/`, and **no edit to an archived board**
  under `sprints/done/` — those are separate rows (`0183`, `0193`, `0201`, `0236`, `0299`) with their
  own scoping and, in `0201`'s case, an unmet owner-authorization precondition.
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **No commit.**

---

## Verification steps

1. **`ai-agents/sprints/sprint-N.md` is gone from open briefs.**
   `grep -rE 'sprints/sprint-[0-9]+\.md' ai-agents/tasks/backlog/*/brief.md` returns **only**
   occurrences the worklog **individually justifies** as quoted frozen records. ⚠️ A bare count is not
   a pass — each survivor is named with its reason.
2. **Every re-pointed path resolves.** For each repaired reference, the target file **exists** —
   demonstrated by resolving the link relative to the file that holds it, not by eyeballing the string.
3. **⭐ Every bare `task NN` in an open brief is accounted for.**
   `grep -ohE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/*/brief.md | sort -u` — and the worklog
   carries a line **per distinct numeral** giving its classification (repaired / correct-as-is /
   quoted frozen record / unresolved) **and the evidence**. ⛔ **An unclassified numeral is a failed
   verification**, and *"unresolved"* is a pass only when the reason is stated.
4. **`task 27`, `task 28`, `task 36` and `task 43` no longer appear as live references in open
   briefs** — surviving only inside quotations, each individually justified.
5. **The source-side count is REPORTED, not repaired.** `grep -rn '\btask 43\b' claude/` output is in
   the worklog, and `git diff --stat` lists **no file under `claude/`**.

   > ⛔ **DATED CORRECTION 2026-08-14 — THIS STEP AS WRITTEN NOW FAILS THE TASK. Left byte-identical.**
   > Owner ruling **"Extend 0306 to claude/ too (Recommended)"**; master correction in `## Context`
   > governs. **What this step now requires:**
   > - `grep -rn '\btask 43\b' claude/` output is in the worklog **before and after** — the before
   >     reading re-derived, not copied from this brief.
   > - **The after reading returns only occurrences the worklog individually justifies** (a quotation,
   >     or a numeral genuinely resolving correctly). ⚠️ **A bare count is not a pass** — each survivor
   >     is named with its reason, the same bar step 1 sets for the dead sprint path.
   > - `git diff --stat` **now lists files under `claude/`** — and ⛔ **lists nothing under
   >     `claude/scaffold/`, `test/` or `bin/`.**
   > - ✅ **`claude/structure-manifest.tsv` is NOT in the diff.** No regen is owed (`RELEASING.md` §3);
   >     a regenerated manifest in this diff is a **failed** verification, not a cautious extra.
   > - ✅ **`npm test` is green and its result is stated** — three suites read the touched files.
6. **⭐ The board still parses.**
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` exits `0`, with **both
   checks anchored on the dashboard's own output lines**:
   - `grep -c '^drift '` returns the same count as before the change.
   - `grep -cE '^derive .*UNPARSEABLE'` returns `0`.

   ⚠️ **Anchored, not bare** — a bare `grep drift` returns ~30 false positives from task titles, and a
   bare `UNPARSEABLE` grep returns 3. ⚠️ **Capture the before-count first**; a pass is *unchanged*, not
   *zero*.

   ⛔⛔ **Do NOT check with `grep -F` for the literal unparseable token.** The dashboard echoes each
   board row **verbatim**, so any row whose prose *mentions* that token makes the check match its own
   documentation — the check then reports a defect that does not exist, and can never return `0`.
   ⭐ **This is not hypothetical: it happened while this brief was being written.** Filing `0306`'s own
   board row took the literal-token check from `0` to `1` with the board completely clean, and the
   anchored `^derive ` form correctly stayed at `0` in both runs. ⚠️ **It is the same
   real-row-versus-prose-citation confusion demonstrated on `0294` (6 loose hits, 1 tight), one column
   over** — and it is the reason every check in this brief is anchored.
7. **The five corrected dependency rows still parse.** `0168`, `0204`, `0223`, `0240`, `0046` each
   still render a derived next-step on the dashboard — **not** `⟨derive: UNPARSEABLE — see brief⟩`.
8. **`0194` still reads blocked**, on `0189` alone.
9. **The four already-correct rows are untouched.** `git diff --stat` lists no `brief.md` under
   `0224`, `0225`, `0229` or `0271`.
10. **Nothing moved and nothing changed status.** `git status --porcelain` shows no path under
    `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/`, and no `## Status` line in the diff.
11. **The partial-fix caveat is stated.** The worklog says in terms that the `claude/`-side `task 43`
    occurrences are **unrepaired and will keep re-seeding the numeral**. ⚠️ A run that repairs the
    `ai-agents/` half and reports success without this sentence has **over-claimed its result**.

    > ⚠️ **DATED CORRECTION 2026-08-14 — THIS STEP INVERTS. Left byte-identical.** Owner ruling
    > **"Extend 0306 to claude/ too (Recommended)"**; master correction in `## Context` governs.
    > The caveat is **not dropped** — its subject changes. **What this step now requires:** the worklog
    > states **both** halves were repaired, gives the re-measured `claude/` before/after counts, and
    > names any occurrence deliberately left with its reason. ⛔ **A run that repairs `claude/` and
    > reports only the `ai-agents/` half has under-reported exactly as badly** as the case this step
    > was originally written against.
    >
    > ⚠️ **One honest residual survives the widening and MUST still be stated:** repairing these 12
    > comments removes today's seed; **nothing enforces the durable citation form**, so the class can
    > return. That is `0171`'s job (`## Notes`), and this step does not claim otherwise.

---

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing hard.
- ⚠️ **Soft, and deliberately NOT a `Depends on`:** best run **after**
  [`0171`](../../backlog/0171-write-the-durable-citation-anchors-convention-page/brief.md), which supplies the
  durable anchor form to repair each citation **into**. ⛔ **The owner has not ruled on the pairing** —
  see *Context*. If run first, **name the anchor form used and why**.
- ⚠️ **File contention is wide by construction** — this task edits briefs across 17+ open task
  folders. ⛔ **Do not run it in parallel with any row whose brief it touches**, and prefer running it
  **first** in any sprint that contains one. Rows it touches that were also proposed into the scoped
  sprint: `0168`, `0046`, `0204`, `0223`.
- ⚠️ **It repairs `0204`'s and `0223`'s briefs but touches no skill file** — so it does **not** contend
  with those tasks' own edits to `claude/skills/fkit-sprint-ship-loop/SKILL.md`.
- **Related, not blocking:** `0237` (the coordination-citation residual set, which blocks `0176`),
  `0236` (the prose sweep, re-scoped against five archived boards), `0183`/`0193` (citation repair
  **inside closed records** — out of scope here), `0296` (the row-less-brief detection mechanism).
  ⚠️ **`0183` and `0193` overlap this task's Shape 1 in their own briefs' text but NOT in their
  deliverables** — this task repairs *their briefs*; they repair *closed records*. Both directions are
  needed and neither is a duplicate.
- ⚠️ **Open owner question carried up, not decided here:** does this task's scope extend to the **10
  `task 43` occurrences under `claude/`**? They are live source comments that keep re-seeding the
  numeral into new briefs — `0302` and `0305`, both filed 2026-08-14, copied it from there. ⛔ The
  brief scopes them **out** and reports them, because a `claude/` edit is a different change class
  with a dual-home parity test and a structure manifest behind it.
  - ✅ **DATED CORRECTION 2026-08-14 — THIS QUESTION IS ANSWERED: YES. Bullet left byte-identical.**
    Owner ruling, verbatim option label **"Extend 0306 to claude/ too (Recommended)"** (`AskUserQuestion`,
    2026-08-14, live `fkit lead` session driving `/fkit-sprint-ship-loop`, relayed to a spawned
    producer). **Master correction in `## Context` governs.** ⚠️ **The bullet's stated reason was also
    measured and does not hold for this change:** `test/dual-home-parity.test.js` walks `ai-agents/`
    against `claude/scaffold/ai-agents/` and **none of the five files is in either home**, and
    `RELEASING.md` §3 says in its own words that editing `claude/skills/`, `claude/agents/` or
    `claude/fkit-claude.sh` **does not require a regen**. ✅ **Neither guard is engaged.**
    ⚠️ **The count in the bullet is also stale — 12 across 5 files, not 10 across 3.**
- ⚠️ **`0302` and `0305` are NOT repaired by that widening, and this task does not repair them
  either.** They carry the numeral in their own briefs and are covered by **Shape 2's `ai-agents/`
  half**, which already lists them. ⛔ Recorded so nobody reads the `claude/` widening as having
  swept the two briefs that quoted from it.
- ⚠️ **Second open owner question:** should `0183` and `0193`'s dead `sprints/sprint-N.md` citations be
  repaired **here**, or left to per-task re-measurement when those rows are picked up? ⛔ This brief
  repairs **their briefs' own citations** (Shape 1) but does **not** touch the closed records those
  tasks exist to repair. The owner has not ruled on the boundary.
- **Provenance:** the four-part backlog triage of 2026-08-14
  ([part 1](../../../knowledge-base/reports/2026-08-14-backlog-triage-part-1.md),
  [part 2](../../../knowledge-base/reports/2026-08-14-backlog-triage-part-2.md),
  [part 3](../../../knowledge-base/reports/2026-08-14-backlog-triage-part-3.md),
  [part 4](../../../knowledge-base/reports/2026-08-14-backlog-triage-part-4.md)) and the
  [synthesis](../../../knowledge-base/reports/2026-08-14-backlog-triage-synthesis.md) that merged them.
  All three shapes were re-measured on 2026-08-14 during that synthesis; the `task 43` class and the
  17-vs-18 correction are findings of the synthesis, not of the four parts.
- ⛔ **Filed by a spawned producer with NO owner channel: UNRANKED, re-ranks nothing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- **Owner `fkit-coder`** — mechanical text repair across brief files, matching the closest precedents
  on this board (`0168`, `0236`, `0237` are all citation-repair rows owned by `fkit-coder`). ⚠️ It
  writes **no** source under `claude/`, `test/` or `bin/`.
