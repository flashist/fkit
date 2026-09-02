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

⭐ **So 24 of 130 ledgers — 18% — did not expose a mechanically readable `Status:` value.** An entry
condition that reads that field must state what happens when it cannot be read. This ADR rules that case
explicitly (§1, condition E) rather than leaving it to be discovered mid-review.

⚠️ **The table above is a dated snapshot, and the corpus has moved since. Re-measured 2026-09-02** over
the **131** ledgers on disk: `in-review` **43**, `closed-out` **65**, neither **22**, no `Status:` line
**1** — and **129** carry a `File(s) under review:` field (2 have none), of which **12** are empty.
⚠️ **An earlier re-measure the same day read `in-review` 44 and `closed-out` 64. The difference is one
row moving, not corpus drift:** this ADR's own task ledger (`0352`) was still `in-review` when that
reading was taken, and closed before this one. ⛔ The
headline is **unchanged at 24 — 18%**, because the reader §1 chooses also fails the one NUL-bearing ledger
that this reader counts under `closed-out`. Stated here so a reader re-running the loop today is not
surprised by the row-level drift.

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

### §1 — The entry condition: three reads at the gate — ⚠️ two are field reads, one is not yet

A finding is **in-flight** when **all three** hold. Conditions **B** and **C** are proved by fields that
**already exist** in the ledger schema shared by `fkit-stateful-review` and
`fkit-process-stateful-review`. ⚠️ **Condition A is not** — the seeded-row rule below says what it reads,
and states the gap plainly rather than papering it over.

| # | Condition | Proving artifact |
|---|---|---|
| **A** | The finding **came from this review** | It is a row in the ledger's `## Reviewer findings` table carrying this pass's `Round`, **and the finding originated in this review's own reviewer pass** — ⚠️ the second half has **no field** today; see the seeded-row rule below |
| **B** | The finding is **about the diff under review** | Its `file:line` cell names a file inside the ledger header's `File(s) under review:` field |
| **C** | The review **has not closed** | The ledger header's `Status:` value **begins** `in-review`, read exactly as *How `Status:` is read* rules below |

**⛔ Condition A bars a finding that originated outside this review — and ⚠️ it is not a field read.**

`fkit-process-stateful-review` Step 1 directs the coder that *"If findings arrived as pasted text rather than
already in the file, first append them as rows to *Reviewer findings* (that's seeding the reviewer's section
on their behalf — note it)"*. Such a row carries the current `Round` and would otherwise satisfy condition A
on its face. A asks where the finding **came from**, so:

- ⛔ **What the rule bars is an origin, not a transport.** A finding that did **not** originate in this
  review's own reviewer pass — an ephemeral review's findings, or any other external source — does not
  satisfy A however it reached the table, and **files a brief**. That is what stops limit 5 being walked
  around by pasting an ephemeral review's findings into a stateful ledger.
- ✅ **A row seeded from findings that did come from this review's reviewer pass still satisfies A.** In
  particular `fkit-process-stateful-review` **Step 0's own bootstrap path** — where the coder creates a
  missing ledger and *"seed[s] *Reviewer findings* from whatever findings you were handed"* — is **not
  barred by that fact alone; the origin test still applies to whatever was handed.** ⚠️ The
  qualification matters because that path carries **no origin guarantee** — it is taken precisely when
  findings arrived without a ledger, the same arrival shape an ephemeral review's findings have. Being
  seeded at Step 0 is a **transport**, and the bullet above rules that transport is not what A tests.
  Barring the path outright would file briefs for exactly the findings this lane exists to hold; exempting
  it outright would re-open the limit-5 walk-around A exists to close.

⚠️ **The gap, stated rather than papered over: origin is not a field, so this read is a judgement.** The
*Reviewer findings* schema is `# · Round · Sev · file:line · Claim` in **both** skills — no author, origin
or seeded column — and Step 1 asks only for an unstructured *"note it"*. A row's origin is therefore
knowable only from outside the ledger, and nothing marks a seeded row. ⛔ **Like the anti-widening rule
below, this rule binds the reviewer and the coder; it does not prevent them** — the same candour §6 check 2
carries. §7 names the follow-up that closes it: a durable provenance field, after which condition A becomes
a field read like B and C.

⚠️ **For the record, so a later reader does not read the confirmation as uninformed:** the owner confirmed
this rule after round 1, **before** the evidence above existed, and **re-confirmed it on 2026-09-02 with
that evidence in view** — option label, verbatim: *"Keep it, file a follow-up for a real field (Rec)"*.

**⛔ The anti-widening rule — a rule the reviewer is bound by. ⚠️ See §6 check 2 for what does and does not
enforce it:**

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
above — **24 existing ledgers, 18% of the corpus, would fail condition C's read** under the reader and
match rule fixed immediately below (24 of the 130 measured 2026-08-30, and 24 of the 131 on disk
2026-09-02), and a gate that fails open on 18% is not a gate.

**⛔ How `Status:` is read — the match rule is *prefix*, and the reader is one in which a stray NUL byte
makes the whole file unreadable.**

The condition was silent on both, and both change the answer. Both are fixed here so the §7 follow-up
implements one thing rather than guessing:

- **Match rule: prefix, not exact.** The gate passes when the value after `Status:` **begins** `in-review`.
  A decorated but open value such as `in-review (Round 2)` therefore passes; `**closed-out**` (bolded),
  `converged`, `resolved` and `CLOSED` all fail, and their findings file briefs.
- **Reader: one in which a stray NUL byte anywhere in the file makes the *whole file* unreadable.**
  Stated as a **behaviour**, not as a tool: the gate's read is the one that yields no `Status:` line at
  all from a file carrying a NUL, so such a header is *"written in a form the condition cannot read"* and
  condition E fires. ⛔ **No tool is named here, as definition or as example.** ⚠️ An earlier draft named
  one; the naming did not survive re-measurement and is recorded as **removed** rather than quietly
  swapped — see `0352`'s review ledger, finding R15.
- ⚠️ **It is the *file*, not the line — and an earlier draft of this bullet said "the line", so it is now
  stated exactly.** In the one NUL-bearing ledger in the corpus the NUL sits at **byte offset 12107**, deep
  in the body; the `Status:` header near the top is itself clean. Under the chosen behaviour that file
  yields nothing at all — a match on its very first line included. A per-line rule would therefore
  reproduce **23**, not 24. Probed 2026-09-02.
- ⚠️ **This behaviour is not what every ordinary reader does, and the chosen count rests on it.** Same
  probe: `sed`, `awk`, Python reading UTF-8 with `errors='strict'`, and Node `readFileSync(…, 'utf8')`
  **all** read `Status: closed-out` from that file, while the chosen behaviour reads no `Status:` line at
  all. A NUL is a valid codepoint and none of those four is tolerating anything — a binary-file heuristic
  is the outlier. An implementer who picks one of the other four produces **23**, not 24.

**⚠️ What each choice costs, measured rather than asserted.** Re-measured 2026-09-02 by a per-file loop over
every `ai-agents/tasks/*/*/review.md` — **131** ledgers today. The counts are **identical** over the
**130** measured 2026-08-30, and so are comparable with the table in §Context, because the one ledger added
since is `0352`'s own and it is readable under all four combinations.

| Match rule | Reader | Ledgers failing condition C's read |
|---|---|---|
| **prefix (chosen)** | **a NUL makes the whole file unreadable (chosen)** | **24 — 18%** |
| prefix | a NUL is an ordinary byte | 23 |
| exact | a NUL makes the whole file unreadable | 40 — 31% |
| exact | a NUL is an ordinary byte | 39 |

- **Prefix over exact** holds the count at 24 rather than 40: the two rules disagree on **16** ledgers —
  the same 16 over the 130 and over today's 131.
  ⚠️ **But the benefit in gate outcomes is 2, not 16 — an earlier draft of this bullet overstated it and is
  corrected here.** Of those 16, only **2** carry an open decorated value (`in-review — …`). The other **14**
  carry decorated `closed-out …` values, which fail **either way**: under prefix they read as closed and fail
  condition C, under exact they are unreadable and fail condition E. Both roads file a brief. ⭐ Prefix is
  still chosen, because it strictly dominates — it opens the lane on those **2** and shuts it on none.
- **The reader accounts for the remaining difference of one.**
  `ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/review.md` carries a
  stray NUL byte, so the chosen read sees no header at all while a read that treats the NUL as an ordinary
  byte gets `Status: closed-out`. ⭐ **That choice changes no gate outcome anywhere in the corpus today** —
  `0246`'s real value fails condition C either way — it changes only the count. The chosen behaviour is
  picked because it is the one condition E is written for: what cannot be read is closed.

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
| **3** | Finding the coder **disputes**, or the owner rules against | ✅ **The lane still terminates it — when it is *resolved*, not merely argued.** The terminal set is the ledger's **existing** Status vocabulary: **`✅ done`**, **`disproven`**, **`won't fix (frontier)`** and **`closeout (re-litigation)`** all terminate in the ledger. **`pending approval` and `blocked` do not** — a finding a review ends on either of those, or one the owner agrees is real but **defers**, is unresolved work and **files a brief**. ⭐ **The set is not identical to the skill's close condition** — see the per-state table below, which also says which of the four are owner-confirmed and which are not. |
| **4** | A **large** in-scope in-flight fix | ✅ **Stays in the lane.** Size is irrelevant, by the owner's ruling of 2026-08-29. What stops this becoming a hiding place is §6 — and the first line of that answer is that **the owner's per-finding approval gate is untouched**. |
| **5** | Finding raised in an **ephemeral** review | ⛔ **The lane requires a stateful ledger.** `fkit-review` writes *"no persistent file — no ledger, no shared doc"*, and `fkit-process-review` *"never reads or writes a stateful review `.md` file"*. Conditions A–C therefore have no artifact to read, so condition E already closes the gate. It is stated explicitly here so it is not rediscovered mid-review. **A team that wants the lane runs the review stateful.** |

> ⚠️ Limit 5 is **beyond** the brief's four. It is flagged as an **addition**, not a substitution — the
> brief's four are all ruled above, individually and by name.

**⛔ Limit 3's terminal set, per state — which are owner-confirmed and which are not.**

The four states above are terminal for the lane. They are **not** all owner-confirmed, and this ADR says
which is which rather than implying a uniform gate:

| Terminal state | Who sets it | Owner-confirmed? |
|---|---|---|
| **`✅ done`** | The coder at `fkit-process-stateful-review` Step 6 | ✅ **Yes.** Step 5 gates every code change on *"my explicit approval"*, and Step 6 applies only what was approved |
| **`won't fix (frontier)`** | The coder at Step 4, then Step 6 | ⚠️ **Only at Step 6.** At Step 4 the skill marks it explicitly provisional — *"(pending my confirmation to record it as a residual)"*. ⛔ **It is terminal for the lane only once the matching *Accepted residuals* entry is recorded.** A row still resting on the Step 4 provisional token is unresolved, and **files a brief** |
| **`disproven`** | The coder at Step 4 (*"INCORRECT → Status `disproven`, Action `none`"*) | ⛔ **No** — coder-set |
| **`closeout (re-litigation)`** | The coder at Step 2 | ⛔ **No** — coder-set, though it must point at an *Accepted residuals* entry or an ADR the owner previously settled |

⚠️ **An earlier draft of limit 3 claimed this set was "exactly the ledger's own close condition". That was
wrong and is withdrawn.** `fkit-process-stateful-review` Step 6 names **three** states — *"If all novel
findings are closeout / disproven / accepted and nothing blocking remains"* — and `✅ done` is not among
them.

⚠️ **A second correction, to the same sentence.** An earlier draft added that `✅ done` *"is carried by that
step's 'nothing blocking remains'"*. **It is not.** That phrase is a **second conjunct** of the close
condition, not an alternative way into the first; the first is a **closed enumeration** that does not name
`✅ done`. ⛔ **This ADR reads nothing into the skill's enumeration and settles nothing about it.** The lane's
set is **deliberately** the four above, and is broader than that enumeration on its face. What remains true,
and is the point limit 3 was making, is that **the lane terminates
nothing the ledger itself would leave open**: `pending approval` and `blocked` are excluded, and so is a
finding the owner agrees is real but **defers**.

---

### §4 — Interaction with ADR-034

Three points, each stated rather than left to discovery.

**1. A lane finding is *presumptively* a work-product defect — not one "by construction", and the
difference is ruled here.** Condition B places the finding inside the reviewed diff, which is
[ADR-034](adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)'s
**work product** surface, and ADR-034 rules that *"A defect in the **work product** — the artifact the task
exists to change — still **blocks**, and still drives another review round."* ⭐ **This ADR relaxes
nothing in that bar.**

⚠️ **But condition B is a per-file test and ADR-034's boundary is not.** ADR-034 states it plainly:
*"**The boundary is per-site, not per-file.** `0159/brief.md` was *both* the task's own brief *and* one
of…"*. A ledger routinely lists a task's own `worklog.md` inside `File(s) under review:`, so a finding on
that file passes condition B — while ADR-034 may class the very same site as an **own-record residual that
does not block**. Entry to the lane therefore does **not** by itself settle whether ADR-034's blocking bar
applies.

⛔ **The ruling: condition B stays per-file, and ADR-034 still governs the blocking question, per site.**
Passing condition B decides only **where the finding is recorded** — in the ledger, not in a new task folder.
Whether it **blocks the close** stays ADR-034's call on the site, unchanged and unrelaxed. A lane-admitted
finding whose site is the task's own record is an own-record residual under ADR-034 and does not block.

⭐ **The over-admission this leaves is a deliberate frontier-move, and is recorded as one** (§Residual risks).
Condition B is kept per-file because a per-site test would put a **second** judgement at the gate.
⚠️ **Stated exactly, because an earlier draft of this sentence overstated it:** the gate is **not** free of
judgement — condition A carries one today (§1), and this ADR says so. What keeping B per-file buys is that
it adds no further one, and that B itself stays a field read. Its cost is that it admits sites ADR-034
would class as own-record.

**2. ⛔ `Accepted residuals` is not a parking space for a defect.** Under ADR-034 that row is for a
frontier-move or an own-record residual. Recording a real in-scope defect there to avoid **both** a fix
**and** a brief is the abuse this ADR forbids by name.

**3. The closed-ledger edge — limit 2, named by ADR number.**

> ⚠️ **An accuracy note, because the natural shorthand is wrong.** ADR-034 establishes that
> `closed-out` is the ledger's terminal state and what bar sets it. **It does not use the word
> "frozen"** — `grep -nic "frozen" ai-agents/knowledge-base/decisions/adr-034-*.md` returns **0**, re-run
> 2026-09-02. This ADR therefore **derives** the edge from ADR-034's close bar rather than putting a
> word in its mouth: a closed ledger is the **completed record of a finished review**, and a finding
> raised afterwards was not part of that review. So it fails condition C and files a brief.
>
> ⚠️ **A correction to this note, recorded rather than quietly swapped.** An earlier draft also claimed
> the word was absent from the whole conventions folder. **That half was false.**
> `grep -rnic "frozen" ai-agents/knowledge-base/conventions/` returns **one hit in each of**
> `one-skill-one-output.md`, `durable-citation-anchors.md` and `priority-is-rank-not-identity.md`
> (re-run 2026-09-02). The conclusion above is unaffected — it rests only on the ADR-034 half, which
> reproduces — but a callout whose whole authority is that it measured must not carry a measurement that
> does not.
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

**Three checks, cheapest first. ⛔ *None* of them is *mechanically enforced* today** — said here rather
than leaving a reader who counts safeguards to get three and have none. ⚠️ **The wording is deliberate:**
checks 1 and 2 **bind** the coder and the reviewer, and a rule that binds is in force *as a rule* — what
they lack is anything that enforces or detects a breach. That, not bindingness, is the line this table
draws. ⚠️ **An earlier draft answered row 1 "✅ Yes" and put the count at one**, citing a sentence in a
skill file — the same artifact class this table answers *"No — role discipline only"* for row 2. The
standard is applied consistently here, and the correction is recorded rather than quietly swapped.

| Check | Mechanically enforced today? |
|---|---|
| **1 — the owner's consent gate on code changes** | ⚠️ **No — role discipline only.** `fkit-process-stateful-review` Step 5 binds the coder to wait for the owner's approval; ⛔ no mechanism enforces or detects a breach. Unchanged by this ADR |
| **2 — the scope test and the anti-widening rule** | ⚠️ **No — role discipline only.** It binds the reviewer; ⛔ no mechanism enforces or detects a breach |
| **3 — the `Action` cell naming the files touched** | ⛔ **Not yet.** It ships with the §7 follow-up edit to `fkit-process-stateful-review`; nothing changes behaviour until it does |

⚠️ **What this means for the section, said plainly rather than left to inference: the anti-hole answer
rests on role discipline.** That is the honest state of it today, and check 3 is the one follow-up that
would change it.

1. ⭐ **Structural, and binding — the owner's consent gate on code changes is untouched.**
   `fkit-process-stateful-review` Step 5 ends *"**wait for my explicit approval** before changing any
   code"*, finding by finding, and Step 6 applies only what was approved. **The lane removes filing
   ceremony, not consent.** This is the load-bearing answer to limit 4.

   ⚠️ **Stated precisely, because the natural shorthand overstates it: the gate covers every code change,
   not every lane termination.** ⛔ No lane fix is *permitted* to reach the codebase unapproved — that much
   is exact **as a rule**, and ⚠️ per the table above nothing enforces or detects a breach of it. But
   **two** of the four terminal states in §3 limit 3 are **coder-set with no owner confirmation** (see the
   per-state table there): `disproven` at Step 4 and `closeout (re-litigation)` at Step 2.

   ⚠️ **A correction, recorded rather than quietly swapped:** an earlier draft counted **three** here, adding
   the Step-4 provisional `won't fix (frontier)` token — which §3's own per-state table rules **not**
   terminal until the matching *Accepted residuals* entry is recorded at Step 6. A row still resting on that
   token is unresolved and files a brief, so it is not part of this count. The earlier draft **overstated**
   the residual rather than understating it, but the two sections contradicted each other and now do not.

   A real in-scope defect misclassified `disproven` therefore
   terminates in the lane, files no brief, and reaches no board, with nobody but the coder having ruled on
   it. **That residual is real and this check does not close it.** What bounds it is the reviewer's next
   round, which reads the *Coder response* row and can re-raise the finding.
2. ⚠️ **Boundary — the scope test plus the anti-widening rule, which is discipline, not mechanism**
   (§1 condition B and the ⛔ rule beneath it). Size does not gate the lane; **scope does**. ⛔ **Said
   truthfully: the anti-widening rule binds the reviewer, it does not prevent the reviewer.** Nothing
   enforces or detects a widening — no test and no hook reads `File(s) under review:`, and the reviewer
   **owns** the header the rule constrains. A widening is **detectable only in review**, by a reader
   comparing the field against the diff the review opened on. That is why the breach appears in
   §Residual risks as something **observed, not prevented**, and why the re-raise condition there is the
   whole of the remedy this ADR claims for it.
3. ⛔ **Observable, but it does not exist yet — the `Action` cell names the files touched** (§2). The lane's
   footprint would then be countable from the ledgers, so the next re-measurement against the retro's
   baseline could separate **ceremony removed** from **work absorbed**. ⛔ **This ships with the §7 follow-up
   edit to `fkit-process-stateful-review` and is not available until it does.**

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

⭐ **A further follow-up, named by owner ruling of 2026-09-02** — option label, verbatim: *"Keep it, file a
follow-up for a real field (Rec)"*:

> **Give a seeded row a durable provenance field in the ledger schema**, so §1's condition A becomes a
> **field read** like B and C instead of a judgement at the gate. It is carried by `fkit-stateful-review`
> and `fkit-process-stateful-review` **together**, since both write the *Reviewer findings* table and the
> schema must match on both sides. Until it ships, §1's seeded-row rule binds without a field behind it,
> and §1 says so.

⛔ **Named only, exactly like the rows above** — no skill file is edited by this ADR, and filing it remains
the producer's act.

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
- The lane needs **no size judgement** at filing time — the entry condition is three reads at the gate,
  ⚠️ two of them field reads (§1).
- The record is **not lost**: it lives as a findings row plus a response row in the task folder that
  carried the diff, with the verdict and the action attached.
- Nothing new is built — ⚠️ **with the one exception §1 names**: condition A's provenance has no field
  today, and §7 carries the follow-up that would add one. Every other artifact the condition reads already
  exists.
- The `Action` cell naming the files touched makes the lane's footprint **countable**, so its effect
  can be measured rather than assumed.

### Negative / costs — accepted explicitly

- **⚠️ Lane work never appears on a board.** That is the point, and it is also the cost: a fix that
  happens in the lane is visible in the ledger and nowhere else. §6's three checks are what keep that
  honest; the re-raise conditions below are what reopen it if they do not.
- **⛔ Nothing changes behaviour until the §7 follow-ups ship.** This ADR is a decision, not an
  implementation. A close report or a status briefing implying the lane is live has **misreported**.
- **⚠️ The gate is strict against non-conforming ledgers.** 24 ledgers — 18% of the corpus — would fail
  condition C's read (measured 2026-08-30, re-measured 2026-09-02) and their findings would file briefs.
  This is deliberate —
  an unreadable gate is a closed gate — but it means the lane is unavailable on a ledger until its
  header is written conformingly.
- **⚠️ Condition A is not yet a field read.** The provenance it tests has no column in the ledger schema,
  so it is a judgement at the gate — the very property §1 exists to avoid — and nothing marks a seeded row.
  The owner ruled the rule stays with that gap in view, and named the follow-up that closes it (§1, §7).
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
- ⚠️ **The per-file / per-site frontier-move is observed to cost more than it saves.** Condition B is a
  **per-file** test while ADR-034's boundary is **per-site** (§4 point 1). The over-admission is accepted
  deliberately, so that **B itself stays a field read and the gate carries no *second* judgement** —
  ⚠️ condition A already carries one (§1), so this is not a claim that the gate is judgement-free.
  Re-raise if a
  lane-admitted finding on a task's **own record** is found to have been treated as a **blocking**
  work-product defect and to have driven a further review round ADR-034 would not have required — or if the
  reverse is found: a real work-product defect waved through as own-record because its site sat inside a
  file the ledger listed for both reasons; or
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

- `ai-agents/tasks/done/0352-adr-the-narrow-in-flight-review-fix-lane/` — the task this was recorded
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
