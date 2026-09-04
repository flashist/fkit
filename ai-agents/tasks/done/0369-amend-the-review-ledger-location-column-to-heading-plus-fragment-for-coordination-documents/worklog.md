# Worklog — 0369: amend the review-ledger location column

## 2026-09-04 — Build step (spawned `fkit-coder` Build worker, driver `fkit-sprint-ship-loop`)

Ran under the declared-approval marker: the owner approved `plan.md` in a live `fkit lead` session,
option label verbatim **"Approve as written (Rec)"**, with rulings **J0–J5** in the plan's
§ *⭐ OWNER RULINGS* appendix. Implemented `plan.md` § *4. Sequencing*, steps 1–8. Stopped at step 8 —
no review requested (the driver spawns that separately).

### Carry verification (driver correction mid-run)

The driver's spawn paste of the plan was truncated (its § *7. Open questions* replaced by a pointer),
and the driver sent a correction supplying the omitted bytes. **The correction reached me before I made
any edit** — at that point I had only read files. I verified the file myself rather than trusting the
repair: `git hash-object` → `7091e6ba006c781f30bd3fbd108684b6756abc11`, `wc -c` → `26215` bytes, both
matching the pointer; headings run `## 0` … `## 7` with **no** duplicate `## 5.`; § *7* present in full
and matching the repaired text. The file was authoritative and nothing in § *7* changed the build —
all five questions are ruled by J1–J5.

### What changed

Two files, both under `claude/` (canonical sources, not the gitignored `.claude/` mirror):

1. `claude/skills/fkit-stateful-review/SKILL.md`
   - § *The shared review document — schema & ownership*: findings-table header cell `file:line` →
     `Location`, column rule re-widthed, example row kept at `a.ts:12` so the legal **source** form is
     the one demonstrated (plan § *D3*).
   - Inserted the five-line `Location` rule block immediately after the schema fenced block and before
     the *Ownership rules* bullets (plan § *3.2*), including J4's one sentence on cell layout.
   - § *Step 4 — Write the Reviewer findings rows*: `file:line` → the `Location` form; paragraph
     reflowed to the file's existing wrap width.
   - § *Step 7*, coder-handoff spec: "per-finding detail with `file:line`" → "with the same `Location`
     form".
2. `claude/skills/fkit-process-stateful-review/SKILL.md`
   - Same header-cell change, and the **byte-identical** rule block in the same position.

⛔ **Deliberately NOT touched**, per plan § *D4*: the Hard-rules bullet in each file
(reviewer's *"verify every claim; cite `file:line`"*, coder's *"Read the code; cite `file:line`"*).
Both are scoped to verifying claims **against code**, which the convention rules correct. Editing them
would widen the ban into the case the brief forbids. Verified after the edit: those two bullets are the
**only** surviving `file:line` sites in the two files.

Every edit was made **by site**, never by pattern — plan § *6* risk 1 names find-and-replace as the
single most likely way to get this wrong, since nine of the fourteen enumerated sites are correctly
about citing code.

### Decision log — autonomous calls made without asking (ADR-019 audit obligation)

Not a review round; no reviewer findings existed. Recording the in-plan judgment calls anyway.

| # | Call | What changed | Why it qualified |
|---|---|---|---|
| A1 | Render the § *3.2* rule text as a **blockquote** rather than a plain paragraph | the five `> `-prefixed lines in both files | Obvious winner **within the plan's intent**. § *3.2* presents the text as a blockquote and § *1.4* uses the same `> ` device to quote another file, so neither reading is byte-free: the `> ` prefixes are either kept or stripped. Keeping them reproduces § *3.2* as written and matches the callout idiom already used in both files. Text content unchanged either way. ⚠️ **Reason corrected 2026-09-04 (finding R4, owner ruling K3).** The original entry justified this as preserving *"the four-line structure in every renderer (consecutive plain lines would collapse into one paragraph)"*. **Both halves of that were false**: the block is **five** source lines, not four; and CommonMark collapses consecutive lines **inside** a blockquote into a single paragraph exactly as it does outside one, so the blockquote buys no line-structure preservation at all. ⭐ **The decision stands and is not reversed** — only its stated reason was wrong. Corrected in place because this log is an **ADR-019 audit record** (`ADR-019` § *Decision*, item 4: *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is auditable"*), and a false justification misleads whoever audits why the call was made. |
| A2 | Wording of J4's one sentence: *"**In the row:** put the heading in the `Location` cell (e.g. `brief.md § Context`) and the quoted fragment in `Claim`."* | one line added to the rule block in both files | Mechanical and in-plan. J4 ruled "yes, one sentence"; plan § *3.4* fixes the content (heading in `Location`, fragment in `Claim`) but leaves the wording open. Kept to one sentence and does **not** restate the convention page, per J4's explicit limits. |
| A3 | Reflow the Step 4 paragraph after the substitution | `fkit-stateful-review/SKILL.md` § *Step 4* | Mechanical/localized. The substitution left a short line mid-paragraph; reflowing to the file's existing wrap width is the minimal-idiomatic-diff rule, and changes no words. |

No fix was applied against a review finding this step, and no call was made outside the approved plan.

### Verification — measured this turn, not quoted

- `npm test` → **833 tests, 833 pass, 0 fail**. Matches plan § *4* step 5's expected 833/833.
- `bash test/prove-red.sh` (run as the tail of `npm test`) → **28/28 named mutations red; hard gate
  PASSED**. No new mutation added, per J3 (no new test) and plan § *D5*.
- Pre-edit parity baseline: the three schema rows were byte-identical across the two files
  (md5 `a5c7f01a3d3df750639ce582f6a0b2f7`).
- Post-edit parity: three schema rows byte-identical (md5 `2d3e6f76cb8f37afa9d421ae45a5005a`); five-line
  rule blocks byte-identical (md5 `45339838c8479faa78222a8fdc73a77d`). Brief step 1 discharged.
- **J1 binding check**: `claude/structure-manifest.tsv` is **UNTOUCHED** in `git status`. The run did not
  stray into Q1 territory.
- Out-of-scope files confirmed untouched: `ai-agents/tasks/README.md`, its scaffold twin,
  `durable-citation-anchors.md` (both homes), `test/coordination-citation-policy.test.js`,
  `claude/skills/fkit-sprint-ship-loop/SKILL.md`.
- Relative link `../../../ai-agents/knowledge-base/conventions/durable-citation-anchors.md` resolves
  correctly from both `claude/skills/<name>/` and the mirrored `.claude/skills/<name>/`; the same depth
  is already in use at `fkit-process-stateful-review/SKILL.md` for `evidence-before-assertion.md`.
  `reference-integrity` is green inside the 833.

### Flags

- ⚠️ **Not live in this session.** These are `claude/` sources; running agents read the gitignored
  `.claude/` mirror. The amendment is **not** in force for this session's own reviewer, and will not be
  until `claude/fkit-claude-init.sh .` is re-run — which this step deliberately did **not** do.
- ⚠️ **README desync, knowingly left** (J1). `ai-agents/tasks/README.md` and its scaffold twin still
  carry `file:line` in their copies of the ledger schema. Producer follow-up returned to the driver.
- **Existing open ledgers keep the old header.** No test pins it and markdown does not care; noted so it
  is not later mistaken for a defect.
- `test/coordination-citation-policy.test.js`'s comment describing this follow-up as unfiled now reads
  stale. Plan § *D4* ruled it **OUT, flagged** — raised, not fixed.
- No commit, no push, no folder moved, no board row flipped, no write under `ai-agents/wiki-vault/`.

---

## 2026-09-04 — Process-review step, round 1 (spawned `fkit-coder` Process-review worker)

Applied `fkit-process-stateful-review`, steps 0–7, to this folder's `review.md`. Five findings, all
round 1, all verified by me against source before acting. Owner dispositions **K1–K5** relayed by the
driver from a live `AskUserQuestion`. Plan blob re-verified unchanged at the start of this step:
`7091e6ba006c781f30bd3fbd108684b6756abc11`, 26215 bytes.

### ⚠️ Inbound citation shift this task caused (owner ruling K2)

**This change moved line numbers that 30 other artifacts cite.** Measured by me this turn, walking the
repo for `fkit-stateful-review/SKILL.md:NNN` and `fkit-process-stateful-review/SKILL.md:NNN`:

- **31 of 47** distinct inbound coordinates now point at the wrong line — 20 into the process skill,
  11 into the reviewer skill.
- Spread across **30 durable artifacts**, including **6 ADRs** and **2 `ai-agents/wiki-vault/` pages**.
- Shift arithmetic: process skill — everything at old line **≥77** moves **+6**. Reviewer skill —
  old **71–136** moves **+6**, old **≥140** moves **+7**, and old **137–139** was rewritten outright.
- Corpus: `.git`, `.claude`, `.fkit/tmp/` scratch output and this task's own folder excluded.

⚠️ **My figures differ from finding R1's** (which said 40 of 61, across 42 artifacts). The gap is
**corpus, not substance**: including `.fkit/tmp/` scratch files and this task's own folder my count
rises to 45 of 89 across 42 artifacts — matching R1's artifact count exactly. Both measurements agree
that a large inbound surface moved. I recorded mine because K2 asked for measured figures.

⛔ **Not repaired here, by ruling K2** — `0368` owns the ownerless source-file coordinate class. A
producer follow-up asking `0368` to absorb this measurement was returned with this step. Note also that
this change is **not the origin** of the rot: the reviewer's spot-checks found several of these
coordinates already stale at `HEAD` before this task touched anything.

### Decision log — round 1 dispositions

| # | Call | What changed | Why it qualified |
|---|---|---|---|
| B1 | R2 accepted: scope the reviewer skill's Hard-rules bullet | `fkit-stateful-review/SKILL.md` § *Hard rules* — *"verify every claim"* → *"verify every claim **against the code**"* | Owner ruling **K1**, verbatim *"Two-word scoping fix now (Rec)"*. Verified myself: that bullet had **no** code-scoping words, while the process skill's *"Read the code; cite `file:line`"* does — so `plan.md § D4`'s shared OUT reason was true of one half and false of the other. Minimal: the bullet is scoped, not rewritten, and matches the idiom already at `claude/agents/fkit-reviewer.md` § *Behavioral rules* (*"Verify every claim against the code"*). ⛔ Process half untouched — its OUT verdict was correct on its own terms. |
| B2 | R4 accepted: correct entry A1's stated reason | this worklog's round-0 decision log, row A1 | Owner ruling **K3**, verbatim *"Correct the reason in place (Rec)"*. I verified both errors: the block is 5 source lines, and a blockquote does not prevent CommonMark paragraph collapse. ⭐ The decision itself was **not** reversed. |
| B3 | R3 recorded as a frontier residual rather than fixed | `review.md` § *Accepted residuals* | Owner ruling **K4**, verbatim *"Follow-up task (Rec)"*. ⚠️ **My call, flagged:** K4 named a follow-up but not a ledger Status. I classified it **Frontier / `won't fix (frontier)`** and wrote a residual, following this ledger's own precedent — the **J1** deferral is recorded the same way, with *"Re-raise only if: the follow-up is not filed"*. The method also obliges a residual for any confirmed intended tradeoff. Raised here so the driver can object. |
| B4 | R5 accepted as a deliberate imprecision | `review.md` § *Accepted residuals* | Owner ruling **K5**, verbatim *"Accept deliberately, record a residual (Rec)"*. Verified the mechanism myself: `maskFencesAndQuotes` blanks fenced blocks **and** any line matching `/^\s*>/`. ⛔ Wording deliberately **not** tightened — see the residual's reasoning. |

No fix was applied outside the approved plan or outside K1–K5.

### Change surface — cumulative across both steps

```
 claude/skills/fkit-process-stateful-review/SKILL.md | 12 ++++++++---
 claude/skills/fkit-stateful-review/SKILL.md         | 23 ++++++++++++++--------
 2 files changed, 24 insertions(+), 11 deletions(-)
```

Plus this `worklog.md` and the folder's `review.md`. The reviewer skill's larger share reflects
round 1's **K1** scoping fix on top of the build step's four edits; the process skill was untouched in
round 1. The working tree was already dirty on arrival (75 entries: Sweep A `0356`, eleven new briefs,
and other in-flight work); **exactly two** tracked files were added to it across both steps, and none of
the pre-existing dirt is mine.

### Verification — round 1, measured this turn

- `node --test test/coordination-citation-policy.test.js test/reference-integrity.test.js` →
  **41 tests, 41 pass, 0 fail**.
- `npm test` → **833 tests, 833 pass, 0 fail**; `prove-red.sh` → **28/28, hard gate PASSED**.
- ⚠️ **Green is close to meaningless for this change, and must not be read as evidence it is correct.**
  Neither guard scans `claude/`, and **no test pins the ledger header or the rule block**. The suite
  confirms only that nothing else broke. The real check on this work was reading it.
- **J1 still holds**: `claude/structure-manifest.tsv` untouched. `plan.md` blob still
  `7091e6ba006c781f30bd3fbd108684b6756abc11`. All five *Reviewer findings* rows intact — I wrote only
  the *Coder response* section, two new *Accepted residuals*, and the header's `Status:`.
