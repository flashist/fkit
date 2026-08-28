# Worklog — 0272: replace the review coverage binary with ADR-042's three-state vocabulary

Build step of `/fkit-sprint-ship-loop`, Sprint 6. Plan approved by the owner via `AskUserQuestion` in
the live driver session, 2026-08-28 (`plan.md`, blob `e82d6e307ddd54a20d5320e22b900f9230396f2f`,
verified at step 0 before any edit).

## Change surface

Ten files under `claude/` (canonical), plus nine mirrored copies under the gitignored `.claude/`.

| # | File | Sites | Plan ref |
|---|---|---|---|
| 1 | `claude/skills/fkit-review/SKILL.md` | Codex-prompt self-assessment line; degradation-contract pointer; **new `## Coverage states` section**; verdict-vocabulary clarifier; ND3 fixed-slot block; "Reviewers run" report line; new hard rule | A |
| 2 | `claude/skills/fkit-stateful-review/SKILL.md` | ledger-header `Coverage:` schema line; Step 1 pointer; verdict clarifier; report line; new hard rule | B |
| 3 | `claude/skills/fkit-adversarial-review/SKILL.md` | self-assessment now states three things incl. executed-or-not | C |
| 4 | `claude/agents/fkit-adversarial-reviewer.md` | mirrored self-assessment | D |
| 5 | `claude/agents/fkit-reviewer.md` | "Degrade gracefully" rule now names all three states | E |
| 6 | `claude/skills/fkit-task-ship-loop/SKILL.md` | evidence-packet coverage line (the live behavioural fix) | F |
| 7 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` | progress-reporting gloss + the "flag any task shipped" line | F |
| 8 | `claude/README.md` | one paragraph naming the three states | F |
| 9 | `claude/agents/fkit-coder.md` | relay-the-coverage-state instruction | F |
| 10 | `claude/skills/fkit-process-stateful-review/SKILL.md` | shared ledger schema gains the same `Coverage:` line (lockstep with #2) | F / ND2 |

**Line-number drift:** none. Every site sat at the plan's 2026-08-28 line number, including
`fkit-sprint-ship-loop/SKILL.md:353` and `:355-356` (re-measured before editing, as instructed).
Every site's existing text matched the plan's quote exactly; no site was stopped on.

**`.claude/` refresh route — file copy, not `fkit-claude-init.sh`.** Copied the nine changed
skill/agent files directly (`cp claude/... .claude/...`) and proved parity with `diff -q` on each —
all nine identical. Reason: `claude/fkit-claude-init.sh .` writes outside `.claude/` (it touches
`.fkit/interview` and merges rules into `CLAUDE.md`/`AGENTS.md`), which an earlier coder this sprint
judged unsafe to run mid-task; the copy route achieves the same refresh for exactly the changed files
and touches nothing else. `claude/README.md` has no `.claude/` counterpart, so it needs no copy.

**No manifest regeneration needed** — verified: `claude/scaffold/` contains only `AGENTS.md`,
`CLAUDE.md`, `ai-agents`, `universal-rules.md`. No `skills/` or `agents/`, so no touched file is in
the manifest path set. (This is the plan's §3 claim, re-checked on disk.)

## Verification — the plan's §5 steps 1–6

**Step 1 — every site states the three states; no unqualified binary survives.** ✅
`grep -rn 'reasoning-only\|both reviewers measured\|Codex unavailable' claude/skills/ claude/agents/
claude/README.md` returns **25 lines across 8 files** (all ten sites represented; `fkit-review`,
`fkit-stateful-review`, `fkit-adversarial-review`, `fkit-sprint-ship-loop`, `fkit-task-ship-loop`,
`fkit-reviewer.md`, `fkit-coder.md`, `README.md`).

Counter-grep for a surviving binary — `grep -rn 'Codex-coverage\|full vs partial\|partial coverage'` —
returns **3 lines, none of them an unqualified binary**:
- `fkit-review/SKILL.md:68` and `fkit-stateful-review/SKILL.md:98` — the **`Codex unavailable`**
  degradation contract, where "partial coverage" is the *correct* term; both now carry the pointer to
  §Coverage states immediately after.
- `fkit-task-ship-loop/SKILL.md:252` — the explicit **negation** (*"`reasoning-only second opinion` is
  NOT partial coverage"*).
- `Codex-coverage` and `full vs partial`: **zero hits.** Both eliminated.

**Step 2 — per-run form present, by-construction form absent.** ✅ with one flagged residual.
The operative rule (§Coverage states steps 1–3, `fkit-review/SKILL.md:95-106`) names **no sandbox
value** — it keys on "a usable pass" and on "a command it ran, and that command's actual result", and
opens *"Decide which applies PER RUN, from the Codex output — never from the sandbox flag."*

`read-only` occurrences in the five review files, all accounted for:
- **untouched `--sandbox` invocation lines** — `fkit-review:62`, `adversarial-review:46`,
  `stateful-review:96`, `fkit-adversarial-reviewer.md:28`;
- **the dated-note block** — `fkit-review:109`;
- **unrelated** ("read-only `/fkit-query`", "read the wiki (read-only)") — `adversarial-review:124`,
  `fkit-adversarial-reviewer.md:30`, `fkit-reviewer.md:43`;
- ⚠️ **one occurrence outside the dated note: `fkit-review:175`** — inside the ND3 fixed-slot
  *illustrative example*, which the plan's §1.3 supplies verbatim (*"its `--sandbox read-only` harness
  blocked `mkdtemp`"*). It is a sample report, not the rule, and constrains nothing — but it is a
  third place `read-only` appears, where the plan's step-2 test says "only inside the dated-note block
  or on an untouched `--sandbox` line". **Landed as the plan wrote it; flagged for the review to
  disposition** (harmless, or fold the example into the dated note / generalise its wording).

**Step 3 — one real review through the changed contract.** ⏭️ **Not run by me, and not runnable by
me.** `fkit-stateful-review` is the reviewer's skill and the role lock forbids the coder from running
it. Per the plan, **the driver's Review step over this very diff IS that run** — its coverage line and
verdict line become the evidence for this step. **Left open for the review; do not read this worklog
as having satisfied it.**

**Step 4 — the `Codex unavailable` path still behaves.**
- **(a) byte-identity proof — ✅ done.** `git show HEAD:<file> | sed -n '<range>p'` diffed against the
  same text on disk, empty diff in every case:
  - `fkit-review/SKILL.md` `[NOT model-diverse — INCOMPLETE]` block — old `:124-140` vs new
    `:179-195` (shifted by the inserted section, **content identical byte-for-byte**);
  - `fkit-adversarial-review/SKILL.md` `:51-54`, `:56-72` (the `[claude-fallback — NOT model-diverse]`
    banner), `:103` — **all identical**, and the file's whole `git diff` touches only `:111-116`;
  - `fkit-adversarial-reviewer.md:29` — **identical**; that file's whole `git diff` touches only
    `:64-67`.
- **(b) forced-failure run with `codex` masked off `PATH`** — ⛔ **NOT run.** No claim is made that the
  banner and `🟡` verdict were observed firing. The plan permits skipping (b); this worklog does not
  infer it from (a).

**Step 5 — `npm test`.** See §Test results below.

**Step 6 — the honest coverage limit.** Verbatim, from the plan:

> No test in this repo reads any `SKILL.md` or agent-file body; `test/skill-frontmatter.test.js` states
> this about itself. This contract is prose, `npm test` green proves nothing about it, and building
> such a test is `0152`/`0154`'s scope.

**Plus:** no commit, no push, no task-file move, no `plan.md` edit, no `ai-agents/wiki-vault/` write,
no devDependency added, and **no `review.md` under `ai-agents/tasks/done/` touched** — `0327`'s live
recurrence of the "full coverage on a reasoning-only pass" defect is reported in the plan's §0 and
**stays uncorrected**, as instructed.

## Test results

**`npm test` — run AFTER the final code change** (a first run was started while the last edit was
still in flight, so it was discarded and re-run; only this measurement is claimed):

```
ℹ tests 782
ℹ suites 24
ℹ pass 782
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 79866.396625
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.

[exited with code 0]
```

**Against the plan's baseline of 782 pass / 0 fail / 24 suites: identical — 782/782, 0 fail, 24
suites, exit 0.** No test added, none removed, none newly skipped. `test/prove-red.sh` — unmeasured at
plan time — is measured here: **the hard gate passes, all 26 mutations red their named assertion.**

Suites the plan named as tripwires for a careless shape: `test/dual-home-parity.test.js` and
`test/structure-manifest.test.js` — both green, and neither has a file under the change surface
(confirmed: `claude/scaffold/` holds no `skills/` or `agents/`).

⚠️ **What this green run does NOT prove:** anything about this contract. See Step 6.

## Decision log — fixes applied and judgment calls made unattended

Per ADR-019's audit obligation, carried to the sprint-loop Build worker by ADR-032.

1. **Obvious-winner call — where ND3's fixed slot gets written down.** The plan's §1.3 and owner
   ruling **ND3** fix the coverage state's placement ("its own line immediately under the decision
   verdict, above the findings, no box") and supply the exact format block. The plan's §1.2 **A** table
   does not list a separate row for writing that placement into `fkit-review`'s Step 4. Two readings
   were possible: (i) the A `:143` "Reviewers run + the coverage state" edit alone realises it, or (ii)
   the placement must be stated explicitly or no reviewer will follow it. **Took (ii)**: inserted the
   §1.3 format block verbatim into Step 4, immediately after the verdict-vocabulary list and
   **before** the protected `[NOT model-diverse — INCOMPLETE]` block (which stayed byte-unchanged).
   **Why it qualified:** inside the approved plan (it *is* §1.3's text and ND3's ruling), localized to
   one insertion, and the alternative silently drops an explicit owner ruling. **Reversible in one
   deletion; flagged here for the review to overrule if it prefers reading (i).**
2. **No other unattended call.** Every other edit is the plan's before/after text applied at its
   measured line. No fix outside the plan, no scope widening, no severity dispute.

## Known gaps, stated not closed

- **No test covers this contract.** See Step 6 above. `npm test` green proves only that nothing else
  broke.
- **Step 3 unrun by design** (role lock) — the driver's Review step is the evidence.
- **Step 4(b) unrun** — no forced-failure observation claimed.
- **The `fkit-review:175` `read-only` mention** — see Step 2's flag.

---

## Process-review — Round 1 (2026-08-28)

Sprint-loop **Process-review worker**, under the standing approval of the owner-approved `plan.md`
(re-verified at step 0: `git hash-object plan.md` → `e82d6e307ddd54a20d5320e22b900f9230396f2f`, matching
the driver's declared hash — the plan was carried **by reference only**, and the hash is what makes
that carry honest). Owner rulings **ND-A** (R7) and **ND-B** (R5), given live via `AskUserQuestion`
2026-08-28, were folded in as instructed and **not re-decided**.

**Disposition: 10 of 10 findings `CORRECT`, all defects, all fixed.** Severities re-derived from the
traced blast radius rather than inherited — **all ten matched the reviewer's label**, so nothing was
re-graded. Nothing suppressed as settled: ADR-042 D1's *"re-raise only if"* (a fourth genuinely
distinct coverage state; the reasoning-only line dulling the `[claude-fallback]` banner) is **not met
by any row**. Codex's **C5** stays **disproven** (re-checked: `claude/README.md:127-130` is
ND2-approved human documentation with a pointer, not a procedure) — recorded in the ledger so a later
round does not re-chase it.

### What changed, by file

| File | Findings | Change |
|---|---|---|
| `claude/skills/fkit-review/SKILL.md` | R2, R3, R4, R6, R7, R8, R9 | §Coverage states decision procedure rewritten (steps 1–3) + both state definitions re-based on *"what it reported"*; dated note no longer pre-decides step 1; ND3 example generalised; report line de-duplicated |
| `claude/skills/fkit-stateful-review/SKILL.md` | R1, R5, R9 | Step 5 now states ND3's fixed slot itself; ledger header added to the reviewer's ownership (block + hard rule), `Coverage:` refreshed every round |
| `claude/skills/fkit-process-stateful-review/SKILL.md` | R5 | matching ownership statement, so the two sides cannot fork |
| `claude/skills/fkit-task-ship-loop/SKILL.md` | R10 | retry branch relabelled `Codex unavailable?` |
| `worklog.md` (this file) | V1 | Step-6 honesty statement corrected — below |

### Re-verification after the fixes

- **`npm test` → exit 0.** `test/prove-red.sh` hard gate **PASSED** — real + unmutated copy green,
  all 26 mutations red their **named** assertion. Unit counts, measured separately after the last
  edit: **`tests 782 · suites 24 · pass 782 · fail 0 · skipped 0 · todo 0`**, `duration_ms 83292.7`.
  **Identical to the plan's baseline of 782/782/24.** No test added, removed, or newly skipped.
  ⚠️ **This proves only that nothing else broke** — see the corrected Step 6 below.
- **`.claude/` parity re-proved.** The four re-edited files `cp`'d across; `diff -q` on **all nine**
  mirrored files → identical, no drift. (`claude/README.md` has no mirror, correctly.)
- **The four byte-unchanged ranges still show no hunk** — proved again this round, not inherited:
  `fkit-review/SKILL.md`'s `[NOT model-diverse — INCOMPLETE]` block (HEAD `:124-140` vs on-disk
  `:191-207`) → **empty diff**; `fkit-adversarial-review/SKILL.md` `:51-72` and `:103` →
  **byte-identical**, that file's whole diff is still the single hunk `@@ -114,2 +114,6 @@`;
  `fkit-adversarial-reviewer.md:28-30` → **byte-identical**, whole diff still `@@ -67 +67,3 @@`.
- **No `--sandbox` invocation moved or changed.** All four sites still `--sandbox read-only`
  (`fkit-review:62`, `adversarial-review:46`, `stateful-review:101`, `fkit-adversarial-reviewer.md:28`;
  plus `README.md:118`). `git diff` on `claude/` contains **no added or removed line touching an
  invocation** — the only two `+` lines mentioning the flag are prose: the never-infer rule (`:85`)
  and the dated note (`:117`).
- **Shared ledger header schema still byte-identical** across `fkit-stateful-review` and
  `fkit-process-stateful-review` (`Task:` / `Status:` / `Coverage:` lines diff clean). The R5 edit
  changed ownership prose, not the schema block.
- **R7 closed the plan's own Step-2 residual.** The Build worklog flagged `fkit-review:175` as a third
  place `read-only` appeared (inside the ND3 example). It is gone: `read-only` now occurs in these
  files **only** on the four untouched invocation lines, in the dated note, in the never-infer rule,
  and in unrelated senses ("read-only `/fkit-query`"). The plan's §5 step-2 test now passes with **no
  flagged residual**, which is also the property that keeps `0272` decoupled from `0273`.
- **R10's claim of being the last one re-checked**: `grep -rn "artial" claude/skills/ claude/agents/
  claude/README.md` (excluding `PARTIALLY CORRECT`) → every remaining hit is either the `🟡 Partial
  review` **verdict** token (correctly keyed to `Codex unavailable`), an explicit negation, or an
  unrelated sense (`fkit-wiki-*`, `fkit-heal`). **No unqualified coverage binary survives in `claude/`.**

### Correction to Step 6 — V1 (verified myself before writing it)

The Step-6 statement above quotes `plan.md` **verbatim**, and the quote stands as what the plan says
(`plan.md` is untouchable). ⚠️ **The plan's sentence is false as written, and the overstatement is
corrected here** — an honesty statement is the worst place to carry one:

> **Corrected:** No test in this repo reads the body of any of **these** files, and only one test
> anywhere reads a `SKILL.md` body — `test/structure-repair.test.js:287`, for `fkit-heal`.

**Verified on disk this round:** `test/structure-repair.test.js:287-296` reads
`claude/skills/fkit-heal/SKILL.md` (the `SKILL` constant, `:31`) and asserts **seven prose patterns**
in its **body**, under the section header *"§6.5 the consent shape (prose is load-bearing: the skill IS
the consent procedure)"*. It is the only such test: no other test reads a `SKILL.md` body, and no test
reads an agent-file body at all (`test/skill-frontmatter.test.js` reads frontmatter only).

**The material conclusion survives unchanged:** nothing tests the five reviewer files, and nothing
tests this contract, so `npm test` green still proves nothing about it. Two things worth carrying
forward, stated rather than acted on: (a) `test/skill-frontmatter.test.js:22-24`'s own header carries
the **same** overstatement (*"A skill's BODY … remains untested by anything in this repo"*) — **not
corrected here**, it is outside this task's edit surface; (b) the `fkit-heal` test is a live
**precedent that a body-prose test is buildable** within ADR-014's zero-devDeps policy.
⛔ **`0152`/`0154`'s scope claim is unchanged** — building such a test remains theirs, not this task's.

### Reported, not acted on — a **third** live specimen of the ADR-042 D1 §2 defect

`ai-agents/tasks/done/0188-repair-the-five-live-ownership-fact-defects/review.md:27` reads
*"Reviewers run: own pass + Codex (`codex exec --sandbox read-only`, exit 0). **Coverage: full.**"* —
`Coverage: full` claimed on a `read-only`, therefore reasoning-only, pass. That is the **third**
recurrence after `0327` (recorded in `plan.md` §0) and `0259`/`0264` (recorded in ADR-042's own
Consequences).

⛔ **Not edited, and not to be edited by this task**: dirty before this task began, `0274`'s class, and
per **ADR-034** a review ledger closes on the work product. **Both `0327` and `0188` are recorded here
together so the producer can route them as one call** (ADR-033) — this task does not decide it.

## Decision log — Process-review round 1 (fixes applied and judgment calls made unattended)

Per ADR-019's audit obligation, carried to the sprint-loop Process-review worker by ADR-032. Every
fix below was applied **without asking**, under the standing approval; each is recorded with the
finding it answers, what changed, and why it qualified.

1. **R2, R4, R7, R8, R9, R10 — verified-`CORRECT`, mechanical/localized, inside the approved plan.**
   Each is a single-site wording repair to text the plan supplies, restoring the plan's own stated
   intent where the landed wording missed it: R2's usable-pass test is resolved in the direction
   `plan.md` §2's `0112` row already fixed (*"keyed to a usable pass, not to exit 0"*); R4 keeps the
   dated note an observation, which §1.1 says it is; R7 is **owner ruling ND-A applied verbatim**;
   R8 prescribes the version capture at the one site that demands it, the same class as the plan's
   own *"the one edit that makes the per-run rule operable"*; R9 reconciles a duplicate the ND3
   insertion created; R10 is a label swap with no behavioural change. **No judgment call in any.**
2. **R5 — ND-B applied, with one interpretive choice inside the ruling. Flagged, reversible.**
   ND-B says *"add the header to its ownership"* for the reviewer. Read as **exclusive** ownership of
   the whole header, it would collide with an **existing, licensed** coder write: both
   `fkit-process-stateful-review` Step 6 and `fkit-stateful-review` Step 6 have the coder/reviewer set
   `Status: closed-out`. That reading would manufacture a fresh ownership contradiction — the exact
   defect class R5 reports. **Took the additive reading**: the reviewer owns the header and refreshes
   `Coverage:` every round; **`Status:` is named as the one exception**, unchanged for both sides.
   **Why it qualified:** additive is the ruling's literal wording (*"add"*), it is the only reading
   that does not create a new contradiction, and it changes nothing that exists today. **One clause in
   each of three places; reversible by deleting the `Status:` exception sentence.**
3. **R6 — fixed the mismatch; deliberately did NOT decide the frontier question it exposes.**
   The mechanical half is unambiguous: step 2 tested only Codex while the state it selects is defined
   as *both*. Step 2 now asks the test of **both passes**. That exposes an asymmetric branch —
   **Codex executed, the Claude reviewer did not** — which **no ADR-042 state names**. Naming a fourth
   state would trip D1's own *"re-raise only if"* condition and is the **owner's/architect's** call,
   not mine. Closed the branch **without** inventing one: *"run the relevant check yourself, then
   re-answer. Never report measurement that neither pass made."* **Why it qualified as an obvious
   winner:** the alternatives were leaving the branch undecidable (re-creating R2's defect class) or
   triggering an ADR re-raise I have no standing to trigger; the instruction asks the one actor that
   *can* execute to do so, is unreachable today, and stays inside the plan's intent (make the per-run
   rule decidable). ⚠️ **Surfaced to the driver as an open question** — if the owner would rather name
   a fourth state, this one sentence is what to replace.
4. **R1, R3 — verified `CORRECT`, in-plan, but each carries a shaping choice worth naming.**
   **R1:** the fix states ND3's placement **in** `fkit-stateful-review` Step 5 rather than adding
   another pointer, because the pointer that already exists is what failed — it reaches §Coverage
   states (definitions) and not `fkit-review` Step 4 (placement). It points at Step 4 for the format
   and worked example, so it is **not** a second copy of the definitions, which §1.2 B forbids.
   **R3:** the enumerative exclusion became a **principled** one — *"the bar is running the code, or a
   test or fixture over it … a command that only inspects the source text is reading, not measuring,
   whatever tool spells it."* This **keeps** the tightening the reviewer called load-bearing (dropping
   it would return *both reviewers measured* on nearly every run — the original defect) and now
   decides this very review's specimen (`git diff --check`, `rg`) from step 2 alone. Codex's sub-case
   (a clean pass has no finding for execution to *"bear on"*) is closed by re-basing states 1–2 and
   step 2 on *"what it reported — a finding, or a clean bill of health"*.
5. **Ledger housekeeping.** The *Accepted residuals* note said *"awaiting the owner's dispositions on
   ND-A and ND-B"*; both were ruled **fix**, so it now records that and that **no residual is owed**.
   No residual entry was added or rewritten — there were none, and nothing this round earned one.
6. **Nothing else.** No fix outside the plan, no scope widening, no severity re-grade, no frontier-move
   settled, no `--sandbox` change, no test added or removed.

### One edit landed after the measured `npm test` — stated, not glossed over

The last change of the round was a **one-sentence wording sharpen** in step 2's second ⚠️
(`fkit-review/SKILL.md:110`, *"Never report measurement that neither pass made"* → *"**Never claim both
measured when only one did.**"*), applied after the 782/782 run. **It is prose in a `SKILL.md` body
that no test reads** — `test/structure-repair.test.js` reads only `fkit-heal`'s body,
`test/skill-frontmatter.test.js` reads frontmatter only, and this file is not under `claude/scaffold/`
so neither dual-home-parity nor structure-manifest sees it. Re-ran the three suites that could
conceivably notice — `dual-home-parity` + `structure-manifest` + `skill-frontmatter` → **42 pass / 0
fail**. ⚠️ The **full** 782 figure is therefore from the run one sentence earlier, and this note is
what that costs; the mirror was re-`cp`'d and re-`diff`'d identical after the edit.

### Whose changes were in the tree during the measurement

`git status --short` at the end of this round shows modifications this task did **not** make —
`bin/release.mjs`, `test/prove-red.sh`, `test/release-summary.test.js`,
`claude/skills/fkit-task-done/SKILL.md`, several `ai-agents/` briefs and board files, and the `0188`
folder's move into `done/`. They belong to other in-flight sprint work and were dirty before this
round. **The 782/782 + hard-gate-PASSED measurement is of that whole tree**, which is the same tree
the plan's baseline and the Build step measured. This task's own change surface this round is exactly
four files under `claude/` (+ their four `.claude/` mirrors) and this task folder's `review.md` and
`worklog.md`.

---

## Process-review — Round 2 (2026-08-28)

Same sprint-loop Process-review worker, same standing approval. Plan re-verified at step 0:
`git hash-object plan.md` → `e82d6e307ddd54a20d5320e22b900f9230396f2f`, matching the driver's declared
hash on a **pointer-only, degradation-declared** carry. Owner rulings on **R12** (*"Fix in 0272"*) and
**R13** (*"Coverage line first, banner beneath"*) folded in verbatim, not re-decided.

**Disposition: 5 of 5 novel findings `CORRECT`, all defects, all fixed — plus two uncited neighbours
the ordered sweep turned up (N1, N2).** Severities re-derived; all five matched the reviewer's label,
and I did **not** inherit Codex's `high` on R11. Nothing suppressed as settled; no Round-1 row
re-raised; ADR-042 D1's *"re-raise only if"* untouched.

### What the reviewer got right that matters more than the five rows

**Step 2 decided its own Codex pass unaided**, from a fresh context with the placement hint deliberately
withheld — specimen `git diff | nl | sed`, *"succeeded in 2331ms"*, caught by *"whatever tool spells
it"*. Round 1's reviewer could only reach the answer by going **past** step 2 to the state definitions.
That is R3's principled rewrite working, measured rather than argued. **R1's placement fix also held
under the withheld-hint test.** R5, R6, R7, R8, R9, R10 re-checked by the reviewer and holding; nothing
Round 1 fixed came undone.

### The pattern, swept one hop further than the ledger

Three of five were **fix-induced neighbours** — each Round-1 fix correct at its target line, with
adjacent text left unreconciled. I swept the neighbouring paragraphs of every clause touched this
round, as instructed, and it found **two more** sites the ledger does not cite:

- **N1 — `fkit-review`'s state-3 definition** carried R11's exact defect one line out of R11's range.
  Fixed with R11's fix. **This is the strongest evidence the pattern is real**: R11's own neighbour had
  the same defect.
- **N2 — the static-analysis middle class**, taken only in the free form (four words on the
  **principle**, nothing added to the exclusion list).

**Neighbours swept and deliberately NOT changed, with the reason:**
- `fkit-stateful-review:100-105` — its degradation clause is a **pointer** to `fkit-review`'s, not a
  copy of the trigger list, so R11's fix reaches it automatically. No edit needed.
- `fkit-adversarial-review:51` — *"Fallback mode (mandatory when codex is missing, errors, times out,
  or returns nothing)"*. ⛔ **Inside a protected byte-unchanged range, and correct in its own context**:
  that skill *is* the Codex pass, so this is about the **binary** failing to run, not about classifying
  a returned pass. Different question, no contradiction. Untouched.
- `claude/agents/fkit-reviewer.md:89-93` — *"If the Codex pass **fails**, that is `Codex unavailable`"*.
  Weaker than R11's text and not a neighbour of anything I touched this round; the reviewer also
  disproved Codex's C5 against this exact passage. **Reported, not edited** — a third site would be
  scope creep. Flagged for the next round to disposition if it wants it.
- `claude/README.md:127-130` — *"the normal state today"* survives R12 unscathed: R12 corrects what the
  sandbox **blocks**, and reasoning-only remains what is *typical*. Still accurate; ND2-approved.

### Re-verification after the fixes

- **`npm test`** — see the measured block below.
- **`.claude/` parity re-proved.** Three re-edited files `cp`'d; `diff -q` on **all nine** mirrors →
  identical, zero drift.
- **`--sandbox`: no invocation moved or changed.** All four sites still `--sandbox read-only`
  (`fkit-review:62`, `adversarial-review:46`, `stateful-review:101`, `fkit-adversarial-reviewer.md:28`).
  `git diff` on `claude/` shows **no added or removed line touching an invocation** — the only two `+`
  lines naming the flag are prose: the never-infer rule and the dated note (the note being the
  sanctioned home the ruling relies on).
- **Protected ranges — three of four still show no hunk**, re-proved by `diff`, not inherited:
  `fkit-adversarial-review` `:51-72` and `:103` byte-identical (whole diff still one hunk
  `@@ -114,2 +114,6 @@`); `fkit-adversarial-reviewer.md:28-30` byte-identical (whole diff still
  `@@ -67 +67,3 @@`). **The fourth is broken by owner ruling — see decision-log item 3.**
- **Shared ledger header schema still byte-identical** across the two ledger skills after R14.

## Decision log — Process-review round 2

1. **R11, R14, R15, N1 — verified `CORRECT`, mechanical/localized, inside the approved plan.**
   Each reconciles a contradiction between two sentences the plan itself installed, in the direction the
   plan already fixed elsewhere: R11 and N1 restore `plan.md` §2's `0112` rule (*keyed to a usable pass,
   not to exit 0*) in the two places R2's fix did not reach; R14 applies the owner's **additive** ND-B
   reading to the creation case; R15 fixes a self-miscount in a sentence I wrote last round. **No
   judgment call in any.**
2. **R12 — owner-ruled, and the ruling rests on a fact I re-verified rather than relayed.**
   The note now cites `test/prove-red.sh:82` for `mktemp -d`. ⚠️ **ADR-042 cites `:59` for the same
   line** — the file has drifted since. I checked on disk this round and used the measured number.
   Flagging it because a stale line-ref inside a correction is the same class of defect this task is
   about; ADR-042 itself is **not** edited (out of scope, and not mine).
3. ⚠️ **R13 — the owner's ruling and the plan's byte-unchanged promise cannot both hold. Reported, not
   silently resolved.** `plan.md` §3 promises `fkit-review`'s `[NOT model-diverse — INCOMPLETE]` block
   (HEAD `:124-140`) stays byte-unchanged, *"provable by an empty `git diff` on those ranges"*, and the
   driver's own checklist asks me to re-confirm it. **The R13 ruling requires editing inside that
   range** — the worked layout it names (`:191-203`) sits within it. **I applied the ruling**, because
   the instruction names a live owner ruling on exactly that text and the ruling carries its own
   narrower carve-out (*"⛔ the banner's own text stays byte-unchanged"*), which is what I preserved and
   proved: **the banner's four lines and the *"This flag is load-bearing"* paragraph are byte-identical
   to `HEAD`**. What changed inside the old range: the intro sentence rewritten (it previously handed
   the slot to the banner alone) and a four-line coverage line inserted above the banner. **Net: that
   range no longer diffs empty, by owner ruling.** The driver should acknowledge this rather than read
   a failed byte-check as a defect.
4. **N1 — applied without a row.** Verified `CORRECT` by the same evidence as R11, one line outside
   R11's cited range, and inside the approved surface. **Why it qualified:** the driver's explicit
   instruction this round was to sweep neighbours rather than cited lines; leaving the identical defect
   standing one line away, having just fixed it, would be following the letter of the ledger against its
   point. Recorded here because it is a change no ledger row asked for.
5. **N2 — the one place I took less than I could have.** The reviewer offered the static-analysis class
   as *"free if free"*. Taken **only** as a four-word strengthening of the **principle**; ⛔ **nothing
   added to the exclusion list**, because lengthening the enumeration is the exact shape R3 removed.
   Reversible by deleting four words.
6. **Deliberately not settled.** `fkit-reviewer.md:89-93`'s vaguer *"fails"* — reported, not edited
   (see the sweep list). No frontier-move settled, no residual recorded, no severity re-graded, no
   `--sandbox` change, no test added or removed.

### Round 2 test results — run AFTER the final code change

```
ℹ tests 782 · suites 24 · pass 782 · fail 0 · cancelled 0 · skipped 0 · todo 0
ℹ duration_ms 88726.452625
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
[exited with code 0]
```

**Identical to the plan's baseline of 782 / 0 / 24**, and to Round 1's. No test added, removed, or
newly skipped; all 26 prove-red mutations red their **named** assertion. Unlike Round 1, **no edit
landed after this run** — the measurement covers every byte of the round.

⚠️ **What this green run does NOT prove — unchanged, and worth repeating because two rounds of green
could start to look like evidence:** nothing in this repo reads the body of any of these five files, so
`npm test` says nothing whatever about this contract. It proves only that nothing else broke. The
corrected honesty statement (V1, Round 1) stands: the only test anywhere that reads a `SKILL.md` body
is `test/structure-repair.test.js:287`, for `fkit-heal`.

**Tree note, unchanged from Round 1:** `git status --short` still shows modifications this task did not
make (`bin/release.mjs`, `test/prove-red.sh`, `test/release-summary.test.js`,
`claude/skills/fkit-task-done/SKILL.md`, various `ai-agents/` files). They belong to other in-flight
sprint work and were dirty before this round; the measurement is of that whole tree, as were the
baseline and Round 1.

---

## Process-review — Round 3 (2026-08-28) — final round

Plan re-verified at step 0: `git hash-object plan.md` → `e82d6e307ddd54a20d5320e22b900f9230396f2f`,
matching the driver's declared hash on the pointer-only carry. **Owner ruling, live via
`AskUserQuestion`: "Fix all four, then close (Recommended)"** — so this round fixes R16–R19, sweeps,
and **closes regardless of what the sweep turns up**, recording anything new here instead of opening
another round.

**Disposition: 4 of 4 novel findings `CORRECT`, all defects, all fixed — plus two more uncited
neighbours (N3, N4).** Severities re-derived; all four matched the reviewer, and I did **not** inherit
Codex's `medium` on R17 (low is right: no wrong state is produced, only a false clause inside a true
one). Nothing suppressed, no earlier row re-raised, ADR-042 D1's *"re-raise only if"* untouched.

### Two things the reviewer settled in this task's favour — recorded, no action taken

- **`claude/agents/fkit-reviewer.md:89-93` stays unedited.** My Round-2 call was upheld as a
  **frontier-move, no row**: the paragraph opens with a pointer to §Coverage states, so ND1's
  single-source rule already resolves it, and re-specifying the test there would be the drift ND1
  forbids. ⚠️ Recorded for whoever touches it later: if it is ever wanted, **delete** the vague
  *"if the Codex pass fails"* clause and leave the pointer — **never restate the test**.
- **The R13 invariant verified independently.** Banner four lines + the *"This flag is load-bearing"*
  paragraph byte-identical to `HEAD`. The superseded wider byte-unchanged promise was not reported as
  a defect, per the owner's acknowledgement. **Re-proved again this round** (below), not inherited.

### The sweep — where the last neighbours actually were

The reviewer predicted the remaining neighbours sit in **the hard-rules sections of both ledger
skills** and **the report templates**. Both predictions paid, and one went outside them:

- **Hard rules → R16.** `fkit-process-stateful-review`'s *"write only your own section"* is now an
  explicit enumeration. Its twin had been fixed in Round 2 and this one had not — the exact lockstep
  asymmetry R5 exists to prevent, which is why it is the round's only medium.
- **Templates → N3.** The `Codex unavailable` worked template asserted *"`codex exec` returned <…>"*,
  false in the branch R18 had just carved out, where `codex exec` never ran at all.
- **Outside both → N4.** `claude/README.md:129` carried R17's false wording. One word.
- **Also closed, reviewer-side:** the hole R16's claim names in passing — the reviewer's rules licensed
  *write at creation* and *refresh every round*, but **not** *add a field a pre-existing ledger lacks*.
  `fkit-stateful-review`'s ownership now licenses it. Without this, R14's guard (*"an absent field and
  a stale one are both invisible"*) had no one authorised to repair the absent case.

**Swept and deliberately NOT changed, with the reason:**
- `fkit-review`'s and `fkit-stateful-review`'s remaining hard rules — checked line by line; the
  coverage-state rule, the unavailable-reported-loudly rule and the verdict-token rule are all
  consistent with the three states as they now read. No edit.
- `fkit-stateful-review` Step 5's slot prose — points at `fkit-review` Step 4 for the format rather
  than copying the template, so R17/N3 reach it automatically. **This is ND1's single-source rule
  paying off**: one template fix, both skills correct.
- `fkit-adversarial-review:51` and the two banner texts — protected ranges, and correct in their own
  context. Untouched, as in Round 2.
- `claude/agents/fkit-reviewer.md:89-93` — upheld as a frontier-move by the reviewer (above).

### Re-verification after the fixes

- **`.claude/` parity** — three re-edited files `cp`'d; `diff -q` on **all nine** mirrors → identical,
  zero drift. `claude/README.md` has no mirror, correctly.
- **`--sandbox`: no invocation moved or changed.** All four sites still `--sandbox read-only`
  (`fkit-review:62`, `adversarial-review:46`, `stateful-review:103`, `fkit-adversarial-reviewer.md:28`).
  No added or removed diff line touches an invocation — the only two `+` lines naming the flag remain
  prose (the never-infer rule, the dated note).
- **Shared header schema still byte-identical** across both ledger skills after R16 — the R16 edit
  changed ownership prose, not the schema block. Verified by `diff` this round.
- **R13 invariant re-proved:** banner four lines (`:224-227`) and the *"This flag is load-bearing"*
  paragraph (`:230-232`) both byte-identical to `HEAD`.
- **The other three protected ranges still show no hunk:** `fkit-adversarial-review:51-72` and `:103`,
  `fkit-adversarial-reviewer.md:28-30`.

## For the producer — three items to file at close, in one place

Recorded together so they are routed once, per the owner's instruction. **None is actioned here.**

1. **`ai-agents/tasks/done/0327-…/review.md:12-14`** — *"completed, **full coverage**"* on a
   reasoning-only pass. The original recurrence, recorded in `plan.md` §0.
2. **`ai-agents/tasks/done/0188-repair-the-five-live-ownership-fact-defects/review.md:27`** —
   *"Coverage: full."* on a `--sandbox read-only` pass. Found in Round 1. ⚠️ Its folder shows in
   `git diff` for an unrelated reason — that file carries another task's 2026-08-27 Round-2 block and
   was dirty before this task began. **`Coverage: full.` is untouched at `:27`.**
3. **ADR-042's stale line reference** — it cites `test/prove-red.sh:59` for `work="$(mktemp -d)"`; the
   real line is **`:82`**, measured on disk in Round 2. The owner ruled the producer files this.

⛔ All three are **`0274`'s class / ADR-034** (a ledger closes on the work product) or an ADR edit —
outside this task, and none was touched.

## Decision log — Process-review round 3

1. **R16, R17, R18, R19 — verified `CORRECT`, mechanical/localized, inside the approved plan and the
   owner's "fix all four" ruling.** Each reconciles two sentences this task itself put into
   disagreement; none changes what any state *means* or what any run *decides*. **No judgment call.**
2. **R17 — one wording choice worth naming.** ADR-042 D1 defines state 2 with the clause *"all
   execution evidence is the Claude reviewer's"*, which R17 shows is false when **neither** pass
   measured. I did **not** delete the ADR's clause; I qualified it — *"**Any** execution evidence …
   **and there may be none**"* — so the definition stays recognisably D1's while ceasing to assert a
   falsehood. **Why it qualified:** the alternative readings were to leave a known-false clause
   standing or to drop wording the ADR supplies, and qualifying does neither. Reversible by deleting
   six words.
3. **R19 — kept both banner names rather than deleting one.** The minimal fix would have been to swap
   the wrong name for the right one. I named **both, with their owners**, because §Coverage states is
   the single source that `fkit-stateful-review` also reads, and a reviewer meeting
   `[claude-fallback — NOT model-diverse]` in the adversarial skill needs to know it is a different
   artifact rather than a contradiction. ⛔ Neither banner's literal text was touched.
4. **N3, N4 — applied without a row, under the ruling's "sweep, then close".** Both verified
   `CORRECT` by the same evidence as the findings they neighbour (R18 and R17 leg 1), both inside the
   approved surface, both one word or one clause. **Why they qualified:** the ruling explicitly
   directs the sweep and directs recording rather than re-opening; leaving an identical defect standing
   next to one just fixed is the failure this task has now corrected three rounds running.
5. **Deliberately not settled.** `fkit-reviewer.md:89-93` (upheld frontier-move, with the reviewer's
   own future-fix note recorded above); the three producer items; no residual recorded, no severity
   re-graded, no `--sandbox` change, no test added or removed.

### Round 3 test results — run AFTER the final code change, with nothing landing after it

```
ℹ tests 782 · suites 24 · pass 782 · fail 0 · cancelled 0 · skipped 0 · todo 0
ℹ duration_ms 81200.291916
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
[exited with code 0]
```

**Identical to the plan's baseline of 782 / 0 / 24**, and to Rounds 1 and 2. No test added, removed or
newly skipped; all 26 prove-red mutations red their **named** assertion. **No edit landed after this
run** — the measurement covers every byte of the round, as the driver required. (Round 1 had a
one-sentence edit land after its run and said so; Rounds 2 and 3 did not.)

⚠️ **Three green runs are still not evidence about this contract.** Nothing in this repo reads the body
of any of these five files, so `npm test` proves only that nothing else broke. The corrected honesty
statement from Round 1 stands: the only test anywhere that reads a `SKILL.md` body is
`test/structure-repair.test.js:287`, for `fkit-heal`. Building one remains `0152`/`0154`'s scope.

**Tree note, unchanged across all three rounds:** `git status --short` shows modifications this task did
not make (`bin/release.mjs`, `test/prove-red.sh`, `test/release-summary.test.js`,
`claude/skills/fkit-task-done/SKILL.md`, various `ai-agents/` files). They belong to other in-flight
sprint work and were dirty before this task began; the measurement is of that whole tree, as were the
baseline and the two earlier rounds.

## Final change surface — all three rounds

| File | Rounds | Findings |
|---|---|---|
| `claude/skills/fkit-review/SKILL.md` | 1, 2, 3 | R2 R3 R4 R6 R7 R8 R9 · R11 R12 R13 N1 N2 · R17 R18 R19 N3 |
| `claude/skills/fkit-stateful-review/SKILL.md` | 1, 2, 3 | R1 R5 R9 · R15 · R16 (reviewer-side hole) |
| `claude/skills/fkit-process-stateful-review/SKILL.md` | 1, 2, 3 | R5 · R14 · R16 |
| `claude/skills/fkit-task-ship-loop/SKILL.md` | 1 | R10 |
| `claude/README.md` | 3 | N4 |

Plus the matching `.claude/` mirrors (nine proved identical each round; `claude/README.md` has none),
and this task folder's `review.md` and `worklog.md`. **19 ledger findings and 4 uncited neighbours
dispositioned; every one `CORRECT`, every one fixed.** Nothing a round fixed was undone by a later one.
