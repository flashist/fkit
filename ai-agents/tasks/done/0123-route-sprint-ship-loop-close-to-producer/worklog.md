# Worklog — 0123 Route the sprint ship-loop's close to the producer

**Task:** `0123-route-sprint-ship-loop-close-to-producer` · **Owner:** fkit-coder · via
`/fkit-task-ship-loop`. Plan approved (see `plan.md`). Status → 🔄 In progress (brief + sprint row).

## Owner-decision log
- **Plan approved** (the upfront gate, 2026-07-25).
- **Two design choices put to the owner before the plan gate** (`AskUserQuestion`), both answered with the
  recommendation:
  1. **Mirror 0122's confirm-the-close discipline into the sprint loop** rather than keeping 0123 minimal.
     Deliberately beyond the brief's four criteria: a driver reporting "shipped" on a partial close is
     worse at sprint scale, where the roll-up carries the error across several tasks. Rejected: minimal-now
     (the two loops would diverge) and minimal-plus-follow-up (the gap stays live meanwhile).
  2. **`fkit-lead.md:56-57` → route to 0124 item 5**, do not fix here. Same shape as 0122's R4, and 0124's
     inventory does not name `fkit-lead.md`. Rejected: fixing it here (takes 0124's scope) and trusting
     0124's grep sweep (its regex targets *"any role may invoke/close"* phrasing, which
     *"closes each task itself"* would likely slip past).

### Post-close dispositions (2026-07-25, live `AskUserQuestion` — fourth and final owner contact)
- **0136 stays in Sprint 2 at priority 114.** Owner confirmed the producer's scheduling call — small,
  dependency-free, and it closes a hazard that already bit once this session, silently.
- **The agent-closed marker stands.** Owner declined the owner-verified upgrade, as for 0122.
  `✅ Done (agent-closed — not owner-verified)` is the accurate final record: **no human read this diff**,
  and the failure-branch doctrine it settles is exercised by no test.

## Grounding
- **ADR-033 §4** (orchestrator closes through a spawned producer) and **§5** (a spawned producer still
  writes the agent-closed marker), plus **§The limit** (routing separates the closing *identity*, it does
  not make the close a second judgment).
- **0111 built this file against ADR-032-as-first-written**, where the driver ran the mover itself. That
  is what ADR-033 §4 reverses.
- **Scope fenced:** `fkit-lead.md` → 0124 (routed); `skills-for-role.sh` + mirrors + hook test + mover
  SKILLs + `fkit-coder.md` + `fkit-producer.md` + `universal-rules.md` → 0124; `architecture.md:294/305-307/355`
  → 0124 item 2 (with 0115); vault → 0126.
- **0120 overlap checked, none in practice** — 0120 edits line 9's bare `# ⛔ Owner: the lead` H1; this task
  does not touch it (verified after the edits: line 9 unchanged). **Either task may ship first.**

## Build

**One file edited: `claude/skills/fkit-sprint-ship-loop/SKILL.md`** (prose only, 9 planned sites + 2
consistency fixes):

- **Frontmatter `description`** — the driver closes nothing itself; it spawns a producer per shipped task.
- **Overview** — "closes the task itself" → routes each close to a spawned `@fkit-producer` (ADR-033 §4),
  plus the cost stated plainly: **one more spawn and one more hop before each task leaves the board.**
- **§5.2 Close row** — was *"**the driver itself** runs `/fkit-task-done`"*. Now: **Driver spawns
  `@fkit-producer`** → worker runs the mover and writes `✅ Done (agent-closed — not owner-verified)`
  (ADR-033 §5) and returns its step-7 close-out report → gate column: the driver **confirms the close
  landed** before counting the task shipped, and stops for the owner on a degraded run.
- **The rule at :118-119** — was false in both halves (*"the close is the driver's… the lead already owns
  `/fkit-task-done`"*). Inverted: the close is a **spawned producer's**; movers are producer-only and the
  ADR-018 hook denies a `lead`-identity mover call at any spawn depth; the owner-relay stays coherent
  because the driver keeps **holding the channel**, not because it closes.
- **§4 Close posture** — citation now *ADR-032 D5/D6 as amended by ADR-033 §4/§5*; new "driver invokes no
  mover" bullet; marker attributed to the spawned producer with ADR-033 §The limit stated; **new
  confirm-the-close bullet**; **new half-landed recovery bullet** (re-spawn once → else
  `🚧 Blocked — hand-off incomplete` in both locations → relay → do not count it shipped);
  "degraded run → do NOT **route** the close"; **"never self-cancel" kept unchanged** per the brief.
- **Stop table** — new **"Blocked — hand-off didn't land"** row; "do not self-close it" → "do not route
  its close".
- **Hard rules** — "Close writes the marker by default" → the driver invokes no mover, spawns a producer,
  confirms the close; "before closing a task" → "before handing a task's close off".

### Autonomous decisions (obvious winners, in-plan)
- **Fixed a second, duplicate copy of the same sentence at `:120`** ("re-verify … before closing") that the
  plan only listed at `:201`. Same sentence, same fix.
- **Refreshed the gitignored `.claude/` mirror** by one-file `cp` (not a full `fkit-claude-init.sh` run).

### ⚠️ A regression I introduced, caught mid-build, and fixed
My first version of the frontmatter put **`nothing itself: it spawns a producer`** on a **continuation
line** of the multi-line YAML description. A `": "` inside a multi-line plain scalar is **invalid YAML** —
the frontmatter stopped parsing and the skill listing silently **fell back to the file's H1**
(`⛔ Owner: the lead`) as the description. Nothing errored; the only signal was the listing text changing.

**Evidence both ways:** the listing showed `fkit-sprint-ship-loop: ⛔ Owner: the lead` while broken, and
the full new description again after the colon was changed to an em-dash.

**Sweep — and its limits, corrected after review R4/R5.** I swept every skill's frontmatter for the
*continuation-line* hazard (an indented line containing `": "`) — **zero hits**, and the reviewer
independently confirmed zero across all 20 skills. But my sweep criterion was **narrower than the hazard
class**, and two claims in the first version of this worklog were wrong:
- I wrote that `fkit-task-ship-loop`'s single-line colon *"does parse"*. **It does not parse under strict
  YAML** — it survives only on **loader leniency** for a same-line colon. Different thing, said wrongly.
- I implied one skill was in that state. It is **three**: `fkit-dumb-down`, `fkit-task-brief`,
  `fkit-task-ship-loop` (verified myself, not taken on the reviewer's word).
- **Why the agent definitions are immune, which I never recorded:** they use `description: >-` block
  scalars, where a colon is just text. Skills use bare plain scalars, which is the whole hazard.

**Lesson worth keeping:** a broken SKILL frontmatter fails *silently* — no test catches it (no test reads
any `SKILL.md`), and the loader **degrades rather than erroring**. The only signal was the listing text
changing. Any skill-description edit should be eyeballed in the next skill listing.

## Verification

- `node --test test/*.test.js` → **511 pass / 0 fail** (final run, after the last edit). ⚠️ **Proves no
  regression, not the change** — no test reads any `SKILL.md` at runtime, which is exactly why the YAML
  break above got through to the listing rather than to a red test.
- Brief's `## Verification steps`, walked:
  1. ✅ **No `/fkit-task-done` invocation by the driver.** **Six** mentions remain (`:106`, `:158`, `:178`,
     `:179`, `:180`, `:223`) — every one is *the spawned producer runs it*, *the driver must not*, or a
     citation of the mover's own rules. Re-counted and re-read after the R8/R9 edits (the count grew as
     R1's and R6's fixes cited the mover); the reviewer independently re-verified all six.
     *(Corrected twice — review R7 fixed the line numbers, R9 the count. Enumeration in an evidence packet
     drifts every time the file changes; re-derive it, never carry it forward.)*
  2. ✅ The Close row spawns `@fkit-producer` per task, and §4 + the hard rules state the per-task
     producer-spawn explicitly.
  3. ✅ The marker is attributed to the **spawned** producer (Close row, §4, hard rules), never the driver.
  4. ✅ **The rest of §5 is unchanged** — reviewed `git diff` hunk by hunk: §1 (selection / skip memory /
     deadlock), §3 (relay gate + the DONE/NEEDS-DECISION/BLOCKED envelope), the **plan-gate honesty
     clause** (`:51-67`, byte-unchanged), the declared-approval-marker rules, §5 Advance, and progress
     reporting are all untouched. **No prose-enforced gate was upgraded into a claimed structural
     guarantee** — the honesty clause still says "prompt instruction, not a wall".
- Mirror `diff` canonical vs `.claude/` → identical.
- ⚠️ **Not exercised end-to-end.** The sprint loop is **lead-only** (ADR-018), so nothing in this coder
  session runs its new Close row. Unlike 0122 — whose own close dogfooded its change — this change is
  verified by **reading and no-regression only**. First real exercise will be the next `fkit lead`
  sprint run.

## Review — round 1

**Ledger:** `review.md`. **Verdict as issued: 🛑 Blocked — 5 confirmed defects (1 high).** **Codex
coverage: FULL** (reviewer's own pass + Codex adversarial, exit 0 — no degradation). Every finding landed
**inside text this task created**; none re-litigated a settled decision.

**The one that matters — R1.** My "re-spawn `@fkit-producer` once to reconcile a half-landed close" was
**unperformable**. Verified myself against the mover: `/fkit-task-done` **stops** when the folder is
already under `ai-agents/tasks/done/` (`SKILL.md:59-65`), its only exception (the owner-verification
upgrade) is **owner-only** — *"An agent hitting this case still stops"* — and `✅ Done` is skill-gated,
never hand-editable (`:265-267`). So in exactly the partial case the new confirm check is built to catch,
**no agent could perform the remedy I wrote.**

⚠️ **And the identical instruction was already shipped in `fkit-task-ship-loop/SKILL.md` — task 0122,
CLOSED earlier today.** The reviewer that closed 0122 did not catch it; neither did I. This was a defect in
shared doctrine, not a slip in one file.

**Criterion 4 — the item I asked the reviewer to attack hardest — passed, verified structurally**, not by
diff-absence: the plan-gate honesty clause (`:51-67`), §1, §3's relay gate + envelope, the
declared-approval-marker rules, §5 Advance, the invariant and progress reporting are **byte-identical** to
`HEAD`. No prose-enforced gate was hardened into a claimed structural guarantee.

**Reviewer's clean bill on two things I had flagged:** `fkit-lead.md` has **no** "a consult is a focused
question, not a hand-off" rule, so 0122's R4 opens no new hole on the lead side; and 0124's brief already
scopes that carve-out to *"both ship-loops"*.

### Owner dispositions (2026-07-25, live `AskUserQuestion` — second owner contact of the run)
All three answered with the recommendation:
1. **R1 → fix both loops now, and name the follow-up brief.** Done. Both files now split the two cases
   honestly: *folder never moved* → re-spawn the producer once (**performable** — the mover runs normally
   from a `backlog/` folder); *folder moved, a status/href stale* → **owner-only**: do not re-spawn, write
   `🚧 Blocked — hand-off incomplete` **on the stale location**, leave any landed `✅ Done` untouched,
   report/STOP. ⚠️ **This edited a closed task's file** (`fkit-task-ship-loop/SKILL.md`, task 0122) — said
   plainly here and in the ledger rather than quietly amended.
2. **R3 → record-and-continue.** §4's *"relay to the owner"* (blocking in this file) → *"report it to the
   owner"*; the stop row now says *report, do not pause the sprint, next eligible task*. The single-task
   sibling still STOPs — correct, it has no next task.
3. **YAML hazard → name the follow-up here**, do not file it (the loop names follow-ups; the producer
   files them).

### Fixes applied and re-verified
- **R1, R2, R3** in file (R2 resolved by R1's rewrite — the recovery now writes on the stale location only
  and never over a landed `✅ Done`, which removes the "never patch a status / write both locations"
  contradiction). **R4, R5** in this worklog.
- `node --test test/*.test.js` → **511 pass / 0 fail** after the final edit. **Both** mirrors `diff`
  identical. Both skill descriptions verified rendering correctly in the live skill listing.

## Review — round 2 (phase-2 closeout attempt → not closed out)

**Verdict: ⚠️ Changes requested — 2 defects.** R1–R5 all **verified landed** by the reviewer against the
files (not on my report). **But R1's fix produced R6.** No Codex pass this round — phase 2 records
dispositions rather than re-running passes; round 1 had full model-diverse coverage.

- **R6 (medium, CORRECT).** My corrected recovery — *mark the stale location, leave a landed `✅ Done`* —
  **prescribes** the disagreeing-status state that three unamended invariants forbid
  (`fkit-sprint-ship-loop:215-216`, `fkit-task-ship-loop:110-111`, `:198-199`). ⚠️ **`:110-111` is one of
  the very sites 0122's R1 cited.** I verified all three by reading them.
- **R7 (low, CORRECT).** Four stale statements in this worklog after the post-disposition edits.

**Owner disposition (2026-07-25, third owner contact): option (a) — carve-out at all three sites.**
Applied: each invariant now names the half-landed close as **the one sanctioned disagreement**, says *why*
(no agent can lawfully reconcile it), and keeps "reported, never silent". The **folder-never-moved**
sub-case now states that a failed re-spawn leaves **no `✅ Done`, so the ordinary both-locations rule
applies** — closing the reviewer's secondary under-specification. R7 fixed.

### ⚠️ Lesson this task actually taught — worth more than the diff
**Two consecutive rounds found the defect inside the previous round's fix**, and both times the fix looked
obviously right when written. The reviewer's standing signal is recorded and I accept it: if a **third**
round finds a defect inside this carve-out, **stop patching §4** and let follow-up 1 below carry the whole
thing as one reviewed unit. A failure branch that no test can exercise (nothing runs these loops in a coder
session) is exactly where confident prose goes wrong unnoticed.

## Review — round 3 (closeout)

**Ledger `Status: closed-out`.** Reviewer verdict: ⚠️ *Changes requested — 2 low defects (none blocking);
close after the tidy-ups, no further review round.* **Converged.** No Codex pass in rounds 2–3 (phase 2/3
record dispositions rather than re-running passes); **round 1 had full model-diverse coverage.**

- **The pattern warning was explicitly DISCHARGED by the reviewer**, and I record its reasoning rather than
  my own: all three carve-out sites correct; the secondary under-specification fixed in both files'
  normative prose; round 3's findings **outside the fix's logic**; severity **high → medium → low** =
  convergence, not recurrence. It told me *not* to hand this to the follow-up.
- **R6 verified site by site** — the check I asked for: sprint invariant `:218-223`; the sibling's
  `:110-115` (the exact clause 0122's R1 hinged on, now admitting the exception inline); the sibling's
  "Any early exit" `:205-207`. The reviewer also enumerated **every** both-locations site in both files,
  not only the edited ones, and found R8 the only inconsistency.
- **R8 (low) — FIXED.** Both stop-table rows still carried the pre-R6 stale-location-only rule, and the
  sprint row's "Either way" openly contradicted §4's never-moved both-locations case. Both rows now split
  the two sub-cases explicitly. *Same point as R6's secondary: fixed in the prose of both files, missed in
  the tables of both — a summary table is a place a corrected rule goes stale silently.*
- **R9 (low) — FIXED.** Three worklog corrections: the stale "R6 is the one open item" line; the mover-
  mention count (**two → six**, all still never-invoke-it or producer-invokes-it, so criterion 1 holds and
  was re-verified); and a repeated off-by-one citation — `fkit-task-done/SKILL.md:266-268` → **`:265-267`**
  and `:59-65` → **`:60-64`**, corrected in **all** places across both skills and this worklog.
- **Residual amended, not added** (reviewer): the owner-only repair gap now records that the knowingly-
  disagreeing state is an explicit carve-out at three sites, with **"do not fix any of those three
  carve-outs away"** — removing one restores R6.

**Re-verified after the R8/R9 edits:** `node --test test/*.test.js` → **511 tests, 511 pass, 0 fail**; both
mirrors `diff` identical; both skill descriptions still rendering in the live listing.

## Recommended follow-up tasks — *named only; the producer files briefs, not this loop*

1. **A sanctioned producer-only "finish an already-moved close" mode for `/fkit-task-done`** (R1's complete
   fix). Today a close that moves the folder but leaves a status or href stale can be repaired by **nobody
   but the owner** — the mover refuses an already-moved folder and hand-editing `Done` is forbidden. Both
   ship-loops now state that limit honestly, but the underlying gap is real and unowned. Should mirror into
   both loops when it lands.
2. **Convert every `claude/skills/*/SKILL.md` `description:` to a `>-` block scalar, then add a
   frontmatter-parse guard test.** Three skills (`fkit-dumb-down`, `fkit-task-brief`,
   `fkit-task-ship-loop`) are invalid strict YAML today and survive on loader leniency; a break degrades
   **silently** (the listing falls back to the H1) and no test catches it. The agent definitions already
   use `>-` and are immune — converting eliminates the hazard class rather than testing one instance.
   Constraint to respect: ADR-014's zero devDeps ⇒ no YAML library ⇒ the guard hand-rolls a reader, which
   block scalars make trivial.

## Residuals / deferrals

- **`claude/agents/fkit-lead.md:56-57`** still says the loop *"closes each task itself with the
  (agent-closed) marker by default"* — a **system prompt**, which outranks a SKILL in the lead's context.
  Owner ruled it belongs in **0124 item 5**; routed on the closing producer spawn. ⚠️ **OPEN until 0124's
  brief visibly lists it.**
- **The 0123→0124 window** mirrors 0122's: the `lead` still holds the movers until 0124, so a mistaken
  driver self-close would **silently succeed** rather than being hook-denied. Accepted sequencing cost.
- **Three skills carry a same-line `": "` in a plain-scalar description** — `fkit-dumb-down`,
  `fkit-task-brief`, `fkit-task-ship-loop`. **Invalid strict YAML, surviving on loader leniency**, one edit
  away from the silent failure above. Not touched here (0122 is closed; the other two are unrelated). The
  hazard-class fix is to convert every skill `description:` to a `>-` block scalar, as the agent
  definitions already do, and then add a frontmatter-parse guard test — **new work, not this task's
  scope.** Awaiting the owner's call on filing it.
- ⚠️ **R1 — the reconcile instruction I wrote is unperformable, and the same defect is already shipped in
  the closed sibling.** **Resolved** — fixed in both loops under the owner's disposition (see the review
  section). ⚠️ **But its fix then produced R6** (round 2): the corrected recovery prescribed a
  deliberately-disagreeing board state that three unamended "both locations" invariants forbid. **R6 was
  then fixed too** (round 3, carve-out at all three sites — owner-approved and reviewer-verified site by
  site), and round 3's remaining findings (R8, R9) were **low tidy-ups outside the fix's logic**. Severity
  ran **high → medium → low** across the three rounds; the reviewer explicitly **discharged** its
  stop-patching signal on that basis. **Nothing from this chain is left open.**

## Change surface

- `claude/skills/fkit-sprint-ship-loop/SKILL.md` (modified — this task's file)
- ⚠️ `claude/skills/fkit-task-ship-loop/SKILL.md` (modified — **the closed task 0122's file**, amended
  under the owner's R1 disposition so both loops carry the corrected recovery doctrine; §4/step-9 recovery
  bullet + one stop-table row only)
- `ai-agents/tasks/backlog/0123-route-sprint-ship-loop-close-to-producer/brief.md` (status line only)
- `ai-agents/sprints/sprint-2.md` **line 138 only** (priority-106 row status)
- New in the task folder: `plan.md`, `worklog.md`, and `review.md` (reviewer)
- `.claude/skills/fkit-sprint-ship-loop/SKILL.md` **and** `.claude/skills/fkit-task-ship-loop/SKILL.md` —
  gitignored mirrors, **both** refreshed (not git changes)

## Close — routed to the producer (the rewritten step 9, and the rule this task wrote)

The loop **did not** invoke `/fkit-task-done`. It spawned **@fkit-producer** (hop 1) with the brief path,
task-id and evidence packet, then **cross-checked the producer's step-7 report** — which is precisely the
confirm discipline this task added to the sprint loop, applied to itself one loop up.

| Producer claimed | Verified |
|---|---|
| Folder `git mv`'d to `tasks/done/0123-…/`, all four files together | ✅ new path complete; old path gone |
| Brief `## Status` → `✅ Done (agent-closed — not owner-verified)` | ✅ line 10 |
| `sprint-2.md:138` status cell **and** href → `../tasks/done/…` | ✅ both |
| **One** re-pointed href, and it is in **0122's closed ledger** (`review.md:45`) — href only, R6 prose byte-identical | ✅ consistent; 0122 **not** reopened |
| Zero hits in `sprints/done/`, `sprints/reviews/`, `knowledge-base/`; no parent epic | ✅ |
| Outbound ADR links from the moved folder still resolve (same depth) | ✅ |
| No commit | ✅ nothing committed by the producer |

**Reported, not repaired (correctly):** eight stale `tasks/backlog/0123-…` strings inside this folder's own
`worklog.md`/`review.md` are **code spans, not links** — records of where files sat during the run, true when
written. The producer declined to rewrite another role's evidence packet. Agreed.

**Not swept, and said so:** `ai-agents/wiki-vault/` is excluded by design (ADR-005). Whether a vault page
references 0123 is **unknown, not clean** — and plausible, since this is an ADR-033-chain task. **Task 0126**
(wiki resync for ADR-033) already exists to cover it; the repair is `fkit-wiki`'s.

**Open dependency CLOSED:** `0124-…/brief.md` now lists `claude/agents/fkit-lead.md:56-57` in item 5, with
the sweep-would-miss-it warning, a **new verification step 9** (hand-read the lines; *"a green step 6 is not
evidence for this step"*), and a third scope-amendment note recording the standing finding — **a grep for one
phrasing is not an inventory.**

**Follow-ups: the producer filed three, not the two named here** — and its reasoning is better than mine, so
recording it rather than my version: **0134** (architect, ADR — the *must-never* list for a half-landed-close
repair is a governance boundary, not a coder's to invent mid-build, with an explicit "do nothing is a valid
outcome" branch), **0135** (the reconcile mode + mirror both loops; depends on 0134 + 0124), **0136** (the
YAML conversion **and** guard test kept as one unit — split, convert-alone has no automated verification and
guard-alone has three pre-existing failures to grandfather).

⚠️ **A ripple the producer found that this worklog missed.** The three ADR-033 carve-out sites exist *only
because no agent can lawfully reconcile* a half-landed close. **If 0135 lands, that justification becomes
false** — and the ledger's standing *"do not fix any of those three carve-outs away"* would then make the
next coder preserve them and ship a second generation of R6. 0135 is now named as the sanctioned occasion to
revisit them, and 0134 must rule on all three. **Good catch; it is not mine.**

## Commit state

**Not committed.** `git status` (tracked): `sprint-2.md`, this task's `brief.md`, and **two** SKILLs —
`fkit-sprint-ship-loop` (this task) and `fkit-task-ship-loop` (the closed 0122's file, amended under the
owner's R1 disposition).

⚠️ **Re-derived at close — the earlier version of this paragraph had gone stale, and the producer caught
it.** The owner committed between turns, so `AGENTS.md`, `CLAUDE.md`, the `0131`–`0133` folders and 0122's
staged rename are **no longer pending**. Accurate state at close:

- **Modified:** `ai-agents/sprints/sprint-2.md` · `ai-agents/sprints/backlog.md` · `0124-…/brief.md`
  (item 5) · `ai-agents/tasks/done/0122-…/review.md` (the reviewer's post-closeout banner + one re-pointed
  href) · the two SKILLs above.
- **Staged rename:** `0123-…/brief.md` → `tasks/done/…` (`git mv`, pure rename) — same pattern the owner
  chose to leave staged for 0122.
- **Untracked:** this folder's `plan.md`/`worklog.md`/`review.md` at the new path (never tracked), plus the
  three new briefs `0134`, `0135`, `0136`.

**Lesson, since it bit three times this run:** a commit-state paragraph — like the mover-mention count and
the line-number citations — is a **snapshot, not a fact**. Re-derive at close; never carry it forward.
