# Build the producer-owned structure-check skill — read-only conformance report over spec + manifest

## ID
0245

## Sprint
Sprint 4

## Priority
Sprint 4 P4

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Implementation unit 4 of the `0241` design** — report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
§6, §8, §11. Authority (`AskUserQuestion`, live `fkit lead` session, **2026-08-06**):

- **Q4 — owning role, verbatim: "Yes, producer (Recommended)"** — the **producer** is custodian of
  the check-and-repair skill (it already owns the task-file lifecycle, ADR-033, and board hygiene —
  same custodianship); wiki-vault repairs are **always routed to `fkit-wiki`**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- **Q3 — trigger, verbatim: "Yes + yes (Recommended)"** — this on-demand check is **the repair's
  only entry point** (the launch notice, `0247`, is awareness-only).

**Scope split with `0246`:** this unit is the **check — read-only, always**. The consent-gated
propose-then-apply repair phase inside this same skill is unit 5 (`0246`), which is what needs the
`0242` licence. Building the check first keeps the read-only deliverable shippable on its own.

## What to build

1. **A new producer-owned `/fkit-*` skill** producing a **read-only per-file conformance report**
   over the install share's structure-spec (`0243`) + hash manifest (`0244`), the project's
   `ai-agents/` tree, and the root `CLAUDE.md`/`AGENTS.md`. Per-file outcomes, exactly the report
   §7 classes: **conforming / missing** (convergence's job — report, don't create) /
   **untouched-stale** (manifest-matched an older shipped version) / **owner-edited** (matched
   nothing) / **wrong-type** / **wiki-routed**.
2. **Class semantics per the spec's table (report §4):** owner-authored seeds existence-only, never
   content-checked; wiki-vault rows existence-only, `schema.md` content-check **report-only** with
   the repair routed to `fkit-wiki`; placeholders defer to init's `.gitkeep` rule; wrong-type is
   report-only.
3. **`CLAUDE.md`/`AGENTS.md` marker-elision hashing (report §8):** body hashed with the
   marker-delimited region elided, reusing the `marker_lines` whole-line recognition contract.
   **Malformed** marker set (begin without end, end without begin, several pairs) → **refuse to
   classify**, report the malformation (mirrors `merge_rules`' refusal contract). Markers **absent**
   → whole file hashes → classifies owner-edited. Either way **report-only, never repaired**.
4. **Skill ownership wired completely** — declare it to the **producer** in `skills_for_role()` in
   `claude/skills-for-role.sh`, and update every surface that ownership fact touches (the ADR-018
   hook's test matrix, the ADR-036 registry if it fires, the mirrors) — the `0111`→`0112` lesson:
   an unwired skill exists and the hook denies it to everyone.
5. **Safety-bar inheritance (report §9):** symlink refusal (`-L`-first), keep-out respect, non-fatal
   failure, and honest reporting — as testable behavior, with fixtures for: fresh (conforms),
   drifted-untouched, drifted-edited, renamed dir (both-exist limit stated), symlinked subdir /
   dangling symlink / file-where-dir-belongs (refuse loudly), keep-out entries, CRLF and chmod-000
   variants, markers absent / malformed / block-only-drift vs body-drift.

### ⛔ Out of scope

- ⛔ **Any mutation of the consuming project — this unit is read-only in every branch.** The repair
  phase is `0246`, gated on the `0242` licence. **No silent auto-update; no write of any checked
  file.**
- ⛔ Any launch-path change (`0247`).
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005) — the check *reads* vault paths for existence only.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. The skill exists under `claude/skills/`, owned by the **producer** in `skills_for_role()`; the
   ADR-018 hook test matrix covers it (producer allowed, at least one other role denied);
   `npm test` is green.
2. Run against a **conforming** fixture: report says so and **no file is touched** (`git status
   --porcelain` clean on the fixture).
3. Run against drifted-untouched vs drifted-edited fixtures: the two classify differently
   (untouched-stale vs owner-edited), driven by the manifest, with diffs shown for owner-edited.
4. Marker fixtures: malformed → refusal-to-classify reported; absent → owner-edited;
   block-only-drift does not mark an untouched body as edited (and vice versa).
5. Safety-bar fixtures pass: symlink / wrong-type refused loudly; keep-out respected; chmod-000 and
   CRLF variants behave per report §9.
6. Wiki-vault paths: existence-only; a nonconforming `schema.md` yields a report line routing to
   `fkit-wiki`; **nothing under `ai-agents/wiki-vault/` is written** in any fixture run.
7. The check phase never prompts for or applies a repair — grep the skill for any write action on
   checked paths and find none.

## Notes

- **Depends on:** `0243`, `0244`.
- **Blocks:** `0246`, `0248`.
- **Source of truth:** report §6 (role, read scope, ADR-005 preservation), §7 (classes), §8
  (marker mechanics), §9 (fixtures). Implement, do not re-derive.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint named by the owner;
  no re-rank (ADR-035).
