# Worklog — 0243: author `claude/structure-spec.md` + the scaffold-inventory drift test

- **Date:** 2026-08-07
- **Built by:** fkit-coder, spawned as the Build worker of `/fkit-sprint-ship-loop` under the
  declared-approval marker (owner approved the plan via `AskUserQuestion` in the live lead session,
  2026-08-07; plan pinned at blob `3f96a545…`, re-verified unchanged after the build).
- **Plan:** `plan.md` in this folder (driver-written; not re-authored here). Built exactly to it.

## What was built

1. **`claude/structure-spec.md`** (new) — the hand-authored structure spec, per plan Deliverable 1:
   header prose (what/who/where/why-no-`version:`), the pinned machine-read contract note, the
   six-class table carried faithfully from report §4, Inventory Table A (19 directories, derived by
   walk), Inventory Table B (29 files: 27 scaffold paths incl. the 13 `.gitkeep`s + root
   `CLAUDE.md`/`AGENTS.md`), the ADR-005 routing note on every wiki-vault row in both tables,
   per-directory prose with per-file lines, root-context-file semantics per report §8, the
   companion-manifest section (split of labor, historical-only paths, `universal-rules.md`
   prose-mention-only), and the "what this spec is NOT" close (ADR-039 / ADR-015).
2. **`test/structure-spec.test.js`** (new) — the drift test, per plan Deliverable 2: assertions A
   (dir-set equality, both directions), B (file-set equality + no duplicates), C (class validity +
   mechanical `ruleClass()` rules — the approved stricter-than-path-drift shape, plan decision 2),
   D (ADR-005 routing note on every wiki-vault row, with a ≥6-row non-vacuity floor), E (no
   `version:` line), F (spec ⊆ manifest for non-placeholder rows, plan decision 3), plus permanent
   negative fixtures for every helper (missing row, extra row, wrong class, unknown class,
   noteless wiki row, decoy-table non-leak, malformed-row refusal, missing-heading refusal).
   Fourth test-scope category, cited from `dual-home-parity.test.js` like
   `structure-manifest.test.js` does. No prove-red mutation added, deliberately — same reasoning
   as the manifest suite (subjects are committed repo artifacts the copy-tree cannot meaningfully
   mutate); the negative fixtures keep red provable permanently.

## Inventory derivation (plan sequencing step 1 — derived, not trusted)

Walked `claude/scaffold/` this build: **27 files** under `ai-agents/` + **19 directories**
(incl. the `.gitkeep`-less intermediates `knowledge-base/` and `wiki-vault/wiki/`), plus the root
pair → 29 Table B rows. Matches the design's counts; the test re-derives on every run.

## Red-first (plan sequencing step 4) — the captured named red

Transiently removed the `ai-agents/tasks/README.md` row from the real spec's Table B, then ran
`node --test test/structure-spec.test.js`:

```
✖ B — Table B equals the scaffold file set plus the root pair, both directions, no duplicates
  AssertionError [ERR_ASSERTION]: claude/structure-spec.md Table B drifted from the shipped
  file set — fix the spec (or the scaffold) so they land in the same commit
  + actual - expected
  + [
  +   'spec missing file ai-agents/tasks/README.md'
  + ]
  - []
```

Restored the row; suite green (7/7).

## Verification (brief steps, evidence)

1. Spec exists; Tables A/B cover every scaffold path + root pair — enforced by assertions A/B,
   green.
2. ADR-005 routing note on every wiki-vault row — assertion D, green (13 rows under
   `ai-agents/wiki-vault/`: 6 directory rows in Table A + 7 file rows in Table B — the 3 living
   files and the 4 wiki `.gitkeep`s; D's floor is ≥6 and the note check covers all of them).
3. No `version:` field — assertion E, green.
4. Red demonstrated (above); real tree green; **full `npm test` green** this build — all unit
   suites passed and prove-red's hard gate PASSED (mutations 1–14 each red their named assertion).
5. Share placement: no installer/launcher change needed — `install.sh:42-43` does
   `rm -rf "$SHARE/claude"` + `cp -R "$TMP/src/claude" "$SHARE/claude"` (wholesale), and the
   self-host launcher resolves `share="$(cd "$here/.." && pwd)"` (`claude/fkit-claude.sh:68`), so
   `claude/structure-spec.md` ships in both modes as-is.
6. `git status --porcelain` after the build: this unit added exactly `claude/structure-spec.md`,
   `test/structure-spec.test.js`, and this worklog. Nothing under `ai-agents/wiki-vault/`; no
   consuming-project path touched. (The other dirty entries pre-date this unit: 0242/0244 closes,
   driver-written plan/board files, and a `package.json` change from an earlier sprint unit.)

## Decision log (ADR-019/ADR-020 audit obligation)

- **Unattended fixes applied without asking: none.** This was a build from an approved plan, not a
  review-processing round; every choice below was inside the plan.
- In-plan implementation choices (no judgment calls surfaced, none needed):
  - Perturbation target for the red run: the `ai-agents/tasks/README.md` row (plan says "one
    Table B row"; any row qualifies).
  - Table-section parser ends a table at the next `## ` heading — the concrete realization of the
    plan's "anchored to pinned section headings"; decoy-table non-leak is fixture-asserted.
  - `ruleClass()` orders the `.gitkeep` rule before the wiki-vault rule so the four wiki
    `.gitkeep`s class as `placeholder` — matching the plan's Deliverable 1 item 4 mapping
    (`.gitkeep` → placeholder), fixture-pinned.
  - Assertion D carries a ≥6-row non-vacuity floor (the routing-note filter must have matched
    real rows) — the suite-local instance of the repo's calibrated-floor discipline.
- **Obvious-winner calls outside the plan: none.** Scope stayed exactly the plan's two new files.

## Decision log — review Round 1 processing (2026-08-07, sprint-ship-loop Process-review worker)

Owner rulings relayed by the driver (AskUserQuestion, live lead session, 2026-08-07): R1+R2+R4
"Fix now (Recommended)"; R3 "Accepted residual (Recommended)". Fixes applied under the loop's
standing approval — each verified CORRECT against the code first, each mechanical/localized, each
inside the approved plan's deliverables (plan re-hash-verified this round: blob `3f96a545…`,
10904 bytes). One entry per fix:

- **R1** — `claude/structure-spec.md` §`ai-agents/` prose: "matches a version fkit shipped" →
  "matches what the installed version ships", with the older-shipped = untouched-stale
  (repair-eligible, design §7/ADR-039) distinction stated. Qualified: verified CORRECT (prose
  contradicted the spec's own six-class table row, line 45); single-sentence doc fix; inside plan
  Deliverable 1 items 2/6 (six-class table carried faithfully + per-path "what conforming means").
- **R2** — `claude/structure-spec.md` §"Project root", owner-side-body bullet: added report §8's
  licensed branch (untouched-stale body eligible for consent-gated replacement, markers + current
  block preserved through the rewrite; design §8, ADR-039). Qualified: verified CORRECT (branch
  present in report §8, absent from the spec's §8 carry); one-sentence localized addition; inside
  plan Deliverable 1 item 6 (root context files per report §8).
- **R4** — `test/structure-spec.test.js` `parseInventoryTable`: heading-uniqueness assert
  (`findIndex` → collect all matches; 0 keeps the pinned "heading not found" refusal, >1 refuses
  with "duplicate spec heading") + a negative fixture pinning the duplicate refusal. Qualified:
  verified CORRECT (first-match parse would silently validate only the first table); localized to
  one helper + one fixture; inside plan Deliverable 2 (parser anchored to pinned headings, red
  provable via fixtures).
- **R3** — no code change (owner-ruled accepted residual). Recorded in `review.md` §Accepted
  residuals with the re-raise condition verbatim: "0245 defines classification precedence". Spec
  stays faithful to report §8 and to the approved plan's Deliverable 1 item 6.
- **Obvious-winner calls this round: none.** Nothing outside the four ruled findings was touched.
- Verification: `node --test test/structure-spec.test.js` 7/7 green; full
  `node --test test/*.test.js` 613/613 green (17 suites). prove-red not re-run — no
  launcher-contract file changed this round (spec + its own test suite only).
