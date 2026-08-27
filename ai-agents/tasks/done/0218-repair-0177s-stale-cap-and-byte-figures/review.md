# Review — 0218

Task: 0218 — [brief](./brief.md)
File(s) under review: `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md` (+20/−8, 4 hunks); `ai-agents/tasks/backlog/0218-repair-0177s-stale-cap-and-byte-figures/worklog.md`
Status: in-review

**Round 1 verdict — ⚠️ Changes requested — 4 defects (none blocking).** Both reviewers ran; Codex
coverage complete (`codex-cli 0.145.0`), no degradation.

**The repair is sound and a large net improvement.** It removes a live instruction to revert an
owner-signed change. All four findings are wording/durability defects *inside the replacement text* —
none re-opens the repair's decisions, and none justifies holding the change.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md:24` | The blanket warning "**Every** byte figure below is a snapshot, **not an acceptance criterion**" contradicts lines 83 and 110, which declare the **≥400 B** headroom target *"that is the criterion"* / *"still ≥ 400 B"*. `≥400 B` is a byte figure below line 24, so a worker can legitimately read the one figure `0218` was required to preserve as a criterion as merely a snapshot. Scope the warning to *absolute* figures, or except the ≥400 B target by name. |
| R2 | 1     | low    | `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md:22` | The snapshot warning covers figures "**below**" it, so the `RULES_MAX` cap value **4352 B** on line 22 — which sits *above* the warning — is left presented as the live cap. This is site 1 of 4; the other three figure sites (87, 103, 111) are each explicitly dated/labelled. At the next owner-signed bump this one sentence restates a stale current value, i.e. the failure class `0218` exists to kill recurs at exactly one site. Mitigated (not cured) by the inline `re-measured 2026-08-16` stamp. **Raised by both reviewers.** |
| R3 | 1     | low    | `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md:108` | *"run the real `emit_block()` … and report the raw output"* is ambiguous against the technique it cites. `emit_block()`'s literal raw output is the entire ~3837 B rules block; the figure step 6 actually needs is the **byte count** (`test/rules-block-budget.test.js` computes it via `Buffer.byteLength(r.stdout)` and surfaces it only through assertions). Verified PARTIALLY CORRECT — the intended reading ("raw output of the measurement command", matching `0218` step 1) is the more natural one, but the sentence admits a reading that produces the wrong artifact. Say "report the measured byte count and the command that produced it." |
| R4 | 1     | low    | `ai-agents/tasks/backlog/0218-repair-0177s-stale-cap-and-byte-figures/worklog.md:29` | The worklog asserts *"no `## Status` changed anywhere (0177 stays 🔲 Backlog; **0218's own status untouched**)"*, but `git diff` on `0218`'s own `brief.md:13` shows `🔲 Backlog` → `🔄 In progress` in the working tree. The claim is true **of the build step** (the flip predates it — the worklog's own before/after `git status` delta is exactly one line, `0177`'s brief), but as written it is an unqualified assertion about the tree that reads false to a later auditor. Contradicts `ai-agents/knowledge-base/conventions/evidence-before-assertion.md`. Fix by scoping the clause: *"0218's own status not changed by this step."* |

### Verified and clear — no finding (recorded so they are not re-checked)

- **Figures are correct.** Re-measured independently this review, 2026-08-16: `RULES_MAX=4352`
  (`claude/fkit-claude-init.sh:337`), emitted block **3837 B** (ran the real `emit_block()`, UTF-8
  bytes), source 3433 B, free **515 B**, wrapper **404 B**. Every figure in the repaired brief matches.
  Codex reproduced the same four numbers independently.
- **Step 6 is achievable.** `emit_block()` emits markers + a hardcoded `printf` comment +
  `claude/scaffold/universal-rules.md`. `0177`'s two scoped edits — the shell comment above
  `RULES_MAX=` and the `test/rules-block-budget.test.js` header — are both outside that set, so they
  **cannot** move the emitted size. *"Same figure before and after"* is reachable, not a trap. Both
  reviewers concur.
- **No surviving absolute criterion elsewhere in `0177`.** All 7 verification steps and all 4
  `## What to build` items were read in full. Step 2 explicitly permits `codex-cli` to differ from
  `0.145.0`; step 5 reports pass/fail counts without pinning one; the `2.1.220` / `0.145.0` stamps are
  historical records, not criteria. Both reviewers concur.
- **No over-reach.** Protected regions confirmed byte-identical against `git show HEAD:` — title,
  `## ID`, `## Sprint`, `## Priority` (`Sprint 6 P4`), `## Status` (`🔲 Backlog`), `## Owner`
  (`fkit-coder`), the codex-canary subject, and the standing-trap paragraph incl. its historical
  `493 B` quote. Diff is 4 hunks at the 4 intended sites only.
- **Figure hygiene per `0218` steps 3–4.** `4096`: exactly 1 hit (line 23, labelled *superseded*,
  naming `0190`) — matches the owner's OQ1 ruling. `3570`: 0. `526`: 0. `404` and `≥400 B` survive.
- **Nothing under `claude/` or `test/` was touched by `0218`.** `claude/fkit-claude-init.sh` and
  `claude/scaffold/universal-rules.md` are both clean, so the live measurement above equals HEAD's.
  (Those trees *are* dirty with unrelated in-flight work — out of scope.)

### Re-litigates settled decisions (suppressed)

**None.** No finding from either reviewer touched a settled decision. Both reviewers were primed with
the settled list and respected it. For the record, these stayed correctly unraised — and **must not**
be raised in a later round:

- The one labelled-historical `4096` (owner ruling, `AskUserQuestion` 2026-08-16, option label
  *"Keep the one labelled mention (Recommended)"*).
- `0220` not read or widened into (owner ruling, *"Check 0220 after 0218 ships (Recommended)"*).
- `404 B` and the `≥400 B` target surviving uncorrected (`0218` `## What to build` §2, verification §4).
- No suite run and none claimed (`0218` verification step 7 — a suite result is **not owed** here).
- Change left uncommitted in the working tree (`0218` `## Notes`).
- `0177` staying open at `🔲 Backlog` (`0218` `## What to build` §5).

**⚠️ R1 is not a re-litigation of the `≥400 B` target.** It does not propose changing that target — it
reports that the new line 24 undermines it. Do not suppress R1 against the settled item above.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

Responded by a spawned `fkit-producer` worker (0218's `## Owner` names the producer), driven by
`/fkit-sprint-ship-loop`, 2026-08-16. **No owner channel.** The owner ruled on all four dispositions
in the live `fkit lead` session before this step began, via `AskUserQuestion`, verbatim option labels:
R1+R2+R3 — **"Repair all three now (Recommended)"**; R4 — **"Correct the clause (Recommended)"**.
Every finding was re-verified against the files here before acting.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Warning rewritten: scoped to **absolute** figures **and** the ≥400 B target excepted by name. | Fixed |
| R2 | CORRECT | Defect | Same rewrite: scope changed from figures *"below"* to *"in this brief"*, with the line-22 cap figure named as included. | Fixed |
| R3 | CORRECT (reviewer classed it PARTIALLY CORRECT; the ambiguity is real either way) | Defect | *"report the raw output"* → *"report the **measured byte count** plus the exact command that produced it — the count, not the emitted block's own text."* | Fixed |
| R4 | CORRECT | Defect | Worklog clause scoped: *"0218's own status **not changed by this step**"*, with the pre-existing driver flip stated. | Fixed |

**Evidence per finding.**

- **R1 — verified.** Pre-fix line 24 read *"Every byte figure **below** is a snapshot, not an acceptance
  criterion"*; lines 83 and 110 read *"that is the criterion"* and *"free headroom still ≥ 400 B"*. The
  ≥400 B target is a byte figure below line 24, so the blanket warning did license reading the one
  figure `0218` was required to preserve as a mere snapshot. Fixed at the warning, **not** at the target
  — the ≥400 B target itself is owner-settled and was not weakened; it is now named as the single
  exception, which strengthens it. `0177` brief lines 24–27 now read:
  *"**⚠️ Every absolute byte figure in this brief — the cap figure in this very sentence included — is a
  dated snapshot, not an acceptance criterion: re-measure before treating one as a pass/fail. The one
  exception is the ≥400 B standing headroom target below, which is an owner-set criterion, not a
  snapshot — it does not expire and is not re-measured away.**"*
- **R2 — verified.** `RULES_MAX` **4352 B** sits on line 22, above the old warning's *"below"* scope.
  The same rewrite cures it: scope is now *"in this brief"* and the cap figure is named as covered.
  Line 22's `404 B` and `4352` tokens are byte-identical to their pre-response state.
- **R3 — verified.** `emit_block()` writes the whole ~3837 B block to stdout; `test/rules-block-budget.test.js`
  derives the count with `Buffer.byteLength` and never prints it. *"Report the raw output"* therefore
  admitted a reading that produces the wrong artifact. The replacement names the artifact.
- **R4 — verified by `git diff`, not taken on the reviewer's word.**
  `git diff -U0 -- ai-agents/tasks/backlog/0218-repair-0177s-stale-cap-and-byte-figures/brief.md` →
  `@@ -13 +13 @@ / -🔲 Backlog / +🔄 In progress`. The clause was true of the build step and false as an
  unqualified statement about the tree. Now scoped, with the driver's pre-spawn flip named.

**Figure hygiene re-run after this response** (`/usr/bin/grep -n` over the `0177` brief):

- `4096\|3570\|526` → **exactly 1 hit**, line 23, the labelled-superseded mention naming `0190` (owner
  ruling OQ1). `3570`: 0. `526`: 0.
- `404\|400 B\|≥400\|≥ 400` → 6 hits (lines 22, 26, 29, 85, 113, 130). **Line 26 is one new occurrence
  added by this response** — it is the ≥400 B exception R1 asked for by name. Disclosed rather than
  buried: the plan's step-4 check expected the pre-response occurrence set, and the owner-ruled R1 fix
  necessarily adds to it. No `404`/`400` token was removed.
- Protected regions re-confirmed verbatim: title, `## ID` `0177`, `## Sprint` `Sprint 6`, `## Priority`
  `Sprint 6 P4`, `## Status` **`🔲 Backlog`**, `## Owner` `fkit-coder`, the codex-canary subject, the
  standing-trap paragraph incl. its historical `493 B` quote (now line 53).

**Scope.** Two files written: the `0177` brief (still exactly **4 hunks**, HEAD-side lines {22, 80–81,
94–95, 98–100}, now 23 insertions / 8 deletions) and `0218`'s `worklog.md`. `git status --porcelain`
delta against the pre-response snapshot: **empty** — no new modified path anywhere, including under
`claude/`, `test/`, `ai-agents/sprints/`, and `ai-agents/wiki-vault/`. No task file moved, no `## Status`
changed on any task, `0220` neither read nor touched (owner ruling OQ2). No commit, no push.

**No suite was run and none is claimed** (`0218` verification step 7). No measurement was re-taken in
this response step either — the figures were not edited here.

## Accepted residuals (shared, do-not-re-litigate)

<!-- Populated once the owner rules on a disposition. Empty at round 1. -->

## Convergence call — round 1

**Act, do not close out.** All four findings are novel; none re-litigates a prior round (there is no
prior round) or a settled residual. R1 is the only one with a plausible path to a wrong worker action
and it is a one-clause fix. R2–R4 are durability and record-accuracy defects.

The change is **not blocked**. Shipping it as-is is strictly safer than HEAD, which instructs a `0177`
worker to revert an owner-signed cap bump. If the owner prefers to close `0218` now, R1–R3 should be
carried as a follow-up against `0177` rather than dropped, since they land in the same four sentences.
