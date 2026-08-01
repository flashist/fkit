# Dual-home parity — fkit-authored files that live in two trees

> **An fkit-authored file that exists in both `ai-agents/` and `claude/scaffold/ai-agents/` must be
> edited in both, in the same change.** Editing only the live copy ships a stale file to every project
> fkit sets up from then on.
>
> Approved by the owner on 2026-07-19, from
> [`reports/2026-07-18-dual-home-parity-live-vs-scaffold.md`](../reports/2026-07-18-dual-home-parity-live-vs-scaffold.md)
> (task 49). This is the process half of that ruling; the other half is the mechanical parity test
> `test/dual-home-parity.test.js`, **built by task 0133 on 2026-08-01** — see "Where this is enforced".

## Why there are two homes at all

`ai-agents/` is fkit's **own** working structure — this repo dogfoods its agents on itself.
`claude/scaffold/ai-agents/` is the **template** a consuming project receives at init
(`claude/fkit-claude-init.sh`). Some content is genuinely the same document in both places, and that
content is what this rule governs.

## The rule

When you edit a file under `ai-agents/`, check whether the same path exists under
`claude/scaffold/ai-agents/`. If it does, and the file is **fkit-authored** (below), **edit both copies
in the same change.** A change that touches one and not the other is incomplete, not merely untidy.

The same applies in reverse, and to **new** files: an fkit-authored convention, README, or schema
created in one home must be created in the other.

## Which files this covers — the litmus

Not everything in both trees should match. The distinction is **who the content belongs to**. There
are **three** kinds, not two:

- **fkit-authored** — the same document in both places, word for word. fkit wrote it, and a consuming
  project should receive exactly what fkit uses. ✅ **Must be byte-identical.**
- **Audience-adapted** — the same document in both places, but the scaffold copy is a deliberate
  **de-fkit-ified rewrite for a consuming reader**: fkit's incident narratives, task and ADR
  provenance, and relative links into `tasks/`/`sprints/` are stripped on purpose. ✅ **Must stay in
  step in SUBSTANCE, and must NOT be byte-aligned** — copying the live text over would ship broken
  links and fkit-internal history into every consuming project. *(Recognized by owner ruling
  2026-08-01, task 0132. The two-kind litmus above was written first and did not have a slot for
  these five-plus files; byte-aligning them was considered and rejected as a product regression.)*
- **Project-specific** — the scaffold copy is a **placeholder** the consuming project fills in with its
  own content. ⛔ **Must NOT be synced.** Copying the live version would ship fkit's own project data
  into someone else's repo.

| Path | Kind | Parity |
|---|---|---|
| `knowledge-base/conventions/priority-is-rank-not-identity.md` | fkit-authored | ✅ must match |
| `knowledge-base/conventions/task-owner-vocabulary.md` | fkit-authored | ✅ must match |
| `tasks/README.md` | fkit-authored | ✅ must match |
| `wiki-vault/schema.md` | fkit-authored | ✅ must match |
| `README.md`, `knowledge-base/conventions/{task-status-vocabulary,one-skill-one-output,evidence-before-assertion,status-report-format,dependency-declaration-form}.md` | **audience-adapted** | ✅ substance must match; ⛔ never byte-aligned |
| `knowledge-base/conventions/README.md` | **index** | its "What's here" table lists each home's *actual* contents, so the two copies legitimately differ |
| `knowledge-base/conventions/dual-home-parity.md` (this file) | **fkit-repo-only** | ⛔ never ship — see below |
| `knowledge-base/architecture.md` | **live-only** | each project generates its own via `/fkit-inspect`; the scaffold ships none |
| `knowledge-base/PROJECT.md` | **project-specific** — the scaffold copy is the placeholder brief that `/fkit-initiate-project` replaces | ⛔ never sync |
| `wiki-vault/index.md`, `wiki-vault/log.md` | **project-specific** — the scaffold copies are an empty catalog and an empty activity log | ⛔ never sync |
| `knowledge-base/{decisions,history,incidents,reports}/`, `sprints/`, `tasks/{backlog,done,cancelled}/`, `wiki-vault/wiki/` | **project-specific** — scaffold holds only `.gitkeep`; the live tree holds fkit's own ADRs, reports, briefs and wiki pages | ⛔ never sync |
| `.fkit/`, `tasks/backlog/.fkit`, `wiki-vault/.fkit` | **runtime-state** — launcher bookkeeping written by `claude/fkit-claude.sh` at run time, in three locations | ⛔ never sync — generated, not authored |
| `wiki-vault/.wiki-watermark` | **runtime-state** — the commit SHA `/fkit-wiki-sync` uses as its since-point; per-repository, meaningless in a fresh scaffold | ⛔ never sync |
| `knowledge-base/.gitkeep` | **runtime-state** — a git placeholder in the live tree only; the scaffold's `knowledge-base/` is non-empty so it needs none | ⛔ never sync — structural, not content |

> ⚠️ **This table is a MIRROR, not the source of truth.** The authoritative, machine-readable list —
> one entry per path, each with its own specific reason — is
> [`test/dual-home-parity-exceptions.mjs`](../../../test/dual-home-parity-exceptions.mjs) (task 0132).
> The parity test reads that module; where the two disagree, the module wins and this table is stale.
>
> **The mirror is COMPLETE as of 2026-08-01: all 26 module entries appear above** — 16 file entries and
> 10 directory entries, the latter written with a trailing `/`. The five `runtime-state` rows were
> missing from the first draft of this table; a partial mirror is worse than none, because a reader who
> cannot find a path here concludes it is enforced when the module says it is not. **If you add an
> entry to the module, add its row here in the same change.**
>
> **A previous version of this table listed `reviews/README.md` as ✅ must-match. That row was wrong**
> — `ai-agents/reviews/` was absorbed into `ai-agents/tasks/` by the ADR-029 folder migration
> (commit `331f298`, task 76) and that file exists in neither home today. Its successor `tasks/README.md`
> is byte-identical in both homes and is listed above. Do not assert on `reviews/README.md`.

**If you are adding a file and cannot tell which kind it is, ask:** *would a brand-new project want this
exact text on day one?* Yes → fkit-authored, dual-home it. **Mostly, but the text names fkit's own
tasks, ADRs or incidents** → audience-adapted: ship a generalized copy and add an entry to the
exceptions module saying what differs. No → project-specific, scaffold gets a placeholder or nothing.

## Checking parity

```sh
diff -rq ai-agents claude/scaffold/ai-agents
```

**Every reported line must map to an entry in
[`test/dual-home-parity-exceptions.mjs`](../../../test/dual-home-parity-exceptions.mjs)** — an exact
`path` match, or a descendant of one of that module's directory entries. Anything left over is drift.
This holds for **both** line shapes `diff -rq` emits: `Files … differ` **and** `Only in …`.

> ⚠️ **Do NOT filter the `Only in ai-agents` lines away.** This document used to prescribe
> `… | grep -v '^Only in ai-agents'`, and stated that such lines *"are expected and not drift"*. That
> made the check **structurally blind to a whole class of drift**: a dual-homed file present live and
> missing from the scaffold appears as exactly an `Only in ai-agents/…` line. It hid
> `conventions/dependency-declaration-form.md`, which was absent from the scaffold for weeks in plain
> violation of this very rule, until task 0132 found it by reading rather than by running the check.
> The exceptions module replaces the grep: the bulk `Only in` noise (ADRs, sprints, task briefs, wiki
> pages) is covered by its `project-content-dir` entries, so it can be *classified* away instead of
> *filtered* away.

Task 0133 mechanized this as `test/dual-home-parity.test.js`, which reads the same module — so the
`diff -rq` walk-through above is now the *manual* form of a check the suite runs on every `npm test`.

## Where this is enforced

- **At scoping — `/fkit-task-brief`.** A brief whose write surface touches a dual-homed path must name
  **both** copies. *(Skill edit pending — the producer scopes it, owner: fkit-coder.)*
- **Mechanically — a parity test.** `test/dual-home-parity.test.js` under
  [ADR-014](../decisions/adr-014-how-fkit-tests-itself.md) (`node --test`, zero devDeps): asserts every
  dual-homed file not covered by the exceptions module is byte-identical. **Built — task 0133,
  2026-08-01.** It walks the **union** of both homes (so a file missing from either side fails), derives
  the enforced set rather than hard-coding it, and carries a **tripwire**: no blanket directory
  exception may hide a non-`.gitkeep` file that is in fact present in both homes. Its four mutations
  (10–13) are proved red in `test/prove-red.sh`. The reconciliation it depended on (ADR-027 §Decision
  3's binding order) was **task 0132**, which landed the exceptions module and shipped
  `dependency-declaration-form.md` to the scaffold. *(Both were producer-scoped briefs, owner:
  fkit-coder.)*

**Before task 0133 this convention was enforced only by reading it.** That was the weaker half of
[ADR-016](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md)'s
*delivery structural, compliance advisory* — stated plainly rather than implied.

## This document is deliberately NOT dual-homed

Applying its own litmus: *would a brand-new project want this text on day one?* **No.** A consuming
project has a single `ai-agents/` tree and **no `claude/scaffold/`** — the two-home problem is a
property of the fkit framework repo itself, not of any project using fkit. Shipping this file would
hand consumers a rule about directories they do not have.

So `dual-home-parity.md` lives **only** in the live tree, and that is correct, not drift. **The parity
test's exception list must include it**, and the live `conventions/README.md` index marks it
fkit-repo-only for the same reason.

*(This is the general case, not a special case: a convention governing fkit's **own** development is
fkit-repo-only; a convention governing **how the agents work** is dual-homed. Every other convention
here is the second kind.)*

*(The "Known drift at the time of writing" snapshot that used to close this document was **deleted by
task 0132**, exactly as it instructed: it was a snapshot, not part of the rule, and reconciliation has
landed. Its census is superseded by the exceptions module. One correction worth carrying: it called the
six files "out of step" and expected them to be byte-aligned — five of the six are **audience-adapted**
and were correctly divergent all along. ADR-027's "six drifted files" figure is stale **in kind, not in
count**; all six still differ today, and none were fixed by tasks 0043/0077/0086. Amending ADR-027 is an
architect/owner act and is **not** done here.)*
