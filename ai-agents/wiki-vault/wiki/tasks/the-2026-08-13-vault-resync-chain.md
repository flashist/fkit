# The 2026-08-13 vault re-sync chain — six rows, one page written three times

**Source**: `ai-agents/tasks/done/0263-…`, `0269-…`, `0282-…`, `0285-…`, `0258-…`, `0289-…/brief.md`
**Status**: done — all six ✅ **Done (agent-closed — not owner-verified)**, closed 2026-08-13
**Sprint/Tag**: Sprint 5 (`0269` `P9`, `0258` `P16`) · Backlog, unscheduled (`0263`, `0282`, `0285`,
`0289`) · Owner `fkit-wiki` on every one

## Goal

Six vault-maintenance rows closed on a single day, all owned by the wiki role, all following closes
elsewhere that **falsified something the vault had already written down**. They are recorded as one
page because **the chain is the finding** — no single row of it is remarkable, and the shape they make
together is.

| Task | Board | What it repaired |
|---|---|---|
| `0263` | Backlog | The vault still called **Sprint 3 the active board** after Sprint 4 was archived and Sprint 5 opened — two boards stale |
| `0269` | Sprint 5 `P9` | Ingest of ADR-040 and ADR-041, the sprint-identity decisions |
| `0282` | Backlog | The vault's **"no CI"** claims, after `0256` landed `.github/workflows/test.yml` |
| `0285` | Backlog | `systems/install-and-self-update` after `0257` changed the update banner |
| `0258` | Sprint 5 `P16` | The same page again, after `0252` landed `RELEASING.md` |
| `0289` | Backlog | The same page a **third** time — its `0285` block's *"still-open `0254`"* claim, which `0254`'s own close falsified |

## Key Changes

**Writes confined to `ai-agents/wiki-vault/`** on every row (ADR-005), and **`log.md` appended, never
edited** — the append-only rule admits no exception, so each correction is a **new dated entry naming
its target**, with the original left byte-identical.

- **Three new decision pages** entered the vault across the chain — ADR-040, ADR-041 and (by the
  2026-08-13 sync that closes it) ADR-043.
- **`systems/install-and-self-update` gained `RELEASING.md` to its `**Key files**`** and three stacked
  correction layers, one per resync.
- **The CI claims were inverted where they were wrong** — ⛔ the vault must never again say *"no
  CI"*; measured **5 runs, 4 success, 1 failure**. ⛔ And it must never say *"always green"*: fkit's
  **first-ever CI run went RED**.

## Outcome

### ⚠️ The finding: one page was rewritten three times in one day, and nothing noticed

`systems/install-and-self-update` was written by `0285`, then `0258`, then `0289` — **three
independent tasks, one calendar day, one file.** Each was individually correct. None of them was
triggered by anything *detecting* the staleness: each was filed by a human or an agent noticing, after
the fact, that a close had falsified a page.

**Whether anything should notice when a close falsifies a vault claim is task `0290`, open.** That
question is the chain's real output — more than any of the six repairs.

### ⚠️ A false attribution reached the vault and survived several retellings

`0289`'s own run caught it: the claim that `bin/release.mjs`'s `doTag` / `doPush` are *"read … and
never consulted again"* is **false of the file** — re-measured, the two flags are consulted at
**seven** sites, and it is the **summary block alone** that never reads them.

⛔ **And the gloss is not in `0254`'s review at all** — `grep -c 'consult'` on that review returns
**0**. It exists in `0288`'s brief. *A claim about a document was repeated into the vault by readers
who had not opened the document.* Correcting the pages that mis-attribute it is task **`0295`**, open
and **not** discharged by this chain.

### The exclusion that held

`0269` and `0258` were two of the three Sprint 5 rows held **out of the `/fkit-sprint-ship-loop` run**
by owner ruling of 2026-08-10 — because the loop's Build step spawns `@fkit-coder`, which is forbidden
from writing the vault, so the loop would either stall on a refusal or breach ADR-005. ✅ **Both
shipped, and the loop never drove either**: they ran through spawned `@fkit-wiki` librarians, which is
the route the ruling itself named. **An exclusion from a loop run is not a block.**

### What the chain does NOT close

- ⛔ **`0290`** — the detection question. Open.
- ⛔ **`0291`** — two stale vault claims (`index.md`'s `~6 min per release`, superseded by the owner's
  *"roughly 6–8 minutes, machine-dependent"* ruling; and a `log.md` entry saying *"a follow-up
  `0288`"* where it means `0289`). Open. ⚠️ The `log.md` half can only ever be a **new entry**.
- ⛔ **`0295`** — the false attribution above, plus an unconditional *"exits 2"* claim that has a
  counterexample and a *"Three findings"* label standing above **four** bullets. Open.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board `0269` and `0258` closed on
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why every one of these six is owned by `fkit-wiki` and by nothing else
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the wiki flags a finished row and never closes it
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — why the sprint loop cannot drive a wiki row
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] · [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — `0269`'s ingest
- [[systems/install-and-self-update]] — the page written three times
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — `0211`, which settled that `log.md` is append-only with **no exceptions**
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, whose CI landing made `0282` necessary
- [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] — `0257`, which triggered `0285`
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `0252`, which triggered `0258`
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — `0254`, whose close triggered `0289`
- [[tasks/wiki-sync-post-omnigent]] · [[tasks/wiki-resync-for-adr-033]] · [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — earlier links in the same long chain of vault re-syncs
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — ⚠️ *Added 2026-08-14:* tasks `0291` and `0295`, the **eighth and ninth** rows of this chain — and the ones that make its finding sharper: **both exist because a vault page shipped unreviewed, and both retroactive reviews left no artifact on disk.** They were run as **one write** to the page this chain records being written three times
- [[tasks/wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface]] — ⚠️ *Added 2026-08-14:* task `0293`, the **seventh** row of this chain and the one the three-writes churn directly produced — the owner filed it rather than running it precisely to stop a fourth same-day write. ⛔ **A fourth write was made anyway during the sync that served it, and reverted**; the five unreciprocated links that reversion left are folded into `0295`
- [[tasks/rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint]] — ⚠️ *Added 2026-08-22:* task `0280`, the same "no CI" class **outside** the vault — in `/fkit-wiki-lint`'s own shipped `SKILL.md`, together with a **fabricated citation** that was deleted rather than repaired
