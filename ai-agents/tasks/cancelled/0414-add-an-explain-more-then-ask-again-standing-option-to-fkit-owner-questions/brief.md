# Add an "Explain more, then ask again" standing option to fkit owner questions

## ID
0414

## Sprint
Backlog

## Priority
Unscheduled

## Status
⛔ Cancelled (agent-closed — not owner-verified) (2026-09-25) — Owner cancelled it on 2026-09-25 — he is trialling the "explain first" + "Explain more, then ask again" rules in his personal global CLAUDE.md first; whether to bring them into fkit is deferred, and he will decide later (a new task would be filed then). The brief's open questions (shared rules-block byte cap; what "fkit only" covers) stay recorded in the brief for that decision.

## Owner
fkit-coder

## Context

### The owner's request — his own words (typed 2026-09-25, `fkit lead` session, relayed by the lead)

> "I've noticed that very often when When I discuss something with Claude, whether it is F-Kit or not,
> It gives me very limited context about it, very limited amount of information about it. [...] it asks
> me a question it gives me a few options and one of the options is where I can type something myself
> [...] and I found myself to be using this option a lot and basically what I do every time I say the
> same phrase. Give me more context in simple terms and then re-ask the question. So I wonder if it's
> possible to... Build it into the way I work with [...] Claude Code So it's not me who always type the
> same message, but it's rather one of the predefined options. In this interactive ask user tool."

### Owner ruling on scope — his own typed answer, 2026-09-25

> "Let's do it for the fkit only, for testing. Maybe later I will do it as global settings"

So: **fkit only. NOT his global `~/.claude/CLAUDE.md`.** It is a test; he may later move it to global
settings himself. It takes effect in **new sessions only** (the rules are read at session start).

### Real evidence it is needed

Per the lead: in the 2026-09-23 lead session the owner answered a review-disposition question with
exactly *"Give me more context, in simple terms, and then re-ask the question"* — typed into the
free-text slot. (Relayed by the lead; the producer did not re-read that transcript.)

### The draft behaviour — a DRAFT, not approved wording

The lead proposed two parts; the owner picked the **placement** (fkit only), **not the wording**. The
coder's plan proposes the final wording for owner approval.

1. **Explain first.** Before any `AskUserQuestion`, give plain-language context: what the choice is,
   why it matters, what each option would actually change. Assume the owner has not followed the
   details.
2. **Standing option.** Every `AskUserQuestion` question carries an option labelled
   **"Explain more, then ask again"** (description: *"Give me more context in simple terms, then re-ask
   the question."*). If picked: explain in simple terms, then re-ask the **same** question with the
   **same** options, plus this one again.

### Facts that constrain the design

- **This is an instruction, not enforcement.** `AskUserQuestion`'s options are written by the model on
  every call. The free-text "Other" slot is built in. There is **no harness setting** for a fixed
  option. So the standing option exists only because the rules tell the model to add it.
- **The tool allows at most 4 options per question.** The standing option costs one slot — 3 real
  choices left. The plan must decide how this interacts with (a) "mark your recommendation" (the
  recommended option is conventionally listed first) and (b) questions that genuinely need 4 real
  options. E.g.: may such a question drop the standing option, or must it cut to 3 real options, or
  merge two? One rule, stated plainly.
- **Spawned consults have no `AskUserQuestion`**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md))
  — they return open questions. The rule must say what a consult does instead. Draft: a returned
  question carries enough plain context for the lead to relay it, and **the relaying session adds the
  standing option** when it calls the tool. Note the ship-loop relay contract
  (`NEEDS-DECISION { question, options[], recommendation, context }` in `fkit-sprint-ship-loop`) —
  a worker returning 4 options leaves the relayer no free slot.
- **Where the shared rule lives (producer's read — the plan must confirm):**
  - Canonical source: `claude/scaffold/universal-rules.md`, the **"Ask interactively"** bullet in the
    Output style section.
  - `claude/fkit-claude-init.sh` writes it, between the `fkit:begin-rules` / `fkit:end-rules` markers,
    into the `CLAUDE.md` **and** `AGENTS.md` of every project where `fkit` launches — including this
    repo's own `CLAUDE.md` / `AGENTS.md`, which already carry the same bullet. So a change there
    reaches every fkit-installed project on its next `fkit` launch, and reaches Codex via `AGENTS.md`
    (Codex has no `AskUserQuestion`; the rule should be harmless there).
  - Other places that restate the "mark your recommendation" guidance: `claude/agents/fkit-coder.md`
    (≈ line 256), `claude/agents/fkit-architect.md`, `claude/skills/fkit-inspect/SKILL.md`.
  - Skills that script `AskUserQuestion` calls: `fkit-sprint-ship-loop` (plan approval, decision
    relays), `fkit-heal` (the consent question), `fkit-open-questions-interview`; also
    `claude/agents/fkit-lead.md` (holds the owner channel).
- **No test pins the bullet's wording** (grep of `test/` for "Ask interactively" / "mark your
  recommendation": no hits, 2026-09-25). `universal-rules.md` is **excluded** from the structure hash
  manifest (`bin/generate-structure-manifest.mjs`), so no manifest regeneration is expected — the plan
  confirms.
- **⚠️ The rules-block size budget is the real constraint.** `test/rules-block-budget.test.js` guards
  `RULES_MAX=4352` B on the **emitted** block (source + markers + wrapper comment). Measured by the
  producer 2026-09-25: emitted block **3906 B → 446 B free**. The owner's standing target (task 0130)
  is **keep ≥ 400 B free** — so only **~46 B** can be added inside the target, and ~446 B before init
  **refuses to write the block at all** (exit 1, every project silently stops getting its rules).
  The two-part rule as drafted will not fit in 46 B. See NEEDS-DECISION in Notes.

## What to build

1. **Plan first** (`/fkit-plan-task`). The plan must settle, for owner approval:
   - the **final wording** of the explain-first rule and the standing option (label + description);
   - the **4-option rule** (how the standing option coexists with the recommendation and with
     4-real-option questions);
   - the **consult rule** (what a spawned worker returns; who adds the standing option on relay);
   - **placement**, given the budget — see NEEDS-DECISION. Options the plan should weigh: (a) edit the
     shared bullet inside the ≥400 B target by tightening existing wording elsewhere in the block;
     (b) an owner-signed cap bump per ADR-016 (precedent: task 0190 raised 4096 → 4352);
     (c) put the rule in role prompts / the skills that script `AskUserQuestion` instead of the shared
     block; (d) put it only in **this repo's** `CLAUDE.md`, **outside** the markers (zero budget cost,
     but reaches this repo only, not other fkit-installed projects).
   - whether any role prompt or skill needs touching beyond the shared rule. **Keep it minimal** —
     touch a skill only where it scripts a fixed option list that would otherwise leave no slot (e.g.
     the ship-loop plan-approval question, the `fkit-heal` consent question).
2. **Edit the canonical sources in `claude/`**, never the `.claude/` copies. Refresh this repo via
   `claude/fkit-claude-init.sh .` so this repo's own `CLAUDE.md` / `AGENTS.md` blocks match.
3. Keep every existing clause of the "Ask interactively" bullet (batch related questions; mark your
   recommendation; consult returns questions) unless the plan names one it replaces and why.

## Verification steps

1. `node --test test/rules-block-budget.test.js` passes, and the plan/worklog records the new emitted
   block size and free bytes — and states whether the ≥ 400 B target still holds (or cites the owner
   ruling that changed it).
2. The full test suite passes (`npm test` or the repo's documented runner) — no regressions.
3. After `claude/fkit-claude-init.sh .`, this repo's `CLAUDE.md` and `AGENTS.md` managed blocks contain
   the new wording **byte-identical** to `claude/scaffold/universal-rules.md` (diff shown in worklog).
   (If placement (d) was chosen instead: the text sits outside the markers and survives a re-run of
   init unchanged.)
4. **Live check, new session** (owner or lead, recorded in the worklog): open a fresh `fkit` session,
   trigger any `AskUserQuestion`; confirm (a) plain-language context precedes the question, (b) the
   **"Explain more, then ask again"** option is present, (c) picking it yields a simple explanation and
   then the **same** question with the **same** options plus the standing option again.
5. **Consult check:** spawn one consult that must return an open question; confirm the returned
   question carries plain context, and that the relaying session adds the standing option when it asks.
6. `grep` confirms no stale contrary wording remains in the files the plan touched (e.g. a skill that
   still mandates exactly 4 options with no slot for the standing option).

## Notes

- **⏸ PARKED — 2026-09-25: owner changed placement; trial moved to his personal global rules.** His
  own typed words (2026-09-25, `fkit lead` session, relayed by the lead):
  > "Okay, I've changed my mind: for a simple test - let's make it a global rule for now. I don't want
  > to mess with the limits of the fkit's wording caps, so I will test it first as a global test, and
  > then decide if I want to keep it or if I want to add it as a part of fkit."

  This **supersedes** his earlier "fkit only, for testing" ruling (Context above). The rules are now
  being trialled in **the owner's personal global CLAUDE.md** (outside this repo) — written there by the
  lead on 2026-09-25, at the owner's direction. **Do not plan or build 0414** until the owner decides to
  bring the rule into fkit. Status stays 🔲 Backlog. The two NEEDS-DECISION items below (rules-block
  byte cap; what "fkit only" covers) **stay open** for that moment. The "do not touch global settings"
  note below applies to fkit work on this task, not to the owner's own trial.
- **Depends on:** nothing
- **Blocks:** nothing
- **⚠️ NEEDS-DECISION (owner) — placement vs the rules budget.** The owner ruled "fkit only", and the
  lead proposed the shared rules block. But the block has only ~46 B left inside the owner's standing
  ≥ 400 B free target (446 B to the hard cap). Fitting this rule there needs either tightening other
  bullets, or an owner-signed cap bump (ADR-016). The alternative — this repo's `CLAUDE.md` outside the
  markers — costs no budget but reaches only this repo. The plan presents the choice; the owner decides.
- **⚠️ Interpretation to confirm — what "fkit only" covers.** Producer's reading: "fkit sessions, not
  my global settings". Via the shared block that means **every fkit-installed project** gets it on next
  launch, and — because it lands in the project's `CLAUDE.md` — **plain (non-fkit) Claude Code sessions
  in those projects** read it too. If the owner meant "this fkit repo only", placement (d) is the
  literal match.
- **Instruction, not enforcement** — say so in the rule's own record (worklog / plan), so nobody later
  expects the harness to guarantee the option.
- **Later move to global settings is the owner's own act** — out of scope; do not touch
  `~/.claude/CLAUDE.md`.
- No absolute machine paths in any artifact.
