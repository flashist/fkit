# Worklog — 0134: decide the sanctioned repair path for a half-landed close

**Worker:** a spawned `fkit-architect`, running the Build step of `/fkit-sprint-ship-loop` (Sprint 9,
live `fkit lead` session). It ran on the owner's named Route ruling of 2026-09-14 (ADR-037 §3),
verbatim option label **"Keep plan, architect builds (Rec)"**. Skill run: `/fkit-record-decision`,
which the architect owns. **This spawn had no owner channel.** Every ruling used came relayed in
`plan.md`'s "Owner rulings" section.

**Date of work:** 2026-09-14.

**Plan:** `plan.md` in this folder. **Not edited.** Blob checked before any write:
`git hash-object plan.md` → `62b6069d613ba94feeb53098227d0aab1af96f83`, which matches the driver's
stated blob.

## What was done

**One file created:**
`ai-agents/knowledge-base/decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md`.
ADR-048, status **accepted**. Plus this worklog.

**Not touched:**
- ADR-033 (plan §3 step 7);
- any `SKILL.md`;
- `0135`'s brief;
- any sprint board;
- `ai-agents/wiki-vault/`;
- `plan.md`.

**No commit.**

## Step 1 — re-measure of plan §2 at Build-time HEAD

HEAD at Build: **`d8ef596`**, the same commit plan §2 measured.
- **Dirty-tree check:** of the cited skill files, only `claude/skills/fkit-sprint-ship-loop/SKILL.md`
  differs from HEAD. It has a 2-line swap near its top, from `0390` (`claude/skills/…` →
  `.claude/skills/…`), and it moves no line.
- `fkit-task-done`, `fkit-task-cancelled` and `fkit-task-ship-loop` `SKILL.md` are clean against HEAD.
  The 2026-09-13 note in the brief warned of uncommitted `0381` edits in two of them; those are no
  longer in the working tree.

| Plan §2 fact | Plan evidence | Re-measured | Material? |
|---|---|---|---|
| task-done step 1 stops on `done/` | `SKILL.md:81` | `:81`, *"it is already in `ai-agents/tasks/done/` (nothing to do — say so)"* | no |
| Exception 1, owner-only | `:81-85` | `:81-85`, *"An agent hitting this case still stops: only the owner can upgrade."* | no |
| Exception 2 (`0229`), owner-only, plain row, no move | `:86-110` | `:86-110`; *"never fire for a non-owner identity"* at `:102-103`; *"never move a folder"* at `:107` | no |
| No door for brief plain + row stale | `:81-110` | confirmed: exception 1 needs agent-closed brief, exception 2 needs open-work brief | no |
| task-cancelled has no exception | `:85-86` | `:85-87`: `:85` the already-cancelled stop, `:86-87` the in-`done/` confirm-with-owner stop. No exception branch | no (range +1 line) |
| Done/Cancelled skill-gated; In progress/Blocked free | vocabulary §"The authority split" | confirmed, *"`In progress` and `Blocked` are free"* | no |
| Neither loop routes a cancel to a producer | sprint `:314`, task `:206` | sprint `:314-316`, task `:206-209` | no |
| Half-landed branches | sprint `:294-308`, `:337`, `:343-347`; task `:117-120`, `:188-201`, `:211-214`, `:277` | sprint `:294-309` (the "Either way" bullet ends `:309`), `:337`, `:343-347`; task all as stated | no (range +1 line) |
| Stale citations in both loops | sprint `:302-303`, `:347`; task `:120`, `:195-196` | confirmed. They cite `:78-82` and `:283-286`; the targets now sit at `:81-110` and `:446` | no |
| Producer-only; spawned producer = agent | ADR-033 §Decision 1, §5, §"The limit" | confirmed, headings unchanged | no |
| Next ADR number | highest on disk 047 | 47 (see step 2) | no |

**Verdict: nothing differs materially.** No `NEEDS-DECISION`.

## Step 2 — number sweep (`/fkit-record-decision` step 2), 2026-09-14, before allocation

- **Step A** (malformed `adr-*` filenames): printed **nothing**.
- **Step B** (highest number on disk, numeric): **47**. Next free: **48**.
- **Manual in-flight check:** `grep -rn -i 'adr-048\|ADR 048\|adr-0048' ai-agents/ claude/ test/
  README.md CLAUDE.md` (vault included, read-only) gave **0 hits**. `0135`'s brief calls this record
  "ADR 0134" by task number. That is a reference to it, not a rival number claim.
- **Allocated: 048.**

## Step 5 — test suite

- `node --test test/*.test.js`: **exit 0** (captured directly, no pipe). **967 tests, 24 suites, 967
  pass, 0 fail, 0 cancelled, 0 skipped** (59.6 s).
- `node --test test/adr-number-uniqueness.test.js`: **exit 0, 14/14 pass**. It read the decisions
  folder with `adr-048` present.
- `node --test test/reference-integrity.test.js`: **exit 0, 22/22 pass**. It walks all of
  `ai-agents/`, so the new ADR's links were in scope: *"scanned 932 files, resolved 3708 link targets,
  0 broken, 7 named-exempt"*.
- `node --test test/coordination-citation-policy.test.js`: **exit 0, 21/21 pass**. This worklog is
  in a scanned `backlog/` folder and carries no coordination-document line coordinate.
- ⚠️ **Green proves the number and the links only, not the decision.** No test reads the ADR's
  content.

## Verification checklist — brief items 1–6 and both owner constraints → ADR-048 headings

| # | Requirement | Where ADR-048 meets it | Status |
|---|---|---|---|
| V1 | ADR under `decisions/`, no number collision | file `adr-048-…md`; §"Number allocation — the sweep, evidenced"; uniqueness suite green | met |
| V2 | all seven questions answered, each visibly, with a must-never list | §Decision → headings **"Q1"**, **"Q2"**, **"Q3 — What it MAY write"**, **"Q4 — What it MUST NEVER do"** (10 items), **"Q5 — The detection rule"**, **"Q6"**, **"Q7"** | met |
| V3 | rejected option *keep it owner-only* recorded with why it lost | §Options considered, bullet **"Keep it owner-only (rejected by the owner, 2026-09-13)"** | met |
| V4 | `/fkit-task-cancelled` in or out, file checked | §Decision → **"Q6"**: out of scope; `fkit-task-cancelled/SKILL.md:85-87` quoted; loop cancel rules quoted | met |
| V5 | ruling on the three carve-out sites | §Decision → **"The three carve-out sites — amended, kept as the fallback"**: table naming all three with re-derived lines, plus the exit rows | met |
| V6 | `0135` readable against the ADR with no open decision | §Consequences → "Handed to `0135`" and "`0135` stays a four-surface change". Read against `0135`'s brief items 1–9: item 1 → Q3/Q4/Q5; item 2 → Q6 (out, worklog says so); item 3 → carve-out section; the `0229` subsume/keep/replace obligation → "`0229`'s exception — kept". **No open decision found.** See the note under the decision log | met (a reading check, not an edit) |
| OC1 | *"The mode MUST REFUSE when both locations already agree."* | quoted verbatim at the top of **"Q4"**; must-never **2**; Q5 clause **(c)** | met |
| OC2 | *"The mode MUST NEVER upgrade the agent-closed marker."* | quoted verbatim at the top of **"Q4"**; must-never **1** (*"anywhere, for any identity"*); Q5 clause **(d)** | met |
| S9 | Sprint 9 criterion 9: must-never list NAMES the agent-closed marker | must-never **1** names `✅ Done (agent-closed — not owner-verified)` literally | met for the "names the marker" conjunct. ⚠️ The **"owner-approved"** conjunct is **not this Build's to claim**: the ADR's rulings are owner-given, but the owner has not yet seen the written text |

**Plan §3 step 3 content, checked:**
- **Context:** the gap, `0123` R1/R6, `0229`, the owner ruling and its reason — present.
- **`0229` kept, owner-side gap named as a residual** — §"`0229`'s exception — kept, owner-only".
- **Carve-outs amended as fallback, handed to `0135`** — present.
- **Cancelled out of scope with a re-raise condition** — Q6 plus Re-raise trigger 3.
- **"The limit" widening disclosed with the required report wording** — Q7 and must-never 10, exact
  string *"landed close propagated; its provenance not checked"*.
- **Both constraints quoted verbatim** — Q4.
- **Owner sign-off citing 2026-09-13 and 2026-09-14** — §Owner sign-off table.
- **Build commit stated** — header "Measured at".

## Decision log

These are architect's calls made inside the approved plan. None is an owner ruling. Each is marked
in the ADR text.

1. **Q5 clause (e): a location reading `⛔ Cancelled …` or an unrecognised value → refuse.** Plan
   §5's (a)–(d) did not say how to classify such a location. Refusing is the cheapest choice to
   reverse, and it matches exception 2's own rule for such values (`fkit-task-done/SKILL.md:108-110`).
2. **A `➡️ Moved …` row is a pointer, not a status location.** It never counts toward (b)–(e). This
   follows from plan must-never 8 and step 5's *"never flip a `➡️ Moved` row to `✅ Done`"*.
3. **"Copies, does not resolve."** An owner-present producer running the mode also writes the
   agent-closed value, not plain. Forced by D1(a) and must-never 1's "anywhere". Without it, the
   skill's resolve-FIRST table would make an owner-present run write plain.
4. **Branch order.** Exceptions 1 and 2 govern their own owner cases as written today. The mode is a
   third branch for the agent-closed-landed case.
5. **Two must-never items added to the plan's eight:**
   - item 3, "never write plain `✅ Done`", which states D1(a) as a prohibition;
   - item 10, "never propagate without the provenance disclosure", which puts D5(a)'s required wording
     inside the list.
   Plan §4 permitted D1/D5 additions.
6. **V6 note.** `0135`'s brief describes itself both as *"three files"* (Context) and as a
   *"four-file doctrine change"* (Notes). The ADR follows plan §3 ("stays a four-surface change") and
   treats `fkit-task-cancelled` as a named, untouched surface. This is a wording mismatch inside
   `0135`'s brief, not an open decision. It is left for the producer; this Build does not edit that
   brief.

## Open items for the driver

- **The ADR says `Status: accepted`,** following the house form for owner-ruled ADRs (ADR-044,
  ADR-047). The owner has **not reviewed the written text**. The four decision-log items are the
  architect's own calls and should be shown to the owner at Review/Close. Sprint 9 criterion 9's
  "owner-approved" conjunct depends on that.
- **fkit-wiki should ingest ADR-048.** Not done here (ADR-005).

## Process-review (fkit-coder, `/fkit-sprint-ship-loop` Process-review worker, 2026-09-14)

**Worker:** a spawned `fkit-coder` running `fkit-process-stateful-review` on `review.md` (R1–R11),
under the loop's declared-approval marker: plan blob `62b6069d…` (re-checked, unchanged), owner plan
approval "Approve (Rec)", and the owner's review rulings relayed by the driver (R7 "Record as
consequence (Rec)", R8 "Name as residual (Rec)", ADR status "'proposed' until you sign (Rec)", R4/R5/
R9/R10/R11 "Fix all in this pass (Rec)"). **No owner channel.** Only ADR-048, `review.md` and this
worklog were edited. **No commit.**

> ⚠️ **Superseded Build statement.** "What was done" above says ADR-048 is status **accepted**. That
> is the Build's record and is left as written. Per the owner's status ruling the ADR now reads
> `proposed` until the owner approves the final text and the architect's calls C1–C10 listed in its
> §Owner sign-off.

### Torn-state recovery

This is a **re-spawn**. The first Process-review worker died mid-edit on an API 403 (owner ruling:
"I'll /login, then re-spawn (Rec)"). Checked before any edit:
- ADR-048 blob `7cc1b705…` matched the driver's measurement; `plan.md` blob matched.
- The partial edit had landed only the header: `Status: proposed — owner ruling …` and a Deciders
  sentence naming this Process-review step. Both read complete (no sentence cut off) and match the
  rulings.
- §Owner sign-off did not claim acceptance, but said the calls would be seen "at this row's Review and
  Close" and listed only three calls. Replaced as part of R6 (below), not as a separate repair.
- `review.md`'s Coder response was empty and its Status unclosed; this worklog carried no
  Process-review entry. Nothing else was malformed, so nothing else was repaired.
- Coder response rows were written one finding at a time, straight after each fix, so a second crash
  would leave a legible record.

### Decision log — every fix applied without per-fix owner approval

Qualification key: **(A)** verified `CORRECT`, mechanical/localized, inside the approved plan (the
driver pre-cleared R1, R2, R3, R6 as such); **(O)** verified `CORRECT` and applied as the owner's
relayed review ruling directs. Obvious-winner calls: **none** beyond those named as Architect's calls
below — each new call is marked in the ADR text and listed in its §Owner sign-off for owner approval.

| Finding | What changed in ADR-048 | Why it qualified |
|---|---|---|
| R1 | §Q5 "Order among step 1's branches": explicit order exception 1 → exception 2 → mode → plain stop; quotes the four agent-stop sentences in `fkit-task-done/SKILL.md` and has `0135` re-word them to hand on to the mode | (A). Precision, not policy: the ruled mode cannot exist unless those stops hand on; exceptions-first for the owner is the order the R7 ruling records. Call C4 refined |
| R2 | §Q5 Locations: epic cells and in-body `**Status:**` lines attributed by link; new clause (f) refuses an unattributable one; "what each clause guards" gains (e), (f) | (A). Extends the plan §5 row discriminator to the other two kinds; fail-closed per step 6. New call C5 |
| R3 | §carve-out sites: "Either order works" replaced by spawn-first, Blocked marker only on the fallback path, one spawn | (A). Forced by D4(a) (carve-out is the fallback) and must-never 8. New call C6 |
| R6 | §Q5 Moved-row call marked; §Owner sign-off: full call inventory table C1–C10 | (A). Disclosure only; rule unchanged |
| R4 | §Q5 classes: missing or multi-line brief `## Status` reads "other" → (e) refuses | (O) "Fix all in this pass (Rec)". New call C7 |
| R5 | §Q3: item 2 covers all pointers broken by the move (any source board, Moved-row hrefs, outbound sibling links, self-locators); boundary paragraph (epic next-slice prose not written; guard still runs; third `Moved:` report value) | (O). Inclusion matches D2(a) "repairs hrefs as a side effect" and the ADR's own D2(c) rejection reason. New call C8 |
| R7 | §Q3 "copies, does not resolve" re-based on D1(a) + must-never 3; §Consequences records the owner-present asymmetry and the later upgrade path | (O) "Record as consequence (Rec)". Behaviour unchanged. Ledger residual added |
| R8 | §`0229`'s exception: second named residual (brief plain + row agent-closed); §Consequences names both gaps; re-raise trigger 2 covers either | (O) "Name as residual (Rec)". Ledger residual added |
| R9 | §Q5 clause (d): leading-marker test on `✅ Done (agent-closed — not owner-verified)`; trailing text not compared; re-raise trigger 5 re-worded | (O). New call C9 |
| R10 | §carve-out sites: fallback list drops "no disagreement", adds "no landed value at all" and an unattributable location; an all-agree refusal is not a fallback case | (O). New call C10 |
| R11 | §Q4: "unchanged in meaning" → "verbatim", quoting `0135`'s brief and the owner's reason | (O). The reviewer's cause claim about `0123` was not carried in: not sourced in `0134`'s brief |

Header also: §Owner sign-off table gains rows for the R7, R8, status and R4/R5/R9–R11 rulings.

### Verification

- `node --test test/adr-number-uniqueness.test.js test/reference-integrity.test.js test/coordination-citation-policy.test.js`
  → **exit 0**, 57 tests, 57 pass, 0 fail (captured to a file, no pipe). Reference integrity:
  *"scanned 934 files, resolved 3708 link targets, 0 broken, 7 named-exempt"*.
- Both owner constraints: the brief's six quoted lines appear **byte-identical, once**, in ADR-048
  §Q4 (checked by exact substring match).
- ⚠️ Green proves numbering, links and citation form only. No test reads the ADR's decision content.

## Owner sign-off amendment — 2026-09-14

**Worker:** a spawned `fkit-architect`, on the owner's named Route ruling (ADR-037 §3) relayed by the
`/fkit-sprint-ship-loop` driver: ***"Approve all C1–C10 (Rec)"***. Skill: `/fkit-record-decision`, used
as it applies to a still-`proposed` ADR (a direct edit; the dated-correction-note form is for an
`accepted` ADR). **No owner channel.** ADR blob checked before any write: matched the driver's stated
`85f61769…`.

**Owner rulings recorded (2026-09-14, `AskUserQuestion`, live `fkit lead` session):**
- ***"Approve all C1–C10 (Rec)"*** — all ten architect's calls approved.
- ***"Add the rule to ADR-048 (Rec)"*** — a new rule beyond D4: the loop never writes `🚧 Blocked`
  over a location reading "other"; it reports instead.

**What changed in ADR-048:**
- **Header:** Status `proposed` → `accepted`, citing the sign-off label; Deciders gains the owner's
  sign-off of the final text and this recording step.
- **§The three carve-out sites:** a new bullet after the order (C6) bullet carrying the owner's loop
  rule, marked as an owner ruling. It explains the second-run gap it closes (a fallback `🚧 Blocked`
  marker over an "other" value erases what clause (e) checks, so a later reconcile run would overwrite
  it, defeating must-never 8), and names it the loop-side counterpart of must-never 8.
- **§Consequences → Handed to `0135`:** a new bullet so `0135` implements the rule in both loops.
- **§Owner sign-off:** two new rows (Sign-off; Loop rule). The warning paragraph that said the calls
  were covered by no ruling now says all ten are owner-approved.

**Why:** the owner signed off the final text and closed the second-run gap flagged at Process-review.

**Checked for conflict, none found:** the rule narrows only what the loop may write on the fallback
path. It agrees with C6 (spawn first, marker only on fallback, one spawn), with clause (e) (keeps its
input intact across runs) and with must-never 8. Q4 and Q5 are unchanged.

**Residual text:** the ADR carried no residual naming this gap, so none was removed. The gap is now
closed by rule, not recorded as a residual.

**Not touched:** ADR-033, any `SKILL.md`, `0135`'s brief, `plan.md`, `review.md`, any sprint board,
`ai-agents/wiki-vault/`. Q4's two owner constraints unchanged. **No commit.**
