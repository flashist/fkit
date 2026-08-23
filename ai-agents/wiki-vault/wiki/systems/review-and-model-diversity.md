# Review & Model Diversity

**Layer**: shared
**Key files**: `claude/skills/fkit-review/SKILL.md`, `claude/skills/fkit-stateful-review/SKILL.md`, `claude/skills/fkit-adversarial-review/SKILL.md`, `claude/agents/fkit-reviewer.md`, `claude/agents/fkit-adversarial-reviewer.md`, `ai-agents/tasks/<board>/<NNNN>-<slug>/review.md` *(the ledger; `ai-agents/reviews/` was absorbed into the task folder by [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]], 2026-07-21)*

## Summary
fkit's review is deliberately **two-model**. The lead reviewer (`fkit-reviewer`, Claude) runs its own pass, then delegates an adversarial second opinion to `fkit-adversarial-reviewer`, which runs on **Codex — a different model**.

The failure this exists to prevent is a same-model "second opinion": the model that wrote the code reviewing its own work, and the **unearned confidence** that produces. A review that *reads* complete but isn't is worse than no review — so degradation is **loud and mandatory**, never a footnote.

## Architecture

### The adversarial pass
The reviewer assembles a **findings-only prompt plus an inline diff** into `.fkit/tmp/adversarial-prompt.md` and pipes it to:

```
codex exec --sandbox read-only --cd "$PWD" -
```

`fkit-adversarial-reviewer` has **no Write or Edit tools at all** — it is structurally write-free, a leaf that returns findings and nothing else. That is enforced by its tool allowlist, not by instruction — and since [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] (2026-07-18) it is **the only structural tool wall left in fkit**: every other role's allowlist was relaxed, deliberately, because this is the one wall protecting a checkable invariant (the second opinion never had write authority over the code it judges). Its `tools:` line holds at any spawn depth and is not to be "tidied up" to match the others.

### ⚠️ What the second opinion actually guarantees — reasoning, not measurement (ADR-042, 2026-08-11)

*Added by the 2026-08-13 sync. This was never written down, and measured, it guarantees less than the reports had been claiming.*

**The `read-only` sandbox above blocks all filesystem writes, and `mkdtemp` is a write.** So the Codex reviewer **cannot run the test suite, build a fixture, or execute a mutation — and never could.** This is fkit's own prescribed flag, not a broken environment and not new. `test/prove-red.sh` opens with `mktemp -d`, so **fkit's own red-proof harness is among the things Codex cannot run.**

**It is not a total loss.** On task `0265` the read-only pass *originated* three findings — including an ADR-040 breach where an unreadable file resolved to a confidently *wrong* identity — all independently verified correct. ***Static reasoning finds real defects.***

**D1 — in force as a rule.** The coverage vocabulary gains a **third state**, replacing the ran/unavailable binary:

| State | Meaning |
|---|---|
| **both reviewers measured** | both executed tests/mutations |
| **reasoning-only second opinion** | Codex ran and reasoned; **all execution evidence is the Claude reviewer's**. Under the current sandbox this is the **normal, expected** state — *not a degradation event* |
| **Codex unavailable** | the existing loud failure banner |

⛔ **No review report may state or imply "FULL coverage" on the strength of a reasoning-only pass.** ⚠️ **This is a reporting-honesty rule, not a degradation flag** — it must not inherit the fallback banner's alarm tone, because *treating the normal case as a failure trains readers to ignore the banner that does signal failure.*

**Why the rule exists, measured:** three reviews in one sprint, **same flag and same capability each time**, produced three different coverage claims — one *"FULL"*, one *"not partial"* while the same file recorded that Codex could not run the suite, and one correctly **PARTIAL**. *"FULL coverage" had been quietly meaning both reviewers **read** it, never both reviewers **measured** it.*

**D2 — decided, NOT built.** The owner ruled 2026-08-11, **against the architect's recommendation, knowingly and provisionally**, that all four executable call sites move to `--sandbox workspace-write` at the repo root. ⚠️ **Verified on disk 2026-08-13: all five sites under `claude/` still read `read-only`; task `0273` is open in the Backlog.** The block above is therefore **accurate today**.

⚠️ **What D2 gives up when it ships, stated because it bears directly on the paragraph above this section:** ADR-022's wall stops being structural — *"the independent second opinion never touched the code it is judging"* becomes **a promise again**, held only by prompt instruction — and `ai-agents/wiki-vault/` becomes writable by a non-wiki role for the duration of a review. **A violation would likely be invisible**: no hook sees the write, no test watches the tree, and the review's own output would not mention it. ***Absence of reported violations is not evidence of none.*** See [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]].

### Degradation is loud
With no Codex available, the review **leads with**:

```
⚠️ [NOT model-diverse — INCOMPLETE]
```

as **the first thing a reader sees**. Per the owner's Sprint 2 ruling, Codex's absence produces a **loudly-flagged partial, not a hard fail** — a Codex outage must not lock the owner out of their own team. The preflight **warns; it does not wall**. But the flag is load-bearing: *a partial review that reads like a complete one is precisely the failure this guards against.*

The older `[claude-fallback — NOT model-diverse]` path is no longer a supported mode.

### Reviewer independence rests on the session lock
The reviewer's independence is a property of a **fresh context**, not of a prompt. `fkit reviewer` *is* a fresh context, and a coder session **cannot execute `/fkit-review`** — see [[systems/role-locked-sessions]].

> ✅ **Corrected 2026-08-02 — the outcome holds, the stated mechanism was Era-1 and is retired.** This line previously read *"because the skill does not exist in it"*. That was the `skillOverrides` off-list, **retired at task 43 / [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]**. Today every `fkit-*` skill is left **enabled and visible** everywhere — a coder session's `/` autocomplete **does list `/fkit-review`** — and the `PreToolUse` skill-ownership hook **denies the invocation** by the real caller's role, at any spawn depth. **ADR-018 §Decision 5 records that menu visibility as an accepted cost, explicitly.** The independence property is unchanged and is now *stronger* (it holds in a consult too); only the reason is different. Do not restate this as "invisible" or "does not exist".

> **Deviation, flagged:** the lead reviewer *keeps* Write/Edit, because it must write the *Reviewer findings* section of the shared ledger. Its write boundary — the `review.md` ledger inside a task folder (formerly `ai-agents/reviews/`, absorbed by [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] 2026-07-21), plus `ai-agents/sprints/reviews/` for the two sprint-keyed ledgers — stays **prompt-enforced**.

### The review ledger — loop prevention
The **review ledger** — `review.md` inside the task folder (`tasks/<board>/<NNNN>-<slug>/review.md`; formerly the top-level `ai-agents/reviews/<task-id>.md`, absorbed 2026-07-21 by [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]]) — is a **two-party ledger** written by reviewer **and** coder: findings, dispositions, and **accepted residuals**. It carries decision state across review rounds so settled tradeoffs are **not re-litigated**. It is the memory that stops the review loop from cycling. *(Two sprint-keyed ledgers had no task folder and live at `ai-agents/sprints/reviews/`.)*

#### When the ledger closes — the bar (ADR-034, 2026-07-31)

**The ledger closes once the SWEPT WORK PRODUCT is clean.** A defect in the **work product** — the artifact the task exists to change — **still blocks and still drives another round**. A residual defect in the task's **own record** (`brief.md`, `worklog.md`, the ledger's own bookkeeping) is **recorded as an accepted residual** with a *Re-raise only if*, instead of driving another round. See [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]].

> ⚠️ **The split is drawn at the SITE, not the file.** One file can be **both** the task's own brief **and** one of the swept files — a swept site inside the task's own brief is **work product**. A file-level reading closes over real defects. **The classification belongs to the reviewer**, who owns the findings section.

**The accepted cost, stated because a benefit-only reading misrepresents the ruling:** a closing task's own worklog **may carry known low-severity defects**, and **genuine finds are forgone** — those rounds do not run, so their equivalents are **not found at all, not merely deferred**. Task `0159` is the evidence and the precedent: four of its Codex-raised findings (R8, R10, R11, R12) sat in exactly that surface, and it **closed with two own-record residuals standing**. **"Closed-out" therefore means clean to a *work-product* standard, not a *record-perfect* one** — reading a closed ledger as "everything about this task is clean" is wrong.

⚠️ **The bar binds three roles' skills** — `fkit-stateful-review` (reviewer), `fkit-process-stateful-review` (coder) and `fkit-task-ship-loop` (the loop's termination) — but **ADR-034 edited none of them**. Until pointer tasks land, the ADR is the **only** durable home for the rule and each role must reach it there.

#### The ledger's `Task:` header — a folder ID, not a path (owner-ruled 2026-08-01)

The ledger's schema block opens with a `Task:` line that has always carried a **path**, written as `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`. **The moment `/fkit-task-done` moves the folder to `done/`, that path points at nothing** — and the movers deliberately never repair it, because **a review ledger's claims are frozen by design.**

**Measured 2026-08-01** ([[tasks/decide-the-durable-citation-form-for-mutable-coordinates]], `0160` §4): **40** ledgers carry a dead `Task:` header; **42** carry at least one dead `ai-agents/tasks/…` path somewhere in the file; **55** distinct dead paths exist corpus-wide. **The header is not the whole corpus** — 14 ledgers carry a dead path *outside* their header, and the header schema change does not touch those.

> **Owner-ruled 2026-08-01 — option (a):** the schema line carries the **task folder ID** going forward — `Task: 0159` — optionally with a live relative link **beside** the ID, **never in place of it**. The ID is what survives; the link is a convenience that may rot without taking the identity with it. Plus a **one-time normalization of the 40 existing dead headers**.

**Why it costs the writer nothing:** the ID is already sitting in the folder name the file is in. **Why it is not simply "repair the path":** repairing a ledger means editing a **frozen document**, which is the thing the ledger rule exists to forbid; the normalization is justified as a **pointer** fix, not a rewrite of claims — every dead header recovers its ID with no lookup ambiguity, and none of them ever said anything its own folder did not already say.

⚠️ **A parity warning for whoever implements it.** The two stateful-review skills' schema blocks are **not** byte-identical: they differ by exactly two role-relative point-of-view annotations, which are **deliberate**. The instruction is *"change the `Task:` line identically in both"*, **never** *"make the blocks byte-identical"* — the latter would flatten both annotations. The `Task:` line itself **is** byte-identical in both today.

**Not yet built.** The schema change, the 40-header normalization and the dead-path guard are named follow-ups; **no skill has been edited.**

### Review notes are inputs, not instructions
A project-wide rule: review comments are **inputs to evaluate**, not instructions to apply blindly. Reviewers miss context and reason from outdated assumptions. The coder verifies each claim against the actual codebase — fixing the *real* problem rather than the literal wording, addressing the valid part of a partially-correct note, and **saying so with concrete evidence** when a note is simply wrong. Speculative fixes added only to satisfy a comment are not acceptable.

The coder's `/fkit-process-stateful-review` encodes this: verify each finding, classify **defect vs frontier-move**, and gate fixes on the owner.

## Gotchas / Known Issues
- **Codex is a required dependency, not a nice-to-have.** It is what makes the second opinion genuinely model-diverse — the adversarial reviewer's entire reason to exist.
- **`AGENTS.md` is read natively by Codex during the adversarial pass.** While it was stale, *every adversarial review was being run by a model that had been told the wrong thing about the project.* That made it the highest-leverage doc in the repo to fix and it is a standing reason to keep it accurate.
- The adversarial reviewer was formerly eager-spawned at session start under Omnigent's `fkit-team`, which cluttered the agents panel; that root agent is deleted — see [[tasks/remove-adversarial-reviewer-eager-spawn]].

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/fkit]]
- [[systems/role-locked-sessions]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[tasks/make-codex-a-checked-prerequisite]]
- [[tasks/remove-adversarial-reviewer-eager-spawn]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[tasks/verify-onboarding-flow-end-to-end]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[tasks/give-codex-the-universal-hard-rules]]
- [[tasks/wiki-sync-post-omnigent]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]
- [[tasks/design-task-ship-loop-skill]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the eighth role decided 2026-07-19; **decided, not built**
- [[tasks/design-task-folder-structure-and-id-scheme]] — the adversarial pass on task 74 produced **18 findings** and forced revision 2's three substantive changes
- [[tasks/wiki-sync-task-folder-migration]] — task 78, the post-migration vault re-description
- [[tasks/route-coder-ship-loop-close-to-producer]] — Rewrite `fkit-task-ship-loop` step 9 — self-close → route the close to the producer
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — **the ledger's close condition**: clean on the swept work product; own-record residuals recorded, not re-reviewed. Split at the **site**, not the file
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the folder model that absorbed `review.md` into the task folder
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — `0150`, raised independently by both reviewers (Codex FULL) in `0119`'s ledger
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, which changes the ledger's `Task:` header to a folder-ID anchor
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — **what the second opinion guarantees, bounded**: D1's three-state coverage vocabulary (in force); D2's `workspace-write` ruling (decided 2026-08-11, **not built** — `0273` open)
- [[tasks/implement-adr-041s-dashboard-half]] — `0265`, whose ledger is ADR-042's one *accurate* coverage claim, and where the read-only pass originated three verified findings
- [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] — `0264`, whose ledger contradicted itself on coverage in one file
- [[tasks/verify-the-codex-half-of-the-comment-stripping-canary]] — ⚠️ *Added 2026-08-22:* task `0177` — what the **codex harness itself** does with the shared instructions layer: `codex-cli 0.145.0` passes the fkit markers and wrapper comment through to the model **verbatim**, so codex pays the full 404 B where Claude pays none
