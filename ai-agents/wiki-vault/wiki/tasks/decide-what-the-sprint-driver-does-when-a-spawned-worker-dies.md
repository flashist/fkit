# Decide what the sprint driver does when a spawned worker dies

**Source**: `ai-agents/tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-05
**Sprint/Tag**: Sprint 2 · ID `0167` · owner `fkit-architect`
**Report**: `ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md`

## Goal
`/fkit-sprint-ship-loop`'s exit table enumerates **nine** terminal states, and **every one of them is triggered by a worker that *returned*** — a verdict, a `NEEDS-DECISION`, a failed close. **There is no row for a worker that returned nothing at all.** The gap had fired twice in two consecutive driver runs; both recoveries worked and **neither was procedural**. Rule what the driver must do, and whether the fix is one table row or the missing resume doctrine.

## Key Changes

### The four rulings

1. **Q1 — what the driver must do.** **Read disk first — it is the only oracle — then classify into *three* states, not two:** `nothing landed` / `a complete unit landed` / `a partial unit landed`. **Complete** → the driver enumerates landed-vs-outstanding itself, then resumes, re-spawns or defers. **Partial** → **stop and put it to the owner.** **Nothing landed** → the driver **does not decide alone**; it reports and puts the choice to the owner.
2. **Q2 — may a resumed worker self-report?** **No, and that is the rule, not an accident.** The driver establishes landed-vs-outstanding **from disk itself** and *tells* the resumed worker. **Ground A is decisive and is not an analogy:** a worker that died mid-turn **cannot in principle know** whether its last write landed — the failure sits exactly on the boundary between *wrote* and *reported wrote*. Ground B (the sibling loop's *"does NOT trust its own memory"*) is an ***a fortiori*, not an entailment**, and the report says so.
3. **Q3 — one row, and the status is state-dependent.** Row trigger: **`Worker terminated abnormally — remainder deferred`**, narrower than *"a worker died"* — it fires only where the driver **stops driving that task this run**. Status values **already in the vocabulary, nothing minted**: `🚧 Blocked — <reason>` when something landed; reset `🔄 In progress` → `🔲 Backlog` when nothing did.
4. **Q4 — the row *and* the missing durable-state section, shipped together.** A row whose action cell says *"classify the disk state and act per §Resume doctrine"* is incoherent if that section does not exist. **No broader ADR needed.**

### The two rulings outside the four questions
- ***"fkit has no crash-recovery anywhere"* does NOT stand as written.** False as a blanket — `fkit-task-ship-loop` carries a named, ADR-020-backed re-derive-on-resume fail-safe. True in the narrower sense **R6** meant: no `lease`, `heartbeat` or stale-task reclamation exists anywhere. **R6's owner-ruled acceptance survives on the corrected rationale — sound, not mistaken.** ⚠️ *"A rationale is not a scope."*
- **R6's reading: `adjacent uncovered failure`** — not a re-raise, not swallowed. **Therefore no ADR was required and none was written.** A different actor (worker vs driver session), a different harm (**zero** stranded tasks across all three instances), and R6's stated re-raise trigger unmet.

### ⛔ Instance 3 — the failure happened DURING this task's own ship, and it is the finding
A `@fkit-coder` Process-review worker died mid-step when the owner's network dropped. **It had already written the R1/R3–R10 corrections into the report; its hand-off never arrived.** The driver read disk, concluded ***"nothing landed"*** — **false; this was a *partial* landing, the branch Q1 routes to the owner** — and re-spawned instead.

> **The rule this yields: *"read disk first"* must say WHICH disk.** All four of the driver's probes were real disk reads and **none could have detected the landing**:
> - **(a) It enumerated the *task folder*. The deliverable was not in it** — it lives under `knowledge-base/reports/`. **The paths to enumerate are the ones the spawn instruction told the worker to write** — which the driver knows, because it wrote that instruction.
> - **(b) `git status` is NOT a landing detector for an untracked path** — it reads `??` before the write and `??` after. Compare **content**, never tracking state.
> - **(c) A structural probe cannot answer a content question** — the ledger's `## Coder response` heading was present as an **empty scaffold** and counted as present.
>
> ⚠️ **And "partial" must be defined over the UNIT, not the file.** Instance 3 left **no half-written file**; what it left torn was the **multi-file unit**. **A driver checking only *"is any file half-written?"* answers NO on a torn unit and routes it to the wrong branch.** The operational test — *list the instructed paths → discharged? → for a mixed result ask the one separating question: **is what is on disk usable and safe to build on with the missing paths never arriving?*** — is written as a binding constraint on the follow-up.

### The evidence standing, stated per half rather than as one number
| What is evidenced | Standing |
|---|---|
| A landing occurred and was **file-coherent** | two instances |
| A landing was **PARTIAL** — the branch Q1 routes to the owner | **one**, corroborated for the landed half only |
| A driver **misclassified** — that a partial landing was on disk when it acted | **one, corroborated on disk** — the strongest corroboration in the report |
| A driver misclassified — **the belief itself**, and which probes it ran | **one, DRIVER-REPORTED testimony.** No artifact records a belief, and the re-spawn is consistent with either |
| The **CAUSE** of any death | **zero** — all three are testimony |
| The driver's **PROCESS** — that it read disk *before* forming a belief | **zero** |

⚠️ **The direction of the evidence matters:** instance 3 supports the partial branch by showing what a driver does wrong **without** it — weaker than a case where the branch was taken and worked. **That case has still not occurred.**

## Outcome

### The brief's own evidence had decayed, and one claim in it was FALSE
The brief asserted *"`fkit-sprint-ship-loop/SKILL.md` has no such section at all."* **The file carries `## Durable artifacts`.** The **deeper** claim survives and is what the report answers: **the sprint loop anchors its artifacts but has no resume doctrine over them** — a narrower and more interesting gap. Eight of ten cited coordinates had shifted; **the two that held are both into a frozen ledger under `done/`** — exactly the split [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] predicts.

⚠️ **Two artifacts in this task's own chain decayed between authorship and execution** — the brief on a horizon of **days**, the approved plan on a horizon of **hours**. Produced without looking for it.

### ⛔ A standing rule this report shipped under, owner-ruled
**No coordinate, count or delta measured against the report itself is ever printed in it — stable properties only.** The report is filed inside the directory it measures and kept growing while being reviewed, so **every self-figure is stale the moment the next edit lands**. Round 1's repairs minted two fresh instances in the replacement text; **four rounds of point-repair did not eliminate the class.** Quotations of *other* documents' figures are not covered.

### The cause taxonomy widened, and no ruling moved
**Instance 3's cause was client-side** (the owner's network), where 1 and 2 were **API-side** (529). **Identical from the driver's seat.** Every ruling is conditioned on **the disk state after the death, never on the cause** — a rule keyed to cause would be unusable. Recording the second class still matters: *"the API is healthy, so no worker can have died"* is **false**.

### ⛔ Partially superseded the day after it shipped
**§4's status ruling for the *partial* case was overturned 2026-08-05 by owner ruling (disposition D3):** the task stays **`🔄 In progress` while the owner is asked — a pause is not an exit, so no terminal status is written.** [[tasks/add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop]] (`0208`) shipped that divergence and the owner ruled it correct; a **dated correction note** was appended to §4, **append-only, no line above edited**. The `nothing landed` branch, the row's necessity and its narrowed trigger are **unchanged**. ⚠️ **A cost recorded rather than smoothed:** parking a paused task at `🔄 In progress` **widens the exposure** of the `0111` R6 stranding residual, because §1 of the loop skips `🔄 In progress` on every later run.

### ⚠️ Its §5 ruling was DEFERRED, not satisfied
§5 ruled the exit row and a `## Resume doctrine` section **must ship together** and **explicitly rejected row-alone**. **The owner ruled row-alone anyway** (OQ-1 → A, 2026-08-05), directing the doctrine half be filed separately — it is task **`0228`**, unstarted. **Follow-up 1 was never filed as a brief at all** until then; it existed only inside this report §10.

### Follow-ups named (six), and the retry exclusion held
`SendMessage` — instance 1's whole recovery — **is named in no governing fkit document**; whether it is a sanctioned worker-resume mechanism is follow-up 2, undecided. ⛔ **No retry count, limit or backoff appears anywhere in the output.** The exit table's existing `Blocked — hand-off didn't land` row **does** carry a bounded one-shot re-spawn; it is quoted, **attributed and explicitly declined** — one role, one step, a failed spawn rather than a dead worker, and a verified-empty precondition. **Who decides how many times a dead worker is re-spawned is named for the owner, not answered.**

## Related
- [[tasks/add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop]] — task `0208`, the row this ruling asked for — shipped **alone**, **superseding §4's partial-case status**
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task `0111`, whose review **R6** accepted the stranding residual this ruling adjudicates
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop's autonomy and consent model
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the durable-artifact authority the resume doctrine operates over
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — why the doctrine may **not** say *"trust the driver's enumeration and skip your fail-safe"*: that is an instruction into skill-rule territory
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202`, which is what makes an orphaned `plan.md` possible at all
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, whose citation form binds this report and whose **row 1** it found unresolved
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, which cites this task's **attested coder routing** of its own Process-review step
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why every open question was returned to the driver, not asked
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the close route this task's own ship followed
- [[systems/testing-and-verification]] — the `/usr/bin/grep` discipline this report is written under, and the vault entry instance 2 landed
- [[tasks/enforce-task-status-vocabulary]] — the closed status set this ruling drew **both** its values from by reading it rather than inventing one; §4's `🔄 In progress` pause turns on it
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
