# ADR-004: Fixed, role-based titles for ad hoc consult spawns (`<target-agent>-consult`)

- **Status:** **superseded** — Omnigent removed
  ([ADR-009](adr-009-claude-code-native-is-the-only-runtime.md)). This ADR governs the titling of
  `sys_session_create` consult spawns, an Omnigent mechanism that no longer exists; Claude Code
  consults run through the Agent tool.
- **Date:** 2026-07-10
- **Deciders:** owner + fkit-architect

## Context

Every fkit agent that spawns another agent to consult it does so via the shared `sys_session_create`
mechanism, and every one of them declares the **same generic titling instruction** in their
"Consulting other agents — how" section:

```
sys_session_create(config_path=".fkit/agents/<name>", title="<short topic>")
```

Confirmed present, verbatim in intent, at:
- `omnigent/fkit-producer/config.yaml:83`
- `omnigent/fkit-coder/config.yaml:83`
- `omnigent/fkit-reviewer/config.yaml:99`
- `omnigent/fkit-architect/config.yaml:100`
- `omnigent/fkit-adversarial-reviewer/config.yaml:86`

`title` is the addressing key: per the installed Omnigent 0.4.0 source
(`tools/builtins/spawn.py:220-229`), a `(parent_conversation_id, title)` pair is
create-or-continue — same pair reuses the conversation, a new pair creates a fresh one. Because the
instruction tells agents to derive a fresh topic-summarizing title per question (e.g.
`adversarial-reviewer auto-spawn mechanism`, `CLAUDE.md/AGENTS.md placeholder decision`,
`reconnect-tooling-conventions` — all real titles accumulated in a single owner session today), every
new question to the same target agent creates a brand-new child session rather than continuing one.

This is a real, owner-observed problem: the Omnigent Web UI's "Agents" panel accumulates every one of
these one-off children indefinitely, with no bound. Investigated directly against installed Omnigent
source in this session: neither `sys_session_close` (only rejects further input on the session;
`session_lifecycle.py:70-84`, consumed solely at `server/routes/sessions.py:18522-18530`) nor the
separate `archived` mechanism (`server/routes/sessions.py:14448-14452`, `15228`) declutters this
panel — the panel is powered by `GET /v1/sessions/{id}/child_sessions`
(`server/schemas.py:626-634`), which has no `archived` field and no `include_archived` filter at all
(`server/routes/sessions.py:16863-16867`). So today, nothing removes an unneeded consult child from
view once created — the only lever that actually controls panel growth is **how many distinct
titles get created in the first place**.

**Same category of problem, one level up, already fixed:** `omnigent/fkit-team/config.yaml`'s
"First-turn standby bootstrap" spawns fkit's six standing teammates with **fixed, idempotent,
role-based titles** — `producer`, `coder`, `reviewer`, `architect`, `wiki`, `adversarial-reviewer`
(`omnigent/fkit-team/config.yaml:82-84`), explicitly because "the stable title is what makes re-runs
idempotent — the same title continues the existing teammate instead of making a duplicate." The
sibling task `ai-agents/tasks/backlog/remove-adversarial-reviewer-eager-spawn.md` addresses a
different bug in that same roster (an agent that shouldn't be eagerly spawned at all) but does not
touch — and implicitly validates — the fixed-title convention itself. This decision extends that
same, already-accepted convention one level down, to the ad hoc consult children each teammate spawns
during its own work.

## Decision

Every fkit agent that spawns a consult child uses a **fixed, reusable, role-based title of the form
`<target-agent>-consult`**, reused across all topics/questions to that target within the spawning
session — never a fresh topic-derived title per question.

Concretely, per spawner (confirmed by reading each bundle's "Consulting other agents" /
"Consulting the `<X>`" sections):

| Spawner | Target(s) | Title(s) to use |
|---|---|---|
| `fkit-producer` | fkit-wiki, fkit-architect | `wiki-consult`, `architect-consult` |
| `fkit-coder` | fkit-wiki, fkit-architect | `wiki-consult`, `architect-consult` |
| `fkit-reviewer` | fkit-wiki, fkit-adversarial-reviewer (sidekick) | `wiki-consult`, `adversarial-reviewer-consult` |
| `fkit-architect` | fkit-wiki, fkit-producer | `wiki-consult`, `producer-consult` |
| `fkit-adversarial-reviewer` | fkit-wiki | `wiki-consult` |
| `fkit-wiki` | *(none — confirmed it never spawns)* | n/a |
| `fkit-team` | its 6 standing teammates | already fixed role names — unchanged, this is the pattern being extended |

**Naming scheme is `<target-agent>-consult` with no spawner prefix.** Verified this cannot collide:
`sys_session_create` always creates the child under the *calling* session
(tool description: "The new session is always a child of the calling session"), so the uniqueness
key `(parent_conversation_id, title)` is scoped per spawner's own conversation. `fkit-producer`'s
`architect-consult` and `fkit-coder`'s `architect-consult` have different `parent_conversation_id`s
(each spawner's own session) and are structurally distinct rows — not a real collision risk, so no
spawner-prefixing is needed.

**Files to change** (implementation task, not done by this ADR):
1. `omnigent/fkit-producer/config.yaml` — shared instruction (line 83) + its two named consult
   targets (wiki, architect sections).
2. `omnigent/fkit-coder/config.yaml` — same, line 83.
3. `omnigent/fkit-architect/config.yaml` — same, line 100.
4. `omnigent/fkit-adversarial-reviewer/config.yaml` — same, line 86 (wiki only).
5. `omnigent/fkit-reviewer/config.yaml` — shared instruction, line 99 (wiki), **plus**
   `omnigent/fkit-reviewer/skills/review/SKILL.md` and
   `omnigent/fkit-reviewer/skills/stateful-review/SKILL.md` — Step 1B ("Call your
   **adversarial-reviewer** tool...") currently names no explicit title, silently falling back to the
   generic `<short topic>` instruction; both must be updated to spell out
   `title="adversarial-reviewer-consult"` explicitly, since this is the one consult spawn that
   currently runs once per review rather than once per question and would otherwise keep creating a
   fresh child per diff reviewed.
6. Re-vendor after edits (`omnigent/vendor-agents.sh`), matching the existing canonical-source
   convention already documented in `remove-adversarial-reviewer-eager-spawn.md`.
7. **Out of scope, no change:** `omnigent/fkit-wiki/config.yaml` (never spawns) and
   `omnigent/fkit-team/config.yaml` (already fixed-title, this decision's precedent).

## Options considered

- **Fixed role-based title per (spawner, target-agent) pair, reused across topics (chosen)** —
  directly extends the convention already accepted for the standing 6-teammate roster; eliminates
  unbounded panel growth from ad hoc consults; produces predictable, discoverable names instead of
  one-off summaries; zero platform/server change, pure prompt-text edit.
- **Keep per-topic titling (status quo)** — rejected: this is precisely the mechanism producing the
  panel noise the owner flagged (8+ accumulated one-off children in a single session observed
  directly).
- **Periodic rotation** (e.g., start a fresh title every N topics or on an explicit "new topic" cue,
  so a thread doesn't grow forever) — a real middle ground, but **explicitly deferred, not decided
  here**: adds complexity (a rotation trigger, a naming scheme for successive threads) that isn't
  justified without evidence the single-thread tradeoff below is actually a problem in practice. Noted
  as the natural first fallback if the negative consequence below proves real.
- **Spawner-prefixed titles** (e.g. `producer__architect-consult`) to preempt a possible collision —
  rejected: investigation confirmed collisions are structurally impossible given per-parent scoping
  (see Decision), so the extra naming complexity buys nothing.

## Consequences

- **Positive:** Agents panel gains at most one row per (spawner, target-agent) pair rather than
  growing without bound; naming becomes predictable and role-based, matching the convention already
  used for the standing 6-teammate roster; requires no upstream/platform change.
- **Negative / costs:** Reusing one thread across unrelated topics means the consulted agent's context
  accumulates indefinitely with no pruning or summarization — over a long spawning session this can
  add cost/latency and risks the target agent anchoring on a stale prior topic when answering a new,
  unrelated one. **Accepted as a known tradeoff for now**, not solved by this ADR.
- **Negative / costs:** A spawner loses the ability to hold two simultaneous, independent, in-flight
  conversations with the *same* target agent — a second concurrent `sys_session_send` to the same
  fixed title continues/interleaves into the one existing thread rather than opening a second parallel
  one. Judged a narrow, acceptable edge case (parallel dispatch to *different* targets is unaffected).
- **Residual risk / re-raise only if:** a spawner's fixed-title consult thread to one target
  measurably balloons in context/cost, or the target visibly conflates unrelated prior topics in its
  answers, in real usage. If that happens, revisit with the periodic-rotation option noted above
  rather than reverting to per-topic titling (which reintroduces the panel-noise problem this ADR
  fixes).

## Related

- `ai-agents/tasks/backlog/remove-adversarial-reviewer-eager-spawn.md` — the same-category precedent
  one level up (standing-roster spawn), confirms the fixed-title convention is already accepted
  practice at that layer.
- `omnigent/fkit-team/config.yaml:82-90` — the existing fixed-title bootstrap this decision extends.
- Owner-observed evidence: this session's own Agents panel (8+ one-off topic-titled consult children
  from a single producer↔architect conversation) is the motivating case.
- Follow-up (not created by this ADR — producer's task-lifecycle responsibility): an implementation
  task applying the file list under Decision, owned by fkit-coder per the same
  canonical-source-then-revendor pattern used in `remove-adversarial-reviewer-eager-spawn.md`.
