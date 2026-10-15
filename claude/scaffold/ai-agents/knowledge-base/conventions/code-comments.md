# Code comments — say WHY, never WHAT

> **A code comment says why the code is the way it is — never what it does. Keep it to one or two
> lines, and fix or delete a comment the moment your change makes it wrong.**
>
> Owner ruling, 2026-10-10, from the owner's code-comments report (task 0506).

## Why

- **Stale comments — the biggest risk.** Code changes; comments often do not. An agent treats a comment
  as true, so an outdated one gives it confident, wrong information. A wrong comment is worse than none.
- **Token cost.** Every file read pulls its comments into context. A file that is mostly comments fills
  the context window faster and brings compaction sooner.
- **Noise.** When everything is commented, the one warning that matters gets buried.

## The rule

1. **Comment only WHY, never WHAT.** The code already says what it does.
2. **At most 1–2 lines per comment.** A longer reason goes in the knowledge base — an ADR, a
   convention, or the task's worklog — with a one-line pointer in the code. Point **by name or ID,
   never by line number** ([`durable-citation-anchors.md`](durable-citation-anchors.md)).
3. **No history comments** — "changed X to Y", "fixed bug where…", "review finding R2",
   "previously…". Git and the worklog hold the history.
4. **No comments that repeat a name**, like `// get user` above `getUser()`.
5. **Keep a comment for:** a non-obvious decision; a platform, SDK or harness gotcha; a workaround and
   the reason it exists; a rule that must not be broken (a guard's reason).
6. **When you change code, fix or delete any comment the change makes wrong — in the same edit.**
7. **Doc comments on public functions and exports: one short line**, unless the function is genuinely
   complex.

## Scope

- **Covers code:** source, scripts, tests and config.
- **Does not cover prose documents.** Markdown docs and agent or skill prompt files are instructions,
  not code; their text is not held to this rule.
- **New and edited code, not a wholesale rewrite.** A comment in code you edit follows the rule.
  Existing comments elsewhere are left alone; cleaning them up is separate, comments-only work that
  changes no behavior.

## Precedence

- **A project's own written comment rules win** — for example, a required doc-comment format.
- **"Match the surrounding code" means naming, structure and idioms. It never means comment density.**
  A heavily commented file is not a reason to comment heavily.

## Where this is enforced

In prose only: one line in the shared rules block (`CLAUDE.md` / `AGENTS.md`) and the coder's prompt
both point here. A reviewer may raise a violation as a finding. **Nothing checks it automatically** —
an instruction is a request, not a guarantee. If over-commenting continues, look first for a rule
somewhere that still pushes the other way, before strengthening this one.
