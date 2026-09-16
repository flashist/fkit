# Correct the four false claims `0393` reported in `architecture.md`

## ID
0397

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

⚠️ **Producer judgement, flagged.** No ruling assigns it. The deliverable is a repair to
`ai-agents/knowledge-base/architecture.md`, which no producing skill writes;
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1's skill-less clause staffs that to the coder, and `0392`'s owner ruling J2 (*"Coder builds
all (Rec)"*) did the same for the last `architecture.md` prose repair.

## Context

### Provenance

**Owner ruling, 2026-09-15**, given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9
wrap-up), multi-select, verbatim option label **"File claim briefs"** — *"A producer files a backlog
brief or briefs for the ~15 false claims 0393 found, plus ADR-009's misquote and stray </content>
line."* Filed by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

**Source:** [`0393`'s worklog](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/worklog.md),
sections *"Claim observations (D4: reported, not fixed)"* and *"Claim observations added at T-DI (D4:
reported, not fixed)"*. `0393` was a citation sweep; its rule D4 forbade fixing a false **claim**, so it
recorded them. This brief takes the `architecture.md` ones. Sibling briefs: `0398` (ADR text defects),
`0399` (open briefs and board rows).

### The four claims — each re-verified on disk 2026-09-15 at filing (re-derive at pickup)

Cited by section and quoted text. **Do not trust any line number.**

| # (worklog) | Section | Quoted claim | Why it is false today |
|---|---|---|---|
| 5 | §2, dependency table, **Node (ESM)** row | *"Only to cut a release (`npm run release`)."* | `package.json` `scripts` also defines `test`, `test:unit`, `test:prove-red` and `generate:manifest`. ⚠️ The row's own source pointer into `package.json` also no longer spans the whole `scripts` block — check it in the same edit |
| 6 | §6, invariant 2, *"The task status vocabulary is closed"* | *"Backlog · In progress · Blocked · Done · Cancelled · Moved, plus the `(agent-closed — not owner-verified)` variants of the last two."* | The *"last two"* in that list are Cancelled and Moved; the agent-closed variants belong to **Done and Cancelled**. The list also omits **Moved (to backlog)**, which `task-status-vocabulary.md`'s status table lists as its own row |
| 7 | §7, flow *"2 — Fresh-project onboarding"* | *"**never clobbering** an existing one"* | Init now **rewrites the fkit rules block** inside an existing `CLAUDE.md` / `AGENTS.md` (`claude/fkit-claude-init.sh`, the `RULES_BEGIN` marker handling and its *"updated the fkit rules block in"* message), and **converges** an existing `ai-agents/` (creates missing scaffold paths; its header says *"An existing tree is CONVERGED, not skipped"*) |
| 14 | §10, **Idempotence** bullet | *"init never clobbers an existing `ai-agents/`, `CLAUDE.md`, or `AGENTS.md`."* | Same stale claim as #7. ⚠️ **What is still true, and must be kept:** convergence never overwrites a path that already exists — so the honest wording is narrower, not the opposite |

### Dropped at filing — recorded so nobody re-files it

- **Worklog item 8** (§5.1 diagram, *"fresh project? → skip the menu, seed the PRODUCER"*). The worklog
  itself says *"Not false"* — incomplete since ADR-031 (the cold start falls through to the lead on
  success). A completeness gap, not a false claim. **Out of scope here**; raise it at the plan gate only
  if the owner wants §5.1 completed in the same pass.

### Neighbours, not dependencies

- **`0273`** (open) rewrites the `--sandbox` sites in `architecture.md` §2 (the Codex CLI row), §5.3 and
  §7 flow 4. **Same table as #5, different row; different flow from #7.** Neither blocks the other.
  Whoever runs second re-reads the file first.
- **`0395`** (open) flags stale *"~6 min"* figures in `architecture.md` as a plan-gate question. Not
  these claims.

## What to build

1. **Re-derive all four at pickup** — quote the current text of each claim and the current evidence
   (`package.json` scripts, `task-status-vocabulary.md`'s table, `claude/fkit-claude-init.sh`'s rules-
   block and convergence behaviour). If any claim is already true, record that and skip it.
2. **Rewrite each false claim in place** so it says only what is true, with a measurement date beside
   any number or list (Sprint 9's criterion 3 discipline: *a correct number with no date is not a
   repair*). `architecture.md` is a **living** document — correct it in place, no dated-note form.
3. **#7 and #14 must agree** with each other and with the init script: say what init changes in an
   existing project and what it never overwrites.
4. **Cite by durable anchors** — heading plus quoted fragment for coordination documents; a source-file
   pointer only where load-bearing.
5. **No other `architecture.md` edits.** Anything else found false goes in the worklog as a reported
   observation, not a fix.

## Verification steps

1. For each of #5, #6, #7, #14: the before text and after text quoted in the worklog, with the on-disk
   evidence that makes the after text true (command and output, dated).
2. `grep` for *"Only to cut a release"*, *"variants of the last two"*, *"never clobbering"* and
   *"never clobbers an existing"* in `architecture.md` — each returns nothing, or the worklog explains
   why the surviving text is now true.
3. `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` — both
   green; state the counts.
4. `git diff --stat` touches `ai-agents/knowledge-base/architecture.md` (plus the task folder) only.
   ⛔ Nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- ⚠️ **Split, flagged:** one of three briefs from the same ruling, split by **which kind of document is
  repaired** — a living doc corrected in place (this), accepted ADRs corrected by dated note (`0398`),
  open briefs and board rows (`0399`). Each ships and verifies alone. A producer judgement, not a ruling.
- ⚠️ **Filed UNRANKED and APPENDED LAST** on the Backlog board by a spawned producer with no owner
  channel; renumbers and inserts nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ No wiki write ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md));
  if vault pages repeat these claims, report it for `fkit-wiki`.
- ⛔ No commit.
