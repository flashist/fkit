# Give Codex the universal hard rules it has never had

## Sprint
Sprint 2

## Priority
30

## Status
✅ Done

## Context

**The one model fkit *requires* for independent, model-diverse review runs with none of fkit's shared
rules.** Not a design gap — a live defect, shipping today, to every project fkit has ever set up.

The chain, every link verified in
[`reports/2026-07-14-shared-instructions-layer.md`](../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
§3 (hole 2):

1. The adversarial pass shells out to the codex CLI:
   `codex exec --sandbox read-only --cd "$PWD" -` (`claude/skills/fkit-adversarial-review/SKILL.md:42`).
2. Because of `--cd "$PWD"`, **the codex CLI natively reads the project-root `AGENTS.md`**. Init's own
   header comment says exactly this: *"AGENTS.md (the codex CLI reads it for the adversarial pass)"*
   (`claude/fkit-claude-init.sh:9-10`, `:74`).
3. **`claude/scaffold/AGENTS.md` has no universal-hard-rules section at all.** Neither does this repo's
   own `AGENTS.md`. Verified: zero matches for `never commit` / `no secrets` / `wiki writes` in either.

So Codex — the model [ADR-009](../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
makes a **hard prerequisite** precisely so the second opinion is genuinely independent — receives the
project overview, the wiki note, the review-notes note, and the architecture pointer, and **not one** of:
don't commit unprompted, don't write the wiki, don't move task files, **no secrets in any artifact**.

Meanwhile `claude/scaffold/CLAUDE.md:56-63` has carried a **"Universal hard rules (every role, every
session)"** block all along — proven (3/3, Claude Code 2.1.208) to reach both a session and a spawned
consult. **The layer exists. `AGENTS.md` is simply not getting it.**

**This is the highest-value change in the whole shared-instructions investigation, and it is close to
free.** Owner's ruling (2026-07-14): approved, ship on its own merits, independent of everything else.

> **Scope discipline.** This task adds the missing text and nothing else. It builds **no mechanism**.
> The `AGENTS-COMMON.md` splice and any `--append-system-prompt` scheme were **rejected by the owner**
> — see report §4/§5. Do not reach for them here.

## What to build

Add a **"Universal hard rules (every role, every session)"** section to **`claude/scaffold/AGENTS.md`**,
and the same section to **this repo's own `/AGENTS.md`** (fkit dogfoods itself; today it has the hole
too).

**The four rules — same content as `claude/scaffold/CLAUDE.md:56-63`, worded for a Codex reader:**

- **Never commit or push unless the owner explicitly asks.** "Implement" authorizes writing code, not
  committing.
- **Only the wiki role writes `ai-agents/wiki-vault/`.** Reads are decentralized; writes are not.
- **Task files move between `backlog/`, `done/`, `cancelled/` only via the owner-invoked
  `/fkit-task-done` / `/fkit-task-cancelled`** — never on an agent's own initiative.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in findings, reports, docs,
  or wiki pages; it all goes to git.

**Implementation guidance:**

- **Do not copy `CLAUDE.md`'s full team-map section across.** Codex is not a role-locked fkit session and
  has no `/fkit-*` skills; a roster and a hop-budget protocol would be noise in its context. Ship the
  **four rules**, not the surrounding apparatus.
- **Keep it short.** This text lands in the Codex context on **every adversarial pass**. Terse
  imperatives, no rationale essays.
- **Word rule 3 so it is true for Codex.** Codex runs `--sandbox read-only` and cannot move a file
  anyway; the rule's real work there is *"do not tell the coder to move one, and do not report a task as
  moved."* Say the rule, not a fiction about what Codex can do.
- Place it consistently in both files — after `## Project Overview`, before `## Knowledge Base & Wiki`
  reads naturally, but any stable position is fine as long as **both files match**.

**Deliberately not in this task:** making the block fkit-managed / idempotent / merged into an
*existing* `AGENTS.md`. That is **task 31**, and it will convert this section into the marker-delimited
managed block. Some churn on these exact lines is expected and accepted — see Notes.

## Verification steps

- **The rules are actually in both files.**
  `grep -ciE "never commit|no secrets|wiki-vault" claude/scaffold/AGENTS.md` and the same against
  `/AGENTS.md` — both return a non-zero count for **each** of the three patterns. (This is the exact
  grep that returned **0** before the fix. Run it *before* your change too, so you see the defect.)
- **A fresh project actually receives them.** `claude/fkit-claude-init.sh /tmp/fkit-probe-$$` on an empty
  dir → `cat /tmp/fkit-probe-$$/AGENTS.md` contains the four rules. This is the path 100% of new projects
  take.
- **Codex actually sees them — prove it, don't assume it.** This is the only step that verifies the
  *premise* of the whole task, so do not skip it. From this repo's root:
  `codex exec --sandbox read-only --cd "$PWD" - <<< "List the universal hard rules you were given for
  this repository, verbatim. If you were given none, say NONE."`
  → it must return the four rules. **If it returns NONE, stop and report**: the "codex reads root
  `AGENTS.md`" premise (init's own comment, `:9-10`) is false, and the whole task is built on it.
- **No regression in the Claude channel.** `claude/scaffold/CLAUDE.md`'s existing block is unchanged and
  still present.

## Notes

- **Owner: fkit-coder.**
- **Depends on:** nothing. Fully independent — ship it first, ahead of 31 and 32.
- **Blocks: task 31**, which needs one canonical rules text to manage. Landing this first gives 31 the
  content to hoist; landing 31 first would mean writing the merge machinery against text that does not
  exist yet.
- **Accepted churn.** Task 31 will re-cut these same lines into a marker-delimited block sourced from a
  single file. That is a re-cut of ~8 lines, and it is **cheaper than delaying a live defect fix behind a
  mechanism change.** Owner accepted this explicitly.
- **Compliance is advisory, and the brief says so on purpose** (report §6): there are **zero hooks** in
  this repo, and a rule in a context file is prose asking a model to behave. This fixes **delivery**, not
  enforcement. Do not let a reviewer read "structural floor" into it — that overclaim is exactly what
  ADR-012 had to retrofit onto ADR-010, and it is not being repeated.
- **No ADR.** Defect fix against a premise ADR-009 already establishes. *(Whether the **reversal** — the
  rejection of `AGENTS-COMMON.md` and `--append-system-prompt` — gets its own tombstone ADR is a separate
  open question for the owner; it is not this task.)*
- Risk: **low** to implement. Cost of skipping: the adversarial reviewer keeps operating with no floor at
  all, in the one role fkit installed *for its independence*.
