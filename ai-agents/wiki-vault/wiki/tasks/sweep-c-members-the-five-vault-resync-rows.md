# Sweep C's members — the five `fkit-wiki` rows it absorbed and closed: two ADR page resyncs, one log correction, two flag verdicts

**Source**: `ai-agents/tasks/done/0199-wiki-resync-adr-010s-vault-page-after-the-correction-notes/brief.md`; also `done/0212-append-a-dated-log-entry-correcting-the-still-open-framing/brief.md`, `done/0239-wiki-resync-adr-012s-vault-page-after-0232/brief.md`, `done/0317-reconcile-the-vaults-not-ready-to-close-flag-on-0238-with-its-landed-close/brief.md`, `done/0319-discharge-the-vaults-partial-not-ready-to-close-flag-on-0206/brief.md`
**Status**: done — all five `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Backlog board, unranked · worked inside Sprint 7's Sweep C (`0358`), 2026-09-05 · owner `fkit-wiki` on all five

> ⭐ **Ingested 2026-10-24 by task `0380`** (the closed-task backlog Sweep C itself bounded out). One page
> for all five because they were done as **one pass**. The pass itself is
> [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]]; its sixth candidate, `0287`, was excluded
> (blocked upstream) and is still open.

## Goal
Five vault-maintenance rows, each owed because a close elsewhere made something the vault said false —
and only `fkit-wiki` may write the vault (ADR-005), so the role that caused the change could not fix it.

## Key Changes
| Task | What it asked | How it ended (2026-09-05) |
|---|---|---|
| `0199` | ADR-010's vault page said the correction-note fix was *"still open"* and would be a *"one-line"* note; both false after `0143` shipped three note blocks + a header bullet | ⭐ **Page half done.** The page now describes the ADR as it stood after `0195`, `0196`, `0197` and `0171` — **10** dated correction blocks and **four** header site lists, not the five / two its brief expected. The §Decision 5 contradiction is recorded as **history** (2026-07-11 → 2026-08-02, repaired by `0195`). Status stays `accepted`. ⛔ The `log.md` half was **split out to `0212`** by the append-only ruling |
| `0212` | Two frozen 2026-07-26 `log.md` entries still called `0143`'s fix *"still open"* | A new dated `log.md` entry naming both by **page-count roll-up** (161 and 166 pages — two entries share the same date and title), never by line number; the originals byte-identical. Routed here from Sweep B by owner ruling (ADR-005: `log.md` is the vault) |
| `0239` | ADR-012's vault page still named `claude/fkit-claude.sh` as `skills_for_role()`'s home after `0232` corrected the ADR | Resynced against the **landed** ADR (`0232`'s five dated notes), not the brief's plan, following `0199`'s shape |
| `0317` | The vault's last word on `0238` was `partial — not ready to close`, yet `0238` had closed — a **contested** close | ⭐ **Verdict: discharged.** `0238`'s substance is present; its literal acceptance text (*Sprint 3 active*) can no longer be met and was recorded as overtaken. Every remaining old-path site listed with a disposition — 6 files, 26 hits, none a live pointer |
| `0319` | The same flag line on `0206` — but here the deliverable had already been verified present: a **stale** flag | ⭐ **Verdict: discharged**, after `0206`'s five checks were each re-measured present |

⛔ **`0317` and `0319` were kept DISTINCT by owner ruling** — merging them into one "clear both flags"
step would do the wrong act on one of them: reconciling a contested close is not the same as discharging
a stale flag.

⛔ **Every verdict is a new dated `log.md` entry; no past line was edited** — the owner's 2026-08-03
append-only ruling, the same ruling that split `0212` out of `0199`.

## Outcome
- All five emitted `Task <NNNN>'s vault work is complete — ready to close` in the 2026-09-05 log
  entries; each was then closed with the agent-closed marker.
- ⚠️ **The same pass advanced the watermark while bounding out 45 uningested closed tasks** — the
  hazard task `0380` was filed for. These five are among the tasks `0380` found with no page.

## Related
- [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]] — the pass that did the work
- [[tasks/sweep-a-members-the-ten-citation-rot-rows-and-0349]] · [[tasks/sweep-b-members-the-seventeen-correction-note-rows]] — the other two sweeps' members (`0197`, `0232`, `0196` made the changes `0199` and `0239` resynced)
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — the two pages resynced
- [[tasks/append-a-dated-correction-note-to-adr-010]] · [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — `0143` / `0195`, the notes behind `0199`
- [[tasks/the-2026-08-15-done-in-fact-wiki-closes]] — `0206` and `0238`, the closes `0319` and `0317` ruled on
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — `0211`, the sibling log correction ruled together with `0212`
- [[tasks/the-2026-08-13-vault-resync-chain]] — the earlier run of single-day vault resync rows
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why these rows are `fkit-wiki`'s
