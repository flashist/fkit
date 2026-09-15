# Plan: 0390 — sweep the repo-only `claude/` path form out of installed-facing skill and scaffold prose

## Goal
Text-only sweep. Every installed-facing reference to a fkit skill or script should resolve in a project that uses fkit, matching the invocation line `dashboard.sh:4` declares for itself (`bash .claude/skills/fkit-status/dashboard.sh …`). No script or hook logic changes.

## Re-checked site list (2026-09-14; replaces the brief's tables)

**Class A: runnable `bash claude/skills/fkit-status/dashboard.sh …` lines (8), rewrite to `bash .claude/…`**

| File | Lines |
|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | 102, 106 |
| `claude/skills/fkit-sprint-done/SKILL.md` | 96, 132, 148, 379 ⚠️ pinned by E2 |
| `claude/skills/fkit-sprint-cancelled/SKILL.md` | 109, 392 ⚠️ pinned by E2 |

**Class A′: skill prose naming `claude/skills/fkit-task-brief/SKILL.md` (2, not in the brief) ⟦D3⟧**
- `claude/skills/fkit-sprint-done/SKILL.md:222`
- `claude/skills/fkit-sprint-cancelled/SKILL.md:211`

**Class B: scaffold-shipped prose (5)**

| Site | Path named | Actual install location | Decision |
|---|---|---|---|
| `priority-is-rank-not-identity.md:101` | `claude/skills/fkit-status/dashboard.sh` | `.claude/skills/fkit-status/dashboard.sh` (`fkit-claude-init.sh:619`) | ⟦D1⟧ |
| `priority-is-rank-not-identity.md:106` | `claude/skills/fkit-task-brief/SKILL.md` | `.claude/skills/fkit-task-brief/SKILL.md` (`:619`) | ⟦D1⟧ |
| `priority-is-rank-not-identity.md:107` | `claude/skills/fkit-status/dashboard.sh` | as :101 | ⟦D1⟧ |
| `task-status-vocabulary.md:80` | `claude/skill-ownership-hook.sh` | **not copied into the project**; runs from `$FKIT_SHARE/claude/` (`fkit-claude.sh:331`, `install.sh:40-43`) | ⟦D2⟧ |
| `sprint-status-vocabulary.md:98` | same | same | ⟦D2⟧ |

`priority-is-rank-not-identity.md` is enforced byte-identical, so its edits are mirrored in `ai-agents/knowledge-base/conventions/`. Both vocabulary pages are audience-adapted exceptions (`test/dual-home-parity-exceptions.mjs:129,141`), so only the scaffold copy changes.

**Triage: left unchanged, justification recorded in the worklog**
- `priority-is-rank-not-identity.md:127` and `durable-citation-anchors.md:227` name `claude/scaffold/`. Verdict: **legitimate reference to fkit itself.** Each sits in a "cited by name, NOT linked" explanation of why the two copies ship without decisions and reports. It is explanatory text, not a path the reader must open or run. Both pages must stay byte-identical, so the sentence has to be true in the fkit repo as well.
- `fkit-heal/SKILL.md:51` is the confirmed false positive and stays untouched.
- Seen but excluded by the brief's out-of-scope list: `fkit-heal/SKILL.md:25-26` (`claude/structure-spec.md`, `claude/structure-manifest.tsv`; install-folder paths, same shape as the hook) and `fkit-heal/check.sh:11` (a comment in a script). Listed in the worklog, not edited.
- `claude/agents/`: 0 sites.

## Steps
0. **Baseline.** Run `npm test` (unit suites plus `test/prove-red.sh`) and record the pass/fail totals in `worklog.md`. Re-run the site-list greps and stop if the list differs from the one above. Grep:
   - `grep -rnE '(^|[^.A-Za-z0-9_~/-])claude/[A-Za-z0-9_./-]+' claude/skills claude/agents claude/scaffold`
1. **Class A.** Change 8 lines, `bash claude/skills/` → `bash .claude/skills/`, one line each. Line wrapping stays byte-identical so the whitespace-normalized E2 needle still matches exactly once.
2. **E2 needle ⟦D4(a)⟧.** In `test/dashboard-contract.test.js:3932`, change `claude/` to `.claude/` inside `E2_PROSE`. Nothing else in the test changes.
3. **Class A′ ⟦D3(a)⟧.** At `sprint-done:222` and `sprint-cancelled:211`, change `claude/skills/fkit-task-brief/SKILL.md` → `.claude/skills/fkit-task-brief/SKILL.md`.
4. **Class B, priority page ⟦D1(a)⟧.** Change :101, :106, :107 `claude/skills/…` → `.claude/skills/…` in the scaffold copy, apply the identical edit to the live copy, then confirm with `cmp`.
5. **Class B, hook sentence ⟦D2(b)⟧.** Give both vocabulary pages the same qualifier, e.g. "fkit's own `claude/skill-ownership-hook.sh` (in the fkit install, not your project's `.claude/`)". Keep the one-word difference that already exists between the two pages. The free-text reasons in `dual-home-parity-exceptions.mjs` still quote the path accurately, so they need no edit.
6. **Regenerate the manifest.** Run `npm run generate:manifest`. The only expected change to `claude/structure-manifest.tsv` is new hash lines for the 3 edited scaffold pages. Known effect: in existing projects, untouched copies of those pages become `untouched-stale`, and `/fkit-heal` will offer to replace them. That is how heal is meant to work.
7. **Worklog.** Record the site list, each triage verdict and the reason for it, the D1–D4 rulings, the baseline, and the E2 hunk. The hunk matters because 0388's uncommitted changes sit in the same file.
8. **Do not run `claude/fkit-claude-init.sh .`.** It is not needed, because tests read `claude/`, and it has side effects on the working tree (convergence, root managed blocks).

## Verification
1. `grep -rn "bash claude/skills/" claude/` → only `claude/skills/fkit-heal/SKILL.md:51`.
2. Re-run the Step-0 grep: every remaining bare `claude/` hit must be a site triaged in the worklog. Zero untriaged sites.
3. Each rewritten path resolves under init's copy targets: `.claude/skills/fkit-*` comes from `fkit-claude-init.sh:615-619`, and the hook is confirmed not installed per `fkit-claude.sh:331`.
4. `node --test test/dual-home-parity.test.js` is green, and `cmp` shows the two priority-page copies are identical.
5. `node --test test/reference-integrity.test.js` reports 0 broken, with no new `NAMED_EXEMPT` entry. `node --test test/coordination-citation-policy.test.js` is green.
6. `node --test test/structure-manifest.test.js` is green after the regeneration.
7. `node --test --test-name-pattern="emitter map" test/dashboard-contract.test.js` passes 4/4. `bash test/prove-red.sh` shows mutation 39 still reds `emitter map E2`.
8. Full `npm test` matches the Step-0 baseline totals.
9. `git diff --name-only` minus the files that were already dirty should list only:
   - the 3 `SKILL.md` files
   - the 3 scaffold pages
   - the live `priority-is-rank-not-identity.md`
   - `claude/structure-manifest.tsv`
   - `test/dashboard-contract.test.js` (a shared file; the hunk is recorded)
   - the task folder

   This file list is wider than brief step 7 allows, because of the forced manifest regeneration and D4.

## Risks
- **E2 needle drift.** A rewrap at :379 or :392 would change the match count. Mitigation: token-only edits, then run E2 right away.
- **Mixed diffs.** `test/dashboard-contract.test.js` also carries 0388's uncommitted changes. Committing 0388 and 0392 before the build makes step 9 clean; otherwise it relies on the recorded hunk.
- **Stale manifest.** Forgetting step 6 turns the manifest test red. That fails loudly, not silently.
- **Brief's out-of-scope list.** No ADR or report edits, no board re-rank, no wiki write, no new devDependency, no script or hook logic change.

## Open decisions
D1, D2, D3, D4 above.

## Owner rulings (2026-09-14, via `AskUserQuestion` in the `fkit lead` session — verbatim option labels)

- **D1:** "Rewrite to .claude/ (Rec)" → option (a): the 3 `claude/skills/…` paths become `.claude/skills/…` in both copies; the `test/…` entries are left alone.
- **D2:** "Keep path + note (Rec)" → option (b): keep `claude/skill-ownership-hook.sh` and add the "in the fkit install, not your project's `.claude/`" qualifier on both vocabulary pages.
- **D3:** "Include them (Rec)" → option (a): the two Class A′ sites are rewritten to `.claude/…`.
- **D4:** "Update needle to .claude/ (Rec)" → option (a): the one-token `E2_PROSE` edit in `test/dashboard-contract.test.js`. This relaxes the brief's "no test" limit by that one line, and verification step 9's wider file list (manifest + test file) is accepted.
- **Pre-existing premise corrections (from the plan step, accepted with this approval):** a test does pin the path form (E2); the hook is not installed into `.claude/`; any scaffold edit forces `claude/structure-manifest.tsv` regeneration.
- **Driver note (orchestrated path):** under `fkit-sprint-ship-loop` the builder does not request review; the driver's separate Verify / Review / Process-review steps follow Build. No commit is made by any step — the "commit 0388 and 0392 first" option in Risks is the owner's alone and is not assumed; the build proceeds on the recorded-hunk path.
