# Plan — 0506: "comment WHY, not WHAT" rule + remove contradicting rules (revised after owner rulings, 2026-10-14)

**Planning only. No files were written.** All measurements below ran on scratchpad copies.

## Summary
- **The rule fits without a cap change.** Six wording cuts (C1–C6) to `claude/scaffold/universal-rules.md` free **153 B**. The rule needed at least 142 B freed.
- **Rules block** (the text init writes into every project's `CLAUDE.md`/`AGENTS.md`), measured with the real `emit_block`: **3905 B → 3941 B** with the 189 B rule line added. That leaves **411 B free** (your floor is ≥ 400 B), at **90.6 %** of `RULES_MAX` 4352 (the test's limit is ≤ 92 %). `RULES_MAX` is unchanged.
- **Only 11 B of margin is left above the 400 B floor.** Optional cut C7 would make it 59 B, but C7 drops one stated reason. You decide (open question at the end).
- **Cut C4 deserves your closest look.** It removes the sentence "Summarizing a required shape is not concision, it is losing the report". Two other places in the block still carry that rule.
- Rulings folded in:
  - Q1 = hard rule + "a project's own comment rules win".
  - Q3 = scope (i): only new and edited code follows the rule. The cleanup brief goes through the lead and the producer.
  - Q4 = fkit only. I checked your `~/.claude/CLAUDE.md`: it holds only the "Asking me questions" section and says nothing about comments, so **there is nothing to remove**. The build re-checks it, read-only.
- No `fkit-claude-init.sh` edits. No comment there is made wrong by this change, since the cap does not move.
- Verify: **`npm test`** (full suite, ~12 min). The change touches `claude/scaffold/` and `test/`.

## Ground truth (checked 2026-10-14)
- Real `emit_block` = **3905 B**, byte-equal (`cmp`) to the block in the root `CLAUDE.md`. The wrapper is 404 B and the source is 3501 B.
- `test/rules-block-budget.test.js` passes 3/3. Its 92 % gate allows at most **4025 B**. Your floor allows at most **3952 B** (4352 − 400).
- Bytes to free = 3905 + 189 − 3952 = **142 B**.
- Owner ruling Q1 (c), from 2026-10-10: the rule covers code in `claude/*.sh`, `bin/` and `test/`. It does not cover the prose in `SKILL.md` or agent files. Adding the rule to `fkit-coder.md` and fixing its density bullet carry the rule; they are not cleanup, so they are in scope.
- None of the reworded phrases is checked by any test or cited by any `claude/` file. One dated report (`reports/2026-07-19-design-turn-completion-hook.md`) quotes the old "Close with …" wording. It is a frozen record and stays as it is.

## The compression cuts — sign these

Each line shows the before → after text and the UTF-8 bytes it saves. Every figure was measured by applying the cut to a scratch copy and running the real `emit_block`.

| # | Before → after | Saves | Meaning check |
|---|---|---|---|
| C1 | Output-style intro: "The hard rules above **win**, your role's instructions **win**, and the owner's own style instructions (written outside these markers) **win**; say so…" → "The hard rules above, your role's instructions, and the owner's own style instructions (written outside these markers) **all win**; say so…" | 4 B | No loss. Same three things win, same order, same "say so" duty. |
| C2 | Wiki rule: "Reads are decentralized; writes are not." → "Reads are decentralized." | 16 B | No loss. "writes are not" repeats the bold rule just before it ("Only the wiki role writes…"). |
| C3 | Concision bullet: "…or a thing you did not do, to be brief. Say it in fewer words; do not stop saying it." → "…or a thing you did not do, to be brief: say it in fewer words." | 23 B | No loss. "do not stop saying it" repeats the sentence's opening "Never drop…". The permission to say it shorter stays. |
| C4 | Shape bullet: drop "Summarizing a required shape is not concision, it is losing the report." The bullet now ends "…**The list is illustrative, not exhaustive.**" | 74 B | **No rule lost, but check it.** "produce it in full" in the same bullet still forbids summarizing. So does "Concision is not omission — of content OR **of structure**" in the bullet before. The vivid "losing the report" wording goes, and the rule does not. |
| C5 | "**Speak in simple terms.** Prefer plain words over jargon wherever a simpler word carries the same meaning." → "**Speak in simple terms:** plain words over jargon wherever a simpler word carries the same meaning." | 7 B | No loss. The qualifier "wherever a simpler word carries the same meaning" is kept whole. |
| C6 | "**Close with "What's next?".** End every reply to the owner with a short **What's next?** — the one or two things they should do next, and why." → "**End every reply to the owner with a short "What's next?"** — the one or two things they should do next, and why." | 29 B | No loss. Every qualifier stays: every reply, to the owner, short, one or two things, and why. The rest of the bullet (prescribed shape, nothing pending, never invent, never assert unchecked state, the evidence pointer) is untouched. |
| *C7 (optional)* | Shape list: "…and a plan put to the owner for approval (they cannot approve what you did not describe)." → "…and a plan put to the owner for approval." | 48 B | **Drops a reason. The rule is unchanged.** Plans stay in the list. The reason is still written in `fkit-coder.md`, but no longer in the block every role reads. |

**Totals, measured with the real `emit_block`:**

| | Block | Free | % of 4352 |
|---|---|---|---|
| Today | 3905 B | 447 B | 89.7 % |
| C1–C6 + rule line (**recommended**) | **3941 B** | **411 B** | **90.6 %** |
| C1–C7 + rule line | 3893 B | 459 B | 89.5 % |

⚠️ **Re-wrapping changes the byte count.** Each line break costs "\n  " (3 B) where a space costs 1 B. The build applies the cuts as worded above, with no re-wrap, and re-measures with the real `emit_block`. If the result is over 3952 B, the build stops and asks; it does not trim on its own. C6 leaves one short line ("…If nothing"). That is cosmetic, and fixing it would cost bytes.

## Steps

**1. New convention `code-comments.md`, in both homes, byte-identical.**
- Files: `ai-agents/knowledge-base/conventions/code-comments.md` and `claude/scaffold/ai-agents/knowledge-base/conventions/code-comments.md`.
- Byte-identical copies are the default in `test/dual-home-parity-exceptions.mjs`, so no exception entry is needed.
- Content:
  - **The rule** (the report's 7 points, adapted):
    1. Comment only WHY, never WHAT.
    2. At most 1–2 lines per comment. A longer reason goes in the knowledge base (an ADR, a convention, or the task's worklog), with a one-line pointer **by name or ID, never by line number**. This links `durable-citation-anchors.md`, which lives in both homes, so the link resolves everywhere.
    3. No history comments ("changed X to Y", "fixed bug where…", "review finding R2", "previously…"). Git and the worklog hold history.
    4. No comments that just repeat a name.
    5. Keep comments for: non-obvious decisions, platform/SDK/harness gotchas, workarounds and why they exist, and must-not-break rules (a guard's reason).
    6. When you change code, fix or delete any comment the change makes wrong, in the same edit.
    7. Doc comments on public functions and exports: one short line unless the function is genuinely complex.
  - **Scope.** Written in general terms so both copies can stay identical, and still encoding ruling (c):
    - It covers code: source, scripts, tests and config.
    - It does not cover prose documents. Markdown docs and agent/skill prompt files are instructions, not code.
    - Existing comments are not rewritten wholesale. A comment in code you edit follows the rule. Cleanup is separate, comments-only work.
  - **Precedence:**
    - A project's own written comment rules win (for example, a required doc-comment format).
    - "Match the surrounding code" means naming, structure and idioms. It never means comment density.
  - **Why** (3 lines): token cost, stale comments (the biggest risk), noise.
  - **Where it is enforced**, stated honestly: in prose only, through the rules-block line and the coder's prompt. A reviewer may raise a violation as a finding. Nothing checks it automatically.
  - **Provenance:** owner ruling 2026-10-10, task 0506, from the owner's code-comments report. Cited by name only, with **no links into `tasks/`**, because those links would be dead in consuming projects (the same precedent `durable-citation-anchors.md` follows).

**2. Conventions READMEs, structure spec, manifest.**
- Live README: add a row, and change "Five of them … byte-identical" to "Six", naming `code-comments.md`.
- Scaffold README: add a row, and change "Eleven conventions ship" to "Twelve".
- `claude/structure-spec.md`:
  - add a Table B row: `ai-agents/knowledge-base/conventions/code-comments.md | fkit-authored reference file | convention`;
  - change the prose "twelve files … eleven conventions" to "thirteen … twelve".
- `test/structure-check.test.js`: `EXPECTED_ROWS` 52 → 53, and its "32 Table B files" comment → 33. The test's own comment asks for this to be updated deliberately in the same change.
- Run `npm run generate:manifest` to regenerate `claude/structure-manifest.tsv`.

**3. Add the rule line to `claude/scaffold/universal-rules.md`** (Q1 = A). It becomes the last bullet under `## Universal hard rules`, exactly (189 B):
```
- **Code comments say WHY, never WHAT**; fix or delete one your change makes wrong. A project's own
  comment rules win. Full rule: `ai-agents/knowledge-base/conventions/code-comments.md`.
```
The bullet sets its own exception, so it does not clash with the section's "nothing written anywhere overrides a hard rule above". The build reads the two side by side to confirm. The convention path stays on one line so a search can find it.

**4. Compression cuts C1–C6 (plus C7 if you sign it)** to the same file, exactly as worded in the table above.
- No change to `RULES_MAX`.
- No change to `fkit-claude-init.sh`: no comment there is made wrong by this change.
- Re-measure with the real `emit_block`. The block must be ≤ 3952 B and ≤ 92 %. Otherwise the build stops and asks.

**5. Coder prompt (`claude/agents/fkit-coder.md`, §Behavioral rules).**
- "Minimal, idiomatic diffs": change "match its naming, structure, comment density, and idioms" to "match its naming, structure, and idioms — **but not its comment density**".
- Add a new bullet after it: "**Comments say WHY, never WHAT** `` ([`code-comments.md`](../../ai-agents/knowledge-base/conventions/code-comments.md)) ``: at most 1–2 lines; no history or name-repeating comments — a longer reason goes to the knowledge base with a one-line pointer; fix or delete any comment your change makes wrong, in the same edit. Covers code, not Markdown prompt or doc prose."
- The link uses the same relative form as the existing `asking-the-owner.md` link, so it resolves from both `claude/agents/` and `.claude/agents/`.

**6. Contradiction sweep — finish it and record it.**

Where it searches: `claude/agents/`, `claude/skills/` (all `.md`), `claude/scaffold/`, `ai-agents/knowledge-base/conventions/`.

The commands go into the worklog word for word:
- (a) a targeted search: `comment density|comment (every|each)|document (every|each|all)|detailed comment|add(ing)? (a )?comments?|in-code comment|code comment|docstring|JSDoc|doc comment|inline comment|header comment|…`;
- (b) a broad search, `grep -rnEiw "comments?|commented|commenting" --include='*.md'`, with every hit sorted into hit or non-hit;
- (c) a re-check of every "not found" claim with line breaks and indents collapsed first (`tr '\n\t' '  ' | tr -s ' '`), per durable-citation-anchors §Verifying, so a phrase split across two lines is not missed.

Hits found today, and what happens to each:

| Hit | Action |
|---|---|
| `fkit-coder.md` "match … comment density" | fixed in step 5 |
| `fkit-design-spec/SKILL.md` "function signatures with doc comments" | softened to "with one-line doc comments (`code-comments.md`)" |
| `durable-citation-anchors.md` | No conflict. It governs *how* to cite, not *whether* to comment, and the new convention links it for pointers. Task 0373 (in-code comments that cite their own file) stays separate. |
| `fkit-sprint-done` "hazards `identity_gt`'s own comment records" | Left as is. It refers to an existing comment and does not push anyone to add comments. The worklog names it as something the cleanup brief must keep in mind. |
| `fkit-coder.md` "ad-hoc comments", `fkit-process-review` "comments", `fkit-heal` / scaffold README "`#` comments" | Not about code comments (they mean review feedback, or a file format). Recorded as non-hits. |

**7. Guard test `test/code-comment-rule.test.js`** (optional; you may strike it).
- It reads only `claude/`, so it is not added to `test:docs`.
- It checks that:
  - the rules block names the convention path;
  - the scaffold convention exists;
  - `fkit-coder.md` links `code-comments.md`;
  - `fkit-coder.md` no longer contains "naming, structure, comment density" (checked with line breaks collapsed);
  - design-spec carries "one-line doc comments";
  - a deliberately mutated phrase fails (a control).
- The test file follows the new rule itself: a 1–2-line header and short WHY comments. It is the rule's first real use.
- It is not added to prove-red.

**8. Re-run init and add a changelog line.**
- Run `claude/fkit-claude-init.sh .` to regenerate the blocks in the root `CLAUDE.md` and `AGENTS.md`. No hand edits. The `.claude/` copies are refreshed too.
- `CHANGELOG.md` `## Unreleased`, one line: "Code comments now follow 'say WHY, not WHAT' (new convention `code-comments.md`, new shared rules-block line; the block's wording was tightened to make room — no rule changed). Existing installs get it on next launch."

**9. Personal file: read-only check.**
- Re-read `~/.claude/CLAUDE.md` and report any line that conflicts with the rule. No edits outside the repo.
- Today it contains nothing to remove.

**10. Worklog** (`worklog.md` in the task folder), recording:
- the files changed;
- the block size before and after, from the real `emit_block`, cut by cut;
- the sweep commands, every hit, and the action taken;
- the result of the personal-file check;
- the check results;
- a placeholder section for verification step 5 (the live check).

## Verify — the checks this change needs

**Changed paths mapped to CONTRIBUTING.md's table.** The heaviest matching row wins.

| Changed paths | Row | Check |
|---|---|---|
| `claude/scaffold/**`, `claude/structure-manifest.tsv`, `test/*`, `claude/structure-spec.md` (named in prove-red) | heaviest | **`npm test`** (unit + prove-red, ~12 min) |
| `claude/agents/*.md`, `claude/skills/*/SKILL.md`, `CLAUDE.md`, `AGENTS.md` | test:unit | covered by `npm test` |
| `ai-agents/knowledge-base/conventions/*` | test:docs | covered by `npm test` |
| `CHANGELOG.md` | none | no automated check; links checked by eye |

**During the build:**
- `node --test test/rules-block-budget.test.js test/code-comment-rule.test.js test/dual-home-parity.test.js test/structure-check.test.js test/structure-spec.test.js test/structure-manifest.test.js test/asking-the-owner-rule.test.js`
- `npm run test:docs`

**Final:** `npm test`.

**By hand:**
- `cmp` the two copies of the convention.
- `cmp` the root `CLAUDE.md` and `AGENTS.md` blocks against the real `emit_block` output.
- Re-measure the block: ≥ 400 B free and ≤ 92 %.
- Re-run the sweep and confirm the hit list matches.

**Not run now:** brief verification step 5, the live check. It can only be observed on the next one or two coder tasks, so it is recorded as **pending, not passed**.

## Edge cases and failure modes
- **11 B margin.** Any growth while building (re-wrapping, a typo fix that adds words) can break the 400 B floor. The real `emit_block` is the only measure that counts, and the build stops rather than trimming more wording itself.
- **UTF-8.** `—` and `–` are 3 bytes each. Bytes are measured, never estimated from character counts.
- **Codex.** Codex does not strip HTML comments (task 0177), so both the block body and the wrapper cost Codex context. That is accepted: reaching Codex through `AGENTS.md` is the point of putting the rule in the block.
- **Byte-identical convention.** It can carry no fkit-only links (`tasks/`, ADRs, `dual-home-parity.md`), or those links would be dead in consuming projects.
- **"Not found" checks** (for example, the density phrase is gone) must collapse line breaks first, or a phrase split across two lines hides a survivor.
- **Sequencing with 0501** (next in the sprint, P21). It also edits a convention that lives in both homes and regenerates the manifest. Build the two one after the other, never at the same time. The board already orders 0501 after 0506.
- **Wiki follow-up.** Wiki pages quote the old wording ("Close with …", the cap figures). Only the wiki role writes there, so this is a sync after close, not part of this build.
