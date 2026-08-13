# Record fkit's release hygiene — the release channel, `VERSION`'s real role, and the manifest regeneration duty

## ID
0252

## Sprint
Sprint 5

## Priority
Sprint 5 P13

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> # ⚠️ READ FIRST — DATED CORRECTION 2026-08-12: `0256` HAS LANDED. THE "NO CI" TEXT BELOW IS FALSE.
>
> **The contingency this brief was written around has fired.** All original text is left
> **byte-identical**; three sites are corrected in place and **the corrections govern**:
> **Fact 3's enforcement-timing bullet**, **`## What to build` item 1's pre-release checklist**, and the
> **⛔ out-of-scope bullet on CI**.
>
> **What `0256` landed on 2026-08-12** — verified on disk by the producer that wrote this block;
> **re-verify before writing `RELEASING.md`**, per verification step 2:
> - **`bin/release.mjs`** — a `runTests()` gate immediately before the version-bump block, the script's
>   first mutating line. Red `npm test` → exit 1. **No warn-and-continue path.** Runs under `--dry-run`
>   too. A `--no-test` escape hatch exists, behind an unconditional stderr banner.
> - **`.github/workflows/test.yml`** — `npm test` on every push to `main` and every pull request;
>   `ubuntu-latest`, Node 24, `fetch-depth: 0`, `timeout-minutes: 20`. **`.github/` now exists.**
> - **Measured:** `npm test` takes **328 s (5 m 28 s)**. `RELEASING.md` may state that; it is the number
>   `bin/release.mjs` itself prints as `~5m30s`.
>   - > **⚠️ RUNTIME-FIGURE CORRECTION 2026-08-12 (same day, later in the same ship run) — the two
>     > bullets above are left byte-identical; the two details below are now more precise, and THIS
>     > text governs.** Filed on the owner ruling, verbatim option label
>     > **"Producer amends it now (Recommended)"** (`AskUserQuestion`, 2026-08-12).
>     > **(a) The runtime figure is now a range, not `328 s`.** `bin/release.mjs` no longer prints
>     > `~5m30s` — it prints **`~6 min`**, at three sites (`:71` in `--help`, `:173` in a comment,
>     > `:190` in the console line), and `.github/workflows/test.yml:28-32` states the range with all
>     > four numbers. **328 s was one measurement, not "the runtime."** Four runs, same machine, same
>     > suite, node v24.13.0: **328 / 380 / 346.9 / 343.8 s.** All four are real; the spread is machine
>     > load, **not a regression**. So `RELEASING.md` should say **"~6 min"** — ⛔ **not a single
>     > second-count**, and ⛔ **not `~5m30s`**. `0256` widened this prose on **2026-08-12**.
>     > **(b) The CI trigger list above is correct but incomplete.** `test.yml` also carries
>     > **`workflow_dispatch:`** (`:20`) — on-demand runs, so the first (possibly red) run can be
>     > triggered without pushing to `main`. Push-to-`main` and pull-request stand as written.
>     > **(c) New fact, and worth a line in the releaser checklist: a refusal is far cheaper than a
>     > pass — about 1 minute, not ~6.** `npm test` is
>     > `node --test test/*.test.js && bash test/prove-red.sh` (`package.json:5`), so a red unit suite
>     > **short-circuits at the `&&`** and `prove-red.sh` never runs. The ~6 min is the *green* cost;
>     > a maintainer waiting on a failure waits about a minute.
>     > ⛔ **Nothing else in this banner changes.** The gate, the `--no-test` escape hatch, `.github/`
>     > existing, the provenance, and **"CI HAS NEVER RUN"** all stand exactly as written below.
>
> **⚠️ CI HAS NEVER RUN.** The loop that landed it neither commits nor pushes, so the workflow is
> verified by static review only. **`RELEASING.md` must not claim CI is proven working** — the honest
> wording is *wired, not yet observed green on a runner*.
>
> **Provenance.** This reverses the owner's 2026-08-06 *"No CI planned"* ruling. The reversal is the
> owner's own — taken 2026-08-08 (*"fix it, not just record it"*) and confirmed 2026-08-12 at `0256`'s
> plan gate, verbatim option label **"Approve — both gate and CI (Recommended)"**. This amendment is
> filed on the owner ruling **"Amend both briefs now (Recommended)"** (`AskUserQuestion`, 2026-08-12).
>
> **⛔ Scope is UNCHANGED.** This task still writes one maintainer document and one cross-reference, and
> still changes no behavior. What changes is that it now **describes a gate that exists** instead of
> **recording an absence**. Facts 1 and 2, the placement ruling, and the `Blocks: 0258` dependency are
> all untouched.

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
  - > **⚠️ DATED CORRECTION 2026-08-12 — THE BULLET ABOVE IS NOW FALSE IN BOTH CLAUSES. Left
    > byte-identical; it was true when verified 2026-08-08.** `.github/workflows/` **does** exist
    > (`test.yml` — push to `main` and every PR), and `bin/release.mjs` **does** run `npm test` before
    > committing and tagging: a `runTests()` gate before its first mutating line, aborting on red. Both
    > landed with `0256` on 2026-08-12.
    > **What to write instead:** enforcement timing is **no longer the gap** — state the duty, then
    > state that two mechanisms now enforce it: the **in-release gate** covers the working tree about to
    > be committed, and **CI** covers `main` HEAD, which is what `install.sh` actually installs
    > (`install.sh:19`). ⚠️ **The one residual worth a sentence, and only stated precisely:** `--no-test`
    > can still ship an unverified tree — loud, but not blocked. ⛔ **Do not write that no CI exists.
    > ⛔ Do not write that CI is proven working — it has never run.**

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
     > **⚠️ DATED CORRECTION 2026-08-12 — `0256` HAS LANDED; the quoted words *"because nothing else
     > will"* and *"(no CI; the release script runs no tests)"* are now FALSE. Left byte-identical.**
     > **Write the checklist against the gate that exists:** `npm run release` **runs `npm test` itself**
     > before its first write and refuses to release on red, so the maintainer's own `npm test` is now a
     > **fast-feedback** step (it takes **328 s**, and you would rather fail before the release run than
     > during it), **not the only thing standing between a red tree and a shipped release**. Say plainly
     > that **the gate cannot be forgotten**, and that **`--no-test` is the one way past it** — loud, and
     > never a default. ⛔ **Do not write "no CI".** ⛔ **Do not write that CI is proven working — it has
     > never run** (see the READ FIRST banner at the top of `## Context`). The manifest-regen half of
     > this checklist item is **unaffected and unchanged**.
     > - > **⚠️ RUNTIME-FIGURE CORRECTION 2026-08-12 (same day, later) — the figure *"it takes 328 s"*
     >   > above is left byte-identical but is now WRONG AS A SINGLE NUMBER.** Write **`~6 min`**
     >   > instead. Four measured runs, same machine and suite: **328 / 380 / 346.9 / 343.8 s** —
     >   > spread is machine load, not a regression — and `bin/release.mjs` itself now prints
     >   > **`~6 min`** (`:71`, `:173`, `:190`), matching `.github/workflows/test.yml:28-32`. See the
     >   > full correction under the READ FIRST banner's **Measured** bullet.
     >   > **Add one sentence to the checklist while you are here:** a **failing** `npm test` costs
     >   > only about **1 minute**, because the script is `node --test … && bash test/prove-red.sh`
     >   > (`package.json:5`) and a red unit suite short-circuits before `prove-red.sh` ever runs. That
     >   > is precisely why running it yourself first is cheap fast feedback — the ~6 min is the price
     >   > of a *green* run, not of finding a break. **Everything else in this block stands**, including
     >   > the `--no-test` wording and both ⛔ prohibitions.
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
  - > **⚠️ DATED CORRECTION 2026-08-12 — `0256` LANDED TODAY. Text above left byte-identical.**
    > **The prohibition stands, unchanged and still binding: this task adds no CI and adds no test gate
    > to `bin/release.mjs`.** Both already exist; there is nothing here to add. **What is falsified is
    > only the clause *"This task keeps recording the absence, exactly as scoped"* — there is no absence
    > left to record.** This task now **documents the gate and CI as they are**, which is the same scope
    > (a maintainer document, no behavior change), pointed at reality. **Re-read `bin/release.mjs` and
    > `.github/workflows/test.yml` on the day of writing** rather than citing this brief.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005). The resync of
  `wiki/systems/install-and-self-update.md` §Release is
  [`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md),
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
   - > **Note added 2026-08-12:** budget **~6 min** for this step and do not read the silence as a
     > hang — measured at **328 / 380 / 346.9 / 343.8 s** across four runs. A *failure* returns in
     > about a minute (`&&` short-circuit before `prove-red.sh`).

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
  [`0235`](../../backlog/0235-cross-check-a-briefs-status-field-against-its-own-prose/brief.md) covers this
  class generally and is **neither widened nor closed** by this note.

- **⚠️ AMENDED 2026-08-12 — `0256` HAS LANDED; the "no CI" premise is gone. See the READ FIRST banner
  at the top of `## Context`.** For a reader working bottom-up: `.github/workflows/test.yml` and an
  in-release `runTests()` gate in `bin/release.mjs` both exist as of **2026-08-12**, reversing the
  owner's 2026-08-06 *"No CI planned"* ruling. The reversal is the owner's own (2026-08-08; confirmed
  2026-08-12, verbatim **"Approve — both gate and CI (Recommended)"**); this amendment is filed on
  **"Amend both briefs now (Recommended)"** (2026-08-12). Corrections sit at **Fact 3's
  enforcement-timing bullet**, **`## What to build` item 1's checklist**, and the **⛔ CI out-of-scope
  bullet**. **Scope, placement ruling, and `Blocks: 0258` are unchanged** — this task now describes a
  gate that exists instead of recording an absence. ⛔ **CI has never run; do not write that it works.**

- **⚠️ AMENDED AGAIN 2026-08-12 (same day, later in the same ship run) — the runtime figures only.**
  The amendment above is **not reversed and not weakened**; it is made **more precise in two places**,
  and this bullet is only a pointer for a reader working bottom-up. **Write `~6 min`. ⛔ Never
  `328 s`, ⛔ never `~5m30s`.** `npm test` measured **328 / 380 / 346.9 / 343.8 s** over four runs
  (same machine, same suite, node v24.13.0 — the spread is machine load, **not a regression**), and
  `0256` widened `bin/release.mjs`'s own prose to **`~6 min`** at `:71`, `:173`, `:190`, matching
  `.github/workflows/test.yml:28-32`. Two further details: `test.yml` also carries
  **`workflow_dispatch:`** (`:20`, on-demand runs), and a **failing** `npm test` costs only **~1 min**
  because the script short-circuits at the `&&` before `prove-red.sh` (`package.json:5`) — worth one
  sentence in the releaser checklist. The corrections sit under the **READ FIRST banner's `Measured`
  bullet**, inside **`## What to build` item 1's correction block**, and as a note on **verification
  step 6**. Owner ruling, verbatim option label **"Producer amends it now (Recommended)"**.
  ⛔ **Scope, status, priority, placement, and `Blocks: 0258` untouched. CI still has never run.**

- **⚠️ SUPERSESSION 2026-08-13 — the `~6 min` instruction is SUPERSEDED. `RELEASING.md` says a range,
  and that is correct.** Everything above is left **byte-identical**, including the two 2026-08-12
  **RUNTIME-FIGURE CORRECTION** blocks that instruct **`~6 min`** and mark it ⛔ *"not a single
  second-count"*. **Those were right when written** — they were the honest reading of the four runs
  that existed on 2026-08-12. They are superseded, **not wrong-at-the-time**.
  - **What the shipped document actually says.** `RELEASING.md:128` (landed, 201 lines, repo root)
    reads **"A green run takes **roughly 6–8 minutes, machine-dependent**"** — a range, not `~6 min`.
    Verified on disk 2026-08-13.
  - **Owner ruling, 2026-08-13, `AskUserQuestion`, verbatim option label
    "Range: 'roughly 6–8 minutes, machine-dependent'".** ⚠️ **The conflict was put to the owner
    explicitly and in those terms** — that choosing anything but `~6 min` would override their own
    2026-08-12 ruling. They chose the range anyway. This bullet records that choice; it does not
    reinterpret it.
  - **Why: the measurement series outgrew the figure.** `~6 min` came from four runs
    (**328 / 380 / 346.9 / 343.8 s**). Two further runs on **2026-08-13** measured **463 s** and
    **448 s** — **both outside** the `~6 min` reading. **Six** measurements now span **328–463 s**,
    which a range describes and a single figure does not.
  - **Why this note exists at all.** No brief edit was in scope during the task, so the supersession
    was recorded only in this folder's `plan.md` and `worklog.md`. A reader opening the brief alone
    reached the stale conclusion, and the brief contradicted the document it produced. That is what
    this bullet closes.
  - ⚠️ **KNOWN-UNFIXED GAP, accepted knowingly — not an oversight.** The range in `RELEASING.md` now
    **disagrees by design** with four sites that still say **`~6 min`**: `bin/release.mjs:71`
    (`--help`), `:173` (comment), `:190` (console line), and `.github/workflows/test.yml:28-32` (the
    `timeout-minutes` rationale comment, which also still quotes the four-run series). All four were
    **out of `0252`'s scope** — the ⛔ out-of-scope bullet forbids any edit to `bin/release.mjs`, and
    CI was never this task's to touch — and **none was changed**. The owner accepted the disagreement
    with this stated. **Reconciling those sites wants its own brief.** ⛔ **No such brief has been
    filed, and this note does not file one.**
  - ⛔ **Nothing else changes: status, scope, priority, placement, and `Blocks: 0258` all stand
    exactly as written. CI still has never run.**
