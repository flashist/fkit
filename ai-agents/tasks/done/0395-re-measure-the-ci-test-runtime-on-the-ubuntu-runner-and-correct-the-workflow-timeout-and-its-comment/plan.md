# Plan — 0395: re-measure CI runtime on the ubuntu runner; correct `timeout-minutes` and its comment

Planning only (spawned plan step, no plan-mode tool, so the rule is a written promise). Nothing was written to the repo. Read-only investigation: `gh run list/view` (read), `git show`/`git diff`, and local timings in scratch copies (machine load 2.9–3.3).

## Key findings (read before the questions)

1. **The brief's first deliverable can already be met from existing history, without a push.** `0388`'s mutations landed in commit `81f1429` (2026-09-15, "Sprint push"; `git log -S'Name the wrong drift record' -- test/prove-red.sh`). Every `test.yml` push run since then contains them: about 17 runs, all green. The brief asks for ≥3. Slowest of them:

   | run id | commit | date | whole job | `npm test` step | unit / prove-red split |
   |---|---|---|---|---|---|
   | 36984588959 | 4346410 | 2026-10-02 | **652 s (10m52s)**, the slowest job (~40 s of setup before the step) | 610 s | 66 s / 543 s |
   | 37051231177 | 4a21997 (HEAD) | 2026-10-02 | 630 s | **624 s** (slowest step) | 67 s / 555 s |
   | 36999504888 | 1c334bb | 2026-10-02 | 618 s | 610 s | 66 s / 543 s |
   | 36993061795 | 9a37d4f | 2026-10-02 | 617 s | 609 s | 66 s / 541 s |
   | 34954360697 | 81f1429 (0388 lands) | 2026-09-15 | 518 s | — | 53 s / 450 s |

   The split comes from the log timestamps: the unit phase ends at the `ℹ duration_ms` line and prove-red ends at `✓ hard gate PASSED`. Runner spread is wide: same-day runs of almost the same suite took 7.4–10.9 min.
2. **None of those runs contains this sprint's uncommitted additions.** At HEAD, prove-red has baselines `0a–0o` (15) and mutations `1–40`. The working tree has `0a–0p` (16) and `1–43` (`0p` and `41` from 0481; `42` and `43` from 0479; counted with `grep "^printf '…\. "` and the `^step` labels). It also has a much bigger `release-summary.test.js` (+386 lines), which runs about 11 times per `npm test`, and a new `update-reinstall.test.js`.
3. **Estimated extra time on the runner from those additions: about +1 min (UNVERIFIED).** Basis: locally, `release-summary.test.js` went from 11.4 s (HEAD) to 28.3 s (working tree), and `update-reinstall.test.js` takes 5.4 s. On CI the release suite took 3.0 s per run at HEAD, so local is about 3.8× slower. Scaled: ~11 release runs × ~+4.5 s, plus the reinstall runs, gives about +60 s. That puts the slowest expected CI job at ~12–13 min, under the current 20. **The next push is unlikely to time out.** The 19–27 min local runs come from a loaded laptop, and the brief forbids using local figures for the timeout. Caveat: the estimate rests on one local run per suite on a loaded machine, and the CI/local ratio comes from one suite.
4. Per-step CI costs (run 37051231177): the full launcher suite takes ~66 s and runs 5× (0a, 0b, 2, 30, 31). The dashboard suite takes ~15 s and runs 8×. The release suite takes ~3 s and runs 9×. Everything else is ≤5 s.
5. `workflow_dispatch` is declared. It can re-run a commit that is already on the remote (on `main` or any pushed branch). Pushing a throwaway branch alone would NOT trigger CI, because `push:` is limited to `main`. Opening a PR would trigger it. Every one of these routes is an owner act.

## Steps (Build worker, after owner approval)

**Step 0 — Record the measurement in `worklog.md`.** Re-read with `gh run view <id> --json jobs` and `--log` for at least the 4 slowest post-0388 runs above. For each: run id, commit, `npm test` step time, whole-job time, unit/prove-red split. Name the slowest whole job as the basis. State plainly that these runs carry mutations 1–40 and baselines 0a–0o only, and record the estimate from finding 3 as an estimate.
- *If Q1 = B (measure first):* this step waits until the owner has pushed the current tree and ≥3 runs (push + `workflow_dispatch`) have finished. Those runs become the basis instead, and the history above stays as a baseline only.

**Step 1 — Recount from the file being shipped** (`test/prove-red.sh` in the working tree): mutation entries, total baselines, and how they divide between the real tree and unmutated copies. Today that is 43 mutations and 16 baselines (`0a` runs against the real tree; `0b–0p` run against unmutated copies). The worker re-checks this rather than trusting these numbers. Record it in the worklog.

**Step 2 — Edit `.github/workflows/test.yml`.**
- Set `timeout-minutes` = ceil(ratio ruled in Q2 × slowest measured whole job). For 3× on 652 s: 32.6 → **33**.
- Rewrite the comment above it so every figure is true and has a source:
  - the runner-measured basis: run id, date range, whole-job and step time, unit/prove-red split;
  - the ratio the new value actually gives (e.g. 33 / 10.87 = ~3.0×);
  - the current counts, dated to task 0395;
  - an explicit line that the Sprint 10 additions (0p, 41–43, the larger release suite) were not in the measured runs;
  - the still-true purpose: stop a hung prove-red.sh from burning a runner for six hours;
  - how to re-measure: `gh run list --workflow test.yml`.
- Remove "15 mutants", "~3x headroom over the slowest local run", and every local figure as the basis.
- Leave the `fetch-depth: 0` and no-`npm ci` comments byte-unchanged, along with the header block and triggers.

**Step 3 — Adjacent stale figures, per Q3.**
- `RELEASING.md` (§CI paragraph):
  - quotes `` `timeout-minutes: 20` `` by value;
  - cites line numbers in `test.yml`: `.github/workflows/test.yml:3-11`, `:16-20`, `:33`, `:38-42`. Step 2's longer comment **shifts lines 33 and 38-42**, so this edit breaks those references whatever we decide (`:3-11` and `:16-20` sit above the comment and stay correct);
  - says "roughly 6–8 minutes, machine-dependent" for a local `npm test`.
- `bin/release.mjs`: help text "Every run runs \`npm test\` first (~6 min)", code comment "~6 min separate this gate from", console line "(~6 min; includes prove-red.sh)". Only the "~6 min" text changes. The tests assert only the substring ``running `npm test` `` (`release-summary.test.js`), which stays.
- `ai-agents/knowledge-base/architecture.md`: "~6 min separate the gate from".
- These three are about the **local** gate, so a local, machine-dependent figure is correct there. Use wording that rots less, e.g. "over ten minutes, machine-dependent — see CONTRIBUTING.md's Tests table". `CONTRIBUTING.md`'s "~12 min" (0480's local measurement) stays untouched.

**Step 4 — Verify.**
- YAML parses: `ruby -ryaml` or `python3 -c 'import yaml'`, whichever is installed; if neither is, say it was skipped.
- `git diff` scope matches Q3's ruling.
- Recount check: every number in the comment matches the file (brief V3).
- V2 arithmetic: `timeout-minutes` / slowest whole job = the stated ratio.
- `grep` confirms "15 mutants" and "3x headroom over the slowest local" are gone.
- Checks to run, per CONTRIBUTING's table: `.github/` and `bin/release.mjs` both map to **full `npm test`**. Expect 16–27 min locally under load; record the load and the time. `test:docs` runs inside it.
- Skipped: none locally. **V5 (the first CI run after the change finishes green inside the new timeout) cannot be done without the owner's push.** See Q4.

## Out of scope / notes
- No prove-red runtime cut (the brief says to raise that separately if the timeout looks too long).
- The wiki (`systems/testing-and-verification.md`, `tasks/gate-releases-…`) quotes `timeout-minutes: 20`. After the change, flag it for a `fkit-wiki` sync; never edit it ourselves.
- The backlog brief `0240` quotes 20 as history and is left alone.
- `bin/release.mjs` already holds 0479's uncommitted edits. Changes go on top and only replace the "~6 min" text.

## Risks / edge cases
- Runner variance (7.4–10.9 min on the same day) is larger than the estimated addition. That is why the basis is the slowest run, not the average.
- If `RELEASING.md`'s line references are not updated, they silently point at the wrong lines (no test catches this; 0394 is the guard class for such citations).
- Wording a count as timeless rots again with the next mutation. Hence "as of task 0395" plus the re-measure command.
- A full local `npm test` on a loaded machine may be slow or flaky. A red result must be reported, never retried until green without saying so.
