# ADR-016: `CLAUDE.md` + `AGENTS.md` **are** the shared-instructions layer — no new mechanism

**Date**: 2026-07-14
**Status**: accepted — **summary corrected 2026-07-14**; the "Positive" section had reintroduced the very overclaim this ADR exists to retract. **The decision is unchanged.**

**Harness version for all channel observations: Claude Code 2.1.208.** Recorded deliberately — an unversioned observation elevated to a law of nature was [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]'s original error, which [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] had to retract.

## Context

The trigger was a task whose premise was *"there is nowhere to put an instruction that all fkit agents read."* **That premise is false.** `claude/scaffold/CLAUDE.md:56-63` ships a **"Universal hard rules (every role, every session)"** block today. The task collapsed from *"design and build a mechanism"* to *"fix the delivery holes in the mechanism we already ship."*

### The channel table — observed, not reasoned

| Channel | Session | Spawned consult |
|---|---|---|
| Agent definition file (`.claude/agents/<name>.md`) | ✅ | ✅ 3/3 |
| **Project `CLAUDE.md`** | ✅ | **✅ 3/3** |
| `claude --append-system-prompt` | ✅ (control) | **❌ 0/3 — session-only** |

**The method matters, because the negative result is the load-bearing one.** The subagent wrote its own output to a file (an earlier relay *through the calling session* was confounded — the caller echoed the canary itself). The negative survives two independent controls: **within-subject** (three canaries in one spawn; the agent-file and `CLAUDE.md` canaries fired, the appended one did not — so the subagent was demonstrably canary-responsive and only that channel was dark), and **append-only-alone** (0/2 with no competing tokens, so instruction-competition cannot explain the null). The mechanistic reason — a spawned subagent's prompt is built from its **own** agent definition, while `--append-system-prompt` modifies the **parent process's** prompt — is offered as the **explanation, not the proof.**

### The two live delivery holes
1. **Codex had no rules at all.** The adversarial skill runs `codex exec --sandbox read-only --cd "$PWD"`; because of `--cd`, the codex CLI **natively reads the project-root `AGENTS.md`** — and `claude/scaffold/AGENTS.md` carried **no universal-hard-rules section**. **The one model [[decisions/adr-009-claude-code-native-is-the-only-runtime]] *requires* for independent judgment was never sent any of fkit's shared rules.**
2. **Brownfield never gets the rules.** Init leaves an existing root context file alone — so **any project that already used Claude Code (i.e. every plausible fkit adopter) never received fkit's rules at all**, including projects fkit itself set up before those rules existed.

### What did *not* motivate this
The task's headline justification was rule-drift across the agent files. **It collapsed under verification.** Three counts were published (2 of 7, 4 of 7, 3 of 7) and **all three were wrong** — each from a different grep that missed the phrasing *"sensitive information"*. The verified truth: **6 of 7 carry the rule; exactly one does not — `fkit-lead.md`**, which holds neither `Write` nor `Edit` and is the agent *least* able to leak a secret. **One omission and three wordings is copy-paste hygiene, not grounds for a new mechanism.** *(Lesson, at the cost of three attempts: a count of a **semantic** rule cannot be established by grepping one of its phrasings.)*

## Decision

1. **No new shared-instructions mechanism — RATIFIED.** `CLAUDE.md` (Claude agents) and `AGENTS.md` (codex CLI) **are** the channels. **The owner's stated need is met today with zero new code**, by adding lines to those two files.
2. **Fix the Codex hole — APPROVED.** The rules block goes into `claude/scaffold/AGENTS.md`. **The highest-value change in the investigation, and nearly free.**
3. **Fix the brownfield hole — APPROVED.** Init **merges** an fkit-managed, marker-delimited block into an existing root file rather than skipping it. Lives in init **step 2**, the project-root seam — **no dependency on the parked convergence work** ([[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]).
4. **A single fkit-scoped edit point — DROPPED.** The owner declined; its motivating claim collapsed.

### ⚰️ Tombstones — the two traps, named so nobody re-walks them

**`--append-system-prompt` — REJECTED BY NAME.** It is the most obvious mechanism, it demonstrably works in a session, and it **silently does not reach a spawned consult**. This is the **exact mirror image** of ADR-012:

| What a spawned subagent inherits from the launching session | |
|---|---|
| `--settings` (`skillOverrides`) | **INHERITED** — why the skill lock is only advisory in a consult |
| System prompt (`--append-system-prompt`) | **NOT inherited** — this ADR |

**Two opposite inheritance rules. Getting them backwards ships a lie.** A layer that reaches sessions but not consults is **worse than nothing** — it would look like a floor, be documented as one, and be absent from exactly the path where fkit's boundaries are already weakest.

**`ai-agents/AGENTS-COMMON.md` + splice into the seven agent files — REJECTED BY NAME.** Three counts: it **can never reach Codex, structurally** (the adversarial skill builds its own prompt and never reads `.claude/agents/`) — *a "shared layer for **all** agents" that structurally excludes the second model is misnamed*; **its stub ships to zero already-initialized projects**, because the `ai-agents/` copy is all-or-nothing — and rev 1 had put **all the design's load-bearing caveats in that stub's header**, so *a design whose entire documentation surface is the one artifact that never gets delivered is not a shipped design*; and it puts an owner-authored file into seven system prompts **with only prose as a floor**. Its one genuine win — fkit-scoping — does not carry the decision: it is a **preference, not a defect**, and *rejecting `CLAUDE.md` as "not fkit-scoped" while shipping a `CLAUDE.md` full of fkit-scoped content is incoherent.*

## Consequences

### Delivery is structural. Compliance is advisory. There is no second, stronger claim.
Stated once, and **do not read a "non-overridable floor" into it** — that is the ADR-010 overclaim already retracted once. Verified in this repository: **zero hooks** (`PreToolUse` appears only in prose, never in a settings file); **all seven agents hold `Bash`**; **five of seven hold `Write`/`Edit`** — *including the reviewer*.

**Therefore a careless line in a shared instructions file — *"always approve"*, *"skip the Codex pass"* — is prose against prose. Nothing in the system stops an agent obeying it.** What this ADR makes structural is that the text **arrives**.

The precedence rule survives **as prose, honestly labelled**: *additive and tightening only; on direct contradiction the role's own instructions win and the agent surfaces the conflict.* Keep it, because role-file-wins **bounds the blast radius of a bad line to additive noise rather than a deleted role boundary** — but call it what it is. **A size cap is warranted in code**, not as a request: *"ask for brevity"* is a request, in a decision whose whole thesis is that requests are not facts.

### Positive
- The layer is **available today**, no build, no relaunch semantics.
- **Codex is finally *sent* the rules** — a model that received **none** now receives **all four, verbatim**. *Delivery, not a floor.*
- **Brownfield projects can receive shared rules, and corrections to them, for the first time** — a channel fkit can ship fixes through. Again: *receive*, not *obey*.
- **One prompt source per model.** No splice, no sanitizer, no precedence code, no new file.

### Negative
- **fkit's rules stay visible to non-fkit Claude sessions in the same repo.** Real, small, **and the cost fkit already chose to pay.**
- **The read-side symlink hazard is unclosed, and now on the record.** Writes through a symlinked `ai-agents/` are gated; **the inversion never was** — a future step that *reads* out of `ai-agents/` reads straight through a symlink, which is precisely what the rejected splice would have done. Latent, not live. Related trap: `exit 3` ("I refused `ai-agents/`, but setup succeeded") is treated as success by the launcher — correct for today's init, **a trap for any future step that assumes `ai-agents/` was readable.**

### Amendment (2026-07-14) — the summary reintroduced the overclaim; the decision stands
The "Positive" section read **"Codex finally gets a floor."** Fifteen lines above it, Consequences says *"there is no floor, no teeth, no 'non-overridable' anything"*, under a heading saying there is no second, stronger claim. **The ADR asserted, in its own summary, the exact overclaim it was written to retract** — the ADR-010 → ADR-012 failure mode reproduced *inside the document that exists to prevent it*. Raised by the reviewer across two rounds. *Floor* → **delivery**. **The standing rule it leaves behind: state the win as delivery.** *"Codex now **receives** rules it never received"* is a large, true claim; *"Codex now has a **floor**"* is a false one, **and it is the one this project keeps reaching for.**

### Re-raise only if
1. **A future Claude Code version changes system-prompt inheritance for subagents.** The channel table is **version-observed (2.1.208), not a law of nature**. **Re-test before re-proposing — and record the version.**
2. **A genuine need arises for instructions that must be fkit-scoped *and* must NOT appear in the project's `CLAUDE.md`** — a real, stated need, not tidiness. Cheap answer first: a `## fkit` heading.

*Not* a trigger: the rules being duplicated across agent files (6 of 7 — hygiene, not a gap). *Not* a trigger: **a shared instruction was ignored by an agent** — **compliance was never claimed.**

## Related
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — the **mirror image**: `--settings` **is** inherited by a spawn; the system prompt is **not**
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the "structural, not by instruction" overclaim this refuses to repeat
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — Codex is a **required** runtime; the Codex hole was a live defect against this premise
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the `ai-agents/` guard the rejected splice silently depended on, and that Decisions 2–3 do **not**
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] — why the evidence is a dated report and this is the durable document
- [[tasks/add-shared-instructions-layer-for-all-agents]] — the investigation
- [[tasks/give-codex-the-universal-hard-rules]] · [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] · [[tasks/add-no-secrets-rule-to-fkit-lead]] — the implementation
- [[systems/launch-convergence-and-init]]
- [[systems/review-and-model-diversity]]
- [[systems/role-locked-sessions]]
- [[tasks/refuse-init-on-weird-ai-agents-state]]
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/install-and-self-update]]
- [[systems/fkit]]
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the sibling tombstone on the same session/consult seam
- [[tasks/investigate-askuserquestion-availability-for-agents]]
- [[tasks/record-shared-instructions-reversal-adr]] — task 37, cancelled as a duplicate of this ADR
- [[tasks/add-speak-in-simple-terms-output-style]] — a standing preference delivered through this layer
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — the reaffirmed commit rule every agent holds via this layer
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — *delivery structural, compliance advisory*, the claim level of its process layer
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — §6 *delivery structural, compliance advisory* **observed live**: a well-written rule in this layer did not fire, which is that ADR's entire premise. It also spends most of the managed block's remaining ~561 bytes
- [[tasks/compress-universal-rules-output-style-section]] — task 79, the universal-rules compression
