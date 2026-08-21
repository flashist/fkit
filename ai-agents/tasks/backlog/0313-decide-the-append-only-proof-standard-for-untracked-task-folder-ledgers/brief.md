# Decide the append-only proof standard for untracked task-folder ledgers

## ID
0313

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### ⛔ What this task is, and what it is NOT

**This task DECIDES which proof mechanism becomes the documented standard for proving an append to a
task-folder ledger, gets that shape ruled by the owner, and only then writes doc text.**

⛔ **It does NOT arrive with the answer picked.** In particular it does **not** arrive having decided
that the fix is *"commit the ledgers"*. `CLAUDE.md`'s universal hard rule — *"Never commit or push
unless the owner explicitly asks"* — means **no agent may make committing part of an automatic
step.** Whether and when these files get committed is an **owner act**, so *"track them"* is one
option on a list, not the default. A run that writes the doc change before the owner rules has failed
the task.

### Authority

**Owner-ruled filed 2026-08-16**, live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop` — **verbatim option label: `"File a task for it (Recommended)"`.**

### Provenance

Surfaced by task
[`0177`](../../done/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md)'s **round-2
re-verification**, 2026-08-16; owner-ruled filed the same day through the live driving session.

### The finding — re-derived first-hand by the filing producer, 2026-08-16

⚠️ **Every figure below was measured this run against the live tree, not carried on anyone's word.**
⚠️ **It is a dated observation against a dirty tree — RE-DERIVE BEFORE ACTING.**

**1. Only `brief.md` is tracked in a live task folder.** For
`ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/`:

| Command | Output |
|---|---|
| `ls <0177-folder>/` | `brief.md`, `canary.sh`, `plan.md`, `review.md`, `worklog.md` |
| `git ls-files <0177-folder>/` | **`brief.md` only** |
| `git status --porcelain <0177-folder>/` | ` M brief.md` + `?? canary.sh`, `?? plan.md`, `?? review.md`, `?? worklog.md` |

**2. `git diff --numstat` on an untracked ledger returns NOTHING — and exits 0.**

```
$ git diff --numstat -- <0177-folder>/worklog.md
[no output; exit 0]

$ git diff -U0 -- <0177-folder>/worklog.md | grep '^-' | grep -v '^---'
[no output]

$ git diff --numstat -- <0177-folder>/brief.md      # the TRACKED sibling, for contrast
24      9       ai-agents/tasks/backlog/0177-.../brief.md
```

⭐ **This is the whole defect in one line.** Empty output from `--numstat` means **"git has no
baseline for this path"** — it does **not** mean *"zero deletions"*. But **a passing check looks
exactly the same**: the second command's expected output on a genuine `+N / −0` append is *also*
empty. A worker that reports the empty output as a passing proof **has proven nothing**, and nothing
in the current wording tells it to distinguish the two cases.

**3. The two failing checks compound rather than cover for each other.** On a tracked file, a
deletion the `grep` filter misses is still caught by `--numstat`'s `−N` column. **On an untracked
file BOTH checks return empty**, so the redundancy that makes the pair trustworthy is exactly what
disappears.

**4. It is not hypothetical, and one fallback was self-produced.** Workers this run fell back to
pre-edit snapshots, and in one case the only available snapshot **had been produced by the very
worker whose work was being checked** — a self-produced baseline, disclosed as such at the time.

**5. ⚠️ Correction to the finding as it was handed to this producer.** The routing note named
`claude/skills/fkit-sprint-ship-loop/SKILL.md` as one of the documents prescribing the git-based
proof. **Verified false on disk, 2026-08-16:** `grep -n -i 'append' claude/skills/fkit-sprint-ship-loop/SKILL.md`
returns **no matches at all**, and the file contains no `numstat`. The prescription lives elsewhere —
see *Blast radius* below. Recorded so the next reader does not go looking for text that is not there.

**6. ⚠️ These files are NOT gitignored — the gap is a window, not a permanent exclusion.**
`git check-ignore` on the untracked `worklog.md` exits **1** (not ignored), and repo-wide the tracked
counts are `brief.md` **306**, `review.md` **107**, `worklog.md` **87**, `plan.md` **81** against
on-disk **312 / 113 / 93 / 87**. So ledgers *do* become tracked once the owner commits; **25** paths
under `ai-agents/tasks/` are untracked right now (6 × `worklog.md`, 6 × `review.md`, 6 × `plan.md`,
6 new folders, 1 task-local script). ⭐ **The window is exactly the sprint run — which is precisely
when the append proof is needed.** Any option that relies on tracking must say what happens *inside*
that window.

### ⭐ A non-git proof mechanism already exists in-repo, framed as a special case

`claude/skills/fkit-record-decision/SKILL.md` already documents a snapshot path, under the heading
*"When earlier uncommitted appends already sit on the same file"*:

> `git diff --no-index --numstat <snapshot> <adr-file>   # expect "N  0"`
> `diff <snapshot> <adr-file> | grep '^<'                # expect no output`

⚠️ **This is most of the remedy, in the wrong frame.** It is scoped to a *different* problem (a
second append onto an already-dirty tracked file), it says nothing about untracked files, and nothing
instructs a worker to **detect** the untracked case and switch to it. It also has the self-produced
baseline problem from finding 4: a snapshot is only evidence if a party other than the editor took it,
or if it is taken before the editing worker is spawned.

### The options — none of these is pre-decided

| # | Option | What it costs |
|---|---|---|
| **A** | **Track the ledgers as part of the owner's normal commit flow**, and require a commit before a review round that needs an append proof | ⛔ Cannot be an automatic agent step (hard rule). Adds an owner gate mid-run. Overlaps [`0310`](../0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work/brief.md). |
| **B** | **Adopt a non-git proof as the documented standard** — a pre-edit snapshot taken by a party other than the editing worker, compared with `diff` / `git diff --no-index` | Needs a rule for **who** takes the snapshot and **when**, or finding 4 recurs. No owner gate needed. |
| **C** | **Combination** — snapshot proof is the standard, and a commit (when the owner grants one) upgrades it to a git-baseline proof | Two paths to document; a worker must pick correctly. |
| **D** | **Detect-and-refuse** — teach the checks to detect *"no baseline"* and return a loud UNPROVABLE rather than a silent pass | Smallest change, and compatible with A/B/C. Does not by itself supply a proof. |

⭐ **The filing producer's read, offered as input and not as a decision:** **D is a floor, not an
option** — whatever else is chosen, a check that cannot tell *"no baseline"* from *"zero deletions"*
should not be reported as passing. **B or C** then supplies the actual proof. **The choice is the
owner's.**

### Blast radius — verified on disk, 2026-08-16, not trusted from the routing note

Documents that currently **prescribe** the git-based proof (as opposed to merely reporting having run
it):

- ⭐ **`claude/skills/fkit-record-decision/SKILL.md`** — **the only normative source.** Its
  correction-note section carries the block headed *"Append-only, proved by diff — not by eye"*, both
  prescribed commands, the *"Use that deletion filter exactly"* warning, and the snapshot fallback.
  **Changing the standard means changing this file.**
- `claude/agents/fkit-wiki.md` — mentions `log.md` as an *"append-only activity log"*. **Descriptive,
  not a proof prescription**; it names no commands. Included so an implementer can confirm and dismiss
  it rather than rediscover it.
- ⛔ **`claude/skills/fkit-sprint-ship-loop/SKILL.md` does NOT prescribe it** — no `append`, no
  `numstat`. See finding 5.

**Everything else that mentions `numstat` is a *consumer*, not a source** — roughly 50 files, almost
all task `brief.md` / `plan.md` / `worklog.md` / `review.md` artifacts recording that a worker ran the
check, plus `ai-agents/sprints/backlog.md`, `ai-agents/sprints/done/sprint-2.md`,
`ai-agents/wiki-vault/log.md`, and
`ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md`. ⚠️ **Closed
artifacts are frozen history and are not rewritten by this task.** Open briefs that *instruct* a
future run to use the check — at least
[`0232`](../0232-correct-adr-012s-stale-source-of-truth-and-code-coordinates/brief.md),
[`0311`](../0311-specify-the-corrections-bullet-own-date-and-metadata-position/brief.md),
[`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md) — **are in scope for a
follow-up sweep only if the owner rules the standard changes**, and that sweep should be its own
brief, not folded in here.

### Conflicts and adjacencies

- ⚠️ **[`0310`](../0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work/brief.md)
  is the adjacent decision and partly overlaps option A.** It decides whether the ship-loop asks the
  owner to commit implemented work. **If `0310` lands with a gate that fires often enough, option A
  becomes cheap and the window in finding 6 shrinks — it does NOT close.** A ledger is still untracked
  between its creation and the next approved commit. **Whichever of the two is ruled second must
  re-read the other rather than assume.**
- ⚠️ **[`0311`](../0311-specify-the-corrections-bullet-own-date-and-metadata-position/brief.md)
  already records the `^---` filter residual as *known*.** This task does **not** fix that residual —
  [`0314`](../0314-fix-the-deletion-filter-blind-spot-in-fkit-record-decision/brief.md) does, and it
  ships independently.
- ⛔ **Do not edit `0177`'s folder** — held by another worker at filing time.

## What to build

**Phase 1 — decide (owner-present, mandatory before any doc edit).**

1. Re-derive the findings above against the live tree. If the picture has changed, the newly-measured
   reality supersedes this brief.
2. Put the option table to the owner via `AskUserQuestion`, with the questions below stated as
   questions and the producer's read (D-as-floor) marked as a recommendation, not an assumption.
3. Decide whether this warrants an **ADR**. It changes a rule the whole team follows and it brushes a
   universal hard rule, which argues yes; it is arguably a documentation correction, which argues no.
   **State the call and the reason either way.**

**Phase 2 — write it, only after phase 1 is ruled.**

4. Amend `claude/skills/fkit-record-decision/SKILL.md`'s *"Append-only, proved by diff"* block to
   encode the ruled standard, including — at minimum, and whatever else is ruled — an explicit
   statement that **empty `--numstat` output on an untracked path is "no baseline", not "zero
   deletions"**, and what a worker must do when it sees it.
5. If option B or C is ruled, state **who** takes the pre-edit snapshot and **when**, such that a
   worker cannot supply its own baseline for its own work (finding 4).
6. If an ADR is ruled, record it via `/fkit-record-decision` into
   `ai-agents/knowledge-base/decisions/`.
7. File a follow-up brief for the open-brief sweep if — and only if — the ruled standard invalidates
   instructions already written into open briefs.

⛔ **No commit, no push, no `ai-agents/wiki-vault/` write** (wiki writes are `fkit-wiki`'s, ADR-005).
If the ruled change lands in an ADR or a skill the vault already summarizes, file a wiki resync
sibling rather than writing the vault here.

## Verification steps

1. **The decision exists and is the owner's.** The record (ADR or the skill's own text) names the
   ruling, its date, and that it came from the owner — not from an agent's judgement.
2. **The untracked case is addressed in text.** `grep -n -i 'untracked\|no baseline'
   claude/skills/fkit-record-decision/SKILL.md` returns at least one match inside the append-proof
   block.
3. **The two-case ambiguity is stated.** The block explicitly says empty `--numstat` output can mean
   *"no baseline"*, and names the action a worker takes on seeing it.
4. **Reproduce the defect against the amended procedure.** In a scratch dir: create a git repo, write
   an untracked `worklog.md`, follow the amended procedure, and confirm it does **not** yield a
   passing verdict. Record the commands and output.
5. **If B or C was ruled:** the text names the snapshot's producer and timing, and a reader can answer
   *"may the editing worker take its own baseline?"* from the text alone.
6. **Blast radius re-verified at close, not assumed.** Re-run
   `grep -rln 'numstat' --include='*.md' claude/ ai-agents/` and confirm no *prescribing* document was
   missed. Closed-task artifacts stay untouched.
7. **No forbidden writes.** `git status --porcelain ai-agents/wiki-vault/` is empty; nothing was
   committed or pushed.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Related:** [`0310`](../0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work/brief.md)
  (adjacent decision, overlaps option A — see *Conflicts and adjacencies*);
  [`0314`](../0314-fix-the-deletion-filter-blind-spot-in-fkit-record-decision/brief.md) (the
  independently-shippable half of the same defect cluster).
- **⚠️ `0314` is deliberately NOT a dependency in either direction.** It fixes a bug in the *current*
  filter and is correct regardless of which option wins here. **But both tasks edit the same block of
  `claude/skills/fkit-record-decision/SKILL.md`** — whichever runs second must re-read the block
  rather than apply its brief verbatim, and if this task rewrites the block it **must preserve or
  restate `0314`'s fix**.
- **Citations are file + quoted phrase, never `:NNN`** — the targets here are living documents and
  their line anchors decay (the `0143` citation-form residual).
- **⚠️ Filed UNRANKED by a SPAWNED producer with no owner channel — this row APPENDS and renumbers
  nothing, and was deliberately NOT added to Sprint 6**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- **On merit:** this is the stronger of the two rows filed here, because it is a **soundness** problem
  in a check the team reports as passing. Its cost is that it needs an owner decision before any code
  moves, which is exactly why it cannot simply be pulled into a running sprint.
