# Pin the two non-`ai-agents/` inventory rows so `README.md:54`'s scope sentence cannot go stale silently

## ID
0298

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, and relayed to the filing producer. **The option label is the verbatim
text: "File a follow-on task (Recommended)".**

This **discharges a recorded obligation**. It is accepted residual **AR-2** of
[`0292`](../../done/0292-scope-readme-54s-fkit-managed-structure-sentence-to-what-the-check-actually-covers/review.md)
(`review.md:230`), whose own text says: *"Status: NOT filed here — the driver's to route. ⛔ Task
filing is the producer's exclusively (ADR-033) and this worker created no task file. The follow-on is
**owed**."* This brief is that filing.

### The gap, stated exactly

`README.md:54-57` describes the launch-time structure check as noticing when *"your project's
`ai-agents/` tree, or its root `CLAUDE.md` / `AGENTS.md`, diverges from what the installed version
ships"*.

That sentence is **accurate today, and accurate only by coincidence of the current inventory**.
`claude/structure-spec.md` pins **48 inventory paths**, of which **exactly two sit outside
`ai-agents/`** — `CLAUDE.md` and `AGENTS.md`, both class `root context file`. Measured 2026-08-14:

- Inventory Table A (`## Inventory Table A — directories`) — **19 rows**, all under `ai-agents/`.
- Inventory Table B (`## Inventory Table B — files`) — **29 rows**, of which `CLAUDE.md` and
  `AGENTS.md` are the two outside `ai-agents/`.
- 19 + 29 = **48**; non-`ai-agents/` = **2**.

**If the inventory ever gains a third path outside `ai-agents/`, the README sentence becomes
factually wrong — and nothing notices.** No test in `test/` reads the root `README.md`'s prose. The
sentence would go stale **silently**, and the only signal would be a human happening to re-read it.

⚠️ **This is `0292`'s AR-1 re-raise condition (1), left deliberately unguarded.** AR-1 accepted the
sentence's coarseness as the intended shape (it is byte-identical to ADR-043 §C6, and narrowing it to
`ai-agents/` alone would fail `0292`'s own verification step 3). AR-1's re-raise trigger reads: *"the
inventory gains a path **outside** `ai-agents/` … the sentence then becomes factually wrong, not
merely coarse, **and nothing catches it**."* This task builds the thing that catches it.

### What this task is NOT

- ⛔ **It does not change `README.md:54-57`.** The wording is settled by `0292` and constrained by
  ADR-043 §C6's verbatim text. This task adds a **tripwire**, not a rewrite. A run that edits the
  sentence has done the opposite of what was ruled.
- ⛔ **It does not change `claude/structure-spec.md`'s inventory.** The count being pinned is the
  current, correct count.
- ⛔ **It does not make the check tree-wide,** and does not touch `claude/skills/fkit-heal/check.sh`
  or `claude/fkit-claude.sh`.

## What to build

A test assertion that **fails loudly, and points at the README sentence**, the moment
`claude/structure-spec.md`'s inventory gains (or loses) a path outside `ai-agents/`.

### Where it goes

`test/structure-spec.test.js` is the natural and intended home — **verify this before writing, do not
take it on this brief's word.** Measured 2026-08-14, that file already:

- parses **both** inventory tables, anchored to their exact headings (`parseInventoryTable`,
  `:79-101`, with `HEADING_A`/`HEADING_B` at `:53-54`);
- already treats `{CLAUDE.md, AGENTS.md}` as the file-set's two non-scaffold members — its own header
  comment at `:16` states check **B** as *"inventory Table B == the scaffold's files + {CLAUDE.md,
  AGENTS.md}"*.

So the parse work is done and the two paths are already named there. The new assertion is small.
**Reusing `parseInventoryTable` is the point** — an assertion built on its own private re-parse can
drift from the spec's real shape.

### What the assertion must do

1. Take **both** tables' rows (A and B) and count the rows whose path does **not** start with
   `ai-agents/`.
2. Assert the count is **exactly 2**, and assert the two are **`CLAUDE.md` and `AGENTS.md`** by name
   — a bare count of 2 passes if one is swapped for a different outside path, which is the same
   staleness with a different cause.
3. **The failure message is the deliverable, not a formality.** It must name
   `README.md:54-57` explicitly and say that the sentence there enumerates the non-`ai-agents/` paths
   and must be updated to match. A failure that says only *"expected 2, got 3"* leaves the next
   person to rediscover why anyone cared — which is exactly the rediscovery `0292` recorded this
   residual to prevent. Quote the README's own phrase in the message so it is greppable.

### Constraints

- **ADR-014: `node --test`, zero devDependencies.** No new dependency, no new runner, no new npm
  script. The existing `node --test test/*.test.js` glob picks up `test/structure-spec.test.js`
  already.
- **Do not weaken any existing assertion in the file** to make room. This is additive.
- ⛔ **No `wiki-vault/` write** (ADR-005). ⛔ **No task-file move** (ADR-033) — route the close to
  `@fkit-producer`.

## Verification steps

1. **Prove the current state, before writing anything.** Run and record:
   ```sh
   grep -c '^| `' claude/structure-spec.md
   ```
   then, scoped to the two inventory tables only, list every row whose path does not begin with
   `ai-agents/`. Expected at filing: **48 inventory rows total, 2 outside `ai-agents/`
   (`CLAUDE.md`, `AGENTS.md`)**. ⚠️ **If your measurement disagrees with these numbers, STOP and
   report** — the premise has moved and the brief needs re-grounding, not a patched assertion.
2. **Prove the assertion is not vacuous — red it deliberately.** Temporarily add a third
   non-`ai-agents/` row to `claude/structure-spec.md`'s Table B (e.g. a `docs/CONTRIBUTING.md`
   placeholder row), run `node --test test/structure-spec.test.js`, and confirm it **fails**, and
   that the failure text **names `README.md`**. Paste the failure output into the close. Then revert
   the decoy row. ⚠️ A close that shows only green has proved nothing about the tripwire.
   **⚠️ Expect collateral reds from the decoy** — `structure-spec.test.js`'s checks A/B assert
   set-equality against `claude/scaffold/`, so an invented row will red other assertions in the same
   file too. That is expected; what must be shown is **your** assertion firing with **your** message.
3. **Prove the swap case too:** rename one of the two rows (e.g. `AGENTS.md` → `AGENT.md`) and
   confirm the count-of-2 assertion still fails because the *names* no longer match. Revert.
4. `npm test` green on the restored tree.
5. **Confirm `README.md` is byte-unchanged**: `git diff --stat` must **not** list `README.md`.
   The change surface should be **exactly one path** — `test/structure-spec.test.js` — unless step 1
   forced a re-grounding.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- ⚠️ **CONCURRENCY, measured 2026-08-14 at filing:** a reviewer session was working in `test/` and on
  `bin/release.mjs` at the moment this brief was written. **Re-check `test/structure-spec.test.js`'s
  line numbers and helper names against the file before editing** — every `:NNN` in this brief is a
  dated anchor, and the durable anchors are the quoted names (`parseInventoryTable`, `HEADING_A`,
  `HEADING_B`) and the quoted comment text, not the numbers.
- ⚠️ **`README.md:54-57`'s wording is frozen by two separate constraints** — `0292`'s accepted
  residual **AR-1**, and ADR-043 §C6, which the sentence is byte-identical to. If implementing this
  makes you want to reword the README, that is a **new decision for the owner**, not part of this
  task. Stop and report.
- **Provenance:** `0292` closed 2026-08-14. Its review ledger is the source of truth for AR-1 and
  AR-2 and should be read before starting:
  `ai-agents/tasks/done/0292-scope-readme-54s-fkit-managed-structure-sentence-to-what-the-check-actually-covers/review.md`.
- **⚠️ Filed by a spawned producer with no owner channel.** No ranking was assigned (ADR-035) — the
  Backlog board is unranked and the rank is the owner's.
