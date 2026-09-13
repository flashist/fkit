# Sprint status vocabulary

> **The canonical set of sprint statuses for this project.** These are the *only* values that may
> appear in a sprint board's **line-3 banner** — the one carrier of a sprint's own status.
>
> Before this doc a sprint had **no** vocabulary and no explicit status at all: selection read
> **location** only, so every board at the top of `ai-agents/sprints/` was treated as live — which is
> why *"a finished Sprint 5 kept being reported as active until a hand-scoped task moved it."*
> [ADR-047](../decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md)
> fixes that; this doc is the rule it created.

## The statuses

| Status | Line-3 banner | Lives in | Set by |
|---|---|---|---|
| **`🔲 Backlog`** | `> ## 🔲 Backlog — <date>.` | `ai-agents/sprints/` | producer, **by hand** |
| **`🔄 In progress`** | `> ## 🔄 In progress — <date>.` | `ai-agents/sprints/` | producer, **by hand** |
| **`✅ Done`** | `> ## ✅ Done — <date>. Closed by /fkit-sprint-done.` | `ai-agents/sprints/done/` | **mover only** |
| **`⛔ Cancelled`** | `> ## ⛔ Cancelled — <date>. Closed by /fkit-sprint-cancelled — <reason>.` | `ai-agents/sprints/cancelled/` | **mover only** |

- **The markers are deliberately the task markers**, so one eye reads both boards. See *Tell them apart
  by position* below — the sharing is the design, not an accident to be fixed.
- **`🚧 Blocked` does NOT exist for a sprint.** A sprint is not blocked — its **tasks** are. A board
  whose every row is blocked is still `In progress`, and the status briefing's *"what's in the way"*
  beat is where that gets reported.
- **`➡️ Moved` does not apply to a sprint.** It is a **row disposition**, not a board state.
- **A reason is mandatory on `⛔ Cancelled`**, mirroring the task vocabulary.
- **A close performed without the owner present writes the agent-closed variant**
  (`Closed by /fkit-sprint-done (agent-closed — not owner-verified).`) — the same rule
  [ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md) §5 sets for tasks.

**No other value is valid.** If a status you need isn't here, the fix is to amend this doc and
ADR-047 — not to invent a value inline.

## The carrier — the line-3 banner

```
> ## <MARKER> <STATUS> — <YYYY-MM-DD>.[ <trailing prose>]
```

- ⛔ **Strictly line 3.** Line 1 is the H1, line 2 is blank, line 3 is the banner. Strict position is
  chosen over *"the first line of the leading blockquote"* so a `> ## ` appearing deeper in a board can
  never be mistaken for a status.
- **The date is part of the grammar, not decoration.** A banner without a well-formed `YYYY-MM-DD` is
  not a banner.
- ⛔ **Malformed is not the same as missing.** A line 3 that begins `> ## ` and carries one of the
  markers but does not match the grammar is **malformed**; a line 3 with no banner at all is
  **missing**. Both resolve the status to `unresolved` and both make the board **never eligible** — but
  they are **distinct drift facts**, so *"the producer typed it wrong"* never reads as *"nobody typed
  it"*.
- ⛔ **Never silently `In progress`.** A board with no readable status is `unresolved`, and
  `unresolved` is never reported as active.
- **Exactly one banner per board is an AUTHORING RULE, not a check.** Only line 3 is ever read. A
  `> ## 🔄 In progress — …` line deeper in a board is not a status, does not make the board ambiguous,
  and emits no drift. The rule tells an author not to write a confusing document.
- **The legacy `🔒 CLOSED` banner reads as `✅ Done`**, with `Superseded by [Sprint N](…)` tolerated as
  trailing prose. ⭐ **Read forever, written never** — owner-ruled as a permanent compatibility rung,
  not a migration window. This repo's seven archived boards carry it and are **not** rewritten.
- **The recognizer has exactly one implementation**, in `dashboard.sh`. Do not re-state the regex
  anywhere else.

### Tell a task status from a sprint status by POSITION, never by the glyph

The two vocabularies share their glyphs on purpose (ADR-047 §1.1), which is exactly why the boundary
has to be stated:

- A **task** status is the `## Status` field of a `brief.md`, or the **leading cell** of a board row.
- A **sprint** status is a **blockquoted H2 on line 3 of a board**, and nowhere else.
- A **sprint identity** is what `resolve_identity` returns for a file, and nowhere else.

`🔲 Backlog` on line 3 of `sprint-9.md` says the *sprint* is scoped but not started; the same glyph in
a row's leading cell says that *task* is. ⛔ **Do not "fix" the shared glyphs by inventing a second
set** — the by-position rule is the fix, and the collision is accepted with its cost named.

⚠️ **`Backlog` also names an identity**, not just a status: `ai-agents/sprints/backlog.md` is the
standing unscheduled board, **never a sprint and never eligible**. Same word, two readings, told apart
by position — `identity="Backlog"` in the selector's output versus a status in a board's line-3 banner.
`unresolved` behaves the same way: it is a value of both the `identity=` field and the `status=` field,
and **neither is ever inferred from the other**.

## The authority split — this is the point

**`🔲 Backlog → 🔄 In progress` is free** for the producer to set by hand. It is a planning act, like
`➡️ Moved` on a row.

**`✅ Done` and `⛔ Cancelled` are skill-gated and role-gated — not owner-gated.** They may only be set
by `/fkit-sprint-done` and `/fkit-sprint-cancelled` — never by hand-editing a board — and **only the
producer may invoke those skills**, on
[ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)'s reasoning applied
unchanged. That one is **enforced**, not asked: the
[ADR-018](../decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
`PreToolUse` hook denies a mover call from any non-producer identity at any spawn depth. Every other
role routes its closes through a spawned producer. **Four movers, one rule.**

⚠️ **A close performed without the owner present must write the `(agent-closed — not owner-verified)`
variant — and that includes a producer that was SPAWNED to close.** A spawned producer has no owner
channel, so its close is agent-closed. Only an owner-present producer session yields a plain
owner-verified close.

⚠️ **Role-gating is separation, not prevention.** Producer-only restores separation of the closing
*identity*; a determined doer can still spawn a producer to close — the same act with an extra hop. The
marker is **prose, not enforcement**. It exists so the board can at least be *read* honestly by someone
who looks.

## Location — the second carrier

Location is a **second** carrier of the terminal states, exactly as `tasks/done/` is for tasks:

- `✅ Done` → `ai-agents/sprints/done/`.
- `⛔ Cancelled` → `ai-agents/sprints/cancelled/`, **created on first use** — git cannot carry an empty
  directory, so it is not shipped ahead of time.
- Open boards — `🔲 Backlog` and `🔄 In progress` — sit at the top of `ai-agents/sprints/`, alongside
  `backlog.md`.

Selection scans **depth 1 only**, so both archive folders are excluded by construction.

## What "current sprint" means

> **"current sprint(s)" = "active sprint(s)" = every sprint whose line-3 banner reads `🔄 In progress`.**

⭐ **Plural is the default.** More than one sprint may be `In progress` at once, and that is **legal,
not drift**. Asked for status with no sprint named, report **all** of them.

**Where exactly one board must be chosen** — the sprint ship-loop drives one board — it is the
**lowest-ordered** `In progress` sprint, overridden by the literal token **`⭐ ACTIVE BOARD`** in an
`In progress` banner's trailing prose.

⛔ **Never pick a board by eye, never by the highest number, never by the filename.** Selecting by
filename glob is exactly the defect
[ADR-041](../decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
ended, and "highest N" is the heuristic ADR-047 retired.

## The one resolution path

```
bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
```

- Read **every `active` line** for the plural answer — one per `In progress` sprint.
- Read the **single `board` line** for the single-board answer. It carries `file`, `identity`, `status`
  and `reason`, and `reason` is one of `lowest-ordered` or `active-marker`.
- `active none` (exit **3**) means no sprint is eligible. ⭐ **That is an answer, not a failure.**
- Parse **by key, never by position.** Field order is fixed so the output is diffable; it is not a
  licence to read field 3 positionally.

**Why a script and not prose.** ADR-041 §5 is binding on this point:

> *"the selection step must obtain each candidate's identity **from `dashboard.sh`** … not by
> re-deriving the grammar in SKILL.md prose. **The exact CLI surface is the implementer's call;
> re-implementing the grammar is not.**"*

That constraint is about the **identity** grammar; ADR-047 puts the **status** grammar in the same
place, for the same reason. One grammar, one implementation — a second copy in prose is how the two
drift apart.

## Related

- [`task-status-vocabulary.md`](task-status-vocabulary.md) — the sibling page: **task** status, its
  shared glyphs, and the by-position boundary between the two.
- [ADR-047](../decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md)
  — why a sprint has an explicit status, and why "current" is plural.
- [ADR-041](../decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
  — selection by resolved identity, and the one-grammar constraint quoted above.
