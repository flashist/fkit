# Plan — `0223` Enumerate the Process-review row's method steps, and give the row its reason

**Task:** `ai-agents/tasks/done/0223-enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason/brief.md`
**Sprint 6 P12 · Owner `fkit-coder` · Size: small (one table row, one file)**
All measurements below were taken this turn against the working tree at HEAD `c45ec3d`.

---

## 1. What's actually wrong — measured today

### 1a. The defect still exists, at a moved coordinate

```
$ /usr/bin/grep -n 'fkit-process-stateful-review' claude/skills/fkit-sprint-ship-loop/SKILL.md
126:| **Process review** | `@fkit-coder` | apply `fkit-process-stateful-review` **method** — verify each
finding, classify defect/frontier, write the *Coder response*; **apply verified-`CORRECT`,
in-approved-plan fixes autonomously (task-loop discipline, ADR-019)**; **record each
autonomously-applied fix and each obvious-winner call in the task folder's `worklog.md` decision log —
per entry: which finding it answers, what changed, and why it qualified; record `none` if none**
(ADR-032 A2 / ADR-019 `:96`); return change surface + residuals, and **return `NEEDS-DECISION` for any
judgment call** | **⛔ stop for judgment calls** — frontier-move, regression, disputed severity,
broad/behavior-changing, or out-of-plan fix |
```

- File is 414 lines. The row is **line 126**, **not `:124`** as the brief states.
- The row's **content has also grown** since the brief was written (2026-08-05): it now carries the ADR-019 autonomy clause and the ADR-032 A2 worklog decision-log clause. The brief's block quote of the row is stale.
- **The defect itself is unchanged and still true:** the row names the method (`verify each finding, classify defect/frontier, write the *Coder response*`) and never says what the method contains. Steps 0, 1, 2, 3, 3.5, 5, 6, 7 are nowhere in it.
- The `/`-prefix + verb-`run` anomaly the brief cites is still real and still one row wide: `Plan` = "run `/fkit-plan-task`", `Review` = "→ `/fkit-stateful-review`", `Close` = "run `/fkit-task-done`"; `Process review` = "apply … **method**". That anomaly is **explained by ADR-019, not accidental** — it must stay.
- `run /fkit-process-stateful-review` appears **nowhere** under `claude/` (grepped, zero hits). Baseline for verification step 1 confirmed.

### 1b. The brief's eight line numbers in `fkit-process-stateful-review/SKILL.md` — all EIGHT still hold

Re-verified first-hand today against `claude/skills/fkit-process-stateful-review/SKILL.md` (239 lines):

| Brief's cite | Measured today | Content |
|---|---|---|
| `:174` (gate — EXCLUDE) | ✅ `:174` | *"For anything requiring a code change, set Status = `pending approval` (nothing is applied yet)."* |
| `:191` (gate — EXCLUDE) | ✅ `:191` | *"Then **wait for my explicit approval** before changing any code."* |
| `:197` (gate — EXCLUDE) | ✅ `:197` | *"Once I explicitly approve specific findings:"* |
| `:167` (KEEP) | ✅ `:167` | `## Step 4 — Assign verdicts and write the Coder response rows` |
| `:170` (KEEP) | ✅ `:170` | *"write a row into *Coder response* for each, keyed by finding id"* |
| `:182` (KEEP) | ✅ `:182` | `## Step 5 — Report + convergence call, then gate on approval` |
| `:201` (KEEP) | ✅ `:201` | *"Update the *Coder response* row … Status to `✅ done`"* |
| `:203` (KEEP) | ✅ `:203` | *"add an entry to **Accepted residuals**"* |
| `:207` (KEEP) | ✅ `:207` | *"set the document header **Status: closed-out**"* |

ADR-038's own cite of `claude/skills/fkit-process-stateful-review/SKILL.md:195` (Step 6 heading — *"Apply approved fixes + update the shared file"*) is also **correct today**. The file is unmoved; ADR-032 keeps it byte-unchanged, so these cites are stable.

**Full step inventory measured today:** Step 0 (`:98`), 1 (`:113`), 2 (`:124`), 3 (`:135`), 3.5 (`:151`), 4 (`:167`), 5 (`:182`), 6 (`:195`), 7 (`:214`). Status vocabulary at `:85`.

### 1c. The dependency is discharged — verified, not taken on trust

```
0222 | ai-agents/tasks/done/0222-record-adr-038-… | ✅ Done (agent-closed — not owner-verified)
```
`ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md` exists, 147 lines. **Current dependency: nothing.**

### 1d. What ADR-038 actually says the reason must match

Read in full. The load-bearing sentences the row's reason clause must mirror:

> **"A loop step's role is fixed by the skill the step runs, not by the deliverable's author."**
>
> "Concretely: the Process-review step is always `@fkit-coder`, **whoever wrote the deliverable under review** — because the step runs `fkit-process-stateful-review`, which **writes the review ledger's coder-owned section** and **whose Step 6 applies approved code fixes** (`claude/skills/fkit-process-stateful-review/SKILL.md:195`). **Neither of those changes when the deliverable is a document rather than code.**"

Also binding, from ADR-038 §*Gate non-reimposition*:

> "This rule governs *role selection* only: the loop's single up-front approval still replaces the stateful-review skill's per-round owner gate (ADR-019 / ADR-032; report finding R1), and **the loop row's "apply … method" construction stays.**"

And ADR-038 chose option **(a)**: *"the loop's step row names the owning role and **why** (the skill the step runs)"* — i.e. the reason belongs **in the row**, and its two grounds are exactly (i) the coder-owned *Coder response* section and (ii) Step 6's source-write.

The source report `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` §3 and §8 item 1 were read and confirm the scope guard verbatim ("carve out those clauses, NOT the steps wholesale"). The `0195` cost is corroborated on disk in `ai-agents/tasks/done/0195-…/worklog.md` around `:245-260` — its Round-3 decision log records *"Skill Step 0/2/3/3.5 — steps the hand-application never ran"* and *"Skill Step 4 — Status cells use none of the six prescribed values"*.

### 1e. Brief claims that are now FALSE — reported, not planned around

1. **`:124` is wrong; the row is at `:126`.** The quoted row text is also stale (two clauses added since).
2. **The contention list is stale.** The brief names `0203`, `0208`, `0224` as co-editors of this file. Measured today: **`0203` ✅ Done**, **`0208` ✅ Done**. Only `0224` remains open of that list — and the brief does not know about `0204` or `0333`, which are the live ones (see §5).
3. **Verification step 7's command does not work.** The brief says `node --test test/`. Run today:
   ```
   $ node --test test/
   … MODULE_NOT_FOUND … ℹ tests 1  ℹ pass 0  ℹ fail 1
   ```
   The repo's actual command is `node --test test/*.test.js` (`package.json:6`). I will use the working command and note the brief's is wrong.
4. **Verification step 2 is internally inconsistent with the brief's own KEEP table.** Step 2 requires "Steps 0, 2, 3, 3.5 … plus Steps 1, 4, 6 and 7" — it omits Step 5. But the KEEP table explicitly requires Step 5's *report + convergence call* (`:182`). Step 2 says "at minimum", so including Step 5 satisfies both. **I will include Step 5** (its non-gate half only).
5. **The brief's "Sprint 2 may be the intended home" flag is superseded** — the task is Sprint 6 P12 today, marked `🔄 In progress` in both locations. Not an open question any more.

---

## 2. The change surface

**Exactly one file: `claude/skills/fkit-sprint-ship-loop/SKILL.md`.**

**Exactly one line: `126`** — the step-2 table's **Process review** row. Within that line, **two cells**:

| Cell | Region | Change |
|---|---|---|
| 2 — *Driver spawns* | `` `@fkit-coder` `` | **append** the ADR-038 reason clause |
| 3 — *Worker does* | begins `apply \`fkit-process-stateful-review\` **method** — verify each finding, …` | **replace** the opening gloss with the enumerated method; leave the autonomy + worklog + `NEEDS-DECISION` clauses that follow **byte-identical** except for one added `✅ done` bridge (OQ-1) |

| Cell | Region | Change |
|---|---|---|
| 1 — *Step* | `**Process review**` | none |
| 4 — *Owner gate* | `**⛔ stop for judgment calls** — …` | none |

**Regions of `fkit-sprint-ship-loop/SKILL.md` NOT touched** (stated for collision arithmetic):

- `:1-8` frontmatter · `:12-19` owner banner · `:21-49` Overview · `:53-69` honesty clause · `:73-87` Durable artifacts · `:91-118` §1 and §2 preamble
- `:120-125` and `:127` — the other five table rows and the header
- `:129-149` "Why the driver writes `plan.md`"
- **`:151-249` the entire "Rules that make this honor the ADRs" block**, including the six-step faithful-carry construction, the FIVE-site list, the pointer-only refusal, and the "honest bound" paragraph
- `:251-262` remaining rules · `:264-333` §3–§5 · `:337-376` exit table + invariants + notes · `:380-414` Hard rules + Usage

### The `0204` five-site constraint — measured, and unaffected

Verified first-hand today. The count is **still FIVE**, enumerated at `:205-214`, and the sites live at:

| Site | Location today |
|---|---|
| 1. `unverified …` line inside the fenced pointer form | `:194` |
| 2. the ⚠️ instruction to emit that literal every time | `:196-200` |
| 3. *"The hash is self-computed and self-reported; nothing checks it until `0204`'s … hook lands …"* | `:198-200` |
| 4. the clause *"and until `0204`'s carry-check hook lands, nothing does"* in the honest-bound paragraph | `:248` |
| 5. the site list itself and its introducing sentence | `:204-214` |

**My change adds, moves, and renumbers ZERO of these.** A markdown table row is a single physical line, and both edited cells are on line 126 — the line **grows in width, not in count**. Every line below 126 keeps its current number. I will re-run `wc -l` after the edit and assert it still reads **414**; if it does not, the edit was malformed and I stop.

### The `0333` pointer-only prose — untouched

The prose `0333` amends (*"A pointer-only spawn **fails condition (b) as written**, so the spawned coder **must refuse it**"*) is at **`:225-229`**, inside the untouched Rules block. My change does not touch it, does not restate condition (b), and does not touch the owner's "Sanction the verified-pointer form (Recommended)" territory. **The still-false-until-`0333`-lands refusal text is deliberately left exactly as it is.**

### Files NOT changed, with the reason

- `claude/skills/fkit-process-stateful-review/SKILL.md` — ⛔ ADR-032 keeps it byte-unchanged.
- `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`, `test/**` — ⛔ brief's out-of-scope list.
- `claude/structure-manifest.tsv` — **no regen needed, verified not assumed.** `bin/generate-structure-manifest.mjs` walks only `claude/scaffold/ai-agents/`, `omnigent/scaffold/ai-agents/`, `generic/ai-agents/` and four root `{CLAUDE,AGENTS}.md` paths (`:70-80`, `:260-270`). `grep -c 'skills' claude/structure-manifest.tsv` → **0**. `claude/skills/` is not in the manifest at all.
- `.claude/skills/fkit-sprint-ship-loop/SKILL.md` — gitignored fkit-managed copy; per `CLAUDE.md`, edit the canonical source only. Every test reads `claude/`, not `.claude/` (`prove-red.sh` copies `$repo/claude`).
- `ai-agents/knowledge-base/reports/2026-07-22-design-…md` carries a copy of this table in §5.2, and five frozen task/sprint records quote the row. **All are historical records — not edited.**

---

## 3. The steps, in order

1. **Re-verify the coordinates in the same turn as the edit** (they moved once already):
   `/usr/bin/grep -n 'fkit-process-stateful-review' claude/skills/fkit-sprint-ship-loop/SKILL.md` and `wc -l` on both SKILL.md files. If the row is no longer at `:126` or the eight cites in §1b have shifted, re-derive before editing.
2. **`Read` line 126** to pin the exact current bytes for the `Edit` anchor.
3. **Edit cell 2** — append the reason clause after `` `@fkit-coder` ``:

   > `` `@fkit-coder` `` — **always, whoever authored the deliverable under review** ([ADR-038](../../../ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)): a loop step's role is fixed by **the skill the step runs**, and this one writes the ledger's **coder-owned *Coder response*** section and **applies code fixes at its Step 6** (`fkit-process-stateful-review/SKILL.md:195`). Neither changes when the deliverable is a document rather than code.

   (Relative link depth `../../../` matches the file's existing ADR links at `:24-25`. The `fkit-process-stateful-review/SKILL.md:195` sibling-shorthand matches this file's house style at `:41`.)

4. **Edit cell 3** — replace the opening gloss `apply \`fkit-process-stateful-review\` **method** — verify each finding, classify defect/frontier, write the *Coder response*;` with:

   > apply `fkit-process-stateful-review` **method** — **all of its steps, none of its per-round owner gate** (this loop's single up-front approval replaces that gate; ADR-019 / ADR-032, and the skill itself stays byte-unchanged). ⚠️ **A subset is not the method:** on `0195` a hand-application skipped Steps 0, 2, 3 and 3.5 and used none of Step 4's prescribed Status values, and looked complete to the worker doing it. Run **every** step: **0** — open or create `<task-folder>/review.md`, load *Accepted residuals* **and skim `ai-agents/knowledge-base/decisions/` for ADRs in scope** (an ADR's *"Re-raise only if"* binds exactly like a residual); **1** — identify the **novel** findings (those with no *Coder response* row yet); **2** — loop-check each against those residuals **and** ADRs, and say **loudly** when an unmet *"Re-raise only if"* makes one `closeout`; **3** — verify each against the actual code at `file:line`, **deriving severity yourself, never inheriting the reviewer's label**; **3.5** — classify **defect vs frontier-move**, and run the **regression / oscillation check** against the prior rounds already in the file; **4** — assign **CORRECT / PARTIALLY CORRECT / INCORRECT / INCOMPLETE** and write **one *Coder response* row per finding id** (verdict, defect/frontier, action, status — **from the skill's prescribed Status vocabulary**, not ad-hoc labels); **5** — report the summary table, the **suppressed-as-settled** list, and the **convergence call**; **6** — set each row's Action to what you actually did and its Status to `✅ done`, add an ***Accepted residuals*** entry for any confirmed intended tradeoff, and set the document header **Status: closed-out** when nothing blocking remains; **7** — final report. **Never edit the *Reviewer findings* section.** Then: **apply verified-`CORRECT`, in-approved-plan fixes autonomously (task-loop discipline, ADR-019)** — *[OQ-1: and under that standing approval such a fix lands at Status `✅ done` in the same round]*; **record each autonomously-applied fix …** *(remainder of the cell unchanged, byte-for-byte)*.

5. **Assert no line-count drift:** `wc -l` still `414`; the FIVE `0204` sites still at `:194 / :196-200 / :198-200 / :248 / :204-214`.
6. **Run the verification battery** (§4).
7. **Write `worklog.md`** in the task folder — including the honest limit required by brief verification step 8 (§4c) and a decision log (`none` if I applied nothing unattended).
8. **Stop.** No commit, no push, no task-file move.

---

## 4. Verification — exact commands and pass criteria

### 4a. Grep assertions (map 1:1 to the brief's verification steps 1–6)

```bash
F=claude/skills/fkit-sprint-ship-loop/SKILL.md

# (1) row present, keeps the literal **method**, invocation form absent
/usr/bin/grep -n 'fkit-process-stateful-review' "$F"
/usr/bin/grep -c 'apply `fkit-process-stateful-review` \*\*method\*\*' "$F"   # expect 1
/usr/bin/grep -c 'run /fkit-process-stateful-review' "$F"                    # expect 0
/usr/bin/grep -rc 'run /fkit-process-stateful-review' claude/                # expect 0 everywhere

# (2) all nine steps named in the row
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -o '\*\*[0-9]\(\.5\)\?\*\*' | sort -u
#   expect: **0** **1** **2** **3** **3.5** **4** **5** **6** **7**

# (3) no gate clause reproduced, no wait-for-approval instruction
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c 'pending approval'            # expect 0 (or 1 iff OQ-1 resolves "include the bridge with the negation")
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -ci 'wait for my explicit approval\|Once I explicitly approve'  # expect 0

# (4) the four non-gate obligations present
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c 'Coder response'             # >= 2
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c 'Accepted residuals'         # >= 1
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c 'Status: closed-out'         # >= 1
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c '✅ done'                     # >= 1

# (5) reason clause: both grounds + ADR-038
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c 'adr-038'                    # expect >= 1
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c 'coder-owned'                # expect >= 1
/usr/bin/sed -n '126p' "$F" | /usr/bin/grep -c 'Step 6'                     # expect >= 1

# (5b) 0204's five sites unmoved
wc -l "$F"                                                                   # expect 414
/usr/bin/grep -n "there are FIVE, not the two most visible" "$F"             # expect :205
/usr/bin/grep -n "until \`0204\`'s carry-check hook lands, nothing does" "$F" # expect :248

# (6) exactly one file changed
git diff --stat        # expect exactly: claude/skills/fkit-sprint-ship-loop/SKILL.md | 2 +-
```

⚠️ **`git diff --stat` will also show the pre-existing uncommitted `0046`/`0327` work and task folders that are not mine.** The pass criterion is narrowed to: **`git diff --stat -- claude/` shows exactly one file**, and no `claude/` file other than this SKILL.md appears.

### 4b. Test suites — measured baseline, taken today, before any edit

```
$ node --test test/*.test.js
ℹ tests 747  ℹ pass 747  ℹ fail 0  ℹ suites 24  ℹ duration_ms 50206

$ bash test/prove-red.sh
22. ✓ Released headline unreachable — "0288/default-released" should go RED ... red
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

**Post-edit pass criterion: identical — 747/747, fail 0; prove-red 22/22, hard gate PASSED.** Any deviation is a regression I introduced and I stop and report it.

Which suites can even see this file, checked rather than assumed:

- **`test/skill-frontmatter.test.js`** walks `claude/skills/*/SKILL.md` and asserts the live corpus's **frontmatter** (`name`/`description` block scalars) and a **count of 25 skills**. It will parse my edited file. It asserts **nothing about the body prose** — so it catches a *malformed* edit (a stray delimiter, a broken block scalar) and nothing more.
- **`test/prove-red.sh` mutation 9** deliberately targets `claude/skills/fkit-sprint-ship-loop/SKILL.md` — but it operates on a **copy tree** (`cp -R "$repo/claude" "$m9_tree"`) and mutates the **second content line of the `description: >-` block scalar**, anchored on structure. My edit is at body line 126. **Unaffected**, and I will confirm mutation 9 still reports `red` rather than the "MUTATION WAS A NO-OP" disarm message.
- **`test/dual-home-parity-exceptions.mjs` / the parity test** compare `ai-agents/` against `claude/scaffold/ai-agents/`. `claude/skills/` is outside their scope entirely.
- **`test/structure-manifest.test.js`** regenerates from `claude/scaffold/` only (see §2). No regen, and it cannot go stale from this edit. I will still run the full suite, which includes it.

### 4c. ⚠️ The honest limit — what a test can and cannot prove here

**There is no red-first available for this change, and I will not manufacture one.**

- This is a **prose/procedure edit to a skill document**. No test in this repo asserts the content of this row. Writing one is **`0225`'s** task ("loop-table row↔ownership test"), explicitly filed as a separate follow-up in ADR-038 §Consequences — building it here would be doing another task's work.
- **What the suites actually prove:** that the edit did not malform the file's frontmatter, break the 25-skill corpus scan, or regress any of the 747 unit assertions or the 22 mutation gates. That is a **not-broken** proof, not a **correct** proof.
- **What only reading proves:** that the enumerated steps match the skill, that the three gate clauses are absent, and that the reason clause matches ADR-038. Those are the grep assertions in §4a plus a manual diff read. Greps prove **presence of tokens**, not **fidelity of meaning**.
- **The residual the brief itself names (verification step 8), which I will record in `worklog.md` verbatim in substance:** an enumerated row still relies on the driver and the worker **reading** it. It is a **prose control, not prevention** — exactly the tradeoff ADR-038 §*Accepted tradeoff* accepts. **Detection is `0224`'s job, not this task's.** This change makes a partial application *visible* to a worker who reads the row; it makes nothing *impossible*.

---

## 5. Risks, collision surface, and what I am deliberately NOT doing

### Collision surface on `claude/skills/fkit-sprint-ship-loop/SKILL.md`

| Task | Status today | Its region | Collides with mine? |
|---|---|---|---|
| **`0223`** (this) | 🔄 In progress | **line 126 only** — cells 2 and 3 of the Process-review row | — |
| **`0204`** (P13) | 🔲 Backlog | the FIVE sites: `:194`, `:196-200`, `:198-200`, `:248`, `:204-214` | **No.** Disjoint regions, and **zero renumbering** — the row is one physical line that grows in width, not in count. `0204` should still re-verify its coordinates, but nothing in this change moves them. |
| **`0333`** (unranked) | 🔲 Backlog | the pointer-only refusal prose at `:225-229` (condition (b)) | **No.** Untouched, and I do not restate condition (b) anywhere. |
| **`0224`** | 🔲 Backlog | the misroute detector pair — hook denial log + a mandatory `**Role:**` line per worklog round | **Possibly — same line.** The Process-review row already carries the ADR-032 A2 worklog decision-log clause. If `0224` amends that clause, it amends **line 126**, the line I am rewriting. **`0224` must re-derive line 126 in full after this lands.** I leave that clause byte-identical precisely so its diff stays legible. |
| `0203`, `0208` | ✅ Done | already landed | No. The brief's warning about them is stale. |

### Risks

1. **Row length.** Line 126 becomes very long (~2,800 chars). This file already carries a ~2,000-char cell in the exit table (`:348`), so it is in keeping — but a long row is harder to diff and is itself the thing `0224` will have to re-derive. **Accepted; called out.**
2. **A markdown table cell cannot contain a literal `|`.** My proposed text contains none. I will re-check before writing, and the frontmatter suite will not catch a broken table — only reading will.
3. **Enumerating Step 4 could lead a worker to park everything at `pending approval`**, stalling a loop whose premise is a standing approval. This is what OQ-1 addresses. **If OQ-1 resolves "omit", this risk is real and unmitigated** and I will say so in the worklog rather than mitigating it silently.
4. **The row's fidelity is only as good as the skill it summarizes.** If `fkit-process-stateful-review/SKILL.md` ever changes, the enumeration silently drifts. ADR-032 keeps that file byte-unchanged, so the risk is low today — but nothing detects the drift. **Noted, not fixed; that is `0225`'s territory.**
5. **Coordinates move.** They moved once between the brief and now (`:124`→`:126`). Step 1 re-verifies in the same turn as the edit.

### Deliberately NOT doing

- ⛔ Not changing `**method**` to `run /fkit-process-stateful-review` — settled, reversed in Round 1, ADR-019 §Rejected.
- ⛔ Not editing `claude/skills/fkit-process-stateful-review/SKILL.md` — ADR-032 byte-unchanged.
- ⛔ Not enumerating the three gate clauses at `:174` / `:191` / `:197`.
- ⛔ Not writing "every step except 4/5/6" — the opposite-direction failure the brief and report §8 both forbid.
- ⛔ Not changing the row's `@fkit-coder` value (already correct; report S7).
- ⛔ Not touching `skills-for-role.sh`, `skill-ownership-hook.sh`, or `test/`.
- ⛔ Not building `0204`'s carry-check hook, not deleting any of its five sites.
- ⛔ Not landing `0333`'s verified-pointer amendment, and **not** correcting the now-superseded "a pointer-only spawn must be refused" text — it stays false-pending-`0333` on purpose.
- ⛔ Not building `0224`'s detector or `0225`'s row↔ownership test.
- ⛔ Not regenerating `structure-manifest.tsv` (verified unnecessary).
- ⛔ Not refreshing the gitignored `.claude/` copies.
- ⛔ Not committing, not pushing, not moving the task file.

---

## 6. Open questions for the owner

**OQ-1 — the `✅ done` bridge clause. (Recommend: include.)**
Enumerating Step 4 tells the worker to write a *Coder response* row with a Status. In the skill as written, anything needing a code change gets `pending approval` — but that is the gate clause at `:174`, which this loop's standing approval replaces. Without a bridge, an enumerated Step 4 could lead a worker to park an in-plan `CORRECT` fix at `pending approval` and stall.

- **(A) Include the bridge (Rec):** add *"under that standing approval an authorized fix lands at Status `✅ done` in the same round"* to the autonomy clause. **Consequence:** the enumeration is self-consistent with the loop; costs ~15 words and one arguable inch of scope beyond "enumerate the steps".
- **(B) Omit it:** the row stays strictly within "enumerate + reason". **Consequence:** minimal diff, cleanest scope — but leaves a worker who reads Step 4 literally able to stall the loop, and I would record that as an unmitigated residual.

**OQ-2 — where the reason clause goes. (Recommend: cell 2.)**
ADR-038 says the row "names the owning role and *why*", and brief verification step 5 says "the row carries a reason clause".

- **(A) In cell 2, *Driver spawns* (Rec):** the reason sits where the driver's eye lands when picking the role. **Consequence:** cell 2's column becomes ragged (other rows hold just `@fkit-coder`) — cosmetically inconsistent, functionally best-placed.
- **(B) At the head of cell 3, *Worker does*:** keeps cell 2 uniform. **Consequence:** the reason for the *role* sits in the cell about the *work*, one column away from the decision it governs.
- **(C) A footnote paragraph below the table:** most readable. **Consequence:** arguably not "the row", which is what both ADR-038 and the brief's verification step 5 require — I would flag it as a knowing deviation.

**No other open questions.** The `0222` dependency is discharged and verified, ADR-038 is on disk and read, and the brief's "Sprint 2 may be the intended home" flag is superseded by its Sprint 6 P12 placement.

---

## What's next?

1. **Approve, amend, or reject this plan** — and answer **OQ-1** and **OQ-2**, since both change the bytes that go into line 126.
2. On approval, the driver writes this text verbatim to `<task-folder>/plan.md` and spawns Build under the declared-approval marker. Build is one `Edit` to one line, then the §4 battery.
3. **Sequencing note for the sprint:** `0224` should be driven **after** this task, and must re-derive line 126 in full — it is the one task whose region genuinely overlaps mine. `0204` and `0333` are unaffected and can be driven in any order relative to this.

---

## Owner's answers to §6 — recorded by the driver at approval (2026-08-24)

All given live via `AskUserQuestion` in a `fkit lead` session driving `/fkit-sprint-ship-loop`. **Option labels verbatim.**

| Q | Ruling | Verbatim option label |
|---|---|---|
| **Plan** | **Approved as written**, on OQ-1(A) + OQ-2(A). | **"Approve (Recommended)"** |
| **OQ-1 — the `✅ done` bridge** | **(A) INCLUDE the bridge.** Add *"under that standing approval an authorized fix lands at Status `✅ done` in the same round"* to the autonomy clause. ⛔ The §4a grep for `pending approval` therefore expects **0 or 1** per the plan's own parenthetical — resolve which and state it. | **"Include the bridge (Recommended)"** |
| **OQ-2 — reason clause placement** | **(A) In cell 2, *Driver spawns*.** The ragged-column cost is accepted. | **"Cell 2, `Driver spawns` (Recommended)"** |

⚠️ **Both consequences the plan named are accepted, and are recorded here so they are not later rediscovered as defects:**
- OQ-1(A) costs **one arguable inch of scope** beyond "enumerate the steps". Accepted deliberately — the alternative leaves a worker able to stall the loop by reading Step 4 literally.
- OQ-2(A) makes cell 2's column **ragged** relative to the other five rows, which hold a bare `@fkit-coder`. Accepted as cosmetic.

⚠️ **The plan's own §5 sequencing note stands and is not superseded by these answers:** `0224` overlaps **line 126** and must **re-derive it in full** after this lands. `0204` and `0333` are unaffected.

## Driver's note on this file (fkit-sprint-ship-loop, 2026-08-24)

Written by the **driver** at plan approval, before the Build spawn, per `fkit-sprint-ship-loop/SKILL.md`
§*Durable artifacts*.

⚠️ **One transcription note, disclosed rather than hidden.** The planning worker's text reached the driver
through a transport that HTML-escaped `&`, `<` and `>`. The driver decoded those back to the characters
the plan plainly intends (e.g. `<task-folder>`, `>= 2`, `description: >-`). **No other byte was altered,
and nothing was summarised, re-rendered or omitted.** This is stated because the loop's faithful-carry
construction turns on the word "verbatim", and a silent decode — however obviously correct — is exactly
the class of undisclosed transformation that construction exists to prevent.
