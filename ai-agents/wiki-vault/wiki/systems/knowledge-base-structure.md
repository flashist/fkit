# Knowledge-Base Structure

**Layer**: shared
**Key files**: `ai-agents/knowledge-base/PROJECT.md`, `ai-agents/knowledge-base/architecture.md`, `ai-agents/knowledge-base/conventions/README.md`, `ai-agents/knowledge-base/decisions/`, `ai-agents/knowledge-base/incidents/README.md`, `ai-agents/knowledge-base/reports/README.md`, `ai-agents/knowledge-base/history/README.md`

## Summary
`ai-agents/knowledge-base/` is fkit's durable project memory, and it is **filed by kind**. Its root holds **exactly two documents** — `PROJECT.md` (*what we are building*) and `architecture.md` (*how it is built*) — the project-defining pair. Everything else lives in a folder that says what kind of thing it is.

The folder grew organically and drifted: at one point its root held eight loose files of four different kinds, so a reader landing there **could not tell the live rules from the spent paperwork**. [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] settled the convention.

## Architecture

| Path | Kind | Written by |
|---|---|---|
| `PROJECT.md` | The prose product brief. **Root.** | producer (`initiate-project`) |
| `architecture.md` | The technical survey. **Root.** | **architect** (`survey-project` / `inspect`) |
| `conventions/*.md` | **Standing rules the project reads on a normal run and obeys.** Prescriptive, maintained in place, **never dated**. | whoever owns the convention; **new ones need the owner** |
| `decisions/adr-NNN-*.md` | ADRs — settled decisions: *why* the rule is what it is. | **architect** (`record-decision`) |
| `incidents/YYYY-MM-DD-*.md` | Postmortems of **fkit's own runtime/tooling** — not product bugs. | any session |
| `reports/YYYY-MM-DD-*.md` | Dated artifacts of work performed — audits, verifications, evaluations, executed plans. | any session; evaluations from the **architect** |
| `history/` | Superseded **design docs** — docs that no longer describe reality. **Archive, don't delete.** Narrow; *not* the general archive. | architect |

### The distinction that is the whole point

|  | records | answers |
|---|---|---|
| **`conventions/`** | **what the rule is** | "how must I do this?" |
| **`decisions/`** (ADRs) | **why the rule is what it is** | "why was it done this way — and may I change it?" |
| **`reports/`, `incidents/`** | **what happened, once** | "what did we find / what broke, on that day?" |

- A **convention** is *prescriptive and current*. It is **maintained in place** — when it stops being true you **edit it**, you don't append to it.
- An **ADR** is a *decision record*: reasoning and rejected alternatives, **immutable** once accepted. An ADR may *create* a convention; it never *is* one. **If you have to read an ADR to know how to format a status report, the convention is missing.**
- A **report** or **incident** is a record of a moment and is **never promoted** into `conventions/`. If a report's conclusion hardens into a rule, the rule gets written as its **own** convention document, and the report stays where it is as the evidence behind it.

### The governing principle: records don't go stale, designs do
An audit, a verification, an evaluation, a plan, an incident — **none of them become false when the system they describe is removed.** They stay true; they happened. So they are **never relocated once filed**. `history/` is for **superseded design docs only** ([[decisions/adr-002-archive-pre-omnigent-design-docs]]), and it stays closed at the four it already holds.

This principle caught a real error: the knowledge-base hygiene pass had improvised its own routing rule and would have swept an evaluation, a verification, the audit, the plan **and the 2026-07-10 incident** into `history/` — **emptying `incidents/` on the day it was formalized.**

### The checkable forms
- **`ls knowledge-base/*.md` returns exactly two names.**
- **A dated filename never lives at the root or in `conventions/`** — a dated name means "a record of a moment".

### The conventions in force
`conventions/README.md` indexes **five**: **`task-status-vocabulary.md`** (the six valid statuses, and who may set each), **`status-report-format.md`** (the shape of a status briefing), **`evidence-before-assertion.md`** (added 2026-07-16 — *a claim about repo/project state must come from a check made this turn*), **`one-skill-one-output.md`** (added 2026-07-17 — *for any subject a skill produces one complete output; arguments select subjects and inputs, never output variants*, [[tasks/record-one-skill-one-output-convention]]; litmus — does the argument change *what the skill works on* (a parameter, allowed) or *what the same work looks like when reported* (a variant, forbidden)?), and — added 2026-07-19 — **`dual-home-parity.md`**.

**`dual-home-parity.md` is the first fkit-repo-only convention**, created by [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]: *an fkit-authored file living in both `ai-agents/` and `claude/scaffold/ai-agents/` must be edited in both, in the same change.* It carries the **fkit-authored vs project-specific** litmus — `PROJECT.md`, `wiki-vault/index.md` and `wiki-vault/log.md` have deliberately-placeholder scaffold copies and **must never be synced**, since copying them would ship fkit's own project data into someone else's repo.

**It is deliberately *not* dual-homed itself**, and that is the general rule it makes explicit: **a convention governing fkit's own development is fkit-repo-only; a convention governing how the agents work is dual-homed.** The other four are all the second kind. `conventions/README.md` marks it with a `†` footnote for exactly this reason — which is also why that README's index table is a permanent, intentional divergence between the two homes.

**`status-report-format.md` was amended 2026-07-18** ([[tasks/filter-fkit-status-board-to-open-tasks]]): its *"show the real status of every task, including cancelled/moved rows — a board that hides its dead rows lies about scope"* bullet was **reversed** to **show open work only**, with the roll-up line (which counts every task and ends `— of M`) as the stated mitigation, plus a carve-out that **a row with drift on it always shows, whatever its marker says**.

**`evidence-before-assertion` exists because `status-report-format`'s scope was too narrow.** `status-report-format.md` was written after *"a status report was once improvised from memory and fabricated a number that looked precise and was false"* — but it governs `/fkit-status` only, and **it did not govern the moment an agent decides whether work exists**, which is exactly where the same failure recurred three times in one session. **The convention was right; its scope was too narrow.** See [[tasks/stop-agents-asserting-unchecked-repo-state]].

## Gotchas / Known Issues
- **`decisions/` has no README on purpose**: the `adr-NNN-<slug>` sequence *is* the convention.
- **The scaffold shipped a README promising five `knowledge-base/` folders and created one** — so a fresh project's agents were told to file into four folders that did not exist on disk. **ADR-013 made the decision; the scaffold simply never implemented it.** Fixed for **new** projects only ([[tasks/fix-scaffold-knowledge-base-folders]]); existing projects need convergence, which is still backlog.
- **The two conventions-README copies (live vs scaffold) diverge on the "enforceable somewhere" item**, and **that may be correct** — the dropped text is repo-specific and a fresh project has neither the `claude/` layout nor the file it cross-references. Tracked as [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]].
- **The ADR "Re-raise only if" field is load-bearing** — it is what stops future reviews re-litigating a settled decision.
- **The task status vocabulary is a closed set**: `Backlog` · `In progress` · `Blocked` · `Done` · `Cancelled` · `Moved`, **plus the two agent-closed variants** added 2026-07-19 — `✅ Done (agent-closed — not owner-verified)` and the same qualifier on `⛔ Cancelled`. **No other value is valid** — not "Not started", not "WIP", not "Todo". `Done` and `Cancelled` are **skill-gated, not owner-gated**: set only via `/fkit-task-done` and `/fkit-task-cancelled`, but **any role except `fkit-adversarial-reviewer` may invoke them** ([[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]], shipped by task 64 — [[tasks/implement-spawned-invocation-for-task-movers]]). ⚠️ **The agent-closed marker is prose and unenforced, and `/fkit-status` does not surface it** — `dashboard.sh` collapses it to a plain `Done`, so an agent-closed row is indistinguishable on the board and must be found by opening the sprint plan or the brief. Read the ADR's honesty clause before trusting a green row: **prevention was removed, not downgraded.** If a status you need isn't there, **amend the convention — don't invent a value inline.**
- **⚠️ Six fkit-authored files are drifted between the live and scaffold trees right now** (`README.md` and four of the five conventions, incl. `conventions/README.md` and the just-amended `status-report-format.md`). Consuming projects have **not** received those amendments. The reconciliation and the mechanical parity test are both scoped but **not yet built** — until then `dual-home-parity.md` is enforced by reading it. See [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]].
- **Skills read these conventions as live contracts.** When ADR-013 moved them into `conventions/`, product source under `claude/` still pointed at the old paths, and two shipped skills broke — **silently**, because a skill that cannot find its contract document falls back to its own inline copy. That is exactly the drift the conventions exist to remove. See [[tasks/repair-knowledge-base-paths-in-product-source]].
- **The drift rate is real.** The task brief that prompted ADR-013 listed six loose root files; by the time it was picked up there were **eight**.

## Related
- [[tasks/task-cancelled-flips-brief-own-status-header]]
- [[tasks/task-done-flips-brief-own-status-header]]
- [[systems/fkit]]
- [[systems/launch-convergence-and-init]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]]
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]]
- [[tasks/fix-scaffold-knowledge-base-folders]]
- [[tasks/design-version-to-version-migration-mechanism]]
- [[tasks/wiki-sync-post-omnigent]]
- [[tasks/design-deterministic-dashboard-for-fkit-status]]
- [[tasks/repair-broken-links-in-closed-sprint-plans]]
- [[tasks/formalize-knowledge-base-incidents-folder]]
- [[tasks/knowledge-base-hygiene-post-omnigent]]
- [[tasks/repair-knowledge-base-paths-in-product-source]]
- [[tasks/enforce-task-status-vocabulary]]
- [[tasks/add-status-skill-to-producer]]
- [[tasks/record-one-skill-one-output-convention]]
- [[tasks/amend-subagent-disconnect-incident-doc]]
- [[tasks/bake-architecture-pointer-into-scaffold-templates]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — the convention's scaffold delivery
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the fifth convention, and the drift it records
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — why `Done`/`Cancelled` are no longer owner-only
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which shipped that reversal and added the agent-closed vocabulary rows
- [[tasks/filter-fkit-status-board-to-open-tasks]] — the 2026-07-18 amendment to `status-report-format.md`
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]] · [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board these conventions now also govern
- [[tasks/restructure-coder-report-summary-then-interview]] — the coder's report shape, aligned to `status-report-format`
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — the sibling "manual audit → automated gate" ruling
- [[systems/testing-and-verification]]
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, the dual-home drift across the conventions and README
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58: the architect-owned refresh of the KB's own root docs after ADR-022
- [[tasks/assign-global-task-ids-and-create-registry]] — task 75: where the ID allocation procedure is written down
