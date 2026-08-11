# Review — 0264

Task: `ai-agents/tasks/done/0264-implement-adr-040s-identity-grammar-in-dashboard-sh-both-rungs-and-the-moved-target-companion/brief.md`
File(s) under review: `claude/skills/fkit-status/dashboard.sh` (+72/−6), `test/dashboard-contract.test.js` (+371/−2)
Spec under review against: `ai-agents/knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md`
Status: in-review

**Round 1 verdict: ⚠️ Changes requested — 4 findings, none blocking. Zero confirmed defects in shipped
behavior; three are missing test guards, one is a pre-existing low.** Both reviewers ran — Codex
(`codex-cli 0.145.0`, `gpt-5.6-sol`) completed; coverage is **not** partial.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-status/dashboard.sh:112` · `test/dashboard-contract.test.js:706-1037` | **Three of ADR-040 §2.2's four normative H1 delimiters are untested.** Every H1 fixture in the file — the ten new ADR-040 cases and all pre-existing ones — uses the **em dash only**. T5b's `# Roadmap: Sprint 4 carryover` is a *refusal* case, so it passes whether or not colon splitting works. **Mutation-proved:** collapsing line 112 to `gsub(/—/, "\n", t)` — deleting the ` - `, `–` and `:` splits — leaves the **entire 692-test suite green**. A future edit that drops any of the three ships silently, and `# Roadmap: Sprint 4`, `# Product – Sprint 4 – theme`, `# Product - Sprint 4 - theme` would stop resolving. Raised by **both reviewers**. The implementation itself is **correct** (all four delimiters verified working); this is a missing guard on binding spec behavior, in a change whose own ADR says (`:158-160`) *"an unevidenced rung that no test exercises can ship broken and stay broken."* |
| R2 | 1 | low | `claude/skills/fkit-status/dashboard.sh:752` | **The shared token is not right-bounded inside `moved_target`, so it can extract a valid prefix out of an invalid target.** Measured on BSD `sed -E`: `➡️ Moved to Sprint 4th` → `Sprint 4t`; `Sprint 4cabbage` → `Sprint 4c`; `Sprint 4C` → `Sprint 4`. `Sprint 4t` is a token ADR-040 §5 refuses, invented by the parser. Codex rated this **high**; I rate it **low** and **not a regression** — the old pattern produced `Sprint 4` for all three inputs, also wrong, and rung 1/rung 2 are correctly anchored. Blast radius traced: `moved_target` reaches only `:827` (rule 2 → a **loud** `drift disagreement`, because no brief will ever read `Sprint 4t`) and `:888` (renders a visibly odd `in Sprint 4t` board cell). It **never** produces a silent skip, so the change moves this *toward* ADR-040's loud-over-silent constraint. Input required is a hand-malformed marker; `0210/D` already pins that a non-token target (`Narnia`) is `moved-without-target`. |
| R3 | 1 | low | `test/dashboard-contract.test.js:883-886` · `claude/skills/fkit-status/dashboard.sh:118` | **T6's comment claims coverage the test does not have.** The comment states *"The count is DISTINCT, not total — `# Sprint 5 — Sprint 5` names one sprint twice and still resolves"*, but **both** T6 fixtures use two *different* identities, so nothing exercises the de-dup. **Mutation-proved:** replacing the guard with `if (s ~ ("^" tok "$")) { cnt++; last = s }` — dropping `seen` entirely — leaves the **whole suite green**, while `# Sprint 5 — Sprint 5` would then wrongly refuse. Raised by **both reviewers**. Implementation verified correct; failure mode if it regressed is loud, not silent. |
| R4 | 1 | low | `claude/skills/fkit-status/dashboard.sh:109` | **The first-line-only narrowing has no guard.** **Mutation-proved:** replacing `head -1 "$1"` with `cat "$1"` leaves the **whole suite green**. Two consequences go unpinned: (a) the owner-approved ADR-040 §2.1 narrowing could be silently undone; (b) a whole-file scan makes the awk rule fire on *every* `# `-prefixed line, so a plan with two Sprint-bearing H1-shaped lines would `print` twice and hand `PLAN_SPRINT` a **multi-line value** — a shape no consumer at `:832`/`:862`/`:965` expects. ⚠️ **To be explicit: the narrowing itself is correct and is NOT the finding** — it is owner-approved, and I checked for a real break and found none (see *Verified and dismissed*). The finding is that nothing reds if it is reverted. Mine only. |

**No finding is blocking.** R1/R3/R4 are missing guards, not wrong behavior. R2 is pre-existing and
strictly less silent than what it replaced.

---

## Coder response

<!-- CODER-OWNED. The reviewer never writes this section. -->

**Round 1 response. All four findings independently re-verified against the code by me — I reproduced
every mutation the reviewer cited rather than taking it on trust, and all four reproduced exactly.
Zero disputes.** Owner dispositions for all four were given live via `AskUserQuestion` in the
`fkit lead` session, 2026-08-11.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — reproduced | Defect (missing guard on binding spec behavior) | **FIXED.** Three positive fixtures added, one per unexercised delimiter | ✅ fixed this round |
| R2 | **CORRECT** — reproduced exactly | Defect, pre-existing, low; **not a regression** | **None — accepted as residual** (owner ruling) | 🅰️ accepted residual |
| R3 | **CORRECT** — reproduced | Defect (missing guard + a comment that overclaims coverage) | **None here — deferred to one follow-up** (owner ruling) | 🅰️ accepted residual → follow-up |
| R4 | **CORRECT** — reproduced | Defect (missing guard) | **None here — deferred to the same follow-up** (owner ruling) | 🅰️ accepted residual → follow-up |

### R1 — fixed

**My verification, not the reviewer's:** I collapsed line 112 to `gsub(/—/, "\n", t)` and re-ran the
dashboard suite — **126/126 green**. The claim holds exactly as written: three of ADR-040 §2.2's four
normative delimiters were unguarded.

**Fix:** `test/dashboard-contract.test.js:1039-1078` — three positive cases, generated from one table,
named `ADR-040 §2.2: …`. Each uses a prose stem (`hardening.md`) so **rung 1's split is the only
possible source of an identity**, and each asserts **both** `unresolved-plan-sprint == 0` (proving the
split resolved something) **and** `disagreement == 1` against a brief naming `Sprint 4` (proving it
resolved to `Sprint 4` *exactly*). Neither assertion pins the value alone — the three-way table in the
test's comment shows why — which is the same trap T10's comment names about itself.

**Load-bearing, proved four ways** (source restored and `git diff --stat`-verified after each):

| Mutation | Result |
|---|---|
| collapse to em-dash-only (the reviewer's) | **3 fail / 126 pass** — exactly the three new cases, nothing else |
| drop `gsub(/ - /, …)` only | **1 fail** — the spaced-hyphen case **alone** |
| drop `gsub(/–/, …)` only | **1 fail** — the en-dash case **alone** |
| drop `gsub(/:/, …)` only | **1 fail** — the colon case **alone** |

Each delimiter is therefore **individually** guarded, not merely the set. The em dash is deliberately
**not** re-tested — it is already exercised by T2, T3, T5, T6 and T7.

⚠️ **This test addition is outside the approved plan's §3b table.** It is authorized by an explicit
owner ruling of 2026-08-11 ("Add the fixtures now") that supersedes the plan on this point, and by
nothing else.

### R2 — accepted as residual, deliberately NOT fixed

Reproduced on BSD `sed -E`, byte-for-byte as the reviewer measured:

```
➡️ Moved to Sprint 4th        => [Sprint 4t]
➡️ Moved to Sprint 4cabbage   => [Sprint 4c]
➡️ Moved to Sprint 4C         => [Sprint 4]
```

`Sprint 4t` is a token ADR-040 §5 refuses, invented by the parser. **Owner ruled: accept.** I agree
with the reviewer's severity (low, not Codex's high) for its stated reason: **it is not a regression**
— the old `Sprint [0-9]+` pattern produced `Sprint 4` for all three inputs, also wrong — and the blast
radius reaches only drift rule 2 (`:827`), which fires a **loud** `drift disagreement` because no
brief will ever read `Sprint 4t`, and the board cell (`:888`), which renders a visibly odd
`in Sprint 4t`. **It never produces a silent skip**, so the change moves this *toward* ADR-040's
loud-over-silent constraint rather than away from it. Reaching it at all requires a hand-malformed
marker; `0210/D` already pins that a non-token target is `moved-without-target`.

### R3 / R4 — accepted as residuals, bundled into one follow-up

Both reproduced by me independently, **against the suite as it now stands including the three new R1
fixtures** — so this is current, not inherited:

- **R3:** replacing the guard with `if (s ~ ("^" tok "$")) { cnt++; last = s }` (dropping `seen`) →
  **129/129 still green**. The DISTINCT-vs-total refusal is unpinned, and T6's comment
  (`:883-886`) claims coverage the test does not have — **both** T6 fixtures use two *different*
  identities.
- **R4:** replacing `head -1 "$1"` with `cat "$1"` → **129/129 still green**. The ADR-040 §2.1
  first-line-only narrowing is unpinned in both directions, including the multi-line `PLAN_SPRINT`
  shape a whole-file scan would produce.

**Owner ruled: file as ONE follow-up, bundled with the build's own residual 1.** ⛔ Not fixed here and
⛔ **not filed by me** — filing briefs is the producer's (ADR-033). The bundle is written out under
*Accepted residuals* below in a form a producer can file directly.

⚠️ **One consequence was surfaced rather than buried, and the owner then redirected on it.** Honoring
the R3 ruling literally would have left T6's overclaiming comment in the tree until the follow-up
landed — a comment claiming a guard it does not have is the kind of thing a later reader banks. I
flagged it instead of absorbing it.

**→ Owner ruling 2026-08-11 (second, live `AskUserQuestion` in the `fkit lead` session): "Fix the
comment now."** Applied, **docs-only**:

- `test/dashboard-contract.test.js:883-893` — T6's comment now states what the test actually pins
  (refusal on two **different** tokens, and where the identity comes from afterwards), and carries an
  explicit ⚠️ block saying the DISTINCT-vs-total de-dup is implemented but **unpinned**, that dropping
  `seen` leaves the suite green, that the old comment's claim did not exist, and that the guard is
  filed as residual **A2 item 1**.
- **No test, fixture, assertion or `dashboard.sh` change** — `dashboard.sh` remains byte-identical, and
  the suite is unmoved at **695/695**.

⛔ **R3's guard itself is still deferred**, exactly as first ruled. The comment now points at the
follow-up instead of contradicting it. **A2 item 1 remains in force and still names R3** — its wording
was adjusted only to record that the comment half is done and the guard half is not.

---

## Accepted residuals (shared, do-not-re-litigate)

<!-- Written on the owner's dispositions of 2026-08-11, all given live via AskUserQuestion in the
     `fkit lead` session. Do not re-litigate these; each carries its own re-raise condition. -->

### A1 — `moved_target` is not right-bounded (was R2, low)

**Owner ruling 2026-08-11: "Accept as residual."** `➡️ Moved to Sprint 4th` extracts `Sprint 4t`;
`Sprint 4cabbage` → `Sprint 4c`; `Sprint 4C` → `Sprint 4` (`claude/skills/fkit-status/dashboard.sh:752`).

Accepted because: **pre-existing and not a regression** — the old `Sprint [0-9]+` pattern gave
`Sprint 4` for all three, also wrong. Blast radius is bounded to drift rule 2 (`:827`), which fires a
**loud** `drift disagreement`, and the board cell (`:888`). **It never causes a silent skip**, so the
change moves this toward ADR-040's loud-over-silent constraint. Requires a hand-malformed marker to
reach.

**Re-raise only if:** a real board is observed emitting a fabricated token, **or** a future consumer
gives `moved_target` a path where a wrong value is silent rather than loud.

### A2 — one follow-up: three unpinned behaviors in the identity grammar

**Owner ruling 2026-08-11: "File as one follow-up."** ⛔ **Not filed by this task — filing briefs is
the producer's (ADR-033).** The driver routes the filing. Three items, one brief:

1. **The DISTINCT-vs-total refusal is unpinned** (was R3). Dropping the `seen` de-dup at
   `dashboard.sh:118` leaves the **whole suite green** (re-measured against the post-fix suite:
   **129/129**), while `# Sprint 5 — Sprint 5` would then wrongly refuse. Both T6 fixtures use two
   *different* identities, so nothing exercises the de-dup. **Scope note:** T6's comment previously
   *claimed* this coverage; that claim was **corrected in this round** (owner ruling 2026-08-11, "Fix
   the comment now") and the comment now states plainly that the de-dup is unpinned and points here.
   **The guard itself is still outstanding and is what this item asks for** — the correction was
   docs-only and changed no test.
2. **The first-line-only narrowing is unpinned** (was R4). Replacing `head -1 "$1"` with `cat "$1"` at
   `dashboard.sh:109` leaves the **whole suite green** (129/129). Two consequences go unguarded: the
   owner-approved ADR-040 §2.1 narrowing could be silently reverted, and a whole-file scan would
   `print` twice and hand `PLAN_SPRINT` a **multi-line value** — a shape no consumer at `:832`/`:862`/
   `:965` expects. ⚠️ **The narrowing itself is correct and is not the finding**; the finding is that
   nothing reds if it is undone.
3. **No `test/prove-red.sh` mutation covers the new grammar** (the build's own residual 1). ADR-026
   discipline suggests one; `0264`'s verification step 7 fenced the diff to two files, so editing
   `prove-red.sh` was out of scope by the brief's own rule. The red-proofs were done manually and
   recorded in `worklog.md` and in the *Coder response* above.

**Why bundled:** all three are the same shape — a correct behavior with no test that reds when it is
undone — in one file pair, best fixed in one pass.

**Re-raise condition:** none. This is filed work, not a dispute. It leaves the tree when the follow-up
ships.

### A3 — `gawk` / `mawk` / `busybox awk` are UNVERIFIED

Neither is installed on this machine; only BSD one-true-awk 20200816 was exercised. Every construct
used (`substr`, `gsub` with a `"\n"` replacement, `split`, dynamic regex, `[[:space:]]`, `in` on an
implicit array) is POSIX, and the forced `LC_ALL=C` (`dashboard.sh:41-42`) makes the em/en-dash
literals byte-matches rather than locale-dependent ones — **so it is believed portable, but it was not
measured.** Carried by both the worker and the reviewer as a **stated coverage limit, not a finding**.

**Re-raise only if:** a consumer reports the ladder misbehaving on a non-BSD `awk`, or a GNU/`mawk`
environment becomes available to measure.

### Discharged this round — CLOSED, not re-raised

- **`0259`'s residual "T1 cannot discriminate a correct identity grammar from a lucky one"**
  (`ai-agents/tasks/done/0259-…/review.md`). Its stated re-raise condition was *"`0264` ships
  without ADR-040's **T2**."* **T2 ships**, at `test/dashboard-contract.test.js:782`, with **both**
  sub-cases, and it is **red pre-change** (measured — see below). The condition is not met and cannot
  now be met. **Closed, not re-raised.**

  **Owner ruling 2026-08-11 (live `AskUserQuestion`, `fkit lead` session): "Discharge it — close,
  don't re-raise."** Recorded. The discharge is recorded **here, in `0264`'s ledger, deliberately**:
  ⛔ nothing under `ai-agents/tasks/done/0259-…/` was modified. That task is closed and its `✅ Done`
  is the owner's. **The original residual's text still lives in `0259`'s own ledger**
  (`ai-agents/tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/review.md`)
  — read that for the wording; read this for the disposition.

---

## Re-litigates settled decisions (suppressed)

Recorded so they are visibly declined, not silently dropped.

- **The first-line-only narrowing of rung 1** — settled by ADR-040 §2.1 and the owner's plan approval
  of 2026-08-11. Re-raise condition (*"a concrete case where it breaks a real plan the old code
  handled"*) was actively tested and **not met**: all six of this repo's plans and all twelve
  downstream §7 rows are unaffected, and OLD-vs-NEW dashboard output is **byte-identical** on every
  live plan. Not raised. (R4 above is about the *absence of a test*, not about the narrowing.)
- **The closed `plan-` prefix being unevidenced by any observed file** — ADR-040 §3 + *Authority* row
  2, owner-ruled verbatim *"Include `plan-` (Recommended)"* as forward cover. Not raised.
- **The one-letter suffix bound** — ADR-040 §1 + *Authority* row 1, owner-ruled verbatim *"One letter
  (Recommended)"*. Re-raise needs a real project with a two-letter suffix; none found. Not raised.
- **`# Product | Sprint 4 | theme` refuses** (pipe is not a delimiter) — ADR-040 *Re-raise only if*
  bullet 2. Condition (*a real project using that separator*) **not met**. Verified the behavior
  (refuses, loudly) and suppressed.
- **Neither reviewer proposed ADR-040's rejected options (b) or (c)** — no closeout material this
  round.

---

## Verified and dismissed — checked against the code, found correct, no row raised

Recorded so the coder does not re-chase them.

**ADR-040's binding clauses**

- **§Consequences' binding mitigation — "exactly one implementation of this grammar in
  `dashboard.sh`."** ✅ `SPRINT_NUM_RE`/`SPRINT_ID_RE` (`:92-93`) are composed by all three sites and
  only those: rung 1's awk `-v tok` (`:109`), rung 2's `sed -nE` (`:136`), `moved_target` (`:752`).
  Grepped the whole file for `Sprint [0-9]`, `sprint-`, `[0-9][0-9]*` — the only other numeric regex
  is the task-id parser at `:536`, unrelated. **Genuinely single-sourced; nothing re-stated.**
- **§7 the regression guard — a genuinely unidentifiable plan MUST still report.** ✅ Load-bearing,
  mutation-proved twice: commenting out the `add_fact "drift unresolved-plan-sprint …"` emission reds
  **T5, T3, T4, T6, T7, T11, R8, R22 and `task 68`**; deleting
  `[ -z "$PLAN_SPRINT" ] && plan_level_drift=1` (`:977`) reds **T5, T3, T4, T6, T7, T11, R22,
  `task 68`**. All three consumers still fire.
- **§2.4 the whole-segment anchoring.** ✅ Mutation-proved: dropping the `^…$` anchors (containment
  matching, ADR-040's rejected option (b)) reds **T3, T5, T7**.
- **§1 the one-letter suffix bound.** ✅ Mutation-proved: widening `SPRINT_NUM_RE` to `[0-9]+[a-z]*`
  reds **T7**.
- **§6 the `moved_target` companion + `prove-red` mutation 14.** ✅ Still armed. `prove-red.sh` is
  **unchanged** by this diff, and its awk matcher `/moved_target=\$\(printf/` still hits the rewritten
  line. Re-ran the gate: `14. move-target extractor reverted to Sprint-only — "0210/A" should go RED
  ... red`.
- **§Validation — the twelve-row release-gate table.** ✅ Ran all twelve real downstream filenames and
  H1s through the landed ladder: **12/12 exactly as ADR-040 specifies**, including row 3
  (`plan-sprint-4c.md` → `Sprint 4c`, **not** `Sprint 4`), rows 1 and 12 correctly **EMPTY**, and row 6
  (`sprint-backlog.md`) correctly empty and deferred to ADR-041 by name.
- **§4 rung 3 unchanged.** ✅ `backlog` basename → `Backlog`; only the comment's wording changed
  (`:149`, "glob" → "`sprint-<N>` stem"). ADR-040 T8 (`task 68: the backlog identity also silences the
  plan-level drift clause…`) is **byte-identical** to `HEAD`.

**The two self-reports the driver asked me not to take on trust**

1. **"Plan §4 predicted T6 green pre-change; it measured red."** ✅ **Confirmed by independent
   measurement.** I built a tree with `HEAD`'s `dashboard.sh` + the working tree's tests. Reds
   pre-change: **T1, T2, T6, T9, T10**. T6 is red at sub-case **(b)**: the old rung 1
   (`^# \(Sprint [0-9][0-9]*\)`) matched the leading `# Sprint 5` of `# Sprint 5 — Sprint 6` and
   resolved `Sprint 5`, so no `unresolved-plan-sprint` fired. **The new refusal is correct per
   ADR-040 §2.5** — two *distinct* tokens ⇒ refuse, fall to the stem, and `hardening.md` has none.
2. **"A first, malformed T11 mutation gave a false red-proof; detected, corrected, re-run."**
   ✅ **Confirmed in all three states, by re-running the mutations myself:**
   - corrected **T10** mutation (drop `(plan-)?`, renumber `\2`→`\1`) → **T10 red, alone**;
   - corrected **T11** mutation (open to `^.*sprint-…`, `\1`) → **T11 red, alone**;
   - the **hollow** variant (drop `(plan-)?`, keep the dangling `\2`) → **T10 red + R8 red, T11
     GREEN** — reproducing the exact false proof described. **The corrected red-proofs hold.**
   - **Swept the other red-proofs for the same hollowness**: the three step-3 mutations were re-run
     independently (see §7 and §2.4 above) and each reds its named assertion. **No other hollow
     proof found.**

**Correctness of the grammar, measured**

- **awk segment split.** ✅ Correct on BSD one-true-awk 20200816 under the forced `LC_ALL=C` (`:41-42`,
  set before any of this runs): em dash, en dash, colon and ` - ` all split; a **bare** hyphen does
  not (`Post-Sprint` stays one word); `&` in a title is inert; `[[:space:]]` trims a trailing `\r`, so
  **CRLF plans work**; a file with **no trailing newline** works; an **empty** file yields nothing;
  multi-digit (`Sprint 123`) works; `# Sprint 5 — Sprint 5` correctly resolves (distinct, not total).
  No backslash enters the `-v tok` value, so awk's escape processing is a non-issue.
- **Rung 2's closed allowlist.** ✅ Cannot be tricked: `PLAN-sprint-4`, `xplan-sprint-4`,
  `plan-plan-sprint-4`, `sprint-`, `sprint-4c5`, `sprint-4.md` (double extension) all refuse;
  `sprint-4`, `sprint-4b`, `plan-sprint-4c` resolve. `\2` is the correct group number (`SPRINT_NUM_RE`
  contributes no capture group).
- **`moved_target` parses every prior form.** ✅ A/B'd old vs new across nine shapes: bracketed
  `[Sprint 2]`, unlinked prose `Sprint 2 — priority 7`, `Backlog`, `[Backlog](../backlog.md)`,
  archived `../../sprints/backlog.md`, multi-digit `Sprint 12`. **Identical on every valid form**; the
  only differences are the intended suffix pickups (`Sprint 4c`, `Sprint 4b`) and R2's invalid-token
  cases. Alternation ordering is safe — `Backlog` never begins `Sprint `.
- **No regression on this repo.** ✅ Ran `HEAD`'s and the landed `dashboard.sh` over all six live
  plans (`sprint-5`, `backlog`, `done/sprint-1..4`): **byte-identical stdout on every one**, zero
  `drift unresolved-plan-sprint` facts. (The two `unresolved-plan-sprint` string hits on `sprint-5.md`
  are the words appearing inside two board cells' own prose, not facts — present under `HEAD` too.)
- **`fixture()`'s new `planName` parameter.** ✅ Defaults to the historic `sprint-1.md`; the only two
  deleted lines in the test file are the signature and the `planPath` join. No test was removed or
  renamed — the title list diff against `HEAD` is **additions only** (10 new cases).
- **`0259`'s T1 case and the two older R8 cases.** ✅ The two older R8 cases (`:641` prose-H1 fallback,
  `:654` unresolvable-is-reported) are **byte-identical to `HEAD`**. T1 does not exist at `HEAD`
  (`0259` is uncommitted in the same tree), so I reconstructed its baseline from `0259`'s own records:
  the current block is `0259`'s planned text **plus exactly** its two review-round amendments — the
  `missing-brief` fixture-integrity guard (`0259` review R1) and the comment amendment naming T2
  (`0259` review R2, owner ruling *"Amend to name T2"*). **No residue. Byte-unchanged by `0264`.**
  ⚠️ **One note on method, not outcome:** the worklog justifies this with *"2 deletions, both inside
  `fixture()`"*, which does not actually prove it — a pure *insertion* inside T1's block leaves no
  deletion. The conclusion is right; the stated evidence does not carry it.
- **Suite and gate, re-run independently.** ✅ `npm test` exit 0 — **692 tests / 692 pass / 0 fail /
  0 skipped**; `prove-red.sh` `✓ hard gate PASSED`, baseline gates `0a`–`0i` green, **all 15
  mutations red at their named assertions**.
- **Diff surface.** ✅ `git diff --stat -- claude/ test/ bin/` touches exactly the two files.
  `ai-agents/wiki-vault/` clean. No commit made.

**Stated coverage limits — carried, not claimed as proven**

- **`gawk` / `mawk` / `busybox awk` are UNVERIFIED.** Neither is installed on this machine; only BSD
  one-true-awk was exercised. Every construct used (`substr`, `gsub` with a `"\n"` replacement,
  `split`, dynamic regex, `[[:space:]]`, `in` on an implicit array) is POSIX, and the forced
  `LC_ALL=C` makes the em/en-dash literals byte-matches rather than locale-dependent ones — so I
  believe it portable, but I did not measure it. This matches the worker's own residual 2. **Not a
  finding; a stated limit on this review's coverage.**
- **Codex could not run the suite** (its read-only sandbox blocked `mkdtemp` with `EPERM`). All
  execution evidence in this ledger is mine. Codex's static analysis was complete.
