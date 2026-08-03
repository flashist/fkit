# Re-verify task `0112` by a check that can actually cover it

## ID
0187

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

On **2026-07-25** the owner ruled on task
[`0112`](../../done/0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors/brief.md). `0112` had
shipped and closed as `✅ Done (agent-closed — not owner-verified)` carrying a verification step 4 that
read *"the ADR-027 dual-home parity test passes (live vs scaffold)"* — **and that test did not exist at
the time.** The step was unrunnable when it was claimed. The owner chose not to reopen `0112` and not to
write it off either: **re-verify it by hand once `0133` lands.** That ruling is recorded in
`sprint-2.md` and was carried as a named deliverable on `0133`'s brief.

`0133` has now landed. `test/dual-home-parity.test.js` exists and is green.

### ⚠️ The owner's ruling is undischargeable as written — permanently, not just today

`0133`'s coder and reviewer both walked `0112`'s write surface row by row. **The intersection between
`0112`'s write surface and the dual-home parity surface is empty:**

| `0112` touched | Why the parity test cannot cover it |
|---|---|
| `claude/skills-for-role.sh` | outside both homes |
| `claude/skills/fkit-team/SKILL.md` | outside both homes |
| `claude/README.md` | outside both homes |
| `claude/scaffold/CLAUDE.md` | outside both homes |
| `ai-agents/knowledge-base/architecture.md` | live-only; exempt by decision |

The parity surface is `ai-agents/` ↔ `claude/scaffold/ai-agents/`. **`0112`'s surface lives under
`claude/`, so it will never intersect it** — not after a future edit, not after a future exception-list
change. This is a structural fact about the two surfaces, not a timing problem.

**`0133` was right to refuse to report a pass.** Running the parity suite, seeing green, and reporting
*"0112 re-verified"* would have laundered an unrunnable step into a runnable-looking green — the exact
failure mode the original `0112` close already committed once.

### What `0133` did find

A **substitute check** — grep for `lead` ↔ `sprint-ship-loop` across the source of truth
(`claude/skills-for-role.sh`) and its four documented mirrors — **passes 5/5 today.** So `0112`'s
*substance* appears intact and only its *verification wording* was phantom.

That is an encouraging signal, **not a discharge.** It was run in passing by a coder whose brief did not
scope it, it is not written down anywhere as `0112`'s standing verification, and nobody has ruled that
it is the right check. **The owner's accepted risk on `0112` is still open.**

### Conflict with a prior decision — stated up front

⚠️ **`/fkit-task-done` stops on a folder already under `done/`.** It has exactly one exception — the
**owner-verification upgrade**, which clears `(agent-closed — not owner-verified)` — and that exception
is **owner-only**; an agent hitting the same case still stops. **So whatever this task concludes, only
the owner can change `0112`'s landed status.** This task produces the evidence and the recommendation.
It does not, and cannot, close the loop itself.

## What to build

No code. This is a scoping-and-verification act, owned by the producer.

1. **Name the check that genuinely covers `0112`'s substance.** `0112`'s deliverable was: register
   `fkit-sprint-ship-loop` as lead-owned in `skills_for_role()` **and** keep the four human mirrors
   telling the same story in the same commit. A check that covers that reads the source of truth and
   each of the four mirrors named in `claude/skills-for-role.sh:12-24` and confirms all five agree.
   The substitute grep above is the candidate; adopt it, or state why something else covers it better.
2. **Run it.** Read-only. Record the actual result per file — five rows, pass or fail each — not a
   summary verdict.
3. **State plainly whether `0112`'s substance holds.** If it passes: say so in those words, and say
   that the owner may now discharge the accepted risk knowingly. If it fails: **do not repair it here** —
   a `0112` defect is its own task, not a rider on the check that found it.
4. **Correct the record.** Write down, where the ruling lives, that *"re-verify `0112` once `0133`
   lands"* is **not applicable** — with the reason (empty surface intersection, permanent) — so no
   future reader tries to discharge it that way again. The `0133` close already records this on
   `sprint-2.md`; make sure the `2026-07-25` ruling text itself is not left standing alone.
5. **Hand the owner one decision.** Whether to upgrade `0112` to plain `✅ Done` on the strength of the
   substitute check, or to leave the qualifier and let the check stand as the record. Both are
   defensible; only the owner may execute either.

## Verification steps

1. The check is written down — the exact files compared and the exact token compared — not described
   in prose only.
2. It has been run, and its result is recorded **per file**, five rows, each pass or fail.
3. The task's output states in words whether `0112`'s substance holds.
4. If it failed anywhere, a separate follow-up brief exists for the repair and **no fix was applied
   under this task**.
5. The `2026-07-25` ruling is annotated as not-applicable, with the reason, wherever it is recorded in
   `ai-agents/sprints/sprint-2.md`.
6. `0112`'s own brief and its `done/` folder are **unchanged** — this task does not edit them, and does
   not invoke `/fkit-task-done` on `0112`.
7. The owner has one clearly-stated decision put to them, with a recommendation.

## Notes

- **Owner:** fkit-producer. The check itself is trivial and read-only; the judgment about what counts as
  covering `0112` is a scoping call.
- **Depends on:** nothing. `0133` closed 2026-08-02 and supplied the evidence this brief rests on.
- **Blocks:** nothing.
- ⚠️ **`/fkit-task-done`'s one exception is owner-only.** The skill stops on a folder already in `done/`
  except for the owner-verification upgrade. **Only the owner can change `0112`'s landed status** — an
  agent hitting that case stops. Do not plan around this.
- **Do not treat the passing substitute grep as a reason to skip the task.** The whole failure this task
  exists to close was a verification claimed without being run. Repeating that with a different check
  would be the same mistake in a new coat.
- **⚠️ Priority 165 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately below `0133` — it is `0133`'s only carried-forward producer item, the check
  is minutes of read-only work, and it retires an accepted risk the owner has been holding open since
  2026-07-25. Append rank puts it roughly **35 open rows** below that.
- **Filed 2026-08-02** by a spawned producer with no owner channel, as the single follow-up of `0133`'s
  close. **Appended; nothing inserted, no existing row renumbered** (ADR-035).
