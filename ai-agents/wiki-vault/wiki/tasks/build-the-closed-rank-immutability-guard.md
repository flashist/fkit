# Build `test/closed-rank-immutability.test.js` — no closed row's rank ever changes

**Source**: `ai-agents/tasks/done/0182-build-the-closed-rank-immutability-guard/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-06
**Sprint/Tag**: Sprint 3 P2 · ID `0182` · owner fkit-coder

## Goal

Follow-up 5 of task `0174`'s decision report. Why it exists: the report found a breach of an absolute
rule that **no existing check caught** and that **both written records of the act claimed had not
happened** — `0174`'s insertion renumbered eight closed rows (`0151` `0147` `0150` `0157` `0161`
`0148` `0159` `0160`). The condition: no board row closed (`✅`/`⛔`/`➡️`) in the earlier revision
carries a different `P<n>` in the later one. **Rows are matched by folder ID, never by rank** —
matching by rank would make the guard's own key the thing it is testing. Hard-gated on `0181` (the
guard enforces the rule `0181` writes down). **This is the row the owner pulled onto Sprint 3 by
name** (*"Pull it into Sprint 3"*).

## Key Changes

**The blocking baseline decision was DISSOLVED, not answered** — owner rulings 2026-08-06 (*"Have the
architect decide it."* → architect delivered → *"No CI planned."* / *"Include it."*):

> ⚠️ **Dated correction 2026-08-13 (the `0282` resync; the quoted rulings above are left byte-identical and stand as an accurate record of what was said on 2026-08-06).** ***The `"No CI planned."` ruling was REVERSED.*** On **2026-08-08** the owner ruled *"fix it, not just record it"* on the release-gate question, and on **2026-08-12** [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] (`0256`) landed **`.github/workflows/test.yml`** — `npm test` on every push to `main` and every pull request. **Do not read the 2026-08-06 quote as fkit's current CI posture.** What that changes for *this* guard is worked through at the ceiling paragraph below.

- **Baseline = `HEAD`; scope = the transition currently in progress, not a history range.** The guard
  compares each board file's working tree against its `HEAD` blob, plus a second leg `HEAD`↔`HEAD^`
  (skips cleanly at depth 1). Criterion: *"A baseline must be a record you cannot rewrite in the same
  act that breaks the invariant."* Rejected by name: a committed rank manifest (its only repair path
  launders the breach into the baseline) and a git-history range (unbounded cost, permanent red).
  With no range, `0174`'s filing commit is **not red and not exempted — it is outside the guard's
  stated scope**: *a scope is a definition you state once; an exemption is a carve-out every future
  reviewer re-litigates*. The decision is recorded as an ADR by `0240` (Backlog).
- **Twelve architect corrections landed in the brief as the buildable spec**, the load-bearing ones:
  the glob covers `sprints/*.md` **and** `sprints/done/*.md` (live since the rollover archived
  Sprint 2) and excludes `backlog.md` with a stated reason (unranked by design); the join key is
  **(board basename, folder ID)** — a moved row legitimately holds two ranks on two boards; the
  parser **anchors to the `| Status | Priority | Task | Brief |` header under `## Status`** because
  the boards carry decoy addendum tables, and **fails loudly on an unexpected field count** — 8 of
  189 Sprint 2 rows mis-field under a naive split (7 escaped `\|`, **one bare `|` in a code span** the
  escaping fix cannot cover); a vacuous-pass assertion on a non-zero live closed-row count; the
  `0174` replay **kept as a fixture test over a pure exported comparison function** asserting exactly
  the eight rows; an explicit `➡️ Moved` rule (a source-board rank is frozen, never compared to the
  destination's).

## Outcome

**Its ceiling, stated so the guard is never oversold:** it is a **diff** check needing a git repo with
at least one commit (works at `--depth 1`; non-git trees skip with a stated reason); it asserts a
**transition, not a state**; it sees **only the current uncommitted transition plus the last committed
one** — a breach committed with no test run in that window is never caught, and **there is no CI, so
nothing runs it automatically**. ⛔ **Never present this guard as continuous protection.**

> ✅ **Dated correction 2026-08-13 (the `0282` resync; the paragraph above is left byte-identical). One clause is now false; the verdict it supports SURVIVES on a narrower reading, and the two must not be collapsed.**
>
> - ❌ ***"there is no CI, so nothing runs it automatically"* is FALSE.** This is a `test/*.test.js` file, so `npm test` runs it, and `.github/workflows/test.yml` runs `npm test` on every push to `main` and every pull request (`0256`, 2026-08-12). **It now runs automatically.**
> - ✅ **⛔ *"Never present this guard as continuous protection"* STANDS.** It still asserts **a transition, not a state**, and leg 2 compares **`HEAD` against `HEAD^` only** — so a CI run over a **multi-commit push inspects exactly one transition**, and a breach in a middle commit is still never caught. **CI closed the "nobody ran it" hole. It did not widen the guard's scope.**
⚠️ Prove-red gap flagged at spec time: none of `prove-red.sh`'s 14 mutations reaches `ai-agents/`,
and prove-red must never edit the real boards — the pure-function fixture shape supplies the mutation
seam; tasks `0214`/`0215` sit on that ground.

## Related
- [[tasks/narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank]] — task `0181`, the hard gate: the rule this guard enforces
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the decision behind the invariant
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174`, the report (its follow-up 5) and the eight-row fixture case
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the board; the rollover is what made the `done/` glob correction live
- [[tasks/assert-task-ids-are-unique-in-the-test-suite]] — the vacuous-pass-assertion precedent (`test/task-id-uniqueness.test.js`)
- [[systems/testing-and-verification]]
- [[systems/fkit]]
- [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] — task `0185`, the rollover that pulled this row from the Backlog board onto Sprint 3
- [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] — ⚠️ *Added 2026-08-22:* task `0306` — ⛔ **this task's two frozen replay fixtures hold 16 stale `task 43` numerals that must NEVER be swept.** The binding reason is a contract, not a test outcome: the suite declares them byte-exact copies of two named commits, so editing a numeral **falsifies that declaration even where no assertion trips**
