# Guard `architecture.md`'s skill count against the skills on disk — so the number cannot drift a fourth time

## ID
0403

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

⭐ **Owner ruling 2026-09-16**, given live via `AskUserQuestion` in a `fkit lead` session during the
Sprint 9 wrap-up open-questions interview — **the option label is the verbatim text:
*"File a guard brief (Rec)"***. The ruling's own words:

> *"A producer files a backlog brief for a test that compares architecture.md's skill count against the
> skills on disk. Without it, 0400 fixes the number and it drifts again."*

⚠️ **Filed by a spawned `fkit-producer` with no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
relaying a ruling the lead session captured. Every scope decision below is a **producer judgement,
flagged** — see `## Notes` → *Scope decisions flagged for the owner*.

### The gap, in one sentence

**A hand-maintained six-place checklist is the only thing keeping `architecture.md`'s skill count true,
the checklist has already failed three times, and nothing tests it.**

### The checklist, and its own record of failing

`claude/skills-for-role.sh:12` — `# ⚠️ CHANGING A ROLE'S SKILLS? SIX hand-maintained places MIRROR this list`
opens a six-item list whose fourth entry is
`claude/skills-for-role.sh:17` — `#   * ai-agents/knowledge-base/architecture.md — the skill count and the role/skill table`.
**The identical block is duplicated in the launcher** at `claude/fkit-claude.sh:259` and
`claude/fkit-claude.sh:264`.

⭐ **The checklist's own header is the evidence that a checklist is not a guard.** Both copies carry,
verbatim:

- `claude/skills-for-role.sh:22` — `# ⚠️ THIS LIST SAID "TWO" UNTIL 2026-07-18, AND THE OMISSION COST EXACTLY WHAT IT LOOKS LIKE IT WOULD.`
  — followed by its own diagnosis: *"A checklist that is itself incomplete is worse than no checklist:
  it is followed, and it fails."*
- `claude/skills-for-role.sh:26` — `# If you add another mirror, add it HERE FIRST. (It said "FOUR" until 2026-08-27 — incomplete a second time; 0142 D4.)`

⚠️ **Read the two dated misses precisely — they are NOT this defect, and overstating them would be the
easy error.** Both record the **checklist itself** being incomplete (too few mirrors listed). Today's
failure is different and arguably worse: **the checklist was complete and correct, named
`architecture.md` explicitly, and was simply not followed.** The count is the **third** miss in the same
blast radius, not a third instance of the same mechanism. **State it that way; do not claim three
identical failures.**

### Today's measurement

⚠️ **Every figure below was re-measured against the tree at `a351cb6` on 2026-09-16, not carried over
from the hand-off** (`conventions/evidence-before-assertion.md`).

| What | Command | Result |
|---|---|---|
| Ground truth | `ls -d claude/skills/fkit-*/ \| wc -l` | **28** |
| `architecture.md` §1, source-types bullet | reads *"markdown procedures (`claude/skills/fkit-*/SKILL.md`, 26 dirs)"* | **26 — FALSE** |
| `architecture.md` §3, repo-tree comment | reads *"26 /fkit-* skills — the role procedures"* | **26 — FALSE** |
| `architecture.md` §4.2, heading | reads *"### 4.2 The 28 skills — where the procedures live"* | **28 — correct** |
| `architecture.md` §4.2, role/skill table | 9 rows, 28 skill names | **correct — verified identical to disk, set-for-set** |

⭐ **The §4.2 table is NOT drifted, and that is a load-bearing finding.** I extracted its 28 shorthand
names, extracted the 28 `claude/skills/fkit-*/` directory names, sorted both and diffed them: **identical,
zero differences.** ⛔ **So the defect class in scope is the NUMERIC COUNT CLAIMS, not the table.**
A brief that scoped this to "table parity" would be building a guard for a thing that is currently
correct, while leaving the thing that is currently wrong unguarded.

⚠️ **Both false sites are UNDATED.** The dated-claim rule — *a claim is correct as of its date* — would
not excuse them even if it were written down, and
[`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)
records that it is **not** written down. **Not a dependency in either direction.**

### Why a guard and not just the sweep

[`0400`](../0400-sweep-the-stale-count-claims-in-architecture-md-1-7/brief.md) (filed 2026-09-16) sweeps
`architecture.md` §1–§7's count claims. **Its own board row rules the root cause out:**
it records that both false sites are registered mirrors of a checklist that was not followed, and that
*"the root cause (nothing tests the mirror) is OUT OF SCOPE, reported not fixed"*. ⭐ **This row is that
root cause, and nothing else.** `0400` makes the number right once; this makes it stay right.

### Where this test belongs in fkit's own test scope

⚠️ **This is the FOURTH test-scope category — an invariant over the repo's own content — not a new
fifth, and the precedent is already named in the tree.** `test/reference-integrity.test.js:11-16` states
the lineage: ADR-014 §2 fenced the scope at two things, ADR-017 rule 4 widened it to a third, and
`test/task-id-uniqueness.test.js` *"recorded the fourth — an invariant over the repo's own `ai-agents/`
CONTENT rather than over product behavior"*. **This guard is another of that same fourth kind.**
⛔ **No new ADR is needed**; cite the precedent, as those two files each do in their own headers.

The wiki records the standing frame — that fkit's suite has grown *"by ruling, not drift"*, each
addition tracing to a decision. **This one's ruling is the owner ruling quoted above.** Say so in the
test's header comment.

## What to build

**One test that fails when `architecture.md`'s skill-count claims disagree with `claude/skills/fkit-*/`.**

### 1. The assertion

Count the skill directories on disk, then assert **every numeric skill-count claim in
`architecture.md` equals that number**. The three known sites are §1's source-types bullet, §3's
repo-tree comment, and §4.2's heading — **but do not hard-code three call sites.** ⭐ **Find the claims
by pattern, so a fourth site added next sprint is covered the day it is written.** A site-list guard
would have to be updated by hand, which is the exact failure mode this row exists to end.

⚠️ **The pattern is the hard part of this task, and it is where a careless build goes wrong.** It must
match a count claim about skills without matching the many other numbers in the document (7 agents,
CI run counts, ADR numbers, section numbers, the `0142` task IDs). **Report the pattern's precision
explicitly at the plan gate** — say what it matches, what it deliberately does not, and how you know.

### 2. Red-prove it in its own fixtures — ⛔ NOT in `prove-red.sh`

⚠️ **A new guard earns a red-proof; this one earns it in-test, and that is a measured judgement, not a
shortcut.** Checked on disk 2026-09-16: `test/prove-red.sh`'s thirty-nine mutations **all target
executable code** — the launcher, the hook scripts, `dashboard.sh`, `throughput.mjs`, the movers,
`bin/release.mjs`, the skill corpus. ⛔ **Not one targets a repo-content-invariant test.** The four
existing tests of this kind — `task-id-uniqueness`, `reference-integrity`,
`coordination-citation-policy`, `adr-number-uniqueness` — **have zero `prove-red.sh` mutations between
them**; they carry their red-proof as **mutation fixtures built under `os.tmpdir()`**, which is what
`test/reference-integrity.test.js:18-21` describes as the house rule (*"the live corpus is opened
READ-ONLY. Every mutation fixture below is built under os.tmpdir()"*).

**So: build the red-proof as tmpdir fixtures inside the test file** — a fixture `architecture.md` saying
a wrong number must go **red at a named assertion**, and a fixture saying the right number must go green.
⛔ **Do not write into the repo, and never into `ai-agents/wiki-vault/`.**

⚠️ **This is the cheapest-to-reverse call, taken with no owner channel, and it is flagged** — see
`## Notes`. If the plan gate rules that `prove-red.sh` must carry a mutation anyway, that is a small
addition, not a redesign.

### 3. Point the checklist at the guard

Once the test exists, **both copies of the six-place checklist should say so** — a short line noting
that the `architecture.md` entry is now mechanically enforced. ⚠️ **Both copies, in the same commit**:
the block is duplicated verbatim in `claude/skills-for-role.sh` and `claude/fkit-claude.sh`, and
updating one is how the header's own two dated misses happened.

⛔ **Do NOT renumber the checklist from SIX.** No mirror is being added or removed; the count stays six.

### 4. ⛔ Out of scope — named so nobody folds them in

- ⛔ **Do not fix the two false numbers.** That is [`0400`](../0400-sweep-the-stale-count-claims-in-architecture-md-1-7/brief.md)'s
  deliverable. **See the sequencing note in `## Notes` — this guard is expected to land RED.**
- ⛔ **Do not guard the §4.2 role/skill table.** Measured correct today; see the scope-decision flag.
- ⛔ **Do not guard the checklist's other five places.** Same.
- ⛔ **Do not guard the agent count** (*"7 files"*), CI run counts, or any other `architecture.md`
  number. Same class of risk, but not what was ruled.
- ⛔ **No commit, no push. No `ai-agents/wiki-vault/` write**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. **The guard is wired.** `package.json`'s test script is `node --test test/*.test.js && bash test/prove-red.sh`,
   so a new `test/*.test.js` is picked up automatically. Confirm the new file's cases appear in
   `npm test` output by name — **quote the case names from the run**, do not assert it generically.

2. **⭐ Red against the tree as it stands today.** Before `0400` lands, the guard **must fail** on the
   live `architecture.md`, and **fail naming the two false sites**. Paste the failure. ⚠️ **A guard that
   is green today has not been tested — it has been mis-built**, because the defect is present on disk
   right now.

3. **Green after the number is corrected.** In a **tmpdir fixture** (⛔ not by editing the repo), set the
   two counts to 28 and show the guard green.

4. **Red-proof, both directions, at a named assertion.** A fixture with a wrong count goes red **at the
   specific assertion that should catch it** — not merely "some failure"; a fixture with the right count
   goes green. Quote both assertion names.

5. **The pattern's precision is demonstrated, not asserted.** Show that the guard does **not** fire on
   `architecture.md`'s non-skill numbers — the agent count, the CI run counts, the section and ADR
   numbers. ⚠️ **A guard that matches too much gets disabled by the first person it annoys.**

6. **Nothing was written into the repo by the test.** `git status --porcelain` after a full `npm test`
   must show no new or modified file the test created. ⛔ Nothing under `ai-agents/wiki-vault/` at all.

7. **Both checklist copies updated identically** (`## What to build` §3):
   `diff <(sed -n '12,27p' claude/skills-for-role.sh) <(sed -n '259,274p' claude/fkit-claude.sh)` — the
   blocks must still agree. ⚠️ Re-derive the line ranges at build time; they will have moved.

8. **`npm test` is green overall** once `0400` has landed, or **red only at step 2's expected assertion**
   if it has not. ⛔ **State which of the two you are reporting** — an unexplained red is indistinguishable
   from a broken build.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing

### ⚠️ Relationship to `0400` — a SOFT ORDERING, not a dependency

⭐ **Stated plainly, because getting this wrong strands a red suite on `main`.**

⭐ **SETTLED — the two paths below are reasoning, not an open choice: owner ruling 2026-09-16 picks path one, `0400` lands first**; the verbatim option label and the ruling's own words are in *"⭐ Owner rulings 2026-09-16 — the ordering is settled, and the scope stays narrow"* lower in this file.

`0400` fixes the numbers; this row guards them. **Neither needs the other to be built or shipped** —
the guard's pattern-matching logic does not depend on the numbers being right, and `0400`'s sweep does
not depend on a guard existing. ⛔ **So it is not a dependency**, and the `Depends on: nothing` line
above is correct as written.

⚠️ **But the ORDER matters for a merge-able tree.** Land this guard first and `npm test` goes **red on
`main`** until `0400` lands, because the defect it catches is genuinely present. Two acceptable paths,
**the producer's sprint-planning call, not this brief's**:

- **`0400` first** (simplest) — the guard then lands green and step 2's red-proof is demonstrated in a
  tmpdir fixture instead of against the live tree; or
- **This first, both in the same sprint** — the guard lands red **deliberately and loudly**, which is
  the strongest possible proof it is load-bearing, and `0400` turns it green.

⚠️ **Whichever is chosen, `## Verification steps` step 8 requires the builder to SAY which.**

### `0368` and `0371` — checked, and NOT related

⚠️ **Checked on disk 2026-09-16 so the question is not re-raised at the plan gate.** Both concern the
**citation-coordinate rot** class — source-file `path:NNN` line anchors going stale.
[`0368`](../0368-give-the-ownerless-source-file-coordinate-rot-class-an-owner-and-measure-it/brief.md)
gives that class an owner; [`0371`](../0371-cost-widening-the-citation-guards-target-class-to-source-file-coordinates/brief.md)
is an investigation costing whether the citation guard should widen to it. ⛔ **A count claim in prose
disagreeing with the filesystem is a different class entirely.** **No overlap, no dependency, no
coherence obligation.**

### ⚠️ Scope decisions flagged for the owner — all three are producer judgements

⛔ **No owner ruling covers any of the three.** The ruling named *"the skill count"* and nothing more;
each call below took the **cheapest-to-reverse** option, and each is **reversible at the plan gate at
small cost**.

| # | The call | Chosen | Why, and what reverses it |
|---|---|---|---|
| 1 | Skill **count** only, or the whole **role/skill table** and the checklist's other five places? | **Count only** | The table was **measured correct today** (28/28, set-identical). Guarding a correct thing while the wrong thing stays unguarded is the wrong trade, and a table-parity guard is a materially harder build (shorthand names, no `fkit-` prefix, prose cells). **Reversal: a follow-up brief.** ⚠️ Honest caveat: the table is **exactly as unguarded as the count was**, and it is one edit away from the same failure. |
| 2 | Does it need a **`prove-red.sh`** mutation? | **No — in-test tmpdir fixtures** | Measured: all 39 mutations target executable code; the four sibling content-invariant tests carry **zero** between them and red-prove in their own fixtures. **Reversal: add one mutation.** ⚠️ The repo rule *"a new guard earns a red-proof"* is **satisfied, not waived** — `## What to build` §2 and verification step 4 require it. |
| 3 | Owner field | **`fkit-coder`** | It ships a `test/*.test.js` file — the coder is the sole source-write authority, and ADR-044 Decision 1 puts the Build role there. ⚠️ **This field is itself an instance of what [`0402`](../0402-settle-what-the-owner-field-means-when-it-disagrees-with-adr-044s-build-role/brief.md) is filed to settle**, and will re-raise it at the plan gate — as `0402`'s row already predicts of every new row. |

### One unit, deliberately not decomposed

**This is one shippable unit and the split test fails cleanly.** The assertion, its red-proof fixtures
and the two checklist pointers cannot be developed, tested or shipped apart: the fixtures are the
guard's own proof (a guard shipped without them is the *"never failed, so never tested"* case the repo
explicitly refuses), and a checklist line promising mechanical enforcement that does not yet exist is a
**false statement shipped into the launcher** — the precise failure its own header records from
2026-07-18. ⛔ **The three widenings in the flag table are NOT sub-tasks and were deliberately not
filed** — nothing has ruled them wanted, and filing unfounded briefs is worse than naming them here.

### ⛔ Fences

- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  — filed **unranked** (`—`) and **appended last**, renumbering and inserting nothing.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, producer-only, carrying
  `(agent-closed — not owner-verified)` if the owner is absent.
- ⛔ **No commit, no push.**

### ⭐ Owner rulings 2026-09-16 — the ordering is settled, and the scope stays narrow

Both rulings were given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9 wrap-up),
verbatim option labels quoted. Recorded by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
relaying rulings the lead session captured.

**1. Sequencing — verbatim option label "0400 first, then 0403 (Rec)".** The ruling's own words:

> *"Fix the counts, then add the guard. main never goes red. Recorded as a soft ordering note on both
> briefs, not a dependency."*

⭐ **This settles the two-path choice in *Relationship to `0400`* above: path one — `0400` first.**
[`0400`](../0400-sweep-the-stale-count-claims-in-architecture-md-1-7/brief.md) lands **before** this
row, because this guard landing first turns `npm test` **red on `main`** until `0400` lands — the
defect it catches is genuinely present on disk today. ⛔ **Still NOT a dependency:**
`Depends on: nothing` above stays correct as written, and nothing above this note changes.
⚠️ `## Verification steps` step 8 still requires the builder to **say which** case it is reporting;
under this ruling it should be the green case, with step 2's red-proof demonstrated in a **tmpdir
fixture** rather than against the live tree.

**2. Scope — verbatim option label "Counts only (Rec)".** The ruling's own words:

> *"Keep 0403 narrow. The table is correct today, so guarding it is new work, not a repair. It can be
> widened at the plan gate if the coder finds it cheap."*

⭐ **This converts scope-decision flag 1 from a producer judgement into an owner ruling.** Scope stays
**numeric skill-count claims only**; §4.2's role/skill table was measured identical to disk on
2026-09-16 (28 names, 28 directories, set-for-set), so guarding it is **new work, not a repair**, and
is out of scope here. ⚠️ **The owner left one door open:** the coder **may propose widening at the
plan gate** if it proves cheap — and **the owner decides there**, not the builder. ⛔ The honest caveat
in flag 1 stands unchanged: the table is exactly as unguarded as the count was.
