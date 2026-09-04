# Decide whether the active-sprint `sprint-*.md` glob widens, or projects are told to name plans `sprint-N.md`

## ID
0261

## Sprint
Sprint 5

## Priority
Sprint 5 P3

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**This is a decision task. It produces an ADR, not a patch.** The reporter explicitly declined to
make this call for us: *"whether the glob should widen, or whether projects should be told to name
plans `sprint-N.md`, is a product call we are not making for you."*

**The mechanism.** `claude/skills/fkit-status/SKILL.md:26` (2026-08-10) resolves the **active
sprint** by globbing `sprint-*.md` at the top of `ai-agents/sprints/` — *"If there is more than one,
take the highest N and flag the ambiguity."* Source, report §8:

[`ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`](../../../knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md)

⚠️ **That filename is date-last and does not match `reports/README.md`'s `YYYY-MM-DD-<slug>.md`
convention.** Kept byte-identical, name included, because it is a foreign artifact we did not author.

### ⚠️ On the reporter's repo this is NOT a separate lower-stakes call — it compounds on one file

The report files this as §8, "clearly a separate call". **That under-states it, and the ADR must
carry the compounded form.** On the reporter's repo the two findings land on the **same file**:

1. Their plans are named `plan-sprint-N.md`, so the only file matching `sprint-*.md` is
   **`sprint-backlog.md`** — a board of explicitly *unscheduled* work. A bare `/fkit-status` selects
   it as "the active sprint".
2. That same file's basename is `sprint-backlog`, **not** `backlog`, so the `dashboard.sh:92` special
   case does **not** fire and its identity resolves empty too.

**Net effect: the wrong board is selected, and that board then silently loses the check the
`[ "$PLAN_SPRINT" = "Backlog" ]` arm exists to provide** — the "scheduled but still parked on the
unscheduled board" test at `dashboard.sh:796`, which the code's own comment calls *"the single
highest-value drift this board can surface"*. One naming convention costs them both the board
selection and the check.

**Our own `backlog.md` header already documents the glob hazard** — *"⚠️ The filename is deliberately
`backlog.md`, NOT `sprint-backlog.md` … Do not 'normalize' this name"* — which is how the reporter
noticed. **That warning lives in a file a downstream project only gets if it took our scaffold copy
and read the header.** Whether a load-bearing naming rule may live only in a template's prose is part
of what this decision has to settle.

## What to build

An ADR under `ai-agents/knowledge-base/decisions/`, via `/fkit-record-decision`.

1. **Decide, and record why the rejected options were rejected by name.** At least:
   - **Widen the glob** (e.g. `*sprint*.md`, or a configured pattern). ⚠️ Weigh the direct cost: the
     backlog board's exclusion from the default status run **is** its filename not matching the glob.
     A wider glob that catches `sprint-backlog.md` also catches our own `backlog.md` under most
     widenings — turning unscheduled work into the reported active sprint, which is precisely what
     `backlog.md`'s header forbids. Say how a widening avoids that, or reject it for that reason.
   - **Name it a convention and enforce it** — plans are `sprint-N.md`, the backlog board is
     `backlog.md`, and fkit says so somewhere a consuming project reads (the structure spec, the
     scaffold, `PROJECT.md`, a launch notice — pick and justify the site).
   - **Make it explicit rather than inferred** — an index or a marker inside the plan naming the
     active board, so selection stops depending on filenames at all. Weigh it honestly against the
     project's zero-config posture.
   - **Do nothing**, and accept that a project naming its plans otherwise gets the wrong board. A
     legitimate outcome if argued; not a default.
2. **Rule explicitly on the compounded case above** — a `sprint-backlog.md` that is both selected as
   the active sprint and identity-less. Whatever is decided, that specific file name must have a
   stated outcome.
3. **Say whether this is fkit's problem or the project's**, in one sentence, and let the rest follow
   from it. That is the actual product question underneath.
4. **State the enforcement point, or state that there is none.** A naming rule that lives only in a
   template header is a rule nobody enforces — `claude/structure-spec.md` and the launch notice are
   the two mechanisms that already exist. If the decision is "prose only", say so and say why, the
   way ADR-038 states its own residual.
5. **Carry a `Re-raise only if` clause.**

### ⛔ Out of scope

- ⛔ **No implementation.** No edit to `claude/skills/fkit-status/SKILL.md`, `dashboard.sh`,
  `claude/structure-spec.md`, `ai-agents/sprints/backlog.md`, or the scaffold copies. Decision output
  only.
- ⛔ **Do not decide the `PLAN_SPRINT` matcher here** — that is
  [`0260`](../0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md).
  **Coordinate, do not merge.** ⚠️ If `0260` lands first and changes what this should decide, say so.
  If this lands first, it may constrain `0260` — name the constraint rather than assuming it.
- ⛔ **Do not rename `ai-agents/sprints/backlog.md`.** Its name is load-bearing and its header says
  so.
- ⛔ **Do not file the implementation brief.** Producer's act.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005).
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. The ADR exists under `ai-agents/knowledge-base/decisions/`, its number allocated by the **four-way
   sweep** — `decisions/`, `reports/`, the sprint boards, **and** `wiki-vault/` (read-only).
2. It records the compounded `sprint-backlog.md` case — wrong board selected **and** identity empty —
   and gives that filename a stated outcome.
3. At least three options are weighed and the rejected ones are rejected **by name**, each with the
   reason.
4. It states, in one sentence, whether this is fkit's problem or the consuming project's.
5. It names an enforcement point or states explicitly that there is none and why.
6. It says whether it constrains, or is constrained by, `0260`.
7. It carries a `Re-raise only if` clause.
8. `git status --porcelain` shows no change under `claude/`, `test/`, or `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **On merit:** as ranked — `Sprint 5 P3`. Same root cause as `0259`/`0260` — one naming mismatch in
  a second place — and the compounding above means a `PLAN_SPRINT` fix that ignores the glob leaves
  half the defect standing. It ranks below `0260` because the matcher is the larger half and because
  `0260`'s outcome may constrain this one.
- **Coordination, not a dependency:** interacts with
  [`0260`](../0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md).
  ⚠️ **Deliberately NOT a `Depends on` declaration** — both are writable independently and a false
  label would render this row `after 0260`. Form per
  [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md);
  separate-bullet shape per the `0149` / `0184` precedent.
- ⚠️ **This decision may need owner sign-off before it is actionable**, like
  [`0255`](../0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md): "tell
  projects how to name their files" is a product posture, not an implementation detail. Flagged for
  the owner; the architect should return the recommendation rather than assume the posture.

- **✅ THE POSTURE IS RULED — OWNER RULING, 2026-08-10. The bullet above is left byte-identical; this
  one answers its posture half.** Given via `AskUserQuestion` in a live session — a selection from the
  question's option list, **the option label is the verbatim text**:

  > **"fkit adapts to the project"**

  Option description as presented to the owner, verbatim: *"Real projects name files how they want,
  and fkit's job is to work on them. Argues for widening the glob and the matcher. Cost: more
  ambiguity to handle, and §6's letter-suffix trap becomes fkit's problem to solve correctly."*

  - **This answers question 3 of `## What to build` above** — *"Say whether this is fkit's problem or
    the project's"*. **It is fkit's problem.** The ADR states that as ruled, not as its own finding,
    and cites this ruling by date and channel.

  ### ⛔ IT IS A POSTURE, NOT THE DECISION — and it pre-approves nothing

  **Read this before treating the ruling as an answer.** The owner ruled on **which way to lean**; the
  architect still owes the whole ADR. Four things are **unchanged** by it, and an ADR that treats any
  of them as settled does not satisfy this brief:

  1. **The ADR is still owed.** Every requirement in `## What to build` stands — options weighed and
     rejected **by name**, the compounded `sprint-backlog.md` case ruled on explicitly, an enforcement
     point named or its absence stated, and a `Re-raise only if` clause.
  2. **The report's §6 constraint is untouched and still binding: *a wrong identity is strictly worse
     than no identity*.** "fkit adapts" does **not** license a matcher that resolves
     `plan-sprint-4c.md` to `Sprint 4`. That is not adapting to the project — it is silently
     misreading it, and it converts today's **loud** failure into a **silent** one.
  3. **The regression guard is non-negotiable and survives the posture in full: a genuinely
     unidentifiable plan MUST still report `unresolved-plan-sprint`.** Adapting to more shapes does
     not mean guessing at the shapes it still cannot read. There is no branch in which the tool
     guesses.
  4. **The cost is the owner's, and it is stated in the ruling's own words** — *"§6's letter-suffix
     trap becomes fkit's problem to solve correctly"*. **`plan-sprint-4b.md` / `plan-sprint-4c.md` are
     now fkit's to handle correctly or to refuse loudly.** Accepting the posture is accepting that
     work, not waiving it.
  5. **The `backlog.md` hazard is not waived either.** A widening that catches `sprint-backlog.md`
     catches our own `backlog.md` under most widenings, which is exactly what `backlog.md`'s header
     forbids. The ADR must still say how a widening avoids that, or reject the widening for that
     reason — the posture makes this question **harder**, not optional.

  ⛔ **Do not cite this ruling as approval of a naive widening.** It is the tie-breaker on direction.
  Everything above still has to be argued out and written down.

- **Cross-referenced into
  [`0260`](../0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md)**,
  because the posture bears on the matcher as well as the glob. ⚠️ **Recorded there as a pointer, not
  a copy** — this brief holds the authoritative text.

- **A second owner ruling of 2026-08-10 lands on `0260` and reaches this task's subject matter:** the
  downstream project's pre-release test of the landed pattern is **accepted and gates the release
  cut**, and one of its four named hard cases is **`sprint-backlog.md`** — the compounded case this
  brief exists to rule on. Full record in `0260`'s Notes. ⚠️ **It does not gate this brief's close**;
  it gates the release.
- **Line-number citations above are dated (2026-08-10) anchors of convenience**; the durable anchors
  are the quoted text and the report's section numbers.
  [`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md) is the open task for
  the convention page.

  > ⚠️ **Dated correction 2026-09-03 (`0320`, inside sweep `0356`) — `0171` is no longer open.** It
  > closed **2026-08-22**; its `## Status` reads `✅ Done (agent-closed — not owner-verified)` and its
  > folder now sits in `ai-agents/tasks/done/`. **The sentence above is left byte-identical** as the
  > record of what was true when this brief was written. ⭐ **The link above still resolves correctly** —
  > citer and target both sit in `ai-agents/tasks/done/` now, so the relative href still lands and a
  > reader who follows it goes to the right place. ⛔ **Nothing here changes `0261`'s status, scope
  > or rank.**
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, onto the Sprint 5 board, under
  the owner's Sprint 5 scope ruling of the same day.
