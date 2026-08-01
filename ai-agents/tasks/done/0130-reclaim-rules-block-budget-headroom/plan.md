# Plan — 0130 Reclaim universal-rules-block budget headroom

**Status:** implemented. **Owner-signed option: (a) compression pass, tier a3 (C1–C5).**
Approved via `AskUserQuestion` in the live `fkit-lead` session, 2026-08-01, and relayed into this
worker's spawn prompt as the declared-approval marker.

## Phase 1 — measured evidence (read-only, before any edit)

```
RULES_MAX      = 4096 B
emitted block  = 3717 B
  source file  = 3224 B  (claude/scaffold/universal-rules.md)
  wrapper      =  493 B  (50 B markers + 443 B explanatory comment)
headroom       =  379 B
pct of cap     = 90.75%  (test rounds to 91%)
```

The 92% warning gate in `test/rules-block-budget.test.js` trips at **3789 B** (the test rounds:
`Math.round(size/max*100) <= 92`), so the real distance was **72 B**. All three budget tests passed
before the change. `find . -name universal-rules.md` returned exactly one path,
`./claude/scaffold/universal-rules.md` (verification step 7 — re-checked, not trusted).

## Compression candidates (tier a3 = all five, as signed)

| ID | Target | File | Est. reclaim | What is dropped | Risk |
|---|---|---|---|---|---|
| **C1** | wrapper comment | `claude/fkit-claude-init.sh` `emit_block()` | 115 B | only *"quoting one inline in your prose is safe"* — reassurance, not a warning | lowest; no rule touched |
| **C2** | "Speak in simple terms" | `universal-rules.md` | 46 B | the trailing *"; the list is illustrative, not exhaustive"*, whose meaning survives in the preceding *"or anything else the reader must act on"* | low-medium |
| **C3** | "prescribed shape" | `universal-rules.md` | 6 B | nothing; reflow only | none |
| **C4** | "What's next?" | `universal-rules.md` | 15 B | nothing; wording only | none |
| **C5** | "concision is not omission" | `universal-rules.md` | 9 B | nothing; wording only | none |
| | | **est. total** | **191 B** | | |

## Phase 2 — steps as approved

1. Baseline capture: emitted block + clause inventory (every bolded rule, qualifier, parenthetical)
   **before** any edit. That inventory is the R4 regression test.
2. **C1** — rewrite the `printf` lines in `emit_block()`. **Hazard: these are `printf` format
   strings**; any introduced `%` becomes a format-specifier bug corrupting every consuming project's
   block. Verify no stray `%`. C1 must keep all three load-bearing claims: block-is-overwritten,
   put-yours-outside, and the **code-fence hazard**.
3. **C2–C5** — apply to `claude/scaffold/universal-rules.md`. Preserve verbatim in meaning the
   ADR-030 clauses *never invent a next step* and *never assert repo state you did not check this
   turn*, the `evidence-before-assertion.md` **path reference** (must not break), and every hard-rule
   qualifier.
4. **R4 check** — diff the before/after clause inventory. Any clause present before and absent after
   is a **regression, not a compression** — revert it. Report the diff explicitly rather than
   asserting "nothing lost".
5. Re-measure; report new size / headroom / % / distance to the 92% gate.
6. Re-inject: init against a throwaway scratch project, then against this repo.
7. Tests: `node --test test/*.test.js` and `bash test/prove-red.sh`.

**Change surface:** `claude/fkit-claude-init.sh`, `claude/scaffold/universal-rules.md`,
`test/rules-block-budget.test.js`, and — from re-injection — this repo's `CLAUDE.md` and `AGENTS.md`.
**No commit.**

## Owner decision log (brief verification step 2)

All four rulings below are the owner's, taken in the live lead session on 2026-08-01 and relayed
into this worker's spawn prompt. None was settled by an agent.

| # | Question put to the owner | Owner's ruling |
|---|---|---|
| 1 | Compression pass **(a)** vs a signed `RULES_MAX` bump **(b)** | **(a) compression**, at **tier a3** — all five candidates C1–C5. **The cap was not raised.** |
| 2 | Standing headroom target going forward | **≥ 400 B free.** |
| 3 | Should the cap measure the emitted block or the source? | **Keep measuring the EMITTED block — unchanged.** Explicitly confirmed, not defaulted. |
| 4 | Why does the cap exist — discipline, or attention dilution? | **Both — discipline primary, dilution suspected.** Discipline (ADR-016: force an eviction conversation) is the operative reason; attention dilution is a **suspected but UNMEASURED** secondary and must be flagged as unmeasured wherever it is written down. |

Rulings 2 and 4 were recorded **cheaply, as comments** (shell + test comments, which cost the emitted
block nothing) at `claude/fkit-claude-init.sh`'s `RULES_MAX` site and in
`test/rules-block-budget.test.js`'s header. **No ADR was written** — not in the approved plan, and
ADR-016 says option (a) needs none.
