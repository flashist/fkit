# `AskUserQuestion` availability for fkit agents — investigation findings

- **Date:** 2026-07-17
- **Author:** fkit-architect (owner present)
- **Task:** [`investigate-askuserquestion-availability-for-agents.md`](../../tasks/backlog/investigate-askuserquestion-availability-for-agents.md)
  (Sprint 2, priority 39)
- **Status:** **reviewed with the owner, 2026-07-17.** Owner rulings recorded inline (§5, §6): **grant
  to the six Claude-side agents** (not the adversarial reviewer); **record the harness-fact tombstone**
  (→ [ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)); **the
  implementation (the `tools:`-line grant) is a separate brief for the producer to scope** — not done
  here. The adversarial Codex pass was **offered and declined by the owner** (the finding is clean:
  3/3 + a direct session measurement).
- **Harness versions pinned:** **Claude Code 2.1.212**, codex-cli 0.144.4. *(An unversioned harness
  observation is a fossil-in-waiting — ADR-010's original error; recorded so a future reader knows
  exactly what this was measured against.)*

---

## Summary — the hypothesis held, measured not reasoned

The task's predicted headline was: *"session yes, consult no — and the consult already has the right
answer (return the open question)."* **The measurement supports it, and settles the crux more cleanly
than expected.**

**A spawned subagent (consult) does not have `AskUserQuestion` at all** — it is not in the subagent's
toolset and not even discoverable via `ToolSearch`. Measured **3/3 `TOOL_ABSENT`** on Claude Code
2.1.212, using a `general-purpose` subagent with `tools: *` (the broadest possible access). The
consult failure mode the task most feared — a **hang** ("worse than a tool that is absent") — **does
not occur.** The tool is literally *absent*, the safest of the four possible modes.

**Consequence that removes the task's central worry (Conflict 3):** granting `AskUserQuestion` to fkit
agents **cannot** change the consult model, because a consult **cannot use the tool regardless of the
grant.** The "return open questions in your reply" contract is therefore not merely a convention we
chose — on 2.1.212 it is the **only** option a consult has. The grant de-risks to a **session-only UX
question**, not the architecture decision the brief anticipated.

`AskUserQuestion` appears in **none** of the seven agents' `tools:` lines and nowhere in `claude/`
(verified 2026-07-17, `grep -rn AskUserQuestion claude/` → empty; `fkit-architect.md:9` tools line
carries no such entry) — so **no fkit agent can use it today**, in any context.

---

## 1. Method

The brief demanded measurement over reasoning, with **multiple trials and a within-subject control**
(the design that caught a false positive in the `--append-system-prompt` work,
[`reports/2026-07-14-shared-instructions-layer.md`](2026-07-14-shared-instructions-layer.md) §5).

**Consult context (the crux, Unknown 1)** — measured directly and now:
- Spawned **three independent `general-purpose` subagents** (T1/T2/T3). `general-purpose` carries
  `tools: *`, so if any spawned agent could see `AskUserQuestion`, it would.
- Each was instructed to (a) determine whether `AskUserQuestion` is in its available tools, (b) if so,
  call it once with two labelled options, (c) report **exactly one** verdict —
  `TOOL_ABSENT` / `RETURNED:<pick>` / `ERROR:<text>` / `NO_RETURN` — and (d) end with a **control
  token** (`CTRL-T{n}-ALIVE`) proving it executed and could report back.
- **Anti-fabrication guard** (the control against a hallucinated positive): each was told, in caps,
  that if no genuine human selection came back it **must not** report `RETURNED`. This is the
  within-subject control — the token proves the agent was alive and responsive, so a non-`RETURNED`
  result is a true negative, not a dead agent.

**Session context (Unknown 1, the baseline half)** — not measurable from *within* a role-locked
session (it exposes only its `tools:` allowlist — harness-enforced, the strongest boundary in fkit,
`architecture.md` §4.1 — and `AskUserQuestion` is on none of them), so it was measured **by the owner
in a plain top-level `claude` session**: call the tool with two options and observe. Result in §2.

---

## 2. Results — consult context

**Claude Code 2.1.212. Consult (spawned subagent), N=3.**

| Trial | Agent | Verdict | Control token | Detail |
|---|---|---|---|---|
| T1 | general-purpose (`tools:*`) | **`TOOL_ABSENT`** | ✅ CTRL-T1-ALIVE | Not in active tools (Agent, Artifact, Bash, Edit, Read, Skill, ToolSearch, Write) nor the deferred list. No call attempted. |
| T2 | general-purpose (`tools:*`) | **`TOOL_ABSENT`** | ✅ CTRL-T2-ALIVE | Not in active toolset nor deferred-tools list. No call, no fabricated selection. |
| T3 | general-purpose (`tools:*`) | **`TOOL_ABSENT`** | ✅ CTRL-T3-ALIVE | Not active, not deferred; `ToolSearch select:AskUserQuestion` → "No matching deferred tools found". |

**3/3 `TOOL_ABSENT`. No dialog reached the owner. No hang, no error, no silent no-op, no fabrication.**
The control token fired in all three, so these are true negatives from live, responsive agents. The
owner separately confirmed **no dialog appeared on screen** during the trials — ruling out a
tool-fired-but-result-lost fluke.

**Session context, N=1 (owner-run, plain top-level `claude` session, 2.1.212):** the owner invoked
`AskUserQuestion` with two options and the **selection dialog rendered and returned normally**
(screenshot on file with the owner). **Session → works.** This is the tool's standard top-level
behavior with the human present — and, unlike the `--append-system-prompt` fossil, it is *not* a
cross-spawn inheritance question, so a single clean trial is a sufficient positive here.

**The two directions, measured on 2.1.212:** **session → works** · **consult → `TOOL_ABSENT` (3/3).**
Exactly the task's hypothesis, now with evidence on both sides.

**Failure-mode characterization (task requirement):** the consult mode is **`TOOL_ABSENT`** — cleaner
than any of error / hang / block / silent-no-op. The subagent *knows* the tool is not available and
proceeds without it. The specific hazard the brief flagged — *a tool that hangs an unattended consult*
— **is not present** on 2.1.212.

**Scope limit, stated honestly:** these trials use `general-purpose` (`tools:*`) as the proxy for "a
spawned fkit consult." The proxy is strong — `*` is the broadest grant and it still yields no
`AskUserQuestion`, and the tool is not even in the deferred/`ToolSearch` universe (T3) — which
indicates the harness **withholds `AskUserQuestion` from subagents categorically**, independent of the
tools list. What it does **not** 100%-prove is the narrow case of an fkit agent with `AskUserQuestion`
*explicitly* named in its `tools:` line, then spawned as a consult. The evidence points hard at "still
absent," but the one confirmatory trial (temporarily grant it, spawn, enumerate) was **not run** —
the brief forbids adding the tool to any agent for this task. See §6 residual.

---

## 3. Unknown 2 — the second model: "all agents" is structurally false

`fkit-adversarial-reviewer` runs its review on **Codex**, via `codex exec` (`fkit-adversarial-
reviewer.md:26-31`; the skill builds its own prompt and runs `codex exec --sandbox read-only`). The
**codex CLI has no `AskUserQuestion`** — it is a Claude Code tool. So:

- Granting `AskUserQuestion` in `fkit-adversarial-reviewer.md`'s `tools:` line affects only its thin
  **Claude-side wrapper**, never the Codex run that *is* the review. The second model cannot receive
  the tool.
- The agent is additionally a **leaf** — *"You are a leaf — you consult no one. You have no Agent
  tool, deliberately"* (`fkit-adversarial-reviewer.md:22`) — and **FINDINGS ONLY**
  (`:7, :14, :61`), with `tools: Read, Grep, Glob, Bash, Skill` (`:9`). An interactive prompt sits
  against both contracts.

**"All agents" therefore cannot structurally include the second model.** This is the same shape as the
rejected `AGENTS-COMMON.md` finding — *"a shared layer for all agents that excludes the second model is
misnamed"* (2026-07-14 report §3). The honest scope of any grant is **"the Claude-side agents, in a
session,"** never "all agents."

---

## 4. Role-contract conflicts — mapped with file:line

The consult "don't ask — return the open question" instruction is a **designed constraint**, not an
oversight. Because §2 shows a consult *cannot* ask anyway, granting the tool leaves every one of these
**correct and in force** — the grant does not touch them.

| Contract | file:line | What it says | Effect of a grant |
|---|---|---|---|
| Producer consult constraint | `fkit-producer.md:44` | spawned consult returns *"an open question in your reply rather than guessing"* | **Unchanged** — consult has no tool to ask with (§2). |
| Architect consult constraint | `fkit-architect.md:38` | same instruction, same seam | **Unchanged** — same reason. |
| Hop-2 terminal rule (shared) | `fkit-producer.md:59`, `fkit-architect.md:80` (and the coder/reviewer equivalents) | at hop 2 *"answer from files… or return an open question"* | **Unchanged.** |
| Escalation rule | `fkit-producer.md:64` | *"return them as open questions in consult"* mode | **Unchanged.** |
| Adversarial reviewer — leaf | `fkit-adversarial-reviewer.md:22` | *"a leaf — you consult no one. You have no Agent tool"* | Grant is **moot** (runs on Codex; §3). |
| Adversarial reviewer — findings only | `fkit-adversarial-reviewer.md:7, :14, :61` | FINDINGS ONLY output contract | An interactive prompt **contradicts** this; do not grant. |

A **documented failure of exactly the interactive-in-a-non-interactive-context pattern** is already on
record: [`history/fkit-external-review-report.md:124`](../history/fkit-external-review-report.md) — a
skill that gated writes on interactive `AskUserQuestion` while its delegated stub ran non-interactive
(*"nobody present to answer the mandatory questions"*). The §2 measurement is the mechanical reason
that failure happens: in a spawn, the tool is not there.

---

## 5. Recommendation — per agent

**The measured reality reframes the whole decision.** A grant is a **session-only UX change** (nicer
structured multiple-choice prompts to the owner when the owner is present) with **zero effect on the
consult model** (the tool is absent there). It is not the architecture decision the brief feared.

| Agent | Grant? | Context it would work in | Reason |
|---|---|---|---|
| `fkit-producer` | **Optional (owner UX call)** | session only | Would render interview choices as structured prompts *in a session*; useless in a consult (§2). No consult-model impact. |
| `fkit-coder` | **Optional (owner UX call)** | session only | Same — cleaner plan/fix choices in a session; consults unaffected. |
| `fkit-architect` | **Optional (owner UX call)** | session only | Same — design-choice prompts in a session. |
| `fkit-reviewer` | **Optional (owner UX call)** | session only | Same — disposition prompts in a session. |
| `fkit-wiki` | **Optional (owner UX call)** | session only | Low value; wiki work is rarely multiple-choice. |
| `fkit-lead` | **Optional, low value** | session only | Lead is a router that talks to the owner in a session; could use it, but does little decision-work. |
| `fkit-adversarial-reviewer` | **Do not grant** | — | Structurally moot: runs on Codex (§3); leaf + findings-only (§4). "All agents" is false here. |

**If the owner grants it (to the Claude-side session agents):** the accompanying instruction change is
**minimal**, because the consult constraints stay exactly as written (§4). At most, add to each granted
role a one-line note: *"In a session you may use `AskUserQuestion` for a structured choice; in a spawned
consult the tool is absent — return open questions as before."* **No consult-contract text is deleted.**

**Recommended default:** grant is **not required** for anything fkit does today — agents already ask
the owner in prose in a session, and consults already return open questions. Treat it as an optional,
low-stakes ergonomic upgrade for interactive sessions, decided on taste, not necessity.

> **Owner ruling (2026-07-17): grant to the six Claude-side agents** — producer, coder, architect,
> reviewer, wiki, lead — and **not** `fkit-adversarial-reviewer`. This is the owner-review outcome that
> unblocks a producer-scoped implementation brief. **Implementation scope (for that brief, not this
> task):** add `AskUserQuestion` to the `tools:` line of those six `claude/agents/fkit-*.md` files, add
> the one-line session/consult note to each (the consult "return open questions" text stays), and
> refresh the `.claude/` copies via normal init. **Do not touch `fkit-adversarial-reviewer.md`.** No
> `skills_for_role()` change — this is a tool grant, not a skill (see §Related).

---

## 6. The ADR question

**A consult-model ADR is NOT warranted** — because there is no consult-model change to record. The
brief anticipated that a grant "changes the consult model (the two-hop envelope) rather than merely
adding a capability" (Conflict 3). **The measurement removes that:** a consult cannot invoke the tool,
so the two-hop "return open questions" envelope is untouched by any grant.

**What is worth a lightweight ADR — as a tombstone, not a consult-model change:** the *measured harness
fact* that `AskUserQuestion` is **absent in spawned subagents on Claude Code 2.1.212** (works in a
session), so the consult "return open questions" contract is the only option and should not be
re-litigated as "why can't consults just ask the owner?" This mirrors the value of the
`--append-system-prompt` tombstone. **Owner ruling (2026-07-17): record it** — written as
[ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md).

**Session-context trial — done.** Measured by the owner in a plain top-level `claude` session: the
dialog rendered and returned (§2, N=1). The session cell is filled; both directions are now measured.

**Residual not run (by brief instruction):** the explicit-grant-then-spawn confirmation (§2 scope
limit). Cheap to run if the owner ever authorizes a temporary grant; the recommendation does not hinge
on it, since a grant is optional and session-only regardless.

---

## 7. Verification-step checklist (task's own bar)

- ✅ Dated findings report under `reports/`, **Claude Code version pinned** (2.1.212).
- ✅ **Both contexts answered with recorded trial counts:** consult **3/3 `TOOL_ABSENT`** (with the
  ALIVE control token + anti-fabrication guard); session **1/1 works** (owner-run, plain session).
- ✅ **Consult failure mode stated explicitly:** `TOOL_ABSENT` (not hang/error/block/no-op). The
  hang hazard is called out as **not present** on this version.
- ✅ **Codex / adversarial-reviewer status stated structurally:** cannot participate (§3).
- ✅ **Each of the seven agents carries a recommendation** with reason and context (§5).
- ✅ **Every role-contract conflict named with file:line** (§4).
- ✅ **The ADR question carries an answer** (§6): no consult-model ADR; tombstone recorded (ADR-021).
- ✅ **Findings reviewed with the owner** (2026-07-17). Owner ruled: grant to the six (§5); record the
  tombstone (§6, ADR-021); adversarial Codex pass offered and **declined**.

---

## Related

- [`reports/2026-07-14-shared-instructions-layer.md`](2026-07-14-shared-instructions-layer.md) — the
  method (within-subject control, version-pinning) and the `--append-system-prompt` session-only
  precedent this measurement echoes.
- [ADR-009](../decisions/adr-009-claude-code-native-is-the-only-runtime.md) — Codex is the required
  second model; §3's "the tool can't reach Codex" is a fact about that runtime.
- [ADR-010](../decisions/adr-010-role-locked-sessions-and-skill-lockdown.md),
  [ADR-012](../decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — the
  session/consult seam; note tools are gated by `tools:` frontmatter, **not** `skills_for_role()`
  (this is a tool-allowlist question, not a skill question).
- [`history/fkit-external-review-report.md:124`](../history/fkit-external-review-report.md) — the
  documented interactive-prompt-in-a-non-interactive-context failure.
- Code: `claude/agents/fkit-*.md` `tools:` lines (none carry `AskUserQuestion`);
  `fkit-adversarial-reviewer.md:9,:22,:26-31,:61`; `fkit-producer.md:44`; `fkit-architect.md:38`.
