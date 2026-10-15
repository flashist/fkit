# Overhaul the README for first-time visitors

**Source**: `ai-agents/tasks/done/0478-overhaul-the-readme-for-first-time-visitors/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, landed in commit `b3808cf`
**Sprint/Tag**: Backlog board · Unscheduled · task `0478` · owner `fkit-coder`

## Goal
Rewrite `README.md` for a **new visitor**, who in 2–3 minutes should learn what fkit is, why it exists, how to
install, run and remove it, and what a first session looks like. Maintainer detail moves to separate docs. ⛔
**Do not delete information — relocate it.** The spec is an owner-supplied brief, copied verbatim into the task
folder (`assets/source-brief.md`); where it and the owner's rulings differ, **the rulings win**.

Owner rulings 2026-10-02 (selected option text, relayed): **process** — *"File it + I drive it"*; the owner's OK
at the plan step also authorises the coder to write. **Delivery** — *"Straight to main — As we've done today"*,
superseding the source brief's "one PR, don't push to main" (⚠️ `main` is live for every new install; the owner
accepted that). **Stray root file** — move, never delete. **History section** — *"Move to CHANGELOG"*.

## Key Changes
- **`README.md` 230 → 171 lines** (the brief aimed at ~110–130; the approved plan's measured draft was ≈173). New:
  "Why fkit", a first-session walkthrough, key terms, supported platforms, what the installer does, uninstall
  (saying plainly that `ai-agents/` is the user's own work), an env-var table, Contributing, one line of badges.
  Codex wording kept as *optional but recommended, Claude-only fallback flagged*. The GIF teaser stays a plain
  image (a link to a `user-attachments` video becomes a player on GitHub).
- **Relocated, not deleted:** History and the "an update does not repair this" note → a new root **`CHANGELOG.md`**;
  the web-board section → new **`docs/board.md`**; the layout tree → new **`CONTRIBUTING.md`**; role-lock mechanics
  → `claude/README.md`; inline ADR references → one pointer to the decisions folder.
- **Side fixes:** `package.json` `description` now names seven roles including the lead; the stray root
  `handoff-fkit-status-filtered-board.md` (a 2026-07-18 producer handoff for task `0039`) moved, unchanged, to
  `ai-agents/knowledge-base/reports/2026-07-18-handoff-fkit-status-filtered-board.md`.

## Outcome
- **Its review found the `fkit update` bug** (finding R3: env vars set on `curl`, not on the piped `sh`) — fixed
  properly by `0481`, with the README's *"keep custom paths exported"* workaround replaced there.
- **Follow-ups it spawned:** `0479` (nothing in the release flow knew `CHANGELOG.md` existed), `0481`, and `0484`
  (no check reads links in the top-level docs — open). ⚠️ When `0467` retires the board reader, it must also remove
  `docs/board.md` and the README pointer.
- The GitHub "About" box and topics are an **owner action**, not part of the change.

## Related
- [[tasks/keep-changelog-md-up-to-date-at-every-release]] — `0479`
- [[tasks/make-fkit-update-reinstall-from-the-source-and-paths-it-was-installed-from]] — `0481`
- [[tasks/make-every-document-say-codex-is-optional-but-recommended]] — `0476`, the other half of the Codex ruling (not concurrent)
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — the board section moved to `docs/board.md`
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board it closed on
- [[tasks/sprint-10-the-0472-0482-batch]] — deliberately not on that board (already closed)
- [[systems/install-and-self-update]]
- *Added 2026-10-15 (sync `baf6a4e`→`96c7263`, closing a one-way link):* [[tasks/check-the-links-in-fkits-top-level-docs-not-only-under-ai-agents]] — `0484`, whose new check now covers `README.md` and `docs/board.md`'s inbound links, released `CHANGELOG.md` entries included
