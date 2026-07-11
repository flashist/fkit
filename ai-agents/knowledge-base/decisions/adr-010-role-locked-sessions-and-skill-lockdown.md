# ADR-010: Role-locked sessions with a skill lockdown, replacing lead-session "hat" skills

- **Status:** accepted
- **Date:** 2026-07-11
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Supersedes:** [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) §"Role access —
  three explicit paths" (`adr-008:106-120`)

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
4. **Cross-role work happens by consult, not by role-switching:** `@fkit-<role> <question>` — a
   one-off question answered in a fresh context, returned to the asker. Bounded by a **two-hop
   budget**, no cycles, and the rule that the asker keeps the decision that is theirs. Genuinely new
   architecture decisions escalate to the **owner**, never settled implicitly between agents.
5. **`skills_for_role()` in `claude/fkit-claude.sh` is the single source of truth** for role→skill
   ownership. The `skills:` frontmatter in `claude/agents/*.md` must be **generated from it or
   dropped** — it may not be a second hand-maintained list. (Implementation choice left to the coder;
   the invariant is *one* source of truth.)

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
- Evidence: [`doc-drift-audit-2026-07-11.md`](../doc-drift-audit-2026-07-11.md) (§"An open design
  question — two sources of truth for the skill lock").
- Code: `claude/fkit-claude.sh:14-18,29,75-103,151-199`, `claude/agents/fkit-lead.md`,
  `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/CLAUDE.md:12-50`.
</content>
