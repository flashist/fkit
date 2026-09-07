# Review — 0357

Task: `ai-agents/tasks/done/0357-sweep-b-the-single-site-correction-notes/brief.md`
File(s) under review: the 29 repaired files of Sweep B + this task's `worklog.md`. ⛔ Excluded by name
as the driver's own work, not the coder's: `ai-agents/sprints/sprint-7.md`, `0357`'s `brief.md`,
`0357`'s `plan.md`.
Status: closed-out
Coverage: **reasoning-only second opinion** — ADR-042 D1, the normal state, **not** a degradation.
Round 2, after the usage limit reset: `codex exec` (`codex-cli 0.152.0`, read-only sandbox, **exit 0**,
191,867 tokens) delivered a **usable pass — five findings** against the diff, the member briefs and
live source. ⛔ **It measured nothing:** all **27** of its commands were reads (`sed`, `rg`, `git
diff` / `git show`, `find`, `git ls-tree`, `git status`), and every one of its five evidence clauses
cites source *text*, never a run. **Any execution evidence in this section is mine** — the dashboard
run over a pristine `git archive` extract, the `npm run generate:manifest` re-run, both guards,
`gh run list`, and the repo-wide byte scans. ⚠️ Round 1's `Codex unavailable` state is **superseded,
not amended** — coverage is stated per round, and this is round 2's fact.
⭐ Recorded because it is on-topic: the `0264` ledger this sweep annotates already says *"**Codex
could not run the suite** … All execution evidence in this ledger is mine"*, and ADR-042 exists
because of exactly this condition.

## Reviewer findings

| # | Round | Sev | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1 | high | `worklog.md § Step 8 — the hand-off to the producer`, the close list | `0312` closes as `Done` under the reason common to all eighteen — *"its correction landed at its own named site under its own brief's constraints"* — but that is true of occurrence A only. Its brief's `## What to build` item 2, *"**Rewrite occurrence B** so that all four falsified clauses go"*, is **unrepealed and undone**; `architecture.md` §9.1 still carries *"Neither has been observed green on a runner yet"*, *"lands unpushed"* and *"only ever run on darwin"* (measured whitespace-normalised, 2026-09-04). The owner's ruling was **"File B as a follow-up (Rec)"** — no follow-up brief exists (the only backlog file naming *"occurrence B"* is `0312`'s own), and the hand-off does not ask the producer for one. ⚠️ **Mitigation, stated honestly:** the coder DID surface B upstream, in `worklog.md § Refusals and report-only findings` (*"See the loud residual in the return"*), and the close has not happened yet. But once `0312` closes, the only board row tracking those clauses is retired with nothing filed behind it — in the document `CLAUDE.md` points every role at. |
| R2 | 1 | medium | `worklog.md § Step 5 — the repairs, grouped by target file`, the `0276` row's Diff cell | The cell reads *"skill `+6 / −4`"*. Measured: `git diff --numstat claude/skills/fkit-task-brief/SKILL.md` → **`5  3`**. ⭐ **This is a second instance of the exact class the coder self-reported** in `worklog.md § A GAP I INTRODUCED…` — *"a table row describing a repair is not evidence the repair happened"*. The repair itself did land and is correct; the proof cell is wrong. Every other Diff cell in that table was checked against `git diff --numstat` and matches. |
| R3 | 1 | medium | `worklog.md § Step 5 — the repairs, grouped by target file` | **`0279` has no row in that table at all** — no `+N / −0` proof, no scope quote, no evidence of its own six verification steps — although it is on the close list and edited three files. The brief's verification step 4 asks for a diff proof run as a command *"on every edited record"*, and `0279`'s own verification step 1 requires the two landed fragments *"quoted side by side … ⛔ Not 'I edited both'; **show both**"*. ⭐ The repair itself is correct — I verified it independently: both homes edited, gloss byte-for-byte identical to `0268`'s landed text in `task-status-vocabulary.md`, that file untouched, no marker token changed, exactly the three allowed paths, and `npm run generate:manifest` re-run by me reproduces `claude/structure-manifest.tsv` byte-identically. |
| R4 | 1 | medium | `plan.md § OWNER RULINGS`, ruling **L3**, vs `worklog.md § Step 1 — frozen membership`, the `0279` row | Ruling L3 says ⛔ *"The homes are **glossed separately and adapted**, never byte-copied"*. Measured: the two added blocks are **byte-identical** (same md5 over the extracted `+` lines). ⭐ **The byte-copy is the CORRECT act** — `0279`'s own brief requires it: *"The gloss should therefore land **textually identical** in both — this file's parity exception is about its *header framing*, not this table"*, and *"Add the textually identical gloss to the scaffold copy."* So an owner ruling and a member brief genuinely conflict and the coder resolved it in the member brief's favour, which is what *"a sweep does not relax a member's scope"* demands. ⛔ **The defect is that the departure from an owner ruling is recorded nowhere** — not in the worklog, not in the hand-off. |
| R5 | 1 | medium | `0276`'s `brief.md`, the grep-hit adjudication table, the row for *"the tool says so on every run and never guesses"* | That row reads *"⚠️ **Judgement required.** … **Decide explicitly; record the verdict either way.**"*, and `0276`'s verification step 4 requires *"Every `grep -rn 'unresolved-plan-sprint'` hit has **exactly one recorded verdict**"*. The sentence is still present in ADR-041 and **no verdict for it appears anywhere in `worklog.md`** (grep for *"never guesses"* returns nothing there). `0276` nevertheless closes as `Done`, so a named verification step of an absorbed member is unmet at close. |
| R6 | 1 | low | `0327`'s `review.md § Corrections (record repair — task 0335)`, notes **B1**, **B2**, **B3** | `0335`'s brief requires *"**Every note states** that the corrected text is left byte-identical, carries the date, quotes the …"*. B1 carries a byte-identity statement but no date of its own; **B2 carries neither**; B3 carries a date but no byte-identity statement. Both are supplied **collectively** by the section preamble (*"added 2026-09-04 …"*, *"All three party sections above are left byte-identical"*), which is a reasonable form — but it is not the per-note form the member brief specifies, and the worklog does not name the substitution. A1–A4 and B4 are complete. |
| R7 | 1 | low | `0139`'s `review.md`, the `0146` note's clause *"⛔ **The *Why* clause and the *Re-raise only if* condition above are UNTOUCHED and byte-identical.**"* | Overstated about itself. The line carrying `· Why (structural): the menu reads a whole line, the CLI reads argv already split on whitespace,` was **removed and re-added** with the `·` separator reflowed onto it from the preceding line. The clause's *words* are byte-identical (verified whitespace-normalised, HEAD vs worktree); the *line* is not, so `git diff` shows a removal inside protected text. ⭐ `worklog.md`'s own Proof cell is more accurate than the shipped record — it says *"only the `·` separator reflowed"*. In a sweep whose whole subject is records that overstate, the record should carry the caveat the worklog carries. |
| R8 | 1 | low | `claude/skills/fkit-task-brief/SKILL.md:343`, the added clause *"`candidate file="…" identity="unresolved"` line the briefing must report"* | Stronger than the tool's own contract supports: `claude/skills/fkit-status/SKILL.md` mandates listing every `candidate` line **only** under `active none` (*"there is no eligible sprint plan. Say so, list every `candidate` line with its identity or `unresolved`, and stop"*); with an active sprint resolved it merely defines what the line means. ⭐ **Frontier-move, not a defect of this work** — the wording is **verbatim from `0276`'s own brief** as a required element, and honouring it is exactly what this task's central constraint demands. Recorded so a later sweep does not re-file the same sentence as a fresh defect. |
| R9 | 2 | medium | ADR-003's dated `0281` note, *"**What landed**"* item 1 — *"`bin/release.mjs` runs `npm test` **before every release** and **refuses to release a red tree**; **there is no warn-and-continue path**"* | **Two false absolutes in one newly-written sentence**, and the line is the sweep's own addition (verified: absent from ADR-003 at `351bea3`, added in `cf289c2`). ⛔ **(a)** `bin/release.mjs` sets `const doTest = !has("--no-test")`; its own help reads *"`--no-test` Skip the test gate — **SHIPS AN UNVERIFIED TREE**"*, so the suite does **not** run before *every* release. ⛔ **(b)** There **is** a warn-and-continue path: under `--no-test` the script's `else` branch prints *"⚠ --no-test: releasing WITHOUT running the suite. ⚠ The tree about to ship is UNVERIFIED"* and proceeds. ⭐ **`0281`'s own brief names this exact failure mode: *"A correction that overstates is a worse defect than the stale claim it replaces"*.** Raised by Codex (which reported only (a)); **(b) is mine**, found while verifying it. |
| R10 | 2 | medium | ADR-037 §5's dated `0205` note, the clauses defining the proxy — *"the spawn prompt **contains the bytes** of the file at path P whose git blob id is H"* and *"**That proxy is mechanically checked today**, driver-side"* | The proxy as **defined** is not always checked. `claude/carry-check-hook.mjs` sets `const declared = /by reference only\|pointer[- ]only/i.test(outsideThePaste)` and then gates the byte test as `if (!declared && !containsExactBytes(prompt, bytes))` — so for a **driver-declared pointer-only spawn the byte-containment half is deliberately skipped** and only the hash is compared; the hook's own comment says *"A declared pointer-only spawn with a matching hash is ALLOWED here"*. ⭐ **The note enumerates *"Four limits, each of them the hook's own statement about itself. Present tense without these overstates"* — and this fifth one, which falsifies its own definition of the proxy, is not among them.** ⚠️ `0205`'s brief makes this wording *"the single most important constraint on the task"*. Raised by Codex only; ⛔ **my round-1 pass read the hook's header comments and missed the `declared` branch entirely** — this is the model-diversity dividend. |
| R11 | 2 | low | `0327`'s `review.md § Corrections (record repair — task 0335)` → Subject A, note **A4**, the bullet beginning *"**Confirmed recorded, not re-litigated:**"* | **A4 carries no byte-identity statement of its own**, though `0335`'s brief requires *"**Every note states** that the corrected text is left byte-identical"*. Measured across the current tree: B1, B2 and B3 each now carry one (the R6 fix landed), and the notes in `0327`'s `plan.md` and `worklog.md` carry theirs — **A4 is the only one still relying solely on the section preamble**. ⛔ **My round-1 R6 asserted *"A1–A4 and B4 are complete"* — that was WRONG, and Codex caught my error.** Recorded against myself: R6's fix was scoped to the three notes I named, so A4 was never in its scope. Raised by Codex only. |
| R12 | 2 | low | `0327`'s `review.md § Corrections (record repair — task 0335)` → Subject B, the preamble *"**All four subject-B notes below are owner-ruled in scope**"* | False internal inventory. Only **three** subject-B notes appear below it in this ledger — **B1**, **B2**, **B3**. ⭐ I located the fourth: it is in `0327`'s **`worklog.md`**, under the heading *"Two refinements this round adds"*, reading *"⚠️ **Dated correction 2026-09-04 (`0335`, inside sweep `0357`) — the agents shape does NOT trip the hard fail-safe…**"* — so the note exists and is lawful; only the word ***below*** is wrong, because that note is in a different file. ⚠️ It carries no `B4` label anywhere, so Codex's own "B4 is in the worklog" pointer was a guess that happens to be right. Raised by Codex only. |
| R13 | 2 | low | `0327`'s `review.md § Corrections (record repair — task 0335)` → Subject B, the clause *"The launcher proceeds and the session **starts with zero readable fkit agent files** — then dies on Claude Code's own *"agent not found"*"* | **PARTIALLY CORRECT — I am downgrading Codex's `medium`, and saying why.** Codex called the clause unsupported because the paragraph directly beneath it says *"the launcher was **never executed** and the guard expression was evaluated in isolation"* — and Codex is right that **that measurement cannot reach a session start or a downstream Claude Code failure.** ⛔ But the claim is not unsupported: the same ledger establishes it independently under `## Reviewer findings` — *"a fresh project with a symlinked `.claude` fails at session start with Claude Code's own *"agent not found"*"*, marked **"confirmed on the code"**, with the mechanism (the `setup_ok = 0` gate, init still exiting 0). ⭐ **So the residue is attribution, not truth:** the note presents a code-confirmed consequence in the same breath as a fixture measurement that explicitly excludes it, and points at neither basis. Raised by Codex only. |

### ✅ Verified clean by my own pass — recorded so these are not re-checked next round

Independently reproduced, not accepted from the worklog:

- **CI re-measurement (`0281`, `0312`).** `gh run list --limit 300` → **33 runs, 29 success, 4 failure, all `push` to `main`**. Matches the landed text clause for clause. The brief's stale 16/15/1 was correctly not used.
- **The dashboard "before" run the coder skipped, and its substituted argument.** I ran the missing before-run against a pristine `git archive HEAD` extract. Both boards: **zero `drift` lines before and after**; `backlog.md`'s roll-up is identical (`total 204 · done 27 · backlog 128 · cancelled 2 · moved 47`); `sprint-7.md`'s only delta is the driver's own status flip. ⭐ **The argument holds** — no live board was written by the sweep.
- **The added-lines coordinate screen.** Reproduced: **0 hits** over the whole scoped diff on the deliberately over-broad `token:digits` pattern.
- **Link churn.** Reproduced number-for-number: **69 markdown links across 19 holding files** into the eighteen closing folders, and the per-member breakdown matches on all eighteen.
- **Both guards.** Citation guard: `total 166 = exempt 166 + residual 0` ✓ (`total` counts hits, not files, so appends inside exempt closed folders raise it — **not drift**). Link guard: `854 files, 3262 targets, 0 broken, 6 named-exempt` ✓, exemption set still exactly six.
- **`0299`'s count fence held at all three sites.** Verified whitespace-normalised, HEAD vs worktree: *"exactly **one** `sprint-*.md`"* (sprint-4), *"exactly one `sprint-*.md`"* (sprint-5), *"exactly one `sprint-*.md` (this board)"* (sprint-4) all survive verbatim; only the mechanism half changed, each with a dated ADR-041 aside stating *"The count above is left unchanged."* ⚠️ **My first check read site 3 as absent — that was my own regex false negative, the same trap that nearly cancelled `0312`.**
- **The NUL member.** NUL count 1 → 0, size 20966 → 20967, `numstat 1 1`, no other line changed, **no correction note appended** (correct), and a repo-wide re-scan of every `.md` under `ai-agents/` finds **zero** remaining NUL bytes.
- **The manifest is genuine generator output, not hand-edited** (ruling L3): re-running `npm run generate:manifest` reproduces `claude/structure-manifest.tsv` byte-identically.
- **Scope proofs.** No task folder moved (no rename in `git status`); **no** `## Status` / `## Sprint` / `## Priority` / `## ID` / `## Owner` line changed on any absorbed brief; **zero** files modified under `ai-agents/wiki-vault/`.
- **Ruling L1's factual basis.** `0201` and `0192` are both still open under `ai-agents/tasks/backlog/`.
- **ADR statuses untouched.** ADR-003 `superseded`; ADR-010/020/032/037/038/041 all `accepted`.
- **`- **Corrections:**` bullets.** Added to ADR-003, ADR-032, ADR-037, ADR-038 and ADR-041 only. ⛔ **None added to `0238`'s closed brief** (`0318` forbids it) and none to ADR-010, where `0196` sanctions the exception but the coder took a continuation line under the existing bullet instead — a pure append, and its own worklog says so.
- **`0351` is comment-only.** All 6 removed and all 15 added lines in `test/prove-red.sh` begin with `#`; step `0i` and mutation 23 left byte-identical; `prove-red.sh` still 28/28.
- **`0170`'s third `byte-unchanged` hit** in `fkit-sprint-ship-loop/SKILL.md` is about `fkit-process-stateful-review` — a different subject — and is correctly left.

### Disproven — do not chase these

- **"The sweep added new banned-form coordinates into `ai-agents/sprints/done/`."** The citation guard's informational line 4 reports *"+6 residual across 2 files (the brief records +4; the cost has grown)"*. Measured HEAD vs worktree: the set of `ai-agents/…:NNN` coordinates under `sprints/done` and `sprints/reviews` is **identical before and after**. The growth predates this sweep.
- **"`0279`'s gloss is missing its date, claim and authority."** `0279`'s deliverable is a **gloss**, not a dated correction note — its `## What to build` is a four-step gloss and none of its six verification steps asks for a date. No defect.
- **"`0348`'s empty-diff fence is violated."** `0327`'s ledger is `+144 / −0` at sweep end because `0335` wrote into it lawfully afterwards. Ruling **L2** sequenced them and the proof is a per-member snapshot. Correctly reported as such.

### Re-litigates settled decisions (suppressed — NOT findings)

- **`architecture.md` §9.1 occurrence B left uncorrected, and the file therefore self-contradicting.** Owner-narrowed OUT, ruled 2026-09-04, option label verbatim **"File B as a follow-up (Rec)"**. ⛔ **Not a defect and not the coder's judgment.** ⚠️ **R1 above is a different object** — it is about the *close disposition* and the *unfiled follow-up*, not about the narrowing.
- **ADR-003's append-only form.** Ruled 2026-09-04, option label verbatim **"Append only — keep the precedent closed (Rec)"**; the hybrid in-place form was refused by name. ⛔ Not recommended here.
- **`0351`'s third site left untouched.** Ruling **L5**, option label verbatim **"Two ruled sites only; report the third (Rec)"**. ⛔ Not a miss.
- **`0201` out and still open.** Ruling **L1**. ⛔ Not an omission.
- **The vault re-ingest owed for the seven annotated ADRs.** Folded into Sweep C, ruled 2026-09-04, option label verbatim **"Fold into Sweep C (Rec)"**. ⛔ Not this sweep's gap.
- **`claude/structure-manifest.tsv` appearing in the diff.** Ruling **L3**. ⛔ Expected; verified as generator output.

## Coder response

<!-- CODER-OWNED (ADR-038). The reviewer never writes here. -->

**Round 1 dispositioned 2026-09-04.** Every finding was **re-verified against the artifact myself** and
its severity **derived from the blast radius I traced**, never inherited. ⛔ **Two of the reviewer's own
measurements were corrected in my favour and against it** — see R6 and R8.

⛔ **THIS SECTION DOES NOT CLOSE THE REVIEW.** Coverage for round 1 is **`Codex unavailable`** — ADR-042
D1's one genuinely degraded state. There was **no second opinion**: the model that reviewed this work is
the same model family that produced it, on a sweep where the suite proves almost nothing about the
content. Owner ruling **N4**, verbatim *"Re-run Codex after the reset, then close (Rec)"*, keeps this
ledger open pending that pass.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (close disposition — documentary) | Re-verified: all three §9.1 clauses **PRESENT** (whitespace-normalised); **no** occurrence-B brief exists; my hand-off asked for none. Per owner ruling **N1**, `0312` **stays `Done`** (its ruled scope was occurrence A, which landed) and the hand-off now carries an explicit **⛔ PRODUCER FOLLOW-UP** block requiring the producer to file occurrence B **in the same act as the closes**, with scope and the `0251` conflict named. | `✅ done` |
| R2 | **CORRECT** | Defect (own record) | Measured `git diff --numstat` on the skill: **`5  3`**, not the `+6 / −4` my cell claimed. Cell corrected to **`+5 / −3`**. ⭐ I also re-measured **every other Diff cell** in that table against `numstat`; all others match. The repair itself was always correct — only the proof cell was wrong. | `✅ done` |
| R3 | **CORRECT** | Defect (own record) | Confirmed: my two `0279` rows sit in the **Step 1 membership** and **Step 2 claim** tables; the **Step 5 proof table had none**. Added `0279`'s row with measured proofs (`+3 / −0`, `+3 / −0`, `+1 / −0`), the twin-edit evidence, the untouched-paths proof and the manifest re-run. | `✅ done` |
| R4 | **CORRECT** | Defect (unrecorded departure) — the byte-copy itself is an intended tradeoff | Confirmed the conflict is real: ruling **L3** says *"never byte-copied"*; `0279`'s brief requires *"the textually identical gloss"*. Per owner ruling **N2**, **the member brief wins and the act stands**; the defect was that the departure was recorded nowhere. Recorded now as a full ***Accepted residual*** below (What / Why / Re-raise only if). | `✅ done` |
| R5 | **CORRECT** | Defect (a member's named verification step unmet) | Confirmed: zero occurrences of *"never guesses"* in my worklog; the sentence still present in ADR-041. Per owner ruling **N3** the step asks for a **recorded verdict**, not further repair. Verdict **derived by measurement** (two fresh fixture runs, both scenarios) and recorded in the worklog: **CORRECT AS-IS, no annotation warranted** — the sentence's subject is *the tool*, which does emit the `candidate … identity="unresolved"` line on every run, and it never names the board-mode drift channel `0276` corrects. | `✅ done` |
| R6 | **CORRECT — and worse than reported** | Defect (member-scope shortfall in shipped notes) | ⚠️ **The reviewer's own measurement was slightly wrong in my disfavour's opposite direction and I am correcting it against myself:** it recorded *"B3 carries a date"*. Measured: **B3 carried neither a date nor a byte-identity statement**; B1 had byte-identity only; B2 had neither. `0335` requires them **per note**. All three now carry both, stated in their own text rather than only in the section preamble. `review.md` still **`+144 / −0`** and all three party sections still **byte-identical**. | `✅ done` |
| R7 | **CORRECT** | Defect (a shipped record overstating about itself — this sweep's own subject) | Confirmed from the diff: the line carrying the Why clause **was removed and re-added**, the `·` separator having reflowed onto it. The clause's **words** are byte-identical (re-verified normalised, HEAD vs worktree); the **line** is not. The note now carries that qualification explicitly instead of the bare *"UNTOUCHED and byte-identical"*. | `✅ done` |
| R8 | **CORRECT** | ⭐ **Frontier-move — not a defect of this work** | Independently confirmed the contract: `fkit-status/SKILL.md` mandates listing every `candidate` line **only** under `active none`; the `candidate` bullet otherwise merely *defines* the line, and the *"your job is to report it"* mandate belongs to the **ambiguous-active-sprint** drift line, a different object. So *"the briefing must report"* is stronger than the contract for the active-sprint case. ⛔ **Not changed:** the wording is **verbatim from `0276`'s own brief** as a required element, and rewriting it would relax an absorbed member's scope — the one thing this sweep must not do. Recorded as an ***Accepted residual*** below. | `won't fix (frontier)` |

| R9 | **CORRECT** | Defect (two false absolutes I authored) | ⭐ **The sharpest finding in either round, and it is mine.** Verified both halves myself against `bin/release.mjs`: `const doTest = !has("--no-test")`, the help reads *"Skip the test gate — **SHIPS AN UNVERIFIED TREE**"*, and the `else` branch prints *"releasing WITHOUT running the suite … the tree about to ship is UNVERIFIED"* and **proceeds**. Confirmed the line is the sweep's own addition — **absent from ADR-003 at `351bea3`**. Item 1 rewritten: the gate runs **by default** and aborts on red; `--no-test` skips it entirely, warns loudly and continues, and is never a default. ⛔ Both false absolutes are gone (checked whitespace-normalised) and **zero pre-sweep lines of ADR-003 are missing**. | `✅ done` |
| R10 | **CORRECT** | Defect (an ADR note overstating what a hook checks) | Verified myself in `claude/carry-check-hook.mjs`: `const declared = /by reference only\|pointer[- ]only/i.test(outsideThePaste)` gates the byte test as `if (!declared && !containsExactBytes(...))`, and the hook's own comment reads *"A declared pointer-only spawn with a matching hash is ALLOWED here … This hook does not enforce (b)."* So on that path **only the hash is compared**. The note now lists **Five limits**, the new one naming exactly this, and the proxy's definition is qualified at the point of definition. ⛔ **My round-1 pass read the hook's header and missed the `declared` branch** — this is the model-diversity dividend, and I record it as my miss. | `✅ done` |
| R11 | **CORRECT** | Defect (member-scope shortfall) | Verified: **A4 carried a date but no byte-identity statement**; every other note in that folder now carries both. ⛔ **This corrects my own round-1 R6 disposition, in which I accepted the reviewer's claim that *"A1–A4 and B4 are complete"* without checking it** — precisely the inheriting Step 3 forbids. A4 now carries its own statement. | `✅ done` |
| R12 | **CORRECT** | Defect (false internal inventory) | Verified: the preamble said *"All four subject-B notes **below**"*, and only **B1, B2, B3** are below; there is no `B4` label anywhere. Located the fourth myself — in `0327`'s **`worklog.md`** under *"Two refinements this round adds"*, carrying its own date and byte-identity. ⚠️ **My plain grep for it returned zero: the phrase wraps a line break — the THIRD instance of that trap in this task.** Preamble corrected to say three are below and where the fourth lives. | `✅ done` |
| R13 | **PARTIALLY CORRECT** | Defect (attribution, not truth) | I **agree with the reviewer's downgrade from Codex's `medium`** and derived `low` myself. Verified both halves: the session-start clause does sit directly above a fixture measurement stating *"the launcher was **never executed**"*, which cannot reach a session start — **and** the claim is independently established in the same ledger's `## Reviewer findings`, marked *"confirmed on the code"*. ⭐ **So the residue is attribution, not truth.** Added an explicit attribution paragraph: the fixture proves the **guard is skipped**; the session start and *"agent not found"* rest on the code-confirmed finding; ⛔ neither basis is asserted by the other. | `✅ done` |

**Round 2 dispositioned 2026-09-04 (R9–R13).** Coverage this round is **`reasoning-only second
opinion`** — ADR-042's **normal** state, ⛔ **not** a degradation. ⭐ **The owner's ruling to wait for
the Codex pass was vindicated on the evidence:** it produced five findings round 1 missed, **two of
them substantive false claims inside notes this sweep itself shipped** (R9, R10), and **one that
corrects my own round-1 disposition** (R11). ⚠️ **Codex measured nothing** — all its commands were
reads — so every execution claim in this ledger remains the Claude reviewer's or mine.

⛔ **Three of the five are defects I authored, and two of those are exactly the failure `0281`'s brief
named in advance: *"A correction that overstates is a worse defect than the stale claim it
replaces."* I wrote overstatements into two ADR correction notes in a sweep built to remove
overstatements. ⛔ Nothing in the suite could catch either.**

**Regression / oscillation check (Step 3.5), round 2.** ⛔ **No oscillation:** R9–R13 are all novel and
none re-litigates a prior disposition. ⚠️ **One regression-adjacent fact, recorded against myself:**
R11 exists because my round-1 R6 **inherited** the reviewer's completeness claim about A1–A4 instead
of verifying it. The finding is new; the lapse that let it survive is mine.

**Regression / oscillation check (Step 3.5), round 1.** Round 1 was the only round then, so no finding re-litigated a
prior disposition and no oscillation is possible. ⛔ **No finding was suppressed as settled** — the
reviewer's own *Re-litigates settled decisions* list was checked and I agree with all six entries.
⚠️ **ADR-034 was skimmed and is genuinely in scope:** it directs that own-record defects be *recorded as
residuals rather than drive another round*. R2 and R3 are own-record. ⭐ **I fixed them rather than
residual-ising them** — ADR-034 bars a *loop* over own-record trivia, not a one-edit correction of a
demonstrably false number while the file is already open. Recording a known-false proof cell as a
residual, in a sweep whose entire subject is records that overstate, would have been the wrong call.

**Coverage of these fixes, stated plainly.** `npm test` and both guards were re-run after them and are
green — ⛔ **and that proves almost nothing about R1 and R4–R8**, which are wording, disposition and
record-accuracy findings no test reads. **R2, R3, R6 and R7 were each verified by a command whose output
is recorded in the worklog.**

## Accepted residuals (shared, do-not-re-litigate)

- **`0279`'s two convention homes are byte-identical, departing from ruling L3 (R4)** *(owner ruling
  **N2**, 2026-09-04, verbatim option label "Record as accepted residual: the member brief wins (Rec)")*
  — **What:** the gloss added to `ai-agents/knowledge-base/conventions/status-report-format.md` and to
  its `claude/scaffold/` twin is **byte-identical**, while the approved plan's ruling **L3** says the
  homes are *"glossed separately and adapted, never byte-copied"*. · **Why (structural):** `0279`'s own
  brief requires the opposite in terms — *"The gloss should therefore land **textually identical** in
  both — this file's parity exception is about its *header framing*, not this table"* — and *"Add the
  **textually identical** gloss to the scaffold copy."* The surrounding table text is identical in both
  homes, so there is no audience difference for the gloss to adapt to, and inventing one would make the
  two homes disagree about what `N` means. **The member brief wins**, per the sweep's own constraint that
  a sweep never relaxes an absorbed member's scope. L3's operative instruction — *edit both homes and
  regenerate the manifest* — was followed exactly; only its *"never byte-copied"* clause is departed
  from, and the twin edit was made deliberately in each home and **checked by hand**, because the
  dual-home parity test **skips this path** (`kind: 'audience-adapted'`), so nothing else verifies it.
  · **Re-raise only if:** the two homes' surrounding table text ever genuinely diverges by audience, at
  which point the gloss should be adapted per home rather than copied; **or** the parity exception for
  this file is removed, making the automated comparison live again.

- **`fkit-task-brief/SKILL.md` says the briefing "must report" the `candidate … identity="unresolved"`
  line (R8)** — **What:** the clause added under `0276` states the stray board *"shows up on **every**
  status run as a `candidate file="…" identity="unresolved"` line **the briefing must report**"*.
  Measured, `claude/skills/fkit-status/SKILL.md` mandates listing every `candidate` line **only** under
  `active none`; with an active sprint resolved, the `candidate` bullet merely defines what the line
  means. So *"must report"* is stronger than the contract for that branch. ⭐ **The tool half is true** —
  the line is emitted on every run, verified in both scenarios. · **Why (structural):** the wording is
  **verbatim from `0276`'s brief**, which lists it as a required element of the corrected statement.
  Rewriting it would relax an absorbed member's scope — the single thing this sweep is built not to do —
  and the sentence's conclusion (*"neither case is a licence to write one"*) is unaffected either way.
  ⛔ **Recorded so a later sweep does not re-file the same sentence as a fresh defect.**
  · **Re-raise only if:** `fkit-status/SKILL.md`'s reporting contract is widened to mandate candidate
  lines under an active sprint (which would make the clause simply true); **or** a reader is shown to
  have acted on the clause and expected a briefing that never came.
