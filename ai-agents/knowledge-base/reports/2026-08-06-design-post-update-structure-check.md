# Design — the post-update structure check against a shipped structure-spec `.md`, and its consent-gated repair path (the sanctioned ADR-015 re-raise)

- **Date:** 2026-08-06
- **Task:** 0241 (Sprint 3 P3)
- **Author:** fkit-architect, via `/fkit-design-spec`, spawned by the lead's sprint driver
- **Status:** design only. Nothing is implemented, no structure-spec file is written, ADR-015 is not
  edited, and no implementation brief is filed. Three decisions are **returned to the owner** in §10;
  none is resolved here.
- **Citation form:** per the durable-citation convention (task 0160, report
  `ai-agents/knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md`),
  this report cites **path + quoted anchor/section name**, never `:NNN` line numbers.

---

## 1. Goal & context

### The owner's rulings — verbatim, dated, channel named

All four were taken via `AskUserQuestion` in a live `fkit lead` session on **2026-08-06**:

1. **Board:** verbatim **"Sprint 3 (Recommended)"** — the work sits on the active Sprint 3 board.
2. **Shape:** verbatim — **"My idea is that after update the fkit should check if the structure of
   the project fits the requirements for the installed version and if needed updated the structure.
   We can have a verbatim explaination of what is needed in the structure as an .md file that the
   agents will read after update, will use as a reference for what should be checked (e.g. the
   explanation of the structure of the folders)."**
3. **Rank:** verbatim **"Move to merit P3 (Recommended)"** — this task holds Sprint 3 P3, directly
   below 0182.
4. **Scope:** on *"Is stale `CLAUDE.md` / `AGENTS.md` refresh in scope for 0241's design, or a
   separate concern?"* — verbatim **"In scope (Recommended)"**.

The lead's gloss of ruling 2 — **marked as gloss, not ruling**: ship a structure-specification `.md`
with fkit (a verbatim explanation of what the project structure must contain for the installed
version); after an update, agents read that spec, check the project against it, and update the
structure where needed. **Where gloss and verbatim ruling could be read apart, the verbatim ruling
governs.**

### What this enables

Today a consuming project on an old fkit gets fresh agents and skills on every launch, but keeps
drifted `ai-agents/` scaffold files and a stale `CLAUDE.md`/`AGENTS.md` body **forever** — the init
script's own header says so: *"this CANNOT fix content drift. A scaffold-authored file whose contents
changed... is a path that ALREADY EXISTS, so we step over it, forever. That residual is deliberate
and owner-accepted"* (`claude/fkit-claude-init.sh`, convergence header comment). This design gives
the owner a **consent-gated** way to close that gap without giving the unattended launch path any new
power.

**Success criteria:** a project owner can (a) learn, reliably and cheaply, whether their project
matches what the installed fkit requires; (b) repair the mismatch **with their explicit consent, in a
live session**; (c) never have anything moved, overwritten, or deleted behind their back.

---

## 2. Constraints & scope

### The locked decision this touches

[ADR-015](../decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md) — its
invariant, quoted in full (ADR-015 §"Decision — 1. The invariant", ratified by the owner):

> **Convergence never writes to a path that already exists.** Create-if-absent only. **No overwrite,
> no move, no delete — ever — inside a consuming project's `ai-agents/`.** fkit **adds**; it does not
> mutate.

Constraints this design carries as binding, under **every** branch:

- **ADR-015's safety bar** (§"Decision — 3. The safety bar"): every REQUIRED row — idempotency,
  non-fatal failure, refuse-on-weird-state, announce, opt-out, the `.gitkeep` rule — constrains any
  new project-facing mechanism this design proposes, not just the existing convergence pass.
- **ADR-015 Decision §5:** content drift is *deferred with eyes open* — an accepted tradeoff, not a
  gap someone missed. This design does not treat it as an oversight to be quietly fixed.
- **ADR-005** ([decisions/adr-005](../decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md),
  rule in force): wiki reads are decentralized; **writes to `ai-agents/wiki-vault/` stay exclusive to
  `fkit-wiki`**. See §6.
- **The orphan-cleanup consent precedent** (`claude/fkit-claude-init.sh`, §"6. the Omnigent orphan
  residue" comment): announce-only consent was an owner ruling for that one cleanup and *"sets no
  precedent: any future destructive operation goes back to the owner."* The repair path designed here
  **cannot inherit announce-only**; its consent model is an owner decision (§10 Q2).

### Out of scope (per the brief)

No implementation; no edit to `claude/fkit-claude-init.sh`, `claude/fkit-claude.sh`, `install.sh`,
the scaffold, or `test/`; the structure-spec `.md` itself is **not** written (its home and contract
are outputs of this design); ADR-015 is not amended or superseded here; no wiki-vault write; no
commit; no task filing.

---

## 3. The re-raise — a standalone statement, decided by nobody but the owner

**ADR-015's `Re-raise only if` trigger 1 fires on this proposal.** The ADR's text: *"Someone
PROPOSES a change that would move, rename, or delete content inside a consuming project's
`ai-agents/`… The trigger fires on the proposal, not on the implementation… It voids this decision
and returns to the owner."* The owner's ruling 2 — *"if needed updated the structure"* — **is** such
a proposal. It was made by the owner, but without ADR-015's record in front of them. This task is
the sanctioned way through: the design returns to the owner with the invariant, the costs, and the
recorded alternatives laid out, instead of a mechanism being built around the record.

**The decision point put to the owner — what licence, if any, does the repair path get, and how does
the record update?** Options, with a recommendation the owner is free to reject:

- **(a) Amend ADR-015 in place.** Rejected as a recommendation: ADR-015's own Amendment section
  states the amendment form is for *"evidence, not decision"* changes — *"A superseding ADR exists to
  explain a changed ruling."* Granting a repair licence **is** a changed ruling.
- **(b) A new companion ADR — recommended.** Record, via `/fkit-record-decision` with the owner
  present, a **scoped grant**: the unattended launch path keeps ADR-015's invariant **unchanged and
  in force**; a separate, in-session, owner-present, consent-gated repair capability is licensed with
  the scope the owner chooses (§7 proposes a narrow v1). ADR-015 then gains a one-line
  cross-reference in a follow-up (not this task). This keeps the load-bearing property — "the one
  unattended code path that touches a user's project is bounded by a one-line invariant" — literally
  true.
- **(c) Supersede ADR-015 wholesale.** Not recommended: nothing about the unattended path's rules
  is changing; supersession would retire a record that should stay in force.

**Recommendation: (b).** Main tradeoff: two records now govern adjacent territory (unattended vs
consented), and readers must hold both; the cross-reference is what keeps that navigable.

**Trigger 2 status — stated with evidence, as ADR-015 asks.** Trigger 2 reads: *"A THIRD
fkit-authored file inside `ai-agents/` starts drifting."* Verified this pass by diffing this repo's
`ai-agents/` copies against `claude/scaffold/ai-agents/`: **seven** fkit-authored files differ —
`README.md` (63 changed lines; the ADR's standing example), `knowledge-base/conventions/README.md`
(34), `conventions/dependency-declaration-form.md` (50), `conventions/evidence-before-assertion.md`
(50), `conventions/one-skill-one-output.md` (55), `conventions/status-report-format.md` (14), and
`conventions/task-status-vocabulary.md` (67). (Owner-authored seeds — `PROJECT.md` — and
wiki-authored living files — `wiki-vault/index.md`, `log.md` — also differ, correctly, and are not
counted.) **Trigger 2 has fired: 7 ≥ 3.** Caveat, stated rather than hidden: this repo is fkit's own
dogfood checkout, where part of the divergence is the consuming copy running *ahead* of the scaffold
— but drift is divergence in either direction, and the trigger's text draws no such distinction. Per
the ADR, the hash manifest therefore *"stops being a deferred nicety and becomes a real scope call to
put back to the owner"* — which §7 does.

---

## 4. The structure-spec `.md`

The element ruling 2 names directly: *"a verbatim explaination of what is needed in the structure as
an .md file that the agents will read."*

### Content scope

The installed scaffold today (inventory verified this pass under `claude/scaffold/`): **27 files
under `ai-agents/`** — `README.md`; `knowledge-base/PROJECT.md`; 8 files under
`knowledge-base/conventions/`; `tasks/README.md`; `wiki-vault/index.md`, `log.md`, `schema.md`; and
13 `.gitkeep` placeholders (`knowledge-base/{decisions,history,incidents,reports}`,
`sprints`, `sprints/done`, `tasks/{backlog,cancelled,done}`,
`wiki-vault/wiki/{decisions,features,systems,tasks}`) — **plus the project-root `CLAUDE.md` and
`AGENTS.md`** (in scope by ruling 4) and `universal-rules.md` (install-side input to the rules
block, never copied into the project).

The spec must carry more than a path list — the check and repair semantics **differ by class**, so
the spec declares a class per path:

| Class | Examples | Check | Repair semantics |
|---|---|---|---|
| **Structural directory** | `tasks/backlog/`, `knowledge-base/reports/` | exists, is a real directory (not symlink, not file) | creation already handled by convergence (ADR-015 Decision §2); wrong-type is report-only |
| **fkit-authored reference file** | `ai-agents/README.md`, `conventions/*.md`, `tasks/README.md` | content matches what the installed version ships | replace **only** if untouched-stale (§7); touched → report with diff, never touch |
| **Owner-authored seed** | `knowledge-base/PROJECT.md` | exists only | **never** content-checked, never repaired — divergence is the point of the file |
| **Wiki-authored living file** | `wiki-vault/index.md`, `log.md` | exists only | any write is `fkit-wiki`'s exclusively (§6); `schema.md` content-check is report-only, repair routed to `fkit-wiki` |
| **Placeholder** | the 13 `.gitkeep`s | none | governed by init's existing `.gitkeep` rule; the spec documents, never re-implements, it |
| **Root context file** | `CLAUDE.md`, `AGENTS.md` | body-outside-markers matches a shipped version | §8 |

Plus prose per path: what it is *for* and what "conforming" means — the *"verbatim explaination"*
the ruling asks for, and the part a raw file listing cannot carry. Example excerpt (illustrative
only — the spec file itself is deliberately not written by this task):

```markdown
## ai-agents/knowledge-base/conventions/
Class: structural directory; children are fkit-authored reference files.
Holds the standing conventions every role reads before non-trivial work. The installed
version requires the eight files listed below. A missing file is created by launch
convergence. A file whose content matches no version fkit ever shipped was edited by
the project owner: report it, never touch it.
```

### Home — and the trap the spec must not fall into itself

**Recommendation: the install share** (`~/.local/share/fkit/claude/`, alongside the scaffold —
e.g. `claude/structure-spec.md` in the repo). Reasoning:

- **A project-local copy is self-defeating.** A spec copied into the project via the scaffold is a
  scaffold-authored file that then *exists* — create-if-absent steps over it forever, and the spec
  describing the current version's requirements would itself describe a stale version. The spec
  would fall into exactly the trap it exists to fix. Ruled out.
- **The install share is refreshed wholesale.** `install.sh` §"1. install the resources" does
  `rm -rf "$SHARE/claude"` then `cp -R` — the share never drifts from the installed sha. `fkit
  update` re-runs exactly that (ADR-015 Context §1: *"`fkit update` re-runs `install.sh` and
  refreshes `~/.local/share/fkit`… It never writes to a consuming project"*).
- **Sha-tracking comes free — with the label's limits stated.** ADR-015 Context §4: fkit's
  distribution is **sha-keyed** — *"Two installations can report the same `VERSION` and hold
  entirely different content"* — so a spec that carried its own `version:` field would be
  insufficient. In the install share the spec needs **no version field at all**: it is, by
  construction, *the installed sha's* spec. The share's `.version` file (`sha=` field, written by
  `install.sh` §"1b. record the installed version") **labels** which sha that is — best-effort, not
  guaranteed: `install.sh` resolves the sha in a **separate request** from the tarball fetch (the
  ref can advance between the two), falls back to `sha=unknown` when resolution fails, and a
  source-checkout self-host (`claude/fkit-claude.sh` §"self-hosting") has no `.version` at all.
  The load-bearing property is not the label — it is the **wholesale share refresh keeping the spec
  co-located with the installed content**, which holds in every one of those cases. Agents in a
  session can read the share: the launcher's self-hosting and share-resolution logic
  (`claude/fkit-claude.sh`, §"Self-update" — `share="$(cd "$here/.." …)"`) fixes where it is.

### Who maintains it when the scaffold changes

The failure class is documented in fkit's own launcher: hand-maintained mirrors rot —
`claude/fkit-claude.sh` §"Skill ownership" warns *"A checklist that is itself incomplete is worse
than no checklist: it is followed, and it fails"* (the task 70 incident). Options:

- **Fully generated from the scaffold** — no drift, but then the spec is just a file listing and
  the ruling's *"verbatim explaination"* prose is lost. Not recommended alone.
- **Hand-authored — recommended, with a mechanical drift test.** The prose is hand-authored; a repo
  test (a sibling of `test/rules-block-budget.test.js` in spirit) mechanically compares the spec's
  path inventory against `claude/scaffold/` and **fails the build** when they disagree, so a scaffold
  change cannot land without the spec moving in the same commit. Main tradeoff: one more test to
  keep, bought against the documented mirror-rot failure class.

---

## 5. The trigger

*"After update"* needs a mechanism, and init is stateless by design (`claude/fkit-claude-init.sh`
convergence header: *"STATELESS by design… If this ever grows a notion of project version, it has
become the migration mechanism that was rejected on the merits"*). Candidates, stateless first:

1. **Check-on-demand — an explicit verb/skill (recommended, the repair's only entry point).** The
   owner (or an agent in a live session) runs the check procedure; it compares spec vs disk vs
   manifest and reports. Zero state, zero launch cost, and the consent model (§7) needs a live
   session anyway. Weakness: nobody runs what nobody is told to run — which is what candidate 2
   fixes.
2. **Check-on-launch notice (recommended as the awareness layer).** Piggyback the existing
   every-launch hook (`claude/fkit-claude.sh` §"Setup runs every launch"): a cheap, read-only,
   **notice-only** pass — never a repair — printing one stderr line when the project does not
   conform, in the same channel and shape as convergence's own announcements (init's §"THE OUTPUT
   TRAP" comment explains why stderr). Pure spec-vs-disk-vs-manifest comparison with **no memory**:
   the notice prints while the mismatch exists and stops when it is fixed — self-limiting the same
   way the orphan cleanup is (*"ONE-TIME BY BEING SELF-LIMITING, not by remembering anything"*,
   init §6 comment). Cost: a per-launch walk of ~30 paths plus hashes — comparable to work init
   already does. Repeat-nagging is real: a user who deliberately diverges would hear it every
   launch. The remedy that stays stateless is the **intent-file** shape: `ai-agents/.fkit-keep-out`
   is the precedent — deliberately tracked, and, in init's own words, *"It records INTENT, not
   progress, so it is not a cursor by the back door."* An entry (or a sibling intent file) meaning
   "I know; stop telling me" records a decision, not a position; it survives a clone and is shared
   with teammates, which is exactly what the rejected cursor could not do. **Its scope, stated
   rather than left open: suppression is per-path.** An entry names one path and means "divergence
   at this path is deliberate; stop telling me about it." No global switch — that would mute the
   whole awareness layer, including mismatches a *future* fkit version introduces at paths the owner
   never ruled on, defeating the notice's purpose. And no per-mismatch keying (path + the accepted
   content's identity): that would record *which* state had been seen — a position, not a decision —
   edging back toward the rejected cursor. The consequence of per-path scope is owned openly: a
   suppressed path stays silent even when a future version changes what ships there, which is
   consistent with the intent recorded ("this path is mine now") and reversible by deleting the
   entry. This design argues the per-path shape genuinely threads the needle — but adding
   launch-path behavior is an owner call (§10 Q4).
3. **Pure comparison inside the on-demand check only** — candidate 1 without candidate 2. The
   fallback if the owner declines any launch-path addition.
4. **Install-share-stamp-keyed ("the share changed since last look").** The share's `.version` /
   `.latest` / `.update-check` stamps are **install-share state, not project state**, so *reading*
   them reopens nothing. But "since last look" needs a **per-project** memory of the last-seen sha —
   and that is a **cursor: progress, not intent**. **Stated explicitly, as the plan requires: this
   candidate re-opens the per-project version-cursor mechanism ADR-015 Context §3 rejected** (*"the
   cursor cannot survive a `git clone`"*). Not recommended; if the owner ever wants it, it goes back
   to them as its own decision.

**Recommendation: 1 + 2** — on-demand check as the repair's entry point, launch-time notice as the
awareness layer, per-path intent-file suppression for deliberate divergence. **No per-project
progress or cursor state anywhere in the recommended design; the only per-project state is the
tracked intent file, which records intent, not progress** — the design's own distinction, stated
precisely because Q4 turns on exactly it.

---

## 6. The check

**Who runs it, when, with what scope.** Recommendation: the **producer** owns the check-and-repair
skill, run in a live `fkit producer` session (or spawned by the lead with decisions relayed live,
per the sprint-loop pattern). Reasoning: the producer is already the custodian of the project
working structure — it owns the task-file lifecycle (ADR-033) and board hygiene; "does this
project's working structure match what fkit requires" is the same custodianship. The coder stays
the source-write authority (this is not source); the architect designs rather than operates; the
lead *"never writes source"* and delegates real work. Alternative worth the owner's glance: a
lead-owned check with repair delegated to the producer — rejected here as two roles for one
coherent capability. Skill ownership is declared where it always is: `skills_for_role()` in
`claude/skills-for-role.sh` (per ADR-012/ADR-018 — one source of truth; the launch-time notice, if
approved, is shell in the launcher and needs no skill).

**Read scope:** the install share's spec + manifest, the project's `ai-agents/` tree, and the root
`CLAUDE.md`/`AGENTS.md`. Read-only in the check phase, always.

**ADR-005 preserved under every branch — shown, not asserted:**

- *Check (read-only):* reading `wiki-vault/` paths for existence is a read; ADR-005 explicitly
  decentralizes reads. Preserved.
- *Repair, launch-notice, and every other branch:* the spec's wiki-vault rows are classed
  "wiki-authored living file" / structural (§4 table) — existence-only checks; the one
  content-checkable file (`schema.md`) is **report-only**, and any repair of anything under
  `ai-agents/wiki-vault/` is **routed to `fkit-wiki`** (a consult or an owner-directed
  `/fkit-wiki-ingest`), never performed by the producer, whatever the spec says the vault should
  contain. The spec file itself must carry that routing note on its wiki-vault rows, so no future
  reader of the spec is instructed into a violation. Preserved.

---

## 7. The repair path and its consent model — the genuinely new capability

Additions are already handled (ADR-015 Decision §2 — launch convergence creates missing paths).
The new capability is repairing **existing** content — exactly what the invariant forbids the
unattended script to do.

### The determination layer: the hash manifest, weighed as recorded — not re-derived

ADR-015 §"Rejected alternatives — A shipped content-identity hash manifest (the *correct*
content-drift fix — deferred, not rejected)" records the mechanism: *"on launch, hash the on-disk
file; if it byte-matches any version fkit has ever shipped of that file… the user never touched it →
safe to replace. If it matches nothing fkit ever shipped, the user edited it → never touch it, and
report the divergence once. Stateless, needs no cursor, survives a fresh clone, involves no LLM."*

**Weighed with, not against, the structure-spec — the hybrid is the design:**

- **The manifest decides *touched-or-not*.** Only it can: the spec is prose; distinguishing "stale
  but pristine" from "owner-edited" is a byte question, and the manifest's recorded strengths
  (stateless, clone-safe, no LLM) are exactly the properties this path needs.
- **The spec decides *what should exist* and what each path means.** The manifest is a table of
  hashes; it cannot tell an agent what a conforming project looks like or which class a path is.
- Neither alone suffices: spec-only forces an LLM to judge "was this edited?" — the
  indistinguishability problem ADR-015 names in rejecting the migration agent; manifest-only has no
  notion of required structure or class semantics.
- **Trigger 2 has fired** (§3, seven drifting files ≥ three), so per ADR-015's own re-raise text the
  manifest's scope call is now properly in front of the owner rather than deferred.

Manifest home: the install share, beside the spec — same staleness-proof property (§4). Generator,
specified to the level a builder needs (detail beyond this is unit 3's brief, §11): built from
fkit's git history by a **rename-aware walk across all three historical homes of the scaffold
tree** — ADR-015 Context §2 names them (`generic/ai-agents`, `omnigent/scaffold/ai-agents`,
`claude/scaffold/ai-agents`) — so *"any version fkit has ever shipped of that file"* means **every
shipped blob per path across its homes**, not just the current path's history. And regenerated
whenever the shipped share content is built, not at semver "releases": the distribution is
sha-keyed and installable at an arbitrary ref (ADR-015 Context §4), so a release-boundary generator
would leave between-release shas without their own manifest. A repo test guards completeness.

**The hashing contract carries a line-ending rule, stated rather than left to a fixture:** hashes
are computed over content **normalized CRLF → LF, on both sides** (manifest generation and the
on-disk file). Otherwise an untouched file that merely passed through an autocrlf checkout would
byte-mismatch every shipped blob and misclassify as owner-edited — the same Windows failure class
init already learned the hard way (its `marker_lines` comment: a CRLF file *"never matches its own
markers"*). §9's CRLF fixture asserts exactly this: an ending-only variant classifies
untouched-stale, not owner-edited.

### The consent model — propose-then-apply, owner present

The shape ADR-015's record permits, in its own vocabulary: *"Non-determinism is fine in an agent
that **proposes**; it is not fine in the one unattended code path that moves the user's files"*
(§"Rejected alternatives — Natural-language migration items executed by a migration agent"). The
repair is therefore:

1. **In-session, owner present.** The check (§6) produces a per-file conformance report: conforming
   / missing (convergence's job) / **untouched-stale** (manifest-matched an older shipped version) /
   **owner-edited** (matched nothing) / wrong-type / wiki-routed.
2. **Propose:** the agent shows the full proposed change list — per file: the action, and for
   replacements the diff. Nothing is applied yet. (This is the dry-run; "announce" does not replace
   consent here, unlike the launch-convergence bar, because this path mutates.)
3. **Consent:** the owner approves via `AskUserQuestion`. Granularity options for the owner (Q2):
   per-file; or **plan-level with the per-file list in view (recommended)** — one approval of the
   exact enumerated list, with any destructive item called out individually. Never stored consent —
   the orphan-cleanup comment records why: *"a stored decision cannot survive a clone either — the
   same trap."* Consent is per-run, in the session where it is given.
4. **Apply exactly what was approved — behind an apply-time freshness re-check.** Immediately
   before each replacement the on-disk file is re-hashed; if it no longer matches the state the
   proposal showed (something edited it between propose and apply), that item is **refused and
   reported**, never applied — the consent given was to a diff that no longer exists. Then announce
   per path what actually happened — init's orphan-cleanup sets the reporting bar: *"Every branch…
   MUST report what actually happened, not what the exit status implied."*

**v1 repair scope — recommended narrow:** replace **untouched-stale** files with the installed
version; report owner-edited files with diffs and touch nothing; **no move, no rename, no delete**.
The destructive-path class has a recorded real-world incidence of zero across fkit's history
(ADR-015 Context §2); excluding it shrinks the licence the owner is asked to grant to the smallest
shape that solves the live problem. If a genuinely destructive migration ever arrives, ADR-015's own
words already prescribe its form: *"an executable, reviewed, tested script — rigidity is the feature
— gated on explicit consent, never run unattended on launch."*

**The forbidden shapes, named, and shown absent:**

- **Silent auto-update** — *"exactly what the record forbids"* (brief §Context 4). Absent: every
  mutation in this design sits behind step 3's explicit in-session consent; the only launch-path
  addition proposed anywhere is a read-only stderr notice (§5 candidate 2).
- **An unattended agent executing natural-language items** — ADR-015: *"the worst option on the
  table."* Absent: no agent acts unattended; the LLM's non-determinism lives entirely in the
  *propose* step, and the *decide* step is the owner's. The distinction the record itself draws is
  the load-bearing one here.

---

## 8. `CLAUDE.md` / `AGENTS.md` refresh — IN scope by ruling 4

Recorded verbatim and dated: **"In scope (Recommended)"** (`AskUserQuestion`, live `fkit lead`
session, 2026-08-06). The include/exclude call is **decided, not re-proposed here**. What follows is
mechanics.

**The invariant question, stated precisely rather than implied:** these files sit at the project
root — **outside the tree ADR-015's invariant literally names** (*"inside a consuming project's
`ai-agents/`"*). The invariant therefore does not formally bind them, and trigger 1 does not
formally fire on them. The same consent model is applied to them anyway — not because the record
compels it, but because ruling 4's *"one coherent capability"* intent does, and because the
consent argument (they are the owner's files; init's §2 comment: *"These files are the OWNER'S"*)
is identical.

**"Stale `CLAUDE.md`" splits into two different problems** — the design uses the existing seam
(`merge_rules` in `claude/fkit-claude-init.sh`) rather than reinventing it:

- **The fkit-managed block** (marker-delimited, `RULES_MAX`-capped, rewritten on every launch by
  `merge_rules`) — **already self-healing**. Nothing to design; the spec documents it as
  out-of-scope for repair.
- **The owner-side body** (everything outside the markers, created once from
  `claude/scaffold/CLAUDE.md` / `AGENTS.md` by `install_root_file`, then never touched) — this is
  what drifts forever, and it is the repair target. Mechanics: the manifest hashes the body **with
  the marker-delimited region elided** (the block legitimately changes every launch and every
  version; including it would make every project read as owner-edited). Elision uses the same
  whole-line marker recognition `marker_lines` already defines — the design reuses that contract, it
  does not redefine it. Body matches a shipped scaffold body → untouched-stale → eligible for
  consent-gated replacement (markers and current block preserved through the rewrite); matches
  nothing → owner-edited → report with diff, never touch. Same propose-then-apply, same session,
  same consent granularity as §7. **Markers absent or malformed are their own stated branch, not
  just a §9 fixture:** a **malformed** marker set (begin without end, end without begin, several
  pairs) makes the elision region unknowable — the checker **refuses to classify** the file and
  reports the malformation, mirroring `merge_rules`' own refusal contract (*"the extent of the
  block is UNKNOWABLE and the wrong guess silently deletes the owner's prose. Refuse"*); markers
  **absent** entirely mean nothing is elided, the whole file hashes against shipped bodies, and it
  will classify **owner-edited** (deleting the markers is an owner edit). Either way the outcome is
  **report-only — never repaired**.

---

## 9. Alternatives, impact & risks, testing strategy

### Alternatives considered (beyond those weighed in place)

- **Semver walk / migration files:** rejected in ADR-015 (Decision §4, §Rejected alternatives);
  nothing here reopens it — the design keys on *what the file is*, not *which version you came
  from*, which ADR-015 itself notes is further evidence against the walk.
- **Overwrite fkit-authored files on launch:** rejected in ADR-015 (§Rejected alternatives, the
  naive fix) — destroys owner edits; in this very repo part of the drift is hand-authored
  improvement running ahead of the scaffold (§3 caveat proves the case again).
- **LLM-judged drift (no manifest):** rejected — re-creates the indistinguishability problem that
  sank the migration agent.
- **Project-local spec copy:** rejected in §4 — self-defeating under create-if-absent.

### Impact & risks

- **Blast radius:** check and notice are read-only — near zero. Repair mutates owner files;
  bounded by consent, the untouched-stale-only v1 scope, and per-path announce. The worst credible
  failure — replacing a file the owner had edited — requires a manifest false positive: the owner's
  edit would have to byte-match a shipped historical version, i.e. be a byte-exact revert. Low, and
  it errs only toward *restoring a shipped state*.
- **Safety-bar inheritance:** the launch notice, if approved, inherits every REQUIRED row
  (non-fatal, symlink-refusal via `-L`-first, stderr announce, keep-out respect); repair inherits
  them in-session plus consent.
- **Normalisation risk** — ADR-015's Consequences warn that making the project-facing hook more
  capable normalises it *"right before the moment of temptation."* Mitigation: repair never lives
  in init; it is a skill, in a session, behind consent, recorded in its own ADR (§3 option b).
- **Maintenance debt:** spec + manifest are two more shipped artifacts; both guarded by repo tests
  (§4), else they join the mirror-rot class.
- **Scope-boundary risk:** wiki-vault writes leaking into the repair role — closed structurally in
  §6 (routing note carried in the spec itself).

### Testing strategy — for the future implementation, not tests written now

Fixture consuming projects, driven the way `test/` already drives init: **fresh** (conforms);
**drifted-untouched** (old shipped content → proposed for replacement); **drifted-edited** (→
report-only, never in the apply set); **renamed dir** (both-exist limit stated in output, per
ADR-015's rename consequence); **symlinked subdir / dangling symlink / file-where-dir-belongs**
(refuse loudly — the safety-bar rows as literal test cases); **keep-out entries** (respected by
check, notice, and repair); **CRLF and chmod-000** variants (init's own regression history — the
CRLF fixture asserts §7's normalization contract: an ending-only variant classifies
untouched-stale, never owner-edited);
`CLAUDE.md` with **markers absent / malformed / block-only-drift vs body-drift** (elision
correctness — block drift must never mark a body untouched-stale as edited or vice versa); manifest
**completeness** across every shipped historical version (generated from git history; test red
first, per init's own "run red first" note); **dry-run/apply parity** (the applied set is exactly
the approved proposal, **and** each applied file still hash-matches the pre-state the proposal
showed — a fixture that edits a file between consent and apply must see that item refused, per §7's
apply-time freshness re-check); **ADR-005 assertion** (repair run against a nonconforming `wiki-vault/`
writes nothing under it); notice **silence on a conforming project** (the happy path must stay
completely silent, per init's output-trap rule).

---

## 10. Open questions for the owner

None of these is resolved agent-side; each carries a recommendation the owner is free to reject.

1. **The ADR-015 re-raise licence (§3).** What licence does the repair path get, and how does the
   record update — (a) amend ADR-015, (b) new companion ADR via `/fkit-record-decision` with
   ADR-015 cross-referenced in a follow-up, (c) supersession? **Recommendation: (b)**, with the
   narrow v1 licence: consent-gated replacement of untouched-stale fkit-authored files only; no
   move/rename/delete.
2. **The consent model (§7).** Granularity: per-file, or plan-level approval of the enumerated
   per-file list? **Recommendation: plan-level with the full list and diffs in view; any
   destructive item (none in v1) individually confirmed. Never announce-only, never stored.**
3. *(Already ruled — recorded, not asked.)* `CLAUDE.md`/`AGENTS.md`: **IN scope**, verbatim "In
   scope (Recommended)", 2026-08-06.
4. **The trigger (§5).** Is the read-only launch-time notice wanted alongside the on-demand check?
   And if yes: is the tracked intent-file suppression ("I know; stop telling me") acceptable —
   **per-path, per §5 candidate 2's scope statement**; this design argues it records intent, not
   progress, and so is not the rejected cursor — or should the notice be unconditional?
   **Recommendation: notice + per-path intent-file suppression. No per-project *progress* state is
   needed anywhere in the recommended design — the intent file is the only per-project state, and
   it is state of the intent kind; candidate 4 (share-stamp "since last look") is flagged as
   cursor-reopening and not recommended.**
5. **The owning role (§6).** Producer as custodian of the check-and-repair skill?
   **Recommendation: yes.**
6. **Spec maintenance (§4).** Hand-authored prose guarded by a mechanical scaffold-inventory test?
   **Recommendation: yes.**
7. **Trigger-2 consequence (§3).** The hash manifest's scope call is now live by ADR-015's own
   terms. Fold it into this capability (the hybrid, as designed), or rule on it separately?
   **Recommendation: fold — the manifest is this design's determination layer.**

## 11. Proposed implementation split — a proposal only; nothing is filed

Filing is the producer's act, after the owner reviews this design.

| # | Unit | Depends on |
|---|---|---|
| 1 | **Record the owner's rulings as the companion ADR** (via `/fkit-record-decision`, owner present) — the licence, consent model, role, trigger | owner review of this report (Q1, Q2, Q4, Q5) |
| 2 | **Author the structure-spec `.md`** (install share; class-annotated; wiki-routing notes) + the scaffold-inventory drift test | 1 (home/contract confirmed) |
| 3 | **Hash-manifest generator** (from git history: rename-aware, across the scaffold's three historical homes, every shipped blob per path, CRLF-normalized — per §7 "Manifest home" and the hashing contract) + manifest completeness test | none (mechanism already recorded in ADR-015) — ships behind 1 |
| 4 | **The check skill** (producer-owned; read-only conformance report over spec + manifest, incl. `CLAUDE.md`/`AGENTS.md` marker-elision hashing) | 2, 3 |
| 5 | **The repair path** (consent-gated propose-then-apply inside the check skill; v1 scope) | 1, 4 |
| 6 | **The launch-time notice + intent-file suppression** (launcher/init shell; safety-bar rows as tests) | 1 (only if Q4 approves), 2, 3 |
| 7 | **Docs**: architecture.md, README, scaffold docs pointers; fkit-wiki ingests this report and the ADR | 1–5 |

---

*Written by fkit-architect for task 0241. One file changed: this report. If it should live in the
wiki, fkit-wiki ingests it — this role does not write the vault.*
