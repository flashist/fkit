# Build the link-resolution guard — `test/reference-integrity.test.js`, with the exemptions in the definition from day one

## ID
0354

## Sprint
Sprint 7

## Priority
P4

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> # ⛔ READ FIRST — THREE OF THIS BRIEF'S PREMISES ARE FALSIFIED (2026-08-30)
>
> `0353`'s deliverable —
> [`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md)
> — has settled the condition and **contradicts this brief in three load-bearing places**:
>
> 1. ⛔ **The closed-folder exemption below has no authority and is REVERSED.** ADR-034 never granted
>    it. Closed task folders are **IN scope for this guard**. Owner ruling 2026-08-29,
>    **"Accept — links in scope, citations exempt (Rec)"**.
> 2. ⛔ **Every figure below (`304`/`60`/`24`, the `34 of the 60`, the vault's `13`) is wrong.**
>    None reproduced. The settled red set is **0 broken, 6 named-exempt**.
> 3. ⛔ **This guard does NOT ship red.** It is **green on arrival**, and `0355` is not what makes it so.
>
> ⛔ **All original text is left byte-identical** as the record of what was written on 2026-08-29.
> **Every falsified passage carries a `⚠️ DATED CORRECTION 2026-08-30` block at the end of its own
> section**, and the corrected build instructions are in
> §"⭐ RE-SCOPED 2026-08-30" at the foot of this brief. ⛔ **Read that section before implementing.**
>
> **Authority for this re-scope:** owner ruling **2026-08-29**, live `AskUserQuestion`, option label
> verbatim **"Accept — links in scope, citations exempt (Rec)"**, whose stated cost was
> *"contradicts three briefs, so `0354` and `0355` need re-scoping before they run"* — the condition
> document's §8 escalation **E2**.

### What this guards

A markdown link `[label](relative/path.md)` inside `ai-agents/` whose target **does not exist on
disk**. Measured 2026-08-29 with **two** matchers, differing only in whether fenced blocks and inline
code spans are skipped: **304 across 96 files** naive-unexempted, **60 across 26** convention-correct
(honouring `0176` scoping decision 2), and ⭐ **24 across 11** once frozen closed folders, `wiki-vault/`
and archived boards are exempted. ⛔ **Take the number from `0353`, not from here** — the spread is the
point, not any one figure. The project has no automated check for this at all today: every one of
those was written by someone who believed it resolved.

**This is the enforceable half of the reference-integrity problem**, in exactly the sense
[`0176`](../../done/0176-build-the-coordination-citation-policy-guard/brief.md) established for its own
condition: a link either resolves or it does not, so a test can check it. ⚠️ It is **not** the same
condition as `0176`'s — `0176` tests whether a `path:NNN` **citation names a coordination document**;
this tests whether a **link target exists**. Two guards, two conditions, one shared scanned set.

### ⛔ The condition is NOT this brief's to invent — it is `0353`'s deliverable

[`0353`](../../done/0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md) settles the
exact scanned set, exemption set and match rule and writes them as **runnable commands**. ⛔ **Do not
start this task before that document exists, and do not re-derive its condition.** Implementing a
guard against a self-invented condition is precisely what put `0176` on the board unshippable for
four weeks.

### The lesson `0176` paid for, inherited here verbatim

> **"The exemption MUST be in the guard's definition from day one, or the guard is red on historical
> files the ruling has decided will never be cleaned. It is not an optimization to add later; it is
> part of the guard's definition."**

That is `0176`'s owner ruling 2 (2026-08-01), and it applies here unchanged. The two exemptions this
guard carries from the start:

- **Frozen closed task folders** — [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md).
  **34 of the 60 convention-correct broken links live under `ai-agents/tasks/done/`** (219 of 304
  naive). A guard red on those is red on files nobody is permitted to edit.
- **`ai-agents/wiki-vault/`** — [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md).
  Only `fkit-wiki` may write there, so no other role could ever make this guard green. ⭐ **Measured
  2026-08-29 the vault holds ZERO convention-correct broken links** — a naive matcher reports 13, and
  **all 13 are inside inline code spans**, i.e. quoted marker text, not links. ⛔ **The exemption is
  still required on principle** (no other role may repair the vault if one appears), but do not scope
  work against the 13: it is a matcher artifact. Report, never edit.

⚠️ **The exact boundary of both exemptions is `0353`'s to rule** — `0176`'s owner ruling exempts
`done/*/review.md` **by name and only that**, explicitly leaving `done/*/brief.md` and
`done/*/worklog.md` in scope. Whether the link half takes the narrow or the whole-folder shape is
answered in `0353`'s reconciliation table. **Implement whichever `0353` ruled, and name it.**

> ## ⚠️ DATED CORRECTION 2026-08-30 — `## Context` ABOVE IS FALSIFIED IN THREE PLACES. ⛔ DO NOT IMPLEMENT IT AS WRITTEN.
>
> **All text above is left byte-identical as the record of what was written on 2026-08-29.** What
> follows corrects it; where the two disagree, this block governs.
>
> ### ⛔ C1 — the closed-folder exemption is REVERSED. `ai-agents/tasks/done/**` and `cancelled/**` are IN scope.
>
> The bullet above reads *"**Frozen closed task folders** — ADR-034 … A guard red on those is red on
> files nobody is permitted to edit."* **ADR-034 grants no such exemption and never did.** Its own
> **Scope** line, read in full 2026-08-30, is *"the close condition of a **stateful review ledger**
> (`<task-folder>/review.md`). It does not change what a review *finds*, only when the loop
> **stops**."* It is a termination bar for a review loop; it says nothing about post-close edits.
>
> The rule that **does** govern a post-close edit is `claude/skills/fkit-task-done/SKILL.md`, and it
> says the opposite of what this brief assumed — verbatim: **"A link is not a claim; it is a pointer …
> a pointer to a file that is no longer there is not history, it is rot"**, and for a hit in a sibling
> closed folder, *"same rule: **re-point the href, change nothing else.**"*
>
> ⭐ **The owner ruled on this, 2026-08-29, live via `AskUserQuestion`; the option label is the
> verbatim text: "Accept — links in scope, citations exempt (Rec)".** One principle, two consequences:
> closed folders are **IN scope for the link guard** (pointers rot) and **EXEMPT for the citation
> guard** (claims are frozen). See the condition document §1, §2 C1 and §3 Half A.
>
> ⛔ **The only path exemption this guard carries is `ai-agents/wiki-vault/**` (ADR-005).** Nothing
> else. `sprints/done/**`, `sprints/reviews/**` and `knowledge-base/**` are all **IN** scope too.
> `claude/` and `test/` are **OUT of the scanned set entirely** — measured, 440 of 443 hits there are
> frozen `test/fixtures/` (ADR-042) and the rest are `claude/scaffold/` templates whose relative links
> resolve **in the consuming project, not in this repo**.
>
> ### ⛔ C2 — every figure above is wrong, including `34 of the 60`
>
> **None of `304 / 96`, `60 / 26` or `24 / 11` reproduced**, and the `34 of the 60 … live under
> `ai-agents/tasks/done/`` / `219 of 304` split is wrong with them. Across **seven** independent
> matcher implementations the naive link figure ranged **168–246** and the settled figure **3–11** —
> purely on how "skip code spans" was implemented. ⭐ **That instability is `0353`'s central finding,
> and it is why §4.1 of the condition document exists.**
>
> **The settled figures, re-measured 2026-08-30** (provenance below):
>
> | Reading | Broken | Files |
> |---|---|---|
> | ⭐ **Settled condition** — named exemptions applied | ⭐ **0** | **0** |
> | Settled, `NAMED_EXEMPT` emptied | 6 | 4 |
> | Naive — nothing skipped | 163 | 72 |
> | Settled **+ closed folders exempt** (this brief's original assumption) | 0 | 0 |
>
> **Scanned set size: 819 `.md` files** under `ai-agents/`, vault excluded.
>
> ### ⛔ C3 — the vault figure is 12, not 13 (the exemption itself stands)
>
> The bullet above says *"a naive matcher reports 13, and **all 13** are inside inline code spans"*.
> **Re-measured 2026-08-30 by pointing the settled walker at `ai-agents/wiki-vault/` with the vault
> exemption lifted: 275 files, 0 broken under the settled condition, 12 across 8 files naive.**
> Twelve, not thirteen; every one inside an inline code span. ⭐ **The exemption is still required on
> principle** — ADR-005 puts the vault out of every role's reach but `fkit-wiki`'s, so a guard that
> reddens there is a guard nobody may make green — and ⛔ **no cleanup is scoped against those hits.**
>
> ### 📅 Provenance, and the decay warning
>
> Every figure in this block was **re-measured 2026-08-30 by a spawned `fkit-producer`**, by extracting
> §4.1's and §4.2's scripts **verbatim** from
> [`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md)
> into a session scratchpad (never into the repo) and running them from the repo root against the
> working tree of that date.
>
> ⚠️ **THESE FIGURES ARE AS-OF 2026-08-30 AND THEY DECAY.** The condition document was **still under
> review (round 2) when they were taken** and may change. Worse, the document, its worklog and its
> review ledger are **themselves inside the scanned set**, so the tree measures differently as they are
> written. ⛔ **Re-measure at this task's own plan gate by re-running §4.1's script, and report the
> figure you get, not the figure written here.**

## What to build

**One new file: `test/reference-integrity.test.js`** — a hand-rolled `node --test` guard picked up by
`npm test`'s existing `node --test test/*.test.js` glob. ⛔ **No new devDependency** (ADR-014); ⛔ no
change to `package.json`.

- **The condition is `0353`'s, transcribed.** Its scanned set, its exemptions, its match rule. Where
  `0353` gave a runnable command, the test's behaviour must agree with that command's output on the
  tree as it stands.
- **The exemptions live in the guard's definition** — in the walk that builds the scanned set, **not**
  as a post-filter over failures. Structure it so this is demonstrable.
- **A stated skip convention for non-file links**: `http(s)://`, `mailto:`, and bare `#anchor` links,
  per `0353`. Say what the guard does with a `path#fragment` link whose file resolves.
- **The failure message names the citing file, the line's text (not its number), and the unresolved
  target** — ⛔ **never `file:NNN`.** A guard against broken references must not emit the coordinate
  form the project is trying to retire
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).

⛔ **Constraints:**

- **⛔ Do not fix a single broken link.** That is [`0355`](../../cancelled/0355-clean-the-in-scope-broken-link-red-set/brief.md).
  This task ships a test file; the tree it runs against is `0355`'s to make green.
- **⛔ Do not edit `ai-agents/wiki-vault/`** — report what the guard finds there, touch nothing (ADR-005).
- **⛔ Do not edit anything under `ai-agents/tasks/done/` or `cancelled/`** (ADR-034).
- **⛔ Do not modify `test/coordination-citation-policy.test.js`** or `0176`'s scope. Two guards, kept
  separate, by `0176`'s own recorded producer judgement about `0175`.
- **⛔ Do not move any task file** — the movers are producer-only (ADR-033).

> ## ⚠️ DATED CORRECTION 2026-08-30 — `## What to build` ABOVE IS FALSIFIED IN TWO ITEMS.
>
> **All text above is left byte-identical.** Two items are wrong and one needs a distinction it does
> not draw. The corrected build instructions are in §**"⭐ RE-SCOPED 2026-08-30"** at the foot of this
> brief. ⛔ **Read it before writing the test.**
>
> - ⛔ **"The exemptions live in the guard's definition"** — still true, but there is now **one path
>   exemption, not two**: `ai-agents/wiki-vault/**` only. Closed folders are in scope (C1 above).
>   ⭐ **A second, different exemption mechanism now exists** — six instances exempted **by name** with
>   their reasons (`NAMED_EXEMPT`), on the owner's ruling **"Exempt them by name (Rec)"**, 2026-08-30.
>   ⛔ **Carry that list AND its stated cost into the test**; do not silently drop either.
> - ⛔ **The constraint *"Do not edit anything under `ai-agents/tasks/done/` or `cancelled/` (ADR-034)"*
>   is right for the wrong reason, and the reason matters.** This task must not edit them because it
>   ships a test file and cleans nothing — **not** because the guard exempts them. **The guard does not
>   exempt them.** ⛔ Do not let the constraint leak into the guard's scanned set.
> - ⛔ **The condition is a script to TRANSCRIBE, not prose to re-derive.** §4.1 of the condition
>   document is the specification, byte-exact. ⛔ **Do not paraphrase it into a fresh regex** — the same
>   prose sentence yielded 11, 19 and 42 in three separate hands, and that is the whole finding.

## Verification steps

1. `test/reference-integrity.test.js` exists and is picked up by `npm test` with **no** change to
   `package.json`. Show the run.
2. **Name `0353`'s condition document by filename in the worklog**, and show the guard's scanned set
   and exemption list matching it item for item. A guard whose condition differs from `0353`'s is a
   failed run, not a variation.
3. **Prove the exemption is in the definition, not a post-filter:** the guard must be green over the
   exempted files **without any of them being edited**, and instrumenting the walk must show the
   exempted paths were never visited. Prove it, do not assert it.
4. **The mutation test:** plant a broken link in an in-scope file, show the guard **fails**; remove it,
   show it passes. Plant the same broken link in an **exempted** file, show the guard **passes**.
   Report all three runs.
5. `grep -nE ':[0-9]+' test/reference-integrity.test.js` shows **no** `path:NNN` citation form in the
   guard's own messages or comments.
6. `git diff --stat` shows **zero** files modified under `ai-agents/tasks/done/`,
   `ai-agents/tasks/cancelled/`, and `ai-agents/wiki-vault/`.
7. `npm test` passes, **including `test/prove-red.sh`'s hard gate**. Report the red run, not only the
   green one.
8. **State the guard's red/green state honestly in the close report.** If `0355` has not yet landed,
   the guard is **red on the in-scope set by design** — say so with the count, and do not present a
   red guard as shipped-green. ⚠️ Conversely, do not weaken the condition to make it green.
9. Report how many links the guard **skips** (external, anchor-only, exempted) alongside how many it
   checks — a guard that checks almost nothing passes trivially.

> ## ⚠️ DATED CORRECTION 2026-08-30 — VERIFICATION STEPS 3, 4 AND 8 ABOVE ARE FALSIFIED. ⛔ DO NOT RUN THEM AS WRITTEN.
>
> **All text above is left byte-identical.** Steps 1, 2, 5, 6, 7 and 9 stand exactly as written.
> The replacements for 3, 4 and 8 are in §**"⭐ RE-SCOPED 2026-08-30"** below. In short:
>
> - **Step 3** — *"the guard must be green over the exempted files … instrumenting the walk must show
>   the exempted paths were never visited"* — was written against **two** path exemptions. There is
>   **one**: `wiki-vault/`. ⛔ **Closed folders ARE visited**, and a step asserting they are not now
>   proves the guard is wrong rather than right.
> - **Step 4** — the mutation test's third arm, *"plant the same broken link in an **exempted** file"*,
>   ⛔ **cannot be run as written.** The only path-exempt surface is `ai-agents/wiki-vault/`, and
>   planting anything there is a **vault write, forbidden to this role by ADR-005**. See the re-scope
>   section for the two legal ways to run that arm.
> - **Step 8** — *"If `0355` has not yet landed, the guard is **red on the in-scope set by design**"* —
>   ⛔ **falsified. The guard is GREEN on arrival**: 0 broken, 6 named-exempt, re-measured 2026-08-30.
>   `0355` has nothing to clean (its re-scope is a separate open question — see the Notes correction).
>   ⚠️ The step's second half stands and stands harder: **do not weaken the condition to make it
>   green**, and **state the red/green state honestly** — including the 6 named exemptions, which are a
>   disposition, not an absence.

## Notes

- **Depends on:** `0353` — hard. The condition is its deliverable; there is nothing to implement
  without it.
- **Blocks:** `0356`, `0357`, `0358` — ⛔ **hard, and this is Sprint 7's loudest sequencing rule.**
  The three sweeps do not start until **this guard and `0176` are both green**. The constraint is the
  owner-agreed *"verified, not trusted"* rule: a sweep that edits many records without a guard
  underneath it is exactly the act that produced the record-repair backlog. See
  [`sprint-7.md`](../../../sprints/sprint-7.md) §"⛔ THE FORCED SEQUENCING".
- ⚠️ **This guard may legitimately ship red** if it lands before `0355`. That is a stated,
  bounded state — not a defect and not a licence to weaken the condition. `0355` makes it green.
- ⚠️ **`0176`'s guard is a sibling, not a duplicate.** Different condition, different failure. Keep
  the two test files separate — `0176` records the producer judgement behind two files rather than one.
- **Priority `P4` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner ruling *"Approve all 12 as proposed (Rec)"*, 2026-08-29,
  `AskUserQuestion`, live `fkit lead` session.

> ## ⚠️ DATED CORRECTION 2026-08-30 — ONE `## Notes` BULLET ABOVE IS FALSIFIED.
>
> ⛔ The bullet *"**This guard may legitimately ship red** if it lands before `0355`. That is a stated,
> bounded state … `0355` makes it green"* **is falsified.** Re-measured 2026-08-30, the guard is
> **green on arrival: 0 broken, 6 named-exempt**, and it is green **without** `0355` doing anything.
> Left byte-identical as the record of what was believed on 2026-08-29.
>
> ⚠️ **What that does to the sequencing gate, stated rather than left to be inferred.** The
> *"⛔ THE FORCED SEQUENCING"* rule — `0356`/`0357`/`0358` do not start until **this guard and `0176`
> are both green** — is **unchanged and still binding**. What changed is only that **this half is
> cheap**: it is green the moment the test lands. ⭐ **The gate now rests almost entirely on `0176`**,
> whose own residual (`0237`'s 19 instances) is real work. ⛔ **Do not read "the link guard is green"
> as "the sweeps are unblocked."**
>
> ⚠️ **`0355`'s status is an OPEN QUESTION for the owner, not a settled fact.** Its red set is 0; the
> producer has recommended cancelling it. ⛔ **Nothing in this brief assumes that outcome**, and this
> task's shipping condition does not depend on it either way.
>
> **The `Depends on: 0353` and `Blocks: 0356, 0357, 0358` bullets are unchanged and still true.**

---

## ⭐ RE-SCOPED 2026-08-30 — WHAT TO BUILD, CORRECTED

**Authority:** owner ruling **2026-08-29**, live `AskUserQuestion` in an `fkit lead` session, option
label verbatim: **"Accept — links in scope, citations exempt (Rec)"** — presented with the explicit
cost *"contradicts three briefs, so `0354` and `0355` need re-scoping before they run."* Sharpened by
the owner ruling **2026-08-30**, option label verbatim: **"Exempt them by name (Rec)"**. Both are
recorded in full in the condition document's §3.1, §3.2 and §8 (escalation **E2**), which states that
these re-scopings *"are the producer's to make, not the architect's"*.

**This section governs where it disagrees with anything above it.**

### 1. ⛔ The condition is a SCRIPT to transcribe, not prose to re-derive

Transcribe **§4.1** of
[`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md)
into `test/reference-integrity.test.js`. It is a self-contained Node script, no dependencies beyond
builtins. ⛔ **Do not paraphrase it into a fresh regex.** The measured reason: across **seven**
independent implementations of the same prose sentence the naive figure ranged **168–246** and the
settled figure **3–11**. `0176` (11 across 8), `0237` (19 across 15) and `0353` (42 across 22) all
disagreed about one sentence. **The script is the specification.**

⚠️ **The document was still under review (round 2) on 2026-08-30 and §4.1 may change.** ⛔ **Re-read
§4.1 on the day you transcribe it**, and say in the worklog which revision you took.

### 2. ⛔ The exemption model, corrected — one path exemption, plus six named instances

| Surface | Ruling |
|---|---|
| `ai-agents/wiki-vault/**` | ⛔ **EXEMPT — the only path exemption.** ADR-005: no role but `fkit-wiki` may repair it |
| `ai-agents/tasks/done/**`, `ai-agents/tasks/cancelled/**` | ⭐ **IN scope.** Owner ruling 2026-08-29 |
| `ai-agents/sprints/done/**`, `ai-agents/sprints/reviews/**` | **IN scope** |
| `ai-agents/knowledge-base/**` | **IN scope.** Measured cost of the widening: **0** |
| `claude/`, `test/` | **OUT of the scanned set entirely** — not exempted, never walked |

⭐ **Plus a second, different mechanism: `NAMED_EXEMPT`** — six instances exempted **by name**, keyed on
**(citing file, target)** and ⛔ **never on a line number**, each carrying its reason. All six are
quoted or illustrative text: a synthetic board row inside ADR-040's own diagnosis, two throwaway
scratchpad fixture rows in `0268`'s worklog, and three quoted proposed-replacement snippets whose
relative depth is correct **at the file the text is proposed for**. §4.1 carries the list; §6.2
carries the table of reasons.

⛔ **Carry the list AND its stated cost.** The cost, from §7 item 9: keying on (file, target) means a
**future genuine rot with the same pair is also suppressed**. Measured cost today **0**. ⛔ **Do not
silently drop the caveat, and do not "improve" the key to a line number** — a line number is the exact
claim form this project rules unsafe against a living file.

### 3. Three implementation obligations that are easy to get wrong

1. ⛔ **Do NOT transcribe §7 item 4's withdrawn claim.** The document previously said the line-level
   code-span masker *"reports more, never fewer"* than the document-level one. **That claim is
   withdrawn — measurement disproved it.** The two maskers are **not nested**; each reports something
   the other hides (line-level 6 across 4, document-level 4 across 3). ⭐ **Ship the LINE-LEVEL masker,
   on ACCURACY grounds** — the document-level masker's one unique hit is a false positive it creates
   by mis-pairing an earlier unpaired backtick. **Record the reason as accuracy, never as "never
   fewer."**
2. ⭐ **Adopt the per-segment case check, do not trust `fs.existsSync`** (§7 item 11). macOS's default
   volume is case-insensitive, so a wrongly-cased link **passes on a developer's Mac and reds on a
   case-sensitive CI runner**. Measured today: **0 mismatches**, so adopting it costs nothing now and
   prevents shipping a test whose result depends on who runs it.
3. **The fence-close rule is CommonMark's: a *closing* fence carries no info string.** Both of the
   document's maskers had this wrong and were corrected on 2026-08-30; the bug hid one live instance.
   Transcribe the corrected form.

### 4. What the guard must disclose alongside its pass

Named blind spots, each to be stated in the close report rather than discovered later:

- **Blockquote lines are skipped** — measured **8 instances across 6 files** hidden, all inspected
  2026-08-30, **all quotation or proposed text, none genuine rot**. ⛔ That means today's sample is
  clean, **not** that the blind spot is safe.
- **Anchor existence is never checked** — `path#fragment` resolves the file part only. Named as a
  future extension; cost unmeasured; ⛔ deliberately not folded in.
- **Reference-style definitions (`[a]: url`) are out of scope**, by name. Cost measured 0 today.
- **The link grammar is narrower than the ruled class** — nested label brackets and balanced-paren
  destinations are not matched. Measured with a widened grammar: **identical red set**. Live cost 0.
- **The `NAMED_EXEMPT` key caveat** (§2 above).

### 5. ⛔ Replacement verification steps 3, 4 and 8

**Steps 1, 2, 5, 6, 7 and 9 above are unchanged.** These three replace their originals:

**3′. Prove the exemption is in the definition, not a post-filter — against the ONE path exemption.**
Instrument the walk and show that **no file under `ai-agents/wiki-vault/` was ever visited**, without
editing any of them. ⛔ **Conversely, prove that files under `ai-agents/tasks/done/`,
`ai-agents/tasks/cancelled/`, `ai-agents/sprints/done/` and `ai-agents/knowledge-base/` WERE visited**
— under the settled condition their absence is the defect, not the proof. Report the scanned-set size
(**819 files 2026-08-30**; re-measure) and show `claude/` and `test/` were never walked at all.

**4′. The mutation test, in four arms — and the exempted arm needs care.**
- Plant a broken link in an **in-scope** file → the guard **fails**. Remove it → passes.
- Plant a broken link in a **closed task folder** (`tasks/done/`) → ⭐ **the guard must FAIL.** This is
  the arm the original brief had backwards. Revert it.
- Plant a broken link on a **`NAMED_EXEMPT` (file, target) pair** → the guard **passes**, and the
  named-exempt **count rises**. A silent pass is not the same result as a counted exemption.
- The **path-exempt** arm: ⛔ **the only path-exempt surface is `ai-agents/wiki-vault/`, and planting
  anything there is a vault write forbidden to this role by ADR-005.** Two legal ways to run it, take
  either and say which: **(a)** point the guard's walker at a **scratchpad fixture tree** carrying a
  `wiki-vault/` directory with a planted broken link, and show it is skipped; or **(b)** exercise the
  exemption predicate as a **unit**, asserting it returns true for a `ai-agents/wiki-vault/…` path.
  ⛔ **Never write to `ai-agents/wiki-vault/`, not even to revert it.** Report all arms.

**8′. State the red/green state honestly — it is GREEN.** Re-measured 2026-08-30: **0 broken, 6
named-exempt, 819 files scanned.** ⛔ **Re-measure at your own plan gate and report YOUR figure**; the
tree is live, the condition document is inside the scanned set, and drift was directly observed during
`0353` (a broken ADR-033 link appeared in `sprint-7.md` and vanished again). ⛔ **Do not present the 6
named exemptions as an absence** — report them as a count with a pointer to their reasons. ⚠️ **Do not
weaken the condition to keep it green**, and ⛔ do not claim the sweeps are unblocked: the gate needs
`0176` green too, and that is `0237`'s real work.

### 📅 Provenance of every figure in this section

**Re-measured 2026-08-30 by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
by extracting §4.1's and §4.2's scripts verbatim from the condition document into a session scratchpad
(never into the repo) and running them from the repo root against the working tree of that date.**
Reproduced: Half A `BROKEN: 0 / NAMED-EXEMPT: 6 / SCANNED: 819`; vault `0` settled and `12 across 8`
naive over 275 files.

⚠️ **THEY DECAY, AND THEY WERE TAKEN WHILE THE SOURCE WAS STILL UNDER REVIEW (round 2).** ⛔
**Re-measure at this task's own plan gate. Report what you measure, not what is written here.**

*Recorded 2026-08-30 by a spawned `fkit-producer` executing escalation **E2** of the condition
document under the owner's 2026-08-29 ruling. ⛔ **No status, rank, board membership, dependency field
or file location was changed by this act** — every edit is an append, and all prior text is
byte-identical.*
</content>
