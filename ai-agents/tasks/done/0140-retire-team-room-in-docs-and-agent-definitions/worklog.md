# Worklog — 0140 Retire "team room" in the docs and agent definitions

- **Task file:** `ai-agents/tasks/done/0140-retire-team-room-in-docs-and-agent-definitions/brief.md`
- **Plan:** `plan.md` (same folder) — approved by the owner 2026-07-25 at the ship-loop plan gate.
- **Loop:** `/fkit-task-ship-loop`, coder session. **0139 landed and closed first**, so the "menu 1"
  claims are true as written.

## Owner-decision log

| When | Question / choice | Owner's answer |
|---|---|---|
| Before this task | Should 0140 also drop the menu-only `team` / `team room` picks, as the reviewer recommended after 0139 closed? | **Yes** — "Ship 0140 + drop the menu aliases". A **new** decision on top of 0139, not a reopening of it. |
| Plan gate | Approve the plan, including the dual-home convention file the brief said did not exist? | **Approved as planned** — the three brief corrections plus the alias removal. |
| Review R2 | My `(the conductor)` label asserts a capability the row's *Does* cell omits. Complete the cell / neutral label / accept as residual? | **Complete the *Does* cell** — a claim change, owner-sanctioned. |
| Review R3 | The rename left degenerate cells, and they still carry the "does no work itself" claim ADR-031 falsified. Fix both here / wording only / follow-up task? | **Fix both, here** — a sanctioned scope addition, like the menu aliases. |
| Review (flag) | 0139's ledger routed launcher alias-coverage to a follow-up task that was never filed. File it / drop it / owner files later? | **Route it to the producer** with 0140's close. |

**Reviewer's routing advice deliberately not followed, and why.** After 0139 closed, the reviewer
recommended the alias removal be *"a separate small task"* rather than folded into 0140, on the
grounds that 0140 is a docs task and a behavioral change muddies its verification. **The owner had
already ruled the opposite at the plan gate**, so the owner's ruling governs. The cost the reviewer
named is real and is accepted: this task now mixes a rename with a behavior change, and its
verification carries both.

## Findings against the brief — reported, not silently corrected

The brief instructs that a path or line number which does not match is *"a finding to report, not a
number to quietly correct"*. Three did not match:

1. **"No ADR-027 dual-home surface" is WRONG.**
   `knowledge-base/conventions/task-owner-vocabulary.md:19` carried the phrase, and the file lives in
   **both** homes — `ai-agents/knowledge-base/conventions/` and
   `claude/scaffold/ai-agents/knowledge-base/conventions/` — byte-identical at 3224 bytes.
   `dual-home-parity.md:41` rules `knowledge-base/conventions/*.md` **"fkit-authored ✅ must match"**.
   Edited in **both** homes; parity re-proved by `diff` after the edit.
2. **The inventory missed three live sites:** `claude/skills/fkit-team/SKILL.md:51` (the brief lists
   only `:20`), `ai-agents/knowledge-base/architecture.md:17` (lists only `:105`), and the convention
   file above (absent entirely). All three edited.
3. **A third dated report carries the phrase:** `reports/2026-07-11-doc-drift-audit.md:19,27,62`. The
   brief names only two reports as untouchable history; the same reasoning applies. **Left untouched.**

## Work

### Files changed

| File | Sites | Nature |
|---|---|---|
| `claude/agents/fkit-lead.md` | `:4`, `:12`, `:22-23` | **system prompt** — description, greeting, body. `:4` also dropped "menu option 7" |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | `:13` | dropped "(menu 7)" |
| `ai-agents/knowledge-base/architecture.md` | `:17`, `:105` | rename; `:105` also dropped "menu 7" |
| `claude/README.md` | `:103` | rename |
| `claude/skills/fkit-team/SKILL.md` | `:20`, `:51` | rename (`:51` was an inventory miss) |
| `claude/scaffold/CLAUDE.md` | `:37` | rename |
| `README.md` | `:4`, `:45` | rename |
| `CLAUDE.md` | `:8` | rename |
| `AGENTS.md` | `:9` | rename |
| `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` | `:19` | rename — **dual-home pair** |
| `claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` | `:19` | rename — **the other home, identical edit** |
| `claude/fkit-claude.sh` | `:477`, `:182-188` | **behavioral** — menu arm `1\|lead\|team\|"team room")` → `1\|lead)`, re-padded to the column the other arms use; the ⚠️ comment rewritten |
| `test/launcher-contract.test.js` | `:138-139` | comment only — it **quoted** the launcher's old "team room is the safe default" wording, which 0139 had already changed, so the quotation was stale |

**The menu-number citations were reworded, not renumbered** — `"the first entry in the `fkit` menu"`,
or the number simply dropped — so they cannot go stale the next time the menu moves. That is the point
of the convention 0137 records; a citation that cannot rot beats one that is merely right today.

### Not touched — deliberately

`decisions/adr-010-…:26,66,100` (task **0143**, architect-owned) · `decisions/adr-012-…:61` ·
`decisions/adr-031-…:7` — **a verbatim quotation of ADR-010**; rewriting it would misquote the source ·
all three dated reports · `ai-agents/sprints/**` prose and the sprint-review ledger ·
`ai-agents/wiki-vault/` (**0141**, wiki-role-only).

## Verification — run after the final code change

1. **`npm test` → 521 tests / 521 pass / 0 fail / 17 suites**, and **`prove-red.sh` → `✓ hard gate
   PASSED`**. **No test required editing.** *(The one test-file edit was a stale comment, not an
   assertion — the brief's stop-condition is about assertions and did not fire.)*
2. **`bash -n` + `sh -n`** on the launcher, **`node --check`** on the edited test file — all OK.
3. **`team room` sweep** (`*.md`/`*.sh`/`*.js`, excluding `node_modules`, `.claude/`, `ai-agents/tasks/`,
   `ai-agents/sprints/`) — survivors are **exactly** the intended set: ADR-010 (×3), ADR-012, ADR-031
   (the quotation), the three dated reports, the two wiki-vault pages (0141), **and the launcher's own
   ⚠️ comment**, which names the retired words in order to say they are not accepted. Nothing else.
4. **`menu 7` sweep** — survivors are only ADR-010 and the two dated design reports. All three live
   citations are gone.
5. **Dual-home parity:** `diff` of the two `task-owner-vocabulary.md` homes → **identical**.
6. **`claude/agents/fkit-lead.md` frontmatter** — parsed with a hand-rolled reader (ADR-014, zero
   devDeps): all four keys (`name`, `description`, `color`, `initialPrompt`) present; the description
   resolves to the real text, **not** an H1 fallback.
   > **One nuance, stated rather than glossed.** A crude `": "` scan flags the description — but every
   > hit is **pre-existing** (`"Two capabilities in one agent: it"`) and **safe**, because the field is
   > a `>-` **folded block scalar**, where a colon is literal. The brief calls it "a plain scalar";
   > that is imprecise — a block scalar is exactly what task 0136 exists to convert *to*. **My edits
   > introduced no new colon**, confirmed by reading the diff.
7. **Launcher under a real pty** (stubbed `claude`, throwaway project): **17/17 checks passed.**
   - `team` → **REJECTED**, `? "team" is not one of 1-7.`, no exec
   - `team room` → **REJECTED**, no exec
   - picks `1`–`7` → lead / producer / coder / architect / reviewer / adversarial-reviewer / wiki
   - `lead`, `producer`, `wiki`, `adv` still work as words; `9` → the error, and the menu keeps asking
   - rendered menu and lead banner contain no "team room"
8. **Every edited sentence still asserts what it asserted before** — read back per file. This was a
   rename plus two number-citation removals, not a rewrite.

### ⚠️ Brief verification step 5 — how it was checked, and how it was not

The brief asks: *"Open a `fkit lead` session and confirm the greeting no longer says 'team room' and
does not tell the owner they picked option 7."* **I did not open a live model session** — that costs a
real `claude` invocation and its output is not deterministic. What I verified instead: the launcher
execs `--agent fkit-lead` for pick `1` and for `fkit lead` (pty run above), and the greeting **source**
— `initialPrompt` at `fkit-lead.md:12` and the body at `:22-23` — no longer contains "team room" or any
menu number. **The rendered greeting itself is unverified**, and that is a real gap, not a formality:
the text is an instruction to a model, not a literal string it must echo.

## Review — round 1, and the four fixes it produced

Ledger: `review.md` (same folder). **Reviewers: both** — fkit-reviewer's own pass **and** the Codex
adversarial pass (`codex-cli 0.145.0`, `--sandbox read-only`, exit 0). **Coverage complete, no
degradation flag.** Verdict line: *"⚠️ Changes requested — 4 defects (none blocking)"*.

All four **CORRECT**, all four fixed. Two were mine to fix under the loop's own discipline; two were
owner rulings because they crossed the rename-vs-claim line the brief drew.

| # | What | Disposition |
|---|---|---|
| R1 | My new ⚠️ launcher comment claimed 0140 *"retired the name project-wide"* — **false**, the task deliberately leaves the label in ADR-010, ADR-012, ADR-031's quotation, three dated reports and two vault pages. A new false claim, in the task whose whole discipline is "never change a claim". | **Fixed** — scoped to "the launcher and the live docs", with the surviving-by-design sites named in the comment. |
| R2 | `(the conductor)` asserted a capability the row's *Does* cell omitted and `:51` contradicted. | **Owner ruled: complete the cell.** Now consistent with `:51` and ADR-031. |
| R3 | The rename left cells restating their own key, still carrying the "does no work itself" claim ADR-031 falsified. | **Owner ruled: fix both, here.** `README.md:45` + **both homes** of the convention file. |
| R4 | `1\|lead)` aligned `role=` at column 31 against the siblings' 30 — **and this worklog claimed it had been re-padded.** | **Fixed**, measured with `awk`, not eyeballed. |

**On R3's claim half:** ADR-031 §79 *itself* states that any doc asserting lead "does no work itself"
*"goes stale and must be corrected"*. Correcting it executes ADR-031 rather than freelancing — but it
is still a claim change, which is why it went to the owner first.

**Codex's one finding — suppressed as settled** by the reviewer: no test pins the alias rejection.
Accurate about the code, but it matches 0139's accepted residual whose re-raise condition ("the gap
hides a demonstrable defect") is unmet. It is now **resolved by routing**, not left dangling — see the
follow-up below.

**Two reviewer checks stronger than mine, acknowledged:** it parsed `fkit-lead.md` with a **real YAML
parser** where I used a hand-rolled scan, and it independently **disproved** a `.claude/`-staleness
concern I never raised (init re-copies on every launch, so the copies self-heal).

**What the reviewer found that no brief had:** 0139's ledger routed the launcher alias-coverage to
*"a separately named follow-up task"* — **which was never filed.** 0141/0142/0143 are all other work.
Owner ruled it goes to the producer with this close.

## Final verification — after the last edit

- **`npm test` → 521 tests / 521 pass / 0 fail / 17 suites**; **`prove-red.sh` → `✓ hard gate PASSED`**.
- `bash -n` + `sh -n` on the launcher — OK.
- Launcher under a real pty — all checks pass: `team` / `team room` **REJECTED** (`is not one of
  1-7`, no exec); picks 1–7 correct; word aliases `lead` / `producer` / `wiki` / `adv` still work.
- **Dual-home parity re-proved** after the R3 edit: `diff` → identical.
- Post-fix sweep for `does no work itself|does not itself do the work`: **zero live docs**. Survivors
  are ADR-031:79 (which predicts the staleness), the dated 2026-07-22 report, and `PROJECT.md:42`,
  which describes it correctly as the *old* stance being reversed — accurate, left alone.
- All seven menu case arms align `role=` at column 30 (`awk`-measured).

## Residuals / flags for the owner

1. **`sprints/sprint-2.md:147`** — the board row for the closed 0139 — still asserts *"word aliases
   `team`/`team room` are kept"*. **This task makes that false.** It is a producer-owned row on a
   closed task, so it was not edited. **Needs the producer.**
2. ~~**`README.md:45` still says the lead "does no work itself"** — left as-is under the rename-only
   rule.~~ **RESOLVED — struck 2026-07-25.** Review finding R3 raised it; the owner authorized the
   claim fix inside this task. `README.md:45` and **both homes** of `task-owner-vocabulary.md:19` are
   corrected. The same stale claim survives in ADR-010:26 (**0143**'s scope) and in the wiki
   (**0141**'s) — both still out of scope here.
3. **`architecture.md:180`** renders the menu as `(1-7 …)` — range unchanged, **confirmed correct,
   left alone** as the brief instructs. But the same diagram cites launcher line ranges (`:311-345`,
   `:357`) that no longer match the file after 0139. **Stale line citations, out of this task's scope,
   reported.**
4. **The rendered lead greeting is unverified** (above).

## Close-out evidence packet

**Review closed out.** Round 2 produced **zero** new findings; ledger `Status: closed-out`, verdict
**"✅ Ready to merge"**. Codex ran in round 1 (`codex-cli 0.145.0`, exit 0) — **full model-diverse
coverage over the whole diff**. Round 2 was a delta verification of four already-dispositioned fixes,
declared as such, not a skipped reviewer.

### The brief's verification steps, walked and ticked — including where they do not literally hold

| # | Criterion | Result |
|---|---|---|
| 1 | `team room` grep returns **only** ADR-010, two dated reports, the `launcher-contract.test.js` comment, two wiki pages, and briefs 0139/0140/0141 | ⚠️ **Met in substance; the brief's expected-survivor list was itself incomplete.** Actual survivors: ADR-010 (×3), **ADR-012:61**, **ADR-031:7** (a verbatim quotation of ADR-010), **three** dated reports (the brief named two), the two wiki pages (0141), `ai-agents/sprints/**` prose and one sprint-review ledger, and **the launcher's own ⚠️ comment** which names the words in order to reject them. Every one is deliberate. **The `launcher-contract.test.js` comment is NOT a survivor — I edited it**, because it *quoted* the launcher's old wording, which 0139 had already changed, making the quotation stale. |
| 2 | `menu option 7\|menu 7` grep returns only the untouched ADR and reports | ⚠️ **Met for live files** — all three live citations are gone. Additional survivors are `ai-agents/sprints/**` planning prose, which the brief's exclusion list did not cover. Deliberate. |
| 3 | `npm test` green — 521 tests + the `prove-red.sh` hard gate | ✅ **Met.** 521/521, 0 fail, hard gate passed; re-run after every code change. **No test assertion required editing** — the one test-file edit was a stale comment. |
| 4 | `fkit-lead.md` frontmatter still parses; the description is real text, not the H1 fallback | ✅ **Met.** Verified by me with a hand-rolled reader and **independently by the reviewer with a real YAML parser** (4 keys; a 562-char description). Note the file has **no H1 at all** — the reviewer confirmed that is the repo norm for `claude/agents/*`, so a silent fallback would have produced an empty description, not a wrong one. |
| 5 | Open a `fkit lead` session and confirm the greeting says neither "team room" nor "option 7" | ⚠️ **NOT done as written.** I did not open a live model session — see the gap note above. Verified instead: the greeting **source** (`initialPrompt:12`, body `:22-23`) carries neither string, the launcher execs `--agent fkit-lead`, and init re-copies the agent file on every launch so a live session would load the new text. The reviewer judged the residual acceptable and **not reducible by one manual run**, since the greeting is model-generated from an instruction. |
| 6 | Every edited sentence still asserts what it asserted before | ⚠️ **Met except where the owner sanctioned otherwise.** The rename itself changed no claim. **Two deliberate exceptions, both owner-ruled after review findings R2/R3:** `fkit-team/SKILL.md:20`'s *Does* cell now mentions driving, and `README.md:45` + both convention homes drop the "does no work itself" claim ADR-031 falsified. Both move **toward** ADR-031, which itself says such docs *"must be corrected"*. |

### Change surface

`claude/agents/fkit-lead.md` (**system prompt**) · `claude/skills/fkit-sprint-ship-loop/SKILL.md` ·
`claude/skills/fkit-team/SKILL.md` · `claude/README.md` · `claude/scaffold/CLAUDE.md` · `README.md` ·
`CLAUDE.md` · `AGENTS.md` · `ai-agents/knowledge-base/architecture.md` ·
`ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` **+ its scaffold twin** (parity
re-proved: `diff` clean **and** md5 `3be7cf3af05d410a91d49189cce74af0` on both) ·
`claude/fkit-claude.sh` (menu arm + comment) · `test/launcher-contract.test.js` (comment only) ·
this task folder's `plan.md` / `worklog.md` / `review.md` · the 0140 status cell in `sprint-2.md`.

## Recommended follow-up tasks — *named only; I file no briefs*

- **Launcher-contract coverage for the retired words** — now more valuable than when it was named
  during 0139: it should pin `team` / `team room` as **rejected at the menu as well as on the command
  line**. Those negative assertions are the only mechanical guard against the words being re-added.
  Needs a pty; the existing harness is headless-only.
- **0141** (wiki resync) is now unblocked by this task.

## Commit state

**Nothing committed, nothing staged.** All edits left in the working tree for the owner.
