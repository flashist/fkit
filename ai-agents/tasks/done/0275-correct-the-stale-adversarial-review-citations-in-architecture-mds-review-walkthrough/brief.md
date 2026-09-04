# Correct the stale `fkit-adversarial-review` citations in `architecture.md`'s review walkthrough

## ID
0275

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-08-11**, given live via `AskUserQuestion` in a `fkit lead` session — **the option
label is the verbatim text**: **"File it as its own row"**.

The cluster was found while widening
[`0273`](../../backlog/0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md) from
five sandbox sites to eight, and was **deliberately not filed at that time** — it was surfaced to the
owner instead, because it is a **different defect class** (citation drift, not the ADR-042 sandbox
change) and does not sit on a line `0273` rewrites.

**The split was accepted in full.** `architecture.md:49` and `:372` stay folded into `0273` under its
bright-line rule — *fix a stale citation only where the line is already being rewritten*. **This brief
is the remainder, and nothing else.**

### The defect — measured on disk 2026-08-11

`ai-agents/knowledge-base/architecture.md` §*"4 — Review + the adversarial pass"*. The sentence spans
`:373-375`; **both citations sit on `:375`**:

> `` (`:128-135`; `claude/skills/fkit-adversarial-review/SKILL.md:57,111`). ``

| Citation | Measured state |
|---|---|
| `fkit-adversarial-review/SKILL.md:57` — cited for the fallback banner | ⚠️ **STALE.** `:57` is *"When you fall back, the **very first lines** of your reply…"*. The banner itself — `⚠️ [claude-fallback — NOT model-diverse] — THIS REVIEW IS INCOMPLETE.` — is at **`:61`**, in a block running `:61-64`. Drifted but adjacent; it lands in the right block, on the wrong line. |
| `fkit-adversarial-review/SKILL.md:111` — cited for the coverage self-assessment | ⚠️ **STALE.** `:111` is a bullet *"**problem** — one or two sentences…"*. The coverage self-assessment is at **`:114-115`**. |
| `` `:128-135` `` — the **bare** citation | ✅ **CORRECT — see the fence below.** |

### ⛔ THE FENCE — `:128-135` IS CORRECT. DO NOT "FIX" IT.

**This is the main reason this task exists as its own row rather than a one-line note.** The bare
`` `:128-135` `` resolves to **`claude/skills/fkit-review/SKILL.md:128-135`**, and that range was
measured and **is accurate**: it is the degradation template block containing
`**Decision: 🟡 Partial review — Codex unavailable**` and
`⚠️ [NOT model-diverse — INCOMPLETE] Codex was unreachable (<reason>)…`, which is exactly what the
sentence cites it for.

⛔ **A sweep that "corrects" all three citations because two of them are wrong will break the one that
is right.** That is a worse outcome than leaving the drift, and it is the specific failure this brief
is written to prevent. **Verify each citation independently against the file it names. Do not
pattern-match.**

### ⚠️ THE COUPLING — the bare citation inherits its FILE from `:372`, which `0273` rewrites

`` `:128-135` `` names no file. It reads as `fkit-review/SKILL.md` **only because the previous
sentence, on `:372`, cited `claude/skills/fkit-review/SKILL.md:38,57`.** The antecedent lives on a line
**this task does not own** — `0273` does.

**So there is a real interaction, in both directions, and the implementer must handle whichever they
land in:**

- **If `0273` has already run:** it was instructed to prefer the **durable quoted-text** citation form
  at `:372`. If it did, **`:372` may no longer carry a `fkit-review/SKILL.md:NNN` citation at all — and
  the bare `` `:128-135` `` on `:375` is then ORPHANED**, pointing at a file the reader can no longer
  identify. ⚠️ **Check this explicitly.** If orphaned, repair it by giving `:375`'s citation its own
  fully-qualified file reference. ⛔ Do not repair it by editing `:372` back — that is `0273`'s line.
- **If `0273` has NOT run:** give `:375`'s citation a **fully-qualified** file reference anyway. That
  makes `:372` and `:375` independent, so `0273` can rewrite `:372` freely and **cannot** orphan
  anything.

✅ **Either way the instruction is the same: `:375`'s citations end up naming their own files
explicitly.** Doing that is what dissolves the coupling.

### ⚠️ Line numbers go stale between filing and implementation — do not copy this brief's

**`0272` edits `claude/skills/fkit-adversarial-review/SKILL.md` at exactly these anchors** (`:53`,
`:61-64`, `:114-115` — its own brief lists them), and `0273` follows it. **Every `:NNN` measured above
will have moved by the time this task runs.** ⛔ **Re-measure at implementation time. Do not copy the
numbers in this brief into `architecture.md`.**

✅ **Better — and this is the point of the task: write the durable form instead.** This project's own
convention is that line numbers are *"dated anchors of convenience"* and **the quoted text is the
durable anchor**. Cite the file plus a short verbatim quote. That converts a citation that has now gone
stale at least twice into one that stops going stale. **A fix that lands fresh `:NNN` numbers is a fix
that will need doing again.**

## What to build

One edit, to one paragraph, in one file.

**`ai-agents/knowledge-base/architecture.md`, §*"4 — Review + the adversarial pass"*, the citation on
`:375`:**

1. **Correct the two stale `fkit-adversarial-review/SKILL.md` pointers** — the fallback banner and the
   coverage self-assessment — **re-measured, in the durable quoted-text form**.
2. **Give the correct `fkit-review/SKILL.md` degradation-block citation an explicit file reference**,
   so it no longer depends on `:372`'s antecedent. ⚠️ **This is a form change to a CORRECT citation, not
   a correction of it** — say so in the close, so no later reader thinks `:128-135` was wrong.
3. **Leave the prose itself alone.** The sentence's claim — degradation is loud, the review leads with
   the banner, not a footnote — is **accurate and stays**. Only the parenthetical citation changes.

### Constraints

- ⛔ **Do not touch `architecture.md:49` or `:372`.** Both are `0273`'s, under its bright-line rule.
  ⚠️ **`:372` is the line immediately above this task's** — a one-line separation between two briefs.
  See `## Notes` for the concurrency hazard.
- ⛔ **Do not sweep other citations in `architecture.md`.** This task owns one parenthetical. If you
  find further drift, **report it, do not fix it** — that is how this row came to exist.
- ⛔ **No `--sandbox` change of any kind.** That is `0273`. This task is independent of ADR-042 and the
  drift it fixes **predates it**.
- ⛔ **No edit to any `claude/skills/` or `claude/agents/` file.** The skills are correct; the *pointers
  into them* are wrong. If a skill file looks wrong, that is `0272`'s scope — **stop and report**.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit. ⛔ No new devDependency (ADR-014).
- ⛔ No task-file move (ADR-033), no re-rank, no board-row correction beyond this task's own close.

## Verification steps

1. **Each of the three citations was verified INDEPENDENTLY against the file it names**, and the
   verdicts are recorded one per line — not as a batch. Paste the measured evidence for each: the file,
   the anchor, and the text actually found there.
   ⛔ **If the verification does not separately confirm that the `fkit-review/SKILL.md` degradation-block
   citation is CORRECT, the task has not been done as briefed** — that confirmation is the deliverable's
   whole safety property.
2. **The correct citation was not changed in substance.** Show that it still points at the same
   degradation template block, and state explicitly that the only change was making its file reference
   explicit.
3. **The two stale pointers now resolve.** Follow each corrected citation and paste the text found —
   the fallback banner, and the coverage self-assessment.
4. **The citations are in durable form.** Quote the landed parenthetical. ⚠️ If it carries bare `:NNN`
   numbers and no quoted anchor, say why the durable form could not be used — do not let it pass
   silently, because the whole point of the row is that this stops recurring.
5. **The antecedent coupling is resolved.** State which order you landed in (`0273` before or after),
   whether the bare citation was orphaned, and show that `:375`'s citations now name their own files
   with no dependence on `:372`.
6. **`git diff` on `architecture.md` touches only the one parenthetical.** ⛔ `:49` and `:372` must be
   unchanged by this task — show it. ⚠️ If `0273` has already landed, those lines will differ from
   `main`; show they are unchanged **by this task's diff**, not that they match the old text.
7. **Full `npm test` green.** State the measured counts. ⚠️ Expect this to prove nothing about citation
   correctness — no test reads `architecture.md`'s citations. **Say so** rather than implying coverage.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **⚖️ ORDERING — a SOFT ordering, deliberately NOT a `Depends on:`. The reasoning, because the driver
  asked for it explicitly:**
  - **The work is independently doable today.** These citations are stale **now**, against the current
    tree, and the fix does not need `0272` or `0273` to have landed. Declaring a hard edge would be
    **inventing a gate to express a preference** — what tasks `0184` and `0149` warn against, and what
    `0272`/`0274` were both deliberately spared.
  - **The obvious argument for gating it — "avoid re-measuring twice" — is dissolved by the brief
    itself.** If the citations land in **durable quoted-text form** as instructed, `0272` and `0273`
    moving the anchors **does not re-stale them**, and the ordering stops mattering at all. A
    `Depends on:` would hard-code a workaround for a problem the task is supposed to eliminate.
  - **Safe in EITHER order**, with the antecedent check mandatory in both directions (see §"The
    coupling"). Running **before** `0273` is marginally the safer half, because fully qualifying
    `:375`'s citation first means `0273` **cannot** orphan it.
  - ⚠️ **The real hazard is CONCURRENCY, not order.** `0273` edits `architecture.md:372`; this task
    edits `:375`. **Three lines apart, same paragraph, two briefs.** Run in parallel they will collide
    — the `0229`/`0135` file-collision shape, at much closer range. **Do not have both open at once.**
    Recorded here rather than expressed as a false dependency edge, which would make the board render
    this row `after 0273` and imply a gate that does not exist.
- ⚠️ **This drift PREDATES ADR-042** and is independent of it. `0273`'s widening is what surfaced it, not
  what caused it. ⛔ Do not describe this task as ADR-042 follow-up work in its close.
- ⚠️ **This is at least the second staleness in this one paragraph** — `:372`'s pointers had already
  drifted too (they are `0273`'s to fix). A `:NNN` citation into an actively-edited skill file has now
  demonstrably failed twice here. **That is the argument for the durable form**, and it is worth one
  sentence in the close.
- **On merit:** the **Backlog**, unranked, and that is honest. Nothing waits on it, it touches no
  shipped code, no test reads it, and it is not on the release path. Sprint 5 is mid-flight with eleven
  open rows; appending there would land it below every one of them — a scheduled-looking row reached
  last, which is the trap Sprint 5's board documents and had to fix by re-ranking on 2026-08-11.
- **Line-number citations are dated anchors of convenience** (measured 2026-08-11); the durable anchors
  are the quoted text. ⚠️ **In this brief that warning is load-bearing, not boilerplate** — see above.
- Filed 2026-08-11 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the same
  day. It asked nothing, edited no `architecture.md` line, and committed nothing.
