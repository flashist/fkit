---
name: fkit-team
description: Show the fkit agent team — who's on it, what each role may and may not do, how to reach each one, and which role this session is locked to. Use when you're not sure who to talk to or how.
---

# The fkit team

Report the roster and how to reach it. Keep it short and scannable — this is a signpost, not an essay.

## Steps

1. **State which role this session is.** Every fkit session is **locked** to exactly one role
   (`fkit <role>` → `claude --agent fkit-<role>`); you can see yours in your own system prompt. Say it
   in one line — e.g. *"This session is the **coder**."*

2. **Print the roster:**

   | Role | Does | Must not |
   |---|---|---|
   | **lead** (the team room) | routes you to a role; reads the wiki | plan, code, design, review, or write the wiki |
   | **producer** | product & sprint planning, task briefs, task lifecycle | write code; move task files unprompted |
   | **coder** | implementation — sole source-write authority | commit unprompted; make product calls; settle new architecture; review its own work |
   | **architect** | architecture, design specs, ADRs, feasibility | implement features; write the wiki |
   | **reviewer** | code review — its own pass + a Codex second opinion | edit source code — ever |
   | **adversarial-reviewer** | hostile second opinion on Codex, findings only | edit anything |
   | **wiki** | the wiki — ingest / lint / sync; **exclusive write gateway** | write outside `ai-agents/wiki-vault/` |

3. **Explain how to reach a role:**
   - **`fkit <role>`** *(in a terminal)* — starts a session **locked** to that role. Plain `fkit` shows
     a menu. To work in two roles at once, open another terminal tab and run `fkit` there. The lock is
     real: a session can only see its own skills and tools.
   - **`@fkit-<role> <question>`** *(inside any session)* — asks a role a **one-off question** and
     brings the answer back here. Use for a quick consult. **This is also how roles consult each
     other** — architect ⇄ producer, coder → architect, reviewer → architect — up to **two hops**,
     never in a cycle.

4. **Skills belong to roles.** This is structural, not advice, **in a role session and in a spawned
   consult alike** (task 43 / ADR-018): a `PreToolUse` hook checks the REAL invoking agent's identity
   — a session's own role, or a spawned subagent's own role, at any consult depth — against
   `skills_for_role()` on every `Skill` call, and denies it if that role doesn't own it. So a
   `fkit coder` session *cannot* run the reviewer's procedure, and neither can a subagent it spawns
   pretending to; it asks `@fkit-reviewer`, because reviewing your own work isn't a review.

   One honest cost: a foreign skill is **visible** in the `/` menu (the old off-list also hid it;
   this mechanism doesn't) but remains **unrunnable** — invoking it is denied regardless. Visible-but-
   blocked, not invisible-and-blocked. The `⛔ Owner:` banner at the top of every skill is now a
   courtesy for a well-behaved agent to notice before trying, not the only thing stopping it.

   | Role | Its procedures |
   |---|---|
   | lead (team room) | `/fkit-team`, `/fkit-query` — it routes; it does no work |
   | producer | `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-plan`, `/fkit-task-done`, `/fkit-task-cancelled` |
   | coder | `/fkit-plan-task`, `/fkit-process-review`, `/fkit-process-stateful-review` |
   | architect | `/fkit-survey-project`, `/fkit-inspect`, `/fkit-design-spec`, `/fkit-evaluate-approach`, `/fkit-record-decision` |
   | reviewer | `/fkit-review`, `/fkit-stateful-review` |
   | adversarial-reviewer | `/fkit-adversarial-review` |
   | wiki | `/fkit-wiki-ingest`, `/fkit-wiki-lint`, `/fkit-wiki-sync` |

   Every role also has `/fkit-query` (wiki reads) and `/fkit-team`.

5. **Note how the team coordinates:** through **files**, not chat — task briefs
   (`ai-agents/tasks/`), the sprint plan (`ai-agents/sprints/`), the review ledger
   (`ai-agents/reviews/<task-id>.md`), the knowledge base, and the wiki. Separate sessions see the
   same artifacts; that's the shared state.

6. If the owner asked "who should I talk to about X?", **answer that** concretely instead of dumping
   the whole roster.
