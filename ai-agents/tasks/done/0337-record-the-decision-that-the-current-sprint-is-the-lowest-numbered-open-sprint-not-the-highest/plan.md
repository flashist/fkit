# Implementation plan — task `0337`: the sprint-lifecycle ADR

## ⛔ Four refutations first — three of the driver's, one of the brief's

**R1 — The ADR number is `047`, not `044`.** `044`, `045`, `046` are all allocated
(`adr-044-build-role-…`, `adr-045-an-in-flight-review-finding-…`,
`adr-046-a-sprint-board-may-be-committed-unranked-…`). The brief said *"`044` at filing; re-check at
pickup"* — re-checked: **46 ADRs on disk, `adr-047-*` free.**

**R2 — The driver's citation constraint is right for this plan and wrong for the ADR.**
`test/coordination-citation-policy.test.js:110` exempts `sprints/done/` + `sprints/reviews/`, and its
scope note item 5 states **`ai-agents/knowledge-base/**` is not scanned at all**. So the guard would
not red a `path:NNN` in the ADR. ⭐ **The ADR is still written without them**, because the *convention*
— `durable-citation-anchors`, "Which anchor for which target" row 3 — rules `path:NNN` **categorically
wrong** for a coordination document regardless of who cites it, and because of R3. ⚠️ The driver's
constraint binds **this plan text** (open task folders ARE scanned); it binds the ADR by convention.

**R3 — The brief's verification step 8 is self-defeating; deviating deliberately.** It asks the ADR to
*"Name the ADR-041 sites falsified (`:66-68, 77-78, 228-229, 288-299, 330-332`)"* — while verification
step 4 requires **appending a superseded-in-part note to the top of ADR-041**, which shifts every one
of those numbers. ⭐ **Satisfy the step's INTENT with §-number + quoted-fragment anchors** (e.g.
*ADR-041 §1.4 — "compare `<N>` as an **integer**"*). ⚠️ Flagged so the reviewer scores intent, not
literal digits.

**R4 — The brief's migration list is 16 days stale, and this reshapes `0340`.** The brief says *"Today
the top holds only `sprint-6.md` and `backlog.md`"* and *"`sprints/done/sprint-1..5.md`"*. Measured:
the top holds **`backlog.md` + `sprint-8.md`**; `done/` holds **`sprint-1` … `sprint-7`**. All **seven**
archived boards carry `> ## 🔒 CLOSED — <date>.` at line 3 (verified individually; four carry a
trailing `Superseded by [Sprint N+1]`, sprints 5/6/7 do not). ⭐ **The legacy banner set is 7, not 5.**

Both driver measurements reproduced exactly: `select-active` → `active file="sprint-8.md"
identity="Sprint 8"`, 2 candidates, exit 0, no drift; and `is_eligible`
(`claude/skills/fkit-status/dashboard.sh:173`) is identity-only. Criterion (a) is unmet for exactly
that reason.

## Deliverable

One file:
`ai-agents/knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md`,
written by an **fkit-architect** Build worker running `/fkit-record-decision` (ADR-044's role rule).
Plus a dated superseded-in-part note appended to ADR-041. **Status: accepted** — every point either
quotes an owner ruling or is marked as the architect's call.

## The eight points

### 1 · Vocabulary — four statuses

| Status | Line-3 banner | Lives in | Set by |
|---|---|---|---|
| `🔲 Backlog` (ruling **V2**) | `> ## 🔲 Backlog — <date>.` | `sprints/` | producer, by hand |
| `🔄 In progress` | `> ## 🔄 In progress — <date>.` | `sprints/` | producer, by hand |
| `✅ Done` | `> ## ✅ Done — <date>. Closed by /fkit-sprint-done.` | `sprints/done/` | **mover only** |
| `⛔ Cancelled` | `> ## ⛔ Cancelled — <date>. Closed by /fkit-sprint-cancelled — <reason>.` | `sprints/cancelled/` | **mover only** |

- **No `🚧 Blocked` for a sprint** — a sprint is not blocked, its tasks are; a board whose every row is
  blocked is still `In progress` and beat 5 is where that is reported. Architect's call.
- **`➡️ Moved` does not apply** to a sprint — it is a row disposition, not a board state.
- **Agent-closed marker applies**, same rule as ADR-033 §5:
  `Closed by /fkit-sprint-done (agent-closed — not owner-verified).`
- **How a reader tells sprint markers from task markers: by POSITION, not by glyph.** A task status is a
  `## Status` field in a `brief.md` or the leading cell of a board row; a sprint status is a
  **blockquoted H2 on line 3 of a board**. The glyphs are deliberately shared so one eye reads both —
  minus `🚧` and `➡️`, which are task-only. ⭐ The ADR states this as the disambiguation rule rather than
  inventing a second glyph set.
- Vocabulary file: a new `conventions/sprint-status-vocabulary.md`, sibling of the task one — ⭐ **named
  by this ADR, written by `0339`.** ⛔ This ADR does not create it (see *Authoring constraints*).

### 2 · The carrier — the line-3 banner grammar (SD-1, ruled)

```
> ## <MARKER> <STATUS> — <YYYY-MM-DD>.[ <trailing prose>]
```

- **Strictly line 3.** Line 1 the H1, line 2 blank, line 3 the banner. All seven archived boards satisfy
  this today. Strict-position is chosen over "first line of the leading blockquote" so a `> ## `
  appearing deeper in a board can never be mistaken for a status.
- **Recognizer** (one implementation, ADR-041 §5, in `dashboard.sh`): line 3 matches
  `^> ## (🔲 Backlog|🔄 In progress|✅ Done|⛔ Cancelled|🔒 CLOSED)([ .]|$)`.
- **Exactly one banner per plan** — no other line may match.
- **Legacy `🔒 CLOSED` is a member of the grammar, read as `✅ Done`**, with
  `Superseded by [Sprint N+1](…)` tolerated as trailing prose. ⭐ **Read forever, written never**
  (ruling **V3**).
- **No banner at line 3 → status `unresolved` → never eligible**, plus a drift fact — ⛔ **except** where
  identity is `Backlog` or unresolved (§7 carve-out 1). ⛔ Never silently `In progress`.
- **`## Status` is untouched.** `STATUS_HEADING_RE` is `^## Status[ \t]*$`
  (`claude/skills/fkit-status/dashboard.sh:372`); a banner begins `> ` and cannot collide. Verified.
- **The active-board marker** (ADR-041 option (d), grammar the architect's): the literal token
  `⭐ ACTIVE BOARD` in an `In progress` banner's trailing prose. One carrier, one reader, one grammar —
  no second file, no second field.
- **Rejected, recorded with reasons:** a `## Sprint status` field (a second `##` heading in a file whose
  `## Status` is already load-bearing and whose sections are parsed positionally); an H1 segment
  (ADR-040 owns the H1 and a status is not identity); folder-location-only (cannot express
  `Backlog` vs `In progress`, and is what failed for Sprint 5).

**Interface for `0338`** — `select-active`, one mode, one output:

```
⟦SELECT⟧
active file="sprint-8.md" identity="Sprint 8" status="In progress"
board  file="sprint-8.md" identity="Sprint 8" reason="lowest-ordered"
candidate file="backlog.md"  identity="Backlog"  status="unresolved"
candidate file="sprint-8.md" identity="Sprint 8" status="In progress"
⟦FACTS⟧
```

- **One `active` line per In-progress sprint**, ascending — "current" is plural, so the plural is in the
  wire format, not reconstructed by a model.
- **Exactly one `board` line**, present iff ≥1 active: the single-board answer for the ship-loop,
  carrying its own `reason` (`lowest-ordered` | `active-marker`). ⭐ Two consumers, one output —
  `conventions/one-skill-one-output.md` intact.
- Every line carries `status=` — ⭐ **this is what makes success criterion (a) observable**: the script
  names `sprint-8.md` *and prints the status it chose it for*.
- Zero active → `active none`, every `candidate` still listed with its status, exit 3.
- **New sibling mode `status <plan>`** — prints one token, exit 0 resolved / 3 unresolved / 1 usage.
  Mirrors `identity`'s value-not-rendering contract; ⛔ deliberately **not** folded into `identity`,
  whose "ONE line, single command substitution" contract is documented at
  `claude/skills/fkit-status/dashboard.sh:216-228`.

⚠️ **Hand this to `0338` explicitly:** `test/dashboard-contract.test.js:2536` asserts
`assert.equal(activeLine(out), 'active file="…" identity="…"')` — **exact string equality**. Adding
`status=` breaks S1/S1b/S2/S3/S5/S6/S7/S8. Worse, `activeLine` is
`.find(l => l.startsWith('active'))`, so plural `active` lines would silently return only the first and
a wrong test would stay green. And every S-fixture uses `prosePlan()` — **no banner** — so under the new
rule all of them go ineligible. ⭐ **The repin is not cosmetic; the ADR's required-tests table says so in
those words.**

### 3 · Location, `sprints/done/`, `sprints/cancelled/` (SD-2, ruled)

Location stays a second carrier, exactly as `tasks/done/` is for tasks. `✅ Done` → `sprints/done/`;
`⛔ Cancelled` → `sprints/cancelled/`, **created on first use** (git cannot carry an empty directory, so
eager creation is not available anyway). `select-active` scans depth-1 only, so both folders are
excluded by construction. Href rule for the new folder: `../backlog.md`, one hop up, identical to `done/`.

**A cancelled sprint's rows:** open rows flip to `➡️ Moved to [Backlog](../backlog.md)`; each brief's
`## Sprint` / `## Status` / `## Priority` follow `/fkit-task-brief` step 8's de-scope procedure; closed
rows are frozen history and are not touched.

⚠️ **New consequence, measured:** `test/coordination-citation-policy.test.js:447-448` exempts exactly two
literal prefixes — `ai-agents/sprints/done/` and `ai-agents/sprints/reviews/`. ⛔
**`ai-agents/sprints/cancelled/` is in neither guard's exemption list.** The first cancelled board would
be *scanned*, unlike every other frozen board, and its frozen `path:NNN` claims would red `npm test`.
⭐ Settled by ruling **V4**.

### 4 · The movers (SD-3, ruled)

`/fkit-sprint-done` and `/fkit-sprint-cancelled`, **producer-only**, under ADR-033's reasoning verbatim
(closing identity separated from doing identity; role-gating is separation, not prevention; the marker
stays prose). Enforced through `skills_for_role()` in `claude/skills-for-role.sh` — the producer row
gains the two names — plus the ADR-018 `PreToolUse` hook and ADR-036's declared site inventory.

**One act, in the order the task movers do it:** stamp the line-3 banner → dispose of the rows →
repoint links → `git mv` the board into `done/`/`cancelled/`. ⭐ **Atomic-by-invocation, not
atomic-by-filesystem** — the ADR says so plainly rather than implying a transaction.
`🔲 Backlog → 🔄 In progress` is free for the producer to set by hand — a planning act, like `➡️ Moved`.

`Superseded by [Sprint N+1]` is **optional**, written only when a successor board exists at close time —
sprints 5, 6 and 7 omit it and that was correct, not drift.

⭐ **Criterion (b) is directly satisfied**: `ai-agents/sprints/done/sprint-8.md` will read
`> ## ✅ Done — <date>. Closed by /fkit-sprint-done.` while `select-active` returns `active none` /
exit 3. Both halves observable. ⭐ The architect did **not** need the freedom the owner's "Reading 2"
ruling granted — stamp and move stay one act.

### 5 · Eligibility and reporting

Eligible = **identity is a `Sprint <N><suffix>` token** (ADR-040/041, unchanged) **AND status is
`In progress`**. `Backlog` never eligible. `unresolved` never eligible. `Done`/`Cancelled` never eligible
— **by status or by legacy `🔒 CLOSED` banner** (OQ-3, which is what makes a finished-but-unarchived
board harmless).

**`/fkit-status` with an empty argument reports every eligible sprint.** Shape for N sprints — ⭐
**architect's call, deviating from the brief's recommendation with a reason**:

| Beat | Scope |
|---|---|
| 1 · Headline | **once, across all boards** — beat 1 is "if someone reads only this line"; there cannot be N of those |
| 2 · Where we are | per sprint, ascending |
| 3 · What's moving | per sprint |
| 4 · What's next | **once, across all** — beat 4 is "the one thing to pick up". N recommendations is not a recommendation |
| 5 · What's in the way | per sprint |
| 6 · What I need from you | **once, across all** — one decision queue, or the owner reads N lists to find their own work |
| 7 · Dashboard | one table per sprint, ascending |

⭐ The brief recommended beats 1–6 per sprint. Repeating 1, 4 and 6 destroys what those three beats are
*for*. Recorded as the architect's call, overridable.

### 6 · The single-board choice (OQ-1, ruled)

**Lowest-ordered eligible sprint**, overridden by `⭐ ACTIVE BOARD`.

⛔ **Implementation constraint the ADR pins for `0338`: keep `identity_gt` exactly as written**
(`claude/skills/fkit-status/dashboard.sh:186-192` — its length-then-bytes comparison and its two
documented overflow/leading-zero hazards are unaffected by direction) **and invert only the comparison
at the selection site.** The site's strictly-greater test is what delivers ADR-041 §1.5's "first
candidate in glob order wins a tie"; strictly-*less* preserves that property identically. ⛔ A rewrite of
the comparator would not.

**Does suffix order still bite?** It narrows to a drift-shaped anomaly: it needs two boards with the
same `<N>` **both** carrying `🔄 In progress`, which explicit statuses make a mistake rather than a
state. Decision: **keep ADR-041 §1.4's within-`<N>` suffix order (absent < `a` < `b`), pick
deterministically, do not warn** — because two *different* identities both `In progress` is now
**legal**, and warning on `Sprint 4` + `Sprint 4c` would fire on the legal case. Architect's call,
⛔ explicitly **not** a re-raise of OQ-2.

⭐ **Is plural-current legal rather than drift? YES — and the ADR separates the two cases in as many
words, because `0339` has to teach it:**

- **Two different identities both `In progress`** (`Sprint 8` + `Sprint 9`) → ⭐ **legal.** Two `active`
  lines, one `board` line, **no drift record.** This is the whole point of the owner's OQ-2 reframe.
- **Two files claiming the same identity** (`sprint-6.md` + `plan-sprint-6.md`) → ⛔ **still drift**,
  `drift ambiguous-active-sprint`, ADR-041 §1.5 untouched.

Today's `select-active` cannot tell these apart because it has no status; that is the semantic change,
stated as one.

### 7 · Drift rules for sprints

| Fact | Fires when |
|---|---|
| `drift sprint-status-missing` | eligible identity, no line-3 banner |
| `drift sprint-terminal-not-archived` | status `Done`/`Cancelled` but the board sits at the top of `sprints/` |
| `drift sprint-archived-not-terminal` | board under `done/`/`cancelled/` with no terminal status and no legacy banner |
| `drift sprint-status-location-mismatch` | `Done` under `cancelled/`, or `Cancelled` under `done/` |
| `drift active-marker-on-non-active` | `⭐ ACTIVE BOARD` on a banner that is not `In progress` |
| `drift ambiguous-active-marker` | more than one board carries the marker → fall back to lowest-ordered, name every claimant |
| `drift ambiguous-active-sprint` | **unchanged**, ADR-041 §1.5 |

⚠️ **Two carve-outs the ADR states as HARD RULES, not notes:**

1. ⛔ **`sprint-status-missing` must NOT fire for a `Backlog` or unresolved identity.** `backlog.md` has
   plain prose at line 3 and will never have a banner. Without this carve-out it emits a false drift
   record **on every single run, forever** — precisely the failure `resolve_identity` already carries a
   long warning about (`claude/skills/fkit-status/dashboard.sh:150-163`: *"a permanent false drift
   record on a board that is perfectly well-formed"*). ⭐ Same trap, same board, second entrance.
2. ⛔ **`select-active` is depth-1 and cannot see `done/`.** So the two *archival* drifts above are
   **not** its to emit — they belong to the per-board render path or an explicit sweep. ⭐ The ADR
   assigns them there rather than specifying a fact the chosen mode structurally cannot produce.

Every drift kind must reach the roll-up's drift clause so it lands in beat 6 — ADR-041 §1.5 already
rules this and names the in-file comment saying an unreachable drift kind is invisible.

### 8 · Migration (corrected per R4) and what ADR-041 loses

**This repo:** `sprint-8.md` gains one banner line at line 3 (plus a `>` spacer), pushing its Authority
blockquote down — ⭐ the grammar is backfillable **by insertion, no rewrite**, which is what the owner's
"open with no banner, `0340` adds it" ruling requires. `sprints/done/sprint-1..7.md` — ⛔ **no change**
(ruling **V3**). `backlog.md` — no change, and carve-out 1 keeps it quiet. Plus the `ai-agents/README.md`
line and its scaffold copy (*"Completed sprints move to `sprints/done/`"* — now incomplete).
⛔ `sprints/cancelled/` is **not** created by this migration.

**ADR-041 — superseded in part**, dated note at its head naming ADR-047 and scoping it:

- **Falsified:** §1.3 (eligibility gains the status rung); §1.4's *direction* (highest → lowest; its
  integer-then-suffix comparator survives); §1.6 (the empty-set report grows a status column);
  §Consequences — *"Residual — 'highest N' is a RETAINED HEURISTIC WITH A NAMED EXIT"* — the exit is now
  taken; §Required tests S1/S1b/S2/S3/S5/S6/S7/S8, repinned by `0338`.
- **In force, untouched:** §1.1 candidate set, §1.2 identity ladder, §1.5 same-identity tie-break,
  §2 `Backlog` token, §3, §4, §5 one-grammar-one-implementation.
- ⭐ **The re-raise is in-bounds and the ADR quotes the trigger:** ADR-041 *Re-raise only if* bullet 2 —
  *"a project legitimately works two sprints in parallel … this is the named exit: option (d), an
  explicit active-sprint marker."* Both halves fired. ⭐ **This ADR is the exit being taken, not an ADR
  being re-argued.**

## ⛔ Authoring constraints for the Build worker

1. ⛔ **`test/reference-integrity.test.js:180` exempts only `ai-agents/wiki-vault/`** — `knowledge-base/`
   **IS** link-scanned. So: ⛔ **no markdown link to anything that does not exist yet** — not
   `conventions/sprint-status-vocabulary.md` (`0339` writes it), not `sprints/cancelled/`, not the two
   mover skill dirs. ⭐ Name them in backticks as prose. **A single forward link reds `npm test`.**
2. Coordination documents cited by **heading + quoted fragment**, never `path:NNN` (R2/R3). Source files
   (`claude/…`, `test/…`) by `path:NNN` freely.
3. ⛔ No secrets. No commit, no push. Nothing written outside `knowledge-base/decisions/`.

## Verification, mapped to the brief's six steps

1. ADR exists at the path above; Authority table quotes OQ-1, OQ-3, SD-1, SD-2, SD-3 verbatim with date
   `2026-08-25` and channel (`AskUserQuestion`, live), and quotes the owner's OQ-2 answer verbatim as the
   reframe.
2. Points 1–8 each have their own heading or table — checkable by `grep -c` on the eight headings.
3. `grep -n "highest" <ADR>` — every hit describes the superseded rule or option-(d) history; the new
   rule reads *lowest*.
4. ADR-041 carries the dated superseded-in-part note, scoped as in §8.
5. Required-tests table gives fixture + expected output for: two In-progress sprints both reported (and
   **no** drift); a `🔒 CLOSED` board at the top never active; no-banner never active + its drift fact;
   ⭐ **`backlog.md` produces no drift fact**; lowest-ordered single choice; `⭐ ACTIVE BOARD` override;
   two markers → drift + fallback; zero eligible → `active none` + candidates with statuses + exit 3;
   each of the five banner forms parsed to its status.
6. `git status` clean outside `knowledge-base/decisions/`. ⚠️ **Read as "no source, skill or sprint
   changes"** — the ship-loop's own `plan.md`/`worklog.md`/`review.md` in the task folder and the brief's
   status flips are normal loop artifacts, not violations. ⭐ Flagged so the reviewer does not red step 6
   on the driver's own writes.

Then: `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` and full
`npm test`.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-10

Given live via `AskUserQuestion`. Option labels **verbatim**. These bind the Build and Process-review workers.

| # | Question | Owner ruling | What it settles |
|---|---|---|---|
| **V0** | Approve this plan? | Approved via V1–V4 | ⛔ Every point above stands as written except where narrowed below. |
| **V1** | ND-1 — `0338` before `0340` breaks the ship-loop mid-sprint. | **"Re-order — 0340 before 0338 (Rec)"** | ⭐ **Sprint 8's rows are re-ordered so `0340` precedes `0338`.** ⛔ Options *"ship both as one change"* and *"transitional grace"* were **NOT taken** — the grace option re-introduces the exact silent-default this ADR bans. ⭐ **A producer is applying the re-order separately; this ADR does not do it.** ⭐ The ADR may state the ordering constraint as a consequence. |
| **V2** | ND-2 — `🔲 Backlog` or `🔲 Planned` for the first status? | **"`🔲 Backlog`"** | ⭐ **`🔲 Backlog`.** ⚠️ **The owner OVERRULED the architect's recommendation of `🔲 Planned`.** ⛔ **Carry the architect's objection into the ADR rather than dropping it:** `Backlog` is already a load-bearing **identity** token in this subsystem (ADR-041 §2, and `resolve_identity`'s special-case), so this gives one word two meanings — *"the Backlog board"* (`backlog.md`, never a sprint) vs *"a sprint whose status is Backlog"*. ⭐ **The ADR records the collision it accepts, and states the disambiguation rule (§1's by-POSITION rule) as the thing that makes it survivable.** ⭐ The owner's basis: it matches their own 2026-08-25 wording and the task vocabulary exactly. |
| **V3** | ND-3 — the seven legacy `🔒 CLOSED` banners? | **"Keep — permanent compat rung (Rec)"** | ⭐ **`🔒 CLOSED` is read as `✅ Done` FOREVER** — a permanent, tested compat rung in the parser. ⛔ **Do NOT rewrite the seven archived banners.** ⭐ Reason: sprints 5 and 7 are frozen records and this repo's rule is **annotate, never rewrite**. ⚠️ **Consequence, accepted: this makes `0340`'s title (*"backfill onto EVERY existing sprint plan"*) wrong — correcting it is the PRODUCER's, not this ADR's.** |
| **V4** | ND-4 — `sprints/cancelled/` is in neither guard's exemption list. | **"0341 adds it in the same change (Rec)"** | ⭐ **Whatever change creates `ai-agents/sprints/cancelled/` MUST, in the same commit, add that prefix to `test/coordination-citation-policy.test.js`'s exemption list** (measured at `:447-448`). ⛔ Do not defer to "when a sprint is actually cancelled" — that guarantees the red lands on whoever cancels a sprint, at the worst moment. ⭐ **The ADR records this as a required follow-up ON `0341`.** ⭐ A producer is noting it on `0341`'s brief separately. |
