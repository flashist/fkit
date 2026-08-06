# Implementation plan — task 0181: narrow the `/fkit-task-brief` step 5 re-rank exception

## Grounding facts (checked this session, 2026-08-06)

- **Task 0179 has NOT landed.** Its brief (`ai-agents/tasks/backlog/0179-require-a-merit-statement-on-every-ranked-board-brief/brief.md`) reads `## Status: 🔲 Backlog`, and the working tree's step 5 still carries the legacy merit sentence (`**On merit this belongs directly below <NNNN>**, because <reason>.`). `claude/skills/fkit-task-brief/SKILL.md` is clean in git — no uncommitted edits. **Consequence for the flagged ⚠️ collision: 0181 lands first, on the current text; no rebase is needed for this task. Whoever later runs 0179 must rebase on 0181's result** (both tasks edit adjacent bullets of the same step).
- **No `claude/scaffold/` counterpart exists.** `claude/scaffold/` contains `AGENTS.md`, `CLAUDE.md`, `universal-rules.md`, and `ai-agents/` — no skills; `grep -r "Determine priority" claude/scaffold/` matches nothing. Per the brief's verification step 7 this is stated explicitly: **there is no counterpart to edit, and the plan makes no scaffold change.**
- **The target text is located.** Step 5 *"Determine priority"* of `claude/skills/fkit-task-brief/SKILL.md`, specifically the bullet beginning *"**The one exception — an owner-ruled re-rank. A re-rank is the owner's call.**"* and the closed-row bullet beginning *"**`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner ruling.**"*
- **ADR-035 is accepted, owner-signed 2026-08-01.** This task is the skill edit only; the decision is not re-opened.

## The change — one file

**File:** `claude/skills/fkit-task-brief/SKILL.md`, step 5 *"Determine priority"*.

**Where:** the narrowing is written **into the exception bullet itself** — extending the bullet that grants the exception, so it reads as a limit on the exception, not a new rule bolted on elsewhere (verification step 1). The closed-row bullet is left as is: it is already absolute and correct; the defect is the exception's unstated scope, and ADR-035's chosen option cuts *"the rule that was inferred, not the rule that was written."*

**Proposed text**, appended inside the exception bullet, after its current last sentence (*"…not on a precedent read off an earlier addendum."*):

> **The exception permits moving an existing row within its own contiguous run of open rows — nothing more.** It does **not** permit **inserting a new row mid-board**, because on an interleaved board an insertion renumbers every row beneath it, including closed ones — and the closed-row rule below admits no exception, *"not even under an owner ruling."* Concretely, standing at the board: **never insert a new row where a `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row sits anywhere below the insertion point** — and run the check **downward**: an insertion renumbers what is *below* it, so verifying the ranks *above* the insertion point proves nothing. (That wrong-direction check is exactly how eight closed rows were once renumbered under a fully recorded owner ruling.) Where a new row's merit position is out of reach, **it appends, and the ordering intent is recorded in the brief** as the merit-position statement this step already requires. The append rule is a **forced consequence** of the closed-row rule, not an independent policy: it cannot be relaxed without first relaxing the closed-row rule, so anyone proposing to allow insertions must argue the **closed-row rule**. Authority: [ADR-035](../../../ai-agents/knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md).

How this maps to the brief's five "What to build" points:

1. **Narrowing in ADR-035's own words** — first two sentences track the ADR's Decision section nearly verbatim.
2. **Remedy in the same breath** — the "Where a new row's merit position is out of reach, it appends…" sentence, in the same bullet.
3. **Corollary** — the "forced consequence … must argue the closed-row rule" sentence.
4. **Forbid the specific act by name, operably** — the "standing at the board / never insert where a closed row sits below / check downward" sentence, which also encodes the 0174 failure mode (check ran in the wrong direction).
5. **Cite ADR-035** — relative link, same path shape the file already uses for `priority-is-rank-not-identity.md`.

**Citation discipline:** no `:NNN` line citations, no bullet ordinals anywhere in the new text — anchoring is by step heading plus quoted phrase, per ADR-035's citation note.

**Deliberate wording choice (see open question 1):** the remedy points to *"the merit-position statement this step already requires"* rather than quoting task 0178's canonical `**On merit:**` grammar verbatim. Reason: the current step 5 still mandates the **legacy** sentence shape; replacing that shape is task 0179, explicitly out of scope here (*"Do not change the merit-statement requirement"*). Quoting the canonical grammar now would put two competing shapes in one step until 0179 lands. By pointing at the step's own requirement, 0179's later edit changes the shape in exactly one place. The ADR (linked in the same sentence's authority cite) records the canonical grammar, so it is reachable.

## What is NOT done — the brief's prohibitions, honored

- ADR-035 is not re-opened; no rejected option is revisited.
- The 0174 insertion is not reverted; no board row is renumbered; no board file is touched.
- The merit-statement requirement (shape or scope) is not changed — that is 0179.
- No guard/test is built — that is 0182.
- No `:NNN` citations, no bullet ordinals.
- `ai-agents/wiki-vault/` untouched.

## Verification — the brief's eight steps, made concrete

1. Re-read step 5: narrowing is inside the exception bullet, phrased as its limit.
2. Walk the 0174 scenario against the new text and show it forbids it: *insert new row 0174 mid-board on 2026-08-01's sprint-2 board, under an explicit owner ruling; rows 0151/0147/0150/0157/0161/0148/0159/0160 (all `✅ Done`) sit below the insertion point → the new sentence "never insert a new row where a `✅ Done`… row sits anywhere below the insertion point" forbids the act by name, the owner ruling does not rescue it ("not even under an owner ruling"), and the "check downward" sentence catches the exact wrong-direction check the 0174 producer ran.* This walkthrough goes in the implementation report.
3. Remedy (append + record merit statement) confirmed present in the same step.
4. Corollary (forced consequence) confirmed present in the step.
5. `grep -nE '\.md:[0-9]' claude/skills/fkit-task-brief/SKILL.md` → no match in changed text; manual read of the new text for ordinal phrases ("the Nth bullet", "four bullets later").
6. `npm test` — full suite, including `test/skill-frontmatter.test.js` (frontmatter untouched, body-only edit) and `test/dual-home-parity.test.js`.
7. Scaffold counterpart: none exists (checked above) — stated explicitly; nothing to diff.
8. Run `claude/fkit-claude-init.sh .` to refresh the fkit-managed `.claude/skills/` copies, then `diff claude/skills/fkit-task-brief/SKILL.md .claude/skills/fkit-task-brief/SKILL.md` → empty.

## Sequencing

Single edit, one file, then verification steps 1–8 in order. No dependencies: ADR-035 is accepted, 0179 unlanded (no rebase), 0182 is downstream of this task.

---

## Approval record (written by the driver, fkit-sprint-ship-loop)

- **Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-06** — verbatim answer: **"Approve (Recommended)"**.
- **Open question 1 (remedy wording) ruled in the same exchange** — verbatim answer: **"Reference (Recommended)"** — the remedy references *"the merit-position statement this step already requires"*; the canonical `**On merit:**` grammar is NOT quoted verbatim (that shape change is 0179's).
- Plan text above is the coder worker's returned plan, copied verbatim by the driver at approval, before the Build spawn (per the sprint-ship-loop's durable-artifacts rule).
