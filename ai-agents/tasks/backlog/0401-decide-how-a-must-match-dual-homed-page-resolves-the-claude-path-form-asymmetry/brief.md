# Decide how a must-match dual-homed page resolves the `claude/` vs `.claude/` path-form asymmetry

## ID
0401

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

⚠️ **Producer judgement on the role, but a well-founded one.** The deliverable is an ADR produced by
`/fkit-record-decision`, which `claude/skills-for-role.sh` assigns to `architect`;
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1 fixes the build role by **the owner of the skill the deliverable is produced by**, so this
follows the rule directly rather than falling to its skill-less clause. ⚠️ **If the plan gate rules
the deliverable is only a convention-doc edit and no ADR**, the build role becomes `fkit-coder` under
that same clause — say so at the gate rather than proceeding on this field.

## Context

### Provenance

**Owner ruling, 2026-09-16**, given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9
wrap-up), multi-select, verbatim option label **"Path-form asymmetry"**. Source: the wiki librarian's
third sync pass of 2026-09-16, recorded in `ai-agents/wiki-vault/log.md`'s entry for that date. Filed
by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

### ⛔ THIS IS A DECISION TASK. THE DELIVERABLE IS A RULING, NOT A SWEEP.

**No record anywhere states the answer today.** Do not repair any page under this row; the repairs are
whatever the ruling authorizes, and they are a follow-up.

### The problem

`ai-agents/knowledge-base/conventions/` is **dual-homed**: a live copy in this repo and a scaffold
copy at `claude/scaffold/ai-agents/knowledge-base/conventions/` that ships into every consuming
project. `conventions/dual-home-parity.md` sorts every dual-homed path into two classes, and
`test/dual-home-parity-exceptions.mjs` is the authoritative version of that sort:

- **audience-adapted** — *"✅ substance must match; ⛔ never byte-aligned"*. Each copy may legitimately
  say different things to its different reader.
- **must-match** — byte-identical, enforced by `test/dual-home-parity.test.js` (*"every enforced
  dual-homed file is byte-identical"*).

A **path form** is audience-dependent. Inside this repo, `claude/` is the canonical source and
`.claude/` holds gitignored, fkit-managed copies rebuilt on every launch. In a consuming project there
is `.claude/` and **no `claude/` at all**. That is exactly the two-audience problem `0396` is scoped
against on the skill-prose side.

⛔ **An audience-adapted page can carry a different path form in each copy. A must-match page
cannot — and nothing says which form it should carry.**

### Measured on disk 2026-09-16 at filing (re-derive at pickup)

Grep used — record it and reuse it: `grep -roE '(^|[^.A-Za-z0-9_~/-])claude/(skills|agents)/' <dir>`

| Home | Bare `claude/skills|agents/` occurrences |
|---|---|
| `ai-agents/knowledge-base/conventions/` (live) | **15** |
| `claude/scaffold/ai-agents/knowledge-base/conventions/` | **0** |

⭐ **All 15 live occurrences sit in four pages — `evidence-before-assertion.md` (6),
`task-status-vocabulary.md` (6), `one-skill-one-output.md` (2), `status-report-format.md` (1) — and
ALL FOUR are audience-adapted exceptions.** For those four the asymmetry is **correct and must not be
"fixed"**; that is the class working as designed. `0390`'s sweep produced this state and produced it
rightly.

### The concrete instance the ruling is about

The dual-homed conventions that are **must-match** (in the scaffold, absent from the exceptions
module) are exactly three at filing: `durable-citation-anchors.md`, `priority-is-rank-not-identity.md`,
`task-owner-vocabulary.md`. All three verified byte-identical across both homes at filing.

`priority-is-rank-not-identity.md` — byte-identical in both homes — points its reader at **three
`.claude/` paths**, the numbered list items opening *"**`.claude/skills/fkit-status/dashboard.sh`** —
the `⟦FACTS⟧` id ladder"*, *"**`.claude/skills/fkit-task-brief/SKILL.md`** — at write time"*, and
*"**`.claude/skills/fkit-status/dashboard.sh` + `test/dashboard-contract.test.js`**"*.

- **For the consuming-project reader, `.claude/` is right.**
- **For the fkit developer reading the live copy, `.claude/` is a trap**: the path exists, but it is
  gitignored and rebuilt from `claude/` on every launch. Editing there is silently discarded. The
  canonical source is `claude/skills/…`.
- ⚠️ **The third item also names `test/dashboard-contract.test.js`, which does not exist in a
  consuming project at all** — so the page is arguably already fkit-facing in a way the must-match
  class cannot express. **Weigh this; it may be the real finding.**

**The page cannot have it both ways while it is byte-identical.** Something has to give: the path
form, the must-match classification, or the class taxonomy itself.

### Candidate shapes to weigh — not an exhaustive list, and not a recommendation

1. **`.claude/` wins on must-match pages**, with a one-line fkit-developer note (the `fkit-heal`
   split-parenthetical shape `0396` cites as precedent) that is itself byte-identical and therefore
   ships to consumers. *Cost: consumers read a note about a repo they do not have.*
2. **A must-match page never names a `claude/`-family path at all** — it cites the artifact by name
   and leaves the path to the reader's home. *Cost: vaguer, and some citations are load-bearing.*
3. **Reclassify the affected page(s) as audience-adapted**, adding an exception entry with a reason.
   *Cost: weakens the must-match class each time it is invoked; `dual-home-parity.md` already warns
   that one row in its table was wrong once.*
4. **A third class** — *"must-match modulo a declared path-form substitution"* — with the substitution
   applied at scaffold-generation time. *Cost: new mechanism, new enforcement, the most expensive.*

⚠️ **Note that `0186` (open) already asks ADR-027 to record the audience-adapted third kind.** Whether
this ruling lands as its own ADR, an amendment to ADR-027, or an amendment to
`conventions/dual-home-parity.md` is itself part of the decision.

### Dependencies and constraints

- ⚠️ **`0396`** (open) is the **same two-audience problem on the other side of the fence** — bare
  `claude/` in `claude/skills/`, `claude/agents/` and `claude/scaffold/`. Its plan gate will put a
  two-audience wording shape to the owner. ⛔ **These two must not answer the same question
  differently.** Whichever runs second cites the first's ruling and says whether it is consistent. Not
  a hard dependency — this row is about **must-match dual-homed pages**, a class `0396` does not
  touch — but it is a coherence obligation, and a soft ordering preference: `0396` first.
- The authoritative class list is `test/dual-home-parity-exceptions.mjs`, **not**
  `conventions/dual-home-parity.md`, which is its human mirror and has been wrong before.
- The exceptions module carries a **tripwire keyed on prune points** — read its header before
  proposing to add or remove an entry.

## What to build

1. **Re-derive the measurements at pickup**: the per-home occurrence counts with the grep above, the
   current must-match conventions set (scaffold contents minus the exceptions module's entries), and a
   byte-diff of each must-match page across both homes. Record commands and output.
2. **Enumerate every must-match dual-homed page that names a `claude/`-family path**, in either form.
   At filing this was `priority-is-rank-not-identity.md` (three `.claude/` sites, one bare `claude/`)
   and `durable-citation-anchors.md` (one bare `claude/`). ⛔ **Sweep the whole must-match set, not
   just conventions** — the class covers more paths than `conventions/`.
3. **Weigh the candidate shapes** — the four above plus any the analysis surfaces — against the
   two-audience failure mode, the cost of weakening the must-match class, and consistency with
   whatever `0396`'s gate ruled.
4. **Put the choice to the owner** with one recommendation and its main tradeoff. ⛔ **The owner
   rules; do not pick.**
5. **Record the ruling** — as an ADR via `/fkit-record-decision`, or as an amendment to
   `conventions/dual-home-parity.md` / ADR-027, whichever the analysis argues for. Say which and why.
6. **Do NOT repair any page under this row.** The repairs are a follow-up brief the ruling authorizes.
   If the enumeration in step 2 finds more affected pages than the two known, name them in the record
   so the follow-up has its worklist.

## Verification steps

1. The written record exists and states, in one sentence a reader can act on, **which form a
   must-match dual-homed page carries** and what it does about the other audience.
2. The record names the owner ruling verbatim — the option label — with its date and channel.
3. The record enumerates every must-match page affected, with the current text quoted, so the
   follow-up repair has a worklist it does not have to re-derive.
4. The record states whether its answer agrees with `0396`'s plan-gate ruling, or explains the
   divergence.
5. The record states which of ADR-027, `conventions/dual-home-parity.md` and
   `test/dual-home-parity-exceptions.mjs` (if any) must change as a consequence, and whether that is
   this row or the follow-up.
6. `node --test test/dual-home-parity.test.js test/reference-integrity.test.js
   test/coordination-citation-policy.test.js` — green; state the counts. ⭐ **A decision row that
   changed no page should leave these exactly as it found them** — that is the check that nothing was
   repaired under a decision row.
7. `git diff --stat` touches the new or amended record and this task folder only. ⛔ Nothing under
   `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** the follow-up repair brief this ruling authorizes, which is not yet filed.
- ⚠️ **One brief, not a split — producer judgement.** The decision and its repair could be two rows,
  and arguably should be; this row is the decision only, and the repair is deliberately left unfiled
  until the shape is known. Filing a repair brief now would be scoping implementation before the
  investigation findings exist.
- ⚠️ **Filed UNRANKED and APPENDED LAST** on the Backlog board by a spawned producer with no owner
  channel; renumbers and inserts nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- Cite `ai-agents/…md` files by quoted text, not line coordinates.
- ⛔ No wiki write ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ No commit.
