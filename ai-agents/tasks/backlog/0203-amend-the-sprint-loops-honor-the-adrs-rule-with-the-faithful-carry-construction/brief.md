# Amend the sprint loop's *"Rules that make this honor the ADRs"* with the faithful-carry construction

## ID
0203

## Sprint
Sprint 2

## Priority
181

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 2 of [`0162`'s decision report](../../../knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md)**
(§10 row 2, §2, §4). `0162` was a decision task; **this is the prose edit its ruling authorizes.**

The rule as it stands — `claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-02:110-116`, under the
heading *"Rules that make this honor the ADRs:"* at `:109` — says the Build and Process-review spawn
prompts *"MUST each carry the approved plan verbatim"* and **gives no construction for satisfying it**.
That is the whole of `0162`'s finding: the requirement fired zero times in the very run that installed it,
failing twice in consecutive rounds — once by carrying **by reference** to conversation state, once by
pasting with **~10 silent truncations** under an explicit *"everything else is byte-for-byte"* claim.

### The ruling this task writes down

**A faithful carry is a copy operation over a durable artifact, never recall over conversation state.**

## What to build

Amend the *"Rules that make this honor the ADRs"* bullet in
`claude/skills/fkit-sprint-ship-loop/SKILL.md` so it states the construction. **All six elements below
are required — an amendment that drops any one of them has not landed this task.** ⚠️ **A seventh was
added 2026-08-03** (see below the six) — **seven in total now**, and the same all-or-nothing rule applies
to it.

1. **A byte-exact read** of `<task-folder>/plan.md` — a `Bash(cat …)`-class read. **⚠️ Explicitly NOT the
   `Read` tool**, and the rule must say why: `Read` returns `cat -n`-framed output (line numbers and tabs
   prepended, so the bytes are not the file's bytes) and caps at 2000 lines by default.
2. **A mandatory whole-file check** — verify the whole file was read, e.g. against `wc -c`. A read that
   silently stopped short is round 2's failure with a different cause.
3. **Paste the bytes unaltered** into the spawn prompt.
4. **Cite a pointer** alongside the paste: the `plan.md` path plus its `git hash-object` blob hash.
   (`git hash-object` works on untracked files, which is what these are.) **Both the paste and the
   pointer — the owner rejected pure by-reference.**
5. **The "verbatim"-word discipline, stated as a governing rule:**
   ***"verbatim" is a word a driver may apply only to bytes it read from a file that turn.***
6. **The pointer-only degraded form**, and its bound: if the plan is too long to paste, the driver emits
   the **pointer alone** and says so. **Truncation is never permissible** — never a partial paste, and
   never a completeness claim over bytes that were cut. A truncation that announces itself is a defect; a
   truncation that certifies itself is a lie the reader cannot check.

### ⚠️ ADDED 2026-08-03 — element 7: a check that BOTH legs are actually PRESENT, not merely announced

**Required, on the same footing as the six above.** Elements 3 and 4 make the carry two-legged — a paste
**and** a pointer. Nothing in the construction makes a driver **confirm both legs are in the prompt it is
about to send**. Announcing a two-legged carry and shipping one leg is not a hypothetical.

**Evidence — it happened on `0202`'s own run, 2026-08-02.** The sprint driver announced the approved plan
was carried *"BOTH ways — paste and pointer"* and **shipped the pointer only**. That is the same shape as
the false certification `R4b` exists to prevent: a completeness claim the reader cannot check, made over a
carry that was not complete.

**⛔ The most important part, and the reason this is element 7 rather than an argument against the
construction:** **the pointer is what made it detectable.** With a paste and no pointer — the shape used
on `0158`, `0143` and `0195` — nothing would have surfaced the defect at all. **The two-legged
construction produced the evidence of its own first failure.** Read it as support for elements 3 and 4,
never as a case for dropping either.

So the rule must additionally require:

7. **A presence check on both legs before the spawn.** The driver confirms, in the prompt it is about to
   send, that the pasted bytes **and** the path + `git hash-object` pointer are **both actually there** —
   and it states the result. **A driver may not describe a carry as two-legged on the strength of
   intending it.** This is the same discipline as element 5, applied to the carry's shape rather than to
   the word *verbatim*: **"both ways" is a phrase a driver may use only after looking at what it wrote.**
   - In the **pointer-only degraded form** (element 6) the check confirms the pointer is present **and**
     that the degraded form was declared. Degraded is a state to announce, not a gap to leave silent.

**⚠️ MANDATORY, in the rule text itself — not in a footnote, not in the worklog:** the emitted pointer
must be marked **`unverified — no hook checks it until follow-up 3 lands`**. This is an **owner ruling**:
this amendment **ships without waiting for `0204`**, and that wording is what stops a self-computed,
self-reported hash from being mistaken for a checked one in the window between the two.

⛔ **Out of scope:** condition **(b)** of the declared-approval marker — it **stands byte-unchanged**
(`claude/agents/fkit-coder.md@2026-08-02:65-66`), and `0163` needs no edit as a result. Do not touch
`fkit-coder.md`, do not build a hook (`0204`), do not touch the Build row (`0164`/`0202`), do not touch
`ai-agents/wiki-vault/`.

⚠️ **This brief's `path@date:line` coordinates were verified 2026-08-02. Re-verify at implementation
time** — `0202` and `0164` both edit this same file and will move these lines.

## Verification steps

1. The amended rule names a **byte-exact read** and **explicitly excludes the `Read` tool**, stating the
   `cat -n` framing **and** the 2000-line cap as the reasons.
2. It requires a **whole-file check**.
3. It requires **paste + path + `git hash-object` pointer** — both, not either.
4. It states the "verbatim"-word discipline in a form a reader can apply: the word attaches only to bytes
   read from a file that turn.
5. It states the **pointer-only degraded form** and that **truncation is never permissible**.
5b. **(element 7, added 2026-08-03)** It requires the driver to **confirm both legs are actually present
   in the prompt before spawning**, and to state the result — including, in the degraded form, that the
   degradation was declared. A rule that only *describes* a two-legged carry without requiring the check
   has **not** landed element 7.
6. **The `unverified — no hook checks it until follow-up 3 lands` marker is present in the rule text
   itself.** Grep for it. Absent = this task failed.
7. **Change surface is exactly one file** — `claude/skills/fkit-sprint-ship-loop/SKILL.md`. `git status`
   and `git diff --stat` show nothing else.
8. `node --test test/skill-frontmatter.test.js` passes (frontmatter undisturbed), and `npm test` is green.
   Record the counts.

## Notes

- **⚠️ Scope grew 2026-08-03; the rank did NOT.** Element 7 was added after a driver-carry defect on
  `0202`'s run (announced *"BOTH ways — paste and pointer"*, shipped **pointer only**). Per ADR-035 a
  spawned producer does not re-rank. **On merit the addition does not move this row** — it makes an
  existing required element checkable rather than adding new territory, and `0203` already sits directly
  below `0202` on merit. Flagged so the owner can say otherwise.
- **Depends on:** `0202` — the construction points at a `plan.md` that must exist **at spawn time**, which
  is exactly what `0202` arranges. Writing this rule first would mandate pointing at a file that is not
  there yet.
- **Blocks:** nothing hard. `0204` is gated on `0202`, not on this.
- **⚠️ Priority 181 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0202`**, wherever the owner places that row — the two are one
  fix in two shippable halves, and this half is worthless before the first.
- **⚠️ Ships knowingly incomplete.** Between this landing and `0204` landing, the emitted pointer is
  **self-reported and unchecked**. That is the owner's ruling, and the required marker in the rule text is
  the whole of what makes it honest.
- **Source:** `0162`'s decision report §10 row 2, §2 (the construction), §4 (length / degraded form),
  §5 (condition (b) survives).
