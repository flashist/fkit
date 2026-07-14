# Design a version-to-version migration mechanism

## Sprint
Sprint 2

## Priority
20

## Status
✅ Done

## Context

fkit has started changing the **shape of things it has already put on disk** — and it has no way to
carry an existing installation across those changes.

Sprint 2 alone did it repeatedly: the scaffold moved, `omnigent/` was deleted, and
[ADR-013](../../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md)
restructured the whole knowledge base — new folders, files moved and renamed. A project scaffolded
last week does not have `conventions/`, `reports/`, or `incidents/`. **Nothing today tells it to
create them.** `fkit update` (Sprint 2 task 2) updates the *tool*; it does nothing about the *project
layout the tool expects to find*.

The gap will widen every time the team makes a decision like ADR-013 — which is to say, constantly.

## ⚠️ Investigation first — do not implement from this brief

**This brief scopes an investigation, not a build.** There are real unknowns here (what actually needs
migrating, who runs it, what happens when it fails halfway, whether this is even the right shape), and
none of them are settled. **Nobody should write migration code until the findings are in and reviewed
with the owner.**

The sequence:

1. **Investigate** — fkit-architect, with the producer, establishes what the mechanism must actually
   do and what it must not. Findings land as a report, per ADR-013
   (`reports/YYYY-MM-DD-migration-mechanism.md`).
2. **Review with the owner** — the shape is agreed, and an ADR is recorded if the decision warrants
   one.
3. **Only then** is implementation scoped into its own task(s), decomposed to the smallest
   independently shippable units.

## An idea from the owner — to be critically evaluated, NOT a decision

> **The owner's explicit framing: this is an idea, not the final decision. It should be critically
> evaluated during the discussion, and it is entirely fine to reject it completely and propose
> something else instead.** Do not treat it as a spec, and do not let it anchor the investigation into
> validating rather than evaluating it.

The idea, as given:

- Keep a **`migration-current.md`** file. While working on the next version, if no `migration-current.md`
  exists, one is created. Every change that requires a *migration action* on an existing installation —
  creating a folder, renaming a file, moving a document — is written there as an **actionable item**.
- On release, `migration-current.md` is **renamed to `migration-X.Y.Z.md`** (the semver of the version
  just released), and a fresh `migration-current.md` is started for the next one.
- On update, the update process compares the **installed version** against the **new version**, and
  walks every migration file between them **in semver order, oldest to newest**, applying the action
  items. E.g. installed `0.0.1` → new `1.2.1` walks `migration-0.0.2` → `migration-0.1.0` →
  `migration-1.0.0` → `migration-1.1.0` → `migration-1.2.0` → then `migration-current.md` for the
  release in progress.
- Possibly a **dedicated migration agent** executes the steps, rather than a shell script.

**Owner's constraint on scope — this one is a decision, not an idea:** this mechanism is an
**fkit-development-internal** concern. It is **not** something published or shared with end users of
the fkit framework.

## What the investigation must answer

Treat these as the questions, not a checklist to agree with:

- **What actually needs migrating?** Enumerate real cases from Sprint 2 (the ADR-013 KB restructure,
  the scaffold extraction, the `omnigent/` deletion). Is the set big enough, and regular enough, to
  justify a mechanism at all — or would a short "upgrade notes" section and a manual pass have been
  cheaper? *A mechanism nobody needs is worse than the gap it fills.*
- **Who runs it, and when?** `fkit update` is the obvious hook, but that is the **end-user** path — and
  the owner has ruled the mechanism is fkit-development-internal. **These two facts are in tension and
  the investigation must resolve it explicitly.** Does the migration run in a consuming project on
  update (applying fkit's migrations to the user's `ai-agents/` tree), with only the *authoring*
  workflow being internal? Or does it never touch a consuming project at all — and if so, what is it
  migrating? *Do not paper over this; it is the load-bearing ambiguity in the whole brief.*
- **Natural-language instructions, or executable steps?** An agent reading actionable items from
  markdown is flexible and unverifiable. A script is verifiable and rigid. What are the failure modes
  of each when the migration runs against a project that has been edited by hand?
- **What happens when it fails halfway?** Migrations that move files and die in the middle are a
  well-known way to destroy a working tree. Idempotency, dry-run, rollback, refusal-to-run on a dirty
  tree — which of these are actually required?
- **Where does the version come from?** `package.json`'s `version` is the git-tag version, and
  Sprint 2 task 2's self-update already reads it. Whatever is chosen must not fight that.
- **Does the semver-walk assumption survive contact with reality?** It presumes every released version
  has a migration file or is safely skippable, and that migrations compose in order. Verify, don't
  assume.

## Verification steps

*(For the investigation. Implementation gets its own tasks, with their own verification.)*

- A findings report exists at `ai-agents/knowledge-base/reports/YYYY-MM-DD-migration-mechanism.md`,
  grounded in the **actual** Sprint 2 migration cases, not hypotheticals.
- It gives a clear recommendation with its main tradeoff — including, if the evidence points that way,
  **"build nothing."**
- The owner's idea is **evaluated on its merits and explicitly accepted, amended, or rejected**, with
  reasons. A report that quietly implements it without evaluating it has failed this brief.
- The `fkit update` / development-internal tension is **resolved and stated**, not left implicit.
- Implementation tasks are scoped only **after** the owner has reviewed the findings.

## Notes

- **Owner: fkit-architect** (investigation), with the **producer** on scope, and the **owner** on the
  decision. The producer writes the follow-up implementation briefs once the shape is agreed.
- **Depends on:** nothing hard. Task 2 (self-update) is already done and is the most likely hook, so
  read it first. ADR-013 and task 10 are the **live worked example** — a project scaffolded before
  today needs exactly this to gain `conventions/`, `reports/`, and `incidents/`.
- **Do not scope implementation in this task.** If the investigation produces an obvious build, that
  is a *finding*, not a licence — it still goes back to the owner before anyone writes code.
- Risk of getting this wrong: **high.** A migration mechanism that runs unattended against a user's
  project and moves files is one of the few things in fkit that can *destroy work*. That is the
  strongest argument for investigating before building.
