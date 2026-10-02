# Let a spawned coder write under a lead-relayed owner approval (one approval marker for both drivers)

## ID
0475

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule (2026-09-27): *"if we
> already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* This one changes how every spawned coder
> decides whether it may write. Being pullable on the board is not his word. The ruling below says
> so too: *"Starts on your word."*

**Owner ruling behind this task** (2026-10-02, `fkit-lead` session, `AskUserQuestion`, selected
option text, relayed to a spawned producer). Question: *"This 'spawned coder may not write code unless
the sprint loop sent it' rule has blocked or bent 6 times this week when I drive. Fix the rule?"*
Answer: *"File a task to fix it — Producer writes a brief: let a spawned coder write when the lead
relays an explicit owner approval (ADR-031's conductor path), matching how the sprint loop does it.
Starts on your word."*

**The gap.** `claude/agents/fkit-coder.md` lets a **spawned** coder write source on exactly one path:
the `/fkit-sprint-ship-loop` **declared-approval marker** — all of (a) caller is
`fkit-sprint-ship-loop`, (b) the approved plan is carried verbatim, (c) the prompt states the owner
approved it via a live `AskUserQuestion` relay in the driver session. **Everything else refuses.**

But [ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
makes the lead a **conductor** for any goal, not only for whole sprints: spawn coder for the plan only →
owner approves in the lead session → spawn coder to implement. Its honesty clause already accepts that
this ordering is prose, not a wall. The coder prompt never caught up with that general path — it only
names the sprint loop.

**Observed cost, 2026-09-23 .. 2026-10-02, owner driving through `fkit lead`** (six incidents):
- `0412` build, and two `0412` review rounds — spawned coder flagged the gap.
- `0415` build, and one `0415` review round — flagged the gap.
- A commit job — flagged the gap.
- 2026-10-02: a spawned coder **refused** a small README-adjacent text fix until the owner
  re-authorised explicitly.

Each time the coder fell back on CLAUDE.md's *"a skill rule beats a contrary spawn instruction unless
that instruction names an owner ruling"* clause — so the outcome depended on how each spawn prompt
happened to be worded. That is the defect: **the same owner approval is honoured or refused depending
on prompt wording**, not on a rule.

**The goal — one consistent rule.** A spawned coder may write source when its spawn carries **either**
(1) the sprint loop's declared-approval marker (unchanged), **or** (2) an **explicit, quoted owner
approval relayed by the lead** on ADR-031's conductor path — **with the same evidence requirements**.
Otherwise it plans and returns only. The safety intent stays: **no silent self-authorisation** — the
coder never infers approval from a spawn that does not carry it, and the lead never writes the marker
without a real owner answer in its own session.

**Decisions this touches — read before planning:**
- [ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
  — conductor remit and the plan-gate honesty clause (the accepted "trust, not proof" cost).
- [ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
  — Decision 3 + the 2026-07-22 autonomy amendment define today's marker, its Build / Process-review
  worker roles, and A3 ("trust, not proof"; do **not** re-raise "the marker is only prose").
- [ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
  — the fix discipline (verified-`CORRECT` + mechanical/localized + in-plan) and the worklog audit
  obligation that transfers with the permission.
- [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)
  — approval leaves no artifact; the spawned coder cannot verify it.
- `claude/carry-check-hook.mjs` (task `0204`) — the `PreToolUse` carry-check keys on a
  `plan: <path>/plan.md  blob <hash>` pointer line, not on the caller string. Whether the lead path
  should carry that pointer too is an open question below, not assumed.

**No conflict with a locked decision found** — the owner's ruling extends ADR-031's conductor path
to the coder prompt; it does not reverse ADR-032. Whether that needs an ADR-031/032 amendment or a new
small ADR is the architect's call (see What to build, step 1).

## What to build

1. **Record the decision first — architect consult.** Ask `fkit-architect` whether this is an
   **amendment** (ADR-031 conductor path and/or ADR-032 Decision 3) or a **new small ADR** that both
   cite, then have it written with `/fkit-record-decision`. It must state: the two drivers, the shared
   evidence requirements, what still refuses, and that the honesty-clause cost is the **same accepted
   cost**, not a new one. Do not edit the coder prompt until the decision text exists.

2. **One marker shape, shared by both drivers.** Define a single declared-approval marker that both the
   sprint loop and a lead conductor spawn use, with the driver named in it. Required fields, the same
   for both:
   - **caller** — `fkit-sprint-ship-loop` or `fkit-lead` (conductor);
   - **the owner's approval, quoted verbatim** — the `AskUserQuestion` selected option text, or the
     owner's own typed words — plus the **date** and the **channel** it came through;
   - **the approved plan verbatim, or the exact approved scope** (for a small job with no plan file:
     the exact files and change the owner approved);
   - **the worker role** — Build or Process-review (review-fix rounds) or another single bounded write
     job (e.g. the commit job — see open question 3).
   Keep the sprint loop's existing marker **working as-is** (its three signals map onto these fields);
   do not break `claude/carry-check-hook.mjs` or its pointer-line contract.

3. **Rewrite the coder's spawned-write rule in `claude/agents/fkit-coder.md`** so it reads as **one
   rule with two drivers**, not a sprint-loop-only carve-out plus an implicit refusal:
   - **May write** when the spawn carries the shared marker from either driver; the approved plan /
     scope is both standing approval and scope boundary; anything outside it → `NEEDS-DECISION`.
   - **Process-review on the lead path** follows the same ADR-019 discipline and worklog decision-log
     audit as the sprint loop's Process-review worker (subject to open question 2).
   - **Still refuses** — a spawn with no marker, a marker missing any required field, a paraphrased
     (not quoted) approval, a plan-only spawn ("write nothing yet"), and any "implement this" with no
     owner approval behind it. Refusal returns the plan, as today.
   - Keep the "trust, not proof" paragraph; extend it to the lead path in the same words, not a
     softened one.
   - Remove the need for the CLAUDE.md "names an owner ruling" fallback on this path — a properly
     marked spawn should not have to argue its way in.

4. **Teach the lead to send it.** In `claude/agents/fkit-lead.md`'s conductor remit, add that when the
   lead spawns a coder to write after the owner approved, it carries the shared marker (quoted
   approval, date, channel, plan/scope); without a real owner answer in its session it spawns
   plan-only. Update `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s marker description only as far
   as needed to point at the shared shape — **no behaviour change to the sprint loop**.

5. **Keep it out of the shared rules block.** Do **not** add this to the CLAUDE.md / AGENTS.md
   universal rules block — it is coder- and lead-specific, and the block has a hard byte cap
   (`RULES_MAX` in `claude/fkit-claude-init.sh`; ADR-030 records how little headroom is left).

6. **Tests.** Add or extend tests that pin the new rule text so it cannot silently drift back to
   sprint-loop-only: the coder prompt names **both** drivers and **every** required field; the lead
   prompt names the marker; the refusal list is still present. Check existing pins on `fkit-coder.md`
   (e.g. `test/coordination-citation-policy.test.js` cites `claude/agents/fkit-coder.md:98` as a
   source coordinate — if line numbers move, keep that test green honestly, do not just bump the
   number without checking what it guards). Run the full suite.

**Out of scope:** a structural (non-prose) approval check — ADR-021 says approval leaves no artifact,
and ADR-032 A3 forbids re-raising that as a finding. Any change to who may commit (still owner-only;
see open question 3). The four files a parallel coder may be editing at filing time
(`claude/fkit-claude.sh`, `bin/fkit-board.mjs`, `claude/skills/fkit-team/SKILL.md`, `README.md`) —
check `git status` before touching them.

## Verification steps

1. The decision exists under `ai-agents/knowledge-base/decisions/` (new ADR or dated amendment), names
   both drivers, the shared required fields, the refusal list, and restates the honesty-clause cost.
2. `claude/agents/fkit-coder.md` states one rule with two drivers; `grep` finds `fkit-lead` and every
   required field (quoted approval, date, channel, plan/scope, worker role) in that section, and the
   sprint loop's marker is still described.
3. `claude/agents/fkit-lead.md` tells the lead to carry the marker when spawning a writing coder, and to
   spawn plan-only otherwise.
4. The sprint loop is unchanged in behaviour: its marker still satisfies the coder's rule; the
   carry-check hook's tests still pass.
5. The rules block is not touched: the `RULES_MAX` check in `claude/fkit-claude-init.sh` passes and the
   block's byte size is unchanged.
6. New tests pin the rule text (both drivers, all fields, refusal list); the full test suite is green.
   State the pass count.
7. **Dry run, recorded in the worklog:** in a `fkit lead` session, (a) spawn a coder with a correctly
   marked lead approval for a trivial change → it writes, no fallback argument; (b) spawn one with the
   approval paraphrased or a field missing → it refuses and returns the plan; (c) a plan-only spawn →
   writes nothing. If (a)–(c) cannot be run, say so — do not claim them.
8. `fkit-claude-init.sh .` refreshes the dogfooded `.claude/` copies and they match `claude/`.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Open questions for the owner (answer before or at the plan gate):**
  1. **What counts as "explicit, quoted" approval?** Recommended: the `AskUserQuestion` selected option
     text **or** the owner's own typed words, quoted verbatim, with date and channel — a lead summary
     ("the owner said yes") is **not** enough.
  2. **Review-fix rounds on the lead path:** does one approved plan stand as approval for in-plan,
     verified-`CORRECT` fixes (the sprint loop's ADR-019 discipline, as the ruling's "matching how the
     sprint loop does it" suggests), or must each review round get its own quoted approval?
     Recommended: match the sprint loop.
  3. **Commit jobs:** one of the six incidents was a commit job. Commits stay owner-only under CLAUDE.md;
     should a quoted owner instruction to commit, relayed by the lead, count under the same marker?
     Recommended: yes, as its own worker role with the exact commit scope quoted — but it is the
     owner's call.
  4. **Carry-check hook on the lead path:** should a lead spawn with a plan file also carry the
     `plan: … blob …` pointer so the existing hook checks it? Recommended: yes when a plan file exists,
     optional for a no-plan small job; the hook itself unchanged.
- **Consulted:** none at filing — the ADR shape (amendment vs new ADR) is deliberately left to the
  architect consult in step 1.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
