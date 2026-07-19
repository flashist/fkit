# Design — the task-folder structure and the global task-ID scheme

- **Date:** 2026-07-19
- **Author:** fkit-architect
- **Task:** [`design-task-folder-structure-and-id-scheme.md`](../../tasks/backlog/design-task-folder-structure-and-id-scheme.md) (Sprint 2, priority 74)
- **Status:** draft — **awaiting owner approval.** An adversarial pass is recommended before approval
  (the brief's own Notes); this change is irreversible in practice once the tree has moved.
- **Consulted:** fkit-producer (sequencing / decomposition context only; the technical decisions here
  are the architect's)

---

## 0. Corrections to the brief, up front

Three of the brief's stated facts are stale. None of them changes the shape of the design, but two
change what the implementer must do, so they are recorded first rather than in a footer.

| Brief says | Measured 2026-07-19 | Consequence |
|---|---|---|
| **89 briefs** (12 backlog · 66 done · 11 cancelled) | **94 briefs** (16 backlog · 67 done · 11 cancelled) | Registry sizing and every "exactly 89" verification step in tasks 75–78 must be re-derived, not trusted. Do not hardcode a count — derive it. |
| **Task 64 collides** with this change and "the design must state the ordering" | **Task 64 is Done** (`tasks/done/implement-spawned-invocation-for-task-movers.md`, `✅ Done (agent-closed — not owner-verified)`) | **There is no ordering to state.** §9.1 records this explicitly so task 76 does not go hunting for a rule that does not exist. |
| **13 product source files** construct/parse task paths | **21 files under `claude/`** reference `tasks/` paths, plus 4 test files and 2 `reviews/README.md` copies | The sweep is larger than scoped. §8 lists the measured set and names the additions. |

Counts reproduced with:

```sh
ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l          # 94
grep -rl 'tasks/' claude/ | wc -l                                  # 21
```

**Task 64's closure was agent-side, not owner-verified.** If it proves wrong, the fix lands in the same
two mover skills this migration rewrites. Low risk, but it is a known unverified dependency, not a
clean one.

---

## 1. Goal & context

Today a task **is one file**: `ai-agents/tasks/<board>/<slug>.md`. Everything else a task produces
lives in a different top-level directory, keyed by a different identifier:

```
ai-agents/tasks/backlog/build-the-thing.md      the brief
ai-agents/plans/build-the-thing.md              the approved plan     (ADR-020)
ai-agents/worklogs/build-the-thing.md           the worklog           (ADR-020)
ai-agents/reviews/build-the-thing.md            the review ledger     (reviews/README.md)
                                                reference assets — no home at all
```

Four homes, one task, and the key holding them together is a **slug that can change**.

This design converts a task into a **folder** — `ai-agents/tasks/<board>/<ID>-<slug>/` — holding the
brief and every artifact, keyed by a **permanent global ID** that nothing renames.

**This is not a new direction.** [ADR-020](../decisions/adr-020-per-task-plan-and-worklog-artifacts.md)
§Decision 6 already recorded it as the intended end state:

> **Intended future direction (recorded, not built here):** collapse the brief, plan, worklog, and
> review ledger into a single **per-task folder `ai-agents/tasks/<task-id>/`** holding all of a task's
> files. Today's separate top-level dirs are a known stepping stone toward that.

This design executes that recorded direction. It diverges from ADR-020's sketch in one respect — the
owner's ruling puts the board back in the path (`<board>/<ID>-<slug>/`, not a flat `<task-id>/`),
which preserves the board-as-directory model every existing tool and drift rule depends on. That is
the right call and §5.2 explains why.

### Success criteria

1. A task's brief, plan, worklog, review ledger and assets sit in one directory.
2. Every task has a permanent, unique, never-reused ID.
3. `dashboard.sh` and both movers locate briefs correctly, with **no new drift records** on a tree
   that had none before.
4. The change is revertible by a single git operation that does not depend on an uncommitted tree.

### Locked inputs — implemented, not re-litigated

The brief's three owner rulings are inputs. This design implements all three. Where one creates a
technical cost, that cost is **named as a finding** (§11) rather than silently substituted:

1. A new global sequential ID **plus a registry**.
2. All briefs migrate in one pass — no dual-format period.
3. Wiki-vault links are repaired by a separate `fkit-wiki` task.

---

## 2. The three things that silently break

This is the part the brief correctly identifies as the risk, and it is worse than "the movers need new
paths." Three mechanisms break **without erroring**, and one destroys data.

### 2.1 `found_dir` becomes the slug — every row reports false drift

`dashboard.sh:535` derives the board a brief lives in from its **parent directory**:

```sh
found_dir=$(basename "$(dirname "$brief_path")")
```

Today `dirname(ai-agents/tasks/backlog/foo.md)` → `backlog`. ✅

Under folders `dirname(ai-agents/tasks/backlog/0042-foo/brief.md)` → `0042-foo`. ❌

`found_dir` becomes the **folder name**, never `backlog`/`done`/`cancelled`. It is then compared
against `expected_dir()` (`dashboard.sh:242-249`, which only ever returns those three values) at
**`dashboard.sh:667` and `dashboard.sh:681`**:

```sh
[ -n "$exp" ] && [ -n "$found_dir" ] && [ "$found_dir" != "$exp" ] && bad=1
```

The comparison can never again succeed. **Every row on every board reports `drift disagreement`**, and
because drift forces a row to render (`dashboard.sh:747-749`), the open-work filter is defeated too —
the board returns to showing all 94 rows, all flagged. The script exits 0. Nothing warns.

**Fix:** the board is the **grandparent** under the new layout.

```sh
found_dir=$(basename "$(dirname "$(dirname "$brief_path")")")
```

### 2.2 Link-rot recovery dies — `brief.md` is not a unique key

`dashboard.sh:536-546` is the recovery path built by sprint tasks 21/22: when a sprint row's href is
stale, find the brief by **filename** across the three boards.

```sh
fname=$(basename "$linked")            # today: "foo.md" — unique across the tree
for cand in backlog done cancelled; do
  if [ -f "$AGENTS/tasks/$cand/$fname" ]; then ...
```

Under folders every brief is named `brief.md`. `$AGENTS/tasks/backlog/brief.md` does not exist — the
brief is at `backlog/0042-foo/brief.md`. So the loop **never matches**, and every task whose href is
stale reports `missing-brief` instead of relocating. The entire link-rot repair capability — two
sprint tasks' worth of work — silently stops functioning.

**Fix:** the recovery key becomes the **folder name**, which is ID-bearing and unique:

```sh
folder=$(basename "$(dirname "$linked")")     # "0042-foo"
for cand in backlog done cancelled; do
  if [ -f "$AGENTS/tasks/$cand/$folder/brief.md" ]; then
    brief_path="$AGENTS/tasks/$cand/$folder/brief.md"; found_dir="$cand"; break
  fi
done
```

This is strictly **better** than today's rule: the folder name carries the immutable ID, so recovery
survives a slug rename, which the filename key never did.

### 2.3 Every review ledger collapses onto one file — data loss

This is the one that destroys data, and the brief does not anticipate it.

`ai-agents/reviews/README.md:24-30` defines the ledger key — a rule both `fkit-reviewer` and
`fkit-coder` must derive **identically or the ledger forks**:

> 2. Else the task file's **basename without extension**
>    (`ai-agents/tasks/**/<task-id>.md` → `<task-id>`).

Under folders every brief's basename is `brief`. Rule 2 therefore resolves **every task in the project**
to the same id, and every review ledger in the repo writes to **`ai-agents/reviews/brief.md`**. Round 2
of task B overwrites round 1 of task A. The loop-prevention memory — the ledger's entire reason for
existing — is destroyed silently, and the failure mode is two agents agreeing perfectly on the wrong
file.

**Fix:** absorb the ledger into the task folder (§5.4) and rewrite rule 2 to key on the **folder name**.
`reviews/README.md` exists in both homes (`ai-agents/` and `claude/scaffold/ai-agents/`) and ADR-027
requires both be edited in the same change.

---

## 3. The ID scheme

### 3.1 Format

```
NNNN            four digits, zero-padded, no prefix
0001 … 9999
```

- **Four digits.** 94 tasks today. Three digits caps at 999, which a long-lived project can plausibly
  exceed; four is free insurance. Five is noise.
- **Zero-padded**, so lexical sort equals numeric sort — `ls`, `git`, and `LC_ALL=C sort` all agree
  without special-casing. `dashboard.sh:42` already pins `LC_ALL=C` for exactly this class of
  determinism.
- **No prefix.** A `T-` or `FKIT-` prefix carries no information the path `tasks/…` does not already
  give, and it lengthens every reference.
- **Overflow is a real boundary, not a hypothetical:** ID 10000 breaks lexical-equals-numeric sort. At
  four digits that is ~100× the current corpus, so it is accepted, but it is a **stated limit** rather
  than an unexamined assumption.

### 3.2 The allocation rule — this matters more than the format

An ID collision is permanent and unrecoverable. The rule:

> **Next ID = 1 + the highest ID that has ever existed, across all three boards. IDs are never reused,
> never renumbered, and never recycled from a cancelled task.**

- **Scan all three boards, never just `backlog/`.** A cancelled task keeps its ID forever; its
  artifacts and inbound links still reference it. Allocating from `backlog/` alone would reissue the ID
  of a task that still exists in `cancelled/`.
- **Never renumber.** The ID's only job is to be stable. A renumbering pass would invalidate every
  inbound link — the exact cost this migration is paying once, deliberately.
- Derivation (post-migration; the folder names are the ground truth):

```sh
ls -d ai-agents/tasks/{backlog,done,cancelled}/*/ 2>/dev/null \
  | xargs -n1 basename | sed -n 's/^\([0-9]\{4\}\)-.*/\1/p' \
  | LC_ALL=C sort | tail -1
```

### 3.3 The race, honestly stated

Two sessions on the same working tree, allocating in sequence, cannot collide — the first folder exists
before the second is created.

**Two sessions on different git branches can.** Both read max=0094, both create `0095-…`, and the
branches merge **cleanly** — different folder names, no textual conflict. Git will not catch this.

Options weighed:

| Option | Verdict |
|---|---|
| Lock file / reservation protocol | **Rejected.** Real machinery for a single-owner prototype; a stale lock is a worse failure than the collision. |
| Content-derived ID (hash of slug) | **Rejected.** Not sequential — the owner's ruling requires sequential — and unreadable. |
| Detect, don't prevent | **Chosen.** A duplicate-ID assertion in the test suite; the offender is renamed before anything links to it. |

**Chosen: detect.** A duplicate-ID assertion joins the `node --test` suite (ADR-014), and IDs are
cheap to renumber *before* they are referenced — which is precisely the window a merge exposes. This
is a **residual risk that is accepted, not eliminated**, and it is recorded in the ADR's consequences
so a future reader does not mistake it for an oversight.

### 3.4 Assigning IDs to the 94 existing tasks

The brief's verification bar: *two people applying the rule to the same corpus produce identical IDs.*
That rules out any rule requiring judgment.

| Candidate ordering | Verdict |
|---|---|
| Chronological by git first-commit | **Rejected.** Requires archaeology; ties on shared commits; not reproducible without the exact repo state. |
| Sprint + priority | **Rejected.** This is the collision the ID exists to fix — Sprint 1 and Sprint 2 each have a task 46. |
| Board, then alphabetical | **Rejected.** Bakes board membership into the ID; two people disagree the moment a task moves mid-assignment. |
| **Slug, `LC_ALL=C`-sorted, board-blind** | **Chosen.** |

**The rule:**

> Take all 94 brief paths. Sort by **slug alone** (the basename without `.md`), ascending, under
> `LC_ALL=C`. Assign `0001`…`0094` in that order. Board membership is ignored entirely.

Reproducible byte-for-byte:

```sh
for b in backlog done cancelled; do
  for f in ai-agents/tasks/$b/*.md; do [ -f "$f" ] && basename "$f" .md; done
done | LC_ALL=C sort | nl -w4 -n rz -s' '
```

**Verified precondition:** all 94 slugs are unique across the three boards — checked with
`… | LC_ALL=C sort | uniq -d`, which returns empty. The sort is therefore total and has no tie-break
case. *(If a future corpus does collide, the rule needs a documented tie-break; today it does not, and
inventing one now would be untested code.)*

**Closed tasks are numbered.** All 94, not just the 16 open ones. Their plans, worklogs and ledgers are
keyed by the same identifier, and 78 unaddressable tasks would defeat the point.

### 3.5 `## ID` is a brief field — forced by task 75, not chosen

The brief leaves this open: does the folder name carry the ID alone, or does the brief also record it?

**Task 75 settles it.** Its scope is *"assign IDs and create the registry — **no file moves, no folder
creation**"*, and task 76 does the moving. So between 75 and 76 the folders **do not exist**. If the
folder name were the sole carrier, task 75 could not record an ID anywhere and would be impossible as
scoped.

> **`## ID` is a field on every brief.** The folder name is authoritative once folders exist; the field
> is the redundant second carrier.

Two carriers means they can drift — and fkit's established answer to exactly that is not "pick one," it
is **carry both and lint the disagreement**: `## Status` already duplicates the sprint board's status
cell, and `dashboard.sh`'s drift rule 3 (`dashboard.sh:676-687`) exists solely to reconcile them. This
design follows that precedent rather than inventing a new stance:

> `dashboard.sh` gains an **`id-mismatch`** drift kind: the brief's `## ID` disagreeing with its folder
> name is a drift record, exactly as a status disagreement is.

Field placement — immediately after the H1, before `## Sprint`:

```markdown
# Build the export endpoint

## ID
0042

## Sprint
Sprint 2

## Priority
14
```

### 3.6 The registry

The owner's ruling names a registry, so there is one. But a stored list of facts derivable from the
tree is a **second source of truth**, and this project has paid for that lesson repeatedly (ADR-018's
skill-ownership reconciliation; `dashboard.sh`'s "one grammar" comments at lines 111-126 and 308-313).

The containment is ADR-027's own pattern — **convention plus mechanical test**:

> **`ai-agents/tasks/registry.md`** — a **generated, committed, non-authoritative index**. One row per
> task: ID · slug · board · title. Regenerated by script from the tree; a test asserts it matches.
> **Authority always rests with the folder name and the brief's `## ID`.** If the registry and the tree
> disagree, the tree is right and the registry is stale.

It sits beside `backlog/`, `done/`, `cancelled/`. `dashboard.sh`'s tree-walk (`dashboard.sh:59-64`)
keys on those three directories existing, so a sibling file does not perturb it.

**Finding for the owner (§11.1):** I would not build the stored registry at all — the tree already
answers every question it answers, and a generated file is one more thing to drift. It is specified
here because the ruling named it, defined in the least drift-prone way available. Dropping it is a
one-line change to this design.

### 3.7 `## Priority` survives — as board rank only

Left open by the brief, deliberately not pre-judged. The answer:

> **`## Priority` stays. It is board rank, not identity.** The ID is identity. They are genuinely
> different concepts and neither substitutes for the other.

Evidence that they are already distinct in practice: the Backlog board writes `## Priority:
Unscheduled` with a `—` cell (`fkit-task-brief/SKILL.md:116,153`) — tasks that have identity but no
rank. Priority is also **mutable by design** (re-ranking a sprint) while the ID must never move.

The real gain is a code simplification. `dashboard.sh` currently reverse-engineers a task identifier
out of the **Priority cell** (`task_id()`, `dashboard.sh:451-453`), with a filename-stem fallback for
the unranked Backlog board and a `?` sentinel beyond that (`dashboard.sh:506-529`) — ~24 lines of
commented-around workaround, each clause paid for by a defect (a space in a filename splitting one task
into two; glob metacharacters expanding against the CWD).

> Under this design `dashboard.sh` reads the **ID** from the folder name. The Priority cell becomes
> purely presentational, and the `tid` fallback chain collapses to a single unambiguous lookup.

The `?` sentinel and the `set -f` glob guard (`dashboard.sh:34-40`) should be **kept** regardless — a
malformed row must still be representable.

---

## 4. The folder layout

```
ai-agents/tasks/<board>/<NNNN>-<slug>/
├── brief.md          REQUIRED — the task brief. Always present.
├── plan.md           optional — the approved implementation plan     (ADR-020)
├── worklog.md        optional — the ship-loop worklog                (ADR-020)
├── review.md         optional — the two-party review ledger
└── assets/           optional — reference material, screenshots, fixtures
```

Worked example:

```
ai-agents/tasks/done/0042-build-the-export-endpoint/
├── brief.md
├── plan.md
├── worklog.md
└── review.md
```

- **`brief.md` is the reserved brief filename.** Fixed, not `<slug>.md` — the slug is already in the
  folder name and repeating it makes every path redundant and rename-fragile. This is safe **only
  because** §2.3's ledger-key rule is rewritten in the same change; without that it is the data-loss
  bug.
- **`brief.md`, `plan.md`, `worklog.md`, `review.md`, `assets/` are reserved names.** A future artifact
  type takes a new reserved name; tools must not treat unknown files as briefs.
- **A folder with only `brief.md` is the normal case** — 78 of the 94 tasks will have exactly that, and
  it needs no marker, no placeholder, and no special handling. A folder **without** `brief.md` is
  malformed and should be reported as drift.

### 4.1 The `.gitkeep` question

The brief flags that an empty task folder is not representable in git. **It never arises**: a task
folder always contains `brief.md`, so it is always non-empty, so it never needs a `.gitkeep`.

> **The scaffold is unchanged.** `claude/scaffold/ai-agents/tasks/{backlog,done,cancelled}/.gitkeep`
> stay exactly as they are — the three board directories still ship empty and still need their keeps.

This also means **no test change** for the keep rule. `test/converge-contract.test.js` Group C rule 4
derives the keep list from the scaffold manifest rather than a hardcoded list
(`converge-contract.test.js:135-143`), so an unchanged scaffold is an unchanged assertion. ADR-027
parity holds for free.

---

## 5. What gets absorbed

### 5.1 The brief under-scopes this

The brief asks only whether `ai-agents/reviews/` is absorbed. But ADR-020 keys `plans/`, `worklogs/`
**and** `reviews/` by the identical `<task-id>` — they are one question, not one plus two others.
Answering only for `reviews/` would leave two directories keyed by slug while briefs are keyed by ID:
the two-grammar problem, freshly installed.

> **All three are absorbed.** `reviews/`, `plans/`, and `worklogs/` fold into the task folder as
> `review.md`, `plan.md`, `worklog.md`. Three top-level directories disappear.

ADR-020 §Decision 6 pre-authorizes exactly this, naming all four artifacts.

**Measured volume:** 22 ledgers + 11 plans + 11 worklogs = **44 files** beyond the 94 briefs. Tasks
75–78 do not currently account for these.

### 5.2 Why the board stays in the path

ADR-020 §6 sketched a flat `ai-agents/tasks/<task-id>/`. The owner's ruling keeps the board:
`<board>/<ID>-<slug>/`. **The ruling is right**, and not merely by authority:

- The board-as-directory *is* the task's status in the data model. `expected_dir()`
  (`dashboard.sh:242-249`) and drift rule 3 cross-check the brief's `## Status` against its **location**
  — a genuine second source that catches a brief whose status was edited without moving it.
- A flat layout would delete that cross-check and make status single-sourced to a text field.
- The movers (`git mv` between board directories) keep working as they do today.

The cost is that a task's path changes when it closes — which is already true today and already
handled by the link-rot machinery of §2.2.

### 5.3 Consequence for the stateful-review skills

Two skills round-trip through the ledger and both derive its path:

- `claude/skills/fkit-stateful-review/SKILL.md` (reviewer writes findings)
- `claude/skills/fkit-process-stateful-review/SKILL.md` (coder writes verdicts)

Both must change from `ai-agents/reviews/<task-id>.md` to `<task-folder>/review.md`, **in the same
change** — if they diverge, the ledger forks and the loop-prevention memory splits, which is the exact
failure `reviews/README.md` opens by warning about.

The canonical key rule (`reviews/README.md:24-30`) becomes:

1. Explicit task-id in the invocation → use it verbatim.
2. Else **the task folder name** (`ai-agents/tasks/**/<NNNN>-<slug>/` → `<NNNN>-<slug>`).
3. Else the current git branch name, slugified.
4. If none resolves unambiguously → **stop and ask the owner.** Never invent one.

Only rule 2 changes. Rules 1, 3 and 4 are untouched.

`ai-agents/reviews/README.md` and `claude/scaffold/ai-agents/reviews/README.md` are dual-homed;
ADR-027 requires both be edited together. The README's content moves to
`ai-agents/tasks/README.md` (both homes) since `reviews/` ceases to exist.

---

## 6. The new brief-location contract

This is the part the brief correctly says "silently breaks." Stated precisely, for `dashboard.sh` and
both movers.

**Today:** a sprint row's href points at a **file**; the basename is the recovery key.

**Under this design:** a sprint row's href points at a **`brief.md` inside a folder**; the **folder
name** is the recovery key and the board is the **grandparent**.

```
../tasks/backlog/0042-build-the-export-endpoint/brief.md
        ^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^
        board    folder name = recovery key      fixed
        (grandparent of brief.md)                filename
```

### 6.1 `dashboard.sh` — the five sites

| # | Site | Today | Must become |
|---|---|---|---|
| 1 | `:533` primary resolve | `[ -f "$PLAN_DIR/$linked" ]` | unchanged (hrefs updated by task 76) |
| 2 | `:535` board detection | `basename $(dirname $brief_path)` | `basename $(dirname $(dirname $brief_path))` — **§2.1** |
| 3 | `:536-546` link-rot recovery | scan by `$fname` | scan by folder name — **§2.2** |
| 4 | `:549-552` corrected link | renders `$fname` | renders `<folder>/brief.md` |
| 5 | `:451-453`, `:506-529` id derivation | Priority cell → filename stem → `?` | the ID from the folder name — **§3.7** |

Sites 2 and 3 are the silent ones. Sites 1, 4 and 5 fail visibly.

The script's **stated contract is unchanged** — pure function of (plan path, the briefs it links) →
(stdout, exit code); reads nothing else; writes nothing (`dashboard.sh:24-28`). Only path construction
changes.

### 6.2 The movers

`fkit-task-done` / `fkit-task-cancelled` change in three places each:

1. **Resolve the argument.** Accept a folder path, a `brief.md` path, or a bare slug/ID. Today's rule —
   *"a bare filename → look in `ai-agents/tasks/backlog/`"* (`fkit-task-done/SKILL.md:54`) — becomes a
   folder lookup, and an **ID prefix alone (`0042`) should resolve**, since that is the stable handle.
2. **The move.** `git mv ai-agents/tasks/backlog/<folder> ai-agents/tasks/done/<folder>` — the whole
   directory, moving the brief and all artifacts as one unit. This is a **strict improvement**: today
   the brief moves and its plan/worklog/ledger stay behind in three other directories.
3. **The reference sweep.** `fkit-task-done/SKILL.md:85-94` greps for the brief's **basename**. Under
   folders that is `brief.md` for every task and matches nothing useful. **The sweep key becomes the
   folder name** — which, being ID-bearing, is a *better* key than the slug ever was.

Point 3 is a fourth silent break, in the movers rather than the dashboard: an unchanged sweep would
report "no references found" for every task and quietly stop repairing sprint rows.

---

## 7. Migration & rollback

### 7.1 Sequence

Follows the producer's existing decomposition (tasks 75–78), which this design endorses. The split is
load-bearing: **the irreversible step is isolated from the atomic one.**

```
75  assign IDs + registry        no file moves — reviewable against an unchanged tree
                                 ↓
76  move 94 folders + 44 artifacts + 21 tooling files + sprint hrefs
                                 ↓  ← THE POINT OF NO RETURN
        ┌────────────────────────┴────────────────────────┐
77  repair links outside the wiki                    78  wiki sync + structural re-description
    (knowledge-base, brief↔brief)                        (fkit-wiki only — hard rule)
```

- **Do not collapse 75 into 76.** That would put the irreversible step (ID assignment) inside the
  atomic one, and lose the ability to review IDs on their own.
- **76 is atomic by necessity.** The instant files move, `dashboard.sh` stops finding briefs and both
  movers stop finding rows. Sprint-board hrefs belong in 76 for the same reason — `dashboard.sh` reads
  them to locate briefs.
- **77 and 78 run in parallel.** They cannot merge: only `fkit-wiki` writes the vault.

### 7.2 Rollback

The brief requires a procedure that does not depend on an uncommitted working tree.

```
BEFORE task 76:   owner commits the tree, then tags it
                  git tag pre-task-folder-migration

TASK 76:          all moves via `git mv` (preserves rename detection, so the diff
                  reads as renames rather than 94 deletes + 94 creates)
                  owner commits as ONE commit

ROLLBACK:         git revert <migration-sha>          (history-preserving — preferred)
             or   git reset --hard pre-task-folder-migration   (discards forward work)
```

**The procedural precondition, stated plainly:** fkit's universal hard rule is that agents never commit
unprompted. So **the owner must perform both commits and the tag.** No agent can create the rollback
point, which means task 76's brief must instruct the owner to do it **before** the agent starts. If
that step is skipped, the rollback story does not exist — the change would live entirely in an
uncommitted tree, which is exactly what the brief forbids.

**Task 75 needs no tag** — it adds a file and edits fields, and is undone by reverting content.

### 7.3 The migration is mechanical — script it, don't hand-edit

94 folder creations, 138 file moves and ~300 link rewrites are past the scale where hand-editing is
credible. The implementer should generate the moves from the §3.4 rule, apply with `git mv`, and rewrite
links with a scripted pass — then verify with §10, not by reading the diff.

---

## 8. Blast radius — measured

```sh
grep -rl 'tasks/' claude/ | wc -l     # 21 (brief said 13)
```

**Path-constructing / parsing (the ones that break):**

`fkit-claude-init.sh` · `agents/fkit-coder.md` · `agents/fkit-producer.md` ·
`fkit-initiate-project` · `fkit-plan-task` · `fkit-status/SKILL.md` · `fkit-status/dashboard.sh` ·
`fkit-task-brief` · `fkit-task-done` · `fkit-task-cancelled` · `fkit-task-ship-loop` ·
`fkit-wiki-ingest` · `fkit-wiki-sync`  *(the brief's 13)*

**Beyond the brief's 13:**

| File | Why |
|---|---|
| `fkit-stateful-review/SKILL.md` | ledger path — §5.3 |
| `fkit-process-stateful-review/SKILL.md` | ledger path — §5.3 |
| `fkit-design-spec/SKILL.md` | references task paths |
| `agents/fkit-architect.md` | references task paths |
| `fkit-team/SKILL.md` | references task paths |
| `ai-agents/reviews/README.md` | the ledger-key rule — **§2.3, the data-loss bug** |
| `claude/scaffold/ai-agents/reviews/README.md` | dual-homed — ADR-027 |
| `claude/scaffold/ai-agents/README.md` | describes the tasks tree |
| `claude/scaffold/ai-agents/wiki-vault/schema.md` | task-page schema |
| `test/dashboard-contract.test.js` | fixtures build `tasks/<board>/<slug>.md` (`:37`, `:88-93`, …) |
| `test/converge-contract.test.js` | fixtures at `:41-42` |
| `test/prove-red.sh` | mutation harness |
| `test/harness.mjs` | fixture construction |

**Inbound documentation refs (measured):** `sprints/` 99 · `wiki-vault/` 98 · `knowledge-base/` 59 ·
`reviews/` 41 · brief↔brief 12. **≈309 total** — of which the 98 vault refs are task 78's, by hard rule.

---

## 9. Sequencing rulings

### 9.1 Against task 64 — **there is no ordering to state**

The brief instructs this design to state the ordering against task 64 because both rewrite the same two
mover skills. **Task 64 is already Done** (`tasks/done/implement-spawned-invocation-for-task-movers.md`,
`✅ Done (agent-closed — not owner-verified)`; ADR-025 shipped from it).

> **Ruling: the collision no longer exists.** The mover skills are in their post-64 state; this
> migration rewrites *that* text. Task 76 must not look for an ordering rule — there is none.

Two stale warnings still assert the collision and should be corrected (producer-owned, flagged not
done): sprint-2 row 74, and the "⚠️ Task 64 collides with this task" note in
`migrate-tasks-to-folder-structure-and-update-tooling.md`.

**Caveat:** 64 closed agent-side, not owner-verified. If it proves wrong, the fix lands in the two
files this migration rewrites.

### 9.2 Against the six queued wiki-syncs — **they wait, and batch into task 78**

Tasks 45, 51, 66, 69, 71, 73 are all `fkit-wiki`-owned and all describe task-board mechanics. All six
are unblocked; nothing gates them but scheduling.

> **Ruling: all six wait for the migration and batch into task 78's run.**

Running them first means the wiki role writes those pages twice and the first pass is invalidated by 76
— and worse, the vault would then carry a *verified-knowledge* description of a structure that is about
to change. This repo already learned this in Sprint 2 task 11: *"Task 11 (wiki sync) is genuinely last.
Syncing before the docs are rewritten just ingests the drift into the vault — and then it's wrong in
two places, with the vault carrying the authority of 'verified knowledge.'"* Task 73's brief already
anticipates batching (*"may batch with 71 in one run"*), so this extends existing intent.

**The tradeoff, stated:** the vault stays stale on six landed changes for the whole migration window.
Acceptable — the staleness is *missing recent features*, not *actively wrong*. After 76 it becomes
actively wrong, which is why 78 cannot also wait.

This changes six briefs' effective scope, so it is the owner's call to confirm (§11.2).

---

## 10. Verification

Task 76 is verified by **behavior**, not by reading the diff.

**Pre-flight (task 75, unchanged tree):**
- Registry entry count == `ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l`. **Derive it — do
  not trust 89 or 94.**
- IDs unique: `… | LC_ALL=C sort | uniq -d` returns empty.
- Bijection both directions: every entry maps to an existing brief; every brief appears exactly once.
- Re-deriving §3.4 from scratch reproduces the assignment byte-for-byte.
- `git status` shows **no** renames or deletions under `ai-agents/tasks/` — content edits + the registry
  only.
- **The dashboard reports the same counts as before, with no new drift** — proving the `## ID` field did
  not disturb `## Status` parsing.

**Post-migration (task 76):**
- `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` → **no new drift
  records** vs. the pre-migration baseline. *Capture that baseline before starting* — it is the only
  way to tell a pre-existing drift from one the migration caused.
- The §2.1 regression specifically: **assert no row reports `drift disagreement` on location.** If
  `found_dir` was missed, all 94 rows do.
- The §2.2 regression: a fixture with a deliberately stale href must still resolve and emit
  `drift relocated`, not `missing-brief`.
- The §2.3 regression: two different tasks must resolve to two **different** ledger paths.
- Both movers, end to end: `/fkit-task-done` on a real task moves the **whole folder** and repairs the
  sprint row.
- `node --test test/` green; `test/prove-red.sh` still proves the suite load-bearing.
- No path anywhere still matches `tasks/(backlog|done|cancelled)/[a-z0-9-]+\.md`.

**New assertions to add:**
- duplicate-ID detection (§3.3) — the accepted-risk mitigation.
- `id-mismatch` drift: brief `## ID` ≠ folder name (§3.5).
- malformed folder: a task folder without `brief.md`.
- registry-matches-tree (§3.6).

---

## 11. Open questions — owner decisions

### 11.1 The stored registry — I recommend against it

Ruling 1 names "a registry," so §3.6 specifies one. **My technical recommendation is not to build the
stored file.** The folder names and `## ID` fields already answer every question it answers; a
generated committed file is a third carrier that can drift, and this project has paid for that lesson
at least three times. Per the brief's own instruction, this comes back as a finding rather than a silent
substitution.

- **Keep it** (as specified): honors the ruling; drift contained by a test.
- **Drop it:** one-line change here; task 75 becomes "add `## ID` to 94 briefs + write the allocation
  procedure."

### 11.2 Confirm the wiki-sync batching

§9.2 rules that tasks 45, 51, 66, 69, 71, 73 fold into task 78's run. This changes six briefs' effective
scope — the owner's call, not mine.

### 11.3 Should task 64 be owner-verified first?

It closed agent-side. Its output is two of the files this migration rewrites. Verifying before the
migration is cheap; after, its diff is buried under a path sweep.

### 11.4 Absorbing `plans/` and `worklogs/` widens tasks 75–78

§5.1 adds 44 files that tasks 76–77 do not currently account for. Confirm the widened scope, or rule
that `plans/` and `worklogs/` stay put for now — in which case they remain slug-keyed while briefs are
ID-keyed, and that inconsistency should be recorded deliberately rather than left as an accident.

### 11.5 The stale counts in tasks 75–78

Every one of those briefs says 89; the real number is 94 and will move again before they run. Their
verification steps should say *"derive the count"* rather than name one. Producer-owned.

---

## 12. Alternatives considered

| Alternative | Why rejected |
|---|---|
| **Keep one file per task; add an ID prefix to the filename** (`0042-build-thing.md`) | Solves identity, not cohesion — plan/worklog/ledger stay in three other directories, which is the problem the owner asked to fix. Cheaper, and genuinely a fallback if the folder move proves too risky. |
| **Flat `tasks/<ID>-<slug>/`, board as a brief field** (ADR-020 §6's sketch) | Deletes the location↔status cross-check that drift rule 3 depends on (§5.2), making status single-sourced to a text field. The owner's board-in-path ruling is better. |
| **Dual-format transition period** | Explicitly excluded by ruling 2 — and correctly: every tool would need to handle both layouts, doubling the surface where §2's silent breaks can hide. |
| **Content-hash IDs** | Not sequential (violates ruling 1); unreadable; no ordering. |
| **Defer the migration; fix only the artifact scatter** | Leaves the slug as the join key, so a rename still orphans artifacts. Treats the symptom. |

---

## 13. What this design does not decide

- **The exact link-rewriting script** for task 76 — implementation, the coder's.
- **Wiki page restructuring** — task 78, `fkit-wiki`'s by hard rule.
- **Whether `assets/` needs sub-conventions** — deferred until a task actually has assets. Naming it
  reserved now costs nothing; specifying its interior before there is a use case is speculation.
- **Consuming-project migration.** This design covers **the fkit repo's own tree**. A project that
  already ran fkit has tasks in the old layout, and ADR-015 established that launch converges
  `ai-agents/` **additively** — it creates what is missing and never rewrites what exists, so it will
  **not** migrate a consuming project's tasks. Those projects keep the old layout while the shipped
  skills expect the new one. **This is a real gap and it is out of scope here** — it needs its own
  decision (§11 does not cover it; it is larger than this task).

---

## Appendix — before / after

```
BEFORE                                   AFTER
──────                                   ─────
ai-agents/                               ai-agents/
├── tasks/                               ├── tasks/
│   ├── backlog/                         │   ├── registry.md         ← generated index
│   │   └── build-thing.md               │   ├── backlog/
│   ├── done/                            │   │   └── 0042-build-thing/
│   └── cancelled/                       │   │       ├── brief.md
├── plans/                               │   │       ├── plan.md
│   └── build-thing.md                   │   │       ├── worklog.md
├── worklogs/                            │   │       └── review.md
│   └── build-thing.md                   │   ├── done/
└── reviews/                             │   └── cancelled/
    └── build-thing.md                   └── (plans/ worklogs/ reviews/ — gone)

4 homes · slug key · renames orphan       1 home · permanent ID · renames are free
```
