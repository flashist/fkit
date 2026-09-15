# Worklog: 0390 — sweep the repo-only `claude/` path form out of installed-facing skill and scaffold prose

Build step under `fkit-sprint-ship-loop` (fkit-lead driver, Sprint 9), 2026-09-14. Approved plan:
`plan.md` (blob `b65db7bb83987a6fb816ec8b3b4dba72f1dbeeb9`, re-hashed at Step 0 and matching). Owner
rulings applied: D1(a), D2(b), D3(a), D4(a). Nothing committed. `claude/fkit-claude-init.sh` not run.

## Step 0: baseline

- Pre-existing dirty tree (snapshot `git status --porcelain` before any edit): `architecture.md`,
  `sprints/backlog.md`, `sprints/sprint-9.md`, the 0390 and 0393 briefs, 0388/0392 renames to `done/`
  plus their untracked plan/review/worklog, untracked 0390 `plan.md`, untracked 0395 folder,
  `test/dashboard-contract.test.js` (0388), `test/prove-red.sh` (0388).
- `npm test` (`node --test test/*.test.js && bash test/prove-red.sh`): **exit 0**. Unit: tests 967,
  suites 24, pass 967, fail 0, cancelled 0, skipped 0, todo 0. Reference integrity: 0 broken,
  7 named-exempt. prove-red: 39/39 mutations red, "hard gate PASSED".
- Site-list grep
  `grep -rnE '(^|[^.A-Za-z0-9_~/-])claude/[A-Za-z0-9_./-]+' claude/skills claude/agents claude/scaffold`:
  **matches the plan's re-checked list exactly** (8 Class A, 2 Class A′, 5 Class B, plus the triaged
  sites below). `claude/agents/`: 0 hits.

## Site list and what was done

**Class A (8), `bash claude/skills/` → `bash .claude/skills/`, token-only, no rewrap**
- `claude/skills/fkit-sprint-ship-loop/SKILL.md`: 102, 106
- `claude/skills/fkit-sprint-done/SKILL.md`: 96, 132, 148, 379 (E2-pinned)
- `claude/skills/fkit-sprint-cancelled/SKILL.md`: 109, 392 (E2-pinned)

**Class A′ (2), D3(a)**: `fkit-sprint-done/SKILL.md:222` and `fkit-sprint-cancelled/SKILL.md:211`,
`claude/skills/fkit-task-brief/SKILL.md` → `.claude/skills/fkit-task-brief/SKILL.md`.

**Class B, priority page, D1(a)**: `priority-is-rank-not-identity.md` :101, :106, :107
`claude/skills/…` → `.claude/skills/…` in the scaffold copy; the `test/dashboard-contract.test.js`
entries left alone. The live copy
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` was byte-identical before
(`cmp`), received the identical edit, and `cmp` is identical after.

**Class B, hook sentence, D2(b)**: `claude/scaffold/.../task-status-vocabulary.md:79-82` and
`claude/scaffold/.../sprint-status-vocabulary.md:97-100` now read "the fix is a further precondition in
fkit's own `claude/skill-ownership-hook.sh` (in the fkit install, not your project's `.claude/`) —
closes only from an owner-present session, say — not stricter prose." Rewrapped across one extra line.
The existing one-word difference ("its work" vs "the work") is kept. Live copies untouched (both pages
are audience-adapted exceptions; the live copies do not carry this paragraph). The reasons in
`test/dual-home-parity-exceptions.mjs:136,151` still quote the path accurately; not edited.

**E2 needle, D4(a)**: `test/dashboard-contract.test.js:3932`, `E2_PROSE`: `bash claude/skills/` →
`bash .claude/skills/`. Nothing else in the test changed.

**Manifest**: `npm run generate:manifest` → "wrote claude/structure-manifest.tsv — 82 entries". Diff is
exactly 3 added hash lines, for the 3 edited scaffold pages (priority, sprint-status, task-status). Known
effect (plan Step 6): untouched copies of those pages in existing projects become `untouched-stale`, and
`/fkit-heal` will offer replacement.

## E2 hunk (shared file with 0388's uncommitted changes)

`test/dashboard-contract.test.js` was already dirty from 0388. The `E2_PROSE` line is itself a line 0388
**added**, so against HEAD there is no separate 0390 hunk: 0390 changes one token inside 0388's added
line. The 0390-only change, measured as `diff` of `git diff test/dashboard-contract.test.js` before vs
after the build, is exactly this one line (no other line of the diff changed):

```diff
-const E2_PROSE = 'render the board — `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/<basename>` — ' +
+const E2_PROSE = 'render the board — `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/<basename>` — ' +
```

Whoever commits 0388 and 0390 separately must split this: 0388's added line as it was, then this
one-token change on top.

## Triage: left unchanged, with reasons

- `claude/scaffold/.../priority-is-rank-not-identity.md:127` and
  `claude/scaffold/.../durable-citation-anchors.md:227` name `claude/scaffold/`. **Legitimate reference
  to fkit itself.** Each is inside a "cited by name, NOT linked" explanation of why decisions/reports
  ship empty. Explanatory text, not a path the reader opens or runs, and both pages are byte-identical
  dual-homed, so the sentence must also be true in the fkit repo.
- `claude/skills/fkit-heal/SKILL.md:51` (`bash claude/skills/fkit-heal/check.sh`): the confirmed false
  positive; it is explicitly scoped "In this repo's own checkout". Untouched.
- `claude/skills/fkit-heal/SKILL.md:25-26` (`claude/structure-spec.md`, `claude/structure-manifest.tsv`):
  install-share paths, same shape as the hook; excluded by the brief's out-of-scope list. Not edited.
- `claude/skills/fkit-heal/check.sh:11`: a comment in a script; excluded by the brief (no script
  changes). Not edited.
- The two vocabulary pages' `claude/skill-ownership-hook.sh` remain as grep hits by ruling D2(b) (path
  kept, qualifier added).

## Verification

1. `grep -rn "bash claude/skills/" claude/` → one hit, `claude/skills/fkit-heal/SKILL.md:51`. Pass.
2. Step-0 grep re-run → 8 hits, all triaged above (heal :25, :26, :51; `check.sh:11`;
   `durable-citation-anchors.md:227`; `priority-is-rank-not-identity.md:127`; the two D2(b) hook lines
   in the vocabulary pages). Zero untriaged. Pass.
3. Rewritten paths resolve under init's copy target: `claude/fkit-claude-init.sh:615-619`
   (`mkdir -p "$dest/.claude/skills"`, `cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"`), and both
   `claude/skills/fkit-status/dashboard.sh` and `claude/skills/fkit-task-brief/SKILL.md` exist. Hook not
   installed: `grep -n skill-ownership-hook claude/fkit-claude-init.sh` → no match (exit 1);
   `claude/fkit-claude.sh:331` wires it as `bash "$here/skill-ownership-hook.sh"` from the share. Pass.
4. `node --test test/dual-home-parity.test.js` → exit 0, 9/9 pass. `cmp` of the two priority-page
   copies → exit 0 (identical). Pass.
5. `node --test test/reference-integrity.test.js` → exit 0, 22/22 pass, "0 broken, 7 named-exempt"
   (baseline also 7); `test/reference-integrity.test.js` unchanged (`git diff --quiet` exit 0), so no new
   `NAMED_EXEMPT` entry. `node --test test/coordination-citation-policy.test.js` → exit 0, 21/21. Pass.
6. `node --test test/structure-manifest.test.js` → exit 0, 5/5. Pass.
7. `node --test --test-name-pattern="emitter map" test/dashboard-contract.test.js` → exit 0, 4/4 (E1-E4).
   `bash test/prove-red.sh > log 2>&1; echo exit=$?` → exit=0, 39/39 red, including
   "39. wrong drift record named in a sprint mover — "emitter map E2" should go RED ... red", and
   "hard gate PASSED". Pass.
8. Full `npm test` → exit 0. Unit: tests 967, suites 24, pass 967, fail 0, cancelled 0, skipped 0,
   todo 0; reference integrity 0 broken, 7 named-exempt (scanned 925 files vs 924 at baseline: this
   worklog); prove-red 39/39 red, "hard gate PASSED". **Matches the Step-0 baseline totals.** Pass.
9. `git diff --name-only` / `git status --porcelain` compared with the Step-0 snapshot. Newly modified:
   `claude/skills/fkit-sprint-{ship-loop,done,cancelled}/SKILL.md`, the 3 scaffold pages
   (priority, sprint-status, task-status), live `priority-is-rank-not-identity.md`,
   `claude/structure-manifest.tsv`. Already-dirty file whose diff changed: only
   `test/dashboard-contract.test.js` (the one-line hunk above). New untracked: this `worklog.md`. No other
   pre-dirty file's diff changed (`test/prove-red.sh`, briefs, boards, `architecture.md` unchanged by
   this build; `plan.md` not edited). Matches the plan's list exactly. Pass.

## Decision log

Fixes applied without asking / obvious-winner calls: **none**. Every edit is a step of the approved plan
applied as written. Two small wording/format choices inside the plan's own text, recorded for
findability:
- Step 5 qualifier used the plan's example wording verbatim ("fkit's own `claude/skill-ownership-hook.sh`
  (in the fkit install, not your project's `.claude/`)"), and the sentence was rewrapped to one extra
  line to keep line width near the file's ~100-column wrap. Both vocabulary pages got byte-identical
  new lines 80-81 / 98-99.
- Step 4 applied the live-copy edit by copying the edited scaffold file over the live file, after `cmp`
  confirmed the two were identical before the edit. Equivalent to applying the same three edits.

### Process-review step (fkit-sprint-ship-loop, 2026-09-14)

Fixes applied without asking / obvious-winner calls: **none**. Both review findings (R1, R2) were
routed by relayed owner rulings ("Follow-up brief (Rec)" and "Accept as residual (Rec)"), and neither
calls for a source change. R1 follow-up: `0396`. Written to `review.md` only: two *Coder response* rows (both
`won't fix (frontier)`), two *Accepted residuals* entries, and the header set to `Status: closed-out`.
No file outside the ledger and this worklog was touched.
- R1 verified with one new fact: the same repoint grep also names `test/`, which many consuming
  projects lack. Any follow-up fix has to cover the whole operand list, not only `claude/`. Reproduced
  with `/usr/bin/grep` in a temp dir holding only `ai-agents/`: the hit printed, exit=2.
