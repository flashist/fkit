# Worklog — 0128 Add the ADR-030 prose half to the universal rules block

**Task:** `0128-add-adr-030-prose-half-to-universal-rules` · **Owner:** fkit-coder · via
`/fkit-task-ship-loop`. Plan approved (see `plan.md`). Status → 🔄 In progress (brief + sprint row).

## Owner-decision log
- Plan approved (upfront gate). No mid-build decisions.

## Build
- **EDIT `claude/scaffold/universal-rules.md`** — appended two bullets to the **Output style** section
  (ADR-030 Decision 8): **"Close with 'What's next?'"** (with both load-bearing qualifiers — *never
  invent a next step*, *never assert repo state you did not check this turn* + the
  `evidence-before-assertion.md` bind) and **"Ask interactively"** (`AskUserQuestion` in a session; open
  questions in a consult). No hook/code change (the hook is 0127, shipped).

## Verification
- **Byte budget:** emitted block **3065 → 3708 B / 4096** → **388 B headroom (91% used)**. Under the cap
  with margin; `test/rules-block-budget.test.js` green.
  - ⚠️ **Observation (not a 0128 defect):** the block is now at 91%. Future cross-cutting rules have only
    ~388 B before the launch-abort cap; the next addition may need a compression pass (0022 precedent) or
    a cap revisit. Flagged for the owner/architect, not fixed here.
- **Single-home re-check (0022 precedent):** `find` → exactly one `claude/scaffold/universal-rules.md`.
- **Load-bearing qualifiers intact:** both present in the shipped bullet.
- `node --test test/*.test.js` → **511 pass / 0 fail** (incl. rules-block-budget + the "live CLAUDE.md
  carries exactly one well-formed rules block" test). `bash test/prove-red.sh` → **hard gate PASSED**.
- The updated block re-injects into a consuming project's CLAUDE.md/AGENTS.md on the next `fkit` launch
  (`emit_block()`); the repo's own CLAUDE.md block refreshes at that point (source-edit only, per design).

## Review — Round 1 (model-diverse: reviewer + Codex v0.145.0) → changes requested, resolved
Both load-bearing qualifiers intact; budget under cap; prose/hook agree byte-for-byte (straight
apostrophe); single-home confirmed. 2 low findings:
- **R1 (doc-pointer defect) — FIXED** (owner: expand to full path): the `evidence-before-assertion.md`
  reference is now `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` (resolvable).
  Re-measured: block **3733 B / 4096 → 363 B headroom (91.1%)**.
- **R2 ("to fill it") — accepted residual** (owner: keep design wording; it's §5.5 verbatim, names the
  filler failure mode).
- **Headroom 91.1%** → owner directed a **follow-up** (compression / `RULES_MAX` revisit); producer filing.

## Close-out evidence packet
- **Outcome:** ADR-030's prose half shipped — the two hook-unenforceable clauses now live in the managed
  rules block, universal across roles. ADR-030 is now complete (hook 0127 + prose 0128 + addendum).
- **Verification (final):** `node --test test/*.test.js` → **511 pass / 0 fail** (rules-block-budget +
  well-formed-block tests green); `bash test/prove-red.sh` → **hard gate PASSED**. Block **3733 B /
  4096** (363 B headroom).
- **Brief steps 1–4:** met (1 both clauses + qualifiers present; 2 under cap w/ margin; 3 emit_block
  re-injects clean — suite-exercised; 4 single-home re-verified by `find`).
- **Files:** EDIT `claude/scaffold/universal-rules.md` (two bullets). No hook/code change.
- **Accepted residual:** R2 ("to fill it" scoping — design verbatim).
- **Commit state:** nothing committed; edit in the working tree.
