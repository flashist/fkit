# Review — Report the Backlog board in `/fkit-status` on request only

**Task-id:** `report-backlog-board-in-fkit-status-on-request-only` · **Sprint 2, priority 68**
**Scope:** working tree. Tasks 65 and 67 excluded from both passes (already closed out in their own
ledgers) and not re-litigated.
**Reviewers:** fkit-reviewer (own pass) + **Codex adversarial `codex-cli 0.144.4` — ran successfully,
coverage complete.** *(First Codex invocation aborted: `timeout` is absent on macOS. Re-run succeeded;
no coverage lost.)*

> **⚠️ Provenance of the section below.** The reviewer's ledger write was blocked by a harness
> subagent file-write restriction, so it returned its *Reviewer findings* as text and asked the coder
> to transcribe it. **The section below is that text, reproduced verbatim.** The coder did not author,
> edit, soften, or re-order any of it. Recorded here because a reader must be able to tell a
> transcribed finding from a coder-authored one.

## Reviewer findings

*(transcribed verbatim — reviewer-owned; the coder does not edit this section)*

### 🛑 Blocked — 6 confirmed defects (1 high), 1 verification gap

**Lead finding — the coder's claim 1 is refuted, and it's a regression.**

**R1 is not a gap, it's a behavior loss.** A/B proven on a fixture (board row `🔲 Backlog`, brief
`## Sprint: Sprint 2` + `## Status: 🔄 In progress`):

```
BEFORE task 68:  drift disagreement a plan="🔲 Backlog" brief="🔄 In progress" location="backlog/"
AFTER  task 68:  (nothing)
```

With `PLAN_SPRINT` empty, rule 1's guard `[ -n "$PLAN_SPRINT" ]` was false, so every row fell through
to the rule-3 cross-check and this drift **was** reported. Setting `Backlog` activates the skip, and a
brief naming a real sprint now takes it silently. That is the backlog board's single highest-value
drift — *scheduled, but still on the unscheduled board* — and it is now invisible. It also directly
contradicts the new SKILL.md moot-beat 3: "If a row *does* read `🔄 In progress`, that is a
**finding**, not a status." The script now guarantees the skill never sees it.

Rule 1's skip is correct for *sprint* boards, where a brief naming another sprint is a legitimate
moved row. On the backlog board that same condition **is** the drift.

| # | Reviewer | Their sev | Verified verdict | Defect/frontier | One-liner |
|---|---|---|---|---|---|
| R1 | both | medium | **CORRECT — severity raised to high** | Defect (regression) | `dashboard.sh:616` — rule-1 skip now hides scheduled-but-on-backlog drift that was previously reported |
| R2 | both | medium | **CORRECT** | Defect | `dashboard.sh:507` — stem fallback bypasses the sanitization invariant `task_id()` itself documents |
| R3 | Codex | medium | **CORRECT** | Defect | `SKILL.md:157,160` — moot-beats 1 and 4 instruct ungroundable assertions |
| R4 | Codex | medium | **PARTIALLY CORRECT — severity lowered to low** | Defect (minor) | `dashboard.sh:81` — basename-only match, no path check |
| R5 | Codex | low | **CORRECT** | Defect (test) | `test:375` — free-text-Priority test vacuous w.r.t. its distinguishing input |
| R6 | fkit-reviewer | — | **CORRECT** | Defect (test) | `test:304-308` — comment claims a coupling guarantee the fixture cannot provide |
| R7 | both | low | **CORRECT** | Not a defect — verification gap | `dashboard.sh:719,731` — three consumers changed, not one |

**R2 detail** (answers coder question 2 — **no, the stem is not always a single token**). Reproduced
live:

```
drift nonconformance my task kind="brief-missing-status" cell="🔲 Backlog"
… drift on tasks my, re[a]d, task — see above.
```

Two rows produced **three** task names. The positional `key="value"` grammar breaks, and the roll-up
invents a phantom task. `dashboard.sh:437-439` already documents exactly this hazard class for the
Priority cell and guards it — the fallback is inconsistent with an invariant this file established
deliberately. Also latent: `set -f` is absent, so `$DRIFT_TASKS` word-splitting is subject to pathname
expansion (the legacy `tid="?"` expands to any 1-char filename in cwd — pre-existing, and the change
*reduces* its frequency).

**R7 detail** (answers coder question 1). Three consumers, all changed: `:616` rule 1, `:719` the
`unresolved-plan-sprint` fact, `:731` `plan_level_drift`. The latter two are correct and are the fix;
the roll-up's "and on the plan itself" clause vanishing for this board is asserted by no test.

**Not defects — two of the coder's claims hold:**

- **Question 3 — `sort -n | uniq`: cleared.** Verified empirically. Under `LC_ALL=C`, `sort -n`
  compares non-numerics equal at 0, then breaks ties by the POSIX last-resort full-line comparison, so
  identical stems land adjacent and `uniq` dedupes correctly; mixed numeric/non-numeric sorts stably.
  Both reviewers independently cleared it. The hazard in that expression is word-splitting (R2), not
  the sort.
- **Question 4 — one-skill-one-output: honest, not sophistry. No reversal ADR needed.**
  `conventions/one-skill-one-output.md`'s own litmus table already places `/fkit-status <sprint name>`
  on the allowed side: "a **different subject** — a different board — not a second rendering of the
  same one." `Backlog` selects a different board *file* and yields the same complete briefing. It
  passes the convention's stated test on the convention's own terms.
- **Question 5 — the moot-beats table: worse than gesturing.** Beats 2/3/5/6/7 are executable. Beats 1
  and 4 are R3 — they don't under-specify, they instruct a fabrication.

**Suppressed as settled:** none. Neither reviewer raised anything matching an accepted residual from
the tasks 65/67 ledgers or from ADR-009/010/012/022. Codex's priming held.

**Observation — real live drift, not caused by this change.**
`ai-agents/tasks/backlog/gate-read-side-symlink-hazard-in-init.md` is genuinely missing its
`## Status` heading (siblings have one). The live board now reports it **attributably** as
`drift nonconformance gate-read-side-symlink-hazard-in-init kind="brief-missing-status"` — the fix
working as designed. Pre-existing data drift; owner's call whether to correct the brief.

**Convergence call:** act, don't close out. Round 1, no re-litigation, and R1 is a genuine behavior
loss with a reproducible A/B — not a settled tradeoff being reopened. R1 should be resolved before this
lands; R2–R6 are real but non-blocking. Nothing here re-opens the owner's stem ruling: R2 concerns
*sanitizing* the chosen value, not the choice between stem/`?`/ordinal.

## Coder response

**Round 1 — coder verdicts, 2026-07-18.** Every finding verified against the code before acting.
**All 7 CORRECT, none disputed, all 7 resolved.** **Two of my own claims to the reviewer were refuted,
and both refutations were right** — I reproduced each independently before accepting it.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT (high)** | Defect — regression | **Reproduced the A/B myself before accepting.** **Owner ruled: suppress rule 1's skip on the backlog board.** A dedicated arm now runs the rule-3 cross-check for `PLAN_SPRINT="Backlog"` and adds `[ -n "$b_sprint" ] && [ "$b_sprint" != "Backlog" ]` as a drift condition, so "scheduled but still on the unscheduled board" is reported — and the record now carries `brief_sprint=` so it names the actual problem. Two regression tests added, including the mirror case proving rule 1 still skips normally on a sprint board. | **fixed** |
| R2 | **CORRECT** | Defect | **Reproduced: 2 rows → 3 task names, inventing a phantom `task`.** Stem is now sanitised to `[A-Za-z0-9._-]`. Also added `set -f` at the top: `$DRIFT_TASKS` is word-split unquoted, so the legacy `tid="?"` sentinel could expand to any 1-char filename beside the caller — verified fixed. | **fixed** |
| R3 | **CORRECT** | Defect | Moot-beats 1 and 4 rewritten to be groundable in the plan+briefs source set: beat 1 no longer asks whether the backlog is "growing" (one snapshot, no history); beat 4 no longer asks what is "stale" (no dates in the source set) and instead reports the rows the board already computed as `ready`. **Source set unchanged** — `SKILL.md:71-83` not reversed. | **fixed** |
| R4 | **PARTIALLY CORRECT (low)** | Defect | **Owner ruled: accept basename-only as intentional.** An archived `sprints/done/backlog.md` is still a backlog board and should keep its identity; tightening would make it report false `unresolved-plan-sprint`. Recorded as a deliberate choice in a comment rather than silently left. | **accepted, documented** |
| R5 | **CORRECT** | Defect (test) | The free-text-Priority test now asserts the qualifier reaches **neither** the board cell nor the FACTS id nor anywhere in stdout — previously it would have passed for any brief priority. | **fixed** |
| R6 | **CORRECT** | Defect (test) | Comment corrected to state the test's true scope: it pins the **script's** behavior given matching values and **cannot** guarantee the repo's real briefs still say `Backlog`. The overclaim is removed rather than the test strengthened, because a fixture genuinely cannot provide that coupling. | **fixed** |
| R7 | **CORRECT** | Verification gap | My claim that only rule 1 changed was wrong — three consumers changed. Two tests added: one pinning that the identity silences **both** the `unresolved-plan-sprint` fact **and** the roll-up's "on the plan itself" clause, one proving the backlog rule does **not** over-reach (a genuinely unidentifiable plan still reports). | **fixed** |

### Verification of the fixes

- **R1 re-proved by re-running the reviewer's own A/B fixture:** silent before the fix, and after it
  `drift disagreement a plan="🔲 Backlog" brief="🔄 In progress" brief_sprint="Sprint 2"
  location="backlog/"`. Reporting restored, with a better message than the original.
- **R2 re-proved:** the same two-row fixture now yields exactly two ids (`my-task`, `re-a-d`) and a
  roll-up naming exactly two tasks. The `?` sentinel no longer globs against the cwd.
- `npm test` — **362 pass / 0 fail**.
- Live: clean backlog board carries no drift clause; `sprint-2.md` output unchanged and still keyed by
  number.

### Still open, deliberately

- **`brief-missing-status` on `gate-read-side-symlink-hazard-in-init.md`** — pre-existing data drift the
  reviewer independently confirmed. Reported, not repaired: brief content is the producer's. It is now
  reported *attributably*, which is the stem fallback working as intended.

**Reviewer's independence preserved:** the *Reviewer findings* section above is a verbatim
transcription and was not edited.

## Accepted residuals (shared, do-not-re-litigate)

- **`Backlog` as a `/fkit-status` argument is a target selector, not an output variant.** · Why: it
  selects *which board*, exactly as `Sprint 1` does, and yields the same complete briefing —
  `conventions/one-skill-one-output.md`'s own litmus table places this on the allowed side. Both
  reviewers independently cleared it; no reversal ADR needed. · Re-raise only if: an argument is
  proposed that changes *how* one board renders rather than *which* board is reported.
- **The backlog identity is matched on basename, not canonical path.** · Why: an archived
  `sprints/done/backlog.md` is still a backlog board; a path check would make it report false
  `unresolved-plan-sprint` drift. Owner-ruled 2026-07-18. · Re-raise only if: a project is found with a
  `backlog.md` under `sprints/` that is deliberately *not* a backlog board.
