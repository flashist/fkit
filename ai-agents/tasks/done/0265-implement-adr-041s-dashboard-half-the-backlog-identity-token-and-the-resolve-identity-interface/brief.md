# Implement ADR-041's `dashboard.sh` half — the `Backlog` identity token and the resolve-identity interface

## ID
0265

## Sprint
Sprint 5

## Priority
Sprint 5 P5

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Authority

**Owner ruling, 2026-08-10** — the implementation follow-ons to ADR-040 and ADR-041 are filed and
ranked into Sprint 5. See `0264`'s Context for the scope hole this closes and Sprint 5's dated
addendum for the reconciliation with the board's founding ruling.

**Direction ruled, 2026-08-10, verbatim option label: "Accept — selection by identity
(Recommended)".** The `sprint-*.md` glob is **retired**. ⚠️ *"Keep the glob as a fallback"* was put to
the owner and **explicitly rejected** — do not reintroduce it as a safety net, a degraded mode, or a
comment.

**Tie-break ruled, 2026-08-10, verbatim option label: "Pick deterministically, flag loudly
(Recommended)"** — ADR-041 §1.5 as written.

### The decision this implements

**ADR-041** — `ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md`.
Read it in full; this brief does not restate its selection rule, its compounded-defect analysis, or
its rejected options.

⚠️ **ADR-041 read `proposed — needs the owner's sign-off before implementation` when this brief was
filed (2026-08-10), and a concurrent `fkit-architect` unit was flipping it to `accepted`. Confirm its
`- **Status:**` line reads `accepted` before writing any code.**

⚠️ **ADR-041 depends on ADR-040 and cannot ship before it.** Its selector is a function of ADR-040's
identity grammar, and §2's `Backlog` token extends ADR-040's rung 1. That is why `0264` is a hard
`Depends on` below and not a preference.

### The "highest N" heuristic — recorded at the strength it actually has

ADR-041's Consequences flag *"highest N"* as a heuristic it inherits rather than endorses (on the
reporter's repo it selects `Sprint 6` while `Sprint 4c` may be what they are working).

**Disposition, 2026-08-10: keep the heuristic, pin the integer ordering with a test, and record an
explicit active-sprint marker as a future escape hatch (ADR-041 option (d)).**
⚠️ **This was ruled by the lead and flagged to the owner as such — it is NOT an owner ruling.** It is
recorded here at that strength deliberately. If the owner disagrees, the escape hatch is already named
in ADR-041 and nothing built here forecloses it.

## What to build

Changes to `claude/skills/fkit-status/dashboard.sh` and `test/dashboard-contract.test.js`.

1. **The `Backlog` H1 identity token** (ADR-041 §2). A whole trimmed H1 segment that is exactly
   `Backlog` **or** exactly `Sprint Backlog` resolves the identity to **`Backlog`** — normalized to
   that string, **never** `Sprint Backlog`, because `Backlog` is what briefs carry (`## Sprint:
   Backlog`) and what the arm at `dashboard.sh:772` compares against. `dashboard.sh:104-107` states
   what divergence costs; heed it.
   - It is a rung **above** the `backlog` basename special case at `dashboard.sh:93`, which stays
     **untouched**. The 2026-07-18 basename-not-full-path ruling is not reopened.
2. **The resolve-identity interface** (ADR-041 §5) — a way for `fkit-status/SKILL.md` to obtain a
   plan's identity **from `dashboard.sh`**, e.g. a mode that takes a plan path, prints its identity (or
   nothing) and exits. **The exact CLI surface is yours to choose; re-implementing the grammar in
   prose is not an option** — that is ADR-041 §5's binding constraint, and `dashboard.sh:111-125`
   documents in fkit's own file what two grammars for one question cost.
3. **The integer-ordering test** (ADR-041 §1.4). `<N>` compares as an **integer**; ties break absent
   suffix < `a` < `b` < … So `Sprint 10` > `Sprint 9` and `Sprint 4c` > `Sprint 4b` > `Sprint 4`.
   ⚠️ Today's *"highest N"* is applied to a glob's output, which sorts as **text** — `sprint-9.md`
   beats `sprint-10.md`. **Nothing pins this today.** This test is the contract.
4. **The same-identity ambiguity test** (ADR-041 §1.5). Two candidates resolving to the same identity
   → the **lexicographically first path** is selected, **and both the choice and every other claimant
   are stated**. Deterministic *and* loud — a silent pick fails this test.
5. **The empty-eligible-set behavior** (ADR-041 §1.6) — say so, list every `.md` at the top of
   `ai-agents/sprints/` with its resolved identity or `unresolved`, and stop. **Never fall back to a
   `Backlog`-identity board.**

### ⚠️ One decision this brief does NOT make for you — surface it in your plan

ADR-041 §5 leaves the CLI surface to the implementer, and §1.4/§1.5 require **tests**. Those two pull
against each other: **if the surface only resolves one file's identity, the ordering and the
ambiguity flag live in LLM-executed prose and nothing mechanically tests them** — which is exactly the
gap §1.4 names (*"Nothing pins this today"*).

**Choose the surface so that §1.4's ordering and §1.5's ambiguity report are mechanically testable.**
If your plan lands on a surface that leaves either in prose, **say so explicitly and escalate before
building** — do not ship an untested contract and call it pinned.

### Constraints

- ⛔ **Do not edit `claude/skills/fkit-status/SKILL.md`** — the selector rewrite is
  [`0266`](../0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/brief.md).
  This brief builds the interface; `0266` consumes it.
- ⛔ **Do not touch the `backlog` basename special case** (`dashboard.sh:93`) or `STATUS_HEADING_RE`.
- ⛔ **Do not rename `ai-agents/sprints/backlog.md`.** ADR-041 §3 is explicit: its name stays, and its
  href is written into every `➡️ Moved to [Backlog](backlog.md)` marker in the repo.
- ⛔ **Do not reintroduce the glob** in any form, including as a fallback.
- ⛔ No new devDependency (ADR-014). ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit.
- ⛔ **Do not add the downstream pre-release test to verification.** It is Sprint 5's **release gate**
  (owner ruling 2026-08-10, verbatim **"Yes — before the release cut"**), recorded there and in
  `0260`. Cited, not re-recorded.

## Verification steps

1. **ADR-041 reads `accepted`, and `0264` is closed**, before any code is written. State both in the
   worklog.
2. **`sprint-backlog.md` — both halves of ADR-041's compounded defect, measured.** A fixture with H1
   `# Geoconflict — Sprint Backlog` resolves identity **`Backlog`**, reaches the arm at
   `dashboard.sh:772`, and **regains** the *"scheduled but still parked on the unscheduled board"*
   check at `dashboard.sh:796`. Show that check firing on a fixture where it could not fire before.
3. **The residual case is still loud.** A `sprint-backlog.md` whose H1 carries **neither** token
   (`# Unscheduled work`) resolves EMPTY, is **not eligible** as the active sprint, and still emits
   `unresolved-plan-sprint` (ADR-041 §2's stated outcome, and ADR-040 §7's guard).
4. **Integer ordering proves itself red.** Show the ordering test failing against a text sort
   (`sprint-9` vs `sprint-10`), then green.
5. **Ambiguity is loud.** Two files resolving to `Sprint 6`: the lexicographically first is chosen
   **and the other claimant is named in the output**. Assert on the naming, not just the choice.
6. **`Backlog` is never eligible.** A candidate set containing only `Backlog`-identity and unresolved
   files yields the §1.6 empty-set report, not a selection.
7. **This repo's own boards are unchanged.** `ai-agents/sprints/backlog.md` still resolves `Backlog`;
   `sprint-5.md` is still selected as active. Show the before/after.
8. **R7's existing `backlog.md` fixture stays green byte-unchanged**, and ADR-040's T5 still passes.
9. **Full `npm test` green**, including `test/prove-red.sh`.

## Notes

- **Depends on:** `0264` — hard
- **Blocks:** `0266`
- **Why that edge is real:** ADR-041 cannot ship before ADR-040. §2's `Backlog` token **extends
  ADR-040's rung 1**, and §1.5's ambiguity rule builds on ADR-040's two-distinct-tokens refusal. There
  is nothing to extend until `0264` lands.
- **On merit:** immediately below `0264` — it is the second half of the same defect, and on the
  reporting project both halves land on one file (`sprint-backlog.md`).
  ⚠️ **`P12` is an append rank, NOT a merit ranking — flagged for owner confirmation.** A spawned
  producer never re-ranks or inserts mid-board (`/fkit-task-brief` step 5, ADR-035); the owner's
  placement ruling is recorded as a merit statement instead. See Sprint 5's dated addendum.

  ✅ **RESOLVED 2026-08-11 — the flag above is left byte-identical and is now DISCHARGED.** The owner
  confirmed the placement in a live `fkit producer` session and the re-rank was **executed**: this row now
  sits at **`Sprint 5 P5`**, and the append rank is history. **and it is the merit position the statement above names, exactly.** Authority, the verbatim ruling, its channel, and the full old→new rank map are in Sprint 5's
  §"Addendum — the owner-ruled re-rank of 2026-08-11". ⛔ **This is not producer precedent for
  re-ranking** — it was executed only because the owner ruled it in a live session.
- **Line-number citations are dated anchors of convenience** (measured 2026-08-10); the durable
  anchors are the quoted text, and `0264` will have moved every line in `dashboard.sh` before you
  start.
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.
