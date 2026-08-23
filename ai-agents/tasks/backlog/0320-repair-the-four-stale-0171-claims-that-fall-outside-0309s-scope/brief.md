# Repair the two stale `0171` claims in the closed briefs `0261` and `0263` — append-only dated correction notes

## ID
0320

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

### ⚠️ THIS BRIEF WAS NARROWED ON 2026-08-22 — READ THIS FIRST

**This task was filed carrying four sites (A, B, C, D) and now carries two (A and B).** The owner
split it live the same day.

**Owner ruling 2026-08-22**, given via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned producer — **verbatim option label:
"Split it (Recommended)"**.

The question it answered, verbatim:

> *"Should 0320 split into two tasks? The producer filed it as one because your ruling said 'a
> separate brief' (singular) and a spawned worker doesn't widen a ruling — but it flagged that
> /fkit-task-brief's own independent-shippability test points the other way."*

The chosen option's description, verbatim:

> *"0320 keeps A+B (closed briefs — append-only notes, additions-only proof); a new 0321 takes C+D
> (live board — two different treatments, no additions-only proof available). The producer's own
> stronger read: different repair forms, different proofs, ship in either order. C and D differ from
> EACH OTHER, so one brief risks a run applying one treatment to both."*

**Sites C and D now live in
[`0321`](../0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md)** — the two
rows on `ai-agents/sprints/backlog.md`. ⛔ **This task does not touch `ai-agents/sprints/backlog.md`
at all**, beyond the fact that its own row already sits there.

⚠️ **The folder slug still reads `…-repair-the-four-stale-0171-claims-…` and is now wider than the
scope.** It was deliberately left unchanged: renaming the folder would break the board's Brief-cell
href and every inbound citation, and the durable identity of a task is its `NNNN` prefix, not its
slug ([`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
**The `# H1` above is authoritative over the slug.** Whether the folder should be renamed is
**returned to the owner as an open question, not decided here.**

### Original authority — why the sites were separated from `0309` at all

**Owner ruling 2026-08-22**, same session, earlier — **verbatim option label:
"File a separate brief (Recommended)"**.

The question it answered, verbatim:

> *"Four of the seven stale-0171 sites fall outside 0309's own `⛔ Out of scope` list and
> verification step 7 — two closed briefs (0261, 0263) under `tasks/done/`, and two rows on
> `sprints/backlog.md`. The producer recorded them but refused to widen 0309's acceptance criteria
> on its own judgement. How do they get repaired?"*

The chosen option's description, verbatim:

> *"The producer's recommendation. Keeps 0309's acceptance intact, and the done/ pair needs the
> append-only correction-note form 0309 was never scoped for — a different repair with a different
> proof. Cost: one more backlog row, and the four stay stale until it runs."*

### ⛔ Why this brief exists, and the merge it must not suffer

**This task exists BECAUSE these sites are outside
[`0309`](../0309-repair-the-hyphenated-task-nn-citation-class-in-four-open-briefs/brief.md)'s scope.**
`0309`'s own `⛔ Out of scope` list bans *"any closed brief"* and *"No sprint plan edited"*, and its
verification step 7 requires `git diff --stat` to show **nothing** under `ai-agents/tasks/done/` or
`ai-agents/sprints/`. `0309` itself records the collision under the heading
*"⛔⛔ FOUR OF THE RULING'S SEVEN SITES COLLIDE WITH THIS BRIEF'S OWN `⛔ Out of scope` LIST — AND
THAT IS NOT RESOLVED HERE"*, and instructs its implementer to *"Leave the four colliding sites alone
and name each of them in the close report as an accepted residual"*.

⛔ **`0309` WAS LEFT INTACT BY OWNER RULING.** The owner was offered the choice and chose to file
separately rather than widen it. So:

- ⛔ **Do not amend `0309`'s `⛔ Out of scope` list, its verification step 7, or any acceptance
  criterion of `0309`.** `0309` stays exactly as it is.
- ⛔ **Do not fold this task back into `0309`, and do not "helpfully" merge the two runs.** They are
  deliberately separate, by the owner's call, on the record above.
- ✅ **`0309`'s implementer is unaffected.** Its residual-naming instruction stands; it should now
  name **this task and `0321`** as where the four sites went.

### Provenance — how the two became stale

[`0171`](../../done/0171-write-the-durable-citation-anchors-convention-page/brief.md) closed
**2026-08-22** (`## Status` reads `✅ Done (agent-closed — not owner-verified)`) and its folder moved
from `ai-agents/tasks/backlog/` to `ai-agents/tasks/done/`. The closing producer repaired **24**
hrefs and **deliberately left prose byte-identical**, so every sentence describing `0171` as open or
in progress survived the close. An earlier ruling folded that prose residual into `0309`; a later
producer found four of the seven named sites sit outside `0309`'s own acceptance; the owner then
split those four into this task (A, B) and `0321` (C, D).

### The two sites — re-measured firsthand on disk, 2026-08-22

⚠️ **Dated observation, not a permanent fact.** Measured against a **dirty working tree** at
`HEAD` = `6f3d9f3` (*"Sprint push"*), with other workers holding uncommitted edits on **both** target
files and a live `fkit-wiki` worker writing `ai-agents/wiki-vault/`. ⛔ **Re-measure before acting;
do not carry these fragments forward unverified.**

⚠️ **No `path:NNN` coordinate appears below, deliberately.** Both targets are **coordination
documents** — task briefs — which is row 3 of
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md):
*"third parties append **above** your line for reasons unrelated to your sentence; the file grows
under you"*, so `path:NNN` there is **categorically wrong**. Each site is anchored by **enclosing
heading + quoted fragment**, per that page's own rider *"Pair every `path:NNN` with a quoted fragment
or the heading it sits under"*. ⚠️ **That page states its own limit, and it applies here:** `## Notes`
in both briefs is a long section, so the heading alone will not find the claim — **search for the
quoted fragment.**

⚠️⚠️ **THE FRAGMENT IS LINE-WRAPPED, AND A SINGLE-LINE `grep` FOR IT RETURNS NOTHING.** Verified
2026-08-22: `grep -n "is the open task for the convention page" <brief>` returns **no output on
either file**, because the sentence wraps after *"is the open task for"* and resumes on the next line
at the list item's continuation indent. ⛔ **A run that greps the full sentence and concludes the site
is already repaired has been fooled by the line wrap, not by the repo.** Search a **within-one-line
sub-fragment** instead — `grep -n "is the open task for"` or `grep -n "0171"` — or normalise
whitespace first. This is itself an instance of the convention page's own point that *"a citation form
is only as good as the pattern that finds violations of it."*

| # | File | Anchor: heading + quoted fragment | What is stale | Href state |
|---|---|---|---|---|
| **A** | `ai-agents/tasks/done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md` | `## Notes`, the bullet opening *"Line-number citations above are dated (2026-08-10) anchors of convenience"*; the stale phrase begins *"is the open task for"* and continues on the next line with *"the convention page."* | *"is the open task"* — `0171` is `✅ Done` | ✅ **Already correct.** The href reads `../0171-write-the-durable-citation-anchors-convention-page/brief.md`; both files now sit in `tasks/done/`, so it resolves. **Verified 2026-08-22.** ⛔ Nothing to repair in the link |
| **B** | `ai-agents/tasks/done/0263-wiki-resync-after-the-sprint-4-archival-and-sprint-5-open/brief.md` | `## Notes`, the bullet opening *"Line-number citations are dated anchors of convenience"*; same wrapped phrase | the same phrase | ✅ Already correct, same reason, **verified 2026-08-22** |

**Premise confirmed 2026-08-22: both files exist, both fragments are present, both claims are stale,
neither is already repaired.**

⚠️ **PREMISE CORRECTION, carried forward deliberately and NOT to be dropped:** the ruling's original
framing implied a **link** repair was outstanding at these sites. **It is not.** Both hrefs became
correct **by the folder move itself** — citer and target both now sit in `ai-agents/tasks/done/`, so
`../0171-…/brief.md` resolves. **This task is PROSE-ONLY.** ⛔ **If a run reports that it repaired a
link here, it repaired something that was never broken.**

### ⚠️ Why this is its own task — the proof shape is the reason

Both sites are **closed briefs**. Their text is **history**, so the repair is an **appended dated
correction note** and the proof available is **additions-only** (`+N / −0` plus the form's deletion
filter). That proof is exactly what `0321`'s two live-board rows cannot offer — one of them is
repaired in place by design. **Different repair form, different proof, independently shippable.** The
two tasks may run **in either order or concurrently**; neither gates the other.

## What to build

1. **Re-verify both sites before touching anything.** For each of A and B: does the file exist, is
   the quoted fragment still present, and is the claim still stale? ⚠️ **Use a within-one-line
   sub-fragment — the full sentence is line-wrapped and will not match** (see the ⚠️⚠️ block above).
   ⛔ **If a site has been repaired by another run in the meantime, skip it and record that in the
   worklog — do not re-repair it, and do not invent a replacement site.** ⛔ *"Not checked"* is not an
   outcome. Record the exact search commands and their output. Authority:
   [`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).

2. **Append a dated correction note to each closed brief. Append-only.**

   - **Use the form `0198` shipped**, in `claude/skills/fkit-record-decision/SKILL.md`, section
     `## Correcting an accepted ADR — the dated correction note`. ⛔ **Consume the form; do not edit
     the skill** (changing a mover or a form is `0229`'s ground, not this task's).
   - **Marker: ⚠️ in both notes** — *"a fact that drifted (the decision is untouched)"*. ⛔ **No ⛔
     note belongs in this task.** Nothing either brief decided was overturned; only a fact about
     `0171`'s state aged. The form's own warning applies: *"a drift marked ⛔ tells readers to stop
     following a decision that in fact stands."*
   - **Placement and indentation:** the note goes **below** the claim it corrects, and its
     indentation **matches the block it sits under**. Both claims sit inside a `## Notes` list item,
     so each note takes that **item's continuation indent**, not column 0.
   - **Content of each note:** the date, that `0171` is now `✅ Done (agent-closed —
     not owner-verified)` in `ai-agents/tasks/done/`, that the original sentence is **left
     byte-identical**, and — because it is the useful half — that the **href above it still resolves
     correctly**, so a reader who follows the link lands in the right place.
   - ⛔ **NEVER EDIT THE ORIGINAL CLAIM.** Not a word, not a character. The recorded text is history;
     corrections are appended next to it, never written over it.
   - ⛔ **Do not reopen, re-status, move, rename or re-rank `0261` or `0263`.** Both stay
     `✅ Done` where they are. Task files move only via `/fkit-task-done` / `/fkit-task-cancelled`,
     producer-only
     ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md));
     no move is in scope here.

3. **Record the header-warning gap as an accepted, named gap — do not invent a carrier.**

   ⛔ **Do not add a `- **Corrections:**` header bullet to `0261` or `0263`, and do not invent a
   brief-shaped equivalent of one.** That is
   [`0315`](../0315-define-the-corrections-header-warning-equivalent-for-briefs-and-board-rows/brief.md)'s
   open question and this task must not pre-decide it.
   **Follow the precedent [`0318`](../0318-append-a-dated-correction-note-to-0238s-closed-brief/brief.md)
   set on 2026-08-22:** omit the bullet, and ⚠️ **state the consequence honestly in the worklog** —
   the ADR form warns the reader **first**, via that header bullet; a brief has no such carrier today,
   so a reader who does not reach the annotated claim gets **no warning at all**.
   **That is an accepted, recorded gap belonging to `0315`, not a defect of this run.**

4. **Prove the boards did not move.** Neither board is a write target of this task, so both renders
   must be **unchanged**. Capture before editing, then re-run:
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` and
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md`.
   ⚠️ **A pass is not "exit 0"; it is "byte-identical to the before capture".**

### ⛔ Out of scope

- ⛔ **`ai-agents/sprints/backlog.md` — sites C and D are
  [`0321`](../0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md)'s.** This task
  edits **no board**. A diff touching `backlog.md` is a failed run.
- ⛔ **`0309` in every respect** — its `⛔ Out of scope` list, its verification step 7, its acceptance
  criteria, its `## What to build`. Owner-ruled intact 2026-08-22. **Its file is not edited by this
  task at all.**
- ⛔ **The other three of the ruling's seven `0171` sites** — those are `0309`'s, and repairing them
  here would collide with a live run.
- ⛔ **Any `## Status` value, anywhere.** Not on `0261`, not on `0263`, not on `0171`, not on any board
  row. `0261` and `0263` stay `✅ Done`. This is prose repair, **not** a status change.
- ⛔ **No task file moved, renamed or reopened** — movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
  ⚠️ **That includes renaming this task's own folder**, whose slug is now wider than its scope; see the
  narrowing block above.
- ⛔ **`ai-agents/wiki-vault/`** — `fkit-wiki`'s exclusively
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  If the run concludes the vault carries the same stale claim, **flag it to the producer for routing to
  `fkit-wiki`; do not write it here.**
- ⛔ **`claude/`** — no skill, no `dashboard.sh`, no agent file. This task **consumes** the
  correction-note form and the dashboard; it changes neither.
- ⛔ **`0229`** (widening `/fkit-task-done` so a close can repair a brief that contradicts it) and
  **`0315`** (the corrections header-warning form) are **related and deliberately NOT pre-decided
  here.** This task is two named instances; both of those are general mechanisms. ⛔ **A run that
  invents a rule, a check, a convention or a tooling change has exceeded this brief.**
- ⛔ **No commit, no push.** No secrets in any artifact.

## Verification steps

1. **The worklog carries a two-row premise table**, one row per site A and B, each stating *exists /
   stale / already repaired* with the **command and its output** that established it, and each
   recording that the search used a **within-one-line sub-fragment** because the sentence wraps.
   ⛔ A shorter table fails this step.
2. **Both files are additions-only.** For each of the two closed briefs:
   - `git diff --numstat -- <brief>` → the deletions column reads `0`.
   - `git diff -U0 -- <brief> | grep '^-' | grep -v '^---'` → **no output**.
   ⚠️ **Use that deletion filter exactly.** The shorter-looking `grep '^-[^-]'` is **wrong** — a
   deleted markdown list line `- text` appears in the diff as `-- text`, so its second character is
   also `-` and the pattern skips it.
   ⚠️ **Both files already carry another worker's uncommitted edits**, so a working-tree diff against
   `HEAD` cannot isolate this run's change. Take a **before-edit snapshot** of each and run the form's
   snapshot pair as well:
   `git diff --no-index --numstat <snapshot> <brief>` → `N  0`, and
   `diff <snapshot> <brief> | grep '^<'` → **no output**. Record both sets of numbers.
3. **Each file carries exactly one new ⚠️ note**, placed **below** the corrected claim, at the
   enclosing list item's continuation indent, and **neither carries a ⛔ note**:
   `git diff -U0 -- <brief> | grep '^+' | grep '⛔'` → **no output**.
4. **The original claim is byte-identical.** After the edit, the sub-fragment *"is the open task for"*
   is **still present verbatim** in both files, on its own original line.
5. **Neither file gained a `- **Corrections:**` header bullet**, and the worklog states the
   reader-warning gap as an **accepted gap belonging to `0315`**, naming `0318` as the precedent
   followed.
6. **No `## Status` line changed anywhere:** `git diff -U0 | grep -E '^[-+].*## Status'` is empty.
7. **No board changed.** `git diff -- ai-agents/sprints/` shows **no change made by this run**
   (compare against a before-edit snapshot — other workers already hold uncommitted edits there, so a
   non-empty diff against `HEAD` is expected and is **not** this run's).
8. **`0309` is byte-identical to its pre-run state.**
   `git diff -- ai-agents/tasks/backlog/0309-*/brief.md` shows **no change made by this run** (same
   snapshot method as step 7).
9. **`git status --porcelain` shows changes only at:** the two `tasks/done/` briefs named above and
   this task's own folder. ⛔ **Nothing under `claude/`, `ai-agents/sprints/`, `ai-agents/wiki-vault/`,
   `ai-agents/knowledge-base/` or `test/`.** ⚠️ Other workers' pre-existing dirty paths must be
   **listed and excluded by name**, not waved at.
10. **The two dashboard renders are byte-identical to their before-edit captures** (step 4 of
    `## What to build`).

## Notes

- **Depends on:** nothing.

  This task is independently shippable today: both sites exist, both are stale, and no other task is
  authorised to touch either.

- **Relates to, with no ordering in either direction:**
  [`0321`](../0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md) — its sibling
  from the same 2026-08-22 split, carrying sites C and D on `ai-agents/sprints/backlog.md`. ⭐ **The two
  have NO file in common**: this task writes only under `ai-agents/tasks/done/`, `0321` writes only
  `ai-agents/sprints/backlog.md`. They may run in either order or concurrently, and **neither gates the
  other.**
- **Relates to, without any ordering between them:**
  [`0309`](../0309-repair-the-hyphenated-task-nn-citation-class-in-four-open-briefs/brief.md) — **scopes
  are disjoint by owner ruling**, so the two may run in either order or concurrently. Both may be
  running against the same dirty tree, so **re-measure rather than trusting a captured baseline.**
- **Related and deliberately NOT pre-decided:**
  [`0229`](../0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md) (should a
  close be able to repair a brief it contradicts) and
  [`0315`](../0315-define-the-corrections-header-warning-equivalent-for-briefs-and-board-rows/brief.md)
  (the corrections header-warning form). Both are **general mechanisms**; this is **two named
  instances**. ⛔ This task adds no rule, no check and no convention, and **must not pre-decide
  either**.
- ⚠️ **The split this brief once returned as an open question has been RULED.** The original filing
  recorded that the `done/` pair and the two board rows were arguably two independently shippable units
  and returned it rather than acting. The owner ruled **"Split it (Recommended)"** on 2026-08-22 and the
  split is now applied: this task is the `done/` pair, `0321` is the board rows.
- ⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel** (`AskUserQuestion` is absent in a
  consult —
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  This row **appends** to the Backlog board and renumbers nothing; a mid-board insertion is not the
  owner-ruled re-rank exception
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The Backlog board is unranked by design, so **no merit position is stated** — there is no ranking
  here to state one against.
- ⚠️ **`## Owner` is `fkit-producer`, and that is a scope fact, not a preference.** The write surface is
  two task briefs — planning artifacts. No source file changes; there is nothing for `fkit-coder` to
  build. This mirrors `0318`, the same shape of task, filed the same day.
- ⚠️ **This brief decays.** Every fragment, path and figure above was measured **2026-08-22** against a
  **dirty tree** at `HEAD` = `6f3d9f3`, with uncommitted edits from other workers on **both** target
  files. ⛔ **Re-measure at implementation time; do not quote this brief as evidence.**
- Filed 2026-08-22 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the same
  day; **narrowed from four sites to two on 2026-08-22** by a spawned `fkit-producer` on the owner's
  split ruling recorded at the top. **No commit was made** — every edit is left in the working tree.
