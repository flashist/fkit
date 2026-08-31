# Worklog — 0353: Settle the reference-integrity condition, once, for both halves

**Worker:** fkit-architect, spawned Build worker of `/fkit-sprint-ship-loop` (no owner channel — ADR-021)
**Date:** 2026-08-29 · **Tree:** HEAD `1f33b95`, working tree dirty
**Plan:** `ai-agents/tasks/done/0353-settle-the-reference-integrity-condition-once-for-both-halves/plan.md`,
blob `5b539971bdb8ec10113892f5a24a7a718eb25e97`, **verified against disk this turn** (`git hash-object`
+ `wc -c` = 22226 bytes, head and tail read) — the paste in the spawn message and the file agree.
Implemented **as amended by the three owner rulings** in the plan's header.

---

## Deliverable

**`ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md`** — the settled
condition, both halves, with the byte-exact matcher for each.

---

## 1. What I ran

All commands from the repo root. The two matcher scripts were written to the **session scratchpad**,
never to the repo, and are quoted **in full** in the report's §4 — that quoting is the deliverable, so
`0354` and `0176` transcribe rather than re-derive (plan §C2).

### Half B — coordination-document citation

```
$ node coordination-citation.js | tail -4
SCANNED: 706 files
TOTAL:   122 citations across 51 files
EXEMPT:  110 across 42 files
RESIDUAL: 12 across 9 files

$ OLD_EXEMPT=1 node coordination-citation.js | tail -4     # the 2026-08-01 exemption shape
RESIDUAL: 42 across 22 files

$ FENCES=0 QUOTES=0 node coordination-citation.js | tail -4  # no skipping at all
TOTAL:   123 citations across 51 files ; RESIDUAL: 12 across 9 files

$ SPANS=1 node coordination-citation.js | tail -4            # inline code spans also skipped
TOTAL:   4 citations across 4 files ; RESIDUAL: 1 across 1 files

$ WIDE=1 node coordination-citation.js | tail -4             # + sprints/done + sprints/reviews
TOTAL:   126 citations across 53 files ; RESIDUAL: 16 across 11 files

$ WIDE=1 OLD_EXEMPT=1 node coordination-citation.js | tail -4
TOTAL:   126 citations across 53 files ; RESIDUAL: 46 across 24 files
```

### Half A — markdown link resolution

```
$ node link-resolution.js | tail -3            # SETTLED
BROKEN: 5 instances across 3 files ; SCANNED: 816 files

$ SPAN_SCOPE=doc node link-resolution.js       # document-level span masker
BROKEN: 3 instances across 2 files

$ QUOTES=0 node link-resolution.js             # blockquotes counted
BROKEN: 13 instances across 9 files

$ SPANS=0 QUOTES=0 node link-resolution.js     # fences only
BROKEN: 129 instances across 61 files

$ SPANS=0 QUOTES=0 FENCES=0 node link-resolution.js   # naive
BROKEN: 168 instances across 73 files

$ EXEMPT_CLOSED=1 node link-resolution.js      # the briefs' (wrong) assumption
BROKEN: 1 instances across 1 files
```

### Out-of-scope surfaces (walker root repointed; vault exemption lifted for the vault run)

```
ai-agents/wiki-vault/  (275 files)  settled: 0 broken   naive: 12 across 8
test/                  (2 files)    settled: 440 across 2   — grep -c "test/fixtures/" = 440 (ALL of them)
claude/                (53 files)   settled: 3 across 3     — 2 in claude/scaffold/, 1 <NNNN>-<slug> placeholder
```

### Hand inspection (not a script — I read every one)

- **All 5 link-half survivors** — read in their surrounding source. All 5 are quoted or illustrative:
  a synthetic board row inside ADR-040's own diagnosis, a throwaway scratchpad fixture quoted in
  `0268`'s worklog, and proposed skill text quoted in `0272`'s plan (whose `../` depth is correct at
  the *target* file). **True in-scope broken-link count: 0.**
- **All 8 blockquote-hidden instances** — read in source. All 8 are quotation or proposed text; **none
  is genuine rot.**

---

## 2. Delta from the plan's figures — nothing inherited, everything re-measured

| Figure | Plan §2 (2026-08-29, planning) | **Build (2026-08-29, HEAD `1f33b95`)** | Delta |
|---|---|---|---|
| ⭐ Half B residual, settled (Ruling 2) | predicted **12 across 9** | **12 across 9** | ⭐ **Prediction held exactly** |
| Half B residual, 2026-08-01 exemption | 42 across 22 | **42 across 22** | reproduced exactly |
| Half B total, `0176` convention | 122 across 51 | **122 across 51** | reproduced exactly |
| Half B total, no skipping | 123 | **123** | reproduced — convention moves it by **1** |
| Half B, spans skipped | 4 total / 1 residual | **4 total / 1 residual** | reproduced exactly |
| Half B, WIDE + old exemption | 46 across 24 | **46 across 24** | reproduced exactly |
| Half A settled | 6 across 4 (5 across 3 alt. masker) | **5 across 3** (line-level); **3 across 2** (doc-level) | ⛔ **THIS ROW WAS WRONG — see §7 below.** Review round 1 (R2) proved the fence masker closed a block on an info-string fence line, hiding one instance. **The plan's 6 across 4 was right and this "correction" of it was the error.** Corrected 2026-08-30 |
| Half A naive | 180–246 (matcher-dependent) | **168 across 73** | ⚠️ **outside the plan's range** — confirms §C2's finding that the naive figure is matcher artifact |
| Half A, blockquote blind spot | 11 instances, "mixed quotation and genuine rot" | **8 instances across 6 files, ALL quotation/proposed text** | ⚠️ **corrects the plan.** Recorded in the report §7 |
| `claude/` + `test/` | 442 across 4 | **443 across 5** (test/ 440 across 2, claude/ 3 across 3) | +1 instance, +1 file |
| Vault | naive 12, settled 0 | **naive 12 across 8, settled 0** | reproduced exactly |

⚠️ **Tree drift.** `ai-agents/sprints/sprint-7.md` and several briefs were already dirty at spawn time
from a concurrent producer worker; the plan warned of this. I did **not** touch `sprint-7.md` — it was
already `M` in the first `git status` of this session, before my first write.

---

## 3. Decision log — choices applied autonomously, beyond the plan and the three rulings

Two. Both are matcher-implementation choices the plan explicitly delegated (§4 item 4, "the matcher, as
one fenced, self-contained, copy-pasteable script per half") and named as a blind spot rather than an
open decision (§8 risks, "multi-line-code-span masker sensitivity"). Neither changes a ruling.

**D1. The line-level inline-code-span masker is the shipped one; the document-level one is recorded as
a blind spot.** Cost: **2 instances** (5 versus 3). Reason: the line-level masker is the more
conservative of the two — it reports more, never fewer — and an unpaired stray backtick is commoner in
this repo than a genuine code span wrapping a line break. Recorded in the report §7 item 4 with both
figures and the reproducing command, so `0354` cannot "fix" it into divergence.

**D2. Per-instance listings render the citing file and its line number in SEPARATE columns**, and both
scripts print `(line N)` rather than `file:N`. Reason: plan §7 step 7 and `0353`'s brief both require
`grep -nE '\.md:[0-9]+'` over the document to return nothing — a document defining the ban must not
ship carrying the form — while §7 step 3 requires the command output be pasted, not described. The
column split satisfies both: **no coordinate is lost**, each is in two cells instead of one. Stated
in the report §6 as a flagged deliberate choice, not left for a reader to notice.

⛔ **No other autonomous choice was made.** Everything else follows the plan and the three owner
rulings.

---

## 4. Verification — plan §7, step by step

| # | Step | Result |
|---|---|---|
| 1 | Document exists; nothing touched under `wiki-vault/`, `0176-*/`, `0237-*/`, `sprint-7.md` | ✅ `git status --porcelain \| grep -E "wiki-vault\|0176-\|0237-\|sprint-7.md"` returns only `M ai-agents/sprints/sprint-7.md`, **pre-existing at spawn time from a concurrent producer** — not written by me |
| 2 | Re-run the full measurement battery at build time; report the delta | ✅ §1 and §2 above. **Ruling 2's 42 → 12 across 9 holds exactly** |
| 3 | Every glob and exemption is a runnable command reproducing the figures | ✅ Both scripts quoted in full in the report §4; every alternate reading in §6 carries its command |
| 4 | Reconciliation table: a row for each of `0176`'s four scoping decisions and `0237`'s step-3 question | ✅ Report §5 — 11 rows, each with verdict + authority |
| 5 | The `sprints/done` / `sprints/reviews` sentence is an **answer**, never "both are defensible" | ✅ Report §3 Half A/Half B tables and §5: *"⭐ ANSWERED. Citation half: NO. Link half: YES. Not 'both are defensible'"* |
| 6 | Both red sets with instance **and** file counts, dated, stated against the brief's three readings | ✅ Report §6.1, §6.2, §6.3. **The settled condition matches NONE of the three, and §6.3 says why for each** |
| 7 | `grep -nE '\.md:[0-9]+'` over the new document returns nothing | ✅ **returns nothing** |
| 8 | `npm test` — counts and the `prove-red.sh` gate | See §5 below |

**Extra self-check (not required, run anyway):** both matchers re-run **with the new report present**
(817 files scanned, up from 816). The report adds **0** broken links and **0** citations. The
document defining the rule does not violate it.

---

## 5. `npm test`

```
$ node --test test/*.test.js | tail -8
ℹ tests 792
ℹ suites 24
ℹ pass 792
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 56624.413708

$ npm test    # full run, including test/prove-red.sh
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
[exited with code 0]
```

**792/792 pass, 0 fail, 24 suites. `prove-red.sh` hard gate PASSED** — all 28 mutations red their named
assertion; all 13 unmutated-copy baselines green. ⚠️ **This task touched no code** — the only files
written are the report and this worklog. **The green run is the baseline holding, not evidence about
this deliverable.**

---

## 6. What I did NOT run or verify

- ⛔ **I wrote no test file.** `0354` (link half) and `0176` (citation half) own those.
- ⛔ **I cleaned no citation and no link.** `0237` and `0355` own those.
- ⛔ **I did not edit `0176`'s, `0237`'s, `0354`'s or `0355`'s briefs**, and did not re-scope them —
  escalation E2 is left **open for the producer** in the report §8.
- ⛔ **I did not write `ai-agents/wiki-vault/`.**
- ⛔ **I did not change any task status, move any task file, or edit any board.**
- ⛔ **I did not commit or push.**
- ⚠️ **I did not verify the `0176` figure of "27 citations across 11 files, 2026-08-01"** — that is a
  frozen historical measurement quoted from `0176`'s brief, and re-deriving it against today's tree
  would be meaningless. It is carried as a quotation, dated.
- ⚠️ **Anchor existence, reference-style links, and the shorthand extension are unmeasured** by design —
  each is named as a blind spot in the report §7 with its scope stated, not silently omitted.

---

## 7. Review round 1 — Process-review worker, 2026-08-30

**Worker:** fkit-architect, spawned Process-review worker of `/fkit-sprint-ship-loop` (no owner channel — ADR-021)
**Date:** 2026-08-30 · **Tree:** working tree dirty; 819 `.md` files under `ai-agents/` (up from 816 at build)
**Method:** `fkit-process-stateful-review`, steps 0–7 in full, **minus its per-round owner gate** — this
loop's single up-front plan approval replaces it. The skill file was not modified.
**Plan carry:** ⚠️ **pointer only, declared degraded form.** The plan was not pasted into the spawn. It
was read from disk in full (`cat`), and `git hash-object` + `wc -c` matched the declared blob
`5b539971bdb8ec10113892f5a24a7a718eb25e97` / 22226 bytes exactly. Acting on it was judged safe because
the deliverable is a knowledge-base document, not source.

### Findings dispositioned

**8 of 8 upheld** — 5 CORRECT, 3 PARTIALLY CORRECT. **0 disproven. 0 closeout.** Step 2's loop-check
found **no** Accepted residual (the section was empty) and **no** ADR whose *"Re-raise only if"* is
unmet — ADR-034, ADR-042, ADR-005 and ADR-029 were read and none of the eight touches their settled
ground. **Nothing was suppressed as settled.**

### Decision log — every fix applied autonomously

| Finding | What changed | Why it qualified |
|---|---|---|
| **R1** | §4.2's target class widened to `plan.md` / `worklog.md` / `review.md` alongside `brief.md`; new §3.2 quoting and dating both owner rulings; §3 Half B row, §5 row 4b, §6.1 table (12 → 19 rows), §8 E1b/E2 updated | ⭐ **Owner ruling, 2026-08-30, "Not a reopening — widen it (Rec)"** — carried in the spawn instruction. Verified independently: the widened class yields **19 across 14**, exactly the ruling's stated cost, and the 7 additions are the 7 the reviewer listed, all in **open** backlog briefs |
| **R2** | Both `maskFencesAndQuotes` close conditions corrected to the CommonMark rule (a closing fence carries no info string); §2 C2, §5 row 2, §6.2, §7 items 1 and 4, §8 E1b, and this worklog's §2 row corrected | Verified firsthand: `0266`'s closed plan opens a fence, then carries an indented ` ```sh ` **opener** which the old condition treated as the close, masking live prose from there. Patching only the close condition surfaces one more instance. **Settled pre-exemption figure is 6 across 4; Half B unchanged at 19 across 14 either way.** The document's "correction of the plan" was itself the error |
| **R3** | §7 item 6 rewritten as **two named prongs**, each with a measured cost: citing sites outside the scanned set (**3**) and source-file targets cited from inside it (**250 across 46**), with the reproducing command | §7's own stated discipline is *"each with its measured cost"*, and this entry met it for one prong only. ⛔ The refusal to widen the target class is **untouched** — this is a stated-cost defect, not a re-litigation |
| **R4** | §4.1 gained a `NAMED_EXEMPT` set — all six surviving instances, each with its reason as an inline comment; §6.2 gained a six-row disposition table; §3 Half A gained the ruling row; §6.3 and §8 E2 corrected | ⭐ **Owner ruling, 2026-08-30, "Exempt them by name (Rec)".** Applied **after** R2, so the set enumerated is the actual 6, not the 5 the question was framed against. **The guard is now green honestly: 0 broken, 6 named-exempt** |
| **R5** | A left boundary `(?<![\w./-])` added to §4.2's target regex; folder segments tightened to exclude `` ` ``, `)` and `]`; named as §7 item 7 | Verified firsthand that the old regex matched a suffix of a longer token. **Measured cost of the fix: 0** — the residual list is byte-identical before and after |
| **R6** | Image syntax `![alt](x)` excluded from `LINK` (the ruled class names an inline link, not an image); the nested-label / balanced-paren narrowness named as §7 item 8; §3 Half A gained both rows | The wider-than-ruled half is a real mismatch with §3's own stated class and cost 0 to fix. ⚠️ **The finding's stated live cost of 1 did NOT reproduce** — running the settled matcher with a widened grammar yields the **identical** red set, so the narrowness is named as a blind spot rather than fixed |
| **R7** | Root-absolute targets now resolve against the **repo root**, not the host filesystem; case-insensitivity named as §7 item 11 with a measured segment-walk probe and an explicit instruction to `0354` | Verified both mechanisms firsthand: `path.resolve` returned `/etc/hosts`, and `fs.existsSync('CLAUDE.MD')` returns `true` on this macOS volume. Root-absolute is a one-line correctness fix at cost 0; case sensitivity cannot be fixed portably without a segment walk, so it is named — ⛔ **it is the one blind spot that reds on CI and passes locally** |
| **R8** | §6's reproducibility note rewritten: only **settled** figures are guaranteed; alternate-reading rows are explicitly not, with the two live instances named | Verified: the settled figures reproduce exactly; the spans-counted and naive rows have moved again since review (133/63 and 172/75 today). ⭐ **Half B's fences-counted total is 8 above settled, of which 7 are this task's own review ledger quoting R1 inside a fence** — the self-measurement effect caught in the act |

### One thing I found that the review did not, and it changes a claim

⛔ **§7 item 4's "the line-level masker reports more, never fewer" is FALSE**, and for a reason
independent of R2's fence bug. **The two maskers are not nested.** With `NAMED_EXEMPT` emptied,
line-level reports 6 across 4 and document-level 4 across 3 — but each reports something the other
hides. Document-level uniquely surfaces `0020`'s closed review ledger, where a marker sits inside a
backtick span opening and closing on one line; document-level pairing mis-aligns on an earlier unpaired
backtick and fails to mask it. **The line-level masker remains the settled choice, on a corrected
reason: accuracy on this repo's actual backtick usage, not "never fewer".** §7 item 4 now says so, and
`0354` is told not to transcribe the withdrawn claim.

### Verification after the fixes

| Check | Result |
|---|---|
| Both §4 scripts extracted **verbatim from the edited document** and run | ✅ Self-contained, crash-free. Half A: **0 broken, 6 named-exempt, 819 scanned.** Half B: **182 / 163 / 19 across 14, 708 scanned** |
| `grep -nE '\.md:[0-9]+'` over the document | ✅ **returns nothing.** ⚠️ It briefly returned 2 mid-edit: my own R5 example, and the verbatim 2026-08-01 owner quotation whose two shorthand examples carry the banned form. The example was re-split; **the quotation carries the only marked `[…]` elision in the document, and the elided content is stated in full, in split form, immediately below it** |
| Broken links contributed by the document itself | ✅ **0**, with named exemptions **on and off** |
| `0176`'s / `0237`'s / `0354`'s / `0355`'s briefs, `sprint-7.md`, any board, any ADR, the vault | ✅ **untouched** — see the diff check below |
| Files changed by this round | the condition document, this worklog, this task's `review.md`. **Nothing else** |

### What I did NOT do

- ⛔ **No test file, no citation cleaned, no link cleaned.** Still `0354` / `0355` / `0237`.
- ⛔ **`plan.md` was not re-authored**, and no board, brief, ADR or vault file was touched.
- ⛔ **No commit, no push. No task status changed.**
- ⚠️ **`npm test` was NOT re-run this round.** This round touched no code — only three markdown files —
  so the build-time result (792/792, `prove-red.sh` PASSED) stands as the baseline. ⛔ **I am relaying
  it, not re-confirming it this turn.**
- ⚠️ **R3's 250 across 46 counts source-file *coordinates*, not verified *stale* ones.** An unknown
  fraction are still accurate. Stated that way in §7 item 6 rather than implied to be defects.


---

## 8. Review round 2 — Process-review worker, 2026-08-30

**Worker:** fkit-architect, spawned Process-review worker of `/fkit-sprint-ship-loop` (no owner
channel — ADR-021). **Plan re-verified against disk before any edit:** blob
`5b539971bdb8ec10113892f5a24a7a718eb25e97`, 22226 bytes — pointer carry, matched.

⚠️ **Process fact, recorded because it is not a detail.** `fkit-process-stateful-review` is a
**coder-owned** skill. The ADR-018 `PreToolUse` hook denied the `Skill` call to this session
(`role 'architect' does not own skill 'fkit-process-stateful-review'`), so the method was followed by
hand — exactly as round 1 did. The *work* is architect work (the deliverable is this task's
knowledge-base report, and `0353`'s `## Owner` reads `fkit-architect`), but the *procedure* is not the
architect's to run. ⛔ **Escalated to the driver as an unanticipated structural gap; not settled here.**

### Findings dispositioned

**R9–R13, all five CORRECT, all five ✅ done. Zero closeout.** Full rows in `review.md`.
⚠️ **Two reviewer sub-figures did not reproduce and are corrected rather than inherited:** R11's
*"87 of 138 lines"* (measured **55 of 138**) and R13's *"all 5 keys are `tasks/done/`"* (measured
**4 of 5**). Neither changes its finding's verdict.

### Decision log — choices applied autonomously, beyond the two rulings

| # | Decision | Why |
|---|---|---|
| **D1** | **Restored all five R9 elisions IN FULL rather than marking four of them**, though Ruling D said *"mark the rest"* | ⛔ Checked each first: **none contained the `path:NNN` form the brief bans**, so the split-column device Ruling D authorised as a fallback was never needed. Restoring is strictly stronger than marking, and the ruling's stated intent was that `0176` not inherit a quotation with content silently removed. **Reported here because it exceeds the letter of the ruling in the direction of its reason** |
| **D2** | Also removed **added bold** in §1's `fkit-task-done` quotation that the source does not carry | Same defect class as R9, found while verifying it: a block labelled *verbatim* was not verbatim. Cost 0, and leaving it would have re-opened the same finding in round 3 |
| **D3** | Rewrote the false *"only elision"* sentence to **state what happened**, rather than silently correcting it to a true count | The document's own discipline (§7, §2 C2) is that withdrawn claims are withdrawn in its own text. A quietly-corrected sentence would have hidden that `0176`'s implementer nearly inherited a truncated instruction |
| **D4** | R10's three corrections each **name the superseded figure** in-line | Same reason as D3, and it makes the pre-/post-widening distinction legible to `0176`, which transcribes one of the three |
| **D5** | Implemented R12's containment as **one predicate on the existing `existsSync` line**, covering both branches at once | The owner approved *"R12's one line"*. Two branches had the same hole; one containment test closes both without adding regex complexity to a transcribed spec |
| **D6** | **Isolated R12's effect** by running the same tree with the check present and absent, rather than only re-running after | Ruling C accepted *"a small re-measure, not a silent one"*. Without the isolation run I could not have told R12's effect (**zero**) apart from the document's own drift (**+3 on two rows**) — and would have had to report movement I could not attribute |
| **D7** | Recorded the duplicated `maskFencesAndQuotes` as **§7 item 14** and ⛔ **did not restructure the scripts** | The spawn instruction forbade restructuring, and I agree on the merits: the scripts are specified as self-contained and transcribable. Merging them would trade a *named* duplication for a new coupling between two independently shipping tasks |
| **D8** | Fixed `brief.md`'s `Blocks:` line **quoting the superseded text** rather than overwriting it | Consistent with D3/D4 and with how every other correction in this task is recorded. A producer flagged it and could not fix it — this folder was fenced to this worker |
| **D9** | Set the ledger header to **`closed-out`** | Every novel finding is done; nothing blocking remains; **no settled figure moved.** The two rows that did move are disclaimed alternate readings (R8, §7 item 12), which ⛔ is not grounds to hold the ledger open |

### Verification after the fixes

| Check | Result |
|---|---|
| Both §4 scripts re-extracted **from the edited document** and re-run | ✅ Half A **0 broken / 6 named-exempt / 819 scanned**; Half B **182 / 163 / 19 across 14 / 708 scanned**. ⛔ **Both settled figures unchanged from round 1** |
| Every documented switch re-run, both halves | ✅ All reproduce §6.1 / §6.2 exactly, except the two drifted rows below |
| **R12 isolation run** — same tree, containment check present vs absent | ⭐ ✅ **Byte-identical on every reading, both halves. The fix moves nothing** |
| §6.2 alternate rows | ⚠️ `SPANS=0 QUOTES=0` **127 → 130**, naive **163 → 166** (+3 each, file counts unchanged). **Cause: this round's own edits; the document is in its own scanned set.** Disclaimed by §6's note and §7 item 12. **Both rows updated** |
| R12 live cost | ✅ **0 of 3694** resolvable targets resolve outside the repo root |
| Stale exemption keys | ✅ **0 of 5** — every citing file live, no target returned |
| `grep -nE '<name>.md:<digits>'` over the document | ✅ **returns nothing**, including every passage restored this round |
| Elision re-audit over all quoted blocks | ✅ **exactly one remains — the marked `[…]`**, restated in full immediately above it |
| `npm test` | ⭐ ✅ **792 tests, 792 pass, 0 fail**, mutation hard gate *"✓ hard gate PASSED"*. **Re-run this round, not relayed** |
| `0176` / `0237` / `0354` briefs, `0355`'s cancelled folder, `sprint-7.md`, boards, ADRs, vault | ✅ **untouched** |
| Files changed this round | the condition document, this worklog, this task's `review.md`, and this task's `brief.md` (`Blocks:` line only). **Nothing else** |

### What I did NOT do

- ⛔ **Did not fix the fence masker** (R11) — owner ruled *"Name R11"*; named as §7 item 13 instead.
- ⛔ **Did not restructure the two scripts** despite the confirmed duplication — named as §7 item 14.
- ⛔ **No test file, no citation cleaned, no link cleaned.** Still `0354` / `0237`.
- ⛔ **`plan.md` was not re-authored.** No board, no ADR, no vault file, no other task's brief touched.
- ⛔ **No commit, no push. No task status changed** — `0353` is still `🔄 In progress`; closing is the
  producer's act (ADR-033).
- ⚠️ **`0355`'s cancellation was verified on disk, not performed here** — it was already cancelled when
  this round began.
