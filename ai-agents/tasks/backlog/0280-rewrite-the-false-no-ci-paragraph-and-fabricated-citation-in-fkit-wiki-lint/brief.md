# Rewrite the false "no CI" paragraph — and its fabricated citation — in `/fkit-wiki-lint`

## ID
0280

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

**Owner ruling 2026-08-12**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"fkit-wiki-lint SKILL.md — sharpest (Recommended)"**.

**Provenance:** surfaced as a follow-up of [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)
(closed 2026-08-12), which landed `.github/workflows/test.yml` and the in-release `npm test` gate.
The CI landing is what falsified the paragraph's two factual claims. **The fabricated citation
inside it is older and independent of `0256`** — see below.

### The passage

`claude/skills/fkit-wiki-lint/SKILL.md:184-185`, inside check 5 of the ADR-number-collision step
(a parenthetical closing that step). Verified on disk 2026-08-12, quoted verbatim:

> *(`test/adr-number-uniqueness.test.js` also asserts this invariant, so `npm test` catches it too.
> ⚠️ **But nothing runs that automatically — this project has no CI** (`architecture.md:390`: "There
> is no CI and no test suite"; there is no `.github/`). `npm test` runs when a human runs it. So this
> lint step is not redundant belt-and-braces over an automated gate; on a repo where nobody has run
> the suite, it may be the only thing that looks. Do not skip it on the assumption the test covered
> it.)*

### Three separate defects, not one

| # | Defect | Verified how, 2026-08-12 |
|---|---|---|
| **D1** | *"this project has no CI"* — **false** | `.github/workflows/test.yml` exists (`ls .github/workflows`). Landed by `0256`. |
| **D2** | *"there is no `.github/`"* — **false** | Same. |
| **D3** | **The citation is fabricated** — `architecture.md:390` is quoted as saying *"There is no CI and no test suite"* | ⚠️ **That string exists nowhere in `architecture.md`.** `grep -n -i "no CI\|test suite"` over the file returns **only** `:31`, `:480`, `:597` — none of them that sentence, and all three now say the **opposite** (`:31` *"since task 0256 it runs automatically"*; `:480` *"There is a test suite, and since task 0256 two mechanisms run it"*). `:385-395` is about the launcher's `fkit update` notice. Independently confirmed by two earlier workers; re-confirmed here. |

⚠️ **D3 predates `0256` and would be a defect even if CI had never landed.** Do not close this task
describing it as fallout of the CI landing. A quoted string attributed to a file that never contained
it is the more serious of the two problems — it is the exact `evidence-before-assertion` failure the
repo has a convention page about.

### ⛔ THE FIX IS A REWRITE. NOT A DELETION, AND NOT "there is CI now."

**The paragraph is load-bearing.** Its job is to tell the wiki role **not to skip** the
ADR-number-collision check, on the reasoning that no automated gate will otherwise catch a collision.
Both obvious edits break it:

- ⛔ **Deleting the paragraph removes a correct instruction.** *"Do not skip this step"* is still the
  right instruction. The reasoning changed; the instruction did not.
- ⛔ **Replacing it with *"this project has CI now, so the test catches it"* is false for the
  audience.** This file **ships to every consuming project**. A consuming project generally has **no
  `.github/`** and **no one running `npm test`** — the original reasoning is **still exactly right
  there**. A rewrite that assumes this repo's tree makes the skill wrong for its majority audience.

**The rewritten paragraph must hold both cases at once:**

1. **On a repo with an automated gate** (this one, since `0256`): `adr-number-uniqueness.test.js`
   runs on every push to `main` and every PR, so the lint step is genuine belt-and-braces there.
2. **On a repo without one** (the typical consuming project): nothing runs it, and the lint step may
   be the only thing that looks.
3. **The instruction is unchanged in both:** ⛔ **do not skip the step.** The check is cheap and the
   lint cannot know which kind of repo it is running in.

⚠️ **Point 3 is the whole reason the paragraph survives.** If the rewrite ends up licensing a skip on
a CI-having repo, it has introduced a worse defect than the one it fixed.

⚠️ **`0256` also landed an in-release `npm test` gate** (`bin/release.mjs`). ⛔ **Do not lean on it
here** — it fires at release time, which is not "before a collision reaches `main`", and this file's
readers mostly never cut a release. Mention it or not; do not build the reasoning on it.

### Downstream staleness — stated accurately, not guessed

`claude/skills/fkit-wiki-lint/SKILL.md` is a **source file that ships to every consuming project**.
Measured at filing:

- Launch convergence **rm+cp refreshes** `.claude/skills/fkit-*/` from `claude/skills/` on every
  init/launch (`claude/fkit-claude-init.sh:485-488`, `for d in "$dest/.claude/skills/fkit-"*/; do …
  rm …; done` then `cp -R "$here/skills/fkit-"* …`). ✅ **So consumers DO receive this fix when they
  re-launch on an updated fkit** — no per-project repair task is owed for the skill itself.
- ⚠️ **This is the opposite of project content under `ai-agents/`**, where convergence is
  **create-if-absent only, never overwrite** (`fkit-claude-init.sh:34`). A stale claim that had been
  copied into a consumer's `ai-agents/` would be permanent. **This paragraph lives only in the
  skill**, so that does not apply here — **state that distinction in the close rather than implying
  fkit repairs downstream prose generally.**
- **Single-homed.** Verified: no `claude/scaffold/` copy of this skill (`find claude/scaffold -name
  "*wiki-lint*"` → empty) and **zero** rows in `claude/structure-manifest.tsv`. ✅ **No dual-home
  twin edit and no `npm run generate:manifest` is owed.** ⚠️ Re-verify rather than taking this row's
  word.

## What to build

One edit to one file: `claude/skills/fkit-wiki-lint/SKILL.md`, the parenthetical at `:184-185`.

1. **Delete the fabricated quote and its citation.** ⛔ Do not "fix" `architecture.md:390` to make
   the quote true — the file is correct and the quote was never in it.
2. **If a citation is wanted in its place, cite what the file actually says today** — `:31` and
   `:480` both state the post-`0256` position. ✅ **Prefer the durable quoted-text citation form over
   a fresh `:NNN`**; `architecture.md` is actively edited and this cite has already been wrong once.
   ✅ **No citation at all is an acceptable outcome** — the sentence does not need one.
3. **Rewrite the reasoning to carry all three points above.**
4. **Leave the surrounding check-5 text alone** — the numeric-comparison rule, the regular-files-only
   rule, and the "must not live inside the per-vault-page loop" reasoning are all correct and out of
   scope.

### Constraints

- ⛔ **No behavior change to the lint procedure.** No step added, removed, reordered, or made
  conditional. This is a prose repair of one parenthetical.
- ⛔ **Do not edit `ai-agents/knowledge-base/architecture.md`.** It is already correct.
- ⛔ **Do not edit ADR-003** — that is [`0281`](../0281-correct-adr-003s-still-unmet-automated-verification-claim/brief.md),
  filed the same day from the same ruling.
- ⛔ **Do not sweep the other no-CI claims in the repo.** Measured at filing, `ADR-014:18` and
  `ADR-026:48`/`:131` also carry no-CI statements, and two knowledge-base reports do. **They are out
  of scope — report them, do not fix them.** ⚠️ `ADR-014:18` in particular reads as a *Context*
  section describing the state at decision time, which may be correct as history; do not assume.
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005) — the vault's copies are
  [`0282`](../0282-wiki-resync-of-the-no-ci-claims-after-the-0256-ci-landing/brief.md).
- ⛔ No task-file move (ADR-033), no re-rank, no board-row edit beyond this task's own close.
- ⛔ No commit. ⛔ No new devDependency (ADR-014).
- ⚠️ **Every `:NNN` in this brief is a dated anchor measured 2026-08-12; the durable anchor is the
  quoted text. Re-measure at implementation time.**

## Verification steps

1. **The three defects are re-measured by the implementer, not inherited from this brief.** Paste:
   `ls .github/workflows` (D1/D2), and a `grep -n` over `architecture.md` for the quoted string
   showing **zero** hits (D3). ⚠️ **Show `:390`'s actual content** so the misattribution is on the
   record.
2. **The landed paragraph carries all three required points** — automated-gate repos, no-gate repos,
   and the unchanged "do not skip" instruction. **Quote the landed text in full.**
3. **The fabricated quote is gone**, and any replacement citation is verified against the file
   as it stands. If no citation was added, say so and why.
4. **The instruction did not weaken.** Show that a reader on a CI-having repo still cannot read the
   new text as permission to skip the step. ⚠️ **This is the failure mode most likely to be
   introduced by this task** — argue it explicitly, do not assert it.
5. **Nothing else in check 5 changed.** `git diff` must show one hunk in one file.
6. **Single-home and manifest facts re-verified** — no scaffold twin, zero manifest rows, so no
   `npm run generate:manifest`. Show the commands.
7. **Full `npm test` green; state the measured counts.** ⚠️ **Expect this to prove nothing about the
   prose** — no test reads a SKILL.md's reasoning paragraphs. **Say so explicitly** rather than
   implying coverage.
8. **`git diff --stat` lists exactly one path.**

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** follow-up surfaced by [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)'s
  CI landing (closed 2026-08-12). **D3, the fabricated citation, is independent of `0256` and
  predates it.** Filed 2026-08-12 on the owner's ruling of the same day, verbatim option label
  **"fkit-wiki-lint SKILL.md — sharpest (Recommended)"**.
- **⚠️ Sibling rows filed from the same ruling:**
  [`0281`](../0281-correct-adr-003s-still-unmet-automated-verification-claim/brief.md) (ADR-003) and
  [`0282`](../0282-wiki-resync-of-the-no-ci-claims-after-the-0256-ci-landing/brief.md) (vault
  resync). **No shared file with `0281`. `0282` should run last** — see its own note.
- **⚠️ ONE ROW, NOT TWO.** D1/D2 (the false facts) and D3 (the fabricated citation) sit in the same
  two lines and cannot be fixed independently without one edit stomping the other. They land
  together.
- **On merit:** the **Backlog**, unranked, and that is honest. Nothing waits on it, no behavior
  changes, no test reads the affected prose, and it is not on the release path. Its claim to
  attention is that it is a **shipping-to-consumers** file whose reasoning is now wrong on this repo
  — read by an agent that acts on it — plus a fabricated citation, which is the more serious half.
- **Blast radius if never done:** a wiki-role session reads *"this project has no CI"* on a repo that
  has one, and reasons from a false premise about what is and is not covered. The step itself is
  still instructed correctly, so the immediate operational risk is low; the credibility cost of a
  fabricated quote inside a skill is the real damage.
- **⚠️ Adjacent, deliberately NOT filed:** `ADR-026:48`/`:131` state *"no `.github/workflows/` in the
  tree at all"* as present-tense fact, which is now false. **The owner did not rule that filed** and
  it is not in this task's scope. Recorded here so the next reader knows it was seen, not missed.
- Filed 2026-08-12 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, edited no source file, moved no task file, touched no sprint plan,
  and committed nothing.
