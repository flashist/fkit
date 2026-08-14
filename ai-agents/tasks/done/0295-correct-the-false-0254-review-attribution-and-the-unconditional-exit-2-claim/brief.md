# Correct the false `0254`-review attribution and the unconditional `exits 2` claim in the install page's `0289` block

## ID
0295

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-wiki

## Context

### Authority

**Owner rulings 2026-08-13**, given live via `AskUserQuestion` in a `fkit lead` session — **the
option labels are the verbatim text**:

- Finding F1 → **"One new task covering both halves"**
- Finding F2 → **"Correct alongside F1, same pass"**

Both findings therefore land in **this one brief**, and F2 is corrected in the **same pass** as F1.

### ⚠️⚠️ Provenance — the review that found these left NOTHING on disk. This brief is the only carrier.

Both findings come from an **independent review of task `0289`'s vault output**, run **after `0289`
had already closed**. `0289` shipped unreviewed; the owner asked for the pass retroactively.

⚠️ **That review was ephemeral by instruction and wrote no artifact.** `0289` is closed, and writing
a review ledger into a closed task folder is barred. ⛔ **There is no `review.md` for it. Do not go
hunting for one** — a run spent looking is a run wasted. **This brief is the sole durable record of
both findings.**

### ✅ What the review found SOUND — do not "correct" any of this

The review's overall verdict on `0289`: **substantially sound.**

- It did **not** commit its named fail condition.
- Its byte-identity claims were **proven**.
- ✅ **Its core mechanism sentence is CORRECT** — the summary block is guarded **only** by `dryRun`;
  `grep -n 'doTag\|doPush' bin/release.mjs` returns **seven** sites; the page's enumeration of them is
  exact. ⛔ **The correction below must NOT imply that sentence was wrong.** It was right, and it
  stays.

The two items below are the two things `0289` got wrong. Nothing else in its block is in scope.

---

## What to build

Two corrections, **both inside the same block** of
`ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` (the `0289` block, `:109-119`), plus
**one new appended entry** in `ai-agents/wiki-vault/log.md`.

---

### F1 (medium) — a FALSE ATTRIBUTION, in two places, one of them append-only

**The false claim, verified verbatim on disk 2026-08-13, at two sites:**

1. `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md:113`
   > `0288`'s brief and `0254`'s review body both say the two flags are *"read … and never consulted
   > again"*

2. `ai-agents/wiki-vault/log.md:2210-2211` (inside the `## 2026-08-13 — ingest (task 0289 …)` entry
   that begins at `:2111`, under the sub-heading `### ⚠️ Addendum, same run …` at `:2207`)
   > **`0288`'s brief and `0254`'s review body both state that `doTag` and `doPush` are "read at
   > `:82-83` and never consulted again."**

**⛔ `0254`'s review does not contain that clause.** Measured this filing:

```
grep -c 'consult' ai-agents/tasks/done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md
```
→ **`0`**. The word *"consult"* does not appear in that file at all.

✅ **What `0254`'s review actually says is narrow and CORRECT**, at both of its relevant passages:

- `:51-52` — *"Traced: `doTag`/`doPush` are set at `:82-83`; the summary block at `:272-277` is
  guarded **only** by `dryRun`, so the verify line prints regardless of whether a tag was created or
  pushed."*
- `:250-252` — *"Reproduced. The mechanism is as traced: `doTag`/`doPush` are read at `:82-83`, but
  the summary block at `:272-277` is guarded **only** by `dryRun` …"*

Neither says the flags are never consulted again. Both say the **summary block** does not consult
them — which is true.

#### ⚠️ The sharpest part — carry it, it is why this is medium and not low

The false gloss exists **only** in `0288`'s brief. And **`0288`'s brief now says so itself**, in a
dated correction at `ai-agents/tasks/backlog/0288-fix-the-post-release-verify-lines-failing-and-false-green-cases/brief.md:350-375`,
which quotes the superseded R1 sentence and explicitly warns readers **not** to go blame `0254`'s
ledger.

**`0289` blamed it anyway — in the very sentence whose job was to correct a false gloss.**

#### ⚠️⚠️ TWO DIFFERENT MECHANISMS FOR ONE FALSE CLAIM — read this before touching anything

| Site | Mechanism | ⛔ Never |
| --- | --- | --- |
| `wiki/systems/install-and-self-update.md:113` | **Ordinary in-place correction**, following that page's own established dated-block convention (the page already carries `0285`, `0258` and `0289` dated blocks — match that form) | — |
| `log.md:2210-2211` | **A NEW dated entry appended at the end of the file** | ⛔ **NEVER edit `:2210-2211`, and never edit anything else already in `log.md`** |

⚠️ **`log.md` is append-only, by its own header at `log.md:3-5`:**

> *"Append-only activity log — newest entries at the bottom. Never edit or rewrite existing entries;
> only append."*

⛔ **Editing `:2210` to fix the attribution would breach the log's own contract.** The log half of
this correction is a **new entry** that names the earlier entry and corrects it. The old text stays
standing and wrong-but-dated, exactly as the append-only rule intends.

#### ⛔ Do not over-correct

- **The false gloss IS in `0288`'s brief.** The correction is about **who it is attributed to**, not
  about whether a false gloss ever existed. ⛔ Do not write that the gloss was imaginary.
- ⛔ **Do not imply `0289`'s mechanism sentence was wrong.** It was measured **correct** (see the
  sound-findings list above). Only the attribution half of that sentence is false.
- ⛔ **Do not edit `0288`'s brief, `0254`'s review ledger, or `0289`'s brief.** All three are outside
  the vault, and `0288` is being amended by another producer.

---

### F2 (low) — an unconditional claim with a counterexample, plus a count nit

**Same block, `install-and-self-update.md:113`, same bullet as F1:**

> Under `--no-tag` or `--no-push` the script prints `✓ Released <tag>` and then a check that
> **exits 2**.

**Add `--no-bump` over a tag already on origin and the same check exits `0`.** Measured on disk:

- `bin/release.mjs:227` — the already-exists branch only prints a *"will skip tag creation"* step
- `bin/release.mjs:258` — tag creation is guarded `if (doTag && !localTagExists && !remoteTagExists)`,
  so it is skipped
- `bin/release.mjs:250` — `if (doPush)` pushes the **branch** regardless
- `bin/release.mjs:276` — the verify line prints, and passes against the **stale** tag

**Why low, not medium:** ⚠️ **the very next bullet on the page (`:114`) supplies exactly that
exception** — the `--no-bump` false-green bullet. A reader of both bullets is **not** misled. The
defect is that the first bullet reads as unconditional on its own.

**The fix:** make the sentence conditional rather than absolute — it is the `--no-tag` / `--no-push`
paths that exit 2, **not every non-default path**; the `--no-bump`-over-an-existing-tag path exits 0
and is covered in the next bullet.

#### The count nit, same block

`install-and-self-update.md:111` says **"Three findings"** and is followed by **four** bullets
(`:113`, `:114`, `:115`, `:116`). ⚠️ The fourth is deliberately an **explicit non-finding** — the
`${tag}` exclusion, owner-ruled *"Unactioned — pre-existing"*. Fix the count or the wording so the
number matches what is actually listed; ⛔ **do not delete the fourth bullet** — it exists to stop a
reader treating `${tag}` as open.

**Both fixes land in the same pass** — a librarian correcting F1 is already inside that block, on that
same line.

---

### ⛔⛔ THE BATCHING REQUIREMENT — RUN THIS IN ONE LIBRARIAN SESSION WITH `0291` AND `0293`

Two other vault rows are **filed and unrun**:

- [`0291`](../0291-correct-two-stale-vault-claims-surfaced-by-0258s-review/brief.md) — two stale vault
  claims
- [`0293`](../0293-wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface/brief.md) —
  ADR-043 ingest

> ⚠️⚠️ **SUPERSEDED IN PART, 2026-08-14 — `0293` HAS CLOSED.** The heading above and the *"filed and
> unrun"* line were **TRUE WHEN WRITTEN on 2026-08-13**. `0293` closed on **2026-08-14** — its
> `## Status` reads `✅ Done (agent-closed — not owner-verified)` and its folder is now
> `ai-agents/tasks/done/0293-wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface/`.
> **The batch is `0291` + `0295` only.** ⛔ **The batching requirement itself is NOT weakened — the
> reason for it is STRONGER now.** Full detail, and a fourth scope item folded into this row, in
> **§ Amendment, 2026-08-14** at the end of this file. ⛔ Nothing above or below this block was
> altered.

⚠️ **`wiki/systems/install-and-self-update.md` has been written THREE TIMES in one day** — by `0285`,
`0258` and `0289`. That churn is itself under investigation as
[`0290`](../../backlog/0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md),
and `0293`'s brief records the owner's stated reason for batching: **to avoid a fourth vault write in
a single day.**

⛔ **Running this row as a standalone one-off librarian session discards that reason.** **All three
rows run in ONE `fkit wiki` session**, three scopes, three closes, one write.

### ⚠️⚠️ THIS ROW SUPERSEDES `0291`'S FENCE ON THIS PAGE

`0291`'s brief carries, at `:255`:

> ⛔ **Do not touch `wiki/systems/install-and-self-update.md`** — `0289` owns it and may be mid-run.

⚠️ **That fence was written while `0289` was executing. `0289` has since CLOSED, and THIS ROW now
legitimately owns that page.** A librarian running `0291` and `0295` in the same session **must not
honour `0291`'s fence against this row's work** — it is superseded, on this page, by this task.

⛔ **Do NOT edit `0291`'s brief to change its fence.** The relationship is recorded **here**, and here
only. `0291`'s own two sites are elsewhere and are unaffected either way.

### ⛔ `0289` IS CLOSED — THIS ROW CORRECTS THE VAULT, NOT THE TASK RECORD

`0289` lives at
`ai-agents/tasks/done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/`.

⛔ **Do not reopen it. Do not re-status it. Do not write into its folder.** No file under
`ai-agents/tasks/done/` is touched by this row. The defect is in the **vault text `0289` produced**,
and that is what gets corrected.

### ⛔ THIS ROW RUNS IN A `fkit wiki` SESSION — NOT IN `/fkit-sprint-ship-loop`

`## Owner` is **`fkit-wiki`**, because `ai-agents/wiki-vault/` writes are that role's exclusively
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⛔ **`/fkit-sprint-ship-loop` cannot run this row** — its Build step spawns `@fkit-coder`, which may
not write the vault. Route it to a `fkit wiki` session.

### Constraints

- ⛔ **Vault files only.** `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` and
  `ai-agents/wiki-vault/log.md`, plus this brief's `## Status`. Nothing else.
- ⛔ **No source file, no `bin/release.mjs`, no `claude/`, no `README.md`, no
  `ai-agents/knowledge-base/`.** This is a text correction; the code is not in scope.
- ⛔ **No commit, no push.**
- ⛔ **No task-file move.** Closing this row goes through `/fkit-task-done`, producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  with the `(agent-closed — not owner-verified)` marker if the owner is not present.

---

## Verification steps

1. **The page no longer attributes the gloss to `0254`'s review.**
   ```
   grep -n "0254's review body" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md
   ```
   ⚠️ Expect **no hit that asserts the clause is in that review**. A hit is acceptable **only** if the
   surrounding sentence says the clause is **not** there.

2. **The correction stays true — `0254`'s review still contains no such clause.**
   ```
   grep -c 'consult' ai-agents/tasks/done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md
   ```
   ⚠️ Expect **`0`**. ⛔ If this is not `0`, **stop** — the premise of the correction has changed and
   the correction must be re-derived, not shipped.

3. **The page still names `0288`'s brief as the real home of the gloss.**
   ```
   grep -n "0288" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md | grep -i "gloss\|never consulted"
   ```
   ⚠️ Expect a hit. ⛔ An empty result means the correction over-corrected — the gloss **is** real and
   **is** in `0288`'s brief.

4. **The page's mechanism sentence is INTACT** — `0289` got this right.
   ```
   grep -c "guarded ONLY by \`dryRun\`" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md
   ```
   ⚠️ Expect **≥ 1**.

5. **A NEW `log.md` entry exists, dated today, naming this task.**
   ```
   tail -40 ai-agents/wiki-vault/log.md | grep -n "0295\|0254"
   ```

6. **`log.md:2210` is BYTE-IDENTICAL to what it is today — nothing was edited, only appended.**
   ```
   git diff -- ai-agents/wiki-vault/log.md | grep -c '^-[^-]'
   ```
   ⚠️ Expect **`0`** — zero removed lines. ⚠️ **Baseline measured at filing: this command already
   returns `0` today**, with `0289`'s own uncommitted append in the working tree — so `0` remains the
   correct expectation and the check is not confounded by pre-existing dirt. ⛔ Any non-zero result is
   an append-only breach
   (`log.md:3-5`) and must be reverted before close. Confirm the old text still stands:
   ```
   sed -n '2210,2211p' ai-agents/wiki-vault/log.md
   ```
   ⚠️ Expect the original *"both state that `doTag` and `doPush` are 'read at `:82-83` and never
   consulted again.'"* sentence, unchanged.

7. **The F2 sentence is no longer unconditional.**
   ```
   grep -n "exits 2" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md
   ```
   ⚠️ Expect the `exits 2` claim to be **scoped to `--no-tag` / `--no-push`**, not stated of every
   non-default path. ⛔ A bare *"Under `--no-tag` or `--no-push` … exits 2"* with no qualifier is the
   defect unfixed.

8. **The `--no-bump` false-green bullet is still present** — it is the exception the corrected
   sentence points at.
   ```
   grep -c "no-bump" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md
   ```
   ⚠️ Expect **≥ 1**.

9. **The finding count matches the bullets.**
   ```
   sed -n '109,120p' ai-agents/wiki-vault/wiki/systems/install-and-self-update.md
   ```
   ⚠️ Read it: the stated number must match the bullets that follow, and the `${tag}` non-finding
   bullet must still be there.

10. **`0289`'s closed folder was not touched.**
    ```
    git status --porcelain ai-agents/tasks/done/
    ```
    ⚠️ Expect **empty**.

11. **Nothing outside the vault changed.**
    ```
    git status --porcelain
    ```
    ⚠️ Expect **only** files under `ai-agents/wiki-vault/`, this brief, and — **if `0291` / `0293` ran
    in the same session** — their briefs and their own sites. ⛔ Nothing under `bin/`, `claude/`,
    `ai-agents/knowledge-base/`, and ⛔ **not `0288`'s brief**.

12. **Nothing committed, nothing staged.**
    ```
    git log --oneline -1 && git diff --cached --stat    # expect the staged diff EMPTY
    ```

---

## Notes

- **Why Backlog / Unscheduled.** Measured 2026-08-13: `ai-agents/sprints/sprint-5.md` has **zero open
  rows**, so there is no open sprint to file into and Backlog is where an unsprinted brief lands by
  construction. ⚠️ **Measured caveat: the plan's header at `sprint-5.md:3` still reads `🟢 ACTIVE`** —
  the board is finished by row status but not yet marked closed; archiving it is task
  [`0294`](../../backlog/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/brief.md).
  ⛔ **Not this row's job to fix.** On merit it also belongs on the Backlog: this is
  **synthesized-knowledge maintenance** — no shipped behavior is broken, no other row is blocked on
  it, and F2 is explicitly **low** because the adjacent bullet already supplies its exception.
  ⛔ **Filed by a spawned producer with no owner channel, so it is UNRANKED and re-ranks nothing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The owner may rank it whenever they next touch the board.
- **Provenance chain.** `0254` (the fix) → `0288` (the narrower open defects, whose brief carries the
  false gloss **and its own dated correction**) → `0289` (the vault re-sync that misattributed it) →
  the retroactive, **artifact-less** review of `0289` → this row.
- **Relationship to `0291`.** Batched into one session; **this row supersedes `0291`'s fence on
  `install-and-self-update.md`**. See the superseding section above. ⛔ `0291`'s brief is not edited.
- **Relationship to `0293`.** Batched into one session. **No file overlap** — `0293` writes new
  ADR-043 pages and `index.md`; this row edits the install page and appends to `log.md`. ⚠️ `0293`'s
  verification step 7 expects `install-and-self-update.md` to be **untouched by `0293`** — that check
  is about `0293`'s own scope and is **not** violated by this row's edit. **A librarian running both
  must attribute that page's diff to this row, not treat it as a `0293` scope breach.**
- **Relationship to `0290`.** This row is **more evidence** for `0290`'s churn investigation — a
  fourth candidate write to the same page in two days — and **answers none of its question**.
- **Relationship to `0288`.** ⛔ **Untouched.** `0288`'s brief is correct as it stands: it carries the
  gloss **and** the dated correction disowning `0254`. Another producer is amending it concurrently.

---

## ⚠️ Amendment, 2026-08-14 — a third scope item folded in (5 back-links), and the `0293` batching lines superseded by its close

**Authority for the fold: owner ruling 2026-08-13**, given live via `AskUserQuestion` in a `fkit lead`
session — **verbatim option label: "Fold into 0295"**.

Appended **2026-08-14** by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
⛔ **No existing byte in this file was altered.** This amendment is **two pure additions**: the
blockquote annotation under §*THE BATCHING REQUIREMENT* above, and this block. Nothing was rewritten,
reworded, deleted, or renumbered. ⛔ **Status, Priority, Sprint, Owner and board position are
unchanged** — still `🔲 Backlog`, `Unscheduled`, unranked, `fkit-wiki` ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

⚠️ **On the superseded lines below: they were TRUE WHEN WRITTEN.** They were written 2026-08-13 and
falsified by a close that happened **hours later**, on 2026-08-14. **Superseded, not
wrong-at-the-time.** ⛔ Do not read them as an error by the producer who filed this row.

---

### A — NEW SCOPE (third item): reciprocate **5 one-way links** — ⚠️ IN THE SAME EDIT as F1 and F2

A `/fkit-wiki-sync` + `/fkit-wiki-lint` run on **2026-08-13** created **five wiki-links pointing at
`wiki/systems/install-and-self-update.md`**. ✅ **All five resolve** — the target page exists. ⛔ **The
target carries no reciprocal back-link to any of them**, which breaks the vault's bidirectional-link
convention.

#### ⛔ Why they were deliberately LEFT BROKEN — carry this, it is the whole reason they are here

The librarian **found them, reciprocated them, and then reverted the fix.** Adding the back-links
would have made the **lint itself a FOURTH write to that page in a single day** — precisely the churn
the owner's 2026-08-13 batching ruling exists to limit, and precisely what task
[`0290`](../../backlog/0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md)
is investigating. The run recorded the reversion as a **breach, not a near-miss**, in
`ai-agents/wiki-vault/log.md` (the `### ⛔ A FOURTH write to \`systems/install-and-self-update\` was
MADE AND THEN REVERTED` section).

**`0295` must edit that page anyway.** So the back-links come here. **One write instead of two.**

#### The five source pages — enumerated from disk 2026-08-14, so nobody re-derives them

| # | Source page (all paths under `ai-agents/wiki-vault/wiki/`) | The link | Origin |
|---|---|---|---|
| 1 | `decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md:160` | `[[systems/install-and-self-update]]` — *"the launcher, init refresh, and self-update this ADR reasons over"* | ADR-043 |
| 2 | `tasks/decide-whether-claude-enters-the-structure-conformance-surface.md:83` | `[[systems/launch-convergence-and-init]] · [[systems/install-and-self-update]]` | task `0255` |
| 3 | `tasks/fix-the-unrunnable-verify-command-release-mjs-prints.md:85` | `[[systems/install-and-self-update]]` — *"the release flow, and where `0288`'s open defects are recorded in detail"* | task `0254` |
| 4 | `tasks/state-the-per-project-relaunch-step-fkit-update-requires.md:70` | `[[systems/install-and-self-update]]` — *"the self-update and launcher behaviour this documents"* | task `0253` |
| 5 | `tasks/the-2026-08-13-vault-resync-chain.md:84` | `[[systems/install-and-self-update]]` — *"the page written three times"* | the six-row chain page |

⚠️ **All five are still UNTRACKED files** (`git status` → `??`) as of this amendment — they are part of
the 2026-08-13 sync's uncommitted output. ⛔ **That is not this row's problem and this row does not
commit them.**

**The five back-link targets the librarian must add** to
`wiki/systems/install-and-self-update.md`'s `## Related` section:

```
[[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]]
[[tasks/decide-whether-claude-enters-the-structure-conformance-surface]]
[[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]]
[[tasks/state-the-per-project-relaunch-step-fkit-update-requires]]
[[tasks/the-2026-08-13-vault-resync-chain]]
```

**Measured 2026-08-14:** `install-and-self-update.md` is **195 lines**; its `## Related` section runs
`:152-182` and contains **none** of those five slugs. ⚠️ The page does mention `0254` in prose at
`:103`, but that is **not** a wiki-link to `tasks/fix-the-unrunnable-verify-command-release-mjs-prints`
and does **not** satisfy the back-link.

#### ⛔⛔ SEQUENCING — THIS IS THE POINT OF THE FOLD

⛔ **The five back-links MUST be added in the SAME EDIT as F1 and F2.** A separate pass for them —
before, after, or in another session — **is exactly the extra write this fold exists to prevent**, and
would reproduce the breach the sync already reverted. **One editing pass on that page. Three scope
items in it: F1, F2, and these five bullets.**

#### Verification for this item

```
grep -c "adr-043-claude-is-not-a-structure-conformance-surface\|decide-whether-claude-enters-the-structure-conformance-surface\|fix-the-unrunnable-verify-command-release-mjs-prints\|state-the-per-project-relaunch-step-fkit-update-requires\|the-2026-08-13-vault-resync-chain" ai-agents/wiki-vault/wiki/systems/install-and-self-update.md
```

⚠️ Expect **≥ 5**. ⛔ And confirm the page was written **once**: `git diff --stat` on it must show a
single working-tree change covering F1, F2 and the back-links together — not a sequence of passes.

---

### B — SUPERSEDED: `0293` is **closed**, so the batch is `0291` + `0295`

**Task `0293` closed on 2026-08-14.** Measured this amendment:

- Its folder is `ai-agents/tasks/done/0293-wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface/`
- Its `## Status` reads **`✅ Done (agent-closed — not owner-verified)`**
- It is **not** in `ai-agents/tasks/backlog/`
- Its ADR-043 ingest was **completed incidentally by the same 2026-08-13 sync run** — the vault page
  `wiki/decisions/adr-043-…md` exists on disk

**Two statements in this brief are falsified by that close.** Both are quoted verbatim so `grep` finds
this note from either direction:

1. The section heading, above:

   > `### ⛔⛔ THE BATCHING REQUIREMENT — RUN THIS IN ONE LIBRARIAN SESSION WITH `0291` AND `0293``

   ⚠️ **Read it as: RUN THIS IN ONE LIBRARIAN SESSION WITH `0291`.** `0293` is done and needs no
   session.

2. The line beneath it:

   > `Two other vault rows are **filed and unrun**:`

   ⚠️ **Read it as: ONE other vault row is filed and unrun — `0291`.** `0293` is neither unrun nor
   open. Its bullet and its link in that list stay standing as a dated record; the link already
   points into `done/`.

#### ⛔⛔ THE BATCHING REQUIREMENT IS **NOT** WEAKENED — IT IS STRONGER

⛔ **Do not read `0293`'s close as permission to run this row as a standalone one-off.** The reason for
batching was never the number of rows — it was **write frequency on one page**. That reason has
**grown**:

- `wiki/systems/install-and-self-update.md` has been written **three times** — `0285`, `0258`, `0289`
- a **fourth write was made and reverted** during the 2026-08-13 sync/lint (see § A above)
- `0290` is **actively investigating that churn pattern**
- and this row now carries **three** scope items for that page instead of two

**`0291` and `0295` still run in ONE `fkit wiki` session.** Two scopes, two closes, one write to that
page.

⚠️ The superseding relationship recorded in §*THIS ROW SUPERSEDES `0291`'S FENCE ON THIS PAGE* above is
**unchanged and still binding**. ⛔ `0291`'s brief is still not edited.

⛔ **`0293`'s brief and folder are NOT touched by this row.** It is closed; §*`0289` IS CLOSED* above
applies to it identically.

---

### C — Two stale prose sites OUTSIDE this row's scope — recorded so a reader is not confused, ⛔ NOT filed and ⛔ NOT to be fixed here

`0293`'s close reported these. ⛔ **This row does not edit either brief, and no task was filed for
them.** They are named only so a librarian batching sessions does not mistake them for this row's work:

- `0292`'s brief — present tense *"`0293` ingests ADR-043"*
- `0294`'s brief — *"the two-file gap is `0292` and `0293`… not yet committed"*

---

### D — Measured this amendment (2026-08-14)

| Check | Result |
|---|---|
| `0293` under `ai-agents/tasks/done/` with `✅ Done (agent-closed — not owner-verified)` | ✅ **Confirmed** |
| Five one-way links at `install-and-self-update`, enumerated from disk | ✅ **5 found**, table in § A |
| Target page carries a back-link to any of the five | ⛔ **0 of 5** — `## Related` is `:152-182`, 195-line page |
| `grep -c 'consult'` on `0254`'s review — F1's premise | ✅ still **`0`**, correction premise intact |
| `grep -c 'consult'` on `0288`'s brief — where the gloss really lives | ✅ still **`6`** |
| `0291` still open in `backlog/` | ✅ **Confirmed** |
| Prior bytes of this file altered | ✅ **None** — `git diff` on this brief shows **insertions only**, zero removed lines |
| **Citation-shift check** (one block was inserted mid-file) | ✅ **Ran it. All 26 `:NNN` citations in this brief point at OTHER files** — `install-and-self-update.md`, `log.md`, `0254`'s review, `0288`'s brief, `0291`'s brief, `bin/release.mjs`, `sprint-5.md`. **This brief contains ZERO self-citations**, so the mid-file insertion shifted nothing. Cross-checked the other direction too: **no file anywhere in `ai-agents/` cites this brief by line number.** |

⚠️ **One stale citation found by that check, recorded not fixed.** This brief's `:97` cites
`…/0288-…/brief.md:350-375` for `0288`'s dated correction. **`0288`'s brief is now 808 lines and that
correction block begins at `:358`** — another producer amended `0288` concurrently, as this brief's own
`## Notes` already anticipates. The citation still lands **inside** the correction block but its start
is now ~8 lines early. ⛔ **Not corrected here** — correcting it would alter a prior byte of this file,
which this amendment is forbidden to do, and `0288` itself is ⛔ untouched either way. Recorded so the
next reader measures rather than trusts it.

### E — What this amendment did NOT do

⛔ Wrote **nothing** under `ai-agents/wiki-vault/` — the five links were **read** and recorded, **not
fixed**; fixing them is the librarian's act, inside `0295`'s single edit
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
⛔ Edited **no other brief** — not `0290`, `0291`, `0292`, `0293`, `0294`, not `0288`.
⛔ Touched **no** `backlog.md` and **no** `sprint-5.md`. ⛔ Filed nothing, closed nothing, moved
nothing, **invoked no mover**, re-ranked nothing. ⛔ **Committed and staged nothing** — ⚠️ the working
tree carries **31 uncommitted vault files** from the 2026-08-13 sync/lint plus `0293`'s close; **none
of them are this amendment's** and this amendment does not commit them.
