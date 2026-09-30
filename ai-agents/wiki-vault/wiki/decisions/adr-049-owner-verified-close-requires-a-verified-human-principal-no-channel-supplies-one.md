# ADR-049: `author` is a claim plus its channel — fkit stops demanding a verified human principal, and anchors human verification at the git commit

**Date**: 2026-09-18
**Status**: accepted — ⚠️ **partly superseded 2026-09-30 by [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]**

**Source**: `ai-agents/knowledge-base/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md`

> ⭐ **Ingested 2026-09-30** (sync `a351cb6`→`3915417`) — no vault page until this pass.
>
> ⚠️ **The filename is deliberately unchanged** and now reads like the opposite of the decision. Its slug
> (*"…no channel supplies one"*) is still **true**; only the prescription it implied (*"so fkit must demand
> one"*) was reversed the same day, after the external expert's verdict.
>
> ⛔ **ADR-052 effect.** From 2026-09-30: **C4** (aiboard usable without fkit) dropped; **D7** superseded
> (fkit now owns the mechanism); **D8** discharged (`fkit board` is the command). In a project **once
> converted**: **D1/D3 amended** — the board sets owner-verified **only** for writes through the owner's
> web page, a label and not proof — and **D5**'s read-only posture ends. **D2 and D4 unchanged.** Until a
> project is converted, this ADR applies there as written.

## Context
- fkit's rule: only the producer closes, and anything an agent closes carries
  `(agent-closed — not owner-verified)`. `aiboard-lead` proposed that a **human dragging a card** is
  owner-verified by definition. fkit accepted the **semantics** and found the **plumbing** fails:
  - aiboard has **no identity mechanism** — the server takes `author` from the request body, default
    `"web"`; the CLI takes it from the environment.
  - ⛔ **A live remote-write defect (`T-022`)**: the server checks no `Origin`, `Referer`, `Host` or
    request `Content-Type`, so a page the owner visits could write to his board. Described as a defect
    class only — no reproduction in git; it lives on aiboard's board.
  - **The OS-identity argument for a terminal UI fails**: the owner and every agent run as **one OS uid**,
    agents can drive a terminal, and a TUI's author string is no better than the CLI's. ⭐ *A TUI does not
    create identity; at most it removes an anonymous write path — which a ~20-line server fix also does.*
- **Measured by the expert, stated against fkit's own argument (C5):** fkit's duplicated status carriers
  had **not** drifted — 0 disagreements across 403 live board rows, 0/405 id mismatches; only `0014`
  disagreed folder-vs-glyph.
- ⭐ **C6 — the real write-side blocker is fkit's:** the four movers are **1,814 lines of prose with no
  script**, so there is nothing for a board to call. Deferred to a sibling ADR →
  [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]].

**Owner rulings, 2026-09-18 (relayed via `fkit-lead`).** Ruling 1 (his own words) asked to consider
removing the web dependency and trying a terminal UI **alongside** the web board, compare, then decide.
Ruling 2 (**selected option text**): *"Claim-plus-commit, per the expert — Author becomes an explicit
CLAIM plus the channel it came through — no pretence of proof. Human verification lives at the git
COMMIT … Fix T-022 and stop there."* Ruling 3: he signed (no verbatim text relayed).

## Decision
- **D1 — `author` is a CLAIM plus its channel.** Every tool-written transition records
  `{claimed_actor, channel}`; fkit never infers verification from the channel.
- **D2 — Human verification is anchored at the git commit** — the one point a human is reliably in the
  loop. ⚠️ **Stronger than the marker, weaker than proof:** it is a cooperative convention (an agent can run
  `git commit`), and it *authorises*, it does not show the owner read the diff. ✅ *Unchanged by ADR-052.*
- **D3 — The marker keeps its meaning and stops pretending to be a control** — *"a labelling convention
  among cooperative agents"*; fkit builds no further mechanism to enforce it.
- **D4 — Closing `T-022` is a PRECONDITION of any write mode**, not a follow-up. The *"a browser drag
  adds no forgery power"* argument is true only of actors that already have Bash; it is **false** for a
  third-party web page, for which the web write path is its only power. ✅ *ADR-052 builds the fix into
  phase 2.*
- **D5 — Interim: fkit's board is served read-only.**
- **D6 — A terminal UI is evaluated alongside the web board, on usability, not identity.**
- **D7 — fkit does not specify aiboard's mechanism.** ⛔ *Superseded — after the merge fkit owns it.*
- **D8 — The deterministic-movers decision is deferred to a sibling ADR and blocks any board-originated
  write.** ✅ *Decided in ADR-050; discharged as a build by ADR-052 (`fkit board`).*

**Option F — "confirmation instead of attribution"** (the architect's own pre-verdict recommendation) was
**not taken** and is preserved: it bought a property fkit has nowhere else, cost a one-gesture close, and
⛔ **could not be built** — its applier would have been the 1,814 lines of prose.

## Consequences
- ⭐ **The ADR claims only what it can support**; *"owner-verified"* was never a lock.
- ⛔ fkit loses the ability to distinguish an owner-verified close from an agent one by anything stronger
  than cooperation plus the commit rule. The only stronger candidate on record is a signing key needing a
  passphrase or hardware touch — not adopted, not rejected.
- ✅ **Verified by the architect: no fkit hook can see a file write.** The registered hooks match `Skill`,
  `AskUserQuestion`, `Agent|Task`, `Stop` and `UserPromptExpansion` — none match `Edit`/`Write`/`Bash`, and
  there is no `permissions.deny`. So a write into `done/` or an edit to `## Status` is unguarded.
- **Recurring bug class named:** a measured figure asserted without its unit, denominator or counting rule.
- **Open, the owner's:** OQ-1 (where aiboard's generic-mechanism line sits) and OQ-2 (whether a TUI's
  change of audience is acceptable). ⚠️ *Largely moot after ADR-052 dropped C4, but the source ADR still
  lists them as open.*

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — amends D1/D3 at conversion; supersedes D7; discharges D8
- [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] — the sibling ADR D8 deferred to
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — the same day's store decision
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the producer-only rule, and *"not a laundering-proof gate"*
- [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]] — the nearest precedent for D3 (never upgrade the marker)
- [[tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam]] — task `0404`, the evaluation behind it
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[systems/fkit]] — the team page's owner-verified gotcha
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[tasks/sprint-11-fkit-aiboard-convergence]] — the board it was signed on
