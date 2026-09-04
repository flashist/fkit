# Sprint 3 — Close the rank-integrity loop

> ## 🔒 CLOSED — 2026-08-07. Superseded by [Sprint 4](sprint-4.md).
>
> **Sprint 3 was archived by OWNER RULING, 2026-08-07**, given via `AskUserQuestion` in a live
> `fkit lead` session — a selection from the question's option list, **the option label is the
> verbatim text**: **"Follow Sprint 1/2 precedent (Recommended)"**, option description as presented:
> *banner → 🔒 CLOSED superseded-by-Sprint-4, file → `sprints/done/sprint-3.md`, links repointed,
> executed by a spawned producer.* Relayed by `fkit-lead` from the live session; executed by a
> spawned `fkit-producer` with no owner channel.
>
> **Why it was archived.** The board was drained — **4 done · 0 cancelled · 0 moved · 0 open**, all
> four rows `✅ Done (agent-closed — not owner-verified)`. Unlike Sprint 2 this is a plain close, not
> a rollover: no open row moved anywhere. [Sprint 4](sprint-4.md) was opened by its own three
> owner rulings of 2026-08-07 (recorded on its banner) before this archival was ruled; this archival
> discharges the two-active-boards ambiguity Sprint 4's banner flagged.
>
> **This plan is kept, not deleted — it is the record of what was done.** Everything below is
> historical. Do not pick up work from this file; see [Sprint 4](sprint-4.md).
>
> **⚠️ Archived, not frozen.** Sprint 1's and Sprint 2's archived boards were both edited after
> archiving. A dated correction appended below is legitimate; a silent rewrite of a rank or a status
> is not.
>
> **The board's opening authority, kept in full as written 2026-08-06 (only the Sprint 2 link
> repointed for the new home; "Rolled over from [Sprint 2](sprint-2.md)" was this board's original
> banner heading):**
>
> **Authority, stated first and in full.** This board exists by an **owner ruling given 2026-08-06 via
> `AskUserQuestion` in a live `fkit lead` session** — verbatim **"Roll over to Sprint 3."** The archival
> shape was ruled in the same session — **"Follow the Sprint 1 precedent"** — and a third ruling,
> **"Pull it into Sprint 3,"** named task `0182` and accepted that its gate `0181` comes with it.
> Executed by a spawned `fkit-producer` with no owner channel, under task
> [`0185`](../../tasks/done/0185-decide-whether-sprint-2-rolls-over-to-a-fresh-board/brief.md).

**Goal:** Sprint 2 ended having *proved* that this project's board could not represent its own
priorities — an owner-ruled mid-board insertion renumbered eight closed rows, and both written records
of the act claimed it had not happened. Sprint 3 closes that loop: **narrow the rule that allowed it,
build the guard that catches it, and record the one ADR Sprint 2 left authorized but unwritten.** It is
a small, sharp board on purpose.

## ⚠️ Ranks on this board start clean at P1

**This is a fresh board and its rank numbering restarts at `P1`.** It does **not** continue from
Sprint 2's `P190`. That was the point of rolling: new work gets a real rank range instead of appending
behind 188 closed rows.

**The cost, stated honestly:** a bare *"P3"* in the corpus is now ambiguous between two boards. **Cite a
rank with its board** — `Sprint 3 P3`, never a bare `P3`. Sprint 2's ranks are unchanged and stay
readable at [`sprints/done/sprint-2.md`](sprint-2.md).

**ADR-035's wall does not apply here yet.** No row on this board is closed, so every rank below was
assigned **on merit**, freely. The moment a row here closes, its rank freezes and the wall applies
again — a closed row is a wall, not a step.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | Narrow `/fkit-task-brief` step 5 — a mid-board insertion is NOT the owner-ruled re-rank exception *(**follow-up 4 of `0174`'s decision report**, §4.2/§8, and the **decision is already recorded**: [ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md), status **accepted**, owner-signed 2026-08-01 — **this task is the skill edit only and does not re-open it**; **the hole**: step 5's *"The one exception — an owner-ruled re-rank"* and its *"`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner ruling"* were read as compatible and are not, **because of arithmetic**: an insertion renumbers **every row below it**, so on an interleaved board **there is no mid-board insertion point that does not renumber a closed row**; **⚠️ THIS IS THE ONE THAT CLOSES THE HOLE TASK `0174`'S OWN FILING WENT THROUGH — RANK IT ACCORDINGLY**: `0174` was inserted mid-board 2026-08-01 under an explicit owner ruling invoking that exception and **renumbered eight closed rows** — `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160`, all reading `✅ Done` at the time — verified against the filing commit's diff by the architect and **independently re-derived exactly by the reviewer**; the producer recorded authority in full, checked the effect, wrote a specific merit justification, and **still breached an absolute rule, because the check ran in the WRONG DIRECTION** — it verified the ranks *above* the insertion point; *"a rule that survives only until someone reads it carefully is not a rule"*; **the edit**: narrow the exception to **moving an existing row within its own contiguous run of open rows**, state the remedy in the same breath (**append, and record the intent as a canonical merit statement**), and record the corollary that **the append rule is a FORCED CONSEQUENCE of the closed-row rule** — anyone proposing to allow insertions must argue the **closed-row rule**; ⛔ do NOT re-open the decision (ADR-035 rejected *"leave it"*, *"relax the closed-row rule"*, *"formalize the act harder"* and *"revert `0174`"* each by name — a finding proposing any is **closeout, not a new defect**), ⛔ do NOT revert the insertion (it renumbers the same eight a **second** time; the record is corrected by `0183`), ⛔ no `:NNN` citations **and no bullet ordinals** — *"a bullet ordinal is a line number wearing different clothes"*; **⚠️ FILE COLLISION with `0179`**, flagged; **independent — can land first**; **blocks `0182`**; **appended under step 5, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs immediately above `0178`, the HIGHEST MERIT OF THIS BATCH OF EIGHT**, being the only one whose absence has already caused a verified breach; owner: fkit-coder; **⚠️ DATED CORRECTION 2026-08-06 — this row was CARRIED ONTO SPRINT 3 by the rollover, and the append-rank clause above describes its position on the board it came from, not its position here. Sprint 3 is a FRESH board with no closed rows, so `P1`–`P3` are **merit ranks assigned on merit** — ADR-035's closed-row wall does not apply and no append/merit divergence exists on this board. Original clause left byte-identical; the task's scope, dependencies and prohibitions are unaffected. Ranking rationale: §"How this board was ranked" below.**)* | [`0181-narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank`](../../tasks/done/0181-narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | Build `test/closed-rank-immutability.test.js` — no closed row's rank ever changes *(**follow-up 5 of `0174`'s decision report**, §5.3/§8, **ranked LOW**; **why it exists** — report §2 found a breach of an absolute rule that **no existing check caught** and that **both written records of the act claimed had not happened**; **condition**: across a commit range, for every `sprint-*.md`, no row whose status in the **earlier** revision starts with `✅ Done`/`⛔ Cancelled`/`➡️ Moved` carries a different `P<n>` in the **later** revision; **⚠️ rows matched by FOLDER ID, never by rank** — matching by rank makes the guard's own key the thing it is testing; **⚠️ its ceiling, four limits stated up front**: (1) it is a **diff** check, not a state check — no property of a single board file reveals the breach; (2) it therefore **needs git history**, unlike every other test under `test/`, and **cannot run against a bare working tree or a shallow/single-commit clone**; (3) it asserts a **transition, not a state** — it cannot say the current board is correct; (4) **it would be RED on the commit that filed task `0174`**, confirmed by replay, flagging all eight rows — *"that is the test working correctly"*, **and it is the argument for building it**; **🚧 BLOCKED on a baseline decision (§9 OQ2) — exempt history before a named commit, or accept a permanently red run; not choosing means the guard cannot land**, and the exemption must be in the guard's **definition**, not a post-filter (the same lesson `0176`'s closed-ledger exemption records); **✅ DATED CORRECTION 2026-08-06 — THIS ROW IS NO LONGER BLOCKED. The 🚧 clause immediately above is DISCHARGED and is left byte-identical only as history.** Three owner rulings, `AskUserQuestion`, live `fkit lead` session 2026-08-06: ***"Have the architect decide it."*** → the architect delivered → ***"No CI planned."*** and ***"Include it."*** (the `HEAD`↔`HEAD^` second leg). **THE DECISION: baseline = `HEAD`; scope = the transition currently in progress, NOT a history range** — the guard compares each board file's **working-tree** content against its **`HEAD`** blob, plus a second leg comparing `HEAD` against `HEAD^` (**skip cleanly at depth 1**). Criterion, quoted: *"A baseline must be a record you cannot rewrite in the same act that breaks the invariant."* **Rejected by name:** the committed snapshot/manifest (*"a manifest's only repair path is 'regenerate from the current board,' and that launders the breach into the baseline"*) and the git-history range (unbounded cost; carries the permanent red that created this block). ⚠️ **This DISSOLVES the blocking decision rather than answering it** — with no range, `0174`'s filing commit is **not red and not exempted**, it is simply **outside the guard's stated scope**; *a scope is a definition you state once; an exemption is a carve-out every future reviewer re-litigates*. **Recorded as an ADR by [`0240`](../../tasks/backlog/0240-record-the-adr-for-the-closed-rank-guards-baseline/brief.md)**, which is **barred from editing `0182`'s brief** — `0240` carries the decision, this task carries the build; `0240`'s hard dependency on `0222` is **`0240`'s alone and is NOT inherited here**. **This task's only hard dependency remains `0181`.** ⚠️ **TWO CEILING CLAUSES ABOVE ARE NOW WRONG:** **limit (2)** — *"cannot run against a bare working tree or a shallow/single-commit clone"* is wrong in both halves; it **needs a git repo with at least one commit, works at `--depth 1`** (the `HEAD`↔`HEAD^` leg skips with a stated reason), and **a non-git tree skips with a stated reason**; **limit (4)** — *"it would be RED on the commit that filed task `0174`"* is **DELETED**, that commit being out of scope, and **replaced by**: the guard sees only the **current uncommitted transition plus the last committed one**, a breach committed with **no test run in that window is never caught**, and **there is no CI, so nothing runs it automatically**. ⛔ **Do not present this guard as continuous protection.** ⚠️ **TEN FURTHER CORRECTIONS — all now in the brief's §"✅ DECIDED 2026-08-06", and the brief is the buildable specification, not this row**: the **glob** covers `sprints/*.md` **and** `sprints/done/*.md` and **excludes `backlog.md` with a stated reason**; the **join key is `(board basename, folder ID)`**, which **narrows and does not weaken** the *"never by rank"* rule; the **parser must anchor to the `\| Status \| Priority \| Task \| Brief \|` header under `## Status`** because the boards contain **decoy tables carrying both a brief link and a `P<n>` cell** (7 such rows measured on the Sprint 2 board 2026-08-06, against a real table of 189); **naive `split('\|')` mis-fields 8 of those 189 rows** and ⚠️ **the escaped-`\|` explanation covers only 7 — the `0169` row carries a BARE UNESCAPED `\|` inside a code span** — so **failing loudly on an unexpected field count, never skipping**, is the load-bearing half; a **vacuous-pass assertion** on a non-zero live closed-row count (`test/task-id-uniqueness.test.js` precedent); **verification step 3 is KEPT, rewritten as a fixture test over a pure exported comparison function** fed the two `0174` revisions and asserting exactly `0151`/`0147`/`0150`/`0157`/`0161`/`0148`/`0159`/`0160`; an **explicit `➡️ Moved` rule** (a moved row's source-board rank is frozen and never compared to its destination rank); and ⚠️ **an UNRECORDED PROVE-RED DEPENDENCY** — none of `prove-red.sh`'s 14 mutations reaches `ai-agents/`, and **prove-red must never edit the real boards**, so **sequence after `0214`/`0215` or state the gap explicitly**. **All original clauses left byte-identical; the rank `P2` and the hard `0181` gate are unaffected.** failure output must name folder IDs with old and new rank, and a missing-history environment must **skip with a stated reason**, never pass silently; ⛔ do not repair the eight renumbered rows (ADR-035 rejected reverting by name; `0183` corrects the record), ⛔ no new devDependency (ADR-014), ⛔ do not edit any sprint board, ⛔ no `:NNN` citations; **depends on `0181`**; **appended under step 5, flagged for owner confirmation — merit and append coincide** (`- **On merit:** as ranked`); owner: fkit-coder; **⚠️ DATED CORRECTION 2026-08-06 — this row was CARRIED ONTO SPRINT 3 by the rollover, and the append-rank clause above describes its position on the board it came from, not its position here. Sprint 3 is a FRESH board with no closed rows, so `P1`–`P3` are **merit ranks assigned on merit** — ADR-035's closed-row wall does not apply and no append/merit divergence exists on this board. Original clause left byte-identical; the task's scope, dependencies and prohibitions are unaffected. Ranking rationale: §"How this board was ranked" below.**)* | [`0182-build-the-closed-rank-immutability-guard`](../../tasks/done/0182-build-the-closed-rank-immutability-guard/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P3 | Design the post-update structure check against a shipped structure-spec `.md` — and its consent-gated repair path *(**filed on TWO NAMED OWNER RULINGS**, `AskUserQuestion`, live `fkit lead` session **2026-08-06** — board: verbatim **"Sprint 3 (Recommended)"**; shape: verbatim **"My idea is that after update the fkit should check if the structure of the project fits the requirements for the installed version and if needed updated the structure. We can have a verbatim explaination of what is needed in the structure as an .md file that the agents will read after update, will use as a reference for what should be checked (e.g. the explanation of the structure of the folders)."**; **a DESIGN task, not a build — investigation-first**: the shape collides with [ADR-015](../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)'s owner-ratified invariant (*convergence never writes to a path that already exists*; content drift **deferred with eyes open**, Decision §5) and **fires that ADR's own `Re-raise only if` trigger 1, which fires on the PROPOSAL** — this task IS the sanctioned re-raise, run with the record in front of the owner; the design must weigh the ADR's recorded deferred alternative (the **content-identity hash manifest**) rather than re-derive it, must not casually reinstate the **rejected per-project version cursor** (gitignored `.fkit/` cannot survive `git clone`), must not rebuild the rejected *unattended agent executing natural-language items* (consent-gated in-session propose-then-apply is the plausibly compatible shape; **silent auto-update is exactly what the record forbids**), must preserve ADR-005's wiki-vault write exclusivity under every branch, and must make the `CLAUDE.md`/`AGENTS.md` include/exclude call explicitly; **open decisions return to the owner, nothing resolved agent-side**; ⛔ no implementation, ⛔ does not write the spec `.md` itself, ⛔ no ADR-015 amendment (follow-up via `/fkit-record-decision`), ⛔ no `wiki-vault/` write, ⛔ no commit; `Depends on: nothing`; blocks the not-yet-filed implementation units, deliberately unfiled until this lands; owner: fkit-architect; **⚠️ P4 is APPEND rank, NOT a merit ranking — flagged for owner confirmation. On merit this belongs directly below `0182`**, because an owner-ruled product capability with live user impact outranks recording an already-taken decision (`0222`), while `0181`/`0182` — repairs to a control running today, pulled onto this board by the owner by name — stay above it; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035))* | [`0241-design-the-post-update-structure-check-against-a-shipped-spec`](../../tasks/done/0241-design-the-post-update-structure-check-against-a-shipped-spec/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P4 | Record **ADR-038** — a loop step's role is fixed by the skill the step runs, not by the deliverable's author *(**filed on a NAMED OWNER RULING, `AskUserQuestion`, live lead `/fkit-sprint-ship-loop` driver session 2026-08-05** — *authorize a producer follow-up to file ADR-038*; **the ONLY one of the EIGHT follow-ups named in `0200`'s report that the owner has authorized — the other seven are held for the owner and deliberately NOT filed**; **⚠️ DATED CORRECTION 2026-08-06 — the clause immediately above was true on 2026-08-05 and is FALSE now: ZERO remain unfiled, and the count itself was wrong (report §8 item 6 is struck through IN THE REPORT and folded into item 3, so there were SEVEN distinct follow-ups, not eight — *"the other seven"* should have read *"the other six"*). Items 1/3/4/5 → `0223`/`0224`/`0225`/`0226` filed 2026-08-05; items 7/8 → `0232`/`0233` filed 2026-08-06 on a named owner ruling, verbatim **"File both now."** ⚠️ **The `Blocks:` rationale below is ALSO wrong**: scored per item, `0222` is a real blocker for **at most ONE** of the six (`0223`, and only its reason clause) — `0224` is a mechanism, `0225` a test, `0226`/`0232` fact repairs, `0233` an ADR-036 question; ⛔ but note three of the four filed on 2026-08-05 (`0223`/`0224`/`0225`) **DO declare `Depends on: 0222`**, so the weakness is on merit, not in what the briefs say — **an open question for the owner, NOT changed by a producer**. **Original clause left byte-identical; the ADR's decision, scope and rank are unaffected. Full accounting in this board's `0222` addendum and in the brief's §Notes.**; records a decision **already taken** by `0200` (closed 2026-08-05): *"the Process-review step's role is fixed by the skill the step runs, not by who wrote the deliverable: it is always `@fkit-coder`"*, recommending **(a)** with the row's *"apply … **method**"* wording **kept and enumerated** plus **(c)'s PAIRED detector as a non-optional companion**, and **rejecting (b)** (granting `fkit-process-stateful-review` to `architect` in `skills_for_role()`); **division of labour, so it is not re-litigated: the ADR records the decision, the report carries the reasoning** — `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` (§6 why an ADR is needed, §7 the recommendation, §8 item 2 this follow-up) — **cite it by path, do not re-narrate it**; **why an ADR and not a table row**: it closes an axis **ADR-037 §Context explicitly left open** (*"Not decided here (the invocation axis): which skill a role may run at all"*), the rule **generalizes to every step in every loop**, and recording **(b)'s rejection** is what stops the next architect-authored deliverable re-opening it; **⚠️ MANDATORY FOUR-WAY NUMBER SWEEP before allocating** — `decisions/`, `reports/`, the sprint boards **AND** `wiki-vault/` (read-only, ADR-005) — `adr-037` is highest on disk today so **038 is LIKELY but MUST NOT be assumed**: the **ADR-029 precedent** is that a number was once claimed **everywhere except `decisions/`**, so sweeping `decisions/` alone is exactly the check that already failed once; **the ADR must state the accepted tradeoff honestly — the rule stays PROSE**: the ADR-018 hook gates skill **invocation**, and a driver that spawns the wrong role and tells it to work **by hand** never reaches the gate, so this is a prose rule plus a durable detector **in place of prevention**, the same shape ADR-033 states about its own residual; must carry a **`Re-raise only if`** clause; **⚠️ two ACCEPTED RESIDUALS in the source report must NOT be copied forward**: the §7 mirror-cost figure reads **"8 files / 9 sites"** where ledger residual **R15** records the true figure as **7 files / 8 sites** (re-count or omit — the count belongs to the rejected option (b)), and **R18** — *"outside the denied worker's control"* **overstates**, since **ADR-022** leaves every role but the adversarial reviewer tool-unrestricted; ⚠️ **phrase the rule so it does NOT re-impose the per-round owner gate ADR-019/ADR-032 deliberately replaced** with the loop's single up-front approval (report finding **R1**, owner-re-scoped); ⚠️ **ADR-012 names the stale home `claude/fkit-claude.sh` for `skills_for_role()` — it lives in `claude/skills-for-role.sh`; cite the file, not the ADR's path**; ⛔ **no implementation** — no edit to `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh` or `test/`; ⛔ do not reopen ADR-018/033/037; ⛔ no `wiki-vault/` write; ⛔ no commit, no re-rank, no task-file move; **⚠️ P189 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly above `0203`**, the highest-ranked open row on this board, because `0203` and `0208` both amend the same sprint-loop skill this ADR governs and **every implementation follow-up the ruling implies will want to cite an ADR number rather than a report path**; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); `Depends on: nothing`; **`Blocks:` the seven unfiled `0200` follow-ups**; owner: fkit-architect; **⚠️ DATED CORRECTION 2026-08-06 — CARRIED ONTO SPRINT 3 by the rollover (Sprint 2 row `P189`, frozen and left readable there). Two clauses above no longer describe reality. (1) The append-rank clause: Sprint 3 is a FRESH board, so `P3` is a **merit rank**, not an append rank. (2) The recorded merit statement *"directly above `0203`, the highest-ranked open row on this board"* **was NOT honored here, deliberately** — its stated reason is discharged (`0203` moved to the Backlog board, `0208` closed), and this row's own 2026-08-06 correction already narrows its `Blocks:` claim from seven follow-ups to **at most one** (`0223`, reason clause only). It is ranked below the two rows the owner pulled in by name. **This is the one recorded merit position this board did not honor — flagged for the owner.** Original clause left byte-identical; the ADR's decision and scope are unaffected.**; **⚠️ SECOND DATED CORRECTION 2026-08-06 — the owner has now ruled on BOTH questions this row raised, and two clauses above are stale.** (1) *"an open question for the owner, NOT changed by a producer"* — **answered**: owner ruling, verbatim ***"Relax 0224 and 0225."*** (`AskUserQuestion`, live `fkit lead` session, 2026-08-06). `0224` and `0225` now declare `Depends on: nothing`; **`0223` is untouched and its dependency still holds** (reason clause only). So the row's own *"at most ONE"* finding is now **what the briefs say**, not just what is true on merit. (2) The rank flagged for owner confirmation — **answered**: owner ruling, verbatim ***"Leave it at P3."*** `P3` stands; the un-honored merit position is now un-honored **by owner decision**. ⚠️ **The `Blocks:` claim is correspondingly narrower still**: with `0224`/`0225` relaxed, this ADR blocks **`0223`'s reason clause and nothing else**. Both original clauses left byte-identical; the ADR's decision, scope and rank are unaffected.)* | [`0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs`](../../tasks/done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/brief.md) |

## Addendum — task 0241 added out of band (2026-08-06)

**Authority, stated first.** Two owner rulings, both via `AskUserQuestion` in a live `fkit lead`
session on 2026-08-06: the board — verbatim **"Sprint 3 (Recommended)"** (the active Sprint 3 board
chosen over Backlog); the shape — the verbatim ruling quoted in full in the row above and in the
brief's §Context. Filed by a spawned `fkit-producer` with no owner channel.

**What was added and why it is one brief, not several.** One design task (`0241`, owner
`fkit-architect`). The description decomposes naturally into spec-authoring, check, and repair-path
units — but every one of them hangs on unresolved design tensions (the ADR-015 re-raise, the trigger,
the consent model, the role, the `CLAUDE.md`/`AGENTS.md` boundary), so filing them now would scope
implementation ahead of findings. The design's deliverable §6 proposes that split; the producer files
it after owner review.

**Rank.** Appended at `P4` per `/fkit-task-brief` step 5.
**⚠️ Priority P4 is append rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs directly below `0182`**, because an owner-ruled product capability with live
user impact (every consuming project on an old fkit keeps drifted scaffold files forever) outranks
recording an already-taken decision (`0222`), while `0181`/`0182` repair a control running today and
were pulled onto this board by the owner by name. No existing row was edited or re-ranked; Sprint 3
has no closed rows, so ADR-035's wall does not yet bind a future owner-ruled move of this row.

> **✅ ANSWERED same day — the owner confirmed the merit position, and the flag above is DISCHARGED.**
> Rank paragraph above left byte-identical. `0241` no longer sits at `P4`; see the owner-ruled re-rank
> addendum immediately below, which names its authority in full.

## Addendum — OWNER-RULED re-rank (2026-08-06): `0241` moves to Sprint 3 `P3`, `0222` to Sprint 3 `P4`

**Authority, before outcome.** This re-rank was **ruled by the owner** — verbatim answer
**"Move to merit P3 (Recommended)"** — on **2026-08-06**, via **`AskUserQuestion` in the live
`fkit lead` session**, relayed to and executed by a spawned `fkit-producer`. **This is NOT producer
precedent for re-ranking**: a spawned producer still never re-ranks on its own judgement, a
spawn-prompt instruction alone, or a precedent read off this addendum — this move happened only
because the instruction named the owner's ruling on exactly this point.

**The outcome.** `0241` moves to its recorded merit position — directly below `0182`, above `0222` —
becoming **Sprint 3 `P3`**; `0222` becomes **Sprint 3 `P4`**. Only the two rows' order and `P` cells
changed; no other cell was edited, and `0181`/`0182` are untouched. ADR-035 compliance: Sprint 3 has
**no closed rows**, so this is a move of an existing open row within its own contiguous run of open
rows — the narrowed exception's permitted case — and no closed rank anywhere was renumbered.

**Reconciling the prior ruling on `0222` — the two rulings do not conflict.** `0222`'s row and this
board's Open-question 1 record an earlier same-day ruling, verbatim **"Leave it at P3."** That ruling
answered a different question — whether to **promote `0222` toward `P1`** relative to `0181`/`0182` —
and was given **before `0241` existed**. Today's re-rank moves `0222` to `Sprint 3 P4` by a **newer
owner ruling naming `0241`'s merit position**, which necessarily places `0241` above it. `0222`'s
in-cell *"P3 stands; the board order `0181` → `0182` → `0222` stands and is not re-ranked"* clauses
and Open-question 1's answer block are **left byte-identical and are governed by this addendum** —
they were true when written and are superseded only as to the rank number, not as to the
non-promotion they ruled on.

**A second ruling of the same session, recorded here because it supersedes a clause in `0241`'s
row.** On the question *"Is stale `CLAUDE.md` / `AGENTS.md` refresh in scope for `0241`'s design, or
a separate concern?"* the owner ruled, verbatim, **"In scope (Recommended)"** — the refresh **is** in
scope, as one coherent "does this project match the installed version" capability, both weighed under
the same consent model. Recorded in full in `0241`'s brief (dated-correction form). `0241`'s in-cell
clause *"must make the `CLAUDE.md`/`AGENTS.md` include/exclude call explicitly"* and its `P4`
append-rank flag are **left byte-identical and are governed by this addendum and the brief**.

## How this board was ranked

**Every rank here was assigned on merit, by a spawned producer, on a board with no closed rows.** No
append rank was used, and nothing was inherited from Sprint 2. The principle applied, stated so it can
be argued with:

1. **What the owner pulled in by name goes first, in dependency order.** The owner named `0182`
   (*"Pull it into Sprint 3"*) and accepted `0181` as its mandatory gate. Those two take the top of the
   board. `0181` → `0182` is a **hard** dependency — the guard enforces the rule `0181` writes down, and
   shipping the guard first would enforce a rule the skill still contradicts — so `0181` is `P1` and
   `0182` is `P2`, not the reverse.
2. **A recorded merit statement is honored unless its stated reason is discharged.** `0222` carries one
   (*"directly above `0203`, the highest-ranked open row on this board"*). Its reason was that `0203` and
   `0208` amend the same sprint-loop skill the ADR governs — **both are gone**: `0203` moved to the
   Backlog board, `0208` closed. The statement's reason no longer holds on this board, so it was not
   honored, and **that non-honoring is flagged rather than buried** — see the row's own dated correction
   and §"Open questions for the owner".

**`0181` at `P1` also earns it independently.** It is the only one of its batch of eight whose absence
has already caused a **verified** breach, it is independent and can land immediately, and it governs
`/fkit-task-brief` step 5 — the path **every future brief filing on this board passes through**.
Ranking it first protects Sprint 3 from its first new row onward, which is the whole reason a fresh
board was worth creating.

**`0222` at `P3` is the lowest-confidence call on this board.** It has real unblocking value — three
briefs on the Backlog board (`0223`, `0224`, `0225`) declare `Depends on: 0222`. It was ranked third
anyway because its own 2026-08-06 correction records that, scored per item, it genuinely blocks **at
most one** of them, and because unlike `0181`/`0182` it records a decision already taken rather than
repairing a control that is running today.

## Rollover record — what came across, and what did not

| From | Rows | Disposition |
|---|---|---|
| [Sprint 2](sprint-2.md) | 1 open (`0222` at `P189`) | **Carried** → `P3` here. Sprint 2's row reads `➡️ Moved to [Sprint 3](../sprint-3.md) — priority P3` and **keeps its historical `P189`** — a moved row's rank on the source board is frozen. |
| [Sprint 2](sprint-2.md) | 188 closed (138 done · 5 cancelled · 45 moved) | **Not carried.** They stay on the archived board at the ranks they already hold. **Not one `P<n>` was renumbered.** |
| [Backlog](../backlog.md) | 2 (`0181`, `0182`) | **Pulled in** by owner ruling → `P1`, `P2`. Their Backlog rows read `➡️ Moved to [Sprint 3](sprint-3.md) — priority P1`/`P2` and are **not deleted** — a deleted row loses the pointer to where the work went. |

**The four questions task `0185` required answered before any roll, answered:**

1. **In-flight tasks.** None. Sprint 2's single open row read `🔲 Backlog`, not `🔄 In progress` or
   `🚧 Blocked`, and had no open review ledger. The in-flight case **was not exercised and remains
   unspecified** — if a future rollover has to move a `🔄 In progress` row, that is a decision nobody
   has made yet.
2. **Existing citations into the Sprint 2 board.** They point at a **frozen board, not at nothing**:
   the file was moved, not deleted, and every markdown link that broke was re-pointed. **Prose
   citations of the literal string `ai-agents/sprints/sprint-2.md` were deliberately NOT swept** — see
   §"Known follow-ups".
3. **Dashboard board discovery.** Verified first-hand before the roll, not discovered afterward:
   `/fkit-status` resolves the active sprint from the plans **at the top of `ai-agents/sprints/`**, and
   treats `sprints/done/` as closed. Moving `sprint-2.md` into `done/` and
   creating this file is therefore exactly what makes Sprint 3 active — no tooling change needed.
   *(Mechanism corrected 2026-09-04 per
   [ADR-041](../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md).
   What was verified first-hand before the roll was a **filename glob** over `sprint-*.md`; that was the
   mechanism at the time, and the record of the check stands. Selection is now by each plan's **resolved
   identity**, with no pattern on the filename — the candidate set and the `done/` exclusion are
   unchanged, so the conclusion this item drew is unaffected.)*
4. **Rank numbering.** **Restarts at `P1`.** Ruled and recorded above, with its cost stated.

## Known follow-ups this rollover created — none of them silent

- **⚠️ `0182`'s brief specifies the guard's glob as `ai-agents/sprints/sprint-*.md`, and that no longer
  reaches the archived board.** `sprints/done/sprint-2.md` is now **outside** that glob, so the guard as
  currently specified would run green over all 188 closed Sprint 2 rows — the exact history it exists to
  protect. **A separate unit is already queued to repair the brief; it was deliberately not fixed
  here.** ⛔ Do not build `0182` against the brief's current glob.

  > **✅ REPAIRED 2026-08-06 — this follow-up is DISCHARGED.** Bullet above left byte-identical. The
  > *"separate unit already queued"* has landed: `0182`'s brief now carries §"✅ DECIDED 2026-08-06",
  > whose **correction 4** globs **both** `ai-agents/sprints/sprint-*.md` **and**
  > `ai-agents/sprints/done/sprint-*.md`, and **excludes `backlog.md` with a stated reason** (unranked
  > by design; Priority cells read `—`). ⛔ **The prohibition still stands in its literal form** — do
  > not build `0182` against the glob in its §"The condition"; **build against the corrected
  > specification in §"✅ DECIDED 2026-08-06"**, which is now the buildable spec.
- **⚠️ An archived board is MOVED, not FROZEN.** Sprint 1's archived board was edited three more times
  after archiving. Any guard reasoning about `sprints/done/` must assume it still changes.
- **The prose-citation sweep is NOT done.** **107 files** outside the vault still contain the literal
  string `ai-agents/sprints/sprint-2.md` as text rather than as a link. Almost all sit in **closed task
  folders and frozen reports**, and many are `path:line` forms that were already banned and already
  stale. They were left alone deliberately — the Sprint 1 precedent handled this class as its own task
  (`0076`), and a 107-file rewrite of frozen records inside a rollover is exactly the silent
  history-edit this project's rules exist to prevent. **Needs a filed task.**
- **⚠️ A NEW DEFECT THIS ROLLOVER EXPOSED — the round-trip drift, ceiling 45 rows.** Pulling `0181` and
  `0182` back into a sprint made the **archived Sprint 2 board** emit two permanent drift records:
  `drift disagreement 0181 plan="➡️ Moved to [Backlog](../backlog.md)" brief_sprint="Sprint 3"
  moved_target="Backlog"`, and the same for `0182`. **Both rows are correct and both briefs are
  correct.** Drift rule 2 compares a row's frozen `Moved` target against the brief's **current**
  `## Sprint`, which assumes **a task moves at most once**; a task going **sprint → Backlog → sprint**
  breaks that assumption and no edit to either file can reconcile them without one of them lying.
  **This is not caused by archiving** — it would read identically had the board stayed put.
  **⚠️ Scope: 45 rows on the Sprint 2 board read `➡️ Moved to [Backlog]`. Every one ever pulled into a
  sprint adds another permanent drift record. Two today, ceiling 45.** ⛔ **Do not "repair" it by
  rewriting the markers** — that asserts a move that never happened. **Needs a filed task** against
  `dashboard.sh`'s drift rule 2. Recorded in full on the archived board's 2026-08-06 addendum.
- **A wiki re-sync is owed and was NOT performed.** `ai-agents/wiki-vault/` still describes Sprint 2 as
  the active board. **Only `fkit-wiki` may write the vault (ADR-005)** — this producer wrote nothing
  there. **Needs a filed task.**

## Open questions for the owner

1. **Is `P3` right for `0222`?** It is the one recorded merit position this rollover did not honor.
   Three Backlog briefs declare a dependency on it; its own correction says at most one is real.
   **Promoting it to `P1` costs nothing today** — no row on this board is closed, so the wall does not
   apply and a re-rank here is free. **This is the cheapest moment this decision will ever have.**

   > **✅ ANSWERED 2026-08-06 — owner ruling, verbatim *"Leave it at P3."*** (`AskUserQuestion`, live
   > `fkit lead` session.) Question text above left byte-identical. **`0222` stays `P3`; the board order
   > `0181` → `0182` → `0222` stands and is not re-ranked.** The recorded merit position remains
   > un-honored, now **by owner decision** rather than by a producer's judgement — which is what the
   > question was asking for.

2. **Should the three `Depends on: 0222` declarations in `0223`/`0224`/`0225` be corrected?** The
   `0222` row records that they are weaker than they read. A producer must not change them unasked.

   > **✅ ANSWERED 2026-08-06 — owner ruling, verbatim *"Relax 0224 and 0225."*** (`AskUserQuestion`,
   > live `fkit lead` session.) Question text above left byte-identical. **`0224` and `0225` are relaxed
   > to `Depends on: nothing`** — `0224` is a mechanism and `0225` a test, and **both work whichever way
   > ADR-038 words the rule**, so neither needs `0222` to exist first. **`0223` is untouched and its
   > dependency still holds** (its **reason clause** cites ADR-038 by number). Applied 2026-08-06 to both
   > briefs' `## Notes` and to both Backlog board rows, in dated-correction form — original
   > `Depends on:` lines left byte-identical and marked non-binding. **Effect: two runnable tasks stop
   > idling behind an unwritten ADR.** ⚠️ `0224` is **runnable, not ready** — its denial-log path is
   > still an unanswered owner question.

3. **What happens to a `🔄 In progress` row in a future rollover?** Unexercised and unspecified.

## Not in this sprint (explicitly deferred)

- The **prose-citation sweep** and the **wiki re-sync** above — both need their own filed tasks.
- The **`0182` glob repair** — queued as its own unit, and a hard gate on building `0182`.
  - **✅ DONE 2026-08-06 — no longer deferred. Line above left byte-identical.** Applied into `0182`'s
    brief as **correction 4** of §"✅ DECIDED 2026-08-06", together with eleven other architect-specified
    corrections and the discharge of its baseline block. The gate is **cleared**; `0182` is buildable
    against the corrected specification (not against its §"The condition" glob).
- Everything on the [Backlog board](../backlog.md), which is unranked by design and is where unsprinted
  work continues to land.

## Notes

- **Nothing on this board has been committed to git.** This rollover is working-tree only, pending
  owner review.
- **No closed row was renumbered by this rollover, on any board** — the invariant the whole exercise
  was built to protect.
- This board was created by a **spawned producer with no owner channel**. Every ruling it acted on is
  named and dated above; every judgement it made beyond those rulings is in §"How this board was
  ranked" or §"Open questions for the owner", not buried in a cell.
