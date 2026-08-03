# Plan — 0195, correct ADR-010's `skills_for_role()` source-of-truth claim

**Status:** APPROVED by the owner via `AskUserQuestion` in the live `fkit-lead`
`/fkit-sprint-ship-loop` driver session, **2026-08-02** ("Approve as planned"), and relayed to this
worker in its spawn instruction. A spawned worker has no owner channel (ADR-021), so these are
**relayed** rulings, not rulings this worker obtained.

Written by a **different** worker (the planning worker) and reproduced here as the authorized scope.
Per the spawn instruction nothing in it was inherited unverified — every measurement was re-run
firsthand before writing. See `worklog.md` §"Re-verification" for what held and what did not.

---

## 1. What is false today

| ADR-010 says | Live reality |
|---|---|
| `skills_for_role()` in `claude/fkit-claude.sh` | It is defined in **`claude/skills-for-role.sh`**; `fkit-claude.sh` only sources it |
| — (implied single consumer) | **Two** consumers source it: `claude/fkit-claude.sh` and `claude/skill-ownership-hook.sh` (the ADR-018 `PreToolUse` gate) |
| lead owns two skills (§Decision 3 — already corrected by `0143`) | **five** |
| The `skills:` frontmatter is a live second hand-maintained list | **No `claude/agents/*.md` carries a `skills:` key.** Dropped, per ADR-012 §Decision 1 |
| "the shell grants every role `fkit-team`" | still true |

`0143`'s +71 to ADR-010 is **uncommitted**, so `git diff` against `HEAD` cannot isolate this task's
deletions. Handled at build time — see §5.

## 2. Sites carrying the stale claim — three, not the brief's two

1. **§Decision 5** — *"`skills_for_role()` in `claude/fkit-claude.sh` is the single source of truth"*.
   Binding. In the brief. **In scope.**
2. **§Context, "One real inconsistency" passage** — the same stale pointer, plus the spent *"They
   currently disagree"* paragraph. In the brief. **In scope.**
3. **§Context, lock bullet 2** — *"(`claude/fkit-claude.sh:75-103`, `skills_for_role()` +
   `build_settings()`)"*. **Not in the brief.** Third occurrence of the same wrong file name. Fenced
   to `0196` / `0197`. **Not annotated here** — but **named**, per owner ruling OQ-2.

Checked and excluded: §Related's `Code:` line is a bare coordinate list naming no function —
`0197`'s. Every other `fkit-claude.sh` mention in ADR-010 makes no claim about where
`skills_for_role()` lives.

## 3. ⚠️, not ⛔ — and the note must say why

The "two lists disagree" passage is a **fact that stopped being true**, not a decision that was
overturned. But it is not ordinary drift either: the disagreement was resolved **the way §Decision 5
prescribed**, by taking the second of the two branches it itself offered ("generated from it **or**
dropped"). The decision was not merely untouched — it was **honored**. The legend's gloss (*"a fact
that drifted"*) implies unmanaged change and undersells that, so the note carries one sentence the
legend does not cover. **No third marker** — out of scope.

## 4. Shape — two blocks plus one header continuation line

Placement per `0143`'s residual **`R1-placement`** (below the claim, indented to the item's
continuation level). Citation form per residual **`Citation form`** (file + quoted phrase, no `:NNN`).

- **Block A — §Decision 5**, indent 3 spaces, matching `0143`'s §Decision 3 note. Carries the full
  statement: the file, the two consumers, the dropped frontmatter with the ADR-012 quote, **why ⚠️ and
  not ⛔**, the "left byte-identical" clause, and the naming of site 3.
- **Block B — §Context**, indent 0 (it annotates plain prose, not a `- ` bullet — a placement level
  `0143` has no precedent for). Records that the two-lists condition is **spent** and the *"settled
  here"* promise was **kept**, and **cross-references** Block A rather than restating the file facts —
  the shape `0143` used at its §Context reversal notice. One place to keep true, not two.
- **Header** — **APPEND a continuation line** to the existing `- **Corrections:**` item. See §7 OQ-1.

Two blocks and not one: they sit at different sites, so one block is not physically available; the
real choice was restate-vs-cross-reference, and cross-reference wins on drift.

## 5. Interaction with the other ADR-010 tasks

- **Baseline.** Snapshot ADR-010 to the scratchpad **before** the first edit; run the `−0` proof as
  `diff` against that snapshot **in addition to** `git diff --numstat` against HEAD. Both must pass.
  Do not commit `0143`'s work to manufacture a clean baseline (no-commit rule).
- **`0196` / `0197` serialize after this**, not in parallel — all three append to one file.
  Order: **0195 → 0196 → 0197**, each rebasing and re-running the proof, none restating the legend.
- **`0197` has a live scope collision** — its *"§Context, the two-lists passage /
  `claude/fkit-claude.sh:75-86`"* item is half-discharged by Block B + Block A. Producer's to narrow.
- **`0171`** absorbed the 12 displaced `adr-010:NNN` sibling pointers; all 6 distinct coordinates were
  **already stale from `0143`'s +71**, so this task breaks **zero currently-accurate pointers**.
- **`0199`** (vault resync) runs last.

## 6. Scope boundary — what this task does NOT do

No edit, reword, re-date or delete of any existing ADR-010 body line · `- **Status:** accepted`
untouched · nothing under `ai-agents/wiki-vault/` · no new `:NNN` written into ADR-010 · no
annotation block at §Context bullet 2 (`0196`) · no line-range assessment (`0197`) · no
`/fkit-record-decision` change (`0198`) · no repair of the 12 sibling pointers (`0171`) · no third
marker · no commit · no re-litigation of `R1-placement`.

## 7. Open questions — asked and answered

All four were put to the owner via `AskUserQuestion` in the live driver session, **2026-08-02**, and
relayed to this worker.

| # | Question | Owner's ruling |
|---|---|---|
| **OQ-1** | Header bullet — append a continuation line, or edit the existing line in place as the brief pre-authorizes? | **(a) APPEND.** The brief's pre-authorization to edit was **declined**. `−0` holds outright, with no exception clause. |
| **OQ-2** | May Block A *name* §Context lock bullet 2 as still stale, without annotating it? | **(a) YES.** Naming a site is not annotating it, so the `0196`/`0197` fence holds. Without it the task would close claiming a completeness it does not have. |
| **OQ-3** | Merge or re-scope `0197`'s overlapping item? | **(a) Keep `0197` separate; the PRODUCER narrows that one item to the line-range half.** Not this task's edit — surfaced as a follow-up. |
| **OQ-4** | Priority — `0195` is ranked P173 by append, not merit | **Settled before this worker was spawned: drive `0195` next, leave the rank alone.** No renumbering. Not to be raised again. |
