# Amend the review ledger's location column to *"heading + fragment where the target is a coordination document"* — owner-ruled 2026-09-02, still unfiled, and it has now bitten three review rounds

## ID
0369

## Sprint
Sprint 7

## Priority
P14

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Owner ruling G1**, given at [`0176`](../../done/0176-build-the-coordination-citation-policy-guard/brief.md)'s
plan gate on **2026-09-02**, live via `AskUserQuestion`. **The option label is the verbatim text:
"A + file follow-up D (Rec)".** `0176`'s plan records the follow-up's content as *"a task amending the
reviewer skill's guidance so its `file:line` column reads…"* and adds: ⛔ *"D is the **producer's to
file** and **does not block this task**."*

⭐⭐ **THIS IS THE OLDEST UNFILED ITEM IN THIS SET.** Ruled 2026-09-02; unfiled for two days across
three review rounds.

### The amendment, verbatim

From [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
[`review.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/review.md):
*"follow-up **D** amends this table's location column to read **"heading + fragment where the target
is a coordination document."**"*

Its current status, verbatim: *"⚠️ **D is owner-ruled but NOT YET FILED and the reviewer skill is NOT
YET AMENDED**, so the skill still says `file:line`; the driver relayed the ruling and the reviewer
judges it correct and complies."*

### ⛔⛔ THE SURFACE IS BIGGER THAN "THE REVIEWER SKILL" — measured firsthand 2026-09-04

⛔ **`0356`'s records do not name the file.** The filing producer located it, and it is **two files,
not one** — the ledger schema is **dual**:

| File | What it is |
|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md` | the **reviewer's write side** — the findings-table header `\| # \| Round \| Sev \| file:line \| Claim \|` |
| `claude/skills/fkit-process-stateful-review/SKILL.md` | the **coder's read side** — the same header, mirrored |

⛔⛔ **AMENDING ONE AND NOT THE OTHER DESYNCS THE LEDGER SCHEMA**, and the two halves must agree or the
coder reads a column the reviewer no longer writes. ⭐ **Precedent for exactly this both-halves
discipline:** [`0209`](../../backlog/0209-add-an-out-of-scope-by-owner-ruling-status-value-to-both-stateful-review-schemas/brief.md).

The same `file:line` instruction also appears in the prose of `claude/skills/fkit-review/SKILL.md`,
`claude/skills/fkit-adversarial-review/SKILL.md`, `claude/skills/fkit-process-review/SKILL.md`, and in
`claude/agents/fkit-reviewer.md` and `claude/agents/fkit-adversarial-reviewer.md`. ⛔ **Decide and
record which of these are in scope — the run must not silently do some and not others.**

⛔ **Edit the canonical sources under `claude/`, never the gitignored `.claude/` copies.**

### Why it bites — the mechanism, not a preference

⛔ *"A coordinate written here would red `test/coordination-citation-policy.test.js`, which does not
exempt open task folders — on the very task whose subject is citation rot."* ⭐ **The reviewer's
default column shape pushes it toward writing exactly the form the guard `0176` shipped forbids.**

⚠️ **And the rule has no teeth today:** *"the reviewer owns its section, so rule 1 is prose I ask it to
honour, not a wall."*

### The three rounds it has bitten — evidenced, not asserted

1. **`0176`'s own review** — its header blockquote: *"⚠️ **G1 friction, recorded because this is the
   first review to run under the rule this task ships.** … it cites by **section heading**, never by
   line, because `…/plan.md:NNN` would red the guard this task just built."*
2. **`0356` round 1** — a standing header note was required.
3. **`0356` round 2** — the same note again: *"⛔ **Locations below are written as heading + quoted
   fragment, never as a path-plus-line coordinate.**"*

⭐ **Each round had to be told the rule by spawn prompt because the skill still says otherwise.**

## What to build

1. **Amend the findings-table location column in BOTH stateful-review schemas** to read
   *"heading + fragment where the target is a coordination document"*. ⛔ **Both halves in the same
   change** — the reviewer's and the coder's.
2. **Decide, and record, the scope beyond the two schemas.** For each of the other reviewer-side
   `file:line` sites listed above: in or out, with a reason. ⛔ **A site with no verdict is an
   unfinished decision, not an implicit "leave it".**
3. **Keep the source-file case legal and say so.** ⛔ The amendment is scoped to **coordination
   documents**; `path:NNN` into a **source file** stays correct (`0176`'s ruling **G3**, and row 1 of
   the convention). ⚠️ **An amendment that bans the form outright is wrong and would break every
   legitimate source citation.**
4. **Update the dual-homed twin if the file has one**, per [ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
   — the parity test will red otherwise.

⛔ **Out of scope:** changing what the guard `0176` shipped scans; widening the guard's target class
(a separate costing row); editing any existing `review.md`; `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. **Both** stateful-review schemas carry the amended column, and their headers still match each other
   byte-for-byte in shape. ⛔ A diff touching one fails this task.
2. Every other `file:line` site named in the Context has a recorded **in/out verdict with a reason**.
3. The amended wording **preserves the source-file case** — a reviewer citing `claude/…:NNN` is still
   correct under it.
4. `npm test` passes, **including the dual-home parity check** — ⚠️ these are `claude/` files and some
   are dual-homed.
5. `bash test/prove-red.sh` still passes its named mutations.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing — but every future review round pays the friction until it lands.
this belongs high among the process rows: it is owner-ruled, two days unfiled, and it has now cost three review rounds a manual workaround each — the cheapest item here with the most repeat cost.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⚠️ **Adjacent, same class, different file:** [`0172`](../../backlog/0172-narrow-the-architect-output-format-path-line-mandate/brief.md)
  narrows the **architect's** `## Output format` `path:line` mandate, which currently mandates the
  banned form. ⛔ **Neither gates the other**, but they should use the **same wording** — whoever runs
  second should read the first and match it, or say why not.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
