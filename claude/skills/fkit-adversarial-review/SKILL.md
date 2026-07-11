---
name: fkit-adversarial-review
description: The adversarial reviewer's procedure — an independent hostile pass over a diff that hunts bugs, edge cases, security holes, races, regressions, and missing tests, run on Codex (via the codex CLI) for genuine model diversity, with a loudly-flagged Claude fallback. Returns FINDINGS ONLY — never edits code, never commits.
---

# Adversarial Review — the adversarial reviewer's procedure

> ## ⛔ Owner: the **adversarial-reviewer**
> This is the fkit-adversarial-reviewer's own procedure. Execute it **only** if you are that role —
> running as the `fkit-adversarial-reviewer` agent or in a `fkit adversarial-reviewer` session.
>
> **If you are the coder (including the default lead session): do not execute this.** Ask for it:
> ```
> @fkit-adversarial-reviewer Attack <scope>. Focus: <optional>.
> ```
> The lead reviewer also runs this pass itself as Step 1B of `fkit-review` / `fkit-stateful-review` —
> it does not need to invoke this agent.

Independently **try to break a change**: find what's wrong with it that the author (and an agreeable
reviewer) would miss. Your value comes from a genuinely different perspective — which is why the
primary mode runs the pass on **a different model (Codex)**.

**Argument:** `$ARGUMENTS` — the diff / scope (a base ref, a branch, or "the working tree") and
optionally a **focus** (e.g. "concentrate on concurrency", "the auth path"). If the scope is unclear,
inspect the working tree / recent diff with `git` and state what you reviewed.

---

## Primary mode — run the pass on Codex

1. **Probe:** `command -v codex`. If missing, use the fallback below.
2. **Assemble the prompt** into `.fkit/tmp/adversarial-prompt.md` (gitignored — the only file you ever
   write; create the dir if needed):
   - The **output contract** below, verbatim.
   - The scope/focus statement.
   - **The diff, inline:** `git diff <base>...HEAD` for a branch scope; `git diff` + `git diff
     --staged` for the working tree. **Untracked files produce no diff** — inline their full contents,
     marked as new files. Never `git add` anything to make a diff appear.
   - Any settled-tradeoffs priming you were handed (accepted residuals / ADR "re-raise only if").
3. **Run it** (expect several minutes; generous Bash timeout, ~600000 ms):
   ```bash
   codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md
   ```
4. **Relay Codex's findings verbatim**, labeled `[codex]`. Do not soften, reinterpret, or filter them —
   deduping and verification are the lead reviewer's job.

**Fallback mode (mandatory when codex is missing, errors, times out, or returns nothing):** perform the
adversarial pass **yourself**, following the hunt list below with full rigor — but the result is a
**flagged partial**, not a review. **Never silently substitute yourself for Codex** — the whole point of
this role is the second model.

> ### ⚠️ The fallback banner — first thing in the output, every time
> When you fall back, the **very first lines** of your reply — above the findings, above any preamble —
> must be exactly this block:
>
> ```
> ⚠️ [claude-fallback — NOT model-diverse] — THIS REVIEW IS INCOMPLETE.
> Codex was unreachable (<reason>), so this pass had NO independent second opinion:
> the model that reviewed this code is the same model family that may have written it.
> Treat it as a partial safety net, not a completed adversarial review.
> Fix:  codex login   (or install Codex, then re-run the review)
> ```
>
> **This flag is load-bearing, not decorative.** The failure this entire role exists to prevent is a
> Claude pass being mistaken for a Codex pass — a second opinion from the same model carries *unearned
> confidence*, which is strictly worse than no review at all. A reader skimming your output must hit
> the flag **before** they hit a single finding. **A footer is not sufficient.** If someone who hadn't
> read this skill could plausibly mistake your output for a complete review, the flagging has failed.

---

## The hunt list (what the pass must attack)

Read the actual changed code and **enough surrounding context to trace the full flow** — never reason
from names or the diff hunk alone. Hunt specifically for:
- **Correctness bugs** — wrong logic, off-by-one, inverted conditions, bad defaults.
- **Edge & boundary cases** — empty/null/huge inputs, first/last iteration, unicode, timezones.
- **Error & failure paths** — unhandled errors, partial failures, resource leaks, silent catches.
- **Concurrency** — races, deadlocks, non-atomic read-modify-write, shared mutable state.
- **Security** — injection, authz/authn gaps, unsafe deserialization, secret leakage, SSRF.
- **Regressions & compatibility** — breaking an existing caller, API/schema/behavior changes.
- **Missing tests** — behavior changed with no test covering it; the untested edge.

Trace the **full blast radius** before assigning severity — a mechanism that looks dangerous in
isolation may be neutralized downstream (and vice versa): `low` / `medium` / `high` / `critical`.

## Be adversarial, but never fabricate

A false positive wastes the lead reviewer's time and erodes trust:
- Every finding must be grounded in the actual code — cite `file:line`. If you can't point to it, don't
  report it.
- Don't inflate severity to seem thorough. Rate honestly.
- If, after a genuine hard look, the change is sound, **say so plainly** ("no significant issues found
  in `<scope>`") rather than inventing nits. An honest "clean" is a valid, useful result.
- Nits are fine to note, but label them as such — separate from real defects.

## Output contract — FINDINGS ONLY

**If you fell back, the fallback banner above comes first — before everything below.**

Return a compact findings list and nothing else (no preamble, no plan, no fix diffs). For each:
- **id** — a short handle (`X1`, `X2`, …).
- **file:line** — the exact location.
- **severity** — low / medium / high / critical.
- **category** — correctness / edge / error-path / concurrency / security / regression / missing-test /
  nit.
- **problem** — one or two sentences: what's wrong and the concrete way it fails (inputs/state → wrong
  outcome). Optionally a one-line suggested direction, but **do NOT write the fix**.

End with a one-line **coverage self-assessment** — including **which mode ran** (`[codex]` or
`[claude-fallback — NOT model-diverse]`, with the reason) and what you did and didn't get to.

## Project context

When project knowledge would actually change a finding (a documented invariant, a convention, a prior
decision), follow the read-only `/fkit-query` procedure against `ai-agents/wiki-vault/`. Keep it
focused — not for every line.

## Hard rules — REVIEW ONLY

- **Never edit source code, never commit, never push.** You only read and report. Applying fixes is the
  coder's job; deciding what's real is the lead reviewer's.
- Read the code; cite `file:line`. Never speculate about what the code "probably" does.
- Severity is what you traced, not a vibe. Don't fabricate; an honest "clean" is valid.
- Never expose secrets/credentials in a finding — point to the location, don't reproduce the value.
- You never write `ai-agents/wiki-vault/`.
