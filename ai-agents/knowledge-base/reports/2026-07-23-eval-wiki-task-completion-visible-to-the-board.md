# Evaluation — making fkit-wiki task completion visible to the board

- **Date:** 2026-07-23
- **Author:** fkit-architect (owner present, session)
- **Task:** [`0108`](../../tasks/backlog/0108-investigate-making-wiki-task-completion-visible-to-the-board/brief.md)
- **Kind:** investigation with a recommendation — **no code changed, no wiki write, no commit.**

> ## ⚠️ OUTCOME (2026-07-23) — the owner overrode this report's recommendation. See [ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md).
> This report recommended **Approach 1 (the wiki self-closes)**. The owner **declined it** and ruled the
> opposite and broader: **the task movers become producer-only again** (reversing ADR-025). **The wiki
> stays wiki-only** — it *flags* "ready to close"; **the producer runs the mover.** That is Approach 2's
> *mechanism* with the **producer** (not necessarily the owner) as the closer, plus a full reversal of
> ADR-025 that ripples into the coder ship-loop (ADR-019) and the orchestrator (ADR-032). The candidate
> analysis below stands as the record of what was weighed; **§7's recommendation is superseded by
> ADR-033.** Read §7's "Post-ruling" note, not its original recommendation.

## 0. The finding that reframes the whole question

The brief's premise — *"`fkit-wiki` … **cannot move task files** — the movers are producer/owner-invoked"*
(`0108/brief.md:20-21`) — is **stale.** Since [ADR-025](../decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)
(2026-07-18/19) **every role but the adversarial reviewer owns the task movers**, and
`claude/skills-for-role.sh:43` grants `wiki` both `fkit-task-done` and `fkit-task-cancelled`. Verified:
the ADR-018 hook allows a wiki-identity caller to invoke them at any spawn depth
(`skill-ownership-hook.sh:119-136`).

**So `fkit-wiki` *can* close its own task today — it just never does.** Grepped all three wiki SKILLs
(`fkit-wiki-ingest`, `fkit-wiki-sync`, `fkit-wiki-lint`): **zero** mentions of `task-done`, closing, or
"ready to close." The stuck marker is a **process gap** (the wiki procedures don't end by closing or
flagging the task they completed), **not a capability gap** (the brief's framing). That collapses the
problem from "how do we route a completion signal past a write boundary" to "have the wiki act on the
close authority it already holds, or say the task is ready." Most of the design space in the brief is
answering a question ADR-025 already closed.

## 1. Problem & evidence

A tracked wiki task (a "resync/ingest/repair X" brief) whose vault work is **done** keeps showing
`🔲 Backlog`/`🔄 In progress` on the board, because the only place the wiki records completion is
`wiki-vault/log.md` — and **no board tool reads `log.md`**: not `dashboard.sh`, not the movers, not
`/fkit-status`. Confirmed: `dashboard.sh` reads the sprint plan + the briefs it links and nothing else
(`dashboard.sh:` header contract), and it collapses any `✅ Done` to `done` and hides the row
(`:231,500,522`).

**Concrete, and not brief (from `0108/brief.md:26-32`):**
- **Task 80** (`0078-repair-stale-adr-029-stop-hook…`): vault work complete **2026-07-19**; `log.md`
  said so on 2026-07-21; the board showed `🔄 In progress` across **seven `/fkit-status` runs** (~a
  week) because the signal lived only in `log.md`.
- **Six batched wiki-syncs** (45/51/66/69/71/73): done in the vault, `🔲 Backlog` on the board for days,
  discoverable only by the producer reading `log.md` by hand.

## 2. Constraints the answer must respect (both cited, both non-negotiable)

- **Vault write boundary (ADR-005):** only `fkit-wiki` writes `wiki-vault/`; reads are decentralized.
  A reader (e.g. `dashboard.sh`) *reading* `log.md` respects it; anyone else *writing* the vault breaks
  it.
- **Status-change gate (ADR-025):** `Done` is **mover-gated, not owner-gated** — any role but the
  adversarial reviewer may invoke it, and an agent-performed close **must** carry
  `✅ Done (agent-closed — not owner-verified)` (`adr-025:§Decision 3`). The old *owner-only* gate is
  **already gone**; what remains is the honesty marker.

## 3. Candidate approaches

### Approach 1 — Convention: the wiki **self-closes** the task it completed, via the mover it already owns

**How it works.** Amend the wiki SKILLs (`fkit-wiki-ingest`/`-sync`/`-lint`) so that when the operation
**completes a discrete tracked task** (a brief whose deliverable *is* this vault work), the procedure's
final step invokes `/fkit-task-done` on that brief — writing
`✅ Done (agent-closed — not owner-verified)` — and states it in the return/report. When the wiki work is
only *part* of a larger task, or completeness is uncertain, it does **not** close; it falls to Approach 2's
"ready to close" line instead. No code; convention text in three SKILLs + a one-line rule.

**Pros.** Zero machinery. Uses authority the wiki already has (ADR-025). Fixes the symptom completely —
the closed task leaves the open board immediately. Respects **both** boundaries: the wiki writes only the
vault + invokes a mover it owns; the status change goes through the gated mover with the honest marker.
Wiki work is **unusually verifiable** (log.md records exactly what was ingested; the vault diff is
concrete), so wiki self-close is *lower* laundering risk than the coder self-close ADR-025 already
accepts.

**Cons / costs.** It **is** auto-closing (see §5, the anti-laundering confrontation the brief demands).
The agent-closed marker is **invisible in `/fkit-status`** (ADR-025 §A3: `dashboard.sh` collapses it to
plain `done`), so a self-closed wiki task is indistinguishable from an owner-closed one without opening
the file — an amplification of ADR-025's accepted cost, not a new one. Needs a crisp "is this task's
deliverable *this* vault work?" rule so the wiki never closes a task it only partly served.

**Effort & reversibility.** Small (three SKILL edits + the four-mirror discipline is not triggered — no
`skills_for_role` change). Fully reversible (move the file back; edit the SKILLs).

### Approach 2 — Convention: the wiki **surfaces "ready to close"**; a human runs the mover

**How it works.** The wiki SKILLs end their final report with an explicit, uniform line —
*"Task N's vault work is complete — run `/fkit-task-done` on it"* — for each tracked task they finished.
The wiki never moves the file; the owner/producer does. No code.

**Pros.** Keeps a **human glance** on wiki-task closure without a live-gate fiction. Cheapest possible.
Never touches status. Zero laundering exposure (a human still flips it → an owner-verified close, no
marker). Works identically in a session or a spawned consult.

**Cons / costs.** The signal still depends on a human acting on a report line — the *same failure mode*
that produced the week-long stuck marker (the producer *was* reading `log.md` and it still slipped). It
reduces the miss rate (a prominent report line beats buried `log.md` prose) but does not close the gap
structurally. If the wiki ran as a spawned consult mid-another-flow, the "ready to close" line rides that
flow's return and can be lost when the caller summarizes.

**Effort & reversibility.** Smallest. Fully reversible.

### Approach 3 — Code: teach `dashboard.sh` to **read a canonical completion signal from `log.md`** and surface a "wiki reports complete → ready to close" hint

**How it works.** Define a canonical `log.md` completion form (e.g. `- Completed task: 0078`) as a wiki
convention, then teach `dashboard.sh` to read `log.md` and render a hint on that task's row —
**without** changing its status (no auto-close). The signal *stays* in the vault; the board *learns to
see it*.

**Pros.** Makes the signal board-visible while **keeping a human gate** on the actual close. The read
respects the write boundary (ADR-005). Directly answers the brief's "reader learns to see it" option.

**Cons / costs.** Most machinery, for the least additional benefit over Approach 1. **Couples the board
to the vault** — `dashboard.sh`'s contract is currently "plan + briefs, nothing else" (`dashboard.sh:`
header); reading `log.md` widens it into another store and another format. **Re-imports the exact problem
task 0107 just fought**: `log.md` is append-only human prose, so a hint parsed from it is only as
reliable as a canonical form the wiki must now also maintain — and 0107's lesson (below) is *don't teach
the board to parse a new prose store.* It also duplicates state: the task is "done in the vault" but
"open on the board," a two-places-disagree condition that is the very bug class here.

**Effort & reversibility.** Largest (parser + a `dashboard-contract` fixture + a log convention +
`prove-red` mutation). Reversible but the coupling lingers.

## 4. Does task 0107's fix generalize here? (the brief asks explicitly)

**Its *ethos* generalizes; its *mechanism* does not.** 0107 chose **Option B + guard**
(`0107/worklog.md`): it did **not** teach `dashboard.sh` to read a new store — it **narrowed where the
state may live** (mandated the canonical `- **Depends on:**` form via `fkit-task-brief`) and made the
board **loud** when it meets a form it cannot parse. The generalizable lesson: *put the state where the
board already acts, and don't add a prose store for the board to parse.*

For 0108 that lesson points **away from Approach 3** (which is 0107's rejected Option A — teach the board
to parse prose) and **toward Approach 1**: the place the board "already acts" on completion is the **task
file itself, via the mover** — and the wiki now owns that mover. So the unified answer 0107 hints at is
not "a shared log-reader"; it is "the completion state belongs in the task file, written by whoever owns
the close." 0107 put dependency state in the brief; 0108 puts completion state in the brief (via the
mover). Same principle, different owner-of-the-write.

## 5. The anti-laundering confrontation (the brief requires this head-on)

The brief: *"Do not propose auto-closing wiki tasks without confronting the anti-laundering gate
head-on."* Confronted:

- **There is no live owner-only gate to step around.** ADR-025 **removed** it for every role but the
  adversarial reviewer, knowingly, and replaced *prevention* with the *agent-closed marker* (ADR-025
  §"honesty clause": *"this is not prevention downgraded to detection. It is prevention removed, with a
  labelling convention in its place"*). So Approach 1's self-close is **not** a quiet breach — it is the
  wiki using the exact posture ADR-025 already established for the coder, producer, architect, and
  reviewer.
- **The residual is real and named:** L1 ("confused optimist") is unmitigated for the wiki too, and the
  marker is invisible in `/fkit-status` (§A3). But wiki completion is **more** self-evident than code
  completion (the log records the exact ingest; the vault diff is concrete), so the wiki is the
  *lowest-risk* place this posture applies.
- **Approach 2 keeps a human gate** and produces an owner-verified close (no marker) — the choice for an
  owner who wants wiki closures glanced at despite ADR-025 permitting self-close. That is the **only**
  live fork here, and it is the owner's (§7).

**No approach here proposes routing *around* the gate.** Approach 1 goes *through* the mover; 2 and 3
leave the flip to a human.

## 6. Comparison

| Dimension | A1 — wiki self-closes | A2 — "ready to close" line | A3 — dashboard reads `log.md` |
|---|---|---|---|
| Fixes the stuck marker | ✅ fully (leaves the board) | ⚠️ reduces misses, not structural | ⚠️ visible, but still open until a human closes |
| Code change | none | none | parser + fixture + log convention |
| Respects vault write-boundary | ✅ (writes only vault + owns mover) | ✅ | ✅ (a read) |
| Respects status gate | ✅ via mover + marker | ✅ human flips | ✅ no auto-close |
| Human glance on closure | ✗ (agent-closed) | ✅ owner-verified | ✅ owner-verified |
| Board↔vault coupling | none | none | ✗ new coupling |
| Re-imports 0107's parse-prose risk | no | no | **yes** |
| Effort / reversibility | small / full | smallest / full | largest / full |

## 7. Recommendation

> **Post-ruling (2026-07-23, ADR-033) — this is the operative recommendation now.** The owner **declined
> Approach 1** and ruled the movers **producer-only** (reversing ADR-025). The operative fix for 0108 is
> **Approach 2's mechanism with the producer as closer**:
> - **The wiki stays wiki-only.** Its SKILLs (`fkit-wiki-ingest`/`-sync`/`-lint`) end by flagging each
>   completed tracked task — an explicit *"task N ready to close"* line in the report. The wiki **closes
>   nothing** and **loses the movers** (`skills-for-role.sh:43` drops them from `wiki`).
> - **The producer runs `/fkit-task-done`.** Per ADR-033 it is the only role that may. The wiki (or the
>   orchestrator that spawned it) routes the close to the producer.
> - **Follow-on is now folded into ADR-033's ripple**, not a standalone 0108 build: the `skills-for-role`
>   revert + four mirrors, the ship-loop step-9 change, and the wiki flag-don't-close convention are one
>   coordinated change. The §8 "convention-not-a-build" framing below still holds for the *wiki* half.
>
> The original recommendation is retained below as the record of what the architect weighed **before**
> the ruling — it is **superseded**.

**~~Adopt Approach 1 (wiki self-closes discrete wiki tasks) as the primary fix, with Approach 2 as its
built-in fallback~~** *(superseded — see Post-ruling above)* for the not-fully-done / uncertain / part-of-a-larger-task case. Concretely, one
convention across the three wiki SKILLs:

> On completing an operation, if it **completes a tracked task whose deliverable is this vault work**,
> invoke `/fkit-task-done` on that brief (writing the agent-closed marker) and say so in the report.
> Otherwise, end the report with an explicit *"task N ready to close"* line and close nothing.

**Main tradeoff accepted:** wiki tasks will close **agent-closed, invisible in `/fkit-status`** (ADR-025
§A3) — no human necessarily glances at a wiki closure. That is consistent with ADR-025's established
posture and justified by wiki work's unusual verifiability.

**Reject Approach 3** — it is 0107's rejected Option A wearing new clothes: it couples the board to the
vault, re-imports the parse-prose fragility 0107 just removed, and buys only a human-gate that Approach 2
already provides for free.

**It depends on X, and X is the owner's:** *do you want wiki-task closures to happen without a human
glance?* **Yes → Approach 1** (recommended). **No → Approach 2 alone** (the wiki only ever flags "ready
to close"; a human always flips it). Approach 3 is the answer **only if** the owner wants both a human
gate *and* board-surfaced visibility *and* is willing to pay the coupling — a combination I do not
recommend.

**No spike needed** — every fact here is settled against the code; nothing requires a binary probe.

## 8. Follow-up

- **This is a convention change, not a build** (under the recommendation). The follow-up implementation
  brief is small and coder-scoped: edit the three wiki SKILLs (`fkit-wiki-ingest`, `fkit-wiki-sync`,
  `fkit-wiki-lint`) to add the close-or-flag final step, plus the one-line "deliverable *is* this vault
  work?" rule. **Dual-home note:** these SKILLs are `claude/`-only (not scaffold-dual-homed), so no
  ADR-027 parity concern; the `.claude/` copies refresh on launch.
- **An ADR is warranted** only if the owner picks Approach 1 (a small but real extension of the
  self-close posture to the wiki role) — recordable via `fkit-record-decision`, and honestly it may just
  be a one-liner amendment noting ADR-025 already authorizes it. If the owner picks Approach 2, no ADR —
  it is pure convention.
- **Correct the stale premise** wherever it is echoed: the brief's "movers are producer/owner-invoked"
  (0108) is false post-ADR-025; if any wiki-vault page asserts it, **fkit-wiki** resyncs it (an architect
  never writes the vault).

---

**Written:** this file. **No source changed, no wiki write, no commit.** If the owner settles the §7
fork, record it via `fkit-record-decision` (Approach 1) and have the producer file the small coder brief
(§8). If this belongs in the wiki, **fkit-wiki** ingests it.
