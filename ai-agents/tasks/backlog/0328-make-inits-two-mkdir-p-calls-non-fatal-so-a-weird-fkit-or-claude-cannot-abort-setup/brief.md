# Make init's two `mkdir -p` calls non-fatal, so a weird `.fkit` or `.claude` cannot abort setup mid-way

## ID
0328

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**⭐ OWNER RULING, 2026-08-23.** Given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop`, on `0046`'s planning audit question Q3, and relayed to a spawned
`fkit-producer` with no owner channel ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text:** **"File separately (Recommended)"**.
⛔ **Explicitly NOT included in `0046`** — the ruling's own words on that option: *"The `-L` guard
already fixes the shape `0046` is about; this widens a diff the brief deliberately fenced."*

### The defect

`claude/fkit-claude-init.sh` runs under `set -euo pipefail` (`:21`). Two bare `mkdir -p` calls sit
unguarded on the main path:

| Line (`HEAD`) | Call | Section |
|---|---|---|
| `:485` | `mkdir -p "$dest/.claude/agents" "$dest/.claude/skills"` | §3 agents/skills refresh |
| `:500` | `mkdir -p "$dest/.fkit"` | §4 first-run intake |

**When either fails, init dies on the spot.** §5 (gitignore), §6 (the orphan cleanup) and the closing
summary **never run**.

⭐ **THE ARGUMENT IS THE CONTRAST, and it is what makes this a defect rather than a preference:
everything else in init is deliberately non-fatal.** `:167`'s subtree refusal, `merge_rules`' four
refusals, and §6's per-path refusals all warn and carry on. `0088`
(`stop-init-failure-bricking-the-launcher`) set that bar deliberately, and its comment in the launcher
states the principle in its own words: *"A user must always be able to reach their agents, even when
fkit cannot finish setting the project up."* **These two `mkdir`s are the exception to a rule the rest
of the file follows.**

⚠️ **The failure causes are NOT all symlink-shaped, which is exactly why an `-L` guard does not close
this.** Unwritable parent, `ENOSPC`, and `.fkit`/`.claude` existing as the **wrong type** all abort
init through code no symlink check ever reaches.

### Reproduced independently by the filing producer, 2026-08-23 — not taken on report

Method as for `0327`: a clean `git archive HEAD claude` install share (extracted script `shasum`
`a8e00a69effda2fd745f2e050d10ce14af61dde1`, identical to `git show HEAD:`), throwaway projects,
`</dev/null`. **All three shapes measured, all exit `1`:**

| Shape | Measured stderr | Exit | Damage |
|---|---|---|---|
| `.fkit` a **dangling symlink** | `mkdir: …/proj3/.fkit: No such file or directory` | **1** | no `.gitignore` written — **§5, §6 and the summary never ran** |
| `.fkit` a **regular file** | `mkdir: …/proj4/.fkit: File exists` | **1** | same |
| `.claude` a **regular file** | `mkdir: …/proj5/.claude: Not a directory` (twice) | **1** | dies even earlier — **no agents, no skills, no `.gitignore`** |

⚠️ **`0046` fixes the SYMLINK shape of the `.fkit` abort, not the general shape.** ⛔ **Do not close
this as already-done once `0046` lands** — rows 2 and 3 of the table above have no symlink in them at
all, and row 3 is not even `0046`'s section.

### ⛔ ONE PREMISE IN THE RELAY WAS WRONG, AND IT IS CORRECTED HERE RATHER THAN CARRIED

The finding was relayed to this producer with the claim that *"the user silently loses setup on every
launch and is never told"*. ⛔ **That half is FALSE, and it was disproved by execution, not by
reading.** Measured end-to-end by running `claude/fkit-claude.sh coder` with a stubbed `claude` binary
on a project with a dangling `.fkit` and agents already installed:

```
mkdir: …/proj6/.fkit: No such file or directory

⚠ fkit could not finish setting up this project.
  Starting the session anyway — but fkit-managed files may be missing or stale
  (agents, skills, or the ai-agents/ tree). Fix the cause above, then re-run: fkit
```

**The launcher's `0088` guard works.** `claude/fkit-claude.sh:355-361` captures `setup_rc`, and
`:373-377` prints a loud three-line warning on any non-zero status other than `3`. ⭐ **The user IS
told.** Two further corrections to the relayed framing, both measured:

1. **"Starts the session anyway" is not always true.** In the `.claude`-is-a-regular-file shape no
   fkit agent ever reaches disk, and `:387-392` then **refuses to launch at all** and exits `1` —
   deliberately, so an unroled session cannot fail open past the ADR-010 lockdown.
2. 🆕 **A NEW measured finding, adjacent and not in the original audit: the launcher MISDIAGNOSES this
   case.** With a dangling `.fkit`, `:331`'s `mkdir -p "$proj/.fkit/settings"` fails, and `:336` prints
   `⚠ <proj> is not writable — passing the role lockdown inline instead of via .fkit/.` ⛔ **The project
   was fully writable.** The message names the wrong cause and sends the user to check permissions
   instead of the broken symlink. ✅ **The lockdown itself still applied, inline — it failed SAFE, not
   open.** ⚠️ **This line is in the launcher, not init; it is carried on `0330`, not here.** Recorded
   here because it is what a reader of this task will see on screen and otherwise misread.

⭐ **So the defect is real and the damage is real — silent-and-untold is not the reason.** The reason is
that **a recoverable, announced-elsewhere condition takes down three later sections that had nothing to
do with it**, against a bar the rest of the file meets. **State it that way in the plan; do not restate
the "silent" framing.**

## What to build

- **Make both `mkdir -p` calls non-fatal**, so a failure at `:485` or `:500` warns and lets init
  continue to §5, §6 and the summary — matching `:167`, `merge_rules` and §6.
- **Warn with the real cause**, naming the path and what was wrong with it. ⛔ **Not a bare
  `mkdir:` line leaking from the shell** — the measured stderr above is what the user gets today.
- **Decide and STATE what init's exit status becomes** when a section is skipped this way. ⚠️ **This is
  the load-bearing decision in the task, not a detail.** `claude/fkit-claude.sh:363-367` reads init's
  status as a three-way signal — `0` success, `3` "set up, but refused to touch `ai-agents/`", anything
  else a real failure — and its comment warns that *"the two copies drifted the first time we tried"*
  re-testing the condition in the launcher instead. **Choosing `0` here silences a warning the user
  currently gets; choosing non-zero keeps it but must not brick the launch.** Argue the choice; do not
  pick by keystroke.
- **Skip cleanly, do not half-write.** If `.fkit` could not be created, §4 must not then attempt its
  `cat >` / `chmod +x`; likewise §3 must not `cp` into a directory that does not exist.

## Verification steps

- **All three measured shapes are covered**, each asserted separately: `.fkit` dangling symlink,
  `.fkit` a regular file, `.claude` a regular file. For each: **init reaches the end, `.gitignore` is
  written, §6 runs, and the summary prints.**
- **The user is told, with the real cause named** — assert on the warning text, and assert the raw
  `mkdir:` shell error is no longer the only thing they see.
- **The launcher's contract still holds** — run `claude/fkit-claude.sh` against each shape and assert
  the behaviour matches whatever exit-status decision the plan made. ⚠️ **Include the
  `.claude`-is-a-regular-file shape**, where `:387-392` currently refuses to launch; **say whether that
  refusal survives, and it should — an unroled session fails OPEN on the ADR-010 lockdown.**
- **The ordinary case is untouched:** a normal project gets its agents, skills, intake, gitignore,
  cleanup and summary, and init still exits `0`.
- **The `ai-agents/`-refused path still returns `3`**, not folded into the new branch.
- **`npm test` green, with the count stated.**
- ⚠️ **Check whether `test/prove-red.sh` reaches this file before claiming mutation coverage.** `0046`'s
  plan records that its only reference to `fkit-claude-init.sh` is a **comment** at `:12` — so a new
  guard here is plausibly **unmutated**. ⛔ **If it is, say so plainly rather than letting it pass
  unremarked**; `0037` (`extend-prove-red-to-reach-init`) is the open task for that seam.

## Notes

- **Owner: fkit-coder** — a production init (`claude/fkit-claude-init.sh`) change.
- **Depends on:** nothing.
- ⚠️ **Line numbers are from `git show HEAD:claude/fkit-claude-init.sh` at commit `05fd9d0`, NOT the
  working tree** — a coder was concurrently editing that file for `0046` when this brief was written.
  **Re-derive at plan time; resolve by the code, never by the number.**
- **Overlaps `0327` at exactly one line — `:485` — and the two treat it for different reasons.** `0327`
  stops it traversing a **symlink**; this task stops it **killing init** for causes a symlink guard
  cannot see (wrong type, unwritable parent, `ENOSPC`). ⛔ **Whichever lands second must not assume the
  other covered its case.** Both touching `:485` is a **merge-order note, not a dependency**.
- **Relates to `0046`** (fixes the symlink shape of the `:500` abort only), **`0329`** (§5's
  `.gitignore` product decision) and **`0330`** (the launcher's `.fkit` writes, which carries the
  misdiagnosis finding above). All four come from the same 2026-08-23 audit of one file.
- ⛔ **Distinct from `0045`, measured not assumed.** `0045` is the **read** side under **`ai-agents/`**
  and is **latent** by its own brief's words; this is a **write-path abort** under `.fkit`/`.claude`,
  **live and reproduced today**. **Neither closes the other.**
- **Adjacent to `0088`** (`stop-init-failure-bricking-the-launcher`) — this task closes the gap on
  init's own side of the bar `0088` set on the launcher's side. **It does not re-open `0088`.**
- **Risk: low.** Non-destructive by nature — it *removes* an abort. The real risk is the exit-status
  decision, which changes a signal the launcher already reads; **that is where review attention
  belongs.**
- ⛔ **Out of scope:** §3's destructive symlink escape (`0327`), §5's `.gitignore` question (`0329`),
  the launcher's `.fkit` writes and its false "not writable" diagnosis (`0330`), `0046`'s §4 fix,
  extending `prove-red.sh` (`0037`), any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  any re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and any task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **Evidence sources:** `ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/plan.md`
  §6 (finding **F3**) and its *"Owner's answers to §8"* table (the Q3 ruling and its verbatim label).
  The three-shape reproduction, the end-to-end launcher run, and the correction of the "silent" premise
  are the **filing producer's own measurements**, executed 2026-08-23 against `HEAD` = `05fd9d0` in
  scratch directories outside the repo; **the repo working tree was not modified by them.**
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
  **appended, unranked; nothing was re-ranked by this filing and no `## Status` was changed anywhere.**
