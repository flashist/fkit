# Implementation plan — task `0171`, "Write the `durable-citation-anchors` convention page — dual-homed into the scaffold"

**Planned 2026-08-15. Planning only — no file was written, no command mutated the tree.**
Baseline evidence: everything below was re-derived from disk this session. Where the brief and disk disagree, disk is recorded and the brief is corrected by name.

---

## 0. Corrections to the brief and to the driver's prompt — read these first

Ten checks; **six of them move the plan.** The brief is right about the shape of the work and wrong about its size.

### C1 ⭐ The scaffold README does not say *"Six conventions ship with the scaffold"*. It says **"Seven."**

`claude/scaffold/ai-agents/knowledge-base/conventions/README.md`, first line under `## What's here`:

> Seven conventions ship with the scaffold. They are **yours to amend** — but amend them *here*.

Re-derived from disk, not from the brief: the scaffold conventions folder holds **8 files = `README.md` + 7 conventions**. The count is **correct today**. Someone already made the `Six → Seven` edit the brief anticipates (almost certainly task `0132`, which shipped `dependency-declaration-form.md` into the scaffold).

**The edit this task actually makes is `Seven` → `Eight`.** The brief's verification step 6 — *"the scaffold README no longer says 'Six conventions ship with the scaffold' when seven now do"* — is **unsatisfiable as written and vacuously true**: `grep -c "Six conventions"` already returns `0`. It must be replaced with an assertion against `Eight`.

The driver's prompt was right to tell me to re-derive it, and right not to trust its own figure.

### C2 The brief's parity inventory is wrong in a way that matters

The brief states: *"`dependency-declaration-form.md` and `dual-home-parity.md` are fkit-only."* **False for the first.** `dependency-declaration-form.md` is present in **both** homes — shipped to the scaffold by task `0132` in a deliberately generalized (audience-adapted) form, recorded at length in `test/dual-home-parity-exceptions.mjs`.

Disk, today:

| tree | conventions (excl. `README.md`) |
|---|---|
| `ai-agents/knowledge-base/conventions/` | **8** |
| `claude/scaffold/ai-agents/knowledge-base/conventions/` | **7** |

The delta is exactly **one file**: `dual-home-parity.md`, fkit-repo-only. The brief's "7 of the live tree's 9 pages" is off by one in both terms.

### C3 ⭐ This task touches **ten** files, not four

The brief's "FOUR files, not two" misses four more, **two of which turn a green test red if skipped.**

| # | File | Why | Named in brief? |
|---|---|---|---|
| 1 | `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` | **NEW** | ✅ |
| 2 | `claude/scaffold/ai-agents/knowledge-base/conventions/durable-citation-anchors.md` | **NEW**, byte-identical to 1 | ✅ |
| 3 | `ai-agents/knowledge-base/conventions/README.md` | index row **+ the parity footnote, see C4** | partly |
| 4 | `claude/scaffold/…/conventions/README.md` | index row + `Seven` → `Eight` | ✅ |
| 5 | `claude/structure-spec.md` | **Table B row + two prose counts — see C5** | ❌ **red test if skipped** |
| 6 | `claude/structure-manifest.tsv` | `npm run generate:manifest` — **see C6** | ❌ **red test if skipped** |
| 7 | `ai-agents/knowledge-base/decisions/adr-012-…md` | Deliverable B, 9 citations | ✅ |
| 8 | `…/adr-018-…md` | Deliverable B, 1 citation | ✅ |
| 9 | `…/adr-031-…md` | Deliverable B, 2 citations | ✅ |
| 10 | `ai-agents/tasks/backlog/0171-…/{plan,worklog,review}.md` | loop artifacts — **see C10** | ❌ |

**`test/dual-home-parity-exceptions.mjs` needs no entry** — verified: `knowledge-base/conventions/` is **not** a directory exception (the directory exceptions are `decisions/`, `reports/`, `history/`, `incidents/`, `sprints/`, `tasks/{backlog,done,cancelled}/`, `wiki-vault/wiki/`, `.fkit/`). The new page therefore lands on the **enforced byte-identical set** by construction, which is what the brief wants. Correct as-is; do not add an exception.

### C4 The live README's parity footnote goes stale the moment this lands

`ai-agents/knowledge-base/conventions/README.md`, the `†` footnote:

> Two of them — `task-owner-vocabulary.md` and `priority-is-rank-not-identity.md` — must stay **byte-identical** across both copies; the rest ship a deliberately de-fkit-ified **audience-adapted** copy…

This page is the **third** byte-identical dual-homed convention. `Two of them` → `Three of them`, and the new filename joins the list. **Nothing checks this sentence** — it is prose, not parsed by any test — which is precisely why it will rot silently if not edited in the same change. Not named in the brief.

### C5 ⭐ `claude/structure-spec.md` is a hard, tested dependency the brief never mentions

`test/structure-spec.test.js` test **B** asserts *"Inventory Table B == the scaffold's files + {CLAUDE.md, AGENTS.md}, both directions"*. Adding a scaffold file **without** adding its Table B row fails with:

> `claude/structure-spec.md Table B drifted from the shipped file set — fix the spec (or the scaffold) so they land in the same commit`

Three edits are required in that one file:

- **Table B row**, alphabetically between `dependency-declaration-form.md` and `evidence-before-assertion.md`:
  `| `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` | fkit-authored reference file | convention |`
- **§`ai-agents/knowledge-base/conventions/` prose**: *"requires the **eight** files listed in Table B: the folder's `README.md` … plus **seven** conventions"* → **nine** / **eight**.

Test F (*"every non-placeholder Table B row is covered by the structure manifest"*) then forces C6.

**Baseline, measured this session:** `node --test test/dual-home-parity.test.js test/structure-spec.test.js` → **16 pass, 0 fail.** ⚠️ I did **not** run the full `npm test`; that baseline is unmeasured and must be taken at build time.

### C6 ✅ The release-surface answer, with its evidence — **yes, regen; no, not the hard case**

The driver asked for this either way. Answer: **`npm run generate:manifest` IS required, and `claude/structure-manifest.tsv` must be committed in the same change.** It is a **plain regen**, not the loud-refusal case.

Evidence, both halves:

- `RELEASING.md` §3: *"What the manifest covers in the working tree … is everything under `claude/scaffold/ai-agents/` (recursively, `.gitkeep` excluded)"*, and *"Commit the regenerated `claude/structure-manifest.tsv` in the same change as the edit that caused it (`test/structure-manifest.test.js:115`)."*
- `bin/generate-structure-manifest.mjs`, `workingTreeFiles()`: the `KNOWN` map holds `['ai-agents', 'walk']`, and `walk()` recurses the whole subtree. Our new file sits under an **already-taught walk root**, so the generator does **not** throw.

**The refusal case is a new entry directly under `claude/scaffold/` itself** (a new top-level name the `KNOWN` map does not carry). That is not this change. Stated explicitly because RELEASING.md's warning is easy to misread as covering any new scaffold file.

### C7 ⛔ **Deliverable B is blocked by the brief's own recorded serialization constraint**

The brief requires `0195 → 0196 → 0197 → 0171(B) → 0199`. Verified on disk today:

| task | board | `## Status` | `## Sprint` | `## Priority` |
|---|---|---|---|---|
| `0195` | `done/` | ✅ Done (agent-closed — not owner-verified) | — | — |
| **`0196`** | **`backlog/`** | **🔲 Backlog** | **Backlog** | **Unscheduled** |
| **`0197`** | **`backlog/`** | **🔲 Backlog** | **Backlog** | **Unscheduled** |
| `0199` | `backlog/` | 🔲 Backlog | Backlog | Unscheduled |

`0196` and `0197` are **not in Sprint 6** and are not scheduled anywhere. **As recorded, Deliverable B cannot run in this sprint pass.** This is the plan's biggest open question (OQ2) and I am not deciding it.

### C8 ⭐ The report's five-row table has **no row for an ADR** — and Deliverable B's twelve targets are all ADRs

Walked the table against the actual targets:

- Row 1 covers *"a source file, test, **skill or agent file**, cited in a design doc or a finding"* — an ADR is none of those.
- Row 3 covers *"a **coordination document** others append to — `ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md`"* — an ADR is not listed.

`adr-010` is demonstrably a document third parties append to: **three appends in two weeks** (`0143` landed `+71/−0`; `0195` landed; `0196` and `0197` are queued), and twelve inbound pointers broke as a result. That is the R22 scope note's **second condition** firing exactly — *"whether the target is a document a third party edits under you"* — on a target the table does not name.

**Deliverable B has no rule to land in until the page decides this.** See OQ1.

### C9 `§heading` is too coarse to be the answer on its own

`adr-010`'s top-level headings are `# ADR-010` (1), `## Context` (16), `## Decision` (124), `## Options considered` (202), `## Consequences` (220), `## Related` (248). **`## Context` spans 107 lines** and swallows nine of the twelve citations. A bare `§Context` anchor is not a usable replacement for `:63-65`.

The workable form for this target is **heading + quoted fragment**, with the fragment doing the real locating and the heading giving the reader a region. Where a nested correction-note title exists, that is the better heading. This is worth stating in the page, because a reader told "use §heading" will otherwise produce anchors that are durable and useless.

### C10 Two verification steps in the brief are defective as written

- **Step 6** is vacuous — see C1.
- **Step 8** — *"No file under `ai-agents/tasks/` … is modified"* — is **violated by the ship loop itself**, which writes `plan.md`, `worklog.md` and `review.md` into `0171`'s own task folder. Read it as *"no file under `ai-agents/tasks/` **other than this task's own folder artifacts**"*. Flagged rather than silently reinterpreted at verification time.

### What I did **not** verify

The driver's third `0306` specimen — *"its residual describing a stale-count defect stated `7` where its own table listed `6`"* — I did **not** locate. `worklog.md` residual 4b reads *"7 occurrences across `0037`, `0156`, `0184`, `0226`"*, which is 7 occurrences across 4 files and is not self-contradictory. The claim may hold elsewhere in `review.md`; **I am not asserting it either way.** The other two specimens I did confirm from `0306`'s own record.

---

## 1. Deliverable A — the convention page

### 1a. Register and precedent — settled, not invented

`priority-is-rank-not-identity.md` is the existing **byte-identical dual-homed** convention and is the template. It carries a `## Provenance` section that names its sources **unlinked**, with a standing warning against "fixing" them:

> **⚠️ ADR-029 and the decision report are cited by name and NOT linked — deliberately. Do not "fix"…**

**Follow that exactly.** Its section order is also the model:
`rule block → why → what to write → what NOT to rewrite → where this is enforced → provenance`.

### 1b. Section outline

```
# Durable citation anchors — when a coordinate is safe to cite

  [rule block, §1 verbatim]
  [the first-cut question]
  [⚠️ R22 scope note — BOTH conditions, and the second is what makes row 3 categorical]

## Never cite a line number naked        ← §1.1 rider, HIGH in the page per brief piece 4
## Which anchor for which target         ← the five-row table in full, + the ledger caveat
   ### Applying the two conditions to a target the table does not name   ← OQ1
## Link labels                           ← §4.2.1 in narrowed R20 wording ONLY
## Review-ledger practice                ← §1.2: practice, NOT a schema change
## Verifying a claim about text          ← piece 7, five points + four limits
## Where this is enforced                ← honest ceiling, from §10
## Provenance                            ← by name, never linked
```

### 1c. Content sources — read the report, section by section

Each piece is transcribed from the named report section, **not** from the brief's summary. Verified locations in `ai-agents/knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md`:

| Piece | Report section |
|---|---|
| 1 — rule block | §1, the opening blockquote |
| 2 — five-row table + ledger caveat | §1, the table and the blockquote beneath it |
| 3 — R22 scope note | §1, the `⚠️ What that question does and does not settle` box |
| 4 — §1.1 rider | §1.1 |
| 5 — ledger practice note | §1.2, the `Review-ledger practice` block |
| 6 — R20 link-label rule | §4.2.1, the blockquote and its `⚠️ Narrowed in round 3 (R20)` box |
| 7 — verification rule | **not in the report** — brief only, owner-ruled 2026-08-14 |

**One judgement call, stated rather than buried.** Table row 5's `Because` cell reads
`` `conventions/priority-is-rank-not-identity.md:3-4` — "A sprint board's Priority cell is…" ``.
I checked: `:3-4` **still resolves** today. But shipping a `path:NNN` into a maintained-in-place sibling convention, **inside the page that rules on `path:NNN`**, invites exactly the drift it warns about. **Plan: keep the quoted phrase, drop the `:3-4`.** The `Because` cell survives in full substance; the citation stops being self-undermining. This is a deliberate one-token deviation from "carry the table in full" and is recorded here so a reviewer does not read it as a transcription error.

### 1d. Dual-home writing constraints — stricter than the brief states

Because the page is **byte-identical** (not audience-adapted), every word must also be true in a consuming project that has none of fkit's files. Hard bans:

- ⛔ **No relative link into `knowledge-base/reports/`** — a directory parity exception; the scaffold ships it with only `.gitkeep`. (The brief's accepted cost 2.)
- ⛔ **No relative link into `ai-agents/tasks/` or `ai-agents/sprints/`** — same reason, same exception list. This rules out linking `0306`, `0154`, `0160`.
- ⛔ **No link to `dual-home-parity.md`** — fkit-repo-only; absent from the scaffold. A link resolves here and dangles in every install. Not mentioned in the brief; it is the same defect class the page is about.
- ✅ **Safe to link:** `priority-is-rank-not-identity.md`, `evidence-before-assertion.md`, `README.md` — all present in both homes.
- ✅ **Name-only references** (`0160`, `0306`, ADR numbers) go in `## Provenance`, unlinked, following the precedent block quoted in §1a.

### 1e. Piece 7 — the verification section

Five points; all five required (verification step 14 turns on **point 4**).

1. A single-line `grep` cannot see a phrase that **wraps**; an **absence** claim over prose needs whitespace-normalised matching first.
2. The **squeeze is load-bearing**: `tr '\n\t' '  ' | tr -s ' '`, then match. A bare `tr '\n' ' '` is **insufficient** — the continuation line's indent survives the join. *(step 15: `grep -F "tr -s"` ≥ 1)*
3. `grep -c` counts matching **lines**, not occurrences. Where a count is load-bearing, use `grep -o … | wc -l`.
4. ⭐ **Direction matters. A PRESENCE claim cannot fail this way** — only **absence** claims need the expensive form. *(step 14)*
5. **Four known limits**, all of which read as absence: split across **markdown table cells** (`|` survives every transform); **wording drift**; **code fences treated as prose**; **hyphenation across a line break** (`task-\nbrief` → `task- brief`). *(step 16 — the honesty is the point, not a footnote)*

⛔ The `0/1` figures and the three wiki-skill filenames are a **dated specimen** — they go in `## Provenance` or a clearly-marked example block, never into the rule. The rule is points 1–5. This is the brief's own "no measurements" constraint, and the page would otherwise reproduce the defect it describes.

### 1f. `## Where this is enforced` — the honest ceiling

From report §10, written as current fact, no counts:

- The **meaning** of a line number: **nothing can enforce it**, ever. The paired-quote rider makes drift *visible to a reader*; it does not make it *detectable by a machine*.
- The **coordination-document policy**: mechanically checkable, **named and unwritten** — that guard is the enforcement half, and it is a separate task. *(In fkit that is `0176`, still `🔲 Backlog`; the page must state the state, not the task ID, since the ID is meaningless in a consuming project.)*
- The **ledger-row practice note**: unenforced. The findings schema has no quote field and gaining one is out of scope.
- The **link-label rule**: unenforced.
- **Piece 7**: unenforced — it is a method a writer follows.

This satisfies README bar 3 honestly (*"State where it is enforced"*) without overclaiming. **Do not write that this page is enforced.**

---

## 2. Deliverable B — the twelve displaced `adr-010:NNN` pointers

### 2a. Inventory, re-derived **2026-08-15** (not inherited)

`grep -rno "adr-010:[0-9,-]*" ai-agents/knowledge-base/decisions/` → **12**, unchanged in count from the brief's 2026-08-02 reading:

| citing file | line | citation | naked? |
|---|---|---|---|
| `adr-012` | 9 | `adr-010:63-65` | paired |
| `adr-012` | 9 | `adr-010:73-76` | paired |
| `adr-012` | 23 | `adr-010:63-65` | paired |
| `adr-012` | 25 | `adr-010:73-76` | paired |
| `adr-012` | 66 | `adr-010:114-116` | paired |
| **`adr-012`** | **87** | **`adr-010:107-110`** | ⛔ **NAKED** |
| **`adr-012`** | **105** | **`adr-010:92-94`** | ⛔ **NAKED** |
| `adr-012` | 166 | `adr-010:63-65` | paired |
| `adr-012` | 166 | `adr-010:73-76` | paired |
| `adr-018` | 88 | `adr-010:63-65` | paired |
| `adr-031` | 7 | `adr-010:66-68` | paired |
| `adr-031` | 27 | `adr-010:66-68` | paired |

**This reading must be re-taken at implementation time and both readings recorded** (verification step 9). The count matching today does not mean the coordinates are still correct — every one of them already points somewhere other than where it was written.

**Confirmed displacement, spot-checked:** `adr-010:63-65` now lands inside a `0143`-appended blockquote about ADR-031; `adr-010:92-94` — the target of the naked `adr-012:105` — **is blank today.** That naked pointer resolves to whitespace.

### 2b. Recovering the two naked ones

Their intent is only recoverable from git. Context read this session:

- **`adr-012:87`** cites `adr-010:107-110` for *"ADR-010's already-conceded prompt-enforced consult topology"*.
- **`adr-012:105`** cites `adr-010:92-94` for the `PreToolUse` hook *"remains deferred (as in `adr-010:92-94`)"*.

**Method (do not guess from current text):** find the commit that introduced each line in `adr-012` (`git log -L 87,87:…adr-012….md`), then `git show <that-sha>:ai-agents/knowledge-base/decisions/adr-010-….md | sed -n '107,110p'`. Record the exact revision consulted in the worklog (verification step 11).

### 2c. The `:NNN` ruling — one rule, stated once, applied to all twelve

The brief hands this to the architect and requires consistency, not per-line judgement. **Recommendation: strip `:NNN` entirely; anchor by heading + quoted fragment.** Reasoning, and the counter:

- §1.1's rider makes a **drifted** number recoverable. It does not make a **known-wrong** number acceptable to leave standing — and all twelve are known-wrong.
- `0196`'s own brief already commands, for ADR-010: ⛔ *"Write no new `:NNN` line numbers into ADR-010. Anchor by heading plus quoted phrase."* The convention is already being applied in advance by a sibling task; the page should ratify that form rather than contradict it.
- ⚠️ **Counter, stated fairly:** stripping loses precision on a 250-line document, and §4.2.1's sweeper preference (ii) leans toward *keeping the working half beside the durable one*. That preference is about **links**, not line numbers, so it does not transfer cleanly — but it is the strongest argument for the alternative. See OQ3.

⛔ **Repair the pointer; change nothing else on the line.** No prose, no `**Status:**`, no dates, no decision text. Prove it by `git diff` (verification step 12). ⛔ Do not touch `adr-010` itself.

### 2d. ⭐ The serialization constraint, re-examined against its own stated reason

The brief's rationale: *"Every append shifts ADR-010's line numbering, so re-anchoring the 12 pointers any earlier measures against a moving baseline and the new anchors re-rot on the next append."*

**That rationale is true only of an anchor that keeps a line number.** If §2c's ruling stands and `:NNN` is stripped:

- **`0196` cannot break the new anchors.** Its brief is `⛔ APPEND ONLY — +N / −0`, proven by `git diff --numstat` with deletions `0`. **An append cannot move a quoted fragment or a heading.**
- **`0197` is the only residual risk.** It edits ADR-010's own outbound `path:NNN` citations — i.e. it *does* change existing text. A quoted fragment that happens to quote one of those citation strings would break. **This is checkable at implementation time**: choose fragments that contain no `path:NNN` string.

So the constraint largely **evaporates under the durable form** — which is, satisfyingly, the argument the page itself makes. But it is a **recorded ordering constraint written into the brief**, so overriding it is the owner's call, not mine. See OQ2.

---

## 3. Sequencing

1. Read report §1, §1.1, §1.2, §4.2.1 in full at the source. Read `priority-is-rank-not-identity.md` end to end for register.
2. Write the **live** page (file 1).
3. `cp` to the scaffold (file 2). **Copy, never retype** — retyping is how byte-parity dies.
4. `diff` the two → must be empty.
5. Update both `README.md` files (3, 4) — index rows, `Seven`→`Eight`, and the `†` footnote `Two`→`Three`.
6. Update `claude/structure-spec.md` (5) — Table B row + two prose counts.
7. `npm run generate:manifest` → `claude/structure-manifest.tsv` (6).
8. `npm test` — full suite, not just the two I baselined.
9. **Gate.** Deliverable B proceeds only under OQ2's answer.
10. Deliverable B: re-derive inventory → recover the two naked ones from git → apply §2c's ruling to all twelve → `git diff` proves citation-text-only → re-derive inventory after → both readings into the worklog with the date.
11. `npm test` again.

**Steps 2–8 are independently shippable.** If OQ2 defers B, everything above still lands.

---

## 4. Verification — against the brief's steps, with the two defects corrected

| # | Check | Note |
|---|---|---|
| 1 | Both files exist | |
| 2 | `diff` returns nothing | |
| 3 | Six pieces present, checked against the **report's** §1/§1.1/§1.2/§4.2.1 | not against the brief |
| 4 | `grep -c "never be a mutable coordinate"` = **0**, both copies | R20 narrowed wording only |
| 5 | No `reports/` and no `2026-08-01-durable-citation` inside a markdown link | plus C1d's extra bans: no link into `tasks/`, `sprints/`, or to `dual-home-parity.md` |
| 6 | ⚠️ **rewritten** — scaffold README says **`Eight conventions ship with the scaffold`**; `grep -c "Seven conventions"` = **0** | brief's wording is vacuous, see C1 |
| 7 | `npm test` green; `test/dual-home-parity.test.js` **exists** (`0133` closed) and green on the new pair | 2/2 suites green at baseline; **full suite unmeasured** |
| 8 | ⚠️ **read as** — no file under `ai-agents/tasks/`, `sprints/`, `wiki-vault/` modified **other than `0171`'s own folder artifacts** | see C10 |
| 9–13 | Deliverable B steps, unchanged | gated on OQ2 |
| 14 | Piece 7's five points, **including point 4 (presence exempt)** | |
| 15 | `grep -F "tr -s"` ≥ 1, both copies; page states bare `tr '\n' ' '` is insufficient | |
| 16 | All four limits listed | a page presenting the normalised form as a clean sweep **fails** |
| 17 | Byte-parity re-checked after piece 7 | |
| **+18** | **NEW** — `node --test test/structure-spec.test.js` green (Table B drift) | C5 |
| **+19** | **NEW** — `claude/structure-manifest.tsv` regenerated and in the same change | C6 |
| **+20** | **NEW** — live README `†` footnote reads `Three of them` and names the new file | C4 |

---

## 5. Risks

1. ⛔ **Skipping `claude/structure-spec.md` or the manifest regen turns a green suite red.** Neither is in the brief. Highest-probability failure in this task.
2. ⚠️ **Byte-parity is easy to lose on the second write.** Copy the file; do not author it twice.
3. ⚠️ **A well-meaning relative link into `reports/`, `tasks/`, or to `dual-home-parity.md`** ships a dangling pointer into every consuming project — the exact defect class. The precedent block in `priority-is-rank-not-identity.md` exists to stop a future maintainer "fixing" this; carry an equivalent warning.
4. ⚠️ **Deliverable B on a moving baseline** if OQ2 rules to proceed and `0197` later edits quoted text. Mitigated by fragment choice; not eliminated.
5. ⚠️ **The page is unenforced on landing.** `0306`'s residual 1 is blunt about it: *"Nothing enforces the durable citation form… The decay can return tomorrow."* The page must say so in `## Where this is enforced` rather than implying a guard exists.
6. ⚠️ **44 uncommitted paths + a staged rename** are already in the tree. `git diff` proofs for Deliverable B must be **path-scoped** to the three ADRs, or they will be unreadable.

---

## 6. Scope boundary — held

- ⛔ Not writing the guard (`0176`). This task is the convention; that task is the enforcement.
- ⛔ Not touching `adr-010` (`0195`/`0196`/`0197`), the wiki (`0199`), the architect's `## Output format` bullet (`0172`), or the ledger schema (`0168`).
- ⛔ Not fixing the pre-existing index gap the brief raises — `dependency-declaration-form.md` **is** missing from the live README's `What's here` table. Verified present in the live tree, absent from the live index. **Raised, not fixed**, exactly as the brief instructs. *(It IS in the scaffold README's table — the gap is live-side only.)*
- ⛔ No commit, no push, no `git add`, no `git stash`. No task file moved, no `## Status` edited, no sprint file touched.

---

## OPEN QUESTIONS

**OQ1 — ⭐ How does the page rule a citation into an ADR that carries appended correction notes?** *(blocks Deliverable B; the table has no row for it — see C8)*
- **(a) An application note under the verbatim five-row table (Rec).** Carry the five rows exactly as ruled, then add a clearly-marked note: apply the R22 **second condition** — *is this a document a third party edits under you?* — and an append-corrected ADR answers yes, so it lands on row 3's side: `path:NNN` is wrong; use heading + quoted fragment. **Consequence:** the report's ruling is carried unaltered; the new judgement is visibly the page's own and attributable.
- **(b) Add a sixth row to the table.** Cleaner to read. **Consequence:** silently amends a completed, owner-reviewed report's ruling inside a document that claims to transcribe it.
- **(c) Carry the five rows only; let Deliverable B decide ad hoc.** **Consequence:** the page ships with no worked application and B has no rule to land in — precisely the split the 2026-08-02 fold ruling rejected.

**OQ2 — ⛔ Deliverable B is blocked as recorded: `0196` and `0197` are `🔲 Backlog` / `Unscheduled`, not in Sprint 6** *(see C7)*
- **(a) Ship Deliverable A now; defer B until `0196`/`0197` land (safe).** **Consequence:** honours the recorded constraint exactly; `0171` **cannot close** this sprint pass — it ships half and stays open.
- **(b) Run B now, on strip-`:NNN` durable anchors (Rec).** The constraint's stated reason is that appends re-rot the anchors; **an append cannot move a quoted fragment**, and `0196` is provably `+N/−0`. **Consequence:** `0171` closes whole this pass; residual risk is `0197` editing quoted text, mitigable by fragment choice. **This overrides a constraint recorded at `0195`'s close, so it is your call, not mine.**
- **(c) Pull `0196` and `0197` into Sprint 6 ahead of `0171`.** **Consequence:** the constraint is honoured *and* B ships — but it adds two unscheduled tasks to a ranked 19-row board and re-opens sequencing.

**OQ3 — Strip or keep the `:NNN` in Deliverable B's twelve repairs?** *(the brief hands this to the architect: state once, apply consistently)*
- **(a) Strip entirely; heading + quoted fragment only (Rec).** All twelve are known-wrong today; `0196`'s brief already forbids new `:NNN` into ADR-010. **Consequence:** loses precision on a 250-line document; makes OQ2(b) viable.
- **(b) Re-derive `:NNN` against today's ADR-010 and add a quote beside it.** **Consequence:** maximum precision, but the numbers re-rot on the very next append — and `0196`/`0197` are both queued appends. **Directly conflicts with OQ2(b).**

**OQ4 — Confirm `claude/structure-spec.md` + `claude/structure-manifest.tsv` are in scope for this task** *(unnamed in the brief; both are release-surface files — see C5/C6)*
- **(a) In scope, this task (Rec).** **Consequence:** omitting them turns `test/structure-spec.test.js` **red** — the task cannot ship green without them. The change surface widens into `claude/`, which the brief never anticipated.
- **(b) Split into a follow-up.** **Consequence:** `0171` lands with a failing test suite. Not recommended, recorded only so the choice is visible.

**OQ5 — Adopt `0306`'s task-citation practice into the page?** *(`` `NNNN` (`folder-slug`) `` on first occurrence per file, bare `` `NNNN` `` after — its owner-approved form, invented because this page did not exist)*
- **(a) Yes — as a named practice note under row 4 (Rec).** Row 4 already rules *"the folder-name `NNNN` prefix, always"*; this adds readability without changing the ruling, and ratifies a form already in the tree. **Consequence:** the page gains a worked form; `0306`'s ad-hoc invention becomes convention.
- **(b) No — row 4's bare ID is sufficient.** **Consequence:** shorter page; `0306`'s form stays uncodified and the next run re-invents it, which is the failure mode this task exists to end.

---

<!-- ============================================================================
     ADDENDUM — NOT PART OF THE PLANNER'S TEXT.
     Everything above this line is the plan as returned by the Plan-step worker,
     copied verbatim. Everything below was appended by the driver (fkit-lead) in
     the same turn as the approval, and records the rulings AT the plan gate.
     It is additive: not one byte above it was altered.
     ============================================================================ -->

## ⛔ Owner rulings at the plan gate — 2026-08-15

**Channel:** `AskUserQuestion`, live `fkit lead` session driving `/fkit-sprint-ship-loop`.
**Form:** each ruling is a selection from an option list, so **the option label is the verbatim text.**

| # | Question | Ruling — verbatim option label |
|---|---|---|
| **Plan gate** | Approve this plan? | **"Approve — persist and build (Recommended)"** |
| **OQ 2** | Deliverable B, blocked as recorded | **"Run B now on strip-`:NNN` anchors (Recommended)"** |
| **OQ 1** | How the page rules an ADR citation | **"Application note under the verbatim table (Recommended)"** |
| **OQ 3** | Strip or keep `:NNN` in the twelve repairs | **"Strip entirely — heading + quoted fragment (Recommended)"** |
| **`0309` × `0171`** | Should this page name the hyphenated form? | **"Tell `0171` to name the hyphenated form (Recommended)"** |

**What each authorizes, stated so the Build step does not have to infer it:**

1. **OQ 2 — Deliverable B runs in this pass.** ⚠️ **This overrides the serialization constraint recorded at `0195`'s close** (`0195 → 0196 → 0197 → 0171(B) → 0199`). The override rests on §2d's argument: the constraint's stated reason is line-number re-rot, and an append cannot move a quoted fragment. **`0196` is provably `+N/−0`.** ⚠️ **The residual is real and must be managed, not assumed away:** `0197` edits ADR-010's own outbound `path:NNN` citations, so **choose quoted fragments that contain no `path:NNN` string**, and say in the worklog that you checked each one for that.
2. **OQ 1 — the five-row table is carried verbatim, with an application note beneath it.** ⛔ **Do not add a sixth row.** The note applies the R22 second condition — *is this a document a third party edits under you?* — to a target the table does not name, and it must be visibly the page's own judgement, not presented as part of the transcribed ruling.
3. **OQ 3 — strip `:NNN` entirely** across all twelve; heading + quoted fragment, one rule stated once and applied consistently.
4. **⭐ The page must name the hyphenated `task-NN` form** as the same citation class as the spaced `task NN`, and record **why it matters**: the hyphenated variant evaded **three consecutive sweeps** because every measurement used the spaced pattern. Evidence measured 2026-08-15 by a spawned producer: `0184`, `0156` **and** `0037` all return **zero** for `\btask [0-9]{1,2}\b` today — three of the four affected briefs are invisible to the spaced pattern, and `0226` was only ever examined because it happened to also carry a spaced numeral. ⛔ **Name the FORM and the lesson; this task does not repair the sites** — that is `0309`, filed 2026-08-15.

**The two remaining open questions were answered by the driver, not the owner. The owner was told and did not object:**

5. **OQ 4 → option (a).** `claude/structure-spec.md` and `claude/structure-manifest.tsv` are **in scope for this task**. Option (b) means landing a knowingly-red suite, which is not a real alternative.
6. **OQ 5 → option (a).** `0306`'s task-citation practice — `` `NNNN` (`folder-slug`) `` on first occurrence per file, bare `` `NNNN` `` after — is **codified as a named practice note under row 4**, so the next run does not re-invent it.

⚠️ **Everything else in the plan stands as written**, including its ten-file surface, its two corrected verification steps, and its dual-home link bans.
