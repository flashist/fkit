# Documentation drift audit — 2026-07-11

> Evidence-first sweep of every doc, comment, and printed string in the repo against the code on
> disk (working tree at `2e63c2f`). Written by fkit-architect. Every finding carries a `path:line`
> citation and was verified against the source; claims I could not verify are marked as open
> questions rather than asserted. **No fixes were applied** — this is a findings document.

## TL;DR

Two structural changes landed in code and **almost no prose kept up**:

1. **The flavor dispatch inverted.** Bare `fkit` now runs the **Claude Code** flavor; Omnigent moved
   to `fkit omnigent`; `fkit claude` survives only as a legacy alias (`install.sh:87-103`).
   Essentially every doc still says the opposite.
2. **The Claude interaction model was replaced.** "One lead session that is also the coder and wears
   `/fkit-agent-<role>` hats" became **role-locked sessions**: a deterministic terminal menu →
   `claude --agent fkit-<role> --settings <skillOverrides>`, with every non-owned skill turned *off*
   (`claude/fkit-claude.sh:75-103,151-199`). The six `fkit-agent-*` hat skills were **deleted**; a
   7th agent, `fkit-lead` (the team room), was **added**.

The blast radius is wide because fkit's docs *are* its product: agent prompts and context files are
what the agents read to know how to behave. **Stale prose here is not cosmetic — it is a stale
runtime.** Root `AGENTS.md` is the sharpest case: Codex reads it natively during the adversarial
pass, so the adversarial reviewer is currently briefed that fkit is Omnigent-only.

**The one doc that is fully current is `claude/scaffold/CLAUDE.md`** — it correctly describes the
role lock, the menu, and the team room. Use it as the reference for what the others should say.

---

## Severity 1 — decision records that are now false

These matter most. An ADR is what future work is told *not* to re-litigate; a false ADR actively
misleads, and unlike a README nobody re-reads it to notice.

### ADR-001 — falsified by the repo, and its own re-raise trigger has fired
- **Claim** (`adr-001:9-12`): "`package.json` … declares only npm registry metadata … with **no
  `bin`, `scripts`, or `dependencies` block** (confirmed: `grep '"scripts"' package.json` returns
  nothing)."
- **Reality**: `package.json:4-9` has a four-entry `scripts` block (`release`, `release:minor`,
  `release:major`, `release:dry`); `package.json:3` is `0.1.30`, bumped every release by
  `bin/release.mjs`.
- **Claim** (`adr-001:26-29`): "**stop bumping/publishing `package.json`'s `version`**." The repo
  bumps it every release (`Release v0.1.28/29/30` in `git log`).
- **The trigger fired**: `adr-001:51-53` — "re-raise only if … otherwise giv[ing] `package.json`
  install semantics — at that point this ADR should be revisited or superseded."
- `architecture.md:239-245` records the owner's ruling that this is *fine* (nothing is published to
  the registry, so the trap ADR-001 warned about doesn't apply) and explicitly recommends an ADR
  addendum — **which was never written**. So the reasoning exists but lives in the wrong document.
- **Action: supersede or amend ADR-001.** Needs the owner. Status stays `accepted` today.

### ADR-008 — its own amendment is already stale
Records as *the decision* a mechanism that has since been deleted:
- `adr-008:106-108` — "**Hat skills `/fkit-agent-<role>` for all six roles**" → deleted; no
  `claude/skills/fkit-agent-*` exists.
- `adr-008:114-117` — "`/fkit-agent-reviewer` therefore runs an independence check first" → the
  skill is gone; independence is now *structural* (a `fkit reviewer` session is a fresh, role-locked
  context), which is a **stronger** outcome than the ADR argued for.
- `adr-008:119-120` — the `/fkit-agent-wiki` hat → deleted.
- `adr-008:108-109`, `:24`, `:30-32` — `fkit claude <role>`, "the session is the team lead — and the
  coder by default" → superseded.
- **Unrecorded anywhere**: the `fkit-lead` team-room agent, the terminal role menu, and the
  `skillOverrides` skill lockdown — the last of which is a genuinely new *structural enforcement*
  mechanism that strengthens ADR-008's own central argument (tool allowlists > prompt rules).
- **Action: this needs a new ADR (role-locked sessions + skill lockdown), not a patch.** It is a real
  architecture decision that was settled implicitly in code. Needs the owner.

### ADR-004 / ADR-005 / ADR-007 — in force, implemented, but scope-blind
All three are omnigent-path-only since ADR-008 (`adr-008:72-74`), but **none of them says so** —
each header reads plain `accepted`. A reader landing on ADR-005 first is told "every agent carries a
vendored `query` copy," which is false for the now-default flavor. *(ADR-006 is clean — correctly
marked superseded by ADR-007.)*
- **Action**: add a one-line scope note to each. Low effort, prevents a recurring misread.

---

## Severity 2 — actively misleading operational docs

| Where | Stale claim | Reality |
|---|---|---|
| `README.md:8,24-25,35-39,100` | `fkit` = Omnigent; `fkit claude` = Claude | **Inverted** (`install.sh:90-103`) |
| `README.md:59-62`, `CLAUDE.md:23-26` | "your interactive session is the team lead *and* the coder" | Sessions are role-locked; `fkit-lead` is explicitly a **non-doer** (`claude/agents/fkit-lead.md:22-26`) |
| `AGENTS.md:7-24` | fkit is "an Omnigent-based team … each a scoped-skill Omnigent bundle"; "every agent carries its own vendored `query` skill" | Dual-runtime since ADR-008; Claude flavor has one `/fkit-query`. **AGENTS.md never received the ADR-008 update that CLAUDE.md got.** Codex reads this file. |
| `claude/README.md:19-65,94-109` | Hat skills, "three ways to reach a role", `fkit claude`, 6-agent table | All superseded; `fkit-lead` absent; the role-lock mechanism — the flavor's central invariant — is **undocumented here**, though `architecture.md:394` and `CLAUDE.md:13-14` both cite this file as authoritative |
| `omnigent/README.md:50-57,79-84` | Whole "Install & run" section: bare `fkit` launches the team | Now `fkit omnigent`. The word "claude" appears **nowhere** in this README |
| `omnigent/fkit-reconnect.sh:94,100`<br>`fkit-team-restart.sh:121` | Recovery hint: "start your team first (**fkit**)" | Bare `fkit` starts Claude and never starts an Omnigent server. **This strands a user mid-incident** — the one stale string with real operational cost |
| `architecture.md:72,88-90,99` | "`fkit-team` — config.yaml only, **no skills of its own**" / "Only `fkit-team` is prompt-only" | It has two: `omnigent/fkit-team/skills/{reconnect-agents,restart}/` |
| `architecture.md:380-396` | Claude addendum: "six subagent definitions", "17 skills", lead-is-coder, skills are "thin dispatchers" | 7 agents, 19 skills, role-locked, skills are role-owned procedures |
| `architecture.md:82,357-360` | "`CLAUDE.md`/`AGENTS.md` still generic scaffold text" (Risk 5) | **Resolved** — both filled in; the task is in `tasks/done/`. Dead risk still listed as live |
| `PROJECT.md:26-40,55-60,69-77,92-96` | 6-agent team; lead-session model; `fkit claude`; "six bundles"; the ADR-001 metadata-only constraint | All superseded (see above) |

---

## Severity 3 — wrong counts and rosters (user-facing output)

- `omnigent/fkit-init.sh:212-217` — prints `6 agents (.fkit/agents/):` above a list of **five**,
  omitting `adversarial-reviewer` and `team`. Actual: **7** vendored (`vendor-agents.sh:22-26`).
  Two errors in one block.
- `omnigent/fkit-init.sh:9,40` — "the six agent bundles" / "vendored the 6 agent bundles".
- `install.sh:6` — "the six agent bundles"; also never mentions that it installs the Claude flavor,
  which the launcher it writes 80 lines later makes the **default**.
- `claude/fkit-claude-init.sh:145-151` — "Six roles", list omits `lead`, so a user never learns menu
  option 7 exists. `:17` still says next step is `claude` / `fkit claude`.
- `omnigent/README.md:13-20` — team table omits `initiate-project`, `survey-project`, and the entire
  `fkit-team` row.
- `omnigent/fkit-team/config.yaml:14` — documents a **`fkit team` subcommand that has never
  existed**; it would now fall through to the Claude launcher.

---

## Severity 4 — latent break (not a doc issue)

**`install.sh:42`** — the `chmod +x` loop lists `fkit.sh fkit-init.sh fkit-reconnect.sh
vendor-agents.sh validate-bundles.sh sync-vendored-skills.sh` but **omits
`fkit-team-restart.sh`**, while `omnigent/fkit.sh:116` hard-errors if that file isn't executable. It
works today only because git mode `100755` survives `tar`/`cp -R`. Every sibling script is
belt-and-braces chmod'd; this one was forgotten when added. **Fix regardless of the doc work.**

---

## An open design question — two sources of truth for the skill lock

Not drift, but the two are held consistent only by hand:

- **`claude/fkit-claude.sh:75-86`** (`skills_for_role`) — grants every role `fkit-team fkit-query` +
  its own procedures, enforced via `--settings` skillOverrides.
- **`claude/agents/fkit-*.md` `skills:` frontmatter** — omits `fkit-team` for six of seven agents
  (only `fkit-lead.md:8` has it).

Empirically (verified from a live `fkit architect` session): the **`--settings` overrides are what
govern a `fkit <role>` session** — `/fkit-team` is available despite not being in
`fkit-architect.md`'s `skills:`. But a **spawned subagent** (Agent tool, e.g. reviewer → architect)
never runs `fkit-claude.sh`, so no `--settings` applies and the frontmatter is the only list in
play.

So the two lists govern *different invocation paths* and currently agree only by luck. Nothing is
broken today (`fkit-team` is a signpost skill; nobody misses it in a consult). But this is exactly
the kind of split that diverges silently.

**Open question for the owner:** is the frontmatter `skills:` field intended as the authority for
spawned consults, with the shell as the authority for sessions — or should one derive from the
other? I have not changed either; picking one is an architecture call, not a cleanup.

---

## Knowledge-base hygiene: work that is done but still tracked as pending

- `tasks/backlog/rollout-adr-004-fixed-consult-titles.md` — **complete in code.** Verified:
  `title="wiki-consult"` at `omnigent/fkit-adversarial-reviewer/config.yaml:87`,
  `fkit-producer/config.yaml:137`, `fkit-architect/config.yaml:123`, `fkit-coder/config.yaml:122`.
- `tasks/backlog/give-every-agent-direct-wiki-query-access.md` — **complete in code.** All 6 bundles
  carry a byte-identical `skills/query/SKILL.md` (single md5). Its Context also quotes a root
  `CLAUDE.md` rule that **no longer exists** ("all wiki reads and writes go through the fkit-wiki
  agent") — `CLAUDE.md:34-38` now says the opposite.
- `tasks/backlog/verify-onboarding-flow-end-to-end.md` — verifies the **`.fkit/run` / Omnigent**
  path, which is no longer the default onboarding.
- `tasks/backlog/document-consult-chain-envelope.md` — premise is the Omnigent spawn+inbox headless
  `-p` envelope. The default flavor now uses synchronous `Agent` consults with a prompt-enforced
  2-hop budget. The doc it asks for would now need to cover **two** envelopes.
- `sprints/plan-sprint-1.md:19-32` — tasks 12 and 13 marked `🔲 Backlog` but done. `:3-5` says "the
  six agents already exist". **`:130-132` claims "nothing in this sprint has been committed to
  git"** — false. Most importantly: **the sprint plan has no awareness of ADR-008 or the Claude port
  at all**, while all its top priorities are Omnigent-path work.

*Task-file moves and sprint re-planning are the producer's call, not mine — flagged, not actioned.*

## The wiki is behind

`ai-agents/wiki-vault/.wiki-watermark` = `f7b23f4`, HEAD = `2e63c2f`. ADR-005/006/007/**008** are
un-ingested, and `wiki/systems/fkit.md:7` still opens *"fkit is a distributable Omnigent-based team
of AI agents"*. A `/fkit-wiki-sync` is needed **after** the source docs are corrected — syncing now
would just ingest the drift.

---

---

# Owner direction (2026-07-11) — and what it changes

The owner has ruled, in this session:

1. **The role-locked-session model is settled.** → needs an ADR.
2. **Omnigent is legacy and will be removed** in one of the next changes. Claude Code native +
   Codex sidekick is the model going forward.
3. **ADR-001 is unresolved** — needs further investigation. Left open.
4. The existing sprints/tasks are leftovers from the abandoned Omnigent-focused sprint; the team
   worked without tasks/sprints after switching. They can be **reset**, as can the docs/ADRs, once
   the Omnigent code is gone.

**This invalidates most of the remediation above.** Do **not** fix the Omnigent-side drift
(`omnigent/README.md`, `fkit-init.sh` counts, the reconnect/restart hints, `fkit team` subcommand,
ADR-003/004/005/006/007 scope notes, the `install.sh:42` chmod bug). That is all sunk cost — those
files are being deleted. Fixing them is work whose output is a `git rm`.

## ⚠ The removal is NOT `rm -rf omnigent/` — the Claude flavor depends on it in three places

This is the most important finding in this document, and it is not a doc issue.

| # | Dependency | Evidence | Consequence of naive deletion |
|---|---|---|---|
| 1 | **The shared scaffold lives in `omnigent/`.** `claude/fkit-claude-init.sh:20` sets `scaffold="$here/../omnigent/scaffold"` and copies the `ai-agents/` tree (`:30`) **and `AGENTS.md`** (`:46`) from it. `claude/scaffold/` contains *only* `CLAUDE.md`. | `claude/fkit-claude-init.sh:20,24,30,46`; `find claude/scaffold` = 1 file | **Claude init hard-fails** at `:24`: `error: shared scaffold not found`. Every new project setup breaks. |
| 2 | **The installer hard-requires `omnigent/fkit.sh`.** | `install.sh:32-33` — `if [ ! -f "$TMP/src/omnigent/fkit.sh" ]; then … exit 1` | **`curl \| sh` install breaks outright** for everyone. |
| 3 | **Self-update lives in `omnigent/fkit.sh`.** The generated launcher routes `update\|upgrade\|reconnect\|restart-team` there; its own comment says so: *"Self-update stays on the omnigent script, which owns it."* | `install.sh:88-94` | **`fkit update` breaks**, and with it the only update path. |

### A live gap this exposed, independent of the removal

**The default flavor does not self-update at all.** `claude/fkit-claude.sh` contains no update check
(the only `update` hits are its help text). Self-update — the throttled `git ls-remote` +
re-exec — exists *solely* on the Omnigent path (`omnigent/fkit.sh`). So today, a user who only ever
runs `fkit` (the default, Claude) **never receives updates** unless they happen to run `fkit update`,
which quietly routes through the legacy script.

This is a real defect in the *current* product, not a consequence of the planned removal. It also
means self-update is not merely "moved" during the removal — **it has to be built for the Claude
path**, or consciously dropped.

## Recommended sequence

1. **Record the decision (owner + architect).** "Claude Code native + Codex sidekick is the only
   runtime; Omnigent is removed" — an ADR that **supersedes ADR-008** and retires ADR-003/004/005/
   006/007 as omnigent-only mechanics. Same ADR (or a second) records the **role-locked session +
   skillOverrides lockdown** model. *Do this first: it is the thing that authorizes deleting the
   rest, and it is the one artifact that must survive the purge.*
2. **Extract-then-delete, in that order** (coder, from a real task brief):
   a. Move `omnigent/scaffold/` → `claude/scaffold/` (it becomes the *only* scaffold; it already
      owns `CLAUDE.md`, it needs `ai-agents/` + `AGENTS.md`).
   b. Decide and implement self-update for the Claude path — port from `omnigent/fkit.sh`, or drop
      it deliberately. **This is a design call, not a mechanical move.**
   c. Rewrite `install.sh` to install one flavor.
   d. *Then* `git rm -r omnigent/`.
3. **Rewrite the docs from the post-removal reality** — not before. The surface shrinks massively:
   root `README.md`, `CLAUDE.md`, **`AGENTS.md`**, `claude/README.md`, `architecture.md`,
   `PROJECT.md`. Derive from `claude/scaffold/CLAUDE.md`, the one doc that is currently correct.
4. **Reset `ai-agents/tasks/` + `ai-agents/sprints/`** (producer's call, owner-invoked).
5. **Wiki sync — last**, once the docs are true. Syncing earlier just ingests the drift.

## What survives the purge

Worth being deliberate here — "reset the docs and ADRs" should not mean losing the *reasoning*:

- **ADR-002** (archive pre-Omnigent design docs) — runtime-independent; keep.
- **ADR-008** — becomes **historical**, but it is the record of *why* the project left Omnigent.
  Supersede it; do not delete it. A future reader asking "why isn't this on Omnigent?" deserves the
  answer.
- **ADR-001** — unresolved by owner ruling; carry forward as an open question, do not purge.
- **ADR-003/004/005/006/007** — omnigent-only mechanics; retire with the code, but mark them
  `superseded — omnigent removed` rather than deleting, so the ADR numbering stays honest.
- The **`ai-agents/` file contracts** — these were ADR-008's designated portability layer, and they
  are the reason the port was cheap. They survive unchanged.

## Open questions still on the table

1. **Self-update on the Claude path: port, or drop?** (§ above) — a genuine design decision, and the
   one item in the removal that isn't mechanical.
2. **`skills:` frontmatter vs `skills_for_role()`** — which is authoritative for spawned consults?
   (§ "An open design question") — survives the Omnigent removal untouched; still needs a call.
3. **ADR-001** — owner says further investigation needed. Open.
</content>
