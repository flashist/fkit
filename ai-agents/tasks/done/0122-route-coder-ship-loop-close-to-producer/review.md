# Review — 0122-route-coder-ship-loop-close-to-producer

Task: `ai-agents/tasks/backlog/0122-route-coder-ship-loop-close-to-producer/brief.md`
File(s) under review: `claude/skills/fkit-task-ship-loop/SKILL.md` (whole diff) ·
`ai-agents/tasks/backlog/0122-route-coder-ship-loop-close-to-producer/brief.md` (status line only) ·
`ai-agents/sprints/sprint-2.md` (line 137 only) · that task folder's new `plan.md` and `worklog.md`
Status: closed-out

**Round 1** — reviewers: fkit-reviewer (own pass) + Codex adversarial pass
(`codex exec --sandbox read-only`, completed, exit 0). **Full model-diverse coverage — no degradation.**

**Round 1 verdict (as issued):** ⚠️ **Changes requested — 6 defects (none blocking).** The design is
sound and the brief's four verification criteria are all met; every finding is a text-level gap in the
newly-written *failure* branches of step 9, or a documentation-accuracy fix.

**Closeout verdict (phase 2, 2026-07-25):** ✅ **Ready to close — 5 of 6 fixed and verified, 1 routed
and OPEN.** No second review pass was needed or run. The one open item (R4) is **outside this task's
file scope** and does not block 0122; it blocks nothing until 0124.

> ## ⚠️ Post-closeout amendment — this ledger's verified state is NO LONGER current
> **Added by the reviewer 2026-07-25, during task 0123's review. 0122 stays closed; this is a pointer,
> not a re-opening.**
>
> **`claude/skills/fkit-task-ship-loop/SKILL.md` was edited after this ledger closed out**, under an
> explicit owner disposition taken during **task 0123**'s review, and disclosed by the coder rather than
> quietly applied. What changed: the **R1 fix recorded above is itself defective**, and the same defect
> shipped here.
>
> R1's remedy — *"re-spawn `@fkit-producer` once … and ask it to reconcile its own close"* (recorded above
> as ✅ verified at `SKILL.md:177-181`) — is **unperformable in the case it targets.** `/fkit-task-done`
> **stops** on a folder already under `ai-agents/tasks/done/`, and its only exception (the
> owner-verification upgrade) is **owner-only** — *"An agent hitting this case still stops"*
> (`fkit-task-done/SKILL.md:60-64`); and `✅ Done` is skill-gated, never hand-editable (`:265-267`). So
> once the producer has moved the folder, **no agent** can finish a partial close. **Neither the coder nor
> this reviewer caught it when 0122 closed** — it was found by the Codex pass on 0123 and verified there.
> Recorded plainly because a review that closed out on a defective fix should say so.
>
> **The file now reads** (`:177-188`): split the two cases — *folder never moved* → re-spawn the producer
> once (performable); *folder moved, a status/href stale* → **owner-only**, do not re-spawn, mark only the
> stale location `🚧 Blocked — hand-off incomplete`, leave any landed `✅ Done` untouched, and STOP.
>
> **Follow-on, now RESOLVED (0123 round 3, 2026-07-25):** that first rewrite contradicted this file's own
> `:110-111` (*"a half-written status is an error to finish, never left disagreeing"*) and the
> "Any early exit … **both locations**" paragraph, neither of which had been amended — tracked as **R6 in
> [0123's ledger](../../done/0123-route-sprint-ship-loop-close-to-producer/review.md)**. The owner
> ruled a carve-out at every invariant site, and it landed: `:110-115` now admits the exception inline
> against the "never left disagreeing" clause, and `:205-207` carves it out of the early-exit rule.
> **Verified by the reviewer site by site.** One low tidy-up remains — the stop-table row at `:267` still
> carries the pre-carve-out wording (**R8** in 0123's ledger).
>
> **Do not re-raise R6 or R8 here, and do not treat 0122's `✅ Done` as evidence about this file's current
> text** — for the live state of `fkit-task-ship-loop/SKILL.md`, read 0123's ledger, not this one.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-task-ship-loop/SKILL.md:245` | Partial-close recovery is unsatisfiable: the trigger "closed only one location" produces a state where one location already reads `✅ Done`, so "leave `🔄 In progress`" is not performable — and it collides with `:110-111` (a half-written status is "an error to finish, never left disagreeing"), `:172` ("never patch a status by hand"), `:251-252` (on resume "correct any status that no longer matches reality") and `:253` (the loop never sets `✅ Done`). No branch re-spawns the producer to reconcile. Raised by both reviewers. |
| R2 | 1 | medium | `claude/skills/fkit-task-ship-loop/SKILL.md:169-171` | The new confirm-the-close-landed check is narrower than the mover's own write contract, so a partial close passes it. Step 9 checks 3 things (folder under `done/`, brief `## Status`, sprint row); `/fkit-task-done` writes up to six kinds of location — brief status, sprint-plan row, an in-body `**Status:**` line, the parent-epic slice table, `backlog.md`, plus href re-pointing in `sprints/done/` and `sprints/reviews/` (`claude/skills/fkit-task-done/SKILL.md:72-73,92-99,123-136,146-155,213`). A close leaving the parent epic, a `backlog.md` row, or a now-broken `backlog/` href stale is reported to the owner as landed — against this change's own "Do not claim a close you did not verify." The failure row's trigger "closed only one location" also mis-states the location count. |
| R3 | 1 | medium | `claude/skills/fkit-task-ship-loop/SKILL.md:245` | Step 9's three STOP branches disagree with the "Any early exit" paragraph on what status to leave. `:245` prescribes `🔄 In progress`; `:183-184` says **any** early exit writes `🚧 Blocked — <reason>` in **both** locations. The degraded-run STOP (`:174-177`) and the cancel STOP (`:178-181`) prescribe no status at all. Note `:250` ("on an early exit `🔄 In progress` is correct, not stale") is a **pre-existing** counter-invariant — the tension predates this change; the new row lands on one side of it without reconciling the other three sites. Raised by both reviewers. |
| R4 | 1 | medium | `claude/agents/fkit-coder.md:165` | The step-9 producer spawn is an **action hand-off**, but the coder's own **hard consult rule** reads "A consult is a focused question, not a hand-off" (mirrored at `claude/agents/fkit-producer.md:67`, which adds "keep the decision that belongs to you"). A system prompt outranks a SKILL in the coder's context. Neither 0122's approved plan (out-of-scope list, `plan.md:28-35`) nor 0124's brief (which names `fkit-coder.md` 103 and 190-191, `fkit-producer.md` 7 / 37-38 / 95-96) covers line 165 or producer:67 — **the carve-out is unowned by every filed brief.** Raised by Codex; severity downgraded from its `high` (see report). Not fixable here — `fkit-coder.md` is outside this task's owner-approved scope; the action is to **record it as a residual with an owning brief**. |
| R5 | 1 | low | `ai-agents/tasks/backlog/0122-route-coder-ship-loop-close-to-producer/worklog.md:22-25` | The test inventory is inaccurate. The worklog says "only `task-id-uniqueness`, `dashboard-contract`, `skill-ownership-hook` read SKILL text at all". Verified: **no test reads any `SKILL.md` at runtime** — those three mention `SKILL.md` only in comments (`task-id-uniqueness.test.js:35`, `dashboard-contract.test.js:588`, `skill-ownership-hook.test.js:201`); the files the suite actually reads are the four hooks, `dashboard.sh`, `scaffold/universal-rules.md`, `orphan-targets`, and the ADR/task directories. The worklog's *conclusion* (the suite proves no regression, not the change) is correct and in fact stronger than stated. Raised by Codex (its paired "worklog incomplete" claim is disproven — see report). |
| R6 | 1 | low | `claude/skills/fkit-task-ship-loop/SKILL.md:32-33` | Misquote in the ⚠️ banner. It presents *"the doer marks its own work done with an extra hop."* as a direct quote attributed to ADR-033 §The limit. ADR-033:73-74 quotes **ADR-025** as *"the coder marks its own work done with an extra hop"* — "coder", not "doer", and the phrase originates in ADR-025 §"Why a spawned producer is not a second judgment", which ADR-033 is itself quoting. `plan.md:54` correctly used `≈` to mark a paraphrase; the SKILL hardened it into quotation marks. Substance is right; the attribution is not. |

### Round 1 — reviewer closeout (phase 2, 2026-07-25)

**No second review pass.** Per the stateful-review procedure, phase 2 records dispositions; it does not
re-derive findings. But dispositions are recorded **only against verified state** — I re-read the file
rather than taking the fix report on trust. What I checked, and found:

| # | Owner disposition | Landed? | Evidence |
|---|---|---|---|
| R1 | (c) re-spawn to reconcile, then Blocked | ✅ verified | `SKILL.md:177-181` — re-spawn `@fkit-producer` **once** naming what disagrees; on second failure write `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations and STOP; "the loop writes only its own `🚧 Blocked`, and **never** a `✅ Done`". |
| R2 | Widen to the producer's own close-out report | ✅ verified | `SKILL.md:169-176` — now requires **reading** the producer's step-7 report (board rows, brief `## Status`, parent-epic slice, `backlog.md`, in-body `**Status:**`, every re-pointed href incl. `sprints/done/`, `sprints/reviews/`, knowledge-base) and cross-checking it; states plainly a three-location spot-check cannot see a partial close. |
| R3 | Resolved by R1's fix | ✅ verified | Failure-table row (`:251`) rewritten to match `:183-184`'s both-locations `🚧 Blocked` doctrine. The `:245`/`:183-184` contradiction is gone. `:250` correctly left untouched. |
| R4 | Add to 0124 item 5 | ⚠️ **ROUTED — OPEN** | Not written by the coder (correct: 0124's brief is producer-owned). Carried on the closing producer spawn. **A routed request is not a landed edit.** Closed only by reading 0124's brief and seeing `fkit-coder.md:165` + `fkit-producer.md:67` listed. Recorded as an open dependency below. |
| R5 | Fixed | ✅ verified | `worklog.md:24-28` — now states no test reads any `SKILL.md` at runtime, and that a green suite proves *no regression*, not the change. |
| R6 | Fixed | ✅ verified | `SKILL.md:32-34` — exact wording *"the coder marks its own work done with an extra hop"*, attributed *(ADR-033 §The limit, quoting ADR-025)*. |

**Independently re-verified this turn** (not taken on report): `node --test test/*.test.js` → **511
pass / 0 fail**; `diff claude/skills/fkit-task-ship-loop/SKILL.md .claude/skills/fkit-task-ship-loop/SKILL.md`
→ identical; stale-self-close sweep → **no surviving claim** that the coder closes or writes the marker;
all **five** `/fkit-task-done` mentions (`:24`, `:105`, `:163`, `:170`, `:262`) are never-invoke-it or
the-producer-invokes-it. Brief criteria 1–4 all met.

**One correction, non-blocking, no new round:** `worklog.md:73-74` says "the **four** remaining mentions
… `:23`, `:161`, `:104`, `:252`". It is **five**, at `:24`, `:105`, `:163`, `:170`, `:262` — the R2 fix
added the `:170` mention and shifted every line number. The *substance* of brief criterion 1 is
unaffected (all five are never-invoke-it or producer-invokes-it, re-verified above); only the
enumeration in the evidence packet is stale. Worth a one-line touch-up whenever the worklog is next
edited — **not** grounds for another review round.

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Confirmed against the file. `SKILL.md:245`'s "leave `🔄 In progress`" **is** unsatisfiable in the partial case — if the producer already flipped one location to `✅ Done`, there is nothing to "leave". The row is mine (an obvious-winner addition beyond the plan's literal text). Fix requires choosing a **status doctrine** (blocked-both / leave-in-progress / re-spawn-to-reconcile) → a behavior change to the loop's contract, **outside the approved plan** ⇒ **STOPPED for the owner**, question 1. **Owner ruled (2026-07-25): re-spawn to reconcile, then Blocked.** FIXED — step 9 gains a bullet: re-spawn `@fkit-producer` **once** naming what disagrees; if it still fails, write `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations and STOP. Statuses on a closing task are the producer's; the loop writes only its own `🚧 Blocked`, never a `✅ Done`. | fixed (owner-approved) |
| R2 | CORRECT | Defect | Verified against `fkit-task-done/SKILL.md`: it writes the brief's own `## Status` (`:179`), board rows (`:126`), epic slice tables (`:130`), in-body `**Status:**` lines (`:134`), `backlog.md` (`:92`), and re-points hrefs in `sprints/done/` (`:136`), `sprints/reviews/` (`:153`) and the knowledge-base (`:235`) — and its step-7 report (`:220-237`) enumerates every doc it touched. So my three-location check can pass on a partial close. Real, and it undercuts the change's own "do not claim a close you did not verify". Widening the obligation is a behavior change ⇒ **STOPPED for the owner**, question 2. **Owner ruled (2026-07-25): check the producer's own report.** FIXED — step 9's confirm bullet now requires **reading the producer's step-7 close-out report** (which enumerates every doc touched, incl. repointed hrefs under `sprints/done/`, `sprints/reviews/`, knowledge-base) and cross-checking it against the visible state; it states plainly that a three-location spot-check cannot see a partial close. **Named residual:** this depends on the producer reporting honestly — prose-enforced, same trust class as the rest of the hand-off (ADR-033 §The limit). | fixed (owner-approved) |
| R3 | CORRECT | Defect | Confirmed: `:183-184` ("Any early exit … `🚧 Blocked — <reason>`, **both locations**") contradicts my new row's "leave `🔄 In progress`", and the degraded-run / cancel STOPs prescribe no status at all. Noting the reviewer's own caution: `:250` ("on an early exit `🔄 In progress` is correct, not stale") is a **pre-existing** counter-invariant — do not over-fix. Same cluster as R1, same owner question. **Resolved by R1's fix**: the failure row now prescribes re-spawn-then-`🚧 Blocked — hand-off incomplete` in **both** locations, which agrees with `:183-184`. `:250` left untouched per the reviewer's don't-over-fix caution (pre-existing, out of this task's scope). | fixed (owner-approved) |
| R4 | CORRECT | **Frontier-move** (record, don't fix here) | Verified `fkit-coder.md:165` — *"A consult is a focused question, not a hand-off"* — a **hard** rule, mirrored at `fkit-producer.md:67`. Step 9's producer spawn is an action hand-off, so the tension is real. **Out of this task's file scope** (0122 edits one SKILL) and **unowned by every filed brief** (0124 item 5 names coder 103/190-191 and producer 7/37-38/95-96, not 165 or 67). Recording a residual / assigning an owner is an owner call ⇒ **STOPPED**, question 3. **Owner ruled (2026-07-25): add it to 0124 item 5.** **Not fixed here and not fixed by me** — 0124's brief is a task-lifecycle document (producer-owned) and both agent definitions are 0124's scope. **Routed:** the same `@fkit-producer` spawn that closes this task carries the request to add `fkit-coder.md:165` + `fkit-producer.md:67` to 0124 item 5 as needing a sanctioned-hand-off carve-out. **Open until 0124's brief actually shows it** — see the worklog Residuals. | routed to 0124 (owner-approved) |
| R5 | PARTIALLY CORRECT | Defect | Independently verified: `task-id-uniqueness`, `dashboard-contract`, `skill-ownership-hook` mention `SKILL.md` **only in comments**; no test reads any `SKILL.md` at runtime. The reviewer is right that my worklog's inventory was wrong and that the conclusion is *stronger* than I wrote. **FIXED autonomously** (mechanical, in-plan, verified `CORRECT`): `worklog.md` Grounding now states no test reads a SKILL at runtime, and that a green suite proves no regression, not the change. | fixed |
| R6 | CORRECT | Defect | Verified ADR-033:71-72 — the quoted words are *"the **coder** marks its own work done with an extra hop"* (ADR-033 quoting ADR-025). My banner hardened a paraphrase (*"the doer…"*) into a quotation. **FIXED autonomously** (mechanical, one clause): `SKILL.md:32-34` now quotes the exact wording and attributes it (*ADR-033 §The limit, quoting ADR-025*). Substance of the residual unchanged. | fixed |

**Round 1 disposition.** 2 of 6 applied under this loop's autonomy (mechanical, verified `CORRECT`,
inside the approved plan). **4 STOPPED for the owner** — R1/R3 one status-doctrine decision, R2 an
accept-or-widen scope call, R4 an ownership call on a hard rule in a file this task does not own. Per
`fkit-task-ship-loop` step 6, a behavior-changing fix or anything outside the approved plan stops.

**Owner dispositions received (2026-07-25, live `AskUserQuestion` in the coder session)** — all three
questions answered with the recommended option:
1. **R1/R3** → *re-spawn the producer to reconcile, then Blocked.* Applied.
2. **R2** → *check the producer's own close-out report.* Applied.
3. **R4** → *add it to 0124 item 5.* Routed to the producer (not written by the coder).

**5 of 6 fixed; R4 routed, and it stays open until 0124's brief shows it.** Re-verified after the
post-disposition edits: `node --test test/*.test.js` → **511 pass / 0 fail**; mirror `diff` identical;
brief criteria 1–4 still met (grep sweep re-run — the five remaining `/fkit-task-done` mentions are all
*never-invoke-it* or *the producer invokes it*).

**Also noted, not a reviewer finding:** `plan.md:111` prescribes `node --test test/`, which **fails**
(`pass 0 / fail 1` — it tries to load `test/harness.mjs` / `prove-red.sh` as tests). The working
invocation is `node --test test/*.test.js`. **`plan.md` is deliberately left unedited** — it is the
owner-approved autonomy boundary and should not be silently rewritten after approval; the correction is
recorded here and in the worklog instead.

**Re-verified after the two fixes:** `node --test test/*.test.js` → **511 pass / 0 fail**; mirror
`diff` identical; the brief's four criteria still met (R6 touched banner prose only, R5 touched the
worklog only).

## Re-litigates settled decisions (suppressed)

Recorded, not dropped — none of these is a finding for this round.

- **Producer-route-by-default over always-hand-to-owner.** Owner decision, `plan.md:20-22`.
  Implementation matches it exactly (spawn `@fkit-producer` at hop 1 by default, `SKILL.md:161-167`;
  degraded run STOPs to the owner, `:174-177`). Re-raise only if the implementation diverges — it does
  not.
- **L1 "confused optimist" laundering survives with one extra hop.** ADR-033 §The limit; accepted
  residual. The ⚠️ banner (`SKILL.md:27-34`) states it plainly and does not understate or hide it.
  Re-raise only if the file hides it. (R6 concerns the *quotation*, not the substance.)
- **The plan gate remains the only human checkpoint.** ADR-019 §Decision 5 as amended by ADR-025 and
  ADR-033. Settled; the file re-states it correctly at `:36-38` and `:262-264`.
- **The loop cannot cancel; a cancel always stops for the owner.** ADR-025 §Consequences. Settled;
  correctly carried at `:178-181` and `:267-271`.
- **`fkit-coder.md:45/103/190` still asserts the coder self-closes, and the coder still holds the mover
  grant until 0124** — so between 0122 and 0124 landing the contradiction is live *and* un-enforced (a
  mistaken self-close would silently succeed rather than being hook-denied). **Frontier-move / accepted
  sequencing cost**, not a defect of this change: the coder recorded it in `plan.md:129-137` with its
  owning brief (0124 item 5). Suppressed — it had to land in the step-8 worklog's Residuals section,
  not only in `plan.md`, since the worklog is the evidence packet the owner reads. ✅ **Verified done:**
  `worklog.md:121-125`.

## Open dependencies (NOT residuals — these are unfinished)

- **R4 — the sanctioned-hand-off carve-out is routed, not landed.** `claude/agents/fkit-coder.md:165`
  and `claude/agents/fkit-producer.md:67` state as a **hard** rule *"A consult is a focused question,
  not a hand-off"*, which `fkit-task-ship-loop` step 9's producer spawn sits astride. Owner ruled
  (2026-07-25) it belongs in **0124 item 5**; the coder routed the request on the closing producer
  spawn and correctly did **not** write 0124's brief itself.
  **Status: OPEN.** Closed only by reading 0124's brief and seeing both line references listed.
  **Do not mark this resolved on the strength of the routing.** It does not block 0122; it is a
  precondition for 0124 shipping coherently.

## Accepted residuals (shared, do-not-re-litigate)

Owner-approved 2026-07-25 as settled tradeoffs of this task.

- **The widened confirm check trusts the producer's own report** — What: step 9 verifies a close by
  reading the producer's step-7 close-out report and cross-checking the visible state, rather than
  independently re-deriving every location the mover may have touched. · Why (structural): the mover
  writes up to eight kinds of location including re-pointed hrefs across `sprints/done/`,
  `sprints/reviews/` and the knowledge-base; independently re-deriving all of them would duplicate the
  producer's procedure inside the coder's loop. The dependency is **prose-enforced, not structural** —
  the same trust class as the rest of the hand-off (ADR-033 §The limit). It narrows the gap; it does not
  close it. Rejected alternative: keep the three-location spot-check (demonstrably blind to a partial
  close, R2). · **Re-raise only if:** a producer close-out report is found to have **misreported** what
  it touched, or a partial close reaches the owner as "landed" despite this check.

- **`:250` and the unstated status on the degraded-run / cancel STOPs are left as-is** — What: the
  invariant *"on an early exit `🔄 In progress` is correct, not stale"* (`SKILL.md:250`) stays, and the
  degraded-run STOP (`:181-184`) and cancel STOP (`:185-188`) continue to prescribe no explicit status.
  · Why (structural): both predate this task and are unchanged by it; the R1/R3 fix aligned the one
  branch this change actually created (half-landed hand-off) to `:183-184`'s both-locations `🚧 Blocked`
  doctrine. Reconciling the remaining pre-existing tension is a separate edit to text 0122 does not own.
  Rejected alternative: rewrite all four sites now — declined as over-fixing, on my own round-1 caution.
  · **Re-raise only if:** a real run leaves a task stranded because a degraded-run or cancel STOP wrote
  no status, or `:250` is found to contradict a *newly added* branch.

- **The 0122→0124 window: `fkit-coder.md:45/103/190` still tells the coder it self-closes, and the coder
  still holds the mover grant** — What: until 0124 lands, the coder's **system prompt** (which outranks
  a SKILL in its context) contradicts the new step 9, **and** a mistaken self-close would silently
  succeed rather than being hook-denied. · Why (structural): a **frontier-move**, not a defect of this
  change — ADR-033's ripple must land in some order, and the brief mandates 0122 before 0124 precisely
  so the loop is never pointed at a hook-denied call. The exposure is inherent to the sequencing, and it
  is recorded with its owning brief (0124 item 5) in `plan.md:129-137` and `worklog.md:121-125`.
  Rejected alternative: take 0124's scope into 0122 — declined; it would make the change unreviewable
  and unwind the owner-approved plan boundary. · **Re-raise only if:** 0124 slips far enough that the
  window stops being a hand-off gap and becomes the steady state, or a self-close actually occurs in it.
