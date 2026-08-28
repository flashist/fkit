# Review — 0272

Task: 0272 — [brief](./brief.md)
File(s) under review: working tree vs `HEAD` — `claude/skills/fkit-review/SKILL.md` · `claude/skills/fkit-stateful-review/SKILL.md` · `claude/skills/fkit-adversarial-review/SKILL.md` · `claude/skills/fkit-process-stateful-review/SKILL.md` · `claude/skills/fkit-task-ship-loop/SKILL.md` · `claude/skills/fkit-sprint-ship-loop/SKILL.md` · `claude/agents/fkit-reviewer.md` · `claude/agents/fkit-adversarial-reviewer.md` · `claude/agents/fkit-coder.md` · `claude/README.md` (+ nine gitignored `.claude/` mirrors)
Status: closed-out — Round 3 (final, per the owner's "Fix all four, then close" ruling). All 19 findings and 4 uncited neighbours dispositioned; every row `✅ done`; nothing blocking.
Coverage: reasoning-only second opinion — **Round 3** (per-round; this replaces Round 2's fact, it does not amend it). Codex ran (`codex-cli 0.145.0`, exit 0) and returned a usable findings list of 4 (step 1). Step 2, both legs: my pass **measured** — `node --test test/dual-home-parity.test.js test/structure-manifest.test.js` → 14 pass / 0 fail, run by me this turn; Codex executed only `cmp`, `shasum -a 256` and `git diff --check`, which inspect file **text**, not behaviour — reading, not measuring (`fkit-review/SKILL.md:110-113`), and its own self-assessment says *"no behavioral tests executed."* Not both → reasoning-only.

> ⭐ **This review is verification step 3 of the plan** — the first real run through the contract this
> diff changes, run under the NEW rules (`fkit-review/SKILL.md` §Coverage states + the `Coverage:`
> ledger-header schema). The followability judgment is recorded at the end of this section.

## Reviewer findings

| #   | Round | Sev    | file:line | Claim |
|-----|-------|--------|-----------|-------|
| R1  | 1     | medium | `claude/skills/fkit-stateful-review/SKILL.md:145-146` | ND3's fixed-slot placement is never stated in the **stateful** skill — the path every sprint-loop review runs. Its Step 5 lists the coverage state inside *"Then: reviewers run + …"*, i.e. beside the findings table, **not** on its own line under the verdict; and its Step 1 pointer (`:96-97`) points at §Coverage states, which contains **only** the definitions — the placement rule lives in `fkit-review` **Step 4**, which no pointer reaches. A stateful reviewer following the file alone never learns the slot exists. |
| R2  | 1     | medium | `claude/skills/fkit-review/SKILL.md:95-99` | Step 1 self-contradicts on *usable findings list + non-zero exit*: the headline test ("did it return a **usable pass** — a findings list") says **not** unavailable, the same sentence lists *"a non-zero exit"* among the things that *"all land here"* (= `Codex unavailable`), and the trailing *"whatever the exit code says"* cuts both ways. Two honest readers get two different states on the same run. Live today. |
| R3  | 1     | medium | `claude/skills/fkit-review/SKILL.md:100-104` | Step 2's execute-test is not decidable on a real `read-only` run — **this run is the specimen.** Its main sentence ("a command it ran, and that command's actual result", bearing on a finding) admits Codex's `git diff --check` and `rg`, which it ran and whose results underpin two of its findings; the ⚠️ exclusion names only *"reading files, grepping, or describing what a test would do"*. `git diff --check` is none of those three literally. I resolved to *reasoning-only* only by reaching **past** step 2 to state 1's definition ("ran the suite, built a fixture, proved a mutation, reproduced a failure"). Sub-case, raised by Codex: a clean pass that ran the whole suite green has **no finding** for the execution to "bear on". |
| R4  | 1     | medium | `claude/skills/fkit-review/SKILL.md:107-110` | The dated note **pre-decides the state and does not carve out step 1**: *"every report currently lands on **reasoning-only second opinion**"* is unconditional. It is the last and most recent thing in the section, so a reviewer whose `codex exec` actually failed can read the note and write *reasoning-only* — reproducing the `0259`/`0264` overstatement in a new form, and skipping the per-run procedure the task exists to install. One clause fixes it (*"every report **whose Codex pass ran (step 1)** currently lands on…"*). |
| R5  | 1     | medium | `claude/skills/fkit-stateful-review/SKILL.md:190-191` vs `:184-185` | The new hard rule requires the coverage state *"in the ledger's `Coverage:` header field"*, but the **Ownership** hard rule two lines above licenses writing *"only **Reviewer findings** (+ shared **Accepted residuals**)"*. Step 0 licenses filling the header at **creation** only. So from **round 2** the reviewer must either violate a hard rule to refresh `Coverage:` or leave it stale. Compounding: `fkit-process-stateful-review` now carries the identical schema line but says nothing about who owns or updates it — the exact fork the lockstep edit was meant to prevent. |
| R6  | 1     | medium | `claude/skills/fkit-review/SKILL.md:81-83` vs `:100-101` | `both reviewers measured` is defined as **both** the Claude reviewer *and* Codex having executed something, but the decision procedure tests **only the Codex output** ("does **its** output show it executed…"). A run where Codex executes and the Claude reviewer only reads returns *"Yes → both reviewers measured"*, which is false by the definition. Unreachable today (Codex cannot execute under `read-only`); **live the moment `0273` lands** — i.e. it defeats the "no re-edit when `0273` lands" property this task exists to hold. |
| R7  | 1     | low    | `claude/skills/fkit-review/SKILL.md:175` | The ND3 example block hardcodes `--sandbox read-only` **and** a blocked `mkdtemp` **and** a CLI version, outside the dated note. Raised independently by Build (worklog Step 2) and by Codex. It constrains no decision, but landing **or reverting** `0273` makes this example state a falsehood and forces a re-edit here — the single property that justifies splitting `0272` from `0273` (*"reverting `0273` touches nothing here"*). Generalising the evidence clause (drop the flag name and version) removes the coupling and keeps the illustration. |
| R8  | 1     | low    | `claude/skills/fkit-review/SKILL.md:105-106` | Step 3 requires the evidence clause to cite *"codex-cli version and exit status"*, but nothing in the procedure captures the version: the invocation at `:62` does not print it, and the Codex self-assessment contract (`fkit-adversarial-review/SKILL.md:114-119`) asks for mode, executed-or-not, and what it got to — **not** the version. Obtaining it is an unprescribed extra step (I ran `codex --version` on my own initiative). The failure mode is a reviewer copying the example's `0.145.0` — a fabricated evidence claim in the one line built to carry evidence. |
| R9  | 1     | low    | `claude/skills/fkit-review/SKILL.md:198-199` | The coverage state is ordered **twice**: once in the ND3 fixed slot (`:167-176`) and again under *"Reviewers run — plus the coverage state … with its evidence clause"*. The plan's A `:143` report-line edit was written before the ND3 block existed as a separate insertion, and inserting the block did not reconcile it. A literal follower emits the state in two places. (Related nit: *"one plain line"* at `:168` reads as a contradiction against the three-line example; the charitable reading — one line **item**, not a box — is right, but the wording invites the argument.) |
| R10 | 1     | low    | `claude/skills/fkit-task-ship-loop/SKILL.md:161` | The review-retry branch is still labelled **"Partial (no Codex)?"** — the old binary word — in the very file whose ND2 edit is justified as *the live behavioural fix*, and which at `:252` now says *"`reasoning-only second opinion` is **NOT** partial coverage"*. The gloss *"(no Codex)"* and the body (*"if still no model-diverse pass"*) key it to `Codex unavailable` correctly, so **no wrong behaviour follows today**; it is a surviving binary label that the ND2 enumeration missed. |
| R11 | 2     | medium | `claude/skills/fkit-review/SKILL.md:66-70` vs `:99-101` | **Raised by both** (Codex X2, labelled high). R2's fix landed in step 1 **only** — the *"Graceful degradation (**mandatory**)"* paragraph one section earlier still routes *"exits nonzero"* and *"times out"* to `Codex unavailable`, and now **names the state outright** (*"This is coverage state **Codex unavailable**"*, `:69-70`). Step 1 says the opposite: *"a genuinely usable pass is **still usable on a non-zero exit** — take it"* (`:100-101`), and qualifies the timeout case as *"a cap/timeout **with no verdict**"* (`:99`). The same two-answers defect R2 was opened for, live, in the paragraph a reviewer reads **first** and which is labelled mandatory. The added ⚠️ at `:70-72` carves out only *ran-but-measured-nothing*, not *usable-output-with-nonzero-exit*. Blast radius is the expensive branch: forces `🟡 Partial review`, fires `[claude-fallback — NOT model-diverse]` (a **false** "no second opinion" claim), and in the ship loop triggers 3 review retries and withholds the close (`fkit-task-ship-loop:161-166`, `:278`, `:304`). |
| R12 | 2     | medium | `claude/skills/fkit-review/SKILL.md:116-119` | **Raised by Codex (X2), verified first-hand.** The dated note still **pre-decides step 2**, and its premise is factually wrong: `--sandbox read-only` blocks **writes**, not **execution**. Evidence this turn — the Round-2 Codex pass executed `/bin/zsh -lc "git diff … nl … sed …"` and it *"succeeded in 2331ms"* under `read-only`. A **write-free behavioural check** (e.g. `node --test`) can therefore run today, so *"the step-2 evidence **cannot appear today**"* is false, and a genuine `both reviewers measured` run would be forced down to `reasoning-only`. R4's fix carved out step 1 explicitly and left step 2 pre-decided. Compounding since R6: step 2 now has **two legs**, and the Claude-side leg demonstrably *can* appear today — mine did — so the flat claim also pulls against step 2's own ⚠️ *"run the relevant check yourself, then re-answer."* |
| R13 | 2     | low    | `claude/skills/fkit-review/SKILL.md:191-203` vs `:179-181` | **Raised by Codex (X3).** The `Codex unavailable` worked layout reproduces the **whole** top-of-report (`# Review — <scope>`, verdict, banner) but **omits** the standalone coverage line that `:179-181` orders *"immediately under the verdict and above the findings"* and that the hard rule at `:235` makes mandatory *"in every report"*. Both the coverage line and the banner are told to occupy the same *"immediately under the verdict"* slot, and the only worked example for the degraded case shows just the banner. A reviewer on a `Codex unavailable` run who follows it emits **no coverage line and no evidence clause**. Low: the verdict line still names the state, so nothing false is reported — the loss is the evidence clause and the fixed field. |
| R14 | 2     | low    | `claude/skills/fkit-process-stateful-review/SKILL.md:80-81` vs `:105-108` | **Raised by Codex (X4).** This round's added ownership line — *"The **ledger header is the reviewer's** … you **never** write that field"* — contradicts the **unchanged** Step 0, which tells the coder that when `review.md` is missing it must *"create it with the schema above: **fill the header**"* — and the schema now contains `Coverage:` (`:61`). On first creation by the coder the two rules cannot both be obeyed: write the field (violating the new rule) or drop it (leaving the schema short, with nothing licensing that). The R5 lockstep edit reconciled the two skills **with each other** but not with its own Step 0. |
| R15 | 2     | low    | `claude/skills/fkit-stateful-review/SKILL.md:156-157` | **Mine.** The new placement sentence miscounts itself: *"State it **exactly once**: in that slot, **and** in the ledger's `Coverage:` header field — never a **third** time beside the findings"* names **two** places while saying "exactly once", and the "third time" clause confirms two are intended. A reader obeying *"exactly once"* literally can satisfy it with the header alone and emit **no coverage line in the report** — the R1 defect returning through the very sentence that fixed it. Same class as R9's *"one plain line"* nit, which was fixed; `fkit-review:211` says "exactly once" correctly, because the ephemeral skill has no ledger header. |
| R16 | 3     | medium | `claude/skills/fkit-process-stateful-review/SKILL.md:235-236` vs `:80-84`, `:109-111`, `:213-214` | **Raised by Codex (X4), verified first-hand. The lockstep asymmetry R5 exists to prevent, one file over.** R5/R14 gave the **coder** required writes to the ledger header — the whole header on first creation (`:80-84`, `:109-111`) — but the file's **hard rule** still reads *"write only your own section (+ shared residuals with approval)"*. The twin's identical hard rule **was** fixed this round (`fkit-stateful-review:195` now enumerates *"the **ledger header** (incl. `Coverage:`, refreshed every round)"*); this one was not. A coder obeying the hard rule declines the header write and creates a ledger with **no `Coverage:` line at all** — defeating R14's own guard (*"an absent field and a stale one are both invisible"*), and leaving a hole the reviewer's rules don't cover (they license *write at creation* and *refresh every round*, not *add a field missing from an existing ledger*). Two further clauses the same hard rule already contradicts, both pre-dating `0272`: `:213-214` (the coder sets header `Status: closed-out`) and `:126-127` (the coder may seed *Reviewer findings* rows). |
| R17 | 3     | low    | `claude/skills/fkit-review/SKILL.md:199` and `:92-93` | **Raised by both** (Codex X3, labelled medium; and my own pass, on the second leg). **N2's neighbour.** N2 widened the *reading* class to cover static analysis, so a Codex pass that ran `tsc --noEmit` / `eslint` / `node --check` now correctly lands on **reasoning-only** — but the worked template still has the reviewer write *"Codex ran … but **executed nothing** — `<why>`"*, which is false in that run and collides with its own `<why>` slot in the same sentence. Second leg, mine: the state-2 **definition** ends *"all execution evidence in this report is the Claude reviewer's"* (`:92-93`) and the template repeats it (*"All execution evidence below is mine"*, `:200`) — false when **neither** pass measured, which step 2's *"Otherwise → reasoning-only"* explicitly admits. Both are the wording that pre-dates the *"bearing on what it reported"* / *"not behaviour"* refinements. State determination is unaffected in both legs; what is emitted is a **false evidence claim in the one line built to carry evidence** — the exact hazard step 3's ⛔ (`:119-120`) names. |
| R18 | 3     | low    | `claude/skills/fkit-review/SKILL.md:117-120` | **Raised by Codex (X1), verified first-hand. R8's fix, one case out.** Step 3 requires the evidence clause to carry *"the codex-cli version (read it from the run, e.g. `codex --version`) **and the exit status**"* for **whichever state you picked** — but in the `Codex unavailable` branch reached by a **failed `command -v codex` probe** (`:41`) there is no run, no version and no `codex exec` exit status, and `:119` ⛔ forbids inventing one. Step 3's *"plus **either** the command Codex ran, **or** the reason it measured nothing"* also serves only states 1–2; the degraded state fits neither leg. Not fatal in practice — the `Codex unavailable` worked example at `:212-214` shows a clause with **no** version and **no** exit status, so a reader who follows the example emits a correct report; the defect is that step 3 and its own worked example disagree, and the literal instruction cannot be satisfied. R8 prescribed *where to read the version from* without carving out the case where there is nothing to read it from. |
| R19 | 3     | low    | `claude/skills/fkit-review/SKILL.md:98` vs `:216` | **Raised by Codex (X2), verified first-hand. N1's adjacent line.** The state-3 definition says *"the `[claude-fallback — NOT model-diverse]` banner fires"*, but the banner this file actually orders emitted is `[NOT model-diverse — INCOMPLETE]` (`:216`). `[claude-fallback — NOT model-diverse]` is a **different artifact in a different procedure** — the adversarial reviewer's self-label for a fallback pass (`fkit-adversarial-review/SKILL.md:61`, `fkit-adversarial-reviewer.md:29,67`) — and `fkit-review`'s Step 1 B runs no Claude-fallback pass at all, so nothing in this procedure ever fires it. A reader asking *"which banner fires on `Codex unavailable`?"* gets two names from one file. No wrong report follows: Step 4 carries the literal banner text. Introduced by this diff (the whole §Coverage states block is new); one line below N1's rewrite, untouched by it. |

### Re-litigates settled decisions (suppressed) — none

No finding in either pass meets an unmet *"Re-raise only if"*. ADR-042 D1's conditions (a fourth
genuinely distinct coverage state appears; the reasoning-only banner is shown to dull attention to the
`[claude-fallback]` banner) are **not** invoked by any finding above. `0327`'s live recurrence of the
"full coverage on a reasoning-only pass" defect is reported in `plan.md` §0 and deliberately left
uncorrected (`0274`'s class, ADR-034) — **not raised here.**

### Disproven — recorded so the coder is not asked to chase them

- **Codex C5 — "the canonical vocabulary is redefined outside §Coverage states, restoring drift risk."**
  **INCORRECT** for `claude/agents/fkit-reviewer.md:89-93`, `claude/skills/fkit-task-ship-loop/SKILL.md:250-254`
  and `claude/skills/fkit-sprint-ship-loop/SKILL.md:353-357`: each is a **pointer** or a **behavioural
  gloss** (what the loop must *not* treat as degraded), not a restatement of the definitions, and each
  was ruled in scope by **ND2**. **PARTIALLY CORRECT** for `claude/README.md:127-130`, the one site that
  restates all three state names with their meanings — but that sentence was ND2-approved, it carries an
  explicit pointer to `§Coverage states`, and it is human documentation, not a procedure an agent
  follows. Same class as ADR-042's own correction note: *"a doc-accuracy obligation, not a drift risk."*
  **Frontier-move — no row, no action recommended.**

### Guarantees checked and holding (evidence, this turn)

| Guarantee | Evidence |
|---|---|
| No `--sandbox` value changed, not one character | All five sites still `read-only` (`fkit-review:62`, `adversarial-review:46`, `stateful-review:96`, `fkit-adversarial-reviewer.md:28`, `README.md:118`). **No added or removed diff line contains `--sandbox` on an invocation** — the three `+` lines mentioning it are prose (`:84` the never-infer rule, `:109` the dated note, `:175` the example / R7). |
| `[NOT model-diverse — INCOMPLETE]` block byte-unchanged | `git show HEAD:…fkit-review/SKILL.md \| sed -n '124,140p'` vs on-disk `:179-195` → **empty diff**. |
| `[claude-fallback — NOT model-diverse]` banner byte-unchanged | `adversarial-review/SKILL.md` `:51-54`, `:56-72`, `:103` → **all identical**; that file's whole diff is one hunk at `@@ -114,2 +114,6 @@`. |
| Fallback label byte-unchanged | `fkit-adversarial-reviewer.md:28-30` **identical**; whole diff is one hunk at `@@ -67 +67,3 @@`. |
| `Coverage:` schema line identical in both ledger skills | `fkit-stateful-review:55` and `fkit-process-stateful-review:61` — byte-identical (`md5` match). Full header blocks match line-for-line. |
| Nine `.claude/` mirrors match `claude/` | `diff -q` on all nine → **OK**, no drift. (`claude/README.md` has no mirror, correctly.) |
| No `review.md` under `ai-agents/tasks/done/` touched by this diff | `0327`'s folder is clean; the four `done/*/review.md` entries in `git status` belong to unrelated in-flight tasks (`0188`, `0229`, `0270`, `0300`). |
| Old binary vocabulary eliminated | `grep -rni 'full coverage\|Codex-coverage\|full vs partial' claude/` → **zero hits**. |
| No manifest regeneration owed | `claude/scaffold/` holds only `AGENTS.md`, `CLAUDE.md`, `ai-agents`, `universal-rules.md` — no `skills/` or `agents/`. |
| Tripwire suites | `node --test test/dual-home-parity.test.js test/structure-manifest.test.js` → **14 pass / 0 fail**, run by me this turn. Full `npm test` **not re-run by me** — the worklog's 782/782 is the coder's measurement, not mine. |
| A reasoning-only pass is not forced to `🟡 Partial review` / "partial" / "degraded" | Confirmed **first-hand**: nothing in the changed contract pushed this review toward `🟡`; no banner fired; both loops' close-posture gates (`task-ship-loop:200,227,302`; `sprint-ship-loop:302,330`) key on *"no Codex pass"* / *"Codex absent after retries"*, not on the word "partial". ⚠️ The one surviving binary **label** is R10. |

### ⭐ Was the new contract followable as written? — **Partially. Four places stopped me.**

This is the deliverable the brief asks verification step 3 for, and I am the first reader who has had
to obey it. Reporting it as an observation, not as extra findings — each maps to a row above.

1. **Step 1 — followable on this run, but only by luck.** Codex returned a findings list at exit 0, so
   the headline test settled it. Had the exit been non-zero **with** a usable list — an ordinary Codex
   outcome — step 1 gives two answers (**R2**).
2. **Step 2 — NOT followable as written. I could not decide from step 2 alone.** Codex ran
   `git diff --check` and `rg` and cited their actual results in support of findings, which satisfies
   step 2's main sentence word for word; the ⚠️ exclusion covers "reading, grepping, describing", and
   `git diff --check` is literally none of those. I reached the right answer by ignoring step 2 and
   applying state 1's **definition** instead (*ran the suite / built a fixture / proved a mutation /
   reproduced a failure* — none happened, and Codex says so). **The tightening is not over-reaching —
   it is load-bearing and must stay**: without it, a `read-only` Codex pass shells out to `grep`
   constantly and step 2 would return *both reviewers measured* on essentially every run, which is the
   original defect. The problem is that the exclusion list is enumerative where the rule needs to be
   principled (**R3**).
3. **Step 3 — not satisfiable from the procedure.** It demands the codex-cli version; nothing in the
   procedure obtains it. I ran `codex --version` myself (**R8**).
4. **Placement — the stateful skill never told me.** I put the coverage state in the fixed slot under
   the verdict because **the caller's spawn prompt told me to**. `fkit-stateful-review` alone would
   have had me put it in the "reviewers run" bullet. A normal review has no such prompt (**R1**).

**What worked, and worked cleanly:** the tone/verdict separation. At no point did *reasoning-only* pull
toward `🟡 Partial review`, fire a banner, or read as a failure — and the `Coverage:` header field made
omitting the state impossible rather than merely discouraged. That is D1 §3 satisfied in practice, on
its first real run, by a reviewer who did not write the text.

---

## Round 2 — 2026-08-28 (independent reviewer, no Round-1 context)

**Verdict: ⚠️ Changes requested — 5 defects (none blocking).** Scope: the Round-1 fixes only, four
files + the four `.claude/` mirrors, **both directions on the changed regions**.

### ⚠️ Loud, up front — three of the five are *fix-induced*, and the pattern is one shape

**Every Round-1 fix landed correctly at the exact line it was aimed at, and three of them left an
unreconciled neighbour.** R2 rewrote step 1 but not the *"Graceful degradation (**mandatory**)"*
paragraph that says the opposite (**R11**). R4 carved step 1 out of the dated note but left step 2
pre-decided by a premise that is simply false (**R12**). R5 reconciled the two ledger skills with each
other but not with `fkit-process-stateful-review`'s own Step 0 (**R14**). The ND3 slot block was
inserted above the `Codex unavailable` worked example without reconciling it (**R13**). This is not a
regression in the fixes — nothing Round 1 fixed came undone, and I re-checked each — it is the same
**adjacent-text** class the round was about, one hop out. Recommend the coder sweep *neighbours*, not
just the cited lines.

### Re-litigates settled decisions (suppressed) — none

No Round-2 finding meets an unmet *"Re-raise only if"*. **ADR-042 D1's conditions are not invoked:**
no finding proposes a fourth coverage state (**R11**/**R12** are contradictions *inside* the three,
not a new one), and none turns on the reasoning-only line dulling the `[claude-fallback]` banner.
None re-raises a Round-1 row: **R11** cites `:66-70`, text R2's fix did not reach and R2's row did not
cite; **R12** cites the note's **step-2** leg, where R4's row and fix were both about **step 1**.
The owner's 2026-08-28 rulings (ND1, ND2, ND3, ND-A, ND-B, R6, R5) were treated as settled and none is
touched. `0327`/`0188`'s live `Coverage: full` recurrences and `test/skill-frontmatter.test.js` were
out of scope and are **not** raised.

### Round-1 fixes re-checked and holding (evidence, this turn)

| Round-1 row | Holds? | Evidence |
|---|---|---|
| **R1** — stateful skill states ND3's slot | ✅ | `fkit-stateful-review:153-157` states the slot itself and points at `fkit-review` Step 4 for format. **It does not restate the definitions** — ND1's one-home rule intact. Proven in use: I placed the state with **no hint from the caller**. |
| **R2** — step 1 gives one answer | ⚠️ **partial** | One answer *within* step 1 (`:97-101`). The file as a whole still gives two — **R11**. |
| **R3** — principled exclusion | ✅ | Decided all four hard cases unaided — see below. |
| **R4** — dated note doesn't pre-decide | ⚠️ **partial** | Step 1 carved out (`:119-121`). Step 2 still pre-decided — **R12**. |
| **R5** — `Coverage:` ownership doesn't fork | ✅ | `fkit-stateful-review:74-78` vs `fkit-process-stateful-review:80-81`: **identical in substance** — reviewer owns the header and `Coverage:`, refreshes every round; `Status:` the named exception, set by the coder at Step 6. `fkit-process-stateful-review:210` does set `Status: closed-out` at Step 6 as claimed. (Seam vs its own Step 0 — **R14**.) |
| **R6** — both-passes test | ✅ | `:102-104` asks it of both; matches the state's definition at `:81-83`. The asymmetric branch is closed by *"run the relevant check yourself, then re-answer"* — **owner-ruled, not raised.** |
| **R7** — example generalised | ✅ | `:186-188` now `<version>` / `<status>` / `<why>`; no `--sandbox`, no `mkdtemp`, no version. |
| **R8** — version obtainable | ✅ | `:111-113` prescribes `codex --version` + ⛔ never copy from an example. I obtained it from the run, not the example: `codex-cli 0.145.0`. |
| **R9** — exactly one ordering | ✅ | `fkit-review`: slot at `:179-189`, ⛔ at `:210-211`. `fkit-stateful-review`: slot at `:153-157`, removed from the "reviewers run" bullet. **One ordering each.** (Wording miscount — **R15**.) |
| **R10** — binary label gone | ✅ | `fkit-task-ship-loop:161-162` now `` `Codex unavailable`? `` with the not-reasoning-only qualifier; consistent with `:229`, `:278`, `:304`, which key on *"no Codex pass"* / *"Codex absent"*. Counter-grep: the only surviving *"partial coverage"* strings (`fkit-review:68`, `fkit-stateful-review:103`) sit **inside the `Codex unavailable` branch**, where the word is correct. |

### Guarantees re-checked (evidence, this turn)

| Guarantee | Evidence |
|---|---|
| No `--sandbox` invocation moved | Five invocation sites unchanged (`fkit-review:62`, `adversarial-review:46`, `stateful-review:101`, `fkit-adversarial-reviewer.md:28`, `README.md:118`). **No added/removed diff line contains `--sandbox` on an invocation** — the two `+` lines are prose (`:85` never-infer, `:117` dated note). R7 removed the third. |
| `[NOT model-diverse — INCOMPLETE]` block byte-unchanged | `git show HEAD:…fkit-review/SKILL.md \| sed -n '124,140p'` vs on-disk `:191-207` → **empty diff**. |
| `[claude-fallback]` banner + fallback label byte-unchanged | `fkit-adversarial-review` whole diff = one hunk `@@ -111,8 +111,12 @@` (banner lives at `:61`); `fkit-adversarial-reviewer.md` whole diff = one hunk `@@ -64,4 +64,6 @@` (label at `:28-29`). Neither hunk reaches them. |
| Nine `.claude/` mirrors match `claude/` | `diff -q` on all six skills + three agents → **OK**, zero drift. |
| Tripwire suites | `node --test test/dual-home-parity.test.js test/structure-manifest.test.js` → **14 pass / 0 fail**, run by me this turn. Full `npm test` **not run by me** — I make no claim about it. |

### ⭐ Is the rewritten contract followable end-to-end? — **Yes on this run. Not yet contradiction-free.**

I am a fresh context and got **no placement hint** from the caller. Walking the files alone:

1. **Placement — solved.** `fkit-stateful-review` Step 5 told me the slot itself. Round 1's reviewer
   needed the spawn prompt; I did not. **R1 is genuinely fixed.**
2. **Step 1 — decided my run.** Usable findings list, exit 0 → not unavailable. But my run is the
   *easy* shape. The shape R2 was opened for — **usable list, non-zero exit** — still gets two answers
   from the file, just from a different paragraph (**R11**).
3. **⭐ Step 2 — decided my own Codex pass unaided. This is the headline.** Codex executed
   `/bin/zsh -lc "git diff … | nl … | sed …"` and it *"succeeded in 2331ms"*. Under the rewritten bar
   that is settled in one read: `git diff` is **named**, `nl`/`sed` are caught by *"whatever tool spells
   it"*, and the principle agrees independently — none of it is *"evidence about **behaviour**"*.
   **I did not reach past step 2 to state 1's definition**, which is exactly what stopped Round 1's
   reviewer. The principled rewrite works. All four hard cases decide: a read-only **test** →
   measuring (*"running the code, or a test or fixture over it"*); a **denied write** → reasoning-only
   (named); **in-head emulation** → reasoning-only (named); `git diff`/`rg` → reading (named + principle).
   **One residual seam, reported as an observation, not a row:** the *static-analysis middle class* —
   a typechecker, linter, or compile (`tsc --noEmit`, `eslint`, `node --check`). It is not `cat`/`grep`,
   but its result is not behaviour either. The **principle** answers it (not behaviour → reading);
   the parenthetical list does not. Narrow, decidable, and not worth a row.
4. **Step 3 — satisfiable now.** It prescribes `codex --version`; I read it from the run, not the
   example, as the new ⛔ demands. **R8 fixed.**
5. **The `Coverage:` header — writable this round.** The ownership block licensed me to refresh it, and
   the per-round clause told me to **rewrite** it to Round 2's fact rather than amend Round 1's. That
   was the exact bind R5 named. **Fixed.**

**What is still not followable:** a reviewer whose Codex pass exits non-zero with usable output
(**R11**), and one deciding whether a write-free behavioural check could have run today (**R12**).
Both are one-clause fixes in text the Round-1 fixes stopped just short of.

## Round 3 — 2026-08-28 (independent reviewer, no placement hint from the caller)

**Verdict: ⚠️ Changes requested — 4 defects (none blocking).**

**Coverage: reasoning-only second opinion** (ADR-042 D1 — the normal state, not a degradation). Codex
ran (`codex-cli 0.145.0`, exit 0) and returned a usable findings list of 4, so step 1 clears. Step 2,
**both legs**: mine **measured** — `node --test test/dual-home-parity.test.js
test/structure-manifest.test.js` → 14 pass / 0 fail, run by me this turn; Codex executed only `cmp`,
`shasum -a 256` and `git diff --check`, which inspect file **text**, not behaviour — reading, not
measuring (`fkit-review:110-113`) — and its own self-assessment says *"no behavioral tests executed."*
Not both → reasoning-only.

Scope: the Round-2 fixes only — `fkit-review`, `fkit-stateful-review`,
`fkit-process-stateful-review` and their three `.claude/` mirrors.

### ⚠️ Loud, up front — the fix-induced-neighbour shape held for a third round, and it is now the *only* shape

**All four Round-3 findings are neighbours of a Round-2 edit.** R16 is R14's neighbour (the ownership
block was reconciled with its own Step 0, the file's **hard rule** was not — while the twin file's
identical hard rule *was* fixed the same round). R17 is N2's (widening the *reading* class made the
reasoning-only template's *"executed nothing"* false in a case the state now admits). R18 is R8's (the
version was made obtainable *from the run*, without carving out the branch where there is no run).
R19 is N1's adjacent line. **Nothing Round 2 fixed came undone — I re-checked each, and all seven hold**
(table below). The severity trend is falling hard: Round 1 ten findings / six medium, Round 2 five /
two medium, Round 3 four / one medium, and three of this round's four change no state determination.

⚠️ **Ledger status reopened.** `Status:` read `closed-out`; with four verified novel defects that was
stale, so I set `in-review` and said why in the header. Header writes are the reviewer's
(`fkit-stateful-review` §Ownership). The *Coder response* section was not touched.

### Re-litigates settled decisions (suppressed) — none

No Round-3 finding meets an unmet *"Re-raise only if"*. **ADR-042 D1's conditions are not invoked**:
none proposes a fourth coverage state, and none turns on the reasoning-only line dulling the
`[claude-fallback]` banner (R19 is about which banner **this file names**, not about attention to it).
None re-raises a prior row: R16 cites the file's **hard rule**, which R14's row and fix never touched;
R17 cites the reasoning-only **template and definition**, where N2's edit was to the step-2
*principle*; R18 cites the **binary-missing** branch, where R8's row and fix were about obtaining a
version from a run that happened; R19 cites `:98`, which N1's rewrite of `:95-97` did not reach.
Settled and untouched: ND1, ND2, ND3, ND-A, ND-B, R6, R5's additive reading, R12's *"fix in `0272`"*,
R13's precedence, and the R13/byte-range acknowledgement. `0327`/`0188`'s `Coverage: full` recurrences
and `test/skill-frontmatter.test.js` were out of scope and are **not** raised.

### Round-2 fixes re-checked and holding (evidence, this turn)

| Round-2 row | Holds? | Evidence |
|---|---|---|
| **R11** — degradation paragraph agrees with step 1 | ✅ **in all four directions** | Walked each: **(a) non-zero exit + usable list** → `:72-73` *"not by itself this branch … take it"*, `:105-106` *"still usable on a non-zero exit"*, `:96-97` *"an error … not by itself enough"* — three paragraphs, one answer, **not** unavailable. **(b) timeout + usable list** → same three, plus `:104`'s *"a cap/timeout **with no verdict**"* which scopes the unavailable case correctly. **(c) exit 0, empty body** → `:66-67` *"empty output"*, `:104` *"even on exit 0"*, `:95-97` *"no usable verdict"* → unavailable; and the sibling reading, a clean *"no significant issues found"*, is named **usable** at `:102-103` and re-based at `:85` (*"a finding, or a clean bill of health"*). **(d) binary missing** → the probe at `:41` routes to degrade, the paragraph names *"codex missing"*, and the state-3 definition leads with *"unreachable"* **outside** the step-1 parenthetical, so it does not depend on a call that never happened. **No paragraph contradicts another in any of the four.** (Its evidence-clause leg is R18.) |
| **R12** — dated note pre-decides nothing | ✅ | `:128-134` walks all three steps, names step 2's **two legs**, states *"your own leg can measure today"*, and demotes the conclusion to *"merely **typical** … Typical is not a determination."* Proven in use: the note pushed me nowhere — I decided step 2 from the two legs. Its factual claim re-verified on disk this turn: `test/prove-red.sh:82` is `work="$(mktemp -d)"`. |
| **R13** — layout works for all three states | ✅ | Slot stated for **every** report at `:191-193`, re-affirmed for the degraded one at `:203-205` (*"still takes the slot … the banner sits **directly beneath it**, both still above the findings"*), and made mandatory at `:252`. Worked examples for reasoning-only (`:195-201`) and `Codex unavailable` (`:207-220`); `both reviewers measured` is covered by the general rule. Banner still lands above the findings table (`:216-224` then *"Then present: … Findings table"*). **The invariant the owner's ruling names holds:** the banner's four lines (`:216-219`) and the *"This flag is load-bearing"* paragraph (`:222-224`) are **byte-identical to `HEAD`** — diffed against `git show HEAD:…` this turn. The intro sentence above them changed, per the R13 ruling; **not reported as a regression, per the owner's acknowledgement.** |
| **N1** — state-3 definition | ✅ **for what it claims** | `:95-97` now reads as one test with a pointer, not four sufficient triggers. (Its next line is R19.) |
| **N2** — static-analysis class decided without re-enumerating | ✅ | `:110-111`'s *"evidence about **behaviour**, not about the source's shape, syntax, or type-correctness"* decides `eslint` (shape), `node --check` (syntax), `tsc --noEmit` (type-correctness) outright; the exclusion list is **unchanged** — I checked, no name was added. Proven in use: it settled Codex's `cmp` / `shasum` / `git diff --check` for me in one read, without reaching past step 2. (Its template leg is R17.) |
| **R14** — creation case obeyable under additive ND-B | ✅ **as between the two rules it names** | `:80-84` and `:109-111` now agree: the coder writing a missing ledger writes the whole header and leaves `Coverage:` as the placeholder. (The file's **hard rule** was not brought along — R16.) |
| **R15** — counting sentence | ✅ | `fkit-stateful-review:156-158` — *"exactly these two places, **both of them** … **Once in each**, and nowhere else … **never the header alone with no line in the report**."* No literal reading satisfies it with the header alone. Hard rule `:202-204` agrees (*"in every report **and** in the ledger's `Coverage:` header field"*). Proven in use: I emitted exactly one line in the report and one header field. |

### Guarantees re-checked (evidence, this turn)

| Guarantee | Evidence |
|---|---|
| No `--sandbox` invocation moved | Five invocation sites unchanged: `fkit-review:62`, `fkit-adversarial-review:46`, `fkit-stateful-review:101`, `fkit-adversarial-reviewer.md:28`, `README.md:118`. `git diff HEAD -- claude/ \| grep -E '^[+-].*--sandbox'` returns **two `+` lines, both prose** — `fkit-review:88` (the never-infer rule) and `:123` (the dated note). No `-` line at all. |
| Banner + load-bearing paragraph byte-identical to `HEAD` | `git show HEAD:…fkit-review/SKILL.md \| sed -n '132,140p'` vs on-disk `:216-224` → identical. (The wider `:124-140` promise is superseded by the owner's R13 ruling and **not** reported.) |
| `.claude/` parity — the three mirrors | `diff -q` on all three → **OK**; independently, Codex's own `shasum -a 256` gave identical hashes for each `claude/` ↔ `.claude/` pair. |
| Shared ledger header schema byte-identical across both ledger skills | The four header lines — `Task:` / `File(s) under review:` / `Status:` / `Coverage:` — `md5` **c736efc4232bb78c8e947245437931a3** in **both** (`fkit-stateful-review:52-55`, `fkit-process-stateful-review:58-61`). The surrounding fenced block differs only in the two role-specific section annotations (`← YOUR section` vs `← REVIEWER-owned…`), which are intentional and pre-date this diff. |
| Tripwire suites | `node --test test/dual-home-parity.test.js test/structure-manifest.test.js` → **14 pass / 0 fail**, run by me this turn. Full `npm test` **not run by me** — I make no claim about it. |

### Verified but not opened as rows (recorded so they are not lost)

- **`claude/agents/fkit-reviewer.md:89-93` — the coder's deliberate non-edit is right. Frontier-move,
  no row.** *"If the Codex pass **fails**, that is `Codex unavailable`"* is vaguer than R11's rewritten
  text, but the same paragraph opens with an explicit pointer — *"exactly one of the three ADR-042
  states (`fkit-review/SKILL.md` §Coverage states)"* — so the single-source rule resolves any tension,
  and it is the **pointer/behavioural-gloss** category ND2 ruled in scope and Round 1 disproved as C5.
  Re-specifying it in the agent file is the definition-drift **ND1 forbids**. If the owner ever wants
  belt-and-braces, the cheapest safe change is to **delete** the *"If the Codex pass fails…"* clause and
  leave the pointer — never to restate the test there. Not recommended now.
- **`test/prove-red.sh:82` is line-coupled to an unrelated in-flight change.** The dated note's `:82`
  is correct against the **working tree**, verified on disk; at `HEAD` the same `mktemp -d` sits at
  `:80`. The note is explicitly a dated environment observation, so this is fragility, not a defect.
- **`.claude/skills/fkit-team/SKILL.md` drifts from `claude/skills/fkit-team/SKILL.md`.**
  **Out of scope** — `git diff --stat HEAD -- claude/skills/fkit-team/` is empty, so `0272` did not
  cause it. Recorded because I checked every mirror this turn and found it.
- **ADR-042 cites `test/prove-red.sh:59` at two sites** (`adr-042-…md:33` and `:313`); the real line is
  `:80` at `HEAD`, `:82` in the working tree. Out of this surface — see the convergence call.

### ⭐ Is the rewritten contract followable end-to-end? — **Yes for a run where Codex comes back usable, which I walked with no hint. Two named gaps remain.**

1. **Placement — solved, second round running.** `fkit-stateful-review` Step 5 gave me the slot and
   R15's sentence gave me **both** places unambiguously. The caller deliberately withheld a hint and I
   needed none.
2. **Step 1 — decided my run in one read, and decides all four hard shapes.** See the R11 row above.
   **This is the first round in which step 1 is contradiction-free in every direction I could construct.**
3. **Step 2 — decided unaided, both legs.** N2's four words settled Codex's `cmp` / `shasum` /
   `git diff --check` without my reaching past step 2 to a state definition.
4. **Step 3 — satisfiable on this run** (`codex --version` → `codex-cli 0.145.0`, exit 0) — **except in
   the binary-missing branch, where it cannot be satisfied as written** (**R18**).
5. **The `Coverage:` header — refreshed, not amended**, per the per-round clause.
6. **The one place the contract is still not followable by the *coder*:** creating a missing ledger,
   where the hard rule forbids the header write the procedure requires (**R16**).

**What is still not followable:** a reviewer whose `codex` binary is absent, writing the mandated
evidence clause (**R18**); and a coder creating a ledger from scratch (**R16**). Both are one-clause
fixes in text the Round-2 fixes stopped just short of.

## Coder response

_(coder-owned — `fkit-process-stateful-review` writes here)_

**Round 1 processed 2026-08-28** under the sprint-loop's standing approval (owner approved `plan.md`
via `AskUserQuestion` in the live driver session; rulings **ND-A**/**R7** and **ND-B**/**R5** relayed
with the spawn and folded in, not re-decided). All ten findings verified against the code first;
severities re-derived, not inherited — **all ten matched the reviewer's label.** Ten of ten `CORRECT`,
all defects, all fixed. No finding suppressed as settled: ADR-042 D1's *"re-raise only if"* (a fourth
distinct coverage state appears; the reasoning-only line dulls attention to the `[claude-fallback]`
banner) is **not met by any row** — R6 is a definition/procedure mismatch inside the three states, not
a fourth one.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT (medium) | Defect | `fkit-stateful-review` Step 5 now states ND3's fixed slot itself — own line under the verdict, above the findings, no box — pointing at `fkit-review` Step 4 for the format, and requires the state **exactly once** (slot + `Coverage:` header, never beside the findings). | ✅ done |
| R2 | CORRECT (medium) | Defect | §Coverage states step 1 rewritten so **usability decides, not the exit code**, in both directions: unusable output lands on `Codex unavailable` **even on exit 0**; a usable pass **stays usable on a non-zero exit** (noted in the evidence clause). "If you cannot tell, it is not usable." Direction fixed by `plan.md` §2's `0112` row. | ✅ done |
| R3 | CORRECT (medium) | Defect | Step 2's exclusion made **principled, not enumerative** — the tightening is kept, as the reviewer required: the bar is now *"running the code, or a test or fixture over it — a command whose result is evidence about **behaviour**"*, and any command that only inspects the source **text** (`cat`, `grep`/`rg`, `git diff`, `ls`) is reading, *"whatever tool spells it"*. `git diff --check` and `rg` — this run's specimen — now decide correctly from step 2 alone. Codex's sub-case (a clean pass has no finding to "bear on") closed by re-basing states 1–2 and step 2 on *"bearing on **what it reported** — a finding, or a clean bill of health"*. | ✅ done |
| R4 | CORRECT (medium) | Defect | Dated note no longer pre-decides: *"every report **whose Codex pass came back usable (step 1)**…"*, plus an explicit ⚠️ that it does **not** pre-decide step 1 — a failed/timed-out/unusable run is still `Codex unavailable`, *"walk the steps every time."* | ✅ done |
| R5 | CORRECT (medium) | Defect | **ND-B applied.** `fkit-stateful-review` gains the **ledger header** to its ownership enumeration (both the Step-0 ownership block and the hard rule): it owns `Coverage:` and **refreshes it every round**, with the per-round semantics stated (a later round never retroactively repairs an earlier one). `fkit-process-stateful-review`'s ownership block gains the agreeing statement, so the two cannot fork. One interpretive call inside the ruling — see the decision log's item 2. | ✅ done |
| R6 | CORRECT (medium) | Defect | Step 2 now asks the execute-test **of both passes — yours and Codex's** (*"Both did → `both reviewers measured`. Otherwise → `reasoning-only second opinion`."*), matching the state's own definition. The asymmetric branch it exposes (Codex executed, the Claude reviewer did not — undecidable today, live once `0273` lands) is closed **without inventing a fourth state**: *"run the relevant check yourself, then re-answer. Never report measurement that neither pass made."* Naming a fourth state would trip ADR-042 D1's re-raise condition and is not mine to decide — see the decision log's item 3. | ✅ done |
| R7 | CORRECT (low) | Defect | **ND-A applied.** The ND3 example's evidence clause is generalised — `--sandbox read-only`, `mkdtemp` and `codex-cli 0.145.0` all gone, replaced by `<version>` / `<status>` / `<why>` placeholders in the file's existing style. The `0272`/`0273` split property is restored: **no `--sandbox` value survives outside the dated note and the four untouched invocation lines**, so landing *or* reverting `0273` forces no re-edit here. Also closes the Build worklog's own flagged Step-2 residual (`fkit-review:175`). | ✅ done |
| R8 | CORRECT (low) | Defect | **Not fully closed by ND-A** — ND-A removes the copy-a-fake-version hazard, but step 3 still demanded a version the procedure never obtained. Own clause added, as the driver asked: step 3 now says *"the codex-cli version (read it from the run, e.g. `codex --version`)"* — prescribing the capture at the one site that demands it — plus ⛔ *"Never copy a version out of an example."* Left the Step-1 run block untouched so no `--sandbox` invocation moves. | ✅ done |
| R9 | CORRECT (low) | Defect | Double ordering reconciled **in favour of ND3's slot** (an owner ruling outranks the plan's pre-ND3 report-line text): the "Reviewers run" bullet now carries ⛔ *"Do not restate the coverage state here — it is already in its fixed slot under the verdict, and it is stated **exactly once**."* Same reconciliation applied to `fkit-stateful-review`'s Step 5 (same shape, same file pair — the lockstep principle). Nit fixed too: *"one plain line"* → *"a plain line item … (the clause may wrap; what "plain" rules out is a banner)"*. | ✅ done |
| R10 | CORRECT (low) | Defect | `fkit-task-ship-loop:161` retry branch relabelled from **"Partial (no Codex)?"** to **"`Codex unavailable`?"**, with *"(that state only — **not** `reasoning-only second opinion`; `fkit-review/SKILL.md` §Coverage states)"*. Behaviour unchanged, as the finding said. Counter-grep confirms it was the **last** surviving unqualified binary label of this class in `claude/`. | ✅ done |
| C5 | INCORRECT | Frontier-move | Codex's *"canonical vocabulary redefined outside §Coverage states"* — disproven by the reviewer and re-checked by me: `claude/README.md:127-130` is ND2-approved human documentation carrying an explicit pointer, not a procedure. No row was opened; recorded here only so a later round does not re-chase it. | disproven |
| V1 | CORRECT (low-medium) | Defect (worklog fact) | Not a ledger row — a **Verify-step** finding relayed with the spawn. The Build worklog's Step-6 honesty statement (*"No test in this repo reads any `SKILL.md` or agent-file body"*) is **false as written**; verified myself: `test/structure-repair.test.js:287-296` reads `claude/skills/fkit-heal/SKILL.md`'s **body** and asserts on seven prose patterns. Corrected **in the worklog only** — the plan quote is left verbatim with the correction beneath it, since `plan.md` is untouchable. The material conclusion survives (nothing tests the five reviewer files or this contract) and `0152`/`0154`'s scope claim is unchanged. | ✅ done |

**Round 2 processed 2026-08-28** — same standing approval, same constraints. Five novel findings
(R11–R15), **all verified `CORRECT`, all defects, all fixed.** Severities re-derived from the traced
blast radius: **all five matched the reviewer's label** (R11 medium — I traced the ship-loop cost and
agree it is the one with teeth; Codex had it as high, and I did **not** inherit that either).
Loop-check: **nothing suppressed** — R11 cites `:66-70`, text R2's fix never reached and R2's row never
cited; R12 cites the note's **step-2** leg where R4's row and fix were both **step 1**. Neither
re-raises a Round-1 row, and ADR-042 D1's *"re-raise only if"* is untouched: R11/R12 are contradictions
**inside** the three states, not a fourth one. Owner rulings on **R12** and **R13** folded in verbatim,
not re-decided.

⚠️ **The reviewer's pattern call was right, and it went one hop further than the five rows.** Sweeping
the neighbours of every clause I touched turned up **two more same-class sites** the ledger does not
cite; both are fixed and listed below as N1/N2. That is the fix-induced-neighbour shape caught at its
own game.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R11 | CORRECT (medium) | Defect | The *"Graceful degradation (**mandatory**)"* paragraph no longer enumerates its own trigger. It now fires on the Codex pass coming back **unusable** and says outright that **§Coverage states step 1 is the test for it, not this paragraph**, with a new ⚠️: *"A non-zero exit or a timeout is not by itself this branch. If the output is a genuinely usable pass, take it."* The `Codex unavailable` branch behaviour, the loud flag and the verdict carry are **unchanged** — only the entry condition is reconciled with step 1. Direction fixed by `plan.md` §2's `0112` row (*keyed to a usable pass, not to exit 0*), so this restores the plan's own rule rather than choosing between two readings. | ✅ done |
| R12 | CORRECT (medium) | Defect | **Owner ruling applied** (*"Fix in 0272"*). The dated note's premise was factually false and is corrected in place — the sanctioned home for sandbox facts, so no new `--sandbox` coupling: *"That blocks **writes** … **but not execution**: Codex can and does run shell commands under it (measured 2026-08-28)."* The false *"the step-2 evidence cannot appear today"* is **gone**, replaced by what is actually true — a **write-free** behavioural check can run, while anything needing a temp dir cannot (`test/prove-red.sh:82` opens with `mktemp -d`, **verified on disk this round**, not taken from ADR-042, which cites the pre-drift `:59`). The note now pre-decides **nothing**: it walks all three steps, names step 2's **two legs**, states that **your own leg can measure today**, and demotes the old conclusion to *"what is merely typical … Typical is not a determination."* ⛔ No `--sandbox` invocation touched. | ✅ done |
| R13 | CORRECT (low) | Defect | **Owner ruling applied** (*"Coverage line first, banner beneath"*). The `Codex unavailable` worked layout now shows the mandatory coverage line in the slot directly under the verdict, with the banner **directly beneath it**, both above the findings — and the intro sentence rewritten to say so, since it previously handed the slot to the banner alone. ⛔ **The banner's own four lines are byte-identical to `HEAD`**, proved by `diff` this round, as is the *"This flag is load-bearing"* paragraph beneath it. ⚠️ **This ruling necessarily puts a hunk in a range the plan promised byte-unchanged** — see the worklog's decision-log item 3; it is reported, not glossed. | ✅ done |
| R14 | CORRECT (low) | Defect | The new ownership line no longer contradicts its own unchanged Step 0. It now reads *"you never **overwrite** that field"* with **two** named exceptions — `Status:` at Step 6, and **first creation**, where the coder writing a missing ledger writes the whole header and leaves `Coverage:` as the schema placeholder for the reviewer's first pass. Step 0's *"fill the header"* gained the matching clause, so both rules are obeyable together. Follows the owner's **additive** reading of ND-B, as instructed. Plus a guard the seam invited: *"Never delete the line; an absent field and a stale one are both invisible."* | ✅ done |
| R15 | CORRECT (low) | Defect | The sentence no longer miscounts itself: *"State it in **exactly these two places, both of them**: that slot in the report, **and** the ledger's `Coverage:` header field. **Once in each, and nowhere else**"* — plus the failure mode named explicitly, *"never the header alone with no line in the report,"* which is the R1 regression the old wording licensed. `fkit-review:211`'s *"exactly once"* is **correct as it stands** and was left alone: the ephemeral skill has no ledger header, so one place is genuinely one. | ✅ done |
| N1 | — (neighbour, uncited) | Defect | **Found by the ordered sweep, not in the ledger.** `fkit-review`'s **state-3 definition** carried R11's defect one line out: *"Codex was unreachable, errored, timed out, or returned nothing usable"* reads as four independently sufficient triggers. Now: *"unreachable, or its pass came back **unusable**: an error, a timeout, or output carrying no usable verdict (**step 1 below is the test** — an error or a timeout is not by itself enough)."* Same defect, same fix, one line away from the cited one — exactly the pattern the reviewer flagged. | ✅ done |
| N2 | — (free, observation-driven) | Defect (latent) | The reviewer's **static-analysis middle class** (`tsc --noEmit`, a linter, `node --check`), reported as *"not worth a row, chase only if free"*. Taken **only** in the free form: the **principle** gained four words — *"evidence about **behaviour**, not about the source's shape, syntax, or type-correctness"* — which decides the class outright. ⛔ **Nothing was added to the exclusion list**: lengthening the enumeration is precisely the shape R3 was opened to remove, so the list is untouched. | ✅ done |

**Round 3 processed 2026-08-28 — the final round.** Owner ruling, live via `AskUserQuestion`:
**"Fix all four, then close (Recommended)."** Four novel findings (R16–R19), **all verified `CORRECT`,
all defects, all fixed**, plus two more same-class neighbours the ordered sweep turned up (N3, N4).
Severities re-derived: all four matched the reviewer's label, and I did **not** inherit Codex's
`medium` on R17 (low is right — no wrong state, only a false clause). Loop-check: nothing suppressed;
no earlier row re-raised; ADR-042 D1's *"re-raise only if"* untouched — R17/R19 are wording defects
**inside** the three states, R16/R18 are ownership and evidence-clause gaps.

Per the ruling this closes **regardless of what the sweep turned up**; N3/N4 are fixed and recorded,
and anything a further pass might find is recorded in `worklog.md` rather than opening a Round 4.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R16 | CORRECT (medium) | Defect | The lockstep asymmetry closed. `fkit-process-stateful-review`'s hard rule no longer says *"write only your own section"*; it now **enumerates** what the coder may write — *Coder response*; shared residuals with approval; the header's `Status:` at Step 6 **plus the whole header on first creation** (leaving `Coverage:` as its placeholder); and seeding *Reviewer findings* rows when findings arrived as pasted text — with **`Coverage:` is the reviewer's — never overwrite it** stated outright. This reconciles the rule with `:80-84`, `:109-111`, `:213-214` **and** `:126-127`, the two pre-`0272` contradictions the reviewer flagged in passing. **The hole it named is closed on the reviewer's side too**: `fkit-stateful-review`'s ownership now licenses *"**add the field if an existing ledger is missing it**"*, which neither *write at creation* nor *refresh every round* covered. | ✅ done |
| R17 | CORRECT (low) | Defect | Both legs. **Leg 1 (definition):** state 2 now reads *"**measured nothing** bearing on what it reported. It may have read, grepped, or type-checked; none of that is measurement"* — which also makes N2's static-analysis routing explicit in the definition, not only in step 2. **Leg 2 (the ADR clause):** *"all execution evidence in this report is the Claude reviewer's"* → *"**Any** execution evidence in this report is the Claude reviewer's — **and there may be none, if neither pass measured**"*, which keeps ADR-042 D1's clause intact while making it true in the case step 2 admits. Template updated to match (*"measured nothing"*, *"Any execution evidence below is mine"*). Severity **low**, not Codex's medium: the state determination never changed — what changed is a false clause in the evidence line. | ✅ done |
| R18 | CORRECT (low) | Defect | Step 3 gained the missing case: *"⚠️ **When there was no run at all** — the `command -v codex` probe found nothing (Step 1) — there is no version and no exit status to cite. Say **what was missing and why**, and cite neither; the worked example for that state does exactly this."* Step 3 and its own worked example now agree, and the ⛔ is widened to *"Never copy a version out of an example, **and never invent one**"* — closing the escape the literal-but-unsatisfiable demand created. | ✅ done |
| R19 | CORRECT (low) | Defect | State 3 now names the banner **this** file emits — *"this report's `[NOT model-diverse — INCOMPLETE]` banner fires (Step 4)"* — and keeps the other name straight rather than deleting it, since §Coverage states is the shared single source: *"⚠️ Do not confuse it with `[claude-fallback — NOT model-diverse]` — that is the **adversarial reviewer's own** self-label for a pass it ran itself instead of Codex; this procedure never fires it."* Two names, two owners, one file, no ambiguity. ⛔ Neither banner's literal text was touched. | ✅ done |
| N3 | — (neighbour, uncited) | Defect | **Found by the ordered template sweep.** R18's defect had a twin in the `Codex unavailable` **worked template**, which asserted *"`codex exec` returned <…>"* — false in the very branch R18 carved out, where `codex exec` never ran. Now: *"<`codex exec` returned no usable pass — an error / nothing / no verdict \| `codex` was not installed, so nothing ran>"*. Step 3, its carve-out, and the template it points at now agree. | ✅ done |
| N4 | — (neighbour, uncited) | Defect | **Found by the same sweep, outside the two named targets.** `claude/README.md:129` carried R17 leg 1's false wording (*"Codex ran and reasoned but executed nothing"*). One word: *"executed"* → *"**measured**"*. ND2-approved human documentation, so the change is doc-accuracy only, and it now matches the rule it points at. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)

_(none recorded, and none owed.)_ The two dispositions this round waited on were both ruled **fix**,
not accept, by the owner via `AskUserQuestion` in the live driver session, 2026-08-28: **ND-A** →
*"Fix — generalise the example"* (R7) and **ND-B** → *"Reviewer-only — add the header to its
ownership"* (R5). Both are applied above, so neither becomes a settled tradeoff. No other Round-1
finding was classified frontier-move — the only frontier item, Codex's C5, was **disproven**, and a
disproven claim is not a residual.
