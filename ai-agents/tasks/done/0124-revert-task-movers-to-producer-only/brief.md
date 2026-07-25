# Revert the task movers to producer-only — `skills-for-role.sh` + 4 mirrors + hook test + mover SKILL prose

## ID
0124

## Sprint
Sprint 2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

The structural core of
[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
§1: **only `fkit-producer` may run `/fkit-task-done` and `/fkit-task-cancelled`.** Today
`claude/skills-for-role.sh:37-43` grants both movers to `lead, producer, coder, architect, reviewer,
wiki` (the ADR-025 "any role but the adversarial reviewer" grant). This reverts that to producer-only,
which makes the rule **hook-structural** (the ADR-018 `PreToolUse` hook then denies a mover call from
any non-producer identity at any spawn depth — `skill-ownership-hook.sh:119-136`), not the prose ADR-025
relied on.

This is one atomic unit: the ownership change, its four human mirrors, the test that guards it, and the
movers' own SKILL prose asserting "any role may close" all describe the same fact and must move together.
The `skills-for-role.sh:12-24` mirror checklist **has shipped false docs before** (task 0036) — the
mirrors land in the **same commit**.

**⚠️ Sequencing:** land this **after** 0122 and 0123. Removing the movers from `coder`/`lead` while the
ship-loops still invoke `/fkit-task-done` would hook-deny those loops. 0122/0123 reroute the loops to a
producer spawn first; this task then removes the now-unused grants.

## What to build

Per ADR-033 §1 and §Consequences:

1. **`claude/skills-for-role.sh`** — drop `fkit-task-done` and `fkit-task-cancelled` from `lead, coder,
   architect, reviewer, wiki`; `producer` keeps both. The adversarial reviewer never had them and still
   does not.
2. **The FOUR human mirrors, in the same commit** (the `skills-for-role.sh:12-24` checklist) — update
   every mirror that lists which roles own the movers so none is left asserting the ADR-025 grant:
   `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`, and
   `ai-agents/knowledge-base/architecture.md` (the skill-ownership listing rows for the movers only —
   coordinate with task 0115, which also touches architecture.md).
3. **`test/skill-ownership-hook.test.js`** — flip the deny/allow assertions for the five roles: the
   movers are now **allow for `producer`, deny for `lead, coder, architect, reviewer, wiki`** (and still
   deny for the adversarial reviewer). Pin the JSON deny shape, not just the exit code.
4. **The two movers' own SKILL prose** — `claude/skills/fkit-task-done/SKILL.md` and
   `claude/skills/fkit-task-cancelled/SKILL.md` (plus their scaffold copies if dual-homed): revert the
   "⛔ Owner: the producer — but **any agent may invoke it**" / ADR-025 "any role may close" banners and
   body prose to **producer-only** per ADR-033. Keep the agent-closed marker rule: a producer **spawned**
   by another agent still writes `✅ Done (agent-closed — not owner-verified)`; only an owner-present
   producer session yields a plain owner-verified close (ADR-033 §5).
5. **The agent definitions and the universal rules block — added 2026-07-25, see ⚠️ below.** These are
   **not** on the `skills-for-role.sh:12-24` mirror checklist, which is why item 2's "four mirrors" does
   not reach them. Each states the ADR-025 grant as fact in an agent's **system prompt**, which outranks
   a SKILL in that agent's context:
   - `claude/scaffold/universal-rules.md:7` — *"Any role but the adversarial reviewer may invoke them."*
     This is the fkit-managed rules block that lands in **every agent's context on every turn** and is
     what generates the repo-root `CLAUDE.md` / `AGENTS.md` blocks. Highest blast radius in the repo.
     **Coordinate with task 0130** (rules-block budget, 91.1% of `RULES_MAX`): producer-only is shorter
     than the "any role but…" clause, so this edit returns a few bytes of headroom — measure, don't
     assume, and tell 0130 the new figure.
   - `claude/agents/fkit-producer.md` — lines 7, 37–38, 95–96 (three assertions of "since ADR-025 any
     role may invoke them").
   - `claude/agents/fkit-coder.md` — line 103 (*"closes the task itself via `/fkit-task-done`"*) and
     lines 190–191 (*"since ADR-025 you may invoke them yourself"*, sitting in the coder's **hard
     must-not-do list**). Both directly contradict 0122's rewrite.
   - **`claude/agents/fkit-lead.md:56-57` — added 2026-07-25 (owner ruling), source: task 0123.** The
     `/fkit-sprint-ship-loop` bullet (`:54-58`) asserts the driver *"closes each task itself with the
     `(agent-closed — not owner-verified)` marker by default"*. That is ADR-032-as-first-written, now
     **reversed by ADR-033 §4** — the driver invokes no mover; it spawns `@fkit-producer` per shipped
     task and the **spawned producer** writes the marker (ADR-033 §5). Rewrite the clause to the
     spawn-the-producer shape; keep the rest of the bullet (degraded-run stop, never self-cancels,
     session-only) as-is. Same class and same owner disposition as the `fkit-coder.md:165` /
     `fkit-producer.md:67` case below: a **system prompt** outranks the SKILL in the lead's context, so
     leaving it puts the lead's own definition in contradiction with the loop it drives.
     ⚠️ **Verification step 6's sweep would likely MISS this line** — that grep targets *"any
     role/agent may invoke/close"* phrasing, and this line says *"closes each task itself"*. Do not
     trust the sweep to find it; check the file by hand (new verification step 9).
   - **Sanctioned-hand-off carve-out — added 2026-07-25 (owner ruling), source: task 0122's review
     ledger finding R4 (raised by Codex, verified by the coder against both files).** Two further
     lines — **not** among those listed above — state a **hard rule** that ADR-033 now contradicts:
     - `claude/agents/fkit-coder.md:165` — *"A consult is a focused question, not a hand-off."*
     - `claude/agents/fkit-producer.md:67` — the mirror of the same rule.

     ADR-033 §3/§4 make a **producer spawn to close** the sanctioned terminal act of both ship-loops.
     That spawn **is an action hand-off**, which those two rules currently forbid. A system prompt
     outranks a SKILL in an agent's context, so leaving them as-is puts a hard rule in tension with
     the very loop step it is supposed to authorize. **Add a carve-out** naming the
     producer-spawn-to-close as the one sanctioned hand-off; **do not delete the rule** — it still
     holds for every other consult.
   Keep the agent-closed marker rule intact everywhere (ADR-033 §5).

## Verification steps

1. `skills-for-role.sh` grants both movers to `producer` only; no other role has either.
2. All four mirrors reflect producer-only movers; the `:12-24` checklist is satisfied (no mirror stale).
3. `skill-ownership-hook.test.js` asserts allow-for-producer / deny-for-all-others (incl. adversarial
   reviewer) with the JSON deny shape pinned; the full test suite is green.
4. **Live/scaffold parity holds for every file this task touches** — verified by `diff`, **by hand**.
   ⚠️ **Corrected 2026-07-25: `test/dual-home-parity.test.js` DOES NOT EXIST.** ADR-027 §Decision 2
   called for it; the brief was never filed until 0133 (2026-07-25). This step previously read *"the
   ADR-027 dual-home parity test passes"* — an unrunnable instruction. **Do not go looking for that
   test, and do not build it here** (that is 0132 → 0133). `diff` each dual-homed file you edited
   against its counterpart and report the result.
5. Both movers' SKILLs read producer-only, retaining the agent-closed-marker rule for a spawned producer.
6. **No live source still asserts the ADR-025 grant.** Re-run the sweep that found the gap and confirm
   only historical records match (ADRs, closed sprint/task/report files, wiki pages pending 0126):
   `grep -rniE "any (role|agent)[^.]{0,50}((may|can) (invoke|close|run)|, via )" claude/ ai-agents/knowledge-base/ CLAUDE.md AGENTS.md`
   — expect **zero** hits in `claude/agents/`, `claude/scaffold/`, `claude/skills/`, and the
   **living canon** (`knowledge-base/PROJECT.md`, `architecture.md`, `conventions/`).
   `knowledge-base/decisions/` and `knowledge-base/reports/` are **historical by design** — ADRs and
   dated reports record what the rule *was*, so hits there are expected and correct.
   **Two known false positives** of the widened pattern, both verified benign and neither about the
   movers: `claude/README.md:86` (*"Wiki READS: any role, directly, via /fkit-query"* — ADR-005) and
   `reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:27` (a rejected git-agent option).
   **⚠️ Amended 2026-07-25 (round-1 review of this task, findings R1 + R2).** The original sweep had
   **two independent blind spots**, and each shipped a real defect into the working tree:
   - **A PATH gap (R1).** The path was `claude/ CLAUDE.md AGENTS.md`, which excludes
     `ai-agents/knowledge-base/` entirely — so `PROJECT.md:100-103` kept asserting the ADR-025 grant
     *and* "nothing structural replaced it", in an ADR-013 living-canon doc linked from root
     `CLAUDE.md`. **The regex would have matched it; the path never showed it the file.**
   - **A PHRASING gap (R2).** `task-status-vocabulary.md`'s "Set by" column read
     `Any agent, via /fkit-task-done` — a **verbless noun phrase**, which a modal+verb regex cannot
     match, in **both** the live and scaffold copies. The `, via ` alternation above is the patch.

   ⚠️ **This grep is a smoke test, never an inventory — a by-hand sweep is required regardless of a
   green result.** Recorded as an **accepted residual**: no single regex enumerates every way a
   permission fact can be phrased, and each amendment has only ever closed the *last* blind spot. A
   green step 6 is **weak evidence**; the by-hand sweep and an independent reviewer pass are the real
   ones. This is the **fourth** materialization of this brief's own standing finding (see Notes).
7. The ship-loops (0122/0123) already route closes to a producer spawn, so no loop invokes a now-denied
   mover.
8. **The sanctioned-hand-off carve-out is present in both agent definitions** — `fkit-coder.md` and
   `fkit-producer.md` each still carry the "a consult is a focused question, not a hand-off" rule
   **and** an explicit exception for the producer-spawn-to-close (ADR-033 §3/§4). Neither file
   forbids, without qualification, the hand-off its own ship-loop step performs.
9. **`claude/agents/fkit-lead.md` no longer says the driver closes tasks itself.** Read the
   `/fkit-sprint-ship-loop` bullet (`:54-58`) **by hand** and confirm it describes a spawned-producer
   close with the marker attributed to the producer. ⚠️ **Step 6's grep does not cover this** — its
   regex targets *"any role may invoke/close"*, not *"closes each task itself"*. A green step 6 is
   **not** evidence for this step. Also grep `claude/agents/` and `claude/skills/` for
   `closes? (each )?(the )?task itself` and confirm no live source still asserts a self-close.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0122 and 0123 (the ship-loops must route to the producer before the grants are removed).
- **Blocks:** 0126.
- **Recommend co-landing with 0125** (the wiki flag convention) — once this removes the movers from
  `wiki`, 0125's flag is the wiki's only completion signal.
- **⚠️ Coordinate with 0115 on architecture.md** — 0115 also edits architecture.md (lead prose + §5.2
  lock). This task touches only the mover-ownership mirror rows. Sequence so neither reverts the other.
- **⚠️ Scope amended 2026-07-25 (producer).** The brief as first written listed only the four
  `skills-for-role.sh:12-24` mirrors. A sweep this session found **three further live sources** asserting
  the ADR-025 grant that the checklist does not cover — `claude/scaffold/universal-rules.md:7`,
  `claude/agents/fkit-producer.md`, `claude/agents/fkit-coder.md` — now added as **item 5** with a
  verification sweep at step 6. These are **system prompts**, not docs: had they been missed, 0124 would
  have shipped a runtime where the ADR-018 hook denies the coder a mover while `fkit-coder.md:190-191`
  still instructs it to invoke one. **The mirror checklist is not a complete inventory** of where a
  skill-ownership fact is stated; treat that as the finding, not just this instance.
- **⚠️ Scope amended again 2026-07-25 (producer, on the owner's live ruling during the 0122 ship-loop
  run).** Task 0122's review surfaced a **hard-rule contradiction that no filed brief owned** — the
  "a consult is a focused question, not a hand-off" rule at `fkit-coder.md:165` and
  `fkit-producer.md:67` forbids the producer-spawn-to-close that ADR-033 §3/§4 make the sanctioned
  terminal act of both ship-loops. The owner ruled it belongs in **item 5**, which already edits these
  two files for exactly this class of ADR-033 ripple but named the wrong lines. Recorded as an **open
  dependency on 0122's review ledger** — it closes only because this brief now visibly lists both
  references. New verification step 8 guards it.
- **⚠️ Scope amended a third time 2026-07-25 (producer, on the owner's live ruling during the 0123
  ship-loop run).** Task 0123 found a **fourth** system prompt asserting the reversed posture —
  `claude/agents/fkit-lead.md:56-57`, *"closes each task itself with the `(agent-closed — not
  owner-verified)` marker by default"*. Item 5 named `universal-rules.md`, `fkit-producer.md` and
  `fkit-coder.md` but **not** `fkit-lead.md`; the owner ruled it the same disposition as the
  `fkit-coder.md:165` / `fkit-producer.md:67` case, so it is now listed in item 5 with new
  verification step 9. **This is the second time the inventory was found incomplete** — and this one
  would have slipped step 6's sweep entirely, because the sweep matches phrasing, not meaning.
  Treat *"a grep for one phrasing is not an inventory"* as the standing finding.
  Recorded as an **open dependency on 0123's review ledger** (`Open dependencies` section) — it closes
  only because this brief now visibly lists the reference.
- **Touches 0130's budget.** Item 5's `universal-rules.md` edit changes the size of the rules block that
  0130 is trying to reclaim headroom in. Whichever lands second must re-measure.
- **ADR-033 is honest about the limit:** this restores separation of the closing *identity* (hook-
  enforced), **not** full prevention — a determined doer can still spawn a producer to close. Do not
  "harden" beyond the ADR; that residual is accepted and named (ADR-033 §The limit).
- No commit — leave the coordinated edit in the working tree (the mirror set must move together when the
  owner does commit).
