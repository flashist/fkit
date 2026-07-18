# Plan — Add a "Speak in simple terms" output-style preference for all agents

**Task:** [`add-speak-in-simple-terms-output-style.md`](../tasks/done/add-speak-in-simple-terms-output-style.md)
· **Sprint 2, priority 62** · **Approved by the owner: 2026-07-18**

## ⚠️ The brief's "What to build" was factually wrong, and the owner ruled on the correction first

The brief instructs editing **four** files — root `CLAUDE.md`, root `AGENTS.md`,
`claude/scaffold/CLAUDE.md`, `claude/scaffold/AGENTS.md` — and asserts the `## Output style` section
"already exists in all four." Verified against the tree, it does not:

- `claude/scaffold/CLAUDE.md` and `claude/scaffold/AGENTS.md` contain **no** `## Output style` section
  (0 matches each).
- The section lives in **`claude/scaffold/universal-rules.md:12`** — a single source.
- Root `CLAUDE.md` and `AGENTS.md` carry it **inside the `<!-- fkit:begin-rules -->` marker block**,
  which `fkit-claude-init.sh` **regenerates from `universal-rules.md` on every launch**.

Building the brief as written would have hand-edited two generated files — **silently overwritten on
the next `fkit` launch** — and two files with no such section. **Escalated before writing any code.**

**Owner ruling (2026-07-18): build the one-file version** — edit `universal-rules.md`, then re-run init
to regenerate the dogfood copies.

## The change

1. **`claude/scaffold/universal-rules.md`** — one bullet added to `## Output style (every role, every
   session)`, after "Loud is placement":

   > **Speak in simple terms.** Prefer plain, everyday words over jargon wherever a simpler word
   > carries the same meaning. Where a term is genuinely load-bearing — a filename, a marker, an ADR, a
   > status value — use it and gloss it once, in a few words. **Simplifying is about wording, never
   > about content:** it does not drop a caveat, soften a failure, or round a number, and it never
   > replaces a precise term with a vague one that only sounds friendlier.

   *(Quoted verbatim from the source. Review R5 caught an earlier paraphrase here that dropped "in a
   few words" — a plan that misquotes the thing it approves is a plan the owner did not approve.)*

   The content clause is deliberate: "simpler" is the most plausible excuse an agent could reach for to
   drop a caveat, and this section's own "concision is not omission" rule already guards the same seam.
2. **Re-run `bash claude/fkit-claude-init.sh .`** to regenerate root `CLAUDE.md` / `AGENTS.md`.

**Not done:** no edit to `claude/scaffold/CLAUDE.md` / `AGENTS.md` (they carry no such section — init
injects the block); **not** added to the Universal hard rules block (it is a preference, and placing it
among rules that "never yield" would mis-signal its weight).

## Why one source is *better* parity than the brief asked for

The brief's verification step — "byte-identical wording across four files, a diff shows no variation" —
becomes **moot by construction**: there is one source and the rest are generated. Byte-identity is no
longer something to check and re-check on every future edit; it cannot drift.

## Verification

- The preference appears in `universal-rules.md`, root `CLAUDE.md`, root `AGENTS.md` — **byte-identical**
  (diff-verified pairwise).
- It reaches **`AGENTS.md`**, which the codex CLI reads — so the Codex-run adversarial reviewer gets it.
  (Task 29/30's lesson: a shared layer that excludes the second model is misnamed.)
- It sits **inside `## Output style`, not the hard-rules block**, in both root files (line-position
  assertion, not eyeballing).
- **Idempotency:** init run 3×; exactly one marker block and one occurrence in each file.
- Only `AGENTS.md` and `CLAUDE.md` changed as a result of init — no collateral writes.
- `npm test` green.

## Scope boundary

Context-file text only. No source code, launcher, skill, or `skills-for-role.sh` change; no wiki write;
no task-file move; no commit.
