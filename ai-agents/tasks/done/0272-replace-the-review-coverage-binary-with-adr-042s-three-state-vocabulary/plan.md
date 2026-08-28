# Plan — 0272: replace the review coverage binary with ADR-042's three-state vocabulary

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-28. Written by the driver at approval, before the Build spawn (ADR-020). Rulings ND1–ND3 are appended at the end.

Measured on disk 2026-08-28 (the brief's anchors are dated 2026-08-11; re-derived below).

## 0. What was measured, and the one thing that changed the plan

**Baseline:** `npm run test:unit` → **782 pass / 0 fail, 24 suites, 86.4s**, measured at plan time. `npm test` also runs `test/prove-red.sh`, which was **not** run — that number is unmeasured.

**ADR-042 D1, the Decision, quoted (the source of the three states):**

> **1.** The coverage vocabulary gains a third state, replacing the ran/unavailable binary. A review report must distinguish, at minimum:
> - **both reviewers measured** — both executed tests/mutations;
> - **reasoning-only second opinion** — Codex ran and reasoned; **all execution evidence is the Claude reviewer's**. This is the *normal, expected* state under the current sandbox, not a degradation event;
> - **Codex unavailable** — the existing loud `[claude-fallback — NOT model-diverse]` case.
>
> **2.** No review report may state or imply "FULL coverage" on the strength of a reasoning-only Codex pass. … **Once D2 ships this becomes a per-run determination:** the report claims *both reviewers measured* only on evidence in the Codex output that it actually executed something — never inferred from the sandbox flag permitting it.
>
> **3.** This is a reporting-honesty rule, not a degradation flag. It must not inherit the fallback banner's alarm tone: nothing is broken, and treating the normal case as a failure would train readers to ignore the banner that *does* signal failure.

**ADR-042 does NOT prescribe where the state goes in the report.** It prescribes only: present in every report, not a verdict token, not alarm-toned. Placement is this task's call — settled by ND3.

### The live evidence: reviewers ARE improvising past the binary

`grep -rn 'reasoning-only' claude/` → **zero hits.** Not one skill or agent file licenses the phrase. Yet the ledgers are full of it, in **four different wordings**:

| Ledger | What it says | Verdict |
|---|---|---|
| `ai-agents/tasks/done/0046-.../review.md:14` | *"⚠️ **Coverage state: reasoning-only second opinion** (ADR-042 D1)."* | correct |
| `ai-agents/tasks/done/0168-.../review.md:25` | *"**reasoning-only second opinion per ADR-042 — Codex could not run the suite (`mkdtemp` EPERM); all execution evidence is the Claude reviewer's**"* | correct — and the `mkdtemp` specimen |
| `ai-agents/tasks/done/0223-.../review.md:13`, `:52` | *"`--sandbox read-only` → reasoning-only coverage, ADR-042 D1 — the normal state, not a degradation event"* … *"Coverage complete."* | correct-ish; "Coverage complete" is doing unlicensed work |
| **`ai-agents/tasks/done/0327-.../review.md:12-14`** | *"completed, **full coverage** — reasoning-and-read-only per ADR-042 D1, the normal expected state, not a degradation"* | ⛔ **claims FULL coverage on a reasoning-only pass — exactly what D1 §2 forbids** |

**`0327` is a live recurrence of the `0259`/`0264` defect, 13 days after ADR-042 was accepted, in this sprint, in a ledger closed four days ago.** That is the argument for writing the vocabulary *into the skills* rather than leaving each reviewer to re-derive it from the ADR.

⛔ **Do not correct `0327`'s ledger.** Out of scope (`0274`'s class), and per ADR-034 a ledger closes on the work product. **Reported, not acted on** — routing it is the producer's call.

## 1. The plan

### 1.1 The canonical wording — stated once

**Single home (ND1 = A): a new `## Coverage states` section in `claude/skills/fkit-review/SKILL.md`**, placed immediately after Step 1 (right after the degradation contract it replaces), with the other four files pointing at it.

The exact text as it will read:

```markdown
## Coverage states — ADR-042 D1 (state exactly one, in every report)

Every review report states **exactly one** coverage state. This is a **statement about evidence, not
a verdict** — it never replaces, forces, or softens the decision verdict.

- **both reviewers measured** — the Claude reviewer *and* the Codex pass each **executed** something
  bearing on the findings (ran the suite, built a fixture, proved a mutation, reproduced a failure).
  ⛔ **Claim this ONLY on evidence in the Codex output that it actually executed something** — a
  command it ran, plus that command's actual result. **Never infer it from the `--sandbox` flag
  permitting execution.**
- **reasoning-only second opinion** — Codex **ran and reasoned** over the diff, but **executed
  nothing** bearing on the findings; **all execution evidence in this report is the Claude
  reviewer's.** ⭐ This is a **normal, expected state — not a degradation event.** Nothing is broken,
  no banner fires, and the verdict is **not** affected. It still must be stated, every time, never
  omitted because it is routine.
- **Codex unavailable** — Codex was unreachable, errored, timed out, or returned nothing usable.
  **This one IS a degradation**: the `[claude-fallback — NOT model-diverse]` banner fires and the
  verdict is forced to `🟡 Partial review — Codex unavailable`. **Unchanged.**

**Decide which applies PER RUN, from the Codex output — never from the sandbox flag:**
1. Did the `codex exec` call return a **usable pass** — a findings list, or an explicit,
   diff-grounded *"no significant issues found"*? **No → `Codex unavailable`.** A non-zero exit, an
   empty body, a cap/timeout with no verdict, or output that never engaged the diff all land here,
   whatever the exit code says.
2. Yes. Does its output show it **executed** something bearing on a finding — a command it ran, and
   that command's actual result? **Yes → `both reviewers measured`. No → `reasoning-only second
   opinion`.**
   ⚠️ Reading files, grepping, or *describing* what a test would do is **not** execution. Codex
   reporting a **denied** write, or emulating a run in its head, is **reasoning-only**.
3. **Cite the evidence for whichever you picked, in one clause** — codex-cli version and exit status,
   plus either the command Codex ran, or the reason it measured nothing.

> **Dated note — 2026-08-28. This is an observation about today's environment, NOT the rule above.**
> fkit invokes Codex with `--sandbox read-only`, which blocks `mkdtemp` and every other write, so the
> step-2 evidence **cannot appear today** and every report currently lands on **reasoning-only second
> opinion**. If the sandbox changes, the rule above needs **no edit** — only this note goes stale.
```

**Why this satisfies the brief's one design instruction:** the operative rule (steps 1–3) is **per-run** and mentions no sandbox value. `read-only` appears **only** inside the clearly-labelled dated note. Land `0273` → the note goes stale, the rule stands. Revert `0273` → the note becomes true again, the rule stands. **No re-edit either way**, which is ADR-042's *"D1 is unaffected by that revert."*

**Deliberate wording choices:**
- **No emoji on any of the three state names.** `🟡` is a *verdict* token; reusing it in the coverage line is the conflation D1 §3 forbids. Only the verdict line carries `🟡`, and only for state 3.
- The tone gradient is **structural, not adjectival**: state 2 gets one plain line; state 3 keeps its existing five-line boxed banner **byte-for-byte**. Loudness is placement and shape, per `CLAUDE.md` — not word count.

### 1.2 Per file, per site — before/after

**A. `claude/skills/fkit-review/SKILL.md` (169 lines) — the canonical home**

| Site | Now | After |
|---|---|---|
| `:51` (inside the Codex prompt) | *"End with a one-line coverage self-assessment."* | *"End with a one-line coverage self-assessment — and **state explicitly whether you executed anything** (a command you ran and its result), or that you only read and reasoned."* **Reason:** state 1 vs 2 is decidable only if the Codex output says. This is the one edit that makes the per-run rule *operable*. |
| `:65-68` (degradation contract) | *"…Record "Codex reviewer unavailable: `<reason>`", continue with your own pass only — and flag the partial coverage **loudly**…"* | Unchanged in substance for the unavailable branch; **one sentence appended** pointing at §Coverage states: *"This is coverage state **Codex unavailable** — see §Coverage states. ⚠️ A Codex pass that **ran** but measured nothing is **not** this branch: it is **reasoning-only second opinion**, a normal state, and it fires no banner and forces no verdict."* |
| **new section** after Step 1 | — | the §Coverage states block from 1.1 |
| `:121` (verdict vocabulary) | `- **🟡 Partial review — <reviewer> unavailable** — a reviewer failed or was skipped. **Takes precedence**…` | Same token, same precedence, **one clarifying clause added**: *"…failed or was skipped. **A reasoning-only Codex pass is neither — it never takes this verdict** (§Coverage states)."* ⛔ The token, its wording and its precedence rule are otherwise untouched. |
| `:124-140` (the `[NOT model-diverse — INCOMPLETE]` block) | as-is | **byte-unchanged.** Verified by `git diff` returning empty on those lines. |
| `:143` (*"Reviewers run — and any unavailable/skipped (loudly)"*) | binary | *"**Reviewers run** — plus **the coverage state** (§Coverage states) with its evidence clause, and any reviewer unavailable/skipped (loudly)."* |
| `:166` (hard rule) | *"A reviewer being unavailable MUST be reported loudly and carried into the verdict line."* | Kept verbatim; **one rule added beneath it**: *"The coverage state MUST be stated in every report, even when it is the routine one. **Only `Codex unavailable` is carried into the verdict line** — the other two are coverage statements, never verdict tokens."* |

**B. `claude/skills/fkit-stateful-review/SKILL.md` (187 lines) — pointer, not a second copy**

| Site | Now | After |
|---|---|---|
| `:94-98` (Step 1) | *"Exactly as in **fkit-review Step 1** … the same **mandatory graceful degradation** (record "Codex reviewer unavailable…", continue, flag partial coverage loudly in the verdict)."* | *"Exactly as in **fkit-review Step 1** … the same **mandatory graceful degradation**, and **the same three coverage states — [`fkit-review/SKILL.md` §Coverage states](../fkit-review/SKILL.md). Do not restate them here; that file is the single source.**"* |
| `:142` (verdict vocabulary) | `🟡 Partial review — <reviewer> unavailable` | Same clarifying clause as A `:121`. |
| `:145` (*"reviewers run (and any skipped, loudly)"*) | binary | *"**reviewers run** + **the coverage state with its evidence clause** (§Coverage states in `fkit-review`), and any skipped, loudly"* |
| `:185` (hard rule) | same as A `:166` | same addition as A `:166` |
| **Ledger header schema, `:49-68`** | header has `Task:` / `File(s) under review:` / `Status:` | **Add one line: `Coverage: <state> — <evidence clause>`.** ⚠️ This is the fix for the `0327` recurrence: an ad-hoc sentence in prose is what let *"full coverage"* survive; a **named header field** makes an omission and an overstatement both visible. The schema is shared with `fkit-process-stateful-review`, so **that file's copy of the schema must move in lockstep** (ND2 approved this). |

**C. `claude/skills/fkit-adversarial-review/SKILL.md` (130 lines) — reports what it DID; does not classify**

This skill **is** the Codex pass. It cannot state the coverage state, because that state is a fact about *both* passes and only the lead reviewer sees both. So it reports its **inputs** to the determination.

| Site | Now | After |
|---|---|---|
| `:51-54` (*"Never silently substitute yourself for Codex"*) | as-is | **byte-unchanged.** |
| `:56-72` (the boxed `[claude-fallback — NOT model-diverse]` banner) | as-is | **byte-unchanged.** ⛔ Explicitly not weakened, per the brief. |
| `:103` (*"If you fell back, the fallback banner above comes first"*) | as-is | **byte-unchanged.** |
| `:114-115` (self-assessment) | *"End with a one-line **coverage self-assessment** — including **which mode ran** (`[codex]` or `[claude-fallback — NOT model-diverse]`, with the reason) and what you did and didn't get to."* | *"End with a one-line **coverage self-assessment** stating **three** things: (a) **which mode ran** (`[codex]` or `[claude-fallback — NOT model-diverse]`, with the reason); (b) **whether you executed anything** bearing on a finding — name the command and its actual result, or say plainly that you only read and reasoned; (c) what you did and didn't get to. ⚠️ **(b) is what lets the lead reviewer pick the coverage state** ([`fkit-review/SKILL.md` §Coverage states](../fkit-review/SKILL.md)) — **you do not pick it yourself**; guessing at it is how a reasoning-only pass gets reported as measurement."* |

**D. `claude/agents/fkit-adversarial-reviewer.md` (67 lines)**

| Site | Now | After |
|---|---|---|
| `:29` (fallback label) | *"If codex is unavailable, do the pass yourself and label it `[claude-fallback — NOT model-diverse]`."* | **byte-unchanged.** |
| `:66-67` (self-assessment) | *"End with a one-line **coverage self-assessment** naming which mode ran (`[codex]` or `[claude-fallback — NOT model-diverse]`)."* | *"End with a one-line **coverage self-assessment** naming which mode ran (`[codex]` or `[claude-fallback — NOT model-diverse]`) **and whether you executed anything bearing on a finding — the command and its result, or plainly that you only read and reasoned.** The lead reviewer maps that onto the coverage state; you never state the state yourself."* Mirrors C `:114-115` exactly, because this pair must not drift. |

**E. `claude/agents/fkit-reviewer.md` (104 lines)**

| Site | Now | After |
|---|---|---|
| `:89-90` | *"**Degrade gracefully, report loudly.** If the Codex pass fails, continue — but mark the coverage as partial in the verdict line. Never pass a partial review off as complete."* | *"**Degrade gracefully, report loudly — and state the coverage state every time.** Every report names exactly one of the three ADR-042 states (`fkit-review/SKILL.md` §Coverage states) with its evidence. If the Codex pass **fails**, that is `Codex unavailable` — mark it in the verdict line; never pass it off as complete. If Codex **ran but measured nothing**, that is `reasoning-only second opinion` — **a normal state: say it plainly, and do not mark the verdict partial.**"* |

**F. The four sites outside the brief's five files (ND2 = in scope, fix all four)**

| Site | Now | After |
|---|---|---|
| `claude/skills/fkit-task-ship-loop/SKILL.md:250-251` | *"the **Codex-coverage state** (full vs partial — if partial, flagged loudly)"* | *"the **coverage state** — one of ADR-042's three (`fkit-review/SKILL.md` §Coverage states), with its evidence clause. ⚠️ **`reasoning-only second opinion` is NOT partial coverage** and is not a degraded run: it fires no banner, forces no verdict, and does **not** withhold the close. Only **`Codex unavailable`** is the degraded case this loop's close posture keys on."* ⚠️ **This is the edit with a live behavioural consequence** — see §2. |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:353` | *"review verdict + Codex-coverage state"* (unglossed) | same, glossed: *"…the **coverage state** (one of ADR-042's three — `reasoning-only second opinion` is normal and not a degradation)"* |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:355-356` | *"Loudly flag any task shipped without a **model-diverse** review."* | *"Loudly flag any task shipped **`Codex unavailable`** — that is the one state without a model-diverse review. ⚠️ A **reasoning-only second opinion** IS model-diverse (a different model reasoned over the diff); it is reported, not flagged."* |
| `claude/README.md:121-125` | describes the flagged-partial path; silent on state 2 | one sentence naming the three states and pointing at §Coverage states |
| `claude/agents/fkit-coder.md:135` | *"If it reports partial coverage (Codex unavailable), keep that flag loud."* | *"Relay **the coverage state, whatever it is** — and if it is **`Codex unavailable`**, keep that flag loud."* |
| `claude/skills/fkit-process-stateful-review/SKILL.md` (shared ledger schema) | schema without `Coverage:` | **Not optional given B's header change** — the shared schema must carry the same `Coverage:` line or the two sides fork. |

### 1.3 Where the state is reported (ND3 = fixed slot, no box)

**Its own line immediately under the decision verdict, above the findings** — the slot state 3's banner already occupies. Format:

```
**Decision: ✅ Ready to merge**

**Coverage: reasoning-only second opinion** (ADR-042 D1 — the normal state, not a degradation).
Codex ran (`codex-cli 0.145.0`, exit 0) and reasoned over the diff; its `--sandbox read-only`
harness blocked `mkdtemp`, so it executed nothing. All execution evidence below is mine.
```

State 3 is unchanged: the verdict flips to `🟡 Partial review — Codex unavailable` and the existing boxed banner sits in this slot instead. In the stateful ledger the same state additionally lands in the `Coverage:` header field (B, above), so it is durable rather than only narrated.

### 1.4 Tests

**None added, and this is a real gap, stated rather than closed.**

**No test in this repo reads the *body* of any `SKILL.md` or agent file.** `test/skill-frontmatter.test.js` reads frontmatter only and says so in its own header — *"It reads FRONTMATTER ONLY. A skill's BODY — the procedure itself, which is the entire point of the file — remains untested by anything in this repo. Do NOT read a green run here as coverage of skill behaviour."*

**So `npm test` green proves exactly nothing about this contract.** That statement goes in `worklog.md` verbatim. ⛔ Building such a test is **out of scope** — `0152`/`0154` own that surface, and ADR-014's zero-devDeps policy shapes it.

What `npm test` *does* prove: that nothing else broke. Two suites could be tripped by a careless shape — `test/dual-home-parity.test.js` and `test/structure-manifest.test.js` (neither is touched under ND1 = A).

### 1.5 Sequencing

1. Write the §Coverage states block into `fkit-review/SKILL.md` (A).
2. Edit A's five other sites.
3. `fkit-stateful-review` (B) — pointer + verdict clause + report line + hard rule + header schema.
4. `fkit-adversarial-review` (C `:114-115`) and `fkit-adversarial-reviewer.md` (D `:66-67`) — the mirrored pair, same turn, so they cannot drift.
5. `fkit-reviewer.md` (E).
6. The ND2 sites (F), including `fkit-process-stateful-review`'s copy of the shared schema.
7. `bash claude/fkit-claude-init.sh .` to refresh the gitignored `.claude/` copies.
8. `npm test`; report measured counts against the 782 baseline.
9. Verification steps 1–6 from the brief.

## 2. Edge cases and failure modes

| Case | What the rule does | Where it is written |
|---|---|---|
| **Codex ran but produced nothing** (`0072`'s specimen) | Step 1 → **not a usable pass** → `Codex unavailable`. Empty output is unavailability, not a clean bill of health. | §Coverage states step 1 |
| **Codex ran read-only and reasoned** | Step 1 pass, step 2 no → **reasoning-only**. Today's universal case. | steps 1–2 |
| **Codex crashed mid-run / capped without a verdict** (`0112`'s specimen, exits 143/144) | ⚠️ The genuinely hard case, and the one the exit code gets wrong. Step 1 is keyed to *"a usable pass"*, **not** to exit 0. A capped run that read the diff and emitted no verdict is `Codex unavailable`. | step 1, the parenthetical |
| **Codex ran a read-only command** (`grep`, `cat`) but no test | **reasoning-only.** The bar is *"executed something **bearing on a finding**"*. ⚠️ A deliberate tightening beyond ADR-042's literal *"both executed tests/mutations"* — the clause most likely to be argued at review. | step 2 warning |
| **Codex reports a write it attempted and was denied** (`0046`'s specimen) | **reasoning-only.** Strongest possible evidence *against* state 1. Named explicitly. | step 2 warning |
| **Codex "emulates" a run in its head** (`0102`'s specimen) | **reasoning-only.** Named explicitly. | step 2 warning |
| **A degraded run that later re-runs green** (`0080`, `0072`) | Coverage state is **per round**; a later green round does **not** retroactively repair an earlier one. Existing ledgers already do this correctly. | step 3 + B's header field |
| **The adversarial reviewer's own skill — it IS the Codex pass** | Reports **mode + executed-or-not + evidence**; explicitly told it does **not** pick the state. | C `:114-115`, D `:66-67` |
| **The adversarial reviewer invoked standalone by the owner** | Its output carries the raw facts and no state label — correct and honest, there is no second pass to compare against. One sentence would say so; omitted to keep the diff minimal. Flag at review if the reviewer wants it. | — |
| **State 2 silently degrading the ship-loops** | ⚠️ **The live hazard, fixed by F.** `fkit-task-ship-loop:250-251`'s binary has no slot for state 2, so a reviewer reporting `reasoning-only` forces "partial", which `sprint-ship-loop:302`/`:330` and `task-ship-loop:273` read as **degraded → do not route the close**. Under today's sandbox that is every task. The loops' *gates* are keyed correctly (to "Codex absent after retries"), so this fires through **vocabulary**, not the gate — which is how it would go unnoticed. | F |
| **`0273` lands after this** | Nothing here re-edits. Only the dated note goes stale, and `0273` owns updating it. | 1.1 |
| **`0273` is reverted** | Nothing here re-edits. The dated note becomes true again. | 1.1 |

## 3. How each caveat and ruling is honored

| Caveat / ruling | Honored by |
|---|---|
| ⚠️ ADR-042 untracked in git at filing — expected, not a defect | Read in full; Decision quoted verbatim in §0. |
| ⚠️ Must land **before or with** `0273`; do not weaken the `Depends on` edge | Touches **no** `--sandbox` value; the per-run form means `0273` needs no re-edit here. |
| ⛔ **Write the per-run form, never the by-construction form** | Steps 1–3 name no sandbox value. `read-only` appears **only** inside the dated-note block. Brief verification step 2's exact test. |
| ⛔ A reasoning-only pass must **not** force `🟡 Partial review` | Stated three times: the state definition, the verdict-vocabulary clarifier (A `:121` / B `:142`), and the new hard rule (A `:166` / B `:185`). Plus F makes the ship-loops agree. |
| ⛔ …but it must not be so quiet it disappears | Fixed slot directly under the verdict; a named `Coverage:` field in the ledger header; *"never omitted because it is routine"*; a hard rule requiring it in every report. |
| ⛔ No `--sandbox` change, not one character | No site is a `--sandbox` line. `fkit-review:61`, `adversarial-review:46`, `stateful-review:95`, `fkit-adversarial-reviewer.md:28`, `README.md:118` untouched. |
| ⛔ No edit to any `review.md` under `tasks/done/` | None. `0327`'s live recurrence is **reported in §0 and not corrected.** |
| ⛔ Do not weaken `[claude-fallback — NOT model-diverse]` | The banner block (`adversarial-review:56-72`) and the `[NOT model-diverse — INCOMPLETE]` block (`fkit-review:124-140`) are **byte-unchanged** — provable by an empty `git diff` on those ranges. |
| ⛔ Do not change what the review *finds* | Hunt list, dedup rule, classification vocabulary, and the other four verdict entries: untouched. The only verdict-line edit is a clarifying clause saying what does *not* trigger `🟡`. |
| ⛔ No wiki write / no commit / no new devDep | None planned. Wiki resync of ADR-042 is `0287`. |
| ⚠️ Edit `claude/` only; `.claude/` is a gitignored copy | Every path is under `claude/`. Step 7 refreshes the copies. |
| ⚠️ Verify the scaffold / manifest claim | **Verified. True for ND1 = A** (`claude/scaffold/` holds no `skills/` or `agents/`, so no manifest regeneration). It would have been **false** for a conventions page — `conventions/` is dual-homed (live `test/dual-home-parity.test.js`) and inside the manifest path set. |
| ⚠️ Re-derive the site list; report any site the table missed | Done — **nine** sites the table missed: five folded into A/B, four in files the brief does not name (F, ND2-approved), plus `fkit-process-stateful-review`'s shared schema. |
| ⚠️ State the coverage limit honestly | §1.4: no test reads any SKILL.md body; `test/skill-frontmatter.test.js` says so itself. Goes in the worklog verbatim. |
| ✅ The placement rulings (Sprint 5 → spent; Sprint 6, unranked) | Recorded; this plan changes no board, no brief field, no rank. |

**ADR-042 D1, clause by clause:** §1 — all three states in D1's own wording, incl. *"all execution evidence is the Claude reviewer's."* ✓ · §2 — the states are exhaustive and exclusive, *"full"* is not among them; the per-run tightening is transcribed as step 2. ✓ · §3 — no emoji on state names, one plain line vs a five-line box, explicit *"nothing is broken, no banner fires, the verdict is not affected."* ✓ · §Consequences (*"Implementing D2 without updating D1's reporting logic would recreate the original defect in mirror image"*) — the per-run form is written now. ✓ · §Re-raise only if — both conditions preserved; the tone separation is the direct mitigation of the second. ✓

## 4. Sites the brief's table missed — all now in scope (ND2)

Nine, re-derived by grep 2026-08-28. Five inside the brief's five files (marked in 1.2 A/B). Four in files the brief does not name, plus the shared schema — all in §1.2 F.

## 5. Verification (the brief's six steps)

1. **Grep proving every site states the three states and none offers only the binary** — `grep -rn 'reasoning-only\|both reviewers measured\|Codex unavailable' claude/skills/ claude/agents/`, pasted whole, plus a counter-grep for a surviving unqualified binary.
2. **Per-run form present, by-construction form absent** — quote the landed sentence, and show `read-only` occurs in these files only inside the dated-note block or on an untouched `--sandbox` line.
3. **One real review through the changed contract, Codex reachable, sandbox unchanged.** ⚠️ The coder cannot run this — `fkit-stateful-review` is the reviewer's skill and the role lock forbids it. **Inside this sprint loop it is free: the driver's Review step over this very diff IS that run**, and its report becomes the evidence. Paste its coverage and verdict lines; check all four of the brief's conditions.
4. **The `Codex unavailable` path still behaves.** (a) **byte-identity proof** — `git diff` on `fkit-review/SKILL.md:124-140` and `adversarial-review/SKILL.md:56-72` returns empty; (b) if budget allows, one forced-failure run with `codex` masked off `PATH`, showing the banner and the `🟡` verdict both fire. ⚠️ Do not claim (b) unless actually run.
5. **`npm test`** — measured counts against today's baseline of **782 pass / 0 fail / 24 suites** (`test:unit`; `prove-red.sh` unmeasured at plan time).
6. **The honest coverage limit, in the worklog**: no test in this repo reads any `SKILL.md` or agent-file body; `test/skill-frontmatter.test.js` states this about itself. This contract is prose, `npm test` green proves nothing about it, and building such a test is `0152`/`0154`'s scope.

Plus: `bash claude/fkit-claude-init.sh .` to refresh the gitignored `.claude/` copies, and `git status --short` showing no commit.

## 6. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-28 (verbatim option labels)
- **Plan gate:** "Approve".
- **ND1 (home):** "A: canonical block in fkit-review/SKILL.md (Recommended)" — the other four files point at it; no conventions page, no dual-home obligation, no manifest regeneration.
- **ND2 (four sites outside the brief's five files):** "In scope — fix all four (Recommended)" — `fkit-task-ship-loop:250-251`, `fkit-sprint-ship-loop:353` and `:355-356`, `claude/README.md:121-125`, `fkit-coder.md:135`; plus `fkit-process-stateful-review`'s copy of the shared ledger schema, which is part of B's header edit, not optional.
- **ND3 (placement and tone):** "Fixed slot under the verdict, no box (Recommended)" — one plain line above the findings, plus the named `Coverage:` field in the stateful ledger header; state 3 keeps its box byte-unchanged.
