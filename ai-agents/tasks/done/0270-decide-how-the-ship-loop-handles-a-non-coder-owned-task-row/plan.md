# Plan — 0270: Decide how the ship-loop handles a non-coder-owned task row

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-27. Written by the driver at approval, before the Build spawn (ADR-020). This task's Plan and Build steps run with **`fkit-architect`** as the worker on the owner's ruling of 2026-08-27, "Drive it here with the architect (Recommended)". The analysis below is the architect's Plan-step return, verbatim; the owner's rulings ND1–ND7 are appended at the end.

## 0. Measured 2026-08-27

`grep -ni 'owner:' claude/skills/fkit-sprint-ship-loop/SKILL.md` → still **exactly one hit, line 12** (the skill's own banner). The step table has moved to `SKILL.md:122-127` (Plan `:122`, Build `:123`, Verify `:124`, Review `:125`, Process review `:126`, Close `:127`); step 1 is `:93-107` (eligibility `:100`, skip memory `:103`). Step 1 still takes no owner-role input.

## 1. The question, stated precisely

The loop's per-step roles are fixed by design: for the steps that run a skill, by the skill's owner in `skills_for_role()` (ADR-038 `:39`); for Build and Verify, which ADR-038 says run no skill, by the literal cell in the loop's table (ADR-038 `:88-91`; `SKILL.md:123-124`). **Given that, what must the driver do when the table's fixed role cannot lawfully produce, or cannot lawfully fix, a row's deliverable — and at which point in the run must that be discovered: at step 1 (before `🔄 In progress` and before the single plan gate is spent), at the plan gate, or at Build?**

Two sub-questions the answer has to settle, because the evidence shows they come apart:

- **Is the mismatch a property of the brief's `## Owner` field, or of the deliverable?** `0171` is `## Owner: fkit-architect` and was built by a spawned **coder** on 2026-08-15 without incident (`ai-agents/tasks/done/0171-*/worklog.md:3-5`). `0280` carries the wiki theme but edits a skill file, not the vault (`ai-agents/sprints/sprint-6.md:287-288`). So `Owner != fkit-coder` is a proxy, not the thing itself. The thing itself is: *which role may write the deliverable's target, and which skill produces it.*
- **Which steps are actually walled?** Two different walls, not one:
  - **A hard wall — vault writes.** `ai-agents/wiki-vault/` is `fkit-wiki`-only (ADR-005; universal hard rule; `fkit-coder.md:211`; ADR-033 §2 "wiki is wiki-only"). A wiki-deliverable row needs a vault write at **Build** *and* at Process-review **Step 6** (fix application, `fkit-process-stateful-review/SKILL.md:195`) — and ADR-038 fixes Process-review to the coder.
  - **A soft wall — design deliverables.** An ADR / design spec is produced by an architect skill (`/fkit-record-decision`, `/fkit-design-spec` — `skills-for-role.sh:53`). A coder "building" one writes it by hand — the by-hand path ADR-038 §Context named as the misroute route, in reverse. Nothing hook-denies it; it is a quality and ownership defect, not an ADR-005 breach.

**The brief's "no third outcome" claim needs a correction.** The loop's own `NEEDS-DECISION` relay (`SKILL.md` step 3) *is* a mid-run owner beat: a worker returns the decision, the driver relays via `AskUserQuestion`, and spawns the next worker with the ruling folded in. Today's run is the proof — 0270's Plan step carries the analysis, the plan gate carries the sign-off, Build writes the ADR. So the "architect row needs a second owner beat" reason for excluding `0255` on Sprint 5 was over-stated; the pipeline already had the beat. The wiki wall is real; the architect wall is not a wall.

## 2. ADR-038 procedural discharge — does `:116` bar candidate 1?

ADR-038 `:116`: *"Anything else that re-argues (b) from deliverable authorship is closeout, not a new finding."* Option (b) was *grant `fkit-process-stateful-review` to the architect* (`:57-63`).

**Answer: it bars candidate 1 for the Process-review step, and it does not reach Build or Plan — but for a reason that also makes candidate 1 pointless there.**

- **Process-review:** on every row measured (Sprints 3–6 and the Backlog board), `## Owner` **is** the deliverable's author. "Derive the Process-review role from `## Owner`" therefore produces exactly the author-runs-its-own-process-review outcome (b) was rejected for, under a new label. The axis is nominally different (a declared field vs. observed authorship); its effect is identical. `:116` applies. None of the three `Re-raise only if` triggers fires (`:109-114`): `skills_for_role()` still has no per-artifact scoping (`skills-for-role.sh:48-58`), the owner has not re-ruled `0200`, and the Build row names its role (`SKILL.md:123`).
- **Build / Plan:** ADR-038 explicitly does **not** fix these roles (`:88-91` — *"their roles come from the loop's enumerated step table, not from this lookup"*). There is no (b) to re-argue, so `:116` cannot bar anything here — but equally, changing how the *table* names Build's role is **not a re-raise of ADR-038**; it is a table decision ADR-038 left open. Candidate 1's "re-raise" framing is therefore either barred (Process-review) or a misnomer (Build/Plan).
- **ADR-038 already contradicts its own Build fact, in practice.** Its `:101-103` "Corroborating practice" cites `0241`'s Build being a spawned **architect** via `/fkit-design-spec`. Same on `0222` (`worklog.md:5`, *"step-role-follows-skill"*), `0242`, `0178` (`worklog.md:3`), `0249` (spawned **wiki**, `/fkit-wiki-ingest`, `worklog.md:3-5`), `0218` (spawned **producer**), and `0270` today. So Build *does* run a skill on those rows, and `:88-91`'s "Build runs no skill" is a fact statement that has drifted. That is a dated-correction candidate (0205's pattern), not an amendment of the decision — flagged in §4, not done here.

## 3. Candidates

Live evidence first, since every candidate is measured against it:

| Board | Rows | Non-coder | How they actually ran |
|---|---|---|---|
| Sprint 3 | 4 | 2 (`0222`, `0241`, architect) | through the loop, Build = spawned architect |
| Sprint 4 | 8 | 2 (`0242` architect; `0249` wiki) | through the loop; `0249`: Build = spawned wiki, and its *Coder response* rows were **written by the spawned wiki** (`0249/review.md:16`) — the shape ADR-038 now forbids |
| Sprint 5 | 17 | 5 (3 architect, 2 wiki) | `0255`/`0258`/`0269` owner-excluded 2026-08-10; ran via owner session / spawned `@fkit-wiki` (`sprint-5.md:168-180`). The other two architect rows: not checked this pass |
| Sprint 6 | 21 | 4 (`0171`, `0178`, `0270` architect; `0218` producer) | `0171` Build = **coder**; `0178` Build = architect; `0218` Build = producer; `0270` Plan+Build = architect on today's ruling. The producer had to hand-write a warning on the board (`sprint-6.md:288-292`) |
| Backlog board | 123 | **51 (41%)**: 30 architect, 12 producer, 6 wiki, 2 reviewer, 1 blank `## Owner` | — |

The gap bites on every sprint, roughly 1 row in 4, and the driver has improvised four different staffings for it. One Backlog brief returns an empty `## Owner` to a naive grep — any predicate must handle that (`dashboard.sh:980-983` already emits `drift nonconformance … brief-missing-owner`).

### Candidate 1 — re-raise ADR-038 (step role derived from `## Owner`)
- **What it must answer:** (b)'s rejection and the total-or-absent premise — untouched by it, since deriving a role does not grant a skill; but a derived Process-review role hands the step to a role that does not own `fkit-process-stateful-review`, so the ADR-018 hook denies it and the worker applies the method by hand — the exact `0158/0143` route. On Process-review it **reintroduces the misroute ADR-038 exists to prevent.**
- **Cost:** `skills_for_role()` untouched or (if the grant is added) widened four ways; `0223` reversed; `0224`'s oracle flips; `0225` loses its subject.
- **ADR-038:** would supersede it. **Barred by `:116` for Process-review (§2); a misnomer for Build.** Reject.

### Candidate 2 — defensive skip at step 1, predicate `Owner != fkit-coder`
- **Predicate as the brief states it:** would have skipped `0171`, `0178`, `0218`, `0222`, `0241`, `0242`, `0270` — seven rows the loop shipped or is shipping. Too wide by a factor of ~7:1 against the rows that actually cannot run (`0249`-class wiki rows).
- **Narrowed predicate (the version worth keeping):** skip a row whose deliverable's write target is `ai-agents/wiki-vault/` — cheaply approximated at step 1 by the dashboard's Owner column reading `fkit-wiki` (`⟦BOARD⟧` col 5; deterministic, no new parser), with the Plan worker returning `BLOCKED` if any plan turns out to need a vault write (`0280`-inverse guard).
- **Reporting:** at step 1, before any row is driven — a new roll-up class `out-of-scope-for-this-driver` (not `pending`, not `🚧 Blocked`; status untouched, stays `🔲 Backlog`), each with its route named (*spawned `@fkit-wiki` outside the pipeline, or a `fkit wiki` session*). Loud = placement: listed in the step-1 report and again in the final roll-up, never only in a footer.
- **Placement:** step 1, alongside the per-run skip memory — the brief's own requirement ("before `🔄 In progress`, before the gate is spent"). Not earlier: there is no earlier beat in the loop.
- **ADR or skill text:** on its own, skill text would do. Combined with the Build rule below it is one decision and belongs in one ADR.
- **Cost:** `SKILL.md` step 1 (+predicate, +report line) and the exit table (+1 row); no `skills_for_role()` change; `test/skill-ownership-hook.test.js` untouched; `0223`/`0224`/`0225` untouched by the skip alone.
- **ADR-038:** not amended. Accept **narrowed**, as half of the recommendation.

### Candidate 3 — status quo: the owner excludes by hand each sprint
- It worked on Sprint 5 (`sprint-5.md:133-140`, `:695-701`). On Sprint 6 it degraded into a hand-written board warning (`:288-292`) plus four improvised staffings, and the improvisation is *invisible to `0224`'s detector design* (a worklog `Role:` line that disagrees with the table's literal `@fkit-coder` reads as a misroute — so `0178`, `0218`, `0222`, `0241`, `0242`, `0270` would all be flagged once `0224` ships). The record dies with each board (the brief's founding point).
- **Cost:** zero files now; a re-derivation every sprint; `0224` would misfire on the majority of non-coder rows.
- **ADR-038:** untouched. **Reject as the standing answer** — but nothing in the recommendation removes the owner's power to exclude any row by ruling; that stays.

### Candidate 4 — today's live shape, generalised: Build (and Plan) role follows the skill the deliverable runs; Review / Process-review / Close stay fixed
- **The rule:** *the Build row's role is the owner, in `skills_for_role()`, of the skill the deliverable is produced by* (`/fkit-record-decision`, `/fkit-design-spec`, `/fkit-evaluate-approach` → architect; `/fkit-task-brief` → producer); *a deliverable that names no skill — source, tests, scaffold, prose under `claude/`, coordination-doc repairs — is the coder's, as sole source-write authority, whatever `## Owner` says.* Verify stays coder. Review stays reviewer. Process-review stays coder (ADR-038 `:39-45`, `0223`'s row). Close stays producer (ADR-033).
- **This is ADR-038's own principle applied to the one step it left to the table** — not a re-raise. It is what `:101-103` already records as practice, and what `0222`'s worklog called "step-role-follows-skill" the day ADR-038 was written.
- **Plan:** two readings — (i) Plan = coder via `/fkit-plan-task` always (skill-fixed, ADR-038-literal; `0167` was owner-ruled "coder plans, architect builds", `0200` report `:287`); (ii) Plan = the Build role, by hand when it does not own `/fkit-plan-task` (today's ruling on 0270). For a decision task the plan *is* the analysis, which is design judgment the coder should not author. Recommended (ii); owner call (ND3).
- **Owner beats mid-work:** satisfied by the existing `NEEDS-DECISION` relay; no new gate.
- **Wiki rows are the one class this rule does not rescue** — Build = spawned wiki is lawful (`0249`), but Process-review's Step 6 has no lawful fix-applier: the coder may not write the vault, and routing fixes to the wiki is the `0249` shape ADR-038 forbids. Hence the narrowed skip (candidate 2) for exactly that class. *(A candidate 5 — keep coder Process-review, mark every vault fix `blocked — ADR-005`, and add a conditional "Apply (wiki)" sub-step — is viable but adds a pipeline step for ~5% of rows whose natural QA is the wiki's own lint. Rejected for now; named as the re-raise trigger.)*
- **Cost (follow-on brief, not this task):**
  - `claude/skills/fkit-sprint-ship-loop/SKILL.md`: Overview `:29-30` ("coder to plan/build/verify"), Plan/Build cells `:122-123` become a reasoned rule (as `0223` did for `:126`), step 1 predicate + report, +1 exit-table row.
  - `claude/agents/fkit-architect.md` and `claude/agents/fkit-producer.md`: a sprint-loop Build carve-out mirroring `fkit-coder.md:60-72` (spawned role may run its own deliverable skill under the declared-approval marker; returns `NEEDS-DECISION` for owner beats). Today the architect's "don't run a half-blind version in a consult" rule (`fkit-architect.md:64-65`) is displaced per run by a named ruling (ADR-037 §3) — a standing carve-out makes it a rule. `fkit-wiki.md` untouched.
  - `claude/skills-for-role.sh`: **untouched.** `test/skill-ownership-hook.test.js`: **untouched.** No four-mirror ripple.
  - `0225`: its parser must accept a rule-cell in Plan/Build (a skill→owner expression, not a literal) — a design-note widening; its assertion becomes *stronger* (every named Build skill's owner must own it). `0224`: mechanism unchanged; its **oracle** for the `Role:` line must be this rule, not the literal cell — widened by reference. `0223`: done, untouched.
  - ADR-038: **not amended.** A separate dated correction note on `:88-91` ("Build runs no skill") in 0205's shape. `sprint-6.md:288-292` becomes historical.
  - Prevention: none — prose rule + `0224` detection, the same accepted tradeoff as ADR-038 `:71-78`.
- **ADR-038:** companion, citing `:39`, `:88-91`, `:101-103`, `:116`. **Accept.**

## 4. Recommendation

**Candidate 4 + narrowed candidate 2, in one ADR:** the loop's Build (and Plan) role follows the skill the deliverable runs, with the coder as the default for skill-less deliverables; Review / Process-review / Close stay fixed exactly as ADR-038 and ADR-033 have them; rows whose deliverable is a vault write are detected at **step 1** from the dashboard's Owner column, skipped, and reported as `out-of-scope-for-this-driver` with their route named. Discovery point: step 1 for the hard wall; the plan gate (worker returns `BLOCKED`) as the backstop.

Why: it is the only candidate consistent with all seven non-coder rows the loop has already shipped *and* with ADR-005/ADR-038 as written; it costs no ownership change and no test rewrite; it gives `0224` a correct oracle before `0224` ships; and it turns four improvised staffings into one rule. Main tradeoff: prose-enforced, like ADR-038 — and it asks the owner to accept standing Build carve-outs for the architect and producer agent prompts, a widening of what a spawned non-coder may write (design docs, briefs) under the declared-approval marker.

**ADR title (number pending the four-way sweep at write time — highest on disk today is `adr-043`; do not pre-allocate):**
`ADR-044: The ship-loop's Build role follows the deliverable's skill; vault-deliverable rows are skipped at step 1 and reported`
slug: `adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md`

Unverified this pass (stated, not guessed): how Sprint 5's two non-excluded architect rows were staffed; whether the `0184`-adjacent blank-Owner brief is a formatting quirk or a real missing field.

## 5. Build step (what the architect writes)

Write the ADR via `/fkit-record-decision` into `ai-agents/knowledge-base/decisions/` (number from the sweep at write time), status **accepted** — the owner signed off on the decision at this plan gate, 2026-08-27, via `AskUserQuestion` (ND1), and the ADR records that date and channel per the repo's precedent (brief item 5). The ADR carries: the question (§1), the ADR-038 discharge (§2), the candidates with costs (§3), the decision (§4 as ruled), the consequences (the follow-ons in ND6, to be filed by the producer after acceptance — not scoped here), the re-raise trigger (candidate 5), and today's ruling as corroborating practice (ND7). ADR-038 is **not** amended. No skill, agent, test, board, or brief edit in this task. `worklog.md` records the sweep result, the rulings, and a decision log (`none` if none).

## 6. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-27 (verbatim option labels)
- **Route:** "Drive it here with the architect (Recommended)" — 0270's Plan and Build run with `fkit-architect` as the worker; Review, Process-review and Close stay as the loop fixes them.
- **ND1 (the decision):** "A: Build role follows the deliverable's skill + vault rows skipped (Recommended)" — candidate 4 + narrowed candidate 2.
- **ND2 (skip predicate):** "Owner column = fkit-wiki + Plan-worker BLOCKED backstop (Recommended)"; a blank `## Owner` is not-eligible-until-repaired, never treated as coder.
- **ND3 (Plan role for non-coder rows):** "The Build role, by hand (Recommended)".
- **ND4 (skipped-row handling):** "Report only, route named (Recommended)".
- **ND5 (standing carve-outs):** "Yes, both (Recommended)" — `fkit-architect.md` and `fkit-producer.md` gain a sprint-loop Build carve-out mirroring `fkit-coder.md:60-72` (in the implementation follow-on, not this task).
- **ND6 (follow-ons):** "File all three after the ADR is accepted (Recommended)" — (i) implementation brief for loop/agent text (coder); (ii) dated correction note on ADR-038 `:88-91` (architect); (iii) notes on 0224 (oracle = the new rule) and 0225 (rule-cell parser). Producer files them once 0270 closes.
- **ND7 (provenance):** "Yes (Recommended)" — today's ruling recorded in the ADR as corroborating practice alongside 0241/0222/0178/0218.
