# Add a "Speak in simple terms" output-style preference for all agents

## Sprint
Sprint 2

## Priority
62

## Status
✅ Done

## Context

**The owner's ask (2026-07-18):** give every fkit agent a standing instruction — *"Speak in simple
terms"* — so agents use simpler, easier-to-understand words.

**This is the exact use case the task-29 shared-instructions investigation settled** ([findings rev 2](../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)):
to give every fkit agent a standing instruction, you write it in the shared context files — **no code,
no new mechanism.** The delivery channel is proven (session + spawned consult, 3/3). Two settled facts
shape *where* it goes:

- **It is a PREFERENCE, not a hard rule.** "Speak in simple terms" is an output-style preference, the
  same class as *"be extremely concise."* It belongs in the **`## Output style (every role, every
  session)`** section — which already exists in all four files — **not** in the "Universal hard rules"
  block. Placing a style preference among the hard rules would mis-signal its weight (preferences "lose
  every conflict"; hard rules never do).
- **"All agents" includes the Codex-run adversarial reviewer — so it must reach `AGENTS.md`, not just
  `CLAUDE.md`.** Task 29/30's lesson, verbatim: *"a shared layer for all agents that excludes the second
  model is misnamed."* The codex CLI reads root `AGENTS.md`; Claude-side agents read `CLAUDE.md`. The
  preference goes in **both**.

> **⚠️ CORRECTION added 2026-07-18 (implementation, review finding R1) — the four-file premise below
> is DISPROVEN. Read this before following it.** Verified against the tree at build time:
> `claude/scaffold/CLAUDE.md` and `claude/scaffold/AGENTS.md` contain **no `## Output style` section
> at all**; the section lives in **`claude/scaffold/universal-rules.md`**, and root `CLAUDE.md` /
> `AGENTS.md` carry it **inside the `<!-- fkit:begin-rules -->` markers, regenerated from that source
> on every launch**. Building as written would have hand-edited two generated files (**silently
> overwritten on the next `fkit` launch**) and two files with no such section.
> **Owner ruled 2026-07-18: build the one-file version** — edit `universal-rules.md`, then re-run init.
> The ruling and the reasoning are recorded in
> [`plans/add-speak-in-simple-terms-output-style.md`](../../plans/add-speak-in-simple-terms-output-style.md).
> The text below is preserved as **what the brief's author believed at scoping time**, not as
> instructions to follow.

**⚠️ Dual-home — the task-48/49 lesson applies.** The output-style section lives in **four** files:
- `CLAUDE.md` and `AGENTS.md` at the repo root (this repo's dogfood agents), and
- `claude/scaffold/CLAUDE.md` and `claude/scaffold/AGENTS.md` (shipped to every consuming project).

All four must carry the same line, or "all agents" is true in one home and false in the other.

**One scope decision for the owner (producer's recommendation inside):** *"for all agents"* most
naturally means **fkit-wide** — every deployment's agents, so it ships via the scaffold **and** applies
to this repo. **Recommendation: all four files** (scaffold + dogfood). The alternative — this repo only
(the two root files) — would mean consuming projects never get it, which contradicts "all agents." The
brief is written for all four; **owner to confirm** it should ship to consuming projects and not stay
local.

## What to build

- Add a **"Speak in simple terms"** preference to the **`## Output style (every role, every session)`**
  section of all four context files: root `CLAUDE.md`, root `AGENTS.md`, `claude/scaffold/CLAUDE.md`,
  `claude/scaffold/AGENTS.md`.
- Phrase it as a **preference at the same level as the existing bullets** — plain, short, e.g. "prefer
  simple, everyday words over jargon where a simpler word carries the same meaning" — and make explicit
  it is subordinate to the section's standing caveats (it **loses every conflict**, does not override a
  role's prescribed output forms — review reports, verdict lines, the six-beat briefing — and the
  owner's own style instructions still win).
- Keep the wording **byte-identical across all four files** so the dogfood and shipped copies do not
  drift (the task-48/49 parity concern).
- **Do not** add it to the "Universal hard rules" block, and **do not** route it through the task-31
  marker-managed rules block — that block is for hard rules; this is a preference.

## Verification steps

- All four files' `## Output style` sections contain the new preference, **byte-identical** wording
  (a diff of the four inserted lines shows no variation).
- It appears in **`AGENTS.md`** (both homes), not only `CLAUDE.md` — the Codex-side reach is present.
- It is in the output-style/preferences section, **not** the universal-hard-rules block, in every file.
- The preference is explicitly marked subordinate (loses conflicts; does not override prescribed forms
  or owner style) — consistent with the section's existing framing.
- No source code, launcher, skill, or `skills-for-role.sh` change; no `ai-agents/wiki-vault/` change.

## Notes

- **Owner: fkit-coder** — edits context files, including product source under `claude/scaffold/`.
- **Depends on: nothing** — the delivery channel (task 29) and the dual-home lesson (task 48/49) are
  settled facts, not blockers. **No investigation needed:** this is the "already met with zero new
  mechanism" case the task-29 findings describe.
- **Single brief, not split:** the same one-line preference across four files is one atomic change —
  splitting per-file would ship a state where some agents (or the second model) have it and others do
  not, which is precisely the "misnamed shared layer" failure. All four land together.
- Not a wiki change; a later fkit-wiki sync picks it up if the vault records output-style conventions.
