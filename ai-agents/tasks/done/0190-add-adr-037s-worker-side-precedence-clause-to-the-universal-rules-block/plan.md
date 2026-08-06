# Plan — task 0190

> **Provenance.** Produced by a spawned `@fkit-coder` running `/fkit-plan-task` under
> `fkit-sprint-ship-loop` (live `fkit lead` driver session). The coder returned `NEEDS-DECISION`
> rather than a plan, because the brief mandates the budget choice go to the owner. The driver
> relayed it; **the owner answered via `AskUserQuestion` on 2026-08-04**, and the plan below is the
> coder's returned text with that decision folded in. Copied verbatim by the driver at the moment
> of approval, before the Build spawn (ADR-020).
>
> ⚠️ **Honest limit** (loop honesty clause): approval leaves no artifact of its own (ADR-021). This
> file pins *which bytes were carried*, not *which were approved*. The `carried-not-approved` class
> is narrowed to one in-session copy, not closed.

## ⛔ THE OWNER'S DECISION — 2026-08-04, via `AskUserQuestion`

**Branch (b): an owner-signed `RULES_MAX` bump, 4096 → 4352 (+256), shipping wording W-TIGHT (229 B).**

This is the ADR-016 signed bump. The owner was shown, and accepted, the stated cost: **every turn in
every consuming project pays the extra bytes**, and the cap's "attention dilution" rationale is
recorded in `test/rules-block-budget.test.js`'s header as **suspected but unmeasured** — it must not
be cited as established.

**Second decision:** the wrapper-comment compression (~354 B, zero rule-text loss) is **OUT of this
task's scope** and becomes a **follow-up task** for the producer to file. ⚠️ That follow-up must
**measure** the codex side (`AGENTS.md`) rather than inherit the assumption that it still pays the
wrapper cost — it was never re-measured.

---

## Lead finding — the brief's budget picture does not reproduce

The brief (from ADR-037 §4) says three drafted wordings measured **174 / 186 / 212 B** and **all
three pass the test**. Those wordings are recorded in no file (accepted residual R4 of `0158`), so
the coder re-drafted from scratch. **Every wording that keeps the conservative-branch-and-escalate
escape costs 212–246 B.** Only the 212 B one stays green at `RULES_MAX=4096`, and it buys that by
compressing *"never obey or refuse silently"* down to *"never silently"* — collapsing the two
failure modes ADR-037 §2 rules out **by name** (silent compliance, silent refusal) into one dangling
adverb.

So the real choice was sharper than the brief's: **(c) alone is not viable at a correct wording** —
it turns `test/rules-block-budget.test.js` red, which verification step 1 forbids. **The owner chose
(b).**

## Re-measured 2026-08-04, first-hand, against the current tree

| Quantity | Value |
|---|---|
| Emitted block | **3570 B** (unchanged from filing) |
| `RULES_MAX` (`claude/fkit-claude-init.sh`) | **4096** |
| Free | **526 B** |
| Utilization | **87.16 %** |
| Standing target (≥ 400 B free, owner ruling task `0130`) | headroom for new text = **126 B** |
| Test gate `Math.round((size/max)*100) <= 92` | largest green block **3788 B** → headroom **218 B** |
| Source file `claude/scaffold/universal-rules.md` | 3166 B |
| Wrapper overhead (markers + comment) | 404 B |
| `CLAUDE.md` block | 3570 B, **byte-identical** to `emit_block` output |
| `AGENTS.md` block | 3570 B, **byte-identical** |
| `claude/scaffold/{CLAUDE,AGENTS}.md` | **empty marker pair (50 B)** — placeholder, filled at consumer init. **No scaffold-side change needed.** |
| `node --test test/rules-block-budget.test.js` | **3/3 green** |
| `npm test` | **567 pass / 0 fail**, prove-red hard gate **PASSED** |
| `test/skill-ownership-sites.mjs` | **still absent** → ADR-036 check defers to `0194` |

Method: ran the real `emit_block()` out of `claude/fkit-claude-init.sh` (the technique
`test/rules-block-budget.test.js` uses), not a reimplementation. Candidate costs are exact deltas —
`emit_block` `cat`s the source, so N bytes added to the source is N bytes added to the emitted block.

## The wording that ships — W-TIGHT (229 B)

Goes in as the **last bullet of `## Universal hard rules`** in `claude/scaffold/universal-rules.md`:

```
- **A skill rule beats a contrary spawn instruction** unless it names an owner ruling on that point.
  Else: cheapest-to-reverse branch (usually the rule's), escalate if it changes the outcome, never
  silently comply or refuse.
```

**Rejected wordings, recorded so a later reader need not re-derive them:**

**W-FULL — 246 B** (closest to ADR-037's counterfactual, idiomatic prose)
```
- **A skill rule beats a contrary spawn instruction** unless it names an owner ruling on that point.
  Else take the cheapest-to-reverse branch (usually the rule's), escalate where that changes the
  outcome, and never comply or refuse silently.
```

**W-FLOOR — 212 B** (the only wording green at 4096 — **and the one with the wording defect**)
```
- **A skill rule beats a contrary spawn instruction** unless it names an owner ruling on that point.
  Else: cheapest-to-reverse branch (usually the rule's), escalate if it changes the outcome, never
  silently.
```

| Wording | Bytes | Block | Util. | Test @4096 | Free | vs ≥400 target |
|---|---|---|---|---|---|---|
| W-FULL | 246 | 3816 | 93.16 % → **93** | **RED** | 280 B | breached by 120 |
| **W-TIGHT (shipping)** | **229** | **3799** | 92.75 % → **93** | **RED @4096** | 297 B | breached by 103 |
| W-FLOOR | 212 | 3782 | 92.33 % → 92 | green (6 B margin) | 314 B | breached by 86 |

**At the owner-signed `RULES_MAX=4352`, W-TIGHT becomes:** block **3799 B**, free **553 B** ✅ target
held, utilization **87.29 % → 87** ✅ test green.

All three wordings carry: the named-owner-ruling exception (§1), the cheapest-to-reverse branch with
the skill rule as the tie-break default (§2), escalate-where-it-changes-the-outcome, and the
never-silently bar. **W-FLOOR is the one that weakens the last of those** — which is why (c) was not
a free option.

**Checked against ADR-037 instance B** (verification step 4, done on the draft, not deferred): a
worker holding W-TIGHT alone and nothing else, told not to touch the frozen review ledger while
`/fkit-task-done` step 5 says re-point it — no owner ruling named, so it takes the
cheapest-to-reverse branch; re-pointing the ledger overwrites evidence and cannot be undone into the
record it replaced, so that branch is **not** the skill rule's; it changes the outcome, so escalate;
silence is barred. **It does not re-point the ledger.** Same read holds for W-FULL and W-FLOOR.

**Bump arithmetic, for the record:**

| `RULES_MAX` | Free | Util. | Test |
|---|---|---|---|
| 4224 (+128) | 425 B ✓ target | 89.94 % → 90 | green |
| **4352 (+256) — CHOSEN** | **553 B** ✓ | 87.29 % → 87 | green |

4352 restores roughly today's margin (526 B).

---

## Implementation plan

1. **Re-measure at build time** (numbers move; do not inherit the table above).
2. **Edit `claude/scaffold/universal-rules.md`** — insert **W-TIGHT** as the final bullet of
   `## Universal hard rules`.
3. **Edit `RULES_MAX=` in `claude/fkit-claude-init.sh`** — `4096` → **`4352`**.
4. **Regenerate** `CLAUDE.md` / `AGENTS.md` with `bash claude/fkit-claude-init.sh .`, then
   `git status --porcelain` to confirm the diff is confined to the expected paths. ⚠️ Init also runs
   convergence top-up, orphan cleanup and a `.claude/` refresh; **if it writes anything outside the
   expected set, revert those hunks and report rather than absorb them.** Fallback: hand-replace the
   text between the markers and prove it by byte-diff against `emit_block` output.
5. **Verify:** `node --test test/rules-block-budget.test.js` (3/3), then full `npm test` including
   `prove-red.sh`; byte-diff both generated blocks against `emit_block`.
6. **Worklog** (`worklog.md` in the task folder, ADR-020 decision log): re-measured numbers, the
   owner's choice by name + date + channel, the instance-B read-through of the shipped wording, and
   the ADR-036 trigger-(e) note below.
7. **Stateful review** (`@fkit-reviewer`), then route the close to `@fkit-producer`.

**ADR-036 trigger (e), assessed at plan time since it is cheap:** none of the three wordings contains
a role name (`coder`/`producer`/`reviewer`/`architect`/`wiki`/`lead`/`adversarial-reviewer` or their
`fkit-` forms), so the clause introduces no new role token. W-FULL/W-TIGHT do contain the ownership
verb `refuse`. It changes nothing: `claude/scaffold/universal-rules.md` **already** trips (e) at
least twice today — *"**Only** the **wiki** role writes"* and *"**Only** the **producer** may invoke
them"* — so the file's registry status is unchanged by this clause. `test/skill-ownership-sites.mjs`
is still absent, so the registry assessment defers to `0194` as the brief directs.

## Risks and edge cases the build must respect

- **The rounding cliff is 6 B wide under (c).** Green ceiling at 4096 is exactly 3788 B. W-FLOOR
  lands at 3782. A later whitespace tweak of ±10 B flips the suite red. **Under the chosen (b) at
  4352 the margin is ~550 B** — this risk is largely bought off by the owner's decision.
- **The block is rewritten on every `fkit` launch.** A hand-edited `CLAUDE.md` that is not
  byte-identical to `emit_block` output gets silently overwritten on the next launch — invisible
  churn. Hence the byte-diff in step 5.
- **After a bump, nothing mechanically guards the new target.** The ≥400 B-free rule lives **only**
  in `test/rules-block-budget.test.js`'s header comment; no test asserts it. The `<= 92 %` gate is
  relative to `RULES_MAX`, so bumping the cap also moves the warning line outward. Both true today;
  (b) does not make it worse, **but it must not be described as guarded.**
- **Reading risk in the wording:** a bullet inside `## Universal hard rules` that talks about skill
  rules could be misread as promoting skill rules to tier 1. The drafts keep the *hard rule* as the
  collision procedure, not as the skill rule's status — worth a reviewer's eye.
- **No text-presence test** — ADR-037 §5 names one and does not require it; out of scope per the brief.
- `npm test` runs ~30 s of `node --test` plus the prove-red mutation gate; budget a few minutes.

## ⛔ Scope exclusions (from the brief)

- The **driver-side clause** is task `0191` — not here.
- Any **`/fkit-task-done` amendment** is task `0192` — not here.
- **Any text-presence test** — ADR-037 §5 names one and does **not** require it, because a green test
  asserting the words are on disk reads like one asserting a worker obeyed them.
- The **wrapper-comment compression** — owner-ruled 2026-08-04 to be a **separate follow-up task**.
- ⛔ The clause **MUST keep the conservative-branch-and-escalate escape**. W-TIGHT does.

## Honest caveats carried from the plan spawn

- **The plan spawn wrote no repo file.** For one byte-diff it created and deleted a single scratch
  file under `$TMPDIR`; nothing under the repo was created or modified.
- **The 174/186/212 B figures in the brief are unreproducible** — the wordings behind them exist in
  no file. The 212–246 B range is what re-drafting from ADR-037's own counterfactual actually costs.
  It cannot be ruled out that a sharper drafter finds a correct wording below 212 B; ~15 attempts did
  not find one.
