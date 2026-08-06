# Review — 0167

Task: `ai-agents/tasks/backlog/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/brief.md`
File(s) under review: `ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md` (primary, 716 lines, new) · task folder `plan.md` / `worklog.md` (supporting)
Status: in-review

**Verdict (round 1): ⚠️ Changes requested — 10 defects (none blocking).**
**Reviewers run: BOTH — Claude (own pass) + Codex (`codex-cli 0.145.0`, adversarial second opinion). Coverage is COMPLETE, not degraded.**

**Verdict (round 2): ⚠️ Changes requested — 8 defects (none blocking; 1 touches a RULING).**
**Reviewers run: BOTH — Claude (own pass) + Codex (`codex-cli 0.145.0`). Coverage is COMPLETE, not degraded.**

> ⚠️ **The `716 lines` in the *File(s) under review* line above is STALE and is deliberately NOT
> corrected.** The deliverable is now **1038** lines. The report *cites this ledger header's `716`* as
> its evidence that the file grew after the round-1 review (§1's three-instances table, instance-3
> *On-disk corroboration* cell). Editing it would destroy the evidence it is cited as. Recorded here
> instead.

**Scope note:** report-only task — no code, no ADR, no `claude/skills/` edit. Reviewed as documents.
**No confirmed defect touches the four rulings (Q1–Q4) or the two adjudications.** All ten sit in the
report's *evidence apparatus* — record precision, printed-method validity, and one rule-wording
imprecision that would propagate into follow-up 1's SKILL text.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md:240-243`, `:648-649` | **Conclusion broader than the measurement.** The two greps *printed* are correctly scoped (`claude/`, `ai-agents/knowledge-base/`), but the conclusions — *"`SendMessage` is named in no fkit document"* and *"appears in **zero** fkit documents"* — are false. It appears in `ai-agents/sprints/sprint-2.md:178` and `:393`, and in this task's own `brief.md:43,124`, `plan.md:118`, `worklog.md:50,52,55`. Substantive point (undocumented as a *sanctioned mechanism* in `claude/` + knowledge-base) survives; follow-up 2 stands. Raised by driver as D1; confirmed. |
| R2 | 1 | low | `:241-242` | **A printed result the report itself falsified.** *"the same over `ai-agents/knowledge-base/` → no hits, exit 1"*. Re-run 2026-08-04: **10 hits, exit 0**, every one inside this report — the report was written into the directory it measured. No reader can reproduce the printed result. Structurally self-referential: the fix is to re-scope the command or timestamp it (*"measured before this report was written"*), not to re-run it. Driver's D2; confirmed. |
| R3 | 1 | low | `:673` | **§11 step-6 row's stated argument is false.** It says *"The **one** occurrence of 'once' is a **quotation**"*. Measured: `/usr/bin/grep -ow 'once'` → **8 occurrences** (`:68`, `:180`, `:574`, `:592`, `:612`, `:625`, `:656`, `:673`); only `:574` is the quotation, the rest are ordinary adverbs. **Step 6 still passes on substance** — no retry count/limit/backoff is written anywhere. Driver's D3; confirmed, with the count corrected from 7 to **8**. |
| R4 | 1 | medium | `:68-69` | **NEW (Claude) — same class as R1, inside the section that exists to correct exactly this class.** §0.1 states the sprint loop's *"`## Durable artifacts` section **cites no ADR at all**"*. It cites two: `ADR-029` (`fkit-sprint-ship-loop/SKILL.md` §*Durable artifacts*, the `<task-folder>` definition line) and `ADR-032 A2 / ADR-019` (same section, the `worklog.md` row). The parenthetical that follows shows the intent was **ADR-020 specifically** — so the accurate claim is *"cites no resume-doctrine ADR"*. Substantive point survives; the blanket does not. |
| R5 | 1 | medium | `:497-499` | **NEW (Codex, verified + sharpened) — a printed measurement that cannot test the claim it supports.** The report prints `/usr/bin/grep -rn` for `heartbeat\|lease` over `claude/`. **There is no `-E`**, so under BRE the `\|` is a literal character and the pattern is the literal string `heartbeat\|lease` — an empty result is guaranteed whether or not either word exists. The conclusion then widens to *"exists **anywhere**"* over a `claude/`-only sweep. **The conclusion is independently TRUE** — I re-ran `/usr/bin/grep -rnE '\b(heartbeat\|lease)\b' claude/` → exit 1 — so §6's reading 2 and R6's acceptance survive untouched. Only the printed method fails, and it contradicts the report's own §1 method pledge at `:143-144` (*"every empty result names the command and the paths it covered"*). |
| R6 | 1 | medium | `:214-216`, `:163-164`, `:669` | **NEW (Codex, verified + narrowed) — "verified" asserted over claims no commit can establish.** §2's clause table labels instance 2 death 1 *"**holds, verified**"* for **inspect disk first** and for **defer**. Commit `7616585` was re-checked: it does show `wiki/systems/testing-and-verification.md \| 4 +` (the `+4/−0` claim is **correct**), but it is a 17-file *"Tasks update"* commit and it verifies only **the landed artifact and its coherence** — never that a worker died, that the driver read disk *first*, or why it deferred. Correct statement: **n=1 for the artifact, n=0 for the process.** §11's step-2 row inherits the overclaim. **The ruling survives** — `:247-248` already concedes the classification is *"grounded in reasoning about the cases, not in three observed cases"*. Codex's stronger framing (*"validated on n=0"*) is **partially** correct; the artifact half is genuinely verified. |
| R7 | 1 | medium | `:262-263` vs `:316-317` | **NEW (Codex, verified) — the Q2 headline rule is broader than Ground A supports, and collides with its own ADR-037 narrowing.** The rule reads *"It **never** asks a worker what it already did."* Ground A (`:270-274`) rules out a **memory-based** account — *"the information the driver needs is the information the worker lost."* A resumed worker's **disk-derived** report is a different thing, and `:316-317`'s ADR-037 narrowing **requires** it: *"never a substitute for the worker's own re-derivation where its skill mandates one."* **Blast radius is follow-up 1**: the report instructs that follow-up to carry both the no-self-report rule *and* the ADR-037 narrowing into one new `## Resume doctrine` section (`:642-646`) — copied as worded, that section ships an internal contradiction into a SKILL. The precise form is *"the driver does not rely on a worker's **recollection**; it derives from disk itself"*. |
| R8 | 1 | low | `:200` | **NEW (Codex #2 disproven; the residual gap is real).** Q1 defines nothing-landed as *"the work surface is byte-identical to before the spawn"*. **Codex's stated form is DISPROVEN**: it argued a tracked task can never satisfy this because the driver writes `🔄 In progress` first — but that write happens *at the start of driving the task* (`fkit-sprint-ship-loop/SKILL.md` §2, *"Mark the task `🔄 In progress` first"*), i.e. **before** the spawn, so it is inside the baseline, not outside it. **What does survive**: the ruling never tells the driver to *capture* a per-spawn baseline or to restrict the comparison to worker-owned paths — and the driver writes into the same tree while driving (both status locations at §2; `plan.md` at plan approval, per §*Durable artifacts*' Plan row). A driver that tests *"is this task's tree dirty?"* instead of *"changed since the spawn?"* misroutes an empty attempt into the *anything-landed → `🚧 Blocked`* branch. Follow-up 1's implementer needs this said. |
| R9 | 1 | low | `:11-13`, `:694-695` | **The stated change surface is contradicted by the report's own recorded baseline.** The header reads *"**Change surface of this task:** this file, plus the task folder's `worklog.md`. **Nothing else.**"* and §11 repeats *"The only new paths this task creates are this report and the task folder's `worklog.md`."* The report's own pre-work baseline at `:684` lists `?? plan.md` — a **third** new path created within this task (by the driver at plan approval). The header conflates *this worker's* surface with *the task's*. **Verification step 7 still passes on substance, re-verified 2026-08-04**: `git status --porcelain -- claude/` → **empty**, and no brief was filed. Codex #6 called this *"dishonest"* — I do not adopt that: `:684` discloses the baseline three pages later, so nothing is concealed. It is imprecision, not concealment. |
| R10 | 1 | low | `:122`, `:280`, `:360`, `:471`, `:494-495` | **Emphasis added inside block quotes presented as verbatim, with no "emphasis added" note — four instances, one class.** (a) `:122` bolds **skill** in the `0160` row-1 quote; the source (`reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md`, §1's table row 1) reads *"A source file, test, skill or agent file"* unbolded — and "skill" is the very word the surrounding argument turns on. (b) `:494-495` bolds *"no lease, heartbeat, or stale-task recovery exists"*; unbolded at `0111/review.md:26`. (c) `:360` bolds *"not picked up"*; unbolded at `conventions/task-status-vocabulary.md:14`. (d) `:280`/`:471` flatten the source's markdown link `[ADR-020](../../../ai-agents/knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md)` to plain `(ADR-020)`. Individually trivial; raised as one row because this is a report whose §0.1 is itself an argument about citation precision. |
| R11 | 2 | medium | report §2, state table rows *"A complete unit landed"* / *"A partial unit landed"*; §2's **ADDENDUM**, the *"What this does NOT change"* clause; §2(b)'s torn-FILE/torn-UNIT correction; §10 follow-up 1, constraint **(4)**; §1's standing table, row *"A landing occurred, and was coherent"* | ⚠️ **THE ONLY ROUND-2 FINDING THAT TOUCHES A RULING** (round 1's ten all sat in the evidence apparatus). **The widened "partial unit" now collides with the UNCHANGED "complete unit" definition, and the addendum's claim that the definitions are unchanged is false.** The state table defines **complete** as *"one or more self-contained units are on disk; **nothing is half-written**"* and **partial** as *"a file is half-written; a unit is torn."* Instance 3 satisfies **complete** as literally written — the report was *"internally coherent at every moment"* (§2(b) correction), so nothing was half-written — yet the amendment classifies it **partial** (§1, instance-3 *What is claimed* cell: *"this was a **partial landing**, the branch Q1 routes to the owner"*). The two states are no longer disjoint on the very instance the amendment was written for. The addendum nonetheless states *"**What this does NOT change:** the three states, **their definitions**, and the routing of each"* — **that clause is falsified by the correction seven lines above it.** **Routing consequence, and it is material:** partial → *"Stop and put it to the owner"*; complete → *"the driver itself enumerates … then resumes, re-spawns, or defers"* — i.e. the driver decides alone. **And no test separates the two.** §2(b) rules instance 2's death 1 *"missing work, not half-written work"* on facts the new wording does not exclude — its pieces were **unwritten**, exactly as instance 3's ledger response and worklog section were unwritten. §2's *Limits* bullet that absorbs unit-illegibility still speaks only of *"a torn source file"* and was not extended. **Blast radius is §10 follow-up 1:** constraint (4) instructs the SKILL to *"define 'partial' over the UNIT, not the file"* and supplies **no operational test**, so a SKILL written from it inherits a non-deterministic classification. Same shape as round-1 **R7** (wording that ships a contradiction into a SKILL). **Raised by BOTH** — Codex #1 (sharper on the definition collision), Claude (the missing test + the instance-2 comparison). ⚠️ **Severity: I assign medium, declining Codex's "high"** — the harm materializes only when follow-up 1 writes the SKILL, and round 1 rated the identically-shaped R7 medium. It is nonetheless this round's highest-reach finding |
| R12 | 2 | medium | report §1, *"The evidence standing, restated after instance 3"* table — rows *"A driver misclassified the disk state"*, *"A landing occurred, and was coherent"*, *"A landing was PARTIAL"* vs row *"The driver's PROCESS"*; and §1's three-instances table, instance-3 *Evidential weight* cell | **The per-half standing table promotes testimony to direct evidence, and one of its rows contradicts another row of the same table.** Row *"A driver misclassified the disk state"* is marked **"one instance, directly evidenced"** and called *"the sharpest evidence in this report."* Its source is **driver testimony**: the report's own §1 introduces it *"**Driver-reported**, 2026-08-04, it ran: `/bin/ls -la` … a listing of the ledger's `^## ` headings; `wc -l` … `git status --porcelain`."* The claim decomposes into (a) *a partial landing existed on disk* — genuinely corroborated; (b) *the driver believed "nothing landed"*; (c) *it ran those four probes*. **Only (a) is directly evidenced; (b) and (c) are the driver's own account, and no artifact records either.** The driver's re-spawn does not discriminate — under Q1 a **complete**-unit landing also routes to *"resumes, re-spawns, or defers."* **Direct self-contradiction:** the last row of the same table reads *"**The driver's PROCESS** — that it read disk *before* forming a belief, and why it chose as it did | **zero instances**, unchanged"* — and a misclassification **is** a claim about the driver's process. **Two further rows flatten splits their own source cells draw:** *"A landing occurred, and was coherent — **two instances**"* counts instance 3 without the file-vs-unit qualifier that §2(b)'s own correction says *"has to be"* drawn (and counts the same instance that the row below calls **partial**); *"A landing was PARTIAL — one instance, **corroborated**"* is corroborated for the **landed** half only — §1's own cell concedes the **outstanding** half *"is no longer measurable … it rests on that worker's contemporaneous record."* **This is round-1 R6's class (*"holds, verified"* asserted over unverifiable process claims) recurring in NEW text**, in the amendment's headline artifact. **Raised by BOTH** — Codex #2, Claude. The *cause* and *process* rows are honest and are not part of this finding |
| R13 | 2 | medium | report §1, three-instances table, instance-3 **On-disk corroboration** cell (the sentence beginning *"its **R3** row cites"*) | **Three self-referential coordinates printed into this report as present-tense measurements; all three are now FALSE.** The cell reads *"its **R3** row cites `:673` for §11's step-6 row; **line 673 is now blank** and **that row sits at line 786**, whose text reads *"No retry count, limit, or backoff anywhere"*."* Re-measured 2026-08-04 against the 1038-line file: **line 673 is not blank** — it is the heading `### Is it this task's follow-up, or a broader ADR?` (51 bytes); the **step-6 row sits at line 961**, not 786; and **line 786** reads *"reclaims. **Neither instance produced stranding.** Verified: `0118`'s brief `## Status` reads"* — not the quoted text. **No reader can reproduce any of the three.** ⚠️ **Aggravating, and it is the same amendment:** §11's step-6 row wrote *"**any figure stated is self-referential and stale the moment the cell is edited**"* and deliberately removed its counts for that reason; §2(c) did the same. **That discipline was stated and then not applied here** — in the sentence whose entire purpose is to demonstrate that coordinates decay. **The substantive point survives intact and needs none of them:** the ledger header declares **716 lines** and the file is **1038** — that is the stable property, it is reproducible, and it proves the growth on its own. ⚠️ **Note what this is NOT:** `0160`'s form is *satisfied* — the numbers are paired with a row name and quoted text, never naked. The defect is that they were not re-measured. **Raised by BOTH** — Codex #4, Claude |
| R14 | 2 | low | report §1, *"The instance-3 finding: reading disk is necessary and is NOT sufficient"*, numbered item **2** | **A blanket claim contradicted by the report's own §11 — round-1 R1/R4/R9's class, recurring in new text.** Item 2 ends *"all four are untracked, so **no part of this task's surface carried a git landing signal**."* The four (report, `plan.md`, `worklog.md`, `review.md`) are indeed all `??` — re-verified 2026-08-04. **But `brief.md` is tracked and modified** (` M`), and it is part of this task's surface. §11's own re-measured baseline block gets this right — *"**four of the five** lines are `??`"* — so the report contradicts itself between §1 and §11. **The substantive point survives:** no **worker deliverable** carried a git landing signal, which is what the finding needs |
| R15 | 2 | low | report §3, *Limits*, the **Amended 2026-08-04** bullet, sub-points (1) and (2) | **"The dead worker's account" is used for two different things, and the sub-point that carries the "strengthened" verdict is about the one Q2's rule does not concern.** Sub-point (2) says the account *"could not be reconstructed from the artifact either"* because the deliverable is untracked and *"there is **no git history to attribute the edits to**."* What git history would have supplied is **authorship**; what Q2's rule concerns is **landed-vs-outstanding** — and that **was** successfully reconstructed from disk, as the same bullet then says (*"disk content was the sole remaining evidence"*). So sub-point (2) reads as though the artifact yielded nothing when it in fact yielded exactly what the rule needs. **The "strengthened" verdict survives on sub-point (1) alone** (*"It could not be asked"* → the rule's method was forced, and it worked), and the bullet's closing sentence already concedes the split: *"The enumeration rule protects the driver's belief; it does not validate an unattributed worker's *content*."* **Codex #3, verified and narrowed** — I do not adopt its "contradicts itself" framing; the concession is present, so this is imprecise wording, not a contradiction |
| R16 | 2 | low | report §12, open question **5** | **The stated reason for not ruling is factually too strong, and it forecloses a cheaper option.** Item 5 asks whether a deliverable should be git-tracked before a worker is spawned, then declines: *"**I do not rule on this and deliberately write no rule for it** — it implies a **commit**, and only the owner authorizes commits."* **Tracking does not imply a commit.** `git add` alone makes a path known to git: `git ls-files` lists it, `git status --porcelain` reports `A ` rather than `??`, and subsequent edits show as diffs against the index — which is precisely the landing signal §1 says was missing, obtained **without** any commit. The decision remains the owner's either way, but the reason given rules out a stage-only option the owner might well take. **Codex #6, verified** |
| R17 | 2 | low | report §7, grounds **1**, **2** and **3** | **§7 still enumerates a two-instance evidence base in a three-instance report.** Ground 1: *"**Both instances** are a spawned worker dying while the driver survives"*; ground 2: *"**Neither instance** produced stranding"*; ground 3: *"**Zero stranded tasks resulted from either instance**."* Re-measured: no instance-3 note appears anywhere in §7. **§2(b) and §3's *Limits* both received in-place corrections from this same amendment for the same staleness; §7 received none**, while §1's moves table asserts §7 was *"**checked** rather than assumed."* The check's result was never written where a reader of §7 will see it — and §7 is the section carrying the ADR decision. ⚠️ **Mitigation, stated because it is a fair defence:** §0's amendment blockquote declares the convention *"§1 states per ruling what instance 3 moves and what it does not"*, and §7's claims are **incomplete rather than false** (they are true of the two they name). **A "won't fix (frontier)" on that basis is defensible**; I raise it because the same words were corrected in place two sections earlier |
| R18 | 2 | low | report §11, step-**6** row, the closing *"Re-verified after the instance-3 amendment"* clause | **⚠️ Weakest finding of the round — stated as such.** The clause ends *"…the amendment introduced **no new occurrence**."* That is a claim about a **delta** in an **untracked** file with **no git history**, so **no reader can reproduce it** — the same objection round-1 **R2** raised, in the same cell that argues reproducibility is why *"the property, not the number"* is load-bearing. **The load-bearing claim itself is sound and I re-measured it independently:** `/usr/bin/grep -own 'once'` over the report → **12 occurrences** (`:410`, `:824`, `:842`, `:862`, `:875`, `:944`, and six on `:961`); the **sole** quotation-use is `:824`, §8's `Blocked — hand-off didn't land` row; every other is an ordinary adverb; **none states a retry count, limit, or backoff.** The step passes. Only the unverifiable delta clause is at issue, and dropping it costs the cell nothing |

### Disproven — recorded so the coder is not asked to chase them

- **Codex #3 — *"the report scopes the retry policy the brief forbids, via follow-up 3, then falsely
  passes verification step 6."* DISPROVEN.** The brief explicitly blesses the exact move the report
  made: *"name it as a follow-up for the owner, do not write the number"* (`brief.md:144-145`).
  Follow-up 3 (`:650-652`) names **who decides**, writes no count, no limit and no backoff, and is
  marked *"Named, not answered"*. §2's *"resumes, re-spawns, or defers"* is the brief's own Q1
  vocabulary (`brief.md:116`), not a policy. **§8's reconciliation holds** — I checked all three of its
  scopings against the file: (1) *one role, one step* — confirmed, the exit table's `Blocked — hand-off
  didn't land` row is the only row that re-spawns anything, and §4 *Close posture* carries the same
  one-shot rule for the same close step; (2) *a failed spawn, not a dead worker* — confirmed against
  that row's trigger text; (3) *a verified-empty precondition* (*"folder never moved"*) — confirmed.
  **Verification step 6 passes on substance.** Only its *stated argument* is wrong — that is R3, and R3
  does not disturb the step.
- **Codex #2** — as stated, disproven; see R8 for the narrower point that survives.
- **Codex #7(a)** — the `(ADR-020)` link flattening alone does not warrant its own row; folded into R10.

### Independently re-checked and PASSING — not findings

- **`0160` citation-form compliance: PASSES.** Every `:NNN` into a **living** document is confined to
  §0.1's decay table (`:86-92`), where each row is anchored by a quoted phrase or a named section
  heading in the same row — never naked. Every other `:NNN` in the report points into a **frozen**
  ledger under `ai-agents/tasks/done/` (`0111/review.md` at `:460`, `:490`, `:670`; `0118/review.md` at
  `:163`), which `0160` permits. The report is in fact **stricter** than `0160`'s row 1 requires, and
  surfaces that tension itself at `:114-132`.
- **Brief verification steps, re-derived independently:** 1 ✅ · 2 ✅ *(labels overclaim — R6)* · 3 ✅
  *(`0111/review.md:76-79` and `:26` both re-verified correct)* · 4 ✅ *(R6 residual quote verbatim)* ·
  5 ✅ *(`🚧 Blocked — <reason>` and `🔲 Backlog` both present at `task-status-vocabulary.md:16` and
  `:14`; nothing minted)* · 6 ✅ *(substance — R3 is the argument, not the step)* · 7 ✅ *(`claude/`
  clean; no brief filed — R9 is the prose)* · 8 ✅ *(six follow-ups, each scoped)*.
- **Scope bans held:** no ADR written, no brief filed, no `claude/skills/` edit (`git status --porcelain
  -- claude/` empty), no `ai-agents/wiki-vault/` write, no commit, `0134` not merged (§9 rules them
  explicitly un-unified).
- **Plan pointer:** `git hash-object plan.md` = `ba9a6976cb78964dd5a4d580c9f1711291aa2f19`, `wc -c` =
  `20369` — both match the report's declared values at `:9-10`.
- **§0.1's decay table:** re-measured — heading `:243`, rows `:247-255`, invariant `:257`, §2 marker
  `:112`, worklog rows `:121`/`:124`, *Progress reporting* `:266`, file length **296** lines. All
  correct. All nine exit-table row names present and unchanged, as claimed.

### Re-litigates settled decisions (suppressed)

**None.** This is round 1 on a fresh ledger; there are no prior *Accepted residuals* to dedupe against.
`0111`'s R6 is an owner-ruled accepted residual, but the report **adjudicates** it (§6/§7) rather than
re-raising it, and no finding above re-raises it either — R5 in fact confirms the corrected rationale
that supports it.

### Convergence call

**Act, do not close out.** Ten novel defects, zero re-litigation. Nothing is blocking and nothing
touches a ruling: R1–R6 and R9–R10 are record-precision repairs to the report's evidence apparatus, and
**R7 is the only one with downstream reach** — it should be fixed in the report *or* carried explicitly
into follow-up 1's brief, because the report instructs follow-up 1 to copy that wording into a new
SKILL section that also carries the contradicting ADR-037 narrowing.

**Worth naming, since this report's own §0.1 is an argument about exactly this class:** six of the ten
(R1, R2, R4, R5, R6, R9) are *claims broader than the measurement that supports them* — the same class
`0166` exists to rule on, and the same class the report catches the brief committing. That is a finding
about method, not about this author.

---

## Round 2 — reviewer notes (findings R11–R18 above)

**Verdict: ⚠️ Changes requested — 8 defects (none blocking; R11 is the first to touch a RULING).**
**Reviewers run: BOTH — Claude (own pass) + Codex `codex-cli 0.145.0` (`codex exec --sandbox
read-only`). Coverage COMPLETE, not degraded.** Prompt: `.fkit/tmp/0167-r2-adversarial-prompt.md`;
output: `.fkit/tmp/0167-r2-codex-out.txt`.

**Scope:** the instance-3 amendment delta (716 → 833 → 838 → **1038** lines) and its blast radius.
**All round-1 coordinates were re-derived, never reused** — every `:NNN` in the round-1 rows above is
now wrong (R3's `:673` is the clearest case, and it is also R13).

| Sev | Count | # |
|---|---|---|
| high / critical | **0** | — |
| medium | **3** | R11, R12, R13 |
| low | **5** | R14, R15, R16, R17, R18 |

### Disproven — recorded so the coder is not asked to chase them (round 2)

- **Codex #5 — *"binding constraint (1) does not carry R7's replacement sentence exactly"* (it writes
  *"derives **landed-vs-outstanding** from disk itself"* where R7's row wrote *"derives from disk
  itself"*). DISPROVEN.** Three grounds, each checked: (1) R7's row states *"**The precise form is** …"*
  as the **reviewer's recommendation**, not an exact-bytes mandate; (2) the **owner ruling** was *"carry
  the corrected wording as a binding constraint in follow-up 1's brief"*, which constraint (1) does,
  naming the ruling and its date; (3) the inserted words are the object **§3's own `### Answer` block
  already names** — *"The driver establishes **landed-vs-outstanding** from disk itself"* — so the
  insertion narrows nothing and changes no meaning. **Round 1 recorded R7's application as verified at
  close; this does not reopen it.**

### Independently re-checked and PASSING — not findings (round 2)

- **⛔ THE RETRY-POLICY EXCLUSION HOLDS. Re-measured independently, and this is the round's most
  important negative.** `/usr/bin/grep -own 'once'` over the report → **12 occurrences**; the **sole**
  quotation-use is §8's `Blocked — hand-off didn't land` row; every other is an ordinary adverb.
  `/usr/bin/grep -niE 'backoff|retry|retries|re-spawn|respawn'` over the whole report → **no count, no
  limit, no backoff is written anywhere**, in new text or old. The instance-3 re-spawn is recorded as
  **narrative fact under an explicit ⛔** (§1, *"Instance 3's re-spawn is narrative fact, not a rule …
  No count, no limit, no backoff is written or implied here"*) and is **not a rule in disguise** — it
  prescribes nothing and §8's exclusion is restated over it. **Codex swept independently and concurs.**
- **Constraint (1) in §10 follow-up 1 is INTACT.** It still carries R7's owner-ruled replacement wording
  and its attribution (*"Owner-ruled 2026-08-04 (round-1 review, R7)"*). Only constraint **(4)** was
  added; the block was relabelled **FOUR** with a dated note naming the addition. See the Disproven
  entry above for Codex's contrary reading.
- **Q1's step-1 refinement is a GENUINE refinement, loudly flagged — not a silent amendment.** It adds
  three obligations to **how** step 1 is executed (enumerate the deliverable wherever it lives; `git
  status` is not a landing detector for an untracked path; a structural probe cannot answer a content
  question), is marked owner-ruled and dated, is disclosed in §0's amendment blockquote, and is carried
  forward as constraint (4). It reverses nothing. ⚠️ **The accompanying claim that the state
  *definitions* are unchanged is a separate matter and does NOT pass — that is R11.**
- **The torn-FILE vs torn-UNIT distinction is NOT a rescue of a falsified claim.** §2's state table read
  *"a file is half-written; **a unit is torn**"* **before** the amendment, so the correction restores
  consistency with the ruling's own pre-existing text rather than inventing a distinction at the moment
  §2(b) became false. **What it lacks is an operational test, and that is R11** — the distinction is
  sound in kind and unusable as written.
- **`0160` citation form HOLDS on the new text.** Living documents — this report, the round-1 ledger
  under `backlog/`, both SKILLs — are cited by **section heading and row name**. The one place line
  numbers appear in new text (§1's instance-3 corroboration cell) they are the **subject** of the claim
  and are paired with a row name and quoted text, so the form is satisfied; the numbers being stale is
  R13, a different defect. Frozen `done/` ledgers remain validly line-cited. **Codex checked
  independently and concurs.**
- **Brittle-count discipline held where it was applied.** §11's step-6 row and §2(c) both deliberately
  print **no** count and state the stable property instead; **both properties re-measured and hold**
  (the sole `once` quotation-use at §8; `/usr/bin/grep -rln 'SendMessage' ai-agents/knowledge-base/` →
  this file only). The failure is that the same discipline was **not** applied to §1's coordinates —
  R13.
- **Measurements re-taken 2026-08-04:** `claude/skills/fkit-sprint-ship-loop/SKILL.md` → **296 lines**
  (matches §0.1's decay table and §5's tradeoff paragraph); `git status --porcelain -- claude/` →
  **empty**; `git ls-files --error-unmatch <report>` → *"did not match any file(s) known to git"*,
  exactly as §1 and §2's addendum print; the report, `plan.md`, `worklog.md` and `review.md` are all
  `??` while `brief.md` is ` M` (which is R14). Codex independently re-measured commit `7616585`
  (17 files / 1747 insertions, wiki file at `4 0`) and the SKILL coordinates and found them correct.
- **Q3, Q4 and §6 are unchanged and genuinely unaffected** — re-read in full; instance 3 bears on none.
  **§7 is unaffected in substance**; R17 is its enumeration wording only.
- **§0's four-line summary still matches §§2–5** after the amendment, and its blockquote discloses the
  refinement. Codex concurs.
- **Scope bans held:** no ADR written, no brief filed, no `claude/skills/` edit, no
  `ai-agents/wiki-vault/` write, no commit, `0134` still un-unified.

### Re-litigates settled decisions (suppressed) — round 2

**None.** Both reviewers were primed with the **R10** accepted residual and **neither re-raised it.** I
also checked its re-raise condition directly: the new text's quotations — the ledger header
*"(primary, 716 lines, new)"*, the SKILL row names, the `git status` blocks — **alter no source's
WORDS**, only typography. **The condition is not met and R10 stays settled.** No round-1 finding is
re-raised by any of R11–R18.

### Convergence call — round 2

**ACT, do not close out.** Eight novel findings, **zero** re-litigation. **R11 must be acted on before
follow-up 1's brief is written** — it is the first finding in two rounds to touch a *ruling* rather than
the evidence apparatus, and constraint (4) hands its unresolved ambiguity straight into a SKILL. R12 and
R13 are record-precision repairs to the amendment's headline evidence. R14–R18 are minor; R17 and R18
are defensible *"won't fix (frontier)"* calls and I say so in their rows.

⚠️ **Convergence signal worth naming loudly, because it is now a pattern and not an incident.** Round 1
found six instances of *a claim broader than the measurement that supports it*. **Four of round 2's
eight (R13, R14, R17, R18) are the same class, in text written to repair that class**, across a fourth
write episode. Point-repair is not eliminating it: the report keeps printing measurements taken
**against itself** while it is still growing, so each repair mints the next defect. **Recommendation:
treat the class structurally rather than row-by-row** — a standing rule for this report that no
coordinate, count, or delta measured against this file is printed, only the stable property — and
consider recording that as an accepted residual so round 3 is not another sweep of the same class. That
is the owner's call, and it is listed as question 3 below.

## Coder response

> ⚠️ **READ FIRST — provenance of the round-1 fixes. I did not author them.**
> When this Process-review worker began, the deliverable **already carried corrections for R1 and
> R3–R10 and all three owner dispositions**, and none of it was recorded here or in `worklog.md`.
> Measured at start: report **833 lines, mtime 12:10**; this ledger written **11:35** against a
> **716-line** version; `worklog.md` **200 lines, unchanged**. The report is untracked (`??`), so
> there is **no git history to attribute the edits to** — the author is **unestablished, and I could
> not establish it.**
> **This is a landed-work / unlanded-hand-off state — the exact shape this task rules on.** Treating
> it under the report's own Q1: **a complete unit landed** (the report edits) with the hand-off
> missing (ledger + worklog). I therefore **enumerated landed-vs-outstanding from disk and verified
> every correction firsthand against its source** rather than trusting it. Two of the landed
> corrections were **defective**; both are repaired below (R2, R3) and both were **introduced by the
> unrecorded round**, not by the reviewer.
> **Every ✅ below means *I re-measured it*, not *I found it claimed*.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (record precision) | Correction block at §2(c) narrows the conclusion to *"no **governing** document"* and names `sprint-2.md` + this task's own `brief`/`plan`/`worklog` as records **of the gap**, not documentation of the mechanism. §10 follow-up 2 carries the same correction. **Landed before I began; verified, not authored, by me.** Re-measured 2026-08-04: `/usr/bin/grep -rn 'SendMessage' claude/` → exit 1; `/usr/bin/grep -rln 'SendMessage' ai-agents/sprints/ <task-folder>/` → `sprint-2.md`, `brief.md`, `plan.md`, `worklog.md`, `review.md`. Substantive point and follow-up 2 stand | **Fixed (verified)** |
| R2 | **CORRECT** | Defect (unreproducible printed result) | **Owner-ruled 2026-08-04: timestamp the command, preserve the evidence, do not delete or re-scope.** The landed text did timestamp it — **but printed a live self-referential count** (*"names `SendMessage` ten times … returns 10 hits"*) that **I measured as already false: 15 occurrences, 14 matching lines.** **I repaired it**: the count is now **removed on purpose** and replaced by the stable property — *every hit is inside this file; no other knowledge-base file matches* — re-verified after my edit (`/usr/bin/grep -rln 'SendMessage' ai-agents/knowledge-base/` → this file only). Command and timestamp preserved as the owner ruled | **Fixed — owner disposition applied; landed text re-corrected by me** |
| R3 | **CORRECT** | Defect (false stated argument) | Step-6 row's *"the **one** occurrence of 'once'"* was false. The landed correction substituted **"eight"** — **also false by the time it was written: I measured 11**, five of them inside the correction sentence itself. **Any number here is self-invalidating.** **I repaired it**: no count is printed, and the claim is now the stable property — **exactly one occurrence (§8) is the quotation of the `Blocked — hand-off didn't land` row; every other is an ordinary adverb; none states a retry count, limit, or backoff.** Re-verified after my edit: `/usr/bin/grep -own 'once'` → 11 hits, `:660` is the quotation, remainder adverbs. **Step 6 passes on substance throughout** | **Fixed — landed text re-corrected by me** |
| R4 | **CORRECT** | Defect (over-broad claim, in the section that exists to catch that class) | §0.1 correction block narrows *"cites no ADR at all"* → *"cites no **resume-doctrine** ADR; it never cites ADR-020."* **Verified firsthand:** `## Durable artifacts` at `SKILL.md:72` cites **ADR-029** (`<task-folder>` line) and **ADR-032 A2 / ADR-019** (worklog row); `/usr/bin/grep -n 'ADR-020' claude/skills/fkit-sprint-ship-loop/SKILL.md` → **one hit, `:120`**, in §2's drive-table **Plan** row — not a resume doctrine. Q4 is answered against the narrowed claim. **Landed before I began; verified, not authored** | **Fixed (verified)** |
| R5 | **CORRECT** | Defect (printed method cannot test its claim) | Printed sweep now `/usr/bin/grep -rnE '\b(heartbeat\|lease)\b' claude/`, with a correction block explaining the BRE/ERE trap. **Verified firsthand on this host** (`BSD grep, GNU compatible 2.6.0-FreeBSD`): corrected command → **exit 1**; trap 1 — `/usr/bin/grep -c 'heartbeat\|lease'` against a file containing only `heartbeat` → **1** (so `\|` *is* BRE alternation); trap 2 — `-E '\b(heartbeat\|lease)\b'` → **exit 1 for the wrong reason**. Both traps as the report states. **§6 reading 2 and R6's acceptance are untouched.** **Landed before I began; verified, not authored** | **Fixed (verified)** |
| R6 | **CORRECT** | Defect (asserted "verified" over unverifiable claims) | §2 clause table's instance-2 *inspect disk first* / *defer* cells no longer read *"holds, verified"*; a correction block states the split **n=1 for the artifact, n=0 for the process**, and §11 step 2 inherits it. **Verified firsthand:** `git show --numstat 7616585` → **17 files, 1747 insertions**, of which `ai-agents/wiki-vault/wiki/systems/testing-and-verification.md` is **`4 0`** — the `+4/−0` claim is correct and the commit-level figure was the wrong one. **The ruling survives**; §2 *Limits* already conceded the grounding | **Fixed (verified)** |
| R7 | **CORRECT** | Defect (rule wording broader than its ground; contradicts its own ADR-037 narrowing) | **Owner-ruled 2026-08-04: do NOT edit the report's Q2 headline** — the report stays a record of its ruling — **carry the corrected wording as a binding constraint in follow-up 1's brief.** Verified applied as ruled: **§3's `### Answer` block-quote headline is unchanged** (*"It never asks a worker what it already did."*), and §10 follow-up 1 now carries **⛔ THREE BINDING CONSTRAINTS**, the first quoting the operative replacement wording verbatim (*"does not rely on a worker's **recollection** … never a substitute for the worker's own re-derivation"*) and naming the owner ruling. **⛔ No brief was filed by me** — this task files none; the producer who files it cannot miss the constraint. **Landed before I began; verified, not authored** | **Fixed as owner-ruled (verified)** |
| R8 | **CORRECT** | Defect (residual gap; Codex's stated form disproven) | §2 *Limits* now carries the baseline gap: the ruling never says *against what* "byte-identical" is measured, nor restricts comparison to worker-owned paths; §10 constraint (2) hands the fix to follow-up 1 (capture the comparison point **at spawn time**, diff worker-owned paths). **Verified firsthand:** `SKILL.md:112` — *"Mark the task `🔄 In progress` first."* — is **before** the Build spawn, so Codex's "can never be byte-identical" form is **disproven** and the report records it as such. **Landed before I began; verified, not authored** | **Fixed (verified)** |
| R9 | **CORRECT** | Defect (stated change surface contradicted by the report's own baseline) | Header now states the surface **at two scopes** — this worker (report + `worklog.md`) vs the task (plus the **driver**-written `plan.md`) — and §11 carries the matching correction. **Verified firsthand:** `git status --porcelain -- claude/` → **empty**; no brief filed; `plan.md` present in the recorded baseline as `?? plan.md`. **Verification step 7 passes on substance.** I **do not adopt** Codex's *"dishonest"* framing either — the baseline disclosed it. **Landed before I began; verified, not authored** | **Fixed (verified)** |
| R10 | **CORRECT** | **Frontier-move (typography/citation precision) — ACCEPTED AS RESIDUAL** | **Not owner-ruled; the reviewer recommended accept-with-a-note and I agree — this is my call, recorded as such.** I checked **all four sources firsthand before agreeing**, because altered *words* inside a "verbatim" quote would be a correctness problem, not a style one: (a) `0160`'s §1 table, **row 1** — *"A source file, test, skill or agent file"* — has *"skill"* **unbolded**; (b) `0111/review.md:26` (frozen under `done/`, line-cite permitted) reads *"no lease, heartbeat, or stale-task recovery exists"* **unbolded**; (c) `conventions/task-status-vocabulary.md`'s **Backlog** row reads *"not picked up"* **unbolded**; (d) the ADR-020 markdown link is flattened to plain text. **In all four the quoted words are unaltered — only bolding/link form differs.** Remedy present at §1 (*"read every quoted **bold** as emphasis added unless stated otherwise"*), which is the reviewer's recommended note. ⚠️ **Sequencing flag:** the report's §1 already asserted this was *"accepted as a residual"* **before any acceptance was recorded**; recording it here is what makes that sentence true | **Accepted as residual (my call, not the owner's)** |

### Not adopted, and why

- **Codex #3** (retry exclusion breached) — **DISPROVEN**, as the reviewer records. Re-checked: `brief.md:144-145` blesses naming the follow-up without writing the number; §10 follow-up 3 writes **no count, no limit, no backoff** and is marked *"Named, not answered"*. **No speculative change made.**
- **Codex #6's *"dishonest"* framing of R9** — **not adopted.** The report's own recorded baseline discloses `?? plan.md`. Imprecision, not concealment.
- **An ADR for §7** — **owner-ruled 2026-08-04: NO ADR.** The owner read the corrected rationale as R6's acceptance **surviving**, not weakening. §7 stands as written and **no ADR was written.**

### Round 2 — Coder response (R11–R18)

> **Provenance, stated up front because round 1's was not.** This round was worked by a Process-review
> worker spawned by `fkit-sprint-ship-loop` under a declared-approval marker: the owner approved the plan
> and, separately, **all four dispositions applied below**, live in the driver session, 2026-08-04. Plan
> pointer re-verified before any edit: `git hash-object plan.md` = `ba9a6976cb78964dd5a4d580c9f1711291aa2f19`,
> `wc -c` = `20369` — both match. **R14, R15 and R16 were NOT owner-dispositioned**; I verified each
> against the artifacts and applied them under the ADR-019 standing-approval discipline, logged in
> `worklog.md`. **Every ✅ below means I re-measured it after my own edit**, not that I found it claimed.
> ⛔ **No commit, no push, no ADR, no brief, no `claude/skills/` edit, no vault write** — verified below.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R11 | **CORRECT** | Defect (state definitions not disjoint; non-deterministic rule handed to a SKILL) | **Owner-ruled 2026-08-04: do BOTH.** Verified the collision firsthand before acting — §2's `complete` row read *"nothing is half-written"* and instance 3 left **no** half-written file, so it satisfied *complete* as worded while §1 routes it *partial*; the branches route differently (complete → driver decides alone; partial → stop and ask the owner). **(a)** `complete` narrowed by **one clause** — *"and nothing on disk depends on a path that is missing — the remainder is separable"* — making the three states disjoint at unit level. **(b)** §10 follow-up 1 constraint (4) gains an **⛔ OPERATIONAL TEST** written as a decision procedure over the paths the spawn instruction named, with the discriminating question (*is the landed part usable with the missing paths never arriving?*) and **both worked examples** — instance 2 death 1 → **complete**, instance 3 → **partial**. **The addendum's false clause is repaired**: it claimed *"the three states, **their definitions**, and the routing"* were unchanged; it now states the routing and **every instance's outcome** are unchanged and that **one definition is narrowed**. ⚠️ **Disambiguation only — no ruling outcome moves**, re-checked per instance | **✅ done** |
| R12 | **CORRECT** | Defect (testimony graded as direct evidence; row contradicted another row of the same table) | **Owner-ruled 2026-08-04: downgrade, split the row.** The *"A driver misclassified the disk state"* row is now **two rows** — the **LANDING half** (*a partial landing was on disk when the driver formed its belief*) graded **corroborated on disk**, and the **BELIEF half** (*that the driver concluded "nothing landed", and which probes it ran*) graded **DRIVER-REPORTED testimony**, noting that the re-spawn does not discriminate because a *complete*-unit landing routes to the same action. **No row is left graded *"directly evidenced"*** — re-read the table after the edit to confirm. The instance-3 *Evidential weight* cell carried the same *"Directly evidenced"* label and was split to match (**obvious winner**: leaving it would have re-created the finding two rows away). **Two further flattened splits R12 names, both verified and both fixed with a qualifier each:** the *"landing occurred, and was coherent — two instances"* row now says **at FILE level** and marks instance 3 *file-coherent, UNIT torn*; the *"A landing was PARTIAL"* row now says **corroborated for the LANDED half only**, with the outstanding half marked no-longer-measurable | **✅ done** |
| R13 | **CORRECT** | Defect (three self-referential coordinates, all false) | **Verified all three firsthand against the current file — all three false**, exactly as the reviewer states. **Owner-ruled 2026-08-04: a STANDING RULE, not a row-by-row repair** — no coordinate, count or delta measured against this report is ever printed; stable properties only. Recorded as an accepted residual below and **applied**: the instance-3 *On-disk corroboration* cell now names the R3 row and the fact that its coordinate lands on an unrelated heading, **printing no number of its own**, and states the stable property — *the ledger declares a length its subject has outgrown, and its coordinates miss*. The quoted *"(primary, **716 lines**, new)"* is **kept**: it is a quotation of another document, not a measurement of this one, and it is the evidence. **Swept the whole report for the class** (`/usr/bin/grep -noE 'line [0-9]+\|:[0-9]{2,4}\|[0-9]+ lines\|[0-9]+ hits\|[0-9]+ occurrences'`): every surviving coordinate points at **another** file — §0.1's decay table and §5 into `fkit-sprint-ship-loop/SKILL.md`, `0111`/`0118` ledgers frozen under `done/` | **✅ done** |
| R14 | **CORRECT** | Defect (blanket claim contradicted by the report's own §11) | **Not owner-dispositioned; verified and applied by me.** Re-measured 2026-08-04: `git ls-files <task-folder>` returns **`brief.md` only**; `git status --porcelain` shows `brief.md` ` M` and the report, `plan.md`, `worklog.md`, `review.md` all `??`. So *"no part of this task's surface carried a git landing signal"* is false and §11's *"four of the five"* is right. §1 item 2 now reads **"no worker deliverable in this task carried a git landing signal"**, names `brief.md` as the one tracked path, and cites §11's baseline. **The substantive point is unchanged** — the finding only ever needed the deliverables | **✅ done** |
| R15 | **PARTIALLY CORRECT** | Defect (imprecise wording, narrow) | **Not owner-dispositioned; verified and applied by me. I adopt the reviewer's narrowing and NOT Codex's *"contradicts itself"* framing** — the bullet's closing sentence already concedes the split (*"protects the driver's belief; it does not validate an unattributed worker's content"*), so the defect is wording, not contradiction. Sub-point (2) is now headed **"Its AUTHORSHIP could not be reconstructed"** and carries one clause stating which half it is about: the missing history withholds **attribution**; **landed-vs-outstanding — what Q2's rule concerns — WAS derived from disk**, and the *"strengthened"* verdict rests on sub-point **(1)** alone. **No verdict in §3 changes** | **✅ done** |
| R16 | **CORRECT** | Defect (stated reason factually false; forecloses a cheaper option) | **Not owner-dispositioned; verified and applied by me.** Verified the claim in a **scratch repository with no commits at all** (`git init`, `git add`): `git status --porcelain` → `A `, `git ls-files` → the path, `git log` → *"does not have any commits yet"*. **Tracking does not imply a commit** — the stated reason was false. §12 question 5 keeps its **"I do not rule on this"** posture (ruling here is not mine to take) and gains a correction block: the stage-only option exists, produces exactly the landing signal §1 says was missing, and the decision stays the owner's — *"but it must not be declined on a false premise."* | **✅ done** |
| R17 | **CORRECT** | Defect (stale enumeration in the section carrying the ADR decision) | **Owner-ruled 2026-08-04: FIX.** §7 grounds 1–3 now enumerate **three** instances — *"All three instances"*, *"**No** instance produced stranding"*, *"Zero stranded tasks resulted from **any of the three**"* — with instance 3's facts written in (driver survived, misread disk, re-spawned; `0167` stayed in flight, no exit row fired, no status written) and an update note saying the check §1 claimed was made is now visible where a §7 reader will see it. **No ground changes and the ruling is untouched** — verified each of the four still holds for instance 3 | **✅ done** |
| R18 | **CORRECT on the facts** | **Frontier-move — WON'T FIX** | **Owner-ruled 2026-08-04: WON'T FIX, closed under the standing rule** recorded below; the reason is recorded here as ruled. The clause *"the amendment introduced no new occurrence"* **is** an unverifiable delta over an untracked file — the reviewer is right on the facts, and it re-verified the **load-bearing** claim independently (sole quotation-use in §8; every other occurrence an adverb; no count, limit or backoff anywhere). The class is now governed **prospectively** by the standing rule instead of chased row by row. ⚠️ **Tension recorded, not resolved silently:** disposition 3 says *strip any self-referential delta*, disposition 4 says *R18 won't fix*. **The specific ruling governs and I left the clause untouched** — I did not re-open either. **Anyone re-reading §11's step-6 row should know that one clause survives the rule that would otherwise have removed it** | **won't fix (frontier)** |

**Convergence call — round 2, mine.** **Act, and this round converges.** Zero re-litigation, confirmed
independently: I checked each of R11–R18 against the round-1 *Coder response* rows and the R10 residual —
none re-raises a settled disposition, and R13/R18 are the *same class* as R2/R3 appearing in **new** text,
not the same findings returning. ⚠️ **The reviewer's structural read is right and I endorse it:** four
rounds of point-repair did not eliminate the *claim-broader-than-its-measurement* class because the report
keeps measuring itself while still growing — **each repair minted the next defect.** The standing rule is
the first fix that addresses the generator rather than an instance, which is why I record it as a residual
rather than a row.

#### Not adopted, and why — round 2

- **Codex #5** (*constraint (1) does not carry R7's replacement sentence exactly*) — **DISPROVEN**, as the
  reviewer records. **Re-checked independently before accepting the disproof:** constraint (1) is intact,
  still quotes the replacement wording and still names *"Owner-ruled 2026-08-04 (round-1 review, R7)"*.
  ⛔ **Bound obeyed: §10 constraint (1) was not touched.**
- **Codex's "high" severity on R11** — **not adopted**, following the reviewer's own assignment of
  **medium**. Severity is mine to assign: the harm materializes only when follow-up 1 writes the SKILL,
  and round 1 rated the identically-shaped R7 medium. **It is nonetheless the round's highest-reach
  finding and was fixed first.**
- **A retry rule, in any form** — **none written.** Re-swept after my edits:
  `/usr/bin/grep -niE 'backoff|retry|retries|re-spawn|respawn'` over the report → **no count, no limit, no
  backoff**, in new text or old. My constraint-(4) test prescribes a **classification**, never a number of
  attempts; instance 3's re-spawn remains narrative fact under its ⛔.
- **The `200-line worklog` figure** in the instance-3 corroboration cell — **left as written, and flagged
  rather than silently kept.** It is a *historical* state of **another** file, already marked *"no longer
  measurable"* in the same sentence, so it is outside the standing rule's *"measured against this file"*
  scope. **A future editor may reasonably convert it; I did not, because minimal is correct here.**

## Accepted residuals (shared, do-not-re-litigate)

- ⛔ **STANDING RULE for this report — no self-measurement is ever printed.** *Disposition:* **accepted as
  a residual, 2026-08-04 — OWNER-RULED**, in response to round-2 **R13** and **R18**, and it **closes both
  and their whole class**. *What:* **no coordinate, count, or delta measured against
  `reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md` is printed in it — stable properties
  only.** Quotations of *other* documents' figures (the ledger header's *"716 lines"*, a commit's numstat,
  another file's length) are **not** covered: they are quotations, not self-measurements. *Why
  (structural):* the report is filed inside the directory it measures and kept growing while being
  reviewed, so **every figure it prints about itself is stale the moment the next edit lands** — round 1's
  R2 and R3 were this, and their repairs minted R13 and R18 in the replacement text. Four rounds of
  point-repair did not eliminate the class; rejected alternative — **another row-by-row sweep**, which
  round 2 demonstrated only mints the next instance. *Re-raise only if:* a printed **property** (not a
  number) is found **false** — that is a correctness defect and this residual does not cover it.
- 📌 **Driver process breach, instance 3 — recorded plainly so it is findable, not defended.**
  *Disposition:* **owner-ruled 2026-08-04 that this be recorded here.** Not a tradeoff and not a defect in
  the deliverable — a record of **how the driver mishandled the worker death this task exists to rule on.**
  *What happened:*
  - The driver **classified a *partial* landing as *"nothing landed"*** and **re-spawned instead of
    stopping for the owner** — the branch its own Q1 routes to the owner.
  - Its disk check **enumerated the task folder but never measured the deliverable**, which lives in
    `ai-agents/knowledge-base/reports/`.
  - The deliverable is **untracked**, so `git status` printed `??` **before and after** the landing and
    **carried no signal** at all.
  - A re-spawned worker **inherited unattributed edits** and found **two of them factually false**; they
    were caught **only by independent re-measurement, not by any procedure**.
  - **Cause of the death: the owner's network connection dropped** — ⚠️ **owner-reported testimony, not
    artifact-verified.** No artifact records why a process stopped.
  *Why it is here:* the report's §1, §2 addendum and §10 constraint (4) carry the *rule* this yields; this
  entry carries the *incident*, so a later reader is not asked to reconstruct it from the rule.
  *Re-raise only if:* it recurs — a second driver misreads a partial landing — in which case it is an
  operational pattern, not an incident, and belongs in a brief rather than a residual.
- **R10 — emphasis added inside block quotes labelled "verbatim" (4 instances, one class); two flattened
  markdown links.** *Disposition:* **accepted as a residual, 2026-08-04 — by the coder, NOT owner-ruled**
  (the reviewer recommended it; the driver delegated the call). *Why:* the quoted **words** are unaltered
  in all four — verified against each source — so the defect is typographic, not substantive, and the
  remedy the reviewer asked for is in place: a standing note at §1 that all quoted bold is *emphasis
  added* unless stated otherwise. *Re-raise only if:* a quotation is found whose **words**, not
  typography, differ from its source — that is a correctness defect and this residual does not cover it.
