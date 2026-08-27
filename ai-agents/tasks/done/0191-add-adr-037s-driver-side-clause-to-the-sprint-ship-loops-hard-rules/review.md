# Review — 0191

Task: 0191 — [brief](./brief.md)
File(s) under review: `claude/skills/fkit-sprint-ship-loop/SKILL.md` (working-tree lines 285–297, +13/−0, one hunk);
task-record artifacts `worklog.md`, `plan.md`, `brief.md` in the same folder.
Status: closed-out

**Verdict (round 1): ⚠️ Changes requested — 4 defects (none blocking).**
**Codex coverage: RAN — full model-diverse coverage, not degraded.**

## Reviewer findings

| #  | Round | Sev       | file:line | Claim |
|----|-------|-----------|-----------|-------|
| R1 | 1     | low       | `claude/skills/fkit-sprint-ship-loop/SKILL.md:295` | The shipped clause attributes the no-parity ruling to **ADR-037 §4**; that passage (*"still a weaker surface … should not be described as equally strong"*) is in **§3**, in its closing asymmetry blockquote (ADR lines 206–211). §4 is *"Where the rule lives"* (heading at ADR line 213). **Correct pointer is `§3` alone** — §3's blockquote carries **both** halves of the shipped sentence verbatim, so `§3/§4` is defensible but redundant. Raised by **both** reviewers. Propagated from `brief.md:46`; also in `plan.md:26/:42/:62/:89/:101` and `worklog.md:29-31/:34/:45`. |
| R2 | 1     | low       | `claude/skills/fkit-sprint-ship-loop/SKILL.md:287` | *"Exactly one of three is permitted"* introduces a false mutual exclusivity that ADR-037 §3 does not have (*"Concretely, one of three:"*). Form 2 (*get the ruling first*) is **not terminal** — once the ruling exists the driver must still **name** it when it instructs, which is form 1. Under a literal reading of *"Exactly one … is permitted"*, the 2-then-1 sequence the ADR intends is not a sanctioned path, leaving a driver with no stated way to issue the post-ruling instruction. Codex-raised; verified. |
| R3 | 1     | cosmetic  | `worklog.md:87` | *"the other **eight** bullets are byte-unchanged"* — it is **nine**. `## Hard rules` holds **10** top-level bullets in the working tree and **9** at HEAD (re-counted this round), so 9 others are unchanged. The same worklog says *"9 original"* at `:81` and `:88`. |
| R4 | 1     | cosmetic  | `worklog.md:85` | The recorded verification command is unscoped — `git diff --stat` → *"1 file changed, 13 insertions(+)"*. Unscoped, in this tree, it reports **10 files changed, 44 insertions(+), 10 deletions(-)**. The stated result is only reproducible as `git diff --stat -- claude/skills/fkit-sprint-ship-loop/SKILL.md`, so the record as written is not reproducible. Codex-raised; verified. The **result** is correct; the **command** is under-specified. |

### Verified as sound — do not chase these

- **Does the clause overstate its own force? No.** Checked independently and by Codex. No shipped sentence
  promises enforcement, verification, or a checkable marker. *"the instruction binds"* is an authority claim
  matching ADR-037 §1, not an enforcement claim. It omits §5's *forgeable / trust-not-proof* caveat, which is
  on ADR-037's **do-not-re-raise** list and is addressed to the party that would forge anyway.
- **⛔ The no-parity honesty sentence is HONEST, and shipped uncompressed.** It states *"This clause is weaker
  than its worker-side twin"* and *"it reaches no worker"* explicitly. No parity claim, no hedge. The plan's
  named *"single likeliest wording defect"* did **not** materialize.
- **All three permitted forms are genuinely usable and structurally distinct.** Verified by indent: parent at
  indent 0 (`:285`), three sub-bullets at indent 2 (`:288`, `:289`, `:291`). **Form 1 does not read as the
  default** — the bullet opens with a prohibition (*"Never instruct …"*), which frames form 1 as an exception
  to it. R2 is the only wrinkle and it cuts against form 2, not toward form 1.
- **Placement is correct.** The bullet sits after the plan/build-split bullet and before the producer/close
  bullet, among the section's other rules about what a driver puts in a spawn prompt.
- **Markdown structure is correct.** The trailing paragraph at indent 2 (`:293-297`), after a blank line,
  attaches to the **top-level** item (content column 2), closing the nested list — the intended rendering.
- **No contradiction with the declared-approval marker** (`SKILL.md:149-156`). That marker **is** form 1: it
  names the owner's live `AskUserQuestion` approval. The new rule ratifies it rather than colliding with it.
- **Diff-shape claims re-verified independently:** lines 1–284 and 298–EOF each SHA-identical to HEAD; 9→10
  top-level bullets; no `:NNN` and no markdown link in `285–297`.
- **The "regression check only" framing is correct.** No test opens this file's body.
  `test/skill-frontmatter.test.js` reads frontmatter (inside the SHA-identical 1–284 prefix);
  `test/dual-home-parity*` compares `ai-agents/` to `claude/scaffold/ai-agents/`, not `.claude/`.
  **I did not re-run `npm test` this round** — I verified the *reason* green proves nothing here, not the green.

### Instance A — derived independently from the shipped bytes

The instruction *"rank on merit rather than append"* (2026-07-27) lands squarely in the territory of
`/fkit-task-brief` step 5, *"Determine priority"* — *"Targeting a named sprint: append after the existing
highest priority. Do not renumber or insert into the owner's ranking."*

- **Form 1 unavailable.** The owner approved **filing**; no owner ruling on **placement** existed to name.
  Form 1 demands *what the owner ruled, when, on what point*; satisfying it would mean manufacturing a
  ruling, which ADR-037 §1 forbids by name (*"a bare assertion of authority … is not a named owner ruling"*).
- **Form 2 — the better fit.** The lead was in a live session holding the owner channel the spawned producer
  lacked (ADR-021), and evidently judged placement to matter — it bothered to instruct on it — so form 2's
  *"if the point matters, ask before spawning"* is triggered on the lead's own evidence.
- **Form 3 — also fully correct, and cheaper.** Let step 5's append default stand; step 5 already prescribes
  flagging where merit would have placed it, so abstaining loses no information.

The instruction actually issued matched **none** of the three → **FORBIDDEN as executed**, and the worker's
escalate-or-append-and-flag would have been the correct response, not obstruction. **The clause decides the
case cleanly — it is usable, not decorative.** Reached independently; agrees with both prior workers.

*Caveat, not raised as a finding:* the clause decides instance A only for a driver that already knows step 5's
content. Neither the clause nor ADR-037 §3 imposes a *"read the target skill's rules before spawning"* duty.
That gap is inherited **verbatim** from the ADR this task was told to carry, so it is not a defect in 0191's
bytes — at most an ADR-level follow-up, the owner's to open.

### Observations recorded, not raised as defects (out of scope / owner-ruled)

- The clause asserts *"the worker-side clause reaches every spawn through the universal rules block"*. The
  clause **does** exist at `claude/scaffold/universal-rules.md:11-13` and `claude/fkit-claude-init.sh` emits it
  into `CLAUDE.md` / `AGENTS.md` — so the statement is true of the design. It is **not yet true in this repo**:
  this repo's generated `CLAUDE.md` *"Universal hard rules"* still shows four bullets with the skill-precedence
  one absent, because the **same deferred `fkit-claude-init.sh` refresh** that gates the driver-side clause also
  gates the worker-side one. **Both become true together at the next init.** Owner-ruled deferred on 2026-08-04
  and already recorded in `worklog.md:37-50` — out of scope, no action asked.
- **⚠️ Codex's raw output carries ~160 lines of `EPERM mkdtemp` failures** from `test/task-id-uniqueness.test.js`
  and `test/turn-completion-hook.test.js`. Those are artifacts of Codex's own `--sandbox read-only` run (it
  cannot create temp dirs) — **not real failures, and not attributable to this change.** Flagged so nobody reads
  them as a red suite.

### Re-litigates settled decisions (suppressed)

**None.** Round 1 on a fresh ledger; no accepted residuals existed to dedupe against. Nothing in either pass
touched ADR-037's *"Do NOT re-raise"* list (unenforced prose / forgeable marker / undisplaceable skill rule),
and neither reviewer proposed a text-presence test.

### Convergence call

**Act, do not close out.** Four novel findings, zero re-litigation, zero suppressed. All four are **low or
cosmetic** and **none blocks the close**. Two touch shipped bytes (R1, R2) and two are task-record-only
(R3, R4) — and per **ADR-034** a review ledger closes on the **work product**, not the task's own record, so
R3/R4 are natural accepted residuals rather than close blockers.

**⚠️ Both R1 and R2 sit inside the plan's Option A block, which the owner ruled verbatim on 2026-08-04.**
Changing either departs from an owner-ruled wording, so the disposition is the **owner's**, not the coder's.
R1's substance is a factual citation repair the 0176 policy exists to prevent, which is the strongest case for
spending a round.

## Coder response

_(coder-owned — reviewer does not write here)_

**Round 1 processed 2026-08-05** by `@fkit-coder` spawned as the Process-review worker of
`/fkit-sprint-ship-loop`, under the loop's declared-approval marker. **All four findings were verified
against the code independently before any edit** — none was applied on the reviewer's say-so. The owner
ruled every disposition below via `AskUserQuestion` in the live driver session on 2026-08-04.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (citation) | **Shipped bytes only:** `SKILL.md:295` `ADR-037 §4` → **`§3`**. Verified: §3's blockquote (ADR lines 206–211) carries **both** halves of the shipped sentence verbatim; §4 (`Where the rule lives`, ADR line 213) carries neither. The clause now cites `§3` twice (`SKILL.md:286`, `:295`). **The brief/plan/worklog mis-attributions were NOT corrected** — owner-ruled accepted residual, see *R1-records* below. | ✅ done |
| R2 | CORRECT | Frontier-move | **None — accepted as a residual, not reworded.** Verified: ADR-037 §3:196 reads *"Concretely, one of three:"*; the shipped clause reads *"Exactly one of three is permitted"*, which does add an exclusivity the ADR lacks (form 2 is non-terminal — a post-ruling instruction is still form 1). Rewording would depart from the owner-ruled Option A wording. See *R2-exclusivity* below. | won't fix (frontier) |
| R3 | CORRECT | Defect (record)   | `worklog.md` — *"the other **eight** bullets are byte-unchanged"* → **nine**. Re-counted this turn: `## Hard rules` holds **10** top-level bullets in the working tree, **9** at HEAD. | ✅ done |
| R4 | CORRECT | Defect (record)   | `worklog.md` — the recorded `git diff --stat` was **unscoped** and did not reproduce. Scoped to `-- claude/skills/fkit-sprint-ship-loop/SKILL.md` and **re-run this turn**: `1 file changed, 13 insertions(+)`, 0 removed lines. The unscoped figure (`10 files changed, 44 insertions(+), 10 deletions(-)`) is now recorded alongside it so the scope reads as load-bearing rather than incidental. | ✅ done |

### Re-verification after the edits (measured this turn)

- **Clause elements all intact.** Three permitted forms present as sub-bullets at indent 2
  (`SKILL.md:288`, `:289`, `:291`); the defective-instruction sentence present (1 match); the
  **no-parity honesty sentence present and uncompressed** — both *"weaker than its worker-side twin"*
  and *"it reaches no worker"* still shipped (1 match each). R1 moved a single section pointer and
  nothing else.
- **Diff still additions-only on one file.** Scoped `git diff --stat` → `1 file changed, 13
  insertions(+)`; removed-line count **0**. Lines **1–284** and **298–EOF** are each **SHA-identical to
  HEAD** (`56362b81…` and `7d8d25f4…` respectively), which is direct proof the **other nine bullets are
  byte-unchanged**.
- **`:NNN` check on the inserted range 285–297 → zero matches** (grep exit 1), so the `0176` policy
  holds. `ADR-037` still cited by name, twice.
- **`npm test` → green** — `tests 567`, `pass 567`, **`fail 0`**, plus `test/prove-red.sh`'s hard gate:
  steps 0a–0i green and all **14 mutations** red at their named assertions.
  ⚠️ **REGRESSION CHECK ONLY — green is not proof the clause landed.** The only test that opens this
  file (`test/skill-frontmatter.test.js`) reads its **frontmatter**, which sits inside the
  SHA-identical 1–284 prefix; no test in the suite can observe the body either way. The evidence the
  clause landed is the element and diff checks above, not the green.

**Ledger status — left at `in-review`, deliberately.** Coder side, nothing is pending: all four
findings are dispositioned, two residuals are recorded, and no blocking item remains. But R1 changed
**shipped bytes** after the reviewer's pass, and the coder does not judge his own fix — whether that
one-token change warrants a round-2 confirmation is the driver's call, not mine. Flip the header to
`closed-out` on that decision.

## Accepted residuals (shared, do-not-re-litigate)

- **R1-records — the `§4` mis-attribution stays in the task record** — What: the shipped `SKILL.md`
  clause was corrected to `ADR-037 §3`, but the **task-record artifacts keep the original `§4`**:
  root cause `brief.md:46`, propagated to `plan.md` (`:26`, `:42`, `:62`, `:89`, `:101`) and
  `worklog.md` (`:29-31`, `:34`, `:45`). · Why (structural): `plan.md` is the **owner-approved artifact
  whose `git hash-object` the Build worker carried** (`a79f916e…`, 11154 B) — editing it would break the
  one pointer that ties the build to the approval, and re-authoring it is forbidden outright. The brief
  and worklog are the historical record of what was believed at the time; ADR-037's own **follow-up 4**
  already covers task-record citation repairs as a separate unit of work. Rejected alternative:
  correcting all three in place, which buys accuracy in records nothing reads at the cost of
  invalidating the approval pointer. **Known consequence, stated rather than hidden:** `worklog.md:34`
  (*"cited by name, twice (§3 and §4)"*) is now **stale with respect to the shipped bytes**, which cite
  `§3` twice. · Re-raise only if: ADR-037's follow-up 4 is picked up as its own task, **or** a reader is
  observed navigating to §4 from a task-record citation and drawing a wrong conclusion.

- **R2-exclusivity — *"Exactly one of three is permitted"* keeps its false exclusivity** — What: the
  shipped clause states the three forms are mutually exclusive; ADR-037 §3 does not (*"Concretely, one
  of three:"*), and form 2 (*get the ruling first*) is genuinely non-terminal — once the ruling exists
  the driver must still **name** it, which is form 1. · Why (structural): the wording is the plan's
  **Option A block, ruled verbatim by the owner** on 2026-08-04 with Option B rejected; rewording it
  post-hoc substitutes coder judgment for an owner ruling on the exact axis the owner ruled. The harm is
  near-zero and **points away from the failure the brief feared**: the over-strict reading cuts against
  **form 2**, not toward form 1, so it cannot create a "licence to relay" — the worst case is a driver
  that asks the owner and then hesitates to pass the answer on, which the surrounding text (*"and the
  instruction binds"*) resolves. Rejected alternative: swapping in *"Concretely, one of three"* to match
  the ADR — correct in substance, but an unapproved departure from owner-ruled wording for a defect with
  no reachable bad outcome. · Re-raise only if: a driver is observed treating the 2-then-1 sequence as
  forbidden, **or** the owner reopens the Option A wording for any other reason (fix it in the same
  pass, not on its own).
