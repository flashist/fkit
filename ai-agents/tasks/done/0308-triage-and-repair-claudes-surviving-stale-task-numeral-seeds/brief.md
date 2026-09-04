# Triage and repair `claude/`'s surviving stale task-numeral seeds — the source comments that keep re-seeding the class

## ID
0308

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Why this exists

Before [ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
gave every task a permanent four-digit folder ID, work was referred to by its **board rank** — *"task
27"*, *"task 36"*, *"task 67"*. Those numerals were **renumbered by the migration.** Today many of them
still resolve — **to a different, real, unrelated task.**

⛔ **This is worse than a dead link, and that is the whole point of the class.** A dead path announces
itself. A mis-resolving numeral **returns a confident wrong answer**, and the reader who follows it
lands on the wrong task with no signal that anything went wrong.

⭐ **`claude/` is where the class is REPRODUCED, not merely where it survives.** `0306` established that
briefs filed on 2026-08-14 carried the defect because their authors copied a numeral out of a live
source comment. **Repairing the `ai-agents/` half while the source keeps re-seeding it is a partial
fix.**

### Provenance

**Owner ruling, 2026-08-15**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, and relayed to a spawned producer. **The ruling is a selection from an option
list, so the option label is the verbatim text:**
**"Name them in Residuals, then file a follow-up (Recommended)"**.

**Parent task:** [`0306`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md),
closed 2026-08-15. **Authority for this residual:** that folder's
[`review.md`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md),
section *Accepted residuals*, row **R7** — **as corrected by round-2 finding R9 in the same file.**

⛔ **Do not scope from `0306`'s `worklog.md` §9.** It records this residual with an **over-broad
framing** — *"10 stale non-`task 43` numerals"* — when `10` is exact **only** for the
`{task 70, task 36, task 67}` set that was actually measured. The `review.md` residuals table is the
authority, and it says so itself.

⚠️ **Why `claude/` was left out of `0306`:** the owner deliberately limited that task's `claude/`-side
widening to **the `task 43` numeral only** (verbatim option label *"Extend 0306 to claude/ too
(Recommended)"*). ⭐ **These sites were correctly left. They are not an escaped defect.**

⚠️ **Unranked, no sprint** — filed by a spawned producer with no owner channel, so this row **appends**
and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### The population, re-derived on disk 2026-08-15

⚠️ **Re-derived firsthand by the filing producer.** ⛔ **The ledger's two lists were NOT simply added
together** — the whole population was re-measured, and it is **larger than either list**.

**Measurement context.** `HEAD` = `9360177` (*"Sprint push"*), **dirty working tree** (44
modified/untracked paths plus one staged rename from `0306`'s close). ⚠️ **`claude/README.md`,
`claude/fkit-claude.sh`, `claude/skill-ownership-hook.sh`, `claude/skills-for-role.sh` and
`claude/skills/fkit-team/SKILL.md` are modified but uncommitted** — a clean checkout of `9360177` will
give different figures.

**Method — every one of these guards is load-bearing, and each one caught something in `0306`'s own run:**

- **`grep -c` counts matching LINES, not occurrences.** Use `grep -o … | wc -l` wherever a count is
  reported. (`dashboard.sh:763` carries `task 47` **twice on one line**.)
- **Case matters.** `\btask` misses `Task 70`. ⭐ **Case sensitivity hid 7 sites in `0306`'s run,
  including an entire file.** Use `-i`.
- **The hyphenated form `task-NN` does not match `\btask NN\b`.** The character class must be `[ -]`.
  (`claude/fkit-claude.sh` carries a hyphenated `task-26`.)
- **A phrase wrapped across a line break is invisible to single-line grep**, and a bare `tr '\n' ' '`
  still misses it because the continuation line's indent survives the join — **squeeze with
  `tr -s ' '`**. ✅ **Checked: `claude/` carries zero wrapped occurrences today.** Re-check anyway.
- ⛔ **Absence claims are the expensive ones.** A presence claim cannot fail this way.

**Commands and results:**

```sh
grep -rInoiE '\btask[ -][0-9]{1,2}\b' claude/ --exclude-dir=scaffold | wc -l   # 48 occurrences
grep -rIloiE '\btask[ -][0-9]{1,2}\b' claude/ --exclude-dir=scaffold | wc -l   # 12 files
grep -rInoiE '\btask[ -][0-9]{1,2}\b' claude/scaffold/ | wc -l                 # 0  ⭐ and must stay 0
grep -rInoiE '\btask[ -]43\b' claude/ | wc -l                                  # 0  ✅ 0306's repair held
```

**48 occurrences across 12 files, on 22 distinct numerals.** Per file:

| Occurrences | File |
|---|---|
| 24 | `claude/skills/fkit-status/dashboard.sh` |
| 5 | `claude/fkit-claude.sh` |
| 4 | `claude/skills/fkit-status/SKILL.md` |
| 3 | `claude/fkit-claude-init.sh` |
| 2 | `claude/skills-for-role.sh` |
| 2 | `claude/skills/fkit-task-brief/SKILL.md` |
| 2 | `claude/skills/fkit-task-cancelled/SKILL.md` |
| 2 | `claude/skills/fkit-task-done/SKILL.md` |
| 1 | `claude/orphan-targets` |
| 1 | `claude/skills/fkit-wiki-ingest/SKILL.md` |
| 1 | `claude/skills/fkit-wiki-lint/SKILL.md` |
| 1 | `claude/skills/fkit-wiki-sync/SKILL.md` |

**Numeral breakdown (case-normalised, hyphen folded):** `9`×1 · `12`×3 · `13`×1 · `14`×1 · `18`×1 ·
`26`×4 · `27`×2 · `34`×1 · `36`×3 · `41`×1 · `42`×2 · `44`×3 · `47`×2 · `64`×2 · `65`×1 · `67`×5 ·
`70`×2 · `76`×3 · `80`×3 · `81`×1 · `84`×2 · `99`×4.

### ⛔ The 48 are NOT all defects — and the triage is the real work

**Three kinds of occurrence live in this population, and only one is a defect:**

1. **Provenance citations** — *"THE BACKLOG BOARD (task 67) has a real identity"*, *"Task 36 /
   migration report §9"*, *"⛔ THIS LIST IS EXHAUSTIVE BY OWNER RULING (task 36)"*. **These are the
   defect class**, when the numeral is a pre-ADR-029 rank.
2. **Grammar and example data** — `dashboard.sh`'s own header documents its dependency grammar with
   `**Depends on: task 18** trailing prose` and `- task 12` / `- task 99`, and `fkit-status/SKILL.md`
   carries an illustrative board row `| ⟨derive: task 26 and task 27.⟩ |`. ⛔ **These are not
   citations and must not be "repaired"** — rewriting an example changes what the doc teaches.
3. **Correctly-resolving numerals.** ⛔ **Not every bare numeral is stale**, and a blanket sweep would
   corrupt records.

⚠️⚠️ **The trap `0306` fell into, stated so this task does not repeat it.** `0306`'s brief listed
`task 70` as a **verified counter-example** — *"resolves correctly to
`done/0070-relax-tool-allowlists-except-adversarial-reviewer`. ⛔ Do not 'repair' it."* **That was
wrong.** During the run it was established that in the four-mirror warning block, *"Task 70"* means
**`0008`**, not `0070`, and the owner ruled it repaired (verbatim label *"Repair it to `0008`,
consistent with the ruling (Recommended)"*). ⭐ **That same warning block is quoted verbatim in
`claude/skills-for-role.sh:20` and `claude/fkit-claude.sh:267`.** ⛔ **Triage every numeral against its
own context. Do not inherit a classification from anywhere — including from this brief.**

### What `0306`'s ledger already triaged — 17 of the 48

⚠️ **Verify each of these yourself. They are the best available classification, not gospel.** All 17
were confirmed present on disk by the filing producer; the *staleness* judgement is the ledger's.

**Ledger R7 — 10 sites across 7 files, `{task 70, task 36, task 67}`.** ✅ **All 10 reproduced.**

| Numeral | Sites (anchor on the quoted text, not the line numbers) |
|---|---|
| `Task 70` ×2 | `skills-for-role.sh` and `fkit-claude.sh`, both in *"Task 70 followed the two-item list precisely and still shipped a false statement…"* |
| `task 36` ×3 | `fkit-claude-init.sh` *"Task 36 / migration report §9"*; `orphan-targets` *"EXHAUSTIVE BY OWNER RULING (task 36)"*; `dashboard.sh` *"live in sprint-2 task 36"* |
| `task 67` ×5 | `dashboard.sh` ×3 (*"THE BACKLOG BOARD (task 67)"*, *"since task 67"*, *"Task 67 normalized all of them"*); `fkit-task-done/SKILL.md` and `fkit-task-cancelled/SKILL.md` (*"Since task 67 every brief…"*) |

⭐ **`dashboard.sh`'s *"live in sprint-2 task 36"* was missed by `0306`'s own worklog §3 and caught in
review.** Assume this brief has missed something too.

**Ledger R9 — 7 further citation-shaped sites, on numerals `0306`'s own triage table resolved.**
✅ **All 7 reproduced.** ⭐ **3 of the 7 sit in files R7's list does not name** — the three wiki skills.

| Numeral | Resolves to | Sites |
|---|---|---|
| `task 26` ×3 | `0088` | `fkit-claude.sh` *"a read-only checkout (task 26)"*; `fkit-claude-init.sh` *"task 26's bar"*; **hyphenated** `fkit-claude.sh` *"(task-26 bar)"* |
| `task 27` ×1 | `0069` | `fkit-claude.sh` *"a weird ai-agents/ (task 27)"* |
| `task 80` ×3 | `0078` | `fkit-wiki-sync/SKILL.md`, `fkit-wiki-lint/SKILL.md`, `fkit-wiki-ingest/SKILL.md`, all *"task 80's vault work"* |

**Explicitly classified as NOT citations by the ledger — 4 occurrences, deliberately not claimed:**
`fkit-status/SKILL.md`'s `⟨derive: task 26 and task 27.⟩` example row (2), and `dashboard.sh`'s
hypothetical *"told task 47 is drifted and then cannot find task 47"* (2, same line).

### ⛔ The residual — 27 occurrences nobody has triaged

**48 − 17 triaged − 4 classified-as-illustrative = 27 occurrences on 16 distinct numerals that NOBODY
has resolved:** `9`, `12`, `13`, `14`, `18`, `34`, `41`, `42`, `44`, `47`, `64`, `65`, `76`, `81`, `84`,
`99` (plus the un-triaged 4th `task 26` and 2nd `task 27` occurrences).

⛔ **Do not assume they are wrong, and do not assume they are right.** Several are visibly grammar
examples (`12`, `18`, `34`, `99`); several are visibly provenance citations (*"Post-migration (task
76)"*, *"the live task-84 misreport"*, *"(task 64, review R3)"*, *"THE OPEN-WORK FILTER (task 65)"*,
*"one-skill-one-output.md, task 44"*). ⭐ **Each must be resolved individually against its own context.**

## What to build

**Order matters. Step 1 is triage; step 2 is repair; step 2 may not begin on a site step 1 has not
classified.**

1. **Re-derive the whole population** with the four commands above, plus the wrap-join check. **Record
   before-counts in the worklog.** ⛔ **Do not carry this brief's 48 forward unverified** — state your
   own number and, if it differs, **say this brief was wrong**.
2. **Triage every occurrence into exactly one of three classes** and write the table into the worklog:
   **(a) stale citation** — the numeral is a pre-ADR-029 rank and resolves to unrelated work today;
   **(b) correct citation** — leave it; **(c) illustrative / grammar example** — leave it, and say why.
   ⛔ **Every one of the 48 gets a row. A site with no row is an unfinished triage, not an implicit
   "leave it".**
3. **For each (a), resolve the intended referent** by reading the surrounding context, and record
   **both** the numeral and what it resolves to. ⛔ **Do not resolve by arithmetic or by pattern** —
   resolve by reading what the comment is actually talking about.
4. **Repair the (a) sites**, replacing the stale numeral with the durable form. ⚠️ **Use the folder
   `NNNN` ID** — ADR-029 Decision 3, restated by `0160`'s ruling: *"a task → the folder-name `NNNN`
   prefix, always"*. ⛔ **Never cite a task's board rank.**
5. **Report the after-counts**, per numeral and per file.
6. **State the ceiling honestly in the worklog** — which classes this run did **not** touch, and
   whether anything remains that would re-seed the defect.

**⛔ Out of scope — do not widen:**

- ⛔ **`claude/scaffold/` carries 0 and must still carry 0 after this run.** Verify it positively.
- ⛔ **No behavioural change to any script.** Comments and prose only. `dashboard.sh`'s grammar
  examples are documentation of a live parser — changing them changes what the parser is documented to
  accept.
- ⛔ **The `ai-agents/` half is not this task's.** The hyphenated open-brief class is `0309`.
- ⛔ **No `:NNN` line-number citations written into any coordination document.**
- ⛔ **No manifest regeneration, no installer change, no `.claude/` mirror edit** — `.claude/` copies
  are gitignored and refreshed by `claude/fkit-claude-init.sh .`.

## Verification steps

1. `grep -rInoiE '\btask[ -][0-9]{1,2}\b' claude/ --exclude-dir=scaffold | wc -l` is recorded in the
   worklog **before and after**, and both numbers are stated. ⚠️ **The after-count may legitimately be
   unchanged for the (b)/(c) sites** — the test is the triage table, not the count.
2. **The triage table in the worklog has one row per occurrence found in step 1**, and the row count
   equals the before-count. ⛔ A shorter table fails this step.
3. `grep -rInoiE '\btask[ -][0-9]{1,2}\b' claude/scaffold/ | wc -l` → **`0`**.
4. `grep -rInoiE '\btask[ -]43\b' claude/ | wc -l` → **`0`** (unchanged from `0306`).
5. **The wrap-join check is re-run and its result stated** — including if the answer is *"zero wrapped
   occurrences"*.
6. **No repaired site cites a board rank.** `grep -rInoiE '\bP[0-9]{1,3}\b' ` over the diff'd hunks
   shows no new rank citation.
7. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md >/dev/null; echo $?` → `0`,
   and the same for `ai-agents/sprints/backlog.md`. ⚠️ `dashboard.sh` carries 24 of the 48 sites; a
   comment edit that breaks it would be caught here.
8. `node --test test/*.test.js` passes (or the project's current test entry point — check `package.json`
   rather than trusting this line).
9. `git diff --stat` shows changes **only** under `claude/`, and **nothing** under
   `ai-agents/tasks/done/0306-*/`, `ai-agents/wiki-vault/`, or `ai-agents/sprints/sprint-6.md`.

## Notes

- **Depends on:** nothing.
- **Relates to:** `0309` (the hyphenated class in the open briefs — the `ai-agents/` sibling of this
  task), `0307` (the third `0306` residual), `0171` (the `durable-citation-anchors` convention page,
  closed 2026-08-22), `0176` (the coordination-citation policy guard) and `0237` (the residual cleanup
  `0176` needs).
- ⚠️ **`0171` does NOT gate this task.** The repair form for a stale task citation is already ruled —
  the folder `NNNN` ID, ADR-029 Decision 3, restated in `0160`'s report. `0171` writes that rule down
  as a convention page; it does not change it. ⭐ **But if `0171` lands first, read it and follow it.**
- ⚠️ **`0176`'s guard would not have caught this class.** `0176` is a *coordination-document* citation
  guard; `claude/` is source. ⛔ **Do not assume a guard is coming for this.** Whether one should exist
  is a question for the owner, not for this task.
- ⚠️ **Figures in this brief were re-derived at `HEAD` = `9360177` on 2026-08-15 against a DIRTY working
  tree**, with five `claude/` files modified but uncommitted. They are a dated observation, not a
  permanent fact. **Re-derive before acting.**
- ⛔ **Frozen — do not modify:** anything under
  `ai-agents/tasks/done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/`.
- ⛔ **Do not commit, push, `git add` or `git stash`** unless the owner explicitly asks.
