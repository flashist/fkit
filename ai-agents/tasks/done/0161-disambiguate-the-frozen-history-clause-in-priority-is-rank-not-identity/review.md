# Review — 0161

Task: 0161 — [brief](./brief.md)
File(s) under review (round 2 state):
- `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` (**+7/-2** — was +6/-2 in round 1)
- `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` (**+7/-2**)
- `ai-agents/tasks/backlog/0161-…/worklog.md` (new, rewritten in round 2)

Status: **converged** — round 2 found no defect in the shipped page; one low finding in the worklog.

Reviewers, round 1: **fkit-reviewer** (own pass) + **Codex** (`codex exec --sandbox read-only`) — both ran,
coverage **full**. No degradation.

Reviewers, round 2: **fkit-reviewer** (own pass) + **Codex** (`codex exec --sandbox read-only`, `codex-cli
0.145.0`) — both ran, coverage **full**. No degradation. Codex was run deliberately on a convergence pass
because the rewritten sentence had had **zero** independent reads.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | high | `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:41-43` (and the byte-identical scaffold twin) | The new remedy — *"a stale one is corrected by **appending a dated correction**, never by a silent rewrite"* — **contradicts 0159 Part A**, which prescribes the opposite remedy for exactly this class. 0159 `brief.md:90-92`: *"Rewrite each site below to **name the folder ID and drop the rank**"*, over **15 A1 sites** that are precisely the prose form the new bullet declares *not covered* (e.g. `0152/brief.md:134` *"0154 (127)"*, `0147/brief.md:99` *"0150 (priority 124…)"*). *Append a dated correction* is 0159's **Part B** remedy, which 0159 applies only to dated sprint-board addenda that it says *"fall squarely inside the carve-out"* — i.e. the **frozen** class. The change therefore imports the frozen-class remedy and applies it to the not-frozen class. **0159's recorded Ruling 2 (`0159/brief.md:27-32`) prescribes no remedy at all** — it settles only *which form is covered* and that *"the sweep proceeds"*. The remedy sentence is a substantive addition beyond the ruling it claims to transcribe. Secondary ambiguity on the same line: if *"silent"* is load-bearing (a documented rewrite being permitted), the clause never says what makes a rewrite non-silent; and the page never states where a *"dated correction"* is appended to an inline mid-sentence parenthetical. Either reading fails 0161's brief. Raised **independently by both reviewers**. |
| R2 | 1 | medium | `ai-agents/tasks/backlog/0161-…/worklog.md:34-57` | The worklog is **not auditable standalone**, and there is no `plan.md` on disk. It cites checks **V1**, **V3**, **V8** by number, but the numbered check list exists only in the driver session — a reader cannot learn what V2, V4–V7 or V9 were. It records **no pass/fail roll-up** for the full set, **no before/after hashes** for the load-bearing "both homes actually changed" requirement (`340ab5cb…` → `fc4f8e37…`), and no recorded result for the forbidden-relative-link check or the repo-wide line-citation check. The worklog itself argues (`:49-57`) that **the checks were the only guard** on this page — so an unreproducible record of those checks reduces the guarantee to testimony. Raised **independently by both reviewers**. |
| R3 | 1 | low | `ai-agents/tasks/backlog/0161-…/worklog.md:26` | *"The only `2026-07-29` ruling on the board is `sprint-2.md:159`"* is **false**. `sprint-2.md` records at least three further owner rulings dated 2026-07-29: 0165's promotion (`:179`, `:218`), 0154's promotion (`:251`, `:298`), and the filing approval for 0162/0163/0164 (`:467`). **The conclusion survives** — none of them concerns the frozen-history clause, independently verified this round — but the supporting claim is overstated in the artifact whose job is to justify the date correction. |
| R4 | 1 | low | `ai-agents/tasks/backlog/0161-…/worklog.md:24` | Stale line citation. The worklog cites the page's closing-callout date stamp as **`:63`**; that was its **pre-edit** line. The +6/-2 edit moved it to **`:67`** — new `:63` is unrelated callout prose. The worklog was written after the edit, so the citation was stale on arrival. (Ironically an instance of 0160's mutable-coordinate class, on this very task.) Found by Codex, verified this round. |

| R5 | 2 | low | `ai-agents/tasks/backlog/0161-…/worklog.md:152` and `:185` | **Wrong line citation — the R4 class, fourth occurrence on this task.** Both lines cite the brief's `node --test test/` step as `0161/brief.md:132`. The quoted command is at **`:131`**; `:132` is the following line, *"goes red, stop and report; do not adjust a test to fit a prose edit."* This is not a coordinate that moved — the brief's only change this sprint is `## Status` `🔲 Backlog` → `🔄 In progress` (`git diff --numstat` = `1 1`, no line-count shift), so **the citation was wrong when written**, in both an earlier and the rewritten worklog. It survives the R4 remedy because that remedy (*"anchored by quoted text wherever a coordinate could move"*, `worklog.md:199`) was applied only to the callout stamp. The same off-by-one reached the coder **from the driver's own round-2 prompt**, which also says `:132`. **Non-blocking**: the shipped page is unaffected, and the substantive claim (the brief's command is wrong for this repo) is true. Found by Codex, verified independently this round. |

### Round 2 — verified clean

- **R1 is discharged. The contradiction with `0159` is gone and no new one was introduced.** The page now
  reads *"rewritten to **name the folder ID and drop the rank**; updating it to today's number only
  reproduces the defect with a fresher date"* (`:42-44`) against `0159/brief.md:90-92` *"Rewrite each site
  below to **name the folder ID and drop the rank** … Do **not** simply update the number to today's
  value: that reproduces the defect with a fresher date."* Same remedy, same warning. Checked for **new**
  contradictions against `0159` Ruling 2 (`:27-32` — covered form, reasoning and date all match), `0159`
  Part B (`:184-186` — the append remedy for the frozen class; the page is now **silent** on it, so no
  conflict), and both sibling bullets on the page (the `➡️ Moved to … priority M` marker at `:35-37`
  stays an explicit separate carve-out; `sprints/done/` at `:45` untouched). None found.
- **Attribution now reads correctly.** *"Owner ruling, 2026-07-27."* is a standalone sentence closing the
  scoping-and-reason clause (`:42`); the remedy begins after it, unattributed. That is the **same
  construction the page already uses** in its closing callout (`:67-69` — stamp, then unattributed
  continuation), so it is an internal convention, not a novelty. **And the failure mode is now benign**:
  even a reader who over-reads the stamp onto the remedy is misattributing `0159`'s *approved* remedy, not
  an invented one — which is exactly what R1's defect was not. Codex reached the same verdict
  independently.
- **Coder residual 2 (remedy narrower than `0159` Part A) is acceptable narrowing, not a defect —
  tested, not credited.** Part A's relative-order alternative (*"directly below 0147"*) is absent from the
  page, but the page's remedy **applied mechanically to every relative-order site in `0159` A1 yields
  `0159`'s own prescribed answer**: row 2 `"task 0150 (priority 124, directly below this one)"` → *"task
  0150 (directly below this one)"* (0159's note: *"the 'directly below' half is still true — keep it, drop
  the number"*); row 3 `"adjacent to 0147 (123)"` → *"adjacent to 0147"*; row 8 `"immediately above 0146
  (currently P130)"` → *"immediately above 0146"*; row 14 `"land with 0150 (124) in ONE session"` → *"land
  with 0150 in ONE session"*; row 6 self-reference `"this one (131)"` → names the folder ID. *"Drop the
  rank"* never asks the reader to delete the surrounding relative-order words. A reader with a
  relative-order case is not left without an answer.
- **Standalone-read test re-run on the new wording, with the reviewer's own questions.** (i) *"A brief says
  'adjacent to 0147 (123)' and the adjacency is the point — what do I write?"* → answered: prose form *"is
  **not** covered"*, remedy *"name the folder ID and drop the rank"* → *"adjacent to 0147"*. (ii) *"May I
  bulk-update the `124 (0150)` cells on a sprint board?"* → answered: **no**, *"never mass-edited"*. (iii)
  *"Which half did the owner rule?"* → answered by sentence boundary, per the bullet above. Codex ran the
  same test independently and got the same answers.
- **Parity holds AND the content changed — all three clauses confirmed.** `diff` silent; both homes
  `b7cc3845bb0e0e678e2b768cbbd951f7f655514cc32429d7d4499d7b812a894f`; `HEAD` is `340ab5cb…`; round 1 was
  `fc4f8e37…`. Identity alone would have passed on two identical wrong files; it did not. `git diff
  --numstat` = `7 2` for each home.
- **V4, V5, V7 re-run independently by the reviewer, not credited from the worklog.** V4: `/usr/bin/grep
  -cE '\]\(([^)]*/)?(decisions|reports)/'` returns **0 matches** in each home — reported as a measured
  zero, not an unqualified "no hits". V5: `ADR-029`=3 and the decision-report filename=2 per home, and a
  **joined-line** sweep finds the *"cited by name and NOT linked — deliberately"* callout intact in both;
  a joined-line sweep also confirms the new bullet is present whole in both homes. V7: rank cells `HEAD`
  144 → worktree 145, the single added `| P145 |` being **task `0167`'s new row**, filed out of band by
  the producer and outside this task's surface; `ai-agents/wiki-vault/` still at its pre-existing `4 0`.
- **No line-number citation into the page was broken.** All five live citations (`0159/brief.md:28`,
  `:286`, `sprint-2.md:751`, `:797`, plus `0103/review.md`) target `:38`, which still resolves to the
  bullet's first line after the round-2 edit.
- **R3's correction is accurate.** `sprint-2.md` contains **22** `2026-07-29` mentions; the further owner
  rulings the worklog now names are all real — `0165`'s promotion (`:179`, `:218`), `0154`'s promotion
  (`:251`, `:298`), the `0162`/`0163`/`0164` filing approval (`:467`) — and the original false *"only"*
  claim's referent (`:159`) is indeed `0162`'s placement ruling. Every one of the 22 concerns a different
  subject; **none** concerns the frozen-history clause, so **2026-07-27 stands**. The worklog names the
  false claim as an earlier revision's error rather than deleting it.
- **Every other coordinate in the worklog and the ledger resolves.** Checked by opening each: `0159`
  `:18`, `:27-32`, `:90-92`, `:184-186`; `0161` `:44`, `:87-90`, `:138-142`, `:156-168`;
  `test/converge-contract.test.js:369` (*"byte-for-byte"* — correct). `0161/brief.md:156-168`'s own
  claim about the live board is also right: `0161` reads **P131** and `0157` **P130**. Only `:132`
  (finding R5) fails.

### Verified clean — round 1 — recorded so it is not re-checked

- **Dual-home parity holds AND both homes changed.** `cmp` byte-identical; both at blob `1d00da4`; sha256 `fc4f8e37e0d7…` vs `HEAD`'s `340ab5cb…`. `git diff --numstat` = `6 2` for each. An identity-only check would have passed on two untouched files; this did not.
- **No forbidden relative link added.** The added lines contain **no markdown link of any kind**; the bare ADR-029 / decision-report citations and the do-not-link callout are intact and unweakened.
- **The date `2026-07-27` is correct; the driver's `2026-07-29` was wrong.** Supported by `0159/brief.md:18` and Ruling 2 `:27-32`, `0161/brief.md:44`, `sprint-2.md:163`, and the page's own two stamps. Every 2026-07-29 ruling in the repo concerns a different subject. The coder's correction stands. **0159 needs no edit *on the date*** — but see R1 on substance.
- **The corrected V3 predicate is right.** `git diff -U0 | grep '^-' | grep -v '^--- '` reports **2** deleted lines per home; the brief's `grep '^-[^-]'` reports **1**, confirming the coder's class defect: `[^-]` excludes a deleted markdown list item (`-- **Existing…`). Reproduced this round on both homes.
- **No line-number citation into the page was broken.** All five repo citations target `:38`, which still resolves to the same bullet's first line before and after.
- **No ADR governs the remedy question.** `decisions/` has no page mentioning frozen history, the `priority (folderID)` notation, or dated corrections. ADR-027 (dual-home parity) is satisfied.

### Re-litigates settled decisions (suppressed)

**Round 1.** None. Every round-1 finding is novel; nothing re-raised an accepted residual or an ADR
re-raise condition. The four items the driver marked known-and-accepted (the brief's wrong
`node --test test/`; `0161/brief.md:156-168`'s stale ranks as 0159's surface; the disclosed V6/worklog
ordering deviation; nothing guarding this page) were **not** raised by either reviewer.

**Round 2 — two Codex findings evaluated and NOT carried, with reasons.**

1. *"The bullet cannot answer: is a rank number in a brief's prose ever allowed to stay?"* (Codex, low).
   **Not a defect, and out of the bullet's scope.** The bullet lives under `## What NOT to rewrite` — its
   job is to answer *"does the freeze block me?"*, not *"what may I write?"*, which the `## What to write`
   table at `:26-31` already governs. The page's silence also **agrees** with `0159`, which explicitly
   preserves correct rank citations (A1 rows 5 and 7: *"0136 (P114) is correct — do not touch it"*).
   Answering it here would be a substantive addition beyond the ruling — the exact shape of the R1 defect.
2. *"V6 and V7 are recorded but not independently reproducible — the before/after snapshots were not
   retained."* (Codex, low). **Same class as R2, which is fixed and accepted; and the substance is
   corroborated.** The reviewer re-derived V7 against `HEAD` this round: the only rank-cell delta in the
   whole worktree is `0167`'s new row, which is not this task's. V6's *"no new path"* is confirmed by
   `git status` — the round-2 delta adds no path. Re-raising a reproducibility gap whose claim has since
   been independently confirmed would be re-litigation.

### Convergence call — round 2

**Converged. Recommend closeout.** R1's substance is discharged and no new contradiction was introduced;
R2, R3 and R4 are confirmed fixed. The single new finding (R5) is **low, in a worklog, non-blocking**, and
does not touch the shipped page. Both reviewers ran; neither found a defect in the shipped wording. A
third round would be re-reading a settled two-file, one-bullet change.

**Carried forward, not as a finding but as a standing risk:** the mutable-coordinate class (R4, R5) has
now produced **four** wrong or stale citations on the one task that documents the class, and R5 shows the
"anchor by quoted text" remedy binds only where an author remembers to apply it. That is `0160`'s
question, not this task's — it is recorded here so `0160` inherits a fourth data point, including one that
propagated **driver → coder** rather than aging in place.

## Coder response

<!-- CODER-OWNED. The reviewer does not write here. -->

Round 1 response, `fkit-coder`, 2026-07-30. **All four findings verified against the files before any
change. All four CORRECT. All four fixed.** Fixes applied under the owner's Option A ruling (R1) and the
driver's standing approval for R2–R4; no per-fix gate was skipped that applies outside a sanctioned loop.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — reproduced independently | **Defect** (high). Not a frontier-move: the page asserted, under an owner-ruling stamp, a remedy the cited ruling does not contain, and inverted `0159`'s two remedies. | Remedy clause rewritten to `0159` Part A's remedy — *"rewritten to **name the folder ID and drop the rank**; updating it to today's number only reproduces the defect with a fresher date."* The *"append a dated correction / never a silent rewrite"* sentence is **removed**, which also disposes of the secondary ambiguity (what makes a rewrite *"silent"*; where a dated correction attaches to an inline parenthetical) — neither question now arises. `0159` **not touched**. Board-cell scoping, the `124 (0150)`/`0150 (124)` contrast, *"never mass-edited"* and the **2026-07-27** date all kept. **One judgment call, flagged:** the *"Owner ruling, 2026-07-27"* stamp was **moved** to close the scoping-and-reason sentence, so the remedy is no longer stamped as an owner ruling — leaving it at the end would have re-created this finding's root defect in weaker form. | **fixed** |
| R2 | **CORRECT** | **Defect** (medium). The artifact that justifies the only guard on this page was not reproducible from disk. | `worklog.md` rewritten to stand alone: a **9-row check table** defining V1–V9 (what each checks, the command, the result), a **9-of-9 pass roll-up**, the **`340ab5cb…` → `fc4f8e37…` → `b7cc3845…`** hash chain across `HEAD`/round 1/final, and recorded results for the forbidden-link check (V4) and the citation-survival check (V5). The absence of `plan.md` is stated in the opening, with the reason. | **fixed** |
| R3 | **CORRECT** — the claim is false; the conclusion survives | **Defect** (low). Overstated support in the artifact whose job was to justify the date correction. | Statement corrected in `worklog.md`: `sprint-2.md` records several further 2026-07-29 owner rulings (`0165`'s promotion, `0154`'s promotion, the `0162`/`0163`/`0164` filing approval); **none concerns the frozen-history clause**, so **2026-07-27 stands**. The false "only" claim is named as an earlier revision's error rather than silently dropped. | **fixed** |
| R4 | **CORRECT**, and **understated** | **Defect** (low). | Corrected — **and the coordinate moved again**: `:63` (pre-edit) → `:67` (after round 1, the value this finding gives) → **`:68`** (after the round-2 remedy fix, which added one line). The worklog now cites the callout **by its quoted text**, not by line, so the next shift cannot stale it. Recorded as an instance of `0160`'s mutable-coordinate class occurring twice on the task that documents it. | **fixed** |

### Note on the stop-and-raise gate that did not trip

`0161/brief.md:138-142` required the implementer to **stop and raise** on exactly this contradiction, and
it did not fire. Recorded in `worklog.md` with the mechanism: the sentence entered via
`0161/brief.md:87-90`, framed as *"the existing practice"*. It therefore read as **transcription of
something already settled**, not as an addition, so it was never tested against `0159` the way a new
claim would have been. **The gate was sound; its input was mislabelled** — which is precisely how an
unruled claim acquires a ruling's authority. Worth carrying beyond this task: a brief that quotes
"existing practice" without a citation to where that practice is recorded defeats a contradiction gate.

### Re-verified after the fix

V1 (all three clauses, hash now `b7cc3845…` ≠ `fc4f8e37…` ≠ `340ab5cb…`), V2 (`7 2` both homes), the
**corrected** V3 (2 deleted lines per home, exactly the original bullet), V4 (`CLEAN`), V5
(`ADR-029`=3, report=2, callout intact, both homes), V6 (no new path), V7 (`RANKS UNCHANGED`;
wiki-vault untouched at its pre-existing `4 0`), `npm test` (**523 pass, 0 fail**, prove-red hard gate
passed), and a **fresh standalone-read test on the new wording** — both answers recorded in
`worklog.md`. Second home produced by `cp`, not re-typed.

## Accepted residuals (shared, do-not-re-litigate)

<!-- Empty. Nothing here is owner-approved as settled yet. -->
