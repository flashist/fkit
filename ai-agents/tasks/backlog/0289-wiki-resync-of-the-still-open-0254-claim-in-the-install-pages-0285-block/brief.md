# Wiki resync of the *"still-open `0254`"* claim in `systems/install-and-self-update`'s `0285` block

## ID
0289

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

### Authority

**Owner ruling 2026-08-13**, given live in a `fkit lead` session via `AskUserQuestion` and relayed
through the driver — **the option label is the verbatim text**: **"File a vault resync task"**.

### Provenance — this was found by a librarian who correctly refused to fix it

A spawned `fkit-wiki` librarian running [`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md)
noticed the stale claim while resyncing **the same page**, and **deliberately did not fix it** —
correctly, because `0258`'s scope is owner-ruled **`0252`-only**. It flagged it **in place on the
page** and in `ai-agents/wiki-vault/log.md` (measured 2026-08-13: `log.md:2092-2094`, which reads
*"the same-day `0285` block calls the unrunnable post-release verify command 'a SEPARATE, still-open
defect (task `0254`)'. `0254` is no longer open … Flagged in place on the page"*). The producer that
closed `0258` carried the flag forward. ⚠️ **Nothing currently tracks the debt. This row is that
tracking.**

### The stale claim — verbatim, measured on disk 2026-08-13

`ai-agents/wiki-vault/wiki/systems/install-and-self-update.md:79`, inside the **`0285` resync block**
under `### Release`:

> ⚠️ **The unrunnable verify command `bin/release.mjs` prints after a release is a SEPARATE,
> still-open defect** (task `0254`, Sprint 5): it prints an `npx github:…` line, but `package.json`
> has **no `bin` field**, so the command fails with *"could not determine executable to run"*.
> ⛔ **The fix is not to add a `bin` field** (no npm publish). ⚠️ **`RELEASING.md` does not exist
> yet** — task `0252` is still open, which is why the `0258` resync of this page has **not** run.

⚠️ **That block already carries ONE dated correction, immediately below it at `:81`** — the `0258`
resync, which falsified the block's *closing* sentence (`RELEASING.md` now exists) and **explicitly
declined** the `0254` clause: *"One further clause has since moved and is deliberately NOT corrected
here … and **owes its own resync** — the wiki does not file tasks."* ⛔ **Do not rewrite, reflow or
"tidy" that `0258` correction — it is a past dated entry and it is accurate.** This row adds a
**second** dated correction, or extends the correction layer, by the librarian's usual method.

### ⚠️⚠️ THE CORRECTION IS NEITHER "STILL OPEN" NOR "FIXED" — GETTING THIS HALF-RIGHT IS THE MAIN RISK

**Measured on disk 2026-08-13, three independent checks:**

1. **`0254` is closed.** Its folder sits at
   [`ai-agents/tasks/done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/`](../../done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md),
   and its brief's `## Status` reads **`✅ Done (agent-closed — not owner-verified)`** — ⚠️ **carry
   that marker's meaning; it is closed but not owner-verified.**
2. **The `npx` line is gone.** `bin/release.mjs:276` now reads, verified by `grep`:
   ```
     console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`);
   ```
3. **A narrower, separate defect set on the REPLACEMENT line is OPEN** as
   [`0288`](../0288-fix-the-post-release-verify-lines-failing-and-false-green-cases/brief.md)
   (`🔲 Backlog`, `## Owner: fkit-coder`), by owner ruling of the same day (verbatim labels
   **"File a follow-up task, ship 0254 now"** and **"Fold into the R1/R2 follow-up"**). It carries
   `0254`'s review findings **R1**, **R2** and **R5**:
   - **R1** — the summary block is guarded **only** by `dryRun`, so under `--no-tag` / `--no-push` it
     prints `✓ Released <tag>` followed by a verify that **exits 2**. ⚠️ **`--no-tag` ALONE also
     fires this, and that run DOES publish commits** — ⛔ so it is **not** confined to runs that
     publish nothing, and a page saying "only affects dry runs" or "only when nothing ships" would be
     **wrong**.
   - **R2** — under `--no-bump` over a tag that already exists on origin, the verify **exits 0**: a
     **false green** for a release the tag does not name.
   - **R5** — the tag-absent failure is **silent** (exit 2, empty stdout *and* stderr).
   - ⛔ **R4 (unquoted `${tag}`) is OUT of `0288`** — owner-ruled **"Unactioned — pre-existing"** the
     same day. ⛔ Do not write it onto the page as an open defect.

✅ **The defensible shape of the corrected text:** the **unrunnable-`npx`** defect is **fixed and
closed** (`0254`); a **narrower, separate** set of **flag-combination** defects on the **replacement
line** is **open** (`0288`). ⛔ **A resync that flips "still open" to a flat "fixed" has replaced one
over-simplification with another and has FAILED this task.**

### ✅ What in that block SURVIVES — sharpen, do not reverse

⚠️ **The `0285` block is otherwise accurate.** Specifically:

- ⛔ **"The fix is not to add a `bin` field" is STILL TRUE and must survive** — fkit does not publish
  to npm ([ADR-011](../../../knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md)
  is the settled ground `0288`'s brief also refuses to reopen — it cites the same ADR for the same
  point). ⚠️ **Verify the ADR filename on disk before citing it; this brief's path is a dated
  anchor.**
- ✅ **The pre-bump test gate, its load-bearing position, and its deliberate refusal to require a
  clean tree** — all `0256`'s, all unaffected.
- ✅ **The `0258` dated correction at `:81`** — accurate, stays byte-identical.
- ⚠️ **The historical description of the OLD defect is not wrong as history.** The `npx` line really
  did fail with *"could not determine executable to run"*. ⛔ **Do not delete the history; date it.**

### ⚠️ RE-DERIVE FROM THE LANDED CODE AND THE CLOSED BRIEFS — NOT FROM THIS BRIEF

⛔ **This brief is a pointer, not a source.** Every fact above is a dated measurement of 2026-08-13
and **this project has been bitten repeatedly by corrections that were themselves wrong.** Re-derive:

- `bin/release.mjs`'s printed verify line, **as it stands on the day this runs** (`0288` may have
  landed by then — see *Notes*);
- `0254`'s `## Status` and folder location;
- `0288`'s `## Status`, folder location and its **three** findings;
- the exact stale sentence and its surrounding correction layer on the vault page.

⚠️ **Every `:NNN` in this brief is a dated anchor. The durable anchor is the quoted text. Re-measure.**

### ⛔ THIS ROW RUNS IN A `fkit wiki` SESSION — NOT IN `/fkit-sprint-ship-loop`

`## Owner` is **`fkit-wiki`** and must stay that way. **Vault writes are that role's exclusively**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⚠️ **The sprint loop cannot run this row** — the same exclusion recorded on
[`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md),
[`0285`](../../done/0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md) and
[`0287`](../0287-wiki-resync-of-the-codex-sandbox-read-only-pages-after-0273/brief.md): **the loop
never reads `## Owner`**
([ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
fixes each step's role to the skill that step runs), so its **Build** step spawns `@fkit-coder`, and
that role may **never** write the vault. Driven by the loop this row either stalls on a refusal or
breaches ADR-005. **It runs in a `fkit wiki` session, or via a spawned librarian.**

⚠️ **That is an exclusion from the loop and from nothing else.** `## Status` stays `🔲 Backlog`. This
row is **NOT blocked**, **NOT deprioritised**, **NOT descoped**.

### ⛔ `log.md` IS APPEND-ONLY

**Owner ruling 2026-08-03, recorded on
[`0211`](../../done/0211-annotate-the-three-old-form-completion-flags-in-the-vault-log/brief.md).**
A past entry that is now false is corrected by **appending a new dated entry**, never by editing the
old one. ⚠️ **It bites here:** `log.md`'s `0285` sync entry (measured `:1928`) records *"the
still-open `0254` verify-command defect named"* — **true as believed when written**. ⛔ It stays
byte-identical; the correction goes in a **new dated entry**.

## What to build

A **targeted resync** of **one vault page**, run in a `fkit wiki` session under the librarian's own
procedure (`/fkit-wiki-ingest` on this page, or `/fkit-wiki-sync` — **the librarian's call which
fits**).

1. **Re-derive the four facts** listed under *"RE-DERIVE …"* above from disk. ⛔ Do not work from this
   brief's quotations. **State where what you measured differs from this brief, in both directions.**
2. **Correct the `0254` clause on `wiki/systems/install-and-self-update.md`** by the vault's dated
   correction form — the same form `0258` used at `:81` and the form `0239`/`0143`/`0199` established.
   The corrected text must carry **all three** of:
   - the **unrunnable-`npx`** defect is **fixed and closed** (`0254`, closed 2026-08-13,
     `✅ Done (agent-closed — not owner-verified)`);
   - **what landed** — the one-line replacement at `bin/release.mjs:276`, quoted from the code on the
     day, not from this brief;
   - a **narrower, separate, still-OPEN** set of flag-combination defects on that replacement line
     (`0288`), ⚠️ **including that `--no-tag` alone fires R1 on a run that genuinely publishes
     commits** — ⛔ the page may not imply the failure is confined to runs that ship nothing.
3. ⛔ **Leave every surviving claim in the `0285` block byte-identical** — the no-`bin`-field ruling,
   the pre-bump gate, its position, its clean-tree refusal, and the `0258` correction at `:81`.
4. **Cross-link the resync history** so the page's own trail is traceable: `0285` (the block being
   corrected), `0258` (the correction that flagged this clause and declined it), and this row. Use
   the vault's `[[…]]` link form as the page already does, and **check the link targets resolve**.
5. **Bidirectional link hygiene** — if the correction adds or changes a `[[…]]` link, fix the
   back-link on the far page. ⛔ **That is the ONLY circumstance in which this task touches a second
   page.**
6. **`log.md`: append one new dated entry.** ⛔ No existing entry edited.
7. **Record one verdict per site touched** — *corrected* / *correct as-is, because …* / *append-only,
   new entry written* / *out of scope, reported*. ⛔ A batch verdict does not satisfy this.

### Constraints

- ⛔ **SCOPE IS ONE PAGE** — `wiki/systems/install-and-self-update.md`, plus whatever bidirectional
  link hygiene step 5 requires. ⛔ **This is NOT a general vault sweep.** If a broad sweep would be
  valuable, **report it as a finding; do not run it here.**
- ⛔ **`log.md` is APPEND-ONLY** (owner ruling 2026-08-03, `0211`).
- ⛔ **Vault writes only.** Do not edit `ai-agents/knowledge-base/`, `claude/`, `bin/release.mjs`, or
  any source file. ⚠️ **If a knowledge-base page carries the same stale claim, REPORT it — do not fix
  it.**
- ⛔ **Do not edit any existing task brief**, including `0254`'s, `0258`'s, `0285`'s and `0288`'s.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  no re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  no board-row edit beyond this task's own close.
- ⛔ **No commit, no push.**

## Verification steps

Each step is runnable. **Paste the command and its output; do not assert.**

1. **The facts were re-derived, not inherited.** Show the output of, at minimum:
   ```
   grep -n "Verify tag on origin" bin/release.mjs
   grep -n -A2 "^## Status" ai-agents/tasks/done/0254-*/brief.md
   grep -n -A2 "^## Status" ai-agents/tasks/backlog/0288-*/brief.md
   ```
   ⚠️ **State explicitly where the measurement differs from this brief.**
2. **The stale sentence is gone or dated.** `grep -n "still-open defect" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md`
   — show the result and, if the original line survives under a dated correction (the expected
   method), show the correction that supersedes it.
3. ⛔ **THE PAGE DOES NOT OVER-CLAIM IN THE OTHER DIRECTION.** Quote the landed corrected text and
   show it says **all three** of: `0254` closed; the replacement line's text; `0288` **open**.
   ⛔ **A page that says the verify line is simply "fixed", with `0288` open, FAILS this step.**
   Run `grep -n "0288" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` and show a hit.
4. **The `--no-tag`-alone case is not understated.** Show the landed wording and confirm it does not
   say or imply the failure only affects runs that publish nothing.
5. **`0288` is still open at close time** — `ls -d ai-agents/tasks/backlog/0288-*` returns a path.
   ⚠️ **If it has closed, STOP and re-scope: the correct page text changes** (see *Notes*).
6. **Surviving claims are byte-identical.** `git diff` on the page shows the no-`bin`-field ruling,
   the pre-bump gate block and the `0258` correction at `:81` **unmodified**. Show the diff.
7. **`log.md`'s `git diff` is ADDITIONS ONLY** — zero modified, zero deleted lines. Show
   `git diff --numstat -- ai-agents/wiki-vault/log.md`. ⚠️ **Prove it; do not assert it.**
8. **Cross-links resolve.** Show that each `[[…]]` target this task wrote exists as a file, and that
   any back-link added is present on the far page.
9. **`git diff --stat` touches ONLY `ai-agents/wiki-vault/`** plus this task's own artifacts. Show it.
   ⛔ A hit on `bin/release.mjs` or on any existing brief is a failure.
10. **Full `npm test` green; state the measured counts.** ⚠️ **Expect it to prove NOTHING about vault
    prose** — no test reads vault page content. **Say so explicitly** rather than implying coverage.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Provenance:** flagged in place by the `fkit-wiki` librarian running
  [`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md)
  (closed 2026-08-13), which correctly declined to fix it as out of `0252`-only scope. Filed
  2026-08-13 on the owner's ruling of the same day, verbatim option label **"File a vault resync
  task"**.
- **Resync history of this one page**, for whoever schedules it:
  [`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md)
  (after `0252`, `RELEASING.md`) and
  [`0285`](../../done/0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md)
  (after `0257`, the banner + the 5 s time-box) — **both closed 2026-08-13, both this page.** This is
  the **third**. ⚠️ **A page resynced three times in one day is a signal**: whether a standing
  procedure should catch these at close time is worth a look, **but it is NOT this row's work.**
- ⚠️ **`0288` IS OPEN AND UNRANKED on the Backlog board** (verified 2026-08-13, `backlog.md:205`,
  `🔲 Backlog`, priority `—`). **So the corrected page must describe an OPEN defect.**
  ⛔ **If `0288` lands before this row runs, this brief's target text is stale on arrival** — the
  correction would then describe a defect that is itself fixed. Verification step 5 is the gate.
  ✅ **Preferred order: run this row BEFORE `0288`.** Recorded as a dated note, deliberately **not**
  a `Depends on:` edge — this board's soft-ordering convention (see `0256`→`0252`, `0282`, `0285`,
  `0287`).
- ⚠️ **Whichever order they run, the page will need another look if `0288` lands** — that second pass
  is a **known, accepted** future row, not a defect in this one. **Say so in the close** so the next
  producer files it rather than rediscovering it.
- ⚠️ **Ordering against [`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md)**:
  same hazard `0285` recorded — a resync that reads `architecture.md` as a source before its
  citations are repaired ingests coordinates that are already wrong. ⚠️ **This row should not need
  `architecture.md` at all**; if it does, **do not copy its `:NNN` pointers.**
- **On merit:** the **Backlog**, unranked, and that is honest. **Nothing waits on it, no behavior
  changes, no test reads vault prose, and it is not on the release path.** Its claim to attention is
  narrower than `0285`'s but of the same kind: the page asserts, in bold, that a defect is **still
  open** when the task fixing it closed the same day — **a checkable, falsifiable claim about the
  project's own state**, which is the sort a reader trusts most and questions least.
- **Blast radius if never done:** every role reads the vault before non-trivial work (per
  `/fkit-query`, treated as ground truth). Until this runs, a reader of the release section is told
  the printed verify command still emits an unrunnable `npx` line — ⚠️ **it does not** — and is told
  nothing about the real, narrower, still-open flag-combination defects that replaced it. **The page
  points at the wrong bug.**
- Filed 2026-08-13 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, **wrote nothing under `ai-agents/wiki-vault/`** (⛔ ADR-005 — this
  row's corrections are the `fkit-wiki` role's to write), **moved no task file**, **invoked no
  mover**, **changed no existing task's status, priority, sprint field or location**, **re-ranked
  nothing** (⛔ ADR-035), **edited no source file and no sprint plan other than adding this row to
  the Backlog board**, and **committed nothing**.
