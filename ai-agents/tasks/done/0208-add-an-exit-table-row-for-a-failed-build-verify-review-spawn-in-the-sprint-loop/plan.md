# Plan — `0208`: exit-table row for a worker spawn that doesn't land

> **Provenance.** Produced by a spawned `@fkit-coder` running `/fkit-plan-task` under
> `fkit-sprint-ship-loop` (live `fkit lead` driver session), and **approved by the owner via
> `AskUserQuestion` on 2026-08-05**. Copied here verbatim by the driver at approval, before the Build
> spawn (ADR-020).
>
> **Owner's four rulings at approval:**
> - **OQ-1 → A.** Build the brief as scoped (the row + the `plan.md` note). **A producer files
>   `0167`'s doctrine half as its own brief.** Option B (widen into follow-up 1 in full) and
>   "A, and file nothing" are both rejected.
> - **OQ-2 → all five non-producer spawns** — Plan, Build, Verify, Review, Process-review.
> - **OQ-3 → row name `Worker spawn didn't land`.**
> - **OQ-4 → YES**, add the one-clause scoping note to the existing producer row.
>
> ⚠️ **Honest limit** (loop honesty clause): approval leaves no artifact of its own (ADR-021). This
> file pins *which bytes were carried*, not *which were approved*.

## 0. Headline findings, before the plan

- **`0208` IS the row half of `0167`'s follow-up 1 — arrived at independently, and it is NOT the whole of it.** `0167` §5 ruled the row and a `## Resume doctrine` section **must ship together**, and explicitly rejected "the row alone" (candidate A) as the option `0208`'s brief now scopes. **The owner ruled A anyway, and directed the doctrine half be filed as its own brief.**
- **`0167`'s follow-up 1 was never filed as a brief.** Verified: `/usr/bin/grep -rln -iE 'abnormal|resume doctrine|worker (terminated|dies|died)|dead worker' ai-agents/tasks/backlog/` → **one** hit, `0216-build-the-fkit-wiki-update-skill-for-the-lead/brief.md`, and its four `0167` mentions are all "named as an open exposure", not the follow-up. `0208` is the only backlog task touching this hole.
- **The brief's step-3 citation is pointing at the wrong case.** `0202/worklog.md:60-74` (heading at `:60`, *"⚠️ Mid-flight: what a resuming driver should do"*) answers *"a driver finds **no** `plan.md` where the table says one exists"* — the **mirror** of `0208`'s orphan case, not the case itself. Its substance is still usable (the `R4b` never-back-fill principle, the pre-Build / past-Build split), but the orphan branch has to be **derived**, not lifted. Stated plainly because the brief says "rather than re-deriving it."
- **Restricting the row to Build/Verify/Review would leave the one observed failure uncovered.** `0167`'s instance 3 was a **Process-review** worker. §2's drive table has five non-producer spawns (Plan, Build, Verify, Review, Process review). **Owner ruled: widen to all five.**
- **No test reads this file's body — verified firsthand, not repeated.** `test/skill-frontmatter.test.js`'s `splitFrontmatter()` returns `lines.slice(1, i)` — everything after the closing `---` is discarded. `/usr/bin/grep -rln "Stop conditions\|exit table\|hand-off didn't land" test/` → **exit 1, no hits** across all 16 files in `test/`. The three tests that name `fkit-sprint-ship-loop` touch only the command name (`shiploop-marker-hook`), the role↔skill map (`skill-ownership-hook`), and frontmatter description indentation (`prove-red.sh` mutation 9). **A green suite is a regression check, not proof the row landed.** Propose no text-presence test.
- **No dual-home risk — checked, because the brief doesn't mention it.** `test/dual-home-parity.test.js` covers `ai-agents/` vs `claude/scaffold/ai-agents/` only; `claude/skills/` is outside its surface. `/usr/bin/find` for this SKILL returns exactly two paths: `claude/skills/…` and `.claude/skills/…`, and the second is gitignored (`git check-ignore -v` → `.gitignore:17`). **Change surface stays one file.**

## 1. Coordinates — every one re-derived from text at plan time

| Citation | Claimed | Measured at plan time | |
|---|---|---|---|
| whole file | 255 (`0167` brief) → 296 (`0167` report) → 401 (driver) | **401** | holds |
| `## Stop conditions — the driver's exit table (§5.4)` | brief `:243`; driver said 335 | **335** | driver's cross-check holds |
| the nine data rows | brief `:243-256`; `0167` report `:247-255` | **339–347** (header 337, separator 338) | shifted |
| `\| **Blocked — hand-off didn't land** \|` | — | **346** | — |
| `**Invariant — no path ends in silence.**` | brief `:257`; driver said 349 | **349** | holds |
| `> **The one carve-out: a half-landed close**` | — | **352–356** | — |
| `## Progress reporting (§5.5)` | `0167` report `:266-267` | **358** | shifted |
| `## Durable artifacts` / its `plan.md` row | — | **72** / **80** | — |
| §2 drive table (Plan…Close) | — | **119–125** | — |
| `0202/worklog.md` §*Mid-flight* | brief `:60-74` | **`:60`, body `:67-74`** | holds |

**Net drift since the brief: exit table +92, invariant +92, file +146.** Every edit below is anchored on quoted text, not on these numbers.

## 2. Change surface

**Exactly one file:** `claude/skills/fkit-sprint-ship-loop/SKILL.md`. **Three edits** (OQ-4 ruled yes). No new file. **Do not run `fkit-claude-init.sh`** — `.claude/` is a gitignored regenerated copy; a running driver session keeps the old text until its next launch (same finding `0202`'s worklog recorded).

## 3. Edit 1 — the new row, verbatim

Inserted **directly above** the `| **Blocked — hand-off didn't land** |` row (at plan time 346), so the two "a spawn didn't land" rows sit adjacent and the producer/worker contrast is readable.

```
| **Worker spawn didn't land** | a task's **Plan, Build, Verify, Review or Process-review** spawn failed, was denied, or returned nothing — **not** the producer spawn, which is the row below | **Read disk before deciding, and read the paths the spawn instruction named** — wherever they live, never the task folder as a proxy, and never `git status` for an untracked path (it reads `??` before the write and after it): compare **content**. Then: **nothing landed** → reset `🔄 In progress` → `🔲 Backlog` in **both** locations and add it to the per-run skip set (§1); **something landed and stands on its own with the missing paths never arriving** → `🚧 Blocked — <step> spawn didn't land: <what landed, what is outstanding>` in **both** locations; **something landed but the unit is torn across paths** → **stop and put it to the owner** (`Owner decision pending`) — no agent may guess whether torn state is safe to build on. **`plan.md` is left in place — see the note below the invariant.** Either way: **report** it — do not pause the sprint; **do not count the task shipped**; next eligible task |
```

**Why each clause is there:**
- Three branches = `0167` §2's three disk states, worded to match; the middle branch carries `0167`'s round-2 R11 disambiguating clause (*"with the missing paths never arriving"*) so `complete` and `partial` are disjoint.
- `🚧 Blocked — <reason>` and `🔲 Backlog` both come from `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`. **Nothing minted.**
- "in **both** locations" on both status branches = the *no path ends in silence* invariant; "**report** it" = its owner-visible-report half.
- "never the task folder as a proxy / never `git status` for an untracked path" = `0167` follow-up 1 constraint (4)(a)(b), the refinement that exists because a real driver read disk and still misclassified.
- **No retry rule.** No count, no limit, no backoff. The producer row's *"once"* is untouched and not generalized.
- Length ≈ 900 chars vs the hand-off row's ≈ 620 — same voice, same three-column shape, no restructure.

## 4. Edit 2 — the supporting note, verbatim

Inserted **after** the existing `> **The one carve-out: a half-landed close**` blockquote (ends 352–356) and **before** `## Progress reporting (§5.5)` (358). This reuses the section's own existing construction for "the row needs a little more than a cell."

```
> **The orphaned `plan.md`.** `<task-folder>/plan.md` is written **at plan approval, before the Build
> spawn** (§*Durable artifacts*), so **every** exit past the plan gate — `Worker spawn didn't land`, both
> `Blocked` rows above, and `Blocked — hand-off didn't land` — leaves an approved-plan artifact on disk for
> a task nobody is driving. **Leave it in place: never delete it, never re-author it.** It is the approved
> bytes, and re-rendering them is the hazard writing it early exists to remove. **A later run that finds a
> `plan.md` whose task is not `🔄 In progress` must not read it as a live approval** — re-present it at the
> plan gate and re-approve before spawning Build. The mirror case is the same rule from the other side: a
> task **past** the plan gate with **no** `plan.md` → return to the plan gate pre-Build; **past Build,
> treat the run as degraded and put the close to the owner.**
```

Sentences 5–6 are derived (see finding 3); the final sentence is lifted in substance from `0202/worklog.md:71-74`.

## 5. Edit 3 — the producer-row scoping note (OQ-4, owner ruled YES)

One clause appended inside the **existing** hand-off row's trigger cell. Writes no new rule.

- from: `left the close partial (§4)`
- to: `left the close partial (§4) — **close-step only; its single re-spawn is not a general worker-retry rule**`

## 6. Sequencing

1. Re-derive all five anchors by `/usr/bin/grep` (the file moved four times in one session; assume it moved again).
2. Edit 1 → Edit 2 → Edit 3.
3. Read back §5.4 whole.
4. Verify (below).
5. Write `worklog.md` (change surface, verification, decision log — `none` if no unattended call).
6. Request a stateful review. **Do not commit.**

## 7. Verification

| # | Check | Command / method |
|---|---|---|
| 1 | Row count 9 → **10**; table still 3 columns | read back the §5.4 region; count `^\| ` in it |
| 2 | New row's trigger is a non-producer spawn, distinct from the producer row | read-back |
| 3 | Status named in **both** locations, values from the vocabulary | read-back against `task-status-vocabulary.md` |
| 4 | `plan.md` disposition + resuming-driver rule present in `SKILL.md` alone | read-back |
| 5 | **One file** | `git diff --stat` |
| 6 | Frontmatter guard green | `node --test test/skill-frontmatter.test.js` |
| 7 | Suite green, counts recorded | `npm test` |

⚠️ **6 and 7 are regression checks only.** Verified above: no test reads this file's body. **The only proof the row landed is the read-back plus the reviewer's pass.** Say so in the worklog rather than letting a green suite imply coverage.

## 8. Risks

- **R1 — the file keeps moving.** Mitigated: text anchors only, re-derived immediately before editing.
- **R2 — the row compresses `0167`'s operational test.** `0167` follow-up 1 writes a full decision procedure (list the paths → discharged? → the one separating question). The cell carries its *outputs* and its one disambiguating clause, not the procedure. **This is a real loss and it is OQ-1's accepted cost** — the owner ruled A and directed the doctrine half be filed separately.
- **R3 — `0167` §3's no-self-report rule has nowhere to live.** A table cell cannot carry it. Unresolved by this task under scope A; **it belongs to the doctrine brief.** Named, not smuggled in.
- **R4 — widening to five steps exceeds the brief's title.** Owner-ruled: widen. Note the divergence from the title in the worklog.
- **R5 — `0203`/`0164` adjacency.** Different regions; `0203` has landed (+92). Re-verify at edit time.

## 9. Open questions — all four ruled by the owner at approval

- **OQ-1 → A.** Build as scoped; **a producer files `0167` follow-up 1's doctrine half** as a fresh brief. `0167` §5's "must ship together" is knowingly deferred, not honoured, and R2/R3 stay open until that brief ships. Recorded as an accepted cost.
- **OQ-2 → all five non-producer spawns** (Plan, Build, Verify, Review, Process-review). The brief's literal three would not have covered `0167`'s only disk-corroborated instance.
- **OQ-3 → `Worker spawn didn't land`.** Honest about the two-branch outcome (one branch resets to `🔲 Backlog`, so a `Blocked —` prefix would overstate it); parallel with `Plan rejected` and with `hand-off didn't land`.
- **OQ-4 → YES.** Include Edit 3.
