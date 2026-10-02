# Make every document say Codex is optional but recommended

## ID
0476

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule (2026-09-27): *"if we
> already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* This one changes a recorded decision
> (ADR-009). Being pullable on the board is not his word.

**Owner ruling behind this task** (2026-10-02, `fkit-lead` session, `AskUserQuestion`, selected
option text, relayed to a spawned producer): *"Optional, recommended — README: 'Codex is optional but
recommended — without it the reviewer's second opinion falls back to Claude-only, loudly flagged.' And
file a small task to update CLAUDE.md + record the change against ADR-009, so the documents agree."*

What raised it — the owner's own words, 2026-10-02: *"the CODEX is mentioned as a hard dependency,
while it's an optional one."*

**The gap.** The documents say one thing, the product does another:
- **Documents say "required":** `CLAUDE.md` (Project Overview: *"Codex is **required**, not
  optional"*); [ADR-009](../../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
  Decision 2 (*"Codex is a required dependency, not optional … not a supported degraded mode"*);
  `claude/README.md` (*"Codex is required, not optional"*); `ai-agents/knowledge-base/PROJECT.md`;
  `ai-agents/knowledge-base/architecture.md` (component table + launch diagram:
  *"required-but-WARNED"*); `install.sh` (header comment and the printed *"⚠ Required: Codex"*);
  the launcher comment above `codex_preflight` in `claude/fkit-claude.sh`.
- **The product already treats it as optional:** `codex_preflight` only **warns** and continues (owner
  ruling 2026-07-11); `fkit-review` and `fkit-adversarial-review` both fall back to a **loudly flagged**
  Claude-only pass; ADR-042's coverage vocabulary reports that state explicitly.

**⚠️ A pre-existing conflict inside ADR-009 — surface it, don't paper over it.** ADR-009 Decision 2
also says the Claude fallback *"is consequently no longer a mode fkit offers."* That has been false in
practice for some time (the skills ship it; ADR-042 builds on it). The decision record this task
writes should name that drift and settle it in the same act, not leave a second contradiction behind.

**Meaning that must survive the rewording.** The second opinion is **meant** to be model-diverse.
Without Codex it is **explicitly degraded and flagged** — not equivalent, not "just as good". The
change is *required → optional but recommended*; it is **not** a downgrade of the loud flag.

**Parallel work — do not touch:** the root `README.md` is being fixed under the same ruling by another
coder. Check `git status` before planning; inventory it only to confirm it agrees at the end.

**No conflict with a locked decision beyond ADR-009 itself**, which this task amends on the owner's
ruling. Other ADRs that *cite* ADR-009 as "Codex required" (ADR-016 §related, ADR-042 Context) are
historical bodies — the decision record decides whether they need a pointer; do not rewrite them.

## What to build

1. **Record the decision first — architect consult.** Ask `fkit-architect` to record the change with
   `/fkit-record-decision`: either a **dated amending note** on ADR-009 or a **small new ADR** that
   ADR-009 points to (architect's call). **Do not rewrite ADR-009's body.** It must state: Codex is
   optional but recommended; without it the second opinion falls back to Claude-only and is loudly
   flagged (not a complete, model-diverse review); the launcher warns, never walls; and that this
   settles Decision 2's stale *"no longer a mode fkit offers"* line. Do not edit the other documents
   until the decision text exists.

2. **Inventory first, in the plan.** `grep` the tracked tree for Codex + `required` / `not optional` /
   `hard dependency` / `prerequisite` and list every hit with a keep / change verdict. Skip frozen
   history (`ai-agents/tasks/done/`, `cancelled/`, `sprints/done/`, test fixtures, closed review
   ledgers) and `ai-agents/wiki-vault/` (wiki role only). Known hits are in Context above; the
   inventory must also check:
   - agent prompts (`claude/agents/fkit-reviewer.md`, `fkit-adversarial-reviewer.md`, `fkit-lead.md`)
     and the review skills — likely already correct (they describe the fallback), confirm;
   - launcher help / `fkit` usage text and any printed message;
   - the shipped scaffold and the universal rules block (none found at filing — confirm). If a change
     ever lands in the rules block, mind its byte cap (`RULES_MAX` in `claude/fkit-claude-init.sh`).

3. **Reword each hit to the ruling's meaning**, matching the owner's README sentence in spirit:
   *optional but recommended — without it the reviewer's second opinion falls back to Claude-only,
   loudly flagged.* Keep "model-diverse" and "flagged / not a complete review" wherever they appear.
   `install.sh`'s message: no longer "Required"; still says what you lose and how to install.

4. **Behaviour stays as is.** Do not change `codex_preflight` or the review skills' fallback. **If any
   document and the behaviour disagree in a way the ruling does not settle** (e.g. something that
   actually blocks on Codex), stop and flag it as `NEEDS-DECISION` — do not change behaviour to fit.

5. **Tests that pin wording.** Find any test that asserts the old "required" text (none found at
   filing besides fixtures — confirm) and update it honestly; consider one small pin that the
   documents do not call Codex "required". Run the full suite.

6. Run `claude/fkit-claude-init.sh .` so the dogfooded `.claude/` copies match `claude/`.

**Out of scope:** the root `README.md` (separate fix); any launcher or skill behaviour change; wiki
pages (route a `fkit-wiki` sync afterwards — at filing, `wiki/decisions/adr-009…`,
`wiki/systems/review-and-model-diversity.md` and `wiki/systems/install-and-self-update.md` carry the
old wording); frozen history.

## Verification steps

1. A decision record exists under `ai-agents/knowledge-base/decisions/` (amending note on ADR-009 or a
   new ADR it points to), states "optional but recommended" + the loudly flagged Claude-only fallback,
   and settles Decision 2's stale fallback line. ADR-009's original body text is unchanged (`git diff`
   shows only an appended note/pointer).
2. `grep -rniE 'codex.{0,80}(required|not optional|hard dependency)'` over the tracked, non-frozen tree
   (excluding `wiki-vault/`, `tasks/done|cancelled/`, `sprints/done/`, fixtures) returns no hit that
   calls Codex required — every remaining hit is listed in the worklog with why it stays.
3. `CLAUDE.md`, `claude/README.md`, `PROJECT.md`, `architecture.md`, `install.sh` each say optional but
   recommended **and** still say the fallback is flagged / not model-diverse.
4. `claude/fkit-claude.sh` behaviour unchanged: `git diff` on it touches comments only (or nothing);
   with `codex` off `PATH`, `fkit` still warns and launches.
5. Rules block untouched, or if touched, the `RULES_MAX` check passes.
6. Full test suite green; state the pass count.
7. `.claude/` copies refreshed and matching `claude/`.
8. Root `README.md` (done separately) and the updated documents agree — checked by reading, noted in
   the worklog.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Why one brief, not two:** the owner asked for "a small task" covering CLAUDE.md + the ADR-009
  record together, "so the documents agree". The decision record and the rewording are only useful
  shipped together — the record alone leaves the docs contradicting it, the rewording alone
  contradicts ADR-009. Sequenced inside the task (step 1 first) instead of split.
- **Related:** the root `README.md` Codex fix under the same ruling (separate, in flight at filing,
  not a task brief here).
- **Follow-up after close:** a `fkit-wiki` sync so the wiki pages listed in Out of scope match.
- **Consulted:** none at filing — the ADR shape (amending note vs new ADR) is left to the architect
  consult in step 1.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
