# ADR-046: A sprint board may be committed unranked, and erasing a frozen rank is a violation

- **Status:** accepted
- **Date:** 2026-09-04
- **Deciders:** the owner (ruled live via `AskUserQuestion` in a `fkit lead` session, 2026-09-04 —
  rulings **P1**, **P2** and **P3** at task `0361`'s plan gate). Recorded by `fkit-architect` via
  `/fkit-record-decision`; ⛔ **this ADR records that ruling, it does not originate one.**
- **Corrections:** ⚠️ = a fact that drifted or was measured wrong (the decision is untouched);
  ⛔ = a decision that was overturned (do not follow it). **There is no third marker.** Annotated
  sites: §Decision part 1, the must-throw list — ⚠️ **2026-09-05**, the `'— '` item is unreachable.
  The corrected text is left **byte-identical**; the note is appended below the claim, never written
  over it, and **Status stays `accepted`**. ⛔ **No decision in this ADR has been overturned** — no ⛔
  note is present, and the absence is itself the record.
  ⭐ **Second correction pass, 2026-09-05.** The **site list** in the third line of this item is left
  byte-identical and is **superseded by this line**; the same append-only rule and the same legend
  apply, and every other part of the lines above — the legend, the no-edit assertion, the *"Status
  stays `accepted`"* statement and the ⛔ no-decision-overturned record — is **still binding**.
  Annotated sites: (1) §Decision part 1, the must-throw list — ⚠️ **2026-09-05**, the `'— '` item is
  unreachable; (2) §Decision part 1, the `dashboard.sh` sub-claim correction — ⚠️ **2026-09-05**,
  ruling **P1** re-confirmed after that sub-claim was measured false.
  ⭐ **Third correction pass, 2026-09-05.** The **site list** in the second correction pass above is
  left byte-identical and is **superseded by this line**; the same append-only rule and the same
  legend apply, and every other part of both earlier passes remains **binding**. Annotated sites:
  (1) §Decision part 1, the must-throw list — ⚠️ the `'— '` item is unreachable; (2) §Decision part 1,
  the `dashboard.sh` sub-claim correction — ⚠️ ruling **P1** re-confirmed on the corrected reason;
  (3) §Decision part 1, **inside the first 2026-09-05 note itself** — ⚠️ its claim that `'P1 (a) (b)'`
  was asserted was **false when written**. ⚠️ **A correction may itself be corrected; site 3 is that
  case, and it is listed as its own site rather than folded into site 1.**

## Context

Three rules disagreed about whether a **sprint board** may be committed with an **unranked** Priority
cell — the em-dash marker `—`. Two were written policy, one was a shipped test, and both sides were
live. All three sites were re-measured firsthand at **`cf289c2`** ("Sprint push") before this ADR was
written; the tree at that moment also carried a handful of status flips and task `0361`'s `plan.md`,
so this is **not** a claim about a clean tree.

**Site A — the test.** `test/closed-rank-immutability.test.js`, function **`parseBoard`**, refused the
marker by design. Its rank check and the comment stating the assumption outright:

```js
// Sprint boards are ranked. `P<n>` is the current era; done/sprint-1.md's first era used bare
// `<n>`, once with an annotation ("8 (optional)") — see the file-header widening note. `—` —
// the Backlog board's unranked marker — never appears on a sprint board and throws.
if (!/^P?\d+(?: \([^()]*\))?$/.test(rank)) {
```

The refusal is stated **twice**: the same file's header widening note ends *"`—` / empty / prose still
throw."* A unit test asserted it deliberately — `parseBoard: an unranked (—) or garbage Priority cell
throws`, carrying two assertions (`—` and the prose case `'high'`).

⭐ The same header already conceded that an unranked board is a coherent thing, just not a *sprint*
one: *"backlog.md is excluded BY CONSTRUCTION: the Backlog board is unranked by design (every Priority
cell reads `—`), so it has no rank to hold still."*

**Site B — `ai-agents/sprints/backlog.md`**, the **"Off:"** rule's **unranked-forward clause**,
presupposes the opposite: *"When the destination sprint board is **unranked** (its Priority column is
all `—`, no `P<n>` assigned to anything), write the marker as `➡️ Moved to [Sprint N](sprint-N.md)`
with **no `— priority M` suffix**"*, and *"⛔ **Never write `— priority —`, and never invent a
number**"*. It names its own precedent: *"**Worked precedent — `[Sprint 6](done/sprint-6.md)`,
2026-08-14.** It opened unranked (the first board in this project to do so)"*. ⚠️ **That one link in
the quoted fragment is rendered as a code span, not as a live link** — its target is relative to
`ai-agents/sprints/` and would resolve wrong from this directory. The quoted **text** is byte-faithful
to the source; only its rendering is neutralised.

**Site C — `ai-agents/sprints/sprint-7.md`**, §*"⛔ This board is UNRANKED — and one row is not a
rank"*, now headed *(SUPERSEDED 2026-08-29 … left byte-identical as the record of why it opened
unranked)*. ⚠️ **The supersession is scoped to the factual claim** that the board is unranked today —
it is not; the section's *reasoning* is untouched and was the second precedent. Its deferral clause is
the exact act this decision has to classify: *"if and when the owner ranks this board, the Priority
cell, the brief's `## Priority`, and `backlog.md`'s `— priority P<n>` suffix are all added in that one
act."*

**What made this a real decision rather than a bug report.** The symptom had already cleared and the
conflict had not. Sprint 7 opened unranked on 2026-08-29 and `live leg 1` went red at `HEAD`
(34 tests, 33 pass, 1 fail, measured 2026-08-29 on task `0361`'s brief); the owner then ranked and
committed the board, and the suite measures **34 tests / 34 pass / 0 fail** at `cf289c2`, re-run for
this ADR. ⛔ **The next board opened unranked reproduces the failure exactly**, because sites B and C
both still instruct a producer to open one that way. A green suite was therefore not evidence the rule
was settled.

## Decision

**Two parts, both ruled by the owner on 2026-09-04.**

**1 — A sprint board's Priority cell may hold `—`.** `parseBoard` is **widened** to accept the
unranked marker on a sprint board, as **one literal alternative**, byte-verified **U+2014**
(`e2 80 94`) against a live Backlog cell. ⛔ **Widening is not weakening.** The garbage-cell throw
**stays**: `'high'`, `''`, `'P'`, ASCII hyphen `-` (U+002D), en-dash `–` (U+2013), `'— '` and `'—5'`
must all still throw. The unit test asserting the throw is **amended and split, never deleted** — the
garbage half keeps asserting it. A dash of the wrong codepoint is the realistic typo and must keep
failing, which is why the accepted form is a literal alternative and not a loosened character class.

> ⚠️ **2026-09-05 — one item of the must-throw list above is UNREACHABLE, and nothing changed on its
> account.** Authority: owner ruling 2026-09-05, live via `AskUserQuestion` in a `fkit lead` session;
> the option label is the verbatim text **"Architect appends a dated correction (Rec)."** Found by
> task `0361`'s phase-2 coder, which **declined to assert a case it had measured impossible** and
> surfaced it instead of papering over it.
>
> **The item is `'— '`** — an em-dash with a trailing space. Verified against live code 2026-09-05, in
> the shipped `test/closed-rank-immutability.test.js`: `parseBoard` binds the Priority cell as
> `const rank = unmask(cells[2]).trim();` and the rank check runs **after** that line. **The trim
> precedes the check**, so a cell written `| —  |` reaches the check as plain `'—'` and **parses as
> the unranked marker**. `'— '` therefore cannot arrive at the check as a cell value at all, and no
> test asserts it — ⭐ **deliberately, and that absence is the point of this note.**
>
> ⭐ **Every other item on the list is reachable and IS asserted** — `'high'`, `''`, `'P'`, ASCII
> hyphen `-` (U+002D), en-dash `–` (U+2013), `'—5'`, and `'P1 (a) (b)'`. **The list's substance
> stands**; one of its illustrations does not.
>
> ⚠️ **Scope of this correction, stated so it is not read wider than it is.** It corrects **one list
> item's reachability**. It does **not** narrow the widening, does **not** touch the part-2 transition
> table, does **not** change `parseBoard`'s accepted set, and is **not** licence to revisit the
> decision. ⛔ **The decision stands exactly as ruled; Status stays `accepted`.** The claim above is
> left **byte-identical** — this note is appended beside it, not written over it.

> ⚠️ **2026-09-05 — THE NOTE DIRECTLY ABOVE CONTAINED A FALSE CLAIM OF ITS OWN, AND IT WAS FALSE WHEN
> WRITTEN.** Authority: owner ruling 2026-09-05, live via `AskUserQuestion` in a `fkit lead` session;
> the option label is the verbatim text **"Coder asserts it + architect dates a note (Rec)."**
>
> **The claim, quoted from the note above:** *"⭐ **Every other item on the list is reachable and IS
> asserted** — `'high'`, `''`, `'P'`, ASCII hyphen `-` (U+002D), en-dash `–` (U+2013), `'—5'`, and
> `'P1 (a) (b)'`."* ⛔ **`'P1 (a) (b)'` was NOT asserted.** Found by task `0361`'s round-1 review and
> confirmed independently by Codex: mutating the annotation quantifier `?`→`*` in `parseBoard`'s regex
> makes the parser **accept** `'P1 (a) (b)'`, and the suite stays **39/39 green**. Nothing pinned that
> rejection. Verified against live code 2026-09-05 before this note was written.
>
> ⭐ **No behaviour was ever wrong.** The parser rejected the form throughout — the annotation
> quantifier has always been `?`. ⛔ **The defect was the RECORD**: a dated correction repairing one
> false item on that list introduced a second false claim about the same list.
>
> ⛔ **The coder has since added the assertion, so the claim now holds — AND THAT IS EXACTLY WHY THIS
> NOTE EXISTS.** Once the assertion lands, the sentence above becomes *retroactively* true, and a
> reader arriving later would find a true claim and no trace that it was false when made. ⭐ **This
> repo's whole sweep programme exists because "true by the time anyone checks" is how false records
> survive.** The record must show the claim was **false at the moment it was written**, not merely
> that it is true now.
>
> ⚠️ **Scope.** This corrects **one illustration inside one earlier note**. It does **not** change the
> must-throw list's substance, the widening, the part-2 transition table, `parseBoard`'s accepted set,
> or either earlier note — all of which stand. ⛔ **Status stays `accepted`.** The other measurements
> are **deliberately not restated here**, so there is one place to keep each true rather than two;
> they are in the notes they already sit in. The corrected text above is left **byte-identical**.

**Owner's stated reasons, recorded because they are the rationale:**
- The test is the only thing **enforcing** a rank-shaped Priority cell on a sprint board. ⚠️ See the
  measured correction below — the relayed wording was *"the sole machine consumer"*, and that
  sub-claim is narrower than it reads.
- The suite's declared subject is **closed-rank immutability, not rank presence** — so refusing `—`
  is strictness past the guard's own purpose.
- Refusing it makes a **twice-precedented, owner-reviewed** board state uncommittable: Sprint 6 opened
  unranked 2026-08-14, Sprint 7 on 2026-08-29.

> ⚠️ **Measured correction to one sub-claim of the rationale above, `fkit-architect`, 2026-09-04 —
> the decision is unaffected.** The reason was relayed as *"`dashboard.sh` never reads that column"*.
> Verified against live code 2026-09-04: it **does** read it. Its row extractor's own comment says
> *"Emits: status`<US>`priority`<US>`task`<US>`brief-cell"* and *"takes status=$2, priority=$3"*, and
> `task_id()` runs on that cell as **arm 2 of the FACTS-id ladder** — *"THE LADDER: folder ID prefix →
> Priority number → sanitised folder name → `?`"*. What holds is the **weaker and sufficient** claim:
> arm 1, the folder-name ID prefix, is **primary** (*"THE FOLDER-NAME ID PREFIX IS PRIMARY. The
> Priority cell is MUTABLE BOARD RANK … and never was identity"*), arm 2 fires only when a brief link
> carries no numeric folder prefix, and `task_id()` on `—` yields no digits and falls through to arm 3
> and then `?`. Empirically: the Backlog board's Priority column is **all `—`** today and
> `dashboard.sh` runs over it with **no drift line and no `MALFORMED` record**, `select-active` still
> `active file="sprint-7.md" identity="Sprint 7"`, exit 0. So `—` is already tolerated by the
> dashboard on a live board; the test remains the only **enforcer**, which is what the ruling rests
> on. ⛔ **This note corrects a fact, not the decision** — part 1 stands as ruled.

> ⚠️ **2026-09-05 — ruling P1 was RE-CONFIRMED after the sub-claim above was measured false.** Owner
> ruling, live via `AskUserQuestion` in a `fkit lead` session; the option label is the verbatim text
> **"(b) stands on the corrected reason (Rec)."** So the correction above did not go unexamined: the
> owner saw the measurement, and **re-affirmed (b) on the corrected footing** rather than letting the
> original ruling carry a reason that had been falsified.
>
> ⭐ **What the decision actually rests on** is the **weaker and sufficient** measured claim — the
> test is the only **enforcer** of a rank-shaped Priority cell on a sprint board; `task_id()` on `—`
> yields no digits and falls through the FACTS-id ladder to `?`; and the Backlog board runs all-`—`
> today with **zero drift lines**. ⛔ **The measurement itself is deliberately not restated here, so
> there is one place to keep it true rather than two** — it is in the note directly above, which is
> the site that carries it.
>
> ⛔ **What the decision does NOT rest on** is the stronger *"sole machine consumer"* wording. That
> claim was **falsified** and is recorded above as falsified. ⚠️ **Do not cite it forward.**
>
> ⭐ **Why this note exists at all**, in the owner's own reason for ruling it in: without it, ADR-046
> shows *a correction to a stated reason and no evidence the ruling was re-examined* — **the more
> alarming half-record.** Task `0361`'s `plan.md` also carries the re-confirmation, but that is a task
> artifact a future reader of this ADR has no reason to open, so the record belongs here too.
>
> ⛔ **Append only. Nothing above is rewritten** — not the decision, not the transition table, not the
> correction this note sits beside, and **Status stays `accepted`.**

**2 — the closed-row transition table**, ruled exactly as task `0361`'s plan proposed:

| `earlier` → `later`, on a **closed** row | Verdict |
|---|---|
| `—` → `—` | no flag — no-op |
| `—` → `P<n>` | ⭐ **allowed** — there was no rank to freeze; this is the deferral clause being honoured |
| `P<n>` → `—` | ⛔ **FLAG** — erasing a frozen rank destroys the history the invariant exists to keep |
| `P<n>` → `P<m>`, n≠m | ⛔ **FLAG** — unchanged, today's behaviour |
| any transition on an **open** row | no flag — unchanged; open rows may move |

⭐ **Two points of the owner's reasoning, without which the table looks arbitrary:**

1. **The two-commit launder is still caught.** The obvious objection to allowing `—`→`P<n>` is that a
   renumber could launder itself across two commits: `P5`→`—`, then `—`→`P9`. It cannot, because
   **step one already flags** — `P<n>`→`—` is a violation. ⭐ **That is *why* the erase direction must
   flag even though it loses no ordering by itself:** it is the half that closes the launder.
2. **The stricter reading was refused by name.** Flagging `—`→`P<n>` as well would have flagged
   **Sprint 7's own lawful ranking act of 2026-08-29** — the act both boards explicitly instruct.

⛔ **No rank is changed by this decision** ([ADR-035](adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
It settles a rule *about* ranks. No Priority cell on any board is altered by it.

**Scope — stated narrowly on purpose.** This decides **what a sprint board's Priority cell may
contain** and **how a closed row's rank may change between revisions**. ⛔ It does **not** decide what
a producer *writes* in the Priority cell of a board the owner has not ranked. Task `0361`'s plan
measured that **no answer to that exists on disk today** — both worked precedents simply wrote `—` —
and it is out of scope here.

## Options considered

- **(b) Widen `parseBoard` to accept `—` on a sprint board — CHOSEN.** Sites B and C and their two
  worked precedents win; site A conforms. Smallest surface: **one file**,
  `test/closed-rank-immutability.test.js`. No board is edited, no `claude/` shipped surface is
  touched, and `git diff -- ai-agents/sprints/` stays empty — which is itself the strongest available
  proof that no rank moved. ⚠️ **Its cost was accepted with it, not hidden: (b) is not a regex tweak.**
  A row with no rank has no rank to compare, so widening *forces* the transition ruling in part 2 —
  which is why part 2 is in this ADR and not left to the implementer.

- **(a) Sprint boards are never committed unranked — rejected.** The test would win and both written
  rules would conform. Rejected on two grounds. **It is not implementable as stated:** it must either
  invent a sanctioned token for an unranked cell or forbid the state outright, and neither exists on
  disk — the blocking question *"what does a producer write in the Priority cell of a board the owner
  has not ranked?"* has no answer today. And its blast radius is the largest of the three: it reaches
  `backlog.md`'s unranked-forward clause (which becomes unreachable), `sprint-7.md`'s superseded
  section (⛔ which may only be **annotated**, never rewritten — the `0306` precedent), and very likely
  `claude/skills/fkit-task-brief/SKILL.md`, a **shipped** surface. It would also reverse a state the
  owner has reviewed and accepted twice.

- **(c) Accept the conflict as a known state — rejected, and re-worded first so the record is
  honest.** ⚠️ **Ruling P2, "Re-word it (Rec)":** as originally written, (c) read *"accept the red leg
  as a known state"*, and there **is** no red leg any more — the owner's commit of the ranked board
  cleared it. It was re-worded to *"record the latent conflict at the three sites, change no rule."*
  ⛔ **(c) did not win.** It was corrected only so the record does not describe a failure that does not
  exist. Rejected because it leaves two written rules contradicting a shipped test indefinitely, and
  the contradiction re-fires the moment any board opens unranked.

**Deliberately out of this decision — ruling P4, *"File separately onto the Backlog board (Rec)"*.**
Task `0361`'s plan found a **fourth** site the brief does not name:
`claude/skills/fkit-task-brief/SKILL.md`, under *"Pulling a backlog task into a sprint is the
producer's act, not this skill's"*, states *"`— priority M` is mandatory and is not dropped just
because this board is unranked"* — with no unranked-**destination** carve-out, where `backlog.md`
writes one out at length. ⛔ **Pre-existing, and out of scope here.** It is a `claude/` shipped surface,
it does not block the release, and the owner ruled it onto the **Backlog** board as its own row.
⛔ **Nothing under `claude/` is edited under this ADR.**

## Consequences

- **Positive.** A sanctioned, twice-precedented board state becomes committable, and the guard's
  strictness is aligned with its declared subject. The freeze it actually exists to hold — a closed
  row's rank — gets **stronger**, not weaker: the erase direction `P<n>`→`—` was previously
  unreachable (the parse threw before any comparison) and is now an explicit, flagged violation.
- **Positive.** The transition rule is settled **in writing** before it is implemented, so the
  implementer is not left to invent the semantics of comparing a rank against a non-rank.
- **Negative / cost.** The guard now accepts a value with **no ordering semantics**. `—` is compared
  **verbatim as a string**, exactly like every other rank (the suite's header: *"compared VERBATIM as
  a string, so immutability semantics are unchanged"*). ⛔ **No numeric coercion may be introduced** —
  an unranked row genuinely has no order, and inventing one would be the defect this widening is
  trying to avoid.
- **Negative / cost.** `—` becomes a value a future reader must recognise as *deliberate* rather than
  as corruption. The mitigation is that the accepted set is an allowlist of two named forms and the
  refusal comments are amended in place, so the file keeps stating what it accepts and why.
- **Negative / cost, named rather than hidden.** The rule about the unranked cell now lives in **three
  places** — this ADR, `backlog.md`'s clause, and the test — and the test is the only executable one.
  A future drift between the prose and the code is caught by nothing automatic.
- **Residual risk.** The wrong-codepoint dash. `–` (U+2013) and `-` (U+002D) render almost identically
  to `—` (U+2014) and must keep throwing. A regex written as a character class rather than the literal
  alternative would silently accept all three, and the failure would be invisible in review.
- **Re-raise only if:** a *second* machine consumer of a sprint board's Priority cell appears and
  requires a rank-shaped value (the FACTS-id ladder's arm 2 is not one — it degrades to `?`); **or**
  the owner sanctions a token other than `—` for an unranked cell, which is the open question this ADR
  deliberately leaves out of scope; **or** an unranked row is found to need ordering semantics, in
  which case the verbatim-string comparison is what must be re-argued. ⛔ **Do not re-raise** the
  choice between (a), (b) and (c), the transition table's five rows, or whether `—`→`P<n>` should
  flag — the stricter reading was considered and refused by name, because it would flag a lawful act
  both boards instruct.

## Related

- **Task `0361`** — `ai-agents/tasks/done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/`
  (`brief.md` and the approved `plan.md`, whose §5 step b3 table is what ruling **P3** adopted).
  ⛔ **Phase 2 — the implementation — is gated on this ADR and is a coder's act**, not the architect's:
  the deliverable is a JavaScript test edit, which names no skill.
- **Site A** — `test/closed-rank-immutability.test.js`, function `parseBoard` (the rank check and its
  `"never appears on a sprint board and throws"` comment), the file-header widening note ending
  *"`—` / empty / prose still throw."*, and the unit test `parseBoard: an unranked (—) or garbage
  Priority cell throws`. ⛔ **Both** statements of the refusal must be amended in phase 2; leaving
  either stale is a defect in a suite whose method is that its comments are the record.
- **Site B** — `ai-agents/sprints/backlog.md`, the **"Off:"** rule's unranked-forward clause.
  ⭐ Not edited by this decision: under (b) the clause was right all along.
- **Site C** — `ai-agents/sprints/sprint-7.md`, §*"⛔ This board is UNRANKED — and one row is not a
  rank"*. ⛔ **Superseded and byte-identical on purpose** — not edited by this decision either.
- [ADR-035](adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md) — its closed-row
  rule is **not** re-opened. This ADR is about **unranked** cells, not about moving ranked ones.
- [ADR-014](adr-014-how-fkit-tests-itself.md) — phase 2 adds **no devDependency** and **no
  `package.json` change**.
- [ADR-044](adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) §Decision 1
  — why this ADR was authored by the architect (`fkit-record-decision` is architect-owned in
  `skills_for_role()`) while phase 2 falls to the coder.
- [ADR-026](adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md) and the suite's own
  header note — ⛔ **`prove-red.sh` gains no mutation for this rule.** The suite records a standing
  owner ruling of 2026-08-06 that *"prove-red.sh gains NO mutation for this suite"* (a copied tree has
  no `.git`, so the guard would SKIP rather than go red). The red proof stays **in-suite**.
- **Citation form** — `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`. Every site
  above is cited by **file plus quoted phrase or function name, never `path:NNN`**, deliberately: two
  Sprint 7 rows are currently cleaning and then guarding coordination-citation form, and a new `:NNN`
  written today would be a new member of the set they are sweeping.
