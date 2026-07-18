# Review — add-open-questions-interview-skill-for-six-roles

Task: `ai-agents/tasks/done/add-open-questions-interview-skill-for-six-roles.md` (Sprint 2, priority 70)
File(s) under review: `claude/skills/fkit-open-questions-interview/SKILL.md` (new) · `claude/skills-for-role.sh` · `claude/skills/fkit-team/SKILL.md` · `claude/README.md` · `test/skill-ownership-hook.test.js` · `ai-agents/plans/add-open-questions-interview-skill-for-six-roles.md`
Status: in-review

**Reviewers run — round 1:** reviewer's own pass **+ Codex adversarial pass** (`codex-cli 0.144.4`, exit 0). **Both ran. Coverage is full.**

**⚠️ Working tree was mutated mid-review** by a concurrent task (`fkit-dumb-down`, from
`add-speak-in-simple-terms-output-style`). `claude/skills-for-role.sh` and
`claude/skills/fkit-team/SKILL.md` both changed between two reads in this session. Findings below are
scoped to task 70's own additions; see the cross-task note under *Out-of-scope observations*.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | **high** | `claude/scaffold/CLAUDE.md:30-31` | **The third mirror, missed.** It states the universal set as "`/fkit-query` (wiki reads) and `/fkit-team`" and then asserts *"The **team room** (`fkit-lead`) has only `/fkit-team` and `/fkit-query` — it routes, it doesn't do."* The second sentence is now **false** — lead was granted the new skill. This file is **shipped into every consuming project's root `CLAUDE.md`**, so it is in every agent's context on every turn, in every downstream project. Raised by both reviewers. Defect. |
| R2 | 1 | **high** | `test/prove-red.sh:92` | **Task 70 silently disarmed the mutation hard gate.** Mutation 1 targets the reviewer roster by exact string match on `reviewer)  echo "fkit-team fkit-query fkit-review fkit-stateful-review"`. That matched `HEAD` byte-for-byte; task 70 inserted `fkit-open-questions-interview` into that line, so the `sed` now matches nothing, exits 0, and the "mutant" is identical to the original. Ran it: `1. broke skills_for_role(reviewer) … green` → `✗ the suite did NOT catch a broken lockdown matrix` → `✗ hard gate FAILED`. **`npm test` is `node --test test/*.test.js` and does not run `prove-red.sh`** — which is exactly why 372/0 green did not surface this. Task 70's edit is *independently sufficient* to break it (the concurrent `fkit-dumb-down` edit breaks it too). Raised by both reviewers. Defect. |
| R3 | 1 | med | `claude/skills-for-role.sh:12-16`; duplicated at `claude/fkit-claude.sh:224-227` | **The "two hand-maintained tables" checklist is itself incomplete — this is the root cause of R1.** The coder followed the header faithfully and still missed a mirror, because the header omits `claude/scaffold/CLAUDE.md` and `test/skill-ownership-hook.test.js`'s `OWNED` matrix. The header even records that this bit once before (task 14). Left as-is, the next skill-ownership change reproduces R1. Raised by both reviewers. Defect. |
| R4 | 1 | med | `ai-agents/knowledge-base/architecture.md:120, 128-135` | Fourth roster: heading reads `### 4.2 The 21 skills` (count now wrong) and the table's `| everyone |` row lists only `team` + `query`, with no row covering a six-of-seven skill. Partly pre-existing drift (`task-plan` is a retired name, `task-ship-loop` already absent, and `:137-139` still points ownership at `claude/fkit-claude.sh:199-210` after the task-43 move) — but task 70 adds to it. Coder-writable (knowledge-base, not the wiki). Raised by both reviewers. Defect (doc). |
| R5 | 1 | med | `claude/skills/fkit-open-questions-interview/SKILL.md:55-56` | **Internal contradiction that causes the exact failure the skill forbids.** Step 1 says *"an `AskUserQuestion` call whose result you never used is still unanswered."* A returned result **is** the owner's answer; not acting on it is a different failure (ignoring an answer), not an open question. As written this instructs the agent to re-ask an answered question — directly against Step 2 and the rule *"Do not re-ask what was answered."* Directly hits the coder's own worry #2. Codex. Defect (wording). |
| R6 | 1 | med | `claude/skills/fkit-open-questions-interview/SKILL.md:72-73` | **The `>4` path has no completion invariant.** *"Ask the most blocking 4 first, then continue in a second call once those are answered. Say how many remain."* Announcing the count prevents a *silent* first-batch truncation, but (a) there is no repeat-until-empty rule, so 9+ questions have no defined path past batch two, and (b) the continuation is anchored only on *"once those are answered"* — if the owner answers 4 and redirects, nothing re-triggers the remainder, and the count was stated inside a tool call rather than carried in prose. Answers the coder's worry #4: **not sufficient as written.** Raised by both reviewers. Defect. |
| R7 | 1 | low | `claude/agents/fkit-lead.md:44-46`; `fkit-producer.md:34-38`; `fkit-architect.md:58`; `fkit-reviewer.md:41`; `fkit-wiki.md:54` | Five of the six granted roles enumerate their own procedures **and already list the universal `/fkit-query` explicitly**, so the established pattern is to list it — yet none mentions `/fkit-open-questions-interview`. `fkit-lead.md:44-46` is the most conspicuous: it reads as an exhaustive two-item roster. Behaviorally harmless (the hook grants regardless) but six roles now under-report their own capability. (`fkit-coder.md` also omits it but is **task 61's surface — excluded**.) Codex. Defect (consistency). |
| R8 | 1 | low | `claude/skills/fkit-open-questions-interview/SKILL.md:20-25` vs `:43-45` | The emphatic *"This skill reads no files"* sits against *"Anything you can answer yourself by reading the code or the files. **Go and answer it instead.**"* Determining whether an answer is in the repo can itself require looking. Charitably reconcilable (the *sweep* reads nothing; "go answer it" means drop it from the interview and handle it in normal work outside the skill) and the zero-read scope is an owner ruling — so this is a **clarity gap, not a contradiction**. Codex rated medium; **I assess low** and lean frontier-move. |

## Coder response

**Round 1 — coder verdicts, 2026-07-18.** Every finding verified against the code before acting.
**All 8 confirmed; none disputed; all 8 resolved.** Four needed owner rulings and were relayed
**verbatim**.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT (high)** | Defect | **Verified: `claude/scaffold/CLAUDE.md:30-31` ships into every consuming project and asserted the lead role has "only" two skills — false the moment this task landed.** Rewritten to state the six-role set and the adversarial-reviewer exclusion. **This was the third mirror; I had followed the mandate that names two.** | **fixed** |
| R2 | **CORRECT (high)** | Defect | **I caused this, and confirmed it by running the gate.** `prove-red.sh` mutates `skills-for-role.sh` with a byte-exact `sed`; adding a skill to the reviewer arm broke the match, so the "mutant" was identical to the original and mutation 1 proved nothing — `✗ hard gate FAILED`. **Owner ruled: robust mutation + wire into `npm test`.** The `sed` is now anchored on the `reviewer)` arm and strips only the `fkit-review` token, so roster growth cannot break it; **a `cmp` post-condition fails the run if the mutation is ever a no-op again**; and `npm test` now runs `node --test && prove-red.sh`. **Self-check verified by deliberately disarming the mutation — it now fails loudly instead of silently passing.** | **fixed** |
| R3 | **CORRECT** | Defect | **The root cause, and the reason R1 happened.** `skills-for-role.sh:12-16` claimed "Two hand-maintained tables"; there are **four**, and `fkit-claude.sh:224-227` carried a stale duplicate. **Owner ruled: fix the header and its duplicate now.** Both now name all four, with a note recording that the two-item version was followed precisely and still shipped a false statement — *"a checklist that is itself incomplete is worse than no checklist: it is followed, and it fails."* | **fixed** |
| R4 | **CORRECT** | Defect | **Owner ruled: fix what these tasks falsified; separate task for the rest.** `architecture.md` skill count 21 → **24** (verified against `ls claude/skills/`), and a new row for the six-role set. **Its pre-existing drift — retired `task-plan`, missing `task-ship-loop`, a stale `fkit-claude.sh` line pointer — is deliberately NOT fixed here**; it predates this work and is named as a follow-up. | **fixed (scoped)** |
| R5 | **CORRECT** | Defect | **Confirmed by reading my own text.** `SKILL.md:55-56` said an `AskUserQuestion` *"whose result you never used is still unanswered"* — commanding the exact re-ask the skill forbids two rules later. **A returned result IS the answer.** Replaced with an explicit callout: failing to act on an answer is *my* unfinished work, not an open question. | **fixed** |
| R6 | **CORRECT** | Defect | The `>4` path had no completion invariant. Now an explicit **loop until empty**, the remaining count stated **in prose outside the tool call** (a count inside a dialog dies with the dialog), and a rule that a change of subject does not cancel the remainder — *"silently abandoning questions 5+ is the exact failure this skill exists to fix."* | **fixed** |
| R7 | **CORRECT** | Defect | **Owner ruled: fix now.** All six Claude-side agent rosters now list both new skills; `fkit-adversarial-reviewer.md` correctly lists neither (verified by count, 6 × 1 / 1 × 0). | **fixed** |
| R8 | **PARTIALLY CORRECT** | Frontier-lean | Reviewer downgraded it from Codex's medium. The "reads no files" rule and "go and answer it instead" are not in tension once read together — the first scopes the *sweep*, the second says what to do with a question you can resolve yourself. Left as written; the R5 callout sharpens the same area. | **no change, reasoned** |

### Verification of the fixes

- `npm test` — **379 unit pass / 0 fail, PLUS `prove-red.sh` now runs in the same command and passes:**
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- **The R2 self-check proved by deliberate sabotage:** breaking the mutation into a no-op now prints
  `✗ MUTATION WAS A NO-OP — the sed no longer matches` and fails the run. Before this task it would
  have reported success while proving nothing.
- All four mirrors consistent; six agent rosters carry both skills, the adversarial reviewer neither.

### On R1/R3 — what actually went wrong

I asked the reviewer, in my own review request, whether there was *"a third place that encodes what
every role has that I have not found"*, and flagged that the header itself might be stale. **Both
suspicions were right.** The artifact I was trusting was wrong, and following it faithfully is exactly
what produced the defect. That is why R3 was fixed rather than just R1: fixing the mirror without
fixing the checklist leaves the next author to repeat it.

**Reviewer's independence preserved:** the *Reviewer findings* section is untouched.

## Accepted residuals (shared, do-not-re-litigate)

_(none yet — pending owner disposition)_

---

## Out-of-scope observations (not task 70's defects — recorded so they are not lost)

- **Cross-task contradiction, live right now.** `claude/skills/fkit-team/SKILL.md:59-63` (as currently
  on disk) says the adversarial reviewer *"is excluded from **both**"* `/fkit-open-questions-interview`
  and `/fkit-dumb-down` — but `claude/skills-for-role.sh:25` grants it
  `fkit-dumb-down`. Task 70's half of that sentence is correct; the `fkit-dumb-down` half is wrong.
  **Belongs to the `add-speak-in-simple-terms-output-style` task**, but it landed in a file task 70
  also edits, so whoever commits second must reconcile it.
- `CLAUDE.md:44` says role→skill ownership is declared in `claude/fkit-claude.sh` — stale since the
  task-43 move to `claude/skills-for-role.sh`. Pre-existing, unrelated to task 70.
- `ai-agents/wiki-vault/wiki/systems/fkit.md:30,41` carries the same stale roster. **Wiki-role-only
  write surface**, and already scoped as backlog task 71 (`wiki-sync-open-questions-interview-skill`).
  Correctly not touched here.

## What verified clean

- **Registration is correct.** `skills_for_role` returns the skill for all six Claude-side roles and
  **not** for `adversarial-reviewer`; `test/skill-ownership-hook.test.js` `UNIVERSE` + the six `OWNED`
  lists yield 6 allow + 1 deny. Nothing else perturbed by task 70. **Coder's worry #5: clean.**
- **The exclusion rationale is sound and evidence-backed.** ADR-022 keeps the adversarial reviewer's
  allowlist at `Read, Grep, Glob, Bash, Skill` — no `AskUserQuestion`, so it genuinely has no owner
  channel. ADR-021 does record `TOOL_ABSENT` 3/3 in consults. Both ADR links resolve; the
  `../../../ai-agents/...` depth is right from both `claude/skills/…` and the deployed `.claude/skills/…`.
- **The "no scaffold copy" sanity check the coder asked about: CONFIRMED correct.** `claude/scaffold/`
  contains no skills directory at all — skills are genuinely not dual-homed, unlike the `ai-agents/`
  and `CLAUDE.md`/`AGENTS.md` trees that bit tasks 65 and 67. **The trap here was different**: the skill
  *file* is single-homed, but the skill *roster documentation* is dual-homed (`claude/scaffold/CLAUDE.md`
  — R1). Right instinct, adjacent surface.
- **Anti-invention rules are largely executable**, not merely asserted: *"If you cannot point at where
  it was asked, it was not asked"* is a falsifiable self-check, and Step 4's *"Do not pad the list to
  justify the invocation"* names the failure directly. One gap: the agent is never required to **show**
  the trace to the owner, so the rule is self-audited only. That is a defensible cost, not a defect.
- The **known limitation is honestly disclosed** — the suite proves the gate, not the behavior. Agreed,
  and it is not a review finding.
