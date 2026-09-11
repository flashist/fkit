# Worklog — task `0340`: backfill the sprint status banner

**Worker:** spawned `fkit-coder` (Build worker), under `/fkit-sprint-ship-loop`.
**Date:** 2026-09-11. **Baseline HEAD:** `9943dcf13633e576761f7b76dd4a4b30c754de00`.
**Approved plan:** this task folder's `plan.md`, blob `9cdd079c7533eea6eef49c12414ac8b9b0d3926e`,
9229 bytes — verified byte-identical against the copy pasted into the spawn prompt.

> ⚠️ **Annotation — 2026-09-11, added after this build finished. The blob above is NOT re-pinned.**
> `plan.md` on disk is now blob `df3844054e5a168354577cb076578d1ab2d2f114`, **9537 bytes** — measured
> 2026-09-11 with `git hash-object` and `wc -c`. The driver relays that it corrected the plan's
> **verification step 5** on an owner ruling **after** this build was done, and that only step 5's
> wording moved. ⛔ **That relay is not something this worker could verify from its own context**, so
> it is recorded as a relay, not as a measurement. ⭐ The citation above is left as written because it
> is a **true record of the bytes actually carried and verified at build time**; re-pinning it would
> make this worklog claim it carried bytes that did not yet exist. Residual 1 below describes the
> defect that correction answers, and is likewise left as written.

## ⛔ Read this first — what is NOT claimed here

**Success criterion (a) is NOT reported as met.** Criterion (a) asks that Sprint 8 be chosen
**because** its status reads `In progress`. That is unobservable today: eligibility is **identity-only**
(`claude/skills/fkit-status/dashboard.sh:173`, `is_eligible`), and the reader has no status rung at all.
The status rung that would demonstrate criterion (a) ships with task `0338`. The producer's
deferred-proof instruction on this task's brief stands, and nothing below supersedes it.

**Verification step 2 is a NO-REGRESSION proof, not a status proof.** `select-active` is byte-identical
before and after **precisely because the reader has no status rung yet** — it never looks at line 3.
Identical output proves the insertion broke nothing. It proves nothing about the status being read.

## Change surface — exactly two files

| File | Change |
|---|---|
| `ai-agents/sprints/sprint-8.md` | **+2 −0** — two lines inserted before the former line 3 |
| this task folder's `worklog.md` | **new file** (this file) |

⛔ **`brief.md` was NOT edited** — owner ruling **Z3**. The rewritten verification steps live here and
only here. ⚠️ **Accepted cost, named by the owner:** the brief keeps four stale verification steps at
its top, and a future reader meets them before reaching this worklog.

⛔ `ai-agents/sprints/done/sprint-1.md` … `sprint-7.md`: **untouched**, per owner ruling **V3**.
⛔ No `sprints/cancelled/` created (that is `0341`, on first use). ⛔ `backlog.md` untouched.
⛔ No test, no fixture, no `claude/` file, no ADR, no vault write, no commit, no mover.

## The edit

Inserted before the former line 3 of the sprint-8 board:

```
> ## 🔄 In progress — 2026-09-10.
>
```

**Two lines, not one** — the banner plus a `>` spacer. The spacer keeps the banner and the Authority
prose as **one** blockquote with the banner as its leading H2, matching all seven archived boards
(`sprints/done/sprint-5.md`, `sprint-6.md`, `sprint-7.md` are `> ## …` / `>` / `> **prose**`).
⛔ It does **not** separate them.

**Date `2026-09-10`** — owner ruling **Z1**: the day Sprint 8 opened and entered `In progress`, not
the day this was typed. Basis: every archived banner carries the date of the **state transition**.
⚠️ The value is permanent.

**Bare banner, no `⭐ ACTIVE BOARD`** — owner ruling **Z2**. The marker is an *override* of
lowest-ordered selection, and Sprint 8 is the only eligible board, so it would override nothing.
⚠️ The cost that decided it: when Sprint 8 goes `✅ Done`, a leftover marker fires
`drift active-marker-on-non-active` (test P15), and the movers (`0341`) have no step to strip it.

Resulting head of the board:

```
1  # Sprint 8 — Give sprints the lifecycle tasks already have, and prove it by closing this board with a mover
2
3  > ## 🔄 In progress — 2026-09-10.
4  >
5  > **Authority, stated first and in full.** This board exists by an **OWNER RULING given 2026-09-10 via
```

Line count 628 → 630.

## Verification steps — these REPLACE the four stale steps on the brief

All seven run this turn against the working tree. Measured results, not expected ones.

| # | Check | Result |
|---|---|---|
| 1 | ADR-047 §2 recognizer regex vs. the new line 3 | **MATCH** ✅ — captured status `🔄 In progress` |
| 2 | `dashboard.sh select-active ai-agents/sprints` | **byte-identical** before/after, exit 0 ✅ — *no-regression proof, see the caveat above* |
| 3 | `dashboard.sh ai-agents/sprints/sprint-8.md` (board render) | **byte-identical** before/after, md5 `5602ce4507744c2bbd96bce71864d4d5`, exit 0 ✅ |
| 4 | `dashboard.sh identity ai-agents/sprints/sprint-8.md` | `Sprint 8` ✅ |
| 5 | change surface `+2 −0`; archived boards untouched | ⚠️ **instrument substituted — see below**; both halves proven ✅ |
| 6 | `npm run test:unit` | **877 / 877 pass, 0 fail**, exit 0 ✅ (baseline 877 held) |
| 7 | Head-shape parity vs. `sprints/done/sprint-5..7.md` | identical three-line pattern ✅ |

### ⚠️ Step 5 — the plan's instrument does not work, and why

The plan specified `git diff --stat` for the `+2 −0` half. **That cannot measure this file:**
`ai-agents/sprints/sprint-8.md` is **untracked** in git (`git status --porcelain` reports `??`), because
Sprint 8's creation has not been committed. `git diff` reports nothing at all for an untracked file, so
the plan's step 5 would have returned an empty result and been misread as "no change".

**Substituted instrument:** a byte-level `diff` against a pre-edit snapshot taken before the write.
Measured: **2 added lines, 0 removed lines, 0 context lines changed** — exactly the intended surface.

The **other half of step 5 is measurable as written and passes unchanged**: the seven archived boards
are tracked, and `git diff -- ai-agents/sprints/done/` returns **empty**, as does
`git status --porcelain -- ai-agents/sprints/done/`. Owner ruling **V3** is satisfied by measurement.

### ADR-047 §2 recognizer, as applied

Quoted from the ADR's recognizer block:

```
^> ## (🔲 Backlog|🔄 In progress|✅ Done|⛔ Cancelled|🔒 CLOSED) — [0-9]{4}-[0-9]{2}-[0-9]{2}\.( |$)
```

Run **mechanically** (not by eye) against the file's line 3. ⭐ This mechanical inspection is what
stands in for the machine-read proof deferred to `0338`.

```
line 3 = "> ## 🔄 In progress — 2026-09-10."
line 4 = ">"
RECOGNIZER: MATCH
captured status: 🔄 In progress
```

## `select-active` output — verbatim, before and after

**Before the edit:**

```
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="sprint-8.md" identity="Sprint 8"
candidate file="backlog.md" identity="Backlog"
candidate file="sprint-8.md" identity="Sprint 8"
⟦FACTS⟧
⟦END⟧
```

**After the edit:**

```
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="sprint-8.md" identity="Sprint 8"
candidate file="backlog.md" identity="Backlog"
candidate file="sprint-8.md" identity="Sprint 8"
⟦FACTS⟧
⟦END⟧
```

**The two are byte-identical** (`diff` clean, both exit 0, both stderr empty). ⛔ Again: identical
**because the reader has no status rung**, not because the status was read and honoured.

## Board render — verbatim, AFTER the edit

⚠️ **Fenced deliberately.** This render carries **12 distinct relative `.md` links written relative to
`ai-agents/sprints/`**. Pasted raw into a backlog task folder, every one of them resolves to a
non-existent path and `test/reference-integrity.test.js` reds. The fence blanks the block for both
guards. ⭐ Verified safe: the render output contains **zero** ``` runs and **zero** `~~~` runs, so the
fence cannot be broken from inside.

⭐ Coordinate-shaped hits inside the render, measured against the citation guard's own `TARGET` regex
(which requires a literal `ai-agents/…` prefix): **0**. A broader hand-written regex finds 3 hits
(`CLAUDE.md:58`, `README.md:9`, `SKILL.md:26`-shaped) — **none of them match `TARGET`**, and all are
masked by the fence regardless.

```
⟦fkit-dashboard v1⟧
⟦BOARD⟧
| Status | # | Task | Filename | Owner | Next step |
|---|---|---|---|---|---|
| 🔄 In progress | P3 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Backfill a sprint status onto every existing sprint plan in this repo** *(the data migration `0337`/`0338` create: `sprint-6.md` has no status banner (SD-1 ruled: line-3 banner), so after `0338` the selector reports `active none` here until this lands — this task inserts the `🔄 In progress` banner at line 3; `sprints/done/sprint-1..5.md` carry the `🔒 CLOSED` banner and may need nothing if the ADR reads it as Done — check, don't assume; `backlog.md` gets no sprint status. This repo's records, not the product — producer act. Owner `fkit-producer`. **Depends on `0337`, `0338`.**)* ⭐ **WHY `P3`:** it stamps `🔄 In progress` onto **THIS board** — ⛔ **without it the selector reports `active none` here and success criterion (a) cannot pass**, however correct `0338`'s code is. It also backfills the banner onto the archived plans if `0337`'s ADR does not admit the legacy `🔒 CLOSED` form. ⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10.** **Depends on `0337` and `0338` — both hard** (step 1 cannot pass without the reader). **Blocks: nothing.** ⭐⭐ **RE-RANKED `P6` → `P3` ON 2026-09-10 BY OWNER RULING `S6`, verbatim *"Re-order — 0340 before 0338 (Rec)"* — this row now runs BEFORE `0338`.** ⛔ **The "both hard" above is CORRECTED: only `0337` is a work dependency.** `0338` is named in the brief as *"the reader that verifies it"* — a **deferred verification**, not an input, so this row runs at `P3` and its step-1 proof lands when `0338` ships at `P6`. ⛔ **Reason for the swap: shipping `0338` first takes THIS BOARD out of `select-active` mid-sprint** — see §"⚠️ THE RE-ORDER OF 2026-09-10". ⚠️⚠️ **THE BRIEF IS DATED — RE-DERIVE AT PICKUP.** It names `sprint-6.md` as the open plan and carries a 2026-08-29 correction for Sprint 6's archival; ⛔ **Sprint 7 has ALSO been archived since.** Re-measured 2026-09-10: `ai-agents/sprints/` holds `backlog.md` plus this board, and `sprints/done/` holds **seven** plans. ⛔ **Archived plans end BYTE-IDENTICAL** unless the ADR forces a line-3 rewrite — see §"⚠️ THE `0340` SEQUENCING NOTE" for the collision with `0322`, which is not on this board. | [`0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo`](../tasks/backlog/0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo/brief.md) | fkit-producer | ⟨derive: 0337 (the carrier grammar), 0338 (the reader that verifies it — step 1 cannot pass without it).⟩ |
| 🔲 Backlog | P4 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** ⛔ **The task movers have no step for the `NAMED_EXEMPT` keys a move invalidates — they repoint links, they never DELETE an exemption** *(**owner ruling 2026-09-07**, live `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, option label verbatim **"File it as its own row (Rec)."**; ⭐ **the defect in the coder's own words** — *"`/fkit-task-done` reasons about links it must **repoint** but has no step for exemption keys it must **delete** — the keys are in a test file, outside the folders it inspects"*; measured on disk 2026-09-07: the strings `NAMED_EXEMPT` and `reference-integrity` appear **ZERO** times in **both** [`fkit-task-done`](../../claude/skills/fkit-task-done/SKILL.md) and [`fkit-task-cancelled`](../../claude/skills/fkit-task-cancelled/SKILL.md), so ⛔ **a fix landing only in `task-done` half-ships it**; ⚠️ **it fired TWICE in one day, both times as a red suite found AFTER a close had reported success** — closing Sweep C's five members left three keys on [`0358`](../tasks/done/0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md)'s `backlog/` path, and closing `0358` itself made those links **resolve**, so the exemptions became dead weight, `namedExemptCount` fell **9 → 6**, and **`L3` red on the FALL, not a rise** (a fourth link, `0290`, broke in the same move and needed a **new** exemption); ⭐ **THE DURABLE RULE TO RECORD** — *"`../../done/X` survives, `../X` does not"* is right about a **POINTER** and **INVERTS for an EXEMPTION KEY**: a sibling-relative link **heals** when its citer moves into `done/` beside a target already there, and its key is then **dead weight to DELETE, not repoint**; ⚠️ **it does not fire on every close** — `0359`'s close the same day grepped clean, zero keys naming it, which is exactly why the gap keeps surviving; ⛔ **FRAME ONLY — the answer is NOT designed in the brief**: whether the movers gain a step, whether the key format becomes move-invariant, or something else is the implementer's **plan gate with the owner**, and a run arriving having already chosen has skipped it; ⛔ **DISTINCT from [`0378`](../tasks/backlog/0378-decide-how-a-worker-tells-a-concurrent-close-s-transient-link-red-from-its-own/brief.md)** (concurrency/timing — someone else's in-flight move) **and [`0363`](../tasks/backlog/0363-design-the-sweep-completion-step-that-stops-a-fixed-class-recurring-one-file-over/brief.md)** (claim propagation across a class) — this is **one missing step in one skill** and it reds **DETERMINISTICALLY**, no race, no second actor; ⛔ **do not let anyone fold the three**; ⚠️ `test/reference-integrity.test.js` is a **coder** surface, so any option putting the fix inside a mover run must say what the producer does instead; **depends on nothing**, but is a **live tax on every close**; owner: `fkit-coder`; filed UNRANKED by a spawned `fkit-producer` with no owner channel ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), appending and renumbering nothing ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)))* ⭐ **WHY `P4`:** it fixes the hole in the **task** movers **BEFORE `0341` copies their shape** into two more skills — `0341`'s own brief names `fkit-task-done`'s status table, `git mv` step and link-surface step as its model, so shipping `0341` first makes the fix cost four files instead of two. ⛔ **And this board closes seven task folders and then closes itself with a brand-new mover — the wrong sprint to leave that hole open on.** ⚠️ **Never `Unscheduled` by the 2026-08-29 ruling** — outside the `0337`–`0351` range; it arrives by ruling S1. **Depends on nothing. Blocks: nothing.** ⚠️ **Soft ordering, merit not gate: run before `0341`.** | [`0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates`](../tasks/backlog/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates/brief.md) | fkit-coder | ⟨derive: nothing.⟩ |
| 🔲 Backlog | P5 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Build the producer-only sprint movers — `/fkit-sprint-done` and `/fkit-sprint-cancelled`** *(SD-3 ruled 2026-08-25, live via `AskUserQuestion`, verbatim **"Mover skills, producer-only (Recommended)"**. Mirrors the task movers (`fkit-task-done/SKILL.md:56-70` status-first table, `:98-104` `git mv`, `:109-230` link surface): in one act — line-3 banner (SD-1), `git mv` to `sprints/done/` or `sprints/cancelled/` (SD-2), every in-file and inbound link repointed with counts re-derived at run time (Sprint 5 measured 57 in-file / 53 files, 177 inbound), cancelled plans' open rows de-scoped to `backlog.md` with the five brief edits, agent-closed marker when spawned (ADR-033 §5). Ownership declared once in `claude/skills-for-role.sh:51`, hook-enforced (ADR-018), `test/skill-ownership-hook.test.js:307-315` `MOVERS` invariant grows to four; every enumeration of the task movers (`fkit-producer.md:6,38,77,118`, `fkit-team/SKILL.md:54,61`, `CLAUDE.md:58`, READMEs) names the pair. Owner `fkit-coder`. **Depends on `0337`, `0338`.**)* ⭐ **WHY `P5`:** it is **the mover** — and it is what makes this board *"the first sprint in this project's history closed by a mover instead of by hand."* ⛔ **Success criterion (b) is unreachable without it.** ⭐⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10 — INCLUDING ruling 7 of 2026-08-29 ("Hand-archive again, with the caveat (Rec)"), which named `0341` `Unscheduled` a SECOND time in the words *"do not pull it in"*. That specific re-naming is lifted; this row is here legitimately.** **Depends on `0337` and `0338` — both hard.** **Blocks: nothing** — `0340` adds an `In progress` banner, which is not a close. | [`0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled`](../tasks/backlog/0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled/brief.md) | fkit-coder | ⟨derive: 0337 (the ADR: banner grammar, `sprints/cancelled/`, disposal of open rows, agent-closed rule), 0338 (the `dashboard.sh` banner reader the movers write against and verify with — shared, so the grammar has one implementation).⟩ |
| 🔲 Backlog | P6 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Make `/fkit-status` report every In-progress sprint, and give the selector a status rung and a lowest-first single choice** *(builds the `0337` ADR: a **line-3 banner** reader in `dashboard.sh` (SD-1 ruled; one implementation, ADR-041 §5; legacy `🔒 CLOSED` reads as Done; no banner → unresolved + drift; `sprints/cancelled/` excluded like `done/`), eligibility = identity **and** `In progress`, `select-active` prints ALL active plans lowest-first plus one `chosen` (lowest-ordered, option-(d) marker override, OQ-1), sprint-level drift facts, `SKILL.md:26-52` rewritten for N sprints (beats 1-6 + board per sprint, one closing line — still one output), S1 flipped and new tests. Before `0340` lands this repo reports `active none` + drift — expected, recorded. Owner `fkit-coder`. **Depends on `0337`. Blocks `0339`.**)* ⭐ **WHY `P6`:** it is **the reader** — eligibility gains a status rung, and `select-active` reports every `In progress` sprint with one `chosen`. ⭐ **This is the row that makes success criterion (a) observable at all**; today the script has no status rung and cannot name a status as its reason for choosing anything. ⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10.** **Depends on `0337` — hard** (accepted, with SD-1 ruled; the ADR's carrier is what this parses). **Blocks `0339`, `0340`, `0341`.** ⭐⭐ **RE-RANKED `P3` → `P6` ON 2026-09-10 BY OWNER RULING `S6`, verbatim *"Re-order — 0340 before 0338 (Rec)"* — this row now runs AFTER `0340`.** ⛔ **"Blocks `0340`" is CORRECTED: it does not.** `0340` needs only `0337`'s grammar to write the banner; this row is what *reads* it back. ⛔ **Shipping this row before `0340` takes THIS BOARD out of `select-active` and the ship-loop loses the board it is being driven from** — see §"⚠️ THE RE-ORDER OF 2026-09-10". ⚠️ **VERIFICATION STEP 3 IS STALE TWICE OVER — re-derive it at pickup.** It names `Sprint 6`/`sprint-6.md`, archived since 2026-08-29; and its *"**Before `0340`**: … `active none` plus the `sprint-status-unresolved` drift … expected pre-migration result"* clause **INVERTS under `S6`** — `0340` now lands FIRST, so the expected result here is `sprint-8.md` **active and chosen**. ⭐ **This row's verification is now where success criterion (a) is actually demonstrated.** | [`0338-flip-select-active-to-choose-the-lowest-ordered-open-sprint-and-repin-its-tests`](../tasks/done/0338-flip-select-active-to-choose-the-lowest-ordered-open-sprint-and-repin-its-tests/brief.md) | fkit-coder | ⟨derive: 0337 (accepted, with SD-1 ruled — the carrier is what this task parses).⟩ |
| 🔲 Backlog | P7 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Teach the lead, producer, ship-loop and README the sprint lifecycle and what "current sprint(s)" means** *(`fkit-lead.md` has no definition and no `/fkit-status` (`skills-for-role.sh:50`); `fkit-producer.md:15,89` says *"find the active one"*; `fkit-sprint-ship-loop/SKILL.md:47-48,94` must name the selector's **chosen** board when several are active; `README.md:9` + scaffold copy define "completed" only. Adds `conventions/sprint-status-vocabulary.md` (markers, the line-3 banner carrier (SD-1), the movers as the only setters of Done/Cancelled (SD-3, `0341`), `sprints/done/` + `sprints/cancelled/` (SD-2), definition = every `In progress` sprint, single-board rule, the selector command as the one resolution path), a few lines in both agent files, ship-loop wording, one README sentence, a `fkit-task-brief` re-read. Owner `fkit-coder`. **Depends on `0337`, `0338`.**)* ⭐ **WHY `P7`:** it closes the loop with the roles and pages that actually **answer the owner** — the lead, the producer, the ship-loop and both READMEs — and it is the row that ends the confusion the owner reported on 2026-08-25 in the first place. ⛔ **Last because it documents what `0337` and `0338` decide**; written earlier it would document a design that had not settled. ⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10.** **Depends on `0337` and `0338` — both hard. Blocks: nothing.** | [`0339-teach-the-lead-and-producer-what-current-sprint-means-and-how-to-resolve-it`](../tasks/backlog/0339-teach-the-lead-and-producer-what-current-sprint-means-and-how-to-resolve-it/brief.md) | fkit-coder | ⟨derive: 0337 (definition and SD-1..3 on record), 0338 (the script must implement what the prose tells roles to trust).⟩ |

2 done · 1 in progress · 4 backlog  —  of 7
⟦FACTS⟧
total 7
count done 2
count in-progress 1
count backlog 4
derive 0340 depends="0337 (the carrier grammar), 0338 (the reader that verifies it — step 1 cannot pass without it)."
derive 0381 depends="nothing."
derive 0341 depends="0337 (the ADR: banner grammar, `sprints/cancelled/`, disposal of open rows, agent-closed rule), 0338 (the `dashboard.sh` banner reader the movers write against and verify with — shared, so the grammar has one implementation)."
derive 0338 depends="0337 (accepted, with SD-1 ruled — the carrier is what this task parses)."
derive 0339 depends="0337 (definition and SD-1..3 on record), 0338 (the script must implement what the prose tells roles to trust)."
⟦END⟧
```

Render exit 0, 22 lines, 15581 bytes — byte-identical to the pre-edit render.

## Positional-reader sweep — why a line-3 insertion is safe

| Reader | Why it is unaffected |
|---|---|
| `dashboard.sh` identity | reads `head -1` only — line 1 untouched |
| `dashboard.sh` `field_value` / section scan | matches `## <field>` **anchored at column 1**; the banner starts `> ` |
| `STATUS_HEADING_RE` | `^## Status`-anchored; the banner is a blockquote line, no collision |
| `test/closed-rank-immutability.test.js` | keys on task-id rows and Priority cells; two non-row lines change no row |
| `test/coordination-citation-policy.test.js` | scans live `ai-agents/sprints/*.md`; blockquote lines are masked, and the banner carries no coordinate |
| `test/reference-integrity.test.js` | link scan; the banner carries no link |
| any test pinning `sprint-8` | zero hits across `test/` and `claude/` |
| empirical | render + `select-active` both diff-clean |

## Decision log — what was done without asking, and why it qualified

| # | Decision | Why it qualified |
|---|---|---|
| 1 | Substituted a snapshot `diff` for `git diff --stat` in verification step 5 | The plan's instrument is **inoperative** on an untracked file, so following it literally would have produced a false green. The substitution changes **no source byte** and proves the **same** property the plan asked for (`+2 −0`). Mechanical, localized, inside the plan's intent. ⚠️ **Surfaced to the driver as a residual** rather than buried — it is a real defect in the approved plan's text. |

No other fix was applied without asking, and no other obvious-winner call was made.

### Round-1 review pass — 2026-09-11, spawned `fkit-coder` (Process-review worker)

| # | Decision | Why it qualified |
|---|---|---|
| 2 | Rewrote § *Residuals and follow-ups* item 5: `✅ Done` is **mover-only**, and the banner is replaced in full, not just its status word and date | Answers finding **R1**. ⭐ **Not an unattended call** — owner ruling **AA1**, option label verbatim *"Coder corrects the worklog (Rec)"*, relayed by the driver. Verified `CORRECT` independently against ADR-047 § *1* (the `✅ Done` row reads *Set by: mover only*) and § *4* (*"Only the two terminal states are mover-gated"*), plus §1's banner form and its ADR-033 §5 agent-closed bullet. One paragraph in one non-executable file; no source byte, no test, no board row. |
| 3 | Annotated the header's plan-blob citation with the later blob rather than re-pinning it | ⭐ **Not an unattended call** — owner ruling **AA2**, option label verbatim *"Annotate, don't re-pin (Rec)"*. The new blob and byte count were **measured here** (`git hash-object`, `wc -c`); the reason for the change is recorded as a **driver relay**, because this worker cannot verify it. Annotate-never-rewrite keeps the build-time record true. |

⛔ **No fix was applied on this pass outside those two rulings, and no obvious-winner call was made.**

## Residuals and follow-ups

1. ⚠️ **The approved plan's verification step 5 is wrong as written** and would mislead a future reader
   or worker. It should say "diff against a pre-edit snapshot" for the `+2 −0` half while keeping
   `git diff -- ai-agents/sprints/done/` for the untouched-boards half. ⛔ **Not corrected here** —
   `plan.md` is outside this worker's two-file change surface, and re-authoring it was forbidden.
2. ⚠️ **Success criterion (a) remains unproven** and is deferred to `0338`. See the top of this file.
3. ⚠️ **The brief's four stale verification steps remain at the top of `brief.md`** — owner ruling
   **Z3**, accepted cost, named.
4. ⚠️ **The brief's title and this folder's name remain stale.** A rename moves a task folder, which is
   the exact link hazard `0381` exists to fix, and `0381` has not shipped. Frozen deliberately.
5. ⚠️ When Sprint 8 later goes `✅ Done`, the line-3 banner is **replaced in full** with
   `> ## ✅ Done — <date>. Closed by /fkit-sprint-done.` — ⛔ **not** just the status word and date: a
   trailing `Closed by …` clause is added, and ADR-033 §5's `(agent-closed — not owner-verified)`
   marker goes inside that clause when an agent does the closing.
   ⛔ **This is NOT a by-hand producer edit.** ADR-047 § *1. The sprint status vocabulary — four
   values* gives the `✅ Done` row **Set by: mover only**, and § *4. The movers* states *"Only the two
   **terminal** states are mover-gated"* with *"`🔲 Backlog → 🔄 In progress` is free for the producer
   to set by hand"* as the named exception — *"producer, **by hand**"* is the `🔲 Backlog` and
   `🔄 In progress` rows, never this one. The mover `/fkit-sprint-done` does not exist yet; building it
   is `0341`.
   ⭐ **Why this matters rather than being pedantry:** `sprint-8.md` § *🎯 The goal* is *"…prove it by
   making Sprint 8 the first board in this project's history that is closed by a mover instead of by
   hand"*, and its § *✅ SUCCESS CRITERION* half (b) requires a `✅ Done` banner that **names**
   `/fkit-sprint-done`. ⛔ A hand-stamped banner does not satisfy (b) — it misses the sprint.
