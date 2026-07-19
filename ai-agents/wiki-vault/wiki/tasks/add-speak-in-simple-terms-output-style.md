# Add a "Speak in simple terms" output-style preference for all agents

**Source**: `ai-agents/tasks/done/add-speak-in-simple-terms-output-style.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 62

## Goal
Give every fkit agent a standing instruction — *"Speak in simple terms"* — so agents prefer plain, everyday words over jargon.

## Key Changes
This is the exact case the **task-29 shared-instructions investigation** settled: to give every agent a standing instruction, you **write it in the shared context files — no code, no new mechanism**. Two settled facts fixed its placement:

- **It is a PREFERENCE, not a hard rule.** Same class as *"be extremely concise"*, so it belongs in the **`## Output style`** section, **not** the universal-hard-rules block. Preferences *"lose every conflict"*; hard rules never do — placing it among the hard rules would mis-signal its weight. It is explicitly marked subordinate: it loses conflicts, does not override a role's prescribed output forms (review reports, verdict lines, the status briefing), and the owner's own style instructions still win.
- **"Simplifying is about wording, never about content"** — it does not drop a caveat, soften a failure, or round a number, and never replaces a precise term with a vague one that only sounds friendlier. Load-bearing terms (filenames, markers, ADR ids, status values) are used and glossed once.

## Outcome
Done — **but the brief's central premise was disproven at build time, and the shipped shape is different from the shape scoped.**

⚠️ **The four-file premise was wrong.** The brief specified an atomic edit across four files — root `CLAUDE.md`/`AGENTS.md` and `claude/scaffold/CLAUDE.md`/`AGENTS.md` — on the belief that each carried its own `## Output style` section. Verified against the tree at build time (review finding R1): **the scaffold's `CLAUDE.md` and `AGENTS.md` contain no `## Output style` section at all**; the section lives in **`claude/scaffold/universal-rules.md`**, and the root files carry it **inside `<!-- fkit:begin-rules -->` markers, regenerated from that source on every launch**.

**Building as written would have hand-edited two generated files — silently overwritten on the next `fkit` launch — and two files with no such section.** The owner ruled 2026-07-18: **build the one-file version** — edit `universal-rules.md`, then re-run init. The brief's original text is preserved as *what its author believed at scoping time*, explicitly marked as not instructions to follow.

This is the second time a brief's stated premise shipped false and was caught only at implementation (the first was task 27's rationale) — the `evidence-before-assertion` lesson recurring at the scoping seam rather than the implementation one.

## Related
- [[tasks/add-dumb-down-skill-for-six-roles]] — task 72, the on-demand counterpart; owner ruled both, neither folds into the other
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the delivery channel this uses; *"a shared layer excluding the second model is misnamed"*, hence `AGENTS.md` reach
- [[tasks/add-shared-instructions-layer-for-all-agents]] — task 29, the investigation that settled "no new mechanism"
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] — task 31, the marker-managed block this preference deliberately does **not** route through
- [[tasks/give-codex-the-universal-hard-rules]] — task 30, why the Codex-side `AGENTS.md` reach matters
- [[tasks/stop-agents-asserting-unchecked-repo-state]] — the `evidence-before-assertion` convention this task's correction re-proves
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the dual-home concern the brief invoked; the real structure is a single generated source
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
