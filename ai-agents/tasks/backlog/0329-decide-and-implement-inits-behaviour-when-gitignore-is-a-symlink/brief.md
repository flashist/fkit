# Decide — and then implement — what init does when `.gitignore` is a symlink

## ID
0329

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

⛔ **THIS TASK OPENS WITH A PRODUCT DECISION THAT IS NOT MADE. Do not start by writing a guard.**
The owner ruled this filed **precisely so the decision could be taken here, with the full picture** —
not pre-empted in `0046` and not pre-decided by this brief. **The brief's job is to present the
decision cleanly; the first act of the task is to put it to the owner.**

**⭐ OWNER RULING, 2026-08-23.** Given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop`, on `0046`'s planning audit question Q2, and relayed to a spawned
`fkit-producer` with no owner channel ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text:** **"File it as its own task (Recommended)"**.
The ruling's own words on that option: *"it needs no answer to ship `0046`, and the task can carry both
options for you to decide there with the full picture."*
⚠️ **The owner ruled WHERE the decision happens. The owner did NOT rule WHICH option wins** — that is
still open, and it is this task's first gate.

### The finding

`claude/fkit-claude-init.sh` §5 appends fkit's ignore blocks to `$dest/.gitignore` with **no `[ -L ]`
check** (`HEAD`):

```
gi="$dest/.gitignore"                                        # :562
add_ignore() {  # add_ignore <pattern> <comment>             # :563
  if [ -f "$gi" ] && grep -qxF "$1" "$gi"; then
    echo "• .gitignore already ignores $1"
  else
    printf '\n# %s\n%s\n' "$2" "$1" >> "$gi"
    echo "• added $1 to .gitignore"
  fi
}
add_ignore '.fkit/' …                                        # :571
add_ignore '.claude/agents/fkit-*.md' …                      # :572
add_ignore '.claude/skills/fkit-*/' …                        # :573
```

⚠️ **`[ -f ]` and `>>` both DEREFERENCE.** With `.gitignore` a symlink, all three blocks are appended
to the link target.

**`0046`'s brief predicted this exact site and deliberately reserved it**, in its own words: *"at least
one plausible additional site (§5 appending to `$dest/.gitignore`) may be a case where a symlink is
**legitimate user setup**, and refusing it would break a real workflow. That is a **product decision,
not a refactor** — it comes back to the owner."*

### Reproduced independently by the filing producer, 2026-08-23 — not taken on report

Method as for `0327`/`0328`: clean `git archive HEAD claude` install share (extracted script `shasum`
`a8e00a69effda2fd745f2e050d10ce14af61dde1`), throwaway project, `.gitignore` symlinked to an outside
`shared.gitignore` holding user content, `</dev/null`.

**Measured — init exited `0` and appended all three blocks through the link to the outside file:**

| Outside `shared.gitignore` | |
|---|---|
| Before | `# shared gitignore, user-owned` / `node_modules/` |
| After | the same **two lines intact**, plus fkit's **three** comment+pattern blocks appended |

⭐ **Two properties measured here matter to the decision and are the reason this is genuinely
arguable — neither was in the original audit note:**

1. ✅ **It is strictly APPEND-ONLY. Nothing was overwritten, truncated or deleted.** The user's existing
   content survived byte-for-byte. ⛔ **This is a materially different class from `0327`'s §3, which
   DELETES through a symlink.** Do not reason about the two the same way.
2. ✅ **Idempotency survives the link.** A **second** init run printed `• .gitignore already ignores
   .fkit/` (and the other two) and the outside file stayed at **11 lines** — `[ -f ]` and `grep -qxF`
   follow the link, so the already-present check works through it. **Re-running does not accumulate
   duplicates.**

⚠️ **The symlink still points OUT of the project**, so the escape is real: fkit writes to a path outside
the directory it was pointed at. **The two properties above bound the damage; they do not make it
in-project.**

## What to build

### ⛔ Step 1 — put the decision to the owner. Nothing else starts first.

**Both options, with their honest costs. Neither is recommended by this brief.**

**(a) Refuse, like every other site.** Guard `.gitignore` with the same chain-walking `[ -L ]` check
used at §1, §4 (`0046`) and §6, and refuse-and-report rather than following the link.
- ✅ **Consistency.** No fkit write anywhere goes through a symlink; the doctrine stated in the file's
  own comment (~`:159-172`, *"`[ -L ]` FIRST, ALWAYS… -L is the one test that does not lie"*) becomes
  true without exception, and the next audit has nothing to re-flag.
- ✅ One rule to explain, one rule to test.
- ⛔ **May break a real workflow.** A user deliberately symlinking `.gitignore` to a shared or
  dotfiles-managed file gets a refusal and **does not get fkit's ignore blocks** — so `.fkit/` and the
  fkit-managed agent and skill copies show up as untracked noise in every `git status`, forever, with
  no obvious remedy.
- ⛔ Refuses a case measured to be **non-destructive and idempotent** — a stricter answer than the
  evidence alone demands.

**(b) Allow it deliberately, and record why in the code.** Leave the behaviour as it is, and write the
reasoning into `:562`'s comment so it reads as a decision rather than an oversight.
- ✅ **Respects a real workflow**, and the two measured properties above are the argument: append-only,
  idempotent, nothing destroyed.
- ✅ Zero behaviour change, zero regression risk.
- ⛔ **Leaves one site inconsistent with the doctrine** — and the doctrine's value is that it is
  exceptionless. An exception is a thing every future reader and every future audit must re-learn.
- ⛔ **It is still an out-of-project write.** The comment makes it *intended*, not *contained*.
- ⚠️ **The comment is the entire deliverable**, so it must be strong enough to stop the next audit
  re-filing this. A weak comment gets this task re-opened.

⚠️ **A third shape exists and the plan should name it rather than let it be discovered late:
allow-but-announce** — follow the link, and print one line saying fkit wrote to a path outside the
project. **This brief does not advocate it; it is flagged so the owner is not offered a false binary.**

### Step 2 — implement whichever option the owner picks, and only that one.

⛔ **Do not implement both, and do not implement (a) "because it matches the others" if the owner picks
(b).** ⚠️ **Under (b) the diff is a comment and the verification is a regression check — that is a
complete, correct outcome for this task, not an under-delivery.** Say so in the worklog.

## Verification steps

**Common to both options:**
- **The ordinary case is untouched:** a normal, non-symlink `.gitignore` gets all three blocks; an
  absent one is created; a second run prints `• .gitignore already ignores …` three times and appends
  nothing.
- **`npm test` green, with the count stated.**
- **No regression at the other guarded sites** — §1, §4 and §6 behave exactly as before.

**If (a) is chosen:**
- With `.gitignore` symlinked outside the project, init **refuses and reports**, and ⚠️ **the outside
  file is asserted UNCHANGED via a before/after manifest.** ⛔ **`test/harness.mjs`'s `manifest()` walks
  only the project and CANNOT see an escape** — a test relying on it alone passes while the behaviour
  is live.
- **The dangling-link case** (`.gitignore` a broken symlink): `-e`/`-f` are false for one, so an
  existence check writes through and **creates the target**; confirm the `-L` walk refuses.
- **A symlinked parent component** is refused too — the walk covers the chain, not just the leaf.
- **Non-fatal**, per `0088`'s bar and `0328`: a refused gitignore warns and init still completes §6 and
  the summary.
- ⚠️ **State the consequence explicitly in the worklog** — the user now has an un-ignored `.fkit/` and
  un-ignored fkit-managed copies, and **say what, if anything, tells them so.**

**If (b) is chosen:**
- **Both measured properties are pinned as tests, not left as prose** — append-only (existing outside
  content survives byte-for-byte) and idempotent (a second run adds nothing). ⭐ **These are the
  premises the decision rests on; if they ever stop holding, the decision is void and something must
  go red.**
- **The comment is present and states the reasoning**, not merely the behaviour.

## Notes

- **Owner: fkit-coder** — a production init (`claude/fkit-claude-init.sh`) change. ⚠️ **But step 1 is an
  owner decision, and it needs an owner-present session.** ⛔ **A spawned agent must NOT settle it**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md));
  it returns the question and stops.
- **Depends on:** nothing. ⚠️ **It is BLOCKED ON A DECISION, not on code** — that is a gate inside the
  task, deliberately not declared as a dependency and ⛔ **not a reason to set `🚧 Blocked` on the row
  before the task is picked up.**
- ⚠️ **Line numbers are from `git show HEAD:claude/fkit-claude-init.sh` at commit `05fd9d0`, NOT the
  working tree** — a coder was concurrently editing that file for `0046` when this brief was written.
  **Re-derive at plan time; resolve by the code, never by the number.**
- ⚠️ **Under option (a) this soft-follows `0046`**, which hoists `orphan_contained()` (at `HEAD`,
  `:669`) into a reusable `path_contained "<path>" <verb>`. ⛔ **A sequencing convenience, NOT a
  correctness gate** — if `0046` has not landed, this task writes the guard itself. **Under option (b)
  there is no relationship at all.**
- **Relates to `0327`** (§3's destructive symlink escape — ⛔ **that one DELETES; this one only appends,
  and the two must not be argued as one case**) and **`0328`** (the `mkdir -p` aborts). Same 2026-08-23
  audit, three separate owner rulings, **three distinct sites; none closes another.**
- ⛔ **Distinct from `0045`, measured not assumed.** `0045` is the **read** side under **`ai-agents/`**
  and is **latent** by its own brief's words; this is a **write** through `.gitignore` at the project
  root, **live and reproduced today**. **Neither closes the other.**
- **Risk: low either way.** Option (b) is zero-risk by construction. Option (a)'s risk is not code — it
  is the workflow it refuses, which is the whole reason the decision is the owner's.
- ⚠️ **Residual under option (a):** the TOCTOU window between the `-L` check and the append is not
  closable in POSIX shell — see `:610-611` (at `HEAD`), where §6 already records it. **The guard
  inherits that residual; it does not widen it.**
- ⛔ **Out of scope:** §3 (`0327`), the `mkdir -p` fatality (`0328`), the launcher's `.fkit` writes
  (`0330`), `0046`'s §4 fix, any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  any re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and any task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **Evidence sources:** `ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/plan.md`
  §6 (finding **F2**) and its *"Owner's answers to §8"* table (the Q2 ruling and its verbatim label);
  `0046`'s brief, `## Notes` → *"🔒 Scope limit — deliberate"*, which reserved this site. The
  reproduction and the two additional measured properties are the **filing producer's own**, executed
  2026-08-23 against `HEAD` = `05fd9d0` in a scratch directory outside the repo; **the repo working
  tree was not modified by them.**
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
  **appended, unranked; nothing was re-ranked by this filing and no `## Status` was changed anywhere.**
