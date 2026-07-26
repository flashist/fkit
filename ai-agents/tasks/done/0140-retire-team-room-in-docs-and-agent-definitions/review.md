# Review — 0140-retire-team-room-in-docs-and-agent-definitions

Task: `ai-agents/tasks/done/0140-retire-team-room-in-docs-and-agent-definitions/brief.md`
File(s) under review: `claude/agents/fkit-lead.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`,
`claude/skills/fkit-team/SKILL.md`, `claude/fkit-claude.sh` (`:182-194`, `:479`),
`ai-agents/knowledge-base/architecture.md` (`:17`, `:105`),
`ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` +
`claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` (dual-home pair),
`claude/README.md`, `claude/scaffold/CLAUDE.md`, `README.md`, `CLAUDE.md`, `AGENTS.md`,
`test/launcher-contract.test.js`
Scope: working tree. Out of scope and NOT reviewed: the menu reorder itself (task 0139, closed),
`ai-agents/sprints/**`, `ai-agents/wiki-vault/` (0141), the 0132/0133 briefs, task folders 0141–0143.
Status: closed-out

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | `claude/fkit-claude.sh:183` | The new ⚠️ comment asserts "task 0140 retired the name project-wide" — false; the same task deliberately left "team room" standing in ADR-010 (×3), ADR-012:61, ADR-031:7, three dated reports and two wiki-vault pages. A newly-introduced false claim in shipped code, in a task whose stated discipline is "rename, never change a claim". |
| R2 | 1 | low | `claude/skills/fkit-team/SKILL.md:20` | Relabeling the row `**lead** (the team room)` → `**lead** (the conductor)` imports a capability claim the same row denies: its *Does* cell still reads only "routes you to a role; reads the wiki", and `:51` of the same file says "it routes, and **conducts** when asked". The old place-name asserted nothing; the new one does, so the rename makes the row self-contradictory. |
| R3 | 1 | low | `README.md:45`, `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md:19`, `claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md:19` | The rename produced degenerate self-referential cells — `\| **fkit-lead** \| the lead — …` and `\| fkit-lead \| The lead — …`. The description cell now restates its own key and carries no information, unlike all six sibling rows. (Separate, deferred: the trailing "does no work itself" / "does not itself do the work" is false since ADR-031 — see Accepted residuals candidate below.) |
| R4 | 1 | low | `claude/fkit-claude.sh:479` | `1\|lead)` pads `role=` to column 31 while all six sibling arms align it at column 30. Cosmetic only — no behavioral effect — but `worklog.md:56` asserts the arm was "re-padded to the column the other arms use", and it was not. |

**Round 2 — no new findings.** The round-2 pass was a delta verification of the four fixes, not a
fresh two-reviewer review (owner dispositions were already in hand). The `file:line` refs in the R1
and R4 rows above are the round-1 line numbers and are deliberately left as written — R1's fix added
two lines, so the menu arms now sit at `:481-487`.

**Reviewer's verification of the delta** (run independently; the coder's report was not taken on trust):

- **R1 — fixed, verified.** `claude/fkit-claude.sh:182-185`. The "project-wide" overclaim is gone and
  the surviving-by-design sites are named in the comment. Re-swept: outside task folders, sprints,
  ADRs, dated reports and `wiki-vault/`, the **only** remaining "team room" in the repo is this
  comment itself, which names the words in order to reject them. The operative claim — "`lead` is the
  only word this program accepts on any path" — is exactly scoped and true.
- **R2 — fixed, verified.** `claude/skills/fkit-team/SKILL.md:20` now reads "routes you to a role;
  drives the work when you hand it a goal; reads the wiki", consistent with `:51` and ADR-031. The
  *Must not* cell ("plan, code, design, review, or write the wiki") remains correct — the lead
  delegates those to spawned roles rather than performing them.
- **R3 — fixed, verified, both halves and both homes.** `README.md:45` and both copies of
  `task-owner-vocabulary.md:19` no longer restate their own key, and the stale ADR-031 claim is
  corrected. **Dual-home parity independently re-checked** (this is the pair the task could most
  easily get wrong): `diff` clean **and** md5 identical — `3be7cf3af05d410a91d49189cce74af0` on both.
- **R4 — fixed, verified by measurement, not by eye.** All seven menu arms now report `role=` at
  column 30 (`awk 'index($0,"role=")'` over `:481-487`).
- **Suite re-run after the four fixes:** `npm test` → 521 tests / 521 pass / 0 fail / 17 suites;
  `prove-red.sh` → `✓ hard gate PASSED`; `bash -n` and `sh -n` on the launcher both clean. Reproduces
  the coder's report exactly.
- **One residual imprecision, judged not worth a finding.** R1's replacement says the label was
  retired "from the launcher and the live docs"; five `ai-agents/wiki-vault/` pages still carry it,
  and the comment's parenthetical names only ADRs and dated reports. The vault is a derived surface
  owned exclusively by the wiki role with task **0141** already filed against it, and the comment's
  operative claim is about what the program accepts. Recording the observation rather than a row —
  re-raising a one-word imprecision in a fix I asked for would be re-litigation.

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect — a false claim this task introduced | Comment rewritten: 0140 retired the label "from the launcher and the live docs", and the surviving-by-design sites (accepted ADRs, dated reports) are now named in the comment itself | **fixed** |
| R2 | **CORRECT** | Defect (the rename imported a claim) | **Owner ruled: complete the *Does* cell** — now "routes you to a role; drives the work when you hand it a goal; reads the wiki", consistent with `:51` and ADR-031 | **fixed (owner-sanctioned claim change)** |
| R3 | **CORRECT**, both halves | Defect (degenerate wording) + Frontier (the stale ADR-031 claim) | **Owner ruled: fix both, here** — a sanctioned scope addition. `README.md:45` and **both homes** of `task-owner-vocabulary.md:19` reworded and the "does no work itself" claim corrected | **fixed (owner-sanctioned scope addition)** |
| R4 | **CORRECT** | Defect (trivial) — and my worklog asserted the opposite | `1\|lead)` re-padded; all seven arms now align `role=` at column 30, re-measured rather than eyeballed | **fixed** |

### Coder verification of each finding (run independently, not taken on trust)

- **R1 — confirmed by reading my own comment.** It said *"task 0140 retired the name project-wide"*
  while the same task deliberately leaves the label standing in ADR-010 (×3), ADR-012, ADR-031's
  quotation, three dated reports and two wiki-vault pages. In a task whose stated discipline is
  "rename, never change a claim", I shipped a new false claim. Fixed, and the exception is now stated
  in the comment so the next reader does not have to rediscover it.
- **R2 — confirmed.** `:20`'s *Does* cell read "routes you to a role; reads the wiki" while `:51` of
  the same file said "it routes, and conducts when asked". The old place-name asserted nothing; the
  new one did, so the rename made the row self-contradictory. Exactly the rename-vs-claim line the
  brief drew — which is why it went to the owner rather than being fixed here.
- **R3 — confirmed, both halves.** The cells restated their own key. And the trailing claim is stale:
  ADR-031 §79 *itself* says any doc asserting lead "does no work itself" **"goes stale and must be
  corrected"** — so correcting it is executing ADR-031, not freelancing. Post-fix sweep: **zero**
  live docs still carry the claim. Survivors are ADR-031:79 (which predicts the staleness), the dated
  2026-07-22 design report, and `PROJECT.md:42` — which describes it correctly as *"reverses its old
  router-only 'does no work itself' stance"*, accurate as written, left alone.
- **R4 — confirmed by measurement, not by eye.** `awk 'index($0,"role=")'` reported col **31** for
  `1|lead)` against **30** for the six siblings. Now 30 across all seven. **My worklog claimed the arm
  had already been re-padded; that claim was false when written.** The reviewer checked the claim
  rather than the intent, which is the only reason it was caught.

### Re-verification after all four fixes

- `npm test` → **521 tests / 521 pass / 0 fail / 17 suites**; `prove-red.sh` → `✓ hard gate PASSED`.
- `bash -n` + `sh -n` on the launcher — OK.
- Launcher under a real pty — all checks pass, unchanged: `team` / `team room` **REJECTED**
  (`is not one of 1-7`, no exec); picks 1–7 map correctly; `lead` / `producer` / `wiki` / `adv` still
  work as words; the rendered menu and banner carry no "team room".
- **Dual-home parity re-proved:** `diff` of the two `task-owner-vocabulary.md` homes → identical.

### Two reviewer checks I did not run, acknowledged

The reviewer parsed `fkit-lead.md` with a **real YAML parser** where mine was a hand-rolled scan, and
independently **disproved** a `.claude/`-staleness concern I had not raised at all (init re-copies on
every launch). Both are stronger evidence than what I brought.

### The unfiled follow-up

The reviewer found that 0139's ledger routed the launcher alias-coverage to *"a separately named
follow-up task"* that **was never filed**. **Owner ruled: route it to the producer** with 0140's
close. It exists as a task because the reviewer noticed it had fallen through the gap.

## Re-litigates settled decisions (suppressed)

- **Codex #1 — `test/launcher-contract.test.js:79`, "no test asserts `team` / `team room` are
  rejected; either alias can be restored with the suite green."** Verified accurate as a description
  of the code (the suite has no interactive-menu test at all — the tty menu is an explicitly
  **accepted** untested edge, `ai-agents/knowledge-base/architecture.md:453`). **Suppressed:** it
  matches 0139's accepted residual *"No launcher-contract test for the new `team` / `team room`
  words"* (`ai-agents/tasks/done/0139-.../review.md`), whose round-2 update names this exact
  coverage — the menu picks plus the negative CLI assertions — as the follow-up task's job, and whose
  **re-raise condition ("the missing coverage hides a demonstrable defect in the current code") is
  NOT met**: the removal is verified working. See the convergence call for the unfiled-follow-up
  question this raises for the owner.
  - **Round-2 resolution.** The owner ruled the follow-up is routed to the producer at 0140's close,
    to be filed as its own brief (menu picks + the negative `team` / `team room` rejection
    assertions, pty-driven). The suppression stands **and** the gap is no longer dangling. Recorded
    as a residual below.

## Checked and found clean (no row — recorded so they are not re-chased)

- **`claude/agents/fkit-lead.md` frontmatter parses.** Independently confirmed with a real YAML
  parser (Ruby psych), not a hand-rolled scan: all four keys present, `description` is a 562-char
  String beginning "The fkit lead and orchestrating conductor…", `initialPrompt` 721 chars. The `>-`
  folded scalars are intact and the added backticks/em-dash change no YAML meaning. **No H1 fallback
  risk was realized** — and none of the seven `claude/agents/fkit-*.md` files has an H1, so the
  absence is the repo norm rather than a hazard introduced here.
- **No claim changed on the rename axis in `fkit-lead.md`.** `:4` "menu option 7" → "the first entry
  in the `fkit` menu" is the sanctioned correctness fix (b) and is true of the current menu
  (`claude/fkit-claude.sh:466`). `:23` "picking 'lead'" matches the menu's current label. The
  sentence's pre-existing weakness — it asserts the owner arrived via the menu, untrue for `fkit
  lead`, the headless default, and `@fkit-lead` consults — is inherited, not introduced.
- **Menu arm removal is complete and self-consistent.** Picks 1–7 each map to exactly one role, no
  duplicate or unreachable arm, and the prompt range (`:476`), the error text (`:488`) and the arm
  set agree. Nothing anywhere in the repo still tells a user the aliases work — the only surviving
  `team`/`team room` strings in either launcher file are `:182` and `:186`, which name the words in
  order to say they are rejected.
- **The `:184` history claim is accurate.** "Task 0139 had briefly accepted them here and REVERTED
  it, owner-ruled 2026-07-25" is corroborated by 0139's `worklog.md:14` and its R1 disposition.
- **Dual-home parity — the coder's reading is right and the brief was wrong.**
  `ai-agents/knowledge-base/conventions/dual-home-parity.md` lists
  `knowledge-base/conventions/*.md` as fkit-authored, "✅ must match"; `diff` of the two homes
  returns identical.
- **Stale `.claude/` copies are NOT a defect — disproven.** `.claude/agents/fkit-lead.md` and both
  `.claude/skills/` copies still carry the old text, but `claude/fkit-claude.sh:337,339` runs
  `fkit-claude-init.sh` on **every** launch and `claude/fkit-claude-init.sh:463-470` unconditionally
  re-copies from `claude/`, so they self-heal before any session starts. This also materially
  lowers the risk of the coder's self-flagged unopened-session gap.
- **Verification reproduced independently.** `npm test` → 521 tests / 521 pass / 0 fail / 17 suites;
  `prove-red.sh` → `✓ hard gate PASSED`. Matches the coder's report exactly.
- **`architecture.md:180`'s `:311-345` menu citation is stale but pre-existing** — at HEAD the menu
  sat at `:435-490`, not `:311-345`, so this predates 0139/0140. Out of scope, not a finding.

## Accepted residuals (shared, do-not-re-litigate)

*Added by the reviewer in round 2, recording the owner's dispositions relayed from the coder session
on 2026-07-26. **All four findings (R1–R4) were FIXED, not accepted** — none of them is a residual.
The single entry below is the standing coverage gap, which is a residual of the code as shipped.*

- **No launcher-contract test pins the `team` / `team room` rejection** *(owner disposition,
  2026-07-26)* — **What:** the alias removal at `claude/fkit-claude.sh:481` is verified only by a
  manual pty run and by reading the source; `test/launcher-contract.test.js` has no interactive-menu
  test at all, so either alias could be restored with the suite fully green. The coverage is **routed
  to the producer at 0140's close**, to be filed as its own brief — menu picks 1–7 plus the negative
  `team` / `team room` → `rc=2, no exec` assertions, pty-driven — rather than grown into 0140's
  scope. **Why (structural):** the tty menu is an explicitly accepted untested edge
  (`ai-agents/knowledge-base/architecture.md:453` — "not a real self-update over the network or a
  real menu on a tty; those edges stay manual"), and the owner ruled in 0139 that this coverage is a
  separately named task, not a scope addition to the task that changes the behavior. This carries
  forward 0139's residual of the same name
  (`ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/review.md`), whose
  round-2 update names this exact coverage. **Re-raise only if:** the missing coverage hides a
  demonstrable defect in the current code (it does not today — the rejection is verified working), or
  0140 closes without the producer filing the brief.
