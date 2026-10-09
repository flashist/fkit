# Plan — 0475: let a spawned coder write under a lead-relayed owner approval

**Summary**
- One rule, two drivers: a spawned coder may write when the spawn carries the **declared-approval marker** from `fkit-sprint-ship-loop` **or** from `fkit-lead` (conductor). The marker has four fields: (a) caller, (b) approved plan verbatim (or the exact approved scope), (c) the owner's approval, (d) worker role. Everything else refuses.
- **Decision first:** a new **ADR-055** (architect consult, hop 2: a new ADR, not an amendment), plus dated ⚠️ pointer notes in ADR-031, ADR-032, ADR-037 and ADR-044. An architect records it after approval and before Build, the same route 0476 used for ADR-054.
- Files: `claude/agents/fkit-coder.md`, `claude/agents/fkit-lead.md`, a small pointer edit in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, a new `test/spawned-write-marker.test.js`, one `CHANGELOG.md` line. Not touched: the rules block, the carry-check hook, `fkit-process-stateful-review`.
- Checks: full `npm test`. Two reasons: the sprint-loop SKILL is named in `test/prove-red.sh`, and a new test file is added. State the pass count.
- **This also lands backlog task 0163's case** (refuse a defective marker from a real driver). 0163 is not closed by this task; that is a producer/owner matter afterwards.
- **Unverified / honest limits:** the dry run (verification 7) needs a `fkit lead` session that loads the refreshed agent file. A spawned Build worker cannot run it (Step 9). The marker stays trust, not proof (ADR-021, ADR-032 A3).
- The brief says "do not start without the owner's specific word". Approving this plan is that word, so the driver should ask for it in those terms.

## Step 0 — Snapshot (no repo writes)
Other tasks have left uncommitted edits in `claude/agents/fkit-coder.md` (0480: the "Test your changes" bullet), `claude/skills/fkit-sprint-ship-loop/SKILL.md` (0480: the Verify row) and `CHANGELOG.md`. Before any edit, copy these files to the session scratchpad: those three, `claude/agents/fkit-lead.md`, ADR-031, ADR-032, ADR-037, ADR-044, `CLAUDE.md` and `AGENTS.md`. From then on, "0475's diff" means `diff <snapshot> <file>`, not `git diff`. Also record the byte size of the emitted rules block in `CLAUDE.md` and `AGENTS.md` (between the fkit-managed markers) for verification 5. Check `git status` for `claude/fkit-claude.sh`, `bin/fkit-board.mjs`, `claude/skills/fkit-team/SKILL.md` and `README.md`. None of them is edited here.

## Step 1 — Record the decision FIRST (ADR-055, architect)
**Who:** `/fkit-record-decision` is architect-only (ADR-018 hook). Right after approval the driver spawns `@fkit-architect` (hop 1) to record ADR-055 from the content below, before spawning Build. Fallback: the Build worker consults the architect at hop 2. Either way, no prompt file is edited until the ADR file exists.
**Number:** 055 (ADR-053 and ADR-054 exist but are untracked). Re-check `ls` and `git status` right before writing, because a parallel session may take it (`adr-number-uniqueness` test).
**ADR-055 content** (from the architect's consult):
1. A spawned **coder** may write source under the declared-approval marker from either of two drivers: `fkit-sprint-ship-loop`, or `fkit-lead` on ADR-031's conductor path. The owner ruled this on 2026-10-02 (selected option quoted in the brief's Context, "Owner ruling behind this task").
2. The shared fields: (a) caller; (b) approved plan verbatim, or, for a small job with no plan, the exact approved scope (files + change); (c) owner approval; on the lead path it is **quoted verbatim** (the `AskUserQuestion` selected option text, or the owner's own typed words) with **date** and **channel** [per OQ-1/OQ-2]; (d) worker role: Build or Process-review [Commit only if OQ-4 says yes].
3. The sprint loop's three signals satisfy the marker by mapping [per OQ-2]: (c)'s channel is the live `AskUserQuestion` in the driver session, the date is that session's date, and (d) is the loop step. Any asymmetry is stated plainly: labelling a spawn `fkit-sprint-ship-loop` skips the quote. That is A3's forgery cost again, not a new one.
4. What still refuses: no marker; any field missing or defective (plan by reference only or truncated, a paraphrased or summarized approval, an approval that does not plainly cover the plan/scope carried, so an approval for X cannot be reused for Y); a plan-only spawn (which never carries the marker); any "implement this" with no owner approval behind it.
5. Process-review on the lead path follows ADR-019's discipline and the worklog decision-log audit, and needs a task folder [per OQ-3].
6. Relation to ADR-037: the coder's refusal is an agent-prompt rule, not a skill rule. ADR-055 is the standing, named owner ruling on this exact point, so a correctly marked spawn is not a departure. There is no "comply and flag" note and no CLAUDE.md fallback argument. Tier 1 (the universal hard rules) is untouched.
7. Honesty: the **same accepted cost** as ADR-031's honesty clause and ADR-032 A3, with **wider exposure** (more spawns now rely on prose). A quote gives fidelity, not proof (ADR-021). It is never called "verification".
8. The carry-check hook is unchanged. It keys on the `plan:` pointer line, not the caller. A lead spawn with a plan file carries the pointer [per OQ-5]. A small job with no plan file is invisible to the hook, and the ADR says so.
9. **Coder-only** [per OQ-6]. ADR-044's architect and producer Build carve-outs (described there, not yet built in their agent prompts) stay sprint-loop-only.
10. Out of scope: a structural approval check (ADR-021; ADR-032 A4 forbids re-raising it); push is never covered.
11. Re-raise only if: a spawned coder wrote source on the lead path without a real owner approval (owner-noticed, A4's channel); or a lead-path Process-review fix is found wrong or out of plan (the worklog makes it checkable).

**⚠️ dated pointer notes** (append only, never ⛔, Status stays `accepted`; anchor by section and quoted phrase):
- ADR-032: the Amended-by / Corrections header; §Amendment A1 (*"identifies the caller as `fkit-sprint-ship-loop`"*); A4's bullet *"without all three marker signals"*. Its trigger now reads against ADR-055's fields.
- ADR-031: the plan-gate honesty clause and the first residual-risk bullet.
- ADR-037: the context sentence that calls the coder marker "one skill and one role".
- ADR-044: its three "declared-approval marker" mentions. The note says the non-coder carve-outs are not widened.
- (Only if OQ-4 = yes: ADR-049 D2, "Human verification is anchored at the git commit".)

## Step 2 — `claude/agents/fkit-coder.md` (the `## Mode` section only)
- **"Do not accept a background delegation" sentence:** append *"— unless the spawn carries the declared-approval marker (the second exception below)."*
- **First-exception paragraph**, the *"**Two** loops override that per-fix gate"* passage: item (2) becomes *"a **Process-review worker** spawned under the declared-approval marker, by `/fkit-sprint-ship-loop` or by `fkit-lead` (the second exception below)"*. Its *"Nowhere else"* stays.
- **Replace the heading paragraph "A second scoped exception — the lead's `/fkit-sprint-ship-loop`"** with *"A second scoped exception — a spawned write under a relayed owner approval: one rule, two drivers ([ADR-055]; ADR-032 Decision 3 + its 2026-07-22 autonomy amendment; ADR-031 honesty clause; discipline mirrors ADR-019)"*. Body: you MAY write, as a Build or Process-review worker, only under the marker, **all** of:
  - (a) the caller is `fkit-sprint-ship-loop` (the lead's sprint driver) **or** `fkit-lead` (the conductor, ADR-031);
  - (b) *"it carries a concrete **approved plan** verbatim"*. This phrase is kept **byte-identical**, because `claude/carry-check-hook.mjs` quotes it as "condition (b)". Then add *"— or, for a small job with no plan, the exact approved scope (the files and the change) as approved"*;
  - (c) it states the owner approved that plan or scope through a live relay in the driver session. **From `fkit-lead`, it quotes that approval verbatim** (selected option text or the owner's own typed words) **with its date and channel**. *"The owner said yes"* is not a quote;
  - (d) it names your **worker role**.
  
  Then one sentence on the sprint-loop mapping (per OQ-2). Keep *"On this path the refusal's rationale … is satisfied"* and *"standing approval and scope boundary"*. Add one line: *"A correctly marked spawn departs from no rule: you need no ADR-037 named-ruling argument and owe no comply-and-flag note."*
- **Build / Process-review bullets:** keep the text. Change "the loop" / "the driver" only where it named the sprint loop alone. Worklog audit unchanged. Lead-path Process-review requires a task folder (OQ-3); without one, return `NEEDS-DECISION`.
- **New explicit refusal list** (replaces the tail *"Everything else still refuses — …"*): **Still refuses; write no source:**
  1. no marker (any other spawned "implement this") → return the plan;
  2. a plan-only spawn ("write nothing yet"), which never carries the marker → return the plan;
  3. a marker that is missing or fails any of (a)–(d), including a plan carried by reference only (a pointer, or *"the plan you returned earlier"*) or truncated, a paraphrased or summarized lead approval, or an approval that does not plainly cover what is carried → return **`NEEDS-DECISION` naming the failed field** so the driver can re-send. This is 0163's case. It points at the conditions rather than restating "verbatim" a second time;
  4. (unless OQ-4 = yes) any commit or push request.
- **Trust paragraph:** keep *"This is trust, not proof — state it, do not harden it into a false guarantee."* and the rest in the same words, made to cover **both drivers**: *"the declared-approval statement is prose in the driver's prompt"* applies to either driver. Cite ADR-055 beside ADR-031 / ADR-032 Decision 7: *"the same prose-enforced cost, with wider exposure, not a new hole to re-flag"*.
- Frontmatter `description` ("NOT for background delegation") and `claude/README.md`'s coder row: **unchanged**. Both are still true as headlines. Reported, not edited.

## Step 3 — `claude/agents/fkit-lead.md` (conductor remit)
Add one bullet after *"⚠️ The orchestrated plan gate is prose, not a wall"*: **"Spawning a coder to write — carry the declared-approval marker (ADR-055)."**
- Spawn `@fkit-coder` **plan-only** first. Put the plan (or the exact files and change) to the owner with `AskUserQuestion`.
- Only after a **real owner answer in this session**, spawn the writing coder. Its prompt carries (a) caller `fkit-lead`, (b) the plan verbatim or the exact scope, (c) the approval **quoted verbatim** with **date** and **channel**, and (d) the worker role.
- A summary is not a quote. **No real owner answer → spawn plan-only.** Never put the marker on a plan-only spawn.
- With a task folder: write `<task-folder>/plan.md` at approval (copied, not re-rendered). Carry paste **and** pointer `plan: <path>/plan.md  blob <git hash-object>`, read with `cat`, never `Read`. The `PreToolUse` carry-check checks it.
- Process-review needs a task folder.
- Trust, not proof: the same accepted cost as the honesty clause.

The Hard rule *"Never commit or push"* is unchanged (unless OQ-4 = yes).

## Step 4 — `claude/skills/fkit-sprint-ship-loop/SKILL.md` (pointer only, no behaviour change)
Under *"Rules that make this honor the ADRs"*, first bullet, after *"These three signals are the **declared-approval marker**"*: add one sentence saying this is the sprint-loop form of the shared marker (ADR-055; driver-side shape in `fkit-lead.md`), with (c)'s channel and date and (d)'s role given by the live relay and the loop step. Step 5's *"gates the write on **all** of (a)(b)(c)"* stays true under the mapping, so leave it. Do not touch 0480's Verify-row edit. (Under OQ-2's alternative, this bullet instead gains "quote the selected option text and date" — still one sentence.)

## Step 5 — New test `test/spawned-write-marker.test.js` (test:unit; reads `claude/` only, not `ai-agents/`, so not added to `test:docs`)
Follow the idiom of `test/wiki-flag-convention.test.js`: a header naming what it does and does not detect (source text, never runtime obedience); the extractor **throws** on a missing heading or an empty block; constants come from the text on disk; whitespace is normalized because prose wraps. Arms:
1. The coder section (from *"A second scoped exception"* to `## Your procedures`) names `fkit-sprint-ship-loop` **and** `fkit-lead`, plus every field: approved plan, verbatim, approved scope, quote, date, channel, worker role, Build, Process-review.
2. The refusal list is present: plan-only, by reference, paraphrase, `NEEDS-DECISION`, and the no-marker case.
3. *"trust, not proof"* is present.
4. The carry-check phrase *"it carries a concrete **approved plan** verbatim"* appears byte-exact (the hook comments quote it).
5. `fkit-lead.md` names the marker, its fields, and "plan-only".
6. The sprint SKILL still says "declared-approval marker" and points at ADR-055.
7. A control arm: remove `fkit-lead` from the extracted text in memory, and arm 1 must fail. This proves the checker is not vacuous.

`test/coordination-citation-policy.test.js` M8's `'claude/agents/fkit-coder.md:98'` is a **synthetic string** in a fixture; it never reads the file. A line move cannot break it, and it is left unchanged. (Checked: no test reads either agent file's content today.)

## Step 6 — `CHANGELOG.md`
One line under `## Unreleased`: a spawned coder now writes when the lead relays a quoted owner approval (ADR-055). The same marker as the sprint loop.

## Step 7 — Refresh the dogfooded copies
Run `bash claude/fkit-claude-init.sh .`, then `diff` `claude/agents/fkit-{coder,lead}.md` and the sprint SKILL against their `.claude/` copies: they must match.

## Step 8 — Checks
- `npm test` in full. Report the pass count, including the carry-check, rules-block-budget and docs tests.
- The rules-block bytes in `CLAUDE.md` / `AGENTS.md` equal the Step 0 figures. `claude/scaffold/universal-rules.md` is unchanged versus the snapshot.
- Run the verification-2 greps on the coder section, and grep 0475's diff to confirm the hook file is untouched.

## Step 9 — Dry run (verification 7), honest
A spawned Build worker **cannot** run it. It needs a `fkit lead` session. Claude Code may load agent definitions at session start (unverified), so a refreshed `.claude/agents/fkit-coder.md` may not be live in the running driver session.
- After Build, the driver first spawns a **plan-only** coder and asks it to quote the first sentence of its "second scoped exception". If that is the new text, the driver runs (a) a correctly marked lead spawn for a trivial scratch change outside the repo, after a real owner approval, which should write; (b) the same spawn with the approval paraphrased, which should return `NEEDS-DECISION`; (c) a plan-only spawn, which should write nothing.
- Otherwise the worklog records "dry run not run: needs a fresh `fkit lead` session". It is never claimed.

## Worklog
The Build worker writes `<task-folder>/worklog.md`: the snapshot, the diff per file, check results, the dry-run status, and the decision log (`none` if none).

## Edge cases / risks
- **Line shifts:** ADR-019, ADR-032 and ADR-044 cite `fkit-coder.md` lines that are already stale. ADRs are frozen records; ADR-055's notes cover the new location. No test checks line ranges (`reference-integrity` checks links only).
- **Two statements of one shape** (the coder side and the lead side) can drift. The new test pins both.
- **A stricter (c) on the lead path** means a sloppily worded lead spawn now gets `NEEDS-DECISION` instead of an argued-in write. That is intended, and costs one round to re-send.
- **The ADR-044 name collision:** without the coder-only scope, a lead-spawned architect or producer could read "the declared-approval marker" as covering them.
- **ADR-053** (proposed) counts plan approval from hooks and `plan.md`, not marker text. Unaffected (checked).
- **Concurrent edits:** re-snapshot if another task touches the same files mid-build.
