# Worklog — 0158, decide whether a spawn-time instruction may override a skill rule

- **Date:** 2026-08-02
- **Role:** fkit-architect, spawned by `fkit-sprint-ship-loop` under a declared-approval marker
- **Approval:** owner approved the plan via `AskUserQuestion` in the live driver session, 2026-08-02
  ("Approve as planned"), plus two additional rulings settling the plan's §6 open questions.

## What was produced

| File | What it is |
|---|---|
| `ai-agents/knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md` | **The ruling.** ADR-037, status `accepted`. |
| `ai-agents/tasks/backlog/0158-…/plan.md` | The approved plan as executed (ADR-020). |
| `ai-agents/tasks/backlog/0158-…/worklog.md` | This file (ADR-020). |

**Nothing else was written.** No skill, agent definition or source file was edited. No commit, no push.
No write to `ai-agents/wiki-vault/`. The task folder was not moved and no board status was touched.

> **⚠️ `git status` shows two modified files this worker did NOT touch** —
> `ai-agents/sprints/sprint-2.md` and this task's `brief.md`, each a one-line
> `🔲 Backlog` → `🔄 In progress` flip. Both were made by the driver **before this worker was spawned**;
> `git diff` confirms the change is only the status token. Recorded so the change surface is not
> misattributed at close, and so brief verification step 7 is graded against the right diff.

## Brief verification steps — status

| # | Step | Status |
|---|---|---|
| 1 | Artifact exists in `decisions/` or `conventions/`, report says which and why | **PASS** — ADR, in `decisions/`. Reason stated in the ADR's "ADR over convention page" framing and in `plan.md`: it generalizes ADR-032's declared-approval marker beyond one skill and one role, and adds a tier to the precedence ladder. That is a change to the authority model, not a restatement of an implication. |
| 2 | All five questions answered explicitly | **PASS** — `## Decision` clauses 1–5, one per question, each with a stated answer. |
| 3 | The 2026-07-27 instance adjudicated by name | **PASS** — **FORBIDDEN as executed.** Verdict plus the two-independent-grounds note distinguishing this ADR's ground from ADR-035's. |
| 4 | Counterfactual stated in one sentence a spawned agent could follow | **PASS** — its own block in the ADR. |
| 5 | The *"direct your work"* tension faced explicitly | **PASS** — its own `## Context` subsection, quoting the harness preamble verbatim and showing the two texts draw the same line rather than conflicting. |
| 6 | ADR-014 and the numbering rule respected | **PASS** — number allocated per `/fkit-record-decision` step 2 (see decision log D2). `node --test test/adr-number-uniqueness.test.js` → **14 pass / 0 fail**. |
| 7 | `git diff --stat` shows only the new knowledge-base file (plus the brief's status) | **PASS, with the note above.** Untracked: the ADR + `plan.md` + `worklog.md` (the last two mandated by ADR-020, and by the driver's own instruction). Modified: `sprint-2.md` and `brief.md`, both driver-made status flips predating this worker. |
| 8 | The 2026-07-29 instance adjudicated by name, and its relation to the general answer stated | **PASS** — the worker was **RIGHT**; the owner's instance ruling is **CONSISTENT WITH** the general answer, stated in those words, and explicitly **not an exception to it and not superseded by it**. |

## Decision log

**D1 — ADR, not convention page.** The brief leaves the choice to the architect and licences the cheap
outcome. Chose ADR because the ruling changes the authority model in two ways rather than recording an
implication: it generalizes a marker that existed for one skill and one role, and it inserts a tier
into `universal-rules.md`'s precedence ladder. A convention page would have understated what a reader
must now treat as binding.

**D2 — ADR number 037, allocated per `/fkit-record-decision` step 2.** Step A (malformed-filename
check) printed nothing. Step B (highest on disk) → **36**. Manual in-flight-claim check as the skill
mandates: `grep -rn "ADR-037\|adr-037" ai-agents/` returned **3 hits, all of them prior collision
checks recording that 037 was free** (`0142`'s worklog and review ledger, and the
`2026-08-02-skill-ownership-fact-inventory-gap` report) — no claim on the number. `ai-agents/wiki-vault/`
→ no hits. `git ls-tree` across all four local + remote branches → highest ADR file `adr-035`. **037 is
free.**

**D3 — five of the brief's citations do not check out; recorded in the ADR, not repaired here.** The
addendum pointer (`:245-249` where the text is at `:1069-1073`), the wrong path
`claude/universal-rules.md` for `claude/scaffold/universal-rules.md`, the brief's `## Priority` of 122
against the board's P123, the stale references to `0157` / `0142` as if open (all of `0142`, `0157`,
`0160` are closed), and a stale `decisions/` sweep. **Additional drift the approved plan did not list:
the brief calls `0142` P121; the board says P122.** All producer's to fix, and per ADR-034 they sit in
the task's own record — accepted residual, not a close blocker. Named as follow-up 4.

**D4 — DEPARTURE FROM THE APPROVED PLAN, and it is the substantive one.** The plan states of the
rules-block clause: *"Budget is real and tight … A one-to-two-line clause fits; exact bytes must be
measured at implementation time."* **Measured today, that is wrong against the standing target.**
Emitted block **3570 B** / `RULES_MAX=4096` / **526 B free** / **87.16 %**. Two ceilings apply, not one:
the **standing budget target of ≥ 400 B free** (owner ruling, task `0130`, recorded in
`test/rules-block-budget.test.js`'s header) leaves **126 B**; the test's own gate leaves **218 B**
(see D11 — this figure was first written as 198 B and is corrected). Three candidate wordings drafted
and measured came in at **174 B, 186 B, 212 B** — **all three pass the test, and all three breach the
standing target.** So
the clause cannot land without an explicit owner call: compress something out, an owner-signed budget
bump (ADR-016's discipline), or a decision to spend the margin below 400 B. **The ADR records this in
§4 as a correction to the plan, and follow-up 1 carries the numbers.** The plan's own figures (source
3166 B, block ≈3566 B, ≈530 B headroom) were close but were not re-derived — the measured 3570 / 526 is
used throughout. *This is exactly the "re-verify the plan's claims rather than inherit them" instruction
paying for itself.*

**D5 — did not create an "undisplaceable skill rule" tier.** Direct owner ruling (Q1, `AskUserQuestion`,
2026-08-02): *"Every skill rule, uniformly."* Recorded in the ADR's Deciders block with provenance, and
again in `## Options considered` as the rejected fourth option, so a later reader sees it was decided
rather than overlooked.

**D6 — bound the driver as well as the worker,** per the owner's Q2 ruling *"Bind both."* The honest
asymmetry the plan named is recorded verbatim in the ADR rather than smoothed: the worker-side clause
reaches every spawn through the rules block; the driver-side clause lives in a SKILL.md — which the
driver does load, which is why the asymmetry is acceptable **here and nowhere else**, and which the ADR
says in those terms.

**D7 — declined to require a mechanical enforcement check, and named what was declined.** A
text-presence test asserting the clauses exist on disk is buildable; it would assert the words are
present, not that any worker obeyed them, and a green test of the former reads like the latter. Named
in ADR clause 5 and left to the follow-up brief as a parity check, not as enforcement. The audit
obligation of clause 2 is the stated substitute: it makes a bad override findable, not preventable.

**D8 — deliberately did NOT do ADR-035's work on instance A.** Both ADRs forbid the 2026-07-27
mid-board insertion, on separate axes. The ADR states both grounds and says which one it claims, so a
reader does not take ADR-037 as re-deciding ADR-035.

**D9 — deliberately did NOT generalize instance B's ledger-freezing reasoning.** The brief forbids
reading a `/fkit-task-done` step 5 amendment out of that instance. The ADR carries a named "what this
does NOT do" block and files the question as follow-up 3.

**D10 — citation form.** Applied `0160`'s ruling as ADR-035 applies it: skill and agent rules anchored
by **step heading plus quoted text**, line numbers only as a secondary aid and never naked; the sprint
plan cited by **heading and quote, never `:NNN`**; tasks named by **folder `NNNN` prefix**, never by
board rank. Every ADR cross-link filename was verified to exist on disk.

## Decision log — review round 1 (2026-08-02, process-review worker)

Spawned by `fkit-sprint-ship-loop` under the declared-approval marker, with the owner's dispositions on
all five round-1 findings relayed in the spawn prompt. **Every fix below was applied under an explicit
owner disposition, not autonomously** — recorded here because ADR-019 `:96` / ADR-032 A2 require the
record regardless of which of the two authorities licensed the write.

**D11 — R2 (medium), CORRECTED, and I re-measured rather than inheriting either number.** The reviewer
is right and the first draft was wrong. `test/rules-block-budget.test.js` `:106` computes
`Math.round((size / max) * 100)` and asserts `<= 92`, so the gate passes to **3788 B (92.48 % raw)** and
first reds at **3789 B**. Re-ran the test's own `emittedBlockSize()` path (the real `emit_block()` from
`claude/fkit-claude-init.sh`, UTF-8 bytes): **3570 B emitted, `RULES_MAX=4096`, 526 B free, 87.1582 %**
— headroom to the gate **218 B**, headroom to the standing ≥ 400 B-free target **126 B**. So the three
candidate wordings (174/186/212 B → 3744/3756/3782 B) **all pass the test**, the longest by 6 B, and
**all breach the standing target**. **The claim "the longest fails the test outright" is WITHDRAWN as
false.** Corrected in the ADR's §4 block and in follow-up 1, and above in D4. **The compress /
owner-signed-bump / spend-the-margin choice is unchanged** — the binding ceiling was always the owner's
standing target, never the test.
> *Aside, worth the line: my first re-measurement returned 3638 B because my ad-hoc extraction of
> `RULES_TAG` swallowed the trailing `# comment` on `fkit-claude-init.sh:336`. The test's own regex is
> quote-anchored and does not. Using the test's exact extraction gave 3570 B, matching the reviewer.
> **The 68 B error was in my harness, not in the ADR.**

**D12 — R1 (high), FIXED at both sites the owner named.** The counterfactual sentence *was* wrong:
followed literally with no other context it re-points instance B's frozen ledger, the exact outcome the
ADR rejects *"the skill rule always wins, full stop"* for. Replaced with a one-sentence rule carrying
the conservative-branch-and-escalate escape, and added a qualifying block to §Decision 1 (*"'Binds' says
which text has authority. It does not say 'proceed.'"*). **Both are consistent with clause 2, not a
replacement for it** — clause 2 already reached instance B via *"if it changes the outcome — return
`NEEDS-DECISION` rather than proceeding"*, so clause 2 was left byte-unchanged per the owner's
carry-forward. Also added a checked-by-name walk of both instances against the new sentence alone, and
its measured size (**313 B**, against the replaced draft's 259 B) with the explicit warning that
follow-up 1's compression must not drop the escape.

**D13 — R3 (low), FIXED, all three slips.** (a) *"Everything else still refuses"* no longer carries a
period the source does not have; it is now ellipsis-truncated with the continuation shown
(`claude/agents/fkit-coder.md:98` reads `**Everything else still refuses** — any other spawned …`).
(b) *"(the lead's sprint driver)"* restored to marker signal (a) (`fkit-coder.md:65`). (c) *"It is open
to an owner override."* un-bolded to match `sprint-2.md:1071`, with a note stating which emphasis in
that block is the source's own. **An ADR about quote fidelity that adds unmarked emphasis to the very
passage it convicts the brief of mis-carrying is self-refuting; the reviewer was right to raise it.**

**D14 — R4 and R5 (low), ACCEPTED AS RESIDUALS on the owner's disposition. NOT FIXED.** Both are
verified real:
- **R4** — the three candidate wordings measured at 174/186/212 B are recorded in no file, so §4's
  budget call is not reproducible from the artifacts. *Partially mitigated in passing:* §4 now records
  the resulting block sizes (3744/3756/3782 B) and their verdicts, and the new counterfactual's own
  313 B is recorded — but **the wordings themselves are still unrecorded and this stays a residual.**
  Follow-up 1 drafts its own wordings anyway.
- **R5** — the ADR's *"`grep -rn "direct your work"` returns only `0158`'s brief and the board row"* does
  not hold in the working tree as it now stands (the ADR, `plan.md` and `worklog.md` also match), and
  the text does not say it describes a pre-deliverable sweep. **The substantive conclusion — the phrase
  is harness-injected, not authored in this repo — is verified TRUE and unaffected.**

**Carried forward from the reviewer as settled, not re-litigated:** Codex's stronger F1 (*"clause 2 is
contradicted, instance B undecided"*) is **DISPROVEN** — clause 2 does reach instance B. The *"two
independent grounds"* claim against ADR-035 is **verified CORRECT**. `0158`'s own stale brief citations
stay an ADR-034 accepted residual and remain follow-up 4; **the brief was not edited.**

**Change surface this round:** `adr-037-….md` and this `worklog.md` and the task's `review.md`. **No
source, skill, agent file or scaffold was touched; no board status; no task-folder move; no wiki write;
no commit.**

## Verification

- `node --test test/adr-number-uniqueness.test.js` → **14 pass / 0 fail** (ADR-014, brief step 6).
- `npm test` → **560 pass / 0 fail / 17 suites**.
- `bash test/prove-red.sh` (run as part of `npm test`) → `0a`–`0h` green, mutations 1–13 all red at
  their named assertions, `✓ hard gate PASSED`.
- `node --test test/rules-block-budget.test.js` → **3 pass / 0 fail** (run before and after; nothing in
  this task touches the block, and the D4 figures are measurements, not edits).

## Follow-ups NAMED (not filed — the producer files at close)

Full detail is in the ADR's `## Follow-ups — named, not written` section; each is scoped so a brief can
be written from that text alone.

1. **Rules-block worker-side clause** — `claude/scaffold/universal-rules.md`; must carry D4's budget
   numbers **re-measured at filing time** and put the compress / bump / spend-the-margin choice to the
   owner; `test/rules-block-budget.test.js` stays green; check the wording against ADR-036 trigger (e).
2. **Driver-side clause** — `claude/skills/fkit-sprint-ship-loop/SKILL.md` `## Hard rules`; no budget
   constraint.
3. **Whether `/fkit-task-done` step 5 needs amending** on instance B's reasoning — architect-owned,
   interacts with ADR-034, explicitly not decided here.
4. **Repair `0158`'s own stale citations** — the five in the brief plus the `0142` P121/P122 drift found
   today; producer's; ADR-034 accepted residual.
5. **Wiki ingest of ADR-037** — `fkit-wiki` only.
6. **ADR-036 registry check** — `test/skill-ownership-sites.mjs` **does not exist on disk on 2026-08-02**
   (still `0142`'s follow-up), so the check cannot be run today; both new clauses need assessing when it
   lands, likely as declared non-fact hits.

## Recommendation to the wiki role

ADR-037 belongs in the vault's decisions pages. `fkit-wiki` ingests it; this worker wrote nothing under
`ai-agents/wiki-vault/`.
