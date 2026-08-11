# Correct the five remaining prose sites that state the `sprint-*.md` glob as the mechanism

## ID
0267

## Sprint
Sprint 5

## Priority
Sprint 5 P7

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling, 2026-08-10** — ADR-040's and ADR-041's implementation follow-ons are filed and ranked
into Sprint 5. See `0264`'s Context for the scope hole and Sprint 5's dated addendum.

### The sites — all five re-verified on disk 2026-08-10 by the filing producer

ADR-041 §6 enumerates **seven** prose sites that state the glob as the mechanism. Sites **1** and **2**
(`fkit-status/SKILL.md:26`, `:48`) are
[`0266`](../0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/brief.md).
**This brief carries the other five.** Each was read on disk at filing — not carried on the ADR's word:

| § 6 # | Site | Verified text (2026-08-10) | What breaks |
|---|---|---|---|
| 3 | `claude/skills/fkit-task-brief/SKILL.md:308-312` | the fenced `backlog.md` skeleton — *"the filename is deliberately `backlog.md`, NOT `sprint-backlog.md`, because /fkit-status globs `sprint-*.md` to find the active sprint"* | **it is a GENERATOR** — see the warning below |
| 4 | `claude/skills/fkit-task-brief/SKILL.md:334-337` | *"**⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.** `/fkit-status` finds the active sprint by globbing `sprint-*.md`; the backlog is excluded from the default status run purely because its filename does not match."* | **the rule survives** (one board, one file), its stated reason does not |
| 5 | `claude/skills/fkit-sprint-ship-loop/SKILL.md:47` | *"**empty = the active sprint** (the `sprint-*.md` the project is working)"* | names the glob as the selector |
| 6 | `claude/skills/fkit-sprint-ship-loop/SKILL.md:93` | *"Read the sprint plan (`$ARGUMENTS`, or the active `sprint-*.md`)"* | names the glob as the selector |
| 7 | `ai-agents/sprints/backlog.md:7-11` | *"`/fkit-status` resolves the active sprint by globbing `sprint-*.md` … This file does not match that glob, and that is the whole mechanism by which the default status run ignores the backlog."* | **our own live board** — see the warning below |

⚠️ **Line numbers are dated anchors of convenience.** All five verified 2026-08-10; the durable
anchors are the quoted text.

### ⚠️ Two of these five are not ordinary doc edits — read this before planning

**Site 3 is a GENERATOR, and fixing it does not fix its output.** `fkit-task-brief` step 8 emits that
skeleton into a **new `backlog.md`** the first time a project files an unsprinted brief. Every
downstream repo that has ever filed one **already holds a copy of the old prose as project content**,
and `fkit-claude-init.sh`'s launch convergence refreshes `.claude/` agents and skills — **not** a
project's `ai-agents/sprints/backlog.md`. **Those copies will not be repaired by anything this task
does.** State that in the close; do not imply the fix propagates.

**✅ RULED 2026-08-10 — DOCUMENT AND MOVE ON. The paragraph above is left byte-identical; the
disposition it left open is now decided.** Owner ruling, given via `AskUserQuestion` in a live
session — a selection from the question's option list, **the option label is the verbatim text**:
**"Document and move on (Recommended)"**. Option description as presented to the owner, verbatim:

> *0267's coder reports the exposure; we state it in RELEASING.md or the ADR and leave downstream
> copies alone. Rationale: it's stale prose in a task-brief header, not executable behaviour — wrong
> documentation, not a broken tool. Cheapest, and honest as long as it's written down somewhere a
> downstream owner will find.*

**What it settles.** ⛔ **No downstream repair is attempted** — not by this task, and no follow-up is
to be filed to attempt one. The coder **reports** the exposure and leaves every downstream copy alone.

**⚠️ The ruling's honesty condition is the binding half, not the "move on" half.** It holds *"as long
as it's written down somewhere a downstream owner will find"*. A close that only names the exposure in
its own close report has **not** met the ruling — a downstream owner never reads a close report. The
note must land in **project documentation**.

**⚠️ WHERE it lands is a decision this brief deliberately does NOT make for you.** The ruling names
*"RELEASING.md or the ADR"*. **`RELEASING.md` does not exist yet** — verified on disk 2026-08-10, this
repo has no `RELEASING.md`;
[`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md) is the
task that creates it, and it is on Sprint 5 at `P7`. So the coder must **either** land the note
somewhere that **exists today** (ADR-041 is the obvious candidate, but that is the coder's call, not a
prescription) **or** flag the dependency on `0252` and say so explicitly in the close.
⛔ **No `Depends on: 0252` edge is declared here, deliberately** — a false edge would render this row
blocked and neither task gates the other
([`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md)).
**Escalate if it is unclear; do not guess and do not silently pick the option that is cheapest to
write.**

**✅ THE LANDING SITE IS NOW RULED — 2026-08-10, second ruling. The two paragraphs above are left
byte-identical; the choice they deliberately left open is decided, and it is `README.md`.** Owner
ruling, given via `AskUserQuestion` in a live session — a selection from the question's option list,
**the option label is the verbatim text**: **"README.md — exists today, right audience (Rec)"**.
Option description as presented to the owner, verbatim:

> *Land it in README.md's install/upgrade guidance. The ruling's binding half is 'somewhere a
> downstream owner will find' — and RELEASING.md is a MAINTAINER doc, so it satisfies the letter of
> your ruling while failing its purpose. A downstream owner upgrading fkit reads the README, not our
> release process. Unblocks 0267 at plan time with no sequencing dependency.*

**⛔ THIS IS NOT A REVERSAL — read the distinction before planning.** The earlier ruling of the same
day (verbatim **"Document and move on (Recommended)"**, recorded above) had **two** halves, and only
one moved:

| Half of the earlier ruling | Status now |
|---|---|
| **Substance** — the coder **reports** the downstream exposure and attempts **no** downstream repair; no follow-up is filed to attempt one | ⛔ **UNCHANGED and still binding.** Nothing here softens it. |
| **Honesty condition** — the note must land *"somewhere a downstream owner will find"*, in project documentation, not merely in a close report | ⛔ **UNCHANGED and still binding.** This ruling is what **satisfies** it, not what relaxes it. |
| **Landing site** — *"RELEASING.md or the ADR"* | ✅ **SUPERSEDED.** The site is **`README.md`**, in its install/upgrade guidance (its `**Staying current:**` block, `README.md:31-33`, verified on disk 2026-08-10). |

**Why the site moved, stated rather than implied.** Both sites the earlier ruling named were
unavailable: **`RELEASING.md` does not exist** — it is
[`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md)'s
deliverable, currently Sprint 5 `P7` — and **ADR-041 is accepted and final**. The owner's stated
reason goes further than availability: `RELEASING.md` is a **maintainer** doc, so landing the note
there would satisfy the letter of the honesty condition while failing its purpose. A downstream owner
upgrading fkit reads the README.

⚠️ **CORRECTED 2026-08-11 — both rank citations of `0252` above are left byte-identical and are now
stale.** They read *"on Sprint 5 at `P7`"* (line 74) and *"currently Sprint 5 `P7`"* (line 107); `0252`
now sits at **`Sprint 5 P13`**, moved by the owner-ruled re-rank of 2026-08-11. ✅ **Nothing this brief
asks of the coder changes.** `0252`'s rank was cited only to show `RELEASING.md` did not exist yet — it
still does not, and the landing site is **`README.md`** by the ruling recorded above, which carries **no
sequencing dependency on `0252`** and never did. ⚠️ **This row is now ranked ABOVE `0252` (`P7` vs `P13`),
so a rank-ordered pass reaches it first** — which the README ruling already made safe. Rank citations are
mutable; cite `0252` by its ID.

**What the coder must now do — this replaces the "either / or" the paragraph above left open:**

- ✅ **Land the downstream-exposure note in `README.md`**, in its install/upgrade guidance. ⛔ **Do not
  create `RELEASING.md`** — that is `0252`'s file, not this task's.
- ⛔ **Do NOT escalate the landing-site question.** It is settled. The step-8 note below still says
  *"escalate; do not pick unilaterally"* and is left byte-identical — **it is discharged by this
  ruling**, and the coder picking `README.md` is executing an owner ruling, not picking unilaterally.
- ⛔ **No `Depends on: 0252` edge, and none is to be added** — this is the whole point of the ruling.
  `README.md` exists today, so this task is plannable and shippable with **no sequencing dependency**
  on `0252` and no ordering claim against it in either direction.
- ⚠️ The note is **prose about a documentation exposure**. It changes no behavior, and the
  "⛔ Do not change any skill's behavior" constraint below is untouched.

**Site 7 is our own live board, not scaffold.** `ai-agents/sprints/backlog.md` is real project content
in this repo, generated once and edited since. It gets the same correction by hand, for the same
reason site 3's output will not.

⚠️ **The two are separate acts on separate files. Doing one is not doing the other** — ADR-041 §6 flags
exactly this (*"Fix **both** the generator (site 3) and this copy"*).

### ⚠️ The rule at site 4 survives — do not delete it

*"Never file against `backlog.md` by writing a `sprint-backlog.md`"* stays true after ADR-041, for a
**different** reason: one board, one file. It is no longer true that a `sprint-backlog.md` would become
the reported active sprint — under ADR-041 §2 it resolves to `Backlog` and is **never eligible**.
**Rewrite the reason; keep the rule.** Same shape as site 2's treatment in `0266`.

## What to build

Prose corrections to five files (four paths), each replacing *"the glob is the mechanism"* with *"the
resolved identity is the mechanism"*, per ADR-041 §§1–3.

1. **Site 3** — the generated `backlog.md` header skeleton in `fkit-task-brief/SKILL.md`. The new prose
   must say why the filename `backlog.md` is kept (its href is written into every
   `➡️ Moved to [Backlog](backlog.md)` marker — ADR-041 §3) **without** claiming the filename is what
   excludes it.
2. **Site 4** — same file, the *"Never file against `backlog.md` …"* warning. Rule kept, reason
   rewritten.
3. **Sites 5 and 6** — `fkit-sprint-ship-loop/SKILL.md`. Both say *"the active `sprint-*.md`"*; both
   become *"the active sprint"* as `fkit-status` now resolves it. ⚠️ **Do not restate the selection
   rule here** — point at it. Two grammars for one question is the defect ADR-041 §5 forbids.
4. **Site 7** — `ai-agents/sprints/backlog.md`'s own header warning. Same correction, by hand, on this
   repo's live board.
5. **Search for an eighth site.** ADR-041 §6 claims the list is complete. Grep the repo for
   `sprint-*.md` / *"globbing"* claims and **report anything §6 missed** — an eighth site is a finding
   about the ADR, not a silent extra edit. (`dashboard.sh:95`'s comment is **not** yours — it is part
   of `0264`'s patch, by ADR-041 §6's own closing line.)

### Constraints

- ⛔ **Do not edit `claude/skills/fkit-status/SKILL.md`** (sites 1–2 are `0266`'s) or
  `claude/skills/fkit-status/dashboard.sh` (`0264`/`0265`).
- ⛔ **Do not rename `ai-agents/sprints/backlog.md`** — ADR-041 §3 is explicit, and its href is written
  into every `➡️ Moved to [Backlog](backlog.md)` marker in the repo
  (`ai-agents/knowledge-base/conventions/task-status-vocabulary.md:22`, verified 2026-08-10).
- ⛔ **Do not delete site 4's rule** or site 2's surviving conclusion.
- ⛔ **Do not change any skill's behavior** — this is a prose-truth repair, not a redesign. No new step,
  no new gate, no reordering of an existing procedure.
- ⛔ **Do not touch `claude/structure-spec.md`.** ADR-041 §4 rules it out by name as the enforcement
  site (`claude/structure-spec.md:174-177`), and there is **no filename rule left to enforce**.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit.

## Verification steps

1. **`0266` is closed** before this starts — otherwise these five sites would be corrected to describe
   a mechanism that does not exist yet, which is false in the opposite direction. State its close date.
2. **Re-verify all five line references on disk before editing** and report any that moved. They are
   dated anchors; `0266` will have changed neither file, but time will have passed.
3. **Grep proves the sweep.** `grep -rn 'sprint-\*\.md' claude/ ai-agents/sprints/` returns **nothing**
   outside `ai-agents/tasks/`, `ai-agents/knowledge-base/decisions/`, and `ai-agents/sprints/done/`
   (task briefs, ADRs and archived boards are historical records and are **not** corrected here).
   Paste the full result and account for every remaining hit.
4. **Site 3 and site 7 are both edited**, and the close report states them as two acts. A close that
   names only one has not done the task.
5. **The downstream-copy caveat is stated in the close** — every project that has ever filed an
   unsprinted brief holds an uncorrected copy of site 3's output, and launch convergence will not
   repair it. Say whether that warrants its own follow-up; **do not file it yourself**, report it.
   **✅ AMENDED 2026-08-10 — this step is left byte-identical and its open half is now RULED.** Owner
   ruling, verbatim option label **"Document and move on (Recommended)"** (recorded in full in
   `## Context`). It does **not** warrant a follow-up — ⛔ **no downstream repair, and none is to be
   filed.** What this step now requires instead: the close states the exposure **and names the file it
   was written into**, in project documentation a downstream owner would actually read. ⚠️ The close
   must **also** state which branch of the `RELEASING.md`-does-not-exist-yet choice was taken — a note
   landed somewhere that exists today, or the dependency on `0252` flagged. **A close that states the
   caveat but names no landing site does not pass this step.**
   **✅ AMENDED AGAIN 2026-08-10 — the amendment above is left byte-identical and its remaining open
   half is now RULED.** Owner ruling, verbatim option label **"README.md — exists today, right
   audience (Rec)"** (recorded in full in `## Context`). **The landing site is `README.md`**, in its
   install/upgrade guidance. So the branch is chosen for you: ⛔ **do not flag a dependency on `0252`
   and do not wait for `RELEASING.md`.** What this step now requires: the close states the exposure
   and names **`README.md`** as the file it was written into, quoting the added text. ⚠️ The
   requirement that the note land in documentation a downstream owner would actually read is
   **unchanged and still binding** — `README.md` is what satisfies it.
6. **Site 4's rule and site 2's conclusion both still stand** in the edited text. Quote before/after.
7. **`npm test` green**, including `test/dual-home-parity.test.js` and `test/structure-manifest.test.js`
   — ⚠️ **check whether either edited skill is dual-homed or manifest-covered**, and regenerate with
   `npm run generate:manifest` if a `claude/scaffold/` file was touched.
8. `git diff --stat` touches exactly `claude/skills/fkit-task-brief/SKILL.md`,
   `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `ai-agents/sprints/backlog.md`, and anything step 7
   required — and nothing else.
   **✅ AMENDED 2026-08-10 — this step's file list is left byte-identical and is now one file short.**
   The **"Document and move on"** ruling adds **one** documentation file — whichever landing site step 5
   settled on. The diff may touch that file **and no other**; the exact-set discipline is otherwise
   unchanged. ⚠️ **Name it explicitly in the close** rather than letting it appear as an unexplained
   extra path.
   ⚠️ **An unresolved constraint the coder must not resolve silently.** The ruling names *"RELEASING.md
   or the ADR"*, and ADR-041 is an **accepted** decision record. Whether an accepted ADR is an
   appropriate landing site for a downstream-exposure note — versus a dated appended note, versus
   waiting for `0252`'s `RELEASING.md` — is **not settled here**. ⛔ **Escalate it; do not pick
   unilaterally.**
   **✅ SETTLED 2026-08-10 — the sub-note above is left byte-identical and is now DISCHARGED, not
   merely amended.** Owner ruling, verbatim option label **"README.md — exists today, right audience
   (Rec)"**. **The one extra file this diff may touch is `README.md`** — nothing else, and the
   exact-set discipline is otherwise unchanged. ⛔ **The escalation this sub-note demanded is
   satisfied: it was escalated, and the owner ruled.** The coder does **not** re-raise it, does
   **not** land the note in ADR-041 (accepted and final), and does **not** create or wait for
   `RELEASING.md`. ⚠️ Name `README.md` explicitly in the close rather than letting it appear as an
   unexplained extra path.

## Notes

- **Depends on:** `0266` — hard
- **Blocks:** nothing
- **Why that edge is real:** these five sites describe the mechanism `0266` lands. Correcting them
  first makes each one false in the **opposite** direction, and site 3 would start **generating** the
  new claim into fresh projects before it is true.
- **⚠️ This is a prose-truth repair on a five-site list a third party's report started and an ADR
  enumerated. Verify each site before you change it** — the filing producer read all five on
  2026-08-10 and reports them as accurate; that is evidence, not a guarantee against drift.
- **On merit:** immediately below `0266` — same decision, same landing window, and site 3 is a
  generator whose output diverges further with every fresh project initialized in the gap.
  ⚠️ **`P14` is an append rank, NOT a merit ranking — flagged for owner confirmation.** A spawned
  producer never re-ranks or inserts mid-board (`/fkit-task-brief` step 5, ADR-035). See Sprint 5's
  dated addendum.

  ✅ **RESOLVED 2026-08-11 — the flag above is left byte-identical and is now DISCHARGED.** The owner
  confirmed the placement in a live `fkit producer` session and the re-rank was **executed**: this row now
  sits at **`Sprint 5 P7`**, and the append rank is history. **and it is the merit position the statement above names, exactly.** Authority, the verbatim ruling, its channel, and the full old→new rank map are in Sprint 5's
  §"Addendum — the owner-ruled re-rank of 2026-08-11". ⛔ **This is not producer precedent for
  re-ranking** — it was executed only because the owner ruled it in a live session.
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.
