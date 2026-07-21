# Review — add-dumb-down-skill-for-six-roles

Task: `ai-agents/tasks/done/add-dumb-down-skill-for-six-roles.md`
File(s) under review: `claude/skills/fkit-dumb-down/SKILL.md` (new) · `claude/skills-for-role.sh` ·
`claude/skills/fkit-team/SKILL.md` · `claude/README.md` · `test/skill-ownership-hook.test.js` ·
`ai-agents/plans/add-dumb-down-skill-for-six-roles.md`
Scope note: reviewed the **`fkit-dumb-down` half only**. The `fkit-open-questions-interview`
registration, mirror wording and test entries in the same diffs belong to task 70's ledger.
Status: in-review

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | `claude/skills/fkit-dumb-down/SKILL.md:34-50` | The content-preservation list guarantees a claim's **existence** but not its **force or prominence**. A rewrite can retain every listed item and still downgrade hedges ("this will break" → "this could cause issues") or demote a leading caveat to a trailing clause — materially softer, fully compliant with the list as written. Raised by both reviewers. |
| R2 | 1     | medium | `claude/skills/fkit-dumb-down/SKILL.md:78` | "It works the same in a session and in a spawned consult" is **false**. In a fresh one-off consult the agent has no prior substantive answer of its own, so Step 2 (`:60-62`) always fires and the skill is a guaranteed no-op. In a *resumed* consult it runs, but its output goes to the **calling agent**, whose relay is not bound by this skill's content list — the preservation guarantee ends at the consult boundary. The **ADR-021 half of the claim is correct** (see Verified-correct below). |
| R3 | 1     | medium | `claude/scaffold/CLAUDE.md:30-31` | A **third** human-facing role→skill table — the one shipped to every consuming project — was not updated and now states the lead role has "**only** `/fkit-team` and `/fkit-query`". After this change lead also has `/fkit-dumb-down`. The shipped doc makes an explicit exclusive claim that is now false. Jointly caused with task 70; the `fkit-dumb-down` half is this task's. |
| R4 | 1     | low    | `claude/skills-for-role.sh:12-16` | **Root cause of R3.** The header's "⚠️ CHANGING A ROLE'S SKILLS?" mandate enumerates **two** mirrors (`fkit-team/SKILL.md`, `claude/README.md`) but **three** hand-maintained tables exist. The guard designed to prevent exactly this drift does not cover the scaffold copy, so a coder following the mandate precisely still ships stale docs. |

### Verified correct — no finding (recorded so they are not re-chased)

- **Registration (the coder's self-reported double-bug fix) — independently verified, holds.**
  `skills_for_role` invoked per role: `fkit-dumb-down` present exactly once for all six Claude-side
  roles, absent for `adversarial-reviewer`. Test matrix parsed programmatically: `UNIVERSE` len 24 /
  uniq 24 (**no duplicates**), `lead` **present** with correct punctuation, every `OWNED` list free of
  internal duplicates and fully contained in `UNIVERSE`. `UNIVERSE` matches `ls claude/skills/`
  exactly — 24/24, no skill missing from the matrix in either direction. `npm test` 379 pass / 0 fail.
  **I looked for a third way the scripted edit was wrong and did not find one.**
- **The "reads no files / rewrites only your own last answer" boundary (author's Q2) — adequate.**
  Three independent statements (`:71-74` rule, `:60-62` step 2, and the behavioral tripwire *"if you
  find yourself opening the repo, you are answering a new question"*). Rule 3 (`:75-77`) correctly
  routes the "I now realize the original was wrong" case to an explicit **correction** rather than a
  silent better answer — the exact failure the author worried about is named and closed.
- **Task-62 relationship (author's Q3) — the text does justify both shipping.** The blockquote at
  `:29-32` draws a real distinction (standing **default** vs **on-demand** further step down on a
  *specific* answer) and states neither replaces the other. A future reader hitting that paragraph
  would not consolidate them.
- **The ADR-021 claim itself (author's Q4) — correct.** ADR-021 governs `AskUserQuestion`; this skill
  opens no owner channel, so no ADR-021 degradation applies. The overclaim in R2 is a *different*
  session/consult seam, not an ADR-021 one.
- ADR-022 relative link resolves; frontmatter matches sibling-skill conventions; **both mandated
  mirrors are correct**, including their handling of `lead`.

### Out of scope — noted, not this task's to fix

- `CLAUDE.md:41` states role→skill ownership is declared in `claude/fkit-claude.sh`; it moved to
  `claude/skills-for-role.sh` (task 43 / ADR-018). Pre-existing staleness, untouched by this change.

## Coder response

**Round 1 — coder verdicts, 2026-07-18.** All 4 verified against the code before acting; **all 4
confirmed, all 4 fixed.** R3/R4 are the same root cause as task 70's R1/R3 and were fixed once, in
task 70's pass, on the owner's ruling — recorded here so this ledger is not silent about them.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT (high)** | Defect | **The strongest finding, and it is about the skill's central promise.** My content list preserved a claim's *existence* but never its **force or placement** — so hedge-downgrade (*"this will break"* → *"this could cause issues"*) and placement-demotion (a leading flag relegated to a trailing clause) both satisfied it while gutting the answer. **The reviewer's sharpest point: this repo already solved the placement half** — `CLAUDE.md`'s *"'Loud' is placement, not word count"* — **and the skill did not import it.** Added a preservation clause naming both escapes explicitly, plus a decision test: *"if the owner acted only on your re-explanation, would they make the same decision?"* | **fixed** |
| R2 | **PARTIALLY CORRECT** | Defect | My ADR-021 claim was right (no owner channel ⇒ no degradation); **the surrounding sentence overclaimed.** Verified the reviewer's two cases: in a **fresh** consult there is no prior answer, so the skill is a **no-op by construction**; in a **resumed** consult it runs but the output goes to the **calling agent**, whose relay is not bound by my content rules — **the preservation guarantee ends at the consult boundary.** Sentence narrowed to state exactly that, and to say what to do about it. | **fixed** |
| R3 | **CORRECT** | Defect | `claude/scaffold/CLAUDE.md` — shipped to every consuming project — still claimed the lead role has "only" two skills. **Jointly caused with task 70; fixed once there** (owner-ruled), and the fix names both new skills, so it closes this task's half too. My plan's reasoning *"no scaffold copy (skills are not dual-homed)"* was true of the **skill file** and conflated it with the **scaffold doc**, which does describe role→skill ownership. | **fixed (in task 70's pass)** |
| R4 | **CORRECT** | Defect (structural) | The mirror mandate named 2 places when 4 exist — the root cause of R3. **Owner ruled: fix the header and its `fkit-claude.sh` duplicate now.** Both updated. | **fixed (in task 70's pass)** |

### Verification of the fixes

- `npm test` — 379 unit pass / 0 fail **and** `prove-red.sh` green in the same command (task 70 wired
  it in; before that a broken hard gate could hide behind a green unit suite).
- Registration re-confirmed: 6 allow / 1 deny, no duplicate cases.

### On the reviewer's independent check of my self-reported mistake

I disclosed up front that my scripted edit to the hook matrix had been wrong **twice** (duplicated
`fkit-dumb-down` in `UNIVERSE`, missed `lead`), and asked them to verify the fix rather than trust it,
since an edit wrong twice may be wrong a third way. **They parsed the matrix programmatically** — 24
entries / 24 unique, `lead` present, no `OWNED` duplicates, `UNIVERSE` matching `ls claude/skills/`
24/24 both directions — and reported: *"I specifically hunted for a third way the scripted edit was
wrong and did not find one."* **That is the check working as intended**, and worth recording as the
reason self-reporting a mistake is cheaper than concealing it.

**Reviewer's independence preserved:** the *Reviewer findings* section is untouched.

## Accepted residuals (shared, do-not-re-litigate)

- **Behavior is untestable; the suite proves the gate only** — What: automated coverage stops at
  role→skill ownership (who may invoke the skill); whether a re-explanation actually preserves a
  caveat is not machine-checkable. Why (structural): the deliverable is a prompt, not code with a
  runtime surface; the only available check is an owner spot-check. Disclosed by the author up front.
  Re-raise only if: a behavioral eval harness for skill prompts is introduced, or a real
  re-explanation is observed dropping listed content in practice.
