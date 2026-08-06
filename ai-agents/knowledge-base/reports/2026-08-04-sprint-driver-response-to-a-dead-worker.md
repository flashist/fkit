# Ruling — what the sprint driver does when a spawned worker dies

- **Date:** 2026-08-04
- **Task:** [`0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies`](../../tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/brief.md)
- **Author:** fkit-architect, spawned as the **Build** worker by `/fkit-sprint-ship-loop` in a live
  `fkit lead` driver session. **No owner channel** (ADR-021) — every open question below is returned to
  the driver, not asked.
- **Plan:** `<task-folder>/plan.md`, approved by the owner via `AskUserQuestion` on 2026-08-04
  ("Approve as planned"). Read byte-exact before any work: `wc -c` = **20369**, `git hash-object` =
  `ba9a6976cb78964dd5a4d580c9f1711291aa2f19`. Both confirmed against the declared pointer.
- **Change surface — stated at two scopes, because they differ.** **This worker (the Build spawn) wrote:**
  this file, plus the task folder's `worklog.md`. **The task as a whole also created**
  `<task-folder>/plan.md` — written by the **driver**, not by me, at plan approval before the Build spawn
  (`fkit-sprint-ship-loop` §*Durable artifacts*, the **Plan** row). §11's recorded baseline shows it as
  `?? plan.md`. **Beyond those three, nothing else:** no skill, agent, brief, board, ADR, convention page
  or vault file was written. No task moved. No status changed. No commit.
- **Amendment history — stated because this file has had more than one author, and one round is
  unattributed.** (1) **Build**, `fkit-architect` — the original ruling. (2) **A round-1 review-correction
  round whose author is UNESTABLISHED** — it applied R1/R3–R10 and the three owner dispositions, and its
  hand-off never landed; the next worker could not attribute it and did not claim it (`review.md`
  §*Coder response*, provenance block). **That round is instance 3 of this report's own subject matter**
  (§1). (3) **Process-review**, `fkit-coder` — re-measured every finding firsthand and repaired two false
  corrections inherited from round (2). (4) **This amendment**, `fkit-architect`, 2026-08-04 — folds
  instance 3 into the evidence base by owner ruling; it wrote **this file and the task folder's
  `worklog.md`, and nothing else.** (5) **A dated correction note at §4**, `fkit-producer`,
  **2026-08-05** — appended on a named owner ruling (`AskUserQuestion`, live driver session, disposition
  **D3**) recording that §4's **partial**-case status ruling is **superseded** by what `0208` shipped.
  ⛔ **Append only: no line of §4 was edited**, and a pointer to the note sits under §4's heading. It
  wrote **this file and nothing else** — no board, no ADR, no vault file, no task moved, no commit.
  *(Item (4)'s "This amendment" refers to the 2026-08-04 instance-3 round, not to this one.)*
- **Citation form:** `0160`'s ruling has landed and binds this report. `claude/skills/*/SKILL.md` is
  cited by **section heading and row name**; where a line number appears it is **paired with quoted
  text**, never naked. `0111`'s review ledger sits frozen under `done/` and is line-cited, which
  verification step 3 requires.

---

## 0. The four rulings, in four lines

Read these first; §§2–5 carry the reasoning and the limits.

1. **Q1 — what the driver must do.** **Read disk first — it is the only oracle — then classify the disk
   state into *three* states, not two: `nothing landed` / `a complete unit landed` / `a partial unit
   landed`.** Complete → the driver enumerates landed-vs-outstanding itself and resumes, re-spawns or
   defers. Partial → **stop and put it to the owner.** Nothing landed → **the driver does not decide
   alone; it reports and puts the choice to the owner.**
2. **Q2 — may a resumed worker self-report?** **No. That is the rule, not an accident.** The driver
   establishes what landed from disk itself and *tells* the resumed worker. Two independent grounds
   support it; only one of them is the `fkit-task-ship-loop` analogy, and the analogy is the weaker one.
3. **Q3 — does the exit table need a row, and what status?** **Yes, one row** — but only for the branch
   where the driver stops driving that task. The status is **state-dependent, and both values are already
   in the vocabulary**: `🚧 Blocked — <reason>` when anything landed; reset to `🔲 Backlog` when nothing
   landed.
4. **Q4 — one row, or the missing durable-state section?** **Both, in one follow-up task, and they must
   ship together.** The row closes an invariant breach; the doctrine is what the row points at. **No
   broader ADR is needed** — see §7.

**And the two rulings the brief asked for outside the four questions:**

- **The *"fkit has no crash-recovery anywhere"* claim does NOT stand as written** (§6). It is false as a
  blanket and true in the narrower sense R6 meant. **R6's acceptance survives on the corrected
  rationale** — it is sound, not mistaken.
- **R6's reading: `adjacent uncovered failure`.** Not a re-raise, not swallowed. **Therefore no ADR is
  required and none was written** (§7).

> ⚠️ **Added 2026-08-04 by owner ruling — a THIRD instance of the failure occurred during this task's own
> ship (§1). No ruling above is reversed.** Q1's **step 1** is refined: *"read disk first"* must say
> **which disk**, because instance 3's driver read disk and still misclassified a partial landing as
> *"nothing landed"* (§2's addendum). Q2 is **strengthened** — first case where a successor needed a dead
> worker's account and could obtain it neither by asking nor from history (§3). **Q3, Q4, §6 and §7 are
> unchanged**, checked rather than assumed — §1 states per ruling what instance 3 moves and what it does
> not.

---

## 0.1 ⚠️ Read before the rulings — the brief's evidence has decayed, and one claim in it is now FALSE

This is recorded as a **finding**, not a footnote. It is a live instance of exactly the class task
`0160` ruled on, occurring inside the very task that `0160` binds.

### The false claim — do not carry it forward

The brief states, under *"The prior art the ruling must reconcile"*:

> **`fkit-sprint-ship-loop/SKILL.md` has no such section at all.**

**That is now false.** The file carries `## Durable artifacts` — a three-row table (`plan.md` /
`worklog.md` / `review.md`) declaring them git-tracked, owner-committed, and moving with the folder.

**The brief's *deeper* claim survives, and is what this report answers.** Verified by reading the whole
file: the sprint loop has **no** *"does NOT trust its own memory"* framing, **no** *"re-derives its
position on every resume"*, **no** *"Fail-safe on resume"*, and its `## Durable artifacts` section
**cites no resume-doctrine ADR** — specifically, it never cites ADR-020.

> ⚠️ **Correction, round 1 review (R4).** An earlier draft of this sentence said that section *"cites no
> ADR at all."* **That was false, and it is the same over-broad-claim class §0.1 exists to catch.** The
> section cites **three** ADRs: `ADR-029` (the `<task-folder>` definition line) and `ADR-032 A2` /
> `ADR-019` (the `worklog.md` row). What it does **not** cite is ADR-020 — the resume-doctrine authority
> — and that narrower claim is the one Q4 is answered against. Verified 2026-08-04: `/usr/bin/grep -n
> 'ADR-020' claude/skills/fkit-sprint-ship-loop/SKILL.md` → **one hit, line 120**, in the **Plan** row of
> §2's drive table, as the authority for the driver writing `plan.md` — not as a resume doctrine.

**So the accurate current statement, which Q4 is answered against, is:**

> **The sprint loop anchors its artifacts but has no resume doctrine over them.**

That is a **narrower and more interesting** gap than the brief describes. A ruling written against the
brief's blanket claim would have answered a question that no longer exists.

### The coordinates that moved

The brief's citations were taken firsthand on 2026-07-30. Re-verified against the working tree on
2026-08-04:

| Brief's citation | Brief claimed | Actual, 2026-08-04 | Status |
|---|---|---|---|
| `fkit-sprint-ship-loop/SKILL.md`, whole file | 255 lines | **296 lines** | shifted |
| §*Stop conditions — the driver's exit table*, `:204-214` | the nine rows | heading `:243`; rows `:247-255` | shifted ≈ +43 |
| *"no path ends in silence"*, `:216-217` | the invariant | `:257` | shifted |
| *"Mark the task `🔄 In progress` first"*, `:95-97` | §2 | `:112` | shifted |
| `worklog.md` in the Build / Process-review rows, `:102`, `:105` | drive table | `:121`, `:124` | shifted |
| §*Progress reporting*, `:226-230` | section | `:266-267` | shifted |
| `fkit-task-ship-loop/SKILL.md:87-109`, §*Durable state* | section | heading `:92`; section `:92-116` | shifted +5 |
| *"Fail-safe on resume"*, `:108-109` | the quote | `:113-114` | shifted |
| `0111/review.md:76-79` — R6 accepted residual | the quote | `:76-79` | **holds ✅** |
| `0111/review.md:92-94` — suppressed as settled | | `:92-94` | **holds ✅** |

**All nine exit-table row names are present and unchanged.** The two citations that held are both into a
**frozen ledger under `done/`** — which is precisely the split `0160` predicts, and is independent
corroboration of its rule rather than a coincidence.

### A second decay, inside the approved plan itself

The plan's **risk 5** told me the working tree was already dirty across `ai-agents/wiki-vault/` and
`ai-agents/sprints/backlog.md`, plus two untracked backlog folders (`0214`, `0215`), and to scope
verification step 7 around that baseline. **Measured at the start of this run, that baseline had already
changed** — the owner committed in between. The actual pre-work baseline is recorded in §11 and is
*cleaner* than the plan anticipated. The plan's mitigation was still correct in kind; its specific
figures were one commit stale within hours of being written.

**Why this belongs in the report rather than a footnote:** two artifacts in this task's own chain — the
brief and the plan — both decayed between authorship and execution, on a horizon of days and hours
respectively. That is the strongest available argument for `0160`'s rider, and it was produced without
looking for it.

### One tension inside `0160` itself, surfaced for its follow-up

The plan directed me to cite `fkit-sprint-ship-loop/SKILL.md` **by section heading and row name, never
by line**, on the reasoning that it is a living document a third party edits. I followed that, and it is
the safer form.

**But `0160`'s own table does not say that.** Its row 1 rules:

> | A source file, test, **skill** or agent file, cited in a design doc or a finding | **`path:NNN` is
> correct** | edits arrive as a reviewed diff **to the thing you cited** … |

and its **R22 scope correction** flags that same row as the one that *"bundles two uses that answer
differently"* — a finding is a claim (safe), a design-doc citation is a pointer (the one-question test
says unsafe, the table says correct). **This report is a design doc citing a skill file, which is exactly
the unresolved half of row 1.**

I took the stricter form and lost nothing by it. **But `0160`'s follow-up 1 — the convention page —
should resolve row 1 rather than copy it,** or the next architect will face the same fork with less
warning. Named as follow-up 6 in §10.

---

## 1. Method, and what is and is not checkable

**Every claim below was verified on 2026-08-04, by me, with the method printed beside it.**

- Sweeps used `/usr/bin/grep` explicitly. In this environment bare `grep` is a shell wrapper that honors
  `.gitignore` and silently drops paths — measured at 96 files versus 119 on one recursive query. **No
  unqualified "zero hits" appears in this report**; every empty result names the command and the paths
  it covered.
- Directory listings used `/bin/ls` (`/usr/bin/ls` does not exist on this host).
- ⚠️ **Emphasis inside block quotes is sometimes MINE, not the source's — read every quoted `**bold**` as
  *emphasis added* unless stated otherwise.** The quoted **words** are unaltered in every case; only the
  bolding is added, and in two places a markdown link in the source is flattened to plain text. Flagged
  as one class by round-1 review (R10) and accepted as a residual there. Recorded here rather than
  per-quote because this report labels several quotations *"verbatim"* / *"quoted in full"*, and those
  labels should not be read as covering the typography.

### The gap is confirmed still open

**Command:** `/usr/bin/grep -n -iE 'crash|died|dies|dead|terminat|abnormal|529|overload|no response|resume|SendMessage|heartbeat|lease|stale' claude/skills/fkit-sprint-ship-loop/SKILL.md`

**Result: nine hits, none of them about abnormal termination.** They are the close-repair branch under
§4 *Close posture* and the `Blocked — hand-off didn't land` row (`stale`, `deadlock`), the `Owner
decision pending` row (*"resume on the answer"* — the **owner** resuming, not a worker), and the
`Sprint drained` row. **`SendMessage`, `crash`, `died`, `terminated`, `abnormal`, `529`, `overloaded`,
`heartbeat` and `lease` return zero hits in that file.**

**A worker that returns nothing is nowhere in the sprint loop's text.** The brief's core finding stands.

### The three instances, and how far each is checkable

> ⚠️ **Instance 3 was added on 2026-08-04, after the round-1 review, by owner ruling** (`AskUserQuestion`,
> *"Add instance 3 to the report, then re-review"*). It occurred **during this very task's own ship**. It is
> the only instance whose partial landing is corroborated on disk, and it is the first one that shows the
> failure this report's Q1 exists to prevent — **committed by a driver that did read disk.**

| | Instance 1 — `0118`, coder Build worker | Instance 2 — wiki worker, 2026-07-30 | Instance 3 — `0167`'s own Process-review worker, 2026-08-04 |
|---|---|---|---|
| **What is claimed** | died mid-verification; its write had already landed; driver read `git diff --numstat` then the file, confirmed placement, resumed the same agent via `SendMessage` | died twice; death 1 left one complete coherent edit + two pieces unwritten; death 2 produced nothing; driver read disk both times, judged the vault coherent, deferred the remainder | died mid-step when **the owner's network connection dropped** (owner-reported). It had already written the R1/R3–R10 corrections and the three owner dispositions **into this report**; its hand-off never arrived, so the ledger's `## Coder response` stayed the reviewer's empty scaffold and the worklog gained no Process-review section. **The driver read disk and concluded *"nothing landed"*. That was false** — this was a **partial landing**, the branch Q1 routes to the owner. It re-spawned instead. |
| **On-disk corroboration** | **NONE.** `/bin/ls -la ai-agents/tasks/done/0118-…/` returns exactly two files — `brief.md` and `review.md`. **No `worklog.md`, no `plan.md`.** A `/usr/bin/grep` for `crash\|529\|overload\|resume\|SendMessage\|died\|terminat` over that `review.md` returns **one** hit, at `:127`, and it is a reference to `0111`'s residuals — not to any death. | **THE ARTIFACT ONLY.** `git show --numstat 7616585` (2026-07-30) → `4  0  ai-agents/wiki-vault/wiki/systems/testing-and-verification.md`. Exactly the `+4/−0` the brief claims. ⚠️ **But `7616585` is a 17-file, 1747-insertion `"Tasks update"` commit** — the `+4/−0` is that *one file's* numstat, **not** the commit's. An earlier draft of this cell said *"1 file changed, 4 insertions(+)"*, which described the commit and was wrong (R4/R6 class). | **THE LANDING AND ITS PARTIALITY — yes. THE CAUSE — no.** Measured 2026-08-04: (a) the corrections **are** on disk — §0.1 carries the R4 block, §2 the R6 block, §2(c) the R1 block, §6 the R5 block, §2 *Limits* the R8 bullet, §11 the R9 correction; (b) the ledger's own header declares its scope as *"(primary, **716 lines**, new)"* while the file it reviews has since outgrown that declaration, and its round-1 findings' coordinates no longer resolve — its **R3** row cites a line number for §11's step-6 row, and that line now holds an unrelated section heading while the row itself sits far below it. **The deliverable demonstrably grew after the ledger was written.** ⚠️ **No coordinate, count or delta measured against *this* report is printed here, by standing rule** (round-2 review, R13/R18; recorded as an accepted residual in this task's `review.md`). An earlier draft of this cell printed three such figures and **all three were false by the time they were read** — the file kept growing under them. **The stable property is what carries the claim:** the ledger declares a length its subject has outgrown, and its coordinates miss. The *outstanding* half — an empty `## Coder response`, a 200-line worklog — is no longer measurable, because the re-spawned worker filled both; it rests on that worker's contemporaneous record (`review.md` §*Coder response*, the provenance block; `worklog.md` §*Process-review worker — round 1*, *State found on arrival*). |
| **Evidential weight** | **Declared testimony only.** Usable, labelled as such, never as verification. | **Split: n=1 for the ARTIFACT, n=0 for the PROCESS.** The commit proves *what landed and that it is coherent*. **No commit can prove** that a worker died, that the driver read disk **before** forming a belief, or **why** it deferred. Those three remain declared testimony, exactly as for instance 1. | **Split, and it splits differently from instance 2.** **Corroborated:** that a landing occurred, and that it was **partial** — the strongest form available for an untracked file, and recorded by an **independent second agent** that measured before acting rather than by the party that died. **Testimony:** the **cause** (owner-reported network drop) — no artifact records why a process stopped. **The misclassification, and it splits too** (round-2 review, R12): **corroborated on disk** — that a partial landing was there when the driver acted; **testimony** — that the driver concluded *"nothing landed"*, and which probes it ran. **No artifact records the belief**, and the re-spawn is consistent with either belief. Read §1's per-half standing table, not this cell alone. |

**The brief's own warning was right and is stronger than it stated.** It said instance 1 *"should be
confirmed against `0118`'s folder before being relied on"*. It was confirmed against that folder, and
the folder holds nothing.

**One thing instance 2's diff shows that no prose could.** The four inserted lines are **one semantic
unit** — a single bullet plus its three nested blockquote continuations, all about the wrapped-`grep`
finding. That is a genuinely *coherent* landing, not four lines that happen to parse. The coherence
judgment the brief describes was therefore a real judgment about a real unit, and it was correct.
*(It is also, with some irony, the exact vault entry that mandates the `/usr/bin/grep` discipline this
report is written under.)*

### ⚠️ The evidence standing, restated after instance 3 — read this instead of the old n=1 line

**Superseded statement, kept so the change is visible.** Before instance 3 this section read: *"One
instance is checkable. One is testimony. A shape confirmed on one verifiable instance plus one
unverifiable one is a shape confirmed on n=1."* **That was accurate when written and is now too narrow.**

**The accurate standing, stated per half rather than as a single number — because the halves differ:**

| What is being evidenced | Standing | On what |
|---|---|---|
| **A landing occurred, and was coherent** — ⚠️ **at FILE level; the two instances are not coherent in the same sense** | **two instances** | instance 2's commit (coherent as a *unit* — see §2(b)); instance 3's corrections, present on disk and demonstrably later than the ledger that reviewed the file — **file-coherent, and its UNIT torn** (§2(b)). The row counts file-level coherence only |
| **A landing was PARTIAL — the branch Q1 routes to the owner** | **one instance, corroborated for the LANDED half only** | **instance 3 only.** The landed half is on disk. ⚠️ **The *outstanding* half is no longer measurable** — the re-spawned worker filled it — and rests on that worker's contemporaneous record. Instance 2's first death left work *unwritten*, which is missing work, not a torn hand-off |
| **A driver misclassified the disk state — the LANDING half: a partial landing was on disk at the moment the driver formed its belief** | **one instance, corroborated on disk** | **instance 3 only.** The corrections are on disk and demonstrably later than the ledger that reviewed the file. **This is the strongest on-disk corroboration in this report** — see the finding below |
| **A driver misclassified the disk state — the BELIEF half: that the driver concluded *"nothing landed"*, and which probes it ran** | **one instance, DRIVER-REPORTED testimony** | **instance 3 only, and it is testimony, not evidence.** ⚠️ **No artifact records the belief or the four probes** — they are the driver's own account (§1's finding below prints it as *"Driver-reported"*). **The re-spawn does not discriminate:** under Q1 a *complete*-unit landing also routes to *"resumes, re-spawns, or defers"*, so the action taken is consistent with either belief. Downgraded from *"directly evidenced"* by round-2 review (R12) |
| **The CAUSE of any death** | **zero instances** | all three are testimony. No artifact records why a process stopped |
| **The driver's PROCESS — that it read disk *before* forming a belief, and why it chose as it did** | **zero instances**, unchanged | as §2's R6 correction already states |

**So the honest movement is narrow and worth stating exactly:** the three-state classification is no
longer grounded purely in reasoning about the cases. **Its *partial* branch has now been exercised on
disk** — by a failure to take it. **Nothing else in the standing moved**, and no ruling rests on the
cause of any death.

### The instance-3 finding: reading disk is necessary and is NOT sufficient

**This is the finding, not the anecdote.** The driver in instance 3 did what Q1's step 1 says. It read
disk. It still got the answer wrong. Driver-reported, 2026-08-04, it ran: `/bin/ls -la` over the task
folder; a listing of the ledger's `^## ` headings; `wc -l` over the worklog; `git status --porcelain`.
**All four are real disk reads, and none of them could have detected what had landed:**

1. **It enumerated the *task folder*. The deliverable is not in the task folder.** This report lives under
   `ai-agents/knowledge-base/reports/`. A worker's output is not obliged to sit beside its brief, and here
   it did not. **The enumeration covered every artifact except the one the work was.**
2. **`git status` carried no signal, and could not have.** Verified 2026-08-04:
   `git ls-files --error-unmatch <this report>` → *"did not match any file(s) known to git"*, and
   `git status --porcelain` reports it `??`. **`??` is what it printed before the landing and after it.**
   The same is true of this task's `plan.md`, `worklog.md` and `review.md` — all four are untracked, so
   **no worker deliverable in this task carried a git landing signal.** ⚠️ **Not *"no part of this task's
   surface"* (corrected, round-2 review R14):** the task's `brief.md` **is** tracked and reads ` M` —
   re-verified 2026-08-04 — and §11's own re-measured baseline says so (*"four of the five lines are
   `??`"*). The tracked path is the one no worker writes; **every artifact a worker produces here is
   untracked**, which is what the finding needs. `git status` is a *tracking* report,
   not a landing detector; over an untracked deliverable it is blind by construction.
3. **Listing `## ` headings measures presence, not content.** The ledger's `## Coder response` heading
   existed as the reviewer's empty scaffold. A heading list returns it either way. **A structural probe
   cannot answer a content question.**
4. **`wc -l` over the worklog was correct and was answering about the wrong file.** The worklog genuinely
   had not moved. That true measurement is exactly what made *"nothing landed"* feel supported.

**The rule this yields — recorded in §2 as an addendum to Q1's step 1:** *read disk first* must say
**which disk**. The driver must enumerate **the deliverable itself, wherever it lives**, not the task
folder as a proxy for it, and must not treat `git status` as evidence of absence for an untracked path.

### The cause taxonomy widens — and no ruling moves

This report's sweeps and §2(a) frame worker death around **API-side** failure (`529`, overload,
liveness). **Instance 3's cause was client-side: the owner's network connection dropped** (owner-reported).
**So the taxonomy has at least two classes, not one:**

| Class | Instance | Who fails | Visible to the driver? |
|---|---|---|---|
| **API-side** — overload / `529` / model unavailability | 1, 2 (as reported) | the provider | no — the driver sees only a worker that returned nothing |
| **Client-side** — the owner's connectivity to the session drops | 3 | the local network | no — **identical from the driver's seat** |

**This changes no ruling, and the reason it does not is the point.** Every ruling here is conditioned on
**the disk state after the death**, never on the cause. The driver cannot observe the cause — the two
classes are indistinguishable from where it sits — so a rule keyed to cause would be unusable. **Recording
the second class matters anyway**, because it removes a tempting inference: *"the API is healthy, so no
worker can have died"* is false, and instance 3 is the counterexample.

### What instance 3 moves, and what it does not — stated explicitly so nobody has to guess

| | Moved by instance 3? | |
|---|---|---|
| **Q1** (§2) | **Refined, not reversed** | the *partial* branch gains its first disk-corroborated exercise **and** its necessity is demonstrated by the failure to take it; step 1 gains the addendum above. The three-state classification itself is unchanged |
| **Q2** (§3) | **Strengthened** | first case where a successor actually **needed** a dead worker's account and it was unavailable **in both directions** — see §3's addendum |
| **Q3** (§4) | **No change** | instance 3's driver never exited the task, so no exit row fired and no status was written. The row's trigger and both status values are untouched |
| **Q4** (§5) | **No change** | the recommendation is still the row plus a resume doctrine, shipped together. Instance 3 adds *content* to that doctrine (§2's addendum, carried into §10 follow-up 1) but changes nothing about **whether** it should be written |
| **§6 — *"no crash-recovery anywhere"*** | **No change** | that adjudication turns on `lease` / `heartbeat` / stale-task reclamation, none of which instance 3 bears on |
| **§7 — R6's reading, and no ADR** | **No change, and this was checked rather than assumed** | R6's four grounds all hold for instance 3: a **spawned worker** died while **the driver survived** (different actor); **no task was stranded** — `0167` stayed in flight and is being shipped (different harm); R6's *Re-raise only if* trigger — *"stranded in-progress tasks become a recurring operational problem"* — **still did not occur**. **Owner-ruled 2026-08-04: no ADR. R6's acceptance survives** |

⛔ **Instance 3's re-spawn is narrative fact, not a rule.** The driver re-spawned a fresh Process-review
worker after misreading the disk. **This report does not generalize that into a retry rule, and §8's
exclusion binds this section exactly as it binds every other.** No count, no limit, no backoff is written
or implied here.

---

## 2. Q1 — What must the driver do when a spawned worker terminates abnormally?

### Answer

**The driver MUST, in this order:**

**1. Read disk before forming any belief about what happened.** Not "first among recommended steps" —
**the only possible first step.** The brief's honest limit is exact and I adopt it verbatim: a driver
cannot distinguish *died before writing* from *died after writing but before reporting*, because the
worker's final message is precisely the artifact that did not arrive. There is no other oracle.

**2. Classify the disk state into THREE states, not two.**

| Disk state | What it means | What the driver does |
|---|---|---|
| **Nothing landed** | the work surface is byte-identical to before the spawn | **Do not decide alone. Report and put the choice to the owner.** |
| **A complete unit landed** | one or more self-contained units are on disk; nothing is half-written, **and nothing on disk depends on a path that is missing** — the remainder is *separable* work | **The driver itself enumerates landed-vs-outstanding from disk**, then resumes, re-spawns, or defers — carrying that enumeration into the prompt (§3) |
| **A partial unit landed** | a file is half-written; a unit is torn | **Stop and put it to the owner.** No agent may guess whether torn state is safe to build on. |

**3. Whichever branch it takes, write status in both locations** — the brief's `## Status` and the sprint
row. The invariant binds (§4).

> ⚠️ **ADDENDUM to step 1, added 2026-08-04 by owner ruling, after instance 3 (§1). The ruling is refined,
> not reversed — and the refinement is not cosmetic: a driver followed step 1 as written and still
> misclassified.**
>
> **"Read disk first" does not say WHICH disk, and that gap is where instance 3 failed.** Step 1 therefore
> carries three obligations it did not state:
>
> **(i) Enumerate the DELIVERABLE, wherever it lives — not the task folder as a proxy.** A worker's output
> is frequently not inside `<task-folder>/`. Instance 3's was under `ai-agents/knowledge-base/reports/`; the
> driver listed the task folder, found it unmoved, and concluded *"nothing landed"* over a landing sitting
> one directory away. **The paths to enumerate are the ones the spawn instruction told the worker to write** —
> which the driver knows, because it wrote that instruction.
>
> **(ii) `git status` is NOT a landing detector for an untracked path.** An untracked file reads `??` before
> a write and `??` after it. Verified 2026-08-04: this report, and this task's `plan.md`, `worklog.md` and
> `review.md`, are **all** untracked — `git ls-files --error-unmatch` on the report returns *"did not match
> any file(s) known to git"*. For such paths the driver must compare **content** — length, section content,
> mtime — never tracking state.
>
> **(iii) A structural probe cannot answer a content question.** Listing a file's `## ` headings shows a
> section **exists**; it cannot show whether the section is **filled**. Instance 3's ledger heading
> `## Coder response` was present as an empty scaffold and was counted as present.
>
> **What this does NOT change: the three states, the routing of each, and the outcome of every instance
> classified in this report.** **The partial branch is vindicated, not amended** — instance 3 is precisely a
> partial landing, and the harm followed from failing to detect it, not from the branch being wrong.
> Carried into §10 follow-up 1 as binding constraint (4).
>
> ⚠️ **One definition IS narrowed, and an earlier draft of this clause wrongly claimed none was**
> (corrected, round-2 review **R11**). As first written, **complete** (*"nothing is half-written"*) and
> **partial** (*"a file is half-written; a unit is torn"*) were **not disjoint on instance 3**: no file was
> half-written, so instance 3 satisfied *complete* as literally worded while §1 classifies it *partial* —
> and the two branches route differently (**complete** → the driver decides alone; **partial** → stop and
> ask the owner). **The `complete` row therefore gains one clause: *nothing on disk depends on a path that
> is missing*.** **This is disambiguation only. No ruling outcome moves:** instance 3 was already routed
> *partial* by §1 and still is; instance 2's first death stays **complete** — its landed bullet stands on
> its own with the unwritten remainder never arriving (§2(b)), which is exactly what the new clause tests
> for. **The operational test that makes the two decidable is written into §10 follow-up 1, constraint
> (4)** — it belongs in the SKILL, not here.

### Evidence — the brief's shape, tested per instance

The brief proposed: *inspect disk before anything else; establish whether the partial state is coherent
or incoherent; then resume, re-spawn, or defer.* Tested, clause by clause:

| Clause | Instance 1 (`0118`) | Instance 2, death 1 | Instance 2, death 2 |
|---|---|---|---|
| **inspect disk first** | holds **as reported** (`git diff --numstat`, then the file) | holds **as reported** — no artifact can show *when* the driver read disk | holds **as reported** — disk was read and found unchanged |
| **coherent vs incoherent** | holds **as reported**; unverifiable | **holds, VERIFIED** — the `+4/−0` is one semantic unit; this is the one clause a commit *can* establish | **⚠️ does not apply** — see below |
| **resume / re-spawn / defer** | *resume*, as reported | *defer*, **as reported** — the commit shows the remainder absent, never the reason | *defer*, but not on coherence |

> ⚠️ **Correction, round 1 review (R6). An earlier draft marked instance 2's *inspect disk first* and
> *defer* cells "holds, verified". They are not verified and cannot be.** `7616585` establishes **the
> landed artifact and its coherence** — nothing about the process that produced it. **The correct split is
> n=1 for the artifact, n=0 for the process**, and it does not disturb the ruling: the *Limits* below
> already grounded the three-state classification in *"reasoning about the cases, not in three observed
> cases."*

**Where the shape fails, named as verification step 2 requires:**

**(a) The nothing-landed case. The middle test does not discriminate.** "Coherent vs incoherent" is a
binary over *partial* state. Nothing-landed is not partial; it is **empty**. Calling empty state
"coherent" is technically true and practically misleading — it routes the driver toward *"coherent →
proceed or defer"* when the correct reading is *"no progress was made at all."*

**And this is the branch that matters most, because of what actually decided it.** The driver's input on
instance 2's second death was not coherence. It was **the second consecutive failure** — a liveness
judgment about the API. That judgment is squarely inside the territory this task is forbidden to write a
rule for. **So the honest ruling is that the driver does not decide the empty case: it escalates.** That
is an escalation rule, not a retry rule, and it is already the loop's native posture — the exit table's
`Owner decision pending` row exists for exactly this and the brief records that the owner *"made [the
judgment] live on both occasions."*

**(b) The genuinely-incoherent branch has ZERO evidence behind it.** Neither instance produced torn
state. Instance 2's first death left two pieces *unwritten*, which is missing work, not half-written
work. **The branch the shape most needs to get right is the one never exercised.** It is ruled
`stop and ask the owner` on principle — cheapest to reverse, destroys least — and that ruling is
reasoning, not evidence. Marked as such.

> ⚠️ **Correction, 2026-08-04 (instance 3). The paragraph above is true of a torn FILE and false of a torn
> UNIT — the distinction was not drawn and has to be.** Instance 3 left **no half-written file**: this
> report was internally coherent at every moment. What it left torn was the **unit of work spanning several
> files** — the deliverable edited, the ledger's response and the worklog's section absent. **So the
> standing is: a torn *file* — still zero instances, and the `stop and ask the owner` ruling for it remains
> reasoning rather than evidence. A torn *multi-file unit* — one instance, corroborated (§1).**
>
> **This makes the partial branch more load-bearing than the paragraph above implies**, because the
> multi-file form is the one that actually occurs, is the harder of the two to see, and is exactly what
> instance 3's driver missed. **A driver checking only *"is any file half-written?"* answers **no** on a
> torn unit and routes it to the wrong branch.**

**(c) "Resume the same agent" hides a mechanism assumption.** Instance 1's whole recovery turns on
resuming a worker via `SendMessage`. **`SendMessage` is named in no *governing* fkit document — no skill,
no agent definition, no knowledge-base page.** Measured 2026-08-04:

- `/usr/bin/grep -rn 'SendMessage' claude/` → **no hits, exit 1.** Re-verified after this report was
  written; still exit 1.
- `/usr/bin/grep -rn 'SendMessage' ai-agents/knowledge-base/` → **no hits, exit 1** — ⚠️ **measured
  2026-08-04, before this report was written into `reports/`. Re-running it now self-matches:** it
  returns exit 0, and **every hit is inside this very file — no other knowledge-base file matches**
  (re-verified 2026-08-04 after the round-1 review corrections landed:
  `/usr/bin/grep -rln 'SendMessage' ai-agents/knowledge-base/` → this file, and only this file).
  ⚠️ **No hit count is printed here, deliberately.** The count is self-referential — it changes with
  every edit to this file, and a figure recorded here was already stale once. **The stable,
  load-bearing claim is the property — *no hit outside this report* — not a number.**
  **The command is preserved with its timestamp rather than deleted or re-scoped**, because the original
  measurement is the evidence and the self-match is an artifact of where the report was filed.

> ⚠️ **Correction, round 1 review (R1). An earlier draft concluded *"`SendMessage` is named in no fkit
> document"* — broader than the two sweeps above support, and false.** It appears in
> `ai-agents/sprints/sprint-2.md` (this task's board row and its trailing notes) and in this task's own
> `brief.md`, `plan.md` and `worklog.md`. **But every one of those is a record *of this gap*, not
> documentation *of the mechanism*** — they describe the undocumented resume, which is the finding.
> **The substantive point stands and follow-up 2 is unchanged:** no skill or knowledge-base page
> sanctions, defines, or bounds `SendMessage` as a worker-resume mechanism.

Whether a worker that terminated abnormally is still addressable at all is undocumented, and the
one instance that relied on it is the one with no disk record. Named as follow-up 2.

### Limits

- **n=1.** See §1. The three-state classification is *better grounded* than the two-state one, but it is
  grounded in reasoning about the cases, not in three observed cases.
  > ⚠️ **Amended 2026-08-04 (instance 3), and only this far.** The **partial** state is no longer
  > reasoning-only: it has now been observed and corroborated on disk (§1). The **nothing-landed** and
  > **complete** states are still grounded in reasoning about the cases. **Read §1's per-half standing
  > table rather than any single n.** Note the direction of the evidence: instance 3 supports the partial
  > branch by showing what a driver does wrong **without** it, which is weaker than a case where the branch
  > was taken and worked — that case has still not occurred.
- **The classification assumes "unit" is legible.** For a wiki page edit it was. For a torn source file
  mid-refactor it may not be, and the driver is not a reviewer. The `stop and ask` branch absorbs that,
  at the cost of stopping more often than strictly necessary.
- **This ruling writes no rule about how many times anything is re-spawned.** See §8.
- ⚠️ **"Byte-identical to before the spawn" is a *comparison*, and this ruling does not say against what
  baseline — follow-up 1's implementer must close that.** Raised by round-1 review (R8). The gap is
  real and narrow:
  - **The driver writes into the same tree while driving.** It sets `🔄 In progress` in **both** locations
    at the start of driving the task (`fkit-sprint-ship-loop` §2, *"Mark the task `🔄 In progress`
    first"*) and writes `<task-folder>/plan.md` at plan approval (§*Durable artifacts*, the **Plan** row).
  - **Those two writes precede the Build spawn, so they belong INSIDE the baseline, not outside it.**
    (A stronger objection — that a tracked task can *never* be byte-identical because of the
    `🔄 In progress` write — was raised and is **disproven** for exactly this reason.)
  - **What survives:** the ruling never tells the driver to *capture* a per-spawn baseline, nor to
    restrict the comparison to **worker-owned paths**. A driver that instead asks *"is this task's tree
    dirty?"* will answer **yes** on a spawn that produced nothing, and misroute an empty attempt into the
    *anything-landed → `🚧 Blocked`* branch — the precise error this classification exists to prevent.
  - **The fix is mechanical, and belongs in the SKILL rather than here:** record the comparison point at
    spawn time and diff worker-owned paths against *it*.

---

## 3. Q2 — May a resumed worker be trusted to report what it already did?

### Answer

**No — and it is the rule, not an accident.**

> **The driver establishes landed-vs-outstanding from disk itself, and states it to the resumed worker.
> It never asks a worker what it already did.**

This holds for a worker resumed by `SendMessage` exactly as for a freshly re-spawned one. The
mechanism of resumption is irrelevant; the reason is about what the dead context can know.

### Evidence — two independent grounds, of unequal strength

**Ground A (decisive, and NOT an analogy): a worker that died mid-turn cannot in principle know whether
its last write landed.** The failure is located exactly at the boundary between *wrote* and *reported
wrote*. Its self-report is not merely untrusted — **it is not available as evidence**, because the
information the driver needs is the information the worker lost. This ground stands alone and needs no
doctrine behind it.

**Ground B (supporting, and an *a fortiori* — say which it is):** `fkit-task-ship-loop/SKILL.md`,
§*Durable state — the loop does NOT trust its own memory*:

> A SKILL.md holds no memory across turns or context compaction, and this loop runs long autonomous
> stretches. It anchors to durable, git-tracked, task-id-keyed files and **re-derives its position on
> every resume** (ADR-020)

and its fail-safe:

> **Fail-safe on resume:** if the loop cannot establish from these files that a gate was passed, it
> **returns to the nearest owner gate** — it never infers a plan approval it cannot evidence.

**Stated plainly, because the plan required it: this doctrine is about a loop distrusting its OWN
memory, and extending it to "do not trust your subordinate's report" is not an entailment.** It is,
however, stronger than a bare analogy — it is *a fortiori*. If a context may not trust its own
**continuous** memory, it certainly may not trust a **second** context's account of what a **third**,
externally-truncated context did. The rule is the *weaker* claim under the same principle. **It
generalizes; it does not follow.**

### The ADR-037 complication, which cuts in an unobvious direction

ADR-037 (*a skill rule binds a spawned worker unless the instruction relays a named owner ruling*)
post-dates the brief and does bear on this.

Consider a driver that tells a resumed worker *"here is what landed; do not re-derive it yourself."* If
that worker's own skill mandates re-derivation from durable artifacts, **that instruction is a collision
in ADR-037's precise sense**, and ADR-037 §2 resolves it against the driver:

> **Instruction carries no named owner ruling → SURFACE THE COLLISION AND TAKE THE CONSERVATIVE
> BRANCH.** Follow the skill rule … *Conservative* means the branch that is cheapest to reverse and
> destroys the least

and ADR-037 §3 forbids the driver from issuing it in the first place:

> `fkit-sprint-ship-loop` (and any agent spawning a typed fkit worker) **must not issue an instruction
> into the territory of a rule in the skill the worker will run without naming the owner ruling it
> relays.**

**So the correct construction of the rule is narrower than "the driver's enumeration is authoritative":**

> **The driver's enumeration is an INPUT to the resumed worker — never a substitute for the worker's own
> re-derivation where its skill mandates one.**

Both parties end up reading disk, which is the safe outcome and costs one redundant read. A future
author of the resume doctrine (§5) **must not** write *"trust the driver's enumeration and skip your
fail-safe"* — that is an instruction into skill-rule territory, and ADR-037 §3 forbids the driver from
issuing it.

### Limits

- Both instances are consistent with the rule, but **neither tests it**: in neither case was a worker
  *asked* to self-report and *believed*. The rule is confirmed by absence, which is weaker than
  confirmation by trial.
  > ⚠️ **Amended 2026-08-04. Instance 3 (§1) is a third instance, and it does more than sit consistent with
  > the rule — it is the first case where a successor genuinely NEEDED the dead worker's account, and the
  > account was unavailable in BOTH of the only two ways it could have been obtained.**
  > **(1) It could not be asked.** The worker was gone. Ground A is no longer only an argument about what a
  > dead context can know — a live successor tried to establish what its predecessor had done and had no
  > party to ask.
  > **(2) Its AUTHORSHIP could not be reconstructed from the artifact either.** The deliverable is
  > **untracked** (verified 2026-08-04, §1), so there is **no git history to attribute the edits to**. The
  > successor recorded the author as *unestablished* and explicitly declined to claim the work
  > (`review.md` §*Coder response*, provenance block).
  > ⚠️ **Note precisely which half this sub-point is about** (sharpened, round-2 review **R15**). What the
  > missing history withholds is **attribution**. **Landed-vs-outstanding — the thing Q2's rule actually
  > concerns — WAS successfully derived from disk**, as the next paragraph says. So (2) must not be read as
  > *"the artifact yielded nothing"*: it yielded exactly what the rule needs and nothing about whose work
  > it was. **The "strengthened" verdict rests on (1)** — the account could not be asked for — **not on
  > (2).**
  > **What it therefore establishes, and what it does not.** It establishes that the driver's
  > disk-derived enumeration is not a stylistic preference but **the only channel that survives the
  > failure** — with the worker gone and the history absent, disk content was the sole remaining evidence.
  > It still does **not** test the rule by trial: no worker was asked and believed. **Confirmation by
  > necessity, not by trial** — stronger than the absence this bullet originally recorded, weaker than a
  > trial.
  > **And an unadvertised consequence, worth naming because it cost real work:** the successor
  > re-measured all ten findings firsthand rather than trusting the landed corrections, and **found two of
  > them factually false** — both printed counts, both since replaced with stable properties (`review.md`
  > §*Coder response*, rows **R2** and **R3**). **Nothing but independent re-measurement caught them.** The
  > enumeration rule protects the driver's belief; it does not validate an unattributed worker's *content*,
  > and this report should not be read as claiming it does.
- Ground B's *a fortiori* is a reasoning step, not a citation. A reader who rejects it still has ground
  A, which is sufficient.

---

## 4. Q3 — Does the exit table need a row, and what status does the task carry?

> ⛔ **PARTIALLY SUPERSEDED 2026-08-05 by owner ruling — read the dated correction note at the end of
> *Answer, part 2* before relying on this section's status ruling.** The **partial** case's status was
> overturned; the **nothing-landed** case, the row's necessity and its narrowed trigger are unchanged.

### Answer, part 1 — yes, one row, with a narrower trigger than the brief implies

**Yes.** §*Stop conditions — the driver's exit table* states:

> **Invariant — no path ends in silence.** Every exit writes accurate status in **both** the brief's
> `## Status` **and** the sprint row, and ends in an owner-visible report.

A worker death that ends a task's drive **is an exit**, and no row covers it. **That is a live breach of
a stated invariant in the shipped file**, not an undocumented case — the brief is right about this, and
§1's sweep confirms the file contains no abnormal-termination language at all.

**But the trigger must be narrower than "a worker died."** A death the driver recovers from — instance 1,
as reported — produces **no exit**: the task continues and closes normally. The row is needed only for
the branch where the driver **stops driving that task in this run**. Precisely:

> **`Worker terminated abnormally — remainder deferred`** — *Trigger:* a spawned worker returned nothing
> and the driver is not continuing this task in this run.

### Answer, part 2 — the status is state-dependent, and both values are already in the vocabulary

**This is the one sub-question with genuine candidates, so it gets the candidate treatment.**

| | **A — `🚧 Blocked — <reason>`** | **B — reset `🔄 In progress` → `🔲 Backlog`** |
|---|---|---|
| **Vocabulary text** | *"Started, cannot proceed. **A reason is mandatory.**"* — set by *"Anyone — freely"* | *"Scoped and filed, **not picked up**. The default on creation."* |
| **Precedent in the file** | §4 *Close posture* and three exit rows already write `🚧 Blocked — <reason>` | the `Plan rejected` row: *"**reset the task `🔄 In progress` → `🔲 Backlog`**"* |
| **True when something landed?** | **Yes** — work started and cannot proceed | **No.** It would assert *"not picked up"* over a task with half-finished work on disk |
| **True when nothing landed?** | Overstates — nothing is actually obstructed | **Yes** — the task genuinely was not advanced |
| **Reversibility** | high — any session may clear it | high — but loses the fact that a death occurred, unless reported |

**Ruling — use both, keyed to Q1's classification. No value is minted; both appear in
`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`:**

- **Something landed** (complete or partial) → **`🚧 Blocked — worker terminated abnormally: <what
  landed, what is outstanding>`.** The reason is mandatory and the enumeration is what makes the block
  actionable by someone other than the driver.
- **Nothing landed** → **reset `🔄 In progress` → `🔲 Backlog`** and add the task to the per-run skip set,
  exactly as the `Plan rejected` row does — **and report**, because the escalation of §2 still applies.

> ⛔ **DATED CORRECTION NOTE — 2026-08-05, owner-ruled. The `Something landed` bullet above is
> SUPERSEDED for the PARTIAL case. Append only; no line above was edited, and the ruling as written on
> 2026-08-04 is preserved so the change is visible.**
>
> **Marker legend, per `0143`/ADR-010:** ⚠️ = a fact that drifted, the decision untouched; ⛔ = a
> decision that was overturned — do not follow it.
>
> **What was overturned.** The bullet above sends **partial** to
> `🚧 Blocked — worker terminated abnormally: <what landed, what is outstanding>`, together with
> complete. **Task `0208` shipped a different ruling for the partial case, and the owner ruled the
> divergence correct** (`AskUserQuestion`, live `/fkit-sprint-ship-loop` driver session, **2026-08-05**,
> disposition **D3**, reconfirmed on the R1/R3 reconciliation).
>
> **What now holds for the partial case:**
>
> > **The task stays `🔄 In progress` while the owner is asked. No *terminal* status is written,
> > because a pause is not an exit.**
>
> **Why.** The driver is still holding the task open; writing a terminal status over a task it has not
> released would make the board lie in the other direction — the same *"a status is only true if it is
> current"* rule this section already invokes, applied to the opposite error. The `stop and put it to
> the owner` routing of §2's partial branch is **unchanged**; only the status written on that branch is.
>
> **⚠️ Scope of this correction — read the boundary, it is narrow:**
> - **`🚧 Blocked — <reason>` remains fully legal in general.** Nothing is removed from the vocabulary,
>   no value is minted, and `conventions/task-status-vocabulary.md` is untouched. It is simply **not
>   written on this one branch**.
> - **The `Nothing landed` bullet is UNCHANGED** — reset `🔄 In progress` → `🔲 Backlog`, skip set,
>   report. `0208` ships it as its branch 1.
> - **The `complete` case is unchanged**, and `0208`'s review narrowed it further in this section's own
>   direction: where **every** path the spawn instruction named was discharged, the drive **continues**
>   and the exit row does not fire at all (`0208` review row **R2**, verdict CORRECT).
> - **Part 1 of this answer — that the row is needed, and its narrowed trigger — is unchanged.** So is
>   the *Reconciliation with `## Durable artifacts`* subsection below.
> - **§5's ruling that the row and a `## Resume doctrine` section must ship together is NOT reversed by
>   this note.** It was **deferred** by owner ruling OQ-1 → A on 2026-08-05: `0208` shipped the row
>   alone on the condition that the doctrine half be filed as its own brief, which it now is —
>   `0228-write-the-resume-doctrine-section-into-the-sprint-loop`.
>
> **⚠️ A cost this correction creates, recorded rather than smoothed.** Parking a paused task at
> `🔄 In progress` **widens the exposure** of the crash/idle stranding residual (`0111` **R6**,
> owner-ruled accept 2026-07-22): §1 of the sprint loop skips `🔄 In progress` on every later run, so a
> paused task is not reclaimed. `0208`'s review recorded this as *"noted, not re-raised"* — §7's
> re-raise trigger (*"stranded in-progress tasks become a recurring operational problem"*) is still
> unmet, **zero** stranded tasks across all three instances. **The exposure is now wider by design**,
> and that is the fact that would eventually trip the trigger.
>
> **Where this is recorded on the other side:**
> `ai-agents/tasks/done/0208-add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop/review.md`
> — *Accepted residuals*, the entry beginning *"⛔ NEW (recorded 2026-08-05, owner-ruled at R3) — the
> shipped row DIVERGES from `0167` §4's written status ruling"*, and row **R3** (verdict CORRECT: the
> row's original *justification* was a defect and was fixed; **the behaviour was never challenged**).
> That residual's re-raise condition — *"D3 is revisited, or `0167` §4 is amended"* — **is discharged by
> this note**, not re-litigated.
>
> **Filed by `fkit-producer`, spawned by `/fkit-sprint-ship-loop` with no owner channel, on the named
> owner ruling above. No commit was made.**

**The main tradeoff of this split:** a reader of the board cannot tell a nothing-landed death from a
plan rejection, since both leave `🔲 Backlog`. That is accepted: the vocabulary's job is to describe
*state*, and the state genuinely is identical. The *event* is carried by the owner-visible report the
invariant already mandates.

**Why the split rather than one value:** the vocabulary's own rule decides it —

> **A status is only true if it is current.** An `In progress` marker left behind on an abandoned task is
> worse than no marker at all — it makes the board lie *with confidence*.

Writing `🚧 Blocked` over a task where nothing happened, or `🔲 Backlog` over a task with a landed
half-edit, are both cases of the board lying with confidence. `Plan rejected` may reset to `🔲 Backlog`
precisely because **nothing has landed** at plan-reject time; the same reasoning licenses the reset here
and withholds it in the other branch.

### Reconciliation with `## Durable artifacts`'s deliberate exclusion of status

That section says, verbatim:

> Task **statuses** are deliberately **not** in this table: they live in the brief's `## Status` and the
> sprint row, and are governed by §2 (mark `🔄 In progress`) and §4 (close posture), not by an artifact
> write.

**No conflict — and the exclusion is actually the reason the answer takes the shape it does.** This
ruling puts the status in the **exit table**, a §4-class governance site, not in the artifact table. A
resume doctrine that tried to derive status from an artifact write would contradict this section
head-on. It does not.

---

## 5. Q4 — One table row, or the missing durable-state section?

**Answered against the corrected premise (§0.1): the sprint loop HAS artifact anchoring and LACKS a
resume doctrine over it.**

### The two candidates

**A — the row alone.** Add `Worker terminated abnormally — remainder deferred` to the exit table and
stop. *Mechanism:* one table row, three cells. *Fits:* the file's existing shape exactly; the exit table
is where every other terminal state lives.

**B — the row plus a resume doctrine section.** Add the row, and a short `## Resume doctrine` section
carrying the three-state disk classification, the no-self-report rule, and the escalate-on-partial
branch — sited beside `## Durable artifacts`, which it operates over.

| Dimension | **A — row alone** | **B — row + doctrine** |
|---|---|---|
| Closes the invariant breach (§4) | **yes** | yes |
| Answers Q1 | **no** — a table cell cannot carry a three-state classification | yes |
| Answers Q2 | **no** — the no-self-report rule has nowhere to live | yes |
| Risk of a row pointing at nothing | **high** — the row's "Driver does" cell would have to inline the whole doctrine or gesture at absent text | none |
| Effort | one row | one row + ~15 lines |
| Reversibility | trivial | trivial — additive prose, no contract change |
| Needs an ADR? | no | **no** — see §7; it adds no authority and reverses no decision |

### Recommendation

**B, shipped as ONE follow-up task.** The row and the doctrine must land together: a row whose action
cell says *"classify the disk state and act per §Resume doctrine"* is incoherent if that section does not
exist, and a row that inlines the classification would be an unreadable table cell.

**The main tradeoff:** B adds a second doctrine section to a file that is already 296 lines and growing
(it was 255 when the brief was written, five days earlier). That is a real cost and it is accepted,
because the alternative is a known-incomplete rule in a file whose incompleteness is the reason this
task exists.

### ⚠️ The doctrine is NOT a copy of `fkit-task-ship-loop`'s — say so where it is written

The task loop re-derives **its own** position after **its own** interruption. The sprint driver must
re-derive **a dead subordinate's** position while itself alive and holding context. **These are different
problems and the second is harder**, because the driver has a *plausible but unreliable* memory of what
it asked for — which is more dangerous than having none. A future implementer who copies the sibling
section across will produce a doctrine that answers the wrong question.

### Is it this task's follow-up, or a broader ADR?

**This task's follow-up. Not an ADR.** The doctrine grants no new authority, reverses no decision,
creates no new status value, and changes no role boundary. It writes down a procedure over artifacts that
ADR-020 already established. The one thing in it that *would* have needed an ADR — amending R6's
owner-ruled acceptance — is ruled unnecessary in §7.

---

## 6. Adjudicating *"fkit has no crash-recovery anywhere"* — by quotation

**The claim, quoted in full from `ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/review.md:76-79`:**

> - **Crash/idle stranding of an in-flight `🔄 In progress` task (R6, owner-ruled 2026-07-22: accept)** —
>   *What:* a crash/kill mid-drive leaves the task `🔄 In progress` with no lease/recovery; *Why
>   (structural):* fkit has **no crash-recovery anywhere** — all state is working-tree + owner-driven;
>   *Re-raise only if:* stranded in-progress tasks become a recurring operational problem (then scope a
>   lease/recovery task + ADR).

**Against `claude/skills/fkit-task-ship-loop/SKILL.md`, §*Durable state — the loop does NOT trust its own
memory*, quoted:**

> It anchors to durable, git-tracked, task-id-keyed files and **re-derives its position on every resume**
> (ADR-020)

> **Fail-safe on resume:** if the loop cannot establish from these files that a gate was passed, it
> **returns to the nearest owner gate** — it never infers a plan approval it cannot evidence.

**And from the same file's `**Invariants:**` list under its own exit table:**

> - On **resume**, re-derive status from the durable artifacts and correct any status that no longer
>   matches reality.

### Verdict: the claim does NOT stand as written. Two readings, both stated.

**Reading 1 — as a blanket claim about the codebase: FALSE.** One loop carries an explicit, named,
ADR-backed procedure for re-establishing correct position after an unplanned interruption, complete with
a fail-safe that degrades to an owner gate. In the ordinary sense of the words, that *is* crash recovery.
*"No crash-recovery anywhere"* is contradicted by a section whose title is literally about not trusting
memory across a resume.

**Reading 2 — in the sense R6 meant: TRUE.** R6's own findings row (`0111/review.md:26`) names exactly
what is missing, and is more precise than the residual the brief quotes:

> If the session crashes/is killed mid-drive, no terminal exit runs; the status stays `🔄 In progress`.
> A fresh invocation has an empty skip set but still **excludes `🔄 In progress`** … — **no lease,
> heartbeat, or stale-task recovery exists** — so the task is stranded

**None of `lease`, `heartbeat`, or `stale-task recovery` exists anywhere.** Verified 2026-08-04 with the
command below — **word-anchored and `-E`, both load-bearing; see the correction that follows:**

```
/usr/bin/grep -rnE '\b(heartbeat|lease)\b' claude/     → no hits, exit 1
```

and the only `stale` hits in the sprint loop are the half-landed-close branch (*"a status or href is
stale"*), which is a different thing.

> ⚠️ **Correction, round 1 review (R5) — the conclusion held, the printed method did not.** An earlier
> draft printed this sweep as `/usr/bin/grep -rn` for `heartbeat|lease` over `claude/`. **With no `-E`,
> `grep` reads a BRE, in which a bare `|` is a LITERAL character** — so that command searched for the
> single literal string `heartbeat|lease` and **an empty result was guaranteed whether or not either word
> existed.** It could not test the claim it was printed to support, and it contradicted §1's pledge that
> *"every empty result names the command and the paths it covered."*
>
> **The conclusion is nonetheless independently TRUE**, re-derived with the corrected command above:
> exit 1 over all of `claude/`.
>
> **Two traps worth recording, because both were hit while fixing this** — this host's `/usr/bin/grep` is
> **`BSD grep, GNU compatible 2.6.0-FreeBSD`**:
> 1. **`\|` *is* alternation here, in BRE.** Measured against a file containing only `heartbeat`:
>    `/usr/bin/grep -c 'heartbeat\|lease'` → **1**. So a `\|` form would have worked; it was the
>    **unescaped** `|` that failed. Diagnosing this the other way round gets the fix backwards.
> 2. **`\|` inside an ERE is a literal pipe.** So `-E '\b(heartbeat\|lease)\b'` also returns exit 1 —
>    **but for the wrong reason**, and it verifies nothing. Only the unescaped `|` under `-E` is correct.
>
> **Neither the reading below nor R6's acceptance moves**; only the evidence for them is now sound.

**And the decisive point that reconciles the two readings:** the task loop's fail-safe **cannot help a
stranded task**, because it runs only when a loop *resumes* — and a session that crashed never resumes.
It is a **within-session** re-derivation, not a mechanism by which a **fresh** invocation detects and
reclaims a task another session abandoned. R6 needed the latter. It does not exist.

### What this does to R6's acceptance

**The rationale was overstated; the acceptance survives on the corrected rationale.**

The accurate form is: *fkit has no lease, heartbeat, or stale-task reclamation anywhere; one loop has an
in-session re-derive-on-resume fail-safe; the sprint driver has none.* That narrower claim **still fully
supports accepting R6**, because the specific capability R6 identified as absent genuinely is absent.

**This matters and is not pedantry:** the overstated claim was *the rationale on which the owner accepted
the residual*. A rationale broader than the facts is a weaker basis than it looked. Having checked it,
the acceptance is **sound rather than mistaken** — but a reader should know it was checked and by how
much it was wrong.

**The frozen ledger is NOT corrected.** `0111/review.md` sits under `done/`. A review ledger records
where things stood when the findings were raised; editing it rewrites evidence — the exact reasoning the
owner applied in ADR-037's instance B, where a spawn instruction to leave a frozen ledger alone was
upheld against a skill rule that would have re-pointed it. **The correction lives here.**

---

## 7. The R6 reading, and the ADR decision

### Ruling: **adjacent uncovered failure.**

Not a re-raise. Not silently swallowed by R6's rationale. Four grounds:

> ⚠️ **Updated 2026-08-04 (round-2 review, R17). Grounds 1–3 previously enumerated TWO instances in a
> now-three-instance report.** §1 records that §7 was *"checked rather than assumed"* against instance 3;
> the check's result is now written where a reader of §7 will see it. **No ground changes and the ruling
> is untouched** — instance 3 satisfies each of them.

1. **Different actor.** R6's subject is *"a crash/kill mid-drive"* of **the driver session itself** — *"no
   terminal exit runs"*. **All three instances** are a **spawned worker** dying while the driver survives
   and, in each, demonstrably recovers — instance 3 included: its driver survived the worker's death,
   misread the disk (§1), and re-spawned.
2. **Different harm.** R6's harm is **stranding**: a task left `🔄 In progress` that no later invocation
   reclaims. **No instance produced stranding.** Verified: `0118`'s brief `## Status` reads
   `✅ Done (agent-closed — not owner-verified)` — the task closed. Instance 2's work was not a tracked
   task at all, which is precisely why Q3 exists. **Instance 3's `0167` stayed in flight and is being
   shipped** — the driver never exited the task, so no exit row fired and no status was written (§1's
   moves table, Q3 row).
3. **The stated trigger was not met.** R6's *Re-raise only if* is *"stranded in-progress tasks become a
   recurring operational problem."* **Zero stranded tasks resulted from any of the three.** The trigger is
   a factual condition and the fact did not occur.
4. **Not swallowed, either.** The rationale (*"no crash-recovery anywhere"*) is broad enough to *sound*
   like it covers worker death — but R6's *What* and its *Re-raise only if* both scope it to the driver's
   own crash. **A rationale is not a scope.** Reading the broad sentence as the boundary would let any
   sufficiently general justification silently absorb failures nobody examined.

### Therefore: **no ADR is required, and none was written.**

R6's owner-ruled acceptance is **not amended, not narrowed, not re-raised.** It stands exactly as
written. What §6 corrects is its *rationale*, not its *operative content* — the disposition (`accept`)
and the re-raise condition are untouched, and the corrected rationale still supports both.

The brief's conditional was: an ADR *"if and only if the ruling amends R6's owner-ruled acceptance."* It
does not. The condition is not met.

> ⚠️ **This is a judgment call and the owner may overrule it.** The argument for writing an ADR anyway is
> that §6 materially corrects the reasoning behind an *owner-ruled* acceptance, and owner-ruled things
> arguably deserve an owner-visible record even when the ruling holds. I judged that an ADR records a
> **decision**, and no decision changes here. **What would flip it:** if the owner reads the corrected
> rationale as weakening the acceptance rather than surviving it, then R6 is being narrowed and an ADR
> follows. That reading is available and I am not the one who should take it.

---

## 8. The retry exclusion — reconciling the prior art the brief did not name

⛔ **This report scopes, recommends, and implies no retry policy. It contains no retry count, no retry
limit, and no backoff rule of its own.**

**But the file being ruled on already contains a bounded one-shot retry, and ignoring it would leave the
ruling incomplete.** Quoted from the exit table's **`Blocked — hand-off didn't land`** row, as existing
text being reconciled — **not adopted, and not this report's rule**:

> **folder never moved** → re-spawn `@fkit-producer` once, then if still unresolved
> `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations

**It is not precedent for Q1, on three independent scopings:**

1. **One role, one step.** It authorizes re-spawning **the producer**, at **the close step**, and
   nothing else. No other row in the table re-spawns anything.
2. **A failed spawn, not a dead worker.** Its trigger is *"a task's producer spawn failed, was denied, or
   left the close partial."* In every one of those cases the driver **has** either a report or an
   unambiguous disk state (*"folder never moved"*). The dead-worker case is defined by having neither.
3. **A verified-empty precondition.** *"Folder never moved"* is a checkable nothing-landed state where
   the mover is known to run normally from `backlog/`. It is not a judgment about a partially completed
   unit of work.

**Reading that row as licence would breach this task's exclusion.** It is therefore **explicitly not
generalized**, and §10's follow-up 4 asks the implementer to add a one-line scoping note beside the new
row so a later reader cannot mistake one for the other.

> ⚠️ **A note for whoever checks verification step 6.** The quotation above contains the word "once",
> because the brief and the plan both *required* this row to be reconciled rather than ignored. It is
> quoted existing text, attributed and explicitly declined. **The rule this report writes for the
> dead-worker case is `escalate to the owner`** (§2), which is not a retry rule. Flagged here rather than
> left for a checker to trip over.

---

## 9. Reconciliation with `0134` — do they share a doctrine?

⛔ **Not merged. `0134` is untouched by this report.**

| | **`0167` (this task)** | **`0134`** |
|---|---|---|
| The worker | **did not return at all** | **ran and returned** |
| The constraint | the driver has no report to read | `/fkit-task-done` refuses an already-moved folder |
| The question | what to believe, and what status to write | **who may write** into a closed task's records |
| The remedy | a disk-first classification + an exit row | a governance decision under ADR-033 |
| Output | this report; no ADR (§7) | an ADR, by its own brief's design |

### Ruling: **one shared premise is worth naming once. The two rulings should NOT be unified.**

**The shared premise:**

> **The driver's belief about a task's state is derived from disk, never from a worker's report.**

`0134`'s half-landed close is *detected* exactly that way, and the sprint loop already says so under §4
*Close posture*:

> **Read that report** and cross-check it against the state you can see … A three-location spot-check
> cannot see a partial close — **never report a close you did not verify**

That is the same disk-is-the-oracle principle, applied to a worker that *did* return. `0167` applies it
to one that did not. **Same premise, and worth stating once so neither ruling has to re-derive it.**

**Why they must not be unified anyway:** the remedies live in different domains. `0134`'s is about
**write authority over an already-closed record** — an ADR-033 governance question about who may touch
what. `0167`'s is about **what to believe and what status to write when nothing was returned** — an
evidential and procedural question with no authority component at all. Nothing generalizes across that
gap, and a doctrine stretched over both would be vague in exactly the places each ruling needs to be
sharp.

**Recommendation:** name the shared premise in a one-paragraph convention page (follow-up 5, low
priority) that both rulings cite. **Do not write it as part of either task.** If the owner prefers, both
rulings simply restating it is an acceptable and cheaper outcome — the premise is short.

---

## 10. Follow-ups — title plus one-line scope

1. **Add the abnormal-termination exit row and a resume doctrine to `fkit-sprint-ship-loop/SKILL.md`.**
   One task, both changes together: a `Worker terminated abnormally — remainder deferred` row in
   §*Stop conditions — the driver's exit table*, plus a `## Resume doctrine` section carrying §2's
   three-state disk classification, §3's no-self-report rule (with its ADR-037 narrowing), and §4's
   state-dependent status values. **Must not be a copy of the sibling loop's section** — see §5.

   > ⛔ **FOUR BINDING CONSTRAINTS ON THIS FOLLOW-UP'S TEXT. Carry them into the brief; they are not
   > optional, and the first exists because copying §3's headline verbatim would ship a contradiction
   > into a SKILL.** *(Constraint (4) was added 2026-08-04 by owner ruling, after instance 3 — §1.)*
   >
   > **(1) Do NOT copy §3's headline sentence into the SKILL. Owner-ruled 2026-08-04 (round-1 review,
   > R7): §3's ruling stands as this report's record and is NOT edited — but the operative SKILL wording
   > must be the narrower form.** §3's headline reads *"It never asks a worker what it already did."*
   > Ground A only rules out a **memory-based** account, and §3's own ADR-037 narrowing **requires** a
   > resumed worker to re-derive from disk where its skill mandates one. A section carrying both
   > sentences contradicts itself. **Write this instead:**
   >
   > > **The driver does not rely on a worker's *recollection*; it derives landed-vs-outstanding from
   > > disk itself. The driver's enumeration is an INPUT to the resumed worker — never a substitute for
   > > the worker's own re-derivation where its skill mandates one.**
   >
   > **(2) Operationalize the nothing-landed test** — see §2's *Limits*. Say **against which baseline**
   > "byte-identical to before the spawn" is measured: capture the comparison point **at spawn time** and
   > diff **worker-owned paths** against it. Without this, a driver tests *"is the tree dirty?"*, which is
   > **yes** for a task the driver itself marked `🔄 In progress` and wrote `plan.md` for, and misroutes
   > every empty attempt into the `🚧 Blocked` branch.
   >
   > **(3) Write no retry count, limit, or backoff** — that is follow-up 3's owner decision, not this
   > one's. See §8.
   >
   > **(4) Say WHICH DISK the driver reads — this sharpens (2) and exists because a real driver followed
   > *"read disk first"* and still misclassified** (instance 3, §1; the addendum in §2). The doctrine must
   > state all three: **(a)** enumerate **the deliverable itself, wherever it lives** — the paths the spawn
   > instruction told the worker to write — **never the task folder as a proxy**, because a worker's output
   > is often not inside `<task-folder>/`; **(b)** **`git status` is not a landing detector for an untracked
   > path** — it reads `??` before the write and `??` after, so compare **content**, not tracking state;
   > **(c)** **a structural probe does not answer a content question** — a section heading is present
   > whether or not the section is filled. **And define "partial" over the UNIT, not the file:** the form
   > that actually occurred was several files, each internally coherent, with the unit torn across them —
   > a check for a half-written file returns **no** on it.
   >
   > ⛔ **THE OPERATIONAL TEST — write it into the SKILL as a decision procedure, not as a description.**
   > *(Added 2026-08-04 by owner ruling, round-2 review R11: without it the SKILL inherits a
   > non-deterministic classification, because "is a file half-written?" answers **no** on the form that
   > actually occurred.)* **List the paths the spawn instruction told the worker to write — the driver has
   > that list, because it wrote the instruction — and for each ask whether the obligation it carried was
   > discharged.** Then:
   >
   > - **None discharged → `Nothing landed`.**
   > - **All discharged → `A complete unit landed`.**
   > - **Some discharged, some not → ask the ONE question that separates the remaining two states:** *is
   >   what is on disk usable and safe to build on **with the missing paths never arriving**?*
   >   - **YES — the landed part stands alone; the remainder is separable → `A complete unit landed`.**
   >     Worked example: instance 2's first death — one wiki bullet, coherent and independently
   >     meaningful, two further pieces simply unwritten.
   >   - **NO — the landed part's correctness, attribution, or meaning depends on a path that is missing →
   >     the UNIT IS TORN → `A partial unit landed` → stop and put it to the owner.** Worked example:
   >     instance 3 — report corrections on disk whose verification record and attribution lived in the
   >     ledger and worklog that never arrived; **two of those corrections were later found factually
   >     false**, and only independent re-measurement caught them (§3's *Limits*).
   >
   > **A half-written FILE is `partial` by construction — but the test must not depend on finding one**,
   > because the form that occurred had none.
2. **Decide whether `SendMessage` is a sanctioned worker-resume mechanism, and write it down or rule it
   out.** It appears in **zero governing documents** — `/usr/bin/grep -rn 'SendMessage' claude/` →
   no hits, exit 1 — yet instance 1's entire recovery depends on it. ⚠️ **Not "zero documents"**
   (corrected per round-1 review R1): it *is* named in `ai-agents/sprints/sprint-2.md` and in this task's
   own `brief.md` / `plan.md` / `worklog.md`, but every one of those **records the gap** rather than
   defining, sanctioning or bounding the mechanism. See §2(c).
3. **⛔ Owner follow-up — decide who decides how many times a dead worker is re-spawned.** **Named, not
   answered**, per this task's exclusion. §2's nothing-landed branch escalates to the owner *because*
   this is unresolved; if the owner wants the driver to decide it alone, that is the task that says so.
4. **Add a scoping note beside the `Blocked — hand-off didn't land` row** stating that its producer
   re-spawn is close-step-specific and is not the dead-worker rule. One line; ships with follow-up 1;
   writes no new retry rule.
5. **(Low) Record the disk-is-the-oracle premise once as a convention page**, cited by this ruling and by
   `0134`'s ADR. One paragraph. Optional — see §9.
6. **(For `0160`'s follow-up 1, not a new task) Resolve row 1 of `0160`'s table rather than copying it
   into the convention page.** Row 1 bundles findings and design-doc citations into one verdict, and
   `0160`'s own R22 note flags that they answer differently. This report hit that fork (§0.1).

---

## 11. Self-verification against the brief's eight steps

| # | Brief's step | Status | Where |
|---|---|---|---|
| 1 | Report exists under `reports/`, all four questions answered **explicitly** | ✅ | This file. Four-line answer block at §0; full answers §2–§5 |
| 2 | Q1's shape **tested** per instance, failures named | ✅ | §2 *Evidence* — per-instance table plus three named failures (a) nothing-landed, (b) zero evidence for the incoherent branch, (c) the `SendMessage` assumption. n=1 caveat at §1. ⚠️ **Corrected per round-1 review R6:** the table's instance-2 cells no longer read *"holds, verified"* for **inspect disk first** and **defer** — a commit establishes the **artifact**, never the **process**. The honest split is **n=1 for the artifact, n=0 for the process**. ⚠️ **Extended 2026-08-04 by owner ruling:** a **third** instance is folded into §1, and the bare *"n=1"* framing is **superseded by §1's per-half standing table** — the halves now differ. Two consequences recorded rather than smoothed: (b)'s *"neither instance produced torn state"* is **true of a torn file and false of a torn unit**, corrected in place at §2(b); and step 1 gains the §2 addendum, because instance 3's driver **did** read disk and still misclassified |
| 3 | R6 reading named + ADR decision, citing `0111` coordinates | ✅ | §7 — **adjacent uncovered failure**; **no ADR required, none written**. Cites `0111/review.md:76-79` (§6, quoted in full) and `:26` (§6). Re-verified: both coordinates still correct |
| 4 | *"no crash-recovery anywhere"* adjudicated **by quotation** | ✅ | §6 — R6 quoted in full; `fkit-task-ship-loop` §*Durable state* quoted three times. **Verdict: does not stand as written**; two readings distinguished; acceptance survives on the corrected rationale |
| 5 | Status value from the vocabulary | ✅ | §4 — **`🚧 Blocked — <reason>`** and **`🔲 Backlog`**. Both read from `conventions/task-status-vocabulary.md` and quoted from it. Nothing minted |
| 6 | **No retry count, limit, or backoff anywhere** | ✅ | §8. This report writes none. ⚠️ **Corrected argument (round-1 review R3, re-corrected 2026-08-04):** an earlier draft claimed *"the **one** occurrence of 'once' is a quotation"* — **false; the word occurs many times** (`/usr/bin/grep -own 'once'`). ⚠️ **No count is printed here, deliberately.** This very cell contains the word, so **any figure stated is self-referential and stale the moment the cell is edited** — round 1 recorded *"eight"*, measured on the pre-correction draft, and writing the corrections into this file changed it. **The stable, load-bearing claim is the property, not the number: exactly ONE occurrence — in §8 — is a quotation** of the existing `Blocked — hand-off didn't land` row, attributed, explicitly declined, explicitly not generalized; **every other occurrence is an ordinary adverb** (*"worth naming once"*, *"worth stating once"*, …), and **not one of them states a retry count, limit, or backoff.** ⚠️ **One cited example went stale and was replaced 2026-08-04:** this cell previously offered *"stated here, once, loudly"* as an adverb example; that sentence was in §1's superseded n=1 paragraph, which the instance-3 amendment replaced — **a live demonstration of why the property, not the inventory, is the load-bearing claim.** **Re-verified after the instance-3 amendment, 2026-08-04:** `/usr/bin/grep -own 'once'` over this file — **the §8 quotation is the sole quotation-use; every other hit is an adverb; the amendment introduced no new occurrence.** **The step passes on substance; only its stated argument was wrong.** Flagged in §8 so a checker is not ambushed |
| 7 | No brief filed, no `claude/skills/` file edited | ✅ | Measured, scoped — see below |
| 8 | Follow-ups named (title + one-line scope) | ✅ | §10 — six, each with scope |

### Verification step 7, measured with its baseline recorded

**Pre-work baseline**, `git status --porcelain`, taken before this report was written:

```
 M ai-agents/sprints/sprint-2.md
 M ai-agents/tasks/backlog/0167-…/brief.md
?? ai-agents/tasks/backlog/0167-…/plan.md
```

`git status --porcelain -- claude/` → **empty. `claude/` is clean and this task did not touch it.**

**⚠️ The plan's risk 5 described a different baseline** (wiki-vault modifications, `backlog.md`, and
untracked `0214`/`0215`). The owner committed between plan approval and this run, so that baseline was
already stale. Recorded in §0.1 as the second decay instance. **The check is reproducible against the
baseline above, not the plan's.**

**No brief was filed.** ⚠️ **Corrected per round-1 review (R9).** An earlier draft said *"the only new
paths this task creates are this report and the task folder's `worklog.md`"* — and the baseline printed
three lines above it already showed a **third**, `?? …/0167-…/plan.md`. The accurate statement:

- **New paths this WORKER creates:** this report, and the task folder's `worklog.md`.
- **New path the DRIVER created earlier in this same task:** `<task-folder>/plan.md`, at plan approval
  before the Build spawn (`fkit-sprint-ship-loop` §*Durable artifacts*, the **Plan** row).

**None of the three is a brief**, and no file was added under `ai-agents/tasks/` other than that
`plan.md` inside this task's own existing folder — so **verification step 7 passes on substance**,
re-verified 2026-08-04: `git status --porcelain -- claude/` → **empty**. The defect was the header's
conflation of *this worker's* surface with *the task's*, now fixed at the top of this file.

**Re-measured for the instance-3 amendment, 2026-08-04.** Baseline at the start of that amendment,
`git status --porcelain` over the two directories it could touch:

```
 M ai-agents/tasks/backlog/0167-…/brief.md
?? ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md
?? ai-agents/tasks/backlog/0167-…/plan.md
?? ai-agents/tasks/backlog/0167-…/review.md
?? ai-agents/tasks/backlog/0167-…/worklog.md
```

`git status --porcelain -- claude/` → **empty**, re-verified for this amendment. **The amendment created
no new path** — it edited this report and the task folder's `worklog.md`, both of which already existed.
**No brief filed, no ADR, no vault write, no board or status change, no commit.**

⚠️ **Note the baseline itself, because it is the instance-3 finding in miniature:** **four of the five
lines are `??`.** Every artifact this task produces is untracked, so this listing would look **identical**
whether the amendment had landed or not.

---

## 12. Open questions returned to the driver

I have no owner channel (ADR-021). These are returned, not asked. **None blocks the ruling.**

1. **Should an ADR be written anyway?** §7 rules no, and names exactly what would flip it. Owner-overridable.
2. **`/fkit-evaluate-approach`'s Step 1 requires asking the owner about priorities** (*"the weighting
   changes the recommendation, so don't assume it"*). **I could not.** The priorities used are the ones
   the brief and the approved plan state — correctness over speed, no new authority, no retry rule. If
   the owner weighs differently, §5's recommendation is the one most sensitive to it.
3. **Follow-up 5 (the shared convention page) may not be worth a task.** Both rulings restating the
   premise is a cheaper acceptable outcome. Producer's call.
4. **`0160`'s row-1 tension (§0.1)** is surfaced for `0160`'s follow-up 1. It needs no action here.
5. **Added 2026-08-04, from instance 3 — should a deliverable be git-tracked *before* a worker is spawned
   to write it?** Instance 3's whole detection failure and its whole attribution failure share one root:
   the deliverable was **untracked**, so `git status` carried no landing signal and there was no history to
   attribute the edits to (§1). Tracking it at spawn time would have made both problems visible. **I do not
   rule on this and deliberately write no rule for it. Named for the owner, not answered**, in the same
   posture as follow-up 3.
   > ⚠️ **Corrected 2026-08-04 (round-2 review, R16). The reason previously given here was factually
   > wrong and it foreclosed the cheaper option.** It read *"it implies a **commit**, and only the owner
   > authorizes commits."* **Tracking does not imply a commit.** `git add` alone makes a path known to
   > git — verified 2026-08-04 in a scratch repository **with no commits at all**: after `git add`,
   > `git status --porcelain` reports `A ` instead of `??` and `git ls-files` lists the path. **That is
   > precisely the landing signal §1 says was missing, obtained with no commit.** So a **stage-only**
   > option exists and the owner may well take it. **The decision stays the owner's** — it adds an
   > obligation to the driver's spawn step and writes to the git index, neither of which this ruling
   > grants — but it must not be declined on a false premise.

## 13. Filing note

This report belongs in the wiki as a ruling, alongside `0160`'s and `0162`'s. **I do not write the
vault** — `fkit-wiki` should ingest it, or the owner runs `/fkit-wiki-ingest`. **No commits were made.**
