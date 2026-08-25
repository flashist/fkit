# Refuse init's destructive `.claude/` refresh through a symlink — and correct the now-false "ONLY DESTRUCTIVE OPERATION" claim

## ID
0327

## Sprint
Sprint 6

## Priority
Sprint 6 P11

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

⚠️ **THIS IS A LIVE, MEASURED, DESTRUCTIVE ESCAPE. It DELETES a user's files OUTSIDE the project, unprompted, unannounced, and exits 0.**
It is **more serious than the defect `0046` fixes** — `0046`'s §4 defect *creates* a file (and in one
shape overwrites one); **this one deletes**.

**⭐ OWNER RULING, 2026-08-23.** Given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop`, on `0046`'s planning audit question Q1, and relayed to a spawned
`fkit-producer` with no owner channel ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text:** **"File as its own task, high priority (Recommended)"**.
The ruling has two halves and **both are required deliverables** — the guard, *and* the correction of
`:577`'s false claim. ⛔ **The owner ruled `0046` REPORT-ONLY on this finding** — it is not fixed there.

⚠️ **"high priority" is the owner's own wording and it is recorded here deliberately. It is NOT a rank.**
The owner ruled the severity, **not a board or a position**. This brief is filed on the **Backlog**
board with `## Priority` `Unscheduled` per that board's unranked-by-design rule, because a spawned
producer never ranks ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
`/fkit-task-brief` step 5). ⛔ **The ranking is an OPEN QUESTION returned to the owner, not a decision
taken here** — and given the severity below, it is the one thing about this row most worth answering.

> ✅ **DATED CORRECTION 2026-08-24 — THAT OPEN QUESTION IS ANSWERED. The paragraph above is left
> byte-identical as the record of how this row was filed, and it no longer describes the current
> state.** ⛔ **What changed is the placement, not a single claim about the defect.**
>
> **OWNER RULING, 2026-08-24**, given live via `AskUserQuestion` in an `fkit lead` session driving
> `/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
> **The option label is the verbatim text:** **"Pull onto Sprint 6, right after 0046 (Recommended)"**.
> The chosen-option description, verbatim: *"The producer's pick. It's the most severe of the four and
> the only one that destroys data; a flat unranked board is how it gets lost. 0046 is P10 and in
> progress — 0327 soft-follows it, so landing right after is the cheap window while `path_contained` is
> fresh. I'd place it at P11, shifting P11-P20 down one."*
>
> **Current state:** `## Sprint` `Sprint 6`, `## Priority` `Sprint 6 P11`, immediately below `0046`.
> The Backlog board's row for this task now reads `➡️ Moved to [Sprint 6](sprint-6.md) — priority P11`
> and was **not deleted**. ⛔ **`## Status` was NOT changed and is still `🔲 Backlog` — ranked is not
> started.**
>
> ⚠️ **The placement renumbered NO closed row, re-verified firsthand before the insertion** — Sprint 6's
> `P1`–`P9` are all `✅ Done` and contiguous at the top and `P10` is `🔄 In progress`, so an insertion
> below them moved only open rows ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
> §*"Residual risks / re-raise only if"*). The full derivation is on the Sprint 6 row.

### The defect

`claude/fkit-claude-init.sh` §3 (`:485-492` **at `HEAD` = `05fd9d0`**) refreshes the fkit-managed agents
and skills with **no `[ -L ]` check on any path component**:

```
mkdir -p "$dest/.claude/agents" "$dest/.claude/skills"      # :485
rm -f "$dest/.claude/agents/fkit-"*.md                       # :486
cp "$here/agents/fkit-"*.md "$dest/.claude/agents/"          # :487
for d in "$dest/.claude/skills/fkit-"*/; do                  # :489
  [ -d "$d" ] && rm -rf "$d"                                 # :490
done                                                          # :491
cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"          # :492
```

⚠️ **Line numbers above are from `git show HEAD:claude/fkit-claude-init.sh` at commit `05fd9d0`, NOT
from the working tree** — a coder was concurrently editing that file for `0046` when this brief was
written, so worktree numbers differ. **Re-derive every line number at plan time; resolve by the code,
never by the number.**

> ✅ **DATED CORRECTION 2026-08-24 — a coordinate in this paragraph was known-wrong and is REPAIRED,
> not annotated** ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md):
> *"A coordinate already known to be wrong is repaired, not annotated."*). The sentence above used to
> read *"(the `:577` claim below, for instance, sits at `:619` in that dirty tree)"*. **`:619` was
> already stale when it was written and the clause is deleted rather than re-numbered.** ⛔ **No number
> replaces it on purpose** — see the anchor block under §*"The second required deliverable"* below.
> **Measured firsthand 2026-08-24:** the claim sits at **`:637`** in the working tree and at **`:577`**
> at `HEAD`, and **it will move again** — `0046`'s hoist of `path_contained` to the top of the file is
> what moved it, and it is still moving.

### Reproduced independently by the filing producer, 2026-08-23 — not taken on report

Method: `git archive HEAD claude` into a clean scratch install share (`shasum` of the extracted
`fkit-claude-init.sh` matched `git show HEAD:` exactly — `a8e00a69effda2fd745f2e050d10ce14af61dde1`);
a throwaway project whose `.claude` is a symlink to an outside directory pre-seeded with **two** user
files; then `bash <share>/claude/fkit-claude-init.sh <proj> </dev/null`.

**Measured result — init printed `• refreshed 7 agents → .claude/agents/, 26 skills → .claude/skills/`,
ran to the end, and EXITED 0:**

| Outside the project, before | After |
|---|---|
| `agents/fkit-mine.md` (user's own agent) | ⛔ **DELETED** |
| `skills/fkit-myskill/` (user's own skill dir) | ⛔ **DELETED** (`rm -rf`) |
| — | 7 fkit agent files written at the link target |
| — | 26 fkit skill directories written at the link target |

⭐ **This is BROADER than the audit reported.** `0046`'s plan §6 recorded the `agents/fkit-mine.md`
deletion. **The `rm -rf` of a user's `skills/fkit-*/` DIRECTORY reproduces too** (`:489-491`) — a
recursive delete of a whole tree, off-project, silent. **Both sites need the guard, not just `:486`.**

⚠️ **No warning was printed. The project directory itself was left with no real `.claude/` at all** —
every fkit-managed file went out through the link.

### ⛔ The second required deliverable: the "ONLY DESTRUCTIVE OPERATION" comment is demonstrably false

> ⭐ **THE ANCHOR FOR THIS DELIVERABLE IS THE QUOTED STRING, NOT A LINE NUMBER. Find it by searching for
> the string; never by going to a number.** ✅ **Dated correction 2026-08-24** — this section, its
> heading and the *"What to build"* and *"Verification steps"* bullets below all used to name the target
> as **`:577`**, and that coordinate is **live-drifting**:
>
> | Measured | Where the claim sits |
> |---|---|
> | `HEAD` (`05fd9d0`), 2026-08-23 and re-checked 2026-08-24 | `:577` |
> | working tree, 2026-08-24 | **`:637`** |
>
> ⚠️ **The 60-line shift is `0046`'s doing** — it hoists and renames `orphan_contained()` to
> `path_contained` at the top of the file — **and the number will move again** before this task is
> planned. ⛔ **Do not re-pin it.** Locate the deliverable by this exact string, which is what the fix
> must make true or replace:
>
> ```
> # ⚠️ THIS IS THE ONLY DESTRUCTIVE OPERATION IN FKIT. Read the whole comment before touching it.
> ```
>
> Rule: [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
> — *"Pair every `path:NNN` with a quoted fragment or the heading it sits under."* Every surviving
> `:577` in this brief is a **claim about the `HEAD` revision that was read**, which that page rules
> safe; it is **not a forwarding address**, and a plan that treats it as one has misread this brief.

`claude/fkit-claude-init.sh` — the comment heading §6, quoted above and at `:577` in the `HEAD`
revision this brief was written against — reads, verbatim:

> `# ⚠️ THIS IS THE ONLY DESTRUCTIVE OPERATION IN FKIT. Read the whole comment before touching it.`

**Confirmed present on disk at `HEAD` by the filing producer, and re-confirmed present in the working
tree on 2026-08-24 by the producer that ranked this row — the claim is still live and still false.**
It heads §6, the Omnigent orphan
cleanup. **It is false while §3 exists** — §3 performs an `rm -f` *and* an `rm -rf`, and §6's careful
apparatus (per-path announcement, a reference-count gate, a containment walk) has **no counterpart in
§3 at all**. ⭐ **This is not a comment nit. It is the sentence that tells the next reader where the
danger in this file is, and it points them at the wrong section** — which is plausibly *why* §3 never
got the doctrine that §1, §4 and §6 all have.

## What to build

- **Guard §3's deletions and writes with the containment check**, refusing rather than writing or
  deleting through a symlinked component. Cover **all** of: `mkdir -p` (`:485`), the agents `rm -f`
  (`:486`), the agents `cp` (`:487`), the skills `rm -rf` loop (`:489-491`), and the skills `cp -R`
  (`:492`). ⛔ **The `rm -rf` loop is the one that must not be missed** — it is the recursive one.
- **Correct the `⚠️ THIS IS THE ONLY DESTRUCTIVE OPERATION IN FKIT.` comment** — ⭐ **found by that
  string, not by a line number** (`:577` at `HEAD`, `:637` in the working tree on 2026-08-24, and
  moving; see the anchor block above). The claim must stop being false. ⛔ **Do not simply delete the line** — decide and
  state whether §3 becomes a *second* announced destructive operation (so the comment enumerates both)
  or whether §3's deletions are re-characterised; **say which, and why, in the worklog.** The
  surrounding comment explains that §6's gate *counts references* and that naming a path in prose is
  itself a reference — ⚠️ **read that whole comment before editing near it; it warns you for a reason.**
- **Refuse-and-report, non-fatal**, consistent with §1's refusal, `merge_rules`' four refusals, §6's
  per-path refusals, and `0088`'s bar. A refused refresh warns and init carries on. ⚠️ **Note the
  tension and resolve it explicitly: unlike the intake, the agent refresh is NOT optional-by-design** —
  if it is skipped, the session may have stale or absent agents. **Decide whether "non-fatal" here means
  "warn and continue" or "warn, continue, and set init's exit status", and say so.** `claude/fkit-claude.sh:387-392`
  already refuses to launch when setup failed *and* no fkit agent is on disk — **check how your choice
  interacts with that** rather than assuming.
- **Message consistent with the existing refusals** — same shape, same tone, names the actual cause.

## Verification steps

- **The reproducer is closed.** With `.claude` symlinked to an outside directory holding
  `agents/fkit-mine.md` **and** `skills/fkit-myskill/`, run init and confirm it **refuses and reports**.
  ⛔ **Both user paths must still exist afterwards.** The pre-fix behaviour — both deleted, exit 0 — must
  not occur.
- ⚠️ **Assert the outside tree is UNCHANGED, explicitly, with a manifest taken before and after.**
  ⛔ **`test/harness.mjs`'s `manifest()` only walks the project and CANNOT see an escape** — `0046`'s
  brief flags this and it applies with full force here: a test relying on it alone **passes while the
  bug is live**. A test that does not assert on the outside tree does not test this defect.
- **The dangling-link case:** `.claude` a *broken* symlink. `-e` is false for one, so an existence check
  writes through; confirm the `-L` walk refuses.
- **A symlinked component deeper than the leaf** — e.g. `.claude/skills` a link while `.claude` is real —
  is refused too.
- **The ordinary case is untouched:** a normal `.claude/` gets its 7 agents and 26 skills, a user's own
  non-`fkit-` agents and skills are still never touched, and the refresh count line still prints.
- **⛔ The comment's correction is verified by reading the section, not by grepping for the string** —
  the test is whether the file now tells the truth about where its destructive operations are.
  ⚠️ **Locate the section by the quoted string; do not go to `:577` or `:637`, both of which are
  snapshots of a moving target** (anchor block above).
- **No regression at the other guarded sites** — §1 convergence, `install_root_file`, `merge_rules`,
  §6 cleanup, and whatever `0046` landed at §4, all behave exactly as before.
- **`npm test` green, with the count stated.**

## Notes

- **Owner: fkit-coder** — a production init (`claude/fkit-claude-init.sh`) change.
- **On merit:** as ranked — the owner placed this row itself, immediately below `0046`, so there is no
  divergence between where it sits and where it belongs. (Required form on a ranked board:
  [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
  §*"The merit statement"*. ⚠️ **Added 2026-08-24, in the act that ranked this row** — it carried none
  while it was on the unranked Backlog board, where none is required.)
- **Depends on:** nothing.
- ⚠️ **SOFT-FOLLOWS `0046`, and this is a SEQUENCING CONVENIENCE, NOT A CORRECTNESS GATE.** `0046`
  hoists and renames `orphan_contained()` (at `HEAD` it is defined at `:669`, below its would-be
  callers) to `path_contained "<path>" <verb>` — a chain-walking `[ -L ]` guard. **With that in place
  this task is the same call applied twice more.** ⛔ **If `0046` has not landed, this task writes the
  guard itself and `0046` adopts it** — exactly the arrangement `0046`'s own brief records with `0072`.
  **Do not convert this into a hard block.**
- ⚠️ **`0046`'s brief cites `orphan_contained()` at `:665`; at `HEAD` it is at `:669`.** Minor drift,
  recorded so the plan re-derives rather than trusting either number.
- **Relates to `0328`** (init's two `mkdir -p` calls abort init under `set -euo pipefail`) and **`0329`**
  (§5 appends through a symlinked `.gitignore`) — the other two findings from the same `0046` audit,
  filed under the same 2026-08-23 owner exchange. ⛔ **All three are distinct sites with distinct fixes;
  none closes another.** `0328` overlaps this task at exactly one line — `:485`'s `mkdir -p` — and the
  two treat it for **different reasons**: this task stops it traversing a **symlink**, `0328` stops it
  **killing init** for reasons a symlink guard cannot cover. **Whichever lands second must not assume
  the other's fix covers its case.**
- **Relates to `0330`** — the launcher writes lockdown state through a symlinked `.fkit`. Same doctrine,
  **different file** (`claude/fkit-claude.sh`), and **not fixable by this task's helper**: the launcher
  is a separate script that does not source init, so it cannot call `path_contained` without a new
  shared seam. Filed separately for that reason.
- ⛔ **Distinct from `0045`** (`gate-read-side-symlink-hazard-in-init`), and the overlap was **measured,
  not assumed**. `0045` is the **read** side, under **`ai-agents/`**, and is **latent** — its own brief
  says *"Nothing does this today — the hazard is latent, not live"*. This task is the **write/delete**
  side, under **`.claude/`**, and is **live and reproduced today**. **Neither closes the other.**
- **Risk: the fix is low-risk; NOT fixing it is not.** The trigger requires a symlinked `.claude/` — not
  an ordinary state — but the consequence when it fires is **unrecoverable deletion of user files
  outside the project**, with no announcement and a success exit code. There is no rollback.
- ⚠️ **Residual this task cannot close:** the TOCTOU window between the `-L` check and the write is not
  closable in POSIX shell — it needs `openat()`-class primitives. §6 already records exactly this at
  `:610-611` (at `HEAD`). **The new guard inherits that residual; it does not widen it.** ⛔ **A worklog
  claiming the symlink hazard is "closed" without naming this residual has over-claimed.**
- ⛔ **Out of scope:** §5's `.gitignore` question (`0329` — and it is a **product decision**, not a
  refactor), the `mkdir -p` fatality (`0328`), the launcher's `.fkit` writes (`0330`), `0046`'s §4 fix,
  any `ai-agents/wiki-vault/` write ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  any re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and any task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **Evidence sources:** `ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/plan.md`
  §6 (finding **F1**) and its *"Owner's answers to §8"* table (the Q1 ruling and its verbatim label).
  The reproduction above is the **filing producer's own**, executed 2026-08-23 against `HEAD` = `05fd9d0`
  in a scratch directory outside the repo; **the repo working tree was not modified by it.**
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
  **appended, unranked; nothing was re-ranked by this filing and no `## Status` was changed anywhere.**
  > ✅ **DATED CORRECTION 2026-08-24 — the line above describes the FILING (2026-08-23) and is left
  > byte-identical; it is not a description of this brief today.** This row was **ranked onto Sprint 6
  > at `P11` on 2026-08-24 by the owner ruling recorded in §Context** — relayed to a spawned producer
  > that likewise had no owner channel, so the rank is the **owner's**, not the producer's. ⛔ **Still
  > true, and unchanged by that act: no `## Status` was changed anywhere, and no closed row was
  > renumbered.**
