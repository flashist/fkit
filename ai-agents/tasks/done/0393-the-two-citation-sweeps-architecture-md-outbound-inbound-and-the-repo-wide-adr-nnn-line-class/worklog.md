# Worklog: 0393, the two citation sweeps

**Build role:** `fkit-coder`, spawned by `fkit-sprint-ship-loop` (Build step) under the declared-approval
marker. Approved plan: this folder's `plan.md`, blob `809db7c330ce70849504803c025a879008bbdb24`
(re-hashed at start, matches). Owner rulings applied: Q1(a), Q2(a), Q3(b), R1(a), Q4(a), Q5(b).

**Authoring rule (plan §0):** no token + colon + digits outside fenced blocks. Sites are written as
`<path>` · L<n>, ADR sites as ADR-013 L167. Raw output lives inside fences only.

## Decision log (unattended calls)

- 2026-09-15: none. Build stopped at Checkpoint E; no target file edited, no obvious-winner call made.
  Classification judgements (mention vs use, per-site referents) are recorded per row in the T-E ledger.
- 2026-09-15, **Process-review round 1** (`fkit-sprint-ship-loop` Process-review worker, declared-approval
  marker; fixes applied without per-fix owner approval under the standing approval). Each entry: the finding
  it answers · what changed · why it qualified.
  1. **R1** · `architecture.md` §2 Codex CLI row, "Where" cell: launcher coordinate L274-285 → L539-560 plus
     the quoted comment header and `codex_preflight()`; one line rewritten, line count unchanged; new freeze
     hash recorded under § "Freeze" · owner ruling B ("Repair it in 0393 (Rec)"), verified CORRECT,
     mechanical, the DO-15 form.
  2. **R2** · 26 missed inbound coordinates enumerated and given verdicts (DI-095…DI-120); two live site
     labels in the `0273` brief (§ "Two stale citations that sit ON lines this task already rewrites",
     *"site 6"* / *"site 8"*) repaired to heading + fragment, matching the site list · verified CORRECT, in
     plan (§7 steps 7–8: complete enumeration, one verdict per citation; R-DI treatment for a live pointer).
     No closed row, report, status or rank cell touched.
  3. **R2, obvious-winner call** · ADR-042 §"Three further sites, missed by the producer and the lead" holds
     four bare `architecture.md` coordinates the reviewer did not list either (DI-117…DI-120). Classed
     **drifted, frozen (pending worklist)** and given one ⚠️ note at the end of the file, no header bullet ·
     qualified as within intent: Q2(a) routes a drifted ADR coordinate to a note; owner ruling C
     (*"A pending worklist still sends readers to those line numbers"*) decides the class — `0273` has not
     run; the measured rule places it (the header spot is blocked by correct citations to the file's
     correction-note heading, and every spot above its historical-ADRs bullet by a mention of that bullet
     that a shift would make false — so the end of the file is the only safe spot).
     ⚠️ Flagged in the return; reversible by deleting the appended block.
  4. **R3** · ADR-010: header fifth-append line and the §Context note (both this row's own uncommitted text)
     reworded to name the supersession, the architect-consult origin of the overridden judgement, that the
     owner was not shown it, and §Related's first-bullet range; a back-pointer block appended after the
     2026-09-03 note at the end of §Related (that note byte-identical) · owner ruling A ("Keep, add
     back-pointer (Rec)"); append-only against the before-copy.
  5. **R4** · ADR-013 note: *"carries a `../reports/` path"* → names both path forms. ADR-009 note: title
     scoped to pointers into ADR-008 and `architecture.md`, plus a scope sentence saying the source-file
     pointers were not assessed and the init-script ones now land on unrelated lines · verified CORRECT,
     this row's own note text, mechanical; append-only against the before-copies.
  6. **R5** · DI-010 / DI-094 reclassed mentioned → drifted, frozen (pending worklist); ADR-028 gets the
     full form (header `Corrections` bullet + a note under Required follow-ups item 2). DI-004 relabelled
     unresolvable, reported (treatment unchanged) · owner ruling C ("Add a drift note (Rec)"); placement by
     the measured rule (only in-scope coordinate into ADR-028 is the cancelled `0323` row's specimen quote,
     which a shift does not falsify).
  7. **R6** · `0273` brief § Verification step 4: the orphaned bare L373-375 token → *"§7 flow 4's
     "Degradation is loud and mandatory:" citation cluster"*; premise stays reported (D4) · verified CORRECT,
     mechanical, restores the anchor the R-DI repair removed; only the coordinate token was replaced (by anchor text), the sentence around it is byte-identical.

## Step 0: baseline and gate — opened 2026-09-15T0722Z

### 0.1 Baseline

- HEAD `d8ef596` (commit "Sprint push", 2026-09-14). `date -u`: Tue Sep 15 2026, 07h22m36s UTC.
- `plan.md` `git hash-object` = `809db7c330ce70849504803c025a879008bbdb24` (matches the driver's blob).
- Pre-existing dirty paths at Step 0 (none of them edited by this row yet):

```
 M ai-agents/knowledge-base/architecture.md
 M ai-agents/knowledge-base/conventions/dual-home-parity.md
 M ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md
 M ai-agents/sprints/backlog.md
 M ai-agents/sprints/sprint-9.md
 M ai-agents/tasks/backlog/0135-add-producer-only-reconcile-mode-to-task-done/brief.md
 M ai-agents/tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md
 M ai-agents/tasks/backlog/0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md
 M ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md
RM ai-agents/tasks/backlog/0134-.../brief.md -> ai-agents/tasks/done/0134-.../brief.md
RM ai-agents/tasks/backlog/0221-.../brief.md -> ai-agents/tasks/done/0221-.../brief.md
RM ai-agents/tasks/backlog/0388-.../brief.md -> ai-agents/tasks/done/0388-.../brief.md
RM ai-agents/tasks/backlog/0389-.../brief.md -> ai-agents/tasks/done/0389-.../brief.md
RM ai-agents/tasks/backlog/0390-.../brief.md -> ai-agents/tasks/done/0390-.../brief.md
RM ai-agents/tasks/backlog/0392-.../brief.md -> ai-agents/tasks/done/0392-.../brief.md
 M claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md
 M claude/scaffold/ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md
 M claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md
 M claude/skills/fkit-sprint-cancelled/SKILL.md
 M claude/skills/fkit-sprint-done/SKILL.md
 M claude/skills/fkit-sprint-ship-loop/SKILL.md
 M claude/structure-manifest.tsv
 M test/dashboard-contract.test.js
 M test/prove-red.sh
?? ai-agents/knowledge-base/decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md
?? ai-agents/tasks/backlog/0393-.../plan.md
?? ai-agents/tasks/backlog/0395-re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout-and-its-comment/brief.md
?? ai-agents/tasks/backlog/0396-repair-the-bare-claude-directory-references-0390-missed-with-a-two-audience-fix/brief.md
?? ai-agents/tasks/done/{0134,0221,0388,0389,0390,0392}-.../{plan,review,worklog}.md   (18 files)
```

(Folder names elided with `...` for width; the full list was captured with `git status --porcelain
--untracked-files=all`.)

- Three of this row's likely target files were **already dirty** before this row: `architecture.md`
  (0392), `ai-agents/sprints/backlog.md`, `ai-agents/sprints/sprint-9.md`, plus `0393`'s own brief and
  `test/dashboard-contract.test.js`. Our edits to them are attributed by before-copy diff only.

### 0.2 Working dirs and hashes

- Created `.fkit/tmp/0393/{before,census,dash}/` (gitignored).
- sha256 `ai-agents/knowledge-base/architecture.md` at Step 0 =
  `1b39804590cdaaccfc230e13aa66849a22a9694a69ef3db6b8dc863e01324ecc`.

### 0.3 The census, as run

Exclusion pathspecs per Q1(a), in a shell array `EX`:

```
T=ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class
EX=(":(exclude)ai-agents/wiki-vault/*" ":(exclude)ai-agents/tasks/done/*" ":(exclude)ai-agents/tasks/cancelled/*" \
    ":(exclude)ai-agents/sprints/done/*" ":(exclude)ai-agents/sprints/reviews/*" ":(exclude)test/fixtures/*" \
    ":(exclude)$T/plan.md" ":(exclude)$T/worklog.md" ":(exclude)$T/review.md")
git grep --untracked -oihE 'adr-[0-9]{3}:[0-9]+' -- . "${EX[@]}" | wc -l          # occurrences
git grep --untracked -liE  'adr-[0-9]{3}:[0-9]+' -- . "${EX[@]}" | wc -l          # files
git grep --untracked -noiE 'adr-[0-9]{3}:[0-9]+' -- . "${EX[@]}" > .fkit/tmp/0393/census/E.txt
git grep --untracked -noiE 'adr-[0-9]{3}:[0-9]+(,[0-9-]+)*' -- . "${EX[@]}" > .fkit/tmp/0393/census/E-full.txt
```

Results (HEAD `d8ef596` + dirty tree, 2026-09-15T0722Z):

| Scope | Occurrences / files |
|---|---|
| **In-scope, case-insensitive (the declared command + Q1 pathspecs)** | **119 / 24** |
| In-scope, E1 full pattern with comma tail (match count) | 119 matches; **130 coordinates** after splitting 11 comma tails |
| In-scope, uppercase-only (case-sensitive `ADR-`) | 55 |
| In-scope, lowercase-only (case-sensitive `adr-`) | 64 |
| Whole repo, `--untracked`, case-insensitive | 489 / 71 |
| Whole repo, tracked-only, case-insensitive | 489 / 71 (no untracked file holds a match today) |
| Whole repo, case-sensitive uppercase | 150 / 39 |
| Whole repo, lowercase-only | 339 |
| `claude/` | ✅ **0** (stated positively: `git grep --untracked -oihE 'adr-[0-9]{3}:[0-9]+' -- claude` returns nothing) |
| Loose pattern `adr-[0-9]{3}:[0-9,-]*`, in-scope | 229 (so **110** loose-pattern false positives, mostly `ADR-NNN:` title prose) |
| Loose pattern, whole repo | 803 |
| Excluded: `ai-agents/wiki-vault/` | 28 / 5 |
| Excluded: `ai-agents/tasks/done/` | 283 / 36 |
| Excluded: `ai-agents/tasks/cancelled/` | 28 / 1 (the cancelled `0323` brief) |
| Excluded: `ai-agents/sprints/done/` | 16 / 2 (`sprint-2.md` 11, `sprint-6.md` 5) |
| Excluded: `ai-agents/sprints/reviews/` | 3 / 1 |
| Excluded: `test/fixtures/` | 12 / 2 |
| Excluded: this row's `plan.md` | 0 / 0 |

⛔ **These numbers disagree with every earlier figure** (`0323`'s 66; 110/27 of 2026-09-13; 117/29 at
split time; 466/71 in the brief's 2026-09-14 ruling table). That is expected: each earlier figure had a
different scope or date, and the whole-repo figure has since grown by the closed tasks' worklogs and the
Sprint 9 artifacts. The earlier figures were not "wrong measurements of today"; they are dated.

Comma tails (11): ADR-013 L167 (2: `ADR-007` 29,123 and `ADR-009` 22,131); `backlog.md` L355 (2);
`0393` brief L253 (2) and L266 (2); `0394` brief L220, L221, L466 (1 each).

Raw census (E1 full pattern, in-scope), exactly as output:

```
ai-agents/knowledge-base/architecture.md:129:ADR-008:85
ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md:14:adr-008:54
ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md:7:adr-008:106
ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md:32:adr-008:106
ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md:120:adr-008:114
ai-agents/knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md:12:adr-001:22
ai-agents/knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md:13:adr-001:26
ai-agents/knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md:15:adr-001:40
ai-agents/knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md:24:adr-001:27
ai-agents/knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md:167:ADR-007:29,123
ai-agents/knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md:167:ADR-009:22,131
ai-agents/knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md:167:ADR-010:130
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:13:ADR-008:52
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:26:ADR-008:85
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:102:ADR-008:85
ai-agents/knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md:10:adr-019:97
ai-agents/knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md:379:adr-008:49
ai-agents/knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md:379:adr-009:60
ai-agents/knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md:379:adr-016:73
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:37:adr-001:9
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:43:adr-001:26
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:45:adr-001:51
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:54:adr-008:106
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:56:adr-008:114
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:59:adr-008:119
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:60:adr-008:108
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:69:adr-008:72
ai-agents/knowledge-base/reports/2026-07-14-migration-mechanism.md:353:adr-013:160
ai-agents/knowledge-base/reports/2026-07-14-migration-mechanism.md:614:adr-013:160
ai-agents/knowledge-base/reports/2026-07-14-shared-instructions-layer.md:255:adr-012:21
ai-agents/knowledge-base/reports/2026-07-14-shared-instructions-layer.md:276:adr-012:92
ai-agents/knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md:57:adr-018:72
ai-agents/knowledge-base/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md:255:adr-019:138
ai-agents/knowledge-base/reports/2026-07-18-mutation-testing-library-adoption.md:46:adr-014:89
ai-agents/knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md:1410:adr-034:148
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-2.md:30:adr-010:30
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-2.md:30:adr-010:73
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-2.md:31:adr-010:26
ai-agents/sprints/backlog.md:224:adr-022:44
ai-agents/sprints/backlog.md:249:adr-008:106
ai-agents/sprints/backlog.md:309:adr-015:220
ai-agents/sprints/backlog.md:309:adr-042:317
ai-agents/sprints/backlog.md:311:adr-015:220
ai-agents/sprints/backlog.md:311:adr-042:317
ai-agents/sprints/backlog.md:313:ADR-014:18
ai-agents/sprints/backlog.md:313:ADR-026:48
ai-agents/sprints/backlog.md:313:ADR-014:18
ai-agents/sprints/backlog.md:314:adr-015:220
ai-agents/sprints/backlog.md:314:adr-042:317
ai-agents/sprints/backlog.md:314:ADR-014:18
ai-agents/sprints/backlog.md:314:ADR-026:48
ai-agents/sprints/backlog.md:355:ADR-013:167
ai-agents/sprints/backlog.md:355:ADR-013:167
ai-agents/sprints/backlog.md:355:ADR-007:29,123
ai-agents/sprints/backlog.md:355:ADR-009:22,131
ai-agents/sprints/backlog.md:355:ADR-010:130
ai-agents/sprints/backlog.md:355:ADR-007:29
ai-agents/sprints/backlog.md:355:ADR-007:123
ai-agents/sprints/backlog.md:355:ADR-010:130
ai-agents/sprints/backlog.md:355:ADR-009:131
ai-agents/sprints/backlog.md:355:ADR-009:22
ai-agents/sprints/backlog.md:355:ADR-009:131
ai-agents/sprints/backlog.md:355:ADR-009:131
ai-agents/sprints/backlog.md:355:ADR-028:154
ai-agents/sprints/backlog.md:355:ADR-010:26
ai-agents/sprints/backlog.md:355:ADR-010:26
ai-agents/sprints/backlog.md:355:ADR-009:131
ai-agents/sprints/backlog.md:414:ADR-013:167
ai-agents/sprints/backlog.md:415:adr-008:54
ai-agents/sprints/backlog.md:415:adr-001:22
ai-agents/sprints/sprint-9.md:420:ADR-013:167
ai-agents/sprints/sprint-9.md:566:adr-008:54
ai-agents/sprints/sprint-9.md:566:adr-008:106
ai-agents/sprints/sprint-9.md:566:adr-001:22
ai-agents/tasks/backlog/0166-decide-the-enforcement-point-for-run-every-command-you-print/brief.md:34:adr-022:44
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:139:adr-008:49
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:139:adr-009:60
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:139:adr-016:73
ai-agents/tasks/backlog/0278-confirm-or-disprove-the-filename-derived-moved-href-template-in-task-brief/brief.md:96:adr-015:220
ai-agents/tasks/backlog/0278-confirm-or-disprove-the-filename-derived-moved-href-template-in-task-brief/brief.md:97:adr-042:317
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:23:ADR-013:167
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:156:adr-008:54
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:156:adr-001:22
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:179:ADR-010:130
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:191:ADR-013:167
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:253:ADR-007:29,123
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:253:ADR-009:22,131
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:254:ADR-010:130
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:266:ADR-007:29,123
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:266:ADR-009:22,131
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:266:ADR-010:130
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:279:ADR-013:167
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:502:ADR-013:167
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:504:ADR-009:131
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:506:ADR-010:130
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:546:ADR-008:85
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:561:ADR-013:167
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:635:ADR-013:167
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:638:ADR-009:131
ai-agents/tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md:650:ADR-008:85
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:87:adr-008:54
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:87:adr-001:22
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:219:adr-008:49
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:219:adr-009:60
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:220:adr-016:73
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:220:ADR-007:29,123
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:221:ADR-009:22,131
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:221:ADR-010:130
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:223:adr-013:167
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:226:adr-042:379
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:349:ADR-013:167
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:401:ADR-013:167
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:404:adr-012:87
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:405:adr-012:105
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:465:adr-008:49
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:465:adr-009:60
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:465:adr-016:73
ai-agents/tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md:466:ADR-007:29,123
test/dashboard-contract.test.js:1061:ADR-040:158
```

Excluded-path sites (reported, never edited):

```
ai-agents/sprints/done/sprint-2.md:144:ADR-028:154
ai-agents/sprints/done/sprint-2.md:145:ADR-028:154
ai-agents/sprints/done/sprint-2.md:146:ADR-028:165
ai-agents/sprints/done/sprint-2.md:187:ADR-010:26
ai-agents/sprints/done/sprint-2.md:207:adr-022:44
ai-agents/sprints/done/sprint-2.md:212:adr-012:87
ai-agents/sprints/done/sprint-2.md:212:adr-012:105
ai-agents/sprints/done/sprint-2.md:237:adr-008:106
ai-agents/sprints/done/sprint-2.md:2915:adr-016:154
ai-agents/sprints/done/sprint-2.md:3858:adr-012:87
ai-agents/sprints/done/sprint-2.md:3858:adr-012:105
ai-agents/sprints/done/sprint-6.md:306:adr-012:87
ai-agents/sprints/done/sprint-6.md:306:adr-012:105
ai-agents/sprints/done/sprint-6.md:311:ADR-014:18
ai-agents/sprints/done/sprint-6.md:311:ADR-026:48
ai-agents/sprints/done/sprint-6.md:311:ADR-014:18
ai-agents/sprints/reviews/sprint2-shared-instructions-delivery.md:35:adr-016:214
ai-agents/sprints/reviews/sprint2-shared-instructions-delivery.md:246:ADR-016:207
ai-agents/sprints/reviews/sprint2-shared-instructions-delivery.md:344:adr-016:214
ai-agents/wiki-vault/log.md                                                         19 matches
ai-agents/wiki-vault/wiki/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md   1
ai-agents/wiki-vault/wiki/tasks/amend-project-brief-for-the-eighth-role.md          1
ai-agents/wiki-vault/wiki/tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role.md   1
ai-agents/wiki-vault/wiki/tasks/write-the-durable-citation-anchors-convention-page.md   6
test/fixtures/closed-rank-0174-after.md     6 matches
test/fixtures/closed-rank-0174-before.md    6 matches
ai-agents/tasks/cancelled/0323-.../brief.md 28 matches
ai-agents/tasks/done/  283 matches in 36 files
```

`sprints/done/sprint-2.md` holds **11** matches today (the brief's "four" is dated); `sprint-6.md` holds 5.

### 0.4 Group D enumeration (machine-derived)

Outbound, run against `ai-agents/knowledge-base/architecture.md`:

```
== (i)  grep -noE '[A-Za-z0-9_./-]+\.(sh|md|js|mjs|json|tsv|yml|yaml|txt|cjs):[0-9]+(-[0-9]+)?(,[0-9-]+)*'
58:claude/fkit-claude.sh:274-285
58:claude/skills/fkit-review/SKILL.md:57
60:install.sh:32,55-62
61:package.json:3-9
120:claude/agents/fkit-adversarial-reviewer.md:9
151:claude/skills/fkit-review/SKILL.md:12
168:claude/skills-for-role.sh:51
198:claude/fkit-claude.sh:19-21
212:claude/skill-ownership-hook.sh:110-136
317:ai-agents/knowledge-base/conventions/task-status-vocabulary.md:11-21
340:install.sh:55-72
340:claude/fkit-claude.sh:68-74
347:install.sh:34-37
352:install.sh:101
356:install.sh:86-95
359:claude/fkit-claude-init.sh:26-47
382:claude/skills/fkit-review/SKILL.md:38,57
393:claude/fkit-claude.sh:99-123
438:bin/generate-structure-manifest.mjs:259
439:package.json:8
478:install.sh:49
483:install.sh:86-95
522:install.sh:19
576:claude/fkit-claude.sh:36-43
== (ii) grep -noE '[A-Za-z0-9_./-]+:[0-9]+(-[0-9]+)?(,[0-9-]+)*'   (adds, beyond (i))
94:.gitignore:1-20
129:ADR-008:85
192:/fkit-initiate-project:288-307
== (iii) grep -noE '`:[0-9]+[^`]*`|`[^` ]*:[0-9]+[^`]*`'           (adds, beyond (ii))
348:`:42-43`
349:`:49`
350:`:55-72`
397:`:125-165`
```

Inbound, same scope as Q1 (`git grep --untracked ... -- . "${EX[@]}"`):

```
== P1  -noE 'architecture\.md:[0-9]+(-[0-9]+)?(,[0-9-]+)*'
RELEASING.md:72:architecture.md:415
ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md:67:architecture.md:328-333
ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md:95:architecture.md:328-333
ai-agents/knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md:192:architecture.md:397
ai-agents/knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md:64:architecture.md:374-378
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:15:architecture.md:101
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:59:architecture.md:209
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:124:architecture.md:101
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:156:architecture.md:101
ai-agents/knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md:163:architecture.md:4
ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md:32:architecture.md:184-228
ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md:48:architecture.md:105
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:47:architecture.md:239-245
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:84:architecture.md:394
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:87:architecture.md:72,88-90,99
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:88:architecture.md:380-396
ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md:89:architecture.md:82,357-360
ai-agents/knowledge-base/reports/2026-07-14-shared-instructions-layer.md:275:architecture.md:397
ai-agents/knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md:292:architecture.md:43
ai-agents/knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md:297:architecture.md:306-310
ai-agents/knowledge-base/reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:70:architecture.md:4
ai-agents/knowledge-base/reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:71:architecture.md:82
ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md:43:architecture.md:184-228
ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md:158:architecture.md:105
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-2.md:25:architecture.md:145-146
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-4.md:19:architecture.md:498
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-4.md:26:architecture.md:378
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-4.md:31:architecture.md:390
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-4.md:31:architecture.md:390
ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-synthesis.md:413:architecture.md:390
ai-agents/sprints/backlog.md:216:architecture.md:453
ai-agents/sprints/backlog.md:306:architecture.md:49
ai-agents/sprints/backlog.md:306:architecture.md:49
ai-agents/sprints/backlog.md:308:architecture.md:49
ai-agents/sprints/backlog.md:308:architecture.md:375
ai-agents/sprints/backlog.md:313:architecture.md:390
ai-agents/sprints/backlog.md:314:architecture.md:32-33
ai-agents/sprints/backlog.md:315:architecture.md:32-33
ai-agents/sprints/backlog.md:316:architecture.md:54
ai-agents/sprints/backlog.md:319:architecture.md:52
ai-agents/sprints/backlog.md:344:architecture.md:33-35
ai-agents/tasks/backlog/0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md:21:architecture.md:453
ai-agents/tasks/backlog/0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md:123:architecture.md:453
ai-agents/tasks/backlog/0226-repair-the-four-mirror-checklist-in-skills-for-role-shs-header/brief.md:86:architecture.md:25
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:107:architecture.md:49
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:108:architecture.md:272
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:111:architecture.md:372
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:164:architecture.md:373-375
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:218:architecture.md:49
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:283:architecture.md:49
ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md:295:architecture.md:373-375
ai-agents/tasks/backlog/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md:61:architecture.md:388-389
ai-agents/tasks/backlog/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md:232:architecture.md:591-593
ai-agents/tasks/backlog/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md:401:architecture.md:32-33
== P2  architecture.md lines also carrying "line N" / #L / L<n>
ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md:897:| `0018` (done) brief, line 47 — `ai-agents/knowledge-base/architecture.md` | ...
   (one hit; it is "line 47 of the 0018 brief", not a coordinate into architecture.md: 0 real P2 sites)
== P3  -noE 'architecture\.md#[A-Za-z0-9_-]+'
test/reference-integrity.test.js:903:architecture.md#a-heading-that-does-not-exist
   (a deliberate negative fixture string inside a test; not a citation)
== P4  -noE 'architecture\.md[^|§]{0,40}§ ?[0-9]+(\.[0-9]+)*'   (25 hits)
ai-agents/knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md:27:architecture.md` §6
ai-agents/knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md:145:architecture.md` §6
ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md:156:architecture.md:101,§4.1
ai-agents/knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md:186:architecture.md`](../architecture.md) §9.1
ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md:132:architecture.md` §5.2
ai-agents/knowledge-base/reports/2026-07-13-tester-agent-evaluation.md:242:architecture.md`](../architecture.md) §9.1
ai-agents/knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md:63:architecture.md` §4.1
ai-agents/knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md:61:architecture.md §7
ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md:43:architecture.md:184-228` (§5.2
ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md:451:architecture.md` §5.2
ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md:499:architecture.md** (lead role/skill row + **§5.2
ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md:548:architecture.md` §4.2
ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md:561:architecture.md` §4.2
ai-agents/knowledge-base/reports/2026-09-13-does-the-backlog-converge-measuring-k.md:229:architecture.md` §9.5
ai-agents/knowledge-base/reports/2026-09-13-does-the-backlog-converge-measuring-k.md:239:architecture.md` §9.1
ai-agents/sprints/backlog.md:293:architecture.md §9.1
ai-agents/sprints/backlog.md:294:architecture.md §6
ai-agents/sprints/backlog.md:298:architecture.md §11
ai-agents/sprints/backlog.md:388:architecture.md` §9.5
ai-agents/sprints/backlog.md:398:architecture.md` §9.1
ai-agents/sprints/backlog.md:413:architecture.md` prose repair — §9.1
ai-agents/sprints/sprint-9.md:167:architecture.md` §9.1
ai-agents/sprints/sprint-9.md:414:architecture.md` prose repair — §9.1
ai-agents/tasks/backlog/0240-record-the-adr-for-the-closed-rank-guards-baseline/brief.md:49:architecture.md`** — §9.1
ai-agents/tasks/backlog/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md:241:architecture.md` §5
```

Counts: outbound 24 (i) + 3 (ii-only) + 4 (iii-only) = 31 match rows; inbound P1 55 match rows, P2 0 real,
P3 0 real, P4 25.

### 0.5 Dashboard before-captures

```
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md > .fkit/tmp/0393/dash/backlog.before.txt    # exit 0
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-9.md > .fkit/tmp/0393/dash/sprint-9.before.txt  # exit 0
84d7eed99b3d616ae675667f99215d2ad0d58b32ee8d336c213a366d34c5d81e  .fkit/tmp/0393/dash/backlog.before.txt
625855fa3c40c9310fc4ff6cdff2cc9cbb00f7e47bb7f1e3bec9d48f1b1b6d0c  .fkit/tmp/0393/dash/sprint-9.before.txt
```

### 0.6 Gate

```
node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
ℹ tests 43
ℹ pass 43
ℹ fail 0
```

**0.6b Baseline `npm test`** (`node --test test/*.test.js && bash test/prove-red.sh`): exit 0.
Node half re-run alone for counts:

```
ℹ tests 967
ℹ suites 24
ℹ pass 967
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
```

`prove-red.sh` tail: "✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED
assertion." (39 mutations listed.)

### 0.7 Site IDs

`E-001…E-130`, one per coordinate, in census order (path, then line, then left-to-right); the 11 comma
tails are split into consecutive IDs; ranges stay one ID. `DO-`/`DI-` IDs are assigned at T-DO / T-DI
from the 0.4 lists. Step-0 line numbers are identity labels, never pointers.

Step 0 closed 2026-09-15T0740Z. No file edited. No before-copy taken yet (no first edit yet).

## Phase T-E: Group E triage — opened 2026-09-15T0745Z (no edits)

Method per site: read the citing context; resolve the intended referent by reading (and, where the
target file changed, by reading the target at the commit the citing line was written, found with
`git blame` / `git show <commit>:<path>`); record the referent as heading + quoted fragment; apply the
brief's test ("replace the number with the correct one — does the sentence become false?").

Path legend: `kb/` = `ai-agents/knowledge-base/`; `sprints/…` and `tasks/…` are under `ai-agents/`;
task and ADR slugs elided with `…`. "target L<n>" = what the cited line holds today.

### Totals

| Class | Coordinates |
|---|---|
| correct | 31 |
| drifted, live | **0** |
| drifted, frozen | 26 (11 in ADRs, 15 in dated reports) |
| mentioned | 73 |
| mention? | **0** |
| **Total** | **130** (= the comma-split coordinate count; 119 census matches + 11 comma tails) |

### Progress ledger

| ID | Path | Step-0 L | Match | Class | Intended referent (heading + quoted fragment) | Treatment | Status | Test answer | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| E-001 | `kb/architecture.md` | L129 | ADR-008 L85 | correct | ADR-008 §Consequences, residual risks: "*Bash escape hatch:* a tool allowlist without Write/Edit does not stop `Bash` from writing" | leave (X5, step 22) | triaged | NO | target L85 reads that bullet |
| E-002 | `kb/decisions/adr-009-….md` | L14 | adr-008 L54 | drifted, frozen | ADR-008 §"Options considered": "**Port alongside Omnigent (chosen)** — keeps the working Omnigent path as fallback while the native port proves itself" | ⚠️ note (Q2) — PLACEMENT CONFLICT P-009 | triaged | NO | target L54 now reads "the lead reviewer *keeps* Write/Edit"; referent now L62-63; was L53-54 at `c1cc042` (ADR-009 was born in `5d3b4e0`, the commit that inserted 9 lines above it). Quoted words "no flavor is deleted…" appear nowhere in ADR-008 — claim observation, reported not fixed (D4) |
| E-003 | `kb/decisions/adr-010-….md` | L7 | adr-008 L106-120 | drifted, frozen | ADR-008 §"Amendment: peer consults and role access": "**Role access — three explicit paths.**" through the "Consequences of "hats for all six"" bullets | ⚠️ note (Q2) — PLACEMENT CONFLICT P-010 | triaged | NO | target L106 now reads "`fkit-wiki` stay **leaves**"; referent now L115-129 (same +9 shift, `c1cc042` → `5d3b4e0`) |
| E-004 | `kb/decisions/adr-010-….md` | L32 | adr-008 L106-108 | drifted, frozen | ADR-008 same paragraph: "(1) **Hat skills** `/fkit-agent-<role>` for all six roles: the session reads `.claude/agents/fkit-<role>.md`" | ⚠️ note (Q2) — PLACEMENT CONFLICT P-010 | triaged | NO | target L106 is the leaves sentence; referent now L115-117 |
| E-005 | `kb/decisions/adr-010-….md` | L120 | adr-008 L114 | drifted, frozen | ADR-008 "Consequences of "hats for all six"": "*Reviewer independence* is a property of a **fresh context**, not of the prompt" | ⚠️ note (Q2) — PLACEMENT CONFLICT P-010 | triaged | NO | target L114 is blank; referent now L123 |
| E-006 | `kb/decisions/adr-011-….md` | L12 | adr-001 L22-23 | drifted, frozen | ADR-001 §Decision: "`package.json` remains metadata-only — no `bin`, no `scripts`, no `dependencies`" | ⚠️ note (Q2) — placement safe (no in-scope target into ADR-011) | triaged | NO | target L22 is ">" inside the ⚠ banner; referent now L41-42 (+19: banner inserted in `7fb8904`, the same commit that added ADR-011) |
| E-007 | `kb/decisions/adr-011-….md` | L13 | adr-001 L26 | drifted, frozen | ADR-001 §Decision: "**stop bumping/publishing `package.json`'s `version`**" | ⚠️ note (Q2) — placement safe | triaged | NO | target L26 is "## Context"; referent now L45 |
| E-008 | `kb/decisions/adr-011-….md` | L15 | adr-001 L40-41 | drifted, frozen | ADR-001 §"Options considered": "keeping the npm listing (name/description/keywords) has discoverability value" | ⚠️ note (Q2) — placement safe | triaged | NO | target L40 is blank; referent now L59-60 |
| E-009 | `kb/decisions/adr-011-….md` | L24 | adr-001 L27-29 | drifted, frozen | ADR-001 §Decision: "mild trap — it invites `npx fkit`" | ⚠️ note (Q2) — placement safe | triaged | NO | target L27 is blank; referent now L46-48 |
| E-010 | `kb/decisions/adr-013-….md` | L167 | ADR-007 L29 (coord 1 of "ADR-007 L29,123") | drifted, frozen | ADR-007 §Context: "Full investigation, constraints, and the options comparison behind this decision are recorded in" + the eval report path | dated worklist (Q3 b): original byte-identical; one ⚠️ note — PLACEMENT CONFLICT P-013 | triaged | NO per coordinate; ruled a dated worklist (Q3 b) | target L29 reads "point, not a one-off fluke"; at `a8cb0e7` (ADR-013 added) L29 was the eval-report path line; referent now L33 |
| E-011 | `kb/decisions/adr-013-….md` | L167 | ADR-007 L123 (coord 2 of "ADR-007 L29,123") | drifted, frozen | ADR-007 §Related: "— the full evaluation this ADR acts on" | dated worklist (Q3 b): original byte-identical; one ⚠️ note — PLACEMENT CONFLICT P-013 | triaged | NO per coordinate; ruled a dated worklist (Q3 b) | target L123 reads "divergence) — fix the check"; at `a8cb0e7` L123 was the eval-report bullet; referent now L127 |
| E-012 | `kb/decisions/adr-013-….md` | L167 | ADR-009 L22 (coord 1 of "ADR-009 L22,131") | correct | ADR-009 §Context: "found the Omnigent-side" doc-drift-audit link line | leave; note marks it correct | triaged | NO | target L22 reads the doc-drift-audit link (to the reports folder) followed by "found the Omnigent-side" — same at `a8cb0e7` |
| E-013 | `kb/decisions/adr-013-….md` | L167 | ADR-009 L131 (coord 2 of "ADR-009 L22,131") | correct | ADR-009 §Related: "- Evidence: [`2026-07-11-doc-drift-audit.md`]" | leave; note marks it correct (step 16) | triaged | NO | target L131 reads "- Evidence:" plus the doc-drift-audit link into the reports folder |
| E-014 | `kb/decisions/adr-013-….md` | L167 | ADR-010 L130 | drifted, frozen | ADR-010 §Related: "- Evidence:" plus the doc-drift-audit link, then (§"An open design" | dated worklist (Q3 b): original byte-identical; one ⚠️ note — PLACEMENT CONFLICT P-013 | triaged | NO per coordinate; ruled a dated worklist (Q3 b) | target L130 reads "**One real inconsistency surfaced by the drift audit**"; at `a8cb0e7` L130 was the Evidence bullet; referent now L351 |
| E-015 | `kb/decisions/adr-022-….md` | L13 | ADR-008 L52-53 | correct | ADR-008 §Decision: "**Tool allowlists add structural enforcement** on top of the prompt rules" | leave | triaged | NO | target L52-53 reads that bullet |
| E-016 | `kb/decisions/adr-022-….md` | L26 | ADR-008 L85 | correct | ADR-008 residual risk "*Bash escape hatch:*" | leave | triaged | NO | target L85 |
| E-017 | `kb/decisions/adr-022-….md` | L102 | ADR-008 L85 | correct | ADR-008 residual risk "*Bash escape hatch:*" | leave | triaged | NO | target L85 |
| E-018 | `kb/decisions/adr-025-….md` | L10 | adr-019 L97 | correct | ADR-019 §Decision 5: "**The done-gate is unchanged and owner-only.**" | leave | triaged | NO | target L97 reads that item |
| E-019 | `kb/decisions/adr-042-….md` | L379 | adr-008 L49 | correct | ADR-008 sandbox-flag statement: "`codex exec --sandbox read-only --cd "$PWD" -`" | leave | triaged | NO (a pointer list of sites; `0394` calls it a specimen list — either reading leaves it byte-identical) | target ADR-008 L49 reads that text |
| E-020 | `kb/decisions/adr-042-….md` | L379 | adr-009 L60 | correct | ADR-009 sandbox-flag statement: "(`codex exec --sandbox read-only`) for genuine model diversity" | leave | triaged | NO (a pointer list of sites; `0394` calls it a specimen list — either reading leaves it byte-identical) | target ADR-009 L60 reads that text |
| E-021 | `kb/decisions/adr-042-….md` | L379 | adr-016 L73 | correct | ADR-016 sandbox-flag statement: "runs `codex exec --sandbox read-only --cd "$PWD"`" | leave | triaged | NO (a pointer list of sites; `0394` calls it a specimen list — either reading leaves it byte-identical) | target ADR-016 L73 reads that text |
| E-022 | `kb/reports/2026-07-11-doc-drift-audit.md` | L37 | adr-001 L9-12 | drifted, frozen | ADR-001 §Context: "declares only npm registry metadata" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | range was L9-12 pre-banner; referent now L28-31 |
| E-023 | `kb/reports/2026-07-11-doc-drift-audit.md` | L43 | adr-001 L26-29 | drifted, frozen | ADR-001 §Decision: "stop bumping/publishing" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | referent now L45-48 |
| E-024 | `kb/reports/2026-07-11-doc-drift-audit.md` | L45 | adr-001 L51-53 | drifted, frozen | ADR-001 §Consequences: "Residual risk / "re-raise only if":" … "otherwise giving `package.json` install semantics" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | referent now L70-72 |
| E-025 | `kb/reports/2026-07-11-doc-drift-audit.md` | L54 | adr-008 L106-108 | drifted, frozen | ADR-008: "(1) **Hat skills** `/fkit-agent-<role>` for all six roles" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | referent now L115-117 |
| E-026 | `kb/reports/2026-07-11-doc-drift-audit.md` | L56 | adr-008 L114-117 | drifted, frozen | ADR-008: "`/fkit-agent-reviewer` therefore runs an independence check first" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | referent now L123-126 |
| E-027 | `kb/reports/2026-07-11-doc-drift-audit.md` | L59 | adr-008 L119-120 | drifted, frozen | ADR-008: "worn as the `/fkit-agent-wiki` hat" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | referent now L127-129 |
| E-028 | `kb/reports/2026-07-11-doc-drift-audit.md` | L60 | adr-008 L108-109 | drifted, frozen | ADR-008: "(3) **`fkit claude <role>`** → `claude --agent fkit-<role>`" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | referent now L117-118 |
| E-029 | `kb/reports/2026-07-11-doc-drift-audit.md` | L69 | adr-008 L72-74 | drifted, frozen | ADR-008 §Consequences: "**Scope of prior ADRs narrowed:**" … "are **omnigent-path-only** from now on" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | referent now L81-83 |
| E-030 | `kb/reports/2026-07-14-migration-mechanism.md` | L353 | adr-013 L160-183 | correct | ADR-013 "## Consequences" section | leave | triaged | NO (dated report; Q2 a classes it frozen) | target L160 is "## Consequences"; section ends L183-184 |
| E-031 | `kb/reports/2026-07-14-migration-mechanism.md` | L614 | adr-013 L160-183 | correct | ADR-013 "## Consequences" section | leave | triaged | NO (dated report; Q2 a classes it frozen) | same as above |
| E-032 | `kb/reports/2026-07-14-shared-instructions-layer.md` | L255 | adr-012 L21-23 | drifted, frozen | ADR-012 §Context, "What the mechanism actually is": "skill availability in ANY context (session or spawned consult)" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | at `d9e30e1` L21; now L34-36 |
| E-033 | `kb/reports/2026-07-14-shared-instructions-layer.md` | L276 | adr-012 L92 | drifted, frozen | ADR-012 §Decision: "4. **The `PreToolUse` hook stays deferred — but the deferral is now priced.**" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | at `d9e30e1` L92; now L133 |
| E-034 | `kb/reports/2026-07-17-design-task-ship-loop-skill.md` | L57 | adr-018 L72-84 | drifted, frozen | ADR-018 §Decision: "3. **Decision 4 moves from "deferred, priced" to ADOPTED: the `PreToolUse` `Skill`-tool gate.**" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | at `a3bdab5` L72-84; now L74-86 |
| E-035 | `kb/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md` | L255 | adr-019 L138 | drifted, frozen | ADR-019 re-raise list: "**The owner later wants relayed-consent close-out**" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | now L162 |
| E-036 | `kb/reports/2026-07-18-mutation-testing-library-adoption.md` | L46 | adr-014 L89-91 | correct | ADR-014 "### 4. Zero devDependencies, no lockfile, no `node_modules`" | leave | triaged | NO (dated report; Q2 a classes it frozen) | target L89 is that heading |
| E-037 | `kb/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` | L1410 | adr-034 L148-150 | correct | ADR-034 re-raise: "A task's own record becomes **load-bearing for another consumer**" | leave | triaged | NO (dated report; Q2 a classes it frozen) | target L148 reads that bullet |
| E-038 | `kb/reports/2026-08-14-backlog-triage-part-2.md` | L30 | adr-010 L30-32 | drifted, frozen | ADR-010 §Context: "to `"off"`: hidden from the `/` menu **and unrunnable by name**" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | at `75663a8` L30-32; now L41-43 |
| E-039 | `kb/reports/2026-08-14-backlog-triage-part-2.md` | L30 | adr-010 L73 | drifted, frozen | ADR-010 §Context note: "(Separately, and deliberately **not** corrected in this pass" | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | now L112 |
| E-040 | `kb/reports/2026-08-14-backlog-triage-part-2.md` | L31 | adr-010 L26-32 | drifted, frozen | ADR-010 §Context: "**`fkit` is a deterministic role menu.**" through the skillOverrides item | leave byte-identical; report (Q2 a) | triaged | NO (dated report; Q2 a classes it frozen) | at `75663a8` L26-32; now L37-43 |
| E-041 | `sprints/backlog.md` | L224 | adr-022 L44 | mentioned | n/a — mention: `0166` row, "**shifted citations**" — the coordinate is a specimen of the shifted-citation defect in the vault log | leave byte-identical | triaged | YES | document about the defect; `0166` row, "**shifted citations**" — the coordinate is a specimen of the shifted-citation defect in the vault log |
| E-042 | `sprints/backlog.md` | L249 | adr-008 L106-120 | mentioned | n/a — mention: closed `0197` row lists ADR-010's own citation strings as never-assessed work items (subject-of-work) | leave byte-identical | triaged | YES | document about the defect; closed `0197` row lists ADR-010's own citation strings as never-assessed work items (subject-of-work) |
| E-043 | `sprints/backlog.md` | L309 | adr-015 L220 | correct | ADR-015 "## Amendment — 2026-07-14: a supporting fact was falsified by implementation; **the decision stands**" | leave | triaged | NO | row `0276` (Done) cites it as precedent; target L220 is that heading |
| E-044 | `sprints/backlog.md` | L309 | adr-042 L317 | correct | ADR-042 "## Correction note — 2026-08-11: the site count is five under `claude/`" | leave | triaged | NO | precedent; target L317 is that heading |
| E-045 | `sprints/backlog.md` | L311 | adr-015 L220 | correct | ADR-015 "## Amendment — 2026-07-14: a supporting fact was falsified by implementation; **the decision stands**" | leave | triaged | NO | row `0278` (open) cites it as precedent; target L220 is that heading |
| E-046 | `sprints/backlog.md` | L311 | adr-042 L317 | correct | ADR-042 "## Correction note — 2026-08-11: the site count is five under `claude/`" | leave | triaged | NO | precedent; target L317 is that heading |
| E-047 | `sprints/backlog.md` | L313 | ADR-014 L18 | correct | ADR-014 §Context: "fkit has **zero automated verification** — no CI" | leave | triaged | NO | row names other no-CI sites; target L18 reads that text |
| E-048 | `sprints/backlog.md` | L313 | ADR-026 L48 | correct | ADR-026: "there is **no `.github/workflows/` in the tree at all**" | leave | triaged | NO | row names other no-CI sites; target L48 reads that text |
| E-049 | `sprints/backlog.md` | L313 | ADR-014 L18 | correct | ADR-014 §Context: "fkit has **zero automated verification** — no CI" | leave | triaged | NO | row names other no-CI sites; target L18 reads that text |
| E-050 | `sprints/backlog.md` | L314 | adr-015 L220 | correct | ADR-015 "## Amendment — 2026-07-14: … **the decision stands**" | leave | triaged | NO | precedent; target L220 |
| E-051 | `sprints/backlog.md` | L314 | adr-042 L317 | correct | ADR-042 "## Correction note — 2026-08-11" | leave | triaged | NO | precedent; target L317 |
| E-052 | `sprints/backlog.md` | L314 | ADR-014 L18 | correct | ADR-014 §Context: "fkit has **zero automated verification** — no CI" | leave | triaged | NO | row names other no-CI sites; target L18 reads that text |
| E-053 | `sprints/backlog.md` | L314 | ADR-026 L48 | correct | ADR-026: "there is **no `.github/workflows/` in the tree at all**" | leave | triaged | NO | row names other no-CI sites; target L48 reads that text |
| E-054 | `sprints/backlog.md` | L355 | ADR-013 L167 | mentioned | n/a — mention: cancelled `0323` row (about this very class): quoted option description "repair ADR-013 L167 by heading + fragment" | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): quoted option description "repair ADR-013 L167 by heading + fragment" |
| E-055 | `sprints/backlog.md` | L355 | ADR-013 L167 | mentioned | n/a — mention: cancelled `0323` row (about this very class): "`ADR-013` L167 carries FIVE coordinates" — the site is the subject | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): "`ADR-013` L167 carries FIVE coordinates" — the site is the subject |
| E-056 | `sprints/backlog.md` | L355 | ADR-007 L29 (coord 1 of "ADR-007 L29,123") | mentioned | n/a — mention: cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim |
| E-057 | `sprints/backlog.md` | L355 | ADR-007 L123 (coord 2 of "ADR-007 L29,123") | mentioned | n/a — mention: cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim |
| E-058 | `sprints/backlog.md` | L355 | ADR-009 L22 (coord 1 of "ADR-009 L22,131") | mentioned | n/a — mention: cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim |
| E-059 | `sprints/backlog.md` | L355 | ADR-009 L131 (coord 2 of "ADR-009 L22,131") | mentioned | n/a — mention: cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim |
| E-060 | `sprints/backlog.md` | L355 | ADR-010 L130 | mentioned | n/a — mention: cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): quotes ADR-013's bullet verbatim |
| E-061 | `sprints/backlog.md` | L355 | ADR-007 L29 | mentioned | n/a — mention: cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" |
| E-062 | `sprints/backlog.md` | L355 | ADR-007 L123 | mentioned | n/a — mention: cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" |
| E-063 | `sprints/backlog.md` | L355 | ADR-010 L130 | mentioned | n/a — mention: cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" |
| E-064 | `sprints/backlog.md` | L355 | ADR-009 L131 | mentioned | n/a — mention: cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" |
| E-065 | `sprints/backlog.md` | L355 | ADR-009 L22 | mentioned | n/a — mention: cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" |
| E-066 | `sprints/backlog.md` | L355 | ADR-009 L131 | mentioned | n/a — mention: cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): dated firsthand check result "have all drifted onto unrelated prose" / "STILL LANDS" |
| E-067 | `sprints/backlog.md` | L355 | ADR-009 L131 | mentioned | n/a — mention: cancelled `0323` row (about this very class): "live proof correct ones exist" specimen | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): "live proof correct ones exist" specimen |
| E-068 | `sprints/backlog.md` | L355 | ADR-028 L154 | mentioned | n/a — mention: cancelled `0323` row (about this very class): `sprint-2.md` site list, what those rows say | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): `sprint-2.md` site list, what those rows say |
| E-069 | `sprints/backlog.md` | L355 | ADR-010 L26 | mentioned | n/a — mention: cancelled `0323` row (about this very class): `sprint-2.md` site list, what those rows say | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): `sprint-2.md` site list, what those rows say |
| E-070 | `sprints/backlog.md` | L355 | ADR-010 L26 | mentioned | n/a — mention: cancelled `0323` row (about this very class): `sprint-2.md` site list, what those rows say | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): `sprint-2.md` site list, what those rows say |
| E-071 | `sprints/backlog.md` | L355 | ADR-009 L131 | mentioned | n/a — mention: cancelled `0323` row (about this very class): verification-step subject | leave byte-identical | triaged | YES | document about the defect; cancelled `0323` row (about this very class): verification-step subject |
| E-072 | `sprints/backlog.md` | L414 | ADR-013 L167 | mentioned | n/a — mention: `0393` row, OD4 question names the site (subject-of-work) | leave byte-identical | triaged | YES | document about the defect; `0393` row, OD4 question names the site (subject-of-work) |
| E-073 | `sprints/backlog.md` | L415 | adr-008 L54 | mentioned | n/a — mention: `0394` row, "sample literal text" | leave byte-identical | triaged | YES | document about the defect; `0394` row, "sample literal text" |
| E-074 | `sprints/backlog.md` | L415 | adr-001 L22 | mentioned | n/a — mention: `0394` row, "sample literal text" | leave byte-identical | triaged | YES | document about the defect; `0394` row, "sample literal text" |
| E-075 | `sprints/sprint-9.md` | L420 | ADR-013 L167 | mentioned | n/a — mention: `0393` row, OD4 question names the site | leave byte-identical | triaged | YES | document about the defect; `0393` row, OD4 question names the site |
| E-076 | `sprints/sprint-9.md` | L566 | adr-008 L54 | mentioned | n/a — mention: census section, "A sample of the literal text" | leave byte-identical | triaged | YES | document about the defect; census section, "A sample of the literal text" |
| E-077 | `sprints/sprint-9.md` | L566 | adr-008 L106 | mentioned | n/a — mention: census section, "A sample of the literal text" | leave byte-identical | triaged | YES | document about the defect; census section, "A sample of the literal text" |
| E-078 | `sprints/sprint-9.md` | L566 | adr-001 L22 | mentioned | n/a — mention: census section, "A sample of the literal text" | leave byte-identical | triaged | YES | document about the defect; census section, "A sample of the literal text" |
| E-079 | `tasks/backlog/0166-…/brief.md` | L34 | adr-022 L44 | mentioned | n/a — mention: table row "Shifted citations" — specimen of the defect | leave byte-identical | triaged | YES | document about the defect; table row "Shifted citations" — specimen of the defect |
| E-080 | `tasks/backlog/0273-…/brief.md` | L139 | adr-008 L49 | correct | ADR-008 sandbox-flag statement ("codex exec --sandbox read-only") | leave | triaged | NO | exclusion-list pointer; target ADR-008 L49 reads it |
| E-081 | `tasks/backlog/0273-…/brief.md` | L139 | adr-009 L60 | correct | ADR-009 sandbox-flag statement ("codex exec --sandbox read-only") | leave | triaged | NO | exclusion-list pointer; target ADR-009 L60 reads it |
| E-082 | `tasks/backlog/0273-…/brief.md` | L139 | adr-016 L73 | correct | ADR-016 sandbox-flag statement ("codex exec --sandbox read-only") | leave | triaged | NO | exclusion-list pointer; target ADR-016 L73 reads it |
| E-083 | `tasks/backlog/0278-…/brief.md` | L96 | adr-015 L220 | correct | ADR-015 Amendment 2026-07-14 heading | leave | triaged | NO | precedent; target L220 |
| E-084 | `tasks/backlog/0278-…/brief.md` | L97 | adr-042 L317 | correct | ADR-042 Correction note 2026-08-11 heading | leave | triaged | NO | precedent; target L317 |
| E-085 | `tasks/backlog/0393-…/brief.md` | L23 | ADR-013 L167 | mentioned | n/a — mention: Owner field names the OD4 call on the site | leave byte-identical | triaged | YES | document about the defect; Owner field names the OD4 call on the site |
| E-086 | `tasks/backlog/0393-…/brief.md` | L156 | adr-008 L54 | mentioned | n/a — mention: "(a) Specimen" table row, sample list | leave byte-identical | triaged | YES | document about the defect; "(a) Specimen" table row, sample list |
| E-087 | `tasks/backlog/0393-…/brief.md` | L156 | adr-001 L22 | mentioned | n/a — mention: "(a) Specimen" table row, sample list | leave byte-identical | triaged | YES | document about the defect; "(a) Specimen" table row, sample list |
| E-088 | `tasks/backlog/0393-…/brief.md` | L179 | ADR-010 L130 | mentioned | n/a — mention: hypothetical example sentence for the grammatical-role signal | leave byte-identical | triaged | YES | document about the defect; hypothetical example sentence for the grammatical-role signal |
| E-089 | `tasks/backlog/0393-…/brief.md` | L191 | ADR-013 L167 | mentioned | n/a — mention: "both are … in backticks" — lexical-identity statement | leave byte-identical | triaged | YES | document about the defect; "both are … in backticks" — lexical-identity statement |
| E-090 | `tasks/backlog/0393-…/brief.md` | L253 | ADR-007 L29 (coord 1 of "ADR-007 L29,123") | mentioned | n/a — mention: verbatim quote of ADR-013's bullet | leave byte-identical | triaged | YES | document about the defect; verbatim quote of ADR-013's bullet |
| E-091 | `tasks/backlog/0393-…/brief.md` | L253 | ADR-007 L123 (coord 2 of "ADR-007 L29,123") | mentioned | n/a — mention: verbatim quote of ADR-013's bullet | leave byte-identical | triaged | YES | document about the defect; verbatim quote of ADR-013's bullet |
| E-092 | `tasks/backlog/0393-…/brief.md` | L253 | ADR-009 L22 (coord 1 of "ADR-009 L22,131") | mentioned | n/a — mention: verbatim quote of ADR-013's bullet | leave byte-identical | triaged | YES | document about the defect; verbatim quote of ADR-013's bullet |
| E-093 | `tasks/backlog/0393-…/brief.md` | L253 | ADR-009 L131 (coord 2 of "ADR-009 L22,131") | mentioned | n/a — mention: verbatim quote of ADR-013's bullet | leave byte-identical | triaged | YES | document about the defect; verbatim quote of ADR-013's bullet |
| E-094 | `tasks/backlog/0393-…/brief.md` | L254 | ADR-010 L130 | mentioned | n/a — mention: verbatim quote of ADR-013's bullet | leave byte-identical | triaged | YES | document about the defect; verbatim quote of ADR-013's bullet |
| E-095 | `tasks/backlog/0393-…/brief.md` | L266 | ADR-007 L29 (coord 1 of "ADR-007 L29,123") | mentioned | n/a — mention: dated pattern-measurement result (3 hits vs 5 coordinates) | leave byte-identical | triaged | YES | document about the defect; dated pattern-measurement result (3 hits vs 5 coordinates) |
| E-096 | `tasks/backlog/0393-…/brief.md` | L266 | ADR-007 L123 (coord 2 of "ADR-007 L29,123") | mentioned | n/a — mention: dated pattern-measurement result (3 hits vs 5 coordinates) | leave byte-identical | triaged | YES | document about the defect; dated pattern-measurement result (3 hits vs 5 coordinates) |
| E-097 | `tasks/backlog/0393-…/brief.md` | L266 | ADR-009 L22 (coord 1 of "ADR-009 L22,131") | mentioned | n/a — mention: dated pattern-measurement result (3 hits vs 5 coordinates) | leave byte-identical | triaged | YES | document about the defect; dated pattern-measurement result (3 hits vs 5 coordinates) |
| E-098 | `tasks/backlog/0393-…/brief.md` | L266 | ADR-009 L131 (coord 2 of "ADR-009 L22,131") | mentioned | n/a — mention: dated pattern-measurement result (3 hits vs 5 coordinates) | leave byte-identical | triaged | YES | document about the defect; dated pattern-measurement result (3 hits vs 5 coordinates) |
| E-099 | `tasks/backlog/0393-…/brief.md` | L266 | ADR-010 L130 | mentioned | n/a — mention: dated pattern-measurement result (3 hits vs 5 coordinates) | leave byte-identical | triaged | YES | document about the defect; dated pattern-measurement result (3 hits vs 5 coordinates) |
| E-100 | `tasks/backlog/0393-…/brief.md` | L279 | ADR-013 L167 | mentioned | n/a — mention: OD4 question | leave byte-identical | triaged | YES | document about the defect; OD4 question |
| E-101 | `tasks/backlog/0393-…/brief.md` | L502 | ADR-013 L167 | mentioned | n/a — mention: E4 heading names the site (subject-of-work) | leave byte-identical | triaged | YES | document about the defect; E4 heading names the site (subject-of-work) |
| E-102 | `tasks/backlog/0393-…/brief.md` | L504 | ADR-009 L131 | mentioned | n/a — mention: dated measurement "still lands correctly" | leave byte-identical | triaged | YES | document about the defect; dated measurement "still lands correctly" |
| E-103 | `tasks/backlog/0393-…/brief.md` | L506 | ADR-010 L130 | mentioned | n/a — mention: dated measurement "has drifted a second time" | leave byte-identical | triaged | YES | document about the defect; dated measurement "has drifted a second time" |
| E-104 | `tasks/backlog/0393-…/brief.md` | L546 | ADR-008 L85 | mentioned | n/a — mention: X5 names architecture.md's own string | leave byte-identical | triaged | YES | document about the defect; X5 names architecture.md's own string |
| E-105 | `tasks/backlog/0393-…/brief.md` | L561 | ADR-013 L167 | mentioned | n/a — mention: OD4 table row | leave byte-identical | triaged | YES | document about the defect; OD4 table row |
| E-106 | `tasks/backlog/0393-…/brief.md` | L635 | ADR-013 L167 | mentioned | n/a — mention: verification step 15 subject | leave byte-identical | triaged | YES | document about the defect; verification step 15 subject |
| E-107 | `tasks/backlog/0393-…/brief.md` | L638 | ADR-009 L131 | mentioned | n/a — mention: verification step 16 subject | leave byte-identical | triaged | YES | document about the defect; verification step 16 subject |
| E-108 | `tasks/backlog/0393-…/brief.md` | L650 | ADR-008 L85 | mentioned | n/a — mention: verification step 22 subject | leave byte-identical | triaged | YES | document about the defect; verification step 22 subject |
| E-109 | `tasks/backlog/0394-…/brief.md` | L87 | adr-008 L54 | mentioned | n/a — mention: "sample literal text" | leave byte-identical | triaged | YES | document about the defect; "sample literal text" |
| E-110 | `tasks/backlog/0394-…/brief.md` | L87 | adr-001 L22 | mentioned | n/a — mention: "sample literal text" | leave byte-identical | triaged | YES | document about the defect; "sample literal text" |
| E-111 | `tasks/backlog/0394-…/brief.md` | L219 | adr-008 L49 | mentioned | n/a — mention: dated measurement "3 occurrences, all LOWERCASE" | leave byte-identical | triaged | YES | document about the defect; dated measurement "3 occurrences, all LOWERCASE" |
| E-112 | `tasks/backlog/0394-…/brief.md` | L219 | adr-009 L60 | mentioned | n/a — mention: dated measurement "3 occurrences, all LOWERCASE" | leave byte-identical | triaged | YES | document about the defect; dated measurement "3 occurrences, all LOWERCASE" |
| E-113 | `tasks/backlog/0394-…/brief.md` | L220 | adr-016 L73 | mentioned | n/a — mention: dated measurement of the two candidate regions | leave byte-identical | triaged | YES | document about the defect; dated measurement of the two candidate regions |
| E-114 | `tasks/backlog/0394-…/brief.md` | L220 | ADR-007 L29 (coord 1 of "ADR-007 L29,123") | mentioned | n/a — mention: dated measurement of the two candidate regions | leave byte-identical | triaged | YES | document about the defect; dated measurement of the two candidate regions |
| E-115 | `tasks/backlog/0394-…/brief.md` | L220 | ADR-007 L123 (coord 2 of "ADR-007 L29,123") | mentioned | n/a — mention: dated measurement of the two candidate regions | leave byte-identical | triaged | YES | document about the defect; dated measurement of the two candidate regions |
| E-116 | `tasks/backlog/0394-…/brief.md` | L221 | ADR-009 L22 (coord 1 of "ADR-009 L22,131") | mentioned | n/a — mention: dated measurement of the two candidate regions | leave byte-identical | triaged | YES | document about the defect; dated measurement of the two candidate regions |
| E-117 | `tasks/backlog/0394-…/brief.md` | L221 | ADR-009 L131 (coord 2 of "ADR-009 L22,131") | mentioned | n/a — mention: dated measurement of the two candidate regions | leave byte-identical | triaged | YES | document about the defect; dated measurement of the two candidate regions |
| E-118 | `tasks/backlog/0394-…/brief.md` | L221 | ADR-010 L130 | mentioned | n/a — mention: dated measurement of the two candidate regions | leave byte-identical | triaged | YES | document about the defect; dated measurement of the two candidate regions |
| E-119 | `tasks/backlog/0394-…/brief.md` | L223 | adr-013 L167 | mentioned | n/a — mention: "3 pattern hits are FIVE coordinates" | leave byte-identical | triaged | YES | document about the defect; "3 pattern hits are FIVE coordinates" |
| E-120 | `tasks/backlog/0394-…/brief.md` | L226 | adr-042 L379 | mentioned | n/a — mention: names the site's enclosing block | leave byte-identical | triaged | YES | document about the defect; names the site's enclosing block |
| E-121 | `tasks/backlog/0394-…/brief.md` | L349 | ADR-013 L167 | mentioned | n/a — mention: lexical-identity statement | leave byte-identical | triaged | YES | document about the defect; lexical-identity statement |
| E-122 | `tasks/backlog/0394-…/brief.md` | L401 | ADR-013 L167 | mentioned | n/a — mention: "A mention of … has no target path" | leave byte-identical | triaged | YES | document about the defect; "A mention of … has no target path" |
| E-123 | `tasks/backlog/0394-…/brief.md` | L404 | adr-012 L87 | mentioned | n/a — mention: census clustering count | leave byte-identical | triaged | YES | document about the defect; census clustering count |
| E-124 | `tasks/backlog/0394-…/brief.md` | L405 | adr-012 L105 | mentioned | n/a — mention: census clustering count | leave byte-identical | triaged | YES | document about the defect; census clustering count |
| E-125 | `tasks/backlog/0394-…/brief.md` | L465 | adr-008 L49 | mentioned | n/a — mention: candidate-exemption table quotes the site | leave byte-identical | triaged | YES | document about the defect; candidate-exemption table quotes the site |
| E-126 | `tasks/backlog/0394-…/brief.md` | L465 | adr-009 L60 | mentioned | n/a — mention: candidate-exemption table quotes the site | leave byte-identical | triaged | YES | document about the defect; candidate-exemption table quotes the site |
| E-127 | `tasks/backlog/0394-…/brief.md` | L465 | adr-016 L73 | mentioned | n/a — mention: candidate-exemption table quotes the site | leave byte-identical | triaged | YES | document about the defect; candidate-exemption table quotes the site |
| E-128 | `tasks/backlog/0394-…/brief.md` | L466 | ADR-007 L29 (coord 1 of "ADR-007 L29,123") | mentioned | n/a — mention: candidate-exemption table quotes the site | leave byte-identical | triaged | YES | document about the defect; candidate-exemption table quotes the site |
| E-129 | `tasks/backlog/0394-…/brief.md` | L466 | ADR-007 L123 (coord 2 of "ADR-007 L29,123") | mentioned | n/a — mention: candidate-exemption table quotes the site | leave byte-identical | triaged | YES | document about the defect; candidate-exemption table quotes the site |
| E-130 | `test/dashboard-contract.test.js` | L1061 | ADR-040 L158-160 | correct | ADR-040 §3: "⚠️ **Consequence the ruling implies and did not state: an unevidenced rung that no test exercises can ship broken and stay broken.**" | leave (comment text) | triaged | NO | target L158-160 reads it |

### E4 — ADR-013 L167, written decision (Q3 b applied)

- **Five coordinates, five verdicts:** E-010 `ADR-007` 29 drifted · E-011 `ADR-007` 123 drifted ·
  E-012 `ADR-009` 22 correct · E-013 `ADR-009` 131 correct · E-014 `ADR-010` 130 drifted.
- **Live pointer or dated worklist: dated worklist** (owner ruling Q3, option (b), "Dated worklist +
  note (Rec)"). Reason, verified today: the bullet is a to-do written 2026-07-13 ("Inbound links must
  be repaired") and that work has landed — all five lines it names now carry `../reports/` paths ⚠️ *(false as written, R4: ADR-007's two passages carry the repo-root `ai-agents/knowledge-base/reports/` path; the ADR-013 note's wording was corrected in Process-review round 1)*
  (ADR-007 §Context "are recorded in" + the eval report path; ADR-007 §Related "the full evaluation this
  ADR acts on"; ADR-009 §Context doc-drift-audit link; ADR-009 §Related "- Evidence:"; ADR-010 §Related
  "- Evidence:"). A reader following it today is not being sent to open work.
- **ADR-009 L131 still lands on "- Evidence: [`2026-07-11-doc-drift-audit.md`]"** (step 16) — unchanged.
- **ADR-013's `- **Status:**` stays "accepted (amended 2026-07-13 …)".** Treatment: one ⚠️ note — see
  hazard P-013 below; not written (Checkpoint E stop).

### Newly introduced vs pre-existing (criterion 4)

Every bad (drifted) site was introduced before Sprint 9 opened (2026-09-14), by `git blame` on the
citing line: ADR-009 L14, ADR-010 L7/L32/L120 and the doc-drift audit → `5d3b4e0` 2026-07-11; ADR-011
L12/13/15/24 → `7fb8904` 2026-07-11; ADR-013 L167 → `a8cb0e7` 2026-07-13; shared-instructions report →
`623fd75` 2026-07-14; task-ship-loop report → `8dcafd4` 2026-07-17; consent-model report → `0ad055a`
2026-07-18; backlog-triage part 2 → `9360177` 2026-08-15. **New-bad list: empty.** Nothing to file as
a residual row.

### Note-placement hazard map (Q2)

Files due a Group E note: ADR-009, ADR-010, ADR-011, ADR-013. (Group D will add inbound-citation ADRs
at T-DI: ADR-009 again, ADR-016, ADR-017, ADR-022, ADR-028, ADR-031.)

⚠️ **Structural point that applies to every noted ADR:** the form's header `- **Corrections:**` bullet
sits in the metadata block at the top, so adding or extending it shifts **every** line of the file.
Any correct or mentioned coordinate into that file is therefore below the insertion point by
construction.

| Hazard | File | Claims to note | In-scope targets into this file (class) | Adjacent position safe? |
|---|---|---|---|---|
| **P-009** | ADR-009 | §Context sentence ending "accepted hand-mirroring behavior across both flavors as the cost." (E-002) | **correct:** L22 (E-012), L131 (E-013), L60 (E-017 in ADR-042, E-077 in `0273`). **mentioned:** L22/L131 in `backlog.md` L355, `0393` brief L253/L266/L504/L638, `0394` brief L221; L60 in `0394` brief L219/L465 | ⛔ **No.** Note under the claim and the new header bullet both shift L22, L60, L131. Only position below every target: after the §Related "Code:" bullet (end of file) — not adjacent, and still no header bullet |
| **P-010** | ADR-010 | header "Supersedes" bullet (E-003); §Context sentence ending "by reading `.claude/agents/fkit-<role>.md`" (E-004); §Context paragraph "a property of a **fresh context**" (E-005) | **correct:** none. **drifted:** L130 (E-014), report sites L26-32/L30-32/L73. **mentioned:** L130 in `backlog.md` L355, `0393` brief L179/L254/L266/L506, `0394` brief L221; L26 in `backlog.md` L355 | ⛔ **Not under the literal Q2 rule** (every claim is above L130 and the existing Corrections bullet is at the top). ⭐ Measured: no mentioned sentence becomes false if ADR-010 shifts (each is a specimen, a quote of ADR-013, a pattern count, or "has drifted" — still true after a shift) |
| — | ADR-011 | E-006…E-009 | none | ✅ Yes — header bullet after "Supersedes", notes under each claim |
| **P-013** | ADR-013 | L167 bullet (E-010, E-011, E-014) | **correct:** range L160-183 (E-028, E-029, the two migration-mechanism report sites; also ADR-015's bare-form citation of the same range, out of class). **mentioned:** L167 in `backlog.md` L355/L414, `sprint-9.md` L420, `0393` brief ×6, `0394` brief ×3 (plus two `adr-013-…md` L167 path forms in `0394`) | ⛔ **No.** A note under the bullet lands inside L160-183 (moves the range end); the header bullet shifts L160 and L167. Only safe body position: after the last §Consequences bullet ("already tracked as the wiki-sync task"), before "## Re-raise only if" — not adjacent, and still no header bullet |

### E5 — the convention's own sentence

The class survived because the **pattern** was case-sensitive, not because the **rule** was wrong. The
uppercase-only pattern sees 55 of today's 119 in-scope occurrences; the other 64 are lowercase. The
rule (cite by heading + quoted fragment) was never the gap — the sweep that enforced it looked at less
than half the class. OD5 (a case-insensitive rider on the convention page): owner ruled Q5(b), no rider
now; revisit if `0394` finds a guard infeasible.

### E6 — vault sites, routed to `fkit-wiki` (not written)

28 matches in 5 files: `ai-agents/wiki-vault/log.md` (19), `wiki/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md`
(1), `wiki/tasks/amend-project-brief-for-the-eighth-role.md` (1),
`wiki/tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role.md` (1),
`wiki/tasks/write-the-durable-citation-anchors-convention-page.md` (6). Full list in 0.3's excluded-path
fence. No vault write (ADR-005).

### `sprints/done/` sites (step 20)

`sprint-2.md` holds 11 matches today (the brief's "four" is dated): rows L144, L145, L146 (`ADR-028`
154/154/165), L187 (`ADR-010` 26), L207 (`adr-022` 44), L212 (`adr-012` 87 and 105), L237 (`adr-008`
106), L2915 (`adr-016` 154), L3858 (`adr-012` 87 and 105). `sprint-6.md` holds 5: L306 (`adr-012` 87,
105), L311 (`ADR-014` 18, `ADR-026` 48, `ADR-014` 18). **Frozen:** they are closed boards; a closed
record that is now false is corrected only by an appended dated note, and this row does not append
those either (brief § Out of scope). Not triaged further, not edited.

### Claim observations found while triaging (D4: reported, not fixed)

1. **ADR-009 §Context quotes "no flavor is deleted until the native port proves itself"** as ADR-008's
   words. Those words appear nowhere in ADR-008 at any commit checked; the nearest text is the "Port
   alongside Omnigent (chosen)" option, "while the native port proves itself".
2. **ADR-009's last line is a stray `</content>`** (after the §Related "Code:" bullet) — an authoring
   artifact inside an accepted ADR.
3. **Out-of-class siblings of the same drift, not swept (widening is out of scope):** ADR-001's ⚠ banner
   cites its own lines in bare form (a bare colon followed by 26, by 22, and by 40-41) using pre-banner numbering, now
   off by 19; ADR-010 §Related cites ADR-008's role-access section in bare form (a bare colon followed by 106-120), now
   off by 9; ADR-015 cites ADR-013's Consequences in bare form (correct today).
4. **`0394`'s brief classifies two sites differently from this triage** — ADR-042's "Historical ADRs"
   list as a "specimen list", and the doc-drift audit as "genuinely ambiguous … `mention?`". This
   triage classes the first `correct` (a pointer list; the test answers NO) and the second
   `drifted, frozen` (a dated report; Q2 a rules the class). Treatment is identical either way: both
   stay byte-identical. Recorded so `0394` does not inherit a silent disagreement.

### R1 consult

No `@fkit-architect` consult made: no referent was contested (each drifted coordinate was resolved by
reading the target at the commit the citing line was written), and Q3 is already owner-ruled. The
placement conflicts are not referent questions, so they go to the owner, not a consult.

### Checkpoint E — result: **STOP (NEEDS-DECISION)**

- `mention?` sites: 0. Contested referents: 0. New-bad sites: 0.
- **Placement conflicts: 3 — P-009, P-010, P-013** (plus the header-bullet point that governs all of
  them). Per plan §3 and the driver's instruction, R-E is **not** started.
- R-E would have had **0** live repairs anyway (every drifted site is in an ADR or a dated report); the
  only Group E writes are the Phase N notes, which is exactly what the conflicts block.

Phase T-E closed 2026-09-15 — all 130 rows `triaged`. No file outside this worklog edited.

### Resume point

1. Re-read this worklog; `git status`; confirm no target file has changed since Step 0 (none was edited).
2. Apply the owner's placement ruling to P-009 / P-010 / P-013 (and to the D-phase ADR notes).
3. R-E has no live repairs: mark it closed with "0 sites", then run D0 → T-DO → R-DO → T-DI → R-DI,
   then Phase N (all ADR notes, bottom-up per file), then §6 and Verify.

## Resume after Checkpoint E — 2026-09-15T0747Z

Resume protocol (plan §2), run by a fresh `fkit-coder` Build worker spawned by `fkit-sprint-ship-loop`:

1. Worklog re-read in full; `worklog.md` blob at resume `2543ab53d5b84cfc0425c2447c73069bd9913bbf` (matches the driver's).
2. HEAD still `d8ef596`; `git status --porcelain` identical to the Step-0 list (same 25 tracked-dirty
   paths, same untracked set plus this worklog).
3. sha256 `architecture.md` = `1b39804590cdaaccfc230e13aa66849a22a9694a69ef3db6b8dc863e01324ecc` (unchanged from Step 0).
4. Census re-run (same command, as run): `diff` against `census/E.txt` and `census/E-full.txt` is empty for both.
5. Every ADR due a note (009, 010, 011, 013, 016, 017, 022, 028, 031) and `RELEASING.md`: `git diff --quiet HEAD` clean.
6. No before-copy existed (no file had been edited). Nothing moved; nothing to reconcile.

### Owner ruling at Checkpoint E (relayed by the driver, binding)

2026-09-15, `AskUserQuestion`, live `fkit lead` session, verbatim label **"Measured rule (Rec)"**:

> "Only a correct citation blocks a spot. A mere mention blocks it only if the line shift would make that
> sentence false (checked for each site). Result: ADR-010 gets the full form. ADR-009 and ADR-013 get one
> note at the end of §Related / §Consequences, with no header bullet, and each note quotes the claim it
> corrects. Every correct citation and step 16 stay intact. Dropping the header bullet is recorded as a
> departure from the form."

Scope as relayed: refines Q2(a)'s placement clause only (the rest of Q2(a) stands), and applies to the
Group D ADR notes too. Where a file has no safe position even under this rule, the site is reported, not
noted, and the Build continues.

## Phase R-E: Group E live repairs — opened and closed 2026-09-15T0750Z

**0 sites.** T-E found 0 `drifted, live` coordinates; every drifted coordinate is in an ADR (Phase N) or
a dated report (frozen, Q2 a). No file edited in this phase.

## Phase D0: what `0356` half A covered — opened 2026-09-15T0800Z, closed 2026-09-15T0810Z

Read firsthand: `0356`'s worklog §"Group 1 classification — `ai-agents/knowledge-base/architecture.md`
(`0275` + `0286` half A)", §"THE CEILING — what this run did NOT do" and §"Named residuals carried out of
this sweep"; its brief header (Status ✅ Done (agent-closed — not owner-verified), Sprint 7).

**What half A covered (from `0356`'s own record, 2026-09-03):**

- Enumeration: two patterns only — a file-extension + colon + digits pattern (44 hits) and a backticked
  bare colon + digits pattern (10 hits), plus 1 `ADR-NNN` coordinate: **55 outbound coordinates**.
- Verdicts: 26 correct (left byte-identical), **20 drifted live pointers re-anchored with no fresh
  number** (D1–D20: `PROJECT.md`, `CLAUDE.md` ×2, launcher ×10, init ×2, adversarial-review skill ×2,
  `bin/release.mjs`, bare ×4), 2 orphan-prone form changes, **4 fenced** (the dependency table's Codex
  CLI row, both citations, and the review-walkthrough `codex exec` sentence → `0273`; the mermaid node
  label → `0273`; the `ADR-008` coordinate → `0323`), 3 stale claims reported (§9.5).
- **Not done:** half B (inbound, "~230 across ~60 files" — ruling H4); the guard-test question.

**Measured against the current file (HEAD `d8ef596` + dirty tree, after `0392`'s uncommitted edit):**

- `0356`'s patterns missed a class: **the §5.1 launcher diagram's trailing coordinates** (a space +
  colon + digits inside the text fence — not backticked, no file token). Its 26 "correct" were therefore
  not a census of the file. The 2026-09-15 Step-0 enumeration (0.4) also missed them for the same
  reason (pattern iii required backticks). **Pattern (iv) added at T-DO**, command and output below.
- The launcher has grown since (706 lines today), so half A's "correct" set has itself drifted in part —
  see T-DO. Half A's 20 re-anchors (no numbers) all still read as written; they are out of this
  enumeration by construction (they carry no coordinate).
- `0392` had landed (uncommitted working tree) before any Group D coordinate was derived; its OD2
  answer was §9.5 **kept** (per the approved plan, step 5). The 0.4 lists were taken after it.

## Phase T-DO: outbound triage — opened 2026-09-15T0810Z (no edits)

### Enumeration gap closed (pattern iv)

```
$ grep -noE '(^|[^A-Za-z0-9_./-]):[0-9]+(-[0-9]+)?(,[0-9-]+)*' ai-agents/knowledge-base/architecture.md
187: :36-43
188: :104-118
189: :121-141
190: :249-253
191: :257-285
193: :311-345
194: :357
348:`:42-43
349:`:49
350:`:55-72
397:`:125-165
$ grep -noiE '\blines? [0-9]+|#L[0-9]+' ai-agents/knowledge-base/architecture.md
(no output)
```

The first 7 rows are new (the diagram); the last 4 were already in 0.4 (iii). Union with 0.4:
**40 outbound coordinates** (comma tails split: `install.sh` 32,55-62 → 2; fkit-review skill 38,57 → 2).

### Method

For each coordinate: `git blame` the citing line of `architecture.md`, `git show <commit>:<target>` at
the cited range (what the writer read), compare with today's target, then find the referent by reading.
Target files are source files (convention row 1: keep path + line, gain a quoted fragment or function
name) except `task-status-vocabulary.md` (a living convention page: heading + fragment). A claim that
looks false is reported and its coordinate left alone (D4). Verdict set per plan §4.

### Progress ledger (Group D outbound)

Arch L = the citing line in `architecture.md` at Step 0 (identity label only). "then" = the target at the
blame commit; "now" = the target today.

| ID | Arch L | Target | Cited | Claim it supports | Blame | then → now | Verdict | Treatment | Status |
|---|---|---|---|---|---|---|---|---|---|
| DO-01 | L58 | `claude/fkit-claude.sh` | L274-285 | Codex "Required, but warned — never walled" | `fff55ab` | `codex_preflight()` → the six-mirrors checklist comment; referent now L539-560 | ~~fenced, owned by `0273`~~ → **corrected, was L274-285 now L539-560** (Process-review round 1, R1, owner ruling B) | path + line kept, gained fragment + function name | verified |
| DO-02 | L58 | `claude/skills/fkit-review/SKILL.md` | L57 | `codex exec --sandbox read-only --cd "$PWD" -` | — | a settled-tradeoffs bullet; command now L62 | **fenced, owned by `0273`** (named in its brief, "fix them in passing") | leave; reported | triaged |
| DO-03 | L60 | `install.sh` | L32 | "(a) install: tarball from `codeload.github.com`" | `351bea3` | same → same: the `curl … codeload.github.com` line | **correct** | leave | triaged |
| DO-04 | L60 | `install.sh` | L55-62 | git ls-remote or the commits API | `351bea3` | same → same: `resolve_sha() {` … `}` | **correct** | leave | triaged |
| DO-05 | L61 | `package.json` | L3-9 | "Only to cut a release (`npm run release`). **Zero npm dependencies.**" | `fff55ab` | version + a scripts block holding only the four `release*` scripts → version + `test`, `test:unit`, `test:prove-red`, `generate:manifest`, `release` | **unresolvable, reported** — claim "Only to cut a release" is false today (Node also runs `npm test` and `generate:manifest`); D4 | leave | triaged |
| DO-06 | L94 | `.gitignore` | L1-20 | `.fkit/`, the `.claude/` fkit copies, `.codex-tmp/` are gitignored | `fff55ab` | whole 17-line file → unchanged | **correct** (range end runs 3 past EOF, unchanged since written; every named entry is inside) | leave | triaged |
| DO-07 | L120 | `claude/agents/fkit-adversarial-reviewer.md` | L9 | "the sole surviving `tools:` line" | `f9faca7` | `tools: Read, Grep, Glob, Bash, Skill` → same | **correct** | leave | triaged |
| DO-08 | L129 | ADR-008 | L85 | "can write via the shell" | — | the "*Bash escape hatch:*" bullet | **correct** — Group E E-001 (X5) | leave | triaged |
| DO-09 | L151 | `claude/skills/fkit-review/SKILL.md` | L12 | an `⛔ Owner:` banner | `2a64727` | `> ## ⛔ Owner: the **reviewer**` → same | **correct** | leave | triaged |
| DO-10 | L168 | `claude/skills-for-role.sh` | L51 | "`skills_for_role() {`" | `2a64727` | `skills_for_role() {` → `#` | **corrected, was L51 now L54** (fragment already on the line) | number only | triaged |
| DO-11 | L187 | `claude/fkit-claude.sh` (diagram) | L36-43 | "self-host re-exec … if this IS an fkit checkout" | `fff55ab` | the `FKIT_NO_SELF_HOST` `if` block → its header comment | **corrected, was L36-43 now L42-49** | + fragment | triaged |
| DO-12 | L188 | same | L104-118 | "`fkit update` → re-run install.sh" | `fff55ab` | the `update\|--update\|upgrade…` case → `}` + `fkit_repo=` | **corrected, was L104-118 now L110-124** | + fragment | triaged |
| DO-13 | L189 | same | L121-141 | "throttled update CHECK → prints … (never auto-execs)" | `fff55ab` | the `FKIT_NO_UPDATE_CHECK` block → tail of the update case | **corrected, was L121-141 now L126-166** | + fragment | triaged |
| DO-14 | L190 | same | L249-253 | "fkit-claude-init.sh <proj> (idempotent …)" | `fff55ab` | the two `"$here/fkit-claude-init.sh" "$proj"` calls → an ADR-012 comment | **corrected, was L249-253 now L373-377** | + fragment | triaged |
| DO-15 | L191 | same | L257-285 | "preflight: claude REQUIRED (exit 127) · codex required-but-WARNED" | `fff55ab` | `command -v claude … exit 127` + `codex_preflight` → the mirrors checklist | **corrected, was L257-285 now L532-560** | + fragment | triaged |
| DO-16 | L192 | same | L288-307 | "fresh project? → skip the menu, seed the PRODUCER" | `fff55ab` | `pm=` + `fresh=1` + the producer `exec` → `build_settings()` comments | **corrected, was L288-307 now L581-639** (the block was rewritten — D7; re-found by reading: `pm=` through the end of the `fresh=1` branch) | + fragment | triaged |
| DO-17 | L193 | same | L311-345 | "deterministic role MENU (1-7 — an if/else; no LLM …)" | `fff55ab` | the menu `if` block → `build_settings()` hook comments | **corrected, was L311-345 now L641-691** | + fragment | triaged |
| DO-18 | L194 | same | L357 | "exec claude --agent fkit-<role> --settings …" | `fff55ab` | the final `exec claude` → `set_tab_title() {` | **corrected, was L357 now L706** | + fragment | triaged |
| DO-19 | L198 | same | L19-21 | two roles at once is "Deliberately not automated" | `fff55ab` | "Want two roles at once? …" comment → the ADR-018 hook comment | **corrected, was L19-21 now L25-27** | + fragment | triaged |
| DO-20 | L212 | `claude/skill-ownership-hook.sh` | L110-136 | the hook's role resolution + ownership check | `6dda264` | "resolve the REAL caller's role" … the ownership `case` → same, one line lower | **corrected, was L110-136 now L111-137** | + fragment | triaged |
| DO-21 | L317 | `…/conventions/task-status-vocabulary.md` | L11-21 | "Backlog · In progress · Blocked · Done · Cancelled · Moved, plus the (agent-closed) variants of the last two. Nothing else is valid." | `a8cb0e7` | the table + "No other value is valid." → the table cut before its `Moved (to backlog)` row | **unresolvable, reported** — claim looks stale: omits the `Moved (to backlog)` status row, and "variants of the last two" names Cancelled · Moved while the variants are of Done and Cancelled; D4 | leave | triaged |
| DO-22 | L340 | `install.sh` | L55-72 | `.version` written at install | `669df02` | `resolve_sha()` … the `.version` write + `✓ Installed` → same | **correct** | leave | triaged |
| DO-23 | L340 | `claude/fkit-claude.sh` | L68-74 | the launcher reads `.version` / owns `.update-check`, `.latest` | `669df02` | `share=` … `_fkit_verfield()` → same, one line lower | **corrected, was L68-74 now L69-75** | + fragment | triaged |
| DO-24 | L347 | `install.sh` | L34-37 | the sanity gate on `claude/fkit-claude.sh` | `fff55ab` | `if [ ! -f "$TMP/src/claude/fkit-claude.sh" ]` → same | **correct** | leave | triaged |
| DO-25 | L348 | `install.sh` (bare) | L42-43 | copy only `claude/` | `fff55ab` | `rm -rf "$SHARE/claude"` + `cp -R` → same | **correct** | leave | triaged |
| DO-26 | L349 | `install.sh` (bare) | L49 | `rm -rf "$SHARE/omnigent"` | `fff55ab` | same → same | **correct** | leave | triaged |
| DO-27 | L350 | `install.sh` (bare) | L55-72 | write `.version` | `fff55ab` | same → same | **correct** | leave | triaged |
| DO-28 | L352 | `install.sh` | L101 | generated launcher is a direct `exec` | `fff55ab` | `exec "$SHARE/claude/fkit-claude.sh" "\$@"` → same | **correct** | leave | triaged |
| DO-29 | L356 | `install.sh` | L86-95 | four retired subcommands fail loudly | `fff55ab` | the retired-verbs `case` → same | **correct** | leave | triaged |
| DO-30 | L359 | `claude/fkit-claude-init.sh` | L26-47 | init scaffolds `ai-agents/` + `CLAUDE.md` + `AGENTS.md`, "**never clobbering** an existing one" | `fff55ab` | the three create-if-absent blocks → script preamble + the convergence invariant comment | **unresolvable, reported** — range rewritten (D7) and the claim looks stale: an existing `CLAUDE.md`/`AGENTS.md` now has fkit's marker-delimited rules block rewritten (`install_root_file()` → `merge_rules`, "otherwise touch exactly one region"), and an existing `ai-agents/` is topped up (`converge_ai_agents`); D4 | leave | triaged |
| DO-31 | L382 | `claude/skills/fkit-review/SKILL.md` | L38 | the codex command | — | "B) The adversarial pass" heading | **fenced, owned by `0273`** (site 8) | leave; reported | triaged |
| DO-32 | L382 | same | L57 | the codex command | — | settled-tradeoffs bullet; command now L62 | **fenced, owned by `0273`** (site 8) | leave; reported | triaged |
| DO-33 | L393 | `claude/fkit-claude.sh` | L99-123 | "`fkit update` … Re-runs the canonical `install.sh`" | `669df02` | `_fkit_reinstall()` + the update case → same, one line lower | **corrected, was L99-123 now L100-124** | + fragment | triaged |
| DO-34 | L397 | same (bare) | L125-165 | the automatic check "only ever prints" | `669df02` | "Automatic: a throttled check that only ever PRINTS" block → same, one line lower | **corrected, was L125-165 now L126-166** | + fragment | triaged |
| DO-35 | L438 | `bin/generate-structure-manifest.mjs` | L259 | `workingTreeFiles()` | `0bc2b36` | `function workingTreeFiles() {` → same | **correct** | leave | triaged |
| DO-36 | L439 | `package.json` | L8 | `npm run generate:manifest` | `0bc2b36` | `"generate:manifest": …` → same | **correct** | leave | triaged |
| DO-37 | L478 | `install.sh` | L49 | cleans `omnigent/` out of installs | `fff55ab` | `rm -rf "$SHARE/omnigent"` → same | **correct** | leave | triaged |
| DO-38 | L483 | `install.sh` | L86-95 | retired verbs fail loudly | `fff55ab` | retired-verbs `case` → same | **correct** | leave | triaged |
| DO-39 | L522 | `install.sh` | L19 | `REF="${FKIT_REF:-main}"` | `df55b50` | same → same | **correct** | leave | triaged |
| DO-40 | L576 | `claude/fkit-claude.sh` | L36-43 | "The self-hosting re-exec" | `fff55ab` | the `FKIT_NO_SELF_HOST` block → its header comment | **corrected, was L36-43 now L42-49** | + fragment | triaged |

**Totals:** 40 coordinates — **18 correct · 15 corrected · 4 fenced (`0273`) · 3 unresolvable, reported**.
⚠️ **Amended in Process-review round 1 (R1):** 18 correct · **16 corrected** · **3 fenced** (DO-02, DO-31, DO-32) · 3 unresolvable, reported.
No `0284` fence: its brief rules `architecture.md` citation numbers out of its own scope. §9 counts
(X6) are not citations and are untouched.

### Claim observations (D4: reported, not fixed)

5. **§2 dependency table, Node row:** "Only to cut a release (`npm run release`)" — false today;
   `package.json` also defines `test`, `test:unit`, `test:prove-red` and `generate:manifest` (DO-05).
6. **§6 invariant 2:** the closed status list omits `Moved (to backlog)`, and "variants of the last two"
   points at the wrong two (DO-21).
7. **§7 flow 2:** "**never clobbering** an existing one" — an existing `CLAUDE.md`/`AGENTS.md` now has
   its fkit rules block rewritten, and an existing `ai-agents/` is converged (DO-30).
8. **§5.1 diagram:** "fresh project? → skip the menu, seed the PRODUCER" is true but incomplete — since
   ADR-031 the cold start no longer `exec`s; on success it falls through and opens the lead. Not false,
   so DO-16 is repaired.
9. **`0273`'s fence is stale in a second way:** its brief names the fkit-review skill's command "at
   `:61`" (2026-08-11); it is L62 today. Its own "re-measure at implementation time" rule covers this.

Phase T-DO closed 2026-09-15T0835Z — 40 rows `triaged`.

## Phase R-DO: outbound repairs — opened 2026-09-15T0840Z

Before-copy taken immediately before the first edit:

```
cp -n ai-agents/knowledge-base/architecture.md .fkit/tmp/0393/before/ai-agents/knowledge-base/architecture.md
1b39804590cdaaccfc230e13aa66849a22a9694a69ef3db6b8dc863e01324ecc  (before-copy; = the Step-0 hash, so it holds 0392's uncommitted edit and nothing of ours)
```

15 repairs applied: DO-10…DO-20 (11 rows), DO-23, DO-33, DO-34, DO-40. Each edit replaces only the
coordinate string and appends its anchor; no prose byte changed; **no line added or removed** (632
lines before and after), so R-DO shifts nothing inbound.

```
$ git diff --no-index --numstat <before-copy> ai-agents/knowledge-base/architecture.md
15	15
$ diff <before-copy> ai-agents/knowledge-base/architecture.md | grep '^>'
> `claude/skills-for-role.sh:54` — `skills_for_role() {`.** That shell function is the **single source of truth** (ADR-012
>    ├─ self-host re-exec into ./claude/fkit-claude.sh if this IS an fkit checkout   :42-49 (the FKIT_NO_SELF_HOST guard)
>    ├─ `fkit update` → re-run install.sh                                            :110-124 (the update|--update|upgrade case)
>    ├─ else: throttled update CHECK → prints "run fkit update" (never auto-execs)   :126-166 ("Automatic: a throttled check that only ever PRINTS")
>    ├─ fkit-claude-init.sh <proj>  (idempotent: scaffold, .claude/ refresh, intake) :373-377 ("$here/fkit-claude-init.sh" "$proj")
>    ├─ preflight:  claude REQUIRED (exit 127)  ·  codex required-but-WARNED         :532-560 (command -v claude … exit 127; codex_preflight)
>    ├─ fresh project? → skip the menu, seed the PRODUCER into /fkit-initiate-project :581-639 (pm_is_fresh; the fresh=1 branch)
>    ├─ deterministic role MENU (1-7 — an if/else; no LLM anywhere in the routing)   :641-691 ("--- The menu (deterministic; no LLM)")
>    └─ exec claude --agent fkit-<role> --settings .fkit/settings/<role>.json        :706 (exec claude --agent "fkit-$role")
> (`claude/fkit-claude.sh:25-27`, *"Want two roles at once? Open a terminal tab yourself"*).
>    per `skills_for_role()` (`claude/skill-ownership-hook.sh:111-137`, *"resolve the REAL caller's role"* through the `does not own skill` deny). Non-fkit skills are never touched.
> `.update-check` (throttle stamp), `.latest` (`install.sh:55-72`, `claude/fkit-claude.sh:69-75` `_fkit_verfield()`).
>   (`claude/fkit-claude.sh:100-124` `_fkit_reinstall()` and the `update|--update|upgrade` case). Refuses to run in a source checkout ("update it with `git
>   when current and silent when offline, and it **only ever prints** (`:126-166`, *"Automatic: a throttled check that only ever PRINTS"*). It **triggers on shas**
> warning, no diff. (The self-hosting re-exec at `claude/fkit-claude.sh:42-49` (the `FKIT_NO_SELF_HOST` guard) exists precisely because
```

Step 9 — every corrected coordinate resolves; the first and last line found at each new range:

```
claude/skills-for-role.sh        54      skills_for_role() {
claude/fkit-claude.sh            42..49  if [ "${FKIT_NO_SELF_HOST:-0}" != 1 ] \  ..  fi
claude/fkit-claude.sh            110..124 case "${1:-}" in  ..  esac        (111: update|--update|upgrade|--upgrade|self-update)
claude/fkit-claude.sh            126..166 # Automatic: a throttled check that only ever PRINTS. ..  fi
claude/fkit-claude.sh            373..377 if [ -e "$proj/ai-agents" ] && [ -d "$proj/.claude/agents" ]; then  ..  fi   (374, 376: "$here/fkit-claude-init.sh" "$proj")
claude/fkit-claude.sh            532..560 command -v claude >/dev/null 2>&1 || {  ..  codex_preflight   (536: exit 127)
claude/fkit-claude.sh            581..639 pm="$proj/ai-agents/knowledge-base/PROJECT.md"  ..  fi   (587: pm_is_fresh() {; 603: fresh=1)
claude/fkit-claude.sh            641..691 # --- The menu (deterministic; no LLM) ---  ..  fi
claude/fkit-claude.sh            706     exec claude --agent "fkit-$role" --settings "$settings" "$@"
claude/fkit-claude.sh            25..27  # Want two roles at once? Open a terminal tab yourself ..  # that are worse than pressing Cmd-T.)
claude/skill-ownership-hook.sh   111..137 # --- resolve the REAL caller's role ---  ..  esac   (136: deny "role '$role' does not own skill ...")
claude/fkit-claude.sh            69..75  share="$(cd "$here/.." && pwd)"  ..  }   (72: _fkit_verfield() {)
claude/fkit-claude.sh            100..124 _fkit_reinstall() {  ..  esac
```

Rows DO-10…DO-20 (corrected set), DO-23, DO-33, DO-34, DO-40 → status **verified**. Correct, fenced and
reported rows stay byte-identical → status **verified (unchanged)**.

### Freeze

`architecture.md` frozen 2026-09-15T0845Z at sha256 `a75254f85acacb2671594028cfb1a2afe98cf68dd0b5eeebf48d1e750553f848`. Asserted unchanged at T-DI, R-DI, N and Verify.

⚠️ **Re-frozen in Process-review round 1 (R1, owner ruling B):** the §2 Codex CLI row's launcher coordinate
(DO-01) was repaired in place, one line rewritten, line count unchanged (632). **New freeze sha256
`df3aabca647406cb2fdff6bfbfc1eb925d1c1c1154b9e666c4608392d7be9b1b`.** Proof that no inbound coordinate
shifts is in § "Process-review round 1".

Phase R-DO closed 2026-09-15T0845Z.

## Phase T-DI: inbound triage — opened 2026-09-15T0850Z (no edits)

**Freeze asserted:** `architecture.md` sha256 = the R-DO freeze hash (re-hashed at T-DI open, unchanged).

### Enumeration gaps closed

Step 0 (0.4) ran P1–P4. Reading showed two more inbound forms, now enumerated (commands and raw output in
`.fkit/tmp/0393/census/`, file hashes below):

- **P5 — bare continuation coordinates** on a line that also carries an `architecture.md` coordinate, or on
  the wrapped line after it (e.g. a coordinate followed by `` `:388-389` ``). Every bare token was read and
  attributed to its file; only those that target `architecture.md` get a row (36). The rest target skill
  files, the launcher, `install.sh`, ADRs or vault pages — not Group D.
- **P6 — a markdown link to `architecture.md` followed by a colon + line** (1 hit, `0284` brief L60).

**Totals (inbound coordinates): 94** = P1 57 (54 match rows, comma tails split) + P5 36 + P6 1.
⚠️ **Incomplete — superseded in Process-review round 1 (R2): 120.** See § "Process-review round 1".

| Class | Coordinates | Treatment |
|---|---|---|
| drifted, live | 16 | repair to heading + quoted fragment (R-DI) |
| drifted, frozen — in an ADR | 8 | ⚠️ drift note (Phase N), measured-rule placement |
| drifted, frozen — dated report or closed board row | 7 | leave byte-identical; reported (Q2 a) |
| unresolvable, reported (claim looks false; D4) | 6 | leave byte-identical; reported |
| mentioned | 57 | leave byte-identical |
| correct | 0 | — |

### Shift map — a hint only (D5, D7)

Derived from `git diff HEAD -- ai-agents/knowledge-base/architecture.md` (0392's uncommitted hunks) plus
R-DO (no line added or removed). Every citing coordinate was nevertheless resolved by reading the target
at the citing line's `git blame` commit (`census/di.py`, output `census/DI-resolve.txt`) and re-finding that
content in the frozen file — never by arithmetic. Most inbound citations predate 0392 by weeks, so the
0392 hunks alone explain almost none of their drift.

```
@@ -492,4 +492,2 @@   (-2 below old L495)
@@ -505,4 +503,7 @@   (+3)
@@ -530,5 +531,9 @@   (+4)
@@ -577,7 +582,5 @@   (-2)
(the other 0392 hunks are same-length line rewrites; R-DO: 15 same-length rewrites)
```

### Progress ledger (Group D inbound)

"Cited" is the Step-0 identity label of the coordinate; "Blame" is the commit whose revision the writer read.

| ID | Citing file | Citing L | Cited | Blame | Class | Intended referent (heading + quoted fragment) / reason | Test answer | Treatment | Status |
|---|---|---|---|---|---|---|---|---|---|
| DI-001 | `RELEASING.md` | L72 | L415 | c9deffc | drifted, live | §7 flow "6 — Release": "Version bumping is load-bearing" (then L415, now L422) | NO | repair (R-DI) | triaged |
| DI-002 | ADR-009 | L67 | L328-333 | 5d3b4e0 | drifted, frozen (referent removed) | the risk "Self-update has no integrity verification beyond HTTPS" — no longer in the file (no "integrity"/"HTTPS" hit); evidence use | NO | ⚠️ note (Phase N) | triaged |
| DI-003 | ADR-009 | L95 | L328-333 | 5d3b4e0 | drifted, frozen (referent removed) | same passage; "the self-update trust risk in …" — locator use | NO | ⚠️ note (Phase N) | triaged |
| DI-004 | ADR-016 | L192 | L397 | 2eed3e9 (text from 623fd75) | mentioned | "Verified, in this repository: Zero hooks. PreToolUse appears only in prose" — a dated verification; the cited deferral prose is gone and any current PreToolUse passage makes it false | n/a (D4) | leave byte-identical; claim "Zero hooks" false today — reported. ⚠️ **Relabelled in Process-review round 1 (R5):** class is **unresolvable, reported**, not mentioned; treatment unchanged | verified (unchanged) |
| DI-005 | ADR-017 | L64 | L374-378 | 31f6dda | drifted, frozen | §9.1 bullet "**`install.sh`** — the `curl | sh` entry point — has **no automated coverage**" | NO | ⚠️ note (Phase N) | triaged |
| DI-006 | ADR-022 | L15 | L101 | 0143098 | drifted, frozen (referent rewritten) | then "The **tool allowlist is harness-enforced** — it is the strongest boundary in the system."; §4.1 now calls the adversarial reviewer's allowlist "the one deliberate tool wall"; evidence use for a quote | NO | ⚠️ note (Phase N) | triaged |
| DI-007 | ADR-022 | L59 | L209 | 0143098 | drifted, frozen (referent rewritten) | §5.3 "It *was* structural in one place — `fkit-lead`'s own scoped `Agent(...)` list" | NO | ⚠️ note (Phase N) | triaged |
| DI-008 | ADR-022 | L124 | L101 | 0143098 | mentioned | "Docs need updating … (\"tool allowlist… the strongest boundary\") … now describe a superseded posture" — a dated observation quoting text that is gone | YES | leave byte-identical | triaged |
| DI-009 | ADR-022 | L156 | L101 | 0143098 | drifted, frozen (dated worklist) | "Docs to refresh" list; the refresh landed (§4.1 "the one deliberate tool wall") — treated like ADR-013 L167 (Q3 b) | NO | ⚠️ note (Phase N) | triaged |
| DI-010 | ADR-028 | L163 | L4 | 93b70da | ~~mentioned~~ → **drifted, frozen (pending worklist)** — reclassed in Process-review round 1 (R5, owner ruling C) | "Verified 2026-07-19 the same claims are still live" inside Required follow-ups item 2; then the opening summary sentence "seven roles, no orchestrator", today "**seven built roles**" | NO | ⚠️ note (round 1) | verified |
| DI-011 | ADR-031 | L32 | L184-228 | 131bc3b | mentioned | "because … still describes the retired `skillOverrides` mechanism" — a dated staleness observation; §5.2 today no longer describes it | YES | leave byte-identical | triaged |
| DI-012 | ADR-031 | L48 | L105 | 131bc3b | drifted, frozen | §4.1 table, the `fkit-lead` row "*(none — inherits all)*" (then L105, now L117) | NO | ⚠️ note (Phase N) | triaged |
| DI-013 | report 2026-07-11 doc-drift audit | L47 | L239-245 | 5d3b4e0 | drifted, frozen | the owner-confirmed version-bumping passage — gone | NO | leave byte-identical (Q2 a) | triaged |
| DI-014 | report doc-drift audit | L84 | L394 | 5d3b4e0 | mentioned | audit finding "though … cite this file as authoritative" — dated observation | YES | leave byte-identical | triaged |
| DI-015 | report doc-drift audit | L87 | L72 (coord 1 of 3) | 5d3b4e0 | mentioned | audit table quoting Omnigent-era text now gone | YES | leave byte-identical | triaged |
| DI-016 | report doc-drift audit | L87 | L88-90 (coord 2 of 3) | 5d3b4e0 | mentioned | same audit row | YES | leave byte-identical | triaged |
| DI-017 | report doc-drift audit | L87 | L99 (coord 3 of 3) | 5d3b4e0 | mentioned | same audit row | YES | leave byte-identical | triaged |
| DI-018 | report doc-drift audit | L88 | L380-396 | 5d3b4e0 | mentioned | audit row quoting the removed "Addendum (2026-07-11)" | YES | leave byte-identical | triaged |
| DI-019 | report doc-drift audit | L89 | L82 (coord 1 of 2) | 5d3b4e0 | mentioned | audit row "still generic scaffold text" → Resolved | YES | leave byte-identical | triaged |
| DI-020 | report doc-drift audit | L89 | L357-360 (coord 2 of 2) | 5d3b4e0 | mentioned | same audit row | YES | leave byte-identical | triaged |
| DI-021 | report 2026-07-14 shared-instructions layer | L275 | L397 | 623fd75 | mentioned | "There are zero hooks … appears only in prose" — dated verification | YES | leave byte-identical | triaged |
| DI-022 | report 2026-07-16 dashboard design | L292 | L43 | 31f6dda | drifted, frozen | §2 Codex CLI row "Required, but warned — never walled" (now L58) | NO | leave byte-identical (Q2 a) | triaged |
| DI-023 | report dashboard design | L297 | L306-310 | 31f6dda | drifted, frozen | §7 flow 4 "**Degradation is loud and mandatory:**" (now L383-387) | NO | leave byte-identical (Q2 a) | triaged |
| DI-024 | report 2026-07-18 git-agent design | L70 | L4 | f9faca7 | mentioned | ripple table quoting "seven roles, no orchestrator" — text since rewritten | YES | leave byte-identical | triaged |
| DI-025 | report git-agent design | L71 | L82 | f9faca7 | drifted, frozen | "### 4.1 The seven roles" (now L100) | NO | leave byte-identical (Q2 a) | triaged |
| DI-026 | report 2026-07-22 lead orchestrator design | L43 | L184-228 | 131bc3b | mentioned | "(§5.2) still describes the role lock as a `skillOverrides` off list" — dated observation | YES | leave byte-identical | triaged |
| DI-027 | report lead orchestrator design | L158 | L105 | 131bc3b | drifted, frozen | §4.1 `fkit-lead` row (now L117) | NO | leave byte-identical (Q2 a) | triaged |
| DI-028 | report 2026-08-14 triage part 2 | L25 | L145-146 | 9360177 | mentioned | "All five defects verified live today … Only `fkit-query` carries no banner" — text since rewritten | YES | leave byte-identical | triaged |
| DI-029 | report triage part 4 | L19 | L498 | 9360177 | mentioned | "still reads \"eight `node --test` contract\"" — dated | YES | leave byte-identical | triaged |
| DI-030 | report triage part 4 | L26 | L378 | 9360177 | mentioned | "still carries the parenthetical" — dated | YES | leave byte-identical | triaged |
| DI-031 | report triage part 4 | L31 | L390 (occurrence 1) | 9360177 | mentioned | quotes the lint skill's fabricated citation | YES | leave byte-identical | triaged |
| DI-032 | report triage part 4 | L31 | L390 (occurrence 2) | 9360177 | mentioned | same | YES | leave byte-identical | triaged |
| DI-033 | report triage synthesis | L413 | L390 | 9360177 | mentioned | "backs it with a citation to … that does not say it" | YES | leave byte-identical | triaged |
| DI-034 | `sprints/backlog.md` (`0145` row, open) | L216 | L453 | 48c5be0 | drifted, live | §9.1 "network or a real menu on a tty — those edges stay manual" (now L545) | NO | repair (R-DI) | triaged |
| DI-035 | `sprints/backlog.md` (`0273` row, open) | L306 | L49 (occurrence 1) | 34504c8 | mentioned | "Sites 6–8 were found by the architect" — dated record | YES | leave byte-identical | triaged |
| DI-036 | `sprints/backlog.md` (`0273` row) | L306 | L49 (occurrence 2) | 34504c8 | mentioned | "Two stale citations … cite … for what is" — dated measurement | YES | leave byte-identical | triaged |
| DI-037 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | L49 | 351bea3 | mentioned | closed row; site names of `0273` | YES | leave byte-identical | triaged |
| DI-038 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | L375 | 351bea3 | mentioned | closed row; the defect it fixed | YES | leave byte-identical | triaged |
| DI-039 | `sprints/backlog.md` (`0280` row, moved to done sprint) | L313 | L390 | a9c2709 | mentioned | quotes the fabricated citation | YES | leave byte-identical | triaged |
| DI-040 | `sprints/backlog.md` (`0281` row, ✅ Done) | L314 | L32-33 | 5ed0b91 | drifted, frozen | closed row; "(… already says so)" — L33 today says "**Both halves have now been exercised.**"; claim false today | NO | leave byte-identical; reported | triaged |
| DI-041 | `sprints/backlog.md` (`0282` row, ✅ Done) | L315 | L32-33 | 1c82cbf | drifted, frozen | closed row; same false-today CI claim | NO | leave byte-identical; reported | triaged |
| DI-042 | `sprints/backlog.md` (`0284` row, open) | L316 | L54 | c071c3f | drifted, live | §2 row "**GitHub, over the network**" (now L60) | NO | repair (R-DI) | triaged |
| DI-043 | `sprints/backlog.md` (`0287` row, open) | L319 | L52 | 1c82cbf | unresolvable, reported | §2 Codex CLI row carries the read-only claim — but "are `0275`/`0273`" is stale (`0275` closed; all three sandbox sites are `0273`'s) | n/a (D4) | leave; reported (D4) | triaged |
| DI-044 | `sprints/backlog.md` (`0312` row, ✅ Done) | L344 | L33-35 | d8ef596 | mentioned | verbatim option label | YES | leave byte-identical | triaged |
| DI-045 | `tasks/backlog/0145-…/brief.md` | L21 | L453 | 437ea1d | drifted, live | §9.1 "those edges stay manual" (now L545) | NO | repair (R-DI) | triaged |
| DI-046 | `tasks/backlog/0145-…/brief.md` | L123 | L453 | 437ea1d | drifted, live | same | NO | repair (R-DI) | triaged |
| DI-047 | `tasks/backlog/0226-…/brief.md` | L86 | L25 | 302c161 | mentioned | "Measured at" column; "all reading \"25\"" — false today (26 dirs; §4.2 "The 28 skills") | YES | leave byte-identical; reported | triaged |
| DI-048 | `tasks/backlog/0273-…/brief.md` | L107 | L49 | 34504c8 | drifted, live | §2 dependency table, Codex CLI row (now L58) | NO | repair (R-DI) | triaged |
| DI-049 | `tasks/backlog/0273-…/brief.md` | L108 | L272 | 34504c8 | drifted, live | §5.3 mermaid node `X[["codex exec --sandbox read-only"]]` (now L282) | NO | repair (R-DI) | triaged |
| DI-050 | `tasks/backlog/0273-…/brief.md` | L111 | L372 | 34504c8 | drifted, live | §7 flow "4 — Review + the adversarial pass" (now L382) | NO | repair (R-DI) | triaged |
| DI-051 | `tasks/backlog/0273-…/brief.md` | L164 | L373-375 | 34504c8 | unresolvable, reported | "Do NOT sweep the citation cluster" — premise stale: `0275` (Done) re-anchored that cluster, and its "CORRECT" citation was refuted (`0356` D11) | n/a (D4) | leave; reported (D4) | triaged |
| DI-052 | `tasks/backlog/0273-…/brief.md` | L218 | L49 | 34504c8 | drifted, live | §2 Codex CLI row (the in-passing citation site) | NO | repair (R-DI) | triaged |
| DI-053 | `tasks/backlog/0273-…/brief.md` | L283 | L49 | 34504c8 | mentioned | "were found by the architect" — dated record | YES | leave byte-identical | triaged |
| DI-054 | `tasks/backlog/0273-…/brief.md` | L295 | L373-375 | 34504c8 | mentioned | "was found and DELIBERATELY NOT FILED … Measured 2026-08-11" — dated record | YES | leave byte-identical | triaged |
| DI-055 | `tasks/backlog/0284-…/brief.md` | L61 | L388-389 | 669df02 | drifted, live | §7 flow 5 "only partly time-boxed" (now L395-396) | NO | repair (R-DI) | triaged |
| DI-056 | `tasks/backlog/0284-…/brief.md` | L232 | L591-593 | 669df02 | drifted, live | §10 "**Network.** Every network call is optional and silent on failure" (now L603-605) | NO | repair (R-DI) | triaged |
| DI-057 | `tasks/backlog/0284-…/brief.md` | L401 | L32-33 | c071c3f | unresolvable, reported | "*the CI half has never actually run*" — false today (L33 "Both halves have now been exercised") | n/a (D4) | leave; reported (D4) | triaged |
| DI-058 | report triage part 4 | L26 | bare L375 | 9360177 | mentioned | "Brief anchored it at" — dated | YES | leave byte-identical | triaged |
| DI-059 | `sprints/backlog.md` (`0273` row) | L306 | bare L272 | 34504c8 | mentioned | architect finding, dated | YES | leave byte-identical | triaged |
| DI-060 | `sprints/backlog.md` (`0273` row) | L306 | bare L372 (occurrence 1) | 34504c8 | mentioned | architect finding, dated | YES | leave byte-identical | triaged |
| DI-061 | `sprints/backlog.md` (`0273` row) | L306 | bare L372 (occurrence 2) | 34504c8 | mentioned | in-passing measurement, dated | YES | leave byte-identical | triaged |
| DI-062 | `sprints/backlog.md` (`0273` row) | L306 | bare L373-375 | 34504c8 | mentioned | "DELIBERATELY NOT FILED" — dated | YES | leave byte-identical | triaged |
| DI-063 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L372 | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-064 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L373-375 | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-065 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L372 ("inherits it from") | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-066 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L375 | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-067 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L372 | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-068 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L375 | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-069 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L375 | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-070 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L49 ("do not touch") | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-071 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L372 | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-072 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L372 ("0273 edits") | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-073 | `sprints/backlog.md` (`0275` row, ✅ Done) | L308 | bare L375 ("this edits") | 351bea3 | mentioned | closed row, dated scope record | YES | leave byte-identical | triaged |
| DI-074 | `sprints/backlog.md` (`0280` row, moved to done sprint) | L313 | bare L31 | a9c2709 | mentioned | closed row, dated grep result | YES | leave byte-identical | triaged |
| DI-075 | `sprints/backlog.md` (`0280` row, moved to done sprint) | L313 | bare L480 | a9c2709 | mentioned | closed row, dated grep result | YES | leave byte-identical | triaged |
| DI-076 | `sprints/backlog.md` (`0280` row, moved to done sprint) | L313 | bare L597 | a9c2709 | mentioned | closed row, dated grep result | YES | leave byte-identical | triaged |
| DI-077 | `sprints/backlog.md` (`0280` row, moved to done sprint) | L313 | bare L385-395 | a9c2709 | mentioned | closed row, dated grep result | YES | leave byte-identical | triaged |
| DI-078 | `sprints/backlog.md` (`0281` row, ✅ Done) | L314 | bare L31 | 5ed0b91 | mentioned | closed row, dated observation | YES | leave byte-identical | triaged |
| DI-079 | `sprints/backlog.md` (`0281` row, ✅ Done) | L314 | bare L480 | 5ed0b91 | mentioned | closed row, dated observation | YES | leave byte-identical | triaged |
| DI-080 | `sprints/backlog.md` (`0284` row, open) | L316 | bare L388-389 | c071c3f | drifted, live | §7 flow 5 "only partly time-boxed" | NO | repair (R-DI) | triaged |
| DI-081 | `sprints/backlog.md` (`0284` row, open) | L316 | bare L591-593 | c071c3f | drifted, live | §10 **Network.** bullet | NO | repair (R-DI) | triaged |
| DI-082 | `sprints/backlog.md` (`0287` row, open) | L319 | bare L275 | 1c82cbf | unresolvable, reported | with DI-043 | n/a (D4) | leave; reported (D4) | triaged |
| DI-083 | `sprints/backlog.md` (`0287` row, open) | L319 | bare L375 | 1c82cbf | unresolvable, reported | with DI-043 | n/a (D4) | leave; reported (D4) | triaged |
| DI-084 | `tasks/backlog/0226-…/brief.md` | L86 | bare L68 | 302c161 | mentioned | with DI-047 | YES | leave byte-identical | triaged |
| DI-085 | `tasks/backlog/0226-…/brief.md` | L86 | bare L135 | 302c161 | mentioned | with DI-047 | YES | leave byte-identical | triaged |
| DI-086 | `tasks/backlog/0273-…/brief.md` | L218 | bare L372 | 34504c8 | drifted, live | §7 flow "4 — Review + the adversarial pass" | NO | repair (R-DI) | triaged |
| DI-087 | `tasks/backlog/0273-…/brief.md` | L219 | bare L373-375 | 34504c8 | unresolvable, reported | "Confirm … was not touched" — premise stale, as DI-051. ⚠️ R-DI's L218 repair orphaned this bare token (R6) | n/a (D4) | **anchor restored in Process-review round 1 (R6):** §7 flow 4's "Degradation is loud and mandatory:" citation cluster; premise still reported (D4) | verified |
| DI-088 | `tasks/backlog/0273-…/brief.md` | L283 | bare L272 | 34504c8 | mentioned | dated record | YES | leave byte-identical | triaged |
| DI-089 | `tasks/backlog/0273-…/brief.md` | L283 | bare L372 | 34504c8 | mentioned | dated record | YES | leave byte-identical | triaged |
| DI-090 | `tasks/backlog/0284-…/brief.md` (P6 link form) | L60 | L54 | 669df02 | drifted, live | §2 row "**GitHub, over the network**" — the quoted cell beside it matches today | NO | repair (R-DI) | triaged |
| DI-091 | `tasks/backlog/0284-…/brief.md` | L61 | bare L591-593 | 669df02 | drifted, live | §10 **Network.** bullet | NO | repair (R-DI) | triaged |
| DI-092 | ADR-022 | L125 | bare L209 | 0143098 | mentioned | with DI-008 | YES | leave byte-identical | triaged |
| DI-093 | ADR-022 | L156 | bare L209 | 0143098 | drifted, frozen (dated worklist) | with DI-009; §5.3 "It *was* structural in one place" | NO | ⚠️ note (Phase N) | triaged |
| DI-094 | ADR-028 | L163 | bare L82 | 93b70da | ~~mentioned~~ → **drifted, frozen (pending worklist)** — reclassed in round 1 (R5) | with DI-010; then "### 4.1 The seven roles", heading still exists | NO | ⚠️ note (round 1) | verified |

### Section references (P4 + three found while reading) — heading-exists check

Every `§N` reference into `architecture.md` in scope (the 25 P4 hits in 0.4, plus ADR-022 L124 §4.1, L125
§5.3 and L156 §5.3): the heading exists and its number is unchanged. **28 × correct, leave.**

```
§4.1 -> "### 4.1 The seven roles"            §4.2 -> "### 4.2 The 28 skills — where the procedures live"
§5   -> "## 5. Runtime topology"              §5.2 -> "### 5.2 The role lock — and precisely what it does and does not enforce"
§5.3 -> "### 5.3 Consultation — the Agent tool, two hops, no cycles"
§6   -> "## 6. Data model — everything is a file in git"   §7 -> "## 7. Key flows"
§9.1 -> "### 9.1 The suite now runs automatically — CI plus an in-release gate; `install.sh` is still uncovered"
§9.5 -> "### 9.5 Residual drift" (kept by 0392 OD2)   §11 -> "## 11. Open questions"
```

### Placement of the Group D ADR notes (measured rule)

In-scope line coordinates into each ADR that receives a Group D note (from `census/hazard-raw.txt`):

| ADR | In-scope coordinates into it | Blocking (correct, or a mention made false by a shift)? | Placement |
|---|---|---|---|
| ADR-009 | L22, L131 (correct), L60 (correct); mentions | yes | one note at the end of §Related, no header bullet (owner ruling) |
| ADR-017 | none | no | full form: header `Corrections` bullet + note under Decision item 2 |
| ADR-022 | L44, only as a "shifted citation" specimen (backlog L224, `0166` brief L34) — a further shift keeps it a shifted citation | no | full form: header bullet + notes under §Context paragraph 1, Decision 1 sub-bullet, §Related "Docs to refresh" |
| ADR-031 | none | no | full form: header bullet + note under the "Also already-stale prose" paragraph |

⚠️ **Hazard-map scope, stated:** in-scope paths only (Q1), the same scope as the Checkpoint E map the owner
ruled on. Closed task folders, the vault and the fixtures also hold line coordinates into ADR-010, ADR-022 and
ADR-028 (`census/hazard-raw.txt`, 251 lines whole-repo); they were not re-resolved.

### Claim observations added at T-DI (D4: reported, not fixed)

10. **ADR-016 §Consequences** "**Zero hooks.**" — false today (the ADR-018 `PreToolUse` hook ships). Accepted ADR; out of this row's note class.
11. **`0226` brief U5** — "all reading \"25\"": `architecture.md` today reads 26 dirs and "The 28 skills".
12. **`0273` brief** — the "citation cluster" it fences (L164, L219) was re-anchored by `0275` (Done), and the citation it calls CORRECT was refuted in `0356`. Separately, the open `0287` board row (L319) still attributes two sandbox sites to `0275`.
13. **`0284` brief L401 and closed rows `0281`/`0282`** — "the CI half has never actually run" is false today (§1: "**Both halves have now been exercised.**").
14. **`architecture.md` §10 Idempotence** — "init never clobbers an existing `ai-agents/`, `CLAUDE.md`, or `AGENTS.md`" — the same stale claim as DO-30.
15. **Out-of-class `ADR-NNN` bare continuations** found while reading: closed rows `0280`/`0281` write an `ADR-026` coordinate followed by a bare `` `:131` `` — invisible to the E1 pattern (a second spelling of the Group E class). Not swept (widening is out of scope).

Phase T-DI closed 2026-09-15T0935Z — 94 rows `triaged`.

## Phase R-DI: inbound live repairs — opened 2026-09-15T0940Z

Freeze re-asserted before and after: `architecture.md` sha256 `a75254f8…553f848` both times.

Before-copies (`cp -n`, immediately before each file's first edit):

```
9c058d6402769ff587bf815dcc4fa51de643e88f324a3a99c0b93dbcd24e0e03  RELEASING.md   (pre-dirty vs HEAD)
228f10b296591868b0a3807b38707b14ffc7a7ebb60a317dbeed632b0d33d62b  ai-agents/sprints/backlog.md   (pre-dirty vs HEAD)
cffe50711832908bd7df72b84307861d392826359c262cdc156ca7d97d1b111e  ai-agents/tasks/backlog/0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md   (pre-dirty vs HEAD)
5788e9162540632bdac348983431a76b7abada1981507fbd5a5e1dfb83983610  ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md   (pre-dirty vs HEAD)
f0f2dc4ea28805b8de926eb6ad61d0b611d9cee53a7d1dbcb9e159aade8765af  ai-agents/tasks/backlog/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md   (pre-dirty vs HEAD)
```

(`backlog.md` was pre-dirty at Step 0; its before-copy therefore already carries the other workers' edits,
and our change is attributed by diff against it. The other four files were clean vs HEAD before our edit —
the "pre-dirty" label above is the state *after* our edit.)

16 coordinates repaired on 12 lines. Each edit replaces only the coordinate string; the sentence around
it is byte-identical; no line added or removed.

```
$ git diff --no-index --numstat <before-copy> RELEASING.md   → 1 1
   + …architecture.md` (§7, flow *"6 — Release"*: *"Version bumping is load-bearing"*) calls…
$ git diff --no-index --numstat <before-copy> ai-agents/sprints/backlog.md   → 2 2
   + …architecture.md` §9.1 ("a real menu on a tty — those edges stay manual") says the tty menu stays manual…
   + …architecture.md` §2's **GitHub, over the network** row, §7 flow 5's *"only partly time-boxed"* and §10's **Network.** bullet (*"has no outer deadline"*) already state the…
$ git diff --no-index --numstat <before-copy> ai-agents/tasks/backlog/0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md   → 2 2
   + …architecture.md` §9.1 (*"those edges stay manual"*) records this as an **explicitly accepted untested edge**…
   + …architecture.md` §9.1 (*"those edges stay manual"*) is **stale** — it says the menu…
$ git diff --no-index --numstat <before-copy> ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md   → 4 4
   + …architecture.md` §2** — the **dependency table**'s Codex CLI row.…
   + …architecture.md` §5.3** — **inside the mermaid runtime diagram**, as the…
   + …architecture.md` §7** — the review-pass walkthrough (§*"4 — Review + the…
   + …architecture.md` §2's Codex CLI row and §7's flow *"4 — Review + the adversarial pass"*, **re-measured against the post-`0272` tree** rather…
$ git diff --no-index --numstat <before-copy> ai-agents/tasks/backlog/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md   → 3 3
   + …architecture.md`](../../../knowledge-base/architecture.md) §2, the **GitHub, over the network** row …
   + …architecture.md` §7 flow 5 (*"only partly time-boxed"*), §10 **Network.** bullet (*"has no outer deadline"*) …
   + …architecture.md` §10's **Network.** bullet (*"optional and silent on failure"*) and the launcher's own…
```

Step 9 — every repaired anchor resolves in the frozen file (quoted fragment → line found, content read):

```
"Version bumping is load-bearing"                 → L422  (§7, "**6 — Release**")           DI-001
"a real menu on a tty — those edges stay manual"  → L545  (§9.1, the launcher bullet)       DI-034
"those edges stay manual"                         → L545  (§9.1)                            DI-045, DI-046
"**GitHub, over the network**"                    → L60   (§2 dependency table)             DI-042, DI-090
"only partly time-boxed"                          → L395  (§7, "**5 — Self-update**")       DI-080, DI-055
"has no outer deadline"                           → L604  (§10, "**Network.**" bullet)      DI-081, DI-091
"optional and silent on failure"                  → L603  (§10, "**Network.**" bullet)      DI-056
Codex CLI row                                     → L58   (§2)                              DI-048, DI-052
X[["codex exec --sandbox read-only"]]             → L282  (§5.3 mermaid block)              DI-049
"4 — Review + the adversarial pass"               → L380  (§7)                              DI-050, DI-086
```

E7 — dashboard renders after R-DI:

```
$ diff dash/backlog.before.txt dash/backlog.after.txt     → 2 changed rows only: the 0145 row and the 0284 row;
                                                             in each, only the repaired coordinate text differs
$ diff dash/sprint-9.before.txt dash/sprint-9.after.txt   → identical
```

All 16 live rows → **verified**. Mentioned, frozen and reported rows → **verified (unchanged)**.

Phase R-DI closed 2026-09-15T0950Z.

## Phase N: ADR drift notes (Group E + Group D) — opened 2026-09-15T1000Z

Form consumed (not run, not edited): `claude/skills/fkit-record-decision/SKILL.md` §"Correcting an accepted
ADR — the dated correction note" — ⚠️ marker only, below the claim, indentation of the block it sits
under, dated and present-tense with a verification date, cite by heading + quoted phrase (no fresh line
numbers), cross-reference instead of restating, header `- **Corrections:**` bullet (or an appended
continuation of an existing one). Placement: owner ruling **"Measured rule (Rec)"** (Checkpoint E).
Generator: `.fkit/tmp/0393/census/notes.py` (each insertion asserts the anchor line's text first; applied
bottom-up per file). No `ADR-NNN` or `architecture.md` colon-line string and no `--sandbox` string was
written into any note (census and `0273`'s whole-repo `--sandbox` grep stay unchanged).

Before-copies (clean vs HEAD before edit, all seven):

```
8c2c2f38ab6c2bef3b629a485db59448ec2ffc1e90248dfc3f7da0b266ee4724  ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md
c03d984bfcbdb986a5b3fc3f5f275f5d66acd6eace9454345c5040a9e5a0ac36  ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md
a82bbc1206c6ef5b4db9c48ce935a17635ca4f2e324d1a4748563d94a88914f9  ai-agents/knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md
dbb48292e9ab9a86f2e1f74c836e917e3a53f32c167a8c3160b1e68570987961  ai-agents/knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md
fd56c79190b74ff1583aa22cd5e7e5504ead43d73fad9d4ad81cb71efef04b9e  ai-agents/knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md
345473214d586996a5ae58670b3d27613bf876dbe323d98ec5afeccc20c0c851  ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md
652c8d608cc8115ac829adcf8a267c96963c8c2edfafbbf580130fcb824b0632  ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md
```

### Notes written — placement per ADR

| ADR | Sites noted (IDs) | Placement | Header bullet | Departure from the form? |
|---|---|---|---|---|
| ADR-009 | E-002, DI-002, DI-003 | **one note at the end of §Related** (after the "Code:" bullet, before the stray closing tag), claims quoted | **none** | ✅ yes — recorded in the note itself and here (owner ruling) |
| ADR-010 | E-003 (Supersedes bullet), E-004, E-005 | **adjacent**: note below §Context paragraph 1 (carries the fact, covers the header's Supersedes pointer too); cross-reference note below the *"fresh context"* paragraph | **extended** — a fifth continuation line appended to the existing `Corrections` item | no |
| ADR-011 | E-006, E-007, E-008, E-009 | **adjacent**: note below §Context paragraph 1 (column 0, carries the facts); cross-reference note below fact 1 (indent 3) | **added** after `Supersedes` | no |
| ADR-013 | E-010, E-011, E-014 (E-012, E-013 marked still-landing) | **one note at the end of §Consequences** (after its last bullet, before `## Re-raise only if`), claim quoted, five per-coordinate verdicts | **none** | ✅ yes — recorded in the note itself and here (owner ruling) |
| ADR-017 | DI-005 | **adjacent**: below Decision 2 (indent 3) | **added** after `Came from` | no |
| ADR-022 | DI-006, DI-007, DI-009 + DI-093 | **adjacent**: below §Context paragraph 1 (column 0); below Decision 1's lead `Agent(...)` sub-bullet (indent 5); cross-reference below §Related "Docs to refresh" (indent 2) | **added** after `Amends (does not supersede)` | no |
| ADR-031 | DI-012 | **adjacent**: below the §Context paragraph "Also already-stale prose, corrected by this ADR" (column 0) | **added** after `Evidence` | no |

**Report-only sites (no safe position):** none. **ADRs with inbound Group D coordinates but no note:**
ADR-016 (DI-004 mentioned) and ADR-028 (DI-010, DI-094 mentioned) — the test answered YES, so no note.

⚠️ **ADR-010 — a prior recorded judgement superseded, stated rather than done quietly.** ADR-010's own
2026-09-03 note (task `0197`, inside sweep `0356`) assessed these same three ADR-008 pointers and recorded
*"none of them earns a correction note"* (each is paired with a heading or quoted phrase). The new note
leaves that text byte-identical and says it is superseded on this point by owner ruling Q2 (2026-09-15)
and the Checkpoint E ruling "ADR-010 gets the full form". The T-E hazard map did not surface this prior
judgement to the owner; flagged in the return.

### Proof — append-only, against HEAD and against the before-copy (step 19)

```
file                                                      HEAD numstat   before-copy numstat   HEAD deletion filter   before-copy '<' lines
adr-009-claude-code-native-is-the-only-runtime.md         31 0           31 0                  (empty)                0
adr-010-role-locked-sessions-and-skill-lockdown.md        34 0           34 0                  (empty)                0
adr-011-package-json-stays-with-scripts-npm-under-…md     28 0           28 0                  (empty)                0
adr-013-knowledge-base-root-holds-the-living-canon.md     29 0           29 0                  (empty)                0
adr-017-skills-may-ship-executables-invoked-via-bash-…md  12 0           12 0                  (empty)                0
adr-022-tools-unrestricted-except-adversarial-reviewer.md 28 0           28 0                  (empty)                0
adr-031-fkit-lead-becomes-the-orchestrating-front-door.md 11 0           11 0                  (empty)                0
commands: git diff --numstat -- <adr>; git diff --no-index --numstat <before> <adr>;
          git diff -U0 -- <adr> | grep '^-' | grep -v '^---'; diff <before> <adr> | grep '^<'
```

### Correct coordinates into noted files — re-verified after the notes

```
ADR-009 L22   ([`2026-07-11-doc-drift-audit.md`](../reports/2026-07-11-doc-drift-audit.md)) found the Omnigent-side   (E-012)
ADR-009 L60   (`codex exec --sandbox read-only`) for genuine model diversity. …                                     (E-020, E-081)
ADR-009 L131  - Evidence: [`2026-07-11-doc-drift-audit.md`](../reports/2026-07-11-doc-drift-audit.md).              (E-013, step 16)
ADR-013 L160  ## Consequences      L183  (already tracked as the wiki-sync task).      L184  (blank)                  (E-030, E-031)
ADR-016 L73   … runs `codex exec --sandbox read-only …                                                               (E-021, E-082; ADR-016 untouched)
```

Group E census after Phase N, compared as a multiset of (path, match) because the notes shift line
numbers inside the noted ADRs: **identical to Step 0** (119 match rows; 0 added, 0 removed).

Phase N closed 2026-09-15T1030Z.

## Decision log — this resumed Build (unattended calls, ADR-032 A4 / ADR-019 audit)

Every call below was made without asking, under the declared-approval marker, and is recorded so a wrong
one is findable. Each qualified as in-plan and mechanical, or as an obvious winner within the plan's intent.

1. **Widened both enumerations (T-DO pattern iv; T-DI P5, P6).** Answers plan §1.4 / brief D1, D6 ("more
   than one pattern", "machine-derived"). Changed: 7 outbound and 37 inbound coordinates added to the
   ledgers. Qualified: the plan requires a complete enumeration; the gap was found by reading.
2. **Fenced DO-01, DO-02, DO-31, DO-32 to `0273`** (not repaired). Answers plan §4 T-DO verdict set.
   Changed: nothing. Qualified: `0356`'s sanctioned fence on the same four citations; `0273`'s brief
   claims those two lines ("fix them in passing"). Cheapest to reverse. ⚠️ The brief names DO-01 as an
   unfixed hit — flagged in the return.
3. **Source-file outbound repairs kept path + line and gained an anchor** (15 rows). Plan §4 T-DO bullet 1.
4. **Three outbound and six inbound coordinates left unrepaired because the claim looks false** (DO-05,
   DO-21, DO-30; DI-043/082/083, DI-051/087, DI-057). Plan §4 / D4. Changed: nothing; reported.
5. **Inbound ADR classification rule** (T-DI): an evidence or locator use → drifted, frozen → note; a dated
   observation about `architecture.md`'s then-state ("still describes", "Verified … still live",
   "Verified, in this repository") → mentioned → no note; ADR-022's bare "Docs to refresh" list → dated
   worklist + note, by analogy with owner ruling Q3 (b) on ADR-013 L167. Answers brief E2's test applied
   to Group D (plan §4 T-DI "classes"). Qualified: the brief's own definition of `mentioned` ("a dated
   measurement result"). ⚠️ A reading judgement; listed in the return so the reviewer can overrule it.
6. **Placement for ADR-017, ADR-022, ADR-031: full form.** Measured rule: no in-scope correct citation or
   truth-dependent mention targets them (ADR-022 L44 is only a "shifted citation" specimen). In-plan
   under the relayed ruling.
7. **ADR-010's new note supersedes `0197`'s "none earns a note" line** — see Phase N. Owner ruling names
   ADR-010 for the full form. Flagged in the return.
8. **ADR-009 note flags that the quoted ADR-008 words are a paraphrase** (one sentence). Qualified: without
   it, re-pointing the coordinate would make the misquote look verified (D4's stated reason). Reversible.
9. **Hazard map scope kept to Q1's in-scope paths** (same as the map the owner ruled on); closed folders,
   vault and fixtures not re-resolved. Stated in T-DI and the return.

## §6: OD3 (Q4) and OD5 (Q5) — recorded 2026-09-15T1035Z (nothing built, no rider written)

**What the neighbouring rows were found to own (read firsthand, step 12):**

- **`0371`** (Backlog, owner `fkit-architect`) — an investigation/costing row. It costs widening
  `test/coordination-citation-policy.test.js`'s target class to **source-file** coordinates, under owner
  ruling G3 ("No, refuse — file follow-up if wanted (Rec)"): source-file `path` + line stays legal
  (convention row 1). It ships a cost, not a change, and asks whether a rotting **sub-class** exists.
- **`0368`** (Backlog, owner `fkit-coder`) — gives the ownerless source-file coordinate-rot class an owner:
  measures `test/`, repairs `dashboard.sh`'s self-pointing comment, and (instance C, ruling K2) absorbs the
  inbound coordinates `0369` shifted in two skill files. Measure and repair; no guard.
- **`0394`** (Backlog, owner `fkit-coder`) — builds (or finds infeasible) a guard for the **`ADR-NNN` +
  line** class only. Its brief says it narrows OD3 without discharging it and must settle a six-point class
  definition (case, fences, blockquotes, backticks, exemptions, use/mention).

**OD3 / Q4 — recommendation, as ruled ("Don't build; route to 0371 (Rec)"):**

- **Detecting *staleness* mechanically is infeasible** for inbound `architecture.md` coordinates: this run
  resolved 94 of them and **57 were mentions** — lexically identical to uses, told apart only by reading.
  A staleness guard would either flag every mention (noise people learn to ignore) or need a per-site
  exemption list that is itself a hand-maintained census.
- **A syntactic ban is feasible and cheap:** forbid the `architecture.md` + colon + line form (and its bare
  continuation) in **living** coordination documents, the way the coordination-citation guard already
  forbids a coordination-document path + colon + line. `architecture.md` is a living document edited by
  others (convention row 3 logic), so the form is never right there; the durable form is heading +
  fragment, which this run used for all 16 inbound repairs. Exemptions would mirror the existing guard
  (closed folders, fences, blockquotes) plus dated reports and ADRs.
- **Routing:** the driver routes this to a producer to add the inbound `architecture.md` form to `0371`'s
  costing. Nothing built here; no `NAMED_EXEMPT` entry; no guard file.

**OD5 / Q5 — as ruled ("No rider now (Rec)"):** no case-insensitivity rider on the convention page. E5's
finding stands in the worklog. Revisit if `0394` finds a guard infeasible. This run adds one more data point
for that revisit: a **second spelling** of the Group E class exists — an `ADR-NNN` coordinate followed by a
bare continuation coordinate (claim observation 15) — which the E1 pattern cannot see.

## Verify (plan §7, brief steps 1–25) — opened 2026-09-15T1110Z

HEAD still `d8ef596` (no owner commit during the Build). `architecture.md` sha256 at Verify =
`a75254f85acacb2671594028cfb1a2afe98cf68dd0b5eeebf48d1e750553f848` = the R-DO freeze hash.

| Step | Check | Command (as run) | Result |
|---|---|---|---|
| 1 | Diff scope vs Step-0 dirty list | `git status --porcelain`; `git diff --no-index --numstat <before-copy> <file>` per file | ✅ New modified paths beyond Step 0 = exactly our 11 (RELEASING.md, 7 ADRs, 3 briefs). Our two pre-dirty targets attributed by before-copy: `architecture.md` 15/15, `backlog.md` 2/2. Every other Step-0 dirty path has an mtime before Step 0 (10h22 local) — untouched; no before-copy exists for them, so byte-identity is shown by mtime, not by hash |
| 2 | Fenced trees unchanged | `git status --porcelain -- test/fixtures ai-agents/sprints/done ai-agents/wiki-vault ai-agents/tasks/cancelled`; `find <those> ai-agents/tasks/done -newermt '<Step-0 local time, 10h22>' -type f` | ✅ 0 lines; 0 files. (`tasks/done/` holds other workers' pre-existing moves and untracked files from before Step 0) |
| 3 | Vault unchanged | `git status --porcelain -- ai-agents/wiki-vault` | ✅ 0 |
| 4 | `0392` landed first | — | ✅ `0392`'s edit is in the uncommitted working tree at HEAD `d8ef596`; every Group D coordinate was derived after it (Step 0 hash `1b398045…` includes it) |
| 5 | `0392` OD2 | — | ✅ §9.5 **kept** (heading "### 9.5 Residual drift" present); shift map derived after it |
| 6 | Every hunk is a citation string, a note or comment text | `diff <before-copy> <file> \| grep -E '^[<>]'` over our 13 files | ✅ 27 lines removed, 200 added = 27 same-line coordinate rewrites + 173 ADR note/header lines; no prose sentence changed |
| 7 | Enumeration machine-derived, both directions | 0.4 fences + T-DO pattern (iv) + T-DI P5/P6 | ✅ recorded with commands and output |
| 8 | One verdict per citation | T-DO ledger (40 rows), T-DI ledger (94 rows), § list (28) | ✅ |
| 9 | Corrected citations resolve, content shown | R-DO and R-DI step-9 fences | ✅ |
| 10 | Shift map re-derived | T-DI "Shift map" (0392 hunks + blame-commit reads) | ✅ hint only; every site re-found by reading |
| 11 | D0 evidenced | Phase D0 | ✅ from `0356`'s worklog and a fresh measurement |
| 12 | OD3 recommendation; `0371`/`0368` read | §6 | ✅ not built; routed to `0371` (Q4 a) |
| 13 | Census firsthand, own totals, `claude/` stated | 0.3 | ✅ 119 / 24; uppercase 55, lowercase 64; `claude/` **0** |
| 14 | Table rows = comma-split count | T-E ledger | ✅ 130 rows = 119 matches + 11 comma tails |
| 15 | ADR-013 L167 five verdicts + worklist call | E4 + ADR-013 note | ✅ |
| 16 | ADR-009 L131 not altered, still lands | Phase N re-verification fence | ✅ "- Evidence:" + the doc-drift-audit link |
| 17 | Added lines with an `.md` + colon + line are paired | `diff <before> <file> \| grep '^>' \| grep -E '[a-z0-9-]+\.md:[0-9]+'` | ✅ empty |
| 18 | No Status line changed | same diff `\| grep -E '\*\*Status:\*\*\|^[<>] ## Status'`; repaired board rows' Status/rank cells | ✅ 0; both repaired rows still `🔲 Backlog \| —` |
| 19 | Append-only proof, HEAD and before-copy | Phase N proof fence | ✅ all seven `N 0`, both deletion filters empty |
| 20 | `sprint-2.md` unchanged, sites named | 0.3 / step-20 section; step 2 above | ✅ 11 sites named (brief's "four" is dated) |
| 21 | Vault unchanged, count routed | E6 | ✅ 28 matches in 5 files → `fkit-wiki` |
| 22 | ADR-008 L85 correct, untouched | E-001 / DO-08 | ✅ |
| 23 | Dashboards | `bash claude/skills/fkit-status/dashboard.sh <board>` vs before-captures | ✅ `backlog.md`: 4 diff lines = the two repaired rows (0145, 0284), coordinate text only; `sprint-9.md`: byte-identical |
| 24 | Suite | `node --test test/*.test.js`; `bash test/prove-red.sh` (the two halves of `npm test`, run separately to capture counts) | ✅ **967 tests, 967 pass, 0 fail**; prove-red "hard gate PASSED" (39 mutations). ⚠️ **No test reads a documentation citation — green proves nothing about this change** |
| 25 | Guards | `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` | ✅ **43 / 43 pass**. No `NAMED_EXEMPT` entry added (this row wrote nothing under `test/`) |

### Final census (same commands, as run)

```
Group E, in-scope, case-insensitive:        119 occurrences / 24 files   (unchanged — no live repairs existed)
Group E, claude/:                            0
Group E, (path, match) multiset vs Step 0:   identical
Inbound P1 (architecture.md + colon + line): 43 match rows (Step 0: 54; the 11 repaired rows are gone)
Outbound in architecture.md:                 24 file-token rows + 12 bare rows remain — all source-file
                                             coordinates now carrying an anchor, plus the correct, fenced and
                                             reported ones (no drifted live coordinate left unrepaired)
```

**In-scope bad sites remaining, each named with its class** (nothing is silently left):

- Group E: 26 drifted, frozen — 11 in ADRs, now carrying ⚠️ notes (E-002…E-011, E-014); 15 in dated reports,
  byte-identical by Q2 (a) (E-022…E-029, E-032…E-035, E-038…E-040).
- Group D outbound: 4 fenced to `0273` (DO-01, DO-02, DO-31, DO-32); 3 unresolvable, reported (DO-05, DO-21, DO-30).
- Group D inbound: 8 ADR coordinates now carrying notes; 7 frozen report/closed-row coordinates (DI-013,
  DI-022, DI-023, DI-025, DI-027, DI-040, DI-041); 6 unresolvable, reported (DI-043, DI-051, DI-057,
  DI-082, DI-083, DI-087).

Verify closed 2026-09-15T1125Z. Build ends here (driver note: the driver's own Verify / Review /
Process-review follow). No commit.

## Process-review round 1 (R1–R6) — opened 2026-09-15T0904Z

`fkit-coder` as the `fkit-sprint-ship-loop` Process-review worker, under the declared-approval marker (approved
plan blob `809db7c3…`, re-hashed, matches). Method: `fkit-process-stateful-review` steps 0–7, no per-round owner
gate. HEAD `d8ef596`. ⚠️ Wall clock at open (`date -u`) read 0904Z, earlier than several Build phase markers above
(e.g. Verify "closed 1125Z") — those markers were not measured times; recorded, not rewritten.

### Step 0 — ledger, residuals, ADRs

- `review.md`: 6 novel findings (R1–R6), no *Coder response* rows, **Accepted residuals: none**.
- ADRs checked for a covering "Re-raise only if": ADR-005 (vault writes), ADR-033 (movers), ADR-042 (the flag
  must stay identical across executable sites 1–4 — nothing here touches a flag). None covers R1–R6 → all novel.
- Owner rulings on the review, relayed by the driver (2026-09-15, `AskUserQuestion`, live `fkit lead` session):
  **A** (R3) "Keep, add back-pointer (Rec)"; **B** (R1) "Repair it in 0393 (Rec)"; **C** (R5) "Add a drift note (Rec)".

### Pre-round state

Snapshot of every file this round edits, taken before the first edit: `.fkit/tmp/0393/pr1-before/` (the plan's
before-copies in `.fkit/tmp/0393/before/` are untouched and still match their recorded hashes; new before-copies
for the two ADRs first edited this round are below).

```
9c85366f07cb4d2adeb58532bf3c0ff788dbc72e4350518016aab80d87ccbcd8  before/…/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md   (clean vs HEAD)
000214347d79537317945514f1b7a5f21e0c892eceee30193180397bf13ad600  before/…/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md   (clean vs HEAD)
a75254f85acacb2671594028cfb1a2afe98cf68dd0b5eeebf48d1e750553f848  pr1-before/…/architecture.md   (= the R-DO freeze)
```

### R2 — the inbound enumeration, widened

Why T-DI missed them: P5 only looked at bare tokens on a line that already carried an `architecture.md` + colon
coordinate, or on the line after. Three widening patterns, run over the **Step-0 tree** (before-copies substituted
for the files this row edited) with the Q1 scope, every hit then attributed **by reading**:

```
P8  bare token in any table row or blank-line-bounded paragraph that names architecture.md   → 150 tokens   (.fkit/tmp/0393/census/r2/p8.py, p8-before.tsv)
P8w bare token within 15 lines of a non-table architecture.md mention, not already in P8     → 15 lines    (r2/p8w.py)
P8s bare token in a heading-bounded section naming architecture.md, not in P8 or P8w          → 1 token     (r2/p8s-before.txt; the fkit-task-ship-loop skill, targets a skill file)
also: HEAD- or sha-prefixed forms → 2 (backlog.md cancelled 0286 row); "line N" / "L N" / "#L" forms near architecture.md → 0
P7  nearest-preceding-file-token attribution (cross-check only; under-counts on long rows)      → 98           (r2/p7.py)
```

Reading result (reconciled by script): of P8's 150 tokens, **20 are new**, 36 are existing ledger rows (35 P5 + the
P6 row; the 37th P5 row, ADR-022's section-prefixed token, is outside P8's bare pattern), and 94 target other files
(skill files, the launcher, `install.sh`, vault pages, `PROJECT.md`, ADR-008, ADR-003, ADR-026). The HEAD-prefixed
search adds **2**; P8w adds the **4** ADR-042 tokens; P8s adds none. **26 new inbound coordinates.**

| ID | Citing file | Citing L (Step 0) | Cited | Blame | Class | Intended referent (heading + quoted fragment) / reason | Test answer | Treatment | Status |
|---|---|---|---|---|---|---|---|---|---|
| DI-095 | `tasks/backlog/0287-…/brief.md` (open) | L194 | bare L52 | 1c82cbf | unresolvable, reported | twin of DI-043: *"carries the same claim at"* — §2 Codex CLI row; but *"that is `0275` and `0273`"* is stale (`0275` Done; all three sandbox sites are `0273`'s) | n/a (D4) | leave; reported (D4) | verified (unchanged) |
| DI-096 | same | L194 | bare L275 | 1c82cbf | unresolvable, reported | twin of DI-082: §5.3 mermaid review node | n/a (D4) | leave; reported (D4) | verified (unchanged) |
| DI-097 | same | L194 | bare L375 | 1c82cbf | unresolvable, reported | twin of DI-083: §7 flow *"4 — Review + the adversarial pass"* | n/a (D4) | leave; reported (D4) | verified (unchanged) |
| DI-098 | `tasks/backlog/0273-…/brief.md` (open) | L155 | bare L49 | 34504c8 | drifted, live | § "Two stale citations that sit ON lines this task already rewrites", *"site 6"* label → §2 Codex CLI row (now L58); disagreed with the site list R-DI set to §2 | NO | **repaired**: *"site 6 (§2's Codex CLI row)"* | verified |
| DI-099 | same | L156 | bare L372 | 34504c8 | drifted, live | same section, *"site 8"* label → §7 flow *"4 — Review + the adversarial pass"* (now L380) | NO | **repaired**: *"site 8 (§7's flow "4 — Review + the adversarial pass")"* | verified |
| DI-100 | `sprints/backlog.md` (`0226` row, open) | L269 | bare L25 | 302c161 | mentioned | twin of DI-047: *"three further sites inside declared `architecture.md`"*, measured first-hand 2026-08-05 | YES | leave byte-identical | verified (unchanged) |
| DI-101 | same | L269 | bare L68 | 302c161 | mentioned | twin of DI-084 | YES | leave byte-identical | verified (unchanged) |
| DI-102 | same | L269 | bare L135 | 302c161 | mentioned | twin of DI-085 | YES | leave byte-identical | verified (unchanged) |
| DI-103 | `sprints/backlog.md` (`0286` row, ⛔ Cancelled — closed) | L318 | bare L51 | d8ef596 (row rewritten at cancel; measured 2026-08-13) | mentioned | *"four surfaced-and-not-taken"* — a dated audit list | YES | leave byte-identical (closed row) | verified (unchanged) |
| DI-104 | same | L318 | bare L52 | same | mentioned | same list | YES | leave byte-identical | verified (unchanged) |
| DI-105 | same | L318 | bare L355 | same | mentioned | same list | YES | leave byte-identical | verified (unchanged) |
| DI-106 | same | L318 | bare L597 | same | mentioned | same list | YES | leave byte-identical | verified (unchanged) |
| DI-107 | same | L318 | bare L590 | same | mentioned | *"the reviewer's"* citation, dated | YES | leave byte-identical | verified (unchanged) |
| DI-108 | same | L318 | bare L594 | same | mentioned | same | YES | leave byte-identical | verified (unchanged) |
| DI-109 | same | L318 | bare L586 | same | mentioned | *"the reviewer's own round-1 error"* | YES | leave byte-identical | verified (unchanged) |
| DI-110 | same | L318 | HEAD L586 | same | mentioned | same, the HEAD-prefixed form | YES | leave byte-identical | verified (unchanged) |
| DI-111 | same | L318 | HEAD L577 | same | mentioned | same | YES | leave byte-identical | verified (unchanged) |
| DI-112 | same | L318 | bare L399 | same | mentioned | quotes `0257`'s worklog *"past … shift by +4"* | YES | leave byte-identical | verified (unchanged) |
| DI-113 | same | L318 | bare L375 | same | mentioned | *"⛔ Fences:"* list, dated | YES | leave byte-identical | verified (unchanged) |
| DI-114 | same | L318 | bare L49 | same | mentioned | same | YES | leave byte-identical | verified (unchanged) |
| DI-115 | same | L318 | bare L372 | same | mentioned | same | YES | leave byte-identical | verified (unchanged) |
| DI-116 | report 2026-07-11 plan-omnigent-removal | L109 | bare L380-396 | 5d3b4e0 | drifted, frozen (referent removed) | `architecture.md` table row, *"stale Claude addendum"* — the addendum is gone (cf. DI-018) | NO | leave byte-identical (Q2 a) | verified (unchanged) |
| DI-117 | ADR-042 | L362 | bare L49 | 34504c8 | drifted, frozen (pending worklist) | §"Three further sites, missed by the producer and the lead", *"the Codex CLI row of the external-dependency table"* → §2 Codex CLI row; `0273` has not run | NO | ⚠️ note (end of file) | verified |
| DI-118 | ADR-042 | L363 | bare L272 | 34504c8 | drifted, frozen (pending worklist) | same list, *"inside the **mermaid runtime diagram**"* → §5.3 mermaid review node | NO | ⚠️ note (end of file) | verified |
| DI-119 | ADR-042 | L364 | bare L372 | 34504c8 | drifted, frozen (pending worklist) | same list, *"the narrative walkthrough of the review pass"* → §7 flow 4 | NO | ⚠️ note (end of file) | verified |
| DI-120 | ADR-042 | L371 | bare L372 | 34504c8 | drifted, frozen (pending) | the *"Incidental, noticed while verifying"* remark — a locator for the same §7 flow 4 sentence | NO | ⚠️ note (end of file) | verified |

**Final inbound total: 120 coordinates** (was 94) = P1 57 + P5 36 + P6 1 + P8/P8w 26.

| Class (after round 1) | Coordinates | Treatment |
|---|---|---|
| drifted, live | 18 (16 + DI-098, DI-099) | repaired to heading + quoted fragment |
| drifted, frozen — in an ADR | 14 (8 + DI-010, DI-094, DI-117…DI-120) | ⚠️ drift note |
| drifted, frozen — dated report or closed row | 8 (7 + DI-116) | leave byte-identical; reported |
| unresolvable, reported (D4) | 10 (6 + DI-004 relabel + DI-095…DI-097) | leave byte-identical; reported (DI-087's anchor restored, R6) |
| mentioned | 70 (57 − DI-004, DI-010, DI-094 + DI-100…DI-115) | leave byte-identical |
| correct | 0 | — |

Hazard check for the two ADRs newly noted (in-scope line coordinates into each, from the Step-0 census):

| ADR | In-scope coordinates into it | Blocking under the measured rule? | Placement |
|---|---|---|---|
| ADR-028 | L154, in the cancelled `0323` board row — a specimen quote of `sprint-2.md`'s text | no (a shift does not make it false) | full form: header `Corrections` bullet after `Task:` + note under Required follow-ups item 2 |
| ADR-042 | L317 (correct ×4: the correction-note heading); L379 (`0394` brief — *"carries 3 occurrences, all LOWERCASE"*, false if shifted) | yes — every spot above L379, and the header | one note at the **end of the file**, no header bullet (departure recorded in the note) |

### Fixes applied (diffs against `.fkit/tmp/0393/pr1-before/`)

```
== architecture.md (R1) — 1 line rewritten, 632 → 632 lines
58c58  … | `claude/fkit-claude.sh:274-285`; `claude/skills/fkit-review/SKILL.md:57` |
   →   … | `claude/fkit-claude.sh:539-560` (*"Codex preflight: required, but a WARNING, not a wall"*; `codex_preflight()`); `claude/skills/fkit-review/SKILL.md:57` |
   resolves: launcher L539 "# --- Codex preflight: required, but a WARNING, not a wall ---" … L549 "codex_preflight() {" … L560 "codex_preflight"
   new freeze sha256 df3aabca647406cb2fdff6bfbfc1eb925d1c1c1154b9e666c4608392d7be9b1b

== 0273 brief (R2 b, R6) — 3 lines rewritten, 318 → 318 lines
155  at **site 6 (`:49`)** and                         →  at **site 6 (§2's Codex CLI row)** and
156  at **site 8 (`:372`)**. Measured                   →  at **site 8 (§7's flow *"4 — Review + the adversarial pass"*)**. Measured
219  ⛔ Confirm `:373-375` was **not** touched.          →  ⛔ Confirm §7 flow 4's *"**Degradation is loud and mandatory:**"* citation cluster was **not** touched.
   resolves: architecture.md L58 Codex CLI row; L380 "**4 — Review + the adversarial pass.**"; L383 "**Degradation is loud and mandatory:**"

== ADR-010 (R3): header fifth-append reworded (+3 lines), §Context note reworded (+4), back-pointer block after the 2026-09-03 note (+7)
== ADR-013 (R4): one sentence of this row's note reworded (+1)
== ADR-009 (R4): note title scoped + scope sentence (+4)
== ADR-028 (R5): header Corrections bullet (+5) + note under Required follow-ups item 2 (+20)
== ADR-042 (R2): note appended at end of file (+28)
```

### Verify — re-run after the fixes (2026-09-15)

| Check | Command (as run) | Result |
|---|---|---|
| Group E census | the 0.3 commands, Q1 pathspecs | ✅ **119 occurrences / 24 files**; `claude/` **0**; (path, match) multiset **identical to Step 0** (119 rows) |
| Inbound `architecture.md` colon-line census (P1) | `git grep --untracked -noE` on `architecture.md` + colon + line, Q1 scope | ✅ **43 rows**, (path, match) multiset identical to the pre-round capture; the only positional change is ADR-028's citing line moving down 5 (its own header bullet) — the cited numbers are untouched |
| No inbound coordinate into `architecture.md` shifts | line count before/after + `diff` | ✅ 632 → 632; `diff` shows exactly one changed line (58c58) |
| Per-ADR append-only, vs HEAD and vs before-copy | `git diff --numstat`; `git diff --no-index --numstat <before> <adr>`; deletion filters | ✅ ADR-009 35/0 · 010 48/0 · 011 28/0 · 013 30/0 · 017 12/0 · 022 28/0 · 028 25/0 · 031 11/0 · 042 28/0 — identical both ways; both deletion filters 0 for all nine |
| Correct coordinates into noted files | read each target line | ✅ ADR-009 L22 doc-drift-audit link line, L60 Decision 2 sandbox flag, **L131 "- Evidence:"** (step 16); ADR-013 L160 "## Consequences" … L183 "(already tracked as the wiki-sync task)."; ADR-042 L317 correction-note heading, L379 "- **Historical ADRs**"; ADR-016 untouched |
| `--sandbox` counts in edited files | `grep -c` before/after | ✅ unchanged in all seven (no `--sandbox` string written) |
| Dashboard, `backlog.md` | `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` (exit 0) | ✅ identical to the Build's after-capture; vs Step-0 capture, only the `0145` and `0284` rows differ, coordinate text only. `sprint-9.md` identical to Step 0 |
| Guards | `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` | ✅ **exit 0**, 43 tests, 43 pass, 0 fail |
| Suite | `node --test test/*.test.js` | ✅ **exit 0**, 967 tests, 967 pass, 0 fail. ⚠️ No test reads a doc citation — green proves nothing about this round's edits |
| Not run this round | `bash test/prove-red.sh` | ⚠️ not re-run (no source or test file changed; the driver's run of it is the latest) |

Evidence files (gitignored): `.fkit/tmp/0393/census/r2/` — `guards.pr1.txt`, `node.pr1.txt`, `E-full.pr1-after.txt`,
`P1-inbound.pr1-before.txt`, `P1-inbound.pr1-after.txt`, `p7.py`, `p8.py`, `p8w.py`, `p8-before.tsv`, `p8s-before.txt`;
`.fkit/tmp/0393/dash/backlog.pr1-after.txt`, `sprint-9.pr1-after.txt`.

### Claim observations added in round 1 (D4: reported, not fixed)

16. **ADR-042 §"Three further sites"** says the three `architecture.md` sites are *"OUTSIDE `0273`'s scope"* — dated:
    `0273` was widened to cover them by owner ruling the same day (2026-08-11). Said in the ADR-042 note; not corrected.
17. **The `0287` brief** repeats the stale *"that is `0275` and `0273`"* attribution already reported for its board row
    (observation 12).

Process-review round 1 closed 2026-09-15. No commit; nothing under `ai-agents/wiki-vault/`; no mover.
