> **Approved plan — 2026-10-28, owner, via ExitPlanMode, `fkit coder` session.** Saved as `plan.md` on the
> owner's Q-B decision: the build is deferred until `0543` is committed and `0544` has landed, so the
> later build session works from this plan. Its step 0 re-checks those conditions. The review record is in `plan-review.md`.
> **Approval covered:** Q-A, include the ADR-055 note; Codex X1–X3 handled as Attachment 3 proposes. X1 means
> adding "(settled in headless tests)" after the first "refuses `Write`/`Edit`" in each shipped file and
> in each ADR note.

# Plan — 0545: correct the "plan mode is a structural write-wall" wording (no behaviour change)

**Plan review: ON (default)** — architect APPROVE, producer APPROVE (round 2); Codex ran normally, 3 findings (checks below).

**Approving this plan also decides, unless you say otherwise in feedback:**
- **Q-A → include ADR-055** (4th additions-only note). Both approvers recommend it.
- **Q-B → save this plan as `plan.md`** in the task folder at approval, because the build comes later. This overrides `fkit-plan-task` (~:205, "`plan.md` is not written on this path") on your word. Both approvers recommend it.
- **Codex X1–X3 → my proposed handling** (section *Codex findings*). This is revised after Codex and **not re-reviewed**.

## Context
- `0542`'s headless probe: plan mode refused `Write`, but Bash writes went through. fkit's texts call plan mode a "structural write-wall", which claims more than that evidence shows.
- Owner Q7 (2026-10-24): a wording fix, no guard.
- Gate items, owner, 2026-10-28, this session, `AskUserQuestion`:
  - **3m** hit §8 row *"model declines twice without calling"*, so the claim is not tested interactively. **3m-bis**: not triggered (not applicable, not skipped). Owner: *"Go ahead, scoped (Rec)"*.
  - Ordering: *"Plan now, build later (Rec)"*. The build waits until `0543` is committed and `0544` has landed.

**The two facts every site must carry:**
- **F1 (Bash):** plan mode refuses `Write`/`Edit`. Bash is held back only by the model's plan-mode instructions. Headless, Bash writes went through. Interactively, the model's restraint held every time; the runtime's own handling is untested. Never call it "unreliable" or "non-deterministic".
- **F2 (review on):** with plan review on (the `fkit coder` default), the draft and the review run with plan mode off, and plan mode covers only the approval. `--no-plan-review` keeps plan mode from the start.

## Steps
**0. At build time, before anything else:**
- `0543` committed, `0544` landed, and the target files clean in `git status`.
- A fresh `fkit coder` session, after refreshing `.claude/`.
- If any of these is missing, stop and ask.
- Find each site by its phrase, not its line number. If the surrounding meaning has changed, stop and ask.

**1. `claude/agents/fkit-lead.md`, bullet "⚠️ The orchestrated plan gate is prose, not a wall".** Keep the title and the prose point. Replace the wall sentences, in substance, with:
> "not by plan mode, which cannot run in a spawned worker. Plan mode is also narrower than a full wall: it refuses `Write`/`Edit`; Bash is held back only by the model's plan-mode instructions (held every time in interactive tests; the runtime's own handling is untested). An owner who wants plan mode over the whole plan stretch ships it the old way: `fkit coder --no-plan-review` + `/fkit-task-ship-loop`. With plan review on (the default), plan mode covers only the approval."

**2. Same file, §"When the owner wants a dedicated role session instead".**
- Change "plan mode's **structural** write-wall on a coder task" to "plan mode on a coder task (it refuses `Write`/`Edit`; Bash is held back only by the model's instructions)".
- Keep the `--no-plan-review` parenthetical.

**3. `claude/skills/fkit-sprint-ship-loop/SKILL.md`, the honesty clause.**
- Keep untouched: "NOT a runtime write-wall" and "must not rewrite this into a false structural guarantee".
- Change "the coder session's structural write-wall and ADR-019's one unremovable checkpoint" to: "which in a coder session refuses `Write`/`Edit` (Bash is held back only by the model's plan-mode instructions: held every time in interactive tests, the runtime's own handling untested) and guards ADR-019's one unremovable checkpoint". If the sentence reads too long, the qualifier may become its own sentence.
- Change the last sentence to: "Owners who want plan mode's `Write`/`Edit` wall over the whole plan stretch ship it the old way: `fkit coder --no-plan-review` + `/fkit-task-ship-loop`."

**4. Same skill, the hard rules (~:271, ~:500).** "plan mode's write-wall" becomes "plan mode's `Write`/`Edit` wall", in both places.

**5. `claude/skills/fkit-plan-task/SKILL.md`, step 1.** Replace with:
> "Plan mode makes that a **wall the runtime enforces** for `Write` and `Edit`: it refuses them for the duration. Do not count on it for Bash: headless tests saw Bash writes go through, and interactive handling is untested. Your plan-mode instructions are what stop a Bash write, so make no Bash call that writes."

Leave :208 as it is.

**6. `claude/skills/fkit-task-ship-loop/SKILL.md`.** Three sites: :82 ("runtime-enforced by plan mode"), step 2 ("write wall forbids writing it here") and step 4 ("releases the write wall"). Work against the text `0544` lands:
- Add F1 to **all three** sites. The full qualifier appears once, at :82.
- Confirm F2 is present at each site, and add it where missing.
- Undo nothing `0544` wrote. On a collision, stop.
- Show you the three final sentences (`AskUserQuestion`) before writing them.

**7. Dated ADR notes, additions only,** written by a `fkit-architect` consult inside the build (hop 1, coder → architect). Each follows its ADR's own convention: a dated ⚠️ note, plus a **new** appended Corrections count line, with the old count line left untouched.
- **ADR-019, Decision 2:** points at the existing 2026-10-26 note for F2 and adds F1 only.
- **ADR-031, the honesty clause:** F1 + F2. Names `--no-plan-review` for the :143 "old way" pointer and covers :168 by reference. Does not reopen the accepted cost.
- **ADR-032:** one note covering Decision 7 (:153) and the A3 passage (~:291-292). F1 + F2, and names `--no-plan-review`.
- **ADR-055, Decision 7 (:128), if Q-A is yes:** F1 + F2 + `--no-plan-review`. ADR-055 has no Corrections header, so the consult says which form it uses. If Q-A is no: no note, and the build report recommends a follow-up for the producer.
- No ADR-060 note: the 3m-bis row was not hit.

**8. `CHANGELOG.md`, `## Unreleased`:** one new bullet, separate from `0543`'s, saying there is no behaviour change.

**Out of scope:**
- Hooks, settings, tool lists, scripts, and a Bash guard (you chose option A).
- The wiki. Its ADR-019, ADR-031 and ADR-055 pages repeat the old claim; an `fkit-wiki` sync after this lands picks up the new notes.

## Checks
- **`npm test` only.** These files fall under CONTRIBUTING's "Anything else" row.
- **No prove-red:** no launcher, hook or test file is touched.
- **No new test file.** I checked that no test pins these phrases. The structure manifest covers only `claude/scaffold/`, which this doesn't touch.
- **Brief verifications 2–4:**
  - grep `claude/` for the three phrases: no claim that plan mode gates Bash.
  - `git diff` on ADR-019, 031 and 032 (and 055 if Q-A is yes): only `+` lines.
  - `git diff -- claude/`: prose only.

## Risks
- Claiming too much about Bash in interactive sessions.
- Softening the honesty clause.
- A collision with `0544`.
- A stale prompt text loaded in the build session.
- Each of these is covered by step 0 and the stop-and-ask rules.

---
### Attachment 1: who approved
- **Classification: unclear.** This is shipped prompt text, which is fkit's product, but no behaviour changes. So both the architect and the producer approve.
- **Round 1:** both CHANGES REQUESTED.
- **Round 2:** both APPROVE.

### Attachment 2: what changed in round 1, and why
- **C1, step 5:** removed "It does not gate Bash", which claimed more than the evidence shows. Asked for by the architect (#1) and the producer (#1).
- **C2, step 6:** check F2 is present, stop on a collision, and show you the final text before writing it. Producer #2, architect #4.
- **C3:** the scope qualifier appears at least once in each shipped file. Architect #2.
- **C4:** fixed the dangling "than the word suggests". Architect #3.
- **C5:** the ADR-031 and ADR-032 notes name `--no-plan-review`. Architect #5.
- **C6:** each Corrections count goes on a new line. Producer, minor.

### Attachment 3: Codex findings, with my checks
- **X1 (medium):** "refuses `Write`/`Edit`" claims more than the evidence shows interactively, because C7 is open.
  - Check: **confirmed** as an evidence gap. Report §1.2 marks C1 "settled (headless)" and C7 open; interactively, no `Write` was ever tried.
  - But the brief and report §6 prescribe this wording, and §8a.4 says nothing contradicts it.
  - **Proposed:** add "(settled in headless tests)" after the first "refuses `Write`/`Edit`" in each shipped file and in the ADR notes.
- **X2 (medium):** step 6 seemed to add F1 only at :82.
  - Check: **confirmed** as an ambiguity. F1 was meant for all three sites.
  - **Proposed:** step 6 above already reads "all three".
- **X3 (medium):** ADR-055 is not in step 7's list, and the plan has no branch for each answer to Q-A.
  - Check: **partly confirmed.** Q-A was an open question, but neither answer had a branch.
  - **Proposed:** step 7's ADR-055 bullet above, with a branch for yes and for no.

```
===PLAN-REVIEW RECORD BEGIN===
Switch line: fkit session: coder · Plan review: on — the default for fkit coder sessions (owner ruling 2026-10-24, ADR-060), launched 2026-10-28T06:44Z
Times (UTC): draft started 06:44:56 · owner gate Qs answered ~06:47 · plan drafted 06:49:26 · round-1 ask 06:49:26 · producer 06:51:48 · architect 06:52:05 · round-2 ask 06:52:10 · producer 06:53:01 · architect ~06:53 · Codex 06:53:04 / 06:58:38 · presented 06:58:54
Classification: unclear — shipped prompt text (fkit's product) reworded; no behaviour change
Round 1: architect — CHANGES REQUESTED — step 5 claims more than the evidence; (non-blocking) qualifier once per file, dangling phrase, step-6 text unapproved, ADR-031 :143 flag
Round 1: producer — CHANGES REQUESTED — step 5 claims more than the evidence; step 6 must carry F1+F2
Changes, round 1: C1–C6 as in Attachment 2 — answering the requests named there
Round 2: architect — APPROVE — all fixed; watch: step-3 sentence length
Round 2: producer — APPROVE — all fixed; if Q-A yes, add ADR-055 to verification 3 and the CHANGELOG
Disagreement: none
Codex: [codex] ran normally; no banner; findings X1–X3 as relayed (medium, correctness)
Coder check: X1 — confirmed (evidence gap; wording brief-mandated) — report §1.2 C1/C7, §8a.4
Coder check: X2 — confirmed (ambiguity) — step 6 intent: F1 at all three sites
Coder check: X3 — partly confirmed — Q-A was listed; branch missing
Plan mode: off for draft and review (06:44:56 – 06:58:51); on at 06:58:51 for the gate
Owner revision: none yet (the X1–X3 handling is proposed above, not re-reviewed)
Problems: none
===PLAN-REVIEW RECORD END===
```

---

# Approved bounded update — 2026-10-30

Active implementation scope: the complete reviewed update below replaces old steps 0–8 where changed. The October 28 plan above remains byte-identical history. Actual fkit_ask_owner answer, 2026-10-30 10:59:48 UTC, interactive fkit-coder MCP form, desktop-coordinated channel:

> Approve bounded plan and execution (Recommended) — replace step 0; complete only 0545 through agent-closed—not owner-verified producer closure.

The following is the unchanged pre-approval presentation (its pending labels describe that checkpoint). This actual approval supplies the new gate; no repeated gate or inferred native transition.

- **Approval pending; no implementation.** Actual architect and producer APPROVE; usable fresh adversarial pass found no significant issues.
- **Changed condition:** replace the old commit/clean/Claude prerequisites explicitly. Preserve October 28 approval/history and 0544 behavior.
- **No 0545 tests run.** Current native/Claude checks remain deferred; same-model and reasoning-only limits retained.

# Bounded updated plan — 0545 — 2026-10-30

Plan review: ON (default). Planning only; no project/source/task/ADR writes before actual new owner approval. Ignored procedure scratch only. Codex has no assumed native plan-mode wall or Enter/ExitPlanMode transition.

## Authority, preserved history and changed conditions

The October 28 approved plan and Attempt 1 remain byte-identical history. That approval included ADR-055, saving plan.md, and X1–X3: qualify headless evidence; cover all three task-loop sites; include ADR-055. Do not re-ask them.

The actual desktop decisions authorize preparation only: “Use confirmed evidence (Recommended) — limit the wording to behavior already demonstrated”; “Keep the reported order (Recommended) — resolve 0543, then advance 0544 and 0545”; goal “Finish the plan-review rollout and clarify planning limits (Recommended).” This new gate alone can authorize the updated build.

**Explicit change to old step 0, pending approval:** replace “0543 committed, targets clean, refreshed Claude session” with actual closed 0543/0544 evidence; per-file current SHA-256 and staged/unstaged diff baselines; preservation of unrelated dirty content; this actual fresh interactive Codex coder session (launched 2026-10-30T10:23:14.335Z), current canonical role and dispatcher-loaded skills. No commit or Claude availability requirement is silently waived: the owner is asked to replace that condition. No Claude/Bash probe will be requested. The updated evidence wording also narrows the old Write/Edit shorthand to directly measured Write refusal outside the plan file; Edit is explicitly untested (0542 worklog A.2/A.3, report C1). The historical X1 handling remains preserved, not retroactively changed.

0543 and 0544 are in tasks/done via actual producer movers, agent-closed—not owner-verified; Sprint 12 rows agree. Current task-loop SHA-256 is ca10c0cd0cf7483fd74c73b523fa3c8a42452f48b4ed10471fe15be8bfd321b1, matching 0544's verification artifact. Retain its entire flag/trigger/gate/record/autonomy behavior. Its prior suite evidence is 960 pass/1 optional skip, 112.535523959 s, after 23 sandbox failures resolved by scoped permission rerun; that is historical 0544 evidence, not a 0545 run. Current source/records override stale wiki; five commits touched ai-agents/ since watermark 185ac5e.

**Evidence boundary:** historical Claude headless tests support Write refusal outside the plan file and Bash writes going through; Edit was not directly tested. In historical interactive tests, models declined writes before calls reached the runtime. **3m declined twice; interactive runtime handling untested. 3m-bis not triggered/not applicable. Neither becomes passed.** Native/Claude behavior is unverified locally. Codex planning/general writes are instruction-only; both fkit hooks disabled. No universal Write/Edit wall, Bash guard, Shift+Tab requirement or native transition is promised for Codex.

**Classification: product change** — shipped prompt wording is user-facing product output, despite no intended runtime/behavior change. Actual architect and producer approve; fresh adversarial attacks last.

## 0. Baseline and approval persistence

The 10:24:55 UTC ignored scratch baseline contains the nine source/doc targets and three existing task documents, their full current bytes, SHA-256, and staged/unstaged diffs. Before any approved edit, recheck hashes/diffs and 0543/0544 closed markers/links. If content changed, inspect and preserve it; a collision that changes the approved prose/scope stops for the owner. Never reset/checkout/stash/stage dirty content.

After approval, first append Attempt 2 to task plan-review.md: exact shown record, Presented UTC, actual owner answer quoted, date and actual fkit_ask_owner/desktop-relay channel. Preserve Attempt 1 as an exact prefix. Then append this approved update to existing plan.md, preserving its entire October 28 prefix and identifying this addendum as the active replacement for old steps 0–8 where changed. This gate authorizes that append (no historical rewrite). Open worklog.md; mark only 0545 brief and Sprint 12 P15 In progress. No rank/dependency/goal/sprint-banner change. Load the actual coder-owned fkit-task-ship-loop through fkit_skill for post-gate execution; carry this approved plan and actual answer, do not repeat planning/review/approval or write the record twice. Its existing verified-CORRECT, mechanical/localized, in-plan fix discipline applies; stop for every judgment call, frontier/residual, regression, oscillation or scope change. Record every autonomous fix/obvious-winner, or none.

## 1. Exact lead replacements — claude/agents/fkit-lead.md

Replace the entire “⚠️ The orchestrated plan gate is prose, not a wall” bullet with:

> **⚠️ The orchestrated plan gate is prose, not a wall.** On this path, “no code before the owner approves the plan” is enforced by a prompt instruction to the spawned coder (“plan only, write no source, return it”). Native Claude plan mode cannot supply an interactive owner gate in that worker. Historical Claude headless tests refused `Write` outside the plan file but allowed Bash writes; `Edit` was not directly tested; in interactive tests the models declined writes before runtime handling could be tested. With plan review on (the `fkit coder` default), drafting and review precede native plan mode, which covers only approval; `fkit coder --no-plan-review` + `/fkit-task-ship-loop` keeps native plan mode from the start of planning. On Codex both paths rely on instructions for planning/write limits, with no assumed native mode transition or structural Bash guard. Do not present the orchestrated gate as a structural guarantee (ADR-031 honesty clause).

Replace the paragraph under “When the owner wants a dedicated role session instead” with:

> For a single focused role session, the owner leaves this session (Ctrl-D) and runs **`fkit <role>`** (e.g. `fkit coder`), or opens another terminal tab and runs `fkit`. With plan review on, drafting and review precede native Claude plan mode, which covers only approval; `fkit coder --no-plan-review` keeps native plan mode from the start of each plan. Its historically demonstrated limits are stated in the honesty bullet above; Codex planning/write limits remain instruction-enforced on either path. Say so plainly when a dedicated session is the better fit; don't insist on driving everything from here.

## 2. Exact sprint-loop replacements — claude/skills/fkit-sprint-ship-loop/SKILL.md

Replace the honesty clause's opening paragraph only (keep the numbered split and remaining accepted-cost paragraph):

> On this orchestrated path, **“no code before the owner approves the plan” is prose-enforced in the worker prompt, NOT a runtime write-wall.** Native Claude plan mode cannot supply the interactive owner gate in a spawned worker (no owner channel there, ADR-021). Historical Claude headless tests refused `Write` outside the plan file but allowed Bash writes; `Edit` was not directly tested; interactive models declined writes before runtime handling could be tested. With plan review on (the `fkit coder` default), drafting and review precede native plan mode, which covers only approval; `--no-plan-review` keeps native plan mode from the start. Codex planning/write limits remain instruction-enforced on both paths. ADR-019's plan approval remains the one unremovable checkpoint. The driver enforces the ordering by **splitting** it:

Retain “must not rewrite this into a false structural guarantee.” Replace only the following final sentence:

> Owners who want native Claude plan mode from the start of planning use `fkit coder --no-plan-review` + `/fkit-task-ship-loop`; its demonstrated limits above still apply, and this provides no structural planning/write wall on Codex.

Two hard-rule replacements, complete bullets:

> **The plan/build split (honesty clause) is mandatory** — on this orchestrated path, instructions enforce approval before source writes; the honesty clause states the historical native-Claude limits and Codex's instruction-enforced planning gate.

> **The plan/build split is mandatory** and its gate is **prose-enforced, not structural** (honesty clause) — do not present it as a runtime write-wall.

## 3. Exact plan-task replacement — claude/skills/fkit-plan-task/SKILL.md, Workflow step 1

Keep the first two sentences (EnterPlanMode instruction and planning-only declaration). Replace its “Plan mode makes that a wall…” sentences with:

> Historical Claude headless tests refused `Write` outside the plan file in native plan mode but allowed Bash writes; `Edit` was not directly tested. Interactive models declined writes before runtime handling could be tested. Bash restraint therefore depends on the model following its planning instructions in the demonstrated headless path; make no Bash call that writes. With session plan review on, step 0 skips this step: drafting and review precede native plan mode, which covers only approval. With `--no-plan-review`, native plan mode starts before drafting. On Codex follow the runtime binding's instruction-enforced planning/approval gate; do not claim a Write/Edit tool wall, structural Bash guard, Enter/ExitPlanMode transition or Shift+Tab requirement.

Retain the tool-unavailable fallback and all review triggers, literal required progress line, ordering, flags, attachments, records and owner-gate logic. Existing native-specific instructions elsewhere remain interpreted through the active runtime binding; this task changes no runtime adapter.

## 4. Exact THREE task-loop sites — claude/skills/fkit-task-ship-loop/SKILL.md

These replace the old step-6 promise to ask for the final sentences later. **One approval of this exact plan approves these three paragraphs now**, after review against current 0544 text; no second prose-permission loop. All other 0544 text stays intact.

**Site A — What makes this autonomous, first bullet (entire bullet):**

> **One guaranteed upfront human checkpoint: the plan gate.** The owner approves *what gets built* before any code. With plan review on, draft and review run before native plan mode, held by instructions only; native plan mode comes on for the gate. Off paths keep native plan mode from the start. Historical Claude headless tests refused `Write` outside the plan file but allowed Bash writes; `Edit` was not directly tested; interactive models declined writes before runtime handling could be tested. Follow the active runtime binding: Codex's planning gate is instruction-enforced, with no assumed native mode transition, Write/Edit tool wall or structural Bash guard. Only after approval may the owner walk away.

**Site B — step 2, second paragraph (entire paragraph):**

> With review on, draft and run the full review with native plan mode off, writing nothing; enter native plan mode only for step 3's gate. Off paths enter native plan mode first, as today. Native Claude's historical headless Write refusal outside the plan file and successful Bash writes do not establish Edit or interactive runtime handling; see “What makes this autonomous” above. Where native mode is unavailable, follow the runtime binding's instruction-enforced gate instead; do not claim EnterPlanMode/ExitPlanMode or require Shift+Tab on Codex. No source, plan, worklog, status or plan-review record is written before approval; only the reviewer's framework-owned ignored scratch prompt is permitted. ADR-020 keys `plan.md` to approval. *(Autonomous up to the gate.)*

**Site C — step 4, FIRST paragraph (entire paragraph; preserve remaining step 4):**

> **Persist the plan, mark In progress & build.** Only after actual approval (following the active runtime's gate), first append the reviewed plan's record **once** to `<task-folder>/plan-review.md`, under `## Attempt N — <date>`: the full shown record block verbatim, `Presented: <UTC>`, and the owner's exact decision with UTC and actual channel. With review on, native plan mode covers approval only; off paths keep it from the start. Native Claude's historical headless Write refusal outside the plan file and successful Bash writes do not establish Edit or interactive runtime handling; see “What makes this autonomous” above. On native Claude record approval via ExitPlanMode; on Codex record the actual owner answer/channel, never an assumed native transition or runtime write-wall. This is a self-record — fidelity, not proof. Report a failed record write in `Problems:`; the work goes on. Off paths create no review file/attempt and preserve historical records. Never reuse an old record as approval for a changed plan.

## 5. Exact additions-only ADR notes — actual architect writes during build

Session coder → actual architect, hop 1 of 2, no onward consult; provide exact approved prose, actual owner answer/date/channel, files/anchors and baseline hashes. Architect loads its owned ADR procedure through fkit_skill and applies its existing-ADR correction-note requirements to these settled additions, without allocating a new ADR or reopening a decision; it writes only these dated notes and new correction-count continuations. This is the previously approved bounded ADR-note work, not a coder invoking architect procedures or a sprint-worker substitute. This gate approves the settled note text and its form together; no second ADR interview or multi-hop unowned substitute. A genuinely new substantive decision still stops. No original ADR byte is deleted/rewritten; status stays accepted. Relative links may use the existing ADR filenames; note text below is complete.

**ADR-019**, after Decision 2's 2026-10-26 note:

> ⚠️ **Dated wording note 2026-10-30 (`0545`) — the runtime claim is narrower than a full write-wall.** Historical Claude headless tests refused `Write` outside the plan file but allowed Bash writes; `Edit` was not directly tested. Interactive models declined writes before runtime handling could be tested: 3m declined twice; 3m-bis was not triggered/not applicable. Neither is a pass. For native plan-mode timing, read the 2026-10-26 note immediately above; it is not restated here. On Codex planning/write limits are instruction-enforced, with both fkit hooks disabled; no native transition or structural Bash guard is promised. This corrects the mechanism wording only; the approval-before-code decision and accepted status remain unchanged. Existing ADR text remains byte-identical. Wording checked against current canonical procedures and retained evidence on 2026-10-30; no new plan-mode runtime test ran.

Append to its Corrections item (new lines, old counts untouched):

> ⚠️ 2026-10-30 (`0545`) — this ADR now carries **four** dated notes; the fourth follows Decision 2's 2026-10-26 note and qualifies the write-wall evidence. The earlier count is left byte-identical and superseded by this line; the same append-only rule and marker legend apply.

**ADR-031**, after its honesty-clause ADR-055 pointer note:

> ⚠️ **Dated wording note 2026-10-30 (`0545`) — this note also qualifies the “structural write-wall” wording in Options considered.** Historical Claude headless tests refused `Write` outside the plan file but allowed Bash writes; `Edit` was not directly tested. Interactive models declined writes before runtime handling could be tested: 3m declined twice; 3m-bis was not triggered/not applicable. Neither is a pass. With plan review on (the `fkit coder` default), drafting and review precede native Claude plan mode, which covers only approval. The historical “old way” pointer means `fkit coder --no-plan-review` + `/fkit-task-ship-loop` for native plan mode from the start; the historical headless evidence does not establish a full write-wall. Codex planning/write limits remain instruction-enforced, both fkit hooks disabled. The plan-only → owner approval → implement split and its accepted prose-enforced cost remain unchanged. Status stays `accepted`. Existing ADR text remains byte-identical. Wording checked against current canonical procedures and retained evidence on 2026-10-30; no new plan-mode runtime test ran.

New Corrections continuation:

> ⚠️ 2026-10-30 (`0545`) — this ADR now carries **five** dated notes; the fifth follows the honesty-clause ADR-055 pointer and also covers Options considered. Earlier counts remain byte-identical; the same append-only rule and marker legend apply.

**ADR-032**, immediately after Decision 7; this one note covers A3 by reference:

> ⚠️ **Dated wording note 2026-10-30 (`0545`) — this also qualifies §Amendment A3's “real session write-wall” and “old way” claims.** Historical Claude headless tests refused `Write` outside the plan file but allowed Bash writes; `Edit` was not directly tested. Interactive models declined writes before runtime handling could be tested: 3m declined twice; 3m-bis was not triggered/not applicable. Neither is a pass. With plan review on (the `fkit coder` default), drafting and review precede native Claude plan mode, which covers only approval; `fkit coder --no-plan-review` + `/fkit-task-ship-loop` keeps native plan mode from the start. This evidence establishes no structural Bash guard for either path. Codex planning/write limits remain instruction-enforced, both fkit hooks disabled. The mandatory split, A3's trust-not-proof cost and A4's re-raise rules remain unchanged. Status stays `accepted`. Existing ADR text remains byte-identical. Wording checked against current canonical procedures and retained evidence on 2026-10-30; no new plan-mode runtime test ran.

New Corrections continuation:

> ⚠️ 2026-10-30 (`0545`) — this ADR now carries **six** dated notes; the sixth follows Decision 7 and also covers §Amendment A3. Earlier counts remain byte-identical; the same append-only rule and marker legend apply.

**ADR-055**, after Decision 7:

> ⚠️ **Dated wording note 2026-10-30 (`0545`) — Decision 7's “structural write-wall” pointer is narrower than stated.** Historical Claude headless tests refused `Write` outside the plan file but allowed Bash writes; `Edit` was not directly tested. Interactive models declined writes before runtime handling could be tested: 3m declined twice; 3m-bis was not triggered/not applicable. Neither is a pass. With plan review on (the `fkit coder` default), drafting and review precede native Claude plan mode, which covers only approval; the “old way” pointer means `fkit coder --no-plan-review` + `/fkit-task-ship-loop` for native plan mode from the start. This evidence establishes no structural Bash guard for either path. Codex planning/write limits remain instruction-enforced, both fkit hooks disabled. The marker's four fields and trust-not-proof cost remain unchanged. Status stays `accepted`. Existing ADR text remains byte-identical. Wording checked against current canonical procedures and retained evidence on 2026-10-30; no new plan-mode runtime test ran.

ADR-055 has no Corrections header. Add a new header-list item, deleting nothing:

> **Corrections:** 2026-10-30 (`0545`) — one dated ⚠️ wording note follows Decision 7. ⚠️ marks a drifted fact, not an overturned decision; all existing text remains byte-identical and Status stays `accepted`.

No ADR-060/061/report edit. No accepted consent-model decision reopened.

## 6. Changelog and managed projection

Add one separate Unreleased bullet (retain all dirty migration/0543/0544 bullets):

> Clarify planning limits without changing behavior: historical Claude headless Write refusal does not establish Edit or interactive runtime handling or a Bash write-wall. Native plan-mode timing still follows plan-review opt-outs; Codex planning/write limits remain instruction-enforced.

After approved canonical edits, managed projection refresh is necessary because fkit_skill reads generated .agents procedures. Use only existing command `node '/Users/mark.dolbyrev/Workspace/fkit/codex/fkit.mjs' setup --root '/Users/mark.dolbyrev/Workspace/fkit'`, no generator changes. Before/after: inventory path/type/mode/SHA-256 of all tracked/nonignored project files plus .claude and .agents; snapshot .git/index hash and cached diff hash; root CLAUDE.md, AGENTS.md and .gitignore full bytes; local model-settings hash only (no credential reads). Do not follow symlinks outside root. Exclude only framework-owned ignored scratch/logs; never exclude ai-agents or canonical source. Require zero added/removed/changed protected project bytes, root owner-file bytes, index/cached diff or settings during refresh. Only permitted deltas: .claude/agents/fkit-lead.md; .claude/skills/{fkit-plan-task,fkit-task-ship-loop,fkit-sprint-ship-loop}/SKILL.md; corresponding three .agents/skills/.../SKILL.md generated from current canonical plus existing adapter transformations/marker. Every other managed file must retain hash/type/mode; no hook/settings/script refresh delta allowed. Unexpected delta stops, no blanket revert. Use scoped execution escalation only if protected managed writes require it, preserving rejection reasons; no alternate bypass. Reload actual coder-owned plan/task skills via fkit_skill afterward; fresh architect/reviewer/producer receive current role text from existing runtime. No attempt to rewrite this running session's loaded instructions.

## 7. Modest measurable completion criteria and verification

**C545-1 Scope:** approved baseline-to-current delta touches exactly four prompt files, four additions-only ADRs, one changelog bullet, approved local projections and 0545 lifecycle/evidence records. Protect all unrelated dirty/staged content and 0544 behavior. Before editing, before verification and handoff, compare inventory/hashes and isolated baseline diffs; scope `git diff --check` to this work, disclose pre-existing failures separately.

**C545-2 Prose:** all listed sites match approved replacements (Markdown wrapping/straight-vs-curly quotation formatting may be normalized without meaning change). Read surrounding context; preserve --no-plan-review behavior, all argument/trigger checks, presentation/persistence, owner gates and review/autonomy. `rg` the old three phrases under claude/ and read every hit: no unqualified Bash/full-wall claim at target sites; historical ADR text remains with additive qualifications. No claim that 3m/3m-bis or native checks passed. Check local links/anchors actually added.

**C545-3 ADR integrity:** actual architect author; per-file baseline diff has no removed lines, and removing the inserted ranges reconstructs the exact baseline bytes. Notes/counts and accepted statuses correct; no original-body rewrite.

**C545-4 Required test:** run actual `npm test` after final product edits; retain command/log, exit, counts/skip reasons, elapsed and 120s budget result. A sandbox failure stays a failure in the record; if a scoped permission rerun is required, retain both runs and the actual reason. Never reuse 0544's pass as 0545's. CONTRIBUTING “Anything else” row applies. No new permanent text-pinning tests or new test files. Skip prove-red, release/installer/build lanes: no corresponding code or release change. No new model workflow/probe/native/Claude check; those would exceed wording-only scope.

**C545-5 Independent review and close:** session coder consults actual reviewer at hop 1 for its owned fkit-stateful-review, exact task-folder ledger key and isolated delta/baselines plus necessary source dependencies. Reviewer obtains fresh usable adversarial leaf via its own authorized tool. Relay required report verbatim; preserve ledger ownership. Process every finding by the complete coder method within the authorized task-loop discipline; mechanical in-plan CORRECT fixes only unattended, with decision log (or none). Any judgment call stops. Reverify after changes; distinguish actual commands per pass from reasoning-only review and retained earlier suite runs. Both passes used the same model. A different model is recommended for a broader second opinion. Independently established serving identity/diversity remains unknown unless actual evidence establishes it; no alias-based claim. Missing/unusable pass stays partial. When required checks green, ledger closed-out and no unresolved residual, session coder consults actual producer at hop 1 to load/run fkit-task-done and close **0545 only**, agent-closed—not owner-verified. Producer reports every changed status/link/file; coder verifies full report, moved folder, marker/hrefs and protected history/index. Only producer's prescribed Git move may change the index; no commit/push/staging beyond the mover. Scoped sandbox escalation is not human approval or a substitute mover; a denial is retained and surfaced. Closure blocked/degraded/judgment paths follow the existing loop contract; no hand move or Done edit by coder.

Native/Claude deferred checks remain explicitly unverified in the worklog/evidence packet and existing validation handoff; this task does not certify them or edit that handoff. It needs no Sprint 12 closure or wiki sync to be done. No global install, release, auth/credentials/config/hook/runtime modifications, guard, probe, wiki write, commit or push. No open product question beyond this bounded replacement approval.


## Attachment 1 — approvers and classification

Product change: shipped prompt wording is product output; no intended runtime behavior change. Both assigned actual approvers returned APPROVE on round 2 (first revision): architect at 10:31:27 UTC; producer at 10:32:42 UTC. All four approver consults exited 0 without timeout/truncation; no owner questions remain. Both confirmed the direct coder → architect existing-ADR correction path. Full responses retained in round1-architect.txt, round1-producer.txt, round2-architect.txt and round2-producer.txt in this ignored scratch folder. This is plan approval by peers, not owner build approval.

## Attachment 2 — explicit changes from October 28 and first-round revisions

- D1: old committed/clean/Claude step0 replaced only if the owner approves current closed evidence, per-file dirty baselines and fresh Codex session. No commit/Claude probe requirement silently waived.
- D2: historical native/headless evidence qualified; direct measurement narrowed to Write outside plan file, Edit untested. 3m declined twice, interactive handling untested; 3m-bis not triggered/not applicable. Historical X1–X3 and ADR055 approval remain unchanged history.
- D3: exact three task-loop paragraphs now re-anchored against verified 0544 source and presented together, replacing the old later prose gate. Existing flags/behavior retained.
- D4: exact remaining prose, architect additions-only notes, bounded managed refresh, modest new npm-test/review/producer-closure criteria; deferred native checks preserved; no sprint closure/wiki scope.
- D5: preserve old plan/review prefixes; append active update and Attempt 2 only after actual approval.
- C1–C4 (first revision): per-note byte/date statements requested by both; evidence narrowed from original shorthand after direct source inspection; conclusions scoped; existing-ADR ownership path clarified. Both re-reviewed full revised plan. No change after adversarial.

## Attachment 3 — fresh adversarial result and coder check

Usable fresh pass, exit 0, no timeout/truncation. Returned conclusion: “No significant issues found in the bounded 0545 updated plan.” Mode: fresh Codex adversarial pass; reasoning-only. Full response is reproduced verbatim in the record below. Coder check: confirmed current source/evidence supports the bounded proposal; no defect to disposition and no plan change.

Actual pass execution: procedure/source/retained-record inspection and baseline/inventory audit; initial blocked heredoc corrected. No tests, runtime probes, refresh or model workflows rerun. Configuration/CLI-level: Both passes used the same model. A different model is recommended for a broader second opinion. Serving identity/diversity unverified.

```text
===PLAN-REVIEW RECORD BEGIN===
Switch line: fkit session: coder · Plan review: on — the default for fkit coder sessions (owner ruling 2026-10-24, ADR-060), launched 2026-10-30T10:23:14.335Z
Times (UTC, 2026-10-30): historical plan/review read before first capture 10:23:29; first draft completed 10:25:59; round-1 ask 10:26:11; architect return 10:27:55; producer return 10:29:47; revised full-plan round-2 ask 10:29:57; architect return 10:31:27; producer return 10:32:42; adversarial start 10:32:54 / return 10:34:46; final preservation check 10:35:05; packet prepared 2026-10-30 10:35:41 UTC
Classification: product change — shipped user-facing prompt output changes; no intended runtime/behavior change. Historical classification unclear preserved; both roles assigned in both cases.
Round 1: architect — CHANGES REQUESTED — each ADR note needs explicit byte-identical preservation statement and verification date; otherwise structurally sound.
Round 1: producer — CHANGES REQUESTED — same per-note form requirements; otherwise scope aligns.
Changes, round 1: C1 — add preservation/date to each note, distinguish current-text check from new runtime testing — both request 1. C2 — source evidence directly measured Write outside plan file, not Edit; narrow claims and explicitly mark Edit untested — coder source check, updated owner evidence direction. C3 — bound Bash/full-wall conclusions to retained evidence. C4 — clarify actual architect existing-ADR correction path, no new allocation/interview or duplicate gate.
Round 2: architect — APPROVE — classification, direct owned correction path, evidence boundaries and preservation sound; no blocking architecture question; building still needs owner approval.
Round 2: producer — APPROVE — scope/history/ADR055 preserved; owned hops/correction branch feasible; evidence bounded; fresh owner step0 replacement still required.
Disagreement: none.
Codex: full returned adversarial report verbatim follows.
Role: fkit-adversarial-reviewer
Runtime: codex
Model: gpt-6.1-sol
Model requested: gpt-6.1-sol
Exit: 0
Timed out: false
Truncated: false
Prompt: /Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/consult-adversarial-reviewer-cd9ff1a9-75d4-49a7-b2eb-af62d3f87f31.md

No significant issues found in the bounded 0545 updated plan. Current source supports the narrowed evidence claims, architect correction branch, owned hops and preserved 0544 behavior. History preservation, refresh boundaries and closure criteria are adequately specified.

Mode/model: fresh Codex adversarial pass; reasoning-only. Observed serving-model identity and diversity unknown.

Command evidence: `fkit_skill` loaded the actual procedure; `rg`/`nl`/`sed` inspected canonical source and retained records. `python3 -c` audit exited 0: all 12 baseline files matched snapshots; 1,990 inventory entries showed no checked hash/type/mode differences. Initial heredoc audit was blocked before execution; corrected invocation succeeded. Git/Python emitted sandbox cache warnings.

No tests, runtime probes, refresh, writes or further consultations performed. Historical suite results were not rerun.

Coder check: clean conclusion — confirmed against current scoped source and 0542 A.2/A.3/report C1; current 0544 hash matches retained artifact; independent final audit found all 1,990 protected entries unchanged and no new nonignored paths. No post-adversarial plan revision; plan SHA256 3f43037f55da3a8b4b3983a505a6e17e38fab7815013f096e38e1e90e21b7fae.
Plan mode: Codex instruction-enforced planning throughout; no assumed native mode transition, Enter/ExitPlanMode call or structural write wall. Actual fkit_ask_owner gate pending.
Owner revision: none. October28 approval and desktop preparation directions are historical authority, not approval of this changed plan.
Problems: approvers and adversarial exited 0, no timeout/truncation/denied spawn. Adversarial initial heredoc audit blocked before execution; corrected audit succeeded; sandbox cache warnings retained above. Initial read-only path lookups for missing codex/context.mjs and a shortened 0542 worklog slug were corrected. No tests/probes/refresh run; no npm-test result claimed for 0545.
Model/coverage limits: fresh separate configured gpt-6.1-sol sessions; adversarial mode as returned: reasoning-only; independently established serving identity/diversity unknown. Configuration/CLI-level: Both passes used the same model. A different model is recommended for a broader second opinion. No behavioral test rerun by either plan-review pass.
===PLAN-REVIEW RECORD END===
```

Approval would authorize the bounded update and build → verify → independent/stateful review → actual producer-only closure of 0545. Declining leaves project files and status unchanged; explanation requests grant no approval. This new gate is required by the actual fkit-plan-task procedure and the owner's explicit no-write-before-new-approval instruction.

What's next? Answer the actual owner form; build remains stopped until approval.
