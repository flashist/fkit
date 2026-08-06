# Worklog — task 0191: add ADR-037's driver-side clause to the sprint-ship-loop's hard rules

**Role:** `@fkit-coder`, spawned as the **Build worker** of a `/fkit-sprint-ship-loop` run.
**Authority:** the loop's declared-approval marker — the owner approved `plan.md` via a live
`AskUserQuestion` in the driver session on 2026-08-04, before any source was written. The approved plan
was both the standing approval and the scope boundary. **Nothing outside it was built.**

**Plan pointer verified before any work:** `git hash-object plan.md` →
`a79f916e681bbbc00fb656651f693aec385306c1`, **11154 bytes / 101 lines** — matches the driver's stated
pointer. Limit stated: a hash pins which bytes were *carried*, not which were *approved* (the plan's own
provenance note says the same; ADR-021 leaves owner approval with no artifact of its own).

## What was built

**One file, one hunk, additions only.**

`claude/skills/fkit-sprint-ship-loop/SKILL.md` — a new bullet in `## Hard rules`, inserted after the
plan/build-split bullet and before the producer/close bullet, exactly the placement the plan specifies.
The wording is the plan's **Option A** block, used **verbatim** — the owner ruled Option A at approval
and rejected Option B, so no wording judgment was exercised here.

The shipped bullet carries all five required elements:

- **All three permitted forms, each as its own sub-bullet** — *name the ruling* / *get the ruling first*
  / *do not issue it*. Sub-bullets rather than run-in prose, because verification step 2 requires each
  form be identifiable *as* a permitted form rather than as prose around one of them.
- **The defective-instruction sentence** — a bare directive into a rule's territory is a defective
  instruction, and the worker's conservative branch is the correct response to it, not an obstruction.
- **The no-parity honesty sentence, uncompressed** — this clause is weaker than its worker-side twin,
  and ADR-037 §4 records that deliberately: the worker-side clause reaches every spawn through the
  universal rules block, while this one binds the driver only because the driver loads this file, and it
  reaches no worker. The plan names trimming this as *"the single likeliest wording defect"*; it was not
  trimmed.
- **`ADR-037` cited by name**, twice (§3 and §4), in the section's house idiom — bare `ADR-NNN §N` in
  parentheses, no markdown link, **no `path:NNN` coordinate** (the `0176` policy).

## ⚠️ Stated limitation — the clause reaches no driver yet (owner-ruled deferred)

**`claude/fkit-claude-init.sh .` was NOT run.** The owner ruled at approval that the `.claude/` refresh
is not part of this build, and that the gap is to be recorded rather than fixed.

Consequence, stated plainly rather than left silent: a live driver loads
`.claude/skills/fkit-sprint-ship-loop/SKILL.md`, which is gitignored and refreshed only by that init
script. Until it is re-run, **the clause is on disk but reaches no driver — including the one running
right now.** ADR-037 §4's justification for the asymmetry — a `SKILL.md` the worker does not load *but
which the driver itself does load* — is therefore **not yet true in this repo**. It becomes true after
the refresh, which the owner runs at their own convenience.

The same fact is what made this mid-run edit safe: editing the canonical `claude/` copy cannot perturb
the in-flight driver, because the driver is executing the `.claude/` copy.

## Scope discipline

- **`## Hard rules` only.** No other section touched; the loop's steps, stop conditions, exit table and
  progress reporting are untouched.
- **No test added or changed.** ADR-037 §5 names a text-presence test and explicitly declines it; the
  brief puts any test out of scope.
- **`0203`'s Rules bullet, `0208`'s exit table, `0164`'s Build row — not touched.** None of the three
  had landed at build time, so the plan's line numbers still held; the anchor was re-derived from bullet
  text regardless.
- **The worker-side clause (`0190`) was not revisited.** Shipped already; out of scope.
- Nothing committed or pushed. Working tree only. No task folder moved, no mover invoked.
- `ai-agents/wiki-vault/` never written. (It shows dirty in `git status` from other, pre-existing work.)
- **No follow-up brief filed** — the driver's bounds forbid it.
- `plan.md` was **not** re-authored.

## Decision log — calls made without asking (ADR-019 audit obligation, carried by ADR-032)

**Fixes applied without asking: none.** **Obvious-winner calls: none.** **`NEEDS-DECISION` returns:
none.**

Recorded as `none` deliberately, so an empty log is not mistaken for a forgotten one. The build had no
room for a judgment call: the wording was owner-ruled verbatim in the plan, the placement was specified
in the plan, the `.claude/` refresh question was owner-ruled deferred, and the anchor re-derivation
found the file unshifted — so every choice that could have been a call had already been made by the
owner or the plan.

## Verification — every measurement below was taken this turn

1. **Anchor re-derived from bullet text, not line numbers.** `## Hard rules` found at line 275 with **9
   top-level bullets**; the plan/build-split bullet (`**The plan/build split is mandatory**`) and the
   producer/close bullet (`**The driver invokes no mover…**`) were located by their text and used as the
   insertion seam. Plan-time coordinates happened to still hold (`## Hard rules` at 275, `## Usage` at
   292, file 296 lines / 24394 B).
2. **Diff shape.** `git diff --stat -- claude/skills/fkit-sprint-ship-loop/SKILL.md` →
   `1 file changed, 13 insertions(+)`. The **path scope is load-bearing**: this working tree carries
   unrelated dirty files, so an unscoped `git diff --stat` reports `10 files changed, 44 insertions(+),
   10 deletions(-)` and does not reproduce the line above. A grep of the diff for removed
   lines (`^-` excluding the `---` header) returned **0**. Additions-only across a single hunk is direct
   proof that **the other nine bullets are byte-unchanged** — no other line in the file was rewritten.
3. **Section re-read after the edit.** `## Hard rules` now holds **10 top-level bullets** (9 original +
   1 new, at line 285), and **`## Usage` still follows**, at line 305.
4. **`:NNN` grep on the new text.** `/usr/bin/grep -nE '[A-Za-z0-9_.-]+:[0-9]+'` over the inserted lines
   285–297 → **exit 1, no matching lines in that range**. `ADR-037` confirmed present by name at lines
   286 and 295.
5. **`npm test` → green.** `fail 0`, plus `test/prove-red.sh`'s hard gate passing: steps 0a–0i green and
   all **14 mutations** red at their named assertions.

   ⚠️ **This is a REGRESSION CHECK ONLY — it is not proof the clause landed.** The only test that opens
   this file, `test/skill-frontmatter.test.js`, reads its **frontmatter block**, not its body. The edit
   lands hundreds of lines below the frontmatter close, so no test in the suite can observe it either
   way. The evidence that the clause landed is items 2–4 above, not item 5.

## Instance A — the clause is usable (plan's verification step 5, confirmed against shipped bytes)

Instance A: a live lead instructed a spawned producer *"rank on merit rather than append"*, into the
territory of `/fkit-task-brief` step 5's append default. **Form 1 was unavailable** — there was no owner
ruling on placement to name; the owner had approved *filing* only. The shipped clause therefore leaves
exactly two correct acts: **form 2, get the ruling first** (the lead held the owner channel and placement
plainly mattered enough to instruct about) — the better fit — or **form 3, do not issue it**, letting
step 5's append stand. The clause decides the case cleanly, so it is usable rather than decorative.

**Not hardened, by design.** ADR-037 §5 is explicit that this is unenforced prose and the named-ruling
marker is forgeable. Per the ADR's own *"trust, not proof — state it, do not harden it into a false
guarantee"*, no attempt was made to enforce it.

---

# Review round 1 — processed 2026-08-05

**Role:** `@fkit-coder`, spawned as the **Process-review worker** of the same `/fkit-sprint-ship-loop`
run, under the loop's declared-approval marker. Plan pointer re-verified before acting:
`git hash-object plan.md` → `a79f916e681bbbc00fb656651f693aec385306c1`, **11154 B / 101 lines** —
byte-exact against the driver's stated pointer. `plan.md` was **not** re-authored.

Reviewer verdict: **4 defects, none blocking.** Codex **ran** — full model-diverse coverage, not
degraded. All four were **verified against the code before any edit**; the owner ruled every
disposition on 2026-08-04. Full detail lives in the ledger, `review.md`.

## Decision log — calls made without asking (ADR-019 audit obligation, carried by ADR-032)

**Obvious-winner calls: none.** **`NEEDS-DECISION` returns: none.** Every change below was an
**owner-ruled disposition applied as given**, not a coder judgment — the standing approval covered
them, and each is mechanical, localized, and inside the approved plan's scope (`## Hard rules` of one
`SKILL.md`, plus this task's own record).

1. **R1 — `SKILL.md:295`, `ADR-037 §4` → `§3`.** *Answers:* R1, a citation defect the `0176` policy
   exists to prevent. *Changed:* one section pointer, one token, inside the already-inserted range.
   *Why it qualified:* verified `CORRECT` first-hand — ADR-037 §3's closing blockquote (ADR lines
   206–211) carries **both** halves of the shipped sentence verbatim, while §4 (`Where the rule lives`,
   ADR line 213) carries neither; the owner ruled `§3` alone. Single-token, in-plan, no behavior change.
2. **R3 — this worklog, *"eight"* → *"nine"*.** *Answers:* R3. *Changed:* one word in verification
   item 2. *Why it qualified:* re-counted this turn — `## Hard rules` holds **10** top-level bullets in
   the working tree and **9** at HEAD, so nine others are unchanged; the same section already said
   *"9 original"* twice. Owner-ruled correct, arithmetic, in-plan.
3. **R4 — this worklog, the recorded `git diff --stat` scoped to the `SKILL.md` path.** *Answers:* R4.
   *Changed:* verification item 2's command, plus one sentence naming why the scope is load-bearing.
   *Why it qualified:* the recorded command **did not reproduce its recorded result** — unscoped, this
   dirty tree reports `10 files changed, 44 insertions(+), 10 deletions(-)`. **Re-run this turn as
   recorded:** `git diff --stat -- claude/skills/fkit-sprint-ship-loop/SKILL.md` → `1 file changed, 13
   insertions(+)`, removed-line count **0**. Owner-ruled, mechanical, in-plan.

**Deliberately NOT changed, on the owner's ruling:**

- **R2** — *"Exactly one of three is permitted"* keeps a false exclusivity ADR-037 §3 lacks. Verified
  and real; **accepted as a residual, not reworded**, because the wording is the plan's Option A block
  ruled verbatim by the owner. Recorded in `review.md` → *Accepted residuals* → **R2-exclusivity**.
- **The `§4` mis-attribution in this task's own records** — `brief.md:46` (root cause), `plan.md` ×5,
  and this worklog ×3 (`:29-31`, `:34`, `:45`) still read `§4`. Owner-ruled accepted residual;
  `plan.md` is the owner-approved artifact whose hash the Build carried and must not be edited.
  Recorded as **R1-records**. ⚠️ **Consequence stated, not hidden:** line `:34` above
  (*"cited by name, twice (§3 and §4)"*) is now **stale against the shipped bytes**, which cite `§3`
  twice. ADR-037's own follow-up 4 covers task-record citation repairs.

## Re-verification after the fixes — every measurement below was taken this turn

1. **Clause elements all intact.** Three permitted forms still sub-bullets at indent 2 (`:288`, `:289`,
   `:291`); defective-instruction sentence present; **no-parity honesty sentence present and
   uncompressed** — *"weaker than its worker-side twin"* and *"it reaches no worker"* both still
   shipped. R1 moved one section pointer; nothing else in the clause moved.
2. **Diff still additions-only on one file.** `git diff --stat -- claude/skills/fkit-sprint-ship-loop/SKILL.md`
   → `1 file changed, 13 insertions(+)`; removed lines **0**. Lines **1–284** and **298–EOF** are each
   **SHA-identical to HEAD** (`56362b81…`, `7d8d25f4…`) — direct proof the other **nine** bullets are
   byte-unchanged.
3. **`:NNN` grep over 285–297 → zero matches** (exit 1); `0176` policy holds. `ADR-037` present by name
   twice, now `§3` both times.
4. **`npm test` → green.** `tests 567`, `pass 567`, **`fail 0`**; `test/prove-red.sh` hard gate passed —
   steps 0a–0i green, all **14 mutations** red at their named assertions.

   ⚠️ **REGRESSION CHECK ONLY — still not proof the clause landed.** `test/skill-frontmatter.test.js`
   reads this file's **frontmatter**, which sits inside the SHA-identical 1–284 prefix. No test in the
   suite observes the body. Items 1–3 are the evidence; item 4 only shows nothing else broke.

## The stated limitation is UNCHANGED — the clause still reaches no driver

The owner-ruled deferral of `claude/fkit-claude-init.sh .` stands, and **nothing above softens it**.
`claude/fkit-claude-init.sh` was **not** run this round either. The clause — including R1's corrected
citation — is on disk in `claude/`, and a live driver loads the gitignored `.claude/` copy. **Until
that refresh runs, the clause reaches no driver, including the one running right now.** See the
*Stated limitation* section above, which remains in force verbatim.

## Scope discipline — round 2

- **`review.md` *Coder response* + *Accepted residuals* only.** The reviewer's *Reviewer findings*
  section was **not** edited. Ledger header left at `in-review` — R1 changed shipped bytes after the
  reviewer's pass, and the coder does not judge his own fix; closing it is the driver's call.
- **No test added or changed** — ADR-037 §5 declines a text-presence test; the brief puts any test out
  of scope.
- `0190`'s worker-side clause, `0203`'s Rules bullet, `0208`'s §5.4 exit table, `0164`'s Build row, and
  every other hard rule — untouched. The loop's steps, stop conditions and progress reporting —
  untouched.
- **No follow-up brief filed. Nothing committed or pushed. `ai-agents/wiki-vault/` never written.** No
  task folder moved, no mover invoked.
