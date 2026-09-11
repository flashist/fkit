# Review — 0338

Task: `ai-agents/tasks/done/0338-flip-select-active-to-choose-the-lowest-ordered-open-sprint-and-repin-its-tests/brief.md`
File(s) under review: `claude/skills/fkit-status/dashboard.sh` · `claude/skills/fkit-status/SKILL.md` ·
`claude/skills/fkit-status/throughput.mjs` · `test/dashboard-contract.test.js` · the task folder's `worklog.md`
Status: closed-out
Coverage: **round 2** — reasoning-only second opinion (ADR-042 D1 — the normal state, not a
degradation). Codex ran (`codex-cli 0.152.0`, `gpt-5.6-sol`, exit 0) and returned a usable,
diff-grounded pass with one finding. It executed a Ruby `YAML.safe_load` over `SKILL.md`'s frontmatter,
but that measures the **source's syntax and shape**, not behaviour, and every other command it issued
was a read (`nl`, `sed -n`, `rg`, `find`, `git log`) — it never ran `dashboard.sh` or the suite. All
behaviour evidence in round 2 is the Claude reviewer's: `npm run test:unit` **895/895** (76s),
`dashboard-contract` **166/166**, `bash test/prove-red.sh` **PASSED, exit 0, 32/32, zero `✗`**
(mutations **8** and **9** both red), the R1 transcript re-run live and byte-compared, and three
mutation probes run in a scratch copy of the tree (the repo was never edited).
⚠️ Round 1's coverage state was the same state, separately assessed — this line is round 2's fact, not
an amendment of round 1's.

## Reviewer findings

| #  | Round | Sev | Location | Claim |
|----|-------|-----|----------|-------|
| R1 | 1 | high | `worklog.md` § Verification 3, pasted | The block presented as a `$`-prompt transcript is not output this code can produce. It carries `candidate file="sprint-9.md" identity="Sprint 9" status="In progress"` with **no** matching `active file="sprint-9.md"` line — structurally impossible, since an eligible identity with `In progress` status always emits an `active` line (reproduced: a two-In-progress fixture emits two). `ai-agents/sprints/sprint-9.md` does not exist; the real output has two candidates, not three. It also contradicts the sentence introducing it — *"matches the plan's expectation exactly"* — which describes the real two-candidate output. ⭐ **The code is CORRECT; this is a record defect.** Replace with the real transcript. |
| R2 | 1 | medium | `worklog.md` § Residuals and follow-ups, *"R2 — the beat-shape prose (§5) is unverifiable by the contract suite"* | Records only a **conditional** — *"⛔ If that consult returns empty, the prose must be recorded UNVERIFIED with the reason"* — and verification row 8 reads *"NOT MINE … the DRIVER spawns a producer consult after this build"*. The owner has since ruled it ships **UNVERIFIED**, reason: no second `In progress` board exists and the consult refused to fabricate one. As written, a later reader sees a pending consult, not a recorded unverified state. AB4's fallback requires the record, **never silence**. |
| R3 | 1 | medium | `claude/skills/fkit-status/SKILL.md:6` | The skill's own frontmatter `description` still says *"empty means the active **sprint**"* — singular — while the body directly beneath it now says *"the **active sprints** … *'current'* is **plural**"*. This is the routing text in the `/` menu and the first statement of the contract a model reads; this task inverted that contract and rewrote three `v1` sites in this same file but left the description. ⚠️ Fix carefully: prove-red mutations 8 and 9 red *"live corpus: every skill SKILL"* on a description that stops being a block scalar or loses its continuation indent — change the text, keep the `>-` shape and the indent. |
| R4 | 1 | low | `test/dashboard-contract.test.js:2620` | `const boardLine = (out) => selectLines(out).find((l) => l.startsWith('board '));` reintroduces the exact `.find()` shape ADR-047 §2.4 condemned, in the same change that fixed it for `activeLine`. The only board-line cardinality guards are P1's `filter(...).length === 1` and P17's exact stdout, and **both fixtures carry no `⭐ ACTIVE BOARD` marker** — so the marker-override path, the one path that computes which board line to print, has no cardinality guard at all. P6/P7 read through `boardLine` and would pass with an illegal second line. No live bug (the emit is a single unconditional `printf`); this is a harness-robustness gap. |
| R5 | 1 | low | `claude/skills/fkit-status/dashboard.sh:530-534` | `⭐ ACTIVE BOARD` on an `In progress` banner whose board has an **ineligible identity** is silently ignored — zero drift, no effect. Reproduced: `backlog.md` carrying `> ## 🔄 In progress — 2026-01-01. ⭐ ACTIVE BOARD` yields an **empty** `⟦FACTS⟧`, exit 0. `active-marker-on-non-active` cannot fire (the banner **is** `In progress`) and the board can never become `board` (ineligible identity). ADR-047 §7's condition is written in status-space only, so this is a gap the ADR leaves open rather than a violation — but it is the one place the marker does nothing and says nothing, in a design whose discipline is *"never silently"*. |
| R6 | 1 | low | `claude/skills/fkit-status/dashboard.sh:453-464` | `ambiguous-active-marker` under-counts when two files share one identity. Reproduced: `sprint-4.md` (In progress) + `plan-sprint-6.md` and `sprint-6.md` (both `Sprint 6`, both `In progress`, **both marked**) → `board file="plan-sprint-6.md" … reason="active-marker"` and **no `ambiguous-active-marker`**, though §7's literal condition — *"more than one board carries the marker"* — is met. The `_n_claim` scan runs over `_ordered`, which has already collapsed each identity to one record. ⭐ **Mitigated, and really so:** both markers name the **same sprint**, so the answer is unambiguous, and `drift ambiguous-active-sprint identity="Sprint 6" chosen="plan-sprint-6.md" also="sprint-6.md"` fires naming both files. The actionable half is the **test gap** — no test covers marker + same-identity in either direction. (The mirror case, where only the tie-**loser** is marked, is declared and justified by the build's D7 and is a frontier-move, not a defect.) |
| R7 | 1 | low | `claude/skills/fkit-status/SKILL.md:86-87`, `:243` | The same file now excludes `ai-agents/sprints/cancelled/` from selection (added by this task) but still resolves `/fkit-status Sprint N` only against `sprints/` and `sprints/done/`, and still narrates *"On a closed sprint (one you found in `sprints/done/`)"*. ADR-047 §3 makes `cancelled/` the archive for a cancelled board. The file is now internally inconsistent. ⚠️ The plan fenced this — Step 7: *"A named sprint and `Backlog` are unchanged"* — and `sprints/cancelled/` does not exist yet (`0341` creates it on first use), so whether it lands here or routes to `0341` is the owner's call. |

| R8 | 2 | low | `test/dashboard-contract.test.js:3389` | The P14 header comment still reads *"THE SILENT-REGRESSION GUARD FOR §6.1's MECHANICAL CHANGE, and the ONLY test that can catch it"* — a claim **this task's own worklog withdrew** (its mutation-probe table records the comparator trap reding *"**P14**, S6, S7"*). ⭐ **Measured this round, and round 2 made the claim MORE false, not less:** applying the trap (`! identity_gt "$_i" "$_best_id"`) to a scratch copy reds **four** tests — `ADR-041 S6`, `ADR-041 S7`, `ADR-047 P14`, **and `ADR-047 P18`**, the test this very round added. So the round that added a fourth discriminator left the "only" standing. ⚠️ The same claim has a **second site**, `claude/skills/fkit-status/dashboard.sh:397` (*"Test P14 is the ONLY test that discriminates the two"*), which sits **behind round 2's fence** — flagged, not re-reviewed. ⛔ The cost is a future reader deleting S6/S7/P18 believing them redundant, or trusting P14 alone. ⭐ Raised at the owner's explicit routing. |
| R9 | 2 | low | `review.md` § Coder response, row **R6** | The row's measurement claim — *"counting claimants per FILE instead of per identity reds P18 (with P6 and P7)"* — is **not reproducible in its parenthetical half**. ⭐ Probed: the faithful mutation (the claimant scan walking `_elig`, the per-**file** eligible set, instead of `_ordered`, the identity-collapsed one) reds **`ADR-047 P18` alone** — P6 and P7 stay green. ⛔ And they **structurally cannot** red: P6's fixture is `sprint-4` / `sprint-9` / `sprint-10` and P7's is `sprint-4` / `sprint-9` / `sprint-10`, **one file per identity in both**, so per-file and per-identity counts are equal by construction and no such mutation can distinguish them. ⭐ **The load-bearing half of the claim is TRUE and stronger than stated** — P18 is the *sole* discriminator, not one of three. ⚠️ Raised because this task's demonstrated failure mode is a recorded measurement the code does not produce (**R1**), and the discipline R1 established is that such a record is corrected in place and loudly, never quietly. **No code change is implied.** |
| R10 | 2 | low | `test/dashboard-contract.test.js:2626` | Raised by **Codex**. The new `boardLine` guard filters on `startsWith('board ')` — **with a trailing space** — so a broken script emitting one well-formed `board` line plus a malformed `board`-prefixed one (a bare `board`, or `board\tfile="…"` if the format string itself broke) slips past the plural check. P1's own explicit cardinality assertion uses the same prefix, so it shares the blind spot; only P17's byte-for-byte stdout would catch it, and only on P17's two fixtures. ⚠️ **Asymmetric with its own model:** `activeLine` filters `startsWith('active')`, **no space**, and would catch the equivalent malformation. ⭐ Narrow: reaching this needs the `printf` format string itself to be broken, which P17 reds. Verified `CORRECT`, **low** — a harness nit, and the cheapest fix is deleting one space. |

### ⭐ Round 2 — re-verification of the round-1 fixes (measured, not read)

| Round-1 finding | Coder's claim | My verdict |
|---|---|---|
| **R1** — falsified verification transcript | retracted in place, replaced with a re-measured run | ⭐ **VERIFIED BY EXECUTION.** I ran `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` myself and `diff`-ed the output against the pasted block: **byte-identical**, exit **0**. Corroboration also holds — `ai-agents/sprints/` has exactly two depth-1 `.md` boards (`backlog.md`, `sprint-8.md`), and `git log --all` over `ai-agents/sprints/sprint-9.md` returns nothing. ⭐ The retraction is loud, in place, and does not overclaim (it says the git evidence cannot rule out an untracked file) |
| **R2** — beat shape must be recorded UNVERIFIED | both sites rewritten | **VERIFIED.** Residual **R2** and verification **row 8** in `worklog.md` each state `UNVERIFIED` **with the reason** (no second `In progress` board exists; the consult refused to fabricate one), and each marks itself a recorded state, not a pending action. Neither reads as a waiting consult |
| **R3** — frontmatter still singular | one line changed, `>-` shape preserved | **VERIFIED, shape and words.** `description: >-` intact; all four continuation lines at exactly 2 spaces; **no tab, no trailing whitespace** (checked with `sed -n l`); `git diff` shows **one line changed, none added**; prove-red mutations **8** and **9** both still red |
| **R4** — `boardLine` was a `.find()` | filter-and-throw; *"12 reds with the guard, 2 without"* | ⭐ **VERIFIED BY INDEPENDENT MEASUREMENT, exactly.** Injecting a duplicate `board` `printf` into a scratch copy reds **12** tests with the guard (S1, S1b, S2, P1, P2, P5, P6, P7, P12, P14, P17, P18) and **exactly 2** with `.find()` restored (P1, P17). ⛔ **P6, P7 and P18 do go green silently under the old shape** — confirmed |
| **R5** — marker on an ineligible identity | accepted residual, no code change | **VERIFIED, and the coder's correction to my round-1 wording is right.** Reproduced: lone `backlog.md` with `🔄 In progress … ⭐ ACTIVE BOARD` → `active none`, **empty `⟦FACTS⟧`, exit 3** — not exit 0. My round-1 row said *"exit 0"*, which holds only for the realistic case alongside an eligible sprint. A detail in my phrasing, not a defect in the finding |
| **R6** — under-count + missing test | residual + `ADR-047 P18` | **VERIFIED on the load-bearing half; see R9 for the parenthetical.** P18 exists, covers both directions, and **discriminates**: the per-file mutation reds it (and nothing else). It also asserts the under-count *positively* and pins the `ambiguous-active-sprint` mitigation naming both files |
| **R7** — `SKILL.md` inconsistent on `cancelled/` | routed to `0341`, not fixed | **VERIFIED as routed.** All three sites are as described and unchanged; the residual naming `0341` is recorded in `worklog.md`. ⚠️ On the `Status` cell — see **NEEDS-DECISION** in the report |
| **`dashboard.sh` not edited this round** | byte-identical to a pre-probe copy | ⚠️ **VERIFIED BEHAVIOURALLY, NOT BYTE-PROVEN — and I say so rather than claiming more.** I hold no round-1 snapshot to diff against (`.claude/`'s mirror is from 2026-09-04 and predates the task). What I did measure: round 1's R5 and R6 reproductions both replay **exactly** as round 1 recorded them, `prove-red` is **32/32**, and the unit suite is **895/895**. That is strong evidence of no behavioural change, and it is not a byte proof |

### Suppressed as settled (not dropped — recorded with its pointer)

- **Tab or newline in a candidate basename corrupts the internal record stream** (Codex, medium).
  **Pre-existing at HEAD and already settled in a prior round.**
  `git show HEAD:claude/skills/fkit-status/dashboard.sh` line 263 already reads *"Both are accepted
  limits, consistent with every other line-based parser in this file — but they are limits, not
  safety, and the record here says so rather than claiming the opposite"*, recorded under that file's
  review R2. `0338` carries the comment forward unchanged and introduces nothing. Re-raise condition
  (a second consumer that must survive such a basename) is not met. **Not `0338`'s.**

### Disproven — recorded so the coder does not chase it

- **The producer consult's hypothesis that *"All … reach the roll-up's drift clause too"* carries a
  SECOND defect (false on `select-active`) is INCORRECT.** That sentence sits inside
  `#### What to do with ⟦FACTS⟧`, under `### 4. The dashboard — run the script, don't hand-build it`
  — the **render-path** section. All six records listed beneath it are render-path records and all six
  set `plan_level_drift`, so the clause is **true as written**. The `select-active` section separately
  and correctly states *"it has no roll-up"*. ⭐ **The only defect in that sentence is the
  already-known count (*"four"* vs six), which the driver is already routing.** Codex reached the same
  conclusion independently.

## Coder response

⚠️ **Severity in this table is MINE, derived from the blast radius I traced — never inherited.** Where
it differs from the reviewer's label the difference is stated in the row. ⭐ Round 1 was processed
under `/fkit-sprint-ship-loop`'s standing approval (ADR-032 Decision 3 + its autonomy amendment), so
no row carries `pending approval`; the three owner rulings **AC5 / AC6 / AC7** are named where they
decide a row.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | **Defect** (record, not code) — **my severity: high**, same as the reviewer's, but derived independently: the blast radius is not this task, it is `0341`, whose builder reads this worklog as the reference for the reader's behaviour, and the retracted block depicted the **inverse** of the plural rule | ⛔ **Retracted the falsified `$`-prompt block and replaced it with a genuinely re-measured run** (`worklog.md` § *Verification 3, pasted*). The retraction is recorded **in place and loudly**, not quietly swapped: a reader must be able to learn that a verification record here was once false. Re-measured this round on the canonical `claude/` path — two candidates, `sprint-8.md` the only `active`, empty `⟦FACTS⟧`, exit 0. ⭐ Independently corroborated: `ai-agents/sprints/` holds exactly two depth-1 `.md` files; `sprint-9.md` does not exist. ⭐ **The CODE is correct and unchanged** — `dashboard.sh` was not edited | ✅ done |
| R2 | CORRECT | **Defect** (record) — **my severity: medium**. A reader of the closed task would see a pending consult where the owner has recorded a permanent state; the cost is a contract shipping with no recorded verification status, which is exactly the silence AB4's fallback forbids | Recorded it **plainly as UNVERIFIED with the reason**, per the owner ruling *"Close with it recorded UNVERIFIED (Rec)"*: no second `In progress` board exists and the consult refused to fabricate one. Rewrote **both** sites — `worklog.md` § *Residuals and follow-ups*, residual **R2**, and § *Verification — measured, not estimated*, **row 8** — so neither still reads as a pending action. ⛔ I did not verify the consult's refusal myself; it is recorded **as the owner's ruling**, attributed, not as my measurement | ✅ done |
| R3 | CORRECT | **Defect** — **my severity: medium.** ⭐ I reach medium on my own trace and do **not** simply adopt the reviewer's raise over Codex's low: the frontmatter `description` is the `/`-menu routing text and the first statement of the contract a model reads, and it asserted the singular that this very task inverted | `claude/skills/fkit-status/SKILL.md:7` — *"empty means the active sprint."* → *"empty means the active sprints, plural."* ⭐ **One line changed, no line added**, so no `SKILL.md` coordinate elsewhere shifts. ⚠️ Shape preserved deliberately (`description: >-`, 2-space continuation indent, no tab, no trailing space, value still folds to one line) — measured: `skill-frontmatter` green, and `prove-red` mutations 8/9 are the gate | ✅ done |
| R4 | CORRECT | **Defect** (harness) — **my severity: low**, and I agree with the reviewer that there is **no live bug**: the emit is one unconditional `printf`. The cost is purely that a broken script could pass | `test/dashboard-contract.test.js` — `boardLine` no longer uses `.find()`; it filters and **throws on a plural**, mirroring `activeLine` and citing the same ADR-047 §2.4 reason. ⭐ **Measured, and the gap R4 named is exactly the gap it closes:** injecting a duplicate `board` line reds **12** tests with the guard and only **2** without it — and **P6, P7 and P18, the whole marker-override path, pass silently without it**. Tree restored byte-clean after the probe | ✅ done |
| R5 | CORRECT | **Frontier-move** — **my severity: low.** Traced: the only board with an ineligible identity in practice is `backlog.md`, and nothing downstream honours a marker there. Reproduced both ways — alone, empty `⟦FACTS⟧` at exit **3**; alongside an eligible active sprint, empty `⟦FACTS⟧` at exit **0**. ⚠️ The reviewer's row says *"exit 0"*; that is right for the realistic case and not for the lone-`backlog.md` case, which is a detail, not a defect in the finding | ⛔ **No code change**, per owner ruling **AC5** *"Accepted residual (Rec)"*. Recorded below as **`marker-ignored-on-ineligible-identity`** with the full What / Why (structural) / Re-raise-only-if | won't fix (frontier) |
| R6 | CORRECT | **Frontier-move on the under-count + a real test gap** — **my severity: low**, because the mitigation is genuine, not nominal: `ambiguous-active-sprint` fires naming **both** files, and both markers name the **same** sprint, so the answer is unambiguous in a way P7's is not | Per owner ruling **AC6** *"Residual + add the test (Rec)"* — **both halves done.** Residual **`marker-under-count-on-shared-identity`** recorded below; **test `ADR-047 P18` added**, pinning the combination in **both** directions (both files marked → the under-count, asserted positively, plus the `ambiguous-active-sprint` mitigation; only the tie-**loser** marked → D7's ignored marker). ⭐ **Probed, and it discriminates:** counting claimants per FILE instead of per identity reds **P18 — and P18 ALONE.** ⛔ **CORRECTION (round 2, review R9):** this cell previously read *"reds P18 (with P6 and P7)"*. **That parenthetical was wrong and is withdrawn.** Re-measured on a scratch copy — the claimant scan walking `_elig` (per file) instead of `_ordered` (identity-collapsed) reds **1** test, `ADR-047 P18`; P6 and P7 stay **green**, and they **structurally cannot** red: both fixtures are `sprint-4.md` / `sprint-9.md` / `sprint-10.md`, **one file per identity**, so the per-file and per-identity counts are equal by construction. ⭐ **The load-bearing half is true and STRONGER than I first stated** — P18 is the *sole* discriminator, not one of three | ✅ done |
| R7 | CORRECT | **Defect** (documentation, internal inconsistency) — **my severity: low.** Verified all three sites. There is **no live wrong behaviour today**: `ai-agents/sprints/cancelled/` does not exist, so a named-sprint lookup cannot miss a board that is in it | ⛔ **Deliberately NOT fixed here**, per owner ruling **AC7** *"Route to 0341 (Rec)"* — `0341` is the task that brings the folder into existence, and fixing the narration before the folder exists documents a path nothing can take. ⭐ **Routed, not dropped:** the follow-up text is in my return to the driver, which owns the routing. ⛔ I did not edit `0341`'s brief | blocked |

| R8 | CORRECT | **Defect** (record, not code) — **my severity: low.** ⚠️ I do **not** inherit the reviewer's label; I reach the same one by tracing it. There is **no live bug and no behaviour at stake**: both sites are comments, and the comparator they describe is correct. The cost needs a **second actor to act wrongly on it** — a future reader deleting `S6`/`S7`/`P18` as redundant, or trusting `P14` alone. ⭐ What lifts it above trivial is its **direction**: the claim got *more* false this round, because round 2 added the fourth discriminator itself | ⭐ **Verified the four-test claim MYSELF before writing it**, as ruled — the trap `! identity_gt "$_i" "$_best_id"` applied to a scratch copy (the repo was never edited) reds **exactly four**: `ADR-041 S6`, `ADR-041 S7`, `ADR-047 P14`, `ADR-047 P18` — **162 pass / 4 fail of 166**, against a **166/166** scratch baseline. ⭐ **Fixed BOTH sites**, per owner ruling **AD1** *"Fix both sites (Rec)"*: `test/dashboard-contract.test.js` (P14's header comment) and `claude/skills/fkit-status/dashboard.sh:397`, the site round 2's fence excluded. Both now **name all four** and withdraw the old claim in place rather than quietly dropping it. ⛔ **Comment text only — no assertion, no code, no behaviour changed** | ✅ done |
| R9 | CORRECT | **Defect** (record — my own ledger row) — **my severity: low.** Traced: no code is implied and no test changes. The blast radius is a later reader over-estimating coverage, believing `P6`/`P7` guard the per-file count when they cannot. ⭐ I rate the *discipline* higher than the severity: this is the **R1 failure mode** — a recorded measurement the code does not produce — and it was **mine** | ⭐ Corrected **in place and loudly**, per owner ruling **AD2** *"Correct in place (Rec)"* — the R6 row above now records what it previously said, that the parenthetical is **withdrawn**, and the re-measured fact. ⭐ **Re-measured, not taken on the reviewer's word:** the per-file mutation reds **`ADR-047 P18` alone** (165 pass / 1 fail of 166), and I confirmed the structural half at source — P6's and P7's fixtures are both `sprint-4.md` / `sprint-9.md` / `sprint-10.md`, **one file per identity**, so no such mutation can distinguish them. ⭐ **The load-bearing half is TRUE and stronger than I stated.** ⛔ **No code change** | ✅ done |
| R10 | CORRECT | **Defect** (harness) — **my severity: low**, which I reach independently and which the reviewer's own text supports: reaching the gap needs the `printf` **format string itself** to be broken, and **P17** already reds on exactly that. So it is a robustness nit with **no live bug**. ⭐ **Not an oscillation with R4** — R4 replaced `.find()` with filter-and-throw; this widens that same guard's prefix. The filter is strictly broader, so the throw can only fire **more** often. It strengthens R4, never reverses it | ⭐ **Deleted the one space**, per owner ruling **AD3** *"Fix it — delete one space (Rec)"* — `boardLine` now filters `startsWith('board')`, matching `activeLines` and `candidates`, which both filter with no trailing space. ⭐ Verified it **cannot over-match**: `active`, `board` and `candidate` are the only three record prefixes `select-active` emits inside `⟦SELECT⟧` (`dashboard.sh:476`, `:482`, `:499`). Comment added naming the reason so the symmetry does not read as accidental. ⛔ **CORRECTION (round 2 close-out, owner ruling AE1, 2026-09-11, option label "Fix P1 too (Rec)").** This cell previously read *"Scope kept to the ruling: P1's own inline assertion uses the same `'board '` prefix and I did **not** change it — AD3 ruled *one* space, and AD1 is where the owner said 'both sites'"* — I read the contrast between the two sites as deliberate. ⭐ **That reading was WRONG and is withdrawn:** the driver did not know P1's inline assertion shared the prefix when it wrote AD3, so the contrast was an oversight, not a decision. **P1's assertion now filters `startsWith('board')` too** — the same one-character fix for the same reason. ⭐ **Measured after the fix:** `test/dashboard-contract.test.js` has **no `'board '` filter left** — `boardLine` and P1 were the only two sites, and `activeLines`/`candidates` never had one, so all four `⟦SELECT⟧` prefix filters are now space-free. Re-confirmed it cannot over-match **for P1's specific assertion**: `active`, `board` and `candidate` are the only record prefixes emitted inside `⟦SELECT⟧`, none of the other two has `board` as a prefix, and P1's own count still asserts **exactly 1** and passes. ⭐ **Flagging it rather than carrying it silently was right** — leaving one site inconsistent is precisely what **R8** was about | ✅ done |

> ⚠️ **On R7's `Status` cell.** The vocabulary — `pending approval` · `✅ done` · `won't fix (frontier)`
> · `disproven` · `closeout (re-litigation)` · `blocked` — has **no value for "deferred to a named
> successor task by owner ruling"**. `✅ done`, `won't fix (frontier)`, `disproven` and `closeout`
> would each be false. `blocked` is the only cell that does not misreport, and the reason is stated
> above rather than left to be inferred. ⭐ Flagged as a **vocabulary gap**, not resolved silently.
>
> ⭐ **Round 2 — settled by owner ruling AD4.** The cell **STANDS, with its flag**: the reviewer judged
> `blocked` the **least-wrong** of the six values and this handling **acceptable as-flagged**. The real
> fix is a **vocabulary addition to both review skills' schema — a new task, not this one.** ⛔ I did
> not write that task; routing is the driver's.

> ⛔ **Why `closed-out` while R7's cell reads `blocked`.** `blocked` here does **not** mean `0338` is
> blocked — it means the schema has no word for *"deferred to a named successor task by owner ruling"*.
> R7 was routed to **`0341`** by ruling **AC7**, and ruling **AD4** adjudicated both the cell and the
> vocabulary gap. ⭐ **Nothing inside `0338` is awaiting action:** all seven round-1 findings are `✅
> done` / `won't fix (frontier)` / owner-routed and were **re-verified by execution in round 2**; all
> three round-2 findings are `✅ done`; the reviewer recommended **no round 3**. ⚠️ Contrast with round
> 1, where I deliberately left this `in-review` — then, round 1's fixes were unverified by anyone but
> me. That is no longer true.

## Accepted residuals (shared, do-not-re-litigate)

- **`marker-ignored-on-ineligible-identity`** *(owner ruling AC5, 2026-09-11, option label
  "Accepted residual (Rec)"; review round 1, R5)*
  - **What:** a `⭐ ACTIVE BOARD` marker in an `In progress` banner on a board whose **identity is
    ineligible** (in practice `ai-agents/sprints/backlog.md`) is **silently ignored** — the board never
    becomes `active` or `board`, and **no drift record is emitted**. Reproduced: alone, empty
    `⟦FACTS⟧` and exit 3; with an eligible active sprint present, empty `⟦FACTS⟧` and exit 0.
  - **Why (structural):** ADR-047 §7's two marker records are both written in **status-space** —
    `active-marker-on-non-active` fires on a banner that is **not** `In progress`, and this banner
    **is** `In progress`; `ambiguous-active-marker` needs **more than one** claimant. An ineligible
    identity falls between them, so this is a **gap the ADR leaves open, not a violation of it**. The
    rejected alternative — a tenth drift kind for it — is a **spec change**, not an implementation
    fix, and ADR-047 is accepted and closed (ruling AB1 forbids amending it here). Blast radius is a
    marker on `backlog.md`, which nothing downstream would honour anyway.
  - **Re-raise only if:** ADR-047 (or a successor ADR) gains a marker record defined in
    **identity-space**; **or** a board with an ineligible identity becomes something a marker could
    legitimately select; **or** a second consumer starts reading the marker and would act on it.

- **`marker-under-count-on-shared-identity`** *(owner ruling AC6, 2026-09-11, option label
  "Residual + add the test (Rec)"; review round 1, R6)*
  - **What:** `ambiguous-active-marker` counts claimants **per identity, not per file**. When two
    **files** resolve to one identity and **both** carry `⭐ ACTIVE BOARD`, the count is 1, so the
    record does **not** fire — even though §7's literal condition (*"more than one board carries the
    marker"*) is met. The marker still wins the board and resolves to the tie winner.
  - **Why (structural):** the claimant scan runs over `_ordered`, which has by then **already
    collapsed each identity to one record** — the same collapse that makes `active` one line per
    sprint rather than one per file. Counting files instead would have to re-expand a set the design
    deliberately narrowed. ⭐ **Nothing goes unreported:** `drift ambiguous-active-sprint` fires and
    names **both** files, and both markers name the **same** sprint, so the choice is unambiguous —
    unlike P7's two-identity case, which is what the record exists for. The rejected alternative
    (count per file) makes the record fire on a case with **no ambiguity to resolve**, adding noise.
    ⛔ **The actionable half was the missing test, and it is now written** — `ADR-047 P18`, covering
    both directions.
  - **Re-raise only if:** the per-identity collapse moves or `ambiguous-active-sprint` stops naming
    every claimant (so the collision would go unreported); **or** a consumer appears that must
    distinguish "one file claims the board" from "several files of one sprint claim it". ⛔ **If
    `_n_claim` is ever widened to count files, `ADR-047 P18` reds — change this residual with it.**

- **`status-vocabulary-has-no-deferred-to-successor-value`** *(owner ruling AD4, 2026-09-11, option
  label "Record the residual (Rec)"; review round 1, **R7** — the row's `Status` **cell**, not the
  finding, which is itself `CORRECT` and routed)*
  - **What:** the shared *Coder response* `Status` vocabulary — `pending approval` · `✅ done` ·
    `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · `blocked` — has **no value
    for *"deferred to a named successor task by owner ruling"***. That is the whole reason **R7**'s
    cell reads **`blocked`**: R7 was routed to **`0341`** by ruling **AC7**, and of the six values
    `✅ done`, `won't fix (frontier)`, `disproven` and `closeout (re-litigation)` would each be
    **false**. ⛔ **`blocked` does NOT mean `0338` is blocked** — nothing inside `0338` is awaiting
    action; it means the schema has no word for the state R7 is actually in.
  - **Why (structural):** the vocabulary is defined in the **two review skills' schema**, not in this
    ledger — `claude/skills/fkit-process-stateful-review/SKILL.md` § **Status vocabulary** (*"pending
    approval · ✅ done · won't fix (frontier) · disproven · closeout (re-litigation) · blocked."*) and
    its mirror in `claude/skills/fkit-stateful-review/SKILL.md` (*"Its Status vocabulary — … — is the
    coder's to set."*). **No entry in this file can fix it**, and a ledger that coined a seventh value
    locally would put itself out of step with every other `review.md` — schema drift is a worse defect
    than the one it papers over. The reviewer judged **`blocked` the least-wrong of the six** and this
    handling **acceptable as-flagged** (ruling **AD4**). Rejected alternatives: **silence** (a future
    reader infers the cell is a live blocker — the exact misreading the flag exists to prevent) and a
    **local coinage** (drift, above).
  - **Re-raise only if:** ⭐ **the vocabulary itself gains a value for this case** — a `deferred
    (→ NNNN)` value added to **both** skills' schema, which is being filed as a Backlog task under
    ruling **AD4**. When it lands, R7's cell moves to that value and this residual closes with it.
    ⛔ **Until then this entry exists to stop a future reviewer re-raising R7's `Status` cell** as a
    defect, a mis-set status, or a live blocker: it is recorded, adjudicated by the owner, and
    least-wrong by the reviewer's own judgment. ⚠️ Re-raise is **not** warranted by merely disagreeing
    that `blocked` is the best of the six — that is the settled half.
