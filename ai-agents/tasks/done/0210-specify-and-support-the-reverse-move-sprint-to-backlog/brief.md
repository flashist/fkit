# Specify and support the **reverse move** — sprint → Backlog board

## ID
0210

## Sprint
Sprint 2

## Priority
188

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### The gap

`ai-agents/sprints/backlog.md` and `claude/skills/fkit-task-brief/SKILL.md` both specify the **forward**
move — backlog board → sprint — in full: three mandatory edits, a canonical marker
`➡️ Moved to [Sprint N](sprint-N.md) — priority M`, and an explicit warning about the drift a skipped
edit causes.

**The reverse move — sprint → backlog board — is specified nowhere, and the tooling does not support
it.** Nothing in the repo says what marker a de-scoped sprint row takes, which files must change, or
what happens to the row's rank.

### Why this is being built now, out of merit order — and the tension in that

⚠️ **State this plainly rather than let it read as a normal justification pass.** A standing rule
adopted in the live lead session of **2026-08-03** says: a new brief defaults to the Backlog board;
a **Sprint 2** row needs one of exactly two justifications — (1) something already in Sprint 2 depends
on it, or (2) a live control is broken.

**This brief passes neither.** Nothing in the repo emits a `Moved to Backlog` marker today, so no live
control is currently misbehaving, and no surviving Sprint 2 row depends on this work.

It is filed into Sprint 2 on a **third and different basis: an explicit owner ruling**, given via
`AskUserQuestion` in the live lead session on **2026-08-03**. The owner was shown the three candidate
forms and their measured costs, was told the price (the sprint-2 triage's 52→7 reduction does not land
until this ships), and ruled **"extend the marker and the parser first"** — on the reasoning that this
is the **second** time an unspecified reverse operation has bitten this board. **45 authorized task
moves are queued behind this brief and cannot execute until it lands.**

**This is an owner-instruction exception, not a justification-1 or justification-2 pass.** Do not cite
it as precedent for filing into a sprint on merit.

### The measured evidence — verified first-hand, 2026-08-03

Three candidate forms were measured against the real
`claude/skills/fkit-status/dashboard.sh` using throwaway fixtures:

| Candidate | Sprint open-count drops? | Cost |
|---|---|---|
| Leave the cell `🔲 Backlog`, flip only the brief's `## Sprint` | **No** — the row still counts as open | none, but it does not achieve the move |
| `➡️ Moved to [Backlog](backlog.md)` | **Yes** — reclassified `moved`, off the open count | `drift nonconformance … kind="moved-without-target"`, on **every such row, forever** |
| Delete the sprint row outright | Yes | no drift, but the pointer to where the work went is destroyed |

**Cause, verified at `claude/skills/fkit-status/dashboard.sh:681`:**

```sh
moved_target=$(printf '%s' "$st" | sed -n 's/.*Moved to \[*\(Sprint [0-9][0-9]*\).*/\1/p' | head -1)
```

The regex matches **only** the literal `Sprint <digits>`. A `Backlog` target yields an empty
`moved_target`, which lands in two places:

- `:708` — `[ -n "$moved_target" ] || nonconf="moved-without-target"` → permanent nonconformance drift,
  and a drifted row is **never** filtered off the board (`:865`), so it renders forever.
- `:817` — `next="in ${moved_target:-Sprint ?}"` → the Next-step cell reads a literal **`in Sprint ?`**.

Reproduced end-to-end on a fixture. Actual output of the unmodified script:

```
| ➡️ Moved to [Backlog](backlog.md) | P1 | Alpha | … | fkit-coder | in Sprint ? |
drift nonconformance 0001 kind="moved-without-target" cell="➡️ Moved to [Backlog](backlog.md)"
```

### ⚠️ A portability trap found while prototyping the fix — do not step in it

The obvious one-line fix is to add `Backlog` as a BRE alternation:

```sh
sed -n 's/.*Moved to \[*\(Sprint [0-9][0-9]*\|Backlog\).*/\1/p'
```

**This silently does nothing on macOS.** BSD `sed` does not support `\|` alternation in a basic regular
expression: it matches nothing, exits 0, and prints nothing — so `moved_target` stays empty and the
drift persists **with no error**. Verified first-hand on this machine (Darwin 25.2.0): the patched copy
produced byte-identical broken output to the unpatched one.

The same expression **works** under GNU `sed`. So the naive fix is a fix that passes on Linux CI and
fails on the owner's Mac, with no signal either way.

**A form that works on both**, verified on this machine:

```sh
sed -nE 's/.*Moved to \[*(Sprint [0-9]+|Backlog).*/\1/p'
```

`dashboard.sh` uses no `sed -E` today, but it already uses `grep -qE` at `:206` and `:702`, so ERE is
established in this file. **Whatever form you choose, prove it on BSD sed — a passing GNU-only regex is
the exact failure this section exists to prevent.**

With the `-nE` form the fixture came back **completely clean**: no drift record, row filtered off the
board, counted as `moved` rather than `backlog`. And in the drifted-row case (a moved row that renders
because of *other* drift), the Next-step cell rendered **`in Backlog`** — the `in Sprint ?` defect is
gone as a **side effect of the parser fix**, with no separate change to `:817` required. **Verify that
claim yourself before deciding whether `:817` needs touching**; and if `in Backlog` is judged poor
wording, that is a deliberate change to make, not one to assume.

## What to build

### 1. The canonical marker form, documented beside the forward form

Proposed canonical form — **confirm the exact string with the owner before writing it into two files**:

```
➡️ Moved to [Backlog](backlog.md)
```

Note the link target is **`backlog.md`**, relative to `ai-agents/sprints/` — the same directory the
sprint plans live in, so no `../` is needed (the forward form's `[Sprint N](sprint-N.md)` is likewise
sibling-relative from the backlog board).

Document it in **both** places that specify the forward move, beside it, not in a separate section:

- `ai-agents/sprints/backlog.md` — the *"How work moves on and off this board"* section. It currently
  documents **On** and **Off** and **Closed here**. The reverse move is a **new "On" path**: a task
  arriving on this board *from a sprint*, as distinct from a task created here by
  `/fkit-task-brief`.
- `claude/skills/fkit-task-brief/SKILL.md` — the step that specifies the forward pull (the
  `➡️ Moved to [Sprint N](sprint-N.md) — priority M` block, around `:324-342`). ⚠️ **Re-verify these
  line numbers at implementation time** — several queued tasks edit this file.

### 2. Establish the true set of mandatory edits — do NOT assume it mirrors the forward form

The forward move has three mandatory edits. **Do not assume the reverse has exactly three.** Derive the
set from what the drift rules actually check, and state your derivation in the worklog.

The forward three, for reference:

1. add the row to the destination sprint plan, with rank `P<n>`;
2. flip the source row to the `➡️ Moved …` marker (**never delete it**);
3. update the brief's own `## Sprint`.

The candidate reverse set — **three carried over, plus at least one the forward form has no analogue
for**:

1. **Sprint row → `➡️ Moved to [Backlog](backlog.md)`.** Not deleted. (Drift rule 2 at `:751-759`
   compares this target against the brief's `## Sprint`; they must agree.)
2. **Add a row to `ai-agents/sprints/backlog.md`**, Status `🔲 Backlog`, Priority cell **`—`** (that
   board is unranked by design — `backlog.md:32-38`).
3. **Brief's `## Sprint` → `Backlog`.** Omit this and drift rule 2 fires `drift disagreement` forever,
   exactly as the forward form's warning describes in the other direction.
4. **Brief's `## Priority` → `Unscheduled`.** ⚠️ **This is the fourth edit and it has no forward
   analogue** — the forward move *gains* a rank; the reverse must *surrender* one. `backlog.md:32-38`
   requires briefs on that board to read `## Priority: Unscheduled`.

   **Nothing will catch you if you skip it.** Verified 2026-08-03: `dashboard.sh` performs **no drift
   check of any kind** against a brief's `## Priority` — the Priority cell is treated purely as mutable
   board rank (`:478-486`, `:560`). A brief left reading `## Priority: 152` while sitting on an unranked
   board is invisible to every control in the repo. Say so explicitly in the documentation; an
   unenforced rule that nobody knows is unenforced is worse than one that is labelled.

Whatever set you land on, **state the count in both documentation sites** the way the forward form
states "three" — a reader must be able to check themselves.

### 3. What happens to rank — **answer it, do not skip it**

This is a real open question, not a formality. Two defensible readings:

- **(A) The rank is surrendered.** The sprint row keeps its historical `P<n>` in the Priority column
  (it is a closed-out record of where the task sat), the new backlog row reads `—`, and the brief reads
  `## Priority: Unscheduled`. **Recommended** — it is what `backlog.md`'s own *"this board is unranked"*
  section already mandates for every other row there, and it needs no new concept.
- **(B) The rank is parked.** The brief retains the number so a later re-pull restores its old slot.
  This **contradicts** `backlog.md:32-38` (*"A number here would be a commitment nobody made"*) and
  would need that section amended.

⚠️ **A sub-question (A) does not answer, and you must resolve explicitly:** does the *sprint* row's
Priority cell keep its `P<n>`, or become `—`? The forward form is silent because the source board is
unranked. **Recommendation: keep it.** ADR-035 and
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` treat a board rank as frozen
history once a row is closed out, and a `➡️ Moved` row is closed out. Changing it would be a renumber.

**Put (A) vs (B) to the owner before implementing.** Do not settle it in code.

### 4. The `dashboard.sh` parser change

`claude/skills/fkit-status/dashboard.sh:681` — accept `Backlog` as a legitimate move target, **using a
form proven on BSD sed** (see the portability section above).

Then check, and record the answer for each:

- **`:708`** — `moved-without-target` must no longer fire for a well-formed Backlog move. Confirm it
  still fires for a genuinely malformed one (e.g. `➡️ Moved` with no target at all).
- **`:751-759`** — drift rule 2 compares `moved_target` against the brief's `## Sprint`. With the fix,
  `Backlog` vs `Backlog` agrees. Confirm a brief still reading `Sprint 2` correctly raises
  `drift disagreement`.
- **`:817`** — the Next-step cell. Confirm whether the parser fix alone removes `in Sprint ?` (fixture
  evidence says it does, rendering `in Backlog`), or whether a separate change is wanted.
- **The forward form must not regress** — `Sprint 12` must still parse to `Sprint 12`, not to `Sprint 1`.
  The existing regex is greedy-prefixed; check your replacement on a two-digit sprint number.

**Do not touch the marker-key classifier at `:236`** (`'➡'*) printf 'moved'`) — it already classifies
any `➡️` cell as `moved` regardless of target. Only the target extraction is wrong.

### 5. Tests — ADR-014, `node --test`, zero devDeps

Extend `test/dashboard-contract.test.js`. It is already the home for the moved-marker contract (tests
at `:199`, `:220`, `:415`, `:616`) and is explicitly sanctioned by ADR-017 rule 4 as the third thing in
fkit's test scope. **Do not create a new file.**

At minimum:

- `➡️ Moved to [Backlog](backlog.md)` + brief `## Sprint: Backlog` → **zero drift facts**, row filtered
  off the board, counted `moved`.
- Same marker + brief `## Sprint: Sprint 2` → `drift disagreement` with `moved_target="Backlog"`.
- Same marker + brief with **no** `## Sprint` → `drift missing-sprint`, not a clean render (mirrors the
  existing R6 test at `:616`).
- A malformed `➡️ Moved` with no recognizable target → still `moved-without-target`.
- **Regression:** `Sprint 12` still parses as `Sprint 12`.

### 6. `test/prove-red.sh` — investigate, then report; do not assume

**Verified 2026-08-03: `prove-red.sh` does not currently mutate `dashboard.sh` at all.** Every one of
its thirteen mutations targets the launcher tree via `FKIT_LAUNCHER`, and
`test/dashboard-contract.test.js` is deliberately **not routed through the launcher** (see that file's
header comment) — it invokes `dashboard.sh` by an absolute path derived from `REPO`, with no
env-var override.

So there is **no existing mechanism** by which prove-red could mutate the new parser branch. Adding one
means introducing a `dashboard.sh` path override into both the suite and prove-red — **a change to the
test architecture, not a test addition.**

**Do not build it as part of this task.** Investigate the cost, write the finding into your worklog, and
**hand it back as a follow-up brief for the owner to rank.** This task's scope is the marker, the parser,
the docs and the contract tests. ⚠️ Say so in your hand-off even if the answer is "it would be easy" —
a silent omission here is the exact class of gap this whole task exists to close.

## Verification steps

1. `node --test test/dashboard-contract.test.js` — all new cases green, all existing cases green.
2. `node --test test/*.test.js` — full suite green (no collateral damage).
3. `sh test/prove-red.sh` — still exits 0. It does not cover the new branch; that is expected and is
   recorded as a follow-up, not silently accepted.
4. **On this machine (BSD sed), by hand:** build a fixture sprint plan carrying
   `➡️ Moved to [Backlog](backlog.md)` with a matching brief, run `bash claude/skills/fkit-status/dashboard.sh <plan>`,
   and confirm **zero `drift` records** in `⟦FACTS⟧`. A GNU-only regex passes step 1 on Linux and fails
   this step — **this step is the portability gate and must not be skipped.**
5. Run the same fixture with a deliberately un-flipped brief (`## Sprint: Sprint 2`) and confirm
   `drift disagreement` still fires with `moved_target="Backlog"`.
6. Re-read `ai-agents/sprints/backlog.md` and `claude/skills/fkit-task-brief/SKILL.md` and confirm the
   reverse move is documented **beside** the forward form, with the edit count stated, and with the
   "`## Priority` is unenforced" caveat present.
7. **Do not run the 45 queued moves.** They are a separate, owner-authorized action that follows this
   task. This task ships the mechanism only.

## Notes

- **Merit statement (for owner confirmation of the rank).** Filed at **P188 — appended, never
  inserted**, per ADR-035 and `/fkit-task-brief` step 5. **On merit alone this would sit well above
  P188**: it gates 45 authorized task moves, and it closes a specification gap that has now bitten this
  board twice. It is nonetheless appended, because a spawned producer with no owner channel has **no
  authority to insert into the owner's ranking** — that is precisely the failure ADR-035 and tasks 0157
  and 0158 exist to prevent. **The owner should re-rank it if the 45 moves are wanted sooner.**
- **Sprint placement is an owner-instruction exception**, not a justification-1 or justification-2 pass
  under the 2026-08-03 standing rule. See the Context section. Not precedent.
- **Depends on:** nothing. Every input is already on disk and verified.
- **Blocks:** the 45 sprint-2 → backlog moves authorized by the owner on 2026-08-03, recorded in the
  triage addendum in `ai-agents/sprints/sprint-2.md`. Also blocks the `0146` → `0144` merge and the
  `0149` → backlog ruling, which travel with those moves.
- **File contention:** this task edits `claude/skills/fkit-task-brief/SKILL.md`, which several queued
  briefs also touch. Not a dependency — re-verify line numbers at implementation time.
- **Do not renumber or re-rank any existing row** (ADR-035).
- Task `0173` is in progress concurrently; it touches the wiki skills, not these files.
