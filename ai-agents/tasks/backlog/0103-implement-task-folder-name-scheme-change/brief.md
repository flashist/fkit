# Implement the task-folder-name scheme change from the approved design

## ID
0103

## Sprint
Sprint 2

## Priority
104

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ## ⛔ RESCOPED 2026-07-26 — **not** a cancellation candidate. Do not cancel this task.
>
> This brief used to say *"this task may never run"* and *"should be cancelled by the owner"* if 0102
> ruled *keep the number*. **0102 has now ruled, the owner chose Option C, and the cancel clause is
> void.** Option C keeps the prefix **and** creates real implementation work — it is the *priority*
> side that changes, not the folder names. **A reflex cancel is the live risk here**, which is why this
> banner is the first thing in the brief.
>
> **Blast radius is roughly a tenth of the old scope:** no folder renames, no href rewrites, no wiki
> churn. Old scope was *rename 152 task folders*. New scope is *make the folder ID primary in
> `dashboard.sh`, re-render the sprint board's priority cell, normalise the board's link labels, and
> file the convention page*.

The implementation half of the owner's 2026-07-21 observation that a task carries two mismatched
numbers (sprint priority `78` vs folder-ID prefix `0099`). Task
[0102](../../done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md)
decided **what** to change; this task executes it.

**The authoritative source of scope is the decision report — read it before planning:**
[`2026-07-26-decide-task-folder-name-numeric-prefix.md`](../../../knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md),
**§8 "What task 0103 receives"**. This brief restates §8; where the two differ, **§8 wins**.

**The decision, in one line (report §7, Option C):** keep the `<NNNN>-` prefix on task-folder names;
fix the confusion on the **priority** side instead, by finishing the `dashboard.sh` change
[ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
Decision 6 already authorised and never landed, and by rendering the board's priority cell as a
non-integer rank token.

**ADR-029 Decision 5 is upheld, not amended** (report §7.4). The folder name stays authoritative,
`## ID` stays the second carrier, and the `id-mismatch` drift check at `dashboard.sh:630-646` stays.
**No new ADR is needed for this task.**

## What to build

Seven items, from report §8. **Items 4 and 5 are the two most likely to bite in flight — read them
before you touch `dashboard.sh`.**

### ⚠️ Read these two first — they are the mid-flight traps

**A. The documented narration contract at `claude/skills/fkit-status/SKILL.md:299-304` must be
rewritten.** It currently instructs the reader that `<task>` **is** the Priority number:

> *"`<task>` is not always a number. It is the Priority number when the board has one, and the brief's
> filename stem when it does not … **Narrate whichever form you were given** … do not translate it into
> a number."*

Option C **inverts this contract.** It is **prose, not code, so nothing fails if it is missed** — the
skill simply narrates a rule that is no longer true. The report calls this **"the single most missable
item in the handoff."** Dual-home it per
[`dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md) if the scaffold
carries a copy.

**B. `test/dashboard-contract.test.js:1655-1664` will go RED, and that is correct.** The test is named
*"task 68: a numbered sprint plan still keys FACTS by number, not by filename"* and asserts
`drift nonconformance 7` — i.e. that the **priority** wins over the folder. Report §8 item 5, verbatim:

> **Implementing Option C will turn this test red for the right reason. It is not a regression.**
> It encodes the pre-C contract and must be **deliberately re-pointed** to assert the folder ID
> wins, with its name (`:1657`) and its two ⚠️ header comments (`:1655-1656`) updated in the same change.
> A red bar here is the change working. **Do not "fix" it by reverting step 1.**

### The seven work items

1. **`dashboard.sh` — make the folder ID the primary task identity.** Invert `:519` and `:561-562` so
   the folder-name ID prefix is the primary `tid` and the Priority cell becomes the fallback. This
   completes design-report site 5 and ADR-029 Decision 6. **Keep the `?` sentinel and the `set -f` glob
   guard (`:34-40`)** — the design report is explicit that both stay regardless.
2. **Render the priority cell as a rank token.** `P<n>` in the sprint-plan boards. **No parser change
   is needed** — verified by execution (report §6 step 3). Applies to `ai-agents/sprints/*.md` and to
   `fkit-task-brief` / `fkit-producer` so newly written rows use the form.
3. **Tests.** `test/dashboard-contract.test.js` pins FACTS ids that are currently priorities
   (e.g. `:263`); these change meaning under item 1 and must be updated **deliberately, with a
   red-proof** that the new id genuinely comes from the folder.
4. **Rewrite `claude/skills/fkit-status/SKILL.md:299-304`** — see trap **A** above.
5. **Re-point `test/dashboard-contract.test.js:1655-1664`** — see trap **B** above.
6. **Normalise the board's link labels — Option D, owner-ruled into scope** (report §7.1). Option D
   turned out **35% shipped**: of 130 `sprint-2.md` board rows that link a brief, **45 show the folder
   ID in the visible label and 85 hide it in the href** (plus any equivalents among `backlog.md`'s 16
   rows). Normalise all rows to the `` [`NNNN-slug`] `` form so the ID is visible on **every** row.
   **The owner ruled D a complement to C, not a rival** — C makes the two number-spaces typographically
   distinct, D makes the identity visible where the reader already is; C alone leaves 85 rows showing
   no ID at all. **This is label text only — hrefs already resolve correctly and must not be touched.**
7. **Write the convention page, in this same change.** `priority is board rank, never identity`, at
   `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`, **dual-homed** into
   `claude/scaffold/ai-agents/knowledge-base/conventions/` per `dual-home-parity.md`, and added to the
   conventions `README.md` index table. **It was deliberately NOT written by 0102** (report §9), and
   the owner **ratified** that: a convention must be *prescriptive and current*, and filing it before
   `P103` exists would have put all 130 board rows in violation of a rule on the day it was filed.
   **It needs the owner's explicit sign-off** — a new convention is a standing rule on every future
   run, which is a separate consent from the Option C ruling.

**Do NOT** rename any folder, rewrite any href, or touch the wiki vault.

**What this task must not re-decide:** whether to keep the prefix (settled, owner-ruled), and the
accepted consequences in report §1 — folder paths stay long and numbered, and a task keeps two ID
carriers (ADR-029 Decision 8 working as designed).

## Open residuals carried in from 0102 — resolve these here

Report §11 hands three open items to this task:

- **The movers' greps are UNVERIFIED against a `P103` priority cell.** `fkit-task-done` and
  `fkit-task-cancelled` both parse sprint-plan rows to find and rewrite status cells. Report §6 step 3
  verified **`dashboard.sh`'s parser only**. **This task must verify both movers against a `P103` cell
  before the rendering lands** — a mover that stops finding rows is a silent, repo-wide breakage.
- **`P` is one candidate token, not a ruling.** `#103`, `rank 103`, and dropping the integer entirely
  (row order already encodes rank) were **not compared on their merits**. `P103` is recommended only
  because it is confirmed parser-compatible and minimal. **This task may substitute an equivalent
  non-integer token.**
- **ADR-029 Decision 6 currently reads in the past tense** and describes the Priority-cell
  simplification as already done. **It becomes true only when this task lands.** No ADR correction is
  proposed and none was made — editing an accepted ADR is the architect's call, not this task's. If the
  gap must be recorded before this ships, task 0143's dated-correction-note form is the right vehicle.
- **Fallback trigger:** report §11.1 R4 is an accepted residual — the *"drop the sprint-priority number
  instead"* alternative was **never evaluated**. **If `P<n>` proves unworkable here, that alternative
  becomes the live fallback and must be evaluated properly before you improvise** — escalate to the
  owner rather than picking a substitute unilaterally.

## Verification steps

- The change matches report §8 exactly — all seven items, no scope §8 did not sanction.
- `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` exits 0, emits
  `⟦fkit-dashboard v1⟧`, and reports **no new drift** — in particular no `id-mismatch`,
  `missing-brief`, or `relocated` records introduced by the change.
- **A red-proof for item 1:** demonstrate the new FACTS id genuinely comes from the folder name, not
  from the priority cell.
- **`test/dashboard-contract.test.js:1655-1664` is re-pointed, not reverted** — its name and both ⚠️
  header comments updated in the same change, asserting the folder ID wins.
- **`claude/skills/fkit-status/SKILL.md:299-304` no longer claims `<task>` is the Priority number.**
- **Both movers exercised end-to-end against a `P<n>` priority cell** on a scratch task — `/fkit-task-done`
  and `/fkit-task-cancelled` each find and rewrite the row.
- **All 130 `sprint-2.md` board rows (and `backlog.md`'s 16) show the folder ID in the visible label**,
  checked mechanically, not by eye. **Every href still resolves** — labels changed, targets did not.
- The convention page exists in **both** homes, byte-parity per `dual-home-parity.md`, is listed in the
  conventions `README.md` index, and **carries the owner's recorded sign-off**.
- The launcher-contract and dashboard-contract test suites pass.
- **No task folder was renamed and no href was rewritten** — `git status` shows no renames under
  `ai-agents/tasks/`.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 0102 — SATISFIED.** 0102 is closed; its decision report is the spec.
- **A review is worth having**, but the case is weaker than the old scope's: this is ~15 lines of shell
  plus sed passes and test updates, not a mass rename. Item 1 (identity inversion) and the mover
  verification are the parts worth a second pair of eyes.
- **No wiki-vault work.** Option C touches no vault link. The coder may not write
  `ai-agents/wiki-vault/` in any case.
- **No ADR is required.** ADR-029 Decision 5 is upheld; Decision 6 is *fulfilled*, not amended.
