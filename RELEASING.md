# Releasing fkit

Maintainer guidance for cutting a release **of the fkit repo itself**. It is not documentation for
people who *use* fkit.

This file ships to nobody. It sits outside `claude/scaffold/`, so `install.sh` never copies it into a
consuming project, and it is absent from `claude/structure-spec.md`'s inventory tables, so no
conformance check knows about it. That is why it lives at the repo root and **not** in
`ai-agents/knowledge-base/conventions/` — those documents are dual-homed into every project, and a
consuming project has no release to cut. Please do not "tidy" it into `conventions/`.

---

## Test execution pause — effective 2026-11-06

All tests are disabled indefinitely by owner ruling; see [the pause and reversal policy](CONTRIBUTING.md#tests).
Verification is static only. Do not run test commands, fixtures, probes, benchmarks, saved verification
scripts, delegated tests or release dry-runs. Record required tests as **"skipped — owner disabled test
execution"**. Behavioral acceptance remains unverified. Carry the ruling verbatim into subsequent workers,
source-only reviews and adversarial passes; existing sessions require an explicit relay.

Default `release`, `release:minor`, `release:major` and `release:dry` commands refuse before Git operations
or writes, because tests cannot run. An explicitly authorized `--no-test` release retains the unverified-tree
warning and never launches tests. This pause authorizes no release, commit, push or workflow dispatch.
Both local workflow jobs are guarded off; hosted `test` and `prove-red` were observed as
`disabled_manually` on 2026-11-06, with no unfinished runs found during shutdown inspection.
Re-enabling requires an explicit owner decision and a separate change; no expiry or environment bypass.
Other clones, old commits, saved copies and already-running local processes are outside these guards.
Hosted branch-protection requirements may need a separate owner decision.

## 1. `main` is the release channel

A default install reads `main`, not a tag:

- `install.sh:19` — `REF="${FKIT_REF:-main}"`.
- `install.sh:32` — `$REF` goes straight into a `codeload.github.com` tarball URL.
- `claude/fkit-claude.sh:106` (`fkit_ref="${fkit_ref:-main}"`) — the launcher resolves the same default when `.version` names no ref.

So **merging to `main` is the act of shipping.** Every commit on `main` is live to the next install
the moment it is pushed. There is no staging channel and no promotion step between the two.

### The tag is a marker, not an install target

An explicitly authorized `npm run release -- --no-test` creates an annotated `v<x.y.z>` tag
(`bin/release.mjs`, the `// 3. tag` step; `` const tag = `v${version}` ``), and that
tag is how a release is *identified* — in `git log`, in an issue, in a [changelog](CHANGELOG.md)
entry. Nothing in the release flow, the README, or `fkit update` puts an install onto a tag on its
own; an install lands on one only when someone explicitly sets `FKIT_REF`.

A tag *is* reachable, because `$REF` is interpolated without inspection — but this is **reachable,
not supported**:

```sh
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | FKIT_REF=v0.2.1 sh
```

⚠️ **The assignment must come after the pipe.** In a POSIX pipeline an assignment prefix binds to the
first command only, so writing it before `curl` sets the variable for `curl` — which never reads it —
and leaves the `sh` that actually runs the installer on its own default. That form silently installs
`main` while looking like it pins a tag.

Even written correctly it is not a supported configuration. `install.sh:73` records the ref into the
install's `.version`, and the update path resolves that ref's head with `git ls-remote`
(`claude/fkit-claude.sh:65-78`, `_fkit_remote_sha()`). A tag's head never moves, so an install
sitting on one normally has
nothing to update to and the check stays quiet — but that quiet is a side effect, not a guarantee,
and it breaks in at least two ways. If `install.sh` could not resolve a sha it writes
`sha=unknown` (`install.sh:71`); the check only tests both sides for non-emptiness
(`claude/fkit-claude.sh:162`, the `[ -n "$remote" ] && [ -n "$installed" ]` test), so `unknown` never matches and the notice fires forever. And
`git ls-remote` on an *annotated* tag returns the **tag object's** sha while the curl fallback
returns the **commit's**, so an install that gained or lost `git` between install time and check
time compares two different shas for the same unmoved tag. Pinning is a way to freeze, not a way to
subscribe — and it is not even a reliable way to go quiet.

---

### Opt-in previews without shipping to `main`

Use a separate checked-out branch, such as `codex/codex-preview`, and an explicit prerelease version:

```sh
npm run release -- --no-test --version 0.4.0-codex.1 --branch codex/codex-preview
```

Only under separate release authorization, the tool accepts that explicit version with `--no-test`,
warns that the tree is unverified, checks the changelog and branch, commits all nonignored
working-tree changes, and pushes only the checked-out preview branch and version tag. Do not run
this on `main`: the `--branch` argument is a guard, not a branch switch. Verify remote `main` is
unchanged afterward. Choose each later preview version explicitly; a default patch bump does not
increment a prerelease counter. The script creates a Git tag, not a GitHub Release or npm publish.

Default installs keep `FKIT_REF=main`, so they do not receive the preview. An opt-in install can
track `FKIT_REF=codex/codex-preview`; its saved `.version` makes subsequent `fkit update` follow the
same branch. Fetch the preview's own installer, as the older `main` installer may not package new
runtime resources. An exact version tag selects a frozen snapshot, with the tag update-notice
limitations above. A public preview remains discoverable; opt-in distribution is not privacy.

---

## 2. What `VERSION` does, and what it does not do

**What it does.** It names the release in the update notice. When an install and the remote report
two distinct known versions, the notice reads `v0.2.1 → v0.2.2 is available`; otherwise it falls back
to naming the change by sha (`claude/fkit-claude.sh:171-177`, the
`if [ -n "$rver" ] && [ -n "$curver" ]` block). **Bumping is what buys the version
wording** — skip the bump and the notice is still correct, just less informative.

**What it does not do.** It does not select, gate, or identify installed content. Distribution is
**sha-keyed**: the update check compares the installed sha against the remote head
(`claude/fkit-claude.sh:162`, the `[ -n "$remote" ] && [ -n "$installed" ]` test), and `VERSION` is fetched separately, afterwards, purely to word
the message (`claude/fkit-claude.sh:79-85`, `_fkit_remote_version()`). The consequence — two installs
can report the same
`VERSION` and hold different content — is argued in ADR-015 Context §4 and recorded as a design
constraint at `claude/structure-spec.md:23`.

**This is not an argument for bumping less.** `ai-agents/knowledge-base/architecture.md` (§7, flow *"6 — Release"*: *"Version bumping is load-bearing"*) calls
version bumping load-bearing, and it still is — in one specific sense, which is worth naming because
task `0257` retired the old one. Bumping is what lets the update notice name a **version delta**
(`v0.2.1 → v0.2.2`) instead of falling back to a **sha delta**. What bumping never was is the
delivery mechanism: a version number is a *label on* a release, never the thing that ships it.

---

## 3. Before you release

**1. Regenerate the structure manifest whenever you change what it hashes.**

Usually that is a scaffold edit, but the trigger is neither "any scaffold edit" nor "only a scaffold
edit". The two real triggers are: you changed a scaffold file the manifest actually covers (listed
below), **or** you changed the generator's own path map or hash contract
(`bin/generate-structure-manifest.mjs`), which can move hashes with no scaffold edit at all.

What the manifest covers **in the working tree** — the half your edit lands in — is everything under
`claude/scaffold/ai-agents/` (recursively, `.gitkeep` excluded —
`bin/generate-structure-manifest.mjs:288`), plus `claude/scaffold/CLAUDE.md` and
`claude/scaffold/AGENTS.md`. `claude/scaffold/universal-rules.md` sits inside `claude/scaffold/` and
is deliberately skipped — it is an install-side input, never copied into a project — so editing it
is a scaffold edit that owes no regen. The map is at `bin/generate-structure-manifest.mjs:261-264`,
applied by `workingTreeFiles()` (`bin/generate-structure-manifest.mjs:259-296`).

The manifest **as a file is wider than that snapshot**: it records every content hash fkit has ever
shipped, so it also carries paths from two retired scaffold homes and paths no current scaffold file
occupies at all — `ai-agents/reviews/README.md` is one such entry today. Those come from the
git-history half of the walk (`bin/generate-structure-manifest.mjs:13-18`, `:67-81`), and no
working-tree edit adds or removes them. Do not read the covered set above as an inventory of the
`.tsv`.

Stated as a negative, because it is the half people get wrong: editing `claude/skills/`,
`claude/agents/`, or `claude/fkit-claude.sh` **does not require a regen** — none of them ship through
the scaffold.

```sh
npm run generate:manifest
```

Commit the regenerated `claude/structure-manifest.tsv` **in the same change** as the edit that caused
it (`test/structure-manifest.test.js:112`, `claude/structure-manifest.tsv:3`). Adding a *new*
top-level entry to `claude/scaffold/` is **more** than a regen, not less: the generator refuses
loudly and tells you which two halves of the walk to teach
(`bin/generate-structure-manifest.mjs:268-277`), because whether a new file ships to a project is a
decision, not a derivation. Teaching the generator is step one — you still have to run
`npm run generate:manifest` afterwards and commit the result, or the tree is stale exactly as if you
had skipped the regen entirely.

**2. Write the release notes.**

Every change the release ships goes under `## Unreleased` in [`CHANGELOG.md`](CHANGELOG.md), written
for people who *use* fkit. `npm run release` refuses to run while that section is empty (or missing,
or there twice) on the explicit `--no-test` route. Default commands refuse earlier under the test
pause. The release then turns `## Unreleased` into `## v<x.y.z> — <date>` (§4). To release with
nothing written there anyway, pass `--allow-empty-changelog`; it is loud, and the version section
then says *"No changes were recorded for this release."*

**3. Inspect statically; skip all tests.**

Inspect the complete diff, run `git diff --check`, and parse `package.json` as data without importing
project code. Inspect relevant source and release paths. Do not run the retained tests or use a
nightly result as current acceptance: both workflows are disabled. Report required tests as
"skipped — owner disabled test execution". Static checks do not establish behavioral correctness.

**4. Decide the bump.**

```sh
npm run release -- --no-test          # patch, only with separate release authorization
npm run release:minor -- --no-test
npm run release:major -- --no-test
npm run release -- --no-test --version 1.2.3
```

`VERSION` is the source of truth and `package.json` is kept in sync with it. When deriving a bump the
two must already agree, or the script aborts and asks you to reconcile them
(`bin/release.mjs` — `version mismatch: VERSION=…`).

**5. Do not use dry-run as verification during the pause.**

`npm run release:dry` refuses by default. The explicit `--no-test --dry-run` route remains in the
release tool, but do not execute it for verification under this ruling.

---

## 4. What an explicitly authorized `--no-test` release does

The default path refuses before Git operations or writes. The retained `--no-test` path prints its
unverified-tree warning and launches no tests. Branch and changelog checks remain: a missing,
duplicated or empty `## Unreleased` refuses, unless the explicit `--allow-empty-changelog` permits
an empty body with a warning. The changelog is re-read before writes to preserve concurrent edits.

On a non-bumping run (`--no-bump`, or `--version` naming the current version), an existing version
heading lets a partly-failed release finish without restamping it. A bumping run refuses an existing
heading for its target version.

Then, in order:

1. bump `VERSION` + `package.json`, stamp `CHANGELOG.md`, and reopen an empty `## Unreleased`
2. `git add -A`
3. commit
4. push the branch
5. create the annotated `v<version>` tag
6. push the tag

These are release capabilities, not authorization to use them. CI provides no current test
acceptance: `.github/workflows/test.yml` and `.github/workflows/prove-red.yml` retain their triggers
and steps for reversal, but both jobs have `if: ${{ false }}` guards and hosted workflows are disabled.
No release, commit or push is part of the test-disable change.

---

## 5. What is still not covered

- **`--no-test` can still ship an unverified tree.** It is loud — an unconditional stderr banner
  fires (`bin/release.mjs`, *"⚠ --no-test: releasing WITHOUT running the suite"*) — and it is
  never a default, but nothing blocks it.
- **The changelog check proves the `## Unreleased` section is not empty — not that it is complete or
  accurate.** One line of anything passes. And `--allow-empty-changelog` is loud (a stderr banner,
  `bin/release.mjs`, plus a *"No changes were recorded"* line in the file), but nothing
  blocks it.
- **`install.sh`'s real network fetch is untested.** `test/update-reinstall.test.js` (case
  `0481/install-sh-records`) runs it on a sealed PATH against a stub `curl` and a local tarball, which
  covers its `.version` recording and the `fkit` wrapper it writes. The real download from GitHub —
  the step every install actually depends on — is currently verified by neither local tests nor CI.
- **Static inspection establishes no behavioral acceptance.** The test sources are retained, but no
  test result covers the paused working tree or a later release's committed bytes.
- **There is no npm-registry publish** (`bin/release.mjs`, *"Makes no npm-registry publish."*).
  The tag and `main` are the whole distribution.
