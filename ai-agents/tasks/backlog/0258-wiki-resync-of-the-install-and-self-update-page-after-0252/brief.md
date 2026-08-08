# Wiki re-sync of the install-and-self-update page after `0252` lands `RELEASING.md`

## ID
0258

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

**Filed on a named owner ruling**, relayed through the coordinating session on **2026-08-08**, in
answer to this producer's open question 3 on the 0252–0255 filing — verbatim: **"wiki resync for
0252: yes, file it. Follow the 0238/0239 precedent; owner is `fkit-wiki` per ADR-005."**

### What makes the vault page stale

[`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md)
creates a repo-root `RELEASING.md` recording three facts about how fkit ships — that `main` HEAD is
the release channel and the `v<x.y.z>` tag is not an install target; what `VERSION` does (names the
release in the update notice) and does not do (select, gate, or identify installed content); and the
`npm run generate:manifest` duty, which is owed for `claude/scaffold/` content only. It also adds a
pointer to it from `architecture.md` §6.

`ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` carries its own **§Release** section
covering the same ground, and its `**Key files**` line already enumerates `install.sh`,
`claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `bin/release.mjs`, `VERSION`, `package.json`.
Once `0252` lands, that page is the last place the release story is told **without** the channel/tag
distinction and **without** a pointer to the document that now owns it.

### Why `fkit-wiki` and nobody else

**Only `fkit-wiki` may write `ai-agents/wiki-vault/`** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
The coder landing `0252` is structurally barred from following its own change into the vault, which
is exactly why this exists as a separate task with a different owner — the same split as
[`0248`/`0249`](../../done/0249-wiki-ingest-of-the-structure-check-design-report-and-companion-adr/brief.md).

### The precedent

[`0238`](../0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md) and
[`0239`](../0239-wiki-resync-adr-012s-vault-page-after-0232/brief.md) are the named precedent: a
source document changed, its vault page went stale, and the resync was filed rather than performed.
**Read `0239` and follow its shape** — in particular its answer to whether the vault page is edited
in place or gains its own dated note, so the vault does not accumulate two correction conventions.

## What to build

A re-sync of `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` against the repo as
`0252` leaves it.

- **§Release gains the channel/tag distinction** — `main` HEAD is what `install.sh` and `fkit update`
  resolve; the tag is a marker no install path uses.
- **The `VERSION` paragraph is made precise, not reversed.** ⚠️ The page currently says *"**Version
  bumping is load-bearing** — self-update compares the installed sha against the remote head and
  reports the version from `VERSION`,"* and explains that this is why ADR-001's "stop bumping"
  instruction was superseded. **That is accurate and its conclusion must survive.** The resync
  sharpens *what the version does* (names the release in the notice) versus *what it does not do*
  (gate or identify installed content) — it does **not** relabel `VERSION` as cosmetic.
- **A pointer to `RELEASING.md`**, and `RELEASING.md` added to the page's `**Key files**` line.
- **Re-derive from the landed `RELEASING.md` and the landed `architecture.md` §6**, not from `0252`'s
  brief. What `0252` actually wrote is the input; what it planned to write is not.
- `log.md` records the sync, per the vault's own logging convention.

### Constraints

- **⛔ Do not start before `0252` has landed.** Re-syncing against a document that does not exist
  either invents its content or burns the task.
- **⛔ Do not edit anything outside `ai-agents/wiki-vault/`.** Not `RELEASING.md`, not
  `architecture.md`, not a board, not a brief.
- **⛔ Do not move any task file** — the movers are producer-only (ADR-033).
- **⛔ No commit.**

## Verification steps

1. `0252` is closed before this starts — state its close date in the worklog.
2. Diff the landed `RELEASING.md` + `architecture.md` §6 against the vault page and **report the
   claim list you derived**, not the one this brief anticipated.
3. The page states the `main`-channel/tag distinction and links `RELEASING.md`; `RELEASING.md`
   appears in `**Key files**`.
4. The page's "Version bumping is load-bearing" conclusion, and its ADR-001 supersession note,
   survive — sharpened, not reversed. Quote the before/after in the worklog.
5. Every code coordinate on the page still resolves against today's tree.
6. The correction form matches `0239`'s. If it deliberately differs, **say why**.
7. `log.md` carries the sync entry.
8. **`git diff --stat` touches `ai-agents/wiki-vault/` and nothing else.**
9. `/fkit-wiki-lint` is clean, or every finding is listed with a disposition.

## Notes

- **Depends on:** `0252` — hard.
- **Blocks:** nothing.
- **⚠️ Scope is `0252` only — deliberately, and here is the judgement rather than a silent choice.**
  Two sibling tasks touch the same vault page's subject matter and are **not** folded in:
  [`0257`](../0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md) changes the update
  banner's wording, which the page **quotes verbatim** in its "Self-update — two paths" section; and
  [`0256`](../0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md) may change the release
  sequence the §Release paragraph describes. Merging would take the **union of three preconditions**
  and block a resync that is ready the moment `0252` lands — the same reasoning `0239` recorded when
  it declined to merge with `0238`. **If either sibling has landed by the time this runs, say so in
  the worklog and file the further resync as its own task; do not silently widen scope.**
- **Batchable in scheduling** with the other open `fkit-wiki` vault tasks (`0199`, `0206`, `0212`,
  `0238`, `0239`) even though none gates another — one session, several resyncs.
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
