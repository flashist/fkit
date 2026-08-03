# Worklog — 0173: tighten the wiki completion-flag block in all three wiki SKILLs

Built by `fkit-coder`, spawned as the Build worker of `fkit-sprint-ship-loop`, 2026-08-03.
Approved plan carried by pointer: `plan.md` in this folder, `git hash-object`
`80c5466e575de728114399ca0fc1d53f0209eb57`, 12933 bytes — **hash verified as matching before any edit.**
`plan.md` was not modified.

Citations here are **file + heading + quoted phrase**, per the brief's ban on line-number coordinates.

---

## What changed

Three files, all canonical sources under `claude/skills/`. No `.claude/` mirror touched, no
`ai-agents/wiki-vault/` write, no test, no guard, no commit.

- `claude/skills/fkit-wiki-ingest/SKILL.md` — step *"Flag any completed tracked task — close nothing."*
- `claude/skills/fkit-wiki-lint/SKILL.md` — same step
- `claude/skills/fkit-wiki-sync/SKILL.md` — `## Step 9 — Flag any completed tracked task — close nothing`

**Edit 1 — both template lines, under *"End the report with one line per task that came out complete or
partial, in exactly this form:"*.** The hardcoded `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md` path
is gone from both. Owner-ruled candidate (i), folder ID only:

```
- complete → `Task <NNNN>'s vault work is complete — ready to close`
- partial or uncertain → `Task <NNNN>: partial — not ready to close`
```

Per the owner's **Q2 → (A)**, the whole parenthetical went, including *"producer runs /fkit-task-done"*.
The routing cue is not lost: it survives in the same block at *"`@fkit-producer Run /fkit-task-done on
<brief path>`"*.

**Edit 2 — the `<NNNN>` paragraph.** Per the owner's **Q1 → (A)** the dangling clause *"the same four
digits that open the path you emit,"* is struck; the sentence now reads *"…(equivalently the brief's
`## ID`) — and the task's only identity."* The `:NNN` prohibition was appended to the same paragraph,
beside the rank ban and without restructuring it:

> It is also **never** a line number — write no `:NNN` coordinate in a flag.

The rank / `P<n>` sentence itself is untouched.

**Indentation preserved exactly:** ingest 3 / lint 3 / sync 0, unchanged from before the edit.

---

## Decision log (ADR-032 A2 / ADR-019) — calls made without asking

Two, both mechanical and inside the approved plan.

1. **Line-wrapping of the struck clause — obvious winner within the plan's intent.**
   Striking the clause forced a rewrap of the two lines it spanned. I rewrapped **only those two lines**
   and left the rank sentence's continuation lines byte-identical, which leaves a short line reading
   *"task's only identity. It is **never** the sprint"* mid-paragraph. The alternative — rewrapping the
   whole paragraph to an even width — would have churned the rank sentence's bytes, and the plan's
   verification 4 and the brief both demand that sentence come back **unchanged**. Cosmetic wart traded
   for a clean verification. Renders identically in Markdown. Applies to all three files.

2. **Placement of the `:NNN` sentence — mechanical, in-plan.**
   The plan said *"appended to the existing `<NNNN>` paragraph — beside the rank ban, not restructuring
   it"* without fixing the exact position. Placed after the rank sentence's convention-doc citation and
   before the closing *"Substitute real values."*, so the two prohibitions sit adjacent and the
   paragraph still ends on its instruction. Same position in all three files.

No frontier-move, no regression, no scope widening, no owner-gate skipped.

---

## Two inaccuracies found in the approved plan — reported, not inherited

Neither changed the edit; both are quoting slips, not measurement errors.

1. **Plan §3 adds bold that the source does not have.** It renders the sentence as *"— **the same four
   digits that open the path you emit**, and the task's only identity."* The files carry that clause in
   **plain text**; only *"`<NNNN>` is the task folder name's four-digit prefix"* and the *"**never**"*
   are bold. The brief quotes it correctly. I struck the clause as it actually appears.

2. **Plan verification 5's *"ingest-vs-lint `diff` IDENTICAL"* holds for the block body only.** The two
   differ on the numbered heading line — `7.` in ingest, `8.` in lint — which the plan's own Evidence
   section states. Body-only diff is clean both before and after the edit.

**Everything else in the plan re-measured correct**, including the indentation figures the driver asked
me to re-check: ingest 3 / lint 3 / sync 0, exactly as the plan said. The `:NNN` prohibition was
genuinely absent from all three before this change (grep for `line number` and `:NNN`: zero hits).

---

## Residuals

- **`.claude/skills/fkit-wiki-{ingest,lint,sync}/SKILL.md` now drift from `claude/`** and still carry the
  old dead-path template. Verified drifted after the edit. Regenerating them is
  `claude/fkit-claude-init.sh`, which the plan put out of scope and I did not run. **A wiki run started
  from the current mirrors will still emit the old form.**
- **Four existing emissions left frozen, nothing repaired or annotated.** One dead, in
  `ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md`
  (closed ledger). Three in `ai-agents/wiki-vault/log.md` (`0206` complete, `0199` partial ×2) — still
  live today, will rot on close. The vault is `fkit-wiki`'s exclusively; any cleanup is a separate task
  for that role, not started here.
- **`npm test` is a no-op signal for this change.** No test reads a skill body — verified against the
  plan's blast-radius analysis. Baseline measured this turn *before* editing: 560 pass / 0 fail.
  Post-edit: 560 pass / 0 fail. **Identical counts confirm the tests are blind to the edit; green here
  is neither evidence nor absolution.**
- **Rank conflict stands, per the owner's Q3 → (B).** `0154` (P129) and `0165` (P130) still sit above
  `0173` (P152) on the board while both depend on it. No renumbering done.
- **This reverts the brief-path half of `0153`** and keeps its folder-ID half — deliberate, per the
  owner's ruling, not a regression.
- **The form used is owner-ruled candidate (i), and the ruling came from the brief, not the report.**
  Report §11 still reads *"⏳ Awaits the owner"* and is out of date on this point.

## Follow-ups (not filed by me)

- Rerun `claude/fkit-claude-init.sh .` to refresh the `.claude/` mirrors.
- A `fkit-wiki` task for the three live `log.md` emissions before they rot.
- `0154` must now assert the **new** verbatim strings; `0165` is unblocked on content.
