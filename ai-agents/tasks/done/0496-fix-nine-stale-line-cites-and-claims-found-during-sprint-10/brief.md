# Fix nine stale line cites and claims found during Sprint 10

## ID
0496

## Sprint
Sprint 10

## Priority
P22

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being pullable on the board is not his word.

**Why this task exists.** While planning [`0472`](../../done/0472-tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs/brief.md),
the coder found stale items outside 0472's scope and asked the owner (0472 `plan.md`, OQ2). **Owner
ruling, 2026-10-05** (via `AskUserQuestion` in the `fkit-lead` session running
`fkit-sprint-ship-loop` on Sprint 10, relayed to a spawned producer): **"New small tidy task"** —
*"0472 stays as you scoped it; the producer files one small task for the 9 items on the Backlog board."*
This is that task. 0472's scope does not grow.

**Where the items came from:** 0472's `plan.md` (§4, the `0014` bullet), and the worklogs / plans of
the closed Sprint 10 tasks — [`0480`](../../done/0480-run-only-the-checks-a-change-needs-not-the-full-suite-every-time/plan.md)
(its *"both are already stale"* and *"ADR-026 still says"* bullets),
[`0481`](../../done/0481-make-fkit-update-reinstall-from-the-source-and-paths-it-was-installed-from/worklog.md)
(*"Backlog briefs that cite launcher lines (e.g. 0284) were not touched"*), and
[`0476`](../../done/0476-make-every-document-say-codex-is-optional-but-recommended/worklog.md)
(*"Note (not 0476's)"*).

**What kind of fix this is.** Two kinds, and they are handled differently:
- **Stale line cites** (items a–f, h): the cited line moved. Fix the **cite**, not the prose around it
  (the 0393 rule: *"Correct the citation, never the prose."*). Where a cite is fixed, prefer the durable
  form — a quoted fragment or heading next to (or instead of) the number — per
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
  (*"Never cite a line number naked"*). Reason: the launcher has moved several times during Sprint 10
  alone (0481's worklog measured the interview probe at 642; on 2026-10-05 it is at 656), so a bare new
  number will be stale again soon.
- **Stale claims in ADRs** (items g, i, and the ADR side of h): the ADR says something that stopped
  being true. ADRs are records: **add a dated note; do not rewrite the original text** (the 0197 /
  0472 precedent — existing text stays byte-identical, the diff is additions only). These go through an
  **`fkit-architect` consult** (as 0472 items 6–7 did), because they correct what a decision says.

**Every number below was measured on 2026-10-05 against the working tree**, which holds uncommitted
edits from other Sprint 10 tasks. **Re-measure everything when this task runs — locate by content, not
by line number.**

### Coordinates with other work

- **0472 is running now** and edits ADR-052 and brief `0436` (plus ADR-033/049/051, briefs 0407 and
  0435–0442, and several reports). Items (i) touch ADR-052 and 0436. Hence the dependency below — wait
  for 0472 to close, then re-check (i) against what 0472 wrote.
- **0472 item 8** fixes the same wrong `fkit-coder.md:109-113` cite in `claude/skills/fkit-task-ship-loop/SKILL.md`.
  Item (h) here is the **ADR-019** copy of it; it does not touch the skill.
- **Related, not a dependency: [`0394`](../../backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md)**
  (a guard for the `ADR-NNN:LINE` citation class). This task is one more hand sweep of the kind 0394
  wants to make unnecessary. Neither waits for the other.

## What to build

For each item: verify it is still stale, fix it (or record why not), and log a one-line verdict per
cite in `worklog.md` — **fixed** / **already correct** / **frozen record, left as is** / **target
gone** — with the before and after.

**(a) `claude/skills/fkit-sprint-ship-loop/SKILL.md` — the *Process review* row cites wrong lines of
`fkit-process-stateful-review/SKILL.md`.** Named in the routing: `:195` (meant: Step 6, *"Apply
approved fixes + update the shared file"* — line 208 on 2026-10-05; 195 is the Step 5 heading) and
`:85` (meant: the six Status values under *"Status vocabulary"* — lines 96–97; 85 is *"by their
stable id"*). ⚠️ **Found while verifying, same row, same cause:** the seeding-path cites `:103-104`
and `:119-120` also miss (103 is *"You are a critical filter"*; the seeding path is at Step 0's
*"create it"* and Step 1's *"If findings arrived as pasted text"*). Fix all four in this row; nothing
else in the file changes. ⚠️ `fkit-sprint-ship-loop/SKILL.md` is named in `test/prove-red.sh`
(mutation 9) — check the edit does not move prove-red's `sed` target.

**(b) `claude/fkit-claude-init.sh` — the comment citing `fkit-claude.sh:576`** (the line reading
*"with no .fkit/interview the launcher's `[ -x … ]` probe"*, ~644). The probe is now at line 656 of
`claude/fkit-claude.sh` (`[ -x "$proj/.fkit/interview" ]`). Comment-only change.

**(c) `test/orphan-cleanup.test.js` — the comment citing `claude/fkit-claude.sh:311-312`** (~288,
*"writes `.fkit/settings/<role>.json` on every launch"*). That write is now at lines 392–393 (inside
`build_settings()`). Comment-only change.

**(d) `RELEASING.md` — `claude/fkit-claude.sh:79-91` and `:92-98` are one line early.**
`_fkit_remote_sha` is 80–92 and `_fkit_remote_version` 93–99 on 2026-10-05. Also re-check the file's
other launcher cites (`:124`, `:185`, `:202-208`) while there — fix only those that miss.

**(e) Open backlog briefs that cite launcher lines.** Found on 2026-10-05: `0284`, `0328`, `0382`,
`0403`. ⛔ **Not a mechanical renumbering** — some of these record a measurement on a date (e.g.
0284's *"Re-measured on disk 2026-08-13"* section) and 0382 says its source coordinates are *"used
deliberately"*. Per cite: a **live pointer** for a later reader gets fixed; a **dated measurement**
stays as written (optionally with a dated note). Re-grep for any other open brief citing
`claude/fkit-claude.sh:` with a number before starting. ⛔ Skip any brief 0472 is editing.

**(f) The Backlog board's `CLAUDE.md:58` cite.** It sits in the **`➡️ Moved to Sprint 8` row for
`0341`** (*"every enumeration of the task movers (… `CLAUDE.md:58`, READMEs)"*). ⚠️ **Expected
outcome: no edit.** A `➡️ Moved` row is closed history and is not altered; and 0476's worklog notes
the cite was *"already stale before this change"*. Record the verdict in the worklog. If the plan
thinks it should change, that is a question for the owner at the plan gate, not a call to make alone.

**(g) ADR-026 says there is no CI workflow.** Its *Related* section says *"No `.github/workflows/`
exists today"*; its *Context* says *"no `.github/workflows/` in the tree at all"*; its *Consequences*
say *"Today `prove-red.sh` still runs only when a human types it."* Since 2026-08-12
`.github/workflows/test.yml` exists and runs `npm test`, which now includes `test/prove-red.sh`.
**Fix: one dated note** saying so (architect consult). Original text unchanged.

**(h) ADR-019 cites `fkit-coder.md:109-113`** for *"a new architecture/scope decision → owner"*.
Those lines are the coder's skill list. The rule is the paragraph *"But: a genuinely NEW architecture
decision goes to the OWNER."* in `claude/agents/fkit-coder.md` (line 165 on 2026-10-05). **Default
fix: a dated note** pointing to the right place by quoted fragment, original cite byte-identical (the
0197 rule for ADR line cites). The architect may rule a different form, with the reason in the worklog.

**(i) `0014` used as an example of "brief says Backlog, folder says done".** Stopped being true on
2026-10-02 (owner ruling R7 in 0472: `0014`'s status corrected to `✅ Done`). Only the explanation is
stale; the converter's rule is unchanged.
- **ADR-052 D8 item 3** (*"e.g. `0014`: brief says Backlog, folder says done"*): add a dated note —
  `0014` now belongs to the **no board row** class (like `0004`). Architect consult.
- **Brief `0436`:** ⚠️ **already carries a 2026-10-02 note** (*"`0014`'s example has changed in
  part"*). Likely nothing to do — confirm after 0472 lands and record the verdict.

**Out of scope:** any other file or stale pointer; any rewording; any closed task folder; anything
0472 edits; `ai-agents/wiki-vault/` (wiki writes are `fkit-wiki`'s only).

## Verification steps

1. `worklog.md` has one verdict line per cite/claim in items a–i, with before/after text.
2. For each fixed cite: open the target and confirm the cited line (or quoted fragment) is the thing
   the sentence describes.
3. `git diff --stat` lists only files named in items a–i (plus this task's folder).
4. ADR-019, ADR-026, ADR-052 (and the Backlog board, if touched at all): `git diff --numstat` shows
   **0 removed lines** — additions only.
5. **Full `npm test`** — required: (b) and (c) are a non-`.md` file under `claude/` and a file under
   `test/`, which CONTRIBUTING's *"What to run for a change"* table puts in the `npm test` row; (a)'s
   file is named in `test/prove-red.sh`. Green, or the failure reported plainly.
6. `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
   test/adr-number-uniqueness.test.js` green (covered by step 5; listed so a partial run is not
   mistaken for enough).
7. Run `claude/fkit-claude-init.sh .` so the dogfooded `.claude/` copy of the sprint ship-loop skill
   matches the canonical one.

## Notes

- **Depends on:** 0472
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word** (standing rule, quoted in *Context*).
- **Why depends on 0472:** both edit ADR-052 and brief `0436`, and 0472 is building now. Serialize,
  then re-check item (i) on top of what 0472 wrote. The other items do not overlap 0472's files.
- **Related, not a dependency:** `0394` (citation guard).
- **Owner choice:** `fkit-coder` — two of the files are source/test (the coder is the only role that
  writes them) and the task runs the full suite. **ADR notes (g, h, i) go through an `fkit-architect`
  consult**: they correct what an ADR records, so they are not purely mechanical.
- **Why one brief, not nine:** the owner ruled *one small task*. Each item is a tiny comment or note
  with the same method and one shared verification run; splitting would add nine plan gates for no
  independent value.
- **After it lands:** `fkit-wiki` may need a small re-sync for ADR-019/026/052 pages (not checked
  page by page).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- **Filed 2026-10-05** by a spawned `fkit-producer` at `fkit-lead`'s direction, on the owner ruling
  relayed from the lead session — no owner channel (ADR-021). Decides nothing beyond the scoping;
  ⛔ no commit.
