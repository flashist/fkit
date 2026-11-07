# Releasing fkit

Maintainer guidance for cutting a release **of the fkit repo itself**. It is not documentation for
people who *use* fkit.

This file ships to nobody. It sits outside `claude/scaffold/`, so `install.sh` never copies it into a
consuming project, and it is absent from `claude/structure-spec.md`'s inventory tables, so no
conformance check knows about it. That is why it lives at the repo root and **not** in
`ai-agents/knowledge-base/conventions/` — those documents are dual-homed into every project, and a
consuming project has no release to cut. Please do not "tidy" it into `conventions/`.

---

## 1. `main` is the release channel

A default install reads `main`, not a tag:

- `install.sh:19` — `REF="${FKIT_REF:-main}"`.
- `install.sh:32` — `$REF` goes straight into a `codeload.github.com` tarball URL.
- `claude/fkit-claude.sh:106` (`fkit_ref="${fkit_ref:-main}"`) — the launcher resolves the same default when `.version` names no ref.

So **merging to `main` is the act of shipping.** Every commit on `main` is live to the next install
the moment it is pushed. There is no staging channel and no promotion step between the two.

### The tag is a marker, not an install target

`npm run release` creates an annotated `v<x.y.z>` tag (`bin/release.mjs:469-470` — the `// 3. tag`
step's `create annotated tag`; the name is built at `:420`, `` const tag = `v${version}` ``), and that
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

## 3. Prepare a release

1. Check the intended changes and update `CHANGELOG.md` under `## Unreleased`. The release tool
   refuses a missing, duplicated, or empty section unless `--allow-empty-changelog` is explicit.
2. If shipped scaffold files changed, run `npm run generate:manifest` and include the regenerated
   `claude/structure-manifest.tsv`. Changes only to skills, agents, native bindings or launchers
   do not require scaffold regeneration.
3. Run whatever manual checks the work needs. Existing commands are `npm test`,
   `npm run test:release`, and `npm run test:prove-red`. **Nothing runs automatically** on a push,
   pull request, schedule, release, or release dry-run (owner ruling, 2026-11-07).
   No new permanent tests are authorized for the native port. Report skipped and failing checks.
4. Choose the bump: `npm run release` (patch), `release:minor`, `release:major`, or
   `npm run release -- --version X.Y.Z`. `VERSION` and `package.json` must agree first.
5. Inspect `npm run release:dry`. It prints the plan without running suites or mutating files.

Never commit or push a release unless the owner explicitly requests it.

## 4. Release behavior

The tool validates the repository, branch, versions, and changelog before writes. It rechecks
HEAD and re-reads the changelog immediately before mutation. It does not run test commands.
`--no-test` is retained as an accepted no-op for existing callers.

A real release then:

1. bumps VERSION and package.json, stamps `## Unreleased` as `## v<version> — <date>`, and opens
   a new empty Unreleased section;
2. stages and commits the tree;
3. pushes the branch unless `--no-push`;
4. creates an annotated tag unless `--no-tag`;
5. pushes the tag unless disabled.

`--no-bump` can finish a partially completed release without creating another version. Existing
summary/recovery limitations still apply: a pre-existing local-only tag is reported unfinished
and is not silently pushed. No npm-registry publication is performed.

The GitHub test workflows are manual-only (`workflow_dispatch`). Their disabled/enabled state
is a separate repository setting; enabling a manual-only workflow does not add a push or cron
trigger. The release tool does not check whether manual tests ran and never claims they passed.

## 5. Verification limits

- Manual tests can be skipped; a release may therefore ship unverified behavior.
- The changelog guard proves a section has content, not that the notes are complete or accurate.
- The installer's real network fetch is not covered by the existing sealed local fixtures.
- Version stamping occurs after manual checks, so those checks do not verify the final version bytes.
- Native Berd/Buzz import and model-backed workflows require app-level smoke testing; generated
  files passing a local check do not prove those flows. See [native setup](docs/native-runtimes.md).
