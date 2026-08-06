# Plan — task 0200: Decide whether Process-review is always `@fkit-coder`, or the architect gains the skill

> **Provenance.** Produced by a spawned `@fkit-coder` running `/fkit-plan-task` under
> `fkit-sprint-ship-loop` (live `fkit lead` driver session), and **approved by the owner via
> `AskUserQuestion` on 2026-08-05**. Copied here verbatim by the driver at approval, before the Build
> spawn (ADR-020).
>
> **Owner's rulings at approval:**
> - **Q-A → option (1): NO ADR under this task.** If the architect concludes the ruling is
>   architectural, it **returns `NEEDS-DECISION`**; the ADR becomes a producer follow-up.
> - **Q-B → option (1):** priority ordering is **correctness of the routing rule > detection latency >
>   maintenance cost > implementation cheapness**.
> - **Q-C → leave it.** The `0200`/`0195` merit contention is **recorded as an observation in the
>   report**; no row moves, nothing is renumbered, `0200` keeps its P178 append rank (ADR-035).
>
> ⚠️ **Honest limit** (loop honesty clause): approval leaves no artifact of its own (ADR-021). This
> file pins *which bytes were carried*, not *which were approved*.

**Task type:** investigation + ruling. **No implementation.** Deliverable is a document.
**Routing (owner-ruled this run):** coder plans (this document) → **`@fkit-architect` builds** → `@fkit-coder` verifies → `@fkit-reviewer` reviews → **`@fkit-coder` process-reviews** → `@fkit-producer` closes.

---

## 0. Coordinate re-verification — what held, what shifted

The brief warned it decays. All five facts plus the driver's three testimony claims were re-verified. **Six shifts to report.**

### Held exactly as briefed

| Fact | Evidence, at plan time |
|---|---|
| `fkit-process-stateful-review` in the `coder)` arm | `claude/skills-for-role.sh:52` |
| **Absent** from the `architect)` arm | `claude/skills-for-role.sh:53`; the string occurs on **line 52 only** in that whole file |
| Loop row names `@fkit-coder` and says *"apply … **method**"* | `claude/skills/fkit-sprint-ship-loop/SKILL.md:124` — both tokens intact |
| Hook deny path + identity resolution | `claude/skill-ownership-hook.sh:135` (deny), `:119-126` (`agent_type` → role, any depth) |
| `0195`'s disclosed denial + hand-application + non-reading | `ai-agents/tasks/done/0195-…/worklog.md:189-191`, `:250-251`, `:321-325` |
| ADR-037 does **not** decide this axis | `adr-037-…md:33` — *"Not decided here (the invocation axis): which skill a role may run at all."* |
| ADR-012 cites the stale home | `adr-012-…md:56-58, :75, :172, :175` all say `claude/fkit-claude.sh` |
| Four mirrors, and the task-70 incident | `claude/skills-for-role.sh:12-24` (header) |

### Shifted — report these in the deliverable

1. **`claude/skills/fkit-sprint-ship-loop/SKILL.md`: 296 → 309 lines, +13/−0, uncommitted** (task `0191`). **But the Process-review row is byte-identical to HEAD** — `git diff` touches no line containing "Process review". The 13 lines landed in the **Hard rules** block. The row's ADR-019/ADR-032 autonomy and worklog-logging text predates this run. The brief's elided quote (`…`) is still accurate for the part it quotes.
2. **⚠️ The brief mis-transcribes the hook's code line.** Brief `:46` writes `deny "role '$skill_name' does not own skill …"`. The actual line is:
   ```sh
   *) deny "role '$role' does not own skill '$skill_name'" ;;
   ```
   (`claude/skill-ownership-hook.sh:135`). The brief's **next** line gives the correct live string, so no conclusion is affected — but the deliverable must quote the file, not the brief.
3. **⚠️ Verification step 7 is already unsatisfiable as written.** It requires `git status --porcelain` to show *only* the deliverable and this task's folder. The tree today already carries, from other tasks: `M claude/fkit-claude-init.sh`, `M claude/scaffold/universal-rules.md`, `M claude/skills/fkit-sprint-ship-loop/SKILL.md`, `M CLAUDE.md`, `M AGENTS.md`, `M ai-agents/sprints/*`, four new `0218`–`0221` backlog folders, and the untracked `0167`/`0190`/`0191` artifacts. **Restate it as a baseline diff** (step 4 below).
4. **`test/skill-ownership-sites.mjs` is still absent** (`/bin/ls test/` — 16 files, not among them). ADR-036's registry has no tooling yet, so an option-(b) registry assessment has nothing to run against. It defers to `0189` (open).
5. **`0201` exists and is the audit's landing zone** (`ai-agents/tasks/backlog/0201-append-dated-correction-notes-to-0143s-and-0158s-closed-review-ledgers`, `🔲 Backlog`). Its brief records that a read-only coder audit **already established the artifacts cannot distinguish** the two readings of the `0143` defect. The brief's routing is live and correct — **cite it, do nothing further**. `0201` also carries: *"⚠️ if `0200` rules option (b) this owner field does NOT auto-follow — revisit it"* — so this ruling has a named downstream consumer.
6. **The `0191`-shipped driver-side clause may already partially cover this defect, and the brief predates it.** `SKILL.md` Hard rules now read: *"Never instruct into the territory of a rule in the skill a worker will run without naming the owner ruling you relay"* (ADR-037 §3). `/fkit-process-stateful-review`'s own ⛔ banner says *"Execute it only if you are the coder… Any other role: do not execute this."* Spawning `@fkit-architect` and telling it to apply that skill's method **is** instructing into that rule's territory, with no owner ruling named. **This is a material new input.** Whether it reaches the *role-selection column* (as opposed to instruction content) is genuinely arguable — that is the architect's call.

### The driver's three testimony claims — verified, with one correction

- **Claim 1 (the driver asked the owner rather than re-deriving the substitution): supported.** `ai-agents/tasks/done/0167-…/worklog.md:3-6` records *"The owner ruled for this run that the coder plans and the architect builds."* The driver's internal reasoning is not verifiable from the tree; the artifact is consistent with it.
- **Claim 2: partly wrong, and the correction makes it stronger.** The *"coder plans / architect builds"* split ran **twice**, not four times — `0167` and `0200`. **`0190` and `0191` were coder-built**: both `worklog.md:3` read `**Role:** fkit-coder … Build worker`. What ran **four** times is **Process-review = `@fkit-coder`**, with **zero denials found** (`/usr/bin/grep -rn "does not own skill"` over all four folders returned hits only inside `0200/brief.md` — none in `0167`/`0190`/`0191`). The load-bearing case is **`0167`**: an **architect-authored deliverable** (a report), whose review was processed by a **coder**, with the ledger written and no denial. That is the direct empirical counter-example to the premise *"the role must follow the deliverable's author."*
- **Claim 3 (detection): supported, and a second, sharper data point was found.** **Role attribution is missing from 2 of the 4 Process-review rounds this session.** `0167`'s worklog has exactly one `**Role:**` line (`:3`, the Build worker); its Process-review sections at `:204` and `:434` carry **none**. `0190:239` and `0191:121` both do. **So the exact ledger defect the brief flags in `0158` recurred today, in coder-written worklogs.** A misroute leaves no trace in the record more often than not.

---

## 1. What the architect builds, and where

**Primary artifact — one file, new:**

```
ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md
```

- Written with **`/fkit-evaluate-approach`**, which mandates `reports/YYYY-MM-DD-eval-<topic-slug>.md` (`claude/skills/fkit-evaluate-approach/SKILL.md:67`).
- ⚠️ **Naming-precedent divergence, flagged not resolved:** `0167`'s deliverable shipped as `2026-08-04-sprint-driver-response-to-a-dead-worker.md` — **no `eval-` prefix**. The skill's rule is the rule; use `eval-`. Note the divergence as an observation; **do not file it** (out of scope).

**⛔ The ADR is NOT written under this task. OWNER-RULED (Q-A option 1).** Brief `:167` permits it *"only if the ruling itself is the ADR."* **If the architect concludes the ruling is architectural, it returns `NEEDS-DECISION` rather than writing the ADR**, and the ADR becomes a producer follow-up.

**Required section shape** (verification step 4 demands each of the five be answerable from one clearly-labelled section):

| § | Content |
|---|---|
| §0 | Coordinate re-verification — the table above, re-measured by the architect first-hand, **not inherited from this plan** |
| §1 | Options: **(a)**, **(b)**, **(c) neither** — per option: what changes on disk, ADR required y/n, maintenance cost, **how it fails** |
| §2 | **Q1** — deliverable's author, or structurally the coder? *One sentence a future driver can act on.* |
| §3 | **Q2** — is *"apply the **method**"* right wording, or a licence for hand-application? If it stays, why. |
| §4 | **Q3** — if (b): does it weaken **sole-source-write**, and what stops the argument reaching every authoring role? |
| §5 | **Q4** — what makes the next prose-vs-hook disagreement visible in **fewer than three tasks**. *A detection answer.* |
| §6 | **Q5** — ADR needed? If yes, **name it as a producer follow-up** (do not write it — owner-ruled). |
| §7 | **Recommendation** — one option, and for it **every file that would change** (all four mirrors enumerated if (b)) |
| §8 | **Follow-up list for the producer** — one line each, naming the file or decision it touches |
| §9 | Caveats, unverifiable claims, ADR-036/`0189` deferral, **and the `0200`/`0195` merit-contention observation (owner-ruled Q-C: record, do not re-rank)** |

**⛔ The architect must not rule §2–§6 from this plan's evidence packet alone** — it re-measures. This packet is a starting point, not authority.

---

## 2. Evidence packet handed to the architect (all re-verifiable)

- The seven "held" rows and six "shifted" rows in §0 above, with exact `path:line`.
- **`0167` as the counter-example** — architect-authored deliverable, coder-processed review, no denial: `ai-agents/tasks/done/0167-…/worklog.md:3-6`, `:204`, `:434`; `review.md:248-258`.
- **Detection data point** — role omitted from `0167`'s two Process-review sections; present in `0190:239`, `0191:121`.
- **Candidate detection mechanisms** (to assess, **not** pre-decided): (i) require a `**Role:**` line per worklog round, making a misroute self-evident in the record; (ii) a driver-side pre-spawn check that the step's role owns the step's skill, reading `skills_for_role()`; (iii) a test asserting each loop table row's role owns the skill that row names; (iv) rely on the `0191` driver-side ADR-037 clause already shipped (shift 6). **(iii) is testable under ADR-014 and would have caught this at authoring time, before task one** — but it is a follow-up, not this task.
- **Precedent for (a)** — ADR-033's structural routing: `adr-033-…md:45`, `:94`, `:131` (*"hook-structural at any spawn depth"*).
- **Cost of (b)** — `claude/skills-for-role.sh:12-24`: the four mirrors, and the task-70 incident where an incomplete checklist shipped a false statement into every consuming project. **Cost the mirrors regardless of the recommendation**; enumerate every file only if (b) wins.
- **ADR-036 / `0189`** — registry module absent; say so in the deliverable rather than waiting (`brief:210-213`).

---

## 3. Sequencing

| # | Step | Role | Output |
|---|---|---|---|
| 0 | Driver writes `plan.md` verbatim at approval | driver | `<task-folder>/plan.md` |
| 1 | **Build** — re-verify coordinates first-hand, then write the report | **`@fkit-architect`** | the report + `worklog.md` |
| 2 | **Verify** — run the suite + the brief's 7 verification steps (as amended) | `@fkit-coder` | pass/fail |
| 3 | **Review** | `@fkit-reviewer` | `review.md` §Reviewer findings |
| 4 | **Process review** | `@fkit-coder` | `review.md` §Coder response |
| 5 | **Close** | `@fkit-producer` | `✅ Done (agent-closed — not owner-verified)` |

**Step-1 spawn prompt must carry** the declared-approval marker (plan verbatim, owner-approved statement, caller = `fkit-sprint-ship-loop`), the ⛔ scope list, and — see edge case E1 — the **owner-ruled priority ordering** that `/fkit-evaluate-approach` Step 1 would otherwise ask for.

**⚠️ Step 4 is `@fkit-coder`, not the architect.** Routing this task's own Process-review to the architect would reproduce the very defect under investigation, and would be denied by the hook. Non-negotiable.

---

## 4. Verification — the brief's 7 steps, one amended

Steps 1–6 stand as written. **Step 7 is restated** (it is unsatisfiable today, see shift 3):

> **7′.** Snapshot `git status --porcelain > baseline.txt` **before** the Build spawn. After Build, the diff against that baseline must show **only**: the new report under `ai-agents/knowledge-base/reports/`, and files inside `ai-agents/tasks/backlog/0200-*/`. **No file under `claude/`, `ai-agents/tasks/done/0158-*`, `done/0143-*`, `done/0195-*`, or `ai-agents/wiki-vault/` may appear as newly changed.**

**Test run** (ADR-014, `node --test`, zero devDeps). This task ships no code, so tests are a **regression guard, not proof of the deliverable** — say so in the worklog. Relevant: `test/skill-frontmatter.test.js`, `test/skill-ownership-hook.test.js`, `test/rules-block-budget.test.js`, `test/task-id-uniqueness.test.js`. (`test/adr-number-uniqueness.test.js` is not implicated — no ADR is authorized.)

---

## 5. Edge cases and plausible failure modes

- **E1 — `/fkit-evaluate-approach` Step 1 asks the owner about priorities; a spawn has no owner channel (ADR-021).** `0167` hit exactly this (`worklog.md:185`). **Mitigation:** the spawn prompt pre-supplies the **owner-ruled** ordering — **correctness of the routing rule > detection latency > maintenance cost > implementation cheapness** — and the architect **records the non-execution** rather than silently skipping it.
- **E2 — ADR-number collision if the ADR path is taken.** Moot under Q-A option 1 (no ADR authorized). If a follow-up later files one: highest present is **037**, so **038** — but `/fkit-record-decision:47-55` documents the ADR-029 incident where a number was claimed *everywhere except* `decisions/`. Any such follow-up must grep `decisions/`, `reports/`, the sprint boards **and** `wiki-vault/` before allocating.
- **E3 — concurrent workers move coordinates mid-build.** Three-plus workers are editing this tree; `0218`–`0221` appeared today. **Mitigation:** every citation is `file + heading + quoted phrase`, **never a bare `:NNN` into a mutable file** (the durable-citation convention). Re-measure immediately before writing §0.
- **E4 — the architect recommends (b) and under-costs the mirrors.** This is the exact task-70 failure. **Mitigation:** §7 must enumerate all four mirrors by path *even to reject (b)*, and state that `claude/scaffold/CLAUDE.md` ships into every consuming project.
- **E5 — the report answers four of five questions.** Silence on any one fails the task (`brief:157`). **Mitigation:** §2–§6 are literally numbered to the five questions; Verify checks each heading exists and is non-empty.
- **E6 — scope creep into `claude/`.** The ruling will feel one edit away from done. **Mitigation:** ⛔ list in the spawn prompt + verification 7′.
- **E7 — the architect pre-decides toward (a) because it is cheap.** The brief warns cheapness is an input, not the decision (`brief:110-112`), and the **owner-ruled ordering puts cheapness last**. **Mitigation:** §1 must assess **(c) neither** with the same rigour as (a) and (b).
- **E8 — shift 6 gets treated as "already fixed, nothing to do."** The `0191` clause is real but its reach over *role selection* is arguable, and it is **still uncommitted working-tree text**. **Mitigation:** §5 must state explicitly whether it does or does not close the gap, and on what reading.
- **E9 — the report re-litigates the `0143` fact defect.** Routed to `0201`; `0201`'s brief already records the audit finding that the artifacts cannot distinguish the readings. **Mitigation:** cite `0201`, assert nothing further.

---

## 6. Assumptions

- The `0191` loop edits stay uncommitted in the working tree during this task (they are the current live text; the deliverable cites file + phrase, so a commit does not invalidate it).
- Reading `done/0195-*` is permitted — the ⛔ forbids *edits*, and `brief:177` calls it *"this task's primary evidence."*
- `0189`/`0194` remain open; no ADR-036 registry tooling arrives mid-task.

---

## 7. Open questions — all three answered by the owner at approval

- **Q-A — may the architect write the ADR under this task?** → **Owner ruled (1): NO.** Return `NEEDS-DECISION`; the ADR becomes a producer follow-up. Keeps the change surface fixed at one report; matches `0167`'s precedent.
- **Q-B — priority ordering for `/fkit-evaluate-approach` Step 1** → **Owner ruled (1):** correctness of the routing rule > detection latency > maintenance cost > implementation cheapness.
- **Q-C — the `0200`/`0195` merit contention** (`brief:227-238`; `sprint-2.md:3880-3887`) → **Owner ruled: leave it.** `0195` is now in `done/`, which likely mooted it. **Record the observation in the report §9; no row moves, nothing is renumbered, `0200` keeps its P178 append rank** (ADR-035).

---

## 8. Planned change surface

- **New:** `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md`
- **New:** `ai-agents/tasks/backlog/0200-…/worklog.md`, `review.md` (loop-standard)
- **Driver-written:** `ai-agents/tasks/backlog/0200-…/plan.md`
- ⛔ **No ADR** (owner-ruled).
- **Zero files under `claude/`, `done/0158-*`, `done/0143-*`, `done/0195-*`, `wiki-vault/`.**
