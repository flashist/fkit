# Refresh architecture.md §9.1's test-suite inventory — count and enumeration to match disk

## ID
0251

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Docs drift, surfaced during `0248`'s planning and verification (2026-08-07)** — see
[`0248`](../../done/0248-update-the-docs-for-the-structure-check-capability/brief.md)'s `plan.md`
§Explicitly-not-touched and its review. Filed as its own task on the owner ruling relayed at `0248`'s
plan gate (`AskUserQuestion`, 2026-08-07, verbatim **"File separate task (Recommended)"** on `0248`'s
open question 2).

The claim at
[`architecture.md`](../../../knowledge-base/architecture.md) §9.1 (line ~478 today) reads **"eight
`node --test` contract suites"** and enumerates eight by name. Verified against disk 2026-08-07:
`ls test/*.test.js` returns **19 files**.

**⚠️ The drift is larger than a sprint-4 ripple — re-derive from disk, do not patch.** The stale
eight plus the five sprint-4 structure suites (`structure-manifest` / `structure-spec` /
`structure-check` / `structure-repair` / `structure-notice`) is 13, not 19 — six further suites
(`askuserquestion-marker-hook`, `closed-rank-immutability`, `dual-home-parity`,
`shiploop-marker-hook`, `skill-frontmatter`, `turn-completion-hook`) accumulated across earlier
sprints without §9.1 moving. The enumeration must be rebuilt from `ls test/*.test.js`, not extended
by five.

Adjacent facts, verified 2026-08-07: `test/prove-red.sh`'s own header states **FIFTEEN mutations**
(line ~20), and `architecture.md` line ~440 (flow written by `0248`) already says "mutation 15" —
§9.1's prose states no mutation count today, so a count only enters §9 if the sweep finds one drifted.
The governing records stand unchanged:
[ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md) (how fkit tests itself)
and
[ADR-026](../../../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md)
(prove-red stays hand-rolled) — this task changes no claim either ADR makes.

## What to build

Docs-only refresh of `ai-agents/knowledge-base/architecture.md` §9 — nothing outside that file:

1. **§9.1's suite count and enumeration** — replace "eight `node --test` contract suites" and the
   eight-name list with the count and enumeration derived from `ls test/*.test.js` on the day the
   change is made (19 as of 2026-08-07; re-derive, don't copy this brief).
2. **Sweep the surrounding §9 prose for other drifted counts** — anything numbering suites, mutations
   (prove-red's list, 15 per the script's own header), or coverage that moved with the sprint-4
   additions. Update what is provably stale; leave accurate claims byte-identical.
3. **Keep §9.1's thesis intact** — the section's point is "a suite exists, no CI runs it". The
   inventory refresh must not soften or restate that risk framing.

   > **⚠️ DATED CORRECTION 2026-08-12 — THE THESIS QUOTED ABOVE IS DEAD. FOLLOWING THIS STEP AS WRITTEN
   > WOULD RE-BREAK §9.1. Text above left byte-identical.**
   >
   > **`0256` landed CI on 2026-08-12** — `.github/workflows/test.yml` runs `npm test` on every push to
   > `main` and every pull request — **plus an in-release `npm test` gate in `bin/release.mjs`**, and it
   > **already corrected §9.1** in the same act: the heading, the opening sentence, the old
   > `- **No CI.**` bullet and the closing residual paragraph. §11 OQ2 is closed. Provenance: the owner
   > reversed their 2026-08-06 *"No CI planned"* ruling themselves on 2026-08-08 and confirmed it
   > 2026-08-12 at `0256`'s plan gate, verbatim option label **"Approve — both gate and CI
   > (Recommended)"**; this amendment is filed on the owner ruling **"Amend both briefs now
   > (Recommended)"** (`AskUserQuestion`, 2026-08-12).
   >
   > **⛔ Do NOT restore "no CI runs it" anywhere in §9.** Do not reintroduce a `No CI` bullet. Do not
   > reword the heading back.
   >
   > **What this step now requires instead — the thesis to preserve is the one on disk:** *the suite now
   > runs automatically (CI plus the in-release gate), and what remains is **coverage, not automation** —
   > `install.sh` is still verified by nothing.* Read §9.1 as it stands before editing and keep that
   > framing. In particular, **leave these byte-identical unless a count inside them drifted**:
   > - the §9.1 heading and its opening sentence;
   > - the two `landed (task 0256)` bullets (CI, and the in-release gate);
   > - ⚠️ the **"Neither has been observed green on a runner yet"** bullet — **CI has never run**; this
   >   loop does not push, so the workflow is verified by static review only. **Do not soften, shorten,
   >   or delete that caveat, and never write that CI is working.**
   > - the closing "residual risk narrowed but did not close" paragraph.
   >
   > **⚠️ THIS TASK'S REAL JOB IS UNCHANGED AND STILL OUTSTANDING.** `0256` deliberately left §9.1's
   > **suite inventory** alone: the *"eight `node --test` contract suites"* sentence and its eight-name
   > list are **byte-identical and unreflowed on disk** (§9.1, around line 480 as of 2026-08-12 —
   > re-derive, do not cite). `ls test/*.test.js | wc -l` still returns **19**. Items 1 and 2 above stand
   > exactly as written; only item 3's thesis quote is corrected.

> **⚠️ DATED ADDITION 2026-08-13 — TWO ITEMS: A DRIFT-RATE DATA POINT, AND AN OPEN DECISION THE
> OWNER DEFERRED TO THIS TASK'S OWN RUN. All text above left byte-identical.**
>
> **(a) The figure moved again — and this note is evidence of the drift rate, NOT a number to copy.**
> Measured independently 2026-08-13:
> - `architecture.md:498` (§9.1) still reads **"eight `node --test` contract suites"** and still names
>   eight by hand — byte-identical, unreflowed.
> - `ls test/*.test.js | wc -l` → **20**.
> - ⚠️ **This brief's own body says 19** (measured 2026-08-07). Disk is now **20**:
>   `test/update-banner.test.js` landed since, from task
>   [`0257`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md).
> - ⚠️ **Task `0252`'s `worklog.md` says 21. That figure is WRONG — one high. ⛔ Do not propagate it.**
>
> ⛔ **Do not copy `20` into §9.1 from this note.** Items 1 and 2 above already require re-derivation
> from `ls test/*.test.js` **on the day the change is made**, so this task self-corrects — that
> instruction is the fix, and it stands unchanged. **The point of recording 8 → 19 → 20 → (and a
> wrong 21) is the drift rate**: three different figures inside six days, one of them a correction
> that was itself wrong. ⚠️ **This brief must never become a place where someone reads a number
> instead of measuring one.**
>
> **(b) OPEN DECISION — deliberately NOT pre-decided: should §9.1 stop enumerating suite names by
> hand at all?**
> A hand-maintained list of twenty filenames is precisely what rotted here in the first place, and it
> will rot again on the next suite. The alternative — state the count and the derivation command, drop
> the name list, or name only the notable groups — trades discoverability for durability.
> **Owner ruling 2026-08-13, verbatim option label "Leave it for 0251's own run"** (`AskUserQuestion`,
> live `fkit lead` session). ⛔ **It is not settled here.** It belongs to whoever plans this task,
> **with the owner present**, at the plan gate.
>
> ⚠️ **Whoever plans it must know this is not a wording choice — it changes this brief's own
> verification.** **Verification step 1 below currently *requires* a full enumeration**: *"every
> filename in §9.1's enumeration exists on disk (and vice versa — no suite on disk is missing from the
> enumeration)"*. Choosing *"stop enumerating"* means **amending verification step 1 in the same
> change**, not only the prose. ⛔ **Do not change §9.1's prose and leave step 1 contradicting it** —
> a verification step that cannot pass is worse than a stale count, because it silently converts every
> later run into a judgement call.

### ⛔ Out of scope

- ⛔ Any file other than `ai-agents/knowledge-base/architecture.md` — no README, no scaffold, no
  test changes.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005 — if a vault page mirrors the stale count, that is
  `fkit-wiki`'s repair; none was found in a 2026-08-07 grep, but the vault was not exhaustively swept).
- ⛔ Any behavior change anywhere — docs only.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. `ls test/*.test.js | wc -l` equals the count §9.1 states, and every filename in §9.1's enumeration
   exists on disk (and vice versa — no suite on disk is missing from the enumeration).
2. Any mutation count written in §9 equals the mutation list in `test/prove-red.sh` (the script's own
   header and its `--- Mutation N:` blocks are the ground truth).
3. `grep -n "eight" ai-agents/knowledge-base/architecture.md` returns no hit claiming eight test
   suites (the eighth-*role* mentions are unrelated and must survive untouched).
4. `git diff --stat` shows exactly one file changed: `ai-agents/knowledge-base/architecture.md`.
5. `git status --porcelain` shows nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- Provenance: `0248` open question 2, owner-ruled 2026-08-07 ("File separate task (Recommended)",
  `AskUserQuestion` via the live `fkit lead` driver session).
- Filed to the **Backlog** board — no sprint named; no re-rank (ADR-035).
- **⚠️ AMENDED 2026-08-12 — §9.1's thesis changed under this brief; `## What to build` item 3 is
  corrected in place.** `0256` landed CI (`.github/workflows/test.yml`) and an in-release `npm test`
  gate (`bin/release.mjs`) on 2026-08-12 and corrected §9.1's framing in the same act, so the *"a suite
  exists, no CI runs it"* thesis item 3 tells you to preserve **would now re-break the section**. Owner
  provenance: reversal taken by the owner 2026-08-08, confirmed 2026-08-12 (**"Approve — both gate and
  CI (Recommended)"**); this amendment ruled **"Amend both briefs now (Recommended)"**, 2026-08-12.
  **The count-and-enumeration job — this task's actual scope — is untouched and still outstanding:**
  `0256` left the *"eight `node --test` contract suites"* sentence byte-identical; disk says **19**.
  ⛔ CI has never run; do not let the refresh claim it works.
- **⚠️ AMENDED 2026-08-13 — a dated addition sits at the end of `## What to build`; all prior text
  left byte-identical.** Two things. **(1) The count drifted again**: measured 2026-08-13,
  `ls test/*.test.js | wc -l` → **20**, not the **19** this brief's body records from 2026-08-07
  (`test/update-banner.test.js` landed from `0257`). ⚠️ **`0252`'s worklog says 21 — wrong, one
  high.** ⛔ **Do not copy 20 either** — items 1 and 2 already require re-derivation on the day of
  the change; the figures are recorded as **evidence of the drift rate**, nothing more.
  **(2) An open decision**, owner-deferred: *should §9.1 stop enumerating suite names by hand?*
  Owner ruling 2026-08-13, verbatim option label **"Leave it for 0251's own run"** (`AskUserQuestion`,
  live `fkit lead` session) — to be taken at this task's plan gate, **with the owner present**.
  ⛔ **Choosing "stop enumerating" also requires amending verification step 1**, which currently
  mandates a full enumeration. Owner provenance for the amendment itself: **"Amend 0251 and 0286,
  file nothing"** (same session, same day) — a new brief was **not** filed, because this fact was
  already this row's. Written by a spawned `fkit-producer` with **no owner channel** — it changed no
  status, priority, board or owner, moved no file, wrote nothing under `ai-agents/wiki-vault/`, and
  committed nothing.
