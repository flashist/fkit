# Design — the task-folder structure and the global task-ID scheme

- **Date:** 2026-07-19
- **Author:** fkit-architect
- **Task:** [`design-task-folder-structure-and-id-scheme.md`](../../tasks/done/design-task-folder-structure-and-id-scheme.md) (Sprint 2, priority 74)
- **Status:** **approved** (owner, 2026-07-19), at **revision 3**. The adversarial pass has run and rev 2 incorporates it. Recorded as [ADR-029](../decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md), accepted. This change is irreversible in practice once the tree has moved.
- **Revisions:** rev 1 (2026-07-19) → rev 2 (2026-07-19, post-adversarial — see §14) → **rev 3** (2026-07-20, corrective). **Rev 3 changes no decision** — it fixes a false *rationale* in §3.2 (finding X19): the `10#` guard was justified by a loud error that in fact fires only for IDs containing an `8` or `9`, while the common case increments silently wrong. The rule was always right; the reason given for it was not.
- **Consulted:** fkit-producer (sequencing / decomposition context only); adversarial review by Codex
  via fkit-adversarial-reviewer, plus a supplemental Claude pass — **18 findings, all evaluated**.

---

## 0. Corrections to the brief, up front

Three of the brief's stated facts are stale. None of them changes the shape of the design, but two
change what the implementer must do, so they are recorded first rather than in a footer.

| Brief says | Measured 2026-07-19 | Consequence |
|---|---|---|
| **89 briefs** (12 backlog · 66 done · 11 cancelled) | **95 briefs** (17 backlog · 67 done · 11 cancelled) — and it was 94 four hours earlier | Every "exactly 89" verification step in tasks 75–78 must be re-derived, not trusted. **And see §3.4: a moving corpus is not merely a stale-count problem — it breaks the ID assignment rule unless the backfill is pinned to a commit SHA.** |
| **Task 64 collides** with this change and "the design must state the ordering" | **Task 64 is Done** (`tasks/done/implement-spawned-invocation-for-task-movers.md`, `✅ Done (agent-closed — not owner-verified)`) | **There is no ordering to state.** §9.1 records this explicitly so task 76 does not go hunting for a rule that does not exist. |
| **13 product source files** construct/parse task paths | **21 files under `claude/`** reference `tasks/` paths, plus 4 test files and 2 `reviews/README.md` copies | The sweep is larger than scoped. §8 lists the measured set and names the additions. |

Counts reproduced with:

```sh
ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l          # 95 (was 94 hours earlier)
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

The brief's three owner rulings are inputs. Where one created a technical cost, that cost was **named
as a finding** rather than silently substituted — and one of the three was subsequently changed by the
owner on that finding:

1. ~~A new global sequential ID **plus a registry**.~~ → **A new global sequential ID. The registry is
   dropped** (owner ruling, 2026-07-19, on the finding in §3.6). The ID itself is unchanged.
2. All briefs migrate in one pass — no dual-format period. *(unchanged)*
3. Wiki-vault links are repaired by a separate `fkit-wiki` task. *(unchanged)*

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
the board returns to showing every row, all flagged. The script exits 0. Nothing warns.

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

**Fix:** the recovery key becomes the **ID prefix** — not the whole folder name:

```sh
folder=$(basename "$(dirname "$linked")")     # "0042-foo"
id=${folder%%-*}                              # "0042"  ← the immutable part
for cand in backlog done cancelled; do
  for d in "$AGENTS/tasks/$cand/$id"-*/; do
    if [ -f "$d/brief.md" ]; then
      brief_path="$d/brief.md"; found_dir="$cand"; break 2
    fi
  done
done
```

> **⚠️ Key on the ID, not the folder name.** An earlier revision of this design keyed on the full
> folder name and claimed recovery "survives a slug rename." **It does not** — renaming the slug
> changes the folder name, so a stale href still fails to resolve and reports `missing-brief`. Only the
> `NNNN` prefix is immutable, and only keying on it delivers the claimed property.

With that correction it is genuinely **better** than today's rule: recovery survives both a board move
*and* a slug rename, neither of which the filename key ever handled.

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
- Derivation (post-migration; the folder names are ground truth):

```sh
max=$(ls -d ai-agents/tasks/{backlog,done,cancelled}/*/ 2>/dev/null \
  | xargs -n1 basename | sed -n 's/^\([0-9]\{4\}\)-.*/\1/p' \
  | LC_ALL=C sort | tail -1)
next=$(printf '%04d' $(( 10#$max + 1 )))     # ⚠️ 10# IS MANDATORY — see below
```

> **⚠️ `10#` is not optional, and dropping it usually fails SILENTLY.** In bash a leading zero means
> **octal**. The dangerous case is the quiet one: **if the ID contains no `8` or `9` it is valid octal,
> and the arithmetic just returns the wrong number with no error at all.** Verified on bash today:
>
> ```sh
> max=0100    $(( max + 1 ))  → 65   → printf %04d → 0065   ← SILENT, and 0065 is already assigned
> max=0064    $(( max + 1 ))  → 53   → printf %04d → 0053   ← SILENT
> max=0095    $(( max + 1 ))  → bash: value too great for base   ← loud, the lucky case
> ```
>
> **Do not rely on seeing an error.** The loud form fires only when an `8` or `9` appears. At the
> corpus's current max of `0100` the failure is silent, and `0065` is a real assigned ID
> (`tasks/done/record-pretooluse-skill-gate-adr-amendment.md`) — so dropping `10#` today produces a
> permanent, unrecoverable collision with no signal. The whole increment is also **absent in zsh**,
> which is what makes it a trap: an implementer developing in zsh sees it work, and it breaks for a
> consumer on bash. `dashboard.sh` is bash-3.2-targeted for exactly this class of reason
> (`dashboard.sh:30`). Every increment of a zero-padded ID must force base 10.
>
> **The live, authoritative copy of this warning is `claude/skills/fkit-task-brief/SKILL.md` step 6** —
> it is the one that executes. This spec is a dated design record; if the two ever disagree, the skill
> wins.

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

**Chosen: detect.** A duplicate-ID assertion joins the repo test suite (`node --test`, which is what ADR-014 established the suite would be built under — note ADR-014 itself left the runner open; Node is the implementation the repo settled on), and IDs are
cheap to renumber *before* they are referenced — which is precisely the window a merge exposes. This
is a **residual risk that is accepted, not eliminated**, and it is recorded in the ADR's consequences
so a future reader does not mistake it for an oversight.

### 3.4 Assigning IDs to the existing corpus

The brief's verification bar: *two people applying the rule to the same corpus produce identical IDs.*
That rules out any rule requiring judgment.

| Candidate ordering | Verdict |
|---|---|
| Chronological by git first-commit | **Rejected.** Requires archaeology; ties on shared commits; not reproducible without the exact repo state. |
| Sprint + priority | **Rejected.** This is the collision the ID exists to fix — Sprint 1 and Sprint 2 each have a task 46. |
| Board, then alphabetical | **Rejected.** Bakes board membership into the ID; two people disagree the moment a task moves mid-assignment. |
| **Slug, `LC_ALL=C`-sorted, board-blind** | **Chosen.** |

**The rule:**

> Take every brief path **as of a named commit SHA, pinned in task 75's brief before work starts**.
> Sort by **slug alone** (the basename without `.md`), ascending, under `LC_ALL=C`. Assign `0001`…`000N`
> in that order. Board membership is ignored entirely.

Reproducible byte-for-byte:

```sh
# PIN=<the commit SHA recorded in task 75's brief>
git ls-tree -r --name-only "$PIN" -- ai-agents/tasks \
  | sed -nE 's#^ai-agents/tasks/(backlog|done|cancelled)/(.+)\.md$#\2#p' \
  | LC_ALL=C sort | nl -w4 -n rz -s'  '
```

> **⚠️ `sed -E` with a non-`|` delimiter is mandatory, and this is the third instance of this trap in
> the repo.** An earlier revision of this design wrote `sed -n 's|…\(backlog\|done\|cancelled\)…'`.
> **BSD sed — what macOS ships, and what this project is developed on — does not support `\|`
> alternation in a basic regex.** It matches nothing and exits 0, so the pipeline returns an **empty
> corpus** and task 75 reports "no tasks found" rather than failing. GNU sed accepts it, so the bug is
> invisible to anyone testing on Linux or with GNU coreutils on `PATH`.
>
> Note also the delimiter: `-E` alone is not enough, because `|` is both the alternation operator and
> the `s|…|…|` delimiter. `s#…#…#` sidesteps it.
>
> **Verified against the live repo:** the broken form returns `0` rows; the form above returns the full
> corpus. Same class as the `10#` octal trap in §3.2 and `dashboard.sh`'s `\t` grep trap
> (`dashboard.sh:117-125`), both of which were also *"works on my machine, fails on a consumer's."*

#### ⚠️ Why the SHA pin is load-bearing, not ceremony

**Without it the rule does not meet the bar the brief set** — and this design shipped a revision that
did not have it.

Sorting the whole corpus and numbering `0001…N` means **inserting one new brief shifts the ID of every
alphabetically-later task**. The corpus is not static: it moved **94 → 95 during the writing of this
document** (task 79 landed mid-session). So two people applying the rule *a day apart* get different
IDs — while the brief's bar is that two people applying it produce **identical** IDs.

§10 made it worse by instructing *"derive the count — it will move again before this runs,"* which is
correct advice for a **count** and fatal for an **assignment**: deriving at execution time makes the
output depend on *when* task 75 runs.

**The pin closes it.** The corpus is whatever the named commit contained; the answer is reproducible
forever, by anyone, at any later date.

**The steady-state rule needs no pin** — §3.2 is `1 + max`, which is append-only and cannot be
perturbed by later arrivals. Only the one-time backfill was order-sensitive, and only the backfill is
pinned.

#### The post-pin rule — never re-derive

> **A brief created after the pin is not in the backfill.** It gets its ID from ordinary `1 + max`
> allocation (§3.2). It does **not** trigger re-derivation, and no already-assigned ID is ever
> recomputed.

This is the pin's whole point, and it must be stated rather than inferred. "Pin the assignment"
alongside "the corpus keeps moving" reads, to a careful implementer, as *re-pin and re-derive when brief
96 lands* — which would **renumber tasks that already have IDs**. That is precisely the permanent,
unrecoverable failure this section exists to prevent, arrived at by way of trying to be correct.

Concretely: the backfill assigns `0001…0095` at the pin. Brief 96 takes `0096` on creation, not the
slot its slug would sort into. **The ID sequence is allocation order, not alphabetical order** — the
sort exists only to make the one-time backfill reproducible, and stops applying the moment it is done.

*(Surfaced by fkit-producer while rescoping task 75, and correct — the design implied it and did not
say it.)*

**Verified precondition:** all slugs are unique across the three boards
(`… | LC_ALL=C sort | uniq -d` returns empty, re-checked at 95). The sort is therefore total with no
tie-break case. *(If a future corpus collides, the rule needs a documented tie-break; today it does
not, and inventing one now would be untested.)* **Task 75 must re-run this check against the pinned
SHA** — uniqueness is a property of the corpus, not a permanent truth.

**Closed tasks are numbered.** The whole pinned corpus, not just the open ones. Their plans, worklogs and ledgers are
keyed by the same identifier, and 78 unaddressable tasks would defeat the point.

### 3.5 `## ID` is a brief field — forced by task 75, not chosen

The brief leaves this open: does the folder name carry the ID alone, or does the brief also record it?

**Task 75 settles it.** Its defining constraint is **"no file moves, no folder creation"** — task 76
does the moving. So between 75 and 76 the folders **do not exist**. If the folder name were the sole
carrier, task 75 could not record an ID anywhere and would be impossible as scoped. *(This argument is
unaffected by §3.6 dropping the registry: what forces the field is the no-moves constraint, not the
registry.)*

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

### 3.6 The registry — **dropped** (owner ruling, 2026-07-19)

The brief's ruling 1 named "a permanent project-wide ID **plus a registry**." I raised a finding against
the stored registry rather than substituting silently, and **the owner ruled to drop it.**

> **There is no registry file.** Authority rests on exactly two carriers: the **folder name**
> (post-migration) and the brief's **`## ID`** field, reconciled by the `id-mismatch` drift check
> (§3.5).

Why the finding stood:

- The tree already answers every question a registry answers. Allocation (`1 + max`) is one `ls`;
  lookup is one `grep`.
- A generated, committed index is a **third carrier that can drift**, and this project has paid for
  that lesson at least three times — ADR-018's skill-ownership source-of-truth reconciliation, and
  `dashboard.sh`'s "there is ONE grammar" comments at `:111-126` and `:308-313`, each written after a
  defect caused by two sources answering one question.
- Nothing in the design *reads* a registry. It would have existed only to be maintained.

**Consequence for task 75:** its scope becomes *"add `## ID` to every brief in the pinned corpus and write down the
allocation procedure."* No file is created. This is a **reduction** in scope, and it removes the one
part of task 75 that could itself drift.

**Allocation without a registry** — the derivation is the rule (§3.2), documented in
`fkit-task-brief/SKILL.md` where the next brief is written:

```sh
# post-migration: folder names are ground truth
ls -d ai-agents/tasks/{backlog,done,cancelled}/*/ 2>/dev/null \
  | xargs -n1 basename | sed -n 's/^\([0-9]\{4\}\)-.*/\1/p' | LC_ALL=C sort | tail -1

# between tasks 75 and 76, before folders exist: the ## ID fields are ground truth
grep -rhA1 '^## ID' ai-agents/tasks/*/*.md | grep -oE '^[0-9]{4}' | LC_ALL=C sort | tail -1
```

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

### 5.1 The brief under-scopes this — **owner confirmed the widened scope**

The brief asks only whether `ai-agents/reviews/` is absorbed. But ADR-020 keys `plans/`, `worklogs/`
**and** `reviews/` by the identical `<task-id>` — they are one question, not one plus two others.
Answering only for `reviews/` would leave two directories keyed by slug while briefs are keyed by ID:
the two-grammar problem, freshly installed.

> **All three are absorbed** (owner ruling, 2026-07-19). `reviews/`, `plans/`, and `worklogs/` fold
> into the task folder as `review.md`, `plan.md`, `worklog.md`. Three top-level directories disappear.

ADR-020 §Decision 6 pre-authorizes exactly this, naming all four artifacts.

**Measured volume (2026-07-19, and it moves):** 20 task-keyed ledgers + 11 plans + 11 worklogs + `reviews/README.md` = **43 files** folding into task folders, plus **2 sprint-keyed ledgers** relocating per §5.2b = **45 files** leaving `reviews/`+`plans/`+`worklogs/`. **Derive these at execution time.** Tasks 76–77 are being rescoped accordingly (producer-owned).

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

### 5.2b Sprint-scoped ledgers — the case the absorption rule does not cover

`ai-agents/reviews/` holds **two ledgers that are not keyed to a task at all**:

```
ai-agents/reviews/sprint2-scaffold-launcher-hardening.md
ai-agents/reviews/sprint2-shared-instructions-delivery.md
```

They are keyed to a **sprint theme** spanning several tasks. The absorption rule in §5.1 folds
*task-keyed* artifacts into *task* folders, and these have no task to fold into. Forcing them into an
arbitrary host task folder would file a multi-task record under one of its subjects — losing the very
thing that makes them distinct.

> **Ruling: they move to `ai-agents/sprints/reviews/`.** `ai-agents/reviews/` still disappears.

This is not a patch on the rule, it is the rule applied consistently. The design's thesis is **an
artifact lives with the thing it describes** — that is why task-keyed artifacts move into task folders.
A sprint-keyed artifact therefore belongs with the sprint plans, which already live in
`ai-agents/sprints/` (and already have a `done/` subdirectory for archived boards, so a `reviews/`
sibling is an established shape rather than a new concept).

**Volume correction:** the absorbed set is **45 files, not 44** — 20 task-keyed ledgers + 11 plans + 11
worklogs + `reviews/README.md` (whose content moves to `ai-agents/tasks/README.md`, both homes), plus
these 2 relocating to `sprints/reviews/`.

**Owner may overrule.** Two alternatives were weighed and rejected: keeping a slimmed `ai-agents/reviews/`
alive for two files (contradicts the "one home per artifact" thesis for a very small saving), and
folding them into the sprint plan itself (a sprint plan is a *board*, and burying two-party review
findings inside it obscures both).

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

> ⚠️ **Rules 1 and 3 need a home, and an earlier revision of this design missed it.** It claimed "only
> rule 2 changes" — but rules 1 and 3 resolve an id **without identifying a task folder**, and the
> ledger is now *inside* a task folder. A review run on a branch with no task (rule 3) has an id and
> nowhere to put the file. `fkit-stateful-review/SKILL.md:23-33` explicitly permits that path.
>
> **Resolution:** rules 1 and 3 must resolve to a **folder**, not just a string.
> - Rule 1: an explicit id that is an **ID prefix or folder name** → that task's folder. An explicit id
>   matching no folder → falls to rule 4 (stop and ask), rather than silently creating an orphan.
> - Rule 3: a branch-derived id has no task folder → the ledger goes to
>   **`ai-agents/sprints/reviews/<branch-slug>.md`**, the same home §5.2b gives other non-task-keyed
>   ledgers. This is a **review not tied to a task**, and filing it under an arbitrary task would
>   misattribute it.
>
> Rule 4 is genuinely untouched.

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

| # | Site | Today | Must become | Fails |
|---|---|---|---|---|
| 1 | `:533` primary resolve | `[ -f "$PLAN_DIR/$linked" ]` | unchanged (hrefs updated by task 76) | visibly |
| 2 | `:535` board detection | `basename $(dirname $brief_path)` | `basename $(dirname $(dirname …))` — **§2.1** | **silently** |
| 3 | `:536-546` link-rot recovery | scan by `$fname` | scan by **ID prefix** — **§2.2** | **silently** |
| 4 | `:549-552` corrected link | renders `$fname` | renders `<folder>/brief.md` | visibly |
| 5 | `:451-453`, `:506-529` id derivation | Priority cell → filename stem → `?` | the ID from the folder name — **§3.7** | **silently** |

**Sites 2, 3 and 5 are all silent.** An earlier revision of this design classified site 5 as
"fails visibly." **That was wrong**, and the error mattered because the visible/silent labelling is what
drives §10's verification coverage.

**Why site 5 is silent.** `dashboard.sh:526-528` falls back to the brief's filename stem when the
Priority cell has no number:

```sh
if [ -z "$tid" ] && [ -n "$fname" ]; then
  tid=$(printf '%s' "$fname" | sed -e 's/\.md$//' …)
fi
```

Under folders `$fname` is `brief.md` for every task, so `tid` becomes the literal string **`brief`** for
**every row on the Backlog board** (which is unranked by design — its Priority cells are `—`). The
roll-up then `uniq`s all of them into a single `brief` entry. The block's own comment at
`dashboard.sh:506-517` says this fallback exists precisely so the owner is not *"told drift exists and
given no way to find it"* — under folders it produces exactly that failure, with `brief` in place of
`?`. Nothing errors.

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
3. **The reference sweep — the worst break in the whole design.**
   `fkit-task-done/SKILL.md:85-94` greps for the brief's **basename**:

   ```sh
   grep -rn "<file>.md" ai-agents/sprints/ ai-agents/tasks/
   ```

   Under folders that basename is `brief.md` — and **every task's href in every sprint plan now ends in
   `/brief.md`**. So the sweep matches *all of them*: 80 hits in `sprint-2.md` alone, ~95 across the
   tree. And `fkit-task-done/SKILL.md:94-96` mandates that **"Every hit it returns is handled in step 5;
   none is discarded."**

   > **Closing one task would instruct the mover to rewrite every task's row in every sprint plan.**

   **The sweep key becomes the folder name** (ID-bearing, unique).

   > ⚠️ An earlier revision of this design called this break *"would report 'no references found' for
   > every task."* **That was backwards.** The failure is not zero matches, it is ~95 false-positive
   > matches carrying a "none is discarded" instruction — a mass-corruption path, not a silent no-op.
   > The fix (a better key) is the same; the severity is not, and neither is what §10 must test for.

4. **The moved brief's own outbound sibling links.** `fkit-task-done/SKILL.md:117-124` requires
   re-pointing links the moved brief makes *to other briefs* — briefs cross-link, so one move breaks
   links in **both** directions.

   Under folders this gets more dangerous, not less: a sibling link becomes `](../0043-other/brief.md)`,
   which is a **valid relative path from any board directory**. Move the folder to `done/` and that link
   silently resolves to `done/0043-other/brief.md` — a path that may not exist, or worse, may exist and
   be the wrong task's folder. Today's `](../backlog/other.md)` at least names its board explicitly.

   **Recommendation: sibling links use a board-qualified path** (`](../../backlog/0043-other/brief.md)`)
   so a move cannot silently re-target them.

---

## 7. Migration & rollback

### 7.1 Sequence

Follows the producer's existing decomposition (tasks 75–78), which this design endorses. The split is
load-bearing: **the irreversible step is isolated from the atomic one.**

```
75  add `## ID` to every brief    no file moves — reviewable against an unchanged tree
    + write the allocation rule  (no registry — owner ruling, §3.6)
                                 ↓
76  move every task folder + 45 artifacts + 21 tooling files + sprint hrefs
                                 ↓  ← THE POINT OF NO RETURN
        ┌────────────────────────┴────────────────────────┐
77  repair links outside the wiki                    78  wiki sync + structural re-description
    (knowledge-base, brief↔brief)                        (fkit-wiki only — hard rule)
                                                         + the six batched syncs (§9.2)
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

TASK 76:          all moves via `git mv`; owner commits as ONE commit

ROLLBACK:         git revert <migration-sha>                     ← ONLY before 77/78 land
             or   git reset --hard pre-task-folder-migration     ← after that, the only option
```

**⚠️ The rollback window closes when tasks 77/78 land.** An earlier revision presented `git revert` as
the preferred option unconditionally. It is only valid **while task 76 is the tip**. Once 77 (link
repair) and 78 (wiki sync) have committed, their commits *target the new layout* — reverting 76 alone
leaves the repo structurally inconsistent: folders gone, but ~310 links and the whole vault still
pointing at them. After 77/78, the only coherent rollback is the **destructive reset**, which discards
their work too. Task 76's brief must say this, because the cheap-looking option stops being correct
without any warning.

**A partially-completed task 76** is recoverable: `git reset --hard pre-task-folder-migration` restores
tracked state regardless of how far the sweep got. **Untracked files are not restored by that command** —
if the migration created any, `git clean` is also needed. This is why the pre-migration commit must be
*clean*, not merely tagged.

**On `git mv`:** it does **not** write rename metadata — git has none, and infers renames later by
content similarity. `git mv` is still the right command (it stages the removal and addition together),
but the reason is ergonomics, not preserved history. *(An earlier revision asserted rename preservation;
that was technically false and is corrected here.)*

**The procedural precondition, stated plainly:** fkit's universal hard rule is that agents never commit
unprompted. So **the owner must perform both commits and the tag.** No agent can create the rollback
point, which means task 76's brief must instruct the owner to do it **before** the agent starts. If
that step is skipped, the rollback story does not exist — the change would live entirely in an
uncommitted tree, which is exactly what the brief forbids.

**Task 75 needs no tag** — with the registry dropped it adds no file at all, only content edits, and is undone by reverting them.

### 7.3 The migration is mechanical — script it, don't hand-edit

~95 folder creations, ~140 file moves and ~310 link rewrites are past the scale where hand-editing is
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

**Two skills need a new enumeration rule, not just a path edit:**

- **`fkit-wiki-ingest`** (`SKILL.md:28-36`) accepts the keyword `all tasks`. The design must say what
  that enumerates post-migration. A shallow glob (`tasks/*/*.md`) now matches **zero** files; a
  recursive one also admits `plan.md`, `worklog.md` and `review.md` as if they were task sources.
  **Rule: `all tasks` enumerates `ai-agents/tasks/{backlog,done,cancelled}/*/brief.md` — briefs only.**
  The other artifacts are not wiki sources and never were.
- **`fkit-wiki-sync`** (`SKILL.md:35-50`) delta-ingests what changed since a watermark SHA. The
  migration window is hostile to it: task 75 edits content at **old** paths, task 76 moves everything to
  **new** paths as pure renames. Replaying that window, the old paths no longer exist and the new ones
  look rename-only — so **the sync can skip the entire corpus and advance its watermark past it**,
  leaving the vault permanently stale on 95 tasks with no error. **Rule: task 78 runs a forced full
  re-ingest of the task corpus, not a delta**, and resets the watermark afterwards.

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
`reviews/` 41 · brief↔brief 12. **≈310 total, 2026-07-19** — of which the 98 vault refs are task 78's, by hard rule.

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
- Every brief carries exactly one `## ID`. Count of `## ID` fields ==
  `ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l`. **Derive the count — do not trust 89 or
  94; it will move again before this runs.**
- IDs unique: `… | LC_ALL=C sort | uniq -d` returns empty.
- Bijection both directions: every ID maps to an existing brief; every brief carries exactly one ID.
- Re-deriving §3.4 from scratch reproduces the assignment byte-for-byte.
- `git status` shows **no** renames, deletions, or new files under `ai-agents/tasks/` — **content edits
  only.** (With the registry dropped, task 75 adds no file at all.)
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

---

## 11. Owner decisions — resolved 2026-07-19

Every open question this design raised has been ruled on. Recorded here so the ADR's consequences and
tasks 75–78's scope trace to a decision rather than an assumption.

| # | Question | Ruling |
|---|---|---|
| 1 | The stored registry — architect recommended against it | **Dropped.** §3.6 rewritten; task 75 shrinks. |
| 2 | Absorb `plans/` and `worklogs/` as well as `reviews/`? | **Absorb all three.** §5.1; +45 files to tasks 76–77. |
| 3 | Batch the six queued wiki-syncs into task 78? | **Confirmed.** §9.2. |
| 4 | Adversarial pass before approval? | **Yes** — to be routed against *this* revision. |
| 5 | Owner-verify task 64 before the migration? | **No — accepted as-is.** See the caveat below. |
| 6 | When to correct the stale task-64 collision warnings? | **Now, before implementation.** Producer-owned. |
| 7 | Who links the spec + ADR from sprint row 74? | **The producer.** Producer-owned. |
| 8 | Consuming-project migration | **Deferred** to its own task + ADR. *(First ruled "solve inside this migration"; on the finding that this would reopen ADR-015, the owner changed the ruling to deferral. ADR-015 is not reopened.)* |

**Caveat carried forward from ruling 5:** task 64 closed agent-side and is **not owner-verified**. Its
output is two of the mover skills this migration rewrites. If it proves wrong, the fix lands in files
that a repo-wide path sweep has since rewritten, and isolating the cause is materially harder. This is
an **accepted risk**, recorded so it is not later read as an oversight.

### 11.1 How ruling 8 was reached

The owner first ruled that consuming-project migration be solved **inside** this migration. Implementing
that as stated would have reopened
[ADR-015](../decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md), which decided
that launch converges `ai-agents/` **additively** — creating what is missing, **never rewriting what
exists** — and whose title names the absence of a migration mechanism as the decision itself. Migrating
a consuming project's tasks necessarily rewrites what exists.

That was raised as a finding rather than absorbed, with three ways forward: amend ADR-015 with a scoped
exception; build a separate migration mechanism (ADR-015's own rejected option, analysed in
[`reports/2026-07-14-migration-mechanism.md`](2026-07-14-migration-mechanism.md)); or defer.

**The owner ruled deferral** (2026-07-19). ADR-015 stands unamended. See §13 for the scope statement and
the accepted cost.

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
- **Consuming-project migration — deferred to its own task and ADR** (owner ruling, 2026-07-19).

  This design covers **the fkit repo's own tree only**. A project that already ran fkit has tasks in the
  old layout, and [ADR-015](../decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)
  established that launch converges `ai-agents/` **additively** — creating what is missing, never
  rewriting what exists — so it will **not** migrate a consuming project's tasks.

  The owner first ruled to solve this inside the migration; on the finding that doing so would reopen
  ADR-015, the ruling was **changed to deferral**. It becomes its own task and its own ADR, scoped
  immediately after this migration lands. It **blocks nothing here** and keeps task 76 atomic.

  **The gap is real while it is open:** a project that installs fkit in that window gets skills
  expecting the new layout against a tree in the old one. That is the accepted cost of deferring, and
  the follow-up task should be scoped rather than merely intended.

---

## Appendix — before / after

```
BEFORE                                   AFTER
──────                                   ─────
ai-agents/                               ai-agents/
├── tasks/                               ├── tasks/
│   ├── backlog/                         │   ├── backlog/
│   │   └── build-thing.md               │   │   └── 0042-build-thing/
│   ├── done/                            │   │       ├── brief.md
│   └── cancelled/                       │   │       ├── plan.md
├── plans/                               │   │       ├── worklog.md
│   └── build-thing.md                   │   │       └── review.md
├── worklogs/                            │   ├── done/
│   └── build-thing.md                   │   └── cancelled/
└── reviews/                             └── (plans/ worklogs/ reviews/ — gone)
    └── build-thing.md                       (no registry file — owner ruling)

4 homes · slug key · renames orphan       1 home · permanent ID · renames are free
```

---

## 14. What the adversarial pass changed (rev 1 → rev 2)

An adversarial review ran against rev 1 — Codex via `fkit-adversarial-reviewer`, plus a supplemental
Claude pass. **18 findings; every one was verified against the codebase before acting.** The pass
earned its keep: it found a defect that would have defeated the brief's own acceptance bar, and it
corrected two of rev 1's three headline "silent breaks", both of which were characterised wrongly.

### Findings that changed the design

| # | Finding | Rev 1 said | Rev 2 says |
|---|---|---|---|
| **X19** *(rev 3, post-approval)* | **§3.2's rationale for `10#` was false in the common case.** It justified the guard by the loud error (`0095` → "value too great for base"), but that fires only when the ID contains an `8` or `9`. Every other ID is **valid octal** and increments **silently wrong**: at the corpus's real max, `0100 + 1` → `0065`, an already-assigned ID. Re-verified on bash. | "you'd see an error" | **§3.2 rewritten to lead with the silent mode**, with `0100 → 0065` as the primary example and `0095` demoted to the lucky case. Raised by fkit-coder from stateful-review finding R1 on task 75; the adversarial pass had cleared this area, having tested only the correct form. |
| **X18** | **The ID assignment rule was not stable across time.** Sorting the whole corpus and numbering `0001…N` means one new brief shifts every alphabetically-later ID. The corpus moved 94→95 *during authoring*. Two people applying the rule a day apart get different IDs — the brief's bar is that they get identical ones. | derive at execution time | **§3.4: the backfill is pinned to a named commit SHA.** The steady-state `1 + max` rule is append-only and needed no change. |
| **X17** | **The mover's reference sweep fails by mass false-positive, not by silence.** `grep -rn "brief.md"` matches *every* task's href (80 in `sprint-2.md` alone), under an instruction that "none is discarded" — so closing one task would rewrite every row. | "would report no references found" | **§6.2 point 3, rewritten.** Same fix, correct severity. |
| **X16** | **`dashboard.sh:527` is a fourth silent break.** The filename-stem fallback yields the literal `brief` for every unranked row, collapsing the whole Backlog board to one drift id — the exact failure its own comment says it exists to prevent. | site 5 "fails visibly" | **§6.1: sites 2, 3 and 5 are all silent.** The labelling drives verification coverage, so the error mattered. |
| **X1** | Recovery keyed on the full folder name does **not** survive a slug rename — the folder name contains the slug. | claimed it did | **§2.2: key on the `NNNN` prefix**, the only immutable part. |
| **X2** | The moved brief's **outbound sibling links** were omitted (`fkit-task-done/SKILL.md:117-124`). Worse under folders: `](../0043-other/brief.md)` stays *valid* from any board and silently re-targets. | not covered | **§6.2 point 4**, plus a board-qualified-path recommendation. |
| **X3** | Ledger rules 1 and 3 resolve an id **without** identifying a task folder — a branch-scoped review has an id and nowhere to put the file. | "only rule 2 changes" | **§5.3: rules 1 and 3 must resolve to a folder**; branch-scoped ledgers go to `sprints/reviews/`. |
| **X7** | An unbased `$(( 0NNN + 1 ))` is parsed as **octal** in bash — and works in zsh, which is what makes it a trap. Verified both. | no base specified | **§3.2: `10#` is mandatory**, with the zsh/bash divergence called out. **Corrected rev 3** — see X19: the failure is usually silent, not the loud "value too great for base". |
| **X8** | `git revert` is only a valid rollback **while task 76 is the tip** — once 77/78 land, their commits target the new layout. | revert presented as preferred, unconditionally | **§7.2: the rollback window closes**; after 77/78 only the destructive reset is coherent. Partial-completion and untracked-file cases added. |
| **X4** | `fkit-wiki-ingest`'s `all tasks` keyword had no post-migration enumeration rule — shallow matches zero files, recursive admits `plan.md`/`worklog.md`/`review.md` as task sources. | not covered | **§8: `*/brief.md` only.** |
| **X5** | `fkit-wiki-sync` could **skip the entire corpus and advance past it** — task 75 edits old paths, task 76 renames to new ones, and the delta logic sees neither. | not covered | **§8: task 78 runs a forced full re-ingest**, not a delta. |
| **X6** | Duplicate-ID detection is not guaranteed to fire before references exist (brief creation writes its board row in the same operation; no CI gate). | "detect, don't prevent" stated flatly | **§3.3** retains detect-over-prevent but the residual is now stated honestly rather than implied safe. |
| **X9** | Rev 1 contradicted itself on consuming-project migration — the §11 table still said "solve inside", §13 said deferral. **Introduced by my own mid-session edit.** | contradictory | **§11 table and §11.1 corrected.** Deferral throughout. |
| **X12·X13** | Stale figures: 44 vs 45 files, 94 vs 95 briefs, "task 75 adds a file" after the registry was dropped. | stale | Corrected; **counts now say "derive at execution time"** rather than naming a figure. |
| **X14** | ADR-014 does not choose `node --test` — it explicitly left the runner open. | mis-cited as authority | Citation corrected to what ADR-014 actually says. |
| **X15** | `git mv` does **not** preserve rename metadata; git infers renames later by similarity. | asserted preservation | Corrected; `git mv` still recommended, for ergonomics not history. |

### Findings routed elsewhere

**X10 · X11** are defects in **task 76's brief**, not in this design: it instructs the scaffold to land
the "same structure" (impossible for a deliberately-empty scaffold, and it would copy this project's
task folders into a consumer's tree), and it still tells the coder to stop and ask about the two sprint
ledgers that §5.2b now settles. **Producer-owned** — flagged, not edited here.

### What the pass confirmed

The five `dashboard.sh` sites are a **complete** enumeration; the §3.6 allocation grep is correct;
tracked partial task-76 work is recoverable to the tag; and `sprints/reviews/` trips neither the sprint
globs nor ADR-027 parity. *(That last one was cleared by the Codex pass only and was not independently
re-verified.)*

### Honest note on rev 1

Three of rev 1's own headline findings were wrong in ways that mattered — X16 and X17 misjudged
severity and direction, X1 claimed a property the mechanism did not deliver. **A design that finds
three silent breaks and mis-describes two of them is not a safe input to an irreversible migration.**
That is the argument for the pass having run, and the argument for §10's verification testing behaviour
rather than trusting the prose.
