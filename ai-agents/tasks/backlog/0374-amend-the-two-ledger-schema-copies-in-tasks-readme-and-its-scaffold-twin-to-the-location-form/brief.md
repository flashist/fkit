# Amend the ledger-schema copies in `ai-agents/tasks/README.md` and its byte-identical scaffold twin to the `Location` form — the README now contradicts the text agents execute from

## ID
0374

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

**Owner ruling J1**, given at [`0369`](../../done/0369-amend-the-review-ledger-location-column-to-heading-plus-fragment-for-coordination-documents/brief.md)'s
plan gate on **2026-09-04**, live via `AskUserQuestion` and relayed to a spawned worker —
**the option label is the verbatim text: "Out of this run; file a follow-up (Rec)"**.

`0369`'s [`review.md`](../../done/0369-amend-the-review-ledger-location-column-to-heading-plus-fragment-for-coordination-documents/review.md)
records it as the accepted residual **"Two files, not four"**, whose stated cost, verbatim:

> *"both are manifest-hashed; amending them forces `npm run generate:manifest`, putting a regenerated
> shipped artifact in the diff — beyond 'amend a column'."*

⛔ **That residual's `Re-raise only if` is *"the follow-up is not filed, or the manifest moves."*
This brief IS that filing.**

### ⛔ The defect: a live contradiction, not a cosmetic desync

`0369` amended the findings-table location column in **both** stateful-review schemas — the reviewer's
write side (`claude/skills/fkit-stateful-review/SKILL.md`) and the coder's read side
(`claude/skills/fkit-process-stateful-review/SKILL.md`). `ai-agents/tasks/README.md` and its scaffold
twin hold a **third and fourth copy of the same schema**, and both still print `file:line`.

⛔⛔ **So the README now says one thing and the text agents actually execute from says another.**
`0369`'s own residual named the shape of the gap; this row closes it.

### The surface, measured firsthand 2026-09-04

⛔ **It is not one line per file. Counting occurrences of the string `file:line` (`grep -o … | wc -l`),
not lines:**

| File | Occurrences | Where |
|---|---|---|
| `ai-agents/tasks/README.md` | **2** | the prose sentence *"…`file:line`, claim. The coder reads these and never edits them."*, and the table header `\| #  \| Round \| Sev  \| file:line \| Claim \|` |
| `claude/scaffold/ai-agents/tasks/README.md` | **2** | the same two sites, byte-identical |

**Four occurrences across two files.** ⚠️ **A run that amends only the table header has done half the
task** — the prose sentence carries the same claim in words.

⭐ **The two files are byte-identical** — verified 2026-09-04, md5 `a2fce80839ba11d41569ea984da1ca16`
on both. They are a dual home under
[ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md),
so ⛔ **they move together or the parity test reds.**

### ⛔ Why this widens verification — the reason it was deferred, stated plainly

`ai-agents/tasks/README.md` is **manifest-hashed**: `claude/structure-manifest.tsv` carries an entry
for it (verified 2026-09-04). Amending it therefore forces `npm run generate:manifest`, which puts a
**regenerated shipped artifact** in the diff. ⛔ **Verification widens beyond `npm test`'s ordinary
green to `structure-manifest` + `dual-home-parity`.** That widening is the whole reason J1 held it out
of `0369`'s run — ⚠️ **it is expected here, not a surprise to be avoided.**

### ⭐ The canonical wording is `0369`'s, not this task's to invent

**Owner ruling J5 made `0369` the wording lead.** The text it shipped into both skills, verbatim, is
the source of truth for this amendment:

> **The `Location` cell — the form depends on the target, not on the ledger.**
> `path:line` is **correct** for source, tests, and files under `claude/` — the reader diffs the thing you cited.
> ⛔ For a **coordination document** — `ai-agents/sprints/*.md`, a task folder's `brief.md` / `plan.md` / `worklog.md` / `review.md`, or `ai-agents/wiki-vault/log.md` — write **the heading plus a quoted fragment**, never `path:NNN`. Third parties append above your line and it moves under you; and `test/coordination-citation-policy.test.js` **reds on it** in any open task folder. ⚠️ **Backticks do not exempt it** — that guard does not mask code spans.
> **In the row:** put the heading in the `Location` cell (e.g. `brief.md § Context`) and the quoted fragment in `Claim`.
> **Rider, both cases:** never cite a line number naked — pair it with a quoted fragment or the heading it sits under.

⛔ **Do not re-word it.** ⚠️ **Whether the README carries the whole rule block or only the renamed
column is a scope call this brief leaves open — see Notes.**

## What to build

1. **Re-measure first.** Reproduce the occurrence count in both files and **state your own numbers**.
   ⛔ **Do not carry this brief's `2 + 2` forward unverified** ([`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
   Confirm the two files are still byte-identical before touching either.
2. **Amend every occurrence in both files, in the same change.** The table header cell `file:line` →
   `Location`, and the prose sentence's `file:line` → the `Location` form.
   ⛔ **Both homes or neither** — the ADR-027 parity test reds on a one-sided edit.
3. **Match `0369`'s wording** (J5). ⛔ Do not invent a third phrasing; a fifth copy that says something
   slightly different is the same defect again.
4. **Keep the source-file case legal.** ⛔ The amendment is scoped to **coordination documents**;
   `path:NNN` into a **source file** stays correct (`0176`'s ruling **G3**, row 1 of
   [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
   ⚠️ **An amendment that bans the form outright is wrong.**
5. **Regenerate the manifest** — `npm run generate:manifest` — and ⛔ **show the regenerated
   `claude/structure-manifest.tsv` in the diff deliberately**, saying in the worklog that the artifact
   moved and why. ⚠️ **A silently-regenerated shipped artifact is exactly what J1 refused to let
   happen unannounced.**

⛔ **Out of scope:** the two stateful-review `SKILL.md` files (`0369` shipped them — do not re-edit);
`durable-citation-anchors.md` (owner ruling **J2**, verbatim *"Leave it (Rec)"*); changing what the
guard `0176` shipped scans; any existing `review.md` ledger; `.claude/` mirror edits;
`ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. **Both** README copies carry the amended wording, and they are **still byte-identical** — state the
   md5 of each, before and after.
2. **Every** occurrence counted in step 1 is amended. ⛔ A remaining `file:line` in the ledger-schema
   section fails this task; say the after-count.
3. The amended wording **preserves the source-file case** — a reviewer citing `claude/…:NNN` is still
   correct under it.
4. `npm test` passes, **including `dual-home-parity` and the `structure-manifest` check** — ⚠️ these
   are the two that this task actually widens verification onto, and a green suite that did not
   exercise them proves nothing here. **Name them and their counts.**
5. `bash test/prove-red.sh` still passes its named mutations.
6. `git diff --stat` shows exactly three files: the two READMEs and `claude/structure-manifest.tsv`.

## Notes

- **Depends on:** nothing. `0369` has landed — verified 2026-09-04, its folder sits in
  `ai-agents/tasks/done/`.
- **Blocks:** nothing.
this belongs above the ordinary citation-repair rows: it is a live self-contradiction in the project's own documentation of its review process, and it is cheap — four occurrences in two byte-identical files — but ⚠️ **its manifest regeneration makes it wider than it looks**, so the owner may want it ranked where a regenerated shipped artifact is acceptable in the diff.
- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- ⭐ **OPEN QUESTION FOR THE OWNER — a scope call this brief deliberately does not make.** Does the
  README carry **the whole five-line rule block**, or **only the renamed column plus the prose fix**?
  The README is an *orientation* document, not a text an agent executes from, so the fuller block may
  be more than it needs; but a renamed column with no rule leaves a reader knowing the cell's name and
  not its form. ⛔ **A run that arrives having already chosen has pre-empted the owner** — raise it.
- ⚠️ **Adjacent, same class, different file:** [`0172`](../0172-narrow-the-architect-output-format-path-line-mandate/brief.md)
  narrows the **architect's** `## Output format` `path:line` mandate. ⛔ **Neither gates the other**,
  but all three should use the **same wording** — `0369`'s.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
