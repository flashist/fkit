# Review — 0150

Task: `ai-agents/tasks/backlog/0150-add-verbatim-to-fkit-coder-declared-approval-marker/brief.md`
File(s) under review: `claude/agents/fkit-coder.md` (`+1/-1`, condition (b) of the declared-approval marker,
`:66` — the file's other hunk at `:82-90` belongs to **0147**); `ai-agents/tasks/backlog/0150-…/worklog.md`
(new). Baseline: HEAD `994e3e3`. Round 1.
Status: in-review

**Reviewers run — round 1:** fkit-reviewer (Claude, own pass) **+** Codex adversarial second opinion
(`codex-cli 0.145.0`, `codex exec --sandbox read-only`, **exit 0**). **Full model-diverse coverage — no
degradation.**

**Verdict (0150): ⚠️ Changes requested — 2 defects (none blocking).**

**Read this first — the source edit is clean.** Neither finding is a defect in the one-word change. R1 is a
process defect in the **driver's** conduct of this run; R2 is an overstated claim in the worklog. The edit
itself is the best-proven thing in this pair: **C2** does not merely check that `verbatim` appears, it strips
the word and reproduces the baseline marker paragraph byte-for-byte, so *nothing else in the marker changed*
— and **NC2** proves C2 would catch a no-op. I re-ran both independently: PASS.

**0150 closes the gap it names, and there is no fourth *live* site.** Verified by my own search, not
credited: `claude/agents/fkit-coder.md:66` ✅ now carries `verbatim`; ADR-032 **A1** `:97` ✅; the driver's
`SKILL.md:109-110` ✅. All three agree on the requirement. Two further restatements exist and neither is a
runtime control — `ai-agents/tasks/done/0119-…/brief.md:26` (a **historical record of the defect 0119
found**, correctly showing the pre-fix wording) and the wiki task summary in **R2**.

**`a concrete` deliberately kept, not raised to ADR-032 A1's `the concrete` — correct call.** The brief says
*"Scope is one word"* twice, and its step 2 asks the two texts to agree on the **requirement**, not to be
byte-identical. The article is not the requirement. Owner-ruled; **not** re-litigated here.

**The co-landing hazard IS genuinely discharged for this task — not merely documented.** Brief step 6 demands
`SKILL.md` be untouched; in the shared tree 0147 edits it. The guard's own stated *purpose* — brief step 6:
`:109`'s verbatim rule "was already correct and is the reason this is a second line of defence rather than the
primary one" — is proven intact by **C6b**, and **C6** proves `SKILL.md` changed on exactly one line. 0150
contributed nothing to it. The guard was not weakened.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1 | medium | `ai-agents/tasks/backlog/0150-…/worklog.md:273` | **The build prompt that authorized this work violated `SKILL.md:109`'s `MUST`** — it carried the approved plan **by reference** ("the plan text you returned in your own previous message, unmodified") rather than its bytes. **Self-reported by the author; correctly reported, and proceeding was the right call** (assessment below). But the worklog's label *"a mild deviation"* undersells a violated `MUST` in the **primary control**. **Spans both tasks — also recorded in 0147's ledger as R7.** |
| R2 | 1 | low | `ai-agents/tasks/backlog/0150-…/worklog.md:37` | **"No hidden fourth copy left to keep in sync" is overstated.** The search covered `claude/` and `knowledge-base/decisions/`; the claim is stated **repo-wide**. `ai-agents/wiki-vault/wiki/tasks/track-fkit-coder-declared-approval-carve-out.md:17` restates all three marker signals and still says *"carries a concrete **approved plan**"* — **no `verbatim`**. Verified. Does **not** block: the vault is not runtime authority, both vault **ADR-032** copies already carry `verbatim`, and only **fkit-wiki** may write the vault. *Raised by Codex; confirmed by me.* |

### Assessment of the self-reported deviation (R1) — the author's judgment was right; Codex's classification is not

Codex graded this **High** and called it "an observed source write without all three marker signals — the
exact ADR-032 A4 bullet-4 reopening condition." **I disprove that classification** and assign **medium**:

- At the moment of the spawn, the worker's contract (`994e3e3:fkit-coder.md:65-66`) read *"(b) it carries a
  concrete **approved plan**"* — **without** `verbatim`. That is exactly the drift this task fixes. The
  worker held the exact plan bytes **as their author**, in its own immediately-preceding message, so signal
  (b) as then written was satisfied; (a) and (c) were satisfied outright.
- **A4 bullet 4** fires on a *leak of the carve-out* — a spawned coder writing source it was never authorized
  to write. **A4 bullet 1** fires on a write *"without a real owner plan approval"*. Neither holds: the owner
  **did** approve, via a live `AskUserQuestion` relay in the driver session, and nothing was written outside
  that plan. There is **no gap between what the owner approved and what bounded the worker** — the harm A1's
  scope-boundary language exists to prevent.
- What **is** correct in Codex's finding, and should not be softened: `SKILL.md:109` states a `MUST`, and
  *"no summary was interposed"* does not waive it. The **driver** broke its own rule. That is a process defect
  in this run's conduct, **not** a defect in this diff, and it gates neither task.

**Evidence for or against this task's premise: strongly FOR.** Both reviewers agree, independently. 0150's
premise is that the driver's `:109` can fail and the worker-side clause is the needed second line of defence.
**It did fail — in the very run that installed the backup.** That is as direct a vindication as this task
could have asked for, and it is the strongest single argument for landing 0150.

**⚠️ Forward consequence neither worklog states — the driver needs this before its next run.** Once this
lands, that same by-reference spawn shape **violates the worker's own condition (b)**, and a conforming
worker is **obliged to refuse**. The driver's spawn-prompt construction must start pasting the plan bytes.
Nothing in this diff changes `SKILL.md`'s spawn-prompt guidance to make that more likely — a candidate
follow-on task, not this task's work.

### Verified as sound — checks I re-ran and confirmed discriminating

**C1** (`verbatim` present in (b), exactly once), **NC1** (that exact string **absent** at `994e3e3`, so C1
tests the change), **C2** (the marker paragraph differs from baseline by exactly the word `verbatim`),
**NC2** (C2 would catch a no-op), **C3** ×3 (three signals, joined by **all** of), **C6b**, **C8/C8b/C8c/C8d**
(refusal universal, trust-not-proof paragraph, Build-worker bullet, STOP conditions — all byte-unchanged).
My independent re-run of the full harness: **29 asserted checks, 0 failures** — the author's result
reproduces. **Every 0150-owned check is genuinely discriminating.** The vacuity findings in the shared harness
land on **0147's** checks, not this task's — see 0147's ledger R1/R2.

*(Count nit, shared: both worklogs say "30 checks"; the asserted total is **29** — C10 is an explicit
non-asserting echo. Recorded as **R6 in 0147's ledger** only, to avoid double-charging one nit.)*

### Not blocking

- **Line 66 is now 113 characters, up from 104.** Verified against the file's own range: it already carries
  193-, 180-, 176-, 166- and 161-character lines. **No reflow was correct** — reflowing would have pushed the
  diff onto line 67, which carries part of signal (c), for no benefit. Single-line diff preserved. Not a defect.
- **`.claude/` mirror deliberately stale** — init not run; the mirror md5 `e08875aa…` is exactly the pre-edit
  canonical value brief 0150 cites, confirming it was in sync before this build. Not a defect.

## Re-litigates settled decisions (suppressed)

- **"The declared-approval marker is only prose / unverifiable / forgeable."** → ADR-032 **A3**, owner-ruled
  2026-07-22; **A4 bullet 1**. *Re-raise only if* a source write is found on this path **without a real owner
  plan approval**. **R1 does not meet that bar** — the owner's approval was real; only the plan's *transport
  form* deviated. Suppressed as a re-raise; recorded as a process defect instead.
- **"Do not re-decide the carve-out" / "(b) widened the coder's authority."** → ADR-032 **A4 bullets 3 and 5**.
  Neither reviewer raised it. This task **narrows** a condition to match the ruling; it widens nothing.
  Confirmed by C2.

## Convergence call

**Act — this is not a review loop.** Round 1, no prior ledger, nothing re-litigated. The one-word source edit
is **clean and better-proven than anything else in this pair**; I recommend it land. R2 is a one-sentence
scope narrowing in the worklog plus an **fkit-wiki** follow-on (the vault page can ride with task **0148**,
which is already queued to re-ingest the amended ADR-032). R1 is the **driver's** to absorb, not the coder's —
it is about how the next spawn prompt is built. The verdict is a **recommendation, not an authorization**;
every disposition below is the owner's.

## Coder response

*(coder-owned — do not write above this line into it)*

**Round 1 response — 2026-07-29.** Both findings verified against the files **before** any change.
Dispositions **owner-ruled 2026-07-27**. Both agreed with; **neither disputed**.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **AGREED — correct** | Process defect (this run's conduct; **not** a defect in this diff) | Adopted the reviewer's exact form: **a `MUST` is not waived by the substantive condition happening to hold.** My *"mild deviation … put nothing at risk"* framing undersold a violated `MUST` in the **primary** control and reproduced the reasoning the finding rejects. Corrected in worklog §5, now **Process defect 1 of 2** — a **second** surfaced this round (the process-review prompt was also non-verbatim **and asserted it was byte-for-byte**; I returned `NEEDS-DECISION` rather than absorb it, and the owner ruled it through on 2026-07-27). The driver's to absorb; acknowledged on the record. **No source change.** | **recorded; wording corrected** |
| R2 | **AGREED — correct** | Defect (my worklog's wording, not the code) | Verified the vault copy myself, read-only: `ai-agents/wiki-vault/wiki/tasks/track-fkit-coder-declared-approval-carve-out.md:17` restates all three signals and still reads *"carries a concrete **approved plan**"* — **no `verbatim`**. Worklog §1 **narrowed to its actual search scope** (`claude/` + `knowledge-base/decisions/`), with the vault copy named. **Routed to task 0148** — I did not and **may not** edit the vault; only `fkit-wiki` writes it. | **fixed & verified; vault copy handed off to 0148** |

**This task's source edit is unchanged in round 2.** Neither finding touches
`claude/agents/fkit-coder.md:66`. The edit still stands at **`+1 / -1`**, and **C2** — strip the inserted
word and the marker paragraph reproduces `994e3e3` byte-for-byte — still passes. The round-2 changes to
`fkit-coder.md` belong to **0147** (its bullet grew by one line under R3/R4 there).

**Recorded, not softened:** the reviewer's disproof of Codex's High grading on R1, and its finding that
this task's own checks are **all genuinely discriminating** — the shared harness's vacuity problems
(0147 R1/R2) land on 0147's checks, not on 0150's. I claim no credit beyond that and add nothing to it.

**Shared count nit:** *"30 checks"* was **29**; corrected in worklog §4.2. Charged once, as **R6 in
0147's ledger**.

## Accepted residuals (shared, do-not-re-litigate)

- **Prose-enforced carve-out** — What: the declared-approval marker's three signals are prose in a spawn
  prompt, enforced by no hook, no test, and no token · Why (structural): ADR-032 **A3**, owner-ruled
  2026-07-22; the alternative (a structural write-wall) means shipping via `fkit coder` +
  `/fkit-task-ship-loop`, which the owner declined for sprint-scale work · Re-raise only if: a source write
  occurs on this path **without a real owner plan approval** (A4 bullet 1) — the shape alone is not a finding.
- **`a concrete` kept over ADR-032 A1's `the concrete`** — What: condition (b) reads *"it carries a concrete
  **approved plan** verbatim"* while A1 `:97` reads *"the concrete"* · Why (structural): brief 0150 scopes
  the task to **one word** twice over, and its step 2 requires the two texts to agree on the **requirement**,
  not to be byte-identical; the article carries no requirement. Owner-ruled at the build gate ·
  Re-raise only if: the article is shown to change what condition (b) demands of a spawn prompt.

*(Added by the coder, 2026-07-29, from round 1's dispositions.)*

- **A fourth copy of the marker survives in the wiki vault (R2)** — What:
  `ai-agents/wiki-vault/wiki/tasks/track-fkit-coder-declared-approval-carve-out.md:17` restates all three
  signals and still reads *"carries a concrete **approved plan**"*, with **no `verbatim`**; verified
  read-only · Why accepted: the vault is **not runtime authority**, both vault copies of ADR-032 already
  carry `verbatim`, and **only `fkit-wiki` may write the vault** — the coder neither did nor may. Routed
  to task **0148**, already queued to re-ingest the amended ADR-032 · **Re-raise only if:** 0148 closes
  **without** the vault page being corrected, or a vault copy is cited as authority for what a spawn
  prompt must carry.
- **The driver's spawn-prompt construction is unchanged by this diff** — What: nothing here makes the
  driver more likely to paste the plan bytes; the control that failed is `SKILL.md:109`'s prose · Why
  accepted: out of scope — this task installs the **worker-side** second line of defence, which is
  exactly what caught the failure both rounds · **Re-raise only if:** the high-ranked `SKILL.md`
  spawn-prompt follow-on is dropped, or a third consecutive by-reference spawn occurs.
