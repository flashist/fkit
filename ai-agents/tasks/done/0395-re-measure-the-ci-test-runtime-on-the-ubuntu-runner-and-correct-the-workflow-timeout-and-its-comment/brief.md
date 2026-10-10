# Re-measure the CI test runtime on the ubuntu runner, and correct the workflow timeout and its comment

## ID
0395

## Sprint
Sprint 10

## Priority
P11

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Provenance

**Owner ruling, 2026-09-14**, given live via `AskUserQuestion` in a live `fkit lead` session driving
`/fkit-sprint-ship-loop` (Sprint 9) — **the option label is the verbatim text**: **"File follow-up
brief (Rec)"**. The ruling's own description: *"The producer files a backlog brief to re-measure the
runtime on the CI runner and fix the timeout and its comment. 0388 records R6 as out of scope and
routed to that brief."*

**Origin:** review finding **R6** in
[`0388`'s review ledger](../../done/0388-give-the-sprint-mover-pins-and-the-successor-mode-durable-prove-red-mutations/review.md)
— the row that opens *"Not in this diff's files — observation. CI `timeout-minutes: 20`, with a comment
still quoting "15 mutants" and "~3x headroom" over ~6 min."* It is out of `0388`'s scope and routed
here.

### The problem

`.github/workflows/test.yml` sets `timeout-minutes: 20` on the `test` job. The comment above it
justifies that value with figures that no longer hold:

- *"`npm test` measured locally at ~5m30s-6m20s across four runs"* — stale.
- *"prove-red.sh, which re-runs the suites against 15 mutants plus 9 clean-copy baselines"* — the
  mutant count is stale. `test/prove-red.sh`'s own mutation index now runs to entry 39 once `0388`
  lands (its last entry: *"Name the wrong drift record in a sprint mover"*). The baseline count has
  not been re-checked either.
- *"20 minutes leaves ~3x headroom over the slowest local run"* — no longer true locally.

### What is known, and what is not

| Figure | Where measured | Source | Status |
|---|---|---|---|
| `prove-red.sh` 627–667 s | macOS, local, 2026-09-14, with `0388`'s mutations | `0388` review R6 / spawn relay | measured, **local only** |
| whole `npm test` ≈ 12.7 min (unit ~94 s + gate 667 s) | macOS, local, 2026-09-14 | `0388` review R6 | measured, **local only** → **~1.6x headroom** against 20 min |
| `0388`'s mutations 35–39 add ~88 s (isolated) | macOS, local | `0388` review R6 | measured, **local only** |
| whole CI job 5m12s – 8m26s (last five `test` runs, 2026-09-12 → 2026-09-14; the `npm test` step alone 8m15s on the 2026-09-14 run) | **ubuntu runner** | `gh run list --workflow test.yml`, read by the filing producer 2026-09-14 | measured, but **PRE-`0388`** — those commits do not carry mutations 35–39 |

⛔ **The ubuntu-runner runtime WITH `0388`'s mutations has not been measured. That measurement is the
first deliverable.** ⛔ **Do not pick a new timeout from the local macOS figures, and do not pick it
from the pre-`0388` runner history above** — the local machine and the runner differ in speed, and the
pre-`0388` runs are missing ~88 s of mutations (local figure). The pre-`0388` history is a
**baseline to compare against**, nothing more.

⚠️ Note the runner history already contradicts the comment: runs of ~8 min on the runner against a
comment claiming ~6 min, before `0388` added anything. The ~3x headroom claim was already eroding.

### Dependency

⛔ **Depends on `0388` landing** (Sprint 9). Its mutations 35–39 are part of the runtime being
measured; measuring before it lands measures the wrong suite.

## What to build

1. **Measure on the runner (first deliverable).** Once `0388` is on `main`, collect the ubuntu-runner
   wall time of the `npm test` step and of the whole `test` job, from **at least three** runs of
   commits that contain `0388`'s mutations (push runs and/or `workflow_dispatch` runs — the workflow
   already declares `workflow_dispatch`). Record, per run: run id, commit, `npm test` step duration,
   whole-job duration. If the logs let you separate the unit phase from `prove-red.sh`, record that
   split too. ⚠️ Triggering a run needs a commit on the remote; **pushing is the owner's act** — ask,
   do not push.
2. **Recount what the comment claims.** The current mutation count and clean-copy baseline count in
   `test/prove-red.sh`, taken from the file, not from this brief.
3. **Choose the new `timeout-minutes` at the plan gate with the owner.** The existing stated policy is
   *"~3x headroom over the slowest"* run, while still *"stopping a hung prove-red.sh from burning a
   runner for six hours"*. Default recommendation: keep that policy, applied to the **slowest
   measured runner run**. A different ratio is the owner's call.
4. **Rewrite the comment** so every figure in it is true and sourced: runner-measured figures (with
   date and what was measured), the current mutant/baseline counts, and the headroom ratio the new
   value actually gives. Consider wording that rots less — e.g. naming the task/date the count was
   taken at rather than presenting a bare count as timeless. The implementation choice is the coder's.
5. Keep the other load-bearing comments in the file untouched (the `fetch-depth: 0` and no-`npm ci`
   notes).

## Verification steps

1. The worklog records ≥3 ubuntu-runner runs on commits containing `0388`'s mutations: run id, commit,
   `npm test` step time, whole-job time. Each run id is openable with `gh run view <id>`.
2. `timeout-minutes` in `.github/workflows/test.yml` divided by the slowest recorded runner whole-job
   time equals the ratio the new comment states (to the rounding the comment uses), and matches the
   ratio ruled at the plan gate.
3. Every count in the new comment matches `test/prove-red.sh` at the commit being shipped (mutation
   index entries; clean-copy baselines) — checked by reading the file, recorded in the worklog.
4. The comment no longer contains *"15 mutants"*, and no local-only figure is presented as the basis
   for the timeout.
5. `npm test` passes locally, and the first CI run after the change completes green **inside** the new
   timeout.
6. `git diff` touches `.github/workflows/test.yml` only (plus this task folder), unless the plan gate
   ruled the adjacent figures below into scope.

## Notes

- **Depends on:** [`0388`](../../done/0388-give-the-sprint-mover-pins-and-the-successor-mode-durable-prove-red-mutations/brief.md)
  — hard; its mutations are part of the runtime being measured.
- **Blocks:** nothing.
- ⚠️ **Adjacent stale figures, found while filing — NOT in the ruling's scope, flagged for the plan
  gate.** The owner ruled the timeout and *its* comment. The same *"~6 min"* runtime claim also appears
  in: `bin/release.mjs` (the help text *"Every run runs \`npm test\` first (~6 min)"*, the comment
  *"~6 min separate this gate from"*, and the console line *"(~6 min; includes prove-red.sh)"*);
  `ai-agents/knowledge-base/architecture.md` (*"~6 min separate the gate from"*); and `RELEASING.md`
  mentions *"`timeout-minutes: 20`"* by value. ⛔ **Do not fold these in silently.** Ask the owner at
  the plan gate: fold in, or file a separate row. If `timeout-minutes` changes, `RELEASING.md`'s quote
  of the old value becomes wrong, which argues for folding at least that one in.
- ⚠️ If the runner measurement implies a timeout the owner finds too long, the real question becomes
  whether `prove-red.sh`'s runtime should be cut. That is a separate decision — raise it, do not
  scope it here.
- Cite files by quoted text, not `path.md:N` line coordinates.
- Owner field: `fkit-coder` — the deliverable is a CI config edit plus a measurement; no ruling
  assigns the owner, producer judgement.
- Filed by a spawned `fkit-producer` with no owner channel. ID `0395` verified free: max task-folder id
  and max `## ID` across `backlog/`, `done/`, `cancelled/` both `0394` at filing.

> ⏱ **Note, 2026-10-04 (spawned `fkit-producer`, at `fkit-lead`'s direction, on the owner's ruling of
> 2026-10-04; text above unchanged).** This brief's dependency [`0388`](../../done/0388-give-the-sprint-mover-pins-and-the-successor-mode-durable-prove-red-mutations/brief.md) is now
> **closed** — `✅ Done (agent-closed — not owner-verified)`, its brief in `tasks/done/` (checked 2026-10-04).
> Nothing else in this brief changes; the dependency lines are left as written.

> ⏱ **Note, 2026-10-05 (spawned `fkit-producer`, at `fkit-lead`'s direction; text above unchanged) —
> pulled onto [Sprint 10](../../../sprints/sprint-10.md) mid-sprint by owner ruling.** The owner, typing
> directly in the `fkit-lead` session driving `/fkit-sprint-ship-loop` on 2026-10-05, answered the
> lead's suggestion to pull this task in so a push does not fail CI on timeout with: *"I want that"*.
> Why now (lead's relay): local full `npm test` runs grew to 19–27 min on a busy machine this sprint as
> `0477`, `0480`, `0481` and `0479` added prove-red steps; recent CI runs (2026-10-02, before those
> additions) were 5.8–10.9 min against `timeout-minutes: 20`. `0480`'s worklog routed the stale
> *"~6 min"* / *"15 mutants"* wording here.
>
> - ⚠️ **`P11` is append rank, NOT a merit ranking — flagged for owner confirmation.** **On merit this
>   belongs directly below `0479`**, because the owner wants it fixed before any push and `0479` is
>   already in flight. A spawned producer may not insert a row mid-board or re-rank
>   (`/fkit-task-brief` step 5; ADR-035), so it was appended.
> - **On merit:** immediately above 0476 — the owner wants the CI timeout corrected before any push;
>   it should run right after the in-flight 0479.
> - ⚠️ **For the plan gate — a tension, not settled here.** "What to build" step 1 makes a
>   **runner** measurement the first deliverable and forbids picking the timeout from local figures,
>   but a runner run needs a commit on the remote, and pushing is the owner's act. "Fix it before any
>   push" and "measure on the runner first" cannot both hold as written. The owner rules which gives.
> - ⚠️ `0479` (in flight) is editing `bin/release.mjs` — named above as an adjacent stale-figure
>   site — and release docs. Start this task only after `0479` closes, so the two do not overlap.

> ✅ **Close note, 2026-10-05 (spawned `fkit-producer`, at `fkit-lead`'s direction, running
> `/fkit-task-done`; text above unchanged) — closed `✅ Done (agent-closed — not owner-verified)`,
> with V5 PENDING the owner's push.**
>
> - **Owner ruling on closing (2026-10-05, direct, via `AskUserQuestion` in the `fkit-lead` session).**
>   Question: *"0395's last check (the first CI run after your next push finishes within 33 min) needs
>   your push. When the rest is done, close 0395 now or keep it open?"* — chose **"Close, check
>   pending"** (option description: *"Closed as agent-closed, with 'CI check pending your push'
>   recorded plus the exact gh command to confirm afterwards. The sprint moves on."*).
> - **Plan-gate rulings** (recorded in [`worklog.md`](worklog.md)): pull into Sprint 10; drive after
>   `0479`, keep `P11`; Q1 *"Use existing CI runs now"*; Q2 *"3x → 33 min"*; Q3 *"Fix all of them"*.
> - **Verification state, per the driver's evidence and `worklog.md`:** V1–V4 met (20 post-`0388`
>   runner runs recorded; `timeout-minutes: 33` = ~3.0x the slowest whole job, 652 s); V6 widened by
>   Q3 to `RELEASING.md`, `bin/release.mjs`, `architecture.md`; full local `npm test` exit 0
>   (1048/1048, prove-red hard gate PASSED); stateful review round 1 closed out (R1, R2 done; coverage
>   *"reasoning-only second opinion"*).
> - ⚠️ **V5 — PENDING the owner's push. Not verified.** The first CI run after the push must finish
>   green and well under 33 min. To confirm afterwards:
>   1. `gh run list --workflow test.yml --limit 1` — note the run id of the push's run.
>   2. `gh run view <id> --json jobs` — check the `test` job's `conclusion` is `success` and its
>      `completedAt − startedAt` is well under 33 min (the measured basis was 10m52s; the estimate
>      with this sprint's additions, unverified, is ~12–13 min).
>   If it fails or comes close to 33 min, raise it with the producer; how to handle it is the owner's call.
> - **Routed, not done here:** the wiki pages that still quote `timeout-minutes: 20` and the old
>   *"6–8 minutes"* / *"~6 min"* figures need a `fkit-wiki` sync (listed in `worklog.md`
>   § *Flags for later*).

> ⏱ **Evidence note, 2026-10-10 — V5 (spawned `fkit-producer`, at `fkit-lead`'s direction; status line
> and text above unchanged).** The owner answered *"Yes, close it (Rec)"* to *"Have the producer record
> 0395's last check from the green CI runs and close it?"* (via `AskUserQuestion` in the `fkit-lead`
> session; ⚠️ the lead's relay). The close is moot — this task was already closed
> `✅ Done (agent-closed — not owner-verified)` on 2026-10-05. Only this evidence is added. The
> owner-verified upgrade is the owner's alone and is **not** applied here.
>
> **V5 as written:** *"the first CI run after the change completes green **inside** the new timeout"*
> (`timeout-minutes: 33`).
>
> - **The change's push.** `git log -- .github/workflows/test.yml`: the last commit touching it is
>   `acd23a9` (*"Sprint 10: ship 16 tasks; file 0496–0501, 0503"*, 2026-10-09); `timeout-minutes: 33` at
>   HEAD.
> - **The first CI run after it** (found by this producer, `gh run list --workflow test.yml` +
>   `gh run view <id> --json jobs`, 2026-10-10): run `37961366174`, push on `main`, head `acd23a9`, `test`
>   job `success`, 2026-10-09T16:45:11Z → 16:57:28Z = **12m17s**, inside 33 min.
> - **Later runs, all green** (the three the lead read with `gh run list`, job times re-read by this
>   producer): `38031274614` *"Sprint push"* (`47b4e99`) 12m25s; `38033296145` *"Release v0.3.2"*
>   (`0d1712f`) 9m03s; `38064272969` *"Sprint push"* (`79a7dbf`) 10m13s. Also `37979484507` (`d457593`)
>   12m26s. The lead's figures (12m30s / 9m05s / 10m16s) are whole-run times; the job times above are a
>   few seconds shorter.
>
> **Verdict: V5 is met as written — by run `37961366174`, not by the lead's three runs.** Those three are
> not *"the first CI run after the change"* (they are the 3rd–5th after it), so on their own they would
> not meet V5's wording; they corroborate it. The close note's estimate (*"~12–13 min"*) held.
>
> ⚠️ **Observation, not a defect of this task:** the slowest job since the change is 12m26s, so 33 min
> is now ~2.65x headroom, below the ~3x ruled at the plan gate (3x of the then-slowest 652 s). The
> comment's figures are correct as of their date. Whether to re-tune is the owner's call; nothing filed.
