# ADR-045: A reviewer's in-flight finding terminates in the review ledger, not in a new task folder

- **Status:** accepted
- **Date:** 2026-08-30
- **Deciders:** owner (Mark Dolbyrev), ruling live via `AskUserQuestion` in a `fkit lead` session on
  2026-08-29 — option label, verbatim: *"Narrow it — in-flight review fixes only (Rec)"*; four further
  rulings on this ADR's own open questions given the same way on 2026-08-30. Recorded by fkit-architect
  under task `0352`.
- **Scope:** where a **reviewer's finding on the diff already in front of them** is recorded. It does
  **not** change what a review finds, what a review demands, or when a review closes. ⛔ It exempts **no**
  category of new work from filing a brief.

---

## Context

### The problem, and why neither of today's two answers is right

A reviewer working a diff finds a defect **in that diff**. There is no written route for it, so in
practice it becomes one of two things, and both are wrong:

- **An untracked in-place fix** — invisible. Nothing on any board records that the code changed.
- **A new task folder** — which manufactures a record-repair row for something that could have been
  closed inside the review that found it.

Sprint 7's stated success criterion is to **cap record-repair rows**, and this is one of its two
structural causes. The six-week retro of 2026-08-29
(`ai-agents/knowledge-base/reports/2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md`)
measured **record repair at 42 of 129 open rows — 33%** by a stated, re-runnable title rule, and
carries its own same-day correction upward from an earlier draft's 29%: *"The original figure
**understated** the problem. **Use 42 / 33%, and use the rule, not the theme**"*.

### The route already half-exists — this ADR invents no mechanism

The stateful review pair already round-trips findings through a `review.md` ledger inside the task
folder:

- `claude/skills/fkit-stateful-review/SKILL.md` — the reviewer owns the *Reviewer findings* table and
  the ledger header, and appends *"one row per **novel** finding … id (`R<next>`), the current
  **Round**, **Sev** …, `file:line`, and a one-line **Claim**"*.
- `claude/skills/fkit-process-stateful-review/SKILL.md` — the coder owns the *Coder response* table,
  verifies each finding, classifies defect vs frontier-move, and then *"**wait[s] for my explicit
  approval** before changing any code"* before applying anything.

**This ADR's whole job is to say when that ledger is the terminus, and when a finding must still leave
it as a brief.** Everything it decides is a rule about an existing artifact.

### The owner's ruling, quoted — its narrowness is the point

The binding description put to the owner with the chosen option, 2026-08-29:

> *the lane covers ONLY a fix a reviewer finds on a diff already in front of them. It exempts no new
> work and needs no size judgement at filing time — it just stops a reviewer's own finding from
> becoming a task folder. Your standing rule survives untouched.*

### ⭐ The measurement that shaped the entry condition

The entry condition below reads two ledger header fields. **Before writing it, I counted whether those
fields are actually readable across the ledgers that exist.** Measured 2026-08-30 by a per-file loop
over every `ai-agents/tasks/*/*/review.md`:

| Fact | Count |
|---|---|
| Review ledgers on disk | **130** |
| Carrying a `File(s) under review:` field | **127** (3 have none) — of those 127, **12 carry it empty** |
| `Status:` value beginning `in-review` | **43** |
| `Status:` value beginning `closed-out` | **63** |
| `Status:` value beginning with **neither** | **22** — e.g. `**closed-out**` (bolded), `converged`, `resolved`, `coder-responded (Round 1)`, `CLOSED` |
| No `Status:` line at all | **2** |

⭐ **So 24 of 130 ledgers — 18% — do not expose a mechanically readable `Status:` value today.** An
entry condition that reads that field must state what happens when it cannot be read. This ADR rules
that case explicitly (§1, condition E) rather than leaving it to be discovered mid-review.

### A superseded proposal, named so it is not revived

A prior scoping pass proposed amending `/fkit-task-brief`'s standing rule with **a size floor**. The
owner **rejected that shape** and chose the narrow lane above. It appears in *Options considered* as
rejected, with that ruling as the reason. ⛔ It is not written as revivable.

---

## Decision

**A reviewer's finding that is in-flight — raised in this review, about the diff under review, in a
review that has not closed — terminates in the task folder's `review.md` ledger. It does not become a
new task folder. Every other finding files a brief.**

The seven sections below are the decision. Each is binding.

---

### §1 — The entry condition: three field reads, no judgement call

A finding is **in-flight** when **all three** hold. Each condition is proved by a field that **already
exists** in the ledger schema shared by `fkit-stateful-review` and `fkit-process-stateful-review`:

| # | Condition | Proving artifact (already exists) |
|---|---|---|
| **A** | The finding **came from this review** | It is a row in the ledger's `## Reviewer findings` table carrying this pass's `Round` |
| **B** | The finding is **about the diff under review** | Its `file:line` cell names a file inside the ledger header's `File(s) under review:` field |
| **C** | The review **has not closed** | The ledger header's `Status:` reads `in-review` |

**⛔ The anti-widening rule — stated as a rule, not a hope:**

> ⛔ **The `File(s) under review:` field is not edited to admit a finding.** It records the diff the
> review opened on. Widening it mid-review is not admitting a finding to the lane — it is reviewing a
> different diff, which is a new review.

**⛔ Condition E — an unreadable gate is a closed gate.**

If any of the three artifacts is **absent, empty, or written in a form the condition cannot read** — a
missing or empty `File(s) under review:`, a `Status:` line that is absent or reads anything other than
`in-review` / `closed-out` — the finding is **not** in-flight and **files a brief**.

This is deliberately self-correcting in the safe direction. It costs nothing to a reviewer who wants
the lane: the reviewer **owns the ledger header** (`fkit-stateful-review`: *"You **own the ledger
header**"*) and can write the field conformingly. It is ruled this way because of the measurement
above — **24 of 130 existing ledgers would fail condition C's read today**, and a gate that fails open
on 18% of the corpus is not a gate.

---

### §2 — The route: the ledger is declared the terminus

Nothing new is written and no parallel store is created. The route is the existing pair, unchanged:

- **The reviewer** writes the finding as a row in `## Reviewer findings` (`fkit-stateful-review`,
  Step 4 — *"a **docs-only** write: it changes no code, and it never touches *Coder response*"*).
  **Unchanged.**
- **The coder** writes one `## Coder response` row (`fkit-process-stateful-review`, Step 4), gates any
  code change on the owner's explicit approval (Step 5), and applies only what was approved, then sets
  that row's `Action` and `Status` (Step 6). **Unchanged.**
- **What a reader finds six months later** is that pair of rows, in the task folder that carried the
  diff, at `ai-agents/tasks/<board>/<NNNN>-<slug>/review.md`: what was found, where, the verdict, and
  what was done about it.

⭐ **One content requirement is added, and it is the lane's audit trail:**

> **Where a lane fix changes code, the `Action` cell names the files it touched.**

That makes the lane's whole footprint inside a task readable from one table, and countable later
(§6, check 3). It is a content rule for an **existing** cell. ⛔ **This ADR decides it; a follow-up
skill edit implements it** (§7). Nothing changes behaviour until that edit ships.

---

### §3 — The hard limits, each ruled by name

| # | Case | Ruling |
|---|---|---|
| **1** | Finding **out of scope of the diff** | ⛔ **Does not use the lane.** Condition B fails. It **files a brief.** Out-of-scope work is new work, and the owner's ruling exempts no new work. |
| **2** | Finding arriving **after the ledger closes** | ⛔ **Does not use the lane.** Condition C fails. It **files a brief.** Named against **ADR-034** — see §4. |
| **3** | Finding the coder **disputes**, or the owner rules against | ✅ **The lane still terminates it — when it is *resolved*, not merely argued.** The terminal set is the ledger's **existing** Status vocabulary: **`✅ done`**, **`disproven`**, **`won't fix (frontier)`** and **`closeout (re-litigation)`** all terminate in the ledger. **`pending approval` and `blocked` do not** — a finding a review ends on either of those, or one the owner agrees is real but **defers**, is unresolved work and **files a brief**. ⭐ This is not a new bar: it is exactly the ledger's own close condition, so the lane cannot terminate a finding the ledger itself would not close over. |
| **4** | A **large** in-scope in-flight fix | ✅ **Stays in the lane.** Size is irrelevant, by the owner's ruling of 2026-08-29. What stops this becoming a hiding place is §6 — and the first line of that answer is that **the owner's per-finding approval gate is untouched**. |
| **5** | Finding raised in an **ephemeral** review | ⛔ **The lane requires a stateful ledger.** `fkit-review` writes *"no persistent file — no ledger, no shared doc"*, and `fkit-process-review` *"never reads or writes a stateful review `.md` file"*. Conditions A–C therefore have no artifact to read, so condition E already closes the gate. It is stated explicitly here so it is not rediscovered mid-review. **A team that wants the lane runs the review stateful.** |

> ⚠️ Limit 5 is **beyond** the brief's four. It is flagged as an **addition**, not a substitution — the
> brief's four are all ruled above, individually and by name.

---

### §4 — Interaction with ADR-034

Three points, each stated rather than left to discovery.

**1. A lane finding is a work-product defect by construction.** Condition B places it inside the
reviewed diff, which is
[ADR-034](adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)'s
**work product** surface. ADR-034 rules that *"A defect in the **work product** — the artifact the task
exists to change — still **blocks**, and still drives another review round."* ⭐ **This ADR relaxes
nothing in that bar.** A lane finding blocks the close and drives another round exactly as before.

**2. ⛔ `Accepted residuals` is not a parking space for a defect.** Under ADR-034 that row is for a
frontier-move or an own-record residual. Recording a real in-scope defect there to avoid **both** a fix
**and** a brief is the abuse this ADR forbids by name.

**3. The closed-ledger edge — limit 2, named by ADR number.**

> ⚠️ **An accuracy note, because the natural shorthand is wrong.** ADR-034 establishes that
> `closed-out` is the ledger's terminal state and what bar sets it. **It does not use the word
> "frozen"** — I grepped ADR-034 and the whole conventions folder on 2026-08-30 and the word is absent
> from both. This ADR therefore **derives** the edge from ADR-034's close bar rather than putting a
> word in its mouth: a closed ledger is the **completed record of a finished review**, and a finding
> raised afterwards was not part of that review. So it fails condition C and files a brief.
>
> Where the **don't-edit-a-closed-record** rule is wanted, it lives in
> `claude/skills/fkit-task-done/SKILL.md`, which states it as *"a historical record's **claims** are
> frozen; its **links** are not"* — and which names the ledger's `File(s) under review:` line among the
> things that **stay frozen**, because *"its job is to record what was reviewed, not where the brief
> is"*. That wording is `fkit-task-done`'s, **not ADR-034's.**

---

### §5 — What is unchanged ⛔ (mandatory section)

**`/fkit-task-brief`'s standing rule is untouched, byte-for-byte.** Quoted verbatim from
`claude/skills/fkit-task-brief/SKILL.md`:

> *"All tasks should be split into the smallest possible shippable tasks. If a part of a bigger
> system can be developed, tested and shipped separately, it's worth creating a sub-task for it and
> splitting the bigger task. Sometimes the producer can make that decision themselves; sometimes they
> need to consult the architect to clarify the technical scope."*

Its step-3 test is likewise unchanged: *"The test is **independent shippability**, not size or
effort."*

- ⛔ **No category of new work is exempted.** The lane changes **where a reviewer's finding on the diff
  in front of them is recorded**. It exempts nothing from filing.
- ⛔ **There is no size floor**, in any form, at any point in this ADR. The lane is defined by **where
  the finding came from**, never by how big the fix is.
- ⛔ **`/fkit-task-brief` is not amended by this ADR.** Naming it as a follow-up (§7) is the whole of
  this ADR's reach into it.

⚠️ Without this section a later reader would read the lane as a general small-fix exemption — which is
precisely the shape the owner rejected.

---

### §6 — ⭐ What stops the lane becoming a hole

**The failure mode, named: *scope creep by review*.** Work that would have been a ranked,
owner-visible board row gets performed inside a review round and never appears on any board. The
symptom is the retro's own warning realised backwards — the created-per-closed ratio improves while
the work volume does not. The retro states the trap directly:

> *"**The target is not 'fewer open tasks.'** … If open count falls while the rework share holds,
> nothing was fixed."*

**Three checks, cheapest first:**

1. ⭐ **Structural, and already in force — the owner's consent gate is untouched.**
   `fkit-process-stateful-review` Step 5 ends *"**wait for my explicit approval** before changing any
   code"*, finding by finding, and Step 6 applies only what was approved. **The lane removes filing
   ceremony, not consent.** Nothing enters the lane that the owner did not see and approve. This is
   the load-bearing answer to limit 4.
2. **Boundary — the scope test plus the anti-widening rule** (§1 condition B and the ⛔ rule beneath
   it). Size does not gate the lane; **scope does** — and the scope field cannot be edited to let
   something in.
3. **Observable — the `Action` cell names the files touched** (§2). The lane's footprint is then
   countable from the ledgers, so the next re-measurement against the retro's baseline can separate
   **ceremony removed** from **work absorbed**.

---

### §7 — Follow-ups: named, not edited

⛔ **No skill file is edited by this ADR.** Nothing changes behaviour until these ship. Filing them is
the **producer's** act, after this ADR is accepted.

| Skill | Why it is bound |
|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md` | The reviewer decides in-flight vs not, and owns the header fields conditions B and C read |
| `claude/skills/fkit-process-stateful-review/SKILL.md` | The coder's `Action` cell must name the files a lane fix touched (§2) |
| `claude/skills/fkit-review/SKILL.md` | Ephemeral — must say the lane is unavailable and why (limit 5) |
| `claude/skills/fkit-process-review/SKILL.md` | Same |
| `claude/skills/fkit-task-brief/SKILL.md` | Must point at this lane so an in-flight finding is not filed as a brief by reflex — ⛔ **its standing rule is not amended** (§5) |
| ⚠️ `claude/skills/fkit-task-ship-loop/SKILL.md` — **a sixth candidate** | Its close report may need to mention lane-terminated findings, or the lane is invisible in the close and a reader cannot see what the review absorbed. **Named as a candidate by owner ruling of 2026-08-30** (label: *"Name it as a candidate (Rec)"*); ⛔ **filing it remains the producer's act** |

⚠️ **One open question is carried, and this ADR settles nothing about it.** Task `0362`
(`ai-agents/tasks/backlog/0362-settle-who-runs-process-review-on-an-architect-owned-task/`) records
that the ship-loop's Process-review step is **coder-owned**, while
[ADR-044](adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) can staff
Build to a non-coder — in which case the ADR-018 skill-ownership hook denies the skill. The lane routes
through `fkit-process-stateful-review`, which is coder-owned, so the lane **touches** that question.
⛔ **`0362` owns it; this ADR names it and rules nothing.**

---

## Options considered

- **The narrow in-flight lane (chosen).** The owner's ruling of 2026-08-29. It is defined by **where a
  finding came from**, needs no size judgement at filing time, and reuses a ledger that already exists
  — so it removes filing ceremony without touching the standing rule, the review bar, or the consent
  gate.
- **⛔ A size floor on what needs a brief (rejected).** A prior scoping pass proposed amending
  `/fkit-task-brief`'s standing rule with a size floor. **The owner rejected that shape by name on
  2026-08-29** and chose the narrow lane instead. It is recorded here so a later reader can tell a
  **rejected** option from an **unconsidered** one. ⛔ It carries no revival clause.
- **Leave it unwritten (status quo). Rejected.** A reviewer's finding today becomes either an
  invisible in-place fix or a record-repair row. The retro measured record repair at **42 of 129 open
  rows (33%)** on 2026-08-29 by a stated, re-runnable title rule. Doing nothing keeps paying that.
- **A new parallel store for in-flight fixes. Rejected**, not seriously considered. The `review.md`
  ledger already carries a reviewer section, a coder section, verdicts, and a residuals section. A
  second store would need its own close condition, its own ownership rules, and its own conventions —
  and would fragment the record a later reader has to reassemble.

---

## Consequences

### Positive

- A reviewer's finding on the diff in front of them stops manufacturing a record-repair row, which is
  one of the two structural causes Sprint 7 set out to cap.
- The lane needs **no size judgement** at filing time — the entry condition is three field reads.
- The record is **not lost**: it lives as a findings row plus a response row in the task folder that
  carried the diff, with the verdict and the action attached.
- Nothing new is built. Every artifact the condition reads already exists.
- The `Action` cell naming the files touched makes the lane's footprint **countable**, so its effect
  can be measured rather than assumed.

### Negative / costs — accepted explicitly

- **⚠️ Lane work never appears on a board.** That is the point, and it is also the cost: a fix that
  happens in the lane is visible in the ledger and nowhere else. §6's three checks are what keep that
  honest; the re-raise conditions below are what reopen it if they do not.
- **⛔ Nothing changes behaviour until the §7 follow-ups ship.** This ADR is a decision, not an
  implementation. A close report or a status briefing implying the lane is live has **misreported**.
- **⚠️ The gate is strict against non-conforming ledgers.** 24 of 130 ledgers on disk today would fail
  condition C's read (measured 2026-08-30) and their findings would file briefs. This is deliberate —
  an unreadable gate is a closed gate — but it means the lane is unavailable on a ledger until its
  header is written conformingly.
- **The stateful/ephemeral split becomes load-bearing.** Limit 5 means the choice of review mode now
  decides whether the lane exists at all.
- **Condition B needs a per-finding scope read.** It is a field read, not a size judgement, but a
  finding whose `file:line` sits at the edge of the reviewed diff still needs someone to look.

### Residual risks / "re-raise only if"

Re-raise this decision only if one of these holds:

- A lane-terminated fix is found to have shipped a **behaviour change that no brief and no ledger row
  describes**; or
- A `File(s) under review:` field is found **edited mid-review to admit a finding** (the §1
  anti-widening rule breached); or
- The created-per-closed ratio falls **while the volume of code changed per task rises** — the lane
  absorbing work rather than removing ceremony; or
- ⚠️ **The scope-field growth case, flagged honestly as unresolved.** An approved lane fix legitimately
  touches a file the reviewed diff did not — a new test, most obviously. This ADR rules the
  anti-widening case it can rule (*not edited to admit a finding*) and does **not** invent a mechanism
  for the append-on-approved-fix case. If that case is observed to be either blocking real fixes or
  serving as a back door into the lane, reopen it.

⛔ **Do not re-raise this merely because a lane fix turned out to be large.** Size was ruled irrelevant
by the owner on 2026-08-29, and limit 4 rules it explicitly.

⛔ **Do not re-raise the size floor.** It was proposed, put to the owner, and rejected by name on the
same date.

---

## Related

- `ai-agents/tasks/backlog/0352-adr-the-narrow-in-flight-review-fix-lane/` — the task this was recorded
  under, carrying the owner's ruling of 2026-08-29 and its binding description.
- `ai-agents/knowledge-base/reports/2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md` —
  the 42 / 33% record-repair measurement and the *"the target is not 'fewer open tasks'"* warning.
- `claude/skills/fkit-stateful-review/SKILL.md` · `claude/skills/fkit-process-stateful-review/SKILL.md`
  — the ledger schema and the round-trip this lane declares terminal.
- `claude/skills/fkit-review/SKILL.md` · `claude/skills/fkit-process-review/SKILL.md` — the ephemeral
  pair that limit 5 excludes.
- `claude/skills/fkit-task-brief/SKILL.md` — the standing rule §5 leaves untouched.
- `claude/skills/fkit-task-done/SKILL.md` — where the don't-edit-a-closed-record rule actually lives.
- [ADR-034](adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md) — the
  ledger close bar this lane's condition C reads, and whose work-product bar §4 leaves strict.
- [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) — the task-folder model that
  makes `<task-folder>/review.md` a well-defined home for the record.
- [ADR-044](adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) ·
  `ai-agents/tasks/backlog/0362-settle-who-runs-process-review-on-an-architect-owned-task/` — the open
  question §7 names and does not settle.
- [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md) — why this ADR writes no wiki page;
  **fkit-wiki** should ingest it.
- `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` — why every citation above is a
  file plus a quoted phrase, never a naked line number.
