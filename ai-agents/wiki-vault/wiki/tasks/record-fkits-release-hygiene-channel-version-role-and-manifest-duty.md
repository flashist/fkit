# Record fkit's release hygiene — the release channel, `VERSION`'s real role, and the manifest regeneration duty

**Source**: `ai-agents/tasks/done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 5 · `P13` · closed 2026-08-13 · `(agent-closed — not owner-verified)`

## Goal

**Nobody cutting a release had one place to read what a release actually *is* in fkit.** Three facts
were all true and all verified on disk, and each was either recorded nowhere or recorded only
somewhere a releaser would never look: **`main` is the release channel**, **what `VERSION` does and
does not do**, and **when `npm run generate:manifest` is owed**.

The task writes **one maintainer document** and **one cross-reference**. It changes **no behaviour**.

## Key Changes

Two files, plus a worklog — the file count is two on the owner's Q1 ruling: **no README change**,
which task `0253` owns.

- **`RELEASING.md`** — new, at the repo root. 201 lines, five sections plus a preamble.
- **`ai-agents/knowledge-base/architecture.md`** — **+2 lines** appended to flow §6 (Release),
  pointing at `RELEASING.md`. Zero lines removed.

**Why the repo root and not `ai-agents/knowledge-base/conventions/`** — recorded in the document
itself, and it is a placement ruling, not tidiness. `conventions/` is **dual-homed into every
consuming project**, and a consuming project has no release to cut. `RELEASING.md` sits outside
`claude/scaffold/`, so `install.sh` never copies it anywhere, and it is absent from
`claude/structure-spec.md`'s inventory, so no conformance check knows about it. ⛔ *"Please do not
'tidy' it into `conventions/`"* is in the file's own preamble.

### The three recorded facts

1. **`main` is the release channel; the tag is a marker, not an install target.** Merging to `main`
   **is** the act of shipping — every commit is live to the next install the moment it is pushed;
   there is no staging channel and no promotion step. The `v<x.y.z>` tag *identifies* a release.
   ⚠️ **The document deliberately states the WEAK claim, because the strong one is false:** a tag
   **is** reachable (`$REF` is interpolated without inspection), but **nothing in the release flow,
   the README, or `fkit update` puts an install onto one on its own**. **Reachable, not supported.**
   ⛔ It also records the shell trap: the `FKIT_REF=` assignment must come **after** the pipe, because
   a POSIX assignment prefix binds to the first command — the pre-pipe form **silently installs
   `main` while looking like it pins a tag**.
2. **What `VERSION` does** (names the release in the update notice — bumping buys a **version delta**
   instead of a **sha delta**) **and what it does not do** (select, gate, or identify installed
   content; distribution is **sha-keyed**). ✅ **Not an argument for bumping less** — the document
   says so explicitly and reaffirms `architecture.md`'s "load-bearing" call, in one specific sense.
3. **The `npm run generate:manifest` duty** — owed for scaffold content the manifest covers **or** a
   change to the generator's own path map or hash contract, committed in the *same* change. ⚠️ The
   negative is the half people get wrong: `claude/skills/`, `claude/agents/` and
   `claude/fkit-claude.sh` **owe no regen**.

### ⚠️ Three claims in the approved plan failed verification and were corrected, not absorbed

- **C1 — *"CI has still never run"* was FALSIFIED.** Measured with `gh run list`: **5 runs — 4
  success, 1 failure.** The plan instructed ⛔ *do not write that CI works*; the build wrote the
  **verified** truth instead — CI runs on push / PR / `workflow_dispatch`, has been exercised on real
  pushes, and **has already caught a failure a local run had not** (the 2026-08-12 red run, fixed by
  task `0283`). The §5 residual slot the plan had reserved for CI now holds a different, verified
  residual: **`install.sh` itself is untested**.
- **The runtime figure became a range.** The owner ruled **"roughly 6–8 minutes, machine-dependent"**
  on 2026-08-13, **superseding their own earlier `~6 min` ruling**. Observed span **328–463 s**.
  ⛔ The resulting disagreement with `bin/release.mjs` and `.github/workflows/test.yml`, which still
  say `~6 min`, is **deliberate and accepted on the record**.

## Outcome

`RELEASING.md` landed 2026-08-13 and is now the maintainer-facing source of truth for how fkit ships.
Its §5 is an explicit **"what is still not covered"** list rather than a claim of completeness:
`--no-test` can still ship an unverified tree (loud, never a default, but unblocked); **`install.sh`
itself is untested by any suite**; the gate tests the tree as it stood when the suite *started*, not
the exact committed bytes; and there is **no npm-registry publish** — the tag and `main` are the
whole distribution.

**Follow-ups and residuals**

- ⚠️ **`0252`'s own brief is now stale on one point** — its banner asserts *"CI HAS NEVER RUN"*. The
  landed document does not repeat it. A brief is a dated record; read the document, not the brief.
- The vault re-sync of [[systems/install-and-self-update]] was **filed rather than performed**
  (task `0258`), because **only `fkit-wiki` may write `ai-agents/wiki-vault/`**
  ([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]) and the coder landing this task
  is structurally barred from following its own change into the vault. That re-sync ran 2026-08-13.
- Two items were handed to the producer as **outside this task**: a `_fkit_reinstall`
  env-propagation defect in the launcher, and the `~6 min` figure printed by `bin/release.mjs`.

## Related

- [[systems/install-and-self-update]] — the vault page this task's document re-synced; §Release now
  carries the channel/tag distinction and points at `RELEASING.md`
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] — the decision
  `architecture.md` §6 cites for the release flow; version bumping load-bearing
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — its Context §4 is where
  the **sha-keyed, not version-keyed** distribution consequence is argued
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — task `0256`, the in-release `npm test`
  gate and CI that this document describes in its §4
- [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] — task `0257`, which retired the old
  justification for calling version bumping load-bearing
- [[tasks/make-the-lockdown-guard-case-test-filesystem-independent]] — task `0283`, the one red CI run
  this document cites as CI having caught something a local run had not
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board this row shipped on
- [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — `0253`, the README-side half of the same release-hygiene cluster
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — `0254`, which relies on this task's **weaker, true** claim: a tag is **reachable, not supported**
- [[tasks/the-2026-08-13-vault-resync-chain]] — task `0258`, the vault re-sync this task's `RELEASING.md` triggered
