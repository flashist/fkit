# Mechanical citation sweep of `architecture.md` — resolve every `:NNN` against disk, both directions

## ID
0286

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

Filed **2026-08-13** on the `/fkit-sprint-ship-loop` driver's ruling, following the close of
[`0257`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md) the same day.
The driver folded `0257`'s own line-shift residual into this task **rather than renumbering under
`0257`** — see *"The second half"* below.

⚠️ **No verbatim owner-ruling label attaches to this row.** The two owner rulings quoted on its
sibling rows —
[`0284`](../0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md)
(*"New task + correct the false claims now (Recommended)"*) and
[`0285`](../../done/0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md) (*"File a new
resync task (Recommended)"*) — **do not cover this one.** It is a driver-filed row. **Say so if
anyone asks what authorized it.**

### The problem: spot-checks keep missing them. Eight in one file, in one task.

**At least eight stale or wrong citations surfaced in `architecture.md` across two tasks, and every
single one was found only by an independent check** — never by the pass that wrote or reviewed the
line. That is the whole lesson, and it is why this task is defined as **mechanical and complete**
rather than as a list to work through.

**Found during `0257`'s build, and FIXED there** (verified on disk 2026-08-13 — do not re-scope):

| Citation | Was | Is now |
|---|---|---|
| `:333` | `claude/fkit-claude.sh:66-72` | `:68-74` |
| `:386` | `claude/fkit-claude.sh:104-118` | `:99-123` |
| `:395` → now `:409` (`_fkit_is_source_checkout`) | `:72` | `:77` |
| `:443` (`structure_notice()`) | `:434` → `:449` → `:453` | `:453` |

**Found during `0257`'s process-review, SURFACED BUT DELIBERATELY NOT TAKEN — these are still stale
today.** Re-verified line by line on disk 2026-08-13:

| `architecture.md` line | Cites | What actually sits there |
|---|---|---|
| `:51` | `claude/fkit-claude.sh:257-262,357` for *"the launcher exits 127 without `claude`"* | `:257-262` is the *"FOUR hand-maintained places MIRROR this list"* comment; `:357` is `setup_ok=1`. **Both wrong.** |
| `:52` | `claude/fkit-claude.sh:274-285` for the **Codex** preflight | `:274-285` is the retired-`skillOverrides` / ADR-018 comment block. **Wrong.** |
| `:355` | `claude/fkit-claude.sh:288-294` for fresh-project detection | `:288-294` is the tail of that same ADR-018 comment plus `build_settings() {`. **Wrong.** |
| `:597` | `claude/fkit-claude.sh:311-345` for *"role routing is an `if/else`"* | `:311-345` is the hooks JSON string and `build_settings()`'s body. **Wrong.** |

**Found by the reviewer, still stale today:**

| `architecture.md` line | Cites | Truth on disk |
|---|---|---|
| `:590` | `claude/fkit-claude.sh:76` for `GIT_TERMINAL_PROMPT=0` | It is at **`:81`**. `:76` is a comment line. |
| `:594` | `claude/fkit-claude.sh:56-58,64` for *"offline must cost nothing"* | `:56-58` is the ADR-009 shaping bullet; the offline sentence is at **`:60-61`**; **`:64` is a bare `#`**. |

**And the reviewer's own round-1 citation error, which is the sharpest evidence for this task.**
`0257`'s `review.md` R1 cited the Network bullet as `architecture.md:586`. **Verified against `HEAD`
2026-08-13: `HEAD:586` is the ADR-023 tombstone line** (*"…and **declined** — ADR-023"*); the Network
bullet was **`HEAD:577`**. ⚠️ **A reviewer whose entire finding was "this citation is wrong" got its
own citation wrong in the same paragraph.** Nine errors, not eight.

> **⚠️ DATED ADDITION 2026-08-13 — A TENTH MEASURED HIT, AND IT IS THE DELICATE ONE.
> Text above left byte-identical.**
>
> **`architecture.md:415`** attributes *"No npm-registry publish"* to **`bin/release.mjs:66`**.
> Independently re-measured from disk 2026-08-13:
> - `bin/release.mjs:66` is `  --no-tag            Commit + push, but don't create/push a tag` — a
>   `--help` output line.
> - The correct site is **`bin/release.mjs:77`**: `Makes no npm-registry publish.`
> - `architecture.md` contains **exactly one** `bin/release.mjs:NNN` citation — this is it.
>   Machine-derived: `grep -noE 'bin/release\.mjs:[0-9]+([,-][0-9]+)*'` → a single hit,
>   `415:bin/release.mjs:66`.
>
> ⚠️ **A sixth instance of this task's own pattern — a correction that was itself wrong.** `0252`'s
> `review.md` describes `bin/release.mjs:66` as `const doTag = !has("--no-tag")`. **That description
> is wrong**: `const doTag` is at **`bin/release.mjs:82`**; `:66` is the help-text line quoted above.
> The *substance* of the residual holds either way — `:66` is not the npm-registry site and `:77` is —
> but ⛔ **re-measure every coordinate here rather than inheriting it, including these.**
>
> ⛔ **THE DELICATE PART — READ BEFORE TOUCHING `:415`.** That stale citation sits on the **same
> line** as **`**Version bumping is load-bearing**`** — a sentence deliberately preserved
> **byte-identical across several tasks**, most recently proven so by
> [`0252`](../../done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md),
> whose **verification step 4** reads *"`grep -n "Version bumping is load-bearing"
> ai-agents/knowledge-base/architecture.md` still returns its hit, unmodified"*. Verified 2026-08-13:
> `0252`'s shipped diff to this file is **`+2 / -0`** (`git diff --numstat` → `2  0`) — **it removed
> no line.** ✅ **The correction must change the citation string and leave that sentence's bytes
> untouched.**
>
> ✅ **The guard already exists — use it, do not invent one.** This task's own **verification step 6**
> (*"No prose sentence changed. Show the diff and confirm every hunk is a citation string only"*) is
> exactly the right check for this hit.
>
> **Why this row and not `0252`:** `0252` **could not** fix it. Its own step 4 protected that
> sentence from any removed line, and the stale citation shares the line — so correcting it would
> have produced a removed line and failed `0252`'s own gate. It was surfaced as a `0252` residual
> instead; the evidence trail is that task's `review.md` (its *"Accepted residuals"* section and the
> reviewer's out-of-scope list), now closed at
> `ai-agents/tasks/done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/`.
>
> ✅ **In scope for this row:** the `:415` **citation string only**. It is a `bin/release.mjs:NNN`
> coordinate — section A's job exactly.
> ⛔ **The §9 fence below is UNCHANGED and this note does not widen it.** The **suite count at
> `:498`** stays [`0251`](../0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md)'s
> (measured 2026-08-13: `:498`'s §9.1 still says *"eight `node --test` contract suites"*, disk says
> **20** — ⛔ **report it, do not fix it**). **A citation fix at `:415` is not licence to touch a
> count in §9.**

### The second half: `0257` shifted this file's OWN line numbers — and by more than was recorded

**⛔ READ THIS BEFORE USING ANY NUMBER FROM ANYWHERE. THE RECORDED SHIFT FIGURE IS WRONG.**

`0257`'s `worklog.md` records the residual as: *"the `architecture.md` edit turns 2 lines into 6, so
that file's own line numbers past `:399` shift by **+4**."* **That figure accounts for one edit and
misses the rest of the same task's changes to the same file.**

**Measured directly 2026-08-13** — `git show HEAD:…architecture.md | wc -l` → **604**;
`wc -l` on the working tree → **620**. **The total is +16, not +4.** From
`git diff -U0`'s own hunk headers:

| Old (`HEAD`) line range | Maps to | Shift |
|---|---|---|
| `1`–`387` | same | **0** |
| `388`–`390` | **rewritten** as new `388`–`404` | ⚠️ **no arithmetic mapping — re-derive by content** |
| `391`–`577` | `405`–`591` | **+14** |
| `577` | **rewritten** as new `591`–`593` | ⚠️ **re-derive by content** |
| `578`–`604` | `594`–`620` | **+16** |

Cross-checked against the diff's own hunk headers: `@@ -395 +409 @@` and `@@ -429 +443 @@` both
confirm **+14**; `@@ -577 +591,3 @@` adds the further **+2**.

⚠️ **This makes a fifth instance of the pattern this task exists to break: a correction that was
itself wrong.** ⛔ **Re-derive the map from disk before you use it. Do not trust the table above
either** — `0257`'s history is four such cases and this brief has just added a fifth by finding one.

### What this means for citations POINTING AT `architecture.md`

Every `architecture.md:NNN` written elsewhere before 2026-08-13 and aimed at old line **391 or
later** is now off. Measured 2026-08-13 with
`grep -rnoE 'architecture\.md:[0-9]+([,-][0-9]+)*'`, excluding `tasks/done/` and `tasks/cancelled/`:

| Site | Cites | Note |
|---|---|---|
| `claude/skills/fkit-wiki-lint/SKILL.md:184` | `:390` | ⛔ **`0280`'s — the citation is FABRICATED and `0280` deletes it.** See the fence. |
| `ai-agents/knowledge-base/decisions/adr-016-…md:192` | `:397` | Live ADR. |
| `ai-agents/sprints/backlog.md:101` | `:453` | Live board row. |
| `ai-agents/tasks/backlog/0145-…/brief.md:21`, `:81` | `:453` | Live open brief. |
| `ai-agents/knowledge-base/reports/2026-07-11-…md:84` | `:394` | ⚠️ A **dated report** — a snapshot of one day. **Frozen or correctable? Surface the question.** |
| `ai-agents/knowledge-base/reports/2026-07-14-…md:275` | `:397` | Same class. |
| `ai-agents/sprints/done/sprint-2.md:197`, `:1432` | `:453` | ⛔ **Archived sprint — frozen history.** |
| `test/fixtures/closed-rank-0174-before.md`, `-after.md` | `:453` ×2 each | ⛔⛔ **TEST FIXTURES — see the fence. Editing these breaks the closed-rank suite.** |

⚠️ **That sweep used one pattern on one day and excluded closed tasks. Re-derive it.** Other forms
exist in the repo (`architecture.md §9.1`, `` `architecture.md:4,82` ``, bare `architecture.md:101`
without backticks).

## What to build

**Two sweeps over citations, both mechanical, both complete. A spot-check does not satisfy this
task** — spot-checking is exactly what produced nine misses.

### A. Outbound — every citation written *inside* `architecture.md`

1. **Enumerate them all.** Measured 2026-08-13 the file carries **13** `claude/fkit-claude.sh:NNN`
   citations and roughly **17** more aimed at other files (`install.sh` ×9,
   `claude/fkit-claude-init.sh` ×5, `claude/skills/…`, `repair.sh`, `check.sh`, `bin/release.mjs`,
   `package.json`, `CLAUDE.md`, and two `ai-agents/knowledge-base/…` pointers). ⛔ **Re-derive the
   list; do not work from those counts.**
2. **Resolve every one against disk** and record a verdict per citation: *correct* / *corrected, was
   `X` now `Y`* / *fenced, owned by task NNNN* / *unresolvable, reported*.
3. **Correct in the durable form.** The project's own lesson, stated in `0257`'s brief: *"the durable
   anchors are the quoted text, not the numbers."* Where a citation can carry the quoted text or a
   function name alongside the number, **give it one** — see
   [`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md) and
   [`0160`](../../done/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md), which
   own the convention itself. ⛔ **This task applies whatever convention is on disk; it does not
   invent one.**
4. ⛔ **Correct the citation, never the prose.** Every claim the citations attach to is accurate. If
   a *claim* looks wrong, **report it — do not fix it.**

### B. Inbound — every citation elsewhere pointing *at* `architecture.md`

5. **Re-derive the shift map from disk** (`git diff` against the commit that last contained the
   pre-`0257` file). ⛔ **Do not use this brief's table.**
6. **Sweep for inbound citations**, more than one pattern, and resolve each: correct the live ones,
   fence the frozen ones, report the ambiguous ones.
7. ⚠️ **Where a shifted line falls inside one of the two REWRITTEN ranges, arithmetic does not
   apply** — the content changed. **Re-derive by reading what the citing text claims and finding it.**

### C. Surfaced for consideration — NOT pre-decided, NOT required

8. **Could a guard test catch stale line citations mechanically?** A test that parses
   `` `path:NNN` `` citations out of the docs and asserts the target file has that many lines — or,
   stronger, that a quoted fragment still appears near it. ⚠️ **Genuinely open**: the weak form
   catches almost nothing, the strong form needs a quotable anchor the current corpus mostly lacks,
   and a noisy guard that people learn to ignore is worse than none. **The plan should reach a
   recommendation with its reasoning. It may legitimately be "infeasible" — say why.** ⛔ **Do not
   build it without approval at the plan gate**, and if it is built it needs a `prove-red` mutation
   like everything else (`test/prove-red.sh`, seventeen mutations today, hand-maintained header at
   `:20`, `:24-43`).

### ⛔ Out of scope — the fences

- ⛔ **§9's test-suite inventory count.** That is
  [`0251`](../0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md)'s, and it has been
  **deliberately preserved byte-identical across several tasks.** ⚠️ `0251` also carries a **dated
  correction note** changing what its own step 3 requires. ⛔ **Do not update a suite count, a
  mutation count, or the §9.1 framing — not even one that is obviously stale. Report it.**
- ⛔ **`architecture.md:375`'s `fkit-adversarial-review` parenthetical.** That is
  [`0275`](../0275-correct-the-stale-adversarial-review-citations-in-architecture-mds-review-walkthrough/brief.md)'s,
  under its own bright-line rule (*"Do not sweep other citations in `architecture.md`"* — the mirror
  of this fence). ⚠️ **It sits at old line `375`, below the shift boundary, so this task's map does
  not move it.**
- ⛔ **`architecture.md:49` and `:372`.** Those are
  [`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md)'s.
- ⛔ **`claude/skills/fkit-wiki-lint/SKILL.md:184`.** Its `architecture.md:390` citation is
  **fabricated** — the quoted string does not exist — and
  [`0280`](../0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md)
  **deletes it**. ⛔ **Do not repair it into a correct citation. That is the one outcome `0280`
  forbids.**
- ⛔ **`test/fixtures/closed-rank-0174-before.md` and `-after.md`.** ⚠️ **These are test fixtures whose
  byte content IS the assertion** — `test/closed-rank-immutability.test.js` reads them. Editing a
  citation inside them changes what the suite tests. ⛔ **Never touched by a citation sweep.**
- ⛔ **`ai-agents/sprints/done/sprint-2.md` and anything under `ai-agents/tasks/done/` or
  `cancelled/`** — frozen history. A closed record that is now false is corrected by an **appended
  dated note**, never an edit (the convention `0193`/`0201`/`0218` follow). ⛔ **This task does not
  append those notes either — report what needs one.**
- ⛔ **Any prose claim.** Citations only.
- ⛔ **Any `ai-agents/wiki-vault/` write** (ADR-005).
- ⛔ **No new devDependency** (ADR-014). ⛔ No commit, no re-rank, no task-file move (ADR-033).

## Verification steps

1. **The enumeration is complete and machine-derived.** Paste the command that produced the citation
   list and its full output, for **both** directions. ⚠️ **A hand-written list does not satisfy this
   step** — the task exists because hand-checking missed nine.
2. **Every citation has exactly one recorded verdict.** ⛔ One line per citation. A batch verdict such
   as *"the rest were correct"* does not satisfy this step; ⚠️ **that is precisely the shape of claim
   that was wrong four times inside `0257`.**
3. **Every corrected citation resolves.** For each, show the new coordinate **and** the line content
   found there. ⛔ **Do not assert "verified" without showing what you read.**
4. **The shift map was re-derived, not inherited.** Show the diff/commit you derived it from and state
   where it differs from this brief's table. ⚠️ **This brief's table is itself a correction of a
   recorded `+4` that was wrong — expect to find a sixth error, and say so if you do.**
5. **Every fence held.** Name each fenced item and show it is byte-identical: §9's counts, `:375`,
   `:49`, `:372`, `fkit-wiki-lint/SKILL.md:184`, both `closed-rank-0174` fixtures, `sprint-2.md`, and
   everything under `done/`/`cancelled/`. ⛔ **`git diff --stat` must show zero changes under
   `test/fixtures/`, `ai-agents/tasks/done/`, `ai-agents/tasks/cancelled/` and
   `ai-agents/sprints/done/`.**
6. **No prose sentence changed.** Show the diff and confirm every hunk is a citation string only.
7. **The guard-test question has a recommendation with reasoning** — built, or declined with the
   reason stated. ⛔ Not silently dropped.
8. **`npm test` green; state the measured pass/fail counts.** `test/prove-red.sh` green. ⚠️ **State
   plainly that no existing test reads a docs citation** — the suite passing proves nothing about
   this change. ⛔ **Do not imply coverage.**
9. **CI has never executed anything in this repo's history** beyond static review
   (`architecture.md:32-33`). ⛔ **Do not claim CI verification.**

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** the stale-citation set was surfaced across two passes of
  [`0257`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md) (closed
  2026-08-13) — its build (`worklog.md`, *"Not done, deliberately — surfaced instead of decided"*),
  its process-review, and its stateful review ledger. The **+4 line-shift residual** was folded into
  this row by the `/fkit-sprint-ship-loop` driver on **2026-08-13**, rather than renumbered under
  `0257`. ⚠️ **This brief's own measurement corrects that `+4` to `+14`/`+16`.**
- **⚠️ ORDERING — recorded as dated notes, deliberately NOT `Depends on:` edges** (the convention this
  board uses for soft ordering). **Measured 2026-08-13, four open rows touch this file or its
  citations:**
  - **[`0284`](../0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md)** —
    its step 3 edits `architecture.md` prose, **shifting these line numbers again**. ✅ **Run this row
    AFTER `0284`, or accept a second pass.** ⛔ **Never concurrently.**
  - **[`0275`](../0275-correct-the-stale-adversarial-review-citations-in-architecture-mds-review-walkthrough/brief.md)**
    and **[`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md)**
    — both edit `architecture.md` at lines **below** the shift boundary, so neither moves this task's
    map. ⛔ **Still never concurrently with this row** — three tasks editing one file at once is how a
    fence gets crossed by accident.
  - **[`0251`](../0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md)** — §9. ⚠️ **If
    `0251` runs first it will change §9's length and shift everything below it.** ✅ Prefer `0251`
    before this row.
  - ✅ **The better order is `0273` → `0275` → `0251` → `0284` → this row.** ⚠️ **It is a preference,
    not a gate** — this row is runnable at any time and the cost of running early is a second pass,
    not a wrong result.
- **On merit:** the **Backlog**, unranked. No behavior changes and no user sees the result. Its claim
  to attention is **compounding**: `architecture.md` is the file every role is told to read for
  anything below product-brief altitude, its citations are what a reader follows into the code, and
  the failure is silent — a wrong `:NNN` sends a reader to the wrong lines and they proceed from
  there. ⚠️ **Nine known-wrong citations in one file is not a tail case; it is the file's current
  state.**
- **Blast radius if never done:** a reader who follows `architecture.md:51` looking for the
  `exit 127` preflight lands in a comment about mirror lists, and `architecture.md:597`'s reader
  looking for the deterministic role routing lands in a JSON hooks string. Both then reason from the
  wrong code. **This has already happened inside `0257` — twice, in the review itself.**
- **⚠️ Every `:NNN` in this brief is a dated anchor measured 2026-08-13; the durable anchor is the
  quoted text. Re-measure every one of them.** ⚠️ **This brief is about stale citations and its own
  citations will go stale the moment any of the four ordering-related rows lands.**
- Filed 2026-08-13 by a spawned `fkit-producer` with **no owner channel**. It asked nothing, wrote
  nothing under `ai-agents/wiki-vault/`, moved no task file, changed no existing task's status,
  priority or location, and committed nothing.
- **⚠️ AMENDED 2026-08-13 — a tenth measured hit added to `## Context`; all prior text left
  byte-identical.** `architecture.md:415` cites `bin/release.mjs:66` for *"No npm-registry publish"*;
  the correct site is `bin/release.mjs:77`. ⛔ **It shares its line with the byte-preserved
  `**Version bumping is load-bearing**` sentence** — verification step 6 is the guard. Surfaced as a
  residual of `0252` (closed 2026-08-13), which could not fix it without failing its own gate. Owner
  provenance: ruled **"Amend 0251 and 0286, file nothing"** (`AskUserQuestion`, 2026-08-13, live
  `fkit lead` session) — an earlier producer spawn had been told to file a **new** brief for this and
  **refused, correctly**, because both facts were already owned by open rows and a third concurrent
  writer on `architecture.md` would have crossed a fence. ⛔ **No new task id was claimed.** The §9
  fence is unchanged: the count at `:498` remains `0251`'s. Written by a spawned `fkit-producer` with
  **no owner channel** — it changed no status, priority, board or owner, moved no file, wrote nothing
  under `ai-agents/wiki-vault/`, and committed nothing.
