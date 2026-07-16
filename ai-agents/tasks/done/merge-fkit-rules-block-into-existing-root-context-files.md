# Merge an fkit-managed rules block into an **existing** `CLAUDE.md` / `AGENTS.md` — the brownfield hole

## Sprint
Sprint 2

## Priority
31

## Status
✅ Done

## Context

**Every brownfield project fkit has ever been added to has received none of fkit's universal hard
rules.** Not a subset — none.

```
claude/fkit-claude-init.sh:64-65
  if [ -e "$dest/CLAUDE.md" ]; then
    echo "• CLAUDE.md already present — left as-is"
```

Same for `AGENTS.md` (`:70-71`). Any project that already uses Claude Code **already has a
`CLAUDE.md`** — so init sees it and never writes. The team map, the consult/hop rules, and the four
universal hard rules **are never installed**. The scaffold's rules block
(`claude/scaffold/CLAUDE.md:56-63`) reaches only greenfield projects.

**And there is a second, worse consequence: fkit has no channel to ship a correction through.** Today,
a fix to the shared rules reaches *new* projects only. Every existing project is frozen on whatever it
got — or, in the brownfield case, on nothing.

Rationale:
[`reports/2026-07-14-shared-instructions-layer.md`](../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
§3 (hole 1) and §7 (recommendation 2). Owner ruled **approved** (2026-07-14), in the report's
recommended shape: a **marker-delimited, fkit-managed, idempotent block**, merged into the two root
files at init.

> ### ⚠️ Not blocked by task 28 — confirmed, and it matters
>
> `CLAUDE.md` and `AGENTS.md` live at the **project root**, not inside `ai-agents/`. They are handled by
> init **step 2** (`:62-75`) — a **completely separate seam** from the all-or-nothing `ai-agents/`
> scaffold guard (`:55-56`) that **parked task 28** is about. **This task ships today with 28 still
> parked.** *(This is precisely what killed the rejected `AGENTS-COMMON.md` splice: its stub lived inside
> `ai-agents/`, so it silently depended on a parked task. Report §4.)*

> ### ⚠️ Rejected — do not reintroduce
>
> The owner **rejected** `ai-agents/AGENTS-COMMON.md` and any splice into the seven
> `claude/agents/fkit-*.md` files (report §4 — it structurally **cannot reach Codex**), and rejected
> **`claude --append-system-prompt` by name** (report §5 — **session-only; 0/3 then 0/2 into a spawned
> consult**, on Claude Code 2.1.208). **No new mechanism.** This task changes *delivery of the block fkit
> already ships*, and nothing else.

## What to build

In `claude/fkit-claude-init.sh` **step 2**, replace the two never-clobber branches with an **idempotent,
marker-delimited merge** applied to **both** `$dest/CLAUDE.md` and `$dest/AGENTS.md`.

### 1. One source of truth for the block text

Hoist the rules text into a **single scaffold file** — e.g. `claude/scaffold/universal-rules.md` — and
have init splice it into both root files. **Do not keep two hand-maintained copies of the rules** (in
`scaffold/CLAUDE.md` and `scaffold/AGENTS.md`); that is the drift this whole investigation was chasing.

The scaffold's `CLAUDE.md` and `AGENTS.md` should carry the **marker pair** where the block belongs, and
the merge fills it — so the greenfield path (`cp` + merge) and the brownfield path (merge only) run the
**same code** and produce the **same file**. Two paths that must agree, agreeing by construction.

### 2. The markers, and the contract

```
<!-- fkit:begin-rules -->
… fkit-managed content …
<!-- fkit:end-rules -->
```

- **Everything outside the markers is the owner's, and is never touched. Ever.** That is the whole
  promise of this design; it is what earns the right to write into a file the user already had.
- **Everything inside the markers is fkit's**, and is **replaced wholesale on every launch**.
- The block's **first line must say so, in the file, to the human reading it**: *fkit-managed — edits
  inside this block are overwritten on every launch; put your own standing instructions **outside** it.*
  A user who loses an edit they made inside the markers, with no warning in the file, has been ambushed
  by us.

### 3. ⚠️ Idempotency is the load-bearing requirement — `fkit` runs init on **every launch**

**A merge that appends would grow the user's `CLAUDE.md` without bound, one block per launch.** So:

- **If the marker pair is present → replace the region *in place*.** Not delete-and-append. The block
  stays **exactly where the user's file has it**, preserving the surrounding structure. A merge that
  relocates the block to EOF on every run is *also* a mutation of the user's file, just a slower one.
- **If the marker pair is absent → insert the block once**, at a defined position (append at EOF is
  acceptable and simplest — state the choice in a comment).
- **If the file does not exist → create it from the scaffold, then merge** (today's greenfield behavior,
  preserved).
- **Byte-identical result on re-run.** Run *N* times, get the file you got after run 1.
- **Say nothing when nothing changed.** Init already prints one line per step; a "rewrote CLAUDE.md"
  message on every single launch, when the content is identical, trains the user to ignore init's output
  — which is the output that a real refusal has to get through. Announce only on **created** or
  **changed**.

### 4. Malformed / hostile states — refuse, do not guess

Init runs **unattended on every launch**, against a file the user owns. A merge that guesses is a merge
that eats someone's work.

| State | Behavior |
|---|---|
| **Begin marker, no end marker** (hand-mangled, truncated, or mid-conflict) | **Refuse this file. Warn on stderr, name the path, change nothing, carry on with the rest of init.** Do **not** "helpfully" re-close the region — the end of the block is unknowable and the wrong guess deletes the user's prose. |
| **End marker before begin marker**, or **more than one** begin/end pair | **Refuse.** Same handling. |
| **The root file is a symlink** (`[ -L "$dest/CLAUDE.md" ]`) | **Refuse — do not write through it.** fkit must never write outside the project it was pointed at. `[ -L ]` **first**: `[ -e ]` and `[ -f ]` dereference and will lie to you. This is task 27's lesson, applied to a second seam. |
| **The root file is not a regular file** (dir, device) | **Refuse.** |
| **The file is unwritable** | **Refuse cleanly**, do not die. |
| Markers inside a fenced code block in the user's prose | Known, accepted footgun. Note it in the block header; do not build a markdown parser. |

**Refusal is never fatal.** Warn on **stderr** (per task 26/27's established discipline — the launcher
sends init's stdout to `/dev/null` on an already-set-up project, so a warning on stdout is swallowed in
exactly the cases it exists for), **skip that file**, and **continue the rest of init**. A weird
`CLAUDE.md` must not cost the user their agents or their session.

### 5. All-or-nothing per file

Write to a temp file and `mv` into place. A merge that dies halfway leaves a **half-written `CLAUDE.md`**
— the user's own instructions, truncated, in a file they never asked us to touch. Report §7 flags exactly
this ("partial-failure divergence") as the hazard any multi-file mutation in init inherits.

### 6. Keep the block small

The text lands in **every agent's context on every turn**. Report §6 is blunt that *"ask for brevity"* is
a request, not a fact — **enforce a size cap in the shell at merge time** (a few KB; pick a number, state
it, fail loudly if the scaffold's rules file exceeds it). This guards fkit against its own future
verbosity, which is the only author this block has.

## Verification steps

Run against a scratch project. Check the **filesystem**, not just the console.

- **Idempotency — the one that must not be fudged.** In a scratch project with a pre-existing
  `CLAUDE.md`:
  ```
  claude/fkit-claude-init.sh <proj>   # ×3
  grep -c 'fkit:begin-rules' <proj>/CLAUDE.md   # → exactly 1
  grep -c 'fkit:end-rules'   <proj>/CLAUDE.md   # → exactly 1
  ```
  Repeat for `AGENTS.md`. Then prove it byte-for-byte: checksum after run 1 and after run 3 —
  `shasum <proj>/CLAUDE.md` — the two hashes are **identical**.
- **The owner's content survives, exactly.** Give the scratch `CLAUDE.md` distinctive prose **both above
  and below** where the block lands, plus a trailing section. After 3 runs, every line of it is still
  there, in the same order, unmodified. Diff the non-block region against the original and get **nothing**.
- **In-place replacement, not relocation.** Put the marker block in the **middle** of the file, with the
  user's sections after it. Change the scaffold's rules text, re-run init: the block updates **where it
  was** and the sections below it are still below it.
- **Brownfield gets the rules at all — the actual bug.** A project with a pre-existing `CLAUDE.md` and no
  markers → after init, `grep -c 'Never commit' <proj>/CLAUDE.md` is ≥ 1. **Before the fix it is 0.** Run
  it before your change so you see the defect. Same for `AGENTS.md`.
- **This repo is a brownfield project — use it as the real test.** `claude/fkit-claude-init.sh .` and
  confirm `/CLAUDE.md` and `/AGENTS.md` each end up with exactly one managed block and every existing
  section intact. (This repo's own `CLAUDE.md` has hand-written content in it — it is the honest case.)
- **Greenfield is unchanged.** Empty dir → init → `CLAUDE.md` and `AGENTS.md` created, each with exactly
  one block, all placeholders still present. This is 100% of new-project traffic and may not regress.
- **Malformed refusals.** For each: begin-marker-only; two begin markers; `ln -s /tmp/elsewhere-$$
  <proj>/CLAUDE.md`; `chmod a-w <proj>/CLAUDE.md`. In every case init **warns on stderr, names the path,
  leaves the file byte-identical** (`shasum` before/after), **does not die**, and **still writes**
  `.claude/agents/`, `.claude/skills/`, `.fkit/interview`, and the `.gitignore` entries. For the symlink
  case, additionally confirm `/tmp/elsewhere-$$` is **unmodified** — nothing was written through the link.
- **Quiet on no-op.** Second and third runs print **no** "changed CLAUDE.md" line.
- **Codex still reads it.** After merging into a brownfield `AGENTS.md`:
  `codex exec --sandbox read-only --cd <proj> - <<< "List the universal hard rules for this repo, or say
  NONE."` → returns them.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 30** — it lands the canonical rules text this task hoists into a single source. (Not
  a hard technical block; you *could* write both in one pass. But 30 is a live defect with a 10-minute fix
  and shouldn't wait behind a mechanism change.)
- **Does NOT depend on task 28** (parked). Different seam — confirmed above. If anyone tells you
  otherwise, they are reading the `ai-agents/` guard at `:55-56` instead of the root-file guard at
  `:64-75`.
- **`[ -L ]` before `[ -e ]`/`[ -f ]`. Always.** Task 27 exists because those two dereference. This is the
  same bug in a new file, and it is the second seam to inherit it.
- **Delivery: structural. Compliance: advisory.** Report §6, and it is the *only* claim level the report
  makes. This task makes the rules **arrive**. Nothing in fkit **enforces** them — there are zero hooks,
  all seven agents hold `Bash`. Do not write "floor", "teeth", or "non-overridable" into any comment,
  message, or commit body for this change.
- **The owner's original ask is already met, and this is what makes it *true everywhere*:** to give all
  fkit agents a standing instruction, he writes it in `CLAUDE.md` — **outside** the markers. Proven 3/3 to
  reach both a session and a spawned consult. This task is what makes that work on a project that already
  had a `CLAUDE.md`.
- **Accepted tradeoff, stated once:** fkit's rules stay visible to **non-fkit** Claude sessions in the same
  repo. That is a small, real noise cost — **and it is the cost fkit already chose to pay**, since
  `CLAUDE.md` already carries the team map and the hard rules by design (report §4).
- **No ADR** for the mechanism itself. *(The **reversal** — rejecting `AGENTS-COMMON.md` and
  `--append-system-prompt` by name — is ADR-worthy and is an open question to the owner. Without the
  tombstone, both ideas come back.)*
- Risk: **moderate.** This is the first code in fkit that **writes into a file the user already owned**,
  unattended, on every launch. The blast radius of getting the merge wrong is *someone else's `CLAUDE.md`*.
  Every safety requirement above exists for that one sentence.
