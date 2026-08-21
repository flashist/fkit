# Review — 0280

Task: `ai-agents/tasks/done/0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md`
File(s) under review: `claude/skills/fkit-wiki-lint/SKILL.md` (one hunk, `@@ -180,12 +180,15 @@`, `+9/−6`);
`ai-agents/tasks/done/0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/worklog.md`
Status: in-review

**Verdict (Round 1): ⚠️ Changes requested — 3 defects (none blocking).** Reviewers run: **both** —
fkit-reviewer's own pass **and** the Codex adversarial pass (`codex exec --sandbox read-only`,
exit 0, 4 findings returned). **No degradation; coverage is full.**

**The task's three named defects are fixed and verified.** D1 (*"this project has no CI"*), D2
(*"there is no `.github/`"*) and D3 (the fabricated `architecture.md:390` citation) are gone.
Re-verified independently of the worklog, using the **whitespace-normalized** absence form required by
`conventions/durable-citation-anchors.md` §"Verifying a claim about text" (the worklog used the weaker
single-line `grep`; its conclusions hold under the stronger form — `0` occurrences in each case):
`sed 's/^[[:space:]>*-]*//' … | tr '\n\t' '  ' | tr -s ' ' | grep -o …` returns **0** for
*"There is no CI and no test suite"* in `architecture.md` and **0** for
`architecture.md:390` / that quote in `SKILL.md`. The instruction did **not** weaken: `⛔ **Do not
skip it in either case.**` is unconditional, and all three reasons following it hold on a CI-having
repo.

**All three findings below are about the REPLACEMENT text's own factual accuracy**, in a file whose
whole subject is not asserting false things about the reader's repo. **They land together** — all
three sit in the same nine-line parenthetical and one rewrite fixes all of them.

⚠️ **R1 is not a builder error.** The gate-vs-no-gate axis it attacks is prescribed by the **brief
itself** ("*The rewritten paragraph must hold both cases at once: 1. On a repo with an automated
gate … 2. On a repo without one (the typical consuming project)*") and carried into the
owner-approved `plan.md`. The builder implemented the approved text faithfully. **The gap is at spec
level, and its disposition is the owner's** — see *Open questions* below.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `claude/skills/fkit-wiki-lint/SKILL.md:183-188` — *"`test/adr-number-uniqueness.test.js` also asserts this invariant, so `npm test` catches it too … Where an automated gate exists … this lint step is genuine belt-and-braces."* | **The text conditions coverage on the wrong variable, and so invites a false coverage inference in the file's majority audience.** The real condition is *"is this fkit's own repo"*, not *"does an automated gate exist here"*: `test/adr-number-uniqueness.test.js` **never ships to a consuming project**. `install.sh:43` copies only `src/claude` into the share dir; `claude/fkit-claude-init.sh:299` copies `claude/scaffold/ai-agents`, `:483` the agents, `:488` the skills — and `claude/scaffold/` holds only `AGENTS.md`, `CLAUDE.md`, `ai-agents/`, `universal-rules.md` (`find claude/scaffold -name "*.test.js"` → empty). So a consuming project that **does** have GitHub Actions and **does** run its own `npm test` satisfies the text's stated condition while having **zero** coverage of this invariant — the agent-reader lands on *"genuine belt-and-braces"* for a second layer that does not and cannot exist there. Raised by **both** reviewers (Codex severity: high). |
| R2 | 1     | low    | `claude/skills/fkit-wiki-lint/SKILL.md:187-188` — *"the typical consuming project, with no `.github/` and nobody running the suite by hand"* | **A present-tense population claim about repos this file cannot see** — the same defect family as D1/D2, one abstraction level up. Nothing in the tree supports a census of consumers' CI providers or their habits, and the clause conflates `.github/` with automation (other CI systems exist). Per R1 it is also the **wrong variable**: a consumer *with* `.github/` still has no ADR guard. ⚠️ **This does not re-litigate the owner's "Name fkit's CI (Recommended)" ruling** — that ruling settled the **gate-side example**, and the recommended repair here (say what fkit ships, rather than what other repos have) is compatible with it and in fact strengthens naming fkit. Raised by **both** reviewers (Codex severity: low). |
| R3 | 1     | low    | `claude/skills/fkit-wiki-lint/SKILL.md:184` — *"only once the collision has been committed and pushed"* | **Over-applies a CI-only limitation to every `npm test` run, and contradicts the paragraph's own later scoping.** The clause is conjoined to *"only where something actually runs `npm test`"*, i.e. it is asserted of a **manual** run too — but `npm test` reads the **working tree**, uncommitted work included. `bin/release.mjs:167-174` states this explicitly: *"IT DOES NOT REQUIRE A CLEAN TREE, and must not. `npm test` reads the WORKING TREE … That is the point: CI cannot cover this, it never sees the tree."* The paragraph's closing sentence already scopes the limit correctly (*"even a green **gate** only ever sees what was already pushed"*), so the two clauses disagree with each other. ⚠️ **Cannot weaken the instruction** — it errs toward *less* coverage, i.e. toward not skipping. Codex-only (Codex severity: medium; I lower it — see the partial disproof note in the report). |

## Coder response

*(coder-owned — do not write here)*

**Round 1 response — all three findings CORRECT, all three fixed in one rewrite of the same
parenthetical.** Each was re-verified against the tree by me before acting; none was taken on the
reviewer's word. Owner dispositions relayed live via `AskUserQuestion` (2026-08-15/16) authorized the
rewrite: R1+R2 *"Fix now, one rewrite (Recommended)"*, R3 *"Fix alongside R1/R2 (Recommended)"*,
round 2 *"No round 2 (Recommended)"* — conditional on the change staying inside that one
parenthetical, which it did (**one hunk, one file, `+8/−6`**).

⚠️ **R1's disposition is an owner-ruled amendment to the approved plan**, not a builder correction:
the plan's Insert block conditions coverage on *"does an automated gate exist"*, and that axis came
from the brief. The owner recast it on the real axis. Recorded here so the plan/landed-text
divergence is not read later as scope drift.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — independently verified, not inherited | **Defect** (in the replacement text; spec-level in origin, not a builder error) | Recast the sentence on the shipping axis instead of the gate axis: *"that test lives in fkit's own repo and ships nowhere else, so in a consuming project nothing runs it, whatever CI that project has"*. The gate-exists conditional is gone. | **Fixed** |
| R2 | **CORRECT** | **Defect** (same family as D1/D2 — an unsupportable present-tense claim about repos this file cannot see) | Deleted the population clause *"the typical consuming project, with no `.github/` and nobody running the suite by hand"* outright. The new text says only what **fkit ships**, never what other repos have. The fkit-side example (*"GitHub Actions runs the suite on every push to `main` and every pull request"*) is retained per the standing *"Name fkit's CI"* ruling — re-verified true against `.github/workflows/test.yml` (`on: push: branches: [main]`, `pull_request:`). | **Fixed** |
| R3 | **CORRECT** | **Defect** (internal contradiction; errs toward less coverage, so it never weakened the instruction) | Removed *"only once the collision has been committed and pushed"* from the head clause, where it was asserted of manual runs too. The limitation now appears **once**, scoped to CI only, and named as such: *"even a green **CI gate** only ever sees what was already pushed"* — "gate" → "CI gate" per the disposition. | **Fixed** |

### Verification I ran myself, per finding

- **R1 — the shipping claim (the whole rewrite rests on it): CONFIRMED.** `test/adr-number-uniqueness.test.js`
  lives at the **repo root** `test/`, outside everything that ships. `install.sh:42-43` does
  `rm -rf "$SHARE/claude"` then `cp -R "$TMP/src/claude" "$SHARE/claude"` — only `src/claude`.
  `find claude -name "*.test.js"` → **empty**; `find claude -name "package.json"` → **empty**, so a
  consumer receives neither the test nor the `npm test` script that would run it. Convergence copies
  `claude/scaffold/ai-agents`, `claude/agents/fkit-*.md`, `claude/skills/fkit-*` — `claude/scaffold/`
  holds only `AGENTS.md`, `CLAUDE.md`, `ai-agents/`, `universal-rules.md`. A consuming project with
  GitHub Actions therefore satisfies the old text's condition with **zero** coverage of this
  invariant. The reviewer's line cites are slightly off in the tail (`install.sh:43` is the `cp`;
  `:42` is the `rm -rf`), which does not touch the conclusion.
- **R2 — CONFIRMED by absence of any supporting evidence.** Nothing in the tree licenses a census of
  consumers' CI providers or their habits. Nothing was needed to disprove it beyond R1: a consumer
  *with* `.github/` still has no guard, so the clause is wrong on its own axis as well as unsourced.
- **R3 — CONFIRMED, including the reviewer's downgrade of Codex's stronger claim.** `package.json:5`:
  `"test": "node --test test/*.test.js && bash test/prove-red.sh"` — a manual run reads the working
  tree, so the committed-and-pushed limit is false of manual runs. `bin/release.mjs:167-174` says so
  in terms: *"IT DOES NOT REQUIRE A CLEAN TREE, and must not. `npm test` reads the WORKING TREE …
  That is the point: CI cannot cover this, it never sees the tree."* I agree with the reviewer's
  scoping over Codex's broader framing.

### Regression check

`npm test` re-run after the edit: **exit 0**. `tests 730 / pass 730 / fail 0 / cancelled 0 /
skipped 0 / todo 0`, `duration_ms 63477.388`; prove-red hard gate **PASSED** — 11 unmutated
baselines (`0a`–`0k`) green, all 22 mutations red on their **named** assertion. Wall clock
00:05:30 → 00:12:37 (~7m07s). Full output captured to a file and read from the file, not a pipe.

⚠️ **This proves nothing about the prose.** No test reads a reasoning paragraph in a `SKILL.md`. The
suite is a no-regression check only; the evidence bearing on the wording is the argument above, not
machine verification.

## Accepted residuals (shared, do-not-re-litigate)

- **The gitignored dogfood copy stays stale until the next launch** — What: `.claude/skills/fkit-wiki-lint/SKILL.md` still carries the old false paragraph (verified: its `:184` still reads *"this project has no CI"*), and was deliberately **not** hand-edited. · Why (structural): launch convergence `rm -rf`s then `cp -R`s every `fkit-*` skill dir from `claude/skills/` on each init/launch (`claude/fkit-claude-init.sh:485-488`), so the copy is regenerated, not maintained; hand-editing a regenerated gitignored artifact is the rejected alternative. · Re-raise only if: convergence stops refreshing skill dirs, or a role is shown reading `.claude/skills/` text that convergence will never reach.
- **No replacement citation was added** — What: the fabricated cite was deleted, not replaced. · Why (structural): the brief permits none, the new sentence asserts nothing needing a source, and `architecture.md`'s `:NNN` anchors are demonstrably drifting (the brief's own `:480`/`:597` are already `:496`/`:615`), so a fresh anchor would be a new liability of exactly the kind this task repairs. Rejected alternative: cite `architecture.md:31`/`:480`. · Re-raise only if: a reader is shown unable to act on the sentence without a source.
