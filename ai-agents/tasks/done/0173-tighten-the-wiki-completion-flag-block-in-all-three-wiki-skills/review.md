# Review — 0173

Task: `ai-agents/tasks/done/0173-tighten-the-wiki-completion-flag-block-in-all-three-wiki-skills/brief.md`
File(s) under review: `claude/skills/fkit-wiki-ingest/SKILL.md`, `claude/skills/fkit-wiki-lint/SKILL.md`,
`claude/skills/fkit-wiki-sync/SKILL.md`
Scope reviewed: commit **`34b3071`** ("Wiki sync + lint"), those three files only (+18/−15).
⚠️ **Not a working-tree change** — the working tree is clean; the change was already committed.
Status: in-review

Round 1 — 2026-08-03. Reviewers: fkit-reviewer (Claude) + Codex (`codex-cli 0.145.0`,
`codex exec --sandbox read-only`, exit 0). **Codex coverage: FULL. Codex returned "No findings."**

---

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `claude/skills/fkit-wiki-ingest/SKILL.md:92` · `claude/skills/fkit-wiki-lint/SKILL.md:101` · `claude/skills/fkit-wiki-sync/SKILL.md:137` | **The `<brief path>` placeholder in the block's closing routing line is now unbound — the same dangling-reference class the change struck two paragraphs above, left standing in the same block.** The block still ends *"Routing the close is the **caller's** next move, not yours: `` `@fkit-producer Run /fkit-task-done on <brief path>` ``"*, but after this change the flag the caller carries is `Task <NNNN>'s vault work is complete — ready to close` — **no path**. Nothing in the block tells the caller how to get from `<NNNN>` to a brief path. Compounding: `/fkit-task-done`'s own input contract (`claude/skills/fkit-task-done/SKILL.md:75-77`) accepts *"the brief path … or a bare folder name / slug"* — **a bare four-digit ID is not in that list**, and step 1's stop conditions include *"the file does not exist"*. **This does NOT re-open the owner's folder-ID-only ruling:** every fix keeps the flag pathless (e.g. rewrite the routing line to name the ID and the lookup, and/or add `<NNNN>` to `/fkit-task-done`'s accepted inputs). |
| R2 | 1     | low    | `claude/skills/fkit-wiki-ingest/SKILL.md:88-89` · `claude/skills/fkit-wiki-lint/SKILL.md:97-98` · `claude/skills/fkit-wiki-sync/SKILL.md:133-134` | Partial rewrap left a stranded short line mid-paragraph — *"task's only identity. It is **never** the sprint"*. **Verified cosmetic only**: a single newline inside a Markdown paragraph is a soft break, and these files are fed to an LLM as raw text where it carries no meaning. Deliberate and documented (`worklog.md` §Decision log item 1) as a trade to keep the plan's byte-comparison of the rank sentence clean. Recorded so it is disposed of explicitly rather than dropped silently — **frontier-move, recommend no action**. |

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

Round 1 response — 2026-08-03, `fkit-coder` as the Process-review worker of `fkit-sprint-ship-loop`.
Every claim re-verified against the files first-hand, not taken from the reviewer's summary.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | **Defect** (medium) | **Fixed** — routing line rewritten in all three wiki skills, per the owner's live ruling (A) "rewrite the routing line only". Flag stays pathless; `/fkit-task-done` untouched. | resolved |
| R2 | **CORRECT** | **Frontier-move** (low) | **No action**, as the reviewer recommends. Cosmetic, deliberate, already documented in `worklog.md` §Decision log item 1. Disposed of explicitly, not dropped. | closed — no action |

### R1 — verification and fix

**Verified CORRECT, first-hand, on both halves of the claim.**

- The routing line was present, unbound, in all three files, at the end of the same step the change
  edited — *"Routing the close is the **caller's** next move, not yours: `` `@fkit-producer Run
  /fkit-task-done on <brief path>` ``"*. Located by content, not by the reviewer's coordinates.
- The mover's input contract confirms the gap. `claude/skills/fkit-task-done/SKILL.md`, step
  *"Resolve and validate the input"*, accepts *"the brief path `ai-agents/tasks/<board>/<NNNN>-<slug>/brief.md`,
  or a bare folder name / slug"*. A bare four-digit `<NNNN>` is **neither** — the folder name is
  `<NNNN>-<slug>`, and the slug is the tail, so the ID alone matches no accepted form. The same step
  stops when *"the file does not exist"*. The caller holding only the flag genuinely could not act.

**Fix — the routing line only, in the three wiki skills.** Same text in all three (indent preserved:
ingest 3 / lint 3 / sync 0):

```
resolve `<NNNN>` to its task folder — the single match for `ai-agents/tasks/*/<NNNN>-*/` — then
`@fkit-producer Run /fkit-task-done on <that folder>/brief.md`. The flag carries the ID only; that one
lookup is the caller's, and it is what stops the flag rotting when the folder moves boards.
```

**Why this is a working fix and not a well-worded one.** The lookup output is a **brief path**, which is
the mover's *first* accepted input — so the fix needs no change to `/fkit-task-done` and does not depend
on the declined option (B). The glob is `ai-agents/tasks/*/`, **not** `tasks/backlog/`, so it still
resolves after a folder moves to `done/` or `cancelled/` — it does not re-introduce the board-hardcoding
this task exists to strike. The flag itself is unchanged and still pathless: the **2026-08-01 folder-ID-only
ruling is not re-opened**, and the "producer does one lookup" cost recorded in *Accepted residuals* is now
stated in the spec instead of being left implicit.

**Scope respected.** `claude/skills/fkit-task-done/SKILL.md` **not touched** — owner declined (B), and
approved `plan.md` §6 excluded it. No test, no guard, no vault write, no commit, no task-folder move.

### R2 — verification and disposition

**Verified CORRECT and cosmetic.** The stranded short line *"task's only identity. It is **never** the
sprint"* is present mid-paragraph in all three files. Confirmed harmless: it is a single newline inside a
Markdown paragraph (a soft break), and these files are consumed as raw text by an LLM. It is the recorded
cost of keeping the rank sentence's bytes unchanged, which the plan's verification step 4 and the brief
both require. **Frontier-move, no action taken** — chasing it would churn the exact bytes the plan
protects.

### Also this round — mirror refresh (owner-ruled, outside the findings)

**The *Accepted residuals* entry "`.claude/` mirror drift" is now discharged** — recorded here rather
than edited there, because that section is shared and I do not own it. Its **⚠️ Consequence of record**
(*"a wiki run started from the current mirrors still emits the old dead-path form"*) **no longer holds.**

Owner ruled live (2026-08-03) to rerun `claude/fkit-claude-init.sh .` before the close. Run **after** the
R1 edits landed, so the mirrors picked up both the committed change and the R1 fix. Measured before and
after, canonical and mirror:

| File | `:NNN` prohibition | old dead-path template | old `<brief path>` routing | new routing |
|---|---|---|---|---|
| `claude/skills/fkit-wiki-{ingest,lint,sync}/SKILL.md` (×3) | 1 → 1 | 0 → 0 | 0 → 0 | 1 → 1 |
| `.claude/skills/fkit-wiki-{ingest,lint,sync}/SKILL.md` (×3) | **0 → 1** | **2 → 0** | **1 → 0** | **0 → 1** |

All three canonical/mirror pairs now `diff`-clean. `.claude/` is gitignored — not a source write, not a
commit; `git status` still shows only the three `claude/skills/` modifications.

**Note on the approved plan:** `plan.md` §6 says *"No `.claude/` mirror edit."* The later owner ruling
supersedes it for the refresh specifically. Flagged rather than resolved silently — the plan file was
**not** edited.

### Verification re-run after the R1 fix

Real evidence is grep + diff; `npm test` is reported for regression only.

1. **`tasks/backlog/` hits in the three canonical files** — exactly the legitimate survivors, **zero in
   either template line and zero in the new routing line**: the consideration-set line *"any brief under
   `ai-agents/tasks/backlog/*/brief.md` whose `## Owner` is `fkit-wiki`"* (all three) plus sync's
   `**Skip:**` line. The new routing line deliberately globs `ai-agents/tasks/*/`, not `backlog/`.
2. **Both template lines pathless in all three**, `partial or uncertain` checked explicitly.
3. **`:NNN` prohibition present exactly once per file**, all three, matched after collapsing newlines
   (`tr '\n' ' ' | tr -s ' '`) because the sentence is line-wrapped. Mirrors now match.
4. **Indent unchanged: ingest 3 / lint 3 / sync 0** on the `- complete →` line, and the new routing line
   carries the same per-file indent.
5. **Block body byte-identical across all three** with indentation stripped (ingest vs lint, ingest vs
   sync) — the R1 fix did not introduce a per-file divergence.
6. **Source change surface: exactly 3 files, all `claude/skills/fkit-wiki-*/SKILL.md`, +9/−3.** The only
   other working-tree entries are this task's own artifacts — `worklog.md` (modified) and `review.md`
   (untracked). Nothing else under `ai-agents/` touched; **no vault write**. **No commit made.** Task
   folder **not** moved.
7. **`npm test`: 560 pass / 0 fail / 17 suites**, matching the pre-change baseline exactly — which is the
   expected no-signal result, **not evidence the fix is right**. No test reads a skill body.

## Accepted residuals (shared, do-not-re-litigate)

- **Flag carries folder ID only, no path** — What: both template lines emit `<NNNN>` and nothing else.
  Why (structural): owner ruling 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop`
  driver session, relayed in `brief.md` because report §11 still reads *"⏳ Awaits the owner"*;
  candidate (i) chosen over keeping any path, **accepted cost: the producer does one lookup**. Re-raise
  only if: the flag is shown genuinely un-actionable, not merely less convenient. *(R1 does not re-raise
  this — it is about a different sentence, and its fix leaves the flag pathless.)*
- **Entire parenthetical dropped, including "producer runs /fkit-task-done"** — What: the mover name no
  longer appears in the flag itself. Why (structural): owner ruling `plan.md` §Owner rulings **Q2 → (A)**,
  following the ruled example literally. Re-raise only if: the routing cue is shown to be lost
  altogether — it is not, it survives in the same block (and R1 addresses its remaining gap).
- **`.claude/skills/fkit-wiki-{ingest,lint,sync}/SKILL.md` mirror drift** — What: the gitignored mirrors
  still carry the old dead-path template; **verified this round, 1 old-form hit in each of the three**.
  Why (structural): regenerated only by `claude/fkit-claude-init.sh`, which the approved plan §6 put out
  of scope. Re-raise only if: a consequence beyond staleness appears. **⚠️ Consequence of record: a wiki
  run started from the current mirrors still emits the old dead-path form — the defect is fixed in
  source but not yet in effect.**
- **Rank conflict (`0154` P129 / `0165` P130 above `0173` P152)** — What: board order contradicts the
  `Blocks:` links; no renumbering done. Why (structural): owner ruling `plan.md` §Owner rulings
  **Q3 → (B)** — rely on the links; ADR-035 exists to restrict re-ranks; exposure is temporary. Re-raise
  only if: someone actually starts `0154` or `0165`.
- **Four already-emitted flag lines left frozen** — What: `0148`'s closed ledger (dead) and three live
  lines in `ai-agents/wiki-vault/log.md` (`0206`, `0199` ×2). Why (structural): the vault is `fkit-wiki`'s
  exclusive write surface and `0148`'s ledger is frozen by the 2026-07-29 ruling; cleanup is a separate
  `fkit-wiki` task. Re-raise only if: a `fkit-wiki` task is opened for it.
- **`npm test` is a no-op signal here** — What: green tells you nothing about this change. Why
  (structural): no test reads a skill body — `test/skill-frontmatter.test.js` discards everything after
  the closing `---`; `test/dual-home-parity.test.js` compares `ai-agents/` against
  `claude/scaffold/ai-agents/`, not `claude/skills/` vs `.claude/skills/`. Verification here is grep +
  diff. Re-raise only if: a harness that reads skill bodies lands (`0154` / `0136` / `0152` / `0165`).

---

## Verified clean this round (no row — do not chase)

- **The plan's bold misquote did NOT leak into the shipped text.** `plan.md` §3 renders the struck clause
  as *"— **the same four digits that open the path you emit**, …"*; the pre-image at `34b3071^` carries it
  in **plain text**. The diff introduces and removes no bold on that clause — the implementation followed
  the source, not the plan's rendering.
- **The dangling-clause rationale holds in all three files.** The clause was present verbatim and
  plain-text in all three pre-images and became false the moment the path left the template. (Precisely:
  it was not dangling *before* this change — it dangles *because of* it, which is what `plan.md` Q1 said.)
- **Indentation asymmetry preserved.** Measured post-change on the `- complete →` line: ingest **3**,
  lint **3**, sync **0** — unchanged.
- **The `:NNN` prohibition is present in all three**, exactly once each (matched after collapsing
  newlines, since the sentence is line-wrapped): *"It is also **never** a line number — write no `:NNN`
  coordinate in a flag."*
- **Both template lines are pathless in all three files** — `partial or uncertain` checked explicitly.
- **No downstream consumer depends on the old string.** Independently confirmed by both reviewers across
  `test/`, `claude/agents/`, `claude/hooks/`, `claude/*.sh`, and the other skills. Codex's stated closing
  question was exactly this, and it answered no.
- **Each file read in full context, not just the diff hunk.** The block is byte-identical across the three
  apart from the pre-existing indent and the step heading (`7.` ingest / `8.` lint / `## Step 9` sync). No
  file-specific incoherence beyond R1, which affects all three equally.
