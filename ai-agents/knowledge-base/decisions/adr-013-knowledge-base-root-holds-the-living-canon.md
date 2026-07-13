# ADR-013: The knowledge-base root holds only PROJECT.md and architecture.md; everything else is filed by kind

- **Status:** accepted (amended 2026-07-13, before first action — see "Amendment")
- **Date:** 2026-07-13
- **Deciders:** fkit-architect, under the explicit delegation in
  `ai-agents/tasks/backlog/formalize-knowledge-base-incidents-folder.md:67-77` ("The architect decides
  the shape… Whatever is chosen, record the rule"), relayed by fkit-producer. **The one open question
  this ADR carried has been ruled on by the owner** — see "Amendment".

## Context

`ai-agents/knowledge-base/` grew organically. At the time of writing its root held `PROJECT.md`,
`architecture.md`, three subfolders (`decisions/`, `history/`, `incidents/`), and **eight loose files**
of at least four different kinds:

| File | Kind |
|---|---|
| `status-report-format.md` | standing convention |
| `task-status-vocabulary.md` | standing convention |
| `doc-drift-audit-2026-07-11.md` | audit |
| `onboarding-verification-2026-07-12.md` | verification |
| `restart-skill-verification-2026-07-10.md` | verification |
| `plan-omnigent-removal-2026-07-11.md` | plan (executed) |
| `eval-vendored-query-skill-distribution.md` | evaluation (fed ADR-005/006/007) |
| `tester-agent-evaluation-2026-07-13.md` | evaluation (still open) |

(The task brief that prompted this ADR lists six; two more — the two evaluations — had already landed
by the time it was picked up. That is itself evidence of the drift rate.)

Two of these are **standing conventions the project reads on every run**
(`claude/skills/fkit-status/SKILL.md`, `claude/skills/fkit-task-plan/SKILL.md`, and
`architecture.md` all read them as live rules). The other six are **snapshots of a moment**. They are
not the same kind of thing and they sat in the same place, so a reader landing in the root could not
tell the live rules from the spent paperwork.

`incidents/` was created ad hoc in the 2026-07-10 incident with no documented convention.
`decisions/` acquired its `adr-NNN-` shape by accident, after the fact. Only `history/` was ever
deliberately specified (ADR-002 + `history/README.md`). Left alone, `incidents/` and the root repeat
that pattern.

**This is not hypothetical.** `ai-agents/tasks/backlog/knowledge-base-hygiene-post-omnigent.md:36-45`
(task 10, the archive pass) had *already* improvised a rule in the absence of one: it directs that the
evaluation, a verification, the audit, the plan **and the 2026-07-10 incident itself** all be swept
into `history/`. That would empty `incidents/` on the day it is formalized. This ADR exists to settle
the convention before that pass runs.

## Decision

**The knowledge-base root holds exactly two documents — `PROJECT.md` and `architecture.md`.
Everything else is filed by kind.**

Those two are the project-defining documents: *what we are building* and *how it is built*. They are
the only things at the root, they are **maintained in place**, and they are **never dated**. There is
no third root document, and no rule to remember about which loose files are allowed to sit there —
**if it isn't one of those two, it goes in a folder.**

Five folders, and the test that routes a new document to one of them:

1. Is it **`PROJECT.md`** or **`architecture.md`**? → the **root**. (Nothing else is.)
2. Does it record a **settled decision** — why we do it this way? → `decisions/adr-NNN-<slug>.md`
3. Is it a **standing rule the project reads on a normal run and must obey** — how we do it? → `conventions/<subject>.md`
4. Does it record **something that happened** to fkit's own runtime/tooling? → `incidents/YYYY-MM-DD-<slug>.md`
5. Does it record **work performed at a point in time** — an audit, a verification, an evaluation, a plan? → `reports/YYYY-MM-DD-<slug>.md`
6. Is it a **design document that no longer describes reality**? → `history/`

There is no "otherwise". A document that fits none of the six is the trigger to re-raise this ADR (see
"Re-raise only if"), not a licence to drop it at the root.

Two mechanically checkable invariants fall out:

> **1. The root holds exactly two files.** `ls ai-agents/knowledge-base/*.md` returns `PROJECT.md` and
> `architecture.md`, and nothing else. Ever.
>
> **2. A dated filename means "a record of a moment"** — so a dated file never appears at the root or
> in `conventions/`, and conversely a root or convention document is never dated. If a document needs
> a date in its name to make sense, it is a record, not canon.

The first invariant is the rule; the second is what keeps `conventions/` from silently becoming the
new junk drawer.

`reports/` and `conventions/` are **new** (this ADR creates them). Each subfolder carries a `README.md`
stating its scope, naming, and lifecycle; `decisions/` needs none — the `adr-NNN-` sequence and the ADR
template are the convention, and they are described in `architecture.md`.

### Convention vs. decision vs. record — the distinction the folders encode

- A **convention** is **prescriptive and current**: it says what you *must do*, it is edited in place
  to stay true, and violating it is a defect. (`conventions/README.md` holds the bar for adding one.)
- A **decision (ADR)** is **explanatory and immutable**: it says *why* the rule is what it is, and what
  was rejected. An ADR may *create* a convention; it never *is* one. If you have to read an ADR to know
  how to format a status report, the convention is missing.
- A **record** (`reports/`, `incidents/`) is **descriptive and frozen**: it says what happened or what
  was found, on a day. It is never promoted to a convention — if its conclusion hardens into a rule,
  the rule is written as its own convention document and the record stays as the evidence.

Three consequences worth stating explicitly, because they **reverse** what task 10 currently says:

- **`history/` is not the general archive.** It is narrow: superseded *design docs* — documents that
  once described the intended architecture and no longer describe reality (ADR-002). It is effectively
  closed at its current four documents.
- **Records are never superseded, so they are never relocated.** An audit, a verification, an
  evaluation, a plan and an incident do not become false when the system they describe is removed —
  they remain true accounts of a moment. Only *designs* go stale. So the 2026-07-10 incident **stays
  in `incidents/`** even though Omnigent is gone, and the Omnigent-era reports **go to `reports/`**,
  not to `history/`. Where a doc could mislead a reader into thinking it describes the current runtime,
  the fix is a **banner line in the doc**, not a move.
- **"Filed" does not mean "dead".** `tester-agent-evaluation-2026-07-13.md` is a live input to an open
  backlog decision and still belongs in `reports/`; `eval-vendored-query-skill-distribution.md` is
  cited by ADR-007 as its evidence and still belongs in `reports/`. Location encodes *kind*, not
  liveness.

## Amendment — 2026-07-13, owner ruling: conventions get a folder

As first accepted, this ADR kept the two standing conventions **at the root** alongside `PROJECT.md`
and `architecture.md`, and left one question open for the owner: *do they stay, or do they get a
`conventions/` folder?* The argument for keeping them was that there are only two of them, they are
read on every run, and a folder holding two files earns nothing.

**The owner ruled for the folder.** The counter-argument, which is the better one: a folder makes the
living-canon rule **structural** rather than something the reader has to already know. With the
conventions loose at the root, "the root holds the living canon" is a *convention about conventions* —
you have to have read this ADR to know that `status-report-format.md` is law and
`doc-drift-audit-2026-07-11.md` was not. With the folder, the shelf label does that work: two
project-defining documents at the root, and everything else filed by what it *is*. The rule stops
depending on the reader's memory, which is the only kind of rule that survives.

The ADR was amended **in place rather than superseded**, because it was accepted and had **not yet
been acted on** — nothing had moved, so there is no history for a superseding ADR to explain. What
changed: the root rule went from *"root = living canon"* to *"root = `PROJECT.md` + `architecture.md`"*;
the routing test went from five ways to six; `conventions/` was added to the folder set. The rest of
the ADR — records filed by kind, `history/` stays narrow, records are never relocated — is unchanged,
exactly as the original text predicted this flip would be cheap.

The move was made with `git mv`, so both files keep their history.

## Options considered

- **Root = `PROJECT.md` + `architecture.md`; everything else filed by kind, in five subfolders
  (chosen, per the owner's ruling).** The strongest form of the invariant: the root's contents are
  fully enumerable, so "is this file allowed to be here?" needs no judgment. Costs one more folder than
  strictly necessary today.
- **Root = living canon (the two project-defining docs *plus* standing conventions); four subfolders**
  (this ADR's original decision) — **rejected on owner ruling.** It gives the same checkable
  dated-filename invariant and one fewer folder, but the root rule remains a rule you must *know* — a
  reader cannot tell a convention from a stray file by looking. Reasonable, and it lost to a better
  counter-argument.
- **Sweep everything old into `history/`** (what task 10 currently improvises) — rejected. It
  overloads `history/` into "anything not current", which destroys the one clean semantic it has
  (ADR-002's *superseded design docs*) and makes it a junk drawer. It also forces the absurdity of
  moving the only incident out of `incidents/`, and it conflates "old" with "false".
- **A folder per kind of record — `audits/`, `verifications/`, `evaluations/`, `plans/`** — rejected as
  over-partitioning: four folders holding one or two files each, and endless boundary-quibbling over
  whether a doc is an audit or a verification. The kind is carried in the slug instead, which is
  enough to find things and costs nothing when it is ambiguous. (Note this is *not* the argument that
  lost above: `conventions/` separates a **different kind of document**, not a sub-kind of record.)
- **Leave the root alone; just document `incidents/`** — rejected: that is the literal minimum the
  task brief asked for, and it leaves task 10 to invent the root rule anyway. The scope addendum exists
  precisely because that outcome is the failure mode.

## Consequences

- **Ten files move, not eight.** The two conventions have already been moved into `conventions/` by
  this ADR's amendment; the remaining **six root files get filed and renamed date-first by task 10**
  (`ai-agents/tasks/backlog/knowledge-base-hygiene-post-omnigent.md`), and the ADR's own `history/`
  contents stay put. After task 10 runs, `ls ai-agents/knowledge-base/*.md` must return exactly two
  names.
- **Inbound links must be repaired**, notably **ADR-007:29,123**, **ADR-009:22,131** and **ADR-010:130**,
  which cite the six as evidence. The two conventions' inbound links have been repaired already, with
  one class of exception (below).
- **Product source under `claude/` now points at paths that do not exist**, and this breaks the shipped
  `/fkit-status` skill if left. It is a **coder** change, not part of this ADR:
  - `claude/skills/fkit-status/SKILL.md:34-35` names both conventions by path and reads them at runtime
    as its contract.
  - `claude/skills/fkit-task-plan/SKILL.md:94` names `task-status-vocabulary.md` by path.
  - `claude/skills/fkit-evaluate-approach/SKILL.md:62` instructs the architect to write evaluations to
    `ai-agents/knowledge-base/eval-<topic-slug>.md` — i.e. the root, undated. **That line now violates
    this ADR outright** and must become `reports/YYYY-MM-DD-eval-<topic-slug>.md`, or the drift restarts
    on the next evaluation. Same class of check for `claude/skills/fkit-design-spec/SKILL.md:44`
    (`knowledge-base/design-<feature-slug>.md`).
  - `claude/scaffold/ai-agents/README.md:11` describes the knowledge-base loosely and should name the
    five subfolders, so new projects inherit the layout.
- The wiki's `[[systems/fkit]]` page does not know this convention exists and needs an ingest pass
  (already tracked as the wiki-sync task).

## Re-raise only if

- A genuinely new kind of durable knowledge-base document appears that the **six-way test has no answer
  for** — neither a project-defining document, a decision, a standing rule, an incident, a record of
  work, nor a superseded design. (A new *sub-kind* of record — say a benchmark run — is **not** a
  trigger: it is a report, and the slug carries the kind. A new *convention* is not a trigger either:
  it is a file in `conventions/`.)
- `reports/` grows past roughly 20–30 documents and browsing it stops working, at which point
  partitioning it by year or by kind becomes worth the boundary-quibbling it costs.
- `conventions/` grows to the point where nobody can hold the rules in their head (say, past ~6
  documents), which is a signal the conventions have started describing rather than prescribing —
  merge them, don't partition them.
- Tooling appears that reads the knowledge-base root as a flat index and needs a different layout.

Not a trigger: disliking `reports/` or `conventions/` as names; a one-off doc that is awkward to
classify (pick the closest bucket and move on); or the observation that `conventions/` holds only two
files — that was weighed and settled by the owner above.
