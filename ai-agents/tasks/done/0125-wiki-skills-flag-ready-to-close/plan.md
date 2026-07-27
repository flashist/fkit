# Plan — 0125: the three wiki SKILLs end by flagging "task N ready to close"

- **Author:** fkit-coder (plan step of `/fkit-sprint-ship-loop`, sprint 2)
- **Planned:** 2026-07-26 · **Approved by the owner:** 2026-07-27, via `AskUserQuestion` in the driver
  session (option "Approve"), with both open decisions ruled at the same gate (see §2).
- **Status:** implemented 2026-07-27 — see `worklog.md`.

## 0. Ground truth established before planning (all verified by execution)

| Claim | Verified how | Result |
|---|---|---|
| The three wiki SKILLs mention closing / movers today | `grep -rn "task-done\|task-cancelled\|ready to close\|close\b\|mover" claude/skills/fkit-wiki-{ingest,sync,lint}/` | **No hits.** Change is additive; nothing to remove. |
| 0124 landed (wiki lost the movers) | read `claude/skills-for-role.sh` | Yes — `wiki` holds only `fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-wiki-ingest fkit-wiki-lint fkit-wiki-sync` |
| A contrary "wiki may close" claim survives in a **system prompt** or the universal rules block | read `claude/agents/fkit-wiki.md` in full; read `claude/scaffold/universal-rules.md` in full; grepped `claude/ test/ CLAUDE.md` for wiki+close | **None.** `universal-rules.md:7` already reads "Only the producer may invoke them". `fkit-wiki.md` never mentions closing or a mover at all. No system-prompt edit needed or in scope (brief verification step 4). |
| Any **test** asserts the current wiki SKILL wording | `grep -rn "fkit-wiki-ingest\|fkit-wiki-sync\|fkit-wiki-lint" test/` | Only `test/skill-ownership-hook.test.js:302,331` — skill-**name** arrays, not SKILL body text. **No test reads these files' prose.** |
| The ADR-018 hook could enforce this | `grep -n` over `claude/skill-ownership-hook.sh` | Reads stdin once (`payload="$(cat)"`) and sources `skills-for-role.sh`. **Never opens a `SKILL.md`.** This convention is **prose only, unenforced** — see §6.1. |
| Dual-home / ADR-027 parity concern | `find claude/scaffold -iname "*wiki*"` | Only `claude/scaffold/ai-agents/wiki-vault/`. **No wiki SKILL is scaffold-dual-homed.** |
| `.claude/` mirrors | `.gitignore:17` = `.claude/skills/fkit-*/` | Gitignored, refreshed by `fkit-claude-init.sh` on launch. **Edit `claude/` only.** |
| Test command (ADR-014) | `package.json` | `npm test` = `node --test test/*.test.js && bash test/prove-red.sh`. Zero devDeps. |

**Not verified at plan time:** the test suite was not run during planning (that step was write-nothing;
`converge-contract.test.js` clones the repo and `prove-red.sh` mutates). The build step took the
baseline first — recorded in `worklog.md`.

## 1. Scope

Three files, text only:

- `claude/skills/fkit-wiki-ingest/SKILL.md`
- `claude/skills/fkit-wiki-sync/SKILL.md`
- `claude/skills/fkit-wiki-lint/SKILL.md`

Nothing else. No `claude/agents/*`, no `skills-for-role.sh` (so the four-mirror checklist is **not**
triggered), no mirrors, no `.claude/`, no test file, no commit, no task-file move.

## 2. The two decisions put to the owner at the plan gate — both ruled 2026-07-27

**D1 — how does the wiki know which task it completed?** The brief says to flag "each completed tracked
task" but never says how one is identified.

- *Option A — caller-named only.* Smallest text. **Cost:** reproduces 0108 exactly — task 80 sat
  `🔄 In progress` for a week precisely because nobody named it.
- *Option B — caller-named **plus** a backlog scan (recommended).* Also read
  `ai-agents/tasks/backlog/*/brief.md` for briefs whose `## Owner` is `fkit-wiki` and whose `## Status`
  is not `✅ Done`. **Cost:** possible false-positive flags, bounded by the doubt rule.

**→ OWNER RULED: Option B.** Both bullets implemented. Doubt rule kept verbatim: *fully → complete; in
part or uncertain → **partial**; never resolve doubt as complete.*

**D2 — keep the null line?** A run completing no tracked task writes
`No tracked task completed by this run.`

**→ OWNER RULED: KEEP.** Reasoning: silence cannot be told apart from a skipped check.

## 3. The exact text added — one verbatim-identical block, three files

House style in these files cites ADRs **bare**, with no relative link (e.g.
`fkit-wiki-sync/SKILL.md:45` "Since ADR-029 a task is a **folder**"). Matched — no relative markdown
links to `ai-agents/knowledge-base/decisions/`.

Added as a **new final numbered step** in each SKILL, immediately after that SKILL's existing report
step and **before** its `## Hard rules` section. Body byte-identical across all three once leading
indentation is normalized; only the step number/heading differs.

- `fkit-wiki-ingest/SKILL.md` — list item **7**, after `6. **Report:** …`
- `fkit-wiki-sync/SKILL.md` — new `## Step 9 — Flag any completed tracked task — close nothing`
- `fkit-wiki-lint/SKILL.md` — list item **8**, after `7. **Report** a final summary.`, before the `---`

**Body:**

> **The wiki closes nothing and moves no task file.** Since **ADR-033** the task movers
> (`/fkit-task-done`, `/fkit-task-cancelled`) are the **producer's alone** — the wiki does not hold
> them, and the ADR-018 hook denies a mover call from a wiki identity at any spawn depth. The wiki's
> completion signal is a **flag in this report**, and nothing else. (`log.md` is not a signal: no board
> tool reads it. That is exactly why task 80's vault work sat `🔄 In progress` on the board for a week.)
>
> **Which tasks to consider** — any tracked task this operation may have completed:
> - one the caller named when invoking this procedure; **and**
> - any brief under `ai-agents/tasks/backlog/*/brief.md` whose `## Owner` is `fkit-wiki` and whose
>   `## Status` is not `✅ Done` — read each and apply the rule below.
>
> **The rule: is that brief's deliverable *this* vault work?** Fully → complete. Only in part, or you
> are not certain → **partial**. **Never resolve doubt as complete.**
>
> **End the report with one line per such task, in exactly this form:**
> - complete → `Task N's vault work is complete — ready to close (producer runs /fkit-task-done)`
> - partial or uncertain → `Task N: partial — not ready to close`
>
> If this run completed no tracked task, write the single line `No tracked task completed by this run.`
> **Never invent a task to have something to flag.**
>
> These lines are the **last** thing in the report. A caller who summarizes this report **carries them
> verbatim** — a dropped flag is the whole bug this exists to fix.
>
> **Then stop.** Do not invoke a mover, do not edit the brief, do not touch the sprint plan. Routing the
> close is the caller's next move: `@fkit-producer Run /fkit-task-done on <brief path>`.

**Plus one bullet appended to each file's `## Hard rules` section** (verbatim, all three):

> - **Close nothing.** The wiki does not hold the task movers (ADR-033) and never invokes one, never
>   moves a task file, and never edits a brief or the sprint plan. It **flags**; the producer closes.

The flag string is the brief's fuller form, which contains ADR-033 §2's phrase *"task N ready to
close"* — satisfying both the ADR and the brief.

## 4. Sequencing

1. Baseline `npm test` **before** touching anything; record pass/fail.
2. Edit `fkit-wiki-ingest/SKILL.md`.
3. Edit `fkit-wiki-sync/SKILL.md`.
4. Edit `fkit-wiki-lint/SKILL.md`.
5. Run the §5 verification commands.
6. Leave everything in the working tree. **No commit.**

## 5. Verification commands

```bash
# 1. complete-flag line — expect 3 hits, one per SKILL
grep -n "ready to close (producer runs /fkit-task-done)" claude/skills/fkit-wiki-*/SKILL.md

# 2. partial-flag line — expect 3 hits
grep -n "partial — not ready to close" claude/skills/fkit-wiki-*/SKILL.md

# 3. hard-rule bullet — expect 3 hits
grep -n "The wiki does not hold the task movers" claude/skills/fkit-wiki-*/SKILL.md

# 4. uniformity — extract each block, normalize indentation, diff pairwise
for f in ingest sync lint; do
  sed -n '/\*\*The wiki closes nothing/,/Run \/fkit-task-done on/p' \
    claude/skills/fkit-wiki-$f/SKILL.md | sed 's/^ *//' > /tmp/wf-$f.txt
done
diff /tmp/wf-ingest.txt /tmp/wf-sync.txt && diff /tmp/wf-ingest.txt /tmp/wf-lint.txt \
  && echo "UNIFORM"

# 5. the wiki never INVOKES a mover — read every hit by eye
grep -n "fkit-task-done\|fkit-task-cancelled" claude/skills/fkit-wiki-*/SKILL.md

# 6. regression guard — expect the §4 step-1 baseline
npm test

# 7. change surface; nothing staged, nothing committed
git status --porcelain
git diff --stat
```

> **Correction applied at build time.** As first written, check 4's start anchor was
> `/The wiki \*\*closes nothing/` — literally `The wiki **closes nothing`. The block's actual text is
> `**The wiki closes nothing`, with the `**` *before* "The wiki", so the anchor matched zero lines and
> the check would have silently compared three empty files and printed `UNIFORM`. Corrected above to
> `/\*\*The wiki closes nothing/`. See `worklog.md`.

Mapping to the brief's verification steps: brief-1 ← checks 1, 2, 4; brief-2 ← check 5; brief-3 ←
checks 1 and 3; brief-4 ← check 7.

## 6. Risks and what this does **not** fix

1. **This convention is prose only. Nothing enforces it.** The ADR-018 hook reads only the stdin payload
   and `skills_for_role()` — verified, it never opens a `SKILL.md` — and no test reads these files'
   bodies. If a future edit deletes the block, **nothing goes red.** **Follow-up for the producer to
   file (deliberately out of scope — the brief's verification step 4 forbids adding a test):** a small
   `test/wiki-flag-convention.test.js` asserting the verbatim flag line in all three files, in the
   spirit of task 0152's SKILL H1 guard. This is exactly the class of gap task 0142 is investigating.
2. **Three copies can drift.** Mitigated by the byte-identical block and check 4; the durable fix is (1).
3. **The spawned-consult loss is reduced, not closed.** The 0108 report §3 named it: when the wiki runs
   as a spawned consult mid-flow, the flag rides the return and a summarizing caller can drop it.
   "Last lines, carried verbatim" reduces the miss rate; it is not structural.
4. **The `.claude/` mirror is stale until relaunch.** Verify by reading `claude/`, never `.claude/`.
5. **False-positive flags** from the D1 Option B scan — bounded by "resolve doubt as *partial*", which
   is never an instruction to close anything.
6. **`/fkit-task-done` now appears as a string inside wiki SKILL files.** A careless future grep could
   read that as the wiki holding a mover. The surrounding sentence states plainly that it does not;
   check 5 makes the audit explicit.
7. **Lint rarely completes a tracked task.** The block is uniform anyway (uniformity is the point), and
   the null line keeps the common case one line.

## 7. Not in scope, deliberately

`claude/agents/fkit-wiki.md`, `universal-rules.md`, `skills-for-role.sh` and its four mirrors, and any
test file. All were checked; none carries a contrary "wiki may close" claim (§0), so no contradiction
exists between a system prompt and these SKILLs. The agent prompt's Output-format bullet already defers
to "the concise summary that procedure defines" — the correct coupling, and the reason the SKILL is the
right and only place for this.
