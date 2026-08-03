# Plan — 0202: write `plan.md` at plan approval in the sprint loop, add its artifact table

## 0. Verified current state (re-derived this turn, nothing inherited)

**`claude/skills/fkit-sprint-ship-loop/SKILL.md`** — 256 lines.
- `grep -n 'plan\.md'` → **exactly one hit, `:103`**, the Build row:
  `| **Build** | `@fkit-coder` | implement the **approved** plan; write source + `plan.md`/`worklog.md`; return change surface + any decision surfaced | stop only if the worker returns `NEEDS-DECISION` |`
- `grep -n -i "artifact"` → **zero hits, exit 1**. No artifact table, and no `<task-folder>` definition anywhere. `worklog.md` appears at `:103`, `:106`, `:227`; `review.md` as a path: nowhere.
- Plan row is `:102`; its owner-gate cell ends *"— the unremovable checkpoint (prose-enforced here, see honesty clause)"*.
- `**Rules that make this honor the ADRs:**` heading is `:109`; the verbatim-carry bullet is `:110-116` (0203's region).

**`claude/skills/fkit-task-ship-loop/SKILL.md`** — 316 lines.
- Artifact table header `:101`, rows `:102-104`; plan row at **`:102`**: `` `<task-folder>/plan.md` | at plan approval | the approved implementation plan — **the boundary the loop's autonomy is measured against** ``. `<task-folder>` defined at `:106`.
- Step 4 at **`:142-143`**: *"On approval (plan mode releases the write wall), write the approved plan to `<task-folder>/plan.md` — the durable autonomy boundary."* Step 2 `:136-137` explains why it is not written earlier.
- **Brief's citations check out**, except `:100-104` for the table (header is `:101`). Board rows 175/176 and `0164`'s brief cite the Build row as `:102` — **stale, it is `:103`**.

**R4b re-confirmed on disk this turn:** `ai-agents/tasks/done/0162-…/plan.md`, 9625 B, `git hash-object` = `2458a57eda55ca774884110e76dee1bf91b6d6e0`.

## 1. The edit — four sites, one file

**(a) Build row `:103`** — stop claiming the worker writes it, and say so at the site where R4b happened:

> `…implement the **approved** plan; write source + `worklog.md` (**`plan.md` already exists — the driver wrote it at approval; never re-author it**); return change surface + …`

*Deliberate:* the row still names `plan.md`, in a negative. It satisfies brief step 3 as worded (*"no longer says the worker writes `plan.md`"*) and puts the anti-reconstruction instruction exactly where the failure occurred. Say so plainly — **owner can veto and I will drop the parenthetical.**

**(b) Plan row `:102`, gate cell** — append: `; **on approval the DRIVER writes the approved text to `<task-folder>/plan.md` verbatim — copied, not re-rendered — BEFORE spawning Build** (ADR-020; mirrors `fkit-task-ship-loop` step 4).

**(c) A note directly below the step table, above the `:109` "Rules…" heading** (region neither `0164` nor `0203` touches) — carries the design answer, the closes/does-not-close statement (brief step 5), and the do-not-delete instruction:

> **Why the driver writes `plan.md`, and what that does and does not fix.** The approved plan exists only in **this session's** `AskUserQuestion` exchange, so the driver is the only actor holding the approved bytes at the moment of approval. It writes `<task-folder>/plan.md` itself, in the same turn as the approval and **before** the Build spawn — **copying the approved text, never re-rendering or summarising it.** This is not a breach of *"the driver delegates, never substitutes"*: that rule forbids the driver **writing source** and **reviewing** (ADR-031 Decision 2), and the driver already writes the `🔄 In progress` and `🚧 Blocked` statuses itself (§2, §4). Delegating this copy would put a **context boundary** in the middle of it — the exact operation that failed.
>
> ⛔ **What it closes:** the **reconstruction route** — no worker is ever asked to reconstruct the plan, which is how `0162/plan.md` came to be a re-rendering of a plan approved hours earlier (blob `2458a57e`).
> ⛔ **What it does NOT close:** the **`carried-not-approved` class.** A hash pins *which bytes were carried*, not *which were approved*; a driver that persists a plan the owner never approved and carries it faithfully still verifies green over bytes the owner never saw. **Structural** — approval leaves no artifact (ADR-021) — and an **accepted residual** in `0162`'s review ledger. The driver doing the copy **narrows** the transcription hazard (one copy, no spawn boundary); it does not remove it, it relocates it to this session.
>
> ⚠️ **Do not delete this write as redundant.** A path + `git hash-object` pointer needs a file to point at, and a `PreToolUse` carry-check needs one at spawn time.

**(d) New `## Durable artifacts` section**, placed after the honesty clause / before `## The loop, numbered` (where the sibling puts its table). `<task-folder>` = `ai-agents/tasks/<board>/<NNNN>-<slug>/` (ADR-029); all git-tracked, left in the working tree, **owner commits**.

| File | Written by | When, and what it holds |
|---|---|---|
| `<task-folder>/plan.md` | **the driver** | **at plan approval, before the Build spawn** — the approved plan, copied verbatim; the artifact every later carry points at |
| `<task-folder>/worklog.md` | the **Build** worker, grown by Verify + Process-review | worklog + decision log — every autonomously-applied fix and obvious-winner call, `none` if none (ADR-032 A2 / ADR-019) → the close-out packet §5 surfaces |
| `<task-folder>/review.md` | the **spawned reviewer** (*Reviewer findings*) + the **Process-review** worker (*Coder response*) | the two-party ledger — separate ownership, never merged into the worklog |

Plus one line: statuses are **not** in this table — brief `## Status` + sprint row, governed by §2/§4.

**Not copied blindly from the sibling:** its `worklog.md` row says *"opened post-approval, grows P2–P5"* (task-loop phases — meaningless here) and its `review.md` row says *"reviewer + coder"* without naming that both are **spawned** in this loop. Both rewritten. Its `plan.md` row's *"boundary the loop's autonomy is measured against"* is kept in substance — it is equally true here (`:119-122`).

Estimated **+28 / −2 lines**, ~+2.4 KB. 256 → ~282 lines.

## 2. The design question, faced

**Who writes it: the driver.** Not a formality — I checked whether ADR-031 forbids it. It does not. Decision 2's prohibition is **specific**: *"It **never writes source and never reviews**"* (`adr-031-…:59`), echoed verbatim in this skill's own Hard rules (`:239-241`). A plan artifact is neither. Three supports:
1. **Precedent in-file.** `:94-98` has the driver set `🔄 In progress` *"via a spawned worker **or directly**"*; `:186-187` has it write its own `🚧 Blocked` markers. Document writes by the driver are already sanctioned.
2. **No alternative actor exists.** Approval happens in the driver's `AskUserQuestion`; the plan worker is finished and gone; the Build worker has not been spawned. The driver is the only actor between the two points.
3. **Any delegation reintroduces the defect.** Handing the bytes to a spawned worker to write is a copy across a context boundary — precisely the R4b operation. Strictly worse than a direct write.

**Residual, stated not softened:** the driver copies from **its own context**, not file→file. That is fewer hops than today, not zero hops. The rule text says so; it does not claim a structural guarantee. (Consistent with the honesty clause `:52-68`.)

## 3. Tests, budget, knock-on — measured

- `test/skill-frontmatter.test.js`: reads **frontmatter only** (its own header: *"It reads FRONTMATTER ONLY. A skill's BODY … remains untested by anything in this repo"*). `EXPECTED_SKILLS = 25` at `:574`; `ls -d claude/skills/fkit-*/ | wc -l` = **25** this turn. No skill added → pin unaffected. Frontmatter untouched → green.
- `grep -rn "SKILL.md" test/` : only comments, `dual-home-parity-exceptions.mjs` (path strings), and `prove-red.sh` mutation 9 — which mutates this file's **`description:` frontmatter**, not its body. Hook suites key on the skill **name** only.
- `dual-home-parity.test.js` walks `ai-agents/` vs `claude/scaffold/ai-agents/`; `claude/skills/` is in neither. Not covered.
- `rules-block-budget.test.js` measures **only** `claude/scaffold/universal-rules.md` via `emit_block()`/`RULES_MAX`. **No byte cap applies to a skill body.**
- **Net: nothing in the repo tests this change.** Verification is grep + reading the brief's 8 steps; `npm test` is a regression guard only, not evidence the change works. Will report suite counts.

## 4. Mid-flight safety — checkable, not asserted

- Edit **`claude/skills/fkit-sprint-ship-loop/SKILL.md` only.** `.claude/skills/fkit-*/` is gitignored (`.gitignore:17`), rm+cp'd from `claude/` by `fkit-claude-init.sh:482-485`, which `fkit-claude.sh:339,341` runs on **every launch**. Verified this turn: canonical and live copy are **byte-identical**, and all 25 skills are in sync.
- **Therefore the change reaches no session until the next `fkit` launch**, and the driver running me loaded its copy at session start — nothing re-reads it mid-session. The sprint run in flight finishes on the old text. The hazard the owner weighed is smaller than assumed, and that is now checked rather than argued.
- **I will not run `fkit-claude-init.sh`** — it would refresh 25 skills + 7 agents and widen the surface for no gain.
- **Resuming-driver window** (for the worklog, per the brief): a driver resuming after this lands may find no `plan.md` where the table says one exists. It must **not back-fill it from context** — that is R4b. Pre-Build → return to the plan gate; past Build → treat as a **degraded run** and put the close to the owner.
- `git status` clean at session start; will re-check before and after. **Change surface = one file**, proved by `git diff --stat`.

## 5. Interaction with 0203 / 0204 / 0164

- **0203** edits `:110-116` (the Rules bullet). My note sits **above** the `:109` heading — no overlap. Its construction (paste + path + `git hash-object` pointer) is only *possible* once this lands; note (c) records that, satisfying the brief's "record why this write exists".
- **0204** is **hard-gated** on this: with no `plan.md` at spawn time the hook fires on everything or is disabled on everything.
- **⚠️ Correction to the brief — `0164` does overlap, on the same table cell, not just the same file.** `0164` Option A says *"`claude/skills/fkit-sprint-ship-loop/SKILL.md:102` — give the **Build** row the per-decision content requirement"*. That is the cell 0202 rewrites. The brief's *"Regions do not overlap"* holds for `0203`, **not** for `0164`. Recommend `0202` lands first (it is `🔄 In progress` and gates two rows); `0164` re-verifies and writes into the Build row as it then stands. `0164` is P143 and would otherwise be selected first by priority order.
- Both `0164`'s brief and board rows 175/176 cite the Build row as **`:102`; it is `:103`.** Another stale-coordinate instance — **producer's to fix, not mine.**

## 6. Scope boundary — what I will NOT do

The Rules bullet `:110-116` (0203) · any hook or hook test (0204) · `claude/agents/fkit-coder.md` · condition **(b)**, byte-unchanged · `claude/skills/fkit-task-ship-loop/SKILL.md`, byte-unchanged · any file under `test/` · any ADR · `ai-agents/wiki-vault/` · `.claude/` copies · running `fkit-claude-init.sh` · committing or pushing · moving any task file · re-ranking the board · **and not fixing the ledger-key gap in §7** — found this turn, out of scope.

## 7. Found this turn, out of scope, surfaced not fixed

The **Review** row (`:105`) spawns `/fkit-stateful-review` without naming a **task-id**. `fkit-stateful-review`'s ledger-key rules (`SKILL.md:33-40`) then fall to rule 3 — **git branch name** → `ai-agents/sprints/reviews/<branch-slug>.md`, i.e. `main.md` on this branch — not `<task-folder>/review.md`. If that is what happens in practice, my artifact table's `review.md` row would be **wrong as written**. See OQ-3.

## 8. Sequence

1. Re-verify all coordinates (they move) → 2. edit (b) Plan row → 3. edit (a) Build row → 4. insert note (c) → 5. insert section (d) → 6. walk the brief's 8 verification steps → 7. `node --test test/skill-frontmatter.test.js`, then `npm test`, record counts → 8. `git status` + `git diff --stat` prove one file → 9. worklog with the resuming-driver guidance and the closes/does-not-close statement → 10. reviewer.

## 9. Open questions for the owner

- **OQ-1 (blocking the table's accuracy) — the `review.md` row.** (i) Write it as `<task-folder>/review.md` **plus a one-clause ⚠️ that the Review spawn must name the task-id, or the ledger keys by branch name** *(Rec — accurate, one clause, and the brief explicitly tells me to check this row rather than copy it)*; (ii) write the row plainly and file §7 as a separate follow-up; (iii) also fix the Review row to pass the task-id — **scope creep, not recommended**.
- **OQ-2 — the Build row's negative parenthetical** (*"`plan.md` already exists … never re-author it"*). Keep *(Rec — puts the anti-R4b instruction at the exact failure site; still satisfies verification step 3)* or drop, so the row names `plan.md` nowhere.
- **OQ-3 — rank.** Brief flags P180 as **append rank, not merit**; merit says directly above `0154`, ~fifty places up. It also states *"The owner confirms the rank."* Confirm P180, or re-rank *(no Rec — board order is the producer's/owner's, not mine)*.
- **OQ-4 — `0164` ordering**, given §5's correction that the two share a table cell. Land `0202` first, `0164` re-verifies after *(Rec)*.
