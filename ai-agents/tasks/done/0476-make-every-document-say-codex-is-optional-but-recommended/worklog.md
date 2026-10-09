# Worklog — 0476 Make every document say Codex is optional but recommended

Build step, run by a spawned `fkit-coder` (Build worker) under `fkit-sprint-ship-loop` on Sprint 10,
2026-10-05. Scope: plan Steps 0, 2, 3, 4, 5, 6. Step 1 (ADR-054 + the ADR-009 Status swap and pointer)
was done earlier by a driver-spawned `fkit-architect` and is not touched here.

## Plan and owner rulings (2026-10-05, `AskUserQuestion` in the lead session, relayed by the driver)

- **Plan gate:** *"Approve with ADR-054"*. This is also the brief's required "specific word" to start.
- **OQ-1** (ADR-009 Status line): *"Yes, update the Status line"*. Done by the architect in Step 1.
- **OQ-2** (ADR-054 re-raise conditions): *"As drafted"*.
- **OQ-3** (a new test pinning the wording): *"No, recorded grep is enough"*. No new test added.
- **Plan bytes.** The owner approved `plan.md` at blob `a34756b03372903a4cacc853bcd24f0fc55c49b7`
  (17456 bytes). The docs guard (`coordination-citation-policy` L2) then failed on its line 6, which
  cited the 0060 brief by line number. By owner ruling (2026-10-05, `AskUserQuestion`: *"Yes, fix that
  one citation"*) the driver changed only that citation to file + quoted phrase (the "The reviewer
  does _not_ hard-fail when Codex is unreachable" ruling). Meaning unchanged. New blob
  `b06693062964a27fbafe0e5a8d4b7d15b1c88b48` (17524 bytes), re-checked with `git hash-object` at the
  end of this step. This worker did not edit `plan.md`.
- **Architect's wording deviation (Step 1), noted:** ADR-054 says ADR-009's sandbox clause is "Not
  amended … governed by ADR-042 D2", where the plan said it "stays in force". More accurate; accepted
  by the driver.

## Step 0 — snapshot

Copied before any edit, to the session scratchpad (not in the repo): `install.sh`,
`claude/fkit-claude.sh`, `architecture.md`, `CHANGELOG.md`, `CLAUDE.md`, `AGENTS.md`, `PROJECT.md`,
`claude/README.md`, ADR-009, root `README.md`. "0476's diff" below means `diff <snapshot> <file>`,
because the working tree holds other tasks' uncommitted edits in several of these files.

## Steps 2–3 — the edits (7 files + CHANGELOG)

| File | Lines (snapshot → now) | Change |
|---|---|---|
| `CLAUDE.md` | 128 → 129 (+1, allowed by the plan) | :17-19 "Codex is **optional but recommended** … without it, that opinion falls back to Claude only, loudly flagged as not model-diverse ([ADR-054](…))". Outside the rules block. |
| `ai-agents/knowledge-base/PROJECT.md` | 135 → 136 (+1) | :90-92 same sentence, link to ADR-054, "amending ADR-009 §2". Inbound line citations into PROJECT.md (`:8`, `:18-24`, `:71-72`) are all above line 90, so none move. |
| `ai-agents/knowledge-base/architecture.md` | 636 → 636 | :58 cell → "**Optional but recommended — warned, never walled** (owner rulings 2026-07-11, Sprint 2 task 3, and 2026-10-02, ADR-054) … falls back to Claude only, loudly flagged NOT model-diverse"; the quoted launcher comment updated to its new text; line pointers kept. :191 `required-but-WARNED` → `optional-but-WARNED` (same width, diagram columns aligned). |
| `claude/README.md` | 181 → 182 (+1) | :128-133 "**Codex is optional but recommended** — it is the reviewer's model-diverse second opinion … Without Codex, or if it is unreachable mid-session, … **flagged partial** …". Inbound citations into this file are all at :118 or above. |
| `install.sh` | 140 → 140 | :14 header, :128-130 comment (3 lines kept; "Neither blocks the install" kept), :137-138 echo → `⚠ Recommended (optional): Codex — …` / `different model. Without it, reviews fall back to Claude only, flagged NOT model-diverse.` Install-command line and the Claude Code "⚠ Required" line unchanged. |
| `claude/fkit-claude.sh` | 752 → 752 | :585-594 comments only: header `# --- Codex preflight: optional but recommended — a WARNING, never a wall ---…` padded to the old header's width (96 chars); body reflowed in the same lines, "fkit is Claude Code + (recommended) Codex", cites "the owner's 2026-07-11 ruling and ADR-054". |
| `CHANGELOG.md` | +3 | One bullet appended at the end of `## Unreleased` (other tasks' bullets untouched). |

Not edited: ADR-009 (byte-identical to the snapshot, which already held the architect's Step 1 edits),
ADR-054, root `README.md`, `AGENTS.md`, the rules block, agent prompts, skills, scaffold.

## Step 2 — KEEP table (every remaining verification-grep hit, with why)

| Hit | Why it stays |
|---|---|
| ADR-009 :59, :102, :175 | The record of what was decided on 2026-07-11; amended by ADR-054 (Status line + end pointer), body not rewritten. :175 is the architect's pointer note quoting the old text. |
| ADR-016 :330 | Historical citer of ADR-009; named in ADR-054's inbound list. |
| ADR-042 :10, :298 | Historical citers of ADR-009; named in ADR-054's inbound list. |
| ADR-042 :156 | "required before relying on it" — about a codex hook check; false positive. |
| ADR-054 (several lines) | The new record itself, quoting the old wording it amends. |
| ADR-008 :50 | "Degradation is mandatory and loud" — about the flag, not the dependency; superseded ADR. |
| ADR-014 :216 | "Node stops being a de facto prerequisite" — about Node; false positive. |
| ADR-025 :143 | One-time "Codex pass mandatory before task 64" gate; unrelated. |
| `architecture.md:191` | Hit is "claude REQUIRED"; the Codex side now says `optional-but-WARNED`. |
| `architecture.md:383` | "Degradation is loud and mandatory" — about the flag, which must stay. |
| `install.sh:14`, `:128` | Hit is "Claude Code (required)"; the Codex side says "optional but recommended". |
| `claude/skills/fkit-adversarial-review/SKILL.md:51`, `fkit-review/SKILL.md:66` | "Fallback/degradation (mandatory)" — the flag being mandatory is the point. |
| `sprints/backlog.md:264`, `:319`; 0220 brief :41, :76 | "mandatory Codex measurement / pass", not about the dependency; false positives. |
| `knowledge-base/reports/` (2026-07-11 omnigent-removal :45, :202; 2026-07-14 shared-instructions :378; 2026-07-17 askuserquestion :231) | Dated snapshots; named in ADR-054's inbound list. |
| 0476 brief and plan | Quote the old text on purpose. |

## Final verification grep (brief verification step 2)

Run over tracked + untracked-not-ignored files, excluding `ai-agents/wiki-vault/`,
`ai-agents/tasks/done|cancelled/`, `ai-agents/sprints/done/`, `test/fixtures/`:

```
grep -niE 'codex.{0,80}(required|not optional|hard dependency)'
```

Plus the plan's wider form (both orders, adding `prerequisite|mandatory`). Every hit is in the KEEP
table above. **No live document calls Codex required.**

## Brief verification step 3 — each file says both halves

`CLAUDE.md`, `claude/README.md`, `PROJECT.md`, `architecture.md` (:58), `install.sh` (:137-138): each
says optional but recommended **and** that the fallback is flagged / not model-diverse. Checked by
reading the diffs above.

## Step 4 — behaviour unchanged

- `diff <snapshot> claude/fkit-claude.sh`: every changed line starts with `#`. Line count 752 → 752.
- `bash -n claude/fkit-claude.sh`: OK. `sh -n install.sh`: OK.
- Smoke: `codex_preflight` extracted with `sed`, run under `env -i PATH=<empty dir>:/bin:/usr/bin`:
  exit 0, stderr carries the "Codex ('codex') is not installed / not on PATH … not model-diverse … Fix"
  warning.
- **Not run:** a live interactive "warns AND launches" (it opens `claude`; a spawned worker cannot).
  "Launches" rests on the comments-only diff plus `launcher-contract.test.js`.

## Step 5 — tests pinning wording

None pin the old text (per the plan's check). No new test (OQ-3).

## Step 6 — dogfood refresh

`claude/fkit-claude-init.sh .` ran clean. Afterwards: `AGENTS.md` identical to the snapshot;
`CLAUDE.md` differs from the snapshot only at :17-19 (the rules block came out identical). Every
`claude/agents/fkit-*.md` and `claude/skills/fkit-*/` matches its `.claude/` copy.

## Root README.md agreement (brief verification step 8)

Untouched by this task (identical to the snapshot). :32-35 "**Optional but recommended:** Codex …
loudly flagged as not model-diverse … it only warns about Codex" and :74-75 agree with the updated
documents.

## Checks run (Build step)

- `npm run test:docs`: 372 pass, 0 fail.
- `node --test test/rules-block-budget.test.js test/launcher-contract.test.js test/update-reinstall.test.js`: 62 pass, 0 fail.
- `sh -n install.sh`, `bash -n claude/fkit-claude.sh`: OK.
- `codex_preflight` smoke: exit 0 + warning.
- **Not run here:** full `npm test` — that is the separate Verify step.
- `claude/README.md` and `CHANGELOG.md`: no automated check covers them; the one link edited in each
  doc set (ADR-054) was checked by eye, and `test:docs` resolves the `ai-agents/` ones.

## Decision log (calls made without asking)

1. **`claude/README.md` paragraph reflow (finding: none; plan Step 3).** The plan rewrote :128-129 and
   said "the rest is unchanged". The new wording made :130 run to ~170 chars, so the rest of the same
   paragraph (old :130-132) was re-wrapped to ~100 chars; the text is word-for-word the same, and the
   file gains one line. Qualified as an obvious winner within the plan's intent: formatting only,
   same paragraph, no inbound line citation past :118.
2. **`install.sh:14` shortened.** The plan's text ran ~116 chars and the plan said "may need
   shortening". Used "(optional but recommended: the reviewer's 2nd opinion)". "independent" dropped
   from the header comment only; the printed echo at :137 still says "independent second opinion".
3. **`install.sh:128-130` comment.** To keep 3 lines, dropped the clause "so a new user isn't
   surprised later" (comment-only; "first-run heads-up" and "Neither blocks the install" kept).
4. **`claude/fkit-claude.sh:594` comment.** "(~70ms; it does not touch the model)" became "(~70ms; no
   model call)" to fit the reflow in the same 9 lines. Same meaning, comment-only.
5. **`CLAUDE.md` +1 line.** The ADR-054 link line also carries the following "fkit formerly shipped …
   that runtime" clause (a long line) so the change adds exactly one line, as the plan allowed.

No review fixes were applied in this step (no review yet).

**Process-review, round 1 (spawned `fkit-coder` under `fkit-sprint-ship-loop`, 2026-10-05) — fixes applied without asking:**

6. **R1 (`review.md` § Reviewer findings, "ADR-054 names the wrong flag for the reviewer's own path").**
   *What changed:* ADR-054 Context bullet "What ships today" now names each role's label —
   `fkit-adversarial-review` → `[claude-fallback — NOT model-diverse]`; `fkit-review` → no second opinion,
   `[NOT model-diverse — INCOMPLETE]` banner above its findings, verdict forced to
   `🟡 Partial review — Codex unavailable`; the ADR-042 D1 quote kept word for word with a one-line gloss.
   ADR-054 Decision 1 names both labels and the forced verdict. ADR-009's end note restates the ruling
   without a label and adds an "As shipped" sentence naming both (3 → 4 lines, at the end of the file).
   *Why it qualified:* verified-`CORRECT` against `claude/skills/fkit-review/SKILL.md` (Coverage states,
   "this procedure never fires it"; banner template) and `fkit-adversarial-review/SKILL.md` (fallback
   banner); docs-only, three localized passages; inside the plan's intent (documents match shipped
   behaviour, flag not softened). Wording from `@fkit-architect` (hop 2), since both files are
   architect-written. *Checks:* ADR-009 lines 22, 60, 131 byte-identical to HEAD; Status line still one
   line; ADR-054 Status `accepted`; no inbound line citations into ADR-054 or ADR-009's tail.
7. **R1 widened by one sentence — obvious winner within intent.** The architect found, and I verified,
   a second error in the same passages: `fkit-review` "continue[s] with your own pass only" (Graceful
   degradation paragraph; banner template "There was no second opinion to weigh"), so "the reviewer's
   second opinion falls back to a Claude-only pass" was also wrong for `fkit-review`. Fixed in the same
   three passages only. *Why it qualified:* same nature as R1 (a fact about shipped behaviour), same
   lines, nothing softened. The summary-level "falls back to Claude only" in `CLAUDE.md`, `PROJECT.md`,
   `architecture.md` (owner's own ruling wording, no label named) left as is.
8. **Small wording tweak to the architect's text:** "leads its report with the banner" →
   "puts the banner above its findings" — the template puts the 🟡 verdict line first and the banner
   under it, both above the findings.

## Follow-ups (not in scope; not done here)

- **ADR-042 D1 conflates the two labels** (the "Codex unavailable" bullet calls it "the existing loud
  `[claude-fallback — NOT model-diverse]` case"; the reviewer's report actually uses
  `[NOT model-diverse — INCOMPLETE]`). Same mix-up as R1; out of scope here (architect-owned ADR).
- **`claude/skills/fkit-stateful-review/SKILL.md` Step 1** says "flag partial coverage loudly" but shows
  no `[NOT model-diverse — INCOMPLETE]` banner of its own (architect flag, R1 consult). Worth checking
  next to the ADR-042 follow-up.
- **ADR-054's title/filename** says "the Claude-only second opinion"; strictly, `fkit-review` has no
  second opinion without Codex. Filename is linked from several docs; left as is.
- **ADR-009 stray last line.** ADR-009 ends with a stray `</content>` line that is already in HEAD —
  not from this task. Left as is; worth a one-line cleanup task (architect-owned file).
- **`fkit-wiki` sync after close** (this task never writes the vault): ingest ADR-054 and update
  `wiki/decisions/adr-009-…`, `wiki/systems/review-and-model-diversity.md`,
  `wiki/systems/install-and-self-update.md`, `wiki/decisions/adr-016-…`, `wiki/decisions/adr-042-…`,
  `wiki/tasks/make-codex-a-checked-prerequisite.md`, `wiki/tasks/rewrite-docs-post-omnigent.md`,
  `wiki/tasks/sprint-2-remove-omnigent.md`, `wiki/tasks/give-codex-the-universal-hard-rules.md`,
  `wiki/tasks/verify-the-codex-half-of-the-comment-stripping-canary.md`, `index.md`.

## Verify

Verify step, run by a spawned `fkit-coder` under `fkit-sprint-ship-loop` on Sprint 10, 2026-10-05.
Verify only: nothing written except this section. **Result: pass.**

- **Plan blob** `b06693062964a27fbafe0e5a8d4b7d15b1c88b48` re-checked with `git hash-object`.
- **Hashes, start = end (9/9 unchanged):** `CLAUDE.md`, `PROJECT.md`, `architecture.md`,
  `claude/README.md`, `install.sh`, `claude/fkit-claude.sh`, `CHANGELOG.md`, ADR-009, ADR-054.
- **Full `npm test`** in a fresh `cp -R` copy (with `.git`) under the session scratchpad: exit 0.
  Unit: 1048 tests, 24 suites, 1048 pass, 0 fail, 0 skipped. Prove-red: 43/43 mutations red; final line
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
  Wall 1533 s (~25.5 min); load 4.09 at start, 4.61 (1-min 3.59) at end.
- **`claude/fkit-claude.sh`:** HEAD :539-551 equals the Build snapshot :585-597, so other tasks did not
  touch this region. 0476's diff is :585-590 and :592-594, every changed line starts with `#`. 752 → 752
  lines. Header is 96 characters, same as before. `bash -n` OK. Own smoke: `codex_preflight` run with
  `codex` off `PATH`: warning on stderr, exit 0.
- **`install.sh`:** 140 → 140 lines (HEAD has 132; the +8 belong to other tasks). `sh -n` OK. The echo still
  prints `npm install -g @openai/codex   &&   codex login`. Changes are at :14, :128-130 and :137-138 only.
  `install.sh:19` (cited by `RELEASING.md`) is still `REF="${FKIT_REF:-main}"`.
- **Brief verification grep** (narrow form, tracked + untracked, frozen paths excluded): every hit is in
  ADR-009 :59/:102/:175, ADR-016 :330, ADR-042 :10/:298, ADR-054, the four dated reports, or the 0476
  folder (brief, plan, worklog). All are KEEP-listed. No live document calls Codex required.
- **Wider grep** (both orders, with `prerequisite|mandatory`): also all historical or false positives.
  **Minor gap:** five of these hits are not named one by one in the KEEP table above:
  `reports/2026-07-14-shared-instructions-layer.md:137` (named in plan Step 1 and ADR-054),
  `reports/2026-07-18-design-spawned-invocation-…:16`, `reports/2026-07-26-decide-task-folder-name-…:219`,
  `reports/2026-08-14-backlog-triage-part-3.md:23` (the plan's "report triage line") and
  `reports/2026-09-18-…:2032`. All are dated reports, so they are covered by the plan's "reports are dated
  snapshots; keep" rule. Not a defect.
- **Both halves stay:** `CLAUDE.md` :17-19, `PROJECT.md` :90-92, `architecture.md` :58, `claude/README.md`
  :128-133 and `install.sh` :137-138 each say optional/recommended **and** flagged / not model-diverse.
  `architecture.md:191` is the same width, so the diagram stays aligned.
- **ADR-054:** exists, `Status: accepted`, and every relative link resolves. It settles "no longer a mode
  fkit offers" (:24, :41). Inbound ADR-054 links from `CLAUDE.md`, `PROJECT.md` and `architecture.md`
  resolve.
- **ADR-009:** lines 22, 60 and 131 are byte-identical to HEAD. The diff is only a one-line Status swap
  (:3, still one line) plus a note appended at the end.
- **Rules block:** identical to HEAD (now :52-104, because the block moved down one line).
- **`.claude/` copies:** every `claude/agents/fkit-*.md` and `claude/skills/fkit-*/` matches its copy.
- **Root `README.md`:** :32-35 and :74-75 agree with the edited documents.
- **Note (not 0476's):** `sprints/backlog.md:373` cites `CLAUDE.md:58`, a line that was already stale
  before this change. 0476's +1 line in `CLAUDE.md` was allowed by the plan.
- **Not run:** a live interactive `fkit` launch. It opens `claude`, which a spawned worker cannot do.
  "Launches" rests on the comment-only diff, the `codex_preflight` smoke, and `launcher-contract`
  (part of the 1048).
