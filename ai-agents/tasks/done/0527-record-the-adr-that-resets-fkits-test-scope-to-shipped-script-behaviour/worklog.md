# Worklog — 0527: record the ADR that resets fkit's test scope

Builder: spawned `fkit-architect` running `/fkit-record-decision` under the approved plan (`plan.md`,
blob `63be3f494f295ed303bd949d43a1da863df5cb2e`, checked with `git hash-object` this phase — matches the
driver's pointer). No owner channel (ADR-021). No commit, no push, no wiki write, no brief or board
edit. `plan.md` and `plan-review.md` not edited.

## Phase 1 — draft (2026-10-19)

### Carry received
- Declared-approval carry from `fkit-sprint-ship-loop` (`fkit lead` session, Sprint 13, task 0527):
  roles ruling *"A: coder plans, architect writes (Recommended)"*; plan approval *"Approve
  (Recommended)"*; Codex X2–X6 *"Apply fixes at build (Recommended)"*; Codex X1 *"Accept, brief
  overrides (Recommended)"* — all via `AskUserQuestion`, 2026-10-19.
- Driver answer to plan §9: options A and C are **not** held by the lead session (cleared) → recorded
  as a gap in ADR-057 §Options considered, per plan §2.

### Number
- Step A (malformed `adr-*` names): printed nothing.
- Step B (highest in use): `56` → allocate **057**.
- Manual look: `grep -rni "adr-057"` over `ai-agents/` (vault included, read only), `claude/`, `test/`,
  `CONTRIBUTING.md` — hits only in this task's own `plan.md` / `plan-review.md` (they plan this ADR).
  No other claim.
- After the write: Step A prints nothing; Step B prints `57`; one `adr-057*` file.

### Written
- `ai-agents/knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md` —
  Status `proposed`, states it holds open owner questions (X1 ruling); open markers
  `⚠️ Open — owner question Qn` for Q1, Q2, Q3, Q4a, Q4b, Q5, Q6 (plus D7, which Q4a/Q4b/Q5 fill).
- This worklog.
- **No pointers** written (phase 3 only).

### Facts re-derived at build
- `test/`: 42 `*.test.js` (22,344 lines); `prove-red.sh` 2,533 lines, 55 `--- Mutation N` blocks;
  `test/*.mjs` 836 lines.
- One-run timings, this Mac, not verified idle: `release-summary` 38.3 s (30 tests, pass);
  `task-id-uniqueness` 0.38 s (42 tests, pass); `dual-home-parity` 0.07 s (9 tests, pass).
- `decisions/` sweep for `test/<name>` re-run: matches plan §0 exactly (ADR-029 also names
  `converge-contract`, ADR-028 names `prove-red.sh` — both already in plan §0).
- Shipped-file sweep for test names: matches plan §0, plus `claude/skills/fkit-heal/check.sh` →
  `test/structure-check.test.js`, `claude/structure-manifest.tsv` / `claude/structure-spec.md` →
  their tests, `claude/fkit-claude.sh` / `skill-ownership-hook.sh` / `skills-for-role.sh` →
  `test/skill-ownership-hook.test.js`, the scaffold's `priority-is-rank-not-identity.md` →
  `test/dashboard-contract.test.js`. These name **kept** (category 1–2) tests or are comments — not
  added to D9; `0529` re-checks them against its per-file table.
- Movers: 20 references to `test/reference-integrity.test.js` (6 + 6 + 4 + 4) — matches `0522`.
- `dashboard.sh` has **no** duplicate-task-ID check today (its "Duplicate detection" comment is about
  drift records emitted from both modes) — so Q5 (c1)/(c2) is new code.
- The "fourth category" header in `test/task-id-uniqueness.test.js` cites an owner ruling of
  2026-07-20 (*"a header note, not an ADR amendment"*) — recorded in ADR-057 §Context.

### Departures from the plan, stated
- **Q4a got a third option** — (c) keep `test/release-summary.test.js` outside the default suite —
  because the re-measure showed it at 38.3 s, a third of the 2-minute budget; the plan listed only
  keep / drop. It is the architect's recommendation; the owner may pick keep or drop as planned.
- **Q1's crown-jewel list is four cases** (M1, M2, M30, M31), not five: no convergence /
  never-overwrite mutation exists among the 55 to propose as a fifth.

### Checks
- `npm run test:docs`: **410 pass, 0 fail**, rc 0 (~25.7 s) — run after the ADR write, and again
  after this worklog was written: 410 pass, 0 fail, rc 0.
- `grep -nE '\.md:[0-9]|\.(sh|mjs|js):[0-9]'` over ADR-057: no hits.
- Every markdown link in ADR-057 resolves (8 targets, all `ok`).
- Skipped, with reason: `npm run test:unit` and full `npm test` — no file under `claude/`, `test/`,
  `bin/`, `package.json`, or named by `test/prove-red.sh` changed. The brief's verification-5 pair runs
  inside `test:docs`; its exact command is run once in phase 3 (plan §7).

### Questions returned (NEEDS-DECISION list)
Q1 prove-red; Q2 key list; Q3 cap; Q4a release-tool test; Q4b byte parity; Q5 ADR-029 D3 (4 options
after the X4 split); Q6 consuming projects. Text as in ADR-057 and the phase-1 return.

### Decision log
- Slug kept as planned.
- Category 1 written as launcher, init, hooks, plus `skills-for-role.sh` (sourced by them). `install.sh`
  is **not** added: `test/update-reinstall.test.js` serves a fake installer, so it tests the launcher,
  not `install.sh`.
- D11 categories are the architect's reading; `structure-spec` read as category 4 (shipped spec
  prose), `rules-block-budget` as category 1 (init's guard) — `0529` confirms per file.
- Q5 recommendation (b), not (c1): cheapest, no window, no new code; (c1) is the upgrade if the owner
  wants consuming projects covered.

## Phase 2 — fold the owner's answers (2026-10-19)

### Carry received
- Same declared-approval carry; plan blob re-checked with `git hash-object`: `63be3f49…` — matches.
- Worker role: build phase 2 only. No pointers (phase 3). No commit, push, wiki, brief or board write.

### Answers received (relayed verbatim by the driver; all 2026-10-19, `fkit lead` session)
- **Q1** — typed in chat, after the owner asked about hand-run frequency, test count/weight, GitHub
  Free limits (driver checked: repo public, CI on `ubuntu-latest`, standard minutes free) and
  every-push runs: *"Hey, I'm a bit tired discussing it. Let's implement the simplest solution that we
  have right now. If you think that nightly tests are the simplest way, let's do them, because I'm a
  bit lost, to be honest, about your explanation about the difference between nightly tests and tests
  that run every push. So if you think that nightly works, if it's simpler, even though if we get the
  notifications not immediately but like next morning, that's fine for now."* → **(c)**, four cases
  (M1, M2, M30, M31), nightly, "fine for now". Driver figures shown to him: skill-ownership-hook 260
  tests ~9.7 s; launcher-contract 43 tests ~29.1 s; ≈ 97 s per run (estimate; one run; Mac not
  verified idle).
- **Q2** — `AskUserQuestion`: *"4 items (Recommended)"* → (a).
- **Q3** — typed in the dialog: *"No need to add any caps, we just need to be sure our tastings don’t
  become bloated and enormous"*; then `AskUserQuestion` confirmation *"Yes: 2-min limit + my OK
  (Recommended)"* → no numeric cap; budget + per-file OK. Outside the listed options; owner-ruled and
  confirmed, so folded (plan §1 stop rule: not a contradiction).
- **Q4a** — *"Keep, run before release (Recommended)"* → (c), the architect's added option.
- **Q4b** — *"Keep (Recommended)"* → keep.
- **Q5** — *"Keep the test (Recommended)"* → (b).
- **Q6** — *"Project-neutral prompts (Recommended)"* → (a).
- Labels + descriptions recorded verbatim in ADR-057 §Owner answers.

### Contradiction check
None found. Q3's "no cap" + Q1's four nightly cases + Q4a's out-of-suite release test: both non-default
lanes sit outside the 2-minute budget, so the owner's per-file/per-case OK is their only growth brake —
recorded as such (D2.1, D3) and as a re-raise condition. Q4b + Q5 add ~0.45 s to the default suite —
no budget conflict.

### Edited (ADR-057, Status still `proposed`)
- Status: records that Q1–Q6 are answered and folded; only the sign-off remains.
- New §Owner answers table (quote, channel, mapping) + the Q1 context figures.
- Supersedes/Amends line: ADR-026 Decision 4 now **amended** (nightly lane, four cases), not
  superseded; ADR-027 Decision 2 and ADR-029 Decision 3 **stand** (facts drift — their tests now
  licensed by D7).
- Context ruling 3: note that "under a cap" is replaced by Q3 (D2).
- D2 rewritten (OK per file/case in every lane; no numeric cap; key list of four). D3 (nightly, four
  cases, each runs one file, 51 deleted). D4 table + Q4a/Q4b decisions. D5 (test kept). D7 named
  exceptions table (3 files). D9 rows moved to project-neutral wording; Q6 decision block, with the
  no-key-list default left to `0528`'s planner. D10, D11 rows. Consequences + re-raise conditions
  (nightly delay; bloat inside the budget → numeric cap is the lever; consumer duplicate ID → D5 (c)).
  Related lines.
- Every `⚠️ Open — owner question` marker removed: `grep -c` = 0.

### For phase 3 (pointer markers implied by the answers, plan §5)
- ADR-014 §2 → ⛔. ADR-017 Related line → ⚠️. **ADR-026 Decision 4 → ⚠️** (Q1 = c). **ADR-027
  Decision 2 → ⚠️** (Q4b keep). **ADR-029 Decision 3 → ⚠️** (Q5 keep). Reference-integrity report → ⛔
  (D6).

### Checks
- `npm run test:docs`: **410 pass, 0 fail** (~23.9 s).
- Links in ADR-057: 8 targets, all resolve; no anchor links; `grep -nE '\.md:[0-9]|\.(sh|mjs|js):[0-9]'`
  → no hits.
- Step A prints nothing; Step B → `057`; one `adr-057*` file.
- Quotes checked against source: ADR-026's *"plausibly belongs in a `test:full` / CI lane"* present;
  `test/prove-red.sh` Mutation 1/2/30/31 headings match D3's descriptions.
- Skipped, with reason: `npm run test:unit`, full `npm test` — nothing under `claude/`, `test/`, `bin/`,
  `package.json` changed.

### Returned
`NEEDS-DECISION` Q7 (the sign-off).

### Decision log
- Q4a's "own script": `npm test` globs `test/*.test.js` (`package.json`), so keeping the file out
  needs a move or a narrower glob — stated in D4, assigned to no task (producer routing).
- Q6 default for a project with no key list: named as `0528`'s to draft and show the owner, not
  decided here — the owner picked the principle, not that wording.

## Phase 3 — record the sign-off, write the pointers (2026-10-19)

### Carry received
- Same declared-approval carry; plan blob re-checked with `git hash-object`: `63be3f49…` — matches.
- Worker role: build phase 3 only. No commit, push, wiki, brief or board write.

### Sign-off received (Q7, relayed verbatim by the driver)
- 2026-10-19, `AskUserQuestion`, live `fkit lead` session (`/fkit-sprint-ship-loop` run).
- Question as shown: *"Q7 — Sign off ADR-057 (fkit's test-scope reset) as now written?"*
- Selected option text, verbatim: *"Sign off as written (Recommended)"*; description he saw: *"Status →
  accepted; architect adds the dated notes to the older ADRs; 0527 goes to review."*
- Before the dialog the driver showed him a plain chat summary of the folded ADR (driver's account,
  recorded in ADR-057's Status line). The label is the driver's shortened one, not plan §4's draft
  wording — the text he picked is what is recorded.
- A real option pick with quote, date and channel → a sign-off under plan §4.

### Number race (plan §8)
- Step A: printed nothing. Step B: `57`. One `adr-057*` file.
- `grep -rnil adr-057` over `ai-agents/` (vault included, read only), `claude/`, `test/`,
  `CONTRIBUTING.md`, excluding this task's folder: only ADR-057 itself. No clash → no renumber.
- Re-run after all writes: Step A nothing, Step B `57`.

### ADR-057 edits
- Status → **accepted**, with the Q7 question, the selected option text and its description verbatim,
  the driver's summary, and a *History* paragraph (proposed-with-questions draft under the X1 ruling;
  Q1–Q6 folded; append-only from acceptance on; pointers written). A Q7 row added to *§Owner answers*.
- No other ADR-057 content changed. From here on ADR-057 follows the append-only correction form.

### Pointers written (plan §5; markers as derived in phase 2)
| File | Site | Marker | Header item |
|---|---|---|---|
| ADR-014 | end of §2 (after *"the suite asserts up to it, never past it"*), indent 0 | ⛔ — fence replaced by ADR-057 §D1; §2's out-of-scope paragraph still binds | new `- **Corrections:**` |
| ADR-017 | below §Related's ADR-014 bullet (*"§2's fence is widened by rule 4"*), indent 2 | ⚠️ — rule 4 taken in unchanged | existing item extended (continuation lines; first line byte-identical; only the site list superseded) |
| ADR-026 | below Decision 4, indent 3 | ⚠️ (Q1 = c) — nightly lane, four cases | existing item extended, same rule |
| ADR-027 | below Decision 2, indent 3 | ⚠️ (Q4b keep) — licence now ADR-057 §D7 | new `- **Corrections:**` |
| ADR-029 | end of Decision 3's race paragraph (*"Mitigation is **detection**"*), indent 0 | ⚠️ (Q5 keep) — licence now ADR-057 §D7; fkit's own repo only | new `- **Corrections:**` |
| reference-integrity report | below its `**Status:**` line | ⛔ — per ADR-057 §D6 | new bold `**Corrections:**` header line (no bullet, report style), stating the pre-existing ⛔/⭐ blockquotes are emphasis, not correction markers, and stay byte-identical |

Each note: dated, present tense, *"verified against live files 2026-10-19"*, corrected text left
byte-identical, links only to ADR-057 (and the report's to `conventions/durable-citation-anchors.md`).
Live facts verified for the notes: `test/` has 42 `*.test.js`; `package.json` `"test"` still runs
`bash test/prove-red.sh` (55 distinct `--- Mutation N`); `.github/workflows/` has only `test.yml`, no
schedule; both kept tests' headers still cite the "FOURTH test-scope category"; both reference-integrity
tests on disk and in `test:docs`; movers name `test/reference-integrity.test.js` 6 + 4 + 6 + 4 = 20 times.

### Append-only proof (snapshots taken before editing; all six were clean at HEAD)
| File | `git diff --numstat` | `-U0` deletion filter | `--no-index --numstat` vs snapshot | `diff \| grep '^<'` |
|---|---|---|---|---|
| ADR-014 | 20 0 | nothing | 20 0 | nothing |
| ADR-017 | 14 0 | nothing | 14 0 | nothing |
| ADR-026 | 18 0 | nothing | 18 0 | nothing |
| ADR-027 | 17 0 | nothing | 17 0 | nothing |
| ADR-029 | 18 0 | nothing | 18 0 | nothing |
| reference-integrity report | 9 0 | nothing | 9 0 | nothing |

### Checks
- `npm run test:docs`: **410 pass, 0 fail**, rc 0 (~23.9 s).
- Brief verification 5, exact command `node --test test/coordination-citation-policy.test.js
  test/reference-integrity.test.js`: **44 pass, 0 fail**, rc 0.
- Every link added in the six files and every link in ADR-057 resolves; no `path:NNN` citation added
  (`grep -nE '\.md:[0-9]|\.(sh|mjs|js):[0-9]'` over the added lines and over ADR-057: none).
- Skipped, with reason: `npm run test:unit`, full `npm test` — nothing under `claude/`, `test/`, `bin/`,
  `package.json` changed.

### Observed, not fixed
- ADR-017 ends with a stray literal `</content>` line (pre-existing, committed). Left alone: append-only
  form; flagged for the producer / a later correction pass.

### Decision log
- ADR-014's header says the Status *"stays as written"* rather than *"stays `accepted`"*, because its
  Status line is the qualified one (accepted on the settled points, runner left open).
- ADR-014's ⛔ also records that §2 had already been widened by ADR-017 rule 4 with no note in ADR-014.
- ADR-026's note names Decisions 1–3 and 5 as unaffected (Q1 = c, so not moot).
- The report's ⛔ also says *"do not add a test for this condition"* — follows from ADR-057 §D1/§D7.

## Review round 1 — coder side (Process-review worker, 2026-10-19)

Spawned by `/fkit-sprint-ship-loop` (Sprint 13) under the declared-approval marker (ADR-055), worker
role Process-review; approved plan carried verbatim (`plan.md` blob `63be3f4…`, matched by
`git hash-object`). Method: `fkit-process-stateful-review`, no per-round owner gate (ADR-019 / ADR-032).
Ledger: this folder's `review.md`, findings R1–R4. No accepted residuals; no ADR's "re-raise only if"
covers these; the owner's Q1–Q7 answers not re-opened.

### Verification (facts, 2026-10-19)
- R1: `grep -il fourth test/*.test.js` → 14 files claim the fourth category (10 with `FOURTH`, 4 lower
  case); ADR-057 names 5. `test/structure-manifest.test.js` (5 tests, 0.36 s) is the only check that
  the shipped manifest equals the generator's output (`bin/release.mjs` never reads it;
  `test/structure-spec.test.js` checks only spec ⊆ manifest paths; `test/structure-check.test.js`'s
  fresh case short-circuits on the scaffold hash, its stale fixtures use old-era blobs). A stale
  manifest makes `check.sh` call an untouched newer-version file owner-edited (*"report with diff,
  never touch"*) — a missed repair, never a wrong write.
- R2: `test/prove-red.sh` — M1 `run_hook_suite` (one file); M2, M30, M31 `run_suite` (whole glob);
  baselines 0a, 0b, 0c.
- R3: `claude/structure-spec.md` and `claude/structure-manifest.tsv` name `test/structure-spec.test.js`
  and `test/structure-manifest.test.js`; neither is category 1–2.
- R4: ADR-057 "amends" vs ADR-026 "Decision 4 is untouched"; plan §5 → ⚠️ for Q1 = (c).

### Correction to this worklog (R3)
- Phase 1 *Facts re-derived at build* says the extra shipped files *"name **kept** (category 1–2)
  tests"*. Wrong for `claude/structure-spec.md` and `claude/structure-manifest.tsv` — they name
  category-4 tests. ADR-057 now lists both under §D9 (dated note). The phase-1 line is left as written.

### Append-only proof (snapshots taken before editing)
| File | `git diff --numstat` | `-U0` deletion filter | `--no-index --numstat` vs snapshot | `diff \| grep '^<'` |
|---|---|---|---|---|
| ADR-057 (untracked) | n/a | n/a | 54 0 | nothing |
| ADR-026 | 30 0 | nothing | 12 0 | nothing |

### Decision log (fixes applied without per-fix owner approval)
- **R4** — appended to ADR-057: a ⚠️ note below §D3's first paragraph (Decision 4 of ADR-026 stands;
  "amends" is the wrong word), pointer notes below the *Supersedes / Amends* header bullet and §Related's
  ADR-026 bullet, and a new `Corrections` header item. Qualified: verified CORRECT; mechanical (wording
  aligned to the marker plan §5 already chose, ⚠️ for Q1 = (c)); in plan (§4: changes to an accepted
  ADR-057 use the dated correction form).
- **R2** — appended to ADR-057 two ⚠️ notes under §D3 (*"Four cases"*: single-file runs are `0529`'s
  target, today only M1; baselines go with the cases. *"Cost"*: ~97 s excludes baselines; ~136–165 s
  by the same one-run figures, arithmetic, not measured). Appended to ADR-026 a pointer note below its
  `0527` note and a `Corrections` continuation line. Qualified: verified CORRECT by reading
  `test/prove-red.sh`; mechanical; in plan (ADR-057/ADR-026 corrections, plan §4/§5).
- **R3** — appended to ADR-057 a ⚠️ note below §D9's table listing `claude/structure-spec.md` and
  `claude/structure-manifest.tsv` (the manifest row conditional on its test's fate, so it is true
  under either R1 outcome). Qualified: verified CORRECT; mechanical completion of the D9 sweep the plan
  (§2 D9) asks for; in plan.
- **R1** — nothing applied. Judgment call that changes what the owner signed → returned to the driver
  as `NEEDS-DECISION`; ledger row `blocked — awaiting owner disposition`.
- Obvious-winner calls: none.

### R1 — owner ruling applied (same spawn line, 2026-10-19)
- Ruling relayed verbatim by the driver: `AskUserQuestion`, 2026-10-19, `fkit lead` session
  (`/fkit-sprint-ship-loop` run). Question: *"R1 — the heal fingerprint-list check
  (test/structure-manifest.test.js, 0.36 s): keep it or lose it?"* Selected: *"Keep it (Recommended)"* —
  description: *"Stays in npm test as a 4th named exception; ADR-057 gets one dated note. Knock-on: none
  (checked)."*
- Decision log: **R1** — appended to ADR-057 a ⛔ note below §D7's table (4th named exception
  `test/structure-manifest.test.js`, default `npm test`, ruling quoted; the rest of D7 stands), a ⚠️
  note below §Context's *"fourth category"* bullet (14 files, all named), a ⚠️ pointer below
  §Consequences' named-exceptions bullet, and a `Corrections` continuation line. Qualified: the owner's
  explicit ruling on this exact change, applied as carried; mechanical; in plan (§4 correction form).
  ⛔ rather than ⚠️ at §D7 because following *"No other"* as written would delete the test. R3's §D9
  note checked: still true (it is conditional; the new D7 note says the manifest line needs no change).
- Ledger: R1 row → `✅ done`; all four rows `✅ done` → header `Status: closed-out`.
- Obvious-winner calls: none.
