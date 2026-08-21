# Architect question — does the ADR-018 ownership lock cover a role running another role's skill scripts via `bash`?

## ID
0305

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### ⛔ What this task is, and what it is NOT

**This task ASKS a question and returns a recommendation for the owner to rule on.**

⛔ **It does NOT pick an answer, and it does NOT implement one.** No hook change, no guard added to any
script, no edit to `claude/`, `test/` or `bin/`. ⚠️ **There is a serious case that today's behaviour is
BY DESIGN** — see *The case that this is deliberate* below. ⛔ **A run that arrives assuming a hole and
writes a fix has failed this task**, and so has a run that assumes it is fine and writes nothing down.
⭐ **Either answer is a good outcome, provided it is recorded as a considered decision rather than left
as an assumption nobody checked.**

### Provenance

**Owner ruling, 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned producer — **the option label is the verbatim text**:
**"File it as its own architect row (Recommended)"**.

⛔ **The owner explicitly REJECTED folding this into
[`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)**,
on the stated grounds that **it applies to every role's scripts, not just heal's**. `0303` raises the
same mechanism but scoped to one instance — *may the **lead** run `check.sh`, which never writes?*
⭐ **This row is the general question.** ⛔ Do not re-merge them, and ⛔ do not let either assume the
other settled it.

⚠️ **Unranked, no sprint** — filed by a spawned producer with no owner channel
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
so this row appends and renumbers nothing. ⚠️ **There is no active sprint**:
[`0294`](../../done/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/brief.md)
archived Sprint 5 on 2026-08-14 and opened no successor; `select-active` returns `active none` (exit
**3**, the documented no-active-sprint code — **not** a failure).

### The finding, re-verified on disk 2026-08-14

⚠️ **Anchor on the quoted text, not the line numbers** — they will move. ⚠️ **Re-verify every item
below yourself before reasoning from it**; the brief states what was observed, not what is true forever.

**1. The lock is documented as covering `Skill` calls, at any depth.** `claude/fkit-claude.sh`'s header
block, describing the second of the two locks every session carries:

> `--settings` wiring a `PreToolUse` hook (skill-ownership-hook.sh, task 43 / ADR-018) that denies
> any `Skill` call whose REAL invoking agent's role doesn't own it, per skills_for_role() — at any
> spawn depth, not just this session.

**2. The hook matches on `Skill` and nothing else.** `claude/skill-ownership-hook.sh` gates on the tool
name and refuses anything that is not `Skill`, with its own comment recording that this is defensive
rather than load-bearing because *"the hook is registered with matcher `Skill` in `build_settings()`"*:

> `case "$tool_name" in`
> `  Skill) : ;;`
> `  *) deny "unexpected tool_name '$tool_name' reached a hook registered for Skill only" ;;`

⭐ **So the hook is never consulted for a `Bash` call at all** — not "consulted and allowed", **not
consulted**. That distinction matters to the argument and should be stated precisely.

**3. Role procedures also exist as shell scripts.** A `find` over `claude/skills/` for `*.sh` returns
**exactly three files** — ⚠️ re-run it, the set will grow:

| Script | Skill | Owning role | Writes? |
|---|---|---|---|
| `claude/skills/fkit-heal/check.sh` | `fkit-heal` | **producer** | ⭐ never, in any branch |
| `claude/skills/fkit-heal/repair.sh` | `fkit-heal` | **producer** | ⛔ **yes — `apply` writes files in place** |
| `claude/skills/fkit-status/dashboard.sh` | `fkit-status` | **producer** | no (renders a board) |

⚠️ **Note what that table shows and the request did not:** every executable skill script that exists
today is **producer-owned**. So the live exposure, if it is one, is *"any Bash-capable role can run the
producer's scripts"* — ⭐ **which is a sharper and narrower statement than "roles can run each other's
scripts", and the decision should be made against the real surface, not the abstract one.**

**4. Invoking one is a `Bash` call, not a `Skill` call.** All three files are mode `644` — **not
executable** — and are invoked as `bash <path>`; `dashboard.sh`'s own header records why (*"it rides a
GitHub tarball + `cp -R` chain that does not guarantee the exec bit … Invoking through `bash` sidesteps
the [problem]"*). ⚠️ **This is worth noticing, not glossed:** the delivery mechanism guarantees the
`bash` prefix, so the `Bash`-not-`Skill` shape is not incidental — it is how these scripts are always
run, including by their owning role.

**5. `Bash` is available to every role but one.**
[ADR-022](../../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)
relaxed the per-role tool allowlist for the six Claude-side roles; only the adversarial reviewer keeps
an explicit `tools:` line, and ⚠️ **that line includes `Bash` too** (`tools: Read, Grep, Glob, Bash,
Skill`). ⛔ **So on the face of it, every one of the seven roles can invoke any of the three scripts,
and the ownership hook never sees it.**

**6. The scripts carry no caller-identity guard.** A grep of all three for `agent_type`, `FKIT_ROLE`,
`skills_for_role` and `caller` returns **only comment matches about the calling *code***, never a check
on the invoking *role*. ⚠️ **The driver did not check this; this brief did, and reports it as a
single-turn observation — re-verify it.** The guards `repair.sh` **does** carry are numerous and
serious, but they all constrain **what** may be written, never **who** asked: path validation, an
`ai-agents/wiki-vault/` refusal, symlink and hard-link refusals, an eligibility re-check, an apply-time
freshness re-check, and a written-bytes re-hash.

**7. ⚠️ The consent gate is prose-side by construction — verify this, it is the sharpest point.**
`repair.sh`'s own header states the division of labour:

> the LLM's only jobs are to PRESENT the proposal verbatim and collect the owner's consent; this
> script computes what would change and applies exactly what was approved.

and `apply` *"reads approved `item` lines VERBATIM on stdin"*. ⭐ **Nothing in the script verifies that a
human was ever asked** — it verifies the items are eligible, unchanged, and safely writable. ⛔ **So the
question is not only "can the wrong role run this", it is "does anything mechanical stand between
`propose` and `apply`".** ⚠️ **Establish empirically whether feeding `propose`'s `item` lines straight
into `apply` actually applies them** — ⛔ **do not assert it from reading; run it in a throwaway copy,
or say plainly that you did not.**

⚠️⚠️ **And weigh the honest counter before treating that as a finding:** this may be the **already-accepted
posture** of
[ADR-039](../../../knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md)
rather than a new gap — the consent obligation was **deliberately** placed in the LLM's prose, and
`ADR-017`'s deterministic-mechanics-in-scripts split is what put it there. ⛔ **If so, say so and close
it; do not re-open ADR-039 by the back door.**

### ⭐ The case that this is DELIBERATE — state it fairly before arguing against it

**ADR-018 locks the *procedure*, not the files on disk.** Read its Decision section: every clause is
about the `Skill` tool — *"Emits an explicit `hookSpecificOutput.permissionDecision` deny if the
requested skill is not in that role's list"* — and its §5 accepts a residual (a foreign skill stays
**visible** in the `/` menu) on the reasoning that *"the properties that matter — a coder cannot **run**
the reviewer's procedure, at any depth — are what the hook protects."* ⚠️ **Whether "the procedure" means
the SKILL.md instructions or also the bytes those instructions shell out to is the question, and
ADR-018's text does not obviously settle it either way.** ⛔ **Do not paraphrase it — quote it.**

**And ADR-022 opened tools deliberately, with the split named.** Its §4, verbatim:

> The skill lockdown is unchanged and out of scope. The ADR-018 `PreToolUse` hook still governs
> `fkit-*` skills by role … This ADR relaxes **tools (generic capabilities)**, not **skills (named,
> role-owned procedures)**. Freeing capabilities while keeping the *procedures* role-locked is a
> coherent, deliberate posture — the cheap, meaningful separation (a role can't run another's
> procedure) stays; the blunt one (a role can't hold a generic tool) goes.

⭐⭐ **That paragraph is the crux, and it cuts both ways — say which way and why.** *"A role can't run
another's procedure"* is asserted as the property that **stays**; `bash repair.sh apply` is, on one
reading, running another role's procedure with a generic tool. On the other reading, the script is
mechanics rather than procedure, and the sentence was only ever about the `Skill` tool it names.
⛔ **A recommendation that does not engage this paragraph directly has not done the task.**

### ⚠️ The pressure on the "by design" reading — engage it, don't wave it through

**ADR-018 §6 rejected prose-only enforcement, in terms that transfer.** It names the rejected
alternative as *"prose-only self-refusal with no hook backstop"*, rejected because it is *"defeatable by
prompt injection or a simply confused subagent"*, citing ADR-012's evidence of *a spawned `fkit-lead`
that was stopped only by prose*. ⚠️ **On the `bash` path today, prose is exactly what is left** — each
SKILL.md carries a `## ⛔ Owner: the **producer**` banner (verified present in both
`claude/skills/fkit-heal/SKILL.md` and `claude/skills/fkit-status/SKILL.md`), and ⛔ **an agent that
invokes the script directly need never open SKILL.md to see it.** ⚠️ **Whether that is the same hazard
ADR-018 rejected, or a different and acceptable one, is a judgement — make it explicitly.**

**And `repair.sh`'s write capability may change the answer.** ⭐ `check.sh` never writes, so the benign
*"read-only shortcut"* reading — the one `0303` reaches for — covers it comfortably. ⛔ **It does not
cover `repair.sh`.** ⚠️ **Say whether the answer is the same for both, or splits.** A split answer
(*read-only scripts are free, writing scripts are not*) is a legitimate outcome and should be considered
on its merits, ⛔ **but only if the boundary it draws is stated in a form something could actually
enforce** — "read-only" is not a property the hook can see.

### The questions this task must answer

⛔ **Answer them; do not merely restate them.** ⚠️ An item acknowledged but undecided is **not** answered
— say plainly which are open and why.

1. **What did ADR-018 actually decide?** Does the lock intend to cover script invocation, or only skill
   invocation? Quote its own words. ⚠️ **If the honest answer is "it did not consider the question",
   say that** — that is a finding, not a failure.
2. **Does `repair.sh`'s write capability change the answer versus `check.sh`'s read-only one?** Answer
   for both, and say whether they split.
3. **Is this reachable in practice, or does something else stop it?** ⚠️ **Verify, do not assume.**
   Cover at least: the scripts' own guards (see finding 6 — ⛔ re-verify, do not take this brief's word);
   whether `apply` can be driven from `propose` with no human in between (finding 7); and whether
   anything outside the scripts — a permission prompt, a settings rule, a hook on `Bash` — intervenes.
   ⭐ **A negative result here is a first-class answer**: if something already stops it, this row closes
   with "no gap, here is why", which is exactly the record the owner asked for.
4. **If it is a real gap: the options and their costs.** ⛔ **The brief does not pick one, and neither
   should the recommendation pre-empt the owner's ruling** — but the options must be priced, not
   listed. At minimum: a `PreToolUse` matcher on `Bash` (⚠️ price the false-positive surface honestly —
   the hook would have to parse a shell command line, which is a different and harder problem than
   reading a `skill` field out of JSON, and ADR-018's fail-**open** hazard applies to every new code
   path); guards inside the scripts (⚠️ price the fact that the scripts have no reliable way to learn
   the caller's role — say so if that is what you find); and **accept-and-document** (⚠️ price what
   documenting it costs and where it would live — an ADR, a SKILL.md line, `architecture.md`).
5. **⚠️ Scope beyond heal — the reason this is not `0303`'s question.** Enumerate which roles' skills
   ship executable scripts (the finding-3 table is a starting point, ⛔ not an authority — re-run the
   find). ⚠️ **State the growth argument either way**: if the surface is three producer-owned scripts
   today, is a structural fix warranted now, or is the right answer a **rule about future scripts**?
   ⛔ **"It is only three files" is an argument that must be made explicitly if it is being relied on,
   not left implicit.**

## What to build

**One architecture decision document with a clear recommendation** — via `/fkit-record-decision` **or**
`/fkit-evaluate-approach`, filed under `ai-agents/knowledge-base/decisions/` or
`ai-agents/knowledge-base/reports/` respectively. ⚠️ **Which of the two is right is itself the
architect's call**, on the same reasoning
[`0304`](../0304-decide-whether-fkit-heal-warrants-its-own-role/brief.md) records: ⛔ **do not write an
ADR recording a decision the owner has not made.** ⭐ If the finding is *"this is by design, here is the
evidence"*, an ADR recording that as a considered position is appropriate and is the whole point of the
row; if the finding is *"there is a gap, here are three priced options"*, that is an evaluation for the
owner to rule on.

The document must:

1. Answer the five questions above, each traceable.
2. Quote ADR-018's Decision text and ADR-022 §4 **verbatim** and say which way each cuts.
3. State the recommendation in one line with its **main tradeoff named** — ⛔ not five options with
   caveats.
4. ⭐ **Record the negative result if that is the result.** "Considered, no change needed, because X"
   is a successful run.

## Verification steps

1. **The document exists** under `ai-agents/knowledge-base/decisions/` or
   `ai-agents/knowledge-base/reports/`, and **nothing was written under `ai-agents/wiki-vault/`**. Show
   `git status --porcelain` and confirm no vault path appears.

2. **The hook's matcher was verified on disk, not taken from this brief.** Quote the `case "$tool_name"`
   block from `claude/skill-ownership-hook.sh` **and** the `matcher` registration in the launcher's
   `build_settings()`. ⚠️ **If the hook is registered for anything beyond `Skill`, STOP and report** —
   the whole premise falls, and that is a good outcome, not a wasted run.

3. **The script inventory was re-derived, not copied.** Show the command and its output (a `find` over
   `claude/skills/` for executable scripts). ⚠️ **If it returns a file this brief does not list, say so**
   — the surface grew between filing and doing.

4. **Question 3 was answered empirically.** Either show the run that establishes whether `propose` can
   drive `apply` unattended (⚠️ **in a throwaway copy, never this repo's live tree**), or state plainly
   that it was **not** run and that the answer is therefore reasoned rather than observed. ⛔ **Do not
   present a reading of the source as if it were an execution.**

5. **ADR-018 and ADR-022 are quoted, not paraphrased**, and each is said to cut one way or the other.
   ⛔ A document that cites them as "related work" without taking a position on ADR-022 §4's *"a role
   can't run another's procedure"* has **not** met this step.

6. **All five questions are answered or explicitly marked open with a reason.**

7. ⛔ **`git diff --stat` must list NO file under `claude/`, `test/`, or `bin/`.** This task decides; it
   does not build. ⛔ **A hook change, a script guard, or a `tools:` edit made here is a failed run**,
   however good the argument for it.

## Notes

- **⚠️ DATED NOTE 2026-08-15 (`0306`) — THE BLOCKQUOTE IN EVIDENCE ITEM 1 HAS SINCE BEEN REWRITTEN
  AND REWRAPPED. It is DELIBERATELY LEFT byte-identical; it is now a quotation of text that no longer
  exists.** `0306` repaired the stale pre-ADR-029 numeral `task 43` across `claude/`.
  - **What this brief quotes** (`claude/fkit-claude.sh`, as it read before 2026-08-15):
    *"`--settings` wiring a `PreToolUse` hook (skill-ownership-hook.sh, task 43 / ADR-018) that
    denies any `Skill` call whose REAL invoking agent's role doesn't own it, per skills_for_role() —
    at any spawn depth, not just this session."*
  - **What that header says today** — same three claims, `task 43` → `` `0052` ``, and the first
    line split in two to stay inside the file's comment width:
    *"`--settings` wiring a `PreToolUse` hook (skill-ownership-hook.sh, `0052`
    (`implement-pretooluse-skill-ownership-hook`) / ADR-018) that denies any `Skill` call whose REAL
    invoking agent's role doesn't own it, per skills_for_role() — at any spawn depth, not just this
    session."*
  - **`task 43` = `ai-agents/tasks/done/0052-implement-pretooluse-skill-ownership-hook/`.**
    ⛔ Not `0043-fix-scaffold-knowledge-base-folders`, which the bare numeral lands on by coincidence.
  ⛔ **The finding this evidence supports is unaffected** — the wording change is the numeral and the
  line break; **"denies any `Skill` call … at any spawn depth" is unchanged**, so the question this
  task asks (does the lock reach a skill script run via `Bash`?) is exactly as open as it was.
  ⚠️ **Re-read the header first-hand before reasoning from it**, as this brief's own preamble
  instructs.
- **Depends on:** nothing
- **Blocks:** nothing

⚠️ **Related to [`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md),
and explicitly NOT a dependency — owner-ruled.** `0303` scoped only the **read-only shortcut for the
lead** (*may the lead run `check.sh`, which never writes?*); ⭐ **this row is the general question across
every role's scripts, including the one that writes.** ⛔ **Neither blocks the other and either order is
safe** — but ⛔ **neither may assume the other settled it**, which is why both records say so. ⚠️ **If
`0303`'s design pass answers its narrow role-boundary item, that answer is INPUT here, not a
substitute** — a ruling scoped to one read-only script does not decide the general case, and this row
must say so rather than inheriting it.

⚠️ **Also related, and not a dependency:**
[`0304`](../0304-decide-whether-fkit-heal-warrants-its-own-role/brief.md) — if `/fkit-heal` moved to a
different role or gained its own, the *ownership* half of this question changes shape, though the
**mechanism** half (a hook that matches `Skill` and not `Bash`) does not. ⛔ Do not gate either on the
other.

### ⚠️ If the answer is "it is a real gap" — that is still not authorization to fix it

⛔ **This task returns a recommendation for the OWNER to rule on.** Implementing any fix — a `Bash`
matcher, a script guard, a documented acceptance — is a **separate task**, filed by a producer **only
after** the owner has ruled. ⚠️ This mirrors `0304`'s standing constraint and is stated here so the two
rows behave the same way.

### ⛔ Scope fences

- ⛔ **Implement nothing.** No edit to `claude/skill-ownership-hook.sh`, `claude/fkit-claude.sh`,
  `claude/skills-for-role.sh`, `claude/skills/`, `claude/agents/`, `test/`, or `bin/`.
- ⛔ **Do not re-open [ADR-039](../../../knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md)
  or [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)
  by the back door.** Finding 7 touches the consent gate; ⚠️ **if the honest conclusion is that ADR-039
  needs revisiting, say so and put it to the owner** — ⛔ do not settle it inside this document.
- ⛔ **Do not write an ADR recording a decision the owner has not made.** If the honest output is a
  weighed comparison, `/fkit-evaluate-approach` is the right skill.
- ⛔ **No re-rank**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  — filed by a spawned producer with no owner channel; unranked (`—`), renumbers nothing.
- ⛔ **No `ai-agents/wiki-vault/` write**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  — if the decision warrants a vault record **once ruled**, it is **routed to `fkit-wiki`**.
- ⛔ **No task-file move**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, **producer-only**, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent.
- ⛔ **No commit, no push.**

### On the owner role — `fkit-architect`, owner-ruled

⛔ **Owner-ruled, not a producer judgement** — verbatim option label **"File it as its own architect row
(Recommended)"**, given live via `AskUserQuestion`, 2026-08-14. The deliverable is a judgement about the
**enforcement model itself** — what ADR-018 locks, what ADR-022 deliberately opened, and where the
boundary between "generic capability" and "role-owned procedure" actually falls. ⚠️ **That is not a
coding decision and it is not a product decision**; it is architect territory by construction.

### ⚠️ State of the tree at filing

Measured 2026-08-14 at filing time: `HEAD` is **`4424b44 "Release v0.2.2"`**, and `git status --short`
showed exactly one modified file (`ai-agents/sprints/backlog.md`) plus three untracked task folders
(`0302`, `0303`, `0304`) — **all of them this filing session's own prior work**. This brief and its board
row are the only additions introduced now.
(`conventions/evidence-before-assertion.md` — asserted from a check made this turn.)
