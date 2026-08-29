# Record that `0250` discharged `0188`'s D1 — a dated correction note on the brief and its board cell, warning off the reordering

**Source**: `ai-agents/tasks/done/0324-record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Backlog, unranked · ID 0324 · owner `fkit-producer` · run 2026-08-23

## Goal

`0250` fixed the scaffold producer row — and in doing so **silently discharged `0188`'s defect D1**, the identical defect, while **three live records still asserted D1 as open**. This task writes the dated correction notes.

Two owner rulings, both live via `AskUserQuestion`: **"File the producer follow-up (Recommended)"** authorized *filing*; ⭐ **a second ruling, "Apply the correction now (Recommended)", was needed before the notes could be WRITTEN** — a previous spawned producer had correctly refused to edit the board under the first one.

### ⛔⛔ The one failure mode this task exists to prevent

`0188`'s D1 tells a future implementer to *"Repair against `skills_for_role()` as it reads at implementation time"*. **Followed today, that instruction produces a REORDERING** — because the carriers disagree:

| Carrier | Position of `/fkit-task-brief` |
|---|---|
| `claude/skills-for-role.sh`, `producer)` branch | **second** |
| `claude/scaffold/CLAUDE.md`, producer row | **third** |
| `claude/skills/fkit-team/SKILL.md`, producer row | **third** |

`0250` inserted it after `/fkit-status` as a **recorded, reasoned choice** — it satisfies the positional constraint literally, makes the scaffold row **character-for-character identical to its nearest twin**, and is **a pure single insertion with no reordering**.

⛔ **So a later `0188` run that "repairs" D1 would (a) undo a deliberate choice, (b) re-break the twin match, and (c) REPORT SUCCESS while doing it.** The twin match was verified firsthand: both rows carry the identical string.

⭐ **And the reorder would be pointless as well as harmful** — the owner had already ruled *"Accept — order is not normative (Recommended)"*, Codex having verified that **no consumer parses the list order**.

⚠️ **An honest limit was recorded against that second ruling at filing time:** it had been **relayed and not yet written to any file on disk** — a `grep` found only `0250`'s own plan *proposing* such a declaration. ⛔ *"Re-verify it before quoting it as landed. It strengthens the case; it is not the case."*

## Key Changes

**Three dated correction notes**, all marked ⚠️ (drift), **none ⛔** — on `0188`'s D1 section, on its verification step 1, and on the `0188` board cell in `sprint-6.md`.

⭐ **All three premises were re-measured this run before writing** — anchor resolves, quoted fragment present, claim still stale, not already corrected — and the fourth row, **the discharge itself**, was verified present in `claude/scaffold/CLAUDE.md`.

⭐ **The two edit shapes are NOT the same, and the difference is stated rather than smoothed:** the brief sites are **additions-only, `+42 / −0`**; the board cell is a single-line table cell where **additions-only proof was not available** — so the proof is a full board-shape audit instead: line count unchanged, exactly one changed line, `## Status` fields unchanged, the `⟦FACTS⟧` block byte-identical, all 118 `⟨derive:⟩` fields byte-identical, every `depends=` unchanged, and both dashboards exit 0.

⭐ **A false negative from the producer's own measurement is recorded rather than hidden:** a first derive check with `grep -o 'derive[^|]*'` matched the substring *"derive"* inside the prose *"do not re-derive one"* and reported a change. ⚠️ *"A measurement artifact of my own pattern, not a derive change."* Re-measured correctly.

⭐ **Escape-aware pipe counting** confirmed the defective-row set was empty before and after. ⚠️ *"A passing `dashboard.sh` is not evidence of this; the count is."*

## Outcome

### ⚠️⚠️ An ACCEPTED GAP, and it bites harder here than at its precedents

The correction-note form's part 3 is a header `- **Corrections:**` metadata bullet, ⭐ **and that bullet is what justifies placing a note BELOW its claim** — *"the reader is already warned first by the header bullet."* ⛔ **A task brief and a board row have no such header, and no equivalent has been defined** — that is open task `0315`'s question. Following `0318` and `0320`, this run **omitted the bullet and recorded the gap rather than inventing one.**

⛔ **Consequence, stated plainly: a reader who stops at the claim gets no warning.**

⭐⭐ **And the gap is more severe here than at those precedents.** There the corrected text was **testimony** — a reader who missed the note merely believed something stale. ⛔ **Here D1 is a live instruction to ACT**, so a reader who never reaches the note **executes the reordering**, undoes `0250`'s choice, re-breaks the twin match, and reports success.

**Mitigation within the form:** each note sits immediately below its claim with no intervening prose and opens with the discharge sentence; at the D1 section the note is additionally placed **above** the *"Repair against `skills_for_role()`"* instruction it warns off. ⛔ **That is a mitigation, not a fix. The gap is accepted and belongs to `0315`.**

### Out-of-scope confirmations

- ✅ **`0188` was not reopened, re-statused, re-ranked, moved or renamed.** ⭐ **D1 is one of five; D2–D5 remain live**, so `0188` stays `🔲 Backlog` and remains a manifest-regen task.
- ✅ **Nothing in `0250`'s folder was opened for writing** — a reviewer was writing its ledger concurrently.
- ⚠️ **The vault was neither written nor MEASURED.** ⭐ *"That absence is stated, not reported as a zero"* — whether the vault carries the same stale D1 claim was not checked, and any instance routes to `fkit-wiki`.
- ⛔ **Agent-closed:** the producer was spawned with no owner channel, so the ruling authorized **the work, not a verification of it**. *"No human has checked this work."*

## Related
- [[tasks/fix-the-scaffold-producer-row-fkit-task-brief-omission]] — `0250`, whose review finding R1 this discharges
- [[tasks/repair-the-five-live-ownership-fact-defects]] — `0188`, the brief and board cell corrected here
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — §5, why a spawned producer's close is agent-closed
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why the spawned producer had no owner channel
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why a vault instance routes to the wiki role
- [[systems/knowledge-base-structure]] — the dated-correction-note form and the board's derive fields
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — *added 2026-08-29:* the board whose `P9` produced this follow-up, and whose `0188` row cell is one of the three corrected sites
