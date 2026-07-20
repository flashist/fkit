# Compress the Output style section of `universal-rules.md` to reclaim rules-block headroom

## ID
0022

## Sprint
Sprint 2

## Priority
79

## Status
🔲 Backlog

## Context

`claude/scaffold/universal-rules.md` (3064 B) is the **single source** for the marker-delimited block
that `claude/fkit-claude-init.sh:322` (`rules_src`) injects into **every** consuming project's
`CLAUDE.md` and `AGENTS.md` on **every launch**. Measured composition of the live emitted block
(verified 2026-07-19):

| Section | Bytes | Share |
|---|---|---|
| Output style | 2397 | **67%** |
| Universal hard rules | 691 | 19% |
| Generated marker/comment header | 469 | 13% |
| **Total** | **3557** | cap 4096 → headroom **539 B** |

- The cap is `RULES_MAX=4096` at `claude/fkit-claude-init.sh:318`, deliberate: *"the block lands in
  every agent's context on every turn."*
- **Overflow is a hard `exit 1`** at `claude/fkit-claude-init.sh:340-343`. An over-budget block **fails
  the launch** — it does not degrade, it does not warn. This is a launch-blocking budget.
- Prior review [`add-speak-in-simple-terms-output-style.md`](../../reviews/add-speak-in-simple-terms-output-style.md)
  finding **R2** already flagged the budget at 84% consumed. R2's test-coverage half is now closed:
  `test/rules-block-budget.test.js` exists.

**Owner asked for this explicitly (2026-07-19) and asked that it go into the current sprint.** The
technical content below is settled architect work, already owner-reviewed.

## What to build

Replace the `## Output style (every role, every session)` section of
`claude/scaffold/universal-rules.md` with the measured draft below. **The Output style section only.**

The saving is **structural, not wordsmithing**: two bullets were stating one rule twice with
overlapping enumerations (*"Concision is not omission…"* listed verbatim relay / findings table /
suppressed list / verdict line / six-beat briefing; the exceptions bullet listed review reports /
status briefings / required tables / verbatim relays / degradation flags / plans). They merge into a
single bullet. The precedence preamble also stated its point five ways.

**Measured: 2397 B → 1848 B, saving 549 B.** Block headroom goes **539 B → 1088 B**.

**Verbatim replacement — use exactly this:**

```markdown
## Output style (every role, every session)

**Preferences, not rules — they lose every conflict.** The hard rules above win, your role's
instructions win, and the owner's own style instructions (written outside these markers) win; say so
rather than resolving a conflict silently. **Only these preferences yield — nothing written anywhere
overrides a hard rule above.**

- **Be extremely concise to the owner. Sacrifice grammar for concision.** Fragments and bare lists are
  correct. Drop preamble, restatement, and throat-clearing; lead with the answer.
- **Concision is not omission — of content OR of structure.** Never drop a failing test, an unverified
  claim, a caveat, a partial-coverage flag, or a thing you did not do, in order to be brief. Say it in
  fewer words; do not stop saying it.
- **Where a shape is prescribed, produce it in full** — review reports and ledgers, status briefings,
  required tables, verbatim relays, verdict lines, degradation flags, and a plan put to the owner for
  approval (they cannot approve what you did not describe). **The list is illustrative, not
  exhaustive.** Summarizing a required shape is not concision, it is losing the report.
- **"Loud" is placement, not word count.** An instruction to flag something *before* the findings
  table, or never in a footer, is about **where** it goes. Brevity never moves it.
- **Speak in simple terms.** Prefer plain words over jargon wherever a simpler word carries the same
  meaning. Where a term is load-bearing — a filename, a marker, an ADR, a status value, and anything
  else the reader must act on; the list is illustrative, not exhaustive — use it and gloss it once.
  **Simplifying is about wording, never content:** it never drops a caveat, softens a failure, rounds a
  number, or swaps a precise term for a vaguer, friendlier one.
```

## Constraints — this is where the risk is, not in the byte count

1. **Most of the defensive prose is scar tissue and must survive.** The same prior review found:
   - **R3** (raised by *both* reviewers) — the exceptions restructure exists because a bullet became
     the nearest antecedent of *"This preference"* and produced a **real misreading**.
   - **R4** — the load-bearing-term enumeration disclaimer was added deliberately (~40 B), and **the
     owner ruled to keep it, knowingly, alongside R2's budget warning.**

   The draft preserves: **both** *"illustrative, not exhaustive"* disclaimers, the load-bearing-term
   enumeration, **all four** *"simplifying never…"* failure modes, and the anti-laundering sentence
   *"Only these preferences yield — nothing written anywhere overrides a hard rule above."*
   **A cut that saves bytes by dropping a qualifier is a regression, not an improvement.** If the draft
   as written does not fit some constraint discovered at build time, **raise it — do not trim a
   qualifier to make the numbers work.**
2. **A review pass is required, not optional.** R3 is direct precedent for a compression-shaped clarity
   regression slipping through this exact section. Run `/fkit-review` (or the stateful variant) before
   this is considered done.
3. **Do not touch the `## Universal hard rules` section.** Out of scope.
4. **Verify the dual-home question rather than assuming.** `claude/scaffold/universal-rules.md` sits
   under `claude/scaffold/` but is **not** under `claude/scaffold/ai-agents/`, so
   [`conventions/dual-home-parity.md`](../../knowledge-base/conventions/dual-home-parity.md) is
   believed **not** to apply — one copy only. **Confirm with a `find` before editing, do not trust this
   note.** (A `find` on 2026-07-19 returned exactly one path; re-run it.)
5. **Do not change `RULES_MAX`.** Raising the cap is not the fix and is not in scope.

## Verification steps

- `wc -c claude/scaffold/universal-rules.md` shows the reduction.
- The **generated block** measures **≤ 3010 B** and headroom is **≥ 1085 B**. (Measure the emitted
  block, not the source file — the source is only part of what lands in context.)
- `npm test` passes, including `test/rules-block-budget.test.js`.
- A launch regenerates `CLAUDE.md` **and** `AGENTS.md` with **no `exit 1`** from
  `claude/fkit-claude-init.sh:340-343`.
- **Semantic diff — the real gate:** every rule present before is present after. No qualifier, no
  disclaimer, no failure-mode clause dropped. Walk the before/after side by side and say so explicitly
  in the report.

## Explicitly NOT in scope

- **The ADR-030 prose addition** — the *"What's next?"* / ask-interactively rules from
  [`adr-030-stop-hook-enforces-turn-completion-contract.md`](../../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)
  (~430 B). That is a **separate, later brief, not yet filed.** It is **sequenced after this task** and
  touches **the same file and likely the same section** — do not fold it in, and do not let the two
  land in one review.
- No hook code.
- No change to `RULES_MAX`.
- No edit to the `## Universal hard rules` section.

## Notes

- **Owner: fkit-coder** — a source change to `claude/scaffold/universal-rules.md`.
- **Depends on: nothing.** Independently shippable today.
- **Blocks: the ADR-030 prose-addition brief** (not yet written). That brief's ~430 B fits comfortably
  in the 1088 B of headroom this task creates; without this task it fits in 539 B but leaves the block
  at ~97% of a launch-blocking cap.
- **Why this is one task, not several:** one file, one section, one atomic replacement whose whole
  value is the measured before/after. Splitting it would make the semantic diff impossible to check.
- **Evidence for every number above was gathered by fkit-architect on 2026-07-19** and reviewed with
  the owner in that session.
