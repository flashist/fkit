# Review — 0283

Task: `ai-agents/tasks/done/0283-make-the-lockdown-guard-case-test-filesystem-independent/brief.md`
File(s) under review: `test/orphan-cleanup.test.js` (working-tree diff, sole source path in scope)
Status: **CLOSED — round-3 final check PASSED, 2026-08-13.** All comment claims verified accurate by
first-hand measurement on **both** filesystem kinds; no executable line changed since round 1; nothing
returned. This was the single pass the owner bounded (*"Fix it, then final-check once"*).

**CLOSING VERDICT (round 3): ✅ Approved — 0 defects. The corrected clause is measured TRUE, both
exceptions reproduced, and the macOS-artefact inference is CONFIRMED on a genuinely case-sensitive
volume. Comment-only since round 1. Coverage: Claude-side only this round — no Codex pass (round 1 had
a genuine reasoning-only Codex pass, ADR-042 D1); do not read this round as model-diverse.
⚠️ CI green is INFERRED, not measured — nothing pushed, no Actions run observed since the fix.**

**Verdict (round 1): ⚠️ Changes requested — 0 defects in behavior; 2 record-level defects in the
comment/rationale, both owner-ruled ACCEPT-AS-IS. Coverage: reasoning-only on the Codex side (ADR-042 D1).**

> **Coder note on the verdict line above (2026-08-13, coder-owned — the reviewer's sentence is left
> unedited).** Its *"both owner-ruled ACCEPT-AS-IS"* was true when written and is now **partly
> superseded**: the owner ruled again after the review — *"Correct the comment too"* — so R2's false
> rationale was corrected in the source comment. **ACCEPT-AS-IS still holds for the code**: no
> assertion, fixture or executable line changed. See *Coder response* and the amended R2 residual.

---

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | high | `test/orphan-cleanup.test.js:295-298` | ⛔ The per-line refusal-reason assertion is **NOT optional** — it is the **sole** detector of the C5 lowercasing regression. Deleting it turns the suite **green 23/23 with the regression live**, on both filesystems. It must not be loosened below "names the refusal reason, bound to the line". |
| R2 | 1     | medium | `test/orphan-cleanup.test.js:275` | The comment's clause *"list the REAL `.fkit/settings` alongside it, **so the survival assertion bites everywhere**"* is **measured FALSE**. The widening makes `.fkit/settings` a deletion *candidate* everywhere, but `existsSync(coder.json)` still cannot fail under **any single fault** — `orphan_refs` refuses the path independently. |
| R3 | 1     | medium | `test/orphan-cleanup.test.js:296` | The build worker's flag that this exact sentence *"is already asserted elsewhere in this suite"* is **FALSE**. `:296` is the **only** assertion in the entire `test/` corpus that pins a full rendered `<path> — refused: <sentence>` line. Asserting refusal *wording* is established practice (35 sites); pinning the *whole rendered line* is unique to this site. |
| R4 | 1     | low  | `test/orphan-cleanup.test.js:292` | ⚠️ **REGRESSION RISK — do not act on the Codex recommendation to delete the broad `/lockdown state/` match as "vacuous".** It is vacuous only under the *lowercasing-only* regression. Under **whole-guard removal** it is the assertion that fires. It is subsumed by `:296` **only while `:296` keeps naming the reason** — the two must not be weakened in the same edit. |
| R5 | 1     | low  | `test/orphan-cleanup.test.js:267` | The comment's *"the refusal itself is filesystem-independent (`tr` + a glob, **no stat**)"* is imprecise: `orphan_contained` runs one `-L` per path component (`claude/fkit-claude-init.sh:667-684`) and `exists` is computed before the glob. The *decision* is stat-free; *reaching* it is not. No behavioral divergence in this fixture — cosmetic. |

### Verified as NOT defects (recorded so nobody re-chases them)

- **D1 — "the fix traded macOS coverage for the Linux one": DISPROVEN.** Under the C5 regression the test
  goes **RED at `:296` on BOTH** filesystems. `stat` proves `.Fkit/Settings` and `.fkit/settings` are the
  **same inode** on case-insensitive APFS, and `mkdirSync(recursive:true)` is a **no-op** there (the
  directory listing shows only `.fkit`) — so the original C5 folding hazard is exercised exactly as before.
- **D2 — "another test makes the same case-folding assumption": DISPROVEN.** Corpus sweep of `test/`
  found no second site relying on an uncreated differently-cased path. The only other `.Fkit` occurrences
  are comments in this same file (`:90`, `:262`, `:269`, `:273`); the build-time grep at `:88-95` is
  case-insensitive **by design**, not filesystem-dependent.
- **D3 — "`mkdirSync` may throw or leave a stray `.Fkit/` on macOS": DISPROVEN.** `recursive:true` does
  not throw on `EEXIST`, and macOS preserves the existing on-disk name.

### Evidence — mutants, reproduced first-hand

Hand-rolled per **ADR-026** (no mutation library). Scratch copies of the repo only — **`claude/fkit-claude-init.sh`
in the repo was never edited**. Case-sensitivity obtained from a `Case-sensitive APFS` sparse image.

| Mutant | Filesystem | Result |
|---|---|---|
| Baseline (shipped diff, guard intact) | both | **GREEN 23/23** |
| **M1** — C5 regression (lowercasing removed) + shipped test | **both** | **RED at `:296`** |
| **M2** — C5 regression, `:295-298` **deleted** | **both** | 🚨 **GREEN 23/23 — FALSE PASS** |
| **M3** — C5 regression vs the **pre-widening** single-line test | case-insensitive | **RED at `:273`** |
| **M3b** — pre-widening test, guard intact | case-**sensitive** | **RED at `:273`** — the original CI failure, reproduced |
| **M4** — entire `*settings*` guard block removed | case-insensitive | **RED at `:292`**; `coder.json` **survived** — refused by `orphan_refs` as *"still referenced in fkit's own sources"* |

**Mechanism of the M2 false pass:** under the C5 regression `.Fkit/Settings` is refused for the **wrong
reason** (*"still referenced in fkit's own sources"*, because `orphan_refs` greps with `-i`) while the
`.fkit/settings` control line is refused as lockdown state — so a loose `/lockdown state/` match finds
its substring from the **other** line and passes.

**Why the survival assertion cannot bite (R2), proven by M4:** `claude/fkit-claude.sh:311-312` writes
`"$proj/.fkit/settings/$1.json"` on every launch, so `orphan_refs` always finds `.fkit/settings`
referenced. Removing the **entire** lockdown guard still left `coder.json` on disk. Only breaking
**both** gates makes `existsSync(coder.json)` fire.

**The widening, on its own, would have shipped a WEAKER test than the one it replaced** (M3 RED →
M2 GREEN). What restores and exceeds the lost coverage is the build worker's **autonomous** per-line
assertion — the thing it labelled optional.

---

### Round 2 — final check of the CORRECTED comments (reviewer-owned, 2026-08-13)

Scope: the factual accuracy of the three rewritten comment blocks only. ⛔ **Not a re-open** — every
round-1 ruling above stands, and nothing here proposes touching an assertion, a fixture, the widening,
or the code. **Coverage: Claude-side only. No Codex pass was run — not warranted for a narrow
check-the-claims-against-measurement pass. Do not read this section as full-diff coverage.**

Everything below was measured first-hand this round on **scratch copies only**; `claude/` in the repo
was never edited (`git diff -- claude/` empty; `fkit-claude-init.sh` sha256 `efdb56b1…6028a`, unchanged).
**Filesystem coverage: case-INSENSITIVE macOS only this round.** The both-filesystems claims rest on the
round-1 and coder-round measurements already recorded above, not on a re-run here.

| Scenario (scratch) | Result |
|---|---|
| S0 baseline, shipped guard, both list lines | both lines refused **as lockdown state**; `coder.json` survives |
| S1 = M4 re-measure, whole `*settings*` guard removed | both refused *"still referenced in fkit's own sources"*; `coder.json` **survives**; no `lockdown state` in stderr |
| S2 **both** gates down (guard removed **+** `orphan_refs` neutered) | `.fkit/settings` **deleted — `coder.json` gone** |
| S3 only `orphan_refs` down, guard intact | refused as lockdown state; `coder.json` survives |
| S4 C5 regression, **cased line only, no control line** | `.Fkit/Settings` refused *"still referenced"* → a per-line assertion on that one line **still reds**; broad `/lockdown state/` **also reds** |
| S5 C5 regression, shipped two-line fixture | cased line *"still referenced"*, control line *lockdown state* → broad match **passes**, per-line **reds** |
| S6 `.fkit` is a **symlink**, guard intact, `.fkit/settings` listed | refused *"`.fkit` is a symlink — fkit will not delete through one"* — **no lockdown-state line at all** |
| Full suite, C5 regression live (M1 re-run) | **23 tests / 22 pass / 1 fail** — sole red is the per-line assertion |
| Full suite, C5 regression + per-line loop deleted (M2 re-run) | 🚨 **23/23 GREEN** |
| Full suite, C5 regression + replacement meeting the stated floor *across* lines | 🚨 **23/23 GREEN** |

**VERIFIED TRUE — the R1 ⛔ block (`:302-310`), every claim.** Sole C5 detector (M1 re-run: 22/1, the
per-line assertion is the only red); M2 false pass reproduced (23/23 green with the guard defeated);
the broad match at `:301` is indeed what fires under whole-guard removal (S1: the string is absent
entirely); "expected to go red only if the refusal text is deliberately changed" matches the residual's
re-raise condition. **Also verified: the C5 history is preserved** (`:262-264`, plus *"exactly how the
original macOS hazard stays covered on macOS"* in point 1).

**F1 — `:285-287`, the "control" clause over-credits the second list line. Measurably not what it
buys.** The comment says the control is *"what lets the per-line assertion tell 'refused AS lockdown
state' apart from 'refused for some other reason'"*. **S4 measures otherwise:** with the cased line
**alone** and no control, the per-line assertion still reds under the C5 regression — its discriminating
power is intrinsic (it pins reason **to** line), not conferred by the control. The measured role points
the other way: comparing S4 with S5, the control line is what makes the broad `/lockdown state/` match
**stop** detecting C5 (it finds its substring on the control line), and is therefore precisely why the
per-line assertion is the **sole** detector. Everything else in the clause is true — S0 confirms the
control line is refused for the same reason. Comment-only fix; the widening itself is settled and is
**not** in question.

**F2 — `:269-270`, *"Neither can change the verdict"* is true only under one reading of "verdict".**
True as *refuse-vs-delete*: **S1/S2/S3 together** show a `*settings*` line is never deleted by any stat
outcome — `coder.json` goes only when **both** gates are down. **False as *refused-as-lockdown-state***:
S6 shows an lstat outcome in `orphan_contained` (a symlinked `.fkit`) refusing the same line for a
**different** reason, with the lockdown-state sentence never rendered. That is the exact
reason-vs-reason distinction the neighbouring block makes load-bearing, so the unqualified wording is
ambiguous in the one place ambiguity costs. Suggested floor: *"neither can turn a refusal into a
deletion"*.

**F3 — `:306-307`, the floor is necessary but not sufficient (not a false statement).** *"must still
name the refusal reason AND bind it to the line"* is phrased as a minimum and is correct as one. It is
**not** sufficient: a replacement meeting it literally with a cross-line regex measured **23/23 green
with the C5 regression live** — M2 reproduced. Worth *"…in one rendered line"* while the block is open.

**Verified accurate, recorded so nobody re-chases them:** `claude/fkit-claude.sh:311-312` is the exact
and genuine live reference (`mkdir -p "$proj/.fkit/settings"` / the `printf … > …/$1.json`), and S1
confirms `orphan_refs` refuses on it. *"on every launch"* is a light simplification — a non-writable
project takes the inline-settings fallback and writes nothing — with **no bearing** on the gate, which
reads fkit's **sources**, not the project; the same phrasing already stands at
`claude/fkit-claude-init.sh:621-622`. *"the survival assertion fires only when BOTH gates are down"* is
now measured in all three directions (S1, S3, S2) and is exactly right.

---

### Round 3 — the bounded final check (reviewer-owned, 2026-08-13) — ✅ PASSED, ledger CLOSED

Scope: the one clause the coder corrected in round 3 (*"whatever it resolves to"*), plus a
non-disturbance check over everything already settled. ⛔ **Not a re-open** — no round-1 or round-2
ruling is revisited, and nothing here proposes touching an assertion, a fixture, the widening, or the
code. This is the **single pass** the owner bounded.

**Coverage, stated plainly: Claude-side only. No Codex pass was run this round** — not warranted for a
narrow check-the-claims-against-measurement pass. Round 1 carried a genuine reasoning-only Codex pass
(ADR-042 D1). **Do not read this round as model-diverse coverage.**

**Filesystem coverage this round: BOTH kinds, first-hand.** Unlike round 2 (case-insensitive only), a
`Case-sensitive APFS` sparse image was created and mounted, and every claim at risk was re-measured on
it. `claude/` in the repo was never edited — `git diff -- claude/` empty, `fkit-claude-init.sh` sha256
`efdb56b1…6028a`, **unchanged and identical to the round-2 value**; all mutants on scratch copies.

#### Measurements taken this round

| # | Scenario | Filesystem | Result |
|---|---|---|---|
| **T1** | Test's fixture exactly (baseline) | case-**insensitive** | both lines refused **as lockdown state**; `/lockdown state/` true; `coder.json` survives |
| **T2** | Test's fixture exactly (baseline) | case-**SENSITIVE** | **identical** — both lines refused as lockdown state; `.Fkit` a distinct real entry; `coder.json` survives |
| **T3** | `.fkit` → symlink to a sibling real dir | case-**insensitive** | both lines refused *"'.Fkit'/'.fkit' is a symlink — fkit will not delete through one"*; `/lockdown state/` **false**; `coder.json` survives |
| **T4** | `.fkit` → symlink, same fixture | case-**SENSITIVE** | `.Fkit/Settings` **refused as lockdown state**; `.fkit/settings` refused *"symlink"*; `/lockdown state/` **TRUE**; `coder.json` survives |
| **T5** | list = `.nowhere/settings` (names nothing) | case-insensitive | **stderr entirely silent** — no refusal line at all; `coder.json` survives |
| **T6** | Shipped suite, unmutated | case-**SENSITIVE** `TMPDIR` | **23/23 GREEN** — the original Linux-CI failure mode does not recur |
| **T7** | **M1** (C5 regression, `lc="$line"`) | case-insensitive | **22 pass / 1 fail** — sole red is the per-line assertion |
| **T8** | **M1** (C5 regression) | case-**SENSITIVE** | **22 pass / 1 fail** — sole red is the per-line assertion |

#### 1. The corrected clause (`:300-307`) — **VERIFIED TRUE**

- *"for the two lines this test seeds — both of which exist on disk with no symlink anywhere in their
  parent chain: … refused FOR BEING LOCKDOWN STATE …, is announced, and the lockdown state is still on
  disk afterwards"* — **T1 and T2**, both filesystems, first-hand. The scoping is real work, not hedging:
  it is exactly the set the exceptions carve out of.
- Exception A, *"symlink a parent and that line is refused by containment first, with no lockdown-state
  sentence for it at all"* — **T3/T4**. Structurally confirmed by reading: `orphan_contained` is called
  at `claude/fkit-claude-init.sh:727`, **before** the `lc`/`*settings*` block at `:742-750`; the symlink
  reason is emitted at `:680`. The coder's cited line numbers are **accurate**.
- Exception B, *"point a `*settings*` line at nothing and it is still never deleted, but nothing is
  announced for it either"* — **T5**, stderr fully silent. Confirmed at `:745`: the refusal string is
  emitted only under `if [ "$exists" = 1 ]`, while the `continue` at `:749` is **unconditional** inside
  the `*settings*` arm.
- *"Neither is a hole — the deletion is refused either way"* — **not an overstatement, and precisely
  right on the naming-nothing branch**: because that `continue` sits outside the `exists` test, such a
  line is genuinely *refused by the guard*, merely in silence. `coder.json` survives in every row above.

#### 2. The coder's macOS-artefact inference — **CONFIRMED BY DIRECT MEASUREMENT** (the at-risk claim)

The coder reasoned, without remounting, that `lockdown state` being absent from stderr **entirely** in
its symlink run was a macOS artefact (both list lines collapsing onto the one symlinked `.fkit`), and
that on a case-sensitive filesystem `.Fkit/Settings` would be a distinct real directory still refused as
lockdown state. It therefore scoped the exception to **that line**, not to stderr as a whole.

**Measured on a real case-sensitive APFS volume (T4): the inference is correct.** `.Fkit/Settings` is a
distinct real directory, passes containment, and is refused **as lockdown state**, so `/lockdown state/`
**is** present in stderr — while `.fkit/settings` is refused as a symlink. Scoping the exception to the
line rather than to stderr is the **only** wording true on both filesystems; a stderr-wide claim would
have been false on case-sensitive. **The cross-filesystem inference that has been wrong three times in
this task is, this time, right — and is now measured rather than reasoned.**

#### 3. F1 / F2 / F3 — **all three corrections stand, undisturbed**

- **F1** — `:290-299` now states the control line is **NOT** what gives the per-line assertion its
  discriminating power (*"That power is intrinsic — the assertion pins the reason TO the line"*) and
  gives the measured role instead (it is why the broad match stops detecting C5, leaving the per-line
  assertion sole detector). Corrected as required.
- **F2** — `:270` now reads *"Neither can turn a refusal into a deletion"*, the exact suggested floor,
  followed by the explicit reason-vs-reason carve-out at `:271-274`. Corrected as required.
- **F3** — `:324` now carries *"— IN ONE RENDERED LINE"* with the cross-line-regex false pass spelled
  out at `:325-327`. Corrected as required; the matching ledger amendment is in the residuals block.
- The R1 ⛔ block and the two-layer coupling warning are intact and unchanged.

> ⚠️ **One precision observation, recorded, NOT a finding and NOT grounds for a further round.** At
> `:274`, *"so the lockdown-state sentence never renders at all"* is true under its line-scoped reading —
> its antecedent is *"this very line"* at `:272`, and T4 confirms that line renders no lockdown-state
> sentence. A stderr-wide reading would be false on a case-sensitive filesystem (T4: the *other* line
> renders it). The antecedent is explicit and `:305` restates the point explicitly line-scoped
> (*"with no lockdown-state sentence **for it** at all"*), so the text is accurate as written. Logged
> only so a future reader does not re-derive the question.

#### 4. Comment-only — **CONFIRMED, independently of the coder's own projection diff**

`git diff HEAD -- test/orphan-cleanup.test.js` with comment lines filtered contains **exactly three**
executable changes, all of them round-1 scope: the widened `orphan-targets` string, the added
`mkdirSync(join(p, '.Fkit', 'Settings'), …)`, and the added per-line `for` loop. These are the same
three round 2 verified. **Therefore nothing executable changed in round 3.** Both assertions are
byte-unchanged: the broad `assert.match(r.stderr, /lockdown state/)` at `:318` and the per-line loop at
`:328-331`, whose pinned string remains `${line} — refused: fkit will never delete lockdown state`,
em dash and all. T7/T8 independently confirm the detector still behaves exactly as recorded.

#### 5. C5 history preserved, and nothing overstated the other way

`:262-264` keeps the original hazard intact and adds *"That hazard is real, it is why the guard
lower-cases before matching, and it stays covered here"*; point 1 at `:281-283` keeps *"exactly how the
original macOS hazard stays covered on macOS"*, which **T2 vs T1 confirms** (distinct directory where
case matters, same object where it does not). Nothing in the new text understates the guard either:
every exception is paired with its *"neither is a hole"* qualifier, and every such qualifier is measured.

#### Convergence call

**Converged — close.** Round 3 surfaced **zero** new defects. The comment's claims and the code's
behavior now agree under measurement on both filesystem kinds, which is the condition this task existed
to reach. The three-round history was a genuine progression (each round caught a distinct false claim,
none re-litigated), and it ends here: there is no remaining unverified assertion in the block. A fourth
round would be re-reading text already measured true.

**⚠️ CI is INFERRED green, not measured.** Nothing has been pushed and no Actions run ID has been
observed since the fix. The local evidence for the CI-relevant claim is T6 — the shipped suite 23/23 on
a genuinely case-sensitive filesystem — which is the failure mode CI originally caught, but it is a
local proxy, not a CI result.

## Coder response

_(coder-owned — reviewer does not write here)_

Round 1 processed by the Process-review worker, 2026-08-13, under the sprint-loop declared-approval
marker. **All five findings independently re-verified against the code before any edit** — I did not
take the reviewer's or the verify worker's measurements on trust.

⚠️ **Line numbers in the *Reviewer findings* table are PRE-EDIT.** This round added comment lines only;
the cited sites now live at `:267` → `:267-270`, `:275` → `:279-287`, `:292` → `:301`, `:295-298` →
`:311-314`, `:296` → `:312`. No assertion, fixture or executable line changed this round —
`git diff` of the file, filtered to non-comment lines, shows only the build worker's three edits.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (in the record, not the code) — a standing instruction | Assertion **kept byte-identical**. Added a ⛔ warning comment directly above the loop naming it the sole C5 detector, the M2 false-pass hazard, and the "must still name the reason AND bind it to the line" floor. Owner-ruled: comment only, **no meta-test**. | ✅ done |
| R2 | **CORRECT** | Defect (false rationale in a source comment) | Rewrote the widening clause. It now states the measured truth: the second line makes `.fkit/settings` a deletion *candidate* everywhere but the survival assertion still cannot fire under any single fault (`claude/fkit-claude.sh:311-312` keeps the path referenced, so `orphan_refs` refuses it independently); what the line actually buys is the **control** the per-line assertion needs. C5 history kept. | ✅ done |
| R3 | **CORRECT** | Defect (false claim in the worklog record) | Corrected the build worker's decision-log entry in `worklog.md`: the exact rendered sentence was **not** asserted elsewhere. Re-verified myself — `grep -rn -- " — refused: "` over `test/` returns exactly one hit, `:312`. | ✅ done |
| R4 | **PARTIALLY CORRECT** (against Codex's underlying "delete it as vacuous" call, which is **INCORRECT**) | Frontier — deliberate defence in depth | **No change. `:301` kept.** Re-proved first-hand: under M1 the broad match does **not** fire (it finds its substring from the `.fkit/settings` line) — which is exactly why it is not a substitute for `:312`, and exactly why it is still needed for whole-guard removal. Coupling recorded in the new comment. | won't fix (frontier) |
| R5 | **PARTIALLY CORRECT** | Defect (imprecise comment), cosmetic | Verified genuinely inaccurate before touching: `orphan_contained` (`claude/fkit-claude-init.sh:665-686`) runs one `-L` per path component and is called at `:726` *before* the guard, and `exists` is computed at `:734-735` — both stats. Reworded to "the refusal **DECISION** is filesystem-independent — `tr` plus a glob over the line's TEXT, not a lookup on disk", with the two stats named and noted as unable to change the verdict. | ✅ done |

**Severity, assigned by me (not inherited):** R1 is not a code defect at all — the code is correct; it
is a **standing constraint on future edits**, and its real blast radius is a silent false pass by a
later maintainer, which is why it earned a comment at the site rather than a ledger line alone.
R2/R3 are **record** defects (a reader is misled about what carries the test) — no runtime effect,
which is why nothing executable moved. R5 is cosmetic. **Zero behavioural defects were found in the
shipped code, and none were introduced.**

### 🚨 The trap, recorded because it nearly shipped

Codex's closing advice — *"remove the redundant broad assertion, loosen the per-line matcher"* — is,
taken together, **exactly mutant M2**: the C5 regression goes live and the suite reports a clean
**23/23 on both filesystems**. It was **not followed**, and the two assertions it targets are now
protected by the residuals below plus the in-file ⛔ comment. Per **ADR-042**, that advice was
**reasoning-only** on the Codex side — it was never measured, and measurement contradicts it.

### Evidence produced this round (first-hand, not carried over)

- **M1 re-proved RED, on BOTH filesystems**, against the post-edit file. Mutation = the C5 lowercasing
  removed (`lc="$(printf … | tr …)"` → `lc="$line"`) on a **scratch copy of the tree**; the repo's
  `claude/fkit-claude-init.sh` verified byte-identical to HEAD afterwards
  (`efdb56b1446cc053da8ddc18bf992812fea33ed6778d33ba27ee6a5969f6028a`, `git diff -- claude/` empty).
  - plain macOS: exit **1**, 23/22/1 — fails at the per-line assertion (`:312`).
  - case-sensitive APFS sparse image (`File System Personality: Case-sensitive APFS`, proven by
    `.Fkit`/`.fkit` coexisting), `TMPDIR` on the volume: exit **1**, 23/22/1 — same assertion.
  - Both failure messages show the M2 mechanism verbatim: `.Fkit/Settings — refused: still referenced
    in fkit's own sources` while `.fkit/settings — refused: fkit will never delete lockdown state`.
    **The broad `/lockdown state/` match at `:301` passed in both runs.**
- **Unmutated target test on the case-sensitive volume: 23/23, exit 0.**
- **`npm test` on the real repo: exit code 0** (captured with no pipe), `tests 709 / pass 709 / fail 0 /
  skipped 0`, `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- `git diff --stat`: `test/orphan-cleanup.test.js` only (plus `ai-agents/sprints/sprint-5.md`, the
  driver's, pre-existing). Volume detached and deleted.

**Not measured, stated as such:** CI. This loop does not push and no GitHub Actions run ID was observed
— the Linux/CI green remains **inferred, not measured**.

---

### Round 2 response — F1, F2, F3 (coder-owned, 2026-08-13)

Comment-fix worker, spawned by `/fkit-sprint-ship-loop` under the declared-approval marker.
**All three findings re-measured first-hand before a word was written** — the reviewer's round-2 table
was treated as a claim, not a fact. This is the third round in which a sentence in this comment has
been contradicted by measurement, so nothing below is reasoned; each line has a run behind it.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| F1 | **CORRECT** (and my earlier sentence was backwards) | Defect — false rationale in a source comment | Rewrote the item-2 "control" clause. It now says the per-line assertion's discriminating power is **intrinsic**, that with no control line the per-line assertion **and** the broad match both red under C5, and that the control line is measurably what makes the **broad** match stop detecting C5 — hence why the per-line assertion is the **sole** detector. | ✅ done |
| F2 | **CORRECT** | Defect — ambiguous exactly where ambiguity costs | *"Neither can change the verdict"* → *"Neither can turn a refusal into a deletion"*, plus the measured counter-case: a symlinked `.fkit` makes `orphan_contained` refuse the same line for a **different reason**, before the `*settings*` guard is reached, so the lockdown-state sentence never renders. | ✅ done |
| F3 | **CORRECT** — necessary but not sufficient, as stated | Defect — an insufficient floor in a ⛔ standing instruction | Floor tightened to *"name the refusal reason AND bind it to the line — **IN ONE RENDERED LINE**"*, with the measured reason (a cross-line regex meets the old floor literally and is a false pass). | ✅ done |

**Severity, assigned by me:** F1 and F3 are the ones that matter — F1 because a false mechanism in a
comment is what produced this whole task twice already, F3 because an insufficient floor sits inside a
⛔ instruction a future maintainer is meant to obey literally. F2 is a precision fix in the one place
the reason-vs-reason distinction is load-bearing. **All three are record defects. Zero behavioural
defects; none introduced.**

#### Evidence produced this round (first-hand, scratch copies only)

Scratch = a `tar` copy of the working tree with `.git`/`node_modules` excluded; the repo's
`claude/fkit-claude-init.sh` was **never edited** (`efdb56b1…6028a` before and after; `git diff --
claude/` empty). Filesystem coverage this round: **case-INSENSITIVE macOS only** — the
both-filesystems claims rest on the round-1 and process-review measurements already recorded above.

**F1 — measured, C5 regression live (`lc="$(… tr …)"` → `lc="$line"`), harness replicated directly so
BOTH assertions could be evaluated on the same stderr rather than stopping at the first red:**

| Scenario | stderr refusal lines | broad `/lockdown state/` | per-line on `.Fkit/Settings` |
|---|---|---|---|
| cased line **only**, no control | `.Fkit/Settings — refused: still referenced in fkit's own sources` | **RED** | **RED** |
| shipped two-line fixture | same, **plus** `.fkit/settings — refused: fkit will never delete lockdown state` | **PASS** | **RED** |

So the control line **does not** confer the per-line assertion's discriminating power (it reds either
way); it is what makes the **broad** match stop detecting C5. **The reviewer's F1 is exactly right and
my earlier sentence had the causality backwards.**

**F2 — measured, guard INTACT (unmutated tree), `.fkit` a symlink to a sibling real directory,
`orphan-targets` = `.fkit/settings`:**

```
    .fkit/settings — refused: '.fkit' is a symlink — fkit will not delete through one
```

`/lockdown state/` absent from stderr entirely; the per-line string absent; `coder.json` still on disk.
Real-directory control on the same tree renders `… — refused: fkit will never delete lockdown state`.
Mechanism confirmed by reading: `orphan_contained` is called at `claude/fkit-claude-init.sh:726`,
**before** the `*settings*` case at `:742-743`. **Refuse-vs-delete is unchanged (the reviewer's floor
is the right one); refused-AS-lockdown-state is not.**

**F3 — measured.** Replaced the loop body with a regex that names the reason and binds it to the line
but is allowed to span rendered lines
(`new RegExp(`${esc}[\s\S]*refused: fkit will never delete lockdown state`)`), on the C5-regressed
scratch tree: **23 tests / 23 pass / 0 fail, exit 0 — M2 reproduced by another route.** Probe discarded;
the shipped loop is byte-unchanged.

#### Required re-proofs after the edit

- **Comment-only, proved mechanically.** Both files stripped of `^\s*//` lines and compared:
  `diff` of the non-comment projections is **IDENTICAL**. Every one of the 25 changed lines is a `//`
  comment. No assertion, fixture, `mkdirSync` or `orphan-targets` byte moved.
- **M1 re-run against the POST-EDIT file**, C5 regression live, scratch tree: **exit 1, 23/22/1 — sole
  red at the per-line assertion** (now `:327`, shifted from `:312` by the added comment lines).
- **Unmutated control, post-edit file, clean scratch tree:** **exit 0, 23/23.**
- **`npm test` on the real repo: exit code 0**, captured with no pipe
  (`npm test > file 2>&1; echo $?`) — `tests 709 / pass 709 / fail 0 / skipped 0`,
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- `git diff --stat`: `test/orphan-cleanup.test.js` only (plus `ai-agents/sprints/sprint-5.md`, the
  driver's, pre-existing).

⚠️ **Line numbers shift again.** The sites cited in *Round 2* are pre-edit: `:270` → `:267-272`,
`:285-287` → `:290-299`, `:306-307` → `:318-322`, the per-line loop `:311-314` → `:326-329`, the broad
match `:301` → `:316`.

⚠️ **Not measured, stated as such:** (a) **CI** — this loop does not push; the Linux/CI green remains
**inferred**. (b) **The case-sensitive volume was not remounted this round** — a comment-only change
cannot alter filesystem behaviour, and the post-edit M1 red was re-proved on macOS, but the
*both-filesystems* wording in the comment rests on the earlier rounds' measurements, not on a re-run
here.

#### One thing I noticed and did NOT change (flagged, not fixed)

`:293-295` (post-edit) still reads *"a `*settings*` line — however cased, **whatever it resolves to** —
is refused FOR BEING LOCKDOWN STATE"*. F2 shows one resolution where that is false (a symlinked
parent). The sentence is scoped to what **this test's fixture** proves, the reviewer's final factual
check did not flag it, and re-touching unflagged text is scope creep — so I left it and am recording it
rather than deciding it. My F2 edit names the symlink case eight lines above, which is what a reader
would hit first.

> **RESOLVED in round 3 by owner ruling (*"Fix it, then final-check once"*, 2026-08-13).** The clause
> was corrected. See *Round 3 response* below.

---

### Round 3 response — the flagged summary clause (coder-owned, 2026-08-13)

**Scope: the one clause, comment-only.** Owner ruling relayed by the driver: fix it, then final-check
once. Nothing else touched; F1/F2/F3 left as corrected.

**Verdict: the clause was FALSE as written — CONFIRMED by measurement taken this round**, not carried
over. It was false in **two** ways, not the one I flagged.

**Before** (`test/orphan-cleanup.test.js`, pre-edit `:300-302`):

```
  // Proved on both kinds of filesystem: a `*settings*` line — however cased, whatever it resolves to —
  // is refused FOR BEING LOCKDOWN STATE (not incidentally, by containment or by naming nothing), is
  // announced, and the lockdown state is still on disk afterwards.
```

**After** (`:300-307`):

```
  // Proved on both kinds of filesystem, for the two lines this test seeds — both of which exist on disk
  // with no symlink anywhere in their parent chain: a `*settings*` line, however cased, is refused FOR
  // BEING LOCKDOWN STATE (named as that, on its own line — not refused incidentally), is announced, and
  // the lockdown state is still on disk afterwards. ⚠️ Those two conditions are the claim's limits, not
  // decoration — earlier text spells out both exceptions and both are measured: symlink a parent and
  // that line is refused by containment first, with no lockdown-state sentence for it at all; point a
  // `*settings*` line at nothing and it is still never deleted, but nothing is announced for it either.
  // Neither is a hole — the deletion is refused either way — and neither is what this test measures.
```

**Measurement backing the new wording — taken this round**, unmutated scratch copy of `claude/`,
macOS case-insensitive default `TMPDIR`, project = the test's own `makeResidueProject()` fixture:

| # | Fixture | Refusal text observed | `/lockdown state/` in stderr | `coder.json` |
|---|---|---|---|---|
| **M-A** | `.fkit` replaced by a **symlink** to a sibling real dir; list = `.Fkit/Settings` + `.fkit/settings` | `.Fkit/Settings — refused: '.Fkit' is a symlink — fkit will not delete through one`<br>`.fkit/settings — refused: '.fkit' is a symlink — fkit will not delete through one` | **false** | survives |
| **M-B** | list = `.nowhere/settings` (names nothing) | *(no refusal line at all — stderr silent)* | **false** | survives |
| **M-C** | the test's fixture **exactly** (baseline) | `.Fkit/Settings — refused: fkit will never delete lockdown state`<br>`.fkit/settings — refused: fkit will never delete lockdown state` | **true** | survives |

Both falsifiers are structural in `claude/fkit-claude-init.sh`, read this round:
`orphan_contained` runs at `:727` — **before** the `*settings*` case at `:742-750` — so a symlinked
parent short-circuits with its own reason (`:680`); and the lockdown refusal is emitted only under
`if [ "$exists" = 1 ]` (`:745`), so a `*settings*` line naming nothing is skipped in silence.

⚠️ **Precision note, so this is not overstated.** M-A shows `lockdown state` absent from stderr
**entirely**, but that is a macOS artefact — both lines collapse onto the one symlinked `.fkit`. On a
case-sensitive filesystem `.Fkit/Settings` is a distinct real directory and would still be refused as
lockdown state, so the string would be present. The new wording therefore scopes the exception to
**that line**, not to stderr as a whole — which is true on both kinds of filesystem. The pre-existing
"never renders at all" sentence eight lines above is already line-scoped and stays correct.

**Also not overstated in the other direction:** neither exception is a hole. In both, the deletion is
still refused and the lockdown state still survives (`coder.json` present in every row). This is a
**scoping correction to a comment**, not a defect in the guard. No product change, no `NEEDS-DECISION`.

**"however cased" was left standing** — it is a claim about the guard's `tr`-plus-glob, already
established by the paragraph above, and the fixture measures two casings. Only "whatever it resolves
to" was measured false, so only it was removed.

##### Re-proofs after the edit

| Check | Result |
|---|---|
| `//`-stripped projection diff, pre-edit vs post-edit working tree | **IDENTICAL** — no executable line changed this round |
| **M1** — C5 regression (lowercasing removed, `:742` on a scratch copy) | **RED at the per-line assertion**, `tests 23 / pass 22 / fail 1`, exit **1** — unchanged detector |
| **Full `npm test`** (no pipe; `$?` captured directly) | `tests 709 / pass 709 / fail 0 / skipped 0`, **exit 0**; `prove-red.sh` hard gate PASSED, all 15 mutants red |

##### Bounds honoured

Comment-only. No assertion, fixture, `mkdirSync` or `orphan-targets` content touched; the per-line
assertion and the broad `/lockdown state/` match both intact. No meta-test. No product change —
`claude/fkit-claude-init.sh` and `claude/fkit-claude.sh` mutated on **scratch copies only** and the
repo copies are clean. Reviewer text untouched. `plan.md` untouched. No commit, no push.

---

## Accepted residuals (shared, do-not-re-litigate)

- **The widening's written rationale was wrong; the widening is kept anyway (0283/R2)** —
  **What:** the fix keeps both `orphan-targets` lines, **and the source comment has been corrected** to
  state the measured truth rather than the false rationale.
  **Why (structural):** the widening's real value is not the stated one — it is that a lowercase control
  line alongside the cased one is what lets the per-line assertion distinguish "refused **as lockdown
  state**" from "refused for some other reason". Rejected alternative: drop the widening (would remove
  the control line the per-line assertion needs).
  **Re-raise only if:** someone proposes removing the `.fkit/settings` control line, **or** cites
  "the survival assertion is load-bearing" as justification for weakening any other assertion.

  > ⚠️ **AMENDED 2026-08-13 — one clause of this residual was superseded by a later owner ruling; the
  > original is preserved here so the reversal is auditable and nobody re-derives it.**
  > As first written by the reviewer, this residual read: *"the comment at `:275` stands as written,
  > with the corrected rationale recorded here and in `worklog.md` rather than in the source comment"*,
  > citing owner ruling *"Accept as-is, record the corrected rationale (Recommended)"* (2026-08-13,
  > taken with the disproof in view), and listing *"re-word the comment (a source edit for a claim
  > already corrected in the ledger)"* among its **rejected** alternatives.
  > **The owner then ruled the other way**, 2026-08-13 via `AskUserQuestion` in the driver session,
  > **after** the review: *"Correct the comment too (Recommended)."* The rejected alternative became the
  > instruction. **The earlier "Accept as-is" ruling still governs the code**: no assertion, fixture or
  > executable line changed — only the comment. Both rulings are therefore satisfied, and the residual
  > above is restated to match what is now on disk. ⛔ Do not read the superseded clause as license to
  > revert the comment.

- **`:296` pins the full rendered refusal line, uniquely in this corpus (0283/R1, R3)** —
  **What:** the assertion stays exactly as written — `<path> — refused: fkit will never delete lockdown
  state`, em dash and all — despite being the corpus's only whole-line pin.
  **Why (structural):** it is the **only** thing standing between the suite and a silent false pass
  (M1 red → M2 green). Any looser form must still **name the refusal reason and bind it to the line**,
  which buys almost nothing over the current form while risking exactly the M2 hole. Rejected
  alternatives: a semantic-fragment matcher like the other 34 wording sites (cannot distinguish the
  refusal reason per line); deleting it as "already covered elsewhere" (measured false — it is not
  covered anywhere).
  **Re-raise only if:** the refusal message text in `claude/fkit-claude-init.sh:746` is deliberately
  changed — then this assertion is *expected* to go red and must be updated in the same commit, never
  loosened. ⛔ **Never loosen it to a matcher that does not name the reason.**

  > **Added by the coder 2026-08-13 (additive — nothing above rewritten).** This residual is now also
  > carried **in the source**, as a ⛔ comment immediately above the loop. That comment is part of the
  > protection, not noise: owner-ruled *"Ledger note is enough"* on the question of building a
  > guard-for-the-guard — ⛔ **no meta-test was built, and none should be** — with a short in-file
  > warning explicitly allowed. Treat a proposal to delete that comment the same as a proposal to
  > loosen the assertion.

  > **Added by the coder 2026-08-13, round 2 (additive — nothing above rewritten). ⛔ THE FLOOR IN THIS
  > RESIDUAL IS INSUFFICIENT AS WRITTEN.** *"Name the refusal reason and bind it to the line"* is a
  > correct **minimum** and is **not sufficient** (review round 2, F3). **Measured:** a replacement
  > meeting it literally with a regex allowed to span rendered lines
  > (`${line}[\s\S]*refused: fkit will never delete lockdown state`) went **23/23 GREEN with the C5
  > regression live** — mutant M2 by another route. **The floor is: name the refusal reason and bind it
  > to the line, IN ONE RENDERED LINE.** The source comment now carries the corrected floor; this note
  > corrects the ledger to match so a future round cannot read the shorter form here as the real bar.

- **The broad `/lockdown state/` match at `:292` stays (0283/R4)** —
  **What:** the original CI-flagged assertion is kept alongside the per-line one.
  **Why (structural):** it is the assertion that fires under **whole-guard removal** (M4). It is
  redundant *only* while `:296` keeps naming the reason. Rejected alternative: delete it as redundant
  (Codex's recommendation) — safe today, but it removes the second layer at the exact moment someone
  also loosens `:296`.
  **Re-raise only if:** `:296` is ever strengthened to cover whole-guard removal independently **and**
  the coupling is documented at both sites.
