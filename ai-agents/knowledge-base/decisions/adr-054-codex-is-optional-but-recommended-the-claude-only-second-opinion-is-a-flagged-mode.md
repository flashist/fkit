# ADR-054: Codex is optional but recommended; the Claude-only second opinion is a supported, loudly flagged mode

- **Status:** accepted
- **Date:** 2026-10-05
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect. The **substance** was ruled by the owner on
  **2026-10-02** (`fkit-lead` session, `AskUserQuestion`, relayed to a spawned producer). **This record**
  was approved by the owner on **2026-10-05** (`fkit-lead` session, `/fkit-sprint-ship-loop` on Sprint 10,
  `AskUserQuestion`, option *"Approve with ADR-054"*, relayed to fkit-architect by fkit-lead).
- **Amends:** [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) Decision 2 (and the three
  places in ADR-009 that follow from it — listed under §Decision, point 4). The rest of ADR-009 stands.

## Context

**The owner's ruling, 2026-10-02** (selected option text, as recorded in task `0476`'s brief):
*"Optional, recommended — README: 'Codex is optional but recommended — without it the reviewer's second
opinion falls back to Claude-only, loudly flagged.' And file a small task to update CLAUDE.md + record
the change against ADR-009, so the documents agree."* What raised it, in the owner's words the same day:
*"the CODEX is mentioned as a hard dependency, while it's an optional one."*

**The documents and the product disagreed.**

- **ADR-009 Decision 2** (2026-07-11) says *"Codex is a required dependency, not optional"*, that its
  absence is *"a **setup error** … *not* a supported degraded mode"*, and that the
  `[claude-fallback — NOT model-diverse]` path *"is consequently no longer a mode fkit offers"*.
  `CLAUDE.md`, `PROJECT.md`, `architecture.md`, `claude/README.md`, `install.sh` (*"⚠ Required:
  Codex"*) and the launcher comment above `codex_preflight` repeat "required".
- **The product has treated Codex as optional since the same week.** Task `0060`'s owner ruling
  (2026-07-11, [0060 brief](../../tasks/done/0060-make-codex-a-checked-prerequisite/brief.md), the
  passage beginning *"The reviewer does _not_ hard-fail when Codex is unreachable"*) overruled the
  architect's hard-fail recommendation: the reviewer emits a loudly flagged partial instead. It drew one
  line, though — the partial was *"a last-resort safety net for a Codex outage mid-session, **not** a
  supported way to run fkit without Codex installed."*
- **What ships today** (verified against live files 2026-10-05): `codex_preflight` in
  `claude/fkit-claude.sh` only prints a warning to stderr (*"Reviews will run WITHOUT an independent
  second opinion — not model-diverse."*) and launch continues. Each review role then flags it in its own
  words. `fkit-adversarial-review`, running a Claude pass itself instead of Codex, opens that output with
  *"⚠️ [claude-fallback — NOT model-diverse] — THIS REVIEW IS INCOMPLETE."* `fkit-review` gets no second
  opinion at all: it goes on with its own pass only, puts the `[NOT model-diverse — INCOMPLETE]` banner
  above its findings, and forces the verdict to `🟡 Partial review — Codex unavailable`. It never uses
  the adversarial reviewer's label.
  [ADR-042](adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md) D1 names this coverage
  state: *"**Codex unavailable** — the existing loud `[claude-fallback — NOT model-diverse]` case."*
  (ADR-042's wording names only the adversarial reviewer's label; the reviewer's own report marks the
  same state with `[NOT model-diverse — INCOMPLETE]`.)

So ADR-009's *"no longer a mode fkit offers"* has been false since 2026-07-11, and its "required"
framing has not matched what the launcher does since the same day. The 2026-10-02 ruling moves the line
that `0060` drew: running with **no Codex installed at all** becomes a supported, flagged setup — not
only a mid-session outage.

## Decision

1. **Codex is optional but recommended.** When Codex is missing or not logged in, there is no
   model-diverse second opinion: the reviewer goes on with its own Claude pass only, and the
   adversarial reviewer, if run, does a Claude pass itself instead of Codex. Both are loudly flagged.
   The adversarial pass is labelled `[claude-fallback — NOT model-diverse]`. The reviewer's verdict is
   forced to `🟡 Partial review — Codex unavailable` (and `fkit-review` puts the
   `[NOT model-diverse — INCOMPLETE]` banner above its findings). Neither is a complete, model-diverse
   review.
2. **The aim does not change.** The second opinion is meant to come from a different model family. The
   fallback is weaker, is labelled weaker, and is never equal to a Codex review. **The flag is not
   softened** — not in the review output, not in the launcher warning, not in any document's wording.
3. **The launcher warns and never blocks.** `codex_preflight` warns and continues. That has been the
   behaviour since the owner's 2026-07-11 ruling; nothing here changes it.
4. **What this amends in ADR-009 — four places, all following from Decision 2** (line numbers as of
   2026-10-05; ADR-009's body is frozen, so read them with the quoted text):
   - Decision 2 (lines 59-63, *"Codex is a required dependency, not optional"* through *"a review that
     cannot reach Codex is not a complete review"*) — **replaced** by points 1-3 above, **except** as
     the next bullet says.
   - The rejected option *"Make Codex optional, keeping the Claude-only fallback (rejected for now)"*
     (lines 87-89) — this is now the chosen direction.
   - The consequence *"Codex becomes a required install prerequisite"* (line 102) — no longer true.
   - The re-raise trigger *"The Codex hard-dependency proves too costly at install time"* (lines
     111-113) — spent by this ADR (see point 6).

   **Not amended:** Decision 2's sandbox clause (*"`codex exec --sandbox read-only`"*) and the sentence
   that the second opinion runs on Codex *"for genuine model diversity"*. The sandbox flag is governed
   by ADR-042 D2 (owner ruling 2026-08-11: move to `workspace-write`, carried by task `0273`, still in
   the backlog; the live call sites still read `--sandbox read-only`, checked 2026-10-05). ADR-054
   changes it in neither direction. Everything else in ADR-009 — Decisions 1, 3, 4, 5, the Omnigent
   removal, the single-runtime risk — stays in force.
5. **This settles the drift inside ADR-009.** The fallback has shipped in `fkit-review` and
   `fkit-adversarial-review` since the `0060` ruling, and ADR-042's "Codex unavailable" state is built on
   it. ADR-054 makes that mode **supported**, and extends it from "a Codex outage mid-session" to
   "Codex never installed".
6. **How ADR-009's re-raise rule was met — stated honestly.** ADR-009 said to reopen point 2 *"only
   with evidence from actual users"*. **No user evidence was offered.** This reopening is by owner
   ruling (2026-10-02). The trigger was written to stop agents re-arguing the point, not to bind the
   owner, who made the original decision. The ground given is that the documents had drifted from
   behaviour the owner had already ruled on.
7. **Effect on documents.** Every live document says "optional but recommended" and keeps both
   "model-diverse" and "flagged / not a complete review". The installer stops printing "Required" for
   Codex and still says what you lose without it and how to install it. (Applied by task `0476`; this
   ADR does not edit those files.)

## Options considered

- **Optional but recommended; the flagged Claude-only fallback is a supported mode (chosen).** Matches
  what fkit already does and what the owner ruled twice (2026-07-11 behaviour, 2026-10-02 wording).
  Keeps the model-diversity aim and the loud flag intact. Removes a false install barrier.
- **Keep "required" and make the product match it** (hard-fail preflight, remove the fallback).
  Rejected: the owner ruled against walling users out on 2026-07-11 (task `0060`) and ruled Codex
  optional on 2026-10-02. It would also break ADR-042's "Codex unavailable" coverage state.
- **A dated correction note on ADR-009 only, no new ADR.** Rejected: a correction note is for a fact
  that drifted while the decision stands. Here the decision itself changes, so it needs its own record
  plus a pointer in the old one.
- **Optional, and treat the Claude-only pass as an equal second opinion** (drop or soften the flag).
  Rejected: the owner's ruling says *"loudly flagged"*, and the brief requires the change be *"not a
  downgrade of the loud flag"*. A same-model second opinion that reads as complete is the failure the
  flag exists to prevent (ADR-009's own reason, which still holds).

## Consequences

- **Positive:** the documents stop contradicting the product; first run no longer looks blocked on a
  second CLI; ADR-009's internal contradiction (*"no longer a mode fkit offers"* versus shipped
  behaviour) is closed in one act.
- **Negative / costs:** more users may run without model diversity and get only flagged Claude-only
  second opinions. The whole safety of this rests on the flag being impossible to miss — the same load
  the `0060` ruling already placed on it. "Recommended" is weaker pressure to install Codex than
  "required".
- **Residual risks / "re-raise only if":** reopen only if
  - **(a)** a flagged fallback review is shown to have been **taken for a complete review** — the flag
    failed at its one job; or
  - **(b)** the **owner decides** fkit should require model diversity again.

  A finding of the form "Codex is not required" or "reviews can run without model diversity" is **not**
  a new defect; it is this decision, knowingly taken. A finding that a document or output **softens or
  drops the flag** IS a defect against point 2.

  *Owner rulings on this record, 2026-10-05 (same channel as the approval):* re-raise rule
  *"As drafted"*; ADR-009 Status line *"Yes, update the Status line"*; drift test *"No, recorded grep is
  enough"* — no new automated check pins this wording; task `0476`'s verification grep is the record.

## Related

- **Amends** [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) Decision 2 (four places, see
  §Decision point 4). ADR-009 carries a one-line Status pointer and a dated note at its end that route
  here; its body is left byte-identical.
- [ADR-042](adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md) — the "Codex
  unavailable" coverage state this ADR makes a supported setup; owns the sandbox flag (D2).
- Task `0060` (closed) — the 2026-07-11 owner ruling: flagged partial, never a hard fail.
- Task `0476` — applies point 7 to the live documents.
- **Citers left as history — checked 2026-10-05, deliberately not edited.** They say "Codex required"
  as of when they were written; ADR-009's pointer routes readers here.
  - [ADR-016](adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) — line 73 (the
    `codex exec --sandbox read-only` description) and line 330 (*"Codex is a **required** runtime."*).
  - ADR-042 — line 10 (*"ADR-009 makes Codex **required, not"*) and line 298 (*"Codex required, not
    optional"*).
  - [`2026-07-11-plan-omnigent-removal.md`](../reports/2026-07-11-plan-omnigent-removal.md) — lines 45
    and 202: the plan to drop the fallback, which never shipped.
  - [`2026-07-14-shared-instructions-layer.md`](../reports/2026-07-14-shared-instructions-layer.md) —
    lines 137 and 378.
  - [`2026-07-17-askuserquestion-availability-for-agents.md`](../reports/2026-07-17-askuserquestion-availability-for-agents.md)
    — line 231.
- **Checked and not affected:** [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) line
  51 (already superseded by ADR-009); [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md)
  line 143 (a one-time "Codex pass mandatory before task 64" gate — unrelated to the install
  requirement).
- Code (behaviour unchanged by this ADR): `codex_preflight` in `claude/fkit-claude.sh`;
  `claude/skills/fkit-adversarial-review/SKILL.md`; `claude/skills/fkit-review/SKILL.md`; `install.sh`.

> ⛔ **Dated amendment 2026-10-29 — [ADR-061](adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md) adds Codex as a full seven-role runtime.** The Claude-only fallback semantics recorded here remain applicable to legacy Claude operation. For Codex operation, a separate same-model adversarial pass is usable when it actually completes, with visible diversity disclosure; missing or unusable passes remain partial. Follow ADR-061 for those runtime-specific rules and its open public integration details. The text above is **left byte-identical**. **Status stays `accepted`.**
