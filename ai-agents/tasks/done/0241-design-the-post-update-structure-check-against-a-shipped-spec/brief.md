# Design the post-update structure check against a shipped structure-spec `.md` — and its consent-gated repair path (the sanctioned ADR-015 re-raise)

## ID
0241

## Sprint
Sprint 3

## Priority
Sprint 3 P3

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

### Authority — two owner rulings, named first

Both taken via `AskUserQuestion` in a live `fkit lead` session on **2026-08-06**:

1. **Board:** verbatim **"Sprint 3 (Recommended)"** — the owner chose the active Sprint 3 board over
   the Backlog board for this work.
2. **Shape:** verbatim — **"My idea is that after update the fkit should check if the structure of the
   project fits the requirements for the installed version and if needed updated the structure. We can
   have a verbatim explaination of what is needed in the structure as an .md file that the agents will
   read after update, will use as a reference for what should be checked (e.g. the explanation of the
   structure of the folders)."**

**Two further owner rulings landed the same day, same channel (`AskUserQuestion`, live `fkit lead`
session, 2026-08-06), after this brief was filed:**

3. **Rank:** verbatim **"Move to merit P3 (Recommended)"** — this task moved from append rank `P4` to
   its recorded merit position, **Sprint 3 `P3`** (directly below `0182`, above `0222`, which became
   `Sprint 3 P4`). Executed by a spawned producer **on that named ruling** — not producer precedent
   for re-ranking. Authority recorded in full in the Sprint 3 board's owner-ruled re-rank addendum
   (2026-08-06).
4. **Scope:** on the question *"Is stale `CLAUDE.md` / `AGENTS.md` refresh in scope for `0241`'s
   design, or a separate concern?"* — verbatim **"In scope (Recommended)"**. The refresh **is in
   scope** for this design: one coherent *"does this project match the installed version"* capability,
   with `ai-agents/` structure and `CLAUDE.md`/`AGENTS.md` both weighed **under the same consent
   model**. See the dated corrections at §What to build item 5, verification step 7, and §Notes.

The lead's gloss of ruling 2 — **marked as gloss, not ruling**: ship a structure-specification `.md`
with fkit (a verbatim explanation of what the project structure must contain for the installed
version — e.g. the folder structure of `ai-agents/`); after an update, agents read that spec, check
the project against it, and update the structure where needed. Where gloss and verbatim ruling could
be read apart, **the verbatim ruling governs**.

### The problem (verified this session by the lead against `claude/fkit-claude-init.sh` and `README.md`)

- fkit's per-project init (`claude/fkit-claude-init.sh`, run on **every** `fkit` launch) converges
  `ai-agents/` with a hard invariant: **create-if-absent only** — it never writes to a path that
  already exists. Consequence, stated in the script's own comments: *"this CANNOT fix content drift. A
  scaffold-authored file whose contents changed... is a path that ALREADY EXISTS, so we step over it,
  forever. That residual is deliberate and owner-accepted."*
- The script also warns: *"Do NOT 'improve' this into overwriting a file it thinks is stale: the
  safety and the limitation are the SAME property."* And: init is **stateless by design** — a
  project-version cursor/migration mechanism was **rejected on the merits** (cannot survive `git
  clone`; `.fkit/` is gitignored).
- Real-user surface today: `curl install.sh | sh` once, `fkit update` (explicit, notify-only check),
  and every `fkit` launch re-runs init. So a consuming project on a very old fkit gets fresh
  agents/skills but keeps **drifted `ai-agents/` scaffold files and stale `CLAUDE.md`/`AGENTS.md`
  forever**.

### The locked decision this collides with — and why this task is the sanctioned way through it

[ADR-015](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)
is the owner-ratified record of the invariant above. Four of its clauses bear directly, and the design
must engage all four **by name, not re-derive them**:

1. **The invariant (Decision §1), ratified by the owner:** *"Convergence never writes to a path that
   already exists. Create-if-absent only. No overwrite, no move, no delete — ever — inside a consuming
   project's `ai-agents/`."* Content drift is **deferred with eyes open** (Decision §5) — an accepted
   tradeoff, not a gap someone missed.
2. **Its `Re-raise only if` trigger 1 fires on exactly this proposal:** *"Someone PROPOSES a change
   that would move, rename, or delete content inside a consuming project's `ai-agents/`… The trigger
   fires on the proposal, not on the implementation… It voids this decision and returns to the
   owner."* The owner's ruling 2 ("if needed updated the structure") **is** such a proposal — made by
   the owner, but without ADR-015's record in front of them. **This task IS the re-raise, done
   properly**: the design returns to the owner with the ADR's invariant, costs, and recorded
   alternatives laid out, instead of a mechanism being built around the record.
3. **A deferred, recorded alternative already exists for content drift** — the shipped
   **content-identity hash manifest** (ADR-015 §Rejected alternatives, "deferred, not rejected"): hash
   the on-disk file; byte-match against every version fkit ever shipped; match → user never touched it
   → safe to replace; no match → user edited it → never touch it, report once. Stateless, no cursor,
   survives a clone, no LLM. The design must **weigh the structure-spec `.md` with/against this
   recorded mechanism**, not rediscover it. (ADR-015's trigger 2 — *a third fkit-authored file starts
   drifting* — is the manifest's own re-raise condition; the design should state whether it has fired.)
4. **A rejected-by-name shape must not be rebuilt by accident:** *natural-language migration items
   executed by a migration agent*, unattended, was rejected as "the worst option on the table." The
   distinction that plausibly saves the owner's shape, flagged by the lead and to be settled by this
   design **with the owner**: ADR-015 accepts non-determinism *"in an agent that proposes"* — an
   **in-session, owner-present, consent-gated propose-then-apply** is a different animal from the
   unattended every-launch script the invariant governs. A **silent auto-update is exactly what the
   record forbids.**

### Why a design task and not a build

Investigation-first. The unknowns are meaningful and each one changes what gets built: the trigger
("after update" needs one, and init is stateless by design), the consent model, the role that runs
the check, and the scope boundary. **No implementation brief exists for this capability and none is
filed until this design lands and is reviewed with the owner.**

## What to build

A design spec via `/fkit-design-spec`, saved to `ai-agents/knowledge-base/reports/` (dated), covering
— with **open decisions returned to the owner, never resolved agent-side**:

1. **The structure-spec `.md`** — the element the owner's ruling names directly. Its content scope
   (which paths/files the installed version requires — e.g. the `ai-agents/` folder structure), its
   home (install share vs scaffold vs elsewhere — and how a project-local copy would itself escape the
   create-if-absent trap), how it tracks fkit's **sha-keyed** distribution (ADR-015 Context §4: two
   installs can report the same `VERSION` with different content), and who maintains it when the
   scaffold changes.
2. **The trigger.** "After update" needs a mechanism, and ADR-015 Context §3 records why a
   per-project version cursor was rejected (gitignored `.fkit/` cannot survive `git clone`). If the
   design needs per-project state, it must **say explicitly that it re-opens that rejected mechanism**
   and put that to the owner — never reinstate it casually. Stateless candidates (e.g. check-on-launch
   notice, check-on-demand, spec-vs-disk comparison with no memory) should be weighed.
3. **The check.** Which role/session runs it, when, and with what read scope. Hard constraint carried
   into the design: **only `fkit-wiki` writes `ai-agents/wiki-vault/`**
   ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
   — the spec check must never instruct any other role to write there, whatever the spec says the
   vault should contain.
4. **The repair path** ("if needed updated the structure") — the ADR-015 re-raise proper. Note that
   **additions are already handled** by launch convergence (ADR-015 Decision §2); the genuinely new
   capability is repairing **existing** content/structure, which is exactly what the invariant forbids
   the unattended script to do. Design the consent model (propose-then-apply with the owner present is
   the plausible compatible shape; silent auto-update is forbidden) and state what happens to ADR-015
   itself — amendment, supersession via `/fkit-record-decision` as a follow-up, or a scoped exception
   — as a **proposal for the owner to rule on**.
5. **The scope boundary.** `CLAUDE.md`/`AGENTS.md` staleness is a **sibling gap the lead reported**:
   those files sit at the project root, outside the `ai-agents/` tree ADR-015's invariant names.
   Include or exclude them **explicitly, with the reason stated** — not left implied.
   - **✅ ANSWERED 2026-08-06 — owner ruling, verbatim *"In scope (Recommended)"*** (`AskUserQuestion`,
     live `fkit lead` session; §Context authority, ruling 4). Item above left byte-identical. **The
     include/exclude call is no longer this design's to propose — it is decided: IN scope.** The
     design covers stale `CLAUDE.md`/`AGENTS.md` refresh as part of the one coherent capability,
     weighed **under the same consent model** as the `ai-agents/` structure repair. What remains the
     design's to work out: the mechanics and the reasoning — including that these files sit outside
     the tree ADR-015's invariant literally names, which the design must still state rather than
     leave implied.
6. **The follow-up split.** Propose the implementation decomposition (spec authoring, check, repair
   path, docs) with dependencies — as a proposal in the report. **File nothing**; filing is the
   producer's act after owner review.

### ⛔ Out of scope

- ⛔ **No implementation.** No edit to `claude/fkit-claude-init.sh`, `claude/fkit-claude.sh`,
  `install.sh`, the scaffold, or `test/`.
- ⛔ **Do not write the structure-spec `.md` itself** — its home and contract are outputs of this
  design.
- ⛔ **Do not amend or supersede ADR-015** — the re-raise returns to the owner; recording any new
  ruling is a follow-up via `/fkit-record-decision`.
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005).
- ⛔ **No commit**, no re-rank, no task-file move.
- ⛔ **No `:NNN` line-number citations** in this task's artifacts.

## Verification steps

1. The report exists under `ai-agents/knowledge-base/reports/`, dated, produced via
   `/fkit-design-spec`.
2. It names **both owner rulings verbatim**, with date (2026-08-06) and channel (`AskUserQuestion`,
   live `fkit lead` session), and keeps the verbatim shape primary over any gloss.
3. It engages ADR-015 **by name**: quotes the invariant, states that `Re-raise only if` trigger 1
   fires on this proposal, and carries the re-raise as an **explicit owner decision point in its own
   section** — findable as a standalone statement, not a footnote.
4. It weighs the recorded deferred alternative (the content-identity hash manifest) with/against the
   structure-spec `.md`, citing ADR-015's Rejected-alternatives section rather than re-deriving it —
   and states whether ADR-015's trigger 2 (a third drifting fkit-authored file) has fired.
5. Its trigger design either needs **no per-project state**, or explicitly flags that it re-opens the
   rejected cursor mechanism as an owner decision.
6. It names the role that runs the check and shows ADR-005's wiki-vault write exclusivity is
   preserved under every branch of the design.
7. It makes the `CLAUDE.md`/`AGENTS.md` include/exclude call explicitly, with a stated reason, as a
   proposal to the owner.

   > **⚠️ DATED CORRECTION 2026-08-06 — the call is already ruled; this step now verifies the ruling
   > is honored, not proposed. Step above left byte-identical.** The owner ruled **"In scope
   > (Recommended)"** (§Context authority, ruling 4). What this step now requires: the report
   > **records that ruling verbatim and dated**, designs the `CLAUDE.md`/`AGENTS.md` refresh under
   > the **same consent model** as the `ai-agents/` repair, and states the reasoning (root-location
   > vs the ADR-015 invariant's literal scope) — it does **not** re-open include/exclude as a
   > proposal.
8. It distinguishes the consent-gated in-session repair from the unattended launch path, and nowhere
   proposes a silent auto-update or an unattended agent executing natural-language items (both
   rejected/forbidden in ADR-015's record).
9. It ends with the open questions for the owner and a proposed implementation split — and **no
   implementation brief has been filed** by this task.
10. `git diff --stat` shows one new file under `ai-agents/knowledge-base/reports/` (plus, at most,
    board/brief rows the producer adds). Nothing under `claude/`, `test/`, or `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing
- **Blocks:** every implementation unit of the post-update structure check — **deliberately not yet
  filed** (investigation-first); the follow-up split is this design's deliverable §6, filed by the
  producer after owner review.
- **Open questions this design must return to the owner** (recorded here so they are not lost if the
  task idles): (1) the ADR-015 re-raise itself — what licence, if any, the repair path gets, and how
  the ADR record is updated; (2) the consent model; (3) `CLAUDE.md`/`AGENTS.md` in or out; (4) the
  trigger, if any candidate needs per-project state.
  - **✅ QUESTION (3) IS ANSWERED — 2026-08-06, owner ruling, verbatim *"In scope (Recommended)"***
    (§Context authority, ruling 4). List above left byte-identical. `CLAUDE.md`/`AGENTS.md` refresh
    is **in**, under the same consent model. **Questions (1), (2) and (4) remain open** and are still
    the design's to return.
- **⚠️ P4 is append rank, NOT a merit ranking — flagged for owner confirmation.** **On merit this
  belongs directly below `0182`**, because an owner-ruled product capability with live user impact
  (every consuming project on an old fkit keeps drifted scaffold files forever) outranks recording an
  already-taken decision (`0222`), while `0181`/`0182` sit above it — they repair a control running
  today and were pulled onto this board by the owner by name. Filed by a spawned producer with no
  owner channel, which never re-ranks (ADR-035).
  - **✅ ANSWERED same day — the flag above is DISCHARGED and the merit position is HONORED. Bullet
    left byte-identical.** Owner ruling, verbatim **"Move to merit P3 (Recommended)"**
    (`AskUserQuestion`, live `fkit lead` session, 2026-08-06; §Context authority, ruling 3). This
    task now holds **Sprint 3 `P3`** — exactly the recorded merit position, directly below `0182` —
    and `0222` holds `Sprint 3 P4` by the same ruling. Executed by a spawned producer **on that named
    ruling only**; not producer precedent. Full authority record: the Sprint 3 board's owner-ruled
    re-rank addendum (2026-08-06), which also reconciles `0222`'s earlier *"Leave it at P3"* ruling
    (a non-promotion ruling, given before this task existed — the two rulings do not conflict).
- Sprint 3 has **no closed rows today**, so ADR-035's closed-row wall does not yet bind a future
  owner-ruled move of this row; the moment any row closes, it does.
