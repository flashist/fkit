# Implementation plan — task `0250`

**Fix the scaffold producer-row mirror omission — add `/fkit-task-brief` + regenerate the manifest**

Brief: `/Users/mark.dolbyrev/Workspace/fkit/ai-agents/tasks/done/0250-fix-the-scaffold-producer-row-fkit-task-brief-omission/brief.md`
Planned 2026-08-23. Every coordinate and claim below was **re-measured today** against the working tree at `05fd9d0`; the brief's own measurements are dated 2026-08-07 and are re-checked individually in §1.

---

## 1. What's actually wrong — measured today

### 1a. The defect is real and still present

`claude/scaffold/CLAUDE.md:23` — the producer row of the role table:

```
| **producer** | product & sprint planning, task briefs, task lifecycle | write code | `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` |
```

No `/fkit-task-brief`. The canonical declaration (`claude/skills-for-role.sh:51`) grants it:

```
    producer)  echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-initiate-project fkit-task-brief fkit-task-done fkit-task-cancelled fkit-status fkit-heal" ;;
```

So every consuming project scaffolded from this file receives a root `CLAUDE.md` whose role table under-reports the producer's primary procedure.

### 1b. All four brief-cited coordinates still hold (re-verified today)

| Carrier | Brief said | Measured today | Carries `/fkit-task-brief`? |
|---|---|---|---|
| `claude/skills-for-role.sh` | `:51` | `:51` ✅ unchanged | **yes** (canonical) |
| `claude/README.md` | `:47` short-form | `:47` ✅ unchanged | **yes** — `task-brief` |
| `ai-agents/knowledge-base/architecture.md` | (no line given) | `:151` role/skill table | **yes** |
| `claude/skills/fkit-team/SKILL.md` | `:54` | `:54` ✅ unchanged | **yes** |
| `claude/scaffold/CLAUDE.md` | `:23` | `:23` ✅ unchanged | **NO — the defect** |

Command used: `grep -n "producer" <each file>`. The brief's coordinates have **not** drifted despite 16 days and several sprint pushes — unusual, but measured, not assumed.

*(One provenance nit, cosmetic: `0245`'s review ledger cites the row at `:22` in its **Coder response** column and `:23` in its **findings** row. Today it is `:23`. Nothing turns on it.)*

### 1c. The producer row is the **only** wrong row — verified, not assumed

I diffed every row of the scaffold table against `skills_for_role()`:

| Table row | Matches canonical? |
|---|---|
| coder | ✅ `plan-task, process-review, process-stateful-review, task-ship-loop` |
| architect | ✅ `survey-project, inspect, design-spec, evaluate-approach, record-decision` |
| reviewer | ✅ `review, stateful-review` |
| adversarial-reviewer | ✅ `adversarial-review` |
| wiki | ✅ `wiki-ingest, wiki-lint, wiki-sync` |
| **producer** | ❌ missing `/fkit-task-brief` |

The **lead** role has no table row, but this is **deliberate, not a second omission**: `claude/scaffold/CLAUDE.md:37-38` covers the lead and `/fkit-sprint-ship-loop` in prose immediately below the table. **Do not "fix" it.**

### 1d. ⚠️ A brief claim that is imprecise — corrected here, not planned around

The brief says to insert `/fkit-task-brief` *"between `/fkit-initiate-project` and `/fkit-task-done`, matching the source-of-truth ordering."* Those two halves do **not** describe the same edit, because **the scaffold row does not follow `skills_for_role()` order** — the scaffold puts `/fkit-status` **second**, the canonical list puts it **fifth**.

Measured orderings:

| Carrier | Order |
|---|---|
| `skills-for-role.sh:51` (canonical) | initiate-project, **task-brief**, task-done, task-cancelled, status, heal |
| `README.md:47` | initiate-project, **task-brief**, task-done, task-cancelled, status, heal |
| `architecture.md:151` | initiate-project, **task-brief**, task-done, task-cancelled, status, heal |
| `fkit-team/SKILL.md:54` | initiate-project, status, **task-brief**, task-done, task-cancelled, heal |
| `scaffold/CLAUDE.md:23` | initiate-project, status, ——, task-done, task-cancelled, heal |

**Resolution — insert after `/fkit-status`.** This (a) satisfies the brief's explicit positional constraint literally (it lands between `/fkit-initiate-project` and `/fkit-task-done`), (b) makes the scaffold row **character-for-character identical in ordering** to its nearest twin `fkit-team/SKILL.md:54`, and (c) is a **pure single insertion** — no reordering.

**Deliberately NOT reordering the row to canonical order.** That would be a second content change to a file the brief fences at "the R10 line only", and it would gratuitously desynchronise the scaffold from `fkit-team/SKILL.md`. Two ordering conventions already coexist across the five carriers; unifying them is a separate question (see §6).

### 1e. The manifest regen is genuinely inseparable — proven, not reasoned

This mattered enough to test rather than argue, because `claude/scaffold/CLAUDE.md` maps to project path `CLAUDE.md`, which the generator hashes with **the lines strictly between the rules markers elided** (`bin/generate-structure-manifest.mjs`, contract point 2). Had line 23 fallen inside that block, the hash would **not** change and the regen would be unnecessary.

It does not. Markers measured today:

```
$ grep -n "fkit:begin-rules\|fkit:end-rules" claude/scaffold/CLAUDE.md
68:<!-- fkit:begin-rules -->
69:<!-- fkit:end-rules -->
```

Line 23 is **outside** lines 68–69, so it is hashed. Confirmed by applying the edit **in memory** (no file written) and running the generator's own exported `normalizeEndings` / `elideRulesRegion` / sha256:

```
current  hash 1a1071f60aaf73ce90e0a06d723865ff118c955d4a177ce2b8bd248288e54a12  present in manifest? true
post-edit hash 1d9a7e3b5272e2510bd18b8cf8acf5218f7336ddcd6f83f48ef70bca5be8b1fe  present in manifest? false
```

So without the regen, `test/structure-manifest.test.js` assertion **A** ("the committed manifest is byte-exactly what the generator produces today") goes red. **The brief's inseparability claim holds.**

### 1f. Baseline is green

```
$ node bin/generate-structure-manifest.mjs --stdout > <tmp> && diff -q claude/structure-manifest.tsv <tmp>
BASELINE GREEN: manifest matches generator output      (exit 0, no diff)

$ npm run test:unit
ℹ tests 730   ℹ pass 730   ℹ fail 0   duration_ms 64703
```

Manifest today: 88 lines, of which **17** are rows for project path `CLAUDE.md`.

*(Not run at plan time: `bash test/prove-red.sh`, the second half of `npm test`. It mutates throwaway **copies** of the launcher/hook files and its subjects are unrelated to the scaffold, so I expect it unaffected — but I did not execute it, and I am flagging that rather than implying I did. The build step runs it.)*

### 1g. ⚠️ The dirty-tree hazard is REAL but currently ABSENT — and the driver's briefing on this point is stale

The spawn briefing warned that the tree is "very dirty" (`0171`'s close, `0309`, task folders `0317`–`0323`, ~56 `wiki-vault/` paths). **That is no longer true** — those changes were committed in the sprint pushes since. Measured today:

```
$ git status --porcelain
 M ai-agents/sprints/sprint-6.md
 M ai-agents/tasks/backlog/0250-.../brief.md

$ git status --porcelain --untracked-files=all claude/
(empty)
```

Two modified files, **both the driver's own in-progress markings for this task**, and `claude/` is clean **including untracked files**.

**Why that fully disposes of the hazard here — mechanism, not luck.** The generator's working-tree half is `workingTreeFiles()` (`bin/generate-structure-manifest.mjs`), and it reads **only** `claude/scaffold/` — its `KNOWN` map is exactly `{ai-agents → walk, CLAUDE.md → root, AGENTS.md → root, universal-rules.md → skip}`, rooted at `join(REPO_ROOT, 'claude', 'scaffold')`. It never reads the live `ai-agents/` tree. The `ai-agents/…` project paths in the manifest come from the **git-history** half (`historicalBlobs()`), which reads committed blobs only.

**Therefore: uncommitted work under `ai-agents/` cannot be baked into the manifest. Only uncommitted work under `claude/scaffold/` can.** There is none. The two dirty files above are both under `ai-agents/` and are invisible to the generator.

This is why step 3 below is a **precise** guard (`git status --porcelain claude/scaffold/`) rather than the blunt "is the whole tree clean?" — the blunt check would block on the driver's own harmless markings and tempt the implementer to skip it.

### 1h. The brief's `0248` sequencing note is discharged

The brief warns that `0248` also plans scaffold edits and whoever lands second inherits a manifest diff. Measured: `ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability` — **`0248` is already closed and landed.** Its manifest regen is committed, and §1f shows the manifest currently green. No inherited diff, no conflict. Nothing to sequence around.

---

## 2. The change surface

**Exactly two files.**

| File | Change |
|---|---|
| `claude/scaffold/CLAUDE.md` | **One line, line 23.** Insert `` `/fkit-task-brief`, `` into the producer row's 4th column, immediately after `` `/fkit-status`, ``. Nothing else in the file. |
| `claude/structure-manifest.tsv` | **Regenerated** by `npm run generate:manifest`. Expected: exactly **one added row** — `1d9a7e3b5272e2510bd18b8cf8acf5218f7336ddcd6f83f48ef70bca5be8b1fe<TAB>CLAUDE.md` — placed by the generator's sort (path, then hash). 88 → 89 lines; `CLAUDE.md` rows 17 → 18. The pre-edit hash row **stays** (the manifest is append-only in effect: it records every version ever shipped, and the old content is in git history). |

**No other file changes.** Specifically **not**: `claude/skills-for-role.sh`, `claude/README.md`, `ai-agents/knowledge-base/architecture.md`, `claude/skills/fkit-team/SKILL.md` (all verified correct in §1b), the repo-root `CLAUDE.md` (independent file, carries no role table), `.claude/` (gitignored, init-refreshed copies), or any test.

### The exact edit

**Before** (`claude/scaffold/CLAUDE.md:23`):
```
| **producer** | product & sprint planning, task briefs, task lifecycle | write code | `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` |
```

**After**:
```
| **producer** | product & sprint planning, task briefs, task lifecycle | write code | `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` |
```

Unique-match anchor for the edit: the substring `` `/fkit-status`, `/fkit-task-done` `` → `` `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done` ``. Verified this substring occurs on line 23 and nowhere else in the file.

---

## 3. Steps, in order

1. **Re-confirm the line before touching it.**
   `grep -n "fkit-initiate-project" claude/scaffold/CLAUDE.md` → expect the line-23 producer row, still without `/fkit-task-brief`. If it already has it, **stop and report** — someone landed it in between.

2. **Make the single-line edit** to `claude/scaffold/CLAUDE.md` exactly as spelled out in §2.

3. **⛔ THE DIRTY-TREE GATE — run this before regenerating. Do not skip it.**
   ```
   git status --porcelain claude/scaffold/
   ```
   **The only line permitted in the output is `` M claude/scaffold/CLAUDE.md`` — your own edit from step 2.**
   - Anything else listed (another modified scaffold file, or an untracked one) → **STOP. Do not regenerate.** Regenerating would hash that foreign content into `structure-manifest.tsv` and ship someone else's uncommitted work as an fkit-blessed hash. This exact class of mistake produced a red `main` earlier in this sprint. Surface it and stop.
   - Also run `git status --porcelain --untracked-files=all claude/scaffold/` — a **new untracked file** under `claude/scaffold/` is the nastier variant, since `workingTreeFiles()` reads the directory rather than the index and will either hash it or (for an unrecognized top-level entry) throw a loud "unrecognized entry in claude/scaffold/" error.
   - Dirty files **outside** `claude/scaffold/` are **fine and expected** (the driver's `sprint-6.md` and `brief.md` markings) — see §1g for why they cannot reach the manifest. Do not block on them.

4. **Regenerate:** `npm run generate:manifest`.
   Expected: exit 0, silent, rewrites `claude/structure-manifest.tsv` only.

5. **Inspect the manifest diff before trusting it:** `git diff --stat claude/structure-manifest.tsv` and `git diff claude/structure-manifest.tsv`.
   Expected: **`1 file changed, 1 insertion(+)`** — one added line, the `1d9a7e3b…` row for `CLAUDE.md`. **Any deletion, any second insertion, or any row for a path other than `CLAUDE.md` means the gate in step 3 leaked** — investigate before proceeding; do not "just commit it".

6. **Run the tests** (§4).

7. **Write the task worklog** (`ai-agents/tasks/backlog/0250-.../worklog.md`) per the loop's normal practice, including the decision log entry for the §1d ordering call.

8. **Stop. Do not commit, do not push, do not move the task folder.** The close routes to a spawned `@fkit-producer`.

---

## 4. Verification — exact commands, and what counts as pass

| # | Command | Pass condition |
|---|---|---|
| V1 | `grep -n "fkit-task-brief" claude/scaffold/CLAUDE.md` | Exactly one hit, on **line 23**, inside the producer row. |
| V2 | `git diff --stat claude/scaffold/CLAUDE.md` | **`1 file changed, 1 insertion(+), 1 deletion(-)`** — i.e. exactly one line rewritten. Anything more violates the brief's out-of-scope fence. |
| V3 | `git diff claude/scaffold/CLAUDE.md` | The `-`/`+` pair is exactly the before/after in §2, differing only by `` `/fkit-task-brief`, ``. |
| V4 | `git diff --stat claude/structure-manifest.tsv` | **`1 file changed, 1 insertion(+)`**, zero deletions. |
| V5 | `awk -F'\t' '$2=="CLAUDE.md"' claude/structure-manifest.tsv \| wc -l` | **`18`** (was 17). And `grep -c 1d9a7e3b5272e2510bd18b8cf8acf5218f7336ddcd6f83f48ef70bca5be8b1fe claude/structure-manifest.tsv` → **`1`**. |
| V6 | **Prove it was needed (brief step 3's "would have failed without the regen").** Before step 4, or on a stashed copy: `node --test test/structure-manifest.test.js` | **RED** at assertion **A** ("the committed manifest is byte-exactly what the generator produces today"). Capture the output into the worklog — this is the red-first evidence. Then regenerate and re-run → green. |
| V7 | `npm test` | Green. `test:unit` → **`pass 730`, `fail 0`** (baseline count; a change in this number is itself a signal). Then `test/prove-red.sh` completes without failure. Suites that must specifically pass: `structure-manifest.test.js`, `structure-spec.test.js`, `dual-home-parity.test.js`. |
| V8 | Five-carrier agreement — `grep -n "task-brief" claude/skills-for-role.sh claude/README.md ai-agents/knowledge-base/architecture.md claude/skills/fkit-team/SKILL.md claude/scaffold/CLAUDE.md` | All five carriers report `/fkit-task-brief` for the producer. |
| V9 | `git status --porcelain` | Modified: `claude/scaffold/CLAUDE.md`, `claude/structure-manifest.tsv`, the task's `worklog.md`, plus the driver's pre-existing `sprint-6.md` / `brief.md`. **Nothing else.** |

**Note on V6 ordering:** the cheapest honest way to get it is to run `node --test test/structure-manifest.test.js` **between step 2 and step 4** (edit made, manifest not yet regenerated). That is the natural red window — no stashing needed.

---

## 5. Risks, failure modes, and what I am deliberately not doing

### Risks

- **🔴 The dirty-tree hazard (highest, and the one that has burned this project).** Fully analysed in §1g and gated in step 3. Currently absent, but the tree is live and another worker could dirty `claude/scaffold/` between now and the build. **The gate must be run at build time, not trusted from this plan.** My measurement is 2026-08-23 and can go stale exactly the way the brief's did.
- **🟡 An untracked file appearing under `claude/scaffold/`.** Worse than a modified one: `workingTreeFiles()` walks the directory, not the index. A new file under `claude/scaffold/ai-agents/` gets silently hashed into the manifest; a new **top-level** entry makes the generator throw a loud `unrecognized entry in claude/scaffold/` error. Step 3's `--untracked-files=all` check covers both.
- **🟡 Concurrent sprint work regenerating the manifest.** If another task lands a scaffold edit + regen between my step 2 and step 4, my regen sits on top of theirs and V4's "1 insertion, 0 deletions" will not hold. That is a **signal to stop and re-baseline**, not to override.
- **🟢 Markdown table integrity.** The row gains one cell-internal item, no new `|`. Column count is unchanged, so the table cannot break.
- **🟢 CRLF / encoding.** The edit is pure ASCII into an existing ASCII line; the generator normalises CRLF→LF before hashing anyway. No exposure.
- **🟢 Dual-home parity.** `test/dual-home-parity.test.js` scopes itself to `ai-agents/` vs `claude/scaffold/ai-agents/` (verified in its header). The root `claude/scaffold/CLAUDE.md` is **not** in that walk, so there is no second home to keep byte-identical. The repo-root `CLAUDE.md` is an independent file, not a copy.
- **🟢 `structure-spec.test.js`.** Its assertions are over the **path set** (directory-set equality, file-set equality, spec ⊆ manifest paths). This change adds no path and removes none — only a hash for an existing path. Unaffected.

### Deliberately NOT doing

- **Not reordering the producer row** to canonical `skills_for_role()` order (§1d). Out of the brief's "R10 line only" fence, and it would desync the scaffold from `fkit-team/SKILL.md:54`.
- **Not touching the other four mirrors** — verified correct today (§1b).
- **Not adding a lead row** to the scaffold table — the omission is deliberate, covered in prose at `:37-38` (§1c).
- **Not unifying the two competing skill-list orderings** across the five carriers (§6, Q1).
- **Not adding a test** that pins scaffold-mirror ↔ `skills_for_role()` agreement (§6, Q2). It would be a genuinely good guard and would have caught this defect mechanically — but it is new scope, new test-category argument, and not what the brief asks for.
- **Not committing, not pushing, not moving the task folder, not writing `ai-agents/wiki-vault/`.**

---

## 6. Open questions for the owner

**None that block implementation.** The plan is executable as written. Two observations are recorded for the owner's awareness — **both are explicitly out of scope for `0250` and neither needs an answer before the build proceeds**:

- **Q1 (cosmetic, non-blocking).** The five carriers use **two different orderings** of the producer's skills: `skills-for-role.sh` / `README.md` / `architecture.md` put `/fkit-status` **fifth**; `fkit-team/SKILL.md` and `scaffold/CLAUDE.md` put it **second**. All five will list the same six skills after this change — only the order differs. Worth a tidy-up task some day, or worth explicitly declaring "order is not normative". Not this task.

- **Q2 (worth considering later).** This defect was a hand-maintained mirror drifting from its source of truth — the **exact** failure class `claude/skills-for-role.sh:12-23` documents having already cost this project twice ("Task 70 … shipped a false statement into every consuming project"; "task 14 … `/fkit-team` under-reported the producer's primary procedure for two days"). The checklist is prose; a test could make it mechanical. Filing that as its own task is a producer/owner call, not mine.

---

### Notes on this planning run

- **No files written, nothing edited** — the plan/build fence honoured. The hash simulation in §1e ran entirely in memory via `node --input-type=module -e`. I did create two temporary files in the session scratchpad (outside the repo) to `diff` the generator's `--stdout` against the committed manifest, and **removed them**; nothing was written inside the repository.
- **Not verified this turn:** `bash test/prove-red.sh` (§1f). Everything else stated above was executed today.

---

## Driver's note on this file (fkit-sprint-ship-loop, 2026-08-23)

Written by the **driver** at plan approval, before the Build spawn, per `fkit-sprint-ship-loop/SKILL.md`
§*Durable artifacts*. Owner approved via `AskUserQuestion` in a live `fkit lead` session, 2026-08-23 —
**verbatim option label: "Approve (Recommended)"**.

⚠️ **One transcription note, disclosed rather than hidden.** The planning worker's text reached the driver
through a transport that HTML-escaped five character sequences — `&`, `<`, `>` appeared as entities. The
driver decoded those back to the characters the plan plainly intends (e.g. `product & sprint planning`,
`<!-- fkit:begin-rules -->`, `> <tmp>`). **No other byte was altered, and nothing was summarised,
re-rendered or omitted.** This is stated because the loop's faithful-carry construction turns on the word
"verbatim", and a silent decode — however obviously correct — is exactly the class of undisclosed
transformation that construction exists to prevent.
