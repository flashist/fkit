# ADR-010: Role-locked sessions with a skill lockdown, replacing lead-session "hat" skills

- **Status:** accepted
- **Date:** 2026-07-11
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Supersedes:** [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) §"Role access —
  three explicit paths" (`adr-008:106-120`)
- **Corrections:** 2026-08-02 — this ADR carries dated notes inline at **§Context** and **§Decision 3**.
  Marker legend: **⚠️ = a fact that drifted** (the decision is untouched); **⛔ = a decision that was
  overturned** (do not follow it). No existing line of this ADR was edited; the notes are appends, and
  the Status stays `accepted`.
  **Extended 2026-08-02 by a second append:** dated ⚠️ notes now also sit at **§Decision 5** and at
  §Context's *"One real inconsistency"* passage. The site list in the first line of this item is left
  byte-identical and is superseded by this line; the same append-only rule and the same legend apply.
  **Extended 2026-09-03 by a third append (`0197`, inside sweep `0356`):** dated ⚠️ notes now also sit
  at the **end of §Context**, at **§Consequences** (the one-role-per-session bullet) and at the **end of
  §Related**. They record where code this ADR cites by line has since moved. The two site lists above are
  left byte-identical and are superseded by this line; the same append-only rule and legend apply.

## Context

[ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) designed the Claude flavor around a
**single interactive lead session** that was the team lead *and* the coder by default, and that could
"wear a hat" — `/fkit-agent-<role>` skills (six of them) that made the current session adopt a role
by reading `.claude/agents/fkit-<role>.md` (`adr-008:106-108`).

That model has been **replaced in code** and the owner has confirmed the replacement is settled. The
hat skills are deleted; `claude/skills/fkit-agent-*` no longer exists. What replaced it:

- **`fkit` is a deterministic role menu.** No LLM decides who you're talking to — picking a role is
  an if/else (`claude/fkit-claude.sh:151-187`). `fkit <role>` skips the menu.
- **Every session is locked to exactly one role, two ways** (`claude/fkit-claude.sh:14-18,192-199`):
  1. `claude --agent fkit-<role>` — the role's system prompt and **tool allowlist** (harness-enforced).
  2. `--settings` carrying **`skillOverrides`** — every `fkit-*` skill the role does *not* own is set
     to `"off"`: hidden from the `/` menu **and unrunnable by name**
     (`claude/fkit-claude.sh:75-103`, `skills_for_role()` + `build_settings()`).
- **A 7th agent, `fkit-lead`** — the "team room" (menu option 7) — routes rather than does. It has no
  Write or Edit tools, deliberately (`claude/agents/fkit-lead.md:22-26`).

  > ⚠️ **Dated correction 2026-08-02 — three factual claims in the sentence above are now false: the
  > "team room" label, "menu option 7", and "no Write or Edit tools".** The sentence is **left
  > byte-identical** as the record of what was decided on 2026-07-11.
  >
  > **What is true today**, verified against live code 2026-08-02:
  > - **The "team room" label is retired project-wide.** `claude/fkit-claude.sh` accepts neither `team`
  >   nor `team room` on any path — its own comment reads *"`team` / `team room` are NOT accepted — not
  >   here, and not at the menu either … `lead` is the only word this program accepts on any path"*. The
  >   label survives in the launcher **only inside that rejection comment**.
  > - **The lead is menu option 1, not 7.** The menu prints *"1) lead"* and its case arm is `1|lead)`.
  >   **Option 7 is `wiki`.**
  > - **Lead does hold Write and Edit.** [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md)
  >   relaxed the allowlists for every Claude-side role, and `claude/agents/fkit-lead.md` carries **no
  >   `tools:` key at all**. That file's own stance note says the line *"was also already stale: ADR-022
  >   gave every Claude-side role Write/Edit."*
  > - The bullet's pointer `claude/agents/fkit-lead.md:22-26` **no longer lands on any tools claim** — it
  >   is the conductor intro today, and the ADR-031 stance note that corrects the tools line begins
  >   immediately below that range. It is left as written, as the record of what was cited in 2026-07.
  >
  > **Cause:** tasks [`0139`](../../tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/brief.md)
  > (menu order) and [`0140`](../../tasks/done/0140-retire-team-room-in-docs-and-agent-definitions/brief.md)
  > (label), both owner-ruled 2026-07-25. The tools claim went stale earlier and independently, via
  > ADR-022 (2026-07-18). **These are drifted facts, not overturned decisions: this ADR's decision is
  > unaffected and its Status stays `accepted`.**

  > ⛔ **Dated reversal notice 2026-08-02 — the fourth claim in that same sentence, *"routes rather than
  > does"*, is REVERSED. Do not follow it.** Reversed on 2026-07-22 by
  > [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) §Decision 1: `fkit-lead` is now
  > an **orchestrating conductor** that, given a goal, spawns typed `fkit-<role>` workers, gives each a
  > bounded unit of work, relays surfaced decisions to the owner, and advances. It keeps the routing
  > remit and still **never writes source and never reviews**. ADR-031 calls this out as *"a real
  > decision, not a drift"* — which is why it is marked ⛔ here and the three claims above are marked ⚠️.
  > The sentence above is **left byte-identical** as the 2026-07-11 record.
  >
  > This is the §Context half of the claim; the **binding** statement is **§Decision 3**, which carries
  > its own notice. **No other ADR-010 decision is reversed by ADR-031** — Decisions 1, 2, 4 and 5 stand
  > as decisions. *(Separately, and deliberately **not** corrected in this pass: Decision 2's
  > `skillOverrides` off-list mechanism was retired by
  > [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — a
  > drift, not a reversal, and filed as a follow-up so this pass does not mix two unrelated causes.)*

The driver for the change was that the hat model was **prompt-enforced**: a session "wearing" the
reviewer hat was the same context that had just written the code, and nothing but instructions stopped
it from running the coder's procedures. ADR-008 itself conceded this, noting reviewer independence "is
a property of a **fresh context**, not of the prompt" (`adr-008:114`) and then relying on an
in-skill independence *check* to compensate.

Role-locking makes that structural instead: a `fkit reviewer` session **is** a fresh context, and the
coder's session cannot execute `/fkit-review` because the skill does not exist in it. This is a
strictly stronger form of exactly what ADR-008 argued for ("tool allowlists are a structural upgrade
over Omnigent's prompt-only boundaries") — the mechanism simply wasn't available/known when ADR-008
was written, so ADR-008 settled for hats. This ADR records the upgrade, which until now was settled
only implicitly in code.

**One real inconsistency surfaced by the drift audit** and settled here: there are two lists
describing which skills a role may use, and they govern *different* invocation paths.

- `skills_for_role()` in `claude/fkit-claude.sh:75-86` — governs a `fkit <role>` **session**, via
  `--settings` skillOverrides.
- The `skills:` frontmatter in `claude/agents/fkit-*.md` — governs a **spawned subagent** (Agent
  tool, e.g. reviewer → architect consult), which never runs `fkit-claude.sh` and so gets no
  `--settings`.

They currently disagree: the shell grants every role `fkit-team`, the frontmatter omits it for six of
seven agents. Verified empirically from a live `fkit architect` session — `/fkit-team` is available
despite not appearing in `fkit-architect.md`'s `skills:`. Nothing is broken today (`fkit-team` is a
signpost skill nobody misses in a consult), but two hand-synced lists for one invariant is precisely
the drift class this project keeps paying for.

> ⚠️ **Dated correction 2026-08-02 — the "One real inconsistency" passage above is spent.** The
> inconsistency it names was resolved, in one of the two ways this ADR itself prescribed. The passage
> is **left byte-identical** as the record of what the 2026-07-11 drift audit found.
>
> **What is true today**, verified against live code 2026-08-02: **there are no longer two lists.** The
> `skills:` frontmatter was **dropped**, so nothing remains that could disagree with `skills_for_role()`
> — which has also moved file since this passage was written. The passage's *"settled here"* promise was
> **kept**.
>
> **The binding statement is §Decision 5, which carries its own ⚠️ notice** — the current file name, the
> two consumers, and the ADR-012 citation live there and are deliberately **not** restated here, so
> there is one place to keep true rather than two.
>
> **Still true in substance:** **every** role owns `fkit-team` — all seven arms of `skills_for_role()`
> begin with it. **The mechanism is no longer the shell, though:** since
> [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) the
> launcher grants nothing — `build_settings()` emits only hooks, and ownership is enforced by a
> `PreToolUse` **deny** hook that reads `skills_for_role()` at call time.

> ⚠️ **Dated correction 2026-09-03 (`0197`, inside sweep `0356`) — four code pointers in §Context no
> longer land where they are aimed.** Every pointer above is **left byte-identical**: it is the record of
> what was cited in 2026-07. ⛔ **Nothing here reopens a decision** — only the coordinates aged.
>
> **Where each claim lives today**, verified against live code 2026-09-03, anchored by name and quoted
> text rather than by a fresh line number (the form `durable-citation-anchors` prescribes, because
> `claude/fkit-claude.sh` grows above these sites constantly — which is exactly how they drifted):
>
> - **The role menu is still an `if/else`.** The pointer on the menu bullet now lands in the
>   update-check's sha-reporting comment. The claim lives in `claude/fkit-claude.sh`, whose own header
>   states it: *"picking a role is an if/else, not a judgment call"*, with the menu's numbered case arms
>   below it.
> - **The two-way session lock is intact, and its pointer is HALF right.** The first sub-range still
>   lands — it is the header comment reading *"Every session is locked two ways"*. ⚠️ **Only the second
>   sub-range drifted**; it now lands on the env-var help text. ⛔ Recorded as half-correct deliberately:
>   calling the whole pointer stale would itself be a false claim.
> - **`skills_for_role()` has MOVED FILE; `build_settings()` has not.** The sub-bullet's pointer now
>   lands in the self-update helpers. `skills_for_role()` lives in `claude/skills-for-role.sh`;
>   `build_settings()` is still in `claude/fkit-claude.sh`, further down than when cited.
>   **§Decision 5's own ⚠️ notice is the binding statement for the file fact** — it is deliberately not
>   restated here, so there is one place to keep true rather than two.
> - **The "One real inconsistency" passage's pointer — the RANGE half only.** It no longer lands on the
>   `skills_for_role()` definition. ⛔ **The file half is NOT re-annotated here**: `0195`'s dated block
>   above already corrects it and points at §Decision 5, and repeating it would put one fact in two
>   places — the thing that block exists to prevent.

## Decision

1. **Every fkit session is locked to exactly one role.** `fkit` shows a deterministic menu; `fkit
   <role>` goes straight there. There is no session that is "the lead and also the coder", and no
   mechanism for a session to change roles mid-flight. To work in two roles at once, the owner opens
   another terminal tab.
2. **Role separation is enforced structurally, not by instruction**, via both the `--agent` tool
   allowlist and the `skillOverrides` skill lockdown. "The coder cannot run the reviewer's procedure"
   is a **fact of the runtime**, not a request in a prompt.
3. **`fkit-lead` (the team room) is a router, not a doer.** It has no Write/Edit tools and owns only
   `/fkit-team` and `/fkit-query`. It is the safe default when no role is named
   (`claude/fkit-claude.sh:190`).

   > ⛔ **Dated reversal notice 2026-08-02 — this decision is REVERSED. Do not follow it.** Reversed on
   > 2026-07-22 by [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) §Decision 1,
   > which names **this exact site** as what it reverses. The text above is **left byte-identical** as
   > the record of what was decided on 2026-07-11.
   >
   > **In force today**, verified against live code 2026-08-02:
   > - **`fkit-lead` is an orchestrating conductor, not a router only.** Given a goal it spawns typed
   >   `fkit-<role>` workers, assigns each one bounded unit of work, relays surfaced decisions to the
   >   owner, and advances. Its flagship driver is `/fkit-sprint-ship-loop`. It keeps the routing remit,
   >   and it still **never writes source and never reviews** (ADR-031 §Decision 2).
   > - **It does hold Write and Edit** — [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md),
   >   which falsified the "no Write/Edit tools" half earlier and independently of the reversal.
   > - **It owns five skills, not two.** `skills_for_role()` in `claude/skills-for-role.sh` grants lead
   >   `fkit-team`, `fkit-query`, `fkit-open-questions-interview`, `fkit-dumb-down` and
   >   `fkit-sprint-ship-loop`.
   > - The **"team room" label is retired** and the lead is **menu option 1** — see the ⚠️ correction at
   >   §Context.
   >
   > **Still true:** lead is the safe default when no role is named — `claude/fkit-claude.sh` today reads
   > *"No role and no tty (piped / CI) → lead is the safe default"* over `[ -n "$role" ] || role="lead"`.
   > Only the bullet's pointer `claude/fkit-claude.sh:190` is stale; it is left as written, as the record
   > of what was cited in 2026-07.
   >
   > **No other ADR-010 decision is reversed** — Decisions 1, 2, 4 and 5 stand as decisions, and this ADR
   > remains `accepted`.
4. **Cross-role work happens by consult, not by role-switching:** `@fkit-<role> <question>` — a
   one-off question answered in a fresh context, returned to the asker. Bounded by a **two-hop
   budget**, no cycles, and the rule that the asker keeps the decision that is theirs. Genuinely new
   architecture decisions escalate to the **owner**, never settled implicitly between agents.
5. **`skills_for_role()` in `claude/fkit-claude.sh` is the single source of truth** for role→skill
   ownership. The `skills:` frontmatter in `claude/agents/*.md` must be **generated from it or
   dropped** — it may not be a second hand-maintained list. (Implementation choice left to the coder;
   the invariant is *one* source of truth.)

   > ⚠️ **Dated correction 2026-08-02 — two factual claims in this decision are now false: the file it
   > names as `skills_for_role()`'s home, and its description of the `skills:` frontmatter as a second
   > hand-maintained list.** The text above is **left byte-identical** as the record of what was decided
   > on 2026-07-11.
   >
   > **What is true today**, verified against live code 2026-08-02:
   > - **`skills_for_role()` lives in `claude/skills-for-role.sh`, not `claude/fkit-claude.sh`.** That
   >   file's own header calls it *"the single source of truth for fkit role → skill ownership"* and
   >   records that it was *"Extracted from fkit-claude.sh (task 43 / ADR-018)"*. `claude/fkit-claude.sh`
   >   defines no `skills_for_role()` of its own — it only sources it. (It does still define other
   >   functions, `build_settings()` among them; this claim is scoped to `skills_for_role()` alone.)
   > - **It has two consumers now, not one.** `claude/fkit-claude.sh` sources it to build a `fkit <role>`
   >   session, and `claude/skill-ownership-hook.sh` — the `PreToolUse` gate from
   >   [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) —
   >   sources it to deny a `Skill` call whose invoking role does not own the skill.
   > - **The `skills:` frontmatter was DROPPED, not generated.**
   >   [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) §Decision 1: *"The
   >   `skills:` frontmatter is inert and is therefore DROPPED, not generated. ADR-010 §5 offered
   >   'generated from it **or** dropped'; that choice is now settled as **dropped**."* No file under
   >   `claude/agents/` carries a `skills:` key today.
   >
   > **Why ⚠️ and not ⛔ — this decision was not overturned, it was HONORED.** Its invariant, *one*
   > source of truth for role→skill ownership, is in force; the frontmatter question was settled by
   > taking the second of the two branches this decision itself offered. Only the file it names and its
   > sentence about the frontmatter went stale. **Status stays `accepted`.**
   >
   > **Named, not repaired here:** §Context's second lock bullet still names `claude/fkit-claude.sh` as
   > `skills_for_role()`'s home — a third occurrence of the same stale file name. That site is reserved
   > to the follow-ups covering Decision 2's retired `skillOverrides` mechanism and this ADR's stale
   > line-ranges, so it is flagged here rather than annotated there.

## Options considered

- **Role-locked sessions + skill lockdown (chosen).** Enforcement is structural; reviewer
  independence is a property of the runtime rather than a promise; the menu makes role choice
  deterministic. Costs: one role per session, so multi-role work means multiple terminal tabs, and
  the owner must choose a role up front.
- **ADR-008's lead-session + `/fkit-agent-<role>` hats (superseded).** Rejected: role separation was
  prompt-only. The same context that wrote the code could wear the reviewer hat — the independence
  check in the skill was compensating for a structural hole rather than closing it. Also, a
  long-lived lead session accumulates context from every role it has worn, which is the opposite of
  the fresh-context property reviews depend on.
- **Keep hats *and* add locked sessions (both paths).** Rejected: it reintroduces the weaker path
  alongside the stronger one, and anything the weak path allows is the effective security boundary.
  Two mechanisms for one invariant is also the exact drift pattern this ADR's point 5 exists to kill.
- **Enforce with path-level hooks (e.g. deny writes outside a role's paths).** Not rejected —
  **deferred**. It is complementary hardening (an agent with `Bash` can still technically write
  files, so the allowlist is not airtight). ADR-008 already deferred this; it stays deferred.

## Consequences

- **Positive:** reviewer independence, and the coder's inability to review its own work, become
  structural facts. Role boundaries no longer depend on an agent choosing to obey a prompt. Role
  choice is deterministic (no LLM in the routing path). The `fkit-lead` team room gives "I don't know
  who I need" a real answer without giving it a doer.
- **Negative / costs:**
  - **One role per session.** Multi-role work means multiple terminal tabs — a deliberate friction
    (automating tab-spawning needs AppleScript/Accessibility permissions that fail badly;
    `claude/fkit-claude.sh:20-22`).

    > ⚠️ **Dated correction 2026-09-03 (`0197`, inside sweep `0356`) — the pointer above drifted; the
    > rationale it cites is still in the file.** The pointer now lands on the ADR-018 skill-ownership
    > hook comment. ⭐ **The AppleScript/Accessibility reasoning survives**, in `claude/fkit-claude.sh`'s
    > header comment block, reading *"spawning terminals needs AppleScript/Accessibility permissions
    > that fail in ways"*. ⛔ **Target moved, not deleted** — the consequence stands as written.
  - The owner must pick a role before working, rather than drifting into one.
  - **The lock is partial and honestly so:** `Agent(type)` allowlists inside subagent definitions are
    ignored by Claude Code (they only apply to a main-thread `--agent`), so *which peer* an agent may
    consult — and the two-hop cap — remain **prompt-enforced**. The skill lockdown and tool allowlist
    are real; the consult topology is not.
  - A settings file per role is written to `.fkit/settings/<role>.json` on each launch — a small new
    piece of per-project generated state.
- **Residual risks / "re-raise only if":**
  - **Claude Code changes or removes `skillOverrides` / `--settings` semantics**, or starts honoring
    `Agent(type)` in subagent definitions — either would materially change what is enforceable and
    should reopen points 2 and 4.
  - **The two-hop consult budget proves too tight** in real use (an agent genuinely needing a third
    hop to answer) — reopen point 4 with a concrete example, not in the abstract.
  - Do **not** re-raise "role separation is only prompt-enforced" as a defect against the skill/tool
    layer — that was true of ADR-008's model and is what this ADR fixes. It *does* remain true of the
    consult topology, which is stated above as a known, accepted limit.
  - Do **not** re-raise "why can't one session switch roles" — that is this decision.

## Related

- Supersedes the role-access section of
  [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) (`:106-120`), which documents the
  now-deleted `/fkit-agent-<role>` hat skills.
- [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) — the runtime this model lives on.
- Evidence: [`2026-07-11-doc-drift-audit.md`](../reports/2026-07-11-doc-drift-audit.md) (§"An open design
  question — two sources of truth for the skill lock").
- Code: `claude/fkit-claude.sh:14-18,29,75-103,151-199`, `claude/agents/fkit-lead.md`,
  `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/CLAUDE.md:12-50`.

> ⚠️ **Dated correction 2026-09-03 (`0197`, inside sweep `0356`) — the `Code:` line's coordinates,
> assessed for the first time.** The line is **left byte-identical**. A `Code:` bibliography is a pure
> forwarding pointer with no quoted phrase beside it, so a reader who follows it has nothing to recover
> the claim from — which is why it earns this note where the paired cites below do not.
>
> - `claude/fkit-claude.sh` — of its four sub-ranges, **two still land** (the two-way-lock header
>   comment, and the `FKIT_SETUP_ONLY` env note) and **two have drifted** (the launcher-internals and
>   menu ranges). Anchor on the quoted comment text instead.
> - ⭐ **`claude/scaffold/CLAUDE.md` — CHECKED FOR THE FIRST TIME, and it LANDS.** No prior task had ever
>   verified this range. The file is 92 lines; the range opens on the heading `## The fkit agent team`
>   and covers both the role roster and the whole skill-lock passage, including *"a `fkit coder` session
>   **cannot** run `/fkit-review`"* and the visible-but-not-runnable cost. ⚠️ **Its end clips a sentence
>   mid-way**, which is cosmetic. ⛔ **This pointer is NOT stale and must not be "corrected"** — its
>   durable anchor is that heading plus the quoted fragment above, since the heading alone in a long
>   document locates a region but not a claim.
> - **The two `adr-008` cites, and the `Supersedes` cite** — the section they name,
>   §"Role access — three explicit paths", **still exists**, and the verbatim phrase one of them quotes
>   still exists too, though both sit further down that file than the numbers say. ⚠️ **An accepted ADR
>   is append-corrected by third parties, so it grows under a citation like any living document** — but
>   because each of these is paired with a heading or a quoted phrase, the drift is recoverable and
>   ⛔ **none of them earns a correction note.** Recorded here so the check is visible rather than silent.
</content>
