# Correct ADR-010's `skillOverrides` claims — the mechanism was retired by ADR-018

## ID
0196

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### The stale claims — two sites, one cause

[ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)
describes the skill lock as implemented by a `--settings` **`skillOverrides`** off-list, in two places:

- **§Context, bullet 2** — *"`--settings` carrying **`skillOverrides`** — every `fkit-*` skill the role
  does not own is set to `"off"`: hidden from the `/` menu **and unrunnable by name**"*.
- **§Decision 2** — *"Role separation is enforced structurally, not by instruction, via both the
  `--agent` tool allowlist and the `skillOverrides` skill lockdown."*

**That mechanism is retired.**
[ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
replaced it with a `PreToolUse` skill-ownership hook. Verified 2026-08-02: the only surviving mention of
`skillOverrides` in `claude/fkit-claude.sh` is a comment reading *"Retired here (task 43 / ADR-018,
replacing ADR-012 §3): the old `skillOverrides` "off" list …"*.

**The user-visible consequence is the sharper half.** *"Hidden from the `/` menu and unrunnable by
name"* is **false today** — under the hook, a skill a role does not own is **visible but blocked**: it
appears, and invoking it is denied. A reader trusting ADR-010 expects a skill they do not own to be
absent, and it is not.

### Why this was excluded from `0143`, and why it is filed rather than folded

Task [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md) appended ADR-010's
first dated correction notes on 2026-08-02. **The owner ruled (Q4, `AskUserQuestion`, 2026-08-02) that
these `skillOverrides` corrections were NOT to be folded in**, so that one pass would not mix two
unrelated causes. `0143`'s shipped §Context note records the exclusion in its own text:

> *"(Separately, and deliberately **not** corrected in this pass: Decision 2's `skillOverrides`
> off-list mechanism was retired by ADR-018 — a drift, not a reversal, and filed as a follow-up so this
> pass does not mix two unrelated causes.)"*

The reviewer's *"excluded scope"* reading of that parenthetical was adjudicated **PARTIALLY CORRECT,
not a defect** (`0143` residual `Q4-scope-fence`); the parenthetical stays as shipped. **This task is
the follow-up that sentence promises.** Do not reopen the exclusion — discharge it.

### It is a drift, not a reversal — and the note must say so

ADR-010 §Decision 2's **decision** — *"role separation is enforced structurally, not by instruction"* —
**is still in force**, and ADR-018 strengthened rather than reversed it: a hook is structural too. Only
the named **mechanism** and the *"hidden … and unrunnable"* description went stale. That is a **⚠️**,
not a **⛔**, and mismarking it would tell readers to stop following a decision that stands.

## What to build

**Dated correction notes appended to ADR-010, in the form `0143` established.** Read `0143`'s three
shipped blocks and its `worklog.md` before writing.

1. **A ⚠️ dated correction at §Context bullet 2**, recording that the `skillOverrides` off-list is
   retired (ADR-018), that the enforcement point today is the `PreToolUse` skill-ownership hook, and —
   stated plainly, because it is the claim a reader acts on — that an unowned skill is
   **visible but blocked**, not hidden. Verify that behaviour first-hand and record how.
2. **A ⚠️ dated correction at §Decision 2**, recording the same mechanism change and stating explicitly
   that **the decision itself stands**: enforcement is still structural, by a different structure. Say
   why the marker is ⚠️ and not ⛔.
3. **The header `- **Corrections:**` bullet updated** to name the newly annotated sites (see the
   exception clause under constraints).

Whether 1 and 2 are one block or two is the architect's call — the cause is single, the sites are two.
Decide and record the reason.

### Hard constraints — inherited from `0143`, non-negotiable

- ⛔ **APPEND ONLY — `+N / −0`.** No existing line of ADR-010 may be edited, reworded, scoped, dated or
  deleted. Prove it with `git diff --numstat` (deletions `0`) and `git diff -U0 | grep '^-'` returning
  nothing, **not by eye**.
  - ⚠️ **The header `- **Corrections:**` bullet is the one exception**, and extending it must be
    justified in the worklog — it is header metadata about the notes, shipped by `0143` under owner
    ruling Q3 as one wrappable metadata item.
- ⛔ **ADR-010's `**Status:**` stays `accepted`.**
- ⛔ **Do not edit `0143`'s shipped parenthetical.** The *"deliberately not corrected in this pass"*
  sentence is a true historical record of that pass and stays byte-identical. This task's note may
  reference it; it may not revise it.
- ⛔ **Do not touch `ai-agents/wiki-vault/`** — ADR-010's vault page is `fkit-wiki`'s (task `0199`).
- ⛔ **Write no new `:NNN` line numbers into ADR-010.** Anchor by heading plus quoted phrase.
- ⛔ **Out of scope, by name:** the §Decision 5 / `skills_for_role()` correction (`0195`); ADR-010's
  remaining stale line-ranges (`0197`); any change to `/fkit-record-decision` (`0198`); the vault
  resync (`0199`); any change to ADR-018 itself.

### Placement, inherited as binding form from `0143`

- **Correction notes go BELOW the claim they correct** — `0143`'s residual `R1-placement`, with its
  recorded rationale. Follow and cite it; do not re-litigate.
- **Two markers only: ⚠️ drifted fact / ⛔ overturned decision.** This task writes **⚠️** at both sites.

## Verification steps

1. `git diff --numstat` on ADR-010 shows deletions **`0`** (with only the worklog-justified header-bullet
   exception), and `git diff -U0 … | grep '^-[^-]'` returns nothing.
2. §Context bullet 2 and §Decision 2 are present, byte-identical to their pre-task text.
3. A dated ⚠️ note sits **below** each corrected claim, cites ADR-018 by name, and names the
   `PreToolUse` skill-ownership hook as today's enforcement point.
4. The note states that an unowned skill is **visible but blocked**, and the worklog records **how that
   was verified first-hand** — an asserted behaviour with no recorded check fails this step.
5. Each note states why its marker is **⚠️** and not **⛔**, i.e. that §Decision 2's decision stands.
6. `grep -n skillOverrides claude/fkit-claude.sh` is re-run at the time of writing and its result
   recorded in the worklog — do not inherit this brief's 2026-08-02 reading.
7. ADR-010's `- **Status:** accepted` line is unchanged.
8. `0143`'s *"deliberately not corrected in this pass"* parenthetical is byte-identical.
9. No file under `ai-agents/wiki-vault/` is modified.

## Notes

- **⚠️ DATED NOTE 2026-08-15 (`0306`) — THE QUOTED COMMENT IN `## Context` HAS SINCE BEEN REWRITTEN.
  The quotation is DELIBERATELY LEFT byte-identical; it is now a quotation of text that no longer
  exists.** `0306` repaired the stale pre-ADR-029 numeral `task 43` across `claude/`.
  - **What this brief quotes** (`claude/fkit-claude.sh`, as it read before 2026-08-15):
    *"Retired here (task 43 / ADR-018, replacing ADR-012 §3): the old `skillOverrides` "off" list …"*
  - **What that comment says today:**
    *"Retired here (`0052` / ADR-018, replacing ADR-012 §3): the old `skillOverrides` "off" list and
    the …"*
  - **`task 43` = `ai-agents/tasks/done/0052-implement-pretooluse-skill-ownership-hook/`** —
    pre-migration `task NN` is the brief's old `## Priority` value, and `0052` carries Priority 43.
    ⛔ **It is NOT `0043-fix-scaffold-knowledge-base-folders`**, which the bare numeral lands on by
    coincidence.
  ⛔ **Nothing about this task's substance changes** — `skillOverrides` is still retired, the comment
  is still the only surviving mention, and ADR-010 still needs the correction. **Re-verify the comment
  first-hand before quoting it again**; do not re-quote the string above as current.
- **Depends on:** nothing.
- **Blocks:** nothing. **Coordinates with:** `0195` and `0197` — all three append to ADR-010; whichever
  lands second or third rebases on what is there, re-runs the `−0` proof against the updated baseline,
  and does not restate the ⚠️/⛔ legend the header bullet already carries. Not blocked on each other;
  must not be worked in parallel on the same file.
- **⛔ SERIALIZATION — recorded 2026-08-02 at `0195`'s close. Read this before scheduling.** The ADR-010
  work runs **strictly serially**, never two at once:
  **`0195` (✅ landed 2026-08-02, `+53 / −0`) → `0196` (this task) → `0197` → `0171` → `0199`.**
  `0196` and `0197` append to the same file, so each needs the prior append already in the tree for its
  `−0` proof to mean anything. `0171` re-anchors the 12 displaced `adr-010:NNN` pointers and must run
  **after all three appends**, or it measures against a moving ADR-010 and re-rots on the next one.
  `0199` (vault resync) runs **last**, so it describes the ADR's final state.
  **This is an ordering constraint, not a `Depends on:`** — the blocker is each other's *file writes*,
  not each other's outcomes. The `## Priority` ranks are append ranks and do not encode this order
  (ADR-035); this note does.
- **⚠️ Rebase target, concrete.** `0195` shipped **two** ⚠️ blocks (§Decision 5, §Context's *"One real
  inconsistency"* passage) **plus a header continuation line** under the `- **Corrections:**` bullet —
  the owner declined editing the existing header line (OQ-1, 2026-08-02) and ruled a **continuation line**
  the form. Follow that form: **append a continuation line, do not edit the existing one.** ADR-010 now
  carries **five** KB-side correction notes in total.
- **No deadline.** Unlike `0195`, this correction carries no re-raise condition. That is why it is a
  separate brief.
- **⚠️ Priority 174 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0195`**, because it is the same act on the same file with the
  same form and no deadline, and doing it immediately after `0195` lets one architect carry the form
  across both without re-reading `0143`'s worklog twice. Filed by a spawned producer with no owner
  channel, which never re-ranks (ADR-035, `/fkit-task-brief` step 5). No existing row was renumbered.
- **`decisions/` is `⛔ never sync`** per
  [dual-home-parity](../../../knowledge-base/conventions/dual-home-parity.md) — no scaffold copy to keep
  in step. Checked at scoping time, per ADR-027 §Decision 1.
- No commit — leave the edit in the working tree.
