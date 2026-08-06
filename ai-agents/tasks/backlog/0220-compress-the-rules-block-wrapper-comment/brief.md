# Compress the rules-block wrapper comment

## ID
0220

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**`emit_block()` in `claude/fkit-claude-init.sh` wraps the rules source in 404 B of overhead, and
~354 B of that is a prose comment that can be shortened without touching a single rule.**

Measured 2026-08-05: emitted block **3837 B**, source `claude/scaffold/universal-rules.md` **3433 B**,
so **wrapper overhead = 404 B**. Of that, the two marker lines are **50 B** (`<!-- fkit:begin-rules
-->` 26 B, `<!-- fkit:end-rules -->` 24 B) and the four-line explanatory comment is the remaining
**~354 B**. The markers are load-bearing — `emit_block()`, the init script's block-replacement logic,
and `test/rules-block-budget.test.js`'s well-formed-block test all key off them. **The comment is
prose, and prose compresses.**

**This was owner-ruled OUT of `0190`'s scope on 2026-08-04** and deferred to its own task. `0190` was
the ADR-016 signed cap bump (4096 → 4352); compressing the wrapper inside it would have mixed a
budget decision with a text edit.

**What the saving actually buys — the question this task must answer, not assume.**

`test/rules-block-budget.test.js`'s header records, from a first-hand re-run on **2026-08-01, Claude
Code 2.1.220**: HTML comments are **stripped from `CLAUDE.md`** before it reaches agent context — the
rules body arrived, the marker and comment lines did not. **So on the Claude side the wrapper costs
cap budget without costing agent context.** Compressing it there frees cap headroom only.

> ⚠️ **MANDATORY — the codex side must be MEASURED, not inherited.**
> The same comment block, and the twin comment at the `RULES_MAX` site in
> `claude/fkit-claude-init.sh`, record the codex half as **UNVERIFIED**: *"the codex side (`AGENTS.md`,
> `codex-cli 0.145.0`) was not re-measured here; assume it still pays."* That is a **conservative
> default written down as a default** — it has never been measured, on any codex build.
>
> **A brief or a plan that carries "codex still pays" forward as a fact is shipping the exact defect
> class this sprint has spent its whole run repairing: an unverified assumption promoted to a premise
> by being repeated.** The measurement is task `0177`'s job (see `## Notes`). This task **consumes a
> version-stamped measurement or it does not claim a context saving at all.** Three outcomes, and all
> three are acceptable results for this task:
> - **codex strips too** → the wrapper costs **no agent context on either side**; this compression buys
>   **cap headroom only**, and the brief's own value claim must say exactly that.
> - **codex does not strip** → the compression buys **~354 B of real per-turn context on the codex
>   side**, and that is the headline saving.
> - **inconclusive** → the context effect is **unknown**; the compression still buys cap headroom, and
>   the report says "unknown", not "assumed to pay".

**⚠️ Standing trap, inherited from `0130` via `0177` — read before proposing anything.** A finding
that the wrapper costs little or no agent context must **not** become an argument for capping the
**source** file instead of the **emitted** block. **The owner ruled on 2026-08-01 that the cap keeps
measuring the emitted block, unchanged.** If the measurement seems to argue for a semantics change,
that is a **separate proposal put to the owner**, never a change made inside this task.

**Conflicts with no locked decision.** ADR-016's signed-bump discipline is untouched — this task
**lowers** consumption and does not move `RULES_MAX`.

## What to build

**A shorter wrapper comment in `emit_block()`, with zero loss of rule text and zero loss of the
comment's actual warnings.**

1. **Re-measure the baseline first** — emitted block, source size, wrapper overhead, and the comment's
   share of it. Use the real `emit_block()` (the technique `test/rules-block-budget.test.js` already
   uses) and count **UTF-8 bytes**. The figures above are a 2026-08-05 snapshot and will have moved.
2. **Establish the codex-side measurement per the mandatory block above** — consume `0177`'s
   version-stamped result. Record the codex version the result is stamped with. **Do not restate the
   `assume it still pays` line as though it were a finding.**
3. **Compress the four printf lines' prose.** The comment currently carries four distinct pieces of
   information; identify each before cutting, and keep all four:
   - the block is **replaced on every `fkit` launch**;
   - **edits inside the markers are overwritten**;
   - **put your own standing instructions outside the markers**, and everything outside is the
     owner's and is never touched;
   - **a marker is recognized only alone on its line** — so a bare marker line inside a code fence
     still reads as a real marker.
   ⛔ **The fourth is the one that will be cut for being long, and it must not be.** It is the only
   warning about a real footgun in a file the owner edits by hand.
4. **Zero change to rule text.** `claude/scaffold/universal-rules.md` is not touched by this task.
5. **Do not touch the markers.** Their bytes are matched by the init script and by tests.
6. **State the saving honestly** — bytes freed, the new free-headroom figure, and what the saving buys
   per the three-outcome table above.
7. **Change nothing else.** No `RULES_MAX` edit, no cap-semantics edit, no rules-body edit, no change
   to the 92% gate or to the absolute-floor guard (`0219`).

## Verification steps

1. **Baseline and post-change figures are both measured this run** and reported side by side: emitted
   block, source size, wrapper overhead, comment bytes, free headroom. Raw command output quoted.
2. **The comment shrank and the rules body did not change** — `git diff` shows changes inside
   `emit_block()`'s printf lines and **no** change to `claude/scaffold/universal-rules.md`. Confirm the
   source byte count is identical before and after.
3. **All four pieces of information survive.** Quote the old comment and the new one side by side and
   map each of the four to its new wording. A missing one is a failed task, however many bytes it saved.
4. **The markers are byte-identical** — `RULES_BEGIN` and `RULES_END` unchanged, and the well-formed
   block test still passes for both `CLAUDE.md` and `AGENTS.md`.
5. **The codex-side status is stated with its evidence** — either a version-stamped measurement
   (quote it and name the codex version) or an explicit **"unknown / not measured"**. ⛔ A report that
   says the wrapper "costs codex context" without a measurement behind it **fails this step**.
6. **`node --test test/*.test.js` and `bash test/prove-red.sh` both pass**, with counts reported.
7. **Init still round-trips** — run `claude/fkit-claude-init.sh .` and confirm `CLAUDE.md` and
   `AGENTS.md` each still carry exactly one well-formed block and that content outside the markers is
   unchanged (`git diff` on the regions outside the markers is empty).
8. **`RULES_MAX` is unchanged** at whatever value step 1 measured, and the cap still measures the
   **emitted** block. The trap was not walked into: no recommendation to cap the source is folded into
   this task's diff.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0177.
- **Blocks:** nothing.
- **Why the dependency on `0177` rather than a second canary of our own.** `0177` already scopes the
  codex measurement in full, including its version stamp and its three-outcome handling. Running a
  second canary here duplicates the work and creates the possibility of two canaries disagreeing with
  no tiebreak. ⚠️ **If the owner wants this task pulled before `0177`, the measurement moves into this
  task's scope — that is an owner call, not a worker's**, and it is the only sanctioned way to proceed
  without `0177`. What is **never** sanctioned is proceeding on the unverified assumption.
- **⚠️ `0177` itself currently carries stale acceptance criteria** — `0218` repairs them. Pulling
  `0177` before `0218` lands means working from a brief that asks its worker to reproduce byte figures
  the repo can no longer produce.
- **Merit ordering note (soft, not a hard dependency):** landing `0219` first means this compression
  ships against a guarded >= 400 B floor rather than an unguarded one.
- **Priority: low.** Nothing is blocked on this. 515 B free clears the standing 400 B target with 115 B
  of slack (measured 2026-08-05), so this is headroom recovery, not a fix.
- **Prompted by:** task `0190`, during which the owner ruled the compression out of scope (2026-08-04)
  and deferred it here.
- **Owner rulings this task inherits (2026-08-01, from `0130`):** the cap measures the **emitted**
  block; standing headroom target **>= 400 B**; cap rationale is **discipline primary** (ADR-016), with
  attention dilution **suspected but unmeasured and flagged as such**.
- **Filed by a spawned producer with no owner channel**, on the owner's ruling of 2026-08-04 (relayed
  through the live `fkit lead` session) to file this follow-up. Filed on the **Backlog board** — it was
  not scoped into Sprint 2, and a spawned producer never ranks (ADR-035).
- No commit — leave the change in the working tree.
