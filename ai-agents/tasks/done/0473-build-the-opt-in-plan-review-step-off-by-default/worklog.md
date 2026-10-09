# Worklog — 0473: Build the opt-in plan-review step (off by default)

Build worker: spawned `fkit-coder`, caller `fkit-sprint-ship-loop` (Sprint 10), 2026-10-06. Approved plan
carried verbatim with its blob pointer (hash re-checked equal at start). Owner approval as relayed by the
driver: "Approve, with §7 fix (Recommended)"; Q1 "Sprint-loop runs only (Recommended)"; Q2 "Plan
unchanged + coder check (Recommended)"; Q3 "Only when it's on (Recommended)" — all `AskUserQuestion`,
`fkit-lead` session, 2026-10-06. ADR-056 linked by filename; no ADR edited. `plan.md` not touched.
No commit, no push, no wiki-vault write.

## Pending questions resolved (per the relayed rulings)
- Q1 = A: no brief field; `fkit-task-ship-loop`, `fkit-task-brief`, `dashboard.sh` untouched.
- Q2 = A: after Codex the plan is not changed; each finding gets a separate one-line coder check.
- Q3 = A: off runs report exactly as before; only on-run lines were added.

## Step 0 — snapshot
- Scratchpad folder `0473-snapshot/` (new; no other task's folder touched): `targets.tar` + `files/`
  (20 target files, incl. `CLAUDE.md`, `AGENTS.md`, both scaffold twins, `fkit-task-ship-loop`),
  `sha-before.txt`, rules-block regions `rules-CLAUDE.md.before` / `rules-AGENTS.md.before`
  (3906 B each, identical), and a tar of `.claude/`. The new test file was absent (diffed vs /dev/null).
- Drafts were written in a scratch work copy during the baseline run and installed only after it
  finished, so the real tree was not edited while a run was in progress.

## Change surface
- `claude/skills/fkit-plan-task/SKILL.md` — new gated section `## Plan review — only when the switch is on`
  between `<!-- plan-review:begin -->` / `<!-- plan-review:end -->` (gate, hop check, classify with the
  §3.2 wording verbatim, ask, ≤2 revision rounds, round-2 escalation, Codex last, record block,
  incomplete flag). Workflow list and every other line unchanged.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — Argument paragraph (optional `--plan-review`, default
  off, litmus sentence; "One operand" became "One operand, plus one optional flag"); one gated block
  below the step table (end of §2) holding §4 + D4 + D5; one Progress-reporting bullet (on-run lines
  only). Plan row and "Rules that make this honor the ADRs" untouched.
- `claude/agents/fkit-lead.md` — conductor-remit bullet: pass `--plan-review` only when asked, never
  unasked, never carried to another run; sprint loop only.
- `claude/agents/fkit-coder.md` — `fkit-plan-task` procedures line gains one sentence; new
  *Consulting a teammate* bullet `fkit-adversarial-reviewer` — only for the plan-review Codex pass.
  §Mode carve-out untouched.
- `claude/agents/fkit-producer.md`, `claude/agents/fkit-architect.md` — consult-mode paragraph
  "Asked to approve a plan": `APPROVE` / `CHANGES REQUESTED`, numbered reasons, classification check
  first, hop 2 consults no one; architect points at its existing unanticipated-decision caveat.
- `claude/skills/fkit-adversarial-review/SKILL.md` — argument accepts a pasted plan; prompt-assembly
  bullet for a plan; plan hunt list; plan finding locations (plan section + code `file:line`;
  coordination docs by heading + quoted phrase, never path:line). Banner and output contract unchanged.
- `claude/agents/fkit-adversarial-reviewer.md` — description and "What you receive" add "or a plan".
  Still a leaf (tools line unchanged).
- `ai-agents/tasks/README.md` + `claude/scaffold/ai-agents/tasks/README.md` (byte-identical) — tree
  line `plan-review.md` + reserved-names sentence (paragraph re-wrapped).
- `ai-agents/README.md` + `claude/scaffold/ai-agents/README.md` — `tasks/` row lists `plan-review.md`.
- `claude/structure-manifest.tsv` — `npm run generate:manifest` (85 entries; +2 rows: new hashes for
  `ai-agents/README.md` and `ai-agents/tasks/README.md`). `git status` showed no other task's edits
  under `claude/scaffold/` before generating.
- `test/coordination-citation-policy.test.js` — cited-target class widened to include `plan-review`
  (comment cites ADR-056); arm M5 gains a `plan-review.md:12` target that must red; negative arm text
  "four" → "five".
- `test/plan-review-switch.test.js` — new: 8 arms + 6 control arms (C1–C6), reads `claude/` only.
- `CHANGELOG.md` — Unreleased line for opt-in plan review.
- Not touched (as planned): `fkit-task-ship-loop`, `fkit-task-brief`, `dashboard.sh`,
  `skills-for-role.sh`, hooks, `fkit-claude-init.sh`, rules block, `structure-spec.md`, `README.md`,
  `bin/fkit-board.mjs`, any ADR, `plan.md`.

## Installed copies (§7 fix)
- `bash claude/fkit-claude-init.sh .` run after the build; exit 0.
- Rules block: `cmp` of the region in `CLAUDE.md` and `AGENTS.md` against the Step-0 snapshot —
  byte-identical, 3906 B before and after. Whole `CLAUDE.md`, `AGENTS.md` and both scaffold twins:
  sha256 unchanged. `git status --short` identical before and after init.
- `.claude/` copies of all nine relevant agent/skill files `cmp`-equal to `claude/` after init.

## Verification
### Baseline (before any edit), scratch copy
- `rsync -a` of the working tree incl. `.git`, no `node_modules`. Copy == snapshot for all 20 target
  files (sha256).
- `npm test`: 10:50–11:21 UTC (~31 min), load ~5.6 start / ~5.5–6.3 end (21 users). Exit 0.
  `node --test` 1057/1057 pass, 0 fail/skip; prove-red hard gate PASSED (mutations 1–43 red). No
  pre-existing failures.

### Targeted checks (real tree, after build + manifest + init)
- `test/plan-review-switch.test.js` 14/14.
- `test/coordination-citation-policy.test.js` 21/21.
- `spawned-write-marker`, `carry-check-hook`, `skill-frontmatter`, `skill-ownership-hook`,
  `launcher-contract`: 367/367.
- `reference-integrity`, `adr-number-uniqueness`: 36/36.
- `rules-block-budget`: 3/3 (+ the cmp above).
- `structure-manifest`, `dual-home-parity`, `structure-check`, `structure-notice`, `structure-repair`,
  `structure-spec`: 83/83.
- First draft of control arm C1 was vacuous (moved a line carrying no vocabulary); caught in a trial
  copy before install, fixed to move the `plan review incomplete` line. Now reds as intended.

### Final full suite
- Fresh `rsync -a` copy (incl. `.git`, no `node_modules`) taken after build, manifest and init;
  sha256 of all 21 changed/new files equal to the real tree at run start **and** at run end (no edit
  to the real tree during the run).
- `npm test`: 11:23–11:53 UTC (~30 min), load ~5.7 at start, ~7.1–7.6 at end (21 users). Exit 0.
  `node --test` **1071/1071** pass, 0 fail/skip/cancelled (= baseline 1057 + the 14 new arms);
  prove-red hard gate PASSED. One run, not retried.

### Snapshot diff — "off = today" (brief verification 1)
- `fkit-plan-task`: new file with the gated block removed == snapshot, byte for byte.
- `fkit-sprint-ship-loop`: new file with the gated block removed differs from the snapshot in exactly
  two places: the Argument paragraph (the `--plan-review` sentence, "One operand, plus one optional
  flag", the litmus sentence) and the one Progress-reporting bullet. Both are the plan's item 2; the
  two vocabulary-bearing sentences are the test's allowlist.
- `fkit-task-ship-loop`: unchanged (sha256 = snapshot).
- Agent/skill files: additions only, plus the re-wrapped adversarial-reviewer description and "What
  you receive" lines, and the adversarial skill's Argument line.

### Paper walk-through (against the canonical text)
1. **Off run** — no flag → Argument: absent = off; gated block: "skips this block entirely"; Plan row
   as written; no switch line in the spawn → `fkit-plan-task` gate: "Otherwise skip this whole
   section" → step 6 to 7 as before. No approver consult, no Codex plan pass, no `plan-review.md`,
   no report line (Progress-reporting bullet). ✔
2. **On + code-only** — lead passes `--plan-review` (lead bullet) → opening "Plan review: ON for this
   run" → switch line in the plan-only spawn → coder hop 1, hop check passes → classify code-only →
   architect only → `APPROVE` → Codex → plan + record → gate: banners, plan, three attachments →
   decision → `plan.md` (approve) + `plan-review.md` `## Attempt 1`. ✔
3. **On + product / unclear** — producer and architect asked in parallel, both cases. A disputed
   code-only → unclear, producer added. ✔
4. **Forced round-2 disagreement** — "There is no round 3" → `NEEDS-DECISION`, no Codex → driver
   relays → re-spawned coder skips steps 1–3, applies the ruling, runs Codex. ✔ (Session path: not
   applicable, Q1 = A.)
5. **Codex unavailable** — fallback banner first, verbatim (step 5) → gate banners first → roll-up
   flags `claude-fallback — NOT model-diverse` loudly; a Codex spawn that cannot run → `plan review
   incomplete: <what>` at the top. ✔
6. **Switch via the lead** — only when asked, never unasked, never carried; the next run is off →
   walk-through 1. Roll-up says "Plan review: on" only in the on run. ✔
7. **Hops / ADR-018** — lead (0) → coder (1) → approvers / adversarial reviewer (2); prompts carry
   "hop 2 of 2"; approvers consult no one; adversarial reviewer is a leaf. Approvers run no skill; the
   adversarial reviewer runs only its own skill. Live smoke test below: no denial. ✔

### Live smoke test (hop 2, installed text)
Build worker at hop 1 (chain lead → coder) spawned `fkit-architect` and `fkit-adversarial-reviewer` in
parallel at hop 2 on a toy plan (a comment claiming the harness's `REPO` is `process.cwd()` —
deliberately false), after `fkit-claude-init.sh` had refreshed `.claude/`.
- **Spawns landed; nothing denied** (both report no denied tool or Skill call). The adversarial
  reviewer's `Skill(fkit-adversarial-review)` was allowed.
- **Reply shapes parse:** architect first line `CHANGES REQUESTED`, numbered reasons, open questions
  "none". Adversarial reviewer: findings list X1–X2 + coverage line, mode `[codex]`.
- **Codex accepts a plan input:** ran `codex exec --sandbox read-only --cd "$PWD" -` on the plan
  prompt; X1 caught the false claim citing the harness code; X2 flagged the planned check as unable to
  fail. Codex only read and reasoned (no commands bearing on a finding).
- ⚠️ **Installed text at hop 2 — mixed, reported as observed:**
  - **Skill text: live.** The adversarial reviewer quoted the new "When the input is a plan" passage
    from the skill as loaded by the Skill tool.
  - **Agent system prompts: NOT live.** The architect reported its "Asked to approve a plan"
    paragraph **absent**; the adversarial reviewer reported "What you receive" **without** "or a
    plan" — although both `.claude/agents/` files carried the new text on disk (checked) before the
    spawns. So a hop-2 spawn from this spawned coder got agent definitions older than the refresh
    (most likely those loaded when the lead session started). This is the agents' self-report — an
    observation, not a mechanism proof.
  - **Consequence:** the reply shape still parsed because the asking prompt carries it (`fkit-plan-task`
    step 2 puts the question shape in every approver prompt). But the approvers' new judging guidance
    reaches them only after the owner **relaunches `fkit lead`** after 0473 lands (plan §10) —
    0474's first run must start from a fresh launch.

## Decision log
- none. No fix was applied without asking and no obvious-winner call was made beyond the approved plan.
  Wording choices inside the plan's stated scope (noted for review, not decisions): "One operand" →
  "One operand, plus one optional flag" in the Argument paragraph (the old sentence would be false
  with a flag); the coder bullet's "Nothing else — a review of your code is the reviewer's"; a
  one-line R4 mitigation in the gated section ("never quote a live plan pointer line"); the
  re-spawned coder "skip steps 1–3" clarification of §3.5.

### Process review, round 1 — fixes applied without per-fix asking (2026-10-06)
Process-review worker: spawned `fkit-coder`, caller `fkit-sprint-ship-loop` (Sprint 10), under the
declared-approval marker. Standing approval: the approved plan (blob re-checked equal at start) plus the
owner's round-1 rulings as relayed — R1 "Fix the comment only (Recommended)", R3 "Fix all three now
(Recommended)" (`AskUserQuestion`, `fkit-lead` session, 2026-10-06). Each entry: finding · change · why
it qualified. No obvious-winner call beyond these.
- **R1** · `test/plan-review-switch.test.js` header comments only: ⚠️ item 2 now says "Off = today" is
  not proven by the file, which detects plan-review vocabulary outside the markers / allowlist; the
  opening "pins that shape" narrowed. · Verified CORRECT (the guard is `/plan[- ]review/i` only);
  mechanical, comment-only; in plan via the owner's R1 ruling (no stricter pinning).
- **R2** · `fkit-sprint-ship-loop` gated block, "Not a new plan step" bullet: "rejected-plan re-plan" →
  the rejected-plan path (task back to Backlog, skipped this run — the *Plan rejected* stop row), plus
  "a task planned afresh in a later `--plan-review` run is a new plan step, and is reviewed". · Verified
  CORRECT (the loop has no in-run re-plan; *Plan rejected* row resets the task and skip-sets it);
  localized, inside the markers; restores the plan's D5 meaning and D1's "every task planned in that
  run". ADR-056 Decision 5 not touched — the driver routed it to an architect dated note.
- **R3** · one phrase each: `plan-review.md` in the Location rule's coordination-document list of
  `fkit-stateful-review` and `fkit-process-stateful-review`; "a plan-review record" and the missing "a
  review ledger" in `fkit-adversarial-review`'s plan-location sentence. · Verified CORRECT (the guard's
  target class includes `plan-review` since 0473; the three lists did not); mechanical; in scope by the
  owner's R3 ruling, which widened 0473 to exactly these three.
- **R4** · `fkit-adversarial-review`, 0473's own plan text: the plan-location paragraph gives a
  gap/creep-against-brief finding a location (plan section + brief heading + quoted phrase) and says such
  a location is the `file:line` the output contract asks for; the plan prompt-assembly bullet carries
  "its location rule" into the Codex prompt. · Verified CORRECT (contract: "If you can't point to it,
  don't report it"; brief citations barred from `path:line`); localized to plan item 7's own text;
  output contract and fallback banner left byte-unchanged, as plan item 7 requires (arm 6 green).
- **R6** · `fkit-plan-task` gated section, "Hop check first": the branch now returns a record block
  holding the switch line, two times and `Problems: hop limit hit — plan review not run`. · Verified
  CORRECT as a spec gap (the driver copies "the returned record block"; the branch returned none);
  localized, inside the markers; matches plan §3.7's "problems: … a hop limit hit".
- **R7** · `test/coordination-citation-policy.test.js` arm M10: an open `plan-review.md` is scanned and
  a coordinate in it reds. · Verified CORRECT (only M5's cited-side arm existed); additive test in
  plan item 12's file; red-proven twice (narrowed walk, widened exemption).
- **R5** · no change by this worker — routed to the producer by the driver; landed in 0474's brief.

### Process review, round 1 — verification
- Round snapshot first (scratchpad `0473-pr1-snapshot/`, the 9 files this round touches plus
  `CLAUDE.md` / `AGENTS.md`); diffs are against it, not `git diff`.
- Targeted, real tree: `plan-review-switch` + `coordination-citation-policy` 36/36 (14 + 22);
  with `reference-integrity`, 58/58.
- M10 red-proofs, scratch mutation copy: `collectFiles()` narrowed to brief/plan/worklog/review → M10
  red, other 21 green; `exempt()` widened with `/plan-review.md` → M10 red; restored → 22/22. No
  control arm changed this round (R1 is comment-only).
- Full `npm test`, fresh copy `0473-pr1/` (rsync incl. `.git`, no `node_modules`), sha256 of all 9
  changed files equal to the real tree at start and at end: 13:19–14:07 UTC (~48 min), load 10.8 at
  start, ~28 mid-run, 5.1 at end (21 users). Exit 0. `node --test` **1072/1072** (= 1071 + M10), 0
  fail/skip/cancelled; prove-red hard gate PASSED (mutations 1–43 red). One run, not retried.
- `bash claude/fkit-claude-init.sh .` after the run: exit 0; `git status --short` identical before and
  after; `CLAUDE.md`, `AGENTS.md` and both scaffold twins sha256-unchanged; rules block in both
  `cmp`-equal to the build's `0473-snapshot` region (3906 B). `.claude/` copies of the five touched
  skills `cmp`-equal to `claude/`.
- This verification block was written after the run, so `worklog.md` differs from the copy by it;
  the citation guard was re-run on the real tree afterwards (green).

## Not done / unverified
- Runtime obedience (a driver adding the switch line only when asked, a coder keeping the 2-round cap)
  is prose — trust, not proof (ADR-056 Decision 8). The test guards words on disk only.
- Agent-prompt text was not live at hop 2 in this spawn (above); the first fully-installed run is the
  owner's first `--plan-review` run after relaunching `fkit lead` (0474).
- A full plan-review flow (real classify → rounds → record → driver writes `plan-review.md`) was not
  run end to end; only the topology and reply shapes were smoke-tested.
- Wiki re-sync for ADR-056 and the changed skills: recommended for `fkit-wiki`, not done here.
