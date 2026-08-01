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

### Two more conventions, added 2026-07-22 — seven now (verified against the tree 2026-07-26)

The section below describes the **five** in force to 2026-07-19. Two were added with the brief-schema and board work:

- **`task-owner-vocabulary.md`** — the sibling of `task-status-vocabulary.md` for the *other* mandatory brief field. **`## Owner` is mandatory, exactly one fkit role, populated at creation**, positioned immediately after `## Status`, and drawn from a **closed set of the seven live roles**. ⚠️ It carries an explicit guard: the **not-yet-built eighth role is not a valid owner** — *"do not assign a task to a role that does not exist."* The owner is a **role, not a session**, and it does not change because another role consulted. *"If a value you need isn't here, amend this doc — not invent one inline."* See [[tasks/add-owner-field-to-brief-schema-and-task-brief-skill]].
- **`dependency-declaration-form.md`** — one home, one form for a brief's dependencies: `- **Depends on:** …` in `## Notes`, **nothing between the `**` and the label**. Written because decoration in that position made a real dependency **invisible to `dashboard.sh`**, which rendered a false **`ready`** that the producer hand-corrected for seven consecutive status runs. `dashboard.sh` now emits a LOUD `⟨derive: UNPARSEABLE — see brief⟩` rather than fabricating readiness — **a safety net, not a licence**, and explicitly **not prose-proof**. See [[tasks/teach-dashboard-to-resolve-notes-dependencies]].

> ⚠️ **`dependency-declaration-form.md` is MISSING from `claude/scaffold/`** — verified 2026-07-26. That is a live [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] violation of the second kind (a convention governing how the *agents* work should be dual-homed), so **consuming projects inherit the exact misreport class the convention exists to prevent.** `dual-home-parity.md` is correctly absent from the scaffold — it is the fkit-repo-only one. Reconciliation is scoped, still-open work.

### An eighth convention, added 2026-07-27 — `priority-is-rank-not-identity.md` *(re-measured 2026-08-01)*

**`priority-is-rank-not-identity.md`** — *A sprint board's Priority cell is board **rank**, written `P<n>`. A task's identity is its task-folder name's `NNNN` prefix, and nothing else.* Filed by [[tasks/implement-task-folder-name-scheme-change]] (`0103`) as part of the Option C ruling, **dual-homed**, and needing the owner's **explicit separate sign-off** — a convention is a standing rule on every future run, which is a different consent from the ruling that produced it. It was deliberately **not** written earlier: filing it before `P<n>` existed would have put every board row in violation of a rule on the day it was filed.

It is **enforced in three places**: `dashboard.sh`'s `⟦FACTS⟧` id ladder (folder ID first, Priority cell only as fallback), a `dashboard-contract` red-proof that holds one variable and moves the other in both directions so an implementation whose id merely *correlated* with the folder fails, and `fkit-task-brief` at write time.

⚠️ **It shipped ambiguous and needed an owner ruling to read on the day it shipped.** Its `## What NOT to rewrite` frozen-history clause never said which of two notations it governed — the **board-cell** form `124 (0150)` or the **prose** form `0150 (124)`, which differ only in ordering. The ruling (board-cell only) was transcribed into the page by [[tasks/disambiguate-the-frozen-history-clause]] (`0161`). **Prose only and unenforced — nothing tests a convention page's wording for clarity.**

> ⚠️ **A NEW gap, measured 2026-08-01 and not previously recorded: `dependency-declaration-form.md` is absent from `conventions/README.md` entirely.** The live tree holds **8** convention documents; the README's index table lists **7**, and `dependency-declaration-form` is not named anywhere in that file — not in the table, not in the prose. So the convention created by [[tasks/teach-dashboard-to-resolve-notes-dependencies]] is **missing from the scaffold *and* from its own index**, which is how a reader arriving at `conventions/` would learn it exists. **`ai-agents/knowledge-base/` is outside the wiki role's write scope — flagged, not touched.** *(Counted by enumerating both directories and the README's table rows, then classifying each; not inferred from a subtraction.)*

**Scaffold parity, re-measured 2026-08-01:** live holds 8 conventions, the scaffold 6. `dual-home-parity.md` is correctly absent (fkit-repo-only). `priority-is-rank-not-identity.md` **is** present in both. **`dependency-declaration-form.md` remains the one genuine drift** — unchanged since 2026-07-26.

### The conventions in force *(the original five)*
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
- **The task status vocabulary is a closed set**: `Backlog` · `In progress` · `Blocked` · `Done` · `Cancelled` · `Moved`, **plus the two agent-closed variants** added 2026-07-19 — `✅ Done (agent-closed — not owner-verified)` and the same qualifier on `⛔ Cancelled`. **No other value is valid** — not "Not started", not "WIP", not "Todo". `Done` and `Cancelled` are **skill-gated**: set only via `/fkit-task-done` and `/fkit-task-cancelled`, and **only `fkit-producer` may invoke them** ([[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]). Every other role — wiki, coder, reviewer, architect, lead — **routes its closes through the producer** and closes nothing itself. **This one is structural, not prose:** the [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] `PreToolUse` hook **denies** a mover call from any non-producer identity **at any spawn depth**. *(History: ADR-025 opened the movers to every role but the adversarial reviewer on 2026-07-18; ADR-033 closed them again on 2026-07-23.)* ⚠️ **The agent-closed marker is prose and unenforced, and `/fkit-status` does not surface it** — `dashboard.sh` collapses it to a plain `Done`, so an agent-closed row is indistinguishable on the board and must be found by opening the sprint plan or the brief. **ADR-033 does not restore prevention** — it restores separation of the closing *identity*; a determined doer can still spawn a producer to close, and only a producer session with the owner present yields an owner-verified close. If a status you need isn't there, **amend the convention — don't invent a value inline.**
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
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — why `Done`/`Cancelled` stopped being owner-only; ⚠️ **since reversed**
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which shipped that reversal and added the agent-closed vocabulary rows
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — ⚠️ **`Done`/`Cancelled` are producer-only again**, hook-enforced. `task-status-vocabulary.md`'s "Set by" column was one of the sites the revert's regex sweep **could not match** (a verbless noun phrase) — see [[tasks/revert-task-movers-to-producer-only]]
- [[tasks/add-owner-field-to-brief-schema-and-task-brief-skill]] · [[tasks/backfill-owner-field-into-existing-briefs]] · [[tasks/render-owner-column-in-fkit-status]] — the sixth convention, `task-owner-vocabulary.md`, and its rollout
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — the seventh convention, `dependency-declaration-form.md`; ⚠️ **missing from the scaffold**
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — the report that produced ADR-033; a `reports/` record whose recommendation the owner overruled
- [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] · [[tasks/amend-project-brief-for-lead-conductor]] — the architect/producer split over the KB's two root docs, ADR-013 style
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] — why ADR-010's now-false text was **deliberately not rewritten**: a decision record holds history, and the sanctioned fix is a dated correction note
- [[tasks/filter-fkit-status-board-to-open-tasks]] — the 2026-07-18 amendment to `status-report-format.md`
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]] · [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board these conventions now also govern
- [[tasks/restructure-coder-report-summary-then-interview]] — the coder's report shape, aligned to `status-report-format`
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — the sibling "manual audit → automated gate" ruling
- [[systems/testing-and-verification]]
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, the dual-home drift across the conventions and README
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58: the architect-owned refresh of the KB's own root docs after ADR-022
- [[tasks/assign-global-task-ids-and-create-registry]] — task 75: where the ID allocation procedure is written down
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, the mover KB-sweep fix + ADR-number guard
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — task 77, the post-migration doc-link repair
- [[tasks/implement-task-folder-name-scheme-change]] — `0103`, which filed the `priority-is-rank-not-identity` convention
- [[tasks/disambiguate-the-frozen-history-clause]] — `0161`, the same convention page's own ambiguity
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, whose follow-up 1 adds a dual-homed `durable-citation-anchors` convention
