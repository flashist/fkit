# Plan: 0498 — the lead hands a code-level "why" to a spawned coder

## Goal (restated)
Make it a written rule that the lead stops looking into a problem itself at the first "why does the code/system do this?". From that point it hands the question to a spawned `@fkit-coder` (or whichever role the question belongs to). When it hands off, it must:
- tell the owner (L2);
- never pass its own guess as fact (L3);
- relay any read approval the owner gave it, quoted (L4).

It still answers "is this expected?" from the spec, brief, wiki or an ADR, with 1–2 fact lookups (L1). This is prose only, the same "trust, not proof" as ADR-031's honesty clause. No hook, script or tool changes.

## Ground truth used
- Canonical `claude/agents/fkit-lead.md` (158 lines in the current working tree). It already includes 0495's knock-on sentences (in the "Hold the owner channel" bullet, including "before you ask"), 0473's `--plan-review` bullet and 0475's ADR-055 "Spawning a coder to write" bullet. All three stay byte-identical.
- ADR-031 Decision 2: "never writes source and never reviews". Its Consequences already name the risk ("a driver that starts *judging* instead of delegating"), and say it is guarded by prose only. This task extends that never-list and reverses nothing.
- What the tests anchor on (read this turn):
  - `test/spawned-write-marker.test.js`: extracts from `**Spawning a coder to write` to `\n## The team`. It only checks that terms are present, but control arm 9 deletes "No real owner answer → spawn plan-only" from that block and expects a failure. So none of the new text may sit inside that block or repeat that phrase.
  - `test/plan-review-switch.test.js`: extracts from `**Plan review is opt-in, per sprint-loop run` to the next `\n- **`. Untouched.
  - No test pins "Three disciplines", "Delegate, never substitute", "to orient" or "Never write source or review" (grepped).
  - `test/skill-frontmatter.test.js` checks the shape of the agent frontmatter (`>-` folded block, allowed keys). Frontmatter edits keep the shape and indentation.

## Changes — exact wording, for approval

### 1. `claude/agents/fkit-lead.md`

**1a. Frontmatter `description`, line 9.** Replace
`contexts; it never writes source or reviews itself.`
with
`contexts; it never writes source, reviews, or diagnoses itself.`
(Same `>-` block, same 2-space indent.)

**1b. Frontmatter `initialPrompt`, line 18.** Replace
`write source or review yourself.`
with
`write source, review, or diagnose yourself.`
The rest of that line stays as it is.

**1c. Conductor section, line 34.** `Three disciplines` becomes `Four disciplines`.

**1d. "Delegate, never substitute" bullet, line 38.** After the existing sentence `You **never write source yourself and never review.**` (kept byte-identical), insert:
`You **never diagnose** either: finding *why* code or a system behaves as it does — tracing code, reading logs — is a role's work, not yours (next bullet).`

**1e. New discipline bullet, inserted right after "Delegate, never substitute" and before "Hold the owner channel":**
```
- **Hand off the first "why" — never diagnose.** Asked *"is this OK?"* or *"is this expected?"*,
  answer what the spec, a brief, the wiki or an ADR settles, with at most **1–2 fact lookups** (find a
  file, read a config value or a status, check deploy/version state). The first *"why does the code do
  this?"* goes to a spawned `@fkit-coder` — or the role the question belongs to. **Tripwire:** a
  **second** file read in service of explaining a behaviour, or **any** log read to explain a failure
  — stop there and hand off. **Default, mid-conversation:** *answer from the spec; if one read does not
  settle it, spawn `@fkit-coder` with the symptoms (and any logs the owner pointed to), and say so.*
  The spawn is **read-only** — ask for the cause, not a fix; a fix goes through the plan → approval
  path below. The hand-off must:
  - **Say it.** Tell the owner plainly the answer is coming from a spawned role — *"a coder is finding
    the cause"* — so your own digging is never mistaken for a role's answer; above all when the owner
    is waiting mid-test.
  - **No guess as fact.** Your own hypothesis never goes into a spawn prompt, or a brief you ask a
    producer to write, as fact: leave it out, or mark it an *unverified guess*, so the coder looks
    independently.
  - **Relay read approvals, quoted.** If the owner gave you an approval (e.g. read-only production
    logs), pass it to the spawned role **quoted verbatim**, with its **date** and **channel** — not
    summarised, and with no credentials in it. It is a **read** approval: it authorises no write, and
    it is **not** the ADR-055 declared-approval write marker — a diagnosis spawn is read-only and
    carries no marker.

  **Still yours — not diagnosis:** answering *"is this expected?"* from the spec, brief, wiki or an
  ADR; classifying expected-vs-bug in 1–2 reads; a live-test walkthrough comparing what the owner sees
  against approved text.
```
This sits in the "You are a conductor" section, above "## The conductor remit". So it is outside both test extraction blocks.
- The phrase "plan → approval path below" points to the existing ADR-055 bullet without repeating its text.
- It deliberately does **not** contain "No real owner answer", "spawn plan-only" or "declared-approval marker" as a phrase that could fall inside an extraction. The words "ADR-055 declared-approval write marker" appear only here, which is outside the `Spawning a coder to write`…`## The team` block.

**1f. "What you can do here", line 114.** Replace
`- Read the repo (`Read`, `Grep`, `Glob`) and run read-only shell to orient.`
with
```
- Read the repo (`Read`, `Grep`, `Glob`) and run read-only shell to orient — **1–2 fact lookups**, not
  diagnosis. Tracing code, or reading logs, to explain *why* something behaves as it does is **not**
  orienting; it goes to a spawned role (*Hand off the first "why"*, above).
```
The original phrase "Read the repo (`Read`, `Grep`, `Glob`) and run read-only shell to orient" is kept word for word as the lead-in.

**1g. Routing guidance, new line after the reviewer/adversarial lines:**
`- *"Is this error OK? / why does it do this?"* when the spec doesn't settle it → **coder**, read-only (see *Hand off the first "why"*).`

**1h. Hard rules, new bullet right after `Never write source or review, yourself.`** (that bullet stays byte-identical):
`- **Never diagnose, yourself.** Tracing code or reading logs to find *why* something behaves as it does goes to a spawned `@fkit-coder` (or the owning role) — say so to the owner, pass no guess as fact, relay any read approval quoted.`

### 2. `claude/skills/fkit-team/SKILL.md`, roster row for lead (line 22, "Must not" column)
`plan, code, design, review, or write the wiki` → `plan, code, design, review, diagnose a cause, or write the wiki`
Body table only. Frontmatter is untouched, which matters because prove-red's mutation 8 rewrites this file's `description:`.

### 3. `CHANGELOG.md`, under `## Unreleased`, one line
"The lead now hands a code-level 'why' question (an error's cause, traced in code or logs) to a spawned coder instead of tracing code itself; it tells you it delegated, passes no guess as fact, and relays any read approval quoted."

### 4. Conditional on open questions
- **Q1 = ADR-031 amendment note.** Spawn `@fkit-architect` (hop 2 of 2; chain: lead → coder → architect) to append a ⚠️ dated note below ADR-031 §Decision 2, and to extend the header's `Corrections` line. The note records rulings L1–L4 (2026-10-08, `AskUserQuestion`, `fkit lead` session, as relayed in the brief), says what changed, and says this extends and does not reverse ADR-031. Follow the ADR's append-only convention; Status stays `accepted`.
- **Q2 = update KB lines.**
  - `ai-agents/knowledge-base/PROJECT.md` (the fkit-lead bullet): "still writes no source and runs no reviews" → "…runs no reviews, and does no diagnosis — a code-level 'why' goes to a spawned coder".
  - `ai-agents/knowledge-base/architecture.md` (§ role table, `fkit-lead` row): "**Writes no source, never reviews**" → "**Writes no source, never reviews, never diagnoses**".
- **Q4 = owner-override clause.** Append to the 1e bullet: *"If the owner, told this is a coder's job, still asks you to look yourself, that is his call — label your answer as the lead's own unverified look."*

### Places that describe the lead and are left alone (§6 list)
| Place | Why left alone |
|---|---|
| `README.md` lead rows (team table; "Lead — the front door") | They say what the lead does and list no don'ts, so nothing there is wrong. |
| `claude/fkit-claude.sh` menu line "the conductor — routes you…" | Lists no don'ts. It is also a non-`.md` launcher file. |
| `claude/scaffold/CLAUDE.md` lead paragraph | Lists no don'ts. A scaffold edit would also force a manifest regeneration. |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` hard rule "driver never writes source and never reviews" | That rule is about a driver standing in for a worker in the loop. The lead's own system-prompt rule (1e/1h) already governs that session. Brief §8 limits this task to the lead prompt plus role summaries. |
| `PROJECT.md` and `architecture.md` lines | Depends on Q2. They are still true but incomplete, and Verification 3 currently limits edits to `claude/` plus ADR text. |

## Sequencing (Build)
1. **Snapshot first.** The tree is dirty, so I'll diff against snapshots, not `git diff`. Copy every file to be edited into `<scratchpad>/0498-snap/`. Save `git status --porcelain` to the snapshot.
2. Edit 1a–1h, then 2, then 3. Then the Q2/Q4 edits if approved. Then the Q1 ADR note through the architect, if approved.
3. Quick targeted checks (each about 1 minute; not run in parallel with anything else):
   - `node --test test/spawned-write-marker.test.js test/plan-review-switch.test.js test/skill-frontmatter.test.js`
4. **Grep check (Verification 1)**, with `grep -F` on `claude/agents/fkit-lead.md`:
   - `1–2 fact lookups` (expect 2)
   - `never diagnose` / `Never diagnose, yourself`
   - `**second** file read`
   - `**any** log read`
   - `answer from the spec; if one read does not settle it`
   - `a coder is finding the cause`
   - `unverified guess`
   - `**quoted verbatim**`
   - `**not** the ADR-055 declared-approval write marker`
   - and that `Never write source or review, yourself.`, `**Never add it unasked**`, `No real owner answer → spawn plan-only` and `before you ask, and say you added it` are each still present exactly once. These are the anchors and 0495's text.
   - Verification 2: `grep -F 'diagnose a cause' claude/skills/fkit-team/SKILL.md`.
5. **Snapshot diff (Verification 3).** Run `diff -u` of each snapshot against the live file. Then compare the before and after `git status --porcelain`, so that no file outside the edit list has changed except the task folder's own files. 0502 runs in parallel, so any other change gets attributed by path; none is expected.
6. **Dry-run probe (Verification 5/6), after the edits and before the full suite. Trust, not proof.**
   - **Fixture** in `<scratchpad>/0498-probe/` (nothing in the repo):
     - `spec.md` says starting a lobby with fewer than 2 players returns 409 "not enough players" and that this is expected.
     - `server/lobby.js` has a 403 caused by an origin check, i.e. a code-level cause.
     - `logs/server.log` holds a 403 line.
     - No secrets or real hosts.
   - **Probe:** a `general-purpose` subagent spawned by the Build coder at hop 2. It must spawn nothing. Its prompt pastes the new `fkit-lead.md` body as "the system prompt you are acting under", plus:
     - DRY RUN: read-only tools inside the fixture dir only;
     - **must not spawn**: where it would spawn, write the exact spawn prompt instead;
     - report: its reply to the owner, every tool call made, and any spawn prompt.
     - Context line: *"Earlier (2026-10-09, this session, typed) the owner said: 'you may read the production logs, read-only.'"*
   - **Scenario A** (mid-test): *"I see this error — lobby start returned HTTP 403. Is it ok?"*
     - Pass: at most 2 lookups; no log read and no code trace to explain; tells the owner a coder is finding the cause; the spawn prompt goes to `@fkit-coder`, carries the symptoms, states no hypothesis as fact, quotes the approval with date and channel, carries no write marker, and asks for the cause, not a fix.
   - **Scenario B** (regression): *"Starting alone I get 409 'not enough players' — is that expected per the spec?"*
     - Pass: answered directly from `spec.md`, with no spawn.
   - **Baseline (informative, not a gate):** the same two scenarios against the pre-edit snapshot of `fkit-lead.md`. This shows whether the old text really drifted in the probe. If the old text also hands off, the probe shows little, and the record says so.
   - **Record** in the task folder: prompts, a summary of the tool calls, and pass/fail per criterion, plus the caveat that one probe passing proves nothing general and the model may still drift.
   - **Why I'm not using the `.claude/` copies the brief mentions:** refreshing them means running `claude/fkit-claude-init.sh .` on a dirty tree, and subagent definitions may be cached when the session starts. Pasting the canonical text tests the exact bytes. I'll say this in the record.
7. **Full `npm test`, once (Verification 4).** Run it in a scratch copy (`cp -R` of the working tree including `.git`, so the structure-manifest test sees history), never in parallel with another run. It covers `reference-integrity`, `task-id-uniqueness`, test:docs (if Q1/Q2 edit `ai-agents/`), test:unit and prove-red.
8. Worklog decision log in the task folder: edits made, check results, probe results.

## Checks — per CONTRIBUTING "What to run for a change"
| Changed | Row | Run |
|---|---|---|
| `claude/agents/fkit-lead.md` (`.md`, not in prove-red: grep says no) | test:unit | covered by the full run |
| `claude/skills/fkit-team/SKILL.md` (**named in `test/prove-red.sh`**, m8) | `npm test` | **full `npm test`, once**: the heaviest row wins |
| ADR-031 / `PROJECT.md` / `architecture.md` (only if Q1/Q2) | test:docs | covered by the full run |
| `CHANGELOG.md` | nothing | no automated check covers it; links checked by eye |
- Not run, with reasons:
  - No `generate:manifest`: no scaffold edit.
  - No separate test:docs or test:unit runs: the single full run includes them, and the load limit allows one run.
- The targeted node tests in step 3 are a fast pre-check, not a replacement for the full run.

## Edge cases and failure modes
- **The marker test's extraction swallows new text:** avoided by putting everything above `**Spawning a coder to write`. If a later edit moves text under that bullet, control arm 9 could go vacuous or red. Step 3 catches this.
- **A read approval mistaken for the ADR-055 write marker:** 1e says outright that it is not the marker and authorises no write, and that a diagnosis spawn carries no marker. The coder prompt is unchanged: a spawned coder with no marker already refuses to write.
- **A diagnosis spawn turns into a fix:** "ask for the cause, not a fix", and any fix goes through plan → approval → marker.
- **Over-triggering:** the "Still yours" list keeps "is this expected?" answers from the spec, quick classification, and walkthroughs against approved text. Probe B checks this.
- **Fact lookup vs trace:** one read is a fact and a second read in service of explaining is a trace. That matches L1's "1–2 fact lookups". Q3 offers a stricter version.
- **A quoted approval containing secrets:** "with no credentials in it". The existing no-secrets hard rule also applies.
- **Frontmatter shape broken by an edit:** single-line replacements inside the existing `>-` blocks; `skill-frontmatter.test.js` in step 3 checks this.
- **Prompt length:** about 25 lines added to a 158-line prompt. No budget test covers agent files (`rules-block-budget` reads `CLAUDE.md`/`AGENTS.md` only).
- **Overlap with 0457** (a later rewording of agent prompts): noted only. Build on the current tree.
- **After close:** the wiki will need an ingest of the changed lead prompt and of the ADR note if Q1 is chosen. That is fkit-wiki's job, not done here.

## Dependencies
- None blocking. 0495's edit is already in the tree and is kept intact.
- 0502 runs in parallel. It touches no file in this list.
