# Sprint status vocabulary

> **The canonical set of sprint statuses for this project.** These are the *only* values that may
> appear in a sprint board's **line-3 banner** — the one carrier of a sprint's own status.
>
> This is a **starting convention**, shipped with the project scaffold. It is yours — amend it to fit
> how your team actually works. What matters is that a sprint's status is **written down**, in one
> place, rather than inferred. The bug this convention exists to stop is a finished sprint that stays
> "the active one" because it happens to have the highest number in its filename.

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
- **A close performed without the owner present writes the agent-closed variant** —
  `Closed by /fkit-sprint-done (agent-closed — not owner-verified).` — the same rule that applies to
  the task movers.

**No other value is valid.** If a status you need isn't here, the fix is to amend this doc — not to
invent a value inline.

## The carrier — the line-3 banner

```
> ## <MARKER> <STATUS> — <YYYY-MM-DD>.[ <trailing prose>]
```

- ⛔ **Strictly line 3.** Line 1 is the H1, line 2 is blank, line 3 is the banner. Strict position is
  chosen over *"the first line of the leading blockquote"* so a `> ## ` appearing deeper in a board can
  never be mistaken for a status.
- **The date is part of the grammar, not decoration.** A banner without a well-formed `YYYY-MM-DD` is
  not a banner. The two open statuses are typed **by hand**, which is the exact path that drops a date.
- ⛔ **Malformed is not the same as missing.** A line 3 that begins `> ## ` and carries one of the
  markers but does not match the grammar is **malformed**; a line 3 with no banner at all is
  **missing**. Both resolve the status to `unresolved` and both make the board **never eligible** — but
  they are **distinct drift facts**, so *"someone typed it wrong"* never reads as *"nobody typed it"*.
- ⛔ **Never silently `In progress`.** A board with no readable status is `unresolved`, and
  `unresolved` is never reported as active.
- **Exactly one banner per board is an AUTHORING RULE, not a check.** Only line 3 is ever read. A
  `> ## 🔄 In progress — …` line deeper in a board is not a status, does not make the board ambiguous,
  and emits no drift. The rule tells an author not to write a confusing document.
- **The recognizer has exactly one implementation**, in `dashboard.sh`. Do not re-state the grammar
  anywhere else — a second copy is how the two drift apart.

### Tell a task status from a sprint status by POSITION, never by the glyph

The two vocabularies share their glyphs on purpose, which is exactly why the boundary has to be stated:

- A **task** status is the `## Status` field of a `brief.md`, or the **leading cell** of a board row.
- A **sprint** status is a **blockquoted H2 on line 3 of a board**, and nowhere else.
- A **sprint identity** is what the selector resolves for a plan file, and nowhere else.

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
producer may invoke those skills.** That one is enforced rather than asked: a `PreToolUse` hook denies
a mover call from any non-producer identity, at any spawn depth. Every other role routes its closes
through the producer and closes nothing itself. **Four movers, one rule.**

⚠️ **A close performed without the owner present must write the `(agent-closed — not owner-verified)`
variant — including a producer that was SPAWNED to close.** A spawned agent has no channel to you, so
its close is agent-closed however trustworthy the role. Only an owner-present producer session yields a
plain owner-verified close.

⚠️ **Role-gating is not prevention.** Understand the trade you are inheriting: restricting the movers
to one role separates the closing *identity*, but an agent that has decided a sprint is finished can
still spawn a producer to close it — the same act with an extra hop. The marker is **prose, not
enforcement**; nothing compels it. It exists so the board can at least be *read* honestly by someone
who looks.

**If your team wants a stronger guarantee than this**, the fix is a further precondition in
fkit's own `claude/skill-ownership-hook.sh` (in the fkit install, not your project's `.claude/`) —
closes only from an owner-present session, say — not stricter prose.
Prose does not stop an agent that has already decided the work is done.

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

⛔ **Never pick a board by eye, never by the highest number, never by the filename.** "The
highest-numbered plan" is a guess dressed as a rule: it silently keeps a finished sprint active, and it
breaks the moment a plan is renamed or a `9b` follows a `9`.

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

**Why a script and not prose.** The selection step obtains each candidate's identity and status **from
the script**, not by re-deriving the grammar in a skill's prose. The exact CLI surface is yours to
change; re-implementing the grammar somewhere else is not — two grammars for one question is how a
component starts disagreeing with itself.

## Related

- [`task-status-vocabulary.md`](task-status-vocabulary.md) — the sibling page: **task** status, its
  shared glyphs, and the by-position boundary between the two.
