# Review — 0157

Task: `ai-agents/tasks/backlog/0157-state-task-brief-step-5s-append-rule-in-full/brief.md`
File(s) under review: `claude/skills/fkit-task-brief/SKILL.md` (+34/−3), `ai-agents/tasks/backlog/0157-state-task-brief-step-5s-append-rule-in-full/worklog.md` (new)
Status: in-review

**Round 2 verdict: ✅ Converged — R1/R2/R3/R5 fixed and independently re-verified, R4 accepted. 2 new findings, both low, neither blocking. Recommend closeout, not a round 3. Codex coverage: FULL** (`codex-cli 0.145.0`, `gpt-5.6-sol`, read-only, exit 0 — run again this round, not carried over).

**Round 1 verdict: ⚠️ Changes requested — 5 defects (none blocking). Codex coverage: FULL** (`codex-cli 0.145.0`, `gpt-5.6-sol`, read-only, exit 0).

**The finding that would have mattered most is disproven.** Nothing was weakened. Joined-line check
(the wrapped `**Do not renumber or` / `insert into…` phrase) against `HEAD` and the working tree:
the append default and **all three** renumber prohibitions are present **byte-identical** in both —
`SKILL.md:137`, `:330`, `:369`. The two added cross-references qualify none of them.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-task-brief/SKILL.md:154` | "re-rankable region" dropped the qualifier **contiguous** that the coder's own cited authority carries (`ai-agents/sprints/sprint-2.md:279`). On the **live board** "the highest open row" = P124, and promoting there requires renumbering the `✅ Done` P125/P126 — the action the same bullet forbids. |
| R2 | 1 | medium | `claude/skills/fkit-task-brief/SKILL.md:137`, `:155` | "highest" means the **largest** rank number in bullet 1 and the **smallest** (topmost) open rank in bullet 4, 18 lines apart, with nothing in step 5 stating the board's numbering direction. A context-free reader answered "NOT DETERMINED BY THE TEXT with certainty". |
| R3 | 1 | low | `claude/skills/fkit-task-brief/SKILL.md:139` | The sentence mandates "state where merit would have placed it and why", then says "Use the form…" and quotes a template (`:142`) containing **neither** the merit position nor the why. A producer obeying "use the form" literally emits only the flag. |
| R4 | 1 | low | `claude/skills/fkit-task-brief/SKILL.md:156` | The citation ban shipped **unscoped** — the brief scoped it to *"a brief's **reasoning prose**"* (`brief.md:155-156`). Read literally, "never cite its board rank" forbids the rank-bearing template the same step mandates 14 lines earlier at `:142`. |
| R5 | 1 | low | `ai-agents/tasks/backlog/0157-state-task-brief-step-5s-append-rule-in-full/worklog.md:103` | The worklog records V1–V9 as PASS but is **not independently re-runnable**: it omits the ten final V1 patterns, the V2 command, V3's four questions and answers, and the V5/V6 commands. With **no `plan.md` on disk**, that recipe exists only in the driver's session context, which does not persist. |
| R6 | 2 | low | `claude/skills/fkit-task-brief/SKILL.md:161` | *"the top of the **contiguous** run of open rows immediately above that row"* — "immediately above that row" has two grammatical attachments; the one-step reading yields P129 for a P130 promotion instead of P127. **Ambiguous in isolation, resolved in context** — the two sentences either side settle it, and two independent context-free readers both derived the multi-row answer. |
| R7 | 2 | info | `ai-agents/tasks/backlog/0157-state-task-brief-step-5s-append-rule-in-full/worklog.md` §9 | Stale count in the R4 write-up (and its copy in *Coder response*): *"fourteen lines earlier"* was correct in round 1 (`:142`→`:156`); the template now sits at `:143-145` and the rule at `:164`, i.e. **twenty-one** lines. The line citation was updated, the word-count was not. |

### Detail

**R1 — the live-board case.** `sprint-2.md:155-159` reads P123 `✅ Done`, P124 `🔲 Backlog`,
P125 `✅ Done`, P126 `✅ Done`, P127 `🔲 Backlog`. The open region is **not contiguous**. The board's
own rule statement handles this exactly — *"the top of the **contiguous** open region is P127"*
(`sprint-2.md:279`) — and that statement is the authority the coder cited for widening the carve-out
to three statuses. The paraphrase at `SKILL.md:154-155` lost the qualifier. Bounded by the same
bullet's leading prohibition, which a careful reader hits first — hence medium, not high.

**R2 — raised by both reviewers, and by a third.** Codex rated it high. I rate it medium: bullet 1
self-corrects through the word "append" and the insert prohibition beside it (a fresh reader given
only the 29-line extract correctly returned P145 for a P100–P144 board). The unresolved half is
bullet 4, where no cue disambiguates — and an owner-ruled re-rank is precisely when ranks move.

**R5 — what mitigates it.** The worklog's *claims* all reproduce; only the *recipe* is missing.
I independently reconstructed and re-ran the equivalent of V1 (my own 12 patterns — 12/12 absent at
baseline, 12/12 present after), V2 (4/4 joined-line, both trees), V3 (fresh subagent, my own four
questions), V4, V6, V7 (`node --test test/*.test.js` → **523 pass, 0 fail**) and V9. Nothing the
worklog asserts was found false.

### Checked and found NOT defective — recorded so they are not re-chased

- **No prohibition weakened.** Joined-line, `HEAD` vs working tree, all four phrases count 1 in both.
- **Link resolves.** `../../../ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`
  resolves from `claude/skills/fkit-task-brief/` **and** from the gitignored `.claude/skills/fkit-task-brief/`
  copy (same depth). Matches the convention used at `SKILL.md:88`, `:300`, `:313`, `:315`, `:361`, `:374`.
- **No size guard applies.** `test/rules-block-budget.test.js:30` sets `SOURCE` to
  `claude/scaffold/universal-rules.md` only. Verified.
- **Change surface clean.** Only `SKILL.md` + the new `worklog.md`. `sprint-2.md`'s rank sequence vs
  `HEAD` differs by a **pure append** of `| P145 |` (the driver's 0167 filing) — no renumber, no task moved.
- **Dual-home a non-event.** `find claude/scaffold -name SKILL.md` → 0; the two
  `priority-is-rank-not-identity.md` copies are identical.
- **Three-status carve-out stated consistently.** `SKILL.md:153` and `:330` both list all three;
  `:369` cross-refs without listing — no contradiction.
- **The "in this session" loophole is closed.** `SKILL.md:145-147` names spawn-prompt instructions and
  addendum precedent explicitly. A context-free reader, told only that its instructions came from
  another automated agent claiming owner approval, correctly refused and cited that sentence.
- **Unenforced prose stated loudly enough.** `worklog.md:89-97` carries it under its own ⚠️ heading
  with the evidence (every `test/` reference to this skill is a comment or a name-matrix entry).

### Round 2 — what was re-verified independently, not credited

- **Nothing weakened, third tree.** Joined-line on the fixed tree: all four load-bearing phrases
  count 1 (`SKILL.md:137`, `:338`, `:377`). Confirms the coder's 3-tree claim on the tree that matters.
- **D2 checked on a baseline I rebuilt myself.** Rather than credit the coder's second baseline, I
  reconstructed the post-round-1 pre-fix file by replaying the round-1 diff onto `HEAD` (375 lines,
  matching), then ran **my own 10 patterns** for the round-2 text against three trees:
  **0/0/1** — absent from `HEAD`, absent from the pre-fix copy, present in the fixed file. The
  defective round-1 sentence (*"the highest **open** row, not `P1`"*) is present **only** in the
  pre-fix tree. The fix patterns genuinely do not match the wording they replaced.
- **Fresh reader, my own five questions, a harder board than the coder's.** I put an open row
  (`P119`) *above* a `⛔ Cancelled` wall to punish exactly the R1 failure. The reader derived
  **P122**, passed the two-row run, and named `P119` out of reach citing the wall sentence — and
  independently confirmed R2 fixed (Q5) and R4's residual non-live (Q4).
- **The 8 added lines earn their place.** Named concretely: delete the direction sentence and R2
  returns (the reader states bullet 1 is ambiguous without the clarifying clause); delete
  *contiguous* / the wall sentence and R1 returns (those are the two sentences the reader used to
  derive the answer and to strand `P119`).
- **Citation sweep, the class the coder demonstrated it can produce.** All checked and **correct**:
  `sprint-2.md:278` (three-status), `:279` ("contiguous"), `SKILL.md:164` (the R4 rule),
  `SKILL.md:156-163` / `:157-159` / `:141-145` (the three fix sites), `0164/brief.md:169` (the
  *"On merit this belongs immediately below `0163`"* specimen), and `0118`'s folder (`brief.md` +
  `review.md`, no worklog). **One stale item found** — R7 above.
- **Precision note on "no `plan.md` on disk"** (my phrasing in R5, carried into `worklog.md` §10):
  true for **0157's folder**, but `/usr/bin/find ai-agents/tasks -name plan.md` returns **35**
  repo-wide. The claim is scope-correct and stated unqualified. Mine to own, not the coder's.

**Convergence signal — recorded rather than acted on.** Bullet 4 is now its third version, and R1,
R2 and R6 have all lived in it. The residue is shrinking (medium → medium → low) and the *behaviour*
is verified correct by two independent readers on two different boards. R6 is a wording nit, not a
recurrence of R1 or R2 — both of those fixes are present and demonstrably load-bearing. **A fourth
rewrite of this sentence buys less than it risks.**

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

**Round 1 response, 2026-07-30. All five findings verified against the file before anything was
changed. Four fixed, one accepted. No finding was disputed — all five were correct as written.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | **Defect** | Restored **contiguous** and added the operative rule the paraphrase lost: **"A closed row is a wall, not a step"** — an open row above a closed one is out of reach, because reaching it would renumber the rows in between. Verified firsthand first: `sprint-2.md:155-159` is genuinely non-contiguous (P124 `🔲` between closed P123 and P125/P126), so the shipped wording computed to P124 and mandated the act the same bullet forbids. | **Fixed** `SKILL.md:156-163` (the whole bullet, rewritten) |
| R2 | **CORRECT** | **Defect** | Bullet 4 now states the numbering direction outright — *"Ranks count down the board: `P1` is the top, and a larger number sits lower"* — and resolves bullet 1 by name: *"the existing highest priority" means the **largest number on the board***. Agreed with the reviewer's downgrade from Codex's `high`: bullet 1 does self-correct via "append" + the adjacent insert ban; bullet 4 did not, and that is where a re-rank actually moves ranks. | **Fixed** `SKILL.md:157-159` |
| R3 | **CORRECT** | **Defect** | Template now carries both mandated parts, with *"**Both sentences are required — the flag alone does not satisfy this rule**"*. Second sentence uses the relative folder-ID form the live specimens already use (`0164`'s brief: *"On merit this belongs immediately below `0163`"*), so the fix conforms to bullet 5 rather than fighting it. | **Fixed** `SKILL.md:141-145` |
| R4 | **CORRECT** | **Frontier** | Not fixed — **accepted residual**, owner-ruled 2026-07-30. Scoping the citation ban precisely *is* the citation-form question, which **`0160`** owns as an open investigation; pre-empting it here would presume its ruling. No wrong action demonstrated: the context-free reader emitted the rank-bearing template without hesitation in **both** rounds. Recorded below with what / why / re-raise-only-if. | **Accepted** |
| R5 | **CORRECT** | **Defect** | The ten V1 patterns (now sixteen), the V2 / V3 / V5 / V6 / V7 / V9 commands, and V3's five questions with their required answers are now in `worklog.md` §10. Took the reviewer's argument in full: the plan lives in the driver's session and dies with it, there is **no `plan.md` on disk**, and `0118`'s folder — `brief.md` and `review.md`, **no worklog** — is the standing proof of the cost. | **Fixed** `worklog.md` §10 |

**Round-2 verification, run after the fixes.** The driver predicted this round's defect would be *a fix
pattern that still matches the pre-fix wording, passing while testing nothing* — the shape caught one
round earlier. **It did not occur, and it was tested for rather than assumed:** a second baseline (the
post-round-1, pre-fix file) was captured and V1 run against **both**. D1 → 16/16 absent at the pre-task
baseline; **D2 → R0-01–10 present, R1/R2/R3-11–16 absent** at the pre-fix copy; fixed file → 16/16
present. V2 joined-line passes on all three trees (append default + all three prohibitions intact).
A **fresh** reader — no reuse of round 1's context — answered 5/5, deriving **P127** for the live
non-contiguous board with the wall reasoning unaided, and **P145** for the direction question.
`node --test test/*.test.js` → **523 pass, 0 fail**. Board untouched: rank sequence identical, closed
folders 132 → 132.

## Accepted residuals (shared, do-not-re-litigate)

- **Three-status closed-row carve-out** — What: the carve-out names `✅ Done`, `⛔ Cancelled` **and**
  `➡️ Moved`, where `brief.md:152` named two · Why (structural): the board's own rule statement
  (`sprint-2.md:278`) says three, and following the board over the brief where they disagree is
  correct; a `➡️ Moved` row is closed history by the same argument. Owner-ruled 2026-07-30 ·
  Re-raise only if: the board's rule statement changes, or the three sites state it inconsistently.
- **Step 5 length** — What: 3 bullets → 7, 8 lines → 29, beyond the brief's *"should not triple it"* ·
  Why (structural): the five required elements do not compress further without dropping one, and no
  size guard applies to this file (`rules-block-budget.test.js:30` governs
  `claude/scaffold/universal-rules.md` only). Owner-ruled 2026-07-30 · Re-raise only if: a budget test
  gains jurisdiction over `claude/skills/**/SKILL.md`.
- **Five brief defects recorded, not fixed** — What: the `## Scope`/`## Notes` P127-vs-P130
  contradiction and two stale `sprint-2.md:NNN` citations (0159's surface), a "Four edits" heading
  over five items, and the nonexistent `claude/universal-rules.md` path · Why (structural): repairing
  a brief from the task it briefs re-creates the two-owner problem the 0157/0159 split resolved.
  Owner-ruled 2026-07-30 · Re-raise only if: a defect is found to have changed what was built.
- **Unenforced prose** — What: nothing tests any `SKILL.md`'s content, so nothing detects a future
  re-weakening of step 5 · Why (structural): 0152 and 0154 are building the first two readers, and
  `0154`'s brief warns against a third claimant on that walk. Accepted per `brief.md:217-219` ·
  Re-raise only if: 0152/0154 land and step 5 is still unguarded.
- **R4 — the cite-by-folder-ID rule shipped unscoped** — What: `SKILL.md:164` says *"never cite its
  board rank"* with no scope, where `brief.md:155-156` scoped it to a brief's **reasoning prose**; read
  literally it also forbids the rank-bearing template the same step mandates fourteen lines earlier ·
  Why (structural): scoping it precisely **is** the citation-form question, and **`0160`** owns that as
  an open investigation — deciding it here would presume its ruling. No wrong action demonstrated: a
  context-free reader emitted the template without hesitation in both rounds, and the two acts are
  plainly different (stating your own row's rank vs. citing another task's). Owner-ruled 2026-07-30 ·
  Re-raise only if: a producer is observed omitting the rank from the template because of this clause,
  or `0160` rules a form that contradicts it.
