# Worklog — 0392

## 2026-09-14 — Build (fkit-coder, spawned by `fkit-sprint-ship-loop` as Build worker)

Approved plan: `plan.md`, blob `f0e4d55fa99a690723b264b98239d0ece7c9d6cc` (re-hashed at start — matched).
Owner rulings applied (plan §8): OD1 = (c), OD2 = (c), J1 = (a), J2 = (a).
Target: `ai-agents/knowledge-base/architecture.md` only. Order: B → A → C, with J1 alongside C.

### Pre-existing dirt (not this row's)
- `ai-agents/sprints/sprint-9.md` (M), `0392/brief.md` (M) — driver's status flip.
- `0392/plan.md` (untracked) — the approved plan; not edited.

### B2 — CI figures, measured 2026-09-14 (`date -u`: Mon Sep 14 11:39:25 UTC 2026)
Command: `gh run list --workflow test.yml --limit 1000 --json databaseId,conclusion,event,createdAt,status,headBranch`
- Total 43; success 39; failure 4; in progress 0; cancelled 0.
- Events: push 43 (no `pull_request`, no `workflow_dispatch`). Branch: `main` 43.
- First run 2026-08-12T19:50:01Z; last 2026-09-14T11:07:24Z.
- Runner: `runs-on: ubuntu-latest` — unchanged since the workflow was created (`git log -p -- .github/workflows/test.yml`: one `runs-on` line, added in `df55b50`, 2026-08-12).
- Occurrence A's 2026-09-04 figures (33 / 29 / 4) left as-is: correct as of their date (`0301`). The file now holds two dated sets; that is intended.

### B3 — red runs, checked firsthand (`gh run view <id> --log-failed`)
| Run id | Date | Failing test | Dash-related? |
|---|---|---|---|
| 31634593615 | 2026-08-12 (first) | `test/orphan-cleanup.test.js` — "the never-delete-lockdown-state guard is case-insensitive" (`/lockdown state/` did not match) | no — case-sensitivity; repaired by `0283` (`tasks/done/0283-make-the-lockdown-guard-case-test-filesystem-independent`) |
| 32482230515 | 2026-08-21 | `structure-manifest` A (manifest stale) + `structure-spec` F (row missing from manifest) | no |
| 33242317219 | 2026-08-29 | `closed-rank-immutability` live leg 1 — `sprint-7.md` Priority cell "—" is not a rank | no |
| 33249669186 | 2026-08-29 | `closed-rank-immutability` live leg 2 — same data error | no |

Scan: `grep -iw dash` = 1 hit per log, each the PASSING `en dash bounds a segment` test; no `sh: N:` / syntax error / bad substitution / illegal option lines. **No dash failure → B4 "keep history" shape stands; occurrence A not edited.**

### B1/B4 — occurrence-B bullet
- Before: *"Neither has been observed green on a runner yet. The workflow is verified by review, not by a run — it lands unpushed. The suite has only ever run on darwin; on `ubuntu-latest` `/bin/sh` is dash, and a first run could go red on a genuine dash divergence in the shell under test. That risk was accepted knowingly when CI was approved; a portability repair is a separate brief, not a reason to distrust the workflow."*
- After: *"CI has been exercised on a runner. Measured 2026-09-14 over the workflow's full run history: 43 runs on `ubuntu-latest`, 39 green and 4 red, the first on 2026-08-12 and the most recent on 2026-09-14; every one a push to `main` — no run has been raised through the `pull_request` or `workflow_dispatch` triggers. Those are counts on a date, not a standing guarantee. The first red run was a filesystem case-sensitivity divergence in `test/orphan-cleanup.test.js` (macOS is case-insensitive, the runner is not), repaired by task `0283`. When CI was approved, the risk recorded was that a first run could go red on a genuine dash divergence (`/bin/sh` is dash on `ubuntu-latest`); as of 2026-09-14, none of the four red runs was one. For the release gate's record, see §1."*
- Shape: dash prediction kept in B as past-tense, dated history, so §1's *"it was not the dash divergence §9.1 predicted"* still resolves. Why: A needs no edit, A's dated figures stay byte-identical, smaller diff.
- No new release-gate claim; points to §1's existing record.

### A1/A2 — §9.1 opening paragraph
- `ls test/*.test.js | wc -l` = 29 (build day). Named files all exist: launcher-contract, converge-contract, dashboard-contract, skill-ownership-hook, adr-number-uniqueness, task-id-uniqueness, dual-home-parity. Glob groups `*-contract`, `*-hook`, `structure-*`, `*-uniqueness` all match files (15 files across them).
- **Verification step 4 amended (OD1 = c):** every named file exists; count equals disk; no completeness claim ("not as a complete list"). No both-ways name check.
- `prove-red.sh`: header "THIRTY-FOUR mutations"; `--- Mutation N:` blocks 1–34, no gaps. No mutation count added to §9.
- Coverage claim re-verified: suite files named in `prove-red.sh` = 15 (askuserquestion-marker-hook, carry-check-hook, dashboard-contract, dual-home-parity, launcher-contract, mover-exemption-step, release-summary, shiploop-marker-hook, skill-frontmatter, skill-ownership-hook, structure-notice, throughput-counter, turn-completion-hook, update-banner, wiki-flag-convention). **14 suites have no named mutation**: the plan's 13 plus `structure-spec` (the plan's substring heuristic matched `structure-spec` on a path comment, line ~288, not a mutation). Mutations 30/31 target `launcher-contract` assertions 12/12b, not `init-intake-guard`. Rewording applies either way.
- Other §9 claims checked and left byte-identical: `claude/fkit-claude.sh` bullet ("covered by `launcher-contract.test.js` (and its mutations proven by `prove-red.sh`)") — true; §9.3's `skill-ownership-hook` → §9.1 pointer lands; §9.5's ADR-027 "`test/` parity check, §9.1" pointer lands (`dual-home-parity` named). §7's "mutations 16-17" and "mutation 15" outside §9, unchanged.
- ADR-026 line with trailing space (*"not by omission** — "*) byte-identical (diffed against pre-edit snapshot).

### C1 — §9.5 verdicts (my count: **3 of 3 false**; matches the 2026-09-13 re-measure and `0366`; does **not** match `0356`'s 2)
1. "`fkit-claude-init.sh` prints "Six roles" and omits `lead` … count is a literal" — **false.** `grep -n -i 'six roles' claude/fkit-claude-init.sh` → nothing. Summary block comment: *"⚠️ NO ROLE COUNT ON THIS LINE — deliberate, owner-ruled 2026-07-20 (`0036` Part D)."*; list includes `printf '    • lead …'`. `n_agents` is derived (`ls "$here/agents/fkit-"*.md | wc -l`) and printed as "refreshed $n_agents agents" — agents refreshed, not roles.
2. "usage comment still advertises `fkit claude`" — **false.** `grep -n 'fkit claude' claude/fkit-claude-init.sh` → nothing; usage reads *"Usage:  claude/fkit-claude-init.sh <project-root>"*.
3. "ADRs 003, 004, 006, 007 still marked `accepted`" — **false.** Each `- **Status:**` line reads superseded (003, 004, 007: "**superseded** — Omnigent removed"; 006: "**superseded, on two grounds.**").

### C2/C4/C3 — treatment
- Repaired in place, all three the same way: `architecture.md` is a living reference, and a dated note under a false bullet keeps false text in front of readers. All three fail the same way (discharged / never true), so one treatment.
- OD2 = (c): heading "### 9.5 Residual drift" kept; three bullets → one dated sentence with quoted fragments; ADR-027 paragraph byte-identical. No residual invented.
- No bare line numbers remain in §9.5 (`grep -E '\.(sh|md|js|mjs):[0-9]'` over §9.5 → none).

### J1 — §8
- Before: *"… are due to be marked superseded now that the code is actually removed (ADR-009 §Related; tracked by `ai-agents/tasks/backlog/knowledge-base-hygiene-post-omnigent.md`) — they are still marked `accepted` today. See §9.5."*
- After: *"… are now marked superseded, as ADR-009 §Related called for once the code was actually removed (tracked by task `0059`). See §9.5."*
- Dead path confirmed dead (`ls` → no such file); `ai-agents/tasks/done/0059-knowledge-base-hygiene-post-omnigent` exists and its brief carries "1. Mark ADRs superseded".

### Scope / fences
- `git diff --numstat`: `architecture.md` +23/−20; `sprint-9.md` +1/−1 and `0392/brief.md` +1/−1 (pre-existing, named above). Untracked: `0392/plan.md` (blob still `f0e4d55f…`), `0392/worklog.md` (this file).
- `git status --porcelain -- test/fixtures ai-agents/tasks/done ai-agents/tasks/cancelled ai-agents/sprints/done ai-agents/wiki-vault` → 0 lines.
- `git diff -U0` hunks in `architecture.md`: exactly 4 — §8 ADR sentence, §9.1 opening, §9.1 occurrence B, §9.5 bullets. No hunk in §1 (occurrence A), §7, B5 fenced bullets/paragraph, ADR-027 paragraph.
- `grep -n eight` → only eighth-role lines (4, 5, 18, 19, 138, 139, 144, 145, 615); `tr '\n' ' ' | grep -o 'eight \`node --test\`'` → empty.
- Four falsified clauses: multi-line grep → none present.

### Hand-off evidence (not a shift map — `0393` must re-derive, its D5)
- Line count: 629 → 632.
- Headings before → after: §8 471→471; §9 499→497; §9.1 501→499; §9.2 548→553; §9.3 555→560; §9.4 567→572; §9.5 575→580; §10 595→598; §11 617→620. §1–§7 unmoved.
- **OD2 answer: §9.5 kept** (heading and number unchanged), bullets replaced by one dated sentence.

### Suite (build-day spot checks only; full suite is the Verify step's)
- `node --test test/reference-integrity.test.js` → tests 22, pass 22, fail 0; "0 broken, 7 named-exempt".
- `node --test test/coordination-citation-policy.test.js` → tests 21, pass 21, fail 0.
- No `NAMED_EXEMPT` entry added; no test file touched.
- `npm test` and `bash test/prove-red.sh` NOT run here (left to Verify). No test checks this prose's accuracy — green proves nothing about the change.

## Decision log (unattended calls — Build)

1. **14 uncovered suites, not 13** — finding: plan §0/§6 heuristic list. Changed: nothing in prose (the A2 rewording states no count). Why it qualified: verified by name grep plus reading mutation 30/31 targets; plan §6 says keep the rewording if the list moves; in-plan.
2. **Added "(not all of them)"** to the A2 rewording — answers A2's false coverage claim. Qualified: verified-correct (14 of 29 without a named mutation), localized, inside A2's "accurate statement" intent; states no count.
3. **Reflowed §9.1 opening** so the ADR-026 line (trailing space) stays byte-identical — plan §3 A2 fence. Mechanical, in-plan.
4. **OD1 (c) groups chosen as filename globs** (`*-contract`, `*-hook`, `structure-*`, `*-uniqueness`) plus `dual-home-parity` — obvious winner within OD1 (c): groups are checkable with `ls`, and the two pointer targets (`skill-ownership-hook`, `dual-home-parity`) are named as the plan requires.
5. **J1: dead backlog path replaced with task `0059`** (plan offered replace or drop) — obvious winner: `0059` exists in `done/` and is the tracking task; keeps provenance. Wording says "tracked by", not "done by".
6. **Kept "on `ubuntu-latest`"** in the B figures — verified `runs-on` never changed since workflow creation; correct, in-plan.
7. **Did not name the causes of red runs 2–4** in prose (verified non-dash in worklog) — B1 requires only the first red run's cause and the no-dash statement; adding more claims is not a repair.
8. **§9.5 sentence ends with a "§8" pointer** — keeps the existing §8↔§9.5 cross-reference in both directions (J1 keeps "See §9.5"). In-plan (OD2 c + J1 a).

## Verify

- `node --test test/*.test.js` → exit 0; tests 963, suites 24, pass 963, fail 0, cancelled 0, skipped 0, todo 0.
- `bash test/prove-red.sh` (standalone, full output captured) → exit 0; 15 baseline/unmutated checks green, 34 of 34 mutations red on their named assertion; "✓ hard gate PASSED".
- `npm test` (= node --test + prove-red) → prove-red tail showed "✓ hard gate PASSED"; the exit code seen was masked by a `| tail` pipe, so the two standalone runs above are the evidence.
- No failures, so no diagnosis needed. Working tree not stashed, reset, or checked out.
- No test checks this prose's accuracy. Green proves nothing about whether the change is true.

## 2026-09-14 — Process review (fkit-coder, spawned by `fkit-sprint-ship-loop` as Process-review worker)

- Ledger `review.md` round 1: one finding, R1 (low, Codex). Accepted residuals before this pass: none. ADRs skimmed for a covering "Re-raise only if": ADR-034, ADR-042, ADR-045 — none settles R1, so it was novel.
- R1 verified: aside identical in §1 (occurrence A, no diff hunk) and §9.1 occurrence B; test comment in `test/orphan-cleanup.test.js` group G matches; `0283`'s brief records a red reproduced on case-sensitive APFS. Verdict CORRECT, low/nit, frontier.
- Owner ruling relayed by the driver: "Accept as residual (Rec)". Recorded the residual (What / Why / Re-raise only if); R1 Status `won't fix (frontier)`; ledger header `Status: closed-out`.
- `architecture.md` not touched in this pass.

## Decision log (unattended calls — Process review)

none — no fix applied, no obvious-winner call. R1's disposition was the owner's ruling, not an unattended call.
