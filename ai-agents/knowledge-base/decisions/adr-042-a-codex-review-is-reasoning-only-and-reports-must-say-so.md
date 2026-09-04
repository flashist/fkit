# ADR-042: A Codex review is reasoning-only — and every review report must say so

- **Status:** accepted
- **Date:** 2026-08-11
- **Deciders:** fkit-architect (D1, and the D2 recommendation); **owner (Mark Dolbyrev) — D2, ruled
  2026-08-11 against the architect's recommendation, knowingly and provisionally (see §Owner ruling)**

## Context

fkit's thesis rests on a genuinely model-diverse second opinion: ADR-009 makes Codex **required, not
optional**, precisely so the adversarial pass comes from a different model family than the one that
may have written the code. What that second opinion actually *guarantees* had never been written
down. Measured this session, it guarantees less than the reports have been claiming.

### Finding 1 — the Codex reviewer has never been able to execute anything

Every site that invokes the second opinion hard-codes a **read-only** sandbox:

- `claude/skills/fkit-review/SKILL.md:61`
- `claude/skills/fkit-adversarial-review/SKILL.md:46`
- `claude/skills/fkit-stateful-review/SKILL.md:95`
- `claude/agents/fkit-adversarial-reviewer.md:28` — **a fourth site**, not in the original finding;
  any change here must land on all four or the flag drifts between the skill and the agent.

each running:

```
codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md
```

`read-only` blocks all filesystem writes, and `mkdtemp` is a write. So the Codex reviewer **cannot
run the test suite, build a fixture, or execute a mutation** — and never could. This is fkit's own
prescribed flag, not a broken environment and not new. `test/prove-red.sh` opens its work dir with
`work="$(mktemp -d)"`, so fkit's own red-proof harness is among the things Codex cannot run.

This is a capability limit, not a bug. It is also not a total loss: on task `0265` the read-only
Codex pass **originated** findings R3, R5 and R6 — including R5, an ADR-040 breach where an
unreadable file resolved to a confidently *wrong* identity — all three independently verified
correct (`ai-agents/tasks/done/0265-.../review.md:89-90`). Static reasoning finds real defects.

### Finding 2 — the reporting defect, which is the more urgent half

The degradation contract is written for a **binary**: Codex ran, or *"Codex reviewer unavailable:
`<reason>`"* (`claude/skills/fkit-review/SKILL.md:67`,
`claude/skills/fkit-stateful-review/SKILL.md:97`). It has **no vocabulary for the actual, permanent
state** — Codex ran, read the diff, reasoned well, and *measured nothing*. The reviewer is then asked
to "end with a one-line coverage self-assessment" (`fkit-review/SKILL.md:51`) with only that binary to
express it in.

The consequence, across three reviews this sprint with the **same flag and the same capability** each
time:

| Task | Coverage claim | Reality |
|---|---|---|
| `0259` | *"Coverage is FULL — no reviewer skipped, no degradation"* (`review.md:11-12`) | Codex measured nothing |
| `0264` | *"coverage is **not** partial"* (`review.md:9-10`) — while the same ledger records at `:326-327` that *"Codex could not run the suite… All execution evidence in this ledger is mine"* | Self-contradictory in one file |
| `0265` | **PARTIAL**, loudly and correctly (`review.md:10-15`) | Accurate |

Identical inputs, three different claims. "FULL coverage" has been quietly meaning *both reviewers
read it*, never *both reviewers measured it*. A reader is entitled to think otherwise. **This defect
is real regardless of which sandbox mode is chosen**, which is why it is decided here separately.

### Finding 3 — what `workspace-write` actually permits (re-measured independently)

`codex exec` (codex-cli 0.145.0) accepts `read-only`, `workspace-write`, `danger-full-access`.
Re-verified this session in a throwaway git repo outside this repo — one run, macOS/BSD userland:

| Attempted write | Result |
|---|---|
| new file in the working dir | allowed, exit 0 |
| **overwrite a pre-existing file in the working dir** | **allowed, exit 0 — file content actually changed** |
| `mktemp -d` | succeeds → `/var/folders/…/T/tmp.ZHqt1CJkCU` |
| `/tmp/<file>` | allowed, exit 0 |
| `$HOME/<file>` | **denied**, exit 1 |
| spawn a subprocess | allowed |

Two results here are **new** and load-bearing, beyond the capability table that prompted this ADR:

1. **Pre-existing files can be overwritten, not merely created.** A probe file with known content was
   replaced. `workspace-write` is not "scratch space in the workspace" — it is write access to the
   working tree as it stands.
2. **`codex exec` refuses an untrusted, non-git directory** — *"Not inside a trusted directory and
   `--skip-git-repo-check` was not specified."* The first attempt failed on exactly this and only
   succeeded after `git init`. This constrains D2's implementation (below).

## Decision

**Two decisions. D1 stands on its own and does not depend on D2.**

### D1 — Name the guarantee, and forbid any report that overstates it *(architect's call)*

**What the second opinion guarantees today is *independent reasoning over the diff*, by a different
model family — and nothing about execution.** That is worth having, and ADR-009's model-diversity
purpose survives intact. What is not permitted is a report implying more.

1. **The coverage vocabulary gains a third state**, replacing the ran/unavailable binary. A review
   report must distinguish, at minimum:
   - **both reviewers measured** — both executed tests/mutations;
   - **reasoning-only second opinion** — Codex ran and reasoned; **all execution evidence is the
     Claude reviewer's**. This is the *normal, expected* state under the current sandbox, not a
     degradation event;
   - **Codex unavailable** — the existing loud `[claude-fallback — NOT model-diverse]` case.
2. **No review report may state or imply "FULL coverage" on the strength of a reasoning-only Codex
   pass.** While the sandbox is `read-only`, the reasoning-only state is *by construction* and must be
   stated in every report — never inferred by the reviewer per-run, never omitted because it is
   routine. **Once D2 ships this becomes a per-run determination:** the report claims *both reviewers
   measured* only on evidence in the Codex output that it actually executed something — never inferred
   from the sandbox flag permitting it (see §Consequences).
3. **This is a reporting-honesty rule, not a degradation flag.** It must not inherit the
   fallback banner's alarm tone: nothing is broken, and treating the normal case as a failure would
   train readers to ignore the banner that *does* signal failure.

### D2 — Sandbox mode: `workspace-write` in place, at the repo root *(owner's ruling — option 3)*

**Adopted: option 3.** All four call sites move from `--sandbox read-only` to
`--sandbox workspace-write`, keeping `--cd "$PWD"` at the repo root. Codex can then run `npm test`,
`mktemp`, fixtures and mutations directly against the working tree.

**The architect recommended option 2 (a disposable git copy) and recommended against option 3. The
owner ruled option 3 anyway, knowingly and provisionally.** The structural objection below is not
withdrawn and is preserved verbatim in §Options considered; it was argued, understood, overruled, and
accepted. Recording that sequence is the point of this entry.

#### Owner ruling — verbatim, live `AskUserQuestion`, `fkit lead` session, 2026-08-11

> "Let's not implement the separate git worktree approach, let it access to the root of the project. I
> will check how it works in fkit and in my other projects and if needed, will ask you to harden the
> rules in the future or to disable the write-access at all."

**Stated intent: provisional.** This is an experiment to be evaluated in fkit and in the owner's other
projects, with two named exits reserved — **harden the rules**, or **disable write access entirely**
(back to `read-only`, i.e. D1 alone). Nothing here treats option 3 as settled-forever; §"Re-raise only
if" is written to keep both exits genuinely open.

#### What "harden the rules later" can and cannot mean — corrected, and load-bearing for the owner's exit

The lead relayed to the owner that hardening later is *largely unavailable* — that no fkit hook can see
Codex's shell commands, so any later rule would be **prose in the Codex prompt, advisory and
ignorable**. **Half of that is right and half is wrong; the correction is recorded here because it
widens the owner's fallback.**

- **Correct, and unchanged:** no **Claude Code** hook can gate this. `claude/skill-ownership-hook.sh` is
  a Claude Code `PreToolUse` gate on the `Skill` tool; Codex's model-generated shell commands execute
  inside the codex process and never enter Claude Code's tool loop. ADR-018's mechanism is genuinely
  unavailable here. This remains the basis of the option-3 objection.
- **Wrong:** it does not follow that only prose remains. **Codex ships its own hook system**, verified
  this session in codex-cli 0.145.0: `~/.codex/hooks.json` is live on this machine (a `SessionStart`
  hook), `hooks = true` in `~/.codex/config.toml`, `codex --help` documents
  `--dangerously-bypass-hook-trust`, and the native binary contains the event vocabulary
  `preToolUse`, `permissionRequest`, `postToolUse`, `sessionStart`, `sessionEnd`, `userPromptSubmit`,
  `subagentStart`, `subagentStop`, `stop`, plus the symbols `allowPreToolUse`, `allowPostToolUse`,
  `allowManagedHooksOnly` and the string `project hooks`.
- **So the real hardening lever, if the owner later wants one, is a Codex-side `preToolUse` hook** —
  enforcement *inside* the process that runs the commands, which is the one layer that can see them.
  That would be structural, not advisory.
- **Not yet verified, and required before relying on it:** (a) that a codex `preToolUse` hook can
  actually **deny** a shell command rather than only observe it; (b) whether hooks can be scoped to a
  **project** or only to the user-global `~/.codex/`, which decides whether fkit can ship the
  protection or only document it; (c) that hooks fire under non-interactive `codex exec`; (d) how hook
  trust interacts with automation. **Do not treat Codex-side hooking as available until these four are
  measured.** Until then the honest statement is: a hardening lever plausibly exists and is worth
  measuring first — it is not confirmed to work.

#### The invariants this ruling gives up — stated plainly

- **ADR-022's one hard wall is no longer structural.** ADR-022 kept the adversarial reviewer restricted
  for exactly one reason: its lack of write access made *"the independent second opinion never touched
  the code it is judging"* a structural fact rather than a promise. Under this ruling that sentence
  becomes a **promise again**, held only by prompt instruction (`REVIEW ONLY`, the findings-only output
  contract, and *"Never edit any file"* at `claude/skills/fkit-review/SKILL.md:51`).
- **ADR-005's vault exclusivity is no longer structurally enforced against Codex during a review.**
  `ai-agents/wiki-vault/` sits under the repo root and is therefore inside the writable workspace. The
  rule stands; the structural guarantee behind it does not, for the duration of a review. *(Stated, per
  the driver's instruction, without further editorializing.)*
- **A violation would likely be invisible.** Nothing in fkit reports it: no hook sees the write, no test
  watches the tree during a review, and the review's own output would not mention it. Detection
  requires someone to **diff the working tree after a review** and notice. This is why the re-raise
  conditions below are written around *observation*, and why the absence of reported violations must
  not be read as evidence that none occurred.

#### Implementation notes for whoever builds this (not a licence to build it now)

- **All four call sites change together, or the flag drifts:**
  `claude/skills/fkit-review/SKILL.md:61` · `claude/skills/fkit-adversarial-review/SKILL.md:46` ·
  `claude/skills/fkit-stateful-review/SKILL.md:95` · `claude/agents/fkit-adversarial-reviewer.md:28`.
  A partial change leaves one review path on `read-only` and one on `workspace-write`, so the same
  review would report different coverage depending on which entry point ran it — the exact
  inconsistency D1 exists to eliminate.
- **`codex exec` requires a trusted git directory** (Finding 3); the repo root satisfies this, so the
  trust check that constrained option 2 is a non-issue here.
- **Option 2's path-translation problem disappears** — findings cite real repo paths directly. This is a
  genuine simplification, and the honest upside of the ruling.

## Options considered

- **Option 1 — keep `read-only`, fix only the vocabulary.** Adopted **as D1**, and correct on its own
  terms: it fixes the dishonesty, costs nothing, and changes no capability. Rejected **as the whole
  answer**, because it permanently accepts that the second opinion can never measure anything — a
  standing cap on what the adversarial pass can catch (it cannot red a test, prove a mutation, or
  reproduce a race).
- **Option 2 — `workspace-write` against a disposable copy. The architect's recommendation; NOT
  adopted — the owner ruled option 3.** It was the only option that adds execution capability without
  weakening the independence invariant, because the reviewer's writes cannot reach the reviewed tree —
  they die with the copy. **Costs that counted against it:** a copy per review, more wall-clock and
  tokens per review, path translation, and a real risk that a long-running Codex pass makes reviews
  slow enough to be skipped. The owner weighed these and declined the complexity.
- **Option 3 — `workspace-write` in place. ADOPTED BY OWNER RULING, over the architect's rejection.
  The rejection below is preserved as it was argued, deliberately not rewritten into an endorsement —
  a future reader must be able to see that the risk was identified, argued, overruled, and accepted
  knowingly. It was rejected on structural grounds rather than taste:**
  fkit passes `--cd "$PWD"` = repo root, so the workspace is the **entire repo**. Three compounding
  failures:
  1. **It breaks the one invariant ADR-022 deliberately kept a hard wall for.** ADR-022 relaxed tool
     allowlists for six roles and kept the adversarial reviewer restricted for exactly one stated
     reason: its lack of Write/Edit is what makes *"the independent second opinion never touched the
     code it is judging"* **a structural fact, not a promise**. Finding 3 proved `workspace-write`
     overwrites pre-existing files, so this hands the Codex reviewer — the *most* deliberately
     restricted actor in the system — write access to the source under review, via the shell, at the
     exact moment ADR-022's Bash-escape-hatch reasoning says a prompt rule will not hold it.
  2. **It breaches ADR-005.** `ai-agents/wiki-vault/` sits inside the repo root and would become
     writable by a non-wiki role.
  3. **Hook-level containment is not available — this was checked, and the answer is no.** ADR-018's
     skill-ownership hook is a Claude Code **`PreToolUse` hook on the `Skill` tool**
     (`claude/skill-ownership-hook.sh`). Codex's model-generated shell commands execute **inside the
     codex process**, never passing through Claude Code's tool loop, so no Claude Code hook can see or
     deny them. Containment would have to come from Codex's own sandbox, which is all-or-nothing over
     the `--cd` root; no verified mechanism makes a *subtree* of the workspace read-only. So option 3's
     containment would be **neither structural nor advisory — it would be absent.**
     - **Amended after the ruling, in the direction of the owner:** the *Claude-Code-side* half of this
       objection stands unchanged. But a **Codex-side `preToolUse` hook** was subsequently found to
       exist in codex-cli 0.145.0 and is a plausible future containment point — see D2's
       *"harden the rules later"* section, including the four things still unverified about it. This
       does not retract the objection (nothing is enforced today), but it does mean containment is
       *potentially recoverable* rather than permanently absent, as originally argued.
- **Option 4 — `danger-full-access`.** Not seriously considered; strictly worse than option 3 on every
  axis above.

## Consequences

- **Positive:** what "second opinion" means is written down and no longer varies by reviewer mood; a
  reader can tell reasoning from measurement; the three-way sprint inconsistency cannot recur; ADR-009's
  model-diversity purpose is preserved and explicitly *not* made decorative by either branch.
- **Positive, from D2 specifically:** the second opinion stops being reasoning-only — Codex can run the
  suite, build fixtures and execute mutations, so it can red a test or prove a regression rather than
  only argue for one. Findings cite real repo paths with no translation layer. Cheapest possible
  implementation: one flag value, four call sites, no new machinery.
- **Negative / costs, accepted knowingly by the ruling:** the adversarial reviewer gains write access
  to the tree it is judging, so ADR-022's independence invariant and ADR-005's vault exclusivity are
  held by prompt instruction alone for the duration of a review; a violation would be invisible absent
  a manual post-review diff; and the writable surface includes `ai-agents/` (task files, ledgers,
  sprint plans) as well as `claude/` and `test/`. Reviews also become slower and more expensive
  whenever Codex actually exercises its new ability to run things.
- **Consequence for D1's vocabulary once D2 ships:** *reasoning-only* stops being the constant,
  by-construction state and becomes a **per-run fact** — Codex may or may not have executed anything on
  any given review. D1's rule tightens rather than relaxes: a report may claim *both reviewers measured*
  **only** when the Codex pass actually ran something, evidenced in its output, never by assuming the
  new sandbox implies execution. **Implementing D2 without updating D1's reporting logic would recreate
  the original defect in mirror image** — claiming measurement that did not happen because the flag
  permitted it.
- **Consequence for two existing ledgers — noted, deliberately not acted on here.** `0259`'s
  *"Coverage is FULL"* (`review.md:11-12`) and `0264`'s *"coverage is **not** partial"*
  (`review.md:9-10`) were calibrated on the old binary vocabulary and **overstate what happened**;
  `0264` contradicts itself against its own `:326-327`. Under D1 both would read *reasoning-only*.
  **Per ADR-034 a ledger closes on the work product, so neither is edited here**; whether they are
  corrected is a follow-up for the producer to file (ADR-033) — **not filed by this ADR**, and this
  ADR does not decide it.
- **Residual risks / "re-raise only if":**
  - **D1** — re-raise only if the three-state vocabulary is shown to be insufficient in practice (a
    fourth genuinely distinct coverage state appears), or if the reasoning-only banner is shown to be
    dulling readers' attention to the `[claude-fallback]` failure banner.
  - **D2 — deliberately easy to re-raise. This is a provisional experiment, and the owner reserved two
    exits (harden, or disable write access). Re-raise on ANY of:**
    1. **Codex is observed writing to the reviewed tree** — any source file, `claude/`, or `test/` —
       during or after a review it did not have permission to modify.
    2. **Codex is observed writing to `ai-agents/wiki-vault/`** (ADR-005) — treat a single occurrence as
       sufficient; no pattern needs establishing.
    3. **Codex is observed writing to any task file, review ledger, or sprint plan** under
       `ai-agents/`.
    4. **The owner's evaluation in fkit or another project reports any unwanted modification**, on the
       ruling's own terms.
    5. Reviews become materially slower or costlier once Codex actually runs things, to the point of
       being skipped.
    ⚠️ **Conditions 1–3 depend on someone LOOKING.** Nothing structural will report them: no hook sees
    the write, no test watches the tree mid-review, and the review output will not mention it.
    Detection means diffing the working tree after a review. **Absence of reported violations is not
    evidence of none** — do not read a quiet period as validation. If a cheap check is wanted, a
    post-review `git status --short` compared against the reviewer's declared writes is the obvious
    one, and it is not built.
  - **The hardening exit** — before concluding that hardening is unavailable, measure the four
    unverified points about Codex-side `preToolUse` hooks listed in D2. The earlier claim that only
    prose remains is **not correct as stated** and should not be the basis for giving up the exit.
  - **The disable exit** — reverting D2 is a one-value change back to `read-only` across the four call
    sites. **D1 is unaffected by that revert** and must stay in force either way.
  - **The `--sandbox` flag must stay identical across all four sites**; re-raise if they ever diverge.

## Related

- [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) — Codex required, not optional; the
  source of the model-diversity guarantee this ADR bounds.
- [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md) — the adversarial reviewer as
  the one deliberately restricted role; the basis for rejecting option 3.
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  structural-enforcement precedent that was checked and found **not applicable** to Codex subprocesses.
- [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md) — wiki writes are the wiki role's
  alone; breached by option 3.
- [ADR-034](adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md) — why the
  `0259` / `0264` ledgers are not edited here.
- Call sites: `claude/skills/fkit-review/SKILL.md:51,61,67` ·
  `claude/skills/fkit-adversarial-review/SKILL.md:46` ·
  `claude/skills/fkit-stateful-review/SKILL.md:95,97` · `claude/agents/fkit-adversarial-reviewer.md:28`
- Evidence: `ai-agents/tasks/done/0259-.../review.md:11-12` ·
  `ai-agents/tasks/done/0264-.../review.md:9-10,326-327` ·
  `ai-agents/tasks/done/0265-.../review.md:10-15,89-90` · `test/prove-red.sh`, its `work="$(mktemp -d)"` opening

---

## Correction note — 2026-08-11: the site count is five under `claude/`, not four (and three more outside it)

**Owner ruling, live `AskUserQuestion`, `fkit lead` session, 2026-08-11** — append a correction note
recording that **five** sites state the sandbox flag, not four. **The accepted decision above is
unchanged**: D1, D2, and the §Options considered rejection of option 3 stand exactly as written. This
note corrects one factual enumeration and nothing else.

### What the body says, and what is actually true

The lines reading *"all four call sites"* / *"all four sites"* — **`:22-23`, `:115`, `:183`, `:246`,
`:292`, `:294`** — undercount. Verified this turn by an exhaustive `grep -rn -- '--sandbox'` over the
repo (excluding `.git`, `node_modules`):

**Under `claude/` — five sites, of two different kinds:**

| # | Site | Kind |
|---|---|---|
| 1 | `claude/skills/fkit-review/SKILL.md:61` | **executable call site** |
| 2 | `claude/skills/fkit-adversarial-review/SKILL.md:46` | **executable call site** |
| 3 | `claude/skills/fkit-stateful-review/SKILL.md:95` | **executable call site** |
| 4 | `claude/agents/fkit-adversarial-reviewer.md:28` | **executable call site** |
| 5 | `claude/README.md:116` | **documentation only** |

**The distinction matters and must not be flattened:**

- **Sites 1–4 are the drift risk.** They are instructions an agent follows, so a partial change leaves
  one review path on `read-only` and another on `workspace-write` — the same review reporting different
  coverage depending on entry point, which is the exact inconsistency D1 exists to eliminate. The
  body's warning at `:183` is correct as written; it simply names four of the five sites.
- **Site 5 is a doc-accuracy obligation, not a drift risk.** `claude/README.md:116` sits in a fenced
  `sh` block under `## The Codex adversarial pass` — **nothing executes it**. Verified on disk this
  turn (found by the producer, confirmed by the lead, re-confirmed here). Leaving it stale would mean
  the file that *explains* the Codex pass describes a state that no longer exists — and ADR-042's own
  re-raise conditions depend on people reading accurate docs about what the reviewer may do.

**Task `0273` already carries all five** —
`ai-agents/tasks/backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/`,
whose verification step 2 requires five `--sandbox` hits under `claude/`, all `workspace-write`, and
zero `read-only`. No further action is needed for sites 1–5.

### Three further sites, missed by the producer and the lead, and OUTSIDE `0273`'s scope

Reported plainly as the driver requested. **`ai-agents/knowledge-base/architecture.md` states the flag
three times:**

- **`:49`** — the Codex CLI row of the external-dependency table.
- **`:272`** — inside the **mermaid runtime diagram**: `R -->|Bash| X[["codex exec --sandbox read-only"]]`.
- **`:372`** — the narrative walkthrough of the review pass.

**`0273` will not fix these:** its scope and its verification grep are both confined to `claude/`. Once
D2 lands, the project's own architecture document will describe a sandbox mode fkit no longer uses, in
three places including a diagram — and `architecture.md` is what CLAUDE.md points every role to for
anything below product-brief altitude. **Same class as site 5: a doc-accuracy obligation, not a drift
risk.** Routing this is the producer's call (ADR-033) — **not filed here**, and this note does not
decide it. *(Incidental, noticed while verifying and not acted on: `:372` cites
`claude/skills/fkit-review/SKILL.md:38,57` for a line that is now `:61`, so that reference has already
drifted independently of this ADR.)*

### Sites deliberately NOT to be changed — recorded so nobody "fixes" them later

- **`test/fixtures/closed-rank-0174-before.md:1981` and `…-after.md:1987`** — frozen test fixtures;
  editing them changes what the suite asserts. `0273` already forbids touching them.
- **Historical ADRs** — `adr-008:49`, `adr-009:60`, `adr-016:73`. Each records what was true when
  written. Per house honest-numbering practice an accepted ADR is not retro-edited; **this note is
  itself the pattern** for how such a correction is made.
- **Dated reports** under `ai-agents/knowledge-base/reports/` and closed task ledgers — point-in-time
  snapshots.
- **`ai-agents/wiki-vault/`** — three pages state the flag. **Not touched by anyone but fkit-wiki**
  (ADR-005); they follow whenever this ADR is ingested.

**Net effect on the decision: none.** Only the enumeration was wrong. The `--sandbox` value must still
be identical across executable sites 1–4, and reverting D2 remains a one-value change across those
same four.
