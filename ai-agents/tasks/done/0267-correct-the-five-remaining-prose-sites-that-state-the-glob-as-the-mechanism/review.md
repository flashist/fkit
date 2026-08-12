# Review — 0267

Task: `ai-agents/tasks/done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/brief.md`
File(s) under review: `claude/skills/fkit-task-brief/SKILL.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `ai-agents/sprints/backlog.md`, `README.md`
Status: closed-out

Reviewers run (Round 1): fkit-reviewer (Claude) + Codex adversarial pass (`codex exec --sandbox read-only`) — **both completed, no degradation.**

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `ai-agents/sprints/backlog.md:8` | *"resolves the active sprint by each plan's **identity**, never by its filename"* is false as a statement of the mechanism. ADR-040's ladder has a **filename rung** — `plan_sprint_from_stem()` resolves `sprint-2.md`/`plan-sprint-4c.md` from the stem (`dashboard.sh:109-119`), invoked whenever the H1 rung is silent (`dashboard.sh:140-143`), and a `backlog` **basename** resolves `Backlog` outright (`dashboard.sh:148`). What ADR-041 removed is the filename **glob on the candidate set**, not the filename as an identity source — which is exactly how 0266 worded it in `fkit-status/SKILL.md:32` (*"no pattern on the filename"*) — **line ref corrected at closeout 2026-08-12**, was cited `:29-30`, which is the fenced `dashboard.sh select-active` command (`:29`) and its closing fence (`:30`); the quoted wording is at `:32`. The claim was and is correct; only the cite was off. Raised by **both** reviewers. **The two adjacent claims are fine:** this board's H1 (`# Backlog — …`) resolves at the H1 rung, so *"ignores it no matter what the file is called"* and *"renaming this file could not make it the active sprint"* are both true. |
| R2 | 1 | medium | `claude/skills/fkit-task-brief/SKILL.md:339` | *"`/fkit-status` resolves a `sprint-backlog.md` to the identity `Backlog` too"* is stated unconditionally and is true only when that file's H1 carries `Backlog` or `Sprint Backlog` (`dashboard.sh:94-100`). ADR-041 §2 names the counter-case by name: a `sprint-backlog.md` whose H1 is `# Unscheduled work` resolves **EMPTY** — the stem rung takes only numeric sprint stems (`dashboard.sh:118`) and the basename special case fires only for exactly `backlog` (`dashboard.sh:148`). The **conclusion survives** (unresolved is never eligible either), but the stated mechanism re-implies *filename ⇒ identity* — the precise claim class this task exists to remove — and it hides the real cost of that case: `unresolved-plan-sprint` drift on every run. Raised by **both** reviewers. |
| R3 | 1 | low | `claude/skills/fkit-task-brief/SKILL.md:337` | *"A second one … breaks every `➡️ Moved to [Backlog](backlog.md)` href in the repo"* over-claims. Adding a `sprint-backlog.md` leaves `backlog.md` in place, so every existing marker still **resolves**; what degrades is that the marker points at a board that no longer holds all the unsprinted work. The prohibition stands independently on the preceding reason (*"splits unsprinted work across two files"*). Raised by **Codex only**; verified CORRECT. |

**Verified and NOT findings** (recorded so they are not re-chased):
- All three new ADR-041 relative links resolve from their own directories (`../../../ai-agents/…`, `../knowledge-base/…`, root-relative). Checked on disk.
- Site 4's rule sentence is **byte-identical** to HEAD — only the reason was replaced. Verified by diff of `grep 'Never file against'` at HEAD vs working tree.
- The `README.md` claim *"`fkit update` and a launch refresh … never rewrite your project's own content under `ai-agents/`"* is **true**: `claude/fkit-claude-init.sh:34` — *"Create-if-absent only. No overwrite, no move, no delete — ever — inside `ai-agents/`"* — and `:260`. `ai-agents/sprints/backlog.md` is not in `claude/structure-manifest.tsv` and not in `claude/scaffold/ai-agents/sprints/`, so no heal/manifest path repairs it either.
- `see \`fkit-status/SKILL.md\`'s empty-argument rule` (`fkit-sprint-ship-loop/SKILL.md:47`) is **house style** in this very file, not a broken path — cf. `:41`, `:258`, `:314-315` which cite siblings the same way.
- Section citations are exact: ADR-041 §5 *is* "one grammar, one implementation"; §§2–3 and §2 are the right targets for their sites.
- No behavior change: no step added, removed, renumbered, or reworded as an instruction in either SKILL.md.
- Generator fence and `<short header: …>` placeholder integrity intact (`fkit-task-brief/SKILL.md:307-321`).

## Coder response

<!-- CODER-OWNED — the reviewer never writes below this line until the coder has responded. -->

**Round 1 processed 2026-08-12** by the coder worker of `/fkit-sprint-ship-loop`, under the owner's
plan-gate standing approval plus three post-review rulings taken live via `AskUserQuestion`
("Fix R1 + R2, accept R3 (Recommended)"). All three findings verified against `dashboard.sh` and
ADR-041 before any edit.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | defect (false statement of the mechanism) | **Fixed** — `ai-agents/sprints/backlog.md:8`: *"never by its filename"* → *"with **no pattern on the filename**"*, matching 0266's landed wording at `fkit-status/SKILL.md:32`. The two adjacent claims left untouched, per the reviewer's own note that both are true for this board. | **fixed** |
| R2 | **CORRECT** | defect (unconditional claim, true only in one branch) | **Fixed** — `claude/skills/fkit-task-brief/SKILL.md:339-345`: the mechanism is now stated **conditionally**, naming both branches and a per-run cost for the second. R3's href sentence deliberately left byte-identical to the plan's approved Edit 2 block. **The named mechanism in that second branch is wrong — see AR4.** | **fixed, with AR4 residual** |
| R3 | **CORRECT** | defect (rhetorical over-claim, non-load-bearing) | **Accepted as residual, not fixed** — owner-ruled. Recorded below. | **accepted residual** |

### Verification behind each verdict

- **R1 — CORRECT.** `plan_sprint_from_stem()` (`claude/skills/fkit-status/dashboard.sh:109-119`)
  resolves an identity **from the filename stem** (`sprint-2.md` → `Sprint 2`), and it is reached
  whenever the H1 rung returns empty (`resolve_identity()`, `:140-143`). A `backlog` **basename**
  resolves `Backlog` outright at `:148`. So the filename *is* an identity source; what ADR-041 removed
  is the filename **glob on the candidate set**. *"never by its filename"* was therefore false as
  written. **Adjacent claims re-verified as true:** this board's H1 is
  `# Backlog — the default home for unsprinted task briefs`; the H1 rung splits on `—` and matches the
  bare `Backlog` token (`:99-100`), so it resolves at rung 1 and never reaches a filename rung —
  *"no matter what the file is called"* and *"renaming this file could not make it the active sprint"*
  both stand. Not touched.
- **R2 — CORRECT.** For a `sprint-backlog.md` with H1 `# Unscheduled work`: rung 1 finds no token;
  the stem rung's regex is `^(plan-)?sprint-([0-9]+[a-z]?)$` (`:118` with `SPRINT_NUM_RE` at `:68`),
  and `backlog` is not numeric, so it does not match; the basename special case at `:148` fires only
  for a basename of exactly `backlog`, not `sprint-backlog`. Identity resolves **EMPTY**. ADR-041 names
  this case explicitly at `:151` and pins it as scenario **S8** at `:235` — *"identity EMPTY,
  `unresolved-plan-sprint` emitted, not eligible as active sprint"*; the emitter is `dashboard.sh:1152`.
  The conclusion did survive, but the stated mechanism re-implied *filename ⇒ identity* — the exact
  claim class this task exists to delete — and hid the per-run cost.
  ⚠️ **Correction, added after the re-verify pass:** the EMPTY-identity half above is measured true, but
  the **cost** the fix went on to name is not. `unresolved-plan-sprint` is emitted only in **board
  mode** (`dashboard.sh:1151-1153`), so a status run emits **0** drift lines for a stray board; what
  surfaces every run is a `candidate file="…" identity="unresolved"` line. The quoted ADR-041 wording
  (`:151`, S8 at `:235`) carries the same imprecision — this fix inherited it. **Accepted as residual
  AR4**, below; owner ruled it corrected in a follow-up task alongside the ADR.
- **R3 — CORRECT on the facts.** Adding a `sprint-backlog.md` does not remove `backlog.md`, so every
  existing `➡️ Moved to [Backlog](backlog.md)` marker still resolves; "breaks every href" overstates
  what happens. Accepted rather than fixed on the owner's ruling — see the residual entry below.

### Wording landed

`ai-agents/sprints/backlog.md:7-14` (changed clause only):

> `/fkit-status` resolves the active sprint by each plan's **identity**, with **no pattern on the
> filename**: this board's identity is `Backlog`, which is **never eligible**, so the default status
> run ignores it no matter what the file is called

`claude/skills/fkit-task-brief/SKILL.md:339-345` (changed clause only). **Two different baselines, said
precisely** — an earlier wording here lumped both under "byte-identical to before", which reads as *to
HEAD* for both and is not provable for the second:

- the rule's **first sentence** (*"⚠️ Never file against `backlog.md` …"*) is byte-identical **to HEAD**
  — it predates this task; proved by `cmp` on the extracted sentence.
- **R3's href sentence** is **new text this task added at the build step**, so it has **no HEAD
  counterpart** (`git show HEAD:… | grep -c "href in the repo"` → `0`). Its provable baseline is the
  **approved plan's Edit 2 replacement block** (`plan.md:132-134`); against that, the R2 fix left it
  byte-identical — proved by `cmp`.

> It would **not** become the reported active sprint either way — **but the filename is not what
> decides that.** If its H1 carries `Backlog` (or `Sprint Backlog`), `/fkit-status` resolves it to the
> identity `Backlog`, which is never eligible. If the H1 carries neither token, it resolves to
> **nothing at all** — the name `sprint-backlog` supplies no identity of its own — and that board then
> reports `unresolved-plan-sprint` drift on **every** status run ([ADR-041 §2](…)) — so neither case
> is a licence to write one.

**Verification after the fixes:** `npm test` green, including the `prove-red.sh` hard gate
(*"real + unmutated copy green; each mutation reds its NAMED assertion"*) — all 15 mutations red their
named assertion. `git diff --stat` still shows only this task's four paths (`README.md`,
`ai-agents/sprints/backlog.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`,
`claude/skills/fkit-task-brief/SKILL.md`) plus 0266's separate uncommitted work. No manifest regen, no
`dashboard.sh` or `fkit-status/SKILL.md` edit, no behavior change, nothing committed.

## Accepted residuals (shared, do-not-re-litigate)

<!-- Entries are added only once the OWNER has approved treating a finding as a settled tradeoff. -->

**All four below were ruled by the owner on 2026-08-12 via `AskUserQuestion`, relayed live through the
`/fkit-sprint-ship-loop` driver session.** Do not re-raise except on the stated trigger.

### AR1 — R3's href over-claim in `fkit-task-brief/SKILL.md:337`

- **What:** *"A second one … breaks every `➡️ Moved to [Backlog](backlog.md)` href in the repo"*
  overstates the effect. Adding a `sprint-backlog.md` leaves `backlog.md` in place, so every existing
  marker still resolves; what actually degrades is that the marker points at a board no longer holding
  all the unsprinted work.
- **Why accepted:** the over-claim is **rhetorical, not load-bearing**. The prohibition stands on its
  own independent first reason — *"There is **one** backlog board and it is `backlog.md`"* — which is
  unaffected. The finding is `low`, and the sentence is not one of the false-mechanism claims this
  task exists to remove. Owner ruled *"Fix R1 + R2, accept R3 (Recommended)"*.
- **Re-raise only if:** the "one board, one file" first reason is ever removed or weakened, leaving the
  href claim as the rule's sole support — or a reader is observed acting on it as a literal breakage
  prediction.

### AR2 — `README.md:39` adds a new `sprint-*.md` occurrence

- **What:** the paragraph this task inserted into `README.md` itself contains the string
  `sprint-*.md`, so the brief's step-3 sweep gains one more hit than it had before.
- **Why accepted:** it is **genuine use/mention** — the paragraph exists precisely to tell an existing
  project that the stale sentence in its own generated backlog header names that glob. Naming the
  stale claim is not making it. `README.md` is also **outside the brief's sweep scope**, which scans
  `claude/` and `ai-agents/sprints/` only.
- **Re-raise only if:** a future sweep is widened to include `README.md` **and** treats a
  use/mention occurrence as a defect.

### AR3 — `fkit-sprint-ship-loop` step 1 has no executable path for an empty `$ARGUMENTS`

- **What:** step 1 now points at `/fkit-status`'s empty-argument rule instead of restating it, but the
  loop itself still has no call of its own that resolves the active sprint. The old text
  (*"the active `sprint-*.md`"*) at least implied a procedure; the corrected text implies a lookup.
- **Why accepted:** **frontier-move, not a defect.** Giving the loop its own
  `dashboard.sh select-active` call would be a **new step** — forbidden by this brief's ⛔ no-behavior-change
  constraint. Pointing rather than restating is what ADR-041 §5 (*one grammar, one implementation*)
  requires, so the current text is the correct end state **for this task**. Owner ruled
  *"Accept both as recorded residuals"* and, separately, that the executable-path gap be
  **filed as a new task later** — verbatim label *"File it as a new task later (Recommended)"*.
- **Re-raise only if:** it is not carried into a filed follow-up task, or the loop is observed
  guessing an active sprint rather than resolving one.

### AR4 — R2's own fix names the wrong mechanism for the stray board's per-run cost

- **What:** `claude/skills/fkit-task-brief/SKILL.md:341-343` — text **added by R2's fix** — says a stray
  `sprint-backlog.md` whose H1 carries neither `Backlog` nor `Sprint Backlog` *"reports
  `unresolved-plan-sprint` drift on **every** status run"*. **Measured false as a statement of the
  mechanism.** `drift unresolved-plan-sprint` is emitted only in **board mode**
  (`dashboard.sh:1151-1153`) — i.e. only when `dashboard.sh` is handed that file as the plan to render.
  Both scenarios measured **0** drift lines on a status run:
  - another sprint is active → `select-active` picks the real plan, board mode renders **that** file,
    never the stray one (`active file="sprint-5.md"`, drift lines = 0);
  - that board is the only one → `active none`, exit 3, and per `fkit-status/SKILL.md:47-48` **no board
    is rendered at all**, so board mode never runs.

  **The per-run cost is real; only its name is wrong.** The stray board is surfaced on every default run
  as a `candidate file="…" identity="unresolved"` line, which `fkit-status/SKILL.md:42-43` requires the
  briefing to report. The conclusion the sentence supports — *neither case is a licence to write one* —
  is unaffected.
- **Why accepted:** **owner ruling, verbatim label *"Accept as residual, file follow-up
  (Recommended)"*.** Reasoning recorded with it: (a) **0267's own goal is fully met** — every
  `filename ⇒ identity` claim in the five prose sites is deleted, and this sentence does not reinstate
  one; the defect is a mis-named emission channel, a different claim class. (b) **The wording is
  inherited, not invented** — the same claim sits in **accepted ADR-041 at `:150-153`**
  (*"loses the `:796` check and reports `unresolved-plan-sprint` on every run"*), which this sentence
  cites; the fix faithfully echoed it. (c) **Correcting the SKILL.md sentence alone would leave it
  contradicting the ADR it links to** — a skill that says one thing and its cited ADR another is worse
  than the current single consistent imprecision. (d) The correct remedy is a **follow-up task that
  fixes ADR-041 and its echoes together**, which the owner ruled be filed later.
  ⛔ **Not filed by this spawn** — no brief written, no mover invoked.
- **Re-raise only if:** the follow-up correcting ADR-041 `:150-153` is not filed — or is filed and
  closed **without** also correcting this SKILL.md sentence, leaving the two out of step — or a reader
  is observed expecting a `drift unresolved-plan-sprint` line from a plain status run.

## Reviewer closeout — Round 1, 2026-08-12

<!-- REVIEWER-OWNED. Written by the review-closeout spawn of `/fkit-sprint-ship-loop`. -->

### ✅ Ready to merge — 0 open confirmed defects; 4 owner-accepted residuals, 1 carry-forward obligation

**Reviewers run (Round 1):** fkit-reviewer (Claude) + Codex adversarial pass — **both completed, no
degradation.** Coverage is **full**, not partial.

| #  | Reviewer | Reviewer sev | Verified verdict | Defect / frontier | One-liner |
|----|----------|--------------|------------------|-------------------|-----------|
| R1 | both | medium | **CONFIRMED → discharged** | defect | *"never by its filename"* was false; now reads *"with no pattern on the filename"* — re-read on disk at `ai-agents/sprints/backlog.md:7-11`. Matches 0266's landed grammar at `fkit-status/SKILL.md:32`. |
| R2 | both | medium | **CONFIRMED → discharged (with AR4)** | defect | the unconditional *filename ⇒ identity* claim is gone; `claude/skills/fkit-task-brief/SKILL.md:339-345` now names **both** H1 branches conditionally. The claim class this task exists to delete is deleted. |
| R3 | Codex only | low | **CONFIRMED → accepted, not fixed** | defect (rhetorical) | owner-ruled residual **AR1**. |

**Suppressed as settled (do not re-raise except on each entry's stated trigger):** AR1, AR2, AR3, AR4
above.

### Close conditions — checked, not assumed

- **Each finding genuinely discharged.** R1 and R2 fixes were **re-read on disk** at closeout, not
  taken from the coder's summary. R3 is owner-accepted.
- **AR4's mechanism claim independently re-measured by this spawn.** `add_fact "drift
  unresolved-plan-sprint …"` has **exactly one** emitter, `dashboard.sh:1152`, and it sits **below**
  the subcommand dispatch at `:305-307` — `identity` and `select-active` return before reaching it.
  So the drift line is **board-mode only**; a status run emits none. AR4 is correct that the fix's
  named mechanism is wrong.
- **AR4's inheritance claim verified.** ADR-041 `:150-153` reads *"loses the `:796` check and reports
  `unresolved-plan-sprint` on every run"* — the SKILL.md sentence echoes an **accepted** ADR; it did
  not invent the error.
- **Suite re-run by this spawn, not inherited:** `npm test` → **tests 709 / pass 709 / fail 0**, plus
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion` (15/15).

### Why four residuals — one of them in text this task added — is still a defensible close

AR4 is the only one that needs defending, and it holds on four independently checked grounds:

1. **The task's own goal is fully met.** Every `filename ⇒ identity` claim in the five prose sites is
   gone. AR4 is a **different claim class** — a mis-named emission channel — not a survivor of the
   defect this task exists to remove.
2. **Nothing branches on the sentence.** It is a *rationale clause* inside a prohibition
   (*"never write a `sprint-backlog.md`"*), not a step. No procedure reads it, waits on that drift
   line, or changes behavior because of it. Blast radius: a reader may expect an output line that
   never appears.
3. **Fixing it here alone would make things worse.** The sentence cites ADR-041, and ADR-041
   `:150-153` says the same thing. A skill contradicting the ADR it links to is a worse state than one
   consistent imprecision.
4. **Verified inherited, not invented** — see the measurement above.

AR1 (rhetorical, prohibition stands on its independent first reason), AR2 (genuine use/mention, and
`README.md` is outside the brief's sweep scope) and AR3 (frontier-move — the alternative is a **new
step**, which this brief's ⛔ no-behavior-change constraint forbids) need no further defense.

### ⚠️ Carry-forward obligation — checked on disk at closeout, and NOT satisfied

**AR3 and AR4 were each accepted on the express condition that a follow-up be filed. Neither follow-up
exists.** Backlog `0268`–`0275` were read at closeout: **none** covers correcting ADR-041 `:150-153`'s
drift-mechanism wording and its echoes, and **none** covers giving `/fkit-sprint-ship-loop` an
executable path for an empty `$ARGUMENTS`. (`0269` mentions `unresolved-plan-sprint` but is a
**wiki-ingest** of ADR-040/041, not a correction; `0271` pins grammar behaviors, not this emission
channel.) Both residuals' **re-raise triggers therefore already read *"not filed"***.

This is a **producer/driver filing duty, not a defect in this diff**, so it does not hold the ledger
open — but the two residuals return the moment the follow-ups are dropped.

### Observation, deliberately NOT raised as a finding

`ai-agents/sprints/backlog.md:8` — the phrase *"with no pattern on the filename"* is exact in its home
(`fkit-status/SKILL.md:32`, where it qualifies the **candidate set**), and slightly loose here, where
it hangs off *"resolves … by identity"* — identity resolution **does** apply a filename pattern at the
stem rung (`dashboard.sh:118`, `^(plan-)?sprint-([0-9]+[a-z]?)$`). **Not a finding, and not to be
re-chased:** R1 itself prescribed this exact wording, and ADR-041 §5 (*one grammar, one
implementation*) requires the two sites to read alike. If the phrase is ever tightened, tighten it in
**both** homes at once — the same "fix the echoes together" logic as AR4.

### Convergence call

**Converged — close.** One round, three findings, all novel (none re-litigated a prior residual), all
verified, two fixed and one owner-accepted. Round 2 would produce only re-litigation of AR1–AR4.
**Recommendation: close the review and ship the task**, with the carry-forward filing obligation above
handed to the producer.
