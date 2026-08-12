# Correct ADR-003's *"the need it identified is still unmet"* status claim

## ID
0281

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
**"ADR-003 contradiction (Recommended)"**.

⚠️ **Amending an ADR is the architect's call, not a coder's** — the same reasoning that put
[`0276`](../0276-correct-the-unresolved-plan-sprint-drift-mechanism-claim-in-adr-041-and-its-echoes/brief.md)
and [`0278`](../0278-confirm-or-disprove-the-filename-derived-moved-href-template-in-task-brief/brief.md)
under `fkit-architect`. A coder session must not take this row and edit the ADR on its own judgement.
⚠️ **Note the wrinkle:** ADR-003's status is **`superseded`**, not `accepted` — so this is not
literally the "amend an accepted ADR" case. **It is still the architect's**: the correction is to a
*status-line claim about the project's verification posture*, which is an architectural statement,
and the choice of correction form (below) is an architect's call.

**Provenance:** [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md),
closed 2026-08-12, landed both the in-release `npm test` gate and `.github/workflows/test.yml`.

### What ADR-003 actually says — read first-hand at filing, 2026-08-12

⚠️ **This was reported second-hand by a reviewer. The following is an independent read of the file
on disk**, `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md` (70 lines).

**Lines 3-7, the status line, verbatim:**

> - **Status:** **superseded** — Omnigent removed
>   ([ADR-009](adr-009-claude-code-native-is-the-only-runtime.md)). `omnigent/validate-bundles.sh`, the
>   script this ADR's CI would have run, no longer exists, and the CI never landed. **Kept for the
>   record** — the need it identified (fkit has *no* automated verification) is still unmet and still
>   open; see `../architecture.md`.

**How much of the ADR `0256` falsified — assessed clause by clause:**

| Clause | Verdict |
|---|---|
| *"superseded — Omnigent removed"* | ✅ **True and unaffected.** |
| *"`omnigent/validate-bundles.sh` … no longer exists"* | ✅ **True and unaffected.** |
| *"the CI never landed"* | ⚠️ **Ambiguous, and this is the trap.** **This ADR's** CI — a workflow running `validate-bundles.sh` — indeed never landed and never can. **A** CI workflow now exists. A correction must not flip this into *"the CI landed"*, which would be false about the decision this ADR records. |
| *"the need it identified (fkit has *no* automated verification) is still unmet and still open"* | ⛔ **FALSE as of `0256`.** This is the defect. |
| *"see `../architecture.md`"* | ⚠️ **Now points at text that says the opposite** — `architecture.md:31` and `:480` both state the suite runs automatically since `0256`. The pointer is not wrong to keep; it now supports the corrected claim instead of the stale one. |

**The rest of the ADR — Context / Decision / Options / Consequences (`:13-70`) — was NOT falsified by
`0256` and is not in scope.** ⚠️ In particular `:15-16` — *"The initiation survey … found **no CI at
all** — no `.github/workflows` directory exists in this repo (confirmed directly)"* — is a **Context
section describing the state on 2026-07-09**. It reads as history, and **history that was true when
written should stay byte-identical.** ⛔ **Do not sweep it.** If the architect judges it needs a
dated marker for a reader who lands there cold, **that is a judgement to state and justify, not to
assume.**

### ⚠️ CI HAS NEVER EXECUTED — nothing this task writes may say otherwise

Measured at filing: `.github/workflows/test.yml` **exists and parses on darwin**. **That is all that
is established.** `architecture.md:32-33` already records this in the same terms: *"⚠️ **The CI half
has never actually run**: the workflow is verified by review, not by a run."*

⛔ **The corrected ADR text must not assert that CI works, runs green, or protects anything.** The
defensible claim is narrow: **two mechanisms are now wired — an in-release `npm test` gate (watched
refusing a red tree) and a CI workflow (never executed).** ✅ **The release gate is the half with
evidence; the CI half is not.** Say both, and keep them distinguished. **A correction that overstates
is a worse defect than the stale claim it replaces** — it would be the third generation of an
unverified assertion in this same file.

### The form of the correction is an open choice — surfaced, deliberately not pre-decided

This repo has settled precedent for *"a fact in a decision record was falsified; append rather than
edit in place"* — **an appended, dated note with the original text left byte-identical**:

- `adr-015-…md:220` — *"Amendment — 2026-07-14: a supporting fact was falsified by implementation;
  the decision stands"*
- `adr-016-…md:292` — same shape
- `adr-042-…md:317` — *"Correction note — 2026-08-11: the site count is five under `claude/`, not
  four"*

⚠️ **But the precedent is not a binding owner ruling, and this case differs from all three:** here the
falsified claim sits in the **status line itself**, which is the first thing a reader sees and the
thing an index quotes. An appended note 60 lines below may never be reached by a reader who bounces
off `:3-7`. **A hybrid — correct the status line in place *and* append a dated note recording what
changed and why — is a legitimate third option.**

⚠️ **Also relevant:** [`0198`](../0198-teach-record-decision-the-dated-correction-note-form/brief.md)
is an open backlog row to teach `/fkit-record-decision` the dated-correction-note form. **It has not
shipped**, so there is no canonical procedure to follow yet. ⛔ **Do not treat this row as blocked on
it** — no `Depends on:` edge; the architect can choose a form and state it.

**Choosing among these is part of this task and it is the architect's call. Whichever is chosen,
state the choice and the reason in the close.**

## What to build

One correction to `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md`.

The corrected record must carry **all four** of these, or it has not fixed the defect:

1. **The need ADR-003 identified — automated verification — is no longer unmet.** Name `0256` and
   the date.
2. **What actually landed, in the two-mechanism form**: an in-release `npm test` gate in
   `bin/release.mjs`, and `.github/workflows/test.yml` on push-to-`main` / PR.
3. **⚠️ The CI half has never run.** Stated, not softened.
4. **This ADR's own decision is still dead and still superseded.** `validate-bundles.sh` does not
   exist; nothing here revives it. ⛔ **The correction must not read as ADR-003 having been
   implemented.**

**Optionally** (architect's call, state the verdict either way): whether `../architecture.md` stays
as the pointer, or is replaced with a pointer to §9.1 specifically, which is where the current
posture is written.

### Constraints

- ⛔ **No status-value change.** ADR-003 stays **`superseded`**. `0256` did not un-supersede it.
- ⛔ **No reversal or revival of ADR-003's decision.**
- ⛔ **Do not edit `ai-agents/knowledge-base/architecture.md`** — it is already correct and already
  carries the never-run caveat.
- ⛔ **Do not edit `claude/skills/fkit-wiki-lint/SKILL.md`** — that is
  [`0280`](../0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md),
  filed the same day from the same ruling.
- ⛔ **Do not sweep other ADRs.** Measured at filing, `ADR-014:18` and `ADR-026:48`/`:131` also carry
  no-CI statements. `ADR-014:18` reads as Context/history. `ADR-026`'s two are present-tense and now
  false. **The owner ruled neither filed. Report them; do not fix them.** ⚠️ Widening this row into a
  knowledge-base-wide CI-claim audit is out of scope.
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005) — the vault's copy of ADR-003 is
  [`0282`](../0282-wiki-resync-of-the-no-ci-claims-after-the-0256-ci-landing/brief.md).
- ⛔ **Do not edit any closed task's `brief.md`, `plan.md`, `worklog.md` or `review.md`** — including
  `0256`'s. Amending a closed ledger is `0274`'s shape and needs its own ruling.
- ⛔ No task-file move (ADR-033), no re-rank, no board-row edit beyond this task's own close.
- ⛔ No commit. ⛔ No new devDependency (ADR-014).
- ⚠️ **Every `:NNN` in this brief is a dated anchor measured 2026-08-12; the durable anchor is the
  quoted text. Re-measure at implementation time.**

## Verification steps

1. **The falsification is re-measured by the implementer, not inherited from this brief.** Paste:
   the current status-line text; `ls .github/workflows`; the `bin/release.mjs` gate; and
   `architecture.md:31` / `:480` showing the current posture.
2. **The landed text carries all four required elements** (§What to build). **Quote it in full.**
3. **The never-run caveat is present and unsoftened.** ⚠️ **Show the exact sentence.** A correction
   asserting CI protects anything is a **defect of this task**.
4. **The form of the change is stated and justified** — in-place, appended dated note, or hybrid —
   with the reason. If anything was appended, show the original text is byte-identical.
5. **Status stayed `superseded`** and the decision is not readable as implemented. Quote the landed
   status word.
6. **`:13-70` is untouched** — or, if `:15-16` was genuinely judged to need a marker, show the
   independent reasoning that justified it, separately from the status-line fix.
7. **`git diff --stat` lists exactly one path.** ⛔ `architecture.md`, `ADR-014`, `ADR-026`,
   `fkit-wiki-lint/SKILL.md` and every closed task artifact must be untouched — show it.
8. **Full `npm test` green; state the measured counts.** ⚠️ **Expect this to prove nothing about the
   ADR's wording** — no test reads an ADR body. **Say so explicitly** rather than implying coverage.
   ⚠️ `test/adr-number-uniqueness.test.js` reads ADR **filenames**, not content — it is not coverage
   of this change either.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** follow-up surfaced by [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)
  (closed 2026-08-12), whose CI + release-gate landing falsified ADR-003's status-line claim. Filed
  2026-08-12 on the owner's ruling of the same day, verbatim option label
  **"ADR-003 contradiction (Recommended)"**.
- **⚠️ Sibling rows filed from the same ruling:**
  [`0280`](../0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md)
  and [`0282`](../0282-wiki-resync-of-the-no-ci-claims-after-the-0256-ci-landing/brief.md).
  **No shared file with `0280`; either order is safe. `0282` should run last** — see its own note.
- **⚠️ The reviewer's report was second-hand and this brief does not rest on it.** Every clause above
  was read off `adr-003-ci-runs-validate-bundles.md` on disk at filing. ⚠️ **The reviewer's framing
  was narrower than the file** — it named the *"still unmet"* clause; the independent read also found
  the *"the CI never landed"* ambiguity and the now-inverted `../architecture.md` pointer. **Both are
  in scope; neither was in the report.**
- **⚠️ `0198` (teach `/fkit-record-decision` the dated-correction-note form) is open and unshipped.**
  Recorded as context, **not** a `Depends on:` edge — this row does not wait on it.
- **On merit:** the **Backlog**, unranked, and that is honest. Nothing waits on it, no behavior
  changes, no test reads the ADR body, and it is not on the release path. Its claim to attention is
  that it is a **decision record contradicting landed reality**, and decision records are what later
  decisions are reasoned from.
- **Blast radius if never done:** a reader — human or agent — consults the decision record for
  fkit's verification posture and is told automated verification is *"still unmet and still open"*
  when two mechanisms are wired. Concretely: it is the stated rationale a future "we need CI" task
  would cite, and it is echoed in the vault (`index.md:23`, and the vault's own ADR-003 page) where
  `0282` picks it up.
- **⚠️ Adjacent, deliberately NOT filed:** `ADR-026:48`/`:131`'s present-tense *"no `.github/workflows/`
  in the tree at all"*. **The owner did not rule that filed.** Recorded here so the next reader knows
  it was seen, not missed.
- Filed 2026-08-12 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, edited no ADR line, moved no task file, touched no sprint plan,
  and committed nothing.
