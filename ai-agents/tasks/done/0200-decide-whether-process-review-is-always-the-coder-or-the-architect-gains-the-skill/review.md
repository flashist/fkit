# Review — 0200

Task: 0200 — [brief](./brief.md)
File(s) under review: `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` (**763 lines** at Round 2; 551 at Round 1 — every Round-1 coordinate was re-derived, not reused)
Status: **closed-out** (Round 2, 2026-08-05) — **the reviewer lifted the block, which was the gate.**
Round 1 held this at `in-review` because whether the three high fixes landed was the **reviewer's**
call, not the author's. The Round-2 pass made that call: *"✅ THE ROUND-1 BLOCK LIFTS"*, all three
highs **✅ FIXED**, 0 high / none blocking, and a convergence call of *"ACT on R13, then CLOSE. Do not
run a Round 3 review."* R13 is **fixed**; R14–R18 are **accepted residuals** (owner-ruled 2026-08-05).
Nothing blocking remains. **18 findings dispositioned across two rounds; zero code changed.**

**Reviewers run — Round 1:** Claude (own pass) + **Codex** (`codex-cli 0.145.0`, `codex exec --sandbox read-only`, exit 0, 9 findings). **Coverage COMPLETE — no degradation.**

> **Verdict (Round 1): 🛑 Blocked — 12 confirmed defects (3 high).**
> **The §2 ruling itself SURVIVES.** Grounds 2–4 are independently verified and carry §2 without ground 1.
> Every defect below sits in the report's **support, its Q2/Q4 answers, and the follow-ups the producer
> files from** — not in the ruling. All are document edits.

---

## Reviewer findings

| #   | Round | Sev  | file:line | Claim |
|-----|-------|------|-----------|-------|
| R1  | 1 | **high** | report §3 "Answer" + §8 follow-up 1 | The *"apply … **method**"* wording is a **settled, ADR-backed convention**, not a wording defect. `claude/skills/fkit-task-ship-loop/SKILL.md:152` — *"apply the **method** of `fkit-process-stateful-review` (do **not** run that skill's owner gate — this loop's authorization replaces it)"*; `:303` — *"used by *method*, not invoked-and-overridden"*. ADR-019 **explicitly rejected** narrowing the skill's gate via a cross-skill note (`adr-019-…:127`); ADR-032 keeps the skill *"byte-unchanged"* (`adr-032-…:136-138`); `claude/agents/fkit-coder.md` names the sprint-loop Process-review worker as one of exactly **two** loops carrying standing approval. The loop row the report wants to rewrite **cites those ADRs in its own text** (*"(task-loop discipline, ADR-019)"*, *"(ADR-032 A2 / ADR-019 `:96`)"*) — and the report's S10 table **elides them**. **The report cites ADR-019 and ADR-032 zero times** (measured: `grep -c 'ADR-019\|ADR-032'` = 0). Changing the row to *"run `/fkit-process-stateful-review`"* re-imposes the per-round owner gate that ADR-019/ADR-032 deliberately replaced. Also falsifies S9: the *"method"* wording is in **≥3 files**, not two. |
| R2  | 1 | **high** | report §5 "Answer" + §9 "What I did not verify" | The recommended detector is **not unconditional**. `claude/skill-ownership-hook.sh` fires only on an **attempted** Skill invocation. A worker told to *apply the method by hand* never reaches the gate — **the report's own §7 says exactly this** (*"a driver that spawns the wrong role and tells it to work by hand never reaches the gate"*). So §5's *"Yes — at task one, **unconditionally**"* and the *"0 tasks"* score in the candidate table are overstated, and §9's *"my §5 argument does not depend on which reading is true — it holds either way"* is **false for the never-invoked reading** of `0158`/`0143`: on that reading there is no denial to persist. Q4 is answered for the attempted-invocation case only. |
| R3  | 1 | **high** | report §2 ground 1 | *"`0167`'s **Process-review was worked by a coder**, twice (`worklog.md:204`, `:434`)"* rests on **inference, not measurement**. `0167/worklog.md` carries exactly **one** `**Role:**` line — `:3`, `fkit-architect` (the Build worker); **neither `:204` nor `:434` carries one**. Round 1's own text: *"the author is **unestablished, and I could not establish it**"* (`0167/review.md:219`). Round 2's provenance names *"a Process-review worker spawned by `fkit-sprint-ship-loop`"* — **no role**. The claim rests on absence-of-denial, which the report's **own S11** establishes proves nothing. **Asymmetric skepticism**: the report refuses to conclude from absence in `0158`/`0143` and concludes from absence here. ⚠️ **A better citation exists and the report does not use it** — `0167/worklog.md:304` (inside the **architect's** Instance-3 round) attests *"a spawned `@fkit-coder` running the Process-review step **died**"*. That attests the **routing**, not that two rounds were *worked* by a coder. |
| R4  | 1 | medium | report §2 ground 1 | *"the only hits in the tree are inside `0200`'s own brief and plan"* — **false**. `/usr/bin/grep -rln "does not own skill"` (excluding `.git`) returns **10 files**, incl. `ai-agents/tasks/done/0195-…/worklog.md`, `done/0112-…/worklog.md`, `done/0124-…/review.md`, `ai-agents/sprints/sprint-2.md`, and the report itself. **Self-contradicting**: the report's own §0 cites `0195/worklog.md:189-194` as carrying the denial verbatim. The narrower *"zero hits over `0167`/`0190`/`0191`"* measurement is sound; the tree-wide generalization is not. |
| R5  | 1 | medium | report §0 ("The `0191` driver-side clause is **live**") + §5 + §9 | The clause is **not live**. The running driver loads `.claude/skills/fkit-sprint-ship-loop/SKILL.md` — measured **296 lines, `grep -c` for the clause = 0**. Only the canonical `claude/` source (309 lines) carries it. `0191/worklog.md` §*"⚠️ Stated limitation — the clause reaches no driver yet (owner-ruled deferred)"* states this outright; the report never cites it. §5 disputes the clause's **reach** when it in fact reaches **no driver at all**. Strengthens §5's conclusion, falsifies its premise. |
| R6  | 1 | medium | report S11 + §5 "Feasibility" + §7 maintenance row | *"no fkit hook writes a durable record of anything"* / *"no fkit hook persists anything today, so this is new ground"* — **false**. `claude/askuserquestion-marker-hook.sh:57` and `claude/shiploop-marker-hook.sh:64` both run `mkdir -p "$cwd/.fkit/state" && : > "$cwd/.fkit/state/<marker>-$session_id"`; `.fkit/state/` currently holds 9 live marker files. The `grep -n '>>'` probe only detects **append** redirection. Hook→filesystem persistence is an **existing pattern**. ⚠️ **Partial rescue:** `.fkit/` is **gitignored** (`.gitignore:8`), and the owner ruled the denial record must be **git-tracked** — so the novel part is the git-tracked location, not persistence itself. §5's *"the one genuine unknown"* framing needs narrowing accordingly. |
| R7  | 1 | medium | report §5 "On the literal reading — no" | The "literal" reading is the **less** natural one. The clause binds the **driver at instruction time**; the driver's spawn instruction **named** `fkit-process-stateful-review` and told the worker to apply it, so on the driver's own intent it *was* *"the skill a worker will run"*. Reading *"will run"* as *"will successfully pass authorization"* makes every **denied** invocation escape a driver-side rule — and `0195`'s worker **did attempt** the invocation (`0195/worklog.md:189-191`). ⚠️ The report's **conclusion** (the clause adds no detection) is **correct and unaffected** — it over-reaches by disputing reach when only detection was needed. |
| R8  | 1 | medium | report §7 priority table + §1(c) | **(a)'s priority-1 win is partly an artifact of how (c) was defined.** The report constructs (c) as *"change neither the prose nor the ownership"*, so (c) scores *"Silent — declines to state the rule at all"*. But the **brief's own** third option was *"leave ownership alone and make the loop's Process-review row state its role **and its reason**, plus a driver-side check"* (`brief.md`, *What to build* step 2) — i.e. the brief's "neither" **already included** the row rationale the report credits only to (a). The recommended **(a)+(c) union is unaffected**, but the report should not claim (c) abstains on correctness when the routing rule it leaves intact is, per the report's own S7, **already correct**. Raised independently by both reviewers. |
| R9  | 1 | medium | report S13 + §1(b) + §8 follow-up 5 | The *"checklist is incomplete again"* conclusion **over-counts**. Of S13's four "undeclared sites": `claude/agents/fkit-coder.md` **stays true under (b)** (the coder keeps the skill), and *"the second `fkit-team/SKILL.md` row"* is inside a file the checklist **already names**. Genuinely new files: **2** (the skill's own ⛔ banner; `claude/agents/fkit-architect.md`'s skill list — which is *not* among the 11 grep hits precisely because it lacks the skill today). Compounded by the **files-vs-sites conflation**: *"nine files"* is stated **three times** (§1(b), §7 ×2); enumerated distinctly it is **8 files / 9 sites**. ⚠️ Under-count in the other direction, unrecorded: `claude/agents/fkit-reviewer.md:41` and `claude/skills/fkit-stateful-review/SKILL.md` (`:7`, `:47`, `:132`) all say *"**the coder's** `fkit-process-stateful-review`"* and would go stale under (b). |
| R10 | 1 | low | report S12 + §4 "The weakening is direct" | *"(b) would make all five statements false at the skill layer"* **overstates decisiveness**. Step 6 says *"apply the minimal, idiomatic fix for each approved finding"* — for a document review the fix is a document edit, within the architect's existing authority. The five cited sites were each **verified accurate** (`fkit-coder.md:4`, `README.md:98`, `fkit-team/SKILL.md:24`, `scaffold/CLAUDE.md:24`, `scaffold/…/task-owner-vocabulary.md:14`) and the **unconditional-grant** argument (§4, *"total or absent"*) is sound — so **the rejection of (b) stands**. What is overstated is *"falsifies"*: it establishes an authority **conflict**, not automatic falsification. |
| R11 | 1 | low | report §9 "Naming-precedent divergence" | *"only **2** of the reports … carry the `eval-` prefix"* — measured **3 of 28** (`2026-07-10-eval-…`, `2026-07-23-eval-…`, and **this report itself**). Cosmetic; the flagged divergence is real. |
| R12 | 1 | low | report §7 "Every file that would change" | Brief **verification step 5** requires *"lists **every file** that would change"* for the recommended option. The table names a **directory** (`test/`), a **wildcard** ADR path, and concedes the denial record's *"mechanism + location pending the owner decision"* — so any state/log file the detector creates is necessarily absent. **Honestly disclosed, not concealed**, but step 5 is satisfied only in part. Now partly resolvable: the owner has ruled the record is a **git-tracked append-only log**. |
| R13 | 2 | medium | report §3 "What the row should say instead" + §7 file table + §8 follow-up 1 | **The R1 re-scope does not re-impose the gate as *reasoned*, but its *instruction* is unscoped.** The fix is stated as *"enumerate the method's steps"* / *"the method's steps listed in the cell"* / *"spell the method's steps out in the row"* — with **no carve-out for which steps**. The method's literal steps include **Step 4** (*"set Status = **`pending approval`** (nothing is applied yet)"*, `fkit-process-stateful-review/SKILL.md:174`), **Step 5** (*"Report + convergence call, **then gate on approval**"* `:182`; *"**wait for my explicit approval** before changing any code"* `:191`) and **Step 6** (*"**Once I explicitly approve** specific findings"* `:195-197`). A literal enumeration therefore **re-imposes the per-round owner gate ADR-019 rejected** — the exact error R1 exists to prevent, reintroduced by wording; a partial enumeration is not *"the method's steps"*. §3 does carry the guard sentence *"leaving the invocation/gate boundary exactly where ADR-019 put it"*, but **§8 follow-up 1 — the text the producer actually files from — does not**, and the report never names which steps to list. ⚠️ **The correct scope is already on disk and uncited**: `fkit-coder.md` §*"As the Process-review worker:"* and the loop row `fkit-sprint-ship-loop/SKILL.md:124` both gloss the method as exactly the three non-gate activities — *"verify each finding, classify defect/frontier, write the *Coder response*"*. **Raised by both reviewers** (Codex: high; I assign medium — the derivation is available and signposted, and a wrong landing is reviewable). |
| R14 | 2 | medium | report §5 candidate table row (i) + §5 path-coverage table + §7 "Stated as one option" | **The pair covers both paths in *mechanism*; the *reliability* claim on the by-hand half is overstated — the same failure mode as R2, at reduced magnitude.** (i) is *"Require a `**Role:**` line per worklog round, and **test for its presence**"*, verdict *"Unreliable as *disclosure*; **reliable once its presence is asserted by a test**"*. A **presence** test cures **absence** (`0167`'s case) — it cannot cure **misattribution**: nothing compares the recorded role against the role the step's row names, so a round carrying `**Role:** @fkit-coder` copied from the row passes, and an honest `**Role:** @fkit-architect` still needs a **human to read it**. That is the same dependency the report uses to down-rank candidate (ii) (*"Only if the driver runs it — the driver is the erring actor"*), and it sits under the report's own rule *"**A detector whose output channel is the accused is not a detector**"*. §7's *"both the hook path and the by-hand path leave a durable trace, so the next departure surfaces at task one"* inherits the overstatement. §5's closing *"remaining open piece … who is obliged to read the log"* is scoped to **the log only** and never extended to the `**Role:**` half. ⚠️ Measured: the loop row `fkit-sprint-ship-loop/SKILL.md:124` **already** obliges a worklog decision-log entry (*"record `none` if none"*, ADR-032 A2 / ADR-019 `:96`) but obliges **no `**Role:**` line** — so (i) is a new obligation on an existing self-reported channel. **Raised by both reviewers.** |
| R15 | 2 | medium | report §1(b) *"8 files / 9 sites"*, §7 "The four mirrors, enumerated", §9 "Also open" | **The R9-corrected count is still wrong, off by one, at all three sites. Re-derived: 7 files / 8 sites, not 8 / 9.** Enumerated from the report's own construction: `claude/skills-for-role.sh` (1) + the four declared mirrors as the header actually lists them — `claude/skills/fkit-team/SKILL.md` (**2 sites**), `claude/README.md`, `claude/scaffold/CLAUDE.md`, `ai-agents/knowledge-base/architecture.md` (4 files / 5 sites) + S13's two genuinely-new files — the skill's own ⛔ banner and `claude/agents/fkit-architect.md` (2) = **7 files / 8 sites**. `skills-for-role.sh`'s header (`:12-17`) declares exactly those four mirrors and does **not** count itself. ⚠️ **This is my own Round-1 error propagating**: R9 asserted *"8 files / 9 sites"* and the figure was adopted rather than re-derived, despite the Coder response stating *"no measurement is inherited"*. **Materially contained:** it feeds only §7's priority-**3** maintenance row, and (b) is rejected on priority **1** (correctness), explicitly *"not cost"* — so **the ruling and the rejection of (b) are unaffected**. §9's standing hedge (*"a second hand count is not a guarantee, only a better estimate"*) already anticipates this. **Raised by both reviewers.** |
| R16 | 2 | low | report S13 under-count note + §8 follow-up 5 | **`claude/skills/fkit-stateful-review/SKILL.md:7` also carries the stale sentence and is still omitted.** Line 7 (frontmatter `description`) reads *"…the task folder's review.md ledger — which **the coder's fkit-process-stateful-review** reads and responds to"*. **My Round-1 `:7` citation was correct.** The coder's grep missed it because the phrase **wraps across lines 7–8** and the frontmatter carries **no backticks**, so a single-line search for the backticked form cannot match. Same wrapping trick verified in the other direction: §2 ground 2's quote *"Reviewer and coder each own a section and round-trip in place"* is **real** and lives at `fkit-process-stateful-review/SKILL.md:7-8` — my own first single-line grep missed it too. **Impact:** the frontmatter `description` is the text the skills listing surfaces, so it is the most visible of the three stale sites, and follow-up 5 would ship without it. **Raised by both reviewers.** |
| R17 | 2 | low | report §2 ground 1, the R4 correction (*"11 git-tracked files"*) | **The R4 correction's own re-measurement is mis-qualified.** 11 files match `does not own skill` outside `.git`/`.fkit` — verified — but only **7 are git-tracked**. Four are untracked: the report itself, and `0200`'s `plan.md`, `review.md`, `worklog.md` (`git ls-files --error-unmatch`, this turn). The correction's list names *"this report itself"* as one of the eleven while the task worklog records it as newly untracked. **R4's point stands and stands more strongly** — the *"only hits in the tree"* claim was false either way; only the qualifier is wrong. Raised by Codex; verified and sharpened by me (Codex flagged one untracked file, there are four). |
| R18 | 2 | low | report §5 Answer + candidate row (v) + §7 file table | ***"outside the denied worker's control"* overstates what the mechanism buys.** Per ADR-022 the per-role **tool** allowlist is relaxed for every role **except** the adversarial reviewer, so a denied `@fkit-architect` worker has `Write`/`Edit`/`Bash` and can alter or truncate a git-tracked log file; *"append-only"* names the hook's intended write, not an enforced property. **Substantially mitigated, and the mitigation is the report's own choice:** because the log is **git-tracked**, tampering leaves a diff — which is precisely why the owner ruled git-tracked over `.fkit/`. The true and load-bearing sense — *the write is not conditional on the denied worker choosing to disclose* — holds. Only the absolute phrasing is wrong, and follow-up 3 will be built from that phrase. Raised by Codex. |

### Disproven / not raised (recorded so the coder does not chase them)

- **S7's reframing is followed through consistently.** Measured: `disagree` appears 4× in the report, all inside S7's correction and §5's restatement of Q4. **No slip back into the brief's prose-vs-hook framing.** No finding.
- **S8 verified.** `0195/worklog.md` §*"Round 3 — procedural conformance re-run"* confirms *"Skill Step 0/2/3/3.5 — steps the hand-application never ran"* and *"Step 4 — Status cells use none of the six prescribed values"*. The report's *"single strongest fact"* holds. ⚠️ But see **R1**: the remedy it implies is *enumerate the method's steps*, not *switch to the invocation form*.
- **S10 verified exactly.** Every row of the loop's step-2 table matches the report's table; the Process-review row is the only one omitting both the `/` prefix and the verb *"run"*.
- **Citations spot-verified and correct:** `skills-for-role.sh:52`/`:53`; `adr-037-…:33`; `adr-012-…:175`; the four-mirror header; the hook's `deny()` (stderr `printf` + deny JSON, no persistence); `0195/worklog.md:189-194`; `0201` exists; **ADR-038 is the correct next number** (highest present = `adr-037`); 11 files under `claude/` contain the skill name.
- **Not raised, per bounds:** the `0143` fact defect (routed to `0201`); the un-written ADR (owner-ruled producer follow-up); the absent owner interview (ADR-021, recorded in the report).

### Not re-run by this reviewer

`node --test test/*.test.js` and `bash test/prove-red.sh` were **not** re-run in this pass — the Verify step reports 567 pass / 0 fail and prove-red PASSED. **Stated, not assumed.** This deliverable ships no code, so tests are a regression guard either way.

---

## Round 2 — 2026-08-05

> # ✅ THE ROUND-1 BLOCK LIFTS.
> **⚠️ Changes requested — 6 defects (0 high, none blocking).**
> **All three Round-1 high findings are genuinely repaired.** Each was re-tested against the code on
> its own terms, not against Round 1's coordinates. **§2's ruling stands**, now carried by grounds 2–4
> which I re-verified independently. The six new findings are **medium/low**, sit in the *support*, the
> *detector design* and the *counts*, and **none touches §2's Answer or the recommendation's direction**.

**Reviewers run — Round 2:** Claude (own pass) + **Codex** (`codex-cli 0.145.0`,
`codex exec --sandbox read-only`, **exit 0**, 6 findings). **Coverage COMPLETE — no degradation.**
**Convergence between the two reviewers was high:** R13, R14, R15 and R16 were **raised by both**
independently. Every Round-1 coordinate was **re-derived**; the deliverable grew 551 → 763 lines.

### Verdict on each of the three high fixes — the gate

| Round-1 high | Fix as applied | My verdict | Residual |
|---|---|---|---|
| **R1** — the invocation-form recommendation would re-impose the gate ADR-019 rejected | *"apply … **method**"* **kept**; §3's Q2 answer **reversed**; S10's table restored the row's own `(task-loop discipline, ADR-019)` / `(ADR-032 A2 / ADR-019 :96)` citations; S9 two → ≥3 files; §7 + §8-1 re-scoped | **✅ FIXED — and the re-scope does NOT re-impose the gate.** Verified at source, not taken on trust: ADR-019's *"Narrow `fkit-process-stateful-review`'s gate via a cross-skill note"* is listed under **Options considered → Rejected** (*"unenforceable without a runtime loop-context signal"*); ADR-032 confirms the skill is **byte-unchanged** and names the sprint loop the **second** standing-approval exception; `fkit-coder.md` §*"A second scoped exception"* names exactly **two** such loops. The ADR-019/ADR-032 line count is **13** (`/usr/bin/grep -c`), up from 0 — re-measured. **The harmful producer follow-up Round 1 would have caused is gone.** | **R13** (medium) — the *instruction* is unscoped: *"enumerate the method's steps"* without a carve-out, and Steps 4/5/6 **are** the gate |
| **R2** — *"unconditionally"* / *"holds either way"* overstated a hook-only detector | Detector is now a **PAIR** — git-tracked append-only denial log **+** mandatory `**Role:**` line per worklog round; path-coverage table added; *"only candidate … unconditionally"* **withdrawn**; §9's *"holds either way"* **corrected as false** in those words | **✅ FIXED — the two signals do cover both paths in mechanism, and the coverage claim is genuinely corrected, not merely softened.** The withdrawal is explicit and self-incriminating (*"That was FALSE as Round 1 scoped the detector"*), the path table maps mechanism→path correctly, and the hook's attempted-invocation-only trigger is stated rather than elided. | **R14** (medium) — the by-hand half's *reliability* claim is overstated: a **presence** test cures absence, not misattribution |
| **R3** — *"worked by a coder, twice"* rested on inference, not measurement | *"worked by a coder, twice"* **withdrawn**; re-cited to `0167/worklog.md:304`; narrowed to **routing attested, authorship not**; ground 1 marked weakest; grounds 2–4 stated to carry §2 alone | **✅ FIXED — cleanly, no residual.** I read `0167/worklog.md:301-306` myself: *"A spawned `@fkit-coder` running the Process-review step **died** when the owner's network connection dropped"*. That **does** attest the routing to `@fkit-coder`, and — because the worker **died** — it conspicuously does **not** attest authorship. **The narrowing is exactly what the record supports, and not one word more.** (Nit, not a finding: the quoted sentence begins at `:303`; `@fkit-coder` is on `:304`.) | **none** |

### §2's ruling — confirmed, with one honest limit on *how* I could confirm it

**Grounds 2–4 re-verified independently, first-hand this turn** — each holds and each is sufficient:

- **Ground 2** — *"Reviewer and coder each own a section and round-trip in place"* is **real**, at
  `claude/skills/fkit-process-stateful-review/SKILL.md:7-8` (frontmatter `description`). ✅
- **Ground 3** — Step 6 applies code fixes: `:195-200`, *"**Apply** the minimal, idiomatic fix for each
  approved finding"*. ✅
- **Ground 4** — ADR-033's route-don't-widen precedent: `adr-033-…md:131`, *"that makes producer-only
  structural at any spawn depth"*. ✅ *(Nit, not a finding: `:131` sits in ADR-033's reference list and
  attributes the mechanism to **ADR-018**'s hook; the report reads it as ADR-033's own. The precedent
  the ground rests on is unaffected.)*

⚠️ **The *"byte-identical"* claim cannot be verified by measurement, and I will not assert what I did
not check.** The deliverable is **untracked** — `git log --all` returns nothing for it and there is no
stash — so **no baseline exists** against which byte-identity could be tested this round or any round.
What I **can** and do confirm: §2's **Answer blockquote is present and is the ruling**; grounds 2–4 are
**substantively accurate** against the code today; no Round-1 finding targeted the Answer or grounds
2–4; and my Round-1 pass recorded *"the §2 ruling itself SURVIVES"*. **Substantive non-change:
confirmed. Byte-identity: unverifiable, and stated as such rather than repeated back.**

### Also confirmed, as asked

- **R7's residual is correctly recorded** — full **What / Why (structural) / Re-raise only if** shape,
  with a **three-part re-raise condition** ((a) the clause reaches `.claude/` **and** (b) a concrete
  spawn decision turns on the reading, **or** (c) ADR-038 needs the semantics fixed). ✅ **Not
  re-litigated this round**, and it was primed into the Codex pass as settled — Codex did not raise it.
- **R10's narrowing is CORRECT, not a dodge.** *"make all five false"* → *"put all five into direct
  conflict"* is the accurate claim: for a **document** review Step 6's fix is a document edit, inside
  the architect's existing authority, so the five sentences are not falsified the instant (b) lands.
  Decisively, **the narrowing does not weaken the rejection of (b)** — the report immediately re-anchors
  it on the unscopable-grant asymmetry (*"`skills_for_role()` is a flat list with no conditions … The
  grant is total or absent"*), which I verified at `claude/skills-for-role.sh:50-56` (a flat
  space-delimited list, substring-matched by the hook). **The rejection got *stronger*, not weaker.**
- **R9 was corrected in both directions and both directions check out** — `fkit-coder.md` correctly
  **removed** (the coder keeps the skill under (b), so the sentence stays true); `fkit-reviewer.md:41`
  correctly **added** and verified at that exact line. **But the `:7` site is still missing — see R16;
  my Round-1 `:7` citation was right**, and the reason the coder's grep could not reproduce it is
  mechanical and worth carrying forward: **the phrase wraps across lines 7–8 and the frontmatter has no
  backticks**, so a single-line search for the backticked form cannot match. The same wrapping defeated
  my own first grep for ground 2's quote.
- **The inline correction apparatus is HONEST and READABLE — it has not made the report hard to
  follow.** I swept the whole document for the highest-value failure mode: a correction applied in one
  place while an **uncorrected copy of the same claim survives elsewhere**. **There are none.** Every
  occurrence of *"nine files"*, *"worked by a coder"*, *"only hits in the tree"*, *"no fkit hook"*,
  *"holds either way"*, *"unconditionally"* and *"run `/fkit-process-stateful-review`"* now appears
  **only inside a `⚠️ CORRECTED / AMENDED / RE-SCOPED` block, quoted as withdrawn**. Corrections **lead**
  their sections rather than sitting in footers (§3's *"This answer was WRONG in Round 1"*, §5's
  *"READ THIS FIRST (R5)"*). **One caveat:** at 763 lines with corrections interleaved, **§8 is the only
  section the producer will read**, so each follow-up must stand alone — which is exactly why **R13
  matters**, since follow-up 1 is the one that does not carry its own guard.

### Verified correct this round (recorded so Round 3 does not re-check them)

`/usr/bin/grep -c 'ADR-019\|ADR-032'` = **13**; runtime `.claude/skills/fkit-sprint-ship-loop/SKILL.md`
= **296 lines, clause absent**, canonical = **309, clause present**; `eval-` reports = **3 of 28**;
`test/` = **16 entries**; **11 files** match `does not own skill` outside `.git`/`.fkit`; **11 files**
under `claude/` name the skill; the **four-mirror header** declares exactly the four the report lists
and does not count itself; the **seven-role** reductio (7 arms in `skills_for_role()`, 7 files in
`claude/agents/`, *"The seven live roles"* in `task-owner-vocabulary.md:9`) — *four of seven* is right;
all five `sole source-write` sites accurate at the lines cited; `.gitignore:8` = `.fkit/`;
`fkit-process-stateful-review/SKILL.md:198`; `adr-037-…:33`; `adr-012-…:175`; `fkit-reviewer.md:41`;
`fkit-stateful-review/SKILL.md:47` and `:132`. The **2-of-4 `**Role:**`** measurement is exact as
scoped (`0167` `:204`/`:434` bare, `0190:239` / `0191:121` present).

### Considered and NOT raised (so nobody chases them)

- **Codex R1-2 — *"citation count 0 → 13"* counts matching **lines**, not citations** (13 lines / 23
  occurrences). **Not a deliverable defect:** the report's own §3 states its method explicitly
  (*"measured: `/usr/bin/grep -c …` returned 0"*), and `-c` counts lines by definition. The *"0 → 13"*
  phrasing sits in the **Coder response**, which is not mine to write. **Disproven as a report finding.**
- **Codex's third-path claim — "a worker that writes no worklog round escapes both signals."**
  **Weaker than stated, and I did not raise it as its own row.** Measured: `fkit-sprint-ship-loop/SKILL.md:124`
  **already** obliges the Process-review worker to record in the worklog decision log (*"record `none` if
  none"*). The surviving true part — that the obligation is **prose addressed to the erring actor** — is
  folded into **R14** rather than double-counted.
- **The `0143` fact defect** (routed to `0201`), **the un-written ADR-038** (owner-ruled producer
  follow-up), **the absent owner interview** (ADR-021), and **the `eval-` naming divergence** (§9,
  deliberately not filed) — all **out of bounds**, primed into the Codex pass as settled, and **not
  raised by either reviewer**.

### Re-litigates settled decisions (suppressed)

**None.** No Round-2 finding from either reviewer re-opens **R7's accepted residual** (the `0191`
clause's *"will run"* reach) or any ADR *"Re-raise only if"*. I re-skimmed `decisions/` for ADR-012,
ADR-019, ADR-022, ADR-032, ADR-033 and ADR-037. **The suppressed list is empty because there was
nothing to suppress, not because I skipped the check.**

### Convergence call — **ACT on R13, then CLOSE. Do not run a Round 3 review.**

**This is converging, not looping.** Round 1 → Round 2 shows the right shape: **12 findings → 6**,
**3 high → 0**, and **not one Round-2 finding re-raises a Round-1 claim** — R13/R14 are *new residuals
created by the fixes*, R15/R16/R17 are *precision defects inside the corrections*, R18 is new. Nothing
oscillates and nothing reverses an accepted decision.

**Regression check — one flagged, loudly, and it is mine:** **R15 is my own Round-1 R9 number
(*"8 files / 9 sites"*) propagating into the correction.** The Coder response states *"no measurement is
inherited"*; this one was. It changes no conclusion — the count feeds only the priority-**3**
maintenance row, and (b) is rejected on priority **1** — but a reviewer's figure adopted rather than
re-derived is exactly the defect this ledger exists to catch, so I am recording it against myself.

**Recommended disposition:** **R13 is the only item worth a code-free edit before this ships** — one
clause in §8 follow-up 1 naming the enumeration's scope (the three non-gate activities already glossed
at `fkit-coder.md` and `SKILL.md:124`), so the producer cannot file a follow-up that re-imposes the
gate. **R14–R18 are candidates for accepted residuals**, not further rounds: each is a precision defect
in a report that already flags its own counts as hand-grep estimates, and none changes the ruling, the
recommendation, or the rejection of (b). **The block lifts either way** — routing the close does not
wait on R13.

---

## Coder response

<!-- CODER-OWNED — the reviewer does not write here. -->

**Round 1 · 2026-08-05 · `**Role:** @fkit-coder`**, spawned as the **Process-review** worker by
`/fkit-sprint-ship-loop` (live `fkit lead` driver session), running `/fkit-process-stateful-review`
**as the skill** — Steps 0–7, not by hand. Standing approval: the owner approved this task's plan
(`plan.md`, `git hash-object` `1a3e76b…`, 17891 bytes — **confirmed byte-exact before acting**) and
ruled R1–R3 explicitly in the same live session (ADR-019 discipline under ADR-032's declared-approval
marker). **Every finding below was re-verified first-hand this turn; no measurement is inherited.**

**Severity is mine, not inherited.** I concur with the reviewer's three "high" labels on blast radius:
R1 and R2 would each have shipped a **producer follow-up that makes the system worse** (R1 by
re-imposing a gate ADR-019 rejected; R2 by building a detector blind to the very path the incident
took), and R3 put an unattested inference into the ruling's own grounds. None of the twelve touches
§2's ruling.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | **Re-scoped, per owner ruling.** *"Apply … **method**"* **kept** — verified as a settled ADR-019/ADR-032 convention at three sites (`fkit-sprint-ship-loop/SKILL.md:124`, `fkit-coder.md:73`, `fkit-task-ship-loop/SKILL.md:152` + `:303`). §3's Q2 answer **reversed**: the fix is to **enumerate the method's steps**, not switch to the invocation form. S10 table now carries the row's own `(task-loop discipline, ADR-019)` / `(ADR-032 A2 / ADR-019 :96)` citations it had elided; S9 corrected two → **≥3 files**; §7 heading, priority table, file table and §8 follow-up 1 all re-scoped. **ADR-019/ADR-032 citation count 0 → 13.** | ✅ done |
| R2 | **CORRECT** | Defect | **Detector is now a PAIR, per owner ruling.** (i) git-tracked **append-only** denial log (covers an *attempted* invocation) **+** (ii) mandatory `**Role:**` line per worklog round (covers the **by-hand** path that never reaches the hook — 2 of 4 rounds this session lack one, re-measured). §5's *"only candidate … unconditionally"* withdrawn with a path-coverage table; §9's *"it holds either way"* **corrected as false**; candidate table rows (i)/(v) rewritten; §8 follow-up 6 folded into follow-up 3 so neither half can ship alone. | ✅ done |
| R3 | **CORRECT** | Defect | **Re-cited and narrowed, per owner ruling.** §2 ground 1's *"Process-review **was worked by a coder**, twice (`:204`, `:434`)"* **withdrawn** — re-measured, `0167/worklog.md` carries **one** `**Role:**` line (`:3`, `fkit-architect`); `:204`/`:434` are bare headings with no attribution. Re-cited to **`0167/worklog.md:304`** (*"a spawned `@fkit-coder` running the Process-review step **died**"*) and narrowed to **the routing is attested, not the authorship**. Recorded that ground 1 is now the weakest of four and that grounds 2–4 carry §2 alone. | ✅ done |
| R4 | **CORRECT** | Defect | **Re-measured:** `/usr/bin/grep -rl "does not own skill"` → **11 git-tracked files**, incl. `done/0195-…/worklog.md` (cited by this report's own §0), `done/0112-…`, `done/0124-…`, `sprints/sprint-2.md`, `claude/skill-ownership-hook.sh`, `test/skill-ownership-hook.test.js`. *"Only hits … `0200`'s brief and plan"* struck as self-contradicting. The narrow zero-hits-over-`0167`/`0190`/`0191` measurement **re-verified and kept**. | ✅ done |
| R5 | **CORRECT** | Defect | **Re-measured:** runtime `.claude/skills/fkit-sprint-ship-loop/SKILL.md` = **296 lines, clause absent**; `diff` shows the 13-line block only in canonical `claude/…:285`. §0's *"live"* struck, §5 opens with a moot-on-the-facts box, §9 corrected from *"reach disputed"* to **"reach is zero"**, and `0191/worklog.md:37` §*"Stated limitation"* now cited. | ✅ done |
| R6 | **CORRECT** | Defect | **Re-measured:** `askuserquestion-marker-hook.sh:57` and `shiploop-marker-hook.sh:64` write `.fkit/state/<marker>-$session_id`; `turn-completion-hook.sh:73,:97` read them. S11's *"no fkit hook writes a durable record of anything"* corrected — my `'>>'` probe caught only **append** redirection. Narrowed per the reviewer's own rescue: `.fkit/` is gitignored (`.gitignore:8`), so **the git-tracked location is the new part, not persistence**. §1(c) maintenance and §5 feasibility both narrowed. | ✅ done |
| R7 | **PARTIALLY CORRECT** | **Frontier** | **Conclusion right, reasoning wrong, and R5 moots both.** The reviewer's reading of *"will run"* as binding the driver at instruction time is defensible but not established; my *"the literal reading is more natural"* is likewise not established. Verified the reviewer's supporting fact: `0195`'s worker **did attempt** the invocation (`0195/worklog.md:188-190`). Report now records the reading as **contested and unsettled**, and states that the dispute changes nothing — the clause adds no detection either way **and reaches no driver at all** (R5). **Recorded as an accepted residual so it does not recur.** | won't fix (frontier) |
| R8 | **CORRECT** | Defect | **Verified:** `brief.md` §*What to build* step 2's third option was *"leave ownership alone and make the loop's Process-review row state its role **and its reason**, plus a driver-side check"* — i.e. the row rationale I credited only to (a). My narrower construction of (c) is what produced its *"Silent"* score. §1(c) and §7's priority table now say so; **the recommendation is unchanged** (it is the union either way) and no longer rests on (c) abstaining. | ✅ done |
| R9 | **CORRECT** (both directions) | Defect | **Re-measured:** 11 files under `claude/` name the skill. Option (b)'s surface = **8 files / 9 sites** (the two `fkit-team/SKILL.md` rows are one file); *"nine files"* corrected at all **three** sites (§1(b), §7 ×2). `claude/agents/fkit-coder.md` **removed** from the undeclared list — the coder keeps the skill under (b), so it stays true; genuinely new files = **2**. **Under-count added:** `claude/agents/fkit-reviewer.md:41` and `claude/skills/fkit-stateful-review/SKILL.md` `:47`, `:132` all say *"the **coder's** `fkit-process-stateful-review`"* and go stale under (b). §8 follow-up 5 updated in both directions. ⚠️ Reviewer cited `fkit-stateful-review/SKILL.md:7`; my grep for that exact phrase matched `:47` and `:132` only, so I recorded those two. | ✅ done |
| R10 | **PARTIALLY CORRECT** | Defect (wording) | **Verified:** all five `sole source-write` sites are accurate as cited (`fkit-coder.md:4`, `README.md:98`, `fkit-team/SKILL.md:24`, `scaffold/CLAUDE.md:24`, `task-owner-vocabulary.md:14`), and Step 6's *"**Apply** the minimal, idiomatic fix"* is at `fkit-process-stateful-review/SKILL.md:198`. The reviewer is right that a **document** fix is inside the architect's authority, so (b) creates an **authority conflict**, not instant falsification. *"Make all five false"* → *"put all five into direct conflict"*. **The rejection of (b) is unaffected** — it rests on the unscopable-grant asymmetry, which I verified stands. | ✅ done |
| R11 | **CORRECT** | Defect | **Re-measured:** `ai-agents/knowledge-base/reports/` holds **28** files, **3** with the `eval-` prefix (`2026-07-10-…`, `2026-07-23-…`, **and this report**). §9 corrected 2 → 3 of 28, noting Round 1 omitted itself from its own count. Cosmetic; the flagged divergence is real and stays unfiled. | ✅ done |
| R12 | **CORRECT** | Defect (disclosure) | **Verified:** `brief.md:195` requires listing *"**every file** that would change"*. §7's table names a directory (`test/`), a wildcard ADR path, and a denial log whose **path** is still open. Added an explicit *"satisfied only in part"* box rather than leaving it implied, listed the log as its own row, and recorded that the owner's ruling fixed the record's **shape** (git-tracked, append-only) but not its **path**. | ✅ done |

**Convergence call — ACT, not closeout.** All twelve are genuinely novel Round-1 findings: the
*Accepted residuals* section was empty at the start of this round, and no ADR *"Re-raise only if"*
covers any of them (I skimmed `decisions/` for ADR-019, ADR-032, ADR-033, ADR-036, ADR-037 — the ones
in scope). **No oscillation or regression risk:** every change is a document edit to a report that ships
no code, and none reverses a prior accepted decision. **R1 is the one finding that *prevents* a
regression** — Round 1's recommendation would have had the producer file work that re-imposes a gate
ADR-019 explicitly rejected.

**Nothing here required a code change.** Zero files under `claude/`, zero under `test/`. **10 of 12
applied; R7 recorded as a residual; R10 applied as a narrowing rather than the reviewer's full claim.**

### Round 2 · 2026-08-05 · **Role:** `@fkit-coder`

Spawned as the **Process-review** worker by `/fkit-sprint-ship-loop` (live `fkit lead` driver session),
applying `fkit-process-stateful-review`'s **method** under ADR-032's declared-approval marker — the
loop's single up-front approval replaces the skill's per-round gate (ADR-019, ADR-032). Standing
approval re-confirmed byte-exact before acting: `plan.md`, `git hash-object` = `1a3e76b…`, **17891
bytes**, **169 lines**. The owner ruled **R13 → fix** and **R14–R18 → accept as residuals** in the same
live session. **Every fact below was verified first-hand this turn; no measurement is inherited — which
is the exact discipline R15 records me breaking in Round 1.**

**Severity is mine, not inherited.** I concur with the reviewer's medium/low split and, on R13,
**with the reviewer over Codex**: Codex called R13 high, the reviewer medium. Medium is right — the
correct scope is on disk and signposted, and a wrong landing is reviewable before it ships. But the
blast radius is real enough to fix before close: §8 is the section a producer files from, and a
follow-up filed from an unscoped instruction would re-impose the gate ADR-019 rejected.

| #   | Verdict | Defect / Frontier | Action | Status |
|-----|---------|-------------------|--------|--------|
| R13 | **CORRECT** | Defect | **Fixed — one targeted addition to §8 follow-up 1**, carrying §3's guard (*"leaving the invocation/gate boundary exactly where ADR-019 put it"*) into the section the producer actually files from. ⚠️ **I did NOT write the carve-out as *"except Steps 4/5/6"*, and the deviation is deliberate — I verified the step numbers myself rather than inheriting them.** Read first-hand this turn, the per-round gate is **three quoted clauses inside Steps 4–6**, not those steps wholesale: Step 4's *"set Status = `pending approval`"*, Step 5's *"wait for my explicit approval before changing any code"*, Step 6's *"Once I explicitly approve specific findings"*. **Steps 4 and 6 also carry non-gate work the loop worker must do** — writing the *Coder response* rows (Step 4) and updating rows / *Accepted residuals* / the `closed-out` header (Step 6); this very entry is Step 4's and Step 6's work executing under the loop's standing approval. A blanket *"except 4/5/6"* would therefore drop *"write the Coder response"* — the activity the **on-disk gloss puts squarely in scope** (`claude/agents/fkit-coder.md` §*"As the Process-review worker:"* and `fkit-sprint-ship-loop/SKILL.md`'s Process-review row, both verified this turn: *"verify each finding, classify defect/frontier, write the *Coder response*"*). **The edit names Steps 4–6, quotes the three gate clauses to carve out, states the non-gate work that stays in, and points at the gloss to match.** Serves the owner's stated purpose exactly — *"do not let §8 read alone re-impose the gate"* — without minting the opposite defect. | ✅ done |
| R14 | **CORRECT** | Defect (overstated reliability) | **Accepted as a residual, per owner ruling — the report is not edited for it.** Verified: `fkit-sprint-ship-loop/SKILL.md`'s Process-review row already obliges a worklog decision-log entry (*"record `none` if none"*, ADR-032 A2 / ADR-019 `:96`) and obliges **no `**Role:**` line**, so (i) is a new obligation on an existing self-reported channel. The reviewer is right that a **presence** test cures **absence**, not **misattribution** — nothing compares the recorded role to the role the step's row names. | won't fix (frontier) |
| R15 | **CORRECT** | Defect (propagated count) | **Accepted as a residual, per owner ruling.** ⚠️ **Recorded as what it is: the reviewer's own Round-1 R9 figure (*"8 files / 9 sites"*) that I adopted rather than re-derived, in the same round whose response says *"no measurement is inherited"*. The propagation is the finding, not the arithmetic.** Materially contained — the count feeds only §7's priority-**3** maintenance row, and (b) is rejected on priority **1** (correctness), explicitly *"not cost"*. Ruling and rejection of (b) unaffected. | won't fix (frontier) |
| R16 | **CORRECT** | Defect (omitted stale site) | **Accepted as a residual, per owner ruling.** ⚠️ **The reviewer's Round-1 `:7` citation was RIGHT and my Round-1 response wrongly implied otherwise.** The reason my grep could not reproduce it is mechanical: the phrase **wraps across lines 7–8** and the frontmatter carries **no backticks**, so a single-line search for the backticked form cannot match. Recorded so follow-up 5 is not filed without the site. | won't fix (frontier) |
| R17 | **CORRECT** | Defect (mis-qualified measurement) | **Accepted as a residual, per owner ruling.** My R4 correction said *"11 git-tracked files"*; 11 **match**, only **7 are tracked** — the four untracked are the report itself plus `0200`'s `plan.md`, `review.md`, `worklog.md`. **R4's point stands and stands more strongly**; only the qualifier is wrong. | won't fix (frontier) |
| R18 | **CORRECT** | Defect (overstated phrasing) | **Accepted as a residual, per owner ruling.** *"Outside the denied worker's control"* overstates: per **ADR-022** the per-role tool allowlist is relaxed for every role **except** the adversarial reviewer, so a denied worker has `Write`/`Edit`/`Bash`. *"Append-only"* names the hook's intended write, not an enforced property. The load-bearing sense — the write is **not conditional on the denied worker choosing to disclose** — holds, and git-tracking makes tampering leave a diff. | won't fix (frontier) |

**Convergence call — ACT on R13, then CLOSE. I concur with the reviewer and did not run a Round 3.**
The shape is convergence, not looping: **12 → 6 findings, 3 high → 0**, and **no Round-2 finding
re-raises a Round-1 claim**. Loop check run: the *Accepted residuals* section held **one** entry at the
start of this round (R7), and **none of R13–R18 touches it** — R7 is not re-litigated here. I skimmed
`decisions/` for ADR-019, ADR-022, ADR-032, ADR-033 and ADR-037; no *"Re-raise only if"* covers any of
the six. **Nothing suppressed, because there was nothing to suppress.**

**Regression flagged, loudly, and it is mine: R15.** A reviewer figure adopted rather than re-derived,
in the round whose own response claims no measurement is inherited. It reverses no decision and changes
no conclusion, but it is recorded against me, not filed away.

**Nothing here required a code change.** **Zero files under `claude/`, zero under `test/`, zero ADRs
written** (`adr-037` is still the highest; ADR-038 is named as a producer follow-up, not authored).
**1 of 6 applied (R13); 5 accepted as residuals.** §2's Answer and grounds 2–4 were **not touched this
round** — the only report edit is inside §8 follow-up 1.

---

## Accepted residuals (shared, do-not-re-litigate)

<!-- 6 recorded: R7 (Round 1) + R14-R18 (Round 2). Entries are added only once the owner approves treating a finding as a settled tradeoff; all six were owner-ruled 2026-08-05. -->

- **The `0191` ADR-037 driver-side clause — its "will run" reading is contested and stays unsettled (R7).**
  **What:** the report records both readings of *"Never instruct into the territory of a rule in the
  skill a worker **will run**…"* — the reviewer's (it binds the driver at instruction time, so `0195`'s
  attempted invocation satisfies it) and the author's (role selection happens before there is a skill
  the worker will run) — and **settles neither**.
  **Why (structural):** the dispute is **decision-irrelevant twice over**. (1) On *either* reading the
  clause adds **no detection**, which is all §5 needed from it — its own text concedes *"This clause is
  weaker than its worker-side twin"* and *"it reaches no worker."* (2) Per **R5**, measured this turn,
  the clause is **absent from the runtime `.claude/skills/fkit-sprint-ship-loop/SKILL.md` (296 lines)**
  and reaches **no driver at all**, so no reading of it is operative today. Settling the semantics would
  change no conclusion, no recommendation and no follow-up. **Rejected alternative:** picking a winner
  in this report — that would put a contested interpretation of an ADR-037 clause into a report about a
  *different* question, on an axis ADR-037 `:33` explicitly disclaims.
  **Re-raise only if:** (a) a `fkit-claude-init.sh` refresh lands the clause in `.claude/` so it
  actually binds a running driver, **and** (b) a concrete spawn decision turns on which reading holds —
  or (c) ADR-038 is drafted and its author needs the semantics fixed to write the rule. Then it is an
  ADR-037 question, not a `0200` one.

- **The `**Role:**`-line half of the detector is a *presence* signal, not an *attribution* signal (R14).**
  **What:** §5's candidate row (i), the path-coverage table and §7's *"both the hook path and the
  by-hand path leave a durable trace"* stand as written, and the report is **not** edited to soften
  them. What is accepted is the stated limit: a test that asserts a `**Role:**` line is **present**
  cures **absence** (`0167`'s case) and cannot cure **misattribution** — nothing compares the recorded
  role against the role the step's row names, so a line copied from the row passes, and an honest
  mismatched line still needs a human to read it.
  **Why (structural):** the gap is **inherent to a self-reported channel** and cannot be closed by the
  same channel. Verified this turn: `fkit-sprint-ship-loop/SKILL.md`'s Process-review row **already**
  obliges a worklog decision-log entry (*"record `none` if none"*), so (i) adds an obligation to a
  channel that is already prose addressed to the erring actor — the report's own rule *"a detector whose
  output channel is the accused is not a detector"* applies to it as much as to candidate (ii).
  Closing it needs a **comparison** signal (recorded role vs the row's role), which is new design work,
  not a wording change to this report. **Rejected alternative:** down-ranking the pair here — the pair is
  still the only design covering **both** paths in mechanism, and R2's fix is what made that true.
  **Re-raise only if:** the follow-up-3 brief is written **as if presence implied attribution** — i.e.
  it claims the `**Role:**` line *identifies* the worker rather than *records a self-report* — or a
  concrete incident turns on a **mis-stated** role rather than a missing one.

- **The option-(b) surface count is `7 files / 8 sites`, not the `8 / 9` the report states (R15).**
  **What:** the figure appears at §1(b), §7 *"The four mirrors, enumerated"* and §9 *"Also open"*, and
  is **left as written**. Re-derived: `claude/skills-for-role.sh` (1) + the four mirrors its header
  actually declares — `claude/skills/fkit-team/SKILL.md` (**2 sites**), `claude/README.md`,
  `claude/scaffold/CLAUDE.md`, `ai-agents/knowledge-base/architecture.md` (4 files / 5 sites) + S13's
  two genuinely-new files (the skill's own ⛔ banner, `claude/agents/fkit-architect.md`) = **7 / 8**.
  **Why (structural):** ⚠️ **the finding is the propagation, not the arithmetic.** This is the
  **reviewer's own Round-1 R9 figure**, which I **adopted rather than re-derived** in the very round
  whose response states *"no measurement is inherited"* — recorded that way so the failure mode is
  findable, not just the number. It is **decision-irrelevant**: the count feeds only §7's priority-**3**
  maintenance row, and option (b) is rejected on priority **1** (correctness), explicitly *"not cost"* —
  so neither the ruling, the recommendation, nor the rejection of (b) moves by one file. §9's standing
  hedge (*"a second hand count is not a guarantee, only a better estimate"*) already covers the residual
  error bar. **Rejected alternative:** a fourth broad edit pass to correct three cosmetic sites in a
  763-line document — on this task's own evidence that is how precision defects get minted.
  **Re-raise only if:** option (b) is **reopened** and the cost row becomes load-bearing, **or** a
  follow-up (notably follow-up 5's mirror repair) is filed **quoting the `8 / 9` figure as its scope**.

- **`claude/skills/fkit-stateful-review/SKILL.md`'s frontmatter `description` is a stale site and is
  omitted from S13 and follow-up 5 (R16).**
  **What:** line 7's `description` reads *"…which **the coder's fkit-process-stateful-review** reads and
  responds to"* and would go stale under (b). The report records only `:47` and `:132`.
  **Why (structural):** ⚠️ **the reviewer's Round-1 `:7` citation was RIGHT; my Round-1 response
  recorded it as unreproducible.** The cause is mechanical and worth carrying forward more than the
  omission itself: **the phrase wraps across lines 7–8 and the frontmatter carries no backticks**, so a
  single-line grep for the backticked form **cannot** match it. The same wrapping defeated the
  reviewer's own first grep for §2 ground 2's quote. The omission is **contained** — it is a
  completeness gap in a follow-up's file list, on an option the report **rejects**, and the residual
  below names the site so the follow-up cannot ship without it.
  **Re-raise only if:** follow-up 5 (the mirror-checklist repair) is **filed or implemented** — the site
  must be in its scope, and the frontmatter `description` is the **most visible** of the three because
  it is the text the skills listing surfaces. Also re-raise if any future count of the skill's mention
  sites is taken with a **single-line backticked grep**, which will miss it again.

- **The R4 correction's *"11 git-tracked files"* is mis-qualified — 11 match, 7 are tracked (R17).**
  **What:** the qualifier stands as written in the R4 correction. Measured: 11 files match
  `does not own skill` outside `.git`/`.fkit`; **4 are untracked** — this report, and `0200`'s
  `plan.md`, `review.md`, `worklog.md`.
  **Why (structural):** the correction's **point is unaffected and in fact strengthened** — the Round-1
  claim (*"the only hits in the tree are inside `0200`'s own brief and plan"*) was false on either
  count, and 7 tracked files is still an order of magnitude more than 2. Only the adjective is wrong.
  Note the number is **inherently unstable**: it drops as `0200`'s own artifacts are committed, so
  pinning a corrected figure would date faster than leaving the qualifier flagged here.
  **Re-raise only if:** the *"11 git-tracked"* figure is **quoted as evidence** in a follow-up brief or
  an ADR, where "tracked" would carry weight it cannot bear.

- **"Outside the denied worker's control" overstates what the git-tracked denial log enforces (R18).**
  **What:** the phrase stands in §5's Answer, candidate row (v) and §7's file table. Per **ADR-022** the
  per-role **tool** allowlist is relaxed for every role **except** the adversarial reviewer, so a denied
  `@fkit-architect` worker holds `Write`/`Edit`/`Bash` and could alter or truncate a git-tracked log.
  *"Append-only"* names the **hook's intended write**, not an enforced filesystem property.
  **Why (structural):** the **load-bearing** sense is true and is the one the argument uses — the write
  is **not conditional on the denied worker choosing to disclose**, which is exactly the property the
  by-hand path lacks. And the overstatement is **already mitigated by the report's own choice**: because
  the log is **git-tracked** rather than under gitignored `.fkit/`, tampering leaves a diff — which is
  why the owner ruled git-tracked in the first place. Making the phrase absolute-proof would require
  enforcement fkit has no mechanism for. **Rejected alternative:** rewording §5's Answer — a
  behavior-neutral edit to a settled section, at the cost of a fourth broad write pass.
  **Re-raise only if:** follow-up 3 is drafted **quoting that phrase as a design guarantee** — the brief
  must say *"the write does not depend on the worker disclosing"*, **not** *"the worker cannot alter
  it"* — or someone proposes dropping git-tracking (which is the mitigation, not an incidental choice).
