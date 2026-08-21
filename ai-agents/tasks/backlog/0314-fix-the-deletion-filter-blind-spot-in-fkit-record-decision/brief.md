# Fix the `^---` deletion-filter blind spot in `/fkit-record-decision`'s append proof

## ID
0314

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner-ruled filed 2026-08-16**, live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop` — **verbatim option label: `"File a task for it (Recommended)"`.** The ruling
covered the append-proof finding as a whole; this brief is the **independently shippable half** of it,
split out by the filing producer (see *Notes*).

### Provenance

Surfaced by task
[`0177`](../../done/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md)'s **round-2
re-verification**, 2026-08-16, alongside
[`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md).
⭐ **The residual is already acknowledged in the repo and has never had a task.**
[`0311`](../0311-specify-the-corrections-bullet-own-date-and-metadata-position/brief.md)'s board row
records it verbatim: *"the corrected guard carries its own **known residual**: it misses a deleted
line whose text begins with `---`"*.

### The defect

`claude/skills/fkit-record-decision/SKILL.md` prescribes, in its *"Append-only, proved by diff — not
by eye"* block:

> `git diff -U0 -- <adr-file> | grep '^-' | grep -v '^---' # expect no output`

⚠️ **The `grep -v '^---'` is intended to drop only the diff's own `--- a/<file>` header line** — the
skill says exactly that: *"`grep -v '^---'` drops only the diff's own `--- a/<file>` header line."*
**That claim is false.** In a unified diff a deleted source line is prefixed with `-`, so a deleted
line whose own text begins with `---` renders as `----…` — which also starts with `---` and is
therefore filtered out with the header.

**Affected line shapes** (all common in the files this check guards): a markdown horizontal rule
`---`, a YAML front-matter delimiter `---`, and any line beginning `---`.

### Reproduced first-hand by the filing producer, 2026-08-16

In a throwaway git repo — **not** inferred from reading:

```
base commit:  "alpha\n---\nbeta\n"
working tree: "alpha\nbeta\nGAMMA\n"      # the '---' rule was DELETED, one line added

$ git diff --numstat -- f.md
1       1       f.md                       # ← a real deletion, correctly reported

$ git diff -U0 -- f.md
@@ -2 +1,0 @@ alpha
----                                       # ← the deleted '---' line
@@ -3,0 +3 @@ beta
+GAMMA

$ git diff -U0 -- f.md | grep '^-' | grep -v '^---'
[no output]                                # ← the PRESCRIBED filter MISSES it
```

⭐ **The two prescribed checks disagree, and only one of them is wrong.** `--numstat` reports
`1 deleted`; the grep reports clean. A worker that runs both and reads them honestly will notice —
but the skill presents the grep as the check that *"proves"* the shape, and the pair exists precisely
so one can back the other.

⛔ **Where the pair fails together:** on an **untracked** file, `--numstat` returns nothing at all, so
the redundancy vanishes and the blind spot is unguarded. **That compounding case is
[`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md)'s
scope, not this task's** — this brief fixes the filter itself.

### ⭐ Why the fix is small and why it is NOT the obvious one

The tempting `grep '^-[^-]'` is **already documented as wrong** in the same block, for a different
reason the skill states correctly: *"a deleted markdown list line `- text` appears in the diff as
`-- text`, so its second character is also `-` and the pattern skips it."* ⛔ **Do not reintroduce
it.** Any candidate fix must pass **both** cases — the deleted list bullet (`- **Status:**`) and the
deleted horizontal rule (`---`) — and must still drop the real `--- a/<file>` header.

**Candidate directions** (the plan decides; none is mandated here):

- Anchor the header exclusion to its actual shape (`--- a/` / `--- /dev/null`) rather than to `^---`.
- Drop the diff headers by position rather than by pattern (e.g. strip lines before the first `@@`).
- Replace the grep entirely with a normal-format comparison — `diff <snapshot> <file> | grep '^<'` —
  which has neither blind spot. ⚠️ **But that path needs a snapshot, which is `0313`'s open question**;
  choosing it here would pre-decide `0313`.

⭐ **The filing producer's read:** stay inside the unified-diff form and fix the exclusion pattern, so
this ships without waiting on `0313`. **The plan owner may disagree; say so at the plan gate.**

## What to build

1. Correct the deletion filter in `claude/skills/fkit-record-decision/SKILL.md`'s *"Append-only,
   proved by diff — not by eye"* block so a deleted line beginning `---` is **reported**, while the
   diff's own `--- a/<file>` header is still dropped.
2. Correct the **prose claim** in the same block that currently reads *"`grep -v '^---'` drops only
   the diff's own `--- a/<file>` header line."* ⛔ **Fixing the command and leaving the sentence is
   half a fix** — the sentence is what a reader trusts when deciding not to re-check.
3. **Keep the existing `grep '^-[^-]'` warning intact.** It is correct and it is the reason the wrong
   fix keeps getting proposed.
4. Add the horizontal-rule / YAML-delimiter case to the block's stated coverage, so the next reader
   knows it is handled rather than unmentioned.

⛔ **Docs-only. No source change, no commit, no push, no `ai-agents/wiki-vault/` write.** Check the
vault for a copy of the old wording; if one exists, file a wiki resync sibling
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
rather than writing it here.

## Verification steps

1. **Reproduce the bug first, against the unamended file.** Run the throwaway-repo reproduction above
   and confirm the current filter returns empty on a deleted `---`. **A run that cannot show the bug
   red has not verified the fix.**
2. **The amended filter catches it.** Same fixture, new filter → the deleted `----` line **is**
   printed.
3. **The amended filter still drops the header.** On a pure-append fixture (`+N / −0`, no deletions)
   the new filter returns **no output** — no false positive from `--- a/<file>`.
4. **The list-bullet case still passes.** Fixture deleting a `- **Status:** …` line → the new filter
   prints it. This is the regression the existing warning exists to prevent.
5. **The prose matches the command.** `grep -n "drops only the diff's own" claude/skills/fkit-record-decision/SKILL.md`
   either returns nothing or returns a sentence that is true of the new filter.
6. **Dual-home parity.** The canonical source under `claude/` is what was edited; if the repo's
   dogfooded `.claude/` copy is refreshed by `claude/fkit-claude-init.sh .`, note that a relaunch is
   needed — do not hand-edit the gitignored copy.
7. **No forbidden writes.** `git status --porcelain ai-agents/wiki-vault/` is empty; nothing committed
   or pushed.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Related:** [`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md)
  (the owner-decision half of the same defect cluster);
  [`0311`](../0311-specify-the-corrections-bullet-own-date-and-metadata-position/brief.md) (records
  this residual as known, and its own verification step depends on the guard being correct);
  [`0198`](../../done/0198-teach-record-decision-the-dated-correction-note-form/brief.md) (the task
  that wrote the current filter, whose `R1` finding produced the `grep '^-[^-]'` warning).
- **⚠️ Why this is a separate brief from `0313`, stated plainly.** It is **independently shippable**:
  the filter is wrong today and the fix is correct under every option `0313` might pick, so it needs
  no owner decision and can go into a sprint on its own. **The split is the filing producer's
  judgement, not an owner ruling** — the owner ruled *"file a task for it"* over the finding as a
  whole. **Say so if the owner would rather have one brief.**
- **⚠️ Same-file collision with `0313`.** Both edit the *"Append-only, proved by diff"* block of
  `claude/skills/fkit-record-decision/SKILL.md`. **Whichever runs second must re-read the block rather
  than apply its brief verbatim**, and a `0313` rewrite must **preserve or restate** this fix.
- **⚠️ `0311`'s brief and board row instruct a future run to use the current guard.** If this task
  lands first, that instruction becomes stale wording (the guard it names gets better, not different
  in intent) — **reported, not repaired here.**
- **Citations are file + quoted phrase, never `:NNN`** — the target is a living document (the `0143`
  citation-form residual).
- **⚠️ Filed UNRANKED by a SPAWNED producer with no owner channel — this row APPENDS and renumbers
  nothing, and was deliberately NOT added to Sprint 6**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- **On merit:** below `0313` in importance but **above it in readiness** — small, docs-only, fully
  specified, verifiable by a four-fixture test, and blocked on nothing. If a sprint needs a
  low-risk pull, this is the pullable one of the pair.
