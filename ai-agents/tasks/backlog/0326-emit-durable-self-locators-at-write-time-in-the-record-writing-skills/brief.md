# Emit durable self-locators at write time, so a record's own locator never rots

## ID
0326

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### 🔒 OWNER RULING, 2026-08-23 — this task exists because of it

Ruled live via `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop`, and
relayed to a spawned `fkit-producer` with no owner channel. **Verbatim option label:**

> **"File the durable form separately (Recommended)"**

**Verbatim question:**

> "`0325` as filed does 'repair on move'. But the durable-citation-anchors convention (`0160`, shipped)
> bans a mutable location as a link label — and 4 of `0168`'s 60 headers already use the location-free
> relative `./brief.md`, which survives `git mv` INTACT and never needs repairing at all. Should
> records emit durable self-locators up front instead of being repaired after?"

**Verbatim chosen-option description:**

> "The producer's pick. `0325` ships repair-on-move alone (your ruling, and the minimum). The
> write-at-source fix goes in its own task alongside `0171`/`0176` — because its write surface lives in
> OTHER skills, not the mover, so folding it in makes `0325` a multi-skill task."

⚠️ **One attribution in the question is off by one task, corrected here and not repaired above.** The
convention page `durable-citation-anchors.md` was **written by `0171`**
(`0171-write-the-durable-citation-anchors-convention-page`, Sprint 6 `P2`, `✅ Done`).
`0160` (`0160-decide-the-durable-citation-form-for-mutable-coordinates`, also `✅ Done`) is the
**decision** the page implements. The question's own naming of `0171` elsewhere in the same relay is
the correct one. Nothing turns on it; it is recorded so a later reader does not chase `0160` for the
page.

### ⭐ The core insight — the location-free relative form survives `git mv` intact

**This is the load-bearing content of the brief.**

A record's *self-locator* is the header line whose whole job is to tell a later reader **where this
folder's brief is** — `Task: …/tasks/backlog/<NNNN>-<slug>/brief.md`, `Brief: …`. Written as a
path **rooted at the repo**, it names the folder's *current board*, so the moment `/fkit-task-done`
moves the folder `backlog/` → `done/` the locator is wrong.

Written as the **relative, location-free** `./brief.md`, it points at a sibling inside the same
folder. **`git mv` carries the whole folder, so the link still resolves — with no repair, ever.**

**This is not a proposal; it is already true in this repo, and `0168`'s brief measured it:**

> *"All 4 hrefs point at `./brief.md` — relative and location-free — and all 4 resolve on disk."*
> — `0168`'s brief, under its *"in href form"* heading

⭐ **`0325` is the symptom fix. This is the root-cause fix.** A locator that never rots needs no
mover rule, no sweep, and no backfill.

### The write surface — MEASURED 2026-08-23, not guessed

⚠️ **The measurement's method and its limits are stated rather than implied away.** The searches are
`grep -rn -E '^\s*[-*>|`]*\s*\*{0,2}(Brief|Task)\*{0,2}:' claude/skills/*/SKILL.md` for prescribed
templates and `grep -rn -E '(^|[^a-zA-Z])Brief:' claude/` for the `plan.md` form, plus a per-file
first-12-lines scan of every record file under `ai-agents/tasks/done/`. **⛔ Re-measure before
planning** — figures drift, and the skill files are under active edit by other open rows.

**Finding 1 — exactly TWO skills prescribe a self-locator, and both prescribe the rotting form.**

| Skill source | Where | The prescribed line |
|---|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md` | the fenced `review.md` schema block under the heading *"The shared review document — schema & ownership"* | `Task: <path to task file>` |
| `claude/skills/fkit-process-stateful-review/SKILL.md` | the same fenced schema block, under the same heading | `Task: <path to task file>` |

⭐ **The two blocks are a declared pair.** `fkit-stateful-review`'s copy says, in its own words:

> *"This schema is shared with the coder's `fkit-process-stateful-review` — **keep it exact** so the
> two sides interoperate."*

⚠️ **That sentence is a constraint on this task, not a footnote: the two blocks must change together
and must stay byte-identical to each other.** Changing one alone breaks the interoperation the
sentence exists to protect.

**Finding 2 — `plan.md` and `worklog.md` have NO prescribed header at all.**

`grep -rn -E '(^|[^a-zA-Z])Brief:' claude/` returns **zero hits**. No skill anywhere tells an agent to
write a `Brief:` line into `plan.md`. The skills that *create* those two files are:

| File | Created by | Where |
|---|---|---|
| `<task-folder>/plan.md` | `claude/skills/fkit-task-ship-loop/SKILL.md` | step 4, *"write the approved plan to `<task-folder>/plan.md`"* |
| `<task-folder>/plan.md` | `claude/skills/fkit-sprint-ship-loop/SKILL.md` | the **Plan** row of the step table — *"on approval the DRIVER writes the approved text to `<task-folder>/plan.md` verbatim"* |
| `<task-folder>/worklog.md` | `claude/skills/fkit-task-ship-loop/SKILL.md` | step 4, *"Open `<task-folder>/worklog.md`"* |
| `<task-folder>/worklog.md` | `claude/skills/fkit-sprint-ship-loop/SKILL.md` | the **Build** row — *"write source + `worklog.md`"* |

⛔ **Neither prescribes a header line, so for these two files this task is ADDING a rule where none
exists — a different act from Finding 1, which CHANGES a rule that does.** ⚠️ **Whether to add one at
all is a real question the planner must put to the owner, not settle by keystroke** — see
`## Notes`.

**Finding 3 — the corpus confirms both findings.** Measured over `ai-agents/tasks/done/`, first 12
lines per file:

| File | Files | Stale self-locator | Durable relative `./brief.md` | Neither |
|---|---|---|---|---|
| `review.md` | 116 | **44** | 5 | 67 |
| `plan.md` | 90 | **1** | 8 | 81 |
| `worklog.md` | 97 | **1** | 8 | 88 |

⭐ **Read the table against Findings 1 and 2 and it tells one story:** the rot is **38 %** of
`review.md` — the one file whose locator form is prescribed, and prescribed as a repo-rooted path —
and **~1 %** of the two files where agents were left to choose, where the durable relative form is
already the more common habit. ⚠️ **The prescription is the defect's source.** That is the argument
for this task, and it is the thing to re-derive before believing it.

⚠️ **Method limits, stated:** the scan is a **presence** check on the first 12 lines only. It cannot
see a locator below line 12, one written in an elided form, or one whose folder was later renamed.
**Read every figure as a floor, never a total.**

### ⭐ Relationship to `0325` and `0168` — THREE DISTINCT TASKS, and the overlap was measured

**Determination: file it. The overlap is not substantial, and the file surfaces are disjoint.**

| | `0168` | `0325` | **This task (`0326`)** |
|---|---|---|---|
| What it does | **backfills** staleness that already exists | **repairs on move** — the mover re-points at each close | **stops it being written** — records emit a locator that cannot rot |
| Direction | retroactive | prospective, per-close | prospective, at creation |
| Files it edits | `ai-agents/tasks/done/*/review.md` (data) | `claude/skills/fkit-task-done/SKILL.md` | `claude/skills/fkit-stateful-review/SKILL.md`, `claude/skills/fkit-process-stateful-review/SKILL.md`, and — **only if the owner rules the two loops in** — `claude/skills/fkit-task-ship-loop/SKILL.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md` |
| Board | Sprint 6 `P14` | Sprint 6 `P13` | Backlog, unranked |

**⛔ None subsumes another, and here is the evidence for each direction:**

- **This task does not remove the need for `0325`.** A durable form helps only records written
  **after** it lands. The ~46 already-stale locators, and every record written before it, still need
  the mover's repair. `0325`'s own brief states this in terms: *"These are complementary, and 2 does
  not remove the need for 1."*
- **This task does not remove the need for `0168`.** `0168` repairs data already on disk; this task
  writes no data file at all.
- **`0325` does not remove the need for this task.** `0325` edits the **mover**; every locator it
  repairs was still minted wrong by a **different** skill, and the mover pays that cost at every
  close, forever.

⚠️ **The one genuine overlap, named rather than hidden:** all three concern the same defect class, so
**all three must agree on the durable form**. If this task changes the review-ledger header while
`0168`'s sweep is mid-flight, the two will write different shapes. ⛔ **That is a sequencing hazard,
NOT a declared dependency — this brief declares none** (see `## Notes`).

### Relationship to `0171` and `0176` — this is the convention applied to self-locators

- **`0171`** (`0171-write-the-durable-citation-anchors-convention-page`, `✅ Done`) wrote
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).
  Its §*"Link labels"* rules:

  > *"Do not use a mutable location as the visible label of a forwarding link into a living document.
  > … label it with what the target **is** (`brief`), never with where it **lives**"*

  and its §*"Which anchor for which target"* rules that a **task** is anchored by *"the folder-name
  `NNNN` prefix, always"*.

  ⭐ **A self-locator is a forwarding link into a living document, and `Task: …/tasks/backlog/…` is a
  mutable location used as its label.** The convention already covers this; nothing about it is being
  decided here. **This task is the convention's application, not an amendment to it.**

- **`0176`** (`0176-build-the-coordination-citation-policy-guard`, `🔲 Backlog`, Backlog board,
  `Unscheduled`, owner `fkit-coder`) is the convention's **guard**. ⚠️ **Read it before planning** —
  if `0176`'s guard would fire on the form this task emits, the two must agree on one shape. ⛔ **Not
  measured by this brief. Check it and report; do not assume either way.**

## What to build

**Outcome, not wording. ⛔ The exact locator form, its phrasing and its placement are the coder's plan
to write and the owner's to approve — this brief deliberately does not draft the line.**

1. **Make the prescribed `review.md` self-locator durable.** The `Task: <path to task file>` line in
   the shared schema block should name the task in a form that **survives the folder moving between
   `backlog/`, `done/` and `cancelled/` without any repair**. The convention supplies the two
   ingredients — the permanent folder-name `NNNN` prefix as the identity, and a location-free
   relative target for the link — but ⛔ **do not treat "`` `NNNN` `` plus `./brief.md`" as a decided
   answer; it is the leading candidate and the plan must argue it.**

2. **Change BOTH copies in the same act, and keep them byte-identical.**
   `claude/skills/fkit-stateful-review/SKILL.md` and
   `claude/skills/fkit-process-stateful-review/SKILL.md` declare the block shared and say *"keep it
   exact"*. ⛔ **A diff touching one and not the other is a failed run.**

3. **Do not break the existing ledgers.** 116 `review.md` files on disk carry the old shape, and the
   reviewer/coder round-trip reads them. ⚠️ **Whether the new form must be readable alongside the old,
   or whether old ledgers simply keep their old header, is a real decision** — make it, state it, and
   say which in the worklog.

4. **Decide — and say — whether `plan.md` and `worklog.md` get a prescribed self-locator at all.**
   Today neither has one (Finding 2). ⛔ **Do not silently add one, and do not silently omit one.**
   The measured corpus argues both ways: the ad-hoc habit is already mostly durable, which is an
   argument for leaving it alone; but ~1 % is already stale with nothing to stop it growing, which is
   an argument for prescribing. **This is a scope question for the owner, and it is the one that
   decides whether this task edits two skills or four.**

5. **State the residue explicitly.** Even done perfectly, this fixes **nothing already written**.
   ⛔ **A worklog that reports this task as "the self-locator problem, solved" has over-claimed.** Say
   which population it covers (records written after it lands) and which it does not (~46 measured
   today, plus everything written before).

⛔ **Out of scope:**

- **Repairing any existing record file.** `review.md` backfill is `0168`; `plan.md`/`worklog.md`
  staleness is currently **unowned** and is `0325`'s flagged residual. **Flag; do not fix here.**
- **Editing `claude/skills/fkit-task-done/SKILL.md` or `claude/skills/fkit-task-cancelled/SKILL.md`.**
  The mover is `0325`'s surface. ⚠️ **If landing this makes `0325`'s rule narrower or partly
  unnecessary, SAY SO as a finding — do not edit `0325`'s brief or its scope.**
- **Amending `durable-citation-anchors.md`.** This applies the convention; it does not change it. If
  the convention turns out to be wrong or silent on this case, that is an owner question and a
  separate task, **and the page is dual-homed** — see verification 4.
- **Any write to `ai-agents/wiki-vault/`.** If vault pages carry the same shape that is **fkit-wiki's**
  repair ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- **Re-ranking any board**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- **Moving any task file** — the movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).

## Verification steps

1. **Prove the durability claim mechanically, do not assert it.** Take a task folder carrying a
   locator in the new form, `git mv` it `backlog/` → `done/` **in a scratch worktree**, and show the
   locator still resolves **by resolving it relative to the file that holds it** — ⛔ **not by
   eyeballing the string.** Then do the same for the old form and show it does **not**. ⚠️ **Both
   halves are required; only the failing half proves the change was needed.**

2. **Prove the two schema blocks are identical after the edit** — a direct comparison of the two
   fenced blocks, output shown. ⛔ Not "I changed both."

3. **Walk one real existing ledger** end to end under the amended skills and confirm the
   reviewer→coder round-trip still works. ⚠️ **Name the ledger.**

4. **Run the checks a skill-source edit owes in this repo, and check whether they are owed at all
   rather than running them defensively.** ⚠️ `RELEASING.md` §3 states the negative in its own words —
   editing `claude/skills/` *"does not require a regen — none of them ship through the scaffold"*.
   ⛔ **Do NOT run `npm run generate:manifest` "to be safe": a regenerated `claude/structure-manifest.tsv`
   in this diff is a FAILED verification, and `0188` is an open manifest-regen row a stray regen would
   collide with.** Likewise check, rather than assume, whether `test/dual-home-parity.test.js` reaches
   any file touched.

5. **`npm test`** green, and **state the count**.

6. **Confirm the change surface is exactly what was approved** — `git diff --numstat` plus
   `git diff -U0` inspected, ⛔ **not by eye over the rendered files.** In particular: no file under
   `ai-agents/tasks/`, no mover skill, no `ai-agents/wiki-vault/` path.

## Notes

**Depends on:** nothing.

⚠️ **Soft-follows `0325` and `0168`, and neither is a hard gate.** All three must agree on one durable
form, so running this **after** `0325` gives it a form already argued once, and running it **during**
`0168`'s sweep risks the two writing different shapes. ⛔ **That is a sequencing observation for the
owner, NOT a dependency**, and this brief declares none — converting a scheduling preference into a
block is a decision only the owner takes.

⚠️ **`0176` may constrain the form.** Read its brief before planning; if its guard would fire on the
shape chosen here, the two must be reconciled and that reconciliation is a **finding to report**, not
scope to absorb.

**No merit statement is required.** This brief is filed on the **Backlog** board, which is unranked by
design, so there is no rank for a statement to be relative to
([`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
§*"The merit statement"*). ⚠️ **If it is later pulled onto a ranked board, one becomes mandatory.**

### Does this need a test? — position: **yes, and unusually for this repo a real one is available**

**Stated as a position for the owner and planner to weigh. This brief does not design the test.**

Most rules in `claude/skills/` are procedure prose, and ADR-014's `node --test` toolchain can only
assert that their text is *present* — a weak guard against silent deletion. ⭐ **This task is
different, because its claim is mechanical:** *a locator written in form X still resolves after the
folder moves.* That is checkable without an agent in the loop — construct a folder, move it, resolve
the link. ⚠️ **Whether it belongs as a unit test or as verification step 1 run once is the planner's
call; the point is that the property is real and testable, which is rare here.**

⚠️ **The corpus-wide test is a different thing and is NOT available.** *"No record file carries a
stale self-locator"* would be **red on day one** (~46 measured) and stays red until `0168` lands.
**That is a `0168` deliverable or a follow-up gated on it — ⛔ not something this task can ship
green.** This is the same conclusion `0325`'s brief reached, for the same reason.

### Provenance

- **Owner ruling 2026-08-23**, `AskUserQuestion`, live `fkit lead` session driving
  `/fkit-sprint-ship-loop`. **Verbatim option label: "File the durable form separately
  (Recommended)"**. Question and chosen-option description transcribed verbatim in `## Context`.
- **Origin:** the second of two rulings in one exchange; the first pulled `0325` onto Sprint 6 at
  `P13`, ahead of `0168`.
- **Filed by a spawned `fkit-producer` with no owner channel** (ADR-021), **appended** to the Backlog
  board under `/fkit-task-brief` step 5. ⚠️ **Nothing was re-ranked by the filing of THIS task and no
  `## Status` was changed anywhere by it**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- **Every count in this brief was measured firsthand on 2026-08-23** with the commands named in
  `## Context`. ⛔ **They are dated readings, never budgets. Re-measure.**

### Residuals flagged, not actioned

1. **`plan.md` and `worklog.md` staleness is unowned.** `0248`'s `plan.md` and `0218`'s `worklog.md`
   carry stale self-locators today and fall outside `0168`'s `review.md`-only scope. Named by `0325`
   as its residual 2; still unowned.
2. **`/fkit-task-cancelled` was not measured** for the same defect, by this brief or by `0325`.
3. **`0176`'s interaction with the chosen form is unmeasured.**
4. **The 44 / 1 / 1 figures are floors**, per the method limits stated in `## Context`.
