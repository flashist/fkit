# Repair 0177's stale cap and byte figures

## ID
0218

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**Task `0177` is open and three of the figures it pins as acceptance criteria are now false.**

`0177` ("Verify the codex half of the HTML-comment-stripping canary") was written while `0130`'s
measurements were current. It pins those measurements as **hard acceptance criteria** — the values a
worker must reproduce for the task to pass:

| Figure | What `0177` pins | Live value (re-measured 2026-08-05) |
|---|---|---|
| `RULES_MAX` | **4096** | **4352** |
| Emitted block | **3570 B** | **3837 B** |
| Free headroom | **526 B** | **515 B** |

**Why they moved.** Task `0190` shipped an **owner-signed ADR-016 bump** on 2026-08-04, raising
`RULES_MAX` 4096 → 4352 to make room for ADR-037's worker-side precedence clause in
`claude/scaffold/universal-rules.md`. The bump is legitimate and recorded at the `RULES_MAX`
assignment site in `claude/fkit-claude-init.sh`. `0177` simply predates it.

**Why this is urgent rather than tidy.** `0177`'s verification step 4 requires *"`RULES_MAX` is
unchanged at 4096"*, and step 6 requires the block to *"still measure 3570 B with 526 B headroom"*. A
worker who pulls `0177` and follows it faithfully will either **report a failure that is not a
failure**, or — worse — **"restore" the numbers by reverting an owner-signed bump**. The brief is
currently an instruction to undo `0190`.

**What is NOT stale, and must not be swept up in the repair:**

- The **404 B wrapper overhead** figure in `0177`'s `## Context` is still correct — re-measured
  2026-08-05 at exactly 404 B (3837 B emitted − 3433 B source).
- The **standing ≥ 400 B free target** (owner ruling, `0130`) is unchanged and still stands.
- The **standing trap** `0177` records — that "the wrapper costs no agent context" must never become
  an argument for capping the *source* file instead of the *emitted* block (owner ruling 2026-08-01)
  — is unchanged and stays exactly as written.
- `0177`'s actual **subject** — measuring whether `codex-cli` strips HTML comments from `AGENTS.md` —
  is untouched by this repair.

**Conflicts with no locked decision.** This repairs a brief to match an owner-signed decision; it does
not contest one.

## What to build

A **documentation repair to one file** — `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md`.
No source change, no cap change, no change to `0177`'s scope or subject.

1. **Re-measure all three figures first, at repair time.** Do not copy the table above. Read
   `RULES_MAX` from `claude/fkit-claude-init.sh`, and get the emitted block size by running the real
   `emit_block()` (the technique `test/rules-block-budget.test.js` already uses — it runs the real
   shell function rather than reimplementing it, and counts **UTF-8 bytes**, not UTF-16 code units).
   **These numbers move.** If they have moved again since this brief was filed, the newly measured
   values are what goes in, and the difference is called out in the worklog.
2. **Correct the four stale sites in `0177`'s brief.** They are four sites carrying three values:
   - `## Context` — *"costs 404 B of the `RULES_MAX=4096` cap"* → the cap value only; **404 B stays**.
   - `## What to build` §4 — *"The byte figures established in `0130` (3570 B emitted, 526 B headroom,
     ≥400 B standing target) stand."* → correct the two byte figures; **the ≥400 B target stays**.
   - `## Verification steps` §4 — *"`RULES_MAX` is unchanged at **4096**"*.
   - `## Verification steps` §6 — *"still measures **3570 B** with **526 B** headroom"*.
3. **Stamp the correction.** Each corrected figure carries the measurement date and names `0190`'s
   owner-signed bump as the reason it moved, so the next reader does not read the change as drift.
4. **Say the numbers are a snapshot.** `0177` already contains the right instinct at step 6 — *"or, if
   it has legitimately changed since `0130` closed, the new figure is re-measured and reported rather
   than assumed"*. Make that the **primary** instruction at every site rather than the fallback, so
   the next `RULES_MAX` bump does not falsify the brief a third time.
5. **Change nothing else in `0177`.** Not its subject, not its trap, not its owner, not its priority,
   not its status. It stays `🔲 Backlog` and open.

## Verification steps

1. **All three live figures were measured this run, not copied** — the worklog reproduces the command
   used and its raw output for `RULES_MAX`, the emitted block size, and free headroom.
2. **`git diff` touches exactly one file:**
   `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md`.
   Nothing under `claude/`, nothing under `test/`, no board file.
3. **Every occurrence of `4096`, `3570`, and `526` in `0177`'s brief is gone or is explicitly labelled
   as a superseded historical figure.** Verify with `/usr/bin/grep -n '4096\|3570\|526'` over the file
   and account for every hit.
4. **`404` and `≥400`/`400 B` still appear, uncorrected** — a diff that changed either is over-reach
   and is reverted.
5. **`0177`'s scope is unchanged:** its title, `## Owner`, `## Status`, `## Priority`, its codex-canary
   subject, and its standing-trap paragraph are byte-identical before and after, except where a stale
   figure sat inside one.
6. **The repaired brief is internally consistent** — read verification steps 4 and 6 back-to-back and
   confirm they no longer ask a worker to reproduce a number the repo cannot produce.
7. **No test run is required and none is claimed.** This task changes no code. Do not report a suite
   result you did not run.

## Notes

- **Owner:** fkit-producer — a task brief is the producer's artifact, and this is a scope-accuracy
  repair, not implementation.
- **Depends on:** nothing.
- **Blocks:** 0177, 0220.
- **Priority: high for its size.** It is a small edit, but `0177` is pullable **today** and currently
  instructs its worker to revert an owner-signed change. The cost of leaving it is a wrong action, not
  a stale document.
- **Prompted by:** task `0190` (ADR-016 signed `RULES_MAX` bump, 2026-08-04), which correctly changed
  the live values and did not sweep the open briefs that had pinned the old ones.
- **⚠️ Do not fold this into `0177` as a first step.** `0177`'s worker is the party most likely to
  mis-read the stale criteria as a real failure — a repair that only happens once someone pulls `0177`
  has already missed its window.
- **Filed by a spawned producer with no owner channel**, on the owner's ruling of 2026-08-04 (relayed
  through the live `fkit lead` session) to file this follow-up. Filed on the **Backlog board** — it was
  not scoped into Sprint 2, and a spawned producer never ranks (ADR-035).
- No commit — leave the change in the working tree.
