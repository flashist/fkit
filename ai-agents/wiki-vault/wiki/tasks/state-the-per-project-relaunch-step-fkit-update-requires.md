# State the per-project re-launch step `fkit update` requires

**Source**: `ai-agents/tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md`
**Status**: done — ✅ **Done (agent-closed — not owner-verified)**, closed 2026-08-13
**Sprint/Tag**: Sprint 5 · `P14` · ID `0253` · Owner `fkit-coder`

## Goal

Close a documentation gap with a real user cost: **`fkit update` updates the install share. It does
not update any project.** A project's `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/` are
refreshed **only on launch** — so a reader who updates and never re-launches keeps **old agents and
skills with no diagnostic of any kind**, and the README never said so.

⚠️ **A docs fix, not a detector.** The structural gap behind the missing signal was
[[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] (`0255`) — a separate
decision task. This brief was written to be correct **whatever `0255` decided**, and it was: `0255`
then made this paragraph its own premise.

## Key Changes

**One file — `README.md`.** ⛔ Nothing under `claude/`, `bin/`, `install.sh`, `RELEASING.md`, or
`ai-agents/wiki-vault/`.

1. **A new paragraph** after the existing "Staying current" text: `fkit update` refreshes the
   installed copy and stops there; each project picks up the new agents and skills **the next time
   `fkit` is launched in it**, because that launch is what rewrites `.claude/`. The consequence is
   stated plainly rather than softened — a project updated but never re-launched keeps its **"old
   agents and skills, and nothing tells you"**.
2. **The `FKIT_SETUP_ONLY=1 fkit` escape hatch** — the refresh without opening a session.
3. **A two-line correction** to a neighbouring sentence that was **false**: it said `fkit update`
   replaces `.claude/`, when the launch is what does it.

**Four owner rulings honored**, each recorded against how it landed: placement as a *following*
paragraph with the prior lines left byte-identical; the two-line minimal fix; the escape hatch in one
sentence; and ⛔ **no `RELEASING.md` pointer** (`grep -c RELEASING README.md` → **0**).

## Outcome

### It became ADR-043's premise, not just a docs fix

By the time `0255` was decided, this paragraph had **shipped** — so Option 4's *"the gap that was real
is closed"* rests on **shipped fact, not a pending dependency**. The brief for `0255` had described it
as *"already being closed"*; the ADR corrected that to past tense.

### ⚠️ Its R2 residual deliberately left a second defect standing

The review proposed also reconciling `README.md:54` — the line promising a divergence signal for
*"your project's fkit-managed structure"*. **That was declined on purpose**, owner-ruled 2026-08-13
verbatim *"Accept both as residuals"*, because the obvious fix would have **pre-empted `0255`'s
decision**. ⚠️ **And the obvious fix was independently wrong**: scoping `:54` to `ai-agents/` would
*under-describe* the check, since the spec's Table B includes the root `CLAUDE.md` and `AGENTS.md`.
The reconciliation is settled in ADR-043 §C6 and filed as its own brief (`0292`).

*A residual held for a decision that had not been made yet turned out to be right twice over — once
for the reason it was held, and once for a reason nobody had noticed.*

### The stale closing line, left byte-identical

⚠️ The brief still ends *"Filed to the **Backlog** board — no sprint named"* — **true when filed
2026-08-08**, falsified when the owner carried it onto Sprint 5 on 2026-08-10. A dated carry
correction sits beneath it; the header fields are the authority. ⚠️ **No drift check fires on this and
none will** — `dashboard.sh` reads the `## Priority` **field**, not brief prose. The class is tracked
by `0235`, neither widened nor closed by that note.

## Related
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — the decision this task's paragraph became the premise of
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — `0255`, the detector question this docs fix is the manual substitute for
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `0252`, the maintainer-side half of the same release-hygiene cluster
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — `0254`, shipped the same day off the same board
- [[systems/install-and-self-update]] — the self-update and launcher behaviour this documents
- [[systems/launch-convergence-and-init]] — what a launch actually rewrites
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board it closed on
