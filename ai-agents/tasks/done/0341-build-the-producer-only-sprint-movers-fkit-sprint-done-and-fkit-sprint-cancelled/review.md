# Review — 0341

Task: `ai-agents/tasks/done/0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled/brief.md`
File(s) under review: `claude/skills/fkit-sprint-done/SKILL.md` · `claude/skills/fkit-sprint-cancelled/SKILL.md` · `claude/skills/fkit-status/dashboard.sh` · `claude/skills-for-role.sh` · `claude/skills/fkit-status/SKILL.md` · `test/{skill-ownership-hook,skill-frontmatter,coordination-citation-policy,mover-exemption-step,dashboard-contract}.test.js` · `ai-agents/sprints/cancelled/.gitkeep` · step-8 prose (`claude/agents/fkit-producer.md`, `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/**`, `claude/README.md`, `ai-agents/knowledge-base/architecture.md`, `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`, `ai-agents/tasks/README.md`, `claude/structure-manifest.tsv`, generated `CLAUDE.md`/`AGENTS.md`)
Status: closed-out
Coverage: both reviewers measured (round 2) — Codex enumerated `sprint-8.md`'s outbound vs inbound link targets, traced `mode_select_active`'s filter/emission order, and ran `bash -n` plus direct `successor` invocations (it could not run temp-fixture suites: `mkdtemp` → `EPERM` under the read-only sandbox); this reviewer re-ran `npm run test:unit` (963/963 pass, 24 suites, exit 0), `mover-exemption-step` (24/24), `rules-block-budget` (3/3, `RULES_MAX=4352` untouched), re-measured every `successor` exit code (0/3/1/1/1), and independently counted `SPRINT_GIT_MV`'s matches in both movers.

## Reviewer findings

| #   | Round | Sev    | Location | Claim |
|-----|-------|--------|----------|-------|
| R1  | 1     | high   | `claude/skills/fkit-sprint-done/SKILL.md:210-243`; `claude/skills/fkit-sprint-cancelled/SKILL.md:202-236` | The widened sweep affirmatively includes `claude/` and `test/`, but the five-item evidence-exclusion list (fenced block / captured output / dated measurement / quoted specimen / findings row) was inherited from a mover that never greps those trees and covers none of the occurrences that actually exist there. Measured on a real close of Sprint 8: 19 hits in `test/` and 5 in `claude/`, every one a JS fixture literal (`'sprint-8.md': prosePlan(…)`) or an illustrative example — not one an href. The executor is told to expect them (`:344` requires reporting hits outside `ai-agents/`) and given no rule for the only kind present. |
| R2  | 1     | medium | `claude/skills/fkit-sprint-done/SKILL.md:74-80`; `claude/skills/fkit-sprint-cancelled/SKILL.md:86-92` | The load-bearing rationale for the inverted step order — *"a missed reference is then a **dangling link the guard catches**"* — is true only inside `ai-agents/`. `test/reference-integrity.test.js:191` walks `path.join(root, 'ai-agents')` and nothing else, so no guard catches a missed reference in `claude/`, `test/`, `CLAUDE.md` or `README.md` — precisely the scope the sweep was widened to. The stated guarantee does not extend to the new half of the sweep, and the prose carries no qualifier. |
| R3  | 1     | medium | `claude/skills/fkit-sprint-done/SKILL.md:258-260`; `claude/skills/fkit-sprint-cancelled/SKILL.md:253-255`; pinned at `test/mover-exemption-step.test.js:890-894` | The plan's one mandated reword replaced a true premise with a false one. `NAMED_EXEMPT` holds plain JS string literals of the form `'<citing file>::<target>'` (`test/reference-integrity.test.js:279-290`), and `:286` already spells a sprint basename (`…::../sprint-4c.md`). A raw basename grep over `test/` **does** see them, so *"it cannot see them inside `test/reference-integrity.test.js`"* is false. The task movers' original *"greps `ai-agents/` only"* was true. The clause's conclusion (run the guard unconditionally) survives; its stated reason does not — and `SPRINT_SWEEP_LEAD` now pins the false sentence byte-exactly across both files, so correcting it reds `S1`/`S5`. |
| R4  | 1     | medium | `claude/skills/fkit-sprint-done/SKILL.md:163-164` vs `:224-226`; `claude/skills/fkit-sprint-cancelled/SKILL.md:159-160` vs `:216-218` | Step 4 rule 1 says a closed row *"is NEVER touched"*; step 6 says every task href written before this close gains one hop (`../tasks/…` → `../../tasks/…`), and *"Every task href on the board is one of these."* Closed rows carry task hrefs — measured on `ai-agents/sprints/sprint-8.md`, the `✅ Done` rows each carry `../tasks/done/…/brief.md`. The two rules collide on the first real close. Obeying the freeze breaks those links (and `reference-integrity` scans `ai-agents/`, so it reds loudly); obeying step 6 violates an absolute ⛔. No rule resolves it. |
| R5  | 1     | medium | `claude/skills/fkit-sprint-done/SKILL.md:172` vs `:183-184` vs `:197` | For an unranked successor sprint no compliant state exists. The marker template always carries `— priority M`; `:183` forbids that suffix when the destination board is unranked and explicitly contemplates *"a successor sprint whose own board is unranked"*; `:197` nonetheless requires the brief's `## Priority` to be *"the real number `M`"*. The executor must invent a rank or leave the row and the brief contradictory, and `## Priority` is not guard-checked. |
| R6  | 1     | medium | `claude/skills/fkit-sprint-done/SKILL.md:320-322`; `claude/skills/fkit-sprint-cancelled/SKILL.md:334-336` | The same-identity stop is inert. It says *"the reader reports `drift ambiguous-active-sprint` and names both"*, but `ambiguous-active-sprint` is emitted only from `mode_select_active` (`claude/skills/fkit-status/dashboard.sh:649`) and the board render, and neither mover invokes either — step 1 calls `identity <plan>` and step 2 calls `successor` / `identity`, all of which emit a value and no drift. The mover can close an arbitrary one of two boards claiming a sprint, and the collision then disappears from depth 1. |
| R7  | 1     | medium | `claude/skills/fkit-sprint-done/SKILL.md:91-98` and `:245-250`; `claude/skills/fkit-sprint-cancelled/SKILL.md:103-112` and `:238-245` | Step 1 validates nothing about the archive destination, and the inverted order puts every mutation (banner, rows, briefs, links) before the `git mv`. A pre-existing `sprints/done|cancelled/<basename>` makes the final `git mv` fail after all of it. Worse than the failure: the links repointed in step 6 then resolve successfully to the *older archived board* at that destination — the silent-resolution hazard the skill names for row markers at `:175-178` but does not guard for itself. |
| R8  | 1     | medium | `claude/skills/fkit-sprint-cancelled/SKILL.md:176-177` | The per-row destination override was copied unchanged from `fkit-sprint-done` into a skill whose rule is *always* the Backlog board (`:132-135`, `:164`) and whose step 5 offers exactly one brief-field procedure (`:198-200`). An exercised override sends the row somewhere while the brief is still forced to `Backlog` — manufacturing the permanent `drift disagreement` that `:193-196` warns about in the same step. |
| R9  | 1     | medium | `claude/skills/fkit-sprint-done/SKILL.md:155-158` | The `Superseded by` template omits the `../` its own next sentence makes mandatory. The bolded form is `Superseded by [<successor identity>](<successor basename>)`; the ⚠️ that follows says it needs the `../` hop. The row-marker templates at `:172-173` embed `../` inside the template; this one does not. Per the skill's own `:175-178`, the bare form is loud today and goes **silent** once the successor is itself archived under the same basename. |
| R10 | 1     | medium | `claude/scaffold/universal-rules.md:6` (generated into `CLAUDE.md:62`, `AGENTS.md:41`) | The generalized hard rule asserts a directory triad that is false for half its subjects: *"Task files AND sprint boards move between `backlog/`, `done/`, `cancelled/`"*. A sprint board never moves into any `backlog/` directory — `ai-agents/sprints/backlog.md` is a file, and both new movers refuse to close it by name (`fkit-sprint-done/SKILL.md:97-98`, `fkit-sprint-cancelled/SKILL.md:110-112`). This is the highest-visibility text fkit ships and it goes into every consuming project. ⚠️ Not a re-litigation of D3: one bullet, no second bullet, no `RULES_MAX` change — only its wording. |
| R11 | 1     | low    | `claude/skills/fkit-sprint-done/SKILL.md:261` and `:311`; `claude/skills/fkit-sprint-cancelled/SKILL.md:256` and `:306` | The known-inaccurate *"Moving a folder into `<board>/`"* wording is not confined to that one sentence: the **attribution rule** also says a red is this move's *"only where the folder just moved is spelled by the named key"*. That is a functional instruction, not a description — an executor doing literal attribution looks for a moved *folder*, finds none (a sprint mover moves a board **file**), and reports a genuine red as pre-existing. This upgrades the recorded wording issue from cosmetic to behavioural. |
| R12 | 1     | low    | `claude/skills/fkit-status/dashboard.sh:353` (the `is_eligible "$2"` guard), `is_eligible` at `:259` | The argument guard added to make `mode_successor` refuse rather than answer is line-oriented and does not fail closed. `is_eligible` is `grep -qE "^Sprint …$"`, which anchors to a *line*, so a multi-line argument whose first line is a valid identity passes. Measured: `successor ai-agents/sprints $'Sprint 7\njunk'` returns **exit 3** ("no successor exists") where the single-line control `'Sprint 7 junk'` correctly returns exit 1. In the mover, exit 3 means *fall to the Backlog board* — the silent wrong answer the guard exists to prevent. `dashboard-contract.test.js` S9 tests single-line values only. Reachability is low: the sanctioned flow feeds `$(dashboard.sh identity <plan>)`, which emits one line. |
| R13 | 1     | low    | `test/mover-exemption-step.test.js:991-995` | `S3` claims to pin the clause *after the `git mv` step* but compares it only against the step **heading** (`SPRINT_MOVER_SIGNATURE`, `assert.ok(clauseAt[0] > moveAt[0])`). A clause moved to just below the heading — **above** the `git mv` fence — passes S3 and keeps S1/S2/S4/S5/S6 green, while violating the invariant S3's own failure message states (*"a heal is only observable at the new path"*). The disk placement is correct today; the pin is weaker than the worklog's *"placement after the `git mv` step"* implies. Nit in the same block: the banner reads `S0–S4` over tests `S0`–`S6`. |
| R14 | 1     | low    | `claude/skills/fkit-status/dashboard.sh:34-37` | The file's CONTRACT block — the first thing a maintainer reads, and the declaration of the script's public surface — still says *"**Three** further MODES sit in front of this render"* and names only `identity`, `status`, `select-active`. There are now four. The section banner at `:302` **was** generalized (*"the two non-board modes"* → *"the non-board modes"*); this one was missed. Same class as the `architecture.md` *"The 26 skills"* falsehood the build went out of plan to fix. |
| R15 | 1     | low    | `ai-agents/knowledge-base/architecture.md:307` (the `tasks/{backlog,done,cancelled}/<NNNN>-<slug>/` row) vs `:306` (the `sprints/sprint-N.md` row) | The sprint-mover facts were appended to the **task-folder** row, while the `sprints/sprint-N.md` row immediately above still reads *"sprint plan + status table; completed sprints move to `sprints/done/`"* — no `cancelled/`, no movers. The row a reader consults about sprint boards is the one left stale, and the sprint fact is filed under a key it does not belong to. This is one of the out-of-plan edits, so the placement was the build's own call. |
| R16 | 1     | low    | `test/coordination-citation-policy.test.js:495-496` | `L7`'s stated purpose is disclosure of every named blind spot, but its blind-spot-4 diagnostic still reads *"sprints/done and sprints/reviews not scanned"*. The header comment (`:110-116`) and the `forbidden` array (`:449-456`) were both updated to add `sprints/cancelled/`; the diagnostic was not. Green output therefore conceals the newly-added prospective blind spot. |
| R17 | 1     | low    | `worklog.md` § *"A second, smaller gap — no `prove-red.sh` entry for anything added here"* — the bullet *"the **negation-vs-swap trap** (redded `S6`), **dropping `Backlog` from the status filter** (redded `S3` + `S4`), and **non-strict ordering** (redded `S4` + `S7`)"* | Two different `S`-series are referenced in one bare token space, six lines apart, with neither file named. `test/mover-exemption-step.test.js` carries `S0`–`S6`; `test/dashboard-contract.test.js` carries `ADR-047 successor S1`–`S10`. The bullet six lines above (*"`S1`/`S2` are the same class as `T3`/`T11`"*) means the **mover-exemption** series; this bullet means the **dashboard-contract** series. Three of the four tokens (`S3`, `S4`, `S6`) exist in both files with different meanings and so collide **silently**; `S7` exists only in dashboard-contract. ⭐ The measurements themselves are correct — verified each against `test/dashboard-contract.test.js`: negation-vs-swap → successor `S6` (its own comment names it the detector), Backlog-dropped → `S3`+`S4`, non-strict → `S4`+`S7`. Only the namespace is missing. Feeds directly into follow-up `0388`, whose job is to write mutations against named assertions in the right file. |
| R18 | 1     | low    | `claude/skills/fkit-sprint-done/SKILL.md:218`; `claude/skills/fkit-sprint-cancelled/SKILL.md:210` | The sweep the prose calls repo-wide omits root `AGENTS.md`, which the grep argument list does not include (`ai-agents/ claude/ test/ CLAUDE.md README.md`). Measured impact today is **zero** — `grep -c 'sprint-[0-9]' AGENTS.md` returns 0, and `AGENTS.md` is generated rather than hand-linked — so this is an accuracy gap in the word "repo-wide", not a live breakage. |

### Round 2 — defects the round-1 FIXES introduced

⚠️ **This round exists because of `0381`'s measured base rate** — seven rounds on this clause class,
the last three defects each created by the previous fix. Eighteen fixes landed. **Four of the six
findings below are fix-introduced; two are pre-existing and were missed in round 1.** Each row says
which.

| #   | Round | Sev    | Location | Claim |
|-----|-------|--------|----------|-------|
| R19 | 2     | medium | `claude/skills/fkit-sprint-done/SKILL.md:304`; `claude/skills/fkit-sprint-cancelled/SKILL.md:295`; pinned at `test/mover-exemption-step.test.js:935-940` (`SPRINT_SWEEP_LEAD`) | ⛔ **FIX-INTRODUCED — R3 replaced a false universal with a different false universal, and pinned it again.** The new sentence reads *"being a raw text search it DOES see the exemption keys — a grep for this board's basename hits them as plain JS string literals."* Measured: `grep -c "sprint-8.md" test/reference-integrity.test.js` → **0**. For the very board the same step uses as its worked example, the grep hits **nothing**. The truth is conditional — a grep sees a key only *when that key spells this board's basename*, which today is true of `sprint-4c.md` and no other. Round-1 R3 said the old premise was false because it over-denied; the replacement is false because it over-asserts, and `SPRINT_SWEEP_LEAD` pins it byte-exactly across both movers. |
| R20 | 2     | medium | `test/mover-exemption-step.test.js:885-886`, `:1014` (`S1`'s `why`), `:1125-1127` (`S5`'s message) | ⛔ **FIX-INTRODUCED — R3 changed the sentence and the constant but left three sites in the same file asserting the reason it had just disproved.** All three still say the keys are *"JS string literals, not markdown links, so a link sweep cannot see them"* — the exact claim the new `SPRINT_SWEEP_LEAD` contradicts. `S1`'s `why` goes further and asserts *"and that reason is what this sentence states"*, which is now false of the sentence it guards. These are the messages a maintainer reads **when the pin reds**, so they steer the next hand toward restoring the falsehood — the precise re-introduction vector `S5` exists to block. ⚠️ Separately and **pre-existing**: `:888` and `:941` both name **`S4`** as the pin on the absent premise; it is **`S5`** (`S4` is uniformity). |
| R21 | 2     | medium | `claude/skills/fkit-sprint-done/SKILL.md:376-377`; `claude/skills/fkit-sprint-cancelled/SKILL.md:389-390` | ⛔ **FIX-INTRODUCED, and it is the FOURTH instance of a class ADR-047 has already fenced twice.** R6 correctly deleted the false *"it will announce itself"* claim, then named a remedy that structurally cannot report the case: *"`dashboard.sh select-active ai-agents/sprints` is what reports it."* `mode_select_active` applies `[ "$_st" = "In progress" ] \|\| continue` (`claude/skills/fkit-status/dashboard.sh:470`) **before** building the set the `ambiguous-active-sprint` emission loops over (`:658-662`), so two `🔲 Backlog` boards claiming one identity are both filtered out and **no record is produced**. Both movers permit closing a Backlog-status sprint — step 1 refuses only the identity `Backlog`, never the status. The remedy that does work was not the one named: the board render (`dashboard.sh <plan>`) reaches the same collision through `sibling_claimants`, which is status-agnostic. ⚠️ ADR-047's *Re-raise only if* (`:1254-1259`) names this failure — *"§7's emitter assignment sends a drift to a mode that cannot produce it"* — as having happened twice; round-1 R6 was the third, and R6's own fix is the fourth. |
| R22 | 2     | low    | `test/mover-exemption-step.test.js:1074-1076`; `worklog.md` § *"Applied without asking — every call, and why it qualified"*, entry 5 — *"S3's anchor **is** the `### ` heading, so including it made the assertion fail unconditionally"* | ⛔ **FIX-INTRODUCED — R13 re-anchored `S3` and left its rationale behind in two places.** `moveAt` is now `SPRINT_GIT_MV`, a `git mv` **command** line, which can never satisfy `startsWith('### ')` — so the `moveAt[0] + 1` slice offset is no longer load-bearing and the stated reason for it is false. The assertion itself is correct: verified independently that `SPRINT_GIT_MV` matches **exactly one** line in each mover and does **not** match the cancelled mover's preceding `mkdir -p` at `:285`. |
| R23 | 2     | low    | `claude/skills/fkit-sprint-done/SKILL.md:76`; `claude/skills/fkit-sprint-cancelled/SKILL.md:88` | ⚠️ **PRE-EXISTING, missed in round 1 — not introduced by R2's fix.** Both movers justify the inverted step order on *"a sprint board is linked from far more places than it links to."* Measured on `ai-agents/sprints/sprint-8.md`: **37** outbound `](…)` targets against **12** inbound hrefs repo-wide — the reverse of the claim. R2 replaced the clause that *follows* this one and correctly left the ordering decision alone (it is ADR-047 §4's, not the skill's); this premise survived untouched. The fix's own new justification — *"every reference you find can be resolved against a file that is still there"* — is true and self-sufficient, so the false clause in front of it is now redundant as well as wrong. |
| R24 | 2     | low    | `claude/skills/fkit-sprint-done/SKILL.md:266-268` vs `:290-292`; `claude/skills/fkit-sprint-cancelled/SKILL.md:254-256` vs `:280-282` | ⚠️ **FIX-INTRODUCED ambiguity — R1 promoted the link test to *the* rule and left the EVIDENCE exclusion standing behind it.** The new bullet is binary and unqualified: *"**The rule is the link test**: is this occurrence inside a markdown link's target — `](…)` — that a reader would follow? Repoint it. Anything else stays."* Twenty-four lines later the older absolute survives: *"⛔ **Never rewrite the old path where it is EVIDENCE** — inside a fenced block, captured command output, a dated measurement, a quoted specimen, or a findings row."* An occurrence can be both, and the repo already holds the specimen: `ai-agents/tasks/done/0268-…/worklog.md` carries `[Sprint 4c](../sprint-4c.md)` at two sites, one a quoted plan row and one captured drift output — and `test/reference-integrity.test.js` exempts exactly that pair by name because it is illustrative. Applying the link test literally forges a transcript **and** orphans a `NAMED_EXEMPT` key the mover is forbidden to edit. The preceding *"Do not reach for the EVIDENCE list"* sentence is scoped to non-link hits, but the rule sentence it leads into is not. |

### Round 1 fixes — does each hold?

Verified one by one against the code, not against the coder's report.

- **Holds, clean:** R4 (the freeze/pointer split is unambiguous and cites the `sprint-8.md` measurement), R5, R7, R8 (override removed from the cancel mover, kept in `done` where it is correct), R9, R10, R11, R12, R14, R15, R16, R17, R18.
- **R10 re-measured:** one bullet, `backlog/` correctly dropped for *"reach `done/` or `cancelled/`"*, `RULES_MAX=4352` untouched, `rules-block-budget` **3/3** including its headroom assertion.
- **R11 re-verified independently:** `claude/skills/fkit-task-done/SKILL.md` and `fkit-task-cancelled/SKILL.md` are **absent from `git status`** — the task movers' bytes really are unchanged, so `MOVED` → `folder` does reproduce them. `ATTRIBUTION_RULE` moved from `S1`'s shared list into `S2`'s substituted list and is still pinned per-roster (`T10` task side, `S2` sprint side); no subject was dropped.
- **R12 re-measured:** `Sprint 7` → `sprint-8.md` exit 0 · `Sprint 8` → exit 3 · `Backlog` → exit 1 · `Sprint 7 junk` → exit 1 · multi-line → **exit 1** (was 3). The new check cannot reject a legitimate identity — command substitution strips a trailing newline before it is reached.
- **R13 anchor verified independently of the coder's mutation report:** `SPRINT_GIT_MV` matches exactly 1 line per mover and excludes the `mkdir -p`. Rationale staleness recorded as R22.
- **R1 holds** — the link test does discriminate a fixture literal from an href, which the five-item EVIDENCE list could not. Its interaction with that list is R24.
- **R2 holds in the half it changed** — the new rationale is true and the ⛔ paragraph naming what the inversion does *not* buy is accurate (`collectFiles()` walks `ai-agents/` only). R23 is the clause it did not touch.
- **R3 and R6 are the two that did not land cleanly** — see R19/R20 and R21.
- **R6's third-instance count — CHECKED, and the coder is right.** ADR-047 `:1254-1259` names the fenced failure and its two prior instances (review R6, a depth-1 mode asked to read inside `done/`; review R16, a roll-up-less mode asked to reach a roll-up), then rules *"Re-raise on a third instance without further argument."* Round-1 R6 is structurally that third instance. **The fence licensed it; R6 was not re-litigation.**

### Verified and NOT raised — recorded so they are not re-derived next round

- **The `0381` exemption-clause placement (the trap).** Checked on disk independently of the pin: in both sprint movers the clause opens inside `### 7. Move the board FILE to …`, after the `git mv` fence and after *"Then prove it."* (`fkit-sprint-done/SKILL.md:245`→`:249`→`:254`→`:258`; `fkit-sprint-cancelled/SKILL.md:238`→`:244`→`:249`→`:253`), with the next `### ` heading at `:316`/`:311`. **AFTER-THE-MOVE is preserved, and position was correctly not preserved.** The placement is right; only the pin proving it is weak (R13) and two of the clause's sentences are wrong (R3, R11).
- **`mode_successor` correctness.** The min-scan is `identity_gt "$_best_id" "$_i"` — an argument **swap**, giving strict `<` and first-wins on a tie; a negation would give `≤` and last-wins. The status filter is `'Backlog'|'In progress'`, so `🔲 Backlog` boards are included — the exact case `select-active` drops. Exercised live: `successor … "Sprint 7"` → `sprint-8.md` exit 0; `"Sprint 8"` → exit 3; `"Backlog"` → exit 1. `dashboard-contract.test.js` S3/S5/S6 genuinely discriminate (S6 is the negation-vs-swap detector; S3 asserts the `select-active` drop directly as a control). **No defect** beyond R12's multi-line edge.
- **The three out-of-plan edits.** `claude/skills-for-role.sh:12-22` declares **six** mirrors that MUST be updated in the same commit; the plan's step-8 table named four. `claude/README.md` and `ai-agents/knowledge-base/architecture.md` are two of the six, and `architecture.md:147` would have kept saying *"The 26 skills"* against a 28-skill corpus. The live `task-status-vocabulary.md` is a declared `audience-adapted` dual-home whose contract is that both copies stay maintained. All three state facts already ruled by D1/D5; none decides anything. **Obvious winners within the plan's intent — correctly applied without asking, correctly disclosed.** (Placement of the `architecture.md` edit is R15.)
- **The uncovered-surface statement.** `worklog.md` § *The uncovered surface* names four uncovered behaviours (banner write, row disposal, link repoint, `git mv`), marks the banner-grammar check as *"a one-shot measurement, not a standing test"*, and the `S`-series header repeats *"nothing below observes a sprint mover RUNNING."* **Accurate and complete**; nothing implies coverage it lacks, with the single exception recorded as R13.
- **Baselines.** Independently re-run: `npm run test:unit` → **963 pass / 0 fail**, 24 suites, exit 0. Matches the build's claim.
- **`UNIVERSE` is 27 against 28 skills** — `fkit-sprint-ship-loop` is deliberately excluded and said so at `test/skill-ownership-hook.test.js:328`. Pre-existing and correct; not a finding.

### Re-litigates settled decisions (suppressed)

- **No `prove-red.sh` mutation for the `S`-series or the `successor` mode.** Raised by the build itself in `worklog.md`. **Suppressed** — owner-ruled 2026-09-12 to a follow-up task, now filed as `0388`. Not re-raised, and R17 is about the worklog's citation namespace, not about the missing entries.
- **`ai-agents/sprints/backlog.md`'s "Off:" bullet (D4)** — out of scope, routed to a producer.
- **`test/skill-ownership-sites.mjs` (ADR-036's declared site registry) does not exist.** Flagged by the build, correctly not fixed; implementing ADR-036 is outside this plan.

## Coder response

**Round 1, 2026-09-12.** Written by a spawned `fkit-coder` **Process-review worker** under
`/fkit-sprint-ship-loop`, on the driver's declared-approval marker (owner approved `plan.md`
**2026-09-12** via `AskUserQuestion` in the live `fkit lead` session; option label verbatim
**"Approve — build it (Rec)"**). That single approval is the **standing approval** replacing
`fkit-process-stateful-review`'s per-round fix gate (ADR-032 D3 + its autonomy amendment; discipline
mirrors ADR-019). ⛔ **`pending approval` is therefore the one Status value this round never uses** —
it is not that nothing needed approval, it is that the approval came first.

⚠️ **Severities below are DERIVED from the blast radius I traced, not inherited from the findings
table.** Two differ from the reviewer's and are marked ⭐; the disposition is unchanged in both cases.

**Owner rulings applied verbatim** (given live via `AskUserQuestion`, 2026-09-12, relayed by the
driver): **R1+R2** *"Add a rule for non-link hits (Rec)"* · **R3** *"Fix the sentence + constant
(Rec)"* · **R11** *"Reword via a 2nd variable (Rec)"* · **R10** *"Reword inside the boundary (Rec)"* ·
**R17** *"Fix it now in the worklog (Rec)"*. R4–R9, R12–R16 and R18 carry no ruling and were
dispositioned here.

### Loop check — residuals and ADR fences

*Accepted residuals* was **empty** at the start of this round, so nothing was suppressed as a
residual. `ai-agents/knowledge-base/decisions/` was skimmed for ADRs in scope (ADR-047, ADR-046,
ADR-041, ADR-040, ADR-035, ADR-033, ADR-021, ADR-005). Two fences are worth stating **loudly**:

- ⭐ **R6 is NOT closeout, and it looked like it might be.** ADR-047 §*Re-raise only if* fences
  *"§7's emitter assignment sends a drift to a mode that cannot produce it"* — but its own text says
  *"this trigger exists because that failure has now happened twice"* (its reviews R6 and R16) and
  **"Re-raise on a third instance without further argument."** R6 here is that third instance, in the
  mover prose rather than §7's table. The fence **licenses** it rather than closing it out.
- ⛔ **ADR-035 does NOT close out R4.** Its closed-row rule protects a closed row's **rank** (*"no
  closed row's rank moves"*), and its own *Re-raise only if* is *"the closed-row rule itself is up for
  revision"* — which this is not. R4 is about an **href's depth**, which ADR-035 never speaks to. See
  the R4 row.
- Nothing in this round re-argues *"refuse the close while rows are open"*, *"freeze open rows in
  place"*, *"the task movers do it the other way round"*, or the `Backlog` word collision — all four
  are named closeouts in ADR-047 and none was raised.

### Verdicts and actions — one row per finding id

| # | Verdict | Sev (derived) | Action taken | Status |
|---|---|---|---|---|
| R1 | **CORRECT** | high (= reviewer) | Re-measured myself: `grep -rn --exclude-dir=wiki-vault "sprint-8.md" claude/ test/ CLAUDE.md README.md` → **24 hits, 19 `test/` + 5 `claude/`**, and I inspected them — JS fixture literals (`'sprint-8.md': prosePlan(…)`) and illustrative examples, **including both movers' own `$ARGUMENTS` example**. Not one is an href. Added the owner-ruled rule to step 6 of **both** movers: **the link test** — repoint an occurrence only where it is inside a markdown link target `](…)` a reader would follow; everything else stays and is listed in the report's *Left frozen* line as `non-link occurrence`. The bullet says **explicitly** not to reach for the five-item EVIDENCE list, which names none of these kinds. *Left frozen* in both report sections gained `non-link occurrence` as a named reason. **Severity rationale (mine):** the executor is ordered to report hits outside `ai-agents/` (`:344`) and had no rule for the only kind present — rewriting a fixture key silently changes what a test asserts, and rewriting the movers' own doc example corrupts the skill. | ✅ done |
| R2 | **CORRECT** | medium (= reviewer) | Verified at source: `collectFiles()` in `test/reference-integrity.test.js` is `walk(path.join(root, 'ai-agents'))` — `claude/`, `test/`, `CLAUDE.md`, `README.md` and `AGENTS.md` are never walked. The false rationale is **replaced, not merely qualified** (owner ruling): the inverted order now earns itself on *"every reference you find can be resolved against a file that is still there, so you can prove each one before the move invalidates all of them at once"*, followed by a ⛔ paragraph in both movers stating what the inversion does **not** buy — no guard over the widened half — and telling the reader not to carry the task movers' reassurance across. | ✅ done |
| R3 | **CORRECT** | medium (= reviewer) | Verified: `NAMED_EXEMPT` holds plain JS string literals and `test/reference-integrity.test.js:280` already spells `plan-sprint-4c.md`; the sweep is an **unanchored raw-text grep**, so it does hit them. *"it cannot see them"* was false. Sentence rewritten in **both** movers to the true reason — a grep hit says a token is present and nothing about **which of the three directions applies**, because orphan/heal/fresh-break turns on how paths **resolve** after the move, and a healed key leaves nothing on a grep line at all. The clause's conclusion (run the guard unconditionally) is unchanged. `SPRINT_SWEEP_LEAD` updated in lockstep with a comment recording why, so the pin now pins something true; `S4`/`S5` still pin the **absence** of the task movers' *"greps `ai-agents/` only"* premise. | ✅ done |
| R4 | **CORRECT** | medium ⭐ (reviewer: medium — same, stated because I derived it independently) | Verified on disk: `ai-agents/sprints/sprint-8.md`'s `✅ Done` rows carry `../tasks/done/…/brief.md`; **14** `../tasks/` hrefs on the board. The collision is real and fires on the first close. **Resolved in favour of step 6, and the skill already required that**: step 7's *"Then prove it."* obliges the executor to resolve every relative link in the moved plan, so obeying the freeze literally is not even internally consistent. Rule 1 in both movers now reads *"a closed row's **CONTENT** is frozen"* — status cell, `P<n>` rank and prose, with ADR-035 cited for why the rank is the part that matters — and states that the **depth of an href is not covered**, naming the measurement and pointing at step 6. **Freeze the claim; repair the pointer.** **Severity rationale (mine):** guaranteed on the next real close, but it fails **loudly** — the board lands in `ai-agents/sprints/done/`, which `reference-integrity` does scan — so it is medium, not high. | ✅ done |
| R5 | **CORRECT** | medium (= reviewer) | Verified the three-way contradiction on disk (`:172` template always carries `— priority M`; `:183` forbids it on an unranked destination and names *"a successor sprint whose own board is unranked"*; `:197` demands *"the real number `M`"*). ADR-046 permits an unranked board, so the state is reachable. Step 5's table now reads `## Priority` → the real number `M` **or `Unscheduled` where the successor's board is UNRANKED and step 4 wrote no `— priority M`**, with a ⛔ paragraph giving the reason: a rank is a position on one specific board, `fkit-task-brief`'s own de-scope step 5 uses `Unscheduled` for exactly this, and **`## Priority` is checked by no guard**, so an invented number would never be caught. The row and the brief are now required to agree. | ✅ done |
| R6 | **CORRECT** | medium ⭐ (reviewer: medium; I confirm it, and note it is ADR-047's licensed *third instance* rather than a closeout) | Verified: `drift ambiguous-active-sprint` is printed at `claude/skills/fkit-status/dashboard.sh:649`, inside `mode_select_active` (`:420`), and from the board render — and **neither mover invokes either**; `fkit-sprint-done` calls `identity` + `successor`, `fkit-sprint-cancelled` calls `identity` alone. Both skills' ambiguity bullets now **drop the false claim** and state plainly that the collision will **not** announce itself on this path, naming `dashboard.sh select-active ai-agents/sprints` as the mode that does report it. ⛔ The executor's obligation is unchanged — still *stop and ask*; only the detection story is now true. The cancelled mover's copy adds that `cancelled/` is audited by nobody, so the evidence disappears with the board. | ✅ done |
| R7 | **CORRECT** | medium (= reviewer) | Verified: step 1 validated the source and nothing about the destination, and the inverted order puts every mutation before the `git mv`. Both movers gained a ⛔ bullet **in step 1, before any edit**: stop if `sprints/{done,cancelled}/<basename>` already exists. The bullet states the worse half explicitly — step 6 would have repointed every inbound link into that path, where they resolve **successfully** to the *older archived board*, the same silent-resolution hazard step 4 names for row markers, turned on the close itself. Placed up front deliberately: it is only cheap while nothing has been touched. | ✅ done |
| R8 | **CORRECT** | medium (= reviewer) | Verified: the override bullet was byte-copied from `fkit-sprint-done` into a skill whose rule is *always* Backlog (`:132-135`, `:164`) and whose step 5 offers one procedure forcing `## Sprint` → `Backlog`. Exercising it manufactures the permanent `drift disagreement` the same step warns about. **Replaced with its negation**: a ⛔ bullet saying there is no per-row override here and why — and naming the right route (a producer's separate pull-into-a-sprint act **after** the cancel, not a cell edited during it). `fkit-sprint-done` keeps its override, which is correct there: its rows have two destinations and step 5 has two matching procedures. | ✅ done |
| R9 | **CORRECT** | low ⭐ (reviewer: medium) | Verified: the bolded template read `Superseded by [<successor identity>](<successor basename>)` with no `../`. Fixed — the `../` is now **inside the template**, matching the step-4 row markers, and the following sentence spells out the silent-resolution consequence rather than reading as an aside. **Severity rationale (mine): low, not medium.** The very next sentence already supplied the correction *with a concrete worked example* (`[Sprint 9](../sprint-9.md)`), so an executor reading the bullet to its end got the right answer; the defect is that the copyable form and the rule disagreed. The fix is identical either way. | ✅ done |
| R10 | **CORRECT** | medium (= reviewer) | Verified both halves: the rule claimed a `backlog/`→`done/`→`cancelled/` triad for sprint boards, and both movers **refuse to close `backlog.md` by name** (`fkit-sprint-done:97-98`, `fkit-sprint-cancelled:110-112`) — `ai-agents/sprints/backlog.md` is a file, not a directory. Reworded **inside D3's boundary**: *"Task files AND sprint boards **reach `done/` or `cancelled/`** only via the four movers"* — **one bullet, no second bullet, `RULES_MAX` untouched.** ⭐ **Headroom verified myself before writing, as instructed:** block was **3923 B** against the **4352 B** cap = **429 B** free, confirming the reviewer's figure; the reword is **17 B shorter**, so the block is now **3906 B / 446 B free**. `rules-block-budget` **3/3**. Regenerated into `CLAUDE.md:62` and `AGENTS.md:41` by init, not by hand. | ✅ done |
| R11 | **CORRECT** | medium ⭐ (reviewer: low, and its own text argues for the upgrade) | Verified both sites. `THREE_DIRECTIONS` is descriptive; **`ATTRIBUTION_RULE` is functional** — it is the test an operator applies to decide whether a red is theirs at all, and *"where the folder just moved is spelled by the named key"* has no referent for a mover that moves a board **file**. Implemented the owner's ruling with a **second substitution variable**: `MOVED` alongside `BOARD`, and `forMover(s, board, moved)`; rosters carry `moved: 'folder'` (task) / `moved: 'board file'` (sprint). Both constants now carry `MOVED`; `ATTRIBUTION_RULE` moved out of `S1`'s byte-shared list into `S2`'s substituted list so it stays pinned per-roster. Prose updated in the two sprint movers; **the task movers' bytes are unchanged**, because `MOVED` → `folder` reproduces them exactly — which is the point of doing it with a variable. **Severity rationale (mine): medium.** A literal read routes a break the mover **caused** to *"pre-existing and left alone"*, and it does so **silently**. | ✅ done |
| R12 | **CORRECT** | low (= reviewer) | Reproduced the measurement exactly before fixing: `successor ai-agents/sprints $'Sprint 7\njunk'` → **exit 3**; single-line control `'Sprint 7 junk'` → exit 1. `is_eligible` is `grep -qE "^…$"`, line-anchored. Added a one-line check **before** `is_eligible` in `mode_successor`, with a comment recording the measurement and why exit 3 is the dangerous outcome (the mover reads it as *fall to the Backlog board*). Re-measured after: multi-line → **exit 1**; `'Sprint 7'` → `sprint-8.md` exit 0; `'Sprint 8'` → exit 3; `'Backlog'` → exit 1. **Test added**: a multi-line arm on `dashboard-contract` `ADR-047 successor S9`, three shapes, asserting exit 1 and the new message. | ✅ done |
| R13 | **CORRECT** | low (= reviewer) | Verified: `S3` compared the clause against `SPRINT_MOVER_SIGNATURE`, the step **heading**, so a clause between the heading and the `git mv` fence passed while breaking the invariant `S3`'s own message states. Re-anchored on a new `SPRINT_GIT_MV` regex matching the `git mv` **command line** (the cancelled mover's preceding `mkdir -p` is deliberately not matched — creating the destination is not the move); the heading is still asserted to exist exactly once, for a better failure message. ⭐ **Proved the new anchor discriminates**: in a scratch tree I moved the clause to immediately below the heading — **`S3` red, the other 23 green**, which also confirms R13's claim that the old pin let that pass with everything green. Banner nit fixed: `S0–S4` → `S0–S6`. | ✅ done |
| R14 | **CORRECT** | low (= reviewer) | Verified at `dashboard.sh:34-37`. CONTRACT block now says **Four** further modes and names `successor <sprints-dir> <closing-identity>` with its purpose, alongside `identity`, `status` and `select-active`. | ✅ done |
| R15 | **CORRECT** | low (= reviewer) | Verified: `architecture.md:306`'s `sprints/sprint-N.md` row still read *"completed sprints move to `sprints/done/`"* while the sprint facts sat on the task-folder row below it. **Filed under the right key**: the sprint row now carries the producer-only movers, the explicit **line-3 banner** status vocabulary, both archive destinations, and the fact that `backlog.md` is never a sprint. The task row keeps every task fact and now cross-references the sprint row instead of restating it. | ✅ done |
| R16 | **CORRECT** | low (= reviewer) | Verified: header comment and the `forbidden` array both carried `sprints/cancelled/`; `L7`'s blind-spot-4 diagnostic did not. Diagnostic updated to name all three trees, and — because `L7`'s job is honest disclosure — it now states that `sprints/cancelled/` holds no board yet, so its own residual is **0 today**: a **prospective** blind spot, disclosed rather than implied away. The `+6 residual across 2 files` figure is unchanged and correct. | ✅ done |
| R17 | **CORRECT** | low (= reviewer) | ⭐ **Not a defect in the code — a relay error in `worklog.md`, and the driver's, per the owner's own note.** Verified both series: `test/mover-exemption-step.test.js` runs `S0`–`S6` (**no `S7`**, confirmed in the run output) and `test/dashboard-contract.test.js` runs `ADR-047 successor S1`–`S10`; `S3`/`S4`/`S6` exist in both with different meanings and collided silently. Worklog corrected under the owner's ruling: a ⛔ note names the two series and their files, the first bullet is now `mover-exemption-step S1/S2`, and every mutation token is prefixed `successor`. The measurements themselves were correct and are unchanged. Flagged in-place that this feeds `0388`. | ✅ done |
| R18 | **PARTIALLY CORRECT** | low (= reviewer) | **The valid part, verified:** the grep argument list omitted root `AGENTS.md` while the prose called the sweep repo-wide. **The impact claim, verified and confirmed:** `grep -c 'sprint-[0-9]' AGENTS.md` → **0**, so live breakage today is **zero** — this is an accuracy gap in the word "repo-wide", exactly as the finding says. Fixed the valid part: `AGENTS.md` added to the grep in both movers, symmetric with `CLAUDE.md`, which is generated the same way and was already in the list. ⚠️ **Recorded, not acted on further:** `AGENTS.md`'s rules region is **generated**, so a hit there would be repaired at `claude/scaffold/universal-rules.md` and re-emitted by init, never hand-edited — the movers' existing ⛔ against hand-editing generated files already covers it, and widening that into a new rule would exceed the finding. | ✅ done |

### Round summary

- **Novel findings this round:** 18. **Dispositioned:** 18 — **17 `CORRECT`**, **1 `PARTIALLY
  CORRECT`** (R18). **Zero** `INCORRECT`, **zero** `INCOMPLETE`, **zero** `blocked`.
- **All 18 → `✅ done`.** No finding is deferred, and no new residual is recorded — *Accepted
  residuals* stays empty, because nothing here was accepted rather than fixed.
- **Suppressed as settled:** three, all pre-existing and none re-raised by the reviewer — the missing
  `prove-red.sh` entries (owner-ruled to follow-up **`0388`**, `Depends on: 0341`), D4's `backlog.md`
  bullet (producer surface, done separately), and ADR-036's absent site registry
  (`test/skill-ownership-sites.mjs` is not on disk — **re-confirmed this round**, nothing to edit).
- **Frontier-moves:** **none.** Every fix is a defect repair inside the surfaces `plan.md` authorizes.
  Two findings had to be checked hardest for this and are not frontier-moves: **R10** stays inside
  D3's explicit one-bullet boundary, and **R7** adds a validation bullet to an existing validation
  step rather than a new step.
- **Regression / oscillation check:** **clean.** This is round 1, so there is no prior round to
  oscillate against. Two near-misses, both stated rather than glossed: **R3** reverses a **plan-
  mandated** reword (the owner ruled on it directly, so it is not the coder overriding the plan), and
  **R13** strengthens an anchor the build itself had already fixed once for a different, unrelated
  off-by-one (worklog decision-log entry 5) — a deepening, not a reversal.
- **Convergence call: CONVERGED, pending the reviewer's re-read.** Every novel finding is `✅ done`,
  nothing is blocked, no residual was opened, and the three fixes with test-visible surfaces (R3,
  R11, R13) are pinned by updated assertions rather than by prose alone. ⛔ **What that does NOT
  claim:** the reviewer has not seen this round's diff, and the uncovered surface the build recorded
  is **unchanged** — no test in this repo reaches either mover's actual behaviour, so every prose fix
  above is verified by reading and by its pin, never by execution.

### Verification

| Suite | Result |
|---|---|
| `npm run test:unit` | **963 pass / 0 fail**, 24 suites, 84.5s — baseline **held** |
| `test/mover-exemption-step.test.js` | **24/24** — baseline held (R3's constant, R11's second variable and R13's re-anchor all landed green) |
| `test/reference-integrity.test.js` | **22/22**, **`0 broken, 7 named-exempt`** — both pinned figures held (corpus moved 901→**904** files, 3513→**3522** targets; those are not the pinned values) |
| `test/rules-block-budget.test.js` | **3/3** — block **3923 B → 3906 B**, **446 B** free under the 4352 B cap, `RULES_MAX` untouched |
| `test/coordination-citation-policy.test.js` | **21/21** — baseline held |
| `S3` mutation (by hand, scratch tree) | clause moved above the `git mv` fence → **`S3` red, 23 green**. Reverted. ⛔ Evidence from this round, **not** a standing gate |
| `bash claude/fkit-claude-init.sh .` | **ran** — 7 agents, 28 skills; `CLAUDE.md:62` / `AGENTS.md:41` carry the reworded rule |
| `npm test` (full, chains `prove-red.sh`) | **exit 0.** Red gate **`✓ hard gate PASSED`** — all 15 unmutated baselines green (`0o`, the mover-exemption suite, included) and **all 34 mutations red their named assertion**, including **33** (`T3`) and **34** (`T11`) — ⭐ `T11` matters here because R11 changed the constant it fires on, and it still discriminates. Run **once, at the end**, as instructed |

⚠️ **One measurement honesty note on the full run.** The first `npm test` invocation had its captured
output lost when the harness moved it to the background; rather than assert a result I did not hold, I
waited for that same process tree to finish and read its flushed output. The figures above are from
that completed run (exit 0). ⛔ **The unit phase's per-test tally is not in that capture** — only the
gate half is — but `package.json:5` chains the two with `&&`, so the gate ran **only because** the unit
phase exited 0, and the separate `npm run test:unit` above measured **963/963**. Stated because "exit 0"
and "963 green" are two different claims and only one of them was directly observed in that run.

⚠️ **`claude/structure-manifest.tsv` was checked, not assumed.** It shows 3 added rows against `HEAD`;
I reset it to `HEAD`, re-ran `npm run generate:manifest`, and got a **byte-identical** result, with a
second run idempotent. Those rows are the **build's** scaffold edits, not this round's — my only
scaffold edit, `universal-rules.md`, is **not a manifest-scoped file**, so the rules-region elision
`plan.md` §9 predicted holds and no hash moved.

---

**Round 2, 2026-09-12.** Written by a spawned `fkit-coder` **Process-review worker** under
`/fkit-sprint-ship-loop`, on the same declared-approval marker as round 1 (owner approved `plan.md`
**2026-09-12** via `AskUserQuestion` in the live `fkit lead` session; option label verbatim
**"Approve — build it (Rec)"**). That single approval is the **standing approval** replacing
`fkit-process-stateful-review`'s per-round fix gate (ADR-032 D3 + its autonomy amendment; discipline
mirrors ADR-019). ⛔ **`pending approval` is again the one Status value this round never uses.**

⚠️ **Severities below are DERIVED from the blast radius I traced, not inherited.** Two differ from
the reviewer's and are marked ⭐; neither changes a disposition.

**Owner rulings applied verbatim** (given live via `AskUserQuestion`, 2026-09-12, relayed by the
driver): **R19** *"Delete the causal clause (Rec)"* · **R21** *"Swap to the board render (Rec)"* ·
**R23** *"Fix it (Rec)"* · **R24** *"Restore EVIDENCE as an explicit exception (Rec)"*. **R20** and
**R22** carry no separate ruling and were dispositioned here — R20 consistently with R19's deletion,
as its row instructs.

### Loop check — residuals and ADR fences

*Accepted residuals* is **empty**, and the reviewer states in-section that R19–R24 are **not**
residuals, so nothing was suppressed on that ground. `ai-agents/knowledge-base/decisions/` was
re-skimmed for ADRs in scope (ADR-047, ADR-046, ADR-041, ADR-035, ADR-033, ADR-021, ADR-005). One
fence bears on this round and must be stated **loudly**:

- ⭐ **R21 is NOT `closeout`, and ADR-047's own fence is why.** Its *Re-raise only if*
  (`adr-047-…:1254-1259`) names the failure — *"§7's emitter assignment sends a drift to a mode that
  cannot produce it"* — records that it *"has now happened twice"*, and rules **"Re-raise on a third
  instance without further argument."** Round-1 R6 was the third; R6's own fix is the **fourth**. A
  fence that licenses a third instance without argument does not close out a fourth. Acted on.
- ⛔ **R19 is the THIRD iteration of one sentence**, which is the shape of oscillation. See the
  regression check below for why the disposition is nevertheless convergent: the owner's ruling
  **removes the surface** rather than rewriting it again.
- Nothing in this round re-argues ADR-047's four named closeouts (*refuse-while-rows-are-open*,
  *freeze open rows in place*, *the task movers do it the other way round*, the `Backlog` word
  collision), and none was raised.

### Verdicts and actions — one row per finding id

| # | Verdict | Sev (derived) | Action taken | Status |
|---|---|---|---|---|
| R19 | **CORRECT** | medium (= reviewer, derived independently) | Reproduced the measurement first: `grep -c "sprint-8.md" test/reference-integrity.test.js` → **0**, while `NAMED_EXEMPT` (`test/reference-integrity.test.js:279-290`) does spell `plan-sprint-4c.md` and `../sprint-4c.md`. So *"a grep for this board's basename hits them as plain JS string literals"* is true **only** when a key happens to spell this board's basename — false for the worked example in the same step. **Owner ruling applied literally: the causal clause is DELETED, not rewritten.** Both movers' sentence is now the bare locator *"**Then check the exemption keys this move may have invalidated.** They live in `test/reference-integrity.test.js`, which holds a set of named `(citing file, target)` keys exempting links that are broken on purpose."* — no reason of any kind. The instruction survives untouched where it always lived: the `UNCONDITIONAL` bullet (*"Run it unconditionally, even when the sweep above found nothing to update"*). `SPRINT_SWEEP_LEAD` shortened in lockstep so the pin matches the shortened text, and its comment now enumerates **all three** false reasons with the measurement that killed each, plus an explicit ⛔ against writing a fourth. **Severity rationale (mine):** the executor's behaviour never changed under any of the three versions — the conclusion never depended on the reason — so the blast radius is not operational. It is medium because the falsehood was **pinned byte-exactly across two shipped skills**, which makes it durable and actively resistant to correction, and because a "make the four copies uniform" pass restores whatever is pinned. | ✅ done |
| R20 | **CORRECT** | medium (= reviewer) | Verified all three sites still asserted the reason R3 disproved: the header comment's item 1, `S1`'s `why` (*"and that reason is what this sentence states"*), and `S5`'s failure message. **Resolved consistently with R19's deletion**, which is the treatment its row asks me to derive: rather than swapping in the 2026-09-12 reason (which R19 has just deleted from the skills), all three now say the sentence **carries no reason at all**, name both failed replacements with their measurements, and point at `UNCONDITIONAL` as where the rule lives. `S1`'s `why` no longer asserts anything about the sentence's content beyond its sprint-specificity, so it cannot go stale with the next reword. ⚠️ **The pre-existing half fixed too:** the two `S4` references that meant `S5` (the header comment, and the `TASK_SWEEP_LEAD_FRAGMENT` banner) — verified against the suite, `S4` is uniformity (`test/mover-exemption-step.test.js:1089`) and `S5` is the absence pin (`:1118`). **Severity rationale (mine):** these are the strings a maintainer reads **at red time**, so their whole function is to steer the next hand; steering it back toward a falsehood is the re-introduction vector `S5` exists to block. | ✅ done |
| R21 | **CORRECT** | medium (= reviewer) | **Verified the emission order and the status-agnosticism myself before writing, as the ruling instructs.** `mode_select_active` applies `[ "$_st" = "In progress" ] \|\| continue` at `claude/skills/fkit-status/dashboard.sh:470`, building `_elig`; the `ambiguous-active-sprint` emission at `:657-663` loops the ordered set derived from it. `grep -n` confirms `ambiguous-active-sprint` is printed **from exactly one place**, `:661`, inside that mode. So two `🔲 Backlog` boards claiming one identity are filtered out **before** the check and nothing is produced — and step 1 refuses only the *identity* `Backlog`, never the *status*. `sibling_claimants` (`:291-303`) compares **resolved identity only** and reads no status; the board render's call site (`:1558-1560`) is gated on `is_eligible "$PLAN_SPRINT"`, which `:256-261` documents as *"THE IDENTITY RUNG ONLY, AND ADR-047 DELIBERATELY DID NOT WIDEN IT"*, in terms, so that *"widening it would silently stop `ambiguous-plan-identity` firing on a board that is not `In progress`."* **Both movers now name the board render** — `dashboard.sh ai-agents/sprints/<basename>` — and its `⟦FACTS⟧` record. ⭐ **One correction the finding did not name and the fix required:** the record the render emits is **`drift ambiguous-plan-identity`** (`:1564`), **not** `ambiguous-active-sprint`; the old sentence was wrong about that too. Added one ⛔ line saying *not* `select-active` and why (the status filter), because a bare swap with no fence is how this class returns. **Severity rationale (mine):** this is the one finding of the six with a live operational failure mode — an executor runs the named check, gets a clean result, and closes an arbitrary one of two boards. It stays medium rather than high because the *"stop and ask"* obligation above it is unchanged and was never the thing that broke. | ✅ done |
| R22 | **CORRECT** | low (= reviewer) | Verified both stale sites. `S3`'s `moveAt` is `SPRINT_GIT_MV`, a regex on the `git mv` **command** line, which can never satisfy `startsWith('### ')` — so the `moveAt[0] + 1` slice offset is no longer load-bearing and the comment's stated reason (*"the anchor here IS a `### ` heading"*) describes the **pre-R13** anchor. Comment rewritten to say the offset merely starts the slice after the anchor, and to mark the old reason stale with its cause. The **worklog**'s build decision-log entry 5 carries the same dead rationale; because a worklog is a dated record I **appended a superseded note** rather than rewriting history. ⛔ **The assertion itself was not touched** — the finding says it is correct, and I confirmed independently that `SPRINT_GIT_MV` matches exactly one line per mover and does not match the cancelled mover's preceding `mkdir -p`. | ✅ done |
| R23 | **CORRECT** | low (= reviewer) | **Re-measured both numbers myself before writing, as the ruling instructs.** `grep -o ']([^)]*)' ai-agents/sprints/sprint-8.md \| wc -l` → **37** outbound link targets. Inbound, `grep -rho ']([^)]*sprint-8\.md[^)]*)' --include='*.md' --exclude-dir=wiki-vault .` → **12** (13 counting all file types). The reviewer's figures reproduce exactly, and the claim *"a sprint board is linked from far more places than it links to"* is **backwards by a factor of three**. **Fixed by deleting the false premise**, not by inverting the count: the corrected count would not support the conclusion either — the inversion's real justification is that the token and the file agree while the file is still there, which is true at any ratio, and which the sentence already states in bold immediately after. ⭐ **This is the R19 lesson applied to the finding next door:** rewriting a causal claim that the conclusion does not need is how this class of defect keeps returning. The ordering decision itself is ADR-047 §4's and is untouched. | ✅ done |
| R24 | **CORRECT** | medium ⭐ (reviewer: low) | Verified the collision and the specimen. The link-test bullet is unqualified and binary; the EVIDENCE absolute sits 24 lines later in the same step, and `ai-agents/tasks/done/0268-…/worklog.md` carries `[Sprint 4c](../sprint-4c.md)` twice — once in a quoted plan row (*"➡️ Moved to … — priority 3"*) and once in captured `drift disagreement` output — both exempted **by name** in `NAMED_EXEMPT`. ⛔ **Cited by quoted fragment, not by line number, deliberately** — a coordination document's line numbers move when a third party appends, and `coordination-citation-policy`'s `L2` reds an open record that cites one. My first draft of this row did exactly that and the gate caught it; recorded rather than quietly corrected. **Ordering made explicit at both sites**, per the ruling: the link-test bullet gains *"One exception, and it OUTRANKS the link test: EVIDENCE … an occurrence can be both a real markdown link and a quoted specimen, and where it is, the evidence rule wins"*, and the EVIDENCE bullet gains *"This wins over the link test above"* with the 0268 specimen named as a real, not hypothetical, case. ⭐ Written in backticks, never as a live link, so nothing new is linkable and no key is created. **Severity rationale (mine): medium, not low.** The literal reading produces two harms at once — a **forged transcript**, which is irreversible content damage to a historical record and fails **silently**, and an orphaned `NAMED_EXEMPT` key the mover is explicitly forbidden to edit, which reds `reference-integrity` loudly but cannot be repaired by the role that caused it. Disposition unchanged either way. | ✅ done |

### Round summary

- **Novel findings this round:** 6 (R19–R24). **Dispositioned:** 6 — **all six `CORRECT`**. **Zero**
  `PARTIALLY CORRECT`, **zero** `INCORRECT`, **zero** `INCOMPLETE`, **zero** `blocked`, **zero**
  `closeout`.
- **All six → `✅ done`.** Nothing deferred; **no new residual** — nothing this round was accepted
  rather than fixed, so *Accepted residuals* stays empty by outcome.
- **Suppressed as settled:** four, none re-raised by the reviewer — the missing `prove-red.sh`
  entries (owner-ruled to **`0388`**, `Depends on: 0341`), D4's `backlog.md` bullet (producer
  surface), ADR-036's absent site registry (`test/skill-ownership-sites.mjs` still not on disk), and
  **R6's third-instance count**, which both prior rounds verified against ADR-047 `:1254-1259` and
  which I did not reopen.
- **The uncovered surface is UNCHANGED and nothing here implies coverage it lacks.** No test in this
  repo reaches either mover's behaviour. Every one of this round's six fixes is prose or a test
  comment; **four of the six are verified by reading only** (R19's skill text is pinned; R21, R23,
  R24 are pinned by nothing at all). ⛔ A green 963 still says nothing about a mover running.
- **Frontier-moves: none.** All six are defect repairs inside surfaces `plan.md` authorizes — the two
  movers, `test/mover-exemption-step.test.js`, and `worklog.md`. No new rule, no new step, no new
  executable surface.
- **Regression / oscillation check — and this is the part to read.** ⚠️ **Four of the six findings
  were created by round 1's fixes** (R19, R20, R21, R22), exactly the base rate `0381` measured.
  My call on the two the driver flagged:
  - **R19 is convergent, not oscillation — *because of what the ruling does*.** Three versions of one
    sentence, each false, is oscillation by any measure; a fourth rewrite would have been instance
    four. The owner's ruling **deletes the surface instead of rewriting it**, and the deleted thing
    is the only part that kept failing: the conclusion has been stable across all three rounds. There
    is no longer a causal claim to falsify, so the class cannot recur here. That is termination, not
    another swing.
  - **R21 is a genuine new defect, and I judge it convergent — with one loud caveat.** It is a real
    fourth instance of an ADR-fenced class, and the fence licenses acting on it. The fix is a
    one-token swap to a mode I verified can produce the record. ⛔ **But the class keeps recurring for
    a reason this round did not fix:** *which mode emits which drift* is asserted in prose in four
    skill copies and is pinned by **no test**, so every statement of it is a fresh chance to be
    wrong — and I have just written another one. A durable fix (asserting the emitter map against
    `dashboard.sh`) is a new test surface, outside this plan, and I did **not** add it. **Recorded
    here as the honest residual risk of this round**, and it is the thing most likely to produce an
    instance five.
- **Convergence call: CONVERGED, pending the reviewer's re-read.** All six novel findings are
  `✅ done`, nothing is blocked, no residual was opened, and the suite baselines held. ⛔ **What that
  does NOT claim:** the reviewer has not seen this round's diff; two rounds in a row have found
  defects in the previous round's fixes; and the one structural cause named above is **unfixed by
  design**, not absent. If the reviewer's re-read finds a seventh defect in this round's six fixes,
  the right response is a durable pin, not a fourth prose pass.

### Verification — round 2

⛔ **Lead with the bad news: the first full `npm test` of this round FAILED, and the defect was
mine.** Exit **1**, `✗ hard gate FAILED`, red at baseline **`0b`** — an *unmutated* copy — not at any
mutation. Cause: the first draft of the **R24 row above** cited
`ai-agents/tasks/done/0268-…/worklog.md` **by line number**, and
`coordination-citation-policy`'s `L2` reds an OPEN record that cites a coordination document by a
line number a third party's append will move. `0341`'s ledger is the first `review.md` to sit in
`backlog/` while that gate runs, so blind spot 11 (*"an open review.md is scanned and NOT exempt —
0 today"*) stopped being 0. **Fixed by citing a quoted fragment instead**, and the row says so.
⚠️ **Why the same invocation reported 963/963 green:** `0b` re-runs the whole suite against a copied
launcher **after** the unit phase, and it scanned ledger text written during that run.

| Suite | Result |
|---|---|
| `npm run test:unit` | **963 pass / 0 fail**, 24 suites, 78.0s — baseline **held** |
| `test/mover-exemption-step.test.js` | **24/24** — held through R19's shortened `SPRINT_SWEEP_LEAD` and R20/R22's rewritten messages |
| `test/reference-integrity.test.js` | **22/22**, **`0 broken, 7 named-exempt`** — both pinned figures held (904 files, 3522 targets) |
| `test/coordination-citation-policy.test.js` | **21/21**, **`RESIDUAL 0 across 0 files`** — ⛔ **red once, at `L2`, then green.** See above |
| `test/rules-block-budget.test.js` | **3/3** — ⭐ **re-measured against the real `emit_block()`, not assumed**: block **3906 B**, **446 B** free under the 4352 B cap, `RULES_MAX` untouched. Unchanged, as expected: no edit this round touched `claude/scaffold/universal-rules.md` |
| `bash claude/fkit-claude-init.sh .` | **ran** — 7 agents, 28 skills. Verified after: both movers byte-identical to their `.claude/` copies |
| `npm test` (full, chains `prove-red.sh`) | **exit 0.** ⭐ **`✓ hard gate PASSED`** — **all 15** `0a`–`0o` baselines green and **all 34 mutations red their named assertion**, `33` (`T3`) and `34` (`T11`) included. ⭐ **The round-1 caveat is DISCHARGED, not carried:** the unit tally **inside this run** was directly observed — `tests 963 / pass 963 / fail 0`, 79.4s — because the run was redirected to a file rather than left to the harness |

⛔ **What the green does NOT prove**, restated because it is the same boundary as round 1: **no test
in this repo reaches either mover's behaviour.** R21, R23 and R24 changed skill prose that **nothing
pins**; R19's sentence is pinned only for its bytes, not its truth. The 34/34 red gate proves the
*existing* mutations still discriminate — **none of them is a sprint-mover mutation**, which is
exactly what follow-up `0388` exists to fix.

## Accepted residuals (shared, do-not-re-litigate)

**None — and none is owed. Recorded by the reviewer, round 2, 2026-09-12.**

Round 1's three residual candidates (R3, R10, R11) were each put to the owner and each ruled **fix,
not accept** — *"Fix the sentence + constant (Rec)"*, *"Reword inside the boundary (Rec)"*, *"Reword
via a 2nd variable (Rec)"*. All 18 round-1 findings were dispositioned `✅ done`; none was accepted as
a settled tradeoff, so this section stays empty by outcome rather than by omission.

⛔ **Nothing from round 2 is a residual either.** R19–R24 are open defects awaiting disposition, not
accepted tradeoffs — do not read this empty section as their closeout.

### Baselines re-verified by the reviewer, round 2

| Suite | Reviewer's own measurement |
|---|---|
| `npm run test:unit` | **963 pass / 0 fail**, 24 suites, exit 0 — the coder's figure reproduces |
| `test/mover-exemption-step.test.js` | **24/24** |
| `test/rules-block-budget.test.js` | **3/3**, `RULES_MAX=4352` untouched |
| `test/coordination-citation-policy.test.js` | **21/21** (round 1; unchanged by this round's reads) |
| `test/reference-integrity.test.js` | **22/22** (round 1; unchanged by this round's reads) |
| `successor` exit contract | `Sprint 7`→0 · `Sprint 8`→3 · `Backlog`→1 · `Sprint 7 junk`→1 · multi-line→1 |

⚠️ **Carried forward, not re-verified: the full `npm test` run.** The coder flagged honestly that its
first invocation's captured output was lost to a harness backgrounding, so **exit 0 and the red-gate
half were directly observed but the unit tally inside that run was not** — the 963/963 comes from a
separate `test:unit` invocation. ⛔ This reviewer did **not** re-run `npm test` (~9 min) and therefore
carries that caveat rather than discharging it. The red gate's *"34/34 mutations red"* is the coder's
measurement, unverified here.
