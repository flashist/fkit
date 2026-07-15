# Make launch converge `ai-agents/` additively

## Sprint
Sprint 2

## Priority
28

## Status
🔲 Backlog

## Context

**This is "the migration" — and it is not a migration mechanism.** It is the fix that lets an existing
project gain scaffold paths it was created too early to have.

fkit **already** runs a convergence pass against every project on **every launch**
(`fkit-claude.sh:280-284` → `fkit-claude-init.sh`). Agents and skills are rm+re-copied every time
(`:49-60`); `.gitignore` entries are idempotently ensured (`:125-139`). **`ai-agents/` is the one thing
carved out of it**, by an all-or-nothing guard:

```
claude/fkit-claude-init.sh:27-32
  if [ -e "$dest/ai-agents" ]; then
    echo "• ai-agents/ already present — left as-is"      # ← the ENTIRE scaffold copy is skipped
  else
    cp -R "$scaffold/ai-agents" "$dest/ai-agents"
  fi
```

`[ -e ]` on the **parent** gates the copy of **everything beneath it**. An existing project can
therefore **never gain a new scaffold path** — which is why a project scaffolded last month has no
`reports/`, no `incidents/`, and (after task 25) still won't. The guard is doing two jobs at once:
*"don't clobber the user's content"* (right, essential) and *"don't add anything new"* (wrong, never
intended). **Separating those two jobs is the whole task.**

Full rationale and evidence:
[`reports/2026-07-14-migration-mechanism.md`](../../knowledge-base/reports/2026-07-14-migration-mechanism.md)
(rev 2, post-adversarial-review) §1, §8, §11.2. The owner has reviewed it and greenlit this.

**What was rejected, and must not creep back in.** No `migration-current.md`. No `migration-X.Y.Z.md`.
No semver walk. No per-project version cursor. No migration agent. The report kills each of these on
the merits (§6) — most fatally, **a cursor cannot survive a `git clone`**, because `.fkit/` is
gitignored (`fkit-claude-init.sh:137`). If your implementation grows a notion of "which version is this
project at," **you have built the rejected thing.** Convergence is **stateless by design**: it compares
the scaffold to the disk, and that is all it ever needs to know.

## The invariant — owner-ratified, non-negotiable

> **Convergence NEVER writes to a path that already exists.**
> **Create-if-absent only. No overwrite, no move, no delete — ever — inside `ai-agents/`.**

Every safety property this design gets for free is **downstream of this one line**. Break it and this
stops being a small script and becomes the most dangerous code in fkit: an unattended, every-launch,
no-consent mutation of a user's own documents. There is no rollback because **there is no torn state —
nothing is mutated, only added.** That holds *only* under the invariant.

**Its price, paid openly:** this cannot fix **content drift** — a scaffold-authored file whose *contents*
changed (e.g. `ai-agents/README.md`) is a path that **already exists**, so convergence steps over it,
forever. **The owner has deliberately accepted that residual** (report §3, §12 Q1). **Do not fix it. Do
not "improve" convergence into overwriting a file it thinks is stale.** The safety and the limitation
are the *same property*.

## What to build

Replace the all-or-nothing `ai-agents/` guard with a **per-path create-if-absent top-up**.

### 1. The convergence pass

- Walk the scaffold's `ai-agents/` tree. For each path (directory **and** file) that **does not exist**
  in `$dest/ai-agents/`, create it from the scaffold.
- For each path that **does** exist: **do nothing.** Not a diff, not a compare, not a backup. Nothing.
- On a project with **no** `ai-agents/` at all, behavior must be identical to today (full scaffold
  copy). Do not regress the fresh-project path — it is the one that already works.
- **Stateless.** No cursor, no manifest of what was done before, no version. The scaffold and the disk
  are the only inputs.

### 2. The `.gitkeep` rule — do not skip this, it is subtle

The scaffold ships **10 `.gitkeep` files today** (≈14 after task 25 — **count them, don't trust this
number**). A user whose `tasks/backlog/` has real briefs in it has very likely **deleted its
`.gitkeep`**. A naive create-if-absent pass **resurrects it on every launch** and **dirties
`git status`** — turning convergence into a thing that quietly edits the user's repo forever.

> **Rule: a `.gitkeep` is created only when its directory is created by this same pass. It is never
> added to a directory that already existed.**

### 3. Announce what you did — ⚠️ and mind where the output goes

If fkit creates a path in the user's project, **it must say so**, once, on the launch it happens. Silent
mutation of a user's tree on every launch is what makes every other failure mode nasty. Announce **only
when something was created** — the happy path (nothing to do) must stay **completely silent**, because
it runs on every launch of every project forever.

> **⚠️ The trap: `fkit-claude.sh:281` calls init with `>/dev/null` on an already-set-up project.**
> Convergence **only ever fires on an already-set-up project** — a fresh one gets the full copy instead.
> **So an announcement printed to stdout is discarded 100% of the time.** The feature would be
> "implemented" and invisible, and it would pass a naive review.
>
> Fix it deliberately, and say which you chose: **either print the announcement to stderr**, or **change
> the call site** so a converging run is not silenced. Do **not** simply remove the `>/dev/null` — that
> restores the wall of "• already present" noise on every launch that the quiet path exists to suppress.

### 4. The opt-out

A user who **deliberately deleted** `wiki-vault/` (they don't use the wiki) must not have it **silently
resurrected on every launch, forever, with no way to stop it.** Deletion has to be respectable.

**⚠️ The opt-out must survive a `git clone` — and this is the same trap that killed the version cursor
(report §6.1).** `.fkit/` is **gitignored** (`fkit-claude-init.sh:137`). An opt-out stored there is
invisible to a teammate who clones the repo, and **their** launch resurrects the folder the owner
deliberately removed. **Do not put the opt-out in `.fkit/`.**

**Owner decision (2026-07-15) — DECIDED: a tracked, project-local opt-out file** at
**`ai-agents/.fkit-keep-out`**, listing the scaffold-relative paths convergence must never create, one
per line, with a whole-tree form available. It is **committed**, so it survives a clone and is shared
with the team; it lives **inside `ai-agents/`**, which the user owns; and it is **stateless** — it
records *intent*, not *progress*, so it is not a cursor by the back door.

**This was the one genuinely open design decision in the task — it is now settled.** The owner ratified
the producer's recommendation (resolving Sprint 2 open question 4). The accepted tradeoff: it puts an
fkit-managed dotfile into the user's tracked history — a small, permanent surface the project had so far
avoided; the honest alternative (no opt-out) was rejected as unacceptable. **Do not re-open or re-site
it; build to `ai-agents/.fkit-keep-out`.**

### 5. The limits — disclose, do not fix

- **A renamed folder gets you both.** A user who renamed `sprints/` to `iterations/` gets `sprints/`
  recreated alongside it. Convergence cannot know a rename happened — **and neither can any stateless
  mechanism**. This is an **inherent limit, not a bug**. It must be **stated in the docs, not
  discovered by a user.**
- **Content drift is not fixed** (see the invariant above).

## Inherited requirements — these are the ship gate

These are **not** optional, and they are **not** yours to re-litigate. They are the report's §8 safety
bar, **ratified by the owner**:

| Requirement | Where it comes from |
|---|---|
| **Non-fatal failure** — convergence failing must **never** brick the launcher | **Task 26.** Land it first, or as this task's first commit. **Never after.** |
| **Refuse on weird state** — symlink `ai-agents/`, file-where-dir, unreadable | **Task 27.** Every convergence write inherits the symlink hazard; the gate must be in front of it. |
| **Idempotency** | Free by construction — "ensure this path exists" is idempotent. Inherited, not implemented. |
| **Announce** | §3 above. |
| **Opt-out** | §4 above. |
| **No rollback, no dry-run, no refuse-on-dirty-tree** | Correctly **not required** — but **only** under the invariant. If you break the invariant, all three become required and this is a different task. |

## Verification steps

**The one that matters most, first:**

- **A user's existing `ai-agents/` content is byte-for-byte untouched.** Take a project with a populated
  `ai-agents/` (real task briefs, a real sprint plan, an edited `README.md`, a populated `wiki-vault/`).
  Take a checksum manifest of every pre-existing file (`find ai-agents -type f | sort | xargs shasum`).
  Run `fkit`. **Re-run the manifest. Every pre-existing file must have an identical hash, and no
  pre-existing file may have been moved or deleted.** The only permitted delta is **newly created
  paths.** If a single byte of a pre-existing file changes, the invariant is broken and the task is not
  done.

Then:

- **It actually converges.** Take a project whose `ai-agents/knowledge-base/` has only `conventions/`
  (i.e. scaffolded before task 25). Run `fkit`. Confirm `decisions/`, `incidents/`, `reports/`,
  `history/` now **exist**. This is the entire point of the task.
- **The `.gitkeep` test — the one a naive implementation fails.** In that project, `tasks/backlog/` has
  real briefs and **no `.gitkeep`**. Run `fkit`. Confirm **`.gitkeep` was NOT recreated** there, and
  that **`git status` is clean** afterwards (modulo the genuinely-new folders). Then run `fkit` **twice
  more** and confirm `git status` stays clean — convergence must not dirty the tree on repeat launches.
- **The announcement is actually visible.** Run `fkit` on a project that needs converging and confirm
  the user **sees** what was created, in a real terminal — not just that the code calls `echo`. This is
  the `>/dev/null` trap in §3; a passing "the code prints it" is not a pass.
- **Silence on a converged project.** Run `fkit` again immediately. **No output.** Nothing to do, nothing
  said.
- **The opt-out works, and survives a clone.** Delete `wiki-vault/`, record the opt-out, launch → it is
  **not** recreated. Then **clone the repo to a second directory** and launch there → it is **still not**
  recreated. *(This is the check that fails if the opt-out lives in `.fkit/`.)*
- **Fresh project unchanged.** Scaffold an empty directory. The result must be identical to today's —
  same tree, same summary output. Diff it against a scaffold produced by the pre-change script.
- **Weird states still refused** (task 27's cases, re-run here): a symlinked `ai-agents/` must **not** be
  written through, now that there are per-path writes to write through it.
- **Non-fatal** (task 26, re-run here): make a convergence write fail (read-only `ai-agents/`), confirm
  `fkit` **warns and still starts**.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 26 (non-fatal init) and task 27 (refuse on weird state).** Both are hard
  dependencies. **This task is `🚧 Blocked` on neither only because both are unblocked and ship-today —
  but it must not land before them.**
- **Pairs with task 25.** 25 fixes what **new** projects get; 28 carries that fix into **existing**
  ones. Landing 25 first means 28's first real run has something worth converging.
- **This is not a small script. It is a small script with a real safety contract.** It runs on every
  launch, for every user, unattended, in the one code path that touches a user's own documents. The
  report's rev 1 rated four of the §8 rows "not required" and the adversarial pass proved it wrong on
  all four. **Treat the safety bar as the specification, not as advice.**
- **An ADR is expected** — but the **owner records it, or declines to.** Recommended subject: *"fkit
  converges a project's `ai-agents/` tree on launch — additively, non-fatally, and with an opt-out. It
  has no migration mechanism, and it does not converge file contents."* With the re-raise trigger from
  report §10: **the moment someone *proposes* a change that would move, rename, or delete content inside
  a consuming project's `ai-agents/`, this decision is void and returns to the owner.** That trigger
  fires on the **proposal**, not on the implementation — because by the time a destructive migration is
  *written*, the wrong hook has already been chosen. **Do not implement a destructive migration in
  `fkit-claude-init.sh` as a one-off. Ever.**
- Risk: **the highest of this group.** Everything else here is a defect fix. This one changes what fkit
  does to a user's project on every launch.
