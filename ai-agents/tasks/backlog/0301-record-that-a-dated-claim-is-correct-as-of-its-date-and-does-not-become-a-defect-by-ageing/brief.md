# Record the "correct as of its date" convention — a dated measurement does not become a defect by ageing

## ID
0301

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### The gap, in one sentence

**A dated measurement, or a claim inside a closed artifact, is correct *as of its date*. It does not
become a defect merely because the world moved on.** That rule is **in force** — the owner has ruled it
five separate times — but it is **written down nowhere**, so every agent that meets a plainly false
sentence in a dated block re-derives the question from scratch and escalates it again.

### Authority

**Owner ruling, 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop` — **the option label is the verbatim text**:
**"Leave it — dated blocks are snapshots (Recommended)"**. It was given about
`ai-agents/wiki-vault/wiki/systems/install-and-self-update.md`'s stale CI run count.

A **second owner instruction in the same session authorizes this filing**: the owner was shown that the
same question had been re-derived and re-escalated **five times** and chose to have the convention
recorded.

> ⛔ **THIS IS THE NARROW VERSION, AND THAT IS DELIBERATE.** Earlier the **same day** the owner was
> offered a broader option — ***"Decide the convention repo-wide"***, with an architect pass and an ADR —
> and **declined it**. This task **records the convention that is already in force**; it does **not**
> re-open the question, re-decide it, or widen it. ⛔ **No ADR** (see `## Notes`).

#### Three further owner rulings, 2026-08-14

Given live via `AskUserQuestion` in the same `fkit lead` session driving `/fkit-sprint-ship-loop`, and
relayed to a spawned producer — **the option labels are the verbatim text**. They close this brief's
open questions **1, 2 and 3** (each recorded in full in `## Notes`).

| # | What was asked | Verbatim option label | What it settles |
|---|---|---|---|
| 1 | Is the **per-claim** boundary a *recording* of what `0299` already established, or a **new** decision needing an ADR? | **"It's a recording — proceed (Recommended)"** | **Proceed.** ⛔ **Still no ADR.** ⚠️ But state it plainly: the boundary was **derived from `0299`'s three rulings**, **not** ruled in those abstract words. The ruling authorizes **proceeding**; it does **not** retroactively turn a derivation into an abstract ruling. ⛔ **Do not overstate it.** |
| 2 | Is the stale scaffold **`Seven conventions`** count in scope for `0301`, as filed? | **"Fix it in the same change (Recommended)"** | **Confirmed in scope.** Fix it in this same change — as `## What to build` §2 already says. |
| 3 | Does **`fkit-architect`** stand as this task's owner? | **"Architect, as filed (Recommended)"** | **`fkit-architect` stands.** The `test/dual-home-parity-exceptions.mjs` entry does **not** tip it to `fkit-coder`. |

⚠️ **No scope change.** All three **confirm what this brief already said.** What changes is the
**authority** behind them: a producer's derivation and judgement becomes the **owner's word**.

⚠️ **Open question 4 — the page's filename — was NOT ruled.** The owner did not address it; it stays
**open** for the assigned role to pick (`## What to build` §1).

### Why it is worth a task — five re-derivations in one day, across three surfaces

Each row below cost a worker an escalation and the owner a decision. **All five were ruled
`left as-is`.**

| Where | The statement, now false | Disposition |
|---|---|---|
| `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md` | CI count *"5 runs — 4 success, 1 failure"* (measured 2026-08-13; a 2026-08-14 measure found 9/7/1/1) | left — dated block |
| `ai-agents/sprints/backlog.md` row `0294` (closed) | *"`select-active` measured today returns `active file="sprint-5.md"`"*, plus a settled `⚠️ OPEN QUESTION — OWNER CALL` block | left — filing evidence |
| `ai-agents/sprints/backlog.md` row `0293` (closed) | *"if `0292` has not landed, do NOT describe the corrected README sentence as landed"* — condition since discharged | left |
| `ai-agents/sprints/backlog.md` row `0297` (closed) | *"⚠️ A SYNC IS CURRENTLY OWED"* — watermark now equals HEAD | left |
| `ai-agents/sprints/done/sprint-4.md:54`, `:105`, and `sprint-5.md:24` | *"exactly **one** `sprint-*.md`"* — now **zero** | left ×3, three separate rulings |

⚠️ **The vault instance was escalated by THREE different librarians on the same day**, each
independently concluding it *"needs a task or an explicit decision to leave it."* **They were not
malfunctioning.** They found a plainly false statement and correctly refused either to silently fix it
or to silently ignore it. **The answer existed; it had nowhere to live except a conversation.**

### ⭐ The hard part — this is a per-CLAIM rule, not a per-file or per-block rule

**This is the reason the task is not a one-liner, and the thing most likely to be got wrong.**

Task `0299` proved that **a single sentence can carry a frozen claim and a live defect four words
apart**. Verified on disk 2026-08-14, `ai-agents/sprints/done/sprint-4.md:54-55` reads:

> *"Archiving it before Sprint 5 opens is what keeps exactly **one** `sprint-*.md` in `/fkit-status`'s
> active-sprint **glob**."*

Two claims, one sentence:

- **the count** — *"exactly one `sprint-*.md`"*, now **zero**. A **measurement**, frozen as history.
  **Owner-ruled: leave it byte-for-byte.**
- **the mechanism** — *"`/fkit-status`'s active-sprint **glob**"*. A **real, live defect**:
  [ADR-041](../../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
  **retired glob-based selection** (selection is by resolved *identity*). It is **in scope for `0299`
  to fix**, and it misleads any reader about how the system works **today**.

⛔ **A convention that said "dated blocks are history, leave them alone" would, read literally, have
blocked `0299` entirely.** The page **must** make this distinction explicit or it will cause the exact
opposite error to the one it is meant to prevent.

### Related, and distinct

`claude/skills/fkit-wiki-lint/SKILL.md:227-229` already carries the *forward-looking* half of this idea
— *"State the invariant, not a census"* — i.e. **don't write a perishable number in the first place**.
**This convention is the other half**: what to do when a perishable claim **was already written** and
has now aged. Complementary, not duplicative; the page should cite it.

## What to build

**One convention page in `ai-agents/knowledge-base/conventions/`, plus its scaffold copy** (see
"Dual-home" below — the two are **one change**, not two).

### 1. The page

**Proposed filename: `correct-as-of-its-date.md`.** The assigned role may pick a better rule-shaped
name — the house style is a name that *states the rule* (`evidence-before-assertion.md`,
`priority-is-rank-not-identity.md`, `one-skill-one-output.md`). ⛔ **No date in the filename** — the
conventions README explicitly forbids it (a document needing a date to make sense belongs in
`../reports/`).

It must state, at minimum:

1. **The rule.** A dated measurement, or a claim inside a **closed** artifact (a closed task brief, an
   archived sprint plan, a settled review ledger, a dated wiki record block), is **correct as of its
   date**. Ageing alone does **not** make it a defect, and it is **not** a lint finding, **not** a
   drift report, and **not** grounds for a repair task.

2. **⭐ The boundary — per claim, not per file or per block.** The `sprint-4.md:54` case above, written
   out as the page's worked example. **Freezing attaches to the individual claim**, so one sentence may
   hold a frozen claim *and* a live defect. Give the reader a usable test, something close to:
   *"Was this claim a **measurement or a state report** at the time (frozen), or does it **describe how
   the system works** (live — and wrong today is a defect)?"*
   ⛔ **The page must not license leaving a retired-mechanism claim alone because it happens to sit in
   a dated block.**

3. **The correction form — name it, do not invent it.** It **already exists in practice**:
   **the original survives byte-identical, and a dated `✅ SUPERSEDED` block is appended beneath it.**
   **Correct by appending; never by editing the original.** Live example to cite:
   `ai-agents/wiki-vault/wiki/tasks/wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface.md:72-82`
   — which also models the part worth copying: it records that **the general principle the superseded
   bullet states is UNAFFECTED and still true; only its measured instance is spent.**

4. **⚠️ What it does NOT cover** — state this explicitly, or the convention will be over-applied as a
   blanket excuse:
   - an **undated** claim — nothing pins it, so nothing is frozen;
   - a claim in a **live** document — READMEs, skills, agent definitions, active plans, the living
     canon. **These get fixed.**
   - a **link or path pointer** — a pointer is **repaired by the mover, not frozen**. `0292`'s close
     repaired its `review.md:3` pointer and **that was correct**;
   - a **retired-mechanism** claim — per item 2, a defect wherever it sits.

5. **Provenance**, in the house form the sibling pages use (a blockquote under the H1 naming the owner,
   the date, and the ruling), plus the five-instance evidence table above. ⛔ **The table is
   *evidence*, not a worklist** — see `## Notes`.

### 2. Dual-home — ⚠️ verified, and larger than it looks

Every convention **except** `dual-home-parity.md` (fkit-repo-only) is **dual-homed** into
`claude/scaffold/ai-agents/knowledge-base/conventions/`. This page is **generic** — it governs how
agents work, not how the fkit repo is developed — so **it ships**. `dual-home-parity.md` requires both
copies land in the **same change**.

Three concrete consequences, all measured on disk 2026-08-14:

- **Both README index tables gain a row.** `ai-agents/knowledge-base/conventions/README.md:28-35` and
  the scaffold's equivalent each carry a `What's here` table enumerating that home's conventions.
- **⚠️⚠️ `claude/scaffold/.../conventions/README.md:25` reads *"**Seven** conventions ship with the
  scaffold"*, and the scaffold currently holds exactly **7** convention files.** Shipping this page
  makes that sentence **false** and **must be updated to eight in the same change**.
  ✅ **Owner-confirmed in scope** — ruling 2, 2026-08-14, verbatim option label
  **"Fix it in the same change (Recommended)"** (see `## Context` → *Three further owner rulings*).
  ⭐ **Note the irony and use it: that sentence is an UNDATED count in a LIVE document — precisely the
  case item 4 says this convention does NOT protect. It is a defect, and this task creates it.**
  Consider making it the page's worked example of the non-covered side.
- **The scaffold copy is `audience-adapted`, not byte-identical** (owner ruling 2026-08-01, recorded in
  `test/dual-home-parity-exceptions.mjs`): fkit-internal provenance — task IDs, sprint paths, links into
  `ai-agents/tasks/` and `ai-agents/sprints/` — is **stripped on purpose**, because byte-aligning would
  ship broken links and fkit history into every consuming project. **This page is dense with exactly
  that**, so the scaffold copy needs a genuine de-fkit-ified rewrite that keeps the **rule and the
  boundary** intact while dropping the five-row evidence table's internal citations.
  ⛔ **Therefore it needs an `{ path, kind: 'audience-adapted', reason }` entry in
  `test/dual-home-parity-exceptions.mjs`** — that module is **authoritative**, and `npm test` fails any
  diff between homes that maps to no entry. **Adding the entry is part of this task, not follow-up.**

### 3. Distribution — ⚠️ I verified this myself; it is broader than first reported

`conventions/` is read by the roles that keep hitting this. Measured 2026-08-14 (`grep -c "conventions/"`
per file), **11** skills reference the folder, not the 6 first named:

`fkit-task-brief` (10 refs) · `fkit-status` (6) · `fkit-wiki-lint` (2) · `fkit-task-cancelled` (2) ·
`fkit-task-done` (2) · `fkit-wiki-sync` (1) · `fkit-review` (1) · `fkit-process-stateful-review` (1) ·
`fkit-task-ship-loop` (1) · `fkit-wiki-ingest` (1) · `fkit-sprint-ship-loop` (1) — plus
`claude/structure-spec.md` (13) and `claude/structure-manifest.tsv` (25).

**Filing the page in `conventions/` is therefore already a real distribution path.**
⚠️ **But note honestly: none of those are an automatic citation.** Whether any skill should gain an
explicit pointer to this page — the wiki-lint and wiki-sync stale-claim paths are the obvious
candidates, since librarians raised three of the five escalations — is **left to the assigned role's
judgement and reported**, ⛔ **not silently expanded into a skill-editing task.**

## Verification steps

1. **The page exists in both homes** and both README index tables list it:
   ```
   ls ai-agents/knowledge-base/conventions/ claude/scaffold/ai-agents/knowledge-base/conventions/
   grep -n "correct-as-of-its-date" ai-agents/knowledge-base/conventions/README.md \
     claude/scaffold/ai-agents/knowledge-base/conventions/README.md
   ```
   Both greps must hit.

2. **The stale scaffold count is repaired.**
   `grep -n "conventions ship with the scaffold" claude/scaffold/ai-agents/knowledge-base/conventions/README.md`
   must read **eight**, and
   `ls claude/scaffold/ai-agents/knowledge-base/conventions/*.md | grep -v README | wc -l` must return
   **8**. ⛔ The two must agree — that is the whole point of the item.

3. **`npm test` is green**, specifically the dual-home parity test. ⚠️ **Red-prove it**: confirm the
   parity test **fails** with the new page present and its `dual-home-parity-exceptions.mjs` entry
   removed, then restore the entry and show it green. A green run that never could have failed proves
   nothing.

4. **The boundary is actually in the text, and is testable by reading.** The page must let a reader
   reach the **correct and opposite** answers on the two halves of `sprint-4.md:54` — count **frozen**,
   mechanism **a defect**. ⚠️ **State this check as performed, quoting the page's own words**; if the
   page cannot decide that sentence, it has failed its main job regardless of everything else.

5. **The four non-covered cases are each stated** (undated / live document / link-pointer /
   retired-mechanism). Quote them.

6. ⛔ **`git diff --stat` must NOT list any of the five evidence files** — no
   `install-and-self-update.md`, no `sprints/done/sprint-4.md`, no `sprints/done/sprint-5.md`, and no
   edit to the `0293`/`0294`/`0297` rows in `ai-agents/sprints/backlog.md`. **They are owner-ruled
   left-as-is.** An edit to any of them is a failed run, not a bonus.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **✅ CLOSED 2026-08-14 — was open question 1:** *the **per-claim** boundary (⭐ `## Context`) was
  **derived** from `0299`'s three rulings rather than ruled in those words, and the owner had **declined**
  the ADR route earlier the same day — is recording it a **recording**, or a **new decision** needing an
  ADR?* **ANSWERED: it is a recording — proceed.** Owner ruling 1, given live via `AskUserQuestion` in a
  `fkit lead` session driving `/fkit-sprint-ship-loop` — **verbatim option label: "It's a recording —
  proceed (Recommended)"**. ⛔ **No ADR.** ⚠️ **Do not overstate it:** the boundary remains **derived
  from the `0299` rulings**, **not** ruled in the abstract — this ruling authorizes **proceeding**, it
  does **not** retroactively make it an abstract ruling. **This question is no longer open.**
- **✅ CLOSED 2026-08-14 — was open question 2:** *the stale scaffold count
  `claude/scaffold/ai-agents/knowledge-base/conventions/README.md:25` — **"Seven conventions ship with
  the scaffold"** — was scoped **into** this task by the filing producer; confirm it belongs here rather
  than in a follow-up?* **ANSWERED: yes — fix it in the same change.** Owner ruling 2, same session and
  channel — **verbatim option label: "Fix it in the same change (Recommended)"**. Re-verified on disk
  2026-08-14: `README.md:25` reads *"Seven conventions ship with the scaffold"* and the scaffold holds
  exactly **7** non-README `.md` files, so shipping the eighth makes it false. ⚠️ Keep the brief's
  observation that this is an **undated count in a live document** — the case the convention does **not**
  protect, and a good worked example for the page. **This question is no longer open.**
- **✅ CLOSED 2026-08-14 — was open question 3:** *the owner role was a precedent-weighted judgement on a
  genuinely **split** record — does `fkit-architect` stand, or does the code-adjacent
  `test/dual-home-parity-exceptions.mjs` edit tip it to `fkit-coder`?* **ANSWERED: `fkit-architect`
  stands, as filed.** Owner ruling 3, same session and channel — **verbatim option label: "Architect, as
  filed (Recommended)"**. The `dual-home-parity-exceptions.mjs` entry does **not** tip it. ⚠️ The
  precedent table below **stands as the record**: this ruling settles **this task**, not the general
  precedent. **This question is no longer open.**
- **⬜ STILL OPEN — question 4:** *what the page's filename should be.* **NOT ruled** — the owner did not
  address it. Left **open for the assigned role to pick**, as `## What to build` §1 says (proposed
  `correct-as-of-its-date.md`; the house style is a name that states the rule; ⛔ no date in the
  filename).

### ⛔ Scope fences

- ⛔ **Do NOT go fix the five instances in the evidence table.** All five are **owner-ruled left
  as-is**. They are recorded here as **evidence that the convention was needed**, ⛔ **not as a
  worklist.** (See verification step 6 — this is checked.)
- ⛔ **No ADR.** The owner **declined** the repo-wide-ruling option that would have required one. This
  records an in-force convention; it does not decide a new one.
  ✅ **Re-confirmed by owner ruling 1, 2026-08-14** — verbatim option label
  **"It's a recording — proceed (Recommended)"** (see the closed question below). **The ADR question is
  ruled, not open.**
  ⚠️ **If the assigned role judges the boundary rule genuinely needs an ADR rather than a convention
  page, STOP and put it to the owner** — ⛔ do not settle it by writing one.
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  — filed by a spawned producer with no owner channel; this row is **unranked** (`—`) and renumbers
  nothing.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  — the vault is `fkit-wiki`'s exclusively. ⚠️ Note that the **first** escalation lives in the vault;
  if the page's landing warrants a vault record, that is **routed to `fkit-wiki`**, not done here.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, **producer-only**, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent.
- ⛔ **No commit, no push.**

### On the owner role — `fkit-architect`, and why

⚠️ **Precedent is genuinely split, so it was measured rather than assumed.** Sweep of every brief whose
title names a convention (2026-08-14):

| Brief | Owner |
|---|---|
| `0137-record-verify-against-the-claim-convention` | `fkit-coder` |
| `0138-record-disproof-carries-the-higher-bar-convention` | `fkit-coder` |
| `0014-align-conventions-readme-enforcement-item-live-vs-scaffold` | `fkit-architect` |
| `0171-write-the-durable-citation-anchors-convention-page` | `fkit-architect` |
| `0178-record-the-canonical-merit-statement-form-in-the-convention-page` | `fkit-architect` |

**`fkit-architect` chosen**, on three grounds: **(1)** `0171` — *"write the `durable-citation-anchors`
convention page — **dual-homed into the scaffold**"* — is this task's **exact structural twin** (a new
convention page plus its scaffold copy) and is `fkit-architect`'s; **(2)** the two `fkit-coder` rows are
the **older era** (`0137`/`0138`), and every convention-authoring brief since is `fkit-architect`'s;
**(3)** the deliverable's hard part is a **cross-cutting boundary judgement** — which claims freeze and
which stay live — not a mechanical edit.
⚠️ **Stated plainly: the precedent above is genuinely split, not a settled rule** — and the reasoning
here was a precedent-weighted **producer judgement**.

✅ **Owner ruling 3, 2026-08-14** — given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, **verbatim option label: "Architect, as filed (Recommended)"**.
**`fkit-architect` stands**, and the code-adjacent edit `## What to build` §2 carries
(`test/dual-home-parity-exceptions.mjs`) does **not** tip the call to `fkit-coder`.
⚠️ **The ruling settles this task, not the general precedent** — the split table above stands as the
record for the next convention brief.

### ⚠️ State of the tree at filing — corrected against the handed-down claim

This filing was told the working tree carried **17 uncommitted `ai-agents/wiki-vault/` files** from a
just-completed sync. **That was checked and is no longer true.** Measured at filing time,
2026-08-14: `git status --porcelain` returns **0 lines — the tree is clean**, and the wiki-vault sync
was **committed** in `20f431f` (*"Sprint push"*), which touches `wiki-vault` paths. **This brief and its
board row are therefore the only uncommitted work in the tree**, not additions alongside a pending
sync. (`conventions/evidence-before-assertion.md` — asserted from a check made this turn.)

⚠️ **The owner was reported to be about to cut a release**, so expect this brief and its row to be
committed by someone else shortly, or to be deliberately held back.

### One unit, deliberately not decomposed

The convention page and its scaffold copy are **one shippable unit**: `dual-home-parity.md` requires
both be written in the **same change**, and the parity test enforces it. Splitting them would create an
un-shippable half that **fails `npm test` on its own**. The README index rows and the
`dual-home-parity-exceptions.mjs` entry are part of the same atomic change for the same reason.
