# Build the link-resolution guard — `test/reference-integrity.test.js`, with the exemptions in the definition from day one

**Source**: `ai-agents/tasks/done/0354-build-the-link-resolution-guard/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P4` · task `0354` · owner `fkit-coder`

## Goal

Ship the guard that makes a broken relative markdown link inside the coordination tree a **test
failure** rather than something a future sweep discovers. ⛔ **The condition is NOT this brief's to
invent — it is `0353`'s deliverable**, and §4.1 is **a script to transcribe, not prose to re-derive**.

⭐ **The lesson `0176` paid for, inherited verbatim:** the exemptions must be in the guard's
**definition** from day one, never a post-filter bolted on afterwards.

## Key Changes

**`test/reference-integrity.test.js`.** Two exemption mechanisms, and they are different in kind:

- ⛔ **One path exemption only — `ai-agents/wiki-vault/**`** ([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]).
  Owner-ruled 2026-08-29. ⭐ **Nothing else is exempted by path**, and in particular ⛔ **a broken link
  planted in a closed task folder must FAIL the guard** — closed folders are *in* scope.
- ⭐ **`NAMED_EXEMPT` — six instances exempted BY NAME**, keyed on a `(file, target)` pair. ⛔ **Carry
  the list and its stated cost:** keying on `(file, target)` means the exemption survives changes that
  should have invalidated it.

⭐ **Four blind spots the guard must disclose alongside its pass**, each with a measured cost:

- **Blockquote lines are skipped** — **8 instances across 6 files** hidden, all inspected.
- **Anchor existence is never checked** — `path#fragment` resolves the file part only.
- **Reference-style definitions (`[a]: url`) are out of scope**, by name; cost measured **0** today.
- **The link grammar is narrower than the ruled class** — nested label brackets and balanced parens.

⛔ **Report the red run, not only the green one.**

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`. ⭐ **The guard was GREEN on arrival** — the red set
`0355` existed to clean measured **0** under the settled condition, which is why `0355` was cancelled
rather than run. ⛔ The brief's earlier bullet *"this guard may legitimately ship red"* is therefore
**falsified**, and the brief records that rather than deleting it.

⚠️ **`0176`'s guard is a sibling, not a duplicate** — different condition, different failure. ⛔ Keeping
them separate is deliberate; §4.1 and §4.2 share structure, and the brief flags the drift risk rather
than resolving it by merging.

⚠️ **All figures in the brief are as-of 2026-08-30 and were taken while `0353`'s condition document
was still under review (round 2).**

- **Depends on:** `0353` — hard.
- **Blocks:** `0356`, `0357`, `0358` — ⛔ **hard, and Sprint 7's loudest sequencing rule.**

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/settle-the-reference-integrity-condition-once-for-both-halves]] — `0353`, whose §4.1 this
  transcribes
- [[tasks/build-the-coordination-citation-policy-guard]] — `0176`, the sibling guard on §4.2
- [[tasks/clean-the-in-scope-broken-link-red-set]] — `0355`, cancelled because this guard arrived green
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] ·
  [[tasks/sweep-b-the-single-site-correction-notes]] ·
  [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]] — the three sweeps this guard gates
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the sole path exemption's authority
- [[decisions/adr-014-how-fkit-tests-itself]] — the zero-devDependency test contract this obeys
- [[systems/testing-and-verification]] — the suite this joined
