# Review — 0125

Task: `ai-agents/tasks/backlog/0125-wiki-skills-flag-ready-to-close/brief.md`
File(s) under review: `claude/skills/fkit-wiki-ingest/SKILL.md`, `claude/skills/fkit-wiki-sync/SKILL.md`,
`claude/skills/fkit-wiki-lint/SKILL.md`, plus this task folder's `plan.md` and `worklog.md`
Status: in-review

**Round 1 verdict:** ⚠️ **Changes requested — 5 defects (none blocking).**
**Codex coverage: FULL** — both reviewers ran (`codex-cli 0.145.0`, read-only sandbox). Not a partial review.

Scope note: the working tree carries ~40 modified / ~10 untracked paths from earlier sprint work. All
pre-existing; nothing outside the five files above was reviewed or is reported on.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-wiki-sync/SKILL.md:52` | Step 3's empty-delta early exit (*"report … and stop"*) bypasses Steps 4–9, so an idle sync emits **no** flag line at all — not even the null line D2 was kept for — and the D1 Option B backlog scan never runs on the exact path 0108 arose from (six batched syncs). |
| R2 | 1 | medium | `claude/skills/fkit-wiki-ingest/SKILL.md:57` (also `sync:98`, `lint:66`) | The scan defines a consideration set but gives no outcome for a considered brief that is **unrelated** to this run; the literal reading ("one line per such task", doubt → partial) emits a `partial — not ready to close` line for every `fkit-wiki`-owned backlog brief on every run (today 0126, 0141, 0148), and collides with the null-line rule. |
| R3 | 1 | low | `ai-agents/tasks/backlog/0125-wiki-skills-flag-ready-to-close/plan.md:127` | Corrected check 4 still fails **open** in shape: `sed 's/^ *//'` erases relative nesting (so it cannot detect a broken list-item indent — the one structural risk of this change), and `diff && diff && echo UNIFORM` still prints `UNIFORM` on an empty extraction. The anchor was fixed; no non-empty/structure guard was added beside it. |
| R4 | 1 | low | `ai-agents/tasks/backlog/0125-wiki-skills-flag-ready-to-close/worklog.md:13` | §1 attributes a quoted assertion — *"currently end by closing, or by implying they may close"* — to the brief's **What to build**; that phrase appears nowhere in `brief.md`, in HEAD or the working tree. The disproof itself is correct and independently confirmed; the citation is not. |
| R5 | 1 | low | `claude/skills/fkit-wiki-ingest/SKILL.md:75` (also `sync:116`, `lint:84`) | The "**Then stop.**" prohibition list names three forbidden acts but not *spawning the producer to close*, and the next clause supplies a ready-to-run `@fkit-producer Run /fkit-task-done on <brief path>` inside a step the wiki executes. The ADR-018 hook gates the `Skill` tool by `agent_type`, so a wiki-spawned producer's mover call is **allowed**. |

### Verified but NOT recorded as rows

- **Codex's "worklog cannot substantiate 'none of those are mine'"** (`worklog.md:132`) — **largely
  disproven.** The worklog already states exactly the limitation Codex asks for: *"I have not established
  who made the other changes and do not assert it"* and *"check 7 verifies my change surface but cannot
  verify the tree's cleanliness."* Independently confirmed: `git diff` on `brief.md` is **only** the
  `🔲 Backlog → 🔄 In progress` flip, and scoped `--numstat` is `30/0`, `30/0`, `31/0` — additions only,
  three files. Residual kernel (no pre-build `git status` snapshot captured) is real but not overclaimed.
  **Do not chase this.**
- **The brief's status flip.** Recorded as made by the sprint driver when it began driving 0125. The
  worklog's §5(b) treatment reads accurately: it claims only *not mine*, *already `🔄 In progress` at
  plan-read time*, and *does not assert who*. All three true. **No defect.**

### Verified and credited (checked, no finding)

1. **The brief's premise was genuinely disproved.** Re-grepped HEAD with a **wider** regex than the
   author's (`task-done|task-cancelled|ready to close|close|mover|move .*task|done|complete`) across all
   three SKILLs: **zero** close/mover text. The only hits are path strings (`tasks/{backlog,done}`). Each
   skill directory contains only `SKILL.md`, so nothing could hide elsewhere. The cited 0108-report
   corroboration is accurate (`reports/2026-07-23-eval-…:26-27`). The change is correctly additive; **no
   forgotten removal.**
2. **"Byte-identical" survives scrutiny.** Raw (un-normalized) `ingest` vs `lint` blocks are byte-identical
   including indentation; `ingest` vs `sync` differ only by a **uniform** 3-space prefix on every line,
   continuation lines included. The stated claim — *byte-identical once leading indentation is normalized*
   — is honest, not looser than stated.
3. **The D1 Option B scan is executable as written.** `## Owner` present in 141/141 briefs;
   `fkit-wiki` is a real value (0126, 0141, 0148); `## Status` values are `🔲 Backlog` / `🔄 In progress` /
   `✅ Done`; the glob matches the real layout. (The `not ✅ Done` filter is near-vacuous inside `backlog/`
   — the mover moves the brief out — but it is a defensible guard against a half-landed close, task 0134's
   subject. Not a defect.)
4. **The nine check-5 hits re-read.** Three per file: a **negation**, the flag string naming *who* runs the
   mover, and the routing line. **None authorizes the wiki to invoke a mover.** The routing line's residual
   risk is R5 and nothing more.
5. **Placement and rendering, all three.** `ingest` item 7 sits after item 6, before `## Hard rules`;
   `lint` item 8 sits after item 7 and **before** the `---` at `:87` opening the ADR cross-check section;
   `sync`'s `## Step 9` is a unique number after the last-existing Step 8. Ingest/lint blocks stay inside
   their list items (3-space body, 5-space continuations). Nothing downstream orphaned or mis-nested.
6. **The unenforced-convention gap is stated clearly enough.** `worklog.md:144-155` states it in bold,
   names the evidence (the hook never opens a `SKILL.md`; no test reads these bodies), states the
   consequence (*"nothing goes red"*), and names the concrete follow-up file for the producer to file.
   `plan.md:157-162` duplicates it. Adequate — **no finding.**
7. **The plan's §5 checks 1, 2, 3, 5, 6, 7 audited for fail-open.** All re-run; all reproduce the worklog's
   reported counts and line numbers exactly. None fails open. Check 4 is R3. The author's own §5(a)
   correction is confirmed: the plan's original anchor extracts **0** lines (re-demonstrated).
8. **Worklog auditability overall: it holds.** Every verification claim carries a runnable command; every
   number I re-derived matched; both deviations are recorded rather than smoothed over, including one the
   author found against itself.

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

**Round 1 response — 2026-07-27, fkit-coder.** All five verified against the files *before* any edit.
Four fixed, one subsumed by owner ruling. Verdicts are mine; the FIX-NOW / SUBSUME dispositions on
R1, R2, R3 and R5 were ruled by the owner via `AskUserQuestion` in the driver session, same date.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | Verified at `fkit-wiki-sync/SKILL.md:52`: the empty-delta exit read *"report … **and stop**"*, which bypasses Steps 4–9 — including the new Step 9 — so an idle sync emitted no flag line at all. Rewrote it to *"skip Steps 4–8 and go straight to Step 9"*, with the 0108 rationale in place. **Deliberately not widened:** Steps 4–8 (incl. the Step 7 watermark write) were already skipped on this path before my change; I preserved that rather than silently altering watermark behavior. | ✅ Fixed |
| R2 | **CORRECT** | Defect | Verified: the consideration set had no outcome for an unrelated brief, and *"not certain → partial"* swallowed them, so every run would emit `partial` for 0126, 0141 and 0148 in perpetuity, while the null line's *"if this run completed no tracked task"* condition fired at the same time. Applied the reviewer's shape: the rule is now **three** outcomes with **unrelated → say nothing about it at all**, plus an explicit anti-conflation sentence (*a brief is not "uncertain" merely because you read it*); the null line is rescoped to **"if that produced no lines at all"**. Also corrects my own `plan.md` §6 risk 7, whose "keeps the common case one line" assumption was wrong for Option B — noted in `worklog.md`. | ✅ Fixed |
| R3 | **CORRECT** | Defect (in the plan's verification method, not the shipped text) | Confirmed both halves independently: `sed 's/^ *//'` erases relative nesting, and the `diff && diff && echo UNIFORM` chain prints on empty extraction. **Owner ruled SUBSUME** — `plan.md` check 4 left as-is; a real test beats a better one-shot grep. **Recorded in Accepted residuals below.** Not left unmitigated for *this* round: re-verification used a purpose-built fail-**closed** prover (non-empty + minimum-length gate, nesting preserved, and a negative control that must fire) — see `worklog.md` §7. That prover is a one-off harness, not a committed test; the committed fix remains the named `test/wiki-flag-convention.test.js` follow-up. | ⏸️ Subsumed (residual recorded) |
| R4 | **CORRECT** | Defect | Verified: the phrase *"currently end by closing, or by implying they may close"* appears **nowhere** in `brief.md`, in HEAD or the working tree. I attributed it to the brief's *What to build*; it came from the **driver's spawn prompt**, which relayed the brief's framing in its own words. My error was citing a relayed quote as a first-hand one — `evidence-before-assertion` applies identically to both. Citation corrected in `worklog.md` §1; the disproof itself is unchanged and still stands. | ✅ Fixed |
| R5 | **CORRECT** | Defect | Verified: the Then-stop list named three forbidden acts and omitted spawning the producer, while the very next clause supplied a ready-to-run `@fkit-producer Run /fkit-task-done on <brief path>` **inside a step the wiki executes**. Appended *"and do not spawn the producer to close it yourself"*, and sharpened the routing clause to *"the **caller's** next move, **not yours**"* so the addressee is unambiguous. **Scope held to one clause per the owner's ruling** — this is instruction clarity in new text, **not** a reopening of ADR-033's laundering residual, and no policy or permission was changed. | ✅ Fixed |

**Fresh-defect check on this round** (fix rounds have introduced new defects three times this sprint):
the R2/R5 edits landed in three separate files, so uniformity was re-proved by a fail-closed harness
rather than the fail-open check 4. It **fired correctly once** — the first run reported `NOT UNIFORM`
on the intentional per-file heading difference (item 7 / item 8 / `## Step 9`), which the plan scopes
out of the identity claim; the harness was corrected to compare **bodies** and now passes with its
negative control firing. No fix in this round broke another check: 1, 2, 3, 5, 6, 7 all re-run green.

## Accepted residuals (shared, do-not-re-litigate)

- **Spawned-consult flag loss** — What: when the wiki runs as a spawned consult, the flag rides the return
  and a summarizing caller can drop it; "last lines, carried verbatim" reduces the miss rate without
  closing it. · Why (structural): named and priced in the 0108 report §3 before this task existed; no
  in-SKILL wording can bind a caller's summarization. · Re-raise only if: a structural carry mechanism
  (not prose) is on the table. *Carried in from the 0108 report — not a new disposition made in this
  review.*
- **The convention is prose-only and unenforced** — What: no hook and no test reads these SKILL bodies, so
  deleting the block goes unnoticed. · Why (structural): the brief's verification step 4 restricts this
  task to the three SKILL texts; the ADR-018 hook reads only the stdin payload and `skills_for_role()`,
  never a `SKILL.md`. Follow-up named: `test/wiki-flag-convention.test.js`, for the producer to file. ·
  Re-raise only if: that follow-up is dropped rather than filed. *Carried in from `plan.md` §6.1 /
  `worklog.md` §6 — not a new disposition.*
- **`plan.md` check 4 stays fail-open in shape (R3)** — What: the corrected anchor extracts the right
  lines, but the check's *shape* still cannot fail closed — `sed 's/^ *//'` erases relative nesting, so a
  broken list-item indent is invisible to it, and `diff && diff && echo UNIFORM` still prints `UNIFORM`
  on an empty extraction. · Why (owner ruling, 2026-07-27): a real test beats a better one-shot grep, and
  the current state is verified genuinely uniform by other means, so hardening the grep buys little. ·
  What actually closes it: the already-named `test/wiki-flag-convention.test.js` follow-up, for the
  producer to file. · Re-raise only if: that follow-up is dropped, or a third party relies on check 4 as
  a gate rather than as a one-shot aid. *New disposition, made in this review (R3, SUBSUME).*
- **Extra-hop laundering (a doer spawns a producer to close)** — What: ADR-033 does not prevent it and says
  so. · Why (structural): ADR-033 §"The limit", owner-chosen knowingly. · Re-raise only if: it *"proves to
  matter in practice"* — then reopen ADR-033, do not patch the mover. **R5 does not re-raise this**; R5 is
  an instruction-clarity gap in the new text, and its recommendation is one clause in the Then-stop list.

## Re-litigates settled decisions (suppressed)

None. No finding from either reviewer matched an accepted residual or an ADR re-raise condition whose
condition was unmet. Explicitly checked against ADR-033 (§Residual risks — *"the wiki should self-close"*,
*"any role should be able to close for ergonomics"*, extra-hop laundering) and ADR-018.
