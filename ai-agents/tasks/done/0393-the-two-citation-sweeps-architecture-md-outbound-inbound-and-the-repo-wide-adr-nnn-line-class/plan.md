# Plan: 0393, the two citation sweeps

**Status:** plan only, not approved. Nothing written. Decision points: [Q1] [Q2] [Q3/OD4] [Q4/OD3] [Q5/OD5] [R1].
**Build role:** `fkit-coder` (ADR-044 §Decision clauses 1–2; see R1).
**Measured against:** HEAD `d8ef596` plus the dirty working tree of 2026-09-15, which includes `0392`'s uncommitted `architecture.md` edit.

## 0. Authoring rules for this row's own files (binding on `plan.md`, `worklog.md`, `review.md`)
- **No token + colon + digits outside fenced blocks.** Write sites as `` `<path>` · L<n> ``, and ADR sites as `ADR-013 L167`. Reason: the ruled census counts this folder unless [Q1] excludes it. Also, the coordination-citation guard reds on a full coordination-document path + colon + line outside a fence or blockquote.
- Raw command output goes **inside fences** only.
- If [Q1] does not exclude own files, raw outputs go instead to `.fkit/tmp/0393/` (gitignored, so outside the census), and the worklog records each file's sha256.

## 1. Step 0: baseline and gate (no edits)
1. Record `git rev-parse --short HEAD`, the full `git status --porcelain`, and `date -u`. Name every pre-existing dirty path.
2. Create `.fkit/tmp/0393/{before,census,dash}/`. Record sha256 of `architecture.md`.
3. Run the declared census command with the [Q1] pathspecs appended, **as run**. Save `-noiE` output (path, line, match) to `census/E.txt`. Also record:
   - whole-repo, tracked-only, case-sensitive, lowercase-only and `claude/` counts (the zero stated positively);
   - the loose-pattern count;
   - the comma-split coordinate count, using E1's full pattern `adr-[0-9]{3}:[0-9]+(,[0-9-]+)*`;
   - vault count and paths (E6), `sprints/done` sites by name (step 20), and the `test/fixtures` count.
   - State plainly that the numbers disagree with 66, 110/27, 117/29 and 466/71, and that this is expected.
4. Group D enumeration, machine-derived, with commands and full output (step 7):
   - **outbound**, patterns (i) `[A-Za-z0-9_./-]+\.(sh|md|js|mjs|json|tsv|yml|yaml|txt|cjs)` + colon + line, (ii) any token + colon + line, (iii) backticked bare colon + line;
   - **inbound**, patterns (P1) `architecture\.md` + colon + line, (P2) `architecture.md` near "line N" or `#L`, (P3) `architecture\.md#anchor`, (P4) `architecture.md` + `§N`. Same scope as [Q1].
5. Dashboard before-captures: `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` and the same for `sprint-9.md`, into `dash/`.
6. Gate: `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` green. Record baseline `npm test` counts.
7. Assign **stable site IDs** (`E-001…`, `DO-001…`, `DI-001…`) in sorted census order. One ID per **coordinate**: comma tails are split, ranges stay one. Step-0 lines are identity labels, never pointers.

## 2. Resumability protocol
- Worklog sections, each opened and closed with a dated marker: `Phase T-E`, `Phase R-E`, `Phase D0`, `Phase T-DO`, `Phase R-DO`, `Phase T-DI`, `Phase R-DI`, `Phase N` (notes), `Verify`.
- **Progress ledger**, one row per site: ID · path · Step-0 L · match · class · intended referent (heading + quoted fragment) · treatment · status (`triaged`/`edited`/`verified`) · the test's answer (E2) · evidence.
- **Before-copies:** `cp -n` into `before/<path>` immediately before a file's first edit, never overwritten. sha256 recorded in the worklog. If lost, fall back to `git show HEAD:<path>` only for files clean at Step 0.
- **Resume:**
  1. Re-read the worklog.
  2. `git status`, and diff each edited file against its before-copy.
  3. Continue from the first row not `verified`.
  4. Locate every site **by fragment, never by line arithmetic**. Repaired sites no longer match the pattern, so re-running the census shows what remains.
  5. If HEAD moved, record it and re-check that each before-copy plus the logged edits reproduces the current file.
- **No coordinate is ever recomputed from a shift.** Every referent is resolved to content during triage.

## 3. Group E (runs first)
**T-E, triage only, no edits.** For each coordinate:
- read the citing context;
- find the intended referent by reading (E2), and record it as heading + quoted fragment;
- class = `correct` / `drifted, live` / `drifted, frozen` / `mentioned` / `mention?`;
- apply the brief's test ("replace the number — does the sentence become false?") and write its answer into the row.

Expected clusters (dated, re-derive):
- the `0393` brief (20) and `0394` brief (18) default to mention;
- `backlog.md` (32): the closed `0323` row alone holds about 17, and the `0366` row has an extra cell from a stray pipe that must be left alone;
- `sprint-9.md` (4);
- reports (19): per [Q2];
- ADRs (18): per [Q2];
- `architecture.md` ADR-008 L85: `correct`, not repaired (X5, step 22);
- ADR-013 L167: five rows, per [Q3/OD4]; ADR-009 L131 must stay correct (step 16);
- `0166`/`0273`/`0278` briefs; `test/dashboard-contract.test.js` comment (1, comment text only).

Also:
- **Newly introduced vs pre-existing** (criterion 4): for each bad site, use `git log -S` / blame to see whether the line was introduced after Sprint 9 began. A new bad one goes on a "file as residual row" list for the producer.
- **Note-placement hazard map** [Q2]: for every file due a note, list every in-scope coordinate targeting it at or after the proposed insertion point whose class is `correct` or `mentioned`.

**Checkpoint E → return NEEDS-DECISION** if any of these exist: `mention?` sites, contested referents (batched architect consult first, per [R1]), placement conflicts, or new-bad sites. Otherwise continue.

**R-E, live repairs only** (not ADR notes). Replace each `drifted, live` coordinate with heading + quoted fragment (E3). A bare replacement coordinate is not a repair. Prose stays byte-identical (D4). Rows keep their cell count. No Status or rank cell is touched. Mark each row `edited`, then `verified` with the found text shown.

**E4, E5, E6** go into the worklog:
- E4's written decision [Q3];
- E5: the class survived because the pattern was case-sensitive, not because the rule was wrong;
- the vault list, routed to `fkit-wiki`;
- the `sprint-2.md` sites named, with the reason they are frozen.

## 4. Group D
**D0:** read `0356`'s plan and worklog, and state what half A covered, measured against the current file. Not taken from any brief.

**T-DO:** one verdict per outbound coordinate: `correct` / `corrected, was X now Y` / `fenced, owned by NNNN` / `unresolvable, reported`.
- Source-file targets keep the path + line form and **gain** a quoted fragment or function name (convention row 1 + the rule against citing a line number naked).
- Living-doc targets (for example the convention file) change to heading + fragment.
- A claim that looks false is **reported, not fixed** (D4).
- §9 counts are fenced (X6).

**R-DO:** apply the outbound repairs. Then **freeze `architecture.md`**: record its sha256 and assert it unchanged at every later phase.

**T-DI:** against the frozen file.
- Shift map (D5): from `git diff HEAD -- ai-agents/knowledge-base/architecture.md` (0392's four hunks) plus the R-DO diff, and `git log -p` for older citing dates. Show where it came from (step 10). **Use it only as a hint** (D7): each citing claim is re-found by reading.
- Classes: live → repair; frozen (dated reports, ADRs per [Q2]) → fence or report; ambiguous → report.
- `§`/anchor refs: check the heading exists and the numbering is unchanged.

**R-DI:** repair live inbound sites to heading + fragment. `architecture.md` is a living document edited by others, so the line form is wrong there.

## 5. Phase N: ADR drift notes (E and D together, last) [Q2] [Q3] [R1]
- Only for sites Q2 routes to notes. Apply bottom-up within each file, placed per the hazard map.
- Form: `/fkit-record-decision` §"Correcting an accepted ADR — the dated correction note", ⚠️ marker only, with a `- **Corrections:**` bullet. Use the form; do not edit the skill.
- Prove per file: `git diff --numstat` reads `N  0`, and `git diff -U0 -- <adr> | grep '^-' | grep -v '^---'` is empty, **and** the same holds against the before-copy (step 19).
- Re-verify that every `correct` coordinate into each noted file still lands, ADR-009 L131 included.

## 6. [Q4/OD3] and [Q5/OD5]
Write the recommendation and its reasoning into the worklog, including what `0371`, `0368` and `0394` were found to own (step 12). Build nothing. Write no rider.

## 7. Verify (steps 1–25)
- Step 1: `git diff --stat` compared against the Step-0 dirty list. Attribute our edits by diffing against before-copies for the three pre-dirty target files.
- Steps 2–3: zero changes under `test/fixtures/`, `tasks/done/`, `tasks/cancelled/`, `sprints/done/` and the vault.
- Steps 4–5: state that `0392` landed (uncommitted working tree, HEAD `d8ef596`) and that OD2 = §9.5 kept.
- Step 6: every hunk is a citation string, a note, or comment text.
- Step 14: table rows = comma-split coordinate count, with the relation to the occurrence count stated.
- Step 17: `git diff -U0 -- <our paths> | grep '^+' | grep -E '[a-z0-9-]+\.md:[0-9]+'` returns empty or paired.
- Step 18: no Status-line change.
- Step 23: dashboard renders are byte-identical to the before-captures, apart from repaired coordinates.
- Final census re-run (same command, as run): in-scope bad count = 0, or each remaining site named with its class.
- Step 24: `npm test` counts and `bash test/prove-red.sh` green. State that no test reads a doc citation, so green proves nothing about this change.
- Step 25: the two guards green, with no `NAMED_EXEMPT` entry added.

## 8. Risks
- Self-referential census: pinned command, own files excluded [Q1], no colon-digit forms in our records.
- Self-inflicted drift from notes: hazard map [Q2]; ADR-009 is a measured instance.
- Mention vs use can only be told apart by reading; a wrong "repair" cannot be seen in the diff. Hence `mention?` stops for a decision.
- `.fkit/tmp` could be wiped by `fkit-claude-init.sh`; before-copy hashes in the worklog detect a loss.
- An owner "Sprint push" commit mid-Build moves HEAD; recorded per phase.
- Size against the 2026-09-19 deadline; splitting Group E out stays a one-edit option.
- Out of scope, restated: no prose edit, no wiki write, no mover, no rank/order/status cell, no fixtures, no skill or convention edit, no guard, no commit.

## Owner rulings (2026-09-15, via `AskUserQuestion` in the `fkit lead` session — verbatim option labels)

- **Q1:** "Exclude unwritable paths (Rec)" → option (a): exclude `ai-agents/wiki-vault/*`, `ai-agents/tasks/done/*`, `ai-agents/tasks/cancelled/*`, `ai-agents/sprints/done/*`, `ai-agents/sprints/reviews/*`, `test/fixtures/*`, and this row's own `plan.md` / `worklog.md` / `review.md`; every excluded path's count and paths still reported.
- **Q2:** "ADR notes, reports left (Rec)" → option (a): ADRs get an append-only ⚠️ drift note placed below every `correct`/`mentioned` target in that file (NEEDS-DECISION if no adjacent safe position); dated reports are classed "drifted, frozen", left byte-identical, and reported.
- **Q3 (OD4):** "Dated worklist + note (Rec)" → option (b): ADR-013 L167 is a dated worklist; five per-coordinate verdicts; one ⚠️ drift note giving each drifted coordinate's current heading + fragment, ADR-009 L131 marked correct; original line byte-identical.
- **R1:** "Coder writes all (Rec)" → option (a): `fkit-coder` builds everything including ADR notes, consuming the `/fkit-record-decision` note form without running the skill; one batched architect consult only on contested referents and Q3.
- **Q4 (OD3):** "Don't build; route to 0371 (Rec)" → option (a): no guard in this row; the finding (staleness infeasible, syntactic ban on the inbound `architecture.md` + colon + line form in living docs feasible and cheap) is recorded in the worklog; the driver routes it to a producer to add that form to `0371`'s costing.
- **Q5 (OD5):** "No rider now (Rec)" → option (b): no rider; revisit if `0394` finds a guard infeasible.
- **Plan approval:** "Approve (Rec)".
- **Driver note (orchestrated path):** under `fkit-sprint-ship-loop` Build ends at §7 Verify; the driver's separate Verify / Review / Process-review steps follow. No commit by any step. (`&lt;`/`&gt;` in the coder's original return are rendered here as `<`/`>`; a stray pre-heading line in the return was dropped.)
