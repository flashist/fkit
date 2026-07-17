# ADR-022: Tool allowlists are relaxed for every role except the adversarial reviewer

- **Status:** accepted
- **Date:** 2026-07-18
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Amends (does not supersede):** [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md)
  and [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the **tool-allowlist** half of
  the role lock. The **skill lockdown is untouched** (see Decision 4).

## Context

fkit gives every agent an explicit `tools:` frontmatter allowlist. The original rationale
([ADR-008:52-53](adr-008-claude-code-native-port-alongside-omnigent.md)) was purely **structural role
authority**: *"Tool allowlists add structural enforcement on top of the prompt rules: the adversarial
reviewer gets no Write/Edit at all; every agent gets an explicit allowlist."* architecture.md:101 calls
it *"the strongest boundary in the system."*

An audit this session (2026-07-17/18) established three facts that reframe that posture:

1. **Useful built-in *capability* tools were excluded by accident, not decision.** `WebSearch`,
   `WebFetch`, `LSP`, `NotebookEdit` (and more) appear in **no** agent's `tools:` line and have **never
   appeared in any commit in the repo's history** — nothing was disabled; they were never enabled.
   There is **zero recorded rationale** anywhere for excluding them. The moment an agent gets *any*
   `tools:` line it flips from "inherit all tools" to "only these," so these were dropped as collateral
   of the authority decision, never as a target of it. (Same situation as `AskUserQuestion` — ADR-021.)
2. **The `tools:` wall was never a real sandbox anyway.** ADR-008:85 already records the *Bash escape
   hatch*: any agent with `Bash` can write files via the shell, so "no Write/Edit" was always
   substantially prompt-enforced. Every fkit agent holds `Bash`.
3. **Only one tool wall protects a genuine, checkable invariant: the adversarial reviewer's.** Its lack
   of Write/Edit/Agent is what makes *"the independent second opinion never touched the code it is
   judging"* a **structural fact, not a promise** — and that independence is close to the center of
   fkit's whole thesis (PROJECT.md: separation of authority). Every other wall is either accidental
   (capability tools, #1) or a **product-discipline guardrail** rather than a safety invariant — most
   notably the **lead**, whose no-Write/Edit rule (`fkit-lead.md:24-25,72-73`) exists to keep the
   default "not sure who you need" session a *router* rather than letting the path of least resistance
   turn it into a do-everything generalist. Real, but philosophy, not safety.

The owner, having worked with the hard-wall-everywhere posture, ruled that it is **not worth its cost
except where it protects a real invariant.** Full reasoning and the three-category split:
consult thread this session; the tool audit is
[`reports/2026-07-17-askuserquestion-availability-for-agents.md`](../reports/2026-07-17-askuserquestion-availability-for-agents.md).

## Decision

**Relax the tool allowlist for every role *except* the adversarial reviewer.**

1. **The six Claude-side roles — producer, coder, architect, reviewer, wiki, lead — get unrestricted
   tools.** They may hold the full Claude Code tool set (including `WebSearch`, `WebFetch`, `LSP`,
   `NotebookEdit`, `AskUserQuestion`, etc.). The recommended mechanism is to **omit the `tools:`
   frontmatter line entirely** (a subagent with no `tools:` field inherits every tool) — the truest,
   lowest-maintenance expression of "no restriction." An explicit comprehensive list is an acceptable
   alternative; the implementation task decides. **Tradeoff of omitting:** the role then also inherits
   *future* Claude Code tools automatically and irrelevant ones (Cron*, Artifact, RemoteTrigger, …) —
   harmless for a CLI dev tool, and preferable to a list that silently rots as the harness grows.
   - This **subsumes the `AskUserQuestion` grant** (task 54): the six get it (and everything else) by
     inheritance. If the explicit per-agent `AskUserQuestion` entries are removed in the process, the
     capability is retained — it just arrives via inheritance instead of an explicit entry.
   - This also drops the **lead's scoped `Agent(...)` list** (the one place the two-hop consult
     topology was structurally enforced — architecture.md:209) and the **lead's / wiki's** authority
     exclusions. Accepted, and taken knowingly (the owner's "conscious call" on the lead): the consult
     topology remains **prompt-enforced everywhere else exactly as before**, so nothing that was
     structural elsewhere is lost, and the lead becoming capable of work is an accepted convenience.

2. **The adversarial reviewer keeps its exact current allowlist** — `tools: Read, Grep, Glob, Bash,
   Skill`. No Write/Edit/Agent, and no capability tools (its review runs on **Codex**, not the Claude
   wrapper, so web/LSP there would be pointless). **An agent's own `tools:` line governs it at any spawn
   depth** — so keeping this one line preserves the wall even when the adversarial reviewer is spawned
   as a consult by a now-unrestricted reviewer.

3. **This is the only structural tool wall that remains, and it is deliberate.** The invariant it
   protects — reviewer independence / model-diverse second opinion never having write authority over the
   code — is the one worth enforcing structurally rather than by prompt.

4. **The skill lockdown is unchanged and out of scope.** The ADR-018 `PreToolUse` hook still governs
   `fkit-*` skills by role: the coder still cannot run `/fkit-review`, etc. This ADR relaxes **tools
   (generic capabilities)**, not **skills (named, role-owned procedures)**. Freeing capabilities while
   keeping the *procedures* role-locked is a coherent, deliberate posture — the cheap, meaningful
   separation (a role can't run another's procedure) stays; the blunt one (a role can't hold a generic
   tool) goes.

5. **The prompt-level role boundaries are unaffected by this ADR** and remain as written — e.g. the
   architect's "task lifecycle is the producer's domain," the reviewer's "review-only," the lead's "not
   a doer." Relaxing *tools* does not relax *contracts*; any change to those (e.g. letting the architect
   edit a task description) is a separate, explicit decision.

## Options considered

- **Relax all tool allowlists except the adversarial reviewer's (chosen).** Grants the accidentally-
  excluded capability tools, drops the walls that were philosophy rather than safety, and keeps the one
  wall that protects a real invariant. Cost: role separation for the five now rests on prompts + the
  skill hook, not on tools; the lead can act as a generalist.
- **Remove *all* tool restrictions, including the adversarial reviewer's.** Rejected: it dissolves the
  one structural guarantee that makes the independent review trustworthy — "the second opinion never
  had write access to the code." That is the exact "one context proposes, builds, and approves" failure
  fkit exists to prevent (PROJECT.md; `fkit-lead.md:72-73`).
- **Grant only the capability tools, keep all authority walls (the architect's narrower first
  proposal).** Rejected by the owner: after working with them, the lead/wiki authority walls were found
  to be low-value friction (product-discipline, not safety), not worth keeping just because they were
  there.
- **Keep the hard-wall-everywhere posture (status quo).** Rejected: most of it is accidental (capability
  tools) or a guardrail against the owner's own shortcuts (lead), and the wall was never a real sandbox
  anyway (Bash escape hatch, ADR-008:85).

## Consequences

- **Positive:**
  - Every working role gains web research (`WebSearch`/`WebFetch`), code intelligence (`LSP`), notebook
    editing, and any future built-in — closing a gap that had no rationale.
  - Less to maintain: no per-role allowlist to expand as the harness grows (if the `tools:` line is
    omitted).
  - The one wall that matters — the adversarial reviewer's independence — is now *unambiguous*: it is
    the sole structural tool restriction, so its purpose is legible rather than lost among blunt ones.
- **Negative / costs:**
  - **Role separation for the five now rests on prompts + the skill hook, not tools.** This is a real
    reduction in structural enforcement — accepted knowingly. Mitigation: it was already substantially
    prompt-enforced (Bash escape hatch), and the skill lockdown (the *procedure* separation) is
    untouched.
  - **The lead can now act as a generalist**, and the default "not sure who you need" session is no
    longer structurally prevented from doing work — the "god session" erosion risk `fkit-lead.md:72-73`
    warns of is now prompt-only. Accepted as a convenience/discipline tradeoff.
  - **The lead's scoped `Agent(...)` list — the one structurally-enforced point of the consult
    topology — is gone.** The topology stays prompt-enforced everywhere else, so this is a small loss;
    named so it isn't mistaken later for a regression.
  - **Docs need updating** (architect follow-up, not this ADR): architecture.md:101 ("tool allowlist…
    the strongest boundary"), §4.1 the per-role tool table, and §5.3/:209 (lead's structural `Agent`
    list) now describe a superseded posture. `PROJECT.md` and `CLAUDE.md` tool-allowlist mentions
    likewise.
- **Residual risks / "re-raise only if":**
  - **A non-adversarial role's now-unrestricted tools are shown to cause a concrete problem** (an
    accidental destructive action, a real out-of-role action that a wall would have blocked) — reopen
    for that specific role/tool; do not restore the blanket posture.
  - **Someone proposes giving the adversarial reviewer Write/Edit/Agent, or removing its `tools:`
    line** — reopen this ADR; that dissolves the one invariant it deliberately keeps (Decision 2). Its
    minimal set is not to be "tidied up" to match the others.
  - **Someone proposes relaxing the *skill* lockdown to match** ("tools are open, why lock skills?") —
    that is a **different** decision (ADR-018's domain); this ADR deliberately keeps the procedure
    separation. Do not treat tool-relaxation as license to open the skill hook.
  - Do **not** re-raise "role separation is only prompt-enforced for the five" as a defect — that is
    this decision, taken knowingly. A finding must show a concrete harm, not restate the general worry.

## Related

- [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) §Decision/§Consequences — the
  original "tool allowlists add structural enforcement" rationale this amends; the *Bash escape hatch*
  caveat (:85) this leans on.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the role lock; its **tool-allowlist**
  half is relaxed here, its **skill-lockdown** half is not.
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  skill hook, explicitly **kept** (Decision 4); fkit skills stay role-locked.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — the `AskUserQuestion`
  grant this subsumes; note ADR-021's harness fact still holds (the tool is `TOOL_ABSENT` in any
  spawned consult regardless of the `tools:` grant — a session-vs-consult harness behavior, unaffected
  by relaxing allowlists).
- Code: `claude/agents/fkit-*.md` `tools:` lines (six to relax, `fkit-adversarial-reviewer.md:9` to
  keep); `fkit-lead.md:7,24-25,72-73` (the lead's boundaries and their stated rationale).
- Docs to refresh (architect follow-up): `architecture.md:101,§4.1,§5.3,:209`; `PROJECT.md`;
  `CLAUDE.md`.
- Task: the implementation is a producer-scoped brief (owner: fkit-coder), created alongside this ADR.
