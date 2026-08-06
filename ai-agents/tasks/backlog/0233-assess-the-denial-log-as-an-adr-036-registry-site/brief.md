# Assess `0224`'s denial log as an ADR-036 registry site

## ID
0233

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06**, verbatim: ***"File both now."***

> ## ⚠️ NOT ACTIONABLE TODAY. BOTH ITS DEPENDENCIES ARE OPEN, AND NEITHER EXISTS ON DISK.
>
> - **`0189`** — [build the declared skill-ownership site registry and its completeness
>   tripwire](../0189-build-the-skill-ownership-site-registry-and-completeness-tripwire/brief.md).
>   `test/skill-ownership-sites.mjs` **does not exist**. There is nothing to assess a site *against*.
> - **`0224`** — [build the misroute detector as a
>   pair](../0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md).
>   The denial log **does not exist**. There is nothing to assess.
>
> **If either is still absent when this is pulled, the task is `🚧 Blocked — <which prerequisite is
> missing>`, not `✅ Done`.** Writing a speculative assessment of a file that does not exist is the
> failure this warning exists to prevent.

### Why this is a separate row and not a step inside `0224`

**Because the ordering is not guaranteed.** If `0189` lands *after* `0224`, an assessment folded into
`0224` is one that was skipped as unrunnable and then never revisited. A separate row is the only form
that survives every ordering. **This mirrors exactly why
[`0194`](../0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md) was filed
against `0189`/`0190`/`0191`** — same reasoning, same shape, and `0194` is the precedent to follow for
the assessment's own structure.

### The gap this closes

[ADR-036](../../../knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md)
ruled that the inventory of places a role↔skill ownership fact is stated is a **declared registry with
a completeness tripwire**, not a hand-maintained checklist. Its §Context records the failure mode in
its own words: a site was left **undeclared, added by the very task that was told to declare one**.

`0224` introduces a **new, git-tracked, append-only artifact** — a log of skill-ownership hook denials.
Every record in it names *a role* and *a skill it was denied*. **That is an ownership-fact shape**, and
it is being created by a task whose brief says nothing about the registry. **Without this row it lands
undeclared** — precisely the class of site that
[`0226`](../0226-repair-the-four-mirror-checklist-in-skills-for-role-shs-header/brief.md) exists to
clean up after the fact.

**This task is the check that the new log gets *declared*, not the task that builds or changes it.**

### The prediction, stated so it can be falsified rather than assumed

The denial log **records** role↔skill pairs; it does not **attribute** a skill to a role as a
statement of policy. On ADR-036's own two-kinds distinction — *ownership-fact sites* (a file that
attributes a named skill, or a skill-gated act, to a role) versus *declared non-fact hits* — the log
looks like a **declared non-fact hit**, and adding it would raise the registry's noise count by one.

**⛔ That is a prediction, not the answer.** Two things could overturn it, and the assessment must
actually test them:
- The log's **header, schema comment, or surrounding prose** may attribute skills to roles in a way
  the records themselves do not.
- **`0224` is a PAIR.** Its half (ii) is a `**Role:**` line in the worklog, and its half (i) may touch
  `claude/skill-ownership-hook.sh`'s `deny()`. **Score every artifact `0224` creates or modifies, not
  only the log file.** A pair assessed as a single file is half an assessment.

## What to build

**An assessment. Not a build, not a detector change, not an ADR.** The deliverable is a scored
classification plus, if the scoring says so, registry entries.

1. **Confirm both prerequisites first.** `test/skill-ownership-sites.mjs` exists; `0224`'s artifacts
   exist. **If either does not, stop and set the status to `🚧 Blocked` naming which** — do not proceed
   on an assumed shape.

2. **Enumerate every artifact `0224` created or modified.** Read `0224`'s worklog and its actual diff,
   not its brief's plan — the brief describes intent, the diff describes what shipped.

3. **Score each artifact against ALL FIVE of ADR-036's triggers (a)–(e), not (e) alone.** Take the
   trigger spec **as ADR-036 clause 4 states it** — clause 4 says of its own summary sentence that it
   *"is a summary of it, not a second copy of it"*. **Point at clause 4; do not paraphrase it and do
   not work from a remembered version of it.**

4. **Classify each artifact into exactly one of three named outcomes**, with the reason written out:
   - **ownership-fact site** → gets a registry entry of that kind;
   - **declared non-fact hit** → gets a registry entry of that kind;
   - **neither** → **a legitimate result**, recorded as such, producing no entry.

5. **State the registry's noise count before and after**, on ADR-036's own measured basis. ⚠️ **The
   registry module is authoritative for the inventory; no count is hard-coded and no count in any
   report is anything more than a dated measurement of one tree on one day.** Measure it; do not quote
   a figure from ADR-036 or from any report as current.

6. **If an entry is warranted, add it to `test/skill-ownership-sites.mjs`** in that module's declared
   shape, honouring its **≥30-character `reason` floor** — ADR-027 §Decision 3's stated reason being
   that *an entry with no stated reason is an unfalsifiable permanent hole*. **Write a real reason, not
   a padded one.**

7. **Run the completeness tripwire and report its result** — green, or red naming what it caught.

**⛔ Out of scope, by name:**
- **Changing anything `0224` built.** Not the log's format, not its location, not `deny()`, not the
  worklog `**Role:**` line. If the assessment finds a defect in `0224`'s output, **report it and file
  it**; do not fix it here.
- **Building or extending any part of the registry** — that is `0189`.
- **Changing ADR-036's triggers, thresholds, or its two-kinds distinction.** ⛔ Not reopened.
- Any ADR amendment, any new ADR.
- Any new devDependency (ADR-014).
- Any `ai-agents/wiki-vault/` write — **ADR-005: reads only, `fkit-wiki` is the sole writer.**
- Any commit, any push, any re-rank, any task-file move.

## Verification steps

1. **Both prerequisites were confirmed present on disk before any scoring happened**, and the
   confirmation is shown. If either was absent, the task's status reads `🚧 Blocked — <prerequisite>`
   and **no registry entry was written**.
2. **Every artifact `0224` created or modified is enumerated**, derived from `0224`'s diff, and each is
   scored — not the log file alone. An assessment naming one file when `0224` shipped a pair **fails
   this step**.
3. **All five triggers (a)–(e) are scored per artifact**, each with its result, and the spec used is
   cited to ADR-036 clause 4 rather than restated.
4. **Each artifact is classified into exactly one of the three named outcomes**, with the reason.
5. **The registry's noise count is stated before and after**, freshly measured — not quoted from a
   report or from ADR-036.
6. `npm test` is green, including the registry module's own tests and the completeness tripwire.
7. The diff touches **`test/skill-ownership-sites.mjs` and nothing else** — **or nothing at all**, if
   every classification came out *"neither"*.
8. `git status --porcelain` shows nothing under `claude/`, `ai-agents/knowledge-base/decisions/`, or
   `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** `0189`, `0224`.
- **⚠️ Both dependencies are open at filing, and neither's artifact exists on disk.** This task is **not
  pullable** until both land. Pulling it early produces a blocked row, not progress. It is filed now,
  ahead of being runnable, for the same reason `0194` was: **a check that depends on an uncertain
  ordering only survives as its own row.**
- **Blocks:** nothing.
- **⚠️ NOT dependent on ADR-038 / [`0222`](../../done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/brief.md).**
  Recorded explicitly because `0224` *is* downstream of ADR-038 and the two rows sit together on the
  board. **This assessment is downstream of `0224`'s artifacts, not of the ruling that motivated them.**
  Whatever ADR-038 says about which role runs which step, a new git-tracked artifact naming roles and
  skills either belongs in the registry or does not — and that question is ADR-036's, not ADR-038's.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
