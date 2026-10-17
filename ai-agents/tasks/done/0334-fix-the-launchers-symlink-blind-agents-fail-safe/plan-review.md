# Plan review — 0334

Append-only. One section per plan attempt (ADR-056). Never carried to Build or Process-review.

## Attempt 1 — 2026-10-16

Record block, copied from the plan-only coder's return:

===PLAN-REVIEW RECORD BEGIN===
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-15), run Sprint 12 started 2026-10-15T16:38:40Z
Times (UTC): plan drafted 2026-10-16T12:39:43Z · ask architect + producer (parallel) 12:40:55Z · producer return ≤12:43:23Z · architect return ≤12:44:05Z · Codex start ~12:44:30Z (prompt file stamped 12:44:55Z) / end ≤12:51:23Z · record returned 12:51:37Z
Classification: product change — it changes whether a session starts, and what the user is told, on a launch where setup failed.
Round 1: fkit-producer — APPROVE — covers every brief requirement; no scope creep; any-symlink strictness accepted but must be recorded as deliberate; Q1: option 1; F+D is two launcher runs, not "one run"; role-file residual should go into the Q1 follow-up.
Round 1: fkit-architect — APPROVE — design (i) matches init's path_contained rule, so no ADR; Q1 finding holds, option 1 sound; condition: close-out/worklog/CHANGELOG must say A/B/C are refused only on a setup-failed launch; shell semantics sound under set -eu; mutations traced; each sed anchor must match exactly one line; minor gap: unreadable/unsearchable agents dir (decide and state); review-scope note re uncommitted 0284 hunks; F+D wording nit.
Changes, round 1 (after both APPROVE; editorial; no code-scope change; not re-asked): (a) F+D reworded "two launcher runs" — producer 6 / architect 8; (b) §9 adds the unreadable/unsearchable agents-dir case as accepted — architect 6; (c) §8 adds the 0284 review-scope note — architect 7; (d) §7 adds the "only on a setup-failed launch" statement and the deliberate-strictness record — architect 3 / producer 4; (e) Q1 option 1 now also covers the role-file residual — producer 7.
Disagreement: none.
Codex: mode [codex], completed (exit 0); no fallback banner. Findings verbatim:
  - X1 · Plan §10, "A/B on a launch where setup succeeds (Q1)"; `claude/fkit-claude.sh:453`, `claude/fkit-claude.sh:474` · high · correctness · The plan knowingly leaves the primary `.claude`/`agents` symlink escapes live. Current init treats its containment refusal as rc 0, so `setup_ok` remains 1 and the proposed guard is never called. Thus a historical escaped project still launches through outside agents, contrary to the brief's "at least one … agent file INSIDE the project" requirement.
  - X2 · Plan §6, mutations 51–53; `claude/fkit-claude.sh:474` · medium · missing-test · The stated sed-style anchors for 51–53 do not escape `[ ... ]`. Under BSD/POSIX basic regex, 51 and 53 do not match the literal guard text; 52 partially replaces only `] && return 0`, producing a different, broken line rather than `return 0`. The prove-red mutations therefore cannot demonstrate the claimed assertions.
  Adversarial reviewer's own supplement, labeled "[claude-supplement — NOT model-diverse]", verbatim:
  - X3 · Plan §6 mutation 49 (and 50); the precedent at `test/prove-red.sh:1149-1152` (the mutation-14/19 getline rule) · medium · missing-test · The plan says to use "the no-op / single-line / landed guards that 44–48 use", and those are `sed s///` (`test/prove-red.sh:2158`). But the replacement text for 49/50 contains `&&` and `2>&1`, and in a sed replacement `&` means the whole matched line. I ran it in scratch: the result was `… 2>agents_usable() {   # → 0 if …1 agents_usable() { …`. That is a syntax error, so the launcher dies with exit 2 on every test and every test goes red. The 0334/F+D named-red check then passes, and the no-op, single-line and landed guards all pass too. Mutation 50 is saved by its "0334/E stays green" clause. Mutation 49 has no stays-green clause, so a broken file is reported as a successful catch. Direction: build the replacement line with getline/awk as mutation 19 does, and have every 49–53 step also require `0334/healthy` to stay green.
  - X4 · Plan §5, "Every refusal asserts … the offending absolute path", and "D … today's two lines, asserted exactly"; `claude/fkit-claude.sh:33` (`proj="$PWD"`), `test/harness.mjs:134` · low · missing-test · On macOS, `mkdtemp(os.tmpdir())` returns `/var/folders/…`. The spawned `/bin/sh` gets a different inherited `PWD`, so it falls back to the physical path, `/private/var/folders/…`. I measured this: node spawning `sh -c 'echo $PWD'` with cwd set to the mkdtemp dir printed the `/private/var` form. So the path assertions and D's exact line ("check that $proj is writable") fail on the correct fix too. The risk is that the coder loosens the assertions to get green. Direction: `realpathSync` the project, as `test/top-level-doc-links.test.js:46` does.
  - X5 · Plan §3, "refuse ANY symlink on the chain, even one pointing inside the project … deliberate"; brief "What to build": "at least one READABLE, REGULAR agent file INSIDE the project" and "The ordinary case must stay byte-identical in behaviour" · low · regression · The plan's rule is stricter than the brief's criterion: an in-project symlinked `.claude`, agents dir or leaf now refuses on a setup-failed launch, where today it launches. The plan records this only in the worklog and close note. It is not put to the owner as a question, even though it changes what the brief accepts.
  The reviewer recorded as sound, not findings: `agents_usable` plus the guard under `set -eu` gave identical results in /bin/sh, /bin/dash and /bin/bash (healthy, mixed, a path with a space and `[1]` all launch; empty, absent and unsearchable `agents/` give D's message; a directory and a mode-000 file get the new message); `!`-assignment status and `$(…)` newline stripping are as assumed.
Coder check: X1 — confirmed as fact, disputed as a plan error — it is the plan's own measured §1/§10/Q1 finding (init rc 0 for A/B, measured 2026-10-16), and the brief requires the `setup_ok = 0` gate unchanged; the owner rules via Q1.
Coder check: X2 — confirmed — scratch probe: `sed 's/if [ -L "\$_p" ]; then/…/'` left the line unchanged (no-op); `sed 's/\[ -r … \] && return 0/return 0/'` with escaped brackets works. As written, prove-red's no-op guard would fail 51/53 loudly rather than pass them silently, but the anchors must be fixed.
Coder check: X3 — confirmed — standard sed semantics: an unescaped `&` in a sed replacement inserts the matched text, so 49/50's `&&` / `2>&1` corrupt the line. I did not rerun the reviewer's probe; its measured output is consistent with this.
Coder check: X4 — confirmed — my probe: node `spawnSync('/bin/sh',['-c','echo $PWD'],{cwd: mkdtemp})` gave `/var/folders/…/x-vXX1K1 -> /private/var/folders/…/x-vXX1K1`.
Coder check: X5 — confirmed as fact; the strictness is deliberate (init's path_contained rule) but it narrows what the brief accepts, so it goes to the owner as PC3.
Problems: none (no spawn denied or failed, no hop limit hit, every reply well-formed).
===PLAN-REVIEW RECORD END===

Lead's lines:
- Plan presented to the owner: ≈2026-10-16T12:54Z (the driver's clock read 12:53:40Z immediately before presenting).
- Owner's decisions, quoted, AskUserQuestion in the fkit-lead session (fkit-sprint-ship-loop --plan-review run, Sprint 12); answers received before 2026-10-16T17:48:37Z:
  - PC1+PC2: "Both (Recommended)"
  - PC3: "Refuse any symlink (Recommended)"
  - Q1: "Ship as scoped + follow-up brief (Recommended)"
  - Plan: "Approve (Recommended)"
- plan.md written 2026-10-16T17:48:37Z: the returned plan, then the lead's rulings section, then the returned post-Codex questions PC1–PC3 (15097 bytes, blob 5bf76063b13ed485cb9fcba6e809684ad42624b0). Citation-policy test after the write: 22 pass / 0 fail.
