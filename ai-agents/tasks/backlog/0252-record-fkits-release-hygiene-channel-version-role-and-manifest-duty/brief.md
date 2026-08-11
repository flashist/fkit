# Record fkit's release hygiene — the release channel, `VERSION`'s real role, and the manifest regeneration duty

## ID
0252

## Sprint
Sprint 5

## Priority
Sprint 5 P13

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Nobody cutting a release has one place to read what a release actually is in fkit.** The three
facts below are all true and all verified on disk (2026-08-08); each is either recorded nowhere, or
recorded only somewhere a releaser would never look.

**Fact 1 — `main` is the release channel; the tags are not what anyone installs.**
- `install.sh:19` — `REF="${FKIT_REF:-main}"`; the README's install line curls
  `raw.githubusercontent.com/flashist/fkit/main/install.sh`.
- `claude/fkit-claude.sh:106` — `fkit_ref="${FKIT_REF:-$(_fkit_verfield ref)}"; fkit_ref="${fkit_ref:-main}"`.
- `bin/release.mjs` cuts an annotated `v<version>` tag and pushes it (`:202-209`), but **no install
  path resolves a tag**. `fkit update` re-runs `install.sh` at `$repo@$ref` HEAD.
- Recorded today **only** in
  [ADR-015](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)
  Context §4 — *"`fkit update` reinstalls at **`main` HEAD, not at a tag**"* — inside an ADR about
  why there is no migration mechanism. Correct, and undiscoverable from a release.

**Fact 2 — `VERSION` is a display string, not the key distribution turns on.** The self-update check
compares **shas**: `claude/fkit-claude.sh:136-138` sets `remote="$(_fkit_remote_sha)"` /
`installed="$(_fkit_verfield sha)"` and branches on `[ "$remote" != "$installed" ]`; `VERSION` is
fetched separately (`_fkit_remote_version`, `:95`) purely to word the notice line. ADR-015 Context §4
and [`claude/structure-spec.md:22`](../../../../claude/structure-spec.md) both already state the
consequence — *"Two installations can report the same `VERSION` and hold entirely different
content"* — so this is **documented, but only inside two documents about other subjects**.
- ⚠️ **Do not write this up as "`VERSION` is cosmetic, stop bumping it."**
  [`architecture.md`](../../../knowledge-base/architecture.md) §6's sentence *"**Version bumping is
  load-bearing** — self-update compares the installed sha against the remote head and reports the
  version from `VERSION`"* is **accurate and must survive**: an unbumped `VERSION` makes the notice
  read `v0.1.30 → v0.1.30 is available`. ADR-001's "stop bumping the version" instruction was
  superseded for exactly this reason. The distinction to write down is *what the version does* (names
  the release in the notice) versus *what it does not do* (gate, select, or identify the installed
  content).

**Fact 3 — the `npm run generate:manifest` duty is real but narrower than "shipped share content".**
`bin/generate-structure-manifest.mjs`'s `workingTreeFiles()` (`:258-293`) walks **`claude/scaffold/`
only**: `claude/scaffold/ai-agents/**` (minus `.gitkeep`), plus `claude/scaffold/CLAUDE.md` and
`claude/scaffold/AGENTS.md`; `claude/scaffold/universal-rules.md` is explicitly `skip`. Editing
`claude/skills/**`, `claude/agents/**`, or `claude/fkit-claude*.sh` does **not** require a regen.
It is also **not tribal knowledge** — `claude/structure-manifest.tsv:3`, the generator header
(`:302`) and the test's own failure text (`test/structure-manifest.test.js:115`,
`"→ fix: npm run generate:manifest"`) all say it.
- ⚠️ **The real gap is enforcement timing, and it is worth stating plainly.** `npm test` runs the
  byte-equality guard, but **there is no CI** — `.github/workflows/` does not exist (verified
  2026-08-08) — and `bin/release.mjs` **runs no tests before committing and tagging**. A stale
  manifest can therefore be released by anyone who did not run `npm test` locally.

**Conflict to respect, not plan around:** this document is **fkit-repo-only maintainer guidance**.
It must **not** be created under `ai-agents/knowledge-base/conventions/` — every file there is
dual-homed into `claude/scaffold/ai-agents/knowledge-base/conventions/` and ships into every
consuming project (see
[`dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md) and
`claude/structure-spec.md` Inventory Table B). A consuming project has no release to cut.

## What to build

A single maintainer-facing release-hygiene document, plus one cross-reference.

1. **Create the document at repo-root `RELEASING.md`.** **Placement is decided — owner ruling,
   2026-08-08, relayed through the coordinating session** (the recommendation in this brief's first
   draft, taken as written). Root is where a maintainer looks, and it sits outside both
   `claude/scaffold/` and the structure-spec's inventory, so it ships to nobody and trips no
   conformance check. **Do not re-open the placement question.** It states, in the maintainer's own
   terms:
   - **the channel** — `main` HEAD is what `install.sh` and `fkit update` resolve
     (`FKIT_REF` default), so *merging to `main` is the act of shipping*; the `v<x.y.z>` tag is a
     marker, not an install target, and no documented command installs one;
   - **what `VERSION` does and does not do** — names the release in the update notice, and must keep
     being bumped for that reason; does **not** select, gate, or identify installed content, which is
     sha-keyed. Cite ADR-015 Context §4 rather than restating its argument;
   - **the pre-release checklist** — re-run `npm run generate:manifest` **when and only when**
     `claude/scaffold/` content changed (name the exact covered set from Fact 3), commit the
     regenerated `claude/structure-manifest.tsv` in the same change, and run `npm test` before
     `npm run release`, **because nothing else will** (no CI; the release script runs no tests).
     ⚠️ **Owner ruled 2026-08-08 that [`0256`](../0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)
     lands first**, so expect this sentence to describe the gate that exists rather than the gap —
     **re-read `bin/release.mjs` before writing it**. See the dated ruling bullet in `## Notes`.
2. **Add one pointer from `ai-agents/knowledge-base/architecture.md` §6** to the new document — one
   sentence, no rewrite of §6, and **leave the "Version bumping is load-bearing" sentence
   byte-identical** (Fact 2).

### ⛔ Out of scope

- ⛔ **Any new file under `ai-agents/knowledge-base/conventions/`** or anywhere in
  `claude/scaffold/` — see the Conflict note in Context.
- ⛔ Any behavior change: no edit to `install.sh`, `claude/fkit-claude.sh`, `bin/release.mjs`, or
  `bin/generate-structure-manifest.mjs`. This task documents what is; it changes nothing.
- ⛔ Adding CI, or adding a test gate to `bin/release.mjs`. **The owner ruled 2026-08-08 that the
  gate gets built — as [`0256`](../0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md), not
  here.** This task keeps *recording* the absence, exactly as scoped. ⚠️ If `0256` lands first, the
  releaser checklist written here must describe the gate that exists rather than "run `npm test`,
  because nothing else will" — re-read `bin/release.mjs` before writing that sentence.
  **Dated note 2026-08-08: the owner ruled that `0256` does land first, so treat this as the expected
  case, not a contingency.** The instruction itself is unchanged.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005). The resync of
  `wiki/systems/install-and-self-update.md` §Release is
  [`0258`](../0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md),
  `fkit-wiki`-owned.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. `RELEASING.md` exists at the repo root and states all three facts: the `main` channel,
   `VERSION`'s display-only role in distribution, and the scaffold-scoped regen duty.
2. Every code citation in the new document is checked against disk on the day of writing —
   `grep -n 'FKIT_REF:-main' install.sh claude/fkit-claude.sh` and
   `grep -n 'workingTreeFiles' bin/generate-structure-manifest.mjs` both resolve, and any line number
   written matches. (See
   [`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).)
3. The regen-scope claim is exact: the document names `claude/scaffold/ai-agents/**` +
   `claude/scaffold/{CLAUDE,AGENTS}.md` and does **not** claim `claude/skills/` or `claude/agents/`
   require a regen.
4. `grep -n "Version bumping is load-bearing" ai-agents/knowledge-base/architecture.md` still
   returns its hit, unmodified.
5. `git status --porcelain` shows nothing under `ai-agents/wiki-vault/` and nothing under
   `claude/scaffold/`.
6. `npm test` is green (the change is docs-only, so it must not move a single suite).

## Notes

- **Depends on:** nothing
- **Blocks:** `0258` — hard. The vault page cannot be re-synced against a document that has not
  landed.
- **✅ OWNER RULING 2026-08-08 — sequencing: [`0256`](../0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)
  lands BEFORE this task.** Ruled live, accepting this producer's recommendation on its stated
  reasoning: otherwise the releaser checklist here has to say *"run `npm test`, because nothing else
  will"*, which `0256` obsoletes. This upgrades the "scheduling preference" noted below from producer
  judgment to an owner ruling.
  - ⚠️ **Recorded as a soft ordering, deliberately NOT as a `Depends on` declaration.** `0256` is not
    a build-time blocker — this document is writable today; it would just describe a state about to
    change. The `Depends on: nothing` label above therefore stands, so the board keeps rendering this
    row `ready` — naming `0256` inside that label would render **`after 0256`**, which is false. Form
    per
    [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md);
    separate-bullet shape per the `0149` / `0184` precedent (**annotate beside the label, never inside
    it**).
  - The hard `Blocks: 0258` above is unaffected and unchanged.
- **✅ Placement resolved — owner ruling 2026-08-08, relayed through the coordinating session:
  repo-root `RELEASING.md`.** The alternative weighed and rejected was extending `architecture.md` §6
  in place (cheaper, no new file, but leaves the facts inside a reference document a releaser does
  not open — the exact gap). Recorded so the question is not re-litigated at plan time.
- **Corrections to the filing description, made after verifying on disk (2026-08-08):** the
  `VERSION` fact is *recorded* (ADR-015 Context §4; `claude/structure-spec.md:22`) rather than
  undocumented — the gap is discoverability; and the manifest duty is both *narrower* than "shipped
  share content under `claude/`" (scaffold only) and *already written down* in three places — the
  gap is that nothing runs the guard before a release.
- Related, filed the same day, no hard dependency either way:
  [`0253`](../0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md) (the README's
  missing post-update step),
  [`0254`](../0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md) (the broken verify
  line `bin/release.mjs` prints),
  [`0256`](../0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md) (builds the gate whose
  absence this task records — **scheduling preference: land `0256` first**, so the checklist here
  describes reality rather than being obsoleted a week later) and
  [`0257`](../0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md) (the update banner's
  label logic — the same `VERSION`-vs-sha distinction this task documents).
- Filed to the **Backlog** board — no sprint named; no re-rank (ADR-035).

- **⚠️ CARRY CORRECTION, 2026-08-10 — THE CLOSING LINE ABOVE IS NOW FALSE.** *"Filed to the
  **Backlog** board — no sprint named; no re-rank (ADR-035)"* is left **byte-identical**; it was true
  when this brief was filed on **2026-08-08**, and was falsified when the brief was **carried onto
  Sprint 5** by owner ruling of **2026-08-10** (verbatim option label **"Dashboard + all of
  0252-0258"**). The header fields moved in that same act and are the authority:
  **`## Sprint: Sprint 5`**, **`## Priority: Sprint 5 P13`**. **Plan this work against
  [`sprint-5.md`](../../../sprints/sprint-5.md), not the Backlog board.**
  ⚠️ **No drift check fires on this, and none will:** `dashboard.sh` reads the `## Priority`
  **field**, not brief prose, so the machine cannot see a stale closing line — only a reader working
  bottom-up can. Task
  [`0235`](../0235-cross-check-a-briefs-status-field-against-its-own-prose/brief.md) covers this
  class generally and is **neither widened nor closed** by this note.
