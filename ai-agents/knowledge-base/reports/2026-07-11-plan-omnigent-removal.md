# Change plan — remove Omnigent, land Claude-native as the only runtime

> **Author:** fkit-architect, 2026-07-11. **Input for sprint planning** — the producer owns scoping,
> priority, sizing, and task briefs. This document supplies the *technical* sequence, the
> dependencies between the pieces, and where the risk is. It is not a sprint plan and does not
> assign or size anything.
>
> **Authorized by:** [ADR-009](../decisions/adr-009-claude-code-native-is-the-only-runtime.md),
> [ADR-010](../decisions/adr-010-role-locked-sessions-and-skill-lockdown.md).
> **Evidence:** [`2026-07-11-doc-drift-audit.md`](2026-07-11-doc-drift-audit.md).

## The one thing that must not be got wrong

**`omnigent/` is load-bearing for the Claude flavor today.** Deleting it first breaks the product in
three ways (scaffold, installer, self-update — see Phase 1). The sequence below is
**extract → build → rewrite → delete**, and the phases are genuinely ordered: Phase 4 is unsafe
before Phases 1–3.

The prize for getting the order right is that Phase 5 (docs) becomes cheap: you write the docs
**once, against the post-removal reality**, instead of correcting drift in files you are about to
delete. **Do not fix the Omnigent-side doc drift catalogued in the audit** — its output would be a
`git rm`.

---

## Phase 0 — Foundations (blocking, do first)

**0.1 — Extract the shared scaffold into `claude/`.**
`claude/fkit-claude-init.sh:20` reads `scaffold="$here/../omnigent/scaffold"` and pulls the
`ai-agents/` tree (`:30`) and `AGENTS.md` (`:46`) from it; `claude/scaffold/` holds only `CLAUDE.md`.
Move `omnigent/scaffold/ai-agents/` and `omnigent/scaffold/AGENTS.md` → `claude/scaffold/`, repoint
`fkit-claude-init.sh`, drop `omnigent/scaffold/CLAUDE.md` (the Omnigent-flavored one).
*Risk:* low. *Blocks:* Phase 4.
*Verify:* `fkit` in a scratch dir still scaffolds a complete project.

**0.2 — Build self-update for the Claude path.** Per ADR-009 §Decision 3: a **throttled check that
notifies**, not a silent fetch-and-exec. `claude/fkit-claude.sh` has **no update logic at all** today
— so this is new code, not a move. Port the throttle/`ls-remote` shape from `omnigent/fkit.sh`, drop
the auto-re-exec. Keep `fkit update` explicit.
*Risk:* **medium — this is the only non-mechanical piece of the removal.** It is also a **live bug
fix**: the default flavor currently never self-updates (audit §"A live gap"), so users on `fkit` have
been silently stuck on whatever version they installed.
*Blocks:* Phase 4.

**0.3 — Make Codex a checked prerequisite.** Per ADR-009 §Decision 2, Codex is now required, not
optional. Add a preflight check (installer and/or `fkit-claude.sh`, alongside the existing `claude`
check at `claude/fkit-claude.sh:122`). Consequently the `[claude-fallback — NOT model-diverse]`
degradation in `claude/skills/fkit-adversarial-review/SKILL.md` and `fkit-review/SKILL.md` is **no
longer a supported mode** — a review that cannot reach Codex is not a complete review.
*Open detail for the coder + owner:* whether the reviewer **hard-fails** or still emits a loudly
flagged partial. Recommend failing at **preflight** so it never gets that far, and leaving the
in-skill flag only as a last-resort safety net. *Risk:* low, but it changes review semantics —
worth an explicit owner nod at implementation time.

---

## Phase 1 — Rewrite the installer

Collapse `install.sh` to one flavor: drop the `omnigent/fkit.sh` existence gate (`install.sh:32-33`),
stop copying `omnigent/` (`:38-44`), and replace the flavor-dispatch launcher (`:87-103`) with a
direct exec of `claude/fkit-claude.sh`. `fkit update` now routes to the Phase 0.2 code.

Retire with it: the `omnigent` / `claude` subcommands, `update|upgrade|reconnect|restart-team`
forwarding to the Omnigent script, and the `install.sh:42` `chmod` loop (**including the
`fkit-team-restart.sh` omission the audit flagged — that latent bug is deleted, not fixed**).

*Risk:* **medium-high — this is the blast radius.** `install.sh` is the `curl | sh` entry point; a
mistake here breaks installation for everyone, including the self-update path that would deliver the
fix. **Verify by installing from a branch ref into a clean `$HOME` before this is considered done.**
*Depends on:* 0.1, 0.2, 0.3.

---

## Phase 2 — Delete `omnigent/`

`git rm -r omnigent/`. This removes: the 7 bundles, `fkit-team` (root orchestrator + its
`reconnect-agents`/`restart` skills), `fkit.sh`, `fkit-init.sh`, `vendor-agents.sh`,
`validate-bundles.sh`, `sync-vendored-skills.sh`, `fkit-reconnect.sh`, `fkit-team-restart.sh`, and
the per-project `.fkit/agents/` vendoring + `.fkit/run` machinery they generate.

Also drop `.omnigent/` handling and any `.gitignore` entries that only existed for the Omnigent path.
*Risk:* low **if and only if** Phase 0–1 landed; catastrophic if run early.
*Verify:* a clean clone + install + `fkit` + `fkit <role>` + a consult + a review, end to end.

---

## Phase 3 — Reconcile the skill-ownership source of truth (ADR-010 §5)

`skills_for_role()` (`claude/fkit-claude.sh:75-86`) becomes the **single** source of truth; the
`skills:` frontmatter in `claude/agents/*.md` is **generated from it or dropped**. Today they
disagree (the shell grants every role `fkit-team`; six of seven agent files omit it) and they govern
*different* paths — `--settings` for sessions, frontmatter for spawned consults. Nothing is broken
now; this closes it before it diverges into something that is.
*Risk:* low. *Independent of Phases 0–2* — can be done in parallel.

---

## Phase 4 — Rewrite the docs against the post-removal reality

Only now. Derive from **`claude/scaffold/CLAUDE.md`** — per the audit, the one doc that is currently
correct about the role-locked model.

| File | What it needs |
|---|---|
| **`AGENTS.md`** (root) | **Highest leverage.** Codex reads it natively during the adversarial pass, so it is currently briefing the adversarial reviewer that fkit is Omnigent-only (`AGENTS.md:7-24`). Rewrite for Claude-native + ADR-009/010. |
| `CLAUDE.md` (root) | `:23-26` still says "the interactive session is the team lead and the coder" — the superseded model. |
| `README.md` (root) | The flavor inversion (`:8,24-25,35-39`), the lead-session model (`:59-62`), the 6-agent table (missing `fkit-lead`), the `omnigent/` layout block. |
| `claude/README.md` | Largest single drift site: hat skills (`:24,41`), `fkit claude` (`:31,94-109`), 6-agent table (`:58-65`), and it **never documents the skill lockdown** — the flavor's central invariant. |
| `architecture.md` | Substantial rewrite: it is an Omnigent-shaped document with a stale Claude addendum (`:380-396`). Post-removal, the Claude flavor *is* the architecture. |
| `PROJECT.md` | Team list (no `fkit-lead`), the dual-runtime constraint, `fkit claude`, "six bundles". |

*Risk:* low. *Depends on:* Phase 2 (write once, against what actually exists).

---

## Phase 5 — Knowledge-base and wiki hygiene (last)

> **⚠ Correction (2026-07-13).** Two claims in this section were overtaken before it was executed; the
> original text is left standing as the record of what was planned. See the fuller note at **§D**.
> - **ADR-005 was *not* marked superseded outright.** Its Omnigent *mechanism* died; its *rule* — wiki
>   reads decentralized, writes exclusive to `fkit-wiki` — is **current law** (`../architecture.md`,
>   `CLAUDE.md`). Only **003, 004, 006, 007** were superseded outright.
> - **"ADR-001 stays open" is stale.** The owner ruled on 2026-07-11 and ADR-001 is now **superseded by
>   [ADR-011](../decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md)**.

- **Mark ADR-003/004/005/006/007 `superseded — Omnigent removed`** *(architect; do it in this phase,
  not earlier — an ADR should not claim to be superseded while its code still ships)*. **Keep the
  files.** Per ADR-009 §Related, delete nothing: ADR-008 in particular is the record of *why fkit
  left Omnigent*, and stripping it invites someone to re-litigate a decision already paid for.
- **ADR-001 stays open** — owner has flagged it for further investigation. It is currently *falsified
  by the repo* (`package.json:4-9` has the `scripts` block it says doesn't exist) and its own
  "re-raise only if" trigger has fired. Needs a decision, not a cleanup.
- **Reset `ai-agents/tasks/` and `ai-agents/sprints/`** — owner has ruled these are leftovers of the
  abandoned Omnigent sprint. *Producer's call, owner-invoked; task files move only via
  `/fkit-task-done` / `/fkit-task-cancelled`.* Note the audit found two backlog tickets
  (`rollout-adr-004-fixed-consult-titles`, `give-every-agent-direct-wiki-query-access`) are already
  **complete in code**, and several others (`verify-onboarding-flow-end-to-end`,
  `document-consult-chain-envelope`, `add-ci-validate-bundles`) have premises that die with Omnigent.
- **Wiki sync — genuinely last** (`/fkit-wiki-sync`, fkit-wiki only). The vault is at watermark
  `f7b23f4` vs HEAD `2e63c2f`; `wiki/systems/fkit.md:7` still opens *"fkit is a distributable
  Omnigent-based team"*. **Syncing before Phase 4 just ingests the drift.**

---

## Dependency graph

```
0.1 scaffold ─┐
0.2 self-update ─┼─→ 1. installer ─→ 2. delete omnigent/ ─→ 4. docs ─→ 5. KB + wiki sync
0.3 codex req ─┘

3. skill-ownership SoT ──(independent; any time)──┘
```

## Where the risk actually is

1. **`install.sh` (Phase 1)** — the `curl | sh` entry point. Breaking it breaks *installation itself*,
   including the update path that would ship the fix. Test against a clean `$HOME` from a branch ref.
2. **Self-update (0.2)** — new code, not a move; the only non-mechanical piece. Also a live bug fix.
3. **Ordering** — Phase 2 before Phase 0 breaks Claude init, the installer, and `fkit update` at once.

## Explicitly *not* in scope

- Fixing Omnigent-side doc drift, counts, or the `install.sh:42` `chmod` bug — **all deleted, not
  fixed**.
- Path-level hook enforcement of role boundaries — deferred hardening, per ADR-010 §Options.
- Anything about `npx fkit` / `package.json` semantics — that is ADR-001, still open.

---

# Appendix — the manifest

> Enumerated from the tree at `2e63c2f`, not from memory. The ADRs deliberately carry **no** file
> list (an ADR must stay true as files move); the manifest lives here, in a working doc meant to be
> consumed and discarded.

## A. DELETE — `omnigent/` (57 files, whole directory)

`git rm -r omnigent/` in **Phase 2**, after the extractions. Contents:

- **7 bundles** — `fkit-{producer,coder,reviewer,adversarial-reviewer,architect,wiki,team}/`
  (`config.yaml` + `skills/`), including the 6 vendored `query` copies and `fkit-team`'s
  `reconnect-agents` / `restart` skills.
- **Scripts** — `fkit.sh`, `fkit-init.sh`, `vendor-agents.sh`, `validate-bundles.sh`,
  `sync-vendored-skills.sh`, `fkit-reconnect.sh`, `fkit-team-restart.sh`.
- **`omnigent/README.md`**.
- **`omnigent/scaffold/`** — ⚠ **NOT a plain delete.** `scaffold/ai-agents/` and `scaffold/AGENTS.md`
  **move to `claude/scaffold/`** in Phase 0.1 first; only `scaffold/CLAUDE.md` (the Omnigent-flavored
  one) is genuinely dropped.

**Also removed, generated/ignored:** `.fkit/agents/`, `.fkit/run`, `.fkit/team-session`,
`.omnigent/` — plus their `.gitignore` entries.

## B. REWRITE — code (Phases 0–3)

| File | Change |
|---|---|
| `install.sh` | One flavor. Drop the `omnigent/fkit.sh` gate (`:32-33`), the `omnigent/` copy (`:38-44`), the `chmod` loop (`:42`), the flavor dispatch (`:87-103`). Add a Codex preflight. |
| `claude/fkit-claude-init.sh` | Repoint `scaffold=` (`:20`) to `claude/scaffold`. Fix `:17` next-step hint (`fkit claude` → `fkit`). Fix "Six roles" summary (`:145-151`) — it's 7, and omits `lead`. |
| `claude/fkit-claude.sh` | **Add self-update** (throttled check + notify; ADR-009 §3). Drop `fkit omnigent` from help (`:53`). |
| `claude/agents/fkit-*.md` | `skills:` frontmatter generated from `skills_for_role()` or dropped (ADR-010 §5). |
| `claude/skills/fkit-adversarial-review/SKILL.md`, `fkit-review/SKILL.md` | Codex-required: the `[claude-fallback]` degradation is no longer a supported mode (ADR-009 §2). |
| `package.json` | `description` still reads *"An Omnigent agent team for software projects…"*. |

## C. REWRITE — docs (Phase 4, all against the post-removal reality)

`AGENTS.md` *(highest leverage — Codex reads it)* · `CLAUDE.md` · `README.md` · `claude/README.md`
*(largest drift site)* · `architecture.md` *(substantial rewrite — it is an Omnigent-shaped doc)* ·
`PROJECT.md`. Derive from `claude/scaffold/CLAUDE.md`, the one currently-correct doc.

## D. ARCHIVE, don't delete — knowledge-base (Phase 5)

> **⚠ Correction (2026-07-13) — this section's routing was superseded before it was executed.**
> Recorded inline per `README.md` ("reports are not edited once written, except for factual corrections
> marked inline"); the original text below is left standing as the record of what was planned.
>
> [ADR-013](../decisions/adr-013-knowledge-base-root-holds-the-living-canon.md) now governs filing, and
> it overrules three things below:
> 1. **`history/` is for superseded *design docs* only** (ADR-002). Records don't go stale — designs do.
>    The evaluation and the verification were filed to **`reports/`**, not `history/`. `history/` gained
>    nothing.
> 2. **The 2026-07-10 incident stayed in `incidents/`.** Routing it to `history/` would have emptied
>    `incidents/` on the day it was formalized — it is a record of something that happened, and it does
>    not stop having happened because Omnigent is gone.
> 3. **ADR-005 was *not* marked flatly superseded.** Its Omnigent *mechanism* died; its *rule* — wiki
>    reads decentralized, writes exclusive to `fkit-wiki` — is current law (`../architecture.md`,
>    `CLAUDE.md`). Only **003, 004, 006, 007** were superseded outright. **ADR-001 did not "stay
>    open"**: it was superseded by
>    [ADR-011](../decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md).
>
> Executed as ADR-013 directs by task 10 (`knowledge-base-hygiene-post-omnigent`).

**`ai-agents/knowledge-base/history/` already exists for exactly this**, by the precedent of
[ADR-002](../decisions/adr-002-archive-pre-omnigent-design-docs.md) (*"archive superseded design docs,
don't leave them at root"*). Reuse it rather than deleting:

- `eval-vendored-query-skill-distribution.md` — omnigent-only evaluation → `history/`
- `restart-skill-verification-2026-07-10.md` — omnigent-only → `history/`
- `incidents/2026-07-10-subagent-runners-disconnected.md` — an *Omnigent* incident → `history/`
- **ADRs 003/004/005/006/007** — mark `superseded — Omnigent removed`. **Keep the files** (honest
  numbering). ADR-008 already marked superseded; **keep** — it is the record of why fkit left
  Omnigent. **ADR-001 stays open.**

## E. TASKS & SPRINTS — ⚠ "delete everything" would drop 4 live items

The owner's instinct to reset is right for **6 of 12** backlog tickets. But the audit found the rest
are not Omnigent debris. *Producer's call — flagged, not actioned; files move only via
`/fkit-task-done` / `/fkit-task-cancelled`.*

| Ticket | Disposition |
|---|---|
| `add-ci-validate-bundles` | **Dies** — `validate-bundles.sh` is deleted |
| `amend-subagent-disconnect-incident-doc` | **Dies** — Omnigent subagent disconnects |
| `document-consult-chain-envelope` | **Dies** — the spawn+inbox envelope; the Claude 2-hop envelope is now recorded in ADR-010 |
| `fix-agent-count-doc-drift-and-fresh-detection-dup` | **Dies** — those files are deleted |
| `remove-adversarial-reviewer-eager-spawn` | **Dies** — `fkit-team` is deleted |
| `give-every-agent-direct-wiki-query-access` | **Close as done** — complete in code (verified) |
| `rollout-adr-004-fixed-consult-titles` | **Close as done** — complete in code (verified) |
| **`add-task-plan-skill-to-producer`** | **KEEP.** Runtime-independent, and a **real gap today**: the Claude producer has `initiate-project` / `task-done` / `task-cancelled` but **no procedure for writing a task brief** — the thing it is most asked to do. |
| **`extend-initiate-project-fill-overview`** | **KEEP** — `/fkit-initiate-project` still exists and still has the gap. |
| **`bake-architecture-pointer-into-scaffold-templates`** | **KEEP, rescope** — retarget from `omnigent/scaffold/` to `claude/scaffold/CLAUDE.md`, which still has a `_fill in_` placeholder (`:7`). |
| **`formalize-knowledge-base-incidents-folder`** | **KEEP** — runtime-independent; and §D above depends on `history/`/`incidents/` conventions being settled. |
| **`verify-onboarding-flow-end-to-end`** | **KEEP, reframe** — its *premise* (verify `.fkit/run`) dies, but its *intent* becomes essential: after this removal, nothing is more worth verifying than a clean install → `fkit` → role session → consult → review. |

**Sprints:** `plan-sprint-1.md` is entirely Omnigent-path work and has no awareness of ADR-008/009/010
— archive it to `sprints/done/` (or `history/`) rather than deleting; it is the record of what was
attempted.

## F. WIKI — fkit-wiki only, and genuinely last

9 vault files reference Omnigent; `wiki/systems/fkit.md:7` still opens *"fkit is a distributable
Omnigent-based team"*. Watermark `f7b23f4` vs HEAD `2e63c2f`. **Do not sync before Phase 4** — it
would ingest the drift. Then `/fkit-wiki-sync` picks up ADR-009/010 and the rewritten docs.
</content>
