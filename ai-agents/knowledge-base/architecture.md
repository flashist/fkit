# fkit — Architecture

**The architecture of the system as it exists today** (2026-07-11, post-Omnigent-removal). One
runtime, seven roles, no orchestrator, everything coordinated through files in git.

Every claim carries a `path:line` reference. Anything the code could not answer is an open question
(§11), not a guess.

---

## 1. What fkit is

fkit is **not an application.** It is a **distributable team of role-scoped AI agents for software
development** — producer, coder, reviewer, adversarial reviewer, architect, wiki librarian, and a
"team room" lead — that a developer installs once and then runs inside *their own* project.

This repository **is the framework**. Its "source" is:

- **agent definitions** — markdown + YAML frontmatter (`claude/agents/fkit-*.md`, 7 files)
- **skill playbooks** — markdown procedures (`claude/skills/fkit-*/SKILL.md`, 21 dirs)
- **POSIX shell** — the installer, the launcher, the per-project setup
- **one small Node script** — `bin/release.mjs`, to cut a release
- **a scaffold** — `claude/scaffold/`, the `ai-agents/` tree a consuming project receives

There is no build step, no server, no database, no runtime state outside files, and **no test suite**
(see §9.1).

The product thesis (`ai-agents/knowledge-base/PROJECT.md:18-24`): AI coding assistants collapse
product decisions, implementation, and review into one undifferentiated chat loop with **no
separation of authority**. fkit's answer is a small **team** with distinct authority, coordinating
over **files in git** rather than shared runtime state.

**Stage:** prototype, dogfooded — this repo runs its own agents on its own `ai-agents/` tree
(`CLAUDE.md:16-24`).

---

## 2. System context and external dependencies

| Dependency | How it's used | Where |
|---|---|---|
| **Claude Code CLI (`claude`)** | **The runtime.** Every role session is `claude --agent fkit-<role> --settings <role>.json`. Hard requirement — the launcher exits **127** without it. | `claude/fkit-claude.sh:257-262,357` |
| **Codex CLI (`codex`)** | The adversarial second opinion, for genuine **model diversity**: `codex exec --sandbox read-only --cd "$PWD" -`. **Required, but warned — never walled** (owner ruling, Sprint 2 task 3): a Codex outage must not lock the owner out of their own team. | `claude/fkit-claude.sh:274-285`; `claude/skills/fkit-review/SKILL.md:57` |
| **git** | The substrate every agent reads. Agents are barred from committing/pushing unprompted — a **prompt rule, not a sandbox** (`CLAUDE.md:26-30`). | — |
| **GitHub, over the network** | (a) install: tarball from `codeload.github.com`; (b) self-update **check**: throttled `git ls-remote` or the commits API; (c) the version string: raw `VERSION`. All time-boxed to 5 s and silent on failure. | `install.sh:32,55-62`; `claude/fkit-claude.sh:64,74-93` |
| **Node (ESM)** | Only to cut a release (`npm run release`). **Zero npm dependencies.** | `package.json:3-9`, `bin/release.mjs` |

**fkit opens no ports, exposes no API, and stores no data outside the project's own files.**

The single-vendor coupling (Claude Code + Codex, no fallback runtime) is a **decision, taken
knowingly** — [ADR-009](decisions/adr-009-claude-code-native-is-the-only-runtime.md)
§Consequences. See §9.2.

---

## 3. Repository structure

```
fkit/
├── claude/                        THE RUNTIME
│   ├── agents/fkit-*.md             7 Claude Code subagent definitions (frontmatter + system prompt)
│   ├── skills/fkit-*/SKILL.md       21 /fkit-* skills — the role procedures
│   ├── scaffold/                    what a consuming project gets: ai-agents/, CLAUDE.md, AGENTS.md
│   ├── fkit-claude.sh               the `fkit` command: self-update, preflight, role menu, launch
│   ├── fkit-claude-init.sh          idempotent per-project setup (scaffold + .claude/ refresh + intake)
│   └── README.md                    the flavor write-up
├── install.sh                     curl|sh entry point — installs claude/ + the `fkit` launcher
├── bin/release.mjs                bump VERSION+package.json → commit → tag v<x.y.z> → push (ADR-011)
├── VERSION / package.json         version single source of truth + release scripts
├── ai-agents/                     fkit's OWN working structure (dogfooded — see §6)
└── README.md / CLAUDE.md / AGENTS.md
```

Local, gitignored, not part of the design surface: `.fkit/` (per-project generated state), the
fkit-managed `.claude/agents/fkit-*.md` + `.claude/skills/fkit-*/` copies, `.codex-tmp/`
(`.gitignore:1-20`).

---

## 4. Components

### 4.1 The seven roles

Each role is **one file**: `claude/agents/fkit-<role>.md` — YAML frontmatter (`name`, `description`,
`tools`, `color`, `initialPrompt`) plus a system prompt in the body. There is no shared base class;
each prompt restates its own boundaries.

| Agent | `tools` allowlist | Authority |
|---|---|---|
| `fkit-producer` | Read, Grep, Glob, Bash, Write, Edit, Agent, Skill | product & sprint planning, task briefs. **No source writes.** Never moves task files. |
| `fkit-coder` | …+ `EnterPlanMode`, `ExitPlanMode` | **Sole source-write authority.** Plan-gated. |
| `fkit-architect` | Read, Grep, Glob, Bash, Write, Edit, Agent, Skill | design specs, ADRs, surveys. **Never implements; never writes the wiki.** |
| `fkit-reviewer` | Read, Grep, Glob, Bash, Write, Edit, Agent, Skill | review-only; writes **only** under `ai-agents/reviews/`. |
| `fkit-adversarial-reviewer` | Read, Grep, Glob, Bash, Skill | findings only. **Structurally write-free — a leaf.** |
| `fkit-wiki` | Read, Grep, Glob, Bash, Write, Edit, Skill | **exclusive write gateway** for `ai-agents/wiki-vault/` (ADR-005). A leaf. |
| `fkit-lead` | Read, Grep, Glob, Bash, Skill, `Agent(<the six others>)` | the **team room** (menu 7). Routes; **does no work** — no Write/Edit. |

Evidence: `claude/agents/fkit-coder.md:8`, `claude/agents/fkit-adversarial-reviewer.md:7`,
`claude/agents/fkit-lead.md:6`, `claude/agents/fkit-wiki.md:8`.

The **tool allowlist is harness-enforced** — it is the strongest boundary in the system. The
adversarial reviewer and the lead genuinely cannot write files; that is structural, not a request.

> **There is no `skills:` frontmatter.** It was dropped from all 7 agents per
> [**ADR-012**](decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) §1: Claude
> Code treats it as a *preload hint*, not an allowlist, so it enforced nothing. Keeping it — even
> generated — would have preserved a field that *looks* like the invariant and isn't. **Do not
> re-add it.**

### 4.2 The 21 skills — where the procedures live

Skills (`claude/skills/fkit-*/SKILL.md`) are the durable, role-owned **procedures**; the agent
prompts are the role's *character*. Every role-specific skill opens with a `⛔ Owner:` banner naming
the one role allowed to execute it (e.g. `claude/skills/fkit-review/SKILL.md:8`). Only `fkit-query`
carries no banner — it is universal by design.

| Owner | Skills |
|---|---|
| producer | `initiate-project`, `task-plan`, `task-done`, `task-cancelled`, `status` |
| coder | `plan-task`, `process-review`, `process-stateful-review` |
| architect | `survey-project`, `inspect`, `design-spec`, `evaluate-approach`, `record-decision` |
| reviewer | `review`, `stateful-review` |
| adversarial reviewer | `adversarial-review` |
| wiki | `wiki-ingest`, `wiki-lint`, `wiki-sync` |
| everyone | `team` (the roster/signpost), `query` (read-only wiki reads — ADR-005) |

**Ownership is declared in exactly one place: `skills_for_role()` at
`claude/fkit-claude.sh:199-210`.** That shell function is the **single source of truth** (ADR-012
§1) and the only place role→skill ownership is expressed anywhere in the codebase.

---

## 5. Runtime topology

### 5.1 One process. One role. No orchestrator.

There is no fkit daemon, no root agent, no session broker, no message bus. **Claude Code owns the
session lifecycle**; fkit is a launcher and a set of prompts.

```
install.sh   (curl | sh — once)
   └─► ~/.local/share/fkit/{claude/, .version}   +   ~/.local/bin/fkit  (thin launcher)

fkit                                    (run in any project directory)
   ├─ self-host re-exec into ./claude/fkit-claude.sh if this IS an fkit checkout   :36-43
   ├─ `fkit update` → re-run install.sh                                            :104-118
   ├─ else: throttled update CHECK → prints "run fkit update" (never auto-execs)   :121-141
   ├─ fkit-claude-init.sh <proj>  (idempotent: scaffold, .claude/ refresh, intake) :249-253
   ├─ preflight:  claude REQUIRED (exit 127)  ·  codex required-but-WARNED         :257-285
   ├─ fresh project? → skip the menu, seed the PRODUCER into /fkit-initiate-project:288-307
   ├─ deterministic role MENU (1-7 — an if/else; no LLM anywhere in the routing)   :311-345
   └─ exec claude --agent fkit-<role> --settings .fkit/settings/<role>.json        :357
```

Two roles at once = **two terminal tabs**. Deliberately not automated
(`claude/fkit-claude.sh:19-21`).

### 5.2 The role lock — and precisely what it does and does not enforce

A session is locked **two ways**:

1. **`--agent fkit-<role>`** — the role's system prompt **and tool allowlist**. Harness-enforced.
2. **`--settings` carrying `skillOverrides`** — `build_settings()`
   (`claude/fkit-claude.sh:226-238`) writes `{"skillOverrides":{"<not-owned>":"off",…}}` to
   `.fkit/settings/<role>.json`. Every `fkit-*` skill the role does not own is **hidden from the `/`
   menu and unrunnable by name**. Non-fkit skills (the project's own, the user's own) are never
   touched.

**The scope of that lock is the load-bearing detail**, pinned down by ADR-012 §2:

```
skill availability in ANY context (session OR spawned consult)
  = all installed skills − the skillOverrides of the SESSION THAT LAUNCHED THE PROCESS
```

- **In a role SESSION the lock is structural.** `fkit coder` genuinely cannot run `/fkit-review`.
  **This is the property reviewer independence rests on, and it holds.**
- **In a spawned CONSULT it is advisory.** A subagent inherits the *caller's* overrides, **not its
  own** — empirically confirmed from live spawns (ADR-012 §Context). Only the agent's system prompt
  and the skill's `⛔ Owner:` banner stand between a confused subagent and someone else's procedure.
  The banner is therefore **load-bearing, not decorative** — it may not be deleted as "redundant."
- **Do not restate this as a blanket defect.** "The skill lock is only prompt-enforced" is *false of
  a session* and *true of a consult*; a finding must say **which path** it means (ADR-012 §Residual
  risks).

**`CONSULT_SKILLS` (`claude/fkit-claude.sh:221`) is the escape valve** that inheritance forces:
`fkit-survey-project` and `fkit-query` stay **on for every role**, because `/fkit-initiate-project`
has the **producer** spawn the architect to run the survey — with it off, initiation could not run
its own architecture survey. The accepted cost: any role session can invoke `/fkit-survey-project`
by name. **The set is deliberately minimal; adding to it is a decision, not a convenience**
(ADR-012 §3).

### 5.3 Consultation — the Agent tool, two hops, no cycles

Cross-role work is a **consult**, never a role switch (ADR-010 §4). `@fkit-<role> <question>` spawns
a fresh context that answers and returns; the asker keeps the decision that is theirs.

The rules are carried in every agent prompt ("Consult rules — hard"):

- an invocation from the owner's session is **hop 0**; every consult message must state *"you are
  being consulted at hop N of 2"*;
- **at hop 2 you may not consult anyone** — answer from the code, or return an open question;
- **never consult your invoker**, or anyone already named in the chain (the chain is passed along);
- **genuinely new architecture decisions escalate to the owner** — never settled implicitly between
  agents.

**This topology is prompt-enforced, and knowingly so**: Claude Code ignores `Agent(type)` allowlists
inside *subagent* definitions, so the hop budget cannot be made structural (ADR-010 §Consequences).
It *is* structural in one place — `fkit-lead`'s own `Agent(...)` list (`claude/agents/fkit-lead.md:6`).

```mermaid
flowchart TB
  O((owner)) -->|fkit menu| S["role SESSION<br/>claude --agent fkit-role<br/>+ skillOverrides — structural lock"]
  S -->|Agent tool: hop 1| P[producer] & C[coder] & A[architect] & R[reviewer] & W[wiki] & AR[adv-reviewer]
  A <-->|product context| P
  C -->|design consistency| A
  R -->|design intent| A
  R -->|Bash| X[["codex exec --sandbox read-only"]]
  AR -->|Bash| X
  W ==>|EXCLUSIVE writes| V[(ai-agents/wiki-vault)]
  P -.->|reads via /fkit-query| V
  C -.-> V
  A -.-> V
```

---

## 6. Data model — everything is a file in git

There is no database. The **`ai-agents/` tree is the entire coordination state**, and the file
contract every role shares (`ai-agents/README.md`).

| Path | Written by | Contents |
|---|---|---|
| `knowledge-base/PROJECT.md` | producer (`initiate-project`) | the prose product brief. **One of the only two documents allowed at the knowledge-base root** (ADR-013). |
| `knowledge-base/architecture.md` | **architect** (`survey-project` / `inspect`) | this file — the other root document. Nothing else lives at the root. |
| `knowledge-base/conventions/*.md` | whoever owns the convention; **new ones need the owner** | **standing rules the project reads on a normal run and obeys** — `task-status-vocabulary.md`, `status-report-format.md`. Prescriptive, maintained in place, **never dated**. [`conventions/README.md`](conventions/README.md) |
| `knowledge-base/decisions/adr-NNN-*.md` | **architect** (`record-decision`) | ADRs — settled decisions: *why* the rule is what it is. The **"Re-raise only if"** field is what stops future reviews re-litigating a settled decision. No README: the `adr-NNN-<slug>` sequence *is* the convention. |
| `knowledge-base/incidents/YYYY-MM-DD-*.md` | any session | postmortems of **fkit's own runtime/tooling** — not product bugs (those are task briefs). [`incidents/README.md`](incidents/README.md) |
| `knowledge-base/reports/YYYY-MM-DD-*.md` | any session; evaluations from the **architect** | dated artifacts of work performed — audits, verifications, evaluations, executed plans. [`reports/README.md`](reports/README.md) |
| `knowledge-base/history/` | architect | superseded **design docs** — docs that no longer describe reality. **Archive, don't delete** (ADR-002). Narrow, *not* the general archive. [`history/README.md`](history/README.md) |
| `sprints/sprint-N.md` | producer | sprint plan + status table; completed sprints move to `sprints/done/` |
| `tasks/{backlog,done,cancelled}/*.md` | producer **writes**; **only the owner moves**, via `/fkit-task-done` and `/fkit-task-cancelled` | task briefs |
| `reviews/<task-id>.md` | reviewer **and** coder — a two-party ledger | findings + dispositions + **accepted residuals**. This is the loop-prevention memory: it carries decision state across review rounds so settled tradeoffs are not re-litigated. |
| `wiki-vault/` | **`fkit-wiki` only** | Karpathy LLM-wiki: `schema.md` (conventions), `index.md` (catalog), `log.md` (activity), `wiki/{features,systems,decisions,tasks}/` |

**Three invariants govern this tree:**

1. **Wiki reads are decentralized; wiki writes are exclusive to `fkit-wiki`** (ADR-005). Any context
   may follow the read-only `/fkit-query` procedure. **No other agent or session ever writes under
   `ai-agents/wiki-vault/`.** No exceptions.
2. **The task status vocabulary is closed**
   (`ai-agents/knowledge-base/conventions/task-status-vocabulary.md:11-21`): Backlog · In progress ·
   Blocked · Done · Cancelled · Moved. Nothing else is valid. `Done` and `Cancelled` are **owner-only**.
3. **The knowledge-base root holds exactly two documents — `PROJECT.md` and `architecture.md`**
   ([ADR-013](decisions/adr-013-knowledge-base-root-holds-the-living-canon.md)). They are the
   project-defining pair: *what we are building* and *how it is built*. **Everything else is filed by
   kind** — `conventions/` (standing rules: *how we do it*), `decisions/` (ADRs: *why*), `incidents/`
   (what happened to our runtime), `reports/` (work performed at a point in time), `history/`
   (superseded designs). The checkable forms: **`ls knowledge-base/*.md` returns exactly those two
   names**, and **a dated filename never lives at the root or in `conventions/`** — a dated name means
   "a record of a moment". Records are never *superseded*, so they are never relocated once filed —
   only designs go stale.

**Generated, gitignored, per project:** `.fkit/settings/<role>.json` (the skill lockdown),
`.fkit/interview` + `.fkit/intake.md` (terminal intake), `.fkit/tmp/adversarial-prompt.md` (the
Codex prompt), and the fkit-managed `.claude/agents/fkit-*.md` + `.claude/skills/fkit-*/` copies —
**edit `claude/`, never these** (`claude/fkit-claude-init.sh:49-60`).

**Global, per install:** `~/.local/share/fkit/.version` (`version`/`sha`/`repo`/`ref`),
`.update-check` (throttle stamp), `.latest` (`install.sh:55-72`, `claude/fkit-claude.sh:66-72`).

---

## 7. Key flows

**1 — Install.** `curl … install.sh | sh` → fetch the tarball → **sanity-gate the fetch** on
`claude/fkit-claude.sh`, the one file the installer cannot work without (`install.sh:34-37`) → copy
**only `claude/`** into `~/.local/share/fkit/` (`:42-43`) → `rm -rf "$SHARE/omnigent"`, which is what
makes an upgrade from an older fkit clean rather than leaving a dead runtime on disk (`:49`) → write
`.version` (`:55-72`) → generate `~/.local/bin/fkit`.

That generated launcher is a **direct `exec`** of `$SHARE/claude/fkit-claude.sh` (`install.sh:101`) —
there is no flavor dispatch and `update` is **not** intercepted; it falls through to the launcher,
which owns self-update. Four subcommands are **retired and fail loudly** rather than being passed
through to `claude` as a stray argument: `omnigent`, `claude`, `reconnect`, `restart-team`
(`install.sh:86-95`).

**2 — Fresh-project onboarding.** `fkit` → init scaffolds `ai-agents/` + `CLAUDE.md` + `AGENTS.md`,
**never clobbering** an existing one (`claude/fkit-claude-init.sh:26-47`) → `.fkit/interview` asks 6
questions **on the terminal, before any LLM starts**, writing `.fkit/intake.md`; it is tty-safe and
skips cleanly when headless (`:62-123`) → the launcher detects the uninitialized `PROJECT.md`
(`claude/fkit-claude.sh:288-294`), **skips the menu**, and seeds the producer straight into
`/fkit-initiate-project` (`:295-307`) → the producer interviews the owner, **spawns the architect to
run `fkit-survey-project`**, and writes `PROJECT.md`.

**3 — Task flow.** producer `/fkit-task-plan` (decompose to the **smallest independently shippable**
units, with dependencies recorded) → coder `/fkit-plan-task` (**Claude Code plan mode** — an owner
approval gate) → implement → reviewer `/fkit-review` or `/fkit-stateful-review` → coder
`/fkit-process-stateful-review` (verify each finding; **defect vs frontier-move**; fixes gated on
the owner) → **the owner** runs `/fkit-task-done`.

**4 — Review + the adversarial pass.** The reviewer runs its own pass, then assembles a
findings-only prompt plus an inline diff into `.fkit/tmp/adversarial-prompt.md` and pipes it to
`codex exec --sandbox read-only --cd "$PWD" -` (`claude/skills/fkit-review/SKILL.md:38,57`).
**Degradation is loud and mandatory:** no Codex → the review **leads with**
`⚠️ [NOT model-diverse — INCOMPLETE]` as the first thing a reader sees, not a footnote
(`:128-135`; `claude/skills/fkit-adversarial-review/SKILL.md:57,111`). The failure this guards
against is a same-model "second opinion" — the model that wrote the code reviewing its own work, and
the *unearned confidence* that produces.

**5 — Self-update** ([ADR-009](decisions/adr-009-claude-code-native-is-the-only-runtime.md) §3).
Two paths, and the split is the design:

- **`fkit update`** — an **explicit verb**. Re-runs the canonical `install.sh` for `$repo@$ref`
  (`claude/fkit-claude.sh:104-118`). Refuses to run in a source checkout ("update it with `git
  pull`").
- **the automatic check** — throttled (60 min default), **time-boxed to 5 s**, silent when current
  and silent when offline, and it **only ever prints**:
  `↑ fkit vX → vY is available. Run: fkit update` (`:121-141`).

**It never auto-updates and never re-execs itself** — deliberately unlike the Omnigent launcher it
replaces, which had no timeout and no `GIT_TERMINAL_PROMPT` guard (a credential-prompting repo would
hang the launcher indefinitely). Source checkouts are excluded entirely
(`_fkit_is_source_checkout`, `:72`), keyed only on markers `install.sh` never copies (`.git`, the
repo-root `package.json`).

**6 — Release** ([ADR-011](decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md)).
`npm run release` → `bin/release.mjs`: bump `VERSION` + `package.json` (patch by default), `git add
-A`, commit, push, annotated tag `v<version>`, push the tag. **No npm-registry publish**
(`bin/release.mjs:66`). **Version bumping is load-bearing** — self-update compares the installed sha
against the remote head and reports the version from `VERSION`.

---

## 8. History — fkit formerly ran on Omnigent

fkit originally shipped as [Omnigent](https://omnigent.ai) agent bundles under `omnigent/`.
[ADR-008](decisions/adr-008-claude-code-native-port-alongside-omnigent.md) added the Claude Code
native port **alongside** it (dual-runtime, hand-mirrored);
[**ADR-009**](decisions/adr-009-claude-code-native-is-the-only-runtime.md) superseded that and made
Claude Code native + Codex the **only** runtime. **`omnigent/` was deleted in Sprint 2** — 0 tracked
files remain (`git ls-files omnigent`), and `install.sh:49` actively cleans it out of pre-existing
installs.

This is recorded because it explains things that would otherwise look arbitrary:

- **Why the retired verbs fail loudly** (`install.sh:86-95`) instead of being silently dropped —
  `fkit omnigent`, `fkit claude`, `fkit reconnect`, `fkit restart-team` were all real commands.
  `reconnect` / `restart-team` existed *only* to paper over Omnigent orchestration failures.
- **Why self-update notifies rather than auto-updates** — a direct reaction to the Omnigent
  launcher's behavior (ADR-009 §3).
- **Why ADR-008 is kept and not deleted** — it is the record of *why fkit left Omnigent*.

**ADR-005's *rule* survives the removal and is in force** — reads decentralized, writes exclusive to
`fkit-wiki`. Only its Omnigent *mechanism* (per-bundle vendored skill copies) is gone. ADRs 003, 004,
006, and 007 describe Omnigent-only mechanics and are due to be marked superseded now that the code
is actually removed (ADR-009 §Related; tracked by
`ai-agents/tasks/backlog/knowledge-base-hygiene-post-omnigent.md`) — they are still marked
`accepted` today. See §9.5.

---

## 9. Risks and technical debt — the live ones

### 9.1 Zero automated verification (the top structural risk)

**There is no CI and no test suite.** No `.github/` directory exists. The project's only automated
check was `omnigent/validate-bundles.sh`, mandated by
[ADR-003](decisions/adr-003-ci-runs-validate-bundles.md) — **that script died with the Omnigent
removal, and ADR-003's CI never landed.** Nothing replaced it.

What now rests entirely on **manual verification**:

- `install.sh` — the `curl | sh` entry point. A bad landing breaks installation *including the
  self-update path that would ship the fix*. It cannot be verified by reading a diff; it must be
  installed from a ref into a clean `$HOME`.
- `claude/fkit-claude.sh` — the launcher: self-update, preflight, the menu, and `build_settings()`,
  which generates **the skill lockdown itself**. A silent regression here would degrade the one
  boundary that is genuinely structural (§5.2), and nothing would catch it.

Both are POSIX shell with no coverage of any kind. **This is a live, unmitigated risk**, not a
deferred nice-to-have: the two files with the highest blast radius in the repo are the two with the
least verification. A minimal `shellcheck` + a smoke install into a temp `$HOME` would close most of
it cheaply.

### 9.2 Single-vendor concentration — accepted, not a defect

fkit runs on Claude Code + Codex with **no fallback runtime**. If Claude Code makes a breaking
change, fkit has no second leg to stand on. **ADR-009 §Consequences takes this knowingly**, and it is
the main thing the decision buys its simplicity with. **A finding of the form "fkit only runs on one
vendor's CLI" is this decision, not a bug.**

### 9.3 The consult path's skill boundary is advisory

Stated precisely in §5.2 and settled in ADR-012 §2. The only mechanism that could make per-role skill
ownership real on the consult path is a **`PreToolUse` gate on the `Skill` tool** — **deferred, and
now priced**: ADR-012's decisions 2 and 3 exist *because* we don't have it.

**Open question, and it decides whether this is even fixable:** does the `PreToolUse` hook payload
expose the **calling subagent's identity**? If it does not, the hook cannot discriminate by role and
the option is not merely deferred but **unavailable** (ADR-012 §4). This must be established before
anyone plans the hook as the fix.

### 9.4 The `.claude/` copies are gitignored and destroyed on every launch

`claude/fkit-claude-init.sh:51-60` does an `rm -f` + `cp` of `fkit-*` agents and skills on every
single launch. **An edit made in `.claude/` instead of `claude/` is silently destroyed** — no
warning, no diff. (The self-hosting re-exec at `claude/fkit-claude.sh:36-43` exists precisely because
the *installed* snapshot would otherwise overwrite the checkout's own working tree with an older
copy of itself.) The rule is unconditional: **edit `claude/`, never `.claude/`.**

### 9.5 Residual drift

- **`claude/fkit-claude-init.sh:144` prints "Six roles"** and omits `lead`, immediately after copying
  **7** agent files (`:53-54`, `n_agents`). The count is a literal, not derived.
- **`claude/fkit-claude-init.sh:17`** still advertises `fkit claude` in its usage comment — a verb
  that now **hard-fails** (`install.sh:87-90`).
- **ADRs 003, 004, 006, 007 are still marked `accepted`** though the code they describe is deleted
  (§8). ADR-009 said to mark them superseded *when the code is actually removed* — that condition is
  now met.

---

## 10. Cross-cutting concerns

- **Secrets.** No credential is read, written, or stored by any part of fkit. No agent may put a
  secret in any artifact. `GIT_TERMINAL_PROMPT=0` on the update check
  (`claude/fkit-claude.sh:76`) exists so a credential-prompting remote can never hang the launcher.
- **Network.** Every network call is optional, time-boxed to 5 s, and silent on failure. Offline
  `fkit` must cost nothing and print nothing (`claude/fkit-claude.sh:56-58,64`).
- **Idempotence.** Both the installer and the per-project init are safe to re-run; init never
  clobbers an existing `ai-agents/`, `CLAUDE.md`, or `AGENTS.md`.
- **Determinism where it matters.** Role routing is an `if/else` (`claude/fkit-claude.sh:311-345`).
  **No LLM sits in the path that decides which role you get.**
- **Git authority.** No agent commits or pushes unprompted. This is a prompt rule in every agent
  definition — not a sandbox — and it is the one place fkit's boundaries depend entirely on
  instruction-following.

---

## 11. Open questions

1. **Does the `PreToolUse` hook payload expose the calling subagent's identity?** (§9.3.) This is the
   single question that decides whether the consult-path skill boundary is *fixable* or *permanently
   advisory*. It should be answered before any task proposes the hook.
2. **What is the intended verification story?** (§9.1.) ADR-003's CI died with its subject. Is a
   `shellcheck` + smoke-install CI in scope, or is manual verification the accepted permanent posture
   for a prototype? This is an owner call, not an architect's.
