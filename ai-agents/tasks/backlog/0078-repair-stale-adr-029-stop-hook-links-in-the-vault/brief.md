# Repair the stale `adr-029-stop-hook` links in the wiki vault

## ID
0078

## Sprint
Sprint 2

## Priority
80

## Status
🔄 In progress

## Context

On 2026-07-19 a new ADR was recorded against a number that was already claimed. **ADR-029 is now
[the task-folder / global-task-ID decision](../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)**;
the stop-hook decision it collided with was renumbered to
**[ADR-030](../../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)**.
Both files are correct on disk. The vault was ingested **before** the renumber, so it still carries the
old slug.

**Ten vault pages link `[[decisions/adr-029-stop-hook-enforces-turn-completion-contract]]`** — derive
the live list with `grep -rl "adr-029-stop-hook" ai-agents/wiki-vault/` rather than trusting a count
written down here. At the 2026-07-19 snapshot they were `index.md`, `log.md`,
`wiki/tasks/sprint-2-remove-omnigent.md`, `wiki/decisions/adr-012`, `adr-016`, `adr-018`, `adr-021`,
and `wiki/systems/fkit.md`, `role-locked-sessions.md`, `testing-and-verification.md`.

**The vault's own decision page also sat at the old slug.** At HEAD the page was
`wiki/decisions/adr-029-stop-hook-enforces-turn-completion-contract.md`; there was no `adr-030` page.
So this was **a page rename plus an inbound-link repair**, not a pure link sweep.

### Why this was pulled forward rather than absorbed by task 78

**The inbound wikilinks resolved cleanly — to the wrong decision page.** Every
`[[decisions/adr-029-stop-hook-…]]` link landed on a real, present vault page, so nothing looked
broken from inside the vault. An agent asking about the turn-completion `Stop` hook got a confident
answer off a page that the surrounding renumber had made wrong, with **no dead link to notice and no
further lookup to prompt a second thought**. That is the dangerous shape of this defect: it fails
silently and completely, unlike a broken link, which announces itself.

> ⚠️ **An earlier revision of this brief recorded the opposite mechanism** — that the links were dead
> rather than mis-resolving, and that reaching the wrong ADR needed a further `knowledge-base/` grep.
> **That was wrong**, and it is corrected above. It came from inspecting the working tree *while the
> repair was already in flight* and reading the half-repaired state as the original one. The check
> that settles it is `git cat-file -e HEAD:<path>`, not `ls`. **The urgency conclusion below was
> correct under either mechanism and is unchanged** — only the mechanism was misdescribed.

Waiting for [task 78](wiki-sync-task-folder-migration.md) would mean waiting out tasks
[75](../done/assign-global-task-ids-and-create-registry.md) and
[76](migrate-tasks-to-folder-structure-and-update-tooling.md) — the entire folder migration.

## What to build

- **The vault decision page renamed** from the `adr-029-stop-hook-…` slug to
  `adr-030-stop-hook-enforces-turn-completion-contract.md`, via `git mv` so the rename is visible in
  history rather than reading as a delete plus an add.
- **Every inbound vault link to the old slug re-pointed** to the new one.
- **Link text and surrounding prose corrected too, not just the href.** Any page that says "ADR-029"
  in words while meaning the stop hook must read "ADR-030". A repaired href under prose naming the
  wrong number leaves the same wrong answer in place. **This is not optional tidying:** at least one
  such mention (`wiki/decisions/adr-025-…:98`) is **bare prose carrying no slug at all**, so no
  mechanical link sweep can find it. Prose mentions must be hunted separately, by number.
- **`index.md` and `log.md` included** — they are index surfaces, and a stale entry there is the most
  likely thing an agent reads first.

**Reach as executed: 11 files, not the 10 first estimated** — `wiki/systems/role-locked-sessions.md`
was missing from the initial list — **plus** the page rename itself **plus** the bare-prose mention
above. Derive the set with `grep -rl` rather than working from any list written down here.

## Verification steps

- `grep -rn "adr-029-stop-hook" ai-agents/wiki-vault/` returns **nothing**.
- `grep -rni "adr-029" ai-agents/wiki-vault/` returns only references that genuinely mean the
  task-folder decision — checked one by one, not assumed.
- Every repaired link resolves to `wiki/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md`,
  checked against each linking file's own directory depth, not by filename alone.
- **No vault page remains at the `adr-029-stop-hook-…` slug** — the rename landed, and `git status`
  shows it as a rename (`R`), not a delete-plus-add.
- **The bare-prose mention at `wiki/decisions/adr-025-…:98` is corrected** — checked by name, since no
  slug sweep will return it.
- The touched pages' back-link sections on the ADR-030 page are consistent with the repair.
- `/fkit-wiki-lint` runs clean over the vault, or its remaining findings are listed and explained.

## Notes

- **Owner: fkit-wiki** — the exclusive write gateway for `ai-agents/wiki-vault/` (ADR-005).
- **Depends on: nothing.** Independently shippable; it does not wait on the folder migration.
- **Filed as a tracking record for work already in flight.** `fkit-wiki` began this repair on
  2026-07-19, before this brief was written. At filing time the repair was **not yet complete** — all
  ten stale references were still present and the vault had no uncommitted changes. Status is
  `🔄 In progress` accordingly; do not read this brief as work still to be scheduled.
- **✅ Approved scope widening — a new ADR-029 page WAS written in this task.** An earlier revision of
  this brief said it would not be, deferring the *new* ADR-029 (task folder / global ID) to task 78.
  `fkit-wiki` wrote it anyway, on discretion the architect had explicitly granted, reasoning that
  leaving 029 with no page while 030 exists is the same defect wearing a different hat — the vault
  would be internally inconsistent the moment the rename landed. **The architect reviewed this and let
  it stand; the judgment was sound.** Recorded here as a deliberate, approved widening rather than an
  undocumented overrun.
  > **Cleanly reversible if the owner prefers:** delete
  > `wiki/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md` and the 7 back-link
  > lines pointing at it. Nothing else depends on it. Note that reverting hands the page back to task
  > 78, which waits out the whole migration.
- **Relates to [task 78](wiki-sync-task-folder-migration.md)**, whose scope no longer carries this
  repair — a note to that effect has been added to task 78's brief so it is not done twice.
- **Root cause is the ADR-numbering collision itself**, not the vault. Nothing in this task prevents a
  second collision; whether the allocation procedure needs a guard is an open question for the owner.
