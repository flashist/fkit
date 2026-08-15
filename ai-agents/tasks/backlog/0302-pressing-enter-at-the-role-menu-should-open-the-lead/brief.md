# Pressing Enter at the role menu should open the lead

## ID
0302

## Sprint
Sprint 6

## Priority
Sprint 6 P8

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### What the owner wants, in one sentence

**Press Enter at the `fkit` role menu with no input, and the lead session opens.** Today it silently
re-prompts. The owner wants to continue work without typing a digit.

### Provenance

**Owner request, 2026-08-14**, made live in a `fkit lead` session driving `/fkit-sprint-ship-loop`,
after updating to `v0.2.2` and running `fkit` in a **real consuming project** (`geoconflict`). The
menu they were looking at is the one this task changes.

**Owner ruling, 2026-08-14**, same session and channel — **the option label is the verbatim text**:
**"Three separate briefs (Recommended)"**. ⛔ **This task was explicitly NOT bundled with
[`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)**,
which came out of the same session. The owner's stated reason: **this one is trivial and shippable
immediately, `0303` needs design, and bundling would gate the one-liner behind the hard one.**
⛔ Do not re-merge them.

**Owner ruling, 2026-08-14**, same session and channel — **"Backlog, unranked — rank later
(Recommended)"**. This row is unranked and belongs to no sprint. ⚠️ **There is no active sprint**:
[`0294`](../../done/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/brief.md)
archived Sprint 5 on 2026-08-14 and deliberately opened no successor, and `select-active` returns
`active none` (exit **3**, the documented no-active-sprint code — **not** a failure).

### ⭐⭐ Two further owner rulings, 2026-08-14 — both were OPEN QUESTIONS in this brief and are now CLOSED

**Same session and channel — given live via `AskUserQuestion` in the `fkit lead` session driving
`/fkit-sprint-ship-loop`. The option labels below are the verbatim text.**

**⭐ Ruling A — "Ship 0302 standalone, gap named (Recommended)".** ⛔ **`0145` stays a SOFT dependency
and is NOT to be made a hard one.** `0302` ships the Enter-default **now**, with its **test gap stated
explicitly in the close**; `0145` adds the pinned `Enter` row to the pty suite **later**. This settles
the *"second real decision"* the brief put to the plan gate below — ⛔ **it is no longer a plan-gate
question**, and the option table that raised it is kept only as the record of what was weighed.

**⭐ Ruling B — "Prompt text only (Recommended)".** ⛔ **This CLOSES this brief's `⬜ Open question`.**
The change is the **prompt text alone** — e.g. `role [1-7, Enter=lead, q to quit]:`. ⛔ **Do NOT also
mark the default in the menu list**: the owner was offered `1) lead  (default)` and **declined it**.
⛔ **It is no longer a plan-gate question — it is ruled.** ⚠️ **The reasoning the owner accepted,
recorded so it is not re-argued:** the menu **already lists lead as option 1 with its description**,
and **opening a lead session is cheap and non-destructive**.

⚠️ **Both rulings are recorded here, and again at the point in the brief where each question was
originally raised.** ⛔ Do not re-open either at the plan gate.

### The code, re-verified on disk 2026-08-14

⚠️ **Anchor on the quoted text, not the line numbers** — they will move.

The interactive menu's read loop sits in `claude/fkit-claude.sh`. Its prompt line reads:

> `printf '  role [1-7, q to quit]: '`

and its `case` carries an explicit empty-input arm:

> `"")                    : ;;`

— a deliberate no-op that falls back to the top of the `while [ -z "$role" ]` loop and re-prompts.
That arm is what changes. The prompt text changes with it, to signal the default.

Two neighbours that **must keep working**:

- **`q` still quits.** The `q|Q|quit|exit)` arm calls `echo; exit 0`.
- **An unrecognised token is still an error, not a fall-through.** The `*)` arm prints
  `? "%s" is not one of 1-7.` and re-prompts. The launcher's header comment records **why** — a first
  argument that is not a role *"used to fall through to `claude` unrecognized, which meant
  `fkit --resume` resumed ANY session under the LEAD's lockdown — the role lock bypassed by
  accident."* ⛔ **That is the exact failure class this task must not reintroduce**: "empty input
  means lead" must **not** widen into "anything unmatched means lead."

### ⭐ The strongest argument for the change, which the request did not mention — verify it and use it

**The launcher ALREADY defaults to the lead.** At the bottom of the same file, past the menu block:

> `# No role and no tty (piped / CI) → lead is the safe default.`
> `[ -n "$role" ] || role="lead"`

So `fkit` with no args in a **headless** context already opens the lead. The interactive menu is the
**only** path that does not. ⭐ **This change does not invent a default — it makes the interactive
path agree with the headless one that has shipped for some time.** Say so in the plan; it is the
cheapest justification available and it reframes the risk below.

### ✅ RULED 2026-08-14 — "Prompt text only (Recommended)". This question is CLOSED.

**An accidental Enter now opens a session instead of re-prompting.** Today an empty line is free;
after this change it commits you to a lead session (exit and re-run to recover — cheap, but not
free).

⭐ **The owner has now ruled — verbatim label "Prompt text only (Recommended)", 2026-08-14, live via
`AskUserQuestion`.** ⛔ **The change is the prompt text alone**, e.g. `role [1-7, Enter=lead, q to
quit]:`. ⛔ **Do NOT also mark the default in the menu list** — the owner was offered
`1) lead  (default)` and **declined it**. ⚠️ **The accepted reasoning:** the menu already lists lead as
option 1 with its description, and opening a lead session is cheap and non-destructive.

⛔ **This is no longer a plan-gate question.** The table below is retained **only as the record of what
was weighed** — ⛔ do not re-put it to the owner:

| Option | What it costs |
|---|---|
| ✅ **CHOSEN — bare default, prompt text only** (e.g. `role [1-7, Enter=lead, q to quit]`) | Cheapest, matches the headless default, one visible signal |
| ⛔ Rejected — louder signal, e.g. a line above the prompt naming the default, or `1) lead  (default)` in the menu list | More screen noise on every launch, for a recoverable mistake |
| ⛔ Rejected — confirm-on-Enter (`lead? [Y/n]`) | Defeats the point — the owner asked to **avoid** typing |

⛔ **Do NOT raise this at the plan gate — it is ruled** (2026-08-14, "Prompt text only
(Recommended)"). The `case` arm is the same in every option; only the prompt wording differs, and the
wording is now settled.

### ⚠️⚠️ The verification problem — read this BEFORE planning, it is why this is not a one-liner

**The interactive menu has no automated coverage today, and the obvious way to add it does not
work.** Established by reading the launcher and the whole `test/` tree on 2026-08-14; ⚠️ **the coder
must confirm it empirically before choosing a test approach — do not take this brief's word for it.**

Three facts that compound:

1. **The menu reads from fd 3, not stdin.** The block opens with
   `if [ -t 0 ]; then exec 3<&0; else exec 3</dev/tty; fi`, and the loop reads `read -r pick <&3`.
   When stdin is a **pipe** (`[ -t 0 ]` false) it reads from **`/dev/tty`** — so **piping input into
   the launcher does not feed the menu.**
2. **Under a test runner the menu is never entered at all.** Its guard is
   `[ -z "$role" ] && [ "$#" -eq 0 ] && { [ -t 0 ] || ( exec 3</dev/tty ) 2>/dev/null; }`. With no
   controlling terminal both halves fail, the block is skipped, and control reaches the headless lead
   default. `test/launcher-contract.test.js` test **7** (*"no args, no tty, initiated → --agent
   fkit-lead"*) exercises exactly that fall-through — it proves the **headless** default, ⛔ **not the
   menu.**
3. **There is no pty in the suite today.** `grep` over `test/` for a pty, `openpty`, `script`, or
   `/dev/tty` returns **nothing outside comments** — **no test has ever driven the menu.** **ADR-014
   mandates `node --test` with zero devDependencies**, so `node-pty` is not an option.

⚠️ **Also note `test/launcher-contract.test.js`'s own declared scope**, at the top of the file: *"the
black-box process contract only … NOT shell internals."* A menu-behaviour test may not belong there
even if it can be written.

⛔ **Do not paper over this with a test that greps the launcher's source for the new `case` arm.**
A source-text assertion cannot fail for the reason that matters — it passes on a launcher whose menu
is broken. ⚠️ **A green run that could never have failed proves nothing.**

**Precedent that a launcher mutation is expected:** `test/prove-red.sh` already carries **mutation 1**
(breaking `skills_for_role(reviewer)` — note its own comment that the function *"moved to
`skills-for-role.sh` (task 43) — the mutation targets THAT file now"*) and **mutation 2** (restoring
the `--resume` passthrough). ⚠️ **Neither touches the menu**, so this is precedent that launcher
behaviour gets mutation-proved, **not** evidence that the menu is reachable.

### ⭐⭐ But a pty IS reachable — and a task to build it is ALREADY FILED. Read `0145` first.

⚠️ **Found during this filing and recorded so this task does not redo it.** The "no coverage is
possible" reading above is **too pessimistic**, and acting on it would be a mistake.

[`0145-pty-driven-menu-pick-coverage-for-the-launcher`](../0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md)
— **already on this board, `fkit-coder`, `🔲 Backlog`** — is titled *"Give the launcher-contract suite
a pty, and pin the menu picks 1-7"* and exists **precisely** to close this gap. It specifies:

- **A pty-capable helper in `test/harness.mjs`** — *"a sibling to `runFkit`, not a modification of
  it"* — that runs the launcher under a **real controlling terminal**, feeds it a menu pick, and
  returns the shape the existing tests already assert on.
- ⭐ **Prior art proving it works:** a throwaway script using **`script -q /dev/null`** plus the
  harness's stubbed `claude` on `PATH` *"drove the menu successfully by hand during 0139/0140."*
  ⚠️ **`script(1)`'s macOS/Linux flag differences are a stated portability risk in `0145`, not a
  blocker** — and `0145` already rules that if it bites, you **stop and report** with the options,
  and ⛔ *"do not silently skip the tests on the platform where they fail."*
- **An assertion table** for picks `1`–`7` plus the `team` / `team room` rejections.

**⚠️ Two traps `0145` records, which cost real time during `0139` — they apply directly here:**

1. **Input piped immediately arrives BEFORE the launcher opens `/dev/tty`.** Every read hits EOF and
   the launcher exits **0 without exec-ing** — ⛔ **indistinguishable from "the pick is broken."** A
   naive test passes or fails for the wrong reason. The helper must **distinguish "menu never got the
   input" from "menu rejected the input."** ⚠️ **This trap is sharper for THIS task than for `0145`**:
   an empty line is exactly what EOF looks like, so a broken harness and a working Enter-default
   produce the **same** observation. ⛔ **Get this wrong and you will "prove" the feature works when
   nothing was tested.**
2. **The stub records `--agent fkit-<role>`, not a path to an agent file.** Assert the flag value.

**✅ RULED 2026-08-14 — "Ship 0302 standalone, gap named (Recommended)". CLOSED, not a plan-gate
decision.** The table is retained as the record of what was weighed:

| Option | Tradeoff |
|---|---|
| ⛔ Rejected — wait for `0145`, ship `0302` after it | Cleanest; the test is then nearly free — ⛔ but it **gates the owner's one-line ask behind an infrastructure task**, which is the exact shape the owner rejected when they refused to bundle this with `0303` |
| ⛔ Rejected — build the pty helper here | Duplicates `0145`'s deliverable and would collide with it |
| ✅ **CHOSEN — ship `0302` now with the gap named; `0145` adds the `Enter` row later** | Honest and unblocking; the owner gets their one-liner, and the coverage lands with the task already filed to carry it |

⛔ **The consequence is binding, not advisory: `0145` stays a SOFT dependency and MUST NOT be recorded
as a hard one**, and ⛔ **the test gap must be stated explicitly in the close** — that statement is the
price the owner accepted for shipping early. ⚠️ **A close that omits it has not honoured the ruling.**

⛔ **Whichever is chosen, `0145` must gain an `Enter` row in its assertion table**, since after this
change the menu has an eighth input worth pinning. ⚠️ **`0145` also has an item C that updates
`ai-agents/knowledge-base/architecture.md`'s recorded acceptance that the menu edge stays manual** —
⛔ **do not edit that line from this task**; it is `0145`'s, and touching it here creates the stale-
citation class this repo has a name for.

## What to build

**One change to `claude/fkit-claude.sh`, plus whatever coverage the plan gate settles.**

1. **The empty-input `case` arm** — currently the `""` no-op — resolves the role to `lead` instead of
   re-prompting.
2. **The prompt string** gains a signal for the default — ✅ **and the shape is RULED, not open**
   (2026-08-14, **"Prompt text only (Recommended)"**): **the prompt text alone**, e.g.
   `role [1-7, Enter=lead, q to quit]:`. ⛔ **Do NOT also mark the default in the menu list** —
   `1) lead  (default)` was offered and **declined**. ⚠️ **Check whether anything else asserts the old
   prompt text** before editing — `grep` for it across `test/`, `claude/`, and the docs.
3. **Coverage**, per the verification-problem section: the best genuinely-failing test reachable under
   ADR-014, **or** an explicit statement that none is, with the gap named. ⛔ Not a source-grep
   stand-in presented as behavioural coverage. ✅ **The owner has already accepted the second branch**
   (2026-08-14, **"Ship 0302 standalone, gap named (Recommended)"**) — ⛔ **so if no test is reachable,
   naming the gap in the close is the sanctioned outcome, NOT a reason to wait for `0145`.**

⚠️ **Check for doc drift in the same change.** The `1-7` prompt and the menu's shape may be described
elsewhere — `README.md`, `claude/scaffold/`, the `fkit-team` skill, the launcher's own header block.
`grep` for `role [1-7` and for the menu description; fix any copy this change falsifies, **in this
change**. ⚠️ **`grep claude/`, never `.claude/`** — the `.claude/` mirror is gitignored and refreshed
by `claude/fkit-claude-init.sh`, so a stale hit there is not a defect.

## Verification steps

1. **Reproduce the current behaviour first.** In a real terminal, run `fkit` in a throwaway project,
   press **Enter**, and observe that it re-prompts. ⚠️ **If you cannot reproduce it, stop and report**
   — do not change behaviour you could not observe.

2. **The new behaviour, in a real terminal:** `fkit`, press **Enter** → a **lead** session opens.
   Quote the observed prompt line and what happened.

3. **The two neighbours still hold, in the same real-terminal run:**
   - `q` at the prompt exits **0** and launches nothing.
   - A junk token (e.g. `zzz`) still prints `? "zzz" is not one of 1-7.` and re-prompts. ⛔ It must
     **not** open the lead — that is the regression this task most plausibly causes.

4. **The pre-existing headless default is untouched:** `npm test` green, and specifically
   `test/launcher-contract.test.js` test 7 (*no args, no tty, initiated → `--agent fkit-lead`*) and
   test 3 (*unknown first arg → non-zero, and claude was NEVER exec'd*) both still pass. ⚠️ **Name
   these two tests by name in the close** — they are the ones that pin the guard this change sits next
   to.

5. **Red-prove whatever test you add.** Revert the `case` arm, show the new test **fails**, restore,
   show green. ⚠️ **If the test is pty-driven, red-prove the HARNESS too** — per `0145`'s trap 1, feed
   it deliberately-lost input and confirm the suite reports *"the menu never got the input"* rather
   than a rejection. ⛔ **Without that, a green Enter test is indistinguishable from an EOF exit.**
   ⛔ **If, after reading `0145`, no test was reachable, say so explicitly** — state what was
   attempted, why, and what is therefore unproven. **Do not report a source-grep assertion as if it
   were behavioural coverage.**

6. **`git diff --stat` scope.** Expect `claude/fkit-claude.sh`, plus any test file and any doc the
   change falsifies. ⛔ **No edit to `claude/skills/`, `claude/agents/`, or `bin/`** — none of them is
   in scope here.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing

⚠️ **Independent of `0303` and `0304` by owner ruling** — see *Provenance*. All three came out of the
same session and the same launch, and the owner **explicitly rejected** folding this one in with
`0303`. It can be planned, built, reviewed and closed on its own, with nothing else landed first.
⛔ **Do not re-bundle it, and do not wait on `0303`'s design.**

⭐ **Soft-follows [`0145`](../0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md) — a
SOFT dependency, deliberately NOT recorded as a hard one — ✅ and now OWNER-CONFIRMED.** `0145` builds
the pty helper this task's test needs (see `## Context`). ⛔ **It is not declared under `Depends on:`
on purpose**: making it hard would gate the owner's one-line ask behind an infrastructure task, which
is precisely the shape the owner rejected when they refused to bundle this with `0303`.

⭐ **Owner ruling, 2026-08-14, verbatim label "Ship 0302 standalone, gap named (Recommended)"** — given
live via `AskUserQuestion`, and it **confirms the soft reading**: ⛔ **`0145` MUST NOT be promoted to a
hard `Depends on:`**, `0302` ships now, and ⛔ **the test gap is stated explicitly in the close**.
⚠️ **A close that omits the gap statement has not honoured the ruling** — that statement is the price
the owner accepted for shipping ahead of the coverage.

⚠️ **But the plan MUST still read `0145` first** — the "no coverage is possible" reading is wrong, and
`0145` records both the working approach (`script -q /dev/null`) and the two traps that produce false
results.

⚠️ **Two-way obligation with `0145`, recorded so neither task is surprised:** after this change the
menu has an eighth input, so **`0145`'s assertion table should gain an `Enter` row**. ⛔ And `0145`
owns the `architecture.md` recorded-acceptance update — ⛔ **do not touch that line from here.**

### ✅ Open questions — ALL CLOSED as of 2026-08-14. This brief has no open question.

- **How loudly should the default be signalled?** ✅ **RULED — "Prompt text only (Recommended)"**,
  2026-08-14, live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`.
  **The prompt text alone**, e.g. `role [1-7, Enter=lead, q to quit]:`. ⛔ **Do NOT also mark the
  default in the menu list** — `1) lead  (default)` was offered and **declined**. ⚠️ Accepted
  reasoning: the menu already lists lead as option 1 with its description, and opening a lead session
  is cheap and non-destructive. ⛔ **Do not re-put this at the plan gate.**
- **Wait for `0145`, or ship now with the gap named?** ✅ **RULED — "Ship 0302 standalone, gap named
  (Recommended)"**, same date and channel. Ship now; ⛔ **`0145` stays SOFT**; ⛔ **state the test gap
  explicitly in the close.**

### ⛔ Scope fences

- ⛔ **"Empty means lead" must NOT widen into "anything unmatched means lead."** The launcher's header
  comment records the bug that shape caused — `fkit --resume` resuming **any** session under the
  **lead's** lockdown, the role lock bypassed by accident. The `*)` arm stays a usage error.
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  — filed by a spawned producer with no owner channel; this row is unranked (`—`) and renumbers
  nothing.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  — the vault is `fkit-wiki`'s exclusively. If this change warrants a vault record, it is **routed to
  `fkit-wiki`**, never done here.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, **producer-only**, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent.
- ⛔ **No commit, no push.**

### On the owner role — `fkit-coder`

The deliverable is a source edit to a shell script plus its test coverage, and `fkit-coder` is the
**sole source-write authority**. ⚠️ **Stated plainly: the hard part here is the TESTING, not the
change** — the one-line `case` arm is trivial and the verification may not be reachable at all. That
is still coder work (it is a `test/` and `prove-red.sh` question), **but it is why this task should
not be treated as a five-minute fix**, and why its plan gate carries a real decision.

### ⚠️ State of the tree at filing

Measured 2026-08-14 at filing time: `HEAD` is **`4424b44 "Release v0.2.2"`**, tag **`v0.2.2`** exists,
and `git status --porcelain` returned **0 lines — the tree was clean**. This brief, its two siblings,
and their three board rows are therefore the only uncommitted work introduced by this filing.
(`conventions/evidence-before-assertion.md` — asserted from a check made this turn.)
