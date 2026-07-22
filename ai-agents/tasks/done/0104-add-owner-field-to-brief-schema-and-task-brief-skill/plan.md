# Plan — Task 0104: add a structured `## Owner` field to the brief schema and task-brief skill

## Context
`/fkit-status` should render **Owner** as a first-class field, and the owner ruled the value must come
from a **structured brief field** (like `## Status`), not scraped from board-row prose. Today no brief
has a `## Owner` heading; owner lives as free prose in board rows and `## Notes`. This task is the
**schema-and-tooling half**: define the field and make every *new* brief carry it. It does **not**
backfill existing briefs (task 0105) and does **not** change the render or add a dashboard drift check
(task 0106).

**Owner decisions at the plan gate (confirmed 2026-07-22):**
- `## Owner` is **MANDATORY**, documented mirroring `## Status`. (dashboard.sh enforcement deferred to 0106.)
- Value is an **ENUM of the seven live roles** — authoritative list, ADR-028's not-yet-built tester **excluded**.

## Approach
Mirror the existing `task-status-vocabulary.md` pattern exactly — it is the direct sibling (an
authoritative value list for a mandatory brief field, referenced by the analogous `## Status`). The
authoritative, reader/linter-findable home for the value list is a **new convention doc**, indexed in
the conventions README. The task-brief skill gains the field in its skeleton plus a populate step.

## Change surface (5 files)

### 1. NEW — `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md`
Authoritative value list, modeled on `task-status-vocabulary.md`. Contents:
- The **seven** valid owners: `fkit-producer`, `fkit-coder`, `fkit-architect`, `fkit-reviewer`,
  `fkit-adversarial-reviewer`, `fkit-wiki`, `fkit-lead` — one role name per brief, exactly one value.
- **Mandatory** on every brief; positioned **after `## Status`** in the brief file.
- ⚠️ Explicit note: **ADR-028's eighth role (tester) is decided-not-built — NOT a valid owner until it ships.**
- A **"Where this must be enforced"** section (mirroring the status vocab): task-brief skill populates
  it today; the dashboard `owner-missing` / invalid-value drift check is task **0106**, named as the follow-up.

### 2. NEW — `claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md`
**Byte-identical** copy of #1 — dual-home-parity requires it (conventions are dual-homed; only
`dual-home-parity.md` itself is fkit-repo-only). Missing this copy = incomplete change.

### 3. EDIT — `ai-agents/knowledge-base/conventions/README.md`
Add one row to the **"What's here"** table:
`[`task-owner-vocabulary.md`](task-owner-vocabulary.md) | the seven valid task owners, and that every brief carries exactly one`

### 4. EDIT — `claude/scaffold/ai-agents/knowledge-base/conventions/README.md`
Mirror the #3 row (byte-identical index change).

### 5. EDIT — `claude/skills/fkit-task-brief/SKILL.md` (canonical source; **never** the gitignored `.claude/` copy)
- **Step 4 skeleton** (the `## ID … ## Notes` block): insert `## Owner` **after `## Status`**.
- **Step 4 guidance:** add a bolded bullet next to the `## Status` bullet — `## Owner` is mandatory,
  populated at creation from the producer's existing owner decision, value **MUST** be one of the seven
  live roles (link `task-owner-vocabulary.md`), placed after `## Status` with the value on the next line.
  *(Folds the brief's "allocation/population step" into step 4 rather than a new numbered step — avoids
  renumbering steps 6–10 and their cross-references. Obvious winner: smaller, safer diff, same outcome.)*
- **Rules section:** add one line mirroring "Every new brief is 🔲 Backlog" — every new brief carries a
  populated `## Owner` from the role vocabulary.

## Deliberately out of scope (stated, not forgotten)
- **Top-level `ai-agents/README.md`** — documents the folder table, **not** the brief field schema, so
  the brief's "update README if it documents the schema" bullet does **not** fire. It is also already
  drifted vs its scaffold copy; the discoverable home is the conventions doc + conventions index. Left untouched.
- **`dashboard.sh`** — no `owner-missing` drift kind here; that is 0106. "Mandatory" is documentary in 0104.
- **Existing briefs / the `**Owner:**` `## Notes` line** — 0105.
- **The step-6 ID example** — truncates at `## Sprint` (above where Owner sits), so it needs no edit.

## Risks / edge cases
- **Dual-home parity is the main correctness risk** — #1↔#2 and #3↔#4 must stay byte-identical. Verify with `diff`.
- Must **exclude** the eighth tester role everywhere the list appears.
- Editing the canonical `claude/` skill source, not the gitignored `.claude/` refresh copy.

## Verification
1. `grep -n '## Owner' claude/skills/fkit-task-brief/SKILL.md` — present, and immediately after `## Status` in the skeleton.
2. `diff` #1 vs #2, and the added row in #3 vs #4 — identical.
3. Vocab doc lists exactly the seven roles and explicitly excludes the tester (`grep -c fkit- …`; assert no `tester`).
4. `git status --porcelain ai-agents/tasks/` — **empty** (no existing brief touched).
5. `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` — runs clean, same counts, **no new drift**.
6. Trace: the updated step 4 makes a new brief's `## Owner` present and populated with a valid role (docs internally consistent; no executable test exists for a markdown skill — stated honestly).

## Commit
None — all edits left in the working tree; the owner commits.
