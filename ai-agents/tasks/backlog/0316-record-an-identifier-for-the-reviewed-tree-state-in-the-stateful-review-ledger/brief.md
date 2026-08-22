# Record an identifier for the reviewed tree state in the stateful-review ledger

## ID
0316

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

**This task DECIDES how a stateful review identifies the working-tree state it reviewed, gets that
shape ruled by the owner, and only then writes doc text.**

⛔ **It does NOT arrive with the answer picked.** In particular it does **not** arrive having decided
that the fix is *"record a `git stash create` blob id"* — that was the surfacing verifier's
suggestion, and the first-hand probe below shows it does **not** do what it appears to do. It does
**not** arrive having decided that the reviewed state must be committed either: `CLAUDE.md`'s
universal hard rule — *"Never commit or push unless the owner explicitly asks"* — means **no agent may
make committing part of an automatic step**. A run that writes the doc change before the owner rules
has failed the task.

### Authority

**Owner-ruled filed 2026-08-21**, live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop` — **verbatim option label: `"File it as a task (Recommended)"`.**

### Provenance

Surfaced by task
[`0302`](../../done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md)'s **post-review
re-verification**, 2026-08-21; owner-ruled filed the same day through the live driving session.

### The gap

In a stateful review the reviewer reviews an **uncommitted working tree**. When the coder then
responds and a later pass asks *"did any executable line change since the review?"*, that question
**cannot be answered by byte-comparison**: the reviewed state was never captured anywhere, and nothing
in the procedure preserves it. The later pass can only **infer**.

### Findings — re-derived first-hand by the filing producer, 2026-08-21

⚠️ **Every statement below was measured this run against the live tree (or a scratch git repo), not
carried on the routing note's word.** ⚠️ **It is a dated observation against a dirty tree —
RE-DERIVE BEFORE ACTING.**

**1. Neither stateful-review skill records any identifier for the reviewed state.** Both
`claude/skills/fkit-stateful-review/SKILL.md` and `claude/skills/fkit-process-stateful-review/SKILL.md`
carry the **same** ledger header block, and it has exactly three fields:

```
Task: <path to task file>
File(s) under review: <paths>
Status: in-review | closed-out
```

`File(s) under review` is specified as **paths** — the *names* of the files, never their *contents* or
a digest of them. A grep of both files for `stash`, `blob`, `sha`, `hash`, `baseline`, `snapshot` and
`checksum` returns **no hit on any of those words**; every line returned matched only the substring
`share` inside *"shared"* / *"the shared document"*. **There is nothing to compare a later state
against, by design-omission rather than by decision.**

**2. What a live ledger header actually records** —
`ai-agents/tasks/done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/review.md`
(⛔ read this run, **not edited** — other workers hold that folder):

| Field | What `0302` carries |
|---|---|
| `Task:` | the brief path |
| `File(s) under review:` | paths **plus hand-written diff counts in prose** — *"now +8/−2, uncommitted"*, and *"round 1 reviewed +7/−2"* |
| `Status:` | `closed-out (2026-08-21, owner-dispositioned …)` |
| *(unprescribed, added by the reviewer)* | a round line reading **"Baseline `HEAD = 7832cba`"** |

⭐ **Two things follow, and they are the heart of this task.** (a) The prose diff counts are the
closest thing to a state identifier the ledger has, and a **count is not an identity** — many
different edits produce `+7/−2`. (b) The `HEAD` baseline is real but identifies the **committed**
base, **not** the working tree — and the uncommitted delta on top of `HEAD` is precisely what was
reviewed. It is also **not prescribed by either skill**; that reviewer wrote it because it was useful,
and the next reviewer has nothing telling them to.

**3. How the claim was actually established on `0302` — and why it is inference.** The round-2
reviewer recorded, under *"What I re-verified first-hand this pass"*:

> **The executable lines really are byte-unchanged — proven, not asserted.** Stripped every
> whole-line comment from `HEAD:claude/fkit-claude.sh` and from the working tree, then diffed the
> remainder. The **only** two differences in the entire file are the prompt string … and the arm …
> — i.e. **exactly the round-1 change, and nothing else.**

plus a delta argument: `git diff --numstat` → `8 2`, against round 1's reviewed `+7/−2`, therefore
*"exactly one added comment line"*.

⚠️ **Correction to the description this task was filed from, recorded so the next reader is not
looking for text that is not there.** The routing note described **four separately-enumerated
convergent checks** (unchanged arm absent from the diff; deletion count and deleted lines unchanged;
added-line delta exactly one line, and that line a comment; every line below shifting down one). What
the ledger actually records is a **comment-stripped `HEAD` ↔ working-tree comparison** plus the
`--numstat` delta argument above. **The substance is the same and the conclusion is sound** — but the
shape is two convergent arguments, not four enumerated checks. ⭐ **The gap is unchanged either way:
every one of these compares against `HEAD` or against a remembered count. None compares against the
reviewed state, because the reviewed state does not exist anywhere.**

⚠️ **And it worked only because the change was unusually easy to reason about** — one tracked file,
a two-line executable delta fully reproducible from `HEAD`, and a round-2 delta that was pure comment
text. Widen any of those and the argument does not survive.

**4. ⛔ `git stash create` does NOT do what the suggestion assumes — measured, git 2.50.1
(Apple Git-155), in a scratch repo.** Scratch repo with one modified tracked file and one untracked
file:

| Probe | Result |
|---|---|
| `git stash create` | returns a commit object; **`git status --porcelain` unchanged afterwards** — no ref written, working tree untouched |
| `git ls-tree -r <obj> --name-only` | **`tracked.txt` only — the untracked file is ABSENT** |
| `git stash create -u` | ⛔ **returns an object whose commit message is literally `On main: -u`** — `create` takes a **`<message>`**, not flags, so `-u` was silently swallowed as the message and the untracked file was **still absent** from the snapshot and from both parent trees |
| `git stash create -h` | ⛔ likewise printed a **hash**, not help text |

⭐ **This is a footgun, not a detail.** The obvious mechanism captures **tracked modifications only**,
and the obvious fix for that (`-u`) **silently does nothing while appearing to succeed**. Since task
folders' `review.md` / `worklog.md` / `plan.md` are frequently **untracked** mid-run (finding 6 of
[`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md)
measured 25 such paths), a stash-based identifier would omit exactly the files a review round most
often touches.

**5. A per-file digest does cover untracked files.** `git hash-object <path>` returned a digest for
the untracked file in the same probe. It also scopes naturally to *the files under review* rather than
the whole tree — which matters, see constraint 2.

**6. ⚠️ UNMEASURED, and it must be settled before option A is chosen: durability.** A `git stash
create` object is **unreferenced**. Unreferenced objects are subject to `git gc` pruning (default
expiry, and immediately under `git gc --prune=now`). **This brief did not measure it.** If the ruling
lands on a dangling-object mechanism, whether the identifier survives to the next round is a
correctness question, not a nicety.

### Constraints any solution must respect

1. ⛔ **fkit never commits unprompted.** Any option whose mechanism *requires* a commit is asking for
   an owner act mid-run, and must be presented as such — never as an automatic step.
2. ⚠️ **The working tree during a sprint run carries many tasks' concurrent in-flight work.** `0302`'s
   own ledger header says so explicitly, listing `0145`'s brief under *"In the same working tree but
   NOT part of `0302`'s diff"*. A whole-tree snapshot can still serve as an **identifier**, but any
   *comparison* built on it must be scoped to **this task's** files, or an unrelated worker's edit
   reads as a change to the reviewed code.
3. ⚠️ **Task-folder ledgers are themselves untracked mid-run** — the adjacent problem
   [`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md)
   covers. Any git-baseline mechanism must state what it does when there is no baseline.

### The options — none of these is pre-decided

| # | Option | What it costs |
|---|---|---|
| **A** | **Record a `git stash create` object id in the ledger header** at review time | ⛔ Captures **tracked modifications only** (finding 4) — misses untracked ledgers and any new file. ⚠️ Durability unmeasured (finding 6). Whole-tree scope collides with constraint 2. |
| **B** | **Record per-file digests of the files under review** (e.g. `git hash-object`) in the header | Covers untracked files (finding 5) and scopes to the reviewed set. Cost: one line per file, and a **rule for what counts as "the files under review"** when the set grows between rounds. |
| **C** | **Require the reviewed state be committed first** | ⛔ **Collides with the universal hard rule "never commit unprompted"** — this is an owner gate mid-run, and overlaps [`0310`](../0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work/brief.md). Gives the strongest proof of the four. |
| **D** | **Accept convergent inference as sufficient, and document the reasoning standard instead** | No new mechanism, no owner gate. Cost: the standard must say **when inference is admissible and when it is not** — `0302`'s argument held because the change was small and tracked (finding 3); nothing today tells a worker where that stops. |

⭐ **The filing producer's read, offered as input and not as a decision:** the honest floor is that a
later pass must be able to say **which** of *"proved"* and *"inferred"* it is doing — `0302` did say
so, voluntarily. **B** is the cheapest mechanism that survives the untracked case and constraint 2;
**A** as suggested does not, on the measurement above. **D is not a null option** — it is the only one
that costs nothing at review time, and it is defensible if the owner judges the recording burden
higher than the risk. **The choice is the owner's.**

### ⚠️⚠️ Relationship to `0313` — STATED, DELIBERATELY NOT RESOLVED

[`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md) is
*"decide the append-only proof standard for untracked task-folder ledgers"* — **proving how a ledger
changed**. This task is **proving what state was reviewed**. Adjacent, same family, **different
question**: `0313`'s subject is the ledger document, this one's subject is the code under review.

⛔ **The owner considered folding them on 2026-08-21 and chose a separate task. The filing producer
did NOT fold them and must not.** The fold remains the owner's one-edit call.

⚠️ **They do interact, and whoever runs second reads the other's ruling first.** Both turn on the same
untracked-file behaviour of git; a snapshot mechanism ruled here could pre-decide `0313`'s option B,
and `0313`'s ruling on *who takes a pre-edit snapshot and when* would constrain who records the
identifier here.

### Other adjacencies

- ⚠️ [`0310`](../0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work/brief.md)
  — if the ship-loop gains an owner-approved commit gate, option C gets cheaper. **It does not close
  the window**: the state reviewed mid-round is still uncommitted at the moment it is reviewed.
- ⛔ **Do not edit `0302`'s folder** — two other workers were active there at filing time. It is read
  evidence, not a work surface.

## What to build

**Phase 1 — decide (owner-present, mandatory before any doc edit).**

1. Re-derive the findings above against the live tree, including the `git stash create` probe. If the
   picture has changed, the newly-measured reality supersedes this brief.
2. **Measure finding 6** (durability of an unreferenced stash object under `gc`) before putting option
   A to the owner — presenting A without it hands the owner an unpriced option.
3. Put the option table to the owner via `AskUserQuestion`, with the producer's read marked as a
   recommendation, not an assumption, and constraint 1 stated **in the question** wherever option C
   appears.
4. Decide whether this warrants an **ADR**. It changes a procedure both review skills share and it
   brushes a universal hard rule, which argues yes; it is arguably a schema addition, which argues no.
   **State the call and the reason either way.**

**Phase 2 — write it, only after phase 1 is ruled.**

5. Amend the ledger header schema in **both**
   `claude/skills/fkit-stateful-review/SKILL.md` and
   `claude/skills/fkit-process-stateful-review/SKILL.md` to encode the ruled standard. ⛔ **Both, or
   neither** — the two files carry the schema block verbatim and each says *"keep it exact so the two
   sides interoperate"*; changing one forks the ledger format.
6. State **who** records the identifier and **at which step**, such that a later pass can tell whether
   it is comparing or inferring.
7. Whatever is ruled, the text must say what a worker does when **no identifier is present** — every
   ledger written before this task exists is in that state, `0302`'s included.
8. If an ADR is ruled, record it via `/fkit-record-decision` into
   `ai-agents/knowledge-base/decisions/`.

⛔ **No commit, no push, no `ai-agents/wiki-vault/` write** (wiki writes are `fkit-wiki`'s,
[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
If the ruled change lands in an ADR or a skill the vault already summarizes, file a wiki resync
sibling rather than writing the vault here.

## Verification steps

1. **The decision exists and is the owner's.** The record (ADR or the skills' own text) names the
   ruling, its date, and that it came from the owner — not from an agent's judgement.
2. **Both skills changed identically.** `diff <(sed -n '/^Task: /,/^Status: /p'
   claude/skills/fkit-stateful-review/SKILL.md) <(sed -n '/^Task: /,/^Status: /p'
   claude/skills/fkit-process-stateful-review/SKILL.md)` shows **no difference** in the header block.
3. **The no-identifier case is addressed in text.** `grep -n -i 'no identifier\|not recorded\|inferred'
   claude/skills/fkit-stateful-review/SKILL.md` returns at least one match inside the header-schema
   or step text.
4. **If A was ruled — the untracked hole is addressed.** The text states that `git stash create`
   captures tracked modifications only, and says what happens to untracked files under review.
   Reproduce it: scratch git repo, one modified tracked file plus one untracked file,
   `git ls-tree -r "$(git stash create)" --name-only`, and confirm the untracked path is absent.
   Record the commands and output.
5. **If A was ruled — durability is stated.** The text says whether the identifier is expected to
   survive `git gc`, with the measurement behind it.
6. **If B was ruled — the file set is defined.** A reader can answer *"which files do I digest, and
   what if the set grows in round 2?"* from the text alone.
7. **If C was ruled — the hard rule is honoured in text.** The procedure asks the owner and cannot
   proceed by committing on its own.
8. **If D was ruled — the boundary is stated.** The text says when inference is admissible and when a
   pass must instead report the comparison as impossible.
9. **End-to-end on a real ledger.** Run one stateful review round following the amended procedure, then
   answer *"did any executable line change since the review?"* using only what the ledger records.
   Record whether the answer was **proved** or **inferred**.
10. **No forbidden writes.** `git status --porcelain ai-agents/wiki-vault/` is empty; `0302`'s folder
    is untouched by this task; nothing was committed or pushed.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Related:** [`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md)
  (same family, different question — see *Relationship to `0313`*, ⛔ do not fold);
  [`0310`](../0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work/brief.md)
  (an owner-approved commit gate would reprice option C).
- **⚠️ `0313` is deliberately NOT a dependency in either direction.** Each is decidable on its own.
  **But both bear on the same untracked-file behaviour of git** — whichever runs second re-reads the
  other's ruling rather than applying its brief verbatim.
- **Citations are file + quoted phrase, never `:NNN`** — the targets here are living documents and
  their line anchors decay (the `0143` citation-form residual).
- **⚠️ Filed UNRANKED by a SPAWNED producer with no owner channel — this row APPENDS and renumbers
  nothing, and was deliberately NOT added to Sprint 6**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- **On merit:** this sits directly alongside `0313` — both are **soundness** problems in claims the
  team reports as proved. This one is the narrower of the two (it affects only stateful review rounds
  that re-verify a prior round), which argues it ranks below `0313`; against that, it was hit in a live
  sprint run within days of `0313`'s own surfacing, so the class is recurring rather than theoretical.
