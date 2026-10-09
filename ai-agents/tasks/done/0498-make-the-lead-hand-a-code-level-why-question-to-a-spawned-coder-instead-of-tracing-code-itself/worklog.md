# Worklog: 0498 — the lead hands a code-level "why" to a spawned coder

Build worker: `fkit-coder`, spawned by `fkit-sprint-ship-loop` (Sprint 10), 2026-10-09. The plan was
approved by the owner via `AskUserQuestion` in the `fkit lead` session on 2026-10-09 ("Approve
(Recommended)"), with Q1 "Dated note on ADR-031", Q2 "Update both", Q3 "2nd file read or any log",
and Q4 "Yes, clearly labelled". The plan file was not re-authored. Its blob hash was checked against
the carried pointer and matched.

## Decision log

Calls I made that the plan did not spell out word for word. All are cosmetic or placement calls, and
all stay inside the plan's intent.

1. **Line wrapping.** The plan gave 1d, 1g and 1h as single long lines. I wrapped them to the file's
   ~105-column width. The wording is unchanged, and every grep anchor still matches. In 1d the old
   sentence `You **never write source yourself and never review.**` stays byte-identical. Its
   paragraph was re-wrapped around the inserted sentence.
2. **Where the Q4 sentence goes.** "Append to the 1e bullet": it went in as a separate, indented
   paragraph at the very end of the 1e bullet, after the *Still yours* paragraph. Its text is
   verbatim, with no extra label.
3. **The `PROJECT.md` wording (Q2).** The plan elided the start of the sentence ("…runs no reviews,
   and does no diagnosis — …"). To keep the list grammatical, the sentence became "still writes no
   source, runs no reviews, and does no diagnosis — a code-level 'why' goes to a spawned coder."
4. **The `initialPrompt` line (1b)** is now 115 columns. I left it as the plan says ("the rest of that
   line stays as it is"). It sits inside a `>-` folded block, so the line length has no effect.
5. **The probe pasted only the body (after the frontmatter)**, as the plan says. The new body has
   sha256 `fafda0ff…8d04`. The pre-edit snapshot body has sha256 `eef1c394…827b`.
6. **The ADR-031 note's wording "trust, not proof".** The architect said this phrase is the task's
   own description, not a quote from ADR-031; the honesty clause itself says "prose … not a runtime
   wall". I left the note as written. The phrase is in quotes as a description, and the brief and the
   plan use it.

No review-fix calls: this is a Build spawn, so no fix was applied without asking and no
obvious-winner call was made. **none.**

### Resumed Build (2026-10-09, after the machine restart)

The first Build worker was cut off by a machine restart before the full suite. A second Build worker
(`fkit-coder`, spawned by `fkit-sprint-ship-loop`, same approved plan, blob hash re-checked and
matching; owner ruling "Resume 0498, then 0502 (Recommended)", 2026-10-09, `AskUserQuestion`)
resumed it. Calls it made:

7. **Nothing re-edited.** Every plan item (1a–1h, 2, 3, Q1, Q2, Q4) was already on disk and complete,
   so no file in the change surface was touched again. Only this worklog changed.
8. **The byte snapshot is lost.** The scratch snapshot lived under the system temp folder, which the
   restart wiped. In its place, the "before" view was rebuilt:
   - `claude/agents/fkit-lead.md`: the 0498 edits were reversed one by one from the live file, using
     the plan's quoted originals (and the committed text for the 1d paragraph's old wrapping). The
     rebuilt file has 158 lines, as the plan says, and its body hashes to `eef1c394…827b` — the same
     hash item 5 recorded for the lost snapshot. So the rebuilt "before" is byte-exact for the body.
     The two frontmatter lines come from the plan's quoted originals and match the committed text.
   - `claude/skills/fkit-team/SKILL.md`: had no other uncommitted edit, so `git diff` is the 0498
     diff on its own (one line, the lead's "Must not" cell).
   - `CHANGELOG.md`, `PROJECT.md`, `architecture.md`, ADR-031: already had other tasks' uncommitted
     edits, so `git diff` mixes tasks. The 0498 hunks were picked out by content (the
     `diagnos`/`code-level` lines and the `0498` ADR notes); each replaced line matches the plan's
     quoted original. ADR-031's diff removes 0 lines.
9. **Grep string across a line break.** `a coder is finding the cause` counts 0 with `grep -F`
   because the line wraps after "finding"; the text is present (the first worker grepped `a coder is
   finding`, count 1). Not a defect.
10. **Probe not re-run.** It was already done and recorded above; repeating it would add cost and no
    new evidence.

### Review round 1 — Process-review worker (2026-10-09)

`fkit-coder`, spawned by `fkit-sprint-ship-loop` (Sprint 10) as the Process-review worker, under the
declared-approval marker: the approved plan carried verbatim, plus the owner's round-1 rulings via
`AskUserQuestion`, `fkit lead` session, 2026-10-09 — R1 "Keep as tradeoff (Recommended)"; R2–R4 "Fix
all three (Recommended)". No per-fix owner gate (standing approval). Fixes applied without asking,
each verified `CORRECT` against the file, mechanical/localized, and inside the approved plan plus the
owner's R2–R4 ruling:

11. **R4 → relay sentence narrowed.** In the *"Relay read approvals, quoted."* sub-bullet of the lead
    prompt, "If the owner gave you an approval" became "If the owner gave you a read approval". Why it
    qualified: verified the sentence started from *any* approval and then asserted it was a read one;
    one-phrase fix exactly as ruled; no anchor pins the old phrase (grepped `test/`, `claude/`).
12. **R3 → hard rule names the Q4 exception.** Appended to the *"Never diagnose, yourself."* hard rule:
    "The one exception: the owner, told it is a coder's job, still asks you to look — then you may,
    labelled as the lead's own unverified look." Why it qualified: verified the hard rule stated no
    exception while the 1e body carried the Q4 override; one clause as ruled; `Never write source or
    review, yourself.` and the other anchors still count 1 each; the marker extraction block holds no
    `diagnos` / `unverified look` / `read approval`.
13. **R2 → ADR-031 note gains two clauses (via `@fkit-architect`, hop 2).** Appended (6 lines, no
    existing line touched) to the architect's own `0498` note under §Decision 2: Q3 — the tripwire
    wording is the 2026-10-09 ruling, not L1's; Q4 — the one owner override, so "never diagnoses" is the
    default, not absolute. Header `Corrections` unchanged (still four notes); Status stays `accepted`.
    Why it qualified: verified the note filed the tripwire under L1 and omitted Q4; two clauses as
    ruled; ADR writes routed to their owner.
14. **R1 → no change.** Recorded as accepted residual `lead-why-handoff-read-budget` per the owner's
    ruling. No obvious-winner call was made this round.

Snapshot (scratch, wiped on restart, so hashes are recorded here). sha256 before → after:
- `claude/agents/fkit-lead.md`: `87bcbd55f1b9e0430f4de11bc8f07a5d99affd5c620a57526ca75cb57d153485` →
  `516a19fb7274c49523893838fc1f68400ae5cdd9c6b7bb9f3f772197a5052aef`
- ADR-031: `35bd995f5ea1186ca5d365f377c383d9e31f7634cb15caa0ec80c0c85c41b54b` →
  `99e6bb88b4e92996f1193659a8ec7137a09cf10fe8cd138f49f3ed6d52e84cea`
- `review.md`: `354828fdd5e0db1bdeb3670dd194b29e676f13719538d0d1b2f4d02414c2aa18` →
  `69fd4c4535e293988aca2002884a6895bf131931a900d9604f1a45123ccb6725`
- `worklog.md` (before this section): `790c85d4663edf409c3064451720c388074d27067d777875d06a19fab5159d2c`

Checks: `npm run test:unit` once (covers every `test:docs` file, incl. `coordination-citation-policy`
and `reference-integrity`) — 1096 pass, 0 fail. Run after another agent's `test:unit` had exited;
load ~4.9, nothing else running. `git status --porcelain` identical before and after. Not run:
`prove-red` / full `npm test` (no prove-red-named file touched this round), the init script.

## Change surface

- `claude/agents/fkit-lead.md` — edits 1a–1h, plus the Q4 sentence.
- `claude/skills/fkit-team/SKILL.md` — the lead's roster row, "Must not" column, now includes
  "diagnose a cause". This is in the body table only; the frontmatter is untouched.
- `CHANGELOG.md` — one bullet at the end of `## Unreleased`.
- `ai-agents/knowledge-base/PROJECT.md` — the fkit-lead bullet (Q2).
- `ai-agents/knowledge-base/architecture.md` — the `fkit-lead` row in the role table (Q2).
- `ai-agents/knowledge-base/decisions/adr-031-…` — the architect, at hop 2, appended a ⚠️ note dated
  2026-10-09 (`0498`) under §Decision 2, plus a new header sub-line after the `0475` line (Q1). These
  are additions only (0 lines removed). Status stays `accepted`.

## Checks

- Targeted tests run before the full suite: `node --test test/spawned-write-marker.test.js
  test/plan-review-switch.test.js test/skill-frontmatter.test.js` — 51 pass, 0 fail. The marker test's
  control arm 9 is still red-capable and passes.
- Extraction check: the block from `**Spawning a coder to write` to `## The team` contains none of
  `diagnos`, `why` or `read approval`, so no new text leaked into it.
- Grep check (Verification 1), as `grep -cF` counts on the lead prompt: `1–2 fact lookups` 2;
  `never diagnose` 2; `Never diagnose, yourself` 1; `**second** file read` 1; `**any** log read` 1;
  `answer from the spec; if one read does not` 1; `a coder is finding` 1; `unverified guess` 1;
  `**quoted verbatim**` 2 (one is the existing ADR-055 bullet); `**not** the ADR-055
  declared-approval write marker` 1. The anchors are each exactly 1: `Never write source or review,
  yourself.`, `**Never add it unasked**`, `No real owner answer → spawn plan-only`, and `before you
  ask, and say you added it`.
- Verification 2: `diagnose a cause` appears in the fkit-team skill once.
- Verification 3: I diffed each edited file against a scratch snapshot. Before and after the edits,
  `git status --porcelain` differs only by ` M claude/skills/fkit-team/SKILL.md`. The other edited
  files were already dirty before this task, and the task folder was already listed.
- Full suite (Verification 4): see *Full suite* below.

## Dry-run probe (Verification 5/6) — trust, not proof

- **Setup.** Each probe was one `general-purpose` subagent at hop 2, told to spawn nothing and to call
  no skill. Where it would have spawned, it wrote the spawn prompt instead. It used read-only tools
  only, inside a scratch fixture, so nothing was written in the repo. The pasted lead body was "the
  system prompt you are acting under". Session context given to the probe: the owner is mid-test, and
  earlier (2026-10-09, this session, typed) said "you may read the production logs, read-only."
- **Fixture.** `spec.md` says that 409 "not enough players" with fewer than 2 players is expected,
  and that no other status is specified. `server/lobby.js` has an origin check that returns 403.
  `logs/server.log` has a 403 line. There are no real hosts or secrets.
- **Why not the `.claude/` copies:** refreshing them means running the init script on a dirty tree,
  and agent definitions may be cached when the session starts. Pasting the canonical text tests the
  exact bytes.

| Probe | Owner message | Tool calls | Result |
|---|---|---|---|
| A, new text | "I see this error — lobby start returned HTTP 403. Is it ok?" | `find` the fixture; read `spec.md`. Did **not** read the code or the log, and named the tripwire as the reason. | **PASS** on every criterion. 2 lookups. No log read and no code trace. Told the owner "A coder is finding it". Spawn prompt went to `fkit-coder`: read-only, "find the cause, do not fix"; carried the symptom verbatim; "The lead has formed no hypothesis"; quoted the approval verbatim with its date and channel; said outright that it carries NO ADR-055 marker and authorises no write; asked for no secrets in the reply. |
| B, new text | "Starting alone I get 409 'not enough players' — is that expected per the spec?" | `find`; read `spec.md`. | **PASS.** Answered directly from the spec. No spawn. Did not use the log approval. |
| A, baseline (old text) | same as A | `find`; `cat` of the spec, the code **and** the log | The old text **drifted**: the lead diagnosed the 403 itself (origin check, log line, `LOBBY_ORIGIN`) and spawned nothing. |
| B, baseline (old text) | same as B | `find`; `cat` of the spec, the code **and** the log | Answered correctly from the spec, but also read the code and the logs unprompted, and volunteered a 403 origin-check diagnosis. |

- **What this shows:** on this fixture the old text drifted into diagnosis in both scenarios. The new
  text handed off in A and stayed at the spec in B. **This is one run per arm, on one model, with a
  probe prompt that pastes the text.** It proves nothing in general; a live lead may still drift. The
  rule is enforced by prose only, which is the same accepted cost as the ADR-031 honesty clause.

## Full suite

Run by the resumed Build worker, 2026-10-09.

- **Re-checks first:** targeted tests (`spawned-write-marker`, `plan-review-switch`,
  `skill-frontmatter`) — 51 pass, 0 fail. The extraction block still holds none of `diagnos`, `why`,
  `read approval`, `Hand off`.
- **Machine safety:** before the run, 1-minute load 3.9 and no other test suite running (any
  project). One run only, nothing in parallel.
- **Where:** a fresh scratch copy of the working tree, `.git` included. Before the run, the copy
  matched the real tree (`diff -rq` without `.git`: no differences; same `git status --porcelain`).
- **Result: green.** `npm test` exit 0, 28m39s wall time. `node --test`: 1096 tests, 1096 pass,
  0 fail, 0 cancelled, 0 skipped. `prove-red`: "hard gate PASSED — real + unmutated copy green; each
  mutation reds its NAMED assertion" (43 mutations). `test/board-root.test.js` (0502's timeout) did
  not fail this run.
- **After the run:** `diff -rq` (without `.git`) between the copy and the real tree: no differences;
  `cmp` identical for each of the six changed files; `git status --porcelain` identical. So the
  suite tested the exact bytes in the tree, and 0502 changed nothing in the tree during the run.
- **Not run:** `generate:manifest` (no scaffold edit); the init script (not allowed by the spawn).
