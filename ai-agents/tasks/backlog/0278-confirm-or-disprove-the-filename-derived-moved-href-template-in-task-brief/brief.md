# Confirm or disprove the filename-derived `Moved to [Sprint N]` href template in `/fkit-task-brief`

## ID
0278

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

**Why the architect and not the coder.** The deliverable's larger half is a **verdict on an accepted
ADR's completeness claim**, not a prose edit. If the finding confirms, `claude/skills/fkit-task-brief/SKILL.md:351`
is an **eighth** ADR-041 §6 site — which means §6's *"all seven must be corrected"* was **wrong as
written**, and amending an accepted ADR is the architect's call. This is the same reasoning that put
[`0276`](../0276-correct-the-unresolved-plan-sprint-drift-mechanism-claim-in-adr-041-and-its-echoes/brief.md)
with the architect. The SKILL.md edit, if one is owed at all, is one line and rides with the verdict.

## Context

### Authority

**Owner ruling 2026-08-12**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"File both as new tasks (Recommended)"**.

### Provenance

Finding **F2** of task
[`0268`](../../done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/plan.md)'s
plan worker, recorded in that plan's §*"⚠️ Three findings — surfaced, not acted on"*, and also carried
in `0268`'s `review.md`. `0268` closed 2026-08-12. The finding was **surfaced, not acted on** — it was
out of scope there, and the plan worker said so explicitly.

⚠️ **This row is NOT a defect of `0268`.** `0268`'s gloss did not create the site; it made the site
easier to notice. ⛔ Do not close this describing it as `0268` follow-up repair.

### The claim, as reported

`claude/skills/fkit-task-brief/SKILL.md:351` (measured 2026-08-12) instructs the producer, in step 2
of the three-edit "pulling a backlog task into a sprint" procedure:

> Flip the backlog row to `` ➡️ Moved to [Sprint N](sprint-N.md) — priority M ``, the canonical marker
> from `task-status-vocabulary.md`.

The href `sprint-N.md` is **built from the filename**. Under ADR-041 there is **no pattern on the
filename** — a plan may legitimately be `plan-sprint-4c.md` — and a producer who follows this line
literally then writes an href that **does not resolve**.

`ADR-041 §6`'s seven-site table names `claude/skills/fkit-task-brief/SKILL.md:308-312` (site 3) and
`:334-337` (site 4), **and not `:351`**. So
[`0267`](../../done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/brief.md)'s
sweep, which corrected sites 3–7 against that enumeration, **would not have touched it**.

### ⚠️⚠️ THE FIRST STEP IS CONFIRM-OR-DISPROVE. IT IS NOT AN ASSUMPTION.

**`0268`'s plan worker rated this explicitly: *"plausible, not confirmed — I did not trace every mover
call site."*** That rating is carried into this brief unchanged and is **the reason this is an
investigation row, not a repair row**.

⛔ **Do not open with the fix.** A close that lands a prose edit without first stating the verdict and
its evidence has not done this task.

**The genuine ambiguity to resolve** — stated so the investigation has something to bite on:

- The line is a **template**, and `N` in `[Sprint N]` is unambiguously a placeholder. A reader may
  reasonably take `sprint-N.md` as the **same** kind of placeholder — *"the target plan's filename"* —
  in which case the site is **under-specified**, not false, and the correct change is small or none.
- Or the reader takes it as literal spelling guidance, in which case it **states a filename pattern**
  and is **false as written** in exactly ADR-041 §6's sense.

**These two readings call for different-sized changes, and the verdict decides which.** Deciding
between them is the work.

### The one that must be answered either way: is §6's completeness claim wrong?

ADR-041 §6 is headed *"Prose sites this ADR falsifies — **all seven** must be corrected"* and its
preamble reads *"enumerated here so nothing is missed."*

- **If `:351` confirms as a §6-class site** → §6's completeness claim was wrong, and that is a fact
  about an accepted ADR. Record it.
- **If `:351` disproves** → record that too. A finding rated *"plausible"* by one worker and left
  unrecorded will be re-found by the next reader of that line, at full cost.

⚠️ **"Record it" does not mean "reverse anything."** ⛔ **This is NOT a reversal of any ADR-041
decision.** Selection by resolved identity, the `Backlog` token, never-eligible, and §5 all stand.
What is in question is a **supporting completeness claim about a list of prose sites**.

The repo's settled form for *"a supporting fact was falsified; the decision stands"* is an **appended
dated amendment with the original left byte-identical** — precedents at `adr-015:220`, `adr-016:292`,
`adr-042:317` (as cited by `0276`; ⚠️ **re-measure, do not trust these numbers**). Whether that form or
an in-place edit is right here is **part of this task's judgment**, and the choice must be stated with
its reason.

### ⚠️ The interaction the fix must not break

`/fkit-task-done` and `/fkit-task-cancelled` are the movers that write these markers, and the
dashboard **parses** them:

- ⛔ **The marker's SYNTAX must not change.** `0268` deliberately left it alone;
  `priority-is-rank-not-identity.md` says of this exact marker *"Leave it byte-identical."*
- ⛔ **`moved_target` must keep parsing.** `claude/skills/fkit-status/dashboard.sh:938` (measured
  2026-08-12) extracts the target with
  `sed -nE "s/.*Moved to \[*(${SPRINT_ID_RE}|Backlog).*/\1/p"`. It reads the **link text**, not the
  href — which is *why* an href-only correction is safe, and also why **any** token-shape change is
  not.
- ⛔ **Drift rule 2 must keep firing.** `dashboard.sh:1013` compares `moved_target` against the brief's
  `## Sprint` and emits `drift disagreement`. Breaking this silently converts real drift into a clean
  board.

### Adjacent sites surfaced at filing — SWEPT, NOT PRE-JUDGED

A `grep -n 'sprint-N\.md'` over `claude/` on 2026-08-12 returned **three** hits. One is `:351` above.
The other two are recorded here **so the sweep starts from a known floor**, ⛔ **not as a verdict**:

| Site | Text as measured 2026-08-12 |
|---|---|
| `claude/agents/fkit-producer.md:89` | *"read the active sprint plan (`ai-agents/sprints/sprint-N.md`; if unclear, list …)"* |
| `claude/scaffold/ai-agents/README.md:8` | *"Sprint plans (`sprint-N.md`) + the unranked `backlog.md` board …"* |

⚠️ **Each may be correct, wrong, or harmless in its own context — verify independently and record ONE
verdict PER HIT, never a batch.** The `fkit-producer.md` line already carries its own *"if unclear,
list the directory"* escape; the scaffold `README.md` line is describing a naming **suggestion** to a
fresh project, which is a different act from stating a **mechanism**.

- ✅ **The sweep is REQUIRED** — a completeness verdict on §6 that inspects only the one reported line
  is not a completeness verdict. Widen the grep beyond the literal `sprint-N.md` string.
- ⛔ **Editing anything beyond `:351` needs an owner ruling.** Report the sweep's verdicts and
  **surface** any second site rather than folding it in.
- ⛔ **`claude/scaffold/` is a dual-homed surface.** If the sweep concludes a scaffold file needs
  changing, that is a **dual-home** change with a manifest consequence — surface it, do not start it
  inside this row.

## What to build

1. **A verdict on `:351`, with its evidence.** Confirmed §6-class site, or disproved. State which
   reading of the template the evidence supports, and what a producer following the line literally
   would write when the target plan is `plan-sprint-4c.md`.
2. **A verdict on ADR-041 §6's completeness claim**, following from (1), in one sentence.
3. **The recording act that verdict implies** — an appended dated amendment to ADR-041 (preferred by
   precedent) or an in-place edit, with the choice justified. ⚠️ **Both branches owe a record.** A
   disproof is recorded too, sited where the next reader of `:351` will meet it.
4. **The `:351` prose correction, IF and ONLY IF (1) confirms it.** Keep it minimal: the href stops
   asserting a filename. ⛔ **Never restate the token grammar, delimiters, letter-suffix bound, or any
   filename allowlist** (ADR-041 §5) — the fix is to stop naming a filename, not to name a better rule.
5. **The sweep's per-hit verdicts**, including the two adjacent sites above.

### Constraints

- ⛔ **No marker-syntax change of any kind.**
- ⛔ **No `dashboard.sh` change.** If `moved_target` or drift rule 2 looks wrong, **stop and report**.
- ⛔ **No `task-status-vocabulary.md` change** — that is `0268`'s landed work.
- ⛔ **No reversal of any ADR-041 decision** (see above).
- ⛔ **No edit outside `:351`** without an owner ruling; no `claude/scaffold/` edit in this row.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No task-file move (ADR-033). ⛔ No commit.
  ⛔ No new devDependency (ADR-014).
- ⚠️ **Check whether `claude/skills/fkit-task-brief/SKILL.md` is tracked in
  `claude/structure-manifest.tsv`** and whether `npm run generate:manifest` is therefore owed. **Check
  it; do not assume either way** — `0268` owed one for its scaffold edit.
- ⚠️ **Every `:NNN` in this brief is a dated anchor of convenience, measured 2026-08-12. The durable
  anchor is the quoted text. Re-measure at implementation time** — `0276` rewrites `:341-343` of this
  same file, ten lines above.

## Verification steps

1. **The verdict is stated first and plainly** — *confirmed* or *disproved*, with the quoted `:351`
   text and the reasoning. ⛔ A close that shows a diff without a stated verdict has not done this task.
2. **The §6 completeness question is answered in one sentence.** Was ADR-041 §6's *"all seven"* wrong
   or not?
3. **The record landed, in whichever branch fired.** Quote it. Show that ADR-041's original text is
   **byte-identical** if the appended-amendment form was used; if an in-place edit was chosen instead,
   justify it against the three cited precedents.
4. **The marker syntax is unchanged.** Show from the **diff** — not from intent — that no `➡️ Moved to
   [...]` token shape changed anywhere.
5. **`dashboard.sh` is untouched, and the parsers still hold.** `git diff --stat` shows no
   `dashboard.sh` line; run `node --test test/dashboard-contract.test.js` and paste the counts.
6. **The sweep is reported with ONE verdict PER HIT** — including `claude/agents/fkit-producer.md:89`
   and `claude/scaffold/ai-agents/README.md:8`. ⛔ No batch verdict. Any site beyond `:351` is
   **reported, not edited**; say so explicitly.
7. **The manifest question is answered.** State whether the touched path is manifest-tracked, whether
   `npm run generate:manifest` was owed, and whether it was run.
8. **Full `npm test` green; state the measured counts.** ⚠️ Then say plainly **what it proves and what
   it does not** — check whether any test reads this skill's or the ADR's prose, and if none does, say
   so rather than implying coverage.
9. **`git diff --stat` scope stated**, and every touched path justified against the constraints above.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** finding **F2** of `0268`'s plan worker
  ([`plan.md`](../../done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/plan.md),
  §*"⚠️ Three findings — surfaced, not acted on"*; also in that task's `review.md`). Filed 2026-08-12
  on the owner's ruling of the same day, verbatim label **"File both as new tasks (Recommended)"**.
- **⚠️ CONFIDENCE IS INHERITED AS "PLAUSIBLE", NOT "CONFIRMED".** This is stated three times in this
  brief on purpose. The reported defect may not exist. **Concluding that it does not, and recording
  why, is a full and successful outcome of this task** — not a failure, and not a reason to
  manufacture a change.
- **⚠️ CONCURRENCY HAZARD WITH [`0276`](../0276-correct-the-unresolved-plan-sprint-drift-mechanism-claim-in-adr-041-and-its-echoes/brief.md)
  — recorded as a note, deliberately NOT a `Depends on:`.** The two rows overlap on **both** of their
  files: `0276` corrects `claude/skills/fkit-task-brief/SKILL.md:341-343`, this one looks at `:351` —
  **ten lines apart in the same section**; and **both** may append an amendment to **ADR-041**
  (different sections, different claims: `0276` owns the `unresolved-plan-sprint` mechanism claim at
  `:152-153`/`:172-173`, this owns §6's completeness claim). ⚠️ **The hazard is CONCURRENCY, not
  order — do not have both open at once.** This is the `0273`/`0275` collision shape at closer range.
  ⚖️ **Soft ordering, safe either way, `0276` marginally better first** — it discharges a conditional
  acceptance sitting on a re-raise trigger, and this row must re-measure its anchors regardless. ⛔ Not
  a dependency edge: this row's step 1 is an investigation doable today.
- **⚠️ NOT one row with `0276`.** They read like neighbours but are different claims in different ADR
  sections, and `0276` carries a residual's re-raise trigger this row does not share. Merging them
  would put an unconfirmed finding inside a row that must ship.
- **Independent of [`0279`](../0279-gloss-the-undefined-n-in-status-report-formats-moved-value-in-both-homes/brief.md)**,
  its sibling filed the same day from the same source. No shared file, no ordering. Recorded so nobody
  invents an edge between two rows filed together.
- **On merit:** the **Backlog**, unranked, and that is honest. The reported defect is **unconfirmed**,
  its blast radius is one dead href in one status row, and no shipped runtime code is involved. Sprint
  5 is mid-flight with owner-set ranks from 2026-08-11; appending there would land it below every open
  row.
- **Blast radius if never done:** if the finding is real, a producer following `:351` writes a
  `Moved to [Sprint N](sprint-N.md)` href that does not resolve whenever the target plan is not named
  `sprint-N.md` — a silent dead link in a status row, invisible to `npm test` (no test reads this
  prose) and visible only to a human clicking it. If the finding is not real, the cost of never doing
  this is that the next reader re-finds it and re-investigates from zero.
- Filed 2026-08-12 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of the
  same day. It asked nothing, edited no skill line, changed no task's status, moved no task file,
  touched no sprint plan, and committed nothing.
