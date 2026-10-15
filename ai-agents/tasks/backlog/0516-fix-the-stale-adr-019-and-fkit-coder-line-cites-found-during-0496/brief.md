# Fix the stale ADR-019 and `fkit-coder.md` line cites found during 0496

## ID
0516

## Sprint
Sprint 12

## Priority
P1

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**Why this task exists.** While planning and building
[`0496`](../../done/0496-fix-nine-stale-line-cites-and-claims-found-during-sprint-10/brief.md), the coder found
stale line cites outside 0496's scope and asked the owner (0496 `plan.md`, OQ3). **Owner ruling,
2026-10-14** (via `AskUserQuestion` in the `fkit-lead` session running `fkit-sprint-ship-loop` on
Sprint 10, relayed to a spawned producer) — **the option label is the verbatim text**: **"File a
Backlog task (Rec)"**, described as *"One tidy task for 1–3 + producer re-check of 0284. Knock-on: none
(checked)."* This is that task. It covers 0496's worklog section *"Out of scope — recorded for the
follow-up"*, items **1–3**. (Item 4, the 0284 re-check, was done by the producer on the same day and is
recorded as a dated note in 0284's brief, not here.)

**What kind of fix this is.** Stale line cites only — the cited line moved; the sentence around it is
still right. Fix the **cite**, never the prose (the 0393 rule: *"Correct the citation, never the
prose."*).

- **Never cite a line number naked.** Every fixed cite pairs its number with a quoted fragment (or the
  heading it sits under), per
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
  (*"Never cite a line number naked"*).
- ⚠️ **That page goes further for this target.** Its section *"Applying the two conditions to a target
  the table does not name"* says a decision record that carries appended correction notes — ADR-019 is
  one; 0496 just added two — is a document that grows under the citer, so *"`path:NNN` is wrong; anchor
  by heading plus quoted fragment."* **Number + quote is the floor** (the owner's relayed ruling);
  dropping the number for heading + quote is allowed by the convention. **The plan picks one form,
  states it, and uses it for every live pointer in this task.** It is a wording choice, not a scope
  change.
- **ADRs are records: additions only.** Where the stale cite sits inside an ADR (ADR-025, ADR-032,
  ADR-037), the original text stays byte-identical; the fix is a **dated note** pointing to the right
  place by quoted fragment (the 0197 rule for ADR line cites, as 0496 item (h) did for ADR-019).
- **Dated records stay as written.** A report or a dated measurement that cites a line is a claim about
  the revision its author read. Per cite, decide: a **live pointer** for a later reader gets fixed; a
  **frozen record** is left as is (0496's verdict legend). Closed task folders are out of scope
  entirely.

**Measured 2026-10-14 against the working tree, which holds 0496's uncommitted ADR-019 additions.
0496 is under review as this is filed, and its ADR-019 notes may still change. Re-measure everything
when this task runs — locate by content, not by line number.**

### The targets, as measured 2026-10-14

| Cited as | Means | Where it is today |
|---|---|---|
| ADR-019 `:96` | *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is auditable."* | ADR-019 §Decision item 4, lines 119–120 |
| ADR-019 `:97` | *"The done-gate is unchanged and owner-only."* | ADR-019 §Decision item 5, line 129 |
| ADR-019 `:148-150` | the obvious-winner self-classification, *"This is the sharpest edge"* | ADR-019 §Consequences, lines 180–182 |
| ADR-019 `:138` | *"The owner later wants relayed-consent close-out … needing its **own** ADR"* | ADR-019 §Consequences, lines 194–195 |
| `fkit-coder.md:165` | *"But: a genuinely NEW architecture decision goes to the OWNER."* (§Consulting a teammate) | `claude/agents/fkit-coder.md` line 212 |

## What to build

For each cite below: confirm it is still stale, fix it (or record why not), and log one verdict line
per cite in `worklog.md` — **fixed** / **already correct** / **frozen record, left as is** / **target
gone** — with the before and after.

**1. `claude/skills/fkit-sprint-ship-loop/SKILL.md`, the *Process review* row — `ADR-019 `:96``.**
The row's *"(ADR-032 A2 / ADR-019 `:96`)"* means the *"Every autonomous choice …"* sentence. Fix the
cite only; nothing else in the row or the file changes. ⚠️ **0496 edited this same row** (four other
cites) — work on top of what 0496 landed, never revert it. ⚠️ This file is named in
`test/prove-red.sh` (mutation 9) — check the edit does not move prove-red's `sed` target.

**2. Other stale ADR-019 line cites.**
- **`claude/agents/fkit-coder.md`** — *"ADR-019's audit obligation transfers with its permission
  ([ADR-019](…) `:96`; …)"* under the Process-review worker bullet. Live pointer → fix. Edit the
  canonical file in `claude/`, never the `.claude/` copy.
- **ADR-025** — `(`adr-019:97` — *"the done-gate is unchanged and owner-only"*)` in its header.
  ADR → dated note, original byte-identical.
- **ADR-032** — *"ADR-019 `:96` makes the autonomy conditional on auditability"* and *"ADR-019
  `:148-150` also names the obvious-winner self-classification *"the sharpest edge""*. ADR → one dated
  note covering both, original byte-identical.
- **Two reports** — `reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md`
  (`adr-019:138`) and `reports/2026-08-05-eval-process-review-step-role-ownership.md` (`ADR-019 `:96``,
  inside a quoted copy of the row). Both are dated records; **expected verdict: frozen record, left as
  is**. If the plan thinks either should change, that is a plan-gate question for the owner.
- ⚠️ **Found while scoping, same class, not in 0496's list: ADR-037** — its *Related* list cites
  *"[ADR-019](…) `:96` and [ADR-020](…) — the audit obligation clause 2 reuses."* ADR → dated note.
  Included because it is the identical cite; the plan may drop it with a reason in the worklog.

**3. `claude/skills/fkit-task-ship-loop/SKILL.md` — `fkit-coder.md:165`.** In step 6's *"⛔ STOP"*
bullet (*"a new architecture/scope decision → owner, `fkit-coder.md:165`"*). The rule is now at line
212. Live pointer → fix.

**Before starting, re-grep the repo** (excluding closed task folders and `ai-agents/wiki-vault/`) for
`ADR-019` / `adr-019` followed by a line number, and for `fkit-coder.md:165`, and list any hit not named
above in the worklog. Fix a new hit only if it is the same kind (a live pointer to a moved ADR-019 or
`fkit-coder.md` line); anything else is logged, not fixed.

**Out of scope:** any other file or stale pointer; any rewording; the `fkit-coder.md:109-113` cites
(0472 / 0496 handled them); short-form launcher cites in briefs 0284 and 0328 (0496's *"Found, not
fixed"*); any closed task folder; anything 0496 is still changing; `ai-agents/wiki-vault/` (wiki writes
are `fkit-wiki`'s only).

## Verification steps

1. `worklog.md` has one verdict line per cite in items 1–3 (and per extra hit from the re-grep), with
   the before and after text.
2. For each fixed cite: open the target and confirm the cited line and quoted fragment are the
   sentence described in the table above. Re-measured on the day, not copied from this brief.
3. No fixed cite is a naked number: each carries a quoted fragment or heading, in the one form the
   plan chose.
4. `git diff --stat` lists only files named in items 1–3 (plus this task's folder).
5. ADR-025, ADR-032 and ADR-037 (each one touched): `git diff --numstat` shows **0 removed lines** —
   additions only.
6. `claude/fkit-claude-init.sh .` refreshes the `.claude/` copies; the copies of the two SKILL.md files
   and `fkit-coder.md` then match their canonical sources.
7. Run the checks CONTRIBUTING's *"What to run for a change"* table names for the files touched
   (Markdown in `claude/skills/` and `claude/agents/`, plus `test/prove-red.sh` because of mutation 9),
   and state the measured pass/fail counts.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Related, not a dependency: [`0394`](../0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md)**
  (a guard for the `ADR-NNN:LINE` citation class). This task is one more hand sweep of the kind 0394
  wants to make unnecessary. Neither waits for the other.
- **Coordinates with 0496, not a dependency** (owner ruling 2026-10-14: depends on nothing). 0496 adds
  lines to ADR-019 and edits the same *Process review* row as item 1, and is under review as this is
  filed. That is why every number above must be re-measured on the day; nothing here is built on
  0496's unlanded text.
- **Provenance:** 0496's `worklog.md`, section *"Out of scope — recorded for the follow-up"*, items 1–3;
  ADR-037 found by the producer while scoping (2026-10-14).
- Filed 2026-10-14 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by the `fkit-lead` driver. It moved no task file, changed no other task's status,
  priority or location, wrote nothing under `ai-agents/wiki-vault/`, and committed nothing.
