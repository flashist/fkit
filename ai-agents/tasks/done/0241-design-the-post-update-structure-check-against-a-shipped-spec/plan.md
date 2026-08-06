# Plan — Task 0241: Design the post-update structure check against a shipped structure-spec `.md` (the sanctioned ADR-015 re-raise)

## Summary

- Design-only unit. Deliverable: **one new file** — `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md`, authored via `/fkit-design-spec` by a spawned `@fkit-architect` (step-role-follows-skill).
- Nothing else changes: no code, no scaffold, no structure-spec `.md` itself, no ADR-015 edit, no wiki write, no commit, no task filing.
- Three owner decisions are **returned, not resolved**: (1) the ADR-015 re-raise licence + how the record updates; (2) the consent model; (4) the trigger, if any candidate needs per-project state. Question (3) — `CLAUDE.md`/`AGENTS.md` — is already ruled **IN scope** and is recorded, not re-proposed.
- Evidence base verified this planning pass: brief (in full, incl. all four dated rulings and both dated corrections), ADR-015 (in full, incl. Amendment, Rejected alternatives, both re-raise triggers), `claude/fkit-claude-init.sh` (in full), the launcher's update/init flow, the `/fkit-design-spec` shape, and the scaffold inventory.

## Grounding facts the design must build on (verified this pass)

1. **Init is create-if-absent, stateless, every-launch.** `converge_ai_agents` in `claude/fkit-claude-init.sh` never writes to an existing path; its header comment states the invariant, calls content drift "deliberate and owner-accepted," and warns that a notion of project version "has become the migration mechanism that was rejected on the merits."
2. **`fkit update` never writes to a consuming project** — it refreshes only the install share; the launch-time init is the only project-facing hook. Self-update is notify-only, sha-keyed: the install share's `.version` file carries `version=` and `sha=` fields, and two installs can share a `VERSION` with different content (ADR-015 Context §4).
3. **The scaffold today is 29 paths** (verified inventory: `ai-agents/` tree incl. `knowledge-base/` with 7 conventions + PROJECT.md, `tasks/`, `sprints/`, `wiki-vault/` skeleton, plus root `CLAUDE.md`, `AGENTS.md`, `universal-rules.md`). This is what a structure-spec `.md` would need to enumerate — and who regenerates it when the scaffold changes is a real maintenance question.
4. **fkit already owns a mutable region inside `CLAUDE.md`/`AGENTS.md`** — the marker-delimited rules block (`merge_rules`), rewritten on every launch, capped at 4352 B, everything outside the markers untouchable. So "stale `CLAUDE.md`" splits into two different problems: the fkit-managed block (already self-healing) and the owner-side body created once from the scaffold (drifts forever). The design must use this existing seam, not reinvent it.
5. **A tracked intent-file precedent exists**: `ai-agents/.fkit-keep-out` — deliberately tracked (not `.fkit/`), "records INTENT, not progress, so it is not a cursor by the back door." Directly relevant pattern for any consent/trigger state the design considers.
6. **A consent precedent exists**: the Omnigent orphan cleanup — the one destructive operation in fkit, announce-only **by a named owner ruling that set no precedent** ("any future destructive operation goes back to the owner"). The design must treat that clause as binding: the repair path cannot inherit announce-only.
7. **ADR-015's two re-raise triggers**: trigger 1 (a proposal to move/rename/delete inside `ai-agents/`) **fires on this task** — the brief says so and the ADR's text confirms it fires "on the proposal, not the implementation." Trigger 2 (a **third** drifting fkit-authored file) has a determinate answer the design must establish empirically (see Phase A step 6).

## Phase A — evidence the architect gathers before writing (read-only)

1. The brief in full — §Context authority rulings 1–4 verbatim, both dated corrections, the Notes' open-questions register.
2. ADR-015 in full — the invariant, the safety bar (every REQUIRED row constrains any new project-facing mechanism too), Decision §5 (content drift deferred with eyes open), the Amendment (symlink grounds), Rejected alternatives (all four, especially the hash manifest "deferred, not rejected" and the migration agent "worst option"), both re-raise triggers, and the underlying report `ai-agents/knowledge-base/reports/2026-07-14-migration-mechanism.md` (rev 2) where the ADR points at it.
3. ADR-005 (wiki-vault write exclusivity) — the constraint carried under every design branch.
4. Code: `claude/fkit-claude-init.sh` (invariant block, `converge_ai_agents`, `.fkit-keep-out`, `.gitkeep` rule, `merge_rules`, orphan cleanup + its consent ruling, exit-3 status), `claude/fkit-claude.sh` (self-update notify-only; `fkit update` → install share only; init on every launch; the `.version` / `.latest` / `.update-check` stamps — note these are **install-share** state, not project state, so a trigger keyed on them does not reopen the rejected project cursor), `install.sh` (sha-keyed install at `main` HEAD).
5. Scaffold inventory (the 29 paths) + the rules-block machinery (`universal-rules.md`, `RULES_MAX`, marker recognition) — the raw material for the structure-spec's content scope and for the `CLAUDE.md`/`AGENTS.md` refresh mechanics.
6. **Trigger-2 status check**: enumerate scaffold-authored files that land in a consuming project and can drift (`ai-agents/README.md`, `ai-agents/tasks/README.md`, `knowledge-base/PROJECT.md`, the conventions, wiki-vault skeleton files, root `CLAUDE.md`/`AGENTS.md` bodies); diff this repo's copies against the scaffold to state, with evidence, whether a **third** fkit-authored file inside `ai-agents/` has drifted. (The verification step 4 requires the design to state this either way.)

## Phase B — the design document (section order, mapped to the `/fkit-design-spec` shape)

1. **Goal & context.** All four owner rulings **verbatim**, dated 2026-08-06, channel named (`AskUserQuestion`, live `fkit lead` session). The lead's gloss reproduced and **marked as gloss**; where gloss and ruling could diverge, the verbatim ruling governs.
2. **Constraints & scope.** ADR-015's invariant **quoted**; the out-of-scope list carried; the safety bar acknowledged as binding on any new mechanism; ADR-005 named as a hard constraint.
3. **The re-raise — its own standalone section.** States that ADR-015 `Re-raise only if` trigger 1 fires on this proposal, that the owner's ruling 2 *is* the proposal (made without the ADR record in front of them), and frames the licence question as an **explicit owner decision point**: what licence, if any, the repair path gets, and how the record updates (amendment vs supersession via `/fkit-record-decision` vs scoped exception) — **as a proposal with a recommendation, decided by nobody but the owner**.
4. **The structure-spec `.md`.** Content scope (which paths/files the installed version requires — grounded in the Phase A inventory); its **home** (install share vs scaffold vs elsewhere — explicitly analyzing how a project-local copy would itself go stale under create-if-absent, i.e. the spec must not fall into the trap it exists to fix); how it tracks the **sha-keyed** distribution (VERSION alone is insufficient — ADR-015 Context §4); who/what maintains it when the scaffold changes (generated vs hand-authored, and the drift risk of each).
5. **The trigger.** Weigh stateless candidates first: check-on-launch notice (piggybacking the existing every-launch hook), check-on-demand (an explicit verb/skill), pure spec-vs-disk comparison with no memory, and install-share-stamp-keyed "the share changed since last look" (share state, not project state). If any surviving candidate needs **per-project** state, the design must say **explicitly that it re-opens the rejected cursor mechanism** and put it to the owner — the `.fkit-keep-out` intent-not-progress pattern is the one shape that might thread this needle, and the design must argue whether it truly does or is a cursor by the back door.
6. **The check.** Which role/session runs it, when, with what read scope; and a subsection showing **ADR-005 preserved under every branch** — whatever the spec says `wiki-vault/` should contain, no role but `fkit-wiki` is ever instructed to write there.
7. **The repair path + consent model.** The genuinely new capability (additions are already handled — ADR-015 Decision §2). Design the **consent-gated, in-session, owner-present propose-then-apply** shape; distinguish it from the unattended launch path in the ADR-015 vocabulary ("non-determinism is fine in an agent that *proposes*"); name the forbidden shapes (silent auto-update; an unattended agent executing natural-language items) and show the design contains neither. **Weigh the content-identity hash manifest with/against the structure-spec `.md`** — citing ADR-015's Rejected-alternatives text, not re-deriving it — including the hybrid (manifest decides *touched-or-not*, spec decides *what should exist*); state the trigger-2 finding from Phase A.
8. **`CLAUDE.md`/`AGENTS.md` refresh — IN scope by ruling 4, recorded verbatim and dated.** Not re-opened as a proposal. The design covers mechanics: these files sit at the project root, **outside the tree ADR-015's invariant literally names** (stated, not implied — so the invariant does not formally bind them, but the same consent model is applied by the ruling's "one coherent capability" intent); the existing marker-block machinery already heals the fkit-managed region, so the design addresses the **owner-side body** — under the same propose-then-apply consent model as the `ai-agents/` repair.
9. **Alternatives / impact & risks / testing strategy** — per the skill shape; testing strategy is for the *future implementation* (how a builder would prove the check and repair path safe: fixture projects, drifted-file cases, symlink/keep-out interactions, the safety-bar rows), not tests written now.
10. **Open questions for the owner** — questions (1), (2), (4) from the brief's register, plus any new ones the design surfaces; each with options and a recommendation, none resolved agent-side.
11. **Proposed implementation split** — spec authoring, check, repair path, docs, with dependencies — **as a proposal in the report; nothing filed** (filing is the producer's act after owner review).

## Rules the executing architect must be given explicitly (seams where the skill and the brief diverge)

- **Citations:** `/fkit-design-spec` says "cite `path:line`"; the brief forbids `:NNN` citations in this task's artifacts (per the durable-citation convention, task 0160 / report 2026-08-01). **The brief wins** — cite by path + quoted anchor/section name.
- **No Step-4 stubs:** the skill permits interface stubs in the source tree; this task's ⛔ "no implementation, no scaffold/`claude/`/`test/` edits" forbids them. Zero stub files.
- **Step-2 owner interview:** the skill says "ask, don't assume" — but the architect runs as a spawn with no owner channel (ADR-021). Blocking questions go back to the driver for live relay; design-level decisions go in the report's owner-questions section. Never self-answered.
- **Do not write the structure-spec `.md` itself** — not even as an illustrative appendix; an example *excerpt* inside the report is acceptable, a usable spec file is not.
- No ADR-015 edit, no wiki-vault write, no commit, no task-file move.

## Verification (maps to the brief's 10 steps)

1. Report exists at `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md`.
2–3. Grep-check: both shape/board rulings verbatim + date + channel; ADR-015 invariant quoted; trigger-1 statement present; re-raise is a standalone section.
4. Hash-manifest weighed citing Rejected-alternatives; trigger-2 status stated with evidence.
5. Trigger section either needs no per-project state or loudly flags reopening the cursor as an owner decision.
6. Check role named; ADR-005 preservation shown per branch.
7. Ruling 4 recorded verbatim/dated; refresh designed under the same consent model; root-location-vs-invariant reasoning stated.
8. No silent auto-update or unattended NL-executing agent anywhere in the proposal.
9. Ends with owner questions + implementation split; no brief filed.
10. Change surface: exactly one new file under `ai-agents/knowledge-base/reports/`; nothing new under `claude/`, `test/`, or `ai-agents/wiki-vault/` **attributable to this unit** (note: the working tree already carries unrelated sprint changes, so verify the unit's delta, not the whole `git diff --stat`).

## Risks / failure modes accounted for

- **Scope creep into building**: the strongest temptation is drafting the actual structure-spec file "while we're here" — explicitly forbidden above.
- **Resolving the re-raise agent-side**: the design recommends; only the owner rules. The recommendation must be visibly labeled as such.
- **Under-weighing the hash manifest**: rediscovering it from scratch, or dismissing it without engaging its recorded strengths (stateless, clone-safe, no LLM), both fail verification step 4.
- **Treating `CLAUDE.md`/`AGENTS.md` as covered by the invariant** (they are outside its literal scope) or as fully stale (the managed block already self-heals) — both halves must be stated precisely.
- **Trigger design quietly growing a cursor**: any "remember we checked" state must be named as cursor-reopening and go to the owner.

---

## Approval record (written by the driver, fkit-sprint-ship-loop)

- **Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-06** — verbatim answer: **"Approve (Recommended)"** to the question "Approve the 0241 plan? (Prose-enforced gate. Build step will spawn @fkit-architect to author the design per step-role-follows-skill.)".
- No open plan-gate questions — the brief's owner questions (1) re-raise licence, (2) consent model, (4) trigger are the design's deliverable, returned to the owner by the report itself.
- Plan text above is the coder worker's returned plan, copied verbatim by the driver at approval, before the Build spawn (per the sprint-ship-loop's durable-artifacts rule).
