# Correct the stale *"stays byte-unchanged"* claim in `fkit-sprint-ship-loop` — a decision on wording, not a deletion

## ID
0170

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### The defect, verified firsthand 2026-07-31

`claude/skills/fkit-sprint-ship-loop/SKILL.md` asserts that the coder's task loop is frozen:

> `fkit-task-ship-loop` stays **byte-unchanged.**

**ADR-033 falsified that claim, and the falsifying edit is in the file today.** Both halves were
re-derived by direct read, not inherited from a relay:

- **ADR-033 records the rewrite.** Its Decision section states that *"`fkit-task-ship-loop` step 9
  changes from invoke `/fkit-task-done` to route the close to the producer"*, and its consequences
  section lists `claude/skills/fkit-task-ship-loop/SKILL.md` (step 9) in the doc/skill ripple.
- **The rewrite is present.** `fkit-task-ship-loop/SKILL.md` step 9 today reads *"Route the close to the
  producer — never close it yourself"* and cites ADR-033 by name. The file carries **13** separate
  ADR-033 references, including its frontmatter `description:`.

ADR-033's status is **accepted**, and it explicitly **amends ADR-032**.

### ⚠️ TWO sites in this file, not one

The defect was relayed as a single site. **It is two** — both in
`claude/skills/fkit-sprint-ship-loop/SKILL.md`, and a fix that repairs only the first leaves the claim
standing in the more normative of the two:

| # | Line (at filing) | Section | Text |
|---|---|---|---|
| 1 | `:43` | the narrative *"it models the task loop's rigor, never invokes it"* passage | *"`fkit-task-ship-loop` stays **byte-unchanged.**"* |
| 2 | `:237` | **`## Hard rules`** — the bullet *"Never invoke `fkit-task-ship-loop`"* | *"reuse its *shape* only. It stays byte-unchanged."* |

**Site 2 sits in `## Hard rules`.** A stale factual claim inside a rules block is the worse of the two,
because that is the section a driver reads as binding. **Both are in scope.**

> ⚠️ Line numbers are given **as at filing only**, for locating the sites. Task `0160` (open) is deciding
> the durable citation form for mutable coordinates, and its **Case 2** is exactly this. **Write no new
> `:NNN` citation into any skill file** as part of this fix — locate by section heading and quoted
> phrase instead.

### Why this is filed as a task and not left as a note

**Owner ruling, `AskUserQuestion`, 2026-07-31**, in a live `/fkit-sprint-ship-loop` session: file it as
a task.

It is the **same defect class** that `0151` fixed in `CLAUDE.md` and `0159` swept off the sprint board —
**a governing document asserting a fact about another file that is no longer true.** Two prior instances
make it a class, not an accident.

What makes this instance worth its own task rather than a footnote: **it sits inside the driver skill
that runs on every sprint**, so it misinforms that loop first. This sprint supplied the concrete evidence
for why that matters — **a stale claim in a governing document propagates into worker prompts.** That is
how a wrong ruling date reached the owner's own plan approval this run, and it was caught only by a
reviewer, not by the author.

### ⚠️ This needs a DECISION on wording — it is not a deletion

**Do not simply delete the sentence.** The claim had a **true scope**, and deleting it loses a real fact:

> **ADR-032's own ripple did not require editing the task loop.** Introducing the sprint driver was
> deliberately designed so the coder's loop needed no change — that is a genuine design property of
> ADR-032, and it is what both sentences were written to say.

What went wrong is that a **scoped** claim was written in **unscoped, permanent-tense** words
(*"stays byte-unchanged"*), so a later ADR editing that file for an unrelated reason made it read false.

**The likely fix is to state the scope rather than remove the sentence** — something that says
introducing the sprint driver required no edit to the task loop, without claiming the file is frozen
forever. **This brief deliberately does not prescribe the wording.** Choosing it is the point of the
task; a mechanical find-and-replace would very likely reproduce the defect in a fresher tense.

The implementer should decide, and record the reasoning in the worklog:

1. **Scope the claim to ADR-032's ripple** (the expected answer) — keeps the design fact, drops the
   permanence.
2. **Delete it** — cheapest, loses the design fact. Justify if chosen.
3. **Keep it and date it** — *"as of ADR-032 …"*. Preserves history at the cost of a reader having to
   check whether it still holds.

Whichever is chosen, the two sites should end up **consistent with each other** — they are the same
claim in two registers, and fixing them differently is its own defect.

### Open scope question the implementer must NOT settle alone

> **✅ RULED — 2026-07-30, executed 2026-07-31. This block's question is answered.** Read the
> *"🆕 2026-07-31 — scope widened by owner ruling"* section immediately below **before** acting on
> anything in this block. The owner ruled ADR-032 **in scope**, by **dated append only**. The block is
> kept as written because its reasoning — *append, never rewrite* — is exactly what the ruling adopted;
> only its *"do not act without a ruling"* instruction is spent, the ruling having arrived.

**ADR-032 itself carries the same claim**, in its Decision 1: `fkit-task-ship-loop` *"stays
byte-unchanged and session-only."* *(🆕 2026-07-31 — re-verified firsthand. This paraphrase is exact;
full quotation and location by heading in the new section below.)*

**Do not edit it as part of this task without a ruling.** An accepted ADR is a dated historical record;
this repo's convention is to correct one with an **appended dated note**, never a rewrite (see task
`0143`, which appends exactly such a note to ADR-010). There is also a live question of whether it needs
anything at all, since **ADR-033 already declares that it amends ADR-032** — the amendment is recorded,
just not at the sentence.

**Adjacent finding, noted not scoped:** ADR-032's header lists *"Amended by:"* only its own
§Amendment — 2026-07-22, and **does not list ADR-033**, even though ADR-033's header declares it amends
ADR-032. That is a **separate** back-link gap, out of scope here, and should be raised rather than
silently fixed inside this task.

> **⛔ FALSE — SUPERSEDED 2026-07-31.** The paragraph above is kept as the accurate record of what this
> brief asserted when filed, but **it is wrong and was wrong at filing.** ADR-032's header **does** list
> ADR-033 under *"Amended by:"*, and has since 2026-07-26. **There is no back-link gap.** Evidence and
> the exact header text are in *Item B* of the new section below. **Do not act on this paragraph.**

**Route this to the owner as an open question. Ship the two `fkit-sprint-ship-loop` sites regardless** —
they are unblocked by it.

### 🆕 2026-07-31 — scope widened by owner ruling

**Provenance:** owner ruling **2026-07-30** via `AskUserQuestion` in the live `/fkit-sprint-ship-loop`
driver session, deferred the same day by a second owner ruling (*"defer to next run — commit now"*),
**executed 2026-07-31** by a spawned `fkit-producer` with **no owner channel**. Every claim below was
re-derived firsthand from the files, not inherited from the driver's relay.

The ruling widened this task with **two** items. **One survived verification; one did not.**

#### ✅ Item A — IN SCOPE: ADR-032 Decision 1 carries the same falsified claim

**Verified firsthand 2026-07-31.** In `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md`,
under the heading `## Decision`, numbered item **1** — the one beginning *"`fkit-sprint-ship-loop` is a
new skill owned by `lead`"* — ends with this sentence, quoted exactly:

> It **does not invoke** `fkit-task-ship-loop`, which stays byte-unchanged and session-only.

This is the **identical defect** the task already fixes at the two `fkit-sprint-ship-loop/SKILL.md`
sites: the *"byte-unchanged"* half is falsified by **ADR-033 §Decision 3**, whose step-9 rewrite is
present in `claude/skills/fkit-task-ship-loop/SKILL.md` today. **The *"session-only"* half is still
true and must survive** — the task loop genuinely does refuse a spawned invocation.

**🆕 Adjacent site in the same ADR, folded into this item.** ADR-032's `## Consequences` → **Positive**
list carries the same falsified claim in different words — the bullet reading, exactly:

> `fkit-task-ship-loop` and every role stay untouched; the change is additive and opt-in by name.

Same subject, same staleness, same remedy. **One dated note covers both sites — do not write two.**

**⛔ THE REMEDY IS A DATED APPEND, NEVER A REWRITE.** ADR-032's status is **accepted**, which makes it
frozen historical record. **Do not edit Decision 1's sentence. Do not edit the Consequences bullet.
Do not reword, scope, date, or delete either in place** — the three wording options offered earlier in
this brief apply to the **skill file only**, not to the ADR. The remedy is to **append a dated note** to
ADR-032 (repo precedent: task `0143`, which appends exactly such a note to ADR-010) recording that:
ADR-033 §Decision 3 falsified the *"byte-unchanged"* half; the *"session-only"* half stands; and both
the Decision 1 sentence and the Consequences bullet are covered. **The note must not restate the claim
in a fresher permanent tense** — that reproduces the defect one layer down.

#### 🆕 The ADR-032 note's FORM is now settled — four binding decisions inherited from `0143` (2026-08-02)

**This brief already names `0143` as its model. `0143` has now shipped, and its form is no longer a
sketch — four decisions are settled and this task is bound by them.** Read `0143`'s `worklog.md` and
`review.md` for the reasoning; this list is an index, not a substitute. **Do not re-derive the form and
do not re-litigate these four** — a second note in a second shape is exactly the fork the precedent
exists to prevent.

| # | Binding decision | Source in `0143` |
|---|---|---|
| 1 | **Placement: the note goes BELOW the claim it corrects.** This **departs from the wiki vault's *"banner above claim"* convention**, deliberately, with a recorded rationale. Follow it and cite it. | Residual `R1-placement`, kept-as-shipped with recorded rationale |
| 2 | **The header `- **Corrections:**` bullet** — one metadata *item* that **may wrap**, carrying the ⚠️/⛔ legend and the list of annotated sites. It is the one part of an `accepted` ADR an append-only correction may extend, because it is metadata about the notes rather than body text. | Owner ruling Q3 (2026-08-02); residual `R5-header-form`, ratified |
| 3 | **Citation form: no `:NNN` into a mutable file.** Anchor by file plus quoted phrase. **Permitted, not mandated** — but where this task writes a new pointer, this is the form. | `0143` accepted residual, owner-permitted |
| 4 | **Two markers, and only two: ⚠️ = a fact that drifted** (the decision is untouched); **⛔ = a decision that was overturned** (do not follow it). **Do not invent a third.** | Owner ruling Q1 (2026-08-02); shipped legend on ADR-010 |

**Which marker this task writes: ⚠️, not ⛔** — and the note must say why. ADR-033 falsified a **fact**
inside ADR-032's Decision 1 (*"byte-unchanged"*); it did **not** overturn ADR-032's decision, and the
*"session-only"* half stands. Marking it ⛔ would tell readers to stop following a decision that is in
force. This is the exact distinction decision 4 exists to carry.

**Also inherited: the proof obligation.** `0143`'s load-bearing constraint was **`+N / −0`**, verified by
`git diff --numstat` (deletions must read `0`) and `git diff -U0 | grep '^-'` returning nothing — **not
by eye**. Apply the same proof to ADR-032, with the same single exception for the header bullet
(decision 2), justified in the worklog.

⚠️ **One caveat this task must not import silently.** `0143` shipped a **knowing self-contradiction** —
ADR-010's new header bullet names `claude/skills-for-role.sh` while §Decision 5, out of scope, still
names `claude/fkit-claude.sh`. Task `0195` repairs it. **The lesson for this task is the opposite of
reassuring:** a scoped append can leave a document contradicting itself on one screen, so check ADR-032
for a **neighbouring** site the note's own wording will contradict, and say what you found — including
if the answer is "none".

**⛔ Do not sweep ADR-032's third `byte-unchanged` hit.** Its §Amendment states that
`fkit-process-stateful-review` is *"byte-unchanged"* — a **different subject**, not this defect. Its
truth is **not assessed** by this task either way. Leave it untouched.

#### ⛔ Item B — NOT IN SCOPE: the *"missing `Amended by: ADR-033`"* back-link does not exist

**The ruling's premise is false, verified firsthand 2026-07-31.** ADR-032's header **already carries**
the back-link, and has carried it since **2026-07-26** (commit `b86e5eb`) — five days *before* this
brief was filed. The header's `**Amended by:**` entry reads, in part:

> and [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) (Decision 3/5 close step —
> the driver spawns `@fkit-producer` to close and does **not** run the movers itself).

A **second** back-link sits in the body, closing the §Amendment's *"What this amendment does not
change"* paragraph. ADR-033's own header reciprocates (*"**Amends:** … ADR-032 §Decision 3/5"*).

**There is nothing to fix.** Item B is therefore **not** written into `## What to build` and **not**
verification-tested. It is recorded here only so the false *"Adjacent finding"* paragraph above cannot
be read as live, and so a future reader can see the claim was checked rather than skipped.

## What to build

1. **`claude/skills/fkit-sprint-ship-loop/SKILL.md`, the narrative passage** (the *"models its rigor,
   never invokes it"* paragraph) — replace the unscoped *"stays byte-unchanged"* with the chosen wording,
   preserving the true design fact that ADR-032's ripple required no edit to the task loop.
2. **`claude/skills/fkit-sprint-ship-loop/SKILL.md`, the `## Hard rules` bullet** *"Never invoke
   `fkit-task-ship-loop`"* — apply the **same** correction, consistently with site 1. **The rule itself
   is correct and must survive**: the task loop genuinely is session-only and genuinely refuses a spawned
   invocation. **Only the factual claim about the file being unchanged is stale** — do not weaken or drop
   the never-invoke rule while fixing the sentence attached to it.
3. **Record the wording decision and its reasoning in `worklog.md`**, including which of the three
   options was taken and why. The decision is the deliverable as much as the edit.
4. **Raise the ADR-032 question to the owner** rather than acting on it. Do not edit
   `ai-agents/knowledge-base/decisions/adr-032-*.md` in this task without an explicit ruling.
   > **⛔ SUPERSEDED 2026-07-31 — the ruling arrived; item 5 replaces this.** Kept as the record of what
   > was required before 2026-07-30. **The explicit ruling this item demanded now exists**, so ADR-032
   > *is* edited by this task — **append-only**, per item 5. Nothing else about item 4 survives.

5. **🆕 Append a dated note to `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md`**
   correcting the same stale claim there. *(Added 2026-07-31 under the owner ruling of 2026-07-30 — see
   the 🆕 section in Context for the ruling's provenance and the verified quotations.)*
   - **Append only. Never rewrite.** ADR-032 is an **accepted** ADR and therefore frozen record.
     **Do not edit the text of `## Decision` item 1, and do not edit the `## Consequences` → Positive
     bullet** — not to reword, scope, date, or delete. The three wording options in this brief apply to
     the **skill file only**.
   - **One note, covering both sites.** It must record that ADR-033 §Decision 3 falsified the
     *"byte-unchanged"* half of Decision 1's closing sentence; that the *"session-only"* half **stands**;
     and that the Consequences bullet *"`fkit-task-ship-loop` and every role stay untouched"* is stale
     for the same reason. Cite ADR-033 by name.
   - **Locate both sites by heading + quoted phrase** (`## Decision` item 1; `## Consequences` → Positive),
     **never by `:NNN`** — the `0160` constraint binds here too.
   - **Do not touch** ADR-032's §Amendment sentence about `fkit-process-stateful-review` being
     *"byte-unchanged"* — different subject, not this defect.
   - **Do not touch ADR-033** at all.
   - **Do not add an `Amended by: ADR-033` back-link** — ADR-032 already has one (Context, Item B). If
     the implementer finds it genuinely absent, that contradicts this brief: **stop and raise it**, do
     not add it silently.

**Dual-home:** `claude/scaffold/` holds **no skills tree** (verified — it contains only `AGENTS.md`,
`CLAUDE.md`, `ai-agents/` and `universal-rules.md`). `fkit-sprint-ship-loop/SKILL.md` is single-homed
under `claude/skills/`; there is **nothing to mirror**. The `.claude/skills/` copy is gitignored and
refreshed by `claude/fkit-claude-init.sh .` — **edit the canonical source in `claude/`, never the copy.**

## Verification steps

1. `grep -rn "byte-unchanged" claude/skills/fkit-sprint-ship-loop/SKILL.md` returns **no unscoped
   permanent-tense claim**. If the chosen option keeps the phrase, every remaining hit must carry an
   explicit scope or date. **A zero-hit result is not automatically success** — option 1 may legitimately
   retain the phrase in scoped form; read the hits, do not count them.
2. **The two other `byte-unchanged` hits under `claude/skills/` are byte-unchanged themselves.**
   `fkit-task-ship-loop/SKILL.md` uses the phrase twice about **different** subjects —
   `fkit-process-stateful-review`'s per-round gate, and the reviewer-owned findings section. **Neither is
   this defect. Do not sweep them.**
3. **Read the `## Hard rules` bullet in isolation.** The *never invoke / session-only* rule must still
   read as binding. A fix that softened the rule while correcting the claim **fails**.
4. **Read the narrative passage in isolation.** The design fact — that introducing the sprint driver
   required no edit to the task loop — must still be recoverable, unless option 2 was deliberately chosen
   and justified in the worklog.
5. **No new `:NNN` line-number citation appears in the diff.** Check the diff directly, not the files
   (`0160` Case 2 surface).
6. `worklog.md` records which wording option was taken and why.
7. **🆕 ADR-032's frozen text is byte-identical to `HEAD`.** `git diff` on
   `ai-agents/knowledge-base/decisions/adr-032-*.md` must show **additions only** — zero deleted or
   modified lines (`git diff --numstat` on that file shows a deletion count of **0**). **Any deletion
   fails this task**, whatever it improves. *(added 2026-07-31)*
8. **🆕 The appended note is present and correct.** It must, in one place: name **ADR-033** and its
   **§Decision 3**; say the *"byte-unchanged"* claim is **falsified**; say the *"session-only"* claim
   **stands**; and cover **both** sites — Decision 1's closing sentence *and* the `## Consequences` →
   Positive bullet *"`fkit-task-ship-loop` and every role stay untouched"*. A note covering only
   Decision 1 **fails**. Two separate notes **fail**. *(added 2026-07-31)*
9. **🆕 Read the appended note in isolation: it must not restate the claim in permanent tense.** No new
   unscoped *"stays / remains / is byte-unchanged"* assertion about `fkit-task-ship-loop` may appear in
   the note. Reproducing the defect in a fresher tense **fails**. *(added 2026-07-31)*
10. **🆕 Untouched-by-design checks on ADR-032 and ADR-033.** The §Amendment sentence calling
    `fkit-process-stateful-review` *"byte-unchanged"* is unchanged; ADR-032's `**Amended by:**` header
    is unchanged (it already lists ADR-033 — nothing was added); `git diff --stat` shows **no change at
    all** to `adr-033-*.md`. *(added 2026-07-31)*
11. **🆕 Step 5 applies to the ADR too:** no new `:NNN` line-number citation appears anywhere in the
    diff, including the appended ADR note. *(added 2026-07-31)*
12. `npm test` green. ⚠️ **the suite exceeds two minutes** — give it a generous timeout. **A run killed at
   the two-minute mark is not a green run and must not be reported as one.**

## Notes

- **⚠️ Priority 148 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **✅ Resolved — the owner confirmed the appended rank on 2026-07-31**, via
  `AskUserQuestion` in a live `/fkit-sprint-ship-loop` session. This is **this row's own ruling**,
  given separately from and later than `0168`'s and `0169`'s joint confirmation. The rank is
  **owner-confirmed**, no longer merely appended; the row did not move and nothing was renumbered.
  Because the merit and append positions coincide (below), the confirmation **adopts** the merit
  position rather than overriding it. The flag no longer reads unresolved.)*
  **On merit this belongs directly below `0169`**, because `0169`'s owner ruling is what created this
  task, the two concern the *same* sentence — `0169` relies on the claim not binding, this one repairs
  the claim itself — and this task soft-follows it so the wording can describe the file's final state.
  **The merit position and the append position coincide**, so confirming the append costs the owner
  nothing.
  It was appended under `/fkit-task-brief` step 5 by a **spawned** producer with **no owner channel**,
  which that step forbids from re-ranking. No existing row was renumbered.

  > ⚠️ **This flag is UNRESOLVED. No owner has ruled on this rank.** The 2026-07-31 ruling settled only
  > that the work be **filed as a task**, not where it sits on the board. The confirmed ranks recorded on
  > `0168` and `0169` are **their** rulings and **do not extend to this row** — do not read their
  > resolution wording onto this one.
  >
  > **⛔ SUPERSEDED 2026-07-31 (later the same day).** The block above is kept as written — it is the
  > accurate record of what was known when this brief was filed, and its reasoning was correct at the
  > time. It is now **false**: the owner subsequently ruled on this rank directly, in its own
  > `AskUserQuestion` decision, and the resolution note above governs. The block's warning that `0168`'s
  > and `0169`'s confirmations do not extend here **still stands and was never relied on** — this row's
  > confirmation is its own, not inherited.

- **Depends on:** nothing hard. The defect and both its sites exist in the file today and can be
  corrected now.
  **Soft-follows `0169`**, which edits `fkit-task-ship-loop` under the ruling that this claim does not
  bind. Landing `0169` first makes the staleness plainer and lets the new wording describe the final
  state. Either order works; neither blocks.
  **Soft-follows `0160`** (open) only in that this task must create no new `:NNN` citation surface — it
  sidesteps the collision by locating sites via headings and quoted phrases, so it does **not** wait on
  that ruling.

- **Blocks:** nothing.

- **⛔ Out of scope, hard:**
  - **Editing ADR-032**, or any accepted ADR, without an explicit owner ruling — open question above.
    > **🆕 2026-07-31 — narrowed, not lifted.** The owner ruling of 2026-07-30 brings ADR-032 **in
    > scope for an append only** (What to build item 5). **Rewriting any accepted ADR remains hard
    > out of scope**, ADR-032 included: appending is permitted, editing existing text is not.
  - **ADR-032's missing *"Amended by: ADR-033"* header back-link** — a real, separate gap; raise it, do
    not fix it here.
    > **⛔ MOOT 2026-07-31 — the gap does not exist.** ADR-032 has carried the ADR-033 back-link since
    > 2026-07-26 (Context, Item B). Nothing to fix and nothing to raise. **Adding one is out of scope**;
    > if it is ever found absent, stop and raise it rather than adding it.
  - The other two `byte-unchanged` uses in `fkit-task-ship-loop/SKILL.md` — different subjects, not
    stale.
  - **Any behavioral change to either loop.** This is a documentation-accuracy fix; the never-invoke and
    session-only rules stay in force.
  - **Any machine guard** that a skill's claims about other files stay true — `0152` / `0154` own the
    `SKILL.md` file walk.
  - The ADR-034 pointers — that is `0169`.

- **Defect class, for the record.** Third known instance of *a governing document asserting a fact about
  another file that is no longer true*: `0151` (`CLAUDE.md`'s stale `skills-for-role.sh` location) and
  `0159` (stale rank citations on the sprint board) are the prior two, both closed. If a fourth appears,
  the class likely warrants a machine check rather than another one-off task — **but that is a decision
  for its own task, not this one.**

- **Provenance.** Filed 2026-07-31 by a spawned `fkit-producer` at the end of a `/fkit-sprint-ship-loop`
  run, on the owner's `AskUserQuestion` ruling that the stale claim be filed as a task rather than left
  as a note. The producer had **no owner channel**; every coordinate and quotation above was re-derived
  firsthand from the files, not inherited from the driver's relay — which corrected the relayed
  single-site count to **two**.
