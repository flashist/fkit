# Document how `Depends on:` lines are read in the dependency-declaration-form page

## ID
0501

## Sprint
Sprint 10

## Priority
P21

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.

**Owner ruling, 2026-10-09, AskUserQuestion in the `fkit-lead` session**, on task `0494`'s Q2
(*"Should the dependency-format rules page also be updated with how soft dependencies are marked?"*),
selected verbatim: **"Not now; follow-up brief (Recommended)"** (option text: *"One sentence goes in the
new step instead; file a small Backlog brief to update the page later. No knock-on: nothing waits on
it."*). This is that follow-up brief.

**The gap.** Task `0492` taught the board renderer (`dashboard.sh`) to **read the IDs** on a
`Depends on:` line and to tell **soft** from **hard** dependencies, for its new
`drift depends-on-later-sprint` record. Those reading rules are written down in three places today —
`0492`'s plan (§3 *"Hard vs soft, and reading IDs"*), `0492`'s worklog decision log (decisions 5 and 6),
and one sentence in `fkit-status/SKILL.md`'s `depends-on-later-sprint` entry (*"Only 4-digit task IDs
on the `Depends on:` line are read, and an ID the line marks soft is skipped."*). They are **not** in
`dependency-declaration-form.md`, the page that calls itself the form's *"single documented home"*.
`0494` adds one soft-marking sentence to `/fkit-task-brief`'s new step instead (per the ruling above);
this task carries the full rules to the page.

**Why it was deferred, and what it costs** (the owner ruled with this cost in view):
- The page has **two homes** that must be edited together — `ai-agents/knowledge-base/conventions/`
  and `claude/scaffold/ai-agents/knowledge-base/conventions/` (see `dual-home-parity.md`: *"must be
  edited in both, in the same change"*). The two copies are **not** byte-identical today: the scaffold
  copy uses neutral example IDs (`0042`–`0044`) and drops fkit's own task history. Keep that shape —
  same rules in both, scaffold wording neutral.
- The **scaffold copy is hashed** in `claude/structure-manifest.tsv`, so the manifest must be
  regenerated (`npm run generate:manifest`, per `CONTRIBUTING.md`: *"rebuilds
  claude/structure-manifest.tsv"*), and an edit under `claude/scaffold/` needs **one full `npm test`**
  (CONTRIBUTING's change table: *"anything under `claude/scaffold/`"* → *"`npm test` (~12 min)"*).
- **Every fkit user's `/fkit-heal`** will then offer this page as an update. That is the intended
  effect, but it is a visible change for every consuming project.

## What to build

Add a short section to `dependency-declaration-form.md` — **both homes, same change** — that states how
the board reads a canonical `Depends on:` line. Take the rules from `0492` (plan §3, worklog decisions 5
and 6, review residuals) and match the wording `0494` lands in `/fkit-task-brief`'s new step. The
section says:

1. **Only exact 4-digit task IDs are read** (`0110`, not `110`, `T-023`, `ADR-0xx`, or a date such as
   `2026-09-13`). An ID with no task folder is skipped.
2. **How to mark a soft dependency:** write the ID, then **`— soft, not hard`**. A soft ID is skipped
   by the later-sprint check (`drift depends-on-later-sprint`). Anything not marked soft is read as
   **hard**. `soft` / `hard` are matched as **whole words** only — `software` or `Microsoft` do not
   count (`0492`'s round-1 fix, R1).
3. **The bold-italic canonical form works:** in `- **Depends on: task 0072** — soft, not hard.`, the
   text **after** the closing `**` counts for soft/hard (`0492`'s tail-mode fix, worklog decision 5).
   The page's own existing example is exactly this line, so the section can point at it.
4. **Known misses**, stated plainly so a writer avoids them:
   - the soft/hard word written **before** the ID (`soft: 0110`) reads as **hard** (over-flags — safe);
   - ranges like `0485–0491` are **not** expanded;
   - a negated `(not soft)` reads as **soft** (the quiet direction — the one to avoid);
   - (live copy only, optional) a task-folder slug inside a link that contains `soft` would read soft.
5. Keep the existing sections (*Why this exists*, *The guard*, *Rules*) unchanged apart from the minimum
   needed to fit the new section in.
6. Regenerate `claude/structure-manifest.tsv`.

Do **not** change `dashboard.sh`, the reading rules, or any test fixture's behaviour: this is a
documentation task. If writing it down exposes a rule that looks wrong, record it as a finding — do not
fix it here.

## Verification steps

1. Both copies of `dependency-declaration-form.md` carry the new section, with the same four rule
   groups above; the scaffold copy uses neutral example IDs and no fkit task-history references.
2. Every rule in the new section matches `dashboard.sh`'s actual behaviour: show, in the review, each
   example line from the section run through the board (a fixture or a scratch board) with the result —
   soft line → no `depends-on-later-sprint` record; hard twin → record; `software` line → record.
3. The soft-marking wording agrees with `/fkit-task-brief`'s step added by `0494` (quote both in the
   review).
4. `claude/structure-manifest.tsv` regenerated; `test/structure-manifest.test.js` and
   `test/dual-home-parity.test.js` pass.
5. One full `npm test` passes (required by CONTRIBUTING for any edit under `claude/scaffold/`).

## Notes

- **Depends on:** 0492 (done) and 0494 — soft, not hard.
- **Blocks:** nothing.
- **Why the second link is soft:** the first task is done and supplies the rules. The second is in
  progress; its new `/fkit-task-brief` step's soft-marking sentence should land first so this page can
  match its wording, but nothing here truly needs it — if it stalls, write the page from the rules
  and let that step match the page. (The `Depends on` line above is itself written in the soft form
  this task documents.)
- **Knock-on:** on the Backlog board, nothing waits on it; it waits on no sprint.
- **Placement:** Backlog board, unranked (`—`), per the owner's *"follow-up brief"* ruling. Pull it into
  a sprint when the owner gives the word; it is a natural companion to whichever sprint `0494` closes in.
- Filed 2026-10-09 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner ruling
  quoted in *Context*. Not started; no commit.
