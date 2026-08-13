# Decide whether `.claude/` enters the structure-conformance surface — ADR, owner sign-off required

## ID
0255

## Sprint
Sprint 5

## Priority
Sprint 5 P15

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Nothing anywhere checks whether a project's `.claude/` matches the installed fkit version.**
Verified on disk 2026-08-08:

- **The structure spec has zero `.claude/` rows.** `grep -n '\.claude' claude/structure-spec.md`
  returns **nothing**. Inventory Table A (directories) and Table B (files) cover
  `ai-agents/**` plus root `CLAUDE.md` / `AGENTS.md` — and that inventory is the *entire* input to
  the check: `claude/skills/fkit-heal/check.sh` emits "one line per spec-inventory row, in table
  order" (`:23`). A path absent from the tables is a path the check cannot see.
- **The hash manifest cannot cover it either.** `bin/generate-structure-manifest.mjs`'s
  `workingTreeFiles()` (`:258-293`) walks `claude/scaffold/` only — `ai-agents/**` plus the two root
  context files. Agents and skills ship from `claude/agents/` and `claude/skills/`, which the walk
  never reaches, so there is no shipped-hash table for them.
- **Staleness is handled bluntly and silently.** `claude/fkit-claude-init.sh:479-490` does
  `rm -f "$dest/.claude/agents/fkit-"*.md` + `cp`, and `rm -rf` each
  `$dest/.claude/skills/fkit-*/` + `cp -R`. It prints one count line
  (`• refreshed N agents → .claude/agents/, M skills → .claude/skills/`) — **no per-file verdict, no
  comparison, no report**.

**The trap that makes this more than a coverage gap.** A project whose owner ran `fkit update` but
never re-launched `fkit` there keeps **stale agents and skills with no signal of any kind**. The
launch notice cannot fire, because **the launch is the same event that would refresh them** — by the
time anything could report the staleness, it is already gone. There is no observation point in the
current design where the divergence is both real and visible.

**Two more findings that bear on the decision, and were not obvious.**
1. **`.claude/` was not deliberately excluded — it was never considered.**
   `grep -n '\.claude'` over
   [`reports/2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
   and
   [ADR-039](../../../knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md)
   returns **nothing at all**. There is no prior ruling to be consistent with, and no rejected
   alternative to reopen.
2. **The two trees have opposite ownership semantics, and that is the crux.** `ai-agents/` is
   governed by [ADR-015](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)'s
   ratified invariant — *create-if-absent only; no overwrite, no move, no delete, ever* — which is
   precisely why conformance there needs a spec, a manifest, and consent-gated repair. `.claude/`
   fkit-managed paths are the **inverse**: init already deletes and overwrites them unconditionally,
   every launch, and they are gitignored (`claude/fkit-claude-init.sh:568-569`). A conformance
   apparatus designed around "never touch what the owner may have edited" may be answering a
   question `.claude/` does not ask.

**This is a design decision, and the architect was explicit that it needs an ADR with the owner's
sign-off rather than being settled in a consult.** Scoping implementation now would be
scoping-before-findings; that is why this brief produces a decision and nothing else.

## What to build

An **ADR** in `ai-agents/knowledge-base/decisions/`, written via `/fkit-record-decision`, deciding
whether and how `.claude/` conformance is observed. No code.

1. **State the question precisely** — not "should we check `.claude/`" but *at what observation point
   can a divergence be both real and visible*, given that launch is the refresh.
2. **Weigh at least these options, and say why each is rejected or chosen:**
   - **Extend the structure spec + manifest to `.claude/fkit-*` paths** — the architect's named
     candidate. Must answer: what generates the shipped hashes (the manifest walk covers
     `claude/scaffold/` only), and what "owner-edited" even means for a gitignored tree that init
     overwrites on every launch.
   - **Report at launch, before the refresh** — init compares, prints per-file verdicts, *then*
     refreshes. Cheapest observation point that actually exists; makes the refresh legible instead of
     silent. Must answer: does a notice on a tree fkit is about to fix itself earn its noise?
   - **Report out-of-band** — `/fkit-heal` (or a new check) reads the share and compares without a
     launch, so the owner can ask "is this project current?" without the act of asking fixing it.
   - **Decide it is not a conformance surface at all** — the unconditional refresh *is* the
     guarantee, and the real gap is that the owner is never told to re-launch. That gap is already
     being closed by
     [`0253`](../../done/0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md); this option
     says the docs fix is the whole answer. **This must be weighed seriously, not listed to be
     dismissed.**
3. **Record the consequences for the existing apparatus** — whether the spec's pinned machine-read
   contract (and `test/structure-spec.test.js`, which fails the build when the tables and
   `claude/scaffold/` disagree) has to change, and whether ADR-015's invariant is touched. **If the
   ADR's answer implies ADR-015 or ADR-039 needs amending, say so in the ADR; do not amend them
   under this task.**
4. **Get the owner's sign-off before the ADR is marked accepted**, and record how the ruling was
   given (date, channel), per the project's ADR precedent.

### ⛔ Out of scope

- ⛔ **Any implementation** — no edit to `claude/structure-spec.md`, `claude/structure-manifest.tsv`,
  `bin/generate-structure-manifest.mjs`, `claude/skills/fkit-heal/*`, or
  `claude/fkit-claude-init.sh`. Implementation is a follow-up brief written *after* this decision
  lands, and only if the decision calls for one.
- ⛔ Amending ADR-015 or ADR-039.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005) — the vault ingest of the new ADR is `fkit-wiki`'s,
  filed separately once the ADR is accepted.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. A new ADR file exists under `ai-agents/knowledge-base/decisions/` following the numbering and
   structure of the existing ADRs (context / decision / options weighed and why rejected /
   consequences).
2. The ADR names **all four** options in "What to build" §2 and gives each an explicit accept/reject
   with a reason — an option silently omitted fails this step.
3. The ADR records the owner's sign-off: the ruling, its date, and the channel it came through.
4. The ADR states explicitly whether `claude/structure-spec.md`'s pinned inventory contract and
   `test/structure-spec.test.js` are affected, and whether ADR-015's invariant is touched.
5. `git status --porcelain` shows changes **only** under `ai-agents/knowledge-base/decisions/` (plus
   this task's own folder) — no `claude/` path, no `ai-agents/wiki-vault/` path.
6. `grep -rn '\.claude' claude/structure-spec.md` still returns nothing (the out-of-scope boundary
   held — this task decides, it does not extend the spec).

## Notes

- **Depends on:** nothing
- **Blocks:** the (unwritten) implementation brief for `.claude/` conformance — deliberately not
  filed, because scoping it before this decision lands would be scoping before findings.
- Related: [`0253`](../../done/0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md)
  documents the manual re-launch step that is today's only mitigation, and is option 4's whole
  premise. It ships independently and is useful whatever this ADR decides.
- Provenance: raised by `fkit-architect` as a genuine, unanticipated architecture question, with the
  explicit position that an "extend the spec" answer warrants an ADR with the owner's sign-off rather
  than a consult ruling. Owner approved filing, 2026-08-08.
- Verified 2026-08-08: `claude/structure-spec.md` (zero `.claude` matches);
  `claude/skills/fkit-heal/check.sh:23`; `bin/generate-structure-manifest.mjs:258-293`;
  `claude/fkit-claude-init.sh:479-490`, `:568-569`; ADR-039 and the 2026-08-06 design report (zero
  `.claude` matches in either).
- Filed to the **Backlog** board — no sprint named; no re-rank (ADR-035).

- **⚠️ CARRY CORRECTION, 2026-08-10 — THE CLOSING LINE ABOVE IS NOW FALSE.** *"Filed to the
  **Backlog** board — no sprint named; no re-rank (ADR-035)"* is left **byte-identical**; it was true
  when this brief was filed on **2026-08-08**, and was falsified when the brief was **carried onto
  Sprint 5** by owner ruling of **2026-08-10** (verbatim option label **"Dashboard + all of
  0252-0258"**). The header fields moved in that same act and are the authority:
  **`## Sprint: Sprint 5`**, **`## Priority: Sprint 5 P15`**. **Plan this work against
  [`sprint-5.md`](../../../sprints/sprint-5.md), not the Backlog board.**
  ⚠️ **No drift check fires on this, and none will:** `dashboard.sh` reads the `## Priority`
  **field**, not brief prose, so the machine cannot see a stale closing line — only a reader working
  bottom-up can. Task
  [`0235`](../0235-cross-check-a-briefs-status-field-against-its-own-prose/brief.md) covers this
  class generally and is **neither widened nor closed** by this note.

- **⛔ NOT DRIVEN BY `/fkit-sprint-ship-loop` — owner ruling 2026-08-10**, given via
  `AskUserQuestion` in a live session, **the option label is the verbatim text**:
  **"0255 — the .claude/ conformance ADR (Rec)"**. This row needs a **second owner beat** the loop
  does not have: verification step 3 requires the ADR to record *"the owner's sign-off: the ruling,
  its date, and the channel it came through"*, and the loop's **only** owner gate is plan approval,
  spent before Build (`claude/skills/fkit-sprint-ship-loop/SKILL.md:120`). It runs in an
  **owner-present session** instead.
  ⚠️ **This is an exclusion from that loop run and from nothing else. `## Status` stays
  `🔲 Backlog`, the row stays in Sprint 5, the rank stays `P9` — NOT blocked, NOT deprioritised, NOT
  descoped.** Full reasoning is the **first bullet** of
  [`sprint-5.md`](../../../sprints/sprint-5.md)'s `## Notes`.
  ⚠️ **CORRECTED 2026-08-11 — the sentence above is left byte-identical and one clause of it is now
  stale.** *"the rank stays `P9`"* was true of the exclusion, and stays true **of the exclusion**: pulling
  a row out of a loop run still changes no rank. The rank moved anyway, by a **different and later
  authority** — the owner-ruled re-rank of 2026-08-11. This row now sits at **`Sprint 5 P15`**. ⛔ **Every
  other word of the sentence is untouched and still binding: still `🔲 Backlog`, still in Sprint 5, still NOT
  blocked, NOT deprioritised, NOT descoped, and still excluded from the ship-loop run.** See Sprint 5's
  §"Addendum — the owner-ruled re-rank of 2026-08-11".
