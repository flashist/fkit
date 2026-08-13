# ADR-042: A Codex review is reasoning-only — and every review report must say so

**Date**: 2026-08-11
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md`
**Decided by**: the architect (D1, and the D2 recommendation); **the owner — D2, ruled 2026-08-11
against the architect's recommendation, knowingly and provisionally**

## Context

fkit's thesis rests on a genuinely model-diverse second opinion:
[[decisions/adr-009-claude-code-native-is-the-only-runtime]] makes Codex **required, not optional**.
**What that second opinion actually *guarantees* had never been written down. Measured, it guarantees
less than the reports have been claiming.**

### Finding 1 — the Codex reviewer has never been able to execute anything

Every site invoking the second opinion hard-codes `codex exec --sandbox read-only`. `read-only` blocks
all filesystem writes, and `mkdtemp` is a write. So the Codex reviewer **cannot run the test suite,
build a fixture, or execute a mutation — and never could.** This is fkit's own prescribed flag, not a
broken environment and not new. `test/prove-red.sh` opens with `work="$(mktemp -d)"`, so **fkit's own
red-proof harness is among the things Codex cannot run.**

This is a capability limit, not a bug, **and not a total loss**: on task `0265` the read-only Codex
pass *originated* three findings — including one ADR-040 breach where an unreadable file resolved to
a confidently *wrong* identity — all independently verified correct. **Static reasoning finds real
defects.**

### Finding 2 — the reporting defect, which is the more urgent half

The degradation contract is written for a **binary**: Codex ran, or *"Codex reviewer unavailable"*. It
has **no vocabulary for the actual, permanent state** — Codex ran, read the diff, reasoned well, and
*measured nothing*. The reviewer is then asked for a coverage self-assessment with only that binary to
express it in.

The consequence, across three reviews in one sprint **with the same flag and the same capability each
time**:

| Task | Coverage claim | Reality |
|---|---|---|
| `0259` | *"Coverage is FULL — no reviewer skipped, no degradation"* | Codex measured nothing |
| `0264` | *"coverage is **not** partial"* — while the same ledger elsewhere records *"Codex could not run the suite… All execution evidence in this ledger is mine"* | **Self-contradictory in one file** |
| `0265` | **PARTIAL**, loudly and correctly | Accurate |

**Identical inputs, three different claims.** *"FULL coverage" has been quietly meaning both reviewers
**read** it, never both reviewers **measured** it.* A reader is entitled to think otherwise.

## Decision — two decisions; D1 stands on its own and does not depend on D2

### D1 — Name the guarantee, and forbid any report that overstates it *(architect's call)*

**What the second opinion guarantees today is *independent reasoning over the diff*, by a different
model family — and nothing about execution.** That is worth having, and ADR-009's model-diversity
purpose survives intact. What is not permitted is a report implying more.

1. **The coverage vocabulary gains a third state**, replacing the ran/unavailable binary:
   - **both reviewers measured**;
   - **reasoning-only second opinion** — Codex ran and reasoned; **all execution evidence is the
     Claude reviewer's**. Under the current sandbox this is the *normal, expected* state, **not a
     degradation event**;
   - **Codex unavailable** — the existing loud `[claude-fallback — NOT model-diverse]` case.
2. **No review report may state or imply "FULL coverage" on the strength of a reasoning-only Codex
   pass.**
3. **This is a reporting-honesty rule, not a degradation flag.** It must not inherit the fallback
   banner's alarm tone: *nothing is broken, and treating the normal case as a failure would train
   readers to ignore the banner that **does** signal failure.*

### D2 — Sandbox mode: `workspace-write` in place, at the repo root *(owner's ruling — option 3)*

All executable call sites move from `--sandbox read-only` to `--sandbox workspace-write`, keeping
`--cd "$PWD"` at the repo root, so Codex can run the suite, fixtures and mutations directly against
the working tree.

**The architect recommended option 2 (a disposable git copy) and recommended against option 3. The
owner ruled option 3 anyway, knowingly and provisionally.** The structural objection is **not
withdrawn** and is preserved verbatim in the ADR's options section. *Recording that sequence is the
point of the entry.*

> **Owner ruling — verbatim, live `AskUserQuestion`, `fkit lead` session, 2026-08-11:**
> *"Let's not implement the separate git worktree approach, let it access to the root of the project.
> I will check how it works in fkit and in my other projects and if needed, will ask you to harden
> the rules in the future or to disable the write-access at all."*

**Stated intent: provisional**, with two named exits reserved — **harden the rules**, or **disable
write access entirely** (back to `read-only`, i.e. D1 alone).

#### ⚠️ The invariants this ruling gives up — stated plainly

- **[[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]'s one hard wall is no longer
  structural.** ADR-022 kept the adversarial reviewer restricted for exactly one reason: its lack of
  write access made *"the independent second opinion never touched the code it is judging"* a
  **structural fact rather than a promise**. Under this ruling **that sentence becomes a promise
  again**, held only by prompt instruction.
- **[[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]'s vault exclusivity is no longer
  structurally enforced against Codex during a review.** `ai-agents/wiki-vault/` sits under the repo
  root and is therefore inside the writable workspace. **The rule stands; the structural guarantee
  behind it does not, for the duration of a review.**
- **A violation would likely be invisible.** No hook sees the write, no test watches the tree during a
  review, and the review's own output would not mention it. **Detection requires someone to diff the
  working tree after a review and notice.** ⚠️ ***Absence of reported violations is not evidence of
  none*** — do not read a quiet period as validation.

#### What "harden the rules later" can and cannot mean — a correction that widens the owner's exit

The lead relayed to the owner that hardening later is *largely unavailable*. **Half of that is right
and half is wrong**, and the correction is recorded because it widens the fallback:

- **Correct:** no **Claude Code** hook can gate this. Codex's model-generated shell commands execute
  inside the codex process and never enter Claude Code's tool loop, so ADR-018's mechanism is
  genuinely unavailable. This remains the basis of the option-3 objection.
- **Wrong:** it does not follow that only prose remains. **Codex ships its own hook system**, verified
  in codex-cli 0.145.0 — so **the real hardening lever is a Codex-side `preToolUse` hook**:
  enforcement *inside* the process that runs the commands, the one layer that can see them. That would
  be structural, not advisory.
- ⚠️ **Four things are unverified and required before relying on it:** that such a hook can actually
  **deny** rather than only observe; whether hooks can be scoped to a **project** or only user-global
  (which decides whether fkit can *ship* the protection or only document it); that they fire under
  non-interactive `codex exec`; and how hook trust interacts with automation. **Do not treat
  Codex-side hooking as available until these four are measured.**

## Consequences

- **Positive:** what "second opinion" means is written down and no longer varies by reviewer mood; a
  reader can tell reasoning from measurement; the three-way inconsistency cannot recur; ADR-009's
  model-diversity purpose is preserved and explicitly *not* made decorative by either branch.
- **Positive, from D2:** the second opinion can red a test or prove a regression rather than only
  argue for one; findings cite real repo paths with no translation layer; cheapest possible
  implementation — one flag value, four call sites, no new machinery.
- ⚠️ **The mirror-image trap.** Once D2 ships, *reasoning-only* stops being the by-construction
  constant and becomes a **per-run fact**. **D1's rule tightens rather than relaxes:** a report may
  claim *both reviewers measured* **only** when the Codex pass actually ran something, evidenced in
  its output — **never inferred from the sandbox flag permitting it**. ***Implementing D2 without
  updating D1's reporting logic would recreate the original defect in mirror image.***
- **Two existing ledgers overstate what happened** (`0259`, `0264`). Per
  [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] a ledger
  closes on the work product, so **neither is edited**; whether they are corrected is a follow-up for
  the producer, **not filed by this ADR**.
- **D2 is deliberately easy to re-raise** — five named conditions, of which **1–3 depend on someone
  LOOKING**. A cheap check exists (a post-review `git status --short` against the reviewer's declared
  writes) and **is not built**.

## ⚠️ Correction note — 2026-08-11: the site count is five under `claude/`, not four

**Owner-ruled the same day** that this correction be appended. **The accepted decision is unchanged**;
only one factual enumeration was wrong. An exhaustive `grep` found **five** sites under `claude/`, of
**two different kinds** — and the distinction must not be flattened:

- **Four executable call sites** (three review SKILLs + the adversarial-reviewer agent definition) —
  **these are the drift risk.** A partial change leaves one review path on `read-only` and another on
  `workspace-write`, so **the same review would report different coverage depending on entry point** —
  the exact inconsistency D1 exists to eliminate.
- **One documentation-only site** (`claude/README.md`) — **a doc-accuracy obligation, not a drift
  risk.** Nothing executes it, but leaving it stale means the file that *explains* the Codex pass
  describes a state that no longer exists.

**Three further sites, outside the implementing task's scope**, were missed by both the producer and
the lead: `ai-agents/knowledge-base/architecture.md` states the flag **three times**, including
**inside the runtime mermaid diagram**. The implementing task's verification grep is confined to
`claude/`, so **once D2 lands the project's own architecture document will describe a sandbox mode
fkit no longer uses, in three places.** Routing that is the producer's call and **was not filed here**.

**Sites deliberately NOT to be changed, recorded so nobody "fixes" them later:** frozen test fixtures
(editing them changes what the suite asserts); historical ADRs (008, 009, 016 — *an accepted ADR is
not retro-edited; **this note is itself the pattern***); dated reports and closed ledgers; and
`ai-agents/wiki-vault/` (ADR-005 — the vault follows when the ADR is ingested, which is this page).

## Related
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — Codex required, not optional; the source of the model-diversity guarantee this ADR **bounds**
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the one deliberately restricted role; the basis of the option-3 objection, and the invariant D2 gives up
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the structural-enforcement precedent, checked and found **not applicable** to Codex subprocesses
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — vault writes are the wiki role's alone; **structurally unenforced against Codex during a review under D2**
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — why the two overstating ledgers are not edited
- [[systems/review-and-model-diversity]] — the Codex pass, the degradation contract, and the ledger
- **The three ledgers that are its evidence:** [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] (`0264` — **self-contradictory in one file**) · [[tasks/implement-adr-041s-dashboard-half]] (`0265` — **the one that reported correctly**, and where the read-only pass originated three verified findings) · and `0259`'s, on [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]]'s task. ⚠️ Per ADR-034 **none of the three was edited.**
- [[tasks/update-the-docs-for-the-structure-check-capability]] — `0248`: the task that last swept `architecture.md`, which **now states the sandbox flag three times including inside a diagram** — three sites **outside** the implementing task's `claude/`-confined scope
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the layer that reaches Codex natively via `--cd`; **unaffected by D2, which changes the sandbox and not the `--cd`**
- [[systems/fkit]] · [[tasks/give-codex-the-universal-hard-rules]] — the two other places the vault describes what the Codex pass may and may not do
- [[tasks/give-codex-the-universal-hard-rules]] — ⚠️ **whose rule-3 wording rests on *"Codex cannot move a file anyway"* — a premise D2 retires when it ships**
