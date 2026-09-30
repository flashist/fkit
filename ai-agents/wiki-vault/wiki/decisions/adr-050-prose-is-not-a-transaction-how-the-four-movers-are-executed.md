# ADR-050: Prose is not a transaction — how fkit's four movers are executed

**Date**: 2026-09-18
**Status**: accepted — ⚠️ **partly overtaken 2026-09-30 by [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]**

**Source**: `ai-agents/knowledge-base/decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed.md`

> ⭐ **Ingested 2026-09-30** (sync `a351cb6`→`3915417`) — no vault page until this pass.
>
> ⛔ **ADR-052 effect (from 2026-09-30):** the deterministic command this ADR decided to build **is
> `fkit board`**, so its authorised build is **discharged by the board**: `0408` (the command) was
> **cancelled** as obsolete and `0407` (the verifier) was **re-scoped** into the converter's self-check.
> **D2 / B-1 is unchanged.** The B-2 rejection (matching shell text) is overtaken **only** for the board's
> `--by` identity check. ⛔ **Nothing described below was ever built.**

## Context
- **ADR-049 decides what a close CLAIMS; this ADR decides how a close is EXECUTED.** It discharges
  ADR-049's D8 deferral.
- **The measurement** (re-verified against `claude/skills/`, never the gitignored `.claude/` mirror):

  | Mover skill | `SKILL.md` lines | Script that performs a write |
  |---|---|---|
  | `fkit-task-done` | 460 | none |
  | `fkit-task-cancelled` | 422 | none |
  | `fkit-sprint-done` | 456 | none |
  | `fkit-sprint-cancelled` | 476 | none |
  | **Total** | **1,814** | **0** |

  Counting rule: raw `wc -l`, blanks and examples included — an over-count of the procedure proper, and
  still the honest denominator, because every line is context a model must carry to close correctly.
  ⭐ The sprint movers already shell out to the **read-only** `dashboard.sh`, so fkit has proved it calls a
  deterministic helper when one exists — **on the read side only**.
- The finding was the external expert's (*"fkit's 'transaction' is a 460-line prose procedure executed by
  an LLM"*); its figure was right and **understated** — it is four procedures, 1,814 lines.
- The prose movers work: the expert's audit found carriers agreeing on **403 of 405** tasks.

## Decision
Owner rulings, 2026-09-18 — both **selected option text**, he typed no free text:
- **D1 — Option E: build an outcome verifier first, then a real command the skills call.** The verifier is
  the command's acceptance test, because *"there is no test surface today, so a command built first has
  nothing to prove it equivalent to the prose that closed 403 of 405 tasks correctly."* Judgement stays in
  the skill; only mechanics move.
- **D2 — Enforcement B-1: the skill stays the sanctioned entry point**; the ADR-018 `Skill` hook keeps
  gating invocation. ⚠️ **Status quo documented, not strengthened** — a direct `Bash` call to the command
  would bypass the hook, *but so does a direct `Edit` today*. **Producer-only is separation of invoking
  identity, never prevention.** B-2 (a `Bash` matcher) not taken; B-3 (the command checks its caller)
  unavailable — one OS uid.
- **D3 — Not decided:** the folder-move ordering (ADR-047 §4), whether a prototype comes first, and
  `0135`'s disposition.

**Options not taken:** A (do nothing — right only if nothing but a Claude session ever calls the write
path; it permanently forecloses any other caller); C (the command replaces the skills — throws away the
judgement half); D alone (a verifier detects but cannot execute).

⛔ **Accepted was not a work order** — no verifier, command, fixture or prototype was authorised.

## Consequences
- Had B shipped: a callable, testable write path; near-zero per-close cost; a smaller half-landed-close
  class — and **a script that can close wrongly at machine speed**, mitigated by the verifier and a
  `--dry-run`.
- **Residual either way:** fkit is still **not transactional** (neither is aiboard); identity remains a
  claim; extra-hop laundering (ADR-033 *§The limit*) untouched.
- ⭐ **The one paragraph to keep** (the ADR's own closing): a series of failures that each looked like its
  own bug — a producer that could not lawfully repair two characters, a close that half-landed, a guard the
  mover could not see — **were one bug**: the state transition was prose with no call site, no exit code
  and no test. ADR-052 resolves it by moving the transition into the board itself.

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — `fkit board` is the command; the build is discharged
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — the sibling ADR whose D8 this discharges
- [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]] — the reconcile mode (`0135`) a command would have re-homed
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — producer-only; *§The limit*
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — the store decision that needed a command to call
- [[tasks/the-2026-09-30-adr-052-task-dispositions]] — where `0408` was cancelled and `0407` re-scoped
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam]] — `0404`, the evaluation this ADR came out of
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[tasks/sprint-11-fkit-aiboard-convergence]] — the board it was signed on
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[systems/fkit]] — the team page's note that no hook can see a file write
