# Plan — task `0341`: build the producer-only sprint movers

> **Provenance.** Produced by a spawned `fkit-coder` (Plan step of `/fkit-sprint-ship-loop`),
> approved by the owner via `AskUserQuestion` in the live `fkit lead` session on **2026-09-12**,
> and written here by the **driver** at the moment of approval, before any Build spawn (ADR-020).
>
> ⚠️ **One declared transformation, so a later reader is not misled.** The plan text reached the
> driver through a task-notification channel that HTML-escaped `<` and `>` as `&lt;`/`&gt;`. The
> driver un-escaped them when writing this file. That is a real transformation of the bytes; every
> other character is a copy. No content was summarised, re-rendered, or omitted.
>
> ⚠️ **`carried-not-approved` still applies** (accepted residual, `0162`'s review ledger;
> restated at `fkit-sprint-ship-loop/SKILL.md:144`). A hash pins which bytes were *carried*, not
> which were *approved* — approval leaves no artifact (ADR-021).

---

## 0. What the planner verified on disk before planning (not inherited)

| Claim | Measured |
|---|---|
| `test:unit` baseline | **914/914 pass, 0 fail**, 24 suites, 75.7s |
| `0381` landed | its clause is on disk in both task movers | 
| `dashboard.sh` modes today | `<plan>` · `identity <plan>` · `select-active <sprints-dir>` · **`status <plan>`** (0338 shipped it). `USAGE` at `:309`. Version marker `⟦fkit-dashboard v2⟧` at `:65` |
| **No ordering surface exists** | confirmed — dispatch exposes no ordering; `select-active` filters `[ "$_st" = "In progress" ]` and would drop every `🔲 Backlog` successor |
| Task movers' step order | **identical** in both: `### 3. Move` → `### 4. Find` → `### 5. Update`. ADR-047 §4's inversion claim is about the **sprint** movers only |
| `MOVERS` invariant | `test/skill-ownership-hook.test.js:314`, plus `UNIVERSE` (25 names) and `OWNED.producer` |
| Citation guard exemption | `test/coordination-citation-policy.test.js` `L6 scope` — `forbidden` holds 4 prefixes; `sprints/cancelled/` absent |
| Frontmatter count pin | `test/skill-frontmatter.test.js:574` — **`EXPECTED_SKILLS = 26`** (exact equality) |
| Structure inventory pin | `test/structure-check.test.js:55` — **`EXPECTED_ROWS = 49`** |
| Structure manifest scope | `bin/generate-structure-manifest.mjs` walks `claude/scaffold/` + root files **only** — **no per-skill registration needed** |
| Rules-block budget | measured, and the tightest constraint in this task — see §D3 |
| `mover-exemption-step.test.js` T0 roster | hardcoded 2-entry `SKILLS` list + a walk pinning completeness by the signature `### 3. Move the task FOLDER to`. Sprint movers **cannot** match it, so T0 stays green |

⛔ **Driver correction to the planner's table.** The planner also wrote *"`0381` itself is still in
`backlog/` (not closed)."* **That is wrong.** Measured by the driver at approval time: `0381` is at
`ai-agents/tasks/done/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates`.
Nothing in this plan depends on the false claim. The planner's other observation — that
`sprint-8.md` and `0341/brief.md` were modified in the working tree — is also explained: **those two
edits are the driver's**, marking this task `🔄 In progress` before the Plan spawn.

---

## 1. Scope call — do the five accumulated items fit one task?

| # | Item | Verdict |
|---|---|---|
| 1 | FOLLOW-UP 2 — the ordering surface | ⛔ **Must stay.** No `/fkit-sprint-done` without it. Its *implementation* is a `0338`-surface change the ADR says to escalate → **D1** |
| 2 | FOLLOW-UP 3 — the right relocation-procedure pairing | ⭐ **Stays.** Pure prose inside the two new skills. Skipping it ships the named regression |
| 3 | V4 — `sprints/cancelled/` citation exemption | ⭐ **Stays** — owner-ruled "same change". Has a **measured trap** V4 did not see → **D2** |
| 4 | `0338` R7 — `fkit-status` resolves `cancelled/` | ⚠️ **Separable**, three-to-four lines in `fkit-status/SKILL.md` |
| 5 | `0381`'s 56-line exemption clause into both movers | ⭐ **Stays.** Mechanical, but position-sensitive → step 6 |
| 6 | The 2026-09-10 note — `backlog.md`'s "Off:" rule is 3 edits, should be 4 | ⚠️ Owner's call → **D4** |

**Honest sizing:** **large** — two ~350–450-line SKILL.md files, a new `dashboard.sh` mode, ~5 test
files touched, 2 exact-count pins to bump, a manifest regeneration, and a rules-block edit under a
tight budget. The movers themselves are one act and are not split.

---

## 2. Sequenced build steps

### Step 1 — the ordering surface
Add a fourth mode to `claude/skills/fkit-status/dashboard.sh`:

```
successor <sprints-dir> <closing-identity>
```

- Reuses `resolve_identity`, `plan_status_raw`, `is_eligible`, `identity_gt` — **no new grammar, no
  new traversal, no new depth** (the same depth-1 `"$1"/*.md` glob `select-active` uses).
- Filter = ADR-047 §3.0.2 item 1 + the successor predicate: `is_eligible` **AND**
  `identity_gt <candidate> <closing>` **AND** status ∈ {`Backlog`, `In progress`}.
- Order = §6.4 steps 3/4 verbatim — the same min-scan with **`identity_gt "$_best_id" "$_i"`**
  (swapped args, **not** negated; the trap is documented at `:265`).
- Prints **one basename** and exits 0; exits **3** when no successor exists; **1** on usage. A
  **value, not a rendering** — no `⟦…⟧` markers, exactly like `identity` and `status`.
- ⭐ **Basename only, deliberately.** The mover then calls `dashboard.sh identity <that file>` for
  the label. That is §3.0.1's *"two separate lookups, neither derived from the other"* **literally**.

⚠️ **Measured placement constraint:** `USAGE` at `:309` is asserted by an **unanchored**
`assert.match` whose pattern ends at `select-active <sprints-dir>` (recorded in-file at `:302-308`).
The new mode must be **appended after `status <plan>`**; inserting it earlier reds
`dashboard-contract.test.js`.

### Step 2 — `claude/skills/fkit-sprint-done/SKILL.md`
Built to the task movers' shape, with ADR-047's **inverted** step order.

- `⛔ Owner: the producer` banner (ADR-012 form, copied from `fkit-task-done`).
- Frontmatter as a `>-` folded block scalar (`skill-frontmatter.test.js`'s structural requirement).
- **`## Resolve the status value FIRST`** — the ADR-033 §5 table, same wording as the task movers:
  owner-present → `✅ Done`; spawned → `✅ Done (agent-closed — not owner-verified)`.
- Steps:
  1. **Validate.** Resolve identity via `dashboard.sh identity` (ADR-041 §5 — never re-derive).
     Refuse a `Backlog` identity, an unresolved identity, and a plan already under
     `done/`/`cancelled/`.
     ⛔ **Do NOT refuse on open rows** — ADR-047 §3.0 item 2 rejects *"refuse-to-close-while-rows-are-open"*
     by name. **Owner ruling Q1 of 2026-09-12 confirms: follow the ADR, relocate rather than refuse.**
  2. Resolve the status value.
  3. **Stamp the line-3 banner** — `> ## ✅ Done — <YYYY-MM-DD>. Closed by /fkit-sprint-done.`
     Replace an existing banner in place; never add a second. `Superseded by [<identity>](…)` optional.
  4. **Dispose of rows** (§3.0). Closed rows frozen. Each open row → the lowest-ordered non-terminal
     successor from step 1's `successor` mode, else the Backlog board. Marker:
     `➡️ Moved to [<resolved identity>](../<basename>) — priority M`, or
     `➡️ Moved to [Backlog](../backlog.md)`. `M` = the **destination** board's rank, appended
     (ADR-035); **no `— priority M` when the destination board is unranked**; verify the destination
     file exists before writing the marker.
  5. **Brief fields — FOLLOW-UP 3's pairing table, written into the prose:**

     | Destination | Mirror |
     |---|---|
     | a **successor sprint** | *"Pulling a backlog task into a sprint"* (`fkit-task-brief/SKILL.md:348-360`) → `## Sprint` = `Sprint N`, `## Priority` = the real number |
     | the **Backlog fallback** | *"De-scoping … back onto the Backlog board"* (`:369-385`) → `Backlog` / `🔲 Backlog` / `Unscheduled` |

     ⛔ **Mirror the BRIEF-FIELD steps only, never the marker** — that procedure's step 2 (`:353`)
     still writes the filename-as-identity form §3.0.1 withdrew.
  6. **Repoint every link** — in-file relative links first, then inbound repo-wide (`ai-agents/`,
     `claude/`, `test/`, `CLAUDE.md`, `README.md`; ⛔ **not** `wiki-vault/`). Re-derive counts at run
     time.
  7. **`git mv`** the plan to `ai-agents/sprints/done/`. No commit.
  8. **The `0381` exemption clause** (step 6 below).
  9. Handle ambiguity; **Report** in the task movers' shape, ending *"this skill made no commit"*.

### Step 3 — `claude/skills/fkit-sprint-cancelled/SKILL.md`
Mirror of step 2 with:
- **Mandatory reason** argument, as `fkit-task-cancelled`.
- Banner `> ## ⛔ Cancelled — <YYYY-MM-DD>. Closed by /fkit-sprint-cancelled — <reason>.`
- Row disposition **always to the Backlog board** — the de-scope procedure's five edits, per row.
- Destination `ai-agents/sprints/cancelled/`, **created if absent**.

### Step 4 — ownership and enforcement
- `claude/skills-for-role.sh:51` — the **producer** row gains `fkit-sprint-done fkit-sprint-cancelled`,
  and **nowhere else**.
- `test/skill-ownership-hook.test.js` — `UNIVERSE` +2; `MOVERS` grows **two → four**; the invariant
  comment updated to say four; every non-producer role denied both, spawned depth included.
- `test/skill-frontmatter.test.js:574` — `EXPECTED_SKILLS` **26 → 28**, as the deliberate edit its
  own failure message demands.

### Step 5 — the `sprints/cancelled/` directory + the citation exemption
- Create `ai-agents/sprints/cancelled/.gitkeep` (the repo's own placeholder idiom —
  `ai-agents/sprints/done/.gitkeep` is the precedent).
- `test/coordination-citation-policy.test.js` `L6 scope` — add `'ai-agents/sprints/cancelled/'` to
  `forbidden`, beside `done/` and `reviews/`.

### Step 6 — the `0381` exemption clause into both sprint movers
- **Read it from disk**, from `claude/skills/fkit-task-done/SKILL.md` — the block from
  `**Then check the exemption keys this move may have invalidated.**` through the *"Attribute before
  touching anything."* bullet. Substitute the board word (`done` ⇄ `cancelled`).
- ⛔ **THE TRAP.** In the task movers the clause sits at the tail of step 5, *after* the move. In the
  sprint movers the order is inverted, so **position is not the invariant — AFTER-THE-MOVE is.** The
  clause goes after the `git mv` step, i.e. **after step 7 above**, not after the repoint step. A
  heal is only observable at the new path.
- One phrase needs a genuine (not mechanical) change: the clause's *"The sweep above greps
  `ai-agents/` only"* is true of the task movers' step-4 sweep. The sprint movers' sweep is wider
  (`claude/`, `test/`, `CLAUDE.md`, `README.md` too) — **but still not the `NAMED_EXEMPT` keys inside
  `test/reference-integrity.test.js`**, which are JS string literals, not markdown links. Reword that
  one clause to say so accurately rather than paste a false premise. Everything else is
  byte-identical modulo the board word.
- Extend `test/mover-exemption-step.test.js`: a **second roster** for the sprint movers, reusing the
  same constants, with its own placement pin asserting **after the `git mv` step** (not after "Then
  prove it."). ⛔ Do **not** fold them into `SKILLS`/T0 — T0's signature is `### 3. Move the task
  FOLDER to`, which the sprint movers must not carry.

### Step 7 — `0338` R7: `fkit-status` learns `cancelled/` for **resolution**
`claude/skills/fkit-status/SKILL.md` — three sites, measured:
- `:89-90` — *"resolve it against `ai-agents/sprints/` **and** `ai-agents/sprints/done/`"* → add
  `cancelled/`.
- `:243` — *"On a closed sprint (one you found in `sprints/done/`)"* → add `cancelled/`, with one
  line noting a cancelled board's rows are `➡️ Moved to Backlog`, not `➡️ Moved to a successor`.
- `:501` — the usage example comment.

### Step 8 — prose that enumerates the movers

| File | Sites |
|---|---|
| `claude/agents/fkit-producer.md` | 4 occurrences |
| `claude/skills/fkit-team/SKILL.md` | 2 |
| `claude/scaffold/CLAUDE.md` | `:23` (role table), `:31` (producer's-alone paragraph) |
| `claude/scaffold/ai-agents/tasks/README.md` | `:18` |
| `claude/scaffold/universal-rules.md` | `:6` — the hard rule → **D3** |
| `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` | 4 — sprint-status authority split |

⚠️ `CLAUDE.md:62` and `AGENTS.md:41` are **generated** from `universal-rules.md` between the fkit
markers — edit the source, then re-run init. Do **not** hand-edit them.

### Step 9 — regenerate and verify
- `npm run generate:manifest` (a `claude/scaffold/` edit lands with its regenerated manifest in the
  same commit — `structure-manifest.test.js` reds when stale). ⭐ The rules-region **elision** means a
  `universal-rules.md`-only change does not move `CLAUDE.md`/`AGENTS.md` hashes; the scaffold-file
  rows do move.
- `bash claude/fkit-claude-init.sh .` to refresh `.claude/` — ⚠️ **canonical and mirror diverge until
  this runs**, so nothing is in force in this repo before it.
- `npm run test:unit`, then the full `npm test` (chains `prove-red.sh`, ~9 min).

---

## 3. Testing

**Iterate with `npm run test:unit`.** `npm test` chains `test/prove-red.sh` — ~9 min, 34 mutations.

| Target | What |
|---|---|
| `test/skill-ownership-hook.test.js` | four-mover invariant; producer allowed both; **six** other roles denied both, at session and spawn depth |
| `test/skill-frontmatter.test.js` | `EXPECTED_SKILLS` 28; both new skills' frontmatter is a `>-` folded scalar |
| `test/dashboard-contract.test.js` | new `successor` mode: picks the lowest-ordered `Backlog`-or-`In progress` board above the closing identity; **skips a `Done` board**; **includes a `Backlog` board** (the exact case `select-active` drops); tie-break first-wins on the ADR's own `plan-sprint-6.md` shape; exit 3 with no successor; usage string still matches |
| `test/mover-exemption-step.test.js` | second roster: clause present + uniform in both sprint movers, **placed after the `git mv` step** |
| `test/coordination-citation-policy.test.js` | `L6 scope` — `cancelled/` in `forbidden`, tree exists, nothing leaks |
| `test/reference-integrity.test.js` | unchanged expectations: **0 broken, 7 named-exempt across 6 keys**; the new `.gitkeep` is invisible to it (`.md` only) |
| Fixture end-to-end | ⚠️ Skill prose is a model procedure — **not scriptable end-to-end.** Testable: the mapping, the banner grammar via `dashboard.sh status`, the successor selection, and the clause text. **The banner-write, the row disposal, the link repoint and the `git mv` are prose an LLM executes and are NOT covered by any test that can be written here** — record that as an explicit uncovered surface rather than imply coverage. `prove-red.sh` mutations 33/34 are the precedent for what *is* reachable |

---

## 4. Edge cases and failure modes planned around

1. ⛔ **The `existsSync` trap in V4's own fix** — see D2. The one accumulated item that reds the suite if done the obvious way.
2. ⛔ **The rules-block budget** — see D3.
3. **Two exact-count pins** (`EXPECTED_SKILLS`, `EXPECTED_ROWS`) fail *closed*. Both failure messages say to update deliberately; do so, and say so.
4. **`select-active` silently drops `Backlog` successors.** Reaching for it as the ordering surface is the plausible wrong turn; the `successor` mode exists to prevent it.
5. **The negation-vs-swap trap** in the min-scan. Negating `identity_gt` yields `≤` and silently flips first-wins to last-wins. Copy the swapped-argument form and its warning comment verbatim.
6. **Successor href collision** (§3.0.1's silent tail): once a successor is itself archived under the same basename, a missing `../` resolves to the archived copy and **no guard fires**. Both markers carry `../`.
7. **Interrupted mover.** ADR-047 §4 accepts a half-moved board (atomic by *invocation*, not by filesystem) — repointed links to a not-yet-moved plan, caught by §7's location-mismatch drifts. The skill prose states this rather than implying a transaction.
8. **A spawned producer has no owner channel** (ADR-021) — every refusal path reports rather than asks.
9. **CRLF** reds `mover-exemption-step.test.js`'s raw matchers. Pre-existing, false-red-only, not this task's to fix.
10. **`0381`'s close must not orphan the second roster** added here.

---

## 5. Owner rulings — given live via `AskUserQuestion`, `fkit lead` session, 2026-09-12

These six answers are part of the approved plan. Where a ruling and the plan body above disagree,
**the ruling wins.**

| Id | Question | Ruling (option label, verbatim) |
|---|---|---|
| **D1** | What surface orders the successor set? | **"New `successor` mode (Rec)"** — option A. `0341` may edit `dashboard.sh` and `dashboard-contract.test.js`, `0338`'s surfaces. |
| **D2** | How does `ai-agents/sprints/cancelled/` come into existence? | **"`.gitkeep`, this repo only (Rec)"** — option A. **No scaffold change**, no `structure-spec.md` rows, **no `EXPECTED_ROWS` bump**, no manifest regen *for this item*. |
| **D3** | How does the hard rule grow inside 166 bytes? | **"Generalize the existing bullet (Rec)"** — option A. **One bullet covering all four movers; do NOT add a second bullet, do NOT evict, do NOT raise `RULES_MAX`.** |
| **Q1** | Refuse the close while rows are open, or relocate? | **"Follow the ADR — relocate (Rec)."** ADR-047 §3.0 wins over the brief's `## What to build` step 1, which is **stale text — note it, do not silently ignore it.** |
| **D4** | The `backlog.md` "Off:" rule — amend here or file it? | **"Amend backlog.md here (Rec)"** — option A. ⚠️ **`ai-agents/sprints/backlog.md` is a PRODUCER surface: the coder does NOT edit it.** The driver routes that one-line edit to a spawned `fkit-producer`. ⭐ Measured correction the ruling was given on: `fkit-task-brief/SKILL.md:359-360` already folds the fourth edit in — the gap is in `backlog.md`'s bullet **only**. |
| **D5** | Scope — keep everything, or split? | **"Keep everything in 0341 (Rec)"** — option A. Items 1/2/3/5 **and** item 4 (`0338` R7) ship here. |

**Plan gate:** approved 2026-09-12 via `AskUserQuestion`, option label verbatim
**"Approve — build it (Rec)"**, against a presentation that named the uncovered-behaviour surface and
the stale brief step. ⛔ The gate on this orchestrated path is **prose-enforced, not a structural
write-wall** (ADR-031 honesty clause / ADR-032 D7) — stated to the owner at the moment of approval.

---

## 6. Open questions carried into the build

**Q2 — the brief's `## Status` reads `🔄 In progress`** while the task had not started. **Resolved by
the driver:** that edit is the driver's own, made when it began driving the task (`/fkit-sprint-ship-loop`
§2). Not build state, and not the coder's to change — task files are producer-owned.

**Q3 — no test can reach the movers' actual behaviour.** Record the uncovered surface explicitly in
`worklog.md` rather than let a green suite imply coverage. A scripted extraction of the link-repoint
step would make it testable at the cost of a new executable surface — **that is a fresh design
decision, not this plan, and is not authorized here.**
