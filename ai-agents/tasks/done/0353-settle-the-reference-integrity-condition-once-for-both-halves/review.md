# Review — 0353

Task: `ai-agents/tasks/done/0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md`
File(s) under review: `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` (**1155 lines after round 2** — 1015 after round 1, 754 at review time); `<task-folder>/worklog.md`; and, this round, `<task-folder>/brief.md`'s `Blocks:` line
Status: **closed-out** — **round 1 answered 2026-08-30, 8/8 dispositioned, all ✅ done; round 2 answered 2026-08-30, 5/5 dispositioned (R9–R13), all ✅ done.** ⛔ **Nothing blocking remains and no finding is open.** Both settled figures are unchanged by round 2 — Half A **0 broken / 6 named-exempt**, Half B **19 across 14** — and the R12 code change moved **no** figure in §6 (verified by running the same tree with the check present and absent). Two reviewer sub-figures did not reproduce and are corrected in the rows below rather than inherited.
Coverage (round 2): **both reviewers measured** — the reviewer re-extracted both §4 scripts verbatim from the edited document and ran them at settled defaults plus every documented switch, an old-vs-new fence-state audit over all 819 scanned files, the §7 item 6 `TARGET` substitution, a widened link grammar, and a per-segment case-exactness walk over 3093 resolvable link occurrences; Codex (`gpt-5.6-sol`, `codex exec --sandbox read-only`, exit 0) independently piped both fenced bodies to Node from the repo root and ran its own fence, exemption-key, regex-mutation and case walks. Both reviewers reproduced both settled figures exactly.

> ⚠️ **Citation form in this ledger.** This file sits inside Half B's own scanned set
> (`ai-agents/tasks/*/*/*.md`). Coordinates below use the `(line N)` form, not `path:N`, so this
> ledger does not add to the residual it is reviewing.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | high | report §3 Half B (line 145), §4.2 (lines 436–441), §6.1 (line 577), §8 E2 (lines 739–740) | Half B's target class matches only `brief.md` inside a task folder, so it cannot see a citation of `plan.md` / `worklog.md` / `review.md` — **7 live, non-exempt instances across 5 files are missed**, and §6.1's "This is `0237`'s work list" is wrong by 7. `0237`'s own brief already names this exact axis as unsettled. |
| R2 | 1 | high | report §4.1 (line 273), §4.2 (line 449), §6.2 (lines 611, 628), §7 item 4 (lines 695–696), §2 C2 (line 96) | Both fence maskers close a fenced block on **any** same-character fence run, including one carrying an info string. CommonMark forbids that. Half A's settled figure is **6 across 4, not 5 across 3** — so the document's headline "correction of the plan" is itself wrong (the plan's 6 across 4 was right), and §7 item 4's "reports more, never fewer" claim is false. |
| R3 | 1 | med | report §7 item 6 (lines 706–710) | §7 promises "**Named blind spots — each with its measured cost**", but item 6 states the source-file target-prong gap as "**three**" citations sitting outside both scanned sets. Measured inside the Half B scanned set, non-exempt: **216 instances across 42 files**. The refusal to widen is settled; the stated cost is off by two orders of magnitude. |
| R4 | 1 | med | report §6.2 (lines 615–616), §8 E2 (lines 736–738) | "**The true in-scope broken-link count is 0**" conflates a manual intent classification with the executable condition. Under §3's own grammar all 5 (6 after R2) are in scope and the shipped matcher reports them red. `0355` is told its red set is false positives but is given **no disposition** — rewrite the illustrative text, exempt it, or baseline it. |
| R5 | 1 | low | report §4.2 (lines 436–441) | Half B's `TARGET` has **no left boundary** and its folder segments admit `)` and `]`, so it matches suffixes of larger tokens (`notai-agents/…`, `claude/scaffold/ai-agents/tasks/x/brief.md:9`) and malformed segments. Live cost today: **0**. Latent false-positive source, unnamed in §7. |
| R6 | 1 | low | report §3 Half A (line 134), §4.1 (line 313) | The `LINK` regex is **narrower** than the ruled "markdown inline link" class — nested/escaped labels, balanced-parenthesis destinations and parenthesized titles all escape it — and **wider** in one respect: it matches image syntax `![alt](x)`, which the ruling does not name. Live cost today: 1 nested-label link, 0 images. None named in §7. |
| R7 | 1 | low | report §4.1 (lines 330–337) | Half A's resolution is **host-dependent**: a root-absolute target (`[x](/etc/hosts)`) is resolved against the host filesystem, not the repo, and `fs.existsSync` is case-insensitive on macOS, so a wrongly-cased link passes locally and reds on case-sensitive CI. Live cost today: **0** on both (verified by both reviewers). Unnamed in §7 — and `0354` turns this into a CI test. |
| R8 | 1 | low | report §6 note (lines 528–532), §6.2 table (lines 624–633) | "**Alternate readings, each reproducible from §4.1**" is now false for **2 of 6 rows**: the spans-counted row reads **132 across 62** (documented 129 across 61) and the naive row **171 across 74** (documented 168 across 73), because the document added itself to its own scanned set. §6's reproducibility note guarantees only the *settled* figures, so the note is honest but the table header overstates. |
| R9 | 2 | med | report §3.2 (line 240), and the elisions at lines 191, 243, 244 + the unmarked paragraph drop between lines 192–194; also line 102 and the added emphasis at line 43 | "**This is the only elision anywhere in this document, and it is marked**" is **false**. Five further elisions sit inside blocks the document labels *verbatim*, four of them unmarked and unrestated — two inside owner ruling 1 itself, three lines below the claim. One drops a whole owner paragraph instructing `0176`'s implementer. ⭐ **The marked elision itself is correct and faithful — verified against source. The claim about it is the defect.** |
| R10 | 2 | med | report §3 Half B (lines 177, 178) and the §4.2 spec comment (lines 573–575) | Three Half B figures still carry **pre-widening** numbers and contradict §5 and §6.1 of the same document: "changes the total by 1 (**123 → 122**)" and "skipping takes the total from **122 to 4** and the residual from **12 to 1**" — measured now **190 → 182** and **182 → 6**, residual **19 → 1**. One instance sits **inside the §4.2 fenced block `0176` transcribes verbatim**. ⚠️ §6's reproducibility disclaimer does **not** cover these — they are in the normative "settled condition" table and in the specification's own comments, not in an alternate-reading row. |
| R11 | 2 | med | report §4.1 (line 355), §4.2 (line 563), §7 (no item covers it) | The corrected fence masker leaves `0266`'s closed `plan.md` with an **unterminated fence masking lines 127–138 to EOF**, and phase-inverts its middle: the mask differs from the old rule on **87 of 138 lines**. Separately, `^\s{0,3}` misses **7 list-indented fence blocks across 5 files**. ⭐ **Measured live cost: 0 links and 0 citations in either region** — but an unterminated fence is a silent false-negative surface in a spec two tasks transcribe, and §7 names 12 blind spots, none of them this. Raised by both reviewers (Codex found the indent half, the reviewer the EOF half). |
| R12 | 2 | med | report §4.1 (line 447), §7 item 11 (lines 944–945) | "**Root-absolute targets — FIXED** … resolved against the repo root, **never the host filesystem**" is overstated. `path.join` normalizes `..`, so `path.join(ROOT, '/../../../../../etc/hosts')` yields `/etc/hosts` and `fs.existsSync` returns **true** — the escape survives the fix. ⚠️ The **relative** branch has the identical hole and is named nowhere. §7 item 11 presents one unfixed mechanism; there are three. ⭐ **Measured live cost: 0** — 0 of 3093 resolvable targets resolve outside the repo root. Raised by Codex, verified independently. |
| R13 | 2 | low | report §4.1 (lines 414, 450), §7 item 9 (lines 927–932) | ⭐ **The `NAMED_EXEMPT` key is SOUND and §7 item 9 states its cost correctly** — see the round-2 evidence. Two gaps sit beside it, both uncovered: (a) nothing detects a **stale** key — a created target or a renamed citing file leaves a dead entry, and 5 of the 5 keys are `tasks/done/` paths in a repo that moves task folders routinely; (b) §7 item 9 tells `0354` to carry the list and the caveat but **never to assert `NAMED-EXEMPT === 6`** — the one cheap mechanism that turns the blind spot into a loud failure. A test asserting only `broken.length === 0` loses the signal. Raised by both reviewers. |

### Evidence — R1

Shipped target class (report §4.2), verbatim:

```
'ai-agents/(?:' + 'sprints/[^/\\s`)\\]]+\\.md' + '|tasks/[^/\\s]+/[^/\\s]+/brief\\.md' + '|wiki-vault/log\\.md' + '):\\d+'
```

Re-running the shipped masking and exemption with the target class widened to `(?:brief|plan|worklog|review)\.md`:

```
GAP residual (non-exempt, MISSED by the shipped guard): 7 across 5 files
  0149 brief (line 32)  -> ai-agents/tasks/done/0117-…/review.md:33
  0224 brief (line 38)  -> ai-agents/tasks/done/0195-…/worklog.md:188
  0274 brief (line 162) -> ai-agents/tasks/done/0265-…/review.md:10
  0348 brief (line 96)  -> ai-agents/tasks/done/0327-…/review.md:12
  0348 brief (line 97)  -> ai-agents/tasks/done/0188-…/review.md:27
  0350 brief (line 55)  -> ai-agents/tasks/done/0125-…/review.md:109
  0350 brief (line 56)  -> ai-agents/tasks/done/0125-…/plan.md:127
```

All 7 are in **open backlog briefs** — editable, not frozen. `12 + 7 = 19`, which is exactly `0237`'s
own figure; the file counts differ (14 versus 15), so treat the match as **suggestive, not proof**.

⭐ **What makes this a defect rather than a settled refusal.** `0237`'s brief states the reason its
figure is larger, by name:

> **The filing measurement's condition is broader than `0176`'s** — it counted `worklog.md` and
> `plan.md` as citable targets and accepted the citation both with and without the `ai-agents/` prefix.

The document retires the 19/15 figure (§8 E2) without addressing either half of that sentence. The
**second** half costs nothing — measured, the no-prefix form is **0 instances**. The **first** half
costs 7. The document's authority line for the target class cites "`0176` decision 4 / owner ruling 1,
2026-08-01 — NOT reopened", but owner ruling 1 ruled the reading **literal versus resolved shorthand**;
it did not enumerate filenames. These 7 are fully literal, full-path, `ai-agents/`-prefixed
coordinates — squarely inside "literal full path", squarely outside the shipped regex. Extending the
enumeration is **not** reopening the owner ruling.

⚠️ The document itself supplies the reasoning and applies it only to the *citing* side: §3.1 notes
`plan.md` is "a file type the 2026-08-01 ruling did not contemplate, because ADR-029 had not yet moved
plans inside task folders". The same is true of the *cited* side, and there it was missed.

### Evidence — R2 (raised by both reviewers)

The shipped close condition, both scripts:

```js
if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
```

`ai-agents/tasks/done/0266-retire-the-sprint-glob-…/plan.md` opens a fence at line 38; **line 41 is
`  ```sh`** — an indented *opener* for a nested block. The shipped masker treats it as the close, then
treats the real close at line 43 as a new opener, masking real content from line 44 on. The link at
line 49 is swallowed.

Patching only the close condition to the CommonMark rule (a closing fence carries no info string):

```
$ node link-resolution-fixed.js
… + ai-agents/tasks/done/0266-…/plan.md  (line 49)  ->  ../../../ai-agents/knowledge-base/decisions/adr-041-….md
BROKEN: 6 instances across 4 files
SCANNED: 818 files
```

Blast radius today: **1 file, 1 occurrence**; **Half B is unaffected** (12 across 9 either way).
Severity is high because this is the specification `0354` is instructed to transcribe verbatim, and
because it falsifies two stated claims — the §2/worklog "correction" of the plan from 6 across 4 to
5 across 3 (the plan was right), and §7 item 4's "it reports more, never fewer".

The 6th instance is the same class as the other five — proposed skill text whose `../` depth is
correct at its target — so **R2 does not disturb the finding that genuine unintended rot is zero.**

### Evidence — R3

Source-file coordinates (`claude/…` or `test/…` + `:N`) inside the Half B scanned set, non-exempt,
after the shipped fence/blockquote masking: **216 across 42 files** (largest: `sprints/backlog.md` 37,
`0232` brief 19, `0197` brief 13). ⚠️ **This is not a request to widen the target class** — that
refusal is settled (§5, `0176`). It is that §7's own discipline ("each with its measured cost") is
not met for this one entry, where every other entry states a measured cost or says plainly that it is
unmeasured.

### Verified and correct — no finding

Recorded so the coder is not asked to chase them:

- Both §4 scripts are **genuinely self-contained and crash-free as pasted** — extracted verbatim and
  run by both reviewers. Build's claim 4 holds.
- **Ruling 2's prediction held exactly**: `OLD_EXEMPT=1` → 42 across 22; settled → 12 across 9. Both
  reviewers reproduced it. Build's claim 1 holds.
- **10 of 12** alternate-reading rows reproduce exactly (the 2 exceptions are R8).
- The document **does not violate its own rule**: `grep -nE '\.md:[0-9]+'` and
  `grep -nE 'ai-agents/[^ )]*\.md:[0-9]+'` both return nothing, and the document contributes **0**
  broken links under the settled reading and under every alternate reading.
- **All 5 Half A survivors verified by hand** at their cited lines — ADR-040's illustrative board row,
  `0268`'s quoted scratchpad fixture, `0272`'s proposed skill text. All false positives, as claimed.
  Build's claim 3 holds.
- **§7's blockquote table is exact**: 8 instances across 6 files, and every row matches the measured
  `QUOTES=0` delta. Build's claim 2 (the 11 → 8 correction) holds.
- **Out-of-scope figures reproduce**: wiki-vault naive 12 across 8 / settled 0; `test/` 443 naive with
  440 settled in `test/fixtures/`; `claude/` settled 3.
- **Reference-style link definitions: 0 in scope** — §7 item 3's "cost measured as 0 today" holds.
- **No hedging.** `0237`'s step-3 question is answered as an answer, in three places, and the document
  explicitly rejects "both are defensible". Plan verification steps 4, 5, 6 and 7 all pass.
- **Forbidden surfaces untouched**: nothing written under `ai-agents/wiki-vault/`, `0176-*`, `0237-*`.
  `sprints/sprint-7.md` is modified by the concurrent producer, not by this task.
- **D2 (the split file/line columns) preserves the coordinate.** Both cells are present for every
  instance; the residual table is directly actionable. Judged adequate, not a degradation.

### Re-litigates settled decisions (suppressed)

**None.** Both reviewers respected the priming: no finding re-opens the inline-code-span divergence
between the halves, the closed-folder rulings of 2026-08-29, the `claude/` + `test/` exclusion, the
refused shorthand extension, or the absence of a test file. R3 and R5 touch settled refusals but
report a **stated-cost / boundary** defect, not the merits.

### Convergence call

**Round 1 — act, do not close out.** 8 novel findings, 0 re-litigation. Two are high and both would be
inherited verbatim by `0354` and `0176`, which this document instructs to **transcribe** rather than
re-derive: R1 leaves a hole in the citation guard and understates `0237`'s work list by 7, and R2 puts
a CommonMark-incorrect fence masker into the specification and inverts a claimed correction. R3–R8 are
accuracy and named-blind-spot completeness, each cheap to fix in place. **The document's structure,
principle, reconciliation and rulings are sound — every finding is a correction inside it, not a
rebuild of it.**

---

### Round 2 — verification pass, 2026-08-30

#### ⭐ Verified FIRST, because it is what the round existed to check

Both §4 scripts were re-extracted **verbatim** from the edited document (a parser that pulls the two
` ```js ` blocks, not a hand copy) and run from the repo root. **Both settled figures reproduce
exactly**, and Codex reproduced both independently:

| | Documented | Reviewer measured | Codex measured |
|---|---|---|---|
| Half A | 0 broken / 6 named-exempt / 819 scanned | ✅ identical | ✅ identical |
| Half B | 182 / 79 · 163 / 65 · **19 across 14** / 708 scanned | ✅ identical | ✅ identical |

**All six Half B alternate-reading rows also reproduce exactly** — settled, `OLD_EXEMPT=1`,
`FENCES=0 QUOTES=0` (190 / 80, 164 / 65, 26 across 15), `SPANS=1` (6 / 5, 5 / 4, 1 across 1), `WIDE=1`
(188 / 81, 25 across 16) and `WIDE=1 OLD_EXEMPT=1` (74 across 39). Half B has **zero** drift.

**Claims from the fix round, checked rather than accepted:**

- ⭐ **R6's correction of round 1 is RIGHT and round 1 was wrong.** Running the settled matcher with a
  widened link grammar (one level of nested label brackets, balanced-paren destinations, parenthesized
  titles) yields the **identical** red set — 6 across 4 with `NAMED_EXEMPT` emptied. **Live cost is 0,
  not the 1 both round-1 reviewers reported.** The fix round disproved its reviewers correctly.
- ⭐ **§7 item 4's disproof is CORRECT, and it is the sharpest thing in the round.** With
  `NAMED_EXEMPT` emptied: line-level **6 across 4**, document-level **4 across 3**; line-only set = 3
  (ADR-040's illustrative row + `0268`'s two fixture rows), document-only set = 1. That unique hit is
  `0020`'s closed review ledger at line 555, whose text is
  `` Verified: `➡️ Moved to [Sprint 10](../sprint-10.md) — deferred` passes through **untrimmed** `` —
  **exactly two backticks on the line**, so line-level pairs it correctly and document-level mis-pairs
  on an earlier unpaired run and exposes it. ⛔ **The maskers are genuinely not nested, "reports more,
  never fewer" is genuinely false, and the false positive is genuinely one the document-level masker
  creates.** Withdrawing the claim while keeping the line-level masker is the right call. Both
  reviewers confirmed this independently.
- ⭐ **R3's 250 across 46 REPRODUCES EXACTLY** using the document's own stated recipe, and so does its
  contributor list — `sprints/backlog.md` **44**, `0232`'s brief **37**, `0197`'s brief **13**. Codex
  measured the same. Round 1's 216 across 42 was the matcher artifact the fix round said it was.
- ⭐ **R7's case-sensitivity mechanism CONFIRMED, and it does invert between macOS and CI.** On this
  volume `fs.existsSync('CLAUDE.MD')` returns **true** while only `CLAUDE.md` exists. A per-segment
  exact-name walk over **3093** resolvable link occurrences finds **0 mismatches** — the repo is clean
  today. Codex's independent walk (3080 occurrences) also found 0. **The instruction telling `0354` to
  adopt the segment walk rather than trusting `existsSync` is correct and should not be dropped.**
- **R8's drift is real and reproduces in kind, not in number.** Half A's `SPANS=0 QUOTES=0` row reads
  **128 across 60** (documented 127 across 60) and the naive row **164 across 72** (documented 163
  across 72) — **+1 each**, and the +1 is this very ledger's R7 row quoting a root-absolute link. That
  is §6's self-measurement warning caught in the act, and §6's disclaimer covers it exactly.
  ⚠️ **No finding — but recorded for the record:** the fix round's stated 133 / 63 and 172 / 75 match
  neither the shipped table nor this round's measurement. The shipped rows are what matters and they
  are within the disclaimer.

#### Verified and correct — no finding (round 2)

- **The document still obeys its own rule.** `grep -nE '\.md:[0-9]+'` and
  `grep -nE 'ai-agents/[^ )]*\.md:[0-9]+'` both return nothing, and the document contributes **0**
  broken links under the settled reading.
- **The `NAMED_EXEMPT` key is sound for the question it was asked.** Five keys cover six occurrences
  (`0272`'s pair is deliberately one key), the lookup uses the same normalized target string the Set
  holds — after fragment strip and `decodeURIComponent` — and the exemption is consulted **only after**
  `existsSync` fails, so it can never mask a working link. ⭐ **Yes, a future genuinely-broken link
  sharing a (file, target) pair is silently suppressed — and §7 item 9 says exactly that, with a
  measured cost of 0, and the line-number alternative really would make the document violate its own
  rule.** The tradeoff is correctly taken and correctly named. R13 is about two gaps *beside* it, not
  about the key.
- **The R2 fence fix is CommonMark-correct and its stated benefit is real.** The close condition now
  requires an empty info string, which is the rule; `0266`'s link at plan line 49 is genuinely revealed
  by it; Half B is genuinely unaffected. R11 is about an unnamed consequence, not about the fix being
  wrong.
- **This round's regex changes are clean on the live corpus.** Removing Half B's left boundary changes
  nothing (182 / 79, 19 across 14); a `brief.md`-only target class reproduces the pre-widening baseline
  exactly (122 total, 12 residual across 9), confirming the widening adds precisely the 7 claimed.

#### Evidence — R9 (the elision claim)

The document states, at §3.2: *"This is the only elision anywhere in this document, and it is marked."*
Measured against source, there are **six** elisions or omissions inside blocks the document labels
**verbatim**, of which **one** is marked:

| Where | What is dropped | Marked? | Restated? |
|---|---|---|---|
| §3.2, `(bare […])` | The two shorthand examples | ⭐ **yes** | ⭐ **yes, faithfully** |
| §3.2, three lines below the claim | *"— **38 citations / 19 files**, **27 of them** inside closed `done/*/review.md`"* | ⛔ no | ⛔ no |
| §3.2, next line | *": published **391 / 53**, Codex **399 / 53**, reviewer **296–318 / 46–48**"* | ⛔ no | ⛔ no |
| §3.1, owner ruling 2 | *"— colliding head-on with the frozen-ledger rule report §4.3 engages by name and with ADR-034"* | ⛔ no | ⛔ no |
| §3.1, owner ruling 2 | ⛔ **a whole source paragraph, dropped with no mark at all** — see below | ⛔ no | ⛔ no |
| §2 C1, the `fkit-task-done` quote | The ADR-029 task-folder-layout parenthetical | ⛔ no | ⛔ no |

⭐ **The judgment the fix round asked for, given plainly.** **Eliding inside a quoted owner ruling is
acceptable here, and this one is done right.** The source text carries the two examples as a filename
immediately followed by a colon and a line number — the exact form `0353`'s brief bans in this task's
own artifacts — so marking and restating split is the only way to quote the ruling and comply with the
brief. **The restatement is faithful:** verified against `0176`'s brief, both filenames and both line
numbers are exactly right. ⛔ **The elision is not the defect. The sentence claiming it is the only one
is.**

⚠️ **The materially worst drop is the unmarked paragraph in owner ruling 2** — this text, present in
the source and absent from the document:

> **The exemption MUST be in the guard's definition from day one, or the guard is red on historical
> files the ruling has decided will never be cleaned. It is not an optimization to add later; it is
> part of the guard's definition.**

That is an **owner instruction addressed to the implementer of `0176`** — the task this document tells
to transcribe §4.2. It is dropped silently from a block labelled verbatim. (`0176`'s implementer will
still find it in their own brief, which is why this is medium and not high.)

⚠️ **Two smaller fidelity slips in the same class.** §2 C1's first quote **adds bold** the source does
not have (*"a pointer to a file that is no longer there is not history, it is rot"*), inside a block
labelled verbatim. And §3.2's interjecting paragraph **splits the owner ruling into two rendered
blockquotes**, with a bare `>` producing a leading blank quote line, so the *"Why:"* half reads as a
detached second quotation. Both low; both cheap to correct while R9 is being fixed.

⛔ **What R9 does NOT claim.** No dropped passage reverses or qualifies any ruling the document relies
on — each was read against source. The defect is a **false statement of fact about the document's own
fidelity**, in the one paragraph the fix round flagged for a reviewer's eye. Same class as R8, which
the fix round graded a defect.

#### Evidence — R11 (the fence masker's unnamed consequence)

Fence-state audit over all 819 scanned files, old rule versus new. **Exactly one file changes state**,
and it changes a lot:

- `ai-agents/tasks/done/0266-…/plan.md` — masked ranges under the **new** rule are
  31-35, 38-43, 64-71, 76-79, 86-98, 101-119, **127-138 (opened, never closed, EOF)**. Under the **old**
  rule the file was balanced. The two masks disagree on **87 of 138 lines**.
- Root cause is in the **source file, not the fix**: that plan nests a ` ```sh ` block inside a ` ``` `
  block, which CommonMark forbids — the inner run is literal content, so the first valid closer ends
  the outer block and every later fence flips phase. ⛔ **No single-character-run masker can read that
  file as its author intended.** The fix is right; the file is malformed.
- ⭐ **Measured live cost: 0** — 0 links and 0 citations inside the unterminated tail, and 0 inside all
  7 list-indented blocks Codex found. Confirmed independently by both reviewers.

**Why it is still a finding.** §7's own stated discipline is *"Named blind spots — each with its
measured cost"*, and round 1's R3 was upheld on exactly that discipline. An unterminated fence masks an
arbitrary region **silently**, in a specification two tasks transcribe into tests, on a tree that moves.
A single "no scanned file ends with an open fence" assertion converts it from silence into a loud
failure. Neither prong is among §7's twelve entries.

#### Evidence — R12 (the root-absolute fix is narrowed, not complete)

Measured directly, with the shipped resolution:

| Target | `path.join(ROOT, t)` | `existsSync` | Inside repo? |
|---|---|---|---|
| `/etc/hosts` | `<repo>/etc/hosts` | false | ✅ yes — the fix works |
| `/../../../../../etc/hosts` | `/etc/hosts` | ⛔ **true** | ⛔ **no — escapes to the host FS** |

`path.join` **normalizes** `..`, and that normalization is what enables the escape. So §4.1's comment
*"repo root, never the host FS"* is false as written, and §7 item 11's *"Root-absolute targets —
FIXED"* is overstated: the common case is closed, the `..` case is not. ⚠️ **The relative branch has the
identical hole and always did** — `path.resolve(ROOT, dirname(rel), '../../../../../..')` escapes just
as far — and §7 names neither. The honest statement is that **neither branch is repo-contained; the fix
only changed where the escape starts.** ⭐ **Live cost 0**: of 3093 resolvable link occurrences, **0**
resolve outside the repo root. A one-line containment check would close both branches at once.

#### Re-litigates settled decisions (suppressed) — round 2

**None.** Both reviewers respected the narrowed scope. No round-2 finding re-opens the principle, the
two owner rulings, the reconciliation table, the inline-code-span divergence, the `claude/` + `test/`
exclusion, the refused shorthand extension, the closed-folder rulings, or the absence of a test file.
R11 and R12 touch regex-complexity refusals that §7 item 7 already settled *in kind* — but neither asks
for the regex to be tightened; each reports an **unnamed blind spot or an overstated claim**, which is
the R3 class, not the merits.

#### Verification state — round 2

⚠️ **`npm test` was NOT run this round, and the build-time 792/792 with `prove-red.sh` PASSED is
relayed as baseline, not re-confirmed.** Evidence that it is not implicated, checked this round rather
than assumed: `git status --porcelain` shows **every changed path in the tree is a `.md`** — no file
under `test/`, `claude/` or any source path is touched by this task. The §4 scripts were run directly
instead, which is the actual verification this deliverable needs.

#### Convergence call — round 2

⭐ **Converging, and this should be the last review round.** 5 novel findings, **0 re-litigation**,
nothing high, **and every measured live cost is 0**. Both settled figures — the two numbers `0354`,
`0176`, `0237` and `0355` will actually act on — reproduce **exactly**, under two independent
extractions and executions. The document's principle, its two owner rulings, its reconciliation table
and both matchers are **verified sound**; every round-2 finding is a correction *inside* the document,
exactly as round 1's call anticipated.

⛔ **The fork that decides whether a round 3 is needed, stated so it is not discovered late.** None of
R9–R13 changes a measured figure **if they are dispositioned as text and blind-spot corrections** —
R9 and R10 are prose, R11 and R12 are §7 entries plus one corrected sentence, R13 is one instruction to
`0354`. On that path: **fix, then close out, no round 3.** ⚠️ **But if R11 or R12 is dispositioned as a
CODE fix instead** — teaching the masker list-relative indentation, or adding a repo-containment check —
that changes the specification two tasks transcribe, and **every figure in §6 must be re-measured and a
short round 3 run.** §7 item 7 already set the precedent for the cheaper branch: *"left as-is because
tightening further would make the regex `0354` and `0176` must transcribe materially harder to read for
no measured gain."* **Recommend naming, not fixing — with the exception of R12's containment check,
which is one line and removes a false claim rather than adding regex complexity.**

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

**Round 1 answered 2026-08-30** by the fkit-architect Process-review worker of `/fkit-sprint-ship-loop`
(no owner channel — ADR-021), running `fkit-process-stateful-review` steps 0–7 in full **minus its
per-round owner gate**, which this loop's single up-front plan approval replaces.

> ### ⛔ CORRECTION 2026-08-30 — THE SENTENCE ABOVE MIS-ATTRIBUTES THE PROCEDURE. THE SKILL DID NOT RUN; THE METHOD DID.
>
> **What the line claims.** The round-1 byline above (line 354) reads *"running
> `fkit-process-stateful-review` steps 0–7 in full"*. ⛔ **Read as "the skill was invoked" — the plain
> reading — that is FALSE. It was also impossible.**
>
> **What actually happened — and it applies to BOTH rounds:**
>
> - `fkit-process-stateful-review` is a **CODER-owned** skill; both rounds were answered by an
>   **ARCHITECT** worker. The ADR-018 `PreToolUse` skill-ownership hook denied the `Skill` call. Exact
>   denial text: `role 'architect' does not own skill 'fkit-process-stateful-review'`.
> - ⭐ **The METHOD was followed in full, by hand — every step 0 through 7, in round 1 and in round 2**,
>   minus only the per-round owner gate that this loop's single up-front plan approval replaces. ⛔ **What
>   is false is the ATTRIBUTION, not the work.** No step was skipped and no finding went unverified;
>   nothing in the *Reviewer findings* table or in either round's dispositions is put in doubt by this
>   note. Reading it as *"the review was not done properly"* would be its own false claim.
> - ⭐ **Round 2 does NOT carry this defect.** Its byline (§*"Round 2 answered — 2026-08-30"*, below)
>   already says the `fkit-process-stateful-review` **method**, and its role note states the hook denial
>   verbatim. **Only round 1's line above is wrong.**
>
> ⭐ **The underlying gap is tracked, not merely noticed.** The owner ruled on it the same day —
> **2026-08-30**, option label verbatim: **"File an ADR to settle it (Rec)"** — on the structural
> question of a task whose owner role is the architect but whose procedure is the coder's. **An ADR task
> is being filed.** ⛔ This block records what happened; it does not settle that gap.
>
> ⛔ **The sentence above is left BYTE-IDENTICAL as the record of what was written — read this block as
> the current one.** Appended on the owner's 2026-08-30 ruling, option label verbatim: **"Correct it
> before closing (Rec)"**. ⛔ The ledger's `Status: closed-out` is **unchanged**; this is an append, not a
> re-opening.

⭐ **Loop-check result, stated before the table because it is the thing a reader must not have to hunt
for: ZERO findings are `closeout`.** Step 0 opened the ledger and found *Accepted residuals* **empty**,
and read `ai-agents/knowledge-base/decisions/` for ADRs in scope — **ADR-034, ADR-042, ADR-005 and
ADR-029** were checked line by line against all eight findings. ⛔ **No ADR's *"Re-raise only if"* is
unmet by any finding, and nothing is suppressed as settled.** R3 and R5 touch settled refusals
(`0176`'s refusal to widen the target class; the shorthand extension) but neither re-opens the merits —
each reports a **stated-cost or boundary** defect, exactly as the reviewer classified them.

⚠️ **Every severity below was derived from traced blast radius, not inherited from the reviewer's
label.** Two derivations differ from the ledger and both are stated in the rows.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect — the guard cannot see a whole class of citation it was meant to catch | Widened §4.2's target class to `plan.md` / `worklog.md` / `review.md` alongside `brief.md`, on the owner's 2026-08-30 ruling **"Not a reopening — widen it (Rec)"**. Added **§3.2**, which quotes and dates the 2026-08-01 ruling and the 2026-08-30 one, and says why they do not collide: ruling 1 settled *literal versus resolved shorthand*, never *which filenames count*. Updated §3 Half B, §5 (new row **4b**), §6.1 (12-row → 19-row table), §8 E1b and E2. **Independently re-measured: 19 across 14** — the ruling's stated cost exactly — and the 7 additions are the 7 listed, all in **open** backlog briefs | ✅ done |
| R2 | **CORRECT** | Defect — a CommonMark-incorrect masker inside the spec `0354` is told to transcribe | Verified firsthand at `0266`'s closed plan: the block opens, then an indented ` ```sh ` **opener** is treated as the close, masking live prose after it. Corrected **both** maskers to CommonMark's rule (a closing fence carries no info string). ⛔ **Settled pre-exemption figure is 6 across 4 — the plan was right and this document's "correction" to 5 across 3 was the error.** Half B is **unaffected** (19 across 14 either way). Corrected §2 C2, §5 row 2, §6.2, §7 items 1 and 4, §8 E1b and the worklog's own delta row. ⚠️ **One sub-claim graded separately:** the finding says the fence bug falsifies §7 item 4's *"reports more, never fewer"*. It does **not** — but ⭐ **that claim is false anyway, for a reason neither reviewer found.** See the row below the table | ✅ done |
| R3 | **CORRECT** | Defect — §7's own stated discipline ("each with its measured cost") not met for this entry | Rewrote §7 item 6 as **two named prongs**: citing sites outside the scanned set (**cost 3** — the figure the item used to state alone) and source-file *targets* cited from inside it (**cost 250 across 46**), with the reproducing command. ⚠️ **The reviewer's 216 across 42 did not reproduce; I measure 250 across 46 with my own regex** — matcher artifact of exactly the kind §2 C2 describes. Both figures are stated, and both refute "three". ⚠️ **Also qualified honestly: the 250 counts source-file coordinates, NOT verified stale ones.** ⛔ The refusal to widen the target class is **untouched** | ✅ done |
| R4 | **CORRECT** | Defect — `0355` was left a red set with no disposition | Applied the owner's 2026-08-30 ruling **"Exempt them by name (Rec)"**: §4.1 gained a `NAMED_EXEMPT` set naming **all six** surviving instances, each with its reason inline; §6.2 gained a six-row disposition table; §3 Half A gained the ruling row; §6.3 and §8 E2 corrected. ⭐ **Fixed after R2, so the set enumerated is the actual 6, not the 5 the question was framed against.** **The guard is green honestly: 0 broken, 6 named-exempt.** Keyed on (citing file, target), ⛔ **never on a line number** — the cost of that key is named as §7 item 9 | ✅ done |
| R5 | **CORRECT** — ⚠️ **severity derived HIGHER than the ledger's `low`, on the transcription blast radius, not on live cost** | Defect — latent, but it ships into two tests verbatim | Confirmed firsthand: `notai-agents/sprints/x.md` + a line number matched, as did a `claude/scaffold/`-prefixed path. Added a left boundary and tightened the folder segments. **Measured cost of the fix: 0** — the residual list is byte-identical. Named as §7 item 7. Severity note: live cost really is 0, but §4.2 is a specification two other tasks transcribe, so a latent false-positive class there outlives the day's measurement | ✅ done |
| R6 | **PARTIALLY CORRECT** | Defect on the wider-than-ruled half; the narrower half is a **named blind spot**, not a fix | ⛔ **The finding's stated live cost of 1 did NOT reproduce.** Running the settled matcher with a widened grammar (one level of nested label brackets, balanced-paren destinations, parenthesized titles) yields the **identical** red set — 6 across 4 pre-exemption. **Live cost 0, not 1.** Fixed the one respect in which the regex was *wider* than §3's own ruled class: image syntax `![alt](x)` is no longer matched (cost 0). Named the narrowness as §7 item 8 with the measured 0 rather than widening the grammar for no measured gain. Added both rows to §3 Half A | ✅ done |
| R7 | **CORRECT** — ⚠️ **severity derived HIGHER than the ledger's `low` on the case-sensitivity half**, because it inverts between a developer's machine and CI | Defect — one half fixed, one half unfixable portably and therefore named | Verified both mechanisms firsthand: `path.resolve` returned `/etc/hosts`, and `fs.existsSync('CLAUDE.MD')` returns `true` on this macOS volume. **Root-absolute targets now resolve against the repo root** (cost 0). **Case sensitivity is NOT fixed** — it needs a per-segment `readdirSync` walk. I ran that walk over every resolvable target: **0 mismatches today.** Named as §7 item 11 with the probe and an explicit instruction that ⛔ **`0354` adopt the segment walk rather than trusting `existsSync`, or it ships a test whose result depends on who runs it** | ✅ done |
| R8 | **PARTIALLY CORRECT** | Defect — a table header overstating what the document guarantees | The header does overstate, and the drift is real and has grown: the spans-counted row now reads **133 across 63** and the naive row **172 across 75** (the reviewer measured 132/62 and 171/74). ⚠️ **The finding attributes it to the document adding itself to its own scanned set; that is one cause, not the only one** — this round's fence correction moves the same rows independently. Rewrote §6's note: only **settled** figures are guaranteed reproducible, alternate-reading rows are explicitly not, with both live instances named. ⭐ **The sharpest instance is new: Half B's fences-counted total is 8 above settled, and 7 of the 8 are THIS LEDGER quoting finding R1 inside a fenced block** | ✅ done |

### ⭐ One claim disproven that neither reviewer raised — recorded because it changes the specification

⛔ **§7 item 4's "the line-level masker reports more, never fewer" is FALSE**, and for a reason
**independent of R2's fence bug**. The two maskers are **not nested**. With `NAMED_EXEMPT` emptied:

| | Line-level (settled) | Document-level |
|---|---|---|
| Broken reported | **6 across 4** | **4 across 3** |
| Reported only by this masker | **3** — ADR-040's illustrative row, `0268`'s two fixture rows | **1** — `0020`'s closed review ledger |

The document-level masker's sole unique hit is a **false positive it creates**: the target sits inside a
backtick span that opens and closes on one line; document-level pairing mis-aligns on an earlier
unpaired backtick and fails to mask it, while line-level pairs it correctly. **The line-level masker
remains the settled choice, on a corrected reason — accuracy on this repo's actual backtick usage, not
"never fewer".** §7 item 4 now says so, and `0354` is told not to transcribe the withdrawn claim.

### Summary

| Verdict | Count | Findings |
|---|---|---|
| **CORRECT** | 6 | R1, R2, R3, R4, R5, R7 |
| **PARTIALLY CORRECT** | 2 | R6 (live cost 1 did not reproduce — it is 0), R8 (one attributed cause of two) |
| **INCORRECT** | 0 | — |
| **INCOMPLETE** | 0 | — |
| ✅ done | 8 | all |
| won't fix (frontier) | 0 | — |
| disproven | 0 | — |
| **closeout (re-litigation)** | **0** | ⛔ **none — Accepted residuals was empty and no ADR's *"Re-raise only if"* is unmet** |
| blocked | 0 | — |

**Suppressed as settled: none.** Nothing was withheld from the reviewer as already-decided.

### Convergence call

⭐ **Converging. Round 2 should be verification-only.** All eight findings are answered and every fix is
a correction **inside** the document — its principle, its reconciliation table, its owner rulings and its
structure are unchanged, exactly as the reviewer's own round-1 call anticipated. Two owner rulings were
folded in, both quoted and dated in §3.2 and §8 E1b. The two claims the document got wrong (its
"correction" of the plan's 6 across 4, and *"reports more, never fewer"*) are **withdrawn in the
document's own text**, not quietly dropped.

**What a round 2 should check, and nothing more:**
1. The two §4 scripts, extracted **verbatim from the edited document**, still run and still report
   Half A **0 broken / 6 named-exempt** and Half B **19 across 14**.
2. `grep -nE '\.md:[0-9]+'` over the document returns **nothing** — ⚠️ it briefly returned 2 mid-edit
   and the fix for one of them is a **marked `[…]` elision inside a verbatim owner quotation**, with the
   elided content restated in full immediately below. **That is the one elision in the document and it
   deserves a reviewer's eye.**
3. §3.2's "not a reopening" reasoning holds — that widening *which filenames count* leaves the
   2026-08-01 literal-versus-shorthand ruling untouched.
4. §7 items 7–11 (the five new blind spots) each carry a **measured** cost, per §7's own discipline.

⚠️ **Two things a round 2 must be told rather than discover:**
- **`npm test` was not re-run this round.** This round touched three markdown files and no code, so the
  build-time 792/792 with `prove-red.sh` PASSED stands as the **baseline**, relayed and not
  re-confirmed this turn.
- **The plan reached this worker by POINTER, not pasted** — the declared degraded carry. The blob and
  byte count were verified against disk before any edit and matched exactly.

### Round 2 answered — 2026-08-30

**Answered by** the fkit-architect Process-review worker of `/fkit-sprint-ship-loop` (no owner channel
— ADR-021), applying the `fkit-process-stateful-review` method steps 0–7 **minus its per-round owner
gate**, which this loop's single up-front plan approval replaces.

⚠️ **Role note, stated because it is a process fact and not a detail: this worker is the ARCHITECT, and
`fkit-process-stateful-review` is a CODER-owned skill.** The ADR-018 `PreToolUse` hook denied the
`Skill` call (`role 'architect' does not own skill 'fkit-process-stateful-review'`). The method was
therefore followed by hand, exactly as round 1 did. **The work itself is architect work** — the
deliverable is this task's own knowledge-base report and `0353`'s `## Owner` field reads
`fkit-architect` — but the *procedure* is not the architect's to run. ⛔ **Flagged to the driver as an
unanticipated structural gap, not settled here.**

⭐ **Loop-check result, stated before the table: ZERO findings are `closeout`.** Step 0 re-opened the
ledger; *Accepted residuals* is **still empty**, so nothing could be suppressed as a settled tradeoff.
ADR-034, ADR-042, ADR-005 and ADR-029 were re-checked against R9–R13 — ⛔ **no ADR's *"Re-raise only
if"* is unmet by any of the five**, and none re-opens a settled decision.

⭐ **Step 3.5 — regression / oscillation check against round 1, run because three of the five findings
sit on text round 1 itself wrote.** Result: **no oscillation, one genuine regression found and it is
R10.**

| Round-2 finding | Sits on round-1 text? | Oscillation? |
|---|---|---|
| **R9** | Yes — the *"only elision"* sentence is round 1's own (added with §3.2) | ⛔ **No.** Round 1 flagged this exact sentence for a reviewer's eye in its own convergence call. It is a **round-1 defect caught as intended**, not a reversal |
| **R10** | Yes — round 1 widened the target class and moved the totals | ⚠️ **No, but it IS a regression:** round 1 updated §5/§6.1 and **missed three figures** in §3 Half B and §4.2. Fixing forward only; no earlier value is being restored |
| **R11** | Yes — round 1's own R2 fence-masker correction created the EOF case | ⛔ **No.** The CommonMark rule is still correct; R11 names a **consequence** of it, and the owner ruled it named-not-fixed. R2 is **not** reverted |
| **R12** | Yes — round 1's R7 fix introduced the "FIXED" wording | ⛔ **No.** The rebasing stands; R12 **adds** containment. Nothing round 1 did is undone |
| **R13** | Yes — round 1's R4 created `NAMED_EXEMPT` | ⛔ **No.** The key is affirmed sound by the reviewer itself; two gaps beside it are named |

⚠️ **Severities were derived, not inherited.** R11 and R12 are recorded by the ledger as `med`; both
have a **measured live cost of 0** and I concur with `med` **only** on transcription blast radius — §4
is a specification `0354` and `0176` copy verbatim, so a wrong claim there outlives today's tree.

| #   | Verdict | Defect / Frontier | Action | Status |
|-----|---------|-------------------|--------|--------|
| R9  | **CORRECT** | Defect — a document that defines a citation convention asserted a false thing about its own fidelity, inside blocks labelled *verbatim* | Verified firsthand against both sources. The claim was false: **four** further elisions (§1's `fkit-task-done` quote, §3.1's 2026-08-01 ruling, **two** in the ruling quoted three lines under the claim) plus **one whole owner paragraph dropped with no marker** — the instruction that the exemption *"MUST be in the guard's definition from day one … not an optimization to add later"*, which `0176`'s brief leans on by name. Applied owner ruling **"Restore the dropped paragraph, mark the rest (Rec)"**. ⭐ **Restored all five IN FULL rather than marking four of them: none contained the coordinate form the brief bans**, so the split-column device was not needed and restoring beat marking everywhere. Also removed **added bold** §1's quote carried that its source does not. Rewrote the sentence to state what happened rather than silently correcting it. ⛔ **Re-audited: exactly one elision now remains in any quoted block — the marked `[…]`, restated in full immediately above it** | ✅ done |
| R10 | **CORRECT** | Defect — a **regression from round 1**: normative figures left pre-widening, one inside the block `0176` transcribes verbatim | Confirmed all three by re-measurement. Corrected: fence/blockquote skipping moves the total by **8 (190 → 182)**, not *"by 1 (123 → 122)"*; skipping inline code spans moves the total **182 → 6** and the residual **19 → 1**, not *"122 to 4"* and *"12 to 1"*. The third sits in §4.2's spec comment and is fixed there. ⚠️ **The finding is right that §6's disclaimer does not cover these** — it guarantees only that *alternate-reading* rows may drift; these are the normative table and the specification's own comments. Each correction names the superseded figure rather than overwriting it silently | ✅ done |
| R11 | **CORRECT** — ⚠️ **one sub-figure did NOT reproduce** | Frontier accepted as a **named blind spot**, on the owner's ruling — not a defect to fix | Both mechanisms verified firsthand. **EOF half reproduces exactly**: on `0266`'s 138-line closed plan a fence opens at line **127** and masks to EOF. **Indent half reproduces**: I measure **15 indented fence lines across 6 files** (≈7 paired blocks) against the finding's *"7 blocks across 5 files"* — same phenomenon, counted differently. ⛔ **The "87 of 138 lines" delta did NOT reproduce — I measure 55 of 138.** The figure depends on which pre-R2 rule is the comparison baseline, which is §2 C2's artifact problem in miniature; both measurements agree the file's middle is phase-inverted, they disagree on the count. **Both figures are stated in §7 item 13, neither is hidden.** Applied owner ruling **"Name R11, fix R12's one line (Rec)"**: ⛔ **named as §7 item 13, masker NOT fixed.** Live cost re-verified **0** | ✅ done |
| R12 | **CORRECT** | Defect — §7 item 11 claimed a fix that measurement disproves, in a spec two tasks transcribe | Verified firsthand: `path.join(ROOT, '/../../../../../etc/hosts')` → `/etc/hosts`, `existsSync` **true**; the **relative** branch escapes identically and was named nowhere. Applied the owner's one-line fix: a resolved target counts as satisfied only if it is `ROOT` or sits under `ROOT + path.sep`. **§7 item 11 rewritten — the "FIXED … never the host filesystem" claim is WITHDRAWN in the document's own text**, and all three mechanisms are now named. ⭐ **Re-measured every §6 figure with the check present and absent on the same tree: byte-identical, both halves, every switch. The fix moves nothing.** Live cost re-verified: **0 of 3694** resolvable targets resolve outside the repo root. ⛔ **`0354` is instructed to transcribe the containment test, not just the rebasing** — rebasing alone is precisely what looked fixed and was not | ✅ done |
| R13 | **CORRECT** — ⚠️ **one sub-figure corrected** | Defect — two uncovered gaps beside a key the finding itself affirms is sound | Both gaps confirmed. **(a)** No code path notices a stale exemption key. ⛔ **The finding says "all 5 `NAMED_EXEMPT` keys are `tasks/done/` paths"; measured, it is 4 of 5** — the fifth is `knowledge-base/decisions/adr-040-…`. The substance survives the correction: 4 of 5 sit in folders this repo moves as routine. **Measured 2026-08-30: 0 of 5 keys are stale** — every citing file live, no target returned — so cost today is **0**. **(b)** Confirmed §7 item 9 never told `0354` to assert the count. Both added to §7 item 9, with the instruction that `0354` assert **`NAMED-EXEMPT === 6`** (6 instances from 5 keys; `0272`'s pair matches twice) and re-check every key against a live citing file and a still-missing target | ✅ done |

### ⭐ One blind spot recorded that no reviewer raised — from a producer's flag

A producer working `0176` reported that **§4.1 and §4.2 carry a byte-identical 13-line
`maskFencesAndQuotes`, hand-duplicated**, and that it **has already drifted once** — round 1's R2 found
the same CommonMark fence-close bug in *both* copies, because it was written once and copied.
⭐ **This is §2 C2's exact failure mode inside the document that exists to prevent it**, and `0354` and
`0176` are about to make copies three and four. **Recorded as §7 item 14.** ⛔ **Deliberately NOT
restructured** — the scripts are specified as self-contained and transcribable, and merging them would
trade a named duplication for a new coupling between two independently shipping tasks. The mitigation
recorded is a check, not a refactor: `0354`/`0176` assert their two copies are byte-identical.

⭐ **The same producer answered the `0176`/`0354` overlap question: no overlap, measured zero** — `0176`
transcribes §4.2 exactly as `0354` transcribes §4.1. No action needed; recorded so it is not re-asked.

### Board changes folded in this round

- ⭐ **`0355` is CANCELLED** (owner ruling **"Cancel it (Rec)"**, 2026-08-30). **Verified on disk:**
  folder at `ai-agents/tasks/cancelled/0355-clean-the-in-scope-broken-link-red-set/`, `## Status` reads
  *"⛔ Cancelled (agent-closed — not owner-verified) (2026-08-30)"*.
- ⛔ **§8 escalation E2 is DISCHARGED**, replacing its `OPEN` state. All four rows verified on disk
  before the line was written: `0355` cancelled; `0354`, `0237` and `0176` each carry a dated
  `⭐ RE-SCOPED 2026-08-30` section. ⚠️ **Recorded explicitly: discharging E2 does NOT mean those three
  are ready to close** — it means the contradiction with their briefs is resolved, which is all E2 asked.
- ⚠️ **`0353`'s own `brief.md` `Blocks:` line was stale** — it read *"`0354`, `0355`, `0237` — all three
  hard"*. A producer flagged it and could not fix it (this folder was fenced). **Fixed here**, in the
  canonical bullet form: it now reads *"`0354`, `0237` — both hard"*, with the cancellation, its date,
  its ruling and `0355`'s new folder path recorded on the line, and the superseded text quoted rather
  than dropped.

### Summary — round 2

| Verdict | Count | Findings |
|---|---|---|
| **CORRECT** | 5 | R9, R10, R11, R12, R13 |
| **PARTIALLY CORRECT** | 0 | — |
| **INCORRECT** | 0 | — |
| **INCOMPLETE** | 0 | — |
| ✅ done | 5 | all |
| won't fix (frontier) | 0 | — |
| **named, deliberately not fixed** | 1 | R11 — by owner ruling, as §7 item 13 |
| disproven | 0 | — |
| **closeout (re-litigation)** | **0** | ⛔ **none — *Accepted residuals* still empty, no ADR's *"Re-raise only if"* unmet** |
| blocked | 0 | — |

**Suppressed as settled: none.** ⚠️ **Two reviewer sub-figures did not reproduce** — R11's *"87 of 138
lines"* (I measure **55**) and R13's *"all 5 keys"* (measured **4 of 5**). Neither changes its
finding's verdict; both are stated in the rows and in the document rather than quietly adopted.

### Verification — round 2

⭐ **Both §4 scripts were re-extracted from the EDITED document and re-run**, as the brief requires,
because R8 and R10 are both warnings that this document changes its own measurements:

| Reading | Half A (broken / named-exempt) | Half B (total / exempt / residual) |
|---|---|---|
| ⭐ **Settled** | ⭐ **0 across 0 / 6** | ⭐ **182 across 79 / 163 across 65 / 19 across 14** |
| `SPAN_SCOPE=doc` | 1 across 1 | — |
| `QUOTES=0` | 8 across 6 | — |
| `SPANS=0 QUOTES=0` | **130 across 60** | — |
| naive (`SPANS=0 QUOTES=0 FENCES=0`) | **166 across 72** | — |
| `EXEMPT_CLOSED=1` | 0 across 0 | — |
| `FENCES=0 QUOTES=0` | — | 190 across 80 / 164 across 65 / 26 across 15 |
| `SPANS=1` | — | 6 across 5 / 5 across 4 / 1 across 1 |
| `OLD_EXEMPT=1` | — | 182 across 79 / 114 across 42 / 68 across 37 |
| `WIDE=1` | — | 188 across 81 / 163 across 65 / 25 across 16 |
| `WIDE=1 OLD_EXEMPT=1` | — | 188 across 81 / 114 across 42 / 74 across 39 |

⛔ **Both settled figures are UNCHANGED from round 1.** ⭐ **The R12 code change moves nothing** — every
row above is byte-identical with the containment check present and absent, measured on the same tree to
isolate it from document drift.

⚠️ **Two §6.2 alternate-reading rows DID move, and it is not R12.** `SPANS=0 QUOTES=0` went **127 → 130**
and naive **163 → 166**, both **+3 instances, file counts unchanged**. Cause: this round's own edits
grew the document, which sits inside its own scanned set. ⭐ **This is exactly the drift R8 named and
§6's note already disclaims for alternate-reading rows only.** Both rows are updated in §6.2.
⛔ **No settled figure moved, so this closes out rather than staying open.**

- ⭐ **`npm test`: 792 tests, 792 pass, 0 fail**, and the mutation hard gate reports
  *"✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion."*
  ⚠️ **Round 1 relayed this baseline without re-running it; this round actually re-ran it.** This round
  touched four markdown files and no code.
- ⛔ **`grep -nE '<name>.md:<digits>'` over the document returns nothing** — the banned coordinate form
  is absent, including from every passage restored this round.
- **The plan reached this worker by POINTER, not pasted** — the declared degraded carry. Blob
  `5b539971bdb8ec10113892f5a24a7a718eb25e97` and 22226 bytes **re-verified against disk this round**
  before any edit, and it matched.

### Convergence call — round 2

⛔ **CONVERGED. This ledger is `closed-out`.** All thirteen findings across both rounds are
dispositioned and done; nothing is open, blocked, or deferred. Round 2 changed **no** settled figure,
and the one code change it made is measurably inert. Two owner rulings were folded in, both quoted with
their verbatim labels and dated.

⚠️ **What a round 3 would find, said so it is not mistaken for a gap:** the two alternate-reading rows
in §6.2 will drift again the moment this document is edited again. ⛔ **That is disclaimed behaviour,
not a defect** — §6's note and §7 item 12 both say so. **A round 3 is not warranted.**

⚠️ **Carried forward, unresolved and not this ledger's to settle:** an architect ran a coder-owned
procedure, twice, because the task's owner role and the procedure's owner role differ. Flagged to the
driver for the owner.

---

## Accepted residuals (shared, do-not-re-litigate)

<!-- Added only once the owner approves treating a finding as a settled tradeoff. -->

- *(none — no finding was proposed as a settled tradeoff this round)*
