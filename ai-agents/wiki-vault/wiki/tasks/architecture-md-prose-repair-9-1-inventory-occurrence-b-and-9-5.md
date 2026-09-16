# `architecture.md` prose repair — §9.1's inventory, §9.1's occurrence B, and §9.5's residuals

**Source**: `ai-agents/tasks/done/0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 9 · `P1` · `0392` · ✅ Done (agent-closed — not owner-verified)

## Goal

⭐ **Make the project's own reference document say only true things about §9.1 and §9.5.** ⛔ **These
are false statements in `architecture.md`, which is worse than a rotted pointer because a reader
cannot tell they are wrong.**

## Key Changes

### ⭐ It is a consolidation of FIVE cancelled rows, then a split — both owner-ruled

**Owner ruling 2026-09-13, verbatim *"Consolidate into one brief (Rec)"*** — the alternatives *keep
separate but co-scheduled* and *leave alone* were **declined**. ⛔ **A re-scoping act authorised by
that ruling and by nothing else:** a previous producer surfaced the consolidation and **correctly
refused to perform it unasked.**

**Owner ruling 2026-09-13 (second), verbatim *"Split A–C from D–E (Rec)"*** — the two citation sweeps
moved out to `0393`.

| Cancelled original | Its scope | Landed as |
|---|---|---|
| `0251` | §9.1 test-suite inventory (⚠️ **§9.1, not §9**) | **this row, Group A** + **OD1** |
| `0376` | §9.1 occurrence B — four falsified CI clauses | **this row, Group B** (item 6 **discharged by construction**) |
| `0366` | §9.5 residual-drift bullets | **this row, Group C** + **OD2** |
| `0286` | whole-file citation sweep | ➡️ `0393`, Group D |
| `0323` | repo-wide `ADR-NNN:LINE` sweep | ➡️ `0393`, Group E |

⛔ **The five originals stay CANCELLED and frozen.** Both rows cite them as **provenance only**.
⚠️ **A future reader must not generalise either ruling into a licence to merge or split briefs on a
producer's own judgement.**

### ⛔ The split did not remove the ordering constraint — it made it a cross-row one

The consolidated row's safe internal order was `B → A → C → E → D`, because **Group D's deliverable IS
line arithmetic** and every prose group moves the coordinates it depends on. ⭐ **That became a hard
dependency: this row first, `0393` against the settled file.**

### The three groups

- **Group A — §9.1's inventory.** ⭐ **The drift rate is the argument, not any number in it:** the
  suite count moved **8 → 19 → 20 → 29** (⚠️ plus a wrong 21 in `0252`'s worklog — do not propagate
  it), and **21 of 29 suites were unnamed**. ⛔ **§9.1 did not merely omit them — it asserted the
  wrong total in words:** *"`test/` now holds a real one: **eight `node --test` contract suites**"*.
  ⛔ **Do NOT restore *"no CI runs it"* anywhere in §9** — the thesis to preserve is *coverage, not
  automation*.
- **Group B — the four falsified CI clauses `0312` left undone.** *never observed green*, *lands
  unpushed*, *only ever run on darwin*, and **the dash risk stated as live**. ⛔ **The red first run
  must be described as a filesystem case-sensitivity divergence, not as the predicted dash failure** —
  ⚠️ *"getting this backwards is a defect of this task; it replaces one false claim with another."*
- **Group C — §9.5's residual bullets.** ⭐ *"The section documenting the project's drift has itself
  drifted."* **3 of 3 measured false.**

### ⛔⛔ Three layers of instruction about the same bullet, and two of them were repealed

| Layer | What `0251` said | Standing |
|---|---|---|
| 1 (2026-08-12) | *"Do not soften, shorten, or delete that caveat, and never write that CI is working."* | ⛔ **Repealed** by layer 2, inside `0251` itself |
| 2 (`0251`'s 2026-08-15 correction) | *"Do NOT preserve, restore, or re-word … do not obey 'never write that CI is working.' Both instructions now command a falsehood."* | ✅ **Binding** |
| 3 (pointer to `0312`) | *"`0312` … owns the repair of that exact §9.1 bullet"* | ⛔ **Dead** — `0312` closed with occurrence B undone |

⛔ **Layer 1 is not a live hazard and must not be obeyed.** It is kept so nobody re-derives the
contradiction from a cancelled brief and follows the wrong half.

### ⛔⛔ Two carried-forward flags — a correction that was itself half wrong

`0366` described bullet 1 as *"`fkit-claude-init.sh` prints a **derived** count from `ls … | wc -l`"*.
⛔ **Measured: the summary block prints NO role count at all** — a comment records that as
**deliberate, owner-ruled 2026-07-20** — and the derived `n_agents` value sits on a **different line**
counting **refreshed agents, not roles**. ⭐ **So bullet 1 was false in both halves, and `0366`'s
correction of it was itself half wrong.** ⚠️ **That is why Group C says *"firsthand"*, not *"confirm"*.**

⚠️ **And a trap at pickup:** the phrase *"eight `node --test` contract suites"* **wraps across a line
break**, so a naive `grep 'contract suites'` returns nothing and the text looks gone. ⛔ **Do not
conclude a clause is absent from a single-line grep.**

## Outcome

### ✅ Both open decisions were ruled at the plan gate — the board's biggest risk did not materialise

| | Question | Owner ruling 2026-09-14 (verbatim) |
|---|---|---|
| **OD1** | Should §9.1 stop enumerating suite names by hand at all? | ***"Count + named groups (Rec)"*** |
| **OD2** | What should §9.5 contain now — and should it exist at all? | ***"Keep, add dated note (Rec)"*** — ⭐ **§9.5 stays; no section deleted** |

⭐ **OD1 had been owner-DEFERRED since 2026-08-13** (*"Leave it for 0251's own run"*), and the
deferral's trigger was this row's run. ⚠️ **OD2 had NO owner ruling at all, and `0393` waited on its
answer** — a whole-section deletion would have moved every coordinate below it.

### ⭐ What §9.1 and §9.5 say now — measured on disk 2026-09-16 by this sync

- **§9.1** opens *"The suite now runs automatically — CI plus an in-release gate; `install.sh` is still
  uncovered"*, states **"29 `node --test` suites, counted 2026-09-14"** with *"re-count with
  `ls test/*.test.js | wc -l` rather than trust the figure"*, and names suites ⭐ **by group, "not as a
  complete list"** — OD1's ruling, visible in the text. ✅ **Re-measured this sync:
  `ls test/*.test.js | wc -l` = 29.**
- **The CI bullet** now reads *"CI has been exercised on a runner. Measured **2026-09-14** … **43 runs
  on `ubuntu-latest`, 39 green and 4 red**"*, with ⚠️ ***"Those are counts on a date, not a standing
  guarantee"***, and names the first red run as the **filesystem case-sensitivity** divergence repaired
  by `0283`. ⛔ **All four falsified clauses are gone.**
- **§9.5** is now **one dated sentence** — *"The residuals previously listed here were verified
  discharged or false on 2026-09-14"* — naming all three, ⭐ **plus the accurate ADR-027 dual-home
  paragraph, which survived** (the collision `X4` warned must not die as collateral if §9.5 went).

⚠️ **`0392`'s `## Owner` is `fkit-architect` and the brief FLAGS that as an unsettled producer
judgement** — the three originals disagreed (`0251`/`0376` were `fkit-coder`, `0366` was
`fkit-architect`), and ⭐ **Group A is mechanical and coder-shaped**. ⛔ **Sprint 9 did not settle it.**

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[tasks/the-two-citation-sweeps-architecture-md-and-the-repo-wide-adr-line-class]]
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]]
- [[tasks/make-the-lockdown-guard-case-test-filesystem-independent]]
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]]
- [[systems/testing-and-verification]]
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
