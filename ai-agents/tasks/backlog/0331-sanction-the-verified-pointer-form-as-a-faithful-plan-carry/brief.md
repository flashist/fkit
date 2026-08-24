# Record the ADR that reverses the 2026-08-02 ruling and sanctions the verified-pointer form as a faithful plan carry

## ID
0331

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

> ### ⭐ THIS BRIEF WAS SPLIT IN TWO ON 2026-08-24, BY OWNER RULING
>
> **Verbatim option label: "Split into two (Recommended)".** The chosen option's description, verbatim:
>
> > "The producer's pick. Different owners — ADR is fkit-architect, skill edit is fkit-coder — and
> > `task-owner-vocabulary.md` allows exactly one role per brief, \"not two roles\". Precedent splits
> > this way (0241's batch, 0325/0326). The ADR half becomes a hard gate on the skill half: the skill
> > file must not assert an unrecorded overturn of an owner ruling."
>
> **This row is now the ADR half only.** The skill amendment moved to
> [`0333-amend-the-ship-loop-construction-so-a-verified-pointer-satisfies-condition-b`](../0333-amend-the-ship-loop-construction-so-a-verified-pointer-satisfies-condition-b/brief.md),
> owned by `fkit-coder`. ⛔ **This task is a HARD GATE on `0333`** — see §Notes.
>
> ⚠️ The open question this brief previously carried ("this may be two tasks") is **answered and
> closed** by the ruling above. It is left described, not deleted, because the reasoning is the record.

**⭐ THE UNDERLYING OWNER RULING, 2026-08-24.** Given live via `AskUserQuestion` in an `fkit lead`
session driving `/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text:** **"Sanction the verified-pointer form (Recommended)"**.

**The question that was put to the owner, verbatim:**

> "The sprint-loop requires a Build spawn to carry the approved plan VERBATIM (condition b). Twice now
> I've used the declared degraded form — pointer + hash only — because the plan was 21KB then 33KB and
> re-emitting it token-by-token is exactly what the construction says can't be trusted. Both times the
> worker verified the hash against disk and proceeded. The rule says it should REFUSE. This will recur
> on every large plan."

**The chosen option's description, verbatim:**

> "Amend the construction so a pointer + hash + byte count, verified by the worker against disk before
> any edit, satisfies condition (b) — with the honest caveat the worker itself stated: this improves
> FIDELITY, not TRUST, since a doctored plan plus matching hash is as reachable as a doctored paste.
> Needs a task to amend the skill, and an ADR since it changes an owner-ruled construction."

### ⛔ THE CENTRAL CAVEAT. It is the point of this task, not a footnote.

> **This amendment improves FIDELITY, not TRUST.**
> **A doctored plan plus a matching hash is exactly as reachable as a doctored paste.**

⛔ **The ADR MUST NOT be written as a security guarantee, and a review that lets it read as one has
failed this task.** A driver that wants to defeat this check can compute a hash over whatever bytes it
likes; what the check buys is that an **accidental** divergence between the plan on disk and the plan
the worker acts on becomes detectable. **That is the whole of the gain. Say so, unhedged, in the
Consequences.** ⚠️ The same block is repeated verbatim in `0333` — that is deliberate, not redundancy:
each half can be read alone and neither may lose it.

### ⚠️ THIS RULING REVERSES A PRIOR OWNER RULING. That reversal is this task's whole deliverable.

The rule being amended is itself an **owner ruling of 2026-08-02** (`0162` OQ-1), recorded verbatim in
`claude/skills/fkit-sprint-ship-loop/SKILL.md` inside the faithful-carry construction, step 4
(**re-read firsthand 2026-08-24 and still present in that wording**):

> **Paste AND pointer — both, never either/or** (owner ruling, 2026-08-02, `0162` OQ-1; pure
> by-reference was rejected)

⭐ **"pure by-reference was rejected" is the clause this ruling overturns.** ⛔ **An amendment that lands
without recording the reversal leaves the skill file asserting an owner ruling that has been
superseded** — the exact record-decay shape `0306` was created to repair. **The ADR must name the
2026-08-02 ruling, state that the 2026-08-24 ruling reverses it, and record what changed and why** —
specifically: the argument in 2026-08-02's favour was that a paste is what the worker acts on, and the
argument that beat it in 2026-08-24 is that on a 20–35 KB plan the paste is *itself* an unverifiable
re-emission, so demanding it produces a mandatory refusal on every large plan rather than a safer carry.

### The two real instances that motivated it — measured, not recalled

| Plan | Size | What the driver did | What the worker did |
|---|---|---|---|
| `0250`'s plan ([`plan.md`](../../done/0250-fix-the-scaffold-producer-row-fkit-task-brief-omission/plan.md)) | **21105 B** — `wc -c` by the filing producer 2026-08-24 (post-close), **re-measured independently by the splitting producer the same day: still 21105 B** | carried **pointer-only**, degradation declared | verified the hash against disk and **proceeded** |
| `0046`'s plan ([`plan.md`](../../done/0046-gate-symlink-escape-in-init-intake-write/plan.md)) | **33324 B**, `wc -c` firsthand 2026-08-24, **after** its close | carried **pointer-only**, degradation declared | verified the hash against disk and **proceeded** |

> ### ⚠️⚠️ TWO SIZE RECONCILIATIONS. ⛔ NEITHER IS A FIGURE THAT WAS "WRONG AND GOT CORRECTED".
>
> **Both figures in each pair were right at their time.** Recording the reconciliation, not overwriting
> one with the other, is the point — this brief is *about* not trusting unmeasured numbers.
>
> 1. **`0250`'s plan: `21108 B` before its close, `21105 B` after.** The 3-byte difference is not drift
>    and not a mis-measurement: closing `0250` re-pointed that plan's own `backlog/` → `done/`
>    self-locator, and `backlog` (7 chars) → `done` (4 chars) **removes exactly 3 characters**. The
>    earlier reading was correct pre-close; the later one is correct post-close.
> 2. **`0046`'s plan: `33330 B` driver-reported pre-close, `33324 B` measured post-close.** The 6-byte
>    difference has the same cause and **two** occurrences: closing `0046` re-pointed **two** `backlog/`
>    → `done/` self-locators in that file, 3 characters each. `33330 − 6 = 33324`. ⭐ **This
>    arithmetic independently corroborates the driver's previously-unverified `33330 B`** — the figure
>    that this brief's earlier revision flagged as *"DRIVER-REPORTED, NOT VERIFIED"*, because `0046`'s
>    folder was fenced off from that filing. **It is now verified, by reconstruction rather than by
>    direct pre-close measurement — state it that way, not as a direct measurement.**
>
> ⛔ **Re-measure at plan time regardless.** A plan file changes whenever anything re-points a link
> inside it, and both of these did.

⭐ **Both instances behaved correctly on the merits and incorrectly against the rule** — which is the
whole argument. The construction says a pointer-only spawn *"fails condition (b) as written, so the
spawned coder **must refuse it** — the refusal is mandatory, not discretionary"*. **Neither worker
refused. Both verified and proceeded.** ⚠️ **A rule that the people following it correctly must break
is a rule that is wrong, or a practice that is wrong; the owner has ruled it is the rule.**

## What to build

**One deliverable: the ADR.** `fkit-architect`, via `/fkit-record-decision`, into
`ai-agents/knowledge-base/decisions/`.

- **Record the decision**: a pointer + `git hash-object` + `wc -c` byte count, **verified by the worker
  against disk before any edit**, satisfies condition (b) of the declared-approval marker.
- **Name the reversal explicitly.** The 2026-08-02 owner ruling (`0162` OQ-1) rejected pure
  by-reference. **State that this reverses it, and record what changed and why** — see §Context.
- ⛔ **Carry the fidelity-not-trust caveat into the Consequences, in substance and unhedged.**
- **Weigh and record the options that were not taken** — at minimum: keep the paste-AND-pointer rule and
  accept a mandatory refusal on every large plan; and a size threshold below which the paste is still
  required. **The producer takes no position on these; they are the architect's to weigh.**
- **State which case is which.** ⛔ This is not a licence to skip the paste when it fits. The
  construction's own reasoning for a paste stands for a plan that can be carried whole; the amendment
  is for the case where it cannot be. **The ADR should draw that line rather than leaving it to a
  driver's convenience** — `0333` will implement whatever line this ADR draws.

⛔ **Out of scope for this task: touching `claude/` at all.** The skill amendment is `0333`'s, owned by
`fkit-coder`. An architect that edits `claude/skills/fkit-sprint-ship-loop/SKILL.md` from this brief has
done `0333`'s work under the wrong owner.

## Verification steps

- **The ADR exists** under `ai-agents/knowledge-base/decisions/`, names the 2026-08-02 ruling (`0162`
  OQ-1) by date and by its verbatim clause, and states the reversal.
- **The fidelity-not-trust caveat is in the Consequences**, unhedged. **Read the finished ADR end to end
  and confirm it does not read as a security guarantee anywhere.** ⚠️ This is a read-and-judge check,
  not a keyword search.
- **The rejected options are recorded with why they were rejected**, not merely listed.
- **The ADR draws the paste-vs-pointer line** — a reader can tell, from the ADR alone, which plans still
  require a paste.
- **No file under `claude/` was modified by this task.** `git status --porcelain claude/` shows nothing
  from this run.

## Notes

- **Owner: fkit-architect.** It records an architecture decision that changes an owner-ruled
  construction. ⚠️ **The skill edit is `fkit-coder`'s and is now `0333`.**
- ⛔ **THIS TASK IS A HARD GATE ON [`0333`](../0333-amend-the-ship-loop-construction-so-a-verified-pointer-satisfies-condition-b/brief.md) — NOT A SOFT-FOLLOW.**
  The owner stated the gate in these terms: *"the skill file must not assert an unrecorded overturn of
  an owner ruling."* Landing `0333` first would leave
  `claude/skills/fkit-sprint-ship-loop/SKILL.md` sanctioning a form that overturns the 2026-08-02
  ruling **with nothing on record that the ruling was overturned** — which is the record-decay shape
  `0306` exists to repair, reintroduced by the very change meant to improve the file. ⚠️ **The gate is
  the ADR being merged and readable, not merely drafted:** `0333` must be able to cite it.
- **Depends on: nothing. Blocks: `0333` — hard.**
- ⚠️ **A non-`fkit-coder`-owned row is exactly the shape `0270` is open to decide** — *"decide how the
  ship loop handles a non-coder-owned task row"*. ⭐ **The split concentrates that exposure here:**
  `0333` is `fkit-coder`-owned and unaffected, so **this** row is the one that will meet the unresolved
  case if it is scheduled before `0270` rules. **Noted, not solved — owner-ruled 2026-08-24, verbatim
  label "Note both, decide when scheduled (Recommended)".**
- ⚠️ **Three rows now target `claude/skills/fkit-sprint-ship-loop/SKILL.md`** — `0333`, `0204` and
  `0223`. ⭐ **The split changes which rows those are, not how many:** `0331` used to be the third and
  no longer touches the file at all; `0333` took its place. `0204` and `0223` are both on **Sprint 6**,
  and Sprint 6's own §*"Four real dependencies the order encodes"* already says they must be sequenced,
  not parallelised. **Same owner ruling as above: noted, decided when scheduled.**
- **Risk: low, and it is a documentation risk.** Nothing executes an ADR. The failure mode is an ADR
  that reads as a guarantee, which would then be cited as one.
- **Evidence sources:** `claude/skills/fkit-sprint-ship-loop/SKILL.md`, the faithful-carry construction
  under *"How to carry it — the construction, not an exhortation"* (steps 1–6 and the closing *"honest
  bound"* paragraph) — **read firsthand 2026-08-24**, which is how the 2026-08-02 ruling's verbatim
  wording was confirmed. Both plan sizes were measured with `wc -c` the same day; see the reconciliation
  block above for what each figure means.
- ⛔ **Out of scope:** the skill amendment (`0333`), building the carry-check hook (`0204` owns it), the
  plan-approval gate itself, any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  any re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and any task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **Split by a spawned `fkit-producer` with NO owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md))
  **acting on the relayed owner ruling above: this row keeps its ID, its board and its unranked
  position; `0333` was appended. Nothing was re-ranked and no other task's `## Status` was changed.**
