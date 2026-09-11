# ADR-047: A sprint has an explicit status, and "current" means EVERY `In progress` sprint — not the highest-numbered one

- **Status:** accepted
- **Date:** 2026-09-10
- **Deciders:** **the owner**, across **four** live `AskUserQuestion` rounds — **2026-08-25** (OQ-1,
  OQ-3, and the OQ-2 answer that reframed the whole task; then SD-1, SD-2, SD-3), **2026-09-10** (V1–V4,
  at this task's plan gate), **2026-09-10** (W1–W2, at this task's round-1 review gate) and
  **2026-09-10** (X1–X3, at its round-2 review gate). Option labels are
  quoted **verbatim** in *§Authority*. Everything not in those tables is **the architect's**, made under
  those rulings, and is marked as such where it is decided.
- ⚠️ **Amended after acceptance — 2026-09-10, round 1 review, owner ruling W1.** Nine review findings
  are closed **inside this ADR** rather than handed to `0338`/`0341`, because they were **design
  decisions, not implementation detail**. ⛔ **Every amendment is dated and attributed at its own site**
  — search this file for *"2026-09-10 under owner ruling W1"* and *"W2"* to see all of them. **No
  earlier ruling was reversed and no owner ruling was reinterpreted.** The sections that changed:
  §1.2 (new), §2 (recognizer, one-banner rule), §2.3a (new), §3.0 (new), §4, §6.1, §6.4 (new), §7,
  §7.1, §8.2, §9 (new), §Required tests (P7, P11, P12–P17), §Consequences, §Re-raise only if.
- ⚠️ **Amended a SECOND time — 2026-09-10, round 2 review, owner rulings X1/X2/X3.** Round 2 found
  eleven further findings, **eight of which the first amendment itself introduced or left open.**
  ⛔ **The load-bearing one is R16: the first amendment's own closure of R7 recreated the defect it
  closed** — it required five `select-active` drifts to *"reach the roll-up"* when **`select-active`
  has no roll-up**, which made tests P3/P7/P12/P15/P16 unwritable and `0338` unstartable. **§7.2 is
  the new clause that fixes it.** ⛔ **Every second-round amendment is dated and attributed at its own
  site** — search this file for *"2026-09-10 under owner ruling X1"*, *"X2"* and *"X3"*. **No earlier
  ruling was reversed, no owner ruling was reinterpreted, and nothing round 2 verified as correct was
  disturbed.** The sections that changed: §1.2 (R23), §2 (R24 — a carve-out **narrowed**), §2.3 (R21),
  §3.0 (R17, R18), §7 table + §7.1 (R19), **§7.2 (new — R16)**, §9.2 (R20), §Required tests
  (P3, P7, P12, P13, P15, P16, P17), §Consequences (R22's accepted residual, X2), §Authority (Round 4),
  §Re-raise only if (R16's trigger and R26's two, X3), §Authoring constraints and §Related (R25).
- **Recorded under:** task `0337`
  (`ai-agents/tasks/done/0337-record-the-decision-that-the-current-sprint-is-the-lowest-numbered-open-sprint-not-the-highest/brief.md`).
- **Supersedes in part:** [ADR-041](adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md).
  Scoped precisely in **§8**. ADR-041's candidate set, identity ladder, same-identity tie-break,
  `Backlog` token and one-grammar-one-implementation constraint are **untouched and in force**.
- **Depends on:** [ADR-040](adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md)
  (identity grammar) and ADR-041 (the selector this one extends). This ADR **cannot ship before**
  either.
- **Citation form.** Coordination documents — sprint boards, task briefs, other ADRs — are cited here
  by **heading plus quoted fragment, never `path:NNN`**, per
  [`durable-citation-anchors.md`](../conventions/durable-citation-anchors.md), whose *"Which anchor
  for which target"* table rules `path:NNN` **wrong** for *"a coordination document others append
  to"*. Source files (`claude/…`, `test/…`) carry `path:NNN` freely — with one named exception
  in **§2**.

## Context

### The report that started it — the owner, verbatim, 2026-08-25, given live to the lead

> When I ask leads about the status of the current sprint, they are always getting confused by what I
> mean when I am saying "current sprint", very often they are telling me about the not completed sprint
> with the highest number, but it's incorrect, because the "current" sprint means the sprint that is
> currently active, usually it's the sprint with the smallest number which is not completed.

This is **verbatim the re-raise trigger ADR-041 wrote for itself.** Its *Re-raise only if* list, second
bullet, reads: *"a project legitimately works **two sprints in parallel**, or reports being
mis-selected **within** its eligible set (the 'highest N' residual actually biting) — **this is the
named exit: option (d), an explicit active-sprint marker.**"* Both halves fired at once. ⭐ **This ADR
is that exit being taken, not ADR-041 being re-argued.**

### How TASK status is carried today — the model the owner asked to mirror

Three carriers, reconciled by the dashboard, with the two terminal states gated behind mover skills.
[`task-status-vocabulary.md`](../conventions/task-status-vocabulary.md) fixes the value set and says of
it: *"No other value is valid."* Its authority split is the part that matters here — *"`In progress`
and `Blocked` are free … `Done` and `Cancelled` are skill-gated and role-gated"* — with the movers made
producer-only by [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md), whose §5 rules
that *"A producer **spawned** by another agent to close still writes `✅ Done (agent-closed — not
owner-verified)`."*

### How SPRINT status is carried today — two implicit carriers, no vocabulary, no mover

- **Location only.** Open boards sit at the top of `ai-agents/sprints/`; the repo's own README table
  says *"Completed sprints move to `sprints/done/`."* There is no `sprints/cancelled/` and no
  `Backlog`/`In progress` distinction — **every board at the top is treated as live.**
- **A banner, by precedent — and the selector does not read it.** Measured 2026-09-10: `sprints/done/`
  holds **`sprint-1.md` … `sprint-7.md`**, and **all seven** carry `> ## 🔒 CLOSED — <date>.` at
  **line 3**. Four (sprints 1–4) add `Superseded by [Sprint N+1](…)`; sprints **5, 6 and 7 omit it**.
  The selector is depth-1 on **location** only (`claude/skills/fkit-status/dashboard.sh:241`, whose
  comment reads *"DEPTH 1 ONLY"*), which is why a finished Sprint 5 kept being reported as active until
  a hand-scoped task moved it.
- **No mover skill.** Each archival was a hand-scoped, owner-ruled task. **Nothing enforces that the
  banner and the move happen together** — the two carriers can disagree and nothing says so.
- **The ordering is the highest `N`.** `identity_gt` (`claude/skills/fkit-status/dashboard.sh:187-192`)
  is applied at the selection site with a strictly-greater test; ADR-041 §1.4 rules it; the S1/S1b/S2
  scenarios in `test/dashboard-contract.test.js` pin it. **That is exactly what the owner reports as
  wrong.**

### Measured state of this repo, 2026-09-10

`ai-agents/sprints/` holds `backlog.md`, `sprint-8.md`, `done/`, `reviews/`.
`bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` prints
`active file="sprint-8.md" identity="Sprint 8"`, two `candidate` lines, no drift, exit 0.
`sprint-8.md` line 3 is an **Authority blockquote**, not a status banner — so under this ADR it is a
board with **no banner** until the backfill task adds one.

### The two constraints this ADR had to design around

1. ⛔ **`## Status` is already taken.** In a sprint board the `## Status` heading **is the task table**:
   `STATUS_HEADING_RE` is `^## Status[ \t]*$` (`claude/skills/fkit-status/dashboard.sh:372`), and the
   parser dies without that section. A sprint's own status therefore **cannot** live under a `## Status`
   heading. It needs a different carrier — ruled **SD-1**, the line-3 banner.
2. ⛔ **`/fkit-status` is one skill, one output**
   ([`one-skill-one-output.md`](../conventions/one-skill-one-output.md)). Reporting *all* `In progress`
   sprints for the empty argument is **one** complete output — fine — but the briefing is written as
   seven beats about **one** sprint, so the shape for N sprints must be **specified here**, not left to
   the model.

## Decision

> **A sprint has an explicit status — `🔲 Backlog` / `🔄 In progress` / `✅ Done` / `⛔ Cancelled` —
> mirroring the task lifecycle. "Current sprint(s)" = "active sprint(s)" = every sprint whose status
> is `In progress`. Asked for status with no sprint named, `/fkit-status` reports ALL of them. Where
> exactly one board must be chosen (the ship-loop drives one board), the default is the
> **lowest-ordered** `In progress` sprint, overridable by an explicit active-sprint marker. A sprint
> whose status is `Done` or `Cancelled` — by status **or** by the legacy `🔒 CLOSED` banner — is never
> reported as active.**

The status is carried by a **line-3 banner** inside the board. Location (`sprints/done/`,
`sprints/cancelled/`) is a **second** carrier, exactly as `tasks/done/` is for tasks. Both terminal
states are set only by **producer-only mover skills**.

---

### 1. The sprint status vocabulary — four values

| Status | Line-3 banner | Lives in | Set by |
|---|---|---|---|
| **`🔲 Backlog`** | `> ## 🔲 Backlog — <date>.` | `ai-agents/sprints/` | producer, **by hand** |
| **`🔄 In progress`** | `> ## 🔄 In progress — <date>.` | `ai-agents/sprints/` | producer, **by hand** |
| **`✅ Done`** | `> ## ✅ Done — <date>. Closed by /fkit-sprint-done.` | `ai-agents/sprints/done/` | **mover only** |
| **`⛔ Cancelled`** | `> ## ⛔ Cancelled — <date>. Closed by /fkit-sprint-cancelled — <reason>.` | `ai-agents/sprints/cancelled/` | **mover only** |

- **The markers are deliberately the task markers**, so one eye reads both boards. `🔲 Backlog` was
  **ruled by the owner** (V2); the rest follow the task vocabulary.
- **`🚧 Blocked` does NOT exist for a sprint.** ⭐ *Architect's call.* A sprint is not blocked — its
  **tasks** are. A board whose every row is blocked is still `In progress`, and beat 5 (*"What's in
  the way"*) is where that gets reported. Adding a fifth status would put the same fact in two places.
- **`➡️ Moved` does not apply to a sprint.** ⭐ *Architect's call.* It is a **row disposition**, not a
  board state.
- **The agent-closed marker applies**, on ADR-033 §5's rule unchanged:
  `Closed by /fkit-sprint-done (agent-closed — not owner-verified).`
- **A reason is mandatory on `⛔ Cancelled`**, mirroring the task vocabulary's *"A reason is
  mandatory."*
- **The vocabulary document** is a new `conventions/sprint-status-vocabulary.md`, sibling of the task
  one. ⛔ **This ADR names it and does not create it** — a separate task writes it. It is deliberately
  written here in backticks and **not** as a markdown link (see *§Authoring constraints this ADR obeyed*).

#### ⭐ 1.1 — The `Backlog` collision this ADR ACCEPTS, and the rule that makes it survivable

⚠️ **The owner OVERRULED the architect's recommendation here, and the objection is recorded rather than
dropped.** The architect recommended `🔲 Planned`. The owner ruled **`🔲 Backlog`** (V2), on the basis
that it matches their own 2026-08-25 wording and the task vocabulary **exactly**.

**The architect's objection, stated at full strength:** `Backlog` is already a **load-bearing identity
token** in this very subsystem. ADR-041 §2 adds it to ADR-040's H1 rung — *"a whole trimmed H1 segment
that is exactly `Backlog` **or** exactly `Sprint Backlog` resolves the identity to `Backlog`"* — and
`resolve_identity`'s basename special case (`claude/skills/fkit-status/dashboard.sh:144-164`, whose
`basename` test is the `if` at `:148`) resolves any `backlog.md` to it. After this ADR **one word
carries two meanings**:

| Reading | What it names | Where it appears |
|---|---|---|
| `Backlog` the **identity** | the standing unscheduled board (`ai-agents/sprints/backlog.md`) — **never a sprint, never eligible** | `identity="Backlog"` in `select-active`; a brief's `## Sprint: Backlog` |
| `Backlog` the **status** | a sprint that is scoped but not started | a board's **line-3 banner** |

⭐ **The disambiguation rule, stated as a hard rule and not a note: a reader tells the two apart by
POSITION, never by the glyph.**

- A **task** status is the `## Status` field of a `brief.md`, or the **leading cell** of a board row.
- A **sprint** status is a **blockquoted H2 on line 3 of a board**, and nowhere else.
- A **sprint identity** is what `resolve_identity` returns for a file, and nowhere else.

The glyphs are shared on purpose — minus `🚧` and `➡️`, which stay task-only. ⛔ **Do not "fix" this
collision by inventing a second glyph set**; the by-position rule is the fix, and the collision is
accepted with its cost named.

#### ⭐ 1.2 — The SECOND one-word-two-meanings collision: `unresolved`

⭐ *Architect's call, added 2026-09-10 under owner ruling W1.* §1.1 set the standard that a shared word
gets named rather than left implicit. **`unresolved` is the second instance, and it is named here.**

| Reading | What it names | Where it appears |
|---|---|---|
| `unresolved` the **identity** | `resolve_identity` returned nothing for the file — ADR-041 §1.3 | `candidate … identity="unresolved"` |
| `unresolved` the **status** | line 3 carried no banner, or a malformed one (§2) | `candidate … status="unresolved"` |

⭐ **Same disambiguation rule, by POSITION: the `identity=` field carries the identity reading, the
`status=` field carries the status reading. Never infer one from the other.** The two are independent:
a board can have a perfectly good `Sprint 9` identity and an `unresolved` status, and a board can be
`unresolved` in **both** fields at once — an `.md` at depth 1 whose H1 carries neither a
`Sprint <N><suffix>` nor a `Backlog` token **and** whose line 3 has no banner.

⚠️ **Corrected 2026-09-10 under owner ruling X1 (review R23): `backlog.md` is NOT that example, and
citing it here was the very misreading this section exists to prevent.** ⛔ Measured 2026-09-10,
`backlog.md`'s identity is **`Backlog`** — `resolve_identity`'s basename branch sets `_id="Backlog"`
(`claude/skills/fkit-status/dashboard.sh:148`, `:163`), §1.1's own table row reads
*"`identity="Backlog"` in `select-active`"*, and **P4** asserts
`candidate file="backlog.md" identity="Backlog" status="unresolved"`. ⭐ **`backlog.md` is the
one-of-each case, not the both case** — which is exactly why the by-position rule above is the fix.

⛔ **The carve-out in §7.1 is written in IDENTITY-space, and must be read there.** *"Must NOT fire for a
`Backlog` or `unresolved` identity"* names the **identity** reading. ⚠️ Read in status-space it would
swallow `sprint-status-missing` entirely — every banner-less board has `unresolved` **status**, so the
drift could never fire at all. **That reading is wrong.** Test **P3** is the backstop: it asserts the
drift DOES fire for a banner-less board with an eligible identity.

---

### 2. The carrier — the line-3 banner grammar (SD-1, owner-ruled)

```
> ## <MARKER> <STATUS> — <YYYY-MM-DD>.[ <trailing prose>]
```

- ⛔ **Strictly line 3.** Line 1 is the H1, line 2 is blank, line 3 is the banner. All seven archived
  boards satisfy this today. **Strict position is chosen over "the first line of the leading
  blockquote"** so that a `> ## ` appearing deeper in a board can never be mistaken for a status.
- **Recognizer — one implementation, in `dashboard.sh`** (ADR-041 §5's constraint, inherited whole).
  Line 3 must match:

  ```
  ^> ## (🔲 Backlog|🔄 In progress|✅ Done|⛔ Cancelled|🔒 CLOSED) — [0-9]{4}-[0-9]{2}-[0-9]{2}\.( |$)
  ```

  ⚠️ **The date is part of the recognizer, not just of the grammar above it — corrected 2026-09-10
  under owner ruling W1 (review R4).** ⭐ *Architect's call.* The recognizer this ADR first pinned was
  `…(🔒 CLOSED)([ .]|$)`, which **admitted every dateless and malformed form**: measured 2026-09-10
  against that regex, bare `> ## 🔄 In progress`, `> ## 🔄 In progress arbitrary trailing garbage`, and
  `> ## ✅ Done — not-a-date.` **all matched.** §1 has the producer writing `🔲 Backlog` and
  `🔄 In progress` **by hand** — the exact path that drops a date — so a loose recognizer would
  silently accept a banner the grammar forbids. **A recognizer that does not enforce the grammar it
  sits under is not a recognizer.**

  - ⛔ **A line 3 that begins `> ## ` and carries one of the five markers but does NOT match the
    recognizer is MALFORMED, not absent.** Status resolves to `unresolved`, the board is **never**
    eligible, and `drift sprint-status-malformed` (§7) fires — ⛔ **distinct from
    `sprint-status-missing`**, so *"the producer typed it wrong"* never reads as *"nobody typed it"*.
  - **Verified against real data 2026-09-10:** all seven `🔒 CLOSED` banners in `ai-agents/sprints/done/`
    match the tightened form — four with `Superseded by …` trailing prose, three ending at the period.
    ⭐ **Tightening costs this repo nothing.**

- **Exactly one banner per board — an AUTHORING RULE, not an enforced one.** ⭐ *Architect's call,
  stated 2026-09-10 (review R13) because the ADR previously forbade a second matching line while test
  **P10** explicitly tolerated one.* ⛔ **Only line 3 is ever read.** A `> ## 🔄 In progress — …` line
  deeper in a board is **not a status**, does **not** make the board ambiguous, and emits **no drift** —
  that is the whole point of choosing strict position over "the first line of the leading blockquote".
  The one-banner rule tells an author not to write a confusing document; it is **not** a check, and
  **P10 pins the tolerance** rather than contradicting it.
- **Legacy `🔒 CLOSED` is a member of the grammar and reads as `✅ Done`**, with
  `Superseded by [Sprint N+1](…)` tolerated as trailing prose. ⭐ **Read FOREVER, written NEVER** —
  owner-ruled (V3) as a **permanent, tested compatibility rung**. It is not a migration window.
- **No banner at line 3 → status `unresolved` → never eligible**, plus `drift sprint-status-missing`
  — ⛔ **except** where the identity is `Backlog` or unresolved (§7 carve-out 1, which is written in
  **identity**-space; see §1.2). ⛔ **Never silently `In progress`.**
- **A MALFORMED banner → status `unresolved` → never eligible**, plus `drift sprint-status-malformed`.
  ⛔ **The same status value, a DIFFERENT drift fact**, so *"typed wrong"* never reads as *"not typed"*.
  ⛔ **The `Backlog`/unresolved-identity carve-out does NOT extend here — decided 2026-09-10 under
  owner ruling X1 (review R24).** ⚠️ This ADR previously extended it and §7.1's HARD RULE carved out
  only `sprint-status-missing`; **nothing decided which won.** ⭐ *Architect's call:* **§7.1 wins and
  the carve-out stays `sprint-status-missing`-only.** The carve-out's entire justification is a
  *permanent false drift on a well-formed board* — `backlog.md` has prose at line 3 and will never
  carry a banner, so `missing` would fire forever on a correct file. **A malformed banner is not a
  well-formed board:** someone typed a status onto a board that must not carry one, the record fires
  **once**, and fixing the line silences it. ⛔ **A carve-out that swallows more than its own
  justification is the §1.2 hazard again.** ⭐ For `backlog.md` itself the point stays near-moot —
  plain prose at line 3 does not begin `> ## ` and so matches **neither** drift.
- **`## Status` is untouched.** A banner begins `> ` and `STATUS_HEADING_RE`
  (`claude/skills/fkit-status/dashboard.sh:372`) is anchored at `^## Status`; they cannot collide.
  Verified against live code 2026-09-10.

#### 2.1 — The active-board marker (ADR-041 option (d), grammar the architect's)

The literal token **`⭐ ACTIVE BOARD`** appearing in an `In progress` banner's **trailing prose**.
⭐ *Architect's call on the grammar; the owner ruled only that a marker overrides (OQ-1).* One carrier,
one reader, one grammar — **no second file, no second field.**

#### 2.2 — Rejected carriers, recorded with reasons

- **A `## Sprint status` field.** A second `##` heading in a file whose `## Status` is already
  load-bearing and whose sections are parsed positionally. Rejected.
- **An H1 segment.** ADR-040 owns the H1, and a status is not an identity. Two different questions
  answered by one string is how the identity grammar got into trouble in the first place. Rejected.
- **Folder-location only.** Cannot express `Backlog` vs `In progress` at all — and it is precisely
  what failed for Sprint 5, which stayed "active" while finished. Rejected.

#### 2.3 — The `select-active` interface this ADR fixes for the implementing task

```
⟦fkit-dashboard v2⟧
⟦SELECT⟧
active file="sprint-8.md" identity="Sprint 8" status="In progress"
active file="sprint-9.md" identity="Sprint 9" status="In progress"
board file="sprint-8.md" identity="Sprint 8" status="In progress" reason="lowest-ordered"
candidate file="backlog.md" identity="Backlog" status="unresolved"
candidate file="sprint-8.md" identity="Sprint 8" status="In progress"
candidate file="sprint-9.md" identity="Sprint 9" status="In progress"
⟦FACTS⟧
⟦END⟧
```

The zero-active case:

```
⟦fkit-dashboard v2⟧
⟦SELECT⟧
active none
candidate file="backlog.md" identity="Backlog" status="unresolved"
candidate file="sprint-7.md" identity="Sprint 7" status="Done"
⟦FACTS⟧
⟦END⟧
```

⚠️ **The closing `⟦END⟧` was added to both blocks 2026-09-10 under owner ruling X1 (review R21).** ⛔
The blocks were **envelope-incomplete** while **P17** made them normative *"byte for byte"* — measured
2026-09-10, `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` ends
`⟦FACTS⟧` then `⟦END⟧` (the printf at `claude/skills/fkit-status/dashboard.sh:295`), so a builder
obeying P17 literally would have **written a test that reds on its first run, or deleted `⟦END⟧` from
`select-active`.** ⭐ **The envelope is unchanged by this ADR; only the illustration was short.**

#### ⛔ 2.3a — The field set per line kind. **This table is normative; the examples above are illustrations of it.**

⚠️ **Added 2026-09-10 under owner ruling W1 (review R1).** ⛔ The ADR previously said *"Every line
carries `status=`"* while its own example's `board` line carried none — a builder had to **invent** the
`board` line's field set, and the ship-loop is that line's consumer. **The contradiction is resolved
in favour of uniformity: `board` carries `status=` too.**

| Line | Fields, **in this order** | Cardinality |
|---|---|---|
| `active` | `file` · `identity` · `status` | **one per `In progress` sprint**, ascending by identity. `status` is always the literal `In progress` — ⭐ **printed, never implied** |
| `active none` | ⛔ **none — it is a SENTINEL, not a record.** No `file=`, no `status=` | exactly one, **iff** zero sprints are active; mutually exclusive with any `active file=…` line |
| `board` | `file` · `identity` · `status` · `reason` | exactly one, **iff** at least one sprint is active. `reason` ∈ `lowest-ordered` \| `active-marker` |
| `candidate` | `file` · `identity` · `status` | one per candidate, in glob (byte) order. `status` ∈ `Backlog` \| `In progress` \| `Done` \| `Cancelled` \| `unresolved` |

- ⭐ **Why `board` carries a redundant `status=`.** The stated success criterion is that the script
  *"names the board **and prints the status it chose it for**"*. That property has to hold on **the very
  line that names the board**, not only on a sibling line the reader must join to it. The redundancy is
  one constant field; the alternative is a consumer inferring a status by cross-referencing.
- ⛔ **`reason` is `board`-only.** No other line carries it.
- **Separator: exactly ONE space** between the line kind and the first field, and between fields —
  matching the live emitter (`claude/skills/fkit-status/dashboard.sh:272`, `:282`:
  `printf 'active file="%s" identity="%s"\n'`). ⚠️ The two-space `board  file=` shown in this ADR's
  first draft was **alignment, not protocol** (review R14), and is withdrawn.
- ⛔ **Consumers parse by KEY, never by position.** Field order is fixed so the output is diffable and
  greppable; it is **not** a licence to read field 3 positionally. A future field is appended, and a
  positional parser is what breaks when it is.
- ⭐ **One `active` line per In-progress sprint, ascending.** "Current" is now **plural**, so the plural
  lives in the wire format — it is never reconstructed by a model.
- ⭐ **Exactly one `board` line** — the single-board answer the ship-loop needs. Two consumers, **one**
  output; `one-skill-one-output.md` stays intact.
- **Zero active** → `active none`, every `candidate` still listed **with its status**, exit **3**.
- **A new sibling mode `status <plan>`** — prints one token; exit 0 resolved, 3 unresolved, 1 usage.
  It mirrors `identity`'s value-not-rendering contract. ⛔ **Deliberately NOT folded into `identity`**,
  whose *"NO `⟦…⟧` MARKERS, deliberately … a caller reads it with a single command substitution"*
  contract is documented in-file (`claude/skills/fkit-status/dashboard.sh:223-228`).

#### ⚠️ 2.4 — The test repin is NOT cosmetic. Hand this to the implementing task in these words.

`test/dashboard-contract.test.js` asserts the active line by **exact string equality** —
`assert.equal(activeLine(out), 'active file="…" identity="…"')` — in **S1, S1b, S2, S3, S5, S6, S7 and
S8**. Adding `status=` breaks **all eight**. Worse:

- `activeLine` is defined as `selectLines(out).find((l) => l.startsWith('active'))`. With **plural**
  `active` lines it silently returns **only the first**, so a wrong test would stay **green**.
- Every S-fixture builds its boards with `prosePlan()`, which emits `# H1\n\nBody prose.\n` — **no
  banner**. Under this ADR's rule, **every one of those fixtures becomes ineligible.**

⛔ **This ADR is cited here by test NAME and quoted fragment rather than `path:NNN` deliberately**:
`test/dashboard-contract.test.js` was measured as modified in the working tree on 2026-09-10 by
concurrent work, and the plan's own `:2536` coordinate had **already** moved to `:2583` by the time
this ADR was written. The names are the durable anchors.

---

### 3. Location, `sprints/done/`, and the new `sprints/cancelled/` (SD-2, owner-ruled)

**Location stays a second carrier, exactly as `tasks/done/` is for tasks.**

- `✅ Done` → `ai-agents/sprints/done/`.
- `⛔ Cancelled` → `ai-agents/sprints/cancelled/`, **created on first use.** Git cannot carry an empty
  directory, so eager creation was never available anyway. ⛔ **This ADR's migration does NOT create it.**
- `select-active` scans **depth 1 only**, so both folders are excluded **by construction** — no new
  exclusion logic.
- **Href rule for the new folder:** `../backlog.md`, one hop up — identical to `done/`.

#### ⛔ 3.0 — Row disposition, for BOTH movers. **Neither mover may invent this.**

⚠️ **Added 2026-09-10 under owner ruling W1 (review R2).** ⛔ The ADR previously defined row
disposition **only** for a cancelled sprint while §4 step 2 sent **both** movers here — leaving
`/fkit-sprint-done` with **no row policy at all**, so *reject the close*, *move to a successor*, *move
to Backlog* and *freeze* were all equally consistent with the text. ⭐ **This clause is the
architect's call under W1**, and it is built on the repo's own worked precedent rather than invented.

**One rule, stated once, for both movers:**

1. ⛔ **A closed row is frozen history and is NEVER touched** — `✅ Done`, `⛔ Cancelled`, and an
   already-`➡️ Moved` row alike. Unchanged from this ADR's first draft.
2. ⛔ **An open row is NEVER left open on a terminal board, and its presence NEVER blocks the close.**
   ⭐ *Rejected by name:* **refuse-to-close-while-rows-are-open.** A sprint's rows are the producer's
   planning object; a board that cannot reach its terminal state until every row is resolved makes the
   status carrier hostage to the work, which is the opposite of what §1 buys. ⭐ *Also rejected:*
   **freeze open rows in place** — a `🔲`/`🔄` row on a `✅ Done` board is a row that no board is
   driving, and nothing would ever look at it again.
3. **Every open row is RELOCATED, and the destination is deterministic:**

| Mover | Destination | Marker written |
|---|---|---|
| `/fkit-sprint-done` | the **lowest-ordered non-terminal successor** board — a board whose identity orders **above** the closing sprint and whose status is `🔲 Backlog` or `🔄 In progress`. **If none exists**, the Backlog board | `➡️ Moved to [<identity>](../<successor-basename>) — priority M`, or `➡️ Moved to [Backlog](../backlog.md)` |
| `/fkit-sprint-cancelled` | ⛔ **always the Backlog board.** A cancelled sprint's work is de-scoped, not carried | `➡️ Moved to [Backlog](../backlog.md)` |

- **Both marker forms are `task-status-vocabulary.md`'s, quoted not invented** — *"Moved"* is
  `➡️ Moved to [Sprint N](…) — priority M`, and *"Moved (to backlog)"* is
  `➡️ Moved to [Backlog](backlog.md)` with *"**No `— priority M` suffix**: the board is unranked."*
  ⚠️ Its own note applies: *"`N` … is the target sprint's **identity**, not a number"*.

##### ⛔ 3.0.1 — The successor href. **Corrected 2026-09-10 under owner ruling X1 (review R17).**

⚠️ **This ADR first wrote the successor marker as `➡️ Moved to [Sprint N](sprint-N.md)`. That was wrong
TWICE and is withdrawn.** ⭐ *Architect's call under X1.*

1. ⛔ **It assumed the successor's FILENAME is `sprint-N.md`** — the exact assumption ADR-041 exists to
   deny, and contradicted by **this ADR's own P14 fixture**, which gives identity `Sprint 6` to
   `plan-sprint-6.md`. **`task-status-vocabulary.md` does not supply that filename either** — measured
   2026-09-10, its *"Moved"* row writes the href as a literal ellipsis, `➡️ Moved to [Sprint N](…)`,
   precisely because the target's name is not derivable from its identity.
2. ⛔ **It omitted the `../` hop that its own sibling marker, in the same table cell, carries.** Both
   markers are written onto the **closing** board, which §4 step 4 then `git mv`s into `done/` or
   `cancelled/`. ⚠️ **The failure has a silent tail:** today `done/sprint-N.md` does not exist, so the
   link dangles and the guard catches it — but once that successor is **itself** archived under the
   same basename, `sprint-N.md` **silently resolves to the archived copy** instead of the live board,
   and no guard ever fires. **A dangling link is loud; this one would not be.**

⭐ **THE RULE, and it is `task-status-vocabulary.md`'s own, applied to both markers instead of one:**

- **The label is the successor's RESOLVED IDENTITY** — what `resolve_identity` returns for the chosen
  file, never its basename and never a number.
- **The href is the chosen file's BASENAME, one hop up: `../<basename>`.** ⭐ This is not a new rule —
  the vocabulary states it for the backlog marker in the same breath: *"The href is relative to the
  file holding the row (`../backlog.md` once the plan is archived)."* ⛔ **The row-holding file ends up
  in `done/`/`cancelled/`, so `../` is mandatory on BOTH markers, not just the backlog one.**
- ⛔ **The identity and the basename are two separate lookups and the mover performs both.** A mover
  that derives one from the other has reintroduced the filename-as-identity bug.

##### ⛔ 3.0.2 — The three things *"a default that never has to be guessed"* did not actually pin. **Added 2026-09-10 under owner ruling X1 (review R18).**

⚠️ **§3.0 claimed the destination rule is *"a default that never has to be guessed"* and then left
three inputs undefined — so `0341` would have guessed all three.** ⭐ *Architect's call under X1 on all
three; each is grounded in an existing rule rather than invented.* ⛔ **The row-policy CHOICE is
owner-accepted and is not reopened here — only its under-determination is fixed.**

1. ⛔ **The enumeration set: depth 1 of `ai-agents/sprints/`, the same candidate set `select-active`
   scans (§2.3), and no other.** Archives are excluded **by construction**, which is the point — a
   board under `done/` can never be a non-terminal successor. **No new traversal, no new depth.**
2. ⛔ **The tie-break: §6.4 steps 3 and 4, reused verbatim, over §3.0's OWN filter.** ⚠️ §6.4 is **not**
   reusable whole — its step 2 filters to `In progress` **only**, while a successor may be
   `🔲 Backlog` **or** `🔄 In progress`. **The split, exactly:** step 2 is **replaced** by §3.0's
   successor filter (identity orders **above** the closing sprint **AND** status ∈ {`Backlog`,
   `In progress`}); **steps 3 and 4 are unchanged** — order by §6.1's comparator lowest-first, then
   ADR-041 §1.5's byte order under `LC_ALL=C`, **first wins**. ⭐ Two files claiming one successor
   identity therefore resolve deterministically, exactly as selection does.
3. ⛔ **`priority M`: the row APPENDS to the destination board, and `M` is the rank it receives
   there.** The relocated rows keep **their relative order on the closing board**. ⭐ **This is
   [ADR-035](adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)'s own rule, not
   a new one** — *"Where a new row's merit position is out of reach, it appends"* — and a relocating
   mover has no merit judgment to make, so every relocated row's position is out of reach by
   definition. ⚠️ **`M` is NEVER carried over from the closing board.** A rank is board-scoped
   ([`priority-is-rank-not-identity.md`](../conventions/priority-is-rank-not-identity.md)), and the
   brief-writing skill's de-scope procedure already defines `M` as *"the priority the task receives in
   **Sprint N**"* — the destination's number, not the source's. ⛔ **And when the destination is the
   Backlog board there is no `M` at all** — the unranked-forward clause below governs.
- ⚠️ **The unranked-forward clause overrides the suffix.** When the destination board is itself
  unranked, the row is written **with no `— priority M` suffix** even though it is a sprint-to-sprint
  move. Sprint 7's board records this as *"the ordinary path, not a deviation"* under its heading
  *"⛔ This board is UNRANKED — and one row is not a rank"*, quoting the rule that the marker is written
  *"with **no `— priority M` suffix**"* and *"⛔ Never write `— priority —`, and never invent a number."*
- ⭐ **This is the worked precedent, not a new idea.** Sprint 7's *"Where this board's shape comes
  from — precedent vs invented"* table records *"Sprint 6 `P10` did exactly this for the row it carried
  over"*. **`/fkit-sprint-done` is being told to do by rule what this repo already did by hand.**
- **The producer may override a single row's destination**, naming the reason in the cell — the
  destination rule is a **default that never has to be guessed**, not a prohibition on judgment.
- Each affected brief's `## Sprint` / `## Status` / `## Priority` follow the de-scope procedure the
  brief-writing skill already defines.
- ⛔ **A row relocated to a board that does not exist is a defect, not a deferral.** If the chosen
  destination is a successor board, the mover verifies the file exists before writing the marker;
  otherwise it falls to the Backlog board. A dangling `➡️ Moved to [Sprint N](…)` reds the link guard.

#### ⚠️ 3.1 — Required follow-ups on the mover-building task (`0341`)

⭐ **Three of them. The first is V4's and was recorded 2026-09-10; the second and third were recorded
2026-09-11 under owner ruling Y1 (review round 3, R27 and R28).** ⛔ **None of the three is a new
design ruling, and none amends §3.0.** Each records, in V4's shape, a measured fact plus the thing
`0341` must settle before it builds — the owner's basis for Y1, recorded: neither R27 nor R28 is a
decision that would land in the wrong document, and both fall on `0341`, which has not started.

**⭐ FOLLOW-UP 1 — the `cancelled/` guard exemption (V4, owner-ruled 2026-09-10).**

Measured 2026-09-10: `test/coordination-citation-policy.test.js:447-448` exempts exactly **two**
literal prefixes — `ai-agents/sprints/done/` and `ai-agents/sprints/reviews/`. **`ai-agents/sprints/cancelled/`
is in neither guard's exemption list.** The first cancelled board would therefore be **scanned**,
unlike every other frozen board, and its frozen `path:NNN` claims would **red `npm test`**.

⭐ **Owner ruling V4, in force: whatever change creates `ai-agents/sprints/cancelled/` MUST, in the same
commit, add that prefix to that exemption list.** ⛔ **Not deferred to "when a sprint is actually
cancelled"** — deferring guarantees the red lands on whoever cancels a sprint, at the worst possible
moment. This is recorded as a **required follow-up on the mover-building task** (`0341`).

**⭐ FOLLOW-UP 2 — §3.0.2's successor ORDERING has no surface a prose mover can call. `0341` picks the
surface; ADR-041 §5 already forbids the one route it must not take. (Y1, recorded 2026-09-11, review
R27.)**

⛔ **The gap, measured 2026-09-11.** §3.0.2 item 2 tells the mover to *"order by §6.1's comparator
lowest-first"*, and §6.1's comparator is `identity_gt` **inside `dashboard.sh`**. But
`/fkit-sprint-done` is a **SKILL — markdown prose an LLM executes**, exactly like `/fkit-task-done`,
and **no `dashboard.sh` mode orders the set §3.0.2 hands it.** The dispatch recognises two subcommands
and no more (`claude/skills/fkit-status/dashboard.sh:305-309`, against
`USAGE` at `:218`); the two per-file lookups **are** covered — `identity <plan>` at `:226-232`, and
§2.3a adds `status <plan>` — but **ordering is exposed nowhere.** `select-active` cannot stand in for
it: it filters on identity alone (`:253` — `is_eligible "$_i" || continue`) and has **no notion of
status**, so it silently drops every `🔲 Backlog` successor, and §3.0.2's successor set is
`Backlog` ∪ `In progress`.

⭐ **Why this is a POINTER and not a new ruling.** ⛔ **ADR-041 §5 already decides the half that
matters, and §8.2 lists it as *"in force and untouched"*:** *"The exact CLI surface is the
implementer's call; re-implementing the grammar is not."* ⛔ **So the one route `0341` may NOT take is
having the skill's prose compare `Sprint 9` against `Sprint 10` itself** — that is *"two grammars for
one question"*, the defect ADR-041 §5 exists to forbid, and it walks straight into the two hazards
`identity_gt`'s own comment names at `claude/skills/fkit-status/dashboard.sh:180-183`: *"a leading
zero … and a very long `<N>`, where a 30-digit sprint number overflows the shell's integer and
compares as garbage."* ⭐ **Which surface satisfies §5 is `0341`'s call**, exactly as §5 says. ⛔ **This
ADR names none**, and §3.0.2 is **not** re-specified: its rule — lowest-ordered successor, ADR-041
§1.5 byte order to break a tie, first wins — is unchanged and is what the chosen surface must deliver.
⚠️ **If `0341` concludes a new mode is needed, that is a `0338`/`0341` boundary question to escalate,
not a licence to widen §3.0.2's *"No new traversal, no new depth"* by itself.**

**⭐ FOLLOW-UP 3 — §3.0.2's brief-field bullet names the WRONG of the brief-writing skill's TWO
procedures for the successor case, and mirroring the right one verbatim reintroduces R17. (Y1,
recorded 2026-09-11, review R28.)**

⚠️ **A named regression, stated before the detail: a builder obeying that bullet on a
successor-sprint relocation manufactures the exact permanent `drift disagreement` the cited skill's
own warning documents as *"Verified empirically"*.**

⛔ **Measured 2026-09-11.** §3.0.2 ends *"Each affected brief's `## Sprint` / `## Status` /
`## Priority` follow the de-scope procedure the brief-writing skill already defines."* That skill
defines **two** relocation procedures, not one:

- *"De-scoping a task out of a sprint and back onto the Backlog board"*
  (`claude/skills/fkit-task-brief/SKILL.md:369-385`) — **Backlog-only**. Its steps 3/4/5 set
  `## Sprint` → **`Backlog`**, `## Status` → **`🔲 Backlog`**, `## Priority` → **`Unscheduled`**, and it
  states *"There is no `— priority M` suffix here"*.
- ⭐ **The right one for a successor move — *"Pulling a backlog task into a sprint"*
  (`claude/skills/fkit-task-brief/SKILL.md:348-360`, the immediately preceding bullet in the same
  list, its ⚠️ warning at `:362-368`).** Its step 3 sets `## Sprint` → **`Sprint N`** *"(and give
  `## Priority` the real number)"*.

⛔ **Why the wrong one breaks.** §3.0's table sends `/fkit-sprint-done`'s rows to a **successor**
board, so the row reads `➡️ Moved to [Sprint 9](…)` while the de-scope procedure leaves the brief
reading `Backlog` — and that skill's own ⚠️ says what follows: *"drift rule 2 compares a `➡️ Moved`
row's target against the brief's `## Sprint` … the row is flagged `drift disagreement` — and because a
drifted row **always renders**, it never disappears from the backlog board. Verified empirically,
2026-07-18."*

⛔ **Two tails `0341` must carry with it.**

1. §3.0.2 item 3 attributes its `M` quote — *"the priority the task receives in **Sprint N**"* — to
   *"the de-scope procedure"*. Measured: that sentence is at `claude/skills/fkit-task-brief/SKILL.md:356`,
   **inside the pull-into-a-sprint procedure**, which is the opposite move. ⭐ The rule §3.0.2 states is
   unaffected — `M` is still the **destination** board's rank — only the attribution is to the other
   procedure.
2. ⛔ **That procedure's step 2 (`claude/skills/fkit-task-brief/SKILL.md:353`) still writes
   `➡️ Moved to [Sprint N](sprint-N.md) — priority M`** — the **filename-as-identity form §3.0.1
   withdrew under R17.** ⭐ **`0341` mirrors that procedure's BRIEF-FIELD steps, never its marker**: the
   marker is §3.0.1's, `[<resolved identity>](../<basename>)`, two separate lookups.

⛔ **§3.0.2 is not re-specified here and the destination rule is untouched.** The three destinations
§3.0 fixes each pair with one of the two procedures — successor → pull-into-a-sprint;
`/fkit-sprint-done`'s no-successor fallback and `/fkit-sprint-cancelled` → de-scope — and ⭐ **which
pairing `0341` writes into the mover prose is its build step**, recorded here so it is not guessed.

---

### 4. The movers — `/fkit-sprint-done` and `/fkit-sprint-cancelled` (SD-3, owner-ruled)

**Producer-only, under ADR-033's reasoning applied verbatim:** the closing identity is separated from
the doing identity; role-gating is **separation, not prevention**; the agent-closed marker stays prose.

**Enforcement, three sites moving together** — the same set ADR-033 named:

1. `skills_for_role()` in `claude/skills-for-role.sh` — the **producer** row gains the two names.
   That function is the single declaration site.
2. The [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
   `PreToolUse` skill-ownership hook, which reads that same function.
3. [ADR-036](adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md)'s declared site
   inventory.

⛔ **The movers' own prose cannot grant a permission the mapping denies** — the in-file comment above
`skills_for_role()` records why the SKILLs, the mirrors and that file must move together.

**One act, in this order:**

1. Stamp the line-3 banner.
2. Dispose of the rows (§3.0).
3. Repoint links.
4. `git mv` the board into `done/` or `cancelled/`.

⚠️ **This ADR first claimed the order was *"the order the task movers already do it"*. That claim was
FALSE and is withdrawn — corrected 2026-09-10 under owner ruling W1 (review R8).** Measured: both task
movers `git mv` **before** repointing — `claude/skills/fkit-task-done/SKILL.md:123` (*"### 3. Move the
task FOLDER to `done/`"*) precedes `:134` (*"### 4. Find every place the task is referenced"*), and
`claude/skills/fkit-task-cancelled/SKILL.md:102` / `:113` have the identical shape. ⛔ **The sprint
movers deliberately INVERT that order, and `0341` must be told it is inverting, not mirroring.**

⭐ *Architect's call on the inversion, with its reason:* a sprint board is **linked from far more places
than it links to** — every brief it carries, every sibling board, the ADRs. Repointing while the file
is still at its old path means the search token and the file agree, so a missed reference is a
**dangling link** the guard catches. Repointing after the move means the same miss reads as a link to
a file that exists at neither path. ⚠️ **The cost is named:** an interrupted mover now leaves repointed
links to a not-yet-moved board — caught by §7's location-mismatch drifts, and consistent with
*atomic-by-invocation* below.

⭐ **Atomic by INVOCATION, not by filesystem.** This ADR says so plainly rather than implying a
transaction: an interrupted mover leaves a half-moved board, and §7's drift facts are what catch it.

**`🔲 Backlog → 🔄 In progress` is free for the producer to set by hand** — a planning act, exactly like
`➡️ Moved`. Only the two **terminal** states are mover-gated, mirroring the task vocabulary's authority
split.

**`Superseded by [Sprint N+1](…)` is OPTIONAL**, written only when a successor board exists at close
time. Sprints 5, 6 and 7 omit it, and ⭐ **that was correct, not drift.**

---

### 5. Eligibility, and the shape of an N-sprint briefing

**Eligible to be reported active** = identity is a `Sprint <N><suffix>` token (ADR-040/041, unchanged)
**AND** status is `In progress`.

- `Backlog` identity — **never** eligible (ADR-041 §1.3, unchanged).
- `unresolved` identity — **never** eligible (ADR-041 §1.3, unchanged).
- `Done` / `Cancelled` — **never** eligible, **by status OR by the legacy `🔒 CLOSED` banner** (OQ-3).
  ⭐ This is what makes a **finished-but-unarchived** board harmless: the banner alone disqualifies it,
  even while it still sits at the top of `sprints/`.

**`/fkit-status` with an empty argument reports EVERY eligible sprint.** The seven-beat shape for N
sprints — ⭐ **architect's call, and it deviates from the brief's own recommendation, with the reason
stated:**

| Beat | Scope for N active sprints |
|---|---|
| 1 · The headline | **ONCE, across all boards.** Beat 1 is *"if someone reads only this line"* — there cannot be N of those |
| 2 · Where we are | **per sprint**, ascending |
| 3 · What's moving | **per sprint** |
| 4 · What's next | **ONCE, across all.** Beat 4 is *"the one thing to pick up"*. N recommendations is not a recommendation |
| 5 · What's in the way | **per sprint** |
| 6 · What I need from you | **ONCE, across all.** One decision queue — otherwise the owner reads N lists to assemble their own work |
| 7 · The dashboard | **one table per sprint**, ascending |

⭐ The brief recommended beats 1–6 per sprint. **Repeating 1, 4 and 6 destroys what those three beats
are for.** Recorded as the architect's call, and overridable by the owner.

---

### 6. The single-board choice (OQ-1, owner-ruled)

**The lowest-ordered eligible sprint, overridden by an explicit `⭐ ACTIVE BOARD` marker.**

#### ⛔ 6.1 — The implementation constraint this ADR pins

**Keep `identity_gt` exactly as written** (`claude/skills/fkit-status/dashboard.sh:187-192`) and
**SWAP ITS TWO ARGUMENTS at the selection site** (`claude/skills/fkit-status/dashboard.sh:265`).

##### ⛔ The mechanical change, written out. **Do not paraphrase this as "invert the comparison."**

⚠️ **Corrected 2026-09-10 under owner ruling W1 (review R5), which PROVED the trap by running it.**
The site is a **function call**, not an operator, so *"invert the comparison"* admits two readings and
**one of them silently breaks ADR-041 §1.5.**

| | Code at `:265` | Semantics | Verdict |
|---|---|---|---|
| Today | `if [ -z "$_best_id" ] \|\| identity_gt "$_i" "$_best_id"; then` | strictly **greater** — highest wins, **ties keep the first** | the model being reversed |
| ⛔ **The trap** | `if [ -z "$_best_id" ] \|\| ! identity_gt "$_i" "$_best_id"; then` | **`<=`**, because negating `>` yields `≤` — **ties now REPLACE the incumbent** | ⛔ **WRONG.** Measured against a transcript of `identity_gt`: picks `sprint-6.md` where ADR-041 §1.5 requires `plan-sprint-6.md`. **first-wins silently becomes last-wins** |
| ⭐ **Correct** | `if [ -z "$_best_id" ] \|\| identity_gt "$_best_id" "$_i"; then` | strictly **less** — lowest wins, **ties keep the first** | ⭐ **This one.** The comparator is untouched; only the argument order moves |

⛔ **The failure is silent.** A tie only arises when two files claim one identity — the §1.5 case — and
`also=` still names every claimant either way, so the record looks right while the **chosen** file is
wrong. **Test P14 exists to catch exactly this**, because the inherited backstop (S6) is on this ADR's
own repin list and a repin is where a property gets quietly dropped.

Two reasons the comparator itself must not be rewritten, both load-bearing:

1. `identity_gt`'s **length-then-bytes** comparison exists to survive two named hazards its own comment
   records — *"a leading zero … and a very long `<N>`, where a 30-digit sprint number overflows the
   shell's integer and compares as garbage."* **Direction has nothing to do with either.** A rewritten
   comparator reopens both.
2. The selection site's **strictly-greater** test is what delivers ADR-041 §1.5's *"first candidate in
   glob order wins a tie"*. **Strictly-LESS preserves that property identically.** A comparator rewrite
   would not.

#### 6.2 — Does the same-`N` suffix order still bite?

It narrows to a **drift-shaped anomaly**: it now requires two boards with the same `<N>` **both**
carrying `🔄 In progress`, which explicit statuses make a **mistake** rather than a state.

⭐ **Decision, the architect's:** keep ADR-041 §1.4's within-`<N>` suffix order (absent < `a` < `b` < …),
**pick deterministically, and do NOT warn.** The reason is precise: two *different* identities both
`In progress` is now **legal**, so a warning on `Sprint 4` + `Sprint 4c` would fire on the **legal**
case. ⛔ This is explicitly **not** a re-raise of OQ-2 — the owner's OQ-2 answer reframed the task, and
this clause implements that reframe rather than reopening it.

#### ⭐ 6.3 — Plural-current is LEGAL. Same-identity is still DRIFT. The two are separated here because the vocabulary task has to teach the difference.

| Case | Verdict | Output |
|---|---|---|
| **Two different identities both `In progress`** (`Sprint 8` + `Sprint 9`) | ⭐ **LEGAL** | two `active` lines, **one** `board` line, **NO drift record**. This is the whole point of the owner's OQ-2 reframe |
| **Two files claiming the SAME identity** (`sprint-6.md` + `plan-sprint-6.md`) | ⛔ **still DRIFT** | `drift ambiguous-active-sprint …` — ADR-041 §1.5 **untouched** |

Today's `select-active` **cannot tell these apart**, because it has no notion of status. ⭐ **That is
the semantic change of this ADR, stated as one sentence.**

#### ⛔ 6.4 — MIXED-STATUS same-identity: the precedence rule. **Filter first, tie-break second.**

⚠️ **Added 2026-09-10 under owner ruling W1 (review R3).** ⛔ The ADR claimed ADR-041 §1.5 was
*"untouched"* while §5's new `In progress` filter **changes the candidate set §1.5 sorts** — and never
said which operation runs first. For `plan-sprint-6.md` (`✅ Done`) + `sprint-6.md` (`🔄 In progress`),
**filter-first picks `sprint-6.md`; §1.5-first picks the terminal board.** ⛔ Two answers, both
consistent with the text as written. **This clause fixes one.**

⭐ **THE RULE, in order, and there is no other:**

1. **Resolve** every candidate's identity (ADR-041 §1.2 ladder — unchanged) **and** its status (§2).
2. ⛔ **FILTER to the eligible set** — identity is a `Sprint <N><suffix>` token **AND** status is
   `In progress` (§5).
3. **Order** the survivors by §6.1's comparator, lowest first.
4. **Tie-break** among same-identity survivors by ADR-041 §1.5 — byte order under `LC_ALL=C`, first
   wins, `also=` naming every claimant.

**Why filter-first, stated so it is not re-argued:**

- ⭐ **It is ADR-041's own ordering, not a change to it.** ADR-041 puts eligibility (§1.3) **ahead of**
  the tie-break (§1.5); §1.5 has always been a tie-break *among eligible candidates*. ⭐ **This ADR adds
  a rung to §1.3, and §1.5 keeps operating exactly where it always did — after eligibility.**
- ⛔ **Tie-break-first would let a terminal board win selection.** That is the Sprint 5 failure — a
  finished board reported as active — reintroduced through the side door, in the one ADR that exists
  to close it.

⛔ **What does NOT change: `drift ambiguous-active-sprint` still fires on ANY same-identity collision
among the candidates, mixed status included.** Status decides **which board is chosen**; it does **not**
decide whether the collision is reported. Two boards both claiming `Sprint 6` at the top of `sprints/`
is worth saying out loud whatever their banners read — and a `Done`-bannered board sitting at depth 1
additionally trips `sprint-terminal-not-archived` (§7). ⭐ **So §1.5's DRIFT is genuinely untouched;
only its SELECTION is subordinated to the filter.** §8.2 records that split precisely, and **P12**
pins it.

### 7. Drift rules for sprints

⚠️ **The third column was added 2026-09-10 under owner ruling W1 (reviews R6 and R7).** ⛔ Without it
three of these facts had **no assigned emitter**, and one of them was assigned to a mode that
structurally cannot produce it.

⚠️ **The emitter column was corrected again 2026-09-10 under owner ruling X1 (review R19): the word
*"sweep"* is GONE from every row.** ⛔ It named a mode that **does not exist** — measured
2026-09-10, `claude/skills/fkit-status/dashboard.sh:218` declares
`usage: bash dashboard.sh <plan> | identity <plan> | select-active <sprints-dir>`, the dispatch at
`:305-309` recognises only those two subcommands, and `grep -n sweep` over the file returns **nothing**.
An alternation between a real path and an imaginary one is not an assignment. ⭐ **The three archival
drifts belong to the per-board RENDER PATH, full stop** — each is decidable from the rendered board's
**own** banner and its **own** containing directory, which the render path holds by construction, so no
sweep is needed and none is invented. ⛔ `0338` must not add a sweep mode on the strength of this ADR.

| Fact | Fires when | ⛔ Emitted by |
|---|---|---|
| `drift sprint-status-missing` | eligible identity, **no** line-3 banner | **both** — `select-active` (every candidate) **and** the render path (the board it renders) |
| `drift sprint-status-malformed` | line 3 begins `> ## ` and carries one of the five markers but does **not** match §2's recognizer — a missing or non-`YYYY-MM-DD` date, or trailing text where the terminating `.` belongs | **both** — as above |
| `drift active-marker-on-non-active` | `⭐ ACTIVE BOARD` on a banner that is not `In progress` | **both** — as above |
| `drift sprint-terminal-not-archived` | status `Done`/`Cancelled` but the board still sits at the top of `sprints/` | ⛔ **render path only** — never `select-active` |
| `drift sprint-archived-not-terminal` | board under `done/`/`cancelled/` with no terminal status **and** no legacy banner | ⛔ **render path only** — never `select-active` |
| `drift sprint-status-location-mismatch` | `Done` under `cancelled/`, or `Cancelled` under `done/` | ⛔ **render path only** — never `select-active` |
| `drift ambiguous-active-marker` | more than one board carries the marker → **fall back to lowest-ordered and name every claimant** | ⛔ **`select-active` only** — ⚠️ **the one fact with no render-path route; §7.2 names the cost** |
| `drift ambiguous-active-sprint` | **unchanged** — ADR-041 §1.5. ⛔ Fires on **any** same-identity collision among candidates, **mixed status included** (§6.4) | ⛔ **`select-active` only.** Its render-path counterpart is the **separately-named** row below |
| `drift ambiguous-plan-identity` | ⭐ **Pre-existing, and listed here for the first time** (added 2026-09-10 under owner ruling X1, review R16). The **render path's** counterpart to the row above: the board being rendered shares its eligible identity with a sibling | ⛔ **render path only** (`claude/skills/fkit-status/dashboard.sh:1175`) |

⛔ **The last two rows are TWO NAMES FOR ONE CONDITION, and that is DELIBERATE — not a defect to
merge.** ⭐ *Architect's call under X1.* The distinction is already ruled by the code's own comment at
`claude/skills/fkit-status/dashboard.sh:1173-1174`: *"`plan=`, NOT `chosen=` — board mode renders
whatever path it was handed and must not imply it did the choosing. `select-active` is what chooses,
and its record says `chosen=`."* The two records carry **different field sets** because they state
**different facts**: one reports a choice that was made, the other reports a collision on a board
nobody chose. ⛔ **`0338` must not collapse them into one name**, and this ADR's own §7 table was
simply **incomplete** in listing only the `select-active` half.

#### ⛔ 7.1 — Two carve-outs, stated as HARD RULES and not as notes

1. ⛔ **`sprint-status-missing` must NOT fire for a `Backlog` or `unresolved` identity.**
   `ai-agents/sprints/backlog.md` has **plain prose at line 3** and will never carry a banner. Without
   this carve-out it emits a false drift record **on every single run, forever** — which is precisely
   the failure `resolve_identity` already carries a long warning about
   (`claude/skills/fkit-status/dashboard.sh:149-152`: *"a permanent false drift record on a board that
   is perfectly well-formed"*). ⭐ **Same trap, same board, second entrance.**
   ⚠️ **Read this carve-out in IDENTITY-space** — see §1.2. It names the `Backlog`/`unresolved`
   **identity**, never the `unresolved` **status**. The status reading would swallow the drift
   entirely.
   ⛔ **Scope, settled 2026-09-10 under owner ruling X1 (review R24): this carve-out covers
   `sprint-status-missing` and NOTHING ELSE.** `sprint-status-malformed` is **not** carved out for any
   identity — §2 states the reason.
2. ⛔ **`select-active` is depth-1 and structurally cannot see `done/`.** ⚠️ **THREE** drifts are
   therefore **not its to emit**, not two — corrected 2026-09-10 under owner ruling W1 (review R6):
   `sprint-terminal-not-archived`, `sprint-archived-not-terminal`, **and
   `sprint-status-location-mismatch`**, whose *"`Done` under `cancelled/`, or `Cancelled` under
   `done/`"* condition requires reading **inside** both archive folders — precisely what this
   carve-out says the mode cannot do. All three belong to the **per-board render path** — ⚠️ *"or to
   an explicit sweep"* was struck 2026-09-10 under owner ruling X1 (review R19); **no sweep mode
   exists and none is created here.** ⭐ This ADR assigns them to the render path rather than
   specifying a fact the chosen mode cannot produce. ⛔ **`0338` must not implement any of the three in
   `select-active`, and must not drop them silently either.**

#### ⛔ 7.2 — How a drift reaches BEAT 6. **The rule is per-MODE, and `select-active` gets no roll-up.**

⚠️ **Added 2026-09-10 under owner ruling X1 (review R16). This clause replaces the sentence
*"Every drift kind above must reach the roll-up's drift clause"*, which was WRONG and is
withdrawn.** ⛔ **The withdrawn sentence made `0338` unwritable.** It assigned five drifts to
`select-active` and then demanded each reach a roll-up — but the roll-up is built **only** in the
one-argument board render (`claude/skills/fkit-status/dashboard.sh:1136-1205`, its `drift_clause` at
`:1185-1196`), and the file's own contract comment says so at `:30`: *"the roll-up exists only in this
board render, so the check has to live here."* `mode_select_active` prints `⟦FACTS⟧`, then `⟦END⟧`,
then exits (`:292-297`); the two paths share no state. ⭐ **Today's code is the proof:** `select-active`
already emits `drift ambiguous-active-sprint` at `:292` and it reaches **no** roll-up — and the design
is not broken, because a roll-up was never how that record reaches the owner.

⭐ **THE CORRECTED OBLIGATION, and it is stated in terms of the CONSUMER rather than the mechanism:**

> ⛔ **Every drift fact must reach BEAT 6.** *How* it gets there is fixed **per mode**, and the roll-up
> is only one of the two routes.

| Route | Which mode | What "reach" means | Why |
|---|---|---|---|
| **⟦FACTS⟧ only** | `select-active` | the `drift` record appears in the `⟦FACTS⟧` block | ⭐ That block **is** `select-active`'s complete output, and the skill's own argument contract already reads a drift record straight out of it — `claude/skills/fkit-status/SKILL.md:44` documents `drift ambiguous-active-sprint …` as a `select-active` record with no roll-up in the path. Nothing is lost, because there is no summary line a reader could read *instead* of the facts |
| **⟦FACTS⟧ *and* the roll-up's drift clause** | the board render | the record appears in `⟦FACTS⟧` **and** sets the roll-up's drift clause | ⛔ Here a roll-up **does** exist and a reader may read it instead of the table. ADR-041 §1.5's rule is unchanged and applies **here**, where it was always aimed |

⛔ **This does NOT supersede any further part of ADR-041 — checked, and the check is the point.** ⭐
**ADR-041 §1.5's reach rule was ALWAYS render-path-scoped by its own text:** it requires the record
*"set `plan_level_drift` so it reaches the roll-up's drift clause by the same route
`unresolved-plan-sprint` takes"* — and `plan_level_drift` exists **only** in the board render
(`claude/skills/fkit-status/dashboard.sh:1186-1189`). ⚠️ **It was ADR-047's own §7 foot that
generalized a render-path rule to every mode, not ADR-041.** ⭐ ADR-041 §1.5's next bullet even rules
this ADR's dual-emission answer in: *"Whether the record originates in a `dashboard.sh` selection mode
or is passed to it is the implementer's call. That the selector cannot choose not to mention it is
not."* ⛔ **§8.2's supersession list is therefore unchanged, and ADR-041 needs no further append.**

- ⛔ **`select-active` does NOT gain a roll-up.** ⭐ *Architect's call under X1, with its reason:* a
  roll-up is a **narrative summary of a board's rows**. `select-active` has no rows and renders no
  board; giving it a summary line would put a second rendering inside a mode whose whole contract is a
  machine-read fact stream, and no consumer asked for one. ⛔ **Rejected by name.**
- ⛔ **The two drift names are NOT merged.** ⭐ *Rejected by name*, for the reason in §7's table foot:
  `chosen=` and `plan=` state different facts.
- ⭐ **The per-board drifts are emitted from BOTH modes, and that is the repo's own worked precedent,
  not a new idea.** The ambiguity check already lives in both paths **for exactly this reason** — the
  in-file comment at `:1159-1161` records it: *"Detected HERE, in board mode, rather than passed in by
  the caller … Self-contained, so one invocation surfaces it."* ⛔ **Duplicate detection is the
  design, not duplication to be factored out.**
- ⚠️ **The one fact with NO render-path route, named rather than hidden:** `ambiguous-active-marker`
  — the only row in §7's table assigned to one mode with no counterpart in the other. It requires
  reading **line 3** of every sibling board, and the render path reads
  sibling **first lines** only — widening that contract a second time is a bigger decision than this
  finding, and this ADR does **not** take it. ⛔ **Its reach obligation is therefore `⟦FACTS⟧`-only,
  and the cost is stated: an ambiguous active marker is visible to any consumer of `select-active`
  (the status skill and the ship-loop, both of which read that block) but never lands in a per-board
  roll-up.** ⭐ Re-raise trigger in §Re-raise only if.

⛔ **Reach is a TESTED property, not a stated one** (W1, review R7 — unchanged): **P3, P7, P11, P12,
P13, P15 and P16 each assert both that the fact is emitted AND that it reaches beat 6 *by its mode's
route above*** — ⭐ one per drift kind in §7's table, with none left untested. A fact that fires into a
void is a fact the owner never sees.

---

### 8. Migration, and exactly what ADR-041 loses

#### 8.1 — What this repo needs (measured 2026-09-10; the backfill is a separate task)

- **`ai-agents/sprints/sprint-8.md`** gains **one banner line at line 3** plus a `>` spacer, pushing its
  Authority blockquote down. ⭐ The grammar is backfillable **by insertion, with no rewrite** — which is
  what the owner's *"open with no banner, the backfill task adds it"* position requires.
- **`ai-agents/sprints/done/sprint-1.md` … `sprint-7.md`** — ⛔ **NO CHANGE.** Owner ruling **V3**:
  `🔒 CLOSED` is a permanent compat rung, and this repo's rule for frozen records is **annotate, never
  rewrite**.
- **`ai-agents/sprints/backlog.md`** — no change, and §7 carve-out 1 keeps it quiet.
- **The README line** *"Completed sprints move to `sprints/done/`"* and its scaffold copy are now
  **incomplete** and need the cancelled folder added.
- ⛔ **`ai-agents/sprints/cancelled/` is NOT created by this migration.**

⚠️ **Consequence of V3 the owner accepted explicitly:** the backfill task's title says *"backfill onto
EVERY existing sprint plan"*, and after V3 that is **wrong** — seven of the eight boards are not
touched. ⭐ **Correcting that title is the PRODUCER's act, not this ADR's.**

#### 8.2 — ADR-041, superseded in part

⭐ **Falsified by this ADR:**

- ⛔ **§Decision itself** — added 2026-09-10 under owner ruling W1 (review R12), because §Related sends
  readers here for *"the exact scope"* and the headline sentence was missing from both lists. ADR-041's
  `## Decision` reads *"**The active sprint is the plan whose resolved identity is the highest-ordered
  `Sprint <N><suffix>` among the `.md` files at the top of `ai-agents/sprints/`**"* — ⛔ **falsified
  TWICE OVER: in direction** (`highest` → lowest) **and in singularity** (*"The active sprint"* → every
  `In progress` sprint). ⭐ Its remaining half — *"Selection stops being a filename glob"* — is **in
  force and is the foundation this ADR builds on.**
- **§1.3** — eligibility gains a **status** rung on top of the identity rung.
- **§1.4's DIRECTION only** — *"highest-ordered"* becomes **lowest-ordered**. Its
  integer-then-suffix comparator **survives whole** (§6.1 pins it).
- **§1.5's SELECTION ORDER, not its rule** — added 2026-09-10 under owner ruling W1 (review R3). ⛔ The
  first draft of this list called §1.5 wholly untouched; that **cannot hold**, because §5's status
  filter changes the set §1.5 sorts. **§6.4 is the precedence rule.** The split, exactly:
  ⭐ **untouched — §1.5's tie-break RULE** (byte order under `LC_ALL=C`, first wins, `also=` naming
  every claimant) **and its DRIFT** (`ambiguous-active-sprint`, which still fires on any same-identity
  collision, mixed status included); ⛔ **changed — the SET it runs on**, which is now filtered to
  `In progress` before §1.5 ever sees it.
- **§1.6** — the empty-set report grows a **status** column.
- **§Consequences, the bullet *"Residual — 'highest N' is a RETAINED HEURISTIC WITH A NAMED EXIT"*** —
  ⭐ **the exit is now taken.**
- **§Required tests S1, S1b, S2, S3, S5, S6, S7, S8** — repinned by the implementing task (§2.4).

⭐ **In force and untouched:** §1.1 (candidate set), §1.2 (identity ladder), §1.5's tie-break rule and
its drift record **(read with the bullet above: the rule survives, the set it runs on is filtered)**,
§2 (the `Backlog` H1 token and its normalization), §3 (`backlog.md` keeps its name), §4 (no filename
enforcement point), §5 (one grammar, one implementation).

⭐ **The re-raise is in-bounds and this ADR quotes its own trigger** — see §Context. ADR-041 named
option (d) as the exit and said *"re-raising it needs the triggering case, not a fresh argument"*. The
triggering case is the owner's 2026-08-25 report, quoted verbatim at the top of this file.

---

### 9. ⛔ The wire protocol version marker BUMPS TO `⟦fkit-dashboard v2⟧` (W2, owner-ruled)

⚠️ **Added 2026-09-10 (review R9). The whole of this section is the owner's ruling W2**, taken live via
`AskUserQuestion`; the verbatim option label is in *§Authority, Round 3*.

**The ruling:** ⛔ **`VERSION_MARKER` becomes `⟦fkit-dashboard v2⟧`** as part of the change that alters
the `select-active` shape.

⭐ **The owner's basis, recorded:** the marker's **declared purpose** is that a consumer reading an
unknown shape **refuses rather than guesses** — `claude/skills/fkit-status/SKILL.md:229`: *"If the
version marker is not `⟦fkit-dashboard v1⟧`, say so rather than guessing at the shape."* ⛔ **Keeping
`v1` across a breaking change defeats the one mitigation the design named.** §2.3 turns the shape over
completely — `status=` on every record line, `active` becomes plural, a `board` line appears, and a
`status <plan>` mode is added — so a `v1`-marked stream would carry a shape no `v1` consumer can parse,
with nothing to tell it so.

#### ⛔ 9.1 — What the bump obliges. **`0338` performs all of this; this ADR performs NONE of it.**

| Site | Change |
|---|---|
| `claude/skills/fkit-status/dashboard.sh:53` — `VERSION_MARKER='⟦fkit-dashboard v1⟧'` | the **single definition**; set it to `v2` |
| `test/dashboard-contract.test.js` — **five** `v1` assertions | repinned to `v2`. ⛔ Cited **by test name, never by line**, for §2.4's reason: `'clean sprint: board renders; roll-up prints only non-zero terms'`, `'R10: exact stdout — the full contract, pinned byte for byte'`, `'R50/R53: exact stdout on the LOUD path — the fact is pinned in full'`, `'ADR-041: the historic one-argument board render is unchanged; a bad subcommand is a usage error'`, `'ADR-041 0271/5b: a plan file named identity.md still renders as a board, not a mode word'` |
| `claude/skills/fkit-status/SKILL.md` — **three** sites | `:53` (the `select-active` contract's *"the version marker is not `⟦fkit-dashboard v1⟧`"*), `:223` (the fenced stdout example), `:229` (the parse contract sentence). ⛔ **All three, or the skill tells the model to refuse the very stream the script now emits.** |

#### ⚠️ 9.2 — Two consequences of the bump that are easy to miss

1. ⛔ **The marker is emitted by BOTH envelope-printing modes, not just `select-active`.** One
   definition at `claude/skills/fkit-status/dashboard.sh:53`, **exactly two** emit sites — `:269` (the
   `⟦SELECT⟧` envelope) and `:1199` (the `⟦BOARD⟧` envelope). ⭐ **So the board render's output changes
   too, even though its shape does not.** Three of the five test assertions above are on the **render**
   path for exactly this reason. **A bump scoped to `select-active` alone is not implementable** —
   there is nothing to scope it to.
   ⚠️ **This bullet first read *"emitted by EVERY mode"*. That was FALSE, was contradicted by its own
   next clause, and is withdrawn — corrected 2026-09-10 under owner ruling X1 (review R20).** ⛔ It was
   a **regression risk, not a wording slip**: `mode_identity` emits **no** marker *by design*
   (`:223-225` — *"⚠️ NO `⟦…⟧` MARKERS, deliberately. This emits a VALUE, not a rendering, so a caller
   reads it with a single command substitution"*), and §2.3a gives the **new `status <plan>` mode the
   same contract.** A builder obeying *"EVERY mode"* literally would have made every
   `$(dashboard.sh identity …)` and `$(dashboard.sh status …)` return **two lines** instead of a value.
   ⭐ **The bullet's actual point — that the render path bumps too — was and is correct.**
2. ⚠️ **This is the marker's first bump.** There is no `v1`-compat reader anywhere in the tree and none
   is being written: the marker's contract is *refuse*, not *translate*. ⛔ **`0338` must not invent a
   dual-version parser** — the whole tree moves to `v2` in one change, which is why `dashboard.sh`, the
   SKILL prose and the tests are named together above.

---

## Required tests — the decision is not satisfied without these

Additional to ADR-040's and ADR-041's inherited sets (with the eight named in §2.4 **repinned**, not
merely inherited).

| ID | Fixture | Assertion |
|---|---|---|
| **P1** | `sprints/` with `sprint-8.md` and `sprint-9.md`, **both** banner `🔄 In progress` | **TWO** `active` lines, ascending; **exactly one** `board` line naming `sprint-8.md` with `reason="lowest-ordered"`; ⛔ **zero drift facts.** Pins §6.3 row 1 — plural-current is legal |
| **P2** | `sprints/` with a board whose line 3 is `> ## 🔒 CLOSED — 2026-08-13.` plus one `In progress` board | the `🔒 CLOSED` board is **never** active and **never** the `board` line; its `candidate` line reads `status="Done"`. Pins the OQ-3 rule **and** V3's permanent compat rung |
| **P3** | `sprints/` with an eligible-identity board carrying **no** line-3 banner | **never** active; `candidate … status="unresolved"`; `drift sprint-status-missing` emitted. ⛔ **Reach is asserted TWICE, per §7.2:** in `select-active` the record appears in `⟦FACTS⟧` (**no roll-up — the mode has none**); rendering the same board emits it **and** sets the roll-up's drift clause. Pins §2, §7 and §7.2 |
| **P4** | `sprints/` holding **only** `backlog.md` (prose at line 3) | ⭐ **ZERO drift facts** — `sprint-status-missing` must **not** fire. `active none`, exit 3, `candidate file="backlog.md" identity="Backlog" status="unresolved"`. Pins §7 carve-out 1, the false-drift trap |
| **P5** | `sprints/` with `sprint-4.md`, `sprint-9.md`, `sprint-10.md`, all `In progress` | the `board` line names **`sprint-4.md`** — the **lowest**. Pins §6 and, with the integer comparator unchanged, proves `10` did not sort below `9` |
| **P6** | P5's fixture with `⭐ ACTIVE BOARD` in `sprint-9.md`'s banner | `board … file="sprint-9.md" reason="active-marker"`; all three `active` lines still printed. Pins §2.1 + OQ-1's override half |
| **P7** | Two boards **both** carrying `⭐ ACTIVE BOARD` | `drift ambiguous-active-marker` naming **every** claimant, **and** the `board` line falls back to lowest-ordered, **and** the drift appears in `select-active`'s `⟦FACTS⟧`. ⚠️ Assert **all three** — the fallback is worthless if the flag can be dropped, and the flag is worthless if it never reaches beat 6. ⛔ **Do NOT assert a roll-up here** — corrected 2026-09-10 under owner ruling X1 (review R16): this is §7.2's one `⟦FACTS⟧`-only fact, with **no render-path route at all**, and the W1 roll-up clause made this test unwritable |
| **P8** | `sprints/` where every board is `🔲 Backlog` / `✅ Done` / `Backlog`-identity | `active none`, **exit 3**, and **every** `candidate` line present **with its `status=`**. Pins §2.3's empty case and §5 |
| **P9** | One board per banner form — `🔲 Backlog`, `🔄 In progress`, `✅ Done`, `⛔ Cancelled`, `🔒 CLOSED` — run through `status <plan>` | each parses to its status token, `🔒 CLOSED` → **`Done`**; exit 0. A board with no banner → exit **3**. Pins §2's recognizer and §2.3's new mode |
| **P10** | A board with a **second** `> ## 🔄 In progress` line further down the file | **only line 3** is read; the second line is **not** a status and does not make the board ambiguous. Pins §2's strict-position rule |
| **P11** | `sprint-8.md` with `> ## ✅ Done — …` at line 3 while still at the **top** of `sprints/` | `drift sprint-terminal-not-archived`, emitted from the **render path**, ⛔ **not** from `select-active`, **and** setting the roll-up's drift clause. ⭐ **Unchanged by the second amendment** — a render-path fact is exactly where §7.2 keeps the roll-up requirement. Pins §7 carve-out 2's assignment |

⚠️ **P12–P17 were added 2026-09-10 under owner ruling W1**, each closing a named review finding. ⛔ They
are not optional extras: **four of them pin rules the ADR previously stated with no test behind them,
and P14 pins a rule whose only prior backstop is on this ADR's own repin list.**

| ID | Fixture | Assertion |
|---|---|---|
| **P12** | ⭐ *(review R3)* `sprints/` with `plan-sprint-6.md` banner `✅ Done` and `sprint-6.md` banner `🔄 In progress` — **same identity, mixed status**, both at depth 1 | **`active` and `board` both name `sprint-6.md`** — ⛔ **never** the `Done` board, whatever the byte order says. **AND** `drift ambiguous-active-sprint` is still emitted from `select-active`, naming **both** claimants, in its `⟦FACTS⟧` block — ⛔ **not into a roll-up** (X1, review R16). **AND** rendering `sprint-6.md` emits the render path's separately-named `drift ambiguous-plan-identity` (§7's last row) **and** sets the roll-up's drift clause. **AND** `drift sprint-terminal-not-archived` fires for `plan-sprint-6.md`. Pins §6.4's filter-first rule **and** §8.2's rule-survives/set-changes split |
| **P13** | ⭐ *(reviews R6, R7)* a board under `done/` with **no** terminal status and **no** legacy banner; and a `⛔ Cancelled`-bannered board under `done/` | `drift sprint-archived-not-terminal` and `drift sprint-status-location-mismatch` respectively, **each emitted from the render path** — ⚠️ *"/ sweep"* struck 2026-09-10 under owner ruling X1 (review R19); **no sweep mode exists** — ⛔ **never from `select-active`**, and **each setting the roll-up's drift clause**. Pins §7's emitter column and carve-out 2's corrected three-drift list |
| **P14** | ⛔ *(review R5 — the silent-regression guard)* `sprints/` with `plan-sprint-6.md` **and** `sprint-6.md`, **both** banner `🔄 In progress` — one identity, two files, no other candidate | the chosen `board` (and the single `active` entry's file) is **`plan-sprint-6.md`** — **first in byte order under `LC_ALL=C`**, per ADR-041 §1.5. ⛔ **This test FAILS under the naive `! identity_gt "$_i" "$_best_id"` negation and PASSES under the `identity_gt "$_best_id" "$_i"` argument swap.** Pins §6.1's mechanical change — ⭐ **the tie-break's direction is the thing a repin loses quietly** |
| **P15** | ⭐ *(review R7)* a `🔲 Backlog` board and a `✅ Done` board, **each** carrying `⭐ ACTIVE BOARD` in its banner's trailing prose | `drift active-marker-on-non-active` for **each**; ⛔ neither board becomes `active` or the `board` line. ⛔ **Reach asserted per §7.2, both routes:** in `select-active`'s `⟦FACTS⟧` (**no roll-up**), and — rendering either board by name — in `⟦FACTS⟧` **plus** the roll-up's drift clause. Pins §7's row that previously had no test |
| **P16** | ⛔ *(review R4)* four boards with eligible identities and line 3 = `> ## 🔄 In progress` (no date) · `> ## 🔄 In progress arbitrary trailing garbage` · `> ## ✅ Done — not-a-date.` · `> ## ✅ Done — 2026-09-10` (no terminating `.`) | **each** resolves `status="unresolved"`, is **never** eligible, and emits `drift sprint-status-malformed` — ⛔ **not** `sprint-status-missing`; the two must be **distinguishable**, and each must reach beat 6 **by §7.2's per-mode route** — `⟦FACTS⟧` in `select-active` (**no roll-up**), `⟦FACTS⟧` **plus** the roll-up's drift clause when the board is rendered. ⛔ **AND a `Backlog`-identity board carrying a malformed banner DOES emit `sprint-status-malformed`** — the carve-out is `sprint-status-missing`-only (§2, §7.1; X1, review R24). **AND** all seven real `🔒 CLOSED` banners from `sprints/done/` still parse to `Done`. Pins §2's tightened recognizer |
| **P17** | ⭐ *(reviews R1, R14)* the two `⟦SELECT⟧` blocks of §2.3, **byte for byte** — a two-active fixture and a zero-active fixture | **exact stdout equality**, not a substring match, **including the closing `⟦END⟧`** — ⚠️ **added 2026-09-10 under owner ruling X1 (review R21): §2.3's blocks were envelope-incomplete while this test made them normative, so the test as first written could only red.** The `board` line carries `status=` **and** `reason=`; `active none` carries **no fields at all**; separators are **one space**; field order matches §2.3a. ⛔ **The helper must not be `find(l => l.startsWith('active'))`** — §2.4's warning — or the plural case passes while returning one line |

## Options considered

- **(a) Explicit four-value status carried by a line-3 banner, plural-current, lowest-ordered single
  board — CHOSEN, owner-ruled across SD-1/SD-2/SD-3/OQ-1/OQ-3 and the OQ-2 reframe.** It answers the
  owner's report directly, mirrors a lifecycle the project already runs for tasks, and — critically —
  makes "which sprint is current" a **fact the board states** rather than a heuristic the tool infers.
- **(b) Keep one active sprint, just flip the ordering to lowest — rejected.** It is the smallest
  change and it fixes the reported symptom. ⛔ **It does not survive the owner's own OQ-2 answer**,
  which asked for statuses and for *"ALL the currently active sprints"* to be reported. It also leaves
  a finished-but-unarchived board active — the exact Sprint 5 failure — because location remains the
  only signal.
- **(c) A separate index or config file naming the active board — rejected.** ADR-041 rejected the same
  shape *"against this project's zero-config posture"*, and it stays rejected: a second file is a
  second thing to keep true, and a board that does not say its own status can be archived while an
  index still claims it. ⭐ **The marker in §2.1 buys option (d)'s explicitness without the second
  file.**
- **(d) A transitional grace period — treat a board with no banner as `In progress` until the backfill
  lands — rejected BY THE OWNER, by name (V1).** ⛔ It re-introduces the **exact silent default this
  ADR exists to ban**. A missing status would resolve to a guess, which is the failure mode of the
  system being replaced.
- **(e) Ship the ADR's consumers as one change — rejected by the owner (V1)**, in favour of
  re-ordering the board so the backfill precedes the selector change. See §Consequences.
- **(f) Rewrite the seven `🔒 CLOSED` banners to `✅ Done` — rejected by the owner (V3).** Sprints 5–7
  are frozen records and this repo's standing rule is **annotate, never rewrite**. The cost of keeping
  them is one permanent alternative in a regex; the cost of rewriting them is editing history.

## Consequences

- **Positive.** *"Current sprint"* stops being a heuristic and becomes a **stated fact** with a single
  reader. A finished board is ineligible **the moment its banner is stamped**, not when someone
  remembers to move it — closing the Sprint 5 failure at its source. Two parallel sprints become a
  **supported arrangement** instead of an ambiguity. And every terminal transition gains the same
  identity separation ADR-033 gave task closes.
- ⛔ **Negative — an ordering constraint on the implementing work, owner-ruled (V1).** The selector
  change makes a board with no banner **ineligible**. If it lands before the boards carry banners, the
  ship-loop's own `select-active` returns `active none` **mid-sprint** and the loop cannot find the
  board it is running on. ⭐ **The backfill task (`0340`) must therefore precede the selector task
  (`0338`).** ⭐ **A producer applies that re-ordering separately; this ADR does not touch any sprint
  board.**
- **Negative — a repin, not a tweak.** Eight named scenarios in `test/dashboard-contract.test.js`
  assert the active line by exact string equality and build every fixture without a banner (§2.4).
  All eight must be rewritten, and one helper (`activeLine`) must stop silently swallowing plural
  output.
- **Negative — one word, two meanings.** `Backlog` is now both an identity and a status (§1.1). The
  by-position rule contains it; it does not erase it. ⚠️ **Recorded as an accepted cost with the
  architect's objection on the record, because the owner overruled the alternative.**
- **Negative — prose ripple.** The status skill's argument contract (*"the **active sprint**"*,
  singular), the ship-loop's two *"the active `sprint-*.md`"* sites, the producer agent's *"find the
  active one"*, the `ai-agents/README.md` line and its scaffold copy all state the old, singular,
  highest-`N` model. ⭐ **Filing those repairs is the producer's, not this ADR's.**
- **Negative — a guard exemption that must ship with the folder (V4, §3.1).** Creating
  `ai-agents/sprints/cancelled/` without the matching exemption entry reds `npm test` for whoever
  cancels the first sprint.
- ⛔ **Negative — a PROTOCOL break, not only a prose ripple (W2, §9).** The version marker goes to
  `⟦fkit-dashboard v2⟧`, which touches the **board render path too** because one definition feeds both
  envelopes. Three files move together or the skill refuses the stream its own script emits:
  `dashboard.sh:53`, five assertions in `test/dashboard-contract.test.js`, and three `v1` sites in
  `fkit-status/SKILL.md`. ⭐ **The first draft of this ADR named the prose ripple and missed the
  protocol entirely** — recorded here so the omission is not repeated for the next shape change.
- ⚠️ **Negative — the sprint movers do NOT mirror the task movers' step order (§4).** They repoint
  before `git mv`; the task movers do the reverse. `0341` is inverting a precedent, deliberately, and
  must be told so — the ADR's original claim that it was *"the order the task movers already do it"*
  was false and is withdrawn.
- ⭐ **Positive — five decisions moved OUT of the consuming tasks and into this ADR** (owner ruling W1,
  2026-09-10): the `board` line's field set (§2.3a), `/fkit-sprint-done`'s row policy (§3.0), the
  mixed-status precedence rule (§6.4), the tightened recognizer (§2), and the protocol bump (§9). ⛔ Each
  was a place where `0338` or `0341` would have had to **invent a design ruling inside an
  implementation task** — and `0338` and `0341` would have invented them **separately**, putting one
  ruling in two places. ⚠️ **The cost is that this ADR is longer and was amended after acceptance;**
  the amendment is dated and attributed at every site rather than folded in silently.
- ⛔ **Negative — a drift kind is scoped to a MODE, and two modes may name one condition differently
  (§7, §7.2).** Added 2026-09-10 under owner ruling X1 (review R16). The first amendment required every
  drift to *"reach the roll-up"*; **`select-active` has no roll-up**, which made P3/P7/P12/P15/P16
  unwritable and `0338` unstartable. §7.2 restates the obligation as **reach beat 6, by the route the
  mode has**. ⚠️ **The cost is named:** `0338`'s reader must hold a **mode-scoped** drift namespace —
  `ambiguous-active-sprint` (chooser) and `ambiguous-plan-identity` (renderer) are one condition under
  two names, deliberately, and `ambiguous-active-marker` has **no render-path route at all**. ⭐ **The
  alternative — one flat drift namespace — was rejected**: it would have merged two records with
  different field sets and different claims, against the code's own comment ruling them apart.
- ⚠️ **Negative — this ADR was amended TWICE after acceptance, and the first amendment introduced
  defects of its own.** Round 2 found eleven findings, of which **R16 (the roll-up), R19 (the
  non-existent sweep mode), R21 (P17's envelope-incomplete fixture) and R17/R18 (§3.0's href and its
  three undefined inputs) were all created or left open by the round-1 amendment.** ⭐ **Recorded, not
  softened:** amending an accepted ADR under time pressure is how a design ruling acquires new gaps,
  and the mitigation used here is the same one W1 chose — **every amendment dated and attributed at its
  own site**, so a reader can see what moved and when.

#### ⭐ Accepted residual — the seven `drift` record FIELD SETS are the implementer's (X2, owner-ruled)

⚠️ **Owner ruling X2, 2026-09-10, verbatim label: "Record as accepted residual (Rec)".** ⛔ Taken
against defining the field sets here, and recorded in full rather than as a note.

- ⛔ **What.** §2.3a's normative table fixes the field set, field order and cardinality for `active`,
  `active none`, `board` and `candidate` — and **for no `drift` line at all.** §7 names **nine** drift
  kinds, and ⭐ **two of them already have a shape, which is why this residual covers seven:**
  `ambiguous-active-sprint`'s is inherited from ADR-041 §1.5, and `ambiguous-plan-identity`'s is **live
  pre-existing code** — `drift ambiguous-plan-identity identity="…" plan="…" also="…"` at
  `claude/skills/fkit-status/dashboard.sh:1175`. ⛔ **That second one is NOT `0338`'s to reshape:**
  §7's table foot rests on its field set staying put — *"The two records carry **different field
  sets** because they state **different facts**"*. ⛔ **This ADR does not define the remaining seven,
  and does not define a general `drift` record shape either.** `0338` chooses **those seven's** fields.
  ⚠️ **Corrected 2026-09-11 under owner ruling Y2 (review round 3, R29).** This clause read *"only
  `ambiguous-active-sprint` has a shape anywhere"* — which implies **eight** undefined kinds and
  contradicted both this residual's own heading and X2's Authority row, each of which says **seven**,
  as well as §7's own ninth row added in the same amendment. ⭐ **The count of seven was right; the
  clause was wrong, and only the clause moved. X2's decision is not re-argued.**
- ⭐ **Why — and the reason is structural, not scheduling.** ADR-041 set this precedent **explicitly**
  for exactly this kind of record: its §1.5 gives the ambiguity record's shape as a *"Suggested shape,
  wording is the implementer's"*. ⛔ **A drift record is a diagnostic, not an interface.** Its consumer
  is `fkit-status/SKILL.md`, which renders each record into English in beat 6 — it does not compute on
  the fields. ⭐ **The two properties that actually matter are already pinned here, and they are the
  ones a wrong choice would break:** §2.3a's ⛔ *"Consumers parse by KEY, never by position"* holds for
  every line including `drift`, and §7's **kind names** are fixed by this ADR and are what the tests
  assert. **Fixing the field names would pin prose; fixing the kind names pins the contract.** ⚠️ The
  cost, stated: `0338` is the only place these get defined, so a field set chosen carelessly there is
  the one that ships — the mitigation is that P3/P7/P12/P13/P15/P16 each assert the **kind** and its
  reach, so a record cannot go missing, only be shaped awkwardly.
- ⭐ **Re-raise only if** a **second consumer** starts reading `drift` records **by field** — a parser,
  a guard, or a second skill — rather than rendering them into prose. Then the field sets stop being
  wording and become an interface, and they belong in §2.3a alongside the other four line kinds.
  ⛔ *"The ADR should have specified them for completeness"* is **closeout**: ADR-041 ruled the opposite
  for this exact record class, and the owner accepted this residual on 2026-09-10 with the gap in front
  of them.

- **Residual — atomicity is by invocation, not by filesystem (§4).** An interrupted mover leaves a
  half-moved board. This is **detected** by §7's location-mismatch drifts and **never prevented** —
  the same "documented and detected, never prevented" posture ADR-041 §4 records for identity.
- **Residual — the agent-closed marker's limit is inherited whole.** ADR-033's *"§The limit"* applies
  unchanged: producer-only restores separation of the **closing identity**, not prevention. A
  determined doer can still spawn a producer to close a sprint. ⛔ **Accepted and named; not a defect
  to file.**

## Authority — what was ruled, by whom, when

This ADR is **accepted**. **Nothing is left open for the owner.** **Four** live `AskUserQuestion`
rounds; option labels **verbatim**.

### Round 1 — 2026-08-25, live `AskUserQuestion`, relayed by the lead

| # | Question | Ruled by | Ruling (verbatim label) | Effect |
|---|---|---|---|---|
| **OQ-1** | Where one board must be chosen, which one? | **the owner** | **"Default lowest + marker override (Recommended)"** | The whole of **§6**, and §2.1's marker |
| **OQ-3** | A finished-but-unarchived board — ineligible? | **the owner** | **"Yes — banner makes it ineligible (Recommended)"** | **§5**, and test **P2** |
| **OQ-2** | Same-`N` suffix order | **the owner — no option picked; the answer REFRAMED the task** | *"I think we need to change the way we work with sprints: we need to add the statuses to the sprints, similarly to the way we work with tasks: backlog, in progress, done, cancelled. If we do it that way, when we ask abut the status of the sprint, actually ALL the currently active sprints should be reported about."* | **The entire ADR.** §1's vocabulary and §5's "report all" both come from this answer |
| **SD-1** | Where a sprint's status lives | **the owner** | **"Line-3 banner (Recommended)"** | **§2** |
| **SD-2** | Cancelled sprints | **the owner** | **"`sprints/cancelled/` (Recommended)"** | **§3** |
| **SD-3** | How a sprint closes | **the owner** | **"Mover skills, producer-only (Recommended)"** | **§4** |

### Round 2 — 2026-09-10, live `AskUserQuestion` at this task's plan gate

| # | Question | Ruled by | Ruling (verbatim label) | Effect |
|---|---|---|---|---|
| **V1** | The selector before the backfill breaks the ship-loop mid-sprint | **the owner** | **"Re-order — 0340 before 0338 (Rec)"** | §Consequences, bullet 2. ⛔ *"Ship both as one change"* and *"transitional grace"* were **NOT taken** — recorded as rejected options (d) and (e). ⭐ A producer applies the re-order; **this ADR does not** |
| **V2** | `🔲 Backlog` or `🔲 Planned` for the first status? | **the owner — OVERRULING the architect's recommendation of `🔲 Planned`** | **"`🔲 Backlog`"** | §1's table, and **§1.1**, which records the architect's objection **and** the collision this ADR accepts. Owner's basis: it matches their own 2026-08-25 wording and the task vocabulary exactly |
| **V3** | The seven legacy `🔒 CLOSED` banners | **the owner** | **"Keep — permanent compat rung (Rec)"** | §2's recognizer, §8.1, test **P2**, rejected option (f). ⚠️ Its accepted consequence — the backfill task's title is now wrong — is named in §8.1 and is the **producer's** to correct |
| **V4** | `ai-agents/sprints/cancelled/` is in neither guard's exemption list | **the owner** | **"0341 adds it in the same change (Rec)"** | **§3.1**, as a required follow-up on the mover task |

### Round 3 — 2026-09-10, live `AskUserQuestion` at this task's review gate (round 1 findings)

| # | Question | Ruled by | Ruling (verbatim label) | Effect |
|---|---|---|---|---|
| **W1** | Three high findings (R1, R2, R3) each name a place a downstream builder must **guess** — amend this ADR, or hand them forward? | **the owner** | **"Amend ADR-047 now (Rec)"** | ⭐ **R1 → §2.3a; R2 → §3.0; R3 → §6.4**, plus the cheap closes taken *"while it is open"*: **R4 → §2's tightened recognizer + §7's `sprint-status-malformed`; R5 → §6.1; R6 → §7.1 carve-out 2; R7 → §7's emitter column + P7/P11/P12/P13/P15/P16; R8 → §4; R10 → §1.2; R11 → §1.1's coordinate; R12 → §8.2; R13 → §2; R14 → §2.3a; R15 → this task's `worklog.md`.** ⛔ *"Hand forward to `0338`/`0341`"* and *"split — amend R1 only"* were **NOT taken.** ⭐ **The owner's basis, recorded:** `0337` is the row four others block on, and **R1/R2/R3 are DECISIONS, not implementation detail — deciding them inside a consuming task puts the design ruling in the wrong place, and in two places** |
| **W2** | The wire shape changes materially while the protocol version marker stays `v1` (R9) | **the owner** | **"Bump to v2 (Rec)"** | **§9** in full, plus §2.3's examples and the §Consequences protocol bullet. ⭐ **The owner's basis, recorded:** the marker's declared purpose is that a consumer reading an unknown shape **refuses rather than guesses** — keeping `v1` across a breaking change **defeats the one mitigation the design named.** ⛔ **This ADR makes none of the code changes**; it records what the bump obliges and `0338` performs it |

### Round 4 — 2026-09-10, live `AskUserQuestion` at this task's review gate (round 2 findings)

| # | Question | Ruled by | Ruling (verbatim label) | Effect |
|---|---|---|---|---|
| **X1** | Round 2 found eleven more findings, **R16 among them blocking `0338` outright** — amend this ADR a second time, fix R16 only, or hand them forward? | **the owner** | **"Amend again — R16 first (Rec)"** | ⭐ **R16 → §7.2 (new) + §7's table and foot; R17 → §3.0.1; R18 → §3.0.2; R19 → §7's table, §7.1 carve-out 2 and P13; R20 → §9.2; R21 → §2.3's two blocks and P17; R23 → §1.2; R24 → §2 and §7.1 carve-out 1 and P16; R25 → §Authoring constraints and §Related.** ⛔ *"Fix R16 only, hand the rest forward"* and *"Hand all forward"* were **NOT taken.** ⭐ **The owner's basis is W1's, unchanged: deciding these inside a consuming task puts the design ruling in the wrong place, and in two places** |
| **X2** | R22 — the seven new drift kinds have no defined field set. Define them here, or accept the residual? | **the owner** | **"Record as accepted residual (Rec)"** | ⛔ **The field sets are NOT defined here.** §Consequences carries the residual in full — What / Why / Re-raise only if — resting on ADR-041 §1.5's own precedent that *"wording is the implementer's"*, and covering **every** drift record shape, not just the seven new kinds |
| **X3** | R26 — two W1 design calls recorded as accepted costs carry no *Re-raise only if* trigger, while §Authority's own rule says each is listed *"where it is genuinely contestable"* | **the owner** | **"Add the two triggers (Rec)"** | **§Re-raise only if** gains a concrete, checkable trigger for **§4's step-order inversion** and for **§7's emitter assignment** — the two outliers among the five W1 calls |

### Everything else is the architect's

Made under the rulings above, and marked ⭐ *architect's call* at each site: the absence of
`🚧 Blocked` and `➡️ Moved` for sprints (§1); the by-position disambiguation rule (§1.1); the banner's
strict-line-3 position, its recognizer, the three rejected carriers, the `⭐ ACTIVE BOARD` token's
grammar, and the `select-active` wire format including the `board` line and the `status` mode (§2); the
row-disposition rules and href (§3); the four-step mover order and the atomic-by-invocation statement
(§4); the N-sprint beat scoping (§5); the `identity_gt`-untouched constraint and the
no-warning-on-suffix decision (§6); every drift name and both carve-outs (§7); the ADR-041
supersession scoping (§8); and the P1–P17 test set.

⭐ **Added under W1, and equally the architect's** — the owner ruled *that* these be decided here, not
*what* they decide: the `unresolved` collision note (§1.2); the recognizer's tightening to require the
date and the `sprint-status-malformed` drift it creates (§2, §7); the one-banner rule as an authoring
convention rather than a check (§2); `board` carrying a redundant `status=` for uniformity, and
parse-by-key (§2.3a); ⛔ **the row-disposition rule for both movers, including the rejection of
refuse-to-close and of freezing open rows** (§3.0); the mover step order's deliberate inversion of the
task movers' order (§4); ⛔ **filter-first precedence, and the ruling that `ambiguous-active-sprint`
still fires on mixed status** (§6.4); and the emitter column's three-drift assignment (§7). ⚠️ **Each is
listed in *Re-raise only if* where it is genuinely contestable** — ⭐ **and as of 2026-09-10 that is
true of all five, not three.** §4's step-order inversion and §7's emitter assignment were the two
outliers; owner ruling **X3** (review R26) added a trigger for each.

⭐ **Added under X1, and equally the architect's** — the owner ruled *that* these be decided here, not
*what* they decide: ⛔ **the per-mode reach rule, the refusal to give `select-active` a roll-up, and the
refusal to merge `ambiguous-active-sprint` with `ambiguous-plan-identity`** (§7.2); the successor
marker's identity-label-plus-`../`-basename href (§3.0.1); the successor enumeration set, the
filter-replaced tie-break, and append-for-`M` (§3.0.2); ⛔ **the ruling that the `Backlog`/unresolved
carve-out is `sprint-status-missing`-only** (§2, §7.1); and the removal of the non-existent *"sweep"*
mode from every emitter assignment (§7, §7.1, P13). ⚠️ **Each contestable one carries a trigger below.**

## Re-raise only if

- **A project needs a fifth sprint status** — a real state that is not `Backlog`/`In progress`/
  `Done`/`Cancelled` and that beat 5 genuinely cannot carry. ⛔ *"A sprint is blocked"* is **closeout**:
  §1 argues it out, and the answer is that its **tasks** are blocked.
- **The `Backlog` word collision (§1.1) actually misleads someone in practice** — a real
  misreading, not a hypothetical one. Then the fix is a status rename, and the architect's `🔲 Planned`
  recommendation is already argued. ⛔ Re-raising it **without** a concrete misreading is closeout: the
  owner ruled it on 2026-09-10 with the objection in front of them.
- **`🔒 CLOSED` becomes a maintenance cost that is more than one alternative in one regex** — V3 bought
  a permanent rung at a stated price; re-raise if the price moves.
- **A caller needs more than one board and the single `board` line stops being enough** — §2.3's wire
  format is the thing to change, not the callers.
- **`dashboard.sh` stops being the single implementation of the banner grammar**, breaking ADR-041 §5,
  which this ADR inherits whole.
- **ADR-040 or ADR-041 is re-raised on its own terms** — this ADR's selector inherits every one of
  their conditions.
- ⭐ **A sprint genuinely needs to close with open rows left ON the board** (§3.0) — a real case where
  relocating them loses something, not a preference. ⛔ *"Refuse the close while rows are open"* and
  *"freeze them in place"* are **closeout**: §3.0 argues both out by name.
- ⭐ **A caller needs the tie-break to run BEFORE the status filter** (§6.4) — i.e. a real case where a
  terminal board should win selection over an `In progress` one. ⛔ Absent that case this is closeout:
  filter-first is ADR-041's own eligibility-then-tie-break ordering, and tie-break-first reintroduces
  the Sprint 5 failure.
- ⭐ **The tightened recognizer refuses a banner someone legitimately needs to write** (§2) — a real
  form, not a hypothetical one. ⚠️ It was measured against all seven real `🔒 CLOSED` banners and
  refused none of them.
- ⭐ **The `v2` bump needs a compat reader after all** (§9) — a consumer outside this repo that cannot
  move in the same change. ⛔ Inside this repo it is closeout: `dashboard.sh` is the single emitter and
  the whole tree moves at once.

⭐ **The three triggers below were added 2026-09-10 under owner rulings X3 (the first two, review R26)
and X1 (the third, review R16).**

- ⭐ **The sprint movers' step-order inversion (§4) actually costs something in practice** — ⛔ **the
  checkable form:** an interrupted `/fkit-sprint-done` or `/fkit-sprint-cancelled` left repointed links
  to a not-yet-moved board **and** §7's location-mismatch drifts **failed to surface it**, so a human
  had to find it by hand. ⭐ That is the exact cost §4 names and accepts; if the detection it relies on
  does not actually fire, the inversion loses its justification and the task movers' order should be
  mirrored instead. ⛔ *"The task movers do it the other way round"* is **closeout on its own** — §4
  states the inversion is deliberate and gives its reason.
- ⭐ **§7's emitter assignment sends a drift to a mode that cannot produce it — again** — ⛔ **the
  checkable form:** a row in §7's table whose *"Fires when"* condition needs data the assigned mode
  does not read (`select-active` reads depth-1 files; the render path reads its own plan, the briefs it
  links, and siblings' **first lines only**). ⚠️ **This trigger exists because that failure has now
  happened twice** — review R6 (a depth-1 mode asked to read inside `done/`) and review R16 (a
  roll-up-less mode asked to reach a roll-up). ⭐ **Re-raise on a third instance without further
  argument.** ⛔ *"A sweep mode would make the assignment tidier"* is **closeout**: no sweep exists,
  §7 says so, and inventing one is `0338`'s decision to escalate, not this ADR's to presume.
- ⭐ **`ambiguous-active-marker` not landing in a roll-up actually loses it (§7.2)** — a real case where
  an owner missed an ambiguous `⭐ ACTIVE BOARD` because it was in `select-active`'s `⟦FACTS⟧` and not
  in a per-board summary. ⭐ Then the fix is a **second** widening of the render path's sibling read
  from first lines to line 3, which is a contract change ADR-041 §1.5's widening is the precedent for.
  ⛔ Absent a real miss it is closeout: the status skill and the ship-loop both read that block.

⛔ **Closeout, not a new finding:** *"the current sprint should be the highest-numbered open one"* — that
is the model this ADR reverses, on the owner's own report. *"Report only one active sprint"* — that is
the model the owner's OQ-2 answer replaced, by name.

## Authoring constraints this ADR obeyed — stated so a reader does not "fix" them

1. ⛔ **No markdown link to anything that does not exist yet.** `test/reference-integrity.test.js:181`
   exempts only `ai-agents/wiki-vault/` — ⚠️ **`:180` in this ADR's first two drafts; that line is
   `export function exempt(rel) {` and the exemption is the line below it. Corrected 2026-09-10 under
   owner ruling X1 (review R25), in a file that claims every coordinate was measured** — so
   `ai-agents/knowledge-base/` **is** link-scanned and a single
   forward link reds `npm test`. `conventions/sprint-status-vocabulary.md`, `ai-agents/sprints/cancelled/`
   and the two mover skill directories are therefore named **in backticks as prose**, deliberately.
   ⭐ Convert them to links only once the files exist.
2. **Coordination documents are cited by heading + quoted fragment, never `path:NNN`** — including
   ADR-041, whose line numbers shift the moment its superseded-in-part note is appended.
   `test/dashboard-contract.test.js` is cited the same way for the reason given in §2.4.
3. **Source files** (`claude/…`, `test/…`) carry `path:NNN`, per the durable-citation convention's
   first row. All such coordinates in this file were **measured against the working tree on
   2026-09-10**.

## Related

- Superseded in part: [`adr-041-…`](adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md) — see §8.2 for the exact scope
- Depends on: [`adr-040-…`](adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md)
- Mover authority reused verbatim: [`adr-033-…`](adr-033-task-movers-are-producer-only-reversing-adr-025.md)
- Enforcement path for the two new movers: [`adr-018-…`](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md), [`adr-036-…`](adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md)
- Vocabulary this one mirrors: [`task-status-vocabulary.md`](../conventions/task-status-vocabulary.md)
- Output constraint: [`one-skill-one-output.md`](../conventions/one-skill-one-output.md)
- Citation form: [`durable-citation-anchors.md`](../conventions/durable-citation-anchors.md)
- The one implementation: `claude/skills/fkit-status/dashboard.sh` — identity ladder at `:121-166` (the `backlog.md` basename branch at `:144-164`, its `if` at `:148`, its false-drift warning at `:149-152`), eligibility at `:173`, ordering at `:187-192`, **the selection site at `:265`** (§6.1's argument swap), the `identity` mode's value contract at `:223-235`, `select-active` at `:237-241`, the `⟦SELECT⟧` emitters at `:272`/`:282`, `STATUS_HEADING_RE` at `:372`; ⭐ **the board render's roll-up at `:1136-1205` and its `drift_clause` at `:1185-1196` — §7.2's evidence that `select-active` has none**, with the render path's own ambiguity record at `:1175` and the comment ruling `plan=` apart from `chosen=` at `:1173-1174`
- **The protocol version marker (§9):** defined once at `claude/skills/fkit-status/dashboard.sh:53`, emitted at `:269` (`⟦SELECT⟧`) and `:1199` (`⟦BOARD⟧`); its parse contract at `claude/skills/fkit-status/SKILL.md:53`, `:223`, `:229`
- Skill-ownership declaration site: `claude/skills-for-role.sh`, `skills_for_role()`
- Guards this ADR was written against: `test/reference-integrity.test.js:181` (⚠️ **`:180` in the first
  two drafts — corrected under X1, review R25**), `test/coordination-citation-policy.test.js:447-448`

## Number allocation — the four-way sweep, evidenced

Run 2026-09-10 per the record-decision procedure. The malformed-filename check printed **nothing**;
the highest number on disk was **46**, over **46** ADR files (no gaps, no duplicates); and
`grep -rn "ADR-047\|adr-047"` over `ai-agents/`, `claude/` and `test/` returned hits **only** in this
task's own `plan.md`, which is this ADR's own reservation. **Zero foreign claimants; 047 is free and is
allocated here.**
