# Fix stale agent-count docs and duplicated fresh-project detection

## ID
0040

## Sprint
Sprint 1

## Priority
8 (optional / low)

## Status
⛔ Cancelled (2026-07-11) — Omnigent removed: the drifted files are deleted, not fixed (ADR-009). Sprint 2 task 8 rewrites the docs against the post-removal reality.

## Owner
fkit-coder

## Context

Two small, unrelated-but-adjacent drifts in the install-path files, flagged by fkit-architect during
a follow-up architecture inspection (2026-07-10). Both cosmetic/harmless right now; bundled into one
ticket per the architect's own suggestion since both are small and touch the same family of files.

**(a) Stale agent-bundle counts.** `omnigent/fkit-init.sh` still says "six agent bundles" / "6 agents"
(comment at line 9, echo at line ~40, `printf` summary header at line ~209) even though `.fkit/agents/`
now vendors **seven** directories — the six teammates (producer, coder, reviewer,
adversarial-reviewer, architect, wiki) *plus* the `fkit-team` root bundle added since that text was
written. Worse than just a stale number: the `printf` summary block under the "6 agents" header only
lists **5** bullets (producer, coder, reviewer, architect, wiki) — it's missing both
`adversarial-reviewer` and `fkit-team` entirely, so it undercounts on two axes at once.

Note: the architect's original flag also named `vendor-agents.sh` as carrying the same stale text. A
pass over that file during brief-drafting did not turn up a hardcoded count — it enumerates the
vendored dest directory via `ls` rather than asserting a number, so it may not need a change. Confirm
before editing it; don't make a speculative change there without a real hit.

**(b) Duplicated fresh-project detection.** `.fkit/run` and `omnigent/fkit.sh` each independently
decide "is this a fresh project" via **different signals** for overlapping purposes (both gate
whether to run the terminal intake before launching):
- `.fkit/run`: `PROJECT.md` missing, or carries the `fkit:uninitialized` marker, or the placeholder
  title `# <Project name>`.
- `fkit.sh`: presence/absence of the `.fkit/agents` directory.

Both harmless today, but this is exactly the kind of drift that silently diverges later (e.g. one path
gets updated for a new "fresh" edge case and the other doesn't).

## What to build

- **(a)** Update `omnigent/fkit-init.sh`'s comment, echo, and `printf` summary block to reflect the
  real current bundle set: 7 vendored bundle directories under `.fkit/agents/` (`fkit-team` root +
  the six teammates). Fix the summary list so it enumerates all 7, not a stale subset of 5. Re-verify
  `vendor-agents.sh` for a hardcoded count before touching it (see note above).
- **(b)** De-duplicate the fresh-project detection between `.fkit/run` and `fkit.sh` — consolidate to
  one signal used by both if practical, or, if the two signals are intentionally different (e.g. one
  needs to work under a `curl | sh` install before any project files exist, the other runs against an
  already-cloned repo), add a short comment in both files cross-referencing the other and explaining
  why they diverge, so a future reader doesn't mistake it for accidental drift.

## Verification steps

- `grep -rn "six agent\|6 agent" omnigent/` shows only correct references to the six **teammates**,
  never a stale vendored-**bundle** count.
- `fkit-init.sh`'s summary block lists every bundle it actually vendors (`fkit-team` + all 6
  teammates).
- Either one shared signal is used by both `.fkit/run` and `fkit.sh` for "is this fresh", or both
  carry a comment explaining the intentional difference.
- Fresh install (`omnigent/fkit-init.sh .` against a scratch directory) still completes cleanly after
  the edit.

## Notes

- Natural owner: **fkit-coder** — unlike the two doc-template tasks above, this edits executable
  shell script logic (`fkit-init.sh`, possibly `.fkit/run`, `fkit.sh`), which is source-write
  territory, not prose documentation.
- Optional/low priority per the architect's own framing — only worth doing if someone's already in
  these files, otherwise fine to leave in backlog indefinitely.
