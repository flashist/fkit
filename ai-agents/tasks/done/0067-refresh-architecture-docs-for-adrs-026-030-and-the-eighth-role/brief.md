# Refresh `architecture.md` for ADRs 026–030 and the eighth role

## ID
0067

## Sprint
Sprint 2

## Priority
82

## Status
✅ Done

## Owner
fkit-architect

## Context

**The canonical architecture document is factually wrong about the shape of the team.** That is the
reason this is sprinted rather than parked on the Backlog board — a stale citation list is a
maintenance chore, but a wrong role count is a claim every future run reads as ground truth.

**Measured by the 2026-07-19 vault lint, and re-verified while scoping this brief** (per
`conventions/evidence-before-assertion.md`, these numbers were run, not carried over from anyone's
standing flag):

- **`ai-agents/knowledge-base/architecture.md` cites up to ADR-025.** Confirmed by extracting every
  `ADR-NNN` / `adr-NNN` reference in the file; ADR-025 is the high-water mark.
- **Absent: ADR-026, 027, 028, 029, 030** — five past the high-water mark. All five exist on disk in
  `ai-agents/knowledge-base/decisions/`.
- **Plus the ADR-023 and ADR-024 tombstones** (`fkit-git-agent-is-not-built`,
  `ship-loop-owner-question-timeout-is-not-built`) — **seven counting tombstones.**
- **Two prior flags both undercounted this.** A standing flag said three; the wiki's said two. **It is
  five, or seven with tombstones.** Worth noting in passing: the undercount is itself a small instance
  of the evidence-before-assertion problem — two carried-forward numbers, neither re-measured.

**The factual error, which is the urgent part:**

- **`architecture.md:4`** — *"runtime, seven roles, no orchestrator…"*
- **`architecture.md:82`** — *"### 4.1 The seven roles"*
- [**ADR-028**](../../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)
  adds an **eighth** role, a sandboxed e2e tester.

### 🔴 The authoritative site list already existed. Read it; do not re-derive it.

**[ADR-028 `:154-169`](../../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)
is this task's source of truth for the affected sites.** Its follow-up 2 is titled, in terms: *"The
seven→eight ripple is already enumerated — **do not re-derive it**."* It points at the full table in
[`reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:67-77`](../../../knowledge-base/reports/2026-07-18-design-fkit-git-agent-and-consent-model.md)
— built for the git-agent question ADR-023 declined, where the ripple is identical and only the eighth
role differs — and **re-verifies the claims as still live on 2026-07-19.**

> **⚠️ Recorded because it belongs on the record, not to score a point.** This brief was originally
> scoped from a hand-assembled partial list, by two agents, **neither of whom read ADR-028's follow-up
> section before scoping** — the section that says in its own heading not to re-derive the list. The
> hand-assembled version had **five of the nine live sites** and missed the one flagged as *"the one
> most likely to be missed."* **This is the fourth instance in a single day of the same failure the
> [`add-worked-example-to-evidence-before-assertion`](../../backlog/0013-add-worked-example-to-evidence-before-assertion/brief.md)
> task is being widened to document:** asserting from what was to hand instead of checking the record
> that already existed. It cost nothing this time only because someone swept again.

**The live sites, from ADR-028 and confirmed by a 2026-07-19 sweep — every line below was read, not
copied:**

| Site | Kind | Notes |
|---|---|---|
| `ai-agents/knowledge-base/architecture.md:4`, `:82` | doc | *"seven roles"*, *"### 4.1 The seven roles"* |
| `CLAUDE.md:7` | doc | *"a team of **seven** role-scoped AI agents"* — **confirmed, was a lead** |
| `AGENTS.md:7` | doc | same sentence as `CLAUDE.md:7` |
| `README.md:76` | doc | *"agents/ — the seven roles as Claude Code subagent definitions"* |
| `claude/README.md:3` | doc | *"the seven roles as Claude Code subagents"* |
| `ai-agents/knowledge-base/PROJECT.md:8`, `:72` | product brief | **NOT this task — task 83, see below** |
| `claude/fkit-claude-init.sh:847` | **code** | *"Seven roles, each a locked session"* — **NOT this task — task 81 Part D** |

**Nine sites across seven files. Five sites in four files are this task's; four are not.**

### 🔴 Two more sites ADR-028 names that the 2026-07-19 sweep did not carry

**Neither is this task's to fix, and both must be flagged rather than silently dropped**
(ADR-028:165-166, quoted: *"Also stale, and not the architect's to fix"*):

- **`ai-agents/wiki-vault/index.md:11`**
- **`ai-agents/wiki-vault/wiki/systems/fkit.md:7`, `:15`**

**Only `fkit-wiki` writes the vault** (ADR-005, and the hard rule in `CLAUDE.md`). **Whoever picks up
this task must not touch these** — they need a wiki resync. **Flag them to the owner on completion so
a resync is scheduled**; leaving the vault asserting a seven-role team after the docs are fixed is a
worse state than the current uniform staleness, because the two records then disagree.

**The third follow-up ADR-028 names — the ADR-023 pointer — IS in this task.** Owner ruling
2026-07-19: it needs no separate call, because an ADR edit is architect work and it is the same defect
class as the rest of the task. Scoped under "What to build" above, with its two constraints.

### ⚠️ Do not "fix" these

- **The many "seven" hits in ADRs, reports, and closed sprint rows are historical records of past
  state. They must stay.** A record of what was true in Sprint 2 is not a stale claim. Changing them
  would be falsifying the record — a materially worse error than the one this task fixes.
- **`claude/scaffold/CLAUDE.md` carries no role count — verified 2026-07-19.** **There is no ADR-027
  dual-home parity issue here.** Checked so the next person does not have to.

## What to build

- **Correct the role count at the five documentation sites** this task owns:
  `architecture.md:4`, `:82`; `CLAUDE.md:7`; `AGENTS.md:7`; `README.md:76`; `claude/README.md:3`.
  **Work from ADR-028's enumeration, not from this table** — the table is a convenience, the ADR is the
  source of truth, and re-deriving from a convenience copy is how this brief got under-scoped the first
  time. **`PROJECT.md` is task 83's and `fkit-claude-init.sh` is task 81's — do not touch either.**
- **Add a dated pointer from [ADR-023](../../../knowledge-base/decisions/adr-023-fkit-git-agent-is-not-built.md)
  to ADR-028.** ADR-023 `:37` Decision 3 reads *"**The team stays seven role-scoped agents.** No
  count/roster ripple…"* — a claim ADR-028 later falsified. An ADR edit is architect work and this is
  the same defect class as the rest of the task: a record whose stale claim reads as current. **Two
  hard constraints:**
  - **ADR-023 is NOT superseded.** Its actual decision — no git agent — stands on its own reasoning.
    **Only the count claim is overtaken.** A bare *"superseded by ADR-028"* would be **false**, and
    would invite someone to reopen the git-agent question that ADR-023 settled. The pointer must say
    precisely which claim is overtaken and which is not.
  - **Do not rewrite ADR-023's reasoning.** It was true when written. **A dated pointer is the whole
    change** — an ADR is a record of what was decided and why, at the time; editing the argument
    destroys the thing the record is for.
- **⚠️ The count correction and the ADR-028 description are one edit, not two — get the tense right.**
  See the "decided but not built" constraint below. A bare `seven` → `eight` substitution at `:82`
  would make the architecture doc assert that a tester role **exists**. It does not.
- **Bring the ADR citations current** through ADR-030, in whatever form the document already uses for
  ADR references — do not invent a new citation style.
- **Include the ADR-023 / ADR-024 tombstones.** A "not built" decision is load-bearing precisely
  because it stops the question being reopened; omitting it is how a settled non-decision gets
  re-litigated.
- **Sweep for claims each new ADR supersedes**, not only for missing citations. Adding a reference
  while leaving a contradicted sentence standing is the failure mode task 58 was written against. The
  five ADRs and what each may contradict:
  - **ADR-026** — no mutation-testing library; `prove-red.sh` stays hand-rolled. Check any text
    implying a library is coming.
  - **ADR-027** — dual-home parity is a dev-time convention plus test.
  - **ADR-028** — the eighth role (the role count, above).
  - **ADR-029** — a task is a folder keyed by a permanent global ID. **Check every description of the
    task-file layout** — flat `backlog/*.md` is the shape the doc almost certainly still describes.
  - **ADR-030** — a stop hook enforces the turn-completion contract.

## Verification steps

- **No `ADR-NNN` above 030 and none below 026 missing**: re-extract every ADR reference from
  `architecture.md` and diff the set against `ls ai-agents/knowledge-base/decisions/`. **Run this;
  do not eyeball it** — a hand count is what produced the "three" and "two" undercounts above.
- **All five documentation sites corrected** — grep `seven` case-insensitively across the repo and
  confirm every surviving hit is one of: (a) unrelated to the role count; (b) a **historical record**
  in an ADR, report, or closed sprint row, which must stay; (c) `claude/fkit-claude-init.sh:847`,
  task 81 Part D; (d) `PROJECT.md:8,:72`, task 83; (e) a **vault** page, fkit-wiki's resync.
  **Anything fitting none of the five is a missed site.**
- **The ADR-023 pointer names which claim is overtaken.** Read it and confirm a reader cannot conclude
  the git-agent decision was reversed. **If the shipped wording would let them, it has failed** — that
  is a worse outcome than leaving ADR-023 untouched.
- **ADR-023's reasoning is byte-identical apart from the added pointer.** Diff it.
- **The vault sites and the ADR-023 pointer are flagged to the owner on completion**, not fixed here
  and not silently dropped.
- **Every ADR-028/029/030 mention reads as a decision, not as existing structure.** Read the shipped
  sentences and ask: does this tell a reader the tester role exists, or that it was decided on? If a
  reader could conclude the former, it fails.
- **The ADR-029 sweep actually happened**: confirm the task-layout description matches the
  folder-plus-global-ID model as *decided*, and does not silently describe flat files as current fact
  while citing ADR-029 elsewhere.
- **Document stays an architecture doc**, not a changelog — the ADRs serve the description of the
  system; the description is not a list of ADRs.

## Notes

- **Owner: fkit-architect.** **Documentation only** — no agent-file, skill, or source edits.
- **Depends on: nothing.** No blockers; can start immediately.
- **🔴 `claude/fkit-claude-init.sh:847` is NOT in this task — moved to
  [task 81](../0036-extend-mover-reference-sweep-to-the-knowledge-base/brief.md) as Part D.** The line is
  `printf '  Seven roles, each a locked session…'` — **executable source, not prose** (ADR-028:164
  flags it as *"code, not prose, and the one most likely to be missed"*). The architect does not write
  source. Task 81 is already fkit-coder's and already editing files under `claude/`, so it absorbs the
  one-line change rather than justifying a separate brief for it.
  - **The boundary I applied, stated so it can be disagreed with:** ownership follows **whether the
    text is executed**, not which directory it sits in. `claude/README.md:3` and `README.md:76` are
    **prose that no program reads** — identical in kind to the `CLAUDE.md` and `AGENTS.md` edits, and
    splitting them out by directory would scatter one sentence-level change across two tasks and two
    roles for no gain. They **stay here**. `fkit-claude-init.sh:847` is a string a running program
    prints; that is the line the rule is about.
  - **⚠️ Coordination risk, since the split is real:** the count is now corrected in two tasks by two
    roles. **If 81 lands and 82 does not, the installer says eight and every doc says seven** — a worse
    inconsistency than today's. Whoever closes the second of the two should re-run the `seven` sweep
    across the whole repo before calling it done.
- **🔴 `PROJECT.md:8` and `:72` are NOT in this task — owner ruling 2026-07-19, honoring ADR-028:154.**
  Moved to [task 83](../0015-amend-project-brief-for-the-eighth-role/brief.md), producer-owned. **The architect does
  not rewrite the product brief's stance.**
  - **The authority: ADR-028:154-157**, follow-up 1 — the `PROJECT.md` amendment is the *"owner's or
    producer's call — **the brief is the product document, not the architect's**."*
  - **Why the "it's just a two-word count fix" argument failed, recorded because it nearly carried.**
    It is sound for `:8` (a plain count). It is **wrong for `:72`**, which reads *"a solid working set
    of **seven** roles with dedicated skills; hardening/polish is the current focus, **not breadth**"*
    — filed under *Conventions & constraints*, under *Stage: Prototype*. **The "not breadth" clause is
    a product constraint, and ADR-028 is the owner knowingly reversing it** (the ADR's own title says
    as much). Editing that line is not correcting a number; it is **restating the project's product
    stance** — precisely the case ADR-028:154 carves out.
  - **Both sites moved together**, not just `:72`. Splitting one file across two tasks for two adjacent
    lines would be the real absurdity.
- **⚠️ ADR-028, ADR-029 and ADR-030 are decided but NOT built.** The doc must describe them as
  **decisions taken**, not as structure that exists. This is the single highest-risk part of the task:
  getting it wrong makes the canonical architecture document claim a tester role is present, which is a
  worse error than the stale count it replaces. **ADR-026 and ADR-027 do not carry this hazard** —
  026 records a "no", 027 a convention already in force — so the constraint is specifically about
  028/029/030.
- **Precedent for shape: task 58**, [`refresh-architecture-docs-for-tool-relaxation.md`](../0068-refresh-architecture-docs-for-tool-relaxation/brief.md)
  — same job (docs catching up to accepted ADRs), same owner, and its structure of *supersedes-this-
  claim* bullets is worth copying rather than reinventing.
- **Sprint call: Sprint 2, priority 82.** The stale-citation half is ordinary maintenance and would
  have sat on the Backlog board happily. **The wrong role count is what sprints it** — `architecture.md`
  and `PROJECT.md` are the documents every role is told to read before non-trivial work, so a factual
  error there propagates into other agents' reasoning rather than sitting quietly. Filed behind the
  live task 81 work; not urgent enough to preempt anything already in flight.
- **Risk: low-to-moderate.** Documentation only, no runtime surface. The real risk is not the edit but
  the tense — see the decided-not-built warning above.
- **Related, and a reason not to let this drift further:** ADR-029's own history is a case of a doc/
  reality gap going unnoticed (the reused ADR number, task 81). The longer the architecture doc lags
  the decision record, the more of that there is to find.
- **Evidence sources:** `ai-agents/knowledge-base/architecture.md:4,82` and its full ADR-reference set;
  `ai-agents/knowledge-base/PROJECT.md:8,72`; `ls ai-agents/knowledge-base/decisions/`
  (adr-023 … adr-030); the 2026-07-19 vault lint; task 58 as precedent.
