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
