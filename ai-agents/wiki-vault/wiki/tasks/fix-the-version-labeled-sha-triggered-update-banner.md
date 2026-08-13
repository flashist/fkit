# Fix the update banner — it triggers on sha but labels with `VERSION`, so it reads `vX → vX`

**Source**: `ai-agents/tasks/done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-13
**Sprint/Tag**: Sprint 5 P11 (filed to Backlog 2026-08-08; carried onto Sprint 5, displaced by the re-rank of 2026-08-11) · task `0257` · owner `fkit-coder`

## Goal

**The launcher's update banner decided *whether* to fire from one fact and *what to say* from a
different one.** It triggers on **commit sha** inequality and labels **both sides** from `VERSION`, so
any commit that does not bump `VERSION` moved the sha while leaving both labels identical:

```
↑ fkit v0.1.30 → v0.1.30 is available. Run:  fkit update
```

⚠️ **Not an occasional post-bump blip — the steady state, and the numbers are large.** Measured
2026-08-08: **142 commits** on `main` since the last `VERSION` change, and **32 of 235 commits ever**
touched `VERSION` — so **~86% of commits produce a same-label banner.** *The banner is correct — there
really is newer content, because distribution is sha-keyed — but its wording tells the reader nothing
changed.* **The cost is a true signal that reads as noise.**

**A version bump does not fix this**, and the brief forbade writing the plan as if it did: a bump
relabels correctly for **one cycle**, then the very next non-bumping commit restores the defect.

## Key Changes

**New wording — only claim two versions when there really are two distinct known versions:**

```
  ↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update
  ↑ fkit v0.1.30 → v0.2.1 is available. Run:  fkit update      ← unchanged when versions differ
```

**A second defect in the same six lines, folded in:** `_fkit_remote_sha` falls back **git → curl**,
but `_fkit_remote_version` **requires curl**, so a git-only box rendered `v?`. ⛔ *"Do not leave `v?`
reachable."* The fix removes it by construction — the version segment is emitted only when non-empty.
⚠️ **There is no git fallback to add:** `git ls-remote` returns refs, not file content, and GitHub
refuses `git archive --remote`.

⛔ **Trigger semantics unchanged** — sha comparison stays; it is the correct trigger for a sha-keyed
distribution. ⛔ No `VERSION`, `install.sh` or `release.mjs` edit. ⛔ Throttle, silent-when-current,
silent-when-offline and source-checkout exclusion all preserved.

## Outcome

**Landed and verified on disk 2026-08-13** in `claude/fkit-claude.sh`, with the reasoning recorded as
a comment block at the site. Coverage landed too — `test/update-banner.test.js` exists, closing a gap
the brief measured as **zero**: no test anywhere mentioned the banner helpers.

### ⚠️ The scope boundary the fix states about itself, precisely

The change **removes the `v?` that the empty-version paths produced.** ⚠️ ***It is NOT validation*** —
both sides are only tested for non-emptiness, so a garbage remote `VERSION` still renders verbatim
(`"?"` → `v?`; an intercepted HTML error page → `v<!DOCTYPEhtml>`). **Deliberate: validating version
strings is a separate call.** *Recording the residual at its true strength is what stops a later
reader assuming the class is closed.*

### The brief's own figures went stale before the work started — and the correction is a model

A dated correction re-measured every number on disk (`VERSION` `0.1.30` → `0.2.1`, the 142-commit
counter → 0) while stating **⛔ read the second half first: the bug has NOT gone away.** The `0` was
**an artifact of where `HEAD` sat**, not evidence of health. **The ~86% figure was unchanged.** *The
durable anchors are the quoted text, not the line numbers* — the brief's own `:NNN` citations were
found to have been off by one or two when written.

⚠️ Closed `(agent-closed — not owner-verified)`. The vault resync this task predicted was filed
separately as `0285` and is **discharged by the 2026-08-13 sync**.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[systems/install-and-self-update]] — the page that quoted the old banner verbatim; corrected by this ingest
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — why a sha trigger is correct for a sha-keyed distribution
- [[tasks/build-claude-self-update]] — where the update check came from
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — the sibling release-hygiene row
- [[systems/testing-and-verification]]
