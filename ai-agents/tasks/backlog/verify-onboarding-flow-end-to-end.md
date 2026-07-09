# Verify onboarding flow end-to-end

## Sprint
Sprint 1

## Priority
1 (highest this sprint)

## Status
🔲 Backlog

## Context

fkit's stated near-term goal is a *user-friendly startup sequence*. The pieces exist
(`install.sh` → `omnigent/fkit-init.sh` → scaffold + vendor bundles → `.fkit/run` → terminal intake
→ producer's `initiate-project` skill, which is what just ran in this session), but the owner flagged
that several parts have had fixes applied recently in a separate working session — a launch/tty
handling fix, browser-open behavior, and the terminal intake script — **none confirmed working
end-to-end in a real, fresh terminal**. This session (running inside an existing repo, as the
producer) does not exercise the *install* half of the flow at all (`install.sh`, `fkit-init.sh`,
`.fkit/run`'s first-run detection) — only `initiate-project` itself, which did complete successfully
here.

This is investigation/verification work, not new feature work — the goal is to find out what's
actually broken (if anything), not to build anything yet.

## What to build (verification, not implementation)

Run the flow for real, from a clean state, and record what happens at each step:

1. **Fresh-clone test**: in a scratch directory (not this repo), run the public path —
   `curl`-equivalent install or a local equivalent of `install.sh` against a throwaway target project
   — and confirm `omnigent/fkit-init.sh <project-root>` completes: scaffolds `ai-agents/`, drops
   `CLAUDE.md`/`AGENTS.md`, vendors the six bundles to `.fkit/agents/`, adds `.fkit/` to
   `.gitignore`, writes `.fkit/intake.md` tooling and `.fkit/run`.
2. **First-run launch**: run `.fkit/run` (default agent = producer) against that fresh scaffold and
   confirm: it detects the uninitialized `PROJECT.md`, runs the terminal intake, and launches the
   producer already seeded to trigger `initiate-project` — in particular, confirm the **tty/launch
   fix** actually results in a usable interactive terminal session (this is the part flagged as
   previously broken).
3. **Browser-open behavior**: confirm whatever browser-open step exists in the flow (if any — check
   `install.sh` / `fkit-init.sh` / `.fkit/run` for it) fires correctly and doesn't hang or error in a
   plain terminal.
4. **Full initiation**: let the seeded producer session run `initiate-project` against the fresh
   scaffold's placeholder `PROJECT.md`, through to a written `PROJECT.md` + `architecture.md` — this
   half is now proven to work *inside* a session (this repo's own run just did it); the open question
   is only whether it's reachable via the real entry point end-to-end.
5. Note the actual commands run and their output/exit codes — this becomes the evidence base for
   whether the "user-friendly startup sequence" goal is met, and for scoping any follow-up fix tasks.

## Verification steps

- A fresh target project, run through the full public entry point, ends with a filled-in
  `PROJECT.md` and a working producer session — no manual intervention beyond answering the intake
  questions and normal interactive prompts.
- Document exactly where (if anywhere) it breaks, hangs, or requires an undocumented workaround.

## Notes

- This is naturally a **fkit-coder** or owner-run verification task (it involves running shell
  commands and observing real terminal behavior), not something the producer can do itself.
- If this surfaces concrete bugs, they become their own follow-up task briefs — do not fix inline as
  part of "verification" without a brief; report findings back to the producer first so they can be
  scoped and prioritized against the rest of Sprint 1.
- Depends on nothing else in this sprint; the other two Sprint 1 tasks do not block on this one.
