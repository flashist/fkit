# Verify the codex half of the HTML-comment-stripping canary

## ID
0177

## Sprint
Sprint 6

## Priority
Sprint 6 P4

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The fkit-managed rules block is wrapped by `emit_block()` in `claude/fkit-claude-init.sh` and
re-injected into every consuming project's `CLAUDE.md` **and** `AGENTS.md` on every launch. The
wrapper — HTML comments plus markers — costs **404 B** of the `RULES_MAX=4096` cap.

**Half of the question of whether that 404 B also costs *agent context* is answered; half is not.**

- **Claude half — measured firsthand during task `0130`.** **Claude Code 2.1.220 strips HTML comments
  from `CLAUDE.md`** before they reach agent context. So the wrapper costs cap budget without costing
  Claude-side context.
- **Codex half — never measured.** Whether **`codex-cli 0.145.0`** strips HTML comments from
  `AGENTS.md` is **second-hand**, from an architect consult during `0130`. Nobody has run it.

Two rationale comments in the tree currently carry an **explicit hedge** about this and assume the
**conservative default that codex still pays** for the wrapper:

- the comment at the `RULES_MAX` assignment site in `claude/fkit-claude-init.sh`
- the header comment in `test/rules-block-budget.test.js`

Both were written that way deliberately during `0130` — the hedge is honest, not sloppy — but a hedge
that can be resolved by one measurement should be resolved.

**Why it matters beyond tidiness.** If codex **also** strips HTML comments, the wrapper costs **no
agent context at all, on either side** — only cap budget. That is a live input to any future
rules-block budget decision, and it is currently unknown.

**⚠️ Standing trap, recorded in `0130` — read before proposing anything.** A finding that "the wrapper
costs no agent context" must **not** become an argument for capping the **source** file instead of the
**emitted** block. **The owner ruled on 2026-08-01 that the cap keeps measuring the emitted block**,
unchanged. The coder flagged the alternative in `0130` as *"a 493 B cap loosening wearing a correctness
costume"*. This task **measures and corrects two comments**; it does not reopen cap semantics. If the
measurement genuinely seems to argue for a semantics change, that is a **separate proposal put to the
owner**, never a change made inside this task.

**Conflicts with no locked decision.** It is bounded by ADR-016's harness-version discipline (below),
which it follows rather than contests.

## What to build

An **investigation with a small documentation correction attached** — measure, then fix or confirm the
two hedges. No behavior change, no cap change.

1. **Measure the codex half firsthand.** Determine empirically whether `codex-cli 0.145.0` strips HTML
   comments from `AGENTS.md` before they reach model context. Design a canary the way the Claude half
   was measured in `0130`: something that is *observable in the model's own output* if and only if the
   comment survived. Do not infer from documentation, and do not carry the architect consult forward as
   evidence — it is the thing being checked.
2. **Version-stamp the result** per **ADR-016's harness-version discipline** — the finding is about a
   specific harness build, so record the exact codex version measured (and re-state the Claude-side
   version and date already established in `0130`). A stripping behavior is a harness implementation
   detail that can change under us; an unstamped claim rots silently.
3. **Correct or confirm both hedges** — the `RULES_MAX`-site comment in `claude/fkit-claude-init.sh`
   and the header comment in `test/rules-block-budget.test.js`. Three outcomes, three edits:
   - **codex strips** → replace the hedge with the measured fact plus its version stamp, and state the
     consequence (the wrapper costs no agent context on either side, only cap budget).
   - **codex does not strip** → keep the conservative assumption but replace *"assumed"* with
     *"measured"* plus the version stamp, so the next reader does not re-open a settled question.
   - **inconclusive** → say so explicitly, say what was tried and why it did not settle it, and keep
     the conservative default. **An inconclusive result is a valid outcome of this task** — record it,
     do not manufacture a verdict.
4. **Change nothing else.** No `RULES_MAX` edit, no cap-semantics edit, no wrapper edit, no rules-block
   content edit. The byte figures established in `0130` (3570 B emitted, 526 B headroom, ≥400 B
   standing target) stand.

## Verification steps

1. **The canary was actually run** against `codex-cli`, and the transcript or observable output that
   settles the question is quoted in the worklog — not a claim that it was run.
2. **The exact codex version measured is recorded** in the worklog and in both corrected comments.
   `codex --version` output is reproduced; if it differs from `0.145.0`, that is fine and the new
   number is what gets stamped — but the difference is called out.
3. **Both comment sites updated** — `claude/fkit-claude-init.sh` (the `RULES_MAX` site) and
   `test/rules-block-budget.test.js` (header) — and neither still reads as an unresolved assumption
   unless the outcome was genuinely inconclusive, in which case both say *inconclusive* and why.
4. **No functional change:** `git diff` touches only comment text (plus any new test/canary artifact
   the work deliberately adds). `RULES_MAX` is unchanged at **4096**; the cap still measures the
   **emitted** block.
5. **Suites stay green:** `node --test test/*.test.js` and `bash test/prove-red.sh` both pass, with the
   pass/fail counts reported.
6. **Byte budget unmoved:** the emitted block still measures **3570 B** with **526 B** headroom (or, if
   it has legitimately changed since `0130` closed, the new figure is re-measured and reported rather
   than assumed).
7. **The trap was not walked into:** the work product contains **no** change to what the cap measures,
   and no recommendation to cap the source file folded into this task. If the measurement suggests one,
   it appears as a **question for the owner**, not an edit.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Priority: low.** Nothing is blocked on this. It is a hedge-resolution and a budget-decision input,
  not a fix.
- **Prompted by:** task `0130` (reclaim rules-block budget headroom), which measured the Claude half
  firsthand, left the codex half explicitly unverified, and carried it forward as a residual.
- **Owner rulings this task inherits (2026-08-01, from `0130`):** the cap keeps measuring the **emitted**
  block; standing headroom target **≥400 B**; cap rationale is **discipline primary** (ADR-016's
  eviction conversation) with attention dilution **suspected but unmeasured and flagged as such**.
- **Investigation-first by design** — the shape of the correction depends on the measurement, so the
  brief scopes the measurement and all three of its possible outcomes rather than pre-writing a fix.
- A **review pass is warranted but light** — this edits comments in the rules-block enforcement path,
  which every agent reads on every turn, so wording accuracy matters more than usual for a doc change.
- No commit — leave the change in the working tree.
