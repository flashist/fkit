# Review — 0162

Task: `ai-agents/tasks/backlog/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/brief.md`
File(s) under review:
- `ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md` (new, untracked)
- `ai-agents/tasks/backlog/0162-.../plan.md` (new, untracked)
- `ai-agents/tasks/backlog/0162-.../worklog.md` (new, untracked)
- `ai-agents/tasks/backlog/0162-.../brief.md` (modified — `## Status` flip only, made by the driver)

Status: closed-out

> **Closed by the coder at the end of round 1, on the ADR-034 bar** — *a ledger closes once the swept
> **work product** is clean.* The work product is the report; R1–R4 and R6–R8 all sit in it and are all
> fixed. R5 sits in the task's **own record** (`worklog.md`), which ADR-034 would route to *Accepted
> residuals* rather than another round — the owner ruled it FIXED instead, which is the stronger outcome.
> **Nothing blocking remains.**
>
> ⚠️ **Scope of that claim, stated so nobody over-reads it.** "Closed-out" here means *the coder verified
> each finding and applied the owner's ruling for it.* **No independent re-verification of the eight
> applied fixes has run** — the reviewer's round-1 verdict line below is a snapshot taken **before** them
> and is left untouched (reviewer-owned). If the owner wants the fixes independently confirmed, that is a
> round 2, and it is cheap.
>
> **Owner's decision on that, `AskUserQuestion`, live `fkit-lead` session, 2026-08-02: NO round 2 —
> close on ADR-034's work-product bar.** The limit above was put to the owner **explicitly**, together
> with the fact that **R1's fix widened from the 2 dispositioned sites to 6**, and the owner **accepted
> that cost**. The paragraph above is therefore left standing **unsoftened, by instruction**: this ledger
> closes with the eight fixes verified by their author and by nobody else, and a later reader is meant to
> know it.

**Verdict (round 1): 🛑 Blocked — 7 confirmed defects (2 high), 1 partially correct.**
**Codex coverage: FULL** — `codex exec --sandbox read-only`, codex-cli 0.145.0, exit 0. Not degraded.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `reports/2026-08-02-faithful-carry-of-an-approved-plan.md:358`, `:442` | The ADR-037 §5 correction is mis-premised: the proposed hook cannot make condition **(b)** checkable, because (b) reads *"carries a concrete **approved plan** verbatim"* and the hook checks byte-equality against a named file, not approval. §6/§9 state this correctly; §7 and follow-up 4's prescribed note text both drop the qualifier — and follow-up 4 is owner-REQUIRED and written from that text alone. Raised by both reviewers. |
| R2 | 1 | high | same file `:182-186`, `:440` | The prescribed construction does not produce byte-identity in this harness. `Read` returns `cat -n`-framed output (line-number + tab per line) and caps at 2000 lines by default. Pasting it "unaltered" yields text whose `git hash-object` can never equal the file's blob hash, and silently truncates a long plan — the exact case §4 forbids. "True by construction" fails on the tool it names. Raised by Codex; confirmed firsthand. |
| R3 | 1 | medium | same file `:440` vs `:441` | Sequencing gap: follow-up 2 (emit path+hash pointers) is gated only on follow-up 1, while follow-up 3 (the hook that checks them) is separately gated and owner-ranked. Between them, drivers emit self-computed, self-reported hashes that nothing verifies — the same unfalsifiable-certification shape the report condemns. Never named. |
| R4 | 1 | medium | same file `:222-224`, `:207-211`, `:418-420` | The named residual is not the only gap, and the pointer is weaker than claimed. `git hash-object` **without `-w`** stores nothing, so for an untracked, later-rewritten `plan.md` a "later reader auditing a worklog" can recover nothing — the claimed audit value is false. Two further uncovered cases: the Build worker still writes `plan.md` (`SKILL.md:103`), so a Build-time rewrite makes the *Process-review* carry faithful to bytes the owner never saw; and no TOCTOU statement covers hook-read vs spawn. Raised by Codex; confirmed. |
| R5 | 1 | medium | `worklog.md:83-84` | Brief verification steps 6 and 7 are graded ✅ against reworded criteria. Step 6 (`brief.md:136-137`) requires *"`git status` shows no new file under `ai-agents/tasks/`"*; step 7 (`:138-140`) requires one report file *"and nothing else"*. `0162/plan.md` and `0162/worklog.md` are new files under `ai-agents/tasks/`. The worklog substitutes "no new **brief**" for "no new **file**" and records a pass. The files are legitimately loop-mandated and honestly disclosed at report `:8-9` — the substance is fine, the grading record is not; the correct entry is "superseded", not ✅. Raised by Codex; confirmed. |
| R6 | 1 | low | same report `:19`, `:114`, `:222` | Three stale internal section cross-references: `:19` names "§5 (machine-checkability), §6 (ADR-037 interaction)" — actually §6 and §7; `:114` "(see §6)" — actually §7; `:222` "by a hook (§5)" — actually §6. Verified against the report's own headings. In a report that files follow-up 6 to repair stale coordinates, cites ADR-037's citation-form block, and is queued for wiki ingest. Raised by Codex; confirmed. |
| R7 | 1 | low | same report `:493`, `:498`, `:499`, `:501`, `:502` | §12 evidence table carries unresolvable elided paths (`adr-037-…`, `0195-…`, `0147-…`) in the one table whose purpose is letting a reader re-verify. `:498` cites `0195/plan.md:88-97` for "four OQ rows" — OQ-4 is at `:98`, outside the range it counts. `:502` lists an unreproducible start-of-turn `ls` under "verified firsthand this turn"; by the report's own §0 taxonomy that is worker testimony, not disk evidence. Raised by Codex; confirmed. |
| R8 | 1 | low | same report `:26` | **PARTIALLY CORRECT.** §0's *"not the load-bearing evidence for any conclusion below"* is slightly stronger than the text supports: §2 (`:165-169`) argues the central construction from round 2's truncate-and-certify, and §3 (`:222-224`) justifies the pointer half with *"which is precisely why round 2's false certification worked"* — both pure testimony. The conclusions do survive without them (§2 is independently anchored by the disk-checkable `0195` miscount; §3's "a paste alone is unfalsifiable" is a logical property), so this is wording, not a collapsed conclusion. |

### Detail on R1 — the load-bearing move

ADR-037 `:252-256` scopes §5 to *"The named-owner-ruling marker **cannot be verified from a worker's
context**… Any 'enforcement' would check a forgeable string"*, and extends *"the identical posture
already accepted for the declared-approval marker"*. Condition (b) is quoted at ADR-037 `:96-97` and
lives at `claude/agents/fkit-coder.md:65-66`: *"it carries a concrete **approved plan** verbatim"*.

A `PreToolUse`/`Task` hook can establish *the prompt contains the bytes of the file at path P with hash
H*. It cannot establish that P is the plan the owner approved. So the hook makes a **strictly weaker
proxy** checkable, not (b). The report already knows this — §6 caveat 1 (`:316-319`) *"It cannot confirm
anyone approved them"*; §9 (`:418-420`) *"The hash pins which bytes were carried, not which bytes were
approved"* — but §7 (`:358-361`) and follow-up 4's prescribed text (`:442`) assert flatly that (b) is
mechanically checkable.

Because follow-up 4 is **owner-REQUIRED (OQ-3)** and its text is specified *"precisely enough to be
written from that text alone"*, writing it as prescribed appends to ADR-037 a dated correction
overstating exactly the guarantee ADR-037 exists to prevent overstating (*"do not harden it into a false
guarantee"*).

Secondary: the report tested only ADR-037's `:362-364` re-raise bullet and never engaged `:365-367` —
*"**Do NOT re-raise** that this is unenforced prose, that the marker is forgeable…"* — a partial reading
of the residual block it relies on to authorize the narrowing.

### Detail on R2 — the construction fails on the tool it names

Report `:182-186` prescribes: *"`Read(<task-folder>/plan.md)` in the same turn as the spawn"* → *"Paste
that tool output into the spawn prompt, unaltered"* → *"Cite the source alongside the paste: the path,
plus a content hash"*.

In this harness `Read` returns content in `cat -n` format (line number + tab prefix on **every** line)
and reads **up to 2000 lines by default**. Verified firsthand — every `Read` result in this review came
back line-number-prefixed. Two consequences, both fatal to *"true by construction"*:

1. Pasting the output unaltered yields line-numbered text whose `git hash-object` **never** equals the
   file's blob hash. Follow-up 3's hook, comparing them, denies every spawn — or is written to strip the
   framing, which re-introduces a transformation the construction exists to eliminate.
2. `Read`'s default line cap **silently truncates a long plan** — the exact case §4 rules on
   (*"Truncation is never permissible"*). The tool truncates before the driver forms any judgment, and
   the driver is then instructed to paste the result and call it verbatim.

The construction needs a byte-exact read (e.g. `Bash(cat …)`) or an explicit de-framing plus
full-read/EOF check. Neither is stated. Follow-up 2 (`:440`) writes the flawed form into `SKILL.md`.

---

## Verified as CORRECT — recorded so the coder does not re-chase them

- **All six of the worker's corrections to its own approved plan hold.** C1: `SKILL.md:109` is the
  heading `**Rules that make this honor the ADRs:**`, the bullet runs `:110-116` — both citations stale,
  confirmed. C2/F5: `test/skill-frontmatter.test.js` reads every skill and agent file (`:323`) but
  `auditFile` (`:188`) inspects **frontmatter only**; corpus pinned non-vacuous at `EXPECTED_SKILLS = 25`
  / `EXPECTED_AGENTS = 7` (`:574-575`). I swept all 16 files in `test/` — **no other test reads a skill
  or agent body**; the corrected claim is exactly right. C3: `0157` is in `done/`, `0152`/`0154` in
  `backlog/`. C4: `fkit-claude.sh:296` wires exactly two `PreToolUse` matchers (`Skill`,
  `AskUserQuestion`); `shiploop-marker-hook.sh` is `UserPromptExpansion`. C5: `.claude/settings.local.json`
  exists, `grep -c hooks` → `0`. C6: `git hash-object` on the untracked `0195/plan.md` → `fc69b74…`,
  matching the report.
- **F2 fully verified** — `plan.md` named once (`:103`); zero occurrences of "artifact" in the sprint
  loop; `0147/` and `0150/` have no `plan.md`, `0143/`/`0158/`/`0195/` do; task-loop `:102`, `:136`,
  `:143` quoted accurately.
- **F3 verified** — `fkit-claude.sh:296` matcher wiring; `skill-ownership-hook.sh:41-47` deny payload;
  `:70-79` jq-free `"[^"]*"` extraction, genuinely unable to parse a prompt field.
- **F4 verified** — `fkit-coder.md:93-98`. Grep confirms **zero** worker-side detection mechanisms
  proposed anywhere in the report (brief verification step 3 passes).
- **Condition (b) / `0163` ruling verified** — `0163` is `🔲 Backlog`, P142, and its brief `:96-100` keys
  the clause on (a)(b)(c); `:98` explicitly anticipates `0162` re-wording (b). "Needs no edit" is right.
- **Scope discipline CLEAN.** No ADR written or edited by this task (ADR-037 is untracked from `0158`);
  no `SKILL.md`, no agent `.md`, no test, no hook, no brief filed by `0162`, nothing under
  `ai-agents/wiki-vault/`, no board or sprint-plan row, no folder move. `brief.md`'s diff is the driver's
  `## Status` flip and nothing else. **No commit** — HEAD is `d89885c` (11:58); the work landed 21:36–21:59
  and every artifact is untracked.
- **Suite green, independently re-run** — `node --test 'test/*.test.js'` → **tests 560 / pass 560 /
  fail 0**; `npm test` prove-red hard gate PASSED, 13 mutations each redding its named assertion. Matches
  the worklog's claim exactly.
- **All five brief questions answered under their own headings** (§2–§6) plus §7 for the ADR-037 flag —
  answered, not gestured. By-reference genuinely weighed with a three-property distinction (§3).

## Re-litigates settled decisions (suppressed)

**None.** Codex was primed with the settled list (marker is trust-not-proof; report-only scope;
prose-enforced cost accepted per ADR-031/ADR-032; ADR-014 zero-devDeps) and respected all four — it
raised no finding against them. No finding in this round re-opens a settled tradeoff.

## Convergence call

**Act, do not close out.** Round 1 on a fresh ledger; every finding is novel and none re-litigates a
residual. R1 and R2 are both *upstream of unwritten follow-ups* — they are cheapest to fix now, in the
report, before follow-up 2 copies the construction into `SKILL.md` and follow-up 4 copies the
mis-premised claim into ADR-037. Fixing them after those land costs two more correction notes in a repo
already carrying a stale-coordinate arc (`0160`/ADR-035/ADR-036/`0143`/`0195`).

---

## Coder response

_(coder-owned — reviewer does not write here)_

**Round 1 processed by `@fkit-coder` via `/fkit-process-stateful-review`, 2026-08-02**, spawned as the
Process-review worker of `/fkit-sprint-ship-loop` under the declared-approval marker. The ADR-018
skill-ownership hook **permitted** the skill. **The owner ruled all eight findings individually** via
`AskUserQuestion` in the live driver session before this worker was spawned; those dispositions are the
approval gate for every change below — nothing here was applied on the coder's own initiative.

**Every one of the eight was verified firsthand against live files before action. All eight hold.**
Severity was re-derived independently, not inherited: **all eight severities are confirmed as graded.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | Rewrote every claim that condition **(b)** is machine-checkable to read **"a carry-fidelity proxy for (b)"** — (b) says *approved* (`adr-037-…:96-97`, `fkit-coder.md:65-66`) and no hook reaches approval. Sites: report §6 caveat 1, §6 summary, §7 (×2 + new block), §9 (×2), follow-up 4's prescribed text, follow-up 3's caveat list. Added a §7 paragraph showing the correction stays clear of ADR-037 `:365-367`'s "Do NOT re-raise" fence. | ✅ done |
| R2 | **CORRECT** | Defect | Report §2 construction rewritten: **byte-exact `Bash(cat …)`, explicitly not the `Read` tool**, plus a mandatory whole-file check against `wc -c`; added a blockquote naming both `Read` failure modes (`cat -n` framing defeats hash equality on every well-behaved spawn; the 2000-line cap silently truncates — the case §4 forbids). Follow-up 2's text rewritten to match. Confirmed firsthand: every `Read` this turn returned line-number-prefixed output. | ✅ done |
| R3 | **CORRECT** | Defect | Follow-up 2 now **requires the `SKILL.md` rule text itself** to mark the emitted pointer `unverified — no hook checks it until follow-up 3 lands`; gate reads "ships without waiting for 3". Per the owner: ship with the honesty text rather than hard-gate on 3. | ✅ done |
| R4 | **CORRECT** | Defect | Three parts. (i) §3: `git hash-object` **without `-w` stores nothing** — verified by `git cat-file -e` reporting the object absent — so the pointer is **tamper-evidence at spawn time, not an archive**; the "later reader auditing a worklog" claim corrected. (ii) §6: new **caveat 4 — TOCTOU** between hook-read and worker-use (now five caveats; follow-up 3 updated). (iii) §9: new bullet for the **Build-time-authoring** case — a Build worker that *renders* rather than *copies* poisons every later carry. | ✅ done |
| R4b | **CORRECT — and now confirmed in production** | Defect | ⚠️ **The gap R4 (iii) names was exercised live, on this task.** `0162/plan.md` (blob `2458a57eda55ca774884110e76dee1bf91b6d6e0`, 9625 B, 123 lines) is **not** the approved plan: `grep -F` finds *"the decisive structural fact"* **absent** and *"OQ-4 — timing"* **absent**; its `## 0.`–`## 7.` structure matches neither the approved plan's. The Build worker **authored** its own rendering instead of copying the approved bytes. A pointer-carry to it would have hash-verified **green against bytes the owner never approved**. Upgraded in §9 from a noted residual to a dated, evidenced observation; §0.1 and §12 point at it. **Qualified explicitly: follow-up 1 closes this route (no worker is ever asked to reconstruct the plan), NOT the class** — a driver persisting an unapproved plan stays undetected. | ✅ done |
| R5 | **CORRECT** | Defect (record, not substance) | `worklog.md` §4 rows for brief steps 6 and 7 **re-graded ✅ → "⚠️ superseded (loop-mandated artifacts)"**, each now quoting the criterion **as written**, why it is superseded (ADR-020 / sprint-loop mandate `plan.md`, `worklog.md`, `review.md`), and which half genuinely holds. Not re-argued — the substance was always fine and was disclosed at report `:8-9`. **Severity kept at medium**, not cosmetic: a ✅ against a silently reworded criterion is the same self-certification shape this task exists to fix, sitting in the ADR-032 A4 audit record. | ✅ done |
| R6 | **CORRECT** | Defect | Three stale internal refs fixed against the report's own `## N.` headings: `:19` "§5/§6" → **§6/§7**; `:114` "(see §6)" → **§7**; `:222` "by a hook (§5)" → **§6**. | ✅ done |
| R7 | **CORRECT** | Defect | §12: elided paths (`adr-037-…`, `0195-…`, `0147-…`) expanded to full resolvable paths; `0195/plan.md:88-97` → **`:88-98`** (OQ-4 confirmed at `:98`); the non-reproducible start-of-turn `ls` row **marked non-reproducible** and re-classified nearer testimony per §0's own taxonomy; a re-runnability note added above the table; three new evidence rows added. | ✅ done |
| R8 | **PARTIALLY CORRECT** — as the reviewer itself graded it | Defect (wording) | §0's *"not the load-bearing evidence for any conclusion below"* softened to: **no conclusion depends on testimony**, but §2 and §3 draw **illustrative** support from it, and both survive its removal (§2 on the disk-checkable `0195` miscount, §3 on a logical property). **Wording only — nothing restructured**, per the owner. The reviewer's own finding that the conclusions survive is what the new text now says. | ✅ done |

**Carried forward as settled — verified by the reviewer, not re-checked here** (owner instruction): the
six Build-phase self-corrections C1–C6 / D1–D6, all independently confirmed **CORRECT**, including the
sweep of all 16 files in `test/` confirming **no test reads a skill or agent body**; **F2**, **F3**, **F4**
verified; **`0163` needs no edit**; **Codex coverage FULL**.

**Loop check (Step 2).** No finding re-litigates an *Accepted residual* — the ledger has none. Against
**settled ADRs**: only ADR-037 `:365-367` fences anything nearby (*"Do NOT re-raise that this is
unenforced prose, that the marker is forgeable, or that a skill rule should have been marked
undisplaceable"*). **No finding trips it.** R1 sharpens the report *away* from that fence: claiming "(b)
is checkable" drifts toward re-opening forgeability, while "a carry-fidelity proxy for (b) is checkable"
is a factual narrowing that leaves forgeability untouched. Recorded in report §7 so follow-up 4's author
inherits the reasoning. **Zero suppressed findings this round.**

**Convergence.** Round 1, fresh ledger, all eight novel, all eight actioned. **Nothing is deferred and
nothing is disputed** — the ledger closes on the work product (ADR-034). No re-review is required unless
the owner wants the eight fixes independently confirmed.

**Verification.** `npm test` → **`tests 560 / pass 560 / fail 0`**, `suites 17`; prove-red hard gate
**PASSED** — baseline and all 8 unmutated copies green, all 13 mutations red their **named** assertion.
Unchanged from the Build phase, as expected: **this round changed only markdown.** No source, no
`SKILL.md`, no agent definition, no test, no ADR, no hook, no brief, no board row, nothing under
`ai-agents/wiki-vault/`. No status change, no folder move. **No commit, no push.**

## Accepted residuals (shared, do-not-re-litigate)

- **`carried-not-approved`** — *recorded on the owner's explicit disposition via `AskUserQuestion` in the
  live `fkit-lead` session, 2026-08-02, after this round's report named it as an unrecorded candidate.*

  **What (the accepted behavior):** the carry construction — byte-exact read → unaltered paste → path +
  `git hash-object` pointer — pins **which bytes were carried, not which bytes were approved.** A driver
  that writes a `plan.md` the owner never approved, then carries it faithfully and hashes it correctly,
  produces a **green check over bytes the owner never saw**, and nothing in the system detects it. The
  owner accepts this gap, characterized as the owner characterized it: **the construction is
  tamper-evidence against sloppiness, not a guarantee against a driver that fabricates.**

  **Why (structural):** approval is granted in a **live session channel that leaves no artifact**
  (ADR-021 — the owner channel is session-only). There is nothing on disk for any mechanism to compare a
  `plan.md` against, so the gap is not an unbuilt feature but a consequence of where approval lives. Two
  facts fix this as structural rather than provisional, both verified this round:
  `claude/askuserquestion-marker-hook.sh:57` writes an **empty** marker (`: > .fkit/state/askuq-$session_id`)
  — it records **that** the tool was called, never the question or the answer; and no session transcript
  is stored in the repo (`find . -name "*.jsonl"` excluding `node_modules/` → empty).

  **Alternatives weighed and rejected:**
  - *A `PreToolUse`/`Task` carry-check hook (follow-up 3)* — **does not close it.** It compares the paste
    against the file; both can be the driver's own fabrication. It checks a **carry-fidelity proxy for
    condition (b)**, never (b) itself, which asserts the plan was *approved* (finding R1).
  - *Follow-up 1 — write `plan.md` at plan approval* — **does not close it, and must not be recorded as
    if it does.** It closes only the **reconstruction route** (a Build worker re-rendering the plan
    instead of copying it — the route confirmed live on this task, R4b). A driver persisting a plan the
    owner never approved is untouched by it. **Fixing the likely route is not fixing the class.**
  - *A worker-side check* — **impossible**, not merely hard (finding F4; `claude/agents/fkit-coder.md:93-98`).
    The worker has nothing to compare against.

  **Re-raise only if** any one of these becomes true — each is testable, none is "if new evidence emerges":
  1. **The harness persists the *content* of an `AskUserQuestion` exchange** to any worker- or
     hook-readable artifact. Concrete test: the marker at `.fkit/state/askuq-<session_id>` (or its
     successor) becomes **non-empty**, or any file records the question or answer text. Approval would
     then have a durable referent, and the gap becomes closable rather than structural.
  2. **Session transcripts become stored in-repo** — `find . -name "*.jsonl"` (excluding `node_modules/`)
     returns a non-empty result. Approval would become retro-verifiable.
  3. **A second confirmed divergence between a carried `plan.md` and the owner-approved text occurs
     AFTER follow-up 1 has landed.** One instance (R4b) is the known reconstruction route and is what
     follow-up 1 addresses; a second, post-fix, means follow-up 1 missed the route and the diagnosis —
     not just the gap — needs re-opening.

  **Do NOT re-raise** that the marker is forgeable, that this is unenforced prose (both fenced by ADR-037
  `:365-367`), or that follow-up 1 ought to have closed this — it explicitly does not, by design, and
  that is recorded above rather than overlooked.
