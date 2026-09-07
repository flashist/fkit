# Review — 0361

Task: `ai-agents/tasks/done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md`
File(s) under review: `test/closed-rank-immutability.test.js` (+108/−9) · the task folder's `worklog.md`
Status: closed-out
Coverage: both reviewers measured — Codex ran (`codex-cli 0.152.0`, exit 0) and executed: it ran 33
selected tests from the suite including both live-board legs, drove the source-extracted parser against
the malformed forms, and built an in-memory mutant that accepted `'P1 (a) (b)'` (finding R2). My own
pass executed the full suite (838/838), `prove-red.sh` (28 mutations, hard gate PASSED), a
reconstruction of the coder's RED state (39/35/4), five mutation isolations (m1–m5), and a parse of all
7 sprint boards.

## Reviewer findings

| #  | Round | Sev    | Location | Claim |
|----|-------|--------|----------|-------|
| R1 | 1     | medium | `test/closed-rank-immutability.test.js:227-229` | `findRankViolations`' contract comment — *"a row closed in `earlier` that appears in `later` with a different Priority cell is a violation"* — is now false: `—`→`P3` on a closed row is a different Priority cell and returns `[]`. The diff never touches this comment. ADR-046 §Related names comment staleness as a defect class for this change; it enumerated two refusal sites (both correctly amended), and this is a third, invalidated by part 2's transition table rather than part 1's widening. Lesser second site, same defect: `:3-4` *"its Priority cell (`P<n>`) is frozen: history, not plan"* — the `(P<n>)` parenthetical partly scopes it and the new header paragraph states the exception 60 lines below, so this site is weaker but not clean. |
| R2 | 1     | medium | `test/closed-rank-immutability.test.js:442-452` | `'P1 (a) (b)'` is on ADR-046's must-throw list and on the plan's §5 b1 list, and is asserted **nowhere** in the suite. Proved by mutation: changing the annotation quantifier `?`→`*` in the rank regex makes the parser accept `'P1 (a) (b)'` and the suite stays **39/39 green**. Today's parser rejects it correctly, so there is no live behavior defect — this is an unpinned rejection. ⚠️ Second consequence, and the reason this is not `low`: ADR-046's correction note dated **2026-09-05** asserts as measured fact *"Every other item on the list is reachable and IS asserted — `'high'`, `''`, `'P'`, ASCII hyphen `-` (U+002D), en-dash `–` (U+2013), `'—5'`, and `'P1 (a) (b)'`"*. That claim is false for the last item. A dated correction written to repair one false list item introduced a second false claim about the same list. |
| R3 | 1     | low    | `test/closed-rank-immutability.test.js:69-70` | The header's red-proof claim is measurably wrong: *"its red proof is the four ADR-046 comparator tests below."* Measured by isolation — the four tests that go red when b1+b3 are reverted are the **parse** test plus comparator rows 1, 2 and 3, not "the four comparator tests"; comparator **row 4 kills no mutation of this rule** (green under all five mutants m1–m5, and its own comment plus the worklog concede it duplicates existing coverage); and the sole killer of ADR-046's explicitly named residual risk — a character class `[—–-]` in place of the literal alternative — is `parseBoard: a garbage Priority cell throws`, which the stated red-proof set omits. The suite carries a standing owner ruling of 2026-08-06 to *"State the gap"*, so a wrong statement of its own red proof is a defect in the record, not a nit. No behavior impact: the actual red proof is stronger than the sentence claims. |
| R4 | 1     | low    | `worklog.md § Not done, deliberately` | The disavowal quotes the plan's false claim as *"`dashboard.sh` never reads that column"* and attributes it to *"The plan's false §3 Finding 1 wording"*. The plan's §3 Finding 1 actually reads *"`dashboard.sh` never reads the Priority column at all."* The quoted string is ADR-046's rendering of the **relayed owner reason**, not the plan's text. ⭐ The substance is correct and the driver's requirement is honoured — the false claim is stated only to refute it, and the worklog affirms `dashboard.sh` does read the column as arm 2 of its FACTS-id ladder. Only the attribution of the quoted fragment is wrong, which is the exact class `conventions/durable-citation-anchors.md` and Sweep B are sweeping. |

## Coder response

<!-- CODER-OWNED (ADR-038). The reviewer never writes this section. -->

Round 1 processed 2026-09-05. Severities below are **mine**, derived from the blast radius I traced;
the reviewer's labels were not inherited. Every claim was re-verified against the artifact firsthand
before any edit — three by executing mutants, one by reading all three source texts.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (record) — **my sev: medium** (zero behaviour impact, but a *measurably false contract statement* directly above the function it describes, in a suite whose declared method is that its comments are the record) | Amended **both** sites. Primary: `findRankViolations`' contract comment now carries the `—` exception (`—`→`—` and `—`→`P<n>` return nothing; `P<n>`→`—` still violates). Lesser: the top-of-file **THE INVARIANT** statement gains the same exception — owner **S3**, *"Amend it too (Rec)"*, because a reader starts there. ⭐ This is the **third** site of the class ADR-046 §Related names; the ADR enumerated two and b2 amended those, so the class was right and its enumeration was short. Confirmed false by execution: comparator row 2 returns `[]` on `—`→`P3`. | ✅ done |
| R2 | CORRECT | Defect (unpinned rejection) — **my sev: medium**, and I raise it above the reviewer's reasoning on one point (below) | Added `'P1 (a) (b)'` to the garbage test's negatives, with the mutant recorded beside it. ⭐ **Re-measured after the fix, which is the only thing that proves it:** the `?`→`*` quantifier mutant **survived 39/39 before** and now **reds 39/38/1**, killed by `parseBoard: a garbage Priority cell throws`. ⛔ **ADR-046 not touched** — owner **S1**, *"Coder asserts it + architect dates a note (Rec)"*; an architect dates the note so the record shows the claim was false **when written**, not merely true by the time someone checked. | ✅ done |
| R3 | CORRECT | Defect (record) — **my sev: low**, agreeing with the reviewer | Replaced the false sentence *"its red proof is the four ADR-046 comparator tests below"* with the **measured mutant→killer map**: reverting the widened regex reds the unranked-parse test + comparator rows 1-3; dropping the guarded `continue` reds comparator row 2 alone; the character class `[—–-]` reds `a garbage Priority cell throws`, its **sole** killer. Row 4 kills none of the three and the note now says so. ⚠️ The old sentence was wrong in **both** halves — wrong set, and it **understated** real coverage. Owner **S2**, *"Fix R3 now, accept R4 as residual (Rec)"*. | ✅ done |
| R4 | CORRECT | Defect (record), **not** a frontier — **my sev: low** | **none.** Owner **S2** accepts it as a residual; entry added below. ⚠️ Verified precisely, and the reviewer's diagnosis is exactly right: the string *"never reads that column"* **does** occur in `plan.md`, but inside its dated correction's *do-not-repeat instruction*, **not** in §3 Finding 1, whose actual wording is *"never reads the Priority column at all."* The nearest true attribution is ADR-046's rendering of the **relayed** owner reason. That makes the mis-citation subtler than it looks, not less real. ⛔ Status reads `won't fix (frontier)` only because the fixed vocabulary has no *accepted defect* value — see the residual's Why. | won't fix (frontier) |

## Accepted residuals (shared, do-not-re-litigate)

<!-- Entries are added only once the owner approves treating a finding as a settled tradeoff. -->

- **The two-commit launder depends on the guard running in the window** — What: ADR-046 and the file
  header state that `P5`→`—`→`P9` "cannot" launder because step one flags; measured true
  (`P5`→`—` returns one violation), but only if the suite runs while that transition is the current
  one. If both commits land before anyone runs it, leg 2 compares `—` against `P9` and returns `[]`
  (measured). · Why (structural): pre-existing and already stated 60 lines above in the same header
  — *"there is no CI, so the guard sees only the current uncommitted transition plus the last
  committed one. A breach committed while nobody ran the suite in that window is never caught."* It
  is identical for a plain `P1`→`P2` renumber, so the widening does not worsen it, and ADR-046's
  Consequences note that the erase direction was previously unreachable and is now *stronger*, not
  weaker. The only remedy would be flagging `—`→`P<n>`, which ADR-046 refuses by name because it
  would flag Sprint 7's lawful act of 2026-08-29. · Re-raise only if: CI lands and the guard becomes
  continuous, making the window claim testable; or the owner sanctions flagging `—`→`P<n>`
  (ADR-046 §Re-raise only if).
- **R4 — the worklog's mis-attributed quoted fragment** — What: the phase-2 `worklog.md`, under
  *"Not done, deliberately"*, quotes *"`dashboard.sh` never reads that column"* and attributes it to
  *"The plan's false §3 Finding 1 wording"*. Verified 2026-09-05 against all three texts: §3 Finding 1
  actually reads *"`dashboard.sh` never reads the Priority column at all"*; the quoted string is
  ADR-046's rendering of the **relayed owner reason**, and it also occurs in `plan.md`'s dated
  correction as part of its *do-not-repeat instruction*. The **substance is correct** — the false
  claim is stated only to refute it, and the worklog affirms `dashboard.sh` does read the column as
  arm 2 of its FACTS-id ladder — so the driver's disavowal requirement is honoured. Only the
  attribution is wrong. · Why (structural): owner ruling **S2**, live `AskUserQuestion` 2026-09-05,
  label verbatim **"Fix R3 now, accept R4 as residual (Rec)"**. The structural line the owner drew is
  between a **shipped artifact whose comments are its declared record** (`test/closed-rank-immutability.test.js`,
  read by every future implementer — R3 is fixed) and a **point-in-time audit record** whose substance
  is already correct (the worklog — accepted). Rejected alternative: correcting the worklog too. It
  was rejected as churn on a record that is not wrong about anything a reader would act on.
  ⚠️ **Stated rather than smoothed over:** this is the same mis-citation class that S1's own reason
  invokes (*"this repo's whole sweep programme exists because 'true by the time anyone checks' is how
  false records survive"*) and that Sweep B is clearing. Accepting it here is a **scoped cost the
  owner took knowingly**, not a finding that was argued away — which is precisely why the re-raise
  condition below is a real one and not a formality. ⛔ It is **not** a frontier-move; it is a defect
  the owner chose not to spend a round on. · Re-raise only if: a sweep row is opened over task-folder
  worklogs (as distinct from briefs, ADRs and board records), in which case this instance is in its
  scope and should be swept with the rest; **or** a later reader is measured to have relied on the
  wrong attribution; **or** `0361`'s worklog is edited for any other reason, at which point fixing
  three words costs nothing and the residual is discharged rather than carried.
