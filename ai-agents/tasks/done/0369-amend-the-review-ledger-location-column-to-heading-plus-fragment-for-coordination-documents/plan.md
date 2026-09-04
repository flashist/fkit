# Plan — 0369: amend the review-ledger location column to *heading + fragment where the target is a coordination document*

Baseline for everything below: `HEAD` `6dcc33e`, working tree dirty from Sweep A (`0356`) + eleven new briefs + `0223`'s artifacts. Every figure re-measured this turn; nothing quoted from the brief.

## 0. What this task is, in one line

The reviewer and coder stateful-review skills both print a findings-table header whose location column is literally `file:line`. When the artifact under review **is** a coordination document, that shape is the exact form `test/coordination-citation-policy.test.js` reds on, and the last three review rounds each had to be told the correct form by spawn prompt. Amend the column so it narrows to coordination documents and **keeps `path:NNN` legal for source**.

---

## 1. Evidence gathered (re-measured this turn, not inherited)

### 1.1 The guard's exact target class

`test/coordination-citation-policy.test.js` — `export const TARGET` (`:237-243`) and `export function exempt` (`:223-225`):

- **Cited (target) class:** `ai-agents/sprints/*.md` · `ai-agents/tasks/*/*/(brief|plan|worklog|review).md` · `ai-agents/wiki-vault/log.md`, each followed immediately by `:` and digits.
- **Exempt citing sites:** `ai-agents/tasks/done/` and `ai-agents/tasks/cancelled/` — **open folders are not exempt**, which is the whole bite.
- **Scanned citing sites:** `collectFiles` (`:187-204`) walks `ai-agents/tasks/<board>/<folder>/*.md` only — depth 3. So a live `review.md` in `backlog/` is scanned; `ai-agents/tasks/README.md` (depth 1) is **not**, and nothing under `claude/` is scanned at all.
- ⛔ **Code spans are NOT masked** (deviation D4, `:71-81`). Writing `` `…/plan.md:12` `` inside backticks still reds. Fenced blocks and blockquote lines *are* masked (`:249-252`). This is counter-intuitive and the amended text must say it, because "I put it in backticks" is the natural wrong assumption.

### 1.2 The column definition lives in **four** on-disk copies, not one

| # | File | Where | Manifest-hashed? |
|---|---|---|---|
| 1 | `claude/skills/fkit-stateful-review/SKILL.md` | schema block `:58`; Step 4 prose `:137`; Step 7 handoff prose `:186`; Hard rules `:201` | no |
| 2 | `claude/skills/fkit-process-stateful-review/SKILL.md` | schema block `:64`; Hard rules `:241` | no |
| 3 | `ai-agents/tasks/README.md` | § *File structure* item 1, and § *Template* — a **third full copy** of the ledger schema | ⚠️ **yes** |
| 4 | `claude/scaffold/ai-agents/tasks/README.md` | byte-identical twin of #3 (md5 `a2fce80839ba11d41569ea984da1ca16` both homes), enforced by `test/dual-home-parity.test.js` | ⚠️ **yes** |

⭐ **The brief under-enumerates.** Its Context names only #1 and #2 and says "it is two files, not one". It is **four** — the tasks README is a third copy of the same schema and is dual-homed. The brief's own item 4 ("update the dual-homed twin if the file has one") is what catches this, but only if the README is ruled in.

Verified: `claude/scaffold/` contains **no** skills or agents tree (`find claude/scaffold -name 'SKILL.md' -o -name 'fkit-*.md'` → empty). So copies #1 and #2 have **no** dual-home twin. ADR-027 parity does not reach them.

### 1.3 ⛔ The manifest wall — this is where the run must stop and surface

`claude/structure-manifest.tsv` carries a content hash for both `ai-agents/tasks/README.md` and `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`. `test/structure-manifest.test.js` assertion A ("the committed manifest is byte-exactly what the generator produces today", `:106-115`) reds the moment either file's content changes, with the fix line `npm run generate:manifest`.

Nothing under `claude/skills/` or `claude/agents/` is in the manifest (it covers project paths only: `AGENTS.md`, `CLAUDE.md`, `ai-agents/**` — 71 rows).

⚠️ **So: amending copies #1 and #2 costs no manifest regeneration. Amending #3/#4 does** — which is exactly the "beyond amend a column, stop and surface" line the driver drew. That drives the scope recommendation below and Q1.

### 1.4 A live semantic tension the brief does not mention

`ai-agents/knowledge-base/conventions/durable-citation-anchors.md`, § *Review-ledger practice*, says verbatim:

> *"A review finding's `file:line` cell **stands**. The finding is a claim about the revision the reviewer read, which is the safe side of the test, and nothing on this page bans it."*

and

> *"⛔ **This is a practice recommendation, not a schema change.** A findings row has no quote field and this page does not add one."*

Read alone that reads as contradicting the amendment. It does **not**, on the page's own terms: the same page's § *Which anchor for which target* table has a **coordination document** row ruling `path:NNN` **wrong**, and the page's own scope note says *"both conditions must be read together … **The second condition is what makes row 3 categorical**"* — the target condition. § *Review-ledger practice* is about row 2 (a **source** file under review), not row 3. But a reviewer who reads only that section will conclude the opposite of the amendment. This is a real desync risk and it belongs in Q2, not in a silent edit — the page is manifest-hashed and dual-homed (md5 `f07c9029cb9c7aff2064c70bb2720fc0` both homes).

### 1.5 No test asserts the ledger header

`grep -rn 'file:line' test/ bin/` returns exactly **one** hit: a *comment* at `test/coordination-citation-policy.test.js:150`, which describes this very follow-up. No test pins the schema header string. Renaming the header column breaks nothing mechanical.

### 1.6 The adjacent task

`ai-agents/tasks/backlog/0172-narrow-the-architect-output-format-path-line-mandate/brief.md`, § *What to build*, prescribes a **three-clause** shape for exactly this class of edit — *"1. `path:line` **stays** for code, tests, and files under `claude/` … 2. It **excludes** coordination documents … 3. It **carries the rider**"* — and *"Point the bullet at the convention page … rather than restating the whole rule inline."* `0172` is unstarted. **This plan runs first, so it sets the wording `0172` should match.** Neither gates the other.

---

## 2. Decisions this plan makes (the five points, each with its reason)

### D1 — Which files carry the column definition
**Four** (§1.2). **In scope for this run: copies #1 and #2 only.** #3/#4 → Q1 (manifest cost).

### D2 — What "coordination document" means in the amended text
⭐ **Mirror the guard's target class exactly, by name, and cite the convention page for the principle.**

Rejected alternatives, with reasons:
- **"Name it by reference only"** (just link `durable-citation-anchors.md`) — ⛔ rejected. That page's row 3 names *"sprint plans, task briefs, an append-only project log"*, which is **narrower than the guard**: it does not name `plan.md`, `worklog.md` or `review.md`, and those three are precisely what the guard widened to on 2026-08-30 (guard `:232-234`, owner ruling *"Not a reopening — widen it (Rec)"*). A reviewer following only the page would write `…/plan.md:12` and go red.
- **Something broader** ("never use line numbers in a ledger") — ⛔ rejected, it is the ban the brief forbids (item 3) and it would break every legitimate source citation.
- **Something narrower** — ⛔ rejected, it leaves the red in.

⚠️ **The cost of mirroring:** the skill text now duplicates the guard's class and can drift from it if the guard widens again. Accepted, and mitigated by naming the guard file in the text so a future widener finds the prose. The alternative — a skill that disagrees with the guard about coverage — is worse, exactly as the driver said.

### D3 — Non-coordination targets
`path:NNN` **stays correct** for source, tests, and files under `claude/`. Stated as the amendment's **first** clause, not a footnote, and the schema's example row keeps `a.ts:12` so the legal form is demonstrated in the shape itself. This satisfies brief item 3 / verification step 3 and `0176` ruling **G3**.

### D4 — The other `file:line` sites: in/out with a reason each
⛔ Every site gets a verdict. No site is left implicit.

| Site | Verdict | Reason |
|---|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md` schema block (`:58`) | **IN** | the column itself |
| same, Step 4 prose (`:137`) — *"**Sev** (your assigned severity), `file:line`, and a one-line **Claim**"* | **IN** | restates the same cell three sections later; leaving it desyncs one file against itself |
| same, Step 7 coder-handoff spec (`:186`) — *"per-finding detail with `file:line`"* | **IN** | it is the location field of a handoff table that mirrors the ledger row; one-word change |
| same, Hard rules (`:201`) — *"verify every claim; cite `file:line`"* | **OUT** | scoped to **verifying claims against the code**; row 1 of the convention rules that correct. Editing it would widen the ban into the case the brief forbids |
| `claude/skills/fkit-process-stateful-review/SKILL.md` schema block (`:64`) | **IN** | the mirrored half — brief item 1's both-halves discipline, precedent `0209` |
| same, Hard rules (`:241`) — *"Read the code; cite `file:line`"* | **OUT** | same reason as the reviewer's Hard-rules bullet |
| `claude/skills/fkit-review/SKILL.md` (`:35`, `:45`, `:255`) | **OUT** | ephemeral review — writes **no** file into `ai-agents/tasks/`, so its output never lands in a scanned citing site. `:45` additionally is the **verbatim Codex output contract**; changing it changes the prompt sent to another model, which is a behavior change, not a column amendment |
| `claude/skills/fkit-process-review/SKILL.md` (`:100`, `:154`) | **OUT** | ephemeral, same mechanical reason |
| `claude/skills/fkit-adversarial-review/SKILL.md` (`:94`, `:107`, `:131`) | **OUT** | the adversarial pass reviews **code diffs** and returns findings only; it writes no ledger. Its prompt is sent to Codex and is token-budgeted |
| `claude/agents/fkit-reviewer.md` (`:83`, `:107`) | **OUT** | `:107` is already correctly scoped — *"cite wiki pages as `[[wiki/path]]` and **code** as `file:line`"*. `:83` is the evaluate-claims bullet, code-scoped. Both are system-prompt lines under `test/rules-block-budget.test.js` pressure |
| `claude/agents/fkit-adversarial-reviewer.md` (`:44`, `:55`, `:63`) | **OUT** | as above; ADR-022 keeps this role the most restricted, and it never writes a coordination document |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` (`:126`) — *"verify each against the actual code at `file:line`"* | **OUT** | a method restatement about verifying **code**; and that file is already dirty in this working tree from `0223`. Touching it risks a collision with another task's change surface |
| `ai-agents/tasks/README.md` + scaffold twin | **SURFACED → Q1** | correct to amend, but it forces `npm run generate:manifest` |
| `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` § *Review-ledger practice* + twin | **SURFACED → Q2** | same manifest cost; and the change is a judgment call about a settled convention page, not a column |
| `test/coordination-citation-policy.test.js:150` (comment describing follow-up D as unfiled) | **OUT, flagged** | a test comment, not an instruction; it will read stale once this lands. Cheap to fix but it is the guard's transcription header, which carries byte-parity warnings — I will not touch it without a ruling. Raised, not fixed |

### D5 — Guard or test for this?
⭐ **No new guard. Argued, not assumed.**

1. **The teeth already exist and are stronger.** `test/coordination-citation-policy.test.js` reds on the **actual artifact** a reviewer produces. `0176`'s owner ruling (2026-09-02, option label verbatim *"A + file follow-up D (Rec)"*) deliberately shipped **no** exemption for open review ledgers so this would happen. A prose-pin test would assert that a sentence exists in a SKILL.md; the guard asserts the behavior. Pinning the weaker thing adds no coverage.
2. **A string-pin on prose is brittle and mis-signals.** It would red on a wording improvement — the failure mode `0172`'s brief names for its own edit (*"⛔ Do not add a guard"*).
3. **The remaining gap is not test-shaped.** The driver's observation stands: the reviewer owns its section, so this is guidance it honours, not a wall. What changes is that the guidance now lives **in the reviewer's own skill** instead of a driver's spawn prompt — and a violation reds `npm test`. That is the fix; a second prose test does not add to it.

⚠️ **Counter-argument, stated rather than hidden:** there is genuinely no automated check that the two schema halves stay in sync, and this task exists partly because they can drift. If the owner wants that, the cheap version is a byte-comparison of the two header lines — not a content assertion. Offered as **Q3**, recommended **no**.

---

## 3. The amendment — exact proposed text

### 3.1 The header cell

Both schema blocks change the column header from `file:line` to **`Location`**, leaving the rest of the row shape byte-identical between the two halves:

```
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1     | high | a.ts:12  | …     |
```

**Why rename rather than leave the header and add a note:** the header cell *is* the instruction — a reviewer copies the schema and fills what the header names. `file:line` in the header mandates the banned form for half the cases; `Location` mandates nothing and lets the rule below decide. The example row keeps a **source** coordinate, so the legal case is the one demonstrated.

### 3.2 The rule line — identical text in both skills

Inserted immediately **after** the schema fenced block and **before** the *Ownership rules* bullets, in both files:

> **The `Location` cell — the form depends on the target, not on the ledger.**
> `path:line` is **correct** for source, tests, and files under `claude/` — the reader diffs the thing you cited.
> ⛔ For a **coordination document** — `ai-agents/sprints/*.md`, a task folder's `brief.md` / `plan.md` / `worklog.md` / `review.md`, or `ai-agents/wiki-vault/log.md` — write **the heading plus a quoted fragment**, never `path:NNN`. Third parties append above your line and it moves under you; and `test/coordination-citation-policy.test.js` **reds on it** in any open task folder. ⚠️ **Backticks do not exempt it** — that guard does not mask code spans.
> **Rider, both cases:** never cite a line number naked — pair it with a quoted fragment or the heading it sits under ([`conventions/durable-citation-anchors.md`](../../../ai-agents/knowledge-base/conventions/durable-citation-anchors.md)).

Notes on the text: it is the `0172` three-clause shape (stays / excludes / rider); it names the guard's class **exactly** (D2); it links the convention page rather than restating it; it pre-empts the backticks assumption (§1.1). Relative link depth to be verified per file at edit time — the two skills sit at the same depth, so one form serves both.

### 3.3 Step 4 and Step 7 in the reviewer skill

- Step 4 (`claude/skills/fkit-stateful-review/SKILL.md:137`): `file:line` → `Location` (per the rule above).
- Step 7 (`:186`): *"per-finding detail with `file:line`"* → *"per-finding detail with the same `Location` form"*.

### 3.4 Cell-width practicality

⚠️ A heading + fragment does not fit a table cell comfortably. The amended text stays silent on layout deliberately, and the convention page already rules where the fragment goes: § *Review-ledger practice* — *"put the quoted fragment or the heading in the `Claim` cell, always."* So the practical shape is `brief.md § Context` in `Location` and the quote in `Claim`. If the owner wants that spelled out in the skill, it is one extra sentence — **Q4**.

---

## 4. Sequencing

1. Re-read both schema blocks in place and confirm the two header rows are byte-identical in shape **before** editing (so step 5's parity claim is measured against a known start).
2. Edit `claude/skills/fkit-stateful-review/SKILL.md`: header cell, rule block, Step 4, Step 7. **Do not** touch its Hard-rules bullet.
3. Edit `claude/skills/fkit-process-stateful-review/SKILL.md`: header cell, rule block (byte-identical to the reviewer's). **Do not** touch its Hard-rules bullet.
4. `diff` the two header rows and the two rule blocks against each other — must be byte-identical.
5. Run `npm test`. Expect **833/833** (baseline this turn), including `dual-home-parity`, `structure-manifest`, `skill-frontmatter`, `rules-block-budget`, `coordination-citation-policy`.
6. Run `bash test/prove-red.sh`. Expect **28/28 named, PASSED** — no new mutation is added (prose change to a non-executable artifact; the guard test's own header, `:155-168`, records why `ai-agents/`-content guards carry zero prove-red entries, and this change adds no executable).
7. `git status --porcelain` — confirm **exactly two** files added to the pre-existing dirty surface, and name the pre-existing surface explicitly so it is not claimed as mine.
8. Report; do not commit; do not re-run init.

**Rollback:** two-file prose edit, `git checkout --` on either file restores it. No generated artifact, no manifest, no moved file.

---

## 5. Verification, mapped to the brief's five steps

| Brief step | How this plan discharges it |
|---|---|
| 1 — both schemas amended, headers still match byte-for-byte | Step 4 above, an explicit `diff` of the two header rows and the two rule blocks |
| 2 — every other `file:line` site has an in/out verdict with a reason | D4's table — 14 sites, every one ruled, three surfaced as questions rather than left implicit |
| 3 — the source-file case stays legal | D3; the amendment's **first** clause; the schema example row keeps `a.ts:12`. ⛔ A wording that bans the form outright fails this task |
| 4 — `npm test` passes including dual-home parity | Step 5. ⭐ Note: the two edited files have **no** scaffold twin (verified §1.2), so parity is unaffected — the parity risk lives entirely in Q1's files |
| 5 — `prove-red.sh` still passes its named mutations | Step 6, 28/28 expected unchanged |

**Extra check not in the brief:** confirm `claude/structure-manifest.tsv` is **untouched** in `git status` after the edit. If it is not, the run has strayed into Q1 territory and must stop.

---

## 6. Risks and non-obvious failure modes

1. ⛔ **Silently widening the ban.** The single most likely way to get this wrong is a find-and-replace of `file:line` across the ten files that contain it. Nine of the fourteen sites are **correctly** about citing code. D4 is the defence; the run must edit by site, never by pattern.
2. ⚠️ **The manifest trap.** Editing `ai-agents/tasks/README.md` "while I'm here" reds `structure-manifest.test.js` with a message telling you to regenerate a shipped artifact. That is the escalation the driver forbade. Q1 exists so it is a ruling, not a discovery.
3. ⚠️ **The convention page reads as contradicting this** (§1.4). A future reviewer who reads § *Review-ledger practice* alone will conclude `file:line` stands. Q2.
4. **Existing open ledgers keep the old header.** Markdown does not care, and no test pins it, but a reviewer appending to an in-flight `review.md` will see `file:line` in the header it is appending under. Only `0223`'s ledger is open in this tree. Not blocking; noted so it is not mistaken for a defect.
5. ⚠️ **Not live this session.** These are `claude/` sources; the running agents read the gitignored `.claude/` mirror. ⛔ The amendment must **not** be reported as in force for this session's own reviewer until `claude/fkit-claude-init.sh .` is re-run — which this plan does **not** do.
6. **Dirty-tree attribution.** The tree already carries Sweep A (`0356`), eleven briefs, and `0223`'s artifacts, all uncommitted. Any "change surface" report must name only the two files this task touches.
7. **Link depth.** The relative link to the convention page must be verified from each skill's own directory at edit time; a broken link here would be ironic and would be caught by `test/reference-integrity.test.js`.

---

## 7. Open questions

**Q1 — Is `ai-agents/tasks/README.md` (and its byte-identical scaffold twin) in scope?**
It holds a **third and fourth** copy of the same ledger schema, both saying `file:line`. Amending them is correct for consistency but forces `npm run generate:manifest` — regenerating a **shipped** artifact, which the driver's constraints call beyond "amend a column".
- **(a) Out of this run; file a follow-up.** Two-file change surface, no manifest touched, README desyncs from the skills until the follow-up lands. **(Rec)** — it keeps this run inside the declared boundary, and the README is descriptive documentation, not the text an agent executes from.
- (b) In, and regenerate the manifest in this task. One coherent change; but it puts a generated shipped artifact in the diff and widens verification to `structure-manifest` + `dual-home-parity` on four files.
- (c) In, but skills only ruled authoritative and the README left with a pointer instead of a copy. Removes the duplication permanently; a larger documentation edit than this task's shape.

**Q2 — `durable-citation-anchors.md` § *Review-ledger practice* says the `file:line` cell "stands".**
On the page's own scope note this is row 2 (a source file under review) and does not contradict the amendment — but read alone it says the opposite. Same manifest + dual-home cost as Q1.
- **(a) Leave it; the amendment names the target condition explicitly, which is what resolves it.** **(Rec)** — the page already carries the scope note that settles it, and it is a settled convention page.
- (b) Add one scoping clause to that section in this task (manifest regeneration, both homes).
- (c) File it as its own task alongside `0172`.

**Q3 — Add a mechanical check that the two schema halves stay in sync?**
- **(a) No.** **(Rec)** — the real enforcement is `coordination-citation-policy.test.js`, which tests the artifact rather than the prose; a string-pin reds on wording improvements.
- (b) Yes, a narrow byte-comparison of the two header rows only (not content). Cheap, catches exactly the `0209`-class drift, adds a test that can red on a deliberate schema change.

**Q4 — Spell out the cell layout (`file § heading` in `Location`, quote in `Claim`)?**
- **(a) Yes, one sentence.** **(Rec)** — the friction that bit three rounds was partly *"what do I write instead"*, and the convention page already rules where the fragment goes.
- (b) No; keep the skill text minimal and let the convention page carry it.

**Q5 — Wording lead for `0172`.**
`0172` (architect `## Output format`) is unstarted and its brief asks whoever runs second to match the first. This plan's §3.2 text is the three-clause shape `0172` prescribes, so it can be lifted. Confirm that is intended, or say `0172` should set the wording instead and this task should wait.
- **(a) This task sets the wording; `0172` matches it later.** **(Rec)** — `0369` is ruled, sprinted, and costing per round; `0172` is unscheduled.
- (b) Hold `0369` until `0172` lands. Not recommended — `0172` depends on `0171` and is not on a board.

⚠️ **I could not put these to the owner myself** — `AskUserQuestion` is absent in a spawned consult (ADR-021), so they are returned here for the driver to relay.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-04

Given live via `AskUserQuestion` in this `fkit lead` session. Option labels are recorded **verbatim**. These rulings bind the Build and Process-review workers.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **J0** | Approve this plan as written? | **"Approve as written (Rec)"** | The plan above is the approved plan. These bytes are what the Build worker implements. |
| **J1** | Q1 — are the two README copies in scope? | **"Out of this run; file a follow-up (Rec)"** | ⛔ **`ai-agents/tasks/README.md` and its scaffold twin are OUT.** ⛔ `claude/structure-manifest.tsv` must be **untouched** in `git status` after the edit — §5's extra check is binding, and if the manifest moves, the run has strayed and must stop. **Return a producer follow-up** naming the README desync. |
| **J2** | Q2 — the convention page's *"the `file:line` cell stands"* | **"Leave it (Rec)"** | ⛔ **Do not edit `durable-citation-anchors.md`.** The page's own scope note settles it, and the amendment names the target condition explicitly. No manifest regeneration on this path either. |
| **J3** | Q3 — a mechanical sync check between the two schema halves? | **"No new check (Rec)"** | ⛔ **No new test.** D5 stands as argued: the citation guard reds on the actual artifact, which is stronger than pinning a sentence in a SKILL.md, and a string-pin would red on a wording improvement. |
| **J4** | Q4 — spell out the cell layout? | **"Yes, one sentence (Rec)"** | ⭐ **Add one sentence** giving the practical shape — heading in `Location`, quoted fragment in `Claim` — per §3.4 and the convention page's own § *Review-ledger practice* ruling. The owner's reason: part of the friction that bit three review rounds was *"what do I write instead"*, not only *"don't write that"*. Keep it to one sentence; ⛔ do not restate the convention page. |
| **J5** | Q5 — wording lead vs `0172` | **"0369 sets the wording; 0172 matches later (Rec)"** | ⭐ **This task sets the canonical wording.** `0172` is unscheduled and depends on `0171`; `0369` is owner-ruled, on the sprint board at `P14`, and costing a workaround per review round. Neither gates the other. |

⚠️ **Transport note.** This plan text was returned to the driver through the spawn channel, which HTML-escaped some angle brackets. The driver restored `&lt;`/`&gt;` to `<`/`>` when persisting these bytes — in §1.1 (`ai-agents/tasks/<board>/<folder>/*.md`) and in the four blockquote markers of §1.4 and §3.2. No other character was altered. Recorded so a later reader does not read the restoration as drift.
