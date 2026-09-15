# Repair the bare `claude/` directory references that 0390's sweep missed, with a two-audience fix

## ID
0396

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
`/fkit-sprint-ship-loop` (Sprint 9) — **the option label is the verbatim text**: **"Follow-up brief
(Rec)"**. The ruling's own description: *"Close 0390 as built. The producer files a brief to design a
fix that works in both the fkit repo and consuming projects (like fkit-heal:51's split). 0390 records
R1 as an accepted residual pointing to that brief."*

**Origin:** review finding **R1** in
[`0390`'s review ledger](../../done/0390-sweep-the-repo-only-claude-path-form-out-of-installed-facing-skill-and-scaffold-prose/review.md)
— the row that opens *"Sweep incomplete: a bare repo-only `claude/` DIRECTORY operand is still in the
runnable repoint command"*. Reviewer rated it **low**; **pre-existing**, not introduced by `0390`.

### The problem — one path form, two audiences

Skill files under `claude/skills/` are read by two different readers:

- **Inside the fkit repo**, `claude/` is the canonical source, and `.claude/` holds gitignored,
  fkit-managed copies that must **never** be edited or repointed.
- **In a consuming project**, there is `.claude/` but **no `claude/`** at all.

So a bare `claude/` is right for the first reader and wrong for the second, and a mechanical
`claude/` → `.claude/` rewrite is wrong for the first. ⛔ **This is not a token swap.** The precedent
for the right shape is the split wording in `claude/skills/fkit-heal/SKILL.md` — the parenthetical
that opens *"(In this repo's own checkout: `bash claude/skills/fkit-heal/check.sh`."* — which gives the
consuming-project form first and the fkit-checkout form second.

### Known sites (measured 2026-09-14 at filing — re-derive at pickup; quote text, do not trust line numbers)

Found with the bare-form grep in *What to build* step 1. 11 hits in 5 files:

| File | Quoted text | Kind |
|---|---|---|
| `claude/skills/fkit-sprint-done/SKILL.md` | the repoint command *"grep -rn --exclude-dir=wiki-vault "<basename>" ai-agents/ claude/ test/ CLAUDE.md README.md AGENTS.md"* | **runnable** |
| `claude/skills/fkit-sprint-cancelled/SKILL.md` | same command | **runnable** |
| both sprint movers | *"in `claude/`, `test/`, `CLAUDE.md`, `README.md` or `AGENTS.md`"* | prose |
| both sprint movers | *"19 in `test/`, 5 in `claude/` — and NOT ONE of them was an href"* | prose — a **historical measurement** on fkit's own Sprint 8 close |
| both sprint movers | *"**including hits outside `ai-agents/`** (`claude/`, `test/`, the root docs)"* | prose |
| `claude/skills/fkit-stateful-review/SKILL.md` | *"`path:line` is **correct** for source, tests, and files under `claude/`"* | prose |
| `claude/skills/fkit-process-stateful-review/SKILL.md` | same sentence | prose |
| `claude/skills/fkit-status/dashboard.sh` | the comment *"verified by grep over `claude/`, `bin/` and `test/` on 2026-09-11"* | script comment — **not in R1**; found at filing; likely a legitimate fkit-meta provenance note, triage at pickup |

### Why the runnable command matters

In a consuming project, grep given a missing directory operand prints *"No such file or directory"*
and **exits 2 even when it found hits**. An agent reading the exit status can judge the step failed.
Every hit in the directories that do exist is still printed, and nothing in a consumer's `.claude/`
should be repointed anyway — which is why it is rated low.

⚠️ **Found at filing, wider than R1:** the same exit-2 effect applies to **every** operand a consuming
project may lack — `test/`, `CLAUDE.md`, `README.md`, `AGENTS.md` are not guaranteed there either.
Fixing only `claude/` on that line may leave the exit-2 behaviour in place. **Plan-gate question**
(see step 3).

### Root cause of the miss

`0390`'s site grep was `claude/[A-Za-z0-9_./-]+` — it requires at least one character after the slash,
so it **cannot match a bare `claude/`**. `0390`'s "zero untriaged" conclusion rested on that grep.

### Dependencies and constraints

- ⛔ **Depends on `0390`** (Sprint 9) — its sweep edits the same skill files.
- ⚠️ `test/mover-exemption-step.test.js` quotes the operand list in an assertion message: *"it greps
  `ai-agents/ claude/ test/ CLAUDE.md README.md AGENTS.md`"*. Changing the command makes that message
  stale; check whether any needle/parity test (the S4 same-block comparison between the two sprint
  movers, `test/prove-red.sh` mutations) pins the command or its surrounding prose.
- The two sprint movers carry mirrored clauses; edit them **identically**.

## What to build

1. **Re-derive the site list with a grep that CAN see the bare form**, alongside `0390`'s path-form
   grep. At filing this was:
   `grep -rnE '(^|[^.A-Za-z0-9_~/-])claude/($|[^A-Za-z0-9_.-])' claude/skills claude/agents claude/scaffold`
   Record the command and its full output in the worklog, and triage **every** hit (fix / leave, with a
   reason). Name the command in the worklog so a future sweep can reuse it.
2. **Classify each site** by audience: (a) runnable command a consumer will execute, (b) instruction
   prose a consumer acts on, (c) fkit-meta or historical text that is correct as written (e.g. the
   Sprint 8 measurement, the `dashboard.sh` provenance comment) — class (c) is left unchanged, with
   the reason recorded.
3. **Plan gate — the fix shape is a design decision for the owner.** Put options to the owner for at
   least:
   - **The runnable command:** e.g. a consumer-first command with an fkit-checkout parenthetical (the
     `fkit-heal` shape); or one command that tolerates missing operands; or an instruction to judge the
     step by its printed hits rather than its exit status. Include whether the fix covers the **whole
     operand list** (`test/`, root docs) or `claude/` only.
   - **The prose sites:** two-audience wording per site, or one shared note per file.
   The coder's plan recommends one; the owner rules. Do not implement before the ruling.
4. **Apply the ruled shape** to every class (a)/(b) site. Keep both sprint movers byte-identical in
   their mirrored clauses. Do **not** edit anything under `.claude/` (managed copies).
5. **Update any test message or pin** the change makes stale (at minimum the
   `test/mover-exemption-step.test.js` message quoted above, if the operand list changes).
6. **If any file under `claude/scaffold/` is edited**, run `npm run generate:manifest` and confirm the
   manifest diff is only the hash lines of the files edited.

## Verification steps

1. The worklog records the bare-form grep command, its output before the change, and a triage verdict
   for every hit.
2. Re-running that grep after the change returns **only** hits triaged as class (c), each with its
   recorded reason.
3. **Consumer check:** in a scratch directory shaped like a consuming project (`ai-agents/` and
   `.claude/` present, no `claude/`, no `test/`), running the repoint command exactly as the ruled
   wording instructs a consumer to run it produces the hits and behaves as the plan gate ruled (exit
   status, or the instruction about reading output). Record the command, output, and exit code.
4. **fkit-repo check:** in this checkout, the fkit-checkout form of the command still searches
   `claude/` (not `.claude/`) and finds at least one known hit (e.g. search for `sprint-8.md`). Record
   output.
5. The mirrored clauses in `claude/skills/fkit-sprint-done/SKILL.md` and
   `claude/skills/fkit-sprint-cancelled/SKILL.md` stay identical: `node --test
   test/mover-exemption-step.test.js` passes.
6. `npm test` passes (includes `test/prove-red.sh`).
7. If a scaffold file changed: `npm run generate:manifest` was run and the manifest diff is exactly the
   edited files' hash lines.
8. `git diff --stat` touches only the triaged skill/scaffold files, any test updated under step 5, the
   manifest if step 6 applied, and this task folder. Nothing under `.claude/` or
   `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** [`0390`](../../done/0390-sweep-the-repo-only-claude-path-form-out-of-installed-facing-skill-and-scaffold-prose/brief.md)
  — hard; same files.
- **Blocks:** nothing.
- ⚠️ **One brief, not a split — producer judgement.** The ~11 sites could be split (runnable command
  vs prose; sprint movers vs stateful-review skills), but one plan-gate decision (the two-audience
  wording) governs all of them, and splitting would put the same design question to the owner two or
  three times. If the plan gate rules different shapes for the command and the prose, splitting at
  that point is reasonable.
- ⚠️ **Scope widened beyond R1 at filing, flagged:** the `dashboard.sh` comment hit, and the observation
  that `test/` and the root docs cause the same exit-2 effect. Both are put to the plan gate, not
  silently folded in.
- Cite `ai-agents/…md` files by quoted text, not `path.md:N` line coordinates.
- Owner field: `fkit-coder` — the deliverable is skill-prose and possibly test edits; no ruling assigns
  the owner, producer judgement.
- Filed by a spawned `fkit-producer` with no owner channel. ID `0396` verified free: max task-folder id
  and max `## ID` across `backlog/`, `done/`, `cancelled/` both `0395` at filing.
