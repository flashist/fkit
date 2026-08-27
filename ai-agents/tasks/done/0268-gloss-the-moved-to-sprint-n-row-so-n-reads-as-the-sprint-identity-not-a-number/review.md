# Review — 0268

Task: 0268 — [brief](./brief.md)
File(s) under review:
- `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` (gloss at `:24-25`)
- `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` (gloss at `:23-24`)
- `claude/structure-manifest.tsv` (one regenerated row)

Status: **closed** — 2026-08-12. All findings resolved; one accepted residual recorded. Closing
verdict below.

Round 1 — 2026-08-12. Reviewers run: **fkit-reviewer (Claude)** + **Codex** (`codex exec --sandbox
read-only`), both completed. **Coverage is full — no reviewer was skipped.**

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | low  | `ai-agents/knowledge-base/conventions/task-status-vocabulary.md:25` · `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md:24` | "Write it exactly as that sprint's own plan names itself" points at only **rung 1** (the H1) of a two-rung identity ladder; `resolve_identity` falls through to **rung 2, the filename stem** (`dashboard.sh:109-119, 140-143`). For a plan whose H1 carries no whole-segment identity, the sentence gives a maintainer either no answer or a wrong one. Raised **independently by both reviewers**. |

### R1 — verification detail

**Verified verdict: CORRECT (ambiguity confirmed) · severity reassessed to LOW · Defect (minor, wording).**

Confirmed empirically, not by reading. Fixture `plan-sprint-4c.md` with H1 `# Sprint 4 carryover`:

- rung 1 (`plan_sprint_from_h1`) → `<none>` — `Sprint 4 carryover` is not a whole delimiter-bounded
  segment, so it correctly refuses;
- rung 2 (`plan_sprint_from_stem`, `dashboard.sh:118`) → **`Sprint 4c`** — the resolved identity;
- a maintainer following the gloss reads the H1, sees `Sprint 4 carryover`, and plausibly writes
  `➡️ Moved to [Sprint 4](…)`;
- the move-target extractor (`dashboard.sh:938`) yields `moved_target="Sprint 4"`; drift rule 2
  (`dashboard.sh:1013`) compares it against the brief's `Sprint 4c` → **`drift disagreement` fires.**

The sentence is ambiguous in both directions: read as "the plan's H1" it is incomplete; read as "the
plan's name" it is a correct superset. It does not disambiguate, and that is the finding.

**Why LOW, not Codex's Medium** — severity is assigned from traced blast radius, not inherited:

1. **Zero live exposure.** All six boards on disk (`sprint-1..5.md`, `backlog.md`) resolve on **rung 1**;
   not one depends on the filename rung. `dashboard.sh:116-117` records that the `plan-` prefix was
   accepted as forward cover "with no observed file behind it" — T10/T11 are its only coverage.
2. **The failure is loud, never silent.** A wrong marker surfaces as `drift disagreement`, the exact
   condition ADR-040 §Context contrasts with a silent wrong identity.
3. **The gloss's stated purpose still lands.** `Sprint 4` ≠ `Sprint 4c` is delivered correctly; only the
   source-of-truth pointer is under-determined.

**Not blocking.** The change is a net improvement over the prior state, where `N` was undefined entirely.

**⚠️ Every obvious repair brushes a settled constraint — which is why the disposition is the owner's:**

- naming the filename stem in prose reintroduces **"no pattern on the filename"**, which `0266`/`0267`
  landed today (`claude/skills/fkit-status/SKILL.md:32`);
- spelling out the ladder restates the grammar, against **ADR-041 §5** ("one grammar, one
  implementation");
- pointing at a `dashboard.sh` resolve-identity mode is what ADR-041 §5 actually gestures at, but the
  driver already asked whether the gloss should name the `moved_target` companion and the plan answered
  **"recommend against"** (leaks a shell local into a human-facing doc, adds a line anchor that rots).

A constraint-clean option does exist: **drop the "names itself" clause**, keeping the `4` vs `4c`
contrast. That loses the source-of-truth pointer but removes the false lead.

**Not settled, not re-litigation.** Checked against ADR-040 and ADR-041 *Re-raise only if* — neither
covers the documentation of the H1-vs-stem rung split. Checked against the plan-gate rulings — this is
none of F1/F2/F3.

## Checks that PASSED — no finding

Recorded so a later round does not re-derive them.

| Check | Result |
|---|---|
| **Both homes byte-identical** (parity check is OFF for this path — `test/dual-home-parity-exceptions.mjs:129-139`) | ✅ Verified independently: both blocks hash `5658724dc03ef7d6…`, `diff` empty. Codex concurs (223 bytes each). |
| **ADR-041 §5 — grammar not restated** | ✅ `4` and `4c` are example values, not a grammar; no character class, bounds, casing, or rejection rule. `dashboard.sh:69`'s own comment uses the identical two examples. |
| **Contradiction with `0266`/`0267`'s "no pattern on the filename"** | ✅ None — the gloss is silent on filenames. (It is that same silence that produces R1.) |
| **Placement vs `priority-is-rank-not-identity.md:35-37`** ("Leave it byte-identical") | ✅ Compliant — the `**Moved**` row at `:21` is untouched; the diff is pure insertion. ⓘ The plan's rationale slightly **overstates** the rule: it binds the *marker*, so a **Meaning**-cell edit would not have violated it. Beneath-the-table remains a sound choice; no action. |
| **`claude/structure-manifest.tsv`** | ✅ `npm run generate:manifest` reproduces the committed file **byte-identically**. Exactly one row added (`05256d54…` at `:75`), correct sort position (`05` < `18` < `19` < `37` < `7b`), hash matches the scaffold blob on disk. Live copy hashes `b2f8480f…`, in no row — still classifies as owner-edited, so the live edit changes no classification, as the plan predicted. |
| **Internal consistency** | ✅ No conflict with the `Moved (to backlog)` row (the gloss is scoped to the `Moved to [Sprint N]` marker text, leaving `:22` visibly out of scope), the validity paragraph, or either "Where this is enforced" list. Codex concurs. |

## Closing verdict — reviewer (round 1 closeout, 2026-08-12)

**CLOSE. R1 discharged. One accepted residual, judged defensible. No new findings.**

⚠️ **Coverage of this closeout pass is single-reviewer (Claude only).** Round 1's findings pass had
both reviewers; this post-fix re-verification did **not** re-run Codex. Judged proportionate — the fix
is a pure deletion inside one sentence of a doc, touching no code path, and its blast radius is a
strict subset of what round 1 already examined by two reviewers. **This would not be proportionate for
a code change.** Stated so coverage is not overstated.

### Re-verification by independent measurement — not ledger bookkeeping

Every number below I measured myself this pass; none is taken from the coder's report.

| Measurement | Result |
|---|---|
| **Both homes byte-identical** — ⚠️ the automated parity check is **OFF** for this path (`test/dual-home-parity-exceptions.mjs:129`, kind `audience-adapted`), so a one-home edit has **no automated catcher**; this hand-check is the only coverage | ✅ Both gloss blocks `sha256 eb95d989483cbc5e29d5816409535116264098de6c7a97db0f60f5dc0f77a350`, **167 bytes** each, `diff` empty (exit 0). Live `:24-25`, scaffold `:23-24`. |
| **Manifest matches the scaffold blob** | ✅ Scaffold blob on disk = `145b38c0b1250d955a4ba28f78a05902cfd8959202311cb51d97c511f6e2e6c3` = manifest row `:75`. Pre-fix row `05256d54…` **absent** (grep count 0). Sort position correct (`145b38c0` < `1814dfba` < `19c221c6` < `37e6e22a` < `7b6fa004`). |
| **Manifest reproduces byte-identically** | ✅ `node bin/generate-structure-manifest.mjs --stdout` (non-destructive; wrote nothing) → `diff` empty, both `sha256 d6cb12d9…`, exit 0. |
| **Live copy's structure-check classification unchanged** | ✅ Live blob `7bb85d1a…` appears in **no** manifest row → still classifies **owner-edited**, exactly as the plan predicted. |
| **`npm test`** | ✅ **Real exit code 0**, **709 tests / 709 pass / 0 fail**, `prove-red.sh` hard gate **PASSED** (all 15 mutations red their named assertion). ⓘ My first run's exit capture was invalid under `zsh` (`PIPESTATUS`); I **re-ran** rather than report an unmeasured exit code. |
| **The rung-2 fallback is real** (re-derived independently, fresh fixture) | ✅ `dashboard.sh identity plan-sprint-4c.md` with H1 `# Sprint 4 carryover` → **`Sprint 4c`**; the same H1 in `sprint-4.md` → **`Sprint 4`**. Identical prose, different identity by filename — so the dropped clause could genuinely mislead. |

### Does the new wording actually discharge R1, or just remove information?

**It discharges it.** R1's defect lived *in the clause* — a doc sentence that is wrong for a code path
the implementation deliberately supports. The clause is gone, so no sentence points at a rung any
more. That is a real fix, not a papering-over.

**The honest cost, stated plainly:** the dropped hint was *correct in practice for every plan on disk
today* — all six boards resolve on rung 1. So the fix does surrender a hint that would have worked
today. It is still the right trade: the hint was sound only by coincidence of the current corpus and
wrong by construction for the case the code explicitly covers (the `plan-` prefix, `dashboard.sh:116-117`).
A convention doc that endorses the wrong rung is worse than one that is silent, because the endorsement
is what converts a maintainer's guess into an authorized wrong marker.

**And the gloss's own purpose survives.** The two remaining sentences still deliver the whole point of
0268 — `N` is an identity, not a number; `4` vs `4c`; `Sprint 4` ≠ `Sprint 4c`. Nothing that the task
existed to add was lost.

### Weighing the accepted residual — defensible

The gloss now defines `N` but names no source of truth for it. **Defensible; a frontier-move, not an
unfixed defect.** Four grounds, all checked this pass:

1. **Never worse than baseline.** Before 0268, `N` was undefined entirely. The change adds the
   identity/number distinction and adds **no wrong statement**. It does not regress any axis.
2. **The failure mode stays loud.** Read at source: `moved_target` (`dashboard.sh:938`) and drift
   rule 2's verbatim compare (`dashboard.sh:1013`) emit `drift disagreement` on a mismatch. ADR-040
   §Context ranks loud-and-wrong as strictly better than silent-and-wrong; this stays on the good side.
3. **Zero reachable exposure today.** Every board on disk resolves on rung 1; the filename rung is
   forward cover with no file behind it (`dashboard.sh:116-117`, T10/T11 its only coverage).
4. **Every closure brushes a settled constraint**, and the owner **explicitly declined all three**
   (verbatim option: *"Drop the \"names itself\" clause (Recommended)"*). That is a decision made once,
   not a defect left open.

ⓘ **Boundary note — recorded so a later round knows what would legitimately reopen this, NOT a
re-raise.** The residual is harmless *because rung 2 has no live file behind it*. Should a real
`plan-sprint-<N>x.md` ever land, the gloss goes silent exactly where a maintainer needs it, at a cost
of one `drift disagreement` to debug. That would be **new evidence warranting a fresh owner ruling** —
which the accepted residual already contemplates. It proposes none of the three declined repairs and
does not reopen anything now.

### Convergence

**Converged — close it.** Round 1 raised one finding; it is fixed, re-verified by measurement, and the
sole residual is owner-ruled. No new finding surfaced in this pass. Nothing here re-litigates a settled
tradeoff.

## Coder response

_(coder-owned — do not write above this line into this section)_

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — re-verified independently, empirically | **Defect** (minor, wording) | **FIXED** — dropped the "names itself" clause; kept the `4` vs `4c` contrast | **resolved** |

### R1 — my verification, and what I changed

**I did not take the finding on report.** I re-derived it from the code and then reproduced it end to
end.

**The ladder really does fall through to the filename stem.** `resolve_identity`
(`claude/skills/fkit-status/dashboard.sh:121-143`) calls `plan_sprint_from_h1` and, on empty, falls
through to `plan_sprint_from_stem` (`:109-119`). Run against a scratchpad fixture `plan-sprint-4c.md`
whose H1 is `# Sprint 4 carryover`:

```
$ bash claude/skills/fkit-status/dashboard.sh identity <fixture>/plan-sprint-4c.md
Sprint 4c
exit=0
```

Rung 1 refuses (`Sprint 4 carryover` is not a whole delimiter-bounded segment); **rung 2 answers
`Sprint 4c`**. So a maintainer who read the old clause as "the H1" would write `Sprint 4`.

**And that misreading is loud, exactly as the reviewer said.** Fixture with plan row
`| ➡️ Moved to [Sprint 4](../sprint-4.md) — priority 3 | … |` and a brief reading `Sprint 4c`:

```
drift disagreement 1 plan="➡️ Moved to [Sprint 4](../sprint-4.md) — priority 3" brief_sprint="Sprint 4c" moved_target="Sprint 4"
```

`moved_target` (`:938`) and drift rule 2's verbatim compare (`:1013`) behave as claimed. **R1 is
CORRECT** — the clause pointed at one rung of a two-rung ladder. I concur with **LOW**, on the
reviewer's own reasoning: zero live exposure, and the failure mode is a loud `drift disagreement`
rather than a silent wrong identity.

**Fix applied** — owner-ruled 2026-08-12 (*"Drop the \"names itself\" clause (Recommended)"*). The
clause naming a single rung is gone; the contrast that was the gloss's actual purpose stays:

```
⚠️ **`N` in the `Moved to [Sprint N]` marker is the target sprint's *identity*, not a number** — `4`,
or `4c`. `Sprint 4` and `Sprint 4c` are different sprints.
```

Applied byte-identically to **both homes** — `sha256 eb95d989483cbc5e29d5816409535116264098de6c7a97db0f60f5dc0f77a350`,
167 bytes, `diff` empty. Hand-checked because the automated parity check is **off** for this path
(`test/dual-home-parity-exceptions.mjs:129-139`), so nothing would have caught a one-home edit.

**Constraints held.** The fix names no filename stem (would reintroduce what `0266`/`0267` removed
today), spells out no ladder (ADR-041 §5), and names neither `dashboard.sh` nor `moved_target` (plan's
"recommend against", undisturbed by the owner). It is pure deletion within one sentence — the
`**Moved**` and `**Moved (to backlog)**` rows remain untouched.

**Re-verified after the fix:** `npm run generate:manifest` (scaffold blob changed, so the row changed:
`145b38c0…`, matching the on-disk blob; the pre-fix `05256d54…` row is gone). `npm test` → **real exit
code 0**, 709 tests / 709 pass / 0 fail, `prove-red.sh` hard gate PASSED.

## Accepted residuals (shared, do-not-re-litigate)

- **The gloss deliberately names no source of truth for `N`.** Owner-ruled 2026-08-12: the
  "names itself" clause was **dropped rather than corrected**, because every available repair brushes a
  settled constraint — naming the filename stem reintroduces "no pattern on the filename" (`0266`/`0267`,
  landed the same day), spelling out the ladder restates the grammar (ADR-041 §5), and pointing at
  `dashboard.sh`/`moved_target` was already answered "recommend against" at the plan gate. The gloss now
  states **what `N` is** (an identity, not a number) and **why it matters** (`Sprint 4` ≠ `Sprint 4c`),
  and is silent on **where to look it up**. That silence is **chosen, not an oversight** — do not re-raise
  it as "the gloss is incomplete" or re-propose any of the three repairs above without a new owner ruling.
