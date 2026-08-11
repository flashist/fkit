# Fix the update banner — it triggers on sha but labels with `VERSION`, so it reads `vX → vX`

## ID
0257

## Sprint
Sprint 5

## Priority
Sprint 5 P11

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**The launcher's update banner decides *whether* to fire from one fact and *what to say* from a
different one.** `claude/fkit-claude.sh:135-142`, verified 2026-08-08:

- **Trigger** — `remote="$(_fkit_remote_sha)"`, `installed="$(_fkit_verfield sha)"`, fire when
  `[ "$remote" != "$installed" ]`. Commit shas.
- **Label** — `curver="$(_fkit_verfield version)"` (the installed `VERSION` string, written into
  `$share/.version` by `install.sh`) and `rver="$(_fkit_remote_version)"` (raw `VERSION` fetched from
  `$repo/$ref`), printed as `↑ fkit v%s → v%s is available. Run:  fkit update`.

Any commit on `main` that does not change `VERSION` moves the sha while leaving both labels
identical, so the banner reads **`↑ fkit v0.1.30 → v0.1.30 is available.`**

**⚠️ This is not an occasional post-bump blip — it is the steady state, and the numbers are large.**
Measured 2026-08-08 on this repo:

- **142 commits** on `main` since the last `VERSION` change (`2055dad Release v0.1.30`), whose
  subjects are `Tasks update`, `Wiki sync`, `Sprint and tasks update`, and so on.
- Across the whole history, **32 of 235 commits** touched `VERSION` — so roughly **86% of commits
  produce a same-label banner** for anyone installed at the preceding release.

So **anyone sitting on the v0.1.30 install has been told `v0.1.30 → v0.1.30 is available` for 142
commits.** The banner is *correct* — there really is newer content, because distribution is
sha-keyed — but its wording tells the reader nothing changed, which trains them to ignore it. That is
the actual cost: **a true signal that reads as noise.**

**A version bump does not fix this, and the plan must not be written as if it does.** Bumping to
`0.2.0` relabels the banner correctly **once**, for people currently on `0.1.30`. The moment they
take the update they land on a commit whose `VERSION` then stops moving, and the very next
`Tasks update` commit puts them back to `v0.2.0 → v0.2.0`. The bump is worth doing for its own
reasons; it treats the symptom for one cycle.

**A second defect sits in the same six lines, and it is worth fixing in the same change.**
`_fkit_remote_sha` (`:79-89`) falls back **git → curl**, but `_fkit_remote_version` (`:91-97`)
**requires curl** — `command -v curl >/dev/null 2>&1 || return 0`. On a machine with git and no
curl the trigger works and `rver` is empty, so the banner renders **`↑ fkit v0.1.30 → v? is
available.`** Verified by reading both helpers 2026-08-08.

**No test covers any of this.** `grep -rn "remote_version\|curver\|rver" test/*.test.js` returns
nothing (2026-08-08) — `test/launcher-contract.test.js` covers the argv contract, not the banner.

**Constraint that must survive whatever lands.** The banner's design properties are recorded in
[`architecture.md`](../../../knowledge-base/architecture.md) §5 and the vault's
`systems/install-and-self-update` page: it **only ever prints**, never auto-updates, never re-execs;
throttled; time-boxed to 5 s; **silent when current and silent when offline**; source checkouts
excluded. **None of those may be weakened** — this is a wording/label fix, not a behavior change.

## What to build

**Weigh the options; the defect is agreed, the remedy is not pre-decided.**

1. **Options to consider, at minimum:**
   - **Label with what actually differs** — show the short shas alongside or instead of the version
     when the two version strings are equal (e.g. `v0.1.30 (a1b2c3d → 9f8e7d6)`). Truthful, needs no
     release-process change. Cost: a sha means little to most readers.
   - **Word the equal-version case differently** — keep versions when they differ, and say something
     like *"newer content is available on `main`"* when they do not. Cheapest honest fix; no new data
     fetched.
   - **Show how far behind** — a commit count. Truthful and legible, but needs a second network call
     the 5 s budget may not afford; weigh against the silent-on-failure rule.
2. **Fix the curl-only `_fkit_remote_version` asymmetry in the same change** — either give it the
   same git fallback its sibling has, or make the empty-`rver` case render a sentence that is not
   `v?`. **Do not leave `v?` reachable.**
3. **Add coverage.** `test/launcher-contract.test.js` is the natural home. At minimum: equal-version
   + differing-sha renders the new wording and **not** `vX → vX`; empty `rver` renders no `v?`; and
   the silent-when-current and silent-when-offline paths still print nothing. Extend `prove-red.sh`
   if the existing mutation set does not already prove the new assertions fail against a broken copy
   (ADR-026 — hand-rolled by decision; do not reach for a library).

### ⛔ Out of scope

- ⛔ **Bumping `VERSION`, or any edit to `bin/release.mjs`.** The `0.2.0` bump is the owner's own act
  and is not this task's; this task must be correct whether or not it happened.
- ⛔ **Any change to trigger semantics.** Sha comparison stays — it is the correct trigger for a
  sha-keyed distribution (ADR-015 Context §4). This task changes what the banner *says*, never when
  it fires.
- ⛔ Auto-updating, re-execing, prompting, or removing the throttle, the 5 s ceiling, the
  silent-on-failure behavior, or the source-checkout exclusion.
- ⛔ `install.sh` and the `.version` file format — unless an option genuinely requires a new field,
  in which case **stop and escalate** before changing a file every existing install already wrote.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005). The vault's `systems/install-and-self-update` page
  quotes the banner text verbatim and will need a resync — file it as a follow-up, do not write it.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. **Reproduce first, in the worklog, before fixing.** Drive the check with a `$share/.version`
   whose `sha` differs from `main`'s head and whose `version` equals `main`'s `VERSION`, and record
   the literal `vX → vX` line it prints today.
2. After the fix, the same input renders wording that does not assert two equal versions, and the
   differing-version case still renders the familiar `v0.1.30 → v0.2.0` form.
3. The curl-absent path renders no `v?`. Prove it by running with `curl` masked off `PATH`, not by
   reading the code.
4. **Silence is preserved** — a `.version` whose sha equals `main`'s head prints nothing; an offline
   run prints nothing and exits 0 within the 5 s budget.
5. `npm test` green, with the new assertions present and `prove-red.sh` proving they can fail.
6. `git diff --stat` touches `claude/fkit-claude.sh` plus test files only — no `install.sh`, no
   `VERSION`, no `bin/release.mjs`.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Correction to the filing description, after measuring on disk (2026-08-08):** the framing was
  *"reads `vX → vX` again one commit after any bump."* It is one **non-bumping** commit after — and
  since ~86% of commits do not bump, that is the **normal** state, not an edge case. It has held for
  **142 consecutive commits** on `main` right now. The rest of the description — sha-triggered,
  version-labeled, and the bump treating the symptom — is confirmed exactly as stated.
- **New finding not in the description:** the curl-only `_fkit_remote_version` asymmetry (`v?`),
  folded into scope above because it lives in the same six lines and shares the fix's test setup.
- Related: [`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md)
  documents the same `VERSION`-vs-sha distinction on the maintainer side. No dependency either way —
  but if both land, they should not end up describing the banner differently.
- Verified 2026-08-08: `claude/fkit-claude.sh:79-89`, `:91-97`, `:135-142`; `install.sh:52-70`;
  `git rev-list --count 2055dad..HEAD` → 142; `git log --oneline -- VERSION | wc -l` → 32 of 235;
  no banner assertions in `test/`.
- Filed to the **Backlog** board — no sprint named; no re-rank (ADR-035).

- **⚠️ EVIDENCE CORRECTION, 2026-08-10 — THE FIGURES ARE STALE. THE DEFECT IS NOT.** Everything above
  is left **byte-identical**. **⛔ Read the second half of this bullet before the first: the bug has
  NOT gone away, nothing about it was fixed, and this task is not smaller than it was.** Only the
  numbers that *illustrate* it moved, because **the `VERSION` bump the brief puts out of scope has
  already happened.**

  **The stale figures, re-measured on disk 2026-08-10 (not carried from any report):**

  | Brief says (2026-08-08) | Measured 2026-08-10 | Command |
  |---|---|---|
  | `VERSION` is `0.1.30` | **`0.2.1`** | `cat VERSION` |
  | last bump `2055dad Release v0.1.30` | **`692b8e9 Release v0.2.1`** (2026-08-08) | `git log -1 -- VERSION` |
  | **142** commits since the last `VERSION` change | **0** | `git rev-list --count 692b8e9..HEAD` |
  | **32 of 235** commits ever touched `VERSION` | **33 of 236** | `git rev-list --count HEAD`; `git log --format='%h' -- VERSION \| wc -l` |
  | ≈ **86%** of commits produce a same-label banner | **≈ 86%** — *unchanged* | 203 ÷ 236 |

  ⚠️ **The `0` is not evidence of health — it is an artifact of where `HEAD` sits.** `692b8e9` **is**
  `HEAD`: the release commit is the newest commit, and roughly 25 files of this sprint's work are
  sitting **uncommitted** in the working tree. The counter reads `0` today and starts climbing with
  the **first non-bumping commit**. `git diff -- VERSION` is empty — the file's content matches
  `HEAD`.

  **⛔ THE DEFECT IS UNCHANGED AND STILL REAL — re-verified line by line on disk 2026-08-10.** The
  launcher still triggers on **sha** inequality and labels **both sides** from `VERSION`, so a
  same-label banner is still the **steady state**, exactly as the brief argues:
  `claude/fkit-claude.sh:136-138` (`remote` vs `installed`, both shas), `:139`
  (`rver`/`curver`, both `VERSION` strings), `:142-143` (the `↑ fkit v%s → v%s is available.`
  printf). The **second defect is also unchanged**: `_fkit_remote_version` at `:92-98` is still
  curl-only, gated at `:93`, while `_fkit_remote_sha` at `:79-91` still falls back git → curl — so
  `v?` is still reachable. `grep -rn "remote_version\|curver\|rver" test/*.test.js` still returns
  **nothing**. The launcher's last commit is `0bc2b36` (2026-08-07) — it has **not been touched**
  since this brief was filed.

  **What the bump actually did:** it relabelled the banner correctly for **one cycle**, for anyone
  installed at `0.1.30`. The brief predicted this at *"A version bump does not fix this"*; that
  paragraph is now **demonstrated rather than predicted**, and it is the reason the out-of-scope
  bullet forbidding a `VERSION` edit still stands. (The bump landed as `0.2.1`, not the `0.2.0` the
  brief names — same act, different number.)

  **Verification step 1 still works exactly as written — it re-derives live.** It builds a
  `$share/.version` fixture whose `sha` differs from `main`'s head and whose `version` equals
  `main`'s `VERSION`; it reads no figure from this brief. Today it will print
  **`↑ fkit v0.2.1 → v0.2.1 is available.`** instead of the `v0.1.30` form. **Record whatever it
  actually prints on the day, not this string.** It needs network access for `_fkit_remote_sha`,
  which was already true when the step was written.

  **Line-anchor drift, also re-measured:** the `Verified 2026-08-08` bullet cites `:79-89`, `:91-97`
  and `:135-142`. Measured 2026-08-10 the true ranges are **`:79-91`**, **`:92-98`** and
  **`:136-143`**. The file has not changed since, so these were off by one or two when written. **The
  durable anchors are the quoted text, not the numbers.**

- **⚠️ CARRY CORRECTION, 2026-08-10 — THE CLOSING LINE ABOVE IS NOW FALSE.** *"Filed to the
  **Backlog** board — no sprint named; no re-rank (ADR-035)"* is left **byte-identical**; it was true
  when this brief was filed on **2026-08-08**, and was falsified when the brief was **carried onto
  Sprint 5** by owner ruling of **2026-08-10** (verbatim option label **"Dashboard + all of
  0252-0258"**). The header fields moved in that same act and are the authority:
  **`## Sprint: Sprint 5`**, **`## Priority: Sprint 5 P11`**. **Plan this work against
  [`sprint-5.md`](../../../sprints/sprint-5.md), not the Backlog board.**
  ⚠️ **No drift check fires on this, and none will:** `dashboard.sh` reads the `## Priority`
  **field**, not brief prose, so the machine cannot see a stale closing line — only a reader working
  bottom-up can. Task
  [`0235`](../0235-cross-check-a-briefs-status-field-against-its-own-prose/brief.md) covers this
  class generally and is **neither widened nor closed** by this note.
