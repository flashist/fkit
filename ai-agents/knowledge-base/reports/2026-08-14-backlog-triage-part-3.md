# Backlog triage, part 3 of 4 — rows `0214`–`0240` + `0250`

**Read-only assessment, 2026-08-14, HEAD `4424b44`.** 27 rows triaged against the live tree.
**Counts: `KEEP` 23 · `STALE-PREMISE` 3 (`0221`, `0236`, `0240`) · `DONE-IN-FACT` 1 (`0238`) ·
`SUPERSEDED` 0 · `DUPLICATE` 0 · `UNCLEAR` 0.** Every verdict was checked against the artifact the
row claims is missing or wrong — no verdict rests on the row's own wording alone. ⚠️ **The `size`
column is an estimate, not a measurement**: an `S`/`M`/`L` eyeball from the row and the touched file,
with no plan written and no diff scoped. Citations use the durable `path@YYYY-MM-DD:NNN` form
(`0160`), not naked `:NNN`.

**The headline: one row is already done.** `0238` (wiki re-sync after the Sprint 2 archival) was
performed by a wiki sync run that names the task by number in its own log; the row is still
`🔲 Backlog`. Details in *Cross-cutting observations*.

| id | verdict | theme | size | depends | evidence |
|---|---|---|---|---|---|
| 0214 | KEEP | testing | M | nothing | `test/prove-red.sh@2026-08-14` carries mutation 14 → `"0210/A"` (`:736`) and nothing else for `0210`; **no `0210/D` and no `0210/G` mutation exists** — grep for those assertion names returns only the `0210/A` block. The two hand-proven guards are still mutation-unproven, exactly as the row states. |
| 0215 | KEEP | testing | M | nothing | The landmine is intact: `test/prove-red.sh@2026-08-14:82` still writes `: > "$work/package.json"` (empty marker), and `:247-260` still carries the *"THE package.json COPY IS LOAD-BEARING"* workaround comment inside `make_repo_copy()`. Nothing repaired, nothing broken today — the row's own framing. |
| 0216 | KEEP | wiki | M | nothing | `claude/skills/` holds 26 skills and **no `fkit-wiki-update`** directory. The owner-requested sequencer does not exist. |
| 0217 | KEEP (blocked) | ownership | M | **`0216` — hard, still open** | `skills_for_role()` at `claude/skills-for-role.sh@2026-08-14:50` gives `lead` five skills, none of them `fkit-wiki-update`. Correctly blocked: there is no skill to declare ownership of until `0216` lands. |
| 0218 | KEEP | budget | S | nothing | Both halves re-verified today. `0177`'s brief still pins the stale figures — `brief.md` says *"costs **404 B** of the `RULES_MAX=4096` cap"* and *"still measures **3570 B** with **526 B** headroom"*. Live: `claude/fkit-claude-init.sh@2026-08-14:337` reads `RULES_MAX=4352`, and the source is 3433 B → **515 B free**, reproducing the row's 2026-08-05 re-measurement to the byte. `0177` remains open, so its worker would still be told to reproduce numbers the repo cannot produce. |
| 0219 | KEEP | budget | S | nothing | The ≥400 B target is **still prose only**: `test/rules-block-budget.test.js@2026-08-14:21` — *"Standing budget target (same ruling): keep >= 400 B free."* — is the file's **only** occurrence of `400`. No assertion. Report it as UNGUARDED, per the row. |
| 0220 | KEEP (blocked) | budget | M | **`0177` — still open** | The wrapper is unchanged (`emit_block()` at `claude/fkit-claude-init.sh@2026-08-14:344-353`), and the mandatory codex-side measurement is still the recorded default the row bans inheriting: `:332` still reads *"UNVERIFIED: the codex side (AGENTS.md, codex-cli 0.145.0) was not re-measured here; assume it still pays."* ⚠️ Chain hazard — see observations. |
| 0221 | **STALE-PREMISE** | docs-drift | S | nothing | The work still matters; the row's ⛔ constraint is now false. It says *"EXACTLY ONE of the three premises is false — do not 'repair' the other two"*, naming `0191`'s clause as still absent. **`0191` has since landed** (`ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/`), so `0194`'s premise **3** (*"`0191`'s clause does not exist — same"*, `0194/brief.md` §*Why it cannot be done now*) is false too. **Two premises to repair, not one**, and only `0189` (registry module `test/skill-ownership-sites.mjs`, absent from `test/`) still holds. Re-scope before pulling. |
| 0223 | KEEP (unblocked) | sprint-loop | M | `0222` — **now DONE**, dependency discharged | The defect is live: `claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-14:126` still reads *"apply `fkit-process-stateful-review` **method**"* with no enumeration of what the method contains. The dependency is satisfied — `0222` is in `done/` and `adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md` exists, so the row's *"cite ADR-038 once it exists"* is now executable. |
| 0224 | KEEP (owner input needed) | ownership | L | relaxed to nothing (owner, 2026-08-06) | Neither half exists. `deny()` at `claude/skill-ownership-hook.sh@2026-08-14:41-49` prints and exits — **no log append**. No test in `test/` asserts a worklog `**Role:**` line. ⚠️ Relaxed ≠ ready: the **denial-log path** is still unruled and still blocks the coder (`.fkit/` is gitignored). |
| 0225 | KEEP | ownership | M | relaxed to nothing (owner, 2026-08-06) | `test/skill-ownership-hook.test.js@2026-08-14` asserts role×skill pairs directly (`:110-123`); **nothing in `test/` reads `fkit-sprint-ship-loop/SKILL.md` or parses its step-2 table** — grep for that path across `test/*.js` and `test/*.mjs` returns zero. The row's mandatory honesty clause still applies unchanged. |
| 0226 | KEEP | ownership | M | nothing | `claude/skills-for-role.sh@2026-08-14:12-18` still reads *"**FOUR** hand-maintained places MIRROR this list"* and lists exactly those four. The header's own warning — *"a checklist that is itself incomplete is worse than no checklist"* — is still standing over an incomplete checklist. |
| 0227 | KEEP | sprint-loop | M | nothing | The fidelity leg is still missing. `claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-14:190-193` still hashes **the file** (`git hash-object <path>`) beside the paste; no step re-derives a hash **over the pasted block** and compares. Provenance + presence, never fidelity — exactly as filed. |
| 0228 | KEEP | sprint-loop | L | nothing hard | There is **no `## Resume doctrine` heading** in `claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-14` — its section list runs Overview · plan-gate honesty · Durable artifacts · The loop · Stop conditions · Progress reporting · Hard rules · Usage. `0208`'s row shipped alone; the doctrine half is still unwritten. |
| 0229 | KEEP (unblocked) | movers | M | owner's overlap answer — **given** (*"Ship 0229 standalone"*) | Both halves reproduce. `claude/skills/fkit-task-done/SKILL.md@2026-08-14:81-84` still carries exactly **one** step-1 exception, requiring the brief to already read `✅ Done (agent-closed — not owner-verified)`. And the drifted pair is still drifted: `ai-agents/tasks/done/0021-build-fkit-reconnect-tooling/brief.md@2026-08-14:13` and `ai-agents/tasks/done/0041-fix-claude-agents-md-placeholder-text/brief.md@2026-08-14:13` both read `🔲 Backlog`. Owner accepted that cost; it is still being paid. |
| 0230 | KEEP | movers | S | nothing | The self-contradiction is intact in `ai-agents/knowledge-base/conventions/task-status-vocabulary.md@2026-08-14`: `:36` — *"never by hand-editing a file"*; `:69` — *"mover skills already do this — do the same by hand."* Latent, not active, as filed. |
| 0231 | KEEP | wiki | M | nothing | `claude/skills/fkit-wiki-sync/SKILL.md@2026-08-14:94` still **asks for** the figures — *"N source files changed, M pages created, K pages updated"* — while no step derives them from a diff or classifies an edit additive-vs-replacing. The figures still come from recollection. |
| 0232 | KEEP | docs-drift | L | nothing | Every named class is still on disk and **zero dated corrections have been appended** (grep for `DATED CORRECTION` in the ADR returns 0). Still-stale: `adr-012@2026-08-14:75-76` names `claude/fkit-claude.sh:92-103` as `skills_for_role()`'s home (it is `claude/skills-for-role.sh:48-59`), plus `:57`, `:60`, `:81`, `:172`, `:175`. |
| 0233 | KEEP (blocked) | ownership | M | **`0189` + `0224` — both open, neither artifact exists** | `test/skill-ownership-sites.mjs` is absent from `test/`; the denial log does not exist (`deny()` writes nothing). The row's own warning fires: *"If either is still absent when pulled, the row is `🚧 Blocked`, NOT `✅ Done`."* |
| 0234 | KEEP | dashboard | L | nothing | The rule-2 arm is unchanged: `claude/skills/fkit-status/dashboard.sh@2026-08-14:1013-1015` still tests `[ -n "$moved_target" ] && [ "$b_sprint" != "$moved_target" ]` — a frozen target against a current `## Sprint`. ⚠️ **The ceiling grew**: the row costed 45 Sprint 2 rows; `ai-agents/sprints/done/` now holds **five** archived plans (sprint-1…5), so the reverse-move exposure spans five boards, not one. Defect unchanged, blast radius larger. |
| 0235 | KEEP | dashboard | L | nothing | `dashboard.sh@2026-08-14` cross-checks the plan cell, the brief's `## Status` and the folder location; **nothing compares a brief against its own prose** — its only `## Notes`/prose handling is table-parsing and `Depends on:` anchoring (`:512-513`). The `0185` class is still uncaught. |
| 0236 | **STALE-PREMISE** | docs-drift | L | nothing | The sweep is still needed but its frame is two rollovers out of date. It is scoped to *"after the Sprint 2 archival"* and names **`sprint-3.md` as a live document to re-point** — Sprint 3 was archived on 2026-08-07 and now sits at `ai-agents/sprints/done/sprint-3.md`. Measured today outside the vault: **157** occurrences of `ai-agents/sprints/sprint-2.md`, **15** of `sprint-3.md`, **50** of `sprint-5.md`. The live/frozen/no-op classification the task turns on must be re-derived against five archived boards, not one. |
| 0237 | KEEP | citations | L | nothing (it **blocks `0176`**) | The hole is unfilled: `0176` is still in `ai-agents/tasks/backlog/`, and `0171` (which writes the durable target form) is also still open, so the row's *"name the form you used and why"* fallback still applies. ⚠️ **The scanned-set question widened again** — the row already flags `sprints/done/` as an open scoping decision; that directory now holds five plans. |
| 0238 | **DONE-IN-FACT** | wiki | S | nothing | ⛔ **The work has been performed and the row is still open.** `ai-agents/wiki-vault/log.md@2026-08-14:1751` records it by task number: *"**Task `0238` verification (the vault-staleness resync this run performs).** Before: **5 vault files** carried the literal pre-archival path … After: **zero live claims that Sprint 2 is active or that the board lives at the old path.**"* — and enumerates all five remaining literal instances as deliberate frozen records, which is precisely the verification form the brief demands. Six vault files still contain the string; every one is on that named list. **Propose closing.** ⚠️ The producer must confirm who ran it and whether the close is agent-closed — see observations. |
| 0239 | KEEP (blocked) | wiki | M | **`0232` — hard, still open** | Correctly blocked and the block is real: ADR-012 still carries every stale coordinate (see `0232` above), so a re-sync today would copy the stale coordinates forward — exactly the burn the brief's ⛔ forbids. |
| 0240 | **STALE-PREMISE** | adr | M | `0222` — **now DONE**, dependency discharged | The decision is still worth recording (it is what makes the rejected committed-snapshot option closeout rather than a returning review finding), but **every ordering clause in the row is spent.** (1) *"SEQUENCE AFTER `0222` (Sprint 3 `P3`)"* — `0222` is closed and Sprint 3 is archived. (2) ⛔ *"DO NOT PRE-ALLOCATE 039"* — `adr-039` through `adr-043` are all taken on disk; the number sweep must start above 043. (3) *"**Blocks: `0182` — soft**"* is **dead**: `0182` shipped, and `test/closed-rank-immutability.test.js@2026-08-14:18` already implements the ruled design — *"TWO LIVE LEGS … Leg 1: working tree vs HEAD. Leg 2: HEAD vs HEAD^"* — so this ADR now documents a shipped guard rather than gating one. Re-frame before pulling. |
| 0250 | KEEP | scaffold | S | nothing | The omission reproduces exactly. `claude/scaffold/CLAUDE.md@2026-08-14:23` producer row lists `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` — **no `/fkit-task-brief`** — while `claude/skills-for-role.sh@2026-08-14:51` grants the producer `fkit-task-brief`. The manifest-regen requirement still stands (scaffold `CLAUDE.md` is hashed by `test/structure-manifest.test.js`). |

## Rows I could not judge

**None.** Every one of the 27 resolved against a checked artifact. Where a row's verdict is `KEEP`
but its execution is gated (`0217`, `0220`, `0233`, `0239`, and `0224` on an unruled path), that is
recorded as a live dependency in the table, not as an inability to judge.

## Cross-cutting observations

- ⛔ **`0238` is already done and nobody closed it.** The wiki sync run that did the work wrote its
  verification into `log.md` naming the task number, but the board row never moved. ⚠️ **Two things
  the owner must settle before it closes:** (i) the close is producer-only (ADR-033), so it goes
  through `/fkit-task-done`, and (ii) it was performed by an agent, not owner-verified — so the close
  must carry `(agent-closed — not owner-verified)` unless the owner verifies it now. **This is the
  one row in my 27 that should not enter any sprint.**
- ⚠️ **`0222` landing quietly unblocked three rows and stranded a fourth.** `0223` (dependency
  discharged, now executable), `0224` and `0225` (already owner-relaxed) are all clear; `0240`'s
  `0222` dependency is discharged **and** its whole ordering rationale expired with `0182` shipping.
  If a Sprint 6 is scoped from this board, `0223` is genuinely ready today and reads as blocked.
- ⚠️ **The budget chain is three deep and its middle link is broken: `0220` → `0177` → `0218`.**
  `0220` cannot start without `0177`'s codex-side measurement; `0177` as written instructs its worker
  to reproduce a 4096 B cap the repo no longer has; `0218` is the one-file repair that fixes that.
  **`0218` must ship before `0177`, and `0177` before `0220`** — and `0218` is a small, unblocked,
  independent row. It is the cheapest unlock in my range. `0219` sits beside them and is independent
  of all three.
- ⚠️ **Two rows are still waiting on an owner decision, not on code.** `0224` — the denial log's
  **path** (`.fkit/` is gitignored, so the owner-ruled "git-tracked, append-only" shape has nowhere
  agreed to live). `0233` — inert until `0189` and `0224` both land, and `0189` is outside my range.
- ⚠️ **The Sprint-2-archival framing recurs across my range and has aged badly.** `0236`
  (prose sweep), `0237` (scanned set), `0238` (vault), `0234` (drift ceiling) were all costed against
  **one** archived board. There are now **five** in `ai-agents/sprints/done/`, and `sprint-3.md`,
  which `0236` treats as a live re-point target, is one of them. Whoever scopes these must re-measure;
  none of the recorded counts reproduce.
- ⚠️ **`claude/skills/fkit-sprint-ship-loop/SKILL.md` is contended by four of my rows** — `0223`,
  `0227`, `0228`, plus `0225` reading it — and by `0203`/`0204`/`0208` outside my range. Every one of
  those briefs already carries the *"re-read live, cite by heading, never by line"* warning. If more
  than one is sprinted together, sequence them; do not run them in parallel.
- ⚠️ **`0221` is a triage finding in its own right**: a repair task whose own ⛔ scope constraint has
  gone stale in the same way as the defect it repairs. It is cheap (`S`) but must be re-scoped from
  one false premise to two before anyone works it.
- **No duplicates and no supersessions found in this range.** The rows that circle the same subject —
  `0229`/`0230`/`0235` around *a brief's own fields have no keeper*, and `0236`/`0237`/`0238` around
  the archival — each already state in their own text why none subsumes another, and I verified the
  claim in each case rather than inheriting it.
