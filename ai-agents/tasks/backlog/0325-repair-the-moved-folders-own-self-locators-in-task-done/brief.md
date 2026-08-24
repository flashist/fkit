# Repair the moved folder's OWN self-locators in `/fkit-task-done` — a rule for the reference sweep

## ID
0325

## Sprint
Sprint 6

## Priority
Sprint 6 P14

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### 🔒 OWNER RULING, 2026-08-23 — this task exists because of it

Ruled live via `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop`, and
relayed to a spawned `fkit-producer` with no owner channel. **Verbatim option label:**

> **"Re-point them, add rule to task-done (Recommended)"**

**Verbatim question:**

> "A closed task folder's own header locators — `plan.md:5` 'Brief: …/tasks/backlog/0250-…' and
> `review.md:3` 'Task: …/tasks/backlog/0250-…' — go stale the moment the folder moves to `done/`.
> `/fkit-task-done` mandates outbound sibling link repair but is silent on self-locators, so there's
> no skill rule to settle it. This recurs at EVERY close."

**Verbatim chosen-option description:**

> "The producer's recommendation. They are locators, not claims — the same reasoning that justified
> repairing review.md's dead 0324 path this run. Leaving them mints two new instances of the
> dead-path class 0168 exists to fix, once per close, forever. Two-token fix plus a one-line skill
> addition."

The ruling arose from `0250`'s close-out `NEEDS-DECISION`
(`0250-fix-the-scaffold-producer-row-fkit-task-brief-omission`). **The ruling's first half is already
executed** — `0250`'s two locators were re-pointed on 2026-08-23 by the same spawned producer. **This
task is the second half only: the skill rule.**

### The gap in the skill, verified on disk 2026-08-23

**File:** `claude/skills/fkit-task-done/SKILL.md`, step 5 (*"Update each tracked location to
'Done'"*).

Step 5 already rules four inbound cases and one outbound case. Its outbound bullet — **"The moved
folder's OWN outbound links"** — is the closest existing rule, and it is **scoped to siblings**, in
its own words:

> *"any link **it** (or its `plan.md`/`worklog.md`/`review.md`) makes to a **sibling** task no longer
> resolves from `done/`. A sibling link now targets **another** folder's brief"*

**A locator pointing at the folder's own `brief.md` is not a sibling link, and no bullet covers it.**
That is the whole defect: the sweep repairs links *out* to other tasks and links *in* from other
files, and is silent on the folder pointing at itself.

⚠️ **Verified as an absence, with the method's limits stated.** Checked by reading step 5 in full
(`claude/skills/fkit-task-done/SKILL.md`, the `### 5.` section through the `**Then prove it.**`
paragraph) — not by a single-line `grep`, per
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
§*"Verifying a claim about text"* item 1. **Limit not covered:** the read was scoped to steps 4–6;
a rule placed elsewhere in the file was not searched for exhaustively.

### ⭐ The distinction this task turns on — a locator is not a claim

**This is the load-bearing content of the brief. The rule is worthless, and actively harmful, if it
is written without this distinction.**

- **A locator is a pointer** — a header line whose job is to tell a later reader *where the brief is*.
  A pointer that no longer resolves is simply **wrong**, and repairing it changes no assertion.
  **Repair these.**
- **Frozen evidence is a claim** — a captured command's output, a quoted specimen, or a dated
  measurement that happens to mention the old path. **Rewriting it falsifies a dated record.**
  **Never touch these.**

The governing sentence, which step 5 already states twice for the inbound cases and which this rule
extends to the self case:

> **A historical record's *claims* are frozen; its *links* are not.**

### The worked example — `0250`'s folder, both categories in one place

`0250` is the specimen. Its folder holds **six** occurrences of the old `backlog/` path, and the
correct treatment splits **2 repair / 4 freeze**. All six were re-measured firsthand 2026-08-23.

**REPAIR — self-locators (both were re-pointed on 2026-08-23 under the ruling above):**

| Site | Content | Why it is a locator |
|---|---|---|
| `plan.md` `:5` | `Brief: ` then the absolute path to the task's own `brief.md` | its only job is to point at this folder's brief; it asserts nothing |
| `review.md` `:3` | `Task: ` then `ai-agents/tasks/…/<self>/brief.md` | names the brief under review as a forwarding address, not a finding |

**FREEZE — do not touch, and the rule must be written so that it cannot:**

| Site | Content | Why it is frozen |
|---|---|---|
| `plan.md` `:117` | a line inside a fenced block capturing `git status --porcelain` output | **captured command output.** The command really did print `backlog/` that day. Editing it forges a transcript |
| `plan.md` `:188` | plan step 7, as written at plan time, with an elided path | **frozen historical instruction.** It records what the plan said, not where a file lives now |
| `review.md` `:86` | *"`0324`: still under `ai-agents/tasks/backlog/`, holding only `brief.md`"* | **dated measurement about a different task.** It was true when measured; rewriting it makes it **false** |
| `review.md` `:98` | *"`0324`'s own folder was **still under `ai-agents/tasks/backlog/`** at measurement 2"* | same — a dated measurement, and explicitly about `0324`, not `0250` |

⚠️ **Note the trap in rows 3 and 4 of the freeze table.** Those two name `backlog/` *correctly*, and
they are about **another task entirely**. A rule implemented as "replace `backlog/` with `done/` in
the moved folder" would corrupt them. **The rule must key on the locator's role, not on the string.**

⚠️ **And the trap in rows 1 and 2:** they name the moved folder's own path in **elided** form
(`0250-...`), so a rule keyed on the full folder name misses them — which is *correct here*, but is
luck, not design. Do not rely on eliding as the freeze mechanism.

### Measurement — the class is real, growing, and wider than `review.md`

Measured firsthand 2026-08-23 over `ai-agents/tasks/done/`:

| Fact | Count |
|---|---|
| task folders in `done/` | 198 |
| with a `review.md` | 116 |
| with a `plan.md` | 90 |
| with a `worklog.md` | 97 |
| **`review.md` with a stale self-locator** | **44** |
| **`plan.md` with a stale self-locator** | **1** (`0248-update-the-docs-for-the-structure-check-capability`, `:12`) |
| **`worklog.md` with a stale self-locator** | **1** (`0218-repair-0177s-stale-cap-and-byte-figures`) |

⚠️ **Method and its limits, stated rather than implied away.** Each file's first 12 lines were tested
for the literal string `tasks/backlog/<its-own-folder-name>`. This is a **presence** check per file,
the safe direction per the convention page (a presence hit cannot be a false positive from wrapping).
**It undercounts, and the true figure is higher:** it cannot see a locator below line 12, a locator
written with an elided or relative path, or a locator whose folder was renamed. **Read these as
floors, not totals.**

**The class is growing.** `0168` measured **124** done folders / **60** with `review.md` on
2026-07-31. Today it is **198 / 116**. Every close since added to the population, which is exactly the
"once per close, forever" the ruling names.

### ⭐ Relationship to `0168` — DISTINCT, complementary, not a duplicate

**Determination: file it. Measured, not guessed.**

`0168` is `0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers`, `🔲 Backlog`,
Sprint 6 P13, owner `fkit-coder`.

| | `0168` | **This task (`0325`)** |
|---|---|---|
| Direction | **retroactive** — remediate instances that already exist | **prospective** — stop new ones being minted |
| Surface | `ai-agents/tasks/done/*/review.md` **only** | `claude/skills/fkit-task-done/SKILL.md` — the mover |
| Files covered | `review.md` | every record file the moved folder carries: `plan.md`, `review.md`, `worklog.md` |
| Instances | 44 measured today | 0 today; **2 per close, forever**, if unfixed |
| Dependency | was hard-gated on `0160` | none on `0168` |

**Neither subsumes the other, and the evidence is the two files `0168` does not reach:** `0248`'s
`plan.md` and `0218`'s `worklog.md` both carry stale self-locators today and sit **outside `0168`'s
stated scope**, which its own brief fixes as *"each `review.md`'s `^Task: ` header"*.

⚠️ **Sequencing note, and the reason this matters practically:** without this task, `0168`'s backfill
is **re-polluted at the very next close**. Landing this rule first — or in the same sprint — is what
makes `0168`'s remediation stay remediated. **This is an observation for the owner's ranking, not a
declared dependency, and this brief does not re-rank anything ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).**

⚠️ **`0168`'s own board dependency is now stale, and repairing it is NOT this task's job.** The
Sprint 6 board reads `derive 0168 depends="0160 — hard."`, and `0160`
(`0160-decide-the-durable-citation-form-for-mutable-coordinates`) is **`✅ Done`** as of today's
measurement. Flagged here so it is not lost; **filed as a residual, not actioned.**

### ⚠️ Neighbours editing the same file — read before planning

Three other open tasks touch `claude/skills/fkit-task-done/SKILL.md`. **None collides with this one's
region (step 4/5's reference sweep), but the planner must confirm that firsthand, not on this
sentence:**

- **`0229`** — widen the mover to repair a brief whose `## Status` contradicts a landed close. Edits
  **step 1**.
- **`0135`** — edits **the same step-1 branch** as `0229`, later.
- **`0134`** — the ADR covering the mover's must-never list.

### ⚠️ A genuine open question the planner must not settle by keystroke

The ruling chose *"re-point them"* — a path-token repair. **The convention page offers a stronger
alternative that the ruling did not consider**, and it is already proven in this repo.

[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
rules, under *"Link labels"*:

> *"Do not use a mutable location as the visible label of a forwarding link into a living document.
> … label it with what the target **is** (`brief`), never with where it **lives**"*

and, under *"Which anchor for which target"*, rules that a **task** is anchored by *"the folder-name
`NNNN` prefix, always"*.

**The prior art is in `0168`'s own brief:** 4 of its 60 headers are markdown hrefs targeting the
**relative, location-free** `./brief.md` — and **all 4 survive the `git mv` intact**. A self-locator
written that way **never rots and never needs repairing.**

**So there are two candidate rules**, and they are not the same rule:

1. **Repair on move** — the mover re-points the stale token at each close. Matches the ruling
   literally. Keeps working on every existing record. **Cost:** the mover edits a record file at
   every close, forever.
2. **Write it durably in the first place** — records emit `` `NNNN` `` plus a relative `./brief.md`,
   so nothing rots. **Cost:** does not help the 46 records that already exist, and the write side
   lives in other skills, not the mover.

⚠️ **These are complementary, and 2 does not remove the need for 1.** **This brief does not choose,
and neither should the planner unilaterally** — the ruling names option 1, so **option 1 is the
minimum this task ships**. If the plan wants to add option 2, that is a **scope increase requiring
owner approval**, and it likely belongs with `0171`/`0176`'s convention-and-guard line of work.

## What to build

**Outcome, not wording. The rule's exact phrasing and placement are the coder's plan to write and the
owner's to approve — this brief deliberately does not draft the sentence.**

1. **Add a self-locator repair rule to `/fkit-task-done`'s reference sweep** — the step 4/5 region of
   `claude/skills/fkit-task-done/SKILL.md` — so that at every close, the moved folder's own header
   locators are re-pointed at the folder's new home.

2. **The rule must cover the moved folder's own record files**, not just `review.md`. At minimum
   `plan.md`, `review.md`, `worklog.md` — the three measured above as carrying the defect.

3. **The rule must carry the locator-vs-frozen-evidence distinction explicitly**, in the skill's own
   prose, so a future agent applying it cannot read it as "replace `backlog/` with `done/`". It must
   be impossible to follow the rule correctly and still corrupt a captured transcript or a dated
   measurement. **Use `0250`'s six occurrences as the worked example** — they are the specimen, they
   split 2/4, and both traps described above are present in them.

4. **State the freeze cases as hard prohibitions**, in the register step 5 already uses for its other
   ⛔ cases (compare its existing *"never flip a `➡️ Moved` row to `✅ Done`"* and its ADR-prose
   warn-off).

5. **Do not change any existing step-5 bullet's meaning.** This is an addition. The sibling-outbound
   bullet stays; the new rule sits beside it.

6. **Consider whether the skill's step 7 report should name self-locators repaired**, alongside the
   re-pointed links it already reports. Decide and say which; do not silently omit it.

⛔ **Out of scope:**
- Remediating the 46 existing stale self-locators. **That is `0168`'s work** (for its 44 `review.md`
  cases) and unowned for `0248`'s `plan.md` and `0218`'s `worklog.md` — **flag those two, do not fix
  them here.**
- Editing `claude/skills/fkit-task-cancelled/SKILL.md`. The same defect plausibly exists there.
  ⚠️ **Not measured by this brief — check it and report, and if it is real, it is a follow-up to
  file, not scope to absorb.**
- Any change to step 1 (`0229`/`0135`'s region).
- Any write to `ai-agents/wiki-vault/`. If vault pages carry the same rot, that is **fkit-wiki's**
  repair ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- Re-ranking any board.

## Verification steps

1. **Read the amended step 5 end to end** and confirm it still reads as one coherent procedure — the
   new rule must not contradict the sibling-outbound bullet it sits next to.

2. **Walk the rule against `0250`'s folder as an acceptance case.** A correct rule, applied to
   `ai-agents/tasks/done/0250-fix-the-scaffold-producer-row-fkit-task-brief-omission/` **as it stood
   before the 2026-08-23 repair**, must select **exactly** `plan.md:5` and `review.md:3` and must
   reject **all four** of `plan.md:117`, `plan.md:188`, `review.md:86`, `review.md:98`.
   ⚠️ Re-measure those coordinates before relying on them; `:NNN` drifts, and the two `plan.md`
   figures were taken before this brief was filed.

3. **Confirm the four freeze cases are stated in a form an agent will actually apply** — not as a
   footnote. Placement is part of the deliverable.

4. **Run the structure/manifest checks the repo already requires for a skill-source edit.**
   ⚠️ `claude/skills/fkit-task-done/SKILL.md` may be a manifest-tracked file — **check
   `claude/structure-manifest.tsv` and regenerate if and only if the repo's own rule requires it.**
   ⛔ Do not regenerate the manifest speculatively; `0188` is an open manifest-regen task and a stray
   regen here would collide with it.

5. **`npm test`** green, and state the count.

6. **Confirm no other step of the skill changed** — `git diff --numstat` plus
   `git diff -U0` inspected, **not by eye over the rendered file**.

## Notes

**Depends on:** nothing.

⚠️ Soft-follows nothing, but note the sequencing observation in `## Context` — landing this before
`0168` is what stops `0168`'s remediation being re-polluted at the next close. That is a ranking
observation for the owner, **not a dependency**, and it does not block this task.

> ✅ **DATED CORRECTION 2026-08-23 — the owner has now ruled on that ranking observation. The two
> paragraphs above are left byte-identical.** They remain true in what they say: this is still **not a
> dependency**, and nothing here blocks. What changed is that the owner **acted on** the observation.
> This task was **pulled onto Sprint 6 and ranked at `P13`, immediately above `0168`** — ruled live via
> `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop` and relayed to a spawned
> `fkit-producer` with no owner channel; **the option label is the verbatim text**: **"Pull 0325 into
> Sprint 6 ahead of 0168 (Recommended)"**. ⛔ **The ordering is carried by board rank ALONE.** No
> `Depends on` was added here and none was added to `0168`; the owner ruled a **reading order**, not a
> correctness gate, and converting it into one is a decision nobody has taken.

- **On merit:** as ranked — this row sits at its own merit position, so no divergence is being
  recorded. **The reason the position is what it is:** `0168` backfills the stale self-locators that
  already exist, and this task stops new ones being minted; without this landing first, `0168`'s
  backfill is re-polluted at the very next close. **Rank and merit coincide**, which is exactly the
  case [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
  §*"The merit statement"* requires `as ranked` for — the explicit no-op that makes an **absent** merit
  statement detectable. ⚠️ **The neighbour is named by folder ID and this statement carries no `P<n>`
  token**, per the same page's *"Folder ID only"* rule.

### Does this need a test? — position: **probably not a `node --test` test, and here is the honest reasoning**

**Stated as a position for the owner and planner to weigh, not a decision. This brief does not design
a test.**

`/fkit-task-done` is a **procedure document** — prose an agent reads and follows. Per ADR-014 the
repo's testing is `node --test`, zero devDependencies. That toolchain can assert things **about the
file's text**; it cannot assert that an agent followed the procedure correctly.

- **What a test could genuinely check:** that the rule's text is *present* in `SKILL.md` — the same
  shape as the existing `test/dashboard-contract.test.js` string guards, and the shape `0176` is
  scoping for the citation guard. ⚠️ **This guards against silent deletion, nothing more.** It is
  cheap and it is weak.
- **What a test cannot check:** whether the rule, applied by an agent to a real close, repairs the
  right two lines and freezes the right four. That is the property that matters, and it is not
  mechanically checkable here.
- **A stronger and more interesting option:** a test over the **repo's own corpus** — assert that no
  `done/*/` record file carries a stale self-locator. ⚠️ **This would be RED on day one** (46
  measured instances) and would stay red until `0168` lands. **That makes it a `0168` deliverable, or
  a follow-up gated on `0168` — not something this task can ship green.**

**Recommendation: ship the rule without a new test, and say so explicitly in the worklog rather than
letting it pass unremarked.** If the owner wants the weak presence-guard, it is a one-file addition
and can be folded in on approval. ⚠️ **The corpus test is the one with real value and it is blocked
on `0168`; flag it as a named follow-up rather than attempting it here.**

### Provenance

- **Owner ruling 2026-08-23**, `AskUserQuestion`, live `fkit lead` session driving
  `/fkit-sprint-ship-loop`. **Verbatim option label: "Re-point them, add rule to task-done
  (Recommended)"**. Question and chosen-option description transcribed verbatim in `## Context`.
- **Origin:** `0250`'s close-out `NEEDS-DECISION`
  (`0250-fix-the-scaffold-producer-row-fkit-task-brief-omission`, closed 2026-08-23).
- **Filed by a spawned `fkit-producer` with no owner channel** (ADR-021), appended to the Backlog
  board under `/fkit-task-brief` step 5. ⚠️ **Nothing was re-ranked and no `## Status` was changed**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- **The ruling's first half is already executed:** `0250`'s `plan.md:5` and `review.md:3` were
  re-pointed to `done/` on 2026-08-23, one changed line per file, line counts unchanged, the four
  frozen occurrences left byte-identical.

> ⚠️ **DATED CORRECTION 2026-08-23 — the *"Nothing was re-ranked"* sentence above describes the FILING
> act and is now superseded as a description of this task's current placement. The bullet is left
> byte-identical**; it remains a true record of what the filing producer did that morning.
>
> **What is true now:** a **second owner ruling of the same day**, same channel — verbatim option label
> **"Pull 0325 into Sprint 6 ahead of 0168 (Recommended)"** — moved this task **Backlog → Sprint 6** and
> ranked it **`P13`, immediately above `0168`**. `## Sprint` moved `Backlog` → `Sprint 6` and
> `## Priority` moved `Unscheduled` → `Sprint 6 P13` in the same act. ⛔ **`## Status` was NOT changed —
> it is still `🔲 Backlog`. Ranked is not started.**
>
> **How this satisfies ADR-035, since the bullet above cites it.** ADR-035's Decision bans a mid-board
> insertion because *"on an interleaved board there is no mid-board insertion point that does not
> renumber a closed row."* **Sprint 6 is not an interleaved board.** Measured 2026-08-23 immediately
> before the insertion: `P1`–`P9` were **all `✅ Done` and contiguous at the top**, `P10` was
> `🔄 In progress`, and `P11`–`P19` were all `🔲 Backlog` — one unbroken closed run above one unbroken
> open run. ADR-035's own §*"Residual risks / re-raise only if"* names that shape by hand:
> *"On a board whose closed rows are all contiguous at the top, a mid-board insertion below them
> renumbers nothing closed, and the narrowing is unnecessary though harmless."* ✅ **No closed row was
> renumbered**, which was the owner's own stated constraint, quoted verbatim in the ruling:
> *"placement must renumber no closed row."*
>
> **What did move, in full:** the **Priority cell only** of the seven open rows below the insertion —
> `0168` P13→P14, `0188` P14→P15, `0229` P15→P16, `0300` P16→P17, `0270` P17→P18, `0272` P18→P19,
> `0154` P19→P20 — plus each of those seven briefs' `## Priority` field by the same one step, because
> `/fkit-sprint-ship-loop` §1 orders by `## Priority` and a stale field would have silently defeated the
> ruling. ⛔ **No row's prose, `## Status`, `## Owner` or `Depends on` line was touched, on any of the
> seven.**
>
> ⚠️ **One residual this created, flagged and deliberately NOT fixed:** seven
> `➡️ Moved to [Sprint 6](sprint-6.md) — priority P<n>` markers on the Backlog board still name the
> pre-insertion rank. They are **left byte-identical** because
> [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
> §*"What NOT to rewrite"* rules that marker frozen prose. Per the `0157`/`0159` precedent ADR-035
> cites, a stale rank reference is repaired **by naming the folder ID, never by restoring numbers**.
>
> **Recorded by a spawned `fkit-producer` with no owner channel** (ADR-021). ⛔ **Nothing committed, no
> task file moved, no `## Status` changed, no `ai-agents/wiki-vault/` write.**

### Residuals flagged, not actioned

1. **`0168`'s board dependency is stale.** Sprint 6 emits
   `derive 0168 depends="0160 — hard."`; `0160` is `✅ Done`. Needs a dated correction by whoever
   owns that row. **Not touched here.**
2. **`0248`'s `plan.md` and `0218`'s `worklog.md`** carry stale self-locators and fall outside
   `0168`'s `review.md`-only scope. **Currently unowned.**
3. **`/fkit-task-cancelled` was not measured** for the same defect.
4. **The 44 / 1 / 1 figures are floors**, per the method limits stated in `## Context`.
