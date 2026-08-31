# The reference-integrity condition — settled once, for both halves

**Task:** `0353` (`0353-settle-the-reference-integrity-condition-once-for-both-halves`)
**Author:** fkit-architect, spawned Build worker (no owner channel — ADR-021)
**Date:** 2026-08-29 · **Tree:** HEAD `1f33b95`, working tree dirty
**Status:** settled. `0354`, `0355` and `0237` implement against this document, not against their own briefs' globs.

> ⛔ **Every figure in this document was re-measured at build time on 2026-08-29 against HEAD `1f33b95`,
> and re-measured AGAIN on 2026-08-30 after review round 1.** None is inherited from the plan. The tree
> is live and moves; each figure is a snapshot, and §7 says so again.

> ⭐ **REVISED 2026-08-30 — review round 1, findings R1–R8, all eight upheld in whole or in part.**
> Four changes are material and are flagged where they land, not only here:
> 1. **Half B's target class was WIDENED** to `plan.md` / `worklog.md` / `review.md` alongside
>    `brief.md`, on an owner ruling of 2026-08-30. `0237`'s work list goes **12 across 9 → 19 across 14**.
>    See §3.2 — this is **not** a reopening of the 2026-08-01 owner ruling, and §3.2 says why.
> 2. **Both fence maskers were wrong** and are corrected to the CommonMark rule (a *closing* fence
>    carries no info string). Half A's settled pre-exemption figure is **6 across 4** — ⛔ **the plan's
>    6 across 4 was right and this document's earlier "correction" to 5 across 3 was the error.**
>    Half B is unaffected (19 across 14 either way).
> 3. **The six surviving Half A instances are now exempted BY NAME, each with its reason**, on an owner
>    ruling of 2026-08-30. The link guard is **green: 0 broken, 6 named-exempt.** `0355` inherits a
>    disposition instead of a shrug. See §3 Half A and §4.1's `NAMED_EXEMPT`.
> 4. **Five new blind spots are named in §7** (items 7–11: target-class boundary, link-grammar
>    coverage, the named-exemption key, Half B's missing elision rule, host-dependent resolution).
>    §7 item 6's stated cost is corrected from "three" to a measured **250 across 46**, and ⛔ **§7
>    item 4's "reports more, never fewer" claim is withdrawn — measurement disproves it.**

> ⭐ **REVISED AGAIN 2026-08-30 — review round 2, findings R9–R13, all five upheld.** ⛔ **Both settled
> figures are UNCHANGED by this round: Half A 0 broken / 6 named-exempt, Half B 19 across 14.** Every
> change below was verified against a re-run of both §4 scripts extracted from this edited document.
> 1. ⛔ **A dropped owner paragraph was RESTORED to §3.1** — and the claim *"this is the only elision
>    anywhere in this document"* was **false** when written. Four further elisions sat inside blocks
>    labelled *verbatim*, and a whole owner paragraph instructing `0176`'s implementer had been dropped
>    with no marker at all. **All five are now restored in full**, none needed marking, and §3.2 records
>    what happened rather than quietly correcting the sentence. Owner ruling *"Restore the dropped
>    paragraph, mark the rest (Rec)"*.
> 2. ⛔ **Three Half B figures were still PRE-WIDENING and contradicted §5 and §6.1** — one of them
>    inside the §4.2 block `0176` transcribes verbatim. Corrected: fence/blockquote skipping moves the
>    total by **8 (190 → 182)**, not by 1; skipping inline code spans moves it **182 → 6** and the
>    residual **19 → 1**, not "122 to 4" and "12 to 1". ⚠️ §6's reproducibility disclaimer never covered
>    these — they sit in the normative table and in the specification's own comments.
> 3. ⛔ **§7 item 11's "Root-absolute — FIXED … never the host filesystem" is WITHDRAWN as overstated.**
>    `path.join` normalizes `..`, so the escape survived the fix, and the **relative** branch had the
>    identical hole named nowhere. A one-line **containment check** now covers both (owner ruling
>    *"Name R11, fix R12's one line (Rec)"*). **Measured cost of the fix: 0 — every §6 figure is
>    byte-identical with the check present and absent.**
> 4. **Three new blind spots** — §7 item **13** (the fence masker's unterminated-fence and indented-fence
>    gaps, named and deliberately not fixed, live cost 0), §7 item **14** (the hand-duplicated
>    `maskFencesAndQuotes`, which has already drifted once), and two gaps added to §7 item **9** (no
>    stale-key detection; `0354` must assert **`NAMED-EXEMPT === 6`**).
> 5. **§8 escalation E2 is now DISCHARGED** — `0355` was cancelled and the other three rows re-scoped.

---

## 1. The principle — one, for both halves

> **A markdown link is a pointer. A `path` + line-number citation is a claim.**
> **Claims in a historical record are frozen. Pointers in a historical record are not.**

Neither half of that sentence is this document's invention. Both are already ruled in this repo.

**Authority for the pointer half** — `claude/skills/fkit-task-done/SKILL.md`, §"A *link* to the brief
whose status must NOT change", verbatim:

> **A link is not a claim; it is a pointer.** `➡️ Moved to Sprint 2 — priority 7` is *historically
> true and stays exactly as written* — the status cell, the priority, the prose, all byte-identical.
> Only the href moves, because a pointer to a file that is no longer there is not history, it is rot.

and, two bullets later, on a hit inside `ai-agents/knowledge-base/`:

> **Re-point the href to the new path in `done/`, and change nothing else on the line.** Identical
> treatment to a closed sprint plan, and for the identical reason: **a historical record's *claims* are
> frozen; its *links* are not.**

**Authority for the claim half** — `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`,
the owner's rule block of 2026-08-01 (task `0160`), verbatim:

> **A coordinate is safe to cite when the citer controls or freezes the target's revision. It is
> unsafe when a third party edits the target after you write.**
>
> **Line numbers are for findings against a revision. Names are for cross-references into living
> documents.**

### The consequence, stated so nobody re-derives it backwards

The principle is one. Applied to the two halves it points in **opposite directions**, and that
divergence is the settled answer, not a failure to settle:

| Question | Link half (pointer) | Citation half (claim) |
|---|---|---|
| Are closed task folders in scope? | **YES** — a rotted pointer is repairable, and `fkit-task-done` *mandates* the repair | **NO** — a closed record's claims are frozen (owner ruling, 2026-08-29) |
| Are archived boards / sprint review ledgers in scope? | **YES** — same reason | **NO** — same reason |
| Are inline code spans skipped? | **YES** — a link in backticks is documented marker text, not a pointer offered to a reader | ⛔ **NO** — backticks are the house form for *writing* a coordinate; skipping them takes this half from 182 hits to 6 and guts the guard |

**The test to apply to any delimiter, for any future extension:** ask what the delimiter does *to that
construct*. For a link, backticks and a blockquote marker mean "displayed as text, not offered to be
followed" → skip. For a citation, backticks are how a correct coordinate is written in this repo →
do not skip.

---

## 2. ⛔ Three corrections to the briefs' premises — read these before implementing

They are load-bearing: the whole exemption set of `0354` and `0355` rests on them. They are stated
here, first, and not in a footer.

### C1. ADR-034 does **not** freeze closed task folders. It never said so.

`0353`'s brief, `0354`'s brief and `0355`'s premise all cite ADR-034 as the authority for exempting
`ai-agents/tasks/done/**`. ADR-034 was read in full. Its own **Scope** line reads:

> **Scope:** the close condition of a **stateful review ledger** (`<task-folder>/review.md`). It does
> not change what a review *finds*, only when the loop **stops**.

Its **Decision** is *"A stateful review ledger closes once the SWEPT WORK PRODUCT is clean"* — a
termination bar for a review loop. Its **Consequences** explicitly accept the residue:

> **A closing task's own worklog may carry known low-severity defects.** This is the direct, intended cost.

**ADR-034 says nothing about post-close edits and grants no exemption to any guard, on either half.**

The rule that *does* govern a post-close edit is `claude/skills/fkit-task-done/SKILL.md`, and for
links it says the **opposite** of what the briefs assume. A hit in a sibling task folder's `plan.md`,
`worklog.md` or `review.md`, or in `ai-agents/sprints/reviews/`:

> same rule: re-point the href, change nothing else. Since ADR-029 these task-keyed records live
> inside the task folders (the old top-level `reviews/` `plans/` `worklogs/` directories are gone); a
> sprint-keyed ledger lives in `sprints/reviews/`. They record what happened, not where a file lives.

⭐ **Consequence, and it is owner-ruled.** The link half's closed-folder exemption has no authority
behind it, and the rule that exists **mandates the repair**. Closed folders are **IN scope for the
link half**. The owner accepted this on 2026-08-29 — option label verbatim
**"Accept — links in scope, citations exempt (Rec)"**. It contradicts three briefs; see §8 escalation E2.

### C2. The naive-versus-convention-correct spread is mostly **matcher artifact**, not signal

`0353`'s brief tabulates `304 / 60 / 24 / 17`. None of the four reproduced. Across **seven** independent
matcher implementations (five at plan time, one at build time, one at review round 1) the *naive* link
figure ranged **168 – 246** and the settled pre-exemption figure ranged **3 – 11**, purely on
implementation details of "skip code spans" — single-line versus document-level backtick pairing, and
whether a fence line itself is masked.

⚠️ **Review round 1 supplied the sharpest instance of exactly this, and this document was the one that
got it wrong.** Both §4 maskers closed a fenced block on any same-character fence run, **including one
carrying an info string** — which CommonMark forbids: a *closing* fence carries no info string. One
nested ` ```sh ` opener inside an outer fence therefore ended the block early and masked live prose from
there on. Corrected in both scripts on 2026-08-30. Half A's settled pre-exemption figure is **6 across
4**, not 5 across 3 — ⛔ **the plan's 6 across 4 was right, and this document's earlier "correction" of
it was itself the error.** Half B's residual is unchanged either way.

⭐ **That instability is the finding, and it is why §4 exists.** A condition expressed as prose plus
"write a regex" **cannot** be transferred without divergence. It is exactly how `0176` (11 across 8),
`0237` (19 across 15) and this task (42 across 22, under `0176`'s own 2026-08-01 exemption) came to
disagree about the same sentence. ⛔ **The condition is settled as one byte-exact matcher per half,
quoted in full in §4. `0354` and `0176` TRANSCRIBE it. They do not re-derive it.**

### C3. The vault claim checks out, with the number corrected

A naive matcher reports **12 broken links across 8 files** under `ai-agents/wiki-vault/`; the settled
matcher reports **0**. (A prior producer reported 13; the correct naive figure is 12.) Every one is
inside an inline code span. **The exemption is still required on principle** — ADR-005 puts the vault
out of every role's reach but `fkit-wiki`'s, so a guard that reddens there is a guard nobody may make
green — but **no cleanup work should be scoped against those hits.**

---

## 3. The settled condition

### Half A — markdown link resolution

| Element | Ruling | Authority |
|---|---|---|
| **Scanned set** | `ai-agents/**/*.md`, recursive | new; nothing prior ruled it |
| `ai-agents/sprints/done/**`, `ai-agents/sprints/reviews/**` | ⭐ **IN scope** — answers `0237` step 3 for this half | `fkit-task-done` names both surfaces and mandates re-pointing |
| `ai-agents/knowledge-base/` (`reports/`, `decisions/`, `conventions/`) | **IN scope** | `0176` decision 1's reports carve-out protects *a specimen being diagnosed*; a link is not a specimen. `fkit-task-done` names `knowledge-base/` as a repair surface by name. Measured cost of the widening: **0** |
| `ai-agents/tasks/done/**`, `ai-agents/tasks/cancelled/**` | ⛔ **NOT exempt — IN scope** | `fkit-task-done`: *"re-point the href, change nothing else."* ADR-034 grants no exemption (§2 C1). Owner ruling 2026-08-29, **"Accept — links in scope, citations exempt (Rec)"** |
| `ai-agents/wiki-vault/**` | **EXEMPT** | ADR-005. `fkit-task-done` defers to it by name: *"this sweep must not surface vault hits it has no authority to repair"* |
| `claude/`, `test/` | **OUT of scope** | Measured: 440 of 443 hits are in `test/fixtures/` — frozen fixtures ADR-042 names as such — and the rest are `claude/scaffold/` templates plus one `<NNNN>-<slug>` placeholder, whose relative links resolve **in the consuming project, not in this repo**. A guard reddening on those is not inconvenient, it is **wrong** |
| **Fenced blocks** (` ``` ` / `~~~`), fence lines included | **skipped** | `0176` decision 2, carried over |
| **Blockquote lines** (first non-space char is `>`) | **skipped** | `0176` decision 2, carried over. ⚠️ Measured blind spot: **8 instances across 6 files**, all inspected — see §7 |
| **Fence close condition** | a closing fence carries **no info string** (CommonMark) | ⭐ **Corrected 2026-08-30, review round 1 (R2).** The earlier condition closed on any same-character run and swallowed live prose after a nested opener |
| **Image syntax** `![alt](x)` | ⛔ **NOT a link — skipped** | ⭐ **Corrected 2026-08-30 (R6).** The ruled class is a markdown *inline link*; it does not name images. Measured cost: **0** |
| **Root-absolute targets** (`/x/y.md`) | resolved against the **repo root**, never the host filesystem | ⭐ **Corrected 2026-08-30 (R7).** `path.resolve` had let `/etc/hosts` escape to the host FS. Measured cost: **0** |
| ⭐ **Named exempt instances** | ⛔ **Six instances exempted BY NAME, each with its reason**, keyed on (citing file, target) — never on a line number | ⭐ **Owner ruling, 2026-08-30, "Exempt them by name (Rec)".** All six are quoted or illustrative text. Listed in §4.1's `NAMED_EXEMPT` and dispositioned in §6.2. **The guard is green: 0 broken, 6 named-exempt** |
| **Inline code spans** | **skipped** | ⭐ **New ruling**, delegated to this task by `0353`'s brief. A link in backticks is documented marker text, not a pointer |
| `http:`, `https:`, `mailto:`, `tel:`, `data:`, any scheme; protocol-relative `//`; bare `#anchor` | **skipped** | new |
| **Elided targets** (containing `…` or three ASCII dots) | **skipped** | new — prose elision, not a path |
| `path#fragment` | file part resolved; ⛔ **fragment ignored** | new. **Anchor existence is explicitly OUT of scope**, and named as a future extension rather than left silent |
| **Reference-style definitions** (`[a]: url`) | ⛔ **OUT of scope, by name** | new; none found that would change the figure |
| What counts as a link | a markdown **inline** link, `[label](target)`, with optional `<…>` target and optional `"title"` | new |

### Half B — `path` + line-number citation of a coordination document

| Element | Ruling | Authority |
|---|---|---|
| **Scanned set** | `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md` | `0176` decision 1 — **UNCHANGED** |
| `ai-agents/sprints/done/**` | ⭐ **OUT — answers `0237` step 3** | A closed board's claims are frozen. Measured cost of including it: **+4 residual** |
| `ai-agents/sprints/reviews/**` | ⭐ **OUT — answers `0237` step 3** | Same reason. Measured cost of including it: **0** |
| `ai-agents/knowledge-base/reports/` | **OUT** | `0176` decision 1 — **UNCHANGED**. `0160`'s own report cites a coordination document **as the specimen it is diagnosing** |
| `claude/`, `test/` | **OUT** | The three known-stale citations recorded in `0176`'s dated note target a **source file**, which is not a coordination document. They fail the *target* prong regardless of scanned set. `0176` refuses to widen; so does this |
| **Target class** | ⛔ **literal full path only** — `ai-agents/sprints/<name>.md`, `ai-agents/tasks/<board>/<folder>/` **`brief.md` · `plan.md` · `worklog.md` · `review.md`**, `ai-agents/wiki-vault/log.md`, each followed immediately by `:` and digits. A **left boundary** is required, so a suffix of a longer token is not a hit | `0176` decision 4 / **owner ruling 1, 2026-08-01 — NOT reopened.** ⭐ **The four-filename enumeration is a WIDENING ruled by the owner on 2026-08-30 — see §3.2, which explains why it is not a reopening.** The left boundary was added 2026-08-30 (R5); measured cost **0** |
| **Resolved shorthand** (bare `sprint-2` + line number, `0159/brief` + line number) | ⛔ **OUT, by name — still refused** | `0176`; `0353`. Not folded in, not a flag, not "behind an option" |
| **Fenced blocks + blockquote lines** | **skipped** | `0176` decision 2 — **UNCHANGED**. ⚠️ **Re-measured 2026-08-30 (R10): changes the total by 8 (190 → 182).** The figure previously stated here, *"by 1 (123 → 122)"*, was measured **before** the 2026-08-30 target-class widening (§3.2) and contradicted §5 and §6.1 of this same document |
| **Inline code spans** | ⛔ **NOT skipped** | ⭐ **New ruling.** ⚠️ **Re-measured 2026-08-30 (R10): skipping takes the total from 182 to 6 and the residual from 19 to 1.** The figures previously stated here, *"122 to 4"* and *"12 to 1"*, were both **pre-widening** (§3.2) and contradicted §6.1. Backticks are the house form for writing a coordinate here; for this half they are formatting, not quoting |
| `ai-agents/tasks/done/**`, `ai-agents/tasks/cancelled/**` | ⛔ **EXEMPT IN WHOLE** — `brief.md`, `plan.md`, `worklog.md`, `review.md` alike | ⭐ **Owner ruling, 2026-08-29 — see §3.1. This SUPERSEDES the narrower 2026-08-01 ruling** |

### 3.1 ⛔ The supersession, recorded in full — a later owner ruling, not an agent reopening one

`0353`'s brief forbids reopening `0176`'s two owner rulings, and this document does not reopen either.
**Owner ruling 2 was changed by the owner, on a later date, at the plan-approval gate.** Both rulings
are quoted here so the record needs no reconstruction.

**⏪ The earlier ruling — the owner, 2026-08-01**, via `AskUserQuestion` in a live
`/fkit-sprint-ship-loop` driver session, recorded in `0176`'s brief as "OWNER RULING 2 (R18)", verbatim:

> Cleaning the 27 citations inside closed `done/*/review.md` ledgers would mean editing **frozen
> historical ledgers** — colliding head-on with the frozen-ledger rule report §4.3 engages by name and
> with ADR-034. **The owner ruled: this policy applies going forward only. Citations already inside
> closed `done/*/review.md` ledgers are exempted by name.**
>
> **The exemption MUST be in the guard's definition from day one, or the guard is red on historical
> files the ruling has decided will never be cleaned. It is not an optimization to add later; it is
> part of the guard's definition.**
>
> **What the exemption does NOT cover, so it is not discovered late: it names `done/*/review.md` only.
> `done/*/brief.md` and `done/*/worklog.md` are NOT exempt.**

**⏩ The later ruling — the owner, 2026-08-29**, via `AskUserQuestion` in a live `fkit lead` session at
this task's plan-approval gate. The option label is the verbatim text:

> **"Widen to the whole closed folder (Rec)"**

presented as: *exempt closed `done/` and `cancelled/` folders entirely for the citation half. Residual
drops 42 → 12 across 9. Reason: the ruling's intent was that closed records are frozen; naming only
`review.md` was a 2026-08-01 approximation of that, made when the gap cost ~2 edits rather than 30.*

**What changed, exactly.** The citation half's exemption is no longer `done/*/review.md` only. Closed
`ai-agents/tasks/done/**` and `ai-agents/tasks/cancelled/**` are exempt **in whole**. The 2026-08-01
ruling's sentence *"`done/*/brief.md` and `done/*/worklog.md` are NOT exempt"* **no longer holds**, and
`plan.md` — a file type the 2026-08-01 ruling did not contemplate, because ADR-029 had not yet moved
plans inside task folders — is exempt with them.

⛔ **Nothing else moved.** Owner ruling 1 of 2026-08-01 (the **literal** full-path reading) is
**unchanged and not reopened**, and neither is any of `0176`'s four scoping decisions except where the
reconciliation table in §5 says otherwise and names its authority.

**Measured consequence, re-verified at build time (§6):** citation residual **42 across 22 → 12 across 9**
under the target class as it then stood. The prediction held exactly. ⚠️ **The residual figure moved
again on 2026-08-30** when the *target class* was widened — see §3.2. Under both changes together it is
**19 across 14**. The exemption ruling itself is untouched by that.

### 3.2 ⛔ The target-class widening — a different question from the 2026-08-01 ruling, ruled by the owner on 2026-08-30

⭐ **This is the second change to Half B that an owner made, and like §3.1 it is a later owner ruling,
not an agent reopening an earlier one.** Both rulings are quoted here so the record needs no
reconstruction, and the reason they do not collide is stated rather than assumed.

**⏪ The earlier ruling — the owner, 2026-08-01**, recorded in `0176`'s brief as
"🔒 OWNER RULING 1, 2026-08-01 — the guard ships on the LITERAL full-path reading", verbatim:

> **Decision 4 of §7.2's four is ruled: the guard's shipping condition is specified on the LITERAL
> full-path form.** Any extension to resolved shorthand (bare […]) is **filed as its own explicitly
> named decision, with its own measured cost.** It is **not** folded into this guard and **not** folded
> into decision 2.

⛔ **What the `[…]` elides, and why it is elided.** The ruling gives two examples of resolved shorthand
at that point, and both are written as a filename immediately followed by a colon and a line number —
**the exact form this document defines and `0353`'s brief forbids in this task's own artifacts.** The two
examples are `sprint-2.md` cited at line **354**, and `0159/brief.md` cited at line **13**. ⭐ **Nothing
is lost: both forms are named, in full, in two cells instead of one** — the same treatment §6 gives every
coordinate. ⛔ **This is the only elision that remains anywhere in this document, and it is marked** —
the elided text is restated in full in the sentence immediately above.

⚠️ **That claim used to read "this is the only elision anywhere in this document" and it was FALSE.
Review round 2 (R9) caught it.** Four further elisions sat inside blocks this document labels
*verbatim* — one in §1's `fkit-task-done` quotation, one in §3.1's quotation of the 2026-08-01 ruling,
and **two in the ruling quoted immediately above, three lines under the claim itself** — and, worse, a
**whole owner paragraph was dropped from §3.1's quotation with no marker at all.** That dropped
paragraph is the one instructing `0176`'s implementer that the exemption **must be in the guard's
definition from day one**, not bolted on afterwards as a post-filter — an instruction `0176`'s own brief
leans on by name. ⛔ **All five were restored in full on 2026-08-30**, on the owner's ruling
**"Restore the dropped paragraph, mark the rest (Rec)"**. ⭐ **None of the five contained the coordinate
form `0353`'s brief forbids, so every one could be restored outright rather than marked** — and
restoring beats marking wherever it is available. **The claim above is now true by construction rather
than by assertion.**
>
> **Why: literal is the only reproducible reading.** Run independently, the reviewer, Codex and the
> report's author all land on the same literal figures — **38 citations / 19 files**, **27 of them**
> inside closed `done/*/review.md`. The shorthand reading did **not** reproduce across those same
> runs: published **391 / 53**, Codex **399 / 53**, reviewer **296–318 / 46–48**. **A test's
> acceptance criterion must be reproducible**, and a figure that moves by ~30% depending on whose
> pattern resolves the shorthand cannot be one.

**⏩ The later ruling — the owner, 2026-08-30**, via `AskUserQuestion` in a live `fkit lead` session, on
review round 1's finding R1. The option label is the verbatim text:

> **"Not a reopening — widen it (Rec)"**

presented as: *the 2026-08-01 ruling settled literal vs resolved shorthand, and these 7 are fully
literal `ai-agents/`-prefixed full paths — a different question. Cost: `0237`'s work list goes 12 → 19
across 14 files, all open briefs, none frozen.*

**⛔ Why this is a different question, stated so nobody has to re-derive it.** Owner ruling 1 settled
**one axis only: literal full paths versus resolved shorthand.** It gave a reason — reproducibility —
and that reason is about *resolution*, not about *which filenames count*. It never enumerated
filenames. The seven citations the old enumeration missed are **fully literal, fully `ai-agents/`-prefixed
full paths followed by `:` and a line number** — squarely inside "literal full path", squarely outside
the shipped regex. ⭐ **Widening the enumeration therefore leaves owner ruling 1 exactly where it
stands**, and the shorthand extension it refused is **still refused, by name** (§3 Half B, §7 item 5).

⚠️ **Why the gap existed at all** is the same reason §3.1 gives for `plan.md`: `0176`'s condition was
written before ADR-029 moved plans, worklogs and review ledgers inside the task folder, so the
enumeration named the one file type that existed there. §3.1 already applied that reasoning to the
*citing* side. It was missed on the *cited* side, and review round 1 caught it.

**Measured consequence, re-verified 2026-08-30 (§6.1):** residual **12 across 9 → 19 across 14**, and
all 7 additions sit in **open backlog briefs** — none in a frozen closed record. ⭐ **The 19/14 figure
is `0237`'s work list.**

---

## 4. ⭐ The matcher — this IS the condition

Two self-contained Node scripts, no dependencies beyond builtins, runnable from the repo root.
**They are the specification.** `0354` transcribes Half A into `test/reference-integrity.test.js`;
`0176` transcribes Half B into `test/coordination-citation-policy.test.js`.

⛔ **Do not paraphrase these into a fresh regex.** §2 C2 is the measured evidence of what that costs.

Each script carries environment switches used **only** to reproduce the recorded alternate readings in
§6 and §7. **The settled condition is every switch at its default.**

### 4.1 Half A — link resolution

```js
#!/usr/bin/env node
// ============================================================================
// HALF A — MARKDOWN LINK RESOLUTION. The settled condition, task 0353.
// Run from the repo root:  node link-resolution.js
// Self-contained: no dependencies, no imports beyond node builtins.
// 0354 should TRANSCRIBE this, not re-derive it.
// ============================================================================
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

// Recorded alternate readings, for reproducing the blind-spot table only.
// The SETTLED condition is every switch at its default.
const OPT = {
  spans: process.env.SPANS !== '0',          // mask inline code spans (settled: yes)
  spanScope: process.env.SPAN_SCOPE || 'line', // 'line' | 'doc'  (settled: line)
  quotes: process.env.QUOTES !== '0',        // mask blockquote lines (settled: yes)
  fences: process.env.FENCES !== '0',        // mask fenced blocks  (settled: yes)
  exemptClosed: process.env.EXEMPT_CLOSED === '1', // settled: NO (closed folders are IN scope)
};

// ---------------------------------------------------------------------------
// 1. THE SCANNED SET.  Every .md under ai-agents/, recursively.
//    EXEMPT: ai-agents/wiki-vault/** — ADR-005 puts it out of every role's
//    reach but fkit-wiki's, so a guard that reddens on it is a guard nobody
//    may make green.
//    NOT exempt: tasks/done, tasks/cancelled, sprints/done, sprints/reviews,
//    knowledge-base/** — a link is a pointer, and a rotted pointer is repairable.
//    OUT of scope entirely: claude/, test/ — 440 of 443 hits there are frozen
//    test/fixtures/; the rest are claude/scaffold/ templates whose relative
//    links resolve in the CONSUMING project, not in this repo.
// ---------------------------------------------------------------------------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}
function exemptFile(rel) {
  if (rel.startsWith('ai-agents/wiki-vault/')) return true;
  if (OPT.exemptClosed && (rel.startsWith('ai-agents/tasks/done/') ||
      rel.startsWith('ai-agents/tasks/cancelled/') ||
      rel.startsWith('ai-agents/sprints/done/'))) return true;
  return false;
}
const files = walk(path.join(ROOT, 'ai-agents'))
  .map((p) => path.relative(ROOT, p).split(path.sep).join('/'))
  .filter((rel) => !exemptFile(rel))
  .sort();

// ---------------------------------------------------------------------------
// 2. MASKING.  A masked character becomes a space, so every offset and every
//    line number stays exactly where it was.
// ---------------------------------------------------------------------------
const blank = (s) => ' '.repeat(s.length);

// 2a. Fenced blocks (``` or ~~~), the fence lines themselves included.
// 2b. Blockquote lines — first non-space character is '>'.
//     Both carried over from 0176 scoping decision 2: a quotation is not a
//     link, and flagging one punishes the document that defines the convention.
function maskFencesAndQuotes(lines) {
  let fence = null;
  return lines.map((line) => {
    const m = /^\s{0,3}(`{3,}|~{3,})([^`~]*)$/.exec(line);
    if (fence !== null) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && m[2].trim() === "") fence = null;
      return OPT.fences ? blank(line) : line;
    }
    if (m) { fence = m[1]; return OPT.fences ? blank(line) : line; }
    if (OPT.quotes && /^\s*>/.test(line)) return blank(line);
    return line;
  });
}

// 2c. Inline code spans.  A run of N backticks opens a span; the next run of
//     EXACTLY N closes it; an unpaired run is literal text.
//     RULED: for the LINK half a link inside backticks is documented marker
//     text, not a pointer offered to a reader — so it is SKIPPED.
//     (The citation half rules the opposite way. See §1.)
function maskCodeSpans(text) {
  const out = text.split('');
  let i = 0;
  while (i < out.length) {
    if (out[i] !== '`') { i++; continue; }
    let n = 0; while (out[i + n] === '`') n++;
    let j = i + n, close = -1;
    while (j < out.length) {
      if (out[j] === '`') {
        let k = 0; while (out[j + k] === '`') k++;
        if (k === n) { close = j; break; }
        j += k;
      } else j++;
    }
    if (close === -1) { i += n; continue; }
    for (let x = i; x < close + n; x++) if (out[x] !== '\n') out[x] = ' ';
    i = close + n;
  }
  return out.join('');
}

// ---------------------------------------------------------------------------
// 3. THE MATCH RULE.
// ---------------------------------------------------------------------------
// What counts as a link: a markdown inline link. Reference-style definitions
// ([a]: url) are OUT of scope, named rather than silently dropped.
const LINK = /(?<!!)\[[^\]\n]*\]\(\s*(<[^>\n]*>|[^()\s]+)(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\)/g;
// Skipped target classes: absolute schemes and a bare in-page anchor.
const SKIP_SCHEME = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
// Skipped: an ELIDED target — prose elision, not a path.
const ELIDED = (t) => t.includes('…') || t.includes('...');

// ---------------------------------------------------------------------------
// 3b. NAMED EXEMPT INSTANCES — owner ruling, 2026-08-30, "Exempt them by name (Rec)".
//     Each surviving instance was read in its surrounding source and is quoted or
//     illustrative text, NOT a pointer offered to a reader. They are exempted BY
//     NAME, with the reason, so the guard goes green honestly and 0355 inherits a
//     disposition rather than a shrug.
//     Keyed on (citing file, target) — deliberately NOT on a line number, because a
//     line number is the very claim form this document rules unsafe for a living file.
//     ⚠️ Cost of the key: a FUTURE genuine rot with the same (file, target) pair is
//     also suppressed. Named in §7 as a blind spot, measured cost 0 today.
// ---------------------------------------------------------------------------
const NAMED_EXEMPT = new Set([
  // Synthetic illustrative board row inside ADR-040's own diagnosis of the old regex.
  'ai-agents/knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md::plan-sprint-4c.md',
  // Proposed replacement text for claude/skills/fkit-status/SKILL.md, quoted in an edit
  // block. The ../../../ depth is correct AT THAT TARGET, wrong from the task folder.
  'ai-agents/tasks/done/0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/plan.md::../../../ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md',
  // Throwaway scratchpad test-fixture rows quoted in 0268's worklog; the fixture never
  // existed in the repo ("never in the repo, never under ai-agents/" — the worklog itself).
  'ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/worklog.md::../sprint-4c.md',
  'ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/worklog.md::../tasks/backlog/0001-a/brief.md',
  // Proposed replacement text for claude/skills/fkit-stateful-review/SKILL.md, quoted in
  // an edit table. The ../ depth is correct AT THAT TARGET. Two occurrences, one pair.
  'ai-agents/tasks/done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/plan.md::../fkit-review/SKILL.md',
]);

const broken = []; let namedExempt = 0;
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  let masked = maskFencesAndQuotes(src.split('\n')).join('\n');
  if (OPT.spans) {
    masked = OPT.spanScope === 'doc'
      ? maskCodeSpans(masked)
      : masked.split('\n').map(maskCodeSpans).join('\n');
  }
  masked.split('\n').forEach((line, idx) => {
    for (const m of line.matchAll(LINK)) {
      let t = m[1].replace(/^</, '').replace(/>$/, '');
      if (SKIP_SCHEME.test(t)) continue;
      if (ELIDED(t)) continue;
      t = t.split('#')[0];              // FRAGMENT IGNORED. Anchor existence is
      if (t === '') continue;           // explicitly OUT of scope (future work).
      try { t = decodeURIComponent(t); } catch (_) { /* keep raw */ }
      const abs = t.startsWith('/')
        ? path.join(ROOT, t)              // ROOT-ABSOLUTE: rebased onto the repo root
        : path.resolve(ROOT, path.dirname(rel), t);
      // CONTAINMENT (added 2026-08-30, R12). Rebasing alone does NOT confine the
      // target: path.join/resolve normalize '..', so both branches could still
      // land outside ROOT (e.g. '/../../../etc/hosts' -> '/etc/hosts', which
      // exists). A target outside the repo is never a satisfied link here.
      if (fs.existsSync(abs) && (abs === ROOT || abs.startsWith(ROOT + path.sep))) continue;
      if (NAMED_EXEMPT.has(rel + '::' + t)) { namedExempt++; continue; }
      broken.push({ file: rel, line: idx + 1, target: t });
    }
  });
}

// Output deliberately does NOT use the `file.md:NNN` form — the guard against a
// citation form must not emit it.
for (const b of broken) console.log(`${b.file}  (line ${b.line})  ->  ${b.target}`);
console.log(`\nBROKEN: ${broken.length} instances across ${new Set(broken.map((b) => b.file)).size} files`);
console.log(`NAMED-EXEMPT: ${namedExempt} instances (see the exemption list above, each with its reason)`);
console.log(`SCANNED: ${files.length} files`);
```

### 4.2 Half B — coordination-document citation

```js
#!/usr/bin/env node
// ============================================================================
// HALF B — COORDINATION-DOCUMENT `path` + LINE-NUMBER CITATION.
// The settled condition, task 0353, reconciled against 0176's four scoping
// decisions and its two 2026-08-01 owner rulings (one of which was SUPERSEDED
// by a later owner ruling on 2026-08-29 — see the condition document).
// Run from the repo root:  node coordination-citation.js
// Self-contained: no dependencies. 0176's implementer should TRANSCRIBE this.
// ============================================================================
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

// Recorded alternate readings, for reproducing the blind-spot table only.
// The SETTLED condition is every switch at its default.
const OPT = {
  fences: process.env.FENCES !== '0',        // skip fenced blocks   (settled: yes)
  quotes: process.env.QUOTES !== '0',        // skip blockquote lines (settled: yes)
  spans: process.env.SPANS === '1',          // skip inline code spans (settled: NO)
  wide: process.env.WIDE === '1',            // add sprints/done + sprints/reviews (settled: NO)
  oldExempt: process.env.OLD_EXEMPT === '1', // 2026-08-01 shape: done/*/review.md only
};

// ---------------------------------------------------------------------------
// 1. THE SCANNED SET — 0176 scoping decision 1, UNCHANGED.
//      ai-agents/tasks/*/*/*.md   +   ai-agents/sprints/*.md
//    NOT widened to knowledge-base/reports/ (0176 decision 1: a report cites a
//    coordination document AS THE SPECIMEN IT IS DIAGNOSING).
//    NOT widened to sprints/done/ or sprints/reviews/ — a closed board's claims
//    are frozen. This is the ANSWER to 0237 step 3, for this half.
// ---------------------------------------------------------------------------
const scanned = [];
const tasksDir = path.join(ROOT, 'ai-agents/tasks');
if (fs.existsSync(tasksDir)) {
  for (const board of fs.readdirSync(tasksDir)) {
    const bp = path.join(tasksDir, board);
    if (!fs.statSync(bp).isDirectory()) continue;
    for (const folder of fs.readdirSync(bp)) {
      const fp = path.join(bp, folder);
      if (!fs.statSync(fp).isDirectory()) continue;
      for (const f of fs.readdirSync(fp)) {
        if (f.endsWith('.md') && fs.statSync(path.join(fp, f)).isFile()) {
          scanned.push(`ai-agents/tasks/${board}/${folder}/${f}`);
        }
      }
    }
  }
}
for (const f of fs.readdirSync(path.join(ROOT, 'ai-agents/sprints'))) {
  if (f.endsWith('.md') && fs.statSync(path.join(ROOT, 'ai-agents/sprints', f)).isFile()) {
    scanned.push(`ai-agents/sprints/${f}`);
  }
}
if (OPT.wide) {
  for (const sub of ['done', 'reviews']) {
    const d = path.join(ROOT, 'ai-agents/sprints', sub);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (f.endsWith('.md')) scanned.push(`ai-agents/sprints/${sub}/${f}`);
  }
}
scanned.sort();

// ---------------------------------------------------------------------------
// 2. THE EXEMPTION SET.
//    OWNER RULING, 2026-08-29: closed task folders are exempt IN WHOLE —
//    ai-agents/tasks/done/** and ai-agents/tasks/cancelled/**, every file in
//    them (brief.md, plan.md, worklog.md, review.md alike).
//    This SUPERSEDES the narrower 2026-08-01 owner ruling (which named
//    done/*/review.md only). Superseded by a later OWNER ruling, not reopened
//    by an agent. Set OLD_EXEMPT=1 to reproduce the 2026-08-01 shape.
// ---------------------------------------------------------------------------
function exempt(rel) {
  if (OPT.oldExempt) return /^ai-agents\/tasks\/done\/[^/]+\/review\.md$/.test(rel);
  return rel.startsWith('ai-agents/tasks/done/') || rel.startsWith('ai-agents/tasks/cancelled/');
}

// ---------------------------------------------------------------------------
// 3. THE MATCH RULE.
//    THE READING IS LITERAL — 0176 owner ruling 1, 2026-08-01, UNCHANGED and
//    NOT reopened. A full path naming a COORDINATION DOCUMENT, followed
//    immediately by ':' and a line number. Resolved shorthand
//    (bare `sprint-2` + line number) is OUT, by name, and stays out.
// ---------------------------------------------------------------------------
const TARGET = new RegExp(
  '(?<![\\w./-])' +
  'ai-agents/(?:' +
    'sprints/[^/\\s`)\\]]+\\.md' +            // ai-agents/sprints/*.md
    '|tasks/[^/\\s`)\\]]+/[^/\\s`)\\]]+/(?:brief|plan|worklog|review)\\.md' +   // ai-agents/tasks/*/*/brief.md
    '|wiki-vault/log\\.md' +                  // ai-agents/wiki-vault/log.md
  '):\\d+', 'g');

const blank = (s) => ' '.repeat(s.length);
function maskFencesAndQuotes(lines) {
  let fence = null;
  return lines.map((line) => {
    const m = /^\s{0,3}(`{3,}|~{3,})([^`~]*)$/.exec(line);
    if (fence !== null) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && m[2].trim() === "") fence = null;
      return OPT.fences ? blank(line) : line;
    }
    if (m) { fence = m[1]; return OPT.fences ? blank(line) : line; }
    if (OPT.quotes && /^\s*>/.test(line)) return blank(line);
    return line;
  });
}
// ⛔ NOT applied by default. Skipping inline code spans takes this half's total
//    from 182 to 6 (residual 19 to 1; re-measured 2026-08-30) and guts the guard:
//    EVERY coordinate in this repo is written
//    inside backticks, because that is the house style for writing one. For
//    THIS half backticks are formatting, not quoting. Measured, not assumed.
function maskCodeSpans(line) {
  const out = line.split('');
  let i = 0;
  while (i < out.length) {
    if (out[i] !== '`') { i++; continue; }
    let n = 0; while (out[i + n] === '`') n++;
    let j = i + n, close = -1;
    while (j < out.length) {
      if (out[j] === '`') { let k = 0; while (out[j + k] === '`') k++; if (k === n) { close = j; break; } j += k; }
      else j++;
    }
    if (close === -1) { i += n; continue; }
    for (let x = i; x < close + n; x++) out[x] = ' ';
    i = close + n;
  }
  return out.join('');
}

let total = 0; const totalFiles = new Set();
const residual = []; let exemptCount = 0; const exemptFiles = new Set();
for (const rel of scanned) {
  let lines = maskFencesAndQuotes(fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n'));
  if (OPT.spans) lines = lines.map(maskCodeSpans);
  lines.forEach((line, idx) => {
    for (const m of line.matchAll(TARGET)) {
      total++; totalFiles.add(rel);
      if (exempt(rel)) { exemptCount++; exemptFiles.add(rel); }
      else residual.push({ file: rel, line: idx + 1, hit: m[0] });
    }
  });
}

// Output deliberately does NOT reproduce the `file.md:NNN` form for the CITING
// site — a guard against a citation form must not emit it. The offending
// substring is printed because it is the finding itself.
for (const r of residual) console.log(`${r.file}  (line ${r.line})  ->  ${r.hit}`);
console.log(`\nSCANNED: ${scanned.length} files`);
console.log(`TOTAL:   ${total} citations across ${totalFiles.size} files`);
console.log(`EXEMPT:  ${exemptCount} across ${exemptFiles.size} files`);
console.log(`RESIDUAL: ${residual.length} across ${new Set(residual.map((r) => r.file)).size} files`);
```

---

## 5. The reconciliation table — one row per `0176` scoping decision and per `0237` open question

| # | `0176` decision / `0237` question | Verdict | Authority |
|---|---|---|---|
| **1** | Scanned set = `tasks/*/*/*.md` + `sprints/*.md`; **do not widen to reports** | **Citation half: UNCHANGED.** **Link half: WIDENED** to `ai-agents/**/*.md`, reports included | `0176` decision 1 preserved for citations. The reports carve-out is specimen-protection and does not transfer to pointers; `fkit-task-done` names `knowledge-base/` as a repair surface. **Measured cost of the widening: 0** |
| **2** | Skip fenced blocks and blockquote lines | **UNCHANGED, both halves** — but the *close condition* was **CORRECTED** (R2) to CommonMark's rule: a closing fence carries no info string | `0176` decision 2. Re-verified 2026-08-30 under the widened target class: the convention changes the citation total by **1** excluding this task's own review ledger, and by **8** including it — ⭐ the extra 7 are the ledger's own fenced quotation of finding R1, a direct instance of §6's self-measurement warning. `0160`'s *"changes the count by zero"* claim is off by one — recorded, not hidden |
| **2b** | *(silent in `0176`)* Inline code spans | ⭐ **ANSWERED — and the halves diverge.** Link half: **skipped**. Citation half: ⛔ **not skipped** | **New ruling**, delegated to this task by `0353`'s brief. Re-measured 2026-08-30: link half **127 → 0** (6 named-exempt); citation half **182 → 6** |
| **3** | It is red today; shipping it red is not an option | **UNCHANGED** — and the citation figure has moved **11 across 8 (2026-08-01) → 42 across 22 (2026-08-29, old exemption) → 12 across 9 (2026-08-29, settled)** | `0176`. Re-measured at build time |
| **4** | 🔒 The reading is **LITERAL** (owner ruling 1, 2026-08-01) | **UNCHANGED — NOT reopened.** The shorthand extension it refused is still refused, by name | Owner, 2026-08-01 |
| **4b** | *(silent in `0176`)* **Which filenames count as a cited coordination document** | ⭐ **WIDENED** — `brief.md` **+ `plan.md`, `worklog.md`, `review.md`** | ⛔ **Owner ruling, 2026-08-30, "Not a reopening — widen it (Rec)".** A **different axis** from ruling 1, which settled literal-vs-shorthand and never enumerated filenames. §3.2 quotes both rulings and dates both. **Measured cost: residual 12 across 9 → 19 across 14**, all 7 additions in open backlog briefs |
| — | 🔒 Closed `done/*/review.md` exempt, **by name and only that** (owner ruling 2, 2026-08-01) | ⭐ **Citation half: SUPERSEDED — widened to the whole closed folder.** **Link half: does not inherit it — closed folders are IN scope** | ⛔ **Superseded by a LATER OWNER RULING, 2026-08-29, "Widen to the whole closed folder (Rec)" — not reopened by an agent.** See §3.1, which quotes both rulings and dates both. The link-half half of the row: owner ruling 2026-08-29, "Accept — links in scope, citations exempt (Rec)"; `fkit-task-done` mandates the repair; see §2 C1 |
| — | `0237` step 3 — does the condition reach `ai-agents/sprints/done/*.md`? | ⭐ **ANSWERED. Citation half: NO. Link half: YES.** Not "both are defensible" | Frozen claims versus repairable pointers (§1). Measured cost of the other choice on the citation half: **+4 residual** |
| — | `0237` step 3 — does it reach `ai-agents/sprints/reviews/*.md`? | ⭐ **ANSWERED. Citation half: NO. Link half: YES.** | Same principle. Measured cost of the other choice on the citation half: **0** |
| — | The shorthand extension | **UNCHANGED — still refused, by name** | `0176`; `0353` |
| — | ADR-034 as the closed-folder authority | ⛔ **CORRECTED — it never granted one** | ADR-034's own **Scope** and **Consequences**, quoted in §2 C1 |
| — | `claude/` and `test/` reach (`0176`'s three known-stale citations) | **Both halves: OUT of scope.** Citation half: they fail the *target* prong (a source file is not a coordination document) regardless of scanned set. Link half: 440 of 443 hits are frozen `test/fixtures/`, the rest resolve post-install | `0176` refuses to widen; ADR-042 names the fixtures frozen. The three stale citations remain a **real defect that neither guard will catch** — recorded in §7 |

---

## 6. The measured red set under the settled condition

**Measured 2026-08-29, HEAD `1f33b95`; RE-MEASURED 2026-08-30 after review round 1.** Every command
below was run from the repo root with the §4 scripts saved to a session scratchpad (never to the repo),
extracted **verbatim from §4 of this document**.

> ⛔ **What is and is not guaranteed reproducible — corrected 2026-08-30 (R8).** Only the **settled**
> rows below are stable claims. The **alternate-reading** rows are *not* guaranteed to reproduce later,
> and two of them already did not: this document, this task's `worklog.md` and this task's `review.md`
> are themselves inside the scanned sets, so **the document changes its own measurements as it is
> written and reviewed.** Two concrete instances, both live:
> - Half A's `SPANS=0 QUOTES=0` and naive rows moved as `0353`'s own artifacts were added to
>   `ai-agents/`. The **settled** figure did not.
> - Half B's fences-and-quotes-counted total is **8 above** the settled total, of which **7 are this
>   task's own review ledger quoting finding R1 inside a fenced block**. Excluding this task's own
>   ledger the convention still moves the total by **1**, exactly as first reported.
>
> ⭐ **Re-run §4's scripts before acting on any alternate-reading number. Do not cite one as a fact
> about the repo.**

> ⚠️ **On the form of the listings below.** The per-instance listings render the citing file and its
> line number in **separate columns**, and the scripts print `(line N)` rather than `file:N`,
> deliberately: a document defining the ban on `path` + line-number citation of a coordination document
> must not ship carrying the form. No evidence is lost — every coordinate is present, in two cells
> instead of one.

### 6.1 Half B — citation half

```
$ node coordination-citation.js | tail -4
SCANNED: 708 files
TOTAL:   182 citations across 79 files
EXEMPT:  163 across 65 files
RESIDUAL: 19 across 14 files
```

⭐ **Two owner rulings are folded into that figure, and they pull in opposite directions:**

- **The 2026-08-29 exemption widening (§3.1)** — closed folders exempt in whole. On its own: **42 across
  22 → 12 across 9.** Re-verified; the prediction held exactly.
- **The 2026-08-30 target-class widening (§3.2)** — `plan.md` / `worklog.md` / `review.md` counted
  alongside `brief.md`. On top of the above: **12 across 9 → 19 across 14.**

```
$ OLD_EXEMPT=1 node coordination-citation.js | tail -4
SCANNED: 708 files
TOTAL:   182 citations across 79 files
EXEMPT:  114 across 42 files
RESIDUAL: 68 across 37 files
```

**The 19 residual instances, across 14 files:**

| Citing file | Line | Cited coordination document | Line cited |
|---|---|---|---|
| `ai-agents/sprints/backlog.md` | 156 | `ai-agents/wiki-vault/log.md` | 623 |
| `ai-agents/tasks/backlog/0149-record-that-0118s-block-on-0117-was-discharged-by-another-route/brief.md` | 32 | `ai-agents/tasks/done/0117-wiki-ingest-lead-conductor-and-adrs-031-032/review.md` | 33 |
| `ai-agents/tasks/backlog/0165-decide-where-a-check-on-the-wiki-flags-emitted-form-can-live/brief.md` | 38 | `ai-agents/wiki-vault/log.md` | 623 |
| `ai-agents/tasks/backlog/0166-decide-the-enforcement-point-for-run-every-command-you-print/brief.md` | 43 | `ai-agents/wiki-vault/log.md` | 657 |
| `ai-agents/tasks/backlog/0193-repair-the-stale-citations-in-0158s-closed-brief/brief.md` | 58 | `ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/brief.md` | 10 |
| `ai-agents/tasks/backlog/0221-repair-0194s-false-0190-clause-does-not-exist-premise/brief.md` | 24 | `ai-agents/tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md` | 31 |
| `ai-agents/tasks/backlog/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md` | 38 | `ai-agents/tasks/done/0195-…/worklog.md` | 188 |
| `ai-agents/tasks/backlog/0274-append-dated-coverage-corrections-to-0259s-and-0264s-closed-review-ledgers/brief.md` | 162 | `ai-agents/tasks/done/0265-implement-adr-041s-dashboard-half-the-backlog-identity-token-and-the-resolve-identity-interface/review.md` | 10 |
| `ai-agents/tasks/backlog/0286-mechanical-citation-sweep-of-architecture-md/brief.md` | 158 | `ai-agents/sprints/backlog.md` | 101 |
| `ai-agents/tasks/backlog/0286-mechanical-citation-sweep-of-architecture-md/brief.md` | 159 | `ai-agents/tasks/backlog/0145-…/brief.md` | 21 |
| `ai-agents/tasks/backlog/0287-wiki-resync-of-the-codex-sandbox-read-only-pages-after-0273/brief.md` | 27 | `ai-agents/wiki-vault/log.md` | 2008 |
| `ai-agents/tasks/backlog/0287-wiki-resync-of-the-codex-sandbox-read-only-pages-after-0273/brief.md` | 223 | `ai-agents/wiki-vault/log.md` | 2008 |
| `ai-agents/tasks/backlog/0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md` | 418 | `ai-agents/tasks/done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md` | 12 |
| `ai-agents/tasks/backlog/0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md` | 50 | `ai-agents/sprints/backlog.md` | 212 |
| `ai-agents/tasks/backlog/0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md` | 300 | `ai-agents/sprints/backlog.md` | 212 |
| `ai-agents/tasks/backlog/0348-decide-and-if-ruled-correct-the-two-post-adr-042-coverage-full-review-ledgers/brief.md` | 96 | `ai-agents/tasks/done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/review.md` | 12 |
| `ai-agents/tasks/backlog/0348-decide-and-if-ruled-correct-the-two-post-adr-042-coverage-full-review-ledgers/brief.md` | 97 | `ai-agents/tasks/done/0188-repair-the-five-live-ownership-fact-defects/review.md` | 27 |
| `ai-agents/tasks/backlog/0350-append-the-dated-r3-discharge-note-to-0125s-closed-review-ledger/brief.md` | 55 | `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md` | 109 |
| `ai-agents/tasks/backlog/0350-append-the-dated-r3-discharge-note-to-0125s-closed-review-ledger/brief.md` | 56 | `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/plan.md` | 127 |

**This is `0237`'s work list.** 19 instances, 14 files, **all in open backlog briefs plus the live
backlog board.** ⭐ **No closed record needs editing** — the point of the 2026-08-29 ruling — and
**nothing frozen was added by the 2026-08-30 widening**: all 7 additions are open briefs.

⚠️ **Two rows carry a caveat, stated rather than left for `0237` to trip over:**

- `0224`'s brief cites `ai-agents/tasks/done/0195-…/worklog.md` — the folder segment is **elided with
  `…`**. It is still a literal `ai-agents/`-prefixed coordinate and the matcher counts it, but Half A
  skips elided targets and Half B has **no elision rule at all**. ⭐ **Named as a new blind spot (§7
  item 10), measured cost: 1.** `0237` should treat it as a citation to repair, not a path to resolve.
- `0286`'s brief cites `ai-agents/tasks/backlog/0145-…/brief.md` — same class, same disposition. Both
  are inside the count of 19.

**Alternate readings** ⚠️ **(not guaranteed reproducible — see the §6 note)**:

| Reading | Command | Total | Exempt | Residual |
|---|---|---|---|---|
| ⭐ **Settled** | `node coordination-citation.js` | 182 / 79 | 163 / 65 | ⭐ **19 across 14** |
| 2026-08-01 exemption shape | `OLD_EXEMPT=1 node …` | 182 / 79 | 114 / 42 | 68 across 37 |
| No skipping at all | `FENCES=0 QUOTES=0 node …` | **190** / 80 | 164 / 65 | 26 across 15 |
| ⛔ Inline code spans also skipped | `SPANS=1 node …` | ⛔ **6** / 5 | 5 / 4 | ⛔ **1 across 1** |
| Scanned set widened to `sprints/done/` + `sprints/reviews/` | `WIDE=1 node …` | 188 / 81 | 163 / 65 | 25 across 16 |
| …widened **and** 2026-08-01 exemption | `WIDE=1 OLD_EXEMPT=1 node …` | 188 / 81 | 114 / 42 | 74 across 39 |

**Two results decide this half.**

1. `0176` decision 2's convention moves the total by **1 excluding this task's own review ledger**
   (190 − 7 ledger hits = 183, against the settled 182). ⭐ **Including the ledger it moves it by 8**,
   and all 7 of the difference are the ledger quoting finding R1 inside a fence — the self-measurement
   effect the §6 note warns about, caught in the act. `0160`'s *"changes the count by zero"* claim is
   **off by one** — small, but no longer literally true, and this document says so.
2. ⛔ **Skipping inline code spans collapses the total from 182 to 6 — a 30× lever that would gut the
   guard.** Every coordinate in this repo is written inside backticks, because
   `durable-citation-anchors` is the house style for writing one. **Ruled explicitly and measured, so a
   later implementer cannot re-derive it the other way by accident.**

### 6.2 Half A — link half

```
$ node link-resolution.js

BROKEN: 0 instances across 0 files
NAMED-EXEMPT: 6 instances (see the exemption list above, each with its reason)
SCANNED: 819 files
```

⭐ **The link guard is GREEN, and honestly so.** Not because nothing matched — **six instances matched**
— but because all six were read in their surrounding source, all six are quoted or illustrative text,
and the owner ruled on 2026-08-30 (**"Exempt them by name (Rec)"**) that they be **named as exempt cases
with their reasons** rather than left as a red set someone is told to ignore. The list is in §4.1's
`NAMED_EXEMPT`, keyed on (citing file, target) — ⛔ **never on a line number**, because a line number is
the exact claim form this document rules unsafe against a living file.

**Without the named exemptions** (`NAMED_EXEMPT` emptied) the settled matcher reports **6 instances
across 4 files** — ⛔ **not the 5 across 3 this document previously reported.** The earlier figure came
from the fence-close bug corrected on 2026-08-30 (§2 C2, R2); **the plan's 6 across 4 was right.**

**The six named-exempt instances, each with its reason:**

| Citing file | Line | Target | What it actually is | Why it is exempt |
|---|---|---|---|---|
| `ai-agents/knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md` | 188 | `plan-sprint-4c.md` | A **synthetic illustrative board row** inside ADR-040's own diagnosis of the old regex: *"Without it, `➡️ Moved to [Sprint 4c](plan-sprint-4c.md) — priority 3` parses `moved_target="Sprint 4"`"* | The target was **never meant to exist**. Repairing it would destroy the specimen the ADR is diagnosing |
| `ai-agents/tasks/done/0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/plan.md` | 49 | `../../../ai-agents/knowledge-base/decisions/adr-041-…md` | **Proposed replacement text** for `claude/skills/fkit-status/SKILL.md`, quoted inside an edit block | The `../../../` depth is **correct at the target file**, wrong only when read from the task folder. Repairing it would corrupt the proposal. ⭐ **This is the instance the fence bug hid** |
| `ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/worklog.md` | 131 | `../sprint-4c.md` | A **throwaway scratchpad test-fixture row**, quoted in the worklog, whose own preceding line reads *"Throwaway fixture built in the session scratchpad (**never** in the repo, never under `ai-agents/`)"* | The target never existed in the repo **by design** |
| *(same file)* | 132 | `../tasks/backlog/0001-a/brief.md` | Same fixture, same row set | Same reason |
| `ai-agents/tasks/done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/plan.md` | 110 | `../fkit-review/SKILL.md` | **Proposed skill text**, quoted in an edit table | Depth is **correct from `claude/skills/fkit-stateful-review/`**, the file the text is proposed for |
| *(same file)* | 125 | `../fkit-review/SKILL.md` | Same proposal | Same reason. One (file, target) pair covers both occurrences |

⛔ **`0355` inherits this table as its disposition.** Its work is **not** "clean 24 broken links", and it
is **not** "ignore 6 false positives" either — it is **nothing**, because the condition itself now names
all six and says why. See §8 E2.

⚠️ **The cost of the exemption key, stated not buried.** Keying on (citing file, target) means a
**future genuine rot with the same pair is also suppressed.** Measured cost today: **0**. Named in §7
item 9. The alternative — keying on a line number — would have made this document violate its own rule.

**Alternate readings** ⚠️ **(not guaranteed reproducible — see the §6 note)**:

| Reading | Command | Broken | Files |
|---|---|---|---|
| ⭐ **Settled** (line-level span masker, named exemptions applied) | `node link-resolution.js` | ⭐ **0** | **0** |
| Settled, `NAMED_EXEMPT` emptied | *(edit the set to `new Set([])`)* | 6 | 4 |
| Document-level span masker | `SPAN_SCOPE=doc node …` | 1 | 1 |
| Blockquotes counted | `QUOTES=0 node …` | 8 | 6 |
| Fences only, spans counted | `SPANS=0 QUOTES=0 node …` | **130** | 60 |
| Naive — nothing skipped | `SPANS=0 QUOTES=0 FENCES=0 node …` | **166** | 72 |
| Settled **+ closed folders also exempt** (the briefs' assumption) | `EXEMPT_CLOSED=1 node …` | 0 | 0 |

**Out-of-scope surfaces, measured so the exclusion is evidence and not assertion** (the walker's root
was pointed at each in turn, with the vault exemption lifted):

| Surface | Settled matcher | Naive matcher | Why it is out |
|---|---|---|---|
| `ai-agents/wiki-vault/` (275 files) | **0 broken** | 12 across 8 | ADR-005 — no role but `fkit-wiki` may repair it. **Scope no cleanup against these** |
| `test/` (2 files) | **440 across 2** | — | **All 440 in `test/fixtures/`** — frozen fixtures (ADR-042) |
| `claude/` (53 files) | **3 across 3** | — | 2 in `claude/scaffold/` templates that resolve **in the consuming project**; 1 is a `<NNNN>-<slug>` placeholder in `claude/skills/fkit-task-brief/SKILL.md`. **A guard reddening on these is wrong, not merely inconvenient** |

### 6.3 ⛔ Against the three readings tabulated in `0353`'s brief

`0353`'s brief tabulates the link half as `304 / 60 / 24 / 17`.

⛔ **The settled condition matches NONE of them, and none of the four reproduced.** Why, precisely:

- **`304` (naive, no exemptions)** — the settled matcher's naive reading is **163**. The gap is
  fence-masking and link-syntax strictness, not exemptions.
- **`60` (fences + spans skipped, no exemptions)** — the settled matcher reads **6** before named
  exemptions and **0** after. The brief's matcher skipped code spans only *within* a line without
  pairing backtick runs, so it left most multi-backtick spans unmasked.
- **`24`** and **`17`** — both rest on exempting `tasks/done/` and `sprints/done/`, which ⭐ **the owner
  ruled OUT for this half on 2026-08-29**. Under the settled condition that exemption does not exist.

⭐ **`0355` was scoped against `24`. Its actual red set is 0** — six instances matched, all six named
exempt with their reasons in §6.2. See §8 E2.

## 7. Named blind spots — each with its measured cost

Recorded the way `0176` recorded its own accepted incompleteness. **None of these is hidden, and none
is presented as solved.**

**1. Blockquote lines are skipped — measured cost: 8 instances across 6 files** (link half, `QUOTES=0`
reads 8 across 6 versus the settled 0). ⭐ **All 8 were inspected by hand, re-verified 2026-08-30 under
the corrected fence masker — the same 8, in the same 6 files — and all 8 are quotation or proposed text,
none genuine rot:**

| Hidden instance | What it is |
|---|---|
| `0170` brief, line 210 — `adr-033-…md` | A verbatim quotation of an ADR header's `**Amended by:**` entry; the relative depth is correct from the ADR's own directory |
| `0281` brief, line 46 — `adr-009-…md` | Same class — a quoted ADR status block |
| `0299` brief, lines 71, 76, 83 — `sprint-5.md`, `sprint-4.md`, `sprint-3.md` | Verbatim quotations of paragraphs from archived sprint plans |
| `0018` (done) brief, line 47 — `ai-agents/knowledge-base/architecture.md` | Quoted `claude/scaffold/CLAUDE.md` template text; resolves **in the consuming project** |
| `0181` (done) plan, line 18 — `../../../…/adr-035-…md` | **Proposed text** for a skill file; the depth is correct at the target |
| `0223` (done) plan, line 148 — `../../../…/adr-038-…md` | Same class — proposed cell text |

⚠️ **This corrects the plan**, which estimated 11 instances "mixed quotation and genuine rot" from a
different matcher. Build-time inspection found **8, all quotation.** ⛔ That does **not** make the
blind spot safe — it means today's sample is clean. A future genuine rot inside a blockquote will not
be caught, and the convention is carried from `0176` decision 2 for correctness of meaning, not because
nothing hides behind it.

**2. Anchor existence is never checked** — `path#fragment` resolves the file part only. A link to a
heading that no longer exists in a file that does exist passes. **Named as a future extension, cost
unmeasured**, and deliberately not folded in.

**3. Reference-style link definitions (`[a]: url`) are out of scope.** Cost measured as 0 today; none
found that would change the figure. Not a claim that none will appear.

**4. Multi-line inline code spans — masker sensitivity, cost: 3 instances one way, 1 the other.**
⛔ **CORRECTED 2026-08-30. The earlier claim here — that the line-level masker "reports more, never
fewer" — is FALSE, and it was false for a reason unrelated to the fence bug.** The two maskers are **not
nested**; each reports something the other hides. Measured with `NAMED_EXEMPT` emptied so the comparison
is visible:

| | Line-level (settled) | Document-level |
|---|---|---|
| Broken reported | **6 across 4** | **4 across 3** |
| Reported only by this masker | **3** — ADR-040's illustrative row, `0268`'s two fixture rows | **1** — `0020`'s closed review ledger, a `[Sprint 10](../sprint-10.md)` marker |

⭐ **The settled condition is still the LINE-LEVEL masker, but on a corrected reason.** The
document-level masker's sole unique hit is a **false positive it creates**: the target sits inside a
backtick span that opens and closes on one line, and the document-level pairing mis-aligns on an earlier
unpaired backtick and fails to mask it. Line-level pairs it correctly. So the choice is *accuracy on
this repo's actual backtick usage*, **not** "never fewer" — that claim does not survive measurement, and
`0354` must not transcribe it. The delta is recorded so `0354` does not "fix" the choice into
divergence.

**5. The shorthand extension is still refused, by name.** A bare `sprint-2` + line number, or
`0159/brief` + line number, is not matched by the citation half. `0176`'s accepted incompleteness
stands **unchanged**: the guard does not flag `0013`'s brief's bare shorthand, nor `0160`'s brief in
three places. ⛔ **Anyone reporting on either guard must still say so alongside its pass. Being a gate
on three other Sprint 7 rows does not make it complete.**

**6. Source-file coordinates are caught by neither guard — TWO separate prongs, and only one was
costed before. ⛔ Corrected 2026-08-30 (R3).**

- **Prong A — citing sites outside the scanned set.** `0176`'s three known-stale citations live in
  `test/` and `claude/skills/` and cite `claude/fkit-claude-init.sh`. **Measured cost: 3.** This is the
  figure this item used to state, alone.
- **Prong B — source-file *targets* cited from INSIDE the scanned set.** The target prong admits only a
  coordination document, so every `claude/…:N` or `test/…:N` coordinate written inside a scanned,
  non-exempt file is invisible to the guard. ⭐ **Measured cost: 250 instances across 46 files**, two
  orders of magnitude above the "three" this item previously implied was the whole gap. Largest
  contributors: `ai-agents/sprints/backlog.md` (44), `0232`'s brief (37), `0197`'s brief (13).

  Reproduce by replacing §4.2's `TARGET` with
  `` /(?<![\w./-])(?:claude|test)\/[^\s`)\]]+:\d+/g `` and running the script unchanged.

⚠️ **Two honest qualifications on the 250.** (a) It counts source-file *coordinates*, **not** verified
*stale* coordinates — an unknown fraction are still accurate. (b) The figure is matcher-dependent in
exactly the way §2 C2 describes: review round 1 measured **216 across 42** with a different regex for the
same question. **Both are in the same order of magnitude and both refute "three".**

⛔ **The refusal to widen is unchanged and is not reopened here.** `0176` explicitly refuses to absorb
the source-file target class, and so does this. What changed is only that §7's own discipline — *"each
with its measured cost"* — is now actually met for this entry.

**7. Half B's target class has no right-hand file-name closure and a permissive segment class — named
2026-08-30 (R5), measured cost 0.** A **left** boundary was added this round, so a suffix of a longer
token (`notai-agents/sprints/x.md` + `:9`, or `claude/scaffold/ai-agents/tasks/x/y/brief.md` + `:9`) is no longer a
hit; measured cost of the fix: **0**. What remains unfixed: the folder segments still admit characters a
real task folder never contains, so a malformed coordinate inside prose could match. **Measured cost
today: 0.** Left as-is because tightening further would make the regex `0354` and `0176` must transcribe
materially harder to read for no measured gain.

**8. Half A's link grammar is narrower than the ruled class — named 2026-08-30 (R6), measured cost 0.**
The ruled class is "a markdown inline link". The shipped `LINK` regex does **not** match a link whose
label contains nested brackets, nor a destination containing balanced parentheses. ⭐ **Measured: running
the settled matcher with a widened grammar (one level of nested label brackets, balanced-paren
destinations, parenthesized titles) yields the IDENTICAL red set — 6 across 4 before named exemptions.**
Live cost **0**. *(Review round 1 reported a live cost of 1 here; that did not reproduce — the widened
grammar changes no figure.)* The one respect in which the regex was **wider** than the ruling — it
matched image syntax `![alt](x)`, which the ruling does not name — **was fixed**, at a measured cost of 0.

**9. The named-exemption key suppresses a future rot with the same (file, target) pair — named
2026-08-30, measured cost 0.** §4.1's `NAMED_EXEMPT` is keyed on the citing file and the target, not on a
line number, because a line number is the claim form this document rules unsafe against a living file.
The cost of that choice: if one of those six files later grows a **genuinely** broken link to the same
target, the guard stays silent. Measured cost today: **0**. ⛔ **`0354` must carry this list and this
caveat into the test, not silently drop either.**

⭐ **Two further gaps beside the same key, named 2026-08-30 (R13). The key itself is sound; these sit
next to it.**

- **(a) Nothing detects a STALE key.** An exemption entry is only ever consulted to *suppress*; no code
  path notices one that has stopped applying — because its target was created, or because its citing
  file was renamed or moved. ⚠️ **That is not a hypothetical here: 4 of the 5 keys are
  `ai-agents/tasks/done/` paths, and this repo moves task folders between boards as routine work**, so a
  key can be orphaned by an ordinary close. **Measured 2026-08-30: 0 of 5 keys are stale** — every
  citing file still exists and no target has come back — so the cost today is **0**, but the failure is
  silent when it comes. ⛔ **`0354` should assert that every `NAMED_EXEMPT` key still matches a live
  citing file and a still-missing target, and fail loudly on one that does not.** An exemption nobody
  re-checks is indistinguishable from a suppressed defect.
- **(b) The count is never asserted.** Item 9 tells `0354` to carry the list and the caveat, but never
  to check the arithmetic. ⛔ **A test asserting only `broken.length === 0` passes just as green if the
  exemption list silently swallows a seventh instance.** `0354` must **also** assert
  **`NAMED-EXEMPT === 6`** (six instances from five keys — `0272`'s pair matches twice). That single
  assertion is what turns this blind spot from silent into loud, and it costs one line.

**10. Half B has no elision rule — named 2026-08-30, measured cost 1 (arguably 2).** Half A skips a
target containing `…` or three ASCII dots as prose elision. Half B has **no such rule**, so an elided
coordinate like `ai-agents/tasks/done/0195-…/worklog.md` **counts as a hit**. Two of the 19 residual
instances are of this shape (§6.1). They are genuine citation *claims* against frozen records and belong
in `0237`'s list, so counting them is the defensible reading — but the rule is **unstated**, and a future
implementer could reasonably read it either way. ⛔ **Ruled here as: elided targets COUNT for Half B**,
and named so the divergence from Half A is deliberate and visible rather than an accident of two scripts.

**11. The resolution is host-dependent on two axes — named 2026-08-30 (R7), corrected 2026-08-30 (R12),
measured cost 0.** ⚠️ **This item previously claimed the root-absolute mechanism was FIXED and resolved
"never against the host filesystem". That was overstated, review round 2 (R12) disproved it, and the
claim is withdrawn here rather than quietly amended.** Three mechanisms, two now fixed and one not:
- **Root-absolute targets — REBASED, and now also CONTAINED.** `path.resolve` had let `[x](/etc/hosts)`
  escape to the host filesystem and pass; rebasing onto the repo root with `path.join` was the first
  fix. ⛔ **Rebasing alone did not confine it.** `path.join` normalizes `..`, so
  `path.join(ROOT, '/../../../../../etc/hosts')` still yields `/etc/hosts`, and `fs.existsSync` still
  returned **true** — verified firsthand 2026-08-30. **The escape survived the fix that was described as
  closing it.**
- **Relative targets — the identical hole, and it was named nowhere.** `path.resolve(ROOT, dirname, t)`
  escapes the same way for a target with enough leading `../`, and the earlier text discussed only the
  root-absolute branch. Both branches are now covered by one check.
- ⭐ **Both are FIXED by the containment test added to §4.1 on 2026-08-30** (owner ruling
  *"Name R11, fix R12's one line (Rec)"*): a resolved target counts as satisfied only if it is `ROOT`
  itself or sits under `ROOT + path.sep`. **Measured cost of the fix: 0.** 0 of 3694 resolvable targets
  resolve outside the repo root, and ⛔ **every figure in §6.2 is byte-identical with the check present
  and absent** — both were run on the same tree to isolate it. ⚠️ **`0354` must transcribe the
  containment test, not just the rebasing** — rebasing alone is the thing that looked fixed and was not.
- **Case sensitivity — NOT fixed, and this one reaches CI.** `fs.existsSync` follows the filesystem, and
  macOS's default volume is case-insensitive: `fs.existsSync('CLAUDE.MD')` returns `true` here. ⛔ **A
  wrongly-cased link therefore passes on a developer's Mac and reds on a case-sensitive CI runner.**
  Measured today with a per-segment `readdirSync` comparison over every resolvable target: **0
  mismatches**, so the repo is clean right now. ⭐ **`0354` should adopt the segment-walk check rather
  than trusting `existsSync`** — otherwise it ships a test whose result depends on who runs it.

**12. Every figure here is a snapshot of a live tree.** Drift was observed directly: during planning the
naive link count moved 245 → 246 and a broken ADR-033 link appeared in `ai-agents/sprints/sprint-7.md`
and vanished again, from a concurrent producer worker. **Re-run §4's scripts before acting on any
number in §6.**

**13. The fence masker mis-tracks state in two ways — named 2026-08-30 (R11), measured cost 0.**
⛔ **Named, deliberately NOT fixed** — owner ruling *"Name R11, fix R12's one line (Rec)"*, on the
grounds that §7 item 7 already set the precedent of naming a matcher's rough edge rather than adding
regex complexity to a spec two tasks must transcribe. Two mechanisms, both verified firsthand:
- **An unterminated fence swallows the rest of the file.** The CommonMark close rule adopted for R2 (a
  closing fence carries no info string) is correct, but nothing recovers if no close is ever found.
  Measured on `0266`'s closed `plan.md` (138 lines): a fence opens at line **127** and **masks every
  remaining line to EOF**. Against the pre-R2 rule the mask differs on **55 of 138 lines**. ⚠️ *(Review
  round 2 reported 87 of 138. That figure did not reproduce here; the delta depends on exactly which
  pre-R2 rule is used as the comparison baseline, which is itself §2 C2's artifact problem. Both
  measurements agree the middle of the file is phase-inverted; they disagree on the count.)*
- **Indented fences are invisible.** `^\s{0,3}` cannot see a fence indented 4+ spaces, as one inside a
  list item is. Measured: **15 such fence lines across 6 files** (roughly 7 paired blocks).
⭐ **Measured live cost of both, together: 0** — 0 links and 0 citations sit in any affected region, and
every settled figure is identical with and without. ⛔ **This was not among the twelve blind spots
above until round 2 added it, and an unterminated fence is a silent false-*negative* surface: it hides
findings rather than inventing them.** `0354` and `0176` transcribe this masker as-is, and should know
that is what they are transcribing.

**14. §4.1 and §4.2 carry a byte-identical `maskFencesAndQuotes`, duplicated by hand — named
2026-08-30, measured cost 0 today, and it has ALREADY drifted once.** The 13-line function is copied
verbatim into both scripts, and `0354` and `0176` will copy it again into two separate test files —
**four hand-maintained copies of one rule.** ⚠️ **This is not a speculative risk: R2 found the
CommonMark fence-close bug in *both* copies, because the bug was introduced once and duplicated.** A
future correction applied to one copy and not the other makes the two halves silently disagree about
what a fenced block is, which is ⭐ **exactly the failure mode §2 C2 describes and exactly what this
document exists to prevent.** ⛔ **Deliberately NOT restructured here** — the two scripts are specified
as self-contained and transcribable, and merging them into a shared module would trade a known,
named duplication for a new coupling between two tasks that ship independently. **The mitigation is a
check, not a refactor: whoever changes this function in either half must change it in both, and
`0354`/`0176` should assert their two copies are byte-identical to each other.**

---

## 8. Escalations for the owner

### E1 — DISCHARGED

The `0176` exemption-cost escalation was put to the owner at this task's plan-approval gate and
**ruled on 2026-08-29**: *"Widen to the whole closed folder (Rec)"*. Recorded in full in §3.1 and
folded into §3 Half B, §5 and §6.1. **Measured outcome re-verified at build time: residual 42 across 22
→ 12 across 9, exactly as predicted.** ⭐ **`0237` will not be sprung with 30 edits to closed records** —
and that still holds after the 2026-08-30 target-class widening (§3.2), which added 7 instances, **all
of them in open backlog briefs.**

### E1b — DISCHARGED (review round 1)

Two further questions were put to the owner on **2026-08-30**, on review round 1's findings, and both
were ruled:

- **On R1 — *"Not a reopening — widen it (Rec)"*.** Half B's target class widened to `plan.md`,
  `worklog.md` and `review.md`. Recorded in full in §3.2; folded into §3 Half B, §4.2, §5 row 4b and
  §6.1. **Measured outcome: residual 12 across 9 → 19 across 14, exactly the predicted figure.**
- **On R4 — *"Exempt them by name (Rec)"*.** The surviving link-half instances are named as exempt cases
  with their reasons. Recorded in §4.1's `NAMED_EXEMPT` and §6.2's table. ⚠️ **The set was 5 when the
  question was framed and is 6 once R2's fence bug is fixed; all six are enumerated.**

### E2 — DISCHARGED (2026-08-30)

⭐ **All four affected rows have been dispositioned by the producer, and each was re-verified on disk
on 2026-08-30 before this line was written.** E2 asked for producer re-scoping of the rows this
document's ruling contradicted; that re-scoping has happened.

| Row | Disposition, verified on disk 2026-08-30 |
|---|---|
| **`0355`** | ⛔ **CANCELLED**, on the owner's ruling *"Cancel it (Rec)"*. Its folder now sits at `ai-agents/tasks/cancelled/0355-clean-the-in-scope-broken-link-red-set/` and its `## Status` reads *"⛔ Cancelled (agent-closed — not owner-verified) (2026-08-30)"*, with the reason recorded: red set is 0, all six survivors are named exemptions. **Nothing to clean.** |
| **`0354`** | **RE-SCOPED.** Its brief carries a *"⛔ READ FIRST — THREE OF THIS BRIEF'S PREMISES ARE FALSIFIED (2026-08-30)"* block, a per-section `⚠️ DATED CORRECTION 2026-08-30`, and a `⭐ RE-SCOPED 2026-08-30` section at the foot. The ADR-034 closed-folder exemption is reversed there, on the 2026-08-29 owner ruling. |
| **`0237`** | **RE-SCOPED.** Its brief carries *"⛔ READ FIRST — THE WORK LIST IS NO LONGER THIS BRIEF'S (2026-08-30)"* and a `⭐ RE-SCOPED 2026-08-30 — THE WORK LIST` section. The work list is §6.1's **19 across 14**, independently reproduced there by a spawned producer running §4.2 verbatim. |
| **`0176`** | **RE-SCOPED.** Its brief carries *"⚠️ DATED CORRECTION 2026-08-30 — THIS BRIEF IS FALSIFIED IN SEVEN PLACES"* and a `⭐ RE-SCOPED 2026-08-30` section citing all four owner rulings. |

⚠️ **What discharging E2 does NOT mean.** It does not mean `0354`, `0237` and `0176` are ready to close
— they are re-scoped, not done. It means the **contradiction between this document's ruling and their
briefs has been resolved in their briefs**, which was the whole of what E2 asked for.

⛔ **Two things `0354` must still carry, added by review round 2** — the §4.1 containment check (§7 item
11, not just the rebasing) and an assertion that **`NAMED-EXEMPT === 6`** (§7 item 9b).

<!-- The original E2 text is kept below as the record of what was escalated. -->

#### ⏪ E2 as originally escalated — `0354` and `0355` need producer re-scoping before they run

Authorized by the owner's 2026-08-29 ruling *"Accept — links in scope, citations exempt (Rec)"*, whose
stated cost was: *"contradicts three briefs, so `0354` and `0355` need re-scoping before they run."*

- **`0354`'s brief** instructs exempting `ai-agents/tasks/done/**` on ADR-034's authority. ⛔ **ADR-034
  grants no such exemption (§2 C1), and the owner has ruled closed folders IN scope for this half.**
  The brief's exemption instruction is wrong and must be corrected before it is implemented.
- **`0355`'s red set** was scoped as **24 instances across 11 files**. ⭐ **Its actual red set under the
  settled condition is 0.** Six instances match; **all six are named as exempt cases with their
  reasons** in §4.1's `NAMED_EXEMPT` and dispositioned in §6.2's table, on the owner's 2026-08-30 ruling
  *"Exempt them by name (Rec)"*. ⛔ **`0355` therefore has nothing to clean, and now inherits a written
  disposition rather than a shrug.** The producer should re-scope or cancel it on that basis — that call
  is the producer's, not this document's.
- **`0237`'s work list is now the 19-instance table in §6.1**, not `0176`'s frozen 2026-08-01 figure of
  11 across 8, not the 12 across 9 this document reported on 2026-08-29, and not `0237`'s own 19 across
  15. ⭐ **The instance count coincides with `0237`'s own 19; the file count does not (14 versus 15), so
  treat the match as suggestive, not as proof the two lists are identical.** The 19 rows in §6.1 are the
  authority.

⛔ **Both re-scopings are the producer's to make, not the architect's.** This document does not edit
`0176`'s, `0237`'s, `0354`'s or `0355`'s briefs.

---

## 9. What this document does **not** do

- ⛔ **No test file was written.** That is `0354` (link half) and `0176` (citation half).
- ⛔ **No citation and no link was cleaned.** That is `0237` and `0355`.
- ⛔ **Nothing was written to `ai-agents/wiki-vault/`** (ADR-005).
- ⛔ **`0176`'s and `0237`'s briefs were read, never edited.**
- ⛔ **`ai-agents/sprints/sprint-7.md` was not touched** (concurrent producer worker).
- ⛔ **No task status was changed and no task was closed.** Closes are the producer's act (ADR-033).
