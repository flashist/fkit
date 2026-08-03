# Worklog — 0195, correct ADR-010's `skills_for_role()` source-of-truth claim

**Date:** 2026-08-02
**Role:** fkit-architect, spawned as a bounded worker by `fkit-sprint-ship-loop` (fkit-lead's sprint driver)
**Working tree:** `main`, **no commit made** — the edit is left uncommitted, per the brief.
**Second application of the correction-note form `0143` established.** The form was inherited, not
reinvented.

---

## Owner rulings carried into this task — provenance recorded

All taken via `AskUserQuestion` in the **live `fkit-lead` `/fkit-sprint-ship-loop` driver session on
2026-08-02**, and relayed to this worker in its spawn instruction. A spawned worker has no owner
channel (ADR-021), so these are **relayed** rulings, not rulings this worker obtained.

| # | Question | Owner's ruling | Effect on the deliverable |
|---|---|---|---|
| — | Approve the plan? | **Approved as written.** | `plan.md` is the authorized scope. |
| **OQ-1** | Header `- **Corrections:**` bullet — append a continuation line, or edit the existing line in place? | **(a) APPEND.** | A third physical line was added to the same bullet item. `:8` and its continuations are **byte-identical**. See "The declined pre-authorization" below. |
| **OQ-2** | May Block A **name** §Context lock bullet 2 as still carrying the wrong file name, without annotating it? | **(a) YES.** Naming a site is not annotating it, so the `0196`/`0197` fence holds. | Block A's closing paragraph, *"Named, not repaired here"*. Without it this task would close claiming a completeness it does not have. |
| **OQ-3** | `0197`'s overlapping item | **(a) Keep `0197` separate; the PRODUCER narrows that one item to the line-range half.** | Not this worker's edit. Recorded as follow-up 2 — `0197`'s brief was **not** touched. |
| **OQ-4** | Priority (P173 is append rank, not merit) | **Settled before this worker was spawned: drive `0195` next, leave the rank alone.** No renumbering. | No action. Not raised again. |

### The declined pre-authorization — recorded explicitly

The brief **pre-authorized** one exception to append-only: *"The header `- **Corrections:**` bullet is
the one exception, and it must be justified in the worklog."* The planning worker recommended **not
taking it**, and **the owner declined it** (OQ-1a).

**Consequence:** this task holds `+N / −0` **outright, with no exception clause and nothing to
justify.** The site list in the original line (*"at **§Context** and **§Decision 3**"*) stays literally
on the page and is superseded by the continuation line immediately below it. **Cost, stated plainly:**
a reader who stops mid-item is momentarily misinformed about which sites are annotated. Judged
acceptable because the two lines are contiguous inside one bullet, and it keeps the header under
`0143`'s ratified residual **`R5-header-form`** ("one metadata *item* that may wrap") rather than
carving a new exception out of the load-bearing constraint.

### Earlier owner ruling honored — the frozen ledger

The owner ruled today that a review ledger's recorded paths **stay frozen**; re-pointing them rewrites
evidence. No `review.md` path was re-pointed by this task. (`0192` will codify the rule.)

---

## Re-verification — every asserted fact re-measured firsthand, 2026-08-02

The plan was written by a different worker. Nothing in it was inherited. All of the following were
re-run against the live working tree before any text was written.

**Held, confirmed — every claim the notes make:**

- `skills_for_role() {` is defined at **`claude/skills-for-role.sh`** and nowhere else. Its header line
  1 reads *"the single source of truth for fkit role → skill ownership"*; line 3 records *"Extracted
  from fkit-claude.sh (task 43 / ADR-018)"*.
- **`claude/fkit-claude.sh` contains no definition.** Its four `skills_for_role` mentions are two
  comments, one comment naming the move (*"moved to skills-for-role.sh, task 43"*), and the
  `. "$here/skills-for-role.sh"` source line.
- **Two consumers, both sourcing it:** `claude/fkit-claude.sh` and `claude/skill-ownership-hook.sh`,
  whose own header names itself *"the PreToolUse skill-ownership gate (task 43 / ADR-018)"* and says it
  denies a `Skill` call *"per skills_for_role() — the single source of truth (skills-for-role.sh)"*.
- **No `skills:` frontmatter anywhere.** `grep -c '^skills:'` returns `0` for all **seven**
  `claude/agents/*.md`; `grep -l` exits 1.
- **ADR-012 §Decision 1** quoted verbatim from the source: *"The `skills:` frontmatter is inert and is
  therefore DROPPED, not generated. ADR-010 §5 offered 'generated from it **or** dropped'; that choice
  is now settled as **dropped**."*
- **"The shell grants every role `fkit-team`" still holds** — all seven case arms begin with
  `fkit-team`.
- **The third stale site is real:** ADR-010 §Context lock bullet 2 reads
  *"(`claude/fkit-claude.sh:75-103`, `skills_for_role()` + `build_settings()`)"*.
- **`0143`'s +71 is uncommitted** — `git diff --numstat` on ADR-010 read `71 0` at task start, and the
  session-start "clean" git snapshot was wrong. Handled: see the two-way proof below.

**Nothing in the approved plan was found to be wrong.** Unlike `0143` (whose citation-form rationale
was false) and the two tasks before this one in the run, every measurement in this plan survived
re-checking. Recorded as a positive finding, not assumed.

**⚠️ One deviation from the plan, in size only.** The plan estimated **+26**; the shipped edit is
**+49** (Block A ≈ 30, Block B ≈ 16, header 3). The blocks came out longer than estimated because the
ADR-012 verbatim quote, the two-consumer bullet and the OQ-2 naming paragraph each needed more room
than the estimate allowed. **No content was added beyond the approved scope** — the extra lines are
wrapping and the three elements the plan itself specified. Flagged rather than passed over.

---

## What was written

**One file changed:**
`ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md`

Three additions, in document order:

1. **Header continuation line** (3 lines) — appended inside the existing `- **Corrections:**` item.
   Names **§Decision 5** and §Context's *"One real inconsistency"* passage as the new sites, states
   that the first line's site list is left byte-identical and superseded, and that the same
   append-only rule and legend apply. **No existing header line touched.**
2. **⚠️ Dated correction at §Context** (16 lines), indent **0** — the passage it annotates is plain
   prose, not a `- ` bullet, a placement level `0143` has no precedent for. Records that the
   "One real inconsistency" passage is **spent** (there are no longer two lists), that the *"settled
   here"* promise was **kept**, and that *"the shell grants every role `fkit-team`"* is **still true**.
   **Cross-references Block A rather than restating the file facts** — the shape `0143` used at its
   §Context reversal notice, so there is one place to keep true rather than two.
3. **⚠️ Dated correction at §Decision 5** (30 lines), indent **3 spaces**, matching `0143`'s §Decision 3
   note. The binding statement: `skills_for_role()` lives in `claude/skills-for-role.sh`;
   `claude/fkit-claude.sh` defines nothing and only sources it; **two** consumers now, the second being
   ADR-018's `PreToolUse` gate; the `skills:` frontmatter was **DROPPED, not generated**, with ADR-012
   §Decision 1 quoted; **why the marker is ⚠️ and not ⛔**; the "left byte-identical" clause; and — per
   OQ-2 — §Context lock bullet 2 **named** as a third occurrence of the same stale file name, reserved
   to `0196`/`0197`.

**Form inherited from `0143` and followed, not re-litigated:** below-the-claim placement
(**`R1-placement`**), file + quoted phrase with **no `:NNN`** (**`Citation form`**), the two-marker
⚠️/⛔ vocabulary with **no third marker**, the "left byte-identical" clause, present tense with a
verification date.

### Why ⚠️ carries an extra sentence the legend does not cover

The legend glosses ⚠️ as *"a fact that drifted"*, which implies unmanaged change. That undersells what
happened here: the frontmatter question was settled by taking **the second of the two branches
§Decision 5 itself offered**. The decision was not merely untouched — it was **honored**, and its
invariant (*one* source of truth) is in force. Block A says so in its own words. **No third marker was
introduced** (out of scope, and correctly so).

---

## Additions-only — proven TWO ways, per the spawn instruction

`git diff` against `HEAD` alone **cannot** isolate this task's deletions, because `0143`'s +71 to the
same file is uncommitted. Both proofs were required and both pass.

**Proof 1 — against the pre-edit snapshot** (`adr-010.PRE-0195.md`, taken before the first edit,
`shasum 0ff1a57e…`, unchanged after the run):

```
$ diff <snapshot> <file> | grep -c '^>'
49
$ diff <snapshot> <file> | grep '^<'
(no output)
$ git diff --no-index --numstat <snapshot> <file>
49      0
```

**49 insertions, 0 deletions, zero modified lines — this task's own figure.**

**Proof 2 — against `HEAD`:**

```
$ git diff --numstat -- …/adr-010-…md
120     0
$ git diff -U0 -- …/adr-010-…md | grep '^-[^-]'
(no output)
$ git diff --check -- …/adr-010-…md
(clean)
```

**120 = `0143`'s uncommitted 71 + this task's 49. Expected, and stated rather than glossed.**
**Deletions read `0`.** No pre-existing ADR-010 line was edited, reworded, scoped, re-dated or
deleted, including §Decision 5's sentence, §Context's passage and the header bullet.

---

## Brief's verification steps — walked

| # | Step | Result |
|---|---|---|
| 1 | Deletions read `0`; `git diff -U0 … \| grep '^-[^-]'` empty — **by diff, not by eye** | ✅ both proofs above. **No exception was taken** — the header pre-authorization was declined by the owner |
| 2 | §Decision 5's sentence and §Context's passage byte-identical to pre-task text | ✅ zero `<` lines against the snapshot |
| 3 | Dated ⚠️ note **below** §Decision 5's claim; names `claude/skills-for-role.sh`; states the frontmatter was dropped; cites ADR-012; **states why ⚠️ and not ⛔** | ✅ Block A, all five |
| 4 | `grep -c '^skills:' claude/agents/*.md` = 0 for every file; `claude/skills-for-role.sh` exists — re-checked at writing time and dated | ✅ see "Re-verification", 2026-08-02, all seven agents |
| 5 | **The contradiction is gone** — §Decision 5 read alone no longer tells a reader the function lives in `claude/fkit-claude.sh` | ✅ Block A sits directly below the claim. **Partial-completeness flag, not hidden:** the *page* still carries the stale file name once more, at §Context lock bullet 2 — **named** in Block A per OQ-2, and reserved to `0196`/`0197` |
| 6 | `- **Status:** accepted` unchanged | ✅ verified after the edit; Block A states it too |
| 7 | Header bullet lists every annotated site accurately, **or** the worklog records why not | ✅ extended by append; all four sites now named across the item's two site lists |
| 8 | No file under `ai-agents/wiki-vault/` modified | ✅ `git status --porcelain ai-agents/wiki-vault/` empty |

**Tests:** `npm test` — **560 tests, 560 pass, 0 fail**; mutation hard gate **PASSED** (*"real +
unmutated copy green; each mutation reds its NAMED assertion"*). **No test reads this ADR, so green is
a regression check, not evidence the note is correct** — the two diff proofs and the live-code
re-verification above are that evidence.

---

## Round 2 — review processing, 2026-08-02

Reviewer's round-1 ledger (`review.md`) processed by a second bounded worker (fkit-architect, spawned
by `fkit-sprint-ship-loop`). Every finding **re-verified first-hand against live code** before a
verdict was written; nothing was inherited from the reviewer's measurements.

**⚠️ Procedural flag, stated rather than buried:** this worker could **not** invoke
`/fkit-process-stateful-review` — the `PreToolUse` skill-ownership hook denied it (*"role 'architect'
does not own skill 'fkit-process-stateful-review'"*), which is the ADR-018 gate working as designed.
The **method** was applied by hand from the spawn instruction (verify → classify defect vs frontier →
write the Coder response → record fixes), and the ledger's coder-owned section was filled in full. The
skill's own procedure text was never read, so any step it carries beyond what the spawn instruction
described was not executed. Worth a producer look: a coder-side ledger step routed to the architect
role will hit this every time.

### Decision log — every autonomously-applied fix and obvious-winner call

Authorization basis: **the owner's per-finding dispositions**, taken via `AskUserQuestion` in the live
lead session 2026-08-02 and relayed in the spawn instruction. These were **not** ADR-032 A2 /
ADR-019 discretionary calls — each fix below was individually ordered by the owner, so the worker's
discretion was limited to wording. Recorded per finding:

| Finding | Owner disposition | What changed | Why it qualified |
|---|---|---|---|
| **R1** (medium) | **REPAIR NOW**, round-2 append | Block A bullet 1: *"`claude/fkit-claude.sh` defines nothing — it only sources it"* → *"defines no `skills_for_role()` of its own — it only sources it"*, plus a parenthetical noting it does define other functions (`build_settings()` named) and that the claim is scoped to `skills_for_role()` alone. **+1 line.** | Owner-ordered. The unscoped claim was **verified false first-hand** this round: `claude/fkit-claude.sh` defines **eight** functions — `_fkit_verfield`, `_fkit_is_source_checkout`, `_fkit_remote_sha`, `_fkit_remote_version`, `_fkit_reinstall`, `build_settings`, `set_tab_title`, `codex_preflight` — none of them `skills_for_role`. The reviewer's list matched name-for-name. |
| **R2** (low) | **REPAIR NOW**, same round | Block B closer: *"**Still true:** the shell grants **every** role `fkit-team`"* → *"**Still true in substance:** **every** role owns `fkit-team`"*, followed by the live mechanism — since ADR-018 the launcher grants nothing, `build_settings()` emits only hooks, ownership is a `PreToolUse` **deny** hook reading `skills_for_role()` at call time. ADR-018 linked. **+3 lines.** | Owner-ordered, with the owner's reasoning recorded: this is **newly written** text, so `0196`'s `skillOverrides` fence — scoped to **pre-existing** sites — will never reach it. Unfixed here it becomes permanent. Verified first-hand: `build_settings()`'s emitted JSON carries `{"hooks":{…}}` only, no `skillOverrides` key, and its own comment records the retirement (*"Retired here (task 43 / ADR-018 …): the old `skillOverrides` 'off' list"*). |
| **R3** (low) | **REWORD THE RESIDUAL ONLY** | **No ADR change.** `R-third-site-remains` reworded to name **both** un-annotated sites — §Context lock bullet 2 **and** §Related's `Code:` line — and written into the ledger's *Accepted residuals*. | Owner-ordered. Not an ADR defect (the `Code:` line names no function); the defect was the residual's **singular** wording becoming the authority on "one site left" in a run where `0143` missed one site and `0158` missed six. |
| **R4** (low) | **ACCEPT AS-IS** | **Nothing.** The suggested *"(quote marks and bold normalized)"* parenthetical was **not** added. | Owner-ordered, and independently re-verified: ADR-012 §Decision 1's words are **exact**, only inner quote marks and an opening bold differ, both forced by nesting inside `*"…"*`. **Codex's defect grading is rejected on evidence**; the reviewer's downgrade stands. |

**Judgment calls the worker made on its own, inside the owner's orders — two, both recorded:**

1. **The number "eight" was deliberately kept OUT of the ADR.** The owner required the count be
   *verified*, not published. A function count drifts on the next function added, and ADR-010 is a
   mutable file three serial tasks are appending to (the same reason `Citation form` bans `:NNN`). The
   scoping is carried by wording; the count and its eight names live in the ledger's evidence section.
2. **R2's replacement text names ADR-018 and `skillOverrides`.** Checked against `Q4-scope-fence`
   (`0143`) before writing: that fence covers the **pre-existing** `skillOverrides` parenthetical, and
   the round-1 ledger states explicitly that R2 is **not** covered by it. `0196`'s scope is untouched
   — no pre-existing site was annotated.

**No fix was applied that the owner did not order. No finding was silently dropped.** All four carry an
explicit verdict in the ledger, including R4 (no change) and the rejected Codex grading.

### The `−0` proof, re-established after the round-2 edits

Both edits landed **inside lines this task itself added** (Blocks A and B), so no pre-existing ADR-010
line was modified and `NEEDS-DECISION` was not reached.

- **Snapshot reachable and unchanged** — `adr-010.PRE-0195.md`, `shasum
  0ff1a57eed9c31b8532fdb92a706706f725b12bd`, matching the round-1 record. **No baseline had to be
  reconstructed.**
- **Proof 1, snapshot → current:** `git diff --no-index --numstat` = **`53  0`**; `diff | grep '^<'`
  empty. (Round 1 was `49 0`; +4 = R1's 1 line + R2's 3.)
- **Proof 2, `HEAD` → current:** `git diff --numstat` = **`124  0`**; `git diff -U0 | grep '^-[^-]'`
  empty; `git diff --check` clean. **124 = `0143`'s uncommitted 71 + this task's 53.**
- `- **Status:** accepted` unchanged. Working tree's other modified paths (`sprint-2.md`, `0170`/`0171`
  briefs) carry mtimes of `18:38` and `15:50` — **hours before** this round's `20:39` ADR edit. Not
  this worker's.

**Tests, re-run after the round-2 edits:** `npm test` — **560 pass, 0 fail, 0 skipped**; mutation hard
gate **PASSED** (*"real + unmutated copy green; each mutation reds its NAMED assertion"*), all 13
mutations red as named. Same figure as round 1. **No test reads this ADR**, so green is a regression
check on the rest of the repo, not evidence the notes are correct — the two diff proofs and the
live-code re-verification are that evidence.

## Round 3 — procedural conformance re-run, 2026-08-02 (`@fkit-coder`)

Owner ruling (`AskUserQuestion`, live lead session): round 2's process-review was re-run as
`@fkit-coder` because the round-2 worker (`fkit-architect`) was denied the coder-owned skill and applied
the method by hand without ever reading its procedure text. **The hook permitted `@fkit-coder` to invoke
`/fkit-process-stateful-review`**; the procedure was read in full and compared step-by-step against the
round-2 ledger. Full gap analysis is in `review.md`'s *Coder response*, §"Round 3".

**Decision log — fixes applied unattended, and obvious-winner calls (ADR-019 `:96` / ADR-032 A4):**

| # | What it answers | What changed | Why it qualified |
|---|---|---|---|
| 1 | Skill Step 0/2/3/3.5 — steps the hand-application never ran | Ran them for real (ADR skim over all 37 decisions; suppressed-as-settled list; independent severity re-derivation; the missing regression-check arms) and **appended** the results as §"Round 3" in the ledger's coder-owned section | Mechanical and in-plan: **docs-only**, confined to the section this role owns, and precisely the "complete anything missing" the spawn ordered. **Zero source and zero ADR lines touched** — re-proven `53 0` / `124 0`. Every check came back clean; no finding's disposition moved. |
| 2 | Skill Step 4 — Status cells use none of the six prescribed values | **Mapped** each cell to the prescribed vocabulary in the round-3 section rather than **rewriting** the round-2 rows | **Obvious winner, within plan intent.** Both routes satisfy the schema; appending preserves the record the owner actually saw and matches the additions-only discipline this whole task is built on. Rewriting cells would destroy that record for no gain. |

**No obvious-winner call was made on anything substantive**, and **no finding was re-litigated** — R1–R4
stand exactly as the owner dispositioned them.

**Stopped rather than decided — one item, since RULED.** The responder returned `NEEDS-DECISION` on the
ledger header rather than flipping it: Skill Step 6's literal condition was not met (R1/R2 were *fixed*,
not closeout/disproven/accepted), while **ADR-034**'s work-product bar — the ADR that explicitly rebinds
this skill's close line, and the one round 2 never loaded — said it **was**. That choice decided whether
another reviewer round ran before the close, so it was a scope call and was **surfaced, not taken**.

### Ledger close — an owner ruling RELAYED to this worker, not an autonomous call

| Item | Record |
|---|---|
| **Decision** | `0195`'s `review.md` header set **`Status: in-review` → `Status: closed-out`**, with **no round-3 reviewer pass**. |
| **Provenance** | **The owner**, via `AskUserQuestion` in the **live lead session, 2026-08-02**, relayed to this worker by `fkit-sprint-ship-loop`. |
| **Basis accepted by the owner** | The **ADR-034** work-product bar is **met**: R1 and R2 were the only work-product defects, both fixed and confirmed in the shipped ADR text; R3 is own-record with a full residual; R4 is an accepted frontier. |
| **Cost put to the owner and accepted** | The round-2 fixes (**+4 lines**) never receive independent reviewer eyes. Per ADR-034 the ledger is closed to a **work-product** standard, **not a record-perfect one**. |
| **Autonomy classification** | **NOT** an ADR-019 / ADR-032 A2 discretionary call, and **not** an obvious-winner call. The worker **declined** to decide it and returned `NEEDS-DECISION`; the owner decided. Logged here because the *execution* was unattended, not the decision. |
| **Scope of the execution** | Ledger header + the round-3 section's open-question paragraph resolved in place. **No ADR line, no reviewer-section row, no sprint board, no task status, no commit.** The close itself remains **the producer's**. |

**Process finding worth ranking (also left in the ledger for `0200`):** ADR-034 reached this review
*only* through **Step 0's ADR skim** — the step round 2 skipped — and it turned out to decide the close
bar. That is the exact re-derivation risk **ADR-034's own §Binds predicted in writing**: no skill was
edited to carry the pointer, so *"this ADR is the only durable home for the bar and each role must reach
it here."* A responder that skips Step 0 cannot reach it. The follow-up is landing those three pointers
(`fkit-process-stateful-review` Step 6, `fkit-stateful-review`'s *"when warranted"*,
`fkit-task-ship-loop`'s termination condition).

---

## Residuals

- **`R-third-site-remains`** — **REWORDED in round 2 per the owner's R3 disposition; the round-1
  wording below was wrong by one site.** ADR-010 still points at `claude/fkit-claude.sh` for
  `skills_for_role()` at **two** un-annotated sites, not one: (a) **§Context lock bullet 2**, which
  names the function and so states the wrong home outright — **named** in Block A, **not annotated**,
  per OQ-2; and (b) **§Related's `Code:` line**, carrying `claude/fkit-claude.sh:75-103`, the
  function's former address, naming no function. Both are fenced to `0196`/`0197`, and `0197`'s brief
  already scopes (b) — **no work is lost**. **Re-raise if** `0196` and `0197` both close with either
  site still pointing there.
- **`R-header-two-site-lists`** — the `- **Corrections:**` item now carries two site lists, the first
  superseded by the second. Accurate as a whole, momentarily misleading if read halfway. Accepted
  under OQ-1a; the alternative (editing line 1) was pre-authorized by the brief and **declined by the
  owner**.
- **`R-size-overrun`** — shipped +49 against a plan estimate of +26. Scope unchanged; wrapping only.
- **Inherited and NOT re-litigated:** `R1-placement` (below-the-claim), `Citation form` (no `:NNN`),
  `R5-header-form` (one metadata item that may wrap), `Q4-scope-fence`. All four bind this task and
  were followed.
- **`R2-pointer-drift` deepens, but this task breaks nothing accurate.** The 12 displaced
  `adr-010:NNN` pointers in ADR-012 / ADR-018 / ADR-031 span 6 distinct coordinates, **all already
  stale from `0143`'s +71**. Their repair (`0171`) must run **after** `0195`/`0196`/`0197` land or it
  re-measures against a baseline that then moves.

## Follow-ups

**Restated in full after round 2** — items 1–5 carried from round 1, all still open and none
superseded; item 4's *"five notes"* count **re-checked this round and confirmed** (three from `0143` at
§Context ×2 and §Decision 3, two from `0195` at §Context and §Decision 5). Item 0 is new.

0. **Producer — a coder-side ledger step was routed to the architect role and the hook denied the
   skill.** This round's worker could not invoke `/fkit-process-stateful-review` (*"role 'architect'
   does not own skill 'fkit-process-stateful-review'"*). The method was applied by hand from the spawn
   instruction and the ledger is complete, but the skill's own procedure text was never read. Either
   route the review-processing step to `fkit-coder`, or record that the architect runs it by hand.

1. **`0196` and `0197` must run serially after this, in that order** — all three append to one file;
   concurrent edits collide, and each one's `−0` proof needs the prior baseline. Each must rebase on
   what is already there, re-run the proof both ways against its own pre-edit snapshot, and **not**
   restate the ⚠️/⛔ legend.
2. **Producer — narrow one `0197` item.** Its brief scopes *"§Context, the two-lists passage —
   `claude/fkit-claude.sh:75-86`"*. After Blocks A and B that pointer's **file** half is corrected and
   only its **line-range** half remains open. Per OQ-3 the tasks stay separate and the **producer**
   makes this edit. **This worker did not touch `0197`'s brief.**
3. **`0198`** (teach `/fkit-record-decision` the form) now has a **second** application to generalize
   from, including the indent-0 placement for prose (no `0143` precedent) and the cross-reference
   pattern that keeps one site binding.
4. **`0199`** (vault resync) runs **last**, after all three appends. The vault page must then reflect
   **five** KB-side notes plus a header item with two site lists.
5. **`0171`** — the 12 sibling pointers, after `0195`/`0196`/`0197`.

## What was NOT touched

`ai-agents/wiki-vault/` (including ADR-010's vault page — `fkit-wiki`'s exclusive surface) ·
`0196` / `0197` / `0198` / `0171` / `0199` briefs · the sprint board · this task's status or folder
location (the close is a producer's, per ADR-033) · ADR-012 · ADR-018 · ADR-031 ·
`/fkit-record-decision` · any source file · any test · any `review.md` path. **No commit, no push.**
