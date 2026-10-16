# Plan — 0385: give the Codex adversarial prompt a per-run path

## Goal
Every fkit review procedure writes the Codex prompt to one fixed file, `.fkit/tmp/adversarial-prompt.md`. Two reviews running at once overwrite each other, and Codex then reviews the wrong diff with no error. Replace the fixed name with a per-run name at every site under `claude/`, keyed to the task where there is one, and say why in the procedure text.

## Measured now (2026-10-15, HEAD 6227119 + uncommitted 0516 changes)
`grep -rn "adversarial-prompt" claude/` — the same seven sites as the brief, lines moved:
- `claude/skills/fkit-review/SKILL.md:42` (assemble step) and `:62` (run line)
- `claude/skills/fkit-adversarial-review/SKILL.md:38` (assemble step) and `:50` (run line)
- `claude/skills/fkit-stateful-review/SKILL.md:109` (restated run line)
- `claude/agents/fkit-adversarial-reviewer.md:27` (procedure summary)
- `claude/README.md:125` (documented run line)
No hit in `claude/scaffold/`, `claude/structure-manifest.tsv` (scaffold paths only), `claude/orphan-targets` (directory only), root `README.md`, `CONTRIBUTING.md`, `docs/`, `bin/`, `test/`.
Other `.fkit/tmp/` mentions (`fkit-review/SKILL.md:254`, `fkit-stateful-review/SKILL.md:203`, `fkit-plan-task/SKILL.md:66`, `fkit-reviewer.md:25`, `fkit-adversarial-reviewer.md:55`) name the directory only; they stay true and are left alone.
**0516 overlap: none.** 0516's uncommitted files are `fkit-sprint-ship-loop/SKILL.md`, `fkit-coder.md`, `fkit-task-ship-loop/SKILL.md`, ADR-025/032/037, its brief, the Sprint 12 board. None is touched here.

## The naming rule (two shapes)
**A. Stateful review (`fkit-stateful-review`)** — deterministic, matches the ledger:
`.fkit/tmp/<key>-r<N>-adversarial-prompt.md`
- `<key>` is a fixed function of **the ledger key already resolved in this run** (never re-resolved from `$ARGUMENTS`): rules 1–2 → the matched task folder's ID prefix `<NNNN>` (for rule 1, the folder's prefix, not the raw argument); rule 3 → the branch slug; rule 4 has already stopped.
- `<N>` = the Round Step 0 computes. **Always present, `-r1` included** (open question 2).
- Example: `.fkit/tmp/0337-r2-adversarial-prompt.md` — the name the 0337 reviewer used by hand.

**B. Ephemeral passes (`fkit-review`, `fkit-adversarial-review`)** — a readable label plus a run id:
`.fkit/tmp/<key>-<run-id>-adversarial-prompt.md`
- `<key>` (a label only, never called "the ledger key"), in the ledger rule's order: the task ID `<NNNN>` if the caller named a task (for a plan pass, from the brief path's task folder → `<NNNN>-plan`); else the current branch slugified (`git branch --show-current`, `/`→`-`); else `review` (detached HEAD) — `review` stands where the ledger rule stops and asks, since an ephemeral pass has no ledger to fork.
- `<run-id>`: the UTC time to the second plus the shell's process number, printed by one command both skills give byte-identically:
  ```bash
  mkdir -p .fkit/tmp && echo ".fkit/tmp/<key>-$(date -u +%Y%m%dT%H%M%SZ)-$$-adversarial-prompt.md"
  ```
  The skills say: resolve the path once, then use the printed path **verbatim** for the prompt file and in the run line — shell variables do not carry between Bash calls, so never rebuild it.
- Collision safety comes from the run id, not the label. Why a run id even with a task id: two ephemeral passes on one task can overlap (an owner's `@fkit-adversarial-reviewer` while the reviewer runs `fkit-review`). Why never the branch name alone: reviews on `main` would all share one file. Why the process number as well as the time: a driver can start two spawns in the same second; two live shells never share a process number.

**Hazard line** (brief item 4), one per skill at the assemble step, same wording:
> ⚠️ **One prompt file per run — never a shared name.** Codex does not fail on a prompt another review overwrote: it returns a confident, well-formed review of the wrong diff, and no degradation branch fires.

## Steps
1. **`claude/skills/fkit-review/SKILL.md` Step 1B** — the source of shape B:
   - item 2: replace `.fkit/tmp/adversarial-prompt.md` with the shape-B path, its label/run-id rule and the command above; add the hazard line.
   - item 3 run line: `codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/<key>-<run-id>-adversarial-prompt.md` with "the exact path printed in item 2".
   - One sentence: `fkit-stateful-review` uses its own ledger-keyed path instead (pointer to its Step 1).
2. **`claude/skills/fkit-stateful-review/SKILL.md` Step 1** — keep "Exactly as in fkit-review Step 1" for everything else (contract, untracked files, degradation, coverage states); state that **the path differs in both places — where fkit-review item 2 assembles the prompt and in the run line** — and give shape A with `<key>`/`<N>` defined as above, one sentence each; replace the restated run line's literal with `.fkit/tmp/<key>-r<N>-adversarial-prompt.md`; add the hazard line.
3. **`claude/skills/fkit-adversarial-review/SKILL.md` Primary mode** items 2–3 — shape B, self-contained (separate role's skill that already restates assembly; its agent writes through a Bash heredoc, having no Write tool), including the `<NNNN>-plan` label; same command, byte-identical; hazard line. **Do not touch** the fallback banner (pinned byte-exact by `test/plan-review-switch.test.js` test 6) or the `**Or a plan:**` / `**When the input is a plan**` / ``never `path:line` `` phrases (also pinned).
4. **`claude/agents/fkit-adversarial-reviewer.md:27`** — "into a per-run prompt file under `.fkit/tmp/` (a task label plus a run id — the skill gives the rule)"; run line stays `codex exec --sandbox read-only --cd "$PWD" -` fed from that file.
5. **`claude/README.md` §The Codex adversarial pass** (~:122–126) — one sentence on per-run names (task + round for a stateful review; label + run id otherwise) and why; the code block becomes `codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/<task-id>-r<N>-adversarial-prompt.md`.
6. **Stated addition — `CHANGELOG.md` `## Unreleased`**, one line (CONTRIBUTING: "Landed a change people who use fkit would notice? Add a line"): reviews no longer share one Codex prompt file; each run writes its own under `.fkit/tmp/`, so two reviews running at once can no longer hand Codex the wrong diff; existing installs get it on next launch (precedent `CHANGELOG.md:19,23`).
7. **Stated addition — guard test `test/adversarial-prompt-path.test.js`** (node:test, zero deps, pattern of `test/code-comment-rule.test.js` / `plan-review-switch.test.js`):
   - no file under `claude/` contains the bare literal `.fkit/tmp/adversarial-prompt.md`;
   - each of the three skills carries the hazard line's key phrase and its shape (`-r<N>-adversarial-prompt.md` in stateful; `<run-id>-adversarial-prompt.md` in the two ephemeral ones);
   - the run-id command line is byte-identical in `fkit-review` and `fkit-adversarial-review` (drift guard for the two copies);
   - control arms: the same checkers on mutated in-memory copies (literal re-inserted; hazard line deleted; one copy of the command altered) must fail.
   Header: guards source text only, not runtime obedience. Picked up by `test:unit`'s `test/*.test.js` glob; not `test:docs` (reads `claude/`, not `ai-agents/`).

Order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → checks.

## Not done (brief §Not in scope)
No lock/mutex/PID file; no ship-loop scheduling change; no review-semantics change (coverage states, degradation, ledger schema, output contract untouched); no `.fkit/tmp/` cleanup; Codex output files (`codex-out.txt` etc.) not named; no `NAMED_EXEMPT`; no devDependency; no `.claude/` copies edited; no `ai-agents/knowledge-base/` or `ai-agents/wiki-vault/` edit.

**Flagged in the hand-off, not edited:**
- Stale, owner = architect: `ai-agents/knowledge-base/architecture.md:335` and `:381`; `adr-016-…:73`; `adr-042-…:28` (record what was true at decision time; at most an amendment note).
- Stale, owner = wiki (next sync): `wiki/systems/fkit.md:130`, `wiki/systems/review-and-model-diversity.md:14`.
- Historical, leave as-is: `ai-agents/knowledge-base/reports/2026-07-14-shared-instructions-layer.md:140`; `ai-agents/wiki-vault/log.md`.
- Knock-on for the producer: backlog briefs `0273` and `0287` cite line numbers in the same run lines; `0273` (sandbox flag at all call sites) edits the very lines this task changes — whichever lands second re-measures them. No dependency link either way; knock-on: none (checked).

## Edge cases
- Shape A and shape B names can never be equal: after `<key>-`, the run id starts with a digit, the round suffix with `r`. So a stateful and an ephemeral pass on the same task are safe.
- Two stateful reviews of the **same task and same round** at once still share a name — but they also write the same ledger round, which the ledger-key rule exists to prevent; not newly broken, out of scope. Same for two stateful reviews on one branch slug (rule 3) with no task.
- Re-running a discarded Codex pass in the same stateful round overwrites its own file — correct.
- Branch names with `/` → slugified; detached HEAD → `review`.
- `$$` is POSIX (bash, zsh, dash); `date -u +%Y%m%dT%H%M%SZ` works on BSD and GNU date.
- Writing the prompt: the reviewer's Write tool targets a new file (no read-before-overwrite refusal); the adversarial reviewer has no Write tool and writes through a Bash heredoc to the printed path.
- Prose re-wrap: test matches whitespace-flattened text.

## Checks (CONTRIBUTING "What to run")
Changed: `.md` under `claude/` not named in `prove-red.sh` (verified: none of the five is), `claude/README.md`, `CHANGELOG.md`, **and a new file under `test/`** → heaviest row = `npm test` (node suite + `test/prove-red.sh`, ~12 min). Brief verification 3 asks for it too.
1. `grep -rn "adversarial-prompt" claude/` — no bare literal; every hit keyed or rule prose.
2. Concurrency walk by reading (brief verification 2): two tasks; same task different rounds; same task stateful + ephemeral; two no-task ephemeral runs on `main` in the same second — record each pair of derived paths in the worklog.
3. `npm test`. Baseline: node suite **1133/1133** read from 0516's in-progress Verify log in this session (not my own run) — I re-measure the node suite and the prove-red count myself before the first edit. Expected after: baseline + new tests, prove-red unchanged.
4. `skill-frontmatter` and `dual-home-parity` inside that run (brief verification 4).
5. `git status`: changes only under `claude/`, `test/`, `CHANGELOG.md` (+ task-folder files); no `.claude/` copy.
Skipped: nothing planned.

## Open questions (owner)
1. **What to name the prompt file for a review not tied to a ledger** (brief NEEDS-DECISION 1 — the one shape the owner has not ruled; it changes what gets built). Rec: shape B — the task (or branch) as a readable label **plus a unique stamp made of the current time and the shell's process number**, on every such run. This differs from the brief's suggestion in two ways: it adds the stamp even when there is a task id, and it never uses the branch name alone (two reviews on `main` would share a file). Alternatives: (b) the brief's suggestion — task id, else branch name, else time — readable, but two reviews on the same branch, or of the same task, can still collide; (c) a `mktemp`-made name — always unique, but `mktemp` creates an empty file first, so the agent must read it before writing or write through the shell: an extra step that is easy to get wrong.
2. **Round suffix** (brief NEEDS-DECISION 2). Rec: mandatory `-r<N>` in stateful reviews, `-r1` included — matches the ledger's Round column, makes an incident traceable. Note: this changes current habit — today's round-1 files carry no suffix (e.g. `0126-adversarial-prompt.md`). Alternative: optional.

## Owner rulings at the plan gate (2026-10-15, AskUserQuestion, fkit-lead session)

This section is the lead's; the plan above and the post-Codex questions below are copied from the
coder's return. Where they differ from the plan above, the rulings and the adopted fixes below govern.

- Open question 1 (naming for a review not tied to a ledger): **"Label + time/process stamp (Recommended)"** — i.e. shape B as planned.
- Open question 2 (round suffix): **"Always, -r1 included (Recommended)"** — mandatory `-r<N>` as planned.
- Post-Codex fixes: **"PQ1–3 yes, PQ4 no change (Recommended)"** — PQ1, PQ2 and PQ3 are adopted with their drafted text below; PQ4 is "no change".
- Plan: **"Approve (Recommended)"**.

## Post-Codex questions (owner) — each has drafted text as the recommended option. The plan above is unchanged until you pick.

**PQ1 (X1, C2): add the run id to the stateful shape too.** Rec: adopt. Replace the shape-A bullet head and path with:
> **A. Stateful review** — `.fkit/tmp/<key>-r<N>-<run-id>-adversarial-prompt.md`. `<key>` and `<N>` exactly as above. `<run-id>` comes from the same one-line command as shape B (printed once, used verbatim). The round keeps the file traceable to the ledger, and the run id keeps it unique. Two reviewers that compute the same round, and a clean round whose number repeats, no longer share a file.

Knock-ons:
- Step 2's run line becomes `.fkit/tmp/<key>-r<N>-<run-id>-adversarial-prompt.md`.
- The README example becomes the same shape.
- The test's byte-identical-command check covers all three skills.
- The edge-case line "two stateful reviews of the same task and same round still share a name" is removed.
- Uniqueness rests on the run id everywhere.

Plain terms: today a round number can repeat (a round with nothing new found does not move it), so the "per-review" name can be reused and an old prompt can reach Codex. Adding the same time-and-process stamp closes that. Alternative: keep shape A as is, and accept the shared name for same-round concurrent reviews.

**PQ2 (C1): make the branch-name label shell-safe.** Rec: adopt. Replace "the current branch slugified (`git branch --show-current`, `/`→`-`)" in both shapes with:
> the current branch name with every character outside `A–Z a–z 0–9 . _ -` replaced by `-`

Every command that uses the path quotes it: `codex exec --sandbox read-only --cd "$PWD" - < "<path>"`, and `cat > "<path>" <<'EOF'` for the heredoc. Add a test assertion that the run lines quote the path.

Plain terms: git allows branch names like `feat$(id)`, and as planned that text would run as a command on the reviewer's machine when someone reviews such a branch. Alternative: leave as is (risk only from hostile branch names).

Note: the stateful ledger rule 3's own "slugified" is not shell-interpolated (the ledger is written with the Write tool), so it is left alone. That is out of scope; a follow-up is possible.

**PQ3 (X3): make the guard test check the actual paths, not just phrases.** Rec: adopt. Add an assertion to Step 7:
> every `.fkit/tmp/…adversarial-prompt.md` path in the five `claude/` files must contain the `<run-id>` placeholder (README's example included)

Add a control arm: `.fkit/tmp/fixed-adversarial-prompt.md` must fail. With PQ1 unadopted, the rule is "contains `<run-id>` or `-r<N>-`".

Plain terms: as planned, someone could swap in a different fixed filename and the test would stay green. Alternative: keep the phrase-only checks.

**PQ4 (C3): process-number reuse.** Rec: no change. The run id is time to the second plus process number. On an ordinary macOS or Linux host process numbers count upward and are not reused within a second. `mktemp` would be atomic but needs a read-before-write or a shell write step. Alternative: append a few random hex characters (`od -An -N3 -tx1 /dev/urandom | tr -d ' \n'`) to the run id in the one command.
