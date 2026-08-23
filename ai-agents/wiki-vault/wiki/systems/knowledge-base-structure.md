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
>
> ✅ **RESOLVED 2026-08-01 by [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] (task `0132`)** — the paragraph above is left byte-identical as the record of the 2026-07-26 state. The convention now ships in `claude/scaffold/ai-agents/knowledge-base/conventions/`, so consuming projects receive it. ⚠️ **It is deliberately NOT byte-identical to the live copy — it ships GENERALIZED, by owner ruling.** `0132`'s own verification step demanding byte-identity is **superseded by that ruling, not met, and must stay that way**; copying the live file over the scaffold copy re-introduces the regression.

### An eighth convention, added 2026-07-27 — `priority-is-rank-not-identity.md` *(re-measured 2026-08-01)*

**`priority-is-rank-not-identity.md`** — *A sprint board's Priority cell is board **rank**, written `P<n>`. A task's identity is its task-folder name's `NNNN` prefix, and nothing else.* Filed by [[tasks/implement-task-folder-name-scheme-change]] (`0103`) as part of the Option C ruling, **dual-homed**, and needing the owner's **explicit separate sign-off** — a convention is a standing rule on every future run, which is a different consent from the ruling that produced it. It was deliberately **not** written earlier: filing it before `P<n>` existed would have put every board row in violation of a rule on the day it was filed.

It is **enforced in three places**: `dashboard.sh`'s `⟦FACTS⟧` id ladder (folder ID first, Priority cell only as fallback), a `dashboard-contract` red-proof that holds one variable and moves the other in both directions so an implementation whose id merely *correlated* with the folder fails, and `fkit-task-brief` at write time.

⚠️ **It shipped ambiguous and needed an owner ruling to read on the day it shipped.** Its `## What NOT to rewrite` frozen-history clause never said which of two notations it governed — the **board-cell** form `124 (0150)` or the **prose** form `0150 (124)`, which differ only in ordering. The ruling (board-cell only) was transcribed into the page by [[tasks/disambiguate-the-frozen-history-clause]] (`0161`). **Prose only and unenforced — nothing tests a convention page's wording for clarity.**

> ✅ **DISCHARGED 2026-08-02 — the gap below is closed.** `conventions/README.md` now indexes `dependency-declaration-form.md` in its table, and the file is present in both homes. Closed by [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] (task `0132`), which updated the README in both homes as its step 4. The flag is left standing below as the record of what was measured on 2026-08-01.
>
> ⚠️ **A NEW gap, measured 2026-08-01 and not previously recorded: `dependency-declaration-form.md` is absent from `conventions/README.md` entirely.** The live tree holds **8** convention documents; the README's index table lists **7**, and `dependency-declaration-form` is not named anywhere in that file — not in the table, not in the prose. So the convention created by [[tasks/teach-dashboard-to-resolve-notes-dependencies]] is **missing from the scaffold *and* from its own index**, which is how a reader arriving at `conventions/` would learn it exists. **`ai-agents/knowledge-base/` is outside the wiki role's write scope — flagged, not touched.** *(Counted by enumerating both directories and the README's table rows, then classifying each; not inferred from a subtraction.)*

**Scaffold parity, re-measured 2026-08-01:** live holds 8 conventions, the scaffold 6. `dual-home-parity.md` is correctly absent (fkit-repo-only). `priority-is-rank-not-identity.md` **is** present in both. **`dependency-declaration-form.md` remains the one genuine drift** — unchanged since 2026-07-26.

> ✅ **Re-measured 2026-08-02 — the drift is gone: live holds 8 conventions, the scaffold 7**, the only absence being `dual-home-parity.md`, which is **correctly** absent (fkit-repo-only). **Every convention that should be dual-homed now is.** ⚠️ **But "dual-homed" no longer means "byte-identical" across the board.** Task `0132` established a **third kind** by owner ruling 2026-08-01 — **audience-adapted**: a de-fkit-ified rewrite for a consuming project's reader, sitting alongside ✅ must-match and ⛔ never-sync. **Five of the six scaffold `conventions/*` files are that kind, not stale copies**, and byte-aligning them is **rejected as a product regression** (it would ship fkit's own incident narrative and 4 verified-broken relative links downstream). The authoritative list is now `test/dual-home-parity-exceptions.mjs` — **26 entries, each with its own specific reason** — mechanically enforced by [[tasks/build-dual-home-parity-test]]. **`decisions/` and `reports/` are outside the surface entirely: no ADR is ever a drift event.**

### A ninth convention, added 2026-08-21 — `durable-citation-anchors.md` *(measured 2026-08-22)*

**`durable-citation-anchors.md`** — *A coordinate is safe to cite when the citer controls or freezes the target's revision. It is unsafe when a third party edits the target after you write.* ⭐ **Line numbers are for findings against a revision; names are for cross-references into living documents.** Ruled by the owner 2026-08-01 from `0160`'s durable-citation report; the page transcribing that ruling landed **2026-08-21**.

**Measured 2026-08-22:** live holds **9** conventions, the scaffold **8** — the only absence is `dual-home-parity.md`, correctly (fkit-repo-only). `durable-citation-anchors.md` is present in both and **byte-identical**, and `conventions/README.md` now lists **three** must-match dual-homed pages (`task-owner-vocabulary`, `priority-is-rank-not-identity`, `durable-citation-anchors`) where it previously listed two.

⭐ **The highest-value rule on the page applies to every case at once, including the ones where the line number is correct: never cite a line number naked.** Pair every `path:NNN` with a quoted fragment or its heading. A naked pointer that has drifted is **indistinguishable** from one that has not; a paired one is **self-correcting**. *"The rider does not make a wrong number right. It makes a drifted number recoverable."*

Its table rules five target kinds — `path:NNN` is **correct** for a source/test/skill file and for a file under review; **wrong** for a coordination document others append to (sprint plans, task briefs, an append-only log); a **task** is always its folder-name `NNNN`; a **board position** is `P<n>` and only as rank.

⚠️ **The page warns that its own one-question shortcut — *"a claim about a read revision, or a pointer for a later reader?"* — is a first cut, not the whole test, and applied alone gets one row wrong in the UNSAFE direction.** Both conditions must be read together; the second (*is the target a document a third party edits under me?*) is the one a writer skips, and it is what makes the coordination-document row categorical.

⚠️ ~~**Its task, `0171`, is still `🔄 In progress` on [[tasks/sprint-6-repair-the-record-the-board-rests-on]] (`P2`) as of 2026-08-22, although the page is on disk and committed.**~~ ✅ *Corrected 2026-08-22 (later the same day):* **`0171` has CLOSED** — `✅ Done (agent-closed — not owner-verified)`, closed by a spawned producer with no owner channel, so ⛔ **no human has verified it**. See [[tasks/write-the-durable-citation-anchors-convention-page]]. ⛔ **Nothing enforces the form** — [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] removed the day's seed and said so plainly: *"the decay can return tomorrow."* ⚠️ **That is unchanged by the close:** the guard is task `0176`, still **open**, and the page's own *Where this is enforced* section says so.

### The merit statement — added to `priority-is-rank-not-identity.md`, 2026-08-21

A new `## The merit statement` section, **dual-homed byte-identically**, recording how an owner records an ordering that board rank can no longer carry. **Two shapes only** — `- **On merit:** immediately above 0154 — <reason>` or `- **On merit:** as ranked` — **relative never absolute · folder ID only, no `P<n>` token · advisory, board rank still binds · `as ranked` required, not optional**, because an explicit no-op is what makes **absence detectable**. It also names the **three carriers** and which of them binds: rank carries reading order, the merit statement carries preference (**not binding**), and `Depends on` / `Blocks` carries correctness order (**binding, and it outranks reading order**). ⚠️ Its `brief-missing-merit` guard is recorded as **"Specified, not built yet."** See [[tasks/record-the-canonical-merit-statement-form-in-the-convention-page]].

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
  > ✅ **Updated 2026-08-02 — both are built, and the framing above is superseded.** The bullet is left byte-identical as the record of its ship date. The reconciliation ([[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]]) and the parity test ([[tasks/build-dual-home-parity-test]]) landed 2026-08-01/02. ⚠️ **The six files still differ — all six — and that is now CORRECT, not drift.** They are **audience-adapted rewrites**, and the owner ruled byte-aligning them **a product regression**. The "six drifted files" figure was stale **in kind, not in count**, and its underlying defect is its **evidence**: *a `diff` count cannot distinguish a stale copy from a deliberate adaptation.* **ADR-027 still says otherwise on disk** — amending it is task `0186`, **open**.
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
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — the seventh convention, `dependency-declaration-form.md`; ~~⚠️ **missing from the scaffold**~~ ✅ **shipped to the scaffold 2026-08-01, generalized rather than byte-identical** (task `0132`)
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] — task `0132`, the reconciliation: the exception-list module, and **the sweep that disproved ADR-027's premise**
- [[tasks/build-dual-home-parity-test]] — task `0133`, the mechanical enforcement of the rule this page describes
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] — task `0142`, which found live defects in `architecture.md` and the scaffold's `CLAUDE.md`, **and left every one of them live by design**
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
  > ✅ **Dated note 2026-08-22 — the convention page LANDED 2026-08-21** and is dual-homed byte-identically; the bullet above is left byte-identical. See the ninth-convention section above. ⚠️ ~~**Its task `0171` is nonetheless still `🔄 In progress`**~~ ✅ *Corrected later the same day, 2026-08-22:* **`0171` CLOSED** — `✅ Done (agent-closed — not owner-verified)`, ⛔ **not owner-verified**, [[tasks/write-the-durable-citation-anchors-convention-page]]. The page shipping ahead of the row's close is unchanged as a fact — it stood that way for a day.
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, the task that wrote the ninth convention page (dual-homed, `sha256` `2ef1f155…`, 233 lines) and repaired **23** displaced ADR citations with it; ⛔ closed agent-closed 2026-08-22, and ⛔ **the page is still enforced by nothing** (`0176`, open)
- [[tasks/record-the-canonical-merit-statement-form-in-the-convention-page]] — `0178`, the merit-statement grammar added to `priority-is-rank-not-identity.md`
- [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] — `0306`, the corpus-wide repair of the three ways a brief's own text rots
- [[tasks/append-a-dated-correction-note-to-adr-010]] — task `0143` — **the knowledge-base correction-note form**: ⚠️ drift / ⛔ reversal, placed **below** the claim, original left byte-identical, additions only, no `:NNN` into a mutable file, legend in a `- **Corrections:**` header item
  > ✅ **Dated note 2026-08-03 — this form now governs the VAULT as well.** Owner ruling, live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session, superseding the vault's own opposite wording (*"banner above claim"*, [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]], `0141`). The bullet above is left **byte-identical** — its scope widened, its content did not. ⚠️ **`log.md` is outside the ruling**: append-only with no exceptions, so a correction there is a new dated entry, never a note at the claim.
  >
  > ✅ **And an ACCEPTED naming collision, ruled the same day — do not re-raise it and do not sweep.** *"Banner"* names both the **superseded** correction-note placement and a **live** device the vault still uses: page-top `⚠️ STALE` / supersession / collision blocks, and the skills' `⛔ Owner:` banners. The owner ruled the two uses **distinguishable in context**. ⛔ **Scope: the *naming* overlap only** — it does not re-open the placement ruling and does not bless *"banner above claim"* as a correction-note form, which stays superseded.
  >
  > ✅ **Dated note 2026-08-22 — the form is now IN THE SKILL, not only in these two task records.** [[tasks/teach-record-decision-the-dated-correction-note-form]] (`0198`, shipped 2026-08-15) added `## Correcting an accepted ADR — the dated correction note` to `claude/skills/fkit-record-decision/SKILL.md`, `+111 / −0`. ⭐ **That section is now the ONLY normative source for the git-based append-only proof** — `git diff --numstat` (expect `N  0`) plus `git diff -U0 <file> | grep '^-' | grep -v '^---'` (expect nothing). ⚠️ The earlier weaker guard `grep '^-[^-]'` **misses a deleted markdown list line** and was replaced for that reason; ⚠️ the replacement still **drops a deleted line whose text begins with `---`**, a recorded residual.
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — task `0195` — the same form extended, and the owner's ruling that the header item gains a **continuation line** rather than being edited in place
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — task `0211` — **owner-ruled 2026-08-03: the vault's `log.md` is append-only with no exceptions.** A correction is a new dated entry naming its target by folder ID and durable anchor; originals stay byte-identical. Plus **"describe, don't quote"** — quote unsubstituted templates, never live paths, so a correction cannot itself become a dead pointer
- [[tasks/tighten-the-wiki-completion-flag-block]] — task `0173` — the wiki completion flag becomes folder-ID-only, and `:NNN` coordinates are banned from it outright
- [[tasks/update-the-docs-for-the-structure-check-capability]] · [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]] — tasks `0248`/`0249` (2026-08-07): ⚠️ **the clearest worked example of the knowledge-base / vault write boundary forcing a task split.** The design bundled docs and the vault ingest as one unit; **they have different exclusive write authorities and a brief carries a single mandatory `## Owner`**, so the wiki half became its own brief — the only place that filing departed from the design's unit boundaries, with its cause recorded rather than inferred
