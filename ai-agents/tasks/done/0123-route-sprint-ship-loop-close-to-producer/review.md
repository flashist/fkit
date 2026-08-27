# Review — 0123-route-sprint-ship-loop-close-to-producer

Task: 0123 — [brief](./brief.md)
File(s) under review: `claude/skills/fkit-sprint-ship-loop/SKILL.md` (whole diff) ·
`ai-agents/tasks/backlog/0123-route-sprint-ship-loop-close-to-producer/brief.md` (status line only) ·
`ai-agents/sprints/sprint-2.md` (line 138 only) · that task folder's new `plan.md` and `worklog.md`
Status: closed-out — **Round 3: R6/R7 verified landed. 2 low tidy-ups (R8, R9) recorded, non-blocking,
no further review round required.**

**Round 1** — reviewers: fkit-reviewer (own pass) + Codex adversarial pass
(`codex exec --sandbox read-only`, completed, exit 0). **Full model-diverse coverage — no degradation.**

**Round 1 verdict (as issued):** 🛑 **Blocked — 5 confirmed defects (1 high, in the newly written
failure branch).** The routing rewrite itself is correct and brief criteria 1–3 are met; criterion 4 is
met and was verified **structurally** (byte-identical anchored diffs), not by diff-absence. Every
finding sits in the *new* half-landed-close recovery branch or in the evidence packet's YAML claims.

**Round 2 — phase-2 closeout attempt (2026-07-25):** ⚠️ **NOT closed out — R1–R5 all verified landed,
but R1's fix introduced 1 new medium defect (R6) plus 1 low (R7).** Reviewers: fkit-reviewer own pass
only (phase 2 records dispositions against verified state; it does not re-run the review passes — no
Codex pass this round, and none was warranted). **Round 2 verdict:** ⚠️ **Changes requested — 2 defects
(none blocking the design; both text-level).**

**Round 3 — phase-3 closeout (2026-07-25):** ✅ **Closed out. R6 and R7 verified landed; 2 low tidy-ups
(R8, R9) recorded as non-blocking.** Reviewers: fkit-reviewer own pass only (dispositions recorded
against verified state; no Codex pass, none warranted). **Round 3 verdict:** ⚠️ **Changes requested —
2 low defects (none blocking); close after the tidy-ups, no further review round.**

**The pattern warning is DISCHARGED — I am not invoking the stop-patching signal, and here is why.** All
three carve-out sites are **correct**, and the secondary under-specification is fixed in the normative
prose of both files. Round 3's findings are **not inside the fix's logic** — they are a summary table
row that defers to the corrected prose, and enumeration drift in the worklog. Severity across the three
rounds ran **high → medium → low**: that is convergence, not the recurrence I warned about. Patching
§4 further is not warranted, and neither is handing this to the follow-up.

⚠️ **Loud, up front (Round 2, retained for the record) — R1's fix re-created the exact tension a prior finding cited.** The new
"write `🚧 Blocked` on the stale location only, leave a landed `✅ Done` untouched" rule contradicts
both files' unamended both-locations invariants, including
`claude/skills/fkit-task-ship-loop/SKILL.md:110-111` — *"a half-written status is an error to finish,
never left disagreeing"* — which is one of the very sites **0122's R1** cited as making the old
recovery unsatisfiable. The new doctrine is **behaviorally correct**; the documents were not updated to
admit it. See R6.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | high | `claude/skills/fkit-sprint-ship-loop/SKILL.md:171-174` | **The re-spawn-to-reconcile recovery is unperformable in exactly the case the confirm check is designed to catch.** §4's confirm bullet (`:164-170`) exists to detect a *late-stage* partial close — folder already moved to `done/`, a board row / epic slice / `backlog.md` row / re-pointed href left stale. In that state the re-spawned producer can do **neither** of the two things available to it: (a) it cannot re-run the mover — `/fkit-task-done` step 1 **stops** when the folder "is already in `ai-agents/tasks/done/`", and the single exception is the owner-verification upgrade, which states "**An agent hitting this case still stops: only the owner can upgrade**" (`claude/skills/fkit-task-done/SKILL.md:60-65`); (b) it cannot write the missing `✅ Done` by hand — "**`Done` … may be set only by this skill — never by hand-editing a file**" (`claude/skills/fkit-task-done/SKILL.md:264-266`). So "ask it to reconcile its own close" instructs the driver to request a forbidden action, and the fall-through branch then writes `🚧 Blocked — hand-off incomplete` into a brief that is physically in `tasks/done/` and typically already reads `✅ Done` — a self-inconsistent board state, and itself a hand-edit of a closing task's status. **This is the R1-class defect from 0122 one level deeper: the *chosen remedy* has the hole, not the rejected one.** Raised by Codex; verified independently against the mover. ⚠️ **Cross-file:** `claude/skills/fkit-task-ship-loop/SKILL.md:177-181` (0122, closed) carries the identical instruction, so this is a design gap in the shared doctrine, not a slip in this file — and a fix applied **only** here re-diverges the two loops, which is what owner decision 1 was taken to prevent. The complete fix (a sanctioned producer-only "finish an already-moved close" mode in `/fkit-task-done`) is **outside this task's approved scope**; a minimal in-file honesty fix (promise only what the mover permits, else stop for the owner) is **inside** it. Which of those to take is an owner call. |
| R2 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:171-174` | **The bullet contradicts itself, because the sibling's reconciling sentence was dropped.** It opens "…**never patch a status yourself**" and then instructs the driver to "write `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations." The sibling loop resolves precisely this with a sentence 0123 does not have: *"Statuses on a closing task are the producer's to write; the loop writes only its own `🚧 Blocked` marker, and **never** a `✅ Done`."* (`claude/skills/fkit-task-ship-loop/SKILL.md:180-181`). Without it a literal driver must either break the no-patching rule or write nothing — and writing nothing breaks this file's own exit invariant that every exit writes accurate status in **both** locations (`:204-205`). It also newly collides with `:94`, which already permits the driver to set status "via a spawned worker or **directly**". Raised by both reviewers. |
| R3 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:171-174` vs `:201` | **§4 and the new stop-table row disagree on whether a failed hand-off pauses the sprint.** §4 says "…**relay to the owner**, and do not count the task as shipped"; the stop-table row says "…report it, do not count the task shipped; **next eligible task**". In this file "relay" is a defined, blocking act — `AskUserQuestion` and "**blocks on a real owner answer** — no timer, no guess" (`:140-143`) — and it is the "Owner decision pending" row's behavior (`:199`), whereas every other `🚧 Blocked` row skips to the next task (`:197-198`). A hand-off failure is informational, not a question, so the two readings fork the driver's control flow: stall the whole sprint run on a task already accurately marked Blocked, or continue. Both exits leave honest status and an owner-visible report, so the invariant survives either way — hence low, not medium. |
| R4 | 1 | low | `ai-agents/tasks/backlog/0123-route-sprint-ship-loop-close-to-producer/worklog.md:106-109` | **The YAML residual states a falsehood and under-counts by 2.** It says `fkit-task-ship-loop`'s single-line `": "` "**does** parse". It does **not** parse as YAML — a strict parser rejects it (`mapping values are not allowed in this context`, at the `description:` line); it *renders* only because Claude Code's frontmatter loader tolerates a colon-space on the **same** line while breaking on one in a **continuation** line, which is exactly the asymmetry the coder observed empirically. And **three** skills are in that state, not one: `claude/skills/fkit-dumb-down/SKILL.md:3`, `claude/skills/fkit-task-brief/SKILL.md:3`, `claude/skills/fkit-task-ship-loop/SKILL.md:3`. The residual's *conclusion* (observation, not defect) stands and all three render correctly today — but "does parse" is the stated basis for that conclusion and for the "one edit away" risk read, and any guard written with a real YAML parser would fail on three pre-existing files on day one. Verified by parsing all 64 skill + agent frontmatter blocks. Same class as 0122's R5. |
| R5 | 1 | low | `ai-agents/tasks/backlog/0123-route-sprint-ship-loop-close-to-producer/worklog.md:70` | **The sweep's outcome is sound; its stated method and scope are narrower than the hazard class, and the reason it is safe is unrecorded.** Independently confirmed: **zero** hazard hits across all 20 `claude/skills/*/SKILL.md` — the "zero hits" claim is **correct**. But (a) the criterion (an indented continuation line containing `": "`) covers one YAML-breaking token, not the class — a continuation line beginning `- `, a trailing bare `:`, an unescaped ` #`, or a tab would fail the same silent way; and (b) `claude/agents/*.md` was not in the stated scope and **does** contain 8 continuation lines with `": "` plus one trailing bare colon (`fkit-coder.md:5,13`, `fkit-lead.md:4,12,18`, `fkit-producer.md:11`, `fkit-reviewer.md:7,14`). Those are harmless for a **structural** reason the worklog never states: agents declare `description: >-` folded block scalars (`fkit-coder.md:3`, `fkit-lead.md:3`, `fkit-reviewer.md:3`) while skills use bare plain scalars. That structural fact — not the regex — is the actual guarantee, and it is also the strongest available fix (see the guard question in the report). |

| R6 | 2 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:176-183` · `claude/skills/fkit-task-ship-loop/SKILL.md:180-186` | **R1's fix prescribes the disagreeing-status state that both files elsewhere forbid, and neither invariant was amended.** The moved-folder branch now writes `🚧 Blocked — hand-off incomplete` **on the stale location only** and leaves a landed `✅ Done` untouched — so the brief's `## Status` and the sprint row **deliberately disagree**. That contradicts: (a) `fkit-sprint-ship-loop/SKILL.md:215-216` — "Every exit writes accurate status in **both** the brief's `## Status` **and** the sprint row"; (b) `fkit-task-ship-loop/SKILL.md:110-111` — "every status transition writes the brief's `## Status` **and** the sprint-plan row in the same step; **a half-written status is an error to finish, never left disagreeing**"; (c) `fkit-task-ship-loop/SKILL.md:198-199` — "Any early exit … `🚧 Blocked — <reason>`, **both locations**". **(b) is one of the exact sites 0122's R1 cited**, so this is the R1/R3 class re-created by R1's own remedy — a new branch landing on one side of a both-locations rule without reconciling it. Secondary, same cluster: in the *folder-never-moved* sub-case the correct action **is** both locations (the producer wrote neither), so "on the stale location" under-specifies it there. **The doctrine is right — a landed `✅ Done` is the owner's — and I am not asking for it to be reversed;** what is missing is the carve-out that makes the documents self-consistent. Cheapest form: one clause at each of the three invariant sites naming this branch as the one exception. Which form to take, or whether to record it as a stated residual instead, is the owner's call. |
| R7 | 2 | low | `ai-agents/tasks/backlog/0123-route-sprint-ship-loop-close-to-producer/worklog.md` | **Four stale statements in the evidence packet after the post-disposition edits** — same class as R4/R5 and 0122's R5. (1) *Residuals* still carries "⚠️ **R1 — the reconcile instruction I wrote is unperformable** … this is the task's one substantive open item", which the *Fixes applied* section above it contradicts — R1 is fixed. (2) *Change surface* lists only `.claude/skills/fkit-sprint-ship-loop/SKILL.md` as the refreshed mirror; **both** mirrors were refreshed (verified identical). (3) *Commit state* says the tracked set is "`sprint-2.md`, this task's `brief.md`, and **the SKILL**" — singular; there are now **two** modified SKILLs, and the sibling is the one an owner most needs to see in that sentence. (4) *Verification* step 1 cites `:157` for the §4 mover mention; it is now `:158`, and the same bullet's mirror line is still singular. Substance of every brief criterion is unaffected — this is enumeration drift only. |

| R8 | 3 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:213` · `claude/skills/fkit-task-ship-loop/SKILL.md:267` | **Both stop-table rows still carry the pre-R6 stale-location-only rule, so they now contradict the corrected §4/step-9 prose for the never-moved sub-case.** R6's fix added, correctly, that when the folder never moved and the re-spawn also fails "nothing was closed and no `✅ Done` exists — so the ordinary rule applies: write `🚧 Blocked …` in **both** locations" (`fkit-sprint-ship-loop:175-176`, `fkit-task-ship-loop:184-185`). The summary rows were not updated: the sprint row still reads "**Either way**, if unresolved: … **on the stale location**" — "either way" explicitly asserts the stale-location-only rule for *both* branches, which is now wrong for the never-moved one; the sibling row has the same singular wording without "either way". **Mitigating, and why this is low:** both rows point at `(§4)`/step 9, which is the normative text and is now correct, and "the stale location" is charitably readable as "whatever is stale" (in the never-moved case, both are). Fix is one clause per row. **This is the same under-specification I raised as R6's secondary point — fixed in the prose of both files, missed in the tables of both.** |
| R9 | 3 | low | `ai-agents/tasks/backlog/0123-route-sprint-ship-loop-close-to-producer/worklog.md:212-214`, `:92-94` · citations in 4 places | **Evidence-packet drift recurring, plus a repeated off-by-one citation.** (1) `:212-214` still reads "**R6 is now the task's one substantive open item**, awaiting the owner" — stale; R6 was dispositioned and landed this round. This is the *same* residual-line staleness R7 item 1 fixed, one round later. (2) `:92-94` says "**Two** mentions remain: `:106` and `:158`" and adds "*(Line numbers re-checked after the post-disposition edits — review R7)*" — but there are now **six** `/fkit-task-done` mentions (`:106`, `:158`, `:178`, `:179`, `:180`, `:223`); the four new ones are all *never-invoke-it* statements, so **brief criterion 1 substantively still holds — I re-verified every one this turn** — but the enumeration is wrong in the very sentence claiming it was re-checked. (3) Cosmetic, now repeated in **4** places across both files (`fkit-sprint-ship-loop:179,180,223`, `fkit-task-ship-loop:113,188,189`): `fkit-task-done/SKILL.md:59-65` — the stop-if-already-in-`done/` rule is at **60-64** (59 is the "Stop with a clear message if:" lead-in, acceptable); and `:266-268` — the load-bearing sentence *"`Done` … may be set only by this skill — never by hand-editing"* starts at **265**, so the citation omits its first line. |

**Coverage — checked and found correct** (so the coder can tell coverage from silence):

- **Criteria 1–3 met.** Only two `/fkit-task-done` mentions survive (`:106`, `:158`), both attributing
  the call to the **spawned producer**; the per-task `@fkit-producer` spawn is explicit at `:106`,
  `:157-158`, `:226-228`; the marker is attributed to the spawned producer at `:106`, `:159-163`,
  `:226-227`, never to the driver. Stale-self-close sweep: no surviving claim.
- **Criterion 4 met, verified structurally rather than by diff-absence.** Anchored diffs against
  `HEAD`: the **plan-gate honesty clause** (`:51-67`) is **byte-identical**; §1 selection / skip memory /
  deadlock **byte-identical**; §3 relay gate + the DONE/NEEDS-DECISION/BLOCKED envelope **byte-identical**
  (27 lines); the declared-approval-marker rules **byte-identical**; §5 Advance, the both-locations
  invariant and progress reporting **byte-identical**. The stop table changed **only** by the added row
  and `self-close`→`route`. **No prose-enforced gate was hardened anywhere** — `:224-225` still reads
  "prose-enforced, not structural".
- **Frontmatter is valid.** `:1-7` parses; `description` non-empty (367 chars); no continuation-line
  hazard. The em-dash fix is correct.
- **The mover write-set description is accurate.** §4's `:164-170` enumeration matches
  `fkit-task-done` step 7 (`:220-247`), including `sprints/done/`, `sprints/reviews/` and the
  knowledge-base being separately reported.
- **The R4-class consult tension from 0122 does not open a new hole here.** `claude/agents/fkit-lead.md`
  has **no** "a consult is a focused question, not a hand-off" rule (grep clean), so the lead side does
  not exist; the producer side (`fkit-producer.md:67`) does, and it is already covered —
  `0124-revert-task-movers-to-producer-only/brief.md:71-81` lists it and scopes the carve-out to
  "**both ship-loops**" via ADR-033 §3/§4. No new residual.
- **Independently re-verified, not taken on report:** `node --test test/*.test.js` → **511 pass / 0
  fail**; `diff` canonical vs `.claude/` mirror → **identical**; `brief.md` diff is the status line
  only; `sprint-2.md` diff is the priority-106 row only. The coder's caveat is correct and worth
  keeping: **no test reads any `SKILL.md` at runtime**, so the green suite proves no regression, not the
  change — and the change is **not exercised end-to-end** (the loop is lead-only, ADR-018).
- **ADR-033 citations are accurate** — §1, §4, §5, §Consequences and §The limit all exist and say what
  the file claims; the cost sentence at `:36-37` matches §Consequences' "more spawns, one more hop".

### Round 1 — reviewer closeout (phase 2, 2026-07-25)

**No second review pass.** Phase 2 records dispositions; it does not re-derive findings. But dispositions
are recorded **only against verified state** — I re-read both files and the worklog rather than taking
the fix report on trust. That is how R6 surfaced.

| # | Owner disposition | Landed? | Evidence |
|---|---|---|---|
| R1 | (c) fix both loops now **and** name the follow-up | ✅ verified — **but see R6** | `fkit-sprint-ship-loop/SKILL.md:171-186` and `fkit-task-ship-loop/SKILL.md:177-188` now split the two cases. *Folder never moved* → re-spawn once, and the performability claim is **correct** (the mover runs normally from `backlog/`). *Folder moved, status/href stale* → owner-only, do not re-spawn, leave a landed `✅ Done` untouched. Both mover citations check out: `fkit-task-done/SKILL.md:60-64` is the stop-if-already-in-`done/` rule with the owner-only exception, and the skill-gated rule is at `:265-267`. **Two off-by-one citations, cosmetic:** the files cite `:59-65` (rule starts at 60) and `:266-268` (the load-bearing sentence starts at **265**, so the citation omits its first line). Follow-up 1 named in `worklog.md`. |
| R2 | resolved by R1's rewrite | ✅ verified | The reconciling sentence is restored in corrected form in both files — `fkit-sprint-ship-loop/SKILL.md:184-186`, `fkit-task-ship-loop/SKILL.md:187-188`. The "never patch a status yourself" vs "write in both locations" contradiction **inside the bullet** is gone. It has been replaced by a contradiction with the *invariants* — R6. |
| R3 | record-and-continue | ✅ verified | `grep "relay to the owner"` → **zero hits**, independently re-run. `:183` now reads "**report it to the owner**"; the stop row `:212` reads "**report** it — do not pause the sprint; … next eligible task". The two agree. **I agree with the coder that the single-task sibling correctly still STOPs** — it has no next task, so record-and-continue is meaningless there; this is a justified asymmetry, not divergence. |
| R4 | fixed | ✅ verified | `worklog.md` now states the same-line colon survives on **loader leniency, not validity**, and names all **three** affected skills. The coder re-derived the count independently — correct. |
| R5 | fixed | ✅ verified | `worklog.md` now records the narrower criterion, and the block-scalar reason the agent definitions are immune. |

**Independently re-verified this turn** (not taken on report): `node --test test/*.test.js` → **511
pass / 0 fail**; **both** mirrors `diff` → identical; brief criteria 1–4 **still met** after the
post-disposition edits (the honesty clause `:51-67`, §1, §3 and the declared-approval rules are still
byte-identical to `HEAD`; the edits touched only §4's recovery bullet and one stop row).

**On the sibling edit to closed task 0122 — I consider it correct, and correctly disclosed.** It was
owner-authorized, it is the minimum surface that removes the shared defect (the recovery bullet plus one
stop-table row), it does not touch anything else 0122 shipped, and it was flagged in the ledger, the
worklog *Change surface* and the coder's report rather than quietly amended. Leaving the closed sibling
un-fixed would have been the worse outcome: a known-unperformable instruction live in the coder's
default loop. **A note has been added to 0122's own ledger** so a later reader does not believe that
ledger's verified state still describes the file.

### Round 2 — reviewer closeout (phase 3, 2026-07-25)

**Verified against the files, site by site — not by re-reading the fix report.** This is the check I
asked for and the coordinator asked me to make explicit, because the two previous rounds broke here.

| # | Owner disposition | Landed? | Evidence — each of the three invariant sites, checked individually |
|---|---|---|---|
| R6 site 1 | carve-out at the sprint driver's invariant | ✅ verified | `fkit-sprint-ship-loop/SKILL.md:218-223` — blockquote directly after the "no path ends in silence" invariant. Names it "**the one carve-out**", scopes it to the moved-folder case, states a landed `✅ Done` is the owner's, prescribes marking **only** the stale location, gives the structural reason (no agent can lawfully reconcile), cites the mover, and closes with "It is **reported**, never silent." Correct and complete. |
| R6 site 2 | carve-out at `fkit-task-ship-loop:110-111` | ✅ verified | `:110-115` — the "Status write = both locations" bullet now carries the exception **inline**, and critically it admits the exception against the exact clause I cited: *"a half-written status is an error to finish, never left disagreeing. **One carve-out — a half-landed close** (step 9) …"* with "That is the single sanctioned disagreement". This was the site 0122's R1 hinged on; it is now honest. |
| R6 site 3 | carve-out at the "Any early exit" paragraph | ✅ verified | `fkit-task-ship-loop/SKILL.md:205-207` — "**both locations** — except the step-9 half-landed close, where only the stale location is marked and a landed `✅ Done` is left for the owner". Correct. |
| R6 secondary | never-moved sub-case → both locations | ✅ verified **in the prose of both files** | `fkit-sprint-ship-loop:175-176` and `fkit-task-ship-loop:184-185` both now state that if the re-spawn also fails, nothing was closed and no `✅ Done` exists, so the ordinary both-locations rule applies. **Missed in both stop tables — R8.** |
| R7 | 4 stale worklog statements | ✅ 3 of 4 verified; 1 recurred | Change surface now lists **both** refreshed mirrors ✅; Commit state now says "**two** SKILLs" and names which is which ✅; the `:157`→`:158` citation is corrected ✅. The R1 residual now points at R6 ✅ — **but the replacement sentence is itself now stale (R9)**. |

**No new contradiction introduced by the carve-out.** I enumerated **every** both-locations / stale-location
site in both files, not just the three that were edited: `fkit-sprint-ship-loop:93` (mark In progress),
`:176`, `:208` (plan-rejected reset), `:213`, `:216`, `:218-223`; `fkit-task-ship-loop:110-115`, `:185`,
`:205-207`, `:263` (verification budget), `:267`. The only inconsistency among them is R8. The
pre-existing counter-invariant `fkit-task-ship-loop:272` ("on an early exit `🔄 In progress` is correct,
not stale") is correctly still untouched — it is 0122's accepted residual and does not collide with this
branch.

**Independently re-verified this turn:** `node --test test/*.test.js` → **511 tests, 511 pass, 0 fail**;
**both** mirrors `diff` → identical; the **plan-gate honesty clause `:51-67` is still byte-identical to
`HEAD`** (re-checked after these edits, since it is the criterion most at risk); brief criteria 1–4 all
still met — criterion 1 re-verified against all **six** current `/fkit-task-done` mentions, every one of
which is *never-invoke-it* or *the-producer-invokes-it*.

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT — and I verified the mechanism myself, not on report** | Defect (cross-file) | Confirmed against `fkit-task-done/SKILL.md:59-65`: the mover **stops** when the folder is already in `ai-agents/tasks/done/`, and the one exception (the owner-verification upgrade) is explicitly **owner-only** — *"An agent hitting this case still stops."* `:266-268` adds that `Done` may be set **only** by that skill, never by hand-editing. So in the precise partial case the new confirm check is designed to catch — folder moved, a status row stale — my "re-spawn `@fkit-producer` once to reconcile" **cannot be performed by anyone but the owner.** The reviewer is also right that this is **not a slip in my file**: the identical instruction is already shipped in `fkit-task-ship-loop/SKILL.md:177-181` (task **0122, closed**), so a 0123-only fix re-diverges the two loops — the exact outcome owner decision 1 was taken to prevent. **⛔ STOPPED for the owner:** the complete fix is cross-file and partly a change to the mover's own contract, i.e. outside this approved plan. **Owner ruled (2026-07-25): fix both loops now + file the follow-up brief.** FIXED in **both** files by splitting the two cases honestly: *folder never moved* → re-spawn the producer once (performable — the mover runs normally from `backlog/`); *folder moved, a status/href stale* → **owner-only**, do not re-spawn, write `🚧 Blocked — hand-off incomplete` **on the stale location**, leave any landed `✅ Done` untouched, and STOP/report. ⚠️ **This edited `claude/skills/fkit-task-ship-loop/SKILL.md`, whose task 0122 is already CLOSED** — reported to the owner, not quietly amended. Follow-up (a sanctioned producer-only "finish an already-moved close" mode) named in the worklog for the producer to file. | fixed both loops (owner-approved) |
| R2 | CORRECT | Defect | Confirmed: my §4 half-landed bullet says both *"never patch a status yourself"* and *"write `🚧 Blocked …` in **both** locations"*, and I dropped the sibling's reconciling sentence (`fkit-task-ship-loop/SKILL.md:180-181`: *"Statuses on a closing task are the producer's to write; the loop writes only its own `🚧 Blocked` marker, and **never** a `✅ Done`"*). Mechanical and in-plan — **but deliberately NOT applied yet**: it rewrites the same two sentences R1's fix must rewrite, and applying it first would either be redone or would harden a promise R1 says is unperformable. **Sequenced behind R1's disposition**, not deferred. **Resolved by R1's rewrite** — the new final sub-bullet states it in both loops: *"the driver/loop writes **only** its own `🚧 Blocked` marker, and **never** a `✅ Done` — statuses on a closing task belong to the producer, and a landed close belongs to the owner."* The "never patch a status yourself / write in both locations" contradiction is gone: the recovery now writes on **the stale location only**, never over a landed `✅ Done`. | fixed |
| R3 | CORRECT | Defect | Confirmed: §4's bullet says *"relay to the owner"* — which in this file (`:140-143`) is a **blocking** act — while the new stop-table row says *"next eligible task"*. A failed hand-off currently has two different control flows. Whether a failed hand-off **pauses the sprint** or **records-and-continues** is a control-flow doctrine call for a multi-task driver ⇒ **⛔ STOPPED for the owner**. **Owner ruled (2026-07-25): record-and-continue** (the reviewer's recommendation — matches every other `🚧 Blocked` row, and one stuck close should not strand a multi-task sprint). FIXED: §4's *"relay to the owner"* → **"report it to the owner"** (non-blocking), and the stop row now says **"report it — do not pause the sprint; next eligible task"**. The two now agree; `grep "relay to the owner"` → zero hits. **The single-task sibling still STOPs**, correctly — it has no next task. | fixed (owner-approved) |
| R4 | CORRECT | Defect (worklog) | Verified independently: three skills — `fkit-dumb-down`, `fkit-task-brief`, `fkit-task-ship-loop` — carry a same-line `": "` in a **plain-scalar** description. My worklog's *"it **does** parse"* was wrong (it survives on **loader leniency**, not validity) and I implied one file, not three. **FIXED autonomously** (mechanical, worklog-only, verified). | fixed |
| R5 | PARTIALLY CORRECT | Defect (worklog) | Agreed on both halves: the sweep's **outcome** was sound (zero continuation-line hazards; reviewer confirmed across all 20 skills), but my **criterion was narrower than the hazard class**, and I never recorded *why* the agent definitions are immune (`description: >-` block scalars make a colon ordinary text). **FIXED autonomously** — the worklog now states the limit, the three affected skills, and the block-scalar reason. | fixed |

**Round 1 disposition.** **2 of 5 applied** (R4, R5 — mechanical, worklog-only, independently verified).
**1 held by sequencing** (R2 — mechanical and in-plan, but it edits the sentences R1's fix rewrites).
**2 ⛔ STOPPED for the owner** (R1 cross-file + touches the mover's contract; R3 a control-flow doctrine
call). Plus the reviewer's fourth question — a **new brief** for the YAML hazard class — which is new work
and the owner's to authorize.

**On the reviewer's verdict: I do not dispute it.** `🛑 Blocked` is right. R1 is a defect in text I wrote,
and its presence in the closed sibling is worse news than the finding itself — **0122 shipped with it and
nobody caught it there**, including me and including the review that closed it out.

**Owner dispositions received (2026-07-25, live `AskUserQuestion` in the coder session)** — all three
answered with the recommended option:
1. **R1** → *fix both loops now + file the follow-up brief.* Both files corrected; the follow-up is named
   in the worklog for the producer to file. **The sibling edit touches a closed task's file — flagged, not
   hidden.**
2. **R3** → *record-and-continue*, with §4 reworded from "relay" to "report".
3. **YAML hazard** → *name the follow-up in the worklog*; the loop names follow-ups, the producer files
   them. Nothing lands in this task.

**All 5 findings now resolved** (R1, R2, R3 fixed in file; R4, R5 fixed in the worklog). Re-verified after
the post-disposition edits: `node --test test/*.test.js` → **511 pass / 0 fail**; **both** mirrors `diff`
identical; both skill descriptions render correctly in the live skill listing; `grep "relay to the owner"`
→ zero; the brief's criteria 1–4 unaffected by these edits (they touched only §4's recovery bullet and one
stop row).

### Round 2 — coder response (R6, R7)

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R6 | **CORRECT — verified the three sites myself** | Defect | Confirmed by reading each: `fkit-sprint-ship-loop:215-216` and `fkit-task-ship-loop:198-199` say status goes to **both** locations unconditionally; `fkit-task-ship-loop:110-111` says *"a half-written status is an error to finish, **never left disagreeing**"* — and the reviewer is right that **this is one of the sites 0122's R1 cited.** My R1 fix landed on one side of that rule without amending it. **Owner ruled (2026-07-25): option (a) — carve-out at all three sites.** FIXED: each invariant now names the half-landed close as **the one sanctioned disagreement**, states *why* (no agent can lawfully reconcile it — `fkit-task-done/SKILL.md:59-65`, `:266-268`), and keeps "it is **reported**, never silent". Also fixed the reviewer's secondary point: the **folder-never-moved** sub-case now says explicitly that if the re-spawn also fails, **no `✅ Done` exists, so the ordinary both-locations rule applies** — the under-specification is gone. | fixed (owner-approved) |
| R7 | CORRECT | Defect (worklog) | All four stale statements verified and **FIXED autonomously** (mechanical, worklog-only): the R1 residual no longer calls itself the one open item (it points at R6); Change surface lists **both** refreshed mirrors; Commit state says **two** SKILLs and names which; the `:157` citation corrected to `:158`. | fixed |

### Round 3 — coder response (R8, R9)

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R8 | CORRECT | Defect | Confirmed: both stop-table rows still carried the pre-R6 *stale-location-only* rule, and the sprint row's "**Either way**, if unresolved" openly contradicted §4's never-moved both-locations case. **FIXED** — each row now splits the sub-cases: *folder never moved* → re-spawn once, then **both** locations if still unresolved; *folder moved, status/href stale* → owner-only, mark **only the stale location**, never over a landed `✅ Done`. **The lesson I'm recording: the same corrected rule was right in the prose and stale in the summary table, in both files.** A table that summarizes a rule goes stale silently when the rule changes. | fixed |
| R9 | CORRECT | Defect (worklog) | All three confirmed and **FIXED**: (1) the stale "R6 is now the task's one substantive open item" line now records R6 as fixed and the whole chain as closed; (2) the mover-mention count **two → six** — I re-read all six (`:106`, `:158`, `:178`, `:179`, `:180`, `:223`), every one *never-invoke-it* / *producer-invokes-it* / a citation, so **criterion 1 substantively holds**, and the sentence claiming a re-check is now true; (3) the off-by-one citations corrected everywhere — `:266-268` → **`:265-267`** (verified: `fkit-task-done/SKILL.md:265` is where *"`Done` is skill-gated"* starts) and `:59-65` → **`:60-64`**, across both skills and the worklog. | fixed |

**On R9 item 2, without excuse:** the count was wrong *in the sentence that claimed it had been
re-checked* — twice over, since R7 had already corrected the line numbers in it. Enumerations in an
evidence packet drift on every subsequent edit; the fix is to re-derive them at the end, not to patch them
forward. Noted in the worklog as the actual lesson.

**Both fixes were applied under this loop's autonomy** — mechanical, verified `CORRECT`, and inside the
approved plan's intent (R8 finishes the owner-approved R6 carve-out; R9 is evidence-packet accuracy).

**I accept the reviewer's pattern warning rather than arguing with it** — and note it then **discharged**
it in round 3 on stated grounds (all carve-out sites correct, findings outside the fix's logic, severity
high → medium → low), explicitly telling me *not* to hand this to the follow-up. I record its call, not a
re-derivation of my own. Two consecutive rounds found the
defect *inside the previous round's fix*. This round's fix was therefore written to the specific failure
mode named — a carve-out at each cited invariant site plus the under-specified sub-case — and the reviewer
is asked to verify it **against all three sites and both files**, not re-read it. If round 3 finds a defect
inside *this* fix, the standing signal is to **stop patching §4** and let the named follow-up (a sanctioned
producer-only "finish an already-moved close" mode) carry it.

**Re-verified after the R6/R7 edits:** `node --test test/*.test.js` → **511 tests, 511 pass, 0 fail**;
**both** mirrors `diff` identical; both skill descriptions still render correctly in the live listing.

**Not disputed but worth recording:** the reviewer's judgment that the **conversion** (all skill
descriptions → `>-`) beats a test alone, because a guard test written today would have three pre-existing
failures to grandfather. I agree, and note the ADR-014 constraint it names (zero devDeps ⇒ no YAML library
⇒ the guard hand-rolls a reader, which block scalars make trivial).

## Re-litigates settled decisions (suppressed)

Recorded, not dropped — none of these is a finding for this round.

- **`:124-127` / `:157-158` assert a hook denial that is not yet true.** `claude/skills-for-role.sh:37`
  still grants both movers to `lead`, so "the ADR-018 hook **denies** a mover call from the `lead`
  identity at any spawn depth" and "producer-only is hook-structural … not a request" are true only
  after 0124 lands; today a mistaken driver self-close would silently succeed. **This is the accepted
  0123→0124 sequencing window** — recorded at `plan.md:116-118` and `worklog.md:104-105`, worded
  identically to the already-shipped sibling (`fkit-task-ship-loop/SKILL.md:161-163`), and covered by
  0122's accepted residual whose re-raise condition ("0124 slips far enough that the window becomes the
  steady state, or a self-close actually occurs in it") is **not met**. Codex independently declined to
  re-raise it. Re-raise only on that condition.
- **`claude/agents/fkit-lead.md:56-58` still says the loop "closes each task itself with the
  `(agent-closed — not owner-verified)` marker by default"** — a system prompt, which outranks a SKILL
  in the driver's context. **Owner decision 2** routed this to 0124 item 5 rather than fixing it here.
  Not re-litigated. Tracked below as an open dependency, not a finding.
- **Extra-hop laundering is not closed by routing through a producer** (ADR-033 §The limit). The file
  states it plainly at `:162-163` and `:176-178` and does not understate it. Re-raise only if the file
  hides it.
- **Producer-route-by-default rather than always handing the close to the owner.** Owner decision;
  implementation matches it (`:106`, `:157-158`; degraded runs stop, `:175-178`, `:202`).
- **The plan gate stays the only human checkpoint and stays prose-enforced.** ADR-032 D7. Byte-unchanged
  at `:51-67`; re-stated correctly at `:224-225`.
- **The loop cannot cancel; a cancel always stops for the owner.** ADR-025 §Consequences. Correctly
  carried at `:179-181`, with the added clause that a cancel is never routed to a producer either.
- **The degraded-run and cancel STOPs prescribe no explicit status.** 0122 accepted residual; unchanged
  by this task. Re-raise only if a real run leaves a task stranded because of it.
- **Owner decision 1 (mirror 0122's confirm-the-close discipline into the sprint loop)** is not
  re-litigated — the discipline is present and correctly widened. R1/R2 are the opposite complaint:
  the mirror is **incomplete**, not unwanted.

## Open dependencies (NOT residuals — these are unfinished)

- **`claude/agents/fkit-lead.md:56-58` is routed, not landed.** Owner decision 2 sends it to 0124 item
  5; it rides on this task's closing producer spawn. Verified this round: 0124's brief does **not** yet
  mention `fkit-lead.md`. **Status: OPEN.** Closed only by reading 0124's brief and seeing
  `fkit-lead.md:56-58` listed. **Do not mark it resolved on the strength of the routing.** It does not
  block 0123.

## Accepted residuals (shared, do-not-re-litigate)

Owner-approved 2026-07-25 as settled tradeoffs of this task.

- **A close that moves the folder but leaves a status or href stale is repairable by nobody but the
  owner** — What: both ship-loops now state plainly that in this case no agent may act — the driver/loop
  does **not** re-spawn the producer, marks only the stale location `🚧 Blocked — hand-off incomplete`,
  leaves any landed `✅ Done` untouched, and reports (sprint loop) or STOPs (task loop). · Why
  (structural): `/fkit-task-done` **stops** on a folder already under `ai-agents/tasks/done/` and its one
  exception is **owner-only** (`fkit-task-done/SKILL.md:60-64`), while `Done` is skill-gated and may
  never be hand-edited (`:265-267`). Any agent-side remedy would require either re-entering the mover
  (forbidden) or hand-writing a status (forbidden). The loops are therefore honest about a gap they
  cannot close. Rejected alternative: keep "re-spawn the producer to reconcile" — demonstrably
  unperformable (R1). · **Re-raise only if:** the follow-up lands (a sanctioned producer-only "finish an
  already-moved close" mode for `/fkit-task-done`, named in `worklog.md`), at which point **both** loops
  must be updated together — or a real run strands a task in this state and the owner-only escalation
  proves too slow.
  · **Round 3 amendment (owner-approved):** the consequence of this residual — that the brief's status and
  the sprint row are **knowingly left disagreeing** in this one branch — is now stated as an explicit
  carve-out at all three invariant sites (`fkit-sprint-ship-loop:218-223`,
  `fkit-task-ship-loop:110-115`, `:205-207`), each naming it the *single sanctioned disagreement* and each
  requiring it be reported. **Do not "fix" any of those three carve-outs away** — a later reader removing
  one restores the R6 contradiction. The ordinary both-locations rule still governs the never-moved
  sub-case (`fkit-sprint-ship-loop:175-176`, `fkit-task-ship-loop:184-185`).

- **A failed hand-off does not pause the sprint** — What: the sprint driver records
  `🚧 Blocked — hand-off incomplete`, reports it, does not count the task shipped, and **advances to the
  next eligible task**; the single-task sibling still STOPs. · Why (structural): every other `🚧 Blocked`
  row in the sprint driver's exit table skips to the next task, and one stuck close should not strand a
  multi-task sprint run; the asymmetry with the sibling is justified because the sibling has no next
  task. Rejected alternative: relay-and-block via `AskUserQuestion` — that is the "Owner decision
  pending" row's behavior and a hand-off failure is informational, not a question. · **Re-raise only
  if:** a real run advances past a failed hand-off and the owner does not see it in time to act.

- **The YAML hazard class is named, not fixed** — What: three skills (`fkit-dumb-down`,
  `fkit-task-brief`, `fkit-task-ship-loop`) carry a same-line `": "` in a bare plain-scalar
  `description`, which is invalid strict YAML surviving on loader leniency; no test reads any `SKILL.md`,
  so a break degrades silently to the file's H1. The follow-up (convert every skill `description:` to a
  `>-` block scalar, then add a frontmatter-parse guard) is **named in `worklog.md`** for the producer to
  file, not done here. · Why (structural): it is new work across ~20 files plus a new test, outside this
  task's approved one-file scope, and ADR-014's zero-devDeps rule means the guard must hand-roll a reader
  — which the conversion makes trivial, so the conversion must come first. Rejected alternative: add the
  guard test now — it would have three pre-existing failures to grandfather on day one. · **Re-raise only
  if:** a frontmatter break actually reaches a skill listing again, or the follow-up is still unfiled when
  the next skill-description edit lands.
