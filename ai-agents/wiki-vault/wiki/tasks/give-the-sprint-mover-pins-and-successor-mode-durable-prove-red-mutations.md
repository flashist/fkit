# Give the sprint-mover prose pins and `dashboard.sh`'s `successor` mode durable `prove-red.sh` mutations

**Source**: `ai-agents/tasks/done/0388-give-the-sprint-mover-pins-and-the-successor-mode-durable-prove-red-mutations/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 9 · `P2` · `0388` · ✅ Done (agent-closed — not owner-verified)

## Goal

**`0341` added two new guarded surfaces and neither was covered by a mutation in `test/prove-red.sh` —
the gate that proves a guard can still go red.** ⭐ ***A guard nothing mutates is a guard nobody has
shown still discriminates.***

**Owner ruling 2026-09-12, verbatim *"File a follow-up task (Rec)"*.** ⛔ **The ruling is *file it*; it
settled no design question.**

## Key Changes

### The two uncovered surfaces — and they are TWO different `S`-series in two different files

⚠️ **The hand-over that produced this brief ran them together. They are not the same set.**

| Surface | Series | Where |
|---|---|---|
| The **sprint-mover roster** | `S0`–`S6`, **seven tests, no `S7`** | `test/mover-exemption-step.test.js` |
| The **`ADR-047 successor` series** | `S1`–`S10`, **ten tests** | `test/dashboard-contract.test.js` |

⭐ **The hand-over's numbering was wrong and the brief corrected it rather than repeating it:** it
described one `S0`–`S6` roster while citing an `S7`, and only the second series has one.
⛔ **An implementer who took the framing literally would go looking for a test that does not exist.**

### ⛔ The by-hand mutation evidence is EVIDENCE, not a gate

`0341`'s builder mutation-tested `mode_successor` **once, by hand, on a scratch copy** — three
mutations, each measured to red a named test. ⛔ ***"That is a one-off measurement from a build, not a
gate that re-runs. Nothing in the repo repeats it, so nothing will notice when it stops holding."***

⚠️ **One of the three redded two tests at once**, and the brief reads that as a signal: ⭐ **a mutation
that reds *everything* proves little. Prefer one that reds ONE named assertion.**

### ⭐ The discipline `0381`'s mutations 33 and 34 already established — and this task had to follow

- **An injected marker where the prose could occur naturally** (so an exactly-one-site guard counts the
  marker, not ordinary content a later edit adds) — ⛔ **but never where the wrong value IS the marker**
  (mutation 34's board word), because injecting prose there reds the assertion **for the wrong reason**.
- **Four checks per mutation:** the edit is not a no-op · no un-mutated copy survives · the mutation
  landed · it landed **exactly once**.
- ⭐ **Assert the suite reds AT THE NAMED ASSERTION**, failing on *"red for the wrong reason."*
- **Verify every anchor is unique in the target file before using it, and say so in the comment.**

### ⭐ ITEM A — the emitter map is unpinned PROSE, and a defect class had fired FOUR times

⛔ **Which `dashboard.sh` mode emits which drift record is restated in prose in several places, and NO
test asserts that any of that prose is right.** ADR-047 fences the class with the standing instruction
***"Re-raise on a third instance without further argument."*** ⛔ **`0341`'s round-1 finding `R6` was
the third instance; `R6`'s own fix was the fourth.**

⭐ **The hand-over's framing did not reproduce, and was corrected rather than repeated:**

- ✅ **The BEHAVIOUR is pinned** — `test/dashboard-contract.test.js` asserts the mode→record mapping at
  six sites.
- ⛔ **The PROSE is pinned by nothing.**
- **The prose sites are THREE `.md` files, not four skill copies** — `fkit-sprint-done/SKILL.md`,
  `fkit-sprint-cancelled/SKILL.md`, `fkit-status/SKILL.md` — ⛔ **the task movers name neither record
  at all.**

⭐ **So the real gap is narrower and sharper than "no test": a behaviour that IS pinned has an unpinned
prose restatement duplicated across three files, free to drift from it silently.**

**Re-measured behaviour, because the prose got it wrong twice:** `mode_select_active` **structurally
cannot** report a wholly-`Backlog` identity collision — it filters on `In progress` **before** its sole
`ambiguous-active-sprint` emission. ⭐ **The board render is what reports it**, via `sibling_claimants`,
which reads no status — and the record it emits is **`drift ambiguous-plan-identity`**, ⛔ **not
`ambiguous-active-sprint`.**

### ⭐ ITEM B — blind spot 11 stopped being a 0-cost prospective note

⛔ **An open `review.md` under `ai-agents/tasks/backlog/` IS scanned by the citation gate and IS NOT
exempt.** **This is ruled behaviour, not a defect** — owner ruling 2026-09-02, *"A + file follow-up D
(Rec)"*, with option B (exempting open ledgers) **refused by name** as a silent widening of *"closed
records are frozen"* into *"ledgers anywhere"*.

⚠️ **The guard's own disclosure said *"0 today … prospective cost UNMEASURED."* ⛔ It stopped being 0.**
`0341`'s `review.md` was the first ledger to sit in `backlog/` while the gate ran; a round-2 row cited a
document by line number, redding `L2` at an unmutated baseline and costing a full **~9-minute** gate run
to discover. ⛔ **Item B asks for NO exemption** — option B is refused and stays refused.

## Outcome

⭐ **Verified on disk 2026-09-16: `test/prove-red.sh` grew from 34 mutations to 39, and all five new
ones — 35 through 39 — carry task `0388`'s name.**

| # | What it breaks | Which assertion must red |
|---|---|---|
| 35 | Leaves a **sprint** mover's board word un-swapped | `S2` in `mover-exemption-step.test.js`. ⭐ **This closes mutation 34's own loop** |
| 36 | **Negates** `mode_successor`'s tie-break instead of swapping its arguments | `ADR-047 successor S6`. ⛔ **The trap both min-scans document** — `! identity_gt …` yields `<=`, so a tie REPLACES |
| 37 | Drops `🔲 Backlog` from `mode_successor`'s status filter | `ADR-047 successor S3`. ⛔ **The plausible wrong turn:** a filter of `In progress` alone is `select-active`'s, and it silently skips every scoped Backlog board |
| 38 | Makes `mode_successor`'s ordering **non-strict** (≥ instead of >) | `ADR-047 successor S4`. ⛔ **The closing board would then be its own successor** — `/fkit-sprint-done` would relocate a sprint's open rows onto the board being closed |
| 39 | Names the **wrong drift record** in a sprint mover's ambiguity step | `emitter map E2` in `dashboard-contract.test.js` — ⭐ **Item A's own defect class, mechanised** |

⭐ **The estimate was "~2–4 mutations"; five landed, and item A got one of its own.** ⛔ **This page
does not state the measured runtime cost** — the brief required it timed before and after and recorded
in the worklog, which this sync's filter excludes. **Not asserted here, because it was not measured
here.**

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[tasks/build-the-producer-only-sprint-movers]]
- [[tasks/give-the-task-movers-a-step-for-the-named-exempt-keys]]
- [[tasks/build-the-coordination-citation-policy-guard]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]
- [[systems/testing-and-verification]]
