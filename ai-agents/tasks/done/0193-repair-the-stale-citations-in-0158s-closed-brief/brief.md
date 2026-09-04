# Repair the stale citations in `0158`'s closed brief — and the same rank drift in `0162`'s

> **⚠️ Scope extended 2026-08-03 by owner ruling** (`AskUserQuestion`, live `fkit-lead` session,
> 2026-08-02) to cover the identical defect in `0162`'s closed brief — see **§Scope extension** below.
> The folder name `0193-repair-the-stale-citations-in-0158s-closed-brief` predates the extension and was
> **deliberately not renamed** (a rename is a move, and it would rot every inbound reference). **The rank
> did not change: `0193` stays at P171.**

## ID
0193

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-producer

## Context

**Follow-up 4 of [ADR-037](../../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)**
(accepted 2026-08-02). `0158`'s brief carries five stale facts, found during its own run and
**deliberately left in place**: per **ADR-034** they sit in the task's **own record**, not in its work
product, so they are an **accepted residual and were not a close blocker**. `0158` closed on 2026-08-02
with them live. This task is where they get repaired.

**The brief now lives at `ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/brief.md`.**
Editing a closed brief is sanctioned: `0176`'s owner ruling of 2026-08-01 grandfathers frozen historical
records **by name, and the exemption names `done/*/review.md` ONLY** — `done/*/brief.md` is explicitly
not exempt.

### The six defects, each verified first-hand at filing (2026-08-02)

| # | Defect | Verified state |
|---|---|---|
| 1 | The addendum pointer reads `sprint-2.md:245-249` | The quoted *"⚠️ The placement below is producer judgment"* addendum is now at **`sprint-2.md@2026-08-02:1069-1073`** |
| 2 | The same stale pointer is **repeated in the sprint board row** for `0158` | Confirmed live in the row's description text |
| 3 | `## Priority` reads **122**; the board row reads **P123** | Confirmed — `0158` was displaced one place after its owner-ruled placement |
| 4 | `claude/universal-rules.md` cited as the site carrying fkit's precedence vocabulary | **That path does not exist.** The file is `claude/scaffold/universal-rules.md` |
| 5 | `0157` described as *"filed alongside this one"* and open; `0142` as *"check its state first"* | **`0142`, `0157` and `0160` are all closed** — all three folders are in `ai-agents/tasks/done/` |
| 6 | The merit note cites *"immediately below 0142 (P121)"* | The board shows **`0142` at P122** — a bare-rank citation that has drifted, the exact defect `0159` was spent sweeping out |

### Scope extension (owner-ruled 2026-08-02, written in 2026-08-03) — defect 7, in `0162`'s brief

**The same defect as 3, in a different closed brief.** `0162` closed on 2026-08-02 with its rank field
and its board row disagreeing; the close deliberately did **not** repair it and recorded why. The owner
was asked whether to extend this task or leave it, and **ruled: extend `0193`'s scope to cover `0162`'s
brief.** The board addendum that flagged it is `ai-agents/sprints/done/sprint-2.md` §*Addendum — task `0162`
closed and its follow-ups `0202`–`0206` added out of band (2026-08-02)*, final bullet.

| # | Defect | Verified state (re-verified first-hand 2026-08-03) |
|---|---|---|
| 7 | `0162`'s brief `## Priority` reads **127**; the board row reads **P128** | Confirmed. `0162`'s brief `## Priority` field reads `127`; `sprint-2.md:160` is the `P128` row. **P127 is now held by `0150`** (`sprint-2.md:159` → `tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/brief.md`) |

**⛔ Why this is harder than defect 3, and must not be repaired the same way.** `0162`'s brief also
carries a long dated narrative that **reasons from the number 127**, at
`…/0162-…/brief.md:158-169` (re-verified 2026-08-03) — two bullets:

- *"⚠️ Rank authority — owner ruling, 2026-07-29. This task was placed at **P127** on the explicit ruling
  of the owner…"*
- *"⚠️ **P127 is the highest rank reachable** without renumbering closed history — it is not 'top of
  board'."*

So:

- **Changing the `## Priority` field alone leaves the brief internally inconsistent** — the field would
  read 128 while two bullets below it argue about 127.
- **Changing the narrative too is a rewrite of a historical record.** Those bullets are a *record of what
  the owner ruled on 2026-07-29 and of the reasoning offered at the time*. The 2026-07-29 ruling placed
  the task at P127; the drift to P128 happened **afterwards**, by an insertion above it. **The narrative
  was true when written and stays true.**

**Therefore defect 7 is repaired by DATED CORRECTION ONLY — never by rewriting the narrative.** Concretely:

1. Set `## Priority` to **128**, the board value (**the board rank binds**, as step 3 already rules for
   defect 3), and mark it as a dated correction so the previous value is visible.
2. **Append** a dated correction note next to the two P127 bullets recording that the rank has since
   drifted from P127 to P128 by an insertion above it, that P127 is now held by `0150`, and that **the
   bullets' claims are preserved as the historical record of the 2026-07-29 ruling** and are not being
   restated as current fact.
3. **Do not** edit the wording of either bullet, and **do not** re-rank anything. `0162` is a `✅ Done`
   row; the closed-rank immutability rule applies to it in full.

### ⚠️ Conflict flagged, not planned around — `0180` uses defect 6 as its live specimen

`0180` (build the `brief-missing-merit` guard) names `0158`'s *"On merit this belongs at 122"* as **the
live specimen** its guard is measured against — the case that proves the shape check's accepted cost,
because a bare integer slips past a `P<n>`-token check. `0180`'s brief states the trap in terms:
**reshaping the line into canonical form while keeping the bare number makes the guard PASS it.**

**So repairing defect 6 removes `0180`'s specimen, and repairing it badly makes `0180` look green when
it is not.** Two consequences this task must respect:

- **Repair defect 6 in substance, not shape** — remove the bare rank number, do not merely re-word around
  it. A repair that keeps `122` while looking canonical is the failure `0180` predicted.
- **`0180`'s brief must be updated in the same change** if its specimen ceases to exist, or `0180` ships
  citing a case that is no longer on disk.

### Why this is worth a row at all

`0158`'s brief is not inert history: **`0176`, `0180` and `0188` all cite it** — as a residual-citation
site, as a merit-statement specimen, and as a merit anchor respectively. A stale brief that other open
briefs reason from propagates its staleness into their scoping.

## What to build

**Six dated corrections to one closed brief, plus one board-row repair, one coupled update, and — since
the 2026-08-02 owner ruling — two dated corrections to a second closed brief (`0162`, defect 7).** No new
files, no re-ranks, no moves.

1. Repair defects 1, 3, 4, 5 and 6 in
   `ai-agents/tasks/done/0158-…/brief.md`. **Corrections are appended or marked as dated corrections —
   never silent rewrites** (the convention `0159` established and the board records).
2. Repair defect 2 in the `0158` row of `ai-agents/sprints/done/sprint-2.md` — the stale pointer only. **Do
   not touch the row's status cell, its rank, or any other row.**
3. For defect 3, state which value is authoritative. **The board rank binds; `## Priority` follows it.**
4. For defect 6, replace the bare-rank citation with a **relative, non-numeric merit statement** naming
   the neighbour by **folder ID**, per `conventions/priority-is-rank-not-identity.md`. **⚠️ `0178` is
   filing the canonical form and has not shipped** — if it lands first, match its two sanctioned shapes;
   if not, use the relative folder-ID form step 5 already prescribes, and say which you used.
5. **Update `0180`'s brief** to reflect that its specimen has been repaired — either by naming a
   replacement specimen or by recording that the original was fixed and how. Do not delete the trap it
   documents; the accepted cost survives the specimen.
6. **Repair defect 7 in `0162`'s brief** per the three numbered rules in **§Scope extension** — set
   `## Priority` to the board value as a dated correction, **append** a dated correction note beside the
   two P127 bullets, and **leave both bullets' wording byte-unchanged**. No board edit is needed for
   `0162` (the board is the authoritative value here; it is the brief that is wrong). Also update the
   `sprint-2.md` addendum bullet that flagged this as *"unrepaired"* so it no longer says so — that is a
   **status correction to a live flag**, appended and dated, not a rewrite of the addendum's reasoning.
7. **Re-verify every coordinate at implementation time.** ⚠️ **This brief decays.** `sprint-2.md`'s line
   numbers move on every close, and `0158`'s row rank moves on every re-rank. Every number in the table
   above is a snapshot taken 2026-08-02.

⛔ **Out of scope:** any other brief's stale citations beyond `0158` and `0162` (a general sweep is still
not this task, and the `0162` extension is **owner-ruled and specific** — it is not a licence to sweep
every closed brief's rank field); any re-rank;
any file move; any wiki write; any `:NNN` citation written **into** a brief that is not a dated
correction of one.

## Verification steps

1. **All six defects are repaired**, each verifiable by re-running its check: the addendum text is at the
   cited coordinate; the board row carries no stale pointer; `## Priority` matches the board;
   `claude/scaffold/universal-rules.md` is the cited path and it exists on disk; `0142`, `0157` and
   `0160` are described as closed; the merit note carries no bare rank number.
   > ⚠️ **Dated correction — 2026-09-04. Defect 2 was SETTLED, NOT REPAIRED, and this step therefore
   > does NOT pass as literally written.** Owner ruling **H12**, given live via `AskUserQuestion` on
   > 2026-09-03 — the ruling is a selection from an option list, so the option label is the verbatim
   > text: **"A — annotate, don't remove (Rec)"**. The stale pointer in the `0158` row of
   > `ai-agents/sprints/done/sprint-2.md` — the row whose Brief cell links
   > `0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule`, carrying the quoted addendum
   > *"⚠️ The placement below is producer judgment"* — is **annotated in place and left
   > byte-identical**. It was not removed, so this step's clause *"the board row carries no stale
   > pointer"* is **not satisfied, and that is deliberate and owner-ruled, not an escaped defect**.
   > **Six of the seven defects were repaired**; defect 2 is the one that was settled instead.
   > Recorded as deviation **D22** in `0356`'s `worklog.md`. ⛔ **The step above is left
   > byte-identical and is NOT rewritten** — this note annotates it, and the marker is ⚠️ rather than
   > ⛔ because a claim inside this brief drifted, not a decision it records.

2. **Every repair is a dated correction, not a silent rewrite** — a reader can see what the brief said
   before and when it changed.
3. **The board diff touches exactly one row** — `0158`'s — and changes only its description text. `git
   diff ai-agents/sprints/done/sprint-2.md` shows no status cell, no `P<n>` cell, and no other row altered.
4. **No `✅ Done` or `⛔ Cancelled` row was renumbered** — confirmed by the same diff.
5. **`0180`'s brief still documents the bare-integer trap** and names a specimen that exists on disk.
6. **`npm test` stays green** — this touches no source, so a red suite means something else broke.
7. **The diff touches only** `ai-agents/tasks/done/0158-…/brief.md`, `ai-agents/sprints/done/sprint-2.md`,
   `ai-agents/tasks/backlog/0180-…/brief.md`, and — since the scope extension —
   `ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/brief.md`.
8. **Defect 7:** `0162`'s `## Priority` matches its board row (**128**); the two P127 bullets at
   `…/0162-…/brief.md` are **byte-unchanged**; a dated correction note sits beside them; and
   `sprint-2.md`'s *"⚠️ DISCREPANCY, unrepaired"* addendum bullet no longer claims it is unrepaired.
9. **`0162`'s board row is byte-unchanged** — status cell, `P128` cell and description all untouched.
   Confirmed by `git diff ai-agents/sprints/done/sprint-2.md`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Coordinates with `0178`** (canonical merit-statement form) — if `0178` lands first, defect 6's repair
  should use its form. **Adjacency, not dependency:** step 5's relative folder-ID rule is already
  sufficient, so this task does not wait.
- **Coordinates with `0180`** — see the conflict above. **`0180` is not blocked by this**, but the two
  must not be worked independently without one reading the other.
- **⚠️ Scope grew on 2026-08-03; the rank did NOT.** The `0162` extension adds a seventh defect and a
  fourth touched file. Per ADR-035 a spawned producer does not re-rank, and the owner's ruling was a
  **scope** ruling, not a rank one. **On merit the extension does not move this row** — defect 7 is the
  same class as the six already here (wrong in a closed record, not wrong in a running control), so the
  existing merit statement stands unchanged. Flagged so the owner can say otherwise.
- **Run it late.** ⚠️ This brief decays: re-verify every coordinate at implementation time rather than
  trusting the table above.
- **⚠️ Priority 171 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0192`**, at the bottom of the ADR-037 follow-up run and **below
  both clause tasks**, because nothing acts on these seven facts today (six in `0158`, one in `0162`) — they are wrong in a closed record,
  not wrong in a running control. **The one reason it is not lower still:** three open briefs cite this
  brief, so the staleness propagates into live scoping. Filed by a spawned producer with no owner
  channel; per the owner's ruling of 2026-07-27, appending was the only sanctioned option.
