# Rewrite the false "no CI" paragraph — and its fabricated citation — in `/fkit-wiki-lint`

**Source**: `ai-agents/tasks/done/0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P7` · ID 0280 · owner `fkit-coder` · shipped 2026-08-15

## Goal

The wiki librarian's own lint procedure carried a parenthetical justifying its ADR-number-collision check with **three defects at once**:

- **D1** — *"this project has no CI"* — **false** on the live tree since `0256` landed `.github/workflows/test.yml`.
- **D2** — *"there is no `.github/`"* — **false** for the same reason.
- **D3** — a citation `architecture.md:390: "There is no CI and no test suite"` — ⛔ **a fabricated quote**: that text appears nowhere in `architecture.md`, and the line it cites is actually about the `fkit update` notice.

⚠️ **The file this sits in ships to consuming projects**, so the false claim travelled.

## Key Changes

One edit, one file: the parenthetical closing check 5 of `claude/skills/fkit-wiki-lint/SKILL.md`. Single-homed — no manifest regeneration owed.

**The replacement is a two-case statement, not a deletion**, and it keeps the instruction intact:

- **Where an automated gate exists** — *"fkit's own repo runs the suite in GitHub Actions on every push to `main` and every pull request"* — the lint step is **genuine belt-and-braces**.
- **Where one does not** — *"the typical consuming project, with no `.github/` and nobody running the suite by hand"* — **nothing runs it at all, and this step may be the only thing that looks.**
- ⛔ **"Do not skip it in either case."**

⭐ **The example names "fkit's own repo", never a deictic like "this project"** — the file ships to consuming repos, where a deictic would rebuild D1 in a new form.

⭐ **The fabricated quote was deleted, not repaired, and NO replacement citation was added.** The brief permitted none; the new sentence asserts nothing needing a source; and `architecture.md`'s `:NNN` anchors are **demonstrably drifting** — the brief's own cites `:480`/`:597` had already moved to `:496`/`:615` — so a new anchor would be **a fresh liability of exactly the kind this task repairs.**

⭐ **The instruction did not weaken, and that was argued rather than asserted.** The old text justified *"do not skip"* on a premise now false in this repo; the new text supplies **three independent reasons — the check is cheap, the lint cannot know which kind of repo it is in, and even a green gate only sees what was already pushed while an uncommitted collision is exactly what the pass exists to catch** — **none** of which depends on CI being absent.

## Outcome

**Shipped 2026-08-15**, agent-closed, one review round. Full `npm test` run; exactly one path in the diff stat.

**Deliberately not done, recorded so it is not read as an oversight:**

- **No edit to `ai-agents/knowledge-base/architecture.md`** — edit-forbidden by the brief.
- **No edit to any ADR.** [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]'s two present-tense "no CI" claims stay **reported-only** — the owner did not select that option. **Not swept.**
- A separate stale `architecture.md` claim was filed as its own task by a producer rather than absorbed here.
- The gitignored `.claude/skills/fkit-wiki-lint/SKILL.md` dogfood copy **was not hand-edited** — it keeps the old text until the next `fkit` launch re-runs convergence. **Expected, not a defect.**

## Related
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, which landed the CI that made the paragraph false
- [[tasks/the-2026-08-13-vault-resync-chain]] — the `0282` resync that corrected the same "no CI" class inside the vault
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, which built the ADR-number-collision guard this check backs up
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why the lint procedure is the wiki role's alone
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — `P7`
- [[systems/testing-and-verification]] — CI and the release gate
- [[systems/fkit]] — the role/skill map the wiki lint belongs to
