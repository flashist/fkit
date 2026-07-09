# fkit — Architecture

> **Second pass, via `inspect`** (2026-07-09), extending the initiation-time `survey-project` output.
> The first pass documented the six agent bundles and the `.fkit/run`-launches-producer-directly
> flow. Since then a real install/update/orchestration layer landed (`fkit-team`, the global `fkit`
> command, self-update, the `bin/release.mjs` release pipeline) that the first pass never saw. This
> revision folds that in and corrects everything it made stale. Every claim is grounded in a
> `path:line` reference or an explicit owner answer (this session); anything the code couldn't answer
> is listed as an open question instead of guessed.

## Overview and purpose

fkit is **not an application** — it is a distributable, [Omnigent](https://omnigent.ai)-based **team
of AI agents for software development**: a producer, a coder, a reviewer (with an adversarial second
opinion), an architect, and a wiki librarian, plus (new since the first survey) a thin **team root**
that stands the other six up as one durable workspace. This repository (`github.com/flashist/fkit`)
**is the framework itself** — its "source code" is agent bundles (YAML config + markdown skill
playbooks), POSIX shell install/orchestration scripts, a small Node release script, and documentation
— not a running service. A consuming project installs `fkit` once as a global command and runs it
against that project's own repo (`omnigent/README.md:39-49`, `install.sh:1-13`).

The project is in **prototype stage**, aimed at a user-friendly startup sequence and a first working
set of agents with dedicated skills (`.fkit/intake.md:8`, `ai-agents/knowledge-base/PROJECT.md`
"Conventions & constraints"). Per the owner (this session): the near-term goal is now substantially
delivered — **`fkit-team` is the primary entry point** (superseding the older
`.fkit/run`-launches-producer-directly path, which still exists as a secondary/direct single-agent
path, not the recommended one).

## System context and external dependencies

- **Runtime: [Omnigent](https://omnigent.ai)** — the external "meta-harness" CLI that loads a bundle
  (`config.yaml` + `skills/`) and runs it on a declared harness/model
  (`omnigent/fkit-producer/config.yaml:32` — `executor.type: omnigent`, `harness: claude-sdk`). fkit
  itself has no application dependencies — `package.json:1-24` is still npm metadata plus a small
  `scripts` block for *maintaining fkit*, not for consumers (see Build/run/release below).
- **Model providers**: Claude (`harness: claude-sdk`, five of the seven bundles including `fkit-team`)
  and OpenAI/Codex (`harness: codex`, `fkit-wiki` and `fkit-adversarial-reviewer`), each configured
  once via `omnigent setup`.
- **Git** — the working substrate every agent operates on; agents run `git` read-only in normal
  operation and are barred from committing/pushing without explicit ask (prompt rule, not sandboxed).
- **GitHub, over the network — corrected from the first survey.** The first pass claimed "no network
  calls" for the whole system; that's no longer true. Three distinct things now hit the network:
  1. **Install**: `install.sh` fetches a tarball from `codeload.github.com/<repo>/tar.gz/<ref>`
     (`install.sh:24-25`).
  2. **Self-update**: every normal `fkit` invocation does a *throttled* (default hourly) check against
     `github.com/<repo>` via `git ls-remote` (preferred) or the GitHub commits API
     (`omnigent/fkit.sh:34-40`), and — unless `FKIT_NO_AUTO_UPDATE=1` — **silently re-runs
     `install.sh` and re-execs itself** on a newer commit (`omnigent/fkit.sh:133-145`). This is a
     real, if throttleable, auto-update-from-a-remote-branch mechanism with **no signature/checksum
     verification** beyond plain HTTPS — flagged as an open question below.
  3. **Version banner**: fetches the raw `VERSION` file from GitHub to show a human version number in
     the "newer available" hint (`omnigent/fkit.sh:47-49`).
  `FKIT_NO_UPDATE_CHECK=1` disables all network use for (2)/(3); a **source checkout** (this repo
  itself — detected by `.git` or root `package.json` present, `omnigent/fkit.sh:52`) is never
  auto-updated, only updated via `git`.
- **No database, no ports opened by fkit itself, no user-facing API.** Omnigent runs its own local web
  UI server (a separate concern — `fkit` just discovers its URL via `omnigent host status --json` and
  opens a tab, `omnigent/fkit.sh:145-183`).

## High-level architecture — components and responsibilities

```
fkit repo root
├── omnigent/                     canonical agent bundles + orchestration scripts ("the framework")
│   ├── fkit-producer/            config.yaml + skills/  (initiate-project, task-done, task-cancelled)
│   ├── fkit-coder/                config.yaml + skills/  (plan-task, process-review, process-stateful-review)
│   ├── fkit-reviewer/             config.yaml + skills/  (review, stateful-review)
│   ├── fkit-adversarial-reviewer/ config.yaml only (prompt-only, no skills/)
│   ├── fkit-architect/            config.yaml + skills/  (inspect, design-spec, evaluate-approach,
│   │                                                       record-decision, survey-project)
│   ├── fkit-wiki/                 config.yaml + skills/  (query, ingest, lint, sync)
│   ├── fkit-team/                 config.yaml only — NEW: thin root orchestrator, no skills of its own
│   ├── scaffold/                  starter ai-agents/ tree + CLAUDE.md/AGENTS.md/PROJECT.md for a NEW project
│   ├── fkit.sh                    NEW: the installed global `fkit` command's real logic (self-update + team launch)
│   ├── fkit-init.sh               idempotent project setup (scaffold + context files + vendor); called BY fkit.sh
│   ├── vendor-agents.sh           copies omnigent/fkit-* (all seven, glob-matched) → <project>/.fkit/agents/
│   └── validate-bundles.sh        pre-flight bundle validation (YAML + omnigent.spec.load)
├── bin/release.mjs                NEW: zero-dependency release script (bump/commit/tag/push), run via `npm run release`
├── VERSION                        NEW: single source of truth for fkit's own version, kept in sync with package.json
├── install.sh                     curl|sh entry point → installs ~/.local/share/fkit + ~/.local/bin/fkit
├── ai-agents/                     fkit's OWN working structure (this repo dogfoods itself)
├── CLAUDE.md / AGENTS.md          root context files the claude-sdk / codex harnesses inject (still generic scaffold text — see Risks)
├── README.md                      public quickstart — STALE relative to omnigent/README.md (see Risks, high priority)
└── .fkit/                         (gitignored) vendored copy of omnigent/fkit-* for THIS repo + .fkit/run, .fkit/team-session, .fkit/intake.md
```

Each of the **seven** bundles (`fkit-producer/coder/reviewer/adversarial-reviewer/architect/wiki` plus
the new `fkit-team`) is self-contained: `config.yaml` (executor/harness, `os_env`, guardrails, spawn
capability, full system prompt) plus, for six of them, a `skills/` directory of Omnigent-native skills.
`fkit-team` and `fkit-adversarial-reviewer` are prompt-only (no `skills/`). No shared/base config
exists (Omnigent has no `extends`); each `config.yaml` duplicates its guardrail block, though
`fkit-team`'s guardrails differ deliberately (see Cross-cutting concerns).

| Agent | Harness | Skills | Role |
|---|---|---|---|
| fkit-team | claude-sdk | *(none — prompt-only)* | **NEW.** Root orchestrator: stands up the other six as named, durable child sessions; never itself plans/codes/reviews (`omnigent/fkit-team/config.yaml`) |
| fkit-producer | claude-sdk | initiate-project, task-done, task-cancelled | product/sprint planning, task lifecycle (`omnigent/fkit-producer/skills/`) |
| fkit-coder | claude-sdk | plan-task, process-review, process-stateful-review | sole source-write authority |
| fkit-reviewer | claude-sdk | review, stateful-review | lead code review, REVIEW-ONLY |
| fkit-adversarial-reviewer | **codex** | *(none — prompt-only)* | independent second-opinion review, deliberately a different model |
| fkit-architect | claude-sdk | inspect, design-spec, evaluate-approach, record-decision, survey-project | architecture/design/ADRs, no implementation |
| fkit-wiki | **codex** | query, ingest, lint, sync | sole gateway to `ai-agents/wiki-vault/` |

(Corrects the first survey's skills table: `fkit-producer` does carry `initiate-project` as a real
skill directory — `omnigent/fkit-producer/skills/initiate-project` — the first pass's component table
omitted it even though its own "Key flows" section described it correctly.)

## Runtime topology

There is still no long-running fkit-owned service, but the **entrypoint and session model changed
materially**:

### The new primary path: `fkit` → one durable team session

```
install.sh (curl|sh, once)
  → ~/.local/share/fkit/omnigent/*  (resources: bundles, scaffold, scripts)
  → ~/.local/bin/fkit               (thin launcher, execs the installed fkit.sh)

fkit  (run inside any project directory, every time)
  → throttled self-update check (network, unless disabled) → maybe re-exec fresh code
  → FKIT_SETUP_ONLY=1 fkit-init.sh <project>   (idempotent: scaffold + CLAUDE.md/AGENTS.md + vendor .fkit/agents/)
  → fresh project only: .fkit/interview (terminal intake) → .fkit/intake.md
  → resume-or-create ONE fkit-team session, cached in .fkit/team-session
       (discovers the real web-UI URL via `omnigent host status --json`, since 6767 is only a default)
  → omnigent run [--resume <id>] .fkit/agents/fkit-team [-p <bootstrap seed>]
```

`fkit-team`'s own first turn then spawns the six workers as **named standby children** (`sys_session_create`
per agent, `title` = short role name, idempotent — checked via `sys_session_list` first) so they show
up individually and directly-chattable in the web UI's Subagents panel
(`omnigent/fkit-team/config.yaml` prompt, "First-turn standby bootstrap"). On resume it re-checks the
roster and does nothing if all six are present — it never re-bootstraps or duplicates
(`omnigent/fkit-team/config.yaml` "On resume — stay quiet"). This is confirmed **live** in this repo:
`.fkit/team-session` exists and holds a real conversation id.

### The secondary path: single-agent direct launch

`.fkit/run [producer|coder|reviewer|architect|wiki|adversarial-reviewer]` (default `producer`,
written by `fkit-init.sh`) still launches exactly one agent directly, with no team root
(`omnigent/fkit-init.sh:141-186`). It still carries its own fresh-project detection (uninitialized
`PROJECT.md` → run `.fkit/interview` → seed the producer into `initiate-project`) — **duplicated**
logic now that `fkit.sh` does the equivalent intake-and-seed step itself (`omnigent/fkit.sh:155-158`
vs `omnigent/fkit-init.sh:167-181`); the two don't currently share code (open question below on
whether that duplication is deliberate or drift).

### Inter-agent consultation — spawn + inbox, now confirmed at two hops

Unchanged mechanism: `sys_session_create(config_path=".fkit/agents/fkit-<name>", ...)` →
`sys_session_send` → end turn → wake on inbox → `sys_read_inbox()` once
(`omnigent/README.md:16-24`). Requires the bundles vendored under the caller's `.fkit/agents/`
(verified byte-identical to canonical `omnigent/fkit-*` via `diff -rq`, including `fkit-team`, which
`vendor-agents.sh`'s `fkit-*` glob picks up automatically even though its own comments/echoed output
still say "six" — minor, harmless doc/behavior drift, noted as an open item, not fixed here).

**Materially updated from the first survey**: `omnigent/README.md`'s "Status & caveats" section now
states the core collaboration is **verified live on Omnigent 0.4.0**, explicitly including **one-hop
and two-hop consults**, not just one-hop (`omnigent/README.md:143-146`). The narrower, still-open
caveat is specifically **deep chains under a fully *headless* `-p` run** — a spawned consultant that
itself consults another agent completes fine interactively but "may not finish under headless `-p`"
(`omnigent/README.md:147-149`), with the recommendation to drive headless/CI work via the Omnigent
server REST API instead, or keep consults one-hop. **This directly updates the scope of the
in-flight Sprint 1 task "Document the consult-chain envelope"** — the envelope is now: one-hop ✅,
two-hop interactive ✅, deep-chain-headless ❓ (unverified) — see Risks.

```mermaid
flowchart TB
  subgraph Install & update
    I[install.sh] -->|writes| SH["~/.local/share/fkit"]
    I -->|writes| BN["~/.local/bin/fkit"]
    BN -->|throttled check + auto-update| GH[(GitHub)]
  end
  subgraph Per-project session
    F[fkit command] --> T[fkit-team root]
    T -->|sys_session_create x6, named, idempotent| P[producer]
    T --> C[coder]
    T --> R[reviewer]
    T --> AR[adversarial-reviewer]
    T --> A[architect]
    T --> W[wiki]
  end
  subgraph Consultation (spawn+inbox, one- and two-hop verified interactively)
    P <-->|product<->technical| A
    C -->|design consistency| A
    R -->|adversarial pass| AR
    P -->|wiki lookups| W
    C --> W
    R --> W
    AR --> W
    A --> W
  end
```

## Data model and state

Everything below the previous survey's table is unchanged; additions since:

| Path | Owner | Purpose |
|---|---|---|
| `~/.local/share/fkit/omnigent/*` | installer | global install of resources (bundles, scaffold, scripts) — **outside any project**, shared across every project you run `fkit` in |
| `~/.local/share/fkit/.version` | installer / self-update | installed `version`/`sha`/`repo`/`ref` — self-update compares against this |
| `~/.local/share/fkit/.latest`, `.update-check` | self-update (fkit.sh) | cached "newer version seen" + throttle timestamp — avoids a network call on every launch |
| `~/.local/bin/fkit` | installer | thin global launcher, execs the installed `fkit.sh` |
| `.fkit/team-session` (gitignored, per-project) | fkit.sh | cached conversation id of the durable `fkit-team` root session — the mechanism that makes `fkit` resumable instead of proliferating sessions |
| `.fkit/intake.md` (gitignored, per-project) | `.fkit/interview` (terminal script), read by producer's `initiate-project` | fresh-project terminal intake answers |
| `.omnigent/config.yaml` (gitignored, per-project) | `fkit-init.sh` | sets `auto_open_conversation: false` so summoning 6-7 agents doesn't open 6-7 browser tabs (`omnigent/fkit-init.sh:60-73`) |
| `VERSION` (repo root, **tracked**) | `bin/release.mjs` | single source of truth for fkit's own version; kept in sync with `package.json.version` |

`ai-agents/knowledge-base/PROJECT.md` is now filled in (this repo passed initiation); the
`fkit:uninitialized` / placeholder-title tests no longer trip for this repo.

## Key flows

**1. Fresh-project onboarding (current, primary path)**: `curl install.sh | sh` (once, global) → `fkit`
(per project) → throttled self-update → `FKIT_SETUP_ONLY=1 fkit-init.sh` (scaffold, context files,
vendor all seven bundles) → fresh-project terminal intake (`.fkit/interview` → `.fkit/intake.md`) →
resume-or-create the one `fkit-team` session → team root bootstraps the six named children → owner
picks a teammate in the Subagents panel (typically the producer on a fresh project, which self-detects
the uninitialized `PROJECT.md` and runs `initiate-project`) (`omnigent/fkit.sh` end-to-end,
`omnigent/README.md:39-99`).

**2. Project initiation** (producer's `initiate-project` skill): unchanged from the first survey —
interview the owner on gaps not already answered by `.fkit/intake.md`, spawn `fkit-architect` to run
`survey-project`, write `PROJECT.md` from both, end with a readiness summary.

**3. Self-update** (new): every non-source-checkout `fkit` launch does a throttled `git ls-remote`
(or GitHub API) check; on a newer commit, unless `FKIT_NO_AUTO_UPDATE=1`, it silently re-runs
`install.sh` and re-execs itself with `FKIT_SKIP_UPDATE=1` to avoid a double-check
(`omnigent/fkit.sh:120-166`). `fkit update`/`fkit upgrade` does this on demand, unconditionally, and
refuses on a source checkout (told to `git pull` instead) (`omnigent/fkit.sh:88-98`).

**4. Release** (new): `npm run release` (→ `node bin/release.mjs`) bumps `VERSION` + `package.json`
(patch by default; `--minor`/`--major`/`--version`/`--no-bump`), commits, pushes the current branch,
creates + pushes an annotated `v<version>` tag — **no npm-registry publish** (`bin/release.mjs:1-30`,
confirmed no `npm publish` call anywhere in the script). This is the mechanism behind the `Release
vX.Y.Z` commits visible in `git log`. **Owner-confirmed this session**: bumping `VERSION`/
`package.json.version` via this pipeline, ahead of any real npm-registry publish, is deliberate and
fine — the trap ADR-001 warned about (a stale-but-versioned *npm listing*) doesn't apply here because
nothing is actually published to the registry; the version bump only drives the GitHub-tag-based
self-update/version-banner mechanism, not `npx`. ADR-001 itself is not contradicted by this — worth a
short ADR addendum/supersession if the owner wants it written down formally (recommended, not done
here — see Report below).

**5. Normal task flow**: unchanged from the first survey (still not yet exercised in this repo) —
producer writes a task brief → coder `plan-task` → implements → reviewer `review`/`stateful-review`
(delegating to `fkit-adversarial-reviewer`) → `ai-agents/reviews/<task-id>.md` → coder's
`process-stateful-review` → producer's `task-done` moves the brief only on owner sign-off.

**6. Wiki access**: unchanged — every agent reaches `ai-agents/wiki-vault/` only via `fkit-wiki`.

## Build / run / test

Still **no build, no automated test suite**. Updated inventory:

- **Validate bundles**: `omnigent/validate-bundles.sh` — unchanged, still not CI-wired (confirmed:
  `.github/workflows/` does not exist; ADR-003 approved this but the implementation task
  (`ai-agents/tasks/backlog/add-ci-validate-bundles.md`) is still in the backlog, not built).
- **Vendor agents**: `omnigent/vendor-agents.sh <project-root>` — now copies all seven `fkit-*` dirs.
- **Set up a project**: `omnigent/fkit-init.sh <project-root>` (idempotent; also called internally by
  `fkit.sh` with `FKIT_SETUP_ONLY=1`).
- **Run the team (recommended)**: `fkit` (global command) in any project root.
- **Run one agent directly**: `.fkit/run <name>` (vendored) or `omnigent run omnigent/fkit-<name>`
  (canonical, source checkout only).
- **Release fkit itself (new)**: `npm run release[:minor|:major|:dry]` → `node bin/release.mjs`.
  Zero npm dependencies (`bin/release.mjs:1-27` — uses only `node:child_process`, `node:fs`,
  `node:path`, `node:url`). Requires a git `origin` remote; fails fast otherwise.

## Cross-cutting concerns

- **Guardrails, per bundle.** The six workers share an identical `blast_radius` policy (unchanged from
  the first survey). **`fkit-team`'s guardrails differ deliberately**: it adds `spawn_bounds`
  (`max_dispatches_per_turn: 7`, capping both `sys_session_create`/`sys_session_send` so the
  six-way standby bootstrap can't be exceeded or bypassed) and a day-long `ask_timeout: 86400` (so an
  ASK survives the human stepping away), and — deliberately — **no**
  `headless_subagent_purpose_guard`, because that would deny fkit-team's purpose-less standby/chat
  dispatches (`omnigent/fkit-team/config.yaml` guardrails block + inline comments).
- **Role boundaries are still prompt-enforced, not sandboxed** — all seven agents run `sandbox: none`.
  Unchanged, named, accepted risk (see Risks).
- **Self-update is a new trust surface.** A normal `fkit` invocation can silently fetch and execute
  code from `github.com/flashist/fkit@main` (re-running `install.sh` piped through `sh`) with no
  signature or checksum verification beyond HTTPS/TLS — see Risks.
- **Shared config DRY problem**: unchanged — `CLAUDE.md`/`AGENTS.md` still hand-synced; both are
  **still the generic scaffold placeholder text** at this repo's root (`CLAUDE.md:5-8`,
  `AGENTS.md:5-8`, `CLAUDE.md:27-29`) even though `PROJECT.md` and this doc are filled in — see Risks
  (owner should confirm whether this is intentional: `PROJECT.md` says "don't duplicate
  [architecture.md], read it for anything below product-brief altitude," which is a coherent reason to
  leave `CLAUDE.md` thin, but the literal placeholder text — "_fill in_" — reads as unfinished rather
  than deliberately thin).
- **Consultation loop-safety**: unchanged; reinforced by the newly-confirmed two-hop-interactive
  verification.
- **Secrets hygiene**: unchanged repeated rule across agents.

## Notable conventions and deliberate decisions

- **Bundle = config.yaml (+ optional skills/)**, one directory per agent — now seven, not six;
  `fkit-team` is deliberately skill-less (it only orchestrates, never "does").
- **`fkit-team` is additive, not a rewrite** — it reaches the six existing bundles via the exact same
  `spawn: true` / `config_path` mechanism they already use to consult each other, so the six workers
  and their consult logic are untouched by its introduction (`omnigent/fkit-team/config.yaml`
  header comment).
- **One global install, resumable per-project sessions.** Deliberate move from "launch an agent" to
  "open your project's durable team workspace" — `.fkit/team-session` is the resumability anchor, a
  new durable-state convention not present in the first survey.
- **Self-update is opt-out, not opt-in**, on the theory that a CLI tool should stay current by default;
  mitigated by throttling, a source-checkout carve-out, and explicit env toggles
  (`FKIT_NO_AUTO_UPDATE`, `FKIT_NO_UPDATE_CHECK`).
- **Release without registry publish**: `bin/release.mjs` manages git tags/commits/version files only;
  it deliberately does not touch the npm registry, keeping ADR-001's "no npx installer yet" decision
  intact while still giving the project real, tagged releases (owner-confirmed this session).
- Vendoring / `fkit:uninitialized` marker / historical-docs-archived conventions: unchanged from the
  first survey.
- **Citation hygiene note**: this doc's first cut of the doc-drift finding above misattributed a
  "still says six" citation to `omnigent/vendor-agents.sh:9`, which doesn't actually contain that text
  — caught by fkit-producer verifying the claim before writing the resulting task brief, not by a
  re-read here. Left in as a reminder that every citation in this doc should be independently
  spot-checked before being relied on, this one included.

## Risks, technical debt, and open questions

**Top risks:**

1. **Self-update has no integrity verification beyond HTTPS.** A default `fkit` launch can silently
   pull and execute `install.sh` from `github.com/flashist/fkit@main` on a throttle. This is a
   reasonable default for solo/early use but is worth an explicit owner decision once fkit has
   external users: is plain-HTTPS-from-a-fixed-repo/ref an accepted trust model long-term, or does it
   need a checksum/signature step before wider distribution? Not urgent at prototype stage; flagging
   as a forward-looking open question, not a defect.
2. **No structural enforcement of agent boundaries** (`sandbox.write_paths` not adopted) — unchanged
   from the first survey, still no timeline. Now sharpened: `omnigent/README.md:150-152` explicitly
   names `sandbox.write_paths` as the mechanism and flags "verify it doesn't break model/git access on
   your platform first" as a prerequisite investigation step, which hasn't been done.
3. **Deep multi-hop consult chains under fully headless `-p` runs remain the one genuinely unverified
   case** — narrowed further this pass. One-hop and two-hop consults are now confirmed **live** in
   interactive sessions (`omnigent/README.md:143-146`); only chains beyond that, run fully headless,
   are unverified, with a documented workaround (drive via the Omnigent server REST API instead).
   **This should directly inform Sprint 1's "Document the consult-chain envelope" task** — its scope
   is narrower and more resolved than when that task brief was written.
4. **Two small, low-stakes pieces of doc/behavior drift** — now ticketed as
   `ai-agents/tasks/backlog/fix-agent-count-doc-drift-and-fresh-detection-dup.md` (owner: fkit-coder):
   (a) `fkit-init.sh`'s comment, echo, and `printf` summary block still say "six agent bundles"/"6
   agents" though `.fkit/agents/` now vendors seven (including `fkit-team`) — and the summary block is
   worse than a stale count, it lists only 5 of the 7 real bundles (`omnigent/fkit-init.sh:9`, `:209-214`).
   **Correction from this doc's first cut of this finding**: `vendor-agents.sh` does *not* carry a
   stale count — it enumerates the vendored destination directory via `ls` rather than asserting a
   number; the earlier `omnigent/vendor-agents.sh:9` citation here was wrong and has been removed
   (caught during task triage — see Notable conventions note below on citation hygiene). (b)
   `.fkit/run`'s fresh-project detection duplicates logic `fkit.sh` now also does itself, via a
   **different signal** (`PROJECT.md` state vs. `.fkit/agents` presence) — likely harmless today, but
   exactly the kind of thing that silently diverges later; the ticket asks for either consolidation or
   an explicit cross-reference comment in both files.
5. Root `CLAUDE.md`/`AGENTS.md` still carry literal scaffold placeholder text in "Project Overview" and
   "Architecture" despite `PROJECT.md` being filled — see Cross-cutting concerns. Possibly intentional
   (avoid duplicating `PROJECT.md`/`architecture.md`), possibly an oversight; worth a one-line owner
   confirmation.

**Resolved this pass:**
- ~~Priority: harden consultation topology vs. expand skill set~~ — resolved by `plan-sprint-1.md`
  (owner-ranked: onboarding verification → consult-envelope doc → CI; skill-set expansion explicitly
  deferred).
- ~~Is `fkit-team`/`fkit.sh` deliberate and primary?~~ — owner-confirmed this session: yes, `fkit-team`
  is now the primary entry point.
- ~~Does the release-version-bump practice contradict ADR-001?~~ — owner-confirmed this session: no;
  ADR-001's concern was a stale *published npm listing*, and `release.mjs` never publishes to the
  registry. Recommend (not performed here) a short ADR addendum recording this explicitly, since a
  future reader of ADR-001 alone would reasonably wonder the same thing.

- ~~Root `README.md` was stale relative to the real install flow~~ — rewritten this session (owner
  request) to describe the `install.sh` → global `fkit` → `fkit-team` flow correctly; the six-agent
  table, direct `.fkit/run` path, and layout diagram now match `omnigent/README.md` and this doc.

**Carried over, unchanged:**
- `sandbox.write_paths` timeline (risk #2 above).
