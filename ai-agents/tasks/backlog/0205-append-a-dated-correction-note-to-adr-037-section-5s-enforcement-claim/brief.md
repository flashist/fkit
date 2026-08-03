# Append a dated correction note to ADR-037 §5's enforcement claim

## ID
0205

## Sprint
Sprint 2

## Priority
183

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Follow-up 4 of [`0162`'s decision report](../../../knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md)**
(§10 row 4, §7). **REQUIRED** — the owner ruled it so on `0162`'s OQ-3, and ruled it an **ADR amendment**,
not a report note.

ADR-037 §5 *Enforcement* states, at
`ai-agents/knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md@2026-08-02:249-250`:

> **Prose is proportionate. There is no mechanical enforcement, and none is possible — stated plainly
> rather than promised.**

`0162` established (`F3`, §6) that this is **too strong** — but **only about a proxy**, and the note must
say so in exactly those terms.

## What to build

**A dated correction note appended to ADR-037 §5.** Precedent for the form: `0143`'s dated correction
notes to ADR-010, and the form `0195` extended. **Note, not a rewrite** — the note goes **below** the
claim it corrects; the original claim stays byte-unchanged.

The note must state **all five** of the following:

1. ***"none is possible"* holds for condition (a), for condition (c), and for condition (b) as written.**
   Condition (b) reads *"it carries a concrete **approved** plan verbatim"* (same ADR file at
   `@2026-08-02:96-97`; `claude/agents/fkit-coder.md@2026-08-02:65-66`). **(b) asserts the plan was
   *approved* — no hook reaches approval**, which lives in a session channel that leaves no artifact
   (ADR-021).
2. **What it does not hold for is a *carry-fidelity proxy for (b)*** — *the prompt contains the bytes of
   the file at path P with hash H* — which **is** mechanically checkable **driver-side**, by a
   `PreToolUse` hook on the `Task` matcher, once `plan.md` exists at spawn time (`0162` `F3`, `F2`).
3. **⛔ The note must NOT say condition (b) itself is machine-checkable.** This is the single most
   important constraint on the wording. A proxy for (b) is checkable; (b) is not.
4. **This is a NARROWING, not a reversal.** All three conditions remain unverifiable **as written**; a
   conjunctive marker is only as strong as its weakest signal; and the check applies in **launcher
   sessions only**, at **time-of-check only**.
5. **ADR-037's pre-registered re-raise trigger has NOT fired.** That trigger (`@2026-08-02:362-364`) is
   *"a cross-context verification token"* becoming available in the harness. **A file on disk is not a
   cross-context token** — this does not satisfy it. The note must also state that it does **not** re-raise
   the fenced items at `@2026-08-02:365-367`: forgeability and unenforced-prose stay untouched.

⛔ **Constraints:**
- **APPEND ONLY.** Prove `+N / −0` by `git diff --numstat` and `git diff -U0 | grep '^-'` — **not by eye**.
  The one sanctioned exception, if the ADR's header carries a `- **Corrections:**` bullet, is that metadata
  bullet (the `0195` precedent); justify it in the worklog.
- **ADR Status stays `accepted`.** Do not change it.
- Do not edit ADR-037's existing prose, decision text, or date.
- Do not touch `claude/`, `test/`, any task brief, or `ai-agents/wiki-vault/`.

⚠️ **This brief's `path@date:line` coordinates were verified 2026-08-02. Re-verify at implementation
time** — ADR-037 is a young file and other rows append to it.

## Verification steps

1. `git diff --numstat` on the ADR shows **`+N / −0`** (or `+N / −1` with the sanctioned
   `- **Corrections:**` header bullet, worklog-justified). `git diff -U0 | grep '^-'` returns nothing else.
2. The note contains an explicit statement that *"none is possible"* **holds for (a), (c) and (b) as
   written**.
3. The note contains the phrase **carry-fidelity proxy** (or an unambiguous equivalent) and attributes
   checkability to **the proxy**, not to (b).
4. **Grep the note for any claim that condition (b) is machine-checkable. Zero occurrences.** Any such
   claim is a defect and fails this task.
5. The note states **narrowing, not reversal**, and names both limits: **launcher sessions only** and
   **time-of-check only**.
6. The note states the re-raise trigger at `:362-364` has **not** fired, giving the reason (*a file is not
   a cross-context token*), and that `:365-367`'s fenced items are not re-raised.
7. The ADR's `Status:` line is unchanged and still reads `accepted`.
8. The note sits **below** the claim it corrects, per the `0143` `R1-placement` residual (recorded
   rationale — do not re-litigate).
9. `git status` shows exactly one modified file under `ai-agents/knowledge-base/decisions/`. `npm test`
   green (this should not touch it — but `test/adr-number-uniqueness.test.js` exists, so run it).

## Notes

- **Depends on:** nothing. It records a finding that already exists in `0162`'s report; it does **not**
  wait for `0202`/`0203`/`0204` to land. State in the note that the proxy is checkable **once those land**,
  not that it is checked today.
- **Blocks:** nothing.
- **⚠️ Priority 183 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0204`** — it is record accuracy over a live ADR, real but not
  urgent, and it reads more clearly once the reader can see the three implementation rows above it.
- **⚠️ Related open row:** `0198` (teach `/fkit-record-decision` the dated-correction-note form) would
  give this task a procedure to follow. It is **not** a dependency — `0143` and `0195` are sufficient
  precedent — but if `0198` lands first, follow it.
- **Source:** `0162`'s decision report §10 row 4, §7 (both halves — the strengthening and the
  over-strong §5), §11 (OQ-3's ruling).
