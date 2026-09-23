# Let the read-only board reader serve another project's `ai-agents/` tree (`--root` flag)

## ID
0412

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Owner ruling, 2026-09-23** — given live in a `fkit lead` session via `AskUserQuestion`. ⛔ **Selected
option text, not the owner's own prose — never quote it as his words:** *"Read-only, now + --root
task"*. Meaning, as relayed by `fkit-lead`: use fkit's read-only board reader on another fkit-using
project now, and file a small coder task for a proper `--root` flag. This is that task.

### The gap

`bin/fkit-board.mjs` (built by [`0411`](../../done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/brief.md),
Track A of [ADR-051](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md))
finds its root with `findRoot()`, which walks **up from its own file**. So it can only ever serve
fkit's own tree. The owner wants to point it at other fkit-using projects — first, a sibling
fkit-using project on his machine.

### Already proven, by hand (relayed by `fkit-lead`, not re-measured by this producer)

On 2026-09-23 the lead imported `makeReader` / `startServer` directly with `root` set to that sibling
project, read-only: **289 tasks, 12 boards, ~250 ms snapshot, 0 writes.** It currently runs from a
one-off `node -e` launcher on a non-default port. The library already takes `root` as a parameter —
what is missing is the **command-line door** to it, plus validation and docs.

### ⚠️ The one real decision — which `dashboard.sh` reads a foreign tree

`findDashboard(root)` prefers the **target's** `claude/` copy, then its `.claude/` copy. On the sibling
project that copy was an **older v1 dashboard**; the reader requires the `⟦fkit-dashboard v2⟧` marker,
so every board came back **"no candidate record"**. Pointing the reader at **fkit's own canonical**
`claude/skills/fkit-status/dashboard.sh` against the foreign tree worked — **0 problems**.

Candidate answers (⛔ **left to the coder's plan — do not treat this list as a ruling**):
1. **Always use the reader's own fkit dashboard** (the one next to `bin/fkit-board.mjs`).
2. **Target's copy first, fall back to fkit's own on a version mismatch.**
3. **A `--dashboard <path>` flag**, alone or on top of 1 or 2.

⛔ **Constraint the plan must honour: ADR-051's "one grammar" rule** — sprint-status recognition has
**exactly one implementation, in `dashboard.sh`**
([`sprint-status-vocabulary.md`](../../../knowledge-base/conventions/sprint-status-vocabulary.md),
*"The carrier — the line-3 banner"*). Whatever is chosen, the reader must **not** grow its own banner
parsing to cope with an old-format target, and must still **refuse loudly** rather than serve
`unresolved` boards when no usable dashboard is found. ⚠️ `test/board-reader.test.js` greps the
**whole** of `fkit-board.mjs` — comments included — for banner markers; new code and comments must
not quote them.

⚠️ **Honest note on option 1:** a newer dashboard reading an older project's boards may disagree with
how that project's own (older) `/fkit-status` reads them. The plan should say which reading the owner
is being shown.

### Known fidelity gaps on the sibling project — ⛔ NOT in scope to fix in fkit (unless the plan argues otherwise)

- **Open-sprint status shows `unresolved`.** Its line-3 banners predate the sprint-status-vocabulary
  convention. That is the target's data, not a reader bug.
- **Two backlog boards collide.** `backlog.md` and `sprint-backlog.md` both resolve to id `BACKLOG`.
  ⭐ The reader should probably **at least surface the collision on `/api/check`** rather than let one
  board silently shadow the other — see NEEDS-DECISION in Notes.
- **Archived `plan-sprint-N.md` boards** map to `S-plan-sprint-N`, so tasks whose sprint is `S-00N`
  don't link to them.

### Non-goals — explicit

- ⛔ **No write path.** Still read-only, in every mode, behind every flag. Still bound to
  **127.0.0.1 only**.
- ⛔ **No copying tasks into aiboard.**
- ⛔ **This does NOT count toward ADR-051's trial.** The trial counts **fkit's own tree** and starts
  at **P1** (the Node port). The owner has not ruled otherwise; serving a second project is not
  evidence for or against the gate.
- ⛔ No fixes to the sibling project's files — fkit does not edit another project's tree.

## What to build

1. **`--root <path>`** on `bin/fkit-board.mjs`. With no flag, behaviour is **unchanged** (walk up from
   the file, as today). Consider a `FKIT_BOARD_ROOT` environment variable with the same precedence
   pattern `--aiboard` / `FKIT_AIBOARD` already use (flag beats env beats default) — plan decides.
2. **Validate the root up front.** It must be a directory holding both `ai-agents/tasks/` and
   `ai-agents/sprints/`. A bad path is a **non-zero exit with a message naming what was missing** —
   never a fall-through to fkit's own tree. (Same rule `resolveAiboard` already follows: *an explicit
   path that does not exist is an error, never a fall-through.*)
3. **Pick the dashboard for a foreign root** per the plan's answer to the decision above. The startup
   probe for the v2 marker must stay, and must name **which** `dashboard.sh` it tried.
4. **Say which tree is being served** in the startup banner (so the owner can't mistake one project's
   board for another's). ⚠️ Print a path the owner gave, not one assembled into an artifact — no
   machine paths in committed docs or tests.
5. **`--bench` honours `--root`** too, so snapshot cost can be measured on the other project.
6. **README** — add the `--root` usage beside the existing `npm run board` examples, plus a line on
   which dashboard is used for a foreign tree and the "does not count toward ADR-051's trial" caveat.
7. **Tests** in the existing `node --test` suite, on **fixture trees in a temp dir** — ⛔ never on the
   sibling project or any real machine path.

## Verification steps

1. `npm test` green, including new tests that prove:
   - no flag → root resolves exactly as before (fkit's own tree);
   - `--root <fixture>` → the snapshot's tasks/boards come from the fixture, not fkit;
   - `--root` at a path missing `ai-agents/tasks/` or `ai-agents/sprints/` (and at a file, and at a
     nonexistent path) → non-zero exit, message names the missing piece, **no server started**;
   - a fixture carrying an **old / markerless `dashboard.sh`** → behaves exactly as the plan chose
     (served correctly via fkit's dashboard, or refused loudly) — **never** silent `unresolved` boards;
   - if env var is built: flag beats env beats default.
   - the existing whole-file banner-marker grep in `test/board-reader.test.js` still passes.
2. **Read-only proof:** against a fixture root, a full snapshot plus a burst of `/api/*` requests
   leaves the fixture tree **byte-identical** (hash before/after); a non-GET is still refused.
3. **Manual, owner's machine:** `npm run board -- --root <sibling project> --port <free port>` serves
   its board at `127.0.0.1` with task/board counts matching the lead's 2026-09-23 figures (289 / 12),
   or the coder explains any difference. `--bench --root <same>` reports a snapshot time.
4. `npm run board` with no flags on fkit's own tree: output unchanged from before the change.
5. README diff shows the new usage and contains **no absolute machine path**.

## Notes

- **Depends on:** nothing (`0411` is done).
- **Blocks:** nothing.
- ⭐ **Small by design** — the library already takes `root`; this is the CLI door, validation, the
  dashboard choice, docs and tests. If the plan finds it is not small, stop and say why.
- ⚠️ **NEEDS-DECISION (owner) — backlog-id collision:** surface the `BACKLOG` id collision on
  `/api/check` as part of this task, or file it separately? Default if unruled: **surface it here**
  (read-only, one check line, and it is the gap that would otherwise hide a whole board) — but the
  plan must flag it as scope beyond the owner's selected option.
- ⚠️ **NEEDS-DECISION (plan gate) — dashboard for a foreign root:** options 1–3 in Context. Put the
  choice to the owner at the plan gate; it decides what "the board" means for an older project.
- The `node -e` launcher currently in use is a stopgap; once this lands it should be retired
  (nothing in the repo references it).
- Filed by a spawned `fkit-producer` on a relayed ruling (no owner channel, ADR-021); decides nothing
  beyond the scoping.
