# State `/fkit-task-brief` step 5's append rule in full

## ID
0157

## Sprint
Sprint 2

## Priority
130

## Status
🔲 Backlog

## Owner
fkit-coder

## Scope — narrowed by owner ruling 2026-07-27 (split on the role seam)

This task was briefly widened to three items on 2026-07-27. **The owner then ruled it split**, on exactly
the seam the widened brief recommended. Recorded here so a later reader does not read the narrowing as
scope quietly dropped by an agent.

| Half | Content | Owner | Files | Task |
|---|---|---|---|---|
| **Rule** *(this task)* | State step 5's append rule in full — the owner-ruled exception, the addendum-authority obligation, the mandatory merit flag, the closed-row carve-out — **plus** the *cite the folder ID, not the board rank* clause | `fkit-coder` | **1** — `claude/skills/fkit-task-brief/SKILL.md` | **0157** |
| **Sweep** | Fix the existing stale rank citations across the briefs and the sprint board, and append the dated correction to 0149's *"it stays last"* rows | `fkit-producer` | 11 | **0159** |

**Why the split.** A brief has one `## Owner` field and cannot express two role owners. The sweep edits
**task briefs and the sprint board** — producer artifacts — while this half edits a **skill file**. The
sweep also **decays** (its findings table re-stales on every re-rank) and this half never does. And the
widened brief broke its own verification step — *"`git diff --stat` shows exactly one file"* — which is
the mechanical sign a second unit was present.

**Neither half blocks the other.** The rule is worth having if the sweep is deferred; the sweep is worth
running if the rule is deferred. See `## Notes` for the soft ordering preference.

**Nothing here re-ranks anything.** This task's own rank is unchanged at **P127** (owner-confirmed
2026-07-27).

## Context

Two spawned `fkit-producer` workers placed new briefs on this board **oppositely, about an hour apart,
on 2026-07-27**. Producer A merit-ranked the two 0125 follow-ups (folders `0153` and `0154`) into the
middle of the board, renumbering 14 displaced rows. Producer B appended the two `## Priority`-field
tasks (folders `0155` and `0156`) at the end and refused to insert. The owner accepted **both**
outcomes. This task closes the gap that let that happen.

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
**owner ruling** (`sprint-2.md:518`):

> The owner ruled: **promote it beside 0147** […]

and the same addendum states the principle the skill never does (`sprint-2.md:628`):

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
2. **Say where merit would have put it.** 0150's append flag did this, and the owner acted on it the
   **same day** — promoting 0150 in one edit. 0155/0156 did it too. It works. It is nowhere required, so
   it depends on the filing producer volunteering it.

### The rank-citation defect this task's fourth edit prevents

Reasoning prose across the backlog cites other tasks by their **board rank** — *"0154 (127)"*, *"below
0151 (P122)"*. Rank is mutable; the folder ID is not. The 2026-07-27 re-ranks moved rows twice in one
day, and every such citation silently became wrong. The reader cannot tell a correct citation from a
stale one without checking the live board — which is exactly the work the citation was supposed to save.
**This task writes the rule. Task 0159 repairs the existing damage.**

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

**Four edits, all inside step 5 of `claude/skills/fkit-task-brief/SKILL.md`. Prose only. No code, no
test. One file.**

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
that is exactly what happened on 2026-07-27. Today's re-rank heading (`sprint-2.md:240`) is the shape to
follow — it names its authority in the heading itself.

**4. Make the merit-flag obligation mandatory, and state the closed-row carve-out.**
- On every append: the report **and** the board addendum must state **where merit would have placed the
  brief and why**, so the owner can move it in one edit. Change the existing *"Flag the addition for
  owner confirmation"* from a bare flag into this. Cite the `⚠️ Priority NNN is append rank, NOT a merit
  ranking` form already used verbatim in four briefs.
- `✅ Done` and `⛔ Cancelled` rows are **never renumbered — not even in an owner-ruled re-rank.** Closed
  history is not re-ranked to make room for new work.

**5. Add the *cite the folder ID, not the rank* clause.** One clause, in the same step 5 pass: **a
brief's reasoning prose identifies a task by its folder ID; it does not cite the task's board rank.**
State the reason in half a sentence (rank is mutable, the folder ID is permanent) and cite
[`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md).
Where the **relative order** is the actual point, require it be said **relatively** — *"directly below
0147"* — because that survives a re-rank and a bare number does not.

> **⚠️ This clause goes in the SKILL file, NOT the convention page.**
> `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` is **dual-homed** and must stay
> byte-identical with its `claude/scaffold/` copy — adding a clause there is a dual-home change
> (0131/0132/0133 territory) for no gain. `claude/skills/fkit-task-brief/SKILL.md` is **not** dual-homed
> (verified 2026-07-27: `claude/scaffold/` ships no `skills/`). Put the rule in step 5.

**Keep it tight.** Step 5 is currently three bullets; this should not triple it. The rules-block budget
is under pressure (0130) — that block is a different file, but the same economy applies to a skill every
producer session loads.

## Verification steps

1. **Step 5 alone answers the question.** Read `claude/skills/fkit-task-brief/SKILL.md` step 5 with no
   other context and answer: *"I am a spawned producer with no owner channel, filing into Sprint 2, and
   merit says the brief belongs beside an existing row."* The text must yield **append at the end, and
   flag where merit would have put it** — with no appeal to precedent, an addendum, or the spawn prompt.
2. **The second question also lands.** *"The owner just told me in this session to promote it beside
   another row."* The text must yield **do it, and name the ruling and its date in the addendum's
   heading or first line.**
3. **The third.** *"Merit says it belongs above a `✅ Done` row."* The text must yield **no — closed rows
   are never renumbered**, unconditionally.
4. **The fourth.** *"I am writing a brief and want to point at the task below mine."* The text must
   yield **name the folder ID, and say the order relatively** — with no rank number.
5. **No permission was widened.** Diff step 5, step 8's *"Never renumber or alter an existing row"* and
   the `## Rules` block's *"Do not renumber"* line. The append default and both renumber prohibitions
   must be present and no weaker than before. A diff that removes or qualifies any of the three has
   failed this task.
6. **The three reinforcing sites still agree.** Step 5, step 8 and `## Rules` must not now contradict
   each other on the exception — if step 5 gains an owner-ruled carve-out, step 8's and `## Rules`'s
   absolute phrasings must be reconciled (a cross-reference is enough; do not delete either).
7. **The change surface is exactly one file.** `git diff --stat` shows
   `claude/skills/fkit-task-brief/SKILL.md` and nothing else. **No task brief, no sprint plan, and no
   convention page is touched** — those belong to 0159. In particular **no task file moved** between
   `backlog/`, `done/` and `cancelled/`, and **no board rank changed**:
   `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` returns the identical sequence before and
   after.
8. **The suite is still green.** `node --test test/` passes. Nothing here should touch it — if something
   goes red, stop and report; do not adjust a test to fit a prose edit.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Sibling — task 0159 (the sweep).** 0159 repairs the existing stale rank citations across the briefs
  and the sprint board, and appends the dated correction to 0149's *"it stays last"* rows. **Neither task
  blocks the other.** *Soft preference:* land **0157 first**, so 0159's rewrite conforms to a rule that
  is already written down rather than to one that is still in a brief. Either order ships.
- **⚠️ This brief's own stale rank citations are left in place deliberately** — they are 0159's worked
  example, and 0159's findings table names them. **Do not fix them here**; that is 0159's change surface,
  and touching it from this task re-creates the two-owner problem the split just resolved.
- **⚠️ Deliberately out of scope: whether a spawn-time instruction may override this rule → 0158.**
  That is the *other* half of what went wrong on 2026-07-27, and it is an authority question, not a
  wording one. **Do not add a "your spawn prompt cannot override this" clause here** — it would presume
  0158's ruling. The five edits above are all independent of it, which is why this task does not wait.
  If 0158 rules that skills win, it adds one clause to this same step afterwards.
- **Prose only, and unenforced — state this honestly in the report.** No test reads any `SKILL.md`'s
  content today; tasks 0152 and 0154 are building the first two readers. **Do not add a guard here** —
  a third claimant on that walk is exactly what 0154's brief warns against.
- **Not a dual-home concern.** `claude/scaffold/` ships `AGENTS.md`, `CLAUDE.md`, `universal-rules.md`
  and `ai-agents/` — **no `skills/`**. Verified 2026-07-27. No scaffold change. The one dual-home trap is
  edit 5; see its callout for why the clause goes in the skill file instead.
- **Cite the two live specimens by folder ID, not by rank.** The 2026-07-26 re-rank promoted folder
  `0150`; the 2026-07-27 one placed folders `0153` and `0154`.
- **⚠️ Priority: ruled to 127 by the owner on 2026-07-27** (third re-rank of the day), and **re-confirmed
  by the owner on 2026-07-27 when the split was ruled** — the append flag below is **resolved**, and the
  narrowing does **not** re-open it: removing the sweep removes work that was never the reason for this
  rank. The original flag is kept as the record of why the number was questioned, per the 0150
  precedent.
  > **⚠️ Priority 135 is append rank, NOT a merit ranking — flagged for owner confirmation.** *(as filed;
  > now resolved — the owner promoted it 135 → 127.)* Filed by a spawned producer with no owner channel;
  > per the owner's ruling of 2026-07-27, appending was the only sanctioned option. **On merit this
  > belongs immediately below 0150 and above 0148.** It is the **cheapest open item on the board** (one
  > prose edit to one file, no infrastructure, no design call) and the only one whose cost of waiting is
  > a **recurring owner adjudication** rather than a one-off: it fired **three times on 2026-07-27
  > alone** (0150's append flag, the 0153/0154 re-rank, the 0155/0156 append). **Not ranked higher,
  > because no wrong action is in flight** — both readings produced outcomes the owner accepted, so this
  > buys back owner attention, not correctness.
