# Evaluation: how to distribute the vendored `query` skill (ADR-006 revisit)

- **Date:** 2026-07-10
- **Author:** fkit-architect
- **Feeds:** ADR-006 amendment/supersession (recorded separately via `record-decision`)

## Problem

ADR-006 replaced ADR-005's six byte-identical copies of the wiki `query` skill with five relative
symlinks (`omnigent/fkit-{producer,coder,reviewer,architect,adversarial-reviewer}/skills/query ->
../../fkit-wiki/skills/query`), reasoning that Omnigent's skill discovery is symlink-transparent at
every layer checked. The owner hit a real, reproduced problem the ADR-006 investigation didn't
surface: **git refuses a pathspec that goes "beyond a symbolic link"** when a tracked directory (with
a tracked file inside it, e.g. `skills/query/SKILL.md`) is replaced by a symlink in the same change —
confirmed directly:

```
$ git add omnigent/fkit-adversarial-reviewer/skills/query/SKILL.md
fatal: pathspec 'omnigent/fkit-adversarial-reviewer/skills/query/SKILL.md' is beyond a symbolic link
```

A workaround exists (`git add` the symlink path itself, or `git add -A`) and was verified to stage the
deletion + new symlink correctly in one shot — but the owner's commit UI stages by individual file row
against the *old* nested path, hits the failure every time, and reasonably does not want every future
skill sync to depend on a workaround/muscle-memory fix. This is a recurring workflow-friction cost, not
a one-off fluke, so it's weighed here as a first-class cost of the symlink mechanism itself.

**Decision to make:** how should the six bundles' `query` skill be kept identical going forward —
revert to ADR-005's plain copies, adopt the owner's compile-script + drift-check idea, or something
else — and is it worth recording as an ADR-006 amendment.

## Constraints confirmed this session (grounding, not assumptions)

- `omnigent/vendor-agents.sh:1-38` copies each `omnigent/fkit-*/` bundle into a **consuming project's**
  `.fkit/agents/` via `cp -RP` (symlink-preserving). Every consuming project gitignores `.fkit/` by
  convention (`.gitignore:9`, confirmed in this repo, which self-hosts as a consuming project too) — so
  the git pathspec failure can only ever occur in the **canonical `omnigent/` tree**, never in a
  vendored `.fkit/agents/` output. This rules out "symlink only in the vendored output" as a fix for
  the actual failure (see Option C3 below).
- Every `fkit-*/config.yaml` documents canonical bundles as independently runnable directly —
  `omnigent run omnigent/fkit-coder` (`omnigent/fkit-coder/config.yaml:15-16`) — not only after
  vendoring. So each canonical bundle's `skills/query` must carry real, self-sufficient content
  (symlink or file) **in the canonical tree itself**; a design that leaves the canonical tree's five
  non-wiki bundles with no `skills/query` at all, injecting it only at vendor-time, would leave those
  bundles broken when run standalone. Not viable.
- Skill discovery is directory-presence auto-discovery (`sorted(skills_dir.iterdir())`, no explicit
  `skills: [...]` list in `config.yaml`) — confirmed via `omnigent/fkit-coder/config.yaml` inspection,
  consistent with ADR-006's own parser findings.
- `omnigent/validate-bundles.sh:1-46` is an existing **manual** pre-flight script (YAML-lints every
  `SKILL.md` frontmatter, runs `omnigent.spec.load` per bundle). **ADR-003 already decided** to wire it
  into GitHub Actions CI, but that workflow is **not yet implemented** — no `.github/workflows`
  directory exists in this repo today (confirmed). This matters for Option 2's mitigation story below:
  a drift-check added to `validate-bundles.sh` inherits automatic CI enforcement for free the moment
  ADR-003's pending workflow lands, with no new infra decision required.
- ADR-005's originally-accepted, named cost: "six copies of the same skill file must now be kept in
  sync by hand — no shared/base-config or shared-skill mechanism exists in Omnigent."

## Priorities (inferred from the owner's framing)

1. **Eliminate the git friction** — the trigger for this revisit; must not recur, not just be
   work-aroundable.
2. **Keep the single-source-of-truth guarantee ADR-006 wanted**, if achievable without the git cost.
3. **Don't introduce new process/infra the project doesn't already lean on** — fkit's existing
   convention is small, purpose-built shell scripts (`vendor-agents.sh`, `validate-bundles.sh`), not
   hooks or heavy CI.
4. **Low effort, easily reversible** — this is a small mechanism, not worth a large build.

## Option 1 — Revert to ADR-005: plain byte-identical copies, hand-synced

**How it works:** all six bundles carry a real `skills/query/SKILL.md` file. Editing the skill means
manually pasting the new content into all six. No script, no symlink, no build step.

**Pros:** zero git friction, permanently — there is never a symlink in the tracked tree, so the
directory→symlink pathspec failure cannot occur, not even in theory. Zero new tooling. Maximally
familiar, and it's the smallest possible diff from the current broken state (it's where the project
already was before ADR-006).

**Cons / costs:** exactly the cost ADR-005 named and accepted: **no mechanical way to detect drift.**
If a human edits the canonical file and forgets (or mistypes) even one of the five copy-paste edits,
nothing catches it — not `validate-bundles.sh`, not CI, not the skill loader (each bundle's `query`
loads fine on its own regardless of content). The five agents silently diverge in wiki-query behavior
until someone notices by inspection. This is the exact gap ADR-006 existed to close, and reverting
re-opens it with no new mitigation.

**Effort & reversibility:** trivial to implement (write identical content to 5 files); trivially
reversible later (delete files, symlink again) if the git cost is ever solved a different way.

## Option 2 — Owner's proposal: compile script + drift-check (recommended)

**How it works:**
- `omnigent/fkit-wiki/skills/query/SKILL.md` stays the one canonical source, unchanged.
- A **new** script, `omnigent/sync-vendored-skills.sh` — deliberately *not* a repurposing of
  `vendor-agents.sh`, whose documented job is copying a bundle set into a *consuming project's*
  `.fkit/agents/` (`omnigent/vendor-agents.sh:5-9`), a different concern from keeping the *canonical*
  tree's five sibling copies in sync with each other — overwrites the five sibling bundles'
  `skills/query/SKILL.md` with the canonical file's byte content, as plain regular files. Run whenever
  the canonical file changes (naturally: at each fkit version bump/rollout, per the owner's framing;
  also cheaply runnable ad hoc after any edit to the canonical file).
- `omnigent/validate-bundles.sh` gains a drift-check step: hash-compare each of the five copies against
  the canonical source; **fail loudly** (nonzero exit, printed diff-or-mismatch list) if any differ.
  This is the same "cheap, mechanical, script-based check" pattern the file already uses for frontmatter
  YAML validity — a natural extension, not a new category of tooling.

**Pros:** real, regular files in git, everywhere, always — the directory→symlink swap that caused the
original failure never happens again, by construction. Retains ADR-006's real win: editing is still
"change one file, run one script" rather than "hand-paste into five files," which is a much smaller
human-error surface than Option 1's manual process even before drift-checking is considered. And unlike
Option 1, drift is **mechanically detectable** — closing the exact gap ADR-005 accepted and ADR-006
tried (imperfectly) to close. Because ADR-003 already decided (not yet implemented) to run
`validate-bundles.sh` in CI, this option's drift-check gets **automatic, always-on enforcement for
free** the moment that workflow lands — no additional infra decision, no hook, no new CI design.

**Cons / costs:** a new, small script to maintain (~15 lines: loop + `cp`), plus a ~10-line addition to
`validate-bundles.sh` (hash-compare loop). Still depends on someone remembering to run the compile step
before committing a canonical-source edit — today that reduces to "remember to run
`validate-bundles.sh` before committing," the same manual-discipline dependency `vendor-agents.sh`
already carries for its own job; it closes automatically, not just partially, once ADR-003's CI lands.

**Effort & reversibility:** small (one new script + one validate-bundles.sh addition). Fully reversible
— delete the script and the copies remain valid plain files (falls back to Option 1's state, doesn't
break anything if abandoned later).

## Option 3 — Other alternatives considered and rejected

- **3a. Git pre-commit hook** that auto-runs the compile script and/or blocks a commit on detected
  drift. Would close the loop even *before* CI exists. **Rejected for now:** this repo has zero
  hook/CI infrastructure today (no `.github/workflows`, no `.git/hooks` beyond the untouched samples,
  confirmed) — adding a hook is a real new precedent (hooks aren't versioned by git by default; needs
  `core.hooksPath` wiring or a setup step), a materially bigger process change than Option 2 needs to
  solve the stated problem. Worth revisiting only if drift is later observed recurring *in practice*
  even with Option 2's CI-backed check — not needed to solve today's problem.
- **3b. CI-only drift check**, no local script. **Rejected as a distinct option** — it's not actually
  separate from Option 2; it's Option 2's own drift-check running under ADR-003's pending workflow.
  Folded into Option 2, not a competing approach.
- **3c. Keep symlinks, but only in the consuming-project vendored `.fkit/agents/` output, never in the
  canonical `omnigent/` tree.** The specific alternative the owner asked to have seriously weighed.
  **Not viable**, for the reason established in Constraints above: canonical bundles must be
  independently runnable via `omnigent run omnigent/fkit-coder` directly, which requires each
  canonical bundle's `skills/query` to already be self-sufficient in the canonical tree — a
  vendor-time-only symlink would leave the canonical bundles broken standalone. It also buys nothing
  functionally over Option 2: Omnigent's skill loader doesn't care whether five loaded `SKILL.md`
  files are the same inode or merely byte-identical; "one real file at runtime" is a cosmetic property
  here, not a functional one, so paying for it (a second sync mechanism, canonical-tree copies *and*
  vendor-time symlink injection) has no offsetting benefit.

## Comparison

| Dimension | Option 1: revert to plain copies | Option 2: compile script + drift-check | Option 3c: symlink only in vendored output |
|---|---|---|---|
| Eliminates git friction | Yes, permanently | Yes, permanently | N/A — not viable (breaks standalone `omnigent run`) |
| Single-source-of-truth guarantee | None — silent drift possible | Mechanical, CI-backed (once ADR-003 lands) | — |
| New process/infra | None | One small script + one validate-bundles.sh addition | — |
| Effort | Trivial | Small | — |
| Reversibility | N/A (already reversible either direction) | Fully reversible, degrades safely to Option 1 if abandoned | — |
| Fits existing conventions | Yes | Yes (extends existing script pattern) | — |

## Recommendation

**Option 2 — the owner's compile-script + drift-check idea.** It fully eliminates the git friction
(same as Option 1) while *also* closing the exact drift-detection gap ADR-005 accepted and ADR-006
tried and failed to close safely. The implementation cost over Option 1 is small (~25 lines across two
scripts) and fits the project's existing convention of small, purpose-built shell scripts rather than
introducing new hook/CI infrastructure.

**Main tradeoff accepted:** the drift-check's enforcement is manual (run `validate-bundles.sh`
yourself) until ADR-003's already-decided CI workflow is actually implemented — at which point it
becomes automatic with no further design work. Until then, this option's safety net is *stronger* than
Option 1's (a wrong copy is loudly, cheaply detectable the next time anyone runs the validator) but not
yet *airtight* the way full CI enforcement would make it. That gap is a known, already-decided,
pending item (ADR-003) — not a new open risk this decision introduces.

**Nothing here needs a spike** — both the compile script and the drift-check are small, mechanical, and
low-risk to implement directly.

## Next steps

- Record this as an ADR-006 amendment/supersession via `record-decision` (done in this session).
- Implementation (writing `omnigent/sync-vendored-skills.sh`, restoring the five copies as plain files,
  adding the drift-check to `omnigent/validate-bundles.sh`) is fkit-coder's, per the existing
  architect-designs/coder-implements split (ADR-004, ADR-005, ADR-006).
