# Review — 0381

Task: `ai-agents/tasks/backlog/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates/brief.md`
File(s) under review: `claude/skills/fkit-task-done/SKILL.md` · `claude/skills/fkit-task-cancelled/SKILL.md` ·
`test/mover-exemption-step.test.js` (new) · `test/reference-integrity.test.js` · `test/prove-red.sh`
(this task's hunks only — `run_mover_step_suite()`, gate `0o`, mutations 33/34, the index count) ·
`…/0381-…/worklog.md`
Status: in-review
Coverage: **both reviewers measured** (ADR-042 D1) — Codex ran `node --test` on both
`test/mover-exemption-step.test.js` (16/16) and `test/reference-integrity.test.js` and quoted the
guard's own `0 broken, 7 named-exempt` line; I re-measured `test:unit` (913/913), the full prove-red
hard gate, and ran four targeted mutation experiments of my own.

## Reviewer findings

| #  | Round | Sev    | Location | Claim |
|----|-------|--------|----------|-------|
| R1 | 1     | medium | `claude/skills/fkit-task-done/SKILL.md:335,338,342`; `claude/skills/fkit-task-cancelled/SKILL.md:254,257,261` vs `test/reference-integrity.test.js:511-518` | The clause routes the operator by three tokens — `missingCiter`, `targetIsBack`, "the broken-link arm" — that **never appear in the guard's runtime output**. `missingCiter`/`targetIsBack` exist only as JS identifiers and code comments; neither L4 assertion message nor the failing test name contains either token. An operator who greps a red run for the word the bullet names finds nothing and must infer the direction from English prose. Verified by replicating L4's asserts verbatim and reading the rendered message. ⚠️ 0341 inherits this verbatim. |
| R2 | 1     | medium | `claude/skills/fkit-task-done/SKILL.md:342-344` + `:350-353`; `claude/skills/fkit-task-cancelled/SKILL.md:261-263` + `:269-272` vs `test/reference-integrity.test.js:438-440` | The third-direction bullet **drops the guard's repair branch**. L2's own message offers two: *"Repair the link, or — if it is quoted or illustrative text rather than a pointer — add it to NAMED_EXEMPT with its reason."* The clause asserts the red **is** quoted text and needs a NEW key — converting a loud deterministic red into a silent exemption, the exact failure the plan rejects option B for. Compounding it, the `Attribute before touching anything` bullet that follows has **no referent** for an L2 red (there is no "named key" yet), so a literal read routes a fresh break to "reported as pre-existing and left alone" — contradicting the bullet three lines above. ⚠️ 0341 inherits this verbatim. |
| R3 | 1     | medium | `test/mover-exemption-step.test.js:386-525` (`source: readSkill(name)`) | T2–T11 match against the **whole SKILL.md**, not the extracted clause; only T12 works on the extracted block. So every pinned subject can be removed from the clause and relocated elsewhere in the file — in both movers — and the suite stays green. **Verified by construction**: deleting the `targetIsBack` delete rule from the clause and re-adding it under an `## Appendix` heading in BOTH movers leaves the suite **16/16 pass, 0 fail**. The suite's uniformity/presence claim therefore holds over the *file*, not over the *clause*. One-line fix: pass the extracted block as `source`. ⚠️ 0341 inherits this weakness. |
| R4 | 1     | low    | `claude/skills/fkit-task-done/SKILL.md:333`; `claude/skills/fkit-task-cancelled/SKILL.md:252` vs `test/reference-integrity.test.js:592-593` | The clause tells the operator to record the guard's `named-exempt: N` line. **No such string is emitted.** The guard prints `scanned 898 files, resolved 3492 link targets, 0 broken, 7 named-exempt` — number *before* the word, no colon. Measured by running the guard. Raised by both reviewers. |
| R5 | 1     | low    | `test/mover-exemption-step.test.js:563-572` | T13 is **vacuous and mis-titled**. Named "uniformity rejects a one-sided reword (the comparison is not vacuous)", it only asserts that two hard-coded literals differing in one character (`'y'` vs `'z'`) are unequal, plus that a fixture containing no board word contains no board word. It never invokes `extractBlock`, `dedent`, `forBoard`, or T12's comparison path, so it proves nothing about T12. T12's actual non-vacuity is held by its own `MIN_BLOCK_LINES` assert and by the extraction gate — both real. Effective pinning count is 15 of 16. |
| R6 | 1     | low    | `…/0381-…/worklog.md` § *"2. Red-first reproduction — AF1(a), both directions"* | The record mis-attributes the measurement. Quoted: *"That is the whole argument for `L4` being an equality arm rather than a ceiling, confirmed by measurement."* **`L3` is the equality arm** (`assert.equal(LIVE.namedExemptCount, 7)`); `L4` is a pair of `assert.deepEqual(…, [])` arms, where equality-vs-ceiling does not apply. And the measurement shows the opposite of what the sentence concludes: L3 is **blind** to a planted stale key, which argues for **L4 existing at all**, not for L3's form. The preceding sentence — *"a key that suppresses nothing is never counted"* — is **correct**, and I confirmed it against the counting loop at `test/reference-integrity.test.js:375` (`namedExempt++` fires only when a scanned link is both broken and matched). Record-accuracy only; 0341's author and the wiki ingest read this. |
| R7 | 1     | low    | `test/prove-red.sh:1543`, `:1580` | The "landed more than once" guards count **lines, not occurrences**: `grep -c 'mutation: delete rule inverted'` and `diff … \| grep -c '^>'` both return 1 for two substitutions on one line. ⭐ **Not exploitable as written** — both mutations' `sed` expressions omit the `/g` flag, so at most one substitution per line is possible. Recorded so a future edit that adds `/g` (or switches to `perl -pi -e`) does not silently disarm the guard. Raised by Codex; the non-exploitability is my own verification. |

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|

## Accepted residuals (shared, do-not-re-litigate)

- **Stale "All 28 prove-red mutations" count** — What: the count in `test/reference-integrity.test.js` and
  `test/coordination-citation-policy.test.js` is left stale rather than half-fixed · Why (structural):
  pre-existing (already stale at 32 before this task) and half of it lives outside 0381's fence; the build
  flagged it rather than making a partial repair · Re-raise only if: a task takes the whole surface.
- **`.claude/` mirror not refreshed** — What: `0381` ships canonical only · Why (structural): ruling **AF4**
  — the refresh is the owner's, after committing · Re-raise only if: the owner reassigns the refresh.
- **`fkit-task-cancelled` has no `OWN self-locators` block** — What: out of `0381`'s scope · Why
  (structural): ruling **AF3**; the row already exists as `0342` · Re-raise only if: `0342` is cancelled.
- **No renumbering of the movers' steps** — What: the clause extends step 5's tail · Why (structural):
  ruling **AF2**; both movers cross-reference their own step numbers in prose · Re-raise only if: the owner
  revisits AF2.
- **The suite guards source text, never behaviour** — What: nothing observes a mover actually running the
  guard during a close · Why (structural): the clause is prose in a SKILL.md; this is the reach of the
  fourth test-scope category · Re-raise only if: movers become executable.
