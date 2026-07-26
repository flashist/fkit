# Review — 0119-track-fkit-coder-declared-approval-carve-out

Task: `ai-agents/tasks/backlog/0119-track-fkit-coder-declared-approval-carve-out/brief.md`
File(s) under review: `claude/agents/fkit-coder.md` (the declared-approval carve-out, `:38-91`)
Scope resolved: commit `a89c917` (2026-07-22) — the carve-out. `ed4122f` (2026-07-25) also touches this
file but is **ADR-033 mover work, out of 0119's scope**; it does not alter `:60-91`.
Reviewers run: **fkit-reviewer (Claude)** + **Codex adversarial pass** (`codex-cli 0.145.0`, exit 0) —
**full model-diverse coverage, no degradation.**
Status: in-review

> **⚠️ This task is owner-verified, not agent-closed** (brief `:76-78`, `:79-89`; sprint-2 `:208-214`).
> No fix round is scheduled — this ledger is the deliverable.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/agents/fkit-coder.md:65-66` | Marker condition (b) says *"it carries a concrete **approved plan**"* — omitting **verbatim**, which ADR-032 A1 and the driver's `fkit-sprint-ship-loop/SKILL.md:109-111` both require. A paraphrased or reconstructed plan literally satisfies the worker-side gate, so the worker's declared **scope boundary** (`:68-69`) can become the driver's summary rather than what the owner approved. **Raised independently by both reviewers.** |
| R2 | 1 | low | `claude/agents/fkit-coder.md:73-82` | ADR-032 A2's **worklog audit obligation** ("MUST record each fix applied without asking and each obvious-winner call") is absent from the Process-review-worker bullet. ADR-032 flags this itself as a known gap; **confirmed unmet in practice** — neither task shipped by this run (`ai-agents/tasks/done/0117-…/`, `…/0118-…/`) contains a `worklog.md`, while 32 other task folders do. Tracked as task **0147**; recorded here because ADR-032 A4 bullet 2's re-raise condition is unsatisfiable without it. |
| R3 | 1 | medium | `brief.md:36`, `:55`, `:90` | The brief states the change is **"in the working tree (uncommitted)"** and instructs *"No commit — leave the edit in the working tree."* **This is false as of this review:** the file is clean (`git status --porcelain claude/agents/fkit-coder.md` → empty); the carve-out was committed in `a89c917` (2026-07-22) and `ed4122f` (2026-07-25). **Both commits are authored by the owner** (`Mark Dolbyrev <ruflashist@gmail.com>`), so **no agent breached the no-commit rule** — the brief is stale, not violated. Recorded because 0119's deliverable *is* the record, and the owner is being asked to verify against it. |
| R4 | 1 | low | `brief.md:66` | Verification step 5 names **"The four `.claude/` mirrors of `fkit-coder.md`"**. There is exactly **one**: `.claude/agents/fkit-coder.md`. The step's *substance* passes — the mirror is byte-identical to the canonical source (both `md5 = e08875aa6baad20d0c2805a6e81dafca`); only the count is wrong. |

### Verified clean — checked and found sound (no finding)

Recorded so the owner sees what was actually tested, not only what failed.

- **Leakage outside the loop (brief Q1).** No reading found under which another spawned context grants
  itself source-write. `:63-64` binds the carve-out to *"its **Build worker** or its **Process-review
  worker**"*; `:89-91` closes with the universal *"**Everything else still refuses**"*. Both reviewers
  independently found nothing. **The guarantee outside the loop is not weakened.**
- **`fkit-process-stateful-review` byte-unchanged (brief Q2) — VERIFIED, not inherited.**
  `git diff a89c917~1 HEAD -- claude/skills/fkit-process-stateful-review/` is empty; the working tree is
  clean; its last commit (`331f298`) predates the carve-out. The claim at `:51` is true.
- **`.claude/` mirror consistency (brief Q3).** Canonical and mirror byte-identical (md5 above).
  `claude/skills/fkit-process-stateful-review/` and `claude/skills/fkit-sprint-ship-loop/` mirrors also
  identical. **No drift.** (Count discrepancy → R4.)
- **Shipped prose vs ADR-032's amendment (brief Q4).** All **eight** `file:line` citations ADR-032 makes
  into `claude/agents/fkit-coder.md` (`:29-32`, `:51-58`, `:60-61`, `:60-72`, `:71-72`, `:73-82`,
  `:76-77`, `:89-91`) resolve **exactly** to the text claimed. The ADR and the file agree on every
  substantive clause **except** R1 (verbatim) and R2 (worklog).
- **The three-signal conjunction (brief Q5) — the conjunction IS required.** `:64-67` reads *"**only**
  under the loop's **declared-approval marker**: **all** of (a) … (b) … and (c)"*. A partial marker does
  not satisfy it. **Reviewer split, resolved:** I initially flagged that the refusal clause at `:89-91`
  illustrates only *missing-plan* cases, giving a worker no exemplar for a missing (a) or (c); Codex
  examined it directly and ruled it clean — *"'all' plus 'Everything else still refuses' covers every
  incomplete conjunction."* **On re-reading I concur with Codex**: *"Everything else still refuses"* is a
  universal, and the em-dash list is illustrative, not an exhaustive enumeration. **Recorded as an
  observation, deliberately not raised as a defect** — inflating this on a guarantee surface would be the
  wrong call.
- **Build vs Process-review asymmetry.** No *second* asymmetry beyond the obvious-winner branch
  (`:76-77` vs `:71-72`) that ADR-032 A2 already concedes in its own text. Both reviewers agree.
- **Verify-step worker.** Correctly receives **no** carve-out — `:63-64` names only two roles, and the
  driver (SKILL.md `:109-111`) attaches the marker only to the Build and Process-review spawns. A verify
  worker returns diagnosis; it does not write.
- **`:50` "a sanctioned autonomy loop" vs `:53` "**Two** loops".** Not exploitable: the enumeration plus
  *"**Nowhere else**"* (`:56`) closes the open-ended phrasing.
- **"Trust, not proof" framing (brief verification step 3).** Present and correct at `:84-91`, citing
  ADR-021 / ADR-031 honesty clause / ADR-032 Decision 7. **It does not overclaim a structural guarantee.**

### Evidence limit — stated, not hidden

The live test case (this session's own Build / Process-review spawn prompts) is **not independently
verifiable from the repository.** I cannot read those prompts from my context, and R2 establishes that no
`worklog.md` was written for either task shipped this run — so the artifact that would record what the
workers did autonomously **does not exist**. I have only the driver's assertion that all three signals
were declared. That assertion is consistent with everything I can see, but it is uncorroborated.

## Suppressed as settled (not re-raised)

Checked against `ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/review.md:66-79` and
ADR-032 A3/A4. Both reviewers were primed with these; neither re-raised any of them.

- **"The declared-approval marker is only prose / unverifiable / forgeable / not hook-enforced."**
  Named and accepted by the owner 2026-07-22 — ADR-032 **A3**. *Re-raise only if* a source write is found
  to have happened on this path without a real owner plan approval. Not observed.
- **"The Process-review worker applies fixes without per-fix owner approval."** Owner-ruled option (b),
  over the coder's narrower recommendation — ADR-032 **A2** / 0111 residual. Settled.
- **"Relay every fix for owner approval instead."** Offered, recommended by the coder, **declined by the
  owner.** Settled.
- **"A spawned coder must never write source."** Deliberately reversed on this one path.
- **"(b) widened the coder's authority"** as a bare tradeoff complaint. Settled by reading; the
  obvious-winner branch is already conceded in ADR-032 A2 and is not a re-raise.
- **Crash/idle stranding of an in-flight `🔄 In progress` task.** 0111 residual R6, owner-ruled accept.

**R1 is not re-litigation.** It is exactly the shape ADR-032 A4 bullet 5 *invites*: a textual
demonstration, quoted, with the divergent clause identified — and it is a **file-vs-ADR mismatch**, which
brief Q4 asks for directly and which no residual covers. ADR-032 A4 bullet 2 explicitly notes the 0111
residual's *"do not patch the coder skill"* does **not** shield `claude/agents/fkit-coder.md`.

## Convergence call

**Act on R1 — this is not a review loop.** Round 1, four novel findings, zero re-litigation of any
settled residual, and the one substantive finding was reached **independently by two different models**.
Nothing here re-opens the consent model the owner ruled on 2026-07-22; the carve-out's design is sound and
its guarantee outside the loop holds. R1 is a **one-word drift** between the recorded ruling and its
implementation, on the clause that defines the worker's scope boundary.

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->
<!-- No fix round is scheduled for 0119: the owner verifies and closes this task personally. -->

## Accepted residuals (shared, do-not-re-litigate)

<!-- Added only on the owner's disposition. Nothing added this round — no owner disposition received. -->

Pre-existing residuals governing this scope live in — and are **not** restated here:

- `ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/review.md:66-79`
- ADR-032 **A3** (the accepted prose-not-proof cost) and **A4** (the four do-not-re-raise guards),
  `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md`
