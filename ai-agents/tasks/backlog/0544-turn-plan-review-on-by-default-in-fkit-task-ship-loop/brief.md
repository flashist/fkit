# Turn plan review on by default in `/fkit-task-ship-loop`: forward `--no-plan-review`, show the review record at the plan gate, write `plan-review.md` at approval (provisional owner ruling)

## ID
0544

## Sprint
Sprint 12

## Priority
P14

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Precondition — do not start (do not even plan) until the owner's Tier-2 probe has run.**
> The design this builds is *"feasible with a condition: confirm by owner probe"*
> ([ADR-060](../../../knowledge-base/decisions/adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md)
> Decision 9; report §7). Before planning, check that the design report
> ([`2026-10-24-design-plan-review-on-by-default-session-paths.md`](../../../knowledge-base/reports/2026-10-24-design-plan-review-on-by-default-session-paths.md))
> has a dated **"§8a Tier-2 results"** section — the owner's results, recorded verbatim by a
> `fkit-architect` spawn and read against §8's mapping table.
> - **§8a missing** → stop: in a session ask the owner (`AskUserQuestion`); spawned, return
>   `NEEDS-DECISION`. Do not plan around a missing probe.
> - **Any §8a result hits a §8 row other than *"§3.6 option A stands"*** → the design goes back to the
>   architect and ADR-060 gets a dated note **before** this task is planned.
> - **A skipped labelled addition is skipped, never passed.** This build rests on build 1's additions —
>   **3-notice, 3n, 5b, 5c and 5d**. Any of them recorded as skipped must be **named at this task's
>   plan gate and put to the owner** — go ahead with that condition unconfirmed, or run it first —
>   even if `0543`'s gate already asked (the owner may answer differently for this path).
>
> The probe is a check, not a task, so it is not a `Depends on:` link. It is the owner's alone to run.

**Where this comes from.** Task `0542` designed plan review on by default for the session paths;
ADR-060 records it (provisional and conditional — see above and `0543`'s *Context*). This is **build
2** of report §7 / ADR-060 Decision 11: `/fkit-task-ship-loop`. It reaches the review through its step
2's `/fkit-plan-task`, so it needs build 1's gated section first (`0543`).

**Owner rulings:** the same as `0543` (report §10.1, Q1–Q6). Placement: *"Q2 — Where do the build
briefs go once the design is approved?"* → *"Sprint 12"* (description he saw: *"This run could pick
them up; wait on 0542 in Sprint 12. Risk: old prompt text loaded here."*), 2026-10-24 ~14:57 UTC,
`fkit lead` session, `AskUserQuestion`.

**Locked decisions this touches.** ADR-019 Decision 2 / ADR-056 Decision 5: step 3's `⛔ STOP — plan
approval` stays the one guaranteed stop, and the owner approves last. ADR-060 Decision 7: a
NOT-model-diverse *plan* pass does **not** change step 9's close posture (that keys on the *code*
review's Codex mode).

## What to build

Per ADR-060 Decisions 3, 5 and 7 and report §3.2, §3.4, §3.7, §4.2 (the design is there in full):

1. **`claude/skills/fkit-task-ship-loop/SKILL.md`** — the *"**Argument:**"* paragraph accepts
   `--no-plan-review` (and the no-op `--plan-review`; both together, or any unrecognised `--` token,
   stops before planning and asks), read once at loop start; the one-skill-one-output litmus still
   holds and the paragraph says why.
2. **Step 2** forwards the flag to its `/fkit-plan-task`; the review runs **inside** step 2, before
   step 3's stop.
3. **Step 3's presentation** gains the banners, `Plan review: ON (default)`, the three attachments and
   the full record block; **step 3's rejection branch** gains `plan-review record not persisted (plan
   rejected while in plan mode)`.
4. **Step 4** writes `plan-review.md` next to `plan.md` on approval (ADR-056 Decision 6 format, under
   `## Attempt N — <date>`).
5. **The close-out evidence packet** carries the plan-review line with the Codex plan-pass mode.
6. `CHANGELOG.md`.
7. **Opted out is today's behaviour:** with `--no-plan-review`, steps 1–9 are unchanged.

## Verification steps

1. §8a exists in the report before the plan was written; any skipped addition this build rests on is
   named in the plan and the owner's answer recorded.
2. `0543` is `✅ Done` before this task is planned.
3. Live check, from a **fresh** `fkit coder` launch after refreshing `.claude/`
   (`claude/fkit-claude-init.sh .`), on a small real task: `/fkit-task-ship-loop <brief>` runs plan
   review in step 2, shows the record at step 3, writes `plan-review.md` at step 4, and puts the
   plan-review line in the evidence packet.
4. The same with `--no-plan-review`: the run matches today's flow, with `Plan review: off
   (--no-plan-review)`; and in a `fkit coder --no-plan-review` session, `Plan review: off (fkit coder
   --no-plan-review)`.
5. A typo flag (e.g. `--no-plan-reveiw`) stops the loop before planning and asks.
6. `npm test` green.

## Notes

- **Depends on:** 0543
- **Blocks:** nothing
- **Precondition (not a link):** the owner's Tier-2 probe, recorded as report §8a — see the top of
  *Context*.
- **Knock-on of placing it on Sprint 12:** it waits on `0543`, which is in this sprint. No task waits
  on a later sprint. No open task waits on `0544`.
- ⚠️ Priority P14 is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly below 0543**, because it builds on `0543`'s gated section — the
  same place as its append rank.
- ⚠️ **Old prompt text is loaded in the session that filed this.** The Sprint 12 `fkit lead` run that
  filed this brief has the pre-build `fkit-task-ship-loop` and `fkit-plan-task` text loaded. **Plan and
  build this from a fresh `fkit lead` / `fkit coder` launch after refreshing `.claude/`.**
  `/fkit-task-ship-loop` is session-only, so its live check needs a new `fkit coder`.
- **File overlap, not a dependency:** ADR-052 phase-5 `0453` (Backlog) rewires both ship loops. Per
  report §7, this lands first, and `0453` carries the flag and `plan-review.md` forward.
- **Shares files with `0545`** (`fkit-task-ship-loop`) — `0545` is advised to land after this one;
  ordering advice, not a link.
- **Classification hint, not a ruling:** a **product change** for plan review (session behaviour).
- **Filed 2026-10-24** by a spawned `fkit-producer` (no owner channel, ADR-021) at the direction of
  `fkit-sprint-ship-loop` (driven by `fkit-lead`), on the owner's placement ruling quoted in *Context*,
  from report §7 and ADR-060 Decision 11. ⛔ No commit.
