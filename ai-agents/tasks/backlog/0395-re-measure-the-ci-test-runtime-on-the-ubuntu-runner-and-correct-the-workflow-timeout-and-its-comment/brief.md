# Re-measure the CI test runtime on the ubuntu runner, and correct the workflow timeout and its comment

## ID
0395

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

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
