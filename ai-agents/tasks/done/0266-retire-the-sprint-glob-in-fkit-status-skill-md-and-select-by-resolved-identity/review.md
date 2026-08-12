# Review — 0266

Task: `ai-agents/tasks/done/0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/brief.md`
File(s) under review: `claude/skills/fkit-status/SKILL.md` (working tree, +35/-11)
Status: closed-out

**Closing verdict (2026-08-12): ✅ Ready to merge — 0 open defects, 2 accepted residuals.**
Both Round 1 findings are discharged and re-verified against the code by measurement. See
*Round 1 closeout* at the end of the Convergence call.

**Round 1 · 2026-08-12.** Reviewers run: **fkit-reviewer** (own pass) **+ Codex** (`codex exec
--sandbox read-only`, exit 0). **Both passes completed — coverage is NOT degraded.**

**Round 1 verdict (historical): ⚠️ Changes requested — 2 defects (none blocking).**

**The binding constraint passes.** ADR-041 §5 — no identity grammar restated in prose. Verified by
grep and by reading: the file contains no segment-delimiter list, no `Sprint [0-9]`-shaped pattern, no
suffix bound, and no `plan-` allowlist. `grep -n 'sprint-\*' SKILL.md` returns nothing — the glob is
gone with no fallback and no comment reintroducing it. Owner ruling 3 (ordering stated outcome-only)
is honored. ADR-041 §6's claim that this file holds exactly two sites holds — there is no eighth site.

Both findings below are the same class: **the prose describes `select-active`'s output slightly
inaccurately.** Neither touches the mechanism, and both are one-clause repairs in this file.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-status/SKILL.md:39-40` | `active file="…"` is a **basename**, not a path; "Use that path in step 4" is false as written, and following it literally makes the default `/fkit-status` run fail. |
| R2 | 1 | low | `claude/skills/fkit-status/SKILL.md:53` (+ pre-existing `:354-357`) | `active none` is a **normal answer that exits 3**; the file treats every non-zero exit as a script failure in two places, one of which instructs a hand-built board — the fallback ADR-041 §1.6 forbids. |

### R1 — `file="…"` is a basename, and the prose calls it a path

**Raised by both reviewers** (Codex rated it high; severity reduced to medium after tracing — see
blast radius).

`dashboard.sh:271-272` emits the value through `basename "$_f"` (`dashboard.sh:242`), so the field is
a bare filename:

```
active file="sprint-5.md" identity="Sprint 5"
```

`SKILL.md:39-40` then says: *"**that file is the active sprint.** … Use that path in step 4."*
Step 4 (`:206`) takes `<path-to-the-sprint-plan-you-resolved-in-step-1>`.

**Measured failure** — following the instruction literally from the repo root:

```
$ bash claude/skills/fkit-status/dashboard.sh sprint-5.md
dashboard.sh: no such sprint plan: sprint-5.md
exit=1
```

**Verified verdict: CORRECT. Defect.** **Severity medium, not high** — the failure is *loud* (`die`,
exit 1), not silent, and a model will very likely re-join it with the `ai-agents/sprints` argument it
just passed. It costs a failed step and risks a confused report; it does not produce a wrong status
board. But this file's whole premise is that prose is executed literally, and "path" is factually the
wrong word for a basename. The `file=` field is a basename **everywhere** in this script's records —
the repair is to say so, not to change the script.

### R2 — exit 3 is a valid answer, and the file reads it as a failure

**Both halves raised across the two passes** (reviewer: the new `:53` clause; Codex: the pre-existing
`:354-357` section).

`select-active` distinguishes the two cases **by exit code**, and the prose collapses them:

- **exit 1** — `die "no such sprints directory"` — a genuine failure.
- **exit 3** — `active none`, a well-formed answer with the version marker and the full candidate
  list present. **Measured** (a `sprints/` holding only `backlog.md`):

  ```
  ⟦fkit-dashboard v1⟧ / ⟦SELECT⟧ / active none / candidate file="backlog.md" identity="Backlog"
  exit=3
  ```

Two sentences read that non-zero exit as failure:

1. **`:53` (new)** — *"If the call fails … say so rather than guessing at the shape."* Nothing says
   exit 3 is expected here, so the run may report "the dashboard call failed" instead of ADR-041
   §1.6's required output — *say there is no eligible plan, and list every candidate with its
   identity*. That listing is the entire point of §1.6.
2. **`:354-357` (pre-existing)** — *"#### If the script fails … If it exits non-zero … hand-build the
   board and lead with the flag."* With only a `Backlog`-identity board present, hand-building it is
   exactly the fallback ADR-041 §1.6 and `:47` forbid by name.

**Verified verdict: PARTIALLY CORRECT — real, but weaker than Codex rated it. Defect. Severity low.**
Locus 2 is **structurally scoped to step 4**: `#### If the script fails` (`:354`) nests under
`### 4. The dashboard` (`:201`) and closes at `### 5.` (`:375`) — verified by heading map. It governs
the board render, not the argument contract. And `:46-47`'s `active none` bullet is explicit, local,
and correct (*"stop … Never fall back to the `Backlog` board"*), and it fires **before** step 4 is
ever reached. The path to actual harm is therefore thin. It is still worth closing: the change gave
this file a **second** invocation of the same script whose non-zero exit is normal, and no sentence
anywhere says so.

**One clause in the argument contract closes both loci** — e.g. that `active none` is accompanied by
exit 3, that this is the expected answer and not a failure, and that step 4's hand-build fallback does
not apply to it.

## Suppressed as settled — re-litigation, not findings

Nothing was suppressed this round: neither reviewer re-raised a settled item. Recorded for the next
round, since the priming held:

- **No test proves this file's body.** `dashboard-contract.test.js:2484` records SKILL.md prose as
  LLM-executed and untestable. The optional grep-guard test was put to the owner at the plan gate and
  **ruled OUT** (verbatim: *"No — surfaced, not built (Recommended)"*). Re-raise only on a test that
  already covers this file and is now broken.
- **Edit 3 (`:213-214`) was ruled IN scope** by the owner at the plan gate (verbatim: *"Yes, apply it
  (Recommended)"*). Not scope creep.
- **The ordering/suffix rule is deliberately absent from prose** (owner ruling 3, verbatim: *"Ratify —
  outcome only (Recommended)"*). Its absence is the decision, not an omission.
- **0265's residuals A1–A4** (`ai-agents/tasks/done/0265-…/review.md`) are `dashboard.sh`'s, settled
  2026-08-11, and out of this task's reach. Note **A4** already discloses that a newline in a plan
  basename makes `active file=` name a file that does not exist — a `dashboard.sh` limit, **not** R1.

## Convergence call

**Act, do not close out.** Round 1, no prior rounds, no re-litigation: both findings are novel,
verified against the code with measured output, and neither re-argues an owner ruling or an ADR
re-raise condition. Neither is blocking, and both repairs live inside this task's single approved file
with no new mechanism and no ADR-041 §5 exposure. **Regression check: clean** — no prior finding
exists for either repair to recreate.

The task's substance — retiring the glob and sourcing identity from `dashboard.sh` — is **done and
correct**. R1 and R2 are precision repairs to how the new prose describes the script's output.

### Round 1 closeout — 2026-08-12

**✅ Ready to merge — 0 open defects, 2 accepted residuals. Ledger closed out.**

**Scope of this pass, stated plainly:** a **closeout verification of the Round 1 findings**, not a
fresh two-reviewer round on the post-fix delta. **No Codex pass ran on the fixes** — the delta is
four added lines of prose plus rewording inside Edit 1's block, and every factual claim it makes was
re-verified by running `dashboard.sh` (below). Coverage of the *original* diff remains the
non-degraded two-reviewer Round 1 above.

**Each finding checked against the code, not against the coder's claim:**

| #  | Coder verdict | Discharged? | How verified |
|----|---------------|-------------|--------------|
| R1 | CORRECT / ✅ done | **Yes — fully** | Measured both directions |
| R2 | PARTIALLY CORRECT / ✅ done | **Yes — locus 1 fixed; locus 2 owner-declined and correctly recorded as a residual** | Measured exit-code split; locus 2 proven untouched |

**R1 — discharged.** `SKILL.md:38-40` now reads *"**`file=` is a basename, not a path** — join it to
the `ai-agents/sprints` you passed in, and pass *that* to step 4."* The repair is to the prose, not
the script, which is the right direction. Following the new prose **literally** now succeeds:

```
$ bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
active file="sprint-5.md" identity="Sprint 5"          exit=0
$ bash claude/skills/fkit-status/dashboard.sh sprint-5.md               # old prose, literal
dashboard.sh: no such sprint plan: sprint-5.md          exit=1
$ bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-5.md   # new prose, literal
⟦fkit-dashboard v1⟧ / ⟦BOARD⟧                           exit=0
```

**R2 locus 1 — discharged, and its every claim is true.** `SKILL.md:50-53` now states three things;
each was measured rather than accepted:

- *"`active none` exits 3, and that is an answer, not a failure"* — **true**: a `sprints/` holding
  only `backlog.md` yields `active none` + the full candidate list at `exit=3`.
- *"A real failure exits 1 and prints no `⟦SELECT⟧` block at all"* — **true**: a nonexistent dir
  gives `die` → `exit=1`, and `grep -c 'SELECT'` over its combined output returns **0**.
- *"Step 4's hand-build fallback does not apply to this call"* — this is the sentence that closes
  locus 2's live path from the argument-contract side.

**The exit set is complete, so the prose is not merely true-for-the-cases-tested.** `select-active`
can leave only three ways — `dashboard.sh:296` (`exit 0`, a pick), `:297` (`exit 3`, none), and
`die()` at `:55` (`exit 1`). There is no fourth code for the new clause to mis-describe.

**Owner ruling 1 held — proven, not asserted.** `#### If the script fails` … `### 5.` is
**byte-identical to `HEAD`**: identical `sha256`
(`cfb7745d6dd18c1355127b93e3f4d0f71fd97a89c3fc3939fdc5e84f0741758f`) on both sides. The fourth edit
site was declined and stayed declined. The heading map confirms the residual's structural argument:
`### 4.` (`:205`) → `#### If the script fails` (`:358`) → `### 5.` (`:379`), with no intervening
`###` — it governs the board render, not the argument contract.

**Binding constraints re-checked:**
- **ADR-041 §5 still passes.** `grep -n 'sprint-\*'` → **empty**; `grep -nE 'Sprint \[0-9\]|plan-[a-z]*\*|allowlist|segment|delimiter|suffix'` → **empty**. No identity grammar restated in prose, no glob, no fallback.
- **Exactly three edit sites.** `git diff -U0 | grep -c '^@@'` → **3**. No fourth site crept in.
- **`npm test` green, run by me this pass:** `tests 709 / pass 709 / fail 0 / skipped 0`, `prove-red.sh`'s `✓ hard gate PASSED`, overall **exit 0**. **This is a regression guard, not evidence the two clauses are right** — the measured `dashboard.sh` runs above are that evidence. (Recorded as the second accepted residual.)

**Residuals: both correctly recorded, neither re-litigated.** Locus 2 and the no-test gap carry the
full What / Why (structural) / Re-raise-only-if shape and rest on verbatim owner rulings. I add
nothing to that section and reopen nothing in it.

**Convergence: close.** No open findings, no new defects surfaced by this verification, and no
finding re-argues a settled residual. **Ledger `Status: closed-out`.** Any future round on this file
starts at Round 2 and must clear the residuals' re-raise conditions first.

## Coder response

_(coder-owned — reviewer does not write here)_

**Round 1 · 2026-08-12.** Processed by the coder as the **Process-review worker** of
`/fkit-sprint-ship-loop`, under the sprint-loop declared-approval carve-out
([ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
Decision 3 + its 2026-07-22 autonomy amendment; discipline per
[ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)).
Both fixes were applied **without a per-fix owner approval**, which that carve-out permits for
verified-`CORRECT`, mechanical/localized, in-approved-plan changes. Each is recorded in `worklog.md`'s
decision log. **Both repairs sit inside Edit 1's block**, which the approved plan already scopes.

**Two owner rulings taken after the review** (2026-08-12, `AskUserQuestion`, relayed by the driver):

1. **R2 — "Clause in Edit 1 only (Recommended)".** Distinguish `active none`/exit 3 from a real
   failure/exit 1 **inside Edit 1's block only**. `#### If the script fails` is **left byte-identical**
   — the fourth edit site was declined. Recorded below as an accepted residual.
2. **"Yes — run fkit-claude-init.sh . (Recommended)."** The gitignored `.claude/` install copy was
   refreshed after the source edits, so it stops executing the retired glob prose.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | `:39-41` — the `active` bullet now states **`file=` is a basename, not a path**, and to join it to the `ai-agents/sprints` argument before passing it to step 4 | ✅ done |
| R2 | PARTIALLY CORRECT | Defect | `:50-54` — one clause in Edit 1's block: **`active none` exits 3 and is an answer, not a failure**; a real failure exits 1 and prints no `⟦SELECT⟧` block; **step 4's hand-build fallback does not apply to this call**. Locus 2 (`#### If the script fails`) **not touched** — owner ruling 1 | ✅ done |

**Severity is mine to assign, and I concur with the reviewer on both** — medium for R1, low for R2 —
after re-tracing the blast radius myself. R1 fails loudly (`die`, exit 1) and produces no wrong board;
R2's live locus is guarded by the `active none` bullet at `:47-48`, which fires before step 4.

### R1 — verified CORRECT, defect, severity medium

Confirmed at source: `dashboard.sh:243` builds each record with `basename "$_f"`, and `:272` emits
that value, so `file=` is a bare filename in every `active` / `candidate` record. Measured, from the
repo root, following the old prose literally:

```
$ bash claude/skills/fkit-status/dashboard.sh sprint-5.md
dashboard.sh: no such sprint plan: sprint-5.md
exit=1
```

The reviewer's repair direction is right — **say what the field is, do not change the script**. The
`file=` shape is `dashboard.sh`'s contract and is asserted by the ADR-041 S-tests; re-shaping it to a
path would be a `dashboard.sh` change well outside this task's single approved file.

### R2 — verified PARTIALLY CORRECT, defect, severity low

The exit-code split is real and measured. Normal answer:

```
$ bash …/dashboard.sh select-active <dir holding only backlog.md>
⟦fkit-dashboard v1⟧ / ⟦SELECT⟧ / active none / candidate file="backlog.md" identity="Backlog"
exit=3
```

Genuine failure:

```
$ bash …/dashboard.sh select-active <nonexistent dir>
dashboard.sh: no such sprints directory: …
exit=1
```

Source: `dashboard.sh:296-297` (exit 0 with a pick, **exit 3** otherwise) against `die()` at `:55`
(**exit 1**, printed to stderr **before** any `⟦SELECT⟧` block). `test/dashboard-contract.test.js:2618`
(S5) already pins exit 3 as the contract, so the prose was the only thing out of step.

**Why PARTIALLY CORRECT rather than CORRECT:** the finding is accurate on both loci, but its two loci
are not equally live, and the reviewer's own tracing says so. Locus 1 (the argument contract) is a real
gap and is now closed. Locus 2 nests under `### 4. The dashboard` and governs the board render; the
owner has ruled it out of scope, and it is recorded as a residual rather than fixed.

**One non-substantive cite correction, recorded not edited** (the reviewer's rows are theirs): R2's
`:53` was `:49` in the working tree at review time — the "If the call fails" sentence, which is the
line the finding describes. R1's `:39-40` is exact. The `#### If the script fails` block the finding
calls `:354-357` was at `:354` at review time and is at `:358` now, shifted by R2's four added lines;
it is `:330` in `HEAD`. Same block throughout.

### Verification run this round

- `grep -n 'sprint-\*' claude/skills/fkit-status/SKILL.md` → **empty**. The glob is still gone.
- No identity grammar reintroduced — `grep -nE 'Sprint \[0-9\]|plan-[a-z]*\*|allowlist|segment|delimiter|suffix'` → **empty**. **[ADR-041 §5](../../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md) still passes.**
- `#### If the script fails` … `### 5. Report` **diffs byte-identical against `HEAD`** — owner ruling 1 held.
- `git diff -U0` hunk headers: exactly **three** — `@@ -26 +26 @@`, `@@ -47 +73 @@`, `@@ -189 +217 @@`.
  No fourth edit site.
- `npm test` **post-fix — green.** `node --test`: **tests 709 / pass 709 / fail 0 / skipped 0**, and
  `test/prove-red.sh`'s **`✓ hard gate PASSED`** with every mutation reddening its named assertion.
  Overall **exit 0**. **This is a regression guard, not evidence these two clauses are right** — see
  the second accepted residual below; the measured `dashboard.sh` runs above are the evidence.
- **Install copy refreshed** (owner ruling 2): `bash claude/fkit-claude-init.sh .` → exit 0.
  `diff claude/skills/fkit-status/SKILL.md .claude/skills/fkit-status/SKILL.md` → identical;
  `grep -n 'sprint-\*' .claude/…/SKILL.md` → empty. **`.claude/` appears in neither
  `git status --porcelain` nor `git diff --name-only`** — it stays gitignored, as required.

**Ledger left `Status: in-review`, deliberately.** Both findings are `✅ done` rather than
closeout/disproven/accepted, so a verification pass is the natural next step; declaring the ledger
closed is not mine to do on the round in which I made the changes.

## Accepted residuals (shared, do-not-re-litigate)

- **Step 4's hand-build fallback is not exit-3-aware** — *(from R2, locus 2; owner-ruled 2026-08-12,
  verbatim option label: "Clause in Edit 1 only (Recommended)")*
  **What:** `claude/skills/fkit-status/SKILL.md`'s `#### If the script fails` block (`:358-361` in the
  working tree after this round; `:354-357` at review time; `:330-333` in `HEAD`) still reads *"if it
  exits non-zero … hand-build the board"* with no exception carved out for a `select-active` exit 3.
  It is left **byte-identical** — verified by diffing the block against `HEAD`.
  **Why (structural):** the block nests under `### 4. The dashboard` (`:201`) and closes at `### 5.`
  — verified by heading map — so it governs the **board render**, not the argument contract, and
  step 4 is only ever reached with a plan path already in hand. The `active none` bullet at `:47-48`
  (*"stop … Never fall back to the `Backlog` board"*) is explicit, local, and **fires first**, and
  R2's repair now says outright that step 4's fallback does not apply to the `select-active` call.
  The path to real harm is therefore thin. **Rejected alternative:** a fourth edit at that block —
  declined by the owner as scope the brief does not cover (*"edits to SKILL.md only"* was approved as
  three edit sites, and a fourth would re-open the ADR-041 §6 site question this task closed).
  **Re-raise only if:** step 4 becomes reachable without step 1's `active none` bullet having fired
  (e.g. the argument contract is restructured so `select-active` is called from inside step 4), **or**
  `dashboard.sh` gains a second exit code whose meaning is "answer, not failure", **or** a measured
  case shows a run hand-building a board after `active none`.

- **No test asserts this file's body** — *(carried forward from the reviewer's suppressed list; owner
  ruling at the plan gate, verbatim option label: "No — surfaced, not built (Recommended)")*
  **What:** neither R1's nor R2's repair is covered by an automated test. `npm test` is a regression
  guard here, not evidence these two clauses are right; the measured `dashboard.sh` runs quoted above
  are the evidence.
  **Why (structural):** `test/dashboard-contract.test.js:2484` records SKILL.md prose as LLM-executed
  and untestable — which is exactly why 0265 built `select-active` as shell. The optional grep-guard
  test was put to the owner at the plan gate and **ruled out**.
  **Re-raise only if:** a test that already covers this file's body exists and is broken by these
  edits, or the owner reverses the grep-guard ruling.
