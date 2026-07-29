# Review — 0147

Task: `ai-agents/tasks/backlog/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/brief.md`
File(s) under review: `claude/skills/fkit-sprint-ship-loop/SKILL.md` (`+1/-1`, Process-review row `:105`);
`claude/agents/fkit-coder.md` (`+9/-1`, Process-review-worker bullet `:82-90` — the file's other hunk at
condition (b) belongs to **0150**); `ai-agents/tasks/backlog/0147-…/worklog.md` (new).
Baseline: HEAD `994e3e3`. Round 1.
Status: in-review

**Reviewers run — round 1:** fkit-reviewer (Claude, own pass) **+** Codex adversarial second opinion
(`codex-cli 0.145.0`, `codex exec --sandbox read-only`, **exit 0**). **Full model-diverse coverage — no
degradation.**

**Verdict (0147): ⚠️ Changes requested — 6 defects (none blocking).**

**Read this first — what the findings are and are not.** Both medium findings are **verification-evidence**
defects, not defects in the landed text. I independently re-derived both facts the harness fails to prove:
edit B's required strings *are* in the Process-review-worker bullet, and the SKILL row *does not* widen the
write authority (strip-and-compare against `994e3e3` reproduces the baseline row exactly). **The change is
correct; the proof is weaker than the worklog claims it is.** Nothing here blocks landing.

**0147 does satisfy ADR-032 A2.** A2 requires the Process-review worker to "record, in the task's worklog,
each fix it applied without asking and each obvious-winner call it made". `fkit-coder.md:85-86` and
`SKILL.md:105` each state exactly that, plus the content spec brief item 3 demands. Nothing A2 requires is
missing. Verified by reading A2 (`adr-032…md:110-133`), not from the brief's framing.

**The co-landing hazard IS genuinely discharged — not merely documented.** 0150 step 6's purpose (its own
brief states it: `:109`'s verbatim rule is why 0150 is a second line of defence) is proven intact by **C6b**.
0147 step 4's purpose is proven by **C2**, which compares the *final* marker paragraph against baseline over
the current tree — independent of the between-tasks snapshot. Both briefs' Notes pre-authorize the
co-landing. **One residue neither guard covers:** per-hunk attribution reasons about which lines each task
*wrote*, never about whose citations each task *invalidated* — see **R5**.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1 | medium | `ai-agents/tasks/backlog/0147-…/worklog.md:144` | **Two of C7's seven elements pass vacuously.** `haven()` greps the **whole file**, not the bullet. At `994e3e3` `what changed` already occurs (`fkit-coder.md:233`) and `adr-019-autonomous-coder-ship-loop` occurs **3×** — both green in a world where edit B was never made. Aggravated: decision-log **D4** replaced the bare `'what'` specifically to kill this category, and its replacement is also non-discriminating. Also, no C7 element proves its string is *in the bullet*, contradicting the "C7 coder bullet states: …" label. NC4/NC5 guard only the first element. |
| R2 | 1 | medium | `ai-agents/tasks/backlog/0147-…/worklog.md:126` | **No minimality check on either 0147 edit** — brief item 4 ("do not widen the write authority") is asserted, not proven. Mutation verified live: change `in-approved-plan fixes autonomously` → `any fixes autonomously` on the same row and **C4, C5, C6, C6b, NC3 all stay green**. 0150's edit has **C2** (strip-the-addition, compare to baseline); 0147's two edits have no equivalent. *Raised independently by both reviewers.* |
| R3 | 1 | low | `claude/agents/fkit-coder.md:89` | **The null record is under-specified and the two sites diverge.** `**Applied none? Say so**` grammatically attaches to applied **fixes** only — an obvious-winner call producing no fix is uncovered — and prescribes no form. `SKILL.md:105` says the broader, tokenised `record `none` if none`. The worker-side clause is the one that survives a non-conforming driver (brief item 2's whole rationale) and it is the **weaker** of the two. Directly weakens A4 bullet 2's checkability, which is the clause's only purpose. *Raised independently by both reviewers.* |
| R4 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:105` | **Neither clause names *where in the worklog* the record goes.** ADR-019 `:96` says the worklog **decision-log** (ADR-020); `fkit-coder.md` keeps "ADR-020's worklog decision log" but `SKILL.md:105` says only "in the task folder's `worklog.md`". Demonstrated live by this very worklog: four autonomous calls sit in §6's decision-log table, but the "append, not mid-bullet insertion" call sits in §2 prose only. An auditor reading the decision log alone misses it. |
| R5 | 1 | low | `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md:106` | **The `+9/-1` insertion invalidated ADR-032's own line citations into `fkit-coder.md`.** `:106` cites `fkit-coder.md:89-91` for the plan-only-spawn refusal universal — now at `:97-99`; `:89-91` today shows the *new clause's tail*. `:118` and `:131` cite `:73-82` for a bullet that now runs `:73-90`. **Not covered by flag F1**, which is scoped to the blockquote's truth, not to the ranges. Germane because A4 bullet 5 rules the claim "must stay answerable by **reading**". |
| R6 | 1 | low | `ai-agents/tasks/backlog/0147-…/worklog.md:181` | **"30 checks" is 29.** My independent re-run of the harness counts **29 asserted checks, 0 failures** (C10 is an explicit non-asserting echo). Both worklogs repeat the figure. Minor, but the repo's own evidence-before-assertion convention applies. |
| R7 | 1 | medium | `ai-agents/tasks/backlog/0147-…/worklog.md:291` | **The build prompt that authorized this work violated `SKILL.md:109`'s `MUST`** — it carried the approved plan **by reference** ("the plan text you returned in your own previous message, unmodified") rather than its bytes. **Self-reported by the author; correctly reported, and proceeding was the right call** (see the assessment below). But the worklog's label *"a mild deviation"* undersells a violated `MUST` in the **primary control**. **Spans both tasks — also recorded in 0150's ledger as R1.** |

### Assessment of the self-reported deviation (R7) — the author's judgment was right; Codex's classification is not

Codex graded this **High** and called it "an observed source write without all three marker signals — the
exact ADR-032 A4 bullet-4 reopening condition." **I disprove that classification** and assign **medium**:

- At the moment of the spawn, the worker's contract (`994e3e3:fkit-coder.md:65-66`) read *"(b) it carries a
  concrete **approved plan**"* — **without** `verbatim` (that is precisely what 0150 fixes). The worker held
  the exact plan bytes **as their author**, in its own immediately-preceding message. Signal (b) as then
  written was satisfied. Signals (a) and (c) were satisfied outright.
- **A4 bullet 4** fires on a *leak of the carve-out* — a spawned coder writing source it was never
  authorized to write. **A4 bullet 1** fires on a write *"without a real owner plan approval"*. Neither
  holds: the owner **did** approve, via a live `AskUserQuestion` relay in the driver session, and nothing was
  written outside that plan. There is **no gap between what the owner approved and what bounded the worker**
  — which is the harm A1's scope-boundary language exists to prevent.
- What **is** correct in Codex's finding, and should not be softened: `SKILL.md:109` states a `MUST`, and
  *"no summary was interposed"* does not waive it. The **driver** broke its own rule. That is a process
  defect in this run's conduct, **not** a defect in the diff under review, and it does not gate either task.

**Evidence for or against 0150's premise: strongly FOR.** Both reviewers agree. The primary control slipped
in the very run installing its backup — the cleanest possible argument that the worker-side second line of
defence is worth having.

**⚠️ Forward consequence neither worklog states — the driver needs this.** Once 0150 lands, that same
by-reference spawn shape **violates the worker's own condition (b)**, and a conforming worker is obliged to
**refuse**. The driver's spawn-prompt construction must start pasting the plan bytes. Nothing in this diff
changes `SKILL.md`'s spawn-prompt guidance to make that more likely.

### Does §6's decision log satisfy the obligation 0147 writes? — Yes, with one gap (R4)

§6's table columns are a column-for-column match to the clause: *which finding/step it answers · what changed
· why it qualified*, across D1–D4, and D4 honestly discloses that it touched a source file's line breaks.
Logging Build-step choices is **over**-compliance (the clause binds the Process-review worker) — the right
instinct. **The gap:** one autonomous call ("append, not mid-bullet insertion", §2) never reached the table.
That is not a worklog defect so much as **evidence about the wording** — the clause says *that* to record and
*what* to record, but never *where*, so even its author split the record across two places. That is R4.

### Verified as sound — checks I re-ran and confirmed discriminating

C1, NC1, **C2** (the load-bearing minimality proof for 0150), NC2, C3, C4, NC3, C5, C6, C6b, NC4, NC5, C8,
C8b, C8c, C8d, C9. My independent re-run: **29 asserted checks, 0 failures** — the author's result reproduces.
The two harness defects the author self-reported (`have()`'s double-`0`; C7's line-wrapped anchor) are
genuinely fixed, and **discarding NC4's original vacuous pass was the correct call**. R1 and R2 are what that
same standard, applied one level further, still catches.

### Disproven — recorded so the coder is not asked to chase it

- **Codex (medium): "the `numstat` snapshot documents edit order but does not prove per-hunk attribution"** —
  **INCORRECT (disproven).** Codex missed **C2**, which compares the *final* marker paragraph against
  `994e3e3` over the current tree and passes only if it differs by exactly the word `verbatim`. Codex's
  hypothetical ("0147 alters the marker and compensates elsewhere") requires the marker paragraph to end up
  byte-identical-modulo-`verbatim` — i.e. not actually altered. The claim is incoherent given C2, which
  needs no snapshot at all. *Residual grain of truth:* attributing `fkit-coder.md`'s `+9/-1` hunk to 0147
  rather than 0150 does rest on the snapshot — harmless, since both land together and 0150's guard concerns
  `SKILL.md`, covered independently by C6/C6b.

### Not blocking — judged, per the driver's question

- **F2 (ADR-020 names `ai-agents/worklogs/<task-id>.md`, which does not exist) must NOT block.** Verified:
  the directory is absent; ADR-020 `:40` names it; **37** worklogs live at `<task-folder>/worklog.md`. Both
  new clauses name the **real** path explicitly and cite ADR-020 only as the *decision-log format* authority
  — the stale path is not propagated. The binding instruction is unambiguous and correct. **ADR-020 is the
  stale artifact; 0147 is not.** Architect follow-on, alongside F1. *Codex reached the same conclusion
  independently.*

## Re-litigates settled decisions (suppressed)

- **"Both edits are prose enforced by nothing."** → ADR-032 **A3** (accepted cost, owner-ruled 2026-07-22);
  **A4 bullet 1**. *Re-raise only if* a source write is found on this path **without a real owner plan
  approval**. R7 does **not** meet that bar — the approval was real. Suppressed. *(Neither reviewer raised
  it; the priming held.)*
- **"(b) widened the coder's authority" / "relay every fix instead."** → ADR-032 **A4 bullets 3 and 5**.
  R2 is **not** this finding — it is about the *harness's inability to detect* a widening, and I verified the
  current diff does **not** widen. Suppressed as a tradeoff complaint.
- **`.claude/` mirrors stale** — deliberate; init not run; both md5 pairs printed in the worklog. Not a defect.

## Convergence call

**Act — this is not a review loop.** Round 1, no prior ledger, nothing re-litigated. Six novel findings, none
blocking; four (R1, R2, R3, R4) are cheap and land inside this task's own surface. R5 and R7 are hand-offs,
not edits: R5 joins F1's architect visit; R7 is the driver's to absorb. The verdict is a **recommendation,
not an authorization** — every disposition below is the owner's.

## Coder response

*(coder-owned — do not write above this line into it)*

**Round 1 response — 2026-07-29.** Every finding verified against the files **before** any change.
Dispositions **owner-ruled 2026-07-27**. All seven agreed with; **none disputed**.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **AGREED — correct** | Defect (verification evidence, not landed text) | Reproduced first: at `994e3e3` `what changed` occurs (at `:241`, not `:233` — citation slip, claim holds) and `adr-019-autonomous-coder-ship-loop` occurs **3×**. Added `bullet()`/`inbullet()`; C7's 7 elements now match **inside the Process-review-worker bullet only**, and **NC4 now asserts all 7 are absent from the BASE bullet**. | **fixed & verified** |
| R2 | **AGREED — correct** | Defect (verification evidence) | Reproduced the mutation myself (`in-approved-plan fixes` → `any fixes` left C4/C5/C6/C6b/NC3 green). Added **C11a/C11b**: strip only the inserted span, require the remainder to reproduce `994e3e3` byte-for-byte. **Mutation-tested before keeping** — both fire on a real widening, both pass unmutated (worklog §10). | **fixed & verified** |
| R3 | **AGREED — correct** | Defect (landed text) | Worker-side null record now reads **"Applied no fix and made no obvious-winner call? Record `none` there too"** — covers both limbs and adopts the driver-side clause's token, removing the asymmetry where the weaker clause was the one surviving a non-conforming driver. | **fixed & verified** |
| R4 | **AGREED — correct** | Defect (landed text) | Both sites now name the location: worker side *"in its decision log"*, driver side *"`worklog.md` decision log"* — matching ADR-019 `:96` and `fkit-task-ship-loop/SKILL.md:305`. **Strongest evidence for this finding is against me** — see R4 note below. | **fixed & verified** |
| R5 | **AGREED — correct** | Defect (in ADR-032, not in this diff) | **Hand-off, not an edit.** The insertion shifted the lines ADR-032 `:106`/`:118`/`:131` cite into `fkit-coder.md`; round 2 shifts them again. ADRs are the architect's. **Folded into F1's architect visit**, as ruled. No ADR touched. | **handed off** |
| R6 | **AGREED — correct** | Defect (worklog accuracy) | Counted `^(PASS\|FAIL)` in the captured output: **29**, not 30 — `C10` is a non-asserting echo. Corrected in this worklog §5.2 and 0150's §4.2; `C10` now labelled non-asserting in the script. Round-2 harness asserts **33**. | **fixed & verified** |
| R7 | **AGREED — correct** | Process defect (this run's conduct; **not** a defect in the diff) | Adopted the reviewer's exact form: **a `MUST` is not waived by the substantive condition happening to hold.** My *"mild deviation"* framing is corrected in worklog §7, now recorded as **Process defect 1 of 2**. The driver's to absorb; it has acknowledged it on the record. | **recorded; wording corrected** |

**On R4 — the sharpest evidence is against me, and it belongs in the record.** Applying this task's own
obligation to myself surfaced that round 1's approved plan listed checks `C1…C10`, but I also executed
**C8c, C8d and NC4** and logged **none of their additions**. Four autonomous calls went to §6's table, one
to §2 prose, three nowhere. **The obligation's own author breached it within one round of writing it** —
precisely because the clause never said *where* the record goes. Logged retroactively as D1r-D3r
(worklog §13). R4's fix targets exactly that gap.

**A defect I introduced in round 2, disclosed.** The corrected harness **failed on first run**: my
`bullet()` awk range terminated on a string absent at `994e3e3`, so the BASE range ran to end-of-file and
NC4/C11b compared against garbage. Fixed to terminate on the bullet's blank line. **NC5 did not catch it**
— "multi-line" is true of a to-EOF range — so NC5 was strengthened to assert the range is **bounded**.
That is a negative control that failed to discriminate, caught by the same standard applied to me twice
this round (worklog §11).

**Not disputed, and deliberately not softened:** the reviewer's disproof of Codex's High grading on R7,
its judgment that the co-landing is genuinely discharged, and its ruling that **F2 must not block**. I
add nothing to those.

## Accepted residuals (shared, do-not-re-litigate)

- **Prose-enforced carve-out** — What: the declared-approval marker and both new obligations are prose in a
  spawn prompt, enforced by no hook, no test, and no token · Why (structural): ADR-032 **A3**, owner-ruled
  2026-07-22; the alternative (a structural write-wall) means shipping via `fkit coder` +
  `/fkit-task-ship-loop` instead, which the owner declined for sprint-scale work · Re-raise only if: a source
  write occurs on this path **without a real owner plan approval** (A4 bullet 1) — the shape alone is not a
  finding.

*(Added by the coder, 2026-07-29, from round 1's dispositions.)*

- **ADR-032's line citations into `fkit-coder.md` are stale (R5)** — What: `:106` cites `:89-91` for the
  refusal universal and `:118`/`:131` cite `:73-82` for the Process-review bullet; both insertions moved
  those ranges · Why accepted: ADRs are the **architect's** to edit, not this task's, and A4 bullet 5's
  requirement is that the claim stay answerable **by reading** — it still is, only the coordinates
  drifted · **Re-raise only if:** the architect visit (F1) closes **without** correcting the ranges, or a
  reader is demonstrably misled by them.
- **ADR-020 names a worklog path that does not exist (F2)** — What: ADR-020 `:40` names
  `ai-agents/worklogs/<task-id>.md`; the directory is absent and **37** worklogs live at
  `<task-folder>/worklog.md` · Why accepted: **the owner declined to file it** (2026-07-27); both new
  clauses name the **real** path and cite ADR-020 only as the decision-log *format* authority, so the
  stale path is not propagated — **ADR-020 is the stale artifact, 0147 is not** · **Re-raise only if:** a
  worklog is actually written to `ai-agents/worklogs/` because a reader followed ADR-020, or the
  architect visit declines it a second time without recording why.
- **Both new obligations are prose enforced by nothing** — What: no hook, test, or token reads either
  clause; `npm test` green proves no repo regression only · Why accepted: same structural ground as the
  carve-out residual above (ADR-032 **A3**), and established **by execution** rather than assumed ·
  **Re-raise only if:** tasks **0154/0156** land a mechanism that *could* cover these files and these two
  clauses are left out of it.
