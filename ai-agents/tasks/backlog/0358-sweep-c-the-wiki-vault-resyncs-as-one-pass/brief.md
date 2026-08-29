# Sweep C — the five wiki-vault resyncs as ONE pass, with `0317` and `0319` kept DISTINCT inside it

## ID
0358

## Sprint
Sprint 7

## Priority
P10

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

> ## ⭐ AMENDED 2026-08-29 — THIS PASS CARRIES **SIX** MEMBERS. `0212` JOINED BY OWNER RULING.
>
> **Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session**, relayed by a
> spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
> **[`0212`](../0212-append-a-dated-log-entry-correcting-the-still-open-framing/brief.md) joins this
> sweep.** [Sweep B (`0357`)](../0357-sweep-b-the-single-site-correction-notes/brief.md) had routed it
> out as vault-owned work and left the destination to this task's step 1; ⛔ **step 1 no longer rules
> it — the owner has.**
>
> ⛔ **THE H1 AND THE FOLDER NAME STILL SAY "FIVE" AND ARE LEFT BYTE-IDENTICAL.** They are the record of
> how this row was filed, and a task's identity is its folder's `NNNN` prefix, never its title
> ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
> ⭐ **Read the member table below as the membership, not the title.**
>
> ⚠️ **`0212` DIFFERS IN KIND FROM THE OTHER FIVE, and that is why it is named separately rather than
> folded into the resync list.** The five are **page resyncs** — a vault page disagrees with the tree
> and is brought back into agreement. `0212` is an **append to `ai-agents/wiki-vault/log.md`**: one new
> dated entry correcting a `"still open"` framing in two frozen past entries, which are left
> byte-unchanged. ⛔ **Same role, same write surface, different act** — the `0317`/`0319` reasoning
> below applies to it in full.
>
> ⛔ **The three-sweep total is unchanged at ~38.** It moves from `13 + 20 + 5` to `13 + 19 + 6`.

### ⛔ READ THIS FIRST — THIS TASK ABSORBS FIVE EXISTING ROWS. IT DOES NOT SIT BESIDE THEM.

**All five vault resyncs are already on the board as separate open briefs**, every one of them owned
by `fkit-wiki`. A sweep filed *alongside* them would duplicate all five rather than complete them. ⛔
**It is filed instead as the row that DOES their work in one pass and CLOSES them.**

This task's deliverable is **two things, not one**:

1. the vault brought into agreement with the tree, in one pass, verified; **and**
2. **every absorbed row closed** — via the producer, per
   [ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md),
   each carrying the **`(agent-closed — not owner-verified)`** marker (ADR-033 §5).

⭐ **Those closes are owner-authorized in advance.** Owner ruling, 2026-08-29, `AskUserQuestion`, live
`fkit lead` session — option label, verbatim: **"Accept the 25 marked closes (Rec)"**.

⛔ **BUT THE MOVERS ARE PRODUCER-ONLY.** This task **never** runs `/fkit-task-done` or
`/fkit-task-cancelled` and **never** moves a task folder. Its terminal act is to hand the producer the
exact list with an outcome and reason per row (ADR-033).

### ⭐ WHY THIS ROW IS `fkit-wiki`'s AND NOBODY ELSE'S

[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md):
**reads of `ai-agents/wiki-vault/` are decentralized; writes are exclusively `fkit-wiki`'s.** Every
one of the five members writes the vault. ⛔ **This is a wall, not a routing preference.** No coder
pass, no producer pass, and no other Sprint 7 sweep may absorb these rows — Sweep A and Sweep B are
both explicitly barred from vault writes and route their vault findings here.

### The members — all confirmed open in `ai-agents/tasks/backlog/`, 2026-08-29

⭐ **Six, not five, since the ruling above.** The heading previously read *"The five members"*.

| ID | `## Owner` | Kind | What it does |
|---|---|---|---|
| `0199` | `fkit-wiki` | resync | ADR-010's vault page — its *"still open"* and *"one-line note"* claims are both now false |
| `0239` | `fkit-wiki` | resync | ADR-012's vault page, after `0232` corrects the ADR's stale coordinates |
| `0287` | `fkit-wiki` | resync | the vault's Codex-sandbox `read-only` pages, after `0273` moves the call sites to `workspace-write` |
| `0317` | `fkit-wiki` | reconcile | the vault's `partial — not ready to close` flag on `0238`, **reconciled** with its landed close |
| `0319` | `fkit-wiki` | discharge | the vault's `partial — not ready to close` flag on `0206`, **discharged** — a STALE flag, not a contested close |
| ⭐ `0212` | `fkit-wiki` | **append to `log.md`** | ⭐ **JOINED 2026-08-29 BY OWNER RULING** — one **new dated entry** at the bottom of `ai-agents/wiki-vault/log.md` correcting the `"still open"` framing that two frozen 2026-07-26 `ingest (sync)` entries carry about `0143`'s fix. ⛔ **Not a resync, and not a page edit** |

⭐ **`0212`'s own constraints survive the merge intact — quote them and honour them, exactly as step 4
of Sweep B requires of its members.** Re-read `0212`'s brief; the four that bite hardest:

- ⛔ **APPEND-ONLY, ON A STANDING OWNER RULING OF 2026-08-03.** A wiki run may **never** edit or
  annotate a past `log.md` entry in place. The two entries it corrects stay **byte-identical**;
  `git diff ai-agents/wiki-vault/log.md` must show **zero deletions**.
- ⛔ **ANCHOR BY PAGE-COUNT ROLL-UP, NOT BY LINE NUMBER.** There are **two** 2026-07-26 `ingest (sync)`
  entries and the date alone does not disambiguate them — one roll-up reads **161 pages**, the other
  **166**. ⛔ **Write no `:NNN` coordinate anywhere**
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
- ⛔ **DO NOT LET IT ABSORB `0199`.** `0212` is `log.md` **only**; `0199` keeps the ordinary-vault-page
  half (`index.md` and the ADR-010 vault page). ⚠️ **Both are now members of this one pass, which is
  exactly the condition under which they get collapsed.** Two members, two acts, two report lines.
- ⚠️ **`0211` has already shipped** — verified 2026-08-29, `ai-agents/tasks/done/0211-…`, status
  `✅ Done (agent-closed — not owner-verified)`. Its entry is therefore **already in `log.md`**.
  `0212`'s brief forbids restating `0211`'s subject (old-form completion-flag paths); ⛔ that is now a
  live constraint against an existing entry, not a hypothetical.
- ⚠️ **`0212` says to re-derive its set at run time** — `grep -rn "still open" ai-agents/wiki-vault/log.md`
  — and to correct **only** the hits asserting `0143`'s fix is unshipped. ⛔ The other hits are correct
  as written and are left alone.

### ⛔ `0317` AND `0319` STAY DISTINCT INSIDE THIS PASS — THIS IS AN OWNER RULING, NOT AN OPTIMIZATION

**Owner ruling, 2026-08-29, `AskUserQuestion`, live `fkit lead` session — option label, verbatim:
"File its own row (Recommended)".** The reason the owner gave, quoted: they **"DIFFER IN KIND"**.

They look identical — both clear a `partial — not ready to close` flag on a vault page — and that
surface similarity is exactly the trap:

- **`0319` is a STALE FLAG.** The flag was correct when written and the condition it named has since
  been satisfied. The act is a **discharge**: record that the gate is met, and clear it.
- **`0317` is a RECONCILIATION.** The vault and the tree **disagree** about whether `0238`'s close
  landed. The act is to establish which is right and bring them into agreement — and that may mean
  the vault is right.

⛔ **Merging them into one "clear both flags" step performs the wrong act on at least one of them.**
Inside this pass they are **two separately reasoned, separately verified, separately reported units**,
and the close list names each with its own outcome. ⭐ **One pass is a scheduling decision; it is not
a licence to collapse two different acts into one.**

## What to build

**One vault pass**, run with the wiki role's own procedures —
[`/fkit-wiki-sync`](../../../../claude/skills/fkit-wiki-sync/SKILL.md) to detect the delta and
[`/fkit-wiki-ingest`](../../../../claude/skills/fkit-wiki-ingest/SKILL.md) to write it, with
[`/fkit-wiki-lint`](../../../../claude/skills/fkit-wiki-lint/SKILL.md) as the health check after.

### Steps

1. **Freeze the membership.** Confirm all **six** are still open and still needed.
   ⛔ **`0212`'s membership is OWNER-RULED (2026-08-29) and is NOT this step's to decide.** ⚠️ This
   step previously read *"⛔ Rule explicitly on whether **`0212`** joins … In or out, with a reason."*
   That question is answered: it joins. **What this step still does with `0212` is the same check every
   other member gets** — confirm it is still open, still needed, and its claim still reproduces. ⛔ If
   it does not reproduce, it is closed `⛔ Cancelled` with that reason like any other member; that is
   not re-taking the routing decision.
2. **Re-verify each member's claim firsthand, against the vault page it names.** ⛔ Do not inherit.
   ⚠️ Several members depend on upstream work: `0239` waits on `0232`, `0287` waits on `0273`.
   **Check each upstream has actually landed.** A resync run before its upstream lands writes a page
   that is wrong in a new way. A member whose upstream has **not** landed is reported as **still
   blocked** and is ⛔ **not** closed.
3. **Do `0317` and `0319` as two separate units**, per the ruling above — separate reasoning, separate
   verification, separate report lines. ⛔ Never a shared step.
   ⛔ **The same applies to `0212` against `0199`, and to `0212` against the resyncs generally.**
   `0212` is an **append** to `log.md` under a standing append-only ruling; the resyncs **rewrite pages**.
   ⛔ A single "brought the vault up to date" step performs the wrong act on `0212`.
4. **Run the pass** — sync, ingest, lint. Report what each stage changed.
5. **Report every vault finding routed here by Sweep A and Sweep B**, whether or not it was in scope
   to fix. ⭐ **Measured 2026-08-29 the vault holds ZERO broken markdown links under the convention-correct
   reading** — a naive matcher reports 13, and **all 13 are inside inline code spans** (quoted marker
   text, not links). ⛔ **Do not scope work against the 13.** Re-measure under `0353`'s settled
   condition and report the real number; anything genuine is out of every other role's reach and this
   is the only row that may touch it. Fixing is **not** in scope unless step 1 rules it in.
6. **Hand the producer the close list** — one line per absorbed row: ID, outcome (`Done`, `Cancelled`,
   or **still blocked → stays open**), and reason.

⛔ **Constraints:**

- **⛔ Do not run `/fkit-task-done` or `/fkit-task-cancelled`, and do not move any task folder** (ADR-033).
- **⛔ Do not write source, tests, task briefs, or any sprint/backlog board.** This row's entire write
  surface is `ai-agents/wiki-vault/`.
- **⛔ Do not close a member whose upstream has not landed.** Report it as still blocked.
- **⛔ Do not collapse `0317` and `0319`.** Owner-ruled.
- **⛔ No `path:NNN` citations in the vault pages this pass writes**
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
- **⛔ No secrets in any vault page.**

## Verification steps

1. `git diff --stat` shows changes **only** under `ai-agents/wiki-vault/`, plus this task's own folder.
   ⛔ Zero changes under `claude/`, `test/`, `ai-agents/tasks/`, `ai-agents/sprints/`,
   `ai-agents/knowledge-base/`.
2. The frozen membership list exists in the worklog **before** any write, and it carries **six**
   members. ⛔ It records `0212` as **owner-ruled in on 2026-08-29**, not as a routing decision this
   task took. *(This step previously read "with an explicit ruling on `0212`".)*
3. Each of the **six** members is re-verified firsthand against the vault site it names, and the
   finding recorded per member — reproduced, already-fixed, or still blocked.
   **For `0212`: `git diff ai-agents/wiki-vault/log.md` shows ZERO deletions** — append-only proved by
   the command, not asserted — and `grep -nE '\.md:[0-9]' ` over the diff returns nothing.
4. **For `0239` and `0287`, the upstream check is shown**: state whether `0232` and `0273` have landed,
   with the evidence. ⛔ If either has not, that member is reported **still blocked** and stays open.
5. **`0317` and `0319` each have their own reasoning, their own verification and their own report
   line.** ⛔ A single shared "cleared both flags" line has failed this verification — quote the
   owner's *"DIFFER IN KIND"* ruling in the report and show how it was honoured.
   **`0212` and `0199` likewise have their own report lines**, and the report states which half of the
   old `0199` scope each one carried (`log.md` vs the ordinary vault pages).
6. `/fkit-wiki-lint` runs clean after the pass — broken links, stale claims, missing back-links,
   template drift. Report the counts before and after.
7. The 13 vault-internal broken links measured 2026-08-29 are **reported with a current count**,
   whether or not they were fixed.
8. **`git status` shows no task folder moved** and no board row flipped to `✅ Done` or `⛔ Cancelled`
   by this task. The close list is a **hand-off**, and the report says so.
9. `npm test` passes. Report the counts.

## Notes

- **Depends on:** `0354`, `0176`, `0237` — ⛔ **all hard, as the gate.** ⚠️ Also, **per member**:
  `0239` depends on `0232`, `0287` depends on `0273`. Those are the members' own upstreams; step 2
  checks them and does not assume them.
- **Blocks:** nothing.
- ⛔ **THE HARD GATE.** `0354`'s `test/reference-integrity.test.js` and `0176`'s
  `test/coordination-citation-policy.test.js` must both be **green before this pass starts** — the
  owner-agreed *"verified, not trusted"* constraint. See
  [`sprint-7.md`](../../../sprints/sprint-7.md) §"⛔ THE FORCED SEQUENCING".
  ⚠️ **Note the honest edge:** both guards **exempt `ai-agents/wiki-vault/`** (ADR-005), so neither
  guard verifies this pass's own output. **`/fkit-wiki-lint` is what verifies this pass**, and step 6
  is not optional. Stated so the gate is not mistaken for coverage it does not give.
- ⛔ **This task closes nothing itself.** Every close is the producer's act, via the movers, carrying
  `(agent-closed — not owner-verified)` (ADR-033 §5). The marker is permanent.
- ⚠️ **This is the one Sprint 7 row that writes the vault, and the only one that may.** Sweep A and
  Sweep B are both explicitly barred and route their vault findings here.
- ⭐ **`0212` is a member as of 2026-08-29, by owner ruling** — see the amendment banner at the top of
  `## Context`. Sweep B (`0357`) routed it out and its brief now names this task as the destination and
  the ruling as the authority. ⛔ **It is on THIS task's close list, and on no other.**
- **Priority `P10` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner rulings *"Approve all 12 as proposed (Rec)"*, *"Accept the 25
  marked closes (Rec)"* and *"File its own row (Recommended)"* (the `0317`/`0319` distinctness), all
  2026-08-29, `AskUserQuestion`, live `fkit lead` session.
</content>
