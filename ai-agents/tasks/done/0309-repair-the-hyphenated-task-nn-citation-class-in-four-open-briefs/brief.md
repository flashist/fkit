# Repair the hyphenated `task-NN` citation class — the form three consecutive sweeps could not see

## ID
0309

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### ⭐ Why this task exists — read this first, it is the whole point

Every sweep of the stale pre-ADR-029 task-numeral class was defined on the pattern `\btask [0-9]{1,2}\b`
— **a space between the word and the number.** ⛔ **That pattern cannot match `task-70`.**

So `0306`'s **brief**, its **plan**, and **every measurement taken in it** were blind to the hyphenated
form. ⭐ **And this was the third consecutive sweep with the same blind spot.**

⭐⭐ **The strongest single piece of evidence, and the reason this brief exists:**
[`0184`](../../backlog/0184-record-depends-on-blocks-as-the-binding-execution-order/brief.md) **appears in no
Shape-2 file list anywhere** — not the original brief's 13, not the build's 14. **It survived three
consecutive sweeps because all three measured the wrong pattern.**

⚠️ **And it is worse than the ledger recorded.** Re-derived on disk 2026-08-15:

```sh
grep -ciE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/0184-*/brief.md   # 0
grep -ciE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/0156-*/brief.md   # 0
grep -ciE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/0037-*/brief.md   # 0
```

⭐ **Three of the four affected briefs carry ZERO bare `task NN` today** — so they are invisible to the
spaced pattern entirely. `0184` and `0156` were **never** in any Shape-2 file list; `0037` was, and
`0306` repaired its spaced numerals, leaving only the hyphenated one. **The only reason `0226` was ever
looked at is that it happened to carry a spaced numeral too.**

⛔ **The lesson is the deliverable as much as the repair is:** a measurement that defines the class by
one syntactic form silently defines away everything else, and reports full coverage while doing it.

### Provenance

**Owner ruling, 2026-08-15**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, and relayed to a spawned producer. **The ruling is a selection from an option
list, so the option label is the verbatim text:**
**"File a brief for the whole hyphenated class (Recommended)"**.

**Parent task:** [`0306`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md),
closed 2026-08-15. **Authority for this residual:** that folder's
[`review.md`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md),
section *Accepted residuals*, row **R5 (string half)** — **as corrected by round-2 finding R8.**

⛔ **Do not scope from `0306`'s `worklog.md` §9.** It records this class as **7 occurrences**; the real
figure is **6**. (Worklog §6's own table lists exactly six rows, and its prose then says seven — ⭐ **the
same "an itemisation that does not sum to its stated total" defect the task was repairing**, reproduced
inside it.) The `review.md` residuals table is the authority.

⚠️ **Unranked, no sprint** — filed by a spawned producer with no owner channel, so this row **appends**
and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### The population, re-derived on disk 2026-08-15

⚠️ **Re-derived firsthand by the filing producer.** **Measurement context:** `HEAD` = `9360177`
(*"Sprint push"*), **dirty working tree** — `0306`'s brief edits are uncommitted, and this class's line
numbers depend on them.

```sh
grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ | wc -l
```

⛔ **The raw count is `14`, and `14` is NOT the defect population.** Of the 14, **8 are text `0306`
itself wrote** — a disclosure blockquote and a dated `## Notes` block in `0226` that **quote the string
in order to explain that it was deliberately left**. ⭐ **Those 8 are correct by construction and must
not be touched**; rewriting them would destroy the record of why the string survived.

**⛔ ONE MORE EXCLUSION, AND IT IS THIS BRIEF'S OWN FAULT.** This brief and its sibling
[`0308`](../../done/0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md) **both live
under `ai-agents/tasks/backlog/` and both quote hyphenated numerals throughout.** ⚠️ **A naïve re-run of
the command above will count them and report a much larger population.** **Exclude the `0308` and `0309`
folders from the measurement**, e.g.:

```sh
grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ \
  --exclude-dir=0308-* --exclude-dir=0309-* | wc -l
```

⭐ **This is the same trap `0306` fell into three times** — the artifacts of a task about a defect class
become instances of that class. **Say in the worklog which exclusions you applied and why.**

⚠️ **MEASURED, NOT PREDICTED — immediately after these three briefs were filed, 2026-08-15:**

| Command | Result |
|---|---|
| `grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ \| wc -l` | **45** |
| the same, `--exclude-dir='0308-*' --exclude-dir='0309-*'` | **14** ✅ |

⭐ **This brief alone contributes 28 of the 31 inflation; `0308` contributes 3; `0307` contributes 0.**
⛔ **So the exclusion is not a precaution — without it the population reads three times its true size.**
⚠️ **`0307` needs no exclusion today**, but check that before relying on it — a later edit could change it.

**The 6 real sites, across 4 open briefs:**

| Brief | Where — **anchor on the quote, not a line number** | Numeral | What it appears to mean |
|---|---|---|---|
| `0226` | `## Context` — *"This is the **task-70** failure mode recurring inside the very checklist that documents `0008`"* | `task-70` | **`0008`**, per `0306`'s dated note |
| `0226` | `## What to build` — *"Keep the **task-70** warning and its "add it HERE FIRST" instruction verbatim."* | `task-70` | **`0008`** |
| `0226` | `## Verification steps` — *"The **task-70** warning block and the "If you add a fifth mirror…" instruction are…"* | `task-70` | **`0008`** |
| `0037` | *"**pre-task-18** `--resume` passthrough. Neither touches `fkit-claude-init.sh`."* | `pre-task-18` | ⛔ **untriaged** |
| `0156` | *"qualifier already pinned by the **task-68** test at :1697."* | `task-68` | ⛔ **untriaged** |
| `0184` | *"A decorated variant is read as *no dependency* (the **task-84** misreport class)"* | `task-84` | ⛔ **untriaged — and see the term-of-art problem below** |

⚠️ **DISAGREEMENT WITH THE LEDGER, reported rather than smoothed over.** `review.md`'s R5/R8 rows cite
the `0226` sites as `0226:41`, `0226:161`, `0226:186`. **On disk today they are at `:41`, `:170` and
`:195`.** The reviewer's figures were correct when written; `0306`'s own disclosure blockquote (7 lines,
inserted at `:45`) shifted everything below it. ⭐ **A concrete instance of exactly the mutable-coordinate
defect `0160` ruled on** — and a reason this brief anchors on quoted text instead. ⛔ **Do not locate
these sites by the ledger's line numbers.**

### ⛔ Three of the six are NOT a simple find-and-replace

1. **`0184`'s `task-84` is a NAMED CLASS, not a citation.** *"the task-84 misreport class"* is a term of
   art used in **at least 9 live places** — `claude/skills/fkit-status/dashboard.sh`,
   `claude/skills/fkit-task-brief/SKILL.md`, `ai-agents/tasks/done/0132-*/brief.md`,
   `ai-agents/sprints/done/sprint-2.md` (archived), `ai-agents/wiki-vault/wiki/tasks/teach-dashboard-to-resolve-notes-dependencies.md`,
   and two `test/fixtures/closed-rank-0174-*.md` files. ⛔ **Renaming it in one brief breaks the name
   everywhere else and repairs nothing.** ⚠️ **Several of those sites are frozen or off-limits** — an
   archived sprint plan, a closed brief, the wiki vault (`fkit-wiki` writes only), and test fixtures
   whose bytes are the test. ⭐ **This site probably needs a note beside it, not a rewrite** — but
   **that is a judgement to make and record, not a conclusion this brief hands you.**
2. **`0037`'s `pre-task-18` is a compound, not a bare citation.** *"pre-task-18"* means *"before the
   task-18-era change"*. ⚠️ `task 18` also appears in `ADR-014` and in `dashboard.sh`'s grammar
   examples. ⛔ **Resolve what it refers to before deciding whether it is even stale.**
3. **`0156`'s `task-68` cites a test.** ⚠️ `task-68` also appears in
   `ADR-040` — **an accepted ADR, and therefore a frozen record.** ⛔ **Do not sweep into it.**

⛔ **`0226:41`'s pointer blockquote is IN SCOPE OF `0306` AND NOT PART OF THIS TASK.** `0306` fixed the
*disclosure distance* — a blockquote now sits immediately beneath the sentence, stating the shared
referent, the deliberate leave, and the ⛔ *"not `0070`"*. The reviewer confirmed that pointer is
correct and **does not belong in this brief**. ⛔ **Do not re-litigate it, and do not remove it.**

⚠️ **`claude/` also carries a hyphenated `task-26`.** It is **outside** this task's population and is
covered by [`0308`](../../done/0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md).
⛔ **Do not touch `claude/` here.**

### Does this wait on `0171`?

**No — and this brief states that as a considered answer, not an omission.**

[`0171`](../../done/0171-write-the-durable-citation-anchors-convention-page/brief.md) (*the
`durable-citation-anchors` convention page*, **closed 2026-08-22**) writes down a rule that is
**already ruled**: a task is cited by its folder-name `NNNN` prefix, always — ADR-029 Decision 3,
restated in `0160`'s decision report. ⭐ **`0171` documents that form; it does not decide it.** So the
repair form for these six sites is known today and this task is not gated.

⚠️ **Two riders, and both are real:**

- **If `0171` lands first, read it and follow it** — in particular `0160` §1.1's *"never cite a line
  number naked; pair every `path:NNN` with a quoted fragment"*, which bears directly on `0156`'s
  *"the task-68 test at :1697"*.
- ⭐ **This task should feed `0171`, not just consume it.** The hyphenated form is a citation shape the
  convention page will need to name, and **the fact that three sweeps could not see it is the strongest
  argument for writing the convention at all.** ⚠️ **Surface this to the owner** — whether `0171` should
  pick it up is the owner's call, and this task must not edit `0171`'s brief or its output.

### 🆕 SCOPE ADDITION — OWNER RULING 2026-08-22: `0171` HAS LANDED, AND THE PROSE THAT CALLS IT OPEN IS THIS TASK'S

> ⚠️ **Read this section before the one above it.** The section *"Does this wait on `0171`?"* was
> written 2026-08-15 and calls `0171` *"in progress as Sprint 6 P2"*. **That is no longer true, and
> the sentence is deliberately left byte-identical** — it is itself one of the sites this addition
> covers. Both of its riders are now discharged: `0171` **did** land first, so *"read it and follow
> it"* is not conditional any more; and the feed-back to `0171` is moot.
>
> - ⚠️ **DATED CORRECTION 2026-09-03 — THE SENTENCE IS NO LONGER BYTE-IDENTICAL.** `0356` repaired
>   that section under step 8; it now reads **"closed 2026-08-22"**. The paragraph above describes
>   the **pre-repair** state and is kept as the record of why the site was left standing until then.

**Authority.** Owner ruling **2026-08-22**, given live via `AskUserQuestion` in an `fkit lead`
session driving `/fkit-sprint-ship-loop` and relayed to a spawned producer — **the option label is
the verbatim text: "Fold into 0309 (Recommended)"**. Its description, verbatim:

> *"0309 is already open and already repairs stale cross-brief citations — this is its class. 0310's
> step 9 is a one-line glob fix best made by whoever implements 0310. Tradeoff the producer named: no
> owner-visible artifact until 0309 runs, so if 0309 slips these stay stale."*

**Provenance.** Residual (a) of `0171`'s close: the closing producer repaired every **href** that
pointed at `0171`'s old `backlog/` path, but left the surrounding **prose** byte-identical, so seven
places still describe `0171` as open or in progress.

**Verified on disk 2026-08-22:** `0171`'s folder is
`ai-agents/tasks/done/0171-write-the-durable-citation-anchors-convention-page/` and its brief's
`## Status` reads `✅ Done (agent-closed — not owner-verified)`. ⛔ **`0171` is NOT reopened, moved or
re-statused by this task, and its folder is not edited.**

#### The sites — re-measured firsthand 2026-08-22, anchored on quoted text

⚠️ **The `:NNN` coordinates in the ruling drifted and are NOT reproduced here.** Anchors are file +
heading + quoted fragment, per
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
row 3 and its *"never cite a line number naked"* rider — which `0171` itself shipped.

**A. Inside `ai-agents/tasks/backlog/` — squarely in this task's existing scope:**

| Brief | Heading / region | Quoted fragment — **the durable anchor** |
|---|---|---|
| `0310` | `## Context` → `### ⭐ Why this exists — it stopped being a tidiness problem and became a blocking one` | *"and P2 ([`0171`](…), still `🔄 In progress`), and filed four briefs."* |
| `0287` | `## Notes` | *"The convention page itself is not yet written — that is [`0171`](…), still open — so this is stated inline rather than cited."* |
| `0262` | `## Notes` | *"[`0171`](…) is the open task for the convention page."* |

**B. ⭐ FOUND BY RE-MEASUREMENT — NOT IN THE RULING'S LIST, AND ALSO INSIDE `backlog/`:**

| Brief | Heading / region | Quoted fragment |
|---|---|---|
| `0307` | `## Context` → the `0171` bullet | *"the `durable-citation-anchors` convention page, **in progress as Sprint 6 P2**"* |
| `0307` | `## Notes` → `- **Relates to:**` | *"`0171` (the citation convention in progress)"* |
| `0308` | `## Notes` → `- **Relates to:**` | *"`0171` (the `durable-citation-anchors` convention page, in progress)"* |
| **`0309` — THIS BRIEF** | `## Context` → `### Does this wait on `0171`?` | *"(*the `durable-citation-anchors` convention page*, **in progress as Sprint 6 P2**)"* |
| **`0309` — THIS BRIEF** | `## Notes` → `- **Relates to:**` | *"`0171` (the `durable-citation-anchors` convention page, in progress — **this task feeds it and is not gated by it**)"* |
| `0232` | `## Notes` → the dated **2026-08-15** correction blocks | *"⚠️ **`0171` itself is still open and unclosed**"* and *"⚠️ **`0171` is still open and unclosed** as of this note"* |
| `0172` | `## Notes` | its dependency-declaration bullet, whose value reads *"0171 (the convention page this bullet points at)."* ⛔ **See the warning below — this one is NOT prose.** |

> ⚠️ **The `0172` row above deliberately DESCRIBES the declaration instead of quoting it verbatim,
> and that is not sloppiness.** An earlier draft of this brief quoted the bold `Depends on` label
> literally; `dashboard.sh` matches that label **mid-line**, so the quotation was parsed as **this
> task's own dependency** and the board rendered `derive 0309 depends="0171 (the convention page this
> bullet points at)…"`. ⭐ **The `task-84` misreport class, fired by a brief about citation defects,
> inside the very table listing the defect.** ⛔ **Do not "restore" the verbatim quote.** Per
> `dashboard.sh`'s own note, a brief may discuss the field in prose or a code span — never as the
> bold label.

⛔⛔ **`0172`'S SITE IS A LIVE DEPENDENCY DECLARATION, NOT PROSE, AND IS THE MOST DANGEROUS ENTRY IN
THIS TABLE.** `dashboard.sh` parses the bold dependency label to derive a task's Next-step. `0172` declares
a hard dependency on a task that is now `✅ Done`. ⚠️ **Editing it changes what the board renders**,
and `0184` owns the declaration form while `0307` owns the question of how a corrected declaration
reaches the derive cell. ⛔ **Do not "repair" it as if it were a sentence. Triage it, record what the
board renders for `0172` before and after, and if the right move is anything other than leaving it
alone, say why in the worklog.**

⚠️ **Several sites in table B sit inside DATED observations** (`0232`'s two are inside explicitly
dated 2026-08-15 correction blocks; `0310`'s is inside a *"Today's `/fkit-sprint-ship-loop` run is
the evidence"* passage). ⛔ **A dated observation that was correct when written is not automatically a
defect** — that is the open question
[`0301`](../../backlog/0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)
exists to settle. **Where the claim is dated, the correct repair is a dated note beside it, never a
rewrite** — the form `0306` and `0143` established, and `## What to build` step 5 above already says
so.

✅ **Conditional phrasings are NOT sites and must not be swept.** Sentences of the shape *"if `0171`
lands first, read it and follow it"* or *"if this is picked up while `0171` is still open"* — present
in `0237`, `0308`, `ai-agents/sprints/backlog.md` and `ai-agents/sprints/sprint-6.md` — are **still
true as written**; a conditional whose antecedent is now settled is stale *guidance*, not a false
*claim*. ⛔ **Do not convert them.** ⚠️ **This is a judgement, recorded so it can be overturned, not
a measurement.**

#### ⛔⛔ FOUR OF THE RULING'S SEVEN SITES COLLIDE WITH THIS BRIEF'S OWN `⛔ Out of scope` LIST — AND THAT IS NOT RESOLVED HERE

**The collision, stated plainly:**

| Site | Where it lives | The rule it hits |
|---|---|---|
| `0261`, `## Notes` — *"[`0171`](…) is the open task for the convention page."* | `ai-agents/tasks/done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md` | ⛔ *"any closed brief"* is out of scope; **verification step 7** requires **nothing** under `ai-agents/tasks/done/` |
| `0263`, `## Notes` — same fragment | `ai-agents/tasks/done/0263-wiki-resync-after-the-sprint-4-archival-and-sprint-5-open/brief.md` | the same two |
| Backlog board row for `0307` — *"(in progress, Sprint 6 P2) does NOT gate this"* | `ai-agents/sprints/backlog.md` | ⛔ *"No sprint plan edited"*; **verification step 7** requires **nothing** under `ai-agents/sprints/` |
| Backlog board row for `0310` — *"(still `🔄 In progress`) and filed four briefs with **nothing committed**"* | `ai-agents/sprints/backlog.md` | the same two |

⛔ **The filing producer did NOT widen the `⛔ Out of scope` list or verification step 7 to admit
them.** Doing so would silently rewrite acceptance criteria that were themselves written under
earlier rulings, on a spawned agent's judgement, with no owner channel. **The four sites are recorded
here so nothing is lost; they are NOT authorised work.**

⚠️⚠️ **THE IMPLEMENTER'S INSTRUCTION IS THEREFORE:** repair tables **A** and **B** (all inside
`ai-agents/tasks/backlog/`, all already in scope). ⛔ **Leave the four colliding sites alone and name
each of them in the close report as an accepted residual**, so the next reader sees them. **Escalate
the scope question to the owner; do not decide it in the run.**

#### Residual (b) — `0310`'s verification step 9 now passes vacuously. ⛔ NOT FIXED HERE.

`0310`'s `## Verification steps` step 9 reads, in part: *"`git diff --stat` shows **no change** under
`ai-agents/tasks/backlog/0171-*/`"*. **That glob now matches nothing** — `0171` is in
`ai-agents/tasks/done/` — so the guard is **vacuously true** and would pass even if the run trampled
`0171`'s folder.

⛔ **The owner ruled this fix belongs to whoever implements `0310`, not to this task** — verbatim:
*"0310's step 9 is a one-line glob fix best made by whoever implements 0310."* ⛔ **Do not edit
`0310`'s verification step here.** It is recorded in this brief only because this task edits
`0310`'s `## Context` prose and the implementer will be reading that file anyway. **`0310`'s
implementer: this is your one-line fix — re-point the glob at `ai-agents/tasks/*/0171-*/`, or
whatever form re-arms the guard.**

## What to build

1. **Re-derive the population** with the exclusion above, and **state which exclusions you applied.**
   ⛔ **Do not carry this brief's `6` forward unverified** — state your own number, and if it differs,
   **say this brief was wrong.**
2. **Widen the pattern beyond both known forms and report what you find.** ⛔ **The lesson of this task
   is that the pattern was the bug.** Sweep the open briefs for at least: `task_NN`, `taskNN`,
   `Task NN` / `Task-NN` (case), `tasks NN`, and the **line-wrapped** form (`tr '\n' ' ' | tr -s ' '` —
   ⚠️ the squeeze is mandatory, the continuation line's indent survives a bare join). **Report the
   result even if it is zero** — ⛔ **an absence claim must be measured, not assumed.**
3. **Triage each site.** For the three untriaged numerals (`task-18`, `task-68`, `task-84`), resolve
   what each actually refers to **by reading the surrounding context**, and record it. ⛔ **Do not
   resolve by arithmetic.**
4. **For `task-84`, decide and record whether the term-of-art is repaired or annotated**, given the 9
   cross-references and the frozen ones among them. ⛔ **Do not rename it unilaterally across files this
   task does not own.**
5. **Apply the repair** to each site classified as stale, using the folder `NNNN` form. ⚠️ **Where a
   line must stay byte-identical, use a dated correction note beside it** — the form `0306` and `0143`
   established.
6. **Report the after-state** and state the ceiling: what this run did **not** cover.

**🆕 Steps 7–9 are the 2026-08-22 scope addition** (see `## Context` → *"🆕 SCOPE ADDITION"*). ⚠️
**They are a SECOND, SEPARATE class from steps 1–6** — steps 1–6 repair a stale *citation form*
(`task-NN`); steps 7–9 repair a stale *status claim* about `0171`. ⛔ **Do not merge the two
measurements, the two triage tables, or the two before/after counts.**

7. **Re-derive the stale-`0171`-status population yourself**, across `ai-agents/tasks/backlog/`
   **only**. ⛔ **Do not carry tables A and B forward unverified** — they were measured 2026-08-22 at
   `HEAD` `9360177` against a dirty tree. **State your own count and, if it differs, say this brief
   was wrong.** ⚠️ Use the whitespace-normalised form (`tr '\n\t' '  ' | tr -s ' '`, then match) —
   several of these phrases wrap across lines — and **record the stated limits of that form**
   (table cells, wording drift, inline emphasis) alongside the result.
8. **Triage every site into one of four dispositions, and record which and why for each:**
   **(a)** plain stale prose → repair to the landed state; **(b)** inside a **dated** observation →
   ⛔ **leave the text byte-identical and put a dated note beside it** (the `0306`/`0143` form);
   **(c)** a **conditional** whose antecedent is now settled → ⛔ **leave alone** (still true as
   written) unless you argue otherwise in the worklog; **(d)** `0172`'s
   `- **Depends on:** 0171` → ⛔ **a live dashboard declaration, not prose** — see the warning in
   `## Context`; record what `dashboard.sh` renders for `0172` **before and after**, and justify any
   change.
9. **Name, in the close report, each of the four colliding sites** (`0261`, `0263`, and the two
   `ai-agents/sprints/backlog.md` rows) **as an accepted residual left untouched, with the rule that
   put it out of scope.** ⛔ **A close report that omits them fails this step.**

**⛔ Out of scope:**

- ⛔ `claude/` (that is `0308`), the archived `sprints/done/sprint-2.md`, any closed brief, any accepted
  ADR, `test/fixtures/`, and `ai-agents/wiki-vault/` (**`fkit-wiki` writes only, ADR-005**).
- ⛔ **No `## Status` edit on any task.** No task file moved. No sprint plan edited.
- ⛔ **Nothing under `ai-agents/tasks/done/0306-*/`** — those four files are frozen.
- ⛔ **No `dashboard.sh` change.**

## Verification steps

1. The worklog records the **before** and **after** result of
   `grep -rInoiE '\btask-[0-9]{1,2}\b' ai-agents/tasks/backlog/ --exclude-dir=0308-* --exclude-dir=0309-*`,
   **and names the exclusions applied.**
2. The worklog carries a **triage table with one row per occurrence found**, and its row count equals
   the before-count. ⛔ A shorter table fails this step.
3. **The widened-pattern sweep (step 2) is recorded with its commands and its result — including a
   stated zero.**
4. **The `0226` pointer blockquote is unchanged.** `git diff` over
   `ai-agents/tasks/backlog/0226-*/brief.md` shows no deletion inside the `📌 **2026-08-15 (`0306`)`
   blockquote, and no change to the dated `## Notes` block.
5. **`task-84`'s disposition is recorded with a reason**, and if it was left, the reason names the
   cross-reference count.
6. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md >/dev/null; echo $?` → `0`,
   and the same for `ai-agents/sprints/backlog.md`; `grep -c '^drift ' ` on both renders is unchanged
   from before the run.
7. `git diff --stat` shows changes **only** under `ai-agents/tasks/backlog/`, and **nothing** under
   `claude/`, `ai-agents/wiki-vault/`, `ai-agents/sprints/`, `ai-agents/tasks/done/` or `test/`.
8. **No `## Status` line changed anywhere:** `git diff -U0 | grep -E '^[-+].*## Status' ` is empty.

**🆕 Steps 9–13 verify the 2026-08-22 scope addition** (`## What to build` steps 7–9).

9. The worklog carries a **SECOND, SEPARATE** before/after measurement and triage table for the
   stale-`0171`-status class, **with one row per site found**, its own commands, and its own count.
   ⛔ **A single merged table covering both classes fails this step.**
10. **Every row of that table carries one of the four dispositions** from `## What to build` step 8,
    **with a reason.** ⛔ *"Repaired"* with no disposition fails.
11. **`ai-agents/tasks/done/0171-…/` is untouched:** `git status --porcelain` shows nothing under it,
    and `0171`'s `## Status` is byte-identical.
12. **`0310`'s verification step 9 is UNCHANGED** — `git diff` over
    `ai-agents/tasks/backlog/0310-*/brief.md` shows no edit inside `## Verification steps`. ⛔ **Its
    vacuous glob is the `0310` implementer's fix, by owner ruling; touching it here fails this step.**
13. **The close report names all four colliding out-of-scope sites** (`0261`, `0263`, and the two
    `ai-agents/sprints/backlog.md` rows) as residuals left untouched, each with the rule that
    excluded it — **and `git diff --stat` confirms nothing under `ai-agents/tasks/done/` or
    `ai-agents/sprints/` changed** (this is step 7, re-stated because the scope addition is exactly
    where a run would be tempted to break it).

## Notes

- **Depends on:** nothing.
- **Relates to:** `0308` (the `claude/` sibling of this class — **read its exclusion note, it applies
  here too**), `0307` (the third `0306` residual), `0171` (the `durable-citation-anchors` convention
  page, closed 2026-08-22 — **this task fed it and was not gated by it**), `0176` (the coordination-citation
  policy guard), `0184` (an affected brief **and** the owner of the `task-84 misreport` name).
- ⚠️ **`0184` is both a repair target and an open task with its own scope.** ⛔ **Repair only the
  citation; do not touch its `## Status`, its declarations, or its re-scoping block.**
- ⚠️ **Figures in this brief were re-derived at `HEAD` = `9360177` on 2026-08-15 against a DIRTY working
  tree.** They are a dated observation, not a permanent fact. **Re-derive before acting.**
- ⛔ **Do not commit, push, `git add` or `git stash`** unless the owner explicitly asks.

**🆕 Added 2026-08-22 with the scope addition. Nothing above this line was edited.**

- ⚠️ **DATED CORRECTION 2026-09-03 — THE BULLET BELOW DESCRIBES THE PRE-REPAIR STATE.** `0356`
  repaired **both** sites it names under step 8: the `- **Relates to:**` bullet above now reads
  *"closed 2026-08-22"*, and so does the `### Does this wait on `0171`?` section. ⛔ The note below
  is kept as the record of why they were left standing until then — it is **not** a current
  description of either site.
- ⚠️ **The `- **Relates to:**` bullet above still calls `0171` *"in progress"*, and that is
  DELIBERATE.** It is one of the sites listed in table B of the scope addition, left byte-identical
  so the implementer repairs it under `## What to build` step 8 rather than finding it already gone.
  The same is true of the `### Does this wait on `0171`?` section. ⛔ **Do not read either as a
  current statement of `0171`'s status:** `0171` is `✅ Done (agent-closed — not owner-verified)` in
  `ai-agents/tasks/done/`, verified 2026-08-22.
- ⚠️ **This task now carries TWO defect classes, folded by owner ruling, not by merit.** The
  hyphenated-`task-NN` citation class (steps 1–6) and the stale-`0171`-status class (steps 7–9) are
  independently shippable and would normally be two briefs. ⛔ **The fold is the owner's ruling of
  2026-08-22, verbatim label "Fold into 0309 (Recommended)" — do NOT re-split it**; a split is a
  question for the owner, not a decision for the run.
- ⚠️ **The tradeoff the owner accepted, recorded verbatim so it is not rediscovered as a surprise:**
  *"no owner-visible artifact until 0309 runs, so if 0309 slips these stay stale."*
- ⚠️ **Figures for the scope addition were measured 2026-08-22** at `HEAD` = `9360177` against a
  **dirty working tree with a live `fkit-wiki` worker writing `ai-agents/wiki-vault/`**. Dated
  observation, not permanent fact. **Re-derive before acting.**
- ⚠️ **AN OPEN SCOPE QUESTION WAS RAISED AND DELIBERATELY NOT TAKEN — see `## Context` → *"FOUR OF THE
  RULING'S SEVEN SITES COLLIDE"*.** Whether this task's `⛔ Out of scope` list and verification step 7
  should widen to admit `ai-agents/tasks/done/` and `ai-agents/sprints/backlog.md` is **the owner's
  call**. Until they rule, those four sites stay untouched and get named as residuals.
- ⛔ **`0310`'s vacuous verification-step-9 glob is recorded here but is NOT this task's to fix** —
  owner ruling 2026-08-22 assigns it to `0310`'s implementer.
