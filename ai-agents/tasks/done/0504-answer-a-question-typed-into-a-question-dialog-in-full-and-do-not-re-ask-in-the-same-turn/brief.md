# Answer a question typed into a question dialog in full, in chat, and do not re-ask in the same turn

## ID
0504

## Sprint
Sprint 10

## Priority
P18

## Status
✅ Done (agent-closed — not owner-verified)

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
  ⏱ **2026-10-10 — this constraint is now larger** (owner ruling on question 2 below brings the
  "Explain more, then ask again" option into scope). Measured by this producer on 2026-10-10 with
  `wc -c` over the marker-delimited block in the root `CLAUDE.md`: **3906 B against `RULES_MAX=4352` →
  446 B free, only ~46 B above the 400 B floor.** ⚠️ A quick measurement, not the test's own figure —
  the plan re-measures with `test/rules-block-budget.test.js`. The option's label and description alone
  are ~90 B, so the rules from items 1–2 **plus** the option almost certainly do not fit as new text.
  The plan must measure and say which it proposes: trim existing text, a one-line pointer in the block
  with the detail in agent prompts / a convention page, or an owner-signed `RULES_MAX` bump. `0506`
  spends the same budget — whichever lands first leaves less for the other.
- **It is a preference, not a hard rule** (same class as *"Ask interactively"*), so it goes in
  `## Output style`, which yields to the owner's own style instructions.
- **Reconcile with the owner's personal trial rule — do not duplicate it.** The owner's global
  `~/.claude/CLAUDE.md` already has *"Asking me questions (AskUserQuestion) — trial, added 2026-09-25"*:
  explain first, and always offer **"Explain more, then ask again"** as the last option. The report
  proposes a near-identical **"Explain it simply first"** option. fkit's rule must not add a second,
  differently-worded option on top of his — see open question 2.
  ⏱ **Ruled 2026-10-10:** fkit ships **his exact option** to all users (not the report's "Explain it
  simply first"), and his personal copy is removed after `0504` ships, so he sees it once. See
  *"Owner rulings"* at the end and "What to build" item 6.
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
6. **Ship the "Explain more, then ask again" option to every fkit user** *(added 2026-10-10 by owner
   ruling on question 2 — see "Owner rulings")*. Every question an fkit session puts with
   `AskUserQuestion` includes it:
   - label exactly `Explain more, then ask again`; description exactly `Give me more context in simple
     terms, then re-ask the question.`;
   - it is the **last** option; the recommended option stays **first**; the tool allows at most 4
     options, so a question with 4 real options merges or drops the weakest one so this option fits;
   - if the owner picks it: explain in simple terms (more context, plain words, no new jargon), then ask
     the **same** question again, with the same options plus this one again.
   **Reference wording** — the owner's personal rule, the model to follow, quoted in *"Owner rulings"*
   below. Re-word only what must change for all users (his "me / I" becomes "the owner"); keep the label
   and description byte-exact so his copy and fkit's never differ while both exist. Where the full text
   lives (block vs agent prompts vs convention page) is the plan's call under the size constraint above.
   It fits with items 1–3: a picked "Explain more" is a request for more information, so item 1's
   "answer in chat" rule and this item's "then re-ask" must not contradict each other — the plan says how
   they read together.

**Out of scope (deliberately):**
- The owner's personal `~/.claude/CLAUDE.md` and `~/.claude/settings.json` (`askUserQuestionTimeout`
  check). They are outside this repo — see open question 1.
  ⏱ **2026-10-10:** the owner ruled his personal "Explain more" rule comes out of `~/.claude/CLAUDE.md`
  once `0504` ships. That edit is **still out of scope for the coder**: it is outside fkit's repo, and it
  is a **post-ship step for the owner or the lead session**, with the exact change shown to him before
  saving. It is not a deliverable of this task and not a reason to keep this task open. The
  `askUserQuestionTimeout` check was **not ruled** — owner-side, out of fkit's scope.
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
7. *(Added 2026-10-10, item 6.)* The shipped text carries the label `Explain more, then ask again` and
   description `Give me more context in simple terms, then re-ask the question.` byte-exact (a search for
   each string finds the shipped sites), plus the last-option / recommended-first / 4-option rule and
   the re-ask-on-pick rule. In the step-5 live session, ⚠️ while the owner's personal copy is still in
   place (it comes out only after ship), check that a question shows the option **once**, not twice;
   pick it, and expect a plain explanation and the same question again.

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
  → ⏱ **2026-10-10:** question 2 ✅ answered (ship it to all users — overrides the recommendation
  above); question 3 ✅ answered (the trial ends when `0504` ships; the personal copy comes out); question
  1 ✅ answered **for the personal `~/.claude/CLAUDE.md` "Explain more" rule only** — the
  `askUserQuestionTimeout` check and any other personal-file change from the report stay **not ruled**.
  See *"Owner rulings"* below.
- Merit position: see the board's *"➕ `0504`–`0506`"* section.

## Owner rulings

> ⏱ **2026-10-10 — open questions 1, 2 and 3.** Given by the owner via `AskUserQuestion` in a
> `fkit lead` session; relayed to a spawned `fkit-producer` with no owner channel (ADR-021). ⚠️ The
> quotes are the lead's relay of the selected options, not text this producer saw the owner pick.
> Status and rank unchanged.
>
> **Ruling A — answers open question 2.**
> - **Question:** *"0504: should fkit ship the 'Explain more, then ask again' option to every user?"*
> - **Selected:** *"Yes, ship it to all users"* — option text: *"Every fkit user gets the option. Costs
>   space in the size-limited rules file, and you'd need to drop your personal copy to avoid seeing it
>   twice."*
> - ⚠️ **This overrides the producer's recommendation** in question 2 (keep the option personal).
> - **Effect:** the option is in scope — "What to build" item 6, verification step 7; the rules-block
>   budget is now a larger constraint (see *"Constraints"*).
>
> **Ruling B — answers open questions 1 (partly) and 3.**
> - **Question:** *"Once 0504 ships the option to all users, what should happen to your personal
>   'Explain more' rule?"*
> - **Selected:** *"Remove my copy after 0504 (Rec)"* — option text: *"When 0504 ships, the personal
>   rule comes out of ~/.claude/CLAUDE.md (shown to you before saving) so you don't see the option
>   twice. The trial ends there."*
> - **Effect:** the trial ends when `0504` ships. Removing the personal copy is **outside fkit's repo**
>   and is **a post-ship step for the owner or the lead session**, with the exact change shown to the
>   owner before saving. **It is not a coder deliverable** and not part of this task's done-ness.
>
> **Not ruled:** the `askUserQuestionTimeout` check in `~/.claude/settings.json` (from the source
> report) — owner-side, out of fkit's scope; and any other personal-file change the report proposed.
>
> **Reference wording for item 6 — the owner's personal rule**, as it stood on 2026-10-10 in his
> `~/.claude/CLAUDE.md` (read from this producer's loaded context; the file was not opened or edited).
> It is not in `source-report.md`, which proposes a different option ("Explain it simply first").
> Quoted verbatim:
>
> > ## Asking me questions (AskUserQuestion) — trial, added 2026-09-25
> >
> > - **Explain first.** Before asking, explain the situation in plain, simple terms: what the choice is,
> >   why it matters, and what each option would actually change. Assume I have not followed the details.
> > - **Always offer "Explain more, then ask again".** Every question you put to me with AskUserQuestion
> >   includes this option, worded exactly:
> >   - label: `Explain more, then ask again`
> >   - description: `Give me more context in simple terms, then re-ask the question.`
> >
> >   Put it last; your recommended option stays first. The tool allows at most 4 options, so if a
> >   question needs 4 real options, merge or drop the weakest one so this option always fits.
> > - **If I pick it:** explain in simple terms — more context, plain words, no new jargon — then ask the
> >   same question again, with the same options plus this one again.
> > - **If you cannot ask me directly** (a spawned subagent without AskUserQuestion): return the question
> >   with enough plain-language context that whoever relays it can put it to me without asking you again.
>
> The plan decides which of these four bullets fkit ships. The ruling names the option (bullets 2–3).
> Bullet 1 overlaps item 2 ("explain before you ask"). Bullet 4 overlaps fkit's existing consult rule
> (ADR-021: return open questions). Neither is ruled in or out.
