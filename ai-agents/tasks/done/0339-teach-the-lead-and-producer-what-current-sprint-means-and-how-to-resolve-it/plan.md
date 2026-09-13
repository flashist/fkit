# Plan — task `0339`: teach the lead, producer, ship-loop and READMEs the sprint lifecycle

> **Provenance.** Produced by a spawned `fkit-coder` (Plan step of `/fkit-sprint-ship-loop`), approved
> by the owner via `AskUserQuestion` in the live `fkit lead` session on **2026-09-12**, and written here
> by the **driver** at the moment of approval, before any Build spawn (ADR-020).
>
> ⚠️ **One declared transformation.** The plan text reached the driver through a task-notification
> channel that HTML-escaped `<`, `>` and `&`. The driver un-escaped them when writing this file. That is
> a real transformation of the bytes; every other character is a copy. Nothing was summarised or omitted.
>
> ⚠️ **`carried-not-approved` still applies** (accepted residual, `0162`'s review ledger). A hash pins
> which bytes were *carried*, not which were *approved* — approval leaves no artifact (ADR-021).

---

## Bullet summary

- **Scope is roughly double what the brief describes.** The brief names 6 deliverables; a new file under
  `knowledge-base/conventions/` drags in **7 more files** (scaffold twin, parity exception list + its
  human mirror, both conventions READMEs, `structure-spec.md`, regenerated manifest, `EXPECTED_ROWS`
  49→50). This is exactly the trap that redded `0341`. **17 files total.**
- **Two brief claims are wrong against the ADR**, not just stale coordinates — see §B.
- **Nine stale coordinates found and corrected.** The brief's `README.md:9` / scaffold `:8` are the only
  two that still hold.
- **No test pins lead/producer/ship-loop prose** — verified. The agent-file edits are test-safe. The
  scaffold/structure edits are not.
- **`rules-block-budget` is not touched** — it measures `fkit-claude-init.sh`'s emitted CLAUDE.md block,
  not agent files. No re-measure needed.
- **The citation gate does not scan `knowledge-base/**`** — the new page may cite line numbers. The
  task's own `review.md` still may not.
- Deliverable 6 (`fkit-task-brief`) is **one phrase**, not a rewrite. Recommend keeping it.

---

## A. Stale coordinates in the brief — re-derived 2026-09-12

| Brief says | Actual | Note |
|---|---|---|
| `skills-for-role.sh:50` (lead), `:51` (producer) | **`:56`** / **`:57`** | Claim itself holds: lead does **not** own `/fkit-status`; it owns `fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-sprint-ship-loop` |
| `fkit-producer.md:15` *"read the active sprint plan"* | **`:16`**, and it is inside the **YAML `initialPrompt:` folded scalar** | Not body prose — see risk R2 |
| `fkit-producer.md:89` *"find the active one"* | **`:92-93`** | |
| `fkit-sprint-ship-loop/SKILL.md:47-48` | **`:49-50`** | |
| `fkit-sprint-ship-loop/SKILL.md:94` (and `92-96`, `44-48`) | **`:97`** | |
| `ai-agents/README.md:9` | **`:9`** OK correct | |
| `claude/scaffold/ai-agents/README.md:8` | **`:8`** OK correct | |
| *"`sprint-6.md` is the open plan"* | **`sprint-8.md`**; `sprint-6.md` archived 2026-08-29 | Confirmed: `sprint-8.md` line 3 = `> ## In progress — 2026-09-10.`; `select-active` returns `board file="sprint-8.md" … reason="lowest-ordered"`, exit 0, no drift |
| `fkit-task-brief/SKILL.md` *"step 8 and step 1 reason about 'the Backlog board is never the active sprint'"* | Step 1 (`:46-60`) contains **no** active-sprint reasoning at all. **One** hit repo-wide, at **`:311`**, inside step 8's fenced template | Deliverable 6 shrinks to one phrase |

Also corrected: the brief's *"`sprints/cancelled/` (SD-2)"* framing implies the scaffold should ship the
folder. **It should not** — ADR-047 §3 rules `cancelled/` is *"created on first use"* and *"This ADR's
migration does NOT create it."* The scaffold correctly omits it. (The live tree has
`ai-agents/sprints/cancelled/.gitkeep` from `0341`; harmless, and `sprints/` is a pruned parity directory
so nothing reds.)

## B. Two brief claims that are wrong on substance, not coordinates

**B1 — the "ADR-041 §5" paraphrase is an overstatement.** The brief asks the page to carry *"the ADR-041
§5 rule that no role re-derives it in prose."* **ADR-047 nowhere states that rule** and does not attribute
it in that form. ADR-041 §5's actual binding sentence is narrower:

> *"the selection step must obtain each candidate's identity **from `dashboard.sh`** … not by
> re-deriving the grammar in SKILL.md prose. **The exact CLI surface is the implementer's call;
> re-implementing the grammar is not.**"*

→ **Plan: quote that sentence, not the paraphrase.** Writing the paraphrase into a convention page would
make a stricter rule than any ADR ruled, in the one document class the repo treats as law.

**B2 — the README migration sentence is unsourced.** §8.2 is **not** the migration section — it is
*"ADR-041, superseded in part."* §8.1 is the migration section and is **scoped to this repo only**,
measured 2026-09-10. **No clause in ADR-047 addresses a consuming project upgrading fkit.** → **Settled by
owner ruling §H below.**

---

## C. The scope call — the new page must be dual-homed, audience-adapted

`test/dual-home-parity.test.js` derives its enforced set from a union walk of both homes minus
`test/dual-home-parity-exceptions.mjs`. **`knowledge-base/conventions/` carries no directory exception**,
so anything added under it is enforced by construction.

| Option | Cost | Verdict |
|---|---|---|
| **A — dual-home, audience-adapted** (mirrors the sibling `task-status-vocabulary.md`) | +7 files | **OWNER-RULED — this is the approved option** |
| B — live-only, `live-only` exception entry | +1 file, no structure churn | **Rejected.** `0341` ships `/fkit-sprint-done` and `/fkit-sprint-cancelled` to **every** consuming project. Live-only leaves a consumer with terminal-state skills and no page saying what the states are or who may set them |
| C — byte-identical both homes | no exception entry | **Rejected.** Requires dropping the ADR links the brief requires; the scaffold's `knowledge-base/decisions/` holds only `.gitkeep`, so every ADR link would ship broken |

`dual-home-parity.md` decides this itself: a file that *"cites tasks, ADRs or incidents →
audience-adapted: ship a generalized copy and add an entry to the exceptions module."* The page cites
ADR-047, ADR-041, ADR-033. **Option A.**

---

## D. The change set — 17 files, in this order

### Step 1 — write the live convention page (new)
`ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md`

Content, all of it sourced (no invention):

1. **Header blockquote** — the canonical set of *sprint* statuses; the only values valid in a board's
   line-3 banner.
2. **The four statuses table** — reproduce ADR-047 §1's table verbatim (Status / Line-3 banner / Lives in
   / Set by):
   - `Backlog` -> banner `> ## <BACKLOG MARKER> Backlog — <date>.` -> `ai-agents/sprints/` -> producer, by hand
   - `In progress` -> `> ## <IN-PROGRESS MARKER> In progress — <date>.` -> `ai-agents/sprints/` -> producer, by hand
   - `Done` -> `> ## <DONE MARKER> Done — <date>. Closed by /fkit-sprint-done.` -> `ai-agents/sprints/done/` -> mover only
   - `Cancelled` -> `> ## <CANCELLED MARKER> Cancelled — <date>. Closed by /fkit-sprint-cancelled — <reason>.` -> `ai-agents/sprints/cancelled/` -> mover only
   - Agent-closed variant: `Closed by /fkit-sprint-done (agent-closed — not owner-verified).`
   - **`Blocked` and `Moved` do not exist for a sprint** (§1). A reason is mandatory on `Cancelled`.
   - ⚠️ **Copy the exact emoji markers from ADR-047 §1's own table when writing the page** — this plan
     renders them as placeholders only to survive transport; the page must carry the real glyphs.
3. **The carrier (SD-1)** — the grammar template
   `> ## <MARKER> <STATUS> — <YYYY-MM-DD>.[ <trailing prose>]`; **strictly line 3**; malformed != missing
   (both -> `unresolved`, never eligible, distinct drift facts); **exactly one banner per board is an
   authoring rule, not a check** (only line 3 is read); legacy `CLOSED` banner reads as `Done` — **read
   forever, written never** (owner ruling V3).
4. **Tell task status from sprint status by POSITION, never by glyph** — mirror of the paragraph already in
   `task-status-vocabulary.md`, quoting ADR-047 §1.1's three-bullet rule.
5. **The authority split (SD-3)** — `Backlog -> In progress` free for the producer by hand; `Done`/`Cancelled`
   **only** via `/fkit-sprint-done` / `/fkit-sprint-cancelled`, **producer-only and hook-enforced**
   (ADR-018 `PreToolUse`), agent-closed marker when no owner is present, and the honest caveat that
   role-gating is separation, not prevention. **Do not restate the movers' internal step order** — it is
   mover internals, and ADR-047 §4 explicitly warns that the sprint movers *invert* the task movers'
   order. Nothing on this page needs it; not writing it removes the trap entirely.
6. **Location (SD-2)** — `sprints/done/` holds `Done`, `sprints/cancelled/` holds `Cancelled`,
   **`cancelled/` created on first use**; open boards sit at the top of `sprints/`.
7. **The definition** — one sentence: **"current sprint(s)" = "active sprint(s)" = every sprint whose
   line-3 banner reads `In progress`.** Plural is the default.
8. **The single-board rule** — where exactly one board must be chosen (the ship-loop drives one), it is the
   **lowest-ordered** `In progress` sprint, overridden by the literal `ACTIVE BOARD` token in an
   `In progress` banner's trailing prose.
9. **The one resolution path** — verbatim, in a fence:
   ```
   bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
   ```
   Read **every** `active` line for the plural answer; read the **one `board` line**
   (`file` / `identity` / `status` / `reason`, `reason` in {`lowest-ordered`, `active-marker`}) for the
   single-board answer. `active none` (exit 3) means no eligible sprint — that is an answer, not a
   failure. **Never pick a board by eye, never by highest number, never by filename.**
   Then B1's real quote from ADR-041 §5, attributed as ADR-041's constraint, not as a broader rule.
10. **Links** — ADR-047 and ADR-041 by relative path (both resolve; `reference-integrity` scans this file),
    and `task-status-vocabulary.md` as the sibling.

**Path form:** use `.claude/…`, matching `fkit-status/SKILL.md`. (Repo-wide the two forms are mixed — 9x
`claude/`, 3x `.claude/`. A consuming project has only `.claude/`. Pre-existing inconsistency; **out of
scope**, flagged not fixed.)

### Step 2 — write the scaffold twin (new)
`claude/scaffold/ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md`

Same substance; de-fkit-ified exactly as the sibling's scaffold copy is: **no ADR links** (a consumer has
none of those files), a *"starting convention, yours to amend"* frame, no fkit task numbers, and the
"harden it in `claude/skill-ownership-hook.sh` if you want more than prose" paragraph the sibling's
scaffold copy adds.

### Step 3 — register the exception
`test/dual-home-parity-exceptions.mjs` — new entry in the **audience-adapted** block:
`{ path: 'knowledge-base/conventions/sprint-status-vocabulary.md', kind: 'audience-adapted', reason: … }`.
Reason must name **what is actually different** in that file (the module's header forbids boilerplate) and
clear `REASON_FLOOR = 30` chars.

### Step 4 — the human mirror
`ai-agents/knowledge-base/conventions/dual-home-parity.md` `:52` — add the new path to the audience-adapted
row's brace list (currently five paths).

### Step 5 — both conventions indexes
- `ai-agents/knowledge-base/conventions/README.md` — new row in *What's here*. Check the footnote's
  *"Three of them … byte-identical; the rest ship … audience-adapted"* still reads true (it does — the new
  file joins "the rest").
- `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` — new row, **and `"Eight conventions ship
  with the scaffold"` -> `"Nine"`.**

Both are `index` exceptions — edited independently, no byte-parity.

### Step 6 — close the sibling's forward reference
- `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` `:34-35` — *"`sprint-status-vocabulary.md`
  — which ADR-047 names and **a separate task writes**"* -> a live relative link, forward-reference dropped.
  It is now written.
- `claude/scaffold/…/task-status-vocabulary.md` `:32` — same, as a link.

### Step 7 — structure spec + manifest + row count
- `claude/structure-spec.md` — Table B row
  `| ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md | fkit-authored reference file | convention |`,
  kept in the block's alphabetical order; and `:169-171` *"the **nine** files listed in Table B: the folder's
  `README.md` plus **eight** conventions"* -> **ten / nine**.
- `test/structure-check.test.js` `:55` — `EXPECTED_ROWS = 49` -> **50**.
- `npm run generate:manifest` -> regenerates `claude/structure-manifest.tsv`.

### Step 8 — teach the lead
`claude/agents/fkit-lead.md`. Insert a short block (~6 lines) at the end of **`## What you can do here`**
(before `## When the owner wants a dedicated role session instead`), and one line in **`## Hard rules`**:

- *"current sprint" / "active sprint" means every sprint whose line-3 banner reads `In progress` — there
  may be **several**. Report all of them.*
- Resolve it by running the selector (a read-only script, **not** a `/fkit-*` skill — inside your lock), or
  consult `@fkit-producer` for `/fkit-status`. Give the command.
- Hard rule: **never pick the highest-numbered plan by eye.**
- Point at `ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md`.

**The lock question is already settled by precedent, not by the implementer:**
`fkit-sprint-ship-loop/SKILL.md:99-101` — a lead-owned skill — already instructs the driver to run
`bash claude/skills/fkit-status/dashboard.sh <plan>` directly. Running the script is a `Bash` call, not a
`Skill` call, so the ADR-018 hook never sees it. The brief's *"raise separately if judged to breach the
lock's intent"* therefore does **not** fire. Recorded, not escalated.

### Step 9 — teach the producer
`claude/agents/fkit-producer.md`, two sites:
- **`:16`, inside the `initialPrompt:` folded scalar** — *"read the active sprint plan in ai-agents/sprints/"*
  -> resolve the active sprint **plans (plural)** with the selector; and `:17`'s *"current sprint phase"* ->
  phrased for N sprints.
- **`:92-93`, `## Ground yourself before answering` beat 2** — delete *"if unclear, list `ai-agents/sprints/`
  and find the active one"*; replace with the selector command / `/fkit-status`, "plans, plural", and a
  pointer to the convention page.

### Step 10 — ship-loop wording
`claude/skills/fkit-sprint-ship-loop/SKILL.md`, two sites, **wording only, no procedure change**:
- **`:49-50`** — *"empty = the active sprint, as `/fkit-status` resolves it"* -> **empty = the selector's
  `board` line — the single chosen board** (lowest-ordered `In progress`, or the `ACTIVE BOARD`
  override). Keep the existing *"Do not re-derive that rule here (ADR-041 §5)"* sentence — it is correct and
  now load-bearing.
- **`:97`** — same substitution in step 1.
- Add one sentence to the loop's opening report: when **more than one** sprint is active, **name the chosen
  board and its `reason=`**, and say the others exist and are not being driven.

⚠️ **This is the file driving the live session.** Edits are wording-only and the driver's copy is already in
context, so the running drive is unaffected. Nothing written may assume a restart.

### Step 11 — both READMEs
- `ai-agents/README.md:9` and `claude/scaffold/ai-agents/README.md:8` — extend the `sprints/` cell: the four
  sprint statuses carried by a **line-3 banner**; `sprints/done/` holds `Done` plans and `sprints/cancelled/`
  holds `Cancelled` ones; plans move there **only** via `/fkit-sprint-done` / `/fkit-sprint-cancelled`; link
  the page (live copy links it relatively; scaffold copy names it — it resolves in a consuming project's
  tree, so a link is safe there too).
- **The migration sentence: settled by owner ruling §H below — write it as a CONSEQUENCE, not an
  obligation.** These two files are an `audience-adapted` pair — no byte-parity.

### Step 12 — the `fkit-task-brief` re-read
`claude/skills/fkit-task-brief/SKILL.md`. Result of the re-read: **step 1 needs nothing.** One phrase at
`:311`, inside step 8's fenced Backlog-board template: *"which is never eligible as **the** active sprint"* ->
*"**an** active sprint"*. The Backlog-board reasoning itself is correct and unchanged. **Recommend doing
it** — it is one word inside a template that ships into every new project's backlog board.

### Step 13 — refresh the mirror
`bash claude/fkit-claude-init.sh .` — required after any `claude/` edit, or canonical and `.claude/`
diverge. Never edit `.claude/` directly.

---

## E. Verification

Run in this order:

1. `npm run test:unit` — expect **963 -> 963** passing (`EXPECTED_ROWS` bumped in step 7 keeps
   `structure-check` green; nothing else should move). **Not `npm test`** — that chains
   `test/prove-red.sh`, ~9 min / 34 mutations. Run the full `npm test` **once**, at the end, before
   hand-off.
2. Targeted, after the scaffold work: `node --test test/dual-home-parity.test.js test/structure-check.test.js
   test/structure-manifest.test.js test/structure-spec.test.js test/reference-integrity.test.js`.
3. `reference-integrity` — expect **22/22**, `0 broken`, **named-exempt still exactly 7** (`:451` pins it).
   File count rises 904 -> 905; **not** pinned.
4. `coordination-citation-policy` **21/21** — unaffected (`knowledge-base/**` is not scanned, scoping
   decision 1).
5. `skill-frontmatter` — `EXPECTED_SKILLS = 28` unchanged; it also validates the **7 agents' frontmatter**,
   which the step-9 `initialPrompt:` edit touches. Must stay green.
6. `rules-block-budget` **3/3** — untouched by design (measures the emitted CLAUDE.md block only). No
   re-measure needed.
7. The brief's own greps:
   - `grep -rn -i "current sprint\|active sprint" claude/agents/fkit-lead.md` -> >=1 hit, links the page,
     names the selector, says plural
   - `grep -n "find the active one" claude/agents/fkit-producer.md` -> **0 hits**
   - `grep -rn -i "highest" <the six files>` -> no line states the highest-N rule
8. `bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` after step 13 -> still
   `board file="sprint-8.md" … reason="lowest-ordered"`, exit 0.
9. **Brief step 6 (two-In-progress dry run) is not runnable as written** — see §G.

## F. Risks and non-obvious failure modes

- **R1 — the scaffold-drag is the likely redder.** Miss any one of steps 3-7 and `dual-home-parity`,
  `structure-check`, `structure-spec` or `structure-manifest` reds. They must land in the **same** change as
  the new file, not after.
- **R2 — the producer's `initialPrompt:` is a YAML folded scalar.** A wrong-indented line, a blank
  line, or a `word:` token at line start silently terminates the block; `skill-frontmatter.test.js` exists
  because exactly this failure once went unnoticed. Keep the two-space continuation indent, no blank lines,
  no colons at token start.
- **R3 — `generate:manifest` must run after the last `claude/scaffold/` byte changes**, not before. It is
  append-only history; a stale run leaves `structure-manifest.test.js` red.
- **R4 — link direction.** The live page's ADR links must resolve (`reference-integrity` scans
  `ai-agents/**`); the scaffold page must carry **none** (unscanned here, but they would ship broken to
  consumers — the whole reason the exception kind exists).
- **R5 — the review ledger.** `0339`'s `review.md` sits under `tasks/backlog/` and **is scanned and is not
  exempt** by `coordination-citation-policy`. Cite coordination documents there by **quoted fragment, never
  by line number** — this cost a 9-minute gate run earlier today.
- **R6 — don't restate the movers' step order.** Handled by omission (step 1 item 5). The task movers and
  the sprint movers have *opposite* order and a driver has already relayed this inverted once in this
  project.
- **R7 — `EXPECTED_ROWS` is a deliberate-bump constant.** Its own message says *"update EXPECTED_ROWS
  deliberately with it."* 49->50 is one row (one Table B file entry). If it needs 51, something unintended
  was added.

## G. Brief verification step 6 is not runnable — substitute

Step 6 asks for a live `fkit lead` dry run against *"a fixture with two In-progress sprints"*. **No such
fixture exists**, this repo has exactly one active sprint, and a Build worker cannot open an interactive
`fkit lead` session. Substitute, which tests the same property deterministically: build a throwaway
`sprints/` tree **under the scratchpad, never in the repo**, holding a copy of `sprint-8.md` plus a second
minimal plan whose line 3 carries an `In progress` banner dated later, then run
`bash claude/skills/fkit-status/dashboard.sh select-active <that dir>`.

Expect **two `active` lines** and **exactly one `board` line** naming `sprint-8.md` with
`reason="lowest-ordered"` — the fact the new lead/producer/ship-loop prose tells the reader to trust. The
owner can still do the interactive run afterwards; it is a confirmation, not the gate.

---

## H. Owner rulings — given live via `AskUserQuestion`, `fkit lead` session, 2026-09-12

These are part of the approved plan. Where a ruling and the plan body disagree, **the ruling wins.**

| Id | Question | Ruling (option label, verbatim) |
|---|---|---|
| **§C** | Scope — how is the new convention page homed? | **"Dual-home, audience-adapted (Rec)"** — Option A. **17 files.** Live-only and byte-identical are both rejected. |
| **§H** | The README's upgrade sentence, which no ADR sources | **"Write it as a consequence (Rec)"** — Option A. Write one sentence, sourced from ADR-047 §2's *"Never silently In progress"*: *"A plan with no line-3 banner resolves to `unresolved` and is never reported as active — add a banner to your open plans after upgrading."* **Do NOT write "must add a banner"** — that is an obligation no ADR carries, and the scaffold copy ships it to every consuming project. |

**Plan gate:** approved 2026-09-12 via `AskUserQuestion`, option label verbatim **"Approve — build it
(Rec)"**, against a presentation that named the doubled scope, both wrong brief claims, and the unrunnable
verification step. The gate on this orchestrated path is **prose-enforced, not a structural write-wall**
(ADR-031 honesty clause / ADR-032 D7) — stated to the owner at the moment of approval.

**No other decision is pending.** Steps 1-13 may all proceed.
