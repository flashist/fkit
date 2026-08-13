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
- `claude/fkit-claude.sh:106` — the launcher resolves the same default when `.version` names no ref.

So **merging to `main` is the act of shipping.** Every commit on `main` is live to the next install
the moment it is pushed. There is no staging channel and no promotion step between the two.

### The tag is a marker, not an install target

`npm run release` creates an annotated `v<x.y.z>` tag (`bin/release.mjs:259-260`; the name is built
at `:213`), and that tag is how a release is *identified* — in `git log`, in an issue, in a changelog
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

Even written correctly it is not a supported configuration. `install.sh:69` records the ref into the
install's `.version`, and the update path resolves that ref's head with `git ls-remote`
(`claude/fkit-claude.sh:79-91`). A tag's head never moves, so an install sitting on one normally has
nothing to update to and the check stays quiet — but that quiet is a side effect, not a guarantee,
and it breaks in at least two ways. If `install.sh` could not resolve a sha it writes
`sha=unknown` (`install.sh:67`); the check only tests both sides for non-emptiness
(`claude/fkit-claude.sh:136-138`), so `unknown` never matches and the notice fires forever. And
`git ls-remote` on an *annotated* tag returns the **tag object's** sha while the curl fallback
returns the **commit's**, so an install that gained or lost `git` between install time and check
time compares two different shas for the same unmoved tag. Pinning is a way to freeze, not a way to
subscribe — and it is not even a reliable way to go quiet.

---

## 2. What `VERSION` does, and what it does not do

**What it does.** It names the release in the update notice. When an install and the remote report
two distinct known versions, the notice reads `v0.2.1 → v0.2.2 is available`; otherwise it falls back
to naming the change by sha (`claude/fkit-claude.sh:156-162`). **Bumping is what buys the version
wording** — skip the bump and the notice is still correct, just less informative.

**What it does not do.** It does not select, gate, or identify installed content. Distribution is
**sha-keyed**: the update check compares the installed sha against the remote head
(`claude/fkit-claude.sh:136-138`), and `VERSION` is fetched separately, afterwards, purely to word
the message (`claude/fkit-claude.sh:92-98`). The consequence — two installs can report the same
`VERSION` and hold different content — is argued in ADR-015 Context §4 and recorded as a design
constraint at `claude/structure-spec.md:23`.

**This is not an argument for bumping less.** `ai-agents/knowledge-base/architecture.md:415` calls
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
it (`test/structure-manifest.test.js:115`, `claude/structure-manifest.tsv:3`). Adding a *new*
top-level entry to `claude/scaffold/` is **more** than a regen, not less: the generator refuses
loudly and tells you which two halves of the walk to teach
(`bin/generate-structure-manifest.mjs:268-277`), because whether a new file ships to a project is a
decision, not a derivation. Teaching the generator is step one — you still have to run
`npm run generate:manifest` afterwards and commit the result, or the tree is stale exactly as if you
had skipped the regen entirely.

**2. Run the suite yourself first.**

```sh
npm test
```

Not as the last line of defence — `npm run release` runs it for you (§4). Run it first because of
cost. A green run takes **roughly 6–8 minutes, machine-dependent**; a red one usually comes back in
about a minute, because `npm test` is `node --test test/*.test.js && bash test/prove-red.sh`
(`package.json:5`) and a failing unit suite short-circuits at the `&&` before the slow mutation gate
ever starts. Failing early is cheap. Failing eight minutes into a release run is not.

**3. Decide the bump.**

```sh
npm run release          # patch
npm run release:minor
npm run release:major
npm run release -- --version 1.2.3
```

`VERSION` is the source of truth and `package.json` is kept in sync with it. When deriving a bump the
two must already agree, or the script aborts and asks you to reconcile them
(`bin/release.mjs:143-149`).

**4. If unsure, dry-run it.**

```sh
npm run release:dry
```

It prints the whole plan and touches nothing — but note it **still runs the full suite**, so a dry
run is not a cheap run.

---

## 4. What `npm run release` does for you

**The test gate cannot be forgotten.** A release run executes `npm test` before its first mutating
line and refuses to release on red (`bin/release.mjs:175-192`) — skipping it is possible, but only
by asking for it explicitly with `--no-test` (`bin/release.mjs:84`, `:188`), which §5 costs out. The
position of the gate is deliberate: at that point nothing has been written, staged, committed, or
tagged, so a red suite is a clean abort leaving the tree exactly as you left it. Gating any later
would leave `VERSION` and `package.json` bumped and dirty, and the next default run would bump again
(`bin/release.mjs:160-166`).

Then, in order (`bin/release.mjs:200-263`):

1. bump `VERSION` + `package.json`
2. `git add -A`
3. commit
4. push the branch
5. create the annotated `v<version>` tag
6. push the tag

**The gate and CI cover different things, and neither replaces the other** — the argument is made in
full at `.github/workflows/test.yml:3-11`. In short: the **gate** sees the working tree that
`git add -A` is about to ship, including uncommitted and untracked work, which CI structurally
cannot; **CI** covers `main`'s HEAD, which is what `install.sh` actually installs, and its verdict
arrives after the push rather than before it.

CI runs on every push to `main`, on every pull request, and on demand via `workflow_dispatch`
(`.github/workflows/test.yml:16-20`). It has been exercised on real pushes and has already caught a
failure that a local run had not. Two of its settings are load-bearing rather than cosmetic:
`fetch-depth: 0` (`.github/workflows/test.yml:38-42`), without which the manifest test refuses a
shallow clone and the suite dies at module load; and `timeout-minutes: 20`
(`.github/workflows/test.yml:33`), which stops a hung mutation gate from burning a runner.

---

## 5. What is still not covered

- **`--no-test` can still ship an unverified tree.** It is loud — an unconditional stderr banner
  fires (`bin/release.mjs:194-197`) — and it is never a default, but nothing blocks it.
- **`install.sh` itself is untested.** No suite under `test/` exercises it. The one script every
  install actually executes is covered by neither the gate nor CI.
- **The gate tests the tree as it stood when the suite started, not the exact committed bytes.** The
  version bump is written after the suite runs, and minutes separate the gate from `git add -A`. This
  is deliberate and documented in place (`bin/release.mjs:167-174`).
- **There is no npm-registry publish** (`bin/release.mjs:77`). The tag and `main` are the whole
  distribution.
