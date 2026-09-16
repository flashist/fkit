# Sweep the stale count claims in `architecture.md` §1–§7

## ID
0400

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

⚠️ **Producer judgement, flagged.** No ruling assigns it. The deliverable is a prose repair to
`ai-agents/knowledge-base/architecture.md`, which no producing skill writes;
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1's skill-less clause staffs that to the coder, and `0392`'s owner ruling J2 (*"Coder builds
all (Rec)"*) did the same for the last `architecture.md` prose repair. `0397` carries the identical
reasoning for the identical file.
⛔ **This field is itself an instance of the question `0402` exists to settle** — see *Neighbours*.

## Context

### Provenance

**Owner ruling, 2026-09-16**, given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9
wrap-up), multi-select, verbatim option label **"Skill count 26→28"**. Source: the wiki librarian's
third sync pass of 2026-09-16, whose findings are recorded in `ai-agents/wiki-vault/log.md`'s entry
for that date. Filed by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

### Why this survived Sprint 9

Sprint 9 had two rows over `architecture.md` and **neither row's scope could reach these sites**:
`0392` was §9.1 and §9.5 prose; `0393` was a citation sweep whose rule D4 forbade fixing a **claim**.
**No row has ever swept §1–§7's counts.** This is a class gap, not a missed hit.

⛔ **Neither stale site carries a date**, so the dated-claim rule — *a claim is correct as of its date
and does not become a defect by ageing* — does not excuse either one. **An undated wrong number is
simply wrong.**

⚠️ **Verified at filing, and it matters: that rule is NOT YET RECORDED ANYWHERE.**
`ls ai-agents/knowledge-base/conventions/` returns eleven pages and none of them is it; a repo-wide
grep for *"correct as of its date"* over `ai-agents/knowledge-base/` returns nothing.
[`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)
is the open brief that would record it. ⛔ **Do not cite a convention page for it — cite the rule and
name `0301` as its unbuilt home.** Not a dependency: the two false sites are undated, so the rule's
status changes nothing about them.

### The sites — re-measured on disk 2026-09-16 at filing (re-derive at pickup)

Ground truth at filing: `ls -d claude/skills/fkit-*/ | wc -l` → **28**; `ls claude/agents/fkit-*.md |
wc -l` → **7**.

Cited by section and quoted text. ⛔ **Do not trust any line number.**

| Section | Quoted claim | Verdict at filing |
|---|---|---|
| §1 *"What fkit is"*, the source bullet list | *"**skill playbooks** — markdown procedures (`claude/skills/fkit-*/SKILL.md`, 26 dirs)"* | ❌ **FALSE** — 28 |
| §3 *"Repository structure"*, the tree block comment | *"26 /fkit-* skills — the role procedures"* | ❌ **FALSE** — 28 |
| §4.2 heading | *"The 28 skills — where the procedures live"* | ✅ **TRUE** — leave it |
| §1, the same bullet list | *"agent definitions — markdown + YAML frontmatter (`claude/agents/fkit-*.md`, 7 files)"* | ✅ **TRUE** |
| §4.1 / §4.2, the role counts (*"seven roles"*, *"the six Claude-side roles"*, *"six files carry no `tools:` frontmatter"*) | — | ✅ **TRUE** — 7 agent files, exactly one (`fkit-adversarial-reviewer.md`) carries a `tools:` line |

⚠️ **The two false sites are REGISTERED MIRRORS that were not updated.** Both
`claude/skills-for-role.sh` and `claude/fkit-claude.sh` carry a hand-maintained checklist naming
*"ai-agents/knowledge-base/architecture.md — the skill count and the role/skill table"* as one of the
**six** places that MUST be updated in the same commit when a role's skills change. The checklist
exists, names this exact file, and was not followed — and that same header records it having been
incomplete twice before (*"THIS LIST SAID 'TWO' UNTIL 2026-07-18"*, *"It said 'FOUR' until
2026-08-27"*). ⛔ Nothing automated checks the mirror; that is the root cause and it is **out of scope
here** (see *Neighbours*).

### The one judgement call — §1's CI counts, a plan-gate question

§1 carries *"Measured **2026-09-04** over the workflow's full run history: **33 runs on
`ubuntu-latest`, 29 green and 4 red**"*. §9 carries the same measurement re-taken: *"Measured
**2026-09-14** … **43 runs on `ubuntu-latest`, 39 green and 4 red**"*.

**Both are dated, so BOTH are correct as of their dates and neither is a defect.** But one living
document now states two different run totals ten days apart, and §1's paragraph already ends by
cross-referencing §9. ⛔ **Do not fix this silently either way.** Put it to the plan gate; the
producer's recommendation is **re-measure and re-date §1 in the same pass** (cheapest, and it keeps
§1 self-contained), with *"point §1 at §9 instead of repeating the figures"* as the alternative.

### Dropped at filing — recorded so nobody re-files it

- **`test/init-claude-refresh-guard.test.js`**, the comment *"of all 7 agents and 26 skills as if it
  had worked"* — same stale 26, **but it is a test comment, not `architecture.md`, and it is outside
  §1–§7**. Not in the ruling's scope. Raise at the plan gate only if the owner wants it swept in the
  same pass.
- **§9's counts** (*"29 `node --test` suites"*, the 43/39/4 run history). Settled by `0392`;
  re-verified correct at filing (`ls test/*.test.js | wc -l` → 29). ⛔ **Explicitly out of scope.**

### Neighbours, not dependencies

- **`0397`** (open) repairs four other false claims in `architecture.md` — §2's Node row, §6's
  invariant 2, §7's *"never clobbering"*, §10's Idempotence bullet. **Different claims; §1 and §3 are
  untouched by it.** Overlapping file, so whoever runs second re-reads before editing. Neither blocks
  the other.
- **`0395`** (open) re-measures the CI test runtime and the workflow timeout. **Adjacent to the
  plan-gate question above but not the same claim** — it is about a timeout value, not a run count.
- **`0402`** (open, filed with this one) settles what `## Owner` means when it disagrees with
  ADR-044's build role. This brief's own `## Owner` flag is exactly the specimen. **No dependency** —
  this row ships whoever builds it.
- **The mirror-checklist root cause is unowned.** Nothing tests that `architecture.md`'s skill count
  tracks `claude/skills/`. ⛔ **Do not build a guard inside this row** — report it at the plan gate;
  a guard is its own brief.

## What to build

1. **Re-derive the ground truth at pickup** and record the command and output in the worklog:
   `ls -d claude/skills/fkit-*/ | wc -l` and `ls claude/agents/fkit-*.md | wc -l`.
2. **Enumerate EVERY count claim in §1 through §7** — not only the two known-false ones. §1–§7 is the
   span from the heading *"1. What fkit is"* up to, and excluding, the heading *"8. History — fkit
   formerly ran on Omnigent"*. Record each claim, its section, its quoted text, and a verdict
   (true / false / dated-and-correct). ⛔ **A claim you checked and left alone must still appear in
   the worklog with its reason** — that is what makes the sweep provably complete rather than a
   two-site patch.
3. **Correct every false claim in place.** `architecture.md` is a **living** document — correct it
   directly, no dated-note form.
4. **Date what is dated.** Sprint 9's criterion 3 discipline: *a correct number with no date is not a
   repair.* A number derived from a command that could change tomorrow (the skill count, the agent
   count) carries a measurement date; a number fixed by a decision (*"seven roles"*, ADR-028's
   not-yet-built eighth) does not need one. State which treatment each corrected site got and why.
5. **Put the §1-vs-§9 CI-count coherence question to the plan gate** before touching it. Do not
   implement before the ruling.
6. **No other `architecture.md` edits.** Anything else found false goes in the worklog as a reported
   observation, not a fix. ⛔ **Do not fix the mirror checklist, the test comment, or §9.**
7. **Record the reusable detection command** in the worklog so the next sweep does not re-derive it,
   per `0363`'s sweep-completion discipline.

## Verification steps

1. The worklog carries the complete §1–§7 count-claim inventory from step 2, one row per claim, each
   with a verdict and — where left unchanged — the reason.
2. `grep -n "26 dirs" ai-agents/knowledge-base/architecture.md` and
   `grep -n "26 /fkit-\* skills" ai-agents/knowledge-base/architecture.md` each return nothing.
3. The skill count stated in `architecture.md` equals the output of
   `ls -d claude/skills/fkit-*/ | wc -l` run in the same session; both are recorded in the worklog.
4. Every corrected number is either accompanied by a measurement date or the worklog says why it
   needs none.
5. The §1-vs-§9 CI-count question has a recorded plan-gate ruling, and the tree matches it.
6. `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` — both
   green; state the counts.
7. `npm test` passes.
8. `git diff --stat` touches `ai-agents/knowledge-base/architecture.md` and this task folder only.
   ⛔ Nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- ⚠️ **One brief, not a split — producer judgement.** Two false sites could be two rows, but they are
  one claim (*the number of skills*) in one file, verified by one command, and splitting would run the
  same inventory twice. The **inventory** (step 2) is the unit of work, not the two known hits.
- ⚠️ **Filed UNRANKED and APPENDED LAST** on the Backlog board by a spawned producer with no owner
  channel; renumbers and inserts nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- Cite `ai-agents/…md` files by quoted text, not line coordinates.
- ⛔ No wiki write ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md));
  the vault's `fkit.md` and `knowledge-base-structure.md` pages may repeat the stale count — report it
  for `fkit-wiki`, do not edit it.
- ⛔ No commit.

### ⭐ Owner ruling 2026-09-16 — sequencing with `0403` (soft ordering, NOT a dependency)

⭐ **Owner ruling, 2026-09-16**, given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9
wrap-up) — verbatim option label **"0400 first, then 0403 (Rec)"**. The ruling's own words:

> *"Fix the counts, then add the guard. main never goes red. Recorded as a soft ordering note on both
> briefs, not a dependency."*

**What it means for this row:** this row lands **before**
[`0403`](../0403-guard-architecture-mds-skill-count-against-the-skills-on-disk/brief.md), the guard
over the same count claims. The reason is merge hygiene, not sequencing need: `0403` landing first
turns `npm test` **red on `main`** until this row lands, because the defect the guard catches is
genuinely present on disk today.

⛔ **This is NOT a dependency.** `Depends on: nothing` above stays correct as written — neither row
needs the other built or shipped, and nothing above this note changes. Recorded by a spawned
`fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
relaying a ruling the lead session captured.
