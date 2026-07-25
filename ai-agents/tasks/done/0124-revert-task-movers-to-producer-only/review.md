# Review — 0124

Task: `ai-agents/tasks/backlog/0124-revert-task-movers-to-producer-only/brief.md`
File(s) under review: the uncommitted working-tree change — 18 files (excluding
`ai-agents/sprints/sprint-2.md` and this task's `brief.md`, which are the sprint driver's own
bookkeeping), plus the gitignored `.claude/` refresh.
Status: closed-out

Round 1 reviewers: fkit-reviewer (Claude) + Codex adversarial pass (`codex-cli 0.145.0`,
`--sandbox read-only`). **Both reviewers ran — coverage is complete.**

**Round 1 outcome (closed-out).** Four findings raised, all four verified `CORRECT`, all four fixed
across **11 edit sites** (R1 ×1, R2 ×4 — two rows in each of two copies, R3 ×8, R4 ×1). Zero
re-litigation of anything in *Accepted residuals*. Owner dispositions recorded below and in the
*Accepted residuals* section. **One reviewer error is recorded against the reviewer — see the R3
correction notice.** Post-fix state re-verified by the driver (`npm test` 521/521, `prove-red.sh`
hard gate PASSED) and independently by this reviewer: amended step 6 → zero hits; all 8 citations
resolve to the text they claim; no surviving mover grant for any non-producer role.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `ai-agents/knowledge-base/PROJECT.md:100-103` | The living-canon project brief still asserts the ADR-025 grant verbatim — *"which, since ADR-025, **any role may invoke**"* — and additionally states *"nothing structural replaced it"*, which ADR-033 §1 makes doubly false (the ADR-018 hook now enforces producer-only at any spawn depth). Verification step 6's sweep could not have caught it: its search **path** is `claude/ CLAUDE.md AGENTS.md`, which excludes `ai-agents/knowledge-base/` entirely. The regex itself *would* have matched — this is a **path** gap, not a phrasing gap, and a distinct failure mode from R2. `architecture.md`, PROJECT.md's partner in the ADR-013 "living canon" pair, was updated; PROJECT.md was not. |
| R2 | 1 | medium | `ai-agents/knowledge-base/conventions/task-status-vocabulary.md:18,20` **and** `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md:18,20` | The canonical status table's **"Set by"** column still reads `Any agent, via /fkit-task-done` and `Any agent, via /fkit-task-cancelled`. Both copies' *prose* was rewritten correctly to producer-only, so each file now **contradicts itself** 13 lines apart — in the one document whose stated purpose is to be the single place the vocabulary is defined. Evaded step 6's regex because `any (role\|agent)[^.]{0,50}(may\|can) (invoke\|close\|run)` requires a modal + action verb, and `Any agent, via …` is a verbless noun phrase. The column is unambiguously a permission column (its sibling rows read `Producer`, `Owner, via …`, `Anyone — freely`). Correct value is a spawned producer, not any agent. Both copies are inside the owner-approved scope. Raised by **both** reviewers. |
| R3 | 1 | low → **medium (revised)** | 8 sites across `claude/skills/fkit-task-ship-loop/SKILL.md:115,188,189` and `claude/skills/fkit-sprint-ship-loop/SKILL.md:179,180,223` | **Citation drift newly introduced by this diff.** ~~Three sites~~ **Eight** sites cite `fkit-task-done/SKILL.md` by line range; this diff shifted the file and **every one of them went stale**. Two distinct rules are cited: the **owner-verification-upgrade** rule (`:60-64` → **`:78-82`**, 4 sites) and the **never-hand-edit** rule (`:265-267` → **`:283-286`**, 4 sites). Pre-diff both were correct, so this is a regression, not pre-existing rot. ⚠️ **This row as originally written was wrong twice over and is corrected in place — see the R3 correction notice below.** Severity revised low → medium: 8 stale cross-references, not 3, and the reviewer's own disproof would have entrenched half of them. |
| R4 | 1 | low | `claude/skills/fkit-task-cancelled/SKILL.md:335` | The status-vocabulary marker gloss still labels the agent-closed cancel form `(any agent)`. The parallel "Resolve the status value FIRST" table at `:58-64` in the same file *was* correctly updated to *"A **producer spawned** to cancel"*, so this is leftover residue of the same class, inconsistent within one procedure. Milder than R2 (it is a marker gloss, not a permission column, and correct prose sits 8 lines below), but same root cause. `fkit-task-done/SKILL.md`'s equivalent gloss is clean. Raised by **both** reviewers. |

### Disproven / not to chase (recorded so no one re-derives them)

- **`task-status-vocabulary.md:64`** (*"The mover skills already do this — do the same by hand"*) —
  Codex read this as contradicting the mover-only rule. **Disproven as a defect of this change:** the
  line sits outside this diff's hunks (pre-existing), and in context it governs the *free* statuses
  (`In progress` / `Blocked`), which are hand-set by design. Not a regression; not this task's scope.
- ~~**`fkit-task-done/SKILL.md:60-64`** cited from 4 ship-loop sites — **still accurate** after the
  diff (the marker table + the "if you are unsure, you are an agent" rule). See R3.~~
  🛑 **WITHDRAWN — THIS DISPROOF WAS WRONG.** See the correction notice immediately below. The 4 sites
  were stale and are now fixed to `:78-82`. **Do not restore this entry.**

### ⚠️ R3 correction notice — a reviewer disproof that was refuted (round 1)

Recorded at the driver's instruction and at this reviewer's own assessment, because **the reusable
value here is the failure mode, not the line numbers.**

**What happened.** I recorded `fkit-task-done/SKILL.md:60-64` as "still ACCURATE — do not fix them",
against Codex, which had flagged it. The coder **escalated instead of complying**; the driver
re-verified against `git show HEAD:…`; the owner ruled all sites be fixed. **The coder and Codex were
right and I was wrong.**

**The fact.** At `HEAD`, `:60-64` held the **owner-verification-upgrade rule**. This diff moved that
text to `:78-82`. All four citing sites name `:60-64` *specifically for that rule*. The range no
longer contains it.

**Why the check passed anyway — the failure mode.** I asked *"is there sensible, on-topic content at
`:60-64`?"* — and there was: the marker table plus *"if you are unsure, you are an agent."* I never
asked the question that mattered: *"does `:60-64` still support the specific claim it is cited
for?"* — it does not. The marker table governs which marker to write on a **fresh** close; the
upgrade rule governs the owner **clearing an existing** agent-closed qualifier. Adjacent topics,
different rules.

⚠️ **Thematic adjacency at a shifted range is the EXPECTED signature of citation drift, not evidence
against it.** Documents are topically clustered, so a range displaced by a few dozen lines usually
still lands on related prose. That is exactly what makes this a **false negative** rather than an
obvious miss — and exactly why my parenthetical describing what I found there reads as plausible.
**Verify a citation against the claim, never against the plausibility of the content.**

⚠️ **The second-order lesson, and the more important one for a reviewer: a "disproven" is a STOP
instruction, so a wrong disproof is more damaging than a missed finding.** A missed finding stays
open — the next round, or the other reviewer, can still catch it. A wrongly-disproven finding is
recorded as *"do not fix this"*, which converts a correctable omission into an **entrenched** one and
actively spends the other reviewer's correct work. Here it would have cemented 4 stale citations and
overruled Codex, which had it right. **Disproofs therefore deserve a HIGHER evidentiary bar than
findings, not a lower one.** I applied a lower one because disproving felt like the conservative,
noise-reducing act. It is not — it is the load-bearing one. The rule that follows: **never disprove a
line-number claim without diffing the cited range across the change** (`git show HEAD:<file>` vs the
working tree), which is the check I skipped and which settles it in one command.

**What saved it:** the coder escalated rather than absorbed. That is the behavior the review contract
asks for — *"review comments are inputs to evaluate, not instructions to apply blindly"* — working in
the direction people plan for less: **against the reviewer.**

**An 8th site then surfaced** that neither reviewer counted: a **bare** `` `:265-267` `` at
`fkit-task-ship-loop/SKILL.md:189`, with no filename prefix. My inventory grep was anchored on
`fkit-task-done/SKILL.md:`, so it counted 3 where there were 4. Third distinct blind-spot class on
this task — **shorthand** — after **path** (R1) and **phrasing** (R2). See the *Accepted residuals*
entry on citation audits.
- **`claude/skills/fkit-task-ship-loop/SKILL.md:51`** — the single hit from verification step 9's
  self-close grep. The coder judged it benign; **that judgment is confirmed correct.** It reads
  *"ADR-033 §3 (which turned the coder's self-close into a producer route)"* — a description of the
  reversal, not an assertion of a surviving self-close.

### Verified clean (checked, nothing found)

- **`claude/skills-for-role.sh`** — `producer` keeps both movers; `lead, coder, architect, reviewer,
  wiki` all dropped; `adversarial-reviewer` untouched. `.claude/skills-for-role.sh` is
  **byte-identical**. The `:12-24` mirror checklist is **satisfied** — all four mirrors updated.
- **Hook test** — `assertDeny` (`test/skill-ownership-hook.test.js:47-61`) genuinely pins the JSON
  deny shape: exit 0, parseable stdout, `hookSpecificOutput` present, `hookEventName==="PreToolUse"`,
  `permissionDecision==="deny"`. All **10** new denies (5 roles × 2 movers) go through it, each adding
  `assert.match(r.err, /does not own skill '<mover>'/)`. Adversarial reviewer still denied; the
  exhaustive `OWNED` matrix independently re-covers every pair. No assertion weaker than it looks.
- **`.claude/` refresh** — every `claude/agents/*.md` and `claude/skills/*/` file is byte-identical to
  its canonical source. Regeneration ran completely; no partial-refresh drift.
- **Dual-home divergence** — the live/scaffold vocabulary pair diverges only intentionally (live
  carries ADR links and fkit-dogfooding framing; scaffold carries consumer-facing "your team"
  framing). **No new *kind* of drift.** Caveat: both copies carry R2 identically — the divergence is
  clean, the shared content is wrong.
- **Rules-block budget** — independently recomputed by running `emit_block()` against the working
  tree and against a stashed `HEAD`: **3717 B** new, **3733 B** old, **−16 B**. 3717/4096 =
  **90.75%** (the coder's 90.74% is the truncation of 90.747%; immaterial). Wording matches the
  approved text verbatim: `**Only the producer may invoke them**;`.
- **Over-claiming** — **none, in either direction.** The prose is unusually well calibrated to
  ADR-033 §The limit: `skills-for-role.sh:34-37`, `fkit-task-done/SKILL.md:43-52`, the test-file
  header, `task-status-vocabulary.md` ("Role-gating is not prevention"), and `architecture.md:306-310`
  each state the identity/prevention distinction explicitly. Codex independently found nothing here.
- **Agent-closed marker (ADR-033 §5)** — **survives everywhere, and is strengthened.** Both movers'
  marker tables now name *"A **producer spawned** to close"*; both banners state *"A producer that was
  SPAWNED to close is an agent"*; `skills-for-role.sh:29`, `fkit-lead.md:56-58`, `fkit-coder.md:194-201`
  and `fkit-producer.md:71-76` all carry it. The reframe from *"whenever you are not the owner"* to
  *"whenever the owner is not present"* closes a real loophole a spawned producer could have read
  itself out of.
- **Sanctioned-hand-off carve-out (step 8)** — present in **both** `claude/agents/fkit-coder.md:169-172`
  and `claude/agents/fkit-producer.md:71-76`; the underlying rule is retained, not deleted, and each
  exception is explicitly scoped to that act only.
- **Step 9 (`fkit-lead.md`)** — the `/fkit-sprint-ship-loop` bullet now reads *"It closes nothing
  itself … it spawns `@fkit-producer` per shipped task and **that producer** writes the marker"*.
  Degraded-run stop, never-self-cancels and session-only all retained.
- **No mover grant survives for any non-producer role** — both roster tables (`claude/README.md:47-53`,
  `claude/skills/fkit-team/SKILL.md:49-57`) list the movers under `producer` only.
- **`test/dual-home-parity.test.js`** — confirmed **does not exist** and was **not** built (no
  untracked files in the tree). Correct: that is tasks 0132/0133.
- **`ai-agents/README.md`** + scaffold twin, `tasks/README.md`, `sprints/README.md` — role-agnostic on
  the movers; no stale grant.

## Coder response

<!-- CODER-OWNED. The reviewer never writes this section. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (regression of omission — the file was never updated) | Rewrote `PROJECT.md:100-103` to producer-only + hook-structural, and replaced *"nothing structural replaced it"* with ADR-033 §The limit's identity-not-prevention framing. Verified `PROJECT.md` has no other mover/ADR-025 claim; the scaffold twin carries none. | **Fixed** |
| R2 | **CORRECT** | Defect (self-contradiction introduced by this diff's own prose rewrite) | `Any agent, via /fkit-task-<mover>` → `A **spawned producer**, via …` in the "Set by" column, rows 18 and 20, in **both** copies. Confirmed the column is a permission column (siblings read `Producer`, `Owner, via …`, `Anyone — freely`). Intentional live/scaffold divergence preserved — the edit is byte-identical in both, which is correct here: this row was already shared, not divergent. | **Fixed** |
| R3 | **CORRECT on the 3 cited sites — and the reviewer's disproof of the other half was REFUTED** | Defect (citation regression newly introduced by this diff) | **Escalated, then fixed on the owner's ruling — 7 sites.** ⚠️ **The reviewer's "disproven" entry for `fkit-task-done/SKILL.md:60-64` was wrong, and the record should show that.** At `HEAD` those lines held the **owner-verification-upgrade rule**; this diff moved it to `:78-82`, and all four citing sites cite it *for that rule by name*. The reviewer checked *"is there sensible content at `:60-64`?"* (yes — the marker table) rather than *"does `:60-64` still support the claim it is cited for?"* (no). I escalated rather than absorbing it; the driver independently re-verified against `git show HEAD:…` and the **owner ruled all 7 sites be fixed**. Applied: 4 × `:60-64` → `:78-82` (`sprint:179`, `:223`, `task:115`, `:188`); 3 × `:265-267` → `:283-286` (`sprint:180`, `:223`, `task:115`). **Two numbers in the hand-off were themselves wrong and I re-derived both**: the target is `:283-286`, **not** `:283-285` — the paragraph runs four lines and `:283-285` would cut it mid-sentence, severing *"The old **owner**-only"* from *"gate is still gone"*. An **8th** occurrence (a bare `` `:265-267` `` at `task-ship-loop:189`) was found, escalated, and fixed under a second owner ruling — see below. **All 8 citations now resolve to the text they claim.** | **Fixed (8 sites)** |
| R4 | **CORRECT** | Defect (leftover residue of the same class as R2) | `(any agent)` → `(a **spawned producer**)` at `fkit-task-cancelled/SKILL.md:335`. Confirmed `fkit-task-done/SKILL.md`'s equivalent gloss was already clean, as the reviewer noted. | **Fixed** |

**⚠️ R3 was 7 of 8 — the EIGHTH occurrence was escalated, then fixed on the owner's ruling. All 8 done.**
`claude/skills/fkit-task-ship-loop/SKILL.md:189` carried a **bare** `` `:265-267` `` (no
`fkit-task-done/SKILL.md` prefix), so the reviewer's inventory grep — anchored on that filename —
counted three rather than four. It sat in the **same sentence pair** as `:188`, which the owner had
approved, so a partial fix would have left line 188 reading `:78-82` beside line 189 reading
`:265-267`. Escalated rather than absorbed, because the approval enumerated exactly seven sites and
**the count itself was the thing that was wrong**; the owner then ruled it be fixed, and the driver
independently re-verified that it was the last stale citation. Now `` `:283-286` ``.

**Root cause, recorded because it is the most reusable lesson on this task: a filename-anchored
citation grep misses a bare `:NNN` shorthand.** An inventory built from
`grep -rn "<file>/SKILL.md:[0-9]"` cannot see a cross-reference written as `` (`:265-267`) `` in a
sentence whose *previous* clause already named the file. Any future citation audit must sweep for the
**bare line-range token** as well as the qualified one.

**This task hit three distinct blind-spot classes, in one round of one review** — worth reading
together, because each defeated a different assumption:
1. **Path** (R1) — the regex would have matched; the search path never showed it the file.
2. **Phrasing** (R2) — a verbless noun phrase (`Any agent, via …`) a modal+verb regex cannot match.
3. **Shorthand** (R3, 8th site) — a citation whose anchor text was elided, invisible to a
   filename-anchored grep.

That is the **fifth** incomplete inventory recorded on this brief overall, and the second inside R3
alone. The brief's standing finding — *"a grep for one phrasing is not an inventory"* — generalizes:
**no single pattern is an inventory, and each fix has only ever closed the last blind spot.**

**Step 6 amendment (owner-directed, both parts).** The brief's verification step 6 now (a) adds
`ai-agents/knowledge-base/` to the search path — the **R1 path gap**; and (b) adds a `, via `
alternation for verbless noun phrases — the **R2 phrasing gap**. The reviewer's root-cause split is
carried into the wording verbatim, because the two gaps are independent failure modes and a reader
who conflates them will re-open only one. I also corrected an error in my **own** amendment on first
write: the expectation "zero hits in `ai-agents/knowledge-base/`" would have failed permanently, since
`decisions/` and `reports/` are historical by design and legitimately contain the old phrasing. Scoped
it to the **living canon** (`PROJECT.md`, `architecture.md`, `conventions/`) and recorded the two known
benign false positives so a future run does not chase them.

**On the convergence call.** Agreed: act, don't close out. Four novel findings, zero re-litigation of
anything in *Accepted residuals*. No finding here disputes a settled tradeoff; R1/R2/R4 are all the
same root cause as the brief's own standing finding, now in its **fourth** materialization.

## Accepted residuals (shared, do-not-re-litigate)

- **Extra-hop laundering is not closed** — What: a determined doer can still spawn a producer to
  close, which is *"the doer marks its own work done with an extra hop"*. Producer-only restores
  separation of the closing **identity** (hook-enforced), not prevention. Why (structural): the owner
  chose producer-only-strict knowingly over the rejected "no self-close" and "producer + orchestrator"
  options; ADR-033 §The limit names this cost explicitly and instructs against hardening past it.
  Re-raise only if: it demonstrably bites in practice — then the next step is closes only from an
  owner-present session, and the route is to reopen ADR-033, not to patch a mover.
- **The agent-closed marker is invisible in `/fkit-status`** — What: the dashboard collapses
  `✅ Done (agent-closed …)` into a plain `✅ Done` row. Why (structural): ADR-025 §A3, carried forward
  unchanged by ADR-033 §Consequences; recorded and accepted. Re-raise only if: a decision starts
  depending on telling the two apart from the dashboard alone.
- **The `⛔ Owner:` banner is advisory in a spawned consult** — What: skill lockdown is session-scoped
  (ADR-012); in a spawn the boundary is prose. Why (structural): unchanged by this task — the ADR-018
  hook, not the banner, is what makes producer-only structural here. Re-raise only if: the hook itself
  is found bypassable.
- **Verification step 6's grep is a smoke test, never an inventory** *(added round 1, owner-directed;
  from findings R1 + R2)* — What: no single regex enumerates every way a permission fact can be
  phrased. Step 6 has now been amended twice and each amendment closed only the **last** blind spot: a
  **path** gap (R1 — the regex would have matched, the search path excluded the file) and a
  **phrasing** gap (R2 — a verbless noun phrase a modal+verb regex cannot match). Why (structural):
  this is the brief's own standing finding — *"a grep for one phrasing is not an inventory"* — in its
  **fourth** materialization; the failure is inherent to matching prose by pattern, not a bug in any
  particular pattern. A green step 6 is **weak evidence** and must be reported as such. A by-hand
  sweep plus an independent reviewer pass are the real evidence. Re-raise only if: someone proposes
  *relying* on the grep alone, or drops the by-hand sweep because the grep is green.
- **A line-range citation is verified against its CLAIM, never against content plausibility**
  *(added round 1, from finding R3 and the reviewer's refuted disproof)* — What: to check
  `` `<file>:N-M` ``, diff the cited range across the change (`git show HEAD:<file>` vs the working
  tree) and confirm the range still contains **the rule it is named for**. Finding sensible, on-topic
  prose at the range is **not** evidence. Why (structural): docs are topically clustered, so a range
  displaced by a diff usually still lands on related text — thematic adjacency is the *expected
  signature* of citation drift, which makes it a false negative rather than a visible miss. This
  reviewer produced exactly that false negative on `:60-64` and recorded it as "do not fix." Also:
  a citation audit must sweep for the **bare `:N-M` shorthand** as well as the filename-qualified
  form — a filename-anchored grep missed the 8th site. Re-raise only if: someone proposes verifying
  citations by reading the target range alone, without the cross-change diff.
- **A reviewer's "disproven" carries a higher evidentiary bar than a finding**
  *(added round 1, from the R3 correction)* — What: a finding left open can still be caught next
  round or by the other reviewer; a **wrongly disproven** finding is recorded as *"do not fix"*,
  entrenching the defect and spending the other reviewer's correct work. So a disproof requires the
  stronger evidence, not the weaker. Why (structural): disproving *feels* like the conservative,
  noise-reducing act, which is precisely why the bar gets applied backwards — the asymmetry is in the
  consequence, not in the confidence. Corollary, and it is the load-bearing half: **a coder
  escalating against the reviewer is the contract working**, not friction to smooth over; the review
  contract's *"inputs to evaluate, not instructions to apply blindly"* runs in both directions.
  Re-raise only if: a disproof is ever proposed as auto-accepted, or escalation-against-the-reviewer
  is treated as a process failure.
