# Review — 0339

Task: `ai-agents/tasks/done/0339-teach-the-lead-and-producer-what-current-sprint-means-and-how-to-resolve-it/brief.md`
File(s) under review: the 17 in-scope files of the working tree (2 new convention pages + their
index/parity/structure drag, `claude/agents/fkit-lead.md`, `claude/agents/fkit-producer.md`,
`claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/skills/fkit-task-brief/SKILL.md`, both
`ai-agents/README.md` copies). Out of scope: `ai-agents/sprints/sprint-8.md`, `brief.md`,
`ai-agents/sprints/backlog.md`, `plan.md`.
Status: closed-out
Coverage: both reviewers measured — Codex (`codex-cli 0.152.0`, exit 0) ran
`node --test` over the targeted suites (33 assertions passed; 66 fixture tests could not execute
under `--sandbox read-only`, `EPERM` on temp-dir creation); the reviewer independently ran
`npm run test:unit` (**963/963 pass, 0 fail, 24 suites**) and
`node --test test/structure-check.test.js test/structure-spec.test.js test/structure-manifest.test.js
test/dual-home-parity.test.js test/reference-integrity.test.js test/skill-frontmatter.test.js
test/coordination-citation-policy.test.js` (**120/120 pass, 0 fail**).

## Reviewer findings

| #  | Round | Sev | Location | Claim |
|----|-------|-----|----------|-------|
| R1 | 1 | medium | `claude/scaffold/ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md:63` | The scaffold copy states *"A **sprint identity** is what the plan's H1 resolves to, and nowhere else"* — false against the shipped `resolve_identity` ladder (`claude/skills/fkit-status/dashboard.sh:136-180`), which falls through H1 → filename stem → `backlog.md` basename. The page then contradicts itself 8 lines later by asserting `backlog.md`'s identity is `Backlog` (the basename rung). The live copy's wording (*"what `resolve_identity` returns for a file"*) is correct, so this is also an audience-adapted **substance** divergence, not just a wording one. Ships to every consuming project as law. |
| R2 | 1 | low | `ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md:7` | The motivating blockquote — *"was inferred from the highest-numbered filename, so Sprint 5 stayed \"active\" for weeks after it was finished"* — is unsourced and contradicted by this repo's own record on both halves. Mechanism: ADR-047 §Context attributes the Sprint 5 failure to depth-1 **location**-only selection (*"which is why a finished Sprint 5 kept being reported as active until a hand-scoped task moved it"*), and measured 2026-09-13 `sprint-5.md` was the **only** board at depth 1 when it happened. Duration: its banner reads `> ## 🔒 CLOSED — 2026-08-13.` and `ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-4.md` states *"Sprint 5 was archived on 2026-08-14"* — one day, not weeks. Plan step 1 required *"Content, all of it sourced (no invention)"*. ⭐ **The scaffold copy's generic framing is faithful to the owner's own 2026-08-25 report and must NOT be "fixed".** |
| R3 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:103` | The new selector call `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` uses the repo-only path form; `claude/fkit-claude-init.sh` creates only `.claude/agents` and `.claude/skills` in a consuming project, so this line cannot run there. **Declared frontier-move** — the plan's §D *"Path form"* note rules the repo-wide mix out of scope and the worklog records keeping the file's existing form. 8 such sites already ship across the four sprint skills; this adds a 9th. Fixing this one line alone would leave the file internally inconsistent. |
| R4 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:50-55` | The rewritten `$ARGUMENTS` rule now restates the single-board selection rule in prose — *"the lowest-ordered `🔄 In progress` sprint, or an `⭐ ACTIVE BOARD` override; `reason=` says which"* — immediately **before** the retained sentence *"**Do not re-derive that rule here** (ADR-041 §5: one grammar, one implementation)"*. Before this change the line pointed rather than restated, so the sentence was self-consistent; it now contradicts itself and adds a third prose copy of a rule the new convention page also carries. |
| R5 | 1 | low | `claude/scaffold/ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md:98` | Tells a consumer the harder gate is *"a further precondition in `claude/skill-ownership-hook.sh`"*, a path their project has in neither form: `fkit-claude-init.sh` copies no hook, and `claude/fkit-claude.sh:331` wires it from fkit's own install share. ⚠️ **Pre-existing, replicated:** the identical sentence already ships at `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md:80`, so a fix must cover both pages and belongs to its own task, not to 0339. |
| R6 | 1 | low | `test/dual-home-parity-exceptions.mjs:199` | The block comment *"The scaffold ships 13 real files plus `.gitkeep` placeholders"* is stale: measured 2026-09-13 the scaffold holds **18** non-`.gitkeep` files at `HEAD` and **19** with this change. Stale before this task, staler after. No test pins it, so nothing is red. ⭐ **Same class as the `dual-home-parity.md` stale-count already ruled "file it as its own task"** — recommend folding into that task rather than opening a new one. |
| R7 | 1 | low | `README.md:49` (repo root, product docs) | *"Since [ADR-041] the active sprint is selected by each plan's resolved **identity**"* — singular, and silent on the status filter ADR-047 added; `dashboard.sh`'s `select-active` now requires an eligible identity **and** `🔄 In progress`, and emits one `active` line per surviving sprint. Not false about the backlog exclusion it is actually explaining, but incomplete post-ADR-047. **Outside 0339's declared scope** (the root `README.md` is not on the scope list) — a follow-up, not a 0339 change. |

## Coder response

<!-- CODER-OWNED. The reviewer never writes this section. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | **Defect** (substance, ships as law) | Verified `resolve_identity` in `claude/skills/fkit-status/dashboard.sh` directly: a three-rung ladder, H1 → filename stem → `backlog.md` basename, each rung reached only when the one above returns empty. The scaffold's *"what the plan's H1 resolves to, and nowhere else"* is false at rungs 2 and 3, and its own later paragraph (*"`identity="Backlog"` in the selector's output"*) is rung 3 contradicting it. **Fixed** → *"what the selector resolves for a plan file, and nowhere else."* ⭐ **Deliberately did NOT name the three rungs in the page**, though the ladder is what makes the claim false: writing the grammar into prose is exactly R4's defect and exactly what this page's own *"The recognizer has exactly one implementation, in `dashboard.sh`. Do not re-state the grammar anywhere else"* forbids. Pointing is true, non-contradictory and consistent with the page's own discipline. De-fkit-ified: no ADR link added; *"the selector"* matches the page's existing vocabulary. | ✅ done |
| R2 | **CORRECT** (both halves) | **Defect** (unsourced, live copy only) | Verified against ADR-047 §Context, which attributes the failure to depth-1 **location**-only selection — *"which is why a finished Sprint 5 kept being reported as active until a hand-scoped task moved it"* — not to a filename heuristic. Duration verified independently: `ai-agents/sprints/done/sprint-5.md` line 3 reads `> ## 🔒 CLOSED — 2026-08-13.` and `ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-4.md` records *"Sprint 5 was archived on 2026-08-14"* — **one day, not weeks**. **Fixed** in the live page with ADR-047's own sourced wording, quoted. ⭐ **Scaffold copy left untouched**, per the reviewer's own instruction — its generic framing is faithful to the owner's 2026-08-25 report. | ✅ done |
| R3 | **CORRECT** | **Frontier** (pre-existing class, owner-ruled residual) | Claim verified: `claude/fkit-claude-init.sh` creates only `.claude/agents` and `.claude/skills`, so the repo-only `claude/…` form cannot run in a consuming project. ⚠️ **My own measurement differs from the reviewer's by one, in both counts:** filtered for the repo-only form, **7** sites ship at `HEAD` across **three** sprint skills (`fkit-sprint-done` ×4, `fkit-sprint-cancelled` ×2, `fkit-sprint-ship-loop` ×1) and this change makes **8** — not *"8 already ship across the four sprint skills … adds a 9th"*. `fkit-status/SKILL.md` carries **zero**. Immaterial to the ruling; recorded for accuracy. **Not fixed** — owner ruling *"Residual + one sweep task (Rec)"*. Recorded as an accepted residual below; the sweep task is a producer's to file, not mine. | won't fix (frontier) |
| R4 | **CORRECT** | **Defect — and a regression this change introduced** | Verified by diffing against `HEAD`: the pre-change line **pointed** (*"empty = the active sprint, as `/fkit-status` resolves it"* — see `fkit-status/SKILL.md`'s empty-argument rule) and was self-consistent with the retained *"Do not re-derive that rule here."* This change inserted a prose restatement of the selection rule immediately before that sentence, so the file instructed against re-deriving the rule in the same breath as re-deriving it. **Fixed** by dropping the restating parenthetical only; the retained sentence needed no rewording beyond the sentence-ending period. ⭐ The dropped `reason=` pointer loses nothing — the loop's opening-report beat still requires *"name the board you are driving and the selector's `reason=` for it."* The neighbouring *"More than one sprint may be `In progress` at once; this loop drives exactly one of them"* was **kept**: that states this loop's own scope, not the selection grammar. | ✅ done |
| R5 | **CORRECT** | **Frontier** (pre-existing, replicated, owner-ruled residual) | Verified: the identical sentence already ships in the sibling `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md`, so the path is wrong in two shipped pages, not one, and fixing only the new page would leave the pair inconsistent. **Not fixed** — same owner ruling as R3, *"Residual + one sweep task (Rec)"*; folded into the single residual below covering the whole `claude/` vs `.claude/` path class. | won't fix (frontier) |
| R6 | **CORRECT** | **Defect — outside `0339`'s scope** | Verified by measurement, and the reviewer's numbers are exact: `test/dual-home-parity-exceptions.mjs:199` says *"The scaffold ships 13 real files plus `.gitkeep` placeholders"*; the scaffold holds **18** non-`.gitkeep` files at `HEAD` and **19** with this change. No test pins the comment, so nothing is red. **Not fixed** — owner ruling *"Fold into 0389 (Rec)"*; `0389` is already filed and a producer carries it in parallel. The file is also fenced out of my scope. | won't fix (frontier) |
| R7 | **CORRECT** | **Defect — outside `0339`'s scope** | Verified: the root `README.md` states *"the active sprint is selected by each plan's resolved **identity**"* — singular, and silent on the `🔄 In progress` filter ADR-047 added, after which `select-active` emits one `active` line per surviving sprint. Not false about the backlog exclusion it is actually explaining; incomplete post-ADR-047. **Not fixed** — owner ruling *"File a follow-up (Rec)"*; a producer files it in parallel. The root `README.md` is fenced out of my scope. | won't fix (frontier) |

### Step 2 — loop check against residuals and ADRs

⭐ **No finding is `closeout`.** Checked all seven against the four *Accepted residuals* above and
against the *Re-raise only if* lists of the in-scope ADRs — **047**, **041** and **040**:

- ADR-047's trigger is *"a project needs a fifth sprint status"*; ADR-041's is two parallel sprints or
  mis-selection **within** the eligible set; ADR-040's is a wider identity token grammar. **None fires,
  and no finding argues any of them.**
- The homing residual and the upgrade-sentence residual are untouched by every finding.
- R6 is the **same class** as the `dual-home-parity.md` stale-count residual but a **different site** —
  a block comment in the exceptions module, not the convention's mirror table — so it is a novel
  finding, not re-litigation. The owner routed it to `0389` on exactly that reading.
- **R4 is the one finding this change itself created** — the regression check fires here, not the
  oscillation check: nothing was previously reverted, this is round 1, and the defect is a
  newly-introduced self-contradiction rather than a re-argued tradeoff.

### Step 3 — severity derived independently

Derived from traced blast radius, not inherited. ⚠️ Noted that the reviewer had already reduced Codex's
severity on **R3** and **R5**; both were re-derived from scratch anyway.

**Concur with the reviewer on all seven** — R1 medium, R2–R7 low. R1 earns medium alone: it is the only
finding that ships a **false rule** into every consuming project's installed convention page, and it is
self-contradictory within eight lines, so a reader cannot even repair it from context. It stays below
high because the page is documentation with no test or code path depending on it — a wrong belief about
how identity resolves, not a wrong selection. R4's blast radius is a single prose self-contradiction in
one skill file; R2's is motivating prose in a blockquote, not a rule. R3/R5/R6/R7 are all pre-existing
or out-of-scope classes with no executable consequence in this repo.

### Step 5 — summary and convergence

| Disposition | Findings |
|---|---|
| Fixed (`✅ done`) | **R1, R2, R4** |
| Accepted residual, not fixed | **R3, R5** (one shared residual below) |
| Routed to another task, not fixed | **R6** → `0389`; **R7** → `0391`. Both confirmed filed on disk 2026-09-13; neither filed by this worker |
| Disproven | **none** |
| Closeout (re-litigation) | **none** |
| Blocked | **none** |

**Suppressed as settled:** none. No finding was suppressed — all seven were verified against the code
and dispositioned individually.

⭐ **Convergence: CONVERGED.** Every novel finding is `✅ done`, an accepted residual, or routed to a
named task. Nothing is blocking, nothing is disputed, and no fix in this round touched code that
another finding depends on. Three prose fixes, all localized, all inside the approved plan; the two
remaining classes are pre-existing and owner-ruled. **No round 2 is warranted on this ledger.**

## Accepted residuals (shared, do-not-re-litigate)

- **Dual-home, audience-adapted homing of `sprint-status-vocabulary.md`** — What: the page ships in
  both homes as an audience-adapted pair (17 files planned, 18 built), registered in
  `test/dual-home-parity-exceptions.mjs`. · Why (structural): owner ruling §C, 2026-09-12, live
  `AskUserQuestion`, option label verbatim *"Dual-home, audience-adapted (Rec)"*; live-only was
  rejected because `0341` ships both sprint movers to every consuming project, and byte-identical was
  rejected because the scaffold's `knowledge-base/decisions/` holds only a `.gitkeep` so every ADR
  link would ship broken. · Re-raise only if: a consuming project is shown to need the ADR links, or
  the scaffold gains a `decisions/` tree.
- **The upgrade sentence in both `ai-agents/README.md` copies is a CONSEQUENCE, not an obligation** —
  What: *"A plan with no line-3 banner resolves to `unresolved` and is never reported as active — add
  a banner to your open plans after upgrading."* · Why (structural): owner ruling §H, 2026-09-12,
  option label verbatim *"Write it as a consequence (Rec)"*; *"must add a banner"* is an obligation no
  ADR carries and the scaffold copy ships it to every consuming project. · Re-raise only if: an ADR is
  written that actually creates the obligation.
- **`dual-home-parity.md`'s stale mirror count (module 28/18 vs doc 26/16, plus the missing
  `.fkit-accepted-drift` row)** — What: left unfixed by 0339. · Why (structural): owner ruling
  2026-09-12, *"File it as its own task"*; the count sentence cannot be made true without also adding
  an unrelated path's row, which is outside 0339's approved plan, and no test pins the number. ·
  Re-raise only if: a test begins pinning the count, or the separate task is closed without fixing it.
- **The movers' internal step order is absent from both new pages, by omission** — What: neither page
  states the order of operations inside `/fkit-sprint-done` / `/fkit-sprint-cancelled`. · Why
  (structural): plan step 1 item 5 and risk R6 — ADR-047 §4 warns the sprint movers *invert* the task
  movers' order, a driver has already relayed it inverted once, and nothing on a vocabulary page needs
  it. Omission removes the trap entirely. · Re-raise only if: a reader is shown to need the order on a
  vocabulary page.
- **The `claude/…` vs `.claude/…` path form in prose that ships to consuming projects (R3 + R5)** —
  What: two sites keep the repo-only `claude/…` form that a consuming project does not have, and `0339`
  fixes neither: the ship-loop's selector call under the `$ARGUMENTS` rule
  (`bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints`), and the new scaffold
  page's harder-gate pointer at *"a further precondition in `claude/skill-ownership-hook.sh`"*. ·
  Why (structural): owner ruling 2026-09-12, live `AskUserQuestion`, option label verbatim
  *"Residual + one sweep task (Rec)"*. The class is **pre-existing and repo-wide** — measured
  2026-09-13, **7** repo-only `bash claude/skills/fkit-status/dashboard.sh` sites already ship at
  `HEAD` across three sprint skills (`fkit-sprint-done` ×4, `fkit-sprint-cancelled` ×2,
  `fkit-sprint-ship-loop` ×1) and this change makes **8**; R5's exact sentence already ships in the
  sibling scaffold `task-status-vocabulary.md`; and a partial fix would leave the ship-loop internally
  inconsistent by mixing two path forms mid-file. The plan's own §D *"Path form"* note had already
  ruled the repo-wide mix out of scope, flagged not fixed. **One sweep task covers the whole class and
  was a producer's to file, not this ledger's** — filed in parallel as **`0390`**
  (*"Sweep the repo-only `claude/` path form out of installed-facing skill and scaffold prose"*),
  confirmed on disk 2026-09-13. · Re-raise only if: `0390` is closed without covering these two sites,
  or a consuming project reports either line actually failing to run there.
