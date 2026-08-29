# Replace the review coverage binary with ADR-042's three-state vocabulary

**Source**: `ai-agents/tasks/done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P20` · ID 0272 · owner `fkit-coder` · **three review rounds**, 2026-08-28

## Goal

Implements **[[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] D1**. The degradation contract was a **binary** — Codex ran, or *"Codex reviewer unavailable"* — with ⛔ **no vocabulary for the actual, permanent state: Codex ran, read the diff, reasoned well, and measured nothing.**

⭐ **Three reviews in one sprint, same flag and same capability each time, produced three different claims:**

| Task | Coverage claim | Reality |
|---|---|---|
| `0259` | *"Coverage is FULL — no reviewer skipped, no degradation"* | Codex measured nothing |
| `0264` | *"coverage is **not** partial"* — while the same ledger says *"All execution evidence in this ledger is mine"* | ⛔ **Self-contradictory in one file** |
| `0265` | **PARTIAL**, loudly and correctly | Accurate |

⚠️ **A reporting defect, not a capability complaint.** ⭐ On `0265` the read-only Codex pass **originated three independently-verified findings, including an ADR-040 breach.** ADR-009's model-diversity purpose survives intact. ⛔ *"What is not permitted is a report implying more than reasoning."*

### ⭐⭐ The one design instruction that makes the split safe

`0273` will flip the Codex sandbox to `workspace-write`, at which point *reasoning-only* stops being true by construction and becomes a **per-run fact**. ⛔ **The brief forbade writing the by-construction form.** The rule had to be written in **per-run** shape from day one:

> A report claims **both reviewers measured** only on **evidence in the Codex output that it actually executed something** — never inferred from the sandbox flag permitting it.

⭐ **Why the wording is the whole reason this is a separate task:** it is correct today *and* after `0273` lands (**no re-edit**), and ⭐ **the owner reserved a named "disable exit" — reverting `0273` must touch NOTHING here.** Written the other way, a revert would silently make this text wrong.

⚠️ **The binding constraint: this had to land BEFORE or WITH `0273`, never after** — *"implementing D2 without updating D1's reporting logic would recreate the original defect in mirror image."*

### ⛔ The hardest call — the third state must NOT become a failure verdict

The existing vocabulary offers only `🟡 Partial review`, which **takes precedence over `✅ Ready to merge`**. ⛔ **Under today's sandbox that is EVERY review, so forcing it would mark every review on the project as partial and destroy the signal.** ⭐ *"The reasoning-only state is a coverage statement, not a verdict token."* ⛔ **Equally, it must not be so quiet it disappears** — ADR-042 requires it stated in every report, *"never omitted because it is routine."* **If the plan could not resolve that balance, it was to stop and escalate rather than pick silently.**

## Key Changes

A canonical **`## Coverage states`** section with three states — **both reviewers measured** · **reasoning-only second opinion** · **Codex unavailable** (the loud fallback, unchanged) — plus a decision procedure, a fixed report slot, and a `Coverage:` ledger-header field.

Sites touched: `fkit-review`, `fkit-stateful-review`, `fkit-adversarial-review`, `fkit-process-stateful-review`, both ship-loops, three agent files, `claude/README.md`, and nine gitignored mirrors.

⚠️ **The brief's site list was explicitly a dated convenience** — *"ADR-042 cites three of these; the full set was re-derived here by grep and is larger. Re-derive it yourself before editing — report any site this list missed rather than editing it silently."*

## Outcome

**Three rounds, 19 findings plus 4 uncited neighbours — all dispositioned, every row `✅ done`, nothing blocking.** Closed on the owner's *"Fix all four, then close"*.

⭐⭐ **This review is the task's own verification step 3 — the first real run through the contract the diff changes, run under the NEW rules — and it landed on `reasoning-only second opinion` for itself.** ⭐ **The ledger states the per-round reasoning in full**: the Claude pass measured (14 tests run this turn); Codex executed only `cmp`, `shasum` and `git diff --check`, ⭐ **which inspect file *text*, not behaviour — reading, not measuring** — and its own self-assessment says *"no behavioral tests executed."*

### ⭐⭐ Round 1's sharpest finding used the review itself as the specimen

**R3 (medium):** ⛔ **step 2's execute-test was not decidable on a real read-only run — *"this run is the specimen."*** Its wording admitted commands Codex really did run whose results underpinned two findings, while the exclusion named only three literal activities. ⭐ **The reviewer could only resolve it by reaching PAST step 2 to state 1's definition.** Fixed by making the exclusion **principled rather than enumerative**: the bar is a command whose result is evidence about **behaviour**; anything that only inspects source **text** is reading.

### The other structural findings

- **R2:** ⛔ **step 1 self-contradicted on a usable findings list plus a non-zero exit** — *"two honest readers get two different states on the same run."* Fixed so **usability decides, not the exit code**, in both directions.
- **R4:** ⭐ **the dated note PRE-DECIDED the state** — unconditional, and the last thing in the section, so a reviewer whose Codex pass actually failed could read the note and write *reasoning-only*, ⛔ **reproducing the `0259`/`0264` overstatement in a new form.**
- **R5 (and R14, R16):** ⭐⭐ **the new hard rule required the reviewer to refresh a header field that an ownership rule two lines above forbade it to write** — so from round 2 onward the reviewer must **violate a hard rule or leave the field stale.** ⛔ **And the same schema line landed in the coder-side skill with nothing saying who owns it — the exact fork the lockstep edit was meant to prevent.** R16 then found **the same asymmetry one file over**, in round 3.
- **R6:** the state is defined as **both** reviewers executing, ⛔ **but the procedure tested only the Codex output.**
- **R11 (raised by both; Codex rated high):** ⛔ **R2's fix landed in step 1 ONLY** — the mandatory degradation paragraph one section earlier still routed a non-zero exit to `Codex unavailable`, **and now named the state outright.**
- **R12:** ⭐⭐ **the dated note's premise was FACTUALLY WRONG** — `--sandbox read-only` blocks **writes, not execution**. Measured that turn: the Codex pass executed a shell pipeline successfully. Corrected in place, in the sanctioned home for sandbox facts so no new coupling was created.
- **R15 (the reviewer's own):** ⭐ **a new placement sentence miscounted itself** — *"State it exactly once: in that slot, **and** in the header"* names two places while saying "once".
- **R19:** ⛔ **the state-3 definition named a banner this file does not emit.** ⭐ Fixed by naming the right one **and keeping the other name straight rather than deleting it**, since the section is the shared single source.
- **R7 / R8 / R18:** the worked example **hardcoded a sandbox value, a blocked syscall and a CLI version**, which ⛔ **landing OR reverting `0273` would falsify** — the split property was restored by generalising to placeholders. ⭐ **And step 3 demanded a codex-cli version the procedure never captured**; the capture was prescribed at the one site that demands it, ⭐ **plus the case where there was no run at all and there is no version to cite.**
- **R10:** ⭐ **the old binary word survived in a retry branch labelled *"Partial (no Codex)?"* — in the very file that now says reasoning-only is NOT partial.** ✅ A counter-grep confirmed it was **the last surviving unqualified binary label**.

### Accepted residuals — none

⛔ **None recorded, and none owed.** Both pending dispositions were owner-ruled **fix, not accept**, so neither became a settled tradeoff. ⭐ **The only frontier item raised was DISPROVEN — and a disproven claim is not a residual.**

## Related
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — D1, which this implements
- [[systems/review-and-model-diversity]] — the two-reviewer contract this vocabulary describes
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — the model-diversity purpose this preserves
- [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]] — `0259`, one of the three inconsistent ledgers that motivated the ADR
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
