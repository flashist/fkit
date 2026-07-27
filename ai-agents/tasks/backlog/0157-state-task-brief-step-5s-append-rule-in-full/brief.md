# State `/fkit-task-brief` step 5's append rule in full — the owner-ruled exception, the merit-flag obligation, and the closed-row carve-out

## ID
0157

## Sprint
Sprint 2

## Priority
127

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Two spawned `fkit-producer` workers placed new briefs on this board **oppositely, about an hour apart,
on 2026-07-27**. Producer A merit-ranked 0153/0154 into the middle of the board (P117 and P127),
renumbering 14 displaced rows. Producer B appended 0155/0156 at P133/P134 and refused to insert. The
owner accepted **both** outcomes. This task closes the gap that let that happen.

### What step 5 actually says — read firsthand, quoted verbatim

`claude/skills/fkit-task-brief/SKILL.md`, step 5 (*Determine priority*), first bullet, in full:

> - **Targeting a named sprint:** append **after** the existing highest priority. **Do not renumber or
>   insert into the owner's ranking** — the ranking is theirs, and renumbering silently rewrites their
>   decisions. Flag the addition for owner confirmation in the report.

Reinforced twice more in the same file — step 8's last bullet (*"**Never renumber or alter an existing
row.**"*) and the closing `## Rules` block (*"**Do not renumber** the owner's existing priority
ranking."*).

**So step 5 does not support both readings.** On the default it is unambiguous, and Producer B read it
correctly. The framing that "the rule does not determine the behaviour" is **not what the text shows** —
and Producer A did not misread it either. Its own addendum says so:

> **⚠️ The placement below is producer judgment, not an owner ruling.** The owner approved **filing**;
> the ranking is the filing producer's, made on the lead's instruction to rank on merit rather than
> append. […] `/fkit-task-brief` step 5's default is to append, and the precedent for merit placement at
> filing time is the 2026-07-26 addendum above (0151 at 121, 0152 at 129).

Producer A knew the default and overrode it, for two reasons: **an out-of-band instruction from the
spawning lead session**, and **a misread precedent**.

### The real hole: step 5 describes the default and is silent on the sanctioned exception

The board records **two** merit re-ranks (2026-07-26 and 2026-07-27) — but step 5 reads as an absolute
ban with no path by which a legitimate re-rank could ever happen. That silence is what makes the
2026-07-26 addendum look like producer precedent. It was not. Read in full, that re-rank sits inside an
**owner ruling** (`sprint-2.md:302-305`):

> The owner ruled: **promote it beside 0147** […]

and the same addendum states the principle the skill never does (`sprint-2.md:414`):

> **A re-rank is the owner's call.**

The 0151/0152 rows were merit-placed *in that same owner-present pass* — the addendum's own words are
*"both owner-approved"*. The producer's write-up, though, records the outcome (*"ranked on merit here
rather than appended"*) far more prominently than the authority behind it, and a later producer with no
owner channel read the outcome as the precedent. **An addendum that does not name its authority becomes
tomorrow's precedent for acting without one.**

### Two things both producers reached independently, that no file states

1. **Closed rows are never renumbered.** Both refused to renumber `✅ Done` / `⛔ Cancelled` rows.
   0152's addendum: *"the merit case does not justify rewriting closed history"*; today's:
   *"renumbering closed history is refused here for the same reason"*. This is the de facto rule and it
   is written **only in dated addendum prose**, which is a record of a moment, not an instruction.
2. **Say where merit would have put it.** 0150's `P128` flag did this, and the owner acted on it the
   **same day** — promoting 0150 to 124 in one edit. 0155/0156 did it too. It works. It is nowhere
   required, so it depends on the filing producer volunteering it.

### What was checked, and found to encode nothing

Verified 2026-07-27 by reading each file:

| Site | Verdict |
|---|---|
| `claude/agents/fkit-producer.md` | **Nothing.** Two mentions of "priority", both listing it as a brief field. No placement rule. |
| `claude/universal-rules.md` (the block in `CLAUDE.md`) | **Nothing.** `grep -i "priorit\|rank"` returns no match. |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | **Consumes, never places.** `:81` orders eligible tasks *"by `## Priority`"*. It never tells a spawned producer where a new brief goes. **The "rank on merit" instruction is not in this skill** — it came from the live lead session's spawn prompt (see 0158). |
| `claude/skills/fkit-status/dashboard.sh` + `SKILL.md` | **Nothing.** Treats the Priority cell as mutable rank (`:486`, `:560`). No placement rule. |
| `test/` (13 files) | **Nothing.** `grep -rni "renumber\|merit\|insert into" test/` hits only ADR-number and task-ID uniqueness comments — a different number-space. |
| `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | **Adjacent, not an answer.** Establishes rank is mutable and *"re-ranked whenever the plan changes"* — but never says **who** may re-rank. |
| `ai-agents/wiki-vault/` | **Nothing.** No page records a board-placement rule. Flagged as a wiki gap. |

**So: step 5 is the only site. Nothing else encodes an answer, and nothing enforces it.** Prose only,
unenforced — the same class of finding as 0154's.

## What to build

Four edits, all inside step 5 of `claude/skills/fkit-task-brief/SKILL.md`. **Prose only. No code, no
test.**

**1. Keep the append default exactly as written.** Do not soften it, do not add a merit-ranking
permission. The owner's ruling of 2026-07-27 confirms it: *if merit placement would require inserting
into the ranking, append and flag it instead.*

**2. Add the sanctioned exception — the owner-ruled re-rank.** State that a re-rank is the owner's
call; that a producer executes one only on an **explicit owner ruling given in that session**; and that
a spawned producer with no owner channel therefore **never** re-ranks. This is what step 5 is missing —
without it the skill contradicts two re-ranks the board actually records.

**3. Add the addendum-authority obligation.** When a re-rank *is* written, its addendum must name its
authority **in the heading or the first line** — *"owner ruling, YYYY-MM-DD"*. Say plainly why: an
addendum that records only the outcome becomes a later producer's precedent for acting without one, and
that is exactly what happened on 2026-07-27. Today's re-rank heading (`sprint-2.md:230`) is the
counter-example to cite; 0150's `✅ RESOLVED, same day` note is the shape to follow.

**4. Make the merit-flag obligation mandatory, and state the closed-row carve-out.**
- On every append: the report **and** the board addendum must state **where merit would have placed the
  brief and why**, so the owner can move it in one edit. Change the existing *"Flag the addition for
  owner confirmation"* from a bare flag into this. Cite the `⚠️ Priority NNN is append rank, NOT a merit
  ranking` form already used verbatim in three addenda.
- `✅ Done` and `⛔ Cancelled` rows are **never renumbered — not even in an owner-ruled re-rank.** Closed
  history is not re-ranked to make room for new work.

**Keep it tight.** Step 5 is currently three bullets; this should not triple it. The rules-block budget
is under pressure (0130) — that block is a different file, but the same economy applies to a skill every
producer session loads.

## Verification steps

1. **Step 5 alone answers the question.** Read `claude/skills/fkit-task-brief/SKILL.md` step 5 with no
   other context and answer: *"I am a spawned producer with no owner channel, filing into Sprint 2, and
   merit says P126."* The text must yield **append at the end, and flag P126 as where merit would have
   put it** — with no appeal to precedent, an addendum, or the spawn prompt.
2. **The second question also lands.** *"The owner just told me in this session to promote it to 124."*
   The text must yield **do it, and name the ruling and its date in the addendum's first line.**
3. **The third.** *"Merit says it belongs above a `✅ Done` row at P115."* The text must yield **no —
   closed rows are never renumbered**, unconditionally.
4. **No permission was widened.** Diff step 5, step 8's *"Never renumber or alter an existing row"* and
   the `## Rules` block's *"Do not renumber"* line. The append default and both renumber prohibitions
   must be present and no weaker than before. A diff that removes or qualifies any of the three has
   failed this task.
5. **The three reinforcing sites still agree.** Step 5, step 8 and `## Rules` must not now contradict
   each other on the exception — if step 5 gains an owner-ruled carve-out, step 8's and `## Rules`'s
   absolute phrasings must be reconciled (a cross-reference is enough; do not delete either).
6. **Nothing else changed.** `git diff --stat` shows exactly one file:
   `claude/skills/fkit-task-brief/SKILL.md`. No brief, no board row, no sprint plan.
7. **The suite is still green.** `node --test test/` passes. Nothing here should touch it — if
   something goes red, stop and report; do not adjust a test to fit a prose edit.

## Notes

- **Depends on: nothing.**
- **Blocks: nothing.**
- **⚠️ Deliberately out of scope: whether a spawn-time instruction may override this rule → 0158.**
  That is the *other* half of what went wrong on 2026-07-27, and it is an authority question, not a
  wording one. **Do not add a "your spawn prompt cannot override this" clause here** — it would presume
  0158's ruling. The four edits above are all independent of it, which is why this task does not wait.
  If 0158 rules that skills win, it adds one clause to this same step afterwards.
- **Prose only, and unenforced — state this honestly in the report.** No test reads any `SKILL.md`'s
  content today; 0152 (P131) and 0154 (P127) are building the first two. **Do not add a guard here** —
  a third claimant on that walk is exactly what 0154's brief warns against.
- **Not a dual-home concern.** `claude/scaffold/` ships `AGENTS.md`, `CLAUDE.md`, `universal-rules.md`
  and `ai-agents/` — **no `skills/`**. Verified 2026-07-27. No scaffold change.
- **Cite the two live specimens by ID, not by rank.** The 2026-07-26 re-rank promoted folder `0150`;
  the 2026-07-27 one placed folders `0153`/`0154`. Ranks in this brief (P117, P125…) are mutable board
  rank and may already have moved — `conventions/priority-is-rank-not-identity.md`.
- **⚠️ Priority 135 is append rank, NOT a merit ranking — flagged for owner confirmation.** Filed by a
  spawned producer with no owner channel; per the owner's ruling of 2026-07-27, appending was the only
  sanctioned option. **On merit this belongs at 126** — immediately below 0150 (P125), above 0148
  (P126). It is the **cheapest open item on the board** (one prose edit to one file, no infrastructure,
  no design call) and the only one whose cost of waiting is a **recurring owner adjudication** rather
  than a one-off: it fired **three times on 2026-07-27 alone** (0150's P128 flag, 0153/0154's re-rank,
  0155/0156's append). **Not ranked higher, because no wrong action is in flight** — both readings
  produced outcomes the owner accepted, so this buys back owner attention, not correctness. The
  merit/append gap is **nine slots**.
