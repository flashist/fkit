# Review — implement-spawned-invocation-for-task-movers

Task: `ai-agents/tasks/backlog/implement-spawned-invocation-for-task-movers.md`
File(s) under review: working tree vs `HEAD` — `claude/skills-for-role.sh`,
`test/skill-ownership-hook.test.js`, `claude/skills/fkit-task-{done,cancelled,ship-loop,brief,team,status}/SKILL.md`,
`claude/agents/fkit-{coder,producer}.md`, the three hard-rule homes, the conventions docs (live +
scaffold), `ai-agents/knowledge-base/architecture.md`, ADR-025 amendment.
Governing ADR: **ADR-025** (its "re-raise only if" is in force — see *Suppressed as settled* below).
Status: closed-out

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `claude/agents/fkit-coder.md:40-45,59-62` | The coder's own system prompt still says the ship-loop stops at the **done-gate** and "does **not** move task files" — directly contradicting `fkit-task-ship-loop/SKILL.md:145`, which now requires it to invoke `/fkit-task-done`. Same file was edited elsewhere in this diff; two hunks missed. A role prompt outranks the skill it loads, so this can stop the feature executing at all — X1's failure class inverted (prose forbids what the mapping grants). |
| R2 | 1 | high | `claude/skills/fkit-task-done/SKILL.md:58` vs `:143-145` | The owner-verification **upgrade path is unreachable**. Step 1 stops unconditionally when the brief is already under `tasks/done/`; an agent-closed task is *always* there. So the `:143-145` branch replacing `✅ Done (agent-closed — not owner-verified)` with plain `✅ Done` can never run. Worklog decision #3 calls this "the one legitimate upgrade path" — it is dead code, so an agent-closed marker can never be cleared, and its signal decays to noise. Raised by both reviewers. |
| R3 | 1 | med | `claude/skills/fkit-status/dashboard.sh:582-585` | The new cancelled marker **defeats `cancelled-without-reason` detection**. The reason check is `grep -q '—'`; the qualifier `(agent-closed — not owner-verified)` contains its own em-dash, so it satisfies the check with no reason present. Verified: `⛔ Cancelled (2026-07-19)` → `cancelled-without-reason`; `⛔ Cancelled (agent-closed — not owner-verified) (2026-07-19)` → **CLEAN**. This removes the only automated audit on the path ADR-025 itself names "audited by nobody". Worklog decision #1 verified the date check and the happy-path reason check, but not the no-reason case. |
| R4 | 1 | med | `claude/skills/fkit-task-cancelled/SKILL.md:148,210,241` | The "resolve the status value FIRST" indirection is stated once and then contradicted by every downstream literal: `:148` "the **full canonical marker** — `⛔ Cancelled (YYYY-MM-DD) — <reason>`", `:210` same, `:241` "this skill writes **exactly one value**" showing only the plain form. `fkit-task-done` was hardened symmetrically (its `:139-145` and vocabulary section both name **both** variants); `fkit-task-cancelled` was not. An agent following the later, more specific text writes an owner-looking cancellation — the marker failing in practice. Compounds with R3 on the same path. |
| R5 | 1 | med | `claude/agents/fkit-producer.md:95-96`; `claude/skills/fkit-task-brief/SKILL.md:103`; `ai-agents/knowledge-base/architecture.md:261,322`; `ai-agents/sprints/backlog.md:26` | Live artifacts still assert the reversed rule. `fkit-producer.md:95-96` "**`Done` and `Cancelled` are owner-gated**"; `fkit-task-brief/SKILL.md:103` "those are owner-gated"; `architecture.md:261` "**only the owner moves**"; `:322` "→ **the owner** runs `/fkit-task-done`"; `backlog.md:26` "owner-invoked". The first two are **runtime instructions** and can make an agent refuse newly authorized behavior. Both `fkit-producer.md` and `fkit-task-brief/SKILL.md` were edited elsewhere in this diff — same-file misses. |
| R6 | 1 | med | `claude/skills/fkit-team/SKILL.md:52,59-62` | The `/fkit-team` roster — **one of the four mirrors `skills-for-role.sh:12-17` mandates** — still lists the movers under `producer` only, and the "every role also has…" paragraph names only query/team/open-questions/dumb-down. So `/fkit-team` under-reports lead, coder, architect, reviewer and wiki. Only the "Must not" cell was fixed. `claude/README.md:43` and `claude/scaffold/CLAUDE.md:30-31` both got this right, so the miss is isolated — but it is precisely the task-70 incomplete-checklist failure that file warns about, and worklog decision #4 claims all four mirrors were updated. Raised by both reviewers. |
| R7 | 1 | low | `CLAUDE.md:55-57`; `AGENTS.md:41-43`; `claude/scaffold/universal-rules.md:6-8`; `ai-agents/knowledge-base/PROJECT.md:90-93` | The hard rule over-claims: "**Any agent** may invoke them", but `skills-for-role.sh:42` excludes `adversarial-reviewer`. Fails **closed** (the hook denies), so no security impact — an accuracy defect. Notable because `AGENTS.md` is the Codex-facing layer the adversarial reviewer actually reads. `claude/README.md` and `scaffold/CLAUDE.md` phrase it correctly as "every role but `adversarial-reviewer`". |
| R8 | 1 | low | `claude/skill-ownership-hook.sh:69-78` | Codex reported malformed JSON reaching ALLOW. **Partially correct, and materially overstated.** Verified: the garbage payload allowed because it extracted `agent_type=fkit-coder` + `skill=fkit-task-done` and the coder legitimately owns that skill — the ALLOW was the *correct* decision. The same malformed shape carrying `fkit-adversarial-reviewer` still **denies**. Not privilege escalation. The file is **unchanged by this diff** and the lenient parsing is documented as deliberate at `:58-68`. **Pre-existing, out of scope; do not fix under this task.** |

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

**Round 1 — coder verdicts, 2026-07-19.** Every finding verified against the code before acting; none
taken on the reviewer's word. `npm test` re-run after the fixes: **387 pass / 0 fail + mutation gate
green.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | Fixed `claude/agents/fkit-coder.md` in all three places — the Mode paragraph's "between the plan gate and the done-gate", the trailing "and at the done-gate", and the skill bullet's "does **not** move task files". Now states the loop closes the task itself and the plan gate is the only human checkpoint. | ✅ Fixed |
| R2 | **CORRECT** | Defect | Confirmed: `task-done` step 1 stopped unconditionally on a brief already in `done/`, so my upgrade branch was unreachable — my worklog #3 described dead code. Made it reachable rather than deleting it: step 1 now carries an **owner-only** exception that continues (skipping the move, status updates only) when the brief reads the agent-closed marker. Kept because it is the only sanctioned way an owner records that they later verified agent-closed work — a real gap given ADR-025. | ✅ Fixed |
| R3 | **CORRECT** | Defect | Reproduced directly: the qualifier's own em-dash satisfied `dashboard.sh`'s reason check, so a **reasonless** agent-cancellation linted CLEAN — on the one closure path nobody audits. Escalated to the owner (the fix crossed the plan's fence around `dashboard.sh`); **owner ruled: fix it there.** `dashboard.sh:588-591` now strips `(agent-closed …)` before **both** conformance checks. Three regression tests added (R27/R27b/R27c) covering the reasonless agent form, the well-formed agent form, and the plain **owner** form — the last because the strip rewrites the value both checks see and could regress the owner path. **Verified genuinely red without the fix**, not merely green with it. | ✅ Fixed |
| R4 | **CORRECT** | Defect | Fixed `fkit-task-cancelled/SKILL.md` at all three sites (`:148` brief-status step, `:210` report line, `:241` vocabulary block). The vocabulary block said "exactly one value" and showed only the owner form; it now names both forms and marks date+reason mandatory in each. | ✅ Fixed |
| R5 | **CORRECT** | Defect | Fixed all five: `fkit-producer.md` status-vocabulary paragraph, `fkit-task-brief/SKILL.md:103`, `architecture.md:261` (data-model row) and `:322` (task-flow line), `sprints/backlog.md:26`. The first two are runtime instructions, so they were the ones that mattered. | ✅ Fixed |
| R6 | **CORRECT** | Defect | Fixed the `/fkit-team` roster's shared-skills paragraph to name the movers and the `adversarial-reviewer` exclusion. **My worklog #4 claimed all four mandated mirrors were updated; that was false** — I fixed only this roster's "Must not" cell and never its skills listing. Recorded as an overclaim, not a slip. | ✅ Fixed |
| R7 | **CORRECT** (sev lowered — agreed) | Defect | Fixed in all three homes of the hard rule (`scaffold/universal-rules.md`, `CLAUDE.md`, `AGENTS.md`): "Any agent may invoke them" → "Any role but the adversarial reviewer". Rules-block budget re-checked and still green. Agreed it fails closed — accuracy only. | ✅ Fixed |
| R8 | **PARTIALLY CORRECT — agreed overstated** | Pre-existing, not this diff | No action, and I agree with the reviewer's own downgrade. The hook is byte-unchanged by this diff; the ALLOW was correct on the identity actually extracted, and a hostile identity still denies. Fixing it here would be an unrelated change to the security-critical hook inside a task about permissions — exactly the kind of scope drift that hides a real regression. **Recorded as a residual, not dismissed:** worth its own task if the owner wants the parser hardened. | ➖ Won't fix here |

**Owner dispositions, 2026-07-19:** R3 → fix in `dashboard.sh` (done, above). Worklog decision #5
(the ship-loop's degraded-run and never-self-cancel conditions) → **ratified as recorded**; ADR-025's
Amendment block stands unchanged, and the reviewer's frontier-move classification is accepted.

**Final verification after all fixes:** `npm test` → **390 pass / 0 fail**, mutation gate green.

**Not disputed, not softened:** every finding the reviewer raised was `CORRECT` on verification. I found
no incorrect claim to push back on. The one pattern it named — R1/R5/R6 being stale assertions left in
files this same diff edited — is accurate and is the most useful thing in the review.

## Accepted residuals (shared, do-not-re-litigate)

Recorded by the reviewer at close-out, 2026-07-19, on the owner's dispositions.

- **Lenient JSON parsing in `skill-ownership-hook.sh` (from R8)** — What: the hook's field extraction
  (`claude/skill-ownership-hook.sh:69-78`) accepts malformed/partial JSON payloads, extracting
  `agent_type` and `skill` from a shape a strict parser would reject. Left as-is; not touched by this
  task. Why (structural): verified not a privilege escalation — the ALLOW observed was the *correct*
  decision for the identity actually extracted (`fkit-coder` + `fkit-task-done`, a skill the coder
  owns), and the same malformed shape carrying `fkit-adversarial-reviewer` still **denies**. The
  leniency is documented as deliberate at `:58-68`. The file is byte-unchanged by this diff (confirmed:
  `git diff HEAD` and `git status` both empty for it), so hardening it here would mean an unrelated
  change to the security-critical hook inside a permissions task — the scope drift most likely to hide
  a real regression. Re-raise only if: a payload shape is demonstrated that yields an ALLOW for an
  identity/skill pair the ownership map **denies** (i.e. an actual escalation, not a correct ALLOW on a
  malformed shape), **or** the hook's parsing is deliberately reopened under its own task.

- **Ship-loop degraded-run and never-self-cancel conditions (worklog decision #5)** — What: the
  ship-loop refuses to self-close on a degraded (Codex-absent) run, and never self-cancels; recorded in
  ADR-025's Amendment block, which **stands unchanged**. Why (structural): owner-ratified as recorded,
  2026-07-19, accepting the reviewer's **frontier-move (not defect)** classification. It is not a
  behavior regression — the pre-ADR-025 exit table already sent a Codex-absent run to the owner
  done-gate, a human stop, so the condition *preserves* that outcome rather than changing it; and
  never-self-cancelling follows ADR-025's own Consequences ("`cancelled/` is audited by nobody"). The
  ADR's wording is honest about their status ("loop-local conservatism, **not** guarantees this ADR
  provides"). Re-raise only if: the owner revisits the ADR-025 Amendment block, or evidence appears
  that the degraded-run condition blocks a run the owner expected to close autonomously.

## Suppressed as settled (raised, then dropped — not silently)

Checked against ADR-025's "re-raise only if". None of these is reported as a finding:

- **A spawned agent can move a task file** — that *is* the decision (ADR-025 Decision 2).
- **The audit marker is only prose / unenforced** — ADR-025 honesty clause. R3 and R4 are reported
  **only** because they show the marker *failing in practice* (a parser defeat and an internal
  contradiction), which the ADR expressly permits; neither restates the known limit.
- **A ledger / worklog / sign-off precondition would make this safe** — evaluated and rejected twice
  (design spec §3, ADR-019 rev-1). Not re-raised.
- **No unforgeable authorship signal exists** — attacked by the pre-implementation Codex pass and it
  survived. Not re-raised.
- **The marker is invisible in `/fkit-status`** — ADR-025 Amendment A3, accepted knowingly.
- **`fkit-adversarial-reviewer` is excluded from the movers** — ADR-025 Amendment A2, deliberate owner
  ruling. R7 concerns only the *documentation* of that exclusion, not the exclusion itself.

## Open question for the owner (not the reviewer's to settle)

**Worklog decision #5 — the ship-loop's degraded-run and never-self-cancel conditions.** Classified a
**frontier-move, not a defect**, and my recommendation is **keep**, for two reasons the coder did not
claim: (1) it is not actually a behavior regression — the old exit table sent a Codex-absent run to the
**owner done-gate**, which was a human stop, so the new condition *preserves* the pre-ADR-025 outcome
rather than changing it; (2) never-self-cancelling is directly supported by ADR-025's own Consequences
("`cancelled/` is audited by nobody"). The procedural gap is narrower than "scope creep": the
conditions were written into **ADR-025's Amendment block as settled** before the owner ruled on them.
The ADR's wording is honest (it labels them "loop-local conservatism, **not** guarantees this ADR
provides"), so the fix if the owner disagrees is small. **The owner's call: ratify as recorded, or
strike.**

## Convergence

Round 1 — no prior rounds, no re-litigation. Eight novel findings, none matching a settled residual.
Recommend **act**, not closeout.

**Close-out, 2026-07-19 (reviewer, phase 2).** ✅ **Closed — 7 defects fixed, 1 residual recorded, no
open findings.** No round 2 was run and none is needed: the owner's dispositions resolved the only two
findings still open, and every other finding was already `✅ Fixed` in round 1.

Re-verified independently at close-out, not taken on the coder's report:
- **R3 fix present and correct as described** — `claude/skills/fkit-status/dashboard.sh:590` strips
  `(agent-closed[^)]*)` into `st_reason`, and **both** conformance branches (`:591` date, `:593`
  reason) test the stripped value, so the qualifier's own em-dash can no longer satisfy the reason
  requirement. The three regression tests exist at `test/dashboard-contract.test.js:820` (R27,
  reasonless agent form caught), `:833` (R27b, well-formed agent form clean + date still parses),
  `:847` (R27c, plain OWNER form unaffected by the strip). R27c is the right pin: the strip rewrites
  the value both checks see, so the owner path was the plausible regression.
- **Suite green** — `npm test` re-run here: **390 pass / 0 fail**, mutation hard gate PASSED (each
  named mutation reds its own assertion).
- **R8's out-of-scope basis holds** — `claude/skill-ownership-hook.sh` is byte-unchanged by this diff.

Scope note on the R3 fix, recorded because the fence was crossed deliberately: the strip is applied to
the `cancelled` branch only. Checked and correct — `blocked` (`:577`) never carries the agent-closed
qualifier, and the `done` marker has no conformance check for the qualifier's em-dash to defeat. No
further coverage is owed.

The owner's ruling to fix inside `dashboard.sh` crossed the fence the approved plan drew around that
file. Recorded as an **owner-authorized scope extension**, not scope drift — escalated before acting,
ruled on explicitly, and covered by tests verified genuinely red before the fix.
