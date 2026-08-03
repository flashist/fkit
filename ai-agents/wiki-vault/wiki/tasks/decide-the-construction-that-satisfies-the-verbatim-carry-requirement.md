# Decide the construction that satisfies the sprint-loop's verbatim-carry requirement

**Source**: `ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified** (2026-08-02)
**Sprint/Tag**: Sprint 2 · task `0162` · owner `fkit-architect`
**Report**: `ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`

## Goal
`/fkit-sprint-ship-loop` requires the Build **and** Process-review spawn prompts to *"carry the approved plan verbatim"* — and gives **no construction for satisfying it**. Not in the skill, not in `fkit-coder.md`, not in ADR-031 or ADR-032. Decide what a faithful carry actually is.

> ⚠️ **READ THE EVIDENCE CLASSES BEFORE THE FINDINGS — this is the report's own central discipline, and a summary that flattens it has lost the report.**
> - **Checkable** — verified firsthand against live files, every claim cited by path and line. All the findings, the machine-checkability analysis, the ADR-037 interaction, and the evidence table.
> - **Testimony** — the sprint driver's account of its **own past conduct**, unverifiable from disk. The two carry failures that scoped the task, the driver's claim it pasted three plans in full, its near-miss self-report, and its account of the owner's rulings. **No session transcript is stored in this repo** (`find . -name "*.jsonl"` excluding `node_modules/` → empty).
> - **No conclusion depends on testimony.** Two draw *illustrative* support from it and survive stripped of it, losing an illustration rather than a basis. **The report says so itself rather than overstating its own separation.**
> - **Where the two meet, disk wins — and disk won.** The driver reported compressing *"five Q&A pairs"*; on disk that section has **four** rows and its own prose says *"All four"*. **The single checkable detail inside the testimony was wrong** — a model misreporting a document it had authored hours earlier, in the same breath as reporting carefully on its own reliability.

## Key Changes

### The ruling: a faithful carry is a **copy**, never a recall

> **A language model restating a long text from its own conversation context cannot be relied on to reproduce it byte-for-byte, nor to detect its own failure to do so.**

Both halves matter and **the second is the dangerous one**. The failure that scoped this task did not merely truncate — it truncated **and certified completeness** (*"everything else is byte-for-byte"*). A truncation that announces itself is a defect a reader can act on; **a truncation that certifies itself is a claim the reader has no way to check.**

**Therefore a faithful carry cannot be defined as accurate recall.** No instruction — *"be careful"*, *"do not summarize"*, *"carry it verbatim"* — makes recall reliable, because the failure is invisible to the thing being instructed.

**The construction, four steps the driver can actually perform:** read the file **byte-exactly in the spawning turn** with `Bash(cat …)` → **verify the read was whole** against `wc -c` and `git hash-object` → **paste those bytes unaltered** → **cite path + content hash alongside**. The word "verbatim" then becomes **true by construction rather than true by effort**.

> ⚠️ **NOT the `Read` tool — the obvious choice is the wrong one, and a follow-up was about to copy it into a `SKILL.md`.** `Read` returns `cat -n` framing (a line number and tab on **every** line) and caps at 2000 lines. Two fatal consequences: pasted "unaltered", its `git hash-object` can **never** equal the file's blob hash, so the pointer and the hook would disagree on every *well-behaved* spawn; and the line cap **silently truncates a long plan** before the driver forms any judgment about it. Stripping the framing by hand re-introduces the exact transformation the construction exists to remove.

**The discipline that would have killed the failure:** ***"Verbatim" is a word a driver may apply only to bytes it read from a file that turn.*** True by construction, or forbidden.

### The owner's four rulings (`AskUserQuestion`, live driver session, 2026-08-02)

| # | Ruling |
|---|---|
| **OQ-1** | **PASTE *and* PATH/HASH POINTER — both, not either/or.** The paste is what the worker acts on and satisfies condition (b) as written; the pointer is what makes the paste **checkable**. **A paste alone is unfalsifiable, which is precisely why the false certification worked.** |
| **OQ-2** | **File the carry-check hook as a follow-up, gated on the `plan.md` fix. Do not build it here.** |
| **OQ-3** | **Dated correction note on ADR-037 §5 — amend the ADR.** Not written by this task. |
| **OQ-4** | **NOW — rank the `plan.md` fix and drive it this sprint.** Ruled after review round 1, once a confirmed live failure turned the risk from hypothetical into real. The change is *"to prose in a step table, not to running code."* |

**Truncation of a carried plan is never permissible** — not with a declaration, not with an ellipsis, not "omitting rationale only". If the plan will not fit, the driver carries **by reference only and says so in those words**. Never a partial paste. A pointer-only spawn is a **degraded** carry that the spawned coder is entitled to refuse, **and that is the correct outcome**: a degradation that stops the work is recoverable; one that certifies itself is not.

**Condition (b) stands byte-unchanged.** What changes is where the bytes come from and that a pointer rides along — both additions to the **driver's** obligation, neither weakening the **worker's** condition. So `0150`'s guarantee is not reopened and no ADR-altitude reversal is required.

## Outcome

### The task demonstrated its own defect twice, in production

1. **At spawn.** The owner's ruling is *paste **and** pointer* — and the prompt that spawned the report carried the paste and **no pointer**, because the plan file **did not exist yet**. The loop does not write it until Build. **The approved construction was unavailable at the moment it was supposed to be used, on its own task, hours after being approved.**
2. **At Build — the confirmed production failure.** The `plan.md` the Build worker then wrote was **not the approved plan**. Confirmed on disk during the task's own review round: blob `2458a57e…`, 9625 bytes, and **two distinctive strings from the approved text are absent from it**. It is the worker's **re-rendering** — the identical recall-versus-copy failure, one layer down. Had the next spawn carried it by pointer with a matching hash, **the carry would have verified green against bytes the owner never approved.**

### What is machine-checkable — stated narrowly on purpose

- **Worker-side: no. Impossible**, not merely hard. The worker has nothing to compare against; the owner channel is session-only.
- **Driver-side: yes — a `PreToolUse` hook on the `Task` matcher**, using the same deny route the skill-ownership hook already ships and mutation-tests. **Five caveats, all carried into the follow-up:** it checks a **carry-fidelity proxy for (b) only**, never (a), (c), or (b) as written; it is **hard-gated** on the `plan.md` fix; the sibling hooks' jq-free quote matching **cannot** parse a spawn-prompt field and it needs real JSON parsing; it is **time-of-check only** (a `plan.md` rewritten afterwards leaves a green check standing over stale bytes); and **hooks exist only in launcher-built sessions** — a plain `claude` session is unguarded.

> **The one thing a reader must not conclude:** that a green carry-check means the marker held. It means the pasted bytes match a named file — **a proxy for part of one of three conjunctive signals. No signal is verified as written, and all three remain trust.**

### ⛔ The accepted residual `carried-not-approved` — open, structural, and NOT closed by `0202`

**The hash pins which bytes were *carried*, not which bytes were *approved*.** A driver that writes a `plan.md` the owner never approved and then carries it faithfully produces a green check over bytes the owner never saw, and **nothing detects it**.

**It is structural, not provisional.** Approval is granted in a **session channel that leaves no artifact**: `claude/askuserquestion-marker-hook.sh` writes an **empty** marker — it records *that* the tool was called, never the question or the answer — and no session transcript is stored in the repo.

**The owner accepted the gap** rather than commissioning a control, on the characterization that **the construction is tamper-evidence against sloppiness, not a guarantee against a driver that fabricates**.

⚠️ **[[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] (`0202`) closes only the *reconstruction route*, not the class** — and must not be recorded as if it does. **Fixing the likely route is not fixing the class.**

**Re-raise only if** one of three testable things becomes true: the harness persists the **content** of an `AskUserQuestion` exchange to any readable artifact (concretely, that marker file becomes non-empty); **or** session transcripts become stored in-repo; **or** a **second** carried-vs-approved divergence occurs **after** `0202` has landed — which would mean the diagnosis, not just the gap, needs reopening.

⛔ **Do NOT re-raise** that the marker is forgeable or that this is unenforced prose — both are fenced by ADR-037 — or that `0202` ought to have closed this.

### It narrows ADR-037 §5 — and the ADR still says the stronger thing
The report establishes that ADR-037 §5's *"none is possible"* is **too strong, but only about a proxy**. See [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]]. The correction is task **`0205`**, unstarted. **This is a narrowing, not a reversal**, and it does not trip the ADR's pre-registered re-raise trigger — *a file on disk is not a cross-context token*.

### Corrections to its own brief
The brief's `SKILL.md` line citations are **off by one** in two places (`0206`-adjacent cleanup, task `0207`-adjacent). And its claim that *"no test reads … any `SKILL.md` content at all"* is **half wrong**: the **frontmatter** of every skill and agent file *is* machine-checked over a pinned corpus of 25 skills and 7 agents. **The accurate claim is that no test reads the *body* of any of them** — which is where every rule at issue lives. The conclusion survives, narrowly, and was corrected rather than inherited.

## Related
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — §5's enforcement claim, **narrowed by this report**; correction owed (`0205`)
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202`, follow-up 1, the only follow-up shipped so far
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158`, the sibling ruling from the same run
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — D3/D7, the declared-approval marker's home
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — task `0150`, condition (b)'s *verbatim*; **not reopened by this ruling**
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why worker-side detection is impossible and why the residual is structural
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the plan-gate honesty clause
- [[tasks/build-fkit-sprint-ship-loop-skill]] — the loop whose rule this construction satisfies
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, the citation form; its stale-coordinate arc claims two more instances here
- [[systems/testing-and-verification]] — the frontmatter-vs-body test-surface split
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
