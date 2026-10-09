# Decide whether a spawned coder may commit under a lead-relayed owner approval ("commit relay")

## ID
0497

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule (2026-09-27): *"if we
> already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* This one would change who may run
> `git commit` in fkit. Being on the board is not his word.

**Owner ruling behind this task** (2026-10-05, `fkit-lead` session driving Sprint 10,
`AskUserQuestion`, relayed to a spawned producer for filing). Question — task `0475`'s open question
OQ4: *"Should this task also let a spawned coder commit, when you approve the commit through me?"*
Selected option, verbatim: **"No — file a follow-up (Recommended)"**. So `0475` stays write-only, and
this task carries the commit question on its own. ⚠️ The ruling files the question; it does **not**
say commit relay should exist. Whether to do it at all is still the owner's call (step 1 below).

**What "commit relay" means.** Today every commit needs the owner to act: the universal hard rule in
`CLAUDE.md` reads *"Never commit or push unless the owner explicitly asks."*, `fkit-coder.md` repeats
it (*"Commit or push anything unless the owner explicitly asks."*), and `fkit-lead.md` says
*"Never commit or push."* The question is whether *"explicitly asks"* can be **relayed**: the owner
approves one specific commit through the lead's `AskUserQuestion`, and the lead spawns a coder whose
prompt quotes that approval, and the coder runs the commit.

**Where it came from.** One of the six incidents in `0475`'s Context was *"A commit job — flagged the
gap."* `0475`'s plan sketched a possible answer — a third worker role, Commit, with the exact commit
scope quoted — and parked it behind OQ-4. The owner took it out of `0475`.

**What this builds on — `0475` / ADR-055.** `0475` is building ADR-055: a spawned coder may **write
source** when the spawn carries a declared-approval marker from `fkit-sprint-ship-loop` or `fkit-lead`,
with four fields — (a) caller, (b) the approved plan verbatim or the exact approved scope, (c) the
owner's approval quoted verbatim with date and channel, (d) worker role = Build or Process-review.
**Commit and push are explicitly not covered.** ⚠️ At filing (2026-10-06) ADR-055 is **not yet
recorded** — no `adr-055-*` file exists in `ai-agents/knowledge-base/decisions/`. This task needs its
marker shape to exist, hence the dependency below.

**Decisions this touches — read before step 2:**
- [ADR-049](../../../knowledge-base/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
  **D2** — *"Human verification is anchored at the git commit"*: the commit rule is *"the one point in
  the system where a human is reliably in the loop."* ⚠️ **A relayed commit may weaken that anchor** —
  the owner would answer a lead's question instead of acting on the commit himself. The ADR's own
  caveat already says the anchor *"authorizes; it does not verify content."* Step 2 must say plainly
  whether commit relay weakens D2, by how much, and whether D2 needs an amendment.
- [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)
  — approval leaves no artifact; the spawned coder cannot check that the owner approved anything.
- [ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
  **A3** (*"this is trust, not proof"*: the marker is prose, a confused or injected driver prompt could
  assert it falsely) and **A4** (the do-not-re-raise guard). ⚠️ A forged marker today costs a bad
  edit left in the working tree; a forged commit marker costs a commit in history. Step 2 must say
  whether that is "the same accepted cost" or a larger one — A4 forbids re-raising A3 itself, not
  pricing a new path.
- [ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
  — the conductor path and its honesty clause.
- [ADR-037](../../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)
  — a relayed owner ruling and a spawned worker. ⚠️ Unlike source writes, the commit rule is a
  **universal hard rule** (Tier 1), which `0475`'s plan keeps *"untouched"*. This task may need to
  touch it; that is why it needs its own decision.

**Overlap — read `0310` first.** Backlog task
[`0310`](../0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work/brief.md)
(owner request 2026-08-15, unruled) decides a commit gate for `/fkit-sprint-ship-loop`. Its open
question 3, *"Who runs the command?"*, weighs *"The driver commits on a 'yes'"* against *"The driver
hands the owner the exact command to run themselves"*. **Commit relay is a third answer to that same
question** (a spawned coder commits on a relayed "yes"). The two must not be decided apart and end up
contradicting each other. Step 1 asks the owner how to handle that.

**Push stays out**, whatever is ruled here, unless the owner says otherwise in his own words.

## What to build

This is a **decision task**. It ends in an owner ruling and, if the answer is yes, a recorded ADR.
**No prompt, skill, or hook text is changed here.** If the owner rules yes, the producer files a
separate build brief afterwards.

1. **Owner ruling — do it at all?** (Lead or producer session, `AskUserQuestion`.) Put three
   questions to the owner, each with its cost in plain words:
   - **(a) Should a spawned coder ever run `git commit` on a relayed approval?** Options at minimum:
     *yes, under the shared marker*; *no — the owner always runs the commit himself (the lead hands
     him the exact command)*; *no change — today's rule stands*.
   - **(b) How does this relate to `0310`?** Decide together with `0310`'s question 3, fold one task
     into the other, or keep them separate and ordered.
   - **(c) Push** — confirm it stays out (expected: yes).

   If (a) is "no", record the ruling in this brief's Notes and route it to the producer to close as
   cancelled with that reason. Stop.

2. **If yes — architect records the decision.** `/fkit-record-decision` (architect-only). The
   architect chooses between a dated amendment to ADR-055 and a new ADR, and says why. The ADR must
   cover:
   - **Marker shape.** Reuse ADR-055's four fields with a new worker role, Commit. Field (b) becomes
     the **exact commit scope**: the named paths to stage, the commit message verbatim, and the branch.
     Field (c) is the owner's approval of **that** scope, quoted verbatim with date and channel. A
     summary such as "the owner said commit" is not enough.
   - **What still refuses**, at minimum: no marker; a paraphrased approval; an approval that does not
     plainly cover the paths and message carried; *"commit everything"* / `git add -A` scope; any push;
     amend, rebase, or force; a tree whose staged set differs from the approved scope when the commit
     is about to run.
   - **ADR-049 D2** — say whether commit relay weakens the anchor, and amend D2 (dated note) if it
     does. State the residual risk plainly; do not dress it up as verification.
   - **ADR-032 A3** — price the forged-commit cost against the forged-write cost.
   - **The universal hard rule** — does its wording change, and if so to what? Weigh the rules-block
     byte cap (`RULES_MAX` in `claude/fkit-claude-init.sh`; ADR-030 records little headroom).
   - **Agent-closed attribution** — a commit made by a spawned coder: does its message carry any
     marker (for example, which session relayed it)? The owner must be able to tell an agent-run commit
     from his own.
   - **Consistency with `0310`** per the step 1(b) ruling.

3. **Owner accepts the ADR** (status Accepted, not Proposed) before any build brief is filed.

4. **Hand back to the producer** to file the build brief(s) — likely `fkit-coder.md`, `fkit-lead.md`,
   a test pinning the refusal list, and the `CLAUDE.md` rule if step 2 changes it.

**Out of scope:** push, in any form. Any structural (non-prose) approval check — ADR-021 says approval
leaves no artifact, and ADR-032 A4 forbids re-raising the "it is only prose" point as a finding. The
signing-key option ADR-049 D2 prices (*"Not adopted here, not rejected"*) — stays a separate question
unless the owner raises it. Changing `0475`'s scope.

## Verification steps

1. The owner's ruling on step 1 (a)–(c) is recorded in this brief's Notes, **quoted verbatim** with
   date and channel.
2. If "no": the brief carries the ruling and has been routed to the producer for cancellation. Nothing
   else changed: `git diff` shows no edit under `claude/` or to `CLAUDE.md` from this task.
3. If "yes": an ADR (new, or a dated ADR-055 amendment) exists under
   `ai-agents/knowledge-base/decisions/`, status Accepted, and `grep` finds in it: the Commit worker
   role; the exact-scope field (paths, message verbatim, branch); the refusal list including push,
   amend/force, and `git add -A`; an explicit ADR-049 D2 paragraph; an explicit ADR-032 A3 pricing
   paragraph; the `0310` relation.
4. If ADR-049 D2 was judged weakened: ADR-049 carries a dated note pointing at the new decision.
5. No file under `claude/`, `.claude/`, or `test/` is changed by this task (`git diff --stat` scoped to
   those paths, compared with a snapshot taken at start, since other tasks may have open edits).
6. The full test suite still passes (`npm test`); state the pass count. (ADR files are checked by the
   docs tests' link checks.)

## Notes
- **Depends on:** 0475
- **Blocks:** nothing
- **Related:** `0310` (same question from the sprint-loop side: its open question 3, *"Who runs the
  command?"*). Not a hard dependency — the step 1(b) ruling decides the ordering.
- **Why `fkit-architect` owns it:** the work is a ruling plus an ADR; `/fkit-record-decision` is
  architect-only. The build that may follow is `fkit-coder`'s, in a separate brief.
- **Why one brief, not a decision + build pair:** the build's shape is unknown until the owner rules
  and the ADR exists (investigation-first). Filing a build brief now would guess at an answer the owner
  has not given.
- **Open questions for the owner** (step 1): (a) commit relay at all; (b) how it relates to `0310`;
  (c) push stays out. Recommended at filing: none on (a) — it is a real trade between fewer owner
  interruptions and a weaker human anchor at the commit (ADR-049 D2), and the owner should hear the
  architect's pricing first. On (b): decide together with `0310`'s question 3, so the two answers
  cannot contradict. On (c): push stays out.
- Filed 2026-10-06 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
