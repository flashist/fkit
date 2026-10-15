# Plan — 0501: say how the board reads `Depends on:` lines in `dependency-declaration-form.md`

Planning only. No files written. Plan review: OFF for this run.

## Summary
- A documentation change. It touches 4 files: the page in both homes, the regenerated manifest, and one CHANGELOG line. No change to `dashboard.sh`, to how the board reads the line, or to any test.
- **Every rule below was checked against the current code**: `dep_hard_ids` (`claude/skills/fkit-status/dashboard.sh`, near `wpos()`) and its comment block, plus `depends_raw`'s opt-in `tail` mode. The sources are 0492's plan §3, worklog decisions 5 and 6, and review R1.
- 0494 is **done**. Its wording in `/fkit-task-brief` §9 "Limits", which the page will match, is: *"An ID followed by `— soft, not hard` is skipped — **that marking is how to declare a soft dependency** so it is not warned about."*
- Checks: the heaviest row in CONTRIBUTING's table applies (`claude/scaffold/` + `structure-manifest.tsv`), so **one full `npm test` (~12 min)**. Faster suites run first, plus a scratch-board check of every example line.
- One open question, at the end: whether the "slug in a link" miss goes in the scaffold copy too.

## What I found (this decides the plan's shape)
1. **The two copies are "audience-adapted", not byte-identical** (`test/dual-home-parity-exceptions.mjs` entry for this path; `dual-home-parity.md` table). The parity test excuses them from byte equality. "Same rules in both" is on us, not on the test.
2. **The scaffold copy is hashed** in `claude/structure-manifest.tsv` (one line today). The generator walks git history plus the **working tree**, so regenerating now also keeps 0506's two new uncommitted lines. That is expected.
3. **These ID-reading rules feed only the `drift depends-on-later-sprint` record.** The Next step cell (`ready` / `after N`) is still filled from the raw `⟨derive: …⟩` text (`fkit-status/SKILL.md`, the sentinel table). The section must say so, or a reader will think `soft` changes `after N`.
4. The brief calls the canonical form "bold-italic", but it has no italic: `- **Depends on: task 0072** — soft, not hard.` is bold only (0492 calls it "BI"). The page text will say "the bold form". I am noting this, not asking about it.
5. **The rules block is not touched.** This page is not part of `CLAUDE.md`, `AGENTS.md` or `universal-rules.md`, so the 411 B of headroom left under RULES_MAX stays the same.
6. Existing installs never get an edited scaffold file overwritten (init never overwrites an existing path). Instead, `/fkit-heal` offers it as `untouched-stale`. This matches the brief's stated cost.

## Steps

### 1. Live copy: `ai-agents/knowledge-base/conventions/dependency-declaration-form.md`
Insert one new section **between `## The guard (task 0107)` and `## Rules`**. This changes no existing text at all, which is brief item 5. Putting it after `## Rules` would place the trailing `Related:` paragraph under the new heading. Draft text:

```
## How the board reads the IDs (task 0492)

The Next step (`ready` / `after N`) is still read from the declaration's text as a whole. One more
check reads the **task IDs** on the line: on a sprint board, `drift depends-on-later-sprint` flags an
open task that **hard**-depends on an open task the sprint cannot count on (on the Backlog board, or
in a later, not-started or unresolved sprint). It reads the line like this:

1. **Only exact 4-digit task IDs are read** — `0110`, not `110`, `T-023`, `ADR-0047`, or a date such
   as `2026-09-13`. Every such ID in the declaration counts, even one mentioned in passing. An ID with
   no task folder (a year, a typo) is skipped.
2. **To mark a dependency soft, write `— soft, not hard` after its ID** — the same marking
   `/fkit-task-brief` uses. A soft ID is skipped by the later-sprint check; anything not marked soft is
   read as **hard**. The mark covers the ID before it, up to the next different ID: in
   `0110 and 0112 — soft, not hard`, only `0112` is soft. The first `soft` or `hard` after the ID
   decides, and only as a **whole word** — `software`, `Microsoft` or `harden` decide nothing (task
   `0492` review R1). An ID named more than once is soft only if every mention is.
3. **The bold form works.** In `- **Depends on: task 0072** — soft, not hard.` (the third example
   above), the text **after** the closing `**` decides soft or hard. An ID that appears only there is
   not a dependency.
4. **Known misses — write around them:**
   - the word **before** the ID (`soft: 0110`) reads as **hard** — it over-flags, the safe direction;
   - ranges like `0485–0491` are **not** expanded — name each ID;
   - a negated `(not soft)` reads as **soft** — the quiet direction, so never write it; write `hard`;
   - a link to a task folder whose slug contains `soft` or `hard` as a word can decide it — put the
     mark after the link.
```

### 2. Scaffold copy: `claude/scaffold/ai-agents/knowledge-base/conventions/dependency-declaration-form.md`
- Same place: between `## The guard` and `## Rules`. `## Where this is enforced` stays untouched.
- Same four rule groups, in the same order and wording, with only these changes:
  - heading `## How the board reads the IDs`, with no task number;
  - example IDs `0042` / `0043` / `0044` (the page's own neutral set); the range example is `0042–0045`;
  - rule 3 cites `- **Depends on: task 0044** — soft, not hard.`;
  - the "(task `0492` review R1)" reference is dropped;
  - `T-023`, `ADR-0047` and `2026-09-13` stay; they are generic.
- Whether the slug bullet appears here depends on Q1.

### 3. CHANGELOG.md, one line under `## Unreleased`
The brief does not ask for this; CONTRIBUTING requires it. Its rule is: *"Landed a change people who use fkit would notice? Add a line"*, and every install's `/fkit-heal` will offer this page. Draft:
`- The dependency-form convention (dependency-declaration-form.md) now says how the board reads a Depends on: line — which task IDs count, how to mark one soft (— soft, not hard), and the known misses. Existing installs: /fkit-heal offers the updated page.`

### 4. Regenerate the manifest
Run `npm run generate:manifest`. Expect `git diff claude/structure-manifest.tsv` to show exactly **one** added line on top of 0506's two: the new scaffold hash for this path. No line removed.

### 5. Record anything wrong, fix nothing
While I check, I run the 3 live briefs whose `Depends on:` link slug contains `soft` or `hard` as a whole word (found during planning) through the reader. If any reads against its intent, I log it in the worklog as a finding. No fix in this task.

## Verify

**A. Behaviour proof (brief step 2), on a scratch board in the session scratchpad, not the repo.**
- Layout: the same as `test/dashboard-contract.test.js` `0492/P8`/`P9`. One blocker task folder sits on a `🔲` Sprint 2 board, with one dependent per example line on a `🔄` Sprint 1 board.
- Run `bash claude/skills/fkit-status/dashboard.sh <sprint-1.md>`, capture the `⟦FACTS⟧` `drift depends-on-later-sprint` lines, and quote them in the review.
- Expected results:
  - bold `— soft, not hard` → no record
  - bold `— hard, not soft` twin → record
  - plain line with no mark → record
  - `software` / `Microsoft` lines → record
  - `soft: <ID>` → record
  - `(not soft)` → no record (the quiet miss)
  - blocker inside a range `A–C` → no record
  - `X and <blocker> — soft, not hard` → record for X only
  - `110` / `T-023` / date / a no-folder ID → no record
  - ID only after the closing `**` → not a dependency
  - slug link containing `soft` → no record
- Each page example matches its result, or I stop and report.

**B. Wording check (brief step 3).** Quote the page's rule-2 sentence and 0494's `/fkit-task-brief` §9 "Limits" sentence side by side in the review.

**C. Checks**, mapped with CONTRIBUTING's "What to run" table:

| Changed path | Table row | Check |
|---|---|---|
| `ai-agents/knowledge-base/conventions/…` | anything else under `ai-agents/` | `npm run test:docs` |
| `claude/scaffold/…` | anything under `claude/scaffold/` | `npm test` |
| `claude/structure-manifest.tsv` | non-`.md` under `claude/` | `npm test` |
| `CHANGELOG.md` | docs-only | none; I check it by eye |

- Spans rows, so the heaviest row applies: **one full `npm test` (~12 min)**.
- Fast feedback first:
  - `node --test test/structure-manifest.test.js test/dual-home-parity.test.js` (brief step 4);
  - then `npm run test:docs`, which covers `reference-integrity` for the new section's task-id cite and `coordination-citation-policy`. The section uses no `file:line` cites.
- Skipped: nothing. `npm test` includes all of the above.

## Risks and edge cases
- **The manifest and 0506 share the working tree.** If 0506 and 0501 are later committed **separately**, the manifest must be regenerated per commit. Otherwise the 0506 commit carries 0501's hash for a blob not yet in history, and `structure-manifest` test A goes red at that commit. Simplest: commit them together, or regenerate at each commit. This is the owner's commit call; I commit nothing.
- **A full-suite flake under load** (board tests and time-sensitive suites): re-run the failing suite once, and report both runs honestly. A re-run green is not hidden.
- **Wording drift between homes**: there is no byte test. Check by `diff`ing the two new sections, which should differ only by the listed substitutions.
- **The wiki may summarize this convention**: not edited here (wiki writes are fkit-wiki's). The next `/fkit-wiki-sync` picks it up.

## Assumptions (not asked; say if wrong)
- "Every 4-digit ID in the declaration counts, even one mentioned in passing" is added to rule 1. It is 0492's accepted miss "prose IDs depends_raw over-includes are counted", and it is useful to a writer. It stays inside "take the rules from 0492 plan §3".
- No new permanent test. The rules are already pinned by `0492/P8` and `P9`, and the brief forbids changing test behaviour.
- `## Where this is enforced` (scaffold) and the `Related:` line (live) are left unchanged.

## Open question

**Q1. Should the scaffold copy also list the "slug in a link" miss?**
- **Context:** the brief marks this bullet "(live copy only, optional)". The behaviour is the same in every project: a link like `[0042](../0042-make-it-soft/brief.md)` holds the word `soft` after the ID, so the reader can treat that dependency as soft and drop its warning (the quiet direction). Consuming projects also write links into `Depends on:` lines. On the other side, the brief chose live-only.
- **Options:**
  - **(A) Both copies (Rec).** The scaffold copy gains one neutral bullet. Every project's page warns about it, and the two homes keep the same rules. Knock-on: none (checked). No placement or `Depends on:` change.
  - **(B) Live copy only, as the brief says.** Consuming projects are not told. The scaffold has one rule fewer than the live copy. Knock-on: none (checked).
  - **(C) Neither copy.** The miss stays documented only in the `dashboard.sh` comment. Knock-on: none (checked).
- **Recommendation:** A. It is the same rule in a project that writes the same links, and it is the quiet direction, so it is the one most worth a warning.
