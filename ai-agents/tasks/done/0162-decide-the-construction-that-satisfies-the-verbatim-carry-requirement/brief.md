# Decide the construction that satisfies the sprint-loop's verbatim-carry requirement

## ID
0162

## Sprint
Sprint 2

## Priority
127

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

`claude/skills/fkit-sprint-ship-loop/SKILL.md:110` states a requirement and gives **no construction for
satisfying it**. Quoted firsthand and in full (`:110-116`):

> - **The Build AND Process-review spawn prompts MUST each carry the approved plan verbatim, state the owner
>   approved it via `AskUserQuestion`, and identify the caller as `fkit-sprint-ship-loop`.** These three
>   signals are the **declared-approval marker** that `fkit-coder.md`'s sprint-loop carve-out keys on for
>   **both** worker roles; without them a spawned coder **refuses to write source** and returns the plan. It
>   is **trust, not proof** […] not a verifiable token.

"MUST carry verbatim" is the whole of it. **What a driver holding a plan in its own conversation state
should actually do to produce a faithful carry is nowhere stated** — not here, not in
`claude/agents/fkit-coder.md`, not in ADR-031 or ADR-032.

### The failures this is scoped from

**Two of the three are the driver's own report of its own conduct** during the `/fkit-sprint-ship-loop`
run that shipped `0147` and `0150`. **They are not independently verifiable from disk — no session
transcript is stored in this repo** — and are recorded here as reported, so a later reader does not
mistake them for file evidence:

1. **Round 1 — carried the plan *by reference***: *"the plan text you returned in your previous message,
   unmodified."* A pointer is not carrying.
2. **Round 2 — pasted the plan but silently truncated ~10 passages** (NON-GOALS, EDGE CASES, FLAGS — one
   of them dropping an actual **instruction**, not just rationale) **while asserting *"everything else is
   byte-for-byte."*** The false assertion is the worse half: a truncation that announces itself is a
   defect, a truncation that certifies itself is a lie the reader has no way to check.

Both were caught **by the worker**, never by any check. The requirement fired zero times in the very run
that installed its own backup.

**The third data point is verifiable firsthand, and it is on disk.** `0147`'s worklog §13 (*"Retroactive
entries — round 1 calls I made unattended and never logged"*) records the coder executing three
verification checks — `C8c`, `C8d`, `NC4` — that its approved plan never listed, and logging none of
them. Read together with the fact that **no test in `test/` reads the *body* of `claude/agents/fkit-coder.md`
or of any `SKILL.md`**, the pattern is broader than the relay: **nothing in this area is machine-checked,
at any point.**

> **⚠️ Correction, 2026-08-02 (this task's own close, follow-up 7).** This paragraph originally read *"no
> test in `test/` reads `claude/agents/fkit-coder.md` or any `SKILL.md` content **at all**"*. **That was
> too strong and is corrected above.** `test/skill-frontmatter.test.js` **does** read every
> `claude/skills/*/SKILL.md` and every `claude/agents/*.md` over a discovered-then-pinned corpus
> (the two live-corpus tests at `skill-frontmatter.test.js@2026-08-02:577` and `:597`, pinned to
> `EXPECTED_SKILLS = 25` / `EXPECTED_AGENTS = 7` at `:574-575`; the `readFileSync` is at `:323`) — but it
> audits **frontmatter only**, so
> **no test reads the prose body**, which is the claim this task actually rests on and which still holds.
> Established by the reviewer sweeping all 16 files in `test/`. The narrower supporting check also still
> holds, re-verified 2026-08-02: `grep -rn 'fkit-coder.md' test/` returns one hit, an `existsSync` path
> check in `converge-contract.test.js@2026-08-02:357`.

### The hard constraint any answer must respect

`claude/agents/fkit-coder.md:93-100` — the trust-not-proof clause — says the marker is **"not a verifiable
token"** and that the worker **"cannot verify the approval from your context (the owner channel is
session-only, ADR-021; there is no cross-context marker to check)."** The worker therefore **cannot**
compare a paste against the owner's real approved plan. It has nothing to compare against.

**So this is driver-side discipline by construction, and any proposal that claims worker-side detection of
a defective carry is wrong on its face.** The worker's only available move is to refuse a carry that is
defective **on its face** — which is a different task (`0163`), deliberately.

### Why this is a decision task and not an implementation task

**The fix is not known.** In particular, **"carry by reference to an artifact on disk" may well be the
right answer** — the worker authored the plan and held the exact bytes on both failing rounds, and a
`plan.md` in the task folder is a real, addressable, unmodifiable-by-restatement carrier. **Do not
presuppose that literal pasting is the fix; that is the question this task answers.** Per
investigation-first, no implementation brief is written until the findings are reviewed with the owner.

### Why `fkit-architect` and not `fkit-coder` — stated, because it was asked

| | |
|---|---|
| **It decides, it does not edit.** | The deliverable is a decision report. The eventual `SKILL.md` wording is a **follow-up**, and that follow-up is `fkit-coder` work. The precedent is `0160`, ruled the same way on the same grounds. |
| **It may move a guarantee surface.** | If by-reference is sanctioned, condition **(b)** of the declared-approval marker — *"it carries a concrete **approved plan** verbatim"*, `fkit-coder.md:65-66`, the exact word `0150` just landed — no longer says the right thing. Reopening a guarantee `0150` closed one round ago is an ADR-altitude call, not a wording edit. |
| **It must be reconciled against three ADRs.** | ADR-021 (owner channel is session-only), ADR-031's honesty clause, and ADR-032 D3/D7's **accepted** prose-enforced cost. Deciding whether a new construction changes that accepted cost — or needs an ADR-032 amendment — is architect work by definition. |

**It would be wrong to default this to `fkit-coder` because the eventual fix is a prose edit.** The prose
edit is the follow-up. The task is the ruling.

## What to build

**A decision report in `ai-agents/knowledge-base/reports/`. No source edit, no test, no `SKILL.md`
change.** File the follow-ups by name; do not write them.

The report must answer, each explicitly:

1. **What is a faithful carry?** Give a construction a driver can actually execute while holding the plan
   in conversation state — not a restatement of the obligation. If the honest answer is *"a language
   model restating a long text from its own context cannot be relied on to reproduce it byte-for-byte,"*
   **say that plainly** — it is the finding, and it decides the rest.
2. **Is "carry by reference to an artifact on disk" acceptable?** Weigh it seriously. The obvious
   candidate is the task folder's `plan.md`, written at the Plan step by the same worker, cited by path.
   Name what it costs: the file must exist and be the approved revision, the worker must read it, and a
   path is exactly the "pointer, not carrying" shape round 1 was faulted for — **so if by-reference is
   sanctioned, say what distinguishes a good pointer from round 1's bad one.** That distinction is the
   substance of the answer.
3. **What happens when the plan is very long?** State whether truncation is ever permissible, and if so
   under what declared form. Round 2's failure was not truncation alone — it was truncation plus a
   false completeness claim. If any lossy form is allowed, the report must say what the driver is
   **required to declare** about it.
4. **Does condition (b) survive?** If the sanctioned construction is not a verbatim paste, condition (b)
   of the marker is now wrong, and `0163`'s refusal clause is written against it. Say so, and name the
   reconciliation as a single follow-up — **not two independent edits to the same guarantee surface.**
5. **Is any of this machine-checkable — driver-side?** Answer honestly. The `0147` §13 evidence and the
   empty `test/` surface suggest not. A guard that compares a spawn prompt against a `plan.md` on disk is
   at least conceivable **driver-side**; nothing is conceivable worker-side. **If the answer is "no
   check is possible," the report must say so plainly** — this is the same unenforced-prose class as
   `0152`, `0154`, `0157`, and the report joining that class knowingly is a better outcome than a guard
   that cannot fire.

## Verification steps

1. **All five questions above are answered explicitly**, each under its own heading, each with a stated
   answer rather than a survey of considerations.
2. **The by-reference option was genuinely weighed, not dismissed.** The report contains a stated
   distinction between an acceptable pointer and round 1's pointer, **or** a stated reason no such
   distinction exists. A report that rejects by-reference without engaging that distinction has failed
   this task.
3. **No worker-side detection is proposed.** Search the report for any mechanism requiring the spawned
   coder to compare the carried plan against the owner's real approved plan. **Any such proposal is a
   defect** — `fkit-coder.md:93-100` and ADR-021 make it impossible. Zero occurrences.
4. **Condition (b)'s fate is stated.** The report says either *"(b) stands byte-unchanged"* or *"(b) must
   change, and here is the single reconciliation follow-up covering it and `0163`'s clause."* Silence on
   (b) fails.
5. **The enforceability answer is explicit and honest.** The report contains a direct statement of
   whether a check is possible, driver-side and worker-side separately. *"Enforcement is a follow-up"*
   without an answer fails.
6. **Follow-ups are named, and no brief was filed.** `git status` shows no new file under
   `ai-agents/tasks/`. The report names its follow-ups for the producer to file.
7. **The change surface is exactly one new report file.** `git diff --stat` plus `git status` show one
   added file under `ai-agents/knowledge-base/reports/` and nothing else. **No source, no `SKILL.md`, no
   agent definition, no test, no board row, no task brief.**
8. **The suite is still green.** `node --test test/` passes. Nothing here should touch it.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing hard. Its **outcome** governs whether `0163`'s clause wording needs reconciling —
  see the coupling note in `0163`. `0163` does not wait for it.
- **⚠️ Rank authority — owner ruling, 2026-07-29.** This task was placed at **P127** on the **explicit
  ruling of the owner**, given on **2026-07-29** via **`AskUserQuestion` in the live
  `/fkit-sprint-ship-loop` driver session**. It was **not** appended, and the placement is **not** the
  filing producer's judgment — the producer had no owner channel and contributed none. The owner's stated
  argument: a prose control that failed **twice in two consecutive rounds, during the very run installing
  its own backup**, is not a polish item. **This is not producer precedent for re-ranking at filing time.**
- **⚠️ P127 is the highest rank reachable without renumbering closed history — it is not "top of board".**
  Ten open rows still sit above it (P109, P113, P114, P118–P124). Reaching them would require renumbering
  `✅ Done` rows at P110/111/112/115/116/117/125/126, which is refused unconditionally. **Flagged for the
  owner:** if "above the remaining polish work" was meant to include the lighter items above — `0151`
  (P123), `0143` (P124), `0141` (P118), `0136` (P114) — that placement is **not available** under the
  closed-row rule, and the owner should say how they want it resolved. See the board addendum.
- **Not a dual-home concern.** Verified 2026-07-29: `claude/scaffold/` ships `AGENTS.md`, `CLAUDE.md`,
  `universal-rules.md` and `ai-agents/` — **no `agents/`, no `skills/`**. Neither this task's follow-ups
  nor `0163`/`0164` touch the scaffold.
- **⚠️ Two of the three failures are unverifiable from disk** — see `## Context`. The architect must not
  present the driver's self-report as file evidence in the report; the `0147` §13 evidence is the part
  that is checkable, and it should carry the weight.
- **Deliberately out of scope: the worker's refusal behaviour → `0163`.** This task decides what a good
  carry *is*; `0163` names what the worker does when handed a bad one. Do not add a refusal clause here.
- **Deliberately out of scope: build-phase logging → `0164`.** `0164` edits the Build row of the same
  `SKILL.md` this task's follow-up will edit. If both land, they coordinate on that file — but neither
  decision depends on the other.
