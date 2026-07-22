# Widen the sweeps that look in too few places — the movers' references, the next-ADR-number derivation, the lint's blindness to a reused number, and the installer's hard-coded role count

## ID
0036

## Sprint
Sprint 2

## Priority
81

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Both task movers sweep for inbound references after moving a brief, so that links to the old path get
re-pointed instead of rotting. **That sweep does not cover `ai-agents/knowledge-base/`.**

- `claude/skills/fkit-task-done/SKILL.md` — step-4 sweep greps `ai-agents/sprints/ ai-agents/tasks/`.
- `claude/skills/fkit-task-cancelled/SKILL.md` — **same gap**, in two places: the step-4 sweep and the
  later dependency search, both scoped to `ai-agents/tasks/ ai-agents/sprints/`.

The skills are explicit that the grep is "recursive on purpose" so it reaches `sprints/done/` — the
recursion was thought through, the **root set** was not.

**This is a live defect, found by observation, not by reading.** While closing task 74 and the
tester-agent decision, five stale links needed repair — **three of the five were in
`ai-agents/knowledge-base/`**, outside the sweep. Every ADR and report that back-links a task brief is
outside it. The movers therefore leave rotted links behind in the knowledge-base **by design**, on
every close.

Same class as Sprint 2 tasks 21/22 — link rot the movers themselves caused.

### Part B — the next-ADR-number derivation looks in too few places (added 2026-07-19, owner ruling)

**This guard exists because a collision actually happened, on 2026-07-19.** It is not hypothetical
and it should not be deleted later as speculative hardening. What happened:

`/fkit-record-decision` derived the next ADR number by listing `ai-agents/knowledge-base/decisions/`,
saw `adr-028` as the highest, and allocated **029**. But **029 was already thoroughly claimed** — a
task brief referenced `adr-029-stop-hook-…`, and roughly **ten `ai-agents/wiki-vault/` pages had
already ingested it**. The only place it was *not* claimed was the `decisions/` directory itself: the
file did not exist on disk yet. The stop-hook decision had to be renumbered to **ADR-030**, and the
cleanup became [task 80](../0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md).

**The rule to write down: the next ADR number is derived from every place a number can be claimed,
not from a `decisions/` directory listing.** A number claimed *anywhere* counts as taken.

This is the **same defect class** as Part A above — a sweep that looks in too few places — with the
same owner and the same shape of fix, which is why the owner folded it into this task rather than
giving it its own brief.

### Part C — the lint could not have caught the collision either (added 2026-07-19, from the wiki's flag)

**Parts A and B stop the collision being *created*. Neither would have *detected* it.** That gap is
what Part C closes, and it is a genuinely separate leg rather than a restatement of B.

**Why the existing lint is blind to this, and it is not an oversight in the lint's design.** A reused
ADR number stays **resolvable**. `[[adr-029-stop-hook-…]]` pointed at a real file that really existed;
nothing was broken, nothing 404'd, every link check passed. **Link rot is what a lint detects, and this
was not link rot** — it was two different decisions wearing the same number, each internally
consistent. **The 2026-07-19 collision was caught by hand, by a person noticing.** No automated check
in the project would have surfaced it, then or now.

**The wiki's proposed check:** `/fkit-wiki-lint` cross-checks each `decisions/adr-NNN-<slug>` vault
page against **the knowledge-base filename bearing that number**, and flags a divergence. Under the
collision, the vault's `adr-029-stop-hook-…` page and the knowledge-base's `adr-029-a-task-is-a-folder-…`
file share a number and disagree on the slug — **detectable, cheaply, on a routine lint run.**

**This is detection on the vault side, where Part B is prevention on the authoring side.** Both are
worth having: prevention stops new collisions, detection finds the ones already sitting in the vault
and any that a future authoring path introduces around the guard.

## What to build

- **The step-4 sweep root set extended to include `ai-agents/knowledge-base/`** in
  `claude/skills/fkit-task-done/SKILL.md`.
- **The same fix in `claude/skills/fkit-task-cancelled/SKILL.md`** — confirmed present there, and it
  needs fixing in **both** of that skill's greps (the step-4 sweep and the dependency search), not just
  the first one found.
- **The handling rules extended to match.** The skills currently describe what to do with a hit in a
  sprint plan, a closed plan under `sprints/done/`, or "a prose link anywhere". A knowledge-base hit is
  a prose link in a **historical record** — an ADR or a report. Decide and write down explicitly
  whether the href is re-pointed in place (consistent with how `sprints/done/` is handled, which is
  owner-ruled and deliberate) and say so, rather than leaving the agent to infer it.
- **The completion report's "References updated" section extended** to call out knowledge-base hits
  distinctly, the way it already calls out `sprints/done/` hits.
- **Consider the remaining uncovered roots** and state the decision rather than silently scoping to
  one directory: `ai-agents/reviews/`, `ai-agents/plans/`, `ai-agents/worklogs/` also back-link briefs
  today. Sweeping all of `ai-agents/` may be the simpler correct answer than enumerating roots — weigh
  it and record why.

### Part B

- **`claude/skills/fkit-record-decision/SKILL.md` derives the next ADR number from every place a
  number can be claimed** — at minimum `ai-agents/knowledge-base/decisions/`, task briefs under
  `ai-agents/tasks/`, the sprint plans under `ai-agents/sprints/`, and `ai-agents/wiki-vault/`.
  **Include the working tree** — the colliding ADR existed uncommitted, so a check against committed
  state alone would have missed it. Settle the exact derivation at build time; the requirement is that
  **a number claimed anywhere counts as taken**, and that the highest *claimed* number wins over the
  highest *file on disk*.
- **A duplicate-ADR-number assertion in the test suite** — same shape as the duplicate-task-ID
  assertion established by **ADR-029 Decision 3**. Mechanical detection, not a procedural rule nobody
  can enforce. `node --test`, **zero new devDeps**, matching the repo's existing suite.
- **The skill's own text says why**, citing the 2026-07-19 collision by name, so a future reader
  weighing whether the extra lookups are worth it can see the incident that motivated them.

### Part C

- **`claude/skills/fkit-wiki-lint/SKILL.md` gains an ADR number/slug cross-check**: for each
  `decisions/adr-NNN-<slug>` page in `ai-agents/wiki-vault/`, compare against the
  `ai-agents/knowledge-base/decisions/` filename bearing **NNN**, and flag when the slugs diverge or
  when no knowledge-base file carries that number at all.
- **Flag, do not auto-fix.** A number/slug divergence has two possible causes with opposite repairs —
  a genuine renumbering (the vault page is stale and should be updated) versus a vault page for a
  decision that was withdrawn. **Which one it is needs judgment**, and the lint's own convention is to
  fix what is safe and surface what is not. This is not safe.
- **The lint text names the 2026-07-19 collision**, same reasoning as Part B: a future reader deciding
  whether the check earns its runtime should see the incident.

> **Part C is the detection half; Part B is the prevention half. Do not let one be dropped as
> redundant** — B looks at authoring time and cannot see what is already in the vault; C looks at the
> vault and cannot stop a new number being allocated. Neither subsumes the other.

### Part D — the hard-coded role count in the installer (absorbed from task 82, 2026-07-19)

**Unrelated to Parts A–C in subject; here purely because of who may edit it.**

- **`claude/fkit-claude-init.sh:847`** currently reads
  `printf '  Seven roles, each a locked session (only its own skills exist in it):\n'`.
  [**ADR-028**](../../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)
  added an eighth role. **Correct the count.**
- **Why it is here and not in task 82:** this is **executable source**, not documentation —
  ADR-028:164 singles it out as *"code, not prose, and the one most likely to be missed."* Task 82 is
  **fkit-architect**-owned and the architect does not write source. This task is already fkit-coder's
  and already editing files under `claude/`, so it absorbs the line rather than justifying a brief for
  a one-line change.
- **⚠️ Get the tense right, same hazard as task 82.** ADR-028 is **decided, not built** — the eighth
  role does not exist yet. **A bare `Seven` → `Eight` substitution makes the installer tell every new
  user that a tester role is present when no agent file exists for it.** If the surrounding text
  cannot be made accurate without describing a role that is not there, **say so and raise it** rather
  than shipping a confident wrong number. The honest options — leave it, reword to avoid the count, or
  count only built roles — are a judgment call, not a find-and-replace.
- **Read the surrounding lines before editing.** This is one `printf` in a block that may enumerate the
  roles by name immediately after; a corrected count above an unchanged seven-item list is worse than
  either alone.

> ### ⛔ Part B reads the vault. It does not write it.
>
> Part B adds `ai-agents/wiki-vault/` as a place to **look up** whether an ADR number is taken. That
> is a read, and reads are decentralized (ADR-005) — any role may do it.
>
> **This does not weaken the hard exclusion in Part A, and must not be read as licensing a vault
> write.** The two are different skills doing different things:
>
> | | Reads `wiki-vault/` | Writes `wiki-vault/` |
> |---|---|---|
> | `fkit-record-decision` number lookup (Part B) | **Yes — this is the new behaviour** | **Never** |
> | the movers' reference sweep (Part A) | Not needed | **Never — hard exclusion, see below** |
>
> **Only `fkit-wiki` writes the vault.** If a vault page carries a stale ADR number or a rotted task
> link, that is the wiki role's repair to make — neither skill in this task may reach in and fix it.
> A skill that reads the vault to make a decision is correct; a skill that edits the vault to
> reconcile what it found is a breach of ADR-005.

## Verification steps

- Both skill files' sweeps reach `ai-agents/knowledge-base/`; verified by reading the grep line, not
  by trusting the diff summary.
- **`fkit-task-cancelled`'s *second* grep (the dependency search) is fixed too** — check it
  specifically; it is the one most likely to be missed.
- A dry run: pick a closed task whose brief is back-linked from an ADR or report, run the sweep command
  as written in the updated skill, and confirm the knowledge-base hit is returned.
- `.claude/skills/` copies refreshed via `claude/fkit-claude-init.sh .` so the dogfooded session picks
  up the change.
- No sweep root added that the mover has no write authority over — in particular **`ai-agents/wiki-vault/`
  must NOT be added** to the movers' sweep. Only `fkit-wiki` writes the vault (ADR-005), and a mover
  re-pointing a vault link would breach that boundary. If vault links rot on a task move, that is the
  wiki role's problem to fix, and the skill should say so rather than reaching in.

### Part B

- **Reproduce the original failure.** With the corpus in a state where a number is claimed *only*
  outside `decisions/` — e.g. in a brief and in vault pages, with no file on disk — the derivation
  skips it. **This is the exact 2026-07-19 case; if it does not reproduce before the fix, the fix is
  not being tested against the real defect.**
- Uncommitted-only claim is caught: a decision file staged or unsaved in the working tree still marks
  its number taken.
- The duplicate-number test **fails** when two ADRs share a number (verify it goes red deliberately,
  not just green on a clean tree) and passes on the current corpus.
- `node --test` passes with **no new devDependencies** in `package.json`.
- **`/fkit-record-decision` writes nothing to `ai-agents/wiki-vault/`** — confirm by reading the
  skill's write steps, not by observing a clean run. Reading the vault is expected and correct here.
- The skill text names the 2026-07-19 collision as the reason.

### Part C

- **Red-prove the cross-check against the actual collision.** Reconstruct the 2026-07-19 state — a
  vault page `decisions/adr-029-stop-hook-…` alongside a knowledge-base
  `adr-029-a-task-is-a-folder-…` — and confirm the lint **flags it**. A check that has never fired on
  the incident it was built for has not been tested.
- **Confirm the current vault is clean under the new check**, or that whatever it flags is a real
  divergence and not a false positive from a slug-normalization mismatch (hyphens, truncation, case).
  **Slug comparison is where this check will produce noise if it produces any** — settle the
  normalization at build time.
- **The lint flags and does not rewrite.** Verify by reading the added steps, not by observing a clean
  run: a run with nothing to flag proves nothing about what it would do when it finds something.

### Part D

- **`grep -n 'Seven\|seven' claude/fkit-claude-init.sh` returns nothing referring to the role count.**
- **The installer's output was actually run and read** — not inferred from the source line. The
  printed block must be internally consistent: no corrected count sitting above an unchanged
  seven-item role list.
- **The output does not assert the tester role exists.** ADR-028 is decided, not built. Read the
  shipped text and ask what a first-time user would conclude.

## Notes

- **Owner: fkit-coder — all four parts.** These are changes to shipped source under `claude/`.
- **✅ Part C ownership — SETTLED BY OWNER RULING, 2026-07-19. Task 81 does not split.** Part C was
  handed over as fkit-wiki-owned; that was checked and overturned. The reasoning, recorded because it
  generalizes beyond this task:
  - Part C edits **`claude/skills/fkit-wiki-lint/SKILL.md`** — the *source of the wiki's procedure*,
    not vault content.
  - **The wiki role's exclusivity is over `ai-agents/wiki-vault/`** — the hard rule in `CLAUDE.md:54`
    names that path and only that path. **It is not an exclusivity over the source of its own skill.**
  - **Part B is the standing precedent**: it edits `claude/skills/fkit-record-decision/SKILL.md` (:93)
    without that making it the architect's task.
  - **Consult fkit-wiki on Part C's detail** — it knows the vault's slug conventions and can say where
    the check will produce noise. **Consult, not ownership.**
- **Part D is a one-line absorption from [task 82](../0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role/brief.md)**,
  not scope creep — see below.
- **⚠️ Cross-task risk introduced by Part D: the role count is now corrected in two tasks by two
  roles.** If 81 lands and 82 does not, **the installer prints "eight roles" while every document says
  seven** — a worse inconsistency than today's uniform staleness. **Whoever closes the second of the
  two should re-run a repo-wide `seven` sweep before calling it done.**
- **Depends on: nothing.** Independently shippable.
- **ADR-027 dual-home parity does not apply here — checked, not assumed.** These skills have exactly
  one canonical home (`claude/skills/fkit-task-*/SKILL.md`); `claude/scaffold/` carries no copy, and
  `.claude/skills/` is a gitignored copy refreshed by init. Nothing to keep in parity beyond re-running
  init.
- **Sequencing against the folder migration.** [Task 76](../0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md)
  rewrites the movers' path handling wholesale, and absorbs `plans/`, `worklogs/` and `reviews/` into
  the task folder. This task touches the same lines. Landing it **before** 76 means 76 rebases onto it;
  landing it after means the rot continues through the whole migration window. **Recommendation: land
  this first** — it is a small, contained edit, and the migration has to re-derive those greps anyway.
  Flag the overlap to whoever picks up 76.
- **Review pass recommended** — this changes behaviour on every task close, and a wrong root set either
  misses rot or reaches into territory the mover may not write.
