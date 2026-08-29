# Sprint 7 — Close the ADR-044 oracle window before `0224` and `0225` are pulled

> **Authority, stated first and in full.** This board exists by an **OWNER RULING given 2026-08-29 via
> `AskUserQuestion` in a live `fkit lead` session** — a selection from the question's option list, and
> **the option label is the verbatim text**: **"One-row Sprint 7, then scope it (Rec)"**. The option was
> put to the owner with this description, quoted verbatim: *"Open Sprint 7 holding only 0347, honouring
> your ruling literally, then scope the rest properly in a second pass. The producer's own
> recommendation. Closes the 0224/0225 ordering window now — both are still 🔲 Backlog, so the misroute
> is still live."*
>
> ⛔ **WHAT THAT RULING AUTHORIZES IS EXACTLY ONE ROW.** An **earlier owner ruling of the same day**
> pulled **`0347` alone** into a sprint and left **everything else in the `0337`–`0351` range
> `Unscheduled`** — fifteen tasks, one exception, named by the owner. ⛔ **No agent may add a second row
> to this board on its own judgement, however obviously a companion belongs here.** A row arrives here
> the way this one did: by an owner ruling that names it.
>
> ⚠️ **THIS BOARD IS DELIBERATELY UNFINISHED, AND THAT IS THE RULING, NOT AN OVERSIGHT.** The owner's
> chosen option names a **second pass** that scopes the rest. One row is this board's **opening** state,
> **not** its intended final scope, and nothing here may be read as "Sprint 7 is a one-task sprint."
> See §"⚠️ This board is SCOPED IN PART".
>
> Executed by a spawned `fkit-producer` with **no owner channel**
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which asked nothing and decided nothing beyond the mechanics of the ruling — and the shape choices it
> had to make with no precedent, each declared in §"📐 Where this board's shape comes from" rather than
> made silently.
>
> ⚠️ **This board opens against a gap, not a rollover** — the same way [Sprint 6](done/sprint-6.md)
> did. Sprint 6 was archived **2026-08-29** (`21 done — of 21`) with **no successor clause**, and
> between that archival and this board `select-active` returned `active none` and the project had **no
> active sprint** (measured 2026-08-29: `bash claude/skills/fkit-status/dashboard.sh select-active
> ai-agents/sprints` → `active none`, exit 3, `backlog.md` the only candidate). ⛔ **Sprint 6's banner
> is left byte-identical and is NOT amended to point here.**
>
> ⚠️ **What this board inherits, stated plainly rather than implied.** Sprint 6's own archival banner
> records that **the archival itself carried no owner ruling** and is to be read as agent-performed and
> **not owner-verified**, and its rows closed
> **`✅ Done (agent-closed — not owner-verified)`** ([ADR-033 §5](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
> **Those markers stay on them permanently.** Nothing on this board changes that, and no row here may
> be written up as if it does.

**Goal:** one row, for one reason — **close the ordering window before it closes itself the wrong way.**

1. **`0347` writes the ADR-044 oracle note onto `0224` and `0225` before either is pulled.** Both are
   still unstarted (measured below), so a note is enough and no rework is implied. If either ships
   first, it is built against the **old** oracle and ships the **8-of-13 misroute** ADR-044 §C6
   measured — the exact `## Owner` staffing ADR-044 §Decision 1 replaces.

**Measured 2026-08-29, on disk, for this board.** `0224` and `0225` each read `## Sprint` **`Backlog`**,
`## Priority` **`Unscheduled`**, `## Status` **`🔲 Backlog`**, and both folders sit in
`ai-agents/tasks/backlog/`. ⚠️ **The window is therefore still open and still preventable** — that is
the whole reason this row was singled out. ⛔ **Re-measure before acting on this line**
([`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md)); it is a
claim about a live board and it will go stale.

## ⛔ This board is UNRANKED — and one row is not a rank

**The Priority column is `—`, and `0347`'s brief keeps `## Priority: Unscheduled`.**

The owner ruled this row's **placement**, not its **rank**. With one row on the board a rank would be
arithmetically trivial and **substantively invented** — and it would pre-commit the second pass's
ordering, since board rank is append-only against closed history
([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)):
once this row closes, nothing can ever be ranked above it. **Writing `P1` here would spend a decision
the owner has not made.**

**This is the ordinary path, not a deviation.** [`backlog.md`](backlog.md)'s **"Off:"** rule carries an
**unranked-forward clause** — when the destination board is unranked, the moved row's marker is written
`➡️ Moved to [Sprint 7](sprint-7.md)` with **no `— priority M` suffix**, and *"⛔ Never write
`— priority —`, and never invent a number."* Sprint 6 is the worked precedent that clause was written
from. ⚠️ **The omission is a deferral, not an exemption: if and when the owner ranks this board, the
Priority cell, the brief's `## Priority`, and `backlog.md`'s `— priority P<n>` suffix are all added in
that one act.**

⚠️ **Unenforced, so it is recorded here.** `dashboard.sh` reads a brief's `Status`, `Sprint` and
`Owner`; it **never** reads `## Priority`, and its `moved_target` parser never reads the suffix. Every
statement in this section is documentation truth maintained by hand, not a parser contract.

## ⚠️ This board is SCOPED IN PART — the second pass is owed

**A second pass will scope this board. Write for that, not around it.**

- ⭐ **Adding rows later is the expected path**, and it is an **append** — new rows go **below** this
  one, and this row is **not** renumbered, re-ranked or re-worded to accommodate them (ADR-035).
- ⛔ **A row arrives only by an owner ruling that names it.** Not by an agent's read of the backlog, not
  by "it obviously pairs with `0347`", not by a ship-loop driver noticing spare capacity.
- ⚠️ **The fourteen other rows in `0337`–`0351` are `Unscheduled` BY RULING**, not by omission. Their
  absence here is a decision that has already been taken once; do not re-take it silently.
- ⚠️ **`0345` is the closest such case and is deliberately absent.** `0347`'s own brief names `0345` as
  the task that writes the rule-cell `0225`'s parser will read. It is a **content dependency of the
  note's subject matter, not a gate on writing the note** — `0347` states the dependency in prose and
  ships without it. ⛔ It is **not** on this board.
- **When the second pass runs, this section stays** — it is the record of why the board opened at one
  row, and a later reader must be able to tell a partial scope from a finished one.

## 📐 Where this board's shape comes from — precedent vs invented

**Stated because the shape of an opening board is otherwise indistinguishable from an invented one.**

| Element | Source |
|---|---|
| `# Sprint N — <goal>` H1, identity in the first segment | **Precedent** — every plan, Sprints 1–6; the identity grammar is [ADR-040](../knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md) §2 |
| Authority blockquote first, carrying the verbatim option label | **Precedent** — Sprint 6 as opened, first block of the file |
| "opens against a gap, not a rollover" paragraph | **Precedent** — Sprint 6 as opened, same wording pattern |
| "what this board inherits" paragraph | **Precedent** — Sprint 6 as opened |
| `**Goal:**` + numbered list under the banner | **Precedent** — Sprint 6 as opened |
| Unranked board: Priority column `—`, briefs `Unscheduled`, no `— priority` suffix on the `backlog.md` marker | **Precedent** — Sprint 6 opened unranked on 2026-08-14 and is the case `backlog.md`'s unranked-forward clause was written from |
| `## Status` table, columns `Status \| Priority \| Task \| Brief` | **Precedent** — every plan; it is also `dashboard.sh`'s parsed contract (status = cell 1, priority = 2, brief = last) |
| Task cell carries the Backlog board's filing text **byte-identical**, with a dated note prefixed | **Precedent** — Sprint 6 `P10` did exactly this for the row it carried over |
| `## Notes`, then `## Open questions for the owner` | **Precedent** — Sprint 6 as opened |
| ⭐ §"⚠️ This board is SCOPED IN PART" — a partial-scope declaration and an append rule for the second pass | ⭐ **INVENTED.** No prior board opened partially scoped: Sprints 2–6 each opened with their full contents named in one owner ruling. There is no precedent to copy, and leaving it out would make a deliberately unfinished board read as a finished one |
| ⭐ This table itself | ⭐ **INVENTED.** Sprint 6 declared its **one deviation** in a section; declaring the whole provenance of the shape is a step past that, done because this board had to invent something |
| ⭐ The one-row `**Goal:**` list, and a title naming the window rather than a sprint theme | ⭐ **INVENTED** in the sense that no precedent covers a one-row board. Prior goals summarize a many-row theme; this one states the single hazard, so it will not read as a false theme when rows are appended |

⛔ **No `## Sprint Status` field, and no banner token.** [`0340`](../tasks/backlog/0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo/brief.md)
would introduce one; it is `Unscheduled` and **not** on this board, so inventing the field here would
pre-empt an unshipped design. ⚠️ **Nothing reads a banner as data anyway** — a board is active because
of **where its file sits and what identity it resolves to**
([ADR-041](../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)),
which is why this file lives at `ai-agents/sprints/sprint-7.md`.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | — | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-08-29** — *"One-row Sprint 7, then scope it (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session; the earlier ruling of the same day made this the **one** exception in `0337`–`0351`. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL.** **Note ADR-044's oracle rule onto `0224` and `0225` — read the producing skill, never grep for skill names** — `0224`'s oracle for the worklog `**Role:**` line becomes ADR-044's rule, not the loop table's literal cell; `0225`'s parser must accept a rule-cell (a skill→owner expression) in the Plan/Build cells, which makes its assertion **stronger** *(**follow-on (iii) of [ADR-044](../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) §C2/§C3**, owner ruling **ND6** 2026-08-27; ⚠️ **measured warning both notes must carry (ADR-044 §C6, measured 2026-08-28)**: a grep-for-skill-names oracle would misroute **8 of the 13** producer-owned Backlog rows back to the producer — the exact `## Owner` staffing Decision 1 replaces; brief edits only, ⛔ no source, no board status change, neither folder moves; depends on `0270`)* | [`0347-note-adr-044s-oracle-rule-onto-0224-and-0225`](../tasks/backlog/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md) |

## Notes

- **⛔ This board's row does NOT write `ai-agents/wiki-vault/`.** `0347` edits two task briefs and
  nothing else. Any vault work stays with `fkit-wiki`
  ([ADR-005](../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- **⚠️ `0347`'s `## Owner` is `fkit-producer`, not `fkit-coder`** — verified on disk 2026-08-29 by
  reading the brief. It is a **brief-edit task**: no source, no tests, no board status change.
  ⚠️ **`/fkit-sprint-ship-loop` does not read a brief's `## Owner`**, and
  [ADR-044](../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  §Decision 1 is the rule that staffs it: **the owner, in `skills_for_role()`, of the skill that
  produces the deliverable, with a no-skill deliverable falling to the coder.** ⭐ **`0347` produces
  brief prose, not a skill deliverable — so Decision 1 staffs it `@fkit-coder`**, and that is not a
  misroute. ⛔ **Do not "correct" it to the producer by grepping the brief for skill names** — that is
  precisely the 8-of-13 anti-pattern this very row exists to warn `0224` and `0225` about.
- **⚠️ `0347`'s figures are dated and MUST be re-measured before the notes are written.** The
  **8 of 13** count is ADR-044 §C6, measured **2026-08-28** over a live, changing board. The brief says
  so itself. If it has moved, write the new number and its date; do not copy this one forward
  ([`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md)).
- **⚠️ `0345` is a content dependency of the note, not a gate.** `0225`'s note must *name* `0345` as
  the task that creates the rule-cell, so an implementer does not parse against text that is not there.
  `0345` is `Unscheduled` and not on this board; `0347` ships without it.
- **⛔ `0224` and `0225` do not move.** `0347` appends to their `## Notes` and touches no other field of
  either brief; both stay in `ai-agents/tasks/backlog/`. **Pulling either of them onto a board is a
  separate owner decision** — and doing it *before* `0347` lands is the exact failure this board exists
  to prevent.
- **⚠️ Filing-time state, so a later reader can tell what moved.** At the moment this board opened,
  `backlog.md` read `total 190`, `count backlog 129`, `count done 17`, `count cancelled 1`,
  `count moved 43`; after the one-row move it reads `count backlog 128` and `count moved 44`, with
  `total 190` unchanged. This board reads `total 1`, `count backlog 1`, **no `drift`**, no
  `⟨derive: UNPARSEABLE⟩`. `select-active` returns `active file="sprint-7.md" identity="Sprint 7"`,
  exit 0 — it returned `active none`, exit 3, immediately before. All measured 2026-08-29.

## Open questions for the owner

1. **⭐ OPEN — what else goes on this board?** The ruling that opened it names a **second pass** that
   scopes the rest, and nothing has been scoped yet. ⚠️ **Until that pass runs, this board is one row
   and `select-active` returns it as the active sprint** — a ship-loop driver pointed at it will find
   exactly one eligible row and then run out of board. **Not a defect; the ruled state.**
2. **⭐ OPEN — should this board be ranked when it is scoped?** It is unranked today because one row is
   not a rank. ⚠️ **Ranking is free only while no row is closed**; from the first close onward ADR-035's
   wall applies and a re-rank needs an owner ruling given in that session. **If a rank is wanted, the
   cheapest moment is at the second pass, before anything ships.**
3. **⭐ OPEN — does Sprint 6's banner gain a successor clause pointing here?** It was archived with the
   clause deliberately omitted (there was no Sprint 7 then), and it has been left **byte-identical**.
   Sprints 1–4 each named a successor; Sprint 5 and Sprint 6 did not. ⛔ **Not a blocker for anything on
   this board** — a documentation-truth question only.
