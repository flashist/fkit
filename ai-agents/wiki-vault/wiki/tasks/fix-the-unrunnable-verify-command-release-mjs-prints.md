# Fix the unrunnable verify command `bin/release.mjs` prints

**Source**: `ai-agents/tasks/done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md`
**Status**: done — ✅ **Done (agent-closed — not owner-verified)**, closed 2026-08-13
**Sprint/Tag**: Sprint 5 · `P12` · ID `0254` · Owner `fkit-coder`

## Goal

After a successful release `bin/release.mjs` printed a command that **cannot work**:

```
  Verify: npx github:flashist/fkit#<tag> --version
```

`package.json` has **no `bin` field**, so npx has no executable to resolve — reproduced 2026-08-08
under a clean `PATH` as `npm error could not determine executable to run`. Cosmetic in blast radius,
but it sends the releaser to a dead end **at exactly the moment they want reassurance the release
landed**.

⛔ **Fixing it explicitly did not mean adding a `bin` field** — fkit is deliberately not an
npm-installable CLI ([[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]), and
the brief made adding one a stop-and-escalate condition rather than a coder's judgement call.

## Key Changes

**One line, one file** — `bin/release.mjs`, in the post-release summary block:

```diff
-  console.log(`  Verify: npx github:flashist/fkit#${tag} --version`);
+  console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`);
```

**The replacement was executed, not asserted** — the brief required its output be recorded in the
worklog, and the positive case was run against a real tag (`exit=0`, the ref printed). ⛔ No `bin`
field, no bump or tag logic touched, no second printed line about installs tracking `main` (owner
answer verbatim *"No — leave it out"*).

## Outcome

### ⚠️ The brief's own supporting claim was FALSE, and the vault records the corrected form

The brief justified the fix partly on *"**no install path resolves a tag**"*. ⛔ **That is wrong.**
Measured on disk (2026-08-08 and re-measured by the 2026-08-13 sync): `install.sh` sets
`REF="${FKIT_REF:-main}"` and fetches `codeload.github.com/$REPO/tar.gz/$REF` — **`$REF` is
interpolated without inspection, so a tag IS reachable.**

**The true, weaker claim** — the one
[[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] (`0252`) states
deliberately — is that the **default and documented path tracks `main`**, and **nothing in the release
flow, the README, or `fkit update` puts an install onto a tag on its own**. ⛔ **Reachable, not
supported.** And the incantation only works **post-pipe**: `curl … | FKIT_REF=v0.2.1 sh`. Written
before the pipe, the assignment binds to `curl` and **silently installs `main` while looking like it
pins a tag**.

### ⚠️ The replacement line is NOT simply "fixed" — a narrower set of defects is still open

Task **`0288`** (Backlog board, `🔲 Backlog`, unranked) carries them. ⛔ **This page does not claim the
printed verify command is now correct in all cases.** The two that matter:

- **The summary block is guarded only by `dryRun`.** The tag and push *steps* above it do branch on
  `--no-tag` / `--no-push`, but the **summary block itself** never reads either — so the verify line
  prints on **every** non-dry path, including paths that just declined to create the tag it names.
  ⛔ **Not confined to runs that publish nothing:** `--no-tag` **alone** fires it, and that run
  genuinely pushes commits to `origin/main`.
- **A false green.** `--no-bump` over a tag already on origin makes the check exit 0 — the worst
  variant, because it reports success for a release that did not happen.

### ⚠️ A gloss about this task that is widely repeated and is NOT in its review

**`0288`'s brief describes the two flags as *"read … and never consulted again."*** ⛔ **That
description is false of the file** — re-measured 2026-08-13, `grep -n 'doTag\|doPush' bin/release.mjs`
returns **seven** sites: the two declarations plus the tag-exists check, the branch push, the tag
creation, the tag push, and the skip-tag branch. **The flags are consulted repeatedly; it is the
summary block alone that never reads them.**

⛔ **And the gloss does not appear in `0254`'s own review** — `grep -c 'consult'` on that review
returns **0**. *A claim about a document survived several retellings without anyone opening the
document.* Correcting the vault pages that mis-attribute it is task **`0295`**, open.

## Related
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `0252`, which records *why* a tag is not an install target
- [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — `0253`, shipped the same day off the same board
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, the release gate this line reports after
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] — why no `bin` field was the answer
- [[systems/install-and-self-update]] — the release flow, and where `0288`'s open defects are recorded in detail
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board it closed on
- [[tasks/the-2026-08-13-vault-resync-chain]] — task `0289`, the vault re-sync this task's close triggered, and where the false "never consulted again" attribution was caught
