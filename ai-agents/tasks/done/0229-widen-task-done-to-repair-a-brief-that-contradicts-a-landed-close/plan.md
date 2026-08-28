# Plan — 0229: Widen `/fkit-task-done` to repair a brief that contradicts a landed close

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-27. Written by the driver at approval, before the Build spawn (ADR-020). Rulings on Q1–Q5 are appended at the end.

**Goal (one line).** Add a second, owner-only exception to `/fkit-task-done` step 1's "already in `done/`" stop so an owner-present producer session can repair a brief whose `## Status` reads open work while a board row already reads `✅ Done` — skip the move, status updates only, resolve to plain `✅ Done`.

Live measure 2026-08-27: 3 `done/` briefs contradict a landed close — `0021`, `0041` (both have a plain `✅ Done` row in `sprints/done/sprint-1.md`) and `0014` (no board row at all → the new branch must refuse it). Sprint-1 dashboard emits `drift disagreement 0021 / 0041`.

### Files touched
| File | Change |
|---|---|
| `claude/skills/fkit-task-done/SKILL.md` | step 1 bullet (today `:81-85`) gains the second exception + four must-nevers; step 7 gains two short clauses (see below). Nothing else. |
| `.claude/skills/fkit-task-done/SKILL.md` (gitignored mirror) | refreshed via `bash claude/fkit-claude-init.sh .` (or copy), then `diff` → empty. ⚠️ Refresh also lands 0325's unmirrored edits — expected. |
| `ai-agents/tasks/backlog/0229-…/worklog.md` | decision log: rulings honored, the accepted 0135 overlap, no-test decision, "0021/0041/0014 still drifted". |

**Not touched, deliberately:** `claude/skills/fkit-task-cancelled/SKILL.md` (its step 1 has no exception at all; `done/` → "confirm with the owner"; the mirror mode is 0134 Q6's ruling, not this task's); `claude/skills-for-role.sh`; `test/*`; the two ship-loops (Q3); `task-status-vocabulary.md`; `0134`/`0135` briefs; `0021`/`0041`/`0014` briefs; no ADR (0134 already carries the 2026-08-06 instruction to rule on this exact exception — confirmed in its brief `:97-111`).

### Step 1 — exact rule text and placement
Today's bullet (`SKILL.md:81-85`) ends `…only the owner can upgrade. Or`. Insert the new text **inside that same bullet, after "only the owner can upgrade."**, moving the trailing `Or` to the end of the inserted text. Every word of the existing exception stays byte-identical except the label (Q1: "One exception:" → "First exception:").

```
    **Second exception: the contradicted-close repair.** If you are the **owner** and the brief's
    `## Status` reads an *open-work* value — `🔲 Backlog`, `🔄 In progress`, or `🚧 Blocked — …` —
    while the folder already sits in `done/`, look for a landed close **before deciding**: run step 4's
    grep now, restricted to `ai-agents/sprints/` (closed plans under `sprints/done/` included), and
    find a status-table row for this task whose leading cell reads plain `✅ Done`. If one exists, do
    **not** stop — continue, skipping the move (the folder is already in place) and performing the
    status updates only. The brief's own `## Status` resolves to plain `✅ Done`: you are present and
    verifying, which is what the plain value means, and it is what the board already says — brief and
    board converge. Say which exception fired in the report (step 7). Four things this branch must
    never do:
    - **never fire when no board row reads `✅ Done`** — with no landed close this is a *close*, not a
      repair, and a close starts from `backlog/` through the ordinary path; stop and say so;
    - **never fire for a non-owner identity** — a producer **spawned** to close is an agent
      (ADR-033 §5) and stops here exactly as it does on the first exception;
    - **never upgrade an existing `✅ Done (agent-closed — not owner-verified)`** — a brief reading
      that value is the *first* exception's case and routes there; that exception stays exactly as
      written;
    - **never move a folder** in this branch.
    Any other `## Status` value on a folder already in `done/` — a `⛔ Cancelled …` or `➡️ Moved …`
    marker, an unrecognised string, a value that already begins `✅ Done` — is not this branch's case:
    the plain stop above applies, and the report says what was read. Or
```

(Q2: "plain `✅ Done`" only — an agent-closed board row + open-work brief stops with a message naming the case.)

**Precondition relaxed:** "already in `done/` ⇒ stop" now has a second exit — open-work brief value **and** a plain `✅ Done` board row **and** owner present.
**Preconditions kept:** the identity gate (owner-present `fkit producer` session — same gate, same words as the first exception); agent-closed brief ⇒ first exception only; no move in either exception; `cancelled/` stop unchanged; missing/other values ⇒ stop.

**Why it stays inside ADR-033.** §1's producer-only grant is untouched (`skills-for-role.sh`, the hook, `test/skill-ownership-hook.test.js` all unchanged); the branch is a *further narrowing* inside the producer role to owner-present, the same as the first exception — a spawned producer stops (§5). The agent-closed → plain upgrade remains the first exception's alone (must-never 3). The "Resolve the status value FIRST" table (`:61-64`) already says an owner-present run writes plain `✅ Done`; the branch adds no new value.

### Step 5 — no edit
The landing branch is step 5's *"**Reads anything else** (`🔲 Backlog`, `🔄 In progress`, `🚧 Blocked — …`, etc.)? Replace it with `✅ Done`."* (today `:279-280`) — the brief's dated correction is right that it is step 5, not 6. It already does the right thing once step 1 lets the run through. The self-locator rule's "*(the re-run and owner-upgrade paths must be no-ops here)*" (`:200`) is also true of this path (locators already name `done/`) — left byte-identical.

### Step 7 — two clauses (Q4: include)
- **Moved:** bullet (`:311`) — append: *"— or, when a step-1 exception fired, `Moved: none — <first | second> exception; folder already in done/`."*
- **Brief's own status header** bullet (`:314-318`) — add to the list of outcomes: *"repaired from `<value read>` to `✅ Done` under the second exception"*.

### Sequencing
1. Edit step 1 → 2. edit step 7 → 3. self-check every line-number citation in this plan against the post-edit file (they shift by the inserted lines) → 4. `node --test test/*.test.js` → 5. refresh mirror, `diff` → 6. worklog.

### Tests
None new (Q5). `node --test test/*.test.js` must stay green and is stated as **no-regression proof only** — no test reads SKILL.md body prose (0123; 0136 guards frontmatter only, and the frontmatter is untouched). `skill-frontmatter` still expects 26 skills — unchanged. `prove-red.sh` not required (no test edited); optional. ADR-014 zero devDeps holds.

### Verification — how a reviewer confirms the edit is *only* the approved widening
1. `git diff -U0 claude/skills/fkit-task-done/SKILL.md` shows hunks **only** at the step-1 bullet and the two step-7 bullets. Lines `:81-85`'s existing exception wording appears unchanged except the two-word label (Q1).
2. Quote the four must-nevers back verbatim from the file.
3. Walk `0021` by reading: folder `ai-agents/tasks/done/0021-…` ✓; brief `## Status` = `🔲 Backlog` ✓; `sprints/done/sprint-1.md:45` leading cell `✅ Done` ✓; identity = owner ⇒ fires; resolves plain `✅ Done`. Same for `0041` (`sprint-1.md:40`). **No dry run is possible** — the coder is hook-denied from `/fkit-task-done` at any spawn depth (ADR-018/033) and the branch is owner-only by design; say so, don't imply one.
4. Refusals, all by reading: (a) spawned producer → stops (must-never 2); (b) **`0014`** — folder in `done/`, brief `🔲 Backlog`, **no `✅ Done` row anywhere** (only prose mentions: `sprints/done/sprint-2.md:2447`, briefs `0296`, `0301`) → stops (must-never 1) — a live case, not a construction; (c) a brief reading `✅ Done (agent-closed — not owner-verified)` → first exception, not the second.
5. `node --test test/*.test.js` green — no-regression only. `test/skill-ownership-hook.test.js` still asserts producer-only movers (file untouched).
6. `diff claude/skills/fkit-task-done/SKILL.md .claude/skills/fkit-task-done/SKILL.md` → empty.
7. `0021`, `0041` (and `0014`) still drifted at the end — re-run `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/done/sprint-1.md` and show the two `drift disagreement` lines still present.
8. No commit.

## 2. Edge cases / failure modes
- **Board row lives in a closed plan** (`sprints/done/`) — the actual 0021/0041 case; the lookup must include `sprints/done/`. Step 4's grep is recursive; the rule text says so explicitly.
- **`➡️ Moved` row in one plan + `✅ Done` in another** — the `✅ Done` row is the landed close; the `➡️ Moved` row is a pointer and is never flipped (step 5's existing rule).
- **Board row `✅ Done (agent-closed…)` + open-work brief** — zero live cases; stops with a message naming the case (Q2).
- **Brief already begins `✅ Done` with trailing prose** (3 live: `✅ Done — verified complete…`) — not a contradiction; the plain stop applies. Rule keys on the three open-work values, not on "≠ `✅ Done`".
- **Brief `⛔ Cancelled` in `done/`** — a different contradiction; stop and report, never repair.
- **Idempotency** — after repair the brief reads `✅ Done` ⇒ plain stop on re-run. Step 5's "already reads the marker" no-op covers the board.
- **Step 4/5 side effects on the repair path** — links and self-locators already name `done/` ⇒ no-ops; must not drift into a sweep of other `done/` briefs (step 5's "only the brief just moved" clause holds).
- **Multi-line `## Status` value** — existing flag rule, unchanged.
- **Sprint-ship-loop close step** spawns a producer ⇒ this branch stops for it ⇒ consistent with both loops' "owner-only" carve-outs; the driver relays to the owner as today.
- **Line-number churn** — this edit shifts every citation below `:85`. The two loops' `:78-82` / `:283-286` are already wrong today; they get wronger. Not this task's (Q3).
- **Mirror refresh carries 0325's edits** — reviewer must diff mirror-vs-canonical (empty), not mirror-vs-its-old-self.
- **ADR-034** — the review ledger for this task closes on the work product (`SKILL.md`), own-record findings go to *Accepted residuals*.

## 3. How each caveat / ruling in the brief is honored
| Brief item | How |
|---|---|
| Ruling 2026-08-06 *"Repair the mover first, then run it"* | Plan repairs only; verification 7 proves nothing was run and no brief hand-edited. |
| Dated correction *"Ship 0229 standalone."* + accepted tradeoff | No fold into 0135; 0134 not narrowed; branch labelled "Second exception: the contradicted-close repair" so 0135 can find, subsume/keep/replace it and say so; worklog records the overlap. |
| Dated correction *step 5, not step 6* | Plan cites step 5's "Reads anything else" branch (`:279-280`) as the landing branch; no edit to it. |
| Items 1–4 (branch, skip-move, plain `✅ Done`, four must-nevers in prose) | Rule text above, verbatim. |
| Item 5 (mirror refresh + diff) | Sequencing step 5 / verification 6. |
| *"Line-number citations are deliberately absent… do not add naked `:NNN`"* | The skill text cites step 4 / step 7 by name only; `:NNN` appears in this plan solely for the reviewer, re-derived today. |
| *"likely wants an ADR note… probably satisfied by 0134"* | Confirmed: 0134's brief already instructs the architect to rule on this exception; no fresh ADR. |
| *"0230 is not folded"* | Vocabulary doc untouched. |
| *"do not run it… do not hand-edit the two briefs"* | Verification 7 re-shows the drift at the end. |
| *"No commit"* | Working tree only. |

## 4. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-27 (verbatim option labels)
- **Plan gate:** "Approve".
- **Q1 (label):** ""First exception:" (Recommended)" — two words change on the existing exception's label; every other word of the upgrade byte-identical; deviation from the brief's "byte-unchanged" stated in the worklog and visible in the diff.
- **Q2 (row match):** "Plain `✅ Done` only (Recommended)".
- **Q3 (ship-loops' stale "one exception" cites):** "Leave; record for 0135 (Recommended)".
- **Q4 (step-7 report clauses):** "Include (Recommended)".
- **Q5 (test):** "None (Recommended)".
