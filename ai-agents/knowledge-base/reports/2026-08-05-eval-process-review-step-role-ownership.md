# Evaluation — is Process-review always `@fkit-coder`, or does the architect gain the skill?

**Task:** `0200` · **Date:** 2026-08-05 · **Author:** `fkit-architect`, spawned as the **Build** worker
by `/fkit-sprint-ship-loop` (live `fkit lead` driver session).
**Procedure:** `/fkit-evaluate-approach`. **Deliverable:** this report. **No implementation.**

> **No owner channel** (ADR-021). Every judgment below is mine and is recorded so the owner can
> overrule any of it.
>
> ⚠️ **`/fkit-evaluate-approach` Step 1 could not be executed as written.** Step 1 requires *"Ask the
> owner about priorities"*. A spawned worker has no owner channel and `AskUserQuestion` is absent.
> **I did not silently skip it.** The driver pre-supplied the **owner-ruled** ordering, taken live on
> 2026-08-05, and I evaluated against it verbatim:
>
> > **correctness of the routing rule > detection latency > maintenance cost > implementation
> > cheapness.**
>
> Everything Step 1 would have elicited beyond that ordering was **not** obtained. Where a
> recommendation turns on a priority the ordering does not settle, I say so rather than assume.

**Change surface of this worker:** this file, plus `ai-agents/tasks/done/0200-…/worklog.md`.
**Nothing else.** No ADR (owner-ruled). Zero files under `claude/`.

> **Round-1 review corrections applied 2026-08-05 — `**Role:** @fkit-coder`, spawned as the
> **Process-review** worker by `/fkit-sprint-ship-loop`, running `/fkit-process-stateful-review`.**
> Attested here because *"who worked this step"* is this report's own subject, and Round 1 relied on an
> unattested attribution (see §2 ground 1's R3 correction). The reviewer confirmed **12 defects (3
> high)** with **complete Codex coverage** and ruled **🛑 Blocked** pending the high findings.
> **§2's ruling survives unchanged** — it was independently re-tested and every defect sat in the
> *support*, the *Q2/Q4 answers*, or the *follow-ups*. **Two answers changed materially: §3 (Q2) is
> reversed, and §5 (Q4) now requires a paired detector.** Every correction is marked inline as
> **⚠️ CORRECTED / AMENDED / RE-SCOPED (R*n*)** with the superseded text struck rather than deleted, so
> the reversals are auditable. Ledger: `ai-agents/tasks/done/0200-…/review.md`.

---

## §0 — Coordinate re-verification, measured first-hand 2026-08-05

The brief warned it decays; the plan warned its own §0 table is *"a starting point, not authority"*.
I re-measured every row myself. **The brief's five facts all hold. Eight further things shifted or were
found that neither the brief nor the plan records — S7–S14 below. Two of them correct the plan.**

### Held, re-measured

| Fact | Measured this turn |
|---|---|
| Skill in the `coder)` arm | `claude/skills-for-role.sh:52` — `coder)` lists `fkit-process-stateful-review` |
| **Absent** from `architect)` | `claude/skills-for-role.sh:53`; `/usr/bin/grep -n 'fkit-process-stateful-review' claude/skills-for-role.sh` returns **line 52 only** |
| Loop row names `@fkit-coder`, says *"method"* | `claude/skills/fkit-sprint-ship-loop/SKILL.md`, step-2 spawn table, row **"Process review"** — *"`@fkit-coder`"* and *"apply `fkit-process-stateful-review` **method**"*, both tokens intact |
| Hook deny path | `claude/skill-ownership-hook.sh`, final ownership `case` — `*) deny "role '$role' does not own skill '$skill_name'" ;;` |
| Hook identity resolution | same file, *"resolve the REAL caller's role"* block — reads `agent_type` from the payload, strips the `fkit-` prefix, denies if absent or non-`fkit-*`; header states it is *"its OWN type, at any depth — empirically confirmed, not merely assumed"* |
| `0195`'s disclosed denial | `ai-agents/tasks/done/0195-…/worklog.md:189-194` (frozen ledger, line-citable) — denial verbatim, *"The **method** was applied by hand"*, *"the skill's own procedure text was never read"* |
| ADR-037 leaves this axis open | `adr-037-…md:33` — *"**Not decided here (the *invocation* axis):** *which* skill a role may run at all."* |
| ADR-012 cites the stale home | `adr-012-…md:175` — *"Source of truth: `claude/fkit-claude.sh:92-103`"*. It lives in `claude/skills-for-role.sh` today. Cite the file, not ADR-012. |
| Four declared mirrors + task-70 | `claude/skills-for-role.sh`, header block *"CHANGING A ROLE'S SKILLS? FOUR hand-maintained places…"* and *"THIS LIST SAID "TWO" UNTIL 2026-07-18…"* |

### Confirmed from the plan's §0

- **Loop `SKILL.md` is 296 → 309 lines, +13/−0, uncommitted** (`0191`). Re-measured: `wc -l` = 309,
  `git diff --stat` = `13 +++++++++++++`. **The diff hunk starts at `@@ -282`; the Process-review row is
  at line 124 and is byte-identical to HEAD.** The plan's shift 1 holds exactly.
- **The brief mis-transcribes the hook's deny line.** Brief `:46` writes `'$skill_name'` where the file
  writes `'$role'`. Quoted from the file above. No conclusion is affected.
- **Verification step 7 is unsatisfiable as written** — handled by 7′ in §Verification below.
- **`test/skill-ownership-sites.mjs` is still absent.** `/bin/ls test/` returns 16 entries; not among
  them. ADR-036's registry has no tooling; defers to `0189` (open).
- **`0201` exists and owns the `0143`/`0158` audit** —
  `ai-agents/tasks/backlog/0201-append-dated-correction-notes-to-0143s-and-0158s-closed-review-ledgers/brief.md`,
  which records that a read-only coder audit **already established the artifacts cannot distinguish**
  the two readings, and carries *"⚠️ **If `0200` rules option (b) … revisit this owner field**"*.
  **Cited, nothing further asserted** — I did not re-derive it and did not read those folders.
- **⚠️ CORRECTED (Round 1, R5) — the `0191` driver-side clause is uncommitted and reaches *no running
  driver at all*.** My first draft called it *"live"*. Re-measured this turn: the copy a driver actually
  loads, `.claude/skills/fkit-sprint-ship-loop/SKILL.md`, is **296 lines and does not contain the clause**
  — `diff` against the canonical file shows the clause's 13-line block present only in
  `claude/skills/fkit-sprint-ship-loop/SKILL.md` (its §*Hard rules*, the *"Never instruct into the
  territory"* bullet). `0191/worklog.md:37` §*"⚠️ Stated limitation — the clause reaches no driver yet
  (owner-ruled deferred)"* states this outright and I did not cite it. **This strengthens §5's
  conclusion and falsifies its premise**: §5 disputed the clause's *reach*; the true statement is that
  it has none today. §5 is corrected accordingly.

### Shifted or newly found — S7–S14

**S7 — ⚠️ The brief's core framing is imprecise, and it changes what Q4 is asking.**
The brief says *"The loop's prose and the hook's enforcement **disagreed** for three consecutive
tasks."* Re-measured: they **agree exactly**. The row names `@fkit-coder`
(`SKILL.md`, row *"Process review"*); `skills_for_role()` grants the skill to `coder`
(`skills-for-role.sh:52`). There is no prose-vs-hook disagreement anywhere in this defect.
**What departed from both was the driver's spawn choice.** Q4 must therefore be read as *"what makes
the next **driver departure from the role the loop names** visible in fewer than three tasks"* — a
different question with a different answer. §5 answers the real one and says so.

**S8 — the cost of the hand-application was measured, and it is not small.**
`0195` Round 3 (`worklog.md:245-260`, frozen) re-ran the step as `@fkit-coder` with the skill actually
invoked, and recorded what the by-hand round had missed: *"Skill Step 0/2/3/3.5 — steps the hand
application never ran"* (ADR skim across all 37 decisions; suppressed-as-settled list; independent
severity re-derivation; the missing regression-check arms), and *"Skill Step 4 — Status cells use none
of the six prescribed values"*. **Four procedure steps did not run and the ledger's status vocabulary
was wrong.** This converts *"the method was applied by hand"* from a procedural note into a measured
completeness failure. It is the single strongest fact in this report.

**S9 — ⚠️ CORRECTED (R1): the *"method"* wording exists in at least *three* files, not one and not two.**
Measured this turn:
- `claude/skills/fkit-sprint-ship-loop/SKILL.md`, step-2 table row *"Process review"* — *"apply
  `fkit-process-stateful-review` **method**"*.
- `claude/agents/fkit-coder.md`, §*"As the Process-review worker:"* — *"apply
  `fkit-process-stateful-review`'s method — verify each finding, classify defect/frontier, write the
  *Coder response*"*.
- `claude/skills/fkit-task-ship-loop/SKILL.md`, §*Step 5* — *"apply the **method** of
  `fkit-process-stateful-review` (do **not** run that skill's owner gate — this loop's authorization
  replaces it)"*, and again in its §*Hard rules* — *"used by *method*, not invoked-and-overridden"*.

The brief treats the wording as a single-site issue; my own first draft said two. **It is a
construction used consistently across three files, which is what §3 gets wrong below and now
corrects.**

**S10 — the Process-review row is the *only* skill-naming row in the step-2 table that omits the `/`
prefix and the verb "run".** Measured across the whole table:

| Row | How it names its skill |
|---|---|
| Plan | *"run `/fkit-plan-task`"* |
| Build | names none |
| Verify | names none (tests, per ADR-014) |
| Review | *"`@fkit-reviewer` → `/fkit-stateful-review`"* |
| **Process review** | **"apply `fkit-process-stateful-review` **method**"** — and, in the same cell, *"apply verified-`CORRECT`, in-approved-plan fixes autonomously **(task-loop discipline, ADR-019)**"* and *"record each autonomously-applied fix … **(ADR-032 A2 / ADR-019 `:96`)**"* |
| Close | *"run `/fkit-task-done`"* |

Every other row that names a skill uses the `/fkit-*` slash form, which reads as *invoke it*. This row
alone uses a bare name plus *"apply … method"*, which reads as *reproduce its behaviour*. **The anomaly
is exact and it is one row wide.**

> **⚠️ CORRECTED (R1) — my first draft of this table elided the row's own ADR citations**, quoting only
> the *"apply … method"* fragment. That elision is what let §3 read the wording as an accident. **It is
> not an accident: the row cites ADR-019 and ADR-032 in its own text**, and the *"method"* construction
> is their deliberate convention (see S9's third site, which spells out *"do **not** run that skill's
> owner gate — this loop's authorization replaces it"*). The citations are restored above. §3 is
> rewritten accordingly.

**S11 — the hook detects every violation and records none. This is the detection gap.**
`deny()` (`claude/skill-ownership-hook.sh`, the `deny()` definition) does exactly two things:
`printf 'skill-ownership-hook: DENY — %s\n' "$1" >&2`, and emits the deny JSON on stdout. **There is no
log file, no append, no persistent trace *in this hook*.**

> **⚠️ CORRECTED (R6) — my first draft generalized this to "no fkit hook writes a durable record of
> anything." That is false.** My `/usr/bin/grep -n '>>'` probe detects only **append** redirection.
> Re-measured this turn: `claude/askuserquestion-marker-hook.sh:57` and `claude/shiploop-marker-hook.sh:64`
> each run `mkdir -p "$cwd/.fkit/state" && : > "$cwd/.fkit/state/<marker>-$session_id"`, and
> `claude/turn-completion-hook.sh` (`:73`, `:97`) **reads** those markers. **Hook→filesystem persistence
> is an existing pattern, not new ground.** What *is* new: `.fkit/` is **gitignored** (`.gitignore:8`),
> and the owner has since ruled the denial record must be **git-tracked**. So the novelty is the
> git-tracked, append-only location — not persistence itself. §5's *"one genuine unknown"* framing is
> narrowed accordingly.

So a denial exists only
inside the denied worker's own context, and reaches the project record **only if that worker chooses to
write it there.** `0195` chose to. Whether `0158`/`0143` had denials to disclose is exactly what `0201`
found the artifacts cannot settle. **The system already knows; it just forgets.**

**S12 — the skill applies code fixes, so option (b) is a source-write grant.**
`claude/skills/fkit-process-stateful-review/SKILL.md`, **Step 6 — Apply approved fixes + update the
shared file**: *"**Apply** the minimal, idiomatic fix for each approved finding (smallest correct
change…)"*. Granting it is not granting a documentation procedure. Decisive for §4.

**S13 — option (b)'s change surface is larger than the declared four-mirror list, and that is the
task-70 failure recurring.** `/usr/bin/grep -rln 'fkit-process-stateful-review' claude/` returns
**11 files**. Beyond `skills-for-role.sh` and the four declared mirrors, an option-(b) change would also
have to touch:

- `claude/skills/fkit-process-stateful-review/SKILL.md` — its own **⛔ Owner: the coder** banner:
  *"Execute it **only** if you are the coder… **Any other role: do not execute this.**"* Left alone,
  the skill would contradict `skills_for_role()` the moment (b) lands.
- `claude/agents/fkit-architect.md`, §*"Your work lives in your own skills:"* — the architect's own
  skill list. **Note it is *not* among the 11 grep hits, precisely because it lacks the skill today.**
- `claude/skills/fkit-team/SKILL.md` carries **two** rows, not one — the role table and the
  role→skill table (*"| architect | `/fkit-survey-project`, …"*). The header counts the file once.
  **That is a second *site* in an already-declared *file*, not a new file.**

> **⚠️ CORRECTED (R9) — my first draft listed `claude/agents/fkit-coder.md` §*"As the Process-review
> worker:"* here too. It does not belong**: under (b) the coder **keeps** the skill, so that sentence
> stays true and the file need not change. Genuinely **new files** an option-(b) change would force
> open, beyond `skills-for-role.sh` and the four declared mirrors, are therefore **two**: the skill's
> own ⛔ banner and `claude/agents/fkit-architect.md`.
>
> **⚠️ Under-count in the other direction, which my first draft missed entirely.** Three further sites
> would go **stale** under (b), all measured this turn: `claude/agents/fkit-reviewer.md:41` and
> `claude/skills/fkit-stateful-review/SKILL.md` (`:47`, `:132`) each say *"**the coder's**
> `fkit-process-stateful-review`"*. They are not blockers, but they are shipped text that (b) falsifies.

**The declared checklist is again incomplete, in the exact way its own header warns about** — in both
directions. This is a finding about the checklist, not only about (b) — see §8 follow-up 5.

**S14 — ⚠️ I must correct the plan.** The plan's evidence packet asserts detection candidate (iii) —
a test asserting each loop-table row's role owns the skill that row names — *"would have caught this at
authoring time, before task one"*. **That is wrong.** The table row and `skills_for_role()` agree today
and agreed throughout (S7), so such a test **passes today and would have passed on 2026-08-02**. It
would not have caught this defect. It guards a real but *different* failure. §5 keeps it and re-scopes
it honestly.

**Merit contention (owner-ruled Q-C) — recorded, not acted on.** See §9.

---

## §1 — The three options

### (a) — the loop states Process-review is **always** `@fkit-coder`, and says why

**On disk:** `claude/skills/fkit-sprint-ship-loop/SKILL.md` only — the step-2 table row, plus a short
rationale sentence so a future driver cannot re-derive the substitution as obviously right.
**ADR required:** not for the edit. **Yes for the rule it encodes** — see §6.
**Maintenance:** one file, one row. No mirrors.
**How it fails:** it is prose addressed to the actor that already ignored prose. The 2026-08-02 driver
was not defeated by an *absent* rule — the row already said `@fkit-coder`. It was defeated by a
plausible-sounding exception it invented on the spot. Adding the reason raises the bar for inventing
that exception; it does not detect the next one. **(a) alone scores zero on the owner's #2 priority.**

### (b) — `skills_for_role()` grants `fkit-process-stateful-review` to `architect`

**On disk:** `claude/skills-for-role.sh:53`, the four declared mirrors, **plus the undeclared sites in
S13** — enumerated distinctly, **8 files / 9 sites** (the two `fkit-team/SKILL.md` rows are one file),
one of which (`claude/scaffold/CLAUDE.md`) ships into every consuming project. **⚠️ CORRECTED (R9):
my first draft said *"nine files"*; that conflated files with sites.** Three further shipped sentences
would go stale (S13's under-count note) without blocking the change.
**ADR required:** **yes, unavoidably.** It widens a hook-enforced ownership boundary, which ADR-012
calls *"the ONLY place role→skill ownership is expressed"*.
**Maintenance:** highest of the three, and permanently so — every future role/skill question now has a
precedent for widening rather than routing.
**How it fails:** three ways, in descending order of severity.
1. **It hands a source-write procedure to a non-source-write role (S12).** Step 6 applies code fixes.
   The architect's contract is *"designs, never implements (interface stubs only)"*
   (`claude/agents/fkit-architect.md`). (b) makes that contract false at the skill layer.
2. **It does not stop.** The premise *"the role that owns the artifact processes its review"*
   generalizes by construction: the producer authors briefs, the wiki authors pages, the reviewer
   authors ledgers. Four of seven roles would have the same claim, and each would carry Step 6 with it.
   §4 puts the reductio precisely.
3. **It answers a question nobody has.** It removes the denial *without* removing the misroute — the
   architect would then run a coder's procedure quietly and correctly, and the one signal that surfaced
   this defect at all (S11) would stop firing.

### (c) — neither: the role column is not where the defect lives

**The claim:** the routing rule was already correct and already hook-enforced. What failed was that a
departure from it produced **no durable trace**. So leave the ownership alone; make the departure
self-evident.
**On disk:** nothing in `skills-for-role.sh`; a persistence mechanism for hook denials, plus a
record-shape guard (§5).
**ADR required:** probably not for the mechanism; a decision is needed about **where** a denial log
lives and who reads it.
**Maintenance:** one new capability. **⚠️ CORRECTED (R6): this is *not* new ground in the way my first
draft claimed** — hook→filesystem persistence already exists (`askuserquestion-marker-hook.sh:57`,
`shiploop-marker-hook.sh:64`). The new part is a **git-tracked** location, since `.fkit/` is gitignored.
**How it fails:** it leaves the row's *"apply … method"* cell **unenumerated** (S8/S10), so the next
worker can again reproduce a subset of the method and call it done; and a log nobody reads detects
nothing. **(c) is necessary and is not sufficient.**

**I assessed (c) at full weight, as the plan's E7 requires.** Its diagnosis is right and it supplies
the only real answer to Q4.

> **⚠️ CORRECTED (R8) — I constructed (c) more narrowly than the brief did, and that flattered (a).**
> I defined (c) as *"change neither the prose nor the ownership"*. **The brief's own third option
> (`brief.md` §*What to build* step 2) was *"leave ownership alone and make the loop's Process-review
> row state its role **and its reason**, plus a driver-side check"*** — i.e. the row rationale I credit
> only to (a) was **already inside the brief's "neither" option**. My §7 table therefore scores (c) as
> *"Silent — declines to state the rule at all"*, which is true of my construction and **not** of the
> brief's. **The recommendation is unaffected** — it is the union of (a) and (c) either way — but the
> reasoning must not claim (c) abstains on correctness. On the brief's construction it does not: the
> routing rule it leaves intact is, per S7, **already correct**.

---

## §2 — Q1: does the step's role follow the deliverable's author, or is it structurally the coder?

### Answer

> **The Process-review step's role is fixed by the skill the step runs, not by who wrote the
> deliverable: it is always `@fkit-coder`, because `fkit-process-stateful-review` writes the ledger's
> coder-owned section and applies code fixes — neither of which changes when the deliverable happens to
> be a document.**

That is the sentence a future driver acts on. **It is structural, not preferential.**

### Why — four grounds, strongest first

1. **The counter-example is already in the record: on an architect-authored deliverable, the
   Process-review step was still *routed* to `@fkit-coder`.**
   `0167`'s deliverable is architect work product — an architect-authored report
   (`worklog.md:3-6`: *"**Role:** `fkit-architect` … the owner ruled for this run that the coder plans
   and the architect builds, because the deliverable is architect work product"*). **The routing of its
   Process-review step to a coder is directly attested** — `0167/worklog.md:304` (frozen ledger),
   written by the architect in its own Instance-3 round: *"A spawned `@fkit-coder` running the
   Process-review step **died** when the owner's network connection dropped"*. So the premise *"the role
   must follow the deliverable's author"* was **not applied** on a run that had every reason to apply
   it, before this task was built.

   > **⚠️ CORRECTED (R3) — my first draft claimed `0167`'s Process-review *"was worked by a coder,
   > twice"*, citing `worklog.md:204` and `:434`. That was inference, not measurement, and I withdraw
   > it.** Re-measured this turn: `0167/worklog.md` carries exactly **one** `**Role:**` line — `:3`,
   > `fkit-architect`, the Build worker. `:204` and `:434` are the bare section headings
   > *"# Process-review worker — round 1 / round 2"* and **carry no role attribution at all**. That
   > round's own text says the author is *"unestablished, and I could not establish it"*. Concluding
   > "coder" from the absence of a denial is exactly the inference **my own S11 shows proves nothing**,
   > and I applied it asymmetrically — refusing it for `0158`/`0143` while relying on it here.
   > **The narrowed claim above (routing attested, authorship not) is what the record supports.**
   >
   > **⚠️ CORRECTED (R4) — the tree-wide generalization was also false.** The narrow measurement holds:
   > `/usr/bin/grep -rn "does not own skill"` over `0167`, `0190` and `0191` returns **zero hits**,
   > re-measured this turn. But my claim that *"the only hits in the tree are inside `0200`'s own brief
   > and plan"* is wrong — re-measured, **11 git-tracked files** match, including
   > `ai-agents/tasks/done/0195-…/worklog.md`, which **this very report cites at §0**, plus
   > `done/0112-…/worklog.md`, `done/0124-…/review.md`, `ai-agents/sprints/sprint-2.md`,
   > `claude/skill-ownership-hook.sh`, `test/skill-ownership-hook.test.js`, and this report itself.
   > **Self-contradicting, and I should have caught it from my own §0.**
   >
   > **Effect on the ruling: none.** Ground 1 is now the *weakest* of the four, not the strongest.
   > **Grounds 2–4 are independent of it and carry §2 on their own** — the ledger section is coder-owned
   > by the skill's own contract, Step 6 applies code fixes, and ADR-033 already chose route-don't-widen.
2. **The step is not defined by the artifact under review; it is defined by the section it writes.**
   The skill's own contract: *"Reviewer and coder each own a section and round-trip in place"*
   (`fkit-process-stateful-review/SKILL.md` frontmatter). The section is **coder-owned** regardless of
   what the review is about. `0201`'s brief records the same convention from the other side —
   *"§Coder response is marked `CODER-OWNED — the reviewer does not write here`"*.
3. **Step 6 applies code fixes (S12).** The step can end in a source edit. Only one role may make one.
4. **This is ADR-033's pattern, exactly.** ADR-033 routed the task movers to the producer rather than
   granting them wider, and made it *"hook-structural at any spawn depth"*
   (`adr-033-…md:131`, *"that makes producer-only structural at any spawn depth"*). The same shape
   applies here: **route the step to its owning role; do not widen the skill.**

**What the answer is not.** It is not *"the architect may not touch a review"*. The architect can be
consulted about a finding, and did useful work on `0158`/`0143`/`0195`. It is the **step** — writing
the coder-owned section and applying fixes — that does not move.

---

## §3 — Q2: is *"apply the `fkit-process-stateful-review` **method**"* the right wording?

### Answer

> ### ⚠️ This answer was WRONG in Round 1 and is replaced. The superseded answer is kept below so the reversal is auditable.
>
> **~~No. In the loop's step-2 table it is wrong and should read *"run `/fkit-process-stateful-review`"*,
> matching every other skill-naming row in the same table.~~** *(withdrawn — R1)*
>
> **The word *"method"* stays. It is a settled ADR-019 / ADR-032 convention, not a wording accident:
> in a ship loop the step applies the skill's *steps* while the loop's single up-front owner approval
> replaces the skill's per-round owner gate. What is wrong with the row is that it names the method
> without ***enumerating*** it — so a worker can reproduce a subset of the steps and believe it complied.
> The fix is to spell the method's steps out in the row, leaving the invocation/gate boundary exactly
> where ADR-019 put it.** The identical wording in `claude/agents/fkit-coder.md` and
> `claude/skills/fkit-task-ship-loop/SKILL.md` is likewise correct and stays.

### Why the first answer was wrong — the invocation form would re-impose a gate ADR-019 rejected

**I did not cite ADR-019 or ADR-032 anywhere in Round 1** (measured: `/usr/bin/grep -c
'ADR-019\|ADR-032'` over this report returned **0**), and my S10 table **elided the row's own citations
to them**. Both corrected above. With them in view the row reads differently:

- `claude/skills/fkit-task-ship-loop/SKILL.md` §*Step 5* says it outright — *"apply the **method** of
  `fkit-process-stateful-review` (do **not** run that skill's owner gate — this loop's authorization
  replaces it)"*, and its §*Hard rules* — *"used by *method*, not invoked-and-overridden"*.
- ADR-032 keeps `fkit-process-stateful-review` **byte-unchanged**; ADR-019 **explicitly rejected**
  narrowing that skill's owner gate by a cross-skill note. *"Method"* is the construction that lets both
  hold at once: the loop's standing approval replaces the per-round gate **without editing the skill**.
- `claude/agents/fkit-coder.md` names the sprint loop's Process-review worker as one of exactly **two**
  loops carrying that standing approval.

**So *"run `/fkit-process-stateful-review`"* is not a cosmetic alignment with the other rows — it would
re-impose the per-round owner gate the ADRs deliberately replaced, inside a loop whose whole premise is
that the owner approved once, up front.** My Round-1 reasoning ("behaviours look portable, invocations
are hook-gated") described a real hazard but prescribed a remedy that breaks a settled decision. **The
hazard is answered by §5's detector, not by the row's verb.**

### What the row should say instead

Enumerate the method. The measured failure on `0195` was not that the wrong verb was used — it was that
**Steps 0, 2, 3 and 3.5 never ran** (S8). A row that lists the steps makes a partial application
visible to the worker itself, and it changes nothing about who may invoke what.

**S10's anomaly is still real and still one row wide** — this row is the only one that names a skill
without the `/` prefix. But the anomaly is *explained* by ADR-019, not caused by carelessness, and the
right response is to make the row's content complete rather than to change its form.

### Did the wording actually license the hand-application? Yes, and the cost is measured

`0195`'s worker recorded it in those terms — *"The **method** was applied by hand from the spawn
instruction … the skill's own procedure text was never read"* (`worklog.md:191-193`). It did not
improvise; it did what the row licensed. And S8 measures what that cost: **Steps 0, 2, 3 and 3.5 never
ran, and Step 4's prescribed status vocabulary was not used** (`0195/worklog.md:245-260`). The word
*"method"*, **left unenumerated**, did not merely fail to stop the wrong role — **it permitted an
incomplete execution by any role**, which is the larger defect and the one nobody has stated until now.
**That is precisely the defect enumeration fixes and a verb change does not.**

### Residual the row fix does **not** fix

An enumerated row still relies on the driver and the worker reading it. It is the same class of prose
control as (a) — and so was the invocation form I first proposed. **That is why §5's answer is not a
wording change at all.**

---

## §4 — Q3: if (b), does it weaken sole-source-write, and what stops the argument?

### Answer

> **Yes, concretely — not as a slippery slope. And nothing in the argument stops it: it reaches every
> role that authors a deliverable, which is four of seven.**

### The weakening is direct

`fkit-process-stateful-review` **Step 6** applies fixes (S12). `sole source-write authority` is asserted
for the coder in five separate places — `claude/agents/fkit-coder.md:4`, `claude/README.md:98`,
`claude/skills/fkit-team/SKILL.md:24`, `claude/scaffold/CLAUDE.md:24`, and
`claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md:14`. The sprint loop
names it as one of the two things spawning into fresh contexts is meant to protect
(`fkit-sprint-ship-loop/SKILL.md`, *"reviewer independence and the coder's sole-source-write"*).
**(b) would put all five statements into direct conflict with the skill layer while leaving all five in
place** — the class of shipped-stale-statement the `skills-for-role.sh` header records from task 70.

> **⚠️ NARROWED (R10) — my first draft said (b) would make all five *false*. That overstates.** For a
> **document** review, Step 6's *"apply the minimal, idiomatic fix"* is a document edit, which is inside
> the architect's existing authority; the five sentences would not be falsified the moment (b) landed.
> All five were re-verified accurate this turn at the lines cited. **What (b) creates is an authority
> conflict that the grant cannot scope away** — see the asymmetry immediately below, which is the
> argument that actually carries the rejection. **The rejection of (b) stands on that, not on the word
> "false".**

Note the asymmetry that makes this worse than it looks: (b)'s stated motivation is *documents*. But the
grant is not scoped to documents — `skills_for_role()` is a flat list with no conditions, and the hook
does a substring match on it (`case "$owned" in *" $skill_name "*) allow`). **There is no mechanism to
grant the skill "for architect-owned work products only".** The grant is total or absent.

### What stops the argument reaching every authoring role — nothing

The premise is *"the role that owns the artifact should process its review."* Apply it uniformly:

| Deliverable | Author | Would claim the skill under (b)'s premise |
|---|---|---|
| Source | coder | already has it |
| Reports, ADRs, design specs | architect | (b) |
| Task briefs, sprint plans | producer | same claim, same strength |
| Wiki pages | wiki | same claim, same strength |
| Review ledgers | reviewer | same claim — and it would let a reviewer answer its own findings |

**Four of seven roles acquire a source-write procedure, and the reviewer case additionally collapses
reviewer independence.** No principle in (b) distinguishes them. The only stopping rule anyone has
proposed is *"only for architect-owned work products"*, which §above shows is unimplementable.

**The contrast with (a)/(c) is the whole point:** routing the step to its owning role has a natural
stopping rule — *one skill, one owning role* — and it is the rule ADR-033 already chose.

---

## §5 — Q4: what makes the next departure visible in fewer than three tasks?

**First, the question has to be restated (S7).** The brief asks about *"the next disagreement between
the loop's prose and the hook"*. **There was no such disagreement** — the row says `@fkit-coder` and the
hook enforces `coder`. The real question, and the one I answer:

> **What makes the next *driver departure from the role the loop names* visible in fewer than three
> tasks?**

### Answer

> ### ⚠️ AMENDED (R2) — one signal is not enough. The detector must be a PAIR.
>
> **(v) a git-tracked, append-only denial log written by the hook, outside the denied worker's control
> — *and* (i) a mandatory `**Role:**` line in every worklog round.** Each covers a path the other
> misses:
>
> | Path the misroute takes | Reaches the hook? | Caught by |
> |---|---|---|
> | Worker **attempts** the skill and is denied (`0195`) | yes | **(v)** the denial log |
> | Worker is told to apply the method **by hand** and never attempts it (`0158`/`0143`, on the reading the artifacts allow) | **no** | **(i)** the `**Role:**` line |
>
> **~~the only candidate that would have made `0158` visible at task one~~** *(withdrawn — R2)*: the
> hook fires on an **attempted** `Skill` invocation only, so on the never-invoked reading there is no
> denial to persist and (v) alone sees nothing.

Today a denial reaches the record **only through the goodwill of the worker that was denied**. `0195`'s
worker volunteered it under a *"⚠️ Procedural flag, stated rather than buried"* heading — and it had a
denial to volunteer **because it attempted the invocation**: `0195/worklog.md:188-190` records *"this
worker could **not** invoke `/fkit-process-stateful-review` — the `PreToolUse` skill-ownership hook
denied it"*. Three tasks elapsed because two workers did not disclose. **A detector whose output channel
is the accused is not a detector** — but a detector wired only to the hook is blind to the worker that
never knocks on the hook's door. **My own §7 says this** (*"a driver that spawns the wrong role and
tells it to work by hand never reaches the gate"*), and Round 1 did not carry it back into this answer.

### Does the `0191` driver-side clause close the gap? — assessed explicitly (plan E8)

> **⚠️ READ THIS FIRST (R5) — the question below is now moot on the facts.** The clause exists **only**
> in the canonical `claude/skills/fkit-sprint-ship-loop/SKILL.md`. The copy a driver loads,
> `.claude/skills/fkit-sprint-ship-loop/SKILL.md`, is **296 lines and does not contain it** (measured
> this turn; `0191/worklog.md:37` §*"⚠️ Stated limitation — the clause reaches no driver yet"* says the
> same). **It reaches no driver at all**, so it closes nothing regardless of how it is read. The
> reading analysis is kept below because it is the reasoning the ADR-038 follow-up will need once the
> clause does reach a driver — **not** because the answer turns on it.

The clause, uncommitted in the canonical `claude/skills/fkit-sprint-ship-loop/SKILL.md` §Hard rules
(and absent from the runtime copy):

> *"**Never instruct into the territory of a rule in the skill a worker will run without naming the
> owner ruling you relay**"*

**On the broad reading — yes, partially.** *"the skill"* = the skill the step names. The row names
`fkit-process-stateful-review`; its ⛔ banner says *"Any other role: do not execute this."* Telling
`@fkit-architect` to apply its method is instructing into that banner's territory with no owner ruling
named. On this reading the clause forbids the 2026-08-02 spawn.

**On the literal reading — no.** The antecedent is *"the skill a worker **will run**"*. The architect
worker was never going to run it — it cannot. Role selection happens **before** there is a skill the
worker will run, so the clause's condition is never satisfied at the moment the error is made. **Which
reading is "more natural" is contested and is recorded as an accepted residual, not settled here** —
the reviewer reads *"will run"* as binding the driver at instruction time, which on `0195`'s facts
(the worker **did** attempt the invocation) points the other way. **The dispute changes nothing:** on
either reading the clause adds no detection, and per the box above it reaches no driver at all. The
literal reading is reinforced by ADR-037 itself: `adr-037-…md:33`
disclaims *"the invocation axis: which skill a role may run at all"* — which is exactly the axis role
selection lives on. **The clause implements an ADR that says it does not decide this.**

**And on either reading it adds no detection.** Its own text concedes *"**This clause is weaker than
its worker-side twin**"* and *"it reaches no worker."* It is guidance addressed to the actor that
already erred, with no independent signal. **It does not close the gap. It is not "already fixed."**

### The four candidates, assessed against the owner's #2 priority

| # | Mechanism | Would it have caught this? | Latency | Honest verdict |
|---|---|---|---|---|
| **(i)** | **Require a `**Role:**` line per worklog round, and *test* for its presence** | **Yes, for the by-hand path — the one (v) cannot see.** Missing from **2 of the 4** Process-review rounds this session (verified below), which is exactly the gap | 1 task | **Promoted (R2): second half of the recommended detector**, not an optional extra. Unreliable as *disclosure*; reliable once its presence is asserted by a test |
| (ii) | Driver-side pre-spawn check that the step's role owns the step's skill | Only if the driver runs it — the driver is the erring actor | 0 if followed, ∞ if not | Prose control; same class as (a) |
| (iii) | Test: each loop-table row's role owns the skill that row names | **No — S14.** Row and `skills_for_role()` already agree; the test passes today and would have passed on 2026-08-02 | n/a for this defect | **Keep it, re-scoped** — it guards a different real failure (a future edit orphaning the row from the ownership list). Cheap and testable under ADR-014. **The plan's claim that it would have caught this is wrong.** |
| (iv) | The `0191` ADR-037 clause | **No — and it reaches no driver at all (R5)** | n/a | Does not close the gap |
| **(v)** | **Persist the hook's denial to a git-tracked append-only log, outside the worker's control** | **Yes — at task one, *for an attempted invocation*. ⚠️ AMENDED (R2): blind to a by-hand application that never reaches the hook** | **0 tasks, on the paths it covers** | **Recommended — paired with (i), not alone** |

**Verified first-hand for (i):** `/usr/bin/grep -n '\*\*Role:\*\*'` across the session's four
Process-review rounds — `0167/worklog.md` carries exactly **one** `**Role:**` line, at `:3` (the Build
worker); its two Process-review sections at `:204` and `:434` carry **none**. `0190/worklog.md:239` and
`0191/worklog.md:121` both do. **2 of 4 rounds are unattributed**, so today a misroute leaves no trace
in the record more often than it leaves one.

### Feasibility of the pieces (ADR-014: `node --test`, zero devDeps)

Both halves already exist as patterns. `test/skill-ownership-hook.test.js` sources
`skills-for-role.sh` directly and deliberately keeps *"a MIRROR of `skills_for_role()`, not derived from
it — a test whose oracle is the implementation tests nothing"*. `test/skill-frontmatter.test.js` runs a
*"live corpus: every skill SKILL.md frontmatter conforms"* test that walks every `SKILL.md`.
**(iii) and the `**Role:**`-presence guard that makes (i) a detector are ordinary work within existing
patterns.**

**(v) is closer to existing practice than Round 1 claimed. ⚠️ NARROWED (R6):** my `'>>'` probe found
nothing because it detects only *append* redirection. Hook→filesystem persistence **already exists** —
`claude/askuserquestion-marker-hook.sh:57` and `claude/shiploop-marker-hook.sh:64` write
`$cwd/.fkit/state/<marker>-$session_id`, and `claude/turn-completion-hook.sh` reads them back. **What is
genuinely new is not persistence but the *git-tracked* location**: `.fkit/` is gitignored
(`.gitignore:8`), so the existing markers are invisible to the project record — which is the whole point
of the detector. The owner has since ruled the record must be **git-tracked and append-only**, settling
the location question. **The remaining open piece is narrower than Round 1 stated: who is obliged to
read the log, and what asserts that the log itself has not silently stopped being written.**

**Secrets:** the deny string is built only from `role` and `skill_name`, both passed through
`is_identifier()`. A denial log carries no secret. Stated because it goes to git.

---

## §6 — Q5: does the answer need an ADR?

### Answer

> **Yes. And per the owner's ruling at plan approval I do not write it — this report returns
> `NEEDS-DECISION` and the ADR is named as a producer follow-up.**

### Why it is architectural rather than a wording fix

1. **It closes an axis an accepted ADR explicitly left open.** `adr-037-…md:33` — *"Not decided here
   (the invocation axis): which skill a role may run at all."* An open axis in an accepted ADR is
   closed by an ADR, not by a table row.
2. **The rule generalizes beyond this step.** *"A loop step's role is fixed by the skill the step runs,
   not by the deliverable's author"* governs every current and future step in every loop. §4 shows the
   competing premise reaches four of seven roles; a rule that decides which of two general premises
   governs role selection is an architecture decision.
3. **It rejects (b) on the record, so the argument does not return.** Without an ADR's *"Re-raise only
   if"*, the next architect-authored deliverable re-opens this. That is the specific failure the brief
   documents — *"The rule is stated but not reasoned, so it does not survive contact with a
   plausible-sounding exception."*
4. **`0201` is already waiting on it.** Its brief carries *"⚠️ if `0200` rules option (b) this owner
   field does NOT auto-follow — revisit it"*. A named downstream consumer needs a citable ruling.

**Proposed ADR — for the producer to file, not written here:**
*"A loop step's role is fixed by the skill the step runs, not by the deliverable's author."*
Next free number is **038** (highest present in `decisions/` is `adr-037`). ⚠️ **Whoever files it must
not take that on trust** — `/fkit-record-decision` records the ADR-029 incident where a number was
claimed everywhere except `decisions/`. Grep `decisions/`, `reports/`, the sprint boards **and**
`wiki-vault/` before allocating.

---

## §7 — Recommendation

> ### Recommend **(a), with the Process-review row's *method* ENUMERATED (not reworded to the invocation form), and (c)'s PAIRED detector as a non-optional companion.** Reject **(b)**.

**⚠️ AMENDED from Round 1 (R1, R2, R8).** Two changes, both to the *companion pieces*, none to §2's
ruling:
- **R1:** *"reworded to the invocation form"* → *"method enumerated"*. The invocation form would
  re-impose the per-round owner gate ADR-019/ADR-032 deliberately replaced (§3).
- **R2:** the detector is a **pair** — a git-tracked append-only denial log **and** a mandatory,
  tested `**Role:**` line per worklog round. The log alone is blind to a by-hand application.

**Stated as one option:** the routing rule stays where it is and is made explicit, reasoned **and
step-complete** in the loop; the skill's ownership is not widened; and both the hook path and the
by-hand path leave a durable trace, so the next departure surfaces at task one.

**Why, against the owner's ordering:**

| Priority (owner-ruled) | (a) as amended | (b) | (c) alone |
|---|---|---|---|
| **1. Correctness of the routing rule** | **Correct** — matches the skill's coder-owned section, Step 6's source-write, ADR-033's precedent, and `0167`'s attested routing (§2 ground 1, as narrowed) | **Incorrect** — hands a source-write procedure to a design-only role (S12) and generalizes to four of seven (§4) | **⚠️ CORRECTED (R8): on the brief's construction, *not* silent** — the brief's third option already includes stating the row's role *and its reason*. It scored "silent" only against my own narrower construction of (c) |
| **2. Detection latency** | 0 tasks **with the paired companion**; ∞ without it | Worse than today — removes the only signal that surfaced this (S11) | **0 tasks** — its strength |
| **3. Maintenance cost** | One row + a two-part detector | **8 files / 9 sites**, one shipping into every consuming project; permanent precedent | One hook capability + one worklog-contract guard |
| **4. Implementation cheapness** | Cheapest — **and this ranked last; it is not why it won** | Most expensive | Middle |

**(a) does not win by being cheap.** It wins on priority 1, where (b) fails outright. **It does not win
by (c) abstaining** — per R8 the brief's (c) does not abstain, and the recommendation is the **union**
of the two regardless. What (a) contributes that (c) does not is the *enumerated* row; what (c)
contributes that (a) cannot is detection. **Neither half is optional.**

### Main tradeoff I am accepting

**The rule stays prose.** Unlike ADR-033, there is nothing to make *"Process-review is the coder"*
hook-structural — the hook gates skill **invocation**, and a driver that spawns the wrong role and tells
it to work by hand never reaches the gate. **I am accepting a prose rule plus a durable detector in
place of prevention**, and saying so rather than presenting the recommendation as a wall. This is the
same honesty ADR-033 states about its own residual (*"it restores separation of the closing IDENTITY,
not full prevention"*).

### Every file that would change, under the recommendation

| File | Change |
|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | Process-review row: `@fkit-coder` **kept**; *"apply … **method**"* **kept** (ADR-019/ADR-032 convention) and **enumerated** — the method's steps listed in the cell; add one clause giving the reason (coder-owned ledger section + Step 6 applies fixes), so it is not re-derived away. ⚠️ **AMENDED (R1): not reworded to `run /fkit-process-stateful-review`** |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` (worklog contract) | require a `**Role:**` line per worklog round — the second half of the paired detector (R2) |
| `claude/skill-ownership-hook.sh` | `deny()` additionally appends to a **git-tracked, append-only** denial log (owner-ruled 2026-08-05; exact path still to be chosen) |
| `test/` | new test(s): the re-scoped (iii) row↔ownership guard; the denial-log-persistence guard; the `**Role:**`-line presence guard |
| `ai-agents/knowledge-base/decisions/adr-038-*.md` | the ADR (**producer files it — not written here**) |
| *(the denial log itself)* | a new git-tracked file created by the hook — **path not yet fixed** |

**Zero mirror updates.** `skills_for_role()` is untouched, so none of the four declared mirrors move.

> **⚠️ Brief verification step 5 is satisfied only in part, and I say so rather than implying otherwise
> (R12).** `brief.md:195` requires the recommendation to list *"**every file** that would change"*. Two
> rows above are not single files: `test/` is a directory (the number of new test files is an
> implementation choice), and the ADR path is a wildcard until the number is confirmed (§6). The denial
> log's **path** is still open even though the owner has now fixed its **shape** (git-tracked,
> append-only). **Everything that is not yet a filename is listed as such above; nothing is concealed.**

### The four mirrors, enumerated even though (b) is rejected (plan E4)

Costed so the rejection is informed, not assumed —
`claude/skills/fkit-team/SKILL.md` (two rows), `claude/README.md`,
**`claude/scaffold/CLAUDE.md` — which ships into every consuming project's root `CLAUDE.md`**, and
`ai-agents/knowledge-base/architecture.md`. **Plus the undeclared sites in S13.** **8 files / 9 sites**
(⚠️ **CORRECTED (R9)** — Round 1 said *"nine files"* here and twice more; that conflated files with
sites), and the checklist that is supposed to enumerate them lists four.

---

## §8 — Follow-ups for the producer to file

One line each, naming the file or decision it touches. **I file none of these.**

1. **⚠️ RE-SCOPED (R1) — ~~Reword the Process-review row to the invocation form~~. Instead: *enumerate
   the method's steps* in the Process-review row, and give the row its reason.**
   `claude/skills/fkit-sprint-ship-loop/SKILL.md`, step-2 table. **Do NOT change *"apply … method"* to
   *"run `/fkit-process-stateful-review`"*** — that construction is the settled ADR-019 / ADR-032
   convention (the loop's up-front approval replaces the skill's per-round owner gate), and switching
   it would **re-impose the gate ADR-019 explicitly rejected**. The measured failure on `0195` was
   skipped Steps 0/2/3/3.5 (S8), which enumeration fixes and a verb change does not.
   ⚠️ **SCOPE THE ENUMERATION (R13) — this follow-up must carry §3's guard, because §8 is the section
   filed from.** Enumerate the steps *"leaving the invocation/gate boundary exactly where ADR-019 put
   it"*: the skill's **per-round owner approval gate is replaced by the loop's single up-front
   approval** (ADR-019, ADR-032) and must **not** be enumerated into the row. Verified against
   `claude/skills/fkit-process-stateful-review/SKILL.md` this turn, that gate is three quoted clauses
   inside **Steps 4–6** — §*"Step 4 — Assign verdicts and write the Coder response rows"*'s *"set Status
   = **`pending approval`** (nothing is applied yet)"*; §*"Step 5 — Report + convergence call, then gate
   on approval"*'s *"**wait for my explicit approval** before changing any code"*; and §*"Step 6 — Apply
   approved fixes + update the shared file"*'s *"**Once I explicitly approve** specific findings"*
   precondition. **Carve out those clauses, NOT the steps wholesale** — the non-gate work in the same
   steps stays in: writing the *Coder response* rows (Step 4), and updating those rows, *Accepted
   residuals* and the `closed-out` header (Step 6). A blanket *"every step except 4/5/6"* fails in the
   opposite direction — it would drop *"write the Coder response"*, which the **on-disk gloss puts
   squarely in scope**: `claude/agents/fkit-coder.md` §*"As the Process-review worker:"* and this same
   Process-review row both already read *"verify each finding, classify defect/frontier, write the
   *Coder response*"*. **Match that gloss; do not re-derive it.** `fkit-coder`. Small.
2. **File ADR-038 — *"A loop step's role is fixed by the skill the step runs, not by the deliverable's
   author."*** `ai-agents/knowledge-base/decisions/`. `fkit-architect`, on the owner's sign-off.
   Re-check the number against `decisions/`, `reports/`, the boards **and** `wiki-vault/` first (§6).
3. **⚠️ RE-SCOPED (R2) — build the detector as a PAIR, and file it as one follow-up so neither half
   ships alone.** (i) `claude/skill-ownership-hook.sh`: `deny()` appends to a **git-tracked,
   append-only** denial log (shape owner-ruled 2026-08-05; **path still to choose**) — this covers an
   **attempted** invocation. (ii) a **mandatory `**Role:**` line per worklog round** — this covers the
   **by-hand** application, which never reaches the hook and is the path `0158`/`0143` most likely took.
   ⚠️ **Persistence itself is not new ground (R6)** — `askuserquestion-marker-hook.sh:57` and
   `shiploop-marker-hook.sh:64` already write under `.fkit/state/`; the new part is that `.fkit/` is
   **gitignored** (`.gitignore:8`) and this record must not be. `fkit-architect` → `fkit-coder`.
   **Supersedes follow-up 6, which is its second half.**
4. **Add the row↔ownership test, scoped honestly.** `test/` — assert every loop-table row's role owns
   the skill that row names. ADR-014, `node --test`. ⚠️ **The brief must say it does not catch a driver
   departure** (S14); it catches a future edit orphaning the row from `skills_for_role()`. `fkit-coder`.
5. **Repair the four-mirror checklist in `claude/skills-for-role.sh`'s header — it is incomplete
   again.** It omits the skill's own ⛔ banner, `claude/agents/fkit-architect.md`, and the second
   `fkit-team/SKILL.md` row (S13). ⚠️ **CORRECTED (R9): `claude/agents/fkit-coder.md` is NOT one of
   them** — the coder keeps the skill under any option, so that file stays true. **Also add the
   stale-text sites S13's under-count note found**: `claude/agents/fkit-reviewer.md:41` and
   `claude/skills/fkit-stateful-review/SKILL.md` (`:47`, `:132`). **This is the task-70 failure mode
   recurring in the checklist that documents task-70.** Independent of this ruling. `fkit-coder`.
6. **~~Require a `**Role:**` line per worklog round, and test for it.~~ FOLDED INTO follow-up 3 (R2)** —
   it is the half of the paired detector that covers the by-hand path, and filing it separately is what
   would let the weaker single-signal version ship. 2 of 4 Process-review rounds this session lack one.
   Touches the loop's worklog contract + `test/`. `fkit-coder`.
7. **Correct ADR-012's stale source-of-truth path** — `adr-012-…md:175` still says
   `claude/fkit-claude.sh:92-103`; it is `claude/skills-for-role.sh`. Adjacent to `0195`'s ADR-010
   repair; may already be covered — **check before filing.** `fkit-coder`.
8. **Assess follow-up 3's denial record as a new site under ADR-036's registry** (`0189`/`0194`).
   Stated here rather than waiting, per the brief. `fkit-architect`.

---

## §9 — Caveats, limits, and the recorded observation

**The merit contention (owner-ruled Q-C: record, do not re-rank).**
`0195` and `0200` both claimed *"directly above `0162`"* on merit. Measured on the board today:
`ai-agents/sprints/sprint-2.md:205` — `0195` is `✅ Done (agent-closed — not owner-verified)` at **P173**;
`:210` — `0200` is `🔄 In progress` at **P178**. **`0195` has shipped, so the contention is moot in
practice.** Per the owner's ruling: **no row moved, nothing was renumbered, `0200` keeps its P178
append rank** (ADR-035). Recorded here only so it is visible in one place.

**What I did not verify, and why.**
- **`0158` and `0143`.** I did not read or re-derive them. `0201` owns that audit and its brief records
  that **the artifacts cannot distinguish** whether the skill was never invoked or a denial went
  unrecorded. **Cited; nothing further asserted.**
  > **⚠️ CORRECTED (R2) — I wrote that my §5 argument *"does not depend on which reading is true — it
  > holds either way"*. That was FALSE as Round 1 scoped the detector.** The two readings are not both
  > "a denial leaving no durable trace": on the **never-invoked** reading **there is no denial at
  > all**, because the hook only fires on an *attempted* `Skill` call. A hook-only detector therefore
  > sees nothing on that reading — and that is the reading `0158`/`0143` most plausibly took. **This is
  > why §5's answer is now a *pair* of signals.** With the `**Role:**` half added, the argument does
  > hold either way; with the log alone it did not, and I should not have claimed it did.
- **The driver's internal reasoning on 2026-08-02.** Not verifiable from the tree. `0195`'s worklog and
  the brief are consistent accounts; I treat them as testimony, not measurement.
- **`/fkit-evaluate-approach` Step 1's owner interview.** Not executed (ADR-021). Recorded at the head
  of this report, not skipped.

**ADR-036 / `0189` deferral.** The skill-ownership site registry has no tooling —
`test/skill-ownership-sites.mjs` is absent from `test/`'s 16 files. **S13's undeclared sites — two new
files, one second site in an already-declared file, and three stale-text sites (as corrected by R9) —
were all found by grep, by hand.** An option-(b) assessment against the registry has nothing to run
against, and follow-up 5 exists because the hand-maintained list is what we have. **Said here rather
than waiting on `0189`**, per the brief.

**Naming-precedent divergence, flagged not resolved.** `/fkit-evaluate-approach` mandates
`reports/YYYY-MM-DD-eval-<topic-slug>.md`, and this file follows it. But only **3 of the 28 reports in
`ai-agents/knowledge-base/reports/` carry the `eval-` prefix — and one of the three is this report**
(⚠️ **CORRECTED (R11)**: Round 1 said *"2"*, having omitted itself from its own count), and the five most recent architect
reports — including `0167`'s `2026-08-04-sprint-driver-response-to-a-dead-worker.md` — do not. **The
skill's rule is the rule; the divergence is real and out of scope. Not filed.**

**The `0191` clause is uncommitted working-tree text** and may change or be committed. §5 cites it by
file + heading + quoted phrase, so a commit does not invalidate the citation. ⚠️ **CORRECTED (R5): its
reach today is *zero*, not merely disputed** — the clause is absent from the runtime
`.claude/skills/fkit-sprint-ship-loop/SKILL.md` (296 lines, measured this turn) and exists only in the
canonical `claude/` source. Committing it does not change that; only a `fkit-claude-init.sh` refresh
would.

**Also open, and not a caveat I can close from here:** the ADR-036 site registry has no tooling, so
**every "which files would change" count in this report is a hand grep, including the corrected 8 / 9
in §1(b) and §7.** Round 1's counts were wrong twice in opposite directions (R9); a second hand count
is not a guarantee, only a better estimate. **This is the reason follow-up 5 exists.**

**Limits of this ruling.** It decides which role runs the Process-review **step**. It does not decide
which role may run any other skill, does not reopen ADR-018/ADR-033/ADR-037, and does not change
`skills_for_role()`. The rule it proposes is **prose plus a detector, not prevention** — §7 states that
tradeoff rather than burying it.
