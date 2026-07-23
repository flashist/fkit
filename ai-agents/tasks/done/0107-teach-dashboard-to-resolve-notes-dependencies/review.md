# Review — 0107

Task: ai-agents/tasks/done/0107-teach-dashboard-to-resolve-notes-dependencies/brief.md
File(s) under review:
- claude/skills/fkit-status/dashboard.sh (new U loud-guard arm in `depends_raw`, ~L417-441; caller L790-814)
- claude/skills/fkit-task-brief/SKILL.md (canonical-form mandate, L75-92)
- ai-agents/knowledge-base/conventions/dependency-declaration-form.md (new convention doc)
- test/dashboard-contract.test.js (new tests 9b/9c, L301-340)
Status: closed-out

Verdict: ✅ Ready to merge (test-gated; suite 455/0). No confirmed defects. Codex + own pass both ran. R1 hardened + accepted; two residuals recorded (owner, 2026-07-23). Closed out.

## Reviewer findings        ← reviewer-owned
| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | claude/skills/fkit-status/dashboard.sh:441 | Guard `^[^A-Za-z]*Depends on` over-fires on non-declaration prose whose prefix carries **no ASCII letter**: blockquote `> Depends on …`, table cell `\| Depends on …`, non-Latin-script prose `Примечание: Depends on …` (Cyrillic), and substring `Depends online` (no `[.: ]` word-boundary). All confirmed empirically. Fires in the **LOUD** direction only (`⟨UNPARSEABLE⟩` + drift), and only when the brief has **no** canonical declaration — so it can never produce the fabricated `ready` this task exists to kill. The code comment (L438-439) and convention doc (L47-48) claim the guard "does not fire on prose at all" / prose does not trip it — that is **overstated**; it does not fire on ASCII-letter-prefixed prose. Frontier/precision-nit + doc-accuracy, not a defect. Optional hardening: mirror the extraction boundary, e.g. `^[^A-Za-z]*Depends on[.: ]`, and/or soften the "no prose at all" claim. |

## Coder response           ← coder-owned (do not edit as reviewer)
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CONFIRMED — verified independently: `Depends online` (substring, no boundary), `> Depends on:` (blockquote), `\| Depends on:` (table), and Cyrillic-prefixed all fire `U`; ASCII-letter-prefixed prose correctly stays quiet. The "does not fire on prose at all" wording was overstated. | Frontier (precision + doc-accuracy nit, LOUD-direction — can never fabricate `ready`) | **HARDENED per owner disposition (2026-07-23):** guard regex `^[^A-Za-z]*Depends on` → `^[^A-Za-z]*Depends on[.: ]` (drops the `Depends online` substring case, matches the canonical anchors' `[.: ]` terminator; verified `0092`'s `**⚠️ Depends on tasks 82` still fires, blockquote still fires). **Softened** the wording in dashboard.sh:437-441 and the convention doc to "ordinary ASCII prose … not prose-proof in general." Remaining LOUD-direction over-fire (blockquote/table/non-Latin declaration-shapes) **accepted as residual** by the owner — safe by design. Re-verified: suite 455/0. | resolved (hardened + residual) |

## Accepted residuals (shared, do-not-re-litigate)
- **Guard over-fires LOUD on non-Latin-script / blockquote / table declaration-shapes** — What: after the R1 hardening (`^[^A-Za-z]*Depends on[.: ]`), a declaration-shaped line whose prefix is non-Latin-script (`Примечание: Depends on:`) or sits in a blockquote/table (`> Depends on:`, `| Depends on:`) still trips the guard → `⟨UNPARSEABLE — see brief⟩` + `drift depends-unparseable form="U"`. · Why (structural): it fires only in the LOUD, owner-visible direction and never when a canonical declaration exists, so it can NEVER produce the fabricated `ready` this task exists to kill; the `[A-Za-z]` letter-block is byte-level ASCII by design and full Unicode letter-blocking in awk regex is unreliable. Over-firing loud is the accepted safe direction. Owner-approved 2026-07-23. · Re-raise only if: the guard is shown to fire on ordinary ASCII prose, OR an over-fire is shown to render a fabricated `ready` rather than a LOUD row.
- **Word/letter-decorated declaration is still silently missed → `ready`** — What: a declaration whose label is preceded by an ASCII WORD (`- Warning — Depends on task 82`, `- NB before **Depends on…** with a plain-text lead`) is not caught by the guard (the ASCII letter blocks it) and matches no canonical anchor → `none recorded` → `ready`. · Why (structural): this is the Option-B scope line — Option A (more free-text extraction) was rejected as "CommonMark-in-awk" unreliable per the `0020` review R19/R40. The mitigation is the enforced canonical form (fkit-task-brief SKILL.md + `conventions/dependency-declaration-form.md`), NOT the guard. Owner-approved 2026-07-23. · Re-raise only if: the canonical-form enforcement is dropped/weakened, OR a live brief is found silently misreporting `ready` through this shape.

## Reviewer re-verification (phase 2, hardened guard — reviewer working record)
- The `[.: ]` hardening is SOUND and regression-free (re-run against fixtures with correct awk bounds):
  - Canonical forms intact: `**Depends on:** x` → BL, `**Depends on: nothing.**` → BI, `## Depends on`/list → S, `- Depends on: x` → P.
  - `0092` target `- **⚠️ Depends on tasks 82` → **U (LOUD)** — still fires. ✅
  - `Depends online docs…` (substring) → **none recorded** — now correctly EXCLUDED by `[.: ]`. ✅
  - Blockquote `> Depends on:` and Cyrillic `Примечание: Depends on:` → U (accepted residual, LOUD). ASCII prose `Note: Depends on the…` and bold-close `**Note.** Depends on…` → quiet. ✅
- Apostrophe hazard: still CLEAN (no apostrophe in the awk body L316-447 after the edit).
- `.claude/` live copy: re-SYNCED (identical). Suite: 455/0 (coder-reported; guard behavior independently re-verified).

## Verification notes (reviewer working record)
- **Regression on canonical forms: NONE.** BL / BI / S / P all still parse correctly (empirically re-run against fixtures). The guard is the textually-LAST locate arm and every earlier arm `exit`s on catch, so it cannot shadow a canonical form.
- **Sentinel plumbing form="U": CORRECT.** `print "U\037"` → `draw=$'U\037'` (non-empty) → `dep=${draw#*␟}` empty → caller's existing loud branch (L808-811): `⟨UNPARSEABLE — see brief⟩` + `drift depends-unparseable … form="U"`. Matches test 9b assertion.
- **Apostrophe hazard: CLEAN.** No apostrophe anywhere in the single-quoted awk body (L316-442); the new comment block is apostrophe-free.
- **One-grammar invariant: HONORED.** The guard is inside `depends_raw`'s single locate sequence, uses the same masked-line M[]/fence-exclusion F[] discipline, and emits through the one `<form>␟<content>` contract; the caller still branches only on this function's single answer. It is not the forbidden second `depends_mentioned`-style guard with a disagreeing, independently-gated pattern.
- **Self-consistency: 0107's own brief does NOT self-trip** the guard (L26 has ASCII letters before the label; L40 is code-spanned; L64 is canonical `- **Depends on: nothing.**`).
- **.claude/ live copy: SYNCED** — identical to canonical.
- **Tests green:** dashboard-contract.test.js 107/107; new 9b (decorated → LOUD) and 9c (prose mention → none-recorded) both pass; full `npm test` hard-gate passed.
- **Deliberate scope boundary (NOT a defect — plan-approved):** a WORD/letter-decorated declaration (`- Warning — Depends on task 82`) is still silently missed → `none recorded` → `ready`. This is the accepted Option-B scope line (Option A / more free-text extraction rejected per 0020 R19/R40 "CommonMark-in-awk"). Mitigated by the convention + fkit-task-brief mandate, not the guard.
