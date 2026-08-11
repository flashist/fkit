# Move the Codex review sandbox from `read-only` to `workspace-write` — every call site at once

## ID
0273

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority — an owner ruling, given against the architect's recommendation

[**ADR-042**](../../../knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md),
status **accepted**, dated **2026-08-11** — **decision D2**. **Read the ADR in full before planning**,
including §"Options considered", which preserves the architect's rejection of this option as it was
argued.

**Owner ruling, verbatim, given live via `AskUserQuestion` in a `fkit lead` session, 2026-08-11:**

> *"Let's not implement the separate git worktree approach, let it access to the root of the project. I
> will check how it works in fkit and in my other projects and if needed, will ask you to harden the
> rules in the future or to disable the write-access at all."*

**The architect recommended option 2 (a disposable git copy) and recommended against this. The owner
ruled it anyway, knowingly and provisionally.** ⛔ **This brief does not re-litigate that.** The
structural objection is not withdrawn and lives in ADR-042; it was argued, understood, overruled, and
accepted. **Stated intent: provisional** — an experiment with two named exits reserved (*harden the
rules*, or *disable write access entirely*).

⚠️ **The ADR is untracked in git at the time of filing** — written in the session that produced it and
not yet committed. **Expected, not a defect.**

### ⚠️ THE HARD GATE — this task may not run before `0272`

`**Depends on:** 0272` below is **structural, not a preference.** ADR-042's Consequences:

> *"Implementing D2 without updating D1's reporting logic would recreate the original defect in mirror
> image — claiming measurement that did not happen because the flag permitted it."*

The whole point of ADR-042 is that reports stopped matching reality. Flipping this flag while the
report contract still says *ran / unavailable* replaces *"claims reasoning was measurement"* with
*"claims measurement because the sandbox allows it"* — the same lie, inverted. ⛔ **If `0272` has not
landed, stop and report. Do not proceed and do not fold `0272`'s work in here.**

### What the flag actually buys, and what it costs

`workspace-write` was re-measured independently in a throwaway repo (codex-cli 0.145.0, macOS/BSD,
ADR-042 Finding 3): new files allowed, `mktemp -d` succeeds, `/tmp` allowed, `$HOME` **denied**,
subprocesses allowed — and, load-bearing, **pre-existing files in the working dir can be overwritten,
verified with a probe file whose content actually changed.** `workspace-write` is **not** "scratch
space in the workspace"; it is write access to the working tree as it stands.

**Upside:** Codex can run `npm test`, build fixtures and execute mutations — it can red a test or prove
a regression rather than only argue for one. Findings cite real repo paths with no translation layer.

**⚠️ The invariants this gives up — accepted knowingly by the ruling, restated here so the implementer
does not rediscover them as news:**

- **ADR-022's one hard wall stops being structural.** ADR-022 kept the adversarial reviewer restricted
  for exactly one reason: its lack of write access made *"the independent second opinion never touched
  the code it is judging"* a **fact** rather than a promise. It becomes a promise again, held only by
  prompt instruction.
- **ADR-005's vault exclusivity stops being structurally enforced against Codex during a review.**
  `ai-agents/wiki-vault/` sits under the repo root and is therefore inside the writable workspace. The
  rule stands; the structural guarantee behind it does not, for the duration of a review.
- **A violation would likely be invisible.** No hook sees the write, no test watches the tree during a
  review, and the review's own output would not mention it. **Absence of reported violations is not
  evidence of none.**

⛔ **None of the above is this task's to fix.** They are recorded so the close does not imply they were
handled.

## What to build

One value change — `read-only` → `workspace-write` — **at every site that states it, in one change.**
`--cd "$PWD"` stays at the repo root, unchanged.

### The four call sites named by ADR-042 — verified on disk 2026-08-11

1. `claude/skills/fkit-review/SKILL.md:61`
2. `claude/skills/fkit-adversarial-review/SKILL.md:46`
3. `claude/skills/fkit-stateful-review/SKILL.md:95`
4. `claude/agents/fkit-adversarial-reviewer.md:28`

**A partial change is the failure mode ADR-042 names by name:** it leaves one review path on
`read-only` and one on `workspace-write`, so the same review reports different coverage depending on
which entry point ran it — *"the exact inconsistency D1 exists to eliminate."*

### ⚠️ SITES 5–8 — documentation. **WIDENED 2026-08-11 BY OWNER RULING from five sites to eight.**

**Owner ruling, live `AskUserQuestion`, `fkit lead` session, 2026-08-11 — the option label is the
verbatim text: "Widen 0273 to cover them".** Site 5 was found by the filing producer; **sites 6–8 were
found by the architect** on an exhaustive `grep -rn -- '--sandbox'` over the **whole repo** after
filing. **The real count is eight, not four and not five.**

5. **`claude/README.md:116`** — under `## The Codex adversarial pass`, the command printed verbatim as
   the documented behavior of the review.
6. **`ai-agents/knowledge-base/architecture.md:49`** — the **dependency table**'s Codex CLI row.
7. **`ai-agents/knowledge-base/architecture.md:272`** — **inside the mermaid runtime diagram**, as the
   node label `X[["codex exec --sandbox read-only"]]`. ⚠️ **Easy to miss in a text pass and easy to
   break** — it is diagram syntax, so check the diagram still renders after editing.
8. **`ai-agents/knowledge-base/architecture.md:372`** — the review-pass walkthrough (§*"4 — Review + the
   adversarial pass"*).

**⚠️ Keep the two classes distinct — they fail differently, and the close must report them
separately:**

- **Sites 1–4 are the DRIFT RISK.** They are **instructions an agent follows**. A partial change means
  the same review reports different coverage depending on which entry point ran it — the exact
  inconsistency D1 exists to eliminate, and ADR-042's *"the `--sandbox` flag must stay identical across
  all four sites; re-raise if they ever diverge."*
- **Sites 5–8 are DOC-ACCURACY obligations. No drift risk** — nothing executes them. But
  `architecture.md` is where `CLAUDE.md` sends **every role** for anything below product-brief
  altitude, so leaving it stale means the project's own architecture doc describes a sandbox fkit no
  longer uses, **in three places including a diagram**.

⚠️ **Report the site-count discrepancy in the close**: ADR-042 says *"all four"*. ⛔ **Do not edit
ADR-042 yourself** — an accepted ADR is the architect's document; surface it and let the producer
route it.

### ⛔ What must NOT be touched — the exclusion list, ruled by the architect

A repo-wide grep for `--sandbox` returns **far more than eight hits**. Everything below states the flag
and is **correct as written**, because it is a dated or frozen record of what was true when written.
⛔ **Change none of it**, and make the verification grep exclude it explicitly:

- **The two frozen test fixtures** — `test/fixtures/closed-rank-0174-before.md:1981` and
  `test/fixtures/closed-rank-0174-after.md:1987`. **Historical snapshots the suite compares against**;
  editing them changes what the tests assert.
- **Historical ADRs** — `adr-008:49`, `adr-009:60`, `adr-016:73`. Dated decisions. ⚠️ **ADR-042 itself
  also states both flag values, correctly and deliberately** — leave it alone (see above).
- **Dated reports** under `ai-agents/knowledge-base/reports/`.
- **Closed review ledgers, worklogs and briefs** under `ai-agents/tasks/done/`, and archived sprint
  plans under `ai-agents/sprints/done/`. ⚠️ These are exactly the records `0274` is separately, and
  narrowly, correcting — ⛔ **not this task's, in any form.**
- **The three `ai-agents/wiki-vault/` pages** — `wiki/systems/review-and-model-diversity.md`,
  `wiki/tasks/give-codex-the-universal-hard-rules.md`, `wiki/decisions/adr-016-…md`.
  ⛔ **`fkit-wiki`'s alone under [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md).
  They follow on ingest — NOT this task.** ⚠️ Name them in the close as a **known, deliberate
  residual** so the next reader does not mistake them for a missed site.
- **This brief and `0272`'s**, and the `backlog.md` rows quoting them.

### ⚠️ Two stale citations that sit ON lines this task already rewrites — fix them in passing

**Independent of ADR-042; already stale before 2026-08-11.** `architecture.md` cites
`claude/skills/fkit-review/SKILL.md:57` for the codex command at **site 6 (`:49`)** and
`claude/skills/fkit-review/SKILL.md:38,57` at **site 8 (`:372`)**. Measured 2026-08-11: the command is
at **`:61`**; `:57` is a bullet about settled tradeoffs and `:38` is a section heading.

**The rule for this task, and it is a bright line — not a judgement call per citation:**

> ✅ **Fix a stale citation only where it sits on a line this task is already rewriting.** Site 6 and
> site 8 qualify. **Nothing else does.**

⛔ **Do NOT sweep the citation cluster on `architecture.md:373-375`** — it is not on a `--sandbox` line,
this task has no reason to open it, and it is a **different defect class**. It has been surfaced to the
producer as a candidate for its own row and **deliberately not filed**. ⚠️ **One of its citations
(`fkit-review/SKILL.md:128-135`) was measured and is CORRECT** — a careless sweep would "fix" a right
citation, which is worse than leaving drift.

### ⚠️⚠️ DO NOT COPY THE LINE NUMBERS IN THIS BRIEF INTO `architecture.md`

**`0272` lands before this task** (`Depends on: 0272`) **and it edits `fkit-review/SKILL.md` and
`fkit-adversarial-review/SKILL.md` at exactly these anchors.** Every `:NNN` measured today will have
moved by the time this runs. ⛔ **Re-measure at implementation time.**

✅ **Better: write the durable form instead.** This project's own convention is that line numbers are
*"dated anchors of convenience"* and **the quoted text is the durable anchor**. Cite the file plus a
short verbatim quote, so the next change to the review contract does not re-stale it. That turns a
recurring drift into a one-time fix, and it is the point of doing this at all.

### Constraints

- ⛔ **No change to `--cd "$PWD"`.** The workspace is the repo root — that is what the owner ruled.
- ⛔ **`danger-full-access` is not an option** (ADR-042 option 4, rejected as strictly worse).
- ⛔ **Do not build a disposable git copy.** That is option 2, and the owner declined it by name.
- ⛔ **Do not build containment of any kind** — no Codex hooks, no wrapper, no allowlist, no
  post-review guard. ADR-042 records four **unverified** questions about Codex's own hook system, and
  answering them requires touching the owner's global `~/.codex/hooks.json`, which **has not been
  authorized.** ⛔ **Do not touch `~/.codex/` at all.**
- ⛔ **Do not weaken the reviewer's `REVIEW ONLY` prompt instructions** — after this change they are the
  *only* thing holding the independence invariant. If anything, they get louder; if the plan wants to
  strengthen them, say so and get it approved rather than doing it silently.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit. ⛔ No new devDependency (ADR-014).
- ⚠️ **Edit the canonical sources in `claude/` only** — `.claude/` copies are gitignored and refreshed
  on launch.

## Verification steps

1. **`0272` has landed.** Quote the landed per-run coverage rule. ⛔ If it has not, **stop** — do not
   proceed.
2. **All eight sites read `workspace-write` — proved by a REPO-WIDE grep, not a `claude/`-only one.**
   ⚠️ **A grep confined to `claude/` is what let sites 6–8 be missed in the first place** — it cannot
   see `ai-agents/knowledge-base/architecture.md` at all.
   - Run `grep -rn -- '--sandbox'` over the **whole repo** (excluding `.git/`, `node_modules/`,
     `.claude/`).
   - **Account for every hit**, in two columns: **changed** (the eight) and **deliberately excluded**
     (each with which exclusion-list entry covers it). ⛔ An unaccounted hit means the inventory is
     wrong — **stop and report** rather than editing it.
   - Show **zero** `--sandbox read-only` remaining at any of the eight, and `git diff` **empty** on
     both frozen fixtures, on every ADR including ADR-042, on `ai-agents/tasks/done/`, on
     `ai-agents/sprints/done/`, and on `ai-agents/wiki-vault/`.
   - **Name the three `wiki-vault/` pages explicitly as a known residual** left for `fkit-wiki`
     (ADR-005), so the close does not read as an oversight.
   ✅ **The close may then honestly claim ALL SITES** — which, scoped to `claude/`, it could not.
3. **Site 7's diagram still renders.** It is a mermaid node label, not prose. Confirm the diagram
   parses after the edit and say how you checked.
4. **The two in-passing citation fixes are correct and separately reported.** Show the corrected
   citations at `architecture.md:49` and `:372`, **re-measured against the post-`0272` tree** rather
   than copied from this brief. ⛔ Confirm `:373-375` was **not** touched. ⚠️ **List these two fixes
   separately from the eight flag changes in the close** — they are not part of D2, and a later
   *disable exit* revert must be able to tell which half is which.
5. **Codex can now actually execute something.** Run one real review through a changed path over a
   small scope and show, from the Codex output itself, that it ran a command — ideally `npm test` or a
   `mktemp -d`. ⚠️ **If Codex does not choose to run anything, that is a valid outcome and must be
   reported as such** — the flag permits execution, it does not compel it, and this is precisely the
   distinction `0272`'s rule exists to preserve.
6. **`0272`'s rule is exercised for real, in both directions.** From the same review:
   - if the Codex output shows execution, the report may read **both reviewers measured** — quote the
     evidence it cited;
   - if it does not, the report **must** still read **reasoning-only**. ⛔ **A report claiming
     measurement on the strength of the flag alone is this task shipping the defect it was gated to
     prevent** — stop and report.
7. **⚠️ Diff the working tree after that review and account for every change.** Run
   `git status --short` and compare it against the reviewer's declared writes. ADR-042 names this as
   the obvious cheap check and records that **it is not built**. Do this **once, by hand, for this
   task's own verification**, paste the output, and state plainly in the worklog that it is a one-off
   check and **not** a standing control. ⛔ Do not scope building the standing control here.
8. **The `Codex unavailable` fallback still fires.** Force the failure branch and show the loud
   `[claude-fallback — NOT model-diverse]` banner and the `🟡 Partial review` verdict both intact.
9. **Full `npm test` green.** State the measured counts.
10. **Report the measured cost.** ADR-042 re-raise condition 5 is *"reviews become materially slower or
   costlier once Codex actually runs things, to the point of being skipped."* Record the wall-clock
   time of the review in step 3 against a comparable earlier review. This is data the owner's
   evaluation needs.

## Notes

- **Depends on:** `0272`
- **Blocks:** nothing
- ⚠️ **THIS IS A PROVISIONAL EXPERIMENT WITH TWO NAMED EXITS, and the close must say so.** The owner
  reserved *harden the rules* and *disable write access entirely*. **The disable exit is a one-value
  change back to `read-only` across these **eight** sites, and `0272` is unaffected by it** — keep this
  task's diff small and single-purpose so that revert stays a one-line-per-site act. ⛔ Do not fold
  unrelated cleanup into it. ⚠️ **The two in-passing citation fixes are the ONE sanctioned exception**,
  and verification step 4 requires them listed separately precisely so the revert can tell them apart.
- ⚠️ **The hardening exit is NOT available today and must not be described as if it were.** ADR-042
  corrects an earlier claim that only advisory prose remains: **Codex ships its own hook system**
  (`~/.codex/hooks.json` is live on this machine; codex-cli 0.145.0 documents
  `--dangerously-bypass-hook-trust` and carries the `preToolUse` event vocabulary), so a Codex-side
  `preToolUse` hook is a **plausible** future containment point. **Four things are unverified**: that
  such a hook can *deny* rather than only observe; whether hooks can be scoped to a project or only
  user-globally; that they fire under non-interactive `codex exec`; and how hook trust behaves in
  automation. ⛔ **Do not treat Codex-side hooking as available, and do not scope measuring it here** —
  measuring it means touching the owner's global config, which is unauthorized.
- ⚠️ **Watch for a re-raise, and report one immediately if seen.** ADR-042 lists five conditions;
  conditions 1–3 (Codex writing to the reviewed tree, to `ai-agents/wiki-vault/`, or to any task file,
  ledger or sprint plan) **depend on someone LOOKING** — nothing structural reports them.
  **Verification step 7** is the only look this task takes.
- ⚠️ **WIDENED 2026-08-11 BY OWNER RULING — from five sites to EIGHT.** Verbatim option label:
  **"Widen 0273 to cover them"**, live `AskUserQuestion` in a `fkit lead` session. Sites **6–8**
  (`architecture.md:49`, `:272`, `:372`) were found by the **architect** on an exhaustive repo-wide
  grep after this brief was filed; the brief as filed was confined to `claude/` and would have landed
  D2 while leaving the project's own architecture doc describing a sandbox fkit no longer uses.
  **What changed in this brief:** the site list (five → eight, with the drift-risk / doc-accuracy split
  made explicit); the exclusion list, now enumerated; **verification step 2, which greps the WHOLE REPO
  instead of `claude/` only** and must account for every hit; new steps 3 (the mermaid diagram renders)
  and 4 (the citation fixes, separately reported); and the two in-passing citation corrections.
  ⚠️ **Two internal pointers in the bullets above were corrected in place rather than by appended
  note** — *"these five sites"* → *"these eight sites"*, and *"Step 5 above"* → *"Verification step 7"*,
  both stale only because this same-day brief's own numbering moved. **Recorded here rather than done
  silently.** ⛔ **Placement and `Depends on: 0272` are UNCHANGED** — the owner's ruling that this stays
  on the Backlog until after the release cut still stands.
- ⚠️ **A citation-drift cluster at `architecture.md:373-375` was found and DELIBERATELY NOT FILED** —
  surfaced to the producer's driver instead, per instruction. Measured 2026-08-11: the paragraph cites
  `fkit-adversarial-review/SKILL.md:57,111` for what are now `:61-64` and `:114-115` — **and it cites
  `fkit-review/SKILL.md:128-135`, which is CORRECT and must not be "fixed."** It is a different defect
  class, it is not on a `--sandbox` line, and a careless sweep would break a right citation. ⛔ **Out of
  this task**, and it wants its own row or an owner ruling that it is not worth one.
- **On merit:** this belongs on the **Backlog**, and — unlike
  [`0272`](../0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md) —
  that is a merit judgement, not just a mechanical one:
  - **It should not land inside Sprint 5.** Sprint 5's stated theme is *"Fix what a real project found,
    and make a release safe to cut."* Landing this mid-sprint makes the reviews that validate that
    release the **first field trial** of a knowingly-provisional change that gives the adversarial
    reviewer write access to the tree it is judging. The experiment and the release would then
    confound each other: a problem found in either becomes hard to attribute — which is the same
    ambiguity Sprint 5's own banner already flags about building on an unverified Sprint 4.
  - **Nothing waits on it.** No Sprint 5 row needs Codex to execute anything. `0272` alone fixes the
    honesty defect; this only adds capability.
  - **Recommended: after the release cut**, so the owner's evaluation runs on a clean baseline and the
    *disable* exit stays cheap. **If the owner wants it in Sprint 5, pulling it in is a three-edit
    producer act, not a re-file** — but the ordering `0272` → `0273` must survive the pull.
- **Line-number citations are dated anchors of convenience** (measured 2026-08-11); the durable anchors
  are the quoted text.
- Filed 2026-08-11 by a spawned `fkit-producer` with no owner channel, on ADR-042 D2. It asked nothing,
  decided nothing beyond the split and the board placement, and committed nothing.
