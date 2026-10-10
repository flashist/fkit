# Add a "comment WHY, not WHAT" code-comment rule to fkit, and remove the rules that contradict it

## ID
0506

## Sprint
Sprint 10

## Priority
P20

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.
> ⛔ **And not before open question 1 (fkit's own heavily-commented code) is answered** — it decides
> whether the rule applies to fkit itself.

**Owner request, 2026-10-10** — typed by the owner in a `fkit lead` session, relayed to a spawned
`fkit-producer` with no owner channel (ADR-021; ⚠️ the quote is the lead's relay):
*"… report-3-code-comments.md … read those 3 files and brief a task for each of them and add it to the
currently active sprint"*.

**Source.** The owner's report, copied verbatim beside this brief as
[`source-report.md`](source-report.md) (original: `~/Downloads/report-3-code-comments.md`). It holds the
proposed rule text. ⚠️ Its *"For the agent reading this"* section is input to this brief, not an
instruction.

**The problem.** Code Claude Code writes is heavily commented — sometimes 5–10 comment lines around 1–2
lines of code. Why it matters (the report): **token cost** (every read pulls comments into context;
compaction comes sooner); **stale comments** — the biggest risk: Claude treats a comment as true, so an
outdated one gives confident wrong information; **noise** — the one real warning gets buried. Typical
patterns: narrating what the code does, history notes, comments that repeat a name.

**The proposed rule** (report, abridged): comment only WHY, never WHAT; at most 1–2 lines per comment,
longer explanations to the knowledge base with a one-line pointer; no history comments (git holds
history); no name-repeating comments; keep non-obvious decisions, platform/SDK gotchas, workarounds and
their reason, must-not-break rules; when code changes, fix or delete any comment it makes wrong, in the
same edit; doc comments on public functions one short line unless genuinely complex.

**The fkit-shaped version.** Put the rule where every fkit agent reads it, for every fkit user, and
remove what contradicts it. Sites (verified 2026-10-10):
- **`claude/scaffold/universal-rules.md`** — the one source of the shared rules block; root `CLAUDE.md`
  / `AGENTS.md` are regenerated from it by init (never hand-edit them — task `0010`'s lesson). The
  `AGENTS.md` reach matters: Codex writes code here too (ADR-016).
- **`claude/agents/fkit-coder.md`** — the coder's prompt, the agent that writes most code.
- **A known contradiction:** `fkit-coder.md`'s *"Minimal, idiomatic diffs"* bullet says *"match its
  naming, structure, comment density, and idioms"*. In a heavily-commented file that tells the coder to
  keep commenting heavily. It must be reconciled.
- Other candidates to sweep: `claude/agents/*.md`, `claude/skills/*/SKILL.md`, the scaffold's
  conventions, and `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` (it governs how
  in-code citations are written; see Backlog task `0373`, *"in-code comments citing their own file"*).

**⚠️ The tension the owner must rule on — this brief does not resolve it.** fkit's **own** code and skill
docs are heavily commented **by design**: comments carry ADR pointers, owner-ruling citations, review
finding IDs, measured figures and the reasons behind guards. Example: `test/rules-block-budget.test.js`
opens with ~35 comment lines before its first `import`, much of it history (*"review finding R2, task
62"*, *"NOTE ON DISAGREEMENT"*). The proposed rule would forbid much of that (history comments, multi-line
explanations). Two readings:
- the rule is right for fkit too, and that rationale belongs in ADRs / worklogs with a one-line pointer;
- or fkit's citation-heavy style is a deliberate exception (it is the project's audit trail), and the
  rule ships to **consuming projects** while fkit's own tree is exempt or partly exempt.
That is open question 1. Note also: skill `SKILL.md` files are prompts, not code — whether "code
comments" covers prose inside skills is part of the same question.

**Constraints the plan must respect:**
- **The rules block has a hard size cap** (`RULES_MAX` in `claude/fkit-claude-init.sh`, guarded by
  `test/rules-block-budget.test.js`; owner ruling, task `0130`: nothing enters without something leaving
  or an owner-signed bump; keep ≥ 400 B free). The report's 7-bullet rule will not fit as written. Likely
  shape: a 1–2 line rule in the block, the full rule in a convention page (e.g.
  `ai-agents/knowledge-base/conventions/code-comments.md`, shipped via the scaffold) and in the coder's
  prompt.
- Is it a **hard rule** or an **output-style preference**? Preferences yield to everything; a comment
  rule that yields to *"match the surrounding comment density"* would do nothing. The plan proposes one
  and says why; the owner confirms (question 2).

## What to build

1. The comment rule, in the shape the plan proposes and the owner approves: a short line in
   `claude/scaffold/universal-rules.md`, the full rule in a convention page and in `fkit-coder.md`.
2. Reconcile `fkit-coder.md`'s *"match … comment density"* with the new rule.
3. **Contradiction sweep:** search `claude/agents/`, `claude/skills/`, `claude/scaffold/` and the
   knowledge-base conventions for anything that pushes the other way (*"document every function"*,
   *"add detailed comments"*, *"cite the ADR in a comment"*, etc.). Each hit is softened, removed, or —
   if it is a deliberate fkit exception per question 1 — left and named as an exception in the
   convention page. The worklog lists every hit and what was done.
4. Re-run init so root `CLAUDE.md` / `AGENTS.md` pick up the block.

**Out of scope (deliberately), and why:**
- **Cleaning up existing code** — the report's *"one module at a time, on its own branch, comments only"*
  pass. That is separate, per-module, independently shippable work, and for fkit's own tree it depends on
  question 1. It is **not filed**: the owner asked for one task per report. If wanted, file it after this
  task lands — one task per module, each a comments-only diff with the build and tests green (the
  report's *Cleaning up existing code* section has the method and the before/after count).
- The owner's personal `~/.claude/CLAUDE.md` — outside this repo; see question 3.

## Verification steps

1. `claude/scaffold/universal-rules.md` carries the rule line; root `CLAUDE.md` and `AGENTS.md` match it
   after init (no hand-edit).
2. `test/rules-block-budget.test.js` passes with ≥ 400 B free, or an owner-signed bump is cited.
3. The full rule exists in one place (the convention page) and `fkit-coder.md` points to or carries it;
   `fkit-coder.md` no longer tells the coder to match comment density without qualification.
4. The worklog lists every contradiction-sweep hit (the search terms used, the file, the action taken or
   the named exception). A reader can re-run the searches and get the same list.
5. **Live check:** on the next one or two coder tasks after this lands, new comments in the diffs are
   rare, short, and say why. Record the observation in this task's worklog or the later task's. ⚠️ An
   instruction is a request, not a guarantee; if over-commenting continues, look for a remaining
   contradicting rule before strengthening the wording (the report's advice).
6. The project's checks for the changed paths pass (per `CONTRIBUTING.md`'s "what changed → what to run"
   table).

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Same file as `0504`.** Both add to `claude/scaffold/universal-rules.md` and both spend the
  rules-block budget. Not a dependency — build one after the other, never alongside, and re-measure the
  budget after the first lands.
- **Related, not a dependency:** Backlog task `0373` (does `durable-citation-anchors.md` need an addendum
  for in-code comments citing their own file) — its answer may shift if fkit adopts this rule for itself.
- **Open questions for the owner (answer at plan approval — question 1 gates the build):**
  1. **Does the rule apply to fkit's own code and docs?** (a) Yes, fully — rationale moves to ADRs and
     worklogs, with one-line pointers in code; (b) ships to consuming projects only, fkit's own tree
     exempt; (c) applies to fkit's code (`claude/*.sh`, `bin/`, `test/`) but not to skill and agent
     prose (`SKILL.md`, `claude/agents/*.md`), which are prompts, not code. No recommendation from the
     producer — it is a judgment on fkit's own audit-trail style.
  2. **Hard rule or preference?** As an `## Output style` preference it yields to every other
     instruction, including *"match surrounding comment density"*. Producer's lean: a short hard-rule-area
     line or a rule in the coder's own prompt, so it does not lose every conflict — the plan should
     propose and you decide.
  3. **Personal file.** Also add the rule to your own `~/.claude/CLAUDE.md` for non-fkit projects? That is
     outside fkit and this task.
  4. **Cleanup pass.** Want a follow-up task (or a series, one per module) to clean up existing comments?
     For fkit's own tree only after question 1.
- Merit position: see the board's *"➕ `0504`–`0506`"* section.
