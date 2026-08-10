# Implement ADR-040's identity grammar in `dashboard.sh` — both rungs **and** the `moved_target` companion

## ID
0264

## Sprint
Sprint 5

## Priority
Sprint 5 P11

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority — this task exists because Sprint 5 decided the fix but never scheduled it

**Owner ruling, 2026-08-10:** the implementation follow-ons to ADR-040 and ADR-041 are to be **filed
and ranked into Sprint 5**. That ruling widens a sprint scope that was itself an owner ruling
(verbatim **"Dashboard + all of 0252-0258"**), and the two are reconciled in Sprint 5's dated
addendum rather than silently.

**The hole it closes, stated plainly.** Sprint 5 as it stood decided the downstream dashboard defect
and never fixed it: [`0259`](../0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/brief.md)
is a red fixture, [`0260`](../../done/0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md)
and [`0261`](../../done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md)
are ADRs. No row turned either decision into working code — while Sprint 5's `## Notes` carries an
owner-ruled **release gate** that tests `0260`'s **landed pattern**. The release waited on work no
board scheduled, and the downstream project's bug would have survived the sprint that exists to fix
it. **This brief is the landed pattern.**

### The decision this implements

**ADR-040** — `ai-agents/knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md`.
Read it in full before planning; this brief does not restate its grammar, its twelve-row validation
table, or its rejected options.

⚠️ **ADR-040 read `proposed — needs the owner's sign-off before implementation` when this brief was
filed (2026-08-10), and a concurrent `fkit-architect` unit was flipping it to `accepted`.**
**Confirm its `- **Status:**` line reads `accepted` before writing any code.** If it does not, stop
and report — do not implement a proposed decision.

The owner has ruled on both of ADR-040's sign-off items (2026-08-10, verbatim option labels):

- **"One letter (Recommended)"** — the suffix is `Sprint <digits><one optional lowercase letter>`.
- **"Include plan- (Recommended)"** — the filename rung is `^(plan-)?sprint-<N><suffix>$`, a **closed**
  allowlist. ⚠️ The owner accepted this **knowing no observed file requires it**; it is forward cover
  and ADR-040 §3 flags it as such. Do not re-argue it, and do not widen the allowlist.

### ⚠️ The `moved_target` companion is a NEW defect that this widening ARMS — not a follow-up

**Verified on disk 2026-08-10.** `claude/skills/fkit-status/dashboard.sh:692` reads:

```
moved_target=$(printf '%s' "$st" | sed -nE 's/.*Moved to \[*(Sprint [0-9]+|Backlog).*/\1/p' | head -1)
```

That regex **has no suffix**. Drift rule 2 at `dashboard.sh:767` — verified same day, the
`elif [ -n "$moved_target" ] && [ "$b_sprint" != "$moved_target" ]` branch — compares it against the
brief's `## Sprint`. So once `Sprint 4c` becomes a first-class plan identity, a row reading
`➡️ Moved to [Sprint 4c](plan-sprint-4c.md) — priority 3` parses to `Sprint 4`, disagrees with a brief
reading `## Sprint: Sprint 4c`, and fires a **phantom `drift disagreement` on every moved row**.

**`moved_target` is NOT one of the three `PLAN_SPRINT` consumers.** It is an independent parser of the
same sprint vocabulary. ADR-040 §6 binds it anyway, for exactly this reason: making `Sprint 4c` a
first-class *identity* without making it a first-class *move target* creates a new drift source with
the same fix. **It ships in this change. Not as a follow-up, not as a separate brief.**

⚠️ **Line numbers here are dated anchors of convenience (measured 2026-08-10) and they will move as
soon as you edit the file. The durable anchors are the quoted text.**

## What to build

One change to `claude/skills/fkit-status/dashboard.sh`, plus its tests.

1. **Rung 1 — the H1 segment rule** (ADR-040 §2), replacing the current
   `sed -n 's/^# \(Sprint [0-9][0-9]*\).*/\1/p'` at `dashboard.sh:83`. Segment splitting on the four
   delimiters, whole-segment anchored match, and the **distinct-match count** rule: exactly one → that
   identity; zero → fall through; **two or more distinct → refuse and fall through** (do not guess).
2. **Rung 2 — the filename fallback** (ADR-040 §3), replacing the
   `^sprint-\([0-9][0-9]*\)$` matcher at `dashboard.sh:87`, with the closed `plan-` allowlist.
3. **Rung 3 — the `backlog` basename special case at `dashboard.sh:93` is UNCHANGED.** Its comment at
   `:89-108` stands, except for the one stale claim noted below.
4. **The `moved_target` companion** at `dashboard.sh:692` — same suffix, per ADR-040 §6. Binding.
5. **One implementation of the grammar, reused by every rung.** ADR-040's Consequences state this as a
   binding mitigation, and its own file already documents at `dashboard.sh:111-125` what happened when
   one question (`STATUS_HEADING_RE`) acquired three grammars. ⚠️ **Write it so that
   [`0265`](../0265-implement-adr-041s-dashboard-half-the-backlog-identity-token-and-the-resolve-identity-interface/brief.md)
   can extend and expose it** — 0265 adds a `Backlog` token to this same rung and exposes the resolver
   to `fkit-status/SKILL.md`. You are not building 0265's interface here; you are not making it
   impossible either.
6. **`dashboard.sh:95`'s comment** — *"its filename is deliberately outside the `sprint-*.md` glob"* —
   is part of this patch per ADR-041 §6's closing line. Correct the claim; leave the special case's
   behavior alone.

### Tests — ADR-040's T2–T9

> **⚠️ CORRECTED 2026-08-10 — THE SCOPE OF THIS SECTION IS `T2`–`T11`, NOT `T2`–`T9`.** The heading
> above is left **byte-identical**; it was wrong when written. This brief as filed mentioned **`T10`
> and `T11` zero times**, and ADR-040 makes both **mandatory**:
> `adr-040-…md:159` — *"Tests **T10** and **T11** below are therefore mandatory — they are the only
> thing that makes this rung real"*; `:333` names the follow-up's obligation as *"the **T1–T11** test
> set"*. **Build T10 and T11 as well as T2–T9.** Everything else in this section stands unchanged.
>
> **The two rows, from ADR-040's own required-tests table (`:260-261`) — read them there, not only
> here:**
>
> | ID | Fixture | Assertion |
> |---|---|---|
> | **T10** | **`plan-sprint-7.md` with a genuinely prose H1 (`# Hardening push`)** | **identity `Sprint 7` — the ONLY test that exercises rung 2's `plan-` prefix at all (§3 is unevidenced by any §7 row). Without it the rung ships untested.** |
> | **T11** | **`hotfix-post-sprint-2.md` — note the hyphen before the digit — with a prose H1** | **identity EMPTY + reported. Pins the closed allowlist: an open `.*sprint-<N>` rule would claim this file, and the reporter's real `hotfix-post-sprint2.md` (no hyphen) would have hidden that by luck** |
>
> ⚠️ **T11's filename is `hotfix-post-sprint-2.md`, with a hyphen before the `2`. It is deliberately
> NOT the reporter's real `hotfix-post-sprint2.md`** — that one is already T3. The hyphenated variant
> is the case an **open** `.*sprint-<N>` rule would wrongly claim, and the real file's missing hyphen
> hides that failure **by luck**. Do not "correct" the filename to match the report.
>
> **⚠️ WHY THIS IS THE POINT OF THE FINDING, not a completeness nicety.** Rung 2's `plan-` prefix was
> **owner-ruled in on 2026-08-10** — verbatim option label **"Include `plan-` (Recommended)"** —
> **knowing no observed file requires it**: every one of the report's §7 rows resolves at rung 1, and
> ADR-040 §3 marks the rung *"unevidenced by any observed file… a deliberate forward bet"*. **T10 and
> T11 are its sole coverage.** ADR-040 states the consequence in its own words (`:158-160`): *"an
> unevidenced rung that no test exercises can ship broken and stay broken."* Without them this task
> builds, **verifies green**, reviews clean and closes — with the owner's forward bet **shipped
> untested**, and nothing anywhere would say so.
>
> ⛔ **This correction adds tests only. No new row, no new `Depends on:` edge, no rank change, no
> status change.** *(Appended 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the
> owner's ruling of the same day — verbatim option label **"Amend 0264 to scope T2-T11 (Rec)"**.)*

`test/dashboard-contract.test.js`. **T1 is `0259`'s red fixture — do not duplicate it**; if `0259` has
landed, T1 exists and this change is what turns it green.

- **T5 is the binding regression guard and the decision is not satisfied without it.** ADR-040 §7:
  *"A genuinely unidentifiable plan MUST still report `unresolved-plan-sprint`."* An implementation
  that drops T5 **does not satisfy ADR-040**, however well it resolves the twelve rows.
  ⚠️ **ADR-040 cites T5's fixture at `test/dashboard-contract.test.js:654`. That line is blank
  (verified 2026-08-10).** The test it means — `R8: an entirely unresolvable plan sprint is REPORTED,
  not silently ignored` — starts at **`:655`**. Match on the test name, not the number.
- T3 must assert **all three consumers**, per R7's precedent.
- T8 requires R7's existing `backlog.md` fixture to **stay green byte-unchanged**.
- T9 is **red before** the §6 companion change — build it that way and say so.

### Constraints

- ⛔ **Do not touch `STATUS_HEADING_RE`** (`dashboard.sh:111-125`). The downstream reporter names it
  their own defect and asks us not to.
- ⛔ **Do not change the `backlog` basename special case** — owner-ruled 2026-07-18, review R4.
- ⛔ **Do not edit `claude/skills/fkit-status/SKILL.md`** — its selector is `0266`'s, and its glob is
  ADR-041's to retire, not this brief's.
- ⛔ **Do not "fix" the two existing R8 tests.** Both are correct for what they assert; `0259`'s brief
  says the same.
- ⛔ **No new devDependency** (ADR-014). ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit.
- ⛔ **Do not add the downstream pre-release test to this brief's verification steps.** It is a
  **release gate**, already recorded in Sprint 5's `## Notes` and in `0260`'s Notes on the owner's
  ruling of 2026-08-10 (verbatim **"Yes — before the release cut"**). It gates the **cut**, not this
  row. Cited here, deliberately not re-recorded.

## Verification steps

1. **ADR-040's `- **Status:**` line reads `accepted`** before any code is written. State it in the
   worklog.
2. **Reproduce ADR-040's twelve-row validation table** against the landed code — every one of the
   twelve filenames and H1s from the report's §7, with its resolved identity. **Rows 1 and 12 must
   resolve EMPTY and emit `unresolved-plan-sprint`.** Row 6 (`sprint-backlog.md`) must still resolve
   EMPTY here — it is `0265`'s, by ADR-040's own deferral. Paste the measured table; do not quote the
   ADR's.
3. **T5 proves itself red.** Temporarily remove the refusal path, show T5 fails, restore. Per ADR-026
   this project does not take a guard's word for it.
4. **T9 proves itself red.** Show T9 failing against `dashboard.sh:692`'s current
   `(Sprint [0-9]+|Backlog)`, then green after the companion change.
5. **No regression on this repo's own boards.** Run `/fkit-status`-equivalent identity resolution over
   `ai-agents/sprints/*.md` and `ai-agents/sprints/done/*.md` and show every board resolving as it does
   today (`Sprint 1`–`Sprint 5` at rung 1, `backlog.md` at rung 3).
6. **Full `npm test` green**, including `test/prove-red.sh`. If `0259` has landed, state explicitly that
   its fixture went from red to green **and that the suite is green again** — `0259` shipped it RED on
   purpose.
7. `git diff --stat` touches `claude/skills/fkit-status/dashboard.sh` and
   `test/dashboard-contract.test.js` and nothing else.

> **⚠️ AMENDED 2026-08-10 — steps 1–7 above are left byte-identical and all still stand. One step is
> ADDED, because the widening from `T2`–`T9` to `T2`–`T11` was not covered by any of them.** Steps 3
> and 4 prove `T5` and `T9` red; **nothing proved the `plan-` rung.** Step 2's twelve-row table is
> unaffected — every §7 row resolves at rung 1, which is exactly why the rung needs its own proof.

8. **T10 and T11 exist by name, and each proves itself red — this is the whole reason they were
   added.** Per ADR-026 this project does not take a guard's word for it.
   - **T10 proves rung 2 is genuinely reached.** Temporarily narrow the allowlist to drop the
     `plan-` prefix (`^sprint-<N><suffix>$`), show **T10 fails**, restore. If T10 stays green with
     the prefix removed, it is not testing the rung and the owner's forward bet is still uncovered.
   - **T11 proves the allowlist is genuinely closed.** Temporarily open the rung to a
     `.*sprint-<N><suffix>$` form, show **T11 fails** — `hotfix-post-sprint-2.md` is wrongly claimed
     as `Sprint 2` — then restore.
   - **State in the worklog that T11's fixture is `hotfix-post-sprint-2.md` (hyphen before the
     digit), deliberately distinct from T3's real `hotfix-post-sprint2.md`.** They are two tests, not
     a typo of one.

## Notes

- **Depends on:** nothing
- **Blocks:** `0265`, `0268`
- **⚠️ `0259` is a SOFT ordering, deliberately NOT a `Depends on` — and here is the judgement rather
  than a silent choice.** `0259` adds the red fixture (T1); this brief makes it green. It is not a
  build-time gate: this change is fully implementable and testable with `0259` unlanded. Sprint 5
  already records `0259` → `0260` as a soft ordering on the same reasoning, and a false `Depends on`
  is machine-read by `dashboard.sh` and worse than none (tasks `0184`, `0149`). **Land `0259` first
  anyway** — a fix proven red-first is the project's own discipline (ADR-026).
- **⚠️ A cross-row interaction no board records, surfaced here rather than left to be discovered.**
  `0259` ships `npm test` **RED on purpose**, and
  [`0256`](../0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md) builds a gate that
  **blocks** a release on a red tree. Between `0259` landing and this brief landing, **no release can
  be cut** — by design, and correctly, but it means this row sits on the release path whatever its
  rank. `0256`'s own verification (a demonstrated block, then revert) is unaffected.
- **On merit:** immediately below `0261` — it is the landed pattern Sprint 5's release gate tests, and
  the only row on the board that returns `npm test` to green.
  ⚠️ **`P11` is an append rank, NOT a merit ranking — flagged for owner confirmation.** A spawned
  producer has no owner channel and never re-ranks or inserts mid-board (`/fkit-task-brief` step 5,
  [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  so the owner's placement ruling is recorded here as a merit statement rather than executed as an
  insertion. See Sprint 5's dated addendum.
- **Line-number citations are dated anchors of convenience** (measured 2026-08-10); the durable
  anchors are the quoted text.
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.
