# Wiki re-ingest the amended ADR-032 and clear its now-wrong STALE banner

## ID
0148

## Sprint
Sprint 2

## Priority
128

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

Task 0118 landed the **2026-07-22 autonomy amendment** on the live
[ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
(`## Amendment — 2026-07-22`, +161/−0, Decisions 1-8 untouched). **The vault has not caught up**, and its
copy now carries a banner that is factually wrong. Both verified against the tree on **2026-07-26**:

| Site | State today | Why it is wrong |
|---|---|---|
| `ai-agents/wiki-vault/wiki/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md` | `grep -c "Amendment — 2026-07-22"` → **0** | the vault's ADR-032 page does not contain the amendment at all |
| same file, `:9` — the `⚠️ STALE` banner | *"a SECOND amendment is missing from this ADR… a **2026-07-22 autonomy amendment that was never written**… Task `0118` will land it (still 🔲 Backlog)"* | **false on both counts**: the amendment now exists, and 0118 is closed (`✅ Done (agent-closed — not owner-verified)`, in `tasks/done/`) |

The banner was itself a deliberate, owner-authorized one-line widening during 0117's review (recorded at
`ai-agents/tasks/done/0117-wiki-ingest-lead-conductor-and-adrs-031-032/review.md:33`) — a **pointer
standing in** for the missing text until it landed. It has now outlived its purpose: a reader who trusts
it is told the amendment does not exist, when it does.

**These are one unit of work on one file, so they are one task.** Filed as two candidate follow-ups
during the 2026-07-26 sprint-loop run and **merged here** — ingesting the amendment and removing the
banner that says it is missing are the same edit to the same page; splitting them would produce two tasks
racing over one file.

**Scope boundaries — checked, no overlap with the three live wiki tasks:**

- **0117** (`✅ Done`) ingested ADR-031/032 + the design report, but ingested the **un-amended** ADR-032
  with the staleness banner standing in — by an explicit owner ruling to ship ahead rather than wait. This
  task finishes what that ruling deferred.
- **0126** (`🔲 Backlog`) owns **ADR-033** and the ADR-025-reversal pages, and says so explicitly in its
  own scope-boundary note. It does **not** own the 2026-07-22 autonomy amendment.
- **0141** (`🔲 Backlog`) owns the lead-rename / menu-reorder pages. Unrelated.

## What to build

Via `/fkit-wiki-ingest` (or a `/fkit-wiki-sync` that picks up the delta), update `ai-agents/wiki-vault/`:

- **Ingest the 2026-07-22 amendment** into the vault's ADR-032 page — A1 (Build-worker carve-out),
  A2 (Process-review-worker autonomy under ADR-019 discipline, **including its worklog audit obligation**),
  A3 (the accepted cost: prose-enforced trust, not a structural guarantee), A4 (the do-not-re-raise guard).
  **A3 must not be softened into a guarantee** — the ADR says so in its own text.
- **Remove or rewrite the `⚠️ STALE` banner** at `:9` so it no longer claims the amendment is missing or
  that 0118 is Backlog. Whether the page keeps a dated *"amended 2026-07-22 and 2026-07-23"* marker in
  place of the banner is the wiki role's editorial call.
- **Re-point the `0118` reference** if the page links the brief — it now lives at
  `ai-agents/tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md`. The movers
  deliberately do **not** sweep the vault (ADR-005), so any vault link rot from that close is this
  role's repair.
- **Sweep the sibling pages that carry the substance meanwhile.** The banner says *"the substance is
  recorded meanwhile on [[tasks/build-fkit-sprint-ship-loop-skill]]"*; `wiki/log.md` and
  `wiki/tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop.md` also mention `0118`.
  Reconcile each so none still asserts the amendment is unwritten. **Treat the list as a floor, not a
  ceiling — re-sweep.**
- **Historical task pages:** where a stale claim sits on a page that is a *record of what was true then*,
  apply whatever rule the wiki role settles for historical vault pages (the same question 0141 raises and
  leaves open). **Decide and state it; do not resolve it silently.**

## Verification steps

1. `grep -c "Amendment — 2026-07-22" ai-agents/wiki-vault/wiki/decisions/adr-032-*.md` returns **≥ 1**,
   and the page describes A1-A4.
2. `grep -n "STALE" ai-agents/wiki-vault/wiki/decisions/adr-032-*.md` returns **no** banner claiming a
   second amendment is missing or that 0118 is Backlog.
3. No vault page still asserts the 2026-07-22 autonomy amendment was never written, or that
   `claude/agents/fkit-coder.md`'s citation of it is dangling. (It resolves now.)
4. Any vault link to the 0118 brief resolves to `ai-agents/tasks/done/…`.
5. The vault's rendering of **A3** still reads as accepted, unenforced, prose-level trust — not as a
   structural guarantee or a hook-enforced check.
6. `/fkit-wiki-lint` is clean — no broken links or template drift introduced.
7. **No change** to `ai-agents/knowledge-base/` from this task. The live ADR is the source; the vault is
   the copy.

## Notes

- **Owner:** fkit-wiki — the **exclusive** write gateway for `ai-agents/wiki-vault/` (ADR-005). No other
  role may make these edits, which is why this is a task and not an inline fix.
- **Depends on:** nothing. 0118 (the amendment) is closed and the text is in the tree.
- **Blocks:** nothing.
- **Merged from two candidates** (re-ingest, and clear-the-banner) — same page, same edit, one task.
- **Relationship to 0147:** 0147 implements A2's worklog obligation in the driver. This task ingests A2 as
  **written** — including its own blockquote that the requirement is *stated but not yet implemented*. If
  0147 lands first, ingest the amended reality; if not, ingest the gap as the ADR records it. Either way,
  **do not paper over the distinction** between what A2 requires and what the code does.
- No commit — leave the vault edits in the working tree.
