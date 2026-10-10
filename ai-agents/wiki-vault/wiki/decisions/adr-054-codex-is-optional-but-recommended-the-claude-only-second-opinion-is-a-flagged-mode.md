# ADR-054: Codex is optional but recommended; the Claude-only second opinion is a supported, loudly flagged mode

**Date**: 2026-10-05
**Status**: accepted

**Amends**: [[decisions/adr-009-claude-code-native-is-the-only-runtime]] Decision 2 (four places). The rest of ADR-009 stands.

## Context
The **substance** was ruled by the owner on **2026-10-02** (`fkit-lead` session, `AskUserQuestion`, selected
option text, relayed to a spawned producer): *"Optional, recommended — README: 'Codex is optional but
recommended — without it the reviewer's second opinion falls back to Claude-only, loudly flagged.' And file a
small task to update CLAUDE.md + record the change against ADR-009, so the documents agree."* What raised it,
in his words the same day: *"the CODEX is mentioned as a hard dependency, while it's an optional one."* The
**record** itself was approved by the owner on 2026-10-05 (option *"Approve with ADR-054"*, relayed to
`fkit-architect` by the lead).

**The documents and the product disagreed.**
- ADR-009 Decision 2 (2026-07-11) says Codex is *"a required dependency, not optional"*, that its absence is a
  *"setup error … not a supported degraded mode"*, and that the Claude fallback *"is consequently no longer a
  mode fkit offers"*. `CLAUDE.md`, `PROJECT.md`, `architecture.md`, `claude/README.md`, `install.sh` (*"⚠
  Required: Codex"*) and the launcher comment repeated "required".
- **The product had treated Codex as optional since the same week.** Task `0060`'s owner ruling (2026-07-11,
  [[tasks/make-codex-a-checked-prerequisite]]) overruled a hard-fail: the reviewer emits a loudly flagged
  partial — but only as *"a last-resort safety net for a Codex outage mid-session, **not** a supported way to
  run fkit without Codex installed."*
- **What ships** (verified against live files 2026-10-05): `codex_preflight` only warns and launch continues.
  `fkit-adversarial-review`, running a Claude pass itself, opens with *"⚠️ [claude-fallback — NOT
  model-diverse] — THIS REVIEW IS INCOMPLETE."* `fkit-review` gets no second opinion at all, puts the
  `[NOT model-diverse — INCOMPLETE]` banner above its findings, and forces the verdict to
  `🟡 Partial review — Codex unavailable`. [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]]
  D1's *"Codex unavailable"* coverage state is built on this.

So ADR-009's *"no longer a mode fkit offers"* had been false since 2026-07-11. The 2026-10-02 ruling **moves
the line `0060` drew**: running with **no Codex installed at all** becomes a supported, flagged setup — not
only a mid-session outage.

## Decision
1. **Codex is optional but recommended.** Without it there is no model-diverse second opinion: the reviewer
   goes on with its own Claude pass only, the adversarial reviewer (if run) does a Claude pass itself. Both are
   loudly flagged — `[claude-fallback — NOT model-diverse]` on the adversarial pass; the reviewer's verdict
   forced to `🟡 Partial review — Codex unavailable` with the `[NOT model-diverse — INCOMPLETE]` banner.
   **Neither is a complete, model-diverse review.**
2. **The aim does not change.** The second opinion is meant to come from a different model family. **The flag
   is not softened** — not in review output, not in the launcher warning, not in any document's wording.
3. **The launcher warns and never blocks** (unchanged since 2026-07-11).
4. **Four places in ADR-009 are amended**, all following from Decision 2: Decision 2's "required … no longer a
   mode fkit offers" text; the rejected option *"Make Codex optional"* (now the chosen direction); the
   consequence *"Codex becomes a required install prerequisite"*; the re-raise trigger on the hard dependency
   (spent). ⛔ **Not amended:** Decision 2's sandbox clause (governed by ADR-042 D2; still `--sandbox
   read-only` at the live call sites, checked 2026-10-05) and the model-diversity aim. Everything else in
   ADR-009 stays in force.
5. **It settles the drift inside ADR-009** and extends the supported mode from "Codex outage mid-session" to
   "Codex never installed".
6. **How ADR-009's re-raise rule was met — stated honestly:** ADR-009 said to reopen point 2 *"only with
   evidence from actual users"*. **No user evidence was offered.** This reopening is by owner ruling; the
   trigger was written to stop agents re-arguing, not to bind the owner who made the original decision.
7. **Effect on documents:** every live document says "optional but recommended" and keeps both
   "model-diverse" and "flagged / not a complete review"; the installer stops printing "Required" and still
   says what you lose. Applied by task `0476`, not by this ADR.

**Options rejected:** keep "required" and make the product match it (hard-fail; breaks ADR-042's coverage
state and the owner's 2026-07-11 ruling); a correction note only (the decision itself changed, so it needs its
own record); optional **and** treat the Claude-only pass as equal (drops the flag — the failure the flag
exists to prevent).

## Consequences
- **Positive:** documents stop contradicting the product; first run no longer looks blocked on a second CLI;
  ADR-009's internal contradiction closed in one act.
- **Costs:** more users may run without model diversity. **The whole safety of this rests on the flag being
  impossible to miss.** "Recommended" is weaker pressure to install Codex than "required".
- **Re-raise only if** (a) a flagged fallback review is shown to have been **taken for a complete review**, or
  (b) the **owner decides** fkit should require model diversity again.
- ⛔ **Do not raise "Codex is not required" or "reviews can run without model diversity" as a defect** — that is
  this decision. ⚠️ **A document or output that softens or drops the flag IS a defect** against Decision 2.
- Owner rulings on the record, 2026-10-05: re-raise rule *"As drafted"*; ADR-009 Status line *"Yes, update the
  Status line"*; drift test *"No, recorded grep is enough"* — **no automated check pins this wording**; task
  `0476`'s verification grep is the record.
- **Citers deliberately left as history** (checked 2026-10-05): ADR-016, ADR-042, and three 2026-07 reports
  still say "Codex required" as of when they were written; ADR-009's pointer routes readers here.

## Related
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — amended (Decision 2); its body is left byte-identical with a Status pointer and a dated note
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the "Codex unavailable" coverage state this makes a supported setup; owns the sandbox flag
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — a citer left as history
- [[tasks/make-codex-a-checked-prerequisite]] — `0060`, the 2026-07-11 ruling (flagged partial, never a hard fail) whose line this moves
- [[tasks/make-every-document-say-codex-is-optional-but-recommended]] — `0476`, which recorded this ADR and applied Decision 7
- [[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]] — its Codex plan pass depends on this fallback flag reaching the owner
- [[systems/review-and-model-diversity]] · [[systems/install-and-self-update]] · [[systems/fkit]]
- [[tasks/sprint-10-the-0472-0482-batch]] — the sprint it was decided in
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[tasks/build-the-opt-in-plan-review-step-off-by-default]] — Build the opt-in plan-review step (off by default)
