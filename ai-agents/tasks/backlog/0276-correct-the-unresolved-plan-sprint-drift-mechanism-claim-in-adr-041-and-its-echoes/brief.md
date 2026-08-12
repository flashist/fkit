# Correct the `unresolved-plan-sprint` drift-mechanism claim in ADR-041 and its echoes

## ID
0276

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Authority — and why the owner is `fkit-architect`, not `fkit-coder`

**Owner ruling 2026-08-12**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"Yes — spawn a producer to file both (Recommended)"**.

This discharges a **conditional acceptance**.
[`0267`](../../done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/review.md)
closed on 2026-08-12 with residual **AR4** accepted **only on the express condition that this
follow-up be filed** — its own re-raise trigger reads *"if the follow-up correcting ADR-041
`:150-153` is not filed"*. `0267`'s reviewer closeout checked the backlog at close time and recorded
the obligation as **NOT satisfied**. This brief satisfies it.

⚠️ **ADR-041 is `accepted`** (`ai-agents/knowledge-base/decisions/adr-041-…md:3`). **Amending an
accepted ADR is the architect's call, not a coder's** — so `## Owner` is `fkit-architect`. A coder
session must not take this row and edit the ADR on its own judgement. The architect may hand the
mechanical echo edits to a coder once the amendment wording is settled; the **wording of the
amendment is the architect's**.

### The false claim, and what is actually true

The claim, in its origin wording at **ADR-041 `:152-153`**:

> …resolves EMPTY. It is therefore **not eligible** as the active sprint (safe — unresolved is never
> eligible), but it **loses** the `:796` check and reports `unresolved-plan-sprint` on every run.

**Measured false as a statement of the mechanism — twice, independently** (`0267`'s re-verify pass,
and the reviewer's closeout, both 2026-08-12):

| What was measured | Result |
|---|---|
| Emitters of `drift unresolved-plan-sprint` | **Exactly one** — `claude/skills/fkit-status/dashboard.sh:1152` |
| Where that emitter sits | **Below** the subcommand dispatch at `dashboard.sh:305-307`; `identity` and `select-active` **return before reaching it**. It is **board-mode only** — it runs only when `dashboard.sh` is handed that file as the plan to render |
| Scenario (i): another sprint is active | `select-active` picks the real plan, board mode renders **that** file, never the stray one → **0 drift lines** |
| Scenario (ii): the stray board is the only plan present | `active none`, exit **3**, and per `fkit-status/SKILL.md` **no board is rendered at all** → board mode never runs → **0 drift lines** |

**The per-run cost is real; the named mechanism is wrong.** A stray board **is** surfaced on every
default status run — as a `candidate file="…" identity="unresolved"` line, which
`claude/skills/fkit-status/SKILL.md:42-43` requires the briefing to report. So the correction
**replaces one channel with another**; it does not delete the cost.

### What the correction is NOT

- ⛔ **Not a reversal of any ADR-041 decision.** Every decision stands: selection by resolved
  identity, the `Backlog` H1 token, the never-eligible rule, §5's one-grammar constraint. What is
  wrong is a **supporting fact about which output channel reports the residual case**.
- ⛔ **Not a `dashboard.sh` change.** The code is correct. The prose describing it is not.
- ⛔ **Not a re-opening of the residual case itself.** A `sprint-backlog.md` with a non-`Backlog` H1
  still resolves EMPTY, still is never eligible, and is still a thing not to write.

### The house form for this exact situation already exists

This repo has settled precedent for *"an accepted ADR's supporting fact was falsified; the decision
stands"* — **an appended, dated amendment with the original text left byte-identical**:

- `adr-015-…md:220` — *"Amendment — 2026-07-14: a supporting fact was falsified by implementation;
  **the decision stands**"*
- `adr-016-…md:292` — same shape
- `adr-042-…md:317` — *"Correction note — 2026-08-11: the site count is five under `claude/`, not
  four"*

⚠️ **Choosing between "append an amendment" and "edit the body in place" is part of this task, and it
is the architect's call.** The precedent above is strong but it is **not** an owner ruling binding
this row. Whichever is chosen, **state the choice and the reason in the close.**

## What to build

One coherent change covering **both** the ADR and its echoes. They land **together** — see
`## Notes` for why this is deliberately not two rows.

### 1. Correct the claim in ADR-041

Site: `ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md`.

**Known-carrying sites, measured 2026-08-12:**

| Line | Text | Assessment to make |
|---|---|---|
| `:152-153` | *"…**loses** the `:796` check and reports `unresolved-plan-sprint` on every run"* | **The origin. Wrong as measured.** Correct it. |
| `:172-173` | *"`drift unresolved-plan-sprint` (`dashboard.sh:905-906`) plus the roll-up's … clause … tell the reader, **on the run they just made**, that a plan's identity did not resolve"* | ⚠️ **Same false mechanism, second instance** — and its line-cite `:905-906` is **also stale** (the emitter is `:1152`). Assess and correct. |
| `:185` | *"the tool says so on every run and never guesses"* | ⚠️ **Judgement required.** Read in context this may be a general statement about a rendered plan rather than the stray-board case. **Decide explicitly; record the verdict either way.** |

The corrected statement must carry **all three** of these, or it has not fixed the defect:

1. `drift unresolved-plan-sprint` is emitted **only in board mode** — only when that file is the plan
   being rendered.
2. A **default** status run on a tree holding a stray unresolved board emits **zero** such drift
   lines, in both scenarios above.
3. The residual case is **still loud on every run** — via the
   `candidate file="…" identity="unresolved"` line the briefing must report.

### 2. Sweep for echoes — do not assume the two known sites are all

`0267`'s residual named two sites. **A sweep is required, not an assumption.** A repo-wide
`grep -rn 'unresolved-plan-sprint'` was run at filing (2026-08-12) and returned hits across ADRs,
skills, `dashboard.sh` comments, task artifacts and a sprint plan. **Re-run it. Assess each hit
independently against the board-mode fact.**

**The one echo already confirmed to carry the wrong wording:**

`claude/skills/fkit-task-brief/SKILL.md:341-343` — text `0267` itself added while fixing R2:

> …and that board then reports `unresolved-plan-sprint` drift on **every** status run
> ([ADR-041 §2](…)) — so neither case is a licence to write one.

The conclusion (*"neither case is a licence to write one"*) is unaffected and **stays**. Only the
named mechanism changes.

### ⛔ THE FENCE — several hits are CORRECT in their own context. Do not pattern-match.

**A sweep that rewrites every occurrence because two of them are wrong will break the ones that are
right.** Assessed at filing, 2026-08-12:

| Hit | Why it is likely CORRECT — verify, do not assume |
|---|---|
| **ADR-041 `:235`, scenario S8** — *"identity EMPTY, `unresolved-plan-sprint` emitted"* | S8's fixture is `sprint-backlog.md` **run by name**. A by-name run **is** board mode, so the drift **is** emitted. ⚠️ **S8 is also a required-test row — changing it changes what the suite must assert.** |
| **ADR-041 `:231`, scenario S4** — same by-name shape | Same reasoning. |
| **`claude/skills/fkit-status/dashboard.sh:151`** (comment) — *"would report `unresolved-plan-sprint` on EVERY run"* | Concerns `backlog.md`, a board the reader renders by name/on request. ⚠️ Also a **code comment**, so touching it means touching `dashboard.sh` — see the constraints. |
| **`claude/skills/fkit-status/SKILL.md:325`** | Documents the drift line's **shape** in the board output, not when it fires. |

**Verify each independently against `dashboard.sh:305-307` and `:1152`. Record one verdict per hit.**

### Constraints

- ⛔ **No `dashboard.sh` behavior change of any kind.** If a `dashboard.sh` **comment** is judged to
  need correcting, that is a code-file edit — **surface it and get it ruled** rather than folding it
  in silently. Default position: **report it, do not edit it.**
- ⛔ **No reversal of any ADR-041 decision**, and no change to §5's one-grammar constraint.
- ⛔ **Do not restate the sprint-identity token grammar, delimiters, suffix bound, or filename
  allowlist anywhere** (ADR-041 §5). This task edits prose *about* the drift channel only.
- ⛔ **Bright-line rule on stale line-cites, mirroring `0273`/`0275`: correct a stale `:NNN` only
  where the line is already being rewritten.** ADR-041 carries other cites (`:796`, `:772`, `:917`,
  `:922-923`) that may also be stale. **Report them; do not sweep them.** Widening this row into a
  general ADR-041 citation audit is out of scope.
- ⛔ **Do not edit `ai-agents/sprints/sprint-5.md`** — the hit at `:491` is inside a frozen sprint-plan
  note recording what a decision *was told to preserve*. It is history. **Report, do not fix.**
- ⛔ **Do not edit `0267`'s or any other closed task's `review.md`, `worklog.md`, `plan.md` or
  `brief.md`.** Amending a closed ledger is `0274`'s shape and needs its own ruling.
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005) — see `## Notes` for the `0269` interaction.
- ⛔ No task-file move (ADR-033), no re-rank, no board-row edit beyond this task's own close.
- ⛔ No commit. ⛔ No new devDependency (ADR-014).
- ⚠️ **Line numbers in this brief are dated anchors of convenience, measured 2026-08-12.** The
  durable anchors are the quoted text. **Re-measure at implementation time.**

## Verification steps

1. **The board-mode fact is re-measured by the implementer, not inherited from this brief.** Paste
   the evidence: the emitter's location, the dispatch it sits below, and a status run on a tree with
   a stray unresolved board showing **0** `drift unresolved-plan-sprint` lines. ⚠️ **Do both
   scenarios** — another sprint active, and the stray board alone (`active none`, exit 3).
2. **The corrected ADR text carries all three required elements** — board-mode-only, zero drift lines
   on a default run, and the `candidate … identity="unresolved"` line as the real per-run cost.
   Quote the landed text.
3. **The form of the ADR change is stated and justified** — appended dated amendment, or in-place
   edit — with the reason. If appended, show the original text is byte-identical.
4. **Every `grep -rn 'unresolved-plan-sprint'` hit has exactly one recorded verdict** —
   *corrected* / *correct as-is, because …* / *out of scope, reported*. ⛔ **A batch verdict does not
   satisfy this step**; one line per hit.
5. **The fenced hits were verified independently and are unchanged.** Name S8, S4,
   `dashboard.sh:151` and `fkit-status/SKILL.md:325`, and show each is untouched by this diff — or,
   if one genuinely needed changing, show the independent measurement that justified it.
6. **`fkit-task-brief/SKILL.md`'s conclusion survives.** Show that *"neither case is a licence to
   write one"* is still there and still supported, and that the prohibition itself is unweakened.
7. **The ADR and the skill now agree.** Quote both landed passages side by side. ⚠️ **This is AR4's
   whole point** — closing this task with the two out of step re-triggers the residual by its own
   stated condition.
8. **`git diff --stat` lists only the files this task owns.** ⛔ `dashboard.sh`, `sprint-5.md` and
   every closed task artifact must be untouched — show it.
9. **Full `npm test` green; state the measured counts.** ⚠️ **Expect this to prove nothing about the
   prose** — no test reads an ADR's or a skill's wording. **Say so explicitly** rather than implying
   coverage. ⚠️ If S8's or S4's assertion was touched, that **is** in the suite — call it out
   separately.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** residual **AR4** of
  [`0267`](../../done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/review.md)
  (§"Accepted residuals", `review.md:150-180`), accepted 2026-08-12 **conditional on this filing**.
  Filed 2026-08-12 on the owner's ruling of the same day. `0267`'s reviewer closeout
  (`review.md:235-245`) recorded the obligation as unsatisfied at close; this row discharges it.
- **⚖️ ONE ROW, NOT TWO — and this is the deliberate producer call.** The ADR amendment and the
  `fkit-task-brief/SKILL.md` echo could each ship alone, so the smallest-shippable-unit rule would
  normally split them. **It is overridden here by AR4's own re-raise trigger**, which fires if the
  follow-up is *"filed and closed **without** also correcting this SKILL.md sentence, leaving the two
  out of step"*. Splitting would manufacture exactly the out-of-step state the residual forbids, and
  AR4's recorded reasoning says so directly: *"a skill that says one thing and its cited ADR another
  is worse than the current single consistent imprecision."* **They land together.**
- **⚠️ WIKI INTERACTION with [`0269`](../0269-wiki-ingest-of-adr-040-and-adr-041-the-sprint-identity-decisions/brief.md)
  — a real ordering effect, recorded as a note and deliberately NOT a `Depends on:`.** `0269` is the
  pending wiki ingest of ADR-040/041. Measured at filing 2026-08-12: `ai-agents/wiki-vault/` contains
  **zero** occurrences of `unresolved-plan-sprint`, so **nothing in the vault carries the false claim
  today** and there is no vault repair in this task's scope.
  - **If `0269` runs first**, it ingests the **uncorrected** claim into the vault, and a **re-sync is
    then owed** after this task lands.
  - **If this task runs first**, `0269` ingests the corrected text and no re-sync is needed. **This
    is the better order** — say so to whoever schedules them.
  - ⛔ **Either way, the vault fix is `fkit-wiki`'s alone** (ADR-005). ⛔ This task never writes the
    vault, and must not "just fix" a vault page it notices.
- **⚠️ The wording is INHERITED, not invented — do not close this task blaming `0267`.** `0267`'s R2
  fix faithfully echoed accepted ADR-041; that is precisely why AR4 was accepted rather than sent
  back. The close should say the ADR was the origin.
- **⚠️ ADR-041 `:172`'s cite `dashboard.sh:905-906` is stale** (the emitter is `:1152`) and sits on a
  line this task rewrites — so it is **in** scope under the bright-line rule above. ✅ **Prefer the
  durable quoted-text citation form** over fresh `:NNN` numbers; `dashboard.sh` is actively edited and
  this cite has already drifted once.
- **On merit:** the **Backlog**, unranked, and that is honest. Nothing waits on it, it changes no
  behavior, no test reads the affected prose, and it is not on the release path. Sprint 5 is
  mid-flight and its ranks were owner-set on 2026-08-11; appending there would land it below every
  open row — a scheduled-looking row reached last, which is the trap Sprint 5's board documents.
- **Blast radius if never done:** a reader of ADR-041 or `/fkit-task-brief` expects a
  `drift unresolved-plan-sprint` line from a plain status run and never sees one. Nothing branches on
  the claim — it is rationale prose inside a prohibition, not a step.
- Filed 2026-08-12 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, edited no ADR or skill line, moved no task file, touched no sprint
  plan, and committed nothing.
