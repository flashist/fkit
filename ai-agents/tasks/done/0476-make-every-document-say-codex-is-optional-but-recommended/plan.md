# Plan — 0476: make every document say Codex is optional but recommended

**Summary**
- Docs-and-comments only. No behaviour change: `codex_preflight` already warns and continues; both review skills already ship the loudly flagged Claude-only fallback. Nothing found that actually blocks on Codex, so no NEEDS-DECISION on behaviour.
- **The record changes a recorded decision (ADR-009 Decision 2), so the owner must rule on it here.** Architect consult done (read-only, hop 2): recommends a **new small ADR-054** plus a pointer appended to the end of ADR-009, not a note alone.
- **Found beyond the brief (architect, verified by me):** ADR-009's "fallback is no longer a mode fkit offers" was already partly overruled on 2026-07-11. Task 0060's owner ruling (`ai-agents/tasks/done/0060-make-codex-a-checked-prerequisite/brief.md`, the "The reviewer does _not_ hard-fail when Codex is unreachable" ruling) kept the flagged partial instead of a hard fail, but only "as a last-resort safety net for a Codex outage mid-session, **not** a supported way to run fkit without Codex installed". The 2026-10-02 ruling moves that line: no Codex installed at all becomes a supported, flagged setup. ADR-054 says both things.
- 7 live files change (list in step 3). Root `README.md` already agrees (0478's working-tree text). The rules block, the scaffold, the agent prompts, the skills and the launcher's printed messages need no change.
- Checks: full `npm test` (the launcher and `install.sh` are in the "run everything" row). One added line in `CHANGELOG.md` (CONTRIBUTING rule: a change users would notice gets a line in the same change).
- The brief's "do not start without the owner's specific word": approving this plan is that word. Please ask for it in those terms.

## Step 0 — Pre-edit snapshot (no repo writes)
The working tree already holds uncommitted edits from 0478/0479/0480/0481/0482/0395 in `install.sh`, `claude/fkit-claude.sh`, `architecture.md` and `CHANGELOG.md`. Copy those four files plus `CLAUDE.md`, `PROJECT.md`, `claude/README.md` and ADR-009 to the scratchpad first. From then on, "0476's own diff" means `diff <snapshot> <file>`, not `git diff`, so other tasks' changes are not counted as ours. Reformat nothing outside the lines named below.

## Step 1 — Record the decision FIRST (ADR-054, architect)
**Who writes it.** `/fkit-record-decision` is architect-only (ADR-018 hook). Recommended route: right after approval, the **driver spawns `@fkit-architect` (hop 1)** to record ADR-054 from the approved text below, **before** spawning the Build worker. Fallback: the Build worker consults the architect at hop 2. Either way, no other document is edited until the ADR file exists. The other docs link to it, and `reference-integrity` resolves links under `ai-agents/`.

**Number.** 054. The highest today is ADR-053 (untracked, `proposed`); "ADR-054" appears nowhere. Re-check right before writing, since other work may take it (`adr-number-uniqueness` test).

**ADR-054 core content** (architect's draft, condensed). Title idea: *"Codex is optional but recommended; the Claude-only second opinion is a supported, loudly flagged mode."*
1. Codex is optional but recommended. When it is missing or not logged in, the reviewer's second opinion falls back to a Claude-only pass. That pass is loudly flagged `[claude-fallback — NOT model-diverse]` and is not a complete, model-diverse review.
2. The aim does not change: the second opinion is meant to come from a different model family. The fallback is weaker, is labelled weaker, and is never equal to a Codex review. The flag is not softened.
3. The launcher (`codex_preflight`) warns and never blocks. That has been the behaviour since the owner's 2026-07-11 ruling, and nothing here changes it.
4. Amends ADR-009 at four places: Decision 2 (lines 59-63), the rejected option "Make Codex optional" (87-89), the Consequence "Codex becomes a required install prerequisite" (102), and the matching Residual-risk trigger (111-113). The rest of ADR-009 stays in force, **including Decision 2's `codex exec --sandbox read-only` clause**, which belongs to ADR-042 / task 0273.
5. Settles the drift inside ADR-009. "No longer a mode fkit offers" has been false since the 0060 ruling of 2026-07-11. The fallback has shipped in `fkit-review` and `fkit-adversarial-review` ever since, and ADR-042's "Codex unavailable" coverage state is built on it. ADR-054 makes that mode supported and extends it to running with no Codex installed at all.
6. ADR-009 said to reopen point 2 "only with evidence from actual users". This reopening is by owner ruling (2026-10-02), with no user evidence offered. The trigger was meant to stop agents re-arguing the point, not to bind the owner, the decider. The ground is that the documents had drifted from behaviour the owner had already ruled on.
7. Effect: every document says "optional but recommended" and keeps both "model-diverse" and "flagged / not a complete review". The installer stops saying "Required" and still says what you lose and how to install Codex.
8. Re-raise only if (a) a flagged fallback review is shown to have been taken for a complete review (the flag failed), or (b) the owner decides fkit should require model diversity again. [See OQ-2.]
9. Related: names, as citers left untouched as history, ADR-016 (:73, :330), ADR-042 (:10, :298), and the reports `2026-07-11-plan-omnigent-removal.md:45,202` (the plan to drop the fallback, which never shipped), `2026-07-14-shared-instructions-layer.md:137,378` and `2026-07-17-askuserquestion-availability-for-agents.md:231`. Lists ADR-008:51 (already superseded) and ADR-025:143 (a one-time "Codex pass mandatory before task 64" gate, unrelated) as checked and not affected.

**ADR-009 edits.** The body is untouched.
- (a) Append a dated pointer note **at the end of the file**, after the 0393 correction note: "Decision 2 amended by ADR-054 (2026-10-0X); see there." Appending moves no line. Other files cite ADR-009 lines 22, 60 (the sandbox-flag statement) and 131, and the 0393 note forbids inserting above them.
- (b) **[OQ-1]** Optionally, swap the one-line Status for: `- **Status:** accepted — **Decision 2 amended by [ADR-054](adr-054-….md) (2026-10-0X)**`. **It must stay ONE physical line**, so it moves nothing. It adds no header bullet, so 0393's recorded "no header bullet" departure stays true, and so does "Status stays accepted". Precedent: ADR-012/013/015/016 mark amendments in the Status line. It does go beyond the brief's check step 1 ("git diff shows only an appended note"), hence OQ-1.
- ADR-016, ADR-042 and the reports: no edit. One routing point (the ADR-009 pointer) plus ADR-054's inbound list is enough.

## Step 2 — Inventory: every hit, with a verdict
Grep: tracked tree, Codex within 80 characters of required / not optional / hard dependency / prerequisite / mandatory, in both orders. Skipped: `tasks/done|cancelled`, `sprints/done`, `wiki-vault/`, `test/fixtures`.

**CHANGE (7 live files):**
| Hit | Verdict |
|---|---|
| `CLAUDE.md:17` "Codex is **required**, not optional" (Project Overview, **outside** the rules block, whose markers are at :51-103) | change |
| `ai-agents/knowledge-base/PROJECT.md:90` "**Codex is required**, not optional" | change |
| `ai-agents/knowledge-base/architecture.md:58` component cell "**Required, but warned — never walled**", plus its quote of the launcher comment | change |
| `architecture.md:191` diagram "codex required-but-WARNED" | change |
| `claude/README.md:128` "**Codex is required, not optional.**", plus :129 "If Codex is unreachable mid-session" (only the outage framing) | change |
| `install.sh:14` header "Codex (for the reviewer's …)", `:128-130` prerequisites comment, `:137-138` printed "⚠ Required: Codex" | change |
| `claude/fkit-claude.sh:585` "Codex preflight: required, but a WARNING, not a wall", plus :586 "fkit is Claude Code + Codex" | change (comments only) |

**KEEP (with reason; goes into the worklog):**
- ADR-009 body (:59, :102, …): the record of what was decided; amended by ADR-054, not rewritten.
- ADR-016:330, ADR-042:10/:298: historical citers (see Step 1).
- ADR-008:50 ("Degradation is mandatory and loud"): about the flag, not the dependency; superseded ADR.
- ADR-014:216 ("Node stops being a de facto prerequisite"): about Node; false positive.
- ADR-025:143, the 0220 brief :41/:76, `sprints/backlog.md:264/:319`, the report triage line: "mandatory Codex pass / measurement", not about the dependency; false positives.
- ADR-042:156 ("required before relying on it"): unrelated; false positive.
- `architecture.md:383` "Degradation is loud and mandatory": about the flag, which must stay; keep.
- `claude/skills/fkit-adversarial-review/SKILL.md:51`, `fkit-review/SKILL.md:66` "Fallback/degradation (mandatory)": the flag being mandatory is the point; keep. Their "partial safety net" wording does not say "required"; keep.
- Reports under `knowledge-base/reports/` and `knowledge-base/history/`: dated snapshots; keep.
- The 0476 brief itself (quotes the old text); keep.

**Confirmed clean (no change):**
- Agent prompts `fkit-reviewer.md` (:91-92 Codex unavailable → flagged), `fkit-adversarial-reviewer.md` (:6-7 "degrades to a Claude pass with a loud flag"), `fkit-lead.md` (:74-75).
- The launcher's help/menu (`fkit-claude.sh:229, :709`) and init's role list (`fkit-claude-init.sh:1019`): "own pass + Codex second opinion", no "required".
- The printed preflight warnings (`:597-603`, "Reviews will run WITHOUT an independent second opinion — not model-diverse"): accurate; unchanged.
- The scaffold (`claude/scaffold/**`): no "required" wording.
- Root `AGENTS.md` (:24 "loudly-flagged partial"): fine.
- The rules block: untouched, so the `RULES_MAX` check is not at risk.
- The structure manifest hashes only `claude/scaffold/`, not the root `CLAUDE.md`: no regeneration needed.
- `PROJECT.md` and `architecture.md` are already dual-home-parity exceptions.

**Root README.md (not touched, parallel work):** :32-35 already say "**Optional but recommended:** Codex … without it, reviews run on Claude only and are **loudly flagged as not model-diverse** … it only warns about Codex". :74-75 agree. Re-read at the end; note the agreement in the worklog.

## Step 3 — Rewording (the ruling's meaning; keep "model-diverse" and "flagged / not a complete review" everywhere)
**Hard constraint: line-count-preserving, one-for-one replacements** wherever other files cite line numbers. That covers `fkit-claude.sh:585-594` (architecture.md cites :585-606 and :578-606), `install.sh` :14, :128-130 and :137-138 (RELEASING.md and architecture.md cite `install.sh:19`), and `architecture.md:58` and `:191`.

- **CLAUDE.md :17-18:** "Codex is **optional but recommended** — it is what makes the reviewer's second opinion genuinely model-diverse; without it that opinion falls back to Claude-only, loudly flagged as not model-diverse ([ADR-054](ai-agents/knowledge-base/decisions/adr-054-….md)). fkit formerly shipped…" May add one line; no line citations into CLAUDE.md:1x exist (checked).
- **PROJECT.md :90-91:** the same sentence, link `decisions/adr-054-….md`, "(amending ADR-009 §2)".
- **architecture.md :58** (one line): "**Optional but recommended — warned, never walled** (owner rulings 2026-07-11, Sprint 2 task 3, and 2026-10-02, [ADR-054](decisions/adr-054-….md)): a Codex outage must not lock the owner out of their own team; without Codex the second opinion falls back to Claude-only, loudly flagged NOT model-diverse." Update the quoted launcher comment to its new text. Keep the line pointers as they are.
- **architecture.md :191:** `codex required-but-WARNED` → `codex optional-but-WARNED`. Same 19 characters, so the diagram's columns stay aligned.
- **claude/README.md :128-129:** "**Codex is optional but recommended** — it is the reviewer's model-diverse second opinion. `fkit` preflights it at launch (installed? logged in?) and warns loudly — but does not wall you out. Without Codex, or if it is unreachable mid-session, the review still runs and is emitted as a **flagged partial**: …" The rest is unchanged.
- **install.sh:14:** "# fkit runs on Claude Code (required) + Codex (optional but recommended: the reviewer's independent second opinion)." One line, so it may need shortening.
- **install.sh :128-130 comment:** "Claude Code is the runtime (required); Codex is optional but recommended — it is what makes the reviewer's second opinion an actually-independent one…" Still 3 lines; "Neither blocks the install" kept.
- **install.sh :137-138 echo:** `⚠ Recommended (optional): Codex — it gives the reviewer an independent second opinion from a` / `  different model. Without it, reviews fall back to Claude only, flagged NOT model-diverse.` The `npm install -g @openai/codex && codex login` line is unchanged. The Claude Code line stays "⚠ Required".
- **fkit-claude.sh :585:** `# --- Codex preflight: optional but recommended — a WARNING, never a wall ---…`, padded to the same width as today's rule line. **:586-594:** reflow within the same 9 lines: "fkit is Claude Code + (recommended) Codex…"; cite "owner's 2026-07-11 ruling and ADR-054". **No non-comment line changes.**
- **CHANGELOG.md:** one bullet appended under `## Unreleased` (that section has other tasks' uncommitted bullets; append only, reformat nothing): "The installer and docs now say Codex is optional but recommended (it used to print 'Required'). Without it, the reviewer's second opinion runs on Claude only and is loudly flagged as not model-diverse. Nothing about how fkit runs changes." This is a CONTRIBUTING rule, not a judgment call. Flagged because the brief does not list it.

## Step 4 — Behaviour stays as is
`codex_preflight`, the two review skills and their fallback are not touched. Proof:
- `diff` of the snapshot against `fkit-claude.sh` shows only lines that start with `#`.
- `bash -n claude/fkit-claude.sh` passes.
- Smoke: extract `codex_preflight` with `sed`, run it with a `PATH` that has no `codex`, and confirm exit 0 plus the warning on stderr.
- **Limit, stated honestly:** a full interactive "warns AND launches" cannot be run from a spawned worker, because it opens `claude`. "Launches" is shown by comments-only-diff plus the existing launcher-contract suite (which stubs codex), not by a live launch.

## Step 5 — Tests that pin wording
None assert the old text. Checked: `test/*.js|mjs|sh` have no "Required: Codex", no "required, not optional" and no preflight-comment pins. `update-reinstall.test.js` runs the real `install.sh` but checks only exit codes and recorded values, not the echo text. Fixtures `closed-rank-0174-*` mention "required second model": frozen, untouched. An optional new pin is OQ-3.

## Step 6 — Refresh the dogfood copies
Run `claude/fkit-claude-init.sh .`. No `claude/agents` or `claude/skills` file changes in this task, so the `.claude/` refresh is near no-op; it also picks up other tasks' uncommitted `claude/` edits (gitignored copies, harmless). Afterwards, check that the diff of `CLAUDE.md` and `AGENTS.md` against the snapshot is limited to `CLAUDE.md` :17-18 (init rewrites the rules block on every run, and it should come out identical).

## Checks (CONTRIBUTING "What to run for a change")
- **Run: full `npm test` (~12 min).** Heaviest row touched: `claude/fkit-claude.sh` is a non-`.md` file under `claude/`, and `install.sh` is named in `test/prove-red.sh`. That also covers `test:docs` (ADR-054, ADR-009, PROJECT.md, architecture.md: links, ADR-number uniqueness, citations) and `test:unit` (`rules-block-budget` reads `CLAUDE.md`). Report the pass count.
- Root docs (`claude/README.md`, `CHANGELOG.md`): no automated check covers these files; check the edited links by eye.
- If a test fails, compare against the Step 0 snapshot to tell whether the failure is ours or from the other uncommitted tasks in the tree, and report which.
- Verification grep (brief step 2) re-run at the end. Every remaining hit is listed in `worklog.md` with why it stays (the KEEP table above).
- Not run: a live interactive launch (see Step 4).

## Edge cases / risks
- ADR-054 number claimed by parallel work (ADR-053 is uncommitted): re-check right before writing.
- Line drift: a two-line rewrite of the `fkit-claude.sh` header or the `install.sh` echo would silently break `architecture.md` and RELEASING line pointers. Hence the one-for-one rule, checked by `wc -l` before and after on those files.
- `architecture.md:58` quotes the launcher comment: the two must change together.
- The `—` in `fkit-claude.sh:585` is multibyte; pad by visual width to match the neighbouring rule lines.
- Do not soften: every reworded spot keeps "model-diverse" and "flagged / not complete".
- A shell-quoting slip in `install.sh` echo lines: `sh -n install.sh` plus the `update-reinstall` test, which runs the real installer.

## Follow-ups (not in scope)
- `fkit-wiki` sync after close, to ingest ADR-054 and update these pages, which carry the old wording: `wiki/decisions/adr-009-…`, `wiki/systems/review-and-model-diversity.md`, `wiki/systems/install-and-self-update.md`, `wiki/decisions/adr-016-…`, `wiki/decisions/adr-042-…`, `wiki/tasks/make-codex-a-checked-prerequisite.md`, `wiki/tasks/rewrite-docs-post-omnigent.md`, `wiki/tasks/sprint-2-remove-omnigent.md`, `wiki/tasks/give-codex-the-universal-hard-rules.md`, `wiki/tasks/verify-the-codex-half-of-the-comment-stripping-canary.md`, `index.md`.
