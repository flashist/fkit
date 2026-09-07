# Implementation plan — task `0379`

## Baseline

- **HEAD `cf289c2`** ("Sprint push"), measured this turn. The working tree is very large and **almost none of it is mine**: three sweeps' closes (~25 moved task folders), ADR edits, wiki-vault resyncs, new briefs. **My baseline change surface is empty** — I have written nothing. Everything I touch will be listed explicitly below.
- **`test/launcher-contract.test.js` measured green this turn: 40/40 pass, 0 fail**, test 12 included. I did **not** run the full `npm test` or `prove-red.sh` — those get measured at build time, not quoted here.
- If HEAD moves while this is at the plan gate, say so; nothing below depends on the uncommitted tree.

## What I re-verified (the driver told me not to inherit), and where the brief needs correcting

| Claim | Verdict | Evidence |
|---|---|---|
| Fresh branch execs `fkit-producer` with one of two seeds | **Confirmed** | `claude/fkit-claude.sh:588-600` |
| `fkit-initiate-project` is producer-only, hook-enforced | **Confirmed** | `claude/skills-for-role.sh` — the `lead)` arm lists `fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-sprint-ship-loop`; no initiation. |
| The harness can exercise the cold start here | **Confirmed, firsthand** | `test/harness.mjs` `makeProject({fresh:true})` + the `claude` stub recording argv; test 12 passes today. The driver's "cannot be exercised in this repo" worry does **not** survive contact with the harness — the brief was right. |
| `claude/fkit-claude.sh` is covered by the structure manifest, so an edit may force a regeneration | **REFUTED — and this is the one correction that matters** | `claude/structure-manifest.tsv` has **72 rows, all project-relative** (`ai-agents/…`, `CLAUDE.md`, `AGENTS.md`). `grep fkit-claude.sh` returns **nothing**. The launcher lives in the fkit *share*, never installed into a consuming project, so it is not manifest-tracked. **No manifest regeneration is triggered by this edit.** I will still run `test/structure-manifest.test.js` and `test/structure-spec.test.js` to prove it rather than assert it. |
| Dual-home parity covers the launcher | **REFUTED** | `test/dual-home-parity.test.js` compares `ai-agents/` against `claude/scaffold/ai-agents/` only. Neither the launcher nor `claude/agents/*.md` is dual-homed. |
| Adding a prove-red mutation needs new infrastructure | **REFUTED** | `make_claude_copy()` + `run_suite()` already exist (mutations 15/16/17 use them), and `run_suite` runs **all** of `test/*.test.js` under `FKIT_LAUNCHER` — which includes `launcher-contract.test.js`. Mutation 30 is additive; **no count is asserted anywhere**. |

**New finding the brief does not contain:** test 12 runs headless, so `.fkit/interview` exits cleanly without writing `.fkit/intake.md` — meaning **the intake-present seed has never been tested by anything**. Only the no-intake branch is covered today.

**Second new finding:** `role="producer"` at `claude/fkit-claude.sh:590` is **vestigial** — the `exec` on line 599 hard-codes `fkit-producer`, `build_settings producer` and `set_tab_title producer` independently. Five sites carry "producer" in that branch, and the variable is not one that is read.

## Point 3 — every place `role="producer"` propagates in the fresh branch

| Line | Site | Under option A | Under option B / B′ |
|---|---|---|---|
| 562 | section comment *"go straight to the producer's cold start"* | rewrite | extend |
| 589 | `printf` *"…starting the producer to set it up."* | rewrite | extend |
| 590 | `role="producer"` (vestigial — nothing reads it) | `role="lead"` | keep, then `role="lead"` after |
| 593 / 595 | the two seed strings | **both rewritten** (see point 2) | **byte-unchanged** |
| 597 | `settings="$(build_settings producer)"` | `lead` | unchanged, second build for lead |
| 598 | `set_tab_title producer` | `lead` | unchanged, retitled after |
| 599 | `exec claude --agent fkit-producer …` | `fkit-lead` | not an `exec` any more (B′) |

## Point 5 — how I read *"after answering all the questions"*

**I read it as the terminal intake, not the producer's LLM interview** — and the owner's own ordering is what decides it. They said *"it asks you questions. **And then** it starts the producer session."* The producer's interview happens **inside** the producer session, i.e. after it starts. Only `.fkit/interview` asks questions **before** any session exists. So on a plain reading of the sentence, the questions the owner meant are the terminal intake, and the destination they want changed is the session that follows it.

⚠️ **That reading favours option A, and my engineering judgment favours B′. I am telling you they disagree rather than resolving it.** Q1 is the decision.

**The intake questionnaire stays exactly where it is under every option.** Nothing below moves, edits or removes `.fkit/interview`.

## Q1 — the fork (blocking; nothing is written until this is ruled)

### Option A — lead first, producer spawned for the initiation

Launcher runs the intake as now, then execs **lead** with a seed telling it to spawn `@fkit-producer` for the initiation and relay.

- ✅ Honours the literal sentence on my reading. Smallest diff (~6 lines). **Trivially testable** — the argv contract is a one-line change and the amended test 12 cannot pass against the old launcher.
- ⛔ **The cost is real and I could not test it away.** `fkit-initiate-project` is written for a session with the owner present — *"greet the owner"*, *"they can say **skip setup** at any point"*, *"ask conversationally, a few questions at a time"*. Under ADR-021 a spawned producer has **no** `AskUserQuestion`; it must **return** questions for lead to relay. I checked how the existing driver does this: `fkit-sprint-ship-loop` and `claude/agents/fkit-lead.md` both prescribe *"spawn the next unit with the decision folded in"* — a **re-spawn**, not a continued conversation. So each of the initiation's ~3-4 owner-contact points (Step 1 follow-ups, Step 3 architect questions, Step 5 wiki offer, Step 6 next-steps) becomes a fresh producer context that must re-orient from disk.
- ⛔ **And the launcher-contract suite asserts only up to `exec claude`.** Whether the initiation actually survives being driven this way is **downstream of the boundary this repo tests**. Option A ships an argv change whose real-world behaviour we cannot prove here. That is the honest headline risk.

### Option B — producer first, owner told to run `fkit` at the end (manual hand-off)

Cold start byte-unchanged; the producer's Step 6 ends by telling the owner to run `fkit` (which already defaults to lead).

- ✅ Cheapest, zero risk to the initiation, seeds byte-unchanged.
- ⛔ The first session the owner talks to is still the producer — **arguably the literal thing they objected to**. Satisfies the requirement only from turn two.

### Option B′ — producer first, then the launcher itself opens lead, **conditionally** (my recommendation)

Not in the brief's table; it is B with the hand-off automated **and gated on success**. Replace the `exec` with a run, then re-evaluate the same freshness predicate:

- run the producer non-`exec` (guarded against `set -eu`);
- if it exited 0 **and** the tree is **no longer fresh** (the initiation actually landed) → set `role="lead"` and **fall through to the launcher's existing tail**, which already prints the lead line, builds lead settings, sets the tab title and execs lead. **No new exec is written.**
- otherwise (owner bailed, Ctrl-C, initiation incomplete) → exit exactly as today. **You never get force-dropped into a session you did not want.**

- ✅ Satisfies the sentence under *both* readings from the owner's point of view: all the questions get answered, then a lead session starts. The initiation keeps the live owner channel it was written for. **Both seeds stay byte-unchanged.** The conditional gate is in the same spirit as the existing refusal guard — *don't strand the owner*.
- ⛔ **Two genuine costs, named:** (1) the producer session's conversational context is lost at the transition — its *output* is on disk (`PROJECT.md`, `architecture.md`), so the loss is conversation only, but it is a loss; (2) **it costs a harness change.** The stub truncates its argv file per invocation (`: > "$FKIT_STUB_ARGV_FILE"`), so a two-phase run would leave only lead's argv and the producer's would be lost. Pinning **both** phases needs either a per-invocation argv file or a stub that can simulate a successful initiation. That is bigger than the brief anticipated and I am flagging it before, not after.

**My recommendation: B′** — because it is the only option whose downstream behaviour is inside what this repo can actually prove. **But my reading of your sentence points at A**, and you are the only one who can say which you meant.

## Q2 — the seed strings (point 2)

- **Under A:** both rewritten. A seed saying *"run your `fkit-initiate-project` procedure"* handed to **lead** instructs it to do a thing the ADR-018 hook will **deny**. New wording, both variants: *"…spawn `@fkit-producer` and ask it to run its `fkit-initiate-project` procedure; relay its questions to me."* The intake-present variant keeps *"READ `.fkit/intake.md` FIRST"* so the producer is still told not to re-ask.
- **Under B / B′:** **both seeds byte-unchanged.** The producer still reads them, still at the first launch.
- **Under B′, the lead exec gets no seed at all** — it reuses the existing tail's `exec claude --agent "fkit-$role" --settings "$settings" "$@"` verbatim. Fewest moving parts, no new untested string.

## Q4 — a doc line that goes stale under A only

`claude/agents/fkit-lead.md` line 107 says: *"Fresh project, nothing initiated → producer — its `fkit-initiate-project` is the cold start. (`fkit` goes there automatically on an uninitiated project.)"* Under A the parenthetical becomes **false** and must be corrected in the same change. Under B/B′ it stays true.

## Implementation steps (post-ruling)

1. Edit **`claude/fkit-claude.sh`** only — the fresh branch (562-600) plus, under B′, `role="lead"` and fall-through. ⛔ **Never `.claude/`.** ⛔ The change is **not live in this session**; it needs `fkit-claude-init.sh` re-run.
2. Under A only: correct `claude/agents/fkit-lead.md:107`; refresh the stale comment in `test/harness.mjs` (*"a fresh tree hijacks every role into the producer cold-start"*).
3. Amend **`test/launcher-contract.test.js`** test 12 to pin the **new** contract, keeping all four things it checks: which agent, which settings file, that a seed is passed, what the seed says. ⛔ Not deleted.
4. **Add test 12b — the intake-present seed**, which nothing tests today: pre-create `.fkit/intake.md`, assert the other seed. Cheap, and it closes a real hole.
5. Under B′ only: the harness argv change (Q1's named cost) plus a test asserting the **conditional** — a producer that exits without initiating must **not** re-exec.
6. Add **prove-red mutation 30**: revert the fresh branch's destination to `fkit-producer` → test 12 must red **at test 12's own assertion**, not elsewhere. Uses the existing `make_claude_copy` / `run_suite` helpers; append to the header list and before the summary block.
7. ⛔ Untouched, byte-identical: the refusal path, `setup_ok`, the `aa_refused` logic, the menu, `skills_for_role()`, `.fkit/interview`, and the historical report `2026-07-12-onboarding-verification.md` (it records what was observed then — correcting it would be falsifying a record).

## Verification (all measured at build time, none quoted)

1. Amended `launcher-contract.test.js` green, showing the new agent, new settings file, new seed.
2. Explicit-role path: `fkit coder` on a fresh project still opens the coder (the branch's `-z "$role"` gate survives).
3. Refusal / failed-setup paths still fall through to the menu and are **not** cold-started.
4. `test/structure-manifest.test.js` + `test/structure-spec.test.js` green — **proving** the manifest claim above rather than asserting it.
5. `test/dual-home-parity.test.js` green.
6. `git diff --stat`: **zero** files under `ai-agents/wiki-vault/`, **zero** under `.claude/`.
7. `npm test` — **measured** total/pass/fail reported.
8. `prove-red.sh` — measured, with mutation 30 red at its named assertion.

**If any of this forces regenerating a shipped artifact, I stop and surface it rather than regenerating.**

## Edge cases and plausible failure modes

- **`set -eu` + non-`exec` (B′):** an unguarded non-zero exit from `claude` kills the launcher before the transition. Must be `|| true`-guarded and the exit code captured.
- **Ctrl-C during initiation (B′):** exit 130 with the tree still fresh → the conditional correctly declines to re-exec. This is exactly what the gate is for.
- **Owner says "skip setup" (B′):** tree stays fresh → no re-exec, owner returns to the shell. Arguably a miss, arguably correct. Worth your view.
- **Relaunch mid-initiation:** `.fkit/interview` exits early when `intake.md` exists, so the intake never re-asks. Unchanged under every option.
- **Headless / CI cold start:** no tty → no `intake.md` → the no-intake seed. Under A the lead would try to relay an interview with nobody there. Under B′ nothing changes.
- **Under A, the hook actually firing:** if the lead's seed is misworded and lead calls the initiation itself, the ADR-018 hook denies it and the cold start dies at the first step. The seed wording is load-bearing, and no test in this repo can catch a bad one.

## Citation-policy discharge (the relayed ruling — *"Carry it into each sweep's plan gate (Rec)"*)

`test/coordination-citation-policy.test.js` scans `ai-agents/tasks/*/*/*.md` and exempts **closed** folders only, so this task's own `plan.md`, `worklog.md` and `review.md` are **in the scanned set while it runs**. I verified the `TARGET` regex firsthand: it bans `<path>:<digits>` where the path is under `ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/{brief,plan,worklog,review}.md`, or `ai-agents/wiki-vault/log.md`.

**How I avoid it:** every reference to a coordination file uses **heading + quoted fragment, never the coordinate** — the form Sweeps A/B/C and `0359` all adopted. I **reject by name** the split-cell dodge and fence/blockquote hiding. ⚠️ **Backticks hide nothing** — `maskCodeSpans` is deliberately absent (D4), and arm C4 asserts positively that a coordinate inside backticks **reds**.

⭐ **Source-file coordinates are not banned and I use them freely** — `claude/fkit-claude.sh:589`, `test/launcher-contract.test.js:301` are outside `ai-agents/` and outside `TARGET`. Only coordination-file coordinates are the hazard.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-07

Given live via `AskUserQuestion` in this `fkit lead` session. Option labels recorded **verbatim**.
These bind the Build and Process-review workers.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **Y0** | Approve this plan as written? | **"B′ — producer runs, then launcher opens lead (Rec)"** (Q1 ruling; the plan is approved with B′ as its chosen branch) | The plan above is the approved plan, executed on its **B′** branch. ⛔ Options **A and B are NOT taken** — every "under A" instruction in the plan is inert. |
| **Y1** | Q1 — which shape? | **"B′ — producer runs, then launcher opens lead (Rec)"** | ⭐ **B′.** The producer runs the initiation **with its live owner channel intact**, then the launcher **re-checks the freshness predicate** and opens lead **only if the initiation actually landed**. ⛔ A Ctrl-C, a "skip setup", or an incomplete initiation → **exit exactly as today; the owner is never force-dropped into a session they did not want.** The owner's reason: it is the only option whose downstream behaviour is inside what this repo can prove, and it keeps the initiation's live channel. ⚠️ Accepted costs, both named in the plan: the producer session's **conversation** is lost at the transition (its *output* is on disk), and **the harness needs a change** — the stub truncates its argv file per invocation, so a two-phase run must not lose the producer's argv. |
| **Y2** | Q2 — which questions did the owner mean? | **"The terminal intake — confirm the reading (Rec)"** | ⭐ **The terminal intake** (`.fkit/interview`), confirming the plan's own reading from the owner's ordering — *"it asks you questions **and then** it starts the producer session."* ⛔ **The intake stays exactly where it is.** Nothing moves, edits or removes it. |
| **Y3** | Q3 — priority | *Not put to the owner — folded in by the driver as settled rule* | ⛔ **Leave the rank at `P15`; rely on `Depends on`.** ADR-035 forbids a mid-board insertion, and rank/execution order **already disagree** for the `0361`/`0360` pair — so this is not a new condition. ⛔ **Nothing is re-ranked.** |
| **Y4** | Q4 — the `fkit-lead.md` routing line | *Moot under B′ — recorded so a later reader does not look for it* | ⭐ **No edit needed.** The line's parenthetical — *"`fkit` goes there automatically on an uninitiated project"* — stays **TRUE** under B′, because `fkit` **does** still go to the producer first; it simply opens lead afterwards. ⛔ Under option A it would have gone false; A was not taken. |

⚠️ **Transport note.** This plan text was returned to the driver through the spawn channel, which HTML-escaped some angle brackets. The driver restored `&lt;`/`&gt;` to `<`/`>` when persisting these bytes — in the B′ cost paragraph (`: > "$FKIT_STUB_ARGV_FILE"`) and in the citation-policy section (`<path>:<digits>`). No other character was altered. Recorded so a later reader does not read the restoration as drift.
