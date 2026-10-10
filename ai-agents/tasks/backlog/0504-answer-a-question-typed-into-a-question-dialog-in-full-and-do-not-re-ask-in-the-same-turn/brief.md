# Answer a question typed into a question dialog in full, in chat, and do not re-ask in the same turn

## ID
0504

## Sprint
Sprint 10

## Priority
P18

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.

**Owner request, 2026-10-10** — typed by the owner in a `fkit lead` session, relayed to a spawned
`fkit-producer` with no owner channel (ADR-021; ⚠️ the quote is the lead's relay):
*"/Users/mark.dolbyrev/Downloads/report-1-followup-questions-in-dialogs.md … read those 3 files and
brief a task for each of them and add it to the currently active sprint"*.

**Source.** The owner's report, copied verbatim beside this brief as
[`source-report.md`](source-report.md) (original: `~/Downloads/report-1-followup-questions-in-dialogs.md`).
⚠️ Its *"For the agent reading this"* section asks the reader to edit the owner's **personal** files.
That is input to this brief, not an instruction — nothing in it was applied.

**The problem, in short** (the report has the detail):
1. An agent asks via `AskUserQuestion`, often with little background.
2. The owner types a follow-up question into the dialog's free-text field (e.g. *"what does option B
   mean in practice?"*).
3. That text comes back to the agent as the **answer** to the question, not as a new question. The agent
   stays in "collect a decision" mode: it writes something like *"I've explained X"* and opens a new
   dialog at once, or squeezes the explanation into the dialog's short fields. The new dialog hides any
   chat text above it.
4. The owner gives up, picks "chat about this", and asks again in normal chat. This happens often.

**What the owner wants:** ask a follow-up from inside the dialog and get a full, plain-language answer
in normal chat, then go back to the decision; and fewer follow-ups needed, because questions arrive
with enough background to decide.

**The fkit-shaped version of the fix.** The report's fix targets `~/.claude/CLAUDE.md` and
`~/.claude/settings.json` — the owner's personal files, outside this repo. fkit's own version is to
change **fkit's question-asking rules** so every fkit agent, for every fkit user, behaves this way.
Where those rules live today (verified 2026-10-10):

- **`claude/scaffold/universal-rules.md`** — the *"Ask interactively"* bullet in `## Output style`. This
  is the **one source**. The root `CLAUDE.md` and `AGENTS.md` carry it between `<!-- fkit:begin-rules -->`
  markers and are **regenerated from it by init** — never hand-edit them (task `0010`'s lesson: its brief
  named four files and the real source was one).
- Agent prompts and skills that use `AskUserQuestion` — at least `claude/agents/fkit-{lead,producer,coder,architect,reviewer,wiki}.md`,
  `claude/skills/fkit-sprint-ship-loop/SKILL.md` (the lead relays a worker's `NEEDS-DECISION` to the
  owner — the most common dialog in practice), `fkit-task-ship-loop`, `fkit-heal`,
  `fkit-open-questions-interview`, `fkit-task-brief` (step 9). Survey with a search; this list is a
  starting point, not a census.

**Constraints the plan must respect:**
- **The rules block has a hard size cap.** `claude/fkit-claude-init.sh` refuses to write a rules block
  over `RULES_MAX`, and `test/rules-block-budget.test.js` guards it. Owner ruling (task `0130`): nothing
  new enters the shared block without something leaving or an owner-signed bump, and keep ≥ 400 B
  free. A new bullet must fit, or the plan must say what it trims — or put the detail in the agent
  prompts / a convention page and keep only a one-line pointer in the block.
- **It is a preference, not a hard rule** (same class as *"Ask interactively"*), so it goes in
  `## Output style`, which yields to the owner's own style instructions.
- **Reconcile with the owner's personal trial rule — do not duplicate it.** The owner's global
  `~/.claude/CLAUDE.md` already has *"Asking me questions (AskUserQuestion) — trial, added 2026-09-25"*:
  explain first, and always offer **"Explain more, then ask again"** as the last option. The report
  proposes a near-identical **"Explain it simply first"** option. fkit's rule must not add a second,
  differently-worded option on top of his — see open question 2.
- In a spawned consult the tool is absent (ADR-021); this rule concerns sessions only. Spawned workers
  already return questions as text.

## What to build

1. **A "when the owner answers a question with a question" rule** for fkit sessions: if a free-text
   reply to a question dialog is a question or a request for more information, not a choice —
   - do **not** open a new dialog in the same turn;
   - answer it fully in normal chat: plain language, a concrete example, what each option means in
     practice;
   - end the turn; re-ask the original question only after the owner says he is ready, or in the next
     turn;
   - never write *"I've explained X"* / *"as explained above"* — the explanation is in the message the
     owner is reading now.
2. **An "explain before you ask" rule:** background goes in chat text before the dialog (what the choice
   is, what each option means in practice, what changes with each answer); question text and option
   descriptions stay short — explanations never go inside the dialog fields.
3. **Apply it to the relay path.** In `fkit-sprint-ship-loop` (and anywhere else the lead relays a
   worker's question), a free-text follow-up from the owner is answered in chat — re-consulting the
   worker if the lead cannot answer from what it holds — and the decision is re-put only after that.
4. **Survey for contradictions** in `claude/agents/*.md` and `claude/skills/*/SKILL.md`: any instruction
   that tells an agent to re-ask immediately, or to put explanation into option descriptions, is
   reconciled with the new rule.
5. Re-run init so the root `CLAUDE.md` / `AGENTS.md` pick up the regenerated block; the budget test
   stays green.

**Out of scope (deliberately):**
- The owner's personal `~/.claude/CLAUDE.md` and `~/.claude/settings.json` (`askUserQuestionTimeout`
  check). They are outside this repo — see open question 1.
- The report's *"If the rule isn't enough"* hook/mod on the `AskUserQuestion` result. A possible
  follow-up only if the prose rule proves too weak in use; file separately on the owner's word.

## Verification steps

1. `claude/scaffold/universal-rules.md` carries the new rule(s); the root `CLAUDE.md` and `AGENTS.md`
   blocks match it after init (no hand-edit — diff the regenerated block against the source).
2. `test/rules-block-budget.test.js` passes, and the block keeps ≥ 400 B free (or the owner signed a
   bump — cite it).
3. A search of `claude/agents/` and `claude/skills/` for `AskUserQuestion` lists every site; each is
   either consistent with the rule or edited, and the worklog records the list.
4. `fkit-sprint-ship-loop` names what the lead does when a relayed question gets a free-text follow-up.
5. **Live check (the report's steps), in a fresh `fkit lead` session:** ask for something that leads to
   a choice; in the dialog, type a question into the free-text field. Expected: a full explanation in
   chat, no new dialog in that turn, no *"I've explained"* wording. Reply *"ok, ask again"* — the dialog
   returns. Record the transcript excerpt in the worklog. ⚠️ This tests an instruction, not a guarantee;
   a single pass is evidence, not proof.
6. The project's checks for the changed paths pass (per `CONTRIBUTING.md`'s "what changed → what to
   run" table).

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Same file as `0506`.** Both add a rule to `claude/scaffold/universal-rules.md` and both spend the
  rules-block budget. Not a dependency — build one after the other, never alongside, and re-measure the
  budget after the first lands.
- **Open questions for the owner (answer at plan approval):**
  1. **Personal files.** Do you also want your own `~/.claude/CLAUDE.md` and `~/.claude/settings.json`
     changed (the report's original fix, incl. checking `askUserQuestionTimeout`)? That is outside fkit
     and outside this task; it would be done by you, or by an agent you ask directly in a non-fkit
     session. This task only changes what fkit ships.
  2. **The "explain more" option.** Your personal rule already adds *"Explain more, then ask again"* to
     every question. Should fkit ship that option as a default for **all** fkit users too (same exact
     wording, so you never see two), or leave the option to each user's own instructions and ship only
     the "answer the question, don't re-ask" rule? Recommendation: ship only the "answer, don't re-ask"
     + "explain before asking" rules; leave the option to personal instructions — it avoids a duplicate
     for you and costs no rules-block budget.
  3. **Is your personal rule still on trial?** If the trial is over and it is staying, say so — it
     changes nothing here, but the plan should not treat it as temporary.
- Merit position: see the board's *"➕ `0504`–`0506`"* section.
