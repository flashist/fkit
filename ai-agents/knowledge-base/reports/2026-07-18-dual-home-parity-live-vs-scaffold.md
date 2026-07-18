# Dual-home parity — keeping the dogfood `ai-agents/` and `claude/scaffold/ai-agents/` in step

- **Date:** 2026-07-18
- **Author:** fkit-architect
- **Task:** [`investigate-dual-home-parity-live-vs-scaffold.md`](../../tasks/backlog/investigate-dual-home-parity-live-vs-scaffold.md) (Sprint 2, #49)
- **Status:** open — awaiting owner review. **Investigation only. No implementation shipped, no implementation brief authorized, nothing in `ai-agents/wiki-vault/` touched.**
- **Evidence:** produced by comparing the actual trees (`diff -rq ai-agents/ claude/scaffold/ai-agents/` and per-file diffs, 2026-07-18), per [`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md) — not recalled.

---

## Summary

**The re-raise trigger has fired, decisively.** The deferred content-drift decision (Sprint 2 addendum) set the trigger at *"a third fkit-authored file starts drifting."* The tree comparison finds **five fkit-authored `conventions/*` files drifted simultaneously** — the live copies were edited during development and the scaffold copies were never brought in step. This is well past three.

**But the seam this task is about is not the same seam that trigger governs.** That trigger is about *launch-time convergence into consuming projects* (which cannot fix content drift by invariant — ADR-015). **This task is about keeping the two copies inside *this repo* in step at development time** — a smaller, tractable problem that needs **no consuming-project mechanism at all.** The recommendation is a **process gate + a light mechanical check**, not the deferred hash-manifest.

**Recommended combination:** **process layer first (a `/fkit-task-brief` scoping check + a conventions entry), then a minimal mechanical parity test** under ADR-014 — in that order. Rationale and the honest cost of the exception mechanism below.

---

## 1. The dual-home enumeration — ground truth (evidence-based)

Comparing `ai-agents/` (live/dogfood) against `claude/scaffold/ai-agents/` (the template shipped at init). Classification: **IDENTICAL** · **ACCEPTABLE DIVERGENCE** (deliberate, with reason) · **DRIFTED-BY-ACCIDENT** (should match, doesn't).

| Path | State | Class | Note |
|---|---|---|---|
| `README.md` (ai-agents root) | differ (+17/−46) | **ACCEPTABLE** | The known, owner-ratified drift (Sprint 2 addendum) — deliberately different in both directions. Live describes the dogfood instance; scaffold onboards a new project. |
| `knowledge-base/PROJECT.md` | differ | **ACCEPTABLE** | Live = fkit's real project brief; scaffold = the `# <Project name>` template placeholder. Divergence is the whole point — the scaffold copy is a *form*, the live copy is *filled in*. |
| `knowledge-base/architecture.md` | live-only | **ACCEPTABLE** | Project-specific; written per project during initiation (`/fkit-survey-project`). The scaffold intentionally ships none. |
| `knowledge-base/conventions/README.md` | differ (+12/−12) | **DRIFTED** | Live gained ADR-013 cross-refs, "six valid task statuses", refined enforcement wording; scaffold is the older text. **Ironically, the scaffold copy still contains the line "a convention has exactly one home; a second copy of a rule is how the two drift apart" — while being the drifted second copy.** |
| `knowledge-base/conventions/evidence-before-assertion.md` | differ (+32/−18) | **DRIFTED** | Substantive live edits not reflected in scaffold. |
| `knowledge-base/conventions/one-skill-one-output.md` | differ (+35/−20) | **DRIFTED** | Task 47 wrote it live; task 48 back-filled the scaffold — yet they **still differ**, i.e. task 48 did not achieve byte-parity (or live moved again after). Evidence the point-fix approach does not hold. |
| `knowledge-base/conventions/status-report-format.md` | differ (+6/−8) | **DRIFTED** | Smaller, but real. |
| `knowledge-base/conventions/task-status-vocabulary.md` | differ (+18/−10) | **DRIFTED** | Real drift. |
| `knowledge-base/{decisions,history,reports,incidents}/` | live has content; scaffold has only `.gitkeep` | **ACCEPTABLE** | These accumulate project-specific records. Scaffold ships **empty scaffolded folders** by design (the folders themselves are the fkit-authored artifact; their contents are the project's). |
| `plans/`, `worklogs/` | live-only | **ACCEPTABLE** | Per-task runtime artifacts (ADR-020); never scaffolded. |

**The canonical-pair drift is concentrated in exactly one place: `knowledge-base/conventions/`.** Those five files are **fkit-authored process law** meant to ship identically to every project. Everything else that differs is *supposed* to differ.

**This narrows the whole problem:** the "must-match" set is small and well-bounded — essentially **`knowledge-base/conventions/*`** plus whatever future fkit-authored, ships-verbatim artifact lands under `ai-agents/`. That is what makes a mechanical check feasible rather than a boil-the-ocean tree compare.

## 2. The must-match manifest question

Three ways to define parity, and how each avoids becoming its own second source of drift:

- **(a) Explicit manifest** — a checked-in list of canonical pairs + accepted-divergence exceptions. **Precise, but it is itself a file that drifts** (add a convention, forget the manifest line → false green). Its own drift is invisible.
- **(b) Directory convention** — "everything under `knowledge-base/conventions/` must byte-match its scaffold twin; `PROJECT.md`, `architecture.md`, `README.md`, `decisions/`, `reports/`, `history/`, `incidents/`, `plans/`, `worklogs/` are excluded by rule." **No per-file list to maintain** — a new convention file is *automatically* in-scope the moment it is created. This is the lowest-drift option because the rule is structural, not enumerated.
- **(c) Exclusion list** — the inverse of (b): compare everything, subtract named exceptions. Larger blast radius; every acceptable divergence (README, PROJECT.md, the `.gitkeep`-vs-content folders) must be enumerated and kept current, so it drifts the same way (a) does.

**Recommendation: (b), directory convention, scoped to `conventions/`.** The must-match set *is* a directory today; making the directory the unit means new files join the contract for free and there is no second list to rot. The small accepted-divergence set (README, PROJECT.md) is handled by the check comparing only the `conventions/` subtree, not by an exception file. If the must-match set ever grows beyond `conventions/`, **add a directory to the rule, not a file to a manifest.**

## 3. The process layer (advisory — same claim level as the shared-instructions work)

Two pieces, both **prose asking agents to behave** — delivery is structural (the text ships), compliance is advisory (nothing enforces it), exactly as ADR-016 §6 / tasks 30–32 framed it. Named so no one later mistakes it for a guarantee.

1. **A mandatory scoping check in `/fkit-task-brief`.** When a task touches an **fkit-authored artifact that also ships in the scaffold** (today: anything under `knowledge-base/conventions/`, and the root context files), the brief **must** either scope the scaffold counterpart in the same task or **state explicitly why it is omitted.** This is the cause-level fix: the four historical instances (KB folders, architecture pointer, conventions README, one-skill-one-output) each shipped a live change with no scaffold counterpart *because nothing at brief-writing time forced the question.* This forces it. **Spec:** a checklist item in `fkit-task-brief`'s procedure + a one-line "Dual-home" field in the brief template when the touched path is in the must-match set. *(Owner: fkit-coder — a skill edit — if approved.)*
2. **A `knowledge-base/conventions/` entry recording the dual-home rule** — "fkit-authored artifacts that ship in the scaffold have two homes; a change to one must land in both, or the divergence must be recorded as accepted." This is the durable statement of the rule the `/fkit-task-brief` check enforces. *(Owner: fkit-architect — a conventions entry — if approved; and note: this entry itself must ship to both homes, its own first test.)*

## 4. The mechanical layer (structural — a parity test under ADR-014)

**What it compares:** for each file under `ai-agents/knowledge-base/conventions/`, assert a byte-identical twin exists at `claude/scaffold/ai-agents/knowledge-base/conventions/` (and vice-versa — no orphan on either side). **Not** a full-tree compare — scoped to the must-match directory, so acceptable divergences (README, PROJECT.md, the content folders) are simply out of scope, no exception needed.

**Under ADR-014's constraints:** a plain `node --test` file (`test/dual-home-parity.test.js`), zero devDeps — it reads both directories with `fs` and compares. Fits ADR-014 Decisions 1 (test infra never ships), 4 (zero devDeps) cleanly. **No conflict.**

**How accepted drift is excepted — and its honest cost:** with the **directory-scoped** design (option b), the only "exception" needed is the scope boundary itself (compare `conventions/`, nothing else) — there is **no per-file exception list**, so the mechanism has **no second source of drift.** This is the payoff of scoping to a directory rather than the whole tree. *The cost the brief asked me to state:* if a genuine reason ever arises to let one `conventions/` file diverge (e.g. a scaffold-only note), option (b) has **no place to record that exception** — you would either move the file out of `conventions/` or add the first real exception entry, at which point the exception list is born and starts to drift. Today that cost is **zero** (no such case exists); it is a latent cost, disclosed.

**Where it runs:** `npm test` (it is fast — two directory reads). **What red means for a developer:** "you changed a convention in one home and not the other — copy it across, or if the divergence is deliberate, that is now a decision (move the file or record the exception)." A clear, actionable red.

## 5. The re-raise ruling — has the "third drifting file" trigger fired?

**YES — unambiguously.** Evidence: **five** `conventions/*` files are drifted right now (§1), on top of the four historical shipped instances the brief lists. The deferred content-drift decision's trigger (*"a third fkit-authored file starts drifting"*) is met several times over.

**The important distinction, stated so the owner rules cleanly:** the trigger firing means *the phenomenon the deferred decision predicted is real and recurring.* It does **not** automatically mean the **deferred hash-manifest** (the consuming-project convergence mechanism) must now be built — because **that mechanism solves a different seam** (mutating already-initialized consuming projects, which ADR-015 established launch-time convergence cannot do for content). **This repo's dev-time drift is fixable without it** (§3–4). So:

- **The trigger has fired** → the owner should consciously decide whether to **reopen the deferred content-drift / hash-manifest decision** for the *consuming-project* seam. **That reopening is the owner's call**, and this report recommends it be a *separate* decision from adopting §3–4.
- **This task's fix does not wait on that reopening** — the dev-time parity gate (§3–4) is worth doing regardless, and is far cheaper.

## 6. Recommendation — one combination, with its main tradeoff

**Do the process layer first, then the mechanical layer — both, in that order; directory-scoped to `conventions/`.**

- **Process first** because it is the **cause-level** fix (the drift enters at brief-writing time; forcing the scaffold question there stops new drift at the source) and needs no code.
- **Mechanical second** as the **backstop** — advisory prose is not enough alone (tasks 30–32's lesson: compliance is advisory), so a zero-devDep `node --test` parity check turns "someone forgot" from an invisible drift into a red build.
- **Scope both to the `conventions/` directory** (§2 option b) so there is no manifest/exception file to become the next drifting artifact.

**The main tradeoff:** the mechanical check enforces **byte-parity** on `conventions/`, which is strict — the first time a genuinely scaffold-specific tweak is wanted in a convention, the check will (correctly) go red and force an explicit decision. That strictness is the feature (no silent drift) and the cost (no silent *intended* divergence either). Given every current `conventions/` divergence is **accidental**, strictness is the right default now; the escape hatch (move the file, or start an exception list) is disclosed in §4 and is the owner's to open if it ever bites.

**Before this ships, the existing five drifted `conventions/*` files must be reconciled** (pick the canonical version of each — almost certainly the live one, since it is the edited one — and copy it to the scaffold), or the parity test is red from birth. That reconciliation is itself a **producer-scoped brief (owner: fkit-coder/architect)**, not authorized here.

---

## For the owner — decisions, and the tasks each spawns

1. **Adopt the process layer?** → spawns a `/fkit-task-brief` skill edit (fkit-coder) + a `conventions/` dual-home entry (fkit-architect).
2. **Adopt the mechanical parity test?** → spawns a `test/dual-home-parity.test.js` brief (fkit-coder), **preceded by** a reconciliation brief that byte-aligns the five drifted `conventions/*` files.
3. **Reopen the deferred content-drift / hash-manifest decision for the consuming-project seam?** The trigger has fired (§5). This is a **separate owner decision** from 1–2; it is not required to make 1–2 worthwhile. If reopened, it is an ADR-level call (owner + architect).
4. **Recommended:** an **adversarial pass** (Codex) on this report before you act — the task-20/29 precedent, where rev-1 recommendations did not survive Codex intact. Say the word and I'll route it to the adversarial reviewer.

None of the above is authorized by this brief. This report is findings only.

## Related

- [ADR-015](../decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md) — launch-time convergence is additive and cannot fix content drift in consuming projects (why the deferred hash-manifest exists, and why it is a *different* seam from this one).
- [ADR-014](../decisions/adr-014-how-fkit-tests-itself.md) — the mechanical check's constraints (zero devDeps, `node --test`, repo root).
- [ADR-016](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) §6 / tasks 30–32 — "delivery structural, compliance advisory" — the claim level of the §3 process layer.
- Sprint 2 addendum (tasks 25–28) — the deferred content-drift decision and its "third drifting file" re-raise trigger.
- Evidence: `diff -rq ai-agents/ claude/scaffold/ai-agents/` (2026-07-18); per-file diffs of `knowledge-base/conventions/*`.
- The four prior point-fixes: `fix-scaffold-knowledge-base-folders`, `bake-architecture-pointer-into-scaffold-templates`, `align-conventions-readme-enforcement-item-live-vs-scaffold`, task 47/48 (`one-skill-one-output`).
