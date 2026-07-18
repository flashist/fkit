# Filter the `/fkit-status` board to open tasks only

## Sprint
Sprint 2

## Priority
65

## Status
🔲 Backlog

## Context

**The owner's ask (2026-07-18):** the `/fkit-status` dashboard should show **only tasks that are not
complete yet** — hide `✅ Done` and `⛔ Cancelled` rows. Interview rulings (2026-07-18, all four
recorded here so the coder does not re-open them):

1. **Keep the roll-up totals line** (e.g. `50 done · 12 backlog · 2 cancelled — of 64`) — rows hidden,
   scope still visible.
2. **Hide `➡️ Moved` rows too** — a third inert state; none in Sprint 2 today, but the skill is generic.
3. **Drifted rows stay visible** — filter on **reconciled** state, not the raw marker. A row whose
   Status cell reads done/cancelled but which the drift facts flag as unresolved (e.g. board-vs-brief
   disagreement, `waiting on owner`) **must still render**. Hiding a drift buries a finding.
4. **Replace, don't switch.** The filtered board **replaces** the single output. No `full`/`all`
   toggle — that would reverse the locked one-skill-one-output ruling
   ([`conventions/one-skill-one-output.md`](../../knowledge-base/conventions/one-skill-one-output.md),
   task 44) and needs a reversal ADR first.

**"Incomplete" = `🔲 Backlog` + `🔄 In progress` + `🚧 Blocked`** — everything except Done, Cancelled,
and Moved (owner-confirmed).

**⚠️ Conscious reversal — do not treat as drift.** The skill today deliberately shows every row
(*"show the dead rows — a board that hides cancelled and moved tasks lies about scope"*) and
`dashboard.sh`'s roll-up *"sums to M by construction."* The owner reverses the show-everything
principle **knowingly**; ruling 1 (keep the roll-up) is the mitigation. The SKILL.md prose stating the
old principle must be **rewritten**, not left contradicting the script.

**Where the change lives:** the board is *"computed, not recited"* — filtering belongs in
`dashboard.sh`'s `⟦BOARD⟧` rendering, **not** in prose telling the LLM to drop rows. The script
already parses all states. Canonical sources: `claude/skills/fkit-status/dashboard.sh` and
`claude/skills/fkit-status/SKILL.md` (the `.claude/` copies are gitignored, init-regenerated; no
scaffold copy of this skill exists).

## What to build

- **`dashboard.sh`:** in the `⟦BOARD⟧` section, omit rows whose **reconciled** state is `✅ Done`,
  `⛔ Cancelled`, or `➡️ Moved`. A row with any drift/nonconformance fact attached (including
  cancelled-without-date) renders regardless of its raw marker. The roll-up totals line keeps counting
  **all** rows, exactly as today. `⟦FACTS⟧` is unchanged — drift facts still report on hidden rows.
- **`SKILL.md`:** update the board description to match — the board shows open work only; scope lives
  in the roll-up line; drifted rows always surface. Remove/rewrite the "show the dead rows" passage so
  skill text and script agree.
- **Tests** (per [ADR-014](../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md):
  `node --test`, zero devDeps): at minimum — a done row and a cancelled row are **absent** from
  `⟦BOARD⟧`; a Moved row is absent; a done-marked row **with drift** is **present**; the roll-up
  totals still count the hidden rows; `⟦FACTS⟧` still reports a fact about a hidden row.

## Verification steps

- Run `bash claude/skills/fkit-status/dashboard.sh` against this repo's Sprint 2 plan: no `✅ Done` /
  `⛔ Cancelled` rows in `⟦BOARD⟧`; roll-up line totals unchanged from the pre-change run; the two
  cancelled-without-date rows (59/60), while that nonconformance stands, **still render**.
- Test suite green, including the new cases above.
- Grep `claude/skills/fkit-status/SKILL.md`: no remaining claim that the board shows every row; no
  output-variant keyword introduced.
- `/fkit-status` in a fresh session renders the filtered board with no toggle.

## Notes

- **Owner: fkit-coder.** One shippable unit — script + skill text + tests land together (a filter the
  skill text contradicts is drift by construction).
- **Depends on: nothing.** **Blocks: task 66** (wiki sync after this change).
- **The four interview rulings above are owner decisions — do not reopen them in planning.**
- **Numbered 65 per append-don't-renumber.** Owner to confirm the ranking.
