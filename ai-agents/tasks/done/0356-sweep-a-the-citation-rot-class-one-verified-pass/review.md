# Review — 0356

Task: `ai-agents/tasks/done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md`
File(s) under review: the whole working tree at `HEAD` `6dcc33e` (*"Sprint push"*) — 24 modified paths
+ the 2 untracked records under review in this folder (`plan.md`, `worklog.md`). ⛔ Two modified paths
are the **driver's** board work and are excluded from this review: `ai-agents/sprints/sprint-7.md` and
this task's own `brief.md`. ⚠️ This ledger is itself a third untracked file in the same folder; it is
the review, not a subject of it.

> ⚠️ **Dated correction 2026-09-03 — the baseline field above was WRONG when first written, and this is
> the reviewer amending its own header.** It read `HEAD` `c45ec3d`. Re-derived firsthand this turn:
> `git rev-parse --short HEAD` → **`6dcc33e`**, which is also the baseline the approved `plan.md`
> names. `c45ec3d` is an **ancestor 12 commits back** (`git rev-list --count c45ec3d..HEAD` → 12), and
> **two files in this review's scope changed between the two** — `ai-agents/knowledge-base/architecture.md`
> and `0287`'s brief — so the wrong value would have made these findings unreproducible for a later
> reader. ⛔ **Cause, named rather than smoothed over:** I transcribed the value from this session's
> stale context snapshot instead of measuring it — the **second** `evidence-before-assertion` slip in
> this review, after asserting the `npm test` counts before the run returned. ⭐ **No finding, severity,
> verdict or coverage state changes:** every check was run against the working tree and against real
> `HEAD` (`git diff` with no ref, and `git show HEAD:bin/release.mjs` for the comment-only proof), so
> the evidence was always taken at `6dcc33e` — only the field recording it was wrong. Amended on the
> owner's ruling of 2026-09-03, live `AskUserQuestion`, option label verbatim
> **"Re-invoke the reviewer to fix it (Rec)."** ⛔ Nothing outside this field was touched.
Status: closed-out
Coverage: **reasoning-only second opinion** (ADR-042 D1 — the normal state, not a degradation) —
⭐ **this is ROUND 2's state, re-determined this round, not carried from round 1.** Codex ran
(`codex-cli 0.152.0`, exit 0) and returned a usable, diff-grounded pass of 5 findings, but every
command it cites is `rg` / `git grep` / `git diff` / `sed` — reading, not measuring. It ran no test,
no script and no behavioural comparison. All execution evidence in this ledger is the reviewer's.

⚠️ **Round 1 is the ONLY round** — owner ruling 2026-09-03, live `AskUserQuestion`, option label
verbatim **"One round over the whole sweep (Rec)"**. Nothing backstops this pass.

> ⚠️ **Dated note 2026-09-04 — the line immediately above is SUPERSEDED, and is left byte-identical.**
> It was true when written. A **second round** was authorised by the owner on 2026-09-03, live
> `AskUserQuestion`, option label verbatim **"Second review round on the new edits only (Rec)"**.
> ⛔ **Round 2's scope is NOT the whole sweep** — it is only the surface no reviewer had seen: member
> `0308`'s twelve `claude/` files and member `0193`'s four files. Everything round 1 dispositioned was
> deliberately not re-reviewed. ⭐ **Why the round exists, in the owner's own terms:** those edits land
> largely in `claude/`, which **neither citation guard scans** — `test/coordination-citation-policy.test.js`
> walks `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`, and `test/reference-integrity.test.js`
> walks `ai-agents/**/*.md`. `npm test`'s green run verifies almost nothing about those twelve files;
> this pass is the only check they get.

⛔ **Locations below are written as heading + quoted fragment, never as a path-plus-line coordinate.**
This is the owner's ruling of 2026-09-02, live `AskUserQuestion` at `0176`'s plan gate, option label
verbatim **"A + file follow-up D (Rec)"** — follow-up **D** amends this table's location column to read
*"heading + fragment where the target is a coordination document."* ⚠️ **D is owner-ruled but NOT YET
FILED and the reviewer skill is NOT YET AMENDED**, so the skill still says `file:line`; the driver
relayed the ruling and the reviewer judges it correct and complies. A coordinate written here would red
`test/coordination-citation-policy.test.js`, which does not exempt open task folders — on the very task
whose subject is citation rot. This task's own brief is stricter still: it bans the form for *every*
target, not only coordination documents.

## Reviewer findings

| # | Round | Sev | Location (heading + fragment) | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `ai-agents/tasks/backlog/0184-record-depends-on-blocks-as-the-binding-execution-order/brief.md` §"What to build" → the *"Preserve the canonical parse-safe flush form"* bullet, fragment *"the task-84 misreport class — the class recorded in … originating in `0107`"*; and `ai-agents/tasks/backlog/0315-define-the-corrections-header-warning-equivalent-for-briefs-and-board-rows/brief.md` → the *"OVER-INCLUDE trailing prose"* bullet, fragment *"the task-84 misreport (the class originates in `0107`; …)"* | ⛔ **The gloss names the WRONG task.** `task-84` is `0092`, not `0107`. Evidence: `ai-agents/knowledge-base/conventions/dependency-declaration-form.md` — the document cited on the same line — reads *"**The failure it prevents (task 84 / `0092`):** that brief wrote"*; `0092`'s `## Priority` is **84**; `0107`'s `## Priority` is **89**; and `0107`'s own brief reads *"task 84 (`0092-wiki-resync-eighth-role…`) declares"*. `0107` is the task that **fixed** the parser gap, not the one that suffered it. Carried into `worklog.md` §"Groups 3–6 classification" too. ⭐ The disposition (gloss, do not rename) is right; its **content** is a newly-authored confidently-wrong citation, in two open briefs, written by the sweep that exists to end that class |
| R2 | 1 | high | `ai-agents/tasks/backlog/0287-wiki-resync-of-the-codex-sandbox-read-only-pages-after-0273/brief.md` §"Notes" → *"The convention page itself is not yet written — that is [`0171`](…), closed 2026-08-22 — so this is stated inline rather than cited."*; `ai-agents/tasks/backlog/0307-decide-how-the-derive-cell-reaches-a-corrected-dependency-line/brief.md` → the `0171` bullet, *"(closed 2026-08-22) — the `durable-citation-anchors` convention page, **in progress as Sprint 6 P2**"*; same file §"Notes" → *"`0171` (closed 2026-08-22; the citation convention in progress)"* | ⛔ **Three of `0309`'s enumerated class-2 sites are HALF-repaired and each now self-contradicts.** The edit changed a neighbouring word and left the **named target text** standing. `0309`'s brief §"The sites — re-measured firsthand 2026-08-22" names the full fragment as the site in each case, including *"in progress as Sprint 6 P2"* and *"not yet written"*. Evidence: `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` **exists on disk**, so *"not yet written"* is false; and *"closed 2026-08-22 … in progress"* is a contradiction on one line, twice. ⚠️ `0309` is on the close list as ✅ **Done** on the strength of these repairs. A contradiction is strictly worse than the rot it replaced |
| R3 | 1 | medium | `ai-agents/tasks/backlog/0309-repair-the-hyphenated-task-nn-citation-class-in-four-open-briefs/brief.md` §"Notes" → the bullet opening *"⚠️ **The `- **Relates to:**` bullet above still calls `0171` "in progress", and that is DELIBERATE.**"*; and §"🆕 SCOPE ADDITION — OWNER RULING 2026-08-22" → the blockquote *"The section "Does this wait on `0171`?" was written 2026-08-15 and calls `0171` "in progress as Sprint 6 P2". That is no longer true, and the sentence is deliberately left byte-identical"* | ⛔ **Two meta-notes describing sites as deliberately-left-stale are now FALSE — the sweep repaired both sites and left the notes standing.** Verified: the `- **Relates to:**` bullet now reads *"closed 2026-08-22"* and the *"Does this wait on `0171`?"* section now reads *"**closed 2026-08-22**"*. Neither note was updated or annotated, and neither appears anywhere in `worklog.md`. ⚠️ Same defect class as this sweep's own subject, introduced by the sweep, in a folder the close list is about to freeze |
| R4 | 1 | low | `ai-agents/tasks/backlog/0356-sweep-a-the-citation-rot-class-one-verified-pass/worklog.md` §"1.2 The frozen membership — 11 IN, 2 OUT", `0197` row, fragment *"`claude/scaffold/CLAUDE.md` is **92 lines** and … is the heading"*; and §"2.2 ⛔ Members whose briefs are WRONG", fragment *"`0275` is built around a fence it states in capitals — that the bare … citation resolves to"* | ⚠️ **Two bare line coordinates survive in the sweep's own worklog, and the verification row that would catch them reads ✅.** Verified: an enumeration over the worklog returns exactly these two. **PARTIALLY CORRECT** — both guards stay green (41/41; neither target is a coordination document and neither hit carries a path token), and plan §2.3 rule 1 bans *"token + colon + digits"*, which a path-less coordinate arguably is not. What is wrong is the **claim**: `worklog.md` §"Decision log" says the six banned forms were all caught and re-anchored, and §"Steps 7 + 8" row 5 reads ✅. The rule-reading itself is the coder's/owner's to settle, not mine |
| R5 | 1 | low | `ai-agents/knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md` → the §Decision 2 appended note, fragment *"It now reads "remains **unrunnable** … Visible-but-blocked, not invisible-and-blocked""* | ⚠️ **One new quoted anchor is not checkable by this repo's own prescribed method — it straddles a line break.** `claude/skills/fkit-team/SKILL.md` ends a line with `Visible-but-` and opens the next with `blocked`; under the whitespace-normalised check `durable-citation-anchors` prescribes (`tr '\n\t' '  ' \| tr -s ' '`) it becomes `Visible-but- blocked`, with a space, so the fragment matches neither a plain search nor the normalised form. ⭐ The **claim is TRUE** — Codex overstated this as "does not exist"; the words are there. What fails is the anchor's checkability, which is the entire reason the sweep prefers quotes to numbers. Plan §4 item 3 required naming which of that page's limits a check did not cover; this was not named. ⭐ I re-resolved **every other** new anchor quote in `architecture.md`, ADR-010, ADR-012, ADR-042, `0156`'s brief and `bin/release.mjs` against disk: all single-line, unique, correct. This is the only straddler |
| R6 | 1 | low | `ai-agents/knowledge-base/architecture.md` §"9.4 The `.claude/` copies are gitignored and destroyed on every launch" → *"…'s `rm -f …` + `cp` refresh does an `rm -f` + `cp` of `fkit-*` agents and skills on every single launch"*; and §"Structure conformance" → *"**The launch notice** (task 0247 — landed; `structure_notice()`, `claude/fkit-claude.sh`, `structure_notice()`)"* | ⚠️ **Two mechanical substitutions now stutter.** The first states the `rm -f` + `cp` twice in one sentence; the second names the same symbol twice in one parenthetical. Both **anchors are correct** — only the prose is damaged. Cosmetic, but this file is the project's architecture reference |
| R7 | 1 | low | `ai-agents/knowledge-base/architecture.md` §"System context and external dependencies" → the **GitHub, over the network** row, which still carries an `install.sh` coordinate; and `ai-agents/knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md` §Evidence, which still carries a `0265` review-ledger coordinate | ⭐ **FRONTIER-MOVE, already declared — recorded so it is visible, NOT for re-fixing.** My own added-lines screen returns exactly these two and nothing else. `worklog.md` §"Verification step 5, adjudicated" already adjudicates the class as pre-existing-and-correct riding across a line rewritten for a *different* citation. I checked that reasoning and accept it: neither is fresh authoring, and neither file is in the citation guard's scanned set. ⛔ Codex raised both as violations; I disagree with Codex |
| R8 | 1 | low | `ai-agents/tasks/backlog/0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md` → §"the check", fragment *"`0309` `0320` `0261` `0263` byte-identical against their own snapshots"* | ⚠️ **One of `0321`'s own verification clauses is unsatisfiable in a combined sweep, and `worklog.md` does not name it** among its declared deviations. All four files were edited by other members of this same pass. ⭐ Every **other** clause of that check holds — I re-measured: exactly two `Task` cells changed, no board rank added, *"still `🔄 In progress`"* still present (2 occurrences), every `derive` line unchanged, `⟦FACTS⟧` identical, `sprint-7.md` untouched by `0321`, **0 drift records on both live boards** |
| R9 | 2 | medium | `ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/brief.md` → the §"Dated correction 2026-09-03 (`0193`, inside sweep `0356`) — five stale facts in this closed brief, repaired" blockquote, its closing paragraph, fragment *"that conflict is **returned to the owner unresolved** rather than settled by this run. ⚠️ **It is still outstanding.**"* | ⛔ **FALSE, and contradicted by a record edited in this SAME sweep.** Owner ruling **H12** (verbatim *"A — annotate, don't remove (Rec)"*) settled `0193` defect 2, and the H12 pass annotated the archived board's `0158` row accordingly — that board's own defect-7 flag now reads *"`0193`'s defect 2 … was **NOT removed.** It is annotated in place under owner ruling H12"*. The `0158` note was written by the **pre-H12** pass and was never revisited when H12 landed (worklog §"Continuity note — the gap between H11 and H12" records that the H12 pass wrote **only** the two archived-board edits). ⚠️ It also contradicts **itself**: the same note's table row 1 already *applies* the ruling (*"⚠️ **Left byte-identical** — it is a coordinate inside a closed record"*). ⛔ **Raised by both reviewers.** ⚠️ **This is round-1 finding R3's class recurring one file over** — a meta-note describing a state the sweep then changed, left standing |
| R10 | 2 | medium | `ai-agents/tasks/backlog/0180-build-the-brief-missing-merit-guard/brief.md` §"⚠️ Two accepted costs the report names — carry BOTH from day one" → cost (a), fragment *"every one names its neighbour by folder ID, which is the canonical form"* | ⚠️ **PARTIALLY CORRECT — the measurable half holds, the universal clause does not.** ⭐ The first half (*"found **no** remaining bare-rank merit statement"*) I re-measured and **CONFIRM**: the only bare-rank merit text in any open brief is `0180`'s **own** illustrative example. The trailing clause fails twice. (1) Of the **35** open briefs carrying a merit line, **24** merit lines name **no** folder ID at all — they read *"the **Backlog**, unranked, and that is honest"*, and one reads *"as ranked"*. (2) **16** open briefs still use the **legacy** `**On merit this belongs …**` shape, which `0180`'s own table two screens above classifies as *"fails **shape** — none matches `**On merit:**`"* — so calling what the sweep found *"the canonical form"* contradicts this brief's own §1 definition. ⛔ **`0180` is an OPEN brief that will be implemented from**, and this sentence would mis-size its backfill. ⛔ Raised by both; Codex found half (1) and rated it low — I rate it medium and add half (2) |
| R11 | 2 | medium | `ai-agents/tasks/backlog/0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md` §"The population, re-derived on disk 2026-08-15" → the pinned pattern `\btask[ -][0-9]{1,2}\b`; manifesting in `claude/skills/fkit-status/dashboard.sh` at the folder-recovery branch, fragment *"# Link rot (tasks 21/22): the FOLDER moved between boards."* | ⛔ **THE POPULATION PATTERN IS SINGULAR-ONLY, SO THE PLURAL SPELLING WAS NEVER TRIAGED.** `\btask[ -]…` cannot match `tasks NN`. Measured firsthand: **5** plural-form occurrences in `claude/` (excluding `scaffold/`), **all** in `dashboard.sh`, **all present unchanged at `HEAD`**, and **none of them appears in the worklog's 48-row triage table** — whose closing line reads *"⛔ **Every occurrence has a row.**"* At least one is a genuine provenance citation of exactly the repaired class: rank **21** resolves to `0076-repair-broken-links-in-closed-sprint-plans` and rank **22** to `0050-harden-task-movers-against-closed-sprint-link-rot`, both matching the comment's own subject — the identical `(task 65)` / `(task 67)` / `(task 76)` form repaired 27 times elsewhere. ⚠️ **`0309` — a member of this same sweep — exists BECAUSE a prior sweep's pattern missed the *hyphenated* spelling.** This is the same failure one spelling over. ⭐ **NOT a deviation and NOT a coder error:** the brief pins this pattern as its own verification step 1, the coder executed it exactly, and the 48 → 21 counts reproduce firsthand. What is wrong is the **completeness claim**, not the execution. ⛔ **Codex reproduced the same blind spot** — it re-ran the singular pattern and reported *"silent no-writes: none"*. **Whether to widen now or file a follow-up is the owner's call** |
| R12 | 2 | low | `ai-agents/tasks/backlog/0180-build-the-brief-missing-merit-guard/brief.md` §"⚠️ Two accepted costs the report names" → the **unchanged** sentence immediately below the inserted block, fragment *"As written today that line is caught, but only by the **presence** half, for being in the legacy shape."* | ⚠️ **Stale by omission — the sweep changed the referent and left the sentence standing.** Verified from the diff: the change replaces one line and adds ten above this one, which is **untouched**. Under **either** reading of *"that line"* it is now false. (a) `0158`'s live merit line now reads *"**On merit:** immediately below `0142`"* — the **canonical** shape, caught by neither half. (b) The preserved specimen the insertion redirects to sits inside a blockquote table with its `**` bold markers dropped, so it does not match the legacy `**On merit this belongs …**` shape either. ⚠️ **Consequently `0180`'s new claim that the correction *"preserves the original wording **verbatim**"* is an overstatement**: the **words** survive (I confirmed the fixed string occurs exactly once on disk), the **markup** does not — and markup is precisely what a *shape* guard matches on |
| R13 | 2 | low | `ai-agents/sprints/done/sprint-2.md` → the `0158` row's H12 annotation, fragment *"⭐ **search that phrase, not the number**, which has drifted twice since it was written"*; and the mirrored table row 1 in `0158`'s own brief | ⚠️ **The durable anchor this annotation prescribes now resolves to TWO places in each file, because quoting it is what made it ambiguous.** Measured: the fixed string *"⚠️ The placement below is producer judgment, not an owner ruling."* occurred **1×** in the archived board at `HEAD` and occurs **2×** now; **1× → 2×** in `0158`'s brief likewise. A reader obeying *"search that phrase"* now gets the annotation telling them to search, alongside the target. ⭐ The target is still findable and the substance is right — but the **prescribed method no longer resolves uniquely**, and neither annotation names the target's heading, which `durable-citation-anchors` asks for. ⚠️ Round-1 finding **R5**'s class (an anchor that is not checkable by the repo's own prescribed method) recurring. ⛔ **Codex's catch — I had missed it**; I verified the counts myself |
| R14 | 2 | low | `claude/skills/fkit-status/dashboard.sh` → `depends_raw()`, the loud-guard fall-through comment, fragment *"the live task-84 misreport, named for specimen brief `0092`"* | ⚠️ **This one line is NOT a shell comment — it sits INSIDE a single-quoted `awk` program**, so its bytes are shell *string data*. ⛔ **Codex rated this HIGH; I DISAGREE and rate it low — impact is nil, and I proved it rather than argued it:** `bash -n` is clean, and `dashboard.sh` at `HEAD` vs the working tree emits **byte-identical stdout and stderr** across 6 renders (three boards × render/`identity`) plus `select-active`. `#` is an awk comment too, and the inserted text contains no apostrophe. ⭐ **What is real is the latent hazard and the imprecise claim:** the file carries an explicit standing warning four lines above the edit — *"NB: no apostrophes in this comment — it lives inside a single-quoted awk program"* — and the sweep edited past it. A single `'` here would break the launcher's board rendering. The coder's blanket *"every edit is comment/prose only"* needs this one qualification |
| R15 | 2 | low | `ai-agents/tasks/backlog/0180-build-the-brief-missing-merit-guard/brief.md` §"⚠️ Two accepted costs the report names" → the inserted block, fragments *"the trap below is unchanged and still real — it is a property of the check, not of this one brief"* and *"…not of any one brief"* | ⚠️ **Prose damage in the sweep's own authoring.** The clause is stated **twice** in one paragraph (measured: 2 occurrences of *"trap below is unchanged and still real"*), and the block asserts the specimen *"is no longer live on disk"* then, three sentences later, *"**But the specimen itself still EXISTS ON DISK**"*. Both are recoverable in context and the underlying facts are sound — but this is round-1 finding **R6**'s class recurring, in an **open** brief that will be implemented from. ⛔ Raised by both reviewers |

### Disproven — ⛔ do not chase

- **Codex findings 4 and 5** — that re-pointing `0218`'s worklog `**Plan:**` locator and `0248`'s plan
  `**Task:**` locator in place violates the frozen-record rule. **INCORRECT.** `0343`'s brief §"What to
  build" item 1 directs it in terms: *"Re-point the board segment of the two locators — `tasks/backlog/`
  → `tasks/done/` — and change nothing else on either line"*, under the owner's 2026-08-26 ruling
  *"Header block only (Recommended)"* and the 2026-08-23 precedent *"Re-point them, add rule to
  task-done (Recommended)"*; owner ruling **H1** routes both through their own rulings. Verified: each
  edit is 1 insertion / 1 deletion, board token only, and both re-pointed targets exist on disk. Codex
  reasoned from the general rule without the member's specific ruling.

### Claims I re-measured firsthand and confirm

⛔ Not a courtesy list — each of these was a claim I could have found false, and did not.

- Both guards **41 tests, 41 pass, 0 fail, 0 skip** after the diff (I ran them).
- `npm test` **833/833, 0 fail, 0 skip**; `test/prove-red.sh` **hard gate PASSED**, all 28 mutations
  redding their *named* assertion, including 25/26 (`--branch` guards) and 27 (the R5 clause) which the
  `bin/release.mjs` comment edits sit closest to.
- `bin/release.mjs` is **comment-only**: comment-stripped working tree is byte-identical to `HEAD`, and
  **zero** coordinates remain in the file.
- Append-only claims: ADR-010 **58/0**, ADR-012 **57/0**, `0261`'s brief **8/0**, `0263`'s brief **8/0**.
  `architecture.md` **21/21**, 623 lines both sides — the "one-for-one, no line-count shift" claim holds.
- **0 drift records** on `ai-agents/sprints/backlog.md` and `ai-agents/sprints/sprint-7.md`.
- The other two ID remappings are **correct**: `task-70` → `0008` (`0008`'s `## Priority` is 70, and
  `claude/skills-for-role.sh`'s warning block opens *"Task 70 followed the two-item list precisely"*);
  `pre-task-18` → `0073` (`0073`'s `## Priority` is 18, and it is the folder that removed the
  passthrough `test/prove-red.sh` mutation 2 restores). `task-68` was re-anchored on the test rather
  than the numeral, and its quoted assertion *"the free-text qualifier leaks nowhere"* exists exactly
  once in `test/dashboard-contract.test.js`.
- The ADR-012 note's factual claims: the `lead` arm of `skills_for_role()` really does grant **five**
  skills; `_fkit_remote_version()`, the `fkit update` case block, and *"Invoke the **fkit-architect**
  agent"* all exist where the note says.
- The `bin/release.mjs` R5 rationale rewrite is **factually sound**, not a smuggled prose change:
  `0300` made `--branch` require HEAD's branch and the file assigns the push ref from `headBranch`, so
  the new comment's claim is true today, and mutations 25–27 still red correctly. ⛔ Not a finding.

---

### ROUND 2 — reviewers run, and what was checked

⛔ **Scope: the NEW edits only** — `0308`'s twelve `claude/` files and `0193`'s four files. Round 1's
surface was deliberately not re-reviewed. ⚠️ Several other paths in `git status` are the **closing
producer's** folder moves and href re-points; those are out of scope and were excluded by attribution,
not by assumption (see the `0197` row below).

**Two reviewers ran.** My own pass, plus the Codex adversarial pass (`codex-cli 0.152.0`, exit 0,
`--sandbox read-only`), which returned **5 findings**. ⛔ **Nothing was skipped.** Coverage state for
this round is stated once in the header and once in the report — **reasoning-only second opinion**.

**Where the two reviewers landed.** R9, R10 and R15 were raised by **both**. R13 and R14 are **Codex's
alone** — R13 is a catch I had missed and verified; R14 I **downgraded from Codex's HIGH to low** after
proving impact nil. R11 and R12 are **mine alone**; on R11 Codex reproduced the very blind spot the
finding is about.

### Claims I re-measured firsthand this round and CONFIRM

⛔ Not a courtesy list — each was a claim I could have found false, and did not. ⚠️ **Every figure below
was measured before it was written**, after round 1's two evidence-before-assertion slips.

- **Comment/prose only — proved behaviourally, not argued.** 58 changed lines across the twelve files:
  48 shell `#` comments, 10 markdown prose lines, **zero** executable lines. `bash -n` clean.
  `dashboard.sh` at `HEAD` vs the working tree emits **byte-identical stdout AND stderr** on all three
  boards (`sprint-7`, `backlog`, archived `sprint-2`) in both render and `identity` modes, **and** on
  `select-active`. ⚠️ One qualification, recorded as **R14**.
- **The structure manifest is not implicated.** `claude/structure-manifest.tsv`'s walk covers
  `claude/scaffold/` and the four root context files only; **none** of the twelve files is in it.
- **All twelve rank→folder resolutions re-derived independently**, and each checked on **subject**, not
  merely on the `## Priority` number: `36→0072` (omnigent orphan residue), `26→0088` (stop init failure
  bricking the launcher), `81→0036` **Part D** (the installer's hard-coded role count, owner-ruled),
  `14→0012` (the producer's brief-creation skill), `27→0069` (weird `ai-agents/` state), `64→0054`
  (spawned mover invocation, the X1 finding), `44→0074` (one-skill-one-output), `67→0001` (the backlog
  board), `41→0020` (the dashboard script), `76→0062` (the folder migration), `65→0039` (the open-work
  filter), `80→0078` (the vault resync that sat `🔄 In progress`). ⭐ **All twelve correct.**
- **The ambiguity claim is exactly right.** Ranks **9 / 12 / 13** each resolve to **three** folders
  (my first parser said two; I re-parsed and the coder's figure is the correct one). ⭐ **And no repair
  depends on them** — every surviving `task 9` / `task 12` / `task 13` sits in illustrative
  parser-grammar sample text, and none of the 27 repairs used those ranks. ⛔ Verified, not accepted.
- **The silent-no-write recovery is complete.** Re-run with the brief's own command: **48 → 21**;
  `claude/scaffold/` **0**; `task 43` **0**. Diffstat **29 insertions / 29 deletions** across 12 files
  = 27 repairs + 2 glosses, reconciling to the triage's **27 · 2 · 2 · 17 = 48** exactly. ⭐ The claim
  that no wrong content reached disk survives the test.
- **Both fenced `Task 70` sites are byte-identical to `HEAD`**, and `0226`'s anchor *"Task 70 followed
  the two-item list precisely"* still resolves in **both** files — the fencing rationale is real, not
  asserted.
- **The two `task-84` glosses name `0092`** — matching round-1 R1's corrected value. ⛔ **No regression
  of R1.**
- **`0193` defect 2 / H12 — the deviation is genuine and correctly executed.** The line-numbered pointer
  into the archived board occurs **2× at `HEAD` and 2× now** (byte-identical), and the annotation is
  present and quotes the option label verbatim. ⛔ **Correctly NOT reported as a defect — it is ruled.**
  ⚠️ What **is** reported is the mirror note that H12 left behind: **R9**.
- **`0193` defect 7.** `0162`'s `## Priority` is **128**, its board row is **P128**, the two original
  P127 bullets are **byte-unchanged**, and `0162`'s board row does **not appear in the diff at all**.
- **`0158`'s repaired merit line is factually right:** `0142` is **P122** and `0158` is **P123**, so
  *"immediately below `0142`"* holds.
- **`0180`'s trap still works.** The fixed string *"On merit this belongs at 122 — immediately below
  0142 (P121)"* occurs **exactly once** on disk, so the specimen the guard is measured against is still
  greppable. ⚠️ Two caveats on it are **R12**.
- **Table integrity.** Every added blockquote table row carries a consistent pipe count — **no repeat of
  round-1 R4's split-row damage**.
- **Tests, run this round, not carried:** `npm test` → **833 tests, 833 pass, 0 fail, 0 skipped**;
  `test/prove-red.sh` hard gate **PASSED**, **28/28** mutations redding their named assertion. The two
  citation guards → **41 tests, 41 pass, 0 fail, 0 skipped**. ⚠️ **This green run proves very little
  about `0308`'s twelve files** — neither guard scans `claude/` — which is the whole reason this round
  exists. It is a regression gate, not a coverage gate.

### Re-litigates settled decisions (suppressed) — ⛔ recorded, never dropped

- **Pre-existing coordinates carried across a rewritten line** — accepted residual R7 (below). Its
  re-raise condition is *"a coordinate on an added line is shown to be **newly authored**"*, and it is
  **NOT met**. My added-lines screen over the sixteen in-scope files returns **5** coordinate hits, all
  in the archived board: one is the H12-ruled byte-identical pointer, and the other **four** ride on the
  `0197` row whose **only** change is the closing producer's `backlog/` → `done/` href re-point — I
  attributed that hunk word-by-word rather than assuming it. ⛔ **Suppressed.**
- **`0321`'s solo-run verification clauses vs. a combined sweep** — accepted residual R8. Neither
  re-raise condition is met, and the subject is outside this round's scope. ⛔ **Suppressed.**
- **`0193` defect 2 left byte-identical** — owner-ruled under **H12**. ⛔ **Not reported as a defect.**
  Recorded above as verified-compliant instead.

### ⭐ ROUND 2 convergence call — ACT, do not close out yet

⛔ **This round does NOT converge, and none of it is re-litigation.** All seven findings are new
surface: five are the sweep's **own authoring** (R9, R12, R13, R14, R15) and two are **claim/coverage**
defects (R10, R11). **Zero** matched an accepted residual or an ADR's *"Re-raise only if"* — the
suppressed list above exists because I checked, not because anything was found.

⚠️ **The pattern worth naming, loudly: three of the seven are round-1 classes RECURRING, not new
classes.** R9 is R3's class (a meta-note describing a state the sweep then changed), R13 is R5's class
(an anchor not checkable by the repo's own prescribed method), R15 is R6's class (stuttering prose).
Round 1 repaired each **per site** and marked them `✅ done`; the classes came back one file over in the
very next pass. ⭐ **That is the signal, not the individual severities** — per-site repair is not
closing these classes, and a fourth round would likely find them again in whatever the next pass edits.

⚠️ **R11 is the one finding that is not the coder's to have avoided.** The brief pinned the search
pattern as its own verification step, the coder executed it exactly, and every count reproduces. The
gap is in the **population definition**, which makes its disposition an owner call rather than a fix.

**Recommendation: act on R9 and R12 (both are false statements now standing in briefs), record R10 and
R11 as the owner directs, and treat R13–R15 as cheap prose/precision repairs.** ⛔ **This is a
recommendation, not an authorization** — any code or document change is a new, coder-initiated step.

## Coder response

⛔ **The per-round owner gate did NOT run in this round, and that is ruled, not skipped.** This task
runs under `/fkit-sprint-ship-loop`'s standing approval (ADR-019 discipline, carried by ADR-032): the
owner approved `plan.md` once, live, and dispositioned every finding below in the same session. So the
Status value `pending approval` is **never used here**; the other five apply. Every fix landed
`✅ done` in this round.

⭐ **Severity is mine, derived from the blast radius I traced — not inherited.** Where I agree with the
reviewer's label I say so; the agreement is a conclusion, not deference.

| # | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | **Defect** (mine — authored by this sweep) | ⭐ **Repaired at all three sites** under owner ruling **H8** (*"Repair now — the sweep authored it (Rec)"*). ⛔ **I re-derived the correct ID myself and did not take `0092` on anyone's word:** `0092`'s `## Priority` is **84**, `0107`'s is **89**, `0107`'s own brief reads *"task 84 (`0092-wiki-resync-eighth-role…`) declares"*, and `dependency-declaration-form.md` — the page cited on the same line — reads *"The failure it prevents (task 84 / `0092`)"*. `git diff` confirms the wrong gloss is a `+`-added line in **both** briefs, so it is this sweep's own authoring, not carried rot. Sites: `0184`'s brief §"What to build" → the *"Preserve the canonical parse-safe flush form"* bullet; `0315`'s brief → the *"OVER-INCLUDE trailing prose"* bullet; and this task's `worklog.md` §"Groups 3–6 classification" | ✅ done |
| R2 | **CORRECT** | **Defect** (mine) | ⭐ **All three half-repairs completed** under owner ruling **H7** (*"Repair R2/R3, then close 0309 (Rec)"*). `0287`'s §"Notes" now reads *"was not yet written when this brief was filed"* — the tense is what made it false, since `durable-citation-anchors.md` **is** on disk (I confirmed the file exists). `0307`'s `0171` bullet drops *"in progress as Sprint 6 P2"*; `0307`'s §"Notes" `- **Relates to:**` bullet drops *"in progress"*. ⚠️ **Checked before editing the `Relates to:` bullet:** `0307`'s `**Depends on:** nothing.` is a **BL** declaration and the dashboard's over-include rule could have swallowed the neighbouring bullet into the derived cell. It does not — `derive 0307 depends="nothing."` before and after. ⛔ Not assumed; measured | ✅ done |
| R3 | **CORRECT** | **Defect** (mine) | ⭐ **Both meta-notes corrected** under **H7**, by **dated 2026-09-03 append beside each**, not by rewriting them. Both sites they describe were verified repaired by `git diff` (the `- **Relates to:**` bullet and the `### Does this wait on `0171`?` section both now read *"closed 2026-08-22"*). ⭐ **Append, not rewrite, on purpose:** each note records *why* a site was deliberately left standing, which is real history; deleting it would destroy the reasoning, and leaving it bare would assert something false. The append says the note describes the **pre-repair** state. ⛔ The scope addition's table B enumerating the sites is a **dated record** and is left byte-identical | ✅ done |
| R4 | **PARTIALLY CORRECT** — correct on the facts, and the rule-reading was the owner's to settle | **Defect** (mine) | ⭐ **Both re-anchored** under owner ruling **H9** (*"Yes — re-anchor the two (Rec)"*): the brief's ban reaches a **path-less** bare coordinate too. ⛔ **I re-enumerated rather than trusting the count** — my own screen over `worklog.md` returned exactly these two and nothing else, and returns **zero** after the repair. The `0197` row now reads *"the brief's range opens on the heading `## The fkit agent team`"*; the `0275` finding now names *"the bare line-range citation its own brief quotes"*. ⚠️ **A repair of my repair, caught by me:** the first substitution broke the `0197` row across two lines, splitting a markdown table row; rejoined. ⭐ The reviewer's *"PARTIALLY CORRECT"* was on the rule-reading only — on the measurement it was exactly right | ✅ done |
| R5 | **CORRECT** | **Defect** (mine) | ⭐ **Re-quoted as two single-line fragments** under owner ruling **H10** (*"Fix R5 and R6 (Rec)"*). I reproduced the failure first: the target ends a line with `Visible-but-` and opens the next with `blocked`, so under the whitespace-normalised form `durable-citation-anchors` prescribes the phrase becomes `Visible-but- blocked` and matches neither form. The note now quotes *"remains **unrunnable** — invoking it is denied regardless"* and *"blocked, not invisible-and-blocked"*, **each re-resolved against the target: 1 match each, under the normalised form**. It also now names the limit the original check did not cover, which plan §4 item 3 required. ⭐ The reviewer was right that the **claim** was true and Codex's *"does not exist"* was an overstatement. ⛔ `0232`'s hard `+N / −0` rule re-checked: the file is **61 / 0** — deletions still zero | ✅ done |
| R6 | **CORRECT** | **Defect** (mine) | ⭐ **Both de-stuttered** under **H10**. `architecture.md` §9.4 now states the `rm -f` + `cp` once; §"Structure conformance" names `structure_notice()` once. ⛔ **Both durable anchors kept and re-resolved against their source files** (fixed-string match, 1 each). The file holds at **21 / 21, 623 lines both sides** — the one-for-one, no-line-count-shift claim survives the repair. ⚠️ **My first re-resolution reported the `rm -f` anchor missing; that was my own regex** (an unescaped `*`), not a bad anchor — recorded because a mis-run check that I had reported as a failure would have been a false finding | ✅ done |
| R7 | **CORRECT — and I reached the same conclusion independently** | ⭐ **Frontier-move** | ⛔ **NOT FIXED — accepted residual** under owner ruling **H10** (*"Residual R7 and R8 (Rec)"*). I re-ran the added-lines screen myself: it returns exactly two coordinate hits and nothing else, and **both exist unchanged at `HEAD`** (`git show HEAD:… \| grep -c` returns 1 for each). Each rides on a line the sweep rewrote for a *different* citation on the same line. ⭐ **So this is not fresh authoring**, and the worklog's prior adjudication of the class is one I verified rather than inherited. Re-fixing it would re-open a settled call and reach targets no member of the frozen membership owns | won't fix (frontier) |
| R8 | **CORRECT, and INCOMPLETE in my favour — it understates the conflict** | ⭐ **Frontier-move** | ⛔ **NOT FIXED — accepted residual** under **H10**. Verified: three of the four files are modified in this pass. ⚠️ **I traced further than the finding did:** `0321`'s clause **10** (*"`git status --porcelain` shows changes only at"* `backlog.md` and its own folder, ⛔ *"Nothing under `claude/`, `ai-agents/tasks/done/` … or `ai-agents/knowledge-base/`"*) is unsatisfiable in a combined sweep for the same reason, and is **strictly wider** than the clause 9 the reviewer named. ⭐ Both are unsatisfiable **by the owner's own routing** — H-rulings put `0320`'s and `0321`'s work in one pass — so the clauses were written for a solo run and the conflict is structural, not a defect. ⛔ **Named in `worklog.md`'s declared deviations**, which the finding correctly said it was missing | won't fix (frontier) |

### Round 2 — R9–R15

⛔ **Same two carve-outs as round 1** (standing approval; `pending approval` unused). ⭐ **Severity is
mine.** ⚠️ **Three of these seven are round-1 classes RECURRING one file over — flagged before the
table, not after: R9 is R3's class, R13 is R5's class, R15 is R6's class.** See the oscillation call.

| # | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R9 | **CORRECT** | **Defect** (mine — R3's class recurring) | ⭐ **Dated 2026-09-04 correction APPENDED beside the note**, under owner ruling **H15** (*"Dated append beside it (Rec)"*) — ⛔ **the note itself is NOT rewritten**, so what was true when written survives. Verified firsthand: the note says defect 2 is *"returned to the owner unresolved"* and *"still outstanding"*, while the archived board's `0158` row already carries the **H12** annotation, and the note's **own table row 1** already applies that identical treatment to the identical pointer. So it contradicted both the board and itself. ⚠️ My append adds **11 lines, 0 deletions** — the closed brief's earlier repairs are `0193`'s, under `0193`'s own rulings | ✅ done |
| R10 | **PARTIALLY CORRECT — and I could not reproduce one of its figures** | **Defect** (mine) | ⭐ **Clause corrected in place** under **H14** (*"Repair all three now (Rec)"*). ⭐ **I re-measured rather than inheriting, and the direction holds while a number does not.** Confirmed: **35** open briefs carry a merit statement, and **no** bare-rank statement survives (only `0180`'s own illustrative example). Confirmed false, twice: **16** use the legacy `**On merit this belongs …**` shape which this brief's own table calls *"fails **shape**"*, and — ⚠️ **my figure, not the reviewer's** — **14** of the 35 name **no** neighbour at all. ⛔ **The finding says 24 name no folder ID; that does not reproduce for me at file granularity, and I wrote 14.** The repair states the figures as **dated** and tells the implementer to re-run them | ✅ done |
| R11 | **CORRECT — and INCOMPLETE: I found a 6th occurrence it missed, in the one place `0308` pins a hard zero** | ⭐ **Frontier-move** (scope, ruled) | ⛔ **`0308`'s sweep NOT widened** — owner ruling **H16** (*"File a follow-up task (Rec)"*). Verified: `\btask[ -][0-9]{1,2}\b` cannot match `tasks NN`, so the plural was never triaged. Re-measured: **5** plural occurrences in `claude/` excluding `scaffold/`, all in `dashboard.sh`. ⚠️ **Beyond the finding — `claude/scaffold/` returns a 6th** (`priority-is-rank-not-identity.md`), and `0308`'s brief pins scaffold at *"0 ⭐ and must stay 0"*. ⭐ **`0308`'s pinned check still passes** — the singular pattern over `scaffold/` is **0** — and the 6th is **pre-existing at `HEAD`** in a file this sweep never modified, so it is **not** a `0308` regression. ⛔ Returned as a producer follow-up with these figures. `0308` still closes | won't fix (frontier) |
| R12 | **CORRECT** | **Defect** (mine, by omission) | ⭐ **Repaired** under **H14**. Verified: the sentence was a diff **context** line — the sweep changed its referent and left it standing. `0158`'s live merit line now reads *"**On merit:** immediately below `0142`"* — **canonical** shape, so *"for being in the legacy shape"* was false. ⭐ **I traced the second reading too:** the preserved specimen sits in a **closed** brief, outside the guard's in-scope set, so the guard never fires on it — the repair says that explicitly, because the finding was right that this sentence would **mis-size the backfill**. ⚠️ **Severity: I rate this MEDIUM, not the reviewer's low** — `0180` is open, will be implemented from, and this sentence tells the implementer which half of the check catches the case | ✅ done |
| R13 | **CORRECT** | ⭐ **Frontier-move** | ⛔ **NOT re-anchored — accepted residual** under owner ruling **H17** (*"R13: accept + record residual (Rec)"*). Re-measured firsthand, fixed-string: the anchor phrase occurred **1×** at `HEAD` and occurs **2×** now in the archived board, and **1× → 2×** in `0158`'s brief — ⭐ **quoting the anchor is what made it ambiguous**, which is a genuine self-defeat of the durable-anchor method, not a slip. The owner's reason stands: re-anchoring an **H12-ruled** annotation is a bigger act than the defect. Full entry recorded below | won't fix (frontier) |
| R14 | **CORRECT — and I agree with the reviewer AGAINST Codex on severity** | **Defect** (hazard, not behaviour) | ⭐ **Hazard note added beside the gloss** under owner ruling **H18** (*"R14: add a hazard note (Rec)"*). Verified: the gloss does sit inside a single-quoted `awk` program, so its bytes are shell **string data**. ⛔ **Comment-only, and the behaviour proof was re-established BY ME, not quoted:** `HEAD` vs the working tree emit **byte-identical stdout AND stderr across all 14 streams** (3 boards × render/`identity`, plus `select-active`) — measured **before** my edit and **again after**, so the proof survives it. `bash -n` clean. ⚠️ **My note itself contains ZERO apostrophes** — asserted programmatically before writing, since one apostrophe would close the quote and break the script. ⛔ Codex rated this **high**; I rate it **low** — impact is nil and proved so | ✅ done |
| R15 | **CORRECT** | **Defect** (mine — R6's class recurring) | ⭐ **Repaired** under **H14**. Verified: *"trap below is unchanged and still real"* occurred **2×** in one paragraph, and the block asserted the specimen *"is no longer live on disk"* then, three sentences later, *"still **EXISTS ON DISK**"*. Both measured before the edit and re-measured after: the clause is now **1×** (whitespace-normalised — it wraps a line) and the contradiction pair is **0**. ⭐ The contradiction was real but **verbal, not factual**: the two sentences meant *"no longer a live defect"* and *"still preserved as history"*, which the repair now says in those words | ✅ done |

### ⚠️⚠️ OSCILLATION CALL — stated loudly, and it is NOT a reason to stop

⛔ **Three of round 2's seven findings are round-1 classes recurring one file over**, and every one of
those round-1 rows was marked `✅ done`:

| Round 1 | Round 2 | The class |
|---|---|---|
| **R3** — a meta-note describing a state the sweep then changed | **R9** | Stale self-description |
| **R5** — a durable anchor that does not resolve as prescribed | **R13** | Anchor checkability |
| **R6** — prose damage in the sweep's own substitution | **R15** | Self-inflicted prose defect |

⭐ **This is NOT re-litigation and must not be closed out as such.** Each round-2 row is a **different
site in a different file**, found in edits that **did not exist** when round 1 ran — `0193`'s and
`0308`'s work landed after it, under ruling **H11**. Round 1's fixes were correct and remain correct.
⛔ **What recurred is the CLASS, because round 1 fixed each instance per-site and nothing generalised
the lesson** — which is exactly the signal the method says to raise proactively rather than wait to be
asked.

⛔ **I did NOT design a remedy.** Owner ruling **H19** (*"File it as a follow-up for the architect
(Rec)"*) routes a convention/procedure change with repo-wide reach to the architect. The reviewer's
suggested shape — a sweep-completion step, *"re-read every note that describes a state you changed"* —
is carried as **evidence in the follow-up, not as a decision.**

### ⭐ Convergence call — round 2

**Act, then close.** Five defects repaired (R9, R10, R12, R14, R15), two frontier-moves recorded
(R11, R13). ⭐ **Nothing was suppressed as re-litigation**, and the three settled items the reviewer
correctly did not re-raise stay settled: residual **R7** (re-raise condition *"newly authored"* — **not
met**), residual **R8**, and **`0193` defect 2** (H12-ruled, verified compliant, **not a defect**).

⚠️ **Round 2 was scoped to 16 files, so it is not a re-review of round 1's surface.** Combined with the
oscillation above, that means: ⛔ **the class-level risk is NOT closed by this round** — it is handed to
the architect (H19). Closing the ledger records that the **findings** are dispositioned, ⛔ **not** that
the recurring class is solved.

#### Round 1's call, retained

**Act, then close — and this round converges.** R1–R6 are **six defects this sweep itself authored**,
not re-litigation: five were `+`-added lines in the sweep's own diff and the sixth is a claim in its own
worklog. ⛔ **None matches an accepted residual** (the ledger had none) **or an ADR's *"Re-raise only
if"***, so nothing was suppressed as settled this round, and the suppressed list is **empty**. R7 and R8
are the only frontier-moves, both now recorded below so a later round cannot re-open them.

⚠️ **The convergence is real but it is not a coverage claim.** Round 1 is the only round (owner ruling
*"One round over the whole sweep (Rec)"*), so **nothing backstops these repairs** — and per `plan.md` §0
the two guards are a **regression** gate, not a coverage gate: `ai-agents/knowledge-base/` and
`bin/release.mjs` sit outside the citation guard's scanned set entirely. What proves R1–R6 is the
**per-repair re-resolution recorded above**, not the green run.

## Accepted residuals (shared, do-not-re-litigate)

⭐ Recorded under owner ruling **H10**, option labels verbatim *"Fix R5 and R6 (Rec)"* + *"Residual R7
and R8 (Rec)"*, given live via `AskUserQuestion` in the driving `fkit lead` session 2026-09-03.

- **Pre-existing coordinates carried across a rewritten line** (R7) — **What:** two `path`-plus-line
  coordinates stay in the diff's added lines — `architecture.md` §"System context and external
  dependencies" **GitHub, over the network** row, and ADR-042 §Evidence — because each sat on a line
  rewritten for a *different*, unrelated citation. ⛔ Neither is repaired. · **Why (structural):** the
  sweep's boundary is its **frozen membership**, and neither coordinate belongs to a member of it —
  `0286` half B and `0323` are both ruled OUT (H4, H5). Repairing them would widen the sweep past the
  freeze that exists to stop exactly that, and both were verified **byte-identical at `HEAD`**, so
  neither is this sweep's authoring. Rejected alternative: repair-because-visible — it converts "my
  diff touched this line" into a licence to edit anything on it, which is unbounded. · **Re-raise only
  if:** a coordinate on an added line is shown to be **newly authored** by the sweep rather than
  carried, **or** a future member's frozen membership takes ownership of `architecture.md`'s inbound
  half or ADR-042.

- **`0321`'s solo-run verification clauses vs. a combined sweep** (R8) — **What:** `0321`'s
  verification clause 9 (*"`0309`, `0320`, `0261` and `0263` are byte-identical to their pre-run
  state"*) and clause 10 (*"`git status --porcelain` shows changes only at"* `backlog.md` and its own
  folder) are **both unsatisfiable** in this pass and are **not** satisfied. ⛔ `0321` still closes.
  · **Why (structural):** the clauses were written for `0321` running **alone**; the owner's own
  routing put `0320`'s, `0309`'s and `0321`'s work in **one** pass, so the conflict is a consequence of
  a ruling, not a defect in the work. Every **other** clause of `0321`'s check was re-measured and
  holds — exactly two `Task` cells changed, no board rank added, *"still `🔄 In progress`"* still
  present, every `derive` line unchanged, `⟦FACTS⟧` identical, `sprint-7.md` untouched, **0 drift
  records on both live boards**. Rejected alternatives: (a) unpick the combined sweep — undoes an owner
  ruling to satisfy a clause that ruling superseded; (b) rewrite `0321`'s clauses — editing a member's
  acceptance criteria to make one's own run pass is the failure the criteria exist to catch.
  · **Re-raise only if:** `0321` is ever re-run **solo**, or a clause of it **other than 9 and 10** is
  shown to fail.

⭐ **Added in round 2**, under owner rulings **H16** and **H17**, live `AskUserQuestion` 2026-09-03/04.

- **Quoting a durable anchor is what made it ambiguous** (R13) — **What:** the H12 annotation on the
  archived Sprint 2 board's `0158` row, and its mirror in `0158`'s own brief, tell a reader to search
  the phrase *"⚠️ The placement below is producer judgment, not an owner ruling."* rather than the
  drifted line number — but **quoting that phrase inside the annotation is itself a second occurrence**.
  Measured fixed-string: **1× at `HEAD` → 2× now**, in **both** files. ⛔ The anchor is **not**
  re-anchored. · **Why (structural):** the annotation is an **owner-ruled artifact** (H12, verbatim
  *"A — annotate, don't remove (Rec)"*), so changing its prescribed anchor is a bigger act than the
  defect it would fix — and the defect is **self-limiting**: both occurrences sit in the same row of the
  same file, and a reader searching the phrase lands on the annotation that explains it. ⚠️ **This is a
  real property of the durable-anchor method, not a slip:** any anchor quoted in a record that lives
  beside its target doubles that target's match count. Rejected alternatives: (a) re-anchor on a
  narrower fragment — edits an owner-ruled annotation to fix a cosmetic ambiguity; (b) paraphrase the
  anchor instead of quoting it — destroys the exact-match property that makes it durable at all.
  · **Re-raise only if:** the phrase's occurrence count rises **above 2** in either file, **or** the
  original addendum the annotation points at is edited or removed, **or** the architect's H19 follow-up
  rules on anchor-quoting generally.

- **`0308`'s population pattern is singular-only, and the population is frozen** (R11) — **What:**
  `0308`'s pinned pattern `\btask[ -][0-9]{1,2}\b` cannot match the plural `tasks NN`, so **6**
  occurrences were never triaged: **5** in `claude/skills/fkit-status/dashboard.sh` and — ⭐ **found by
  me, beyond the finding** — **1** in `claude/scaffold/`, the one place `0308`'s brief pins a hard
  *"must stay 0"*. ⛔ Not repaired; `0308` closes. · **Why (structural):** the pattern **is** `0308`'s
  own pinned verification step, and widening it mid-close reopens a frozen population and voids the
  completeness proof of its 48-row triage table — the freeze is what makes that table mean anything.
  ⭐ Verified this does **not** make `0308` wrong: its pinned singular check over `scaffold/` returns
  **0** and still passes, and the 6th occurrence is **pre-existing at `HEAD`** in a file this sweep
  never modified, so it is a **blind spot, not a regression**. Rejected alternatives: (a) widen the
  pattern now — voids the triage proof at the moment of closing; (b) hold `0308` open — punishes a
  complete piece of work for a defect in the question it was asked. · **Re-raise only if:** the plural
  form is shown to have been **introduced** by a sweep rather than pre-existing, **or** the follow-up
  task filed for it is closed without triaging all 6.
