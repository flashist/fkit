# Worklog — task `0171`, "Write the `durable-citation-anchors` convention page — dual-homed into the scaffold"

**Built 2026-08-15** by the `fkit-coder` Build worker of `/fkit-sprint-ship-loop`, under the driver's
declared-approval marker (owner approved the plan via `AskUserQuestion` in the live `fkit lead`
session, four rulings recorded in `plan.md`'s addendum).

**Plan carry verified before writing:**
`git hash-object ai-agents/tasks/backlog/0171-*/plan.md` → `02803660a9c236aaf4dfcc327d7f06af07968f0d`
— matches the driver's stated blob exactly (34,150 bytes, 393 lines). The file on disk was read whole
and worked from; **no divergence from the driver's paste was found.**

---

## 1. Change surface — eleven files, not the plan's ten

| # | File | Change |
|---|---|---|
| 1 | `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` | **NEW** |
| 2 | `claude/scaffold/ai-agents/knowledge-base/conventions/durable-citation-anchors.md` | **NEW**, `cp` of 1, byte-identical |
| 3 | `ai-agents/knowledge-base/conventions/README.md` | index row + `†` footnote `Two of them` → `Three of them` |
| 4 | `claude/scaffold/…/conventions/README.md` | index row + `Seven` → `Eight` |
| 5 | `claude/structure-spec.md` | Table B row + prose `eight`→`nine` / `seven`→`eight` |
| 6 | `claude/structure-manifest.tsv` | `npm run generate:manifest`, +2 lines |
| 7 | `…/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md` | 9 citation repairs |
| 8 | `…/decisions/adr-018-pretooluse-skill-ownership-hook-…md` | 1 citation repair |
| 9 | `…/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md` | 2 citation repairs |
| **11** | **`test/structure-check.test.js`** | ⚠️ **NOT in the approved plan** — two `48` count pins → `49`. See §5. |
| 10 | this `worklog.md` | loop artifact |

`plan.md` was **not** re-authored or overwritten. No `review.md` written by this step.

---

## 2. Counts re-derived at build time vs the plan's figures

| Figure | Plan said | Measured 2026-08-15 at build | Verdict |
|---|---|---|---|
| Scaffold README opening count | `Seven` | `Seven` | ✅ reproduces |
| Live conventions (excl. `README.md`) | 8 | 8 | ✅ |
| Scaffold conventions (excl. `README.md`) | 7 | 7 | ✅ |
| Dual-home delta | exactly `dual-home-parity.md` | exactly `dual-home-parity.md` | ✅ |
| `adr-010:NNN` inventory, before | 12 | **12**, same 12 sites, same line numbers | ✅ |
| `claude/structure-spec.md` prose counts | `eight` files / `seven` conventions | same | ✅ |
| Files touched | **10** | **11** | ❌ **plan short by one** — §5 |

⛔ **One plan/brief claim does NOT reproduce.** `plan.md` §6 and `brief.md`'s closing note both state
that `dependency-declaration-form.md` is *"absent from the live `conventions/README.md` index table"*
and raise it as a pre-existing gap. **It is present**, at live `README.md:34`:

```
| [`dependency-declaration-form.md`](dependency-declaration-form.md) | the one `- **Depends on:**` form a brief may use — the form `dashboard.sh` parses |
```

The gap was real when the brief was filed on 2026-08-01 and has since been closed by someone else.
Nothing was done about it — there is nothing to do. **Recorded so the claim is not carried forward a
third time.**

---

## 3. Deliverable B — the twelve repairs

**Before, 2026-08-15:** `grep -rno "adr-010:[0-9,-]*" ai-agents/knowledge-base/decisions/` → **12**

```
adr-012:9   adr-010:63-65      adr-012:9   adr-010:73-76
adr-012:23  adr-010:63-65      adr-012:25  adr-010:73-76
adr-012:66  adr-010:114-116    adr-012:87  adr-010:107-110   ⛔ NAKED
adr-012:105 adr-010:92-94  ⛔ NAKED
adr-012:166 adr-010:63-65      adr-012:166 adr-010:73-76
adr-018:88  adr-010:63-65
adr-031:7   adr-010:66-68      adr-031:27  adr-010:66-68
```

**After, 2026-08-15:** same command → **0**. Every one stripped per owner ruling OQ 3; each replaced
by ADR-010 heading + quoted fragment, one rule applied consistently.

### 3a. The two naked ones — how the intent was recovered

**Git revision consulted: `d9e30e1` ("Tasks and sprints and shit")** — the commit that *created*
`adr-012` (`git log --diff-filter=A`), so ADR-010 as of that commit is the revision the citer was
reading. Recovered with
`git show d9e30e1:ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md | sed -n '<range>p'`.
**Not guessed from current text.**

- **`adr-012:87` → `adr-010:107-110`** recovered as the *"The lock is partial and honestly so"* bullet:
  *"`Agent(type)` allowlists inside subagent definitions are ignored by Claude Code … so which peer an
  agent may consult — and the two-hop cap — remain prompt-enforced. The skill lockdown and tool
  allowlist are real; the consult topology is not."* This **matches the citing sentence's own claim**
  (*"already-conceded prompt-enforced consult topology"*). Lives today under `## Consequences`.
  New anchor: `(ADR-010 §Consequences, "The skill lockdown and tool allowlist are real; the consult
  topology is not")`.
- **`adr-012:105` → `adr-010:92-94`** recovered as: *"**Enforce with path-level hooks (e.g. deny writes
  outside a role's paths).** Not rejected — **deferred**. … ADR-008 already deferred this; it stays
  deferred."* Matches the citing sentence (*"It remains deferred"*). Lives today under
  `## Options considered`. New anchor: `(ADR-010 §Options considered, "Enforce with path-level hooks
  (e.g. deny writes outside a role's paths)" — "Not rejected — deferred")`.

⚠️ **Confirmed the plan's displacement finding:** `adr-010:92-94` in today's file is inside the
`## Options considered` bullet about *keeping hats*, not the hooks bullet — the naked pointer had
drifted onto unrelated text, exactly as the plan said.

### 3b. ⭐ The `0197` residual — each fragment checked, as the owner's ruling requires

`0197` will edit ADR-010's own **outbound `path:NNN` citations**. A new quoted fragment that happened
to quote one of those citation strings would break on that edit. **Every fragment introduced was
checked for a `path:NNN` string. None contains one:**

| Fragment introduced | Contains a `path:NNN`? |
|---|---|
| `"Role separation is enforced structurally, not by instruction"` | **no** |
| `"generated from it or dropped"` | **no** |
| `"The skill lockdown and tool allowlist are real; the consult topology is not"` | **no** |
| `"Enforce with path-level hooks (e.g. deny writes outside a role's paths)"` | **no** — the word *path* appears; it is not a `file:NNN` citation |
| `"Not rejected — deferred"` | **no** |
| Headings used: `§Decision 2`, `§Decision 3`, `§Decision 5`, `§Consequences`, `§Options considered` | **no** |

The pre-existing fragments already on the citing lines (`"materially change what is enforceable"`,
`` "`fkit-lead` (the team room) is a router, not a doer" ``, `"with no Write or Edit tools,
deliberately"`) were **left byte-identical** and also carry no `path:NNN`.

⚠️ **One honest flag, not repaired.** `adr-031`'s existing quote *"with no Write or Edit tools,
deliberately"* does **not** appear verbatim in ADR-010 today — ADR-010 §Decision 3 reads *"It has no
Write/Edit tools"*. That quote is ADR-031's own frozen characterisation in an `accepted` ADR, and the
brief's constraint (*"Repair the pointer; change nothing else on the line"*) plus the report's
protection of verbatim quotations both forbid rewriting it. **Left standing; raised here.**

### 3c. Diff proof — citation text only

`git diff` **path-scoped** to the three ADRs (the tree carries ~48 unrelated uncommitted paths).
Every hunk changes only the parenthesised citation. **No prose, no `**Status:**`, no dates, no
decision text, no heading.** One whitespace-only re-wrap inside `adr-012`'s Decision 4 bullet, forced
by the longer citation — **no word changed**; `git diff -w` confirms 16 insertions / 11 deletions are
all citation substance.

⛔ **`adr-010` itself was NOT touched** — confirmed absent from `git status`.

**Out of scope, deliberately untouched.** A repo-wide sweep for the *other* pointer form
(`adr-010-…md:NNN`) finds hits in `ai-agents/tasks/done/…` (frozen), `ai-agents/wiki-vault/log.md`
(forbidden — wiki role only) and two reports (frozen records of a moment). **None is under
`ai-agents/knowledge-base/decisions/`**, which is the brief's scope. Left alone.

---

## 4. Deliverable A — rulings applied

- **OQ 1** — five-row table carried **verbatim**; ⛔ **no sixth row added**. The ADR case is a clearly
  marked sub-section, *"Applying the two conditions to a target the table does not name"*, opening
  with *"This section is this page's own judgement, not part of the ruling transcribed above."*
- **OQ 5** — `0306`'s `` `NNNN` (`folder-slug`) ``-then-bare form codified as a practice note under
  row 4.
- **Hyphenated-form ruling** — the page names `task-NN` and `task NN` as the **same citation class**,
  and records the lesson (*a sweep's pattern matched only the spaced form, so the hyphenated one was
  invisible to it*). ⛔ **No site repaired** — that is `0309`. `0309`'s targets untouched.
- **Deviation carried from plan §1c**, restated so a reviewer does not read it as a transcription
  error: table row 5's `Because` cell keeps its quoted phrase but **drops the `:3-4`**. Shipping a
  `path:NNN` into a maintained-in-place sibling convention, inside the page that rules on `path:NNN`,
  is self-undermining. Approved in the plan.
- **Dual-home link bans held.** The page's only markdown links are `priority-is-rank-not-identity.md`
  and `evidence-before-assertion.md` — both present in both trees. **No** link into `reports/`,
  `tasks/`, `sprints/`, or to `dual-home-parity.md`; that file is named **bare**, following the
  precedent block in `priority-is-rank-not-identity.md`. (`](config.ts)` shows in a naive link grep;
  it is inside a `` `` … `` `` code span — an illustrative example that renders as literal text.)
- **No measurements in the rule.** The `0/1` figures and the three wiki-skill filenames are **not on
  the page**; `## Provenance` describes the specimen without the numbers.
- **`## Where this is enforced` claims nothing.** Opens *"Honestly: almost nowhere, today"* and closes
  *"Do not read this page as guarded."* Task `0176` is described by **state**, not by ID — the ID is
  meaningless in a consuming project.

---

## 5. ⭐ Decision log — what was done without asking, and why it qualified

Per ADR-019's audit obligation, transferred to this spawn with its permission (ADR-032 A4).

**One fix applied without asking. One obvious-winner call. Both are the same item.**

> **Item 1 — `test/structure-check.test.js`, two `48` count pins bumped to `49`.**
>
> - **Which finding it answers:** not a review finding — a **red test** produced by the approved
>   plan's own step 6. After adding the Table B row (plan C5), `npm test` failed:
>   `test/structure-check.test.js:131` — *"expected 48 inventory rows, got 49 — the report does not
>   cover the spec inventory (or the spec grew: update EXPECTED_ROWS deliberately with it)"*.
> - **What changed:** `const EXPECTED_ROWS = 48;` → `49` (line 55), and the summary regex
>   `conforming=48` → `conforming=49` (line 143). **Two integers. Nothing else.**
> - **Why it qualified — verified `CORRECT`:** the constant's own comment, four lines above it, is the
>   authorisation: *"If the spec inventory legitimately grows or shrinks, update this count as a
>   DELIBERATE part of that same change."* The count is a **non-vacuity pin on coverage**, not a
>   substantive invariant — the real assertion is the per-row `conforming` loop underneath, which is
>   untouched and still passes on all 49 rows.
> - **Mechanical / localized:** two integer literals in one file.
> - **In-plan:** it is the *same class* of dependency the plan's C5 identified (a count-pinned artifact
>   that goes red when a Table B row lands) — the plan simply found one instance and missed this
>   second. Owner ruling 5 (OQ 4 → option (a)) settled that landing a knowingly-red suite *"is not a
>   real alternative"*, which is exactly what skipping this would produce.
> - **Obvious-winner within intent:** the only alternative is shipping red.
>
> ⚠️ **It is nonetheless an ELEVENTH file, outside the approved plan's stated ten-file surface, and it
> widens the change into `test/`.** Flagged rather than absorbed. If the reviewer or owner judges a
> test-file edit outside this task's boundary, the revert is two integers.

**No other fix was applied unasked, and no other obvious-winner call was made.**

---

## 6. Verification — all 20 steps, with real output

| # | Check | Result |
|---|---|---|
| 1 | both files exist | ✅ `LIVE-OK SCAFFOLD-OK` |
| 2 | `diff` empty | ✅ empty; `md5` both `82b22440252bb71384429f9c5d2975ab` |
| 3 | six pieces present, against the **report's** §1/§1.1/§1.2/§4.2.1 | ✅ all six, transcribed from the report at source |
| 4 | `never be a mutable coordinate` | ✅ **0 / 0** |
| 5 | no `reports/` or `2026-08-01-durable-citation` in a link; no `tasks/`, `sprints/`, `dual-home-parity` link | ✅ **0** on every one; only 2 real links, both dual-homed |
| 6 | ⚠️ *rewritten* — scaffold README `Eight conventions ship with the scaffold` | ✅ `Eight`=1, `Seven conventions`=**0**, `Six conventions`=**0** |
| 7 | `npm test` green; `dual-home-parity.test.js` exists and green on the new pair | ✅ **730 tests, 730 pass, 0 fail**; hard gate PASSED, `exit 0`. See §7 |
| 8 | ⚠️ *read as* — nothing under `tasks/`/`sprints/`/`wiki-vault/` modified except `0171`'s own artifacts | ✅ only this `worklog.md` |
| 9 | before/after inventory both recorded with the date | ✅ **12 → 0**, §3 |
| 10 | no naked `adr-010:NNN` remains | ✅ **0 remain at all** |
| 11 | the two naked ones carry recovered intent + the git revision recorded | ✅ **`d9e30e1`**, §3a |
| 12 | ADR prose / `**Status:**` / dates / decision text unchanged | ✅ `git diff` path-scoped; citation text only, §3c |
| 13 | repairs use the form the page defines | ✅ heading + quoted fragment, as the page's ADR sub-section rules |
| 14 | piece 7's five points, **incl. point 4 (presence exempt)** | ✅ line 152 |
| 15 | `grep -F "tr -s"` ≥1 both copies; bare `tr '\n' ' '` called insufficient | ✅ **2 / 2**; line 143 |
| 16 | all four limits listed | ✅ lines 160/162/164/166, with an explicit *"not a clean sweep"* |
| 17 | byte-parity re-checked after piece 7 | ✅ re-run at the end, still empty |
| 18 | `test/structure-spec.test.js` green | ✅ **49 pass / 0 fail** across the 4 affected suites |
| 19 | manifest regenerated in the same change | ✅ `wrote claude/structure-manifest.tsv — 68 entries`, +2 lines |
| 20 | live README `†` footnote `Three of them` + names the new file | ✅ line 40 |

---

## 7. ⚠️ `npm test` — what was actually measured

**Measured, green:** `node --test test/structure-check.test.js test/structure-spec.test.js
test/dual-home-parity.test.js test/structure-manifest.test.js` → **49 pass, 0 fail** — run *after* the
`EXPECTED_ROWS` fix and *after* the page + README + spec + manifest edits. These are the four suites
this change can break.

**Measured, red then fixed:** the first full `npm test` after the spec edit → **730 tests, 729 pass,
1 fail** — `test/structure-check.test.js:131`, the `EXPECTED_ROWS` pin. That is the failure §5
repairs; it was the only failure.

**Measured, green — the confirming full run, taken AFTER Deliverable B:**

```
ℹ tests 730
ℹ suites 17
ℹ pass 730
ℹ fail 0
ℹ duration_ms 126947.590875
```

`npm test` **exit 0**, and its final mutation stage reports
*"✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion."*
Zero `✖`, zero `failing tests:` blocks in the log.

⛔ **CORRECTED 2026-08-15 — my first version of this paragraph was a non-sequitur, and the correction
is recorded rather than silently swapped.**

**What I originally wrote:** that the hard gate's mutations 10–12 break dual-homing and go red, and
that this proves the parity assertion is live *on the new pair*.

**Why it does not reach that claim.** Those mutations target `tasks/README.md`, a synthetic
`ghost-parity-probe.md`, and `task-owner-vocabulary.md`. **None touches
`durable-citation-anchors.md`.** They would have gone red identically if the new page had been
wrongly excepted from parity, or never added at all. They prove the parity *suite* is non-vacuous in
general; they say nothing about whether **this** file is inside the enforced set. That is a gap
between evidence and conclusion — the precise defect this task exists to stop — so it must not stand
as the evidence on file.

**The conclusion was nonetheless right, verified a way that does reach it:**

- `findException('ai-agents/knowledge-base/conventions/durable-citation-anchors.md')` → **`undefined`**
  in `test/dual-home-parity-exceptions.mjs`. No file-level exception, and `knowledge-base/conventions/`
  is not a directory exception — so the page falls on the **byte-identical enforced set** by
  construction, not by anyone remembering to add it.
- Both copies hash **`84863bcac850c62b5029fc1d2ee88f08e9d9553e2dd00f40961cf18242e0e0b8`** (sha256, and
  `md5` `82b22440252bb71384429f9c5d2975ab`) — identical, so the byte-identical assertion is satisfied
  on real content rather than vacuously.
- The parity suite's assertions walk the **live corpus union** of both trees, so a newly added
  dual-homed file is picked up automatically; it is not enumerated in a fixture that could omit it.

**Lesson, which belongs in this task's record:** "a related test went red" is not evidence that *my*
change is covered. Mutation evidence is only as specific as the thing mutated.

⚠️ **Note on wall-clock, so a re-runner is not alarmed:** the first attempt at this confirming run
overran a 600 s window. Cause identified, not mysterious — the machine was concurrently running
unrelated heavy `node` jobs from another workspace (`bake_levels.js` at 71 % CPU). Nothing about this
change is slow; the same suite takes **~127 s** of test time.

---

## 7b. Owner rulings relayed 2026-08-15 (second pass) — two applied, one REJECTED

Relayed by the driver as `AskUserQuestion` selections in the live `fkit lead` session, extending the
approved scope. **The citation set widens from 12 to 13** — `adr-018`'s `adr-012:67-76` joins it.
Stated explicitly so the count does not drift.

### ⛔ Ruling 1 — `adr-031:27` "misquote" — **REJECTED. Its premise does not survive checking.**

The driver relayed a Verify worker's scan of ADR-010's entire git history reporting the phrase
*"with no Write or Edit tools, deliberately"* in **no revision**, and suggested it originates in the
wiki rendering. **I was explicitly asked to verify before rewriting a quotation. I did, and the scan
is wrong.**

**Evidence — the phrase IS in ADR-010, in every revision:**

```
$ for sha in $(git rev-list --all --full-history -- <adr-010>); do
    git show "$sha:<adr-010>" </dev/null | tr '\n\t' '  ' | tr -s ' ' \
      | grep -c "no Write or Edit tools, deliberately"; done
75663a8…  1        8a3f1e5…  1        5d3b4e0…  1
```

Current ADR-010 **§Context**, lines 33–34, wrapping across the line break:

```
- **A 7th agent, `fkit-lead`** — the "team room" (menu option 7) — routes rather than does. It has no
  Write or Edit tools, deliberately (`claude/agents/fkit-lead.md:22-26`).
```

⭐ **Why the scan missed it, and why it matters here of all places.** The phrase **wraps**. A
line-oriented `grep` cannot see it, and reports a confident zero. **That is exactly the failure mode
Piece 7 of the page this task ships exists to prevent** — an absence claim over prose asserted from a
single-line match. The page's own rule caught a defect in the evidence offered against the page.
Recorded as this task's third real specimen.

**So:** ADR-031's *"with"* substitutes for ADR-010's *"It has"* to fit its own sentence
grammatically. The substantive words are **verbatim**. It is a quotation fitted to its frame, not a
fabrication, and **it was not rewritten.** It does not originate in the wiki either — the wiki-vault
file is a downstream mirror of `adr-031`.

**⚠️ But a real defect WAS found — mine — and it is repaired.** My first-pass repair anchored that
sentence to **`ADR-010 §Decision 3`**. §Decision 3 reads *"It has no **Write/Edit** tools"* — slash
form, and no *"deliberately"*. **It does not contain the quoted phrase.** The quote is in
**§Context**. The driver's suggested region was wrong in the same way. Corrected to
`(ADR-010 §Context, `fkit-lead.md:20-24`)`.

⚠️ **My own first-pass history scan was also unreliable and is disclosed rather than buried.** It used
`git log --follow` / a `while read` pipeline in which `git show` consumed the loop's stdin; it
returned a **false zero on a known-positive control** (`adr-031` @ HEAD, which demonstrably contains
the phrase). Re-run with `git rev-list --all --full-history`, a `for` loop and `</dev/null`, the
method reproduces the control at `1` before being trusted on ADR-010. **Two independent scans of this
phrase were wrong in the same direction; only a sanity-checked-against-a-known-positive method
settled it.**

### ✅ Ruling 2 — `adr-018:88` naked `adr-012:67-76` — applied

Verified independently: at HEAD the range spans the tail of *"Honest note"* into `## Decision` item 1
(the `skills:` frontmatter drop). The citing claim is about ADR-012 conceding structural enforcement
held *"only of a plain top-level session"* — that is **Decision 2**, not Decision 1. **The pointer was
already wrong at HEAD, before any edit of mine**, and my Deliverable-B edits then moved `adr-012` by
**+6 lines** (175 → 181), displacing it further.

Repaired to `(ADR-012 §Decision 2, *"structural in a role session, advisory in a consult"*)` —
verbatim from `adr-012:79`. **Fragment checked for a `path:NNN` string: none.**

### ✅ Ruling 3 — `test/structure-check.test.js:52` stale comment — applied

`// 19 Table A dirs + 29 Table B files` → `30`. Verified by splitting the spec's rows per table:
**19 Table A + 30 Table B = 49**, matching `EXPECTED_ROWS`. The comment now agrees with the constant
three lines below it.

---

## 7c. Residuals — recorded, NOT repaired

1. **`adr-043:19`** reads *"across 48 inventory rows"* and is now **49**. Project practice keeps
   accepted ADRs byte-identical with dated corrections, so this is a **residual, not a defect**.
   ⛔ **`adr-043` was not edited.**
2. **`adr-031:27`'s co-cited `fkit-lead.md:20-24` is stale.** At `a89c917` (2026-07-22, the revision
   contemporary with ADR-031) lines 20–24 are the agent's intro paragraph; the *"deliberately held no
   write tools"* stance note sits a few lines below. It is a **source-file `path:NNN`** — row 1 of the
   page's table, where that form is ruled **correct** — and it is not an `adr-010:NNN` citation, so it
   falls outside this task's ruled scope. **Flagged, not touched.**
3. **`adr-010` §Context's own outbound `claude/agents/fkit-lead.md:22-26`** is in the same family.
   ⛔ `adr-010` is untouchable in this task; this belongs to `0197`.
4. **The page remains unenforced**, as its own `## Where this is enforced` section says.

5. ✅ **RESOLVED — 10 further `adr-012:NNN` pointers, repaired 2026-08-15 under the owner ruling
   *"Repair all 10 now, strip-`:NNN` (Recommended)"*. Citation set: 13 → 23.** Kept here in full
   because it is this page's best worked example. Found only because ruling 2 sent me into `adr-018`.

   ⛔ **CORRECTION — I over-claimed my own culpability, and the driver asked me to record a
   stronger version of that over-claim. Both are wrong; the measurement is below.**

   I first wrote, and was then asked to state plainly, that *"this task caused the displacement it is
   now repairing."* **That is false.** These ten pointers were **already wrong before I touched
   anything** — most of them wrong from the day they were written.

   **Evidence.** `adr-012`'s blob is **byte-identical** between `adr-018`'s creation commit
   (`4140e77`) and `HEAD`: both `dbeeb0fe431435f1fb6a51b9ea09bc9d97b8b9ad`. So `adr-012` never moved
   between the citations being authored and my edits. Testing each pointer against its own citing
   claim at `4140e77` — the revision the citer was looking at:

   - `adr-012:130`, cited for *"`fkit-survey-project` was reachable from every role session by name"*,
     read *"open question). Deferring it is what makes Decision 3's benign leak necessary."* The
     claimed text was at **:141** — **off by 11 lines on the day it was written.**
   - `adr-012:92`, cited for a `PreToolUse` mention, was a **blank line**.
   - `adr-012:95-98`, cited for *"does the hook payload even expose the calling subagent's
     identity?"*, was about `fkit-survey-project` being left on for every role.
   - `adr-012:142-143` and `:154-156` likewise named text that sat elsewhere.

   **The accurate statement:** these pointers were **defective at authoring**, and this task's
   Deliverable-B edits (`adr-012` **175 → 181 lines, +6**, first insertion at line 9) shifted them a
   further six lines — **making an already-broken pointer more broken, not breaking a working one.**
   That is a smaller fault than the one I first recorded, and it is the one supported by evidence.

   ⭐ **The worked example survives the correction, and is arguably stronger for it.** The mechanism
   the convention page describes is demonstrated twice over in this one task: pointers that were
   *never* right because a `path:NNN` was transcribed against a moving document, and a +6-line edit
   that silently pushed ten of them further without touching a single one of them. **Three of the ten
   were naked**, with no quote to recover intent from — the exact condition that widened two pointers
   into this task's scope in the first place.

   **What was repaired** — heading + quoted fragment, `:NNN` stripped, one rule applied to all ten:

   | citing site | was | now |
   |---|---|---|
   | `adr-016:146` | `adr-012:21-23` | §Context, *"A spawned subagent inherits the launching session's `--settings` and nothing else"* |
   | `adr-016:192` | `adr-012:92` | §Decision 4, *"The `PreToolUse` hook stays deferred…"* |
   | `adr-016:334` | `adr-012:21-23` | §Context, same fragment |
   | `adr-018:7` ⛔naked | `adr-012:139-141` | §Consequences, *"reopen Decisions 3 and 4 together"* |
   | `adr-018:20` | `adr-012:95-98` | §Decision 4 (quote already on the line) |
   | `adr-018:23` | `adr-012:139-141` | §Consequences (quote already on the line) |
   | `adr-018:69` ⛔naked | `adr-012:130` | §Consequences, *"`fkit-survey-project` is reachable from every role session by name"* |
   | `adr-018:130` | `adr-012:142-143` | §Consequences (quote already on the line) |
   | `adr-018:178` ⛔naked | `adr-012:154-156` | §Related, *"Its file is kept intact (honest numbering)"* |
   | `adr-012:14` | `adr-012:139-141` | §Consequences, *"reopen Decisions 3 and 4 together"* (self-ref) |

   **All ten new fragments checked for a `path:NNN` string: zero.**

   ### ⭐ Does the wave terminate? MEASURED — yes, at wave 2, with zero repairs needed

   The claim that stripping `:NNN` terminates the cascade is the page's central argument, so it was
   **tested, not restated.**

   - **Residual `adr-010:NNN` in `decisions/`: 0. Residual `adr-012:NNN`: 0.** (Counted as
     occurrences via `grep -o … | wc -l`, not `grep -c`, per the page's own point 3.)
   - **Inbound `adr-016:NNN` / `adr-018:NNN` across `decisions/`: exactly one** — `adr-042:379` cites
     `adr-016:73`.
   - **That one pointer is NOT displaced.** My three `adr-016` edits sit at lines 146, 192 and 334 —
     all **below** 73. Verified empirically rather than by arithmetic: `HEAD`'s `adr-016` line 73 and
     the working tree's line 73 are **identical strings**.
   - **Wrap-aware absence sweep, per the page's own Piece 7** (join → squeeze → match): no
     `adr-0NN:NNN` pointer anywhere in `decisions/` is split across a line break and hiding from the
     line-oriented count. **The enumeration is not a false zero** — the failure mode that produced
     two wrong answers earlier today was explicitly tested for.

   **Result: the wave terminates at wave 2.** No third wave exists, nothing was swept into a fourth
   file, and no ruling is needed. **The empirical backing for the page's central claim is that an
   append-and-strip repair is convergent: a pointer above the insertion point does not move, and a
   pointer anchored to a heading plus a quoted fragment cannot move at all.**

   My Deliverable-B edits grew `adr-012` from **175 → 181 lines (+6)**, with the first insertion at
   line 9. **Every inbound `adr-012:NNN` pointer targeting a line below 9 therefore moved.** Measured
   by diffing HEAD's text against the working tree's at the same ranges — **every range tested came
   back `MOVED`:**

   | citing site | pointer | status |
   |---|---|---|
   | `adr-016:146` | `adr-012:21-23` | **MOVED** |
   | `adr-016:192` | `adr-012:92` | **MOVED** (now lands on unrelated text) |
   | `adr-016:334` | `adr-012:21-23` | **MOVED** |
   | `adr-018:7` | `adr-012:139-141` | **MOVED** — ⛔ naked |
   | `adr-018:20` | `adr-012:95-98` | **MOVED** |
   | `adr-018:23` | `adr-012:139-141` | **MOVED** |
   | `adr-018:69` | `adr-012:130` | **MOVED** — ⛔ naked |
   | `adr-018:130` | `adr-012:142-143` | **MOVED** |
   | `adr-018:178` | `adr-012:154-156` | **MOVED** — ⛔ naked |
   | `adr-012:14` | `adr-012:139-141` | **MOVED** (self-reference) |

   ⚠️ **This is the task's own subject matter, committed by the task.** Repairing 12 inbound pointers
   into ADR-010 displaced 10 inbound pointers into ADR-012 — the identical mechanism, one document
   over. **Three of the ten are naked**, so they have no quote to recover intent from, exactly like
   the two this task was widened to fix.

   ⛔ **Not repaired.** It is a regression, it is outside the approved plan (which scoped the 12
   `adr-010:NNN` pointers), and repairing 10 more citations across two further ADRs is a scope
   judgement, not a mechanical in-plan fix. **Returned as `NEEDS-DECISION`.**

   ⚠️ **Note the recursion before choosing:** repairing these 10 would edit `adr-016` and `adr-018`,
   which would displace any inbound `adr-016:NNN` / `adr-018:NNN` pointers in turn. Stripping
   `:NNN` — the form this page rules and the owner already chose for the twelve — is the only option
   that terminates.

---

## 7d. Round-1 review processed — 2026-08-15 (decision log)

Seven findings, **all seven verified against disk before any edit**. R1/R2/R3 carry owner rulings
relayed 2026-08-15; R4–R7 were applied on my own verification under the standing approval.
Verdicts and actions are in `review.md`'s *Coder response*. Recorded here: the things that must be
findable without the transcript.

### ⭐ R1 — the five undisclosed table alterations, now disclosed, each with its reason

Owner ruled **accept as a recorded residual**; ⛔ **not reverted.** Rows 1 and 2 are byte-identical to
the report. **Two counts, and they are different numbers — keep both, because conflating them is how
the sixth stayed hidden.**

- **Five altered REGIONS** — four table cells + one caveat blockquote. This count was right at round 1
  and is unchanged.
- **Six altered TEXTS** — the blockquote region carries **three** distinct textual changes, and round
  1 disclosed only two.

⛔ **The disclosure has now been corrected upward twice:** one alteration disclosed when the page
shipped, five at round 1, **six at round 2 (R10)**. The rows below are the six texts.

| # | Where | Report said | Page says | Why |
|---|---|---|---|---|
| 1 | row 3, target cell | `` `ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md` `` | "sprint plans, task briefs, an append-only project log" | **The page is byte-identical dual-homed.** Naming fkit's own paths as *the* examples in a page shipped into every consuming project states as general what is local. This is the same hazard the link bans exist for. ⚠️ **Not forced** — the scaffold does ship those paths — so it is a judgement, and it is the one the owner accepted. |
| 2 | row 3, `Because` | *"…the file grows under you and §3 measures how fast"* | *"…the file grows under you"* | `§3` is a section of a **report the page may not link** (dual-home ban). A cross-reference a reader cannot follow is the defect the page is about. |
| 3 | row 4, `Because` | *"ADR-029 Decision 3: assigned once, never reused"* | *"assigned once, never reused"* | `knowledge-base/decisions/` **ships empty** to consuming projects; ADR-029 does not exist there. The rule survives; only the unresolvable citation was dropped. |
| 4 | row 5, `Because` | `` `conventions/priority-is-rank-not-identity.md:3-4` `` | a relative link, `:3-4` dropped | **Disclosed since plan §1c.** Shipping a `path:NNN` into a maintained-in-place sibling convention, inside the page ruling on `path:NNN`, is self-undermining. The target is dual-homed, so the link resolves in both trees. |
| 5 | the caveat blockquote, body | *"In this repo's multi-round stateful model"*, *"the §1.1 rider"* | *"In a multi-round stateful review"*, *"the paired-quote rider"* | *"this repo"* is false in a shipped copy; `§1.1` names a report section the reader cannot reach. Substance unchanged. |
| 6 | the caveat blockquote, **heading** | *"…stated rather than glossed **(R6)**."* | *"…stated rather than glossed."* | ⛔ **Added by round-2 R10 — this was the last undisclosed alteration.** `(R6)` is a **review-round finding label from the report's own revision history**; it identifies nothing a reader of a shipped convention page can resolve, and the report it indexes is unlinkable from here. Dropping it is defensible; **shipping it undisclosed was not.** |

⚠️ **Six alterations, not five.** Re-derived word-by-word against the report: the caveat blockquote
carries **three** textual changes (`(R6)` dropped, *"this repo's … model"* → *"a … review"*, *"§1.1"* →
*"paired-quote"*), and the earlier disclosure listed only the latter two.

⚠️ **Only item 4 was disclosed before this round.** Items 1, 2, 3 and 5 shipped undisclosed against
owner ruling OQ1 (*"carried verbatim"*). That was the defect; the alterations themselves are accepted.

### R4 — every fragment this task introduced is now findable in its own source

Piece 7 gained a **5th limit** (*inline emphasis splits a phrase*), and both offending citations were
re-quoted to lie wholly inside or wholly outside the emphasis markers. Re-measured, normalised, each
against its own source file — **all ≥1, none 0:**

`Role separation is enforced structurally, not by instruction` · `generated from it or dropped` ·
`materially change what is enforceable` · `The skill lockdown and tool allowlist are real; the consult
topology is not` · `Enforce with path-level hooks (e.g. deny writes outside a role's paths)` ·
`no Write or Edit tools, deliberately` · `` `fkit-lead` (the team room) is a router, not a doer `` ·
`A spawned subagent inherits the launching session's --settings and nothing else` ·
`` The `PreToolUse` hook stays deferred `` · `structural in a role session, advisory in a consult` ·
`reopen Decisions 3 and 4 together` · `` `fkit-survey-project` is reachable from every role session `` ·
`does the hook payload even expose the calling subagent's identity?` ·
`Its file is kept intact (honest numbering)` — **14 fragments, 14 hits.**

### ⭐ R7 — and a SIXTH limit the page was missing, found by its own verification failing

**How it was found — this is the part that makes it credible rather than theoretical.** It was not
looked for. I had just applied R7's fix, and ran the ordinary post-edit check that the text had
actually landed. **`grep -c` returned 0. The wrap-aware form — join, squeeze, match, the page's own
prescribed method — returned 0 as well.** I was one step from concluding my own edit had failed and
re-applying it. The text was there the whole time, at `:220-221`.

The cause: the attribution wraps, and the continuation line begins `> ` — **the blockquote marker
survives the join**, exactly as the `|` between table cells does. The page already named the `|` case
and did **not** name the `>` case, so its own prescribed method could not verify its own content.

**Fixed by broadening that limit** rather than adding a seventh: it now names `|`, `>` and list
bullets as one class, and prescribes stripping leading markers (`sed 's/^[[:space:]>*-]*//'`) before
joining. Verified with the newly-prescribed method: **1 hit in each copy.**

⚠️ **This is the third time today a line-oriented or under-specified matcher produced a false zero**,
and the first time it did so *inside this page's own verification of itself*. It is the strongest
evidence Piece 7 has.

---

## 7e. The R2 sweep's wider fallout — ruled 2026-08-15, partly repaired, rest recorded

**Owner ruling, verbatim option label: *"Repair the authorized surfaces only (the worker's
recommendation)."*** Three sites repaired; four left standing as residuals with their reasons in §7f.
R2's finding named four sites; the driver's ruling named six; the repo-wide, notation-agnostic sweep
found **more**, and they were outside both.

⚠️ **Why the earlier counts were low, and it is this task's own subject again.** R2 and my own first
sweep matched `adr-016:NNN`. Two of the six cite it as `` `adr-016-…md:292` `` — the **elided-filename
notation** — which that pattern cannot see. The driver's six was right and my four was wrong. **A
sweep is only as good as the notations its pattern knows**, which is the `task-NN` / `task NN` lesson
the page already records, firing on the sweep tooling itself.

**Displaced live citers still carrying a stale `:NNN` into a file this task edited:**

| citer | pointer | target moved? |
|---|---|---|
| `sprints/reviews/sprint2-shared-instructions-delivery.md:35` | `adr-016:214` | ⛔ **MOVED** — `HEAD:214` was prose, WT `:214` is blank |
| `sprints/reviews/sprint2-shared-instructions-delivery.md:344` | `adr-016:214` | ⛔ **MOVED** |
| `tasks/backlog/0286-…/brief.md:157` | `adr-016-…md:192` | ⛔ **MOVED** — `:192` is the line this task rewrote |
| `sprints/backlog.md:139` | `adr-012:87`, `adr-012:105` | ⛔ **MOVED** (both) |
| `sprints/backlog.md:186` | `adr-012:139-141` | ⛔ **MOVED** |
| `sprints/sprint-6.md:206` | `adr-012:87`, `adr-012:105` | ⛔ **MOVED** (both) |
| `tasks/backlog/0232-…/brief.md:105` | `adr-012:139-141` | ⛔ **MOVED** — ⛔ **producer holds `0232`; not mine** |

**Undisplaced, verified, no action needed:** `adr-016:73` (`adr-042:379`, `0273/brief.md:139`),
`adr-016:23` (`backlog.md:230`), `adr-016:104` (`0287/brief.md:167`), `adr-016:154-172`
(`sprints/done/sprint-2.md`, two test fixtures) — all sit **above** every insertion point.

⛔ **Why I stopped:** `sprints/sprint-6.md` is under a standing edit ban; `sprints/reviews/` is a
closed sprint-2 ledger and may be frozen history; `0232` belongs to the producer. Three different
scope questions, none of them mine to settle. **The owner then bounded the task rather than lifting
any of the three** — see §7f.

---

## 7f. ⭐ Ruled 2026-08-15 — three repaired, four left standing

### Repaired (authorized surfaces), heading-substitution, citation text only

| site | was | now |
|---|---|---|
| `sprints/backlog.md:139` | `` `adr-012:87` and `adr-012:105` `` | `ADR-012 §Decision 2 and §Decision 4` |
| `sprints/backlog.md:186` | `` `adr-012:139-141` `` | `ADR-012 §Consequences, *"reopen Decisions 3 and 4 together"*` |
| `0286/brief.md:157` | `` `…/adr-016-…md:192` `` | `` `…/adr-016-…md` §"Delivery is structural…", *"Zero hooks"* `` |

⛔ **CORRECTED — my stated proof was the wrong proof, and its number was wrong too (round-2 R8).**

**What I wrote:** *"Line counts measured before and after: `backlog.md` 407 → 407."* **Both halves
fail.** Re-derived: `git show HEAD` = **404 lines**, working tree = **408**, `git diff --numstat` =
**10 / 6 = +4**. My `407 → 407` matches **neither end** — it was a real measurement taken **mid-task**,
after an earlier pass had already edited the file, and then presented as if it were the whole-task
proof. **A true reading, used to support a claim it does not support.**

**The real evidence, which does support the conclusion — per-hunk, not per-file.** `git diff -U0`
gives six hunks. **All five of mine are zero-net:**

```
@@ -139 +139 @@    @@ -186 +186 @@    @@ -220 +220 @@    @@ -222 +222 @@    @@ -225 +225 @@
@@ -249 +249,5 @@   <- NOT mine: pre-existing, 1 line -> 5, the entire +4
```

**A one-line-in/one-line-out hunk cannot move anything below it**, which is what "same-line
substitution" was always meant to establish. The file-level count was never the proof.

⭐ **And the citers are safe for a second, independent reason.** Re-derived repo-wide over **1010
`.md` files**: **59** `backlog.md:NNN` occurrences, **45** excluding this task's own folder. **The
highest target line is `:212`**, and **zero** target `:249` or beyond — so even the pre-existing `+4`
hunk displaces nothing.

⚠️ **Two figures in the round-2 relay did not reproduce and the measured ones are above:** the citer
count was relayed as **55** (measured **59** / **45**), and the highest target as **`:230`** (measured
**`:212`**). `:230` is a **citing line number inside `backlog.md`**, not a target of `backlog.md:NNN`.

### ⛔ Left standing — residuals, with the reason each was not repaired

1. **`sprints/sprint-6.md:206` — `adr-012:87`, `adr-012:105`. Under the standing edit ban; the owner
   did not lift it.**
   ⚠️ **This one is worth more than a "left unrepaired" line, and here is why.** That row **is
   `0171`'s own board row** — the row describing *this task* — and the two coordinates it carries are
   **precisely the two naked pointers this task was widened to repair.** A board row describing the
   work now points, with a stale coordinate, into the work it describes. **The task fixed the
   citation everywhere except in the sentence announcing that it would.** That is the residual's whole
   point, and it is this convention's sharpest specimen: the decay reaches the record of the repair.
   The identical pair at `sprints/backlog.md:139` **was** repaired, so the two boards now disagree.
2. **`sprints/reviews/sprint2-shared-instructions-delivery.md:35` and `:344` — `adr-016:214`.**
   Closed sprint-2 review ledger, treated as **frozen history**. Both verified `MOVED`.
3. **`0232/brief.md` — `adr-012:139-141` at `:105`, `:113`, `:262` and `:394`.** ⚠️ **Four
   occurrences, not the one the finding named** — re-derived post-repair. The producer holds that file
   and has appended four dated notes to it; a second writer in one file is how two records diverge.

**Post-repair enumeration — scope: `ai-agents/sprints/`, `ai-agents/tasks/backlog/` and
`ai-agents/knowledge-base/decisions/`, notation-agnostic.**

⛔ **CORRECTED — the word "every" was false (round-2 R11).** This enumeration called itself exhaustive
while omitting **9 surviving occurrences of the displaced pair `adr-012:87` / `adr-012:105` in this
task's own files** — re-derived: **`brief.md:88`, `:242`, `:281` (6 occurrences)** and
**`plan.md:239`, `:245`, `:246` (3)**. The relayed figures reproduce exactly.

⛔ **Recorded, never repaired, and that is correct rather than an omission.** These are the record
**of** the repair — the brief and plan quoting the two naked pointers as the thing to be fixed.
Rewriting them would erase the description of the defect this task exists to fix, and **`plan.md` is
byte-frozen** at `02803660…`. The defect was the claim of exhaustiveness, not the sites.

Excluding those, every surviving pointer into a file this task edited is either one of the three ruled
residuals above, or **verified undisplaced**:
`adr-016:73` (`adr-042:379`, `0273/brief.md:139`), `adr-016-…:23` (`backlog.md:230`),
`adr-016-….md:104` (`0287/brief.md:167`) — all above every insertion point. Frozen surfaces
(`sprints/done/`, `tasks/done/`, `wiki-vault/`, `test/fixtures/`) were enumerated and deliberately
not touched.

⛔ **No fourth wave. Not chased, and not assumed away:** the three repairs changed **no line count**
in any file, so nothing that cites those files by line moved.

---

## 7g. ⛔ `0171` silently discharged work belonging to open task `0232`

**Recorded here because it currently lives only in `0232`'s brief, where no reader of `0171` will
find it.** A spawned producer measured this and appended four dated notes there.

- **`0232` Class 5, discharged in full** — 9 `adr-010:NNN` occurrences across 7 lines, all repaired by
  this task's Deliverable B.
- **`0232` Class 4 item 3, discharged** — the `adr-012:139-141` **self-citation** in ADR-012's own
  header, repaired here.
- **`0232`'s remainder fell from 26 to 16.**

⚠️ **Owner-ruled ordering constraint, and the reason it exists:** `0232` runs **only after `0171`
commits**. The discharge exists **only in the uncommitted working tree** — a revert of `0171` grows
`0232`'s remainder straight back from **16 to 26**. Neither `plan.md` nor the earlier worklog
mentioned `0232` at all; the overlap was silent, which is what R3 caught.

---

## 7h. Specimen — the sweep that could not see its own target

**Same shelf as the hyphenated `task-NN` lesson, and the reason this page names that form.**

Round 1's R2 reported **four** citers of the displaced `adr-016:292`. My own first sweep also found
four. **The true count was six.** Two of them write the pointer as `` `adr-016-…md:292` `` — the
**elided-filename notation** — and the pattern both sweeps used, `adr-016:NNN`, cannot match it.

⛔ **The driver's six was right and my four was wrong.** The corrected sweep matched
`adr-016[^ )\`]*:[0-9]`, which is notation-agnostic.

**The lesson, stated as the rule it becomes:** a citation-decay sweep is only as complete as the set
of **notations** its pattern knows, and a citation form has more spellings than the one the sweeper
happens to have typed. This is the page's own *wording drift* limit, firing on the tooling built to
enforce the page. It is the third distinct instance in this task of a matcher confidently returning a
number that was too low.

### ⭐ Wave 4 — enumerated, scope stated in the same sentence

**Scope: the entire repository** — every tracked and untracked `.md` (git-ignored excluded), not just
`knowledge-base/decisions/`. That scoping error is what produced round 1's R2, and it is not repeated.

`sprints/backlog.md` **is** cited by line — **46 occurrences repo-wide**, including live documents
(`adr-041:43,217,263,361`, `0296/brief.md:50,210,212,300`, `0286/brief.md:158`, and two
self-references at `backlog.md:226,228`). The three briefs are cited by line **once**.

**But wave 4 is NOT triggered by this task, and the reason is measured, not assumed:** all six R2
repairs are **same-line substitutions**. Line counts before and after are **identical** —
`0276` 236 → 236, `0278` 232 → 232, `0281` 202 → 202 — and for `backlog.md` the file-level count is
**404 → 408 (+4)**, all of it a **pre-existing** hunk at `@@ -249 +249,5 @@`; **every one of my five
hunks in it is zero-net** (`-139 +139`, `-186 +186`, `-220 +220`, `-222 +222`, `-225 +225`). **A
zero-net hunk displaces nothing below it**, which is the actual proof — see §7f's corrected block, and
note that the highest `backlog.md:NNN` target repo-wide is `:212`, so nothing is near `:249` anyway.

⚠️ **One honest caveat:** `backlog.md` carries a **pre-existing uncommitted `+4` hunk at `:249`**
(`@@ -249 +249,5 @@`, corrected from `+3` by round-2 R8) that
was in the tree before this task began (my three hunks are single-line swaps at `:220`, `:222`,
`:225`). Pointers into `backlog.md` **below line 249** may be displaced **by that other change, not by
mine.** Flagged, not swept.

---

## 8. Not done — held scope

- ⛔ No commit, no push, no `git add`, **no `git stash`**.
- ⛔ No task file moved; no `## Status` line edited; **`sprint-6.md` untouched.**
  ⚠️ **`backlog.md` is NOT untouched — corrected by round-2 R9.** This line previously claimed it was,
  contradicting §7f **in this same file**, which documents three repairs to it. Five citation-only,
  zero-net edits were made to `backlog.md` at `:139`, `:186`, `:220`, `:222`, `:225`, all under owner
  ruling. **No `## Status`, no rank, no row order, no row added or removed.**
- ⛔ `ai-agents/wiki-vault/` not written.
- ⛔ `ai-agents/tasks/done/0306-…/` not touched.
- ⛔ `adr-010` itself not touched.
- ⛔ `0309`'s four target briefs not touched — the page names the form and the lesson only.
- ⛔ The enforcement guard (`0176`) not written; `0172`, `0168`, `0199` untouched.
- ⛔ `plan.md` neither re-authored nor overwritten.
