# Plan — 0473: Build the opt-in plan-review step (off by default)

## 0. What approving this plan means
- The owner's approval of this plan is the "specific word" the brief requires.
- Approval covers: the design below, the shipped classification wording in §3.2, the file list in §6, and the ADR in §5.
- Nothing is built before approval. No commit, ever. The owner commits.

## 1. Goal
- Add an **optional** agent review of each plan before the owner's plan gate.
- It runs only in a `/fkit-sprint-ship-loop` run that the owner starts with plan review on.
- Every other path behaves exactly as today. The owner's gate is untouched, and he still approves last.
- 0474 (the trial) needs: the switch, and a per-task record carrying the data its trial log asks for.

## 2. Decisions this plan makes (each one approved as part of the plan)

| # | Decision | Why |
|---|---|---|
| D1 | **The switch is a run-level argument flag: `/fkit-sprint-ship-loop [<sprint-plan>] --plan-review`.** Absent means off. It is read once at run start and applies to every task planned in that run. It cannot be flipped mid-run; the owner restarts the run. When the owner says "run the sprint loop with plan review on", `fkit-lead` passes the flag. It **never adds it unasked** and never carries it to another run. | Owner Q2 (2026-10-02): the switch works per sprint-loop run. It lives in the run, not in the task store, so ADR-052's conversion never sees it. **One-skill-one-output check:** the flag changes *what the plan step does*, not *how the same output looks*. It passes the convention's litmus test and is not an output variant. The plan says so openly so the owner rules on it here. |
| D2 | **No per-task brief field.** (Pending Q1; Rec A.) `fkit coder` sessions, `/fkit-task-ship-loop` and plain `/fkit-plan-task` stay exactly as today. Neither `fkit-task-brief` nor `dashboard.sh` is touched. | The owner's trial runs only through sprint-loop runs (Q2). A field would be a second switch to combine with the run switch, and the session path has an untested interaction with plan mode (§8 R3). The ADR-052 survival question also disappears. |
| D3 | **The coder runs the approvals and the Codex pass.** It does this inside the single plan-step spawn, all within the `fkit-plan-task` procedure. Chain: lead (hop 0) → coder (hop 1) → architect / producer / adversarial-reviewer (hop 2). | The plan stays in **one** context through every revision round. A driver-run design would re-spawn coders and re-carry the plan between rounds, which is the 0162 fidelity hazard again. One procedure in one file is also easier to test. Hop 2 is within ADR-010's limit, and this chain already worked in practice: ADR-053 was drafted in a hop-2 consult (`fkit-lead` → `fkit-coder` → `fkit-architect`). I confirmed in this spawn that a spawned `fkit-coder` holds the Agent tool. The cost: approvers at hop 2 cannot consult anyone, so they return open questions instead. |
| D4 | **The review record goes in a new reserved file, `<task-folder>/plan-review.md`, written by the driver** at the owner's decision, **approve or reject**. It holds the worker's returned record block, copied, plus the driver's lines: the time the plan was presented to the owner, and his decision with the selected option quoted, its date and channel. The file is append-only, with one `## Attempt N — <date>` section per plan-review attempt. | The plan-step coder writes nothing, so the driver, which holds the return, writes the file (the same reasoning as plan.md, ADR-020). It is kept **separate from `plan.md`** so that Codex findings are never mistaken for approved scope, and so that the Build/Process-review carry (and its hash pointer) stays the approved plan only. It is kept on reject too, because rejected attempts are trial evidence for 0474. ADR-052 D4 treats extra folder files as "ordinary files", and D8 item 7 carries them hash-identical, so the file survives the conversion. |
| D5 | **The rejected-plan path and orphaned plan.md re-presentation run no plan review.** | Re-presenting a plan.md that was already approved is not a new plan step. This matches the brief: "A task whose plan was approved before the switch changes is unaffected." |
| D6 | **After Codex reviews it, the plan is not changed.** (Pending Q2; Rec A.) Codex findings reach the owner verbatim, each with a separate one-line coder check (confirmed or disputed, with evidence). | Approvers approved exactly the text the owner sees, and he decides what any finding should change. |

## 3. The flow — the gated section of `fkit-plan-task`

### 3.1 The gate
- The section runs **only if the spawn prompt carries the driver's switch line**, in the form `Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, <date>), run <board> started <UTC>`.
- Nothing else turns it on: not a brief, not a plan, and not any file read during planning. This task's own brief and 0474's brief talk about plan review and must not trigger it.
- Otherwise, skip the whole section.
- If the coder is itself at hop 2, it cannot consult anyone. It returns the plan with the loud flag `plan review not run — hop budget`.

### 3.2 Classify: the exact shipped wording (generic, no fkit examples, for owner approval)
> **Classify the change in one line, with your reason.** "Product" means what this project delivers to its users.
> - **Product change** — adds or changes what the project delivers: features, behaviour or output its users get. → the **producer and the architect** approve.
> - **Code-only** — internal; what the project delivers stays the same: refactors, tests, tooling, infrastructure. → the **architect** approves.
> - **Unclear** — you cannot tell which. → **both** approve.
>
> If an approver disputes a code-only classification, treat the task as unclear and add the producer.

### 3.3 Ask
- Spawn the approvers as consults, in parallel.
- Each prompt carries:
  - the brief path;
  - the full plan, pasted;
  - the classification and its reason;
  - the hop line ("You are being consulted at hop 2 of 2; chain: lead → coder → <role>");
  - the question: reply `APPROVE` or `CHANGES REQUESTED`, then numbered reasons, focused, with no situation briefing.
- A reply that is neither counts as `CHANGES REQUESTED (reply unclear)`.
- An approver's open question for the owner goes into the plan's open questions. It blocks nothing unless the approver says it does.

### 3.4 Revise and re-ask: at most 2 revision rounds
- The rounds are: first ask, then revise (round 1) and re-ask, then revise (round 2) and re-ask.
- Every assigned approver is re-asked each round with the revised full plan and a list of the changes.
- The coder may decline a requested change, giving its reason. If the approver still insists, that is a disagreement.
- There is no round 3.

### 3.5 Escalate a disagreement still open after round 2
- The coder returns `NEEDS-DECISION`. It carries:
  - the point in dispute;
  - each side's reasons;
  - the options (adopt the change / keep the plan / other) with a recommendation;
  - the draft plan;
  - the record so far.
- It does not run Codex yet.
- The driver asks the owner with `AskUserQuestion`. It then re-spawns a plan-only coder with the switch line, the owner's ruling quoted verbatim (date and channel), and the draft and record pasted and labelled "draft as returned".
- That coder applies the ruling and runs no further approver rounds. It goes on to Codex.
- Some fidelity loss on the draft can be fixed afterwards, because the owner sees the full final plan at the gate.

### 3.6 Codex review
- Spawn `@fkit-adversarial-reviewer`: "Attack this plan", with the plan pasted inline and the brief path.
- It returns findings only. Its fallback banner, if any, is relayed **first, verbatim**.
- The coder does not assign a coverage state; it only relays the reviewer's mode line.

### 3.7 Return
- The plan, then one block between `===PLAN-REVIEW RECORD BEGIN===` and `===PLAN-REVIEW RECORD END===`. It contains:
  - the switch line as received;
  - UTC timestamps from `date -u`: plan drafted, each ask and return, Codex start and end, record returned;
  - the classification and its reason;
  - each round: each approver's verdict and reasons;
  - the changes made per round: what changed, why, and which request it answers;
  - any disagreement and the owner's ruling;
  - the Codex mode line and its findings verbatim, with the banner first;
  - the per-finding coder check (if Q2 = A);
  - problems: a spawn that was denied or failed, a hop limit hit, a malformed reply.
- **Incomplete review:** if an approver or the Codex spawn could not run, return the plan anyway, flagged loudly at the top as `plan review incomplete: <what>`. Never present it as a reviewed plan.
- **The coder writes nothing.** The approvers write nothing. The adversarial reviewer writes only its gitignored `.fkit/tmp/` prompt.

## 4. What the driver does (gated section of `fkit-sprint-ship-loop`)
- **Run start:** set the switch from `--plan-review`. If it is on, the opening report says "Plan review: ON for this run" (Q3 decides what an off run says).
- **Plan step:** add the switch line to the plan-only spawn prompt. That line names the owner's ruling (ADR-037 driver-side clause). The Plan row of the step table is **unchanged**; all new text sits in one gated block below the table.
- **Plan gate presentation:**
  1. Banners first: Codex fallback, "plan review incomplete", and any owner-settled disagreement.
  2. The plan, as today.
  3. Three attachments: who approved and how they classified it; what changed during review and why; Codex's findings with the coder checks.
  4. Approve or reject, as today. The owner approves last.
- **At the owner's decision:** write plan.md exactly as today (on approve only), and write or append `plan-review.md` (D4) on approve and on reject.
- **Roll-up:** "Plan review: on" per run when it was on, plus the coverage mode of each task's Codex plan pass. A plan pass with `claude-fallback — NOT model-diverse` is flagged loudly.
- **NEEDS-DECISION after round 2:** relay it, then re-spawn as in §3.5.
- **Stop table:** no new rows. A failed plan-step spawn is already covered by "Worker spawn didn't land". An incomplete review goes to the owner at the gate, flagged.

## 5. ADR: recorded by `@fkit-architect`, spawned by the driver after approval and before Build
- The driver carries the approved plan verbatim and the owner's approval quoted. The architect runs `/fkit-record-decision` and records ADR-056 (next free number; it checks at record time), status `accepted` on the strength of the owner's plan approval, as with ADR-055 and 0475.
- **Content:**
  - the classification rule (§3.2 wording);
  - the run switch, default off, and why it lives in the run and not the store;
  - session paths unchanged (per Q1);
  - the flow, the 2-round cap, owner settles, Codex last, owner approves last;
  - **the plan gate is still the one human checkpoint** (ADR-019/ADR-032 unchanged). Plan review adds agent consults before the gate; the only new owner touchpoint is the round-2 settlement;
  - the new `plan-review.md` artifact (extends ADR-020's set);
  - hop design D3;
  - **trust, not proof:** the switch and "write nothing" are prose in spawn prompts, the same accepted cost as the ADR-031 honesty clause;
  - the trial and its decision through 0474; making it the default needs a new owner ruling;
  - "Re-raise only if": 0474's verdict, an ADR-052 phase-5 change to task-folder files, a change to the hop limit, or a change to the Codex runtime.
- **Dated pointer notes** in ADR-019, ADR-020 and ADR-032 (the architect writes them, as ADR-055 did).
- The Build worker receives the ADR's filename from the driver to link it. Build does not start without it.

## 6. Files (Build), in order

Step 0, before any edit:
- Snapshot every target file into the scratchpad (`tar` of the listed paths; new files are diffed against `/dev/null`). All later diffs come from this snapshot, never from `git diff`, because the working tree holds other Sprint-10 tasks' uncommitted edits to `fkit-coder.md`, `fkit-lead.md`, `fkit-plan-task`, both ship loops and `test/`.
- Also snapshot `CLAUDE.md`, `AGENTS.md` and `claude/scaffold/CLAUDE.md` / `AGENTS.md` to prove the rules block is untouched.
- Run a baseline `npm test` and record which tests already fail.

| # | File (canonical `claude/` sources only) | Change |
|---|---|---|
| 1 | `claude/skills/fkit-plan-task/SKILL.md` | A new `## Plan review — only when the switch is on` section, wrapped in `<!-- plan-review:begin -->` / `<!-- plan-review:end -->`, holding §3 in full. **The Workflow list and every other line are unchanged.** The section says it runs between Workflow steps 6 and 7. |
| 2 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` | **Argument** paragraph: optional `--plan-review`, default off, and the litmus-test sentence. A gated block (same markers) holding §4. Roll-up/opening sentence for the on case. The Plan row and the "Rules that make this honor the ADRs" text are untouched (the anchors of `spawned-write-marker.test.js`). |
| 3 | `claude/agents/fkit-lead.md` | One conductor-remit bullet: pass `--plan-review` only when the owner asks, never carry it across runs, and only the sprint loop has it. |
| 4 | `claude/agents/fkit-coder.md` | One bullet under *Consulting a teammate*: `fkit-adversarial-reviewer`, **only** for the plan-review Codex pass (fkit-plan-task §Plan review). One clause on the `fkit-plan-task` procedures line. The §Mode carve-out is untouched (see §9 on the "known gap"). |
| 5 | `claude/agents/fkit-producer.md` | Under *B) Spawned as a consult*: the plan-approval reply shape. First line `APPROVE` or `CHANGES REQUESTED`, then numbered reasons. Judge scope and requirements: does the plan deliver what the brief asks, with no gaps and no creep. Say first if the classification looks wrong. No briefing. No consulting at hop 2. Generic wording. |
| 6 | `claude/agents/fkit-architect.md` | The same shape, judging design and structural consistency, conflicts with recorded decisions, and feasibility. It points at its existing "unanticipated architecture decision → owner" caveat. |
| 7 | `claude/skills/fkit-adversarial-review/SKILL.md` | The argument accepts **a plan** (pasted text) as well as a diff/scope. For a plan, the prompt inlines it, marked as a plan. A short hunt list for plans: claims that contradict the code (cite code `file:line`), missed edge cases and failure paths, missing or wrong tests, sequencing errors, security, regressions, and gaps or creep against the brief. Locations: a plan section plus code `file:line`, and **coordination docs by heading plus a quoted phrase, never path:line**. The fallback banner and output contract are unchanged. |
| 8 | `claude/agents/fkit-adversarial-reviewer.md` | The description and "What you receive" add "or a plan". The leaf role (no Agent tool) is unchanged. |
| 9 | `ai-agents/tasks/README.md` **and** `claude/scaffold/ai-agents/tasks/README.md` (dual-homed, byte-identical) | Add `plan-review.md  optional — the opt-in plan-review record (ADR-056)` to the tree and to the reserved-names sentence. |
| 10 | `ai-agents/README.md` and `claude/scaffold/ai-agents/README.md` (a parity exception; edit each) | The `tasks/` row's optional-files list gains `plan-review.md`. |
| 11 | `claude/structure-manifest.tsv` | `npm run generate:manifest`, because of the scaffold edits. First re-check that `git status` shows no *other* task's edits under `claude/scaffold/`; the generator hashes the on-disk scaffold. If there are any, return `NEEDS-DECISION`. |
| 12 | `test/coordination-citation-policy.test.js` | Widen the cited-target class `(?:brief\|plan\|worklog\|review)\.md` to include `plan-review`, with an arm showing that `…/plan-review.md:12` reds. This is a deliberate widening, not a loosening. |
| 13 | `test/plan-review-switch.test.js` (new; reads `claude/` only, so it needs no `test:docs` entry) | In the `spawned-write-marker.test.js` style (throwing extractors and in-file control/mutation arms). **(1)** fkit-plan-task: exactly one marker pair; the block opens with the gate sentence ("Plan review: on", "otherwise skip"); **no** plan-review vocabulary outside it. **(2)** Sprint loop: one marker pair; outside it the vocabulary appears only in an allowlist of exact sentences (the argument and roll-up lines); the Plan-row phrase "run `/fkit-plan-task`; **write no source**; return the plan + open questions" is present and unchanged. **(3)** The argument says default off and absent = off. **(4)** The classification sub-block contains none of `fkit`, `skill`, `hook`, `ADR`, `sprint` (generic rule). **(5)** Producer and architect carry `APPROVE` / `CHANGES REQUESTED`. **(6)** The adversarial skill accepts a plan, and its fallback banner text is unchanged. **(7)** `fkit-task-ship-loop` contains no plan-review vocabulary (the session path is unchanged; under Q1 = A). **(8)** The lead bullet says it never adds the flag unasked. Control arms: a vocabulary line moved outside the markers fails, and a missing end marker throws. |
| 14 | `CHANGELOG.md` | An Unreleased line: "Opt-in plan review for `/fkit-sprint-ship-loop` runs (`--plan-review`, off by default): agents approve the plan and Codex reviews it before you do." |

**Not touched, by design:**
- `fkit-task-ship-loop` (under Q1 = A)
- `fkit-task-brief` and `dashboard.sh` (no field)
- `skills-for-role.sh` (no new skill; approvers run none)
- the hooks
- `fkit-claude-init.sh` and the rules block (`RULES_MAX`)
- `structure-spec.md` (it does not list task-folder files)
- `README.md`
- `bin/fkit-board.mjs`'s plan/review/worklog labels (repo-local; a possible follow-up)

## 7. Verification

**Order:** baseline `npm test` → build → the checks below → snapshot diff → walk-through → worklog.

| Check | Why |
|---|---|
| `node --test test/plan-review-switch.test.js` | the new guard: off is unchanged, everything is gated, the wording is generic |
| `node --test test/coordination-citation-policy.test.js` | the widened class and its new arm |
| `node --test test/spawned-write-marker.test.js test/carry-check-hook.test.js test/skill-frontmatter.test.js test/skill-ownership-hook.test.js test/launcher-contract.test.js` | anchors and frontmatter in the touched agent/skill files |
| `node --test test/reference-integrity.test.js test/adr-number-uniqueness.test.js` | brief step 8 (the new ADR and its links) |
| `node --test test/rules-block-budget.test.js` + `cmp` of the rules-block region against the snapshot | brief step 9: byte-unchanged |
| `node --test test/structure-manifest.test.js test/dual-home-parity.test.js test/structure-*.test.js` | scaffold edits and the manifest |
| **`npm test` (full, ~12 min)** | Required by CONTRIBUTING's table (prove-red names `skills/fkit-sprint-ship-loop/SKILL.md` and the `claude/scaffold` tree; `test/` changed) and by brief step 10. Results are compared against the baseline; a red from another task's edit is named as such, never hidden. |

- **Skipped:** nothing. `test:docs` is covered by the full suite.

**Snapshot diff.** For each touched file: `diff -u snapshot/<f> <f>`. With the gated blocks removed, the remainder must equal only the allowlisted sentences. This is recorded in the worklog and proves "off = today" (brief verification 1).

**Paper walk-through**, recorded in the worklog against the canonical text. It covers brief verification steps 1–7:
- off run;
- on + code-only;
- on + product;
- on + unclear;
- forced round-2 disagreement (NEEDS-DECISION, no round 3);
- Codex unavailable (banner first at the gate);
- the switch through the lead, with the next run off;
- hops ≤ 2 and no ADR-018 denial (every approver runs only its own skills or none).

**Live smoke test of the topology.** The Build worker (hop 1, chain lead → coder) spawns one architect and one adversarial reviewer at hop 2 on a toy plan, with the new instructions pasted into the prompts. It confirms that the nested spawns land, the ADR-018 hook denies nothing, Codex accepts a plan input, and the reply shapes parse.
- ⚠️ **Limit:** the `.claude/` copies refresh only at the next `fkit` launch, so this smoke test cannot exercise the *installed* text. Running `fkit-claude-init.sh .` mid-sprint is ruled out: it rewrites the rules block in `CLAUDE.md`, which holds other tasks' uncommitted edits.
- **The installed-text proof is the owner's first `--plan-review` run (0474).** That is stated as unverified in the worklog.

## 8. Risks and edge cases
- **R1 — The switch leaks:** a brief or plan *about* plan review turns it on. Only the driver's spawn-prompt line counts (test arm 1 pins the gate sentence). This is prose-enforced, so trust, not proof.
- **R2 — A citation in a verbatim relay:** if Codex cites a brief as `path:line`, the citation-policy guard reds on an open `plan-review.md` (the same class as open `review.md`). The plan-input prompt forbids it. The driver cannot edit a verbatim record, so a red is reported to the owner, not patched.
- **R3 — Plan mode in the session path:** only matters if Q1 = B or C. Under plan mode, Write is refused, and it is unverified whether a spawned adversarial reviewer can write `.fkit/tmp/`. That needs its own check, which is why Rec A leaves the session path out.
- **R4 — Carry-check hook:** a plan that quotes a *real* `plan: …/plan.md  blob <hex>` pointer line gates the approver spawn and could be denied. Rare; the denial is recorded under the record's problems. Plans should not quote live pointers.
- **R5 — Context growth:** up to 3 asks × 2 approvers plus Codex, all in one coder context. Approver replies are kept focused. The plan step gets longer (Codex takes several minutes); the timestamps measure it for 0474.
- **R6 — Fidelity of the record:** the driver copies the record from the return message (conversation state), and plan text reaches Codex by pasting. Both are LLM restatements. The impact is limited because the owner sees and approves the actual plan. This is stated in the ADR and is not hidden.
- **R7 — An approver that can't be reached, or Codex absent:** the plan is presented flagged as incomplete or not model-diverse, never as reviewed.
- **R8 — Overlap with ADR-052 phase 5** (0453, 0450, 0451, 0457): whichever lands second carries the other's change forward. Test 13 reds if a rewrite drops the gated block.
- **R9 — Two sprint runs at once** writing `.fkit/tmp/adversarial-prompt.md`: this collision already exists today and is not made worse.
- **R10 — Owner wants to flip the switch mid-run:** the lead says it applies from the next run. Restart to change it.

## 9. Known gap (the brief asks)
- The `fkit-coder.md` carve-out wording gap is **already closed by ADR-055 / 0475**: the carve-out now accepts `fkit-sprint-ship-loop` or `fkit-lead`. That edit is in the working tree, uncommitted.
- This feature does not need it either way: the plan step writes no source.

## 10. What 0474 gets
- **The switch:** `--plan-review`, set per run.
- **A per-task `plan-review.md`** carrying everything 0474's trial log asks for:
  - run identity (board + start time);
  - timestamps, from plan drafted to presented to the owner;
  - round count;
  - classification and reason;
  - which findings changed the plan, and Codex's findings;
  - problems (hop limit hit, a skill refused, a round-2 escalation, Codex unavailable);
  - the owner's decision.
- **The roll-up line** per run.
- ⚠️ **After 0473 lands, the owner must relaunch `fkit lead`** so the `.claude/` copies refresh. Otherwise the run uses the old text.

## 11. Sequencing after approval
1. The driver writes plan.md.
2. The driver spawns the architect to write the ADR (§5).
3. Build (§6, Step 0 first).
4. Verify (§7).
5. Stateful review.
6. Process review.
7. Producer close.

## 12. Deliberately not done
- Making plan review the default (0474, then a new owner ruling).
- The session path (Q1).
- The repo-local board labels.
- A wiki re-sync: `fkit-wiki` should re-sync after landing for the new ADR and the changed skills. Recommended, not done here.
